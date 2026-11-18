// Pruebas de la pieza «fis-sonido» (18 nov): el eco y el trueno se dibujan puros, sin NaN ni colores fijos, con alto
// fijo; los rótulos caben con 4 de margen y no se pisan; la distancia que se pide va en tinta con «?»; la rapidez en el
// color de la velocidad y el tiempo en el del tiempo; dibujos de prueba marcados.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./fis-sonido.js');
const { W, H } = P.constantes;

const MUESTRAS = [
  { objeto: 'eco', v: '340 m/s', t: '3 s' }, { objeto: 'eco', v: '340 m/s', t: '1,5 s', distancia: 'D = ?' },
  { objeto: 'eco', v: '340 m/s' }, { objeto: 'trueno', v: '340 m/s', t: '4 s' }, { objeto: 'trueno', v: '340 m/s', t: '12 s', distancia: 'D = ?' },
  { objeto: 'eco', v: '340 m/s', t: '2 s', distancia: '680 m', colorD: 'f' },
];
const pisa = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;

test('registrada en el kit', () => assert.equal(Kit.piezas['fis-sonido'], P));

test('los rótulos caben con 4 de margen y no se pisan; las flechas, dentro del lienzo', () => {
  for (const d of MUESTRAS) {
    const g = P.geometria(d);
    for (const r of g.rotulos) assert.ok(r.x0 >= 4 && r.x1 <= W - 4 && r.y0 >= 4 && r.y1 <= H - 4, `${JSON.stringify(d)}: «${r.texto}» se sale`);
    for (let i = 0; i < g.rotulos.length; i++) for (let j = i + 1; j < g.rotulos.length; j++) assert.ok(!pisa(g.rotulos[i], g.rotulos[j]), `«${g.rotulos[i].texto}» pisa «${g.rotulos[j].texto}»`);
    for (const f of g.flechas) assert.ok(Math.min(f.x1, f.x2) >= 4 && Math.max(f.x1, f.x2) <= W - 4);
  }
});

test('colores: la rapidez en naranja, el tiempo en turquesa y la distancia pedida en tinta con «?»', () => {
  const s = P.dibujar({ objeto: 'eco', v: '340 m/s', t: '3 s' });
  assert.match(s, /fill="var\(--c-o\)"[^>]*>ida: 340 m\/s</);
  assert.match(s, /<tspan fill="var\(--c-i\)" font-weight="700">3 s<\/tspan>/);
  assert.match(s, /fill="currentColor"[^>]*>D = \?</);
  const t = P.dibujar({ objeto: 'trueno', v: '340 m/s', t: '4 s' });
  assert.match(t, /fill="var\(--c-o\)"[^>]*>340 m\/s</);
  assert.equal((s.match(/<line[^>]*stroke="var\(--c-o\)" stroke-width="3"/g) || []).length, 2, 'el eco: ida y vuelta');
  assert.equal((t.match(/<line[^>]*stroke="var\(--c-o\)" stroke-width="3"/g) || []).length, 1, 'el trueno: solo ida');
});

test('sin NaN ni colores fijos, alto fijo, puro, dibujos de prueba y texto alternativo', () => {
  for (const d of MUESTRAS) {
    const s = P.dibujar(d);
    assert.ok(!/NaN|undefined|Infinity/.test(s));
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s));
    assert.equal(s, P.dibujar(d));
    assert.equal(s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)[2], String(H));
    assert.match(s, /data-prueba="si"/);
    assert.ok(P.alt(d).length > 40 && !/NaN|undefined/.test(P.alt(d)));
  }
});
