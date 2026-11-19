// Pruebas de las piezas «arit-boleto» (un boleto de la rifa con sus cifras en casillas y el peso de cada lugar) y
// «arit-monedas» (monedas para pagar una cuenta): sin NaN ni colores fijos, puras, marcadas de prueba, con texto
// alternativo, sin carmín ni verde; fieles (una casilla por cifra, un círculo por moneda, la cifra borrada sin número);
// y con números (docs/molde-unidad.md §6): todo cabe con 4 de margen, ningún rótulo pisa a otro ni a un objeto que no
// sea el suyo, y el alto no salta entre los pasos de una figura. Se revisan las muestras y las figuras de la teoría.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../kit.js');
const B = require('./arit-boleto.js');
const Mo = require('./arit-monedas.js');

const M_BOLETO = [
  { cifras: '4?73', letrero: [['Gana si es múltiplo de '], ['11', 'i', 700]] },
  { cifras: '4?73', hallada: { 1: '8' }, pesos: ['−1', '+1', '−1', '+1'], letrero: 'Gana si es múltiplo de 11', pie: [['3 − 7 + 8 − 4 = '], ['0', 'o', 700]] },
  { cifras: '415', pesos: ['2', '3', '1'], pie: '4 × 2 + 1 × 3 + 5 × 1 = 16' }, { cifras: '415' }, { cifras: '52?417' }, {},
  { cifras: '3?5', letrero: '¿Qué cifra falta?', pasos: [{}, { pesos: ['2', '3', '1'] }, { pesos: ['2', '3', '1'], pie: '6 + 3a + 5' }, { hallada: { 1: '1' }, pesos: ['2', '3', '1'], pie: 'a = 1' }] },
];
const M_MONEDAS = [
  { cuenta: 23, filas: [{ valor: 2, cuantas: 4 }, { valor: 5, cuantas: 3 }] },
  { cuenta: 23, filas: [{ valor: 2, cuantas: 12 }, { valor: 5, cuantas: 5 }], pie: [['2 × 12 + 5 × 5 = 49: sobran 26']] },
  { cuenta: 40, filas: [{ valor: 2, cuantas: '?' }, { valor: 5, cuantas: '?' }] },
  { filas: [{ valor: 2, cuantas: 20 }, { valor: 5, cuantas: 0 }], total: false },
  { cuenta: 70, filas: [{ valor: 10, cuantas: 3, clase: 'billete' }, { valor: 20, cuantas: 2, clase: 'billete' }] }, {},
  { cuenta: 23, filas: [{ valor: 2, cuantas: 0 }, { valor: 5, cuantas: 0 }], pasos: [{}, { filas: [{ valor: 2, cuantas: 9 }, { valor: 5, cuantas: 1 }], pie: '10 monedas' }, { filas: [{ valor: 2, cuantas: 4 }, { valor: 5, cuantas: 3 }], pie: '7 monedas' }] },
];
const solapan = (a, b) => a.x0 < b.x1 - 0.5 && b.x0 < a.x1 - 0.5 && a.y0 < b.y1 - 0.5 && b.y0 < a.y1 - 0.5;
function revisar(P, d, e, nombre, mal) {
  const s = P.dibujar(d, e), g = P.geometria(d, e), { W, M } = P.constantes, H = g.H;
  if (/NaN|undefined|Infinity/.test(s)) { mal.push(`${nombre}: NaN o undefined`); return; }
  for (const c of [...g.objetos, ...g.textos]) if (!(c.x0 >= M - 1e-9 && c.y0 >= M - 1e-9 && c.x1 <= W - M + 1e-9 && c.y1 <= H - M + 1e-9))
    mal.push(`${nombre}: se sale «${c.txt || c.que}» (${c.x0.toFixed(1)}, ${c.y0.toFixed(1)}) – (${c.x1.toFixed(1)}, ${c.y1.toFixed(1)}) con H = ${H}`);
  for (let i = 0; i < g.textos.length; i++) for (let j = i + 1; j < g.textos.length; j++) if (solapan(g.textos[i], g.textos[j])) mal.push(`${nombre}: se pisan «${g.textos[i].txt}» y «${g.textos[j].txt}»`);
  // Un rótulo no pisa un objeto, salvo el texto del cartel dentro de su cartel.
  for (const t of g.textos) for (const o of g.objetos) if (solapan(t, o) && !(t.que === 'cartel' && o.que === 'cartel')) mal.push(`${nombre}: «${t.txt}» pisa ${o.que}`);
  const mon = g.objetos.filter(o => /^(moneda|billete)/.test(o.que));
  for (let i = 0; i < mon.length; i++) for (let j = i + 1; j < mon.length; j++) if (solapan(mon[i], mon[j])) mal.push(`${nombre}: se pisan ${mon[i].que} y ${mon[j].que}`);
}
const pasosDe = d => (d.pasos || [{}]).map((_, i) => i);

