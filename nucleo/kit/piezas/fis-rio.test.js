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
