"""Prueba OCR local por lotes acotados. No modifica ni valida el OCR original."""
import argparse
import hashlib
import html
import json
import os
from pathlib import Path
import sys
import webbrowser

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / '.ocr-deps'))
os.environ['OMP_THREAD_LIMIT'] = '1'
from cuzcano import save
from estado_revision_visual import resolved


def read(path):
    return json.loads(path.read_text(encoding='utf-8'))


def word_scores(tsv):
    scores = []
    for line in tsv.splitlines():
        cells = line.split('\t', 11)
        if len(cells) != 12 or cells[0] != '5' or not cells[11].strip():
            continue
        value = float(cells[10])
        if value >= 0:
            scores.append(value)
    return scores


def metrics(regions):
    scores = [s for r in regions for s in word_scores(r.get('tsv', ''))]
    return {'palabras': len(scores), 'confianza_palabras': round(sum(scores) / len(scores), 2) if scores else None}


def validate_selection(book, limit, pages, inventory):
    if book not in {b['id'] for b in inventory['libros']}:
        raise ValueError('El libro no pertenece al inventario local')
    if not 1 <= limit <= 20:
        raise ValueError('El lote debe tener entre 1 y 20 páginas; por defecto, 5')
    if pages and (len(pages) > limit or min(pages) < 1 or len(set(pages)) != len(pages)):
        raise ValueError('Páginas inválidas, repetidas o superiores al límite del lote')


