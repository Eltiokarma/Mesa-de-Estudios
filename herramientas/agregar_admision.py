"""Junta la clasificación de los exámenes de admisión, quita repetidas y mide cobertura.

Uso: python3 -I herramientas/agregar_admision.py <carpeta_jsonl> <csv_salida> [<md_tablas>]

Lee todos los *.jsonl de la carpeta (una línea por pregunta, ver
docs/clasificacion-unmsm-admision.md, sección «Cómo repetirlo»). Escribe un CSV
SIN el campo `inicio` (que trae texto del enunciado y no se publica) e imprime
las tablas en Markdown.

Repetidas: la misma pregunta puede salir en dos áreas del mismo día (anexos del
solucionario) o en dos días del mismo periodo. Se marca como repetida si coincide
el curso, el periodo, el comienzo normalizado del enunciado (6 palabras o más) y
la clave cuando ambas la traen. Los enunciados genéricos («Halle el valor de x»)
no bastan para juntar: además tiene que coincidir el tema.
"""
import csv, json, re, sys, unicodedata
from collections import Counter, defaultdict
from pathlib import Path

d = Path(sys.argv[1]); salida = Path(sys.argv[2])
md = Path(sys.argv[3]) if len(sys.argv) > 3 else None
PERIODOS = ["2019-I", "2019-II", "2020-I", "2021", "2022", "2023-I", "2023-II",
            "2024-I", "2024-II", "2025-I", "2025-II", "2026-I", "2026-II", "2027-I"]
CURSOS = ["fisica", "quimica", "aritmetica", "algebra", "geometria", "trigonometria",
          "razonamiento-matematico", "razonamiento-verbal"]
NOMBRE = {"fisica": "Física", "quimica": "Química", "aritmetica": "Aritmética", "algebra": "Álgebra",
          "geometria": "Geometría", "trigonometria": "Trigonometría",
          "razonamiento-matematico": "Razonamiento matemático", "razonamiento-verbal": "Razonamiento verbal"}

filas, malas = [], 0
for p in sorted(d.glob("*.jsonl")):
    for ln in p.read_text(encoding="utf-8").splitlines():
        if not ln.strip(): continue
        try: r = json.loads(ln)
        except json.JSONDecodeError: malas += 1; continue
        if r.get("curso") not in CURSOS: malas += 1; continue
        r["numero"] = int(r.get("numero") or 0)
        r["id"] = f'{r.get("archivo","")}#{r["numero"]}'
        filas.append(r)

# Una misma pregunta clasificada dos veces en el mismo archivo (p. ej. dos agentes): se queda la primera.
vistas, tmp = set(), []
for r in filas:
    k = (r["id"], r["curso"])
    if k in vistas: continue
    vistas.add(k); tmp.append(r)
filas = tmp

def norm(s):
    s = unicodedata.normalize("NFKD", s or "").encode("ascii", "ignore").decode().lower()
    return " ".join(re.findall(r"[a-z0-9]{2,}", s)[:8])

GENERICO = re.compile(r"^(halle|calcule|determine|indique|senale|cual|segun|el texto|en el texto|del texto|si|se|la|el|los|las)\b")
vistos = {}
for r in sorted(filas, key=lambda r: (r["periodo"], r["archivo"], r["numero"])):
    n = norm(r.get("inicio", ""))
    r["repetida_de"] = ""
    if len(n.split()) < 6: continue
    k = (r["curso"], r["periodo"], n)
    if GENERICO.match(n): k += (r.get("tema", ""),)
    previo = vistos.get(k)
    if previo and (not r.get("clave") or not previo.get("clave") or r["clave"] == previo["clave"]):
        r["repetida_de"] = previo["id"]
    else:
        vistos.setdefault(k, r)
unicas = [r for r in filas if not r["repetida_de"]]

def pct(a, b): return f"{100*a/b:.0f} %" if b else "—"
out = []
def w(s=""): out.append(s)

w(f"Líneas descartadas: {malas}. Preguntas registradas: {len(filas)}; distintas: {len(unicas)}.")
w("\n## Resumen por curso\n")
w("| Curso | Registradas | Distintas | Periodos con el curso | Cubre sí | A medias | No |")
w("| --- | --- | --- | --- | --- | --- | --- |")
tot = Counter()
for c in CURSOS:
    u = [r for r in unicas if r["curso"] == c]
    if not u: continue
    cob = Counter(r.get("cobertura", "no") for r in u)
    per = len({r["periodo"] for r in u})
    tot.update(cob); tot["n"] += len(u)
    w(f'| {NOMBRE[c]} | {sum(1 for r in filas if r["curso"] == c)} | {len(u)} | {per} | '
      f'{cob["si"]} ({pct(cob["si"], len(u))}) | {cob["medio"]} ({pct(cob["medio"], len(u))}) | {cob["no"]} ({pct(cob["no"], len(u))}) |')
