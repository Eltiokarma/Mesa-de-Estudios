// Pruebas de la pieza «arit-bandejas» (la bandeja de la vitrina de doña Juana): se dibuja sin NaN ni colores fijos, es
// pura, marcada como dibujo de prueba y con su texto alternativo; es fiel (una bandeja por pareja de divisores, filas ≤
// caramelos por fila, cada caramelo dibujado, todas a la misma escala; el intento deja justo los sueltos de N ÷ c); nunca
// usa carmín ni verde. Con números (docs/molde-unidad.md §6): todo cabe con 4 de margen, ninguna bandeja pisa a otra ni a
// un rótulo, y ningún rótulo pisa a otro. Con alto fijo, el alto no cambia con n. Se revisan las muestras y todas las
// figuras de la teoría que usan la pieza.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../kit.js');
const P = require('./arit-bandejas.js');

const MUESTRAS = [
  { n: 24 }, { n: 23 }, { n: 30, alto: 250 }, { n: 36 }, { n: 1 }, { n: 2 }, { n: 37 }, { n: 4, alto: 250 },
  { n: 12, intento: 5 }, { n: 12, intento: 4 }, { n: 7, intento: 2, letrero: '7 caramelos' },
  { n: 60, formas: [[6, 10]], pie: [['60 = '], ['6', 'i', 700], [' × '], ['10', 'i', 700]] },
  { n: 35, colorRotulos: false }, { n: 16, rotulos: false },
  { n: 1, pasos: [{ n: 1 }, { n: 2 }, { n: 33 }, { n: 35 }, { n: 37 }], pie: 'pie' },
];
const solapan = (a, b, e = 0) => a.x0 < b.x1 - e && b.x0 < a.x1 - e && a.y0 < b.y1 - e && b.y0 < a.y1 - e;
function revisar(d, e, nombre, mal) {
  const s = P.dibujar(d, e), g = P.geometria(d, e), { W, M } = P.constantes, H = g.H;
  if (/NaN|undefined|Infinity/.test(s)) { mal.push(`${nombre}: NaN o undefined`); return; }
  for (const c of [...g.objetos, ...g.textos]) if (!(c.x0 >= M - 1e-9 && c.y0 >= M - 1e-9 && c.x1 <= W - M + 1e-9 && c.y1 <= H - M + 1e-9))
    mal.push(`${nombre}: se sale «${c.txt || c.que}» (${c.x0.toFixed(1)}, ${c.y0.toFixed(1)}) – (${c.x1.toFixed(1)}, ${c.y1.toFixed(1)}) con H = ${H}`);
  for (let i = 0; i < g.objetos.length; i++) for (let j = i + 1; j < g.objetos.length; j++) if (solapan(g.objetos[i], g.objetos[j])) mal.push(`${nombre}: se pisan ${g.objetos[i].que} y ${g.objetos[j].que}`);
  for (const t of g.textos) for (const o of g.objetos) if (solapan(t, o)) mal.push(`${nombre}: «${t.txt}» pisa ${o.que}`);
  for (let i = 0; i < g.textos.length; i++) for (let j = i + 1; j < g.textos.length; j++) if (solapan(g.textos[i], g.textos[j])) mal.push(`${nombre}: se pisan «${g.textos[i].txt}» y «${g.textos[j].txt}»`);
  // Cada caramelo dentro de su bandeja, con su ancho (las puntas de la envoltura llegan a 0,47 del lugar).
  for (const b of g.bandejas) for (const l of b.lugares) if (l.x - 0.47 * b.s < b.caja.x || l.x + 0.47 * b.s > b.caja.x + b.caja.w || l.y - 0.3 * b.s < b.caja.y || l.y + 0.3 * b.s > b.caja.y + b.caja.h) mal.push(`${nombre}: un caramelo se sale de su bandeja`);
}

test('registrada en el kit', () => assert.equal(Kit.piezas['arit-bandejas'], P));

test('sin NaN ni colores fijos, sin carmín ni verde, pura, marcada de prueba y con su texto alternativo', () => {
  for (const d of MUESTRAS) for (const paso of (d.pasos || [{}]).map((_, i) => i)) {
    const s = P.dibujar(d, { paso });
    assert.ok(!/NaN|undefined|Infinity/.test(s), JSON.stringify(d));
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s), 'sin colores fijos');
    assert.ok(!/var\(--c-[hd]\)/.test(s), 'sin carmín ni verde');
    assert.ok(!/\sid="|filter|<image/.test(s));
    assert.equal(s, P.dibujar(d, { paso }), 'pura');
    assert.match(s, /data-objeto="bandejas" data-prueba="si"/);
    assert.match(s, /^<svg [^>]*viewBox="0 0 320 \d+"/);
    const a = P.alt(d, { paso });
    assert.ok(a.length > 30 && !/undefined|NaN/.test(a), a);
  }
});

