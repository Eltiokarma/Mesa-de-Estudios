// Pruebas de la pieza «arit-boletos» (la plancha de boletos de la rifa de la promoción): se dibuja sin NaN ni colores
// fijos, es pura, marcada como dibujo de prueba y con su texto alternativo; es fiel (un boleto por número, todos del mismo
// tamaño, premiados solo los múltiplos de d, grupos de exactamente d boletos, y sobran los que van después del último
// premiado); nunca usa carmín ni verde; sin premio pedido no marca nada (Predice). Con números (docs/molde-unidad.md
// §6): todo cabe con 4 de margen, cada número cabe en su boleto, ningún boleto pisa a otro y ni el cartel ni el pie
// pisan la plancha. El alto no salta entre los pasos de una misma figura. Se revisan las muestras y todas las figuras de
// la teoría que usan la pieza.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../kit.js');
const P = require('./arit-boletos.js');

const MUESTRAS = [
  { desde: 1, hasta: 50, premio: 6, marcar: false, letrero: [['Premio: múltiplos de '], ['6', 'i', 700]] },
  { desde: 1, hasta: 50, premio: 6, grupos: true, sobran: true, letrero: [['Premio: múltiplos de '], ['6', 'i', 700]], pie: [['50 = 6 × 8 + 2: hay '], ['8', 'f', 700], [' premios']] },
  { desde: 1, hasta: 24, columnas: 8, premio: 4 },
  { desde: 1, hasta: 100, premio: 8, marcar: 3 },
  { desde: 20, hasta: 70, premio: 6, grupos: true, sobran: true },
  { desde: 95, hasta: 112, columnas: 6, premio: 7, pie: 'boletos del 95 al 112' },
  { desde: 1, hasta: 30 }, {},
  { desde: 1, hasta: 50, premio: 6, letrero: 'Rifa de la promoción', pasos: [{ marcar: false }, { marcar: 1 }, { marcar: true }, { grupos: true, pie: '8 grupos completos' }, { grupos: true, sobran: true, pie: 'sobran 2 boletos' }] },
];
const solapan = (a, b, e = 0) => a.x0 < b.x1 - e && b.x0 < a.x1 - e && a.y0 < b.y1 - e && b.y0 < a.y1 - e;
function revisar(d, e, nombre, mal) {
  const s = P.dibujar(d, e), g = P.geometria(d, e), { W, M } = P.constantes, H = g.H;
  if (/NaN|undefined|Infinity/.test(s)) { mal.push(`${nombre}: NaN o undefined`); return; }
  for (const c of [...g.objetos, ...g.textos]) if (!(c.x0 >= M - 1e-9 && c.y0 >= M - 1e-9 && c.x1 <= W - M + 1e-9 && c.y1 <= H - M + 1e-9))
    mal.push(`${nombre}: se sale «${c.txt || c.que}» (${c.x0.toFixed(1)}, ${c.y0.toFixed(1)}) – (${c.x1.toFixed(1)}, ${c.y1.toFixed(1)}) con H = ${H}`);
  const bol = g.objetos.filter(o => /^boleto/.test(o.que)), otros = g.objetos.filter(o => !/^boleto/.test(o.que));
  for (let i = 0; i < bol.length; i++) for (let j = i + 1; j < bol.length; j++) if (solapan(bol[i], bol[j])) mal.push(`${nombre}: se pisan ${bol[i].que} y ${bol[j].que}`);
  for (const o of otros) for (const b of bol) if (solapan(o, b)) mal.push(`${nombre}: ${o.que} pisa ${b.que}`);
  for (const t of g.textos) for (const b of bol) if (solapan(t, b)) mal.push(`${nombre}: «${t.txt}» pisa ${b.que}`);
  for (let i = 0; i < g.textos.length; i++) for (let j = i + 1; j < g.textos.length; j++) if (solapan(g.textos[i], g.textos[j])) mal.push(`${nombre}: se pisan «${g.textos[i].txt}» y «${g.textos[j].txt}»`);
  // El número cabe en su boleto con 2 de aire por lado (ancho estimado de cifras tabulares, 0,6 del tamaño).
  for (const c of g.celdas) { const t = String(c.num), tam = t.length >= 3 ? 10 : 11.5; if (t.length * tam * 0.6 > c.w - 4) mal.push(`${nombre}: el ${c.num} no cabe en su boleto`); }
}

test('registrada en el kit', () => assert.equal(Kit.piezas['arit-boletos'], P));

