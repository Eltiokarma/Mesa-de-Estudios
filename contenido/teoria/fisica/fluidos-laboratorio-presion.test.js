'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const def=require('./fluidos.js');
const Pieza=require('../../../nucleo/kit/piezas/fis-fluidos-e12.js');
const cerca=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} frente a ${b}`);
const texto=x=>typeof x==='object'?(Array.isArray(x)?x.map(texto).join(''):x?.t||''):String(x??'');
const numero=x=>Number(texto(x).replace(/\s(?=\d{3}\b)/g,'').match(/[−-]?\d+(?:,\d+)?/)[0].replace('−','-').replace(',','.'));
function mesa(){const l=def.laboratorio?.find(l=>l.id==='presion-total');assert.ok(l,'Se conserva la mesa de presión');return l;}
function grilla(){const out=[];for(const h of [0,.2,.4,.6,.8])for(const rho of [800,1000,1200])for(const p0 of [80,100,120])out.push({h,rho,p0});return out;}
test('Fluidos: las dos lecturas del laboratorio coinciden con el peso de capas de líquido',()=>{
  const l=mesa();
  for(const v of grilla()){
    // Columna de 1 m² dividida en capas de 20 cm: peso/área, calculado sin leer el resultado del motor.
    let carga=0;for(let n=0;n<Math.round(v.h/.2);n++)carga+=v.rho*(1*.2)*10;
    const salida=l.lectura(v).filter(n=>n&&typeof n==='object'&&n.m==='p'&&/\d/.test(n.t));
    assert.equal(salida.length,2);cerca(numero(salida[0])*1000,v.p0*1000+carga);cerca(numero(salida[1])*1000,carga);
    for(const n of salida){assert.equal(n.v,'c-i');assert.match(n.t,/kPa$/);}
    const fig=l.dibujo(v),g=Pieza.geometria(fig.datos,fig.estado);
    const superficie=g.referencias['superficie-tanque'],sensor=g.referencias.sensor;
    cerca(sensor.y-superficie.y,v.h*180);
    assert.equal(fig.datos.escala.vertical,fig.datos.escala.transversal);
    assert.equal(fig.datos.vasos[0].nivel,.9);
    const visible=texto(fig.datos.rotulos.map(x=>x.texto));
    assert.ok(visible.includes(String(v.p0)));assert.match(visible,/líquido en reposo/);
  }
});
test('Fluidos: las tres invitaciones de presión se verifican por fuerza bruta en toda la grilla',()=>{
  const l=mesa(),ganas=[0,0,0],inicio=Object.fromEntries(l.controles.map(c=>[c.id,c.inicio]));
  l.invitaciones.forEach(i=>assert.equal(i.logrado(inicio),false));
  for(const v of grilla()){
    const pMan=v.rho*10*v.h/1000,pAbs=v.p0+pMan;
    const esperado=[v.p0===120&&v.rho===1200&&v.h===.8,Math.abs(pMan-4)<1e-9,v.p0===80&&Math.abs(pAbs-88)<1e-9];
    l.invitaciones.forEach((i,n)=>{assert.equal(i.logrado(v),esperado[n]);if(esperado[n])ganas[n]++;});
  }
  assert.deepEqual(ganas,[1,3,1]);
  assert.deepEqual(def.laboratorioIdeas['presion-total'],['presion-profundidad']);
});
