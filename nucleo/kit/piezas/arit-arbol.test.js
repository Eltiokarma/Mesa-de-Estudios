// Pruebas de la pieza «arit-arbol» (el árbol de cortes): se dibuja sin NaN ni colores fijos, es pura, marcada como dibujo de
// prueba y con su texto alternativo; es fiel (cada corte multiplica a lo de arriba, las hojas con aro son primos y su
// producto es N, sea cual sea el primer corte; un corte que no cierra deja justo N mód d); nunca usa carmín ni verde.
// Con números (docs/molde-unidad.md §6): todo cabe con 4 de margen y ningún nodo ni rótulo pisa a otro.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../kit.js');
const P = require('./arit-arbol.js');
const esPrimo = x => x > 1 && Array.from({ length: x - 2 }, (_, i) => i + 2).every(k => x % k);
const solapan = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
function revisar(d, e, nombre, mal) {
  const s = P.dibujar(d, e), g = P.geometria(d, e), { W, M } = P.constantes;
  if (/NaN|undefined|Infinity/.test(s)) { mal.push(`${nombre}: NaN`); return; }
  for (const c of [...g.objetos, ...g.textos]) if (!(c.x0 >= M - 1e-9 && c.y0 >= M - 1e-9 && c.x1 <= W - M + 1e-9 && c.y1 <= g.H - M + 1e-9)) mal.push(`${nombre}: se sale «${c.txt || c.que}»`);
  const todo = [...g.objetos, ...g.textos];
  for (let i = 0; i < todo.length; i++) for (let j = i + 1; j < todo.length; j++) if (solapan(todo[i], todo[j])) mal.push(`${nombre}: se pisan «${todo[i].txt || todo[i].que}» y «${todo[j].txt || todo[j].que}»`);
}
const N_ = [12, 18, 24, 30, 36, 48, 60, 64, 72, 81, 84, 90, 96, 100, 120, 126, 180, 210, 360];

test('registrada en el kit', () => assert.equal(Kit.piezas['arit-arbol'], P));

test('fiel: cada corte multiplica a lo de arriba; las hojas son primos y su producto es N con cualquier primer corte', () => {
  const prod = nd => (nd.hijos ? prod(nd.hijos[0]) * prod(nd.hijos[1]) : nd.n);
  const hojas = nd => (nd.hijos ? [...hojas(nd.hijos[0]), ...hojas(nd.hijos[1])] : [nd.n]);
  const corteOk = nd => !nd.hijos || (nd.hijos[0].n * nd.hijos[1].n === nd.n && nd.hijos.every(corteOk));
  for (const N of N_) {
    let ref = null;
    for (const d of [0, 2, 3, 4, 5, 6, 10]) {
      const a = P.arbol(N, d);
      if (d && N % d) { assert.deepEqual(a, { n: N, sobra: { d, r: N % d } }); continue; }
      assert.ok(corteOk(a), `${N} con ${d}`);
      assert.equal(prod(a), N);
      const hs = hojas(a).sort((x, y) => x - y);
      assert.ok(hs.every(esPrimo), `${N}: ${hs}`);
      if (ref) assert.deepEqual(hs, ref, `${N}: otro primer corte, otras hojas`);
      ref = hs;
      // En el dibujo: tantos aros como hojas primas.
      assert.equal((P.dibujar({ arboles: [a] }).match(/class="ar-primo"/g) || []).length, hs.length);
    }
  }
  // Con profundidad 0 solo se ven las raíces, sin aros.
  assert.ok(!/ar-primo/.test(P.dibujar({ arboles: [P.arbol(8), P.arbol(15)], profundidad: 0 })));
});

test('sin NaN ni colores fijos, sin carmín ni verde, pura, de prueba y con alt; todo cabe y nada se pisa', () => {
  const mal = [], muestras = [];
  for (const N of N_) for (const d of [0, 2, 3, 4, 5, 6, 10]) muestras.push({ arboles: [P.arbol(N, d)], pies: [[[`${N}`]]], letrero: 'Cortes', pie: 'pie' });
  muestras.push({ arboles: [P.arbol(8, 2), P.arbol(15, 3)], pies: [[['8 = 2 × 2 × 2']], [['15 = 3 × 5']]] });
  muestras.push({ arboles: [P.arbol(90, 9), P.arbol(84, 4)] });
  muestras.push({ arboles: [P.arbol(7), P.arbol(21, 3)], profundidad: 0 });
  muestras.push({ arboles: [P.arbol(64, 3)], alto: 250 });
  for (const d of muestras) {
    const s = P.dibujar(d);
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s) && !/var\(--c-[hd]\)/.test(s) && !/\sid="/.test(s));
    assert.equal(s, P.dibujar(d));
    assert.match(s, /data-objeto="arbol" data-prueba="si"/);
    const a = P.alt(d); assert.ok(a.length > 15 && !/undefined|NaN/.test(a), a);
    revisar(d, {}, JSON.stringify(d).slice(0, 50), mal);
  }
  assert.deepEqual(mal, []);
});

test('las figuras de la teoría que usan la pieza caben y no se pisan', () => {
  let def;
  try { def = require(path.join(__dirname, '..', '..', '..', 'contenido', 'teoria', 'aritmetica', 'numeros-primos-y-divisores.js')); } catch (e) { return; }
  const mal = [];
  const ver = (dib, pz, nombre) => { if (dib && (dib.pieza || pz) === 'arit-arbol') revisar(dib.datos, dib.estado || {}, nombre, mal); };
  for (const idea of def.ideas) {
    (idea.lee ? idea.lee.tarjetas : []).forEach((t, i) => t.dibujo && ver({ pieza: t.pieza || idea.pieza, datos: t.dibujo.datos, estado: t.dibujo.estado }, null, `${idea.id} lee ${i}`));
    if (idea.juega && (idea.juega.pieza || idea.pieza) === 'arit-arbol') {
      const [c1, c2] = idea.juega.controles;
      for (const a of c1.opciones) for (const b of c2.opciones) ver(idea.juega.dibujo({ [c1.id]: a.valor, [c2.id]: b.valor }), 'arit-arbol', `${idea.id} juego ${a.valor} ${b.valor}`);
    }
    if (idea.predice) { ver(idea.predice.dibujo, idea.predice.pieza || idea.pieza, `${idea.id} predice`); ver(idea.predice.revelar, idea.predice.pieza || idea.pieza, `${idea.id} revelar`); }
    if (idea.mira && (idea.mira.pieza || idea.pieza) === 'arit-arbol') idea.mira.pasos.forEach((p, i) => revisar(idea.mira.datos, p.estado, `${idea.id} mira ${i}`, mal));
    if (idea.regla && idea.regla.dibujo) ver(idea.regla.dibujo, idea.pieza, `${idea.id} regla`);
    (idea.ejemplos || []).forEach((e, i) => ver(e.figura, idea.pieza, `${idea.id} ejemplo ${i + 1}`));
  }
  assert.deepEqual(mal, []);
});