test('sin NaN ni colores fijos, sin carmín ni verde, pura, marcada de prueba y con su texto alternativo', () => {
  for (const d of MUESTRAS) for (const paso of (d.pasos || [{}]).map((_, i) => i)) {
    const s = P.dibujar(d, { paso });
    assert.ok(!/NaN|undefined|Infinity/.test(s), JSON.stringify(d));
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s), 'sin colores fijos');
    assert.ok(!/var\(--c-[hd]\)/.test(s), 'sin carmín ni verde');
    assert.ok(!/\sid="|filter|<image/.test(s));
    assert.equal(s, P.dibujar(d, { paso }), 'pura');
    assert.match(s, /data-objeto="boletos" data-prueba="si"/);
    assert.match(s, /^<svg [^>]*viewBox="0 0 320 \d+"/);
    const a = P.alt(d, { paso });
    assert.ok(a.length > 30 && !/undefined|NaN/.test(a), a);
  }
});

test('fiel: un boleto por número y del mismo tamaño; premiados, los múltiplos; grupos de d; sobran los de después', () => {
  for (const d of MUESTRAS) for (const paso of (d.pasos || [{}]).map((_, i) => i)) {
    const g = P.geometria(d, { paso }), m = Object.assign({}, d, (d.pasos || [])[paso] || {});
    assert.deepEqual(g.celdas.map(c => c.num), Array.from({ length: g.hasta - g.desde + 1 }, (_, i) => g.desde + i));
    assert.ok(g.celdas.every(c => Math.abs(c.w - g.celdas[0].w) < 1e-9 && c.h === g.celdas[0].h), 'todos del mismo tamaño');
    // El orden de lectura: de izquierda a derecha y de arriba abajo.
    for (let i = 1; i < g.celdas.length; i++) { const a = g.celdas[i - 1], b = g.celdas[i]; assert.ok(b.y > a.y || (b.y === a.y && b.x > a.x)); }
    const premiados = g.celdas.filter(c => c.premio).map(c => c.num);
    assert.ok(premiados.every(x => g.premio && x % g.premio === 0), 'solo múltiplos');
    if (g.premio && (m.marcar === true || m.marcar === undefined)) {
      // Cuenta aparte: los múltiplos de d entre desde y hasta.
      const esperados = []; for (let x = g.desde; x <= g.hasta; x++) if (x % g.premio === 0) esperados.push(x);
      assert.deepEqual(premiados, esperados);
      assert.equal(g.cuantos, esperados.length);
    }
    if (m.marcar === false || !g.premio) assert.equal(premiados.length, 0, 'sin pedirlo no marca nada');
    if (typeof m.marcar === 'number') assert.equal(premiados.length, Math.min(m.marcar, g.cuantos));
    if (m.grupos && g.premio) {
      // Las celdas sombreadas forman tramos de exactamente d boletos seguidos que terminan en un múltiplo.
      const som = g.celdas.filter(c => c.sombra).map(c => c.num);
      for (const x of som) { const fin = Math.ceil(x / g.premio) * g.premio; for (let y = fin - g.premio + 1; y <= fin; y++) assert.ok(som.includes(y), `grupo cortado en ${x}`); }
    }
    if (m.sobran && g.premio) assert.deepEqual(g.celdas.filter(c => c.sobra).map(c => c.num), g.celdas.map(c => c.num).filter(x => x > Math.floor(g.hasta / g.premio) * g.premio));
    const s = P.dibujar(d, { paso });
    assert.equal((s.match(/class="bo-premio"/g) || []).length, premiados.length);
  }
});

test('con números: todo cabe con 4 de margen, nada se pisa y el alto no salta entre pasos', () => {
  const mal = [];
  for (const d of MUESTRAS) {
    const pasos = (d.pasos || [{}]).map((_, i) => i), altos = new Set();
    for (const paso of pasos) { revisar(d, { paso }, JSON.stringify(d).slice(0, 60) + ` paso ${paso}`, mal); altos.add(P.geometria(d, { paso }).H); }
    assert.equal(altos.size, 1, `el alto salta: ${[...altos].join(', ')}`);
  }
  assert.deepEqual(mal, []);
});

