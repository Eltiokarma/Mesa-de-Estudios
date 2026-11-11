"""Consolida mil fichas de RM y acredita conservación de la base anterior."""
from pathlib import Path
from collections import Counter
from datetime import datetime,timezone
import json,html,hashlib,shutil
R=Path(__file__).resolve().parents[1];L=R/'fuentes/ocr-local/cuzcano';D=L/'cierre-rm-1000';D.mkdir(exist_ok=True)
def read(p):return json.loads(p.read_text(encoding='utf8'))
def write(p,v):p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
base=read(L/'qa-rm-1000/base-pre-tanda.json');progress=read(L/'qa-rm-1000/avance.json')
assert base['total']==len(base['sha256_fichas'])==3213 and progress['completados']==progress['objetivo_nuevos']==1000
entries={e['uid']:e for e in read(L/'archivo-ejercicios/indice.json')['ejercicios']};fresh=set();fichas=[];observations=[];pages=set();bytopic={}
for lot in progress['lotes']:
 d=L/lot['carpeta'];qa=read(d/'qa-visual.json');checks=read(d/'comprobaciones.json');ver=read(d/'verificacion.json')
 assert checks['ejercicios']==len(checks['controles'])==lot['cantidad']
 assert qa['mobile']['ancho_documento']==390 and qa['mobile']['imagenes_cargadas'] and not any(x['fuera_de_lienzo'] for x in qa['bounds']) and ver['visual']['inspeccion_manual']
 for n in lot['numeros']:
  p=d/f'problema-{n}.json';f=read(p);src=f['fuente'];uid=f"{src['libro_id']}:{src['tipo']}:{n}"
  assert uid not in fresh and uid not in base['sha256_fichas'];fresh.add(uid)
  e={'uid':uid,'libro_id':src['libro_id'],'tipo':src['tipo'],'numero':n,'ficha':p.relative_to(L).as_posix(),'lector':f"{lot['carpeta']}/index.html"}
  entries[uid]=e;fichas.append({'uid':uid,'ficha_original':e['ficha'],'contenido':f});bytopic.setdefault(lot['tema_id'],[]).append((e,f));pages.update((src['libro_id'],x) for x in src['paginas_pdf'])
  if f.get('requiere_aclaracion_para_producto'):observations.append({'uid':uid,'estado':f['estado'],'resultado':f['resultado'],'resolucion':f['resolucion'],'revision':f['revision_propia']})
