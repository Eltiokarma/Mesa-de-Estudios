// Pruebas propias de «Tabla periódica» (además del validador común de contenido/teoria/teoria.test.js). Fase 2 del
// método (19 nov, etapa 5): la unidad está partida en dos y la idea 1 está rehecha contra el contrato.
//   - las cuatro ideas en el orden de la propuesta (docs/etapa5/propuesta-quimica.md §3), con sus id; las tres que se
//     fueron y las dos mesas están en quimica.propiedades-periodicas; entre las dos cubren los temas de antes;
//   - la idea 1 cumple sola el contrato de calidad 2 y estrena sus palabras (la unidad todavía no declara calidad: 2);
//   - colores de la idea 1 (def.colores): Z naranja, periodo turquesa, grupo carmín; sin verde ni violeta; ninguna letra
//     de alternativa lleva color;
//   - la misión no está cumplida al abrir y la cumple solo el corte en filas de 8, y con ese corte quedan en columna las
//     tres familias marcadas;
//   - nada antes de Predice nombra al rubidio ni dice que los de una columna se parecen;
//   - «Ahora tú»: datos, cuatro opciones distintas sin códigos repetidos (salvo el V/F) y respuesta que cuadra con una
//     tabla periódica escrita aparte, en 400 semillas; «Así se resuelve» pide periodo, grupo y familia juntos;
//   - los 15 ejemplos: 5 por nivel, datos, respuesta con color, figura sin la respuesta, alternativas con su letra, y
//     cada alternativa con número rehecha con la cuenta de su error (cuentas en scratchpad, e5-quimica/cuentas-idea1.py);
//   - una fecha por hecho: Mendeléiev 1869, galio 1875, germanio 1886, orden por número atómico 1913.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../../../nucleo/kit/kit.js');
const Teoria = require('../../../nucleo/teoria.js');
const Glosario = require('../../../nucleo/glosario.js');
const E = require('../../../nucleo/ecuacion.js');
const def = require('./tabla-periodica.js');
const props = require('./propiedades-periodicas.js');
for (const r of [...def.requiere, ...props.requiere]) require(path.join(__dirname, '..', '..', '..', r));
const I1 = def.ideas[0];
const SEMILLAS = 400;
const limpio = x => (Array.isArray(x) ? x.flatMap(y => (y === undefined || y === null ? [] : Array.isArray(y) ? [' ', ...limpio(y), ' '] : [y])) : x === undefined || x === null ? [] : [x]);
const plano = x => E.texto(limpio(x));
const fichas = x => (x === null || x === undefined || typeof x !== 'object' ? [] : Array.isArray(x) ? x.flatMap(fichas)
  : typeof x.v === 'string' && /^c-/.test(x.v) ? [x] : Object.values(x).flatMap(fichas));

// La tabla periódica, escrita aparte (no usa las funciones de la unidad): símbolo → [Z, periodo, grupo] de los grupos 1,
// 2 y 13 a 18.
const TABLA = {};
[['H', 1, 1, 1], ['He', 2, 1, 18],
  ['Li', 3, 2, 1], ['Be', 4, 2, 2], ['B', 5, 2, 13], ['C', 6, 2, 14], ['N', 7, 2, 15], ['O', 8, 2, 16], ['F', 9, 2, 17], ['Ne', 10, 2, 18],
  ['Na', 11, 3, 1], ['Mg', 12, 3, 2], ['Al', 13, 3, 13], ['Si', 14, 3, 14], ['P', 15, 3, 15], ['S', 16, 3, 16], ['Cl', 17, 3, 17], ['Ar', 18, 3, 18],
  ['K', 19, 4, 1], ['Ca', 20, 4, 2], ['Ga', 31, 4, 13], ['Ge', 32, 4, 14], ['As', 33, 4, 15], ['Se', 34, 4, 16], ['Br', 35, 4, 17], ['Kr', 36, 4, 18],
  ['Rb', 37, 5, 1], ['Sr', 38, 5, 2], ['In', 49, 5, 13], ['Sn', 50, 5, 14], ['Sb', 51, 5, 15], ['Te', 52, 5, 16], ['I', 53, 5, 17], ['Xe', 54, 5, 18],
  ['Cs', 55, 6, 1], ['Ba', 56, 6, 2], ['Tl', 81, 6, 13], ['Pb', 82, 6, 14], ['Bi', 83, 6, 15], ['Po', 84, 6, 16], ['At', 85, 6, 17], ['Rn', 86, 6, 18],
  ['Fr', 87, 7, 1], ['Ra', 88, 7, 2]].forEach(([s, z, p, g]) => { TABLA[z] = { s, p, g }; });
const INICIO = { 1: 1, 2: 3, 3: 11, 4: 19, 5: 37, 6: 55, 7: 87 };                    // primer Z de cada periodo
const periodo = z => Math.max(...Object.keys(INICIO).map(Number).filter(p => INICIO[p] <= z));
const debajo = z => { const a = TABLA[z]; const e = Object.entries(TABLA).find(([, b]) => b.g === a.g && b.p === a.p + 1); return e ? +e[0] : null; };
const FAMILIA = { 1: 'Alcalinos', 2: 'Alcalinotérreos', 16: 'Anfígenos', 17: 'Halógenos', 18: 'Gases nobles' };

