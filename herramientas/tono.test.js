'use strict';
// Tono de la retroalimentación (13 nov 2026, pedido de Gerson; docs/escena-viva.md, reglas 8 y 10):
// el error se explica sin retar al alumno y sin investigación a la vista. Si esta prueba falla,
// corre `python3 -I herramientas/pasada-tono.py` y revisa a mano lo que quede.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const escenas = fs.readdirSync(path.join(RAIZ, 'plantillas'))
  .map(d => path.join(RAIZ, 'plantillas', d, 'index.html')).filter(f => fs.existsSync(f));
const VEREDICTOS = ['app/practica.js', 'app/lectura.js'].map(f => path.join(RAIZ, f));

test('ninguna escena arranca el error con «Elegiste la X» ni cierra con «La correcta está marcada»', () => {
  const malas = escenas.filter(f => /Elegiste la (?:opción )?(?:[A-E1-9]|\$\{)|correcta está marcada/i
    .test(fs.readFileSync(f, 'utf8').replace(/\.replace\(\/\^Elegiste[^)]*\)/g, '')));
  assert.deepStrictEqual(malas.map(f => path.relative(RAIZ, f)), []);
});

// Las formas fijas que ya limpió la pasada no vuelven. (Quedan citas escritas de otras formas: pendiente en docs/pendientes.md.)
test('no vuelven las frases fijas de investigación en la retroalimentación', () => {
  const RE = /Esta opción es una hipótesis nuestra|Hipótesis nuestra: |Es una idea documentada|Son errores que suponemos|El objetivo más difícil del test|Según [A-ZÁÉÍÓÚÇ][^.'`<]{0,80}\((?:19|20)\d{2}\)/;
  const malas = [];
  for (const f of escenas) fs.readFileSync(f, 'utf8').split('\n').forEach((l, i) => {
    if (!l.includes('fuente') && RE.test(l)) malas.push(`${path.relative(RAIZ, f)}:${i + 1}`);
  });
  assert.deepStrictEqual(malas, []);
});

test('el texto del error va en tinta, no en rojo', () => {
  const rojas = escenas.filter(f => /\.(fb|msg)\.mal\{color:var\(--warn\)\}/.test(fs.readFileSync(f, 'utf8')));
  assert.deepStrictEqual(rojas.map(f => path.relative(RAIZ, f)), []);
});

test('los veredictos de la práctica y la lectura no dicen «Elegiste la X»', () => {
  for (const f of VEREDICTOS) assert.doesNotMatch(fs.readFileSync(f, 'utf8'), /`Elegiste la \$\{/);
});

test('las escenas ocultan al alumno los párrafos de fuentes (nucleo/pegatina.css)', () => {
  assert.match(fs.readFileSync(path.join(RAIZ, 'nucleo/pegatina.css'), 'utf8'), /\.fuente\{display:none/);
});
