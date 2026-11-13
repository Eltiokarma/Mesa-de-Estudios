"""Entrega local de páginas corregidas en JSONL, HTML y ZIP; no publica fuentes."""
import hashlib
import html
import json
import zipfile
from datetime import datetime, timezone
from cuzcano import ROOT, save
from estado_revision_visual import resolved


def main():
    folder = ROOT / 'fuentes/ocr-local/cuzcano'
    catalog = ROOT / 'fuentes/cuzcano'
    books = {b['id']: b for b in json.loads((catalog / 'inventario.json').read_text(encoding='utf-8'))['libros']}
    records = []
    for path in sorted(folder.glob('*/p-*.corregido.json')):
        data = json.loads(path.read_text(encoding='utf-8'))
        number = data['pagina_pdf']
        source = path.parent / f'p-{number:04d}.json'
        raw = source.read_bytes()
        if hashlib.sha256(raw).hexdigest() != data['sha256_ocr_original']:
            raise ValueError(f'Corrección desactualizada: {path}')
        review_path = path.parent / data['registro_revision']
        review = json.loads(review_path.read_text(encoding='utf-8'))
        records.append({'version_formato': 1, 'fuente': books[path.parent.name],
            'pagina_pdf': number, 'sha256_ocr_original': data['sha256_ocr_original'],
            'estado_texto': 'cotejado_completo' if resolved(review_path) else 'parcial',
            'validacion_matematica': 'pendiente', 'texto_ocr_original': json.loads(raw)['texto'],
            'texto_corregido': data['texto_corregido'],
            'modo_correccion': 'reconstruccion' if data.get('reconstruccion_visual') else 'reemplazos',
            'pendientes': review.get('pendientes', review.get('pendiente', [])),
            'formulas_latex': review.get('formulas_latex', []),
            'observaciones': review.get('notas_para_validacion_matematica', []),
            'hallazgos': review.get('hallazgos', []),
            'registro_revision': str(review_path.relative_to(ROOT))})
    output = folder / 'entrega'
    output.mkdir(parents=True, exist_ok=True)
    data_path = output / 'paginas-corregidas.jsonl'
    data_path.write_text(''.join(json.dumps(r, ensure_ascii=False) + '\n' for r in records), encoding='utf-8')
    parts = ['<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Cuzcano: revisión visual</title>',
        '<style>body{max-width:1000px;margin:40px auto;padding:0 24px;font:17px/1.6 system-ui;color:#182b38;background:#f4f6f8}article{background:white;padding:24px;margin:24px 0;border:1px solid #ccd6dd;border-radius:12px}pre{white-space:pre-wrap;font:16px/1.6 system-ui}summary{cursor:pointer}small{color:#536775}</style>',
        '<h1>Revisión visual de Cuzcano</h1><p>Avance de páginas corregidas. Las revisiones parciales conservan pendientes. El cotejo del texto no certifica la solución matemática del libro.</p>',
        f'<p>{len(records)} páginas con correcciones guardadas. <a href="paginas-corregidas.jsonl">Datos JSONL</a></p>']
    for r in records:
        esc = html.escape
        heading = f'{r["fuente"]["titulo"]} · página PDF {r["pagina_pdf"]}'
        parts += [f'<article><h2>{esc(heading)}</h2><p><b>{esc(r["estado_texto"])}</b> · Validación matemática pendiente</p>',
            f'<small>{esc(r["fuente"]["id"])}</small><p><a href="{esc(r["fuente"]["url"], quote=True)}">Abrir fuente</a></p>',
            '<h3>Texto corregido</h3><pre>' + esc(r['texto_corregido']) + '</pre>',
            '<h3>Pendientes y observaciones</h3><pre>' + esc(json.dumps({'pendientes': r['pendientes'], 'observaciones': r['observaciones']}, ensure_ascii=False, indent=2)) + '</pre>',
            '<details><summary>Comparar con el OCR original</summary><pre>' + esc(r['texto_ocr_original']) + '</pre></details></article>']
    parts.append('</html>')
    (output / 'index.html').write_text('\n'.join(parts), encoding='utf-8')
    manifest = {'generado_utc': datetime.now(timezone.utc).isoformat(), 'paginas_con_correcciones': len(records),
                'texto_completo_cotejado': sum(r['estado_texto'] == 'cotejado_completo' for r in records),
                'parciales': sum(r['estado_texto'] == 'parcial' for r in records),
                'alcance': 'Entrega local de consulta. No certifica libros completos ni exactitud matemática.',
                'archivos': {p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in (data_path, output / 'index.html')}}
    save(output / 'manifiesto.json', manifest)
    with zipfile.ZipFile(output / 'revision-cuzcano.zip', 'w', zipfile.ZIP_DEFLATED) as archive:
        for name in ('index.html', 'paginas-corregidas.jsonl', 'manifiesto.json'):
            archive.write(output / name, arcname=name)
    print(json.dumps(manifest, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
