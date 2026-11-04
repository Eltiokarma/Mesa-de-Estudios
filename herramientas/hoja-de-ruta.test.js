// La hoja de ruta (docs/hoja-de-ruta.json) es válida y el Gantt de docs/hoja-de-ruta.md está al día.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const hoja = require('./hoja-de-ruta');

test('docs/hoja-de-ruta.json es válido', () => {
  assert.deepEqual(hoja.validar(hoja.leer()), []);
});

test('el Gantt de docs/hoja-de-ruta.md coincide con el JSON (si falla: npm run hoja)', () => {
  const md = fs.readFileSync(hoja.MD_RUTA, 'utf8');
  assert.ok(md.includes('```mermaid\n' + hoja.mermaid(hoja.leer()) + '```'));
});

test('la validación rechaza datos rotos', () => {
  const d = hoja.leer();
  d.tareas.push({ ...d.tareas[0] });                       // id repetido
  d.tareas[1] = { ...d.tareas[1], fin: '2000-01-01' };     // termina antes de empezar
  d.tareas[2] = { ...d.tareas[2], depende_de: ['no-existe'] };
  const err = hoja.validar(d).join('\n');
  assert.match(err, /repetido/); assert.match(err, /termina antes/); assert.match(err, /no existe/);
});
