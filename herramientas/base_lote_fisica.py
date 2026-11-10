"""Plantilla autocontenida de lectura, gráficos cartesianos y controles físicos."""
import json,math,html,textwrap,hashlib,shutil,re
from pathlib import Path
BOOK='1C9wCW-5MAcPnWacMet9fJSwiP9Fmpcqb'
TITLE='Física PREUNI';PREFIX='fisica-preuni';KIND='problema';EVIDENCE=None;OFFSET=None
E=[]

def configure(book,title,prefix,evidence,kind='propuesto',offset=0):
 global BOOK,TITLE,PREFIX,KIND,EVIDENCE,OFFSET
 BOOK,TITLE,PREFIX,KIND,EVIDENCE,OFFSET=book,title,prefix,kind,evidence,offset

def readable(value):
 words='de|a|con|en|por|hasta|desde|son|vale|valen|mide|tiene|recibe|entrega|forman|suma|produce|da|radio|diámetro|longitud|separación|altura|resistencia|corriente|fuente|tensión|distancia|potencia|carga|área|lado|espesor|capacidad|objeto|imagen|temperatura|sección|conductor|resistor|capacitor|espejo|alambre|masa|tamaño|amplitud|período|frecuencia|paralelo|serie'
 value=re.sub(r'\b('+words+r')(?=\d)',r'\1 ',value)
 return re.sub(r'\b(a|y|con)(?=[A-ZÁÉÍÓÚ])',r'\1 ',value)
def add(n,p,t,e,s,r,check,plot=None,state='verificado',note='Solución propia. No se presupone cotejada la solución editorial completa.'):
 t,e,s,r,note=map(readable,[t,e,s,r,note])
 s=s.replace('||','∥')
 s=re.sub(r'\|([A-Za-z][A-Za-z0-9_]*)\|',r'∣\1∣',s)
 for token in ['Δr','vA','xA−xB','15−4t','9−0','0−9','a','vxrel','α2','α4','J','x','v′','Q','ΔT','H','T0−T']:s=s.replace('|'+token+'|','∣'+token+'∣')
 E.append(dict(numero=n,paginas=p,tema=t,enunciado=e,pasos=s.split('|'),resultado=r,control=check,plot=plot,estado=state,revision=note,solucion_pdf=[]))
def curve(f,a,b,count=61):return [[a+(b-a)*i/(count-1),f(a+(b-a)*i/(count-1))] for i in range(count)]
def graph(x,y,series,marks=[]):return dict(ejes=[x,y],series=series,marcas=marks)
def forces(items):
 g=graph('componente x; unidades en leyenda','componente y',[(k,[[0,0],v]) for k,v in items]);g['igual']=True;g['flechas']=[k for k,v in items];return g
def scene(items,marks=[]):
 g=graph('x (geometría)','y (geometría)',items,marks);g['igual']=True;return g
def circle(r=1,c=(0,0)):return [[c[0]+r*math.cos(i*math.pi/40),c[1]+r*math.sin(i*math.pi/40)] for i in range(81)]
def close(a,b):return math.isclose(a,b,rel_tol=1e-8,abs_tol=1e-12)

def network(nodes,edges,terminals=()):
 g=graph('','',[(label,[nodes[a],nodes[b]]) for a,b,label in edges],[(nodes[n],n) for n in terminals]);g['red']=True;return g

def parallel_network(labels,a='a',b='b'):
 nodes={a:(0,0),b:(3,0)};edges=[]
 for i,label in enumerate(labels):
  y=(i+1)*.6;left=f'L{i}';right=f'R{i}';nodes[left]=(0,y);nodes[right]=(3,y);edges.extend([(a,left,''),(left,right,label),(right,b,'')])
 return network(nodes,edges,[a,b])

