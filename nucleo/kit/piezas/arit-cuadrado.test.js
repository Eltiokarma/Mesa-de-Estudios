// Pruebas de la pieza «arit-cuadrado» (la bandeja cuadrada de doña Juana, «Potenciación y radicación»): se dibuja sin NaN
// ni colores fijos, es pura, marcada como dibujo de prueba y con su texto alternativo; es fiel (k × k llenos, los que
// sobran en el borde de la siguiente, a lo más 2k, y los que faltan completan 2k + 1; una sola escala); nunca usa verde.
// Con números (docs/molde-unidad.md §6): todo cabe con 4 de margen, ninguna bandeja pisa a otra ni a un rótulo, ningún
// rótulo pisa a otro y cada caramelo queda dentro de su bandeja. Se revisan las muestras y todas las figuras de la teoría
// que usan la pieza.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../kit.js');
const P = require('./arit-cuadrado.js');

const rot = t => [[t]];
const MUESTRAS = [
  { bandejas: [{ k: 6 }] }, { bandejas: [{ k: 6, sobran: 5 }], alto: 240 }, { bandejas: [{ k: 1, sobran: 2 }] },
  { bandejas: [{ k: 7, sobran: 14, rotulo: rot('7 × 7'), pie: rot('sobran 14') }], alto: 240 },
  { bandejas: [{ filas: 8, porFila: 9, rotulo: [['8 filas de 9']] }], letrero: [['72 caramelos']] },
  { bandejas: [{ k: 3 }, { k: 4 }, { k: 5, siguiente: true }], alto: 200 },
  { bandejas: [{ k: 12 }], alto: 240 }, { bandejas: [{ filas: 1, porFila: 2 }] }, { bandejas: [{ k: 9, sobran: 18 }], mudo: true },
  { bandejas: [{ k: 2 }], pasos: [{ bandejas: [{ k: 2 }] }, { bandejas: [{ k: 2, sobran: 3, pie: rot('pie') }] }] },
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
  for (const b of g.bandejas) for (const l of b.lugares) if (l.x - 0.47 * b.s < b.caja.x || l.x + 0.47 * b.s > b.caja.x + b.caja.w || l.y - 0.3 * b.s < b.caja.y || l.y + 0.3 * b.s > b.caja.y + b.caja.h) mal.push(`${nombre}: un caramelo se sale de su bandeja`);
}

test('registrada en el kit', () => assert.equal(Kit.piezas['arit-cuadrado'], P));

test('sin NaN ni colores fijos, sin verde, pura, marcada de prueba y con su texto alternativo', () => {
  for (const d of MUESTRAS) for (const paso of (d.pasos || [{}]).map((_, i) => i)) {
    const s = P.dibujar(d, { paso });
    assert.ok(!/NaN|undefined|Infinity/.test(s), JSON.stringify(d));
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s), 'sin colores fijos');
    assert.ok(!/var\(--c-d\)/.test(s), 'sin verde');
    assert.ok(!/\sid="|filter|<image/.test(s));
    assert.equal(s, P.dibujar(d, { paso }), 'pura');
    assert.match(s, /data-objeto="bandeja-cuadrada" data-prueba="si"/);
    assert.match(s, /^<svg [^>]*viewBox="0 0 320 \d+"/);
    const a = P.alt(d, { paso });
    assert.ok(a.length > 20 && !/undefined|NaN/.test(a), a);
  }
});

