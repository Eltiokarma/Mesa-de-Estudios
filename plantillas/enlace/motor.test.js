// Pruebas del motor de La molécula en 3D (enlace). Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades: los electrones de Lewis cuadran; los terminales cumplen octeto (el H, dueto); la suma de cargas formales
//    es la carga del ion; las posiciones son unitarias y bien separadas; los pares libres de la bipirámide van en
//    ecuatoriales; con ligandos iguales, las formas simétricas son apolares; la polaridad no cambia al girar; el dibujo en
//    3D coincide con la polaridad; la red tiene lado³ iones y coordinación 6; los cortes de ΔEN; ningún error típico
//    coincide con la respuesta en las predicciones de la escena.
// 3. Errores de entrada.
// 4. Cada problema de papel.json coincide con el motor.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const motor = require('./motor.js');

const datos = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));
const TOL = datos.tolerancia;
function cerca(real, esperado, que) {
  assert.ok(Math.abs(real - esperado) <= TOL * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
const campo = (r, k) => k.split('.').reduce((o, p) => (o == null ? o : o[p]), r);
function igual(x, v, que) {
  if (typeof v === 'number') { assert.equal(typeof x, 'number', que); cerca(x, v, que); }
  else if (Array.isArray(v)) { assert.ok(Array.isArray(x) && x.length === v.length, `${que}: largo`); v.forEach((e, i) => igual(x[i], e, `${que}[${i}]`)); }
  else assert.deepEqual(x, v, que);
}
function comprobar(fn, args, espera, que) {
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  const r = motor[fn](...args);
  for (const [k, v] of Object.entries(espera)) {
    const x = campo(r, k);
    assert.ok(x !== undefined, `${que}: falta ${k}`);
    igual(x, v, `${que} · ${k}`);
  }
}

// 1. casos.json
test('casos.json: al menos 20 casos con nombre y la verificación pendiente o hecha', () => {
  assert.ok(datos.casos.length >= 20);
  assert.equal(typeof datos.verificacion, 'string');
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && c.espera && Array.isArray(c.args));
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Propiedades
const CLAVES = Object.keys(motor.MOLECULAS);
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const ang = (a, b) => Math.acos(Math.max(-1, Math.min(1, dot(a, b)))) * 180 / Math.PI;

test('Lewis: los electrones cuadran, los terminales cumplen su octeto y la suma de cargas formales es la carga', () => {
  for (const k of CLAVES) {
    const l = motor.lewis(k), o = motor.spec(k);
    const libresL = l.ligandos.reduce((t, x) => t + x.paresLibres, 0);
    assert.equal(2 * (l.paresEnlazantes + l.paresLibres + libresL), l.electrones, `${k}: electrones`);
    assert.equal(l.electronesCentral, 2 * (l.paresEnlazantes + l.paresLibres), k);
    for (const x of l.ligandos) assert.equal(2 * (x.orden + x.paresLibres), x.simbolo === 'H' ? 2 : 8, `${k}: octeto del ${x.simbolo}`);
    assert.equal(l.sumaCF, o.carga, `${k}: suma de cargas formales`);
    if (motor.elemento(o.central).periodo === 2) assert.ok(l.electronesCentral <= 8, `${k}: el período 2 no expande`);
    if ([2, 13].includes(motor.elemento(o.central).grupo)) assert.equal(l.octeto, 'incompleto', k);
    assert.ok(l.resonancia >= 1);
  }
});
test('posiciones: vectores unitarios; ningún par de dominios a menos de 90°; pares libres de la bipirámide en ecuatoriales', () => {
  for (let d = 2; d <= 6; d++) for (let m = 0; m <= d - 2; m++) {
    let p; try { p = motor.posiciones(d - m, m); } catch (e) { assert.match(e.message, /sin geometría/); continue; }
    const todos = [...p.ligandos, ...p.pares];
    assert.equal(todos.length, d);
    for (const v of todos) assert.ok(Math.abs(Math.hypot(...v) - 1) < 1e-12);
    for (let i = 0; i < d; i++) for (let j = i + 1; j < d; j++) assert.ok(ang(todos[i], todos[j]) > 90 - 1e-9, `d ${d}, m ${m}`);
    if (d === 5) for (const v of p.pares) assert.ok(Math.abs(v[1]) < 1e-12, 'par libre axial');
    if (d === 4) for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) assert.ok(Math.abs(ang(todos[i], todos[j]) - 109.4712206) < 1e-6);
  }
  const x = motor.posiciones(4, 2);
  assert.ok(Math.abs(ang(x.pares[0], x.pares[1]) - 180) < 1e-9, 'AX₄E₂: pares opuestos');
});
test('con ligandos iguales, AX₂, AX₃, AX₄, AX₅, AX₆, AX₂E₃ y AX₄E₂ son apolares; AX₂E, AX₂E₂, AX₃E, AX₄E, AX₃E₂ y AX₅E, polares', () => {
  const apolares = [[2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [2, 3], [4, 2]], polares = [[2, 1], [2, 2], [3, 1], [4, 1], [3, 2], [5, 1]];
  for (const [n, m] of [...apolares, ...polares]) {
    const p = motor.polaridad({ central: 'Xe', ligandos: Array(n).fill('F'), paresLibres: m });
    assert.equal(p.polar, polares.some(q => q[0] === n && q[1] === m), `AX${n}E${m}`);
  }
});
test('la polaridad no cambia al girar la molécula, y el dibujo en 3D (f = 1) da el mismo módulo', () => {
  for (const k of CLAVES) {
    const p = motor.polaridad(k);
    for (const [g, i] of [[0.3, -0.4], [1.7, 0.9], [-2.2, 0.2]]) {
      const d = motor.dibujo(k, { f: 1, giro: g, inclinacion: i });
      assert.ok(Math.abs(d.modulo - p.modulo) < 1e-9, k);
      const t = motor.girar(p.total, g, i);
      for (let c = 0; c < 3; c++) assert.ok(Math.abs(t[c] - d.total[c]) < 1e-9, k);
    }
    const plano = motor.dibujo(k, { f: 0 });
    assert.ok(Math.abs(plano.modulo - p.moduloPlano) < 1e-9, `${k}: plano`);
    for (const l of plano.ligandos) assert.equal(l.pos[2], 0);
  }
});
test('las flechas apuntan al átomo más electronegativo', () => {
  for (const k of CLAVES) {
    const p = motor.polaridad(k), u = motor.posiciones(motor.spec(k).ligandos.length, motor.vsepr(k).m);
    p.enlaces.forEach((e, i) => {
      if (e.dEN !== 0) assert.equal(Math.sign(dot(e.vector, u.ligandos[i])), Math.sign(e.dEN), k);
      const mas = motor.tipoEnlace(motor.spec(k).central, e.simbolo).mas;
      if (e.dEN > 0) assert.equal(mas, e.simbolo, k);
    });
  }
});
test('hibridación y geometría de dominios salen del número de dominios', () => {
  const H = { 2: 'sp', 3: 'sp2', 4: 'sp3', 5: 'sp3d', 6: 'sp3d2' };
  for (const k of CLAVES) { const v = motor.vsepr(k); assert.equal(v.hibridacion, H[v.dominios], k); assert.equal(v.dominios, v.n + v.m); }
});
test('red del NaCl: lado³ iones, alternados, cada vecino es del otro tipo, interiores con 6', () => {
  for (let lado = 1; lado <= 5; lado++) for (const e of ['Na', 'Cl']) {
    const r = motor.redNaCl(lado, e);
    assert.equal(r.Na + r.Cl, lado ** 3); assert.equal(r.moleculas, 0);
    assert.ok(Math.abs(r.Na - r.Cl) <= 1);
    const tipo = q => r.iones.find(x => x.i === q[0] && x.j === q[1] && x.k === q[2]).ion;
    for (const q of r.iones) {
      const v = motor.vecinos(lado, [q.i, q.j, q.k]);
      for (const w of v) assert.notEqual(tipo(w), q.ion);
      const interior = [q.i, q.j, q.k].every(c => c > 0 && c < lado - 1);
      if (interior) assert.equal(v.length, 6);
    }
  }
});
test('tipo de enlace: cortes en 0,4 y 1,7 y el aviso cuando el corte no coincide con la clase de átomos', () => {
  assert.equal(motor.tipoPorCorte(1.7), 'iónico'); assert.equal(motor.tipoPorCorte(1.69), 'covalente polar');
  assert.equal(motor.tipoPorCorte(0.4), 'covalente polar'); assert.equal(motor.tipoPorCorte(0.39), 'covalente apolar');
  for (const [a, b] of [['Na', 'Cl'], ['K', 'F'], ['Mg', 'O'], ['Ca', 'Cl']]) assert.ok(motor.tipoEnlace(a, b).coincide, a + b);
  for (const [a, b] of [['H', 'Cl'], ['C', 'O'], ['N', 'H'], ['Cl', 'Cl']]) assert.ok(motor.tipoEnlace(a, b).coincide, a + b);
  assert.equal(motor.tipoEnlace('H', 'F').coincide, false);
});

// Las predicciones de la escena: ningún error típico da la respuesta correcta, y las opciones son distintas.
test('predicciones de la escena: cada error da algo distinto de la respuesta', () => {
  const n = motor.lewis('NH3'), opsLP = [n.paresLibres, n.errores['libres-valencia-como-enlaces'], n.errores['libres-electrones-como-pares'], n.errores['libres-octeto-todo-libre']];
  assert.equal(new Set(opsLP).size, 4, 'pares libres del NH₃');
  const v = motor.vsepr('NH3'), opsG = [v.geometria, v.errores['dibujo-plano'], v.errores['geometria-de-dominios'], v.errores['par-libre-dobla']];
  assert.equal(new Set(opsG).size, 4, 'forma del NH₃');
  const opsH = [v.hibridacion, v.errores['hibridacion-solo-ligandos'], v.errores['hibridacion-por-electrones'], v.errores['hibridacion-por-subcapas']];
  assert.equal(new Set(opsH).size, 4, 'hibridación del N');
  const c = motor.polaridad('CH2Cl2');
  assert.equal(c.polar, true);
  assert.equal(c.errores['dibujo-plano'], false); assert.equal(c.errores['simetrica-apolar'], false);
  assert.equal(motor.polaridad('CO2').errores['atomos-distintos'], true, 'el contraejemplo: CO₂ tiene átomos distintos');
  assert.equal(motor.polaridad('CO2').polar, false);
  const r = motor.redNaCl(3, 'Cl');
  assert.notEqual(r.errores['pares-como-moleculas'], r.moleculas); assert.notEqual(r.errores['una-molecula-gigante'], r.moleculas);
  // ¿Qué pasa si…?
  const serie = ['CH4', 'CH3Cl', 'CH2Cl2', 'CHCl3', 'CCl4'];
  const quien = f => serie.filter(k => f(motor.polaridad(k))).join(',');
  const ok = quien(p => p.polar), plano = quien(p => p.errores['dibujo-plano']), sim = quien(p => p.errores['simetrica-apolar']), dist = quien(p => p.errores['atomos-distintos']);
  assert.equal(ok, 'CH3Cl,CH2Cl2,CHCl3');
  assert.equal(new Set([ok, plano, sim, dist]).size, 4, 'serie del metano');
  assert.equal(motor.polaridad('SO2').errores['dibujo-plano'], false);
  assert.equal(motor.vsepr('XeF4').errores['cuenta-solo-los-ligandos'], 'tetraédrica');
  assert.notEqual(motor.vsepr('BF3').geometria, motor.vsepr('NH3').geometria);
  assert.equal(motor.resonancia('CO3^2-').cuantas, 3);
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.elemento('Xx'), /desconocido/);
  assert.throws(() => motor.lewis('NO2'), /desconocida/);
  assert.throws(() => motor.lewis({ central: 'N', ligandos: ['O', 'O'] }), /impar/);
  assert.throws(() => motor.lewis({ central: 'C', ligandos: ['H'] }), /2 a 6/);
  assert.throws(() => motor.spec({ central: 'C', ligandos: ['H', 'H'], carga: 5 }), /carga/);
  assert.throws(() => motor.posiciones(3, 3), /sin geometría/);
  assert.throws(() => motor.spec({ central: 'Xe', ligandos: ['F', 'F', 'F', 'F', 'F'], paresLibres: 2 }), /dominios/);
  assert.throws(() => motor.redNaCl(0), /lado/);
  assert.throws(() => motor.vecinos(3, [3, 0, 0]), /fuera/);
  assert.throws(() => motor.spec(42), /no entiendo/);
});

// 4. Problemas de papel (regla 6)
const rutaPapel = path.join(__dirname, 'papel.json');
const papel = fs.existsSync(rutaPapel) ? JSON.parse(fs.readFileSync(rutaPapel, 'utf8')) : null;
test('papel.json: entre 5 y 10 problemas, con respuesta, pasos y verificación', () => {
  assert.ok(papel, 'falta papel.json');
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  const ids = new Set();
  for (const p of papel.problemas) {
    assert.ok(p.id && !ids.has(p.id)); ids.add(p.id);
    assert.ok(p.enunciado && p.respuesta && Array.isArray(p.pasos) && p.pasos.length, `${p.id}: falta texto`);
    assert.ok(Array.isArray(p.verificar) && p.verificar.length, `${p.id}: falta verificar`);
    assert.ok(!/<[a-z]/i.test(p.enunciado + p.respuesta + p.pasos.join('')), `${p.id}: la app muestra texto plano, sin HTML`);
  }
});
for (const p of (papel && papel.problemas) || []) test(`papel ${p.id}: la respuesta coincide con el motor`, () => {
  for (const v of p.verificar) comprobar(v.fn, v.args, v.espera, p.id);
});
