#!/usr/bin/env python3
"""Pasa capturas PNG a WebP livianas para la mesa de revisión.

Uso: python3 herramientas/revision/imagen.py <captura.png> <nombre> [<captura.png> <nombre> ...]
Deja herramientas/revision/img/<nombre>.webp (ancho máximo 780 px, calidad 72). La carpeta img/ no se versiona:
las imágenes viven en el artifact, que se publica con publish_files (ver LEEME.md).
"""
import sys, os
from PIL import Image

DEST = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'img')
os.makedirs(DEST, exist_ok=True)
args = sys.argv[1:]
if not args or len(args) % 2:
    sys.exit(__doc__)
for png, nombre in zip(args[0::2], args[1::2]):
    im = Image.open(png).convert('RGB')
    if im.width > 780:
        im = im.resize((780, round(im.height * 780 / im.width)), Image.LANCZOS)
    salida = os.path.join(DEST, nombre + '.webp')
    im.save(salida, 'WEBP', quality=72, method=6)
    print(f'{salida}  {im.width}x{im.height}  {os.path.getsize(salida) // 1024} KB')
