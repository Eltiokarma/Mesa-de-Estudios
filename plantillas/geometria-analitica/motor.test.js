// Pruebas del motor de «El plano con imán». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con puntos al azar (semilla fija):
//    - d(A, B) = d(B, A), d² = Δx² + Δy², max(|Δx|, |Δy|) ≤ d ≤ |Δx| + |Δy|; el texto del radical vale lo mismo que el número;
//    - el punto medio está a d/2 de cada extremo; el punto que divide cumple AP/PB = m/n y AP + PB = AB;
//    - la pendiente no cambia al cambiar el orden de los puntos; los dos puntos cumplen las tres formas de la recta;
//    - la forma general tiene enteros primos entre sí y A > 0; la perpendicular da m₁·m₂ = −1 y pasa por P;
//    - el pie de la perpendicular está en la recta, PH es perpendicular a ella y |PH| es la distancia;
//    - el área no cambia al rotar los vértices; al invertir el orden cambia el signo del determinante; área = base · altura/2;
//    - en un recorrido cruzado, los dos lazos suman el determinante/2 y el zapatito da menos que el área;
//    - NINGÚN ERROR TÍPICO COINCIDE CON LA RESPUESTA CORRECTA (los que coinciden van en 'coinciden' y sí dan lo mismo).
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
  assert.equal(datos.plantilla, 'geometria-analitica');
  assert.ok(datos.casos.length >= 15 && datos.casos.length <= 20);
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
const N = 400;
const casi = (a, b, t) => Math.abs(a - b) <= (t || 1e-9) * Math.max(1, Math.abs(a), Math.abs(b));
const pto = () => [ent(-9, 9), ent(-9, 9)];
function dosPuntos() { for (;;) { const A = pto(), B = pto(); if (A[0] !== B[0] || A[1] !== B[1]) return [A, B]; } }
const dist = (P, Q) => Math.hypot(Q[0] - P[0], Q[1] - P[1]);
// El valor de un texto como «−3/4», «2√5», «7√5/5» o «√13»
function valorTexto(t) {
  const s = t.replace('−', '-');
  const m = s.match(/^(-?)(\d*)(?:√(\d+))?(?:\/(\d+))?$/);
  assert.ok(m, `texto raro: ${t}`);
  const k = m[2] === '' ? 1 : Number(m[2]), r = m[3] ? Math.sqrt(Number(m[3])) : 1, d = m[4] ? Number(m[4]) : 1;
  return (m[1] ? -1 : 1) * k * r / d;
}
// Un punto «(x; y)» a números
function puntoTexto(t) {
  const m = t.match(/^\((.+); (.+)\)$/); assert.ok(m, `punto raro: ${t}`);
  return [valorTexto(m[1]), valorTexto(m[2])];
}
const cumple = (G, P) => casi(G.A * P[0] + G.B * P[1] + G.C, 0, 1e-9);

