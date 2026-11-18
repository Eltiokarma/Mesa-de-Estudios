// Pruebas de «Productos notables»: casos.json (calculados aparte, con un script que no usa el generador), un recálculo
// independiente en 600 problemas (se evalúa la expresión del enunciado con números y se compara con el valor de la
// alternativa correcta leída como texto; los polinomios, en tres valores de x), fugas, los tipos por idea, los colores de
// la unidad, los códigos de error, el recuadro «Datos» en 400 semillas, el papel, el catálogo y que la práctica no
// repite ninguna Predice de la teoría.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');
const UNIDAD = 'algebra.productos-notables';
const TEORIA = require.resolve('../../contenido/teoria/algebra/productos-notables.js');

// ---- Camino independiente: el texto de la alternativa se lee como expresión y se evalúa ----
// «3√2/2», «(√7 + √3)/2», «2 · ³√4/3», «x³ − 9x² + 27x − 27», «(2x − 3)(4x² + 6x + 9)», «16 + 2√55 dm²».
function evaluar(texto, x) {
  let t = String(texto).replace(/ (m|dm|cm|m²|dm²|dm³|cm³)$/, '').replace(/−/g, '-').replace(/·/g, '*').replace(/\s+/g, '');
  t = t.replace(/³√(\d+)/g, 'C($1)').replace(/³√\(/g, 'C(').replace(/√(\d+)/g, 'S($1)').replace(/√\(/g, 'S(');
  t = t.replace(/⁶/g, '**6').replace(/⁴/g, '**4').replace(/³/g, '**3').replace(/²/g, '**2');
  t = t.replace(/([\dx)])(?=[(xSC])/g, '$1*');
  if (!/^[\d+\-*/().xSC]+$/.test(t)) throw new Error(`no se puede leer: ${texto} → ${t}`);
  // eslint-disable-next-line no-new-func
  return Function('x', 'S', 'C', `return ${t};`)(x, Math.sqrt, Math.cbrt);
}
const XS = [1.7, -2.3, 0.6];
// Lo que vale el enunciado, calculado de otra manera (multiplicando factores, por fuerza bruta o con Math.sqrt).
function recalcular(p) {
  const d = p._datos, sq = Math.sqrt, sgn = d.sub === 'resta' ? -1 : 1, poli = fn => ({ puntos: XS.map(x => [x, fn(x)]) });
  switch (d.tipo) {
    case 'desarrolla': return poli(x => (d.p * x + sgn * d.k) * (d.p * x + sgn * d.k));
    case 'terreno': { let total = 0, viejo = 0; for (let i = 0; i < d.a + d.b; i++) for (let j = 0; j < d.a + d.b; j++) { total++; if (i < d.a && j < d.a) viejo++; } return d.sub === 'total' ? total : total - viejo; }
    case 'numero': { const N = d.M + sgn * d.d; return N * N; }
    case 'completar': { const k = 2 * d.h; for (let c = 1; c < 1000; c++) if (k * k - 4 * c === 0) return c; break; }   // discriminante 0
    case 'suma-producto': return d.x * d.x + d.y * d.y;
    case 'inverso': { const k = d.k, x = (sgn > 0 ? k + sq(k * k - 4) : k + sq(k * k + 4)) / 2; return x * x + 1 / (x * x); }
    case 'figura': return sq(d.x * d.x + d.y * d.y + 2 * d.x * d.y);
    case 'cercanos': return (d.M + d.d) * (d.M - d.d);
    case 'triplay': return d.a * d.a - d.b * d.b;
    case 'suma-diferencia': return poli(x => (d.p * x + d.k) * (d.p * x - d.k));
    case 'xpq': return poli(x => (x + d.p) * (x + d.q));
    case 'legendre': return d.sub === 'ab' ? d.x * d.y : (d.x + d.y) ** 4 - (d.x - d.y) ** 4;
    case 'cambio-variable': { const s = d.a + d.d, x = (-s + sq(s * s + 4 * d.y0)) / 2; return Math.round((x + d.a) * (x + d.b) * (x + d.c) * (x + d.d)); }
    case 'sextas': { const D3 = d.u - d.w, D6 = d.u * d.u - d.w * d.w; for (let u = 1; u < 1000; u++) { const w = u - D3; if (w > 0 && u * u - w * w === D6) return u; } break; }
    case 'desarrolla-cubo': return poli(x => (x + sgn * d.k) ** 3);
    case 'taco': return (d.a + d.b) ** 3 - d.a ** 3 - d.b ** 3;
    case 'numero-cubo': { const N = d.M + sgn * d.d; return N * N * N; }
    case 'coeficiente': { // (px + k)³ evaluado en 0, 1, −1 y 2: el coeficiente sale de las diferencias
      const P = x => (d.p * x + d.k) ** 3, a3 = d.p ** 3, a0 = d.k ** 3;
      const s1 = P(1) - a3 - a0, s2 = P(-1) + a3 - a0;            // a2 + a1 y a2 − a1
      return d.sub === 'x2' ? (s1 + s2) / 2 : (s1 - s2) / 2;
    }
    case 'suma-producto-cubo': return d.sub === 'suma' ? d.x ** 3 + d.y ** 3 : d.x ** 3 - d.y ** 3;
    case 'factoriza-cubos': return poli(x => (d.p * x) ** 3 + (d.mas ? 1 : -1) * d.k ** 3);
    case 'mesa': return d.sub === 'area' ? (sq(d.x) + sq(d.y)) ** 2 : sq(d.x) + sq(d.y);
    case 'simple': return sq(d.x + d.y + 2 * sq(d.x * d.y));
    case 'resta': return sq(d.x + d.y - 2 * sq(d.x * d.y));
    case 'sin-dos': return sq(d.x + d.y + sq(4 * d.x * d.y));
    case 'suma-dobles': { const u = sq(d.x + d.y + 2 * sq(d.x * d.y)), w = sq(d.x + d.y - 2 * sq(d.x * d.y)); return d.suma ? u + w : u - w; }
    case 'coef-resta': return sq(d.x + d.y - 2 * sq(d.x * d.y));
    case 'cometa': return d.d / Math.SQRT2;
    case 'una-raiz': return d.K / sq(d.A);
    case 'conjugado': return d.K / (sq(d.A) + (d.s === '+' ? 1 : -1) * sq(d.B));
    case 'cubica': return d.K / Math.cbrt(d.A);
    case 'dos-fracciones': { const u = 1 / (sq(d.A) - sq(d.B)), w = 1 / (sq(d.A) + sq(d.B)); return d.suma ? u + w : u - w; }
    case 'inverso-rac': { const x = 1 / (sq(d.A) - sq(d.A - 1)); return d.sub === 'suma' ? x + 1 / x : x - 1 / x; }
    default: throw new Error(`tipo sin recálculo: ${d.tipo}`);
  }
  throw new Error(`sin respuesta: ${d.tipo}`);
}
const cerca = (a, b) => Math.abs(a - b) < 1e-6 * Math.max(1, Math.abs(a));
function igual(esperado, valor) {
  if (typeof valor === 'number') return cerca(esperado, valor);
  if (esperado && esperado.puntos) return esperado.puntos.every(([x, y]) => cerca(y, evaluar(valor, x)));
  return cerca(esperado, evaluar(valor));
}
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

const IDEAS = require(TEORIA).ideas.map(i => i.id);
test('tipos por idea: las cinco ideas de la teoría, y generar(semilla, { idea }) da solo los suyos, con los tres niveles', () => {
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

const VARIANTES = ['desarrolla/suma', 'desarrolla/resta', 'terreno/total', 'terreno/compra', 'numero/suma', 'numero/resta',
  'completar/suma', 'completar/resta', 'suma-producto/suma', 'suma-producto/diferencia', 'inverso/suma', 'inverso/resta', 'figura',
  'cercanos', 'triplay', 'suma-diferencia', 'xpq', 'legendre/ab', 'legendre/cuartas', 'cambio-variable', 'sextas',
  'desarrolla-cubo/suma', 'desarrolla-cubo/resta', 'taco', 'numero-cubo/suma', 'numero-cubo/resta', 'coeficiente/x2', 'coeficiente/x',
  'suma-producto-cubo/suma', 'suma-producto-cubo/diferencia', 'factoriza-cubos', 'mesa/area', 'mesa/lado', 'simple', 'resta',
  'sin-dos/sin2', 'sin-dos/coef', 'suma-dobles', 'coef-resta', 'cometa', 'una-raiz', 'conjugado/raices', 'conjugado/entero', 'cubica',
  'dos-fracciones', 'inverso-rac/suma', 'inverso-rac/resta'];
// Los códigos son los de la teoría de la unidad, salvo los nuevos (hipótesis, en la cabecera del generador). AL8 y AL9
// son parciales, como en el informe; AL11 y los demás, hipótesis.
const NUEVOS = ['TAL-ESQUINA-DOBLE', 'TAL-ESQUINA-LADO', 'TAL-PN-COPIA', 'TAL-PN-CUATRO', 'TAL-DIFCUAD-DOBLE', 'TAL-SXD-CUAD',
  'TAL-XPQ-DOBLE', 'TAL-CV-SINY', 'TAL-CV-SUMA', 'TAL-LEG-SUMA', 'TAL-SEXTA-SUMA', 'TAL-SEXTA-MITAD', 'TAL-SEXTA-OTRO',
  'TAL-CUBO-SEIS', 'TAL-CUBO-SINCUAD', 'TAL-CUBO-MEDIO', 'TAL-CUBO-DOS', 'TAL-CUBO-CRUZA', 'TAL-RD-AREA', 'TAL-RD-LADO',
  'TAL-RAC-PARCIAL', 'TAL-RAC-NUM', 'TAL-RAC-DIAG'];
test('salen todas las variantes y los errores de la teoría', () => {
  const tipos = new Set(), ids = new Set();
  for (let s = 0; s < 4000; s++) {
    const p = gen.generar(s), d = p._datos;
    tipos.add(d.tipo + (d.sub ? '/' + d.sub : ''));
    for (const a of p.alternativas) if (a.error) ids.add(a.error.id);
  }
  for (const t of VARIANTES) assert.ok(tipos.has(t), `no sale ${t}`);
  for (const id of ['AL8', 'AL9', 'AL11', 'TAL-2AB', 'TAL-ESQUINA', 'TAL-SIGNO', 'TAL-COEF', 'TAL-RAIZ-FALTA', 'TAL-DIFCUAD-FALTA',
    'TAL-DIFCUAD-SUMA', 'TAL-DIFCUAD-2B', 'TAL-MEDIO', 'TAL-XPQ-CAMBIA', 'TAL-XPQ-MEDIO', 'TAL-LEG-DOS', 'TAL-LEG-CUATRO', 'TAL-LEG-PROD',
    'TAL-POT-CUAD', 'TAL-POT-SUMA', 'TAL-CUBO-TRES', 'TAL-CUBO-CAMBIA', 'TAL-CUBO-UNA', 'TAL-CUBO-SUMA', 'TAL-CUBO-SIGNO', 'TAL-CUBO-CUAD',
    'TAL-RD-SIGNO', 'TAL-RD-ORDEN', 'TAL-RD-PRODUCTO', 'TAL-RD-DOS', 'TAL-RD-CANCELA', 'TAL-RD-CRUZA', 'TAL-RAC-UNO', 'TAL-RAC-DEN',
    'TAL-RAC-INV', 'TAL-RAC-MISMO', 'TAL-RAC-SUMA', 'TAL-RAC-CUBO', 'TAL-RAC-CANCELA', ...NUEVOS])
    assert.ok(ids.has(id), `no sale ${id}`);
});

test('cada error usa un código de la teoría (o uno de los nuevos) con su respaldo; los nuevos no están en la teoría', () => {
  const teoria = fs.readFileSync(TEORIA, 'utf8');
  const deLaTeoria = new Set(teoria.match(/\b(AL\d+|TAL-[A-Z0-9-]+[A-Z0-9])\b/g));
  for (const n of NUEVOS) assert.ok(!deLaTeoria.has(n), `${n} ya está en la teoría: no es nuevo`);
  for (let s = 0; s < 1500; s++) for (const a of gen.generar(s).alternativas.filter(x => x.error)) {
    const id = a.error.id;
    assert.ok(deLaTeoria.has(id) || NUEVOS.includes(id), `semilla ${s}: ${id} no es de la teoría`);
    assert.equal(a.error.respaldo, ['AL8', 'AL9'].includes(id) ? 'parcial' : 'hipotesis', `semilla ${s}: ${id} con respaldo ${a.error.respaldo}`);
    assert.equal(a.error.fuente, /^AL\d/.test(id) ? 'docs/investigacion/algebra-funciones-ideas-erroneas.md' : 'contenido/teoria/algebra/productos-notables.js');
  }
});

test('cada explicación empieza por lo que el alumno hizo bien, muestra lo que da su error y no nombra una letra', () => {
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s);
    for (const a of p.alternativas.filter(x => x.error)) {
      const e = a.error.explicacion;
      // «Bien…» o, cuando lo bien hecho es la cuenta misma, «7² = 49 está bien calculado» / «169 m² es el área…, bien sumada».
      assert.match(e, /^Bien|^[^.]* (está bien calculado|bien sumada)\./, `semilla ${s}: ${e}`);
      assert.ok(e.includes(a.texto), `semilla ${s}: «${e}» no muestra ${a.texto}`);
      assert.ok(!/\b(alternativa|opción|letra) [A-E]\b|\([A-E]\)|\bla [A-E]\b/.test(e), `semilla ${s}: nombra una letra: ${e}`);
    }
  }
});

// Un color fijo por magnitud, el de la teoría (cabecera de productos-notables.js): a naranja, b turquesa (y el índice de
// la raíz cúbica, que nunca va junto a b), violeta a las piezas del medio, al factor que vale 1 y al resultado, los tres
// solo en la solución. Sin carmín ni verde.
test('un color por magnitud: a naranja, b turquesa, violeta a las piezas del medio y al resultado (solo en la solución)', () => {
  const COLOR = { a: 'o', b: 'i', n: 'i', M: 'f', U: 'f', R: 'f' };
  for (let s = 0; s < 1000; s++) {
    const p = gen.generar(s), V = p.variables, usadas = new Set();
    for (const [k, x] of Object.entries(V)) {
      assert.equal(x.color, COLOR[k], `semilla ${s}: ${k} en ${x.color}`);
      assert.ok(x.nombre, `semilla ${s}: ${k} sin nombre`);
    }
    const tinta = Object.entries(V).filter(([, x]) => x.color !== 'f').map(([, x]) => x.color);
    assert.equal(new Set(tinta).size, tinta.length, `semilla ${s}: dos variables con el mismo color`);
    for (const linea of [p.enunciado, p.pregunta, ...p.solucion]) for (const x of linea) {
      if (x && typeof x === 'object') { assert.ok(V[x.v], `semilla ${s}: «${x.t}» usa ${x.v}, que no está`); assert.ok(x.t, `semilla ${s}: tramo vacío`); usadas.add(x.v); }
      else assert.equal(typeof x, 'string', `semilla ${s}: tramo inválido`);
    }
    assert.deepEqual([...usadas].sort(), Object.keys(V).sort(), `semilla ${s}: variable sin usar`);
    for (const linea of [p.enunciado, p.pregunta]) for (const x of linea) assert.ok(!(x && COLOR[x.v] === 'f'), `semilla ${s}: violeta antes de responder (${x && x.t})`);
    assert.ok(p.solucion.some(l => l.some(x => x && x.v === 'R')), `semilla ${s}: el resultado sin violeta`);
    if (p.figura) assert.ok(!/--c-(h|d)\b/.test(p.figura.svg), `semilla ${s}: la figura usa carmín o verde`);
  }
});

test('notación: superíndices de verdad, «³√» y no «∛», signo menos tipográfico, sin «^», «*» ni radicandos sin simplificar', () => {
  const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? x.t : String(x));
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s);
    const todo = [p.enunciado, p.pregunta, ...p.solucion].map(plano).concat(p.datos, p.alternativas.map(a => a.texto)).join(' ');
    assert.ok(!/[∛∜^*]|\d-\d|\s-\d|\d\.\d|\(x\)|\b1x\b|\d³√/.test(todo), `semilla ${s}: ${todo}`);
    // La respuesta correcta trae cada raíz simplificada (2√2, no √8).
    const c = p.alternativas.find(a => a.correcta).texto;
    for (const [, n] of c.matchAll(/(?<!³)√(\d+)/g)) {
      const k = Number(n);
      for (let q = 2; q * q <= k; q++) assert.ok(k % (q * q) !== 0, `semilla ${s}: √${k} sin simplificar en ${c}`);
    }
  }
});

