from datetime import timedelta

import jwt

from app.db import ahora
from app.modelos import IntentoFallido, Renovacion


def test_login_correcto_y_cuerpo(e):
    cid, _ = e.colegio()
    r = e.login("admin1")
    assert r.status_code == 200
    d = r.json()
    assert set(d) == {"acceso", "renovacion", "expira_en", "usuario"}
    assert d["expira_en"] == 15 * 60
    assert d["usuario"]["rol"] == "admin" and d["usuario"]["colegio"]["id"] == cid
    assert d["usuario"]["debe_cambiar"] is False
    pl = jwt.decode(d["acceso"], e.cfg.jwt_secreto, algorithms=["HS256"])
    assert pl["exp"] - pl["iat"] == 15 * 60


def test_login_alumno_trae_seudonimo_y_seccion(e):
    _, adm = e.colegio()
    cr = e.cargar(adm).json()["creados"][0]
    d = e.login(cr["usuario"], cr["contrasena"]).json()["usuario"]
    assert d["rol"] == "alumno" and d["debe_cambiar"] is True
    assert d["alumno"].startswith("a") and len(d["alumno"]) == 11
    assert d["seccion"]["grado"] == "3" and d["seccion"]["letra"] == "A"


def test_login_usuario_sin_mayusculas_ni_espacios(e):
    e.colegio()
    assert e.login("  ADMIN1 ").status_code == 200


def test_credenciales_malas(e):
    e.colegio()
    for u, c in (("admin1", "otra"), ("nadie", "clave-segura")):
        r = e.login(u, c)
        assert r.status_code == 401 and r.json()["error"] == "credenciales" and r.json()["mensaje"]


def test_cuenta_inactiva_no_entra(e):
    e.colegio()
    with e.db() as s:
        from app.modelos import Usuario
        u = s.query(Usuario).filter_by(usuario="admin1").one()
        u.activo = False
        s.commit()
    assert e.login("admin1").status_code == 401


def test_limite_por_usuario(e):
    e.colegio()
    for _ in range(5):
        assert e.login("admin1", "mala").status_code == 401
    r = e.login("admin1")  # aun con la contraseña buena
    assert r.status_code == 429 and r.json()["error"] == "demasiados-intentos"


def test_limite_por_ip(e):
    e.colegio()
    for i in range(5):
        assert e.login(f"inventado{i}", "x").status_code == 401
    assert e.login("admin1").status_code == 429


def test_limite_vence_a_los_10_minutos(e):
    e.colegio()
    for _ in range(5):
        e.login("admin1", "mala")
    with e.db() as s:
        for f in s.query(IntentoFallido):
            f.cuando = ahora() - timedelta(minutes=11)
        s.commit()
    assert e.login("admin1").status_code == 200


def test_cuatro_fallos_y_exito_limpia(e):
    e.colegio()
    for _ in range(4):
        e.login("admin1", "mala")
    assert e.login("admin1").status_code == 200
    with e.db() as s:
        assert s.query(IntentoFallido).filter_by(usuario="admin1").count() == 0


def test_ip_detras_del_proxy(e):
    e.cfg.confiar_proxy = True
    e.colegio()
    for _ in range(5):
        e.c.post("/api/login", json={"usuario": "x", "contrasena": "y"},
                 headers={"X-Forwarded-For": "6.6.6.6, 1.2.3.4"})
    # Otra IP real (la última del encabezado) puede entrar
    r = e.c.post("/api/login", json={"usuario": "admin1", "contrasena": "clave-segura"},
                 headers={"X-Forwarded-For": "6.6.6.6, 5.5.5.5"})
    assert r.status_code == 200
    r = e.c.post("/api/login", json={"usuario": "admin1", "contrasena": "clave-segura"},
                 headers={"X-Forwarded-For": "9.9.9.9, 1.2.3.4"})
    assert r.status_code == 429


def test_renovar_rota(e):
    e.colegio()
    d = e.login("admin1").json()
    r = e.c.post("/api/renovar", json={"renovacion": d["renovacion"]})
    assert r.status_code == 200
    d2 = r.json()
    assert d2["renovacion"] != d["renovacion"] and d2["usuario"]["rol"] == "admin"
    assert e.c.get("/api/secciones", headers=e.h(d2["acceso"])).status_code == 200
    with e.db() as s:  # solo se guarda el hash
        assert s.query(Renovacion).filter_by(hash=d2["renovacion"]).count() == 0


