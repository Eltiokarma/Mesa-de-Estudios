// Pruebas de «El cuaderno de las cuentas»: casos.json (calculados aparte, con un script que no usa el generador), un
// recálculo independiente en 600 problemas (parseInt y toString de JavaScript, BigInt y fuerza bruta para las manchas,
// los repartos y las cifras), fugas, los tipos por idea, los colores de la unidad, la notación, el recuadro «Datos» en
// 400 semillas y el papel.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');
const formatear = require('../../nucleo/predicciones.js').formatear;

// ---- Camino independiente ----
const SUB = '₀₁₂₃₄₅₆₇₈₉';
const escrito = (cifras, base) => (base === 10 ? cifras : `${cifras}₍${[...String(base)].map(c => SUB[c]).join('')}₎`);
const cifrasBig = x => String(x).length;
const dos = (lo, hi) => `${lo} o ${hi} cifras`;
// Todas las maneras de llenar las manchas ☐ (de izquierda a derecha) que cumplen la cuenta.
function llenar(filas, cumple) {
  const huecos = filas.join('').split('').filter(c => c === '☐').length, out = [];
  for (let x = 0; x < 10 ** huecos; x++) {
    const ds = String(x).padStart(huecos, '0').split(''); let k = 0;
    const llenas = filas.map(f => f.replace(/☐/g, () => ds[k++]));
    if (llenas.some(f => f.length > 1 && f[0] === '0')) continue;
    if (cumple(llenas.map(Number))) out.push(ds.map(Number));
  }
  return out;
}
function recalcular(p) {
  const d = p._datos;
  switch (d.tipo) {
    case 'suma': case 'varios': return d.sumandos.reduce((s, x) => s + Number(x), 0);
    case 'suma-base': return escrito(d.sumandos.reduce((s, x) => s + parseInt(x, d.n), 0).toString(d.n), d.n);
    case 'cuanto-lleva': return Math.floor(d.sumandos.reduce((s, x) => s + (Number(x) % 100), 0) / 100);
    case 'base-cuadra': {
      const ok = [];
      for (let b = 2; b <= 36; b++) {
        if ([...d.sumandos.join(''), ...d.resultado].some(c => Number(c) >= b)) continue;
        if (parseInt(d.sumandos[0], b) + parseInt(d.sumandos[1], b) === parseInt(d.resultado, b)) ok.push(b);
      }
      assert.equal(ok.length, 1, `${p.id}: bases ${ok}`);
      return ok[0];
    }
    case 'resta': case 'ceros': return Number(d.minuendo) - Number(d.sustraendo);
    case 'resta-base': return escrito((parseInt(d.minuendo, d.n) - parseInt(d.sustraendo, d.n)).toString(d.n), d.n);
    case 'aperturas': { // se abre un envase de la columna i + 1 cuando lo de abajo de M no alcanza para lo de abajo de S
      let k = 0;
      for (let i = 0; i < d.minuendo.length; i++) if (Number(d.minuendo) % 10 ** (i + 1) < Number(d.sustraendo) % 10 ** (i + 1)) k++;
      return k;
    }
    case 'suma-tres': return d.suma / 2;
    case 'ca': case 'ceros-finales': return 10 ** d.N.length - Number(d.N);
    case 'ca-base': return escrito((d.n ** d.N.length - parseInt(d.N, d.n)).toString(d.n), d.n);
    case 'ca-oculto': {
      const vals = new Set();
      for (let a = 0; a <= 9; a++) for (let b = 1; b <= 9; b++) for (let c = 0; c <= 9; c++)
        if (1000 - (100 * d.p + 10 * a + d.q) === 100 * b + 10 * d.r + c) vals.add(a + b + c);
      assert.equal(vals.size, 1, `${p.id}: a + b + c no es única`);
      return [...vals][0];
    }
    case 'mancha-suma': case 'mancha-dos': {
      const s = llenar([...d.sumandos, d.resultado], ([x, y, z]) => x + y === z);
      assert.equal(s.length, 1, `${p.id}: ${s.length} soluciones`);
      return String(s[0].reduce((a, x) => a + x, 0));
    }
    case 'mancha-resta': {
      const s = llenar([d.minuendo, d.sustraendo, d.diferencia], ([x, y, z]) => x - y === z);
      assert.equal(s.length, 1, `${p.id}: ${s.length} soluciones`);
      return String(d.sub === 'arriba' ? s[0][0] : s[0][1]);
    }
    case 'reverso': {
      let mayor = -1;
      for (let x = 100; x <= 999; x++) {
        const t = String(x), r = Number([...t].reverse().join(''));
        if (t[2] !== '0' && x - r === d.diferencia) mayor = x;
      }
      return mayor;
    }
    case 'por-cifra': return Number(d.N) * d.m;
    case 'por-cifra-base': return escrito((parseInt(d.N, d.n) * d.m).toString(d.n), d.n);
    case 'cuanto-sube': return (d.F + d.s) * d.G - d.F * d.G;
    case 'factor-falta': { const G = []; for (let g = 1; g <= 500; g++) if ((d.F + d.s) * g - d.F * g === d.sube) G.push(g); assert.equal(G.length, 1); return G[0]; }
    case 'los-dos': return (d.F + d.s) * (d.G + d.t) - d.F * d.G;
    case 'exceso': return d.d - (d.D % d.d);
    case 'dividendo': { const D = []; for (let x = 1; x <= 2000; x++) if (Math.floor(x / d.d) === d.q && d.d - (x % d.d) === d.re && x % d.d) D.push(x); assert.equal(D.length, 1); return D[0]; }
    case 'restos': { const R = []; for (let r = 1; r < d.d; r++) if (r === d.k * (d.d - r)) R.push(r); assert.equal(R.length, 1); return R[0]; }
    case 'dos-repartos': { const X = []; for (let x = 1; x <= 200; x++) if (d.p * x + d.sobran === (d.p + d.e) * x - d.faltan && d.sobran < x) X.push(x); assert.equal(X.length, 1); return X[0]; }
    case 'uno-mas': { const N = []; for (let x = 1; x <= 200; x++) if (d.sobran < x && d.p * x + d.sobran === (d.p + 1) * x - d.faltan) N.push(d.p * x + d.sobran); assert.equal(N.length, 1); return N[0]; }
    case 'producto': {
      const lo = cifrasBig(10n ** BigInt(d.p - 1) * 10n ** BigInt(d.q - 1)), hi = cifrasBig((10n ** BigInt(d.p) - 1n) * (10n ** BigInt(d.q) - 1n));
      return dos(lo, hi);
    }
    case 'cociente': {
      const lo = cifrasBig(10n ** BigInt(d.p - 1) / (10n ** BigInt(d.q) - 1n)), hi = cifrasBig((10n ** BigInt(d.p) - 1n) / 10n ** BigInt(d.q - 1));
      return dos(lo, hi);
    }
    case 'cifras-factor': { // las cantidades de cifras de B con las que A × B puede tener c cifras
      const qs = [];
      for (let q = 1; q <= 12; q++) {
        const lo = cifrasBig(10n ** BigInt(d.p - 1) * 10n ** BigInt(q - 1)), hi = cifrasBig((10n ** BigInt(d.p) - 1n) * (10n ** BigInt(q) - 1n));
        if (lo <= d.c && d.c <= hi) qs.push(q);
      }
      assert.equal(qs.length, 2);
      return dos(qs[0], qs[1]);
    }
    case 'potencias': {
      const a = 10n ** BigInt(d.p - 1), A = 10n ** BigInt(d.p) - 1n, b = 10n ** BigInt(d.q - 1), B = 10n ** BigInt(d.q) - 1n;
      return `de ${cifrasBig(a * a * b * b * b)} a ${cifrasBig(A * A * B * B * B)} cifras`;
    }
    default: throw new Error(`tipo sin recálculo: ${d.tipo}`);
  }
}
const igual = (a, b) => a === b || (typeof b === 'string' && typeof a === 'number' && b === String(a));
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

