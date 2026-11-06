// Pruebas del motor de Soluciones. Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades: la concentración es intensiva al sacar una parte (SO10); los moles se conservan al
//    diluir (SO11); la mezcla queda entre las dos concentraciones; masa de solución = soluto + solvente
//    (SO3, SO16); las fracciones molares suman 1; N = M·θ; los cuadros y puntos cuentan lo mismo que M.
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
  if (Array.isArray(esperado)) { assert.equal(real.length, esperado.length, `${que}: largo`); esperado.forEach((e, k) => cerca(real[k], e, `${que}[${k}]`, t)); return; }
  if (typeof esperado !== 'number') { assert.deepEqual(real, esperado, que); return; }
  assert.ok(Math.abs(real - esperado) <= t * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
function llamar(fn, args) {
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  return motor[fn](...args);
}
const campo = (r, k) => (k === 'valor' ? r : k.split('.').reduce((o, p) => (o == null ? o : o[p]), r));
function comprobar(fn, args, espera, que) {
  const r = llamar(fn, args);
  for (const [k, v] of Object.entries(espera)) {
    const x = campo(r, k);
    assert.ok(x !== undefined, `${que}: falta ${k}`);
    cerca(x, v, `${que} · ${k}`);
  }
}

// 1. casos.json
test('casos.json: formato', () => {
  assert.equal(datos.plantilla, 'soluciones');
  assert.ok(datos.casos.length >= 15);
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera, JSON.stringify(c).slice(0, 80));
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(c.fn, t.args, t.espera, c.nombre);
});

