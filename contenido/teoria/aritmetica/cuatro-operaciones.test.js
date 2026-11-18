// Pruebas propias de «Las cuatro operaciones» (además del validador común de contenido/teoria/teoria.test.js). Fase 2
// (18 nov): la idea 1, «La llevada llena una bolsita» (id otras-bases), rehecha contra el contrato; las demás ideas se
// rehacen en la fase 3 y entonces se suman aquí.
//   - un color fijo por magnitud (docs/molde-unidad.md §5b; propuesta §7): cada ficha de color de la idea 1 dice su
//     magnitud (m) y lleva el color de def.colores: el envase (la base) turquesa, lo que se muda (la llevada) naranja,
//     lo que se busca (el resultado) violeta; nunca verde ni carmín;
//   - el orden de las ideas de la propuesta (la llevada primero; sumatorias al final hasta mudarse a Sucesiones);
//   - la misión se cumple solo con los pedidos 47 y 38 ya empacados, y su «bien» no dice la predicción;
//   - la escala del dibujo no salta (juego y base 5);
//   - «Ahora tú» trae cuatro opciones distintas en 400 semillas, con datos, y su respuesta cuadra con un cálculo aparte
//     (sumas por columnas y bases con código propio de esta prueba, sin el de la unidad ni el motor de la escena);
//     «Así se resuelve» no hace la pregunta de «Ahora tú» y también cuadra;
//   - ninguna figura de Predice ni de un ejemplo delata la respuesta (lo que se pide va con «?»);
//   - la idea estrena «sumandos» y «llevada», con su simple y tres ejemplos; los números de la predicción y de la
//     misión no aparecen antes (Lee, glosario, ejemplos);
//   - notación: × y nunca «·» (salvo el separador de dos relaciones), 34₍₅₎ y nunca (34)₅.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../../../nucleo/kit/kit.js');
const Teoria = require('../../../nucleo/teoria.js');
const Glosario = require('../../../nucleo/glosario.js');
const E = require('../../../nucleo/ecuacion.js');
const def = require('./cuatro-operaciones.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
const P = Kit.piezas['arit-puesto'];
const idea = def.ideas.find(i => i.id === 'otras-bases');
const SEMILLAS = 400;

const fichas = x => (x === null || x === undefined || typeof x !== 'object' ? [] : Array.isArray(x) ? x.flatMap(fichas)
  : typeof x.v === 'string' && /^c-/.test(x.v) ? [x] : Object.values(x).flatMap(fichas));
const limpio = x => (Array.isArray(x) ? x.filter(y => y !== undefined && y !== null).map(limpio) : x);
const plano = x => E.texto(x === undefined || x === null ? '' : limpio(Array.isArray(x) ? x : [x]));
const textoSVG = s => s.replace(/<title>.*?<\/title>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

// Cálculo aparte: valor de un numeral, numeral en base n y suma por columnas (con las llevadas que salen de cada una).
const val = (s, n) => [...String(s)].reduce((a, c) => a * n + +c, 0);
const aBase = (x, n) => { let s = ''; do { s = (x % n) + s; x = Math.floor(x / n); } while (x > 0); return s; };
function columnas(xs, n) {
  const L = Math.max(...xs.map(x => x.length)); let ll = 0; const cols = [];
  for (let k = 0; k < L; k++) {
    const dig = xs.map(x => +x[x.length - 1 - k] || 0), t = dig.reduce((a, b) => a + b, 0) + ll;
    cols.push({ dig, entra: ll, total: t, cifra: t % n, sale: Math.floor(t / n) }); ll = Math.floor(t / n);
  }
  return { cols, total: aBase(xs.reduce((a, x) => a + val(x, n), 0), n), final: ll > 0 };
}

// Todo lo que el alumno lee en la idea 1: { donde, x }.
function lecturas() {
  const out = [], add = (donde, x) => out.push({ donde, x });
  const i = idea, j = i.juega;
  for (const [k, t] of i.lee.tarjetas.entries()) add(`lee ${k + 1}`, [t.titulo, t.texto, t.ecuacion]);
  add('consigna', j.consigna); add('misión', [j.mision.texto, j.mision.bien]); add('leyenda', j.leyenda.map(x => x.s));
  for (const v of Teoria.grilla(j.controles)) add(`lectura ${JSON.stringify(v)}`, j.lectura(v));
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

test('la tabla de colores: el envase turquesa, lo que se muda naranja, lo que se busca violeta; sin verde ni carmín', () => {
  assert.deepEqual(def.colores, { base: 'i', llevada: 'o', resultado: 'f' });
  assert.ok(!Object.values(def.colores).some(c => c === 'h' || c === 'd'));
});

test('el orden de la propuesta: la llevada primero, las ideas viejas detrás y sumatorias al final (hasta la fase 3)', () => {
  assert.deepEqual(def.ideas.map(i => i.id), ['otras-bases', 'complemento', 'multiplicar-partes', 'defecto-exceso', 'cifras-producto', 'sumatorias']);
  assert.equal(idea.titulo, 'La llevada llena una bolsita');
  assert.equal(idea.pregunta, '¿Por qué se lleva 1 cuando una columna pasa de 9?');
});

test('un color por magnitud: cada ficha de la idea 1 dice su magnitud y lleva su color; nada en verde ni carmín', () => {
  const por = {};
  for (const { donde, x } of lecturas()) for (const f of fichas(x)) {
    assert.ok(f.m in def.colores, `${donde}: «${f.t}» sin magnitud (${f.v})`);
    assert.equal(f.v, `c-${def.colores[f.m]}`, `${donde}: «${f.t}» (${f.m}) en ${f.v}`);
    por[f.m] = (por[f.m] || 0) + 1;
  }
  for (const m of Object.keys(def.colores)) assert.ok(por[m] > 20, `${m}: ${por[m]} fichas`);
  // Las figuras: ni verde ni carmín.
  const figs = [idea.predice.dibujo, idea.predice.revelar, ...idea.mira.pasos.map(p => ({ datos: idea.mira.datos, estado: p.estado })),
    ...idea.ejemplos.filter(e => e.figura).map(e => e.figura), ...Teoria.grilla(idea.juega.controles).slice(0, 200).map(idea.juega.dibujo)];
  for (const d of figs) assert.ok(!/var\(--c-[hd]\)/.test(P.dibujar(d.datos, d.estado || {})));
});

test('la misión: solo los pedidos 47 y 38 ya empacados; el «bien» y la leyenda no dicen la predicción', () => {
  const j = idea.juega, buenos = Teoria.grilla(j.controles).filter(v => j.mision.logrado(v));
  assert.deepEqual(buenos.map(v => [v.p1, v.p2, v.ju].join()).sort(), ['38,47,1', '47,38,1']);
  assert.ok(!j.mision.logrado({ p1: 47, p2: 38, ju: 0 }), 'sin juntar, el total no se puede anotar');
  assert.ok(!/112/.test(j.mision.bien + JSON.stringify(j.leyenda)));
  // Con los pedidos de la misión, el cuaderno anota 85 y la llevada sube a las bolsitas.
  const d = j.dibujo({ p1: 47, p2: 38, ju: 1 }).datos;
  assert.equal(d.cuenta.resultado, '85'); assert.deepEqual(d.cuenta.llevadas, { 1: 1 }); assert.equal(d.bolsitas, 8); assert.equal(d.sueltos, 5);
  assert.equal(j.dibujo({ p1: 47, p2: 38, ju: 0 }).datos.cuenta.resultado, '?');
  // El montón se toca: la zona data-toque del control ju.
  assert.match(P.dibujar(d), /data-toque="ju"/);
});

test('la escala no salta: el juego tiene una sola, y Predice y «Mira» (base 5) caben con la suya', () => {
  const esc = new Set(Teoria.grilla(idea.juega.controles).map(v => { const dd = idea.juega.dibujo(v); return P.geometria(dd.datos).s; }));
  assert.equal(esc.size, 1, [...esc].join(', '));
  const figs = [idea.predice.dibujo, idea.predice.revelar, ...idea.mira.pasos.map(p => ({ datos: idea.mira.datos, estado: p.estado }))];
  const sc = figs.map(d => P.geometria(d.datos, d.estado || {}));
  for (const g of sc) assert.ok(g.sCabe >= g.s - 1e-9 && Math.abs(g.s - 0.85) < 1e-9, `escala ${g.s}, cabe ${g.sCabe}`);
  assert.equal(Math.floor(Math.min(...sc.map(g => g.sCabe)) * 100) / 100 >= 0.85, true);
});

test('Predice: la figura no delata (el total con «?»); al revelar, 112₍₅₎ con sus dos llevadas', () => {
  const p = idea.predice;
  assert.equal(p.dibujo.datos.cuenta.resultado, '?');
  assert.ok(!/112/.test(textoSVG(P.dibujar(p.dibujo.datos))));
  assert.equal(p.revelar.datos.cuenta.resultado, aBase(val('34', 5) + val('23', 5), 5));
  assert.equal(plano(p.opciones.find(o => o.correcta).texto), '112(5)');
  // Las incorrectas salen de su error: sin llevar (57), sin sumar la llevada (102), sin la última (12).
  const op = id => plano(p.opciones.find(o => o.id === id).texto);
  assert.equal(op('decimal'), `${String(34 + 23)}(5)`);
  assert.equal(op('diez'), '102(5)'); assert.equal(op('sin-lleva'), '12(5)');
  assert.equal(new Set(p.opciones.map(o => o.error).filter(Boolean)).size, 3, 'ningún código se repite');
  // Datos: equivalencias, sin fórmula.
  assert.ok(p.datos.every(x => /^1 (bolsita|caja) = 5/.test(plano(x))));
});

test('«Ahora tú»: cuatro opciones distintas en 400 semillas, con datos, y la respuesta cuadra con un cálculo aparte', () => {
  const vistos = new Set();
  for (let s = 0; s < SEMILLAS; s++) {
    const a = idea.ahoraTu.generar(s), q = plano(a.pregunta), ops = a.opciones.map(o => plano(o.texto));
    assert.equal(ops.length, 4, `semilla ${s}: ${ops.join(' | ')}`);
    assert.equal(new Set(ops).size, 4, `semilla ${s}`);
    assert.ok(Array.isArray(a.datos) && a.datos.length >= 1, `semilla ${s}: sin datos`);
    const buena = ops[a.opciones.findIndex(o => o.correcta)];
    const nums = [...q.matchAll(/(\d+)\((\d+|n)\)/g)].map(m => [m[1], m[2]]);
    vistos.add(q);
    if (/lleva de la columna de los sueltos/.test(q)) {
      const xs = q.match(/cuaderno ([\d +]+)\./)[1].split(' + ').map(Number);
      assert.equal(+buena, Math.floor(xs.reduce((t, x) => t + x % 10, 0) / 10), q);
    } else if (/^¿Cuánto es/.test(q)) {
      const n = +nums[0][1], xs = nums.map(x => x[0]);
      assert.equal(buena, `${aBase(xs.reduce((t, x) => t + val(x, n), 0), n)}(${n})`, q);
      assert.ok(columnas(xs, n).cols.some(c => c.sale >= 2), `${q}: alguna columna lleva 2`);
    } else if (/En cierta base n/.test(q)) {
      const [a1, b1, z] = nums.map(x => x[0]), may = Math.max(...(a1 + b1 + z).split('').map(Number));
      const sirven = []; for (let m = may + 1; m <= 40; m++) if (val(a1, m) + val(b1, m) === val(z, m)) sirven.push(m);
      assert.deepEqual(sirven.map(m => `base ${m}`), [buena], q);
    } else if (/centenas/.test(q)) {
      const xs = q.match(/suma ([\d +]+)\./)[1].split(' + ');
      assert.equal(+buena, columnas(xs, 10).cols[2].cifra, q);
    } else if (/en cuántas columnas se lleva/.test(q)) {
      const n = +nums[0][1], c = columnas(nums.map(x => x[0]), n);
      assert.equal(parseInt(buena, 10), c.cols.filter(x => x.sale > 0).length, q);
    } else assert.fail(`tipo desconocido: ${q}`);
  }
  assert.ok(vistos.size > 300);
});

test('«Así se resuelve»: no es la pregunta de «Ahora tú» y su total cuadra con un cálculo aparte', () => {
  const ahora = new Set(Array.from({ length: SEMILLAS }, (_, s) => plano(idea.ahoraTu.generar(s).pregunta)));
  for (let s = 0; s < 60; s++) {
    const c = idea.resuelve.generar(s), q = plano(c.enunciado);
    assert.ok(!ahora.has(q), q);
    const nums = [...q.matchAll(/(\d+)\((\d+)\)/g)], n = +nums[0][2];
    const tot = aBase(val(nums[0][1], n) + val(nums[1][1], n), n);
    assert.equal(plano(c.respuesta), `Anota ${tot}(${n})`);
    assert.ok(columnas([nums[0][1], nums[1][1]], n).cols.filter(x => x.sale).length >= 2, `${q}: dos llevadas o más`);
    // El primer dibujo, con «?»; el del último paso de cuentas, con el total.
    assert.equal(c.dibujo.datos.cuenta.resultado, '?');
    const ult = c.pasos.filter(p => p.tipo === 'cuentas').pop();
    assert.equal(ult.dibujo.datos.cuenta.resultado, tot);
  }
});

test('ejemplos: 15 que suben de nivel, con datos; la figura muestra los datos y no el resultado; respuesta con color', () => {
  const EJ = idea.ejemplos;
  assert.equal(EJ.length, 15);
  for (const nv of [1, 2, 3]) assert.equal(EJ.filter(e => e.nivel === nv).length, 5);
  for (const [k, e] of EJ.entries()) {
    assert.ok(e.datos && e.datos.length, `ejemplo ${k + 1}: datos`);
    assert.ok(fichas(e.respuesta).length, `ejemplo ${k + 1}: la respuesta lleva color`);
    if (!e.figura) continue;
    const cu = e.figura.datos.cuenta;
    if (cu && cu.resultado !== '?') assert.ok(plano(e.enunciado).includes(cu.resultado), `ejemplo ${k + 1}: el total del cuaderno es un dato`);
    // El valor pedido (violeta o naranja en la respuesta) no se lee en la figura, salvo números de una cifra que ya
    // son datos (el 1 del letrero).
    const svg = textoSVG(P.dibujar(e.figura.datos));
    for (const f of fichas(e.respuesta)) if (f.m !== 'base' && f.t.length >= 2 && /\d/.test(f.t)) assert.ok(!svg.includes(f.t), `ejemplo ${k + 1}: la figura dice ${f.t}`);
  }
  // Los niveles 3 traen alternativas (tipo examen) y la letra de la respuesta en negrita.
  for (const e of EJ.filter(x => x.nivel === 3)) {
    assert.ok(e.alternativas && e.alternativas.length === 4, e.titulo);
    assert.ok(fichas(e.respuesta).some(f => /^[A-D]⁠$/.test(f.t)), `${e.titulo}: la letra va en negrita`);
  }
});

test('la idea estrena «sumandos» y «llevada», con simple y tres ejemplos', () => {
  const es = Glosario.porIdea(def)[0];
  assert.deepEqual(es.map(e => e.termino), ['sumandos', 'llevada']);
  for (const e of es) { assert.ok(e.simple, e.termino); assert.ok(e.ejemplos.length >= 3, e.termino); }
});

test('los números de la predicción y de la misión no aparecen antes', () => {
  const antes = [...idea.lee.tarjetas.map(t => plano([t.texto, t.ecuacion || ''])),
    ...def.glosario.filter(g => ['sumandos', 'llevada'].includes(g.termino)).flatMap(g => [g.def, g.simple, ...g.ejemplos]),
    ...idea.ejemplos.map(e => plano([e.enunciado, ...(e.solucion || []).map(x => [x.texto, x.ecuacion || '']), e.respuesta]))].join(' | ');
  assert.ok(!/34\(5\)|23\(5\)|112/.test(antes), 'la predicción');
  assert.ok(!(/\b47\b/.test(antes) && /\b38\b/.test(antes)), 'la misión');
  for (const t of idea.lee.tarjetas) assert.ok(!/\(5\)|₍₅₎/.test(plano([t.texto, t.ecuacion || ''])), 'Lee no usa la base 5');
});

test('notación: × y nunca «·»; 34₍₅₎ y nunca (34)₅', () => {
  for (const { donde, x } of lecturas()) {
    // El separador de dos relaciones solo va en la regla (cada una en su línea).
    const t = donde === 'regla' ? plano(x).replace(/ · /g, ' ') : plano(x);
    assert.ok(!/·/.test(t), `${donde}: «·» en ${t}`);
    assert.ok(!/\(\d+\)[₀-₉]/.test(t), `${donde}: notación vieja`);
  }
});
