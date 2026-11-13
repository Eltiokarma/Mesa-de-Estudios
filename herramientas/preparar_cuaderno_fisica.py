"""Construye un bloque con identidad de libro explícita, sin ejecutar OCR."""
from pathlib import Path
import sys,shutil,subprocess,os,json,argparse
ROOT=Path(__file__).resolve().parents[1];LOCAL=ROOT/'fuentes/ocr-local/cuzcano'
p=argparse.ArgumentParser();p.add_argument('datos');p.add_argument('carpeta');a=p.parse_args()
d=(LOCAL/a.carpeta).resolve();assert d.is_relative_to(LOCAL.resolve());d.mkdir(exist_ok=True)
src=(ROOT/'herramientas'/a.datos).read_text(encoding='utf8').replace('from base_lote_fisica import *','from base_lote import *')
(d/'datos.py').write_text(src,encoding='utf8')
shutil.copyfile(ROOT/'herramientas/base_lote_fisica.py',d/'base_lote.py')
shutil.copyfile(ROOT/'herramientas/verificar_lote_fisica.py',d/'verificar.py')
shutil.copyfile(LOCAL/'piloto-fisica-preuni-481-500/qa.cjs',d/'qa.cjs')
subprocess.run([sys.executable,'-X','utf8',str(d/'datos.py'),str(d)],check=True)
subprocess.run([sys.executable,'-X','utf8',str(d/'verificar.py')],check=True)
env=os.environ.copy();env['NODE_PATH']='C:/Program Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1105-1297-0_26.1105.1297.0_x64__3k8sg7r9htsxt/dependencies/node/node_modules'
subprocess.run(['node',str(d/'qa.cjs'),str(d)],env=env,check=True)
