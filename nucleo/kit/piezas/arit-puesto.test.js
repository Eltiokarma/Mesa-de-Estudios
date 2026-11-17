// Pruebas de la pieza «arit-puesto» (el puesto de caramelos de doña Juana): se dibuja sin NaN ni colores fijos, es pura,
// de alto fijo, marcada como dibujo de prueba y con su texto alternativo; es fiel (cada bolsita lleva sus n caramelos,
// cada caja sus n bolsitas, cada cajón sus n cajas, y el montón tiene los caramelos que dicen los datos); nunca usa el
// carmín. Con números (no a ojo; docs/molde-unidad.md §6): todo cabe en el lienzo con 4 de margen, ningún texto pisa a
// otro ni a un objeto (el pedido, la etiqueta, los que llegan), y el número de la etiqueta queda dentro de la etiqueta.
// Se revisan las muestras de abajo y todas las figuras de la teoría que usan la pieza (Lee, el juego en toda su grilla,
// Predice, «Mira» paso a paso, ejemplos, «Así se resuelve» y «Ahora tú» en 120 semillas), de las cinco ideas.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../kit.js');
const P = require('./arit-puesto.js');

const MUESTRAS = [
  { n: 5, bolsitas: 2, sueltos: 3, regla: 1, rotulos: true, etiqueta: { cifras: '23' } },
  { n: 5, bolsitas: 4, sueltos: 4, llega: 1, regla: 2, rotulos: true, etiqueta: { cifras: '?' } },
  { n: 5, cajas: 1, ceros: true, regla: 2, rotulos: true, etiqueta: { cifras: '100' } },
  { n: 4, sueltos: 38, regla: 2, rotulos: { sueltos: [['38 caramelos', 'f', 700]] }, etiqueta: { cifras: '?' } },
  { n: 9, bolsitas: 8, sueltos: 8, regla: 1, rotulos: true },
  { n: 7, cerrado: true, regla: 1, etiqueta: { cifras: '42' } },
  { n: 5, bolsitas: 4, sueltos: 5, juntar: 'sueltos', regla: 2, rotulos: true },
  { n: 5, bolsitas: 5, ceros: true, juntar: 'bolsitas', regla: 2, rotulos: true },
  { n: 3, cajones: 2, cajas: 2, bolsitas: 2, sueltos: 2, regla: 3, rotulos: true, etiqueta: { cifras: '2222' } },
  { n: 6, cajones: 5, cajas: 5, bolsitas: 5, sueltos: 5, llega: 1, ceros: true, regla: 3, rotulos: true, etiqueta: { cifras: '?' } },
  { n: 5, sueltos: 80, rotulos: { sueltos: [['80 caramelos', 'f', 700]] }, regla: 2, etiqueta: { cifras: '?' } },
  { sueltos: 45, rotulos: { sueltos: [['45 caramelos', 'f', 700]] }, regla: [[['1 bolsita = '], ['?', 'i', 700], [' caramelos']]], etiqueta: { cifras: '?', base: '?' } },
  { n: 4, cajas: 2, bolsitas: 3, sueltos: 3, llega: 10, regla: 2, rotulos: true, etiqueta: { cifras: '?' } },
  {},
];

// Caja de un texto: de y − 0,8·tam a y + 0,25·tam (y es la línea base).
const solapan = (a, b, e = 0) => a.x0 < b.x1 + e && b.x0 < a.x1 + e && a.y0 < b.y1 + e && b.y0 < a.y1 + e;
function revisar(d, e, nombre, mal) {
  const s = P.dibujar(d, e), g = P.geometria(d, e), { W, H, M } = P.constantes;
  if (/NaN|undefined|Infinity/.test(s)) { mal.push(`${nombre}: NaN o undefined`); return; }
  for (const c of [...g.objetos, ...g.textos, ...g.cajas]) if (!(c.x0 >= M - 1e-9 && c.y0 >= M - 1e-9 && c.x1 <= W - M + 1e-9 && c.y1 <= H - M + 1e-9))
    mal.push(`${nombre}: se sale «${c.txt || c.que}» (${c.x0.toFixed(1)}, ${c.y0.toFixed(1)}) – (${c.x1.toFixed(1)}, ${c.y1.toFixed(1)})`);
  const t = g.textos;
  for (let i = 0; i < t.length; i++) for (let j = i + 1; j < t.length; j++) if (solapan(t[i], t[j], 1)) mal.push(`${nombre}: se pisan «${t[i].txt}» y «${t[j].txt}»`);
  for (const x of t) for (const o of g.objetos) if (solapan(x, o)) mal.push(`${nombre}: «${x.txt}» pisa ${o.que}`);
  // Los objetos del pedido no se pisan entre sí (cada grupo en su lugar), salvo los que llegan, que van encima.
  const ob = g.objetos.filter(o => o.que !== 'etiqueta');
  for (let i = 0; i < ob.length; i++) for (let j = i + 1; j < ob.length; j++) if (solapan(ob[i], ob[j], -0.5)) mal.push(`${nombre}: se pisan ${ob[i].que} y ${ob[j].que}`);
  const etq = g.objetos.find(o => o.que === 'etiqueta');
  for (const c of g.cajas.filter(x => x.dentro === 'etiqueta')) if (!(etq && c.x0 >= etq.x0 + 3 && c.x1 <= etq.x1 - 3 && c.y0 >= etq.y0 + 3 && c.y1 <= etq.y1 - 2)) mal.push(`${nombre}: el número no cabe en la etiqueta`);
  // Nada del pedido sube hasta el letrero o la etiqueta.
  const arriba = Math.max(0, ...g.textos.filter(x => x.que === 'regla').map(x => x.y1), etq ? etq.y1 : 0);
  for (const o of g.objetos.filter(x => x.que !== 'etiqueta')) if (o.y0 < arriba - 1e-9) mal.push(`${nombre}: ${o.que} sube hasta el letrero o la etiqueta`);
}

