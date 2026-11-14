// Los .riv de la prueba de estrés (app/mascotas/estres/) salen de generar.js y se leen de vuelta con riv.js.
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { leer, escribir } = require('./riv.js');
const { generar, ARCHIVOS } = require('./generar.js');

const DIR = path.join(__dirname, '..', '..', 'app', 'mascotas', 'estres');

test('los .riv subidos son los que salen del generador (correr node herramientas/estres-rive/generar.js)', () => {
  for (const n of Object.keys(ARCHIVOS)) {
    const subido = new Uint8Array(fs.readFileSync(path.join(DIR, n + '.riv')));
    assert.deepStrictEqual(subido, generar(n), n);
  }
});

test('cada .riv se lee de vuelta: un artboard, máquina «Estres» y padres que existen', () => {
  for (const n of Object.keys(ARCHIVOS)) {
    const r = leer(generar(n));
    assert.strictEqual(r.mayor, 7);
    const tipos = r.objetos.map(o => o.tipo);
    assert.strictEqual(tipos.filter(t => t === 'Artboard').length, 1, n);
    assert.ok(r.objetos.some(o => o.tipo === 'StateMachine' && o.props.name === 'Estres'), n);
    const ini = tipos.indexOf('Artboard'), fin = tipos.indexOf('LinearAnimation');
    const componentes = r.objetos.slice(ini, fin);
    componentes.forEach((o, i) => { if (i) assert.ok(o.props.parentId < componentes.length && o.props.parentId !== i, `${n}: padre de ${i}`); });
    for (const o of r.objetos) if (o.tipo === 'KeyedObject') assert.ok(o.props.objectId > 0 && o.props.objectId < componentes.length, n);
  }
});

test('peso: la chica y el dedo bajo 60 KB, la grande bajo el tope de 100 KB', () => {
  assert.ok(generar('chica').length < 60 * 1024);
  assert.ok(generar('dedo').length < 60 * 1024);
  assert.ok(generar('grande').length < 100 * 1024);
});

test('dedo.riv trae las entradas numéricas x e y', () => {
  const r = leer(generar('dedo'));
  assert.deepStrictEqual(r.objetos.filter(o => o.tipo === 'StateMachineNumber').map(o => o.props.name), ['x', 'y']);
});

test('el escritor rechaza propiedades que no conoce', () => {
  assert.throws(() => escribir([{ tipo: 'Shape', props: { inventada: 1 } }]), /inventada/);
});
