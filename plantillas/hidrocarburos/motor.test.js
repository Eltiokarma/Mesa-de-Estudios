// Pruebas del motor de «Bolitas y palitos: hidrocarburos». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades: las cuentas de isómeros conocidas (alcanos C1 a C10, alquenos, alquinos, cicloalcanos); cada isómero
//    tiene la fórmula general de su clase, un nombre propio y una semidesarrollada que vuelve a la misma molécula; la
//    forma canónica no depende del orden de los átomos; girar enlaces simples nunca cambia la molécula (ni su cis o
//    trans) y conserva los largos de enlace; el doble enlace no gira; intercambiar los grupos de un doble enlace
//    cambia la molécula si y solo si hay cis-trans; los errores de cada predicción nunca dan la respuesta correcta.
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
  assert.equal(datos.plantilla, 'hidrocarburos');
  assert.ok(datos.casos.length >= 15 && datos.casos.length <= 25);
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera, JSON.stringify(c).slice(0, 80));
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Propiedades
const H = { alcano: n => 2 * n + 2, alqueno: n => 2 * n, cicloalcano: n => 2 * n, alquino: n => 2 * n - 2 };
const CONOCIDOS = {   // cuentas de isómeros estructurales (sin estereoisómeros), de tablas conocidas
  alcano: { 1: 1, 2: 1, 3: 1, 4: 2, 5: 3, 6: 5, 7: 9, 8: 18, 9: 35, 10: 75 },
  alqueno: { 2: 1, 3: 1, 4: 3, 5: 5, 6: 13, 7: 27 },
  alquino: { 2: 1, 3: 1, 4: 2, 5: 3, 6: 7, 7: 14 },
  cicloalcano: { 3: 1, 4: 2, 5: 5, 6: 12 },
};
test('cuentas de isómeros conocidas', () => {
  for (const [clase, t] of Object.entries(CONOCIDOS)) for (const [n, k] of Object.entries(t)) assert.equal(motor.isomeros(+n, clase).length, k, `${clase} C${n}`);
  // Con cis-trans: C4H8 alquenos 4, C5H10 alquenos 6, C6H12 alquenos 17; cicloalcanos C5 6.
  assert.equal(motor.isomeros(4, 'alqueno', { cisTrans: true }).length, 4);
  assert.equal(motor.isomeros(6, 'alqueno', { cisTrans: true }).length, 17);
  assert.equal(motor.isomeros(5, 'cicloalcano', { cisTrans: true }).length, 6);
  assert.throws(() => motor.isomeros(6, 'cicloalcano', { cisTrans: true }), /hasta 5/);
});
const TODOS = [];
for (const [clase, t] of Object.entries(CONOCIDOS)) for (const n of Object.keys(t)) if (+n <= 8) for (const z of motor.isomeros(+n, clase, { cisTrans: clase !== 'cicloalcano' || +n <= 5 })) TODOS.push({ ...z, clase, n: +n });
test('cada isómero: su fórmula general, su tipo y un nombre que no se repite', () => {
  const vistos = new Map();
  for (const z of TODOS) {
    const f = motor.formula(z.molecula);
    assert.equal(f.C, z.n, z.nombre); assert.equal(f.H, H[z.clase](z.n), z.nombre);
    assert.equal(motor.tipo(z.molecula).tipo, z.clase, z.nombre);
    if (vistos.has(z.nombre)) assert.fail(`«${z.nombre}» nombra a dos moléculas`);
    vistos.set(z.nombre, z);
    // La parte de colores, junta, es el nombre.
    assert.equal(motor.nombre(z.molecula).partes.map(p => p.t).join(''), z.nombre);
    // En los alcanos ninguna rama alarga la cadena: no hay «1-metil…» ni «2-etil…» en un propano o butano. (En los
    // alquenos sí puede haber un 2-etilbut-1-eno: la regla escolar pide que la cadena pase por el doble enlace.)
    if (z.clase === 'alcano') assert.ok(!/(^|[-,])1-metil|^2-etil[a-z]*(prop|but)/.test(z.nombre.replace(/^(cis|trans)-/, '')), `nombre raro: ${z.nombre}`);
  }
});
test('la semidesarrollada que escribe el motor vuelve a la misma molécula', () => {
  for (const z of TODOS) {
    const s = motor.semidesarrollada(z.molecula); if (!s) continue;
    assert.ok(motor.mismaMolecula(motor.molecula(s), z.molecula, { estereo: false }), `${z.nombre}: ${s}`);
    assert.equal(motor.nombre(s).nombre.replace(/^(cis|trans)-/, ''), z.nombre.replace(/^(cis|trans)-/, ''), s);
  }
});
// Barajar los átomos (otro orden de dibujo) no cambia la forma canónica.
function barajar(m, sem) {
  let s = sem; const r = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648;
  const n = m.at.length, p = [...Array(n).keys()];
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
  const q = { at: [], en: [], est: {}, anillo: m.anillo || null };
  const inv = []; p.forEach((v, i) => { inv[v] = i; });
  for (let i = 0; i < n; i++) q.at.push({ ...m.at[p[i]] });
  m.en.forEach((e, k) => { q.en.push({ a: inv[e.a], b: inv[e.b], o: e.o }); if (m.est[k]) q.est[k] = { a: inv[m.est[k].a], b: inv[m.est[k].b], mismo: m.est[k].mismo }; });
  return q;
}
test('la forma canónica no depende del orden de los átomos, y distingue cis de trans', () => {
  for (const z of TODOS) for (const sem of [1, 7, 42]) {
    const q = barajar(z.molecula, sem);
    assert.equal(motor.canonica(q), motor.canonica(z.molecula), z.nombre);
    assert.equal(motor.nombre(q).nombre, z.nombre, z.nombre);
  }
  assert.ok(!motor.mismaMolecula('C/C=C/C', 'C/C=C\\C'));
  assert.ok(motor.mismaMolecula('C(/C)=C/C', 'C/C=C\\C'), 'la rama escrita primero también cuenta');
  assert.ok(motor.mismaMolecula('C/C=C/C', 'C\\C=C\\C'));
  assert.ok(motor.mismaMolecula('C1=CC=CC=C1', 'c1ccccc1'), 'las dos formas de Kekulé son el benceno');
});
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
test('girar enlaces simples: la molécula, su nombre y los largos de enlace no cambian; el doble y el anillo no giran', () => {
  for (const z of TODOS.filter(t => !motor.ciclos(t.molecula).length)) {
    const m = z.molecula; let c = motor.coordenadas(m);
    const largos = q => [...m.en.map(e => dist(q.atomos[e.a], q.atomos[e.b])), ...q.atomos.filter(h => h.padre !== null).map(h => dist(h, q.atomos[h.padre]))];
    const l0 = largos(c);
    m.en.forEach((e, k) => {
      const g = motor.girar(m, c, k, Math.PI);
      if (e.o === 2) { assert.equal(g.ok, false, z.nombre); assert.equal(g.razon, 'doble'); return; }
      assert.ok(g.ok, z.nombre);
      c = g.coords;
      cerca(largos(c), l0, `${z.nombre}: largos`, 1e-9);
      assert.equal(motor.canonica(motor.estereoDeCoordenadas(m, c)), motor.canonica(m), `${z.nombre}: girar el enlace ${k} cambió la molécula`);
    });
    // También a medio giro (90°) los largos se conservan.
    const k1 = m.en.findIndex(e => e.o === 1);
    if (k1 >= 0) cerca(largos(motor.girar(m, c, k1, Math.PI / 2).coords), l0, `${z.nombre}: medio giro`, 1e-9);
  }
  assert.equal(motor.girar('C1CCC1', motor.coordenadas('C1CCC1'), 0).razon, 'anillo');
});
test('intercambiar los dos grupos de un C del doble enlace cambia la molécula si y solo si hay cis-trans', () => {
  for (const z of TODOS.filter(t => t.clase === 'alqueno')) {
    const m = z.molecula, k = m.en.findIndex(e => e.o === 2), c = motor.coordenadas(m);
    for (const lado of [m.en[k].a, m.en[k].b]) {
      const r = motor.intercambiar(m, c, k, lado);
      assert.equal(!r.mismaMolecula, motor.cisTrans(m).tiene, `${z.nombre} (lado ${lado})`);
    }
  }
});
test('el dibujo respeta el cis o el trans de la molécula', () => {
  for (const z of TODOS.filter(t => t.cisTrans === 'cis' || t.cisTrans === 'trans')) {
    const c = motor.coordenadas(z.molecula);
    assert.equal(motor.nombre(motor.estereoDeCoordenadas(z.molecula, c)).nombre, z.nombre);
  }
});
test('carbonos, hibridación, enlaces e insaturaciones cuadran en todos los isómeros', () => {
  for (const z of TODOS) {
    const m = z.molecula, f = motor.formula(m), t = motor.tiposCarbono(m).cuenta;
    if (z.n > 1) assert.equal(t.primario + t.secundario + t.terciario + t.cuaternario, z.n, z.nombre);
    const e = motor.enlaces(m), anillos = motor.ciclos(m).length;
    assert.equal(e.sigma, f.C + f.H - 1 + anillos, `${z.nombre}: σ = átomos − 1 + anillos`);
    const ins = motor.insaturaciones(m);
    assert.equal(ins.valor, ins.anillos + ins.dobles + 2 * ins.triples, z.nombre);
    assert.equal(ins.valor, e.pi + anillos, z.nombre);
    const h = motor.hibridacion(m);
    assert.equal(h.hibs.filter(x => x === 'sp').length, 2 * ins.triples, z.nombre);
    assert.equal(h.hibs.filter(x => x === 'sp2').length, 2 * ins.dobles, z.nombre);
  }
});
test('los errores de nombre nunca son el nombre correcto ni otro nombre de la misma molécula', () => {
  for (const z of TODOS) {
    const r = motor.nombre(z.molecula);
    for (const [k, v] of Object.entries(r.errores)) if (v) { assert.notEqual(v, r.nombre, `${z.nombre}: ${k}`); assert.notEqual(v, r.antiguo, `${z.nombre}: ${k}`); }
  }
  // Las respuestas de las predicciones de la escena son distintas entre sí.
  const p2 = motor.nombre('CH3-CH(C2H5)-CH2-CH3', { dibujada: [0, 1, 4, 5] });
  assert.equal(new Set([p2.nombre, p2.errores.cadenaDibujada, p2.errores.cadenaDibujadaContraria, p2.errores.todosLosC]).size, 4);
  const p6 = motor.nombre('CH3-CH(CH3)-CH=CH-CH3');
  assert.equal(new Set([p6.nombre, p6.errores.numeracionPorSustituyente, p6.errores.localizadorMayor, p6.errores.comoAlcano]).size, 4);
  const p3 = motor.contarIsomeros(5, 'alcano');
  assert.equal(new Set([p3.n, p3.errores.sinCuaternario, p3.errores.torcidaDosVeces, p3.errores.deUnCarbonoMas]).size, 4);
  const p7 = motor.hibridacion('CH≡C-CH3');
  assert.equal(new Set([p7.hibs, p7.errores.todoSp3, p7.errores.exponenteEsOrden, p7.errores.todoSp].map(String)).size, 4);
});
test('la escena evita las moléculas donde la regla escolar y la IUPAC 2013 eligen cadenas distintas', () => {
  for (const s of ['CH3-CH(CH3)-CH=CH-CH3', 'CH3-CH=CH-CH3', 'CH2=C(CH3)2', 'CH2=CH-CH(CH3)-CH3']) assert.equal(motor.nombre(s).difiereIUPAC2013, false, s);
  // Un ejemplo donde sí difieren: 2-etilbut-1-eno (la más larga sin el doble tiene 5 C).
  assert.equal(motor.nombre('CH2=C(CH2CH3)-CH2-CH3').difiereIUPAC2013, true);
});
test('armar: agregar, quitar y cambiar enlaces respeta la valencia', () => {
  let m = motor.molecula('CH4');
  for (let k = 0; k < 4; k++) m = motor.agregarC(m, 0);
  assert.equal(motor.nombre(m).nombre, '2,2-dimetilpropano');
  assert.throws(() => motor.agregarC(m, 0), /4 enlaces/);
  assert.throws(() => motor.quitarC(m, 0), /punta/);
  assert.equal(motor.nombre(motor.quitarC(m, 4)).nombre, '2-metilpropano');
  assert.equal(motor.nombre(motor.cambiarEnlace('CCC', 0)).nombre, 'propeno');
  assert.equal(motor.nombre(motor.cambiarEnlace(motor.cambiarEnlace('CCC', 0), 0)).nombre, 'propino');
  assert.equal(motor.nombre(motor.cambiarEnlace('CC(C)C', 0)).nombre, '2-metilpropeno');
  assert.equal(motor.molecula(motor.cambiarEnlace('CC(C)C', 0)).en[0].o, 2, 'el C central no admite un triple: pasa a doble');
});
test('puntos de ebullición de tabla: más carbonos, más alto; con los mismos carbonos, la cadena recta más alto', () => {
  const T = motor.EBULLICION;
  assert.ok(T['metano'] < T['etano'] && T['etano'] < T['propano'] && T['propano'] < T['butano'] && T['butano'] < T['pentano'] && T['pentano'] < T['hexano'] && T['hexano'] < T['heptano'] && T['heptano'] < T['octano']);
  assert.ok(T['pentano'] > T['2-metilbutano'] && T['2-metilbutano'] > T['2,2-dimetilpropano']);
  for (const k of ['2-metilpentano', '3-metilpentano', '2,2-dimetilbutano', '2,3-dimetilbutano']) assert.ok(T['hexano'] > T[k], k);
  for (const k of Object.keys(T)) assert.equal(motor.nombre(motor.isomeros(motor.formula(motor.molecula(k === 'metano' ? 'C' : smilesDe(k))).C, 'alcano').find(z => z.nombre === k).molecula).nombre, k);
});
function smilesDe(n) { return { 'etano': 'CC', 'propano': 'CCC', 'butano': 'CCCC', '2-metilpropano': 'CC(C)C', 'pentano': 'CCCCC', '2-metilbutano': 'CC(C)CC', '2,2-dimetilpropano': 'CC(C)(C)C', 'hexano': 'CCCCCC', '2-metilpentano': 'CC(C)CCC', '3-metilpentano': 'CCC(C)CC', '2,2-dimetilbutano': 'CC(C)(C)CC', '2,3-dimetilbutano': 'CC(C)C(C)C', 'heptano': 'CCCCCCC', 'octano': 'CCCCCCCC', '2,2,4-trimetilpentano': 'CC(C)(C)CC(C)C' }[n]; }

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.molecula('CH3-CH-CH3'), /valencia/);
  assert.throws(() => motor.molecula('CH3=CH3'), /valencia/);
  assert.throws(() => motor.molecula('C(C)(C)(C)(C)C'), /valencia/);
  assert.throws(() => motor.molecula('CH3-CH(CH3-CH3'), /paréntesis/);
  assert.throws(() => motor.molecula('NH3'), /entiendo|elemento/);
  assert.throws(() => motor.molecula('C1CC'), /anillo/);
  assert.throws(() => motor.molecula(''), /vacía/);
  assert.throws(() => motor.isomeros(11, 'alcano'), /1 a 10/);
  assert.throws(() => motor.nombre('C1CC2CC12'), /más de un anillo/);
  assert.throws(() => motor.formulaGeneral('alquino', 1), /no hay/);
  assert.throws(() => motor.intercambiar('CCC', motor.coordenadas('CCC'), 0), /doble enlace/);
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
