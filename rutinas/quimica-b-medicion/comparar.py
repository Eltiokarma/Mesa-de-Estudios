"""Compara pixel a pixel dos carpetas de capturas (capturas/<a> contra capturas/<b>).
Uso: python3 comparar.py <a> <b> [umbral]   umbral: diferencia por canal que cuenta como distinta (por defecto 0)
Escribe un mapa de diferencias en capturas/dif-<a>-<b>/ para cada imagen que difiere."""
import sys, os
from PIL import Image, ImageChops
import numpy as np

DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'capturas')
a, b = sys.argv[1], sys.argv[2]
umbral = int(sys.argv[3]) if len(sys.argv) > 3 else 0
ra, rb = os.path.join(DIR, a), os.path.join(DIR, b)
out = os.path.join(DIR, f'dif-{a}-{b}')
total = iguales = 0
faltan = []
for raiz, _, archivos in sorted(os.walk(ra)):
    for f in sorted(archivos):
        if not f.endswith('.png'):
            continue
        rel = os.path.relpath(os.path.join(raiz, f), ra)
        pb = os.path.join(rb, rel)
        total += 1
        if not os.path.exists(pb):
            faltan.append(rel); continue
        ia, ib = Image.open(os.path.join(raiz, f)).convert('RGBA'), Image.open(pb).convert('RGBA')
        if ia.size != ib.size:
            print(f'TAMAÑO {rel}: {ia.size} contra {ib.size}'); continue
        d = ImageChops.difference(ia, ib)
        arr = np.asarray(d).max(axis=2)
        n = int((arr > umbral).sum()); px = arr.size
        if n == 0:
            iguales += 1; continue
        mask = Image.fromarray(((arr > umbral) * 255).astype('uint8'))
        bb = mask.getbbox()
        print(f'DIFIERE {rel}: {n} px (de {px}), máx {int(arr.max())}, caja {bb}')
        os.makedirs(os.path.dirname(os.path.join(out, rel)), exist_ok=True)
        mask.save(os.path.join(out, rel))
print(f'{iguales} de {total} iguales' + (f'; faltan en {b}: {faltan}' if faltan else ''))