def solve_net(edges,a,b):
 """Red lineal pasiva: pesos C para capacidad; 1/R para conductancia."""
 names=sorted({n for x,y,w in edges for n in (x,y)}-{a,b});fixed={a:1.,b:0.};N=len(names);ix={n:i for i,n in enumerate(names)};m=[[0.]*(N+1) for _ in names]
 for x,y,w in edges:
  for u,v in [(x,y),(y,x)]:
   if u in ix:
    i=ix[u];m[i][i]+=w
    if v in ix:m[i][ix[v]]-=w
    else:m[i][-1]+=w*fixed[v]
 for j in range(N):
  k=max(range(j,N),key=lambda k:abs(m[k][j]));m[j],m[k]=m[k],m[j];pivot=m[j][j];assert abs(pivot)>1e-14
  m[j]=[v/pivot for v in m[j]]
  for i in range(N):
   if i!=j:
    f=m[i][j];m[i]=[u-f*v for u,v in zip(m[i],m[j])]
 fixed.update({n:m[ix[n]][-1] for n in names})
 equivalent=sum(w*(fixed[a]-fixed[y if x==a else x]) for x,y,w in edges if a in (x,y))
 return equivalent,fixed
def build(folder,exercises):
 global E
 E=exercises;D=Path(folder).resolve();L=D.parent;lo=min(e['numero'] for e in E);hi=max(e['numero'] for e in E)
 def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
 models={};controls=[]
 for e in E:
  assert len(e['pasos'])==3,(e['numero'],'Se requieren tres pasos completos y sin separadores dentro de fórmulas.')
  env=dict(math=math,close=close,S=math.sqrt,pi=math.pi,solve_net=solve_net);exec(e['control'],env);controls.append({'numero':e['numero'],'control':e['control'],'resultado':'correcto'})
  n=e['numero'];plot=e['plot'];models[str(n)]=plot or {'tipo':'tarjeta_conceptual','relaciones':e['pasos']}
  parts=['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 540"><rect width="900" height="540" rx="18" fill="#f4f8fc"/>']
  def text(x,y,t,size=17,c='#20364b',anchor='start'):
   parts.append(f'<text x="{x}" y="{y}" font-family="Arial,sans-serif" font-size="{size}" fill="{c}" text-anchor="{anchor}">{html.escape(str(t))}</text>')
  def line(x,y,X,Y,c='#8295a8',w=1,dash=False):parts.append(f'<line x1="{x}" y1="{y}" x2="{X}" y2="{Y}" stroke="{c}" stroke-width="{w}"'+(' stroke-dasharray="5 4"' if dash else '')+'/>')
  text(25,36,f'{n:03d} · '+e['tema'][:67],20);line(455,65,455,477,'#d5e1ed')
  if plot:
   pts=[p for s in plot['series'] for p in s[1]]+[p for p,label in plot.get('marcas',[])];xs=[p[0] for p in pts]+[0];ys=[p[1] for p in pts]+[0];xmin,xmax=min(xs),max(xs);ymin,ymax=min(ys),max(ys)
   if xmin==xmax:
    spread=(ymax-ymin) or 1;xmin-=spread/2;xmax+=spread/2
   if ymin==ymax:
    spread=(xmax-xmin) or 1;ymin-=spread/2;ymax+=spread/2
   dx=(xmax-xmin)*.12;dy=(ymax-ymin)*.12;xmin-=dx;xmax+=dx;ymin-=dy;ymax+=dy
   if plot.get('igual'):
    span=max((xmax-xmin)/340,(ymax-ymin)/315);cx=(xmin+xmax)/2;cy=(ymin+ymax)/2;xmin=cx-span*170;xmax=cx+span*170;ymin=cy-span*157.5;ymax=cy+span*157.5
   def xy(p):return (68+340*(p[0]-xmin)/(xmax-xmin),427-315*(p[1]-ymin)/(ymax-ymin))
   zx,zy=xy((0,0))
   if not plot.get('red') and not plot.get('sin_ejes'):
    line(65,zy,421,zy,'#20364b',1.7);line(zx,105,zx,441,'#20364b',1.7)
    text(407,466,plot['ejes'][0],15,anchor='end');text(50,86,plot['ejes'][1],15)
   for polygon in plot.get('rellenos',[]):
    pp=[xy(p) for p in polygon]
    parts.append('<polygon points="'+' '.join(f'{x:.2f},{y:.2f}' for x,y in pp)+'" fill="#f4c581" fill-opacity="0.45"/>')
   colors=['#1766b0','#d37618','#008674','#b0467a']
   for i,(label,points) in enumerate(plot['series']):
    pp=[xy(p) for p in points]
    if plot.get('red'):
     (ax,ay),(bx,by)=pp;mx=(ax+bx)/2;my=(ay+by)/2;angle=math.atan2(by-ay,bx-ax);ux=math.cos(angle);uy=math.sin(angle);vx=-uy;vy=ux
     if label:
      line(ax,ay,mx-9*ux,my-9*uy,'#20364b',2);line(mx+9*ux,my+9*uy,bx,by,'#20364b',2)
      if label.startswith('R:'):
       zig=[(mx-9*ux,my-9*uy)]+[(mx+t*ux+o*vx,my+t*uy+o*vy) for t,o in [(-6,5),(-2,-5),(2,5),(6,-5)]]+[(mx+9*ux,my+9*uy)]
       parts.append('<polyline points="'+' '.join(f'{x},{y}' for x,y in zig)+'" fill="none" stroke="#1766b0" stroke-width="2"/>')
      elif label.startswith('V:'):
       for t,half in [(-5,14),(5,7)]:line(mx+t*ux-half*vx,my+t*uy-half*vy,mx+t*ux+half*vx,my+t*uy+half*vy,'#1766b0',2.5)
      else:
       for t in [-5,5]:line(mx+t*ux-9*vx,my+t*uy-9*vy,mx+t*ux+9*vx,my+t*uy+9*vy,'#1766b0',2.5)
      text(mx+20*vx,my+20*vy-5,label.removeprefix('C:').removeprefix('R:').removeprefix('V:')[:18],12,anchor='middle')
     else:line(ax,ay,bx,by,'#20364b',2)
    else:
     dash=' stroke-dasharray="6 5"' if label in plot.get('discontinuas',[]) else ''
     parts.append('<polyline points="'+' '.join(f'{x:.2f},{y:.2f}' for x,y in pp)+f'" fill="none" stroke="{colors[i%4]}" stroke-width="2.5"{dash}/>')
     if plot.get('leyenda',True):text(73+175*(i%2),477+(i//2)*13,label[:25],11,colors[i%4])
    if label in plot.get('flechas',[]) and len(pp)>1:
     a,b=pp[-2:];ang=math.atan2(b[1]-a[1],b[0]-a[0])
     for delta in [-.42,.42]:line(b[0],b[1],b[0]-10*math.cos(ang+delta),b[1]-10*math.sin(ang+delta),colors[i%4],2)
   for p,label in plot.get('marcas',[]):
    x,y=xy(p)
    if not plot.get("puntos_ocultos"):parts.append(f'<circle cx="{x}" cy="{y}" r="3.7" fill="#20364b"/>')
    lab=label[:22];tx=x+7;anchor='start'
    if tx+len(lab)*7>440:tx=x-7;anchor='end'
    if tx-len(lab)*7<65 and anchor=='end':tx=65;anchor='start'
    ox,oy=plot.get('desplazamientos',{}).get(label,[0,0])
    text(tx+ox,min(435,max(106,y-8+oy)),lab,13,anchor=anchor)
  else:
   text(64,160,'RELACIONES DEL PROBLEMA',19,'#1766b0');yy=208
   for st in e['pasos'][:2]:
    for ln in textwrap.wrap(st,37)[:5]:text(64,yy,ln,16);yy+=23
    yy+=16
  yy=93
  for st in e['pasos']:
   for ln in textwrap.wrap(st,38)[:5]:text(482,yy,ln,16);yy+=23
   yy+=15
  text(482,475,'Resultado en la ficha y controles',15,'#008674');text(25,532,'Reconstrucción propia · Ejes, puntos y unidades conservados en la ficha.',13,'#65788a')
  (D/f'figura-{n}.svg').write_text(''.join(parts)+'</svg>',encoding='utf-8')
 write(D/'modelos.json',models);write(D/'comprobaciones.json',{'ejercicios':len(E),'controles':controls})
 pages=sorted({p for e in E for p in e['paginas']+e.get('solucion_pdf',[])+e.get('clave_pdf',[])});hashes={}
 for p in pages:
  evidence=EVIDENCE or ('qa-fisica-301-500' if lo>=301 else 'qa-fisica-300')
  shutil.copyfile(L/f'{evidence}/p{p}.png',D/f'original-{p}.png');raw=L/BOOK/f'p-{p:04d}.json';hashes[f'{BOOK}/{raw.name}']=hashlib.sha256(raw.read_bytes()).hexdigest()
 articles=[]
 def printed(p):
  if isinstance(OFFSET,dict):return OFFSET[p]
  return p+OFFSET if OFFSET is not None else (p+3 if p<88 else p+2)
 for e in E:
  n=e['numero'];allpages=list(dict.fromkeys(e['paginas']+e.get('solucion_pdf',[])+e.get('clave_pdf',[])));f={'schema_version':1,'id':f'{PREFIX}-{KIND}-{n}','fuente':{'libro_id':BOOK,'libro_titulo':TITLE,'tipo':KIND,'numero':n,'paginas_pdf':allpages,'paginas_enunciado':e['paginas'],'paginas_solucion_cotejada':e.get('solucion_pdf',[]),'paginas_clave_cotejada':e.get('clave_pdf',[]),'paginas_impresas':[printed(p) for p in allpages],'evidencias':[f'original-{p}.png' for p in allpages]},'tema':e['tema'],'enunciado':e['enunciado'],'resolucion':{'origen':'Solución propia','pasos':e['pasos']},'resultado':{'expresion':e['resultado']},'estado':e['estado'],'revision_propia':e['revision'],'requiere_aclaracion_para_producto':e['estado'].startswith(('condicionado','ambiguedad')),'grafico':{'archivo':f'figura-{n}.svg','tipo':'grafica_cartesiana_propia' if e['plot'] else 'tarjeta_relaciones_propias','datos_geometricos':models[str(n)]},'pagina_completa_validada':False,'uso':'Referencia de estudio local; no copiar automáticamente a producto.'};f.update({k:e[k] for k in ['cobertura','modelo_fisico','busqueda'] if k in e});write(D/f'problema-{n}.json',f)
  articles.append(f'<article id="p{n}"><h2>{n:03d}. {html.escape(e["tema"])}</h2><p>{html.escape(e["enunciado"])}</p><small>{html.escape(e["estado"])}</small><img src="figura-{n}.svg" alt="Gráfico o relaciones {n}"><h3>Solución por pasos</h3><ol>'+''.join('<li>'+html.escape(s)+'</li>' for s in e['pasos'])+'</ol><p class="result">'+html.escape(e['resultado'])+'</p><aside>'+html.escape(e['revision'])+f'</aside><p><a href="problema-{n}.json">Ficha estructurada</a></p><details><summary>Evidencia original</summary>'+''.join(f'<p>PDF {p}</p><img loading="lazy" src="original-{p}.png" alt="Página {p}">' for p in allpages)+'</details></article>')
 css='body{font:17px/1.65 system-ui;margin:0;background:#edf3f8;color:#20364b;overflow-wrap:anywhere}main{max-width:1050px;margin:auto;padding:24px}article{background:white;padding:28px;border-radius:16px;margin:24px 0}img{max-width:100%;height:auto}li{margin:12px 0}a{color:#006a86}h1,h2{line-height:1.2}aside{background:#fff4df;padding:14px}.result{font-weight:bold;font-size:1.2em}nav{display:flex;gap:15px;flex-wrap:wrap}@media(max-width:600px){main{padding:12px}article{padding:17px}}'
 doc=f'<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{html.escape(TITLE)} {lo}–{hi}</title><style>{css}</style><main><h1>{html.escape(TITLE)} · {KIND}s {lo}–{hi}</h1><p>Numeración original. Soluciones propias, controles y gráficos redibujados. Las condiciones del original se conservan.</p><p><a href="../archivo-ejercicios/index.html">Archivo general</a> · <a href="modelos.json">Modelos</a> · <a href="comprobaciones.json">Controles</a></p><nav>'+''.join(f'<a href="#p{e["numero"]}">{e["numero"]}</a>' for e in E)+'</nav>'+''.join(articles)+'</main></html>'
 (D/'index.html').write_text(doc,encoding='utf-8');write(D/'verificacion.json',{'sha256_ocr_original':hashes,'pagina_completa_validada':False,'ejercicios':len(E),'visual':'Pendiente de inspección final.'})
 print(json.dumps({'ejercicios':len(E),'numeros':[lo,hi],'controles':'correctos'}))
