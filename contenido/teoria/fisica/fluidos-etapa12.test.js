'use strict';

// Contrato de la unidad integrada. Las cuentas físicas tienen oráculos propios por idea.
// No modifica calidad ni exige el laboratorio o la práctica que se integran después.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const def = require(process.env.FLUIDOS_ETAPA12_MODULE || './fluidos.js');
const Teoria = require('../../../nucleo/teoria.js');
const Glosario = require('../../../nucleo/glosario.js');
const curso = require('../../../catalogo/cursos/fisica.json');
const repo = path.resolve(__dirname, '../../..');
const ficha = curso.unidades.find(u => u.id === 'fisica.fluidos');

for (const recurso of def.requiere || []) {
  assert.match(recurso, /^\/nucleo\/kit\/piezas\/[a-z0-9-]+\.js$/, 'Dependencia de dibujo conocida');
  require(path.join(repo, recurso.slice(1)));
}

const ids = ['presion-profundidad', 'vasos-comunicantes', 'prensa-hidraulica', 'empuje', 'tension-superficial', 'bernoulli'];

test('Fluidos E12: seis ideas conservan sus identificadores y todos sus momentos', () => {
  assert.equal(def.unidad, 'fisica.fluidos');
  assert.equal(def.estado, 'completa');
  assert.deepEqual(def.ideas.map(i => i.id), ids);
  for (const idea of def.ideas) {
    for (const momento of ['lee', 'juega', 'predice', 'mira', 'regla', 'resuelve', 'ahoraTu']) {
      assert.ok(idea[momento], `${idea.id}: falta ${momento}`);
    }
    assert.equal(typeof idea.juega.mision.logrado, 'function', idea.id + ': misión verificable');
    assert.equal(typeof idea.resuelve.generar, 'function');
    assert.equal(typeof idea.ahoraTu.generar, 'function');
  }
});

test('Fluidos E12: noventa ejemplos con cinco por nivel en cada idea', () => {
  assert.equal(def.ideas.reduce((s, i) => s + i.ejemplos.length, 0), 90);
  for (const idea of def.ideas) {
    assert.equal(idea.ejemplos.length, 15, idea.id);
    assert.deepEqual(idea.ejemplos.reduce((a, e) => (a[e.nivel - 1]++, a), [0, 0, 0]), [5, 5, 5], idea.id);
    for (const e of idea.ejemplos) {
      assert.ok(e.figura, idea.id + ': figura de ejemplo');
      assert.ok(e.caso && typeof e.caso.tipo === 'string', idea.id + ': entradas para el oráculo');
      assert.ok(e.solucion.length >= 1 && e.solucion.length <= 4, idea.id + ': pasos completos dentro del tope');
      if (e.nivel === 3) assert.ok(e.alternativas.length >= 3 && e.alternativas.length <= 5, idea.id + ': alternativas del nivel 3');
    }
  }
});

test('Fluidos E12: glosario nuevo distribuido por primera aparición', () => {
  assert.deepEqual(Glosario.revisar(def), []);
  const grupos = Glosario.porIdea(def), asignados = new Set();
  assert.equal(grupos.length, 6);
  for (let i = 0; i < grupos.length; i++) {
    const entradas = grupos[i].filter(e => typeof e.simple === 'string' && e.simple.trim());
    assert.ok(entradas.length >= 2 && entradas.length <= 4, `${ids[i]}: ${entradas.length} términos nuevos`);
    for (const entrada of grupos[i]) {
      const clave = Glosario.clave(entrada.termino);
      assert.ok(!asignados.has(clave), 'Término repetido: ' + entrada.termino);
      asignados.add(clave);
      assert.ok(Glosario.ejemplosDe(entrada).length >= 3, entrada.termino + ': tres ejemplos');
    }
  }
  for (const entrada of def.glosario) assert.ok(asignados.has(Glosario.clave(entrada.termino)), 'Término sin primera aparición: ' + entrada.termino);
});

test('Fluidos E12: cubre los temas publicados y pasa calidad 2 simulada en 400 semillas', () => {
  assert.ok(ficha, 'Ficha de Fluidos');
  const calidadOriginal = def.calidad;
  const problemas = Teoria.problemas({ ...def, calidad: 2 }, { temas: ficha.temas, semillas: 400 });
  assert.deepEqual(problemas, []);
  assert.equal(def.calidad, calidadOriginal, 'La simulación no cambia la calidad publicada');
});
