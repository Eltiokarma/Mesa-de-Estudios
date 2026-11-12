"""Cada usuario ve solo lo de su colegio; el profesor, solo sus secciones."""
import pytest

from app.modelos import Evento

CSV_B = """apellidos,nombres,dni,grado,seccion
Mamani,Pedro,55555555,3,A
"""


@pytest.fixture
def dos(e):
    """Colegio 1 con secciones 3A y 4B y un profesor de 3A; colegio 2 con su admin y un alumno."""
    c1, adm1 = e.colegio("IE Uno", "admin1")
    cr1 = e.cargar(adm1).json()["creados"]
    s1 = {f"{x['grado']}{x['letra']}": x["id"] for x in e.c.get("/api/secciones", headers=e.h(adm1)).json()}
    p = e.c.post("/api/colegio/profesores", json={"nombre": "Rosa Quispe", "secciones": [s1["3A"]]},
                 headers=e.h(adm1)).json()
    tp = e.alumno_listo(p, "clave-profe")
    c2, adm2 = e.colegio("IE Dos", "admin2")
    cr2 = e.cargar(adm2, CSV_B).json()["creados"]
    s2 = e.c.get("/api/secciones", headers=e.h(adm2)).json()[0]["id"]
    return dict(c1=c1, c2=c2, adm1=adm1, adm2=adm2, tp=tp, s1=s1, s2=s2, cr1=cr1, cr2=cr2)


def test_admin_solo_ve_su_colegio(e, dos):
    d = dos
    assert [x["id"] for x in e.c.get("/api/secciones", headers=e.h(d["adm2"])).json()] == [d["s2"]]
    alumnos2 = e.c.get("/api/colegio/alumnos", headers=e.h(d["adm2"])).json()
    assert [a["usuario"] for a in alumnos2] == [d["cr2"][0]["usuario"]]
    assert e.c.get(f"/api/secciones/{d['s1']['3A']}/avance", headers=e.h(d["adm2"])).status_code == 404
    r = e.c.post(f"/api/secciones/{d['s1']['3A']}/habilitar", json={"curso": "fisica", "que": "salida", "abierto": True},
                 headers=e.h(d["adm2"]))
    assert r.status_code == 404
    assert e.c.post(f"/api/alumnos/{d['cr1'][0]['usuario']}/reiniciar", headers=e.h(d["adm2"])).status_code == 404
    # el admin no puede pedir otro colegio con ?colegio=
    r = e.c.get("/api/colegio/alumnos", params={"colegio": d["c1"]}, headers=e.h(d["adm2"]))
    assert [a["usuario"] for a in r.json()] == [d["cr2"][0]["usuario"]]


def test_profesor_de_otro_colegio_no_recibe_secciones_ajenas(e, dos):
    d = dos
    r = e.c.post("/api/colegio/profesores", json={"nombre": "Intruso", "secciones": [d["s1"]["3A"]]},
                 headers=e.h(d["adm2"]))
    assert r.status_code == 400 and r.json()["error"] == "seccion-ajena"


def test_eventos_del_colegio_aislados(e, dos):
    d = dos
    t1 = e.alumno_listo(d["cr1"][0])
    t2 = e.alumno_listo(d["cr2"][0])
    e.c.post("/api/eventos", json={"eventos": [{"t": "1", "de": "uno"}]}, headers=e.h(t1))
    e.c.post("/api/eventos", json={"eventos": [{"t": "1", "de": "dos"}]}, headers=e.h(t2))
    assert [x["de"] for x in e.c.get("/api/colegio/eventos", headers=e.h(d["adm1"])).json()] == ["uno"]
    assert [x["de"] for x in e.c.get("/api/colegio/eventos", headers=e.h(d["adm2"])).json()] == ["dos"]


def test_profesor_solo_ve_sus_secciones(e, dos):
    d = dos
    assert [x["id"] for x in e.c.get("/api/secciones", headers=e.h(d["tp"])).json()] == [d["s1"]["3A"]]
    av = e.c.get(f"/api/secciones/{d['s1']['3A']}/avance", headers=e.h(d["tp"]))
    assert av.status_code == 200 and len(av.json()["alumnos"]) == 2
    assert e.c.get(f"/api/secciones/{d['s1']['4B']}/avance", headers=e.h(d["tp"])).status_code == 404
    assert e.c.get(f"/api/secciones/{d['s2']}/avance", headers=e.h(d["tp"])).status_code == 404
    r = e.c.post(f"/api/secciones/{d['s1']['4B']}/habilitar", json={"curso": "fisica", "que": "salida", "abierto": True},
                 headers=e.h(d["tp"]))
    assert r.status_code == 404


def test_profesor_reinicia_solo_a_sus_alumnos(e, dos):
    d = dos
    de_4b = next(x for x in d["cr1"] if x["grado"] == "4")["usuario"]
    de_3a = next(x for x in d["cr1"] if x["grado"] == "3")["usuario"]
    assert e.c.post(f"/api/alumnos/{de_4b}/reiniciar", headers=e.h(d["tp"])).status_code == 404
    assert e.c.post(f"/api/alumnos/{d['cr2'][0]['usuario']}/reiniciar", headers=e.h(d["tp"])).status_code == 404
    assert e.c.post(f"/api/alumnos/{de_3a}/reiniciar", headers=e.h(d["tp"])).status_code == 200


