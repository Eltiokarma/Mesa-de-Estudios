// Pruebas de la pieza «fis-rio» (18 nov): el río en una recta. La corriente siempre río abajo (hacia la derecha), el
// bote y su flecha hacia donde rema, la flecha vista desde la orilla y su corte; rótulos que caben con 4 de margen y no
// se pisan; puro, alto fijo, sin NaN ni colores fijos, dibujos de prueba.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./fis-rio.js');
const { W, H } = P.constantes;
const pisa = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
const MUESTRAS = [];
for (const sentido of ['abajo', 'arriba']) for (const u of ['', '5 m/s', '?', '4 m/s']) for (const c of ['', '2 m/s', '1,5 m/s', '?']) for (const extra of [{}, { total: { texto: '7 m/s' } }, { cota: { de: 0.1, a: 0.9, texto: 'L = 120 m', color: 'f' } }, { total: { texto: 'u − c' }, cota: { de: 0.1, a: 0.9, texto: 'L = 80 m', color: 'f' } }]) {
  MUESTRAS.push(Object.assign({ sentido, u, c }, extra));
}

test('registrada en el kit', () => assert.equal(Kit.piezas['fis-rio'], P));

test('la corriente va río abajo; el bote y su flecha, hacia donde rema; la flecha desde la orilla aparece en su paso', () => {
  for (const sentido of ['abajo', 'arriba']) {
    const g = P.geometria({ sentido, u: '5 m/s', c: '2 m/s', total: { texto: 'v', desde: 2 } });
    assert.ok(g.corriente.every(f => f.x2 > f.x1), 'la corriente, hacia la derecha');
    assert.equal(Math.sign(g.u.x2 - g.u.x1), sentido === 'abajo' ? 1 : -1);
    assert.equal(g.bote.dir, sentido === 'abajo' ? 1 : -1);
    assert.equal(g.u.caja.texto, '5 m/s respecto al agua', 'la del bote se mide desde el agua');
    assert.ok(g.total && !P.geometria({ sentido, u: '5 m/s', total: { texto: 'v', desde: 2 } }, { corte: 1 }).total);
  }
  const s = P.dibujar({ u: '5 m/s', c: '2 m/s' });
  assert.match(s, /data-objeto="bote" data-prueba="si"/);
  assert.match(s, /data-objeto="persona" data-prueba="si"/);
  assert.match(s, /fill="var\(--c-o\)"[^>]*>corriente: 2 m\/s</);
});

test('rótulos que caben con 4 de margen y no se pisan; puro, alto fijo, sin NaN ni colores fijos y con texto alternativo', () => {
  for (const d of MUESTRAS) {
    const g = P.geometria(d), s = P.dibujar(d), donde = JSON.stringify(d);
    for (const r of g.rotulos) assert.ok(r.x0 >= 4 - 1e-9 && r.x1 <= W - 4 + 1e-9 && r.y0 >= 4 && r.y1 <= H - 4, `${donde}: «${r.texto}» se sale`);
    for (let i = 0; i < g.rotulos.length; i++) for (let j = i + 1; j < g.rotulos.length; j++) assert.ok(!pisa(g.rotulos[i], g.rotulos[j]), `${donde}: «${g.rotulos[i].texto}» pisa «${g.rotulos[j].texto}»`);
    assert.ok(!/NaN|undefined|Infinity/.test(s), donde);
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s));
    assert.equal(s, P.dibujar(d));
    assert.equal(s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)[2], String(H));
    assert.ok(P.alt(d).length > 40 && !/NaN|undefined/.test(P.alt(d)));
  }
});

// Auditoría de MRU (18 nov, M7): las flechas tienen el largo de su valor, con una sola escala por figura; río arriba,
// la vista desde la orilla es más corta que la del bote. Con letras, largos de muestra que cumplen lo mismo.
test('las flechas miden su valor con la misma escala; la de la orilla va hacia donde da la suma con signo', () => {
  const casos = [['abajo', 4, 1.5], ['arriba', 4, 1.5], ['abajo', 6, 3], ['arriba', 5, 3], ['arriba', 5, 1], ['abajo', 2, 0.5], ['arriba', 3, 2]];
  for (const [sentido, u, c] of casos) {
    const t = x => `${String(x).replace('.', ',')} m/s`, dir = sentido === 'abajo' ? 1 : -1, vt = dir * u + c;
    const g = P.geometria({ sentido, u: t(u), c: t(c), total: { texto: t(Math.abs(vt)) } }), k = g.escala, donde = `${sentido} ${u} ${c}`;
    assert.ok(k > 0 && k <= 12, donde);
    assert.ok(Math.abs((g.u.x2 - g.u.x1) - dir * u * k) < 1e-9, `${donde}: u`);
    assert.ok(Math.abs((g.total.x2 - g.total.x1) - vt * k) < 1e-9, `${donde}: desde la orilla`);
    for (const f of g.corriente) assert.ok(Math.abs((f.x2 - f.x1) - c * k) < 1e-9, `${donde}: corriente`);
    for (const x of [g.u.x2, g.total.x2, ...g.corriente.map(f => f.x2)]) assert.ok(x >= 4 && x <= W - 4, `${donde}: flecha fuera`);
    if (sentido === 'arriba') assert.ok(Math.abs(g.total.x2 - g.total.x1) < Math.abs(g.u.x2 - g.u.x1), `${donde}: río arriba, más corta que u`);
  }
  for (const sentido of ['abajo', 'arriba']) {
    const g = P.geometria({ sentido, u: 'u', c: 'c', total: { texto: 'u + c' } }), Lu = Math.abs(g.u.x2 - g.u.x1), Lt = Math.abs(g.total.x2 - g.total.x1);
    assert.equal(g.escala, null);
    assert.ok(sentido === 'abajo' ? Lt > Lu : Lt < Lu, `${sentido}: con letras, la de la orilla es ±u + c`);
    assert.ok(Math.abs(Lt - Math.abs((sentido === 'abajo' ? 1 : -1) * Lu + (g.corriente[0].x2 - g.corriente[0].x1))) < 1e-9);
  }
  assert.match(P.dibujar({ u: '5 m/s', c: '2 m/s' }), />\+</, 'el eje lleva su «+»');
});

// Ronda 2 del lector en frío (18 nov): «Ahora tú» de Velocidad relativa mezcla el río y las dos combis, y la prueba del
// tema dibuja todos sus casos con fis-rio. Un dibujo con vista: 'ventana' sale igual que con fis-ventana.
test('puente: un dibujo con vista «ventana» lo dibuja fis-ventana; sin ella, el río de siempre', () => {
  const V = Kit.piezas['fis-ventana'], d = { vista: 'ventana', vA: 12, vB: -8, t: 0, rotuloRel: '?' };
  assert.ok(V, 'fis-ventana registrada');
  assert.equal(P.dibujar(d), V.dibujar(d));
  assert.equal(P.alt(d), V.alt(d));
  assert.ok(!/data-objeto="combi"/.test(P.dibujar({ u: '5 m/s', c: '2 m/s' })), 'sin vista, el río');
});
