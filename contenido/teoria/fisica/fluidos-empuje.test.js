/* Oráculo independiente: presiones sobre caras de prismas y raíces del balance.
 * No importa funciones de cálculo, alternativas ni formateadores de la teoría. */
'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const def=require(process.env.FLUIDOS_EMPUJE_MODULE||'./fluidos.js');
const idea=def.ideas.find(i=>i.id==='empuje');
const pieza=require('../../../nucleo/kit/piezas/fis-fluidos-e12.js');
const estatica=require('../../../nucleo/kit/piezas/fis-estatica.js');
const cerca=(a,b,m='')=>assert.ok(Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=2e-9*Math.max(1,Math.abs(a),Math.abs(b)),`${m}: ${a} frente a ${b}`);
const U={'kg/m³':1,'m/s²':1,'cm³':1e-6,'m³':1,'N':1,'kg':1,'m':1,'%':.01,'Pa':1,'m²':1};
const normal=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ρ/g,'rho').replace(/−/g,'-');
function plano(x){if(x==null)return '';if(typeof x!=='object')return String(x);if(Array.isArray(x))return x.map(plano).join('');if(x.t!==undefined)return plano(x.t);if(x.sub)return plano(x.sub[0])+'_'+plano(x.sub[1]);if(x.frac)return '('+plano(x.frac[0])+')/('+plano(x.frac[1])+')';if(x.sup)return '('+plano(x.sup[0])+')^('+plano(x.sup[1])+')';return '';}
function texto(x){if(x==null||typeof x==='function')return '';if(typeof x!=='object')return String(x);if(Array.isArray(x))return x.map(texto).join(' ');if(x.t!==undefined||x.sub||x.frac||x.sup)return plano(x);return Object.values(x).map(texto).join(' ');}
function quitarMiles(s){return s.replace(/(?<=\d)[ \u00a0\u202f](?=\d{3}(?:\D|$))/g,'');}
function numero(x){const s=quitarMiles(plano(x)).replace(/−/g,'-'),ns=s.match(/[+-]?\d+(?:[,.]\d+)?/g);assert.equal(ns?.length,1,'Una cantidad: '+s);return Number(ns[0].replace(',','.'));}
function cantidad(x,v,u,dec=3){const s=plano(x);assert.ok(s.endsWith(' '+u),'Unidad '+u+' en '+s);const actual=numero(s);if(Math.abs(actual-v)>1e-9*Math.max(1,Math.abs(v)))assert.ok(s.includes('≈'),'Redondeo sin ≈: '+s+' frente a '+v);assert.ok(Math.abs(actual-v)<=.50001*10**(-dec),'Precisión: '+s+' frente a '+v);}

