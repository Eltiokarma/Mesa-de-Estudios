'use strict';
// Oráculo independiente: equilibrios lineales, volúmenes, integración de trabajo y raíces.
const test=require('node:test'),assert=require('node:assert/strict');
const def=require(process.env.FLUIDOS_PRENSA_MODULE||'./fluidos.js');
const idea=def.ideas.find(i=>i.id==='prensa-hidraulica');
const P=require('../../../nucleo/kit/piezas/fis-fluidos-e12.js');
const Est=require('../../../nucleo/kit/piezas/fis-estatica.js');
const Ecuacion=require('../../../nucleo/ecuacion.js');
const T=require('../../../nucleo/teoria.js');
const cerca=(a,b,ctx='')=>assert.ok(Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<1e-8*Math.max(1,Math.abs(a),Math.abs(b)),`${ctx}: ${a} frente a ${b}`);
function lineal(m,b){const a=m.map((r,i)=>[...r,b[i]]),n=b.length;for(let j=0;j<n;j++){let p=j;for(let i=j+1;i<n;i++)if(Math.abs(a[i][j])>Math.abs(a[p][j]))p=i;[a[p],a[j]]=[a[j],a[p]];assert.ok(Math.abs(a[j][j])>1e-16);const q=a[j][j];for(let k=j;k<=n;k++)a[j][k]/=q;for(let i=0;i<n;i++)if(i!==j){const q=a[i][j];for(let k=j;k<=n;k++)a[i][k]-=q*a[j][k];}}return a.map(r=>r[n]);}
function fuerza(a1,a2,f,rho=0,g=0,h=0,p0=100000){const [p1,p2,salida]=lineal([[a1,0,0],[-1,1,0],[0,a2,-1]],[f+p0*a1,-rho*g*h,p0*a2]);cerca((p1-p0)*a1,f);cerca(p2-p1,-rho*g*h);cerca((p2-p0)*a2,salida);return salida;}
function recorrido(a1,a2,l1){return lineal([[1,0],[1,-a2]],[a1*l1,0])[1];}
function trabajo(f,l){let w=0;for(let i=0;i<128;i++)w+=f*l/128;return w;}
function raiz(fn,lo,hi){assert.ok(fn(lo)*fn(hi)<=0);for(let j=0;j<80;j++){const m=(lo+hi)/2;if(fn(lo)*fn(m)<=0)hi=m;else lo=m;}return(lo+hi)/2;}
function area(r){let a=0;for(let j=0;j<256;j++){const u=2*Math.PI*j/256,v=2*Math.PI*(j+1)/256;a+=r*r*(Math.cos(u)*Math.sin(v)-Math.sin(u)*Math.cos(v))/2;}return a;}
function resolver(c){const a1=c.A1cm2/10000,a2=c.A2cm2/10000;switch(c.tipo){
  case'fuerza-salida':return fuerza(a1,a2,c.F1N);
  case'fuerza-entrada':return fuerza(a2,a1,c.F2N);
  case'area-salida':return raiz(a=>fuerza(a1,a,c.F1N)-c.F2N,1e-7,1)*10000;
  case'ventaja-mecanica':return lineal([[c.F1N]],[c.F2N])[0];
  case'presion-manometrica':return lineal([[a2]],[c.F2N])[0]/1000;
  case'fuerza-radios':return fuerza(area(c.r1cm/100),area(c.r2cm/100),c.F1N);
  case'fuerza-areas-unidades':return fuerza(c.A1mm2/1e6,a2,c.F1N);
  case'recorrido-salida':return recorrido(a1,a2,c.l1cm/100)*100;
  case'recorrido-unidades':return recorrido(a1,a2,c.l1mm/1000)*100;
  case'trabajo-salida':return trabajo(c.F1N,c.l1cm/100);
  case'serie-trabajo':return trabajo(c.F1N,recorrido(a2,a1,recorrido(c.A4cm2/10000,c.A3cm2/10000,c.l4cm/100)));
  case'radios-trabajo-recorrido':return recorrido(area(c.r1cm),area(c.r2cm),c.WJ/c.F1N)*100;
  case'trabajo-fuerza-entrada':return c.W2J/recorrido(a2,a1,c.l2cm/100);
  case'desnivel-estatico':return fuerza(a1,a2,c.F1N,c.rho,c.g,c.h2menos1m);
  case'diametro-desde-volumen':return 2*raiz(r=>area(r)*c.l2cm-area(c.r1cm)*c.l1cm,0,100);
  case'area-entrada':return raiz(a=>fuerza(a,a2,c.F1N)-c.F2N,1e-7,1)*10000;
  case'incremento-presion':{const [pi,pf]=lineal([[c.Acm2/10000,0],[0,c.Acm2/10000]],[c.FiN,c.FfN]);return(pf-pi)/1000;}
  case'volumen-transferido':return lineal([[1]],[c.A2cm2*c.l2cm])[0];
  default:throw Error(c.tipo);
}}
function errores(c){const k=c.A2cm2/c.A1cm2,kr=(c.r2cm/c.r1cm)**2,l=c.l1cm/100,f2=c.W2J/(c.l2cm/100),r=resolver(c);switch(c.tipo){
  case'fuerza-salida':return[c.F1N,c.F1N/k,c.F1N*k*k];
  case'fuerza-entrada':return[c.F2N,c.F2N*k,c.F2N/k/k];
  case'area-salida':{const q=c.F2N/c.F1N;return[c.A1cm2,c.A1cm2/q,c.A1cm2*q*q];}
  case'ventaja-mecanica':return[c.F2N-c.F1N,c.F1N/c.F2N,r*r];
  case'presion-manometrica':return[c.F2N/c.A2cm2,c.F2N,10*c.A2cm2/c.F2N];
  case'fuerza-radios':return[c.F1N*c.r2cm/c.r1cm,c.F1N,c.F1N/kr];
  case'fuerza-areas-unidades':return[c.F1N*c.A2cm2/(c.A1mm2/10),c.F1N,c.F1N/(100*c.A2cm2/c.A1mm2)];
  case'recorrido-salida':return[c.l1cm,c.l1cm*k,c.l1cm/k/k];
  case'recorrido-unidades':return[c.l1mm/k,c.l1mm/10,c.l1mm*k/10];
  case'trabajo-salida':return[10*r,-r,c.F1N/l];
  case'serie-trabajo':{const b=c.A4cm2/c.A3cm2,z=c.l4cm/100;return[c.F1N*k*z,c.F1N*b*z,c.F1N*k*k*b*z,c.F1N*(k+b)*z];}
  case'radios-trabajo-recorrido':return[c.WJ/(c.F1N*c.r2cm/c.r1cm)*100,c.WJ/c.F1N*100,c.WJ/(c.F1N*kr*kr)*100,c.WJ/(c.F1N/kr)*100];
  case'trabajo-fuerza-entrada':return[f2,f2/k/k,f2*k,f2*c.A1cm2/(c.A1cm2+c.A2cm2)];
  case'desnivel-estatico':{const sin=c.F1N*k,peso=c.rho*c.g*c.h2menos1m*c.A2cm2/10000;return[sin,sin+peso,r/k,sin-2*peso];}
  case'diametro-desde-volumen':return[r/2,2*c.r1cm*c.l1cm/c.l2cm,2*c.r1cm,2*c.r1cm/Math.sqrt(c.l1cm/c.l2cm)];
  case'area-entrada':{const q=c.F2N/c.F1N;return[c.A2cm2,c.A2cm2*q,c.A2cm2/q/q];}
  case'incremento-presion':return[c.FfN*10/c.Acm2,(c.FfN+c.FiN)*10/c.Acm2,-r];
  case'volumen-transferido':return[c.l2cm/c.A2cm2,c.A2cm2/c.l2cm,c.A2cm2+c.l2cm];
  default:throw Error(c.tipo);
}}
function plano(x){if(x==null)return'';if(typeof x!=='object')return String(x);if(Array.isArray(x))return x.map(plano).join('');if(x.t!==undefined)return x.t;if(x.frac)return`(${plano(x.frac[0])})/(${plano(x.frac[1])})`;if(x.sup)return`(${plano(x.sup[0])})**(${plano(x.sup[1])})`;if(x.sub)return plano(x.sub[0])+'_'+plano(x.sub[1]);if(x.raiz)return`(sqrt(${plano(x.raiz)}))`;return'';}
const U={'kg/m³':1,'m/s²':1,'N·m':1,'mm²':1e-6,'cm³':1e-6,'cm²':1e-4,'m²':1,'m³':1,'kPa':1000,'Pa':1,'mm':.001,'cm':.01,'m':1,'N':1,'J':1};
const limpia=s=>s.replace(/(?<=\d)[ \u00a0\u202f](?=\d{3}(?:\D|$))/g,'').replace(/,/g,'.').replace(/[−–]/g,'-');
function numerico(x){let s=limpia(plano(x)).replace(/≈/g,'').trim();for(const u of Object.keys(U))s=s.replaceAll(u,'');s=s.trim();assert.match(s,/^[\d\s()+*/.\-]+$/,'Número: '+s);return Function('return ('+s+')')();}
function nodos(x,out=[]){if(Array.isArray(x))x.forEach(z=>nodos(z,out));else if(x&&typeof x==='object'){if(x.v&&/^[−+\-\d]/.test(x.t))out.push(x);else Object.values(x).forEach(v=>nodos(v,out));}return out;}
function entradas(p){const c=p.caso,ns=nodos([p.enunciado||p.pregunta,p.datos]);const mapa={A1cm2:['A','cm²'],A2cm2:['A','cm²'],A3cm2:['A','cm²'],A4cm2:['A','cm²'],A1mm2:['A','mm²'],Acm2:['A','cm²'],F1N:['F','N'],F2N:['F','N'],FiN:['F','N'],FfN:['F','N'],r1cm:['r','cm'],r2cm:['r','cm'],l1cm:['ell','cm'],l2cm:['ell','cm'],l4cm:['ell','cm'],l1mm:['ell','mm'],WJ:['W','J'],W2J:['W','J'],rho:['rho','kg/m³'],g:['g','m/s²'],h2menos1m:['h','m']};
  for(const [k,v]of Object.entries(c))if(mapa[k]){const[m,u]=mapa[k],i=ns.findIndex(n=>n.m===m&&Math.abs(numerico(n)-v)<1e-8&&n.t.endsWith(' '+u));assert.ok(i>=0,`${c.tipo}: entrada ${k}=${v}`);assert.equal(ns[i].v,'c-'+({F:'h',W:'o',rho:'f',g:'h'}[m]||'d'));ns.splice(i,1);}assert.equal(ns.length,0,'Sin dato físico añadido');
  for(const d of p.datos)assert.doesNotMatch(plano(d),/despej|multiplic|divid|conservamos|F_\d\s*\/|ρ\s*[×·]/i);
}
function ambiente(c){const r=resolver(c),e={π:Math.PI};let a1=c.A1cm2/10000,a2=c.A2cm2/10000,f1=c.F1N,f2=c.F2N,l1=c.l1cm/100,l2=c.l2cm/100;
  if(c.A1mm2)a1=c.A1mm2/1e6;if(c.l1mm)l1=c.l1mm/1000;if(c.r1cm)a1=Math.PI*(c.r1cm/100)**2;if(c.r2cm)a2=Math.PI*(c.r2cm/100)**2;
  if(['fuerza-salida','fuerza-radios','fuerza-areas-unidades','desnivel-estatico'].includes(c.tipo))f2=r;
  if(['fuerza-entrada','trabajo-fuerza-entrada'].includes(c.tipo))f1=r;
  if(c.tipo==='area-salida')a2=r/10000;if(c.tipo==='area-entrada')a1=r/10000;
  if(['recorrido-salida','recorrido-unidades','radios-trabajo-recorrido'].includes(c.tipo))l2=r/100;
  if(c.tipo==='radios-trabajo-recorrido'){f2=c.WJ/l2;l1=c.WJ/f1;}
  if(c.tipo==='trabajo-fuerza-entrada')f2=c.W2J/l2;
  if(c.tipo==='diametro-desde-volumen')a2=Math.PI*(r/200)**2;
  // Las identidades generales se comprueban con valores compatibles para las magnitudes libres.
  if(!Number.isFinite(a1)&&!Number.isFinite(a2)){a1=.001;a2=Number.isFinite(f1)&&Number.isFinite(f2)?a1*f2/f1:.004;}
  if(!Number.isFinite(a1))a1=a2/2;if(!Number.isFinite(a2))a2=a1*2;
  if(!Number.isFinite(f1)&&!Number.isFinite(f2))f1=20;
  if(!Number.isFinite(f1))f1=f2*a1/a2;if(!Number.isFinite(f2))f2=f1*a2/a1;
  if(!Number.isFinite(l1)&&!Number.isFinite(l2))l1=.1;
  if(!Number.isFinite(l1))l1=l2*a2/a1;if(!Number.isFinite(l2))l2=l1*a1/a2;
  Object.assign(e,{A_1:a1,A_2:a2,F_1:f1,F_2:f2,ℓ_1:l1,ℓ_2:l2,p_1:f1/a1,p_2:f2/a2,r_1:c.r1cm/100,r_2:c.r2cm/100,d_2:r/100,ρ:c.rho,g:c.g,h:c.h2menos1m,ventaja:r});
  Object.assign(e,{A:a1,r:c.r1cm/100,d:c.r1cm/50,W_1:f1*l1,W_2:f2*l2});
  e.V=a1*l1;if(c.tipo==='volumen-transferido')e.V=r/1e6;
  if(c.tipo==='presion-manometrica')e.p_2=r*1000;
  if(c.tipo==='trabajo-salida')e.W_1=e.W_2=r;
  if(c.tipo==='radios-trabajo-recorrido')e.W_2=c.WJ;
  if(c.tipo==='trabajo-fuerza-entrada')e.W_2=c.W2J;
  if(c.tipo==='diametro-desde-volumen')e.r_2=r/200;
  if(c.tipo==='serie-trabajo'){e.A_3=c.A3cm2/10000;e.A_4=c.A4cm2/10000;e.F_2=e.F_3=fuerza(a1,a2,f1);e.F_4=fuerza(e.A_3,e.A_4,e.F_3);e.ℓ_4=c.l4cm/100;e.W_4=r;}
  if(c.tipo==='incremento-presion')Object.assign(e,{A:c.Acm2/10000,F_i:c.FiN,F_f:c.FfN,ΔF:c.FfN-c.FiN,Δp:r*1000});
  return e;
}
function evaluar(s,e,factor){s=limpia(s).replace(/[×·]/g,'*').replace(/÷/g,'/').replace(/ventaja mecánica/g,'ventaja');let explicita=false,simbolica=false;
  const unidades=Object.keys(U).sort((a,b)=>b.length-a.length);
  const final=unidades.find(u=>s.endsWith(' '+u));if(final){s='('+s.slice(0,-final.length).trim()+')*'+U[final];explicita=true;}
  // Cada cantidad con unidad se sustituye antes de resolver el álgebra simbólica.
  for(const u of unidades){const re=new RegExp('(-?\\d+(?:\\.\\d+)?)\\s+'+u.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?![A-Za-z²³])','g');s=s.replace(re,(_,n)=>{explicita=true;return'('+Number(n)*U[u]+')';});}
  s=s.replace(/[A-Za-zΑ-ωℓ]+(?:_[A-Za-z0-9]+)*/g,k=>{if(k==='sqrt')return k;if(k==='π')return String(Math.PI);assert.ok(Number.isFinite(e[k]),'Símbolo sin valor '+k+' en '+s);simbolica=true;return'('+e[k]+')';});
  s=s.replace(/(\d|\))(?=\(|sqrt)/g,'$1*').replace(/sqrt/g,'Math.sqrt');
  assert.match(s,/^[\d\s()+*/.\-Mathsqrt]+$/,'Expresión: '+s);const valor=Function('return ('+s+')')();return valor*(explicita||simbolica?1:factor);
}
function primeraUnidad(s){const candidatos=Object.keys(U).map(u=>({u,i:s.search(new RegExp(' '+u+'(?:$|[^A-Za-z²³])'))})).filter(x=>x.i>=0).sort((a,b)=>a.i-b.i||b.u.length-a.u.length);return candidatos[0]?.u;}
function igualdades(filas,e,unidad){for(const fila of filas)if(fila.ecuacion)for(const bloque of plano(fila.ecuacion).split(';')){if(!bloque.includes('='))continue;const partes=bloque.trim().split(/(=|≈)/).map(z=>z.trim()),expr=partes.filter((_,i)=>i%2===0);const vals=expr.map((s,i)=>evaluar(s,e,U[primeraUnidad(expr.slice(i).join(' '))||unidad]||1));for(let i=1;i<vals.length;i++)if(partes[2*i-1]==='=')cerca(vals[i],vals[i-1],'Igualdad '+bloque);else assert.ok(Math.abs(vals[i]-vals[i-1])<=.00050001*(U[unidad]||1));}}
function revisarCaso(p){const c=p.caso,r=resolver(c),es=errores(c);cerca(c.valor,r,c.tipo);entradas(p);assert.equal(c.errores.length,es.length);c.errores.forEach((e,j)=>cerca(e.valor,es[j],c.tipo+' error '+j));
  const valores=[r,...es];for(let i=0;i<valores.length;i++)for(let j=i+1;j<valores.length;j++)assert.ok(Math.abs(valores[i]-valores[j])>1e-8,'Unicidad '+c.tipo);
  if(p.opciones){assert.equal(p.opciones.filter(o=>o.correcta).length,1);p.opciones.forEach((o,j)=>{cerca(o.valor,valores[j]);cerca(numerico(o.texto),valores[j],'Alternativa visible');if(j){assert.ok(o.siFuera.startsWith('Usaste los datos dados;'));assert.ok(o.siFuera.includes(c.errores[j-1].operacion));const final=o.siFuera.match(/obtendrías (.*)\.$/);assert.ok(final);cerca(numerico(final[1]),valores[j],'siFuera');}});}
  if(p.respuesta)cerca(numerico(p.respuesta),r,'Respuesta visible');
  if(p.alternativas){assert.equal(p.alternativas.length,5);assert.equal(p.alternativas.filter(v=>Math.abs(numerico(v)-r)<1e-8).length,1);for(const v of p.alternativas)assert.ok(valores.some(n=>Math.abs(numerico(v)-n)<1e-8));const detalle=p.solucion.at(-1).texto;c.errores.forEach(e=>assert.ok(detalle.includes(e.operacion)));}
  const filas=p.pasos||p.solucion||(p.opciones?[p.solucion]:[]);igualdades(Array.isArray(filas)?filas:[filas],ambiente(c),c.unidad);
  if(['fuerza-salida','fuerza-radios','fuerza-areas-unidades'].includes(c.tipo))assert.ok(r>c.F1N);
  if(['recorrido-salida','recorrido-unidades','diametro-desde-volumen'].includes(c.tipo))assert.ok((c.l1cm||c.l1mm/10)>(c.l2cm||r));
  if(c.tipo==='desnivel-estatico'){assert.ok(r>0);assert.ok(r/(c.A2cm2/10000)<c.F1N/(c.A1cm2/10000));for(const p0 of[0,80000,101325])cerca(r,fuerza(c.A1cm2/10000,c.A2cm2/10000,c.F1N,c.rho,c.g,c.h2menos1m,p0));assert.match(plano(p.enunciado||p.pregunta),/quieta/);}
  return r;
}
test('Prensa: 15 ejemplos originales y cinco por nivel con cuentas independientes',()=>{assert.ok(idea);assert.equal(idea.ejemplos.length,15);for(const n of[1,2,3])assert.equal(idea.ejemplos.filter(e=>e.nivel===n).length,5);const esperado=[72,30,18,3,30,100,81,5,1.2,10,4.32,6,60,54,6];idea.ejemplos.forEach((e,j)=>cerca(revisarCaso(e),esperado[j]));});
test('Prensa: 400 semillas por banco, entradas visibles, igualdad, errores y separación',()=>{const firmas=new Set(),firma=c=>JSON.stringify(Object.fromEntries(Object.entries(c).filter(([k])=>!['valor','errores','unidad'].includes(k)).sort()));for(const e of idea.ejemplos)firmas.add(firma(e.caso));const rFirmas=new Set();for(let s=0;s<400;s++){const r=idea.resuelve.generar(s),a=idea.ahoraTu.generar(s);revisarCaso(r);revisarCaso(a);assert.deepEqual(r,idea.resuelve.generar(s));assert.deepEqual(a,idea.ahoraTu.generar(s));assert.ok(!firmas.has(firma(r.caso)));assert.ok(!firmas.has(firma(a.caso)));rFirmas.add(firma(r.caso));}for(let s=0;s<400;s++)assert.ok(!rFirmas.has(firma(idea.ahoraTu.generar(s).caso)));});
test('Prensa: misión única, predicción deducida por volumen y explicaciones calculadas',()=>{
  const grilla=T.grilla(idea.juega.controles),logros=[];
  for(const v of grilla){const esperado=fuerza(.001,.004,v.F);if(Math.abs(esperado-120)<1e-8)logros.push(v.F);assert.equal(idea.juega.mision.logrado(v),Math.abs(esperado-120)<1e-8);const lecturas=nodos(idea.juega.lectura(v));cerca(numerico(lecturas[0]),v.F);cerca(numerico(lecturas[1]),esperado);}
  assert.deepEqual(logros,[30]);assert.equal(idea.juega.mision.logrado({F:idea.juega.controles[0].inicio}),false);
  for(const areaEntrada of[1,3,7,11])cerca(recorrido(3*areaEntrada,areaEntrada,2),6);
  const vals=[6,2,2/3,18];idea.predice.opciones.forEach((o,j)=>{cerca(o.valor,vals[j]);cerca(numerico(o.texto),vals[j]);if(j){const escritos=o.siFuera.match(/dar[ií]a ([\d/,]+) cm/);assert.ok(escritos);cerca(numerico(escritos[1]),vals[j]);}});
  const g=def.glosario.filter(g=>['prensa hidráulica','ventaja mecánica'].includes(g.termino));assert.equal(g.length,2);assert.ok(g.every(t=>t.simple&&t.ejemplos.length===3));
  const previo=JSON.stringify([idea.lee,idea.juega.consigna,idea.juega.mision,idea.predice.datos,g]);assert.doesNotMatch(previo,/6 cm|seis centímetros|A.?ℓ|conserva.{0,20}volumen/);
  const ambientes=[
    {A_1:.001,A_2:.003,ℓ_1:.06,ℓ_2:.02},
    {A_1:.001,A_2:.004,F_1:30,F_2:120},
    {A_1:.001,A_2:.004,F_1:30,F_2:120,p_1:30000,p_2:30000},
    {F_1:30,F_2:120,ℓ_1:.08,ℓ_2:.02,W_1:2.4,W_2:2.4},
    {A:Math.PI*.02**2,r:.02,d:.04},
    {F_2:54,F_3:54,F_4:108,A_3:.0005,A_4:.001,ℓ_2:.08,ℓ_3:.08},
    {p_1:50000,p_2:45000,ρ:1000,g:10,h:.5},
  ];
  idea.mira.pasos.forEach((p,j)=>igualdades([{ecuacion:p.ecuacion}],ambientes[j],j===0?'cm':''));
});
test('Prensa: HTML real, cuentas sin basura y contrato C2 sobre 400 semillas',()=>{
  const revisar=x=>{if(Array.isArray(x))x.forEach(revisar);else if(x&&typeof x==='object'){if(x.ecuacion){const html=Ecuacion.html(x.ecuacion);assert.doesNotMatch(html,/NaN|Infinity|undefined|\[object Object\]|[A-Za-z]_[0-9]/);}Object.values(x).forEach(v=>{if(typeof v==='object')revisar(v);});}};
  revisar(idea.ejemplos);revisar(idea.mira);revisar(idea.regla);for(let s=0;s<400;s++){revisar(idea.resuelve.generar(s));revisar(idea.ahoraTu.generar(s));}
  const glosario=def.glosario.filter(g=>['prensa hidráulica','ventaja mecánica'].includes(g.termino));
  const laboratorio=def.laboratorio?.filter(m=>m.id==='prensa');
  assert.deepEqual(T.problemas({...def,calidad:2,ideas:[idea],glosario,...(laboratorio?.length?{laboratorio,laboratorioIdeas:{prensa:[idea.id]}}:{laboratorio:undefined,laboratorioIdeas:undefined})},{semillas:400}),[]);
});
test('Prensa: las 48 configuraciones del laboratorio conservan volumen y trabajo; retos verificables',()=>{
  const m=def.laboratorio.find(m=>m.id==='prensa');assert.ok(m);const grilla=T.grilla(m.controles),logros=[0,0,0],inicio=Object.fromEntries(m.controles.map(c=>[c.id,c.inicio]));assert.equal(grilla.length,48);
  for(const reto of m.invitaciones)assert.equal(reto.logrado(inicio),false);
  for(const v of grilla){const f=fuerza(v.A1/10000,v.A2/10000,v.F),l=recorrido(v.A1/10000,v.A2/10000,v.l1/100),w=trabajo(v.F,v.l1/100);cerca(trabajo(f,l),w);const ns=nodos(m.lectura(v));cerca(numerico(ns[0]),f);cerca(numerico(ns[1]),l*100);cerca(numerico(ns[2]),w);const esperado=[v.F===20&&Math.abs(f-80)<1e-8,v.l1===4&&Math.abs(l-.01)<1e-8,Math.abs(w-3.6)<1e-8];m.invitaciones.forEach((r,j)=>{assert.equal(r.logrado(v),esperado[j]);if(esperado[j])logros[j]++;});igualdades([{ecuacion:m.lectura(v)}],{F_2:f,ℓ_2:l,W_1:w,W_2:w},'');}
  assert.ok(logros.every(n=>n>0));assert.deepEqual(logros,[4,3,4]);
});
