"""Unión del estado del alumno (PUT /api/estado), según «Contrato de la API» en docs/cuentas.md.

Reglas:
- practica[id]: los contadores se quedan con el máximo de los dos lados; `hechos` de lectura (objeto) se une.
- practica[id] y pruebas[curso]: `entrada` y `salida` no se pisan: gana la del servidor. Igual `pruebas[curso].orden`.
- `enCurso`: si está de un solo lado, ese; si está en los dos, el que tenga más respuestas.
- `vistas`: unión con la fecha más antigua por unidad; `dias`: unión sin repetir.
- `uni`, `grado`, `tema`, `nombre`: gana el cliente.
- `alumno`: siempre el id seudónimo de la cuenta.
Lo que el contrato no nombra: gana el cliente si lo trae; si no, se conserva el del servidor.
"""
import copy

CONTADORES = ("hechos", "aciertos", "nose", "textos", "preguntas", "previos", "previosBien")
FIJOS_PRACTICA = ("entrada", "salida")
FIJOS_PRUEBA = ("entrada", "salida", "orden")
GANA_CLIENTE = ("uni", "grado", "tema", "nombre")


def _num(x) -> bool:
    return isinstance(x, (int, float)) and not isinstance(x, bool)


def _max(a, b):
    if _num(a) and _num(b):
        return max(a, b)
    if isinstance(a, dict) and isinstance(b, dict):  # hechos de lectura: { texto: veces }
        out = dict(a)
        for k, v in b.items():
            out[k] = _max(out[k], v) if k in out else v
        return out
    if a is None:
        return b
    if b is None:
        return a
    return a if _num(a) or isinstance(a, dict) else b  # tipos distintos: se queda el del servidor si es válido


def _n_respuestas(ec) -> int:
    if not isinstance(ec, dict):
        return -1
    r = ec.get("respuestas", ec.get("resp"))
    return len(r) if isinstance(r, list) else 0


def _en_curso(srv, cli):
    if srv is None:
        return cli
    if cli is None:
        return srv
    return srv if _n_respuestas(srv) > _n_respuestas(cli) else cli  # empate: el del cliente, que es lo último


def _unir_bloque(srv: dict, cli: dict, fijos, contadores) -> dict:
    out = {**srv, **cli}
    for k in contadores:
        if k in srv or k in cli:
            out[k] = _max(srv.get(k), cli.get(k))
    for k in fijos:
        if srv.get(k) is not None:
            out[k] = srv[k]
        elif k in cli:
            out[k] = cli[k]
    if "enCurso" in srv or "enCurso" in cli:
        ec = _en_curso(srv.get("enCurso"), cli.get("enCurso"))
        if ec is None:
            out.pop("enCurso", None)
        else:
            out["enCurso"] = ec
    return out


def _unir_mapa(srv, cli, fijos, contadores) -> dict:
    srv = srv if isinstance(srv, dict) else {}
    cli = cli if isinstance(cli, dict) else {}
    out = {}
    for k in {**srv, **cli}:
        a, b = srv.get(k), cli.get(k)
        if isinstance(a, dict) and isinstance(b, dict):
            out[k] = _unir_bloque(a, b, fijos, contadores)
        else:
            out[k] = a if isinstance(a, dict) else b
    return out


def _unir_vistas(srv, cli) -> dict:
    out = dict(srv) if isinstance(srv, dict) else {}
    for k, v in (cli.items() if isinstance(cli, dict) else ()):
        if k not in out or (isinstance(v, str) and isinstance(out[k], str) and v < out[k]) or not out[k]:
            out[k] = v
    return out


def _unir_dias(srv, cli) -> list:
    todos = [d for d in (srv if isinstance(srv, list) else []) + (cli if isinstance(cli, list) else []) if isinstance(d, str)]
    return sorted(set(todos))[-400:]  # la app guarda los últimos 400


def unir(servidor: dict | None, cliente: dict | None, alumno: str) -> dict:
    srv = copy.deepcopy(servidor) if isinstance(servidor, dict) else {}
    cli = copy.deepcopy(cliente) if isinstance(cliente, dict) else {}
    out = {**srv, **cli}
    for k in GANA_CLIENTE:
        if k in cli:
            out[k] = cli[k]
    out["practica"] = _unir_mapa(srv.get("practica"), cli.get("practica"), FIJOS_PRACTICA, CONTADORES)
    out["pruebas"] = _unir_mapa(srv.get("pruebas"), cli.get("pruebas"), FIJOS_PRUEBA, ())
    out["vistas"] = _unir_vistas(srv.get("vistas"), cli.get("vistas"))
    out["dias"] = _unir_dias(srv.get("dias"), cli.get("dias"))
    out["alumno"] = alumno
    return out
