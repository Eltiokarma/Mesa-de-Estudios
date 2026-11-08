"""Cuenta descargas y páginas procesadas sin confundir OCR con revisión visual."""
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / '.ocr-deps'))
import pymupdf
from cuzcano import save


def main():
    inventory = json.loads((ROOT / 'fuentes/cuzcano/inventario.json').read_text(encoding='utf-8'))
    rows = []
    for book in inventory['libros']:
        pdf = ROOT / 'fuentes/libros/cuzcano' / (book['id'] + '.pdf')
        folder = ROOT / 'fuentes/ocr-local/cuzcano' / book['id']
        row = {'id': book['id'], 'titulo': book['titulo'], 'descargado': pdf.exists(),
               'paginas': None, 'paginas_procesadas': 0, 'revision_visual_completa': False}
        if pdf.exists():
            try:
                with pymupdf.open(pdf) as document:
                    row['paginas'] = len(document)
            except Exception as error:
                row['error_pdf'] = str(error)
        for page in folder.glob('p-*.json'):
            if '.corregido.' in page.name:
                continue
            try:
                if json.loads(page.read_text(encoding='utf-8')).get('layout_version') == 2:
                    row['paginas_procesadas'] += 1
            except (OSError, json.JSONDecodeError):
                pass
        rows.append(row)
    summary = {'libros_catalogados': len(rows), 'libros_descargados': sum(r['descargado'] for r in rows),
               'paginas_descargadas': sum(r['paginas'] or 0 for r in rows),
               'paginas_procesadas': sum(r['paginas_procesadas'] for r in rows),
               'libros_procesados': sum(r['paginas'] is not None and r['paginas_procesadas'] == r['paginas'] for r in rows),
               'libros_revisados_integramente': 0}
    save(ROOT / 'fuentes/cuzcano/estado.json', {'generado_utc': datetime.now(timezone.utc).isoformat(), 'resumen': summary, 'libros': rows})
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
