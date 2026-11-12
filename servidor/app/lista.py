"""Lectura y validación del CSV del colegio: apellidos,nombres,dni,grado,seccion."""
import csv
import io
import re

from .seguridad import sin_tildes

COLUMNAS = ("apellidos", "nombres", "dni", "grado", "seccion")
_ALIAS = {"apellido": "apellidos", "nombre": "nombres", "seccion": "seccion", "secc": "seccion", "grado": "grado",
          "documento": "dni"}
MAX_FILAS = 3000


class ErrorCsv(Exception):
    pass


def decodificar(b: bytes) -> str:
    for enc in ("utf-8-sig", "cp1252"):  # Excel en Windows guarda en cp1252 si no se elige UTF-8
        try:
            return b.decode(enc)
        except UnicodeDecodeError:
            continue
    raise ErrorCsv("No se pudo leer el archivo: guárdalo como CSV UTF-8.")


def _limpio(s: str) -> str:
    return re.sub(r"\s+", " ", (s or "").strip())


def _nombre(s: str, campo: str) -> str:
    s = _limpio(s)
    if not s:
        raise ValueError(f"falta {campo}")
    if len(s) > 80:
        raise ValueError(f"{campo} demasiado largo")
    if not re.search(r"[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]", s) or re.search(r"[0-9<>{}@]", s):
        raise ValueError(f"{campo} no válido")
    return s


def _dni(s: str) -> str:
    d = re.sub(r"[\s.\-]", "", s or "")
    if re.fullmatch(r"\d{7}", d):
        d = "0" + d  # Excel suele comerse el 0 inicial
    if not re.fullmatch(r"\d{8}", d):
        raise ValueError("DNI no válido (deben ser 8 dígitos)")
    return d


def _grado(s: str) -> str:
    m = re.search(r"[1-6]", s or "")
    if not m:
        raise ValueError("grado no válido (1 a 5)")
    return m.group(0)


def _seccion(s: str) -> str:
    x = re.sub(r"[^A-Z0-9]", "", sin_tildes(s or "").upper())
    if not (1 <= len(x) <= 3):
        raise ValueError("sección no válida")
    return x


def leer(texto: str) -> tuple[list[dict], list[dict]]:
    """Devuelve (filas válidas, errores). Las filas se numeran como en la hoja: la cabecera es la 1."""
    muestra = texto[:4096]
    try:
        dialecto = csv.Sniffer().sniff(muestra, delimiters=",;\t")
    except csv.Error:
        dialecto = csv.excel
    lector = csv.reader(io.StringIO(texto), dialecto)
    try:
        cab = next(lector)
    except StopIteration:
        raise ErrorCsv("El archivo está vacío.")
    nombres = [_ALIAS.get(sin_tildes(c).strip(), sin_tildes(c).strip()) for c in cab]
    faltan = [c for c in COLUMNAS if c not in nombres]
    if faltan:
        raise ErrorCsv("Faltan columnas: " + ", ".join(faltan) + ". Deben ser: " + ",".join(COLUMNAS) + ".")
    idx = {c: nombres.index(c) for c in COLUMNAS}
    validas, errores, dnis = [], [], {}
    for n, fila in enumerate(lector, start=2):
        if not any(x.strip() for x in fila):
            continue
        if len(validas) + len(errores) >= MAX_FILAS:
            raise ErrorCsv(f"El archivo tiene más de {MAX_FILAS} filas. Divídelo en partes.")
        val = lambda c: fila[idx[c]] if idx[c] < len(fila) else ""
        try:
            d = {"apellidos": _nombre(val("apellidos"), "apellidos"), "nombres": _nombre(val("nombres"), "nombres"),
                 "dni": _dni(val("dni")), "grado": _grado(val("grado")), "seccion": _seccion(val("seccion")),
                 "fila": n}
        except ValueError as e:
            errores.append({"fila": n, "motivo": str(e)})
            continue
        if d["dni"] in dnis:
            errores.append({"fila": n, "motivo": f"DNI repetido (ya está en la fila {dnis[d['dni']]})"})
            continue
        dnis[d["dni"]] = n
        validas.append(d)
    return validas, errores
