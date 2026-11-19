// Pruebas de «Pisos, pasillos y cuartos» (idea 3 de Estructura atómica): casos.json (calculados aparte, con un script que
// no usa el generador), un recálculo independiente en 600 problemas (aquí los electrones se cuentan uno por uno, armando
// todos los juegos (n; ℓ; mₗ; mₛ) permitidos, no con 2ℓ + 1 ni con 2n²), fugas, el recuadro «Datos» en 400 semillas, los
// colores de la unidad y el papel.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');

// ---- Camino independiente: la lista de todos los electrones posibles de un nivel ----
const LETRAS = { s: 0, p: 1, d: 2, f: 3 };
function juegos(n) {
  const out = [];
  for (let l = 0; l <= n - 1; l++) for (let ml = -l; ml <= l; ml++) for (const ms of [0.5, -0.5]) out.push({ n, l, ml, ms });
  return out;
}
const permitido = ([n, l, ml, m2]) => Number.isInteger(n) && n >= 1 && l >= 0 && l <= n - 1 && ml >= -l && ml <= l && Math.abs(m2) === 1;
function recalcular(p) {
  const d = p._datos, J = juegos(d.n || 1);
  switch (d.tipo) {
    case 'orb-sub': return new Set(J.filter(x => x.l === d.l).map(x => x.ml)).size;
    case 'e-sub': return juegos(Math.max(d.n, d.l + 1)).filter(x => x.l === d.l).length;
    case 'orb-nivel': return J.filter(x => x.ms > 0).length;
    case 'e-nivel': return J.length;
    case 'condicion': return d.sub === 'ml' ? J.filter(x => x.ml === d.ml).length : J.filter(x => x.ms === d.ms).length;
    case 'valores': {
      if (d.sub === 'nmin') { let n = 1; while (!juegos(n).some(x => x.l === d.l)) n++; return n; }
      return 'val:' + [...new Set(J.filter(x => x.l === d.l).map(x => x.ml))].sort((a, b) => a - b).join(',');
    }
    case 'subnivel': return `sub:${d.n}${'spdf'[d.l]}:${juegos(d.n).filter(x => x.l === d.l).length}`;
    case 'imposible': {
      const buenos = d.juegos.filter(q => (d.sub === 'si' ? permitido(q) : !permitido(q)));
      assert.equal(buenos.length, 1, `${p.id}: una sola respuesta`);
      return 'qn:' + buenos[0].join(':');
    }
  }
  throw new Error('tipo desconocido ' + d.tipo);
}
const igual = (a, b) => a === b;
probarGenerador(gen, { semillas: 600, recalcular, igual });
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

test('salen todos los tipos y subtipos, los tres niveles y los errores de la teoría', () => {
  const tipos = new Set(), niveles = new Set(), ids = new Set();
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s), d = p._datos;
    tipos.add(d.tipo + (d.sub ? '/' + d.sub : '')); niveles.add(d.nivel);
    for (const a of p.alternativas) if (a.error) ids.add(a.error.id);
  }
  assert.deepEqual([...tipos].sort(), ['condicion/ml', 'condicion/ms', 'e-nivel', 'e-sub', 'imposible/no', 'imposible/si', 'orb-nivel', 'orb-sub', 'subnivel', 'valores/ml', 'valores/nmin']);
  assert.deepEqual([...niveles].sort(), [1, 2, 3]);
  for (const id of ['QM-ORBITAL-ELECTRON', 'QM-N-L', 'QM-L-DESDE-UNO', 'QM-L-IGUAL-N', 'QM-SIN-F', 'QM-OCHO-POR-NIVEL', 'QM-2N', 'QM-SOLO-ULTIMO',
    'QM-ML-POSITIVO', 'QM-L-CERO', 'QM-L-MENOR', 'QM-ML-FUERA', 'QM-MS-ENTERO', 'QM-CONDICION-IGNORA']) assert.ok(ids.has(id), `no sale ${id}`);
});

test('errores: hipótesis del informe, un código por alternativa y explicaciones que empiezan por lo que hizo bien', () => {
  const informe = require('node:fs').readFileSync(require('node:path').join(__dirname, '../../docs/investigacion/atomo-enlace-ideas-erroneas.md'), 'utf8');
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), malas = p.alternativas.filter(x => x.error);
    assert.equal(new Set(malas.map(a => a.error.id)).size, malas.length, `semilla ${s}: dos alternativas con el mismo código`);
    for (const a of malas) {
      assert.equal(a.error.respaldo, 'hipotesis');
      assert.ok(new RegExp(`(?<![\\w-])${a.error.id}(?![\\w-])`).test(informe), `${a.error.id} no está en el informe`);
      assert.match(a.error.explicacion, /^(Bien|Ese sí)/, `semilla ${s}: ${a.error.explicacion}`);
      if (typeof p.respuesta.valor === 'number' && !/^Ese/.test(a.error.explicacion)) assert.ok(new RegExp(`(^|\\D)${a.texto}(\\D|$)`).test(a.error.explicacion), `semilla ${s}: «${a.error.explicacion}» no muestra ${a.texto}`);
    }
  }
});

