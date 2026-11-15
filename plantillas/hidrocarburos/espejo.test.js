// Pruebas de «la molécula y su espejo» (motor.js), para la mesa 3D «El espejo que no encaja». Los resultados esperados
// se recalcularon aparte en Python (15 nov 2026) buscando en TODAS las rotaciones que llevan un par de enlaces de la copia
// sobre un par de la original, no solo en los giros alrededor del eje vertical: CHFCl₂ y CH₂FCl son superponibles con
// su espejo (con un giro de 120° en y) y CHFClBr no lo es con ninguna rotación.
const test = require('node:test');
const assert = require('node:assert/strict');
const M = require('./motor.js');

test('quién encaja con su espejo y con qué giro (verificado aparte)', () => {
  assert.deepEqual(M.espejo('CHFCl2', 0).girosQueEncajan, [120]);
  assert.deepEqual(M.espejo('CH2FCl', 0).girosQueEncajan, [120]);
  assert.deepEqual(M.espejo('CHFClBr', 0).girosQueEncajan, []);
  assert.equal(M.espejo('CHFCl2', 120).encaja, true);
  assert.equal(M.espejo('CHFCl2', 0).encaja, false);
  assert.deepEqual(Object.keys(M.ESPEJOS).map(k => M.espejo(k).quiral), [false, false, true]);
  assert.deepEqual(Object.keys(M.ESPEJOS).map(k => M.espejo(k).distintos), [3, 3, 4]);
});

test('tetraedro: largos reales y 109,47° entre enlaces', () => {
  const L = { H: 109, F: 135, Cl: 177, Br: 194 };
  for (const k of Object.keys(M.ESPEJOS)) {
    const t = M.tetraedro(k).slice(1);
    for (const a of t) assert.ok(Math.abs(Math.hypot(...a.pos) - L[a.t]) < 1e-9);
    for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) {
      const c = t[i].pos.reduce((s, x, q) => s + x * t[j].pos[q], 0) / Math.hypot(...t[i].pos) / Math.hypot(...t[j].pos);
      assert.ok(Math.abs(c + 1 / 3) < 1e-12, `${k}: ${c}`);
    }
  }
});

test('las dos moléculas van lado a lado, sin tocarse, con los mismos átomos y enlaces', () => {
  for (const k of Object.keys(M.ESPEJOS)) for (let g = 0; g < 360; g += 30) {
    const e = M.espejo(k, g), o = e.atomos.filter(a => a.id[0] === 'o'), c = e.atomos.filter(a => a.id[0] === 'e');
    assert.equal(o.length, 5); assert.equal(c.length, 5); assert.equal(e.enlaces.length, 8);
    assert.deepEqual(o.map(a => a.t).sort(), c.map(a => a.t).sort());
    assert.ok(Math.max(...o.map(a => a.pos[0])) < Math.min(...c.map(a => a.pos[0])));
  }
  assert.throws(() => M.espejo('CH4', 0), /no conozco/);
});
