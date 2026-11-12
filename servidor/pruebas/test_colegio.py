import io
import json

from pypdf import PdfReader

from app.modelos import Alumno, Auditoria, Evento, Seccion
from app.seguridad import ALFABETO, base_usuario, primer_apellido
from conftest import CSV_BASE


def test_csv_crea_alumnos_secciones_y_usuarios(e):
    cid, adm = e.colegio()
    d = e.cargar(adm).json()
    assert d["actualizados"] == 0 and d["errores"] == []
    assert [c["usuario"] for c in d["creados"]] == ["qroman26", "acondori26", "jdelacruz26"]
    for c in d["creados"]:
        assert len(c["contrasena"]) == 6 and set(c["contrasena"]) <= set(ALFABETO)
        assert not set(c["contrasena"]) & set("0O1lI")
    assert d["creados"][0]["nombre"] == "Quispe Luz Román Mamani"
    with e.db() as s:
        assert {(x.grado, x.letra) for x in s.query(Seccion)} == {("3", "A"), ("4", "B")}


def test_csv_por_multipart(e):
    _, adm = e.colegio()
    r = e.c.post("/api/colegio/alumnos", files={"archivo": ("lista.csv", CSV_BASE.encode(), "text/csv")},
                 headers=e.h(adm))
    assert r.status_code == 200 and len(r.json()["creados"]) == 3


def test_csv_con_punto_y_coma_cp1252_y_tildes_en_cabecera(e):
    _, adm = e.colegio()
    texto = "Apellidos;Nombres;DNI;Grado;Sección\nÑahui Pérez;Óscar;1234567;5.º;b\n"
    crudo = texto.encode("cp1252")
    assert b"\xd1" in crudo  # Ñ en cp1252, no es UTF-8 válido
    d = e.cargar(adm, crudo).json()
    assert d["errores"] == [] and d["creados"][0]["usuario"] == "onahui26"
    assert d["creados"][0]["grado"] == "5" and d["creados"][0]["seccion"] == "B"


def test_csv_filas_malas_y_dni_repetido(e):
    _, adm = e.colegio()
    texto = """apellidos,nombres,dni,grado,seccion
Román Mamani,Luz,12345678,3,A
,Ana,23456789,3,A
Pari,Juan,12AB,3,A
Pari,Juan,99999999,x,A
Pari,Juan,88888888,3,
Ticona,Rosa,12345678,4,B

Quispe,Rosa,77777777,4,B
"""
    d = e.cargar(adm, texto).json()
    assert [c["usuario"] for c in d["creados"]] == ["lroman26", "rquispe26"]
    errs = {x["fila"]: x["motivo"] for x in d["errores"]}
    assert set(errs) == {3, 4, 5, 6, 7}
    assert "apellidos" in errs[3] and "DNI" in errs[4] and "grado" in errs[5] and "sección" in errs[6]
    assert "repetido" in errs[7] and "fila 2" in errs[7]


def test_csv_sin_columnas(e):
    _, adm = e.colegio()
    r = e.cargar(adm, "apellido,nombre\nA,B\n")
    assert r.status_code == 400 and r.json()["error"] == "csv-invalido" and "dni" in r.json()["mensaje"]
    assert e.cargar(adm, "").status_code == 400


def test_recargar_no_duplica_y_actualiza(e):
    _, adm = e.colegio()
    e.cargar(adm)
    texto = CSV_BASE.replace("3,A\nCondori", "4,C\nCondori")  # Luz pasa a 4.º C
    d = e.cargar(adm, texto).json()
    assert d["creados"] == [] and d["actualizados"] == 3
    with e.db() as s:
        assert s.query(Alumno).count() == 3
        luz = s.query(Alumno).filter_by(nombres="Quispe Luz").one()
        assert (luz.seccion.grado, luz.seccion.letra) == ("4", "C")


def test_usuario_que_choca_lleva_numero(e):
    _, adm = e.colegio()
    texto = "apellidos,nombres,dni,grado,seccion\nRomán,Quispe,11111111,3,A\nRoman,Queta,22222222,3,A\nROMÁN,Q,33333333,3,A\n"
    assert [c["usuario"] for c in e.cargar(adm, texto).json()["creados"]] == ["qroman26", "qroman262", "qroman263"]


def test_reglas_del_usuario():
    assert base_usuario("Luz", "Román Mamani", 2026) == "lroman26"
    assert primer_apellido("De la Cruz Huanca") == "delacruz"
    assert primer_apellido("Ñahui-Pérez") == "nahui"
    assert base_usuario("", "", 2027) == "alumno27"


def test_dni_cifrado_y_solo_ultimos_tres(e):
    _, adm = e.colegio()
    e.cargar(adm)
    with e.db() as s:
        a = s.query(Alumno).filter_by(nombres="Quispe Luz").one()
        assert "12345678" not in a.dni_cifrado and "12345678" not in a.dni_huella
        assert e.app.state.cofre.descifrar(a.dni_cifrado) == "12345678"
    lista = e.c.get("/api/colegio/alumnos", headers=e.h(adm)).json()
    luz = next(x for x in lista if x["usuario"] == "qroman26")
    assert luz["dni_final"] == "678" and "12345678" not in json.dumps(lista)


