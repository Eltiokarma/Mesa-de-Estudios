// Pruebas de la pieza «fis-pista» (18 nov): la recta de la pista atlética. Cada tramo va de su marca a su marca de la
// regla, la llave del desplazamiento de la partida a donde terminó, quien corre en su marca, el corte de «Mira»; rótulos
// que caben con 4 de margen y no se pisan; puro, alto fijo, sin NaN ni colores fijos, dibujos de prueba.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./fis-pista.js');
const { W, H } = P.constantes;
const pisa = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
const MUESTRAS = [];
for (const r of [0, 10, 20, 40, 60]) for (const t of [0, 7.5, 30, 40, 61]) {
  const s = Math.min(2 * t, 60 + r), back = Math.max(0, s - 60), pos = s <= 60 ? s : 60 - back;
  MUESTRAS.push({ largo: 60, valla: 60, corredor: pos, mira: back ? 'izq' : 'der', tramos: [{ de: 0, a: Math.min(s, 60), texto: '2 m/s', color: 'o' }, back ? { de: 60, a: pos, texto: '2 m/s', color: 'o' } : null],
    dx: pos > 0 ? { a: pos, texto: 'Δx', color: 'f' } : null, reloj: { texto: `t = ${t} s`, color: 'i' } });
}
MUESTRAS.push(
  { largo: 60, valla: 60, corredor: 0, ida: { a: 60, texto: '2 m/s', color: 'o' }, vuelta: { de: 60, a: 0, texto: '6 m/s', color: 'o' }, reloj: { texto: 't = 30 s + 10 s = 40 s', color: 'i' } },
  { largo: 100, paso: 10, numero: 20, valla: null, corredor: 0, tramos: [{ de: 0, a: 100, texto: '9,58 s', color: 'i' }] },
  { largo: 150, paso: 10, numero: 50, valla: null, corredor: 0, tramos: [{ de: 0, a: 100, texto: '20 s', color: 'i' }, { de: 100, a: 150, texto: '10 s', color: 'i' }] },
  { largo: 20, paso: 10, numero: 10, valla: 16, corredor: 0, tramos: [{ de: 0, a: 16, texto: '2 m/s', color: 'o' }, { de: 16, a: 6, texto: '5 m/s', color: 'o' }] },
);

test('registrada en el kit', () => assert.equal(Kit.piezas['fis-pista'], P));

test('cada tramo va de su marca a su marca, la llave del desplazamiento y quien corre en su lugar, y el corte de «Mira»', () => {
  const d = { largo: 60, valla: 60, corredor: 20, mira: 'izq', tramos: [{ de: 0, a: 60, texto: 'ida' }, { de: 60, a: 20, texto: 'vuelta' }], dx: { a: 20, texto: 'Δx', color: 'f' } };
  const g = P.geometria(d);
  assert.deepEqual(g.tramos.map(t => [t.x1, t.x2]), [[g.X(0), g.X(60)], [g.X(60), g.X(20)]]);
  assert.ok(g.tramos[0].y < g.tramos[1].y, 'la ida arriba, la vuelta debajo');
  assert.deepEqual([g.dx.a, g.dx.b], [g.X(0), g.X(20)]);
  const s = P.dibujar(d);
  assert.match(s, /data-objeto="corredor" data-prueba="si"/);
  assert.match(s, /data-objeto="valla" data-prueba="si"/);
  assert.match(s, /fill="var\(--c-f\)"[^>]*>Δx</);
  // el corte: lo que lleva `desde` aparece cuando le toca
  const m = { largo: 60, tramos: [{ de: 0, a: 60, desde: 1 }, { de: 60, a: 0, desde: 2 }], reloj: { texto: 'Δt = 40 s', desde: 3 } };
  assert.deepEqual([0, 1, 2, 3].map(c => P.geometria(m, { corte: c }).tramos.length), [0, 1, 2, 2]);
  assert.ok(!P.geometria(m, { corte: 2 }).reloj && P.geometria(m, { corte: 3 }).reloj);
});