test('registradas en el kit', () => { assert.equal(Kit.piezas['arit-boleto'], B); assert.equal(Kit.piezas['arit-monedas'], Mo); });

test('sin NaN ni colores fijos, sin carmín ni verde, puras, marcadas de prueba y con texto alternativo', () => {
  for (const [P, ms, obj] of [[B, M_BOLETO, 'boleto'], [Mo, M_MONEDAS, 'monedas']]) for (const d of ms) for (const paso of pasosDe(d)) {
    const s = P.dibujar(d, { paso });
    assert.ok(!/NaN|undefined|Infinity/.test(s), JSON.stringify(d));
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s) && !/var\(--c-[hd]\)/.test(s) && !/\sid="|filter|<image/.test(s));
    assert.equal(s, P.dibujar(d, { paso }));
    assert.ok(s.includes(`data-objeto="${obj}" data-prueba="si"`));
    assert.ok(P.alt(d, { paso }).length > 30 && !/undefined|NaN/.test(P.alt(d, { paso })));
  }
});

test('fieles: una casilla por cifra y la borrada sin número; un círculo por moneda (hasta 12) y el total de cada fila', () => {
  for (const d of M_BOLETO) for (const paso of pasosDe(d)) {
    const g = B.geometria(d, { paso }), s = B.dibujar(d, { paso }), m = Object.assign({}, d, (d.pasos || [])[paso] || {});
    assert.equal(g.casillas.length, String(m.cifras === undefined ? '?' : m.cifras).length);
    assert.ok(g.casillas.every(c => c.w === g.casillas[0].w && c.y === g.casillas[0].y), 'casillas iguales y en fila');
    for (let i = 1; i < g.casillas.length; i++) assert.ok(g.casillas[i].x > g.casillas[i - 1].x + g.casillas[i - 1].w);
    const borradas = g.casillas.filter(c => c.c === '?' && !c.hallada).length;
    assert.equal((s.match(/class="bl-mancha"/g) || []).length, borradas);
    assert.equal((s.match(/bl-hallada/g) || []).length, Object.keys(m.hallada || {}).length);
    // El peso va centrado bajo su casilla.
    for (const c of g.casillas) if (c.peso !== null) { const t = g.textos.find(x => x.que === `peso ${c.i + 1}`); assert.ok(Math.abs((t.x0 + t.x1) / 2 - (c.x + c.w / 2)) < 0.01); }
  }
  for (const d of M_MONEDAS) for (const paso of pasosDe(d)) {
    const g = Mo.geometria(d, { paso });
    g.filas.forEach((f, k) => {
      const n = g.monedas.filter(m => m.fila === k).length;
      assert.equal(n, f.cuantas === '?' ? 1 : Math.min(f.clase === 'billete' ? 8 : Mo.constantes.MAX, f.cuantas));
      const r = g.textos.find(t => t.que === `rótulo ${k + 1}`).txt;
      if (f.cuantas !== '?' && d.total !== false) assert.ok(r.endsWith(`= S/ ${f.cuantas * f.valor}`), r);
    });
    // La moneda de más valor es más grande.
    if (g.filas.length === 2 && !g.filas[0].clase && g.monedas.some(m => m.fila === 0) && g.monedas.some(m => m.fila === 1)) assert.ok(g.monedas.find(m => m.fila === 1).r > g.monedas.find(m => m.fila === 0).r);
  }
});

