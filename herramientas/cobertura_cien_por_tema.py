"""Inventario temático trazable; no altera fichas ni ejecuta OCR."""
from pathlib import Path
from collections import Counter
from datetime import datetime,timezone
import json,html,re,unicodedata,shutil
ROOT=Path(__file__).resolve().parents[1];L=ROOT/'fuentes/ocr-local/cuzcano';D=L/'cobertura-temas';D.mkdir(exist_ok=True)
def read(p):return json.loads(p.read_text(encoding='utf8'))
def write(p,v):p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
def slug(s):return re.sub('[^a-z0-9]+','-',unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().lower()).strip('-')
inv=read(ROOT/'fuentes/cuzcano/inventario.json')['libros'];books={b['id']:b for b in inv};courses={b['id']:b['curso_inferido'] for b in read(ROOT/'fuentes/cuzcano/cobertura-catalogo.json')['libros']}
# Títulos monográficos y alias; los volúmenes generales requieren desglose posterior.
alias={
 'Fascículo 1: Análisis dimensional':'Análisis dimensional','Fascículo 2: Análisis vectorial':'Análisis vectorial','Fascículo 4: Cinemática II':'Cinemática II (MVCL y MPCL)','Fascículo 5: Gráficas del movimiento mecánico':'Análisis de gráficas del movimiento mecánico','Fascículo 8: Dinámica':'Dinámica','Fascículo 9: Sistemas de referencia y gravitación universal':'Gravitación universal','Fascículo 11: Cantidad de movimiento, impulsión y choques':'Cantidad de movimiento, impulso y choques','Fascículo 13: Ondas mecánicas':'Ondas mecánicas',
 'Mecánica de fluidos':'Hidrostática e hidrodinámica','La recta':'La línea recta','Áreas de regiones planas':'Áreas de regiones poligonales y circulares','Proporcionalidad y semejanza':'Proporcionalidad de segmentos y semejanza de triángulos','Arcos múltiples: doble, mitad y triple':'Identidades de arcos múltiples','Funciones trigonométricas':'Funciones trigonométricas directas','Regla de mezcla':'Regla de mezcla y aleación'}
general=re.compile(r'^(Solucionario|Material de estudio|Álgebra$|Aritmética(?: I| II)?$|Física$|Geometría(?: I| II)?$|Química(?: I| II)?$|Trigonometría$|Geometría del espacio)')
# No se atribuye todo un volumen mixto a una sola materia específica.
topics={};book_topic={};mixed=[]
def topic(course,name):
 k=course+'.'+slug(name)
 topics.setdefault(k,dict(id=k,curso=course,nombre=name,objetivo_minimo=100,libros_ids=[]));return k
for b in inv:
 course=courses[b['id']];title=b['titulo']
 if general.search(title):mixed.append({'libro_id':b['id'],'curso':course,'titulo':title});continue
 title=alias.get(title,title);k=topic(course,title);book_topic[b['id']]=k;topics[k]['libros_ids'].append(b['id'])
extra={
 'algebra':['Polinomios y grados','Productos notables e identidades','División polinómica y restos','Cocientes notables','Factorización','MCD y MCM de polinomios','Radicales y racionalización','Potenciación y ecuaciones exponenciales','Sucesiones y series','Números complejos'],
 'quimica':['Estructura atómica','Tabla periódica','Enlace químico','Nomenclatura inorgánica','Reacciones químicas','Estequiometría','Soluciones','Equilibrio químico','Electroquímica','Química orgánica']}
for course,names in extra.items():
 for name in names:topic(course,name)
# Mantener ID estable y corto del tema nuevo explícito en las fichas.
assert 'algebra.logaritmos' in topics
index=read(L/'archivo-ejercicios/indice.json')['ejercicios'];entries={e['uid']:e for e in index}
progress=read(L/'qa-algebra-1000/avance-1000.json')
for lot in progress['lotes']:
 for n in lot['numeros']:
  p=L/lot['carpeta']/f'problema-{n}.json';f=read(p);s=f['fuente'];uid=f"{s['libro_id']}:{s['tipo']}:{n}"
  entries[uid]={'uid':uid,'libro_id':s['libro_id'],'tipo':s['tipo'],'numero':n,'tema':f['tema'],'ficha':p.relative_to(L).as_posix(),'lector':f"{lot['carpeta']}/index.html"}
