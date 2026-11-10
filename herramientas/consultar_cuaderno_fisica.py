"""Consulta reutilizando OCR existente y renderizando solamente la evidencia necesaria."""
from pathlib import Path
import sys,json,argparse
ROOT=Path(__file__).resolve().parents[1];sys.path.insert(0,str(ROOT/'.ocr-deps'));import fitz
p=argparse.ArgumentParser();p.add_argument('libro');p.add_argument('inicio',type=int);p.add_argument('fin',type=int);p.add_argument('--texto',action='store_true');a=p.parse_args()
local=ROOT/'fuentes/ocr-local/cuzcano';d=local/f'qa-fisica-extra-{a.libro}';d.mkdir(exist_ok=True)
with fitz.open(ROOT/f'fuentes/libros/cuzcano/{a.libro}.pdf') as pdf:
 for n in range(a.inicio,a.fin+1):
  out=d/f'p{n}.png'
  if not out.exists():
   page=pdf[n-1];page.get_pixmap(matrix=fitz.Matrix(1600/page.rect.width,1600/page.rect.width)).save(out)
  if a.texto:print('\nPDF',n,'\n'+json.loads((local/a.libro/f'p-{n:04d}.json').read_text(encoding='utf8'))['texto'])
