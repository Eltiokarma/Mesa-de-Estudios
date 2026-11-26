// Pruebas de «El núcleo y sus vecinos» (idea 1 de Estructura atómica): casos.json (calculados aparte, con un script que
// no usa el generador), un recálculo independiente en 600 problemas (las partículas se cuentan desde Z, A y la carga, y
// las afirmaciones se juzgan con una tabla escrita aquí), fugas, el recuadro «Datos» en 400 semillas, los colores de la
// unidad, la notación (el nitrógeno nunca como «N») y el papel.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador, probarFugas, dentroDeEscala } = require('../../nucleo/probar-generador.js');
const Nuclidos = require('./nuclidos.js');

// ---- Camino independiente ----
// Dónde está cada partícula y qué afirmaciones son verdad (escrito aquí, sin leer el generador).
const ES = { positiva: 'p', 'sin-carga': 'n', negativa: 'e', liviana: 'e' };
const VERDAD = { 'pn-nucleo': true, 'e-fuera': true, 'neutro-e': true, 'masa-nucleo': true,
  'e-nucleo': false, 'p-fuera': false, 'n-fuera': false, 'neutro-n': false, 'masa-e': false };
function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'donde') {
    if (d.sub === 'particula') return `donde:${ES[d.ids[0]]}:si`;
    const buenas = d.ids.filter(id => VERDAD[id] === (d.sub === 'correcta'));
    assert.equal(buenas.length, 1, `${p.id}: una sola`);
    return `donde:${buenas[0]}`;
  }
  if (d.tipo === 'nuclidos') {
    if (d.sub === 'isotopos') { assert.equal(d.a[0], d.b[0]); return d.pide === 'igual' ? 'iso:igual:pe' : 'iso:reacciona:igual'; }
    const [z1, a1] = d.a, [z2, a2] = d.b;
    return 'nuc:' + (z1 === z2 ? 'isotopos' : a1 === a2 ? 'isobaros' : a1 - z1 === a2 - z2 ? 'isotonos' : 'nada');
  }
  if (d.tipo === 'isoelectronico') {
    const e = d.y[0] - d.y[1], z = e + d.x;
    return d.sub === 'z' ? z : `el:${z}`;
  }
  if (d.tipo === 'vecinos') {
    const [z1, a1] = d.a, [z2, a2] = d.b;
    if (d.sub === 'isobaros') { assert.equal(a1, a2); return a1 - z2; }
    if (d.sub === 'isotonos') { assert.equal(a1 - z1, a2 - z2); return z2 + (a1 - z1); }
    assert.equal(z1, z2); return a2 - z1;
  }
  if (d.tipo === 'masa-ion') return d.A;
  throw new Error('tipo desconocido ' + d.tipo);
}
probarGenerador(gen, { semillas: 600, recalcular, igual: (a, b) => a === b });
probarFugas(gen, { grupo: p => p._datos.tipo + '/' + (p._datos.sub || '') });

for (const k of casos.casos) {
  test(`casos.json: semilla ${k.semilla}`, () => {
    const p = gen.generar(k.semilla);
    assert.deepEqual(p._datos, k.entrada, 'el generador cambió: recalcula casos.json');
    assert.equal(p.respuesta.valor, k.esperado.respuesta);
    assert.equal(p.alternativas.find(a => a.correcta).texto, k.esperado.texto);
  });
}
test('casos.json: de 15 a 20 casos, con todos los tipos', () => {
  assert.ok(casos.casos.length >= 15 && casos.casos.length <= 20);
  assert.deepEqual([...new Set(casos.casos.map(c => c.entrada.tipo))].sort(), [...gen.TIPOS].sort());
});

test('los núclidos de las listas son reales (tabla nuclidos.js) y cumplen su relación', () => {
  // La tabla de núclidos reales hasta Z = 54 (auditoría, B5): naturales y radiactivos conocidos. Antes la prueba traía
  // una lista corta propia; ahora todas las pruebas de la unidad leen la misma tabla.
  const real = (z, a) => assert.ok(Nuclidos.existe(z, a), `${Nuclidos.SIMB[z]}-${a} no está en la tabla de núclidos reales`);
  for (const [rel, pares] of Object.entries(gen.PARES)) for (const [[z1, a1], [z2, a2]] of pares) {
    real(z1, a1); real(z2, a2);
    const r = z1 === z2 ? 'isotopos' : a1 === a2 ? 'isobaros' : a1 - z1 === a2 - z2 ? 'isotonos' : 'nada';
    assert.equal(r, rel, `${z1}-${a1} y ${z2}-${a2}`);
  }
  // Los iones de «masa-ion» van con la letra X, pero sus números son los de un núclido real.
  for (const [z, a] of gen.IONES) real(z, a);
  // Los símbolos y los nombres del generador son los de la tabla.
  gen.SIMB.forEach((x, z) => assert.equal(x, Nuclidos.SIMB[z]));
  gen.NOMBRE.forEach((x, z) => assert.equal(x, Nuclidos.NOMBRE[z]));
});