test('datos: lista de líneas cortas, con la regla de cada tipo y sin 2n² ni la respuesta, en 400 semillas', () => {
  const palabras = t => t.split(/\s+/).filter(w => /\p{L}/u.test(w)).length;
  const REGLA = { 'orb-sub': 'Orbitales de un subnivel: 2ℓ + 1', 'e-sub': 'En un orbital caben 2 electrones, de espín opuesto', valores: 'ℓ: s es 0, p es 1, d es 2, f es 3',
    'orb-nivel': 'ℓ va de 0 a n − 1', 'e-nivel': 'En un orbital caben 2 electrones, de espín opuesto', subnivel: 'ℓ: s es 0, p es 1, d es 2, f es 3',
    imposible: 'mₛ = +½ o −½', condicion: 'ℓ va de 0 a n − 1' };
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), d = p._datos;
    assert.ok(Array.isArray(p.datos) && p.datos.length >= 2, `semilla ${s}: datos debe ser una lista`);
    for (const l of p.datos) assert.ok(typeof l === 'string' && l.trim() === l && palabras(l) <= 22 && !/\bnull\b|NaN|undefined|^Dato:/.test(l), `semilla ${s}: «${l}»`);
    const todo = p.datos.join('\n');
    assert.ok(p.datos.includes(REGLA[d.tipo]), `semilla ${s}: falta la regla de ${d.tipo}`);
    assert.ok(!/2n²|n²/.test(todo), `semilla ${s}: los datos dan la fórmula del nivel ya armada`);
    const ok = p.alternativas.find(a => a.correcta).texto;
    if (typeof p.respuesta.valor === 'number' && p.respuesta.valor >= 4) assert.ok(!new RegExp(`(^|\\D)${ok}(\\D|$)`).test(todo), `semilla ${s}: el ${ok} está en los datos`);
    if (typeof p.respuesta.valor !== 'number') assert.ok(!todo.includes(ok), `semilla ${s}: los datos traen la respuesta`);
  }
});

test('colores: electrones violeta y orbitales turquesa (la tabla de la teoría); n, ℓ, mₗ y mₛ en tinta', () => {
  const def = require('../../contenido/teoria/quimica/estructura-atomica.js');
  assert.deepEqual(gen.COLOR, def.colores);
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s);
    for (const [k, x] of Object.entries(p.variables)) assert.equal(x.color, def.colores[x.mag], `semilla ${s}: ${k}`);
    for (const linea of [p.enunciado, p.pregunta, ...p.solucion]) for (const x of linea) if (x && typeof x === 'object') {
      assert.ok(p.variables[x.v], `semilla ${s}: «${x.t}» sin variable`);
      assert.ok(!/^[nℓ]\b|^m[ₗₛ]/.test(x.t), `semilla ${s}: un número cuántico con color: «${x.t}»`);
    }
  }
});

test('notación: ℓ y no l, subíndices de verdad y sin el subnivel g', () => {
  const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? String(x.t) : String(x));
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), t = plano([p.enunciado, p.pregunta, p.solucion, p.datos, p.alternativas.map(a => a.texto)]);
    assert.ok(!/\bl = |\bml\b|\bms\b|\dg\b|undefined/.test(t), `semilla ${s}: ${t.slice(0, 120)}`);
  }
});

test('ejemplos de la teoría: 3d tiene 5 orbitales, el nivel 4 caben 32, n = 3 con mₗ = 0 son 6', () => {
  assert.equal(gen.orbSub(2), 5);
  assert.equal(gen.eNivel(4), 32);
  assert.equal(gen.conMl(3, 0), 6);
  assert.equal(gen.conMs(3), 9);
  assert.ok(!gen.posible([2, 2, 0, 1]) && gen.posible([3, 2, 1, -1]));
});

test('papel.json: de 5 a 10 problemas, generados del mismo generador y con sus datos al final', () => {
  const { armar, texto } = require('../../herramientas/papel-generador.js');
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  assert.equal(JSON.stringify(papel, null, 2) + '\n', texto(armar('niveles-orbitales')), 'papel.json no está al día: node herramientas/papel-generador.js niveles-orbitales');
  for (const q of papel.problemas) assert.match(q.enunciado, / Datos: .+ Alternativas: /, q.id);
});

test('nunca se queda sin cuatro alternativas (semillas 0 a 2000 y de texto)', () => {
  for (let s = 0; s <= 2000; s++) gen.generar(s);
  for (const s of ['entrada-1', 'entrada-2', 'salida-1', 'salida-3', 'papel-1', 'papel-8', 'examen-x']) gen.generar(s);
});

// Cabos de la Etapa 4 (19 nov; auditoría de Estructura atómica, B5): si un problema nombra un núclido con su elemento
// («¹⁴C», «carbono-14»), está en la tabla de núclidos reales de plantillas/particulas-nucleo/nuclidos.js.
test('ningún problema nombra un núclido que no esté en la tabla de núclidos reales (600 semillas, casos y papel)', () => {
  const Nuclidos = require('../particulas-nucleo/nuclidos.js');
  const cadenas = (x, out = []) => { if (typeof x === 'string') out.push(x); else if (x && typeof x === 'object') for (const v of Array.isArray(x) ? x : Object.values(x)) cadenas(v, out); return out; };
  const revisa = (donde, x) => { for (const t of cadenas(x)) for (const n of Nuclidos.enTexto(t)) assert.ok(Nuclidos.existe(n.z, n.a), `${donde}: «${n.texto}» no está en la tabla («${t}»)`); };
  for (let s = 0; s < 600; s++) { const p = gen.generar(`nuc${s}`); revisa(`semilla nuc${s}`, [p.enunciado, p.pregunta, p.datos, p.solucion, p.alternativas.map(a => [a.texto, a.explicacion])]); }
  revisa('casos.json', casos); revisa('papel.json', papel);
});
