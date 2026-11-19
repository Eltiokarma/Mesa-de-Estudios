// Pruebas de la pieza «arit-cintas» (los rollos de cinta de la promoción, MCD y MCM): se dibuja sin NaN ni colores fijos,
// es pura, marcada como dibujo de prueba y con su texto alternativo; es fiel (una sola escala para todas las cintas, un
// trozo por cada vez que entra, y lo que sobra mide justo largo − trozo × veces); nunca usa carmín ni verde. Con números
// (docs/molde-unidad.md §6): todo cabe con 4 de margen, ningún texto pisa a otro ni a una cinta, y el alto no salta entre
// los pasos de una figura. Se revisan las muestras y todas las figuras de la teoría que usan la pieza.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../kit.js');
const P = require('./arit-cintas.js');

const MUESTRAS = [
  { max: 36, cintas: [{ largo: 24, rotulo: 'Rollo de 24 m', trozo: 6, colorTrozo: 'i', marca: true, nota: [['4 trozos de '], ['6 m', 'i', 700]] }, { largo: 36, rotulo: 'Rollo de 36 m', trozo: 6, colorTrozo: 'i', nota: '6 trozos' }] },
  { max: 30, letrero: 'Rollos', cintas: [{ largo: 18, trozo: 4, colorTrozo: 'i', nota: [['sobran '], ['2 m', 'o', 700]] }, { largo: 30, trozo: 4 }], pie: 'pie' },
  { cintas: [{ largo: 24, rotulo: '24 m' }, { largo: 36, rotulo: '36 m' }, { largo: 12, pedida: true, rotulo: 'trozo' }] },
  { max: 91, compacta: true, cintas: [{ largo: 91, trozo: 35, rotulo: '91 = 2 × 35 + 21' }, { largo: 35, trozo: 21 }, { largo: 21, trozo: 14 }, { largo: 14, trozo: 7, colorTrozo: 'i', marca: true }] },
  { max: 48, filas: 4, cintas: [{ largo: 12, trozo: 4, colorTrozo: 'i' }, { largo: 16, trozo: 4, colorTrozo: 'i' }, { largo: 48, color: 'f', trozo: 12, colorTrozo: null }, { largo: 48, color: 'f', trozo: 16 }] },
  { max: 36, cintas: [{ largo: 24 }, { largo: 36 }], pasos: [{ cintas: [{ largo: 24, trozo: 6 }, { largo: 36, trozo: 6 }] }, { cintas: [{ largo: 24, trozo: 18 }, { largo: 36, trozo: 18 }], pie: 'sobra' }] },
  {},
];
const solapan = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
function revisar(d, e, nombre, mal) {
  const s = P.dibujar(d, e), g = P.geometria(d, e), { W, M } = P.constantes;
  if (/NaN|undefined|Infinity/.test(s)) { mal.push(`${nombre}: NaN o undefined`); return; }
  for (const c of [...g.objetos, ...g.textos]) if (!(c.x0 >= M - 1e-9 && c.y0 >= M - 1e-9 && c.x1 <= W - M + 1e-9 && c.y1 <= g.H - M + 1e-9)) mal.push(`${nombre}: se sale «${c.txt || c.que}»`);
  for (let i = 0; i < g.textos.length; i++) for (let j = i + 1; j < g.textos.length; j++) if (solapan(g.textos[i], g.textos[j])) mal.push(`${nombre}: se pisan «${g.textos[i].txt}» y «${g.textos[j].txt}»`);
  for (const t of g.textos) for (const o of g.objetos) if (solapan(t, o)) mal.push(`${nombre}: «${t.txt}» pisa ${o.que}`);
  for (let i = 0; i < g.objetos.length; i++) for (let j = i + 1; j < g.objetos.length; j++) if (solapan(g.objetos[i], g.objetos[j])) mal.push(`${nombre}: se pisan ${g.objetos[i].que} y ${g.objetos[j].que}`);
}

test('registrada en el kit', () => assert.equal(Kit.piezas['arit-cintas'], P));

