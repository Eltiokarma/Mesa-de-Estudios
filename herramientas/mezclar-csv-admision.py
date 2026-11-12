# Uso: python3 -I herramientas/mezclar-csv-admision.py <csv_nuestro> <csv_rama> <csv_salida> <curso1,curso2>
# Sirve al integrar rutinas que marcan cobertura en docs/datos/admision-unmsm.csv y chocan entre sí.
# Mezcla el CSV de admisión: toma de "theirs" solo las filas de los cursos dados (clave id+curso).
import csv, sys
ours, theirs, salida, cursos = sys.argv[1], sys.argv[2], sys.argv[3], set(sys.argv[4].split(','))
o = list(csv.DictReader(open(ours, encoding='utf-8'))); campos = list(o[0].keys())
t = {(r['id'], r['curso']): r for r in csv.DictReader(open(theirs, encoding='utf-8')) if r['curso'] in cursos}
n = 0
for i, r in enumerate(o):
    k = (r['id'], r['curso'])
    if k in t and t[k] != r: o[i] = {c: t[k].get(c, '') for c in campos}; n += 1
with open(salida, 'w', newline='', encoding='utf-8') as f:
    w = csv.DictWriter(f, fieldnames=campos); w.writeheader(); w.writerows(o)
print('filas cambiadas:', n)