// 2. Propiedades, con valores al azar (semilla fija)
const rnd = motor.azar(2026);
const al = (a, b) => a + (b - a) * rnd();
test('SO10: al sacar una parte, lo que queda y lo que se saca tienen la misma concentración', () => {
  for (let k = 0; k < 300; k++) {
    const M = al(0.01, 12), V = al(10, 3000), s = al(0, V * 0.999), r = motor.sacar(M, V, s);
    if (r.queda.mL > 1e-6) cerca(r.queda.M, M, 'queda');
    if (s > 1e-6) cerca(r.sacado.M, M, 'sacado');
    cerca(r.queda.n + r.sacado.n, M * V / 1000, 'los moles se reparten');
    const e = motor.aplicar({ n: M * V / 1000, mL: V }, { tipo: 'sacar', mL: s });
    cerca(e.M, M, 'explorador'); assert.equal(e.cambia.M, 'igual');
  }
});
test('SO10 en cuadros y puntos: al sacar cuadros enteros, los que quedan tienen los mismos puntos por cuadro', () => {
  const esc = { mLporCuadro: 25, MporPunto: 0.5 };
  for (let c = 2; c <= 20; c++) for (let p = 1; p <= 8; p++) for (let s = 1; s < c; s++) {
    const V = c * 25, M = p * 0.5, n = M * V / 1000, r = motor.sacar(M, V, s * 25);
    cerca(motor.modelo(r.queda.n, r.queda.mL, esc).porCuadro, motor.modelo(n, V, esc).porCuadro, `c=${c} p=${p} s=${s}`);
  }
});
test('SO11: al diluir, los moles se conservan y C1·V1 = C2·V2', () => {
  for (let k = 0; k < 300; k++) {
    const M1 = al(0.01, 18), V1 = al(1, 1000), V2 = V1 + al(0, 4000), r = motor.diluir(M1, V1, V2);
    cerca(r.n, M1 * V1 / 1000, 'n antes'); cerca(r.M2 * V2 / 1000, r.n, 'n después'); cerca(M1 * V1, r.M2 * V2, 'C1V1 = C2V2');
    assert.ok(r.M2 <= M1 + 1e-12, 'diluir nunca concentra');
    cerca(r.agua, V2 - V1, 'agua');
  }
  // En el modelo, diluir agrega cuadros vacíos de soluto: los puntos totales no cambian.
  const esc = { mLporCuadro: 25, MporPunto: 0.5 };
  for (let c1 = 1; c1 <= 6; c1++) for (let c2 = c1; c2 <= 20; c2++) for (let p = 1; p <= 12; p++) {
    const V1 = c1 * 25, V2 = c2 * 25, M1 = p * 0.5, d = motor.diluir(M1, V1, V2);
    const antes = motor.modelo(d.n, V1, esc), despues = motor.modelo(d.n, V2, esc);
    assert.equal(despues.puntos, antes.puntos, 'los mismos puntos');
    cerca(despues.porCuadro, antes.porCuadro * V1 / V2, 'menos puntos por cuadro');
  }
});
test('la mezcla queda entre las dos concentraciones y suma moles y volúmenes', () => {
  for (let k = 0; k < 300; k++) {
    const a = [al(0, 10), al(1, 1000)], b = [al(0, 10), al(1, 1000)], r = motor.mezclar([a, b]);
    assert.ok(r.M >= Math.min(a[0], b[0]) - 1e-9 && r.M <= Math.max(a[0], b[0]) + 1e-9, `${r.M} fuera de [${a[0]}, ${b[0]}]`);
    cerca(r.n, (a[0] * a[1] + b[0] * b[1]) / 1000, 'n'); cerca(r.mL, a[1] + b[1], 'V');
    if (Math.abs(a[1] - b[1]) < 1e-9) cerca(r.M, r.errores.promedioSimple, 'con volúmenes iguales, el promedio simple sí vale');
  }
  // con volúmenes distintos y concentraciones distintas, el promedio simple falla
  assert.notEqual(motor.mezclar([[2, 100], [1, 300]]).M, motor.mezclar([[2, 100], [1, 300]]).errores.promedioSimple);
});
test('SO3 y SO16: masa de solución = soluto + solvente; las fracciones molares suman 1', () => {
  for (const f of ['NaCl', 'NaOH', 'C6H12O6', 'H2SO4', 'C12H22O11', 'CH3COOH']) for (let k = 0; k < 40; k++) {
    const g = al(0.1, 200), gs = al(1, 2000), r = motor.solucion({ soluto: f, g, gSolvente: gs });
    cerca(r.gSolucion, g + gs, `${f} masa`);
    cerca(r.xSoluto + r.xSolvente, 1, `${f} x`);
    assert.ok(r.pctMasa < 100 && r.pctMasa < r.errores.pctSobreSolvente, '% sobre la solución es menor que sobre el solvente');
    assert.ok(r.molalidad > r.errores.molalidadConSolucion, 'dividir entre la solución da menos que entre el solvente');
    // con la densidad: la masa de solución sale de ρ·V y el solvente es lo que falta
    const d = motor.solucion({ soluto: f, g, mL: (g + gs) / 1.1, densidad: 1.1 });
    cerca(d.gSolucion, g + gs, `${f} con densidad`); cerca(d.gSolvente, gs, `${f} solvente`);
  }
});
test('SO15: N = M·θ y equivalentes = n·θ', () => {
  for (const [f, th] of [['HCl', 1], ['H2SO4', 2], ['NaOH', 1], ['Ca(OH)2', 2]]) for (let k = 0; k < 20; k++) {
    const g = al(0.5, 100), V = al(50, 2000), r = motor.solucion({ soluto: f, g, mL: V, theta: th });
    cerca(r.N, r.M * th, `${f} N`); cerca(r.eq, r.n * th, `${f} eq`); cerca(r.eq / r.L, r.N, `${f} eq/L`);
  }
});
test('SO7/SO9: con los mismos moles, la más concentrada ocupa menos volumen', () => {
  const lista = [0.8, 1.6, 4].map(M => motor.volumenPara(0.2, M));
  assert.deepEqual([...lista].sort((a, b) => a - b), [...lista].reverse());
});
test('los cuatro cambios del explorador: qué sube, qué baja y qué se queda', () => {
  const e = { n: 0.2, mL: 100 };
  const c = a => motor.aplicar(e, a).cambia;
  assert.deepEqual(c({ tipo: 'soluto', n: 0.1 }), { n: 'sube', V: 'igual', M: 'sube' });
  assert.deepEqual(c({ tipo: 'agua', mL: 50 }), { n: 'igual', V: 'sube', M: 'baja' });
  assert.deepEqual(c({ tipo: 'sacar', mL: 50 }), { n: 'baja', V: 'baja', M: 'igual' });
  assert.deepEqual(c({ tipo: 'mezclar', M: 2, mL: 50 }), { n: 'sube', V: 'sube', M: 'igual' });
  assert.deepEqual(c({ tipo: 'mezclar', M: 1, mL: 50 }), { n: 'sube', V: 'sube', M: 'baja' });
  // una cadena larga de cambios se puede rehacer con las funciones sueltas
  let s = { n: 0.1, mL: 50 };
  s = motor.aplicar(s, { tipo: 'agua', mL: 150 }); cerca(s.M, motor.diluir(2, 50, 200).M2, 'agua = diluir');
  s = motor.aplicar(s, { tipo: 'mezclar', M: 3, mL: 100 }); cerca(s.M, motor.mezclar([[0.5, 200], [3, 100]]).M, 'mezclar');
  s = motor.aplicar(s, { tipo: 'soluto', n: 0.05 }); cerca(s.M, motor.agregarSoluto(motor.mezclar([[0.5, 200], [3, 100]]).M, 300, 0.05).M, 'soluto');
});
test('cuadros y puntos: el reparto suma todos los puntos, con a lo más uno de diferencia, y se repite con la misma semilla', () => {
  for (let c = 1; c <= 24; c++) for (let p = 0; p <= 120; p += 7) for (const sem of [1, 5, 99]) {
    const r = motor.repartir(p, c, sem);
    assert.equal(r.length, c); assert.equal(r.reduce((s, x) => s + x, 0), p);
    assert.ok(Math.max(...r) - Math.min(...r) <= 1, `${p} en ${c}`);
    assert.deepEqual(r, motor.repartir(p, c, sem));
    const u = motor.ubicar(p, c, sem);
    assert.equal(u.length, p);
    for (const q of u) assert.ok(q.c >= 0 && q.c < c && q.u >= 0.1 && q.u <= 0.9 && q.v >= 0.1 && q.v <= 0.9);
    assert.deepEqual(u, motor.ubicar(p, c, sem));
    for (let k = 0; k < c; k++) assert.equal(u.filter(q => q.c === k).length, r[k], 'ubicar respeta el reparto');
  }
});
test('cuadros y puntos: puntos por cuadro = M / (M de un punto), y la lupa cuenta lo mismo', () => {
  for (const esc of [{ mLporCuadro: 25, MporPunto: 0.5 }, { mLporCuadro: 125, MporPunto: 0.1 }, { mLporCuadro: 250, MporPunto: 0.5 }]) {
    for (let c = 1; c <= 12; c++) for (let p = 0; p <= 60; p += 3) {
      const mL = c * esc.mLporCuadro, n = p * esc.MporPunto * esc.mLporCuadro / 1000, m = motor.modelo(n, mL, esc);
      assert.equal(m.cuadros, c); assert.equal(m.puntos, p);
      cerca(m.porCuadro, m.M / esc.MporPunto, 'porCuadro'); cerca(motor.lupa(m.M, esc), m.porCuadro, 'lupa');
    }
  }
});

