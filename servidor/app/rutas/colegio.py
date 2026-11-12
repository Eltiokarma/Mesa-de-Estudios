"""Administrador del colegio: lista de alumnos (CSV y PDF), profesores, eventos y lista con DNI parcial."""
import datetime as dt
import re

from fastapi import APIRouter, Depends, Request
from fastapi.responses import Response
from pydantic import BaseModel, Field
from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from ..auditoria import anotar
from ..dependencias import colegio_de, con_rol, db, ip_de
from ..errores import ErrorApi
from ..lista import ErrorCsv, decodificar, leer
from ..modelos import Alumno, Colegio, Evento, ProfesorSeccion, Seccion, Usuario
from ..seguridad import base_usuario, contrasena_inicial, hash_contrasena, seudonimo, usuario_libre
from ..tarjetas import armar

r = APIRouter(prefix="/api/colegio")
administra = con_rol("admin", "general")
MAX_CSV = 2_000_000


class NuevoProfesor(BaseModel):
    nombre: str = Field(min_length=3, max_length=160)
    usuario: str | None = Field(default=None, max_length=40)
    secciones: list[int] = []


class SeccionesProfesor(BaseModel):
    secciones: list[int]


def _colegio(s: Session, u: Usuario, colegio: int | None) -> Colegio:
    c = s.get(Colegio, colegio_de(u, colegio))
    if c is None:
        raise ErrorApi(404, "no-existe", "No encontramos ese colegio.")
    return c


def _existe(s: Session):
    return lambda nombre: s.scalar(select(Usuario.id).where(Usuario.usuario == nombre)) is not None


async def _csv(request: Request) -> bytes:
    tipo = request.headers.get("content-type", "")
    if tipo.startswith("multipart/form-data"):
        form = await request.form()
        archivo = next((v for v in form.values() if hasattr(v, "read")), None)
        if archivo is None:
            raise ErrorApi(400, "falta-archivo", "Adjunta el archivo CSV.")
        b = await archivo.read(MAX_CSV + 1)
    else:
        b = await request.body()
    if len(b) > MAX_CSV:
        raise ErrorApi(413, "muy-grande", "El archivo pasa de 2 MB.")
    return b


@r.post("/alumnos")
async def cargar_alumnos(request: Request, formato: str | None = None, colegio: int | None = None,
                         s: Session = Depends(db), u: Usuario = Depends(administra)):
    col = _colegio(s, u, colegio)
    b = await _csv(request)
    try:
        filas, errores = leer(decodificar(b))
    except ErrorCsv as e:
        raise ErrorApi(400, "csv-invalido", str(e))
    cofre, anio = request.app.state.cofre, dt.date.today().year
    secciones = {(x.grado, x.letra): x for x in s.scalars(select(Seccion).where(Seccion.colegio_id == col.id))}
    creados, actualizados = [], 0
    for f in filas:
        clave = (f["grado"], f["seccion"])
        if clave not in secciones:
            secciones[clave] = Seccion(colegio_id=col.id, grado=f["grado"], letra=f["seccion"])
            s.add(secciones[clave])
            s.flush()
        sec = secciones[clave]
        huella = cofre.huella(f["dni"])
        nombre = f"{f['nombres']} {f['apellidos']}"
        al = s.scalar(select(Alumno).where(Alumno.colegio_id == col.id, Alumno.dni_huella == huella))
        if al:
            al.apellidos, al.nombres, al.seccion_id = f["apellidos"], f["nombres"], sec.id
            al.cuenta.nombre = nombre
            actualizados += 1
            continue
        usuario = usuario_libre(base_usuario(f["nombres"], f["apellidos"], anio), _existe(s))
        clave_ini = contrasena_inicial()
        cuenta = Usuario(usuario=usuario, hash=hash_contrasena(clave_ini), rol="alumno", nombre=nombre,
                         debe_cambiar=True, colegio_id=col.id)
        s.add(cuenta)
        s.flush()
        sd = seudonimo()
        while s.scalar(select(Alumno.id).where(Alumno.seudonimo == sd)) is not None:
            sd = seudonimo()
        s.add(Alumno(seudonimo=sd, usuario_id=cuenta.id, colegio_id=col.id, seccion_id=sec.id,
                     apellidos=f["apellidos"], nombres=f["nombres"], dni_cifrado=cofre.cifrar(f["dni"]),
                     dni_huella=huella))
        s.flush()
        creados.append({"usuario": usuario, "contrasena": clave_ini, "nombre": nombre, "grado": f["grado"],
                        "seccion": f["seccion"]})
    anotar(s, "cargar-lista", u, col.id, ip_de(request), creados=len(creados), actualizados=actualizados,
           errores=len(errores))
    s.commit()
    if formato == "pdf":
        pdf = armar(creados, col.nombre, request.app.state.cfg.app_url)
        return Response(pdf, media_type="application/pdf", headers={
            "Content-Disposition": 'attachment; filename="tarjetas.pdf"', "Cache-Control": "no-store"})
    return {"creados": creados, "actualizados": actualizados, "errores": errores}


