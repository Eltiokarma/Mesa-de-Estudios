"""Compara lo que el generador dice que subió con lo que quedó en la base: eventos perdidos y duplicados."""
import json
import sys

import psycopg

r = json.load(open(sys.argv[1]))
cx = psycopg.connect(sys.argv[2] if len(sys.argv) > 2 else "postgresql://carga:carga@localhost/carga")
en_db = {a: (n, d) for a, n, d in cx.execute("select alumno, count(*), count(distinct t) from eventos group by alumno")}
perdidos = duplicados = sin_subir = 0
for seudo, a in r["por_alumno"].items():
    n, d = en_db.get(seudo, (0, 0))
    duplicados += n - d
    # confirmados: el servidor respondió 2xx. Si falta alguno en la base, se perdió.
    perdidos += max(0, a["confirmados"] - d)
    sin_subir += a["pendientes"]
extra = sum(n for s, (n, _) in en_db.items() if s not in r["por_alumno"])
total_db = sum(n for n, _ in en_db.values())
print(json.dumps({"en_base": total_db, "confirmados": r["eventos_confirmados"], "generados": r["eventos_generados"],
                  "perdidos": perdidos, "duplicados": duplicados, "sin_subir_al_final": sin_subir,
                  "de_alumnos_desconocidos": extra}))
