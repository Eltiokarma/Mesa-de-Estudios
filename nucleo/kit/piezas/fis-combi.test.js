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

// ---------- Aceleración (18 nov, MRUV y caída libre, idea 1 «La aceleración») ----------
test('aceleración: la combi firme en x₀ + v·t + ½·a·t², tramos que se abren y la flecha de v que crece cada segundo', () => {
  const d = av({ x0: 0, v: 2, a: 2, segundos: 4, max: 80, crece: true }), g = P.geometria(d), X = P.escala(d);
  assert.ok(Math.abs(g.x - (2 * 4 + 2 * 16 / 2)) < 1e-9 && Math.abs(g.vt - 10) < 1e-9);
  const s = P.dibujar(d);
  const tramos = [...s.matchAll(new RegExp(`<line x1="([\\d.]+)" y1="${AV.TRAMO}" x2="([\\d.]+)" y2="${AV.TRAMO}" stroke="var\\(--c-o\\)" stroke-width="3"`, 'g'))].map(m => +m[2] - +m[1]);
  assert.equal(tramos.length, 4);
  for (let k = 1; k < 4; k++) assert.ok(tramos[k] > tramos[k - 1] + 1, 'cada segundo avanza más');
  // La flecha mide lo que avanzaría en 0,8 s a esa velocidad: crece lo mismo cada segundo.
  const px = 0.8 * (AV.X1 - AV.X0) / 80;
  assert.ok(Math.abs(g.flecha.x2 - g.flecha.x1 - px * 10) < 1e-9);
  assert.equal(g.tenues.length, 4, 'una flecha tenue por cada combi tenue');
  const largos = g.tenues.map(f => f.x2 - f.x1);
  for (let k = 1; k < largos.length; k++) assert.ok(Math.abs(largos[k] - largos[k - 1] - 2 * px) < 1e-9, 'crece 2 m/s por segundo');
  assert.equal((s.match(/class="kit-fantasma" opacity="0.35"><g><line/g) || []).length, 4);
  assert.ok(Math.abs(X(g.pos(3)) - X(2 * 3 + 9)) < 1e-9);
});

test('aceleración: si frena, se detiene y no retrocede; la flecha de a va contra la de v, con otra punta', () => {
  const d = av({ x0: 0, v: 10, a: -2, segundos: 8, max: 40, crece: true, flechaA: { texto: 'a' } });
  const g = P.geometria(d);
  assert.ok(Math.abs(g.x - 25) < 1e-9 && g.vt === 0, 'para en 25 m a los 5 s y se queda');
  assert.ok(Math.abs(g.pos(7) - 25) < 1e-9);
  assert.ok(!g.flecha && !g.flechaA, 'quieta: sin flecha de v ni de a');
  const andando = P.geometria(d, { corte: 2 });
  assert.ok(andando.flechaA.x2 < andando.flechaA.x1 && andando.flecha.x2 > andando.flecha.x1);
  const s = P.dibujar(d, { corte: 2 });
  assert.match(s, /class="fis-aceleracion"/);
  assert.match(s, /<path d="M[\d.]+ \d+L[\d.]+ \d+L[\d.]+ \d+" fill="none" stroke="var\(--c-h\)"/, 'punta abierta, en carmín');
  assert.match(s, /fill="var\(--c-h\)"[^>]*>a</);
  assert.ok(!/fis-aceleracion/.test(P.dibujar(d, { corte: 2, flechaA: false })), 'estado.flechaA = false la esconde');
  // Cerca del borde izquierdo, la flecha de a se corre sin salirse del lienzo ni dejar de estar sobre la combi.
  const borde = P.geometria(av({ x0: 0, v: 10, a: -2, max: 40, flechaA: true }));
  assert.ok(Math.min(borde.flechaA.x1, borde.flechaA.x2) >= 8 && Math.abs(borde.flechaA.x1 - P.escala(av({ max: 40 }))(0)) <= P.constantes.CW / 2);
  assert.match(P.alt(d), /baja 2 m\/s en cada segundo/);
  assert.match(P.alt(av({ v: 0, a: 1.5 })), /arranca hacia la derecha. Su velocidad sube 1,5 m\/s/);
});