// Recuadro «Datos» (docs/plan-calidad.md §3, punto 13): líneas cortas en texto plano, sin la respuesta, con la
// herramienta de cada tipo.
test('datos: una lista de líneas cortas, sin la respuesta y con la fórmula de cada tipo, en 400 semillas', () => {
  const palabras = t => t.split(/\s+/).filter(w => /\p{L}/u.test(w)).length;
  const CUAD = /\(a [+−] b\)² = a² [+−] 2ab \+ b²/, CUBO = /\(a [+−] b\)³ = a³ [+−] 3a²b \+ 3ab² [+−] b³/, SXD = /\(a \+ b\)\(a − b\) = a² − b²/;
  const RD = /√\(A \+ 2√B\) = √x \+ √y/, CONJ = /\(√a \+ (√b|c)\)\(√a − (√b|c)\)/;
  const FORMULA = {
    desarrolla: CUAD, terreno: CUAD, numero: CUAD, completar: CUAD, 'suma-producto': CUAD, inverso: CUAD, figura: CUAD,
    cercanos: SXD, triplay: SXD, 'suma-diferencia': SXD, xpq: /\(x \+ p\)\(x \+ q\)/, legendre: SXD, 'cambio-variable': /\(x \+ p\)\(x \+ q\)/, sextas: SXD,
    'desarrolla-cubo': CUBO, taco: CUBO, 'numero-cubo': CUBO, coeficiente: CUBO, 'suma-producto-cubo': CUBO, 'factoriza-cubos': /a³ [+−] b³ = \(a [+−] b\)/,
    mesa: /Lado de un cuadrado = √/, simple: RD, resta: /√\(A − 2√B\)/, 'sin-dos': /k√M = √\(k² · M\)/, 'suma-dobles': RD, 'coef-resta': /k√M = √\(k² · M\)/,
    cometa: /Diagonal de un cuadrado/, 'una-raiz': /√a · √a = a/, conjugado: CONJ, cubica: /\(³√a\)³/, 'dos-fracciones': CONJ, 'inverso-rac': CONJ,
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
    // La respuesta no está en los datos: ni su texto ni, si tiene dos cifras o más, ese número.
    const c = p.alternativas.find(a => a.correcta).texto;
    assert.ok(!todo.includes(c), `semilla ${s}: los datos traen la respuesta ${c}`);
    for (const [n] of c.matchAll(/\d{2,}/g)) assert.ok(!new RegExp(`(?<!\\d)${n}(?!\\d)`).test(todo), `semilla ${s}: los datos traen ${n} (${c})`);
  }
});

