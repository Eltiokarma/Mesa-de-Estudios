// Pruebas del motor de «La sierra y la balanza». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con números al azar (semilla fija):
//    - en una forma abierta, piezas = cortes + 1; en una cerrada con al menos un corte, piezas = cortes; los largos suman el total;
//    - estacas: en la línea abierta siempre una más que en el contorno cerrado de la misma longitud;
//    - la soga doblada da capas·cortes + 1 pedazos, y otra simulación (se dobla punto por punto) da los mismos puntos;
//    - apilando, el mínimo de cortes es ⌈log₂ n⌉ y cada corte del plan a lo más duplica los pedazos;
//    - con 1, 3, 9… (potencias de 3) se pesa toda masa de 1 a la suma, y el acomodo del motor equilibra de verdad;
//      con pesas al azar, pesar encuentra solución justo para las masas de masasMedibles;
//    - la estrategia de tres grupos encuentra la falsa en cada posición posible sin pasar de ⌈log₃ n⌉ pesadas,
//      y el árbol de decisión más bajo tiene esa altura (3^(k−1) < n ≤ 3^k);
//    - NINGÚN ERROR TÍPICO COINCIDE CON LA RESPUESTA (los que coinciden van en 'coinciden' y sí dan lo mismo).
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
  if (Array.isArray(esperado)) { assert.ok(Array.isArray(real), `${que}: no es lista`); assert.equal(real.length, esperado.length, `${que}: largo`); esperado.forEach((e, k) => cerca(real[k], e, `${que}[${k}]`, t)); return; }
  if (esperado && typeof esperado === 'object') {
    assert.ok(real && typeof real === 'object', `${que}: no es objeto`);
    assert.deepEqual(Object.keys(real).sort(), Object.keys(esperado).sort(), `${que}: claves`);
    for (const [k, v] of Object.entries(esperado)) cerca(real[k], v, `${que}.${k}`, t);
    return;
  }
  if (typeof esperado !== 'number') { assert.deepEqual(real, esperado, que); return; }
  assert.ok(typeof real === 'number' && Math.abs(real - esperado) <= t * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
function llamar(fn, args) {
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  return motor[fn](...args);
}
const campo = (r, k) => k.split('.').reduce((o, p) => (o == null ? o : o[p]), r);
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
  assert.equal(datos.plantilla, 'cortes-pesadas');
  assert.ok(datos.casos.length >= 16 && datos.casos.length <= 22);
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera, JSON.stringify(c).slice(0, 80));
  assert.ok(datos.casos.some(c => c.tambien && c.tambien.length), 'algún caso trae «tambien»');
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Propiedades
let semilla = 2026;
const rnd = () => (semilla = (Math.imul(semilla, 1664525) + 1013904223) >>> 0) / 4294967296;
const ent = (a, b) => Math.floor(a + (b - a + 1) * rnd());
const N = 300;
const igual = (a, b) => JSON.stringify(a) === JSON.stringify(b);
function sinChoques(R, correcto, que) {
  assert.ok(R.errores && typeof R.errores === 'object', `${que}: falta errores`);
  assert.ok(Array.isArray(R.coinciden), `${que}: falta coinciden`);
  assert.ok(R.repetidos && typeof R.repetidos === 'object', `${que}: falta repetidos`);
  for (const [k, v] of Object.entries(R.errores)) assert.ok(!igual(v, correcto), `${que}: el error ${k} da la respuesta (${JSON.stringify(v)})`);
  const vs = Object.values(R.errores).map(v => JSON.stringify(v));
  assert.equal(new Set(vs).size, vs.length, `${que}: dos errores dan lo mismo`);
}
// una lista de k posiciones enteras distintas entre lo y hi (inclusive)
function distintas(k, lo, hi) { const s = new Set(); while (s.size < k) s.add(ent(lo, hi)); return [...s]; }

