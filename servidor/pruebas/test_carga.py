"""Lo que encontró la prueba de carga (docs/carga.md)."""
from starlette.requests import Request

from app.dependencias import usuario_actual


def _peticion(e, token, ruta="/api/estado"):
    return Request({"type": "http", "method": "GET", "path": ruta, "headers": [(b"authorization", f"Bearer {token}".encode())],
                    "app": e.app, "query_string": b""})


def test_usuario_actual_devuelve_la_conexion(e):
    # FastAPI corre la dependencia y la ruta en hilos distintos: si la conexión quedara tomada entre los dos, con el
    # pool lleno el servidor se traba (lo que pasó con 1000 alumnos).
    _, adm = e.colegio()
    s = e.db()
    try:
        u = usuario_actual(_peticion(e, adm), s)
        assert u.usuario == "admin1"
        assert not s.in_transaction()
        assert u.rol == "admin" and u.alumno is None  # cargados, sin volver a la base
    finally:
        s.close()
