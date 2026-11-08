"""Inventario y descarga reanudable de Cuzcano. Python 3.12, sin dependencias."""
import argparse
import concurrent.futures
import hashlib
import json
import re
import time
import urllib.request
import urllib.parse
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = 'https://universetostudy.com/biblioteca/cuzcano/'


class DriveConfirmation(HTMLParser):
    def __init__(self):
        super().__init__()
        self.action = None
        self.fields = {}
        self.in_form = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'form' and attrs.get('id') == 'download-form':
            self.action = attrs.get('action')
            self.in_form = True
        if self.in_form and tag == 'input' and attrs.get('type') == 'hidden':
            self.fields[attrs['name']] = attrs.get('value', '')

    def handle_endtag(self, tag):
        if tag == 'form':
            self.in_form = False


def open_pdf(url):
    response = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'}), timeout=90)
    first = response.read(1024)
    if first.startswith(b'%PDF-'):
        return response, first
    html = first + response.read(1024 * 1024)
    response.close()
    form = DriveConfirmation()
    form.feed(html.decode('utf-8', errors='replace'))
    if form.action != 'https://drive.usercontent.google.com/download':
        raise ValueError('Drive no entrega PDF ni formulario de descarga reconocido')
    response = urllib.request.urlopen(form.action + '?' + urllib.parse.urlencode(form.fields), timeout=90)
    first = response.read(1024)
    if not first.startswith(b'%PDF-'):
        response.close()
        raise ValueError('La confirmación de Drive no entregó un PDF')
    return response, first


def save(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    temp = path.with_suffix(path.suffix + '.tmp')
    temp.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    temp.replace(path)


def inventory(platform):
    rows = json.loads(Path(platform).read_text(encoding='utf-8'))['catalogs']['cuzcano']
    books = []
    for row in rows:
        match = re.search(r'/d/([\w-]+)', row.get('url', ''))
        if not match or row.get('upcoming'):
            raise ValueError(f'Entrada no descargable: {row}')
        books.append({'id': match[1], 'titulo': row['title'],
                      'coleccion': row['catalog'], 'seccion': row.get('section', ''),
                      'autor': row.get('author', ''), 'url': row['url']})
    save(ROOT / 'fuentes/cuzcano/inventario.json',
         {'fuente': SOURCE, 'fecha_consulta': '2026-11-08', 'libros': books})
    print(f'{len(books)} entradas; {len(set(b["id"] for b in books))} archivos únicos', flush=True)


def download(book):
    dest = ROOT / 'fuentes/libros/cuzcano' / (book['id'] + '.pdf')
    dest.parent.mkdir(parents=True, exist_ok=True)
    part = dest.with_suffix('.part')
    try:
        if not dest.exists():
            for attempt in range(3):
                try:
                    url = 'https://drive.google.com/uc?export=download&id=' + book['id']
                    response, first = open_pdf(url)
                    with response, part.open('wb') as output:
                        output.write(first)
                        while chunk := response.read(1024 * 1024):
                            output.write(chunk)
                    part.replace(dest)
                    break
                except Exception:
                    if attempt == 2:
                        raise
                    time.sleep(2 ** attempt)
        with dest.open('rb') as stream:
            digest = hashlib.file_digest(stream, 'sha256').hexdigest()
        result = {'id': book['id'], 'estado': 'descargado', 'bytes': dest.stat().st_size, 'sha256': digest}
    except Exception as error:
        result = {'id': book['id'], 'estado': 'error', 'error': str(error)}
    print(f'{result["estado"]}: {book["titulo"]} ({book["id"]})', flush=True)
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--inventariar', metavar='PLATFORM_JSON')
    parser.add_argument('--descargar', action='store_true')
    parser.add_argument('--workers', type=int, default=3)
    args = parser.parse_args()
    if args.inventariar:
        inventory(args.inventariar)
    if args.descargar:
        books = json.loads((ROOT / 'fuentes/cuzcano/inventario.json').read_text(encoding='utf-8'))['libros']
        unique = list({b['id']: b for b in books}.values())
        results = []
        with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as executor:
            for result in executor.map(download, unique):
                results.append(result)
                save(ROOT / 'fuentes/cuzcano/descargas.json', results)
        if any(r['estado'] == 'error' for r in results):
            raise SystemExit(1)


if __name__ == '__main__':
    main()
