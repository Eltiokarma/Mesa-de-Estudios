"""Una prueba por regla de «PUT /api/estado» en docs/cuentas.md."""
from app.union import unir

A = "a0123456789"


def test_contadores_se_quedan_con_el_maximo():
    srv = {"practica": {"m1": {"hechos": 5, "aciertos": 2, "nose": 1}}}
    cli = {"practica": {"m1": {"hechos": 3, "aciertos": 3, "nose": 0, "textos": 4}}}
    p = unir(srv, cli, A)["practica"]["m1"]
    assert (p["hechos"], p["aciertos"], p["nose"], p["textos"]) == (5, 3, 1, 4)


def test_todos_los_contadores_del_contrato():
    claves = ("hechos", "aciertos", "nose", "textos", "preguntas", "previos", "previosBien")
    srv = {"practica": {"m": {k: 10 for k in claves}}}
    cli = {"practica": {"m": {k: 20 for k in claves}}}
    assert all(unir(srv, cli, A)["practica"]["m"][k] == 20 for k in claves)
    assert all(unir(cli, srv, A)["practica"]["m"][k] == 20 for k in claves)


def test_hechos_de_lectura_se_unen():
    srv = {"practica": {"lectura-verbal": {"hechos": {"t001": 2, "t002": 1}, "textos": 3}}}
    cli = {"practica": {"lectura-verbal": {"hechos": {"t001": 1, "t003": 1}, "textos": 2}}}
    p = unir(srv, cli, A)["practica"]["lectura-verbal"]
    assert p["hechos"] == {"t001": 2, "t002": 1, "t003": 1} and p["textos"] == 3


def test_modulo_de_un_solo_lado_se_conserva():
    out = unir({"practica": {"a": {"hechos": 1}}}, {"practica": {"b": {"hechos": 2}}}, A)["practica"]
    assert out == {"a": {"hechos": 1}, "b": {"hechos": 2}}


def test_entrada_y_salida_de_practica_no_se_pisan():
    srv = {"practica": {"m": {"entrada": {"aciertos": 1, "total": 5}, "salida": None}}}
    cli = {"practica": {"m": {"entrada": {"aciertos": 5, "total": 5}, "salida": {"aciertos": 4, "total": 5}}}}
    p = unir(srv, cli, A)["practica"]["m"]
    assert p["entrada"]["aciertos"] == 1  # gana el servidor
    assert p["salida"]["aciertos"] == 4   # el servidor no tenía: entra la del cliente


def test_cliente_sin_entrada_no_borra_la_del_servidor():
    srv = {"practica": {"m": {"entrada": {"aciertos": 2}}}, "pruebas": {"fisica": {"entrada": {"aciertos": 3}}}}
    cli = {"practica": {"m": {"entrada": None, "hechos": 1}}, "pruebas": {"fisica": {}}}
    out = unir(srv, cli, A)
    assert out["practica"]["m"]["entrada"] == {"aciertos": 2}
    assert out["pruebas"]["fisica"]["entrada"] == {"aciertos": 3}


def test_pruebas_entrada_salida_y_orden_gana_el_servidor():
    srv = {"pruebas": {"fisica": {"orden": "AB", "entrada": {"forma": "A", "aciertos": 4}}}}
    cli = {"pruebas": {"fisica": {"orden": "BA", "entrada": {"forma": "B", "aciertos": 9},
                                  "salida": {"forma": "A", "aciertos": 8}}}}
    p = unir(srv, cli, A)["pruebas"]["fisica"]
    assert p["orden"] == "AB" and p["entrada"]["forma"] == "A" and p["salida"]["aciertos"] == 8


def test_orden_del_cliente_si_el_servidor_no_tiene():
    p = unir({}, {"pruebas": {"quimica": {"orden": "BA"}}}, A)["pruebas"]["quimica"]
    assert p["orden"] == "BA"


def test_en_curso_de_un_solo_lado():
    ec = {"fase": "entrada", "respuestas": [1]}
    assert unir({"pruebas": {"f": {"enCurso": ec}}}, {"pruebas": {"f": {}}}, A)["pruebas"]["f"]["enCurso"] == ec
    assert unir({"pruebas": {"f": {}}}, {"pruebas": {"f": {"enCurso": ec}}}, A)["pruebas"]["f"]["enCurso"] == ec
    assert "enCurso" not in unir({"pruebas": {"f": {}}}, {"pruebas": {"f": {}}}, A)["pruebas"]["f"]


