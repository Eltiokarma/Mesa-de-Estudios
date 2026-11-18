// Pruebas de «Exponentes y radicales»: casos.json (calculados aparte, con un script que no usa el generador), un
// recálculo independiente en 600 problemas (logaritmos, Math.cbrt, Math.hypot, fuerza bruta y evaluar la expresión en
// un x cualquiera), fugas, los tipos por idea, los colores de la unidad, los códigos de error, el recuadro «Datos» en
// 400 semillas, el papel y que sistemas-ecuaciones ya no es de esta unidad (su repaso sale de aquí).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');
const formatear = require('../../nucleo/predicciones.js').formatear;
const UNIDAD = 'algebra.exponentes-y-productos-notables';

// ---- Camino independiente: claves escritas a mano y números calculados de otra manera ----
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const fr = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d) || 1; n /= g; d /= g; return `${n < 0 ? '−' : ''}${Math.abs(n)}${d === 1 ? '' : `/${d}`}`; };
const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
const indice = n => (n === 2 ? '' : String(n).split('').map(c => SUP[c]).join(''));
const cerca = x => Math.round(x * 1e6) / 1e6;
const VALOR_T = t => (t === 'π' ? Math.PI : Math.sqrt(Number(t.slice(1))));
// Fracción p/q que más se acerca a x, con q ≤ 60 (para pasar un logaritmo a fracción).
const aFraccion = x => { for (let q = 1; q <= 60; q++) { const p = Math.round(x * q); if (Math.abs(p / q - x) < 1e-9) return fr(p, q); } return null; };
function recalcular(p) {
  const d = p._datos;
  switch (d.tipo) {
    case 'una-potencia': return `${d.b}^${fr(d.p + d.q - d.t)}`;
    case 'hoja': { let capas = 1; for (let i = 0; i < d.m + d.n; i++) capas *= d.b; return capas; }
    case 'negativo': return `=1/${Math.round(1 / (d.sub === 'producto' ? d.b ** d.p * d.b ** (-(d.p + d.k)) : d.b ** d.p / d.b ** (d.p + d.k)))}`;
    case 'elevar': return `${d.b}^${aFraccion(Math.log((d.b ** d.p) ** d.q * d.b ** d.w) / Math.log(d.b))}`;
    case 'dato': { // x = log_b K, y el valor de la otra expresión en ese x
      const x = Math.log(d.K) / Math.log(d.b);
      return Math.round(d.sub === 'suma' ? d.b ** (x + d.j) : (d.b * d.b) ** x);
    }
    case 'factor-comun': { const x = 1.7, s = d.sub === 'resta' ? -1 : 1; return Math.round((d.b ** (x + d.p) + s * d.b ** (x + d.q)) / d.b ** x); }
    case 'misma-base': return `x=${aFraccion((d.N * Math.log(d.p) - Math.log(d.p ** d.j)) / Math.log(d.p ** d.k))}`;
    case 'dos-variables': {
      const lA = Math.log(d.p ** d.k1), lB = Math.log(d.p ** d.k2);   // x · lA = y · lB
      if (d.sub === 'cota') return cerca(d.T * lA / (lA + lB));       // y = x · lA/lB y x + y ≤ T
      const y = d.S * lA / (lA + lB), x = d.S - y;
      return `${d.pide}=${aFraccion(d.pide === 'x' ? x : y)}`;
    }
    case 'raiz-cuadrado': return d.sub === 'cuadrado' ? String(Math.sqrt((-d.k) ** 2)) : `−${-Math.round(Math.cbrt((-d.k) ** 3))}`;
    case 'producto-raices': return String(Math.round(d.sub === 'producto' ? Math.sqrt(d.a) * Math.sqrt(d.b) : Math.sqrt(d.a) / Math.sqrt(d.b)));
    case 'biohuertos': return Math.hypot(d.p, d.q);
    case 'simplificar': { const N = d.c * d.c * d.t; for (let s = Math.floor(Math.sqrt(N)); s >= 1; s--) if (N % (s * s) === 0) return `${s}r${N / (s * s)}`; break; }
    case 'resta-cuadrado':
      if (d.sub === 'una') return VALOR_T(d.t) > d.k ? `${d.t} − ${d.k}` : `${d.k} − ${d.t}`;
      return String(Math.round(Math.abs(d.k1 - VALOR_T(d.t)) + Math.abs(VALOR_T(d.t) - d.k2)));
    case 'semejantes': {
      const e = Math.round((Math.sqrt(d.c1 * d.c1 * d.t) + Math.sqrt(d.c2 * d.c2 * d.t) - Math.sqrt(d.c3 * d.c3 * d.t)) / Math.sqrt(d.t));
      return `${e === 1 ? '' : e}√${d.t}`;
    }
    case 'a-radical': return d.sub === 'a-potencia' ? `x^${fr(d.m, d.n)}` : `${indice(d.n)}√(x${SUP[d.m]})`;
    case 'caja': return d.sub === 'arista' ? `${d.V}^1/3` : `${d.A}^1/2`;
    case 'valor': return `=${Math.round(d.b ** (d.m / d.n))}`;
    case 'producto-fracc': return `x^${fr(d.a * d.n2 + d.b * d.n1, d.n1 * d.n2)}`;
    case 'suma-fracc': return `=${[d.t1, d.t2].reduce((s, [B, m, n]) => s + Math.round(B ** (m / n)), 0) - Math.round(d.t3[0] ** (d.t3[1] / d.t3[2]))}`;
    case 'anidado': return `x^${aFraccion((d.a + d.b / d.j) / d.k)}`;
    case 'ecuacion-raiz': return `x=${aFraccion(d.n * d.k / (d.sub === 'base2' ? 1 : 2))}`;
    default: throw new Error(`tipo sin recálculo: ${d.tipo}`);
  }
}
const igual = (a, b) => (typeof a === 'number' ? Math.abs(a - b) < 1e-9 : a === b);
probarGenerador(gen, { semillas: 600, recalcular, igual });
probarFugas(gen, { grupo: p => [p._datos.tipo, p._datos.sub || ''].join('/') });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla} (${c.entrada.tipo})`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.equal(p.respuesta.valor, c.esperado.respuesta);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.texto);
  });
}

const IDEAS = require('../../contenido/teoria/algebra/exponentes-y-productos-notables.js').ideas.map(i => i.id);
test('tipos por idea: las tres ideas de la teoría, y generar(semilla, { idea }) da solo los suyos', () => {
  assert.deepEqual(Object.keys(gen.TIPOS_POR_IDEA), IDEAS);
  for (const idea of IDEAS) {
    const vistos = new Set(), niveles = new Set();
    for (let s = 0; s < 400; s++) {
      const p = gen.generar(`i${s}`, { idea, unidad: UNIDAD });
      assert.equal(p._datos.idea, idea);
      assert.ok(gen.TIPOS_POR_IDEA[idea].includes(p._datos.tipo), `${idea}: salió ${p._datos.tipo}`);
      vistos.add(p._datos.tipo); niveles.add(p._datos.nivel);
    }
    assert.deepEqual([...vistos].sort(), [...gen.TIPOS_POR_IDEA[idea]].sort(), `${idea}: no salen todos sus tipos`);
    assert.deepEqual([...niveles].sort(), [1, 2, 3], `${idea}: niveles ${[...niveles]}`);
  }
});

test('salen todas las variantes y los errores de la teoría', () => {
  const tipos = new Set(), ids = new Set();
  for (let s = 0; s < 3000; s++) {
    const p = gen.generar(s), d = p._datos;
    tipos.add(d.tipo + (d.sub ? '/' + d.sub : ''));
    for (const a of p.alternativas) if (a.error) ids.add(a.error.id);
  }
  for (const t of ['una-potencia', 'hoja', 'negativo/producto', 'negativo/cociente', 'elevar', 'dato/suma', 'dato/cuadrado',
    'factor-comun/resta', 'factor-comun/suma', 'misma-base', 'dos-variables/suma', 'dos-variables/cota', 'raiz-cuadrado/cuadrado',
    'raiz-cuadrado/cubo', 'producto-raices/producto', 'producto-raices/cociente', 'biohuertos', 'simplificar', 'resta-cuadrado/una',
    'resta-cuadrado/dos', 'semejantes', 'a-radical/a-potencia', 'a-radical/a-raiz', 'caja/arista', 'caja/lado', 'valor',
    'producto-fracc', 'suma-fracc', 'anidado', 'ecuacion-raiz/base2', 'ecuacion-raiz/base4'])
    assert.ok(tipos.has(t), `no sale ${t}`);
  for (const id of ['AL9', 'AL11', 'AL32', 'TAL-EXP-NEG', 'TAL-EXP-POR', 'TAL-EXP-FRAC', 'TAL-EXP-PRODUCTO', 'TAL-EXP-COCIENTE',
    'TAL-EXP-BASE', 'TAL-EXP-ELEVAR', 'TAL-EXP-SUMA', 'TAL-EXP-RESTA', 'TAL-EXP-DATO', 'TAL-SIGNO', 'TAL-RAIZ-X', 'TAL-RAIZ-DOBLE',
    'TAL-RAIZ-FALTA', 'TAL-RAIZ-SALE', 'TAL-RAIZ-SIMP', 'TAL-RAIZ-CUBICA', 'TAL-FRAC-MEDIO', 'TAL-FRAC-INVIERTE', 'TAL-FRAC-ANIDA',
    'TAL-FRAC-AFUERA', 'TAL-FRAC-SUMA', 'TAL-FRAC-DIVIDE'])
    assert.ok(ids.has(id), `no sale ${id}`);
});

// Los códigos son los de la teoría de la unidad, salvo los nuevos (hipótesis, en la cabecera del generador). AL9 es
// parcial (Aguerrea y otros 2022; Matz 1982), como en el informe; los demás, hipótesis.
const NUEVOS = ['TAL-EXP-DOBLECES', 'TAL-EXP-ORDEN', 'TAL-EXP-FACTOR', 'TAL-EXP-SOLO-EXP', 'TAL-EXP-INVIERTE', 'TAL-RAIZ-CUARTO',
  'TAL-RAIZ-INCOMPLETA', 'TAL-RAIZ-UNA', 'TAL-FRAC-INDICE', 'TAL-FRAC-NEG', 'TAL-RAIZ-LADOS', 'TAL-EXP-PARTE'];
test('cada error usa un código de la teoría (o uno de los nuevos) con su respaldo; los nuevos no están en la teoría', () => {
  const teoria = fs.readFileSync(require.resolve('../../contenido/teoria/algebra/exponentes-y-productos-notables.js'), 'utf8');
  const deLaTeoria = new Set(teoria.match(/\b(AL\d+|TAL-[A-Z-]+[A-Z])\b/g));
  for (const n of NUEVOS) assert.ok(!deLaTeoria.has(n), `${n} ya está en la teoría: no es nuevo`);
  const vistos = new Set();
  for (let s = 0; s < 1500; s++) for (const a of gen.generar(s).alternativas.filter(x => x.error)) {
    const id = a.error.id;
    vistos.add(id);
    assert.ok(deLaTeoria.has(id) || NUEVOS.includes(id), `semilla ${s}: ${id} no es de la teoría`);
    assert.equal(a.error.respaldo, id === 'AL9' ? 'parcial' : 'hipotesis', `semilla ${s}: ${id} con respaldo ${a.error.respaldo}`);
    if (/^AL\d/.test(id)) assert.equal(a.error.fuente, 'docs/investigacion/algebra-funciones-ideas-erroneas.md');
  }
  for (const n of NUEVOS) assert.ok(vistos.has(n), `no sale ${n}`);
});

test('cada explicación empieza por lo que el alumno hizo bien, muestra lo que da su error y no nombra una letra', () => {
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s);
    for (const a of p.alternativas.filter(x => x.error)) {
      const e = a.error.explicacion;
      assert.match(e, /^Bien/, `semilla ${s}: ${e}`);
      assert.ok(e.includes(a.texto), `semilla ${s}: «${e}» no muestra ${a.texto}`);
      assert.ok(!/\b(alternativa|opción|letra) [A-E]\b|\([A-E]\)/.test(e), `semilla ${s}: nombra una letra: ${e}`);
    }
  }
});

// Un color fijo por magnitud, el de la teoría (cabecera de exponentes-y-productos-notables.js): el primer exponente y el
// primer radicando naranja, el segundo turquesa, el resultado violeta y solo en la solución. Sin carmín ni verde.
test('un color por magnitud: naranja, turquesa y violeta al resultado (solo en la solución); sin carmín ni verde', () => {
  const COLOR = { m: 'o', n: 'i', a: 'o', b: 'i', R: 'f' };
  for (let s = 0; s < 800; s++) {
    const p = gen.generar(s), V = p.variables, usadas = new Set();
    for (const [k, x] of Object.entries(V)) assert.equal(x.color, COLOR[k], `semilla ${s}: ${k} en ${x.color}`);
    const colores = Object.values(V).map(x => x.color);
    assert.equal(new Set(colores).size, colores.length, `semilla ${s}: dos variables con el mismo color`);
    for (const linea of [p.enunciado, p.pregunta, ...p.solucion]) for (const x of linea) {
      if (x && typeof x === 'object') { assert.ok(V[x.v], `semilla ${s}: «${x.t}» usa ${x.v}, que no está`); assert.ok(x.t, `semilla ${s}: tramo de color vacío`); usadas.add(x.v); }
      else assert.equal(typeof x, 'string', `semilla ${s}: tramo inválido`);
    }
    assert.deepEqual([...usadas].sort(), Object.keys(V).sort(), `semilla ${s}: variable sin usar`);
    for (const linea of [p.enunciado, p.pregunta]) for (const x of linea) assert.ok(!(x && x.v === 'R'), `semilla ${s}: violeta antes de responder`);
    assert.ok(p.solucion.some(l => l.some(x => x && x.v === 'R')), `semilla ${s}: el resultado sin violeta`);
    if (p._datos.idea === 'exponente-fraccionario') {
      if (V.m) assert.equal(V.m.nombre, 'el exponente de adentro');
      if (V.n) assert.equal(V.n.nombre, 'el índice');
    }
  }
});

test('notación: superíndices de verdad, «³√» y no «∛», signo menos tipográfico, sin «^» ni «*»', () => {
  const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? x.t : String(x));
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s);
    const todo = [p.enunciado, p.pregunta, ...p.solucion].map(plano).concat(p.datos, p.alternativas.map(a => a.texto)).join(' ');
    assert.ok(!/[∛∜^*]|\d-\d|\s-\d|\d\.\d/.test(todo), `semilla ${s}: ${todo}`);
    assert.ok(!/\b1 veces|\b1 dobleces|\bLos 1\b/.test(todo), `semilla ${s}: concordancia (${todo})`);
  }
});

// Recuadro «Datos» (docs/plan-calidad.md §3, punto 13): líneas cortas en texto plano, sin la respuesta, con la
// herramienta de cada tipo.
test('datos: una lista de líneas cortas, sin la respuesta y con la fórmula de cada tipo, en 400 semillas', () => {
  const palabras = t => t.split(/\s+/).filter(w => /\p{L}/u.test(w)).length;
  const MN = /aᵐᐟⁿ = ⁿ√\(aᵐ\)/;
  const FORMULA = {
    'una-potencia': /aᵐ ÷ aⁿ = aᵐ⁻ⁿ/, hoja: /(duplica|triplica) las capas/, negativo: /a⁻ⁿ = 1\/aⁿ/, elevar: /\(aᵐ\)ⁿ = aᵐⁿ/,
    dato: /aᵐ · aⁿ = aᵐ⁺ⁿ|\(aᵐ\)ⁿ = aᵐⁿ/, 'factor-comun': /factor común/, 'misma-base': /aʳ = aˢ/, 'dos-variables': /aʳ = aˢ/,
    'raiz-cuadrado': /número no negativo|elevado al cubo/, 'producto-raices': /√\(a [·÷] b\)/, biohuertos: /Lado de un cuadrado = √/,
    simplificar: /√\(a · b\)/, 'resta-cuadrado': /√\(x²\) = \|x\|/, semejantes: /p√t \+ q√t/, 'a-radical': MN, caja: /a¹ᐟⁿ = ⁿ√a/,
    valor: MN, 'producto-fracc': MN, 'suma-fracc': MN, anidado: MN, 'ecuacion-raiz': MN,
  };
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), d = p._datos;
    assert.ok(Array.isArray(p.datos) && p.datos.length, `semilla ${s}: datos debe ser una lista no vacía`);
    for (const l of p.datos) {
      assert.ok(typeof l === 'string' && l.trim() === l && l.length, `semilla ${s}: línea vacía o con espacios`);
      assert.ok(palabras(l) <= 22, `semilla ${s}: «${l}» tiene ${palabras(l)} palabras`);
      assert.ok(!/<[a-z/]|\bnull\b|\bNaN\b|\bundefined\b|^Dato:|_/i.test(l), `semilla ${s}: «${l}»`);
    }
    assert.equal(new Set(p.datos).size, p.datos.length, `semilla ${s}: líneas repetidas`);
    const todo = p.datos.join('\n');
    assert.match(todo, FORMULA[d.tipo], `semilla ${s} (${d.tipo}): falta su fórmula`);
    // La respuesta no está en los datos: ni su texto ni, si es un número de dos cifras o más, ese número.
    const c = p.alternativas.find(a => a.correcta).texto;
    if (!/^\d$/.test(c)) assert.ok(!todo.includes(c), `semilla ${s}: los datos traen la respuesta ${c}`);
    const num = (c.match(/^(?:x = |y = )?(\d+)(?: soles| capas| m)?$/) || [])[1];
    if (num && num.length > 1) assert.ok(!new RegExp(`(?<![\\d⁰-⁹])${num}(?![\\d])`).test(todo), `semilla ${s}: los datos traen ${num} (${c})`);
  }
});

test('el exponente fraccionario se escribe con la barra alta (x³ᐟ⁵), nunca con una barra suelta en el superíndice', () => {
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s);
    if (p._datos.idea !== 'exponente-fraccionario') continue;
    for (const a of p.alternativas) assert.ok(!/[⁰-⁹]\/[⁰-⁹]/.test(a.texto), `semilla ${s}: ${a.texto}`);
  }
});

test('nunca se queda sin cuatro alternativas (semillas 0 a 2000, de texto y por idea)', () => {
  for (let s = 0; s <= 2000; s++) gen.generar(s);
  for (const s of ['entrada-1', 'entrada-2', 'entrada-3', 'salida-1', 'salida-2', 'salida-3', 'papel-1', 'examen-x'])
    for (const idea of [undefined, ...IDEAS]) gen.generar(s, { unidad: UNIDAD, idea });
});

test('papel.json: 8 problemas de las tres ideas, con sus datos y su respuesta recalculada', () => {
  assert.equal(papel.problemas.length, 8);
  const ideas = new Set(), niveles = new Set();
  papel.problemas.forEach((pr, i) => {
    const p = gen.generar(`papel-${i + 1}`);
    ideas.add(p._datos.idea); niveles.add(p._datos.nivel);
    assert.ok(pr.enunciado.includes('Datos:'), pr.id);
    assert.ok(pr.respuesta.endsWith(p.alternativas.find(a => a.correcta).texto), pr.id);
    assert.ok(igual(recalcular(p), p.respuesta.valor), pr.id);
  });
  assert.deepEqual([...ideas].sort(), [...IDEAS].sort());
  assert.deepEqual([...niveles].sort(), [1, 2, 3]);
});

// sistemas-ecuaciones salió de esta unidad (Gerson, cuarta ronda, 18 nov): su práctica y su repaso son solo esta plantilla.
test('sistemas-ecuaciones ya no es de esta unidad: ni en el catálogo, ni en su ficha, ni en el repaso', () => {
  const raiz = path.join(__dirname, '..', '..');
  const cat = JSON.parse(fs.readFileSync(path.join(raiz, 'catalogo', 'cursos', 'algebra.json'), 'utf8'));
  assert.deepEqual(cat.unidades.find(u => u.id === UNIDAD).plantillas.filter(p => p !== 'cuadrado-crece'), ['exponentes-radicales']);
  const se = JSON.parse(fs.readFileSync(path.join(raiz, 'plantillas', 'sistemas-ecuaciones', 'plantilla.json'), 'utf8'));
  assert.ok(!se.unidades.includes(UNIDAD));
  const RT = require('../../nucleo/repaso-tipos.js');
  assert.ok(!Object.values(RT.TABLA['sistemas-ecuaciones']).includes(UNIDAD));
  // El repaso de la unidad sale de esta plantilla, que es solo suya: todo tipo que da es de la unidad.
  const ficha = JSON.parse(fs.readFileSync(path.join(__dirname, 'plantilla.json'), 'utf8'));
  assert.deepEqual(ficha.unidades, [UNIDAD]);
  assert.ok(RT.cubre(ficha, UNIDAD));
  for (let s = 0; s < 50; s++) assert.equal(RT.unidadDe(ficha, gen.generar(`r${s}`)), UNIDAD, `semilla ${s}`);
});