const TEORIA = require('../../contenido/teoria/aritmetica/cuatro-operaciones.js');
const IDEAS = TEORIA.ideas.map(i => i.id);
test('tipos por idea: las siete ideas de la teoría, y generar(semilla, { idea }) da solo los suyos', () => {
  assert.deepEqual(Object.keys(gen.TIPOS_POR_IDEA), IDEAS);
  assert.deepEqual(Object.keys(gen.TIPOS_POR_UNIDAD), ['aritmetica.cuatro-operaciones']);
  assert.deepEqual(gen.TIPOS_POR_UNIDAD['aritmetica.cuatro-operaciones'], Object.values(gen.TIPOS_POR_IDEA).flat());
  for (const idea of IDEAS) {
    const vistos = new Set();
    for (let s = 0; s < 300; s++) {
      const p = gen.generar(`i${s}`, { idea, unidad: 'aritmetica.cuatro-operaciones' });
      assert.equal(p._datos.idea, idea);
      assert.equal(p.unidadCatalogo, 'aritmetica.cuatro-operaciones');
      assert.ok(gen.TIPOS_POR_IDEA[idea].includes(p._datos.tipo), `${idea}: salió ${p._datos.tipo}`);
      vistos.add(p._datos.tipo);
    }
    assert.deepEqual([...vistos].sort(), [...gen.TIPOS_POR_IDEA[idea]].sort(), `${idea}: no salen todos sus tipos`);
  }
});

