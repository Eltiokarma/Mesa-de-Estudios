'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const def=require(process.env.FLUIDOS_PRENSA_MODULE||'./fluidos.js'),idea=def.ideas.find(i=>i.id==='prensa-hidraulica');
const P=require('../../../nucleo/kit/piezas/fis-fluidos-e12.js'),E=require('../../../nucleo/kit/piezas/fis-estatica.js');
const cerca=(a,b,m='')=>assert.ok(Math.abs(a-b)<1e-7,`${m}: ${a} frente a ${b}`),cruza=(a,b)=>a.x0<b.x1-1e-8&&a.x1>b.x0+1e-8&&a.y0<b.y1-1e-8&&a.y1>b.y0+1e-8;
function corta(c,a,b,m=0){let lo=0,hi=1;const dx=b[0]-a[0],dy=b[1]-a[1];for(const[p,q]of[[-dx,a[0]-c.x0+m],[dx,c.x1-a[0]+m],[-dy,a[1]-c.y0+m],[dy,c.y1-a[1]+m]]){if(Math.abs(p)<1e-12){if(q<0)return false;}else{const t=q/p;if(p<0)lo=Math.max(lo,t);else hi=Math.min(hi,t);if(lo>hi)return false;}}return hi-lo>1e-8;}
const txt=x=>x==null?'':typeof x!=='object'?String(x):Array.isArray(x)?x.map(txt).join(' '):Object.values(x).map(txt).join(' ');
function segmentosSVG(s){const out=[];for(const m of s.matchAll(/\bd="(M[-\d. ,L]+)"/g)){const ps=[...m[1].matchAll(/[-]?\d+(?:\.\d+)?/g)].map(x=>+x[0]);for(let j=2;j<ps.length;j+=2)out.push({de:ps.slice(j-2,j),a:ps.slice(j,j+2),grosor:1.2});}for(const m of s.matchAll(/<line\s[^>]+>/g)){const a=k=>Number(m[0].match(new RegExp('\\b'+k+'="([^"]+)"'))?.[1]);out.push({de:[a('x1'),a('y1')],a:[a('x2'),a('y2')],grosor:a('stroke-width')||2});}return out;}
let figuras=0;
function revisar(f,nombre=''){
  assert.ok(f&&['fis-fluidos-e12','fis-estatica'].includes(f.pieza),nombre);const p=f.pieza==='fis-fluidos-e12'?P:E,d=f.estado?.datos||f.datos,g=p.geometria(f.datos,f.estado||{}),s=p.dibujar(f.datos,f.estado||{}),segmentos=g.segmentos||segmentosSVG(g.s);
  assert.equal(g.W,320);assert.doesNotMatch(s,/NaN|Infinity|undefined|\[object Object\]|#[0-9a-f]{3,6}\b|[A-Za-z]_[A-Za-z0-9]/i);assert.ok(p.alt(f.datos,f.estado||{}).length>10);
  for(const b of[...g.rotulos,...g.objetos])assert.ok(b.x0>=4&&b.x1<=316&&b.y0>=4&&b.y1<=g.H-4,nombre+' margen '+(b.id||b.nombre||b.texto));
  for(let j=0;j<g.rotulos.length;j++){
    const r=g.rotulos[j];assert.ok(r.tam>=14);for(const b of g.rotulos.slice(j+1))assert.ok(!cruza(r,b),nombre+': '+r.texto+' / '+b.texto);
    for(const l of segmentos)assert.ok(!corta(r,l.de,l.a,(l.grosor||2)/2),nombre+': '+r.texto+' cruza trazo');
    for(const b of g.objetos.filter(b=>f.pieza==='fis-estatica'||b.solido))assert.ok(!cruza(r,b),nombre+': '+r.texto+' sobre cuerpo');
    for(const fl of g.flechas){assert.ok(!corta(r,fl.de,fl.a,1),nombre+' flecha');for(let k=0;k<3;k++)assert.ok(!corta(r,fl.punta[k],fl.punta[(k+1)%3],1),nombre+' punta');}
  }
  for(const l of segmentos)for(const a of[l.de,l.a])assert.ok(a[0]>=4&&a[0]<=316&&a[1]>=4&&a[1]<=g.H-4,nombre+' trazo fuera');
  if(f.pieza==='fis-fluidos-e12')for(const fl of g.flechas){assert.equal(fl.cualitativa,true);cerca(Math.hypot(fl.a[0]-fl.de[0],fl.a[1]-fl.de[1]),32);assert.ok(fl.a[0]>fl.de[0]);assert.match(txt(d.rotulos),/solo sentido/);}
  figuras++;return {g,d};
}
function caso(p,nombre){const c=p.caso,f=p.figura||p.dibujo,{g,d}=revisar(f,nombre);assert.equal(d.caso,undefined);assert.equal(d.valor,undefined);
  if(f.pieza==='fis-fluidos-e12'){
    if(d.modo==='medida'){
      const [a,b]=d.prensa.pistones,A1=c.A1cm2??c.A1mm2/100,A2=c.A2cm2;
      cerca(a.area,A1/10000,'Área entrada');cerca(b.area,A2/10000,'Área salida');cerca(g.referencias.entrada.y,g.referencias.salida.y,'Centros horizontales');
      cerca(g.referencias.salida.alturaCara/g.referencias.entrada.alturaCara,A2/A1,'Área lineal prismática');
    }else assert.ok(d.prensa.pistones.every(p=>p.area===undefined&&p.recorrido===undefined),'Esquema sin dimensión incógnita');
    for(const [j,id]of[[1,'entrada'],[2,'salida']]){
      const F=c['F'+j+'N'],flecha=d.flechas.find(x=>x.ref===id);
      assert.equal(!!flecha,F!==undefined,'Solo fuerza dada en '+id);
      if(flecha){assert.equal(flecha.sentido,1);assert.equal(flecha.anclaje,j===1?'entra':'sale');}
    }
    if(['recorrido-salida','recorrido-unidades'].includes(c.tipo))assert.ok(!d.rotulos.some(r=>r.ref==='salida'&&/Recorre/.test(r.texto)),'Recorrido por hallar no visible');
  }else if(['fuerza-radios','radios-trabajo-recorrido'].includes(c.tipo)){
    const discos=d.objetos.filter(o=>o.tipo==='disco');assert.equal(discos.length,2);cerca(discos[0].r,8*c.r1cm);cerca(discos[1].r,8*c.r2cm);cerca(discos[1].r/discos[0].r,c.r2cm/c.r1cm);
  }else if(c.tipo==='diametro-desde-volumen'){
    assert.deepEqual(d.objetos.map(o=>o.r),[28,44]);assert.match(txt(d.textos),/sin escala/);assert.doesNotMatch(txt(d.textos),/Diámetro:\s*\d/);
  }else if(c.tipo==='desnivel-estatico'){
    assert.match(txt(d.textos),/sin escala/);assert.ok(d.objetos[1].y-d.objetos[1].h/2<d.objetos[0].y-d.objetos[0].h/2);assert.match(d.alt,/salida.*encima/);
  }
}
test('Prensa: quince ejemplos y800casos sin rótulos cruzados, dimensiones ocultas ni fuerzas inventadas',()=>{
  for(const[n,p]of idea.ejemplos.entries())caso(p,'Ejemplo '+(n+1));for(let s=0;s<400;s++)for(const m of['resuelve','ahoraTu'])caso(idea[m].generar(s),m+'/'+s);
});
test('Prensa: cuatro controles de juego conservan áreas y el sentido de las fuerzas cualitativas',()=>{
  assert.match(txt(idea.juega.leyenda),/solo indican el sentido/);const ganan=[];
  for(const F of[10,20,30,40]){const {g,d}=revisar(idea.juega.dibujo({F}),'Juega '+F);cerca(g.referencias.salida.alturaCara/g.referencias.entrada.alturaCara,4);assert.equal(g.flechas.length,2);assert.ok(d.rotulos.some(r=>r.ref==='entrada'&&r.texto===`Fuerza: ${F} N`));assert.ok(d.rotulos.some(r=>r.ref==='salida'&&r.texto===`Fuerza: ${F*4} N`));if(idea.juega.mision.logrado({F}))ganan.push(F);}assert.deepEqual(ganan,[30]);
});
test('Prensa: Predice conserva el orden dado y Mira muestra recorridos en una escala común',()=>{
  const antes=revisar(idea.predice.dibujo,'Predice'),revela=revisar(idea.predice.revelar,'Revelar');
  for(const {g,d}of[antes,revela]){assert.equal(d.modo,'esquema');assert.ok(g.referencias.salida.alturaCara>g.referencias.entrada.alturaCara,'Salida mayor dada');}
  assert.doesNotMatch(txt(antes.d.rotulos),/6\s*cm/);assert.equal(antes.g.flechas.length,0);
  const p=idea.mira.pasos[0],f={pieza:idea.mira.pieza,datos:idea.mira.datos,estado:p.estado},{g,d}=revisar(f,'Mira volumen');
  const a=g.referencias.entrada,b=g.referencias.salida,dx1=a.x-g.referencias['inicio-entrada'].x,dx2=b.x-g.referencias['inicio-salida'].x;
  cerca(dx1/d.escala.axial,.06);cerca(dx2/d.escala.axial,.02);cerca(a.alturaCara*dx1,b.alturaCara*dx2,'Volumen barrido visible');assert.match(d.alt,/misma escala horizontal/);
});
test('Prensa: Lee, todos los pasos de Mira y Regla mantienen geometría legible',()=>{
  for(const t of idea.lee.tarjetas)if(t.dibujo)revisar(t.dibujo,'Lee');for(const p of idea.mira.pasos)revisar({pieza:idea.mira.pieza,datos:idea.mira.datos,estado:p.estado||{}},'Mira');revisar(idea.regla.dibujo,'Regla');
});
test('Prensa: laboratorio completo conserva áreas, recorridos y fuerzas en48estados',()=>{
  const lab=def.laboratorio.find(x=>x.id==='prensa');assert.ok(lab);
  for(const A1 of[10,20])for(const A2 of[20,40])for(const F of[20,40,60])for(const l1 of[0,2,4,6]){
    const v={A1,A2,F,l1},{g,d}=revisar(lab.dibujo(v),'Laboratorio '+JSON.stringify(v)),a=g.referencias.entrada,b=g.referencias.salida;
    cerca(a.alturaCara/b.alturaCara,A1/A2);cerca((a.x-g.referencias['inicio-entrada'].x)/1000,l1/100);
    cerca((b.x-g.referencias['inicio-salida'].x)/1000,l1/100*A1/A2);cerca(a.y,b.y);
    assert.ok(d.rotulos.some(r=>r.x===244&&r.texto===`Fuerza: ${F*A2/A1} N`));assert.equal(g.flechas.length,2);
    assert.match(txt(d.rotulos),/Caras prismáticas/);assert.match(d.alt,/escala axial común/);
  }
});
test.after(()=>console.log('Figuras de Prensa comprobadas:',figuras));