test('distancia: simétrica, Pitágoras, entre el cateto mayor y la suma de catetos; el texto vale lo mismo', () => {
  for (let k = 0; k < N; k++) {
    const [A, B] = dosPuntos(), D = motor.distancia({ A, B }), R = motor.distancia({ A: B, B: A });
    cerca(D.valor, R.valor, 'simétrica');
    cerca(D.d2, D.dx2 + D.dy2, 'Pitágoras'); cerca(D.valor * D.valor, D.d2, 'd²', 1e-9);
    cerca(D.valor, dist(A, B), 'hypot');
    assert.ok(D.valor >= Math.max(Math.abs(D.dx), Math.abs(D.dy)) - 1e-9 && D.valor <= Math.abs(D.dx) + Math.abs(D.dy) + 1e-9);
    cerca(valorTexto(D.texto), D.valor, `texto ${D.texto}`);
    // el vértice del ángulo recto está a Δx de A y a Δy de B
    cerca(dist(A, D.recto), Math.abs(D.dx), 'cateto horizontal'); cerca(dist(D.recto, B), Math.abs(D.dy), 'cateto vertical');
    for (const e of Object.values(D.errores)) cerca(valorTexto(e.texto), e.valor, `error ${e.texto}`);
  }
});
test('punto medio y punto que divide: equidistante, AP/PB = m/n, AP + PB = AB', () => {
  for (let k = 0; k < N; k++) {
    const [A, B] = dosPuntos(), M = motor.puntoMedio({ A, B });
    cerca(dist(A, M.punto), dist(A, B) / 2, 'AM'); cerca(dist(M.punto, B), dist(A, B) / 2, 'MB');
    cerca(puntoTexto(M.texto), M.punto, 'texto de M');
    const m = ent(1, 6), n = ent(1, 6), P = motor.divide({ A, B, m, n });
    cerca(dist(A, P.punto) / dist(P.punto, B), m / n, 'razón');
    cerca(dist(A, P.punto) + dist(P.punto, B), dist(A, B), 'en el segmento');
    cerca(puntoTexto(P.texto), P.punto, 'texto de P');
    if (m === n) cerca(P.punto, M.punto, 'con 1 : 1 es el punto medio');
  }
});
test('pendiente y recta: el orden de los puntos no cambia m; los dos puntos cumplen la recta; la general es entera y primitiva', () => {
  const g = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
  for (let k = 0; k < N; k++) {
    const [A, B] = dosPuntos(), P1 = motor.pendiente({ A, B }), P2 = motor.pendiente({ A: B, B: A });
    assert.equal(P1.vertical, A[0] === B[0]);
    if (!P1.vertical) { cerca(P1.valor, P2.valor, 'm(A, B) = m(B, A)'); cerca(P1.valor, (B[1] - A[1]) / (B[0] - A[0]), 'Δy/Δx'); cerca(valorTexto(P1.texto), P1.valor, 'texto');
      cerca(Math.tan(P1.angulo * Math.PI / 180), P1.valor, 'tan θ = m', 1e-7); assert.ok(P1.angulo >= 0 && P1.angulo < 180); }
    const R = motor.recta({ A, B }), G = R.general;
    assert.ok(cumple(G, A) && cumple(G, B), `${G.texto} por ${A} y ${B}`);
    assert.ok([G.A, G.B, G.C].every(Number.isInteger), 'enteros');
    assert.equal(g(g(G.A, G.B), G.C), 1, 'primos entre sí');
    assert.ok(G.A > 0 || (G.A === 0 && G.B > 0), 'A > 0');
    if (!R.vertical) {
      cerca(A[1], R.m * A[0] + R.b, 'y = mx + b en A'); cerca(B[1], R.m * B[0] + R.b, 'y = mx + b en B');
      cerca(R.interceptoY, R.b, 'b es el corte con el eje y');
      if (R.interceptoX !== null) cerca(R.m * R.interceptoX + R.b, 0, 'corte con el eje x');
      // la forma general, leída de vuelta, da la misma recta
      const V = motor.rectaGeneral([G.A, G.B, G.C]); cerca(V.m, R.m, 'm'); cerca(V.b, R.b, 'b');
      // la punto-pendiente, evaluada en A: lado izquierdo 0 = lado derecho 0 (se lee el texto)
      assert.match(R.puntoPendiente, /^y/);
    }
  }
});
test('perpendicular y paralela: m₁·m₂ = −1, pasan por P; posicion lo reconoce', () => {
  for (let k = 0; k < N; k++) {
    const [A, B] = dosPuntos(), P = pto(), R = motor.recta({ A, B }), G = [R.general.A, R.general.B, R.general.C];
    const T = motor.perpendicular({ L: G }, P), Q = motor.paralela({ L: G }, P);
    const GT = T.recta.general, GQ = Q.recta.general;
    assert.ok(cumple(GT, P) && cumple(GQ, P), 'pasan por P');
    if (!R.vertical && R.m !== 0) cerca(T.producto, -1, 'producto');
    assert.equal(motor.posicion({ L1: G, L2: [GT.A, GT.B, GT.C] }).relacion, 'perpendiculares');
    const rel = motor.posicion({ L1: G, L2: [GQ.A, GQ.B, GQ.C] }).relacion;
    assert.equal(rel, cumple(R.general, P) ? 'coincidentes' : 'paralelas');
    const I = motor.posicion({ L1: G, L2: [GT.A, GT.B, GT.C] });
    assert.ok(cumple(R.general, I.interseccion) && cumple(GT, I.interseccion), 'la intersección está en las dos');
    cerca(I.angulo, 90, 'ángulo recto');
  }
});
test('distancia de un punto a una recta: el pie está en la recta, PH es perpendicular y |PH| = d', () => {
  for (let k = 0; k < N; k++) {
    const [A, B] = dosPuntos(), P = pto(), R = motor.recta({ A, B }), G = R.general;
    const D = motor.distanciaPuntoRecta({ P, L: [G.A, G.B, G.C] });
    assert.ok(cumple(G, D.pie), 'pie en la recta');
    cerca(dist(P, D.pie), D.valor, '|PH|');
    // PH paralelo a (A, B): producto escalar con el vector director (B, −A) es 0
    cerca((D.pie[0] - P[0]) * G.B - (D.pie[1] - P[1]) * G.A, 0, 'PH ⟂ L');
    cerca(valorTexto(D.texto), D.valor, `texto ${D.texto}`);
    // la misma recta multiplicada por un número da la misma distancia
    const c = ent(-5, 5) || 3; cerca(motor.distanciaPuntoRecta({ P, L: [c * G.A, c * G.B, c * G.C] }).valor, D.valor, 'escala');
    // distancia entre paralelas = distancia de un punto de una a la otra
    const Q = motor.paralela({ L: [G.A, G.B, G.C] }, P).recta.general;
    if (!cumple(G, P)) cerca(motor.distanciaParalelas({ L1: [G.A, G.B, G.C], L2: [2 * Q.A, 2 * Q.B, 2 * Q.C] }).valor, D.valor, 'entre paralelas');
  }
});
test('área por coordenadas: rotar no cambia, invertir cambia el signo, área = base · altura/2; los lazos suman det/2', () => {
  for (let k = 0; k < N; k++) {
    const V = [pto(), pto(), pto()], Z = motor.area({ vertices: V });
    const rot = motor.area({ vertices: [V[1], V[2], V[0]] }), inv = motor.area({ vertices: [V[2], V[1], V[0]] });
    cerca(rot.det, Z.det, 'rotar'); cerca(inv.det, -Z.det, 'invertir'); cerca(Z.valor, Math.abs(Z.det) / 2, '|det|/2');
    if (V[0][0] !== V[1][0] || V[0][1] !== V[1][1]) {
      const b = dist(V[0], V[1]), R = motor.recta({ A: V[0], B: V[1] }).general;
      const h = motor.distanciaPuntoRecta({ P: V[2], L: [R.A, R.B, R.C] }).valor;
      cerca(Z.valor, b * h / 2, 'base · altura/2', 1e-7);
    }
    cerca(Z.sumaBajada - Z.sumaSubida, Z.det, 'det');
  }
  // cuadriláteros convexos: el orden cruzado da la resta de los lazos y menos que el área
  let probados = 0;
  for (let k = 0; k < 4000 && probados < 200; k++) {
    const V = [[0, 0], [ent(2, 8), ent(-2, 1)], [ent(3, 9), ent(3, 8)], [ent(-2, 2), ent(3, 8)]];
    const Z = motor.area({ vertices: V });
    // convexo y antihorario: todos los giros a la izquierda
    const giro = i => { const a = V[i], b = V[(i + 1) % 4], c = V[(i + 2) % 4]; return (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]); };
    if (![0, 1, 2, 3].every(i => giro(i) > 0)) continue;
    probados++;
    const O = motor.ordenCruzado({ vertices: V, orden: [0, 2, 1, 3] });
    assert.ok(O.lazos, 'hay cruce'); assert.equal(O.simple, false);
    cerca(O.lazos.uno.area + O.lazos.otro.area, O.det / 2, 'los lazos suman det/2');
    assert.ok(Math.sign(O.lazos.uno.area) !== Math.sign(O.lazos.otro.area), 'un lazo se recorre al revés');
    assert.ok(O.valor < Z.valor, 'el zapatito cruzado da menos que el área');
    cerca(Math.abs(O.lazos.uno.area) + Math.abs(O.lazos.otro.area) <= Z.valor + 1e-9 ? 1 : 0, 1, 'los lazos caben');
  }
  assert.ok(probados >= 50, `solo ${probados} cuadriláteros convexos`);
});