assert len(fresh)==1000 and len(entries)==4213 and len(bytopic)==10
for uid,sha in base['sha256_fichas'].items():assert hashlib.sha256((L/entries[uid]['ficha']).read_bytes()).hexdigest()==sha,uid
coverage=read(L/'cobertura-temas/cobertura.json');plan=read(R/'fuentes/cuzcano/plan-cobertura-cursos.json')
assert coverage['total_fichas']==plan['total_fichas']==4213 and coverage['temas_con_minimo_de_revision']==28
assert next(c for c in plan['cursos'] if c['curso']=='razonamiento-matematico')['fichas_registradas']==1202
progress.update(estado='completado',fecha_cierre_utc=datetime.now(timezone.utc).isoformat());write(L/'qa-rm-1000/avance.json',progress)
shutil.copyfile(L/'qa-rm-1000/base-pre-tanda.json',D/'base-pre-tanda.json');write(D/'avance-lotes.json',progress)
names={'fisica':'Física','algebra':'Álgebra','geometria':'Geometría','aritmetica':'Aritmética','quimica':'Química','trigonometria':'Trigonometría','razonamiento-matematico':'Razonamiento matemático'}
topics={t['id']:t for t in coverage['temas']}
head='<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
style='<style>body{font:16px/1.6 system-ui;margin:0;color:#20364b;background:#edf3f8;overflow-wrap:anywhere}main{max-width:1150px;margin:auto;padding:20px}h1{line-height:1.2}a{color:#006a86}.tabla{overflow:auto}table{border-collapse:collapse;background:white;width:100%;min-width:720px}td,th{padding:11px;text-align:left;border-bottom:1px solid #ccd8e2}input{padding:8px;max-width:85%}aside{background:#fff4df;padding:15px}img{max-width:100%}</style>'
filters='<script>function filtrar(){let q=document.getElementById("q").value.toLocaleLowerCase(),c=document.getElementById("c").checked;document.querySelectorAll("#fichas tbody tr").forEach(r=>r.hidden=!r.textContent.toLocaleLowerCase().includes(q)||(c&&r.dataset.cond!=="1"));}for(let id of ["q","c"])document.getElementById(id).oninput=filtrar;</script>'
search='<p><input id="q" type="search" aria-label="Buscar" placeholder="Buscar tema o ejercicio"> <label><input id="c" type="checkbox">Solo con condiciones</label></p>'
def table(rows):return '<div class="tabla"><table id="fichas"><thead><tr><th>Tema</th><th>Ejercicio</th><th>Título</th><th>Estado</th><th>Subtema</th></tr></thead><tbody>'+''.join(rows)+'</tbody></table></div>'
allrows=[];summaries=[];files=['index.html','avance.json','avance-lotes.json','base-pre-tanda.json','fichas.json','condiciones.json','tabla-cursos.json','subtemas.json'];subtopics=[]
for k,xs in bytopic.items():
 t=topics[k];assert len(xs)==t['revisados']==100
 rows=[];sub=Counter();flags=0;slug=k+'.html'
 for e,f in sorted(xs,key=lambda z:(z[0]['tipo'],z[0]['numero'])):
  flag=bool(f.get('requiere_aclaracion_para_producto'));flags+=flag;tag=f['cobertura']['subtema_id'];sub[tag]+=1
  row='<tr data-cond="'+str(int(flag))+'"><td>'+html.escape(t['nombre'])+'</td><td><a href="../'+e['lector']+'#p'+str(e['numero'])+'">'+e['tipo']+' '+str(e['numero'])+'</a></td><td>'+html.escape(f['tema'])+'</td><td>'+html.escape(f['estado'])+'</td><td>'+html.escape(tag)+'</td></tr>'
  rows.append(row);allrows.append(row)
 summary={'tema_id':k,'curso':t['curso'],'nombre':t['nombre'],'antes':0,'agregados':100,'revisados':100,'faltan_para_minimo':0,'observaciones_acumuladas':flags,'minimo_revision_alcanzado':True,'lector':slug,'subtemas':dict(sorted(sub.items()))};summaries.append(summary)
 subtopics.extend({'tema_id':k,'subtema_id':tag,'fichas':cnt} for tag,cnt in sorted(sub.items()))
 (D/slug).write_text(head+'<title>'+html.escape(t['nombre'])+'</title>'+style+'<main><h1>'+html.escape(t['nombre'])+' · 100 nuevos</h1><aside>'+str(flags)+' conservan condiciones para producto. Las correcciones editoriales están en los pasos.</aside><p><a href="index.html">Esta tanda</a> · <a href="../cobertura-temas/index.html">Cobertura completa</a></p>'+search+table(rows)+'</main>'+filters,encoding='utf8');files.append(slug)
