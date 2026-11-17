// Pruebas propias de «Sistemas de numeración» (además del validador común de contenido/teoria/teoria.test.js). Cubren las
// cinco ideas, rehechas contra el contrato (fase 2: agrupar; fase 3, 17 nov: descomposición, cambio de base, base
// desconocida y conteo de cifras):
//   - un color fijo por magnitud (docs/molde-unidad.md §5b; cabecera de numeracion.js): cada ficha de color que lee el
//     alumno dice su magnitud (m) y lleva el color de la tabla def.colores; si una magnitud cambia de color, falla. La
//     cantidad en base 10 violeta, la base turquesa, las cifras naranja, la segunda base verde; nunca carmín;
//   - la unidad cumple el contrato de calidad 2 con los temas del catálogo, y cada idea estrena sus palabras;
//   - ninguna figura de Predice ni de un ejemplo delata la respuesta (lo que se pide va con «?» en tinta);
//   - la notación 23₍₅₎ no se usa antes de explicarse (tarjeta 2 de «Lee») y nunca la vieja (132)₄;
//   - las misiones se cumplen con un solo caso y su «bien» no dice la predicción;
//   - «Ahora tú» trae cuatro opciones distintas en 400 semillas y su respuesta cuadra con un cálculo aparte (fuerza bruta,
//     sin el código de la unidad); «Así se resuelve» no hace la pregunta de «Ahora tú» y también cuadra;
//   - la letra de una alternativa va en negrita (letra) en la respuesta; las escalas del dibujo no saltan.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const Kit = require('../../../nucleo/kit/kit.js');
const Teoria = require('../../../nucleo/teoria.js');
const Glosario = require('../../../nucleo/glosario.js');
const E = require('../../../nucleo/ecuacion.js');
const def = require('./numeracion.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
const P = Kit.piezas['arit-puesto'];
const IDEAS = ['agrupar', 'descomposicion', 'cambio-base', 'base-desconocida', 'conteo-cifras'];
const idea = id => def.ideas.find(i => i.id === id);
const SEMILLAS = 400;

const fichas = x => (x === null || x === undefined || typeof x !== 'object' ? [] : Array.isArray(x) ? x.flatMap(fichas)
  : typeof x.v === 'string' && /^c-/.test(x.v) ? [x] : Object.values(x).flatMap(fichas));
// Texto plano de partes (numerales como 23(5)).
const limpio = x => (Array.isArray(x) ? x.filter(y => y !== undefined && y !== null).map(limpio) : x);
const plano = x => E.texto(x === undefined || x === null ? '' : limpio(x));
const sinEsp = t => t.replace(/[\s ]/g, '');

// Todo lo que el alumno lee en una idea: { donde, partes }.
function lecturas(i) {
  const out = [], add = (donde, x) => out.push({ donde, x });
  const j = i.juega;
  for (const [k, t] of (i.lee.tarjetas || []).entries()) add(`lee ${k + 1}`, [t.titulo, t.texto, t.ecuacion]);
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

test('la tabla de colores de la unidad: cantidad violeta, base turquesa, cifras naranja, segunda base verde', () => {
  assert.deepEqual(def.colores, { cantidad: 'f', base: 'i', cifras: 'o', 'segunda base': 'd' });
  assert.ok(!Object.values(def.colores).includes('h'), 'sin carmín');
  assert.equal(def.calidad, 2);
  assert.deepEqual(def.ideas.map(i => i.id), IDEAS);
});

test('un color por magnitud: cada ficha de las cinco ideas dice su magnitud y lleva su color', () => {
  const porMag = {};
  for (const id of IDEAS) for (const { donde, x } of lecturas(idea(id))) for (const f of fichas(x)) {
    assert.ok(f.m in def.colores, `${id} ${donde}: «${f.t}» sin magnitud (m = ${f.m})`);
    assert.equal(f.v, `c-${def.colores[f.m]}`, `${id} ${donde}: «${f.t}» (${f.m}) en ${f.v}`);
    porMag[f.m] = (porMag[f.m] || 0) + 1;
  }
  for (const m of Object.keys(def.colores)) assert.ok(porMag[m] > 20, `${m}: ${porMag[m]} fichas`);
  // La segunda base solo en la idea 3.
  for (const id of IDEAS.filter(x => x !== 'cambio-base')) assert.ok(!lecturas(idea(id)).some(l => fichas(l.x).some(f => f.m === 'segunda base')), id);
  // Los controles: los caramelos y el último boleto (la cantidad) violeta; la base turquesa.
  const color = (id, c) => idea(id).juega.controles.find(x => x.id === c).color;
  assert.equal(color('agrupar', 'n'), 'c-f'); assert.equal(color('agrupar', 'b'), 'c-i');
  assert.equal(color('descomposicion', 'b'), 'c-i');
  assert.equal(color('cambio-base', 'n'), 'c-f'); assert.equal(color('cambio-base', 'b'), 'c-i');
  assert.equal(color('base-desconocida', 'b'), 'c-i');
  assert.equal(color('conteo-cifras', 'P'), 'c-f');
  // Ni la teoría ni el laboratorio usan el carmín ni colores sueltos fuera de la tabla.
  const txt = fs.readFileSync(path.join(__dirname, 'numeracion.js'), 'utf8');
  assert.ok(!/c-h/.test(txt.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '')), 'carmín en el código');
});

// Todas las figuras de una idea: { nombre, pieza, datos, estado }.
function figuras(i) {
  const out = [], add = (nombre, dib, pz) => { if (dib && dib.datos) out.push({ nombre, pieza: dib.pieza || pz || i.pieza, datos: dib.datos, estado: dib.estado || {} }); };
  for (const [k, t] of i.lee.tarjetas.entries()) add(`lee ${k + 1}`, t.dibujo, t.pieza);
  for (const v of Teoria.grilla(i.juega.controles).filter((_, k) => k % 7 === 0)) add(`juego ${JSON.stringify(v)}`, i.juega.dibujo(v), i.juega.pieza);
  add('predice', i.predice.dibujo, i.predice.pieza); add('revelar', i.predice.revelar, i.predice.pieza);
  i.mira.pasos.forEach((p, k) => add(`mira ${k + 1}`, { datos: i.mira.datos, estado: p.estado }, i.mira.pieza));
  for (const [k, e] of i.ejemplos.entries()) add(`ejemplo ${k + 1}`, e.figura);
  for (let s = 0; s < 40; s++) {
    const r = i.resuelve.generar(s); add(`resuelve ${s}`, r.dibujo, i.resuelve.pieza); r.pasos.forEach(x => add(`resuelve ${s}`, x.dibujo, i.resuelve.pieza));
    const a = i.ahoraTu.generar(s); add(`ahora tú ${s}`, a.dibujo, i.ahoraTu.pieza); if (a.solucion.dibujo) add(`ahora tú ${s}`, a.solucion.dibujo, i.ahoraTu.pieza);
  }
  return out;
}

test('las figuras no usan el carmín ni colores fijos, y pintan la base en turquesa', () => {
  for (const id of IDEAS) for (const f of figuras(idea(id))) {
    const s = Kit.piezas[f.pieza].dibujar(f.datos, f.estado);
    assert.ok(!/var\(--c-h\)|#[0-9a-f]{6}\b/i.test(s), `${id} ${f.nombre}: carmín o color fijo`);
    if (/class="ar-bolsita"/.test(s)) assert.match(s, /class="ar-bolsita"><path[^>]*stroke="var\(--c-i\)"/);
  }
});

test('la unidad cumple el contrato de calidad 2 con los temas del catálogo, y cada idea estrena sus palabras', () => {
  const cat = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../catalogo/cursos/aritmetica.json'), 'utf8')).unidades.find(u => u.id === def.unidad);
  assert.ok(cat.temas.includes('Base desconocida y cifras ocultas'));
  const p = Teoria.problemas(def, { semillas: 60, temas: cat.temas });
  assert.deepEqual(p, [], p.join('\n'));
  assert.deepEqual(Glosario.porIdea(def).map(es => es.map(e => e.termino)), [
    ['base de numeración', 'cifra', 'numeral', 'orden'],
    ['valor posicional', 'potencia', 'descomposición polinómica'],
    ['cociente', 'resto', 'cambio de base'],
    ['base desconocida', 'cifra oculta', 'acotar'],
    ['bloque', 'cantidad de cifras'],
  ]);
  assert.ok(def.glosario.length <= 30);
});

// Los textos de un SVG (cada <text> con sus <tspan> juntos).
const textosSVG = s => [...s.matchAll(/<text\b[^>]*>(.*?)<\/text>/g)].map(m => m[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/ /g, ' ').trim());
// Lo que se pide, en una respuesta: los numerales (23(5)), las cantidades de dos cifras o más y, en la idea 4, la base.
function pedidos(resp, id) {
  const out = [];
  const ir = x => {
    if (!x || typeof x !== 'object') return;
    if (Array.isArray(x)) { x.forEach(ir); return; }
    if (x.sub) { out.push(plano([x])); return; }
    if (x.m && /^\d[\d\s ]*$/.test(String(x.t)) && (sinEsp(String(x.t)).length >= 2 || (id === 'base-desconocida' && x.m === 'base'))) out.push(sinEsp(String(x.t)));
    Object.values(x).forEach(ir);
  };
  ir(resp);
  return out;
}
const muestra = (ts, q) => ts.some(t => sinEsp(t) === q || new RegExp(`(^|[^\\d])${q.replace(/[()]/g, '\\$&')}([^\\d]|$)`).test(sinEsp(t)));

test('ninguna figura de Predice ni de un ejemplo delata la respuesta: lo pedido va con «?», en tinta', () => {
  const dib = (i, d, pz) => Kit.piezas[d.pieza || pz || i.pieza].dibujar(d.datos, d.estado || {});
  // Predice: la respuesta correcta no está en la figura.
  const resp = { agrupar: '100(5)', descomposicion: '53', 'cambio-base': '201(3)', 'base-desconocida': '11', 'conteo-cifras': '192' };
  for (const id of IDEAS) {
    const i = idea(id), ts = textosSVG(dib(i, i.predice.dibujo, i.predice.pieza));
    assert.ok(!muestra(ts, resp[id]), `${id}: la predicción muestra ${resp[id]}`);
    assert.ok(sinEsp(plano(i.predice.opciones.find(o => o.correcta).texto)).startsWith(resp[id].replace(/\s/g, '')), id);
  }
  const pd = P.dibujar(idea('agrupar').predice.dibujo.datos);
  assert.ok(textosSVG(pd).includes('?(5)'), 'la etiqueta de la predicción va con «?»');
  // Ejemplos: nada de lo que piden aparece en su figura.
  let n = 0;
  for (const id of IDEAS) for (const [k, e] of idea(id).ejemplos.entries()) {
    if (!e.figura) continue;
    n++;
    const ts = textosSVG(dib(idea(id), e.figura));
    for (const q of pedidos(e.respuesta, id)) assert.ok(!muestra(ts, sinEsp(q)), `${id} ejemplo ${k + 1}: la figura muestra «${q}»`);
  }
  assert.ok(n >= 35, `${n} ejemplos con figura`);
  // «Ahora tú»: si trae figura del puesto, la etiqueta va con «?».
  for (let s = 0; s < SEMILLAS; s++) {
    const a = idea('agrupar').ahoraTu.generar(s);
    if (a.dibujo) assert.equal(a.dibujo.datos.etiqueta.cifras, '?', `ahora tú ${s}`);
    const c = idea('conteo-cifras').ahoraTu.generar(s);
    if (c.dibujo) assert.ok(c.dibujo.datos.total === '?' || c.dibujo.datos.pide === 'N', `conteo ahora tú ${s}`);
  }
});

test('las alternativas van en su lista (en línea aparte); la letra de la correcta va en negrita en la respuesta', () => {
  let n = 0;
  for (const id of IDEAS) for (const [k, e] of idea(id).ejemplos.entries()) {
    assert.ok(!/(^|\s)A\) /.test(plano(e.enunciado)), `${id} ejemplo ${k + 1}: alternativas pegadas al enunciado`);
    if (!e.alternativas) continue;
    n++;
    const letras = fichas(e.respuesta).filter(f => /^[A-E]\u2060$/.test(f.t));
    assert.equal(letras.length, 1, `${id} ejemplo ${k + 1}: la respuesta nombra su letra en negrita`);
    const alt = sinEsp(plano(e.alternativas['ABCDE'.indexOf(letras[0].t[0])]));
    assert.ok(sinEsp(plano(e.respuesta)).includes(alt) || /valores|bases/.test(plano(e.respuesta)), `${id} ejemplo ${k + 1}: ${letras[0].t[0]}) ${alt}`);
    // Ninguna línea del resuelto nombra una letra sin negrita.
    for (const x of e.solucion) assert.ok(!/(^|[\s,;:])[A-E](?=[\s,;:.])/.test(typeof x.texto === 'string' ? x.texto : x.texto.filter(y => typeof y === 'string').join('|')), `${id} ejemplo ${k + 1}: letra sin negrita`);
  }
  assert.ok(n >= 14, `${n} ejemplos con alternativas`);
});

test('notación: 23₍₅₎ recién desde la tarjeta 2 de «Lee», y nunca la vieja (132)₄', () => {
  const i = idea('agrupar'), t1 = i.lee.tarjetas[0];
  const txt1 = plano(t1.texto) + JSON.stringify(t1.dibujo.datos);
  assert.ok(!/₍|\(\d\)|etiqueta/.test(txt1), 'la tarjeta 1 no usa la escritura con base');
  assert.ok(/23₍₅₎/.test(plano(i.lee.tarjetas[1].texto)), 'la tarjeta 2 la presenta');
  for (const id of IDEAS) {
    const todo = lecturas(idea(id)).map(l => plano(l.x)).join('\n') + JSON.stringify(idea(id).ejemplos);
    assert.ok(!/\(\d+\)[₀-₉]/.test(todo), `${id}: la escritura vieja (132)₄`);
  }
  assert.ok(!/\(\d+\)[₀-₉]/.test(JSON.stringify(def.glosario) + JSON.stringify(def.laboratorio.map(m => m.invitaciones))));
  // La raya: un numeral con letras siempre la lleva (a̅b̅₍ₙ₎ no es un producto).
  for (const id of IDEAS) for (const { donde, x } of lecturas(idea(id))) {
    const ir = y => { if (!y || typeof y !== 'object') return; if (Array.isArray(y)) { y.forEach(ir); return; }
      if (y.sub && y.sub[0] && y.sub[0].t && /[a-z]/.test(y.sub[0].t)) assert.fail(`${id} ${donde}: «${y.sub[0].t}» sin raya`);
      Object.values(y).forEach(ir); };
    ir(x);
  }
});

test('los ejemplos de la idea 1 no usan la situación de su predicción (un caramelo que llega)', () => {
  for (const [k, e] of idea('agrupar').ejemplos.entries()) {
    assert.ok(!/llega|agregan|un caramelo más/i.test(plano(e.enunciado)), `ejemplo ${k + 1}`);
    if (e.figura) assert.ok(!e.figura.datos.llega, `ejemplo ${k + 1}: figura con caramelos que llegan`);
  }
});

test('cada misión se cumple con un solo caso, no al abrir, y su «bien» no dice la respuesta de la predicción', () => {
  const unico = { agrupar: [{ n: 24, b: 6 }], descomposicion: [{ b: 6 }], 'cambio-base': [{ n: 75, b: 4, ronda: 3 }], 'base-desconocida': [{ b: 7 }], 'conteo-cifras': [{ P: 200 }] };
  const prohibido = { agrupar: /100|caja/, descomposicion: /53/, 'cambio-base': /201/, 'base-desconocida': /\b11\b|\b8\b/, 'conteo-cifras': /192/ };
  for (const id of IDEAS) {
    const j = idea(id).juega;
    assert.deepEqual(Teoria.grilla(j.controles).filter(v => j.mision.logrado(v)), unico[id], id);
    assert.ok(!prohibido[id].test(j.mision.bien), `${id}: ${j.mision.bien}`);
    assert.ok(!prohibido[id].test(plano(j.leyenda.map(x => x.s))), `${id}: la leyenda`);
  }
});

// ---------- Cálculo aparte (sin el código de la unidad) ----------
const aBase = (N, n) => { let s = ''; do { s = (N % n) + s; N = Math.floor(N / n); } while (N > 0); return s; };
const deBase = (t, n) => [...t].reduce((a, c) => a * n + Number(c), 0);
const sumaC = t => [...t].reduce((a, c) => a + +c, 0);
const cifrasDel = (a, z) => { let c = 0; for (let x = a; x <= z; x++) c += String(x).length; return c; };
const NUM = /(\d+)\((\d)\)/g;
const correcta = a => sinEsp(plano(a.opciones.find(o => o.correcta).texto));
function revisarAhora(id, check) {
  const i = idea(id), tipos = new Set();
  for (let s = 0; s < SEMILLAS; s++) {
    const a = i.ahoraTu.generar(s), ops = a.opciones;
    assert.equal(ops.length, 4, `${id} semilla ${s}`);
    assert.equal(new Set(ops.map(o => plano(o.texto))).size, 4, `${id} semilla ${s}: opciones repetidas`);
    assert.equal(ops.filter(o => o.correcta).length, 1);
    for (const o of ops.filter(x => !x.correcta)) assert.ok(o.error && o.siFuera, `${id} semilla ${s}`);
    tipos.add(check(plano(a.pregunta), correcta(a), s));
  }
  return tipos;
}

test('«Ahora tú» de la idea 1: cuatro opciones distintas y la respuesta cuadra con un cálculo aparte (400 semillas)', () => {
  const tipos = revisarAhora('agrupar', (q, r, s) => {
    const a = idea('agrupar').ahoraTu.generar(s), ops = a.opciones;
    if (s % 5 === 0) {   // mal escrito: la correcta tiene una cifra ≥ su base; las demás no
      const val = t => { const m = t.match(/^(\d+)\((\d+)\)$/); return m ? [...m[1]].every(c => +c < +m[2]) && m[1][0] !== '0' : /^\d+$/.test(t); };
      assert.ok(!val(r), `semilla ${s}: ${r} está bien escrito`);
      for (const o of ops.filter(x => !x.correcta)) assert.ok(val(sinEsp(plano(o.texto))), `semilla ${s}`);
    } else if (s % 5 === 1) assert.equal(r, `base${Math.max(...[...q.match(/numeral (\d+)/)[1]].map(Number)) + 1}`);
    else if (s % 5 === 2) { const m = q.match(/(\d+)\((\d)\)/), n = +m[2]; assert.equal(r, `${aBase(deBase(m[1], n) + 1, n)}(${n})`); }
    else if (s % 5 === 3) { const m = q.match(/(\d+)\((\d)\)\. Le agregan (\d+)/), n = +m[2]; assert.equal(r, `${aBase(deBase(m[1], n) + +m[3], n)}(${n})`); }
    else if (/misma base/.test(q)) assert.equal(r, `base${Math.max(...[...q.matchAll(/\b(\d{3,})\b/g)].flatMap(x => [...x[1]].map(Number))) + 1}`);
    else { const m = Math.max(...[...q.match(/numeral (\d+)/)[1]].map(Number)); assert.equal(r, `${9 - m}${9 - m === 1 ? 'base' : 'bases'}`); }
    return s % 5;
  });
  assert.equal(tipos.size, 5);
});

test('«Ahora tú» de la idea 2 (descomposición): la respuesta cuadra con un cálculo aparte', () => {
  const tipos = revisarAhora('descomposicion', (q, r, s) => {
    const t = s % 5, ns = [...q.matchAll(NUM)].map(m => [m[1], +m[2]]);
    if (t === 0) assert.equal(r, String(deBase(...ns[0])));
    else if (t === 1) { const v = ns.map(([c, n]) => deBase(c, n)), k = v.indexOf(Math.max(...v)); assert.equal(r, `${ns[k][0]}(${ns[k][1]})`); }
    else if (t === 2) {
      const m = q.match(/de ([a-d]+)\((\d)\)/), L = m[1], n = +m[2], k = L.length;
      const pes = e => (e === 0 ? '' : e === 1 ? `×${n}` : e === 2 ? `×${n}alcuadrado` : `×${n}alcubo`);
      assert.equal(r, [...L].map((l, i) => l + pes(k - 1 - i)).join('+'));
    } else if (t === 3) { const m = q.match(/a \+ b = (\d+), ¿cuánto vale ab\((\d)\)/); assert.equal(r, String((+m[2] + 1) * +m[1])); }
    else { const m = q.match(/numeral de (\d) cifras en base (\d)/); assert.equal(r, String(Number(m[2]) ** Number(m[1]) - 1)); }
    return t;
  });
  assert.equal(tipos.size, 5);
});

test('«Ahora tú» de la idea 3 (cambio de base): la respuesta cuadra con un cálculo aparte', () => {
  const tipos = revisarAhora('cambio-base', (q, r, s) => {
    const t = s % 4;
    if (t === 0) { const m = q.match(/Escribe (\d+) en base (\d)/); assert.equal(r, `${aBase(+m[1], +m[2])}(${m[2]})`); }
    else if (t === 1) { const m = q.match(/(\d+)\((\d)\)\. Se vuelve a empacar en bolsitas de (\d)/); assert.equal(r, `${aBase(deBase(m[1], +m[2]), +m[3])}(${m[3]})`); }
    else if (t === 2) { const m = q.match(/escribir (\d+) en base (\d)/); assert.equal(r, String(sumaC(aBase(+m[1], +m[2])))); }
    else {
      const m = q.match(/guarda (\d+) caramelos en paquetes llenos de 1, (\d)/), N = +m[1], n = +m[2];
      // Fuerza bruta: el menor número de paquetes de 1, n, n², n³ que suman N (cambio óptimo por programación dinámica).
      const tam = [1, n, n * n, n ** 3], mejor = Array(N + 1).fill(Infinity); mejor[0] = 0;
      for (let x = 1; x <= N; x++) for (const c of tam) if (c <= x) mejor[x] = Math.min(mejor[x], mejor[x - c] + 1);
      assert.equal(r, String(mejor[N]));
    }
    return t;
  });
  assert.equal(tipos.size, 4);
});

test('«Ahora tú» de la idea 4 (base desconocida): la respuesta cuadra con un cálculo aparte', () => {
  const tipos = revisarAhora('base-desconocida', (q, r, s) => {
    const t = s % 4;
    if (t === 0) {
      const m = q.match(/(\d)(\d)\(n\)(?: = | y tiene )(\d+)/), sirve = [];
      for (let n = 2; n <= 40; n++) if (+m[1] < n && +m[2] < n && +m[1] * n + +m[2] === +m[3]) sirve.push(n);
      assert.deepEqual([r], sirve.map(n => `n=${n}`));
    } else if (t === 1) {
      const m = q.match(/etiqueta (\d)(\d)\(n\) tiene (\d+) caramelos.*etiqueta (\d)(\d)\(n\)/);
      const n = [...Array(40).keys()].find(b => b > Math.max(+m[1], +m[2]) && +m[1] * b + +m[2] === +m[3]);
      assert.equal(r, String(+m[4] * n + +m[5]));
    } else if (t === 2) {
      const m = q.match(/numerales a(\d)\((\d)\) y (\d)a\((\d)\)/), [u, p, v, w] = m.slice(1).map(Number);
      let best = -1;
      for (let a = 1; a <= 9; a++) if (a < p && a < w) best = Math.max(best, a * p + u + v * w + a);
      assert.equal(r, String(best));
    } else {
      const S = +q.match(/suman (\d+)/)[1];
      const n = [...Array(20).keys()].find(b => b > 1 && 3 * (b - 1) === S);
      assert.equal(r, String(deBase(String(n - 1).repeat(3), n)));
    }
    return t;
  });
  assert.equal(tipos.size, 4);
});

test('«Ahora tú» de la idea 5 (conteo): la respuesta cuadra con un cálculo aparte', () => {
  const tipos = revisarAhora('conteo-cifras', (q, r, s) => {
    const t = s % 4;
    if (t === 0) assert.equal(r, String(cifrasDel(1, +sinEsp(q.match(/del 1 al ([\d\s]+)\./)[1]))));
    else if (t === 1) { const C = +sinEsp(q.match(/imprimió ([\d\s]+) cifras/)[1]); let N = 0; while (cifrasDel(1, N) < C) N++; assert.equal(r, `el${N}`); }
    else if (t === 2) { const m = q.match(/de (\d) cifras hay en base (\d)/), k = +m[1], n = +m[2]; let c = 0; for (let x = 1; x < n ** (k + 1); x++) if (aBase(x, n).length === k) c++; assert.equal(r, String(c)); }
    else { const N = +q.match(/escribe (\d+) con tres/)[1]; let c = 0; for (let n = 2; n <= N; n++) { let k = 0; for (let x = N; x > 0; x = Math.floor(x / n)) k++; if (k === 3) c++; } assert.equal(r, c === 1 ? '1base' : `${c}bases`); }
    return t;
  });
  assert.equal(tipos.size, 4);
});

test('«Así se resuelve» no hace la pregunta de «Ahora tú», y su respuesta cuadra con un cálculo aparte', () => {
  const plantilla = { agrupar: /caramelos sueltos\. Los empaca/, descomposicion: /^Dos puestos anotan/, 'cambio-base': /^Pasa \d+\(\d\) a base/, 'base-desconocida': /^Una bolsa cerrada dice/, 'conteo-cifras': /imprime los boletos del/ };
  for (const id of IDEAS) {
    const i = idea(id);
    for (let s = 0; s < SEMILLAS; s++) {
      const r = i.resuelve.generar(s), q = plano(r.enunciado), resp = sinEsp(plano(r.respuesta));
      assert.match(q, plantilla[id], `${id} resuelve ${s}`);
      assert.ok(!plantilla[id].test(plano(i.ahoraTu.generar(s).pregunta)), `${id} ahora tú ${s}`);
      if (id === 'agrupar') { const m = q.match(/tiene (\d+) caramelos sueltos.*bolsitas de (\d)/); assert.equal(resp, `Laetiquetaes${aBase(+m[1], +m[2])}(${m[2]})`); }
      if (id === 'descomposicion') { const m = q.match(/etiqueta, (\d+): uno tiene bolsitas de (\d) y el otro, de (\d)/); assert.equal(resp, `Elsegundotiene${deBase(m[1], +m[3]) - deBase(m[1], +m[2])}caramelosmás`); }
      if (id === 'cambio-base') { const m = q.match(/Pasa (\d+)\((\d)\) a base (\d)/); assert.equal(resp, `${m[1]}(${m[2]})=${aBase(deBase(m[1], +m[2]), +m[3])}(${m[3]})`); }
      if (id === 'base-desconocida') {
        const m = q.match(/dice (\d+)\(n\) y tiene (\d+)/), sirve = [];
        for (let n = 2; n <= 30; n++) if ([...m[1]].every(c => +c < n) && deBase(m[1], n) === +m[2]) sirve.push(n);
        assert.deepEqual(sirve.map(n => `Bolsitasde${n}caramelos`), [resp]);
      }
      if (id === 'conteo-cifras') { const m = q.match(/del (\d+) al (\d+)/); assert.equal(resp, `Gasta${cifrasDel(+m[1], +m[2])}cifras`); }
    }
  }
});

test('el dibujo no cambia de escala dentro del juego (en la idea 3, dentro de cada montón) ni entre los pasos de «Mira»', () => {
  for (const id of ['agrupar', 'descomposicion', 'base-desconocida']) {
    const i = idea(id), esc = new Set(Teoria.grilla(i.juega.controles).map(v => P.geometria(i.juega.dibujo(v).datos).s));
    assert.equal(esc.size, 1, id);
  }
  const i3 = idea('cambio-base');
  for (const v of Teoria.grilla(i3.juega.controles).filter(x => x.ronda === 0)) {
    const esc = new Set([0, 1, 2, 3].map(k => P.geometria(i3.juega.dibujo(Object.assign({}, v, { ronda: k })).datos).s));
    assert.equal(esc.size, 1, JSON.stringify(v));
  }
  for (const id of ['agrupar', 'descomposicion', 'base-desconocida']) {
    const i = idea(id), extra = id === 'cambio-base' ? [] : [P.geometria(i.predice.dibujo.datos).s, P.geometria(i.predice.revelar.datos).s];
    const em = new Set(i.mira.pasos.map(p => P.geometria(i.mira.datos, p.estado).s).concat(extra));
    assert.equal(em.size, 1, `${id}: ${[...em].join(', ')}`);
    // La escala fija de «Mira» es la que hace caber el paso más ancho (no la achica la pieza ni sobra).
    const cabe = Math.floor(Math.min(1.7, ...i.mira.pasos.map(p => P.geometria(i.mira.datos, p.estado).sCabe)) * 100) / 100;
    assert.equal([...em][0], Math.min(cabe, i.mira.datos.escala || 1.7), id);
  }
});

test('la mesa 3D y las otras mesas usan los colores de la unidad', () => {
  const m3 = def.laboratorio.find(m => m.id === 'bloques-base');
  assert.equal(m3.controles.find(c => c.id === 'b').color, 'c-i');
  for (const c of m3.controles.filter(x => x.id !== 'b')) assert.equal(c.color, 'c-o', c.id);
  for (const v of [{ b: 4, m: 0, c: 1, d: 2, u: 5 }, { b: 4, m: 0, c: 1, d: 2, u: 7 }]) {
    for (const g of m3.dibujo(v).datos.grupos) assert.ok([undefined, 'c-i'].includes(g.color), g.color);
    for (const f of fichas(m3.lectura(v))) assert.equal(f.v, `c-${def.colores[f.m]}`);
  }
  for (const m of def.laboratorio) for (const v of Teoria.grilla(m.controles).slice(0, 50)) for (const f of fichas(m.lectura(v))) assert.ok(f.m in def.colores, `${m.id}: ${f.t}`);
});
