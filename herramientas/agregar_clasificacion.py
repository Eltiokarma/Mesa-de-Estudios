"""Junta la clasificación de los cuatro grupos, quita duplicados y calcula cobertura.

Uso: python3 -I agregar.py <dir_clasif> <csv_salida>
Escribe un CSV sin el campo `inicio` (que tiene texto del enunciado) y
imprime las tablas en Markdown.
"""
import csv, json, re, sys, unicodedata
from collections import Counter, defaultdict
from pathlib import Path

d = Path(sys.argv[1]); salida = Path(sys.argv[2])
filas, sin_fq, malas = [], [], 0
for g in "abcd":
    p = d / f"grupo-{g}.jsonl"
    if not p.exists():
        print(f"FALTA {p.name}"); continue
    for ln in p.read_text(encoding="utf-8").splitlines():
        if not ln.strip(): continue
        try: r = json.loads(ln)
        except json.JSONDecodeError: malas += 1; continue
        if r.get("sin_fisica_quimica"): sin_fq.append(r); continue
        r["grupo"] = g; filas.append(r)

def norm(s):
    s = unicodedata.normalize("NFKD", s or "").encode("ascii", "ignore").decode().lower()
    return " ".join(re.findall(r"[a-z]{3,}", s)[:6])

# Duplicados: mismo periodo y mismo comienzo normalizado (la misma pregunta en varias áreas).
vistos = {}
for r in filas:
    k = (r["periodo"], r.get("curso"), norm(r.get("inicio", "")))
    if k[2] and k in vistos:
        r["duplicado_de"] = vistos[k]
    else:
        r["duplicado_de"] = ""
        vistos[k] = f'{r["periodo"]}-{r["area"]}-{r["numero"]}'
# Duplicados que el OCR no deja detectar (mismo enunciado leído distinto), revisados a mano.
MANUAL = {("2025-I", "E", 90): "2025-I-B-81", ("2025-I", "E", 91): "2025-I-B-82"}
for r in filas:
    k = (r["periodo"], r["area"], int(r.get("numero") or 0))
    if k in MANUAL: r["duplicado_de"] = MANUAL[k]
unicas = [r for r in filas if not r["duplicado_de"]]

EXISTE = {"lente_delgada"}
FASE1 = EXISTE | {"espejos_esfericos", "mruv_graficas", "tiro_parabolico"}
INVEST = {  # plantilla -> hay informe de ideas erróneas
    **{k: True for k in [
        "lente_delgada", "espejos_esfericos", "mruv_graficas", "caida_libre_vertical", "tiro_parabolico",
        "movimiento_circular", "mru_encuentros", "dcl_plano_inclinado", "poleas_sistemas", "dinamica_circular",
        "equilibrio_torque", "resorte_elastica", "energia_trabajo_potencia", "choques_impulso", "gravitacion_kepler",
        "mas_resorte_pendulo", "ondas_sonido", "hidrostatica_flotacion", "calorimetria_dilatacion",
        "electrostatica_campo_potencial", "condensadores", "circuitos_cc", "magnetismo_fuerza", "induccion",
        "reflexion_refraccion", "fisica_moderna",
        "materia_mezclas", "atomo_configuracion", "tabla_periodica", "enlace_geometria", "mol_composicion_formula",
        "reacciones_balance_redox", "estequiometria_limitante", "gases_quimica", "soluciones_concentracion",
        "equilibrio_lechatelier", "acidos_bases_ph", "electroquimica"]}}

def pct(a, b): return f"{100*a/b:.0f} %" if b else "—"

print(f"Líneas inválidas: {malas}. Preguntas: {len(filas)}; únicas: {len(unicas)}; "
      f"áreas sin física ni química: {len(sin_fq)}")
for curso in ["fisica", "quimica"]:
    u = [r for r in unicas if r.get("curso") == curso]
    print(f"\n## {curso} ({len(u)} únicas)")
    c = Counter(r["plantilla"] for r in u)
    print("| Plantilla | Preguntas | % | Investigación |\n| --- | --- | --- | --- |")
    for k, v in c.most_common():
        print(f"| {k} | {v} | {pct(v, len(u))} | {'sí' if INVEST.get(k) else 'no'} |")
    print(f"Existe hoy: {pct(sum(1 for r in u if r['plantilla'] in EXISTE), len(u))}; "
          f"fase 1: {pct(sum(1 for r in u if r['plantilla'] in FASE1), len(u))}; "
          f"con investigación: {pct(sum(1 for r in u if INVEST.get(r['plantilla'])), len(u))}")
    for campo in ["tipo", "visual", "figura", "ocr"]:
        cc = Counter(str(r.get(campo)) for r in u)
        print(f"{campo}: " + ", ".join(f"{k} {v} ({pct(v, len(u))})" for k, v in cc.most_common()))

# Por área (todas las preguntas, con duplicados, porque cada área es un examen).
print("\n## Preguntas por examen")
por = defaultdict(Counter)
for r in filas: por[(r["periodo"], r["area"])][r["curso"]] += 1
for (p, a), c in sorted(por.items()): print(f"{p} {a}: física {c['fisica']}, química {c['quimica']}")
for r in sin_fq: print(f'{r["periodo"]} {r["area"]}: sin física ni química')

campos = ["periodo", "area", "numero", "pagina", "curso", "tema_temario", "plantilla", "tipo", "figura",
          "visual", "resumen", "datos_clave", "ocr", "duplicado_de", "nota"]
with salida.open("w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=campos, extrasaction="ignore"); w.writeheader()
    for r in sorted(filas, key=lambda r: (r["periodo"], r["area"], int(r.get("numero") or 0))): w.writerow(r)
print(f"\nCSV: {salida}")
