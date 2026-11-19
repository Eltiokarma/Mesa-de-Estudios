// Pruebas de «Ángulo trigonométrico y sistemas de medida»: casos.json (calculados aparte, con un script que no usa el
// generador), un recálculo independiente en 600 problemas (desde los datos del problema, con la vuelta en cada sistema y
// no con los factores 9/10 del generador), fugas, tipos por idea, errores, el recuadro «Datos» en 400 semillas,
// colores por sistema, escala y presupuesto de texto.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');

const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? String(x.t) : String(x));
const palabras = x => plano(x).split(/\s+/).filter(Boolean).length;

// ---- Camino independiente: todo se lleva a «fracción de vuelta» y de ahí al sistema pedido ----
const VUELTA = { sex: 360, cen: 400, rad: 2 * Math.PI };
const enVueltas = (x, de) => x / VUELTA[de];
const a = (fr, sis) => fr * VUELTA[sis];
const gm = (g, m) => `${g}° ${m}′`;
// «3π/10» con π como número: k π / 20 → texto canónico con el mismo armado (fracción reducida de π).
function piTexto(num, den) {
  const m = (function g(x, y) { return y ? g(y, x % y) : Math.abs(x); })(num, den), p = num / m, q = den / m;
  return `${p * q < 0 ? '−' : ''}${Math.abs(p) === 1 ? '' : Math.abs(p)}π${Math.abs(q) === 1 ? '' : '/' + Math.abs(q)}`;
}
// Grados sexagesimales exactos (enteros) → radianes como fracción de π: g/180.
const radDeGrados = g => `${piTexto(g, 180)} rad`;
function recalcular(p) {
  const d = p._datos;
  switch (d.tipo) {
    case 'signo': return d.sg * 360 * d.n / d.d;
    case 'seguidos': return d.g1 + d.g2;
    case 'giro-x': return (d.T - d.q1 + d.q2) / (d.p1 - d.p2);
    case 'convierte': return d.de === 'cen' ? a(enVueltas(d.c, 'cen'), 'sex') : a(enVueltas(d.s, 'sex'), 'cen');
    case 'complemento': {
      const total = d.sub === 'suplemento' ? 0.5 : 0.25, fr = d.de === 'cen' ? enVueltas(d.xc, 'cen') : enVueltas(d.xs, 'sex');
      return a(total - fr, d.de === 'cen' ? 'sex' : 'cen');
    }
    case 'triangulo': {
      if (d.sub === 'suma') return a(enVueltas(d.a, 'sex') + enVueltas(d.b, 'cen') + enVueltas(d.c, 'cen'), 'sex');
      const fr = 0.5 - enVueltas(d.xc, 'cen') - enVueltas(d.ys, 'sex');
      return Math.round(a(fr, d.en) * 1e9) / 1e9;
    }
    case 'decimal': return d.g + d.m / 60;
    case 'llevada': {
      const t = d.sub === 'suma' ? 60 * (d.g1 + d.g2) + d.m1 + d.m2 : d.sub === 'resta' ? 60 * (d.g1 - d.g2) + d.m1 - d.m2 : 60 * 90 - 60 * d.g2 - d.m2;
      return gm(Math.floor(t / 60), t % 60);
    }
    case 'entre-sistemas': {
      if (d.sub === 'minutero') return Math.round(a(d.t / 60, 'cen') * 100 * 1e6) / 1e6;
      if (d.sub === 'min-a-cen') return Math.round(a(enVueltas(d.de / 60, 'sex'), 'cen') * 100 * 1e6) / 1e6;
      if (d.sub === 'cen-a-min') return Math.round(a(enVueltas(d.de / 100, 'cen'), 'sex') * 60 * 1e6) / 1e6;
      return Math.round(a(enVueltas(d.de / 3600, 'sex'), 'cen') * 10000 * 1e6) / 1e6;
    }
    case 'a-radianes': {
      const g = d.sub === 'sex' ? d.g : Math.round(a(enVueltas(d.c, 'cen'), 'sex') * 1e9) / 1e9;
      // g puede salir con medio grado (20ᵍ = 18°): se escribe como fracción de 360.
      return Number.isInteger(g) ? radDeGrados(g) : `${piTexto(Math.round(2 * g), 360)} rad`;
    }
    case 'sin-pi': return d.sub === 'sinpi' ? Math.round(a(enVueltas(d.t, 'rad'), 'sex') * 10) / 10 : d.L / d.cm;
    case 'tres-sistemas-fig': {
      if (d.sub === 'cuadrilatero') return 360 - d.cs.reduce((x, y) => x + y, 0);
      const ter = Math.round(a(0.5 - enVueltas(d.a, 'sex') - enVueltas(d.xc, 'cen'), 'sex') * 1e9) / 1e9;
      return d.en === 'rad' ? radDeGrados(ter) : ter;
    }
    case 'con-k': {
      const g = { 's-a-c': 9 * d.k, 'c-a-s': 9 * d.k, 's-a-r': 9 * d.k, 'r-a-s': 9 * d.k }[d.sub];   // el ángulo, en grados
      if (d.sub === 's-a-c') return Math.round(a(enVueltas(g, 'sex'), 'cen') * 1e9) / 1e9;
      if (d.sub === 's-a-r') return piTexto(g, 180);
      return g;
    }
    case 'condicion': {
      // La condición, con S y C escritos desde la fracción de vuelta f: S = 360f, C = 400f. Se busca f por bisección.
      const F = [(S, C) => C - S, (S, C) => S + C, (S, C) => 2 * S - C, (S, C) => 3 * C - 2 * S, (S, C) => S / 3 + C / 5, (S, C) => C / 2 - S / 3][d.cond];
      const dato = Number(plano(p.enunciado).match(/= (\d+)\.$/)[1]);
      let lo = 0, hi = 2;
      for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (F(360 * m, 400 * m) < dato) lo = m; else hi = m; }
      return Math.round(a(lo, d.en) * 1e6) / 1e6;
    }
    case 'halla-r': {
      if (d.sub === 'expresion') { const [x, y, z, w] = d.e, S = 360 / 7, C = 400 / 7; return Math.round((x * S + y * C) / (z * S + w * C) * 1e9) / 1e9; }
      const F = [(S, C) => C - S, (S, C) => S + C, (S, C) => 2 * S - C, (S, C) => 3 * C - 2 * S, (S, C) => S / 3 + C / 5, (S, C) => C / 2 - S / 3][d.cond];
      const dato = Number(plano(p.enunciado).match(/= (\d+)\.$/)[1]);
      let lo = 0, hi = 2;
      for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (F(360 * m, 400 * m) < dato) lo = m; else hi = m; }
      return radDeGrados(Math.round(360 * lo));
    }
    default: throw new Error(`tipo sin recálculo: ${d.tipo}`);
  }
}
const igual = (esperado, valor) => (typeof esperado === 'number' ? Math.abs(esperado - valor) < 1e-6 : esperado === valor);

