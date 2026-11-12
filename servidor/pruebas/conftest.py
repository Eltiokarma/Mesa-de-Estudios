import pytest
from fastapi.testclient import TestClient

from app.config import Config
from app.main import crear_app
from app.modelos import Colegio, Usuario
from app.seguridad import hash_contrasena

CSV_BASE = """apellidos,nombres,dni,grado,seccion
Román Mamani,Quispe Luz,12345678,3,A
Condori Apaza,Ana María,23456789,3,A
De la Cruz Huanca,José,34567890,4,B
"""


class Entorno:
    def __init__(self, cfg=None):
        self.cfg = cfg or Config(database_url="sqlite://")
        self.app = crear_app(self.cfg)
        self.c = TestClient(self.app)

    def db(self):
        return self.app.state.sesiones()

    def cuenta(self, usuario, rol, colegio_id=None, clave="clave-segura", debe_cambiar=False, nombre="Persona"):
        with self.db() as s:
            s.add(Usuario(usuario=usuario, hash=hash_contrasena(clave), rol=rol, nombre=nombre,
                          debe_cambiar=debe_cambiar, colegio_id=colegio_id))
            s.commit()

    def colegio(self, nombre="IE Juliaca", admin="admin1"):
        with self.db() as s:
            c = Colegio(nombre=nombre)
            s.add(c)
            s.commit()
            cid = c.id
        self.cuenta(admin, "admin", cid)
        return cid, self.token(admin)

    def login(self, usuario, clave="clave-segura"):
        return self.c.post("/api/login", json={"usuario": usuario, "contrasena": clave})

    def token(self, usuario, clave="clave-segura"):
        r = self.login(usuario, clave)
        assert r.status_code == 200, r.text
        return r.json()["acceso"]

    @staticmethod
    def h(token):
        return {"Authorization": f"Bearer {token}"}

    def cargar(self, token, texto=CSV_BASE, **params):
        return self.c.post("/api/colegio/alumnos", content=texto.encode(), params=params,
                           headers={**self.h(token), "Content-Type": "text/csv"})

    def alumno_listo(self, creado, nueva="mi-clave-nueva"):
        """Ingresa con la contraseña inicial, la cambia y devuelve un token de acceso."""
        t = self.token(creado["usuario"], creado["contrasena"])
        r = self.c.put("/api/contrasena", json={"actual": creado["contrasena"], "nueva": nueva}, headers=self.h(t))
        assert r.status_code == 200, r.text
        return t


@pytest.fixture
def e():
    return Entorno()