extra_progress=L/'qa-fisica-temas/avance.json'
if extra_progress.exists():
 for lot in read(extra_progress)['lotes']:
  for n in lot['numeros']:
   p=L/lot['carpeta']/f'problema-{n}.json';f=read(p);src=f['fuente'];uid=f"{src['libro_id']}:{src['tipo']}:{n}"
   entries[uid]={'uid':uid,'libro_id':src['libro_id'],'tipo':src['tipo'],'numero':n,'tema':f['tema'],'ficha':p.relative_to(L).as_posix(),'lector':f"{lot['carpeta']}/index.html"}
bulk_progress=L/'qa-fisica-bulk-100/avance.json'
if bulk_progress.exists():
 for lot in read(bulk_progress)['lotes']:
  for n in lot['numeros']:
   p=L/lot['carpeta']/f'problema-{n}.json';f=read(p);src=f['fuente'];uid=f"{src['libro_id']}:{src['tipo']}:{n}"
   entries[uid]={'uid':uid,'libro_id':src['libro_id'],'tipo':src['tipo'],'numero':n,'tema':f['tema'],'ficha':p.relative_to(L).as_posix(),'lector':f"{lot['carpeta']}/index.html"}
multicourse=L/'qa-multicurso-814/avance.json'
if multicourse.exists():
 for lot in read(multicourse)['lotes']:
  for n in lot['numeros']:
   p=L/lot['carpeta']/f'problema-{n}.json';f=read(p);src=f['fuente'];uid=f"{src['libro_id']}:{src['tipo']}:{n}"
   entries[uid]={'uid':uid,'libro_id':src['libro_id'],'tipo':src['tipo'],'numero':n,'tema':f['tema'],'ficha':p.relative_to(L).as_posix(),'lector':f"{lot['carpeta']}/index.html"}
assert len(entries)>=2274
assign=[];unassigned=[]
oldbook='1GQxXnXKRDrb8SFKemkA-ggcOGep1KE44'
ranges=[(207,208,'Relaciones y funciones I'),(209,226,'Polinomios y grados'),(227,236,'Productos notables e identidades'),(237,259,'División polinómica y restos'),(260,267,'Cocientes notables'),(268,276,'Factorización'),(277,285,'MCD y MCM de polinomios'),(286,296,'Radicales y racionalización'),(297,306,'Teoría de las ecuaciones')]
for uid,e in sorted(entries.items()):
 f=read(L/e['ficha']);bid=e['libro_id'];k=f.get('cobertura',{}).get('tema_id');method='clasificacion_explicita_en_ficha'
 if not k and bid==oldbook:
  if e['tipo']=='problema':k=topic('algebra','Polinomios y grados')
  else:
   for low,high,name in ranges:
    if low<=e['numero']<=high:k=topic('algebra',name);break
  method='clasificacion_de_lote_y_contenido_previo'
 if not k and bid in book_topic:k=book_topic[bid];method='cuaderno_monografico_revision_heredada'
 if not k:unassigned.append({'uid':uid,'curso':courses[bid],'ficha':e['ficha'],'motivo':'Cuaderno general o mixto; falta asignación temática individual.'});continue
 assert k in topics,k
 assign.append({'uid':uid,'tema_id':k,'subtema_id':f.get('cobertura',{}).get('subtema_id'),'metodo':method,'ficha':e['ficha'],'lector':e['lector']+'#p'+str(e['numero']),'condicionado':bool(f.get('requiere_aclaracion_para_producto',False))})
assert len(assign)+len(unassigned)==len(entries) and len({a['uid'] for a in assign})==len(assign)
for k,t in topics.items():
 xs=[a for a in assign if a['tema_id']==k];cnt=len(xs);cond=sum(a['condicionado'] for a in xs)
 t.update(revisados=cnt,con_observaciones=cond,sin_observaciones_registradas=cnt-cond,faltan_para_minimo=max(0,100-cnt),porcentaje_minimo=min(100,cnt),minimo_revision_alcanzado=cnt>=100,certificado_para_app=False)