test('cuadros y puntos en el explorador: si el soluto no da puntos enteros, se redondea y se avisa', () => {
  const esc = { mLporCuadro: 50, MporPunto: 0.5 };
  // 0,25 mol en 300 mL; se sacan 100 mL: quedan 0,1667 mol = 6,67 puntos de 0,025 mol
  const e = motor.aplicar({ n: 0.25, mL: 300 }, { tipo: 'sacar', mL: 100 }), m = motor.modelo(e.n, e.mL, esc, { redondear: true });
  assert.equal(m.puntos, 7); assert.equal(m.exacto, false); cerca(m.puntosExactos, 20 / 3, 'exactos');
  assert.equal(motor.modelo(0.2, 100, esc, { redondear: true }).exacto, true);
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.masaMolar('Xx2'), /inválida|sin masa/);
  assert.throws(() => motor.masaMolar('Ca(OH2'), /cerrada/);
  assert.throws(() => motor.masaMolar(''), /vacía/);
  assert.throws(() => motor.solucion({ soluto: 'NaCl', g: -5, mL: 100 }), /negativo/);
  assert.throws(() => motor.solucion({ soluto: 'NaCl', g: 5, mL: 0 }), /mayor que cero/);
  assert.throws(() => motor.solucion({ g: 5, mL: 100 }), /soluto/);
  assert.throws(() => motor.solucion({ soluto: 'NaCl', mL: 100 }), /cantidad de soluto/);
  assert.throws(() => motor.solucion({ soluto: 'H2SO4', g: 49, mL: 500, theta: 1.5 }), /θ/);
  assert.throws(() => motor.solucion({ soluto: 'H2SO4', g: 49, mL: 500, theta: 0 }), /θ/);
  assert.throws(() => motor.solucion({ soluto: 'NaCl', g: 200, mL: 100, densidad: 1.1 }), /supera/);
  assert.throws(() => motor.solucion({ soluto: 'NaCl', g: 'diez', mL: 100 }), /número/);
  assert.throws(() => motor.diluir(6, 200, 50), /menor que el inicial/);
  assert.throws(() => motor.diluir(6, 0, 50), /mayor que cero/);
  assert.throws(() => motor.mezclar([[2, 100]]), /dos soluciones/);
  assert.throws(() => motor.mezclar([[2, 100], [1, -5]]), /mayor que cero/);
  assert.throws(() => motor.sacar(1, 100, 150), /más de lo que hay/);
  assert.throws(() => motor.aplicar({ n: 0.1, mL: 100 }, { tipo: 'sacar', mL: 100 }), /toda la solución/);
  assert.throws(() => motor.aplicar({ n: 0.1, mL: 100 }, { tipo: 'hervir' }), /desconocido/);
  assert.throws(() => motor.volumenPara(0.2, 0), /mayor que cero/);
  assert.throws(() => motor.modelo(0.3, 60, { mLporCuadro: 25, MporPunto: 0.5 }), /entero/);
  assert.throws(() => motor.modelo(0.31, 50, { mLporCuadro: 25, MporPunto: 0.5 }), /entero/);
  assert.throws(() => motor.modelo(0.3, 50, { mLporCuadro: 0, MporPunto: 0.5 }), /mayor que cero/);
  assert.throws(() => motor.modelo(0.3, 60, { mLporCuadro: 25, MporPunto: 0.5 }, { redondear: true }), /entero/);
  assert.throws(() => motor.modelo(0.3, 50), /escala/);
  assert.throws(() => motor.repartir(2.5, 4, 1), /enteros/);
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
    assert.ok(!/\d\.\d/.test(p.enunciado + p.respuesta + p.pasos.join('')), `${p.id}: se escribe con coma decimal`);
  }
});
for (const p of (papel && papel.problemas) || []) test(`papel ${p.id}: la respuesta coincide con el motor`, () => {
  for (const v of p.verificar) comprobar(v.fn, v.args, v.espera, p.id);
});
