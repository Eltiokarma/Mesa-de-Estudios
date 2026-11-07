// Pruebas del motor de «Cargas que se empujan». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con cargas al azar (semilla fija): las dos fuerzas de Coulomb son siempre iguales y opuestas
//    (y la suma de todas las fuerzas internas es cero); F·r² no cambia; la fuerza sobre una carga es q·E del campo de
//    las otras; el campo es menos la pendiente del potencial (derivada numérica); el campo de una carga existe en
//    todo punto y no depende de la carga de prueba; el trabajo no depende del camino y es −ΔU; con masas iguales
//    las esferas se apartan el mismo ángulo y cumplen tan θ = F/(mg) y 2L·sen θ = r; el desvío entre placas es
//    proporcional a q; en serie la carga es la misma y los voltajes suman V; en paralelo las cargas suman Q; la
//    capacidad no depende de Q; al tocarse, la carga se conserva y los potenciales se igualan; las equipotenciales
//    tienen el potencial pedido.
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
  if (esperado && typeof esperado === 'object') { for (const [k, v] of Object.entries(esperado)) cerca(real[k], v, `${que}.${k}`, t); return; }
  if (typeof esperado !== 'number') { assert.deepEqual(real, esperado, que); return; }
  assert.ok(typeof real === 'number' && Math.abs(real - esperado) <= t * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
const campo = (r, k) => (k === 'valor' ? r : k.split('.').reduce((o, p) => (o == null ? o : o[p]), r));
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
  assert.equal(datos.plantilla, 'electrostatica');
  assert.ok(datos.casos.length >= 16, 'al menos 16 casos');
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera, JSON.stringify(c).slice(0, 80));
  // los casos del informe están
  const nombres = datos.casos.map(c => c.nombre).join(' ');
  for (const t of ['6/5 N', '3/10 N', '24/5 N', '6 × 10⁵', '2 × 10⁵', '144 µJ', '648 µJ']) assert.ok(nombres.includes(t), `falta el caso del informe: ${t}`);
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Propiedades
const rnd = motor.azar(2026);
const al = (a, b) => a + (b - a) * rnd();
const qAzar = () => { const q = al(0.5, 20); return rnd() < 0.5 ? -q : q; };
const N = 300;
// cargas separadas al menos 0,1 m entre sí
function cargasAzar(n) {
  const cs = [];
  while (cs.length < n) {
    const c = { q: qAzar(), x: al(-1, 1), y: al(-1, 1) };
    if (cs.every(d => Math.hypot(d.x - c.x, d.y - c.y) > 0.1)) cs.push(c);
  }
  return cs;
}
function puntoLejos(cs) {
  for (;;) { const p = { x: al(-1.2, 1.2), y: al(-1.2, 1.2) }; if (cs.every(c => Math.hypot(c.x - p.x, c.y - p.y) > 0.08)) return p; }
}

