// Pruebas propias de «Estructura atómica» (además del validador común de contenido/teoria/teoria.test.js). Fase 2 del
// método (18 nov): la idea 1 `nucleo-identidad` está rehecha contra el contrato; las otras cinco se rehacen en la fase 3,
// así que la unidad todavía no declara calidad: 2 y estas pruebas miran la idea 1:
//   - las seis ideas en el orden aprobado (docs/etapa4/propuesta-quimica.md §3), con sus id;
//   - la idea 1 cumple sola el contrato de calidad 2 y estrena sus palabras (tres con `simple`);
//   - un color fijo por magnitud (def.colores): Z naranja, N turquesa, electrones violeta, carga carmín, A en tinta; sin
//     verde en las figuras de la idea 1;
//   - el control de la carga salió del juego y la misión la cumple solo el carbono-14;
//   - nada antes de Predice delata su respuesta (título, pregunta del Resumen, Lee, glosario de la idea, juego);
//   - N son los neutrones: el nitrógeno nunca sale como «N» suelto (decisiones del 18 nov, pregunta 7);
//   - «Ahora tú» trae datos y cuatro opciones distintas en 400 semillas, y su respuesta cuadra con una cuenta hecha aquí
//     a partir del enunciado; «Así se resuelve» pide otra cosa;
//   - los 15 ejemplos: 5 por nivel, datos en todos, respuesta con color, figura sin la respuesta, alternativas con la
//     letra que dice el resuelto (cuentas rehechas aparte en el scratchpad: e4-qui/cuentas-idea1.py).
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../../../nucleo/kit/kit.js');
const Teoria = require('../../../nucleo/teoria.js');
const Glosario = require('../../../nucleo/glosario.js');
const E = require('../../../nucleo/ecuacion.js');
const def = require('./estructura-atomica.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
const idea = id => def.ideas.find(i => i.id === id);
const I1 = idea('nucleo-identidad');
const SEMILLAS = 400;
const limpio = x => (Array.isArray(x) ? x.flatMap(y => (y === undefined || y === null ? [] : Array.isArray(y) ? [' ', ...limpio(y), ' '] : [y])) : x === undefined || x === null ? [] : [x]);
const plano = x => E.texto(limpio(x));
const fichas = x => (x === null || x === undefined || typeof x !== 'object' ? [] : Array.isArray(x) ? x.flatMap(fichas)
  : typeof x.v === 'string' && /^c-/.test(x.v) ? [x] : Object.values(x).flatMap(fichas));

test('las seis ideas en el orden aprobado, con los id que guardan el avance', () => {
  assert.deepEqual(def.ideas.map(i => i.id), ['nucleo-identidad', 'modelos-atomicos', 'numeros-cuanticos', 'configuracion-electronica', 'configuracion-iones', 'desapareados-isoelectronicos']);
  assert.deepEqual(def.ideas.map(i => i.titulo), ['Partículas, isótopos e iones', 'Modelos atómicos', 'Niveles, subniveles y orbitales', 'Configuración electrónica', 'Configuración de los iones', 'Hund y el último electrón']);
  assert.deepEqual(def.laboratorioIdeas['arma-ion'], ['nucleo-identidad']);
});

test('idea 1: cumple sola el contrato de calidad 2 y estrena sus palabras', () => {
  const porIdea = Glosario.porIdea(def);
  assert.deepEqual(porIdea[0].map(g => g.termino), ['átomo', 'protón', 'neutrón', 'electrón', 'número atómico', 'número de masa', 'isótopo', 'isóbaro', 'isótono', 'ion', 'isoelectrónico']);
  assert.deepEqual(porIdea[0].filter(g => g.simple).map(g => g.termino), ['número atómico', 'número de masa', 'isótopo']);
  const sub = Object.assign({}, def, { calidad: 2, ideas: [I1], glosario: porIdea[0], laboratorio: undefined, laboratorioIdeas: undefined });
  const p = Teoria.problemas(sub, { semillas: 60 });
  assert.deepEqual(p, [], p.join('\n'));
  // La primera pantalla es el objeto: el hueso de la llama (quim-objeto, dibujo de prueba).
  assert.equal(I1.lee.tarjetas[0].pieza, 'quim-objeto');
  assert.match(Kit.piezas['quim-objeto'].dibujar(I1.lee.tarjetas[0].dibujo.datos), /data-objeto="hueso" data-prueba="si"/);
  // Catión y anión no se usan aquí: se estrenan en la idea de los iones.
  assert.ok(porIdea[4].some(g => g.termino === 'catión'));
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
// Todas las figuras de la idea 1, con su pieza.
function figuras(i) {
  const out = [], con = (donde, f, pieza) => { if (f && f.datos) out.push({ donde, datos: f.datos, estado: f.estado || {}, pieza: f.pieza || pieza || i.pieza }); };
  for (const v of Teoria.grilla(i.juega.controles)) con(`juego ${JSON.stringify(v)}`, i.juega.dibujo(v), i.juega.pieza);
  for (const [k, t] of i.lee.tarjetas.entries()) con(`lee ${k + 1}`, t.dibujo, t.pieza);
  con('predice', i.predice.dibujo, i.predice.pieza); con('revelar', i.predice.revelar, i.predice.pieza);
  i.mira.pasos.forEach((p, k) => con(`mira ${k + 1}`, { datos: i.mira.datos, estado: p.estado }, i.mira.pieza));
  i.ejemplos.forEach((e, k) => con(`ejemplo ${k + 1}`, e.figura));
  for (let s = 0; s < 60; s++) {
    const r = i.resuelve.generar(s);
    con(`resuelve ${s}`, r.dibujo, i.resuelve.pieza);
    r.pasos.forEach((p, k) => con(`resuelve ${s} paso ${k + 1}`, p.dibujo, i.resuelve.pieza));
  }
  return out;
}

test('colores: un color por magnitud en la idea 1 (Z naranja, N turquesa, electrones violeta, carga carmín, A en tinta)', () => {
  assert.deepEqual(def.colores, { protones: 'o', neutrones: 'i', electrones: 'f', carga: 'h' });
  let n = 0;
  for (const { donde, x } of lecturas(I1)) for (const f of fichas(x)) {
    if (f.color && f.llave) continue;
    n++;
    assert.ok(f.m in def.colores, `${donde}: «${f.t}» sin magnitud (m = ${f.m})`);
    assert.equal(f.v, `c-${def.colores[f.m]}`, `${donde}: «${f.t}» (${f.m}) en ${f.v}`);
    if (f.t === 'Z') assert.equal(f.v, 'c-o', donde);
    if (f.t === 'N') assert.equal(f.v, 'c-i', donde);
    if (f.t === 'A') assert.fail(`${donde}: A va en tinta`);
  }
  assert.ok(n > 300, `${n} fichas`);
  const ctl = id => I1.juega.controles.find(c => c.id === id).color;
  assert.equal(ctl('z'), 'c-o'); assert.equal(ctl('n'), 'c-i');
  const mesa = def.laboratorio.find(m => m.id === 'arma-ion');
  assert.deepEqual(mesa.controles.map(c => c.color), ['c-o', 'c-i', 'c-h']);
  for (const fg of figuras(I1)) {
    const s = Kit.piezas[fg.pieza].dibujar(fg.datos, fg.estado);
    assert.ok(!/var\(--c-d\)/.test(s), `${fg.donde}: verde`);
    assert.ok(!/var\(--el-/.test(s), `${fg.donde}: paleta de elementos en un dibujo de variables`);
  }
});

test('juego: sin el control de la carga; la misión la cumple solo el carbono-14, y no al abrir', () => {
  const j = I1.juega, m = j.mision;
  assert.deepEqual(j.controles.map(c => c.id), ['z', 'n']);
  assert.equal(m.logrado(Teoria.inicio(j)), false);
  const cumplen = Teoria.grilla(j.controles).filter(v => m.logrado(v));
  assert.deepEqual(cumplen, [{ z: 6, n: 8 }]);
  // El carbono-12 del hueso queda a la izquierda para comparar (punto 4).
  const d = j.dibujo({ z: 6, n: 8 }).datos;
  assert.equal(d.atomos[0].titulo, 'carbono-12');
  assert.equal(plano(j.lectura({ z: 6, n: 8 })), 'Z = 6: carbono. A = 6 + 8 = 14: carbono-14.');
  assert.match(plano(j.lectura({ z: 7, n: 7 })), /nitrógeno.*otro elemento/);
});

// Lo que delataría la predicción (el sodio que pierde un electrón sigue siendo sodio: Na⁺).
const DELATA = /Na⁺|sigue siendo sodio|pierde un electrón|perdió un electrón|ganó o perdió/;
test('nada antes de Predice delata su respuesta', () => {
  const porIdea = Glosario.porIdea(def);
  const antes = [I1.titulo, I1.pregunta, I1.actividad, I1.juega.consigna, I1.juega.mision.texto, I1.juega.mision.bien,
    ...I1.lee.tarjetas.map(t => `${t.titulo} ${plano(t.texto)}`), ...I1.juega.leyenda.map(x => plano(x.t)),
    ...porIdea[0].map(g => g.simple || '')];
  for (const t of antes) assert.ok(!DELATA.test(t), `delata: «${t}»`);
  for (const v of Teoria.grilla(I1.juega.controles)) assert.ok(!DELATA.test(plano(I1.juega.lectura(v))));
  // La figura de Predice no muestra el núcleo de después ni su carga: eso es lo que se pide.
  const d = I1.predice.dibujo.datos.atomos[1];
  assert.deepEqual(d.oculto, ['Z', 'N']);
  assert.ok(!d.carga);
});

test('N son los neutrones: el nitrógeno nunca sale como «N» suelto', () => {
  // Un «N» con una carga pegada (N³⁻) sin número de masa delante es el nitrógeno escrito como «N» suelto.
  for (const { donde, x } of lecturas(I1)) {
    const t = plano(x);
    assert.ok(!/(^|[^⁰¹²³⁴⁵⁶⁷⁸⁹\p{L}])N[⁺⁻]/u.test(t), `${donde}: «N» con carga: ${t}`);
  }
  for (const fg of figuras(I1)) {
    const s = Kit.piezas[fg.pieza].dibujar(fg.datos, fg.estado);
    for (const m of s.matchAll(/<text[^>]*>(.*?)<\/text>/g)) {
      const t = m[1].replace(/<[^>]+>/g, '');
      assert.ok(!/(^|[^⁰¹²³⁴⁵⁶⁷⁸⁹\p{L}])N([⁺⁻]|$)/u.test(t), `${fg.donde}: «${t}»`);
    }
  }
  // La mesa «arma-ion» escribe el núclido con su número de masa: ¹⁴N.
  const mesa = def.laboratorio.find(m => m.id === 'arma-ion');
  assert.match(plano(mesa.lectura({ z: 7, n: 7, q: 0 })), /¹⁴N/);
});

// ---------- Ahora tú y Así se resuelve ----------
const SUPD = { '⁰': 0, '¹': 1, '²': 2, '³': 3, '⁴': 4, '⁵': 5, '⁶': 6, '⁷': 7, '⁸': 8, '⁹': 9 };
const desup = t => Number(String(t).split('').map(c => SUPD[c]).join(''));
const cargaDe = t => { if (!t) return 0; const m = /^([¹²³]?)([⁺⁻])$/.exec(t); return (m[2] === '⁺' ? 1 : -1) * (m[1] ? desup(m[1]) : 1); };
const Z_DE = { H: 1, He: 2, Li: 3, Be: 4, B: 5, C: 6, N: 7, O: 8, F: 9, Ne: 10, Na: 11, Mg: 12, Al: 13, Si: 14, P: 15, S: 16, Cl: 17, Ar: 18, K: 19, Ca: 20, Fe: 26, Cu: 29, Zn: 30, Br: 35 };
// Respuesta calculada aquí, leyendo solo el enunciado (sin el código de la unidad).
function esperada(q) {
  let m;
  if ((m = /El ion ([⁰-⁹¹²³]+)([A-Z][a-z]?)([¹²³]?[⁺⁻]) tiene Z = (\d+)\. ¿Cuántos neutrones/u.exec(q))) return String(desup(m[1]) - +m[4]);
  if ((m = /El ion ([⁰-⁹¹²³]+)([A-Z][a-z]?)([¹²³]?[⁺⁻]) tiene Z = (\d+)\. ¿Cuántos electrones/u.exec(q))) return String(+m[4] - cargaDe(m[3]));
  if (/son isótopos del .*¿Qué tienen igual/.test(q)) return 'Protones y electrones';
  if (/¿Cómo son sus reacciones/.test(q)) return 'Iguales: tienen los mismos electrones';
  if ((m = /el ([⁰-⁹¹²³]+)([A-Z][a-z]?) y el ([⁰-⁹¹²³]+)([A-Z][a-z]?)\?/u.exec(q))) {
    const z1 = Z_DE[m[2]], a1 = desup(m[1]), z2 = Z_DE[m[4]], a2 = desup(m[3]);
    return z1 === z2 ? 'Isótopos' : a1 === a2 ? 'Isóbaros' : a1 - z1 === a2 - z2 ? 'Isótonos' : '?';
  }
  if ((m = /El ion X([¹²³]?[⁺⁻]) es isoelectrónico con el ([A-Z][a-z]?)([¹²³]?[⁺⁻])/u.exec(q))) return String(Z_DE[m[2]] - cargaDe(m[3]) + cargaDe(m[1]));
  if ((m = /Un ion X([¹²³]?[⁺⁻]) tiene (\d+) electrones y (\d+) neutrones/u.exec(q))) return String(+m[2] + cargaDe(m[1]) + +m[3]);
  return null;
}
test('Ahora tú: datos, cuatro opciones distintas y respuesta que cuadra con una cuenta aparte (400 semillas)', () => {
  const tipos = new Set();
  for (let s = 0; s < SEMILLAS; s++) {
    const a = I1.ahoraTu.generar(s), q = plano(a.pregunta);
    assert.ok(Array.isArray(a.datos) && a.datos.length >= 1, `semilla ${s}: sin datos`);
    for (const d of a.datos) assert.ok(!/\d+\s*(protones|neutrones|electrones)\b/.test(plano(d)) || /átomo neutro|Z del/.test(plano(d)), `semilla ${s}: el dato da la respuesta: ${plano(d)}`);
    const txt = a.opciones.map(o => plano(o.texto));
    assert.equal(a.opciones.length, 4, `semilla ${s}: ${txt}`);
    assert.equal(new Set(txt).size, 4, `semilla ${s}: opciones repetidas ${txt}`);
    const bien = a.opciones.find(o => o.correcta), esp = esperada(q);
    assert.ok(esp !== null, `semilla ${s}: no se pudo leer «${q}»`);
    assert.equal(plano(bien.texto), esp, `semilla ${s}: «${q}»`);
    for (const o of a.opciones.filter(x => !x.correcta)) assert.ok(o.error && o.siFuera, `semilla ${s}: ${o.id}`);
    tipos.add(q.replace(/[\d⁰-⁹¹²³⁺⁻]+/gu, '#').replace(/del? \S+/g, '').slice(0, 40));
  }
  assert.ok(tipos.size >= 6, `${tipos.size} tipos de pregunta`);
});
test('Así se resuelve: las tres partículas (Ahora tú nunca las pide juntas), con cuentas que cuadran', () => {
  for (let s = 0; s < 60; s++) {
    const r = I1.resuelve.generar(s), q = plano(r.enunciado);
    const m = /el ion ([⁰-⁹¹²³]+)([A-Z][a-z]?)([¹²³]?[⁺⁻])\?/u.exec(q);
    assert.ok(m, q);
    const a = desup(m[1]), z = Z_DE[m[2]], c = cargaDe(m[3]);
    assert.equal(r.respuesta, `${z} protones, ${a - z} neutrones y ${z - c} electrones`);
    assert.ok(r.datos.length >= 3);
    for (let t = 0; t < 60; t++) assert.ok(!/protones, neutrones y electrones/.test(plano(I1.ahoraTu.generar(t).pregunta)));
  }
});

// ---------- Ejemplos ----------
test('los 15 ejemplos: 5 por nivel, datos, respuesta con color, figura sin la respuesta y alternativas con su letra', () => {
  const ej = I1.ejemplos;
  assert.equal(ej.length, 15);
  for (const n of [1, 2, 3]) assert.equal(ej.filter(e => e.nivel === n).length, 5, `nivel ${n}`);
  ej.forEach((e, k) => {
    const d = `ejemplo ${k + 1}`;
    assert.ok(Array.isArray(e.datos) && e.datos.length >= 1, `${d}: sin datos`);
    const resp = Array.isArray(e.respuesta) ? e.respuesta : [e.respuesta];
    // A va en tinta (propuesta §8); toda otra respuesta lleva el color de su magnitud.
    if (!e.alternativas) assert.ok(fichas(resp).length > 0 || /^A = |Tres/.test(plano(resp)), `${d}: la respuesta va con el color de su magnitud`);
    if (e.figura) {
      const s = Kit.piezas[e.figura.pieza].dibujar(e.figura.datos, e.figura.estado || {});
      const textos = [...s.matchAll(/<text[^>]*>(.*?)<\/text>/g)].map(m => m[1].replace(/<[^>]+>/g, ''));
      // Lo que se pide: el número de la respuesta no está en un rótulo de la figura (salvo que sea un dato del enunciado).
      const enun = plano(e.enunciado) + ' ' + e.datos.map(plano).join(' ');
      for (const num of plano(resp).match(/\d+/g) || []) if (!enun.includes(num)) for (const t of textos) assert.ok(!new RegExp(`(^|\\D)${num}(\\D|$)`).test(t), `${d}: la figura muestra ${num} («${t}»)`);
    }
    if (e.alternativas) {
      assert.equal(e.alternativas.length, 5, d);
      const L = plano(resp).replace(/⁠/g, '').slice(0, 1), alt = e.alternativas['ABCDE'.indexOf(L)];
      const despues = plano(resp).replace(/⁠/g, '').replace(/^[A-E], /, '');
      assert.ok(despues.includes(alt) || alt.includes(despues.replace(/ partículas$/, '').replace(/^Z = |^A = /, '')) || alt.toLowerCase() === despues.toLowerCase(),
        `${d}: la letra ${L} («${alt}») no es la respuesta «${despues}»`);
    }
  });
  // Cuentas de los ejemplos (las mismas del script aparte del scratchpad).
  const r = k => plano(ej[k].respuesta).replace(/⁠/g, '');
  assert.equal(r(0), 'A = 63'); assert.equal(r(1), '10 neutrones'); assert.equal(r(2), '18 electrones');
  assert.match(r(3), /17/); assert.equal(r(5), '17 protones, 18 neutrones y 18 electrones');
  assert.equal(r(10), 'A, Z = 15'); assert.equal(r(11), 'B, A = 56'); assert.equal(r(14), 'A, 76 partículas');
});

// La letra de una alternativa (A–E) va en negrita y en tinta: en esta unidad el violeta es de los electrones.
const negritas = x => (x === null || x === undefined || typeof x !== 'object' ? [] : Array.isArray(x) ? x.flatMap(negritas)
  : x.negrita ? [x] : Object.values(x).flatMap(negritas));
test('ninguna letra de alternativa (A–E) lleva color de variable; todas van con { negrita }', () => {
  let n = 0;
  for (const { donde, x } of lecturas(I1)) {
    for (const f of fichas(x)) assert.ok(!/^[A-E]\u2060?$/.test(f.t), `${donde}: la letra «${f.t}» en ${f.v}`);
    for (const b of negritas(x)) { n++; assert.match(plano(b.negrita), /^[A-E]$/, donde); assert.equal(fichas(b.negrita).length, 0, donde); }
  }
  assert.ok(n >= 20, `${n} letras en negrita`);
  for (const e of I1.ejemplos.filter(x => x.alternativas)) assert.equal(negritas(e.respuesta).length, 1, e.titulo);
});
