'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const def=require(process.env.FLUIDOS_PRESION_MODULE||'./fluidos.js');
const idea=def.ideas.find(i=>i.id==='presion-profundidad');
const P=require('../../../nucleo/kit/piezas/fis-fluidos-e12.js');
const cerca=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} frente a ${b}`);
const cruza=(a,b)=>a.x0<b.x1&&a.x1>b.x0&&a.y0<b.y1&&a.y1>b.y0;
function corta(c,a,b){
  let lo=0,hi=1;const dx=b[0]-a[0],dy=b[1]-a[1];
  for(const [p,q] of [[-dx,a[0]-c.x0],[dx,c.x1-a[0]],[-dy,a[1]-c.y0],[dy,c.y1-a[1]]]){
    if(Math.abs(p)<1e-12){if(q<0)return false;}else{const t=q/p;if(p<0)lo=Math.max(lo,t);else hi=Math.min(hi,t);if(lo>hi)return false;}
  }return true;
}
function revisar(fig){
  const d=fig.datos,e=fig.estado||{},g=P.geometria(d,e),svg=P.dibujar(d,e),alt=P.alt(d,e);
  assert.equal(g.W,320);assert.ok(alt.length>10);assert.match(svg,/data-prueba/);
  assert.doesNotMatch(svg,/NaN|Infinity|undefined|\[object Object\]|#[0-9a-f]{3,6}\b|[A-Za-z]_[A-Za-z0-9]/i);
  for(const c of [...g.rotulos,...g.objetos]){
    assert.ok(c.x0>=4-1e-8&&c.y0>=4-1e-8&&c.x1<=g.W-4+1e-8&&c.y1<=g.H-4+1e-8,c.id);
  }
  for(let i=0;i<g.rotulos.length;i++){
    const c=g.rotulos[i];
    for(const otro of g.rotulos.slice(i+1))assert.ok(!cruza(c,otro),`${c.id} pisa ${otro.id}`);
    for(const s of g.segmentos)assert.ok(!corta(c,s.de,s.a),`${c.id} cruza ${s.id}`);
    for(const o of g.objetos.filter(o=>o.solido))assert.ok(!cruza(c,o),`${c.id} pisa ${o.id}`);
    for(const f of g.flechas){assert.ok(!corta(c,f.de,f.a),`${c.id} cruza flecha`);for(let j=0;j<3;j++)assert.ok(!corta(c,f.punta[j],f.punta[(j+1)%3]),`${c.id} cruza punta`);}
  }
  for(const s of [...g.segmentos,...g.flechas])for(const p of [s.de,s.a])assert.ok(p[0]>=4&&p[0]<=316&&p[1]>=4&&p[1]<=g.H-4);
  return g;
}
test('presión: 15 ejemplos y 800 casos conservan geometría, márgenes y rótulos sin colisiones',()=>{
  for(const x of idea.ejemplos)revisar(x.figura);
  for(let semilla=0;semilla<400;semilla++)for(const m of ['resuelve','ahoraTu'])revisar(idea[m].generar(semilla).dibujo);
  for(const tarjeta of idea.lee.tarjetas)if(tarjeta.dibujo)revisar(tarjeta.dibujo);
  revisar(idea.predice.dibujo);revisar(idea.predice.revelar);revisar(idea.regla.dibujo);
  for(const paso of idea.mira.pasos)revisar({datos:idea.mira.datos,estado:paso.estado});
});
test('presión: juego y predicción comparten escala de áreas y fuerzas, sin dibujar la incógnita',()=>{
  for(const F of [20,40,60,80]){
    const fig=idea.juega.dibujo({F}),g=revisar(fig),cara=g.referencias['cara-0'],flecha=g.flechas[0];
    cerca(cara.alturaCara,80);cerca(Math.hypot(flecha.a[0]-flecha.de[0],flecha.a[1]-flecha.de[1]),F);
  }
  const g=revisar(idea.predice.dibujo),revelado=revisar(idea.predice.revelar);
  cerca(g.referencias['cara-0'].alturaCara/g.referencias['cara-1'].alturaCara,2);
  cerca(g.flechas[0].a[0]-g.flechas[0].de[0],g.flechas[1].a[0]-g.flechas[1].de[0]);
  assert.ok(!g.rotulos.some(r=>/60\s*kPa/.test(r.texto)));assert.ok(revelado.rotulos.some(r=>/60\s*kPa/.test(r.texto)));
  assert.equal(idea.predice.dibujo.datos.prensa.conectados,false);
});
test('presión: cada figura conserva el objeto, la referencia vertical y el cierre físico correspondiente',()=>{
  for(const x of idea.ejemplos){
    const d=x.figura.datos,c=x.caso,g=P.geometria(d);
    if(['presion','fuerza','area'].includes(c.tipo)){assert.equal(d.tipo,'prensa');assert.ok(g.referencias.cara);}
    if(c.tipo.includes('tapa')){
      const sup=g.referencias['superficie-tanque'],fondo=g.referencias['fondo-tanque'],tapa=g.referencias['tapa-tanque'];
      cerca(tapa.y,fondo.y);assert.ok(tapa.y>sup.y);assert.ok(d.vasos[0].cerrado);
      assert.ok(g.segmentos.some(s=>/tapa-superior|cierre-superior|cubierta|cerrado/.test(s.id)),'El gas sobre el líquido está encerrado.');
      assert.ok(d.cotas.some(c=>c.de==='superficie-tanque'&&c.a==='tapa-tanque'));
    }
    if(['muestra-profundidad','masa-presiones'].includes(c.tipo)){
      assert.deepEqual(d.vasos.map(v=>v.id),['muestra','tanque']);assert.ok(d.puntos.every(p=>p.recipiente==='tanque'));
    }
    if(['dos-lecturas','densidad-desnivel'].includes(c.tipo)){
      const y=g.referencias['superficie-tanque'].y;
      cerca(g.referencias.superior.y-y,c.h1*40);cerca(g.referencias.inferior.y-y,c.h2*40);
    }
    if(c.tipo==='profundidad'||c.tipo==='muestra-profundidad'||c.tipo==='tapa-profundidad'){
      assert.equal(d.modo,'esquema');assert.ok(d.cotas.some(c=>c.texto==='h = ?'));
      assert.ok(d.puntos===undefined||d.puntos.every(p=>p.altura===undefined));
    }
  }
});