test('salen todos los tipos, los tres niveles por idea, las preguntas de San Marcos y los errores', () => {
  const tipos = new Set(), niveles = {}, ids = new Set();
  for (let s = 0; s < 3000; s++) {
    const p = gen.generar(s), d = p._datos;
    tipos.add(d.tipo + (d.sub ? '/' + d.sub : ''));
    (niveles[d.idea] = niveles[d.idea] || new Set()).add(d.nivel);
    for (const a of p.alternativas) if (a.error) ids.add(a.error.id);
  }
  for (const t of Object.values(gen.TIPOS_POR_IDEA).flat().filter(t => t !== 'mancha-resta').concat(['mancha-resta/arriba', 'mancha-resta/abajo']))
    assert.ok(tipos.has(t), `no sale ${t}`);
  for (const idea of IDEAS) assert.deepEqual([...niveles[idea]].sort(), [1, 2, 3], `${idea}: niveles ${[...niveles[idea]]}`);
  // Las seis preguntas de San Marcos de la propuesta (§ «Qué se pregunta») tienen su tipo de nivel examen.
  for (const t of ['reverso', 'mancha-resta', 'dos-repartos', 'uno-mas', 'ca-oculto']) assert.equal(gen.NIVEL[t], 3, t);
  for (const id of ['AT-LLEVA-OLVIDA', 'AT-LLEVA-FINAL', 'AT-LLEVA-DOBLE', 'AT-LLEVA-UNO', 'AT-DECIMAL', 'AT-LLEVA-TODO', 'AT-LLEVA-CIFRA',
    'AT-CADENA', 'AT-MENOR', 'AT-SUMA-COLUMNA', 'AT-MENOR-MAYOR', 'AT-SIN-DESCONTAR', 'AT-DOBLE-DESCUENTO', 'AT-CERO-DIEZ',
    'AT-PRESTA-COLUMNAS', 'AT-PRESTA-CEROS', 'AT-RESTA-TOTAL', 'AT-RESTA-TERCIO', 'AT-RESTA-CUARTO', 'AT-CA9', 'AT-CERO-QUEDA',
    'AT-CA-K', 'AT-CA-DIEZ', 'AT-CA-CEROS', 'AT-CA-DECIMAL', 'AT-CA-SIN-RESTAR', 'AT-SUFICIENCIA', 'AT-MEDIO-CERO', 'AT-REVERSO-C',
    'AT-SUBE-SOLO', 'AT-SUBE-MISMO', 'AT-PRODUCTO-NUEVO', 'AT-RESTA-AUMENTO', 'AT-MULTIPLICA', 'AT-SUMA-AUMENTO', 'AT-SIN-ESQUINA',
    'AT-EXCESO-IGUAL', 'AT-EXCESO-SUMA', 'AT-EXCESO-DIVISOR', 'AT-EXCESO-RESTA', 'AT-EXCESO-MAS', 'AT-EXCESO-CAMBIA', 'AT-RESTO-MAX',
    'AT-RESTO-MITAD', 'AT-REPARTO-SIN-DIVIDIR', 'AT-REPARTO-TOTAL', 'AT-REPARTO-RESTA', 'AT-REPARTO-CUENTA', 'AT-REPARTO-NUEVO',
    'AT-REPARTO-SIN-RESTO', 'AT-COTA-MAX', 'AT-COTA-MIN', 'AT-COTA-MULT', 'AT-COTA-RESTA', 'AT-COTA-PRODUCTO', 'AT-COTA-SUMA',
    'AT-COTA-UNA', 'AT-COTA-EXPONENTE'])
    assert.ok(ids.has(id), `no sale ${id}`);
});