test('sin NaN ni colores fijos, sin carmín ni verde, pura, marcada de prueba y con su texto alternativo', () => {
  for (const d of MUESTRAS) for (const paso of (d.pasos || [{}]).map((_, i) => i)) {
    const s = P.dibujar(d, { paso });
    assert.ok(!/NaN|undefined|Infinity/.test(s), JSON.stringify(d));
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s), 'sin colores fijos');
    assert.ok(!/var\(--c-[hd]\)/.test(s), 'sin carmín ni verde');
    assert.ok(!/\sid="|filter|<image/.test(s));
    assert.equal(s, P.dibujar(d, { paso }), 'pura');
    assert.match(s, /data-objeto="cintas" data-prueba="si"/);
    assert.match(s, /^<svg [^>]*viewBox="0 0 320 \d+"/);
    const a = P.alt(d, { paso });
    assert.ok(a.length > 20 && !/undefined|NaN/.test(a), a);
  }
});

test('fiel: una sola escala; un trozo por vez que entra; lo que sobra es largo − trozo × veces', () => {
  for (const d of MUESTRAS) for (const paso of (d.pasos || [{}]).map((_, i) => i)) {
    const g = P.geometria(d, { paso });
    for (const f of g.filas.filter(x => x.visible && !x.pedida)) {
      assert.ok(Math.abs((f.x1 - f.x0) - f.largo * g.esc) < 1e-9, 'el largo dibujado es el largo por la escala');
      const t = f.c.trozo;
      if (!t) { assert.equal(f.trozos.length, 0); continue; }
      assert.equal(f.trozos.length, Math.floor(f.largo / t));
      for (const z of f.trozos) assert.ok(Math.abs((z.x1 - z.x0) - t * g.esc) < 1e-9, 'cada trozo mide lo mismo');
      const r = f.largo - t * Math.floor(f.largo / t);
      if (r) assert.ok(Math.abs((f.sobra.x1 - f.sobra.x0) - r * g.esc) < 1e-9); else assert.equal(f.sobra, null);
      const s = P.dibujar(d, { paso });
      assert.ok((s.match(/class="ci-trozo"/g) || []).length >= f.trozos.length);
    }
  }
});

test('con números: todo cabe con 4 de margen, nada se pisa y el alto no salta entre pasos', () => {
  const mal = [];
  for (const d of MUESTRAS) {
    const altos = new Set();
    for (const paso of (d.pasos || [{}]).map((_, i) => i)) { revisar(d, { paso }, JSON.stringify(d).slice(0, 50) + ` paso ${paso}`, mal); altos.add(P.geometria(d, { paso }).H); }
    assert.equal(altos.size, 1);
  }
  assert.deepEqual(mal, []);
});

test('las figuras de la teoría que usan la pieza caben y no se pisan', () => {
  const def = require(path.join(__dirname, '..', '..', '..', 'contenido', 'teoria', 'aritmetica', 'mcd-y-mcm.js'));
  const mal = []; let n = 0;
  const mira = (dib, nombre) => {
    if (!dib || dib.pieza !== 'arit-cintas' || !dib.datos) return;
    for (const paso of (dib.datos.pasos || [{}]).map((_, i) => i)) { n++; revisar(dib.datos, Object.assign({}, dib.estado || {}, { paso }), `${nombre} paso ${paso}`, mal); }
  };
  for (const idea of def.ideas) {
    const pz = idea.pieza;
    for (const t of (idea.lee && idea.lee.tarjetas) || []) if (t.dibujo) mira({ pieza: t.pieza || pz, datos: t.dibujo.datos }, `${idea.id} lee`);
    for (const c of ['dibujo', 'revelar']) mira(Object.assign({ pieza: idea.predice.pieza || pz }, idea.predice[c]), `${idea.id} predice`);
    mira({ pieza: idea.mira.pieza || pz, datos: idea.mira.datos }, `${idea.id} mira`);
    if (idea.regla.dibujo) mira(Object.assign({ pieza: pz }, idea.regla.dibujo), `${idea.id} regla`);
    (idea.ejemplos || []).forEach((e, i) => e.figura && mira(Object.assign({ pieza: pz }, e.figura), `${idea.id} ejemplo ${i + 1}`));
  }
  assert.deepEqual(mal, []);
  assert.ok(n >= 8, `la teoría usa la pieza en ${n} figuras`);
});
