// Pruebas de la pieza «fis-combi»: la combi queda donde dicen los metros, un tramo por segundo, el corte de «Mira»,
// nada de NaN ni colores fijos, alto fijo, pureza y texto alternativo con la rapidez.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const P = require('./fis-combi.js');

test('registrada en el kit', () => assert.equal(Kit.piezas['fis-combi'], P));

test('un tramo por segundo, cada uno de v metros, y la combi firme en v · t', () => {
  const s = P.dibujar({ v: 20, segundos: 5 });
  assert.equal((s.match(/stroke="var\(--c-o\)" stroke-width="3"/g) || []).length, 5);
  assert.equal((s.match(/data-objeto="combi"/g) || []).length, 6);
  assert.equal((s.match(/kit-fantasma/g) || []).length, 5, 'las de los segundos anteriores son tenues');
  assert.match(s, />20 m</);
  assert.match(s, />5 s</);
  const X = P.escala({ v: 20 });
  const tramo = s.match(/<line x1="([\d.]+)" y1="[\d.]+" x2="([\d.]+)" y2="[\d.]+" stroke="var\(--c-o\)" stroke-width="3"/);
  assert.ok(Math.abs(+tramo[2] - +tramo[1] - (X(20) - X(0))) < 0.02);
});

test('el corte dibuja solo hasta ese segundo', () => {
  const s = P.dibujar({ v: 20, segundos: 5 }, { corte: 2 });
  assert.equal((s.match(/stroke="var\(--c-o\)" stroke-width="3"/g) || []).length, 2);
  assert.ok(!/>3 s</.test(s));
});

test('la combi es un dibujo de prueba marcado', () => assert.match(P.dibujar({}), /data-objeto="combi" data-prueba="si"/));

test('sin NaN ni colores fijos, alto fijo, puro y con texto alternativo', () => {
  const altos = new Set();
  for (const d of [{}, { v: 20, segundos: 5 }, { v: 12.5, segundos: 3, max: 60 }, { v: 40, segundos: 5, max: 200, rotulos: false }]) {
    const s = P.dibujar(d);
    assert.ok(!/NaN|undefined|Infinity/.test(s));
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s));
    assert.equal(s, P.dibujar(d));
    altos.add(s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)[2]);
    assert.ok(P.alt(d).length > 30 && !/NaN|undefined/.test(P.alt(d)));
  }
  assert.equal(altos.size, 1);
});

// ---------- Vista «avenida» (18 nov, Movimiento rectilíneo uniforme, idea 1) ----------
const crypto = require('node:crypto');
const T = require('../trazo.js');
const huella = s => crypto.createHash('sha256').update(s).digest('hex').slice(0, 16);

test('sin vista: el mismo SVG de antes, byte por byte (Magnitudes y unidades no cambia)', () => {
  // Huellas del SVG que daba la pieza antes de la vista «avenida» (git HEAD del 18 nov), con y sin corte.
  const ANTES = [
    [{}, {}, 'cadf233cf785d21a'], [{ v: 20, segundos: 5 }, {}, 'd9326e5c96d51c8a'], [{ v: 20, segundos: 5 }, { corte: 2 }, '4f86d27915dd4317'],
    [{ v: 12.5, segundos: 3, max: 60 }, {}, '7ebefc5fc74dc9ec'], [{ v: 40, segundos: 5, max: 200, rotulos: false }, {}, '564a566b8372d911'],
    [{ v: 25, segundos: 0, max: 150, paso: 10, numero: 50 }, {}, '4dc26764a1ae204b'],
  ];
  for (const [d, e, h] of ANTES) assert.equal(huella(P.dibujar(d, e)), h, JSON.stringify(d));
});

const AV = P.constantes.AV, W = P.constantes.W, H = P.constantes.H;
const av = d => Object.assign({ vista: 'avenida' }, d);
const firme = s => [...s.matchAll(/<g class="kit-objeto" data-objeto="combi" data-prueba="si">(.*?)<\/g>/g)];

test('avenida: la combi firme está en x₀ + v·t, una combi tenue y un tramo por segundo, y mira hacia donde va', () => {
  const d = av({ x0: 20, v: 16, segundos: 5, t: 2.5, max: 140 }), g = P.geometria(d), X = P.escala(d);
  assert.ok(Math.abs(g.x - (20 + 16 * 2.5)) < 1e-9);
  assert.equal(g.kMax, 2);
  const s = P.dibujar(d);
  assert.equal(firme(s).length, 1, 'una sola combi firme');
  assert.equal((s.match(/kit-fantasma/g) || []).length, 3, 'las de 0, 1 y 2 s, tenues');
  assert.equal((s.match(new RegExp(`y1="${AV.TRAMO}" x2="[\\d.]+" y2="${AV.TRAMO}" stroke="var\\(--c-o\\)" stroke-width="3"`, 'g')) || []).length, 2, 'dos tramos completos');
  // la combi firme: su rueda trasera a 9 de su cola; la cola está en X(x) − CW/2
  const cola = X(g.x) - P.constantes.CW / 2;
  assert.match(firme(s)[0][1], new RegExp(`cx="${T.n(cola + 9)}"`));
  // con v negativa se refleja sobre su centro y la flecha apunta a la izquierda
  const izq = P.dibujar(av({ x0: 80, v: -12, segundos: 5 }));
  assert.match(izq, /scale\(-1 1\)/);
  const gi = P.geometria(av({ x0: 80, v: -12, segundos: 5 }));
  assert.ok(gi.flecha.x2 < gi.flecha.x1);
  assert.equal(gi.flecha.txt, '12 m/s', 'la flecha lleva la rapidez, sin signo: el signo lo dice hacia dónde apunta');
  assert.ok(Math.abs(gi.x - 20) < 1e-9);
});

