// Pruebas del validador de retos del laboratorio (nucleo/teoria.js, revisarInvitacion; docs/teoria.md, 4d).
const test = require('node:test');
const assert = require('node:assert/strict');
const T = require('../nucleo/teoria.js');
// La mesa «pista-libre» y la idea sin dibujo propio en la regla viven desde el 18 nov en MRUV y caída libre.
const fisica = require('../contenido/teoria/fisica/mruv-y-caida-libre.js');
for (const r of fisica.requiere) require('..' + r);

// La mesa «pista-libre» de la unidad de referencia, con otros retos.
function conRetos(invitaciones, extra = {}) {
  const mesa = Object.assign({}, fisica.laboratorio[0], extra, { invitaciones });
  const def = Object.assign({}, fisica, { laboratorio: [mesa] });
  return T.problemas(def).filter(p => /invitación/.test(p));
}

test('un reto de dos casos que depende del último control se encuentra en toda la grilla', () => {
  // 41 × 41 × 5 = 8405 casos; los primeros 160 dejan fijo el tercer control (k), así que antes no se encontraba.
  const controles = [
    { id: 'v0', etiqueta: 'v₀', min: 0, max: 6, paso: 0.15, inicio: 3 },
    { id: 'a', etiqueta: 'a', min: -2, max: 2, paso: 0.1, inicio: 1 },
    { id: 'k', etiqueta: 'k', min: 0, max: 4, paso: 1, inicio: 0 },
  ];
  const reto = { texto: 'Guarda dos casos con k distinto.', logrado: (v, g) => g.some(x => x.k !== v.k) && v.k === 4 };
  assert.deepEqual(conRetos([reto], { controles, arrastres: [] }), []);
});

test('testigo: sirve para coincidencias raras y se comprueba', () => {
  const raro = { texto: 'Guarda dos casos con la misma última marca.', logrado: (v, g) => g.length >= 2 && g.some(x => x.a !== v.a && x.v0 * 5 + x.a * 12.5 === v.v0 * 5 + v.a * 12.5) };
  assert.deepEqual(conRetos([Object.assign({ testigo: [{ v0: 5, a: 0, t: 0 }, { v0: 0, a: 2, t: 0 }] }, raro)]), []);
  assert.match(conRetos([Object.assign({ testigo: [{ v0: 5, a: 0, t: 0 }, { v0: 1, a: 2, t: 0 }] }, raro)]).join('\n'), /el testigo no la cumple/);
  assert.match(conRetos([Object.assign({ testigo: [{ v0: 5.5, a: 0, t: 0 }] }, raro)]).join('\n'), /no es un caso de la grilla/);
});

test('logrado recibe la mesa como tercer argumento', () => {
  const extremo = { texto: 'Lleva la salida al máximo.', logrado: (v, g, mesa) => v.v0 === mesa.controles.find(c => c.id === 'v0').max };
  assert.deepEqual(conRetos([extremo]), []);
});
