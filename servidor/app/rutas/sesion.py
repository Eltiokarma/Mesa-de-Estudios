"""POST /api/login, /api/renovar, /api/salir y PUT /api/contrasena."""
from datetime import timedelta

from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel, Field
from sqlalchemy import delete, func, select, update
from sqlalchemy.orm import Session

from ..auditoria import anotar
from ..db import ahora
from ..dependencias import cfg as dep_cfg, db, ip_de, usuario_actual
from ..errores import ErrorApi
from ..modelos import Colegio, IntentoFallido, Renovacion, Usuario
from ..seguridad import hash_contrasena, hash_token, token_acceso, token_renovacion, verificar_contrasena

r = APIRouter(prefix="/api")


class Login(BaseModel):
    usuario: str = Field(max_length=80)
    contrasena: str = Field(max_length=200)


class ConRenovacion(BaseModel):
    renovacion: str = Field(max_length=200)


class CambioContrasena(BaseModel):
    actual: str = Field(max_length=200)
    nueva: str = Field(max_length=200)


def datos_usuario(s: Session, u: Usuario) -> dict:
    d = {"rol": u.rol, "nombre": u.nombre, "debe_cambiar": u.debe_cambiar, "usuario": u.usuario,
         "colegio": None}
    if u.colegio_id:
        c = s.get(Colegio, u.colegio_id)
        d["colegio"] = {"id": c.id, "nombre": c.nombre}
    if u.rol == "alumno" and u.alumno:
        sec = u.alumno.seccion
        d["alumno"] = u.alumno.seudonimo
        d["seccion"] = {"id": sec.id, "grado": sec.grado, "letra": sec.letra}
    return d


def emitir(s: Session, c, u: Usuario) -> dict:
    ren = token_renovacion()
    s.add(Renovacion(usuario_id=u.id, hash=hash_token(ren), expira=ahora() + timedelta(days=c.renovacion_dias)))
    return {"acceso": token_acceso(c, u), "renovacion": ren, "expira_en": c.acceso_minutos * 60,
            "usuario": datos_usuario(s, u)}


@r.post("/login")
def login(datos: Login, request: Request, s: Session = Depends(db), c=Depends(dep_cfg)):
    nombre, ip = datos.usuario.strip().lower(), ip_de(request)
    desde = ahora() - timedelta(minutes=c.intentos_ventana_min)
    fallos_u = s.scalar(select(func.count()).select_from(IntentoFallido).where(
        IntentoFallido.usuario == nombre, IntentoFallido.cuando >= desde))
    fallos_ip = s.scalar(select(func.count()).select_from(IntentoFallido).where(
        IntentoFallido.ip == ip, IntentoFallido.cuando >= desde))
    if fallos_u >= c.intentos_max or fallos_ip >= c.intentos_max:
        raise ErrorApi(429, "demasiados-intentos",
                       f"Hubo muchos intentos fallidos. Espera {c.intentos_ventana_min} minutos o pide ayuda a tu profesor.")
    u = s.scalar(select(Usuario).where(Usuario.usuario == nombre))
    if not verificar_contrasena(u.hash if u else None, datos.contrasena) or not u.activo:
        s.add(IntentoFallido(usuario=nombre, ip=ip))
        s.execute(delete(IntentoFallido).where(IntentoFallido.cuando < ahora() - timedelta(days=1)))
        s.commit()
        raise ErrorApi(401, "credenciales", "El usuario o la contraseña no coinciden.")
    s.execute(delete(IntentoFallido).where(IntentoFallido.usuario == nombre))
    out = emitir(s, c, u)
    s.commit()
    return out


@r.post("/renovar")
def renovar(datos: ConRenovacion, s: Session = Depends(db), c=Depends(dep_cfg)):
    fila = s.scalar(select(Renovacion).where(Renovacion.hash == hash_token(datos.renovacion)))
    if fila is None:
        raise ErrorApi(401, "renovacion-invalida", "Tu sesión terminó. Ingresa de nuevo.")
    if fila.revocada:
        # Reuso de una renovación ya usada: alguien la copió. Se cierran todas las sesiones de ese usuario.
        s.execute(update(Renovacion).where(Renovacion.usuario_id == fila.usuario_id).values(revocada=True))
        anotar(s, "reuso-renovacion", s.get(Usuario, fila.usuario_id))
        s.commit()
        raise ErrorApi(401, "renovacion-reusada", "Tu sesión se cerró por seguridad. Ingresa de nuevo.")
    u = s.get(Usuario, fila.usuario_id)
    if fila.expira < ahora() or not u or not u.activo:
        fila.revocada = True
        s.commit()
        raise ErrorApi(401, "renovacion-vencida", "Tu sesión terminó. Ingresa de nuevo.")
    # Revocación condicional: si dos peticiones usan la misma renovación a la vez, solo una gana.
    hecho = s.execute(update(Renovacion).where(Renovacion.id == fila.id, Renovacion.revocada.is_(False))
                      .values(revocada=True))
    if hecho.rowcount != 1:
        s.rollback()
        raise ErrorApi(401, "renovacion-reusada", "Tu sesión se cerró por seguridad. Ingresa de nuevo.")
    out = emitir(s, c, u)
    s.commit()
    return out


@r.post("/salir")
def salir(datos: ConRenovacion, s: Session = Depends(db)):
    s.execute(update(Renovacion).where(Renovacion.hash == hash_token(datos.renovacion)).values(revocada=True))
    s.commit()
    return {"ok": True}


@r.put("/contrasena")
def cambiar(datos: CambioContrasena, s: Session = Depends(db), u: Usuario = Depends(usuario_actual)):
    if not verificar_contrasena(u.hash, datos.actual):
        raise ErrorApi(400, "contrasena-actual", "La contraseña actual no coincide.")
    if len(datos.nueva) < 6:
        raise ErrorApi(400, "contrasena-corta", "La contraseña nueva debe tener 6 caracteres o más.")
    if datos.nueva == datos.actual:
        raise ErrorApi(400, "contrasena-igual", "La contraseña nueva debe ser distinta de la actual.")
    u.hash = hash_contrasena(datos.nueva)
    u.debe_cambiar = False
    s.commit()
    return {"ok": True, "debe_cambiar": False}