function p(z,capas,g){
  if(z<=0)return 0;
  let inicio=0,resultado=0;
  for(const c of capas){const largo=Math.max(0,Math.min(z,c.hasta)-inicio);resultado+=c.rho*g*largo;inicio=c.hasta;if(inicio>=z)break;}
  assert.ok(inicio>=z,'La columna declarada llega a la cara inferior');return resultado;
}
function caras(area,alto,superior,capas,g=10){return area*(p(superior+alto,capas,g)-p(superior,capas,g));}
function completo(vol,rho,g=10,prof=.17){return caras(vol/.1,.1,prof,[{rho,hasta:2}],g);}
function parcial(vol,fr,rho,g=10){return caras(vol/.1,.1,(fr-1)*.1,[{rho,hasta:2}],g);}
function raiz(fn,lo,hi){let a=fn(lo),b=fn(hi);assert.ok(a*b<=0,'Raíz encerrada');if(a===0)return lo;if(b===0)return hi;for(let i=0;i<90;i++){const m=(lo+hi)/2,c=fn(m);if(c===0)return m;if(a*c<0)hi=m;else{lo=m;a=c;}}return (lo+hi)/2;}
function flotacion(m,V,rho,g){const fr=raiz(x=>parcial(V,x,rho,g)-m*g,0,1);assert.ok(fr>0&&fr<1,'Flotación parcial');const e=1e-5;assert.ok(parcial(V,fr+e,rho,g)>m*g&&parcial(V,fr-e,rho,g)<m*g,'Restauración vertical');return fr*V;}
function volumenLecturas(Ta,Tl,rho,g){assert.ok(Ta>Tl&&Tl>0);return raiz(v=>completo(v,rho,g)+Tl-Ta,0,.1);}
function independiente(c){
  const g=c.g??10;let V=c.V??(c.Vcm!==undefined?c.Vcm/1e6:undefined),Vs=c.Vs,m=c.m,P,E,T,valor,intermedios={},rho=c.rho,rhob=c.rhob;
  const env={g,rho_liquido:rho,rho_cuerpo:rhob,T_aire:c.Ta,T_liquido:c.Tl,T_1:c.Tl,rho_1:c.rho1,rho_2:c.rho2,m_liquido:c.mf};
  switch(c.tipo){
  case 'empuje': E=parcial(V,Vs/V,rho,g);valor=E;break;
  case 'desplazado': E=c.mf*g;valor=E;break;
  case 'profundidad': E=completo(V,rho,g,c.h1);env.E_1=E;env.E_2=completo(V,rho,g,c.h2);valor=0;cerca(env.E_2-E,0);intermedios={E};break;
  case 'suspension': Vs=V*c.fraccion;P=m*g;E=parcial(V,c.fraccion,rho,g);T=raiz(t=>t+E-P,0,P);valor=T;intermedios={V,Vs,P,E};assert.ok(T>0);break;
  case 'fraccion': V=.001;m=rhob*V;Vs=flotacion(m,V,rho,g);E=parcial(V,Vs/V,rho,g);P=m*g;valor=Vs/V*100;break;
  case 'volumen-flota': Vs=flotacion(m,V,rho,g);E=parcial(V,Vs/V,rho,g);P=m*g;valor=Vs*1e6;intermedios={Vs};break;
  case 'densidad-liquido': V=.001;m=rhob*V;Vs=V*c.fraccion;rho=raiz(r=>parcial(V,c.fraccion,r,g)-m*g,1,10000);valor=rho;env.rho_liquido=rho;E=parcial(V,c.fraccion,rho,g);P=m*g;assert.ok(rho>rhob);break;
  case 'densidad-lecturas': V=volumenLecturas(c.Ta,c.Tl,rho,g);m=c.Ta/g;E=completo(V,rho,g);P=m*g;T=c.Tl;valor=m/V;env.rho_cuerpo=valor;intermedios={E,V,m};assert.ok(valor>rho);break;
  case 'capas': {const alto=.1,area=V/alto,V1=c.V1cm/1e6,V2=V-V1,superior=.02,interfaz=superior+V1/area;assert.ok(c.rho2>c.rho1&&V1>0&&V2>0);E=caras(area,alto,superior,[{rho:c.rho1,hasta:interfaz},{rho:c.rho2,hasta:2}],g);P=m*g;T=raiz(t=>t+E-P,0,P);valor=T;intermedios={V1,V2,E,P};Object.assign(env,{V_1:V1,V_2:V2});assert.ok(T>0);break;}
  case 'anclaje': E=completo(V,rho,g);P=m*g;T=raiz(t=>E-P-t,0,E);valor=T;intermedios={V,E,P};assert.ok(E>P&&T>0);break;
  case 'cambio-liquido': V=volumenLecturas(c.Ta,c.Tl,c.rho1,g);P=c.Ta;m=P/g;E=completo(V,c.rho2,g);T=raiz(t=>t+E-P,0,P);valor=T;intermedios={V,E2:E};env.T_2=T;assert.ok(c.rho2>c.rho1&&T<c.Tl&&T>0);break;
  case 'carga': Vs=c.fraccion*V;E=parcial(V,c.fraccion,rho,g);const total=raiz(mt=>E-mt*g,0,100);valor=total-m;env.m_carga=valor;env.m_total=total;intermedios={V,Vs,total};assert.ok(valor>0&&Vs<V&&m<rho*V);break;
  default:throw Error('Sin oráculo '+c.tipo);
  }
  Object.assign(env,{V,V_s:Vs,m,P,E,T});return {valor,env,intermedios};
}
function errores(c,o){const g=c.g??10,{P,E,V,m}=o.env,Vs=o.env.V_s;switch(c.tipo){
case 'empuje':return {SIN_G:completo(Vs,c.rho,1),...(c.V>c.Vs?{TOTAL:completo(c.V,c.rho,g)}:{G_DOS:completo(c.Vs,c.rho,g*g)}),MITAD:E/2};
case 'desplazado':return {MASA:c.mf,G_DOS:c.mf*g*g,MITAD:c.mf*g/2};
case 'profundidad':return {SOLO_E:E,PROF_CAMBIO:E*(c.h2/c.h1-1),PROF_FINAL:E*c.h2/c.h1};
case 'suspension':case 'anclaje':return {PESO:P,EMPUJE:E,SUMA:P+E};
case 'fraccion':return {FUERA:(V-Vs)/V*100,INVERSA:V/Vs*100,TODO:100};
case 'volumen-flota':return {TOTAL:c.Vcm,FUERA:(V-Vs)*1e6,PESO_MASA:Vs*g*1e6};
case 'densidad-liquido':return {MULTIPLICA:c.rhob*c.fraccion,FUERA:c.rhob/(1-c.fraccion),CUERPO:c.rhob};
case 'densidad-lecturas':return {LECTURA_SUMERGIDA:(c.Tl/g)/V,SUMA_LECTURAS:(c.Ta/g)/((c.Ta+c.Tl)/(c.rho*g)),DENSIDAD_LIQUIDO:c.rho};
case 'capas':return {SOLO_SUPERIOR:P-completo(V,c.rho1,g),SOLO_INFERIOR:P-completo(V,c.rho2,g),SUMA:P+E};
case 'cambio-liquido':return {MISMA_LECTURA:c.Tl,RAZON_INVERSA:c.Ta-(c.Ta-c.Tl)*c.rho1/c.rho2,SUMA:c.Ta+E};
case 'carga':return {MASA_TOTAL:o.intermedios.total,TODO:completo(V,c.rho,g)/g-m,MASA_INICIAL:c.m};
default:throw Error('Errores sin oráculo');}}

