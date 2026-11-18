// Pruebas propias de «Estructura atómica» (además del validador común de contenido/teoria/teoria.test.js). Fase 3 del
// método (18 nov): las seis ideas están rehechas contra el contrato y la unidad declara calidad: 2.
//   - las seis ideas en el orden aprobado (docs/etapa4/propuesta-quimica.md §3), con sus id y los id de las mesas;
//   - la unidad entera cumple el contrato de calidad 2 (validador con los temas del catálogo) y cada idea estrena sus
//     palabras con `simple`;
//   - un color fijo por magnitud (def.colores): Z naranja, N turquesa, electrones violeta, carga carmín, orbitales
//     turquesa; A y los números cuánticos en tinta; sin verde ni paleta de elementos en ninguna figura;
//   - la idea 1: el control de la carga salió del juego y la misión la cumple solo el carbono-14;
//   - las ideas 2 a 6: la misión no está cumplida al abrir; el juego de la idea 4 llega a Z = 36 con Cr y Cu;
//   - nada antes de Predice delata su respuesta, en ninguna idea;
//   - N son los neutrones: el nitrógeno nunca sale como «N» suelto (decisiones del 18 nov, pregunta 7);
//   - «Ahora tú» trae datos y cuatro opciones distintas en 400 semillas (la idea 1, además, con su respuesta rehecha
//     aquí); las cuentas de las ideas 2 a 6 se rehicieron aparte, contra una tabla de configuraciones escrita a mano
//     (scratchpad, f3/cuentas.py: 2227 comprobaciones, 0 diferencias);
//   - los 15 ejemplos de cada idea: 5 por nivel, datos en todos, figura sin la respuesta, alternativas con la letra que
//     dice el resuelto (cuentas de la idea 1 en e4-qui/cuentas-idea1.py; de las otras, en f3/cuentas.py);
//   - la convención de mₗ y mₛ: la misma en «Lee», en la regla, en los datos y en la tarjeta de nucleo/convencion.js;
//   - la comparación de radios de los isoelectrónicos salió de la unidad (va a Tabla periódica).
//   - correcciones del 18 nov (rutinas/auditoria/quimica.estructura-atomica.md, «Correcciones»): el electrón es de 1897
//     (A1); la regla del catión y Hund en Datos donde se usan (A2); cada [Gas] con su línea (A3); la misma abreviada que
//     el generador (M5); «Vale si» solo con condiciones (M4); el papel de atomo-y-tabla por unidad (M2) y los ejemplos
//     corregidos (M1, M6, M7, B1, B3, B4).
//   - ronda 2 del lector en frío (18 nov, noche): cada alternativa con número de los ejemplos se rehace con la cuenta de
//     su error (tabla DISTRACTORES) y el resuelto nombra todas las incorrectas; lo que marcó el veredicto en los momentos.
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
  assert.deepEqual(def.laboratorioIdeas, { 'nube-orbital': ['numeros-cuanticos'], 'arma-ion': ['nucleo-identidad'], 'cajas-ion': ['configuracion-iones', 'desapareados-isoelectronicos'] });
  assert.equal(def.calidad, 2);
});

