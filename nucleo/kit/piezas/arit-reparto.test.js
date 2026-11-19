// Pruebas de la pieza «arit-reparto» (el paquete de doña Juana empacado en bolsitas de varios tamaños, MCD y MCM): se
// dibuja sin NaN ni colores fijos, es pura, marcada como dibujo de prueba y con su texto alternativo; es fiel (en cada
// fila hay exactamente N caramelos: bolsitas × d + sueltos; con el paquete cerrado, una sola bolsita y los sueltos que
// dicen los datos); nunca usa carmín ni verde. Con números (docs/molde-unidad.md §6): todo cabe con 4 de margen, ningún
// texto pisa a otro ni a una bolsita, y el alto no salta entre los pasos. Se revisan las figuras de la teoría.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../kit.js');
const P = require('./arit-reparto.js');

const MUESTRAS = [
  { n: 37, repartos: [{ d: 4 }, { d: 6 }], letrero: '37 caramelos' },
  { n: 61, repartos: [{ d: 4 }, { d: 6 }, { d: 10 }] },
  { n: 60, repartos: [{ d: 4 }, { d: 6 }], alto: 200 },
  { n: 59, repartos: [{ d: 3 }, { d: 12 }] },
  { cerrado: true, sobran: 1, repartos: [{ d: 4 }, { d: 6 }, { d: 10 }], letrero: 'Un paquete cerrado' },
  { cerrado: true, repartos: [{ d: 4, falta: 1 }, { d: 6, falta: 1 }, { d: 9, falta: 1 }] },
  { cerrado: true, repartos: [{ d: 4, sobran: 3 }, { d: 6, sobran: 5 }], pie: 'pie' },
  { n: 61, repartos: [{ d: 4 }, { d: 6 }, { d: 10 }], pasos: [{ repartos: [{ d: 4 }] }, { repartos: [{ d: 4 }, { d: 6 }] }, {}] },
  {},
];
const solapan = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
function revisar(d, e, nombre, mal) {
  const s = P.dibujar(d, e), g = P.geometria(d, e), { W, M } = P.constantes;
  if (/NaN|undefined|Infinity/.test(s)) { mal.push(`${nombre}: NaN o undefined`); return; }
  for (const c of [...g.objetos, ...g.textos]) if (!(c.x0 >= M - 1e-9 && c.y0 >= M - 1e-9 && c.x1 <= W - M + 1e-9 && c.y1 <= g.H - M + 1e-9)) mal.push(`${nombre}: se sale «${c.txt || c.que}»`);
  for (let i = 0; i < g.textos.length; i++) for (let j = i + 1; j < g.textos.length; j++) if (solapan(g.textos[i], g.textos[j])) mal.push(`${nombre}: se pisan «${g.textos[i].txt}» y «${g.textos[j].txt}»`);
  for (const t of g.textos) for (const o of g.objetos) if (solapan(t, o)) mal.push(`${nombre}: «${t.txt}» pisa ${o.que}`);
}

test('registrada en el kit', () => assert.equal(Kit.piezas['arit-reparto'], P));

test('sin NaN ni colores fijos, sin carmín ni verde, pura, marcada de prueba y con su texto alternativo', () => {
  for (const d of MUESTRAS) for (const paso of (d.pasos || [{}]).map((_, i) => i)) {
    const s = P.dibujar(d, { paso });
    assert.ok(!/NaN|undefined|Infinity/.test(s), JSON.stringify(d));
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s));
    assert.ok(!/var\(--c-[hd]\)/.test(s));
    assert.equal(s, P.dibujar(d, { paso }));
    assert.match(s, /data-objeto="reparto" data-prueba="si"/);
    assert.ok(P.alt(d, { paso }).length > 20);
  }
});

test('fiel: cada fila tiene los N caramelos (bolsitas × d + sueltos); el paquete cerrado no dibuja cantidades que no se dan', () => {
  for (const d of MUESTRAS) for (const paso of (d.pasos || [{}]).map((_, i) => i)) {
    const g = P.geometria(d, { paso }), s = P.dibujar(d, { paso });
    for (const f of g.filas) {
      if (g.cerrado) { assert.equal(f.bolsas.filter(b => !b.signo).length, 1); assert.equal(f.sueltos.length + f.huecos.length, f.ns + f.nf); continue; }
      assert.equal(f.bolsas.length * f.d + f.sueltos.length, d.n);
      assert.ok(f.sueltos.length < f.d, 'lo que sobra es menos que una bolsita');
    }
    if (!g.cerrado) assert.equal((s.match(/class="re-suelto"/g) || []).length, g.filas.reduce((u, f) => u + f.sueltos.length, 0));
  }
});

test('con números: todo cabe con 4 de margen, nada se pisa y el alto no salta entre pasos', () => {
  const mal = [];
  for (const d of MUESTRAS) {
    const altos = new Set();
    for (const paso of (d.pasos || [{}]).map((_, i) => i)) { revisar(d, { paso }, JSON.stringify(d).slice(0, 50) + ` paso ${paso}`, mal); altos.add(P.geometria(d, { paso }).H); }
    assert.equal(altos.size, 1);
  }
  for (let n = 10; n <= 99; n++) for (const ds of [[4, 6], [3, 5], [6, 8, 9], [2, 3]]) revisar({ n, repartos: ds.map(x => ({ d: x })) }, {}, `n ${n} ${ds}`, mal);
  assert.deepEqual(mal.slice(0, 10), []);
});

test('las figuras de la teoría que usan la pieza caben y no se pisan', () => {
  const def = require(path.join(__dirname, '..', '..', '..', 'contenido', 'teoria', 'aritmetica', 'mcd-y-mcm.js'));
  const mal = []; let n = 0;
  const mira = (dib, nombre) => {
    if (!dib || dib.pieza !== 'arit-reparto' || !dib.datos) return;
    for (const paso of (dib.datos.pasos || [{}]).map((_, i) => i)) { n++; revisar(dib.datos, Object.assign({}, dib.estado || {}, { paso }), `${nombre} paso ${paso}`, mal); }
  };
  for (const idea of def.ideas) {
    const pz = idea.pieza;
    for (const t of (idea.lee && idea.lee.tarjetas) || []) if (t.dibujo) mira({ pieza: t.pieza || pz, datos: t.dibujo.datos }, `${idea.id} lee`);
    for (let v = 10; v <= 60; v++) if (idea.id === 'mismo-resto') mira(Object.assign({ pieza: pz }, idea.juega.dibujo({ n: v })), `juego ${v}`);
    for (const c of ['dibujo', 'revelar']) mira(Object.assign({ pieza: idea.predice.pieza || pz }, idea.predice[c]), `${idea.id} predice`);
    mira({ pieza: idea.mira.pieza || pz, datos: idea.mira.datos }, `${idea.id} mira`);
    (idea.ejemplos || []).forEach((e, i) => e.figura && mira(Object.assign({ pieza: pz }, e.figura), `${idea.id} ejemplo ${i + 1}`));
  }
  assert.deepEqual(mal, []);
  assert.ok(n >= 50, `la teoría usa la pieza en ${n} figuras`);
});
