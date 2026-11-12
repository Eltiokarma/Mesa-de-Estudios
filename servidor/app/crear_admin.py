"""Crea un colegio y su administrador, o el administrador general, y lista los colegios.

  python -m app.crear_admin --colegio "IE Juliaca" --usuario coordinador --nombre "Ana Quispe"
  python -m app.crear_admin --general --usuario gerson --nombre "Gerson"
  python -m app.crear_admin --listar

La contraseña inicial se imprime una sola vez; en el primer ingreso se pide cambiarla.
"""
import argparse
import json
import re
import sys

from sqlalchemy import select

from .config import desde_entorno
from .db import Base, crear_motor, crear_sesiones, crear_tablas
from .modelos import Colegio, Usuario
from .rutas.general import resumen_colegios
from .seguridad import contrasena_inicial, hash_contrasena


def principal(argv=None, salida=sys.stdout) -> int:
    ap = argparse.ArgumentParser(prog="python -m app.crear_admin", description=__doc__.split("\n")[0])
    ap.add_argument("--colegio", help="nombre del colegio (se crea si no existe)")
    ap.add_argument("--usuario", help="usuario del administrador")
    ap.add_argument("--nombre", help="nombre de la persona")
    ap.add_argument("--general", action="store_true", help="administrador general: todos los colegios")
    ap.add_argument("--listar", action="store_true", help="lista los colegios con sus conteos")
    a = ap.parse_args(argv)
    cfg = desde_entorno()
    cfg.validar()
    motor = crear_motor(cfg.database_url)
    crear_tablas(motor, Base)
    with crear_sesiones(motor)() as s:
        if a.listar:
            print(json.dumps(resumen_colegios(s), ensure_ascii=False, indent=2), file=salida)
            return 0
        if not a.usuario or not a.nombre or (not a.general and not a.colegio):
            ap.error("faltan --usuario y --nombre, y --colegio (o --general)")
        usuario = a.usuario.strip().lower()
        if not re.fullmatch(r"[a-z0-9._\-]{3,40}", usuario):
            ap.error("el usuario lleva de 3 a 40 letras minúsculas, números, punto o guion")
        if s.scalar(select(Usuario.id).where(Usuario.usuario == usuario)) is not None:
            print(f"Error: el usuario {usuario} ya existe.", file=sys.stderr)
            return 1
        col = None
        if not a.general:
            nombre_col = a.colegio.strip()
            col = s.scalar(select(Colegio).where(Colegio.nombre == nombre_col))
            if col is None:
                col = Colegio(nombre=nombre_col)
                s.add(col)
                s.flush()
        # Contraseña inicial más larga que la de los alumnos: estas cuentas ven nombres y DNI.
        clave = contrasena_inicial(12)
        s.add(Usuario(usuario=usuario, hash=hash_contrasena(clave), rol="general" if a.general else "admin",
                      nombre=a.nombre.strip(), debe_cambiar=True, colegio_id=col.id if col else None))
        s.commit()
        donde = "administrador general" if a.general else f"administrador de «{col.nombre}» (colegio {col.id})"
        print(f"Creado {donde}.\n  usuario:    {usuario}\n  contraseña: {clave}\n"
              "Anótala ahora: no se vuelve a mostrar. Se pide cambiarla en el primer ingreso.", file=salida)
    return 0


if __name__ == "__main__":
    sys.exit(principal())
