'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const def=require('./fluidos.js'),Pieza=require('../../../nucleo/kit/piezas/fis-fluidos-e12.js');
const cerca=(a,b)=>assert.ok(Math.abs(a-b)<1e-8*Math.max(1,Math.abs(a),Math.abs(b)),`${a} frente a ${b}`);
function mesa(){const l=def.laboratorio?.find(x=>x.id==='bloque-libre');assert.ok(l,'Mesa bloque-libre conservada');return l;}
const texto=x=>Array.isArray(x)?x.map(texto).join(''):x&&typeof x==='object'?x.t??'':String(x??'');
function numero(x){const s=texto(x).replace(/(?<=\d)[ \u00a0\u202f](?=\d{3}(?:\D|$))/g,'');const n=s.match(/[-+]?\d+(?:,\d+)?/g);assert.equal(n?.length,1);return Number(n[0].replace(',','.'));}
function fuerzaDeCaras(rho,base,nivel){
  const cara=.20*.10,alto=.05;
  const superior=Math.max(0,nivel-base-alto),inferior=Math.max(0,nivel-base);
  return cara*(rho*10*inferior-rho*10*superior);
}
function raiz(fn,a,b){for(let i=0;i<80;i++){const m=(a+b)/2;if(fn(m)>0)b=m;else a=m;}return (a+b)/2;}
function esperado(v){const masa=v.rhoc*.20*.10*.05,peso=masa*10;
  // Altura sumergida por equilibrio de fuerzas de presión, sin copiar la razón de densidades.
  const hundido=v.rhoc>v.rhol,neutro=v.rhoc===v.rhol;
  const altura=v.rhoc<v.rhol?raiz(h=>fuerzaDeCaras(v.rhol,0,h)-peso,0,.05):.05;
  const Vs=altura*.20*.10,nivel=(.30*.20*.20+Vs)/(.30*.20),base=v.rhoc<v.rhol?nivel-altura:.10;
  return {peso,Vs,nivel,base,empuje:fuerzaDeCaras(v.rhol,base,nivel),hundido,neutro,altura};
}
const pisa=(a,b)=>a.x0<b.x1&&a.x1>b.x0&&a.y0<b.y1&&a.y1>b.y0;
function corta(c,a,b){let lo=0,hi=1;const dx=b[0]-a[0],dy=b[1]-a[1];for(const[p,q]of [[-dx,a[0]-c.x0],[dx,c.x1-a[0]],[-dy,a[1]-c.y0],[dy,c.y1-a[1]]]){if(Math.abs(p)<1e-12){if(q<0)return false;}else{const t=q/p;if(p<0)lo=Math.max(lo,t);else hi=Math.min(hi,t);if(lo>hi)return false;}}return true;}
function comprobar(v){const l=mesa(),e=esperado(v),fig=l.dibujo(v),d=fig.datos,tina=d.vasos[0],b=tina.bloque,g=Pieza.geometria(d,fig.estado),lectura=l.lectura(v);
 assert.equal(d.escala.vertical,600);assert.equal(d.escala.transversal,600);assert.equal(b.soporte,'ninguno');assert.equal(b.ancho,.20);assert.equal(b.alto,.05);cerca(tina.nivel,e.nivel);cerca(b.base,e.base);
 const agua=.30*.20*tina.nivel-Math.min(.05,Math.max(0,tina.nivel-b.base))*.20*.10;cerca(agua,.012);
 assert.equal(tina.profundidad,.20);assert.equal(b.profundidad,.10);assert.ok(tina.ancho>b.ancho&&tina.profundidad>b.profundidad,'Holgura entre bloque y paredes en ambas dimensiones horizontales');
 const cuerpo=g.objetos.find(x=>x.id==='bloque'),nivel=g.superficies[0].y;cerca((cuerpo.y1-cuerpo.y0)/600,.05);cerca((cuerpo.x1-cuerpo.x0)/600,.20);
 assert.ok(cuerpo.y1<242,'Nunca se representa apoyo en el fondo');assert.ok(tina.nivel<tina.alto);assert.ok(b.base>0);assert.ok(b.base+b.alto<tina.alto);
 const P=lectura.find(x=>x?.m==='P'&&/\d/.test(x.t)),E=lectura.find(x=>x?.m==='E'&&/\d/.test(x.t));assert.equal(P.v,'c-h');assert.equal(E.v,'c-h');assert.ok(P.t.endsWith(' N')&&E.t.endsWith(' N'));cerca(numero(P),e.peso);assert.ok(Math.abs(numero(E)-e.empuje)<.000501);
 const s=texto(lectura),alt=Pieza.alt(d,fig.estado),svg=Pieza.dibujar(d,fig.estado);
 if(v.rhoc<v.rhol){cerca(e.peso,e.empuje);cerca((cuerpo.y1-nivel)/600,e.altura);assert.ok(cuerpo.y0<nivel);assert.match(s,/Flota parcialmente/);const porcentaje=d.rotulos[2].texto;const mostrado=numero(porcentaje),real=e.Vs/.001*100;if(Math.abs(mostrado-real)>1e-9)assert.match(porcentaje,/≈/);assert.ok(Math.abs(mostrado-real)<.000501);}
 else{assert.ok(cuerpo.y0>nivel);if(e.neutro){cerca(e.peso,e.empuje);assert.match(s,/Equilibrio dentro/);assert.match(alt,/Está en equilibrio/);}else{assert.ok(e.peso>e.empuje);assert.match(s,/Al soltarlo, se hunde/);assert.match(d.rotulos[2].texto,/Posición inicial al soltar/);assert.match(alt,/no representa una posición final de equilibrio/);}}
 for(let i=0;i<g.rotulos.length;i++){const r=g.rotulos[i];assert.ok(r.x0>=4&&r.y0>=4&&r.x1<=316&&r.y1<=g.H-4);for(const o of g.rotulos.slice(i+1))assert.ok(!pisa(r,o));for(const seg of g.segmentos)assert.ok(!corta(r,seg.de,seg.a));for(const o of g.objetos.filter(o=>o.solido))assert.ok(!pisa(r,o));}
 assert.doesNotMatch(svg,/NaN|Infinity|undefined|\[object Object\]/);return e;
}
const grilla=()=>[600,1000,1400].flatMap(rhoc=>[800,1000,1200].map(rhol=>({rhoc,rhol})));
test('Bloque libre: nueve estados físicos distintos y 400 contrastes de presión independientes',()=>{
 for(const v of grilla())comprobar(v);
 for(let s=0;s<400;s++)comprobar({rhoc:600+(s*37)%801,rhol:800+(s*53)%401});
});
test('Bloque libre: tres invitaciones alcanzables, verificadas por fuerza bruta',()=>{
 const l=mesa(),inicial=Object.fromEntries(l.controles.map(c=>[c.id,c.inicio])),ganas=[[],[],[]];assert.deepEqual(inicial,{rhoc:1400,rhol:1000});l.invitaciones.forEach(i=>assert.equal(i.logrado(inicial),false));
 for(const v of grilla()){const e=esperado(v),ok=[v.rhoc<v.rhol&&Math.abs(e.Vs-.0005)<1e-10,e.neutro,e.hundido&&Math.abs(e.peso-e.empuje-6)<1e-8];l.invitaciones.forEach((i,n)=>{assert.equal(i.logrado(v),ok[n]);if(ok[n])ganas[n].push(v);});}
 assert.deepEqual(ganas,[[{rhoc:600,rhol:1200}],[{rhoc:1000,rhol:1000}],[{rhoc:1400,rhol:800}]]);
 assert.deepEqual(def.laboratorioIdeas['bloque-libre'],['empuje']);
});
test('Bloque libre: la inmersión total no se confunde con flotación parcial ni contacto',()=>{
 const l=mesa(),neutral=l.dibujo({rhoc:1000,rhol:1000}).datos,pesado=l.dibujo({rhoc:1400,rhol:1000}).datos;
 cerca(neutral.vasos[0].bloque.base,pesado.vasos[0].bloque.base);assert.equal(neutral.vasos[0].bloque.soporte,'ninguno');assert.equal(pesado.vasos[0].bloque.soporte,'ninguno');
 assert.notEqual(neutral.rotulos[2].texto,pesado.rotulos[2].texto);assert.ok(!('auto' in l)&&!('animacion' in l),'No se inventa una trayectoria');
 const instrucciones=texto(l.leyenda.flatMap(x=>[x.s,x.t]));assert.match(instrucciones,/no simula el movimiento posterior/);assert.match(instrucciones,/volumen total: 1 L/);
 assert.match(l.consigna,/bloque homogéneo/);assert.match(l.consigna,/orientación estable/);assert.match(l.consigna,/desde el reposo/);
});