test('las cuatro ideas en el orden de la propuesta; lo que se compara está en Propiedades periódicas', () => {
  assert.deepEqual(def.ideas.map(i => i.id), ['periodos-grupos-bloques', 'ubicacion-lewis', 'bloques-transicion', 'metales-no-metales']);
  assert.deepEqual(def.ideas.map(i => i.titulo), ['Ley periódica: periodos y grupos', 'Ubicación y notación de Lewis', 'Bloques y metales de transición', 'Metales, no metales y semimetales']);
  assert.deepEqual(props.ideas.map(i => i.id), ['radio-atomico-ionico', 'radio-ionico', 'energia-ionizacion', 'electronegatividad']);
  assert.deepEqual(props.laboratorio.map(m => m.id), ['tres-propiedades', 'dos-elementos']);
  assert.equal(def.laboratorio, undefined);
  assert.equal(def.calidad, 2, 'cerrada el 19 nov tras el lector en frío y el auditor');
  const cat = require('../../../catalogo/cursos/quimica.json').unidades;
  const temas = id => cat.find(u => u.id === id).temas;
  for (const d of [def, props]) {
    const p = Teoria.problemas(d, { temas: temas(d.unidad), semillas: 40 });
    assert.deepEqual(p, [], p.join('\n'));
  }
  assert.deepEqual([...temas(def.unidad), ...temas(props.unidad)].sort(), ['Electronegatividad', 'Energía de ionización y afinidad electrónica', 'Ley periódica', 'Metales, no metales y semimetales',
    'Notación de Lewis', 'Periodos, grupos y bloques', 'Radio atómico e iónico', 'Ubicación de un elemento'].sort(), 'los ocho temas de antes, repartidos');
  assert.deepEqual(cat.find(u => u.id === props.unidad).requiere, [def.unidad]);
  assert.deepEqual(cat.find(u => u.id === 'quimica.enlace-quimico').requiere, [props.unidad]);
  // Ninguna palabra se define dos veces entre las dos unidades.
  const a = new Set(def.glosario.map(g => g.termino));
  assert.deepEqual(props.glosario.map(g => g.termino).filter(t => a.has(t)), []);
});

test('idea 1: cumple sola el contrato de calidad 2 y estrena sus palabras', () => {
  const porIdea = Glosario.porIdea(def);
  assert.deepEqual(porIdea[0].filter(g => g.simple).map(g => g.termino), ['ley periódica', 'periodo', 'grupo', 'gas noble']);
  assert.deepEqual(porIdea[0].filter(g => !g.simple).map(g => g.termino).sort(), ['alcalinotérreo', 'anfígeno', 'halógeno', 'metal', 'metal alcalino', 'no metal']);
  const sub = Object.assign({}, def, { calidad: 2, ideas: [I1], glosario: porIdea[0] });
  const p = Teoria.problemas(sub, { semillas: 60 });
  assert.deepEqual(p, [], p.join('\n'));
  // La primera pantalla es el objeto: el globo, el letrero y el foco (quim-tira, dibujo de prueba).
  assert.equal(I1.lee.tarjetas[0].pieza, 'quim-tira');
  const s = Kit.piezas['quim-tira'].dibujar(I1.lee.tarjetas[0].dibujo.datos);
  for (const o of ['globo', 'letrero', 'foco']) assert.ok(s.includes(`data-objeto="${o}" data-prueba="si"`), o);
  // La idea 1 no usa la configuración electrónica ni los bloques (llegan en las ideas 2 y 3).
  for (const l of lecturas(I1)) assert.ok(!/configuraci|electrones de valencia|bloque|subnivel|[1-7][spdf][¹²³⁴⁵⁶⁷⁸⁹]/.test(plano(l.x)), `${l.donde}: ${plano(l.x)}`);
});

