from app.modelos import Evento


def _alumno(e):
    _, adm = e.colegio()
    cr = e.cargar(adm).json()["creados"]
    return adm, cr, e.alumno_listo(cr[0])


def test_estado_inicial_y_put_unido(e):
    _, cr, t = _alumno(e)
    r = e.c.get("/api/estado", headers=e.h(t))
    assert r.status_code == 200
    d = r.json()
    assert d["actualizado"] is None and d["habilitaciones"] == {"salida": [], "soluciones": []}
    seud = d["est"]["alumno"]
    est = {"alumno": "ainventado", "uni": "unmsm", "grado": "3", "dias": ["2026-11-12"],
           "pruebas": {"fisica": {"orden": "AB", "entrada": {"aciertos": 3, "total": 10}}},
           "practica": {"m1": {"hechos": 4, "aciertos": 2}}, "vistas": {"u1": "2026-11-12"}}
    r = e.c.put("/api/estado", json={"est": est}, headers=e.h(t))
    assert r.status_code == 200 and r.json()["est"]["alumno"] == seud
    # Segundo equipo: entrada distinta y menos práctica; gana el servidor en la prueba y el máximo en la práctica
    otro = {"pruebas": {"fisica": {"orden": "BA", "entrada": {"aciertos": 9, "total": 10}}},
            "practica": {"m1": {"hechos": 1, "aciertos": 1}}, "dias": ["2026-11-13"]}
    u = e.c.put("/api/estado", json={"est": otro}, headers=e.h(t)).json()["est"]
    assert u["pruebas"]["fisica"]["entrada"]["aciertos"] == 3 and u["pruebas"]["fisica"]["orden"] == "AB"
    assert u["practica"]["m1"] == {"hechos": 4, "aciertos": 2}
    assert u["dias"] == ["2026-11-12", "2026-11-13"] and u["uni"] == "unmsm"
    g = e.c.get("/api/estado", headers=e.h(t)).json()
    assert g["est"]["pruebas"] == u["pruebas"] and g["actualizado"].endswith("Z")


def test_estado_solo_para_alumnos(e):
    _, adm = e.colegio()
    assert e.c.get("/api/estado", headers=e.h(adm)).status_code == 403


def test_habilitaciones_no_se_guardan_desde_el_cliente(e):
    _, _, t = _alumno(e)
    r = e.c.put("/api/estado", json={"est": {"salidaHabilitada": ["todas"], "solucionesHabilitadas": ["fisica"]}},
                headers=e.h(t))
    assert r.json()["est"]["salidaHabilitada"] == [] and r.json()["est"]["solucionesHabilitadas"] == []


def test_estado_demasiado_grande(e):
    _, _, t = _alumno(e)
    r = e.c.put("/api/estado", json={"est": {"x": "a" * 1_100_000}}, headers=e.h(t))
    assert r.status_code == 413


def test_eventos_idempotentes(e):
    _, _, t = _alumno(e)
    evs = [{"tipo": "prediccion", "t": f"2026-11-12T10:00:0{i}.000Z", "modulo": "mruv", "alumno": "aotro"} for i in range(3)]
    r = e.c.post("/api/eventos", json={"eventos": evs}, headers=e.h(t))
    assert r.json() == {"recibidos": 3, "nuevos": 3}
    r = e.c.post("/api/eventos", json={"eventos": evs + [{"tipo": "x", "t": "2026-11-12T11:00:00.000Z"}]}, headers=e.h(t))
    assert r.json() == {"recibidos": 4, "nuevos": 1}
    # Repetido dentro del mismo lote
    r = e.c.post("/api/eventos", json={"eventos": [{"t": "z1"}, {"t": "z1"}]}, headers=e.h(t))
    assert r.json() == {"recibidos": 2, "nuevos": 1}
    with e.db() as s:
        assert s.query(Evento).count() == 5


def test_mismo_t_de_dos_alumnos_no_choca(e):
    _, adm = e.colegio()
    cr = e.cargar(adm).json()["creados"]
    t1, t2 = e.alumno_listo(cr[0]), e.alumno_listo(cr[1])
    ev = {"eventos": [{"tipo": "x", "t": "2026-11-12T10:00:00.000Z"}]}
    assert e.c.post("/api/eventos", json=ev, headers=e.h(t1)).json()["nuevos"] == 1
    assert e.c.post("/api/eventos", json=ev, headers=e.h(t2)).json()["nuevos"] == 1


def test_eventos_sin_datos_personales_y_con_seudonimo(e):
    _, _, t = _alumno(e)
    seud = e.c.get("/api/estado", headers=e.h(t)).json()["est"]["alumno"]
    ev = {"tipo": "prueba", "t": "2026-11-12T10:00:00Z", "alumno": "afalso", "nombre": "Luz", "Nombre": "Luz",
          "dni": "12345678", "usuario": "qroman26", "apellidos": "Román", "aciertos": 3}
    e.c.post("/api/eventos", json={"eventos": [ev]}, headers=e.h(t))
    with e.db() as s:
        d = s.query(Evento).one().datos
    assert d == {"tipo": "prueba", "t": "2026-11-12T10:00:00Z", "alumno": seud, "aciertos": 3}


def test_eventos_invalidos_se_ignoran(e):
    _, _, t = _alumno(e)
    r = e.c.post("/api/eventos", json={"eventos": [1, "x", {"sin": "t"}, {"t": ""}, {"t": "ok"}]}, headers=e.h(t))
    assert r.json() == {"recibidos": 5, "nuevos": 1}


def test_maximo_500_eventos(e):
    _, _, t = _alumno(e)
    ok = e.c.post("/api/eventos", json={"eventos": [{"t": str(i)} for i in range(500)]}, headers=e.h(t))
    assert ok.json()["nuevos"] == 500
    r = e.c.post("/api/eventos", json={"eventos": [{"t": str(i)} for i in range(501)]}, headers=e.h(t))
    assert r.status_code == 413
