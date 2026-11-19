// Pruebas propias de «Propiedades periódicas» (además del validador común de contenido/teoria/teoria.test.js). Fase 3 del
// método (19 nov, etapa 5): las cuatro ideas rehechas contra el contrato (docs/etapa5/propuesta-quimica.md, B1 a B4).
//   - las cuatro ideas en el orden de la propuesta, con sus id; la unidad pasaría el validador con calidad: 2 (simulada;
//     no se declara hasta el lector en frío y el auditor) y cada idea estrena sus palabras;
//   - colores: Z naranja, radio turquesa, energía carmín, electronegatividad violeta; sin verde; las letras A–E, sin color;
//   - la primera pantalla de cada idea es un objeto de prueba, y la misión no está cumplida al abrir y la cumplen solo
//     los casos previstos;
//   - nada antes de Predice da su respuesta (los valores y las frases que la delatan);
//   - «Ahora tú»: datos, cuatro opciones distintas, una correcta, sin códigos repetidos (salvo el V/F), y la respuesta que
//     da una tabla escrita aparte, en 400 semillas; «Así se resuelve» no repite sus preguntas;
//   - los 60 ejemplos: 5 por nivel, datos, alternativas explicadas una por una y la letra correcta repartida (4 de cada);
//   - las figuras de quim-tira caben con 4 de margen y sus rótulos no se pisan.
// Cuentas de los ejemplos rehechas aparte en scratchpad (e5-quimica/cuentas-b.py).
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../../../nucleo/kit/kit.js');
const Teoria = require('../../../nucleo/teoria.js');
const Glosario = require('../../../nucleo/glosario.js');
const E = require('../../../nucleo/ecuacion.js');
const def = require('./propiedades-periodicas.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
const [I1, I2, I3, I4] = def.ideas;
const SEMILLAS = 400;
const limpio = x => (Array.isArray(x) ? x.flatMap(y => (y === undefined || y === null ? [] : Array.isArray(y) ? [' ', ...limpio(y), ' '] : [y])) : x === undefined || x === null ? [] : [x]);
const plano = x => E.texto(limpio(x));
const fichas = x => (x === null || x === undefined || typeof x !== 'object' ? [] : Array.isArray(x) ? x.flatMap(fichas)
  : typeof x.v === 'string' && /^c-/.test(x.v) ? [x] : Object.values(x).flatMap(fichas));

// Tablas escritas aparte (no usan las de la unidad): símbolo → [Z, periodo, grupo, radio (pm), EI (kJ/mol), EN].
const T = {};
[['H', 1, 1, 1, 53, 1312, 2.20], ['Li', 3, 2, 1, 167, 520, 0.98], ['Be', 4, 2, 2, 112, 900, 1.57], ['B', 5, 2, 13, 87, 801, 2.04], ['C', 6, 2, 14, 67, 1086, 2.55],
  ['N', 7, 2, 15, 56, 1402, 3.04], ['O', 8, 2, 16, 48, 1314, 3.44], ['F', 9, 2, 17, 42, 1681, 3.98], ['Na', 11, 3, 1, 190, 496, 0.93], ['Mg', 12, 3, 2, 145, 738, 1.31],
  ['Al', 13, 3, 13, 118, 578, 1.61], ['Si', 14, 3, 14, 111, 787, 1.90], ['P', 15, 3, 15, 98, 1012, 2.19], ['S', 16, 3, 16, 88, 1000, 2.58], ['Cl', 17, 3, 17, 79, 1251, 3.16],
  ['K', 19, 4, 1, 243, 419, 0.82], ['Ca', 20, 4, 2, 194, 590, 1.00], ['Zn', 30, 4, 12, 142, 906, 1.65], ['Ga', 31, 4, 13, 136, 579, 1.81], ['Ge', 32, 4, 14, 125, 762, 2.01],
  ['As', 33, 4, 15, 114, 944, 2.18], ['Se', 34, 4, 16, 103, 941, 2.55], ['Br', 35, 4, 17, 94, 1140, 2.96]]
  .forEach(([s, z, p, g, r, ei, en]) => { T[s] = { z, p, g, r, ei, en }; });
const NOMBRES = { hidrógeno: 'H', litio: 'Li', berilio: 'Be', boro: 'B', carbono: 'C', nitrógeno: 'N', oxígeno: 'O', flúor: 'F', sodio: 'Na', magnesio: 'Mg', aluminio: 'Al',
  silicio: 'Si', fósforo: 'P', azufre: 'S', cloro: 'Cl', potasio: 'K', calcio: 'Ca', cinc: 'Zn', galio: 'Ga', germanio: 'Ge', arsénico: 'As', selenio: 'Se', bromo: 'Br' };
// Iones (Shannon, NC 6): [protones, electrones, radio].
const IONES = { 'Li⁺': [3, 2, 76], 'Na⁺': [11, 10, 102], 'K⁺': [19, 18, 138], 'Rb⁺': [37, 36, 152], 'Be²⁺': [4, 2, 45], 'Mg²⁺': [12, 10, 72], 'Ca²⁺': [20, 18, 100], 'Sr²⁺': [38, 36, 118],
  'Al³⁺': [13, 10, 53.5], 'F⁻': [9, 10, 133], 'Cl⁻': [17, 18, 181], 'Br⁻': [35, 36, 196], 'O²⁻': [8, 10, 140], 'S²⁻': [16, 18, 184], 'Se²⁻': [34, 36, 198] };
const AE = { H: -73, Li: -60, C: -122, O: -141, F: -328, Na: -53, P: -72, S: -200, Cl: -349, K: -48, Br: -325 };

test('las cuatro ideas en el orden de la propuesta; pasaría el validador con calidad 2 y cada idea estrena sus palabras', () => {
  assert.deepEqual(def.ideas.map(i => i.id), ['radio-atomico-ionico', 'radio-ionico', 'energia-ionizacion', 'electronegatividad']);
  assert.deepEqual(def.ideas.map(i => i.titulo), ['Radio atómico', 'Radio de iones e isoelectrónicos', 'Energía de ionización y afinidad electrónica', 'Electronegatividad y carácter metálico']);
  assert.equal(def.calidad, 2, 'cerrada el 19 nov tras el lector en frío y el auditor');
  const cat = require('../../../catalogo/cursos/quimica.json').unidades.find(u => u.id === def.unidad);
  const p = Teoria.problemas(Object.assign({}, def, { calidad: 2 }), { temas: cat.temas, semillas: 60 });
  assert.deepEqual(p, [], p.join('\n'));
  assert.deepEqual(Glosario.porIdea(def).map(l => l.filter(g => g.simple).map(g => g.termino)), [
    ['radio atómico', 'picómetro', 'carga nuclear'],
    ['radio iónico', 'serie isoelectrónica'],
    ['energía de ionización', 'afinidad electrónica', 'energías de ionización sucesivas'],
    ['electronegatividad', 'par compartido', 'tendencia periódica'],
  ]);
  assert.deepEqual(def.laboratorio.map(m => m.id), ['tres-propiedades', 'dos-elementos']);
});

// Todo lo que se lee en una idea, y todas sus figuras.
function lecturas(i) {
  const out = [], add = (donde, x) => out.push({ donde, x }), j = i.juega;
  for (const [k, t] of i.lee.tarjetas.entries()) add(`lee ${k + 1}`, [t.titulo, t.texto, t.ecuacion]);
  add('consigna', j.consigna); add('misión', [j.mision.texto, j.mision.bien]); add('leyenda', j.leyenda.map(x => [x.s, x.t]));
  for (const v of Teoria.grilla(j.controles)) add(`lectura ${JSON.stringify(v)}`, j.lectura(v));
  add('predice', [i.predice.pregunta, i.predice.datos, i.predice.opciones.map(o => [o.texto, o.siFuera])]);
  for (const [k, p] of i.mira.pasos.entries()) add(`mira ${k + 1}`, [p.texto, p.ecuacion]);
  add('regla', [i.regla.texto, i.regla.ecuacion, i.regla.condicion]);
  for (const [k, e] of i.ejemplos.entries()) add(`ejemplo ${k + 1}`, [e.enunciado, e.alternativas, e.datos, e.solucion.map(x => [x.texto, x.ecuacion]), e.respuesta]);
  for (let s = 0; s < 60; s++) {
    const a = i.ahoraTu.generar(s), r = i.resuelve.generar(s);
    add(`ahora tú ${s}`, [a.pregunta, a.datos, a.opciones.map(o => [o.texto, o.siFuera]), a.solucion.texto, a.solucion.ecuacion]);
    add(`resuelve ${s}`, [r.enunciado, r.datos, r.pasos.map(x => [x.texto, x.ecuacion]), r.respuesta]);
  }
  return out;
}
function figuras(i) {
  const out = [], con = (donde, f, pieza) => { if (f && f.datos) out.push({ donde: `${i.id} ${donde}`, datos: f.datos, estado: f.estado || {}, pieza: f.pieza || pieza || i.pieza }); };
  for (const v of Teoria.grilla(i.juega.controles)) con(`juego ${JSON.stringify(v)}`, i.juega.dibujo(v), i.juega.pieza);
  for (const [k, t] of i.lee.tarjetas.entries()) con(`lee ${k + 1}`, t.dibujo, t.pieza);
  con('predice', i.predice.dibujo, i.predice.pieza); con('revelar', i.predice.revelar, i.predice.pieza);
  for (let c = 0; c <= 6; c++) con(`mira corte ${c}`, { datos: i.mira.datos, estado: { corte: c } }, i.mira.pieza);
  i.ejemplos.forEach((e, k) => con(`ejemplo ${k + 1}`, e.figura));
  if (i.regla.dibujo) con('regla', i.regla.dibujo, i.regla.dibujo.pieza || i.mira.pieza);
  for (let s = 0; s < 40; s++) {
    const r = i.resuelve.generar(s), a = i.ahoraTu.generar(s);
    con(`resuelve ${s}`, r.dibujo, i.resuelve.pieza); r.pasos.forEach((p, k) => con(`resuelve ${s} paso ${k + 1}`, p.dibujo, i.resuelve.pieza));
    con(`ahora tú ${s}`, a.dibujo, i.ahoraTu.pieza); con(`solución ${s}`, a.solucion.dibujo, i.ahoraTu.pieza);
  }
  return out;
}

test('colores: Z naranja, radio turquesa, energía carmín, electronegatividad violeta; sin verde; las letras A–E, sin color', () => {
  assert.deepEqual(def.colores, { z: 'o', radio: 'i', energia: 'h', en: 'f' });
  const usados = new Set();
  for (const i of def.ideas) {
    for (const l of lecturas(i)) for (const f of fichas(l.x)) {
      assert.ok(f.m && def.colores[f.m], `${i.id}, ${l.donde}: ficha sin magnitud (${f.t})`);
      assert.equal(f.v, `c-${def.colores[f.m]}`, `${i.id}, ${l.donde}: ${f.t}`);
      assert.ok(!/^[A-E]$/.test(f.t), `${i.id}, ${l.donde}: la letra ${f.t} lleva color`);
      usados.add(f.m);
    }
    for (const f of figuras(i)) assert.ok(!/var\(--c-d\)|var\(--el-/.test(Kit.piezas[f.pieza].dibujar(f.datos, f.estado)), `${f.donde}: verde o paleta de elementos`);
  }
  assert.deepEqual([...usados].sort(), ['en', 'energia', 'radio', 'z']);
  // Cada idea pinta su magnitud con su color, y no la de otra: el radio no sale en carmín ni la energía en turquesa.
  const color = { 'radio-atomico-ionico': 'i', 'radio-ionico': 'i', 'energia-ionizacion': 'h', electronegatividad: 'f' };
  for (const i of def.ideas) for (const f of figuras(i).filter(x => x.pieza === 'quim-tabla')) {
    const p = f.datos.propiedad; if (p) assert.equal(p.color, color[i.id], f.donde);
    for (const m of f.datos.marcadas || []) assert.equal(m.color, color[i.id], `${f.donde}: casilla marcada`);
  }
});

test('la primera pantalla es un objeto de prueba; la misión no está cumplida al abrir y la cumplen solo los casos previstos', () => {
  const P = Kit.piezas['quim-tira'];
  const casos = [[I1, 'cristal', [{ g: '1' }]], [I2, 'salero', [{ x: 'Br' }]], [I3, 'romana', [{ z: 5 }, { z: 8 }]], [I4, 'soga', [{ a: '19', b: '9' }]]];
  for (const [i, objeto, logran] of casos) {
    const t = i.lee.tarjetas[0];
    assert.equal(t.pieza, 'quim-tira', i.id);
    assert.ok(P.dibujar(t.dibujo.datos).includes(`data-objeto="${objeto}" data-prueba="si"`), `${i.id}: ${objeto}`);
    const j = i.juega, inicio = Object.fromEntries(j.controles.map(c => [c.id, c.inicio !== undefined ? c.inicio : c.opciones[0].valor]));
    assert.equal(j.mision.logrado(inicio), false, `${i.id}: cumplida al abrir`);
    assert.deepEqual(Teoria.grilla(j.controles).filter(v => j.mision.logrado(v)), logran, i.id);
    assert.equal(new Set(i.predice.opciones.map(o => o.error)).size, 4, `${i.id}: un código por distractor en Predice`);
  }
  // La misión de la idea 4 es de verdad la mayor diferencia: K–F, con la tabla escrita arriba.
  assert.ok(Math.abs((T.F.en - T.K.en) - 3.16) < 1e-9);
  // Las analogías (romana y soga) dicen su límite en «Lee».
  assert.ok(/solo una comparación/.test(plano(I3.lee.tarjetas.map(t => t.texto))));
  assert.ok(/solo una comparación/.test(plano(I4.lee.tarjetas.map(t => t.texto))));
});

test('nada antes de Predice da su respuesta', () => {
  const antes = i => {
    const j = i.juega, g = Glosario.porIdea(def)[def.ideas.indexOf(i)];
    return [i.pregunta, i.actividad, j.consigna, j.mision.texto, j.mision.bien, ...i.lee.tarjetas.map(t => plano([t.titulo, t.texto, t.ecuacion])), ...j.leyenda.map(x => plano([x.s, x.t])),
      ...g.flatMap(x => [x.simple || '', x.def, ...(x.ejemplos || [])]), ...Teoria.grilla(j.controles).map(v => plano(j.lectura(v)))].join(' \n ');
  };
  // Idea 1: nada dice que el radio baje en un periodo ni por qué.
  assert.ok(!/radio baja|se achica hacia la derecha|más protones jalan/i.test(antes(I1)), 'idea 1');
  // Idea 2: el juego no muestra el O²⁻ ni el F⁻ (la serie del neón no sale entera).
  for (const v of Teoria.grilla(I2.juega.controles)) assert.ok(I2.juega.dibujo(v).datos.esferas.every(e => !['O²⁻', 'F⁻'].includes(e.s)), JSON.stringify(v));
  assert.ok(!/O²⁻/.test(antes(I2)), 'idea 2');
  // Idea 3: el juego recorre el periodo 2, no el fósforo ni el azufre, y no dice por qué baja.
  for (const v of Teoria.grilla(I3.juega.controles)) assert.ok(v.z <= 10);
  assert.ok(!/fósforo|azufre|apareado|pareja/i.test(antes(I3)), 'idea 3');
  // Idea 4: nada dice que el átomo de flúor solo sea neutro o que la electronegatividad se mida en un enlace.
  assert.ok(!/neutro|aislado|cuando forma un enlace/i.test(antes(I4)), 'idea 4');
});

// Respuesta esperada de un caso de «Ahora tú», con las tablas escritas arriba.
const simDe = nombre => NOMBRES[nombre];
function esperado(a) {
  const q = plano(a.pregunta);
  let m;
  if ((m = q.match(/^¿Qué átomo tiene mayor radio: el de (\S+) o el de (\S+)\?$/))) { const [x, y] = [m[1], m[2]]; return `El de ${T[simDe(x)].r > T[simDe(y)].r ? x : y}`; }
  if ((m = q.match(/^Ordena de mayor a menor radio atómico: (.+)\.$/))) return m[1].split(', ').map(simDe).sort((x, y) => T[y].r - T[x].r).join(' > ');
  if ((m = q.match(/^Los elementos (.+) son de los grupos A/))) {
    const L = [...m[1].matchAll(/([XQR]) \(Z = (\d+)\)/g)].map(x => [x[1], Object.values(T).find(t => t.z === +x[2])]);
    return L.sort((x, y) => y[1].r - x[1].r).map(x => x[0]).join(' > ');
  }
  if ((m = q.match(/sus núcleos quedan a (\d+) pm/))) return `${+m[1] / 2} pm`;
  if ((m = q.match(/^¿Qué es más grande: el átomo de (\S+) o el ion (\S+)\?$/))) { const [p, e] = IONES[m[2]]; assert.equal(T[simDe(m[1])].z, p); return e > p ? `El ion ${m[2]}` : `El átomo de ${m[1]}`; }
  if ((m = q.match(/^El (\S+) y el (\S+) tienen (\d+) electrones cada uno\. ¿Cuál es más grande\?$/))) {
    assert.equal(IONES[m[1]][1], +m[3]); assert.equal(IONES[m[2]][1], +m[3]);
    return `El ${IONES[m[1]][0] < IONES[m[2]][0] ? m[1] : m[2]}`;
  }
  if ((m = q.match(/^¿Cuántos electrones tiene el ion (\S+)\?$/))) return String(IONES[m[1]][1]);
  if ((m = q.match(/^El (\S+), el (\S+) y el (\S+) tienen (\d+) electrones cada uno\. ¿Cuál es el más pequeño\?$/))) {
    const l = [m[1], m[2], m[3]]; for (const k of l) assert.equal(IONES[k][1], +m[4]);
    return `El ${l.sort((x, y) => IONES[y][0] - IONES[x][0])[0]}`;
  }
  if ((m = q.match(/^¿A cuál le cuesta más perder un electrón: al (\S+) o al (\S+)\?$/))) return `Al ${T[simDe(m[1])].ei > T[simDe(m[2])].ei ? m[1] : m[2]}`;
  if (/sucesivas de un elemento X/.test(q)) {
    const e = q.match(/kJ\/mol: ([\d ,]+)\./)[1].split(', ').map(x => +x.replace(/ /g, '')), c = e.slice(1).map((x, k) => x / e[k]), k = c.indexOf(Math.max(...c)) + 1;
    return `Grupo ${k <= 2 ? k : k + 10} (`;
  }
  if ((m = q.match(/^¿Cuál libera más energía al ganar un electrón: un átomo de (\S+) o uno de (\S+)\?$/))) return `El de ${AE[simDe(m[1])] < AE[simDe(m[2])] ? m[1] : m[2]}`;
  if ((m = q.match(/^¿Qué ecuación representa la primera energía de ionización del (\S+)\?$/))) { const x = simDe(m[1]); return `${x}(g) → ${x}⁺(g) + e⁻`; }
  if ((m = q.match(/^En el enlace (\w+)–(\w+), ¿hacia qué átomo/))) return `Hacia el ${T[m[1]].en > T[m[2]].en ? m[1] : m[2]}`;
  if ((m = q.match(/^¿Cuánto vale ΔEN en el enlace (\w+)–(\w+)\?$/))) return Math.abs(T[m[1]].en - T[m[2]].en).toFixed(2).replace('.', ',');
  if ((m = q.match(/^Ordena de mayor a menor electronegatividad: (.+)\.$/))) return m[1].split(', ').map(simDe).sort((x, y) => T[y].en - T[x].en).join(' > ');
  if ((m = q.match(/^¿Cuál tiene mayor carácter metálico: el (\S+) o el (\S+)\?$/))) {
    const [x, y] = [T[simDe(m[1])], T[simDe(m[2])]];
    return `El ${(x.p === y.p ? x.g < y.g : x.p > y.p) ? m[1] : m[2]}`;
  }
  if (/^Indica verdadero/.test(q)) {
    const VERDAD = [[/Na⁺ es menor/, 'V'], [/Cl⁻ es menor/, 'F'], [/K⁺ es mayor/, 'F'], [/S²⁻ es mayor/, 'V'], [/Ca²⁺ y el Ar/, 'V'], [/Br⁻ es menor/, 'F'], [/catión tiene más protones/, 'V'],
      [/radio atómico baja/, 'V'], [/EI crece hacia abajo/, 'F'], [/flúor es el elemento más/, 'V'], [/potasio es menos metálico/, 'F'], [/electronegatividad crece hacia abajo/, 'F'],
      [/carácter metálico crece hacia abajo/, 'V'], [/cesio es más metálico/, 'V']];
    const partes = q.split(/\b(?:III|II|I)\. /).slice(1);
    assert.equal(partes.length, 3, q);
    return partes.map(t => VERDAD.find(([re]) => re.test(t))[1]).join('');
  }
  throw new Error(`caso sin oráculo: ${q}`);
}

test('Ahora tú: datos, cuatro opciones distintas, una correcta y la respuesta de una tabla escrita aparte (400 semillas)', () => {
  for (const i of def.ideas) {
    const preguntas = new Set();
    for (let s = 0; s < SEMILLAS; s++) {
      const a = i.ahoraTu.generar(s), q = plano(a.pregunta), bien = a.opciones.filter(o => o.correcta);
      preguntas.add(q);
      assert.ok(Array.isArray(a.datos) && a.datos.length >= 1, `${i.id} ${s}: datos`);
      assert.equal(a.opciones.length, 4, `${i.id} ${s}: ${q}`);
      assert.equal(new Set(a.opciones.map(o => o.texto)).size, 4, `${i.id} ${s}: opciones repetidas`);
      assert.equal(bien.length, 1);
      for (const o of a.opciones.filter(x => !x.correcta)) assert.ok(o.error && o.siFuera, `${i.id} ${s}: opción sin error o sin siFuera`);
      if (!/^Indica verdadero/.test(q)) assert.equal(new Set(a.opciones.map(o => o.error)).size, 4, `${i.id} ${s}: código repetido (${q})`);
      const e = esperado(a);
      assert.ok(bien[0].texto === e || bien[0].texto.startsWith(e), `${i.id} ${s}: ${q} → ${bien[0].texto} (esperado ${e})`);
      // Los datos no traen la respuesta escrita (regla datos-respuesta, en su forma literal).
      for (const d of a.datos) assert.ok(!plano(d).includes(`= ${bien[0].texto}`), `${i.id} ${s}: datos con la respuesta`);
    }
    assert.ok(preguntas.size >= 40, `${i.id}: ${preguntas.size} preguntas distintas`);
    for (let s = 0; s < 40; s++) assert.ok(!preguntas.has(plano(i.resuelve.generar(s).enunciado)), `${i.id}: resuelve ${s} repite una pregunta de Ahora tú`);
  }
});

test('Así se resuelve: la respuesta cuadra con las tablas escritas aparte', () => {
  for (let s = 0; s < 40; s++) {
    const r1 = I1.resuelve.generar(s), l1 = plano(r1.enunciado).match(/: (.+)\.$/)[1].split(', ').map(simDe);
    assert.equal(plano(r1.respuesta), l1.sort((x, y) => T[y].r - T[x].r).join(' > '));
    const r2 = I2.resuelve.generar(s), l2 = plano(r2.enunciado).match(/: (.+)\.$/)[1].split(', ');
    assert.equal(plano(r2.respuesta), l2.sort((x, y) => IONES[x][2] - IONES[y][2]).join(' < '));
    assert.equal(new Set(l2.map(k => IONES[k][1])).size, 1, 'una serie isoelectrónica');
    const r4 = I4.resuelve.generar(s), [x1, y1, x2, y2] = plano(r4.enunciado).match(/en (\w+)–(\w+) o en (\w+)–(\w+)/).slice(1);
    const d1 = Math.abs(T[x1].en - T[y1].en), d2 = Math.abs(T[x2].en - T[y2].en), [a, b] = d1 > d2 ? [x1, y1] : [x2, y2];
    assert.ok(plano(r4.respuesta).startsWith(`En ${a}–${b}, hacia el ${T[a].en > T[b].en ? a : b}`), plano(r4.respuesta));
  }
  const SUC = { Na: [496, 4562, 6910, 1], Al: [578, 1817, 2745, 11577, 13], Ca: [590, 1145, 4912, 2], Be: [900, 1757, 14849, 2], B: [801, 2427, 3660, 25026, 13] };
  for (let s = 0; s < 5; s++) {
    const r = I3.resuelve.generar(s), g = Object.entries(SUC).find(([, v]) => plano(r.enunciado).replace(/(\d) (\d{3})/g, '$1$2').includes(v.slice(0, -1).join(', ')));
    assert.ok(g, plano(r.enunciado));
    assert.ok(plano(r.respuesta).startsWith(`Grupo ${g[1][g[1].length - 1]} (`), plano(r.respuesta));
  }
});

test('los 60 ejemplos: 5 por nivel, datos, alternativas explicadas una por una y la letra correcta repartida (4 de cada)', () => {
  const letras = [];
  for (const i of def.ideas) {
    assert.equal(i.ejemplos.length, 15, i.id);
    for (const n of [1, 2, 3]) assert.equal(i.ejemplos.filter(e => e.nivel === n).length, 5, `${i.id}, nivel ${n}`);
    for (const e of i.ejemplos) {
      assert.ok(Array.isArray(e.datos) && e.datos.length >= 1, `${e.titulo}: datos`);
      assert.ok(e.solucion.length >= (e.nivel === 3 ? 2 : 1), `${e.titulo}: pasos`);
      if (e.nivel < 3) { assert.equal(e.alternativas, undefined, e.titulo); continue; }
      assert.equal(e.alternativas.length, 5, e.titulo);
      const m = JSON.stringify(e.respuesta).match(/^\[\{"negrita":\["([A-E])"\]\}/);
      assert.ok(m, `${e.titulo}: la respuesta empieza por su letra`);
      letras.push(m[1]);
      const nombradas = new Set([...JSON.stringify(e.solucion).matchAll(/"negrita":\["([A-E])"\]/g)].map(x => x[1]));
      for (const L of 'ABCDE') if (L !== m[1]) assert.ok(nombradas.has(L), `${e.titulo}: el resuelto no explica la ${L}`);
      assert.ok(!nombradas.has(m[1]), `${e.titulo}: el resuelto trata a la correcta como error`);
    }
  }
  assert.deepEqual(Object.fromEntries('ABCDE'.split('').map(L => [L, letras.filter(x => x === L).length])), { A: 4, B: 4, C: 4, D: 4, E: 4 });
  // Las alternativas de orden de los ejemplos de examen, rehechas con las tablas de arriba.
  const alt = (i, t) => { const e = def.ideas[i].ejemplos.find(x => x.titulo === t); return e.alternativas['ABCDE'.indexOf(JSON.stringify(e.respuesta).match(/"negrita":\["([A-E])"\]/)[1])]; };
  assert.equal(alt(0, 'Cuatro elementos para ordenar'), ['Mg', 'Na', 'K', 'Cl'].sort((x, y) => T[y].r - T[x].r).join(' > '));
  assert.equal(alt(1, 'La serie del argón'), ['S²⁻', 'Cl⁻', 'K⁺', 'Ca²⁺'].sort((x, y) => IONES[y][2] - IONES[x][2]).join(' > '));
  assert.equal(alt(1, 'El más pequeño de la lista'), ['Mg²⁺', 'Ca²⁺', 'S²⁻', 'K⁺', 'Cl⁻'].sort((x, y) => IONES[x][2] - IONES[y][2])[0]);
  assert.equal(alt(2, 'Energías sucesivas'), 'Silicio, grupo 14');
  assert.equal(alt(3, 'Verdadero o falso'), 'FVF');
});

// Encuadre de las figuras de quim-tira (las de quim-tabla las revisa su propia prueba): todo cabe con 4 de margen y
// ningún rótulo pisa a otro.
const solapan = (a, b, m = 0) => a.x0 < b.x1 - m && b.x0 < a.x1 - m && a.y0 < b.y1 - m && b.y0 < a.y1 - m;
test('las figuras de quim-tira caben con 4 de margen y sus rótulos no se pisan', () => {
  const P = Kit.piezas['quim-tira'], mal = [];
  let n = 0;
  for (const i of def.ideas) for (const f of figuras(i).filter(x => x.pieza === 'quim-tira')) {
    n++;
    const s = P.dibujar(f.datos, f.estado);
    assert.ok(!/NaN|undefined|Infinity|null/.test(s), f.donde);
    const g = P.geometria(f.datos, f.estado), { W, H, M } = g;
    for (const c of [...g.objetos, ...g.textos]) if (!(c.x0 >= M - 1e-9 && c.y0 >= M - 1e-9 && c.x1 <= W - M + 1e-9 && c.y1 <= H - M + 1e-9)) mal.push(`${f.donde}: se sale «${c.txt || c.que}»`);
    for (let a = 0; a < g.textos.length; a++) for (let b = a + 1; b < g.textos.length; b++) if (solapan(g.textos[a], g.textos[b], 0.5)) mal.push(`${f.donde}: se pisan «${g.textos[a].txt}» y «${g.textos[b].txt}»`);
    const esf = g.objetos.filter(o => /^esfera/.test(o.que));
    for (let a = 0; a < esf.length; a++) for (let b = a + 1; b < esf.length; b++) if (solapan(esf[a], esf[b])) mal.push(`${f.donde}: se pisan ${esf[a].que} y ${esf[b].que}`);
    // Fiel: el círculo de cada esfera es proporcional a su radio (salvo los «?», que van todos iguales).
    const max = f.datos.max || 220;
    for (const e of (f.datos.escenas ? [] : f.datos.esferas || []).filter(x => !x.oculto)) {
      const o = g.objetos.find(x => x.que === `esfera ${e.s}`);
      assert.ok(o && Math.abs(o.r - Math.max(4, 34 * e.r / max)) < 1e-9, `${f.donde}: ${e.s}`);
    }
    // Fiel: cada barra mide lo que su valor, desde 0 y a la misma escala (120 px el máximo), y no se pisan entre ellas.
    const bars = g.objetos.filter(o => /^barra/.test(o.que));
    for (const b of bars) if (b.v !== undefined && !(f.datos.barras.find(x => `barra ${x.s}` === b.que) || {}).oculto) assert.ok(Math.abs(b.h - Math.max(1, 120 * Math.min(1, b.v / f.datos.max))) < 1e-9, `${f.donde}: ${b.que}`);
    for (let a = 0; a < bars.length; a++) for (let b = a + 1; b < bars.length; b++) if (solapan(bars[a], bars[b])) mal.push(`${f.donde}: se pisan ${bars[a].que} y ${bars[b].que}`);
  }
  assert.ok(n > 80, `${n} figuras`);
  assert.deepEqual(mal.slice(0, 20), [], `${mal.length} problemas`);
});

// ---------- Auditoría y lector en frío (19 nov): cada prueba falla con la versión de antes ----------
const EI_NIST = { 3: 520, 4: 900, 9: 1681, 11: 496, 12: 738, 13: 578, 14: 787, 15: 1012, 16: 1000, 17: 1251, 19: 419, 20: 590, 31: 579, 32: 762, 35: 1140 };
const ZN = { litio: 3, berilio: 4, flúor: 9, sodio: 11, magnesio: 12, aluminio: 13, silicio: 14, fósforo: 15, azufre: 16, cloro: 17, potasio: 19, calcio: 20, galio: 31, germanio: 32, bromo: 35 };
test('auditoría: «Mira» de la idea 2 dibuja átomos e iones en cada paso, no la tira de tarjetas', () => {
  for (let corte = 0; corte <= I2.mira.pasos.length; corte++) {
    const s = Kit.piezas['quim-tira'].dibujar(I2.mira.datos, { corte });
    assert.ok(s.includes('kit-esfera'), `paso ${corte}: sin esferas`);
  }
});
test('auditoría: el par de isoelectrónicos tiene una sola respuesta (sin «el de mayor carga»); el V/F de iones trae los protones que usa', () => {
  for (let s = 0; s < SEMILLAS; s++) {
    const a = I2.ahoraTu.generar(s), q = plano(a.pregunta);
    assert.ok(!a.opciones.some(o => /mayor carga/.test(o.texto)), `${s}: ${q}`);
    if (/^Indica verdadero/.test(q)) {
      const d = a.datos.map(plano).join(' ');
      for (const [sim, nom] of [['S²⁻', 'azufre'], ['Br⁻', 'bromo'], ['Na⁺', 'sodio'], ['K⁺', 'potasio'], ['Cl⁻', 'cloro'], ['Ca²⁺', 'calcio']]) if (q.includes(sim)) assert.ok(d.includes(nom), `${s}: ${q} sin los protones del ${nom}`);
    }
    if (/electrones tiene el ion/.test(q)) for (const o of a.opciones.filter(x => x.error === 'QM-ION-UNO')) assert.ok(!/[⁺⁻]$/.test(q.match(/ion (\S+)\?/)[1].replace(/[²³]/, 'X')) || /[²³]/.test(q), `${s}: QM-ION-UNO con carga 1`);
  }
});
test('auditoría: el carácter metálico no contradice la EI de la unidad (sin Ca–Ga); sin «Grupo 18» por el salto', () => {
  for (let s = 0; s < SEMILLAS; s++) {
    const a = I4.ahoraTu.generar(s), q = plano(a.pregunta), m = q.match(/mayor carácter metálico: el (\S+) o el (\S+)\?/);
    if (m) { const mas = ZN[a.opciones.find(o => o.correcta).texto.replace('El ', '')], otro = [ZN[m[1]], ZN[m[2]]].find(z => z !== mas); assert.ok(EI_NIST[mas] < EI_NIST[otro], `${q}: EI ${EI_NIST[mas]} y ${EI_NIST[otro]}`); }
    const b = I3.ahoraTu.generar(s);
    for (const o of b.opciones.filter(x => x.error === 'QM-SALTO-ANTES')) assert.ok(!/18/.test(o.texto), `${s}: ${o.texto}`);
  }
});
test('lector: palabras llanas en la regla de la idea 3 y en los textos (sin «estrenar» ni «aparear el p»), y nada de «dos bajadas por periodo»', () => {
  const todo = JSON.stringify([def.ideas.map(i => [i.aprendizaje, i.lee, i.juega.consigna, i.juega.mision, i.mira.pasos, i.regla, i.ejemplos]), def.laboratorio.map(m => m.invitaciones.map(x => x.bien))]);
  assert.ok(!/estren|aparear/.test(todo), 'jerga');
  assert.ok(!/dos bajadas por periodo|de cada periodo/.test(todo), 'en los periodos 5 y 6 no hay dos bajadas');
  assert.ok(/−349 kJ\/mol/.test(plano(I3.regla.ecuacion)), 'la afinidad con un ejemplo y su signo');
  for (let s = 0; s < 60; s++) if (/dato decide/.test(I3.ahoraTu.voz)) assert.ok(/\d{3}/.test(I3.ahoraTu.generar(s).datos.join(' ')), 'la voz pide un dato que no está');
});
test('lector: el juego de la idea 1 se compara en fila, el radio calculado se explica, el «par» es de electrones y la regla de iones dice «del mismo elemento»', () => {
  assert.ok(!/el de arriba/.test(I1.juega.voz) && !/de arriba abajo/.test(plano(I1.lee.tarjetas.map(t => t.texto))));
  assert.ok(/nube de electrones/.test(plano(I1.lee.tarjetas.map(t => t.texto))) && /64 pm/.test(plano(I1.lee.tarjetas.map(t => t.texto))));
  assert.ok(/par de electrones/.test(plano(I4.juega.lectura({ a: '1', b: '17' }))) && I4.juega.leyenda.some(x => x.s === 'par'));
  assert.ok(/mismo elemento/.test(plano(I2.regla.ecuacion)));
  assert.ok(/carácter metálico/.test(plano(I4.regla.ecuacion)));
  assert.ok(!/jala|atrae|atracción/.test(def.glosario.find(g => g.termino === 'carga nuclear').simple), 'el glosario no da la razón de Predice');
});
test('lector: tarjetas de ejemplos (radio de X sin número, título del 10 e⁻, EI del periodo 3 sin barras ni valores, tendencias sin el Ca)', () => {
  const e = t => def.ideas.flatMap(i => i.ejemplos).find(x => x.titulo === t);
  assert.ok(!/194/.test(plano(e('Un elemento del grupo 2').solucion.map(p => p.ecuacion))));
  assert.ok(e('Tres cationes con 10 electrones'));
  assert.ok(!e('El periodo 3 entero').figura && !/1012/.test(plano(e('El periodo 3 entero').datos)));
  assert.ok(!/\bCa\b/.test(plano(e('Las cuatro tendencias del periodo 4').datos)) && /EN: K/.test(plano(e('Las cuatro tendencias del periodo 4').solucion[0].ecuacion)));
});
