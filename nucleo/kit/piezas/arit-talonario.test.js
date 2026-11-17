// Pruebas de la pieza «arit-talonario» (la rifa de la promoción): se dibuja sin NaN ni colores fijos, es pura, de alto
// fijo con las líneas de los bloques (más bajo sin ellas), marcada como dibujo de prueba y con su texto alternativo; es fiel (las dos barras a la misma escala: un boleto
// de k cifras ocupa k veces más en la barra de cifras, y cada número impreso lleva una casilla por cifra); nunca usa el
// carmín. Con números (docs/molde-unidad.md §6): todo cabe con 4 de margen y ningún texto pisa a otro ni a un objeto.
// Se revisan las muestras y todas las figuras de la teoría que usan la pieza.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../kit.js');
const P = require('./arit-talonario.js');

const MUESTRAS = [
  { N: 200, max: 1100, lineas: 'cuenta' }, { N: 120, max: 1100, lineas: 'cuenta' }, { N: 400, max: 1100, lineas: 'cuenta' },
  { N: 100, max: 220, cifras: false }, { N: 100, max: 220, lineas: 'cuenta', hasta: 2, total: false },
  { N: 1000, total: '?' }, { N: 1500, lineas: 'cuenta' }, { desde: 45, N: 120, lineas: 'rango' }, { desde: 35, N: 80, cifras: false },
  { pide: 'N', impresas: 1500 }, { N: 200, barras: false }, { N: 9, lineas: 'cuenta', cuenta: false }, {},
  { N: 150, max: 1100, lineas: 'cuenta', soloUltimo: true }, { N: 400, max: 1100, lineas: 'cuenta', soloUltimo: true },
];
const solapan = (a, b, e = 0) => a.x0 < b.x1 + e && b.x0 < a.x1 + e && a.y0 < b.y1 + e && b.y0 < a.y1 + e;
function revisar(d, e, nombre, mal) {
  const s = P.dibujar(d, e), g = P.geometria(d, e), { W, M } = P.constantes, H = g.H;
  if (/NaN|undefined|Infinity/.test(s)) { mal.push(`${nombre}: NaN o undefined`); return; }
  for (const c of [...g.objetos, ...g.textos]) if (!(c.x0 >= M - 1e-9 && c.y0 >= M - 1e-9 && c.x1 <= W - M + 1e-9 && c.y1 <= H - M + 1e-9))
    mal.push(`${nombre}: se sale «${c.txt || c.que}» (${c.x0.toFixed(1)}, ${c.y0.toFixed(1)}) – (${c.x1.toFixed(1)}, ${c.y1.toFixed(1)})`);
  const t = g.textos;
  for (let i = 0; i < t.length; i++) for (let j = i + 1; j < t.length; j++) if (solapan(t[i], t[j], 1)) mal.push(`${nombre}: se pisan «${t[i].txt}» y «${t[j].txt}»`);
  for (const x of t) for (const o of g.objetos) if (solapan(x, o)) mal.push(`${nombre}: «${x.txt}» pisa ${o.que}`);
}

test('registrada en el kit', () => assert.equal(Kit.piezas['arit-talonario'], P));

test('sin NaN ni colores fijos ni carmín, pura, de alto fijo, marcada de prueba y con su texto alternativo', () => {
  const altos = new Set();
  for (const d of MUESTRAS) {
    const s = P.dibujar(d);
    assert.ok(!/NaN|undefined|Infinity/.test(s), JSON.stringify(d));
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s), 'sin colores fijos');
    assert.ok(!/var\(--c-h\)/.test(s), 'sin carmín');
    assert.ok(!/\sid="|filter|<image/.test(s));
    assert.equal(s, P.dibujar(d), 'pura');
    assert.match(s, /data-objeto="talonario" data-prueba="si"/);
    altos.add(s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)[0]);
    assert.ok(P.alt(d).length > 30 && !/undefined|NaN/.test(P.alt(d)), P.alt(d));
  }
  assert.ok([...altos].every(x => /^viewBox="0 0 320 (280|220|174|192|112)"$/.test(x)), [...altos].join(', '));
  // Con las líneas de los bloques (juego y «Mira»), siempre el mismo alto.
  for (const N of [9, 120, 400, 1500]) assert.equal(P.geometria({ N, lineas: 'cuenta' }).H, 280);
});

