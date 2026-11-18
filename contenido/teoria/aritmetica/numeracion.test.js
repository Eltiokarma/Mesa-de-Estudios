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
//   - la letra de una alternativa va en negrita (letra) en la respuesta; las escalas del dibujo no saltan;
//   - fase 8 (correcciones de la auditoría, 17 nov): ninguna figura recibe la envoltura { pieza, datos } en vez de sus
//     datos (A1); los números de una predicción o una misión no aparecen juntos antes (glosario, «Lee», el juego, la
//     pestaña Ejemplos; M1, M2, M7); un numeral de base desconocida lleva su base (M3); cada letra de una regla o de un
//     dato se dice en palabras (q, p, u, k; M4) y a es siempre una cifra (M6); la leyenda solo nombra números que se ven
//     (M8); los datos de un ejemplo no traen su respuesta (M9); cada nivel 3 trae una cuenta (M10); el distractor D de
//     «Una suma con base oculta» sale del error que nombra (M5); «muestra» no se marca como término de Estadística.
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
  const plantilla = { agrupar: /caramelos sueltos\. Los empaca/, descomposicion: /^Dos puestos anotan/, 'cambio-base': /^Pasa \d+\(\d\) a base/, 'base-desconocida': /^Un paquete cerrado dice/, 'conteo-cifras': /imprime los boletos del/ };
  for (const id of IDEAS) {
    const i = idea(id);
    for (let s = 0; s < SEMILLAS; s++) {
      const r = i.resuelve.generar(s), q = plano(r.enunciado), resp = sinEsp(plano(r.respuesta));
      assert.match(q, plantilla[id], `${id} resuelve ${s}`);
      assert.ok(!plantilla[id].test(plano(i.ahoraTu.generar(s).pregunta)), `${id} ahora tú ${s}`);
      if (id === 'agrupar') { const m = q.match(/tiene (\d+) caramelos sueltos.*bolsitas de (\d)/); assert.equal(resp, `Laetiquetaes${aBase(+m[1], +m[2])}(${m[2]})`); }
      if (id === 'descomposicion') { const m = q.match(/etiqueta, (\d+)\(n\): uno tiene bolsitas de (\d) y el otro, de (\d)/); assert.equal(resp, `Elsegundotiene${deBase(m[1], +m[3]) - deBase(m[1], +m[2])}caramelosmás`); }
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

// ---------- Fase 8: las correcciones de la auditoría (rutinas/auditoria/aritmetica.numeracion.md), cada una con su prueba ----------
// Todas las figuras de una idea, también los pasos de «Mira» y las de «Así se resuelve» y «Ahora tú».
function todasLasFiguras(i) {
  const out = [], add = (nombre, dib, pz) => { if (dib) out.push({ nombre, pieza: dib.pieza || pz || i.pieza, dib }); };
  for (const [k, t] of i.lee.tarjetas.entries()) add(`lee ${k + 1}`, t.dibujo, t.pieza);
  for (const v of Teoria.grilla(i.juega.controles).filter((_, k) => k % 5 === 0)) add(`juego ${JSON.stringify(v)}`, i.juega.dibujo(v), i.juega.pieza);
  add('predice', i.predice.dibujo, i.predice.pieza); add('revelar', i.predice.revelar, i.predice.pieza);
  i.mira.pasos.forEach((p, k) => add(`mira ${k + 1}`, { datos: i.mira.datos, estado: p.estado }, i.mira.pieza));
  for (const [k, e] of i.ejemplos.entries()) add(`ejemplo ${k + 1}`, e.figura);
  for (let s = 0; s < 40; s++) {
    const r = i.resuelve.generar(s); add(`resuelve ${s}`, r.dibujo, i.resuelve.pieza); r.pasos.forEach(x => add(`resuelve ${s}`, x.dibujo, i.resuelve.pieza));
    const a = i.ahoraTu.generar(s); add(`ahora tú ${s}`, a.dibujo, i.ahoraTu.pieza); if (a.solucion.dibujo) add(`ahora tú ${s}`, a.solucion.dibujo, i.ahoraTu.pieza);
  }
  return out;
}

test('A1: cada figura recibe sus datos, no la envoltura { pieza, datos, estado }, y dibuja algo más que su lienzo vacío', () => {
  let n = 0;
  for (const id of IDEAS) for (const { nombre, pieza, dib } of todasLasFiguras(idea(id))) {
    n++;
    assert.ok(dib.datos && typeof dib.datos === 'object', `${id} ${nombre}: sin datos`);
    assert.ok(!('pieza' in dib.datos), `${id} ${nombre}: la figura recibe la envoltura (con «pieza») en vez de sus datos`);
    const pz = Kit.piezas[pieza], e = dib.estado || {};
    assert.notEqual(pz.dibujar(dib.datos, e), pz.dibujar({}, e), `${id} ${nombre}: dibuja el lienzo vacío`);
  }
  assert.ok(n > 300, `${n} figuras`);
  // El caso de la auditoría: la primera tarjeta de «Lee» de la idea 3 muestra los 75 caramelos.
  const t1 = idea('cambio-base').lee.tarjetas[0];
  assert.ok(textosSVG(P.dibujar(t1.dibujo.datos)).some(t => /75 caramelos/.test(t)), 'lee 1 de la idea 3: el montón de 75');
});

// Texto plano de cualquier cosa que lee el alumno, con 203₍₅₎ escrito como 203(5) (igual que plano()).
const SUBN = '₀₁₂₃₄₅₆₇₈₉';
const norm = t => String(t).replace(/₍([₀-₉ₙ?]+)₎/g, (m, d) => `(${[...d].map(c => (c === 'ₙ' ? 'n' : c === '?' ? '?' : SUBN.indexOf(c))).join('')})`);
const textoDe = x => norm(typeof x === 'string' ? x : plano(x));
const tiene = (t, tok) => new RegExp(`(^|[^\\d])${tok.replace(/[()?]/g, '\\$&')}(?![\\d])`).test(t);
const svgDe = (pz, dib) => (dib ? textosSVG(Kit.piezas[dib.pieza || pz].dibujar(dib.datos, dib.estado || {})).join(' | ') : '');

test('M1, M2 y M7: los números de una predicción o una misión no aparecen juntos antes de tiempo', () => {
  // Cada caso: los números que, juntos, dan resuelta la predicción o la misión.
  const PRED = { agrupar: [['44(5)', '100(5)']], descomposicion: [['203(5)', '53']], 'cambio-base': [['19', '201(3)']],
    'base-desconocida': [['31(n)', '25'], ['13(n)', '11'], ['13', '11', '8']], 'conteo-cifras': [['100', '192']] };
  const MISION = { agrupar: [['40(6)', '24']], descomposicion: [['132', '56']], 'cambio-base': [['75', '1023(4)']],
    'base-desconocida': [['23', '17', '7']], 'conteo-cifras': [['492', '200']] };
  // Lo que se puede abrir antes de jugar: el glosario entero (desde cualquier subrayado), los ejemplos de todas las ideas
  // (la pestaña Ejemplos no se cierra por idea) y «Lee» de esta idea y de las anteriores.
  const glosario = def.glosario.flatMap(g => [g.def, g.simple || ''].concat(g.ejemplos).map(t => ({ donde: `glosario «${g.termino}»`, t: textoDe(t) })));
  const ejemplos = def.ideas.flatMap(i => i.ejemplos.map((e, k) => ({ donde: `${i.id} ejemplo ${k + 1}`,
    t: [e.enunciado, e.alternativas, e.datos, e.solucion, e.respuesta].map(textoDe).join(' | ') + ' | ' + svgDe(i.pieza, e.figura) })));
  for (const [k, id] of IDEAS.entries()) {
    const i = idea(id), j = i.juega;
    const lee = def.ideas.slice(0, k + 1).flatMap(x => x.lee.tarjetas.map((t, m) => ({ donde: `${x.id} lee ${m + 1}`,
      t: [t.titulo, t.texto, t.ecuacion].map(textoDe).join(' | ') + ' | ' + svgDe(t.pieza || x.pieza, t.dibujo && Object.assign({ pieza: t.pieza || x.pieza }, t.dibujo)) })));
    const juego = [{ donde: 'consigna', t: textoDe(j.consigna) }, { donde: 'misión', t: textoDe([j.mision.texto, j.mision.bien]) },
      { donde: 'leyenda', t: textoDe(j.leyenda.map(x => [x.s, ' ', x.t])) }]
      .concat(Teoria.grilla(j.controles).map(v => ({ donde: `juego ${JSON.stringify(v)}`, t: textoDe(j.lectura(v)) + ' | ' + svgDe(j.pieza, j.dibujo(v)) })));
    const revisar = (casos, fuentes, que) => { for (const caso of casos) for (const f of fuentes)
      assert.ok(!caso.every(tok => tiene(f.t, tok)), `${id}: ${f.donde} trae juntos ${caso.join(', ')} (${que}): ${f.t.slice(0, 160)}`); };
    revisar(PRED[id], glosario.concat(lee, juego, ejemplos), 'la predicción');
    revisar(MISION[id], glosario.concat(lee, ejemplos), 'la misión');
  }
  // M7: el juego de la idea 5 no da hechos los bloques de una y dos cifras (9 × 1 = 9 y 90 × 2 = 180 son Predice).
  const j5 = idea('conteo-cifras').juega;
  for (const v of Teoria.grilla(j5.controles)) {
    const t = textoDe(j5.lectura(v)) + ' | ' + svgDe(j5.pieza, j5.dibujo(v));
    assert.ok(!/= 180\b|\b189\b|\b9 × 1|\b90 × 2/.test(t), `juego ${v.P}: ${t}`);
  }
  // M2: los niveles 1 y 2 de la idea 2 no llevan un 0 entre otras cifras (lo reserva su predicción).
  for (const [k, e] of idea('descomposicion').ejemplos.entries()) if (e.nivel < 3)
    for (const m of textoDe(e.enunciado).matchAll(/(\d+)\((\d)\)/g)) assert.ok(!/[1-9]0+[1-9]/.test(m[1]), `ejemplo ${k + 1}: ${m[0]}`);
});

test('M3: un numeral de base desconocida lleva su base (sin base escrita, la regla dice que es 10)', () => {
  // Las cifras de un numeral sueltas (fuera de un subíndice, después de «numeral», «etiqueta» o en su lista) en una
  // pregunta que habla de la base. Una suma de cifras («suman 15») no es un numeral.
  const sueltas = x => { const out = [];
    const ir = y => { if (!y || typeof y !== 'object') return;
      if (Array.isArray(y)) { y.forEach((z, k) => { const antes = typeof y[k - 1] === 'string' ? y[k - 1] : '';
        if (z && z.m === 'cifras' && /^\d{2,}$/.test(String(z.t)) && /(numerales?|etiqueta|dice|,| y) *$/.test(antes)) out.push(z.t); else ir(z); }); return; }
      if (y.sub || y.raya) return; Object.values(y).forEach(ir); };
    ir(x); return out; };
  const pregs = [];
  for (const id of IDEAS) {
    const i = idea(id);
    for (const [k, e] of i.ejemplos.entries()) pregs.push([`${id} ejemplo ${k + 1}`, e.enunciado]);
    for (let s = 0; s < SEMILLAS; s++) pregs.push([`${id} ahora tú ${s}`, i.ahoraTu.generar(s).pregunta]);
    for (let s = 0; s < 40; s++) pregs.push([`${id} resuelve ${s}`, i.resuelve.generar(s).enunciado]);
    // Las consignas (texto plano): ninguna etiqueta sin base.
    assert.ok(!/etiqueta (dice )?\d+[^\d₍(]/.test(i.juega.consigna), `${id}: consigna «${i.juega.consigna}»`);
  }
  for (const [donde, q] of pregs) if (/base/.test(textoDe(q))) assert.deepEqual(sueltas(q), [], `${donde}: «${textoDe(q)}»`);
});

test('M4 y M6: cada letra de una regla o de un dato se dice en palabras, y a es siempre una cifra', () => {
  const lineas = [];
  for (const id of IDEAS) {
    const i = idea(id);
    lineas.push([`${id} regla`, textoDe([i.regla.ecuacion, ' | ', i.regla.condicion, ' | ', i.regla.texto])]);
    for (const [k, e] of i.ejemplos.entries()) for (const d of e.datos || []) lineas.push([`${id} ejemplo ${k + 1}`, textoDe(d)]);
    for (let s = 0; s < 60; s++) {
      for (const d of i.ahoraTu.generar(s).datos || []) lineas.push([`${id} ahora tú ${s}`, textoDe(d)]);
      for (const d of i.resuelve.generar(s).datos || []) lineas.push([`${id} resuelve ${s}`, textoDe(d)]);
    }
  }
  assert.ok(lineas.some(([, t]) => /\bq\b/.test(t)));
  for (const [donde, t] of lineas) {
    if (/\bq × /.test(t)) assert.match(t, /cociente/, `${donde}: la q sin decir qué es: ${t}`);
    if (/\bu − p\b/.test(t)) assert.match(t, /primero|primer/, `${donde}: p y u sin decir qué son: ${t}`);
    // La a es una cifra en toda la unidad: nunca el extremo de un bloque.
    assert.ok(!/z − a|de a hasta|\ba\b.*\bhasta z\b/i.test(t), `${donde}: a como extremo: ${t}`);
  }
  // La regla de la idea 5 dice qué son p, u y k.
  assert.match(textoDe(idea('conteo-cifras').regla.condicion), /p: el primero; u: el último; k: cifras/);
});

test('M8: la leyenda del juego solo nombra números que se ven al empezar (en la figura o en la lectura)', () => {
  for (const id of IDEAS) {
    const j = idea(id).juega, v0 = Object.fromEntries(j.controles.map(c => [c.id, c.inicio]));
    const visto = textoDe(j.lectura(v0)) + ' | ' + svgDe(j.pieza, j.dibujo(v0)) + ' | ' + textoDe(j.mision.texto);
    for (const x of j.leyenda) for (const m of textoDe(x.s).matchAll(/\d+/g)) assert.ok(tiene(visto, m[0]), `${id}: la leyenda nombra ${m[0]} y no se ve`);
  }
});

test('M9: los datos de un ejemplo no traen su respuesta', () => {
  for (const id of IDEAS) for (const [k, e] of idea(id).ejemplos.entries()) {
    const d = (e.datos || []).map(textoDe).join(' | ');
    for (const q of pedidos(e.respuesta, id)) assert.ok(!tiene(d, norm(q)), `${id} ejemplo ${k + 1}: los datos traen «${q}»`);
    assert.ok(!/izquierda cuenta|los restos, en el orden/i.test(d), `${id} ejemplo ${k + 1}: los datos dicen el paso`);
  }
});

test('M10: cada ejemplo de nivel 3 trae una cuenta, y en la idea 1 tienen varias rondas o dos condiciones', () => {
  for (const id of IDEAS) for (const [k, e] of idea(id).ejemplos.entries()) if (e.nivel === 3)
    assert.ok(e.solucion.some(x => x.ecuacion), `${id} ejemplo ${k + 1}: «${e.titulo}» sin ninguna cuenta`);
  const n3 = idea('agrupar').ejemplos.filter(e => e.nivel === 3);
  assert.ok(n3.filter(e => e.solucion.length >= 3).length >= 4, 'la idea 1: niveles 3 de un solo paso');
});

test('M5: el distractor D de «Una suma con base oculta» es el valor que da su error (pasar el 5 sumando)', () => {
  const e = idea('base-desconocida').ejemplos.find(x => x.titulo === 'Una suma con base oculta');
  // 23₍ₙ₎ + 32₍ₙ₎ = 5n + 5 = 45: bien, n = 8; con el 5 sumando, 5n = 45 + 5, n = 10; con B (7), 40; con A (9), 50.
  assert.equal(e.alternativas[3], String((45 + 5) / 5));
  assert.equal(e.alternativas[2], String((45 - 5) / 5));
  for (const [L, alt] of [['B', e.alternativas[1]], ['A', e.alternativas[0]]]) assert.match(textoDe(e.solucion.map(x => x.texto)), new RegExp(String(5 * +alt + 5)), L);
});

test('«muestra» (el verbo) no se marca como el término de Estadística', () => {
  assert.ok(def.glosarioSin.includes('muestra'));
});

// ---------- Ronda 2 del lector en frío (18 nov): rutinas/frio/aritmetica.numeracion.md, sección «Ronda 2» ----------
const ej = (id, titulo) => { const e = idea(id).ejemplos.find(x => x.titulo === titulo); assert.ok(e, `${id}: falta «${titulo}»`); return e; };
const textoSol = e => e.solucion.map(x => textoDe([x.texto, ' ', x.ecuacion || ''])).join(' | ');

test('R2 huecos 1: «Solo ceros y unos» dice por qué los restos van del último al primero, y lo da en Datos', () => {
  const e = ej('cambio-base', 'Solo ceros y unos'), d = (e.datos || []).map(textoDe).join(' | ');
  assert.match(d, /primer resto es la cifra de la derecha/);
  assert.match(d, /2 × 2 × 2 = 8/, 'los lugares de la base 2');
  assert.match(textoSol(e), /va a la derecha/);
  assert.match(textoSol(e), /1 × 8 \+ 1 × 4 \+ 0 × 2 \+ 1/);
  // Todo ejemplo de la idea 3 que lee los restos «del último al primero» trae esa regla en Datos.
  for (const x of idea('cambio-base').ejemplos) if (/del último/i.test(textoSol(x)))
    assert.ok((x.datos || []).map(textoDe).some(t => /primer resto es la cifra de la derecha/.test(t)), `«${x.titulo}» sin el orden de los restos en Datos`);
});

test('R2 huecos 2: «Una cifra repetida» escribe el «×», dice 36 = 6 × 6 y hace la división; ningún ejemplo pega un número a una letra', () => {
  const e = ej('descomposicion', 'Una cifra repetida'), s = textoSol(e);
  assert.match(s, /6 × 6 = 36/); assert.match(s, /185 ÷ 37 = 5/); assert.match(s, /37 × a/);
  assert.ok((e.datos || []).map(textoDe).some(t => /6(²| al cuadrado) = 6 × 6/.test(t)));
  // «36a», «5n», «10a»: un número pegado a una letra (fuera de un numeral, que va con su raya).
  const pegados = [];
  const ir = (x, donde) => { if (Array.isArray(x)) { x.forEach((y, k) => {
      if (typeof y === 'string' && /\d$/.test(y) && x[k + 1] && x[k + 1].m && /^[a-z]$/.test(x[k + 1].t)) pegados.push(`${donde}: «${y}${x[k + 1].t}»`);
      ir(y, donde); }); return; }
    if (typeof x === 'string') { const m = x.match(/(^|[\s=+−,:;])\d+[a-z](?![\p{L}\d])/u); if (m) pegados.push(`${donde}: «${m[0].trim()}»`); return; }
    if (x && typeof x === 'object' && !x.sub && !x.raya) Object.values(x).forEach(y => ir(y, donde)); };
  for (const id of IDEAS) for (const x of idea(id).ejemplos) ir([x.enunciado, x.datos, x.solucion.map(y => [y.texto, y.ecuacion])], `${id} «${x.titulo}»`);
  assert.deepEqual(pegados, []);
});

test('R2 huecos 3: «Cifras con un parámetro» dice en Datos que cada paréntesis bajo la raya es una sola cifra', () => {
  assert.ok(ej('base-desconocida', 'Cifras con un parámetro').datos.map(textoDe).some(t => /cada paréntesis es una sola cifra/.test(t)));
});

test('R2 huecos 4: «Hasta que dé 0» escribe el número en base 4; «¿Hasta qué boleto?» hace la cuenta antes de decir dónde termina', () => {
  const e = ej('cambio-base', 'Hasta que dé 0');
  assert.match(textoDe(e.respuesta), /50 = 302\(4\)/); assert.match(textoSol(e), /302\(4\)/);
  const h = ej('conteo-cifras', '¿Hasta qué boleto?'), k = h.solucion.findIndex(x => /99 \+ 15/.test(textoDe(x.ecuacion || '')));
  assert.ok(k >= 0);
  for (const x of h.solucion.slice(0, k + 1)) assert.ok(!/114/.test(textoDe(x.texto)), `«114» antes de la cuenta: ${textoDe(x.texto)}`);
});

test('R2 huecos 5: «Leer la etiqueta» dice en Datos que la base es lo que lleva cada bolsita, y no dibuja la bolsa cerrada', () => {
  const e = ej('agrupar', 'Leer la etiqueta');
  assert.ok(e.datos.map(textoDe).some(t => /la base: los caramelos de cada bolsita/.test(t)));
  assert.equal(e.figura, undefined, 'el dibujo solo repetía el enunciado');
  assert.equal(ej('descomposicion', 'La cifra del medio').figura, undefined, 'el paquete cerrado solo repetía los datos');
});

test('R2 símbolos: la raya, N junto a n, caja y cajón, «acota», la primera cifra, la escala, «puntas», la base n y «bolsa»', () => {
  // La raya se dice en la regla de las ideas 2 y 4 (donde está a̅b̅c̅ o a̅b̅).
  for (const id of ['descomposicion', 'base-desconocida']) assert.match(idea(id).regla.condicion, /raya/, id);
  // N mayúscula no queda al lado de n: ninguna regla ni dato de las ideas 1 a 4 la usa (va en palabras).
  for (const id of IDEAS.slice(0, 4)) {
    const i = idea(id), ts = [[i.regla.texto, i.regla.ecuacion, i.regla.condicion, i.aprendizaje]];
    for (const x of i.ejemplos) ts.push(x.datos || []);
    for (let s = 0; s < 40; s++) { ts.push(i.ahoraTu.generar(s).datos || []); ts.push(i.resuelve.generar(s).datos || []); }
    for (const t of ts) assert.ok(!/\bN\b/.test(textoDe(t)), `${id}: N en «${textoDe(t)}»`);
  }
  assert.ok(!/\bN\b/.test(idea('conteo-cifras').regla.condicion), 'la regla de la idea 5 no dice N junto a n');
  // La caja llega dicha en Predice 1; el cajón, en «Lee» de la idea 3.
  assert.match(textoDe(idea('agrupar').predice.pregunta), /bolsitas llenan una caja/);
  assert.match(textoDe(idea('cambio-base').lee.tarjetas[0].texto), /4 cajas en un cajón/);
  // «acota» con lo que quiere decir; la primera cifra con un ejemplo; la regla de la idea 1 sin la frase que no se entendió.
  assert.match(idea('base-desconocida').regla.texto, /acota las cifras ocultas: cada una es menor que n/);
  assert.match(idea('agrupar').regla.condicion, /05 es 5/);
  // Idea 5: sin «a la misma escala» ni «puntas»; la base n con un ejemplo de verdad; n = 10 en los boletos.
  const r5 = idea('conteo-cifras');
  assert.ok(!/misma escala/.test(textoDe(r5.juega.leyenda.map(x => [x.s, ' ', x.t]))));
  assert.match(textoDe(r5.regla.ecuacion), /en base 5, tres cifras: de 100\(5\) = 25 a 444\(5\) = 124/);
  assert.match(r5.regla.condicion, /En los boletos, n = 10/);
  for (const id of IDEAS) for (const { donde, x } of lecturas(idea(id))) {
    const t = textoDe(x);
    assert.ok(!/puntas/.test(t), `${id} ${donde}: «puntas»`);
    // El paquete cerrado no se llama «bolsa» (se confundía con la bolsita).
    assert.ok(!/\b[Bb]olsas?\b/.test(t), `${id} ${donde}: «bolsa» en «${t.slice(0, 80)}»`);
  }
  for (const id of IDEAS) for (const f of todasLasFiguras(idea(id))) assert.ok(!/\b[Bb]olsas?\b/.test(svgDe(f.pieza, f.dib).replace(/aria-label="[^"]*"/, '')), `${id} ${f.nombre}: «bolsa» en la figura`);
});

test('R2 colores: la segunda base con un solo verde (también en la tabla) y dicha; los dos extremos de un bloque en violeta; la a en naranja; el 6 de 6 × 6 en turquesa', () => {
  // La regla de la idea 3 trae un ejemplo con la segunda base en verde y dice que va en verde.
  assert.ok(fichas(idea('cambio-base').regla.ecuacion).some(f => f.m === 'segunda base'));
  assert.match(idea('cambio-base').regla.condicion, /verde/);
  // En «Así se resuelve» de la idea 3, la tabla divide entre la segunda base: su columna «entre» va en verde, como el texto.
  for (let s = 0; s < 40; s++) {
    const r = idea('cambio-base').resuelve.generar(s), tb = r.pasos.find(x => x.dibujo).dibujo.datos;
    assert.equal(tb.columnas[1].color, 'd', `resuelve ${s}`);
    assert.ok(tb.filas.every(f => f[1].color === 'd'), `resuelve ${s}: el divisor`);
    assert.match(textoDe(r.pasos[0].texto), /en verde, la base nueva/);
  }
  // «Del X al Y» en los ejemplos y en «Así se resuelve» de la idea 5: los dos extremos dados, en violeta (salvo el 1).
  const enunciados = idea('conteo-cifras').ejemplos.map(e => [e.titulo, e.enunciado]);
  for (let s = 0; s < 40; s++) enunciados.push([`resuelve ${s}`, idea('conteo-cifras').resuelve.generar(s).enunciado]);
  for (const [donde, q] of enunciados) {
    const violetas = fichas(q).filter(f => f.m === 'cantidad').map(f => sinEsp(f.t));
    for (const m of textoDe(q).matchAll(/del (\d+) al (\d[\d\s]*)/g)) {
      if (m[1] !== '1') assert.ok(violetas.includes(m[1]), `${donde}: el ${m[1]} sin color`);
      assert.ok(violetas.includes(sinEsp(m[2])), `${donde}: el ${m[2]} sin color`);
    }
  }
  // La cifra a que se pide o se nombra en un enunciado va en naranja (como después en la solución).
  for (const id of IDEAS) for (const e of idea(id).ejemplos) {
    const sueltas = (Array.isArray(e.enunciado) ? e.enunciado : [e.enunciado]).filter(x => typeof x === 'string').join('|');
    assert.ok(!/\b(cifra|tener|vale|de|en) a\b(?=[?,.|]| (cajas|sueltos|quedó|está))/.test(sueltas), `${id} «${e.titulo}»: la a en tinta`);
  }
  // «Una caja para 30»: el 6 de «bolsitas de 6» y de «6 × 6» es la base, en turquesa, como el 5.
  const c30 = ej('agrupar', 'Una caja para 30');
  assert.ok(fichas(c30.solucion).filter(f => f.m === 'base' && f.t === '6').length >= 3);
  // Ningún título de ejemplo se repite en la unidad.
  const titulos = def.ideas.flatMap(i => i.ejemplos.map(e => e.titulo));
  assert.equal(new Set(titulos).size, titulos.length, titulos.filter((t, k) => titulos.indexOf(t) !== k).join(', '));
});

test('R2 dibujos y controles: el deslizador dice por qué empieza donde empieza; «va en» se llena con su fila; la regla de la idea 2 dice n', () => {
  const desde = (id, c) => idea(id).juega.controles.find(x => x.id === c);
  for (const id of ['descomposicion', 'base-desconocida']) {
    assert.equal(desde(id, 'b').min, 4); assert.match(idea(id).juega.consigna, /desde 4: con 3, no existiría la cifra 3/, id);
  }
  const b1 = desde('agrupar', 'b');
  assert.match(idea('agrupar').juega.consigna, new RegExp(`de ${b1.min} a ${b1.max} caramelos`));
  // «Mira» de la idea 3: en el paso 1, la columna «va en» ya dice adónde va el primer resto.
  const mira = idea('cambio-base').mira, tb = mira.datos;
  assert.equal(tb.columnas[4].t, 'va en');
  assert.ok((tb.filas[0][4].paso || 0) <= mira.pasos[0].estado.paso, 'la fila 1 de «va en» se ve en el paso 1');
  assert.ok(tb.filas.every((f, i) => f[4].paso === f[0].paso), 'cada «va en» con su fila');
  // La figura de «La regla» de la idea 2 (el último paso de «Mira»): letrero con n y ningún lugar vacío bajo «b × n».
  const m2 = idea('descomposicion').mira, ult = m2.pasos[m2.pasos.length - 1].estado;
  const ts = textosSVG(P.dibujar(m2.datos, ult)).join(' | ');
  assert.match(ts, /1 bolsita = n caramelos/); assert.ok(!/= 5 caramelos/.test(ts));
  const g = P.geometria(m2.datos, ult);
  assert.ok(['cajas', 'bolsitas', 'sueltos'].every(o => g.d[o] > 0), 'cada lugar con algo dibujado');
});