test('las figuras de la teoría que usan la pieza caben y no se pisan', () => {
  const def = require(path.join(__dirname, '..', '..', '..', 'contenido', 'teoria', 'aritmetica', 'divisibilidad.js'));
  const mal = []; let n = 0;
  const mira = (dib, nombre) => {
    if (!dib || dib.pieza !== 'arit-boletos' || !dib.datos) return;
    const pasos = (dib.datos.pasos || [{}]).map((_, i) => i);
    for (const paso of pasos) { n++; revisar(dib.datos, Object.assign({}, dib.estado || {}, { paso }), `${nombre} paso ${paso}`, mal); }
  };
  for (const idea of def.ideas) {
    const pz = idea.pieza;
    for (const t of (idea.lee && idea.lee.tarjetas) || []) if (t.dibujo) mira({ pieza: t.pieza || pz, datos: t.dibujo.datos, estado: t.dibujo.estado }, `${idea.id} lee`);
    for (const k of ['predice']) if (idea[k]) for (const c of ['dibujo', 'revelar']) if (idea[k][c]) mira(Object.assign({ pieza: idea[k].pieza || pz }, idea[k][c]), `${idea.id} ${k} ${c}`);
    if (idea.mira && idea.mira.datos) mira({ pieza: idea.mira.pieza || pz, datos: idea.mira.datos }, `${idea.id} mira`);
    if (idea.regla && idea.regla.dibujo) mira(Object.assign({ pieza: idea.regla.dibujo.pieza || pz }, idea.regla.dibujo), `${idea.id} regla`);
    (idea.ejemplos || []).forEach((e, i) => { if (e.figura) mira(Object.assign({ pieza: pz }, e.figura), `${idea.id} ejemplo ${i + 1}`); });
    for (const gen of ['ahoraTu', 'resuelve']) if (idea[gen] && typeof idea[gen].generar === 'function') for (let s = 0; s < 40; s++) {
      const c = idea[gen].generar(s);
      if (c && c.dibujo) mira(Object.assign({ pieza: idea[gen].pieza || pz }, c.dibujo), `${idea.id} ${gen} ${s}`);
      for (const p of (c && c.pasos) || []) if (p.dibujo) mira(Object.assign({ pieza: idea[gen].pieza || pz }, p.dibujo), `${idea.id} ${gen} ${s} paso`);
    }
  }
  assert.deepEqual(mal, []);
  assert.ok(n >= 4, `la teoría usa la pieza en ${n} figuras`);
});

// Bloque de «Números primos y divisores» (19 nov): boletos sueltos y la criba. Cuenta aparte: un número se tacha si es
// múltiplo de un primo de la lista (sin contar al primo mismo, salvo con propios: false); lo que queda va en violeta.
test('criba: tacha los múltiplos de cada primo, deja el aro al primo que tacha y marca lo que queda; numeros sueltos', () => {
  const esPrimo = x => x > 1 && Array.from({ length: x - 2 }, (_, i) => i + 2).every(k => x % k);
  const mal = [];
  for (const [d, nombre] of [
    [{ desde: 1, hasta: 100, criba: { primos: [2, 3, 5, 7], uno: true, quedan: true }, letrero: 'criba', pie: 'pie' }, '1..100'],
    [{ desde: 1, hasta: 30, columnas: 10, criba: { primos: [2, 3], uno: true } }, '1..30 hasta 3'],
    [{ desde: 1, hasta: 15, columnas: 5, criba: { primos: [3, 5], propios: false, quedan: true, unoQueda: true } }, 'Euler 15'],
    [{ numeros: [1, 2, 33, 35, 37], columnas: 5, criba: { primos: [2, 3, 5], uno: true, quedan: true } }, 'sueltos'],
    [{ numeros: [1, 2, 33, 35, 37], columnas: 5 }, 'sueltos sin criba'],
  ]) {
    const g = P.geometria(d), cr = d.criba;
    if (d.numeros) assert.deepEqual(g.celdas.map(c => c.num), d.numeros);
    for (const c of g.celdas) {
      const t = !!cr && ((c.num === 1 && !!cr.uno) || cr.primos.some(p => c.num % p === 0 && (cr.propios === false || c.num !== p)));
      assert.equal(c.tacha, t, `${nombre}: ${c.num}`);
      if (cr && cr.quedan) assert.equal(c.queda, !t && (c.num > 1 || !!cr.unoQueda) && !(cr.propios !== false && cr.primos.includes(c.num)), `${nombre}: ${c.num}`);
    }
    revisar(d, {}, nombre, mal);
    const s = P.dibujar(d);
    assert.ok(!/NaN|undefined|var\(--c-[hd]\)/.test(s));
    assert.equal((s.match(/class="bo-tacha"/g) || []).length, g.celdas.filter(c => c.tacha).length);
  }
  assert.deepEqual(mal, []);
  // Con los primos hasta 7, lo que queda del 1 al 100 son los primos mayores que 7.
  const g = P.geometria({ desde: 1, hasta: 100, criba: { primos: [2, 3, 5, 7], uno: true, quedan: true } });
  assert.deepEqual(g.celdas.filter(c => c.queda).map(c => c.num), Array.from({ length: 100 }, (_, i) => i + 1).filter(x => esPrimo(x) && x > 7));
  assert.match(P.alt({ numeros: [1, 2, 33], criba: { primos: [3], uno: true, quedan: true } }), /números 1, 2, 33.*tachados/);
});