test('fiel: k × k llenos, los que sobran en el borde (a lo más 2k), los que faltan completan 2k + 1, una sola escala', () => {
  for (let N = 1; N <= 230; N++) {
    let k = 1; while ((k + 1) * (k + 1) <= N) k++;
    const r = N - k * k, g = P.geometria({ bandejas: [{ k, sobran: r, siguiente: true }], alto: 240 });
    const ls = g.bandejas[0].lugares, cuenta = t => ls.filter(l => l.tipo === t).length;
    assert.equal(cuenta('lleno'), k * k, `N = ${N}`);
    assert.equal(cuenta('sobra'), r, `N = ${N}`);
    assert.equal(cuenta('sobra') + cuenta('falta'), 2 * k + 1, `N = ${N}: el borde de la siguiente`);
    assert.equal(cuenta('lleno') + cuenta('sobra'), N, `N = ${N}: cada caramelo dibujado`);
    // La esquina es lo último que se llena: con r ≤ 2k siempre queda vacía.
    assert.equal(ls.find(l => l.i === k && l.j === k).tipo, 'falta');
  }
  assert.equal(P.geometria({ bandejas: [{ k: 3, sobran: 9 }] }).bandejas[0].lugares.filter(l => l.tipo === 'sobra').length, 6, 'nunca más de 2k');
  const g = P.geometria({ bandejas: [{ k: 3 }, { k: 4 }, { k: 5, siguiente: true }] });
  assert.ok(g.bandejas.every(b => b.s === g.s), 'una sola escala');
  assert.equal(P.geometria({ bandejas: [{ filas: 8, porFila: 9 }] }).bandejas[0].lugares.length, 72);
});

test('con alto fijo, el alto no cambia con N', () => {
  const alto = k => P.geometria({ bandejas: [{ k, sobran: k }], alto: 240 }).H;
  for (let k = 1; k <= 12; k++) assert.equal(alto(k), 240);
});

test('encuadre y rótulos con números: muestras', () => {
  const mal = [];
  MUESTRAS.forEach((d, i) => (d.pasos || [{}]).forEach((_, paso) => revisar(d, { paso }, `muestra ${i}, paso ${paso}`, mal)));
  for (let N = 2; N <= 200; N++) { let k = 1; while ((k + 1) * (k + 1) <= N) k++; revisar({ bandejas: [{ k, sobran: N - k * k, siguiente: true, rotulo: [[`${k} × ${k}`]], pie: [['sobran ', null], [String(N - k * k), 'h', 700]] }], alto: 240 }, {}, `N = ${N}`, mal); }
  assert.deepEqual(mal, []);
});

test('encuadre y rótulos con números: todas las figuras de la teoría que usan la pieza', () => {
  const def = require(path.join(__dirname, '../../../contenido/teoria/aritmetica/potenciacion-y-radicacion.js'));
  const figs = [];
  const mirar = (x, donde) => {
    if (!x || typeof x !== 'object') return;
    if (Array.isArray(x)) { x.forEach((y, i) => mirar(y, `${donde}[${i}]`)); return; }
    if (x.pieza === 'arit-cuadrado' && x.datos) figs.push([x, donde]);
    else if (x.datos && x.datos.bandejas && !x.pieza) figs.push([x, donde]);
    for (const [k, y] of Object.entries(x)) if (k !== 'datos' && typeof y === 'object') mirar(y, `${donde}.${k}`);
  };
  mirar(def, 'unidad');
  for (const idea of def.ideas) {
    const j = idea.juega;
    if (j && (j.pieza || idea.pieza) === 'arit-cuadrado') {
      const ids = j.controles.map(c => c.id), rangos = j.controles.map(c => { const o = []; for (let x = c.min; x <= c.max + 1e-9; x += c.paso) o.push(+x.toFixed(4)); return o; });
      const combos = rangos.reduce((acc, r, i) => acc.flatMap(v => r.map(x => Object.assign({}, v, { [ids[i]]: x }))), [{}]);
      for (const v of combos) { const f = j.dibujo(v); figs.push([f, `${idea.id} juega ${JSON.stringify(v)}`]); }
    }
  }
  const mal = [];
  for (const [f, donde] of figs) (f.datos.pasos || [{}]).forEach((_, paso) => revisar(f.datos, Object.assign({}, f.estado || {}, { paso }), donde, mal));
  assert.deepEqual(mal, []);
});