def test_profesor_no_administra(e, dos):
    d = dos
    assert e.c.get("/api/colegio/alumnos", headers=e.h(d["tp"])).status_code == 403
    assert e.c.get("/api/colegio/eventos", headers=e.h(d["tp"])).status_code == 403
    assert e.cargar(d["tp"]).status_code == 403


def test_general_ve_todo(e, dos):
    d = dos
    e.cuenta("gerson", "general")
    tg = e.token("gerson")
    cols = e.c.get("/api/general/colegios", headers=e.h(tg)).json()
    assert [(c["nombre"], c["alumnos"], c["profesores"]) for c in cols] == [("IE Uno", 3, 1), ("IE Dos", 1, 0)]
    r = e.c.get("/api/colegio/alumnos", headers=e.h(tg))
    assert r.status_code == 400 and r.json()["error"] == "falta-colegio"
    assert len(e.c.get("/api/colegio/alumnos", params={"colegio": d["c1"]}, headers=e.h(tg)).json()) == 3
    assert e.c.get(f"/api/secciones/{d['s2']}/avance", headers=e.h(tg)).status_code == 200
    assert len(e.c.get("/api/secciones", params={"colegio": d["c2"]}, headers=e.h(tg)).json()) == 1
    assert len(e.c.get("/api/general/auditoria", headers=e.h(tg)).json()) >= 3
    assert e.c.get("/api/general/colegios", headers=e.h(d["adm1"])).status_code == 403


def test_habilitaciones_salen_en_el_estado(e, dos):
    d = dos
    al3a = next(x for x in d["cr1"] if x["grado"] == "3")
    al4b = next(x for x in d["cr1"] if x["grado"] == "4")
    t3, t4 = e.alumno_listo(al3a), e.alumno_listo(al4b)
    hab = lambda cuerpo: e.c.post(f"/api/secciones/{d['s1']['3A']}/habilitar", json=cuerpo, headers=e.h(d["tp"]))
    assert hab({"curso": "fisica", "que": "salida", "abierto": True}).status_code == 200
    assert hab({"curso": "todas", "que": "soluciones", "abierto": True}).status_code == 200
    g = e.c.get("/api/estado", headers=e.h(t3)).json()
    assert g["habilitaciones"] == {"salida": ["fisica"], "soluciones": ["todas"]}
    assert g["est"]["salidaHabilitada"] == ["fisica"] and g["est"]["solucionesHabilitadas"] == ["todas"]
    # la otra sección no se entera
    assert e.c.get("/api/estado", headers=e.h(t4)).json()["habilitaciones"] == {"salida": [], "soluciones": []}
    # cerrar
    hab({"curso": "fisica", "que": "salida", "abierto": False})
    assert e.c.get("/api/estado", headers=e.h(t3)).json()["habilitaciones"]["salida"] == []
    # PUT también las devuelve
    assert e.c.put("/api/estado", json={"est": {}}, headers=e.h(t3)).json()["habilitaciones"]["soluciones"] == ["todas"]
    # datos malos
    assert hab({"curso": "fisica", "que": "otra", "abierto": True}).status_code == 422
    assert hab({"curso": "Física!", "que": "salida", "abierto": True}).status_code == 422


def test_reinicio_obliga_a_cambiar_y_cierra_sesiones(e, dos):
    d = dos
    al = next(x for x in d["cr1"] if x["grado"] == "3")
    ren = e.login(al["usuario"], al["contrasena"]).json()["renovacion"]
    r = e.c.post(f"/api/alumnos/{al['usuario']}/reiniciar", headers=e.h(d["tp"]))
    nueva = r.json()["contrasena"]
    assert r.json()["usuario"] == al["usuario"] and len(nueva) == 6
    assert e.c.post("/api/renovar", json={"renovacion": ren}).status_code == 401
    assert e.login(al["usuario"], al["contrasena"]).status_code == 401
    assert e.login(al["usuario"], nueva).json()["usuario"]["debe_cambiar"] is True


def test_avance_por_alumno(e, dos):
    d = dos
    al = next(x for x in d["cr1"] if x["usuario"] == "qroman26")
    t = e.alumno_listo(al)
    est = {"dias": ["2026-11-10", "2026-11-12"], "vistas": {"u1": "2026-11-10", "u2": "2026-11-12"},
           "practica": {"mruv": {"hechos": 3}, "gases": {"hechos": 0}},
           "pruebas": {"fisica": {"orden": "AB", "entrada": {"aciertos": 4, "total": 10, "fecha": "2026-11-10T10:00:00Z",
                                                            "respuestas": [1, 2]}}}}
    e.c.put("/api/estado", json={"est": est}, headers=e.h(t))
    av = e.c.get(f"/api/secciones/{d['s1']['3A']}/avance", headers=e.h(d["tp"])).json()
    fila = next(x for x in av["alumnos"] if x["usuario"] == "qroman26")
    assert fila["dias_activos"] == 2 and fila["unidades_vistas"] == 2 and fila["modulos_practicados"] == ["mruv"]
    assert fila["pruebas"]["fisica"] == {"entrada": {"aciertos": 4, "total": 10, "fecha": "2026-11-10T10:00:00Z"},
                                         "salida": None}
    assert "dni" not in str(fila).lower()
