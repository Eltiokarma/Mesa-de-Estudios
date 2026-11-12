"""Administrador general (Gerson): todos los colegios."""
from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from ..dependencias import con_rol, db
from ..modelos import Alumno, Auditoria, Colegio, Evento, Seccion, Usuario

r = APIRouter(prefix="/api/general")
solo_general = con_rol("general")


def resumen_colegios(s: Session) -> list[dict]:
    def n(modelo, cond):
        return s.scalar(select(func.count()).select_from(modelo).where(cond))
    return [{"id": c.id, "nombre": c.nombre, "secciones": n(Seccion, Seccion.colegio_id == c.id),
             "alumnos": n(Alumno, Alumno.colegio_id == c.id),
             "profesores": n(Usuario, (Usuario.colegio_id == c.id) & (Usuario.rol == "profesor")),
             "administradores": n(Usuario, (Usuario.colegio_id == c.id) & (Usuario.rol == "admin")),
             "eventos": n(Evento, Evento.colegio_id == c.id)}
            for c in s.scalars(select(Colegio).order_by(Colegio.id))]


@r.get("/colegios")
def colegios(s: Session = Depends(db), u: Usuario = Depends(solo_general)):
    return resumen_colegios(s)


@r.get("/auditoria")
def auditoria(colegio: int | None = None, limite: int = 200, s: Session = Depends(db),
              u: Usuario = Depends(solo_general)):
    q = select(Auditoria).order_by(Auditoria.id.desc()).limit(min(max(limite, 1), 2000))
    if colegio is not None:
        q = q.where(Auditoria.colegio_id == colegio)
    return [{"id": a.id, "cuando": a.cuando.isoformat() + "Z", "accion": a.accion, "usuario_id": a.usuario_id,
             "colegio_id": a.colegio_id, "ip": a.ip, "detalle": a.detalle} for a in s.scalars(q)]