def test_reuso_de_renovacion_revoca_todas(e):
    e.colegio()
    otra = e.login("admin1").json()["renovacion"]  # otra sesión del mismo usuario (otro equipo)
    d = e.login("admin1").json()
    nueva = e.c.post("/api/renovar", json={"renovacion": d["renovacion"]}).json()["renovacion"]
    r = e.c.post("/api/renovar", json={"renovacion": d["renovacion"]})  # reuso
    assert r.status_code == 401 and r.json()["error"] == "renovacion-reusada"
    assert e.c.post("/api/renovar", json={"renovacion": nueva}).status_code == 401
    assert e.c.post("/api/renovar", json={"renovacion": otra}).status_code == 401


def test_renovacion_vencida(e):
    e.colegio()
    d = e.login("admin1").json()
    with e.db() as s:
        for f in s.query(Renovacion):
            f.expira = ahora() - timedelta(seconds=1)
        s.commit()
    r = e.c.post("/api/renovar", json={"renovacion": d["renovacion"]})
    assert r.status_code == 401 and r.json()["error"] == "renovacion-vencida"


def test_renovacion_dura_30_dias(e):
    e.colegio()
    e.login("admin1")
    with e.db() as s:
        f = s.query(Renovacion).order_by(Renovacion.id.desc()).first()
        assert timedelta(days=29, hours=23) < f.expira - f.creado <= timedelta(days=30, seconds=5)


def test_renovacion_inventada(e):
    assert e.c.post("/api/renovar", json={"renovacion": "inventada"}).status_code == 401


def test_salir_revoca(e):
    e.colegio()
    d = e.login("admin1").json()
    assert e.c.post("/api/salir", json={"renovacion": d["renovacion"]}).status_code == 200
    assert e.c.post("/api/renovar", json={"renovacion": d["renovacion"]}).status_code == 401


def test_acceso_vencido_o_falso(e):
    cid, _ = e.colegio()
    viejo = jwt.encode({"sub": "1", "typ": "acceso", "exp": ahora() - timedelta(minutes=1)}, e.cfg.jwt_secreto,
                       algorithm="HS256")
    falso = jwt.encode({"sub": "1", "typ": "acceso", "exp": ahora() + timedelta(minutes=5)}, "otra-clave" * 4,
                       algorithm="HS256")
    for t in (viejo, falso, "basura"):
        r = e.c.get("/api/secciones", headers=e.h(t))
        assert r.status_code == 401 and "error" in r.json()
    assert e.c.get("/api/secciones").status_code == 401


def test_cambio_de_contrasena(e):
    _, adm = e.colegio()
    cr = e.cargar(adm).json()["creados"][0]
    t = e.token(cr["usuario"], cr["contrasena"])
    # Con la contraseña inicial no se puede usar nada más
    r = e.c.get("/api/estado", headers=e.h(t))
    assert r.status_code == 403 and r.json()["error"] == "debe-cambiar"
    malo = lambda actual, nueva: e.c.put("/api/contrasena", json={"actual": actual, "nueva": nueva}, headers=e.h(t))
    assert malo("otra", "abcdefg").json()["error"] == "contrasena-actual"
    assert malo(cr["contrasena"], "abc").json()["error"] == "contrasena-corta"
    assert malo(cr["contrasena"], cr["contrasena"]).json()["error"] == "contrasena-igual"
    r = malo(cr["contrasena"], "nueva-clave")
    assert r.status_code == 200 and r.json()["debe_cambiar"] is False
    assert e.c.get("/api/estado", headers=e.h(t)).status_code == 200
    assert e.login(cr["usuario"], cr["contrasena"]).status_code == 401
    d = e.login(cr["usuario"], "nueva-clave").json()
    assert d["usuario"]["debe_cambiar"] is False


def test_errores_con_formato_del_contrato(e):
    r = e.c.post("/api/login", json={"usuario": "x"})
    assert r.status_code == 422 and set(r.json()) == {"error", "mensaje"}
    r = e.c.get("/api/no-existe")
    assert r.status_code == 404 and set(r.json()) == {"error", "mensaje"}


def test_limite_por_ip_configurable(e):
    # Un laboratorio entero sale por una sola IP: con INTENTOS_IP_MAX alto, 5 fallos de otros no bloquean a todos.
    e.cfg.intentos_ip_max = 100
    e.colegio()
    for i in range(5):
        assert e.login(f"inventado{i}", "x").status_code == 401
    assert e.login("admin1").status_code == 200


def test_login_rehace_el_hash_si_cambiaron_los_parametros(e, monkeypatch):
    from argon2 import PasswordHasher
    from app import seguridad
    from app.modelos import Usuario
    e.colegio()
    monkeypatch.setattr(seguridad, "_ph", PasswordHasher(time_cost=2, memory_cost=19456, parallelism=1))
    assert e.login("admin1").status_code == 200
    with e.db() as s:
        h = s.query(Usuario).filter_by(usuario="admin1").one().hash
    assert "m=19456,t=2,p=1" in h
    assert e.login("admin1").status_code == 200