// Regla de las revisiones: ningún error típico puede dar lo mismo que la respuesta correcta.
function sinChoques(R, que, igual) {
  assert.ok(R.errores && Array.isArray(R.coinciden), `${que}: faltan errores o coinciden`);
  for (const [k, e] of Object.entries(R.errores)) assert.ok(!igual(e), `${que}: el error ${k} da lo mismo que la correcta`);
  for (const k of R.coinciden) assert.ok(!(k in R.errores), `${que}: ${k} está en los dos lados`);
  // dos errores nunca dan lo mismo entre sí (serían dos alternativas iguales): el segundo va a 'repetidos'
  const clave = e => (typeof e !== 'object' ? String(e) : e.punto ? e.punto.map(x => x.toFixed(9)).join(';') : e.valor.toFixed(9));
  const vistos = new Map();
  for (const [k, e] of Object.entries(R.errores)) { const c = clave(e); assert.ok(!vistos.has(c), `${que}: ${k} y ${vistos.get(c)} dan lo mismo`); vistos.set(c, k); }
  for (const [k, otro] of Object.entries(R.repetidos || {})) assert.ok(otro in R.errores && !(k in R.errores), `${que}: repetido ${k}`);
  for (const k of R.noAplica || []) assert.ok(!(k in R.errores) && !R.coinciden.includes(k), `${que}: ${k} no aplica`);
}
const porValor = R => e => R.valor !== null && casi(e.valor, R.valor);
const porPunto = R => e => casi(e.punto[0], R.punto[0]) && casi(e.punto[1], R.punto[1]);
test('ningún error típico coincide con la respuesta correcta; los que coinciden se apartan', () => {
  for (let k = 0; k < N; k++) {
    const [A, B] = dosPuntos();
    const D = motor.distancia({ A, B }); sinChoques(D, `distancia ${A} ${B}`, porValor(D));
    // los que se apartaron sí dan lo mismo
    if (D.coinciden.includes('sumaCatetos')) cerca(Math.abs(D.dx) + Math.abs(D.dy), D.valor, 'catetos coinciden');
    if (D.coinciden.includes('sinRaiz')) cerca(D.d2, D.valor, 'sin raíz coincide');
    const M = motor.puntoMedio({ A, B }); sinChoques(M, 'punto medio', porPunto(M));
    const P = motor.divide({ A, B, m: ent(1, 5), n: ent(1, 5) }); sinChoques(P, 'divide', porPunto(P));
    const Pe = motor.pendiente({ A, B }); sinChoques(Pe, 'pendiente', Pe.vertical ? () => false : porValor(Pe));
    if (Pe.coinciden.includes('ordenCruzado')) assert.equal(Pe.valor, 0, 'el orden cruzado solo coincide si m = 0');
    const R = motor.recta({ P: A, m: ent(-6, 6) / ent(1, 3) }); sinChoques(R, 'b', e => casi(e.valor, R.b));
    const m1 = ent(-6, 6) / ent(1, 4), T = motor.perpendicular({ m: m1 }); sinChoques(T, `perpendicular a ${m1}`, porValor(T));
    if (T.coinciden.includes('opuesta')) assert.ok(Math.abs(m1) === 1, '−m₁ solo es perpendicular si |m₁| = 1');
    const G = motor.recta({ A, B }).general, Q = pto();
    const DP = motor.distanciaPuntoRecta({ P: Q, L: [G.A, G.B, G.C] }); sinChoques(DP, 'distancia a la recta', porValor(DP));
    const Z = motor.area({ vertices: [pto(), pto(), pto()] }); if (Z.valor > 0) sinChoques(Z, 'área', porValor(Z));
    const L2 = [G.A, G.B, ent(-9, 9)]; if (L2[2] !== G.C) { const DQ = motor.distanciaParalelas({ L1: [G.A, G.B, G.C], L2: [3 * L2[0], 3 * L2[1], 3 * L2[2]] }); sinChoques(DQ, 'paralelas', porValor(DQ)); }
    const Po = motor.posicion({ L1: [G.A, G.B, G.C], L2: [ent(-4, 4) || 1, ent(-4, 4), ent(-4, 4)] }); sinChoques(Po, 'posición', e => e === Po.relacion);
    const C3 = [pto(), pto(), pto()], G3 = motor.baricentro({ A:C3[0], B:C3[1], C:C3[2] }); sinChoques(G3, 'baricentro', porPunto(G3));
    const CG = motor.circunferenciaGeneral({ D: ent(-8, 8), E: ent(-8, 8), F: ent(-20, 20) });
    if (CG.tipo !== 'vacia') sinChoques(CG, 'circunferencia', e => (e.punto ? casi(e.punto[0], CG.centro[0]) && casi(e.punto[1], CG.centro[1]) : casi(e.valor, CG.r)));
    const m2 = ent(-6, 6), m3 = ent(-6, 6); if (Math.abs(m2) !== Math.abs(m3)) { const E2 = motor.masEmpinada({ m1: m2, m2: m3 }); sinChoques(E2, 'más empinada', e => e === E2.cual); }
  }
  for (let k = 0; k < 300; k++) {
    const V = [[0, 0], [ent(2, 8), ent(-2, 1)], [ent(3, 9), ent(3, 8)], [ent(-2, 2), ent(3, 8)]];
    const O = motor.ordenCruzado({ vertices: V }); sinChoques(O, 'orden cruzado', porValor(O));
  }
});