// Los códigos son los de la teoría de la unidad, salvo uno nuevo (hipótesis, en la cabecera del generador y en la tabla
// AT del informe de aritmética).
test('cada error usa un código de la teoría (o el nuevo), es hipótesis y está en la tabla AT del informe', () => {
  const teoria = fs.readFileSync(require.resolve('../../contenido/teoria/aritmetica/cuatro-operaciones.js'), 'utf8');
  const informe = fs.readFileSync(require.resolve('../../docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md'), 'utf8');
  const tabla = informe.slice(informe.indexOf('## Las cuatro operaciones (18 nov)'));
  assert.ok(tabla.length > 100, 'falta la sección «Las cuatro operaciones (18 nov)» en el informe');
  const deLaTeoria = new Set(teoria.match(/AT-[A-ZÑ0-9-]+[A-ZÑ0-9]/g));
  const NUEVOS = ['AT-CA-CEROS'];
  const vistos = new Set();
  for (let s = 0; s < 1500; s++) for (const a of gen.generar(s).alternativas.filter(x => x.error)) {
    assert.ok(deLaTeoria.has(a.error.id) || NUEVOS.includes(a.error.id), `semilla ${s}: ${a.error.id} no es de la teoría`);
    assert.equal(a.error.respaldo, 'hipotesis');
    vistos.add(a.error.id);
  }
  for (const id of vistos) assert.ok(new RegExp(`\\| ${id} \\|`).test(tabla), `${id} no está en la tabla AT del informe`);
});

test('cada explicación empieza por lo que el alumno hizo bien y muestra lo que da su error', () => {
  for (let s = 0; s < 800; s++) {
    const p = gen.generar(s);
    for (const a of p.alternativas.filter(x => x.error)) {
      const e = a.error.explicacion;
      assert.match(e, /^Bien/, `semilla ${s}: ${e}`);
      const valor = typeof a.valor === 'number' ? formatear(a.valor, 0) : a.texto;
      assert.ok(e.includes(valor), `semilla ${s}: «${e}» no muestra ${valor}`);
    }
  }
});

