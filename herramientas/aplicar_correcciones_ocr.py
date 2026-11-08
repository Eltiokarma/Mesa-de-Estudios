"""Aplica un registro de revisión local sin sobrescribir el OCR crudo."""
import argparse
import hashlib
import json
from pathlib import Path
from cuzcano import save


def apply(review_path):
    review_path = Path(review_path)
    review = json.loads(review_path.read_text(encoding='utf-8'))
    page = review['pagina_pdf']
    source = review_path.parent / f'p-{page:04d}.json'
    raw = source.read_bytes()
    data = json.loads(raw)
    corrected = data['texto']
    edits = review.get('correcciones', [])
    reconstructed = review.get('texto_reconstruido')
    if reconstructed is not None:
        if edits or not isinstance(reconstructed, str) or not reconstructed.strip():
            raise ValueError('La reconstrucción debe ser texto no vacío y no mezclarse con reemplazos')
        if review.get('sha256_ocr_original') != hashlib.sha256(raw).hexdigest():
            raise ValueError('Reconstrucción sin referencia vigente al OCR original')
        corrected = reconstructed
    elif not edits:
        raise ValueError('La revisión no contiene correcciones textuales aplicables')
    for edit in edits:
        if corrected.count(edit['original']) != 1:
            raise ValueError('El fragmento cambió o es ambiguo; volver a cotejar la página')
        corrected = corrected.replace(edit['original'], edit['correccion'], 1)
    output = source.with_name(f'p-{page:04d}.corregido.json')
    complete = review.get('estado') == 'texto_cotejado' and review.get('alcance') == 'texto_completo' and review.get('pendientes') == []
    save(output, {'pagina_pdf': page, 'archivo': data['archivo'],
                  'sha256_ocr_original': hashlib.sha256(raw).hexdigest(),
                  'texto_corregido': corrected, 'revision_visual': 'texto_completo' if complete else 'parcial',
                  'correcciones_aplicadas': len(edits), 'reconstruccion_visual': reconstructed is not None,
                  'registro_revision': review_path.name,
                  'advertencia': ('Texto cotejado con el escaneo; no certifica exactitud matemática del libro.' if complete else 'No es una transcripción íntegramente validada; comprobar el SHA antes de usarla.')})
    print(f'{len(edits)} reemplazos; reconstrucción={reconstructed is not None}: {output.name}')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('registro_revision', type=Path)
    apply(parser.parse_args().registro_revision)