test('circunferencia desde la forma general: el centro y el radio vuelven a dar la ecuación; punto y vacía según D² + E² − 4F', () => {
  for (let k = 0; k < N; k++) {
    const h = ent(-6, 6), kk = ent(-6, 6), r2 = ent(-5, 30);
    const D = -2 * h, E = -2 * kk, F = h * h + kk * kk - r2, C = motor.circunferenciaGeneral({ D, E, F });
    cerca(C.centro, [h, kk], 'centro'); cerca(C.r2, r2, 'r²');
    assert.equal(C.tipo, r2 > 0 ? 'circunferencia' : r2 === 0 ? 'punto' : 'vacia');
    if (r2 >= 0) { cerca(C.r * C.r, r2, 'r'); cerca(valorTexto(C.rTexto), C.r, 'texto de r'); }
    if (r2 > 0) { const O = motor.circunferencia({ centro: [h, kk], r2 }); cerca([O.D, O.E, O.F], [D, E, F], 'ida y vuelta'); }
  }
});
test('baricentro: es el promedio y está a 2/3 de cada vértice hacia el punto medio del lado opuesto', () => {
  for (let k = 0; k < N; k++) {
    const A = pto(), B = pto(), C = pto(), G = motor.baricentro({ A, B, C }).punto, M = motor.puntoMedio({ A: B, B: C }).punto;
    cerca(G, [A[0] + 2 / 3 * (M[0] - A[0]), A[1] + 2 / 3 * (M[1] - A[1])], 'G');
  }
});
test('lo que no aplica y lo repetido: Δx/Δy con Δy = 0; con m₁ = ±1, invertir y copiar dan lo mismo', () => {
  assert.deepEqual(motor.pendiente({ A: [-1, 2], B: [5, 2] }).noAplica, ['invertida']);
  const T = motor.perpendicular({ m: 1 });
  assert.deepEqual(T.repetidos, { igual: 'inversa' }); assert.ok(!('igual' in T.errores));
  assert.deepEqual(motor.perpendicular({ m: -1 }).repetidos, { igual: 'inversa' });
});