w(f'| **Total** | {len(filas)} | {tot["n"]} | | {tot["si"]} ({pct(tot["si"], tot["n"])}) | '
  f'{tot["medio"]} ({pct(tot["medio"], tot["n"])}) | {tot["no"]} ({pct(tot["no"], tot["n"])}) |')

huecos = []
for c in CURSOS:
    u = [r for r in unicas if r["curso"] == c]
    if not u: continue
    w(f"\n## {NOMBRE[c]} ({len(u)} distintas)\n")
    por_tema = defaultdict(list)
    for r in u: por_tema[r.get("tema", "?")].append(r)
    w("| Tema | Preguntas | Periodos (de 14) | Unidad | Módulo más usado | Sí / medio / no |")
    w("| --- | --- | --- | --- | --- | --- |")
    for t, rs in sorted(por_tema.items(), key=lambda kv: (-len({r["periodo"] for r in kv[1]}), -len(kv[1]), kv[0])):
        per = len({r["periodo"] for r in rs})
        cob = Counter(r.get("cobertura", "no") for r in rs)
        uni = Counter(r.get("unidad", "") for r in rs).most_common(1)[0][0]
        mods = Counter(r.get("modulo", "") for r in rs if r.get("modulo"))
        mod = mods.most_common(1)[0][0] if mods else "—"
        w(f'| {t} | {len(rs)} | {per} | {uni} | {mod} | {cob["si"]} / {cob["medio"]} / {cob["no"]} |')
        flojas = cob["medio"] + cob["no"]
        if flojas > cob["si"]:
            faltas = Counter(r.get("falta", "") for r in rs if r.get("falta"))
            huecos.append((per, flojas, NOMBRE[c], t, uni, cob["no"], cob["medio"],
                           faltas.most_common(1)[0][0] if faltas else ""))
    for campo in ["tipo", "visual", "figura", "ocr"]:
        cc = Counter(str(r.get(campo)) for r in u)
        w(f"- {campo}: " + ", ".join(f"{k} {v} ({pct(v, len(u))})" for k, v in cc.most_common(8)))

w("\n## Huecos: temas donde la mayoría de las preguntas no tiene módulo que las cubra\n")
w("Ordenados por número de periodos en que salen y luego por número de preguntas.\n")
w("| # | Curso | Tema | Periodos | Preguntas sin cubrir (no + medio) | Unidad | Qué falta (lo más dicho) |")
w("| --- | --- | --- | --- | --- | --- | --- |")
for i, h in enumerate(sorted(huecos, key=lambda h: (-h[0], -h[1])), 1):
    per, flojas, cu, t, uni, no, me, falta = h
    w(f"| {i} | {cu} | {t} | {per} | {flojas} ({no} + {me}) | {uni} | {falta} |")

w("\n## Preguntas por examen (registradas, con repetidas)\n")
por = defaultdict(Counter)
for r in filas: por[(r["periodo"], r["archivo"])][r["curso"]] += 1
w("| Periodo | Archivo | " + " | ".join(NOMBRE[c][:5] for c in CURSOS) + " |")
w("| --- | --- | " + " | ".join("---" for _ in CURSOS) + " |")
for (p, a), c in sorted(por.items(), key=lambda kv: (PERIODOS.index(kv[0][0]) if kv[0][0] in PERIODOS else 99, kv[0][1])):
    w(f"| {p} | {a.replace('unmsm-', '')} | " + " | ".join(str(c[x]) for x in CURSOS) + " |")

texto = "\n".join(out)
print(texto)
if md: md.write_text(texto + "\n", encoding="utf-8")

campos = ["id", "periodo", "archivo", "numero", "pagina", "curso", "unidad", "tema", "titular", "tipo",
          "figura", "visual", "modulo", "cobertura", "falta", "resumen", "clave", "trampa", "ocr",
          "repetida_de", "nota"]
with salida.open("w", newline="", encoding="utf-8") as f:
    wr = csv.DictWriter(f, fieldnames=campos, extrasaction="ignore"); wr.writeheader()
    for r in sorted(filas, key=lambda r: (PERIODOS.index(r["periodo"]) if r["periodo"] in PERIODOS else 99,
                                          r["archivo"], r["numero"], r["curso"])):
        wr.writerow(r)
print(f"\nCSV: {salida}", file=sys.stderr)
