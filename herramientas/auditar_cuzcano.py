"""Verifica inventario, hashes de origen y resultados por página; no valida el texto."""
import hashlib
import json
import re
from collections import Counter
from datetime import datetime, timezone
from cuzcano import ROOT, save
from estado_revision_visual import resolved


def read(path):
    return json.loads(path.read_text(encoding='utf-8'))


def main():
    if not __debug__:
        raise RuntimeError('Ejecutar la auditoría sin la opción -O de Python')
    catalog = ROOT / 'fuentes/cuzcano'
    books = read(catalog / 'inventario.json')['libros']
    expected = {b['id'] for b in books}
    downloads = {r['id']: r for r in read(catalog / 'descargas.json')}
    results = {r['id']: r for r in read(catalog / 'procesamiento.json')}
    assert len(expected) == len(books), 'Identificadores repetidos en el inventario'
    assert set(downloads) == expected == set(results), 'Faltan entradas en las descargas o el procesamiento'
    assert not read(catalog / 'errores-ocr.json'), 'Hay libros con errores de procesamiento'
    counts = Counter()
    low_keys = set()
    for book in books:
        key = book['id']
        assert downloads[key]['estado'] == 'descargado', key
        assert downloads[key]['sha256'] == results[key]['sha256'], f'Origen distinto: {key}'
        folder = ROOT / 'fuentes/ocr-local/cuzcano' / key
        summary = read(folder / 'resumen.json')
        assert summary['paginas'] == results[key]['paginas'], key
        pages = sorted(p for p in folder.glob('p-*.json') if re.fullmatch(r'p-\d{4}\.json', p.name))
        assert len(pages) == summary['paginas'], f'Número de páginas incorrecto: {key}'
        methods = Counter()
        for number, path in enumerate(pages, 1):
            raw = path.read_bytes()
            page = json.loads(raw)
            assert page['archivo'] == key + '.pdf' and page['pagina_pdf'] == number, str(path)
            assert path.name == f'p-{number:04d}.json' and page.get('layout_version') == 2, str(path)
            assert isinstance(page['texto'], str), str(path)
            assert page['metodo'] in {'tesseract_spa', 'capa_texto_existente'}, str(path)
            confidence = page['confianza']
            assert confidence is None or 0 <= confidence <= 100, str(path)
            methods[page['metodo']] += 1
            counts['paginas'] += 1
            counts[page['metodo']] += 1
            counts['caracteres'] += len(page['texto'])
            counts['paginas_texto_menor_100_caracteres'] += len(page['texto'].strip()) < 100
            counts['paginas_confianza_menor_80'] += confidence is not None and confidence < 80
            if confidence is not None and confidence < 80:
                low_keys.add((key, number))
            corrected = path.with_name(f'p-{number:04d}.corregido.json')
            if corrected.exists():
                correction = read(corrected)
                assert correction['sha256_ocr_original'] == hashlib.sha256(raw).hexdigest(), 'Corrección desactualizada'
                counts['copias_corregidas_vigentes'] += 1
        assert methods['tesseract_spa'] == summary['ocr_nuevo'], key
        assert methods['capa_texto_existente'] == summary['capa_existente'], key
    status = read(catalog / 'estado.json')['resumen']
    assert status['paginas_procesadas'] == counts['paginas'] == status['paginas_descargadas']
    assert status['libros_procesados'] == len(books)
    reviewed_keys, resolved_keys, blank_keys = set(), set(), set()
    for path in (ROOT / 'fuentes/ocr-local/cuzcano').glob('*/revision-*.json'):
        review = read(path)
        key = (path.parent.name, review['pagina_pdf'])
        reviewed_keys.add(key)
        if review.get('estado') == 'sin_texto_principal':
            blank_keys.add(key)
        if resolved(path):
            resolved_keys.add(key)
    queue = read(ROOT / 'fuentes/ocr-local/cuzcano/cola-revision.json')
    queue_keys = {(r['id'], r['pagina_pdf']) for r in queue}
    assert len(queue) == len(queue_keys) and queue_keys == low_keys - resolved_keys, 'Cola de revisión inconsistente'
    counts['paginas_en_cola_revision'] = len(queue_keys)
    counts['paginas_con_algun_cotejo'] = len(reviewed_keys)
    counts['paginas_sin_texto_principal_cotejadas'] = len(blank_keys)
    counts['paginas_texto_completo_cotejado'] = len(resolved_keys - blank_keys)
    report = {'generado_utc': datetime.now(timezone.utc).isoformat(),
              'estado': 'integridad_verificada', 'libros': len(books), **dict(counts),
              'alcance': 'Identidad de archivos, continuidad de páginas, JSON y concordancia de registros. No certifica exactitud del OCR ni fórmulas.'}
    save(catalog / 'auditoria.json', report)
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
