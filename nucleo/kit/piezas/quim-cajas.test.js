// Pruebas de la pieza «quim-cajas»: Hund llena una por caja antes de aparear, las flechas son las de los datos,
// los desapareados se marcan; y las comunes del kit. Con la paleta 'zne' (18 nov, Estructura atómica): flechas violetas,
// marca de desapareados en tinta, mₗ bajo cada caja, el último electrón marcado, lo que sale desde un corte y lo que llega;
// y, con números (docs/molde-unidad.md §6), todo dentro del lienzo y ningún rótulo pisado, en toda la unidad.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../kit.js');
const Teoria = require('../../teoria.js');
const P = require('./quim-cajas.js');

// Todas las figuras de «Estructura atómica» que usan una pieza (juego en toda su grilla, Lee, Predice, Mira, la regla,
// los ejemplos, «Así se resuelve», «Ahora tú» y las mesas del laboratorio).
function figurasUnidad(pieza) {
  const def = require('../../../contenido/teoria/quimica/estructura-atomica.js');
  for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
  const out = [], con = (donde, f, pz) => { const p = f && (f.pieza || pz); if (f && f.datos && p === pieza) out.push({ donde, datos: f.datos, estado: f.estado || {} }); };
  for (const i of def.ideas) {
    const d = i.id;
    for (const v of Teoria.grilla(i.juega.controles)) con(`${d} juego ${JSON.stringify(v)}`, i.juega.dibujo(v), i.juega.pieza || i.pieza);
    i.lee.tarjetas.forEach((t, k) => con(`${d} lee ${k + 1}`, t.dibujo, t.pieza));
    con(`${d} predice`, i.predice.dibujo, i.predice.pieza || i.pieza); con(`${d} revelar`, i.predice.revelar, i.predice.pieza || i.pieza);
    for (let c = 0; c <= 6; c++) con(`${d} mira corte ${c}`, { datos: i.mira.datos, estado: { corte: c } }, i.mira.pieza || i.pieza);
    if (i.regla.dibujo) con(`${d} regla`, i.regla.dibujo, i.regla.dibujo.pieza || i.mira.pieza || i.pieza);
    i.ejemplos.forEach((e, k) => con(`${d} ejemplo ${k + 1}`, e.figura));
    for (let s = 0; s < 40; s++) {
      const r = i.resuelve.generar(s), a = i.ahoraTu.generar(s);
      con(`${d} resuelve ${s}`, r.dibujo, i.resuelve.pieza || i.pieza); r.pasos.forEach((p, k) => con(`${d} resuelve ${s} paso ${k + 1}`, p.dibujo, i.resuelve.pieza || i.pieza));
      con(`${d} ahora tú ${s}`, a.dibujo, i.ahoraTu.pieza || i.pieza); if (a.solucion) con(`${d} solución ${s}`, a.solucion.dibujo, i.ahoraTu.pieza || i.pieza);
    }
  }
  for (const m of def.laboratorio) if (m.pieza === pieza) for (const v of Teoria.grilla(m.controles)) con(`mesa ${m.id} ${JSON.stringify(v)}`, m.dibujo(v), m.pieza);
  return out;
}
const solapan = (a, b, e = 0) => a.x0 < b.x1 + e && b.x0 < a.x1 + e && a.y0 < b.y1 + e && b.y0 < a.y1 + e;
// Encuadre (todo dentro con 4 de margen) y rótulos que no se pisan entre sí ni pisan las cajas o los objetos.
function revisar(g, nombre, mal, { dentroDe = () => false } = {}) {
  const { W, H, M } = g;
  for (const c of [...g.objetos.filter(o => !o.marco), ...g.textos]) if (!(c.x0 >= M - 1e-9 && c.y0 >= M - 1e-9 && c.x1 <= W - M + 1e-9 && c.y1 <= H - M + 1e-9))
    mal.push(`${nombre}: se sale «${c.txt || c.que}» (${c.x0.toFixed(1)}, ${c.y0.toFixed(1)}) – (${c.x1.toFixed(1)}, ${c.y1.toFixed(1)}) de ${W} × ${H}`);
  const t = g.textos;
  for (let i = 0; i < t.length; i++) for (let j = i + 1; j < t.length; j++) if (solapan(t[i], t[j], 1)) mal.push(`${nombre}: se pisan «${t[i].txt}» y «${t[j].txt}»`);
  for (const x of t) for (const o of g.objetos) if (!o.marco && !dentroDe(x, o) && solapan(x, o)) mal.push(`${nombre}: «${x.txt}» pisa ${o.que}`);
}