function simbolos(s){return normal(s).replace(/[·×]/g,'*').replace(/,/g,'.');}
const unidades=Object.keys(U).sort((a,b)=>b.length-a.length);
function unidadFinal(s){return unidades.find(u=>s.trim().endsWith(' '+u)&&/[\d)]$/.test(s.trim().slice(0,-u.length).trim()));}
function evaluar(s,env,factor){
  s=quitarMiles(s).trim();const u=unidadFinal(s);if(u){s=s.slice(0,-u.length).trim();factor=U[u];}
  s=simbolos(s);let simbolico=false;
  s=s.replace(/[A-Za-z]+(?:_[A-Za-z0-9]+)?/g,k=>{assert.ok(Number.isFinite(env[k]),'Símbolo '+k+' en '+s);simbolico=true;return '('+env[k]+')';});
  assert.match(s,/^[\d\s().+*/\-]+$/,'Expresión '+s);let v;try{v=Function('"use strict";return ('+s+')')();}catch(e){throw Error('Expresión inválida: '+s,{cause:e});}assert.ok(Number.isFinite(v));return v*(simbolico?1:factor);
}
function ecuaciones(filas,env,unidad){let total=0;for(const fila of filas)if(fila?.ecuacion)for(const bloque of plano(fila.ecuacion).split(/;|⇒/)){
  const partes=bloque.split(/(=|≈)/).map(s=>s.trim());if(partes.length<3)continue;
  const expr=partes.filter((_,i)=>i%2===0),valor=expr.map((s,i)=>evaluar(s,env,U[expr.slice(i).map(unidadFinal).find(Boolean)]??(unidad==='%'?1:U[unidad])));
  for(let i=1;i<valor.length;i++){if(partes[2*i-1]==='=')cerca(valor[i-1],valor[i],'Igualdad '+bloque);else{const factor=U[unidadFinal(expr[i])]??U[unidad],match=quitarMiles(expr[i]).match(/[-+]?\d+(?:,(\d+))?/),dec=match?.[1]?.length||0;assert.ok(Math.abs(valor[i-1]-valor[i])<=(.5*10**(-dec)+1e-8)*factor,'Aproximación '+bloque);}total++;}
}return total;}
function nodos(x,out=[]){if(Array.isArray(x))x.forEach(v=>nodos(v,out));else if(x&&typeof x==='object'){if(x.v&&/^[-+\d]/.test(x.t))out.push(x);else Object.values(x).forEach(v=>{if(typeof v==='object')nodos(v,out);});}return out;}
const entradaUnidad={rho:'kg/m³',rhob:'kg/m³',rho1:'kg/m³',rho2:'kg/m³',m:'kg',mf:'kg',V:'m³',Vs:'m³',Vcm:'cm³',V1cm:'cm³',h1:'m',h2:'m',Ta:'N',Tl:'N',fraccion:'%'};
const entradaColor={rho:'f',rhob:'f',rho1:'f',rho2:'f',m:'f',mf:'f',V:'d',Vs:'d',Vcm:'d',V1cm:'d',h1:'d',h2:'d',Ta:'h',Tl:'h',fraccion:'d'};
function entradas(p,c){const ns=nodos(p.enunciado||p.pregunta).slice();for(const[k,v]of Object.entries(c))if(!['tipo','g','valor','unidad','intermedios','errores'].includes(k)){
 const unidad=entradaUnidad[k],valor=k==='fraccion'?v*100:v;assert.ok(unidad,'Entrada '+k);const i=ns.findIndex(x=>plano(x).endsWith(' '+unidad)&&Math.abs(numero(x)-valor)<1e-9);assert.ok(i>=0,'Dato visible '+k+'='+valor+' '+unidad);assert.equal(ns[i].v,'c-'+entradaColor[k]);ns.splice(i,1);
}assert.equal(ns.length,0,'Solo cantidades procedentes de entradas');for(const d of p.datos){const t=plano(d);assert.doesNotMatch(t,/ρ\s*=|E\s*=|T\s*=|P\s*=|despej|multiplic|restamos|sumamos|dividimos/,'Datos sin receta');if(t.includes('='))assert.match(t,/g = 10 m\/s²|^1 cm³ = 0,000001 m³\.$/);}}
const pistas={SIN_G:/masa.*peso/,TOTAL:/fuera|volumen/,G_DOS:/dos veces/,MITAD:/dos|divide/,MASA:/masa.*fuerza/,SOLO_E:/valor.*cambio/,PROF_CAMBIO:/profundidades.*proporción/,PROF_FINAL:/profundidades.*razón/,PESO:/peso/,EMPUJE:/empuje/,SUMA:/sum/,FUERA:/fuera/,INVERSA:/invertiste/,TODO:/complet/,PESO_MASA:/peso.*masa/,MULTIPLICA:/multiplicaste.*dividir/,CUERPO:/cuerpo.*líquido/,LECTURA_SUMERGIDA:/sumergida.*peso/,SUMA_LECTURAS:/sumaste.*diferencia/,DENSIDAD_LIQUIDO:/líquido.*cuerpo/,SOLO_SUPERIOR:/ambas.*superior/,SOLO_INFERIOR:/ambas.*inferior/,MISMA_LECTURA:/lectura.*líquido/,RAZON_INVERSA:/invertiste.*razón/,MASA_TOTAL:/restaste.*bloque/,MASA_INICIAL:/inicial.*añadida/};
const conteos={casos:0,ecuaciones:0,opciones:0,figuras:0};
const pisa=(a,b)=>a.x0<b.x1-1e-8&&a.x1>b.x0+1e-8&&a.y0<b.y1-1e-8&&a.y1>b.y0+1e-8;
function corta(c,a,b){let lo=0,hi=1;const dx=b[0]-a[0],dy=b[1]-a[1];for(const[p,q]of [[-dx,a[0]-c.x0],[dx,c.x1-a[0]],[-dy,a[1]-c.y0],[dy,c.y1-a[1]]]){if(Math.abs(p)<1e-12){if(q<0)return false;}else{const t=q/p;if(p<0)lo=Math.max(lo,t);else hi=Math.min(hi,t);if(lo>hi)return false;}}return true;}
function colisiones(geo){
 const cajas=geo.rotulos;
 for(let i=0;i<cajas.length;i++){
  const c=cajas[i];assert.ok(c.x0>=4-1e-8&&c.y0>=4-1e-8&&c.x1<=316+1e-8&&c.y1<=geo.H-4+1e-8,'Rótulo dentro del marco: '+c.texto);
  for(const otro of cajas.slice(i+1))assert.ok(!pisa(c,otro),'Rótulos cruzados: '+c.texto+' / '+otro.texto);
  for(const s of geo.segmentos||[])assert.ok(!corta(c,s.de,s.a),'Rótulo cruza trazo: '+c.texto+' / '+s.id);
  for(const o of geo.objetos)if(o.solido||o.tipo==='caja')assert.ok(!pisa(c,o),'Rótulo cruza objeto: '+c.texto);
  for(const f of geo.flechas){const de=f.de||[f.x1,f.y1],a=f.a||[f.x2,f.y2],ux=f.ux??(a[0]-de[0])/Math.hypot(a[0]-de[0],a[1]-de[1]),uy=f.uy??(a[1]-de[1])/Math.hypot(a[0]-de[0],a[1]-de[1]);
   const punta=f.punta||[a,[a[0]-13*ux-6.5*uy,a[1]-13*uy+6.5*ux],[a[0]-13*ux+6.5*uy,a[1]-13*uy-6.5*ux]];
   assert.ok(!corta(c,de,a),'Rótulo cruza flecha: '+c.texto);for(let j=0;j<3;j++)assert.ok(!corta(c,punta[j],punta[(j+1)%3]),'Rótulo cruza punta: '+c.texto);
  }
 }
}
function comprobar(p){const c=p.caso,o=independiente(c),errs=errores(c,o);cerca(c.valor,o.valor,'Respuesta declarada');entradas(p,c);
  for(const[k,v]of Object.entries(c.intermedios)){assert.ok(k in o.intermedios,'Intermedio conocido '+k);cerca(v,o.intermedios[k],'Intermedio '+k);}
  assert.equal(c.errores.length,3);for(const e of c.errores){assert.ok(e.operacion in errs);cerca(e.valor,errs[e.operacion],'Distractor '+e.operacion);}
  if(p.respuesta)cantidad(p.respuesta,o.valor,c.unidad);
  conteos.ecuaciones+=ecuaciones(p.pasos||(Array.isArray(p.solucion)?p.solucion:[p.solucion]),o.env,c.unidad);
  if(p.opciones){assert.equal(p.opciones.filter(x=>x.correcta).length,1);assert.equal(p.opciones.filter(x=>Math.abs(x.valor-o.valor)<1e-8).length,1);assert.equal(new Set(p.opciones.map(x=>numero(x.texto))).size,4);for(const op of p.opciones){const oper=op.error?.replace('FL12-E-',''),v=op.correcta?o.valor:errs[oper];cerca(op.valor,v);cantidad(op.texto,v,c.unidad);if(!op.correcta){assert.match(op.siFuera,pistas[oper]);assert.ok(op.siFuera.split(/\s+/).length<=20);if(o.valor!==0)assert.ok(Math.abs(v/o.valor)>=.05-1e-9&&Math.abs(v/o.valor)<=20+1e-9,'Distractor a escala');}conteos.opciones++;}}
  if(p.alternativas){assert.equal(p.alternativas.length,4);assert.equal(p.alternativas.filter(x=>Math.abs(numero(x)-o.valor)<=.000501).length,1);assert.equal(new Set(p.alternativas.map(numero)).size,4);for(const x of p.alternativas){const v=[o.valor,...Object.values(errs)].find(v=>Math.abs(numero(x)-v)<=.000501);assert.ok(Number.isFinite(v));cantidad(x,v,c.unidad);}for(const v of Object.values(errs)){const a=p.alternativas.find(x=>Math.abs(numero(x)-v)<=.000501);assert.ok(texto(p.solucion.at(-1)).includes(a),'La solución explica '+a);}}
  const f=p.figura||p.dibujo,d=f.datos,b=d.vasos[0].bloque;assert.equal(d.modo,'esquema');assert.equal(d.valor,undefined);assert.equal(d.caso,undefined);assert.equal(b.base,undefined);assert.equal(b.alto,undefined);assert.equal(b.ancho,undefined);
  const esperado=c.tipo==='empuje'?c.Vs/c.V:['suspension','densidad-liquido'].includes(c.tipo)?c.fraccion:undefined;
  if(esperado!==undefined)cerca(b.fraccionDada,esperado,'Proporción ya dada');else assert.equal(b.fraccionDada,undefined,'No se entrega fracción resuelta');
  if(['fraccion','volumen-flota','densidad-liquido','carga'].includes(c.tipo)){assert.equal(b.soporte,'ninguno');assert.equal(b.forma,'ancho');}else assert.equal(b.soporte,c.tipo==='anclaje'?'inferior':'superior');
  const geo=pieza.geometria(d,f.estado||{}),svg=pieza.dibujar(d,f.estado||{});assert.doesNotMatch(svg,/NaN|Infinity|undefined|\[object Object\]/);assert.match(svg,/Esquema sin escala/);
  const cuerpo=geo.objetos.find(x=>x.id==='bloque'),sup=geo.superficies[0];
  if(esperado!==undefined)cerca((cuerpo.y1-sup.y)/(cuerpo.y1-cuerpo.y0),esperado,'Proporción dibujada');
  if(b.inmersion==='completa')assert.ok(cuerpo.y0>=sup.y,'Completamente dentro');
  if(b.forma==='ancho')assert.ok(cuerpo.x1-cuerpo.x0>cuerpo.y1-cuerpo.y0,'Forma ancha');
  if(c.tipo==='capas'){assert.equal(d.vasos[0].capas.length,2);assert.ok(geo.referencias['interfaz-tina-1']);assert.ok(cuerpo.y0<geo.referencias['interfaz-tina-1'].y&&cuerpo.y1>geo.referencias['interfaz-tina-1'].y,'El bloque cruza las dos capas');cerca(b.fraccionSuperiorDada,c.V1cm/c.Vcm);cerca((geo.referencias['interfaz-tina-1'].y-cuerpo.y0)/(cuerpo.y1-cuerpo.y0),c.V1cm/c.Vcm,'Proporción entre capas dada');}
  assert.ok(cuerpo.y1<geo.referencias['fondo-tina'].y,'No toca el fondo');
  colisiones(geo);
  conteos.casos++;conteos.figuras++;return o;
}

