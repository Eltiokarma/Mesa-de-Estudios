from pathlib import Path
import sys
ROOT=Path(__file__).resolve().parents[1];sys.path.insert(0,str(ROOT/'.ocr-deps'))
from PIL import Image
d=ROOT/'fuentes/ocr-local/cuzcano'/sys.argv[1]
files=sorted(d.glob('qa-[0-9]*.png'),key=lambda p:int(p.stem.split('-')[1]))
for i in range(0,len(files),6):
 panel=Image.new('RGB',(1800,1620),'white')
 for j,p in enumerate(files[i:i+6]):
  im=Image.open(p);panel.paste(im,((j%2)*900,(j//2)*540))
 panel.save(d/f'panel-{i//6+1}.png')
print('Paneles',len(files))
