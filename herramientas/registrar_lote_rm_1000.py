"""Registra bloques revisados por tema conservando las fichas anteriores."""
import argparse,json,hashlib
from pathlib import Path
from datetime import datetime,timezone
R=Path(__file__).resolve().parents[1];L=R/'fuentes/ocr-local/cuzcano';P=L/'qa-rm-1000/avance.json'
def read(p):return json.loads(p.read_text(encoding='utf8'))
def write(p,v):p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
a=argparse.ArgumentParser();a.add_argument('carpeta');a.add_argument('--inspeccion-completa',required=True,action='store_true');args=a.parse_args();D=(L/args.carpeta).resolve();assert D.is_relative_to(L.resolve())
base=read(L/'qa-rm-1000/base-pre-tanda.json');old=set(base['sha256_fichas']);assert base['total']==3213
progress=read(P) if P.exists() else {'criterio_activo':'100_por_tema','base_inicial':base['total'],'lotes':[]}
qa=read(D/'qa-visual.json');check=read(D/'comprobaciones.json');ver=read(D/'verificacion.json');fichas=[(p,read(p)) for p in D.glob('problema-*.json')]
assert len(fichas)==check['ejercicios']==len(check['controles'])
assert qa['mobile']['ancho_documento']==390 and qa['mobile']['imagenes_cargadas'] and not any(x['fuera_de_lienzo'] for x in qa['bounds'])
books={f['fuente']['libro_id'] for p,f in fichas};kinds={f['fuente']['tipo'] for p,f in fichas};themes={f['cobertura']['tema_id'] for p,f in fichas};assert len(books)==len(kinds)==len(themes)==1
book=next(iter(books));kind=next(iter(kinds));theme=next(iter(themes));nums=sorted(f['fuente']['numero'] for p,f in fichas);assert len(nums)==len(set(nums))
uids={f'{book}:{kind}:{n}' for n in nums};assert not uids.intersection(old)
ver.update(visual={'inspeccion_manual':'Todos los redibujos inspeccionados; fuente, magnitudes, flechas, ejes, unidades y condiciones cotejados.','qa':qa},matematica=check);write(D/'verificacion.json',ver)
queue=read(L/'cola-revision.json');pages=sorted({n for p,f in fichas for n in f['fuente']['paginas_pdf']})
for n in pages:
 raw=L/book/f'p-{n:04d}.json';sha=hashlib.sha256(raw.read_bytes()).hexdigest();assert sha==ver['sha256_ocr_original'][f'{book}/{raw.name}']
 side=f'revision-bulk-{kind}-{nums[0]}-{nums[-1]}-{n:04d}.json';write(L/book/side,{'pagina_pdf':n,'estado':'parcial','alcance':f'Ejercicios de aplicación seleccionados: {nums}; enunciados y soluciones propias.','sha256_ocr_original':sha,'pagina_completa_validada':False,'fichas_locales':[f'../{D.name}/{p.name}' for p,f in fichas if n in f['fuente']['paginas_pdf']]})
 for item in queue:
  if item['id']==book and item['pagina_pdf']==n:item['revision_parcial_existente']=True;item['registros_revision']=list(dict.fromkeys(item.get('registros_revision',[])+[side]))
queue.sort(key=lambda x:(bool(x.get('revision_parcial_existente')),x['confianza'],x['id'],x['pagina_pdf']));write(L/'cola-revision.json',queue)
lot={'carpeta':D.name,'libro_id':book,'libro':fichas[0][1]['fuente']['libro_titulo'],'tema_id':theme,'tipo':kind,'numeros':nums,'cantidad':len(nums),'paginas_pdf':pages,'estado':'revisado_y_comprobado'}
progress['lotes']=[x for x in progress['lotes'] if x['carpeta']!=D.name]+[lot]
newuids=[f'{x["libro_id"]}:{x["tipo"]}:{n}' for x in progress['lotes'] for n in x['numeros']];assert len(newuids)==len(set(newuids));progress.update(completados=len(newuids),fecha_utc=datetime.now(timezone.utc).isoformat());assert len(newuids)<=progress['objetivo_nuevos'];write(P,progress)
print(json.dumps({'bloque':D.name,'revisados':len(nums),'acumulado_tanda':len(newuids)},ensure_ascii=False))