test('Empuje: el oráculo rechaza volumen, signos, unidades y resultados contaminados',()=>{
 const c={tipo:'suspension',m:1.2,Vcm:400,rho:1000,fraccion:1,g:10};cerca(independiente(c).valor,8);cerca(independiente({...c,valor:-900,intermedios:{E:-5}}).valor,8);
 assert.throws(()=>cerca(independiente(c).valor,16));assert.throws(()=>cerca(parcial(.001,.4,1000),completo(.001,1000)));
 assert.throws(()=>cerca(completo(500/1e6,1000),completo(500/1000,1000)));
 assert.throws(()=>raiz(t=>t+completo(.0005,1000)-2,0,20),'Una cuerda superior no admite tensión negativa');
 assert.throws(()=>cantidad('1,333 N',4/3,'N'),/≈/);assert.throws(()=>ecuaciones([{ecuacion:'T = 12 + 4 = 8 N'}],{T:8},'N'),/Igualdad/);
});
test('Empuje: quince ejemplos, cinco por nivel, con cuentas y alternativas independientes',()=>{
 assert.ok(idea);assert.equal(idea.ejemplos.length,15);assert.deepEqual(idea.ejemplos.reduce((r,x)=>(r[x.nivel-1]++,r),[0,0,0]),[5,5,5]);
 const esperados=[3,4,4.8,7.5,0,8,60,500,10,1200,3000,3.6,3,9,.7];
 idea.ejemplos.forEach((e,i)=>{cerca(comprobar(e).valor,esperados[i]);});
});
for(const momento of ['resuelve','ahoraTu'])test('Empuje: 400 semillas de '+momento+', incluidas opciones y hechos del caso',()=>{
 const familias=new Set();for(let s=0;s<400;s++){const p=idea[momento].generar(s);comprobar(p);familias.add(p.caso.tipo);}assert.equal(familias.size,momento==='resuelve'?4:6);
});
test('Empuje: bancos distintos y reservas excluidas',()=>{
 const firma=c=>JSON.stringify(Object.entries(c).filter(([k])=>!['valor','intermedios','errores'].includes(k)).sort(([a],[b])=>a.localeCompare(b)));
 const ejemplos=new Set(idea.ejemplos.map(e=>firma(e.caso))),res=new Set(),inicio=new Set();
 for(let s=0;s<400;s++){const c=idea.resuelve.generar(s).caso;assert.ok(!ejemplos.has(firma(c)));res.add(firma(c));if(s<4)inicio.add(c.tipo);}
 for(let s=0;s<400;s++){const c=idea.ahoraTu.generar(s).caso;assert.ok(!ejemplos.has(firma(c)));assert.ok(!res.has(firma(c)));if(s<12)assert.ok(!inicio.has(c.tipo));}
 for(const [Ta,Tl,rho,esperado]of [[18,12,900,2700],[16,9,1050,2400]]){cerca(independiente({tipo:'densidad-lecturas',Ta,Tl,rho,g:10}).valor,esperado);for(const e of idea.ejemplos)assert.ok(e.caso.Ta!==Ta||e.caso.Tl!==Tl||e.caso.rho!==rho);}
});
test('Empuje: misión y geometría conservan volumen en siete marcas y 400 estados intermedios',()=>{
 const control=idea.juega.controles[0];assert.equal(control.inicio,0);assert.equal(idea.juega.mision.logrado({Vs:control.inicio}),false);const ganan=[];
 function estado(x){const v={Vs:x},canon=Math.max(0,Math.min(600,Math.round(x))),fig=idea.juega.dibujo(v),d=fig.datos,tina=d.vasos[0],b=tina.bloque,geo=pieza.geometria(d,{});assert.equal(d.escala.vertical,600);assert.equal(d.escala.transversal,600);
  const altoDentro=Math.max(0,Math.min(tina.nivel-b.base,b.alto)),vol=altoDentro*b.ancho*.05;cerca(vol,canon/1e6);cerca(tina.nivel*.24*.10-vol,.14*.24*.10,'Conservación de líquido');assert.ok(b.base>0&&b.base+b.alto<tina.alto&&tina.nivel<tina.alto);assert.equal(b.soporte,'superior');
  assert.equal(tina.profundidad,.10);assert.equal(b.profundidad,.05);assert.ok(tina.ancho>b.ancho&&tina.profundidad>b.profundidad,'Holgura en las dos dimensiones horizontales');
  const cuerpo=geo.objetos.find(z=>z.id==='bloque');cerca((cuerpo.y1-cuerpo.y0)/600,b.alto);cerca((cuerpo.x1-cuerpo.x0)/600,b.ancho);cerca((242-geo.superficies[0].y)/600,tina.nivel);assert.equal(d.flechas,undefined);assert.match(texto(d.rotulos),/Lectura cubierta/);assert.doesNotMatch(texto(d.rotulos),/\d\s*N\b/);colisiones(geo);
  const lectura=nodos(idea.juega.lectura(v));assert.equal(lectura.length,1);cantidad(lectura[0],canon,'cm³',6);assert.match(pieza.alt(d,{}),new RegExp(String(canon)+' cm³'));assert.doesNotMatch(pieza.dibujar(d,{}),/NaN|Infinity|undefined/);
 }
 for(let i=0;i<=600;i+=100){estado(i);if(idea.juega.mision.logrado({Vs:i}))ganan.push(i);}assert.deepEqual(ganan,[400]);for(let s=0;s<400;s++)estado((s*149%601)+.37);
});
test('Empuje: Predice, previos y diagramas de fuerzas no confunden lectura y empuje',()=>{
 const esperado=independiente({tipo:'suspension',m:.8,Vcm:500,rho:1000,fraccion:1,g:10});cerca(esperado.valor,3);
 assert.equal(idea.predice.opciones.filter(x=>x.correcta).length,1);const er={PESO:8,EMPUJE:5,SUMA:13};for(const o of idea.predice.opciones){const oper=o.error?.replace('FL12-E-','');cantidad(o.texto,o.correcta?3:er[oper],'N');if(!o.correcta)assert.match(o.siFuera,pistas[oper]);}
 const previos=[idea.lee,idea.juega.consigna,idea.juega.voz,idea.juega.leyenda,idea.juega.mision,idea.predice.datos,idea.predice.dibujo,def.glosario.filter(g=>['empuje','volumen desplazado','peso aparente'].includes(g.termino))];assert.doesNotMatch(texto(previos),/3 N|8\s*[-−]\s*5|T\s*=\s*P\s*[-−]\s*E/);
 const d=idea.predice.revelar.datos;for(const fl of d.flechas){const [clave,v]=fl.texto.match(/^([PET]) = (.+) N$/).slice(1);cerca(fl.largo/9,numero(v));assert.equal(fl.ang,clave==='P'?-90:90);assert.equal(fl.color,'h');}assert.equal(d.flechas.length,3);
 const g=estatica.geometria(d,{});assert.ok(g.rotulos.length>=3);assert.doesNotMatch(estatica.dibujar(d,{}),/NaN|Infinity|undefined/);colisiones(g);
});
test('Empuje: siete pasos de Mira y Regla contrastados en 400 modelos independientes',()=>{
 const pasos=idea.mira.pasos;assert.equal(pasos.length,7);const pred=independiente({tipo:'suspension',m:.8,Vcm:500,rho:1000,fraccion:1,g:10});ecuaciones(pasos.slice(1,3),pred.env,'N');
 for(let s=0;s<400;s++){
  const rho=760+17*(s%23),g=8+s%5,V=.0002+.00001*(s%31),fr=.2+.01*(s%51),A=V/.1,Vs=V*fr,E=parcial(V,fr,rho,g),pSuperior=p((fr-1)*.1,[{rho,hasta:2}],g),pInferior=p(fr*.1,[{rho,hasta:2}],g);
  ecuaciones([pasos[0],idea.regla],{rho_liquido:rho,g,V,V_s:Vs,E,A,p_superior:pSuperior,p_inferior:pInferior},'N');
  const rhob=rho*fr;ecuaciones([pasos[3]],{rho_liquido:rho,rho_cuerpo:rhob,g,V,V_s:Vs},'N');
  const P=E*.35,T=E-P;ecuaciones([pasos[4]],{E,P,T},'N');
  const lleno=completo(V,rho,g),Ta=lleno*3,Tl=Ta-lleno;ecuaciones([pasos[5]],{T_aire:Ta,T_liquido:Tl,rho_liquido:rho,g,V},'N');
  const rho1=rho,rho2=rho+300,V1=V*fr,V2=V-V1,interfaz=.02+V1/A,Ec=caras(A,.1,.02,[{rho:rho1,hasta:interfaz},{rho:rho2,hasta:2}],g);ecuaciones([pasos[6]],{rho_1:rho1,rho_2:rho2,V_1:V1,V_2:V2,g,E:Ec},'N');
 }
 for(const p of pasos){assert.doesNotMatch(estatica.dibujar(idea.mira.datos,p.estado),/NaN|Infinity|undefined/);colisiones(estatica.geometria(idea.mira.datos,p.estado));}
});
test('Empuje: calidad 2 simulada, sin marcar la fuente',t=>{
 require('../../../nucleo/kit/piezas/ejes.js');const T=require('../../../nucleo/teoria.js');
 const {laboratorio,laboratorioIdeas,...base}=def;
 const unidad={...base,calidad:2,estado:'completa',ideas:[idea],glosario:def.glosario.filter(g=>['empuje','volumen desplazado','peso aparente'].includes(g.termino))};
 assert.deepEqual(T.problemas(unidad,{semillas:400}),[]);assert.notEqual(def.calidad,2);t.diagnostic(JSON.stringify(conteos));
});
