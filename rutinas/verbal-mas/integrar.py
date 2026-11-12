# python3 rutinas/verbal-mas/integrar.py <indice> t139 t140 …  → agrega al índice los aprobados
import json,sys
p=f'contenido/razonamiento-verbal/indice-{sys.argv[1]}.json';d=json.load(open(p))
for t in sys.argv[2:]:
  r=json.load(open(f'contenido/razonamiento-verbal/textos/{t}.json'))['revision']
  assert r and r['veredicto']=='aprobado', t
  if t not in d['textos']: d['textos'].append(t)
open(p,'w').write(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
print(len(d['textos']),'textos en',p)
