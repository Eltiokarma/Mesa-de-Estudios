// Pruebas de «El puesto de los restos»: casos.json (calculados aparte, con un script que no usa el generador), un
// recálculo independiente en 600 problemas (BigInt, fuerza bruta para las cifras ocultas y los pagos), fugas, los tipos
// por idea, los colores de la unidad, la notación, el recuadro «Datos» en 400 semillas y el papel.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');

// ---- Camino independiente ----
const DIAS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
const R = (N, d) => Number(((BigInt(N) % BigInt(d)) + BigInt(d)) % BigInt(d));
const POT = (b, e, d) => Number((BigInt(b) ** BigInt(e)) % BigInt(d));
const PAGOS = (p, q, c) => { const o = []; for (let x = 0; p * x <= c; x++) for (let y = 0; p * x + q * y <= c; y++) if (p * x + q * y === c) o.push([x, y]); return o.sort((a, b) => a[1] - b[1]); };
const CIFRA = (patron, ok) => { const s = []; for (let a = 0; a <= 9; a++) if (ok(Number(patron.replace(/a/g, a)))) s.push(a); assert.equal(s.length, 1, `${patron}: ${s}`); return s[0]; };
function recalcular(p) {
  const d = p._datos;
  switch (d.tipo) {
    case 'es-multiplo': { const m = d.opciones.filter(x => x % d.d === 0); assert.equal(m.length, 1); return String(m[0]); }
    case 'cuantos-hasta': { let c = 0; for (let x = 1; x <= d.N; x++) if (x % d.d === 0) c++; return String(c); }
    case 'tramo': { let c = 0; for (let x = d.lo; x <= d.hi; x++) if (x % d.d === 0) c++; return String(c); }
    case 'razon': { const T = []; for (let x = d.L + 1; x < d.U; x++) if (x % d.d === 0) T.push(x); assert.equal(T.length, 1); return String(T[0] / d.d * d.p); }
    case 'suma': case 'veces': return String(R(d.rs.reduce((a, b) => a + b, 0), d.d));
    case 'faltan': return String(R(-d.f, d.d));
    case 'expresion': { // un N cualquiera que deja r: el resto de a × N + b
      const N = 7 * d.d + d.r; return String(R(d.a * N + d.b, d.d));
    }
    case 'triple': { const N = 5 * d.d - d.f; return String(R(d.k * N, d.d)); }
    case 'nueve-tres': case 'ultimas': case 'once': case 'siete': return String(R(d.N, d.d));
    case 'cifra-9': case 'boleto-11': case 'oculta-7-13': return String(CIFRA(d.patron, n => n % d.d === 0));
    case 'ocultas': {
      const s = new Set(); for (let b = 1; b <= 9; b++) for (let a = 0; a <= 9; a++) if (Number(d.patron.replace('a', a).replace('b', b)) % (d.m * d.m2) === 0) s.add(a);
      assert.equal(s.size, 1); return String([...s][0]);
    }
    case 'primeros': case 'resto-potencia': case 'ultima-cifra': return String(POT(d.b, d.e, d.d));
    case 'dia': return DIAS[(d.hoy + POT(d.b, d.e, 7)) % 7];
    case 'potencia-mas': return String(R(BigInt(d.b) ** BigInt(d.e) + BigInt(d.c), d.d));
    case 'completar': return String((d.c - 5 * d.y) / 2);
    case 'maneras': return String(PAGOS(d.p, d.q, d.c).length);
    case 'menos-monedas': return String(Math.min(...PAGOS(2, 5, d.c).map(([x, y]) => x + y)));
    case 'articulos': { const ps = PAGOS(d.p, d.q, d.c).filter(([x, y]) => x && y); return String(ps[ps.length - 1][0]); }
    default: throw new Error(`tipo sin recálculo: ${d.tipo}`);
  }
}
probarGenerador(gen, { semillas: 600, recalcular, igual: (a, b) => a === b });
probarFugas(gen, { grupo: p => p._datos.tipo });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla} (${c.entrada.tipo})`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.equal(p.respuesta.valor, c.esperado.respuesta);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.texto);
  });
}

const TEORIA = require('../../contenido/teoria/aritmetica/divisibilidad.js');
const IDEAS = TEORIA.ideas.map(i => i.id);
test('tipos por idea: las seis ideas de la teoría, y generar(semilla, { idea }) da solo los suyos', () => {
  assert.deepEqual(Object.keys(gen.TIPOS_POR_IDEA), IDEAS);
  assert.deepEqual(gen.TIPOS_POR_UNIDAD['aritmetica.divisibilidad'], Object.values(gen.TIPOS_POR_IDEA).flat());
  for (const idea of IDEAS) {
    const vistos = new Set();
    for (let s = 0; s < 300; s++) {
      const p = gen.generar(`i${s}`, { idea, unidad: 'aritmetica.divisibilidad' });
      assert.equal(p._datos.idea, idea);
      assert.equal(p.unidadCatalogo, 'aritmetica.divisibilidad');
      vistos.add(p._datos.tipo);
    }
    assert.deepEqual([...vistos].sort(), [...gen.TIPOS_POR_IDEA[idea]].sort(), `${idea}: no salen todos sus tipos`);
  }
});

test('niveles: cada idea llega a nivel de examen, y las preguntas de San Marcos tienen su tipo de nivel 3', () => {
  for (const idea of IDEAS) assert.ok(gen.TIPOS_POR_IDEA[idea].some(t => gen.NIVEL[t] === 3), `${idea}: sin nivel 3`);
  for (const idea of IDEAS) assert.ok(gen.TIPOS_POR_IDEA[idea].some(t => gen.NIVEL[t] === 1), `${idea}: sin nivel 1`);
  // San Marcos 2019-I (razón), 2023-II (le faltaba uno; cifras ocultas con 9; con 7), 2027-I (con 13), 2023-II RM (artículos).
  for (const t of ['razon', 'triple', 'ocultas', 'oculta-7-13', 'articulos']) assert.equal(gen.NIVEL[t], 3, t);
});

// Los códigos son los de la teoría de la unidad (hipótesis) y están en la tabla «Divisibilidad» del informe.
test('cada error usa un código de la teoría, es hipótesis, empieza por lo que hizo bien y está en la tabla del informe', () => {
  const teoria = fs.readFileSync(require.resolve('../../contenido/teoria/aritmetica/divisibilidad.js'), 'utf8');
  const informe = fs.readFileSync(require.resolve('../../docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md'), 'utf8');
  const tabla = informe.slice(informe.indexOf('## Divisibilidad (19 nov)'));
  assert.ok(tabla.length > 100, 'falta la sección «Divisibilidad (19 nov)» en el informe');
  const deLaTeoria = new Set(teoria.match(/AT-[A-ZÑ0-9-]+[A-ZÑ0-9]/g));
  const vistos = new Set();
  for (let s = 0; s < 1500; s++) for (const a of gen.generar(s).alternativas.filter(x => x.error)) {
    assert.ok(deLaTeoria.has(a.error.id), `semilla ${s}: ${a.error.id} no es de la teoría`);
    assert.equal(a.error.respaldo, 'hipotesis');
    assert.match(a.error.explicacion, /^Bien/, `semilla ${s}: ${a.error.explicacion}`);
    assert.ok(a.error.explicacion.split(/\s+/).length <= 30, a.error.explicacion);
    vistos.add(a.error.id);
  }
  for (const id of vistos) assert.ok(new RegExp(`(\\| |, )${id}( \\||,)`).test(tabla), `${id} no está en la tabla del informe`);
});

// Un color fijo por magnitud, el de la teoría (def.colores): envase turquesa, lo que sobra naranja, lo que se busca
// violeta. Sin verde ni carmín. La pregunta no colorea lo que se pide.
test('un color por magnitud: envase turquesa, lo que sobra naranja, lo que se busca violeta; sin verde ni carmín', () => {
  const COLOR = { e: TEORIA.colores.envase, r: TEORIA.colores.sobra, b: TEORIA.colores.busca };
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), V = p.variables, usadas = new Set();
    for (const [k, x] of Object.entries(V)) assert.equal(x.color, COLOR[k], `semilla ${s}: ${k} en ${x.color}`);
    for (const linea of [p.enunciado, p.pregunta, ...p.solucion]) for (const x of linea) {
      if (x && typeof x === 'object') { assert.ok(V[x.v], `semilla ${s}: «${x.t}» usa ${x.v}`); usadas.add(x.v); }
      else assert.equal(typeof x, 'string', `semilla ${s}: tramo inválido`);
    }
    assert.deepEqual([...usadas].sort(), Object.keys(V).sort());
    for (const x of p.pregunta) if (x && typeof x === 'object') assert.equal(x.v, 'e', `semilla ${s}: la pregunta colorea «${x.t}»`);
    // La respuesta, en la solución, con el color de su magnitud: un resto en naranja; lo demás, en violeta.
    const ult = p.solucion.flat().filter(x => x && typeof x === 'object' && x.t === p.respuesta.texto);
    assert.ok(ult.length, `semilla ${s} (${p._datos.tipo}): la solución no escribe la respuesta con color`);
  }
});

test('notación: × y nunca «·»; a̅b̅c̅ con raya en cada cifra; sin guion como menos; concordancia', () => {
  const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? x.t : String(x));
  for (let s = 0; s < 1000; s++) {
    const p = gen.generar(s);
    const todo = [[p.enunciado, p.pregunta, ...p.solucion].map(plano).join(' '), p.datos.join(' | '), p.alternativas.map(a => a.texto + ' | ' + (a.error ? a.error.explicacion : '')).join(' | ')].join(' | ');
    assert.ok(!/·|\*|(^|[\s(])-\d|\d\s?-\s?\d/.test(todo), `semilla ${s}: «·», «*» o guion: ${todo}`);
    for (const a of p.alternativas) assert.ok(!a.texto.includes('̅'), `semilla ${s}: ${a.texto} con raya`);
    for (const m of todo.matchAll(/(?:[a-z0-9☐]̅){2,}[a-z0-9☐]?(?!̅)/g)) assert.ok(/̅$/.test(m[0]), `semilla ${s}: «${m[0]}» sin raya completa`);
    assert.ok(!/\b1 sueltos|\b1 bolsitas|\b1 cajas|\b1 monedas|quedan 1\b|sobran 1\b|faltan 1\b|\b1 caramelos|no sobra 0/.test(todo), `semilla ${s}: ${todo}`);
  }
});

// Recuadro «Datos» (docs/plan-calidad.md §3, punto 13): líneas cortas en texto plano, sin la respuesta, con la
// herramienta de cada tipo y sin el paso hecho.
test('datos: una lista de líneas cortas, sin la respuesta, con la herramienta de cada tipo, en 400 semillas', () => {
  const palabras = t => (t.match(/[\p{L}\p{N}]+/gu) || []).length;
  const DEF = /N es múltiplo de d si N = d × k/, CONTEO = /Del 1 al N hay tantos múltiplos de d/, PRINC = /\(d̊ \+ r\) [+×−] \(d̊ \+ s\)/;
  const C93 = /Entre 9 y entre 3/, CICLO = /se repiten en ciclo/, PESOS = /peso de su lugar/, EC = /× x \+ \d+ × y = \d+, con x e y enteros/;
  const FORMULA = {
    'es-multiplo': DEF, 'cuantos-hasta': CONTEO, tramo: CONTEO, razon: DEF,
    suma: PRINC, veces: /k × \(d̊ \+ r\) = d̊ \+ k × r/, faltan: /N = d̊ − rₑ/, expresion: PRINC, triple: /N = d̊ − rₑ/,
    'nueve-tres': C93, ultimas: /Entre (4|8|2)/, 'cifra-9': C93, ocultas: C93,
    primeros: /Cada resto sale de multiplicar/, 'resto-potencia': CICLO, 'ultima-cifra': CICLO, dia: CICLO, 'potencia-mas': CICLO,
    once: PESOS, siete: PESOS, 'boleto-11': PESOS, 'oculta-7-13': PESOS,
    completar: EC, maneras: EC, 'menos-monedas': EC, articulos: EC,
  };
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), d = p._datos;
    assert.ok(Array.isArray(p.datos) && p.datos.length, `semilla ${s}: datos debe ser una lista no vacía`);
    for (const l of p.datos) {
      assert.ok(typeof l === 'string' && l.trim() === l && l.length, `semilla ${s}: línea vacía`);
      assert.ok(palabras(l) <= 22, `semilla ${s}: «${l}» tiene ${palabras(l)} palabras`);
      assert.ok(!/<[a-z/]|\bnull\b|\bNaN\b|\bundefined\b|^(Recuerda|Ojo|Cuidado|Fíjate)/i.test(l), `semilla ${s}: «${l}»`);
    }
    assert.equal(new Set(p.datos).size, p.datos.length, `semilla ${s}: líneas repetidas`);
    const todo = p.datos.join('\n');
    assert.match(todo, FORMULA[d.tipo], `semilla ${s} (${d.tipo}): falta su herramienta`);
    // La respuesta (de dos cifras o más, o un día) no está escrita en los datos.
    const c = p.respuesta.texto;
    if (c.length > 1 && !/^(10|99|100|999)$/.test(c)) assert.ok(!new RegExp(`(?<![\\d])${c}(?![\\d])`).test(todo), `semilla ${s} (${d.tipo}): los datos traen ${c}`);
  }
});

test('nunca se queda sin cuatro alternativas (semillas 0 a 3000, de texto y por idea)', () => {
  for (let s = 0; s <= 3000; s++) gen.generar(s);
  for (const s of ['entrada-1', 'salida-2', 'papel-1', 'examen-x']) gen.generar(s, { unidad: 'aritmetica.divisibilidad' });
  for (const idea of IDEAS) for (let s = 0; s < 200; s++) gen.generar(`p${s}`, { idea });
});

test('papel.json: 8 problemas de las seis ideas, con sus datos al final y su respuesta recalculada', () => {
  assert.equal(papel.problemas.length, 8);
  const ideas = new Set();
  papel.problemas.forEach((pr, i) => {
    const p = gen.generar(`papel-${i + 1}`);
    ideas.add(p._datos.idea);
    assert.match(pr.enunciado, /Datos: .+ Alternativas: /, pr.id);
    assert.ok(pr.respuesta.endsWith(p.alternativas.find(a => a.correcta).texto), pr.id);
    assert.ok(pr.respuesta.endsWith(recalcular(p)), `${pr.id}: ${pr.respuesta}`);
  });
  assert.deepEqual([...ideas].sort(), [...IDEAS].sort());
  // Las dos de examen son de San Marcos (2023-II y 2019-I).
  assert.deepEqual([7, 8].map(i => gen.generar(`papel-${i}`)._datos.tipo), ['ocultas', 'razon']);
});

// Auditoría (19 nov): «3 de cada 9» es «1 de cada 3», y entonces sirven otros totales. p y d van sin factor común, y con
// la razón reducida sigue habiendo un solo total entre L y U.
test('razon: p y d sin factor común; un solo total aunque se reduzca la razón (400 semillas)', () => {
  const mcd = (x, y) => (y ? mcd(y, x % y) : x);
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(`r${s}`, { idea: 'filas-de-m' }), d = p._datos;
    if (d.tipo !== 'razon') continue;
    assert.equal(mcd(d.p, d.d), 1, JSON.stringify(d));
    let n = 0; for (let T = d.L + 1; T < d.U; T++) if (T % d.d === 0) n++;
    assert.equal(n, 1, JSON.stringify(d));
  }
});
// Lector en frío A (19 nov): «le faltan rₑ», no k (k es el entero que multiplica), y el dato de k pedidos iguales.
test('datos: lo que falta es rₑ, y varios pedidos iguales llevan su propia línea', () => {
  for (let s = 0; s < 200; s++) {
    const p = gen.generar(`f${s}`, { idea: 'restos-suman' }), t = p.datos.join('\n');
    assert.ok(!/faltan k\b|− k\b/.test(t), t);
    if (['veces', 'triple'].includes(p._datos.tipo)) assert.match(t, /k pedidos iguales/);
  }
});