probarGenerador(gen, { semillas: 600, recalcular, igual });
probarFugas(gen);

test('casos.json: cada caso, recalculado aparte, da la alternativa correcta que ve el alumno', () => {
  assert.ok(casos.casos.length >= 15);
  for (const c of casos.casos) {
    const p = gen.generar(c.semilla, c.opciones || {});
    assert.deepEqual(p._datos, c.entrada, `semilla ${c.semilla}: otro problema`);
    assert.equal(p.alternativas.find(x => x.correcta).texto, c.esperado.texto, `semilla ${c.semilla}`);
    if (typeof c.esperado.valor === 'number') assert.ok(Math.abs(p.respuesta.valor - c.esperado.valor) < 1e-9, `semilla ${c.semilla}`);
    else assert.equal(p.respuesta.valor, c.esperado.valor);
  }
  assert.ok(new Set(casos.casos.map(c => c.entrada.tipo)).size === gen.TIPOS.length, 'un caso de cada tipo, por lo menos');
});

test('tipos por idea: las cinco ideas de la unidad, cada una con nivel 1, 2 y 3; generar(s, { idea }) da solo los suyos', () => {
  const U = require('../../contenido/teoria/trigonometria/angulo-trigonometrico.js');
  assert.deepEqual(Object.keys(gen.TIPOS_POR_IDEA), U.ideas.map(i => i.id));
  for (const [idea, tipos] of Object.entries(gen.TIPOS_POR_IDEA)) {
    assert.deepEqual(tipos.map(t => gen.NIVEL[t]).sort(), [1, 2, 3], idea);
    for (let s = 0; s < 60; s++) assert.equal(gen.generar(s, { idea })._datos.idea, idea);
  }
  for (const t of gen.TIPOS) for (let s = 0; s < 30; s++) assert.equal(gen.generar(`t${s}`, { tipo: t })._datos.tipo, t);
  const ids = new Set();
  for (let s = 0; s < 1500; s++) for (const x of gen.generar(s).alternativas) if (x.error) ids.add(x.error.id);
  for (const id of ['TRIG-SIN-SIGNO', 'TRIG-SIGNO-PIERDE', 'VUELTA-180', 'ALG-PARENTESIS', 'CONV-MISMO', 'CONV-INVERSA', 'CONV-SIMBOLO', 'SEX-DECIMAL',
    'SEX-PRESTA-100', 'MIN-MISMO', 'MIN-FACTOR-GRADO', 'MIN-SIN-SISTEMA', 'CONV-PI', 'RAD-200', 'TR1', 'TR2', 'SCR-SUMA', 'SCR-OTRA', 'SCR-K', 'SCR-SIN-20'])
    assert.ok(ids.has(id), `no sale ${id}`);
});

