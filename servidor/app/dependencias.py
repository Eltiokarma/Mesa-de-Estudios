"""Sesión de base de datos, usuario actual y control de acceso por rol, colegio y sección."""
from fastapi import Depends, Request
from sqlalchemy import select
from sqlalchemy.orm import Session

from .errores import ErrorApi
from .modelos import Alumno, ProfesorSeccion, Seccion, Usuario
from .seguridad import leer_acceso

# Rutas que se pueden usar con la contraseña inicial (antes de cambiarla).
_PERMITIDAS_SIN_CAMBIO = {"/api/contrasena"}


def cfg(request: Request):
    return request.app.state.cfg


def db(request: Request):
    s = request.app.state.sesiones()
    try:
        yield s
    finally:
        s.close()


def ip_de(request: Request) -> str:
    if request.app.state.cfg.confiar_proxy:
        xff = request.headers.get("x-forwarded-for", "")
        if xff:
            # El borde de Railway agrega la IP que vio al final; lo de la izquierda lo puede inventar el cliente.
            return xff.split(",")[-1].strip()[:64]
    return (request.client.host if request.client else "")[:64]


def usuario_actual(request: Request, s: Session = Depends(db)) -> Usuario:
    h = request.headers.get("authorization", "")
    if not h.lower().startswith("bearer "):
        raise ErrorApi(401, "no-autorizado", "Tienes que ingresar.")
    d = leer_acceso(request.app.state.cfg, h[7:].strip())
    if not d:
        raise ErrorApi(401, "token-vencido", "Tu sesión venció. Ingresa de nuevo.")
    u = s.get(Usuario, int(d["sub"]))
    if not u or not u.activo:
        raise ErrorApi(401, "no-autorizado", "Tienes que ingresar.")
    if u.debe_cambiar and request.url.path not in _PERMITIDAS_SIN_CAMBIO:
        raise ErrorApi(403, "debe-cambiar", "Primero elige una contraseña nueva.")
    return u


def con_rol(*roles):
    def dep(u: Usuario = Depends(usuario_actual)) -> Usuario:
        if u.rol not in roles:
            raise ErrorApi(403, "prohibido", "No tienes permiso para esto.")
        return u
    return dep


def colegio_de(u: Usuario, colegio: int | None) -> int:
    """El colegio sobre el que actúa: el propio; el administrador general debe indicarlo con ?colegio=."""
    if u.rol == "general":
        if colegio is None:
            raise ErrorApi(400, "falta-colegio", "Indica el colegio con ?colegio=<id>.")
        return colegio
    return u.colegio_id


def secciones_visibles(s: Session, u: Usuario, colegio: int | None = None) -> list[Seccion]:
    q = select(Seccion)
    if u.rol == "profesor":
        q = q.join(ProfesorSeccion, ProfesorSeccion.seccion_id == Seccion.id).where(
            ProfesorSeccion.usuario_id == u.id, Seccion.colegio_id == u.colegio_id)
    elif u.rol == "admin":
        q = q.where(Seccion.colegio_id == u.colegio_id)
    elif u.rol == "general":
        if colegio is not None:
            q = q.where(Seccion.colegio_id == colegio)
    else:
        return []
    return list(s.scalars(q.order_by(Seccion.grado, Seccion.letra)))


def seccion_permitida(s: Session, u: Usuario, seccion_id: int) -> Seccion:
    sec = s.get(Seccion, seccion_id)
    ok = sec is not None and (
        u.rol == "general"
        or (u.rol == "admin" and sec.colegio_id == u.colegio_id)
        or (u.rol == "profesor" and sec.colegio_id == u.colegio_id and s.get(ProfesorSeccion, (u.id, sec.id)) is not None))
    if not ok:
        # 404 y no 403: no se confirma que exista una sección de otro colegio.
        raise ErrorApi(404, "no-existe", "No encontramos esa sección.")
    return sec


def alumno_permitido(s: Session, u: Usuario, usuario: str) -> Alumno:
    cuenta = s.scalar(select(Usuario).where(Usuario.usuario == usuario.strip().lower(), Usuario.rol == "alumno"))
    al = cuenta.alumno if cuenta else None
    if al is None:
        raise ErrorApi(404, "no-existe", "No encontramos a ese alumno.")
    seccion_permitida(s, u, al.seccion_id)  # lanza 404 si no es suyo
    return al
