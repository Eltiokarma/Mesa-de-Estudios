"""Cierra la tanda de814 con identidad estable, observaciones y lectores locales."""
from pathlib import Path
from collections import Counter
from datetime import datetime,timezone
import json,html,hashlib,shutil
R=Path(__file__).resolve().parents[1];L=R/'fuentes/ocr-local/cuzcano';D=L/'cierre-multicurso-814';D.mkdir(exist_ok=True)
def read(p):return json.loads(p.read_text(encoding='utf8'))
def write(p,v):p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
base=read(L/'qa-multicurso-814/base-pre-tanda.json');progress=read(L/'qa-multicurso-814/avance.json')
assert base['total']==2399 and progress['completados']==progress['objetivo_nuevos']==814
entries={e['uid']:e for e in read(L/'archivo-ejercicios/indice.json')['ejercicios']};fresh=set();fichas=[];observations=[];pages=set()
for lot in progress['lotes']:
 d=L/lot['carpeta'];qa=read(d/'qa-visual.json');checks=read(d/'comprobaciones.json');ver=read(d/'verificacion.json')
 assert checks['ejercicios']==lot['cantidad'] and qa['mobile']['ancho_documento']==390 and qa['mobile']['imagenes_cargadas'] and not any(x['fuera_de_lienzo'] for x in qa['bounds'])
 assert ver['visual']['inspeccion_manual']
 for n in lot['numeros']:
  p=d/f'problema-{n}.json';f=read(p);src=f['fuente'];uid=f"{src['libro_id']}:{src['tipo']}:{n}"
  assert uid not in fresh and uid not in base['sha256_fichas'];fresh.add(uid)
  e={'uid':uid,'libro_id':src['libro_id'],'tipo':src['tipo'],'numero':n,'ficha':p.relative_to(L).as_posix(),'lector':f"{lot['carpeta']}/index.html"}
  entries[uid]=e;fichas.append({'uid':uid,'ficha_original':e['ficha'],'contenido':f});pages.update((src['libro_id'],x) for x in src['paginas_pdf'])
  if f.get('requiere_aclaracion_para_producto'):observations.append({'uid':uid,'estado':f['estado'],'resultado':f['resultado'],'resolucion':f['resolucion'],'revision':f['revision_propia']})
assert len(fresh)==814 and len(entries)==3213
for uid,sha in base['sha256_fichas'].items():assert hashlib.sha256((L/entries[uid]['ficha']).read_bytes()).hexdigest()==sha,uid
progress.update(estado='completado',fecha_cierre_utc=datetime.now(timezone.utc).isoformat());write(L/'qa-multicurso-814/avance.json',progress)
shutil.copyfile(L/'qa-multicurso-814/base-pre-tanda.json',D/'base-pre-tanda.json');write(D/'avance-lotes.json',progress)
coverage=read(L/'cobertura-temas/cobertura.json');plan=read(R/'fuentes/cuzcano/plan-cobertura-cursos.json')
assert coverage['total_fichas']==plan['total_fichas']==3213 and coverage['temas_con_minimo_de_revision']==18
by_topic={t['id']:t for t in coverage['temas']};names={'fisica':'Física','algebra':'Álgebra','geometria':'Geometría','aritmetica':'Aritmética','quimica':'Química','trigonometria':'Trigonometría','razonamiento-matematico':'Razonamiento matemático'}
style='<style>td:nth-child(2){min-width:115px}body{font:16px/1.6 system-ui;margin:0;color:#20364b;background:#edf3f8;overflow-wrap:anywhere}main{max-width:1150px;margin:auto;padding:20px}h1{line-height:1.2}a{color:#006a86}.tabla{overflow:auto}table{border-collapse:collapse;background:white;width:100%;min-width:700px}td,th{padding:11px;text-align:left;border-bottom:1px solid #ccd8e2}input{padding:8px;max-width:85%}aside{background:#fff4df;padding:15px}.nuevo{background:#e7f8ee}img{max-width:100%}</style>'
head='<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
filters='<script>function filtrar(){let q=document.getElementById("q").value.toLocaleLowerCase(),c=document.getElementById("c").checked;document.querySelectorAll("#fichas tbody tr").forEach(r=>r.hidden=!r.textContent.toLocaleLowerCase().includes(q)||(c&&r.dataset.cond!=="1"));}for(let id of ["q","c"])document.getElementById(id).oninput=filtrar;</script>'
search='<p><input id="q" type="search" aria-label="Buscar" placeholder="Buscar curso,tema o ejercicio"> <label><input id="c" type="checkbox">Solo con condiciones</label></p>'
def table(rows):return '<div class="tabla"><table id="fichas"><thead><tr><th>Curso y tema</th><th>Ejercicio</th><th>Título</th><th>Estado</th><th>Registro</th></tr></thead><tbody>'+''.join(rows)+'</tbody></table></div>'
allrows=[];summaries=[];files=['index.html','avance.json','avance-lotes.json','base-pre-tanda.json','fichas.json','condiciones.json','tabla-cursos.json']
for k in dict.fromkeys(lot['tema_id'] for lot in progress['lotes']):
 t=by_topic[k];es=[]
 for e in entries.values():
  f=read(L/e['ficha'])
  if f.get('cobertura',{}).get('tema_id')==k or (e['libro_id'] in t['libros_ids'] and not f.get('cobertura')):es.append((e,f))
 assert len(es)==100,(k,len(es))
 rows=[];newcount=flags=0;slug=k+'.html'
 for e,f in sorted(es,key=lambda z:(z[0]['uid'] not in fresh,z[0]['tipo'],z[0]['numero'])):
  new=e['uid'] in fresh;flag=bool(f.get('requiere_aclaracion_para_producto'));newcount+=new;flags+=flag
  row='<tr data-cond="'+str(int(flag))+'"'+(' class="nuevo"' if new else '')+'><td>'+html.escape(names[t['curso']]+' · '+t['nombre'])+'</td><td><a href="../'+e['lector']+'#p'+str(e['numero'])+'">'+e['tipo']+' '+str(e['numero'])+'</a></td><td>'+html.escape(f['tema'])+'</td><td>'+html.escape(f['estado'])+'</td><td>'+('Nuevo' if new else 'Anterior')+'</td></tr>'
  rows.append(row)
  if new:allrows.append(row)
 summary={'tema_id':k,'curso':t['curso'],'nombre':t['nombre'],'antes':100-newcount,'agregados':newcount,'revisados':100,'faltan_para_minimo':0,'observaciones_acumuladas':flags,'minimo_revision_alcanzado':True,'lector':slug};summaries.append(summary)
 (D/slug).write_text(head+'<title>'+html.escape(t['nombre'])+'</title>'+style+'<main><h1>'+html.escape(t['nombre'])+' ·100 revisados</h1><p>'+str(100-newcount)+' anteriores + '+str(newcount)+' nuevos.</p><aside>'+str(flags)+' conservan condiciones para producto. Las correcciones editoriales están en los pasos. Cien revisados no certifican el cuaderno completo.</aside><p><a href="index.html">Esta tanda</a> · <a href="../cobertura-temas/index.html">Cobertura completa</a></p>'+search+table(rows)+'</main>'+filters,encoding='utf8');files.append(slug)