test('aceleración: sin NaN, pura, alto fijo, rótulos que caben y flechas que no se montan', () => {
  const casos = [];
  for (const v of [0, 2, 8, 20]) for (const a of [-3, 0.5, 3]) for (const t of [0, 0.4, 1, 2.5, 4]) {
    casos.push([av({ x0: 0, v, a, t, segundos: 4, max: 80, crece: true, signo: true, flechaA: { texto: 'a' }, lugares: [{ en: 0, texto: 'Paradero' }] }), {}]);
  }
  for (const [d, e] of casos) {
    const s = P.dibujar(d, e), g = P.geometria(d, e), donde = JSON.stringify(d);
    assert.ok(!/NaN|undefined|Infinity/.test(s), donde);
    assert.equal(s, P.dibujar(d, e));
    assert.equal(s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)[2], String(H));
    for (const r of g.rotulos) assert.ok(r.x0 >= 4 - 1e-9 && r.x1 <= W - 4 + 1e-9 && r.y0 >= 4 && r.y1 <= H - 4, `${donde}: «${r.texto}» se sale`);
    for (let i = 0; i < g.rotulos.length; i++) for (let j = i + 1; j < g.rotulos.length; j++) assert.ok(!pisa(g.rotulos[i], g.rotulos[j]), `${donde}: «${g.rotulos[i].texto}» pisa «${g.rotulos[j].texto}»`);
    const fs = [...g.tenues, g.flecha].filter(Boolean);
    for (let k = 1; k < fs.length; k++) {
      const dir = fs[k - 1].x2 > fs[k - 1].x1 ? 1 : -1;
      assert.ok(dir > 0 ? fs[k - 1].x2 <= fs[k].x1 + 1e-9 : fs[k - 1].x2 >= fs[k].x1 - 1e-9, `${donde}: dos flechas de v se montan`);
    }
    if (g.flechaA) assert.ok(g.flechaA.caja.y1 < AV.CAMINO, `${donde}: el rótulo de a pisa la avenida`);
  }
});

// ---------- Dos vehículos (18 nov, Movimiento rectilíneo uniforme, ideas 4 y 5) ----------
test('dos vehículos: sin `segundo` ni `lado`, la vista avenida dibuja lo mismo que antes, byte por byte', () => {
  // Huellas del SVG que daba la pieza antes de las opciones de dos vehículos (la del 18 nov, con la aceleración).
  const ANTES = [
    [av({ x0: 20, v: 16, segundos: 5, t: 2.5, max: 140, lugares: [{ en: 0, texto: 'Paradero' }], posiciones: [{ en: 20, texto: 'x₀', color: 'f' }] }), {}, 'a878ac5bec74d971'],
    [av({ x0: 80, v: -12, segundos: 5, max: 100, signo: true, lugares: [{ en: 0, texto: 'Paradero' }, { en: 60, texto: 'Grifo' }] }), { corte: 2 }, '7bf7801cd83b9525'],
    [av({ x0: 0, v: 10, a: -2, segundos: 8, max: 40, crece: true, flechaA: { texto: 'a' } }), { corte: 2 }, 'c4e79a4a0f0442b9'],
    [av({ vehiculo: false, min: -40, max: 60, signo: true, llaves: [{ de: 0, a: 20, texto: 'x₀', color: 'f' }] }), {}, 'fddddbb488c3a5f5'],
  ];
  for (const [d, e, h] of ANTES) assert.equal(huella(P.dibujar(d, e)), h, JSON.stringify(d));
});

