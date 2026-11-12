// Pruebas de la tarjeta «Convención del examen» (nucleo/convencion.js).
const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('./convencion.js');

test('las cuatro convenciones de academia están, con título, examen y universidad', () => {
  assert.deepEqual(C.ids.sort(), ['azufre-expandido', 'dativos', 'etapa-lenta', 'hibridacion']);
  for (const id of C.ids) {
    const c = C.LISTA[id];
    for (const k of ['titulo', 'examen', 'universidad']) assert.ok(typeof c[k] === 'string' && c[k].length > 15, `${id}: falta ${k}`);
    assert.ok(c.examen.length + c.universidad.length < 700, `${id}: la nota debe ser breve`);
  }
});

test('html: tarjeta visible y accesible, con los dos lados; un id desconocido lanza', () => {
  const h = C.html('dativos');
  assert.match(h, /^<aside class="convencion" role="note" aria-label="Convención del examen: Lewis con dativos/);
  assert.match(h, /Así se responde en el examen de admisión\./);
  assert.match(h, /En la universidad verás que…<\/b>Un enlace dativo/);
  assert.throws(() => C.html('no-existe'));
});

// Contraste WCAG de la tinta sobre el fondo de la tarjeta y del recuadro de la universidad, en claro y en oscuro.
const lum = hex => { const v = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
const contraste = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
test('contraste de al menos 7:1 en claro y en oscuro', () => {
  const bloques = [...C.CSS.matchAll(/--cv-fondo:(#[0-9a-f]{6});--cv-tinta:(#[0-9a-f]{6});[^}]*?--cv-sello:(#[0-9a-f]{6});--cv-sello-tinta:(#[0-9a-f]{6});--cv-uni:(#[0-9a-f]{6})/g)];
  assert.ok(bloques.length >= 2);
  for (const [, fondo, tinta, sello, selloTinta, uni] of bloques) {
    assert.ok(contraste(tinta, fondo) >= 7, `${tinta} sobre ${fondo}`);
    assert.ok(contraste(tinta, uni) >= 7, `${tinta} sobre ${uni}`);
    assert.ok(contraste(selloTinta, sello) >= 7, `${selloTinta} sobre ${sello}`);
  }
});