test('rótulos que caben con 4 de margen y no se pisan; puro, alto fijo, sin NaN ni colores fijos y con texto alternativo', () => {
  for (const d of MUESTRAS) {
    const g = P.geometria(d), s = P.dibujar(d), donde = JSON.stringify(d).slice(0, 140);
    for (const r of g.rotulos) assert.ok(r.x0 >= 4 - 1e-9 && r.x1 <= W - 4 + 1e-9 && r.y0 >= 4 && r.y1 <= H - 4, `${donde}: «${r.texto}» se sale`);
    for (let i = 0; i < g.rotulos.length; i++) for (let j = i + 1; j < g.rotulos.length; j++) assert.ok(!pisa(g.rotulos[i], g.rotulos[j]), `${donde}: «${g.rotulos[i].texto}» pisa «${g.rotulos[j].texto}»`);
    assert.ok(!/NaN|undefined|Infinity/.test(s), donde);
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s));
    assert.equal(s, P.dibujar(d));
    assert.equal(s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)[2], String(H));
    assert.match(s, /data-prueba="si"/);
    assert.ok(P.alt(d).length > 40 && !/NaN|undefined/.test(P.alt(d)));
  }
});

// Ronda 2 del lector en frío (18 nov): la marca de la valla con su número, la parada dibujada entre los dos tramos, la
// columna de llamas sobre un camino de tierra y los nombres de los lugares, que sin la llave suben bajo los números.
test('ronda 2: números de más, parada, columna de llamas y lugares con nombre', () => {
  const v = P.geometria({ largo: 70, paso: 10, numero: 20, numeros: [70], valla: 70, tramos: [{ de: 0, a: 70 }, { de: 70, a: 35 }] });
  assert.deepEqual(v.numeros.map(c => c.texto).sort(), ['0', '20', '40', '60', '70'].sort());
  const p = P.geometria({ largo: 150, paso: 10, numero: 50, valla: null, tramos: [{ de: 0, a: 100, texto: '20 s' }, { de: 100, a: 150, texto: '10 s' }], parada: { en: 100, texto: 'descansa 10 s', color: 'i' } });
  assert.equal(p.parada.x, p.tramos[0].x2, 'la parada, en la punta del primer tramo');
  assert.equal(p.parada.x, p.tramos[1].x1, 'y en el arranque del segundo');
  assert.ok(p.parada.caja.x1 < p.parada.x, 'el rótulo, a la izquierda de la raya');
  const dc = { largo: 50, paso: 10, numero: 20, valla: null, corredor: 0, columna: { de: 0, a: 40, n: 4, v: '1 m/s' }, tramos: [{ de: 0, a: 40, texto: '3 m/s' }, { de: 40, a: 0, texto: '3 m/s' }],
    dx: { a: 40, texto: 'L = 40 m', color: 'f' }, lugares: [{ en: 0, texto: 'Cola' }, { en: 40, texto: 'Cabeza' }] };
  const c = P.geometria(dc), s = P.dibujar(dc);
  assert.equal((s.match(/data-objeto="llama"/g) || []).length, 4);
  assert.ok(c.columna.xs.every(x => x > c.X(0) + 12 && x < c.X(40)), 'las llamas, entre la cola y la cabeza, sin pisar al pastor');
  assert.ok(c.columna.flecha.x1 > c.X(40), 'la flecha de la columna, delante de la cabeza');
  assert.ok(!/stroke-dasharray="4 3"/.test(s), 'camino de tierra: sin la línea de partida');
  assert.deepEqual(c.lugares.map(l => l.texto), ['Cola', 'Cabeza']);
  const sinLlave = P.geometria({ largo: 60, valla: 60 }), conLlave = P.geometria({ largo: 60, valla: 60, dx: { a: 20, texto: 'Δx' } });
  assert.ok(sinLlave.lugares[0].y < conLlave.lugares[0].y, 'sin la llave, «Partida» sube bajo los números');
  for (const d of [dc, { largo: 150, paso: 10, numero: 50, valla: null, corredor: 0, tramos: [{ de: 0, a: 100, texto: '20 s', color: 'i' }, { de: 100, a: 150, texto: '10 s', color: 'i' }], parada: { en: 100, texto: 'descansa 10 s', color: 'i' } }]) {
    const g = P.geometria(d);
    for (const r of g.rotulos) assert.ok(r.x0 >= 4 - 1e-9 && r.x1 <= W - 4 + 1e-9 && r.y0 >= 4 && r.y1 <= H - 4, `«${r.texto}» se sale`);
    for (let i = 0; i < g.rotulos.length; i++) for (let j = i + 1; j < g.rotulos.length; j++) assert.ok(!pisa(g.rotulos[i], g.rotulos[j]), `«${g.rotulos[i].texto}» pisa «${g.rotulos[j].texto}»`);
    assert.ok(!/NaN|undefined/.test(P.dibujar(d)) && /llama|parada/.test(P.alt(d)));
  }
});