// Comunes: sin NaN ni colores fijos, texto de 14 o más, solo tokens de variable, sin ids ni scripts, pura y alto fijo.
function sana(svg) {
  assert.ok(!/NaN|undefined|null|Infinity/.test(svg), svg.match(/.{30}(NaN|undefined|null|Infinity).{10}/));
  assert.ok(!/#[0-9a-f]{3,6}\b/i.test(svg), "sin colores fijos");
  assert.ok(!/<script|\son[a-z]+\s*=|\sid=/i.test(svg));
  for (const [, t] of svg.matchAll(/font-size="([\d.]+)"/g)) assert.ok(+t >= 14, `texto de ${t}`);
  for (const [, c] of svg.matchAll(/var\(--c-([a-z])\)/g)) assert.ok(["o", "i", "h", "d", "f"].includes(c));
}
const alto = svg => svg.match(/viewBox="0 0 320 ([\d.]+)"/)[1];

const O = { filas: [{ nombre: '1s', e: 2, cajas: 1 }, { nombre: '2s', e: 2, cajas: 1 }, { nombre: '2p', e: 4, cajas: 3, desde: 1 }], desapareados: true, rotulo: '2 desapareados' };
test('se registra en el kit', () => assert.equal(Kit.piezas['quim-cajas'], P));
test('Hund: 4 electrones en 3 cajas dejan una caja llena y dos con una flecha', () => {
  assert.deepEqual(P.llenar(4, 3), [[1, 1], [1, 0], [1, 0]]);
  assert.deepEqual(P.llenar(3, 3), [[1, 0], [1, 0], [1, 0]]);
});
test('fidelidad: una flecha por electrón y dos cajas marcadas como desapareadas', () => {
  const s = P.dibujar(O, { corte: 1 });
  assert.equal((s.match(/<line x1="\d+" y1="[\d.]+" x2="\d+"[^>]*var\(--c-i\)/g) || []).length, 8);
  assert.equal((s.match(/stroke-dasharray="3 2"/g) || []).length, 2);
});
test('comunes: sana, pura, alto fijo y alt', () => {
  const s0 = P.dibujar(O, { corte: 0 }), s1 = P.dibujar(O, { corte: 1 });
  sana(s0); sana(s1); assert.equal(alto(s0), alto(s1)); assert.match(P.alt(O), /2p: 4 electrones/);
});
test('geometría: la caja y la flecha que exporta están donde las dibuja', () => {
  const s = P.dibujar(O, { corte: 1 }), g = P.geometria(O);
  const c = g.caja(2, 1);
  assert.ok(s.includes(`<rect x="${c.x}" y="${c.y}" width="${c.w}" height="${c.h}"`));
  const fl = g.flecha(2, 0, 1);
  assert.ok(s.includes(`<line x1="${fl.x}"`));
  assert.ok(fl.y > c.y && fl.y < c.y + c.h);
});

const Z = { paleta: 'zne', ml: true, desapareados: true, filas: [{ nombre: '2p', e: 4, cajas: 3 }, { nombre: '3d', e: 6, cajas: 5, sale: 1, saleDesde: 2 }],
  ultimos: [{ fila: 0, caja: 0, j: 1, desde: 1 }], rotulo: 'O y Fe³⁺' };
test("paleta 'zne': flechas violetas, desapareados en tinta, mₗ de −ℓ a +ℓ y lo de antes intacto", () => {
  const s = P.dibujar(Z, { corte: 2 });
  sana(s);
  assert.ok(!/var\(--c-i\)|var\(--c-o\)/.test(s), 'sin turquesa ni naranja: los electrones son violetas');
  assert.equal((s.match(/<line[^>]*var\(--c-f\)/g) || []).length, 10);
  assert.equal((s.match(/stroke-dasharray="3 3"/g) || []).length, 1, 'sale una flecha desde el corte 2');
  assert.equal((P.dibujar(Z, { corte: 1 }).match(/stroke-dasharray="3 3"/g) || []).length, 0);
  for (const m of ['−1', '0', '+1', '−2', '+2']) assert.ok(s.includes(`>${m}<`), m);
  assert.match(s, /class="kit-ultimo"/);
  // Desapareados: 2 en el 2p⁴ y 5 en el 3d⁵ que queda.
  assert.equal((s.match(/stroke-dasharray="3 2"/g) || []).length, 7);
  assert.ok(!P.dibujar({ paleta: 'zne', cuenta: false, filas: [{ nombre: '2p', e: 3, cajas: 3 }] }).includes('e⁻'));
  assert.ok(P.dibujar({ paleta: 'zne', filas: [{ nombre: '2p', e: 3, cajas: 3, oculto: true, vacia: true }] }).includes('>? e⁻<'));
  // Sin la paleta, lo de siempre: flechas turquesa y marca naranja.
  assert.match(P.dibujar(O, { corte: 1 }), /var\(--c-i\)/);
  assert.equal(alto(P.dibujar(Z)), String(P.alto(Z)));
});
test('encuadre y rótulos, con números, en toda la unidad', () => {
  const mal = [];
  revisar(P.marcos(Z, { corte: 2 }), 'muestra', mal);
  const figs = figurasUnidad('quim-cajas');
  assert.ok(figs.length > 200, `${figs.length} figuras`);
  for (const f of figs) { sana(P.dibujar(f.datos, f.estado)); revisar(P.marcos(f.datos, f.estado), f.donde, mal); }
  assert.deepEqual(mal.slice(0, 20), [], `${mal.length} problemas`);
});

// Ronda 2 del lector en frío (18 nov, noche): el rótulo «mₗ» junto a los números de abajo, y las flechas que entran
// recién desde un corte («Mira» de Hund decía «los tres primeros» con los cuatro dibujados).
test('ronda 2: «mₗ» rotula los números de las cajas, y fila.entran deja fuera las últimas flechas hasta su corte', () => {
  const s = P.dibujar(Z, { corte: 2 });
  assert.equal((s.match(/class="kit-txt kit-ml"[^>]*>m<tspan[^>]*>ℓ<\/tspan><\/text>/g) || []).length, 2, 'un «mₗ» por fila');
  assert.ok(!P.dibujar({ paleta: 'zne', filas: [{ nombre: '2p', e: 4, cajas: 3 }] }).includes('kit-ml'), 'sin ml, sin rótulo');
  const E = { paleta: 'zne', ml: true, desapareados: true, filas: [{ nombre: '2p', e: 4, cajas: 3, entran: { k: 1, desde: 2 } }] };
  const lineas = c => (P.dibujar(E, { corte: c }).match(/<line[^>]*var\(--c-f\)/g) || []).length;
  assert.equal(lineas(1), 3, 'en el corte 1, los tres primeros');
  assert.equal(lineas(2), 4, 'en el corte 2, el cuarto');
  // Con los tres primeros, las tres cajas van solas (punteadas) y la cuenta dice 3 e⁻.
  assert.equal((P.dibujar(E, { corte: 1 }).match(/stroke-dasharray="3 2"/g) || []).length, 3);
  assert.ok(P.dibujar(E, { corte: 1 }).includes('>3 e⁻<') && P.dibujar(E, { corte: 2 }).includes('>4 e⁻<'));
  assert.ok(P.marcos(E, { corte: 1 }).textos.some(t => t.que === 'cuenta' && t.txt === '3 e⁻'));
});