test('fiel: una bandeja por pareja de divisores, filas ≤ por fila, cada caramelo dibujado, una sola escala', () => {
  const pares = N => { const o = []; for (let a = 1; a <= N; a++) for (let b = a; b <= N; b++) if (a * b === N) o.push([a, b]); return o; };
  for (let N = 1; N <= 60; N++) {
    const g = P.geometria({ n: N });
    assert.deepEqual(g.bandejas.map(b => [b.b.filas, b.b.porFila]), pares(N), `n = ${N}`);
    for (const b of g.bandejas) {
      assert.ok(b.b.filas <= b.b.porFila);
      assert.equal(b.lugares.filter(l => l.tipo === 'lleno').length, N, `n = ${N}: cada bandeja lleva los N caramelos`);
      assert.equal(b.lugares.length, N, 'sin lugares vacíos en una forma que cierra');
      assert.equal(b.s, g.s, 'una sola escala');
    }
  }
  // El intento: q filas llenas de c y r sueltos, con r = N mód c; los vacíos completan la última fila.
  for (const [N, c] of [[12, 5], [7, 2], [23, 4], [30, 7]]) {
    const it = P.geometria({ n: N, intento: c }).bandejas.find(b => b.b.intento);
    assert.equal(it.lugares.filter(l => l.tipo === 'lleno').length, c * Math.floor(N / c));
    assert.equal(it.lugares.filter(l => l.tipo === 'suelto').length, N % c);
    assert.equal(it.lugares.filter(l => l.tipo === 'vacio').length, c - (N % c));
    assert.match(P.dibujar({ n: N, intento: c }), /class="bd-suelto"/);
  }
  // Si el intento cierra, es una forma más (sin sueltos).
  assert.ok(!/bd-suelto/.test(P.dibujar({ n: 12, intento: 4 })));
});

test('con alto fijo, el alto no cambia con n; todo cabe con 4 de margen y nada se pisa', () => {
  const mal = [];
  for (let N = 4; N <= 30; N++) { assert.equal(P.geometria({ n: N, alto: 250 }).H, 250); revisar({ n: N, alto: 250 }, {}, `n = ${N} (alto 250)`, mal); }
  for (let N = 1; N <= 60; N++) revisar({ n: N }, {}, `n = ${N}`, mal);
  for (const d of MUESTRAS) for (const paso of (d.pasos || [{}]).map((_, i) => i)) revisar(d, { paso }, JSON.stringify(d).slice(0, 60), mal);
  assert.deepEqual(mal, []);
  // Los caramelos no quedan diminutos en el juego (n hasta 30, 250 de alto).
  for (let N = 4; N <= 30; N++) assert.ok(P.geometria({ n: N, alto: 250 }).s >= 9, `n = ${N}: caramelo de ${P.geometria({ n: N, alto: 250 }).s}`);
});

test('las figuras de la teoría que usan la pieza caben y no se pisan', () => {
  let def;
  try { def = require(path.join(__dirname, '..', '..', '..', 'contenido', 'teoria', 'aritmetica', 'numeros-primos-y-divisores.js')); } catch (e) { return; }
  const mal = [], figuras = [];
  const junta = (dib, pieza, nombre) => { if (dib && (dib.pieza || pieza) === 'arit-bandejas') figuras.push([dib.datos, dib.estado || {}, nombre]); };
  for (const idea of def.ideas) {
    (idea.lee ? idea.lee.tarjetas : []).forEach((t, i) => t.dibujo && junta({ pieza: t.pieza || idea.pieza, datos: t.dibujo.datos, estado: t.dibujo.estado }, null, `${idea.id} lee ${i}`));
    if (idea.juega) for (let n = 4; n <= 30; n++) { const v = { n }; try { junta(idea.juega.dibujo(Object.assign(Object.fromEntries(idea.juega.controles.map(c => [c.id, c.inicio !== undefined ? c.inicio : c.opciones[0].valor])), v)), idea.juega.pieza || idea.pieza, `${idea.id} juego`); } catch (e) { /* otra pieza */ } }
    if (idea.predice) { junta(idea.predice.dibujo, idea.predice.pieza || idea.pieza, `${idea.id} predice`); junta(idea.predice.revelar, idea.predice.pieza || idea.pieza, `${idea.id} revelar`); }
    if (idea.mira && (idea.mira.pieza || idea.pieza) === 'arit-bandejas') idea.mira.pasos.forEach((p, i) => figuras.push([idea.mira.datos, p.estado, `${idea.id} mira ${i}`]));
    (idea.ejemplos || []).forEach((e, i) => junta(e.figura, idea.pieza, `${idea.id} ejemplo ${i + 1}`));
  }
  for (const [d, e, nombre] of figuras) revisar(d, e, nombre, mal);
  assert.deepEqual(mal, []);
});