test('cada explicación empieza por lo que el alumno hizo bien, es corta y lleva el respaldo de su código', () => {
  for (let s = 0; s < 800; s++) {
    for (const x of gen.generar(s).alternativas.filter(y => y.error)) {
      assert.match(x.error.explicacion, /^Bien\b/, `semilla ${s}: ${x.error.explicacion}`);
      assert.ok(palabras(x.error.explicacion) <= 22, `semilla ${s}: ${x.error.explicacion}`);
      if (/^TR\d$/.test(x.error.id)) assert.ok(['parcial', 'documentado'].includes(x.error.respaldo) && x.error.fuente, `semilla ${s}: ${x.error.id}`);
      else assert.equal(x.error.respaldo, 'hipotesis', `semilla ${s}: ${x.error.id}`);
    }
  }
});

// Lee una alternativa como número en su sistema: «−270°», «40,5ᵍ», «2000ᵐ», «3π/10 rad» (en múltiplos de π), «43° 35′».
function aNumero(t) {
  let s = String(t).replace(/ rad$/, '').trim();
  let m = s.match(/^(\d+)° (\d+)′$/);
  if (m) return +m[1] + m[2] / 60;
  m = s.match(/^(−?)(\d*)π(?:\/(\d+))?$/);
  if (m) return (m[1] ? -1 : 1) * (m[2] ? +m[2] : 1) / (m[3] ? +m[3] : 1);
  return Number(s.replace(/[°ᵍᵐˢ′″]$/, '').replace('−', '-').replace(',', '.'));
}
test('ninguna alternativa queda fuera de escala (de 1/20 a 20 veces la correcta, en su unidad) ni es cero', () => {
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s), c = p.alternativas.find(x => x.correcta), cv = aNumero(c.texto);
    for (const x of p.alternativas) {
      const xv = aNumero(x.texto);
      if (!Number.isFinite(xv) || !Number.isFinite(cv) || /π/.test(c.texto) !== /π/.test(x.texto)) continue;
      assert.ok(xv !== 0 && Math.abs(xv / cv) >= 1 / 20 && Math.abs(xv / cv) <= 20, `semilla ${s}: ${x.texto} frente a ${c.texto}`);
    }
  }
});

test('presupuesto de texto: enunciado y pregunta hasta 40 palabras; sin punto decimal, null ni espacio de miles en los grados', () => {
  for (let s = 0; s < 800; s++) {
    const p = gen.generar(s);
    assert.ok(palabras(p.enunciado) + palabras(p.pregunta) <= 40, `semilla ${s}: ${plano(p.enunciado)} ${plano(p.pregunta)}`);
    const todo = [plano(p.enunciado), plano(p.pregunta), ...p.solucion.map(plano), ...p.alternativas.map(x => x.texto)].join(' ');
    assert.ok(!/\d\.\d|\bnull\b|\bNaN\b|undefined|\b1x\b|\+ \(-|\d \d{3}°/.test(todo), `semilla ${s}: ${todo}`);
  }
});

// Regla de colores de la unidad (cabecera de la teoría): el color dice el sistema. Todo número con °, ′ o ″ que va en
// color es carmín; con ᵍ, ᵐ o ˢ, turquesa; con π o rad, violeta. La idea 1 solo usa carmín. Ni naranja ni verde.
test('colores por sistema: carmín sexagesimal, turquesa centesimal, violeta radianes, en 600 semillas', () => {
  const COLOR = { sex: 'h', cen: 'i', rad: 'f' };
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    for (const [k, vv] of Object.entries(p.variables)) assert.equal(vv.color, COLOR[k], `semilla ${s}: ${k}`);
    if (p._datos.idea === 'sentido-signo') assert.deepEqual(Object.keys(p.variables), ['sex'], `semilla ${s}: la idea 1 es de un solo color`);
    for (const linea of [p.enunciado, p.pregunta, ...p.solucion]) for (const x of linea) {
      if (typeof x !== 'object') continue;
      assert.ok(p.variables[x.v], `semilla ${s}: «${x.t}» usa ${x.v}, que no está en variables`);
      if (/[ᵍᵐˢ]/.test(x.t) || /^C = /.test(x.t)) assert.equal(x.v, 'cen', `semilla ${s}: «${x.t}»`);
      if (/π|rad/.test(x.t)) assert.equal(x.v, 'rad', `semilla ${s}: «${x.t}»`);
      if (/[°′″]$/.test(x.t)) assert.equal(x.v, 'sex', `semilla ${s}: «${x.t}»`);
    }
  }
});

