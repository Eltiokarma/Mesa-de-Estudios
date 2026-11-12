"""Secciones, avance, habilitaciones y reinicio de contraseña (profesor; también el administrador)."""
from typing import Literal

from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel, Field
from sqlalchemy import func, select, update
from sqlalchemy.orm import Session

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
    }


@r.get("/secciones/{seccion_id}/avance")
def avance(seccion_id: int, s: Session = Depends(db), u: Usuario = Depends(docente)):
    sec = seccion_permitida(s, u, seccion_id)
    alumnos = s.scalars(select(Alumno).where(Alumno.seccion_id == sec.id).order_by(Alumno.apellidos, Alumno.nombres))
    out = []
    for al in alumnos:
        f = s.get(EstadoAlumno, al.id)
        out.append(resumen_alumno(al, f.est if f else {}))
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
