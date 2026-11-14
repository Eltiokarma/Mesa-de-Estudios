"""Secciones, avance, habilitaciones y reinicio de contraseña (profesor; también el administrador)."""
from typing import Literal

from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel, Field
from sqlalchemy import func, select, update
from sqlalchemy.orm import Session, joinedload

from ..auditoria import anotar
from ..db import ahora
from ..dependencias import alumno_permitido, con_rol, db, ip_de, seccion_permitida, secciones_visibles
from ..modelos import Alumno, EstadoAlumno, Habilitacion, Renovacion, Usuario
from ..seguridad import contrasena_inicial, hash_contrasena

r = APIRouter(prefix="/api")
docente = con_rol("profesor", "admin", "general")


class Habilitar(BaseModel):
    curso: str = Field(min_length=1, max_length=60, pattern=r"^[a-z0-9\-]+$")
    que: Literal["salida", "soluciones"]
    abierto: bool


@r.get("/secciones")
def secciones(colegio: int | None = None, s: Session = Depends(db), u: Usuario = Depends(docente)):
    out = []
    for sec in secciones_visibles(s, u, colegio):
        n = s.scalar(select(func.count()).select_from(Alumno).where(Alumno.seccion_id == sec.id))
        out.append({"id": sec.id, "grado": sec.grado, "letra": sec.letra, "alumnos": n})
    return out


def _resultado(p):
    if not isinstance(p, dict):
        return None
    return {"aciertos": p.get("aciertos"), "total": p.get("total"), "fecha": p.get("fecha")}


def _repaso(est: dict) -> dict:
    """Cola de repaso (nucleo/repaso.js): cuántas unidades tiene y cómo le fue. Sin repaso, ceros."""
    r = est.get("repaso") if isinstance(est.get("repaso"), dict) else {}
    fichas = [f for f in r.values() if isinstance(f, dict)]
    num = lambda x: x if isinstance(x, (int, float)) and not isinstance(x, bool) else 0
    ultimos = [f["ultimo"] for f in fichas if isinstance(f.get("ultimo"), str)]
    return {"unidades": len(fichas), "hechos": sum(num(f.get("hechos")) for f in fichas),
            "aciertos": sum(num(f.get("aciertos")) for f in fichas), "ultimo": max(ultimos) if ultimos else None}


def resumen_alumno(al: Alumno, est: dict) -> dict:
    pruebas = est.get("pruebas") if isinstance(est.get("pruebas"), dict) else {}
    practica = est.get("practica") if isinstance(est.get("practica"), dict) else {}
    vistas = est.get("vistas") if isinstance(est.get("vistas"), dict) else {}
    dias = est.get("dias") if isinstance(est.get("dias"), list) else []
    return {
        "usuario": al.cuenta.usuario,
        "nombre": f"{al.apellidos}, {al.nombres}",
        "dias_activos": len(set(dias)),
        "ultimo_dia": max(dias) if dias else None,
        "unidades_vistas": len(vistas),
        "modulos_practicados": sorted(k for k, v in practica.items() if isinstance(v, dict) and v.get("hechos")),
        "pruebas": {c: {"entrada": _resultado(p.get("entrada")), "salida": _resultado(p.get("salida"))}
                    for c, p in pruebas.items() if isinstance(p, dict)},
        "practica": {m: {"entrada": _resultado(p.get("entrada")), "salida": _resultado(p.get("salida"))}
                     for m, p in practica.items() if isinstance(p, dict) and (p.get("entrada") or p.get("salida"))},
        "repaso": _repaso(est),
    }


@r.get("/secciones/{seccion_id}/avance")
def avance(seccion_id: int, s: Session = Depends(db), u: Usuario = Depends(docente)):
    sec = seccion_permitida(s, u, seccion_id)
    # Una sola consulta para la sección entera (antes eran dos por alumno: el estado y la cuenta).
    filas = s.execute(select(Alumno, EstadoAlumno.est).options(joinedload(Alumno.cuenta))
                      .outerjoin(EstadoAlumno, EstadoAlumno.alumno_id == Alumno.id)
                      .where(Alumno.seccion_id == sec.id).order_by(Alumno.apellidos, Alumno.nombres))
    out = [resumen_alumno(al, est or {}) for al, est in filas]
    hab = s.scalars(select(Habilitacion).where(Habilitacion.seccion_id == sec.id))
    return {"seccion": {"id": sec.id, "grado": sec.grado, "letra": sec.letra},
            "habilitaciones": [{"curso": h.curso, "que": h.que, "abierto": h.abierto,
                                "cuando": h.cuando.isoformat() + "Z"} for h in hab],
            "alumnos": out}


@r.post("/secciones/{seccion_id}/habilitar")
def habilitar(seccion_id: int, datos: Habilitar, request: Request, s: Session = Depends(db),
              u: Usuario = Depends(docente)):
    sec = seccion_permitida(s, u, seccion_id)
    h = s.scalar(select(Habilitacion).where(Habilitacion.seccion_id == sec.id, Habilitacion.curso == datos.curso,
                                            Habilitacion.que == datos.que))
    if h is None:
        h = Habilitacion(seccion_id=sec.id, curso=datos.curso, que=datos.que)
        s.add(h)
    h.abierto, h.por, h.cuando = datos.abierto, u.id, ahora()
    anotar(s, "habilitar", u, sec.colegio_id, ip_de(request), seccion=sec.id, curso=datos.curso, que=datos.que,
           abierto=datos.abierto)
    s.commit()
    return {"seccion": sec.id, "curso": datos.curso, "que": datos.que, "abierto": datos.abierto}


@r.post("/alumnos/{usuario}/reiniciar")
def reiniciar(usuario: str, request: Request, s: Session = Depends(db), u: Usuario = Depends(docente)):
    al = alumno_permitido(s, u, usuario)
    nueva = contrasena_inicial()
    cuenta = al.cuenta
    cuenta.hash, cuenta.debe_cambiar = hash_contrasena(nueva), True
    # Se cierran sus sesiones abiertas: quien tuviera su token deja de entrar.
    s.execute(update(Renovacion).where(Renovacion.usuario_id == cuenta.id).values(revocada=True))
    anotar(s, "reiniciar-contrasena", u, al.colegio_id, ip_de(request), alumno=cuenta.usuario)
    s.commit()
    return {"usuario": cuenta.usuario, "contrasena": nueva}