test('registrada en el kit', () => assert.equal(Kit.piezas['arit-puesto'], P));

test('sin NaN ni colores fijos ni carmín, pura, de alto fijo, marcada de prueba y con su texto alternativo', () => {
  const altos = new Set();
  for (const d of MUESTRAS) {
    const s = P.dibujar(d);
    assert.ok(!/NaN|undefined|Infinity/.test(s), JSON.stringify(d));
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s), 'sin colores fijos');
    assert.ok(!/var\(--c-h\)/.test(s), 'sin carmín: es de los ángulos');
    assert.ok(!/\sid="|filter|<image/.test(s), 'sin ids, filtros ni imágenes');
    assert.equal(s, P.dibujar(d), 'pura');
    assert.match(s, /data-objeto="puesto" data-prueba="si"/);
    altos.add(s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)[0]);
    assert.ok(P.alt(d).length > 30 && !/undefined|NaN/.test(P.alt(d)), P.alt(d));
  }
  assert.deepEqual([...altos], ['viewBox="0 0 320 250"']);
});

// Cuenta los caramelos (dos arcos por caramelo), las mini bolsitas (dos Q cada una) y las mini cajas de un trozo de SVG.
const caramelos = s => ((s.match(/A\d/g) || []).length) / 2;
test('fiel: cada bolsita lleva n caramelos, cada caja n bolsitas, cada cajón n cajas; el montón, los que dicen los datos', () => {
  for (let n = 2; n <= 9; n++) {
    const sb = P.dibujar({ n, bolsitas: 1 }), bolsa = sb.match(/<g class="ar-bolsita">.*?<\/g>/)[0];
    assert.equal(caramelos(bolsa), n, `bolsita de ${n}`);
    const sc = P.dibujar({ n, cajas: 1 }), cj = sc.match(/<g class="ar-caja">.*?<\/g>/)[0];
    assert.equal((cj.match(/Q/g) || []).length / 2, n, `caja de ${n}`);
    const sk = P.dibujar({ n, cajones: 1 }), cn = sk.match(/<g class="ar-cajon">.*?<\/g><\/g>|<g class="ar-cajon">.*?<\/g>/)[0];
    assert.equal((cn.match(/width="12" height="15"/g) || []).length / 2, n, `cajón de ${n}`);
  }
  for (const k of [1, 5, 6, 7, 11, 38, 80]) {
    const s = P.dibujar({ n: 5, sueltos: k }), ped = s.match(/<g class="ar-pedido"[^>]*>(.*?)<\/g><text|<g class="ar-pedido"[^>]*>(.*)/)[0];
    assert.equal(caramelos(ped.split('<g class="ar-llega">')[0]), k, `montón de ${k}`);
  }
  // Los que llegan se dibujan aparte, también contados.
  const s = P.dibujar({ n: 5, sueltos: 4, llega: 7 }), ll = s.match(/<g class="ar-llega">.*?<\/g>/)[0];
  assert.equal(caramelos(ll), 7);
});

test('colores: la base (bolsita, caja, cajón y subíndice) turquesa; las cifras de la etiqueta naranja; lo que se pide, en tinta', () => {
  const s = P.dibujar({ n: 5, cajas: 1, bolsitas: 2, sueltos: 3, rotulos: true, etiqueta: { cifras: '123' } });
  assert.match(s, /class="ar-bolsita"><path[^>]*stroke="var\(--c-i\)"/);
  assert.match(s, /class="ar-caja">.*stroke="var\(--c-i\)"/);
  assert.match(s, /<tspan fill="var\(--c-o\)">123<\/tspan><tspan fill="var\(--c-i\)"[^>]*>\(5\)<\/tspan>/);
  assert.match(s, /<tspan fill="var\(--c-o\)" font-weight="700">2<\/tspan><tspan fill="currentColor"> bolsitas<\/tspan>/);
  const p = P.dibujar({ n: 5, bolsitas: 2, etiqueta: { cifras: '?' } });
  assert.match(p, /<tspan fill="currentColor">\?<\/tspan>/, 'lo que se pide va con «?» en tinta');
  assert.ok(!/var\(--c-f\)/.test(p), 'nada en violeta si no se da');
  const t = P.dibujar({ n: 5, bolsitas: 2, sueltos: 1, rotulos: true, colorCifras: false });
  assert.ok(!/var\(--c-o\)/.test(t), 'con colorCifras: false, las cantidades en tinta');
});