// Un color fijo por magnitud, el de la teoría (cabecera de cuatro-operaciones.js): el envase turquesa, lo que se muda
// naranja, lo que se busca violeta; los números que se operan en tinta. Sin verde ni carmín.
test('un color por magnitud: envase turquesa, lo que se muda naranja, lo que se busca violeta; sin verde ni carmín', () => {
  const COLOR = { e: 'i', m: 'o', b: 'f' };
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), V = p.variables, usadas = new Set();
    for (const [k, x] of Object.entries(V)) assert.equal(x.color, COLOR[k], `semilla ${s}: ${k} en ${x.color}`);
    for (const linea of [p.enunciado, p.pregunta, ...p.solucion]) for (const x of linea) {
      if (x && typeof x === 'object') { assert.ok(V[x.v], `semilla ${s}: «${x.t}» usa ${x.v}, que no está`); usadas.add(x.v); }
      else assert.equal(typeof x, 'string', `semilla ${s}: tramo inválido`);
      // La base de un numeral (₍₆₎) va siempre en turquesa, el color del envase.
      if (x && typeof x === 'object' && /^₍/.test(x.t)) assert.equal(x.v, 'e', `semilla ${s}: base en ${x.v}`);
    }
    assert.deepEqual([...usadas].sort(), Object.keys(V).sort(), `semilla ${s}: variable sin usar`);
    // Lo que se pide va en tinta en la pregunta: la pregunta no lleva colores, salvo el envase de la base.
    for (const x of p.pregunta) if (x && typeof x === 'object') assert.equal(x.v, 'e', `semilla ${s}: la pregunta colorea «${x.t}»`);
  }
});

test('notación: × y nunca «·»; 34₍₅₎ sin raya; con letras, raya sobre cada carácter; ☐ para las manchas', () => {
  const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? x.t : String(x));
  for (let s = 0; s < 800; s++) {
    const p = gen.generar(s);
    const todo = [[p.enunciado, p.pregunta, ...p.solucion].map(plano).join(' '), p.datos.join(' | '), p.alternativas.map(a => a.texto + ' | ' + (a.error ? a.error.explicacion : '')).join(' | ')].join(' | ');
    assert.ok(!/·|\*|\(\d+\)[₀-₉]/.test(todo), `semilla ${s}: «·», «*» o notación vieja: ${todo}`);
    for (const a of p.alternativas) assert.ok(!a.texto.includes('̅'), `semilla ${s}: ${a.texto} con raya`);
    // a̅b̅c̅, b̅6̅c̅: si un numeral lleva letras junto a cifras, cada carácter lleva su raya.
    for (const m of todo.matchAll(/(?:[a-c0-9]̅){2,}[a-c0-9]?(?!̅)/g)) assert.ok(/̅$/.test(m[0]), `semilla ${s}: «${m[0]}» sin raya completa`);
    assert.ok(!/\d\.\d|\bde el\b|\ba el\b|\b1 bolsitas|\b1 cajas|sobran 1\b|faltan 1\b|faltarían 1\b|los 1\b|\b1 caramelos|\b1 sueltos/.test(todo), `semilla ${s}: ${todo}`);
    if (/mancha/.test(p._datos.tipo)) assert.ok(plano(p.enunciado).includes('☐'), `semilla ${s}: sin mancha`);
  }
});

