// Pruebas del motor de «La región que se arma». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con sistemas al azar (semilla fija):
//    - la prueba de un punto coincide con a·x + b·y comparado con c; el lado sombreado es el del punto de prueba;
//      el despeje dice lo mismo que la inecuación en puntos al azar, y el error sin invertir dice lo contrario;
//    - el cruce de dos rectas cumple las dos ecuaciones;
//    - cada vértice cumple todas las restricciones y está sobre dos fronteras; están en orden antihorario;
//    - el polígono recortado a una ventana grande tiene los mismos vértices si la región es acotada;
//    - si la región es acotada, ningún punto de la cuadrícula que cumple todo da más que el máximo ni menos que el mínimo,
//      y si es no acotada en un sentido, hay puntos que superan cualquier vértice;
//    - en óptimos múltiples, todos los óptimos dan el mismo z y el punto medio del lado también;
//    - la recta de nivel pasa por su pie, el gradiente es perpendicular a ella y desplazar mueve k como se pide;
//    - NINGÚN ERROR TÍPICO COINCIDE CON LA RESPUESTA CORRECTA (los que coinciden van en 'coinciden').
// 3. Errores de entrada.
// 4. Cada problema de papel.json coincide con el motor.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const motor = require('./motor.js');

const datos = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));
const papel = JSON.parse(fs.readFileSync(path.join(__dirname, 'papel.json'), 'utf8'));
function cerca(real, esperado, que, tol) {
  const t = tol === undefined ? 1e-9 : tol;
  if (Array.isArray(esperado)) { assert.ok(Array.isArray(real), `${que}: se esperaba una lista`); assert.equal(real.length, esperado.length, `${que}: largo`); esperado.forEach((e, k) => cerca(real[k], e, `${que}[${k}]`, t)); return; }
  if (typeof esperado !== 'number') { assert.deepEqual(real, esperado, que); return; }
  assert.ok(typeof real === 'number' && Math.abs(real - esperado) <= t * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
const campo = (r, k) => k.split('.').reduce((o, p) => (o == null ? o : o[p]), r);
function comprobar(fn, args, espera, que) {
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  const r = motor[fn](...args);
  for (const [k, v] of Object.entries(espera)) {
    const x = campo(r, k);
    assert.ok(x !== undefined, `${que}: falta ${k}`);
    cerca(x, v, `${que} · ${k}`);
  }
}

// 1. casos.json
test('casos.json: formato', () => {
  assert.equal(datos.plantilla, 'programacion-lineal');
  assert.ok(datos.casos.length >= 15 && datos.casos.length <= 25);
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera, JSON.stringify(c).slice(0, 80));
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Propiedades
function azar(sem) { let s = (sem >>> 0) || 1; return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296; }
const rnd = azar(2026);
const ent = (a, b) => a + Math.floor((b - a + 1) * rnd());
const N = 300;
const OPS = ['<=', '<', '>=', '>'];
const cumpleNum = ([a, b, op, c], [x, y], cerrada) => {
  const v = a * x + b * y, e = 1e-9;
  if (op === '<=' || (op === '<' && cerrada)) return v <= c + e;
  if (op === '<') return v < c - e;
  if (op === '>=' || (op === '>' && cerrada)) return v >= c - e;
  if (op === '>') return v > c + e;
  return Math.abs(v - c) <= e;
};
const NONEG = [[1, 0, '>=', 0], [0, 1, '>=', 0]];
function restriccionAzar(ops) {
  for (;;) { const a = ent(-4, 5), b = ent(-4, 5); if (a || b) return [a, b, (ops || OPS)[ent(0, (ops || OPS).length - 1)], ent(-6, 24)]; }
}
function sistemaAzar() {
  const n = ent(1, 4), R = [];
  for (let i = 0; i < n; i++) R.push(restriccionAzar(['<=', '>=']));
  return R;
}
const area2 = Ps => Ps.reduce((s, P, i) => { const Q = Ps[(i + 1) % Ps.length]; return s + P[0] * Q[1] - Q[0] * P[1]; }, 0);
const enLinea = ([a, b, , c], [x, y]) => Math.abs(a * x + b * y - c) <= 1e-9;

test('prueba y semiplano: el lado sombreado es el del punto de prueba; el despeje dice lo mismo y el error sin invertir lo contrario', () => {
  for (let k = 0; k < N; k++) {
    const r = restriccionAzar(), P = [ent(-8, 8), ent(-8, 8)];
    const Pr = motor.prueba({ r, P });
    assert.equal(Pr.cumple, cumpleNum(r, P, false), `${JSON.stringify(r)} en ${P}`);
    assert.equal(Pr.izquierda, r[0] * P[0] + r[1] * P[1]);
    const S = motor.semiplano({ r });
    assert.equal(S.trazo, r[2] === '<' || r[2] === '>' ? 'punteada' : 'continua');
    if (r[3] !== 0) assert.equal(S.lado, cumpleNum(r, [0, 0], false) ? 'origen' : 'contrario');
    else assert.equal(S.otraPrueba.cumple, cumpleNum(r, S.otraPrueba.punto, false));
    // el despeje: y (op) m x + q, o x (op) k
    const lee = t => { const m = t.match(/^(x|y) ([≤<≥>]) /); return { v: m[1], op: m[2] }; };
    const D = lee(S.despeje.texto);
    for (let j = 0; j < 6; j++) {
      const Q = [ent(-9, 9) + .5, ent(-9, 9) + .25];
      if (enLinea(r, Q)) continue;
      const lim = D.v === 'y' ? S.despeje.pendiente * Q[0] + S.despeje.corteY : r[3] / r[0], val = D.v === 'y' ? Q[1] : Q[0];
      const dice = (D.op === '≤' || D.op === '<') ? val < lim : val > lim;
      assert.equal(dice, cumpleNum(r, Q, false), `despeje ${S.despeje.texto} de ${S.texto} en ${Q}`);
      if (S.errores.sinInvertir) assert.notEqual(S.errores.sinInvertir.sentido, S.despeje.sentido);
    }
    assert.equal(!!S.errores.sinInvertir || S.noAplica.includes('sinInvertir'), true);
    if ((r[1] < 0) || (r[1] === 0 && r[0] < 0)) assert.ok(S.errores.sinInvertir, 'con divisor negativo hay error sin invertir');
  }
});

test('intersección: el cruce cumple las dos ecuaciones; sus errores no cumplen las dos', () => {
  for (let k = 0; k < N; k++) {
    const r1 = restriccionAzar(), r2 = restriccionAzar(), I = motor.interseccion({ r1, r2 });
    const det = r1[0] * r2[1] - r2[0] * r1[1];
    if (det === 0) { assert.notEqual(I.tipo, 'punto'); continue; }
    assert.ok(enLinea(r1, I.punto) && enLinea(r2, I.punto), `${I.texto}`);
    for (const [n, e] of Object.entries(I.errores)) assert.ok(!(enLinea(r1, e.punto) && enLinea(r2, e.punto)), `el error ${n} no debería ser el cruce`);
  }
});

test('vértices: cumplen todo, están en dos fronteras, van en orden antihorario y el polígono recortado coincide si es acotada', () => {
  let acotadas = 0, abiertas = 0, vacias = 0;
  for (let k = 0; k < N; k++) {
    const R = sistemaAzar(), conNo = rnd() < .7, todas = conNo ? R.concat(NONEG) : R;
    const V = motor.vertices({ restricciones: R, noNegativas: conNo });
    if (V.vacia) { vacias++; assert.equal(V.n, 0);
      // ningún punto de una cuadrícula fina cumple todo
      for (let x = -12; x <= 30; x += 1) for (let y = -12; y <= 30; y += 1) assert.ok(!todas.every(r => cumpleNum(r, [x, y], true)), `vacía pero (${x}; ${y}) cumple`);
      continue; }
    for (const v of V.vertices) {
      assert.ok(todas.every(r => cumpleNum(r, v.punto, true)), `${v.texto} cumple todo`);
      assert.ok(todas.filter(r => enLinea(r, v.punto)).length >= 2, `${v.texto} está en dos fronteras`);
    }
    if (V.n >= 3) assert.ok(area2(V.vertices.map(v => v.punto)) > 0, 'antihorario');
    if (V.acotada) {
      acotadas++;
      const P = motor.poligono({ restricciones: R, noNegativas: conNo, ventana: { x0: -1000, x1: 1000, y0: -1000, y1: 1000 } });
      assert.deepEqual([...P.textos].sort(), [...V.textos].sort(), 'mismo polígono');
    } else abiertas++;
  }
  assert.ok(acotadas > 20 && abiertas > 20 && vacias > 5, `muestra variada: ${acotadas} acotadas, ${abiertas} abiertas, ${vacias} vacías`);
});

test('optimizar: el máximo y el mínimo no se superan en la cuadrícula; no acotado de verdad; los múltiples empatan', () => {
  let multiples = 0, sinFin = 0;
  for (let k = 0; k < N; k++) {
    const R = sistemaAzar(), Z = [ent(-5, 6), ent(-5, 6)];
    if (!Z[0] && !Z[1]) continue;
    const todas = R.concat(NONEG), z = P => Z[0] * P[0] + Z[1] * P[1];
    for (const sentido of ['max', 'min']) {
      const O = motor.optimizar({ restricciones: R, noNegativas: true, objetivo: Z, sentido });
      if (O.tipo === 'vacia') continue;
      const mejor = sentido === 'max' ? (a, b) => a > b + 1e-9 : (a, b) => a < b - 1e-9;
      if (O.tipo === 'noAcotado') {
        sinFin++;
        // hay un punto factible que supera a todos los vértices
        const vmax = O.tabla.reduce((m, f) => (mejor(f.valor, m) ? f.valor : m), O.tabla.length ? O.tabla[0].valor : 0);
        let hay = false;
        for (let x = 0; x <= 160 && !hay; x++) for (let y = 0; y <= 160 && !hay; y++) if (todas.every(r => cumpleNum(r, [x, y], true)) && mejor(z([x, y]), vmax)) hay = true;
        assert.ok(hay, `no acotado: ${JSON.stringify(R)} ${Z} ${sentido}`);
        continue;
      }
      for (let x = 0; x <= 30; x++) for (let y = 0; y <= 30; y++) if (todas.every(r => cumpleNum(r, [x, y], true)))
        assert.ok(!mejor(z([x, y]), O.valor), `(${x}; ${y}) da ${z([x, y])}, mejor que ${O.valor}`);
      for (const t of O.optimos) assert.ok(O.tabla.find(f => f.texto === t).valor === O.valor);
      if (O.tipo === 'multiple') { multiples++;
        const M = [(O.lado[0][0] + O.lado[1][0]) / 2, (O.lado[0][1] + O.lado[1][1]) / 2]; cerca(z(M), O.valor, 'punto medio del lado'); }
      // ningún error coincide con la respuesta
      for (const [n, e] of Object.entries(O.errores)) {
        if (O.tipo === 'unico') assert.notEqual(e.texto, O.optimoTexto, `el error ${n} coincide con el óptimo`);
      }
    }
  }
  assert.ok(sinFin > 10 && multiples > 0, `muestra: ${sinFin} sin fin, ${multiples} múltiples`);
});

test('recta de nivel y desplazamiento: el pie está en la recta, el gradiente es perpendicular y el vector mueve k', () => {
  for (let k = 0; k < N; k++) {
    const Z = [ent(-6, 6), ent(-6, 6)]; if (!Z[0] && !Z[1]) continue;
    const k1 = ent(-50, 50), k2 = ent(-50, 50), L = motor.rectaNivel({ objetivo: Z, k: k1 });
    cerca(Z[0] * L.pie[0] + Z[1] * L.pie[1], k1, 'pie');
    if (!L.vertical) { cerca(L.pendiente, -Z[0] / Z[1], 'pendiente −a/b'); cerca(L.gradiente[0] * 1 + L.gradiente[1] * L.pendiente, 0, 'perpendicular'); }
    for (const e of Object.values(L.errores)) if (e.texto !== 'contra') assert.notEqual(e.texto, L.pendienteTexto);
    const D = motor.desplazar({ objetivo: Z, k1, k2 });
    cerca(Z[0] * (L.pie[0] + D.vector[0]) + Z[1] * (L.pie[1] + D.vector[1]), k2, 'el pie movido llega a k2');
    cerca(Math.hypot(...D.vector), D.distancia, 'distancia');
  }
});

test('traducir: ningún error coincide con la traducción y las listas no se pisan', () => {
  const frases = ['a lo más', 'al menos', 'menos de', 'más de', 'como máximo', 'exactamente'];
  for (let k = 0; k < 100; k++) {
    const T = motor.traducir({ porUnidad: [ent(1, 6), ent(1, 6)], total: ent(5, 40), frase: frases[ent(0, frases.length - 1)] });
    for (const e of Object.values(T.errores)) assert.notEqual(e.texto, T.texto);
    const textos = Object.values(T.errores).map(e => e.texto); assert.equal(new Set(textos).size, textos.length);
  }
});

test('redundante: quitar una restricción redundante no cambia el óptimo', () => {
  for (let k = 0; k < N; k++) {
    const R = sistemaAzar(); if (R.length < 2) continue;
    const i = ent(0, R.length - 1), Rd = motor.redundante({ restricciones: R, noNegativas: true, indice: i });
    if (!Rd.redundante) continue;
    const Z = [ent(1, 5), ent(1, 5)];
    const A = motor.optimizar({ restricciones: R, noNegativas: true, objetivo: Z }), B = motor.optimizar({ restricciones: R.filter((_, j) => j !== i), noNegativas: true, objetivo: Z });
    assert.equal(A.tipo, B.tipo); assert.equal(A.valor, B.valor);
  }
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.semiplano({ r: [0, 0, '<=', 3] }), /no pueden ser los dos cero/);
  assert.throws(() => motor.semiplano({ r: [1, 1, '<>', 3] }), /signo/);
  assert.throws(() => motor.optimizar({ restricciones: [], objetivo: [1, 1] }), /faltan/);
  assert.throws(() => motor.optimizar({ restricciones: [[1, 1, '<=', 3]], objetivo: [1, 1], sentido: 'mayor' }), /sentido/);
  assert.throws(() => motor.prueba({ r: [1, 1, '<=', 3], P: [1] }), /\[x, y\]/);
  assert.throws(() => motor.traducir({ porUnidad: [1, 2], total: 3, frase: 'quizás' }), /frase/);
  assert.throws(() => motor.poligono({ restricciones: [[1, 1, '<=', 3]] }), /ventana/);
  assert.throws(() => motor.redundante({ restricciones: [[1, 1, '<=', 3]], indice: 4 }), /indice/);
  assert.throws(() => motor.evaluar({ objetivo: [1, NaN], P: [0, 0] }), /número/);
});

// 4. papel.json
test('papel.json: formato y cantidad', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 8 && papel.problemas.length <= 10);
  for (const p of papel.problemas) assert.ok(p.id && p.nivel && p.enunciado && p.respuesta && p.pasos.length >= 2 && p.verificar.length >= 1, p.id);
});
for (const p of papel.problemas) test(`papel ${p.id}: ${p.respuesta}`, () => {
  for (const v of p.verificar) comprobar(v.fn, v.args, v.espera, p.id);
});