test('la figura del terreno partido: SVG propio, los rótulos dentro del lienzo y sin pisarse', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(`f${s}`, { idea: 'cuadrado-suma' });
    if (p._datos.tipo !== 'figura') { assert.equal(p.figura, undefined); continue; }
    const [, W, H] = p.figura.svg.match(/viewBox="0 0 (\d+) (\d+)"/).map(Number);
    const r = p.figura.svg.match(/<rect [^>]*>/g).map(t => ['x', 'y', 'width', 'height'].map(k => Number(t.match(new RegExp(` ${k}="([\\d.]+)"`))[1])));
    assert.equal(r.length, 4);
    for (const [x, y, w, h] of r) assert.ok(x >= 4 && y >= 4 && x + w <= W - 4 && y + h <= H - 4, `semilla ${s}: pieza fuera del lienzo`);
    const textos = [...p.figura.svg.matchAll(/<text x="([\d.]+)" y="([\d.]+)"([^>]*)>([^<]*)</g)];
    assert.equal(textos.length, 2);
    for (const [, x, y, resto, t] of textos) {
      const gira = /transform/.test(resto);
      // El rótulo cabe en su rectángulo (unos 8 px por carácter a 14 px; girado si el rectángulo es angosto).
      const caja = r.find(([rx, ry, w, h]) => x >= rx && x <= rx + w && y >= ry && y <= ry + h);
      assert.ok(caja, `semilla ${s}: rótulo fuera de su pieza`);
      const largo = 8 * t.length, [, , w, h] = caja;
      assert.ok(gira ? largo <= h - 4 && 16 <= w : largo <= w - 4 && 16 <= h, `semilla ${s}: «${t}» no cabe (${w} × ${h})`);
    }
  }
});

