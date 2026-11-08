"""Ordena páginas de baja confianza; no marca páginas como validadas."""
import json
from pathlib import Path
from cuzcano import ROOT, save


def main():
    queue = []
    for path in (ROOT / 'fuentes/ocr-local/cuzcano').glob('*/p-*.json'):
        if '.corregido.' in path.name:
            continue
        data = json.loads(path.read_text(encoding='utf-8'))
        confidence = data.get('confianza')
        if confidence is None or confidence >= 80:
            continue
        page = data['pagina_pdf']
        reviewed = list(path.parent.glob(f'revision-*-p{page:04d}.json'))
        queue.append({'id': path.parent.name, 'pagina_pdf': page,
                      'confianza': confidence, 'caracteres': len(data['texto'].strip()),
                      'revision_parcial_existente': bool(reviewed),
                      'registros_revision': [p.name for p in reviewed]})
    queue.sort(key=lambda item: (item['revision_parcial_existente'], item['confianza'], item['id'], item['pagina_pdf']))
    save(ROOT / 'fuentes/ocr-local/cuzcano/cola-revision.json', queue)
    print(f'{len(queue)} páginas de confianza menor que 80; primero las aún no cotejadas')


if __name__ == '__main__':
    main()
