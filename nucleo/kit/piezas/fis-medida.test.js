// Pruebas de la pieza «fis-medida»: las tres reglas leen el mismo largo (cada una con su número), la línea del objeto
// cae donde la regla dice, nada de NaN ni colores fijos, alto fijo, pureza y texto alternativo con los tres números.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./fis-medida.js');

test('registrada en el kit', () => assert.equal(Kit.piezas['fis-medida'], P));

test('cada regla escribe el mismo largo en su unidad', () => {
  const s = P.dibujar({ alto: 6.5 });
  for (const t of ['6,5 m', '65 dm', '650 cm']) assert.ok(s.includes(`>${t}<`), t);
  const s2 = P.dibujar({ alto: 8 });
  for (const t of ['8 m', '80 dm', '800 cm']) assert.ok(s2.includes(`>${t}<`), t);
});

test('la línea del objeto cae a la altura que marcan las reglas', () => {
  for (const alto of [4, 6.5, 10]) {
    const s = P.dibujar({ alto });
    const y = +s.match(/<line x1="[\d.]+" y1="([\d.]+)" x2="[\d.]+" y2="[\d.]+" stroke="var\(--c-o\)" stroke-width="2" stroke-dasharray/)[1];
    assert.ok(Math.abs(y - P.geometria({}).y(alto)) < 0.01, `alto ${alto}`);
  }
});

test('las tres reglas llegan al mismo tope con sus números', () => {
  const s = P.dibujar({});
  for (const t of ['>10<', '>100<', '>1000<']) assert.ok(s.includes(t), t);
  assert.equal((s.match(/class="kit-regla"/g) || []).length, 3);
});

test('los objetos son dibujos de prueba marcados', () => {
  const s = P.dibujar({});
  assert.match(s, /data-objeto="poste" data-prueba="si"/);
  assert.match(s, /data-objeto="persona" data-prueba="si"/);
});

test('sin NaN ni colores fijos, alto fijo, puro y con texto alternativo', () => {
  const altos = new Set();
  for (const d of [{}, { alto: 0 }, { alto: 12 }, { alto: 4.3, persona: false }, { alto: 7, color: 'i' }]) {
    const s = P.dibujar(d);
    assert.ok(!/NaN|undefined|Infinity/.test(s));
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s));
    assert.equal(s, P.dibujar(d));
    altos.add(s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)[2]);
    const a = P.alt(d);
    assert.ok(a.length > 30 && !/NaN|undefined/.test(a));
  }
  assert.equal(altos.size, 1);
  assert.equal(P.alt({ alto: 6.5 }), 'Un poste de luz de 6,5 m medido a la vez con 3 reglas: 6,5 m, 65 dm, 650 cm.');
});