ordered=sorted(topics.values(),key=lambda t:(t['curso'],t['nombre']))
coverage={'schema_version':1,'fecha_utc':datetime.now(timezone.utc).isoformat(),'criterio_activo':'100_por_tema','minimo_por_tema':100,'total_fichas':len(entries),'asignadas_a_un_tema_principal':len(assign),'sin_clasificacion_tematica_individual':len(unassigned),'temas_inventariados':len(topics),'temas_con_minimo_de_revision':sum(t['minimo_revision_alcanzado'] for t in ordered),'catalogo_temas_exhaustivo':False,'todos_los_temas_completados':False,'porcentaje_global':None,'limites':['Mapa inicial de títulos monográficos y temas generales. Los cuadernos mixtos aún requieren desglose; no se declara un porcentaje global de toda la colección.','Un UID cuenta una vez en un tema principal. Los subtemas no vuelven a sumar ejercicios.','Identidad por fuente, tipo y número; no supone deduplicación semántica entre libros distintos.','La clasificación por cuaderno reutiliza revisiones anteriores; no declara un nuevo cotejo visual de esas fichas.','Cien revisados no equivalen a cien aptos para producto. Las observaciones y el dominio se conservan.'],'temas':ordered}
write(D/'cobertura.json',coverage);write(D/'asignaciones.json',assign);write(D/'sin-clasificar.json',unassigned);write(D/'cuadernos-generales-pendientes.json',mixed)
log=[a for a in assign if a['tema_id']=='algebra.logaritmos'];assert len(log)==100
logrows=[];sub=Counter();visuals=Counter();pages=set()
for a in log:
 f=read(L/a['ficha']);s=f['fuente'];sub[a['subtema_id']]+=1;pages.update(s['paginas_pdf']);p=L/a['ficha'];model=read(p.parent/'modelos.json')[str(s['numero'])] if (p.parent/'modelos.json').exists() else None
 # Los modelos gráficos se preservan también en las fichas y SVG del bloque.
 visual='tarjeta_relaciones'
 # Determinar recurso sin ejecutar datos ni repetir controles.
 svg=(p.parent/f'problema-{s["numero"]}.svg')
 candidates=list(p.parent.glob(f'*{s["numero"]}*.svg'))
 texts=''.join(c.read_text(encoding='utf8') for c in candidates if c.stem.endswith(str(s['numero'])))
 if 'Círculo vacío:' in texts:visual='recta_intervalos'
 elif 'RELACIONES DEL PROBLEMA' not in texts:visual='grafica_o_tabla'
 visuals[visual]+=1
 logrows.append('<tr data-cond="'+str(int(a['condicionado']))+'"><td><a href="../'+a['lector']+'">'+s['tipo']+' '+str(s['numero'])+'</a></td><td>'+html.escape(f['tema'])+'</td><td>'+html.escape(a['subtema_id'])+'</td><td>'+html.escape(f['estado'])+'</td></tr>')
newreport={'curso':'algebra','tema_id':'algebra.logaritmos','objetivo_minimo':100,'revisados':100,'con_observaciones_para_producto':sum(a['condicionado'] for a in log),'sin_observaciones_registradas':sum(not a['condicionado'] for a in log),'minimo_revision_alcanzado':True,'app_certificada':False,'cuaderno_completo':False,'subtemas':dict(sub),'recursos_visuales':dict(visuals),'paginas_con_fragmentos_cotejados':len(pages),'ocr_repetido':False,'servicio_externo_para_calculo':False,'formatos':['JSON','HTML','SVG'],'lotes':[x for x in progress['lotes'] if x['libro_id']=='1FD6VVJj3IJEEeLIcsuEUoap-gc2DzPSc'],'seleccion_no_consecutiva':True,'omitidos_entre_1_y_82':[56,57,60,66,68,71,80],'ejemplos':[29,30,31,32]+list(range(34,55)),'nota_numeracion':'El original salta del ejemplo 32 al 34; no se creó un ejemplo 33. Los resueltos se numeran de forma independiente de los ejemplos.'}
write(D/'avance-logaritmos.json',newreport);write(ROOT/'fuentes/cuzcano/avance-logaritmos-100.json',newreport)
write(D/'incidencias-seleccion.json',{'cuaderno_completo':False,'no_convertidos_en_esta_tanda':newreport['omitidos_entre_1_y_82'],'motivo':'Selección de bloques para variedad del tema; estos números siguen pendientes y no cuentan como revisados.','observaciones':[{'uid':a['uid'],'ficha':a['ficha'],'revision':read(L/a['ficha'])['revision_propia']} for a in log if a['condicionado']]})
shutil.copyfile(L/'qa-logaritmos-100/base-pre-tanda.json',D/'base-pre-logaritmos.json')
style='<style>body{font:16px/1.6 system-ui;background:#edf3f8;color:#20364b;margin:0;overflow-wrap:anywhere}main{max-width:1150px;margin:auto;padding:20px}h1{line-height:1.2}.tabla{overflow:auto}table{border-collapse:collapse;background:white;min-width:740px;width:100%}td,th{padding:10px;text-align:left;border-bottom:1px solid #cad8e4}a{color:#006a86}input{max-width:85%;padding:9px}.destacado{background:#fff;border-radius:12px;padding:18px}</style>'
head='<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
filterjs='<script>function filtrar(){let q=document.getElementById("q").value.toLocaleLowerCase();let c=document.getElementById("c");document.querySelectorAll("tbody tr").forEach(r=>r.hidden=!r.textContent.toLocaleLowerCase().includes(q)||(c&&c.checked&&r.dataset.cond!=="1"));}document.getElementById("q").oninput=filtrar;if(document.getElementById("c"))document.getElementById("c").onchange=filtrar;</script>'
rows=[]
for t in ordered:
 link=' · <a href="logaritmos.html">Abrir 100 fichas</a>' if t['id']=='algebra.logaritmos' else ''
 if t['id'] in ['fisica.electrostatica','fisica.termodinamica'] and t['revisados']>=100:
  link=' · <a href="../cierre-fisica-temas-100/'+t['id'].split('.')[1]+'.html">Abrir 100 fichas</a>' 
 if t['id'] in {'fisica.cantidad-de-movimiento-impulso-y-choques':'momentum','fisica.cinematica-i-mru-y-mruv':'cinematica1','fisica.cinematica-ii-mvcl-y-mpcl':'cinematica2'}:
  slug_bulk={'fisica.cantidad-de-movimiento-impulso-y-choques':'momentum','fisica.cinematica-i-mru-y-mruv':'cinematica1','fisica.cinematica-ii-mvcl-y-mpcl':'cinematica2'}[t['id']];link=' · <a href="../cierre-fisica-bulk-100/'+slug_bulk+'.html">Abrir fichas</a>'
 rows.append('<tr><td>'+html.escape(t['curso'])+'</td><td>'+html.escape(t['nombre'])+link+'</td><td>'+str(t['revisados'])+'/100</td><td>'+str(t['faltan_para_minimo'])+'</td><td>'+str(t['con_observaciones'])+'</td></tr>')