test('avenida: el corte de «Mira», el instante t y las marcas con nombre', () => {
  const d = av({ x0: 80, v: -12, segundos: 5, max: 100, lugares: [{ en: 0, texto: 'Paradero' }] });
  assert.equal(P.geometria(d, { corte: 2 }).kMax, 2);
  assert.ok(Math.abs(P.geometria(d, { corte: 2 }).x - 56) < 1e-9);
  const s = P.dibujar(d, { corte: 2 });
  assert.ok(!/>3 s</.test(s) && />2 s</.test(s));
  assert.match(s, />Paradero</);
  assert.match(s, /data-objeto="lugar" data-prueba="si"/);
  assert.match(P.dibujar(av({ posiciones: [{ en: 30, texto: 'x₀', color: 'f' }] })), /fill="var\(--c-f\)"[^>]*>x₀</);
  assert.match(P.dibujar(av({ posiciones: [{ en: 30, texto: '?' }] })), /fill="currentColor"[^>]*>\?</, 'lo que se pide, en tinta');
  assert.ok(!/data-objeto="combi"/.test(P.dibujar(av({ vehiculo: false }))));
});

// Muestras que cubren lo que usa la unidad: juego, Predice, Mira, regla, Lee y ejemplos.
const MUESTRAS = [];
for (const x0 of [0, 10, 20, 30, 40]) for (const v of [2, 4, 8, 12, 16, 20]) for (const t of [0, 0.5, 2.25, 5]) {
  MUESTRAS.push(av({ x0, v, t, segundos: 5, max: 140, lugares: [{ en: 0, texto: 'Paradero' }], posiciones: [{ en: x0, texto: 'x₀', color: 'f' }] }));
}
MUESTRAS.push(
  av({ x0: 80, v: -12, segundos: 5, max: 100, signo: true, lugares: [{ en: 0, texto: 'Paradero' }], posiciones: [{ en: 80, texto: 'x₀', color: 'f' }] }),
  av({ x0: 80, v: -12, segundos: 5, min: -20, max: 100, signo: true, rotulos: false, llaves: [{ de: 0, a: 80, texto: 'x₀', color: 'f', fila: 1 }, { de: 80, a: 20, texto: 'v · t', color: 'f' }], posiciones: [{ en: 20, texto: 'x', color: 'f' }] }),
  av({ x0: -30, v: 10, segundos: 0, min: -40, max: 60, signo: true, lugares: [{ en: 0, texto: 'Paradero' }] }),
  av({ x0: 0, v: 20, segundos: 0, max: 2000, paso: 250, numero: 500, flechaTexto: '72 km/h', lugares: [{ en: 0, texto: 'Paradero' }] }),
  av({ x0: 120, v: -15, segundos: 0, min: -40, max: 140, signo: true, lugares: [{ en: 0, texto: 'Paradero' }, { en: 120, texto: 'Grifo' }] }),
  av({ vehiculo: false, min: -40, max: 60, signo: true, lugares: [{ en: 0, texto: 'Paradero' }] }),
);
const pisa = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;

test('avenida: los rótulos caben con 4 de margen, no se pisan entre sí y no pisan la avenida (salvo el de la flecha, que va en su carril)', () => {
  for (const d of MUESTRAS) {
    const g = P.geometria(d), donde = JSON.stringify(d);
    for (const r of g.rotulos) {
      assert.ok(r.x0 >= 4 - 1e-9 && r.x1 <= W - 4 + 1e-9 && r.y0 >= 4 && r.y1 <= H - 4, `${donde}: «${r.texto}» se sale`);
      const enCamino = r.y0 < AV.BORDE && r.y1 > AV.CAMINO;
      if (g.flecha && r === g.flecha.caja) assert.ok(r.y0 >= AV.CAMINO && r.y1 <= AV.BORDE, `${donde}: la rapidez sale de su carril`);
      else assert.ok(!enCamino, `${donde}: «${r.texto}» pisa la avenida`);
    }
    for (let i = 0; i < g.rotulos.length; i++) for (let j = i + 1; j < g.rotulos.length; j++) {
      assert.ok(!pisa(g.rotulos[i], g.rotulos[j]), `${donde}: «${g.rotulos[i].texto}» pisa «${g.rotulos[j].texto}»`);
    }
    // la flecha y la combi firme, dentro del lienzo
    if (g.flecha) assert.ok(Math.min(g.flecha.x1, g.flecha.x2) >= 4 && Math.max(g.flecha.x1, g.flecha.x2) <= W - 4, `${donde}: la flecha se sale`);
    const X = P.escala(d), cx = X(g.x);
    assert.ok(cx - P.constantes.CW / 2 >= 4 && cx + P.constantes.CW / 2 <= W - 4, `${donde}: la combi se sale`);
  }
});

test('avenida: sin NaN ni colores fijos, alto fijo, pura y con texto alternativo que dice salida y velocidad', () => {
  for (const d of MUESTRAS) {
    const s = P.dibujar(d);
    assert.ok(!/NaN|undefined|Infinity/.test(s), JSON.stringify(d));
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s));
    assert.equal(s, P.dibujar(d));
    assert.equal(s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)[2], String(H));
    assert.match(s, /class="fis-avenida"/);
    if (d.vehiculo !== false) assert.match(P.alt(d), new RegExp(`sale de x = ${String(d.x0).replace('-', '−')} m`));
  }
});