test('nunca se queda sin cuatro alternativas (semillas 0 a 2000, de texto y por idea)', () => {
  for (let s = 0; s <= 2000; s++) gen.generar(s);
  for (const s of ['entrada-1', 'entrada-2', 'entrada-3', 'salida-1', 'salida-2', 'salida-3', 'papel-1', 'examen-x'])
    for (const idea of [undefined, ...IDEAS]) gen.generar(s, { unidad: UNIDAD, idea });
});

test('papel.json: 8 problemas de las cinco ideas, con sus datos y su respuesta recalculada', () => {
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

test('la unidad lista esta plantilla primero, la ficha es solo suya y el repaso la usa entera', () => {
  const raiz = path.join(__dirname, '..', '..');
  const cat = JSON.parse(fs.readFileSync(path.join(raiz, 'catalogo', 'cursos', 'algebra.json'), 'utf8'));
  assert.equal(cat.unidades.find(u => u.id === UNIDAD).plantillas[0], 'productos-notables');
  const ficha = JSON.parse(fs.readFileSync(path.join(__dirname, 'plantilla.json'), 'utf8'));
  assert.deepEqual(ficha.unidades, [UNIDAD]);
  const RT = require('../../nucleo/repaso-tipos.js');
  assert.ok(RT.cubre(ficha, UNIDAD));
  for (let s = 0; s < 50; s++) assert.equal(RT.unidadDe(ficha, gen.generar(`r${s}`)), UNIDAD, `semilla ${s}`);
});

// La práctica no repite las predicciones de la teoría (Ejercicios se abre sin pasar por Predice): el terreno de 7 m que
// cede franjas de 2 m (idea 1), 31 · 29 (idea 2), a + b = 7 con ab = 10 (idea 3), √(7 − 2√12) (idea 4) y 1/(√5 − √3)
// (idea 5), en ninguna semilla ni idea. Se buscan también en el texto, por si otro tipo las armara.
test('la práctica no repite las predicciones de la unidad', () => {
  const T = require(TEORIA);
  const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? (x.t !== undefined ? String(x.t) : x.frac ? x.frac.map(plano).join('/') : x.raiz ? `√(${plano(x.raiz)})` : '') : String(x));
  const predices = T.ideas.map(i => plano(i.predice.pregunta));
  assert.match(predices[1], /31 · 29/); assert.match(predices[2], /suman 7 y su producto es 10/); assert.match(predices[3], /7 − 2√12/); assert.match(predices[4], /√5 − √3/);
  const IDEA4 = gen.TIPOS_POR_IDEA['radicales-dobles'];
  const ve = d => (d.tipo === 'terreno' && d.a === 7 && d.b === 2) || (d.tipo === 'cercanos' && d.M === 30 && d.d === 1)
    || (['suma-producto-cubo', 'suma-producto'].includes(d.tipo) && d.x + d.y === 7 && d.x * d.y === 10)
    || (IDEA4.includes(d.tipo) && d.x + d.y === 7 && d.x * d.y === 12)
    || (['conjugado', 'dos-fracciones'].includes(d.tipo) && d.A === 5 && d.B === 3);
  for (const idea of [undefined, ...IDEAS]) for (let s = 0; s < 400; s++) {
    const p = gen.generar(`p${s}`, idea ? { idea } : {});
    assert.ok(!ve(p._datos), `${idea} semilla ${s}: ${JSON.stringify(p._datos)}`);
    const t = [p.enunciado, p.pregunta].map(plano).join(' ');
    assert.ok(!/31 · 29|7 − 2√12|7 − 4√3|√5 − √3|cede/.test(t), `${idea} semilla ${s}: ${t}`);
  }
});

// Correcciones del 18 nov (rutinas/auditoria/algebra.productos-notables.md).
const planoG = x => (Array.isArray(x) ? x.map(planoG).join('') : x && typeof x === 'object' ? String(x.t ?? '') : String(x ?? ''));
test('A1: toda solución que usa 3ab(a ± b) trae en sus datos la identidad de la suma o de la resta de cubos', () => {
  let n = 0;
  for (const idea of [undefined, 'cubo-binomio']) for (let s = 0; s < 400; s++) {
    const p = gen.generar(`a1-${s}`, idea ? { idea } : {}), sol = planoG(p.solucion), datos = p.datos.join('\n');
    if (/3ab\(a \+ b\)/.test(sol)) { n++; assert.ok(datos.includes('a³ + b³ = (a + b)³ − 3ab(a + b)'), `semilla ${s}: ${sol}`); }
    if (/3ab\(a − b\)|piezas del medio se restan/.test(sol)) { n++; assert.ok(datos.includes('a³ − b³ = (a − b)³ + 3ab(a − b)'), `semilla ${s}: ${sol}`); }
  }
  assert.ok(n > 20, `${n} problemas con la identidad`);
  const p7 = papel.problemas.find(p => /a³ \+ b³\?/.test(p.enunciado));
  assert.ok(p7 && p7.enunciado.includes('a³ + b³ = (a + b)³ − 3ab(a + b)'), 'el papel de la suma de cubos trae la identidad');
});

test('M6 y M9: los datos no pegan la «y» a la variable; la cometa, de 6 a 15 dm; el taco, en cm y de 10 cm a lo más', () => {
  for (let s = 0; s < 400; s++) {
    for (const idea of ['radicales-dobles', 'racionalizar', 'cubo-binomio']) {
      const p = gen.generar(`m9-${s}`, { idea }), d = p._datos, t = [p.enunciado, p.pregunta].map(planoG).join(' ');
      for (const l of p.datos) assert.ok(!/= A y x/.test(l), l);
      if (d.tipo === 'cometa') { assert.ok(d.d >= 6 && d.d <= 15, `varilla de ${d.d}`); assert.match(t, / dm\b/); assert.ok(!/ m\b/.test(t), t); }
      if (d.tipo === 'taco') { assert.ok(d.a + d.b <= 10, `arista de ${d.a + d.b}`); assert.match(t, / cm\b/); assert.ok(!/dm/.test(t + planoG(p.alternativas.map(a => a.texto))), t); }
    }
  }
});
