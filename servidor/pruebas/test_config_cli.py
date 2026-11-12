import io
import json
import re

import pytest
from fastapi.testclient import TestClient

from app import crear_admin
from app.config import Config, _url_db, desde_entorno
from app.main import crear_app


def test_cors_solo_origenes_configurados():
    c = TestClient(crear_app(Config(database_url="sqlite://", cors_origenes=["https://mesa.example"])))
    pre = lambda o: c.options("/api/login", headers={"Origin": o, "Access-Control-Request-Method": "POST",
                                                     "Access-Control-Request-Headers": "content-type"})
    assert pre("https://mesa.example").headers.get("access-control-allow-origin") == "https://mesa.example"
    assert "access-control-allow-origin" not in pre("https://malo.example").headers


def test_produccion_exige_claves():
    with pytest.raises(RuntimeError) as ex:
        crear_app(Config(entorno="produccion", database_url="sqlite://"))
    for v in ("JWT_SECRETO", "DNI_CLAVE_FERNET", "DNI_HMAC_CLAVE", "DATABASE_URL"):
        assert v in str(ex.value)
    with pytest.raises(RuntimeError):
        Config(entorno="produccion", jwt_secreto="x" * 40, dni_clave_fernet="otra", dni_hmac_clave="y" * 40,
               database_url="postgresql+psycopg://h/db", cors_origenes=["*"]).validar()
    from cryptography.fernet import Fernet
    buena = Fernet.generate_key().decode()
    Config(entorno="produccion", jwt_secreto="x" * 40, dni_clave_fernet=buena, dni_hmac_clave="y" * 40,
           database_url="postgresql+psycopg://h/db", cors_origenes=["https://mesa.example"]).validar()
    # Una clave Fernet mal formada (p. ej. salida de un generador de contraseñas) se detecta al arrancar.
    with pytest.raises(RuntimeError, match="no es una clave Fernet"):
        Config(entorno="produccion", jwt_secreto="x" * 40, dni_clave_fernet="otra", dni_hmac_clave="y" * 40,
               database_url="postgresql+psycopg://h/db", cors_origenes=["https://mesa.example"]).validar()
    # Una variable corta dice cuántos caracteres llegaron.
    with pytest.raises(RuntimeError, match="llega con 5 caracteres"):
        Config(entorno="produccion", jwt_secreto="corto", dni_clave_fernet=buena, dni_hmac_clave="y" * 40,
               database_url="postgresql+psycopg://h/db", cors_origenes=["https://mesa.example"]).validar()


def test_url_de_railway():
    assert _url_db("postgres://u:p@h:5432/d") == "postgresql+psycopg://u:p@h:5432/d"
    assert _url_db("postgresql://u:p@h/d") == "postgresql+psycopg://u:p@h/d"


def test_entorno(monkeypatch):
    monkeypatch.setenv("CORS_ORIGENES", "https://a.pe, https://b.pe/")
    monkeypatch.setenv("CONFIAR_PROXY", "1")
    c = desde_entorno()
    assert c.cors_origenes == ["https://a.pe", "https://b.pe"] and c.confiar_proxy


def test_crear_admin_y_listar(tmp_path, monkeypatch):
    url = f"sqlite:///{tmp_path / 'x.db'}"
    monkeypatch.setenv("DATABASE_URL", url)
    out = io.StringIO()
    assert crear_admin.principal(["--colegio", "IE Juliaca", "--usuario", "Coord", "--nombre", "Ana"], out) == 0
    clave = re.search(r"contraseña: (\S+)", out.getvalue()).group(1)
    assert len(clave) == 12
    assert crear_admin.principal(["--colegio", "IE Juliaca", "--usuario", "coord", "--nombre", "Ana"], io.StringIO()) == 1
    out2 = io.StringIO()
    assert crear_admin.principal(["--general", "--usuario", "gerson", "--nombre", "Gerson"], out2) == 0
    lista = io.StringIO()
    crear_admin.principal(["--listar"], lista)
    assert [c["nombre"] for c in json.loads(lista.getvalue())] == ["IE Juliaca"]
    app = crear_app(Config(database_url=url))
    c = TestClient(app)
    r = c.post("/api/login", json={"usuario": "coord", "contrasena": clave})
    assert r.status_code == 200 and r.json()["usuario"]["rol"] == "admin" and r.json()["usuario"]["debe_cambiar"]
    g = re.search(r"contraseña: (\S+)", out2.getvalue()).group(1)
    assert c.post("/api/login", json={"usuario": "gerson", "contrasena": g}).json()["usuario"]["rol"] == "general"


def test_salud():
    c = TestClient(crear_app(Config(database_url="sqlite://")))
    r = c.get("/api/salud")
    assert r.json() == {"ok": True} and r.headers["cache-control"] == "no-store"
