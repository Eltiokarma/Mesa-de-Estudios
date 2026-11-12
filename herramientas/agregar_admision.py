"""Junta la clasificación de los exámenes de admisión, quita repetidas y mide cobertura.

Uso: python3 -I herramientas/agregar_admision.py <carpeta_jsonl> <csv_salida> [<md_tablas>]
     python3 -I herramientas/agregar_admision.py docs/datos/admision-unmsm.csv docs/datos/admision-unmsm.csv docs/datos/admision-unmsm-tablas.md
     (desde el CSV: rehace las tablas después de marcar cobertura a mano; no vuelve a juntar repetidas)

Lee todos los *.jsonl de la carpeta (una línea por pregunta, ver
docs/clasificacion-unmsm-admision.md, sección «Cómo repetirlo»). Escribe un CSV
SIN el campo `inicio` (que trae texto del enunciado y no se publica) e imprime
las tablas en Markdown.

Repetidas: la misma pregunta puede salir en dos áreas del mismo día (anexos del
solucionario) o en dos días del mismo periodo. Se marca como repetida si coincide
el curso, el periodo, el comienzo normalizado del enunciado (6 palabras o más) y
la clave cuando ambas la traen, y además el tema. En razonamiento verbal no se
junta nada: sus enunciados son fórmulas que se repiten sobre textos distintos.
En 2019-2027 cada día de examen es un examen distinto, así que casi no hay repetidas.
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

desde_csv = d.suffix == ".csv"
if desde_csv:
    malas = 0
    filas = list(csv.DictReader(d.open(encoding="utf-8")))
    for r in filas: r["numero"] = int(r.get("numero") or 0)
else:
    filas, malas = [], 0
    for p in sorted(d.glob("*.jsonl")):
        for ln in p.read_text(encoding="utf-8").splitlines():
            if not ln.strip(): continue
            try: r = json.loads(ln)
            except json.JSONDecodeError: malas += 1; continue
            if r.get("curso") not in CURSOS: malas += 1; continue
            r["numero"] = int(r.get("numero") or 0)
            r["id"] = f'{r.get("archivo","")}#{r["numero"]}'
            u = r.get("unidad", "")
            if u.startswith("fuera-del-catalogo:"): r["unidad"] = "fuera-del-catalogo:" + u.split(":", 1)[1].replace("-", " ").strip().lower()
            filas.append(r)

    # Las «preguntas adicionales» de otra área, al final de algunos solucionarios, reusan números:
    # si el número ya existe en ese archivo con otro enunciado, el id lleva sufijo «b».
    # Si el enunciado es el mismo, es la misma pregunta registrada dos veces y se queda la primera.
    vistas, tmp = {}, []
    for r in filas:
        k = (r["id"], r["curso"])
        if k in vistas:
            if vistas[k] == r.get("inicio", ""): continue
            r["id"] += "b"; k = (r["id"], r["curso"])
        vistas[k] = r.get("inicio", ""); tmp.append(r)
    filas = tmp

# Familias de tema: los clasificadores escriben etiquetas finas («Certezas con suma»,
# «Certezas (peor caso)»); para contar periodos se juntan en familias con reglas fijas.
FAMILIAS = {
    "razonamiento-verbal": [
        (r"a/b", "Textos A/B (dos autores)"), (r"ingl", "Lectura en inglés"),
        (r"mixto|discontinu|infograf", "Texto mixto o discontinuo"), (r".", "Texto continuo (argumentativo, científico, filosófico)")],
    "razonamiento-matematico": [
        (r"flujo", "Diagramas de flujo"), (r"trasvase|recipientes", "Trasvases"),
        (r"agujas|reloj|hora|campanada|adelant|atras", "Relojes"), (r"calendar|semana|fecha|d[ií]as", "Calendarios"),
        (r"pesad|pesas|balanza", "Balanzas y pesadas"), (r"corte|estaca|guillotina", "Cortes y estacas"),
        (r"certeza|palomar|llaves", "Certezas"), (r"verdad|mentir|veraces|r[óo]tulos|mal rotuladas", "Verdades y mentiras"),
        (r"deportiv|goles|torneo|campeonato", "Situaciones deportivas"), (r"doble entrada|cuadro latino", "Cuadro de doble entrada"),
        (r"ordenamiento|parentesco", "Ordenamiento y parentesco"), (r"rumbo|cardinal|avance", "Rumbos y desplazamientos"),
        (r"euler|un solo trazo|repetir tramo|calles a repetir", "Trazos de un solo golpe"),
        (r"lectura.*palabra|palabras en arreglo", "Lectura de palabras en arreglos"),
        (r"ruta|camino|recorrido m[ií]nimo|hormiga", "Rutas y caminos mínimos"),
        (r"rodamiento|rueda|engranaje|polea|vueltas", "Rodamientos, ruedas y poleas"),
        (r"dado|domin", "Dados y dominó"), (r"cubo|s[óo]lido|proyecci|vista", "Cubos, sólidos y vistas"),
        (r"papel|doblad", "Papel doblado y cortado"), (r"simetr|giro|rotaci|volteo|superposici", "Simetrías y giros"),
        (r"pastilla|peri[óo]dic|ciclo|sucesos", "Frecuencia de sucesos"), (r"traslado|fichas|tablero|caballo|latas", "Traslados de fichas y juegos"),
        (r"conteo de (cuadr|tri[áa]ng|figur|casillas)", "Conteo de figuras"),
        (r"inducci|serie|sucesi|espiral|pir[áa]mide", "Inducción y series"),
        (r"m[áa]gico|arreglo|distribuci|sumas", "Arreglos numéricos"), (r"gr[áa]fic|tabla|suficiencia|sectores|barras", "Tablas, gráficos y suficiencia"),
        (r"m[áa]xim|m[ií]nim|optimiz|empaquet", "Máximos y mínimos"), (r"per[ií]metro|[áa]rea|semejanza|disecci|partici", "Perímetros, áreas y particiones"),
        (r".", "Planteo y otros")],
}
def familia(r):
    reglas = FAMILIAS.get(r["curso"])
    if not reglas: return r.get("tema", "?")
    t = (r.get("tema", "") or "").lower()
    return next(f for pat, f in reglas if re.search(pat, t))

def norm(s):
    s = unicodedata.normalize("NFKD", s or "").encode("ascii", "ignore").decode().lower()
    return " ".join(re.findall(r"[a-z0-9]{2,}", s)[:8])

# Pares que la regla junta pero que, revisados contra el PDF, son preguntas distintas
# (mismo escenario con otros datos).
NO_SON_REPETIDAS = {"unmsm-2021-solucionario-2021-09-12#29"}
if not desde_csv:
    vistos = {}
    for r in sorted(filas, key=lambda r: (r["periodo"], r["archivo"], r["numero"])):
        n = norm(r.get("inicio", ""))
        r["repetida_de"] = ""
        # En verbal los enunciados son fórmulas («Según el texto…») sobre textos distintos: no se junta.
        if len(n.split()) < 6 or r["curso"] == "razonamiento-verbal": continue
        k = (r["curso"], r["periodo"], n, r.get("tema", ""))
        if r["id"] in NO_SON_REPETIDAS: continue
        previo = vistos.get(k)
        if previo and (not r.get("clave") or not previo.get("clave") or r["clave"] == previo["clave"]):
            r["repetida_de"] = previo["id"]
        else:
            vistos.setdefault(k, r)
unicas = [r for r in filas if not r["repetida_de"]]
for r in filas: r["familia"] = familia(r)  # desde el CSV se recalcula con las mismas reglas

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
    w("Por unidad del catálogo:\n")
    w("| Unidad | Preguntas | Periodos (de 14) | Sí / medio / no | Módulos que la cubren |")
    w("| --- | --- | --- | --- | --- |")
    por_uni = defaultdict(list)
    for r in u: por_uni[r.get("unidad", "?")].append(r)
    for un, rs in sorted(por_uni.items(), key=lambda kv: (-len(kv[1]), kv[0])):
        cob = Counter(r.get("cobertura", "no") for r in rs)
        mods = Counter(r.get("modulo", "") for r in rs if r.get("modulo"))
        w(f'| {un} | {len(rs)} | {len({r["periodo"] for r in rs})} | {cob["si"]} / {cob["medio"]} / {cob["no"]} | '
          f'{", ".join(m for m, _ in mods.most_common(3)) or "—"} |')
    w("\nPor tema (en razonamiento matemático y verbal, por familia de temas):\n")
    por_tema = defaultdict(list)
    for r in u: por_tema[familia(r)].append(r)
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

w("\n## Huecos por unidad: preguntas sin cubrir del todo (no + medio)\n")
w("| # | Curso | Unidad | Sin cubrir | De | Periodos con alguna sin cubrir | Lo que más falta |")
w("| --- | --- | --- | --- | --- | --- | --- |")
pu = defaultdict(list)
for r in unicas: pu[(r["curso"], r.get("unidad", "?"))].append(r)
filas_h = []
for (c, un), rs in pu.items():
    fl = [r for r in rs if r.get("cobertura") in ("no", "medio")]
    if len(fl) < 3: continue
    fam = Counter(familia(r) for r in fl).most_common(3)
    filas_h.append((len(fl), len({r["periodo"] for r in fl}), NOMBRE[c], un, len(rs),
                    "; ".join(f"{t} ({n})" for t, n in fam)))
for i, (n, per, cu, un, tot_u, fam) in enumerate(sorted(filas_h, key=lambda h: (-h[0], -h[1])), 1):
    w(f"| {i} | {cu} | {un} | {n} | {tot_u} | {per} | {fam} |")

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

campos = ["id", "periodo", "archivo", "numero", "pagina", "curso", "unidad", "familia", "tema", "titular", "tipo",
          "figura", "visual", "modulo", "cobertura", "falta", "resumen", "clave", "trampa", "ocr",
          "repetida_de", "nota"]
with salida.open("w", newline="", encoding="utf-8") as f:
    wr = csv.DictWriter(f, fieldnames=campos, extrasaction="ignore"); wr.writeheader()
    for r in sorted(filas, key=lambda r: (PERIODOS.index(r["periodo"]) if r["periodo"] in PERIODOS else 99,
                                          r["archivo"], r["numero"], r["curso"])):
        wr.writerow(r)
print(f"\nCSV: {salida}", file=sys.stderr)