assert len(allrows)==1000 and sum(x['fichas'] for x in subtopics)==1000
report={'fecha_utc':datetime.now(timezone.utc).isoformat(),'criterio_activo':'100_por_tema','estado':'completado','nuevos_revisados':1000,'recursos_visuales_nuevos':1000,'controles_nuevos':1000,'archivo_acumulado':4213,'rm_acumulado':1202,'fichas_previas_preservadas':3213,'con_observaciones_en_nuevos':len(observations),'sin_observaciones_en_nuevos':1000-len(observations),'temas':summaries,'cursos':plan['cursos'],'temas_con_minimo_de_revision':28,'paginas_con_fragmentos_cotejados':len(pages),'formatos':['JSON','HTML','SVG'],'ocr_repetido':False,'servicio_externo_para_calculo':False,'cuadernos_completos':False,'app_certificada':False,'lotes':progress['lotes'],'alcance':'1000 ejercicios nuevos del material original de RM: cien en cada uno de diez temas monográficos. Soluciones propias, redibujos de figuras y tarjetas de relaciones para ejercicios sin figura.','limite':'No completa los198 libros ni todos los temas o subtemas; identidad por fuente,tipo y número, sin deduplicación semántica entre libros.'}
write(D/'avance.json',report);write(D/'fichas.json',{'schema_version':1,'ejercicios':fichas});write(D/'condiciones.json',observations);write(D/'tabla-cursos.json',plan);write(D/'subtemas.json',subtopics);write(R/'fuentes/cuzcano/avance-rm-1000.json',report)
cr=''.join('<tr><td>'+names[c['curso']]+'</td><td>'+str(c['fichas_registradas'])+'</td><td>'+str(c['temas_con_minimo_revision'])+'</td></tr>' for c in plan['cursos'])
tr=''.join('<tr><td><a href="'+t['lector']+'">'+html.escape(t['nombre'])+'</a></td><td>100</td><td>'+str(t['observaciones_acumuladas'])+'</td></tr>' for t in summaries)
doc=head+'<title>1000 nuevos de RM · 4213 guardados</title>'+style+'<main><h1>1000 ejercicios nuevos de RM guardados</h1><p>Diez temas con cien nuevos cada uno. Las 3213 fichas anteriores se conservaron sin cambios. Razonamiento Matemático acumula 1202 y el archivo general, 4213. Se reutilizaron los documentos y el OCR locales.</p><aside>'+str(len(observations))+' nuevas conservan condiciones o ambigüedades para producto. Los gráficos originales se redibujan; los ejercicios sin figura incluyen tarjetas de relaciones. Cada ficha conserva solución propia por pasos y control local. Cien por tema no equivalen a cien por subtema ni al cuaderno completo.</aside><p><a href="fichas.json">JSON de las 1000</a> · <a href="condiciones.json">Condiciones</a> · <a href="subtemas.json">Distribución por subtema</a> · <a href="avance.json">Avance</a> · <a href="../archivo-ejercicios/index.html">Archivo general</a> · <a href="../cobertura-temas/index.html">Todos los temas</a></p><h2>Acumulado por curso</h2><div class="tabla"><table><thead><tr><th>Curso</th><th>Fichas</th><th>Temas con 100</th></tr></thead><tbody>'+cr+'<tr><th>Total</th><th>4213</th><th>28</th></tr></tbody></table></div><h2>Temas de esta tanda</h2><div class="tabla"><table><thead><tr><th>Tema</th><th>Nuevos</th><th>Con observaciones</th></tr></thead><tbody>'+tr+'</tbody></table></div><p>532 fichas de cuadernos mixtos siguen pendientes de clasificación individual; el mapa inicial contiene 123 temas y requiere ampliar el desglose de libros generales.</p><h2>Redibujo de muestra</h2><img src="../piloto-rm-probabilidades-resueltos-100/figura-92.svg" alt="Red de caminos con puente superior, nodos y rutas alternativas"><h2>Las 1000 nuevas</h2>'+search+table(allrows)+'</main>'+filters
(D/'index.html').write_text(doc,encoding='utf8')
if (D/'qa-lectores.json').exists():files.append('qa-lectores.json')
write(D/'dossier.json',{'titulo':'1000 nuevos de RM y 4213 fichas acumuladas','lector':'index.html','archivos':files})
print(json.dumps({k:report[k] for k in ['nuevos_revisados','archivo_acumulado','con_observaciones_en_nuevos','temas_con_minimo_de_revision','cursos']},ensure_ascii=False))
