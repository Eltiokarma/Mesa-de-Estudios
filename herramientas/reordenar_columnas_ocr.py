"""Crea una lectura alternativa por columnas tras cotejar el diseño visualmente."""
import argparse
import csv
import hashlib
import io
import json
from collections import defaultdict
from pathlib import Path
from cuzcano import save


def reorder(path, columns):
    if columns < 1:
        raise ValueError('El número de columnas debe ser positivo')
    raw = path.read_bytes()
    data = json.loads(raw)
    if not data.get('regiones'):
        raise ValueError('Esta página no tiene regiones TSV de Tesseract')
    sections = []
    for region in data['regiones']:
        width = region['caja_px'][2] - region['caja_px'][0]
        buckets = [defaultdict(list) for _ in range(columns)]
        fields = 'level page_num block_num par_num line_num word_num left top width height conf text'.split()
        has_header = region['tsv'].startswith('level\t')
        for row in csv.DictReader(io.StringIO(region['tsv']), delimiter='\t', quoting=csv.QUOTE_NONE,
                                  fieldnames=None if has_header else fields):
            if row['level'] != '5' or not row.get('text', '').strip():
                continue
            left, top, w = (int(row[k]) for k in ('left', 'top', 'width'))
            col = min(columns - 1, int((left + w / 2) * columns / width))
            key = tuple(row[k] for k in ('block_num', 'par_num', 'line_num'))
            buckets[col][key].append((top, left, row['text']))
        for lines in buckets:
            ordered = sorted(lines.values(), key=lambda words: (min(w[0] for w in words), min(w[1] for w in words)))
            sections.append('\n'.join(' '.join(w[2] for w in sorted(words, key=lambda w: w[1])) for words in ordered))
    output = path.with_name('columnas-' + path.name)
    save(output, {'archivo': data['archivo'], 'pagina_pdf': data['pagina_pdf'],
                  'sha256_ocr_original': hashlib.sha256(raw).hexdigest(),
                  'columnas_por_region': columns, 'texto': '\n\n'.join(sections),
                  'revision_visual': 'parcial',
                  'advertencia': 'Orden alternativo; verificar títulos que abarcan varias columnas y fórmulas.'})
    print(output.name)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('pagina_json', type=Path)
    parser.add_argument('--columnas', type=int, required=True, help='Columnas en cada mitad o región OCR')
    args = parser.parse_args()
    reorder(args.pagina_json, args.columnas)
