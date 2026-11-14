// Pruebas de la pieza «fis-resorte»: el bloque cae donde la regla dice, la flecha de a mide |a| por su escala y
// apunta al equilibrio, en el extremo se escribe v = 0, nada de NaN ni colores fijos, alto fijo y pureza.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./fis-resorte.js');

const caso = (x, v, a) => ({ A: 0.2, x, v, a, escalaV: 60, escalaA: 10, colores: { x: 'i', v: 'o', a: 'd' } });

test('registrada en el kit', () => assert.equal(Kit.piezas['fis-resorte'], P));

test('fidelidad: el bloque está en su x y la flecha de a mide |a|·escala hacia el equilibrio', () => {
  for (const x of [-0.2, -0.1, 0, 0.15, 0.2]) {
    const s = P.dibujar(caso(x, 0.3, -50 * x));
    const bx = +s.match(/class="kit-bloque" x="([\d.-]+)"/)[1] + P.constantes.BW / 2;
    assert.ok(Math.abs(bx - P.escala({ A: 0.2 }, x)) < 0.6, `x = ${x}`);
    if (x !== 0) {
      const m = s.match(/<line x1="([\d.-]+)" y1="[\d.-]+" x2="([\d.-]+)" y2="[\d.-]+" stroke="var\(--c-d\)" stroke-width="3"/);
      const punta = +s.match(/<path d="M([\d.-]+) [\d.-]+L[^"]*" fill="var\(--c-d\)"/)[1];
      assert.ok(Math.abs(Math.abs(punta - +m[1]) - Math.abs(50 * x) * 10) < 1, 'largo de a');
      assert.equal(Math.sign(punta - +m[1]), -Math.sign(x), 'apunta al equilibrio');
    }
  }
});

test('v = 0 y a = 0 se escriben', () => {
  assert.match(P.dibujar(caso(0.2, 0, -10)), /v = 0/);
  assert.match(P.dibujar(caso(0, 1, 0)), /a = 0/);
});

test('sin NaN ni colores fijos, alto fijo y puro', () => {
  const altos = new Set();
  for (const d of [caso(0.1, -0.5, -5), caso(-0.2, 0, 10), Object.assign(caso(0, 1, 0), { marcas: [-0.2, 0.2] }), {}]) {
    const s = P.dibujar(d);
    assert.ok(!/NaN|undefined|Infinity/.test(s));
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s));
    assert.equal(s, P.dibujar(d));
    altos.add(s.match(/height="([\d.]+)"/)[1]);
    assert.ok(P.alt(d).length > 15);
  }
  assert.equal(altos.size, 1);
});