doc=head+'<title>Cobertura: 100 por tema</title>'+style+'<main><h1>Objetivo: 100 ejercicios por tema</h1><p class="destacado"><strong>Logaritmos: 100 revisados.</strong> '+str(newreport['con_observaciones_para_producto'])+' conservan observaciones para producto. <a href="logaritmos.html">Abrir esta tanda</a>.</p><p>'+str(len(entries))+' fichas guardadas; '+str(len(assign))+' asignadas a un tema principal y '+str(len(unassigned))+' de cuadernos mixtos pendientes de clasificación. No se repite OCR.</p><p>Mapa inicial de '+str(len(ordered))+' temas: '+str(coverage['temas_con_minimo_de_revision'])+' alcanzan el mínimo de revisión. El inventario todavía requiere el desglose de los cuadernos generales; no es un porcentaje de toda la colección. Las observaciones no se ocultan ni se convierten en aprobación de la app.</p><p><a href="cobertura.json">Cobertura JSON</a> · <a href="asignaciones.json">Asignaciones</a> · <a href="sin-clasificar.json">Pendientes de clasificación</a> · <a href="../archivo-ejercicios/index.html">Archivo de fichas</a></p><p><input id="q" type="search" aria-label="Buscar tema" placeholder="Buscar curso o tema"></p><div class="tabla"><table><thead><tr><th>Curso</th><th>Tema</th><th>Revisados</th><th>Faltan</th><th>Observaciones</th></tr></thead><tbody>'+''.join(rows)+'</tbody></table></div><p><strong>Electrostática y Termodinámica alcanzan 100 revisados cada una.</strong> <a href="../cierre-fisica-temas-100/index.html">Abrir los dos temas y los 25 nuevos</a>.</p><p>Siguiente prioridad: Cinemática II, con 86 guardados y 14 pendientes para el mínimo. Consultar primero el índice para evitar repeticiones.</p></main>'+filterjs
if multicourse.exists():
 doc=doc.replace('<p>Siguiente prioridad: Cinemática II, con 86 guardados y 14 pendientes para el mínimo. Consultar primero el índice para evitar repeticiones.</p>','<p><a href="../cierre-multicurso-814/index.html">Última tanda:814 nuevos de cinco cursos</a>. Cinemática II alcanza100;Aritmética,Química,RM y Trigonometría suman100 en cada uno de sus dos primeros temas monográficos. Siguiente prioridad:los temas con déficit de esta tabla.</p>')