@r.get("/alumnos")
def lista_alumnos(request: Request, colegio: int | None = None, s: Session = Depends(db),
                  u: Usuario = Depends(administra)):
    col = _colegio(s, u, colegio)
    cofre = request.app.state.cofre
    out = []
    for al in s.scalars(select(Alumno).where(Alumno.colegio_id == col.id).order_by(Alumno.apellidos, Alumno.nombres)):
        out.append({"usuario": al.cuenta.usuario, "apellidos": al.apellidos, "nombres": al.nombres,
                    "grado": al.seccion.grado, "seccion": al.seccion.letra, "seccion_id": al.seccion_id,
                    "dni_final": cofre.descifrar(al.dni_cifrado)[-3:], "debe_cambiar": al.cuenta.debe_cambiar})
    return out


def _validar_secciones(s: Session, col: Colegio, ids: list[int]) -> list[int]:
    ids = sorted(set(ids))
    if ids:
        propias = set(s.scalars(select(Seccion.id).where(Seccion.colegio_id == col.id, Seccion.id.in_(ids))))
        if propias != set(ids):
            raise ErrorApi(400, "seccion-ajena", "Alguna sección no es de este colegio.")
    return ids


@r.post("/profesores")
def crear_profesor(datos: NuevoProfesor, request: Request, colegio: int | None = None, s: Session = Depends(db),
                   u: Usuario = Depends(administra)):
    col = _colegio(s, u, colegio)
    ids = _validar_secciones(s, col, datos.secciones)
    if datos.usuario:
        usuario = datos.usuario.strip().lower()
        if not re.fullmatch(r"[a-z0-9._\-]{3,40}", usuario):
            raise ErrorApi(400, "usuario-invalido", "El usuario lleva de 3 a 40 letras, números, punto o guion.")
        if _existe(s)(usuario):
            raise ErrorApi(409, "usuario-existe", "Ese usuario ya existe.")
    else:
        partes = datos.nombre.split()
        usuario = usuario_libre(base_usuario(partes[0], " ".join(partes[1:]) or partes[0], dt.date.today().year),
                                _existe(s))
    clave = contrasena_inicial()
    p = Usuario(usuario=usuario, hash=hash_contrasena(clave), rol="profesor", nombre=datos.nombre.strip(),
                debe_cambiar=True, colegio_id=col.id)
    s.add(p)
    s.flush()
    for i in ids:
        s.add(ProfesorSeccion(usuario_id=p.id, seccion_id=i))
    anotar(s, "crear-profesor", u, col.id, ip_de(request), profesor=usuario, secciones=ids)
    s.commit()
    return {"usuario": usuario, "contrasena": clave, "secciones": ids}


@r.get("/profesores")
def lista_profesores(colegio: int | None = None, s: Session = Depends(db), u: Usuario = Depends(administra)):
    col = _colegio(s, u, colegio)
    out = []
    for p in s.scalars(select(Usuario).where(Usuario.colegio_id == col.id, Usuario.rol == "profesor")
                       .order_by(Usuario.nombre)):
        ids = sorted(s.scalars(select(ProfesorSeccion.seccion_id).where(ProfesorSeccion.usuario_id == p.id)))
        out.append({"usuario": p.usuario, "nombre": p.nombre, "secciones": ids, "activo": p.activo})
    return out


@r.put("/profesores/{usuario}/secciones")
def asignar_secciones(usuario: str, datos: SeccionesProfesor, request: Request, colegio: int | None = None,
                      s: Session = Depends(db), u: Usuario = Depends(administra)):
    col = _colegio(s, u, colegio)
    p = s.scalar(select(Usuario).where(Usuario.usuario == usuario.strip().lower(), Usuario.rol == "profesor",
                                       Usuario.colegio_id == col.id))
    if p is None:
        raise ErrorApi(404, "no-existe", "No encontramos a ese profesor.")
    ids = _validar_secciones(s, col, datos.secciones)
    s.execute(delete(ProfesorSeccion).where(ProfesorSeccion.usuario_id == p.id))
    for i in ids:
        s.add(ProfesorSeccion(usuario_id=p.id, seccion_id=i))
    anotar(s, "asignar-secciones", u, col.id, ip_de(request), profesor=p.usuario, secciones=ids)
    s.commit()
    return {"usuario": p.usuario, "secciones": ids}


@r.get("/eventos")
def eventos(request: Request, colegio: int | None = None, s: Session = Depends(db), u: Usuario = Depends(administra)):
    """Arreglo JSON plano, la misma entrada que herramientas/analizar-medicion.js. Sin nombres ni DNI."""
    col = _colegio(s, u, colegio)
    datos = [e.datos for e in s.scalars(select(Evento).where(Evento.colegio_id == col.id).order_by(Evento.id))]
    anotar(s, "descargar-eventos", u, col.id, ip_de(request), eventos=len(datos))
    s.commit()
    return datos