// Recuadro «Datos» (docs/plan-calidad.md §3, punto 13): líneas cortas en texto plano, sin la respuesta, con la
// herramienta de cada tipo y sin el atajo.
test('datos: una lista de líneas cortas, sin la respuesta, con la fórmula de cada tipo y sin atajos, en 400 semillas', () => {
  const palabras = t => t.split(/\s+/).filter(w => /\p{L}/u.test(w)).length;
  const COLUMNA = /Suma de una columna = llevada × (\d+|n) \+ cifra que se anota/, RESTA = /Cifra = arriba \+ p × (\d+|n) − abajo/;
  const DIV = /D = d × q \+ r/, RANGO = /k cifras va de 10ᵏ⁻¹ a 10ᵏ − 1/;
  const FORMULA = {
    suma: COLUMNA, varios: COLUMNA, 'suma-base': COLUMNA, 'cuanto-lleva': COLUMNA, 'base-cuadra': COLUMNA,
    resta: RESTA, ceros: RESTA, 'resta-base': RESTA, aperturas: RESTA, 'suma-tres': /Minuendo − sustraendo = diferencia/,
    ca: /CA\(N\) = 10ᵏ − N/, 'ceros-finales': /CA\(N\) = 10ᵏ − N/, 'ca-base': /CA\(N\) = nᵏ − N/, 'ca-oculto': /CA\(N\) = 10ᵏ − N/,
    'mancha-suma': COLUMNA, 'mancha-dos': COLUMNA, 'mancha-resta': RESTA, reverso: /a̅b̅c̅ = 100 × a \+ 10 × b \+ c/,
    'por-cifra': /Cifra × factor \+ llevada/, 'por-cifra-base': /Cifra × factor \+ llevada/, 'cuanto-sube': /\(F \+ s\) × G = F × G \+ s × G/,
    'factor-falta': /\(F \+ s\) × G/, 'los-dos': /\(F \+ s\) × G/,
    exceso: /D = d × \(q \+ 1\) − rₑ/, dividendo: /D = d × \(q \+ 1\) − rₑ/, restos: /D = d × \(q \+ 1\) − rₑ/,
    'dos-repartos': DIV, 'uno-mas': /D = d × \(q \+ 1\) − rₑ/,
    producto: RANGO, cociente: RANGO, 'cifras-factor': RANGO, potencias: RANGO,
  };
  // Atajos que la idea enseña a deducir: no van en los datos.
  const ATAJO = /de 9 todas|99 × \(a − c\)|r \+ rₑ = d|m \+ n − 1|se lleva 1|última que no es 0/;
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
    assert.ok(!ATAJO.test(todo), `semilla ${s} (${d.tipo}): los datos traen un atajo`);
    // La respuesta no está en los datos (los números de una cifra pueden ser la base o el 10 de un envase).
    const c = p.alternativas.find(a => a.correcta).texto, num = (c.match(/\d+(?: \d{3})*/) || [''])[0];
    if (num.length > 1 && num !== '10') assert.ok(!new RegExp(`(?<![\\d])${num}(?![\\d])`).test(todo), `semilla ${s}: los datos traen ${num} (${c})`);
  }
});

test('nunca se queda sin cuatro alternativas (semillas 0 a 2000 y de texto)', () => {
  for (let s = 0; s <= 2000; s++) gen.generar(s);
  for (const s of ['entrada-1', 'entrada-2', 'entrada-3', 'salida-1', 'salida-2', 'salida-3', 'papel-1', 'examen-x']) gen.generar(s, { unidad: 'aritmetica.cuatro-operaciones' });
});

test('papel.json: 8 problemas de las siete ideas, con sus datos al final y su respuesta recalculada', () => {
  assert.equal(papel.problemas.length, 8);
  const ideas = new Set();
  papel.problemas.forEach((pr, i) => {
    const p = gen.generar(`papel-${i + 1}`);
    ideas.add(p._datos.idea);
    assert.match(pr.enunciado, /Datos: .+ Alternativas: /, pr.id);
    assert.ok(pr.respuesta.endsWith(p.alternativas.find(a => a.correcta).texto), pr.id);
    const r = recalcular(p);
    assert.ok(pr.respuesta.includes(typeof r === 'number' ? formatear(r, 0) : r), `${pr.id}: ${pr.respuesta} no es ${r}`);
  });
  assert.deepEqual([...ideas].sort(), [...IDEAS].sort());
  // Las dos de examen son preguntas de San Marcos (2024-I y 2023-II).
  assert.deepEqual(papel.problemas.slice(6).map((pr, i) => gen.generar(`papel-${i + 7}`)._datos.tipo), ['mancha-resta', 'dos-repartos']);
});