def page_html(result, dest):
    esc = html.escape
    parts = ['<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width">',
        f'<title>Comparar página {result["pagina_pdf"]}</title>',
        '<style>body{font:17px/1.5 system-ui;max-width:1500px;margin:24px auto;padding:0 20px;background:#f5f7fa;color:#20313d}img{width:100%}pre{white-space:pre-wrap;font:16px/1.6 system-ui}section{background:white;border:1px solid #cbd5df;padding:18px;margin:16px 0}summary{cursor:pointer;font-weight:bold}.grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}@media(max-width:850px){.grid{display:block}}</style>',
        f'<h1>Página PDF {result["pagina_pdf"]}</h1><p>Alternativas automáticas: ninguna está validada. Una confianza mayor no garantiza fórmulas correctas.</p>',
        '<div class="grid"><div><img src="escaneo.png" alt="Escaneo original renderizado"></div><div>',
        '<section><h2>OCR original</h2><pre>' + esc(result['texto_original']) + '</pre></section>']
    for variant in result['variantes']:
        parts += ['<section><details open><summary>' + esc(variant['nombre']) + '</summary>',
            '<p>' + esc(str(variant['metricas'])) + '</p>',
            '<p>' + esc('; '.join(variant['alertas'])) + '</p>',
            '<pre>' + esc(variant['texto']) + '</pre></details></section>']
    parts.append('</div></div></html>')
    (dest / 'comparar.html').write_text('\n'.join(parts), encoding='utf-8')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--libro', required=True, help='Identificador del inventario')
    parser.add_argument('--limite', type=int, default=5)
    parser.add_argument('--paginas', nargs='+', type=int)
    parser.add_argument('--giro', type=int, choices=[0, 90, 180, 270], default=0,
                        help='Giro horario confirmado visualmente; no se adivina la orientación')
    parser.add_argument('--abrir', action='store_true')
    args = parser.parse_args()
    inventory = read(ROOT / 'fuentes/cuzcano/inventario.json')
    try:
        validate_selection(args.libro, args.limite, args.paginas, inventory)
    except ValueError as exc:
        parser.error(str(exc))
    source = ROOT / 'fuentes/libros/cuzcano' / f'{args.libro}.pdf'
    folder = ROOT / 'fuentes/ocr-local/cuzcano' / args.libro
    queue = read(ROOT / 'fuentes/ocr-local/cuzcano/cola-revision.json')
    pages = args.paginas or [p['pagina_pdf'] for p in queue if p['id'] == args.libro and not p['revision_parcial_existente']][:args.limite]
    if not pages:
        parser.error('No hay páginas sin cotejo previo en la cola de este libro')
    import pymupdf
    import tesserocr
    from PIL import Image, ImageOps
    os.chdir(ROOT)
    model = ROOT / '.tessdata/spa.traineddata'
    if not model.exists():
        parser.error('Falta el modelo local .tessdata/spa.traineddata')
    with source.open('rb') as stream:
        pdf_sha = hashlib.file_digest(stream, 'sha256').hexdigest()
    config = {'version': 1, 'dpi': 300, 'max_lado_px': 4200, 'giro_horario': args.giro,
              'sha_pdf': pdf_sha, 'sha_modelo': hashlib.sha256(model.read_bytes()).hexdigest(),
              'motor': tesserocr.tesseract_version(), 'biblioteca': tesserocr.__version__}
    signature = hashlib.sha256(json.dumps(config, sort_keys=True).encode()).hexdigest()[:12]
    results = []
    with pymupdf.open(source) as doc:
        if any(p > len(doc) for p in pages):
            parser.error('Alguna página supera la longitud del PDF')
        # Comprobar todo el lote antes de empezar: no tocar revisiones cerradas.
        for number in pages:
            if not (folder / f'p-{number:04d}.json').exists():
                parser.error(f'Falta el OCR original de la página {number}')
            if any(resolved(p) for p in folder.glob(f'revision-*-p{number:04d}.json')):
                parser.error(f'La página {number} ya tiene revisión resuelta')
        with tesserocr.PyTessBaseAPI(path='.tessdata', lang='spa', psm=tesserocr.PSM.AUTO) as api:
            for number in pages:
                raw_path = folder / f'p-{number:04d}.json'
                raw = raw_path.read_bytes()
                sha = hashlib.sha256(raw).hexdigest()
                original = json.loads(raw)
                dest = folder / 'candidatos-locales' / f'p-{number:04d}-{signature}-{sha[:12]}'
                cached = dest / 'resultado.json'
                if cached.exists() and (dest / 'comparar.html').exists() and (dest / 'escaneo.png').exists():
                    result = read(cached)
                    if result['sha256_ocr_original'] != sha or result['config'] != config:
                        raise ValueError('Resultado guardado incompatible')
                    print(f'Página {number}: reutilizada', flush=True)
                else:
                    dest.mkdir(parents=True, exist_ok=True)
                    page = doc[number - 1]
                    scale = min(config['dpi'] / 72, config['max_lado_px'] / max(page.rect.width, page.rect.height))
                    pix = page.get_pixmap(matrix=pymupdf.Matrix(scale, scale).prerotate(args.giro), colorspace=pymupdf.csGRAY)
                    scan = Image.frombytes('L', (pix.width, pix.height), pix.samples)
                    scan.save(dest / 'escaneo.png')
                    halves = 2 if scan.width > scan.height * 1.2 else 1
                    result = {'id': args.libro, 'pagina_pdf': number, 'config': config,
                        'sha256_ocr_original': sha, 'estado': 'alternativas_no_validadas',
                        'texto_original': original['texto'], 'metricas_original': metrics(original.get('regiones', [])), 'variantes': []}
                    for name, columns, contrast in [('300dpi', halves, False), ('contraste', halves, True), ('columnas', halves * 2, True)]:
                        prepared = ImageOps.autocontrast(scan, cutoff=1) if contrast else scan
                        regions = []
                        for i in range(columns):
                            box = (i * scan.width // columns, 0, (i + 1) * scan.width // columns, scan.height)
                            api.SetImage(prepared.crop(box))
                            text = api.GetUTF8Text()
                            regions.append({'caja_px': box, 'texto': text, 'tsv': api.GetTSVText(number - 1)})
                            api.Clear()
                        text = '\n\n'.join(r['texto'] for r in regions)
                        alerts = ['Revisar fórmulas, figuras y orden de lectura.']
                        if columns > halves:
                            alerts.append('Columnas de anchura fija: pueden cortar encabezados o expresiones.')
                        if len(text.strip()) < .65 * len(original['texto'].strip()):
                            alerts.append('Menos texto que el original: posible omisión.')
                        result['variantes'].append({'nombre': name, 'texto': text, 'regiones': regions,
                            'metricas': metrics(regions), 'alertas': alerts})
                    page_html(result, dest)
                    save(cached, result)
                    print(f'Página {number}: tres alternativas guardadas', flush=True)
                if raw_path.read_bytes() != raw:
                    raise RuntimeError('El original cambió durante el proceso; detener y revisar')
                results.append({'pagina_pdf': number, 'original': result['metricas_original'],
                    'variantes': {v['nombre']: v['metricas'] for v in result['variantes']},
                    'comparacion': str((dest / 'comparar.html').relative_to(ROOT))})
    identity = hashlib.sha256(json.dumps({'config': config, 'paginas': pages}, sort_keys=True).encode()).hexdigest()[:16]
    output = folder / 'lotes-locales' / identity
    output.mkdir(parents=True, exist_ok=True)
    save(output / 'informe.json', {'libro': args.libro, 'config': config, 'paginas': results,
        'estado': 'pendiente_de_comparacion_visual', 'originales_modificados': False,
        'nota': 'La confianza se calcula por palabra en todas las variantes. No mide exactitud matemática. No se cambia la cola ni se aplica ninguna alternativa automáticamente.'})
    links = '\n'.join(f'<li><a href="{html.escape(os.path.relpath(ROOT / r["comparacion"], output).replace(os.sep, "/"), quote=True)}">Comparar página {r["pagina_pdf"]}</a></li>' for r in results)
    (output / 'index.html').write_text('<!doctype html><html lang="es"><meta charset="utf-8"><title>Lote local</title><body style="font:18px/1.6 system-ui;max-width:900px;margin:40px auto;padding:20px"><h1>Comparación de OCR local</h1><p>Sin llamadas a servicios externos. Resultados automáticos pendientes de revisión; los originales se conservan.</p><ul>' + links + '</ul></body></html>', encoding='utf-8')
    print(json.dumps({'paginas': len(results), 'informe': str(output / 'informe.json'), 'lector': str(output / 'index.html')}, ensure_ascii=False), flush=True)
    if args.abrir:
        webbrowser.open((output / 'index.html').as_uri())


if __name__ == '__main__':
    main()
