/* Oráculo de superficie: trabajo virtual, equilibrio e inversas por bisección.
 * No importa los cálculos del constructor ni el comprobador de reservas. */
'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const def=require(process.env.FLUIDOS_SUPERFICIE_MODULE||'./fluidos.js');
const idea=def.ideas.find(i=>i.id==='tension-superficial');
const pieza=require('../../../nucleo/kit/piezas/fis-estatica.js');
const cerca=(a,b,m='',tol=2e-10)=>assert.ok(Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=tol*Math.max(1e-6,Math.abs(a),Math.abs(b)),m+': '+a+' ≠ '+b);
function raiz(fn,lo,hi){assert.ok(fn(lo)*fn(hi)<=0,'Raíz acotada');for(let i=0;i<100;i++){const x=(lo+hi)/2;if(fn(lo)*fn(x)<=0)hi=x;else lo=x;}return(lo+hi)/2;}
function tiron(gamma,L,n){let trabajo=0;const avance=.007;for(let cara=0;cara<n;cara++)trabajo+=gamma*(L*avance);return trabajo/avance;}
function balance(ga,r,rho,g,h){let arriba=0;for(let i=0;i<128;i++)arriba+=ga*(2*Math.PI*r/128);const volumen=Math.PI*r*r*h;return arriba-rho*volumen*g;}
const coef=(F,L,n)=>raiz(ga=>tiron(ga,L,n)-F,0,1);
const altura=(ga,r,rho,g)=>raiz(h=>balance(ga,r,rho,g,h),0,2);
const radio=(ga,h,rho,g)=>raiz(r=>balance(ga,r,rho,g,h)/r,1e-8,.1);
const coefCap=(r,rho,g,h)=>raiz(ga=>balance(ga,r,rho,g,h),0,1);
const unidades={fuerza:'mN',coeficiente:'N/m',longitud:'cm',sosten:'mN','coeficiente-peso':'N/m','capilar-altura':'cm','calibracion-sosten':'mN','calibracion-capilar':'cm','capilar-diametro':'mm','capilar-pelicula':'mN','sosten-capilar-diametro':'mm'};
function independiente(c){
  const g=c.g??10,n=c.n,n_cal=c.nCal,L_cal=c.LcalCm/100,F_cal=c.FcalmN/1000;
  let gamma=c.gamma??(c.gammaMilli===undefined?undefined:c.gammaMilli/1000),L=c.Lcm===undefined?c.Lmm/1000:c.Lcm/100;
  let r=c.rMm===undefined?c.dMm/2000:c.rMm/1000,h=c.hCm/100,m=c.mGramos===undefined?0:c.mGramos/1000;
  let F,T=c.TmN/1000,P=m*g,valor;const intermedios={};
  switch(c.tipo){
  case 'fuerza':F=tiron(gamma,L,n);T=F;valor=F*1000;break;
  case 'coeficiente':F=c.FmN/1000;gamma=coef(F,L,n);valor=gamma;break;
  case 'longitud':F=c.FmN/1000;L=raiz(l=>tiron(gamma,l,n)-F,0,1);valor=L*100;break;
  case 'sosten':F=tiron(gamma,L,n);T=F+P;valor=T*1000;Object.assign(intermedios,{F,peso:P});break;
  case 'coeficiente-peso':F=T-P;gamma=coef(F,L,n);valor=gamma;Object.assign(intermedios,{F,peso:P});break;
  case 'capilar-altura':h=altura(gamma,r,c.rho,g);valor=h*100;intermedios.r=r;break;
  case 'calibracion-sosten':gamma=coef(F_cal,L_cal,n_cal);F=tiron(gamma,L,n);T=F+P;valor=T*1000;Object.assign(intermedios,{gamma,F,peso:P});break;
  case 'calibracion-capilar':gamma=coef(F_cal,L_cal,n_cal);h=altura(gamma,r,c.rho,g);valor=h*100;Object.assign(intermedios,{gamma,r});break;
  case 'capilar-diametro':r=radio(gamma,h,c.rho,g);valor=2*r*1000;intermedios.r=r;break;
  case 'capilar-pelicula':gamma=coefCap(r,c.rho,g,h);F=tiron(gamma,L,n);valor=F*1000;Object.assign(intermedios,{gamma,r,h});break;
  case 'sosten-capilar-diametro':F=T-P;gamma=coef(F,L,n);r=radio(gamma,h,c.rho,g);valor=2*r*1000;Object.assign(intermedios,{gamma,peso:P,r});break;
  default:throw Error('Caso no auditado: '+c.tipo);
  }
  assert.ok(gamma>0&&g>0,'Material y gravedad positivos');if(Number.isFinite(L))assert.ok(L>0);
  if(c.tipo.includes('capilar')){assert.ok(h/r>=40-1e-7,'Menisco pequeño frente a la columna');cerca(balance(gamma,r,c.rho,g,h),0,'Equilibrio capilar',.00001);}
  const V=Number.isFinite(r)&&Number.isFinite(h)?Math.PI*r*r*h:undefined;
  const env={gamma,L,n,n_cal,L_cal,F_cal,r,d:2*r,h,rho:c.rho,g,m,F,T,P,V};
  return{valor,unidad:unidades[c.tipo],env,intermedios};
}
function errores(c,e){
  const x=e.env,{gamma:ga,L,n,r,h,rho,g,m}=x,P=m*g;let er={};
  switch(c.tipo){
  case 'fuerza':er={[n===2?'UNA_CARA':'MEDIA_LONGITUD']:n===2?tiron(ga,L,1)*1000:tiron(ga,L/2,n)*1000,DOBLE_CARAS:tiron(ga,L,2*n)*1000,LONGITUD_DECIMA:tiron(ga,L/10,n)*1000};break;
  case 'coeficiente':er={SIN_CARAS:coef(c.FmN/1000,L,1),CUATRO_CARAS:coef(c.FmN/1000,L,4),LONGITUD_DECUPLA:coef(c.FmN/1000,L*10,n)};break;
  case 'longitud':er={SIN_CARAS:raiz(l=>tiron(ga,l,1)-c.FmN/1000,0,1)*100,CUATRO_CARAS:raiz(l=>tiron(ga,l,4)-c.FmN/1000,0,1)*100,METROS_POR_DIEZ:L*10};break;
  case 'sosten':er={SIN_PESO:tiron(ga,L,n)*1000,RESTA_PESO:(tiron(ga,L,n)-P)*1000,DOBLE_TIRON:(tiron(ga,L,2*n)+P)*1000};break;
  case 'coeficiente-peso':er={SIN_DESCONTAR:coef(c.TmN/1000,L,n),SUMA_PESO:coef(c.TmN/1000+P,L,n),UNA_CARA:coef(c.TmN/1000-P,L,1)};break;
  case 'capilar-altura':er={SIN_DOS:altura(ga/2,r,rho,g)*100,MITAD_RADIO:altura(ga,r/2,rho,g)*100,RADIO_DECUPLO:altura(ga,r*10,rho,g)*100};break;
  case 'calibracion-sosten':er={SIN_CARAS_CAL:(tiron(coef(x.F_cal,x.L_cal,1),L,n)+P)*1000,SIN_PESO:tiron(ga,L,n)*1000,DOBLE_PESO:(tiron(ga,L,n)+2*P)*1000};break;
  case 'calibracion-capilar':er={SIN_CARAS_CAL:altura(coef(x.F_cal,x.L_cal,1),r,rho,g)*100,SIN_DOS:altura(ga/2,r,rho,g)*100,LONGITUD_CAL_DECUPLA:altura(coef(x.F_cal,x.L_cal*10,x.n_cal),r,rho,g)*100};break;
  case 'capilar-diametro':er={DA_RADIO:r*1000,DUPLICA_DIAMETRO:4*r*1000,ALTURA_DECIMA:2*radio(ga,h/10,rho,g)*1000};break;
  case 'capilar-pelicula':er={SIN_MITAD_CAL:tiron(coefCap(r,rho,g,h)*2,L,n)*1000,UNA_CARA:tiron(ga,L,1)*1000,ALTURA_DECIMA:tiron(coefCap(r,rho,g,h/10),L,n)*1000};break;
  case 'sosten-capilar-diametro':er={SIN_DESCONTAR:2*radio(coef(c.TmN/1000,L,n),h,rho,g)*1000,SUMA_PESO:2*radio(coef(c.TmN/1000+P,L,n),h,rho,g)*1000,DA_RADIO:r*1000};break;
  }
  return er;
}
function plano(x){if(x==null)return '';if(typeof x!=='object')return String(x);if(Array.isArray(x))return x.map(plano).join('');if('t'in x)return plano(x.t);if(x.negrita)return plano(x.negrita);if(x.frac)return '('+plano(x.frac[0])+')/('+plano(x.frac[1])+')';if(x.sup)return '('+plano(x.sup[0])+')^('+plano(x.sup[1])+')';if(x.sub)return plano(x.sub[0])+'_'+plano(x.sub[1]);return '';}
function texto(x){if(x==null||typeof x==='function')return '';if(typeof x!=='object')return String(x);if(Array.isArray(x))return x.map(texto).join(' ');if(x.t||x.frac||x.sup||x.sub)return plano(x);return Object.values(x).map(texto).join(' ');}
function numero(x){const s=plano(x).replace(/−/g,'-').replace(/(?<=\d)[ \u00a0\u202f](?=\d{3}(?:\D|$))/g,''),m=s.match(/[+-]?\d+(?:[,.]\d+)?/g);assert.equal(m?.length,1,'Una cantidad: '+s);return Number(m[0].replace(',','.'));}
function visible(s,v,u){const t=plano(s),z=numero(s),d=Math.abs(z-v);assert.ok(t.includes(u),'Unidad visible '+t);if(d>2e-10*Math.max(1e-6,Math.abs(v)))assert.ok(t.includes('≈'),'Falta ≈: '+t+' / '+v);assert.ok(d<=.000500001,'Redondeo incorrecto '+t+' / '+v);}
function nodos(x,out=[]){if(Array.isArray(x))x.forEach(y=>nodos(y,out));else if(x&&typeof x==='object'){if(x.v&&/^[+−-]?\d/.test(x.t))out.push(x);else Object.values(x).forEach(y=>{if(typeof y==='object')nodos(y,out);});}return out;}
const entradasMap={gamma:['gamma','N/m'],gammaMilli:['gamma','mN/m'],Lcm:['L','cm'],Lmm:['L','mm'],n:['n',''],FmN:['F','mN'],TmN:['T','mN'],mGramos:['m','g'],rMm:['r','mm'],dMm:['d','mm'],hCm:['h','cm'],rho:['rho','kg/m³'],FcalmN:['F','mN'],LcalCm:['L','cm'],nCal:['n','']};
const color={F:'h',T:'h',m:'f',gamma:'f',rho:'f',n:'f',L:'d',r:'d',d:'d',h:'d'};
function entradas(p,c){const ns=nodos(p.enunciado||p.pregunta).slice();for(const[k,v]of Object.entries(c))if(!['tipo','g','valor','unidad','intermedios','errores'].includes(k)){const [magnitud,u]=entradasMap[k]||[];assert.ok(magnitud,'Entrada nueva '+k);const j=ns.findIndex(n=>n.m===magnitud&&Math.abs(numero(n)-v)<1e-8&&(!u||plano(n).endsWith(' '+u)));assert.ok(j>=0,'Entrada ausente '+k+'='+v);assert.equal(ns[j].v,'c-'+color[magnitud]);ns.splice(j,1);}assert.equal(ns.length,0,'Números sin entradas');
  for(const d of p.datos||[]){const s=plano(d);assert.doesNotMatch(s,/F\s*=|T\s*=|h\s*=|γ\s*=|ρ\s*[·×]|despej|divid|multiplic|sumamos|restamos|dos radios|circunferencia.*radio/i,'Datos no presenta el camino');}
}
const UNIT={'mN/m':.001,'N/m':1,'kg/m³':1,'m/s²':1,'mN':.001,'N':1,'cm':.01,'mm':.001,'m³':1,'m²':1,'m':1,'kg':1,'g':.001,'°':1};
const ordered=Object.keys(UNIT).sort((a,b)=>b.length-a.length),unitPattern=ordered.map(x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|');
function unitFinal(s){return ordered.find(u=>s.trim().endsWith(' '+u));}
function evaluar(s,env,factor){
  s=s.replace(/−/g,'-').replace(/[·×]/g,'*').replace(/,/g,'.').replace(/ρ/g,'rho').replace(/γ/g,'gamma').replace(/θ/g,'theta').replace(/π/g,'pi').replace(/(?<=\d)[ \u00a0\u202f](?=\d{3}(?:\D|$))/g,'');
  let hasUnits=false,hasVars=false;
  s=s.replace(new RegExp('([+-]?\\d+(?:\\.\\d+)?)\\s+('+unitPattern+')(?![A-Za-z/²³])','g'),(_,num,u)=>{hasUnits=true;return '('+num+'*'+UNIT[u]+')';});
  s=s.replace(/(\d)pi\b/g,'$1*pi');
  s=s.replace(/\b[A-Za-z]+(?:_[A-Za-z0-9]+)?\b/g,k=>{if(k==='pi')return '('+Math.PI+')';assert.ok(Number.isFinite(env[k]),'Símbolo sin valor '+k+' en '+s);hasVars=true;return '('+env[k]+')';});
  s=s.replace(/(\d+(?:\.\d+)?)e([+-]?\d+)/g,'($1*10**($2))').replace(/\^/g,'**');assert.match(s,/^[\d\s()+*/.\-]+$/,'Cuenta cerrada '+s);
  const v=Function('"use strict";return ('+s+')')();assert.ok(Number.isFinite(v));return v*(hasUnits||hasVars?1:factor);
}
const cuentas={ejemplos:0,resuelve:0,ahoraTu:0,ecuaciones:0,opciones:0,figuras:0};
function ecuaciones(filas,e){for(const fila of filas)if(fila?.ecuacion)for(const b of plano(fila.ecuacion).split(/;|⇒| {3}· {3}/)){
  const ps=b.split(/(=|≈)/).map(s=>s.trim());if(ps.length<3)continue;const expr=ps.filter((_,i)=>!(i%2));
  const factors=expr.map((_,i)=>UNIT[expr.slice(i).map(unitFinal).find(Boolean)||e.unidad]);
  const vs=expr.map((s,i)=>evaluar(s,e.env,factors[i]));
  for(let i=1;i<vs.length;i++){if(ps[2*i-1]==='=')cerca(vs[i-1],vs[i],'Igualdad '+b);else{const mm=expr[i].match(/^[−+-]?\d+(?:,(\d+))?\s/),digits=mm?(mm[1]||'').length:3;assert.ok(Math.abs(vs[i-1]-vs[i])<=(.5*10**-digits+1e-9)*factors[i],'Aproximación '+b);}cuentas.ecuaciones++;}
}}
const pisa=(a,b)=>a.x0<b.x1&&b.x0<a.x1&&a.y0<b.y1&&b.y0<a.y1;
function cruza(b,a,z){let lo=0,hi=1;const dx=z[0]-a[0],dy=z[1]-a[1];for(const[p,q]of[[-dx,a[0]-b.x0],[dx,b.x1-a[0]],[-dy,a[1]-b.y0],[dy,b.y1-a[1]]]){if(Math.abs(p)<1e-12){if(q<0)return false;}else{const r=q/p;if(p<0)lo=Math.max(lo,r);else hi=Math.min(hi,r);}}return lo<hi;}
function geometria(d,nombre,c){
  const datos=Array.isArray(d.datos.cortes)?{...d.datos,...d.datos.cortes[d.estado?.corte||0]}:d.datos;
  const g=pieza.geometria(d.datos,d.estado||{});assert.doesNotMatch(pieza.dibujar(d.datos,d.estado||{}),/NaN|Infinity|undefined|\[object Object\]/);
  for(const r of g.rotulos){assert.ok(r.x0>=4&&r.x1<=316&&r.y0>=4&&r.y1<=g.H-4,nombre+' margen '+r.texto);for(const l of datos.lineas||[])assert.ok(!cruza(r,l.de,l.a),nombre+' línea sobre '+r.texto);}
  for(let i=0;i<g.rotulos.length;i++)for(let j=i+1;j<g.rotulos.length;j++)assert.ok(!pisa(g.rotulos[i],g.rotulos[j]),nombre+' rótulos '+g.rotulos[i].texto+' / '+g.rotulos[j].texto);
  for(const flecha of g.flechas){for(const [x,y]of[[flecha.x1,flecha.y1],[flecha.x2,flecha.y2]])assert.ok(x>=4&&x<=316&&y>=4&&y<=g.H-4);for(const b of g.rotulos)assert.ok(!cruza(b,[flecha.x1,flecha.y1],[flecha.x2,flecha.y2]),'Flecha sobre '+b.texto);}
  if(c){assert.equal(datos.caso,undefined);assert.equal(datos.valor,undefined);if(c.tipo.includes('capilar')){assert.ok(g.rotulos.some(r=>r.texto==='Esquema sin escala'));const paredes=datos.lineas.slice(0,2);assert.deepEqual(paredes.map(l=>[l.de,l.a]),[[[136,126],[136,260]],[[160,126],[160,260]]],'Tubo canónico independiente del resultado');if(c.hCm===undefined)assert.ok(!g.rotulos.some(r=>/h = \d/.test(r.texto)));if(c.gamma===undefined)assert.ok(!g.rotulos.some(r=>/γ =/.test(r.texto)),'No dibuja gamma inferida');}
    else if(c.Lcm!==undefined||c.Lmm!==undefined){const L=c.Lcm===undefined?c.Lmm/1000:c.Lcm/100;cerca(datos.lineas[0].a[0]-datos.lineas[0].de[0],L*1500,'Escala de contacto');}else assert.ok(g.rotulos.some(r=>r.texto==='Esquema sin escala'));
    assert.equal((datos.flechas||[]).length,0,'Fuerza pedida no codificada por flecha');}
  cuentas.figuras++;return g;
}
function comprobar(p,nombre){const c=p.caso,e=independiente(c),er=errores(c,e);cerca(c.valor,e.valor,nombre);assert.equal(c.unidad,e.unidad);entradas(p,c);
  for(const[k,v]of Object.entries(c.intermedios||{})){assert.ok(k in e.intermedios,'Intermedio '+k);cerca(v,e.intermedios[k],nombre+' '+k);}
  for(const o of c.errores){assert.ok(o.operacion in er);cerca(o.valor,er[o.operacion],nombre+' error '+o.operacion);}
  if(p.respuesta)visible(p.respuesta,e.valor,e.unidad);ecuaciones(p.pasos||(Array.isArray(p.solucion)?p.solucion:[p.solucion]),e);
  if(p.opciones){assert.equal(p.opciones.length,4);assert.equal(p.opciones.filter(o=>o.correcta).length,1);assert.equal(p.opciones.filter(o=>Math.abs(o.valor-e.valor)<=1e-9).length,1);assert.equal(new Set(p.opciones.map(o=>numero(o.texto))).size,4);
    for(const o of p.opciones){const oper=o.error?.replace('FL12-S-',''),v=o.correcta?e.valor:er[oper];assert.ok(Number.isFinite(v));cerca(o.valor,v);visible(o.texto,v,e.unidad);if(!o.correcta){assert.ok(o.siFuera.split(/\s+/).length<=20);visible(o.siFuera.split('Resulta ')[1].replace(/\.$/,''),v,e.unidad);assert.ok(v>0&&Math.max(v,e.valor)/Math.min(v,e.valor)<=20+1e-8);}cuentas.opciones++;}}
  if(p.alternativas){const vs=[e.valor,...Object.values(er)];assert.equal(p.alternativas.length,4);assert.equal(p.alternativas.filter(s=>Math.abs(numero(s)-e.valor)<=.000500001).length,1);for(const s of p.alternativas){const v=vs.find(v=>Math.abs(numero(s)-v)<=.000500001);assert.ok(Number.isFinite(v));visible(s,v,e.unidad);}for(const v of Object.values(er)){const s=p.alternativas.find(s=>Math.abs(numero(s)-v)<=.000500001);assert.ok(texto(p.solucion.at(-1)).includes(s),'Descarte explicado');}}
  geometria(p.dibujo||p.figura,nombre,c);return e;
}
test('Fluidos: el oráculo de superficie usa trabajo, balance y detecta igualdades falsas',()=>{
  cerca(tiron(.03,.12,2),.0072);cerca(altura(.05,.0005,1000,10),.02);cerca(radio(.06,.03,800,10),.0005);
  const c={tipo:'sosten-capilar-diametro',TmN:14,Lcm:10,n:2,mGramos:.2,g:10,hCm:3,rho:1000};cerca(independiente(c).valor,.8);cerca(independiente({...c,valor:999,intermedios:{gamma:999}}).valor,.8);
  assert.throws(()=>visible('1,333 cm',4/3,'cm'),/Falta ≈/);
  assert.throws(()=>ecuaciones([{ecuacion:'F = 2 · 0,03 · 0,12 = 0,0036 N'}],{unidad:'N',env:{F:.0072}}),/Igualdad/);
});
test('Fluidos: superficie, quince ejemplos por dos caminos y todas sus afirmaciones',()=>{
  assert.ok(idea);assert.equal(idea.ejemplos.length,15);assert.deepEqual(idea.ejemplos.reduce((a,p)=>(a[p.nivel-1]++,a),[0,0,0]),[5,5,5]);
  const tabla=[2,4,.03,20,3,4.8,8,.03,2,2,9,2,1,12,.8];for(const[i,p]of idea.ejemplos.entries()){cerca(comprobar(p,'Ejemplo '+(i+1)).valor,tabla[i]);cuentas.ejemplos++;}
});
for(const momento of ['resuelve','ahoraTu'])test('Fluidos: superficie,400 semillas de '+momento,()=>{const tipos=new Set();for(let s=0;s<400;s++){const p=idea[momento].generar(s);comprobar(p,momento+'/'+s);tipos.add(p.caso.tipo);cuentas[momento]++;}assert.equal(tipos.size,5);});
test('Fluidos: superficie, misión única y predicción sin respuesta previa',()=>{
  for(const tarjeta of idea.lee.tarjetas)if(tarjeta.dibujo)geometria(tarjeta.dibujo,'Lee');
  const gana=[];for(const o of idea.juega.controles[0].opciones){const v={gamma:o.valor},F=tiron(v.gamma,.06,2);if(idea.juega.mision.logrado(v))gana.push(v.gamma);visible(nodos(idea.juega.lectura(v))[0],F*1000,'mN');const d=idea.juega.dibujo(v),geo=geometria(d,'juega');visible(geo.rotulos.find(r=>r.texto.startsWith('T =')).texto,F*1000,'mN');cerca(geo.flechas[0].L,F*6000,'Escala de fuerza fija');cerca(d.datos.lineas[0].a[0]-d.datos.lineas[0].de[0],.06*1500);}
  assert.deepEqual(gana,[.04]);assert.equal(idea.juega.mision.logrado({gamma:idea.juega.controles[0].inicio}),false);
  const esperados={c:tiron(.03,.12,2)*1000,'FL12-S-UNA_CARA':tiron(.03,.12,1)*1000,'FL12-S-CUATRO_CARAS':tiron(.03,.12,4)*1000,'FL12-S-CM_MIL':tiron(.03,.012,2)*1000};
  assert.equal(idea.predice.opciones.filter(o=>o.correcta).length,1);for(const o of idea.predice.opciones){const v=esperados[o.correcta?'c':o.error];cerca(o.valor,v);visible(o.texto,v,'mN');if(!o.correcta)visible(o.siFuera.split('Resulta ')[1].replace(/\.$/,''),v,'mN');}
  assert.doesNotMatch(texto([idea.lee,idea.juega.consigna,idea.juega.mision,idea.predice.datos,idea.predice.dibujo,def.glosario]),/7,2 mN|0,0072 N/);
  assert.equal(idea.predice.dibujo.datos.flechas.length,0);const reve=geometria(idea.predice.revelar,'revelación');cerca(reve.flechas[0].L,.0072*6000);geometria(idea.predice.dibujo,'Predice');
});
test('Fluidos: superficie, Mira y Regla en400 estados y cambio real de montaje',()=>{
  const antes=pieza.geometria(idea.mira.datos,idea.mira.pasos[0].estado),despues=pieza.geometria(idea.mira.datos,idea.mira.pasos[3].estado);assert.ok(antes.rotulos.some(x=>/Película/.test(x.texto)));assert.ok(despues.rotulos.some(x=>/Capilar/.test(x.texto)));
  ecuaciones(idea.mira.pasos.slice(0,3),{unidad:'N',env:{F:.0072,n:2,gamma:.03,L:.12,m:0,g:10,T:.0072}});
  for(let s=0;s<400;s++){const ga=.02+(s%7)*.005,r=.0002+(s%5)*.00005,rho=800+(s%4)*100,g=10,h=altura(ga,r,rho,g),V=Math.PI*r*r*h,P=rho*V*g,F=tiron(ga,2*Math.PI*r,1);const env={gamma:ga,r,rho,g,h,V,P,F,d:2*r,n:1,L:2*Math.PI*r,theta:0};ecuaciones(idea.mira.pasos.slice(3),{unidad:'N',env});ecuaciones([idea.regla],{unidad:'N',env});}
  for(const paso of idea.mira.pasos)geometria({datos:idea.mira.datos,estado:paso.estado},'Mira');geometria(idea.regla.dibujo,'Regla');
});
test('Fluidos: superficie, bancos distintos y C2 simulado en400 semillas',()=>{
  const firma=c=>JSON.stringify(Object.fromEntries(Object.entries(c).filter(([k])=>!['valor','unidad','intermedios','errores'].includes(k)).sort(([a],[b])=>a.localeCompare(b))));
  const ejemplos=new Set(idea.ejemplos.map(p=>firma(p.caso))),res=new Set();for(let s=0;s<400;s++){const c=idea.resuelve.generar(s).caso;assert.ok(!ejemplos.has(firma(c)));res.add(firma(c));}for(let s=0;s<400;s++){const c=idea.ahoraTu.generar(s).caso;assert.ok(!ejemplos.has(firma(c)));assert.ok(!res.has(firma(c)));}
  const T=require('../../../nucleo/teoria.js'),g=def.glosario.filter(x=>['tensión superficial','línea de contacto','capilaridad'].includes(x.termino));assert.deepEqual(T.problemas({...def,ideas:[idea],laboratorio:undefined,laboratorioIdeas:undefined,glosario:g,calidad:2},{semillas:400}),[]);
});