test('Coulomb: las dos fuerzas son iguales siempre, aunque las cargas sean muy distintas; F·r² no cambia; los campos sí son distintos', () => {
  for (let k = 0; k < N; k++) {
    const q1 = qAzar(), q2 = qAzar() * al(1, 50), r = al(0.01, 3);
    const c = motor.coulomb(q1, q2, r);
    assert.equal(c.sobre1, c.sobre2); assert.equal(c.razon, 1);
    cerca(c.F * r * r, 9e9 * Math.abs(q1 * q2) * 1e-12, 'F·r²');
    cerca(c.E2en1 * Math.abs(q1) * 1e-6, c.F, 'F = q1·E2'); cerca(c.E1en2 * Math.abs(q2) * 1e-6, c.F, 'F = q2·E1');
    cerca(c.errores.mayorEmpujaMas * c.errores.mayorRecibeMas, 1, 'EL1 y EL2 son recíprocos');
    assert.equal(c.tipo, q1 * q2 > 0 ? 'repulsion' : 'atraccion');
    const f = al(0.2, 5), d = motor.cambioDistancia(q1, q2, r, f);
    cerca(d.F1, d.F0 / (f * f), '1/r²'); cerca(d.errores.lineal, d.F0 / f, '1/r');
  }
});
test('superposición: la suma de todas las fuerzas internas es cero (tercera ley) y la fuerza sobre una carga es q·E de las otras', () => {
  for (let k = 0; k < N; k++) {
    const cs = cargasAzar(2 + Math.floor(rnd() * 4));
    let sx = 0, sy = 0, esc = 0;
    cs.forEach((c, i) => {
      const F = motor.fuerzaSobre(cs, i);
      sx += F.x; sy += F.y; esc = Math.max(esc, ...F.partes.map(p => p.modulo));
      const otras = cs.filter((_, j) => j !== i), E = motor.campo(otras, c);
      cerca(F.x, c.q * 1e-6 * E.x, 'Fx = q·Ex', 1e-8); cerca(F.y, c.q * 1e-6 * E.y, 'Fy = q·Ey', 1e-8);
      assert.ok(F.errores.sumaModulos >= F.modulo - 1e-9 * esc, 'sumar como números da la cota de arriba');
    });
    assert.ok(Math.abs(sx) <= 1e-8 * esc && Math.abs(sy) <= 1e-8 * esc, `las fuerzas internas no suman cero: ${sx}, ${sy}`);
    // con dos cargas, fuerzaSobre da lo mismo que coulomb
    const dos = cs.slice(0, 2), c2 = motor.coulomb(dos[0].q, dos[1].q, Math.hypot(dos[0].x - dos[1].x, dos[0].y - dos[1].y));
    cerca(motor.fuerzaSobre(dos, 0).modulo, c2.F, 'dos cargas'); cerca(motor.fuerzaSobre(dos, 1).modulo, c2.F, 'dos cargas, la otra');
  }
});
test('el campo es menos la pendiente del potencial; el potencial es escalar (se suma con signo) y el campo, vector', () => {
  for (let k = 0; k < N; k++) {
    const cs = cargasAzar(1 + Math.floor(rnd() * 4)), p = puntoLejos(cs), h = 1e-6;
    const V = q => motor.potencial(cs, q).V, E = motor.campo(cs, p);
    const ex = -(V({ x: p.x + h, y: p.y }) - V({ x: p.x - h, y: p.y })) / (2 * h);
    const ey = -(V({ x: p.x, y: p.y + h }) - V({ x: p.x, y: p.y - h })) / (2 * h);
    const esc = Math.max(1, E.errores.sumaModulos);
    assert.ok(Math.abs(ex - E.x) < 1e-4 * esc && Math.abs(ey - E.y) < 1e-4 * esc, `E ≠ −∇V: ${ex} vs ${E.x}`);
    // suma: V total = suma de los V de cada carga; |V| ≤ suma sin signo
    const Vs = cs.map(c => motor.potencial([c], p).V).reduce((a, b) => a + b, 0);
    cerca(motor.potencial(cs, p).V, Vs, 'V se suma', 1e-8);
    assert.ok(Math.abs(V(p)) <= motor.potencial(cs, p).errores.sinSigno * (1 + 1e-12));
    // cambiar todas las cargas de signo invierte E y V
    const neg = cs.map(c => ({ ...c, q: -c.q }));
    cerca(motor.campo(neg, p).x, -E.x, 'E con signos al revés', 1e-8); cerca(motor.potencial(neg, p).V, -V(p), 'V con signos al revés', 1e-8);
  }
});
test('carga de prueba: el campo no depende de ella; la fuerza es q0·E y se invierte con su signo', () => {
  for (let k = 0; k < N; k++) {
    const cs = cargasAzar(1 + Math.floor(rnd() * 3)), p = puntoLejos(cs), q0 = qAzar();
    const a = motor.prueba(cs, p, q0), b = motor.prueba(cs, p, -q0), E = motor.campo(cs, p);
    cerca(a.E.x, E.x, 'el campo es el de las fuentes'); cerca(b.E.y, a.E.y, 'el campo no cambia con el signo');
    cerca(a.F.x, -b.F.x, 'la fuerza se invierte'); cerca(a.F.modulo, Math.abs(q0) * 1e-6 * E.modulo, '|F| = |q0|·E');
    assert.equal(a.mismoSentido, q0 > 0);
    if (E.modulo > 0) cerca((a.F.x * E.x + a.F.y * E.y) / (a.F.modulo * E.modulo), Math.sign(q0), 'paralela o antiparalela', 1e-8);
  }
});
test('trabajo: no depende del camino, es −ΔU y vale cero sobre una equipotencial', () => {
  for (let k = 0; k < N; k++) {
    const cs = cargasAzar(1 + Math.floor(rnd() * 3)), A = puntoLejos(cs), B = puntoLejos(cs), C = puntoLejos(cs), q = qAzar();
    const ab = motor.trabajo(cs, A, B, q), bc = motor.trabajo(cs, B, C, q), ac = motor.trabajo(cs, A, C, q);
    const esc = Math.max(1e-6, Math.abs(ab.Wcampo), Math.abs(bc.Wcampo), Math.abs(ab.UA), Math.abs(bc.UB));
    assert.ok(Math.abs(ab.Wcampo + bc.Wcampo - ac.Wcampo) <= 1e-8 * esc, 'W(A→B) + W(B→C) = W(A→C)');
    cerca(ab.Wcampo, -(ab.UB - ab.UA), 'W = −ΔU', 1e-8); cerca(ab.Wagente, -ab.Wcampo, 'agente = −campo');
  }
  // por un camino quebrado al azar da lo mismo que en línea recta
  for (let k = 0; k < 100; k++) {
    const cs = cargasAzar(1 + Math.floor(rnd() * 3)), pts = Array.from({ length: 3 + Math.floor(rnd() * 5) }, () => puntoLejos(cs)), q = qAzar();
    const t = motor.trabajoCamino(cs, pts, q);
    assert.ok(t.igual, 'el camino no importa'); cerca(t.W, motor.trabajo(cs, pts[0], pts[pts.length - 1], q).Wcampo, 'W', 1e-8);
    assert.ok(t.largo >= t.recta - 1e-12);
  }
  // alrededor de una carga sola, la circunferencia es equipotencial
  for (let k = 0; k < 50; k++) {
    const q = qAzar(), r = al(0.05, 2), a = al(0, 6.3), b = al(0, 6.3);
    const w = motor.trabajo([{ q, x: 0, y: 0 }], { x: r * Math.cos(a), y: r * Math.sin(a) }, { x: r * Math.cos(b), y: r * Math.sin(b) }, qAzar());
    assert.ok(Math.abs(w.Wcampo) < 1e-9 * Math.max(1, Math.abs(w.UA)), 'W = 0 sobre la equipotencial');
  }
});
test('esferas: con masas iguales, el mismo ángulo siempre; tan θ = F/(mg) y, con hilos, 2L·sen θ = r', () => {
  for (let k = 0; k < N; k++) {
    const q1 = al(0.1, 5), q2 = al(0.1, 5) * al(1, 6), m = al(0.005, 0.2), L = al(0.1, 1);
    const e = motor.esferasColgadas(q1, q2, m, m, L);
    assert.ok(e.mismoAngulo, 'mismo ángulo'); cerca(e.razon, 1, 'razón 1');
    cerca(e.tan1, e.F / (m * 10), 'tan θ = F/(mg)', 1e-8);
    cerca(2 * L * Math.sin(e.theta1 * Math.PI / 180), e.r, '2L·sen θ = r', 1e-8);
    cerca(e.F, motor.coulomb(q1, q2, e.r).F, 'F a esa distancia', 1e-8);
    assert.ok(e.r > 0 && e.r < 2 * L);
    // con masas distintas, la más liviana se aparta más (sin importar la carga)
    const m2 = m * al(1.2, 3), d = motor.esferasColgadas(q1, q2, m, m2, L);
    assert.ok(d.theta1 > d.theta2, 'la más liviana se aparta más');
    cerca(L * Math.sin(d.theta1 * Math.PI / 180) + L * Math.sin(d.theta2 * Math.PI / 180), d.r, 'hilos', 1e-8);
  }
});
test('entre placas: el desvío es proporcional a q, cambia de lado con su signo y la trayectoria es una parábola', () => {
  for (let k = 0; k < N; k++) {
    const o = { E: al(100, 1e4), q: al(0.1, 10), m: al(1e-7, 1e-4), v0: al(10, 500), L: al(0.02, 0.5) };
    const a = motor.campoUniforme(o), b = motor.campoUniforme({ ...o, q: -o.q }), c = motor.campoUniforme({ ...o, q: 2 * o.q });
    assert.equal(a.hacia, 'negativa'); assert.equal(b.hacia, 'positiva');
    cerca(a.desvio, b.desvio, 'mismo desvío'); cerca(c.desvio, 2 * a.desvio, 'doble carga, doble desvío');
    cerca(a.desvio, o.q * 1e-6 * o.E / o.m * (o.L / o.v0) ** 2 / 2, 'y = qE L² / (2 m v0²)');
    const t = motor.trayectoriaUniforme(o, 10);
    cerca(t[10].x, o.L, 'llega al final de las placas'); cerca(-t[10].y, a.desvio, 'punto final');
    cerca(-t[5].y, a.desvio / 4, 'a la mitad del largo, la cuarta parte del desvío');
  }
});
test('condensadores: en serie la misma carga y los voltajes suman V; en paralelo el mismo voltaje y las cargas suman Q', () => {
  for (let k = 0; k < N; k++) {
    const n = 2 + Math.floor(rnd() * 3), Cs = Array.from({ length: n }, () => al(0.5, 20)), V = al(1, 200);
    const s = motor.serie(Cs, V), p = motor.paralelo(Cs, V);
    assert.ok(s.Ceq < Math.min(...Cs) && p.Ceq > Math.max(...Cs), 'serie menor que la menor; paralelo mayor que la mayor');
    cerca(s.voltajes.reduce((a, b) => a + b, 0), V, 'ΣV = V', 1e-8);
    s.cargas.forEach(q => cerca(q, s.Q, 'misma carga'));
    cerca(s.energias.reduce((a, b) => a + b, 0), s.U, 'ΣU serie', 1e-8);
    cerca(p.cargas.reduce((a, b) => a + b, 0), p.Q, 'ΣQ', 1e-8);
    cerca(p.energias.reduce((a, b) => a + b, 0), p.U, 'ΣU paralelo', 1e-8);
    assert.ok(s.errores.sumaCapacidades > s.Ceq, 'sumar en serie da de más');
    const e = motor.energiaCondensador(s.Ceq, V); cerca(e.U, s.U, 'U = CV²/2'); cerca(e.QV2, e.U, 'QV/2'); cerca(e.Q2C, e.U, 'Q²/2C');
  }
});
test('la capacidad de placas no depende de la carga; crece con el área y baja con la distancia', () => {
  for (let k = 0; k < N; k++) {
    const A = al(1e-4, 1), d = al(1e-4, 1e-2), Q = al(-1e-6, 1e-6);
    const a = motor.capacidad({ A, d }), b = motor.capacidad({ A, d, Q }), c = motor.capacidad({ A, d, Q: 0 });
    cerca(a.C, b.C, 'con carga'); cerca(a.C, c.C, 'sin carga'); cerca(b.V * b.C, Q, 'Q = CV', 1e-8);
    const fA = al(0.2, 5), fD = al(0.2, 5), cp = motor.cambioPlacas(A, d, fA, fD);
    cerca(cp.C1, cp.C0 * fA / fD, 'C ∝ A/d', 1e-8);
    cerca(motor.capacidad({ A, d, k: 3 }).C, 3 * a.C, 'dieléctrico');
  }
});
test('dieléctrico: C × κ siempre; desconectado, Q se conserva y U, V, E ÷ κ; conectado, V fijo y Q, U × κ', () => {
  for (let k = 0; k < N; k++) {
    const C0 = al(0.5, 50), V0 = al(1, 300), ka = al(1, 10), d = al(1e-4, 1e-2), f = rnd();
    const des = motor.dielectrico({ C0, V0, kappa: ka, conectado: false, d }), con = motor.dielectrico({ C0, V0, kappa: ka, conectado: true, d });
    const U0 = C0 * V0 * V0 / 2;
    cerca(des.C, ka * C0, 'C desconectado'); cerca(con.C, ka * C0, 'C conectado');
    cerca(des.Q, C0 * V0, 'Q se conserva'); cerca(des.U, U0 / ka, 'U0/κ'); cerca(des.V, V0 / ka, 'V/κ'); cerca(des.E, V0 / ka / d, 'E/κ');
    cerca(con.V, V0, 'V fijo'); cerca(con.Q, ka * C0 * V0, 'Q×κ'); cerca(con.U, ka * U0, 'κ·U0'); cerca(con.E, V0 / d, 'E igual');
    cerca(des.errores.otraSituacion.Q, con.Q, 'la otra situación'); cerca(con.errores.otraSituacion.V, des.V, 'la otra situación, al revés');
    // con Q0 en vez de V0 da lo mismo; con una fracción del área, C crece en proporción
    cerca(motor.dielectrico({ C0, Q0: C0 * V0, kappa: ka, conectado: false }).V, des.V, 'con Q0');
    cerca(motor.dielectrico({ C0, V0, kappa: ka, conectado: true, fraccion: f }).C, C0 * (1 + (ka - 1) * f), 'fracción');
    cerca(motor.dielectrico({ C0, V0, kappa: 1, conectado: false }).U, U0, 'κ = 1 no cambia nada');
    // energía: desconectado, las placas jalan la lámina con U0 − U; conectado, la pila entrega el doble de lo que sube U
    cerca(des.trabajoSobreLamina, U0 - des.U, 'desconectado'); cerca(con.trabajoPila, 2 * con.deltaU, 'conectado: la mitad');
    cerca(con.trabajoSobreLamina, con.deltaU, 'conectado: la otra mitad'); assert.ok(des.trabajoSobreLamina >= -1e-9 && con.trabajoSobreLamina >= -1e-9);
  }
});
test('conductores que se tocan: la carga se conserva y quedan al mismo potencial (no con la misma carga)', () => {
  for (let k = 0; k < N; k++) {
    const Q1 = qAzar(), Q2 = qAzar(), R1 = al(0.005, 0.2), R2 = al(0.005, 0.2);
    const c = motor.contacto(Q1, R1, Q2, R2);
    cerca(c.Q1f + c.Q2f, Q1 + Q2, 'conserva', 1e-8);
    cerca(9e9 * c.Q1f * 1e-6 / R1, 9e9 * c.Q2f * 1e-6 / R2, 'mismo potencial', 1e-8);
    if (R2 > R1 && Q1 + Q2 > 0) assert.ok(c.Q2f > c.Q1f, 'la grande se queda con más');
  }
});
test('dibujo: las flechitas del mapa miden 1 y su intensidad va de 0 a 1; las equipotenciales tienen el potencial pedido', () => {
  for (let k = 0; k < 30; k++) {
    const cs = cargasAzar(1 + Math.floor(rnd() * 3)), caja = { x0: -1.2, x1: 1.2, y0: -1, y1: 1 };
    const m = motor.mapaCampo(cs, caja, 12);
    assert.ok(m.puntos.length > 50);
    for (const p of m.puntos) {
      if (p.modulo > 0) cerca(Math.hypot(p.ux, p.uy), 1, 'unitario');
      assert.ok(p.nivel >= 0 && p.nivel <= 1);
      assert.ok(cs.every(c => Math.hypot(c.x - p.x, c.y - p.y) >= m.paso * 0.6 - 1e-12), 'lejos de las cargas');
    }
  }
  // mediatriz de +q y −q: V = 0, y la equipotencial de 1,2 × 10⁵ V de 4 µC es una circunferencia de 0,3 m
  const dip = [{ q: 4, x: -0.3, y: 0 }, { q: -4, x: 0.3, y: 0 }];
  const t0 = motor.curvaNivel(dip, 0, { x0: -0.6, x1: 0.6, y0: -0.4, y1: 0.4 }, 24);
  assert.ok(t0.length > 5);
  for (const s of t0) { assert.ok(Math.abs(s.x1) < 1e-9 && Math.abs(s.x2) < 1e-9, 'sobre la mediatriz'); }
  cerca(motor.radioEquipotencial(4, 120000), 0.3, 'radio');
  const t1 = motor.curvaNivel([{ q: 4, x: 0, y: 0 }], 120000, { x0: -0.5, x1: 0.5, y0: -0.5, y1: 0.5 }, 80);
  assert.ok(t1.length > 20);
  for (const s of t1) assert.ok(Math.abs(Math.hypot(s.x1, s.y1) - 0.3) < 0.01, 'sobre la circunferencia de 0,3 m');
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.coulomb('2', 6, 0.3), /número/);
  assert.throws(() => motor.coulomb(2, 6, 0), /mayor que cero/);
  assert.throws(() => motor.coulomb(0, 6, 0.3), /distintas de cero/);
  assert.throws(() => motor.cambioDistancia(2, 6, 0.3, -1), /mayor que cero/);
  assert.throws(() => motor.fuerzaSobre([], 0), /lista/);
  assert.throws(() => motor.fuerzaSobre([{ q: 1, x: 0, y: 0 }], 0), /otra carga/);
  assert.throws(() => motor.fuerzaSobre([{ q: 1, x: 0, y: 0 }, { q: 1, x: 0, y: 0 }], 0), /mismo punto/);
  assert.throws(() => motor.fuerzaSobre([{ q: 1, x: 0, y: 0 }, { q: 1, x: 1, y: 0 }], 2), /índice/);
  assert.throws(() => motor.campo([{ q: 1, x: 0, y: 0 }], { x: 0, y: 0 }), /sobre una carga/);
  assert.throws(() => motor.campo([{ q: 1, x: 0 }], { x: 1, y: 0 }), /número/);
  assert.throws(() => motor.prueba([{ q: 1, x: 0, y: 0 }], { x: 1, y: 0 }, 0), /distinta de cero/);
  assert.throws(() => motor.esferasColgadas(1, -1, 0.01, 0.01, 0.3), /se repelen/);
  assert.throws(() => motor.esferas(1, 2, 0.3, 0), /mayor que cero/);
  assert.throws(() => motor.campoUniforme({ E: 100, q: 1, m: 1e-6, v0: 0, L: 0.1 }), /mayor que cero/);
  assert.throws(() => motor.capacidad({ A: 0.01 }), /número/);
  assert.throws(() => motor.serie([], 12), /lista/);
  assert.throws(() => motor.paralelo([3, -6], 12), /mayor que cero/);
  assert.throws(() => motor.contacto(1, 0, 1, 1), /mayor que cero/);
  assert.throws(() => motor.mapaCampo([{ q: 1, x: 0, y: 0 }], { x0: 1, x1: 0, y0: 0, y1: 1 }), /caja/);
  assert.throws(() => motor.radioEquipotencial(4, -1), /mismo signo/);
  assert.throws(() => motor.dielectrico({ C0: 10, V0: 12, kappa: 0.5, conectado: true }), /1 o más/);
  assert.throws(() => motor.dielectrico({ C0: 10, V0: 12, Q0: 120, kappa: 3, conectado: true }), /uno de los dos/);
  assert.throws(() => motor.dielectrico({ C0: 10, V0: 12, kappa: 3 }), /conectado/);
  assert.throws(() => motor.trabajoCamino([{ q: 1, x: 0, y: 0 }], [{ x: 1, y: 0 }], 1), /dos puntos/);
  // acepta el punto como [x, y]
  cerca(motor.campo([{ q: 4, x: 0, y: 0 }], [0.3, 0]).modulo, 400000, 'punto como lista');
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
