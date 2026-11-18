// Pruebas propias de «Las cuatro operaciones» (además del validador común de contenido/teoria/teoria.test.js). Fase 3
// (18 nov): las siete ideas rehechas contra el contrato, en el orden de la propuesta (docs/etapa4/propuesta-aritmetica.md).
//   - un color fijo por magnitud (docs/molde-unidad.md §5b; propuesta §7): cada ficha de color de la unidad dice su
//     magnitud (m) y lleva el color de def.colores: el envase turquesa, lo que se muda naranja, lo que se busca violeta;
//     nunca verde ni carmín, tampoco en las figuras;
//   - siete ideas con septimaIdea, calidad 2 y las sumatorias fuera (se mudaron a Sucesiones y series);
//   - cada misión se cumple solo con su caso, y su «bien» no dice la respuesta de la predicción;
//   - la escala del dibujo no salta (juegos y «Mira» con pedido);
//   - Predice: la figura no delata la respuesta, los datos no traen fórmulas y ningún código de error se repite;
//   - «Ahora tú» trae cuatro opciones distintas en 400 semillas, con datos, y su respuesta cuadra con un cálculo aparte
//     (código propio de esta prueba, sin el de la unidad ni el motor de la escena); «Así se resuelve» no hace la pregunta
//     de «Ahora tú» y también cuadra;
//   - 15 ejemplos por idea que suben de nivel, con datos; la figura no muestra el resultado; la respuesta lleva color;
//   - cada idea estrena sus palabras, con su simple y tres ejemplos; los números de la predicción y de la misión no
//     aparecen antes (Lee, glosario de la idea, ejemplos);
//   - notación: × y nunca «·» (salvo el separador de dos relaciones de una regla), 34₍₅₎ y nunca (34)₅.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../../../nucleo/kit/kit.js');
const Teoria = require('../../../nucleo/teoria.js');
const Glosario = require('../../../nucleo/glosario.js');
const E = require('../../../nucleo/ecuacion.js');
const def = require('./cuatro-operaciones.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
const PZ = id => Kit.piezas[id];
const ID = ['otras-bases', 'prestamo', 'complemento', 'cifras-ocultas', 'multiplicar-partes', 'defecto-exceso', 'cifras-producto'];
const idea = id => def.ideas.find(i => i.id === id);
const SEMILLAS = 400;

const fichas = x => (x === null || x === undefined || typeof x !== 'object' ? [] : Array.isArray(x) ? x.flatMap(fichas)
  : typeof x.v === 'string' && /^c-/.test(x.v) ? [x] : Object.values(x).flatMap(fichas));
const limpio = x => (Array.isArray(x) ? x.filter(y => y !== undefined && y !== null).map(limpio) : x);
const plano = x => E.texto(x === undefined || x === null ? '' : limpio(Array.isArray(x) ? x : [x]));
// La letra de una alternativa: { negrita: ['B'] } (en tinta, sin color de variable; auditoría, M7).
const negritas = x => (x === null || x === undefined || typeof x !== 'object' ? [] : Array.isArray(x) ? x.flatMap(negritas)
  : x.negrita ? [x] : Object.values(x).flatMap(negritas));
const sinEsp = t => String(t).replace(/[\s  ]/g, '');
const textoSVG = s => s.replace(/<title>.*?<\/title>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const svgDe = (dib, pz) => PZ((dib && dib.pieza) || pz).dibujar(dib.datos, dib.estado || {});

// ---------- Cálculo aparte (sin la unidad ni el motor) ----------
const val = (s, n) => [...String(s)].reduce((a, c) => a * n + +c, 0);
const aBase = (x, n) => { let s = ''; do { s = (x % n) + s; x = Math.floor(x / n); } while (x > 0); return s; };
const cifrasDe = x => String(x).length;
// Envases que se abren al restar por columnas (un 0 obliga a abrir más allá).
function aperturas(M, S) {
  const a = [...M].reverse().map(Number), b = S.padStart(M.length, '0').split('').reverse().map(Number);
  let n = 0;
  for (let k = 0; k < a.length; k++) if (a[k] < b[k]) { let j = k + 1; while (a[j] === 0) j++; for (let i = j; i > k; i--) { a[i] -= 1; a[i - 1] += 10; n++; } }
  return n;
}
// Fuerza bruta sobre las manchas (☐) de una cuenta escrita «A op B = C».
function manchas(txt) {
  const m = sinEsp(txt).match(/^([\d☐]+)([+−×])([\d☐]+)=([\d☐]+)$/);
  const [A, op, B, C] = [m[1], m[2], m[3], m[4]], todo = A + B + C, h = [...todo].filter(c => c === '☐').length, sols = [];
  for (let t = 0; t < 10 ** h; t++) {
    const ds = String(t).padStart(h, '0').split(''); let i = 0;
    const pon = s => s.replace(/☐/g, () => ds[i++]);
    const a = pon(A), b = pon(B), c = pon(C);
    if ([a, b, c].some(x => x.length > 1 && x[0] === '0')) continue;
    const r = op === '+' ? +a + +b : op === '−' ? +a - +b : +a * +b;
    if (r === +c) sols.push(ds.map(Number));
  }
  return sols;
}

// Todo lo que el alumno lee en una idea: { donde, x }.
function lecturas(i) {
  const out = [], add = (donde, x) => out.push({ donde, x }), j = i.juega;
  for (const [k, t] of i.lee.tarjetas.entries()) add(`lee ${k + 1}`, [t.titulo, t.texto, t.ecuacion]);
  add('consigna', j.consigna); add('misión', [j.mision.texto, j.mision.bien]); add('leyenda', j.leyenda.map(x => x.s));
  for (const v of Teoria.grilla(j.controles).filter((_, k) => k % 7 === 0)) add(`lectura ${JSON.stringify(v)}`, j.lectura(v));
  add('predice', [i.predice.pregunta, i.predice.datos, i.predice.opciones.map(o => o.texto)]);
  for (const [k, p] of i.mira.pasos.entries()) add(`mira ${k + 1}`, [p.texto, p.ecuacion]);
  add('regla', [i.regla.texto, i.regla.ecuacion]);
  for (const [k, e] of i.ejemplos.entries()) add(`ejemplo ${k + 1}`, [e.enunciado, e.alternativas, e.datos, e.solucion, e.respuesta]);
  for (let s = 0; s < 60; s++) {
    const a = i.ahoraTu.generar(s), r = i.resuelve.generar(s);
    add(`ahora tú ${s}`, [a.pregunta, a.datos, a.opciones.map(o => o.texto), a.solucion]);
    add(`resuelve ${s}`, [r.enunciado, r.datos, r.pasos.map(x => [x.texto, x.ecuacion]), r.respuesta]);
  }
  return out;
}
// Las figuras de una idea: [nombre, svg].
function figuras(i) {
  const pz = i.pieza, out = [], add = (n, dib, p) => { if (dib && dib.datos) out.push([n, svgDe(dib, p || pz)]); };
  for (const [k, t] of i.lee.tarjetas.entries()) add(`lee ${k + 1}`, t.dibujo, t.pieza);
  for (const v of Teoria.grilla(i.juega.controles).filter((_, k) => k % 11 === 0)) add('juego', i.juega.dibujo(v), i.juega.pieza);
  add('predice', i.predice.dibujo, i.predice.pieza); add('revelar', i.predice.revelar, i.predice.pieza);
  i.mira.pasos.forEach((p, k) => add(`mira ${k + 1}`, { datos: i.mira.datos, estado: p.estado }, i.mira.pieza));
  for (const [k, e] of i.ejemplos.entries()) if (e.figura) add(`ejemplo ${k + 1}`, e.figura, e.figura.pieza);
  return out;
}

test('la tabla de colores: el envase turquesa, lo que se muda naranja, lo que se busca violeta; sin verde ni carmín', () => {
  assert.deepEqual(def.colores, { envase: 'i', muda: 'o', busca: 'f' });
});

test('siete ideas en el orden de la propuesta, con septimaIdea y calidad 2; las sumatorias se mudaron', () => {
  assert.deepEqual(def.ideas.map(i => i.id), ID);
  assert.equal(def.calidad, 2);
  assert.match(def.septimaIdea, /San Marcos/);
  assert.ok(!def.glosario.some(g => g.termino === 'sumatoria'), 'la sumatoria es de Sucesiones y series');
  assert.ok(!def.laboratorio.some(m => m.id === 'escaleras-a-z'), 'la mesa de las escaleras es de Sucesiones y series');
  const suc = require('./sucesiones-y-series.js');
  assert.ok(suc.laboratorio.some(m => m.id === 'escaleras-a-z') && suc.laboratorioIdeas['escaleras-a-z'][0] === 'suma-rectangulo');
  assert.ok(suc.glosario.some(g => g.termino === 'sumatoria'));
  assert.deepEqual(ID.map(k => idea(k).titulo), ['La llevada llena una bolsita', 'Abrir una bolsita para restar', 'Lo que falta para llenar',
    'Cifras que faltan, columna por columna', 'Multiplicar es juntar bolsas iguales', 'Sobran o faltan para otra bolsita', 'Cifras del producto y del cociente']);
});

test('un color por magnitud: cada ficha dice su magnitud y lleva su color; nada en verde ni carmín, tampoco en las figuras', () => {
  const por = {};
  for (const i of def.ideas) {
    for (const { donde, x } of lecturas(i)) for (const f of fichas(x)) {
      assert.ok(f.m in def.colores, `${i.id} ${donde}: «${f.t}» sin magnitud (${f.v})`);
      assert.equal(f.v, `c-${def.colores[f.m]}`, `${i.id} ${donde}: «${f.t}» (${f.m}) en ${f.v}`);
      por[f.m] = (por[f.m] || 0) + 1;
    }
    for (const [n, svg] of figuras(i)) assert.ok(!/var\(--c-[hd]\)/.test(svg), `${i.id} ${n}: verde o carmín`);
  }
  for (const m of Object.keys(def.colores)) assert.ok(por[m] > 100, `${m}: ${por[m]} fichas`);
  // Las mesas del laboratorio tampoco usan verde ni carmín.
  for (const m of def.laboratorio) for (const v of Teoria.grilla(m.controles).filter((_, k) => k % 37 === 0)) {
    assert.ok(!/var\(--c-[hd]\)/.test(PZ(m.pieza).dibujar(m.dibujo(v).datos, m.dibujo(v).estado || {})), m.id);
    for (const f of fichas(m.lectura(v))) assert.equal(f.v, `c-${def.colores[f.m]}`, m.id);
  }
});

test('las misiones: cada una se cumple solo con su caso y su «bien» no dice la predicción', () => {
  const casos = {
    prestamo: ['432,178,1,1'], complemento: ['740,260'], 'cifras-ocultas': ['5,9,7'], 'multiplicar-partes': ['7,27'],
    'defecto-exceso': ['47,5'], 'cifras-producto': ['5,3'],
  };
  const resp = { prestamo: /3\s?525/, complemento: /5\s?927/, 'cifras-ocultas': /\b4\b/, 'multiplicar-partes': /\b13\b/, 'defecto-exceso': /\b3\b(?! más)/, 'cifras-producto': /4 o 5/ };
  for (const [id, quiere] of Object.entries(casos)) {
    const j = idea(id).juega, ok = Teoria.grilla(j.controles).filter(v => j.mision.logrado(v)).map(v => j.controles.map(c => v[c.id]).join());
    assert.deepEqual(ok, quiere, id);
    if (id !== 'defecto-exceso') assert.ok(!resp[id].test(j.mision.bien), `${id}: ${j.mision.bien}`);
  }
  // La resta: abrir de más no cumple (la bolsita abierta sin necesidad deja 10 o más en una columna).
  const r = idea('prestamo').juega;
  assert.ok(!r.mision.logrado({ M: 432, S: 178, ob: 1, oc: 0 }) && !r.mision.logrado({ M: 432, S: 178, ob: 0, oc: 1 }));
  assert.equal(r.dibujo({ M: 432, S: 178, ob: 1, oc: 1 }).datos.cuenta.resultado, String(432 - 178));
  assert.deepEqual(r.dibujo({ M: 432, S: 178, ob: 1, oc: 1 }).datos.cuenta.presta, { 0: '12', 1: '12', 2: '3' });
  // Las cifras ocultas: la cuenta del cuaderno cuadra solo con 585 + 697.
  assert.deepEqual(manchas('☐85 + 6☐☐ = 1282'), [[5, 9, 7]]);
  // La división: la misión tiene una sola respuesta recorriendo los controles (arriba: solo 47,5) y también con
  // cualquier bolsita, de 2 a 47 caramelos, dentro o fuera de los controles (lector en frío, ronda 2: «con bolsitas de 10
  // también faltan 3»). Lo que pide el texto: 9 bolsitas llenas y 3 huecos en la décima.
  const dv = idea('defecto-exceso').juega;
  assert.match(dv.mision.texto, /llena 9 y deja 3 huecos en otra/);
  const cumple = d => Math.floor(47 / d) === 9 && 47 % d !== 0 && d - (47 % d) === 3;
  assert.deepEqual(Array.from({ length: 46 }, (_, k) => k + 2).filter(cumple), [5]);
  const rangoD = dv.controles.find(c => c.id === 'd');
  for (let d = rangoD.min; d <= rangoD.max; d++) assert.equal(dv.mision.logrado({ a: 47, d }), cumple(d), `bolsitas de ${d}`);
  // La calculadora: con A de 5 cifras, B de 3 llena justo las 8 casillas y B de 4 ya no cabe.
  assert.equal(cifrasDe(99999 * 999), 8); assert.equal(cifrasDe(99999 * 9999), 9);
});

test('la escala no salta: cada juego con pedido tiene una sola; «Mira» de las ideas 5 y 6 cabe con la suya', () => {
  const P = PZ('arit-puesto');
  for (const i of def.ideas.filter(x => (x.juega.pieza || x.pieza) === 'arit-puesto' && x.id !== 'cifras-ocultas')) {
    const esc = new Set(Teoria.grilla(i.juega.controles).map(v => P.geometria(i.juega.dibujo(v).datos).s));
    assert.equal(esc.size, 1, `${i.id}: ${[...esc].join(', ')}`);
    assert.ok([...esc][0] >= 0.4 || i.id === 'complemento', `${i.id}: escala ${[...esc][0]}`);
  }
  for (const id of ['multiplicar-partes', 'defecto-exceso']) {
    const m = idea(id).mira, g = m.pasos.map(p => P.geometria(m.datos, p.estado)).filter(x => x.grupos.length);
    assert.ok(g.length >= 2, id);
    for (const x of g) assert.ok(Math.abs(x.s - m.datos.escala) < 1e-9 && x.sCabe >= x.s - 1e-9, `${id}: escala ${x.s}, cabe ${x.sCabe}`);
  }
});

test('Predice: la figura no delata, los datos no traen fórmulas y ningún código se repite', () => {
  const correcta = { prestamo: '3525', complemento: '5927', 'multiplicar-partes': '13', 'cifras-producto': null, 'cifras-ocultas': null, 'defecto-exceso': null };
  for (const i of def.ideas.slice(1)) {
    const p = i.predice, svg = textoSVG(svgDe(p.dibujo, p.pieza || i.pieza));
    if (correcta[i.id]) assert.ok(!sinEsp(svg).includes(correcta[i.id]), `${i.id}: la figura dice ${correcta[i.id]}`);
    assert.equal(new Set(p.opciones.map(o => o.error).filter(Boolean)).size, 3, `${i.id}: códigos repetidos`);
    assert.ok(p.datos.every(x => !/=\s*[a-zA-Z]/.test(plano(x))), `${i.id}: datos con fórmula`);
    // Nada en violeta antes de comprobar, salvo un resultado que se da (la resta del cuaderno manchado, lo que sube el
    // pedido): el violeta es del resultado también cuando se da (propuesta §7); lo pedido va con «?» o en otra fila.
    if (!['multiplicar-partes', 'cifras-ocultas'].includes(i.id)) assert.ok(!/var\(--c-f\)/.test(svgDe(p.dibujo, p.pieza || i.pieza)), `${i.id}: violeta antes de comprobar`);
  }
  // Las respuestas, con un cálculo aparte.
  const op = (id, k) => sinEsp(plano(idea(id).predice.opciones.find(o => o.id === k).texto));
  const ok = id => sinEsp(plano(idea(id).predice.opciones.find(o => o.correcta).texto));
  assert.equal(ok('prestamo'), String(5003 - 1478));
  assert.equal(ok('complemento'), String(10000 - 4073));
  assert.deepEqual(manchas('8☐2 − ☐57 = 375'), [[3, 4]]); assert.equal(ok('cifras-ocultas'), '4');
  assert.equal(ok('multiplicar-partes'), `${52 / 4}bolsas`);
  assert.equal(ok('defecto-exceso'), String(7 - (7 * 5 + 4) % 7 === 7 ? 0 : 7 - 4));
  assert.equal(ok('cifras-producto'), `${cifrasDe(Math.floor(1e6 / 999))}o${cifrasDe(Math.floor(9999999 / 100))}cifras`);
  // Las trampas dan lo que dice su código.
  assert.equal(op('prestamo', 'menor'), '4475'); assert.equal(op('prestamo', 'sin'), '4635'); assert.equal(op('prestamo', 'diez'), '3635');
  assert.equal(op('complemento', 'nueve'), String(9999 - 4073)); assert.equal(op('complemento', 'k'), String(100000 - 4073));
});

test('ninguna letra de alternativa (A–D) lleva color: todas van en negrita y en tinta, también la de la respuesta', () => {
  let n = 0;
  for (const i of def.ideas) for (const { donde, x } of lecturas(i)) {
    for (const f of fichas(x)) assert.ok(!/^[A-E]\u2060?$/.test(f.t), `${i.id} ${donde}: la letra «${f.t}» en ${f.v}`);
    for (const b of negritas(x)) { n++; assert.match(plano(b.negrita), /^[A-D]$/, `${i.id} ${donde}`); assert.equal(fichas(b.negrita).length, 0, `${i.id} ${donde}`); }
  }
  assert.ok(n >= 100, `${n} letras en negrita`);
});

// Toda cuenta manchada de la teoría da el dato «la primera cifra de un numeral no es 0» (auditoría, M1: sin él,
// 7☐8 − 6☐9 = ☐89 tenía 10 soluciones con 089).
test('cuentas manchadas: con la mancha va el dato de la primera cifra, y hace falta', () => {
  const conMancha = [];
  for (const i of def.ideas) {
    for (const e of i.ejemplos) if (/☐/.test(plano(e.enunciado))) conMancha.push([`${i.id} ${e.titulo}`, e.datos]);
    for (let s = 0; s < 40; s++) { const a = i.ahoraTu.generar(s); if (/☐/.test(plano(a.pregunta))) conMancha.push([`${i.id} ahora tú ${s}`, a.datos]); }
    for (let s = 0; s < 12; s++) { const r = i.resuelve.generar(s); if (/☐/.test(plano(r.enunciado))) conMancha.push([`${i.id} resuelve ${s}`, r.datos]); }
  }
  assert.ok(conMancha.length > 40, `${conMancha.length}`);
  for (const [donde, ds] of conMancha) assert.ok(ds.some(x => /primera cifra de un numeral no es 0/.test(plano(x))), donde);
  // Sin el dato, la resta de tres manchas tendría otras soluciones (089, 189…): por eso va.
  const conCeros = []; for (let a = 0; a < 10; a++) for (let b = 0; b < 10; b++) for (let c = 0; c < 10; c++) if (700 + 10 * a + 8 - (600 + 10 * b + 9) === 100 * c + 89) conCeros.push([a, b, c]);
  assert.equal(conCeros.length, 10); assert.deepEqual(manchas('7☐8 − 6☐9 = ☐89'), [[9, 0, 1]]);
});

// Los datos de los dos repartos sirven para el caso que se pregunta (auditoría, A1 y M3): ni «uno más por persona»
// (q + 1) ni «0 ≤ r < d» cuando el segundo reparto da 2 o 3 más o sobran más que las personas.
test('dos repartos: los datos no traen q + 1 ni r < d, y cada línea con letras las dice', () => {
  const casos = [];
  const i = idea('defecto-exceso');
  for (let s = 0; s < SEMILLAS; s++) { const a = i.ahoraTu.generar(s); if (/si les da/.test(plano(a.pregunta))) casos.push(a.datos); }
  for (const e of i.ejemplos.filter(x => /repartos|Uno más y faltan/.test(x.titulo))) casos.push(e.datos);
  assert.ok(casos.length > 50);
  for (const ds of casos) {
    const t = ds.map(plano).join(' | ');
    assert.ok(!/q \+ 1|0 ≤ r/.test(t), t);
    assert.match(t, /D = d × q₁ \+ r/); assert.match(t, /D = d × q₂ − f/); assert.match(t, /d: los (sobrinos|nietos)/);
  }
});

// ---------- «Ahora tú»: la respuesta, con un cálculo aparte ----------
const RESP = {
  'otras-bases': null, // la comprueba la prueba de la fase 2 (abajo, «la idea 1 sigue»)
  prestamo: (q, b) => {
    let m;
    if ((m = q.match(/tiene ([\d ]+) caramelos y despacha ([\d ]+)\./))) return [b, String(+sinEsp(m[1]) - +sinEsp(m[2]))];
    if ((m = q.match(/^¿Cuánto es (\d+)\((\d)\) − (\d+)\(\d\)\?/))) return [b, `${aBase(val(m[1], +m[2]) - val(m[3], +m[2]), +m[2])}(${m[2]})`];
    if ((m = q.match(/despachar ([\d ]+) de sus ([\d ]+) caramelos/))) { const k = aperturas(sinEsp(m[2]), sinEsp(m[1])); return [b, k === 1 ? '1vez' : `${k}veces`]; }
    if ((m = q.match(/restar ([\d ]+) − ([\d ]+), ¿qué cifra se anota en la columna de las (decenas|centenas)/))) {
      const D = String(+sinEsp(m[1]) - +sinEsp(m[2])).padStart(4, '0'); return [b, D[m[3] === 'decenas' ? 2 : 1]];
    }
    return null;
  },
  complemento: (q, b) => {
    let m;
    if ((m = q.match(/complemento aritmético de (\d+)\((\d)\)\?/))) { const n = +m[2]; return [b, `${aBase(n ** m[1].length - val(m[1], n), n)}(${n})`]; }
    if ((m = q.match(/complemento aritmético de ([\d ]+)\?/))) { const N = sinEsp(m[1]); return [b, String(10 ** N.length - +N)]; }
    if ((m = q.match(/de un número de (\d) cifras es ([\d ]+)\./))) return [b, String(10 ** +m[1] - +sinEsp(m[2]))];
    if ((m = q.match(/CA\(a(\d)b\) = (\d)c(\d)/))) return [b, String((9 - +m[2]) + (10 - +m[3]) + (9 - +m[1]))];
    return null;
  },
  'cifras-ocultas': (q, b) => {
    let m;
    if ((m = q.match(/cuaderno, (.+?)\. ¿Qué cifra está bajo la mancha del (sustraendo|segundo sumando)/))) {
      const s = manchas(m[1]); assert.equal(s.length, 1, q); return [b, String(s[0][1])];
    }
    if ((m = q.match(/a − c = (\d)\. ¿Cuánto es abc − cba/))) return [b, String(99 * +m[1])];
    if ((m = q.match(/abc − cba = (\d+), ¿cuál es el mayor/))) {
      let mx = 0; for (let N = 100; N < 1000; N++) { const R = +[...String(N)].reverse().join(''); if (N % 10 && N - R === +m[1]) mx = N; }
      return [b, String(mx)];
    }
    return null;
  },
  'multiplicar-partes': (q, b) => {
    let m;
    if ((m = q.match(/agrega (\d+) caramelos a cada bolsa de un pedido, y el pedido sube (\d+)/))) return [b, String(+m[2] / +m[1])];
    if ((m = q.match(/^En (\d+) × (\d+), el primer factor sube (\d+)/))) return [b, String(+m[2] * +m[3])];
    if ((m = q.match(/sube (\d+), el producto sube (\d+); si en cambio el segundo sube (\d+), el producto sube (\d+)/))) return [b, String((+m[2] / +m[1]) * (+m[4] / +m[3]))];
    if ((m = q.match(/^¿Cuánto es (\d+)\((\d)\) × (\d)\?/))) return [b, `${aBase(val(m[1], +m[2]) * +m[3], +m[2])}(${m[2]})`];
    if ((m = q.match(/se lee (.+?)\. ¿Cuánto suman/))) { const s = manchas(m[1]); assert.equal(s.length, 1, q); return [b, String(s[0][0] + s[0][1])]; }
    return null;
  },
  'defecto-exceso': (q, b) => {
    let m;
    if ((m = q.match(/bolsitas de (\d+): llena (\d+) y le sobran? (\d+)\./))) return [b, String(+m[1] - +m[3])];
    if ((m = q.match(/divisor es (\d+), el cociente por defecto es (\d+) y el resto por exceso es (\d+)/))) return [b, String(+m[1] * +m[2] + +m[1] - +m[3])];
    if ((m = q.match(/división entre (\d+), el resto por exceso es el (doble|triple|cuádruple)/))) { const k = { doble: 2, triple: 3, 'cuádruple': 4 }[m[2]]; return [b, String(+m[1] / (k + 1))]; }
    if ((m = q.match(/da (\d+) caramelos a cada sobrino, le sobran? (\d+); si les da (\d+), le faltan (\d+)/))) {
      const xs = []; for (let x = 1; x < 100; x++) if (+m[1] * x + +m[2] === +m[3] * x - +m[4]) xs.push(x); return [b, String(xs[0])];
    }
    if ((m = q.match(/da (\d+) caramelos a cada nieto y le sobran? (\d+)\. Para darles (\d+) a cada uno, le faltarían? (\d+)/))) {
      const xs = []; for (let x = 1; x < 100; x++) if (+m[1] * x + +m[2] === +m[3] * x - +m[4]) xs.push(+m[1] * x + +m[2]); return [b, String(xs[0])];
    }
    return null;
  },
  'cifras-producto': (q, b) => {
    const ext = (p, q2, f) => { const v = [[10 ** (p - 1), 10 ** (q2 - 1)], [10 ** p - 1, 10 ** q2 - 1], [10 ** (p - 1), 10 ** q2 - 1], [10 ** p - 1, 10 ** (q2 - 1)]].map(([A, B]) => String(f(BigInt(A), BigInt(B))).length); return [Math.min(...v), Math.max(...v)]; };
    let m;
    if ((m = q.match(/^A tiene (\d) cifras y B tiene (\d)\. ¿Cuántas cifras puede tener A × B\?/))) { const [lo, hi] = ext(+m[1], +m[2], (A, B) => A * B); return [b, `${lo}o${hi}cifras`]; }
    if ((m = q.match(/^A tiene (\d) cifras y B tiene (\d)\. ¿Cuántas cifras puede tener el cociente/))) { const [lo, hi] = ext(+m[1], +m[2], (A, B) => A / B); return [b, `${lo}o${hi}cifras`]; }
    if ((m = q.match(/^A tiene (\d) cifras y B tiene (\d)\. ¿Cuántas cifras puede tener A al (cuadrado|cubo) × B al (cuadrado|cubo)/))) {
      const e1 = m[3] === 'cuadrado' ? 2n : 3n, e2 = m[4] === 'cuadrado' ? 2n : 3n, [lo, hi] = ext(+m[1], +m[2], (A, B) => A ** e1 * B ** e2); return [b, `de${lo}a${hi}cifras`];
    }
    if ((m = q.match(/^A × B tiene (\d+) cifras y A tiene (\d)/))) {
      const qs = []; for (let k = 1; k < 20; k++) { const [lo, hi] = ext(+m[2], k, (A, B) => A * B); if (lo <= +m[1] && +m[1] <= hi) qs.push(k); }
      return [b, `${qs[0]}o${qs[qs.length - 1]}cifras`];
    }
    return null;
  },
};
test('«Ahora tú»: cuatro opciones distintas en 400 semillas, con datos, y la respuesta cuadra con un cálculo aparte', () => {
  for (const i of def.ideas.slice(1)) {
    const vistos = new Set(), tipos = new Set();
    for (let s = 0; s < SEMILLAS; s++) {
      const a = i.ahoraTu.generar(s), q = plano(a.pregunta), ops = a.opciones.map(o => plano(o.texto));
      assert.equal(ops.length, 4, `${i.id} semilla ${s}: ${ops.join(' | ')}`);
      assert.equal(new Set(ops).size, 4, `${i.id} semilla ${s}`);
      assert.ok(Array.isArray(a.datos) && a.datos.length >= 1, `${i.id} semilla ${s}: sin datos`);
      const buena = sinEsp(ops[a.opciones.findIndex(o => o.correcta)]);
      const r = RESP[i.id](q, buena);
      assert.ok(r, `${i.id}: tipo desconocido: ${q}`);
      assert.equal(r[0], r[1], `${i.id} semilla ${s}: ${q}`);
      vistos.add(q); tipos.add(q.slice(0, 18));
    }
    assert.ok(vistos.size > 100, `${i.id}: ${vistos.size} preguntas distintas`);
    assert.ok(tipos.size >= 3, `${i.id}: ${tipos.size} tipos`);
  }
});

test('«Así se resuelve»: no es la pregunta de «Ahora tú» y su respuesta cuadra con un cálculo aparte', () => {
  for (const i of def.ideas.slice(1)) {
    const ahora = new Set(Array.from({ length: SEMILLAS }, (_, s) => plano(i.ahoraTu.generar(s).pregunta)));
    for (let s = 0; s < 60; s++) {
      const c = i.resuelve.generar(s), q = plano(c.enunciado), r = sinEsp(plano(c.respuesta));
      assert.ok(!ahora.has(q), `${i.id}: ${q}`);
      let m;
      if (i.id === 'prestamo') { m = q.match(/tiene (\d+)\((\d)\) caramelos y despacha (\d+)\(/); const n = +m[2]; assert.equal(r, `Lequedan${aBase(val(m[1], n) - val(m[3], n), n)}(${n})`); }
      if (i.id === 'complemento') { m = q.match(/de ([\d ]+)\?/); const N = sinEsp(m[1]); assert.equal(r, `CA=${10 ** N.length - +N}`); }
      if (i.id === 'cifras-ocultas') { m = q.match(/se lee (.+?)\. ¿Qué/); const so = manchas(m[1]); assert.equal(so.length, 1, q); assert.equal(r, `Arriba${so[0][0]}yabajo${so[0][1]}`); }
      if (i.id === 'multiplicar-partes') { m = q.match(/arma (\d) pedidos iguales de (\d+)\((\d)\)/); const n = +m[3]; assert.equal(r, `Son${aBase(val(m[2], n) * +m[1], n)}(${n})caramelos`); }
      if (i.id === 'defecto-exceso') { m = q.match(/bolsitas de (\d+): llena (\d+) y, para llenar otra, le faltarían (\d+)/); assert.equal(r, `Tiene${+m[1] * +m[2] + +m[1] - +m[3]}caramelos`); }
      if (i.id === 'cifras-producto') {
        m = q.match(/de (\d) cifras por uno de (\d) cifras/); const p = +m[1], k = +m[2], lo = cifrasDe(10 ** (p - 1) * 10 ** (k - 1)), hi = cifrasDe((10 ** p - 1) * (10 ** k - 1));
        assert.equal(r, sinEsp(hi <= 8 ? 'Sí: cabe siempre' : lo <= 8 ? 'A veces: el mayor no cabe' : 'Nunca cabe'), q);
      }
    }
  }
});

test('ejemplos: 15 por idea que suben de nivel, con datos; la figura no muestra el resultado; respuesta con color', () => {
  // Respuestas en tinta a propósito: lo que se pide es un número que se opera (el número desde su complemento, las
  // bolsas, el dividendo), que en el mapa de colores va en tinta.
  // (Desde M7 la letra va en tinta: las de nivel 3 cuya respuesta es un número que se opera ya no traen color.)
  const tinta = new Set(['Del complemento al número', 'El factor que falta', 'Armar el dividendo', 'Desde el exceso',
    'Un número y su complemento', 'Un tercio de sí mismo', 'Dos repartos', 'Uno más y faltan', 'El exceso es el doble',
    'El mayor resto posible', 'Restos que suman']);
  for (const i of def.ideas) {
    const EJ = i.ejemplos;
    assert.equal(EJ.length, 15, i.id);
    for (const nv of [1, 2, 3]) assert.equal(EJ.filter(e => e.nivel === nv).length, 5, `${i.id} nivel ${nv}`);
    for (const [k, e] of EJ.entries()) {
      assert.ok(e.datos && e.datos.length, `${i.id} ejemplo ${k + 1}: datos`);
      if (!tinta.has(e.titulo)) assert.ok(fichas(e.respuesta).length, `${i.id} ejemplo ${k + 1}: la respuesta lleva color`);
      if (e.nivel === 3) {
        assert.ok(e.alternativas && e.alternativas.length === 4, `${i.id} ${e.titulo}`);
        assert.equal(negritas(e.respuesta).length, 1, `${i.id} ${e.titulo}: la letra va en negrita`);
      }
      if (!e.figura) continue;
      const svg = sinEsp(textoSVG(svgDe(e.figura, e.figura.pieza)));
      // El valor pedido (lo que va en color en la respuesta, de dos cifras o más) no se lee en la figura, salvo que sea un
      // dato del enunciado (el total del cuaderno que se da).
      const enun = sinEsp(plano(e.enunciado));
      for (const f of fichas(e.respuesta)) {
        const t = sinEsp(f.t);
        if (f.m !== 'envase' && t.length >= 2 && /^\d+$/.test(t) && !enun.includes(t)) assert.ok(!svg.includes(t), `${i.id} ejemplo ${k + 1}: la figura dice ${t}`);
      }
    }
  }
});

test('las cuentas de los ejemplos de nivel 3 cuadran con un cálculo aparte (la letra de la respuesta es la correcta)', () => {
  const letraDe = e => plano(negritas(e.respuesta)[0].negrita);
  const alt = e => sinEsp(plano(e.alternativas['ABCD'.indexOf(letraDe(e))]));
  const ej = (id, t) => idea(id).ejemplos.find(e => e.titulo === t);
  assert.equal(alt(ej('prestamo', 'Tres ceros seguidos')), String(6000 - 2347));
  assert.equal(alt(ej('prestamo', 'Una resta en base 7')), `${aBase(val('1003', 7) - val('256', 7), 7)}(7)`);
  assert.equal(alt(ej('prestamo', 'La cifra de las centenas')), String(7004 - 2386)[1]);
  assert.equal(alt(ej('prestamo', 'Los tres términos de una resta')), String(1848 / 2));
  assert.equal(alt(ej('complemento', 'Base 5 con un cero')), `${aBase(5 ** 4 - val('1030', 5), 5)}(5)`);
  assert.equal(alt(ej('complemento', 'Las cifras del complemento')), String([...String(1e7 - 7040600)].reduce((a, b) => a + +b, 0)));
  assert.equal(alt(ej('cifras-ocultas', 'Una resta con tres manchas')), String(manchas('7☐8 − 6☐9 = ☐89')[0].reduce((a, b) => a + b, 0)));
  assert.equal(alt(ej('cifras-ocultas', 'Una suma con tres manchas')), String(manchas('☐12 + 7☐7 = 17☐9')[0].reduce((a, b) => a + b, 0)));
  // El reverso con manchas: las del medio pueden ser cualquier cifra (iguales), pero la del resultado siempre es 2.
  const rev = manchas('5☐2 − 2☐5 = ☐97');
  assert.equal(rev.length, 10); assert.deepEqual([...new Set(rev.map(x => x[2]))], [2]); assert.ok(rev.every(x => x[0] === x[1]));
  assert.equal(alt(ej('cifras-ocultas', 'El reverso con manchas')), '2');
  assert.equal(alt(ej('cifras-producto', 'Cifras que no se ven')), `siempre${cifrasDe(1000 * 100)}`);
  assert.equal(cifrasDe(1999 * 199), 6);
  assert.equal(alt(ej('multiplicar-partes', 'Cifras ocultas en un producto')), String(manchas('☐3 × 8 = 7☐4')[0].reduce((a, b) => a + b, 0)));
  assert.equal(alt(ej('multiplicar-partes', 'Multiplicar en base 7')), `${aBase(val('356', 7) * 4, 7)}(7)`);
  assert.equal(alt(ej('multiplicar-partes', 'Dos aumentos')), String((140 / 5) * (102 / 3)));
  assert.equal(alt(ej('defecto-exceso', 'Dos repartos')), String(9 * 6 + 7));
  assert.equal(9 * 6 + 7, 11 * 6 - 5);
  assert.equal(alt(ej('cifras-producto', 'Tres factores')), `de${cifrasDe(100 ** 3)}a${cifrasDe(999 ** 3)}`);
});

test('cada idea estrena sus palabras, con simple y tres ejemplos; Las cuatro operaciones estrena llevada, reverso, factor, producto y múltiplo', () => {
  const es = Glosario.porIdea(def).map(x => x.filter(e => e.simple).map(e => e.termino));
  assert.deepEqual(es, [['sumandos', 'llevada'], ['minuendo', 'sustraendo', 'diferencia', 'préstamo'], ['complemento aritmético', 'última cifra significativa'],
    ['reverso', 'consecutivo'], ['factor', 'producto', 'propiedad distributiva'], ['dividendo', 'divisor', 'resto por exceso', 'resto por defecto'], ['cota', 'estimar']]);
  // «múltiplo» y «cociente entero» (como «cociente por defecto») también se estrenan en la idea 6, sin simple.
  const enSeis = Glosario.porIdea(def)[5].map(e => e.termino);
  assert.ok(enSeis.includes('múltiplo') && enSeis.includes('cociente entero'), enSeis.join(', '));
  for (const g of def.glosario) assert.ok(!g.local, `${g.termino}: ya no es local`);
  for (const [archivo, t] of [['razonamiento-numerico', 'llevada'], ['razonamiento-numerico', 'reverso'], ['razones-y-proporciones', 'factor'], ['razones-y-proporciones', 'producto'], ['conjuntos', 'múltiplo']])
    assert.ok(!require(`./${archivo}.js`).glosario.some(g => g.termino === t), `${archivo} ya no define «${t}»`);
});

test('los números de la predicción y de la misión no aparecen antes (Lee, glosario de la idea, ejemplos)', () => {
  // Números (se comparan como números: «99 999» no se confunde con «999 999») o trozos de texto.
  const NUM = {
    prestamo: { pred: [5003, 1478, 3525], mis: [432, 178, 254] },
    complemento: { pred: [4073, 5927], mis: [740, 260] },
    'cifras-ocultas': { pred: [/8☐2/, /☐57/, 832, 457], mis: [1282, 585, 697] },
    'multiplicar-partes': { pred: [52], mis: [/\b27 × 7\b/, 21] },
    'defecto-exceso': { pred: [/7 sobrinos/, 39], mis: [47] },
    'cifras-producto': { pred: [1001, 99999], mis: [99899001] },
  };
  const por = Glosario.porIdea(def);
  for (const [id, n] of Object.entries(NUM)) {
    const i = idea(id), k = def.ideas.indexOf(i);
    const antes = [...i.lee.tarjetas.map(t => plano([t.texto, t.ecuacion || ''])),
      ...por[k].flatMap(g => [g.def, g.simple || '', ...(g.ejemplos || [])]),
      ...i.ejemplos.map(e => plano([e.enunciado, ...(e.solucion || []).map(x => [x.texto, x.ecuacion || '']), e.respuesta]))].join(' | ');
    const nums = Teoria.numerosDe(antes);
    const hay = x => (typeof x === 'number' ? nums.has(String(x)) : x.test(antes));
    for (const x of n.pred) assert.ok(!hay(x), `${id}: la predicción (${x})`);
    for (const x of n.mis) assert.ok(!hay(x), `${id}: la misión (${x})`);
  }
});

test('notación: × y nunca «·»; 34₍₅₎ y nunca (34)₅', () => {
  for (const i of def.ideas) for (const { donde, x } of lecturas(i)) {
    const t = donde === 'regla' ? plano(x).replace(/ · /g, ' ') : plano(x);
    assert.ok(!/·/.test(t), `${i.id} ${donde}: «·» en ${t}`);
    assert.ok(!/\(\d+\)[₀-₉]/.test(t), `${i.id} ${donde}: notación vieja`);
  }
});

test('la idea 1 sigue: su «Ahora tú» cuadra y la predicción en base 5 da 112₍₅₎', () => {
  const i = idea('otras-bases');
  assert.equal(plano(i.predice.opciones.find(o => o.correcta).texto), `${aBase(val('34', 5) + val('23', 5), 5)}(5)`);
  for (let s = 0; s < 100; s++) {
    const a = i.ahoraTu.generar(s), q = plano(a.pregunta), buena = plano(a.opciones.find(o => o.correcta).texto);
    const m = q.match(/^¿Cuánto es (.+)\?$/);
    if (m) { const xs = [...m[1].matchAll(/(\d+)\((\d)\)/g)], n = +xs[0][2]; assert.equal(buena, `${aBase(xs.reduce((t, x) => t + val(x[1], n), 0), n)}(${n})`, q); }
  }
});

test('Lee presenta en su primera tarjeta lo que Predice usa: la base entre paréntesis, la raya y el complemento aritmético', () => {
  // La primera tarjeta es la que todos ven (y la de las capturas del lector en frío: dos rondas sin verla en la 3).
  const t1 = id => plano([idea(id).lee.tarjetas[0].texto, idea(id).lee.tarjetas[0].ecuacion || '']);
  assert.match(t1('otras-bases'), /21\(5\) se lee «21 en base 5»/);
  assert.match(t1('otras-bases'), /la raya: cifras, no a × b/);
  assert.match(t1('complemento'), /complemento aritmético/);
  assert.match(t1('complemento'), /10 000/);
  // Predice de la idea 7 es del cociente: el título lo dice.
  assert.match(plano(idea('cifras-producto').predice.pregunta), /cociente/);
  assert.match(idea('cifras-producto').titulo, /cociente/);
});

test('ninguna división se escribe como igualdad si no es exacta (el cociente entero va con su resto)', () => {
  const num = x => +x.replace(/\s/g, '');
  for (const i of def.ideas) for (const { donde, x } of lecturas(i)) {
    for (const m of plano(x).matchAll(/(\d[\d ]*\d|\d) ÷ (\d[\d ]*\d|\d) = (\d[\d ]*\d|\d)(?![\d,])/g))
      assert.equal(num(m[1]) / num(m[2]), num(m[3]), `${i.id} ${donde}: ${m[0]}`);
  }
});
