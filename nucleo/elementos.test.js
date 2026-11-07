// Paleta común de elementos (nucleo/elementos.js): contraste AA, pares cercanos documentados y vistas separadas.
const test = require('node:test');
const assert = require('node:assert/strict');
const E = require('./elementos.js');

const TINTA = { claro: '#2d2340', oscuro: '#f1ebf7' };
const hex = /^#[0-9a-f]{6}$/;

test('cada elemento tiene claro, oscuro y nombre', () => {
  assert.ok(E.SIMBOLOS.length >= 24);
  for (const e of ['H', 'C', 'N', 'O', 'F', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'K', 'Ca', 'Fe', 'Cu', 'Zn', 'Ag', 'Mn', 'Cr', 'Br', 'I', 'Ba', 'Pb'])
    assert.ok(E.COLORES[e], `falta ${e}`);
  for (const [e, c] of Object.entries(E.COLORES)) {
    assert.match(c.claro, hex, e); assert.match(c.oscuro, hex, e); assert.ok(c.nombre, e);
  }
});

test('ΔE00 de referencia (docs/metodo/paleta.py)', () => {
  assert.ok(Math.abs(E.deltaE00('#c0364a', '#1f5fbf') - 39.7659) < 1e-3);
  assert.equal(E.deltaE00('#123456', '#123456'), 0);
});

test('contraste AA en papel, tarjeta, chip al 8 % y letra del átomo, en los dos modos', () => {
  for (const [e, c] of Object.entries(E.COLORES))
    for (const modo of ['claro', 'oscuro']) {
      const k = E.contrasteMinimo(c[modo], modo);
      assert.ok(k >= 4.5, `${e} ${modo} ${c[modo]}: ${k.toFixed(2)}`);
    }
});

test('ningún elemento se confunde con la tinta (ΔE00 ≥ 20)', () => {
  for (const e of E.SIMBOLOS) assert.ok(E.distancia(e, TINTA) >= 20, `${e}–tinta ${E.distancia(e, TINTA).toFixed(1)}`);
});

test('la tabla CERCANOS es exactamente la lista de pares con ΔE00 < 20', () => {
  const doc = new Map(E.CERCANOS.map(([a, b, d]) => [[a, b].sort().join('-'), d]));
  const reales = new Map();
  for (let i = 0; i < E.SIMBOLOS.length; i++)
    for (let j = i + 1; j < E.SIMBOLOS.length; j++) {
      const a = E.SIMBOLOS[i], b = E.SIMBOLOS[j], d = E.distancia(a, b);
      if (d < 20) reales.set([a, b].sort().join('-'), d);
    }
  for (const [k, d] of reales) {
    assert.ok(doc.has(k), `par cercano sin documentar: ${k} (${d.toFixed(1)})`);
    assert.ok(Math.abs(doc.get(k) - d) < 0.06, `${k}: documentado ${doc.get(k)}, real ${d.toFixed(2)}`);
  }
  for (const k of doc.keys()) assert.ok(reales.has(k), `par documentado que ya no es cercano: ${k}`);
});

test('en cada vista real, los elementos que salen juntos se separan (ΔE00 ≥ 20) y ningún par cercano comparte vista', () => {
  const cerca = new Set(E.CERCANOS.map(([a, b]) => [a, b].sort().join('-')));
  for (const [vista, els] of E.VISTAS)
    for (let i = 0; i < els.length; i++)
      for (let j = i + 1; j < els.length; j++) {
        const d = E.distancia(els[i], els[j]);
        assert.ok(d >= 20, `${vista}: ${els[i]}–${els[j]} ${d.toFixed(1)}`);
        assert.ok(!cerca.has([els[i], els[j]].sort().join('-')), `${vista}: ${els[i]}–${els[j]} está en CERCANOS`);
      }
});

test('css() da las reglas de los tres temas solo con los elementos pedidos', () => {
  const t = E.css(['Fe', 'O']);
  assert.match(t, /^:root\{ --el-Fe:#[0-9a-f]{6}; --el-O:#[0-9a-f]{6} \}/);
  assert.match(t, /@media \(prefers-color-scheme: dark\)\{ :root:not\(\[data-theme="light"\]\)\{ --el-Fe:/);
  assert.match(t, /:root\[data-theme="dark"\]\{ --el-Fe:/);
  assert.ok(!t.includes('--el-H'));
  assert.equal(t.split('--el-').length - 1, 6);
  assert.equal((E.css().match(/--el-/g) || []).length, 3 * E.SIMBOLOS.length);
  assert.throws(() => E.css(['Xx']), /no hay color/);
});