(D/'index.html').write_text(doc,encoding='utf8')
doc=head+'<title>Logaritmos · 100 revisados</title>'+style+'<main><h1>Logaritmos · 100 ejercicios revisados</h1><p>75 problemas de la sección de resueltos y 25 ejemplos trabajados. Cada ficha conserva tres pasos de resolución propia, dominio real, evidencia, control matemático y SVG editable. Los ejemplos y resueltos tienen numeración independiente.</p><p><strong>'+str(newreport['sin_observaciones_registradas'])+' sin observaciones registradas; '+str(newreport['con_observaciones_para_producto'])+' con condiciones o discrepancias.</strong> Se separan raíces extráneas, raíces omitidas, parámetros y premisas incompatibles. El ejemplo 45 corrige el extremo editorial 2/5 por 5/2.</p><p>La selección cubre propiedades, ecuaciones, sistemas, dominio e inecuaciones; no certifica el cuaderno completo.</p><p><a href="avance-logaritmos.json">Avance JSON</a> · <a href="incidencias-seleccion.json">Observaciones y pendientes</a> · <a href="index.html">Todos los temas</a></p><p><input id="q" type="search" aria-label="Buscar ejercicio" placeholder="Buscar número o subtema"> <label><input id="c" type="checkbox"> Sólo con observaciones</label></p><div class="tabla"><table><thead><tr><th>Ejercicio</th><th>Título</th><th>Subtema</th><th>Estado</th></tr></thead><tbody>'+''.join(logrows)+'</tbody></table></div></main>'+filterjs
(D/'logaritmos.html').write_text(doc,encoding='utf8')
write(D/'dossier.json',{'titulo':'Cobertura: al menos 100 ejercicios por tema','lector':'index.html','archivos':['index.html','logaritmos.html','cobertura.json','asignaciones.json','sin-clasificar.json','cuadernos-generales-pendientes.json','avance-logaritmos.json','incidencias-seleccion.json','base-pre-logaritmos.json']+(['qa-lectores.json'] if (D/'qa-lectores.json').exists() else [])})
# Metadatos públicos sin enunciados, OCR, soluciones ni rutas personales.
write(ROOT/'fuentes/cuzcano/cobertura-100-por-tema.json',coverage)
course_counts=Counter(courses[e['libro_id']] for e in entries.values());plan={'criterio_activo':'100_por_tema','objetivo_minimo_por_tema':100,'objetivo_volumen_por_curso_anterior':1000,'total_fichas':len(entries),'catalogo_temas_exhaustivo':False,'detalle_temas':'cobertura-100-por-tema.json','criterio':'Conteo por tema principal con observaciones separadas. Los cuadernos mixtos requieren clasificación; no certifica la app.','cursos':[{'curso':c,'fichas_registradas':course_counts[c],'temas_inventariados':sum(t['curso']==c for t in ordered),'temas_con_minimo_revision':sum(t['curso']==c and t['minimo_revision_alcanzado'] for t in ordered),'cobertura_tematica_total_validada':False} for c in sorted(set(courses.values()))]}
write(ROOT/'fuentes/cuzcano/plan-cobertura-cursos.json',plan);write(L/'coleccion-algebra-1000/plan-cursos.json',plan)
public=read(ROOT/'fuentes/cuzcano/avance-algebra-1000.json');public.update(criterio_activo='100_por_tema',objetivo_adicional_anterior=public.pop('objetivo_adicional',1000),nuevos_revisados=200,pendientes_del_objetivo_anterior=800,estado='en_curso',con_condiciones_para_producto=27,sin_condiciones_senaladas=173,algebra_acumulado=205,archivo_acumulado=len(entries),libros_en_esta_tanda=2,lotes=progress['lotes'],tema_nuevo=newreport,siguiente={'curso':'fisica','tema':'Cinemática II (MVCL y MPCL)','revisados_asignados':86,'faltan_para_minimo':14})
if multicourse.exists():public['siguiente']={'criterio':'Elegir temas con déficit en cobertura-100-por-tema.json;Cinemática II ya tiene100.','avance_multicurso':'avance-multicurso-814.json'}
public.pop('pendientes',None);public['cobertura_por_ampliar']=['Consultar cobertura-100-por-tema.json; los 100 previos de Álgebra se distribuyen entre temas distintos.'];public.pop('recursos_visuales',None);public['paginas_con_fragmentos_cotejados']=len({(lot['libro_id'],p) for lot in progress['lotes'] for p in lot['paginas_pdf']})
write(ROOT/'fuentes/cuzcano/avance-algebra-1000.json',public);write(L/'coleccion-algebra-1000/avance-publico.json',public)
print(json.dumps({'fichas':len(entries),'clasificadas':len(assign),'sin_clasificar':len(unassigned),'temas':len(topics),'minimos_alcanzados':coverage['temas_con_minimo_de_revision'],'logaritmos':newreport},ensure_ascii=False))