assert len(allrows)==814 and len(summaries)==9
report={'fecha_utc':datetime.now(timezone.utc).isoformat(),'criterio_activo':'100_por_tema','estado':'completado','nuevos_revisados':814,'graficos_nuevos':814,'controles_nuevos':814,'archivo_acumulado':3213,'fichas_previas_preservadas':2399,'con_observaciones_en_nuevos':len(observations),'sin_observaciones_en_nuevos':814-len(observations),'temas':summaries,'cursos':plan['cursos'],'temas_con_minimo_de_revision':18,'paginas_con_fragmentos_cotejados':len(pages),'formatos':['JSON','HTML','SVG'],'ocr_repetido':False,'servicio_externo_para_calculo':False,'cuadernos_completos':False,'app_certificada':False,'lotes':progress['lotes'],'alcance':'14 aplicaciones de Cinemática II y100 nuevos en cada uno de los dos primeros temas monográficos de Aritmética,Química,RM y Trigonometría.','limite':'No completa los198 libros ni todos los temas;identidad por fuente,tipo y número,no deduplicación semántica entre libros.'}
write(D/'avance.json',report);write(D/'fichas.json',{'schema_version':1,'ejercicios':fichas});write(D/'condiciones.json',observations);write(D/'tabla-cursos.json',plan);write(R/'fuentes/cuzcano/avance-multicurso-814.json',report)
course_rows=''.join('<tr><td>'+names[c['curso']]+'</td><td>'+str(c['fichas_registradas'])+'</td><td>'+str(c['temas_con_minimo_revision'])+'</td></tr>' for c in plan['cursos'])
topic_rows=''.join('<tr><td>'+names[t['curso']]+'</td><td><a href="'+t['lector']+'">'+html.escape(t['nombre'])+'</a></td><td>'+str(t['antes'])+'</td><td>+'+str(t['agregados'])+'</td><td>100</td></tr>' for t in summaries)
doc=head+'<title>814 nuevos ·3213 guardados</title>'+style+'<main><h1>814 fichas nuevas guardadas</h1><p>Las 2399 anteriores se conservaron sin cambios. El archivo reúne 3213 fichas:enunciado trazable,solución propia por pasos y redibujo editable. Se reutilizaron los documentos y el OCR locales.</p><aside>'+str(len(observations))+' nuevas conservan condiciones o ambigüedades para producto. Las aproximaciones se distinguen de identidades exactas. No se declara terminado ningún cuaderno ni certificada la app.</aside><p><a href="fichas.json">JSON de las814</a> · <a href="condiciones.json">Condiciones y pasos</a> · <a href="avance.json">Avance</a> · <a href="../archivo-ejercicios/index.html">Archivo general</a> · <a href="../cobertura-temas/index.html">Todos los temas</a></p><h2>Acumulado por curso</h2><div class="tabla"><table><thead><tr><th>Curso</th><th>Fichas guardadas</th><th>Temas con100</th></tr></thead><tbody>'+course_rows+'<tr><th>Total</th><th>3213</th><th>18</th></tr></tbody></table></div><h2>Temas de esta tanda</h2><div class="tabla"><table><thead><tr><th>Curso</th><th>Tema</th><th>Antes</th><th>Nuevos</th><th>Ahora</th></tr></thead><tbody>'+topic_rows+'</tbody></table></div><p>532 fichas de cuadernos mixtos siguen pendientes de clasificación individual. El mapa inicial comprende123 temas y requiere ampliar el desglose de los libros generales.</p><h2>Redibujo de muestra</h2><img src="../piloto-trig-agudos-resueltos-50/figura-49.svg" alt="Cubo con centro de cara y solución mediante su sección diagonal"><h2>Las 814 nuevas</h2>'+search+table(allrows)+'</main>'+filters
(D/'index.html').write_text(doc,encoding='utf8')
if (D/'qa-lectores.json').exists():files.append('qa-lectores.json')
write(D/'dossier.json',{'titulo':'814 nuevos de cinco cursos y 3213 fichas acumuladas','lector':'index.html','archivos':files})
print(json.dumps({k:report[k] for k in ['nuevos_revisados','archivo_acumulado','con_observaciones_en_nuevos','temas_con_minimo_de_revision','cursos']},ensure_ascii=False))