def test_en_curso_en_los_dos_gana_el_de_mas_respuestas():
    corto = {"fase": "entrada", "respuestas": [1, 2]}
    largo = {"fase": "entrada", "respuestas": [1, 2, 3, 4]}
    assert unir({"pruebas": {"f": {"enCurso": largo}}}, {"pruebas": {"f": {"enCurso": corto}}}, A)["pruebas"]["f"]["enCurso"] == largo
    assert unir({"pruebas": {"f": {"enCurso": corto}}}, {"pruebas": {"f": {"enCurso": largo}}}, A)["pruebas"]["f"]["enCurso"] == largo


def test_en_curso_de_lectura_cuenta_resp():
    srv = {"practica": {"l": {"enCurso": {"id": "t1", "resp": [1, 2, 3]}}}}
    cli = {"practica": {"l": {"enCurso": {"id": "t1", "resp": [1]}}}}
    assert unir(srv, cli, A)["practica"]["l"]["enCurso"]["resp"] == [1, 2, 3]


def test_vistas_se_quedan_con_la_fecha_mas_antigua():
    srv = {"vistas": {"u1": "2026-11-10", "u2": "2026-11-12"}}
    cli = {"vistas": {"u1": "2026-11-11", "u2": "2026-11-01", "u3": "2026-11-12"}}
    assert unir(srv, cli, A)["vistas"] == {"u1": "2026-11-10", "u2": "2026-11-01", "u3": "2026-11-12"}


def test_dias_se_unen_sin_repetir():
    out = unir({"dias": ["2026-11-10", "2026-11-11"]}, {"dias": ["2026-11-11", "2026-11-12"]}, A)
    assert out["dias"] == ["2026-11-10", "2026-11-11", "2026-11-12"]


def test_uni_grado_tema_nombre_gana_el_cliente():
    srv = {"uni": "uni", "grado": "4", "tema": "oscuro", "nombre": "Luz"}
    cli = {"uni": "unmsm", "grado": "5", "tema": "", "nombre": "Lucecita"}
    out = unir(srv, cli, A)
    assert [out[k] for k in ("uni", "grado", "tema", "nombre")] == ["unmsm", "5", "", "Lucecita"]


def test_si_el_cliente_no_los_trae_se_conservan():
    out = unir({"uni": "uni", "grado": "4"}, {}, A)
    assert out["uni"] == "uni" and out["grado"] == "4"


def test_alumno_lo_pone_el_servidor():
    assert unir({"alumno": "aviejo"}, {"alumno": "ainventado"}, A)["alumno"] == A
    assert unir(None, None, A)["alumno"] == A


def test_no_modifica_las_entradas():
    srv = {"practica": {"m": {"hechos": 1}}, "dias": ["2026-11-10"]}
    cli = {"practica": {"m": {"hechos": 2}}, "dias": ["2026-11-11"]}
    unir(srv, cli, A)
    assert srv == {"practica": {"m": {"hechos": 1}}, "dias": ["2026-11-10"]}


def test_basura_no_rompe():
    out = unir({"practica": "x", "vistas": [], "dias": "no"}, {"practica": {"m": 3}, "pruebas": None, "dias": [1, "2026-11-12"]}, A)
    assert out["practica"] == {"m": 3} and out["vistas"] == {} and out["dias"] == ["2026-11-12"]


def test_repaso_gana_la_ficha_con_mas_hechos_y_desde_el_mas_antiguo():
    srv = {"repaso": {"u1": {"desde": "2026-11-02", "paso": 2, "toca": "2026-12-01", "hechos": 2, "aciertos": 2, "ultimo": "2026-11-10"},
                      "u2": {"desde": "2026-11-03", "paso": 0, "hechos": 1, "ultimo": "2026-11-05"}}}
    cli = {"repaso": {"u1": {"desde": "2026-11-01", "paso": 0, "toca": "2026-11-03", "hechos": 0, "aciertos": 0, "ultimo": None},
                      "u2": {"desde": "2026-11-03", "paso": 1, "hechos": 1, "ultimo": "2026-11-06"},
                      "u3": {"desde": "2026-11-05", "paso": 0, "hechos": 0, "ultimo": None}}}
    u = unir(srv, cli, "x")["repaso"]
    assert u["u1"]["paso"] == 2 and u["u1"]["desde"] == "2026-11-01"
    assert u["u2"]["paso"] == 1  # empate en hechos: el último más reciente
    assert u["u3"] == cli["repaso"]["u3"]


def test_repaso_junta_los_textos_leidos():
    u = unir({"repaso": {"v": {"hechos": 2, "leidos": ["t1", "t2"]}}}, {"repaso": {"v": {"hechos": 1, "leidos": ["t3", "t1"]}}}, "x")
    assert u["repaso"]["v"]["leidos"] == ["t1", "t2", "t3"]


def test_sin_repaso_no_aparece():
    assert "repaso" not in unir({}, {}, "x")
