"""GET/PUT /api/estado y POST /api/eventos."""
import json

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from ..db import ahora
from ..dependencias import con_rol, db
from ..errores import ErrorApi
from ..modelos import EstadoAlumno, Evento, Habilitacion, Usuario
from ..union import unir

r = APIRouter(prefix="/api")
solo_alumno = con_rol("alumno")

MAX_EVENTOS = 500
MAX_EST_BYTES = 1_000_000
MAX_EVENTO_BYTES = 20_000
# Campos con datos personales que nunca se guardan en un evento.
PERSONALES = {"nombre", "nombres", "apellidos", "dni", "usuario", "contrasena", "correo", "telefono"}


class PutEstado(BaseModel):
    est: dict


class PostEventos(BaseModel):
    eventos: list


def habilitaciones(s: Session, seccion_id: int) -> dict:
    filas = s.scalars(select(Habilitacion).where(Habilitacion.seccion_id == seccion_id, Habilitacion.abierto.is_(True)))
    out = {"salida": [], "soluciones": []}
    for h in filas:
        out.setdefault(h.que, []).append(h.curso)
    return {k: sorted(v) for k, v in out.items()}


def _fila(s: Session, al) -> EstadoAlumno:
    f = s.get(EstadoAlumno, al.id)
    if f is None:
        f = EstadoAlumno(alumno_id=al.id, est={"alumno": al.seudonimo})
        s.add(f)
    return f


def _con_habilitaciones(est: dict, hab: dict) -> dict:
    return {**est, "salidaHabilitada": hab["salida"], "solucionesHabilitadas": hab["soluciones"]}


@r.get("/estado")
def ver_estado(s: Session = Depends(db), u: Usuario = Depends(solo_alumno)):
    al = u.alumno
    f = s.get(EstadoAlumno, al.id)
    hab = habilitaciones(s, al.seccion_id)
    est = dict(f.est) if f else {"alumno": al.seudonimo}
    est["alumno"] = al.seudonimo
    # JSONResponse directo: el est ya es JSON puro y así FastAPI no lo recorre entero con jsonable_encoder
    # (10 % del GIL en la prueba de carga).
    return JSONResponse({"est": _con_habilitaciones(est, hab),
                         "actualizado": f.actualizado.isoformat() + "Z" if f else None, "habilitaciones": hab})


@r.put("/estado")
def guardar_estado(datos: PutEstado, s: Session = Depends(db), u: Usuario = Depends(solo_alumno)):
    if len(json.dumps(datos.est)) > MAX_EST_BYTES:
        raise ErrorApi(413, "muy-grande", "El estado es demasiado grande.")
    al = u.alumno
    f = _fila(s, al)
    hab = habilitaciones(s, al.seccion_id)
    # Las habilitaciones las decide el profesor: no se guardan desde el cliente.
    unido = unir(f.est, datos.est, al.seudonimo)
    for k in ("salidaHabilitada", "solucionesHabilitadas"):
        unido.pop(k, None)
    f.est = unido
    f.actualizado = ahora()
    s.commit()
    return JSONResponse({"est": _con_habilitaciones(unido, hab), "actualizado": f.actualizado.isoformat() + "Z",
                         "habilitaciones": hab})


def limpiar(ev: dict, seudonimo: str) -> dict:
    out = {k: v for k, v in ev.items() if k.lower() not in PERSONALES}
    out["alumno"] = seudonimo
    return out


@r.post("/eventos")
def subir_eventos(datos: PostEventos, s: Session = Depends(db), u: Usuario = Depends(solo_alumno)):
    if len(datos.eventos) > MAX_EVENTOS:
        raise ErrorApi(413, "muchos-eventos", f"Se aceptan hasta {MAX_EVENTOS} eventos por vez.")
    al = u.alumno
    validos: dict[str, dict] = {}
    for ev in datos.eventos:
        if not isinstance(ev, dict) or not isinstance(ev.get("t"), str) or not (0 < len(ev["t"]) <= 40):
            continue
        if len(json.dumps(ev)) > MAX_EVENTO_BYTES:
            continue
        validos.setdefault(ev["t"], limpiar(ev, al.seudonimo))  # repetidos dentro del lote: el primero
    if s.bind.dialect.name == "postgresql" and validos:
        # Una sola sentencia: INSERT … ON CONFLICT DO NOTHING. Es idempotente por alumno + t aunque lleguen dos
        # envíos del mismo lote a la vez, y cuenta solo las filas que entraron.
        from sqlalchemy.dialects.postgresql import insert as pg_insert
        filas = [{"alumno": al.seudonimo, "colegio_id": al.colegio_id, "t": t, "datos": d, "recibido": ahora()}
                 for t, d in validos.items()]
        q = pg_insert(Evento).values(filas).on_conflict_do_nothing(index_elements=["alumno", "t"]).returning(Evento.id)
        n = len(s.execute(q).all())
        s.commit()
        return {"recibidos": len(datos.eventos), "nuevos": n}
    ya = set(s.scalars(select(Evento.t).where(Evento.alumno == al.seudonimo, Evento.t.in_(list(validos))))) if validos else set()
    nuevos = [Evento(alumno=al.seudonimo, colegio_id=al.colegio_id, t=t, datos=d) for t, d in validos.items() if t not in ya]
    s.add_all(nuevos)
    try:
        s.commit()
        n = len(nuevos)
    except IntegrityError:
        # Otro envío del mismo lote llegó a la vez: se insertan uno por uno y se cuentan solo los que entran.
        s.rollback()
        n = 0
        for e in nuevos:
            s.add(Evento(alumno=e.alumno, colegio_id=e.colegio_id, t=e.t, datos=e.datos))
            try:
                s.commit()
                n += 1
            except IntegrityError:
                s.rollback()
    return {"recibidos": len(datos.eventos), "nuevos": n}