const DOS = [];
for (const va of [2, 6, 12]) for (const vb of [-12, -6, -2, 4, 10]) for (const t of [0, 3, 10, 20]) for (const max of [100, 240, 3000]) {
  DOS.push(av({ x0: 0, v: va, t, min: 0, max, paso: max > 600 ? 250 : 10, numero: max > 600 ? 500 : 50, segundos: 0, rotulos: false,
    lugares: [{ en: 0, texto: 'Paradero', lado: 'der' }, { en: max * 0.62, texto: 'Colegio', lado: 'izq' }, { en: max, texto: 'Mercado', lado: 'izq' }],
    segundo: { tipo: t % 2 ? 'combi' : 'mototaxi', x0: vb < 0 ? max : max / 4, v: vb }, posiciones: t === 10 ? [{ en: max / 2, texto: 'cruce', color: 'f' }] : [] }));
}
test('dos vehículos: el segundo está en x₀ + v·t, en el carril de abajo, mirando hacia donde va, con su flecha bajo la avenida', () => {
  const d = av({ x0: 0, v: 10, t: 15, max: 240, segundo: { tipo: 'mototaxi', x0: 240, v: -6 } }), g = P.geometria(d);
  assert.ok(Math.abs(g.x - 150) < 1e-9 && Math.abs(g.segundo.x - 150) < 1e-9, 'se cruzan en 150 m a los 15 s');
  assert.equal(g.kMax, 0, 'sin marcas de cada segundo');
  assert.equal(g.flecha.y, P.constantes.AV2.FLECHA, 'la flecha de la combi, arriba de la avenida');
  assert.equal(g.segundo.flecha.y, P.constantes.AV2.FLECHA2, 'la del mototaxi, debajo');
  assert.ok(g.segundo.flecha.x2 < g.segundo.flecha.x1, 'el mototaxi va hacia la izquierda');
  const s = P.dibujar(d);
  assert.match(s, /data-objeto="mototaxi" data-prueba="si"/);
  assert.equal((s.match(/<line[^>]*stroke="var\(--c-o\)" stroke-width="3"/g) || []).length, 2, 'dos flechas, del mismo color (las dos son velocidades)');
  assert.ok(s.indexOf('data-objeto="combi"') < s.indexOf('data-objeto="mototaxi"'), 'el carril de abajo, más cerca, se dibuja encima');
  assert.match(P.alt(d), /un mototaxi sale de x = 240 m y va a 6 m\/s hacia la izquierda/);
  assert.match(P.dibujar(av({ max: 240, segundo: { tipo: 'combi', x0: 100, v: 5 } })), /data-objeto="combi"[^]*data-objeto="combi"/);
  assert.ok(!/fis-aceleracion/.test(P.dibujar(av({ v: 5, a: 2, flechaA: true, segundo: { x0: 50, v: 3 } }))), 'con dos vehículos no hay flecha de a');
  // El letrero de un lugar va del lado pedido.
  const L = P.geometria(av({ max: 240, lugares: [{ en: 150, texto: 'Colegio', lado: 'izq' }] })).lugares[0];
  assert.ok(L.caja.x1 <= L.px - 9);
  assert.equal(typeof P.vehiculo, 'function');
  assert.match(P.vehiculo('mototaxi', 100, 90, { izquierda: true }), /scale\(-1 1\)[^]*mototaxi/);
});
test('dos vehículos: rótulos que caben con 4 de margen y no se pisan, los dos vehículos dentro del lienzo, puro y sin NaN', () => {
  for (const d of DOS) {
    const g = P.geometria(d), s = P.dibujar(d), donde = JSON.stringify(d);
    assert.ok(!/NaN|undefined|Infinity/.test(s), donde);
    assert.equal(s, P.dibujar(d));
    assert.equal(s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)[2], String(H));
    for (const r of g.rotulos) assert.ok(r.x0 >= 4 - 1e-9 && r.x1 <= W - 4 + 1e-9 && r.y0 >= 4 && r.y1 <= H - 4, `${donde}: «${r.texto}» se sale`);
    for (let i = 0; i < g.rotulos.length; i++) for (let j = i + 1; j < g.rotulos.length; j++) assert.ok(!pisa(g.rotulos[i], g.rotulos[j]), `${donde}: «${g.rotulos[i].texto}» pisa «${g.rotulos[j].texto}»`);
    for (const r of g.rotulos) assert.ok(!(r.y0 < AV.BORDE && r.y1 > AV.CAMINO), `${donde}: «${r.texto}» pisa la avenida`);
    for (const cx of [P.escala(d)(g.x), g.segundo.px]) assert.ok(cx - P.constantes.CW / 2 >= 4 && cx + P.constantes.CW / 2 <= W - 4, `${donde}: un vehículo se sale`);
  }
});

// Auditoría de MRU (18 nov, M6): «el que salió antes» se dibuja con el mototaxi solo en el paradero y una nota; la combi
// todavía no está (ese instante, los dos juntos en x = 0, no existe en el problema).
test('avenida sin la combi y con el segundo: solo el mototaxi con su flecha, y la nota arriba, dentro y sin pisarse', () => {
  const d = { vista: 'avenida', min: 0, max: 200, paso: 10, numero: 50, x0: 0, v: 10, t: 0, segundos: 0, rotulos: false, vehiculo: false,
    lugares: [{ en: 0, texto: 'Paradero' }], segundo: { tipo: 'mototaxi', x0: 0, v: 6 }, nota: 'La combi sale 10 s después.' };
  const s = P.dibujar(d), g = P.geometria(d), W = P.constantes.W;
  assert.ok(!/data-objeto="combi"/.test(s), 'sin combi');
  assert.match(s, /data-objeto="mototaxi"/);
  assert.match(s, />6 m\/s</);
  assert.match(s, />La combi sale 10 s después\.</);
  assert.match(P.alt(d), /mototaxi sale de x = 0 m y va a 6 m\/s hacia la derecha\. Arriba dice: «La combi sale 10 s después\.»/);
  for (const r of g.rotulos) assert.ok(r.x0 >= 4 - 1e-9 && r.x1 <= W - 4 + 1e-9 && r.y0 >= 4 && r.y1 <= 184 - 4, `«${r.texto}» se sale`);
  const pisa = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
  for (let a = 0; a < g.rotulos.length; a++) for (let b = a + 1; b < g.rotulos.length; b++) assert.ok(!pisa(g.rotulos[a], g.rotulos[b]), `«${g.rotulos[a].texto}» pisa «${g.rotulos[b].texto}»`);
  assert.ok(g.nota.y1 < 20, 'la nota queda sobre los letreros');
  assert.equal(s, P.dibujar(d));
});