test('todo núclido que un problema nombra con su elemento está en la tabla (1500 semillas, casos.json y papel.json)', () => {
  const cadenas = (x, out = []) => { if (typeof x === 'string') out.push(x); else if (x && typeof x === 'object') for (const v of Array.isArray(x) ? x : Object.values(x)) cadenas(v, out); return out; };
  const vistos = new Set();
  const revisa = (donde, x) => {
    for (const t of cadenas(x)) for (const n of Nuclidos.enTexto(t)) {
      vistos.add(`${n.z}-${n.a}`);
      assert.ok(Nuclidos.existe(n.z, n.a), `${donde}: «${n.texto}» no está en la tabla de núclidos reales («${t}»)`);
    }
  };
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(`nuc${s}`);
    revisa(`semilla nuc${s} (${p._datos.tipo})`, [p.enunciado, p.pregunta, p.datos, p.solucion, p.alternativas.map(a => [a.texto, a.explicacion])]);
    // Los núclidos de _datos (a y b, o Z y A), aunque el texto los nombre con X.
    const d = p._datos;
    for (const par of [d.a, d.b]) if (Array.isArray(par)) assert.ok(Nuclidos.existe(par[0], par[1]), `semilla nuc${s}: ${par.join('-')}`);
    if (d.tipo === 'masa-ion') assert.ok(Nuclidos.existe(d.Z, d.A), `semilla nuc${s}: ${d.Z}-${d.A}`);
  }
  revisa('casos.json', casos); revisa('papel.json', papel);
  assert.ok(vistos.size >= 30, `los problemas nombran núclidos (${vistos.size})`);
});

test('salen todos los tipos y subtipos, los tres niveles y los errores pedidos', () => {
  const tipos = new Set(), niveles = new Set(), ids = new Set();
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s), d = p._datos;
    tipos.add(d.tipo + (d.sub ? '/' + d.sub : '')); niveles.add(d.nivel);
    for (const a of p.alternativas) if (a.error) ids.add(a.error.id);
  }
  assert.deepEqual([...tipos].sort(), ['donde/correcta', 'donde/incorrecta', 'donde/particula', 'isoelectronico/elemento', 'isoelectronico/z', 'masa-ion',
    'nuclidos/isotopos', 'nuclidos/que-son', 'vecinos/isobaros', 'vecinos/isotonos', 'vecinos/isotopos']);
  assert.deepEqual([...niveles].sort(), [1, 2, 3]);
  for (const id of ['QM-ELECTRON-NUCLEO', 'QM-PROTON-AFUERA', 'QM-NEUTRON-AFUERA', 'QM-PARTICULA-CARGA', 'QM-NEUTRO-NEUTRONES', 'QM-NUCLIDO-ISOTOPO',
    'QM-NUCLIDO-ISOBARO', 'QM-NUCLIDO-ISOTONO', 'QM-NUCLIDO-NADA', 'QM-ISOTOPO-N', 'QM-ISOTOPO-A', 'QM-ISOTOPO-ELEMENTO', 'QM-ISOTOPO-REACCIONA',
    'QM-ISOTOPO-UNO', 'QM-ISO-Z', 'QM-ISO-NEUTRO', 'QM-CARGA-SIGNO', 'QM-CARGA-E', 'QM-NEUTRONES', 'QM-SUMA-TODO', 'QM-NUCLIDO-SIGNO', 'AT4'])
    assert.ok(ids.has(id), `no sale ${id}`);
});

test('errores: del informe, un código por alternativa y el valor de cada error en su explicación', () => {
  const informe = require('node:fs').readFileSync(require('node:path').join(__dirname, '../../docs/investigacion/atomo-enlace-ideas-erroneas.md'), 'utf8');
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), malas = p.alternativas.filter(x => x.error);
    assert.equal(new Set(malas.map(a => a.error.id)).size, malas.length, `semilla ${s}: dos alternativas con el mismo código`);
    for (const a of malas) {
      assert.equal(a.error.respaldo, a.error.id === 'AT4' ? 'parcial' : 'hipotesis');
      assert.ok(new RegExp(`(?<![\\w-])${a.error.id}(?![\\w-])`).test(informe), `${a.error.id} no está en el informe`);
      if (typeof p.respuesta.valor === 'number') {
        assert.ok(dentroDeEscala(a, p.respuesta.valor), `semilla ${s}: ${a.texto} fuera de escala`);
        assert.ok(new RegExp(`(^|\\D)${a.texto}(\\D|$)`).test(a.error.explicacion), `semilla ${s}: «${a.error.explicacion}» no muestra ${a.texto}`);
      }
    }
  }
});