def test_dni_nunca_sale(e):
    _, adm = e.colegio()
    cr = e.cargar(adm).json()["creados"]
    t = e.alumno_listo(cr[0])
    e.c.post("/api/eventos", json={"eventos": [{"t": "1", "dni": "12345678"}]}, headers=e.h(t))
    salidas = [
        e.c.post("/api/login", json={"usuario": cr[0]["usuario"], "contrasena": "mi-clave-nueva"}).text,
        e.c.get("/api/estado", headers=e.h(t)).text,
        e.c.get("/api/colegio/eventos", headers=e.h(adm)).text,
        e.c.get("/api/secciones/1/avance", headers=e.h(adm)).text,
        e.c.get("/api/colegio/alumnos", headers=e.h(adm)).text,
        json.dumps(e.cargar(adm).json()),
    ]
    for txt in salidas:
        for dni in ("12345678", "23456789", "34567890"):
            assert dni not in txt


def test_pdf_de_tarjetas(e):
    _, adm = e.colegio()
    r = e.cargar(adm, formato="pdf")
    assert r.status_code == 200 and r.headers["content-type"] == "application/pdf"
    assert r.content.startswith(b"%PDF")
    pdf = PdfReader(io.BytesIO(r.content))
    texto = pdf.pages[0].extract_text()
    assert "qroman26" in texto and "jdelacruz26" in texto and "IE Juliaca" in texto
    # las contraseñas iniciales están en el PDF
    with e.db() as s:
        assert s.query(Alumno).count() == 3


def test_pdf_de_muchas_hojas(e):
    _, adm = e.colegio()
    filas = "\n".join(f"Apellido{chr(65 + i // 26)}{chr(65 + i % 26)},Nombre,{10000000 + i},3,A" for i in range(23))
    r = e.cargar(adm, "apellidos,nombres,dni,grado,seccion\n" + filas.replace("Apellido", "Ape") + "\n", formato="pdf")
    assert len(PdfReader(io.BytesIO(r.content)).pages) == 3  # 10 por hoja


def test_pdf_vacio_es_valido(e):
    _, adm = e.colegio()
    e.cargar(adm)
    r = e.cargar(adm, formato="pdf")  # todos ya existían
    assert len(PdfReader(io.BytesIO(r.content)).pages) == 1


def test_profesores(e):
    _, adm = e.colegio()
    e.cargar(adm)
    secs = e.c.get("/api/secciones", headers=e.h(adm)).json()
    assert [(x["grado"], x["letra"], x["alumnos"]) for x in secs] == [("3", "A", 2), ("4", "B", 1)]
    r = e.c.post("/api/colegio/profesores", json={"nombre": "Rosa Quispe Mamani", "secciones": [secs[0]["id"]]},
                 headers=e.h(adm))
    assert r.status_code == 200 and r.json()["usuario"] == "rquispe26" and len(r.json()["contrasena"]) == 6
    r = e.c.post("/api/colegio/profesores", json={"nombre": "Otro", "usuario": "rquispe26"}, headers=e.h(adm))
    assert r.status_code == 409
    r = e.c.post("/api/colegio/profesores", json={"nombre": "Otro", "usuario": "profe.otro"}, headers=e.h(adm))
    assert r.status_code == 200
    r = e.c.put("/api/colegio/profesores/profe.otro/secciones", json={"secciones": [secs[1]["id"]]}, headers=e.h(adm))
    assert r.json()["secciones"] == [secs[1]["id"]]
    lista = e.c.get("/api/colegio/profesores", headers=e.h(adm)).json()
    assert {p["usuario"]: p["secciones"] for p in lista} == {"rquispe26": [secs[0]["id"]], "profe.otro": [secs[1]["id"]]}


def test_eventos_del_colegio_para_el_analizador(e):
    _, adm = e.colegio()
    t = e.alumno_listo(e.cargar(adm).json()["creados"][0])
    e.c.post("/api/eventos", json={"eventos": [{"t": "1", "tipo": "a"}, {"t": "2", "tipo": "b"}]}, headers=e.h(t))
    d = e.c.get("/api/colegio/eventos", headers=e.h(adm)).json()
    assert isinstance(d, list) and [x["tipo"] for x in d] == ["a", "b"]
    assert all(x["alumno"].startswith("a") and "nombre" not in x for x in d)


def test_auditoria(e):
    cid, adm = e.colegio()
    e.cargar(adm)
    e.c.get("/api/colegio/eventos", headers=e.h(adm))
    e.c.post("/api/alumnos/qroman26/reiniciar", headers=e.h(adm))
    with e.db() as s:
        acciones = [(a.accion, a.colegio_id) for a in s.query(Auditoria).order_by(Auditoria.id)]
        assert acciones == [("cargar-lista", cid), ("descargar-eventos", cid), ("reiniciar-contrasena", cid)]
        a = s.query(Auditoria).filter_by(accion="reiniciar-contrasena").one()
        assert a.detalle == {"alumno": "qroman26"} and a.usuario_id is not None


def test_alumno_no_administra(e):
    _, adm = e.colegio()
    t = e.alumno_listo(e.cargar(adm).json()["creados"][0])
    for metodo, ruta in (("get", "/api/colegio/alumnos"), ("get", "/api/colegio/eventos"), ("get", "/api/secciones"),
                         ("post", "/api/colegio/alumnos"), ("get", "/api/general/colegios")):
        assert getattr(e.c, metodo)(ruta, headers=e.h(t)).status_code == 403