// Números primos y divisores, cierre (19 nov): el cartel puede ir sin cordeles (se leían como una llave sobre los
// boletos); al final de la criba, primosQuedan marca también en violeta los primos que tacharon; el número tachado se
// lee (antes, al 45 %). Ninguna de las tres cambia lo que dibuja Divisibilidad.
test('criba: cartel sin cordeles, primosQuedan y tachados legibles', () => {
  const base = { desde: 1, hasta: 30, letrero: 'Rifa', criba: { primos: [2, 3, 5], uno: true, quedan: true } };
  const cordel = s => (s.match(/<path d="M[\d.]+ [\d.]+V[\d.]+M/g) || []).length;
  assert.equal(cordel(P.dibujar(base)), 1);
  assert.equal(cordel(P.dibujar(Object.assign({}, base, { cordeles: false }))), 0);
  const g = P.geometria(Object.assign({}, base, { criba: Object.assign({}, base.criba, { primosQuedan: true }) }));
  assert.deepEqual(g.celdas.filter(c => c.queda).map(c => c.num), [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]);
  assert.equal(g.celdas.filter(c => c.usado).length, 0);
  assert.ok(!/fill-opacity="0.45"/.test(P.dibujar(base)));
});

// Bloque de «MCD y MCM» (19 nov): dos premios a la vez. Cuenta aparte: caramelo para los múltiplos del primero, gaseosa
// para los del segundo, y borde violeta para los que tienen los dos; con marcarPremios, solo lo pedido. Nada de esto cambia
// lo que dibujan Divisibilidad y Números primos (las muestras de arriba siguen igual).
test('premios: caramelo, gaseosa y los dos; marcarPremios false, ambos, a y b', () => {
  const mal = [];
  for (const [d, nombre] of [
    [{ desde: 1, hasta: 60, premios: [4, 6], cordeles: false, letrero: 'Caramelo cada 4 · gaseosa cada 6' }, 'todos'],
    [{ desde: 1, hasta: 120, premios: [12, 18], marcarPremios: false }, 'ninguno'],
    [{ desde: 1, hasta: 40, premios: [12, 18], marcarPremios: 'ambos', pie: 'pie' }, 'ambos'],
    [{ desde: 1, hasta: 40, premios: [12, 18], marcarPremios: 'a' }, 'a'],
    [{ desde: 1, hasta: 60, premios: [3, 10], marcarPremios: 'b' }, 'b'],
  ]) {
    const g = P.geometria(d), m = d.marcarPremios === undefined ? true : d.marcarPremios, [a, b] = d.premios;
    for (const c of g.celdas) {
      const ea = c.num % a === 0, eb = c.num % b === 0;
      assert.equal(!!c.pa, ea && (m === true || m === 'a' || (m === 'ambos' && eb)), `${nombre}: ${c.num}`);
      assert.equal(!!c.pb, eb && (m === true || m === 'b' || (m === 'ambos' && ea)), `${nombre}: ${c.num}`);
      assert.equal(!!c.ambos, ea && eb && (m === true || m === 'ambos'), `${nombre}: ${c.num}`);
    }
    revisar(d, {}, nombre, mal);
    const s = P.dibujar(d);
    assert.ok(!/NaN|undefined|var\(--c-[hd]\)/.test(s));
    assert.equal((s.match(/class="bo-ambos"/g) || []).length, g.celdas.filter(c => c.ambos).length);
  }
  assert.deepEqual(mal, []);
  assert.match(P.alt({ desde: 1, hasta: 60, premios: [4, 6] }), /con los dos, 12, 24, 36, 48, 60/);
});
