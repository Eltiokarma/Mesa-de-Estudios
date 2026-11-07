#!/usr/bin/env python3
"""Pasada de pegatinas (7 nov 2026): cada escena carga nucleo/pegatina.css después de su propio <style> y marca su
curso en <html data-curso="…"> (el color de la banda de arriba). Idempotente. Uso: python3 herramientas/pasada-pegatina.py [carpetas…]
El curso sale de la primera unidad de plantillas/<id>/plantilla.json (la unidad principal de la escena);
si no hay ficha, del primer curso del catálogo cuya unidad usa la plantilla."""
import json, os, re, sys
raiz = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
cat = json.load(open(os.path.join(raiz, 'app/datos/catalogo.json')))
curso = {}
for c in cat['cursos']:
    for u in c['unidades']:
        for p in u['plantillas']: curso.setdefault(p, c['id'])
ids = sys.argv[1:] or sorted(os.listdir(os.path.join(raiz, 'plantillas')))
LINK = '<link rel="stylesheet" href="../../nucleo/pegatina.css">'
for d in ids:
    f = os.path.join(raiz, 'plantillas', d, 'index.html')
    if not os.path.exists(f): continue
    s = o = open(f, encoding='utf-8').read()
    ficha = os.path.join(raiz, 'plantillas', d, 'plantilla.json')
    us = json.load(open(ficha, encoding='utf-8')).get('unidades', []) if os.path.exists(ficha) else []
    c = us[0].split('.')[0] if us else curso.get(d)
    if not c: print('SIN CURSO', d); continue
    m = re.search(r'<html\b[^>]*>', s)
    tag = m.group(0)
    if 'data-curso=' in tag: nuevo = re.sub(r'data-curso="[^"]*"', f'data-curso="{c}"', tag)
    else: nuevo = tag[:-1] + f' data-curso="{c}">'
    s = s.replace(tag, nuevo, 1)
    if 'nucleo/pegatina.css' not in s:
        s = s.replace('</head>', LINK + '\n</head>', 1) if '</head>' in s else re.sub(r'<body\b', LINK + '\n<body', s, count=1)
    if s != o: open(f, 'w', encoding='utf-8').write(s); print('ok', d, c)