// Recuadro «Datos» (docs/plan-calidad.md §3, punto 13): líneas cortas con la fórmula de cada tipo, sin la respuesta ni
// consejos.
const FORMULA = {
  signo: ['1 vuelta = 360°', 'Giro antihorario: positivo'], seguidos: ['Giros seguidos'], 'giro-x': ['Giros seguidos', 'x es un número'],
  convierte: ['9° = 10ᵍ'], complemento: ['9° = 10ᵍ', 'lo que le falta'], triangulo: ['9° = 10ᵍ'],
  decimal: ['1° = 60′'], llevada: ['1° = 60′'], 'entre-sistemas': ['1ᵍ = 100ᵐ'],
  'a-radianes': ['π rad = 180° = 200ᵍ'], 'sin-pi': [/π rad = 180°|cuántas veces cabe el radio/], 'tres-sistemas-fig': ['π rad = 180°'],
  'con-k': ['S = 9k, C = 10k y R = πk/20'], condicion: ['S = 9k, C = 10k y R = πk/20'], 'halla-r': ['S = 9k, C = 10k y R = πk/20'],
};
test('datos: lista de líneas cortas, con la fórmula de cada tipo, sin la respuesta ni consejos, en 400 semillas', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), d = p._datos;
    assert.ok(Array.isArray(p.datos) && p.datos.length, `semilla ${s}: datos debe ser una lista no vacía`);
    for (const l of p.datos) {
      assert.ok(typeof l === 'string' && l.trim() === l && l.length, `semilla ${s}: línea vacía`);
      assert.ok(palabras(l) <= 22, `semilla ${s}: «${l}»`);
      assert.ok(!/^(Recuerda|Ojo|Truco|Tip|Consejo|Primero|Siempre|No olvides|Fíjate|Conviene)/i.test(l), `semilla ${s}: «${l}» es un consejo`);
    }
    assert.equal(new Set(p.datos).size, p.datos.length, `semilla ${s}: líneas repetidas`);
    const todo = p.datos.join('\n');
    for (const fo of FORMULA[d.tipo]) assert.ok(fo instanceof RegExp ? fo.test(todo) : todo.includes(fo), `semilla ${s} (${d.tipo}): falta «${fo}»`);
    const c = p.alternativas.find(x => x.correcta).texto;
    if (c.length >= 3) assert.ok(!new RegExp(`(^|[^\\d,π/])${c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\d,])`).test(todo), `semilla ${s}: los datos traen ${c}`);
  }
});

test('nunca se queda sin cuatro alternativas (semillas 0 a 3000 y de texto)', () => {
  for (let s = 0; s <= 3000; s++) gen.generar(s);
  for (const s of ['entrada-1', 'salida-3', 'papel-1', 'papel-8', 'alumno-7']) gen.generar(s);
});

// Auditoría (19 nov): k se dice en palabras en la línea de la fórmula general («S = 9k» solo no dice qué es k).
test('datos de la idea 5: la línea de S = 9k dice qué es k', () => {
  for (let s = 0; s < 200; s++) {
    const p = gen.generar(s, { idea: 'formula-general' }), l = p.datos.find(x => /9k/.test(x));
    assert.ok(l && /k = S ÷ 9/.test(l), `semilla ${s}: ${l}`);
  }
});