test('fiel: las dos barras a la misma escala, cada bloque de k cifras ocupa k veces más abajo, y una casilla por cifra', () => {
  for (const N of [9, 50, 100, 200, 400, 1000]) {
    const g = P.geometria({ N, max: 1100 });
    let antes = 0;
    for (const t of g.tramos) {
      assert.ok(Math.abs(t.w2 - t.b.k * t.w1) < 1e-9, `${N}: bloque ${t.b.k}`);
      assert.ok(Math.abs(t.w1 - t.b.cuantos * g.sx) < 1e-9);
      antes += t.b.cuantos;
    }
    assert.equal(antes, N, 'los bloques cubren del 1 al N');
    // El final de la barra de boletos y su inversa (la manija del juego).
    assert.ok(Math.abs(P.deX({ N, max: 1100 }, P.finBarra({ N, max: 1100 }).x) - N) < 1e-9);
    // Casillas del último boleto: una por cifra (más la del primero, «1»).
    const s = P.dibujar({ N, max: 1100 });
    assert.equal((s.match(/stroke="var\(--c-o\)" stroke-width="1.5"\/>/g) || []).length - g.tramos.length, String(N).length + 1);
  }
  const s = P.dibujar({ N: 200, pide: 'N', impresas: 492 });
  assert.match(s, />\?<\/text>/, 'lo que se pide, con «?»');
  assert.ok(!/var\(--c-f\)/.test(s), 'nada en violeta si se pide el último boleto');
});

test('muestras: todo cabe con 4 de margen y ningún texto pisa a otro ni a un objeto', () => {
  const mal = [];
  for (const d of MUESTRAS) revisar(d, {}, JSON.stringify(d), mal);
  assert.deepEqual(mal, []);
});

test('todas las figuras de la teoría que usan la pieza: caben y sus textos no se pisan', () => {
  const U = require(path.join(__dirname, '../../../contenido/teoria/aritmetica/numeracion.js'));
  for (const r of U.requiere) require(path.join(__dirname, '../../..', r));
  const Teoria = require('../../teoria.js');
  const figs = [], mal = [];
  const toma = (nombre, dib, pieza) => { if (dib && dib.datos && (dib.pieza || pieza) === 'arit-talonario') figs.push([nombre, dib.datos, dib.estado || {}]); };
  for (const idea of U.ideas) {
    const pz = idea.pieza;
    for (const [k, t] of idea.lee.tarjetas.entries()) toma(`${idea.id} lee ${k + 1}`, t.dibujo, t.pieza || pz);
    for (const v of Teoria.grilla(idea.juega.controles)) toma(`${idea.id} juego ${JSON.stringify(v)}`, idea.juega.dibujo(v), idea.juega.pieza || pz);
    toma(`${idea.id} predice`, idea.predice.dibujo, idea.predice.pieza || pz);
    toma(`${idea.id} revelar`, idea.predice.revelar, idea.predice.pieza || pz);
    idea.mira.pasos.forEach((ps, i) => toma(`${idea.id} mira ${i + 1}`, { datos: idea.mira.datos, estado: ps.estado }, idea.mira.pieza || pz));
    for (const [k, e] of idea.ejemplos.entries()) if (e.figura) toma(`${idea.id} ejemplo ${k + 1}`, e.figura);
    for (let s = 0; s < 120; s++) {
      const c = idea.resuelve.generar(s); toma(`${idea.id} resuelve ${s}`, c.dibujo, idea.resuelve.pieza || pz); for (const x of c.pasos) toma(`${idea.id} resuelve ${s}`, x.dibujo, idea.resuelve.pieza || pz);
      const a = idea.ahoraTu.generar(s); toma(`${idea.id} ahora tú ${s}`, a.dibujo, idea.ahoraTu.pieza || pz);
    }
  }
  assert.ok(figs.length > 200, `${figs.length} figuras`);
  for (const [nombre, d, e] of figs) revisar(d, e, nombre, mal);
  assert.deepEqual(mal.slice(0, 20), []);
});

test('soloUltimo: una sola línea, la del último bloque, en el lugar de la primera; las barras no cambian', () => {
  for (const N of [120, 150, 400]) {
    const d = { N, max: 1100, lineas: 'cuenta' }, g = P.geometria(Object.assign({ soloUltimo: true }, d)), todas = P.geometria(d);
    const lineas = g.rot.filter(r => /^\d/.test(r.segs[0][0]) && r.segs.length > 1);
    assert.equal(lineas.length, 1, `${N}: ${lineas.length} líneas`);
    assert.equal(lineas[0].segs[0][0], `100 a ${N}: `);
    assert.equal(lineas[0].y, todas.rot.find(r => r.segs[0][0] === '1 a 9: ').y, 'va donde iba la primera');
    assert.deepEqual(g.tramos, todas.tramos);
    assert.equal(g.H, 280, 'el alto no salta');
    const s = P.dibujar(Object.assign({ soloUltimo: true }, d)).replace(/aria-label="[^"]*"/, '');
    assert.ok(!/1 a 9|10 a 99/.test(s), 'sin las cuentas de los bloques de una y dos cifras (el texto alternativo sí los nombra)');
  }
});