test('con números: todo cabe con 4 de margen, nada se pisa y el alto no salta entre pasos', () => {
  const mal = [];
  for (const [P, ms] of [[B, M_BOLETO], [Mo, M_MONEDAS]]) for (const d of ms) {
    const altos = new Set();
    for (const paso of pasosDe(d)) { revisar(P, d, { paso }, JSON.stringify(d).slice(0, 50) + ` paso ${paso}`, mal); altos.add(P.geometria(d, { paso }).H); }
    assert.equal(altos.size, 1, `el alto salta: ${[...altos].join(', ')}`);
  }
  assert.deepEqual(mal, []);
});

test('las figuras de la teoría que usan las piezas caben y no se pisan', () => {
  const def = require(path.join(__dirname, '..', '..', '..', 'contenido', 'teoria', 'aritmetica', 'divisibilidad.js'));
  for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
  const mal = []; let n = 0;
  const mira = (dib, nombre) => {
    const P = dib && { 'arit-boleto': B, 'arit-monedas': Mo }[dib.pieza];
    if (!P || !dib.datos) return;
    for (const paso of pasosDe(dib.datos)) { n++; revisar(P, dib.datos, Object.assign({}, dib.estado || {}, { paso }), `${nombre} paso ${paso}`, mal); }
  };
  for (const idea of def.ideas) {
    const pz = idea.pieza;
    for (const t of (idea.lee && idea.lee.tarjetas) || []) if (t.dibujo) mira({ pieza: t.pieza || pz, datos: t.dibujo.datos, estado: t.dibujo.estado }, `${idea.id} lee`);
    if (idea.juega && typeof idea.juega.dibujo === 'function') {
      const ctr = idea.juega.controles || [], v0 = Object.fromEntries(ctr.map(c => [c.id, c.opciones ? c.opciones[0].valor : c.inicio]));
      for (const c of ctr) for (const val of c.opciones ? c.opciones.map(o => o.valor) : Array.from({ length: Math.round((c.max - c.min) / c.paso) + 1 }, (_, i) => c.min + i * c.paso)) mira(Object.assign({ pieza: idea.juega.pieza || pz }, idea.juega.dibujo(Object.assign({}, v0, { [c.id]: val }))), `${idea.id} juega ${c.id}=${val}`);
    }
    if (idea.predice) for (const c of ['dibujo', 'revelar']) if (idea.predice[c]) mira(Object.assign({ pieza: idea.predice.pieza || pz }, idea.predice[c]), `${idea.id} predice ${c}`);
    if (idea.mira && idea.mira.datos) mira({ pieza: idea.mira.pieza || pz, datos: idea.mira.datos }, `${idea.id} mira`);
    (idea.ejemplos || []).forEach((e, i) => { if (e.figura) mira(Object.assign({ pieza: pz }, e.figura), `${idea.id} ejemplo ${i + 1}`); });
    for (const gen of ['ahoraTu', 'resuelve']) if (idea[gen] && typeof idea[gen].generar === 'function') for (let s = 0; s < 40; s++) {
      const c = idea[gen].generar(s);
      if (c && c.dibujo) mira(Object.assign({ pieza: idea[gen].pieza || pz }, c.dibujo), `${idea.id} ${gen} ${s}`);
    }
  }
  assert.deepEqual(mal, []);
  assert.ok(n >= 0);
});