test('datos: lista de líneas cortas, con la fórmula de cada tipo y sin la respuesta, en 400 semillas', () => {
  const palabras = t => t.split(/\s+/).filter(w => /\p{L}/u.test(w)).length;
  const FORMULA = { donde: 'Protón: carga +1', nuclidos: 'A = Z + N', isoelectronico: 'Isoelectrónicos: la misma cantidad de electrones', vecinos: 'Isótopos: mismo Z. Isóbaros: mismo A. Isótonos: mismo N', 'masa-ion': 'carga = Z − e⁻' };
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), d = p._datos;
    assert.ok(Array.isArray(p.datos) && p.datos.length >= 2, `semilla ${s}: datos`);
    for (const l of p.datos) assert.ok(typeof l === 'string' && l.trim() === l && palabras(l) <= 22 && !/\bnull\b|NaN|undefined|^Dato:/.test(l), `semilla ${s}: «${l}»`);
    const todo = p.datos.join('\n'), ok = p.alternativas.find(a => a.correcta).texto;
    const formula = d.tipo === 'nuclidos' && d.pide === 'reacciona' ? 'Una reacción química depende de los electrones' : FORMULA[d.tipo];
    assert.ok(p.datos.includes(formula), `semilla ${s}: falta «${formula}»`);
    if (d.tipo === 'masa-ion') assert.ok(p.datos.includes('A = Z + N'));
    if (typeof p.respuesta.valor === 'number') assert.ok(!new RegExp(`(^|\\D)${ok}(\\D|$)`).test(todo), `semilla ${s}: el ${ok} está en los datos`);
    // En «¿qué son?» se elige entre las definiciones de los datos (contrato, punto 13): la palabra está a propósito.
    else if (d.sub !== 'elemento' && d.sub !== 'que-son') assert.ok(!todo.includes(ok), `semilla ${s}: los datos traen la respuesta`);
    // Al elegir un elemento, los datos dan el Z de todos los que salen entre las alternativas (no solo el de la respuesta).
    if (d.sub === 'elemento') for (const a of p.alternativas) assert.ok(todo.includes(` ${a.texto.match(/Z = (\d+)/)[1]}`), `semilla ${s}: falta el Z de ${a.texto}`);
  }
});

test('colores de la unidad (Z naranja, N turquesa, electrones violeta, carga carmín, A en tinta) y notación', () => {
  const def = require('../../contenido/teoria/quimica/estructura-atomica.js');
  assert.deepEqual(gen.COLOR, def.colores);
  const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? String(x.t) : String(x));
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    for (const [k, x] of Object.entries(p.variables)) assert.equal(x.color, def.colores[x.mag], `semilla ${s}: ${k}`);
    for (const linea of [p.enunciado, p.pregunta, ...p.solucion]) for (const x of linea) if (x && typeof x === 'object') {
      assert.ok(p.variables[x.v], `semilla ${s}: «${x.t}» sin variable`);
      assert.ok(!/^A\b|^[A-E]\)?$/.test(x.t), `semilla ${s}: «${x.t}» con color (A va en tinta; las letras de alternativa, sin color)`);
    }
    const t = plano([p.enunciado, p.pregunta, p.solucion, p.datos, p.alternativas.map(a => a.texto), p.alternativas.filter(a => a.error).map(a => a.error.explicacion)]);
    // El nitrógeno, como símbolo, siempre con su A (¹⁴N): nunca «N» con carga ni «el N» (N son los neutrones).
    assert.ok(!/(^|[^⁰¹²³⁴⁵⁶⁷⁸⁹\p{L}])N[⁺⁻¹²³]|\b(el|del|un) N\b(?! =)/u.test(t), `semilla ${s}: «N» suelto: ${t.slice(0, 160)}`);
  }
});

test('papel.json: de 5 a 10 problemas, generados del mismo generador y con sus datos al final', () => {
  const { armar, texto } = require('../../herramientas/papel-generador.js');
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  assert.equal(JSON.stringify(papel, null, 2) + '\n', texto(armar('particulas-nucleo')), 'papel.json no está al día: node herramientas/papel-generador.js particulas-nucleo');
  for (const q of papel.problemas) assert.match(q.enunciado, / Datos: .+ Alternativas: /, q.id);
});

test('nunca se queda sin cuatro alternativas (semillas 0 a 2000 y de texto)', () => {
  for (let s = 0; s <= 2000; s++) gen.generar(s);
  for (const s of ['entrada-1', 'entrada-2', 'salida-1', 'salida-3', 'papel-1', 'papel-8', 'examen-x']) gen.generar(s);
});
