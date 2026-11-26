/* Oráculo independiente: presión por peso de una columna y balances de fuerzas.
 * Solo se importa la unidad como objeto bajo prueba; no su calculador ni formateador. */
'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const def=require(process.env.FLUIDOS_PRESION_MODULE || './fluidos.js');
const idea=def.ideas.find(i=>i.id==='presion-profundidad');
const pieza=require('../../../nucleo/kit/piezas/fis-fluidos-e12.js');
const cerca=(a,b,m='')=>assert.ok(Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=2e-9*Math.max(1,Math.abs(a),Math.abs(b)),m+': '+a+' ≠ '+b);
const UNIDADES={'kg/L':1000,'kg/m³':1,'Pa':1,'kPa':1000,'N':1,'cm²':.0001,'m²':1,'m':1,'kg':1,'g':.001,'L':.001,'cm³':.000001,'m³':1,'m/s²':1};
const unidades={densidad:'kg/L',presion:'Pa',fuerza:'N',incremento:'kPa',manometrica:'kPa','densidad-conversion':'kg/m³',area:'cm²',absoluta:'kPa',profundidad:'m','densidad-desnivel':'kg/m³','muestra-profundidad':'m','area-tapa':'cm²','dos-lecturas':'kPa','masa-presiones':'kg','tapa-profundidad':'m'};
const conteo={ejemplos:0,resuelve:0,ahoraTu:0,ecuaciones:0,opciones:0};
function raizLineal(fn) {
  // El secante de un balance lineal no reutiliza su despeje productivo.
  const a=fn(0),b=fn(1); assert.notEqual(a,b,'Balance no degenerado');
  const z=-a/(b-a); cerca(fn(z),0,'Residuo del balance'); return z;
}
function columna(rho,h,g) {
  const area=.029,volumen=area*h,masa=rho*volumen,peso=masa*g;
  return peso/area;
}
function independiente(c) {
  const g=c.g??10;
  let rho=c.rho, h=c.h, A=c.A, m=c.m,V=c.VL===undefined?undefined:c.VL/1000;
  let p0=c.p0===undefined?undefined:c.p0*1000, pAbs=c.pAbs===undefined?undefined:c.pAbs*1000;
  let pExt=c.pExt===undefined?undefined:c.pExt*1000,F=c.F,p=c.p,valor,dp;
  switch(c.tipo) {
  case 'densidad': rho=raizLineal(x=>x*V-m);valor=rho/1000;break;
  case 'presion': p=raizLineal(x=>x*A-F);valor=p;break;
  case 'fuerza': F=c.p*A;valor=F;break;
  case 'incremento': dp=columna(rho,h,g);p0=100000;pAbs=p0+dp;valor=dp/1000;break;
  case 'manometrica': dp=pAbs-pExt;valor=dp/1000;break;
  case 'densidad-conversion': m=c.mg/1000;V=c.Vcm/1e6;rho=raizLineal(x=>x*V-m);valor=rho;break;
  case 'area': p=c.p*1000;A=raizLineal(x=>p*x-F);valor=A*10000;break;
  case 'absoluta': pAbs=p0+columna(rho,h,g);valor=pAbs/1000;break;
  case 'profundidad': h=raizLineal(x=>p0+columna(rho,x,g)-pAbs);valor=h;break;
  case 'densidad-desnivel': dp=c.dp*1000;rho=raizLineal(x=>columna(x,c.h2,g)-columna(x,c.h1,g)-dp);valor=rho;break;
  case 'muestra-profundidad': rho=raizLineal(x=>x*V-m);h=raizLineal(x=>p0+columna(rho,x,g)-pAbs);valor=h;break;
  case 'area-tapa': pAbs=p0+columna(rho,h,g);dp=pAbs-pExt;A=raizLineal(x=>pAbs*x-pExt*x-F);valor=A*10000;break;
  case 'dos-lecturas': rho=raizLineal(x=>columna(x,c.h2,g)-columna(x,c.h1,g)-(c.p2-c.p1)*1000);p0=raizLineal(x=>x+columna(rho,c.h1,g)-c.p1*1000);valor=p0/1000;break;
  case 'masa-presiones': rho=raizLineal(x=>p0+columna(x,h,g)-pAbs);m=rho*V;valor=m;break;
  case 'tapa-profundidad': A=c.Acm/10000;h=raizLineal(x=>(p0+columna(rho,x,g))*A-pExt*A-F);pAbs=p0+columna(rho,h,g);dp=pAbs-pExt;valor=h;break;
  default: throw Error('Tipo sin oráculo: '+c.tipo);
  }
  if(rho!==undefined)assert.ok(rho>0,'Densidad positiva');
  if(A!==undefined)assert.ok(A>0,'Área positiva');
  if(h!==undefined)assert.ok(h>=0,'Profundidad no negativa');
  if(pAbs!==undefined)assert.ok(pAbs>0,'Presión absoluta positiva');
  if(p0!==undefined)assert.ok(p0>0,'Referencia absoluta positiva');
  if(V!==undefined)assert.ok(V>0,'Volumen positivo');
  if(m!==undefined)assert.ok(m>0,'Masa positiva');
  const env={rho,m,V,A,F,g,h,p,p_abs:pAbs,p_0:p0,p_ext:pExt,p_man:dp,p_1:c.p1===undefined?undefined:c.p1*1000,p_2:c.p2===undefined?undefined:c.p2*1000,h_1:c.h1,h_2:c.h2,DeltaP:c.dp===undefined?undefined:c.dp*1000,DeltaH:c.h2===undefined?undefined:c.h2-c.h1};
  if(c.tipo==='incremento')env.p=pAbs;
  const intermedios={};
  if(['muestra-profundidad','dos-lecturas','masa-presiones'].includes(c.tipo))intermedios.rho=rho;
  if(c.tipo==='area-tapa')Object.assign(intermedios,{pInt:pAbs/1000,dp:dp/1000});
  if(c.tipo==='tapa-profundidad')intermedios.dp=dp/1000;
  return {valor,unidad:unidades[c.tipo],env,intermedios};
}
function errores(c,e) {
  const x=e.env,g=x.g;let r={};
  switch(c.tipo) {
  case 'muestra-profundidad': r={SIN_SUPERFICIE:c.pAbs*1000/(x.rho*g),SUMA_SUPERFICIE:(c.pAbs+c.p0)*1000/(x.rho*g),PRODUCTO_MUESTRA:(c.pAbs-c.p0)/(c.m*c.VL*g)};break;
  case 'area-tapa': r={SIN_EXTERIOR:c.F/x.p_abs*10000,SIN_COLUMNA:c.F/((c.p0-c.pExt)*1000)*10000,SUMA_CARAS:c.F/(x.p_abs+x.p_ext)*10000};break;
  case 'dos-lecturas': r={PRIMER_SENSOR:c.p1,SUMA_COLUMNA:c.p1+columna(x.rho,c.h1,g)/1000,SEGUNDO_SIN_REFERENCIA:c.p1-columna(c.p2*1000/(g*c.h2),c.h1,g)/1000};break;
  case 'masa-presiones':r={SIN_SUPERFICIE:c.pAbs*1000/(g*c.h)*(c.VL/1000),SUMA_SUPERFICIE:(c.pAbs+c.p0)*1000/(g*c.h)*(c.VL/1000),SIN_GRAVEDAD:(c.pAbs-c.p0)*1000/c.h*(c.VL/1000)};break;
  case 'tapa-profundidad':r={SIN_REFERENCIA:c.F/x.A/(c.rho*g),SUMA_REFERENCIA:(c.F/x.A+(c.p0-c.pExt)*1000)/(c.rho*g),SIN_EXTERIOR:(c.F/x.A-c.p0*1000)/(c.rho*g)};break;
  }
  return r;
}
function plano(x) {
  if(x==null)return '';if(typeof x!=='object')return String(x);if(Array.isArray(x))return x.map(plano).join('');
  if('t'in x)return plano(x.t);if(x.negrita)return plano(x.negrita);
  if(x.frac)return '('+plano(x.frac[0])+')/('+plano(x.frac[1])+')';
  if(x.sub)return plano(x.sub[0])+'_'+plano(x.sub[1]);if(x.sup)return '('+plano(x.sup[0])+')^('+plano(x.sup[1])+')';return '';
}
function texto(x) {if(x==null||typeof x==='function')return '';if(typeof x!=='object')return String(x);if(Array.isArray(x))return x.map(texto).join(' ');if(x.t||x.frac||x.sub||x.sup)return plano(x);return Object.values(x).map(texto).join(' ');}
function numero(s) {s=plano(s).replace(/(?<=\d)[ \u00a0\u202f](?=\d{3}(?:\D|$))/g,'').replace(/−/g,'-');const a=s.match(/[+-]?\d+(?:[,.]\d+)?/g);assert.equal(a?.length,1,'Cantidad única: '+s);return Number(a[0].replace(',','.'));}
function visible(s,valor,unidad) {
  const t=plano(s),v=numero(t),d=Math.abs(v-valor);assert.ok(t.includes(unidad),'Unidad: '+t);
  if(d>1e-9*Math.max(1,Math.abs(valor)))assert.ok(t.includes('≈'),'Falta aproximación: '+t+' / '+valor);
  assert.ok(d<=.00050001,'Redondeo: '+t+' / '+valor);
}
function nodos(x,out=[]) {if(Array.isArray(x))x.forEach(v=>nodos(v,out));else if(x&&typeof x==='object'){if(x.v&&/^[+−-]?\d/.test(x.t))out.push(x);else Object.values(x).forEach(v=>{if(typeof v==='object')nodos(v,out);});}return out;}
const entradaUnidad={m:'kg',VL:'L',mg:'g',Vcm:'cm³',rho:'kg/m³',F:'N',A:'m²',Acm:'cm²',p0:'kPa',pAbs:'kPa',pExt:'kPa',dp:'kPa',p1:'kPa',p2:'kPa',h:'m',h1:'m',h2:'m'};
const entradaColor={m:'f',VL:'d',mg:'f',Vcm:'d',rho:'f',F:'h',A:'d',Acm:'d',p:'i',p0:'i',pAbs:'i',pExt:'i',dp:'i',p1:'i',p2:'i',h:'d',h1:'d',h2:'d'};
function entradas(p,c) {
  const ns=nodos(p.enunciado||p.pregunta).slice();
  for(const[k,v]of Object.entries(c))if(!['tipo','g','valor','unidad','intermedios','errores'].includes(k)) {
    const u=k==='p'?(c.tipo==='fuerza'?'Pa':'kPa'):entradaUnidad[k];assert.ok(u,'Entrada desconocida '+k);
    const j=ns.findIndex(n=>Math.abs(numero(n)-v)<1e-9&&plano(n).endsWith(' '+u));assert.ok(j>=0,'Entrada ausente '+k+'='+v+' '+u);
    assert.equal(ns[j].v,'c-'+entradaColor[k],'Color de '+k);ns.splice(j,1);
  }
  assert.equal(ns.length,0,'Números del enunciado sin entrada');
  for(const d of p.datos||[]) {
    const t=plano(d);
    assert.doesNotMatch(t,/ρ\s*=|p\s*=|F\s*\/\s*A|ρ\s*[·×]|dividimos|multiplicamos|despejamos|restamos|sumamos/i,'Datos anticipa el camino');
    if(t.includes('='))assert.match(t,/^(?:1 (?:g|cm³|kPa|L|cm²)\s*=|.*\bg = 10 m\/s²)/,'Datos solo equivalencias o parámetro g');
  }
}
const listaUnidades=Object.keys(UNIDADES).sort((a,b)=>b.length-a.length);
function unidadFinal(s){for(const u of listaUnidades)if(s.trim().endsWith(' '+u))return u;return undefined;}
function evaluar(s,env,factor) {
  s=s.trim().replace(/−/g,'-').replace(/[·×]/g,'*').replace(/,/g,'.').replace(/ρ/g,'rho').replace(/Δp/g,'DeltaP').replace(/Δh/g,'DeltaH');
  s=s.replace(/(?<=\d)[ \u00a0\u202f](?=\d{3}(?:\D|$))/g,'');
  let salida=factor;const u=unidadFinal(s);if(u){s=s.slice(0,-u.length).trim();salida=UNIDADES[u];}
  let simbolico=false;
  s=s.replace(/\b[A-Za-z]+(?:_[A-Za-z0-9]+)?\b/g,k=>{assert.ok(Number.isFinite(env[k]),'Símbolo sin valor: '+k+' en '+s);simbolico=true;return '('+env[k]+')';});
  assert.match(s,/^[\d\s()+*/.\-]+$/,'Expresión matemática cerrada: '+s);
  const valor=Function('"use strict";return ('+s+')')();assert.ok(Number.isFinite(valor),'Cuenta finita');
  return valor*(simbolico?1:salida);
}
function ecuaciones(filas,e) {
  for(const fila of filas)if(fila?.ecuacion)for(const bloque of plano(fila.ecuacion).split(/;|⇒| {3}· {3}/)) {
    const partes=bloque.split(/(=|≈)/).map(s=>s.trim());if(partes.length<3)continue;
    const expresiones=partes.filter((_,i)=>!(i%2));
    const factores=expresiones.map((s,i)=>UNIDADES[expresiones.slice(i).map(unidadFinal).find(Boolean)||e.unidad]);
    const vals=expresiones.map((s,i)=>evaluar(s,e.env,factores[i]));
    for(let i=1;i<vals.length;i++){
      if(partes[2*i-1]==='=')cerca(vals[i-1],vals[i],'Igualdad '+bloque);
      else {const m=expresiones[i].trim().match(/^[−+-]?\d+(?:,(\d+))?\s/),dec=m?(m[1]||'').length:3;assert.ok(Math.abs(vals[i-1]-vals[i])<=(.5*10**(-dec)+1e-10)*factores[i],'Aproximación '+bloque);}
      conteo.ecuaciones++;
    }
  }
}
function comprobar(p,nombre) {
  const c=p.caso,e=independiente(c),er=errores(c,e);cerca(c.valor,e.valor,nombre);assert.equal(c.unidad,e.unidad);entradas(p,c);
  for(const[k,v]of Object.entries(c.intermedios||{})){assert.ok(k in e.intermedios);cerca(v,e.intermedios[k],nombre+' intermedio '+k);}
  for(const a of c.errores||[]){assert.ok(a.operacion in er,'Operación '+a.operacion);cerca(a.valor,er[a.operacion],nombre+' error');}
  if(p.respuesta)visible(p.respuesta,e.valor,e.unidad);
  ecuaciones(p.pasos||(Array.isArray(p.solucion)?p.solucion:[p.solucion]),e);
  if(p.opciones){
    assert.equal(p.opciones.length,4);assert.equal(p.opciones.filter(o=>Math.abs(o.valor-e.valor)<1e-8).length,1);assert.equal(p.opciones.filter(o=>o.correcta).length,1);
    assert.equal(new Set(p.opciones.map(o=>numero(o.texto))).size,4,'Opciones distintas tras formato');
    for(const o of p.opciones){const oper=o.error?.replace('FL12-P-',''),v=o.correcta?e.valor:er[oper];assert.ok(Number.isFinite(v));cerca(o.valor,v);visible(o.texto,v,e.unidad);if(!o.correcta){assert.ok(Math.abs(v/e.valor)>=.05-1e-10&&Math.abs(v/e.valor)<=20+1e-10,'Opciones a escala');assert.ok(o.siFuera.split(/\s+/).length<=20,'siFuera breve');assert.ok(o.siFuera.includes('Obtienes '));visible(o.siFuera.split('Obtienes ')[1].replace(/\.$/,''),v,e.unidad);}conteo.opciones++;}
  }
  if(p.alternativas){assert.equal(p.alternativas.length,4);const vs=[e.valor,...Object.values(er)];assert.equal(p.alternativas.filter(s=>Math.abs(numero(s)-e.valor)<.00050001).length,1);for(const s of p.alternativas){const v=vs.find(v=>Math.abs(numero(s)-v)<.00050001);assert.ok(Number.isFinite(v));visible(s,v,e.unidad);}for(const v of Object.values(er))assert.ok(texto(p.solucion.at(-1)).includes(p.alternativas.find(s=>Math.abs(numero(s)-v)<.00050001)),'Se explica cada alternativa');}
  const d=p.dibujo||p.figura;assert.ok(d,'Figura presente');assert.equal(d.datos.caso,undefined,'No se entrega el caso a la figura');assert.doesNotMatch(texto(d),/NaN|Infinity|undefined/);
  if(['dos-lecturas','densidad-desnivel'].includes(c.tipo)){
    assert.equal(d.datos.modo,'medida');assert.equal(d.datos.escala.vertical,40,'Escala común de profundidad');
    assert.equal(d.datos.vasos.length,1);const nivel=d.datos.vasos[0].nivel;assert.equal(nivel,5,'Referencia geométrica canónica');
    assert.equal(d.datos.puntos.length,2);assert.equal(d.datos.cotas.length,2);
    const geo=pieza.geometria(d.datos,d.estado||{}),superficie=geo.referencias['superficie-tanque'];
    for(const[id,h]of [['superior',c.h1],['inferior',c.h2]]){
      const punto=d.datos.puntos.find(p=>p.id===id),cota=d.datos.cotas.find(q=>q.a===id);
      cerca(nivel-punto.altura,h,'Profundidad conocida');assert.equal(cota.de,'superficie-tanque');visible(cota.texto,h,'m');
      cerca(geo.referencias[id].y-superficie.y,40*h,'Profundidad real dibujada');
    }
    assert.ok(c.h2>c.h1,'Sensor inferior');assert.ok((c.dp??c.p2-c.p1)>0,'Afirmación de presión mayor en alt');
    assert.doesNotMatch(texto(d.datos.rotulos),/ρ|densidad|superficial|absoluta.*superficie/i,'Incógnitas no rotuladas');
    assert.equal(d.datos.rho,undefined);assert.equal(d.datos.p0,undefined);assert.equal(d.datos.valor,undefined);
    if(c.tipo==='dos-lecturas'){
      visible(d.datos.rotulos.find(r=>r.texto.startsWith('Superior:')).texto,c.p1,'kPa');
      visible(d.datos.rotulos.find(r=>r.texto.startsWith('Inferior:')).texto,c.p2,'kPa');
    }else visible(d.datos.rotulos.find(r=>r.texto.startsWith('Aumento:')).texto,c.dp,'kPa');
  }else assert.equal(d.datos.modo,'esquema','Las magnitudes desconocidas no se representan a escala');
  return e;
}
test('Fluidos: el oráculo de presión detecta errores y no depende del resultado declarado',()=>{
  const a={tipo:'muestra-profundidad',m:.8,VL:1,p0:90,pAbs:102,g:10};
  cerca(independiente(a).valor,1.5);cerca(independiente({...a,valor:-999,intermedios:{rho:-1}}).valor,1.5);
  cerca(independiente({tipo:'area-tapa',rho:1000,h:.4,p0:110,pExt:100,F:28,g:10}).valor,20);
  cerca(independiente({tipo:'dos-lecturas',p1:106,p2:118,h1:.5,h2:1.5,g:10}).valor,100);
  assert.throws(()=>visible('1,333 m',4/3,'m'),/aproximación/);
  assert.throws(()=>ecuaciones([{ecuacion:'p = 40 / 0,002 = 2 Pa'}],{unidad:'Pa',env:{p:20000}}),/Igualdad/);
});
test('Fluidos: quince ejemplos de presión, referencias, opciones y ecuaciones',()=>{
  assert.ok(idea,'Idea presion-profundidad');assert.equal(idea.ejemplos.length,15);
  assert.deepEqual(idea.ejemplos.reduce((a,p)=>(a[p.nivel-1]++,a),[0,0,0]),[5,5,5]);
  for(const[i,p]of idea.ejemplos.entries()){comprobar(p,'Ejemplo '+(i+1));conteo.ejemplos++;}
});
for(const momento of ['resuelve','ahoraTu'])test('Fluidos: presión, 400 semillas de '+momento,()=>{
  const tipos=new Set();for(let s=0;s<400;s++){const p=idea[momento].generar(s);comprobar(p,momento+'/'+s);tipos.add(p.caso.tipo);conteo[momento]++;}assert.equal(tipos.size,5,'Cobertura del banco');
});
test('Fluidos: bancos de presión no repiten ejemplos ni casos entre momentos',()=>{
  const firma=c=>JSON.stringify(Object.fromEntries(Object.entries(c).filter(([k])=>!['valor','unidad','intermedios','errores'].includes(k)).sort(([a],[b])=>a.localeCompare(b))));
  const ejemplos=new Set(idea.ejemplos.map(p=>firma(p.caso))),res=new Set();
  for(let s=0;s<400;s++){const c=idea.resuelve.generar(s).caso;assert.ok(!ejemplos.has(firma(c)),'Resuelve repite ejemplo');res.add(firma(c));}
  for(let s=0;s<400;s++){const c=idea.ahoraTu.generar(s).caso;assert.ok(!ejemplos.has(firma(c)),'Ahora repite ejemplo');assert.ok(!res.has(firma(c)),'Se repite problema entre momentos');}
});
test('Fluidos: presión, misión exhaustiva y predicción sin respuesta anticipada',()=>{
  const controles=idea.juega.controles;assert.equal(controles.length,1);assert.equal(controles[0].id,'F');
  const ganan=[];
  for(const o of controles[0].opciones){const v={F:o.valor},p=raizLineal(x=>x*.002-v.F)/1000;if(idea.juega.mision.logrado(v))ganan.push(v.F);const lectura=nodos(idea.juega.lectura(v));visible(lectura.find(n=>n.m==='F'),v.F,'N');visible(lectura.find(n=>n.m==='p'),p,'kPa');const d=idea.juega.dibujo(v).datos;visible(d.rotulos.find(r=>r.color==='i').texto,p,'kPa');}
  assert.deepEqual(ganan,[60]);assert.equal(idea.juega.mision.logrado({F:controles[0].inicio}),false);
  const esperados={c:raizLineal(x=>x*.0015-90)/1000,'FL12-P-CONSERVA':raizLineal(x=>x*.003-90)/1000,'FL12-P-PROPORCIONAL':30*.0015/.003,'FL12-P-DOBLE_CAMBIO':30*(.003/.0015)**2};
  assert.equal(idea.predice.opciones.filter(o=>o.correcta).length,1);
  for(const o of idea.predice.opciones){const v=esperados[o.correcta?'c':o.error];cerca(o.valor,v,'Predicción');visible(o.texto,v,'kPa');if(!o.correcta){visible(o.siFuera,v,'kPa');assert.ok(o.siFuera.split(/\s+/).length<=20);}}
  assert.equal(new Set(idea.predice.opciones.map(o=>numero(o.texto))).size,4);
  assert.doesNotMatch(texto([idea.lee,idea.juega.consigna,idea.juega.mision,idea.predice.datos,idea.predice.dibujo,def.glosario]),/60 kPa/,'La respuesta no aparece antes');
  const inicial=idea.predice.dibujo.datos,revelado=idea.predice.revelar.datos;
  assert.equal(inicial.rotulos.filter(r=>r.color==='i').length,1);assert.equal(revelado.rotulos.filter(r=>r.color==='i').length,2);
  visible(inicial.rotulos.find(r=>r.color==='i').texto,30,'kPa');visible(revelado.rotulos.find(r=>r.color==='i'&&r.ref==='cara-1').texto,60,'kPa');
  const visto1=inicial.prensa.pistones.map(p=>p.area),visto2=revelado.prensa.pistones.map(p=>p.area);assert.deepEqual(visto1,[.003,.0015]);assert.deepEqual(visto2,visto1);
});
test('Fluidos: cada relación de Mira y Regla cierra en400 columnas independientes',()=>{
  ecuaciones(idea.mira.pasos.slice(0,2),{unidad:'Pa',env:{F:90,A:.0015,p:60000}});
  for(let s=0;s<400;s++){
    const rho=640+17*(s%31),g=8+(s%5),h=.12+.03*(s%17),A=.001+.0001*(s%7),p0=80000+137*(s%101),pExt=p0-3000,h1=h/2,h2=h+1;
    const V=A*h,m=rho*V,pAbs=p0+columna(rho,h,g),env={rho,g,h,A,V,m,p:pAbs,p_0:p0,p_abs:pAbs,p_ext:pExt,p_man:pAbs-pExt,F:(pAbs-pExt)*A,p_1:p0+columna(rho,h1,g),p_2:p0+columna(rho,h2,g),h_1:h1,h_2:h2};
    ecuaciones(idea.mira.pasos.slice(2),{unidad:'Pa',env});
    ecuaciones([idea.regla],{unidad:'Pa',env:{...env,F:pAbs*A}});
  }
});