test('forma abierta: piezas = cortes + 1 para muchos valores; los largos suman el total', () => {
  for (let k = 0; k < N; k++) {
    const L = ent(2, 60), c = ent(0, L - 1), xs = distintas(c, 1, L - 1);
    const R = motor.contarPiezas({ forma: 'abierta', largo: L, cortes: xs });
    assert.equal(R.cortes, c); assert.equal(R.piezas, c + 1, `${c} cortes en ${L} m`);
    cerca(R.largos.reduce((s, v) => s + v, 0), L, 'suma');
    assert.ok(R.largos.every(v => v > 0));
  }
});
test('forma cerrada: piezas = cortes (con al menos un corte); los largos suman el contorno', () => {
  for (let k = 0; k < N; k++) {
    const L = ent(2, 60), c = ent(1, L), xs = distintas(c, 0, L - 1);
    const R = motor.contarPiezas({ forma: 'cerrada', largo: L, cortes: xs });
    assert.equal(R.piezas, c, `${c} cortes en un aro de ${L} m`);
    cerca(R.largos.reduce((s, v) => s + v, 0), L, 'suma');
    assert.equal(R.entera, false);
  }
  assert.equal(motor.contarPiezas({ forma: 'cerrada', largo: 5, cortes: [] }).piezas, 1);
});
test('cortar en piezas iguales: coincide con contar las piezas de sus posiciones; el tiempo es cortes × minutos', () => {
  for (let k = 0; k < N; k++) {
    const t = ent(1, 8) / ent(1, 2), p = ent(1, 30), f = rnd() < .5 ? 'abierta' : 'cerrada', mi = ent(1, 9);
    const R = motor.cortar({ forma: f, largo: t * p, tramo: t, minutos: mi });
    assert.equal(R.piezas, p);
    assert.equal(R.cortes, f === 'abierta' ? p - 1 : p);
    const C = motor.contarPiezas({ forma: f, largo: t * p, cortes: R.posiciones });
    assert.equal(C.cortes, R.cortes);
    if (R.cortes) { assert.equal(C.piezas, p); C.largos.forEach(v => cerca(v, t, 'tramo')); }
    cerca(R.tiempo, R.cortes * mi, 'tiempo');
    sinChoques(R, R.cortes, `cortar ${f} ${p}`);
    for (const [nom, v] of Object.entries(R.erroresTiempo)) cerca(v, R.errores[nom] * mi, nom);
  }
});
test('tiempo para más piezas: es (piezas − 1) × minutos por corte, no proporcional a las piezas', () => {
  for (let k = 0; k < N; k++) {
    const p = ent(2, 10), mi = ent(1, 40), q = ent(1, 20), R = motor.tiempoCortes({ piezas: p, minutos: mi, piezasNuevas: q });
    cerca(R.tiempo, (q - 1) * mi / (p - 1), 'tiempo');
    sinChoques(R, R.tiempo, 'tiempo');
    if (q === p) assert.deepEqual(R.coinciden, ['lineal']);
  }
});
test('estacas: la línea abierta lleva una más que el contorno cerrado de la misma longitud', () => {
  for (let k = 0; k < N; k++) {
    const s = ent(1, 10), t = ent(1, 40);
    const A = motor.estacas({ forma: 'abierta', largo: s * t, separacion: s }), C = motor.estacas({ forma: 'cerrada', largo: s * t, separacion: s });
    assert.equal(A.estacas, t + 1); assert.equal(C.estacas, t); assert.equal(A.estacas - C.estacas, 1);
    sinChoques(A, A.estacas, 'abierta');
    sinChoques(C, C.estacas, 'cerrada');
    const P = motor.compararEstacas({ largo: s * t, separacion: s });
    assert.deepEqual(P.respuesta, [A.estacas, C.estacas]);
    sinChoques(P, P.respuesta, 'par');
    // las estacas en un contorno cerrado son los cortes de un aro en tramos iguales; en la línea, cortes + 2 extremos
    assert.equal(C.estacas, motor.cortar({ forma: 'cerrada', largo: s * t, tramo: s }).cortes);
    assert.equal(A.estacas, motor.cortar({ largo: s * t, tramo: s }).cortes + 2);
  }
});
// otra forma de doblar: sigue la soga cada 25 cm y anota en qué capa y a qué altura del atado queda cada punto
function puntosDoblando(L, capas, xs) {
  const s = L / capas, out = [];
  for (let i = 0; i <= 4 * L; i++) {
    const u = i / 4, j = Math.min(capas - 1, Math.floor(u / s)), dentro = u - j * s, alto = j % 2 ? s - dentro : dentro;
    for (const x of xs) if (Math.abs(alto - x) < 1e-9) out.push(Math.round(u * 1e6) / 1e6);
  }
  return [...new Set(out)].sort((a, b) => a - b);
}
test('soga doblada: capas · cortes + 1 pedazos; otra simulación da los mismos puntos', () => {
  for (let k = 0; k < 120; k++) {
    const capas = ent(1, 5), s = ent(2, 8), c = ent(1, s - 1), L = capas * s;
    const xs = distintas(c, 1, s - 1).map(v => v / 1);
    const R = motor.sogaDoblada({ largo: L, capas, posiciones: xs });
    assert.equal(R.piezas, capas * c + 1, `${capas} capas, ${c} cortes`);
    assert.deepEqual(R.puntos, puntosDoblando(L, capas, xs));
    cerca(R.largos.reduce((a, b) => a + b, 0), L, 'suma');
    sinChoques(R, R.piezas, 'soga');
  }
});
test('apilando: el mínimo es ⌈log₂ n⌉; el plan termina en n pedazos de 1 m y cada corte a lo más duplica', () => {
  for (let n = 1; n <= 16; n++) {
    const R = motor.cortesApilando({ piezas: n });
    assert.equal(R.minimo, Math.ceil(Math.log2(n)), `n = ${n}`);
    assert.equal(R.cota, R.minimo);
    assert.equal(R.plan.length, R.minimo);
    let antes = 1;
    for (const ronda of R.plan) {
      assert.equal(ronda.reduce((a, b) => a + b, 0), n, 'el plan conserva el largo');
      assert.ok(ronda.length <= 2 * antes, 'a lo más duplica'); antes = ronda.length;
    }
    if (n > 1) assert.deepEqual(R.plan[R.plan.length - 1], new Array(n).fill(1));
    sinChoques(R, R.minimo, `apilar ${n}`);
  }
});
test('balanza: con potencias de 3 se pesa todo de 1 a la suma, y el acomodo del motor equilibra', () => {
  for (let k = 1; k <= 5; k++) {
    const pesas = Array.from({ length: k }, (_, i) => Math.pow(3, i)), suma = (Math.pow(3, k) - 1) / 2;
    const M = motor.masasMedibles({ pesas });
    assert.equal(M.suma, suma); assert.equal(M.alcance, suma); assert.ok(M.completo);
    assert.deepEqual(M.masas, Array.from({ length: suma }, (_, i) => i + 1));
    for (let m = 1; m <= suma; m++) {
      const P = motor.pesar({ pesas, masa: m });
      assert.ok(P.posible, `${m} kg`); assert.equal(P.formas, 1, 'con potencias de 3 la forma es única');
      assert.equal(motor.equilibrio({ pesas, masa: m, junto: P.junto, otro: P.otro }).estado, 'equilibrio');
      assert.equal(P.junto.length + P.otro.length + P.fuera.length, k);
    }
    assert.equal(motor.pesar({ pesas, masa: suma + 1 }).posible, false);
    sinChoques(M, M.cuantas, `potencias de 3 (${k})`);
  }
  // con una pesa más de 3^k, el alcance sube a (3^(k+1) − 1)/2
  const A = motor.agregarPesa({ pesas: [1, 3, 9, 27], nueva: 81 });
  assert.equal(A.despues, 121); sinChoques(A, A.despues, 'agregar 81');
});
test('balanza con pesas al azar: pesar encuentra solución justo para las masas de masasMedibles', () => {
  for (let k = 0; k < 60; k++) {
    const pesas = Array.from({ length: ent(1, 5) }, () => ent(1, 12)), M = motor.masasMedibles({ pesas });
    const suma = pesas.reduce((a, b) => a + b, 0);
    for (let m = 1; m <= suma + 1; m++) {
      const P = motor.pesar({ pesas, masa: m });
      assert.equal(P.posible, M.masas.includes(m), `${pesas} · ${m}`);
      if (P.posible) assert.equal(motor.equilibrio({ pesas, masa: m, junto: P.junto, otro: P.otro }).estado, 'equilibrio');
    }
    for (let m = 1; m <= M.alcance; m++) assert.ok(M.masas.includes(m));
    assert.ok(!M.masas.includes(M.alcance + 1));
    for (const u of M.unPlatillo) assert.ok(M.masas.includes(u), 'lo que se pesa con un platillo también con dos');
    sinChoques(M, M.cuantas, `pesas ${pesas}`);
  }
});
test('moneda falsa: tres grupos la encuentran en cada posición sin pasar de ⌈log₃ n⌉; el árbol más bajo tiene esa altura', () => {
  for (let n = 3; n <= 100; n++) {
    let k = 0; while (Math.pow(3, k) < n) k++;
    for (let f = 1; f <= n; f++) {
      const S = motor.simularPesadas({ monedas: n, falsa: f });
      assert.equal(S.encontrada, f, `n = ${n}, falsa ${f}`);
      assert.ok(S.cuantas <= k);
      for (const p of S.pasos) assert.equal(p.izquierda.length, p.derecha.length, 'platillos con igual número de monedas');
      const H = motor.simularPesadas({ monedas: n, falsa: f, estrategia: 'mitades' });
      assert.equal(H.encontrada, f);
    }
    const M = motor.minimoPesadas({ monedas: n });
    assert.equal(M.pesadas, k, `n = ${n}`); assert.equal(M.cota, k); assert.equal(M.tercios, k);
    assert.ok(Math.pow(3, M.pesadas - 1) < n && n <= Math.pow(3, M.pesadas), 'cada pesada tiene tres resultados');
    assert.equal(M.mitades, Math.floor(Math.log2(n) + 1e-12), 'las mitades dan ⌊log₂ n⌋');
    sinChoques(M, M.pesadas, `monedas ${n}`);
  }
});
test('las opciones de las predicciones de la escena son distintas entre sí y de la correcta', () => {
  const dist = (xs, que) => assert.equal(new Set(xs.map(x => JSON.stringify(x))).size, xs.length, `${que}: ${JSON.stringify(xs)}`);
  const P1 = motor.cortar({ largo: 12, tramo: 2, minutos: 3 }); dist([P1.tiempo, ...Object.values(P1.erroresTiempo)], 'paso 1');
  const P3 = motor.compararEstacas({ largo: 60, separacion: 5 }); dist([P3.respuesta, ...Object.values(P3.errores)], 'paso 3');
  const P4 = motor.sogaDoblada({ largo: 6, capas: 3, posiciones: [0.5, 1.5] }); dist([P4.piezas, ...Object.values(P4.errores)], 'paso 4');
  const P5 = motor.masasMedibles({ pesas: [1, 3, 9] }); dist([P5.cuantas, ...Object.values(P5.errores)], 'paso 5');
  const P7 = motor.minimoPesadas({ monedas: 9 }); dist([P7.pesadas, ...Object.values(P7.errores)], 'paso 7');
  const E1 = motor.tiempoCortes({ piezas: 3, minutos: 6, piezasNuevas: 6 }); dist([E1.tiempo, ...Object.values(E1.errores)], 'experimento 1');
  const E2 = motor.cortar({ forma: 'cerrada', largo: 12, tramo: 2, minutos: 3 }); dist([E2.tiempo, E2.erroresTiempo.comoAbierta, E2.erroresTiempo.masUno], 'experimento 2');
  const E3 = motor.cortesApilando({ piezas: 8 }); dist([E3.minimo, ...Object.values(E3.errores)], 'experimento 3');
  const E4 = motor.agregarPesa({ pesas: [1, 3, 9], nueva: 27 }); dist([E4.despues, ...Object.values(E4.errores)], 'experimento 4');
  const E5 = motor.minimoPesadas({ monedas: 27 }); dist([E5.pesadas, ...Object.values(E5.errores)], 'experimento 5');
  // todo lo que se muestra como opción es entero
  for (const v of [P1.tiempo, ...Object.values(P1.erroresTiempo), P4.piezas, E1.tiempo, ...Object.values(E1.errores)]) assert.ok(Number.isInteger(v), `entero: ${v}`);
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.cortar({ largo: 12, tramo: 5 }), /entero/);
  assert.throws(() => motor.cortar({ largo: 12, tramo: 0 }), /mayor que cero/);
  assert.throws(() => motor.cortar({ forma: 'redonda', largo: 12, tramo: 2 }), /forma/);
  assert.throws(() => motor.cortar({ largo: 12, tramo: 2, minutos: -1 }), /negativo/);
  assert.throws(() => motor.cortar(), /objeto/);
  assert.throws(() => motor.contarPiezas({ forma: 'abierta', largo: 12, cortes: [0] }), /extremos/);
  assert.throws(() => motor.contarPiezas({ forma: 'abierta', largo: 12, cortes: [3, 3] }), /mismo lugar/);
  assert.throws(() => motor.contarPiezas({ forma: 'cerrada', largo: 12, cortes: [12] }), /antes del largo/);
  assert.throws(() => motor.contarPiezas({ largo: 12, cortes: 3 }), /lista/);
  assert.throws(() => motor.tiempoCortes({ piezas: 1, minutos: 6, piezasNuevas: 3 }), /al menos 2/);
  assert.throws(() => motor.estacas({ forma: 'cerrada', largo: 10, separacion: 3 }), /entero/);
  assert.throws(() => motor.sogaDoblada({ largo: 6, capas: 3, posiciones: [2] }), /dobleces/);
  assert.throws(() => motor.sogaDoblada({ largo: 6, capas: 3, posiciones: [] }), /al menos un corte/);
  assert.throws(() => motor.sogaDoblada({ largo: 6, capas: 1.5, posiciones: [1] }), /entero/);
  assert.throws(() => motor.cortesApilando({ piezas: 17 }), /como mucho 16/);
  assert.throws(() => motor.pesar({ pesas: [], masa: 3 }), /1 a 8/);
  assert.throws(() => motor.pesar({ pesas: [1, 2.5], masa: 3 }), /entero/);
  assert.throws(() => motor.pesar({ pesas: [1, 3], masa: 0 }), /mayor que cero/);
  assert.throws(() => motor.equilibrio({ pesas: [1, 3], masa: 2, junto: [3], otro: [3] }), /disponible/);
  assert.throws(() => motor.simularPesadas({ monedas: 9, falsa: 10 }), /como mucho 9/);
  assert.throws(() => motor.simularPesadas({ monedas: 9, falsa: 1, estrategia: 'cuartos' }), /estrategia/);
  assert.throws(() => motor.minimoPesadas({ monedas: 2 }), /al menos 3/);
  assert.throws(() => motor.minimoPesadas({ monedas: 101 }), /como mucho 100/);
});

// 4. Problemas de papel (regla 6)
const rutaPapel = path.join(__dirname, 'papel.json');
const papel = fs.existsSync(rutaPapel) ? JSON.parse(fs.readFileSync(rutaPapel, 'utf8')) : null;
test('papel.json: entre 8 y 10 problemas, con respuesta, pasos y verificación', () => {
  assert.ok(papel, 'falta papel.json');
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 8 && papel.problemas.length <= 10);
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