test('pasos de «Mira» y escala fija: el pedido cambia con el paso y no cambia de tamaño', () => {
  const d = { n: 5, escala: 0.9, regla: 2, pasos: [{ bolsitas: 4, sueltos: 4 }, { bolsitas: 4, sueltos: 5 }, { bolsitas: 5 }] };
  assert.notEqual(P.dibujar(d, { paso: 0 }), P.dibujar(d, { paso: 1 }));
  const esc = [0, 1, 2].map(k => P.geometria(d, { paso: k }).s);
  assert.deepEqual(esc, [0.9, 0.9, 0.9]);
  assert.equal(P.geometria(d, { paso: 9 }).d.bolsitas, 5, 'un paso de más se queda en el último');
});

test('muestras: todo cabe con 4 de margen y ningún texto pisa a otro ni a un objeto', () => {
  const mal = [];
  for (const d of MUESTRAS) revisar(d, {}, JSON.stringify(d).slice(0, 70), mal);
  assert.deepEqual(mal, []);
});

test('todas las figuras de la teoría que usan la pieza: caben y sus textos no se pisan', () => {
  const U = require(path.join(__dirname, '../../../contenido/teoria/aritmetica/numeracion.js'));
  const Teoria = require('../../teoria.js');
  const figs = [], mal = [];
  const toma = (nombre, dib, pieza) => { if (dib && dib.datos && pieza === 'arit-puesto') figs.push([nombre, dib.datos, dib.estado || {}]); };
  for (const idea of U.ideas) {
    const pz = idea.pieza;
    for (const [k, t] of ((idea.lee && idea.lee.tarjetas) || []).entries()) toma(`${idea.id} lee ${k + 1}`, t.dibujo, t.pieza || pz);
    const j = idea.juega;
    for (const v of Teoria.grilla(j.controles || [])) toma(`${idea.id} juego ${JSON.stringify(v)}`, j.dibujo(v), j.pieza || pz);
    toma(`${idea.id} predice`, idea.predice.dibujo, idea.predice.pieza || pz);
    toma(`${idea.id} revelar`, idea.predice.revelar, idea.predice.pieza || pz);
    idea.mira.pasos.forEach((ps, i) => toma(`${idea.id} mira ${i + 1}`, { datos: idea.mira.datos, estado: Object.assign({}, idea.mira.base || {}, ps.estado || {}) }, idea.mira.pieza || pz));
    for (const [k, e] of (idea.ejemplos || []).entries()) if (e.figura) toma(`${idea.id} ejemplo ${k + 1}`, e.figura, e.figura.pieza);
    for (let s = 0; s < 120; s++) {
      if (idea.resuelve) { const c = idea.resuelve.generar(s); toma(`${idea.id} resuelve ${s}`, c.dibujo, idea.resuelve.pieza || pz); for (const x of c.pasos) toma(`${idea.id} resuelve ${s}`, x.dibujo, idea.resuelve.pieza || pz); }
      const a = idea.ahoraTu.generar(s); toma(`${idea.id} ahora tú ${s}`, a.dibujo, idea.ahoraTu.pieza || pz);
    }
  }
  assert.ok(figs.length > 200, `${figs.length} figuras`);
  for (const [nombre, d, e] of figs) revisar(d, e, nombre, mal);
  assert.deepEqual(mal.slice(0, 20), []);
  // El juego no cambia de escala entre un caso y otro (la bolsita no salta de tamaño al mover un control). En la idea 3
  // la escala es fija para cada montón (caramelos y bolsita): no cambia entre una ronda y otra.
  const grupos = new Map();
  for (const [nombre, d, e] of figs.filter(f => / juego /.test(f[0]))) {
    const [id, v] = [nombre.split(' juego ')[0], JSON.parse(nombre.split(' juego ')[1])];
    const k = id === 'cambio-base' ? `${id} ${v.n},${v.b}` : id;
    if (!grupos.has(k)) grupos.set(k, new Set());
    grupos.get(k).add(P.geometria(d, e).s);
  }
  assert.ok(grupos.size > 4);
  for (const [k, esc] of grupos) assert.equal(esc.size, 1, `${k}: ${[...esc].join(', ')}`);
});
