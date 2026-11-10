"""Controles autocontenidos; no modifica fichas ni necesita el PDF o el OCR."""
import json,math
from pathlib import Path
from datos import E
from base_lote import solve_net
def close(a,b):return math.isclose(a,b,rel_tol=1e-8,abs_tol=1e-12)
D=Path(__file__).resolve().parent
for e in E:
 exec(e['control'],{'math':math,'close':close,'S':math.sqrt,'pi':math.pi,'solve_net':solve_net})
 f=json.loads((D/f'problema-{e["numero"]}.json').read_text(encoding='utf-8'))
 assert f['resolucion']['pasos']==e['pasos'] and len(e['pasos'])==3
 assert f['resultado']['expresion']==e['resultado']
 assert (D/f['grafico']['archivo']).is_file()
print(json.dumps({'ejercicios':len(E),'controles':'correctos','dependencias_externas':False}))
