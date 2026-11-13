"""Sólo retira de la cola páginas con resolución visual documentada y vigente."""
import hashlib
import json


def resolved(review_path):
    review = json.loads(review_path.read_text(encoding='utf-8'))
    if review.get('estado') == 'sin_texto_principal':
        return True
    if review.get('estado') != 'texto_cotejado' or review.get('pendientes') != []:
        return False
    page = review['pagina_pdf']
    source = review_path.parent / f'p-{page:04d}.json'
    corrected = review_path.parent / f'p-{page:04d}.corregido.json'
    if not corrected.exists():
        return False
    data = json.loads(corrected.read_text(encoding='utf-8'))
    return (data.get('registro_revision') == review_path.name
            and data.get('sha256_ocr_original') == hashlib.sha256(source.read_bytes()).hexdigest()
            and review.get('alcance') == 'texto_completo')