// Todo lo que se lee en la idea 1.
function lecturas(i) {
  const out = [], add = (donde, x) => out.push({ donde, x });
  const j = i.juega;
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
// Todas las figuras de la idea 1.
function figuras(i) {
  const out = [], con = (donde, f, pieza) => { if (f && f.datos) out.push({ donde, datos: f.datos, estado: f.estado || {}, pieza: f.pieza || pieza || i.pieza }); };
  for (const v of Teoria.grilla(i.juega.controles)) con(`juego ${JSON.stringify(v)}`, i.juega.dibujo(v), i.juega.pieza);
  for (const [k, t] of i.lee.tarjetas.entries()) con(`lee ${k + 1}`, t.dibujo, t.pieza);
  con('predice', i.predice.dibujo, i.predice.pieza); con('revelar', i.predice.revelar, i.predice.pieza);
  i.mira.pasos.forEach((p, k) => con(`mira ${k + 1}`, { datos: i.mira.datos, estado: p.estado }, i.mira.pieza));
  i.ejemplos.forEach((e, k) => con(`ejemplo ${k + 1}`, e.figura));
  if (i.regla.dibujo) con('regla', i.regla.dibujo, i.regla.dibujo.pieza || i.mira.pieza);
  for (let s = 0; s < 60; s++) {
    const r = i.resuelve.generar(s);
    con(`resuelve ${s}`, r.dibujo, i.resuelve.pieza);
    r.pasos.forEach((p, k) => con(`resuelve ${s} paso ${k + 1}`, p.dibujo, i.resuelve.pieza));
  }
  return out;
}

test('colores de la idea 1: Z naranja, periodo turquesa, grupo carmín; sin verde ni violeta; las letras A–E, sin color', () => {
  assert.deepEqual(def.colores, { z: 'o', periodo: 'i', grupo: 'h', valencia: 'f' });
  const usados = new Set();
  for (const l of lecturas(I1)) for (const f of fichas(l.x)) {
    assert.ok(f.m && def.colores[f.m], `${l.donde}: ficha sin magnitud (${f.t})`);
    assert.equal(f.v, `c-${def.colores[f.m]}`, `${l.donde}: ${f.t}`);
    assert.ok(!/^[A-E]$/.test(f.t), `${l.donde}: la letra ${f.t} lleva color`);
    usados.add(f.m);
  }
  assert.deepEqual([...usados].sort(), ['grupo', 'periodo', 'z']);
  for (const f of figuras(I1)) {
    const s = Kit.piezas[f.pieza].dibujar(f.datos, f.estado);
    assert.ok(!/var\(--c-d\)|var\(--c-f\)|var\(--el-/.test(s), `${f.donde}: verde, violeta o paleta de elementos`);
  }
  // La letra de una alternativa va con { negrita } en el resuelto y en la respuesta de los ejemplos de examen.
  for (const e of I1.ejemplos.filter(x => x.alternativas)) assert.ok(JSON.stringify(e.respuesta).includes('"negrita"'), e.titulo);
});

test('juego: la misión no está cumplida al abrir y la cumple solo el corte en filas de 8, que junta las tres familias', () => {
  const j = I1.juega, P = Kit.piezas['quim-tira'];
  assert.deepEqual(j.controles.map(c => c.id), ['k']);
  const inicio = { k: j.controles[0].inicio };
  assert.equal(j.mision.logrado(inicio), false);
  const logran = Teoria.grilla(j.controles).filter(v => j.mision.logrado(v));
  assert.deepEqual(logran, [{ k: 8 }]);
  for (const v of Teoria.grilla(j.controles)) {
    const g = P.geometria(j.dibujo(v).datos), cartas = Object.fromEntries(g.objetos.filter(o => o.Z).map(o => [o.Z, o]));
    assert.deepEqual(g.columnas.slice().sort(), v.k === 8 ? ['blando', 'inerte', 'sal'] : [], `k = ${v.k}`);
    assert.equal(cartas[3].col === cartas[11].col && cartas[11].col === cartas[19].col, v.k === 8, `Li, Na y K con k = ${v.k}`);
    // La lectura dice qué tarjeta queda de verdad bajo el litio.
    const bajo = g.objetos.find(o => o.Z && o.col === cartas[3].col && o.fila === cartas[3].fila + 1);
    assert.equal(bajo.Z, 3 + v.k);
    const lec = plano(j.lectura(v));
    assert.ok(lec.startsWith(`Filas de ${v.k}:`), lec);
    if (v.k !== 8) assert.ok(lec.includes(`queda el ${{ 8: 'oxígeno', 9: 'flúor', 10: 'neón', 12: 'magnesio', 13: 'aluminio' }[bajo.Z]}`), lec);
  }
  // La leyenda nombra cada marca de las tarjetas.
  const ley = plano(j.leyenda.map(x => x.s));
  for (const m of ['▲', '●', '■', 'Z']) assert.ok(ley.includes(m), m);
});

test('nada antes de Predice nombra al rubidio ni dice que los de una columna se parecen', () => {
  const DELATA = /rubidio|\bRb\b|\b37\b|misma columna|se parecen|parecid/i;
  const porIdea = Glosario.porIdea(def);
  const antes = [I1.titulo, I1.pregunta, I1.actividad, I1.juega.consigna, I1.juega.mision.texto,
    ...I1.lee.tarjetas.map(t => `${t.titulo} ${plano(t.texto)}`), ...I1.juega.leyenda.map(x => plano(x.t)),
    ...porIdea[0].flatMap(g => [g.simple || '', g.def, ...(g.ejemplos || [])])];
  for (const t of antes) assert.ok(!DELATA.test(t), `delata: «${t}»`);
  // El juego llega solo hasta el calcio: la fila de 18 y el rubidio no se ven antes de predecir.
  for (const v of Teoria.grilla(I1.juega.controles)) {
    assert.ok(!DELATA.test(plano(I1.juega.lectura(v))));
    assert.ok(Kit.piezas['quim-tira'].geometria(I1.juega.dibujo(v).datos).objetos.every(o => !o.Z || o.Z <= 20));
  }
  // La figura de Predice lleva «?» en la tarjeta 37, sin su marca; al revelar aparece con la marca del potasio.
  const P = Kit.piezas['quim-tira'], d = I1.predice.dibujo.datos, r = I1.predice.revelar.datos;
  assert.deepEqual(d.ocultos, [37]);
  const g37 = P.geometria(d), c37 = g37.objetos.find(o => o.Z === 37);
  assert.ok(c37 && !g37.objetos.some(o => /^marca/.test(o.que) && o.x0 >= c37.x0 && o.x1 <= c37.x1 && o.y0 >= c37.y0 && o.y1 <= c37.y1), 'la marca del rubidio no se ve antes');
  assert.ok(g37.textos.some(t => t.txt === '?') && !g37.textos.some(t => t.txt === 'Rb'));
  assert.equal(r.marcas[37], r.marcas[19]);
  assert.ok(!(r.ocultos || []).includes(37));
  // Los datos de Predice son valores, y los tres elementos que nombran las opciones.
  assert.equal(I1.predice.opciones.length, 4);
  assert.equal(new Set(I1.predice.opciones.map(o => o.error)).size, 4, 'ningún código repetido');
});

// Respuesta esperada de un caso de «Ahora tú», con la tabla escrita arriba (no con el código de la unidad).
function esperado(a) {
  const q = plano(a.pregunta);
  let m;
  if ((m = q.match(/^¿A qué familia pertenece el elemento de Z = (\d+)\?$/))) return FAMILIA[TABLA[+m[1]].g];
  if ((m = q.match(/justo debajo del .+ \(Z = (\d+)\)/))) return String(debajo(+m[1]));
  if ((m = q.match(/^¿En qué periodo está el elemento de Z = (\d+)\?$/))) return `Periodo ${periodo(+m[1])}`;
  if ((m = q.match(/^¿Cuántos elementos tiene el periodo (\d)/))) return String(INICIO[+m[1] + 1] - INICIO[+m[1]]);
  if (/misma familia/.test(q)) {
    const bien = a.opciones.filter(o => { const [x, y] = o.texto.match(/\d+/g).map(Number); return TABLA[x] && TABLA[y] && TABLA[x].g === TABLA[y].g; });
    assert.equal(bien.length, 1, `un solo par de la misma familia: ${a.opciones.map(o => o.texto).join(' | ')}`);
    return bien[0].texto;
  }
  if (/^Indica verdadero/.test(q)) {
    const VERDAD = [[/por número atómico/, 'V'], [/por masa atómica/, 'F'], [/mismo grupo tienen/, 'V'], [/mismo periodo tienen/, 'F'], [/7 periodos y 18 grupos/, 'V'], [/misma cantidad/, 'F'],
      [/termina en un gas noble/, 'V'], [/empieza en un gas noble/, 'F'], [/halógenos están en el grupo 17/, 'V'], [/gases nobles están en el grupo 17/, 'F']];
    const partes = q.split(/\b(?:III|II|I)\. /).slice(1);
    assert.equal(partes.length, 3, q);
    return partes.map(t => VERDAD.find(([re]) => re.test(t))[1]).join('');
  }
  throw new Error(`caso sin oráculo: ${q}`);
}

test('Ahora tú: datos, cuatro opciones distintas y respuesta que cuadra con una tabla escrita aparte (400 semillas)', () => {
  const tipos = new Set(), preguntas = new Set();
  for (let s = 0; s < SEMILLAS; s++) {
    const a = I1.ahoraTu.generar(s), q = plano(a.pregunta);
    preguntas.add(q); tipos.add(s % 6);
    assert.ok(Array.isArray(a.datos) && a.datos.length >= 2, `semilla ${s}: datos`);
    assert.equal(a.opciones.length, 4, `semilla ${s}: ${q}`);
    assert.equal(new Set(a.opciones.map(o => o.texto)).size, 4, `semilla ${s}: opciones repetidas`);
    const bien = a.opciones.filter(o => o.correcta);
    assert.equal(bien.length, 1);
    assert.equal(bien[0].texto, esperado(a), `semilla ${s}: ${q}`);
    for (const o of a.opciones.filter(x => !x.correcta)) assert.ok(o.error && o.siFuera, `semilla ${s}: opción sin error o sin siFuera`);
    if (!/^Indica verdadero/.test(q)) assert.equal(new Set(a.opciones.map(o => o.error)).size, 4, `semilla ${s}: código repetido (${q})`);
    // Los datos no traen la respuesta.
    assert.ok(!a.datos.some(d => plano(d) === bien[0].texto));
  }
  assert.equal(tipos.size, 6);
  assert.ok(preguntas.size >= 60, `${preguntas.size} preguntas distintas`);
});

test('Así se resuelve: periodo, grupo y familia juntos (Ahora tú nunca los pide juntos), con cuentas que cuadran', () => {
  const enunciados = new Set(), ahora = new Set(Array.from({ length: SEMILLAS }, (_, s) => plano(I1.ahoraTu.generar(s).pregunta)));
  for (let s = 0; s < 60; s++) {
    const r = I1.resuelve.generar(s), q = plano(r.enunciado), z = +q.match(/Z = (\d+)/)[1], t = TABLA[z];
    enunciados.add(q);
    assert.ok(!ahora.has(q), 'no repite una pregunta de Ahora tú');
    assert.deepEqual(r.pasos.map(p => p.tipo), ['pide', 'datos', 'regla', 'cuentas', 'sentido']);
    const resp = plano(r.respuesta);
    assert.ok(resp.startsWith(`Periodo ${t.p}, grupo ${t.g} (`), `${q} → ${resp}`);
    assert.ok(resp.toLowerCase().includes(FAMILIA[t.g].toLowerCase().replace(/s$/, '').replace(/e$/, '').slice(0, 6)), resp);
    // «Justo encima» (o «justo debajo», si no hay nadie arriba) nombra al elemento que de verdad está ahí en su columna.
    const up = Object.entries(TABLA).find(([x]) => debajo(+x) === z), sentido = plano(r.pasos[4].texto), NOM = { 3: 'litio', 4: 'berilio', 8: 'oxígeno', 9: 'flúor', 11: 'sodio', 12: 'magnesio',
      16: 'azufre', 17: 'cloro', 19: 'potasio', 20: 'calcio', 34: 'selenio', 35: 'bromo', 37: 'rubidio', 38: 'estroncio', 52: 'telurio', 53: 'yodo', 55: 'cesio', 56: 'bario', 84: 'polonio', 85: 'astato' };
    if (up) assert.ok(sentido.includes(`justo encima, está el ${NOM[+up[0]]}.`), sentido);
    else assert.ok(sentido.includes(`justo debajo, está el ${NOM[debajo(z)]}.`), sentido);
    // El dibujo del planteamiento no marca nada; el de las cuentas marca la casilla.
    assert.ok(!r.dibujo.datos.resaltar && !r.dibujo.datos.fila);
    assert.deepEqual(r.pasos[3].dibujo.datos.resaltar, [{ Z: z }]);
    assert.equal(r.pasos[3].dibujo.datos.fila.periodo, t.p); assert.equal(r.pasos[3].dibujo.datos.columna.grupo, t.g);
  }
  assert.ok(enunciados.size >= 8);
});

// Cada alternativa con número de los ejemplos de examen: la cuenta del error que le pone su resuelto (escrita aquí).
const DISTRACTORES = {
  'El anfígeno del periodo 5': { correcta: 'E', valores: { A: 36 - 2, B: 54 + 2, C: 36 + 2, D: 54 + 16, E: 54 - 2 } },
};
test('los 15 ejemplos: 5 por nivel, datos, respuesta con color, figura sin la respuesta y alternativas con su letra', () => {
  const ej = I1.ejemplos;
  assert.equal(ej.length, 15);
  for (const n of [1, 2, 3]) assert.equal(ej.filter(e => e.nivel === n).length, 5);
  const letras = [];
  for (const e of ej) {
    assert.ok(Array.isArray(e.datos) && e.datos.length >= 1, `${e.titulo}: datos`);
    assert.ok(fichas(e.respuesta).length >= 1 || JSON.stringify(e.respuesta).includes('"negrita"'), `${e.titulo}: la respuesta lleva el color de su magnitud`);
    assert.ok(e.solucion.length >= (e.nivel === 1 ? 1 : 2), `${e.titulo}: pasos`);
    if (e.nivel === 3) {
      assert.equal(e.alternativas.length, 5, e.titulo);
      const m = JSON.stringify(e.respuesta).match(/"negrita":\["([A-E])"\]/);
      assert.ok(m, `${e.titulo}: la respuesta empieza por su letra`);
      letras.push(m[1]);
      // El resuelto nombra cada alternativa incorrecta.
      const nombradas = new Set([...JSON.stringify(e.solucion).matchAll(/"negrita":\["([A-E])"\]/g)].map(x => x[1]));
      for (const L of 'ABCDE') if (L !== m[1]) assert.ok(nombradas.has(L), `${e.titulo}: el resuelto no explica la ${L}`);
      const D = DISTRACTORES[e.titulo];
      if (e.alternativas.every(a => /^\d+$/.test(a))) {
        assert.ok(D, `${e.titulo}: falta su tabla de distractores`);
        assert.equal(D.correcta, m[1]);
        'ABCDE'.split('').forEach((L, k) => assert.equal(String(D.valores[L]), e.alternativas[k], `${e.titulo}, ${L}`));
      }
    } else assert.equal(e.alternativas, undefined);
    // La figura no trae la respuesta: si se pide un número atómico, su tarjeta va con «?», sin número, símbolo ni marca
    // (los tres ejemplos con figura que piden un Z lo declaran en `incognitas`).
    if (e.figura) {
      const s = Kit.piezas[e.figura.pieza].dibujar(e.figura.datos, e.figura.estado), resp = plano(e.respuesta).match(/Z = (\d+)/);
      assert.equal(e.figura.datos.ocultos, undefined, `${e.titulo}: en un ejemplo, lo que se pide va en incognitas`);
      if (resp) {
        assert.deepEqual(e.figura.datos.incognitas, [+resp[1]], `${e.titulo}: la tarjeta de la respuesta va con «?»`);
        // (el número de una tarjeta va en naranja; el «17» del encabezado de la columna de los halógenos no es una tarjeta)
        assert.ok(!new RegExp(`fill="var\\(--c-o\\)"[^>]*>${resp[1]}<`).test(s) && !s.includes(`>${def.ideas[0].predice.dibujo.datos.simbolos[+resp[1]]}<`), `${e.titulo}: la figura muestra la respuesta`);
        assert.ok(s.includes('>?<'));
      }
    }
  }
  assert.equal(new Set(letras).size, 5, `las cinco respuestas de examen caen en letras distintas: ${letras.join('')}`);
  // Respuestas rehechas con la tabla escrita arriba.
  const R = t => plano(ej.find(e => e.titulo === t).respuesta);
  assert.ok(R('El que sigue al neón').includes('Z = 11') && TABLA[11].p === 3 && TABLA[11].g === 1);
  assert.ok(R('Los elementos del periodo 3').startsWith(`${INICIO[4] - INICIO[3]} elementos`));
  assert.ok(R('La familia del cloro').startsWith(FAMILIA[TABLA[17].g]));
  assert.equal(R('El periodo del potasio'), `Periodo ${TABLA[19].p}`);
  assert.ok(R('El halógeno del periodo 3').includes(`Z = ${Object.keys(TABLA).find(z => TABLA[z].p === 3 && TABLA[z].g === 17)}`));
  assert.equal(R('Dónde está el calcio'), `Periodo ${TABLA[20].p}, grupo ${TABLA[20].g} (IIA)`);
  assert.ok([4, 12, 20].every(z => TABLA[z].g === 2) && R('¿Son de la misma familia?').startsWith('Sí'));
  assert.ok(R('Hasta el xenón').endsWith(`Z = ${INICIO[6] - 1}`) && TABLA[INICIO[6] - 1].s === 'Xe');
  assert.ok(R('El hueco bajo el aluminio').includes(`Z = ${debajo(13)}`) && TABLA[debajo(13)].s === 'Ga');
  const pares = ej.find(e => e.titulo === 'El par de la misma familia').alternativas.map(a => a.match(/\d+/g).map(Number));
  assert.deepEqual(pares.map(([x, y]) => !!(TABLA[x] && TABLA[y] && TABLA[x].g === TABLA[y].g)), [false, true, false, false, false]);
  assert.equal(debajo(19), 37); assert.equal(debajo(12), 20);
  assert.ok(R('Tres vecinos').startsWith('C') && TABLA[35].g === 17 && TABLA[36].g === 18 && TABLA[37].g === 1 && TABLA[37].p === 5);
  assert.ok(R('El anfígeno del periodo 5').includes('Z = 52') && TABLA[52].p === 5 && TABLA[52].g === 16);
});

test('una fecha por hecho: Mendeléiev 1869, galio 1875, germanio 1886, orden por número atómico 1913', () => {
  const todo = [def.historia.texto, ...lecturas(I1).map(l => plano(l.x)), ...def.glosario.flatMap(g => [g.def, ...(g.ejemplos || [])])].join(' \n ');
  const HECHOS = [[/Mendeléiev/, 1869], [/galio[^.]{0,40}\b(18\d\d)\b/, 1875], [/germanio[^.]{0,40}\b(18\d\d)\b/, 1886]];
  for (const m of todo.matchAll(/Mendeléiev[^.\n]{0,40}?\b(1[89]\d\d)\b|\b(1[89]\d\d)\b[^.\n]{0,12}Mendeléiev/g)) assert.equal(+(m[1] || m[2]), 1869, m[0]);
  for (const m of todo.matchAll(/galio: (\d{4})/g)) assert.equal(+m[1], 1875);
  for (const m of todo.matchAll(/germanio: (\d{4})/g)) assert.equal(+m[1], 1886);
  for (const m of todo.matchAll(/[Dd]esde (\d{4})/g)) assert.equal(+m[1], 1913, m[0]);
  assert.ok(HECHOS.length === 3 && /1869/.test(todo) && /1913/.test(todo));
});

// ---------- Fase 3 (19 nov): las ideas 2, 3 y 4 ----------
// Cuentas rehechas aparte en scratchpad, e5-quimica/cuentas-a.py (configuraciones por el orden de llenado escrito allí,
// periodo y grupo por una tabla escrita a mano, clases de metal por listas de símbolos): 3168 comprobaciones, 0 diferencias.
const [, I2, I3, I4] = def.ideas;
// Los grupos 3 a 12 (periodos 4 y 5, más el oro y el mercurio), escritos aparte: Z → [periodo, grupo].
const TRANSICION = {};
for (let k = 0; k < 10; k++) { TRANSICION[21 + k] = [4, 3 + k]; TRANSICION[39 + k] = [5, 3 + k]; }
TRANSICION[79] = [6, 11]; TRANSICION[80] = [6, 12];
const lugarDe = z => (TABLA[z] ? [TABLA[z].p, TABLA[z].g] : TRANSICION[z]);

test('calidad 2 simulada: la unidad entera pasaría el validador con las reglas nuevas (no se declara todavía)', () => {
  const cat = require('../../../catalogo/cursos/quimica.json').unidades.find(u => u.id === def.unidad);
  const p = Teoria.problemas(Object.assign({}, def, { calidad: 2 }), { temas: cat.temas, semillas: 60 });
  assert.deepEqual(p, [], p.join('\n'));
  assert.deepEqual(Glosario.porIdea(def).map(l => l.filter(g => g.simple).map(g => g.termino)), [
    ['ley periódica', 'periodo', 'grupo', 'gas noble'],
    ['electrones de valencia', 'símbolo de Lewis', 'elemento representativo'],
    ['bloque', 'metal de transición', 'transición interna'],
    ['semimetal', 'carácter metálico', 'maleable'],
  ]);
  assert.deepEqual(def.requiere, ['/nucleo/kit/piezas/quim-tira.js', '/nucleo/kit/piezas/quim-molecula.js']);
});

test('ideas 2 a 4: la primera pantalla es un objeto, y la misión la cumple un solo caso, no al abrir', () => {
  const P = Kit.piezas['quim-tira'];
  for (const [i, objetos, logran] of [[I2, ['sal'], [{ z: 16 }]], [I3, ['clavo', 'cable', 'anillo'], [{ z: 28 }]], [I4, ['probador'], [{ m: 'grafito' }]]]) {
    const t = i.lee.tarjetas[0], s = P.dibujar(t.dibujo.datos);
    assert.equal(t.pieza, 'quim-tira');
    for (const o of objetos) assert.ok(s.includes(`data-objeto="${o}" data-prueba="si"`), `${i.id}: ${o}`);
    const j = i.juega, inicio = Object.fromEntries(j.controles.map(c => [c.id, c.inicio !== undefined ? c.inicio : c.opciones[0].valor]));
    assert.equal(j.mision.logrado(inicio), false, i.id);
    assert.deepEqual(Teoria.grilla(j.controles).filter(v => j.mision.logrado(v)), logran, i.id);
    // Lo que se predice no se ve en el juego: el yodo (53), la plata (47) y el silicio (14).
    const reservado = { 'ubicacion-lewis': 53, 'bloques-transicion': 47, 'metales-no-metales': 14 }[i.id];
    for (const v of Teoria.grilla(j.controles)) assert.ok(!(j.dibujo(v).datos.resaltar || []).some(r => r.Z === reservado), `${i.id}: el juego muestra Z = ${reservado}`);
    assert.equal(new Set(i.predice.opciones.map(o => o.error)).size, 4, `${i.id}: un código por distractor en Predice`);
  }
  // No se afirma de qué metal es ninguna moneda (no hay fuente): la palabra no aparece en la unidad.
  assert.ok(!/moneda|alpaca/i.test(JSON.stringify(def.ideas.map(i => [i.lee, i.juega.consigna, i.predice.pregunta, i.mira.pasos, i.regla, i.ejemplos]))));
});

test('ideas 2 a 4, Ahora tú: datos, cuatro opciones distintas, una correcta y el lugar que da una tabla escrita aparte (400 semillas)', () => {
  for (const i of [I2, I3, I4]) {
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
      const m = /¿En qué periodo y en qué grupo/.test(q) && q.match(/Z = (\d+)/);
      if (m) { const [p, g] = lugarDe(+m[1]); assert.ok(bien[0].texto.startsWith(`Periodo ${p}, grupo ${g} (`), `${i.id} ${s}: ${q} → ${bien[0].texto}`); }
      const zz = q.match(/periodo (\d) y en el grupo (\d+ )?\(?(\w+)\)?.* ¿Cuál es su número atómico/);
      if (zz) { const [p, g] = lugarDe(+bien[0].texto); assert.equal(p, +zz[1], `${i.id} ${s}: ${q}`); if (zz[2]) assert.equal(g, +zz[2]); }
    }
    assert.ok(preguntas.size >= 40, `${i.id}: ${preguntas.size} preguntas distintas`);
    // «Así se resuelve» no repite ninguna pregunta de «Ahora tú».
    for (let s = 0; s < 40; s++) assert.ok(!preguntas.has(plano(i.resuelve.generar(s).enunciado)), `${i.id}: resuelve ${s}`);
  }
});

test('los 60 ejemplos: 5 por nivel, datos, alternativas explicadas una por una y la letra correcta repartida (4 veces cada una)', () => {
  const letras = [];
  for (const i of def.ideas) {
    assert.equal(i.ejemplos.length, 15, i.id);
    for (const n of [1, 2, 3]) assert.equal(i.ejemplos.filter(e => e.nivel === n).length, 5, `${i.id}, nivel ${n}`);
    for (const e of i.ejemplos) {
      assert.ok(Array.isArray(e.datos) && e.datos.length >= 1, `${e.titulo}: datos`);
      assert.ok(e.solucion.length >= (e.nivel === 1 ? 1 : 2), `${e.titulo}: pasos`);
      if (e.nivel < 3) { assert.equal(e.alternativas, undefined, e.titulo); continue; }
      assert.equal(e.alternativas.length, 5, e.titulo);
      const m = JSON.stringify(e.respuesta).match(/^\[\{"negrita":\["([A-E])"\]\}/);
      assert.ok(m, `${e.titulo}: la respuesta empieza por su letra`);
      letras.push(m[1]);
      const nombradas = new Set([...JSON.stringify(e.solucion).matchAll(/"negrita":\["([A-E])"\]/g)].map(x => x[1]));
      for (const L of 'ABCDE') if (L !== m[1]) assert.ok(nombradas.has(L), `${e.titulo}: el resuelto no explica la ${L}`);
      // Si las alternativas son lugares de la tabla, la correcta es la de la tabla escrita aparte.
      const z = plano(e.enunciado).match(/Z = (\d+)/);
      if (z && lugarDe(+z[1]) && e.alternativas.every(a => /^Periodo \d, grupo/.test(a))) { const [p, g] = lugarDe(+z[1]); assert.ok(e.alternativas['ABCDE'.indexOf(m[1])].startsWith(`Periodo ${p}, grupo ${g} (`), e.titulo); }
    }
  }
  assert.deepEqual(Object.fromEntries('ABCDE'.split('').map(L => [L, letras.filter(x => x === L).length])), { A: 4, B: 4, C: 4, D: 4, E: 4 });
});

test('colores en toda la unidad: Z naranja, periodo turquesa, grupo carmín, electrones violeta; sin verde', () => {
  const P = Kit.piezas, usados = new Set();
  for (const i of def.ideas) {
    for (const l of lecturas(i)) for (const f of fichas(l.x)) {
      assert.ok(f.m && def.colores[f.m], `${i.id}, ${l.donde}: ficha sin magnitud (${f.t})`);
      assert.equal(f.v, `c-${def.colores[f.m]}`, `${i.id}, ${l.donde}: ${f.t}`);
      assert.ok(!/^[A-E]$/.test(f.t), `${i.id}, ${l.donde}: la letra ${f.t} lleva color`);
      usados.add(f.m);
    }
    for (const f of figuras(i)) assert.ok(!/var\(--c-d\)|var\(--el-/.test(P[f.pieza].dibujar(f.datos, f.estado)), `${i.id}, ${f.donde}: verde o paleta de elementos`);
  }
  assert.deepEqual([...usados].sort(), ['grupo', 'periodo', 'valencia', 'z']);
});

// ---------- Auditoría y lector en frío (19 nov): cada prueba falla con la versión de antes ----------
// EI del NIST (kJ/mol), escritas aquí aparte, para los tríos de carácter metálico («qué tan fácil pierde electrones»).
const EI_NIST = { 3: 520, 4: 900, 6: 1086, 7: 1402, 9: 1681, 11: 496, 12: 738, 13: 578, 14: 787, 15: 1012, 16: 1000, 17: 1251, 19: 419, 20: 590, 31: 579, 32: 762, 33: 944, 34: 941,
  35: 1140, 37: 403, 38: 550, 49: 558, 50: 709, 51: 834, 53: 1008, 55: 376, 56: 503, 81: 589 };
const SUPS = '⁰¹²³⁴⁵⁶⁷⁸⁹', exp = t => +[...t].map(c => SUPS.indexOf(c)).join('');
test('auditoría: «Así se resuelve» nunca usa un elemento que «Ahora tú» pregunta (ideas 1 a 3)', () => {
  for (const i of def.ideas.slice(0, 3)) {
    const zs = new Set();
    for (let s = 0; s < SEMILLAS; s++) { const q = plano(i.ahoraTu.generar(s).pregunta), m = q.match(/Z = (\d+)/); if (m) zs.add(+m[1]);
      const t = q.match(/termina en (\d[spdf]\S+ \d[spdf]\S+)\./); if (t) zs.add(-1); }
    for (let s = 0; s < 200; s++) { const z = +plano(i.resuelve.generar(s).enunciado).match(/Z = (\d+)/)[1]; assert.ok(!zs.has(z), `${i.id}: resuelve ${s} usa Z = ${z}, que sale en Ahora tú`); }
  }
});
test('auditoría: los siFuera de la idea 2 dicen la cuenta de su opción (QM-D-VALENCIA, QM-SOLO-P, QM-LEWIS-NIVEL)', () => {
  for (let s = 0; s < SEMILLAS; s++) {
    const a = I2.ahoraTu.generar(s), q = plano(a.pregunta);
    for (const o of a.opciones.filter(x => x.error === 'QM-D-VALENCIA')) {
      const d = o.texto.match(/\dd(\S+)$/), n = o.siFuera.match(/Tiene (\d+) electrones d/);
      assert.ok(d && n && exp(d[1]) === +n[1], `${s}: «${o.siFuera}» para ${o.texto}`);
      assert.ok(!/después del gas noble/.test(o.siFuera), o.siFuera);
    }
    const lug = q.match(/periodo (\d) y en el grupo (\w+) de la tabla/);
    if (lug) { const z = +a.opciones.find(o => o.correcta).texto, o = a.opciones.find(x => x.error === 'QM-SOLO-P'); if (o) assert.equal(+o.texto, z + 2, `${s}: el que pone ${lug[2]} electrones en el p llega a ${z + 2}`); }
    const t = q.match(/termina en (.+)\. ¿Cuántos puntos/);
    if (t) { const nivel = Math.max(...t[1].split(' ').map(x => +x[0])), o = a.opciones.find(x => x.error === 'QM-LEWIS-NIVEL'); if (o) assert.equal(+o.texto, nivel, `${s}: «${o.siFuera}» con ${o.texto}`); }
  }
});
test('lector: Predice de la idea 2 separa al que suma los 4d¹⁰ (otro número que la correcta)', () => {
  const c = I2.predice.opciones.find(o => o.correcta), d = I2.predice.opciones.find(o => o.error === 'QM-D-VALENCIA');
  assert.ok(/7 electrones de valencia/.test(c.texto) && d && /17/.test(d.texto) && !/17/.test(c.texto));
});
test('lector: el Cr, el Cu, la Ag y el Au se dicen excepción donde se usa su configuración real', () => {
  const textos = [];
  for (const i of [I3]) {
    textos.push(plano(i.predice.pregunta), ...i.ejemplos.map(e => plano([e.enunciado])));
    for (let s = 0; s < SEMILLAS; s++) textos.push(plano(i.ahoraTu.generar(s).pregunta));
    for (let s = 0; s < 40; s++) { const r = i.resuelve.generar(s); textos.push(plano([r.enunciado, ...r.pasos.map(p => p.texto)])); }
  }
  for (const t of textos.filter(x => /[456]s¹ (4f¹⁴ )?[345]d(⁵|¹⁰)/.test(x) && !/^Indica/.test(x))) assert.ok(/excepci/.test(t), t);
  assert.ok(/excepci/.test(plano(I3.regla.condicion)));
});
test('lector: la regla de la idea 3 nombra y ubica los cuatro bloques; las figuras de los ejemplos de la idea 1 van sin marcas', () => {
  const r = plano([I3.regla.texto, I3.regla.ecuacion]);
  for (const x of ['bloque s: columnas 1 y 2', 'p: 13 a 18', 'd: 3 a 12', 'f: las dos filas de abajo']) assert.ok(r.includes(x), x);
  for (const e of I1.ejemplos.filter(x => x.figura)) assert.deepEqual(e.figura.datos.marcas, {}, e.titulo);
  assert.ok(/118/.test(plano(I1.regla.ecuacion)), 'la lista de gases nobles llega al oganesón');
});
test('auditoría: los datos de los verdadero o falso no dicen la afirmación (ideas 1, 3 y 4)', () => {
  const prohibidas = /Desde 1913|Elementos por periodo|Familias:|Grupos B: 3 a 7|Transición interna:|Semimetales|Carácter metálico: crece|mercurio/;
  for (const i of [I1, I3, I4]) {
    for (let s = 0; s < SEMILLAS; s++) { const a = i.ahoraTu.generar(s); if (/^Indica verdadero/.test(plano(a.pregunta))) for (const d of a.datos) assert.ok(!prohibidas.test(plano(d)), `${i.id} ${s}: ${plano(d)}`); }
    for (const e of i.ejemplos.filter(x => /^Indica verdadero/.test(x.enunciado))) for (const d of e.datos) assert.ok(!prohibidas.test(plano(d)), `${e.titulo}: ${plano(d)}`);
  }
});
test('auditoría: los tríos de carácter metálico siguen la EI del NIST (sin Al–Ga ni As–Se)', () => {
  for (let s = 0; s < SEMILLAS; s++) {
    const a = I4.ahoraTu.generar(s), q = plano(a.pregunta);
    if (!/mayor carácter metálico/.test(q)) continue;
    const zs = [...q.matchAll(/(\S+) \(periodo (\d), grupo (\d+)\)/g)].map(m => Object.keys(TABLA).find(z => TABLA[z].p === +m[2] && TABLA[z].g === +m[3]));
    const ei = zs.map(z => EI_NIST[z]).sort((x, y) => x - y), mas = a.opciones.find(o => o.correcta).texto;
    assert.ok(ei.every(Boolean), q);
    const zMas = zs.find(z => EI_NIST[z] === ei[0]);
    assert.ok(mas.endsWith(plano([q.match(new RegExp(`(\\S+) \\(periodo ${TABLA[zMas].p}, grupo ${TABLA[zMas].g}\\)`))[1]])), `${q} → ${mas}`);
    const menos = zs.find(z => EI_NIST[z] === ei[2]), inv = a.opciones.find(o => o.error === 'QM-CARACTER-INVERTIDO');
    assert.ok(inv.texto.endsWith(q.match(new RegExp(`(\\S+) \\(periodo ${TABLA[menos].p}, grupo ${TABLA[menos].g}\\)`))[1]), `${q}: el «menos metálico» no es el de mayor EI`);
  }
});
test('lector: los ejemplos del germanio y de los tres del periodo 3 no traen la lista de semimetales; el 14 dice cómo es un semimetal', () => {
  const t = x => I4.ejemplos.find(e => e.titulo === x);
  for (const x of ['El germanio', 'Tres del periodo 3']) assert.ok(!t(x).datos.some(d => /Si, Ge/.test(plano(d))), x);
  assert.ok(t('Un elemento del periodo 3').datos.some(d => /^Semimetal: brilla, pero conduce poco/.test(plano(d))));
  assert.ok(!/escalera/i.test(I4.ahoraTu.voz) || /fila/.test(I4.ahoraTu.voz), 'la voz sirve también para comparar en una columna');
  assert.ok(!/conduc|intermedi|medio camino/i.test([def.glosario.find(g => g.termino === 'semimetal').simple, def.glosario.find(g => g.termino === 'semimetal').def].join(' ')), 'el glosario no dice cómo conduce (Predice)');
});