test('la unidad entera cumple el contrato de calidad 2, con los temas del catálogo', () => {
  const cat = require('../../../catalogo/cursos/quimica.json').unidades.find(u => u.id === def.unidad);
  const p = Teoria.problemas(def, { temas: cat.temas, semillas: 80 });
  assert.deepEqual(p, [], p.join('\n'));
  const porIdea = Glosario.porIdea(def);
  assert.deepEqual(porIdea.map(l => l.filter(g => g.simple).map(g => g.termino)), [
    ['número atómico', 'número de masa', 'isótopo'],
    ['modelo atómico', 'partícula alfa', 'nivel de energía', 'orbital'],
    ['subnivel', 'números cuánticos', 'espín'],
    ['configuración electrónica', 'capa de valencia'],
    ['catión', 'anión'],
    ['regla de Hund', 'electrón desapareado', 'paramagnético', 'diamagnético'],
  ]);
  // Primera pantalla con un objeto de prueba (data-prueba): hueso, retablo, hotel, hotel con precios, salero, combi.
  const OBJ = ['hueso', 'retablo', 'hotel', 'hotel', 'salero', 'combi'];
  def.ideas.forEach((i, k) => {
    const t = i.lee.tarjetas[0], svg = Kit.piezas[t.pieza].dibujar(t.dibujo.datos, t.dibujo.estado || {});
    assert.match(svg, new RegExp(`data-objeto="${OBJ[k]}" data-prueba="si"`), i.id);
    const j = Kit.piezas[i.juega.pieza || i.pieza].dibujar(i.juega.dibujo(Teoria.inicio(i.juega)).datos);
    assert.match(j, new RegExp(`data-objeto="${OBJ[k]}"`), `${i.id}: el juego abre con el objeto`);
  });
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
  if (i.regla.dibujo) con('regla', i.regla.dibujo, i.regla.dibujo.pieza || i.mira.pieza);
  for (let s = 0; s < 60; s++) {
    const a = i.ahoraTu.generar(s);
    if (a.dibujo) con(`ahora tú ${s}`, a.dibujo, i.ahoraTu.pieza);
    const r = i.resuelve.generar(s);
    con(`resuelve ${s}`, r.dibujo, i.resuelve.pieza);
    r.pasos.forEach((p, k) => con(`resuelve ${s} paso ${k + 1}`, p.dibujo, i.resuelve.pieza));
  }
  return out;
}

test('colores: un color por magnitud en toda la unidad (Z naranja, N turquesa, electrones violeta, carga carmín, A en tinta)', () => {
  assert.deepEqual(def.colores, { protones: 'o', neutrones: 'i', electrones: 'f', carga: 'h', orbitales: 'i' });
  let n = 0;
  for (const i of def.ideas) for (const { donde, x } of lecturas(i)) for (const f of fichas(x)) {
    if (f.color && f.llave) continue;
    n++;
    assert.ok(f.m in def.colores, `${i.id} ${donde}: «${f.t}» sin magnitud (m = ${f.m})`);
    assert.equal(f.v, `c-${def.colores[f.m]}`, `${donde}: «${f.t}» (${f.m}) en ${f.v}`);
    if (f.t === 'Z') assert.equal(f.v, 'c-o', donde);
    if (f.t === 'N') assert.equal(f.v, 'c-i', donde);
    if (f.t === 'A') assert.fail(`${donde}: A va en tinta`);
  }
  assert.ok(n > 1500, `${n} fichas`);
  // Orbitales y neutrones comparten el turquesa: nunca en la misma idea (la de los neutrones es la 1).
  for (const i of def.ideas) { const ms = new Set(lecturas(i).flatMap(({ x }) => fichas(x).map(f => f.m))); assert.ok(!(ms.has('orbitales') && ms.has('neutrones')), i.id); }
  const ctl = id => I1.juega.controles.find(c => c.id === id).color;
  assert.equal(ctl('z'), 'c-o'); assert.equal(ctl('n'), 'c-i');
  const mesa = def.laboratorio.find(m => m.id === 'arma-ion');
  assert.deepEqual(mesa.controles.map(c => c.color), ['c-o', 'c-i', 'c-h']);
  for (const i of def.ideas) for (const fg of figuras(i)) {
    const s = Kit.piezas[fg.pieza].dibujar(fg.datos, fg.estado);
    assert.ok(!/var\(--c-d\)/.test(s), `${i.id} ${fg.donde}: verde`);
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
  for (const i of def.ideas) for (const { donde, x } of lecturas(i)) {
    const t = plano(x);
    assert.ok(!/(^|[^⁰¹²³⁴⁵⁶⁷⁸⁹\p{L}])N[⁺⁻]/u.test(t), `${i.id} ${donde}: «N» con carga: ${t}`);
  }
  for (const i of def.ideas) for (const fg of figuras(i)) {
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
  for (const i of def.ideas) for (const { donde, x } of lecturas(i)) {
    for (const f of fichas(x)) assert.ok(!/^[A-E]\u2060?$/.test(f.t), `${donde}: la letra «${f.t}» en ${f.v}`);
    for (const b of negritas(x)) { n++; assert.match(plano(b.negrita), /^[A-E]$/, donde); assert.equal(fichas(b.negrita).length, 0, donde); }
  }
  assert.ok(n >= 100, `${n} letras en negrita`);
  for (const i of def.ideas) for (const e of i.ejemplos.filter(x => x.alternativas)) assert.equal(negritas(e.respuesta).length, 1, `${i.id}: ${e.titulo}`);
});

// ---------- Ideas 2 a 6 (fase 3) ----------
const I = id => def.ideas.find(i => i.id === id);
test('ideas 2 a 6: la misión no está cumplida al abrir y la cumplen justo los casos que dice', () => {
  const cumplen = id => Teoria.grilla(I(id).juega.controles).filter(v => I(id).juega.mision.logrado(v));
  for (const i of def.ideas) assert.equal(i.juega.mision.logrado(Teoria.inicio(i.juega)), false, i.id);
  assert.deepEqual(cumplen('modelos-atomicos'), [{ k: 'thomson', b: 0 }]);
  assert.deepEqual(cumplen('numeros-cuanticos').map(v => v.n), [3, 3, 3]);
  assert.deepEqual(cumplen('configuracion-electronica'), [{ z: 21 }]);
  assert.deepEqual(cumplen('configuracion-iones'), [{ z: 11, q: 1 }]);
  assert.deepEqual(cumplen('desapareados-isoelectronicos').map(v => `${v.c1}${v.c2}${v.c3}`).sort(), ['112', '121', '211']);
  // Idea 4: el juego llega al kriptón, con el cromo y el cobre como excepción (decisiones del 18 nov).
  const c = I('configuracion-electronica').juega.controles[0];
  assert.deepEqual([c.id, c.min, c.max], ['z', 1, 36]);
  const lect = z => plano(I('configuracion-electronica').juega.lectura({ z }));
  assert.match(lect(24), /excepción.*4s¹ 3d⁵/); assert.match(lect(29), /excepción.*4s¹ 3d¹⁰/);
  assert.match(lect(19), /4s/); assert.match(lect(21), /3d \(S\/ 5\)/);
  // Idea 2: con Thomson la alfa casi no se desvía; con Dalton, choca y se desvía.
  assert.match(plano(I('modelos-atomicos').juega.lectura({ k: 'thomson', b: 0.5 })), /casi nada/);
  assert.match(plano(I('modelos-atomicos').juega.lectura({ k: 'dalton', b: 0.5 })), /se desvía 120°/);
  // Idea 5: Na⁺ con la lectura del neón.
  assert.match(plano(I('configuracion-iones').juega.lectura({ z: 11, q: 1 })), /10 e⁻ → 1s² 2s² 2p⁶, como el neón/);
});

// Lo que delataría cada predicción (y qué se ve antes de ella).
const DELATA_IDEA = {
  'modelos-atomicos': /núcleo|diminut|casi vac|concentrad/i,
  'numeros-cuanticos': /\b32\b|treinta y dos/,
  'configuracion-electronica': /5s|S\/ 6|electrón 37/,
  'configuracion-iones': /salen (primero )?(los )?(del|dos del) 4s|pierde.*4s|4s antes|\[Ar\] 3d⁶|mayor n/,
  'desapareados-isoelectronicos': /\b4 (solos|desapareados|electrones solos)|cuatro (solos|desapareados)/,
};
test('ideas 2 a 6: nada antes de Predice delata su respuesta', () => {
  const porIdea = Glosario.porIdea(def);
  def.ideas.forEach((i, k) => {
    const re = DELATA_IDEA[i.id];
    if (!re) return;
    const antes = [i.titulo, i.pregunta, i.actividad, i.juega.consigna, i.juega.mision.texto, i.juega.mision.bien,
      ...i.lee.tarjetas.map(t => `${t.titulo} ${plano(t.texto)}`), ...i.juega.leyenda.map(x => plano(x.t)), ...porIdea[k].map(g => g.simple || ''),
      ...i.juega.controles.map(c => c.etiqueta)];
    for (const t of antes) assert.ok(!re.test(t), `${i.id}: delata «${t}»`);
    for (const v of Teoria.grilla(i.juega.controles)) assert.ok(!re.test(plano(i.juega.lectura(v))), `${i.id}: lectura ${JSON.stringify(v)}`);
    // La figura de Predice no muestra la respuesta: «?» en lo que se pide.
    const fig = Kit.piezas[i.predice.pieza || i.pieza].dibujar(i.predice.dibujo.datos, i.predice.dibujo.estado || {});
    // En la idea 4 el pasillo 5s se ve (es una de las opciones); lo que no se ve es su precio.
    assert.ok(!(i.id === 'configuracion-electronica' ? /S\/ [67]/ : re).test(Teoria.textoSVG(fig)), `${i.id}: la figura de Predice delata`);
  });
});

test('Ahora tú de las ideas 2 a 6: datos, cuatro opciones distintas con su error en 400 semillas, y llega a examen', () => {
  for (const i of def.ideas.slice(1)) {
    const preguntas = new Set();
    for (let s = 0; s < SEMILLAS; s++) {
      const a = i.ahoraTu.generar(s), txt = a.opciones.map(o => plano(o.texto));
      assert.ok(Array.isArray(a.datos) && a.datos.length >= 1, `${i.id} ${s}: sin datos`);
      assert.equal(a.opciones.length, 4, `${i.id} ${s}: ${txt}`);
      assert.equal(new Set(txt).size, 4, `${i.id} ${s}: repetidas ${txt}`);
      assert.equal(a.opciones.filter(o => o.correcta).length, 1);
      for (const o of a.opciones.filter(x => !x.correcta)) assert.ok(/^(QM-|AT\d)/.test(o.error) && o.siFuera, `${i.id} ${s}: ${o.id}`);
      // Los datos no traen la respuesta (el paso hecho).
      const bien = plano(a.opciones.find(o => o.correcta).texto);
      if (/\d/.test(bien) && bien.length > 3) for (const d of a.datos) assert.ok(!plano(d).includes(bien), `${i.id} ${s}: el dato «${plano(d)}» trae «${bien}»`);
      preguntas.add(plano(a.pregunta).replace(/[\d⁰-⁹¹²³⁺⁻]+/gu, '#').replace(/ (del|de) (ion |átomo de )?[\p{L}#]+/gu, '').slice(0, 50));
    }
    assert.ok(preguntas.size >= 4, `${i.id}: ${preguntas.size} tipos`);
  }
  // Nivel examen: el orden de llenado en datos hasta Z = 54 (ideas 4 a 6).
  const llega = id => [...Array(SEMILLAS).keys()].map(s => I(id).ahoraTu.generar(s)).filter(a => /Z = (3[7-9]|4\d|5[0-4])/.test(plano(a.pregunta)));
  for (const id of ['configuracion-electronica', 'configuracion-iones', 'desapareados-isoelectronicos']) {
    const casos = llega(id);
    assert.ok(casos.length > 20, id);
    for (const a of casos) assert.ok(a.datos.some(d => /Orden de llenado: .*5s 4d 5p/.test(plano(d))), `${id}: ${plano(a.pregunta)}`);
  }
  // Las excepciones de la quinta fila (Nb, Mo, Ru, Rh, Pd, Ag) no salen en ningún caso.
  for (const i of def.ideas) for (let s = 0; s < SEMILLAS; s++) assert.ok(!/Z = (41|42|44|45|46|47)\b|\b(niobio|molibdeno|rutenio|rodio|paladio|plata)\b|Ag⁺/.test(plano(i.ahoraTu.generar(s).pregunta)), `${i.id} ${s}`);
});

test('los 15 ejemplos de las ideas 2 a 6: niveles, datos, figura sin la respuesta, color y letra', () => {
  for (const i of def.ideas.slice(1)) {
    const ej = i.ejemplos;
    assert.equal(ej.length, 15, i.id);
    for (const nv of [1, 2, 3]) assert.equal(ej.filter(e => e.nivel === nv).length, 5, `${i.id} nivel ${nv}`);
    ej.forEach((e, k) => {
      const d = `${i.id} ejemplo ${k + 1}`, resp = Array.isArray(e.respuesta) ? e.respuesta : [e.respuesta], r = plano(resp);
      assert.ok(Array.isArray(e.datos) && e.datos.length >= 1, `${d}: sin datos`);
      // Un número de electrones o de orbitales en la respuesta lleva su color.
      if (/\d+ (electr|desapare)/.test(r)) assert.ok(fichas(resp).some(f => f.m === 'electrones'), `${d}: «${r}» sin el violeta de los electrones`);
      if (/\d+ orbitales/.test(r)) assert.ok(fichas(resp).some(f => f.m === 'orbitales'), `${d}: «${r}» sin el turquesa de los orbitales`);
      if (e.alternativas) {
        assert.equal(e.alternativas.length, 5, d);
        const L = r.replace(/⁠/g, '').slice(0, 1), alt = e.alternativas['ABCDE'.indexOf(L)], despues = r.replace(/⁠/g, '').replace(/^[A-E], /, '');
        assert.ok(despues.includes(alt) || despues.toLowerCase().includes(alt.toLowerCase()), `${d}: la letra ${L} («${alt}») no es «${despues}»`);
        assert.ok(e.nivel === 3, `${d}: alternativas solo en nivel examen`);
      }
      if (e.figura) {
        const s = Kit.piezas[e.figura.pieza].dibujar(e.figura.datos, e.figura.estado || {});
        const conMl = e.figura.datos.ml || (e.figura.datos.cajas && e.figura.datos.cajas.ml);
        const textos = [...s.matchAll(/<text[^>]*>(.*?)<\/text>/g)].map(m => m[1].replace(/<[^>]+>/g, '')).filter(t => !(conMl && /^[+−]?\d$/.test(t)));
        const enun = plano(e.enunciado) + ' ' + e.datos.map(plano).join(' ');
        for (const num of r.match(/\d+/g) || []) if (!enun.includes(num)) for (const t of textos) assert.ok(!new RegExp(`(^|\\D)${num}(\\D|$)`).test(t), `${d}: la figura muestra ${num} («${t}»)`);
        // Las figuras de las cajas no traen las flechas de lo que se pide: o vacías, o el átomo neutro del planteamiento.
        assert.ok(!/kit-ultimo/.test(s), `${d}: la figura marca el último electrón`);
      }
    });
  }
});

test('convención de mₗ y mₛ: la misma en Lee, la regla, los datos y la tarjeta del examen', () => {
  const C = require('../../../nucleo/convencion.js');
  const c = C.LISTA['ultimo-electron'];
  assert.ok(c && /−ℓ.*\+ℓ/.test(c.examen) && /↑.*\+½/.test(c.examen) && /↓.*−½/.test(c.examen));
  const i6 = I('desapareados-isoelectronicos');
  const lee = i6.lee.tarjetas.find(t => t.titulo === 'Convención del examen');
  assert.ok(lee && /−ℓ.*\+ℓ/.test(lee.texto) && /\+½/.test(lee.texto));
  assert.match(i6.regla.condicion, /−ℓ a \+ℓ.*↑ \(\+½\).*↓ \(−½\)/);
  // Todo «Ahora tú» que pide el último electrón trae la convención en datos.
  for (let s = 0; s < SEMILLAS; s++) {
    const a = i6.ahoraTu.generar(s);
    if (/números cuánticos/.test(plano(a.pregunta))) assert.ok(a.datos.some(d => /Convención: las cajas van de mₗ = −ℓ/.test(plano(d))) && a.datos.some(d => /mₛ = \+½/.test(plano(d))), `semilla ${s}`);
  }
  // El oxígeno y el Fe²⁺ de «Mira», con la convención.
  assert.match(c.examen, /\(2; 1; −1; −½\)/);
  assert.ok(i6.mira.pasos.some(p => /\(3; 2; −2; −½\)/.test(plano(p.ecuacion || p.texto))));
});

test('la comparación de radios de los isoelectrónicos salió de la unidad (va a Tabla periódica)', () => {
  for (const i of def.ideas) for (const { donde, x } of lecturas(i)) assert.ok(!/\bpm\b|\bradios?\b/.test(plano(x)), `${i.id} ${donde}: ${plano(x)}`);
  assert.ok(!def.requiere.some(r => /recta\.js/.test(r)));
});

// ---------- Correcciones del 18 nov (auditoría y lector en frío) ----------
const GEN_CU = require('../../../plantillas/configuracion-ubicacion/generador.js');
const GEN_QC = require('../../../plantillas/quimica-conceptos/generador.js');
const EA = 'quimica.estructura-atomica';
const planoG = x => (Array.isArray(x) ? x.map(planoG).join(' ') : x && typeof x === 'object' ? String(x.t ?? x.texto ?? '') : String(x ?? ''));
// Cada ejercicio de una idea, ya armado: ejemplos, «Ahora tú» y «Así se resuelve» (con sus textos y sus datos).
function ejercicios(i, semillas = SEMILLAS) {
  const out = [];
  i.ejemplos.forEach((x, k) => out.push({ donde: `ejemplo ${k + 1} «${x.titulo}»`, pide: [x.enunciado, x.alternativas], todo: [x.enunciado, x.alternativas, x.solucion.map(y => [y.texto, y.ecuacion]), x.respuesta, x.figura && x.figura.datos], datos: x.datos }));
  for (let s = 0; s < semillas; s++) {
    const a = i.ahoraTu.generar(s);
    out.push({ donde: `ahora tú ${s}`, pide: [a.pregunta, a.opciones.map(o => o.texto)], todo: [a.pregunta, a.opciones.map(o => [o.texto, o.siFuera]), a.solucion.texto, a.solucion.ecuacion], datos: a.datos });
  }
  for (let s = 0; s < 60; s++) {
    const r = i.resuelve.generar(s);
    out.push({ donde: `resuelve ${s}`, pide: [r.enunciado], todo: [r.enunciado, r.pasos.map(p => [p.texto, p.ecuacion, p.dibujo && p.dibujo.datos]), r.respuesta, r.dibujo && r.dibujo.datos], datos: r.datos });
  }
  return out;
}

// A1: una fecha por hecho. Thomson halló el electrón en 1897; 1904 es su modelo. Se revisa toda la unidad y su práctica.
test('A1: el electrón es de 1897 en toda la unidad y en su práctica; 1904 es solo el modelo de Thomson', () => {
  const textos = [];
  for (const i of def.ideas) for (const { x } of lecturas(i)) textos.push(plano(x));
  for (let s = 0; s < 300; s++) { const p = GEN_QC.generar(s, { unidad: EA }); textos.push(planoG([p.enunciado, p.pregunta, p.datos, p.solucion, p.alternativas.map(a => [a.texto, a.error && a.error.explicacion])])); }
  for (const q of require('../../../plantillas/quimica-conceptos/papel.json').problemas) textos.push([q.enunciado, q.respuesta, ...q.pasos].join(' '));
  textos.push(def.historia.texto);
  const MAL = /(hall|descubr|lleg|identific)\w*[^.;]*electr[oó]n[^.;]*1904|electr[oó]n[^.;]*(hall|descubr|lleg)\w*[^.;]*1904|1904[^.;]*(hall|descubr)\w*[^.;]*electr[oó]n/i;
  for (const t of textos) assert.ok(!MAL.test(t), `fecha del electrón: «${t.slice(0, 160)}»`);
  assert.ok(textos.some(t => /electr[oó]n[^.;]*1897|1897[^.;]*electr[oó]n/.test(t)), 'la unidad dice que el electrón es de 1897');
  // Lo que piden los ejercicios de la idea 2 (proporciones fijas, rayos catódicos, postulados de Dalton) se enseña antes.
  const i2 = I('modelos-atomicos'), ense = plano([i2.lee.tarjetas.map(t => t.texto), i2.mira.pasos.map(p => p.texto), i2.regla.texto]);
  for (const re of [/proporciones fijas/, /rayos catódicos/, /iguales dentro de cada elemento/, /solo se reordenan/, /números enteros sencillos/, /Thomson, 1897/]) assert.match(ense, re);
});

// A3 y nota (c): un gas abreviado en un ejercicio lleva su línea en «Datos» (teoría, práctica y papel).
const GASES_RE = /\[(He|Ne|Ar|Kr|Xe)\]/g;
test('A3: todo ejercicio que usa [He], [Ne], [Ar] o [Kr] trae su línea en Datos (teoría, práctica y papel)', () => {
  for (const i of def.ideas) for (const x of ejercicios(i)) {
    if (/Qué abrevia \[Ar\]/.test(x.donde)) continue;
    const dt = x.datos.map(plano);
    for (const g of new Set(plano(x.todo).match(GASES_RE) || [])) assert.ok(dt.some(d => d.startsWith(`${g}:`)), `${i.id} ${x.donde}: usa ${g} sin su línea`);
  }
  for (const i of def.ideas) if (i.predice.datos) for (const g of new Set(plano([i.predice.pregunta, i.predice.datos, i.predice.opciones.map(o => o.texto)]).match(GASES_RE) || []))
    assert.ok(i.predice.datos.map(plano).some(d => d.startsWith(`${g}:`)), `${i.id} predice: ${g}`);
  // La leyenda del juego de la idea 5 dice qué es [Ne] y [Ar] (auditoría M8).
  assert.deepEqual(I('configuracion-iones').juega.leyenda.filter(l => typeof l.s === 'string' && /^\[/.test(l.s)).map(l => l.s), ['[Ne]', '[Ar]']);
  for (let s = 0; s < SEMILLAS; s++) {
    const p = GEN_CU.generar(s, { unidad: EA });
    for (const g of new Set(planoG([p.enunciado, p.pregunta, p.solucion, p.alternativas.map(a => a.texto)]).match(GASES_RE) || []))
      assert.ok(p.datos.some(d => d.startsWith(`${g}:`)), `práctica ${s} (${p._datos.tipo}): ${g}`);
  }
  for (const q of require('../../../plantillas/configuracion-ubicacion/papel.json').problemas.filter(x => (x.unidades || []).includes(EA))) {
    const datos = q.enunciado.split(' Datos: ')[1];
    for (const g of new Set([q.enunciado, q.respuesta, ...q.pasos].join(' ').match(GASES_RE) || [])) assert.ok(datos.includes(`${g}:`), `papel ${q.id}: ${g}`);
  }
});

// A2: la salida del catión y Hund van en «Datos» de todo ejercicio de las ideas 5 y 6 que los usa (teoría y práctica).
test('A2: la regla del catión y la de Hund están en Datos donde se usan (ideas 5 y 6, práctica y papel)', () => {
  const CAT = /(?:^|[^A-Za-z])((?!X)[A-Z][a-z]?[²³⁴]?⁺)/g;
  for (const id of ['configuracion-iones', 'desapareados-isoelectronicos']) for (const x of ejercicios(I(id))) {
    const pide = plano(x.pide), dt = x.datos.map(plano);
    const sinConfig = [...pide.matchAll(CAT)].map(m => m[1]).filter(c => !dt.some(d => d.startsWith(`${c}:`)));
    if (sinConfig.length) assert.ok(dt.some(d => /^Catión: salen primero los de mayor n; a igual n, los de mayor ℓ$/.test(d)), `${id} ${x.donde}: ${sinConfig} sin la regla del catión`);
    if (/desapareados|diamagn|paramagn|imán|solos/i.test(pide)) assert.ok(dt.some(d => /^Hund: /.test(d)), `${id} ${x.donde}: sin Hund`);
  }
  for (let s = 0; s < SEMILLAS; s++) {
    const p = GEN_CU.generar(s, { unidad: EA }), d = p._datos;
    const cat = d.tipo === 'magnetico' ? d.especies.some(([, q]) => q > 0) : d.carga > 0;
    if (['cation', 'desapareados', 'magnetico', 'cuanticos'].includes(d.tipo) && cat) assert.ok(p.datos.some(l => /^Catión: /.test(l)), `práctica ${s} (${d.tipo})`);
    if (['desapareados', 'magnetico'].includes(d.tipo)) assert.ok(p.datos.some(l => /^Hund: /.test(l)), `práctica ${s} (${d.tipo})`);
  }
  for (const q of require('../../../plantillas/configuracion-ubicacion/papel.json').problemas.filter(x => (x.unidades || []).includes(EA))) {
    const [pide, datos] = q.enunciado.split(' Datos: ');
    if (/desapareados|diamagn|paramagn/.test(pide)) assert.match(datos, /Hund: /, `papel ${q.id}`);
    if (/(Ag|Co|Cr|Cu|Hg|V)[²³]?⁺/.test(pide)) assert.match(datos, /Catión: /, `papel ${q.id}`);
  }
});

// M5: la misma especie se abrevia igual en la teoría y en la práctica (con el gas noble anterior).
test('M5: la abreviada de la teoría es la del generador configuracion-ubicacion para la misma especie', () => {
  const { abreviada, configEspecie } = def._quim, SUP = { '⁰': 0, '¹': 1, '²': 2, '³': 3, '⁴': 4, '⁵': 5, '⁶': 6, '⁷': 7, '⁸': 8, '⁹': 9 };
  const baja = t => t.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, c => SUP[c]);
  let n = 0;
  for (let z = 1; z <= 54; z++) {
    if (z >= 41 && z <= 47) continue;   // la teoría no usa Nb, Mo, Tc, Ru, Rh, Pd ni Ag
    for (let q = -3; q <= 4; q++) {
      if (z - q < 1 || z - q > 54) continue;
      assert.equal(baja(abreviada(configEspecie(z, q))), GEN_CU.configuracion(z, q).abreviada, `Z = ${z}, carga ${q}`);
      n++;
    }
  }
  assert.ok(n > 300);
  // Los casos que vio el auditor: Cl⁻ con [Ne], Br⁻ con [Ar].
  assert.equal(abreviada(configEspecie(17, -1)), '[Ne] 3s² 3p⁶');
  assert.equal(abreviada(configEspecie(35, -1)), '[Ar] 4s² 3d¹⁰ 4p⁶');
});

// M4: «Vale si» solo con condiciones (la regla que estaba en la condición pasó al texto).
test('M4: cada condición de la regla es una condición, de una frase, y no una regla escondida', () => {
  for (const i of def.ideas) {
    const c = i.regla.condicion;
    assert.ok(!/^(convención|a igual|átomos neutros)/i.test(c) && !/\. \S/.test(c), `${i.id}: «${c}»`);
  }
  assert.match(I('configuracion-iones').regla.texto, /a igual n, los de mayor ℓ/);
  assert.match(I('desapareados-isoelectronicos').regla.texto, /un imán la atrae/);
});

// M2: desde esta unidad, el papel de la escena atomo-y-tabla no muestra problemas de Tabla periódica, ni sin datos, ni con «l».
test('M2: el papel de atomo-y-tabla dice la unidad de cada problema; los de esta unidad traen Datos y ℓ', () => {
  const fs = require('fs');
  const pl = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../plantillas/atomo-y-tabla/plantilla.json'), 'utf8'));
  assert.deepEqual(pl.rehacer, [EA]);
  const RT = require('../../../nucleo/repaso-tipos.js'), papel = require('../../../plantillas/atomo-y-tabla/papel.json');
  assert.ok(!/\bn \+ l\b|−l a \+l/.test(papel.indicacion));
  for (const q of papel.problemas) {
    assert.ok(Array.isArray(q.unidades) && q.unidades.length === 1, `${q.id}: sin unidades`);
    assert.deepEqual(RT.unidadesPapel({ id: pl.id, papel: pl.papel, unidades: pl.unidades }, q.id), q.unidades, `${q.id}: repaso y papel no coinciden`);
    if (q.unidades[0] !== EA) continue;
    const t = [q.enunciado, q.respuesta, ...q.pasos].join(' ');
    assert.match(q.enunciado, / Datos: \S/, `${q.id}: sin Datos`);
    assert.ok(!/(^|[\s(,;])l( =|,|\))|n \+ l\b|[−+]1\/2/.test(t), `${q.id}: «l» o «1/2» en vez de ℓ y ½`);
    assert.ok(!/período|periodo|grupo|radio|ionización/i.test(q.enunciado), `${q.id}: es de Tabla periódica`);
  }
});

// M1, M6, B1, B3, B4 y M7: los ejemplos corregidos dicen lo que hace cada alternativa y no traen la respuesta en Datos.
test('ejemplos corregidos: Co²⁺, Cu²⁺, isóbaros, la flecha ↓, isótopo e ion y el núcleo de 1 cm', () => {
  const ej = (id, t) => I(id).ejemplos.find(x => x.titulo === t);
  const co = ej('desapareados-isoelectronicos', 'El último del Co²⁺');
  assert.deepEqual(co.alternativas, ['(4; 0; 0; −½)', '(3; 2; −1; −½)', '(3; 2; +1; +½)', '(3; 2; +1; −½)', '(3; 1; −1; −½)']);
  assert.match(plano(co.solucion.map(x => x.texto)), /C llena cada caja con dos.*D numera las cajas desde 0.*E usa ℓ = 1/);
  const cu = ej('desapareados-isoelectronicos', 'Un ion sin electrones solos');
  assert.match(plano(cu.solucion.map(x => x.texto)), /pierde su único 4s y uno del 3d: 3d⁹/);
  assert.ok(cu.datos.some(d => /^Paramagnética: /.test(plano(d))));
  const fl = ej('desapareados-isoelectronicos', 'Una flecha hacia abajo');
  assert.ok(!fl.datos.some(d => /↓ \(mₛ = −½\)|las ↓/.test(plano(d))), 'los datos regalan la ↓');
  assert.ok(!def.ideas.some(i => i.ejemplos.some(x => /arándano|estadio/.test(plano([x.titulo, x.enunciado, x.respuesta])))));
  const iso = ej('nucleo-identidad', 'Un isótopo y un ion');
  assert.equal(iso.alternativas[2], 'Solo los protones');
  assert.match(plano(ej('nucleo-identidad', 'Isóbaros e isótonos').solucion.map(x => x.texto)), /La E cruza los pares/);
});

// ---------- Ronda 2 del lector en frío (rutinas/frio/quimica.estructura-atomica.md, «Ronda 2», 18 nov, noche) ----------
// La E de «Tres pisos juntos» valía 36 y su resuelto decía «cuenta dos veces el 3» (eso da 2 + 8 + 18 + 18 = 46). Aquí
// se rehace, sin el código de la unidad, el valor de cada alternativa con número de los ejemplos con la cuenta del error
// que su resuelto le pone; y el resuelto nombra todas las incorrectas. Un ejemplo nuevo con alternativas de números que
// no esté en la tabla hace fallar la prueba.
const MM = { mm: 1, cm: 10, m: 1000 };
const valorAlt = t => {
  const m = t.match(/^(\d+(?:,\d+)?)(?: (mm|cm|m))?$/);
  if (m) return [Number(m[1].replace(',', '.')) * (m[2] ? MM[m[2]] : 1)];
  const y = t.match(/^(\d+) y (\d+)$/);
  return y ? [Number(y[1]), Number(y[2])] : null;
};
const hund = (e, cajas) => (e <= cajas ? e : 2 * cajas - e);   // electrones solos de un subnivel (Hund)
const DISTRACTORES = {
  // Ca²⁺: 20 − 2 = 18 e⁻; X³⁻ con 18 e⁻: Z = 18 + (−3).
  'X³⁻ y el calcio': { bien: 'A', A: 18 - 3, B: 18, C: 18 + 3, D: 20 - 3, E: 20 + 3 },
  // X²⁺ con 24 e⁻ y 30 n: Z = 24 + 2.
  'Número de masa de un ion': { bien: 'B', A: 24 + 30, B: 26 + 30, C: (24 - 2) + 30, D: 26, E: 26 + 30 + 2 },
  // A = 52, N = 28: Z = e⁻ = 24.
  'Todas las partículas': { bien: 'A', A: 24 + 28 + 24, B: 52, C: 52 + 28, D: 2 * 52, E: 24 + 24 },
  // 100 m = 100 000 mm, dividido entre lo que dice cada una (en mm).
  'El núcleo de una cancha': { bien: 'D', A: 100000 / 10000, B: 100000 / 1000, C: 100000 / 100, D: 100000 / 100000, E: 100000 / 1000000 },
  // Nivel 3: 3s, 3p y 3d tienen una caja con mₗ = 0 cada uno.
  'Los que tienen mₗ = 0': { bien: 'C', A: 2 * 1, B: 3, C: 2 * 3, D: 1 + 3 + 5, E: 2 * 3 ** 2 },
  'Tres pisos juntos': { bien: 'D', A: 2 * (1 + 3 + 5), B: 8 * 3, C: 1 + (1 + 3) + (1 + 3 + 5), D: 2 * 1 + 2 * (1 + 3) + 2 * (1 + 3 + 5), E: 2 * 1 + 2 * 2 + 2 * 3 },
  // d existe desde n = 3: 3d y 4d, 5 orbitales cada uno.
  'Los orbitales d': { bien: 'B', A: 5, B: 5 + 5, C: 2 * (5 + 5), D: 5 + 5 + 5, E: 2 },
  // Cu: [Ar] 4s¹ 3d¹⁰ (nivel 3: 3s² 3p⁶ 3d¹⁰).
  'El último nivel del cobre': { bien: 'C', A: 2, B: 1 + 10, C: 1, D: 2 + 6 + 10, E: 10 },
  // Br: [Ar] 4s² 3d¹⁰ 4p⁵: llenos 1, 2 y 3; con electrones, 1 a 4.
  'Niveles llenos del bromo': { bien: 'D', A: 4, B: 3 - 1, C: 2 + 5, D: 3, E: 0 },
  // Termina en 4p³: [Ar] 4s² 3d¹⁰ 4p³.
  'Termina en 4p³': { bien: 'E', A: 18 + 2 + 3, B: 2 + 2 + 6 + 2 + 3, C: 18 + 3, D: 18 + 10 + 3, E: 18 + 2 + 10 + 3 },
  // X²⁺ = [Ar] 3d⁸: 26 e⁻, Z = 26 + 2.
  'El X²⁺ con 3d⁸': { bien: 'C', A: 18 + 8, B: 18 + 8 - 2, C: 18 + 8 + 2, D: 18 + 8 + 2 + 2, E: 18 },
  // Fe: [Ar] 4s² 3d⁶; Fe²⁺ y Fe³⁺, electrones 3d.
  'Los 3d del Fe²⁺ y Fe³⁺': { bien: 'D', A: [6 - 2, 6 - 3], B: [6, 6], C: [6 + 2, 6 + 3], D: [6, 6 - 1], E: [6 - 1, 6 - 2] },
  // Fe³⁺: [Ar] 3d⁵, cinco cajas.
  'Los solos del Fe³⁺': { bien: 'D', A: hund(3, 5), B: hund(6, 5), C: 5 % 2, D: hund(5, 5), E: 6 },
  // Cr: [Ar] 4s¹ 3d⁵ (sin la excepción, 4s² 3d⁴).
  'Los solos del cromo': { bien: 'E', A: hund(2, 1) + hund(4, 5), B: hund(5, 5), C: 1 % 2 + 5 % 2, D: hund(1, 1), E: hund(1, 1) + hund(5, 5) },
};
test('ronda 2: cada alternativa con número de los ejemplos vale lo que da el error que le pone su resuelto (cuentas aparte)', () => {
  const vistos = [];
  for (const i of def.ideas) for (const x of i.ejemplos) {
    if (!x.alternativas) continue;
    const vals = x.alternativas.map(valorAlt);
    if (vals.some(v => !v)) continue;
    vistos.push(x.titulo);
    const t = DISTRACTORES[x.titulo];
    assert.ok(t, `«${x.titulo}»: alternativas con número sin su cuenta en DISTRACTORES`);
    'ABCDE'.split('').forEach((L, k) => {
      const esperado = [].concat(t[L]);
      assert.equal(vals[k].length, esperado.length, `«${x.titulo}» ${L}`);
      vals[k].forEach((v, j) => assert.ok(Math.abs(v - esperado[j]) < 1e-9, `«${x.titulo}» ${L}: dice ${x.alternativas[k]}, su error da ${esperado.join(' y ')}`));
    });
    // La letra de la respuesta es la correcta, y el resuelto nombra (en negrita) cada una de las otras.
    const enResp = fichasNegrita(x.respuesta), enSol = new Set(fichasNegrita(x.solucion));
    assert.deepEqual(enResp, [t.bien], `«${x.titulo}»: la respuesta`);
    for (const L of 'ABCDE') if (L !== t.bien) assert.ok(enSol.has(L), `«${x.titulo}»: el resuelto no dice qué hace la ${L}`);
  }
  assert.deepEqual(vistos.sort(), Object.keys(DISTRACTORES).sort(), 'la tabla y los ejemplos con números coinciden');
});
function fichasNegrita(x) {
  if (x === null || x === undefined || typeof x !== 'object') return [];
  if (Array.isArray(x)) return x.flatMap(fichasNegrita);
  if (Array.isArray(x.negrita)) return x.negrita.map(String);
  return Object.values(x).flatMap(fichasNegrita);
}

test('ronda 2: lo que marcó el veredicto, en los momentos', () => {
  const I1r = I('nucleo-identidad').regla;
  assert.match(I1r.texto, /Isóbaros: mismo A \(¹⁴C y ¹⁴N\)/);
  assert.match(I1r.texto, /Isótonos: mismo N \(¹³C y ¹⁴N\)/);
  assert.match(I1r.condicion, /el núcleo cambia solo en procesos nucleares/);
  // Idea 2: qué es 0 y qué es 1 en el control; Dalton y las proporciones fijas en la regla (Ahora tú las pide).
  const i2 = I('modelos-atomicos');
  assert.match(i2.juega.controles.find(c => c.id === 'b').etiqueta, /0: al centro; 1 o −1: al borde/);
  assert.match(i2.regla.texto, /Dalton: átomos macizos \(proporciones fijas\)/);
  assert.match(i2.regla.condicion, /de un solo electrón/);
  // Idea 3: la f en la leyenda, el espín en la regla y, en Ahora tú, ningún «cuántos orbitales/electrones del nf».
  const i3 = I('numeros-cuanticos');
  assert.ok(i3.juega.leyenda.some(l => l.s === 'f'));
  assert.match(i3.regla.texto, /mₛ, espín: \+½ \(↑\) o −½ \(↓\)/);
  for (let s = 0; s < SEMILLAS; s++) assert.ok(!/subnivel \df\?/.test(plano(i3.ahoraTu.generar(s).pregunta)), `semilla ${s}: ${plano(i3.ahoraTu.generar(s).pregunta)}`);
  // Idea 4: «Lee» sin el empate 2p/3s; la regla dice cómo quedan el Cr y el Cu.
  const i4 = I('configuracion-electronica');
  assert.ok(!/3s/.test(i4.lee.tarjetas[0].texto) && !Teoria.textoSVG(i4.lee.tarjetas[0].dibujo).includes('3s'));
  assert.match(i4.regla.texto, /quedan 3d⁵ \(medio lleno\) y 3d¹⁰ \(lleno\)/);
  // Idea 5: el juego arranca en el sodio de la misión.
  assert.equal(Teoria.inicio(I('configuracion-iones').juega).z, 11);
  // Idea 6: el juego no arranca con un reparto que Hund prohíbe; «Mira» dibuja los tres primeros y después el cuarto.
  const i6 = I('desapareados-isoelectronicos'), v0 = Teoria.inicio(i6.juega), k0 = [v0.c1, v0.c2, v0.c3];
  assert.ok(!(k0.includes(2) && k0.includes(0)), `arranca en ${k0}`);
  const cajas = Kit.piezas['quim-cajas'], lineas = c => (cajas.dibujar(i6.mira.datos, i6.mira.pasos[c].estado).match(/<line[^>]*var\(--c-f\)/g) || []).length;
  assert.match(i6.mira.pasos[0].texto, /tres primeros/); assert.equal(lineas(0), 3);
  assert.match(i6.mira.pasos[1].texto, /cuarto/); assert.equal(lineas(1), 4);
  assert.match(i6.lee.tarjetas[0].texto, /de ventana a ventana, tiene dos asientos/);
});

test('ronda 2: los ejemplos que marcó el lector', () => {
  const ej = (id, t) => I(id).ejemplos.find(x => x.titulo === t);
  // 04: se resuelve con los datos (la neutralidad), no de memoria.
  const th = ej('modelos-atomicos', 'La carga positiva de Thomson');
  assert.ok(th.figura && /neutro/.test(plano(th.solucion.map(x => x.texto))));
  // 17: la configuración del Mn sale del orden de llenado; no está en los datos.
  const mn = ej('desapareados-isoelectronicos', 'Los solos del Mn²⁺');
  assert.ok(!mn.datos.some(d => /Manganeso: |4s² 3d⁵/.test(plano(d))) && mn.datos.some(d => /^Orden de llenado/.test(plano(d))));
  assert.ok(mn.datos.length <= 6);
  // 18: los datos van en el orden del enunciado (Fe, Cu, Zn, Mn, Ni).
  const d18 = plano(ej('desapareados-isoelectronicos', 'Un ion sin electrones solos').datos[0]);
  assert.deepEqual(['Fe', 'Cu', 'Zn', 'Mn', 'Ni'].map(x => d18.indexOf(` ${x} `)).every((p, k, l) => p > 0 && (k === 0 || p > l[k - 1])), true, d18);
  // 02 y 10: la resta y el reparto, a la vista.
  assert.ok(ej('nucleo-identidad', 'Dos átomos de cloro').solucion.some(x => /20 − 18 = 2/.test(plano(x.ecuacion))));
  assert.match(plano(ej('configuracion-electronica', 'El último nivel del sodio').solucion.map(x => x.texto)), /2 \+ 2 \+ 6 = 10/);
});
