"""OCR por página, reanudable, con texto, coordenadas y cola de revisión local."""
import argparse
import hashlib
import json
import os
import sys
from pathlib import Path
from concurrent.futures import ProcessPoolExecutor, as_completed

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / '.ocr-deps'))
os.environ['OMP_THREAD_LIMIT'] = '1'
import pymupdf
import tesserocr
from PIL import Image
from cuzcano import save


def process(task):
    source, force, dpi = task
    source = Path(source).resolve()
    os.chdir(ROOT)  # Tesseract on Windows cannot open accented absolute model paths.
    dest = ROOT / 'fuentes/ocr-local/cuzcano' / source.stem
    dest.mkdir(parents=True, exist_ok=True)
    with source.open('rb') as stream:
        sha = hashlib.file_digest(stream, 'sha256').hexdigest()
    settings = {'sha256': sha, 'dpi': dpi, 'forzar_ocr': force, 'version': 1}
    meta = dest / 'config.json'
    if meta.exists() and json.loads(meta.read_text(encoding='utf-8')) != settings:
        raise ValueError(f'Configuración distinta en {dest}; usar otra salida o retirar resultados anteriores')
    save(meta, settings)
    summaries = []
    api = None
    try:
        with pymupdf.open(source) as doc:
            for number, page in enumerate(doc, 1):
                out = dest / f'p-{number:04d}.json'
                cached = json.loads(out.read_text(encoding='utf-8')) if out.exists() else None
                if cached and cached.get('layout_version') == 2:
                    data = cached
                else:
                    embedded = page.get_text(sort=True)
                    letters = sum(c.isalnum() for c in embedded)
                    usable = (len(embedded.strip()) >= 180 and letters / max(len(embedded), 1) > .45
                              and embedded.count('\ufffd') / max(len(embedded), 1) < .005)
                    data = {'archivo': source.name, 'pagina_pdf': number, 'layout_version': 2,
                            'revision_visual': 'pendiente', 'advertencia': 'Fórmulas, figuras y orden de columnas requieren cotejo.'}
                    if usable and not force:
                        data.update(metodo='capa_texto_existente', texto=embedded, confianza=None,
                                    bloques=page.get_text('blocks', sort=True))
                    else:
                        if api is None:
                            api = tesserocr.PyTessBaseAPI(path='.tessdata', lang='spa', psm=tesserocr.PSM.AUTO)
                        scale = min(dpi / 72, 3500 / max(page.rect.width, page.rect.height))
                        pix = page.get_pixmap(matrix=pymupdf.Matrix(scale, scale), colorspace=pymupdf.csGRAY)
                        image = Image.frombytes('L', (pix.width, pix.height), pix.samples)
                        # A landscape scan normally contains two facing pages. Preserve both
                        # halves in reading order; retain the original PDF for visual checking.
                        split = pix.width > pix.height * 1.2
                        boxes = ([(0, 0, pix.width // 2, pix.height), (pix.width // 2, 0, pix.width, pix.height)]
                                 if split else [(0, 0, pix.width, pix.height)])
                        regions = []
                        for box in boxes:
                            api.SetImage(image.crop(box))
                            text = api.GetUTF8Text()
                            regions.append({'caja_px': box, 'texto': text, 'confianza': api.MeanTextConf(),
                                            'tsv': api.GetTSVText(number - 1)})
                            api.Clear()
                        data.update(metodo='tesseract_spa', texto='\n\n'.join(r['texto'] for r in regions),
                                    confianza=min(r['confianza'] for r in regions), regiones=regions,
                                    dimensiones_px=[pix.width, pix.height], division_doble_pagina=split,
                                    dpi_renderizado=scale * 72)
                    data['prioridad_revision'] = 'alta' if (len(data['texto'].strip()) < 100 or (data['confianza'] is not None and data['confianza'] < 80)) else 'normal'
                    save(out, data)
                summaries.append({k: data[k] for k in ['pagina_pdf', 'metodo', 'confianza', 'prioridad_revision', 'revision_visual']})
            result = {'id': source.stem, 'sha256': sha, 'paginas': len(doc),
                      'ocr_nuevo': sum(s['metodo'] == 'tesseract_spa' for s in summaries),
                      'capa_existente': sum(s['metodo'] == 'capa_texto_existente' for s in summaries),
                      'revision_prioritaria': [s['pagina_pdf'] for s in summaries if s['prioridad_revision'] == 'alta'],
                      'estado': 'procesado_sin_validacion_integral', 'detalle': summaries}
            save(dest / 'resumen.json', result)
            print(f'{source.stem}: {len(doc)} páginas; OCR nuevo {result["ocr_nuevo"]}', flush=True)
            return {k: v for k, v in result.items() if k != 'detalle'}
    finally:
        if api is not None:
            api.End()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--archivo', type=Path)
    parser.add_argument('--forzar-ocr', action='store_true')
    parser.add_argument('--dpi', type=int, default=200)
    parser.add_argument('--workers', type=int, default=3)
    args = parser.parse_args()
    files = [args.archivo] if args.archivo else sorted((ROOT / 'fuentes/libros/cuzcano').glob('*.pdf'))
    errors = []
    results = {}
    with ProcessPoolExecutor(max_workers=args.workers) as pool:
        futures = {pool.submit(process, (str(p), args.forzar_ocr, args.dpi)): p for p in files}
        for future in as_completed(futures):
            source = futures[future]
            try:
                result = future.result()
                results[result['id']] = result
            except Exception as error:
                errors.append({'id': source.stem, 'error': str(error)})
                print(f'ERROR {source.stem}: {error}', flush=True)
            save(ROOT / 'fuentes/cuzcano/procesamiento.json', sorted(results.values(), key=lambda r: r['id']))
            save(ROOT / 'fuentes/cuzcano/errores-ocr.json', errors)
    from estado_cuzcano import main as update_status
    from cola_revision_ocr import main as update_queue
    update_status()
    update_queue()
    if errors:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
