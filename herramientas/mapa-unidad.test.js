// El mapa de una unidad ubica cada idea y sus momentos en la fuente, para leer por tramos (docs/metodo/unidad/LEEME.md).
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { mapa, principal } = require('./mapa-unidad.js');

const DIR = path.join(__dirname, '..', 'contenido', 'teoria');

test('ubica las ideas de las unidades de teoría', () => {
  let ideas = 0, ubicadas = 0;
  for (const curso of fs.readdirSync(DIR)) {
    const d = path.join(DIR, curso);
    if (!fs.statSync(d).isDirectory()) continue;
    for (const f of fs.readdirSync(d)) {
      if (!f.endsWith('.js') || f.endsWith('.test.js')) continue;
      const m = mapa(`${curso}/${f}`);
      m.ideas.forEach((idea, n) => {
        ideas++;
        const l = m.lugares[n];
        if (!l) return;
        ubicadas++;
        assert.ok(m.lineas.slice(l.ini, l.fin + 1).some(x => x.includes(idea.id)), `${curso}/${f}: el tramo de ${idea.id} no trae su id`);
      });
    }
  }
  // Una unidad escrita de otra forma no rompe nada (el mapa lo dice y --texto sigue sirviendo), pero si son muchas,
  // la herramienta dejó de servir.
  assert.ok(ubicadas >= ideas * 0.95, `solo ${ubicadas} de ${ideas} ideas ubicadas`);
});

test('imprime el mapa, un momento y el texto armado', () => {
  const u = 'geometria.congruencia';
  const m = principal([u]);
  assert.strictEqual(m.codigo, 0);
  assert.match(m.texto, /1\. criterios — .* L\d+–\d+ · 15 ejemplos/);
  assert.match(m.texto, /predice L\d+–\d+/);
  const p = principal([u, 'criterios', 'predice']);
  assert.match(p.texto, /^\s*\d+ {2}\s+predice: \{/);
  const t = principal([u, '1', '--texto', 'predice']);
  assert.ok(JSON.parse(t.texto).pregunta);
  assert.ok(principal([u, 'criterios', '--texto']).texto.length < 20000, 'el texto de una idea cabe en pocas páginas');
  assert.match(principal([u, 'criterios', '--ejemplo', '3']).texto, /"enunciado"/);
  assert.strictEqual(principal([u, 'no-existe']).codigo, 1);
});
