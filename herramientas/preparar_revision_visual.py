"""Renderiza un lote de la cola para cotejo humano, sin validar automáticamente."""
import argparse
import hashlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / '.ocr-deps'))
import pymupdf as fitz
from PIL import Image, ImageDraw


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--inicio', type=int, default=0)
    parser.add_argument('--cantidad', type=int, default=8)
    args = parser.parse_args()
    if args.inicio < 0 or not 1 <= args.cantidad <= 24:
        parser.error('inicio >= 0 y cantidad entre 1 y 24')
    queue = json.loads((ROOT / 'fuentes/ocr-local/cuzcano/cola-revision.json').read_text(encoding='utf-8'))
    batch = queue[args.inicio:args.inicio + args.cantidad]
    if not batch:
        parser.error('El inicio está fuera de la cola actual')
    identity = json.dumps([(p['id'], p['pagina_pdf']) for p in batch]).encode()
    batch_id = hashlib.sha256(identity).hexdigest()[:12]
    out = ROOT / 'fuentes/ocr-local/cuzcano/revision-lotes' / f'lote-{args.inicio:05d}-{batch_id}'
    out.mkdir(parents=True, exist_ok=True)
    sheet = Image.new('RGB', (1600, 660 * ((len(batch) + 1) // 2)), 'white')
    draw = ImageDraw.Draw(sheet)
    for i, item in enumerate(batch):
        key, number = item['id'], item['pagina_pdf']
        with fitz.open(ROOT / 'fuentes/libros/cuzcano' / f'{key}.pdf') as doc:
            page = doc[number - 1]
            pix = page.get_pixmap(matrix=fitz.Matrix(2400 / page.rect.width, 2400 / page.rect.width))
            image = Image.frombytes('RGB', (pix.width, pix.height), pix.samples)
        image.save(out / f'{i:02d}.png')
        image.thumbnail((790, 610))
        x, y = (i % 2) * 800, (i // 2) * 660
        draw.text((x + 8, y + 4), f'{i:02d} | {key} | p{number} | conf={item["confianza"]}', fill='black')
        sheet.paste(image, (x, y + 30))
        raw = json.loads((ROOT / 'fuentes/ocr-local/cuzcano' / key / f'p-{number:04d}.json').read_text(encoding='utf-8'))
        (out / f'{i:02d}.txt').write_text(raw['texto'], encoding='utf-8')
    sheet.save(out / 'contacto.png')
    (out / 'lote.json').write_text(json.dumps(batch, ensure_ascii=False, indent=2), encoding='utf-8')
    print(out)


if __name__ == '__main__':
    main()