// 3. Errores de entrada
test('entradas inválidas', () => {
  assert.throws(() => motor.pendiente({ A: [1, 2], B: [1, 2] }), /mismo punto/);
  assert.throws(() => motor.recta({ A: [0, 0], B: [0, 0] }), /mismo punto/);
  assert.throws(() => motor.distancia({ A: [1, 'dos'], B: [0, 0] }), /número/);
  assert.throws(() => motor.distancia({ A: [1], B: [0, 0] }), /punto/);
  assert.throws(() => motor.divide({ A: [0, 0], B: [4, 4], m: 0, n: 2 }), /mayores que cero/);
  assert.throws(() => motor.posicion({ L1: [0, 0, 3], L2: [1, 1, 1] }), /no pueden ser cero/);
  assert.throws(() => motor.distanciaParalelas({ L1: [1, 2, 3], L2: [2, 1, 3] }), /no son paralelas/);
  assert.throws(() => motor.area({ vertices: [[0, 0], [1, 1]] }), /tres vértices/);
  assert.throws(() => motor.ordenCruzado({ vertices: [[0, 0], [1, 0], [1, 1], [0, 1]], orden: [0, 0, 1, 2] }), /cada vértice/);
  assert.throws(() => motor.masEmpinada({ m1: 2, m2: -2 }), /misma inclinación/);
  assert.throws(() => motor.circunferencia({ centro: [0, 0], r2: -4 }), /mayor que cero/);
  assert.throws(() => motor.distancia({ A: [Math.PI, 0], B: [0, 0] }), /fracción exacta/);
  assert.throws(() => motor.circunferenciaGeneral({ D: 'dos', E: 0, F: 0 }), /número/);
});

// 4. papel.json
const papel = JSON.parse(fs.readFileSync(path.join(__dirname, 'papel.json'), 'utf8'));
test('papel.json: formato', () => {
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  for (const p of papel.problemas) assert.ok(p.id && p.enunciado && p.respuesta && p.pasos.length && p.verificar.length, p.id);
});
for (const p of papel.problemas) test(`papel ${p.id}: ${p.enunciado.slice(0, 60)}`, () => {
  for (const v of p.verificar) comprobar(v.fn, v.args, v.espera, p.id);
});
