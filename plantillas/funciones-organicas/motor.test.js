// Pruebas del motor de «El grupo que se cambia: funciones orgánicas». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades: las cuentas de isómeros conocidas (alcoholes y éteres, aldehídos y cetonas, ácidos y ésteres, aminas);
//    cada isómero tiene la fórmula pedida, un nombre que no se repite y una familia que coincide con su grupo; la forma
//    canónica y el nombre no dependen del orden de los átomos; el nombre de cada isómero vuelve a la misma molécula al
//    leerse otra vez desde la caja de grupos; los errores nunca dan el nombre correcto; los puentes de hidrógeno salen
//    del H unido a O o N; con la misma fórmula, el que forma puentes hierve más alto (de tabla); la caja de grupos da
//    la familia de su grupo, conserva los carbonos y da la misma molécula en las posiciones simétricas; la
//    esterificación conserva los átomos (éster + agua = ácido + alcohol); las coordenadas tienen enlaces de largo 1.
// 3. Errores de entrada.
// 4. Cada problema de papel.json coincide con el motor.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const motor = require('./motor.js');

const datos = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));
function cerca(real, esperado, que, tol) {
  const t = tol === undefined ? 1e-9 : tol;
  if (Array.isArray(esperado)) { assert.ok(Array.isArray(real), `${que}: se esperaba una lista`); assert.equal(real.length, esperado.length, `${que}: largo`); esperado.forEach((e, k) => cerca(real[k], e, `${que}[${k}]`, t)); return; }
  if (typeof esperado !== 'number') { assert.deepEqual(real, esperado, que); return; }
  assert.ok(Math.abs(real - esperado) <= t * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
const campo = (r, k) => (k === 'valor' && (r === null || typeof r !== 'object') ? r : k.split('.').reduce((o, p) => (o == null ? o : o[p]), r));
function comprobar(fn, args, espera, que) {
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  const r = motor[fn](...JSON.parse(JSON.stringify(args)));
  for (const [k, v] of Object.entries(espera)) {
    const x = campo(r, k);
    assert.ok(x !== undefined, `${que}: falta ${k}`);
    cerca(x, v, `${que} · ${k}`);
  }
}

// 1. casos.json
test('casos.json: formato', () => {
  assert.equal(datos.plantilla, 'funciones-organicas');
  assert.ok(datos.casos.length >= 15 && datos.casos.length <= 25);
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera, JSON.stringify(c).slice(0, 80));
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Propiedades
// Isómeros estructurales monofuncionales con esqueleto saturado (de tablas conocidas: alcoholes C1–C6 1, 1, 2, 4, 8, 17;
// éteres C2–C6 1, 1, 3, 6, 15; aldehídos C1–C6 1, 1, 1, 2, 4, 8; cetonas C3–C6 1, 1, 3, 6; ácidos C1–C6 1, 1, 1, 2, 4, 8;
// aminas C1–C5 1, 2, 4, 8, 17).
const CONOCIDOS = {
  CH4O: { alcohol: 1 }, C2H6O: { alcohol: 1, eter: 1 }, C3H8O: { alcohol: 2, eter: 1 }, C4H10O: { alcohol: 4, eter: 3 }, C5H12O: { alcohol: 8, eter: 6 }, C6H14O: { alcohol: 17, eter: 15 },
  CH2O: { aldehido: 1 }, C2H4O: { aldehido: 1 }, C3H6O: { aldehido: 1, cetona: 1 }, C4H8O: { aldehido: 2, cetona: 1 }, C5H10O: { aldehido: 4, cetona: 3 }, C6H12O: { aldehido: 8, cetona: 6 },
  CH2O2: { acido: 1 }, C2H4O2: { acido: 1, ester: 1 }, C3H6O2: { acido: 1, ester: 2 }, C4H8O2: { acido: 2, ester: 4 }, C5H10O2: { acido: 4, ester: 9 },
  CH5N: { amina: 1 }, C2H7N: { amina: 2 }, C3H9N: { amina: 4 }, C4H11N: { amina: 8 }, C5H13N: { amina: 17 },
  C2H3N: { nitrilo: 1 }, C3H5N: { nitrilo: 1 }, C4H7N: { nitrilo: 2 },
};
test('cuentas de isómeros conocidas, por familia', () => {
  for (const [f, fam] of Object.entries(CONOCIDOS)) {
    const r = motor.contarIsomeros(f);
    assert.deepEqual(r.porFamilia, fam, f);
    assert.equal(r.n, Object.values(fam).reduce((a, b) => a + b, 0), f);
  }
});
const TODOS = Object.keys(CONOCIDOS).flatMap(f => motor.isomeros(f).map(z => ({ ...z, f })));
test('cada isómero: su fórmula, un nombre que no se repite y la familia de su grupo', () => {
  const vistos = new Map();
  for (const z of TODOS) {
    assert.equal(motor.formula(z.molecula).texto, z.f, z.nombre);
    assert.ok(!vistos.has(z.nombre), `«${z.nombre}» nombra a dos moléculas`); vistos.set(z.nombre, z);
    const r = motor.nombre(z.molecula);
    assert.equal(r.partes.map(p => p.t).join(''), z.nombre, `${z.nombre}: las partes de colores, juntas, son el nombre`);
    assert.equal(r.familia, z.familia, z.nombre);
    const suf = { alcohol: /ol$/, eter: /oxi/, aldehido: /al$/, cetona: /ona$/, acido: /^ácido .*oico$/, ester: /oato de .*ilo$/, amina: /amina$/, nitrilo: /nitrilo$/ }[z.familia];
    assert.ok(suf.test(z.nombre), `${z.nombre}: terminación de ${z.familia}`);
    // Ninguna rama alarga la cadena: no hay «1-metil» (un 2-etilbutan-1-ol sí puede haber: la cadena lleva el C del –OH).
    assert.ok(!/(^|[-,])1-metil/.test(z.nombre), `nombre raro: ${z.nombre}`);
  }
});
function barajar(m, sem) {
  let s = sem; const r = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648;
  const n = m.at.length, p = [...Array(n).keys()];
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
  const inv = []; p.forEach((v, i) => { inv[v] = i; });
  return { at: p.map(i => ({ ...m.at[i] })), en: m.en.map(e => ({ a: inv[e.a], b: inv[e.b], o: e.o })) };
}
test('la forma canónica y el nombre no dependen del orden de los átomos', () => {
  for (const z of TODOS) for (const sem of [3, 11]) {
    const q = barajar(z.molecula, sem);
    assert.equal(motor.canonica(q), motor.canonica(z.molecula), z.nombre);
    assert.equal(motor.nombre(q).nombre, z.nombre, z.nombre);
  }
  assert.ok(motor.mismaMolecula('CH3-CH2-OH', 'OCC'));
  assert.ok(motor.mismaMolecula('CH3-COOH', 'CC(=O)O'));
  assert.ok(motor.mismaMolecula('CH3-COO-CH3', 'COC(C)=O'));
  assert.ok(motor.mismaMolecula('C6H5-OH', 'Oc1ccccc1'));
  assert.ok(motor.mismaMolecula('C6H5-OH', 'OC1=CC=CC=C1'), 'las dos formas de Kekulé son el mismo anillo');
  assert.ok(!motor.mismaMolecula('CH3-CH2-OH', 'CH3-O-CH3'));
});
test('los errores de nombre nunca son el nombre correcto ni la forma anterior', () => {
  for (const z of TODOS) {
    const r = motor.nombre(z.molecula);
    for (const [k, v] of Object.entries(r.errores)) if (v) { assert.notEqual(v, r.nombre, `${z.nombre}: ${k}`); assert.notEqual(v, r.antiguo, `${z.nombre}: ${k}`); }
  }
  // Las opciones de las predicciones de la escena son distintas entre sí.
  const p3a = motor.nombre('CH3-CH2-CHO'), p3b = motor.nombre('CH3-CO-CH3');
  assert.equal(new Set([`${p3a.nombre}|${p3b.nombre}`, `${p3b.nombre}|${p3a.nombre}`, `${p3a.nombre}|${p3b.errores.comoAldehido}`, `${p3a.errores.sufijoOl}|${p3b.nombre}`]).size, 4);
  const p5 = motor.nombre('CH3-COO-CH3');
  assert.equal(new Set([p5.nombre, p5.errores.partesAlReves, p5.errores.comoAcido, p5.errores.eterMasCetona]).size, 4);
  const p7 = motor.nombre('CH3-CH2-CH2-CO-CH3');
  assert.equal(new Set([p7.nombre, p7.errores.numeracionContraria, p7.errores.comoAldehido, p7.errores.sufijoOl]).size, 4);
  const p4 = motor.tipoAlcohol('(CH3)3C-OH');
  assert.equal(new Set([p4.clase, p4.errores.porLocalizador, p4.errores.contandoElO, p4.errores.porNumeroDeOH]).size, 4);
  const p6 = motor.tipoAmina('(CH3)3C-NH2');
  assert.equal(new Set([p6.clase, p6.errores.comoAlcohol, p6.errores.porLocalizador, p6.errores.contandoElN]).size, 4);
  const e2 = motor.contarIsomeros('C3H8O');
  assert.equal(new Set([e2.n, e2.errores.sinEteres, e2.errores.eteresPorEnlace, e2.errores.porPosiciones]).size, 4);
  const e3 = motor.esterificar('CH3-COOH', 'CH3-CH2-OH');
  assert.equal(new Set([e3.formula, e3.errores.sinQuitarAgua, e3.errores.quitaH2, e3.errores.quitaDosAguas]).size, 4);
});
test('puentes de hidrógeno: entre moléculas solo con un H unido a O o N; con el agua basta un O o un N', () => {
  for (const z of TODOS) {
    const m = z.molecula, p = motor.puentes(m);
    assert.equal(p.entreMoleculas, m.at.some(a => (a.el === 'O' || a.el === 'N') && a.h > 0), z.nombre);
    assert.equal(p.conAgua, true, z.nombre);
    assert.equal(p.entreMoleculas, ['alcohol', 'acido', 'amina'].includes(z.familia) && !(z.familia === 'amina' && motor.tipoAmina(m).clase === 'terciaria'), z.nombre);
  }
  assert.equal(motor.puentes('CCC').conAgua, false);
});
test('puntos de ebullición de tabla: con la misma fórmula, el que forma puentes de hidrógeno hierve más alto', () => {
  const T = motor.EBULLICION, conDato = TODOS.filter(z => T[z.nombre] !== undefined);
  assert.ok(conDato.length >= 25);
  for (const a of conDato) for (const b of conDato) {
    if (a.f !== b.f) continue;
    const pa = motor.puentes(a.molecula).entreMoleculas, pb = motor.puentes(b.molecula).entreMoleculas;
    if (pa && !pb) assert.ok(T[a.nombre] > T[b.nombre], `${a.nombre} (${T[a.nombre]}) y ${b.nombre} (${T[b.nombre]})`);
  }
  // Cada nombre de la tabla es un nombre que el motor da.
  const nombres = new Set([...TODOS.map(z => z.nombre), 'metano', 'etano', 'propano', 'butano', 'pentano', 'hexano', 'etano-1,2-diol', 'propano-1,2,3-triol', 'fenol', 'metanamida', 'etanamida', 'propanamida', 'butanamida', 'metanonitrilo']);
  for (const k of Object.keys(T)) assert.ok(nombres.has(k), `nombre de tabla que el motor no da: ${k}`);
  assert.equal(motor.nombre('HO-CH2-CH2-OH').nombre, 'etano-1,2-diol');
  assert.equal(motor.nombre('CH2(OH)-CH(OH)-CH2(OH)').nombre, 'propano-1,2,3-triol');
});
test('la caja de grupos: la familia de su grupo, los mismos carbonos, y las posiciones simétricas dan la misma molécula', () => {
  const FAM = { OH: 'alcohol', O: 'eter', COOH: 'acido', COO: 'ester', NH2: 'amina', NH: 'amina', CONH2: 'amida', CN: 'nitrilo' };
  for (let n = 1; n <= 6; n++) for (const g of Object.keys(motor.CAJA)) for (const p of motor.posiciones(n, g)) {
    const r = motor.ponerGrupo(n, g, p);
    const fam = g === 'CO' ? (n === 1 || p === 1 || p === n ? 'aldehido' : 'cetona') : FAM[g];
    assert.equal(r.familia, fam, `${n} ${g} ${p}`);
    assert.equal(motor.formula(r.molecula).C, n, `${n} ${g} ${p}`);
    const lugar = motor.CAJA[g].lugar;
    if (lugar !== 'enlace') assert.ok(motor.mismaMolecula(r.molecula, motor.ponerGrupo(n, g, n + 1 - p).molecula), `${n} ${g} ${p}: simétrica`);
    else if (g !== 'COO') assert.ok(motor.mismaMolecula(r.molecula, motor.ponerGrupo(n, g, n - p).molecula), `${n} ${g} ${p}: simétrica`);
    // Lo que sale de la caja está entre los isómeros de su fórmula (salvo las amidas, que la escena no enumera).
    if (g !== 'CONH2') assert.ok(motor.isomeros(r.formula).some(z => motor.mismaMolecula(z.molecula, r.molecula)), `${r.nombre} entre los isómeros de ${r.formula}`);
  }
  assert.throws(() => motor.ponerGrupo(3, 'COOH', 2), /no va en ese lugar/);
  assert.throws(() => motor.ponerGrupo(7, 'OH', 1), /1 a 6/);
});
test('esterificación: éster + agua tiene los mismos átomos que ácido + alcohol, y el O del puente viene del alcohol', () => {
  const acidos = ['HCOOH', 'CH3-COOH', 'CH3-CH2-COOH', '(CH3)2CH-COOH'], alcoholes = ['CH3-OH', 'CH3-CH2-OH', 'CH3-CH2-CH2-OH', 'CH3-CH(OH)-CH3'];
  for (const a of acidos) for (const l of alcoholes) {
    const e = motor.esterificar(a, l), fa = motor.formula(a), fl = motor.formula(l), fe = motor.formula(e.ester);
    for (const k of ['C', 'H', 'N', 'O']) assert.equal(fe[k] + (k === 'H' ? 2 : k === 'O' ? 1 : 0), fa[k] + fl[k], `${a} + ${l}: ${k}`);
    assert.equal(motor.funcion(e.ester).familia, 'ester');
    const r = motor.nombre(e.ester);
    assert.equal(e.nombre, r.nombre);
    assert.equal(e.origen[e.oxigenoPuente], 'alcohol');
    // Las dos partes del nombre: la del ácido tiene los C del ácido; la del alcohol, los del alcohol.
    assert.equal(r.ester.carbonosAcido, fa.C); assert.equal(r.ester.carbonosAlcohol, fl.C);
  }
  assert.throws(() => motor.esterificar('CH3-CH2-OH', 'CH3-OH'), /ácido/);
});
test('clases de alcohol y de amina: por los carbonos unidos', () => {
  for (const z of TODOS.filter(t => t.familia === 'alcohol')) {
    const r = motor.tipoAlcohol(z.molecula), v = r.nC;
    assert.equal(r.clase, ['primario', 'primario', 'secundario', 'terciario'][v], z.nombre);
  }
  for (const z of TODOS.filter(t => t.familia === 'amina')) {
    const r = motor.tipoAmina(z.molecula);
    const n = 1 + (z.nombre.match(/(^|[-,])N(?=[-,])/g) || []).length;   // un C por cada localizador N, más la cadena
    assert.equal(r.clase, ['', 'primaria', 'secundaria', 'terciaria'][n], z.nombre);
  }
});
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
test('coordenadas: los enlaces entre átomos pesados miden 1 y ningún par de átomos pesados se encima', () => {
  for (const z of TODOS.filter(t => motor.formula(t.molecula).C <= 5)) {
    const c = motor.coordenadas(z.molecula), m = z.molecula;
    for (const e of m.en) assert.ok(Math.abs(dist(c.atomos[e.a], c.atomos[e.b]) - 1) < 1e-9, z.nombre);
    for (let i = 0; i < m.at.length; i++) for (let j = i + 1; j < m.at.length; j++) assert.ok(dist(c.atomos[i], c.atomos[j]) > 0.5, `${z.nombre}: ${i} y ${j} encimados`);
    assert.equal(c.atomos.length, m.at.length + motor.formula(m).H, z.nombre);
  }
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.molecula('CH3-CH2-CH3-OH'), /valencia/);
  assert.throws(() => motor.molecula('CH3=O'), /valencia/);
  assert.throws(() => motor.molecula('CH3-OH-CH3'), /valencia/);
  assert.throws(() => motor.molecula('CH3-CH(OH-CH3'), /paréntesis/);
  assert.throws(() => motor.molecula('CH3-Cl'), /entiendo|elemento/);
  assert.throws(() => motor.molecula(''), /vacía/);
  assert.throws(() => motor.nombre('CH2=CH-CH2-OH'), /saturados/);
  assert.throws(() => motor.nombre('OCC=O'), /polifuncional/);
  assert.throws(() => motor.nombre('C1CCO1'), /anillos/);
  assert.throws(() => motor.isomeros('C7H16O'), /1 a 6 C/);
  assert.throws(() => motor.isomeros('C2H7O'), /no existe/);
  assert.throws(() => motor.tipoAlcohol('CH3-O-CH3'), /alcohol/);
  assert.throws(() => motor.prioridad(['alcohol', 'sal']), /familia/);
});

// 4. Problemas de papel (regla 6)
const papel = JSON.parse(fs.readFileSync(path.join(__dirname, 'papel.json'), 'utf8'));
test('papel.json: entre 8 y 10 problemas, con respuesta, pasos y verificación', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 8 && papel.problemas.length <= 10);
  const ids = new Set();
  for (const p of papel.problemas) {
    assert.ok(p.id && !ids.has(p.id)); ids.add(p.id);
    assert.ok(p.enunciado && p.respuesta && Array.isArray(p.pasos) && p.pasos.length, `${p.id}: falta texto`);
    assert.ok(Array.isArray(p.verificar) && p.verificar.length, `${p.id}: falta verificar`);
    assert.ok(!/<[a-z]/i.test(p.enunciado + p.respuesta + p.pasos.join('')), `${p.id}: la app muestra texto plano, sin HTML`);
  }
});
for (const p of papel.problemas) test(`papel ${p.id}: la respuesta coincide con el motor`, () => {
  for (const v of p.verificar) comprobar(v.fn, v.args, v.espera, p.id);
});
