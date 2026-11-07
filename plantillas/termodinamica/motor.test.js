// Pruebas del motor de termodinámica. Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. El trabajo es el área bajo la curva: se integra aquí P dV con muchos trapecios sobre los puntos del motor y debe
//    dar su W, en los cinco tipos de proceso, al expandirse y al comprimirse. En la adiabática, P·V^γ no cambia y Q = 0.
//    La primera ley se cumple en cada fracción del proceso (en(s)).
// 3. Lo que enseña la escena: ΔU solo depende de los estados (dos caminos, misma ΔU; W y Q distintos: T5, T6);
//    en un ciclo ΔU = 0 y Q neto = W neto = área encerrada, con signo según el sentido (T10); en la isoterma Q = W (T11);
//    en la compresión adiabática T sube (T4); el ciclo de Carnot dibujado da η = 1 − Tf/Tc; ninguna máquina posible
//    supera a Carnot (T14, T15); Qabs − Qced = W neto.
// 4. Errores de entrada.
// 5. Cada problema de papel.json coincide con el motor.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const motor = require('./motor.js');

const datos = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));
const TOL = datos.tolerancia;
function cerca(real, esperado, que, tol) {
  const t = tol === undefined ? TOL : tol;
  assert.ok(typeof real === 'number' && Math.abs(real - esperado) <= t * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
const leer = (o, k) => k.split('.').reduce((x, p) => (x === null || x === undefined ? undefined : x[p]), o);
function comprobar(fn, args, espera, que) {
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  const r = motor[fn](...args);
  for (const [k, v] of Object.entries(espera)) {
    const x = leer(r, k);
    if (typeof v === 'number') cerca(x, v, `${que} · ${k}`);
    else assert.equal(x, v, `${que} · ${k}: el motor da ${x}, se esperaba ${v}`);
  }
}

// 1. casos.json
test('casos.json trae al menos 15 casos y la verificación pendiente o hecha', () => {
  assert.ok(datos.casos.length >= 15);
  assert.equal(typeof datos.verificacion, 'string');
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. El trabajo es el área bajo la curva
function areaBajo(puntos) {
  let a = 0;
  for (let i = 1; i < puntos.length; i++) a += (puntos[i].P + puntos[i - 1].P) / 2 * (puntos[i].V - puntos[i - 1].V);
  return a;
}
const PROCESOS = [
  { tipo: 'isobarico', V2: 30 }, { tipo: 'isobarico', V2: 4 },
  { tipo: 'isocorico', P2: 450 }, { tipo: 'isocorico', P2: 60 },
  { tipo: 'isotermico', V2: 25 }, { tipo: 'isotermico', V2: 3 },
  { tipo: 'adiabatico', V2: 22 }, { tipo: 'adiabatico', V2: 5 },
  { tipo: 'recta', P2: 80, V2: 35 }, { tipo: 'recta', P2: 420, V2: 4 }
];
test('W = ∫P dV, integrada aquí sobre la curva, en los cinco tipos y en los dos sentidos (monoatómico y diatómico)', () => {
  for (const gas of ['monoatomico', 'diatomico']) for (const q of PROCESOS) {
    const r = motor.proceso(Object.assign({ P1: 200, V1: 10, T1: 300, gas }, q));
    cerca(areaBajo(r.puntos(4000)), r.W, `${gas} ${JSON.stringify(q)}`, 1e-6);
    if (r.sentido === 'expansion') assert.ok(r.W > 0); else if (r.sentido === 'compresion') assert.ok(r.W < 0); else assert.equal(r.W, 0);
  }
});
test('primera ley en cada fracción del proceso: Q = ΔU + W, y ΔU = Cv·Δ(PV)/R', () => {
  for (const q of PROCESOS) {
    const r = motor.proceso(Object.assign({ P1: 200, V1: 10, T1: 300 }, q));
    for (const s of [0, 0.1, 0.37, 0.5, 0.9, 1]) {
      const e = r.en(s);
      cerca(e.Q, e.dU + e.W, `${q.tipo} s=${s}`, 1e-9);
      cerca(e.dU, 1.5 * (e.P * e.V - 2000), `ΔU ${q.tipo} s=${s}`, 1e-9);
      cerca(e.T, e.P * e.V / r.nR, `T ${q.tipo}`, 1e-12);
    }
    const ini = r.en(0); cerca(ini.W, 0, 'W(0)'); cerca(ini.Q, 0, 'Q(0)');
    const fin = r.en(1); cerca(fin.P, r.final.P, 'P(1)'); cerca(fin.V, r.final.V, 'V(1)'); cerca(fin.W, r.W, 'W(1)');
  }
});
test('adiabática: P·V^γ y T·V^(γ−1) no cambian y Q = 0 en todo el camino', () => {
  for (const gas of ['monoatomico', 'diatomico']) for (const V2 of [3, 8, 20, 40]) {
    const r = motor.proceso({ tipo: 'adiabatico', P1: 150, V1: 12, V2, T1: 280, gas }), g = r.gas.gamma;
    for (const p of r.puntos(30)) cerca(p.P * Math.pow(p.V, g), 150 * Math.pow(12, g), 'PV^γ', 1e-9);
    cerca(r.final.T * Math.pow(V2, g - 1), 280 * Math.pow(12, g - 1), 'TV^(γ−1)', 1e-9);
    for (const s of [0.2, 0.6, 1]) assert.equal(r.en(s).Q, 0);
    cerca(r.dU, -r.W, 'ΔU = −W');
  }
});
test('isoterma: T fija, ΔU = 0 y Q = W en todo el camino', () => {
  for (const V2 of [2, 7, 15, 50]) {
    const r = motor.proceso({ tipo: 'isotermico', P1: 300, V1: 10, V2, T1: 400 });
    for (const s of [0.3, 0.8, 1]) { const e = r.en(s); cerca(e.T, 400, 'T'); assert.equal(e.dU, 0); cerca(e.Q, e.W, 'Q = W'); }
  }
});

// 3. Lo que enseña la escena
test('T5 y T6: entre los mismos estados, ΔU es la misma por cualquier camino; W y Q, no', () => {
  const caminos = [
    [{ tipo: 'isobarico', V2: 30 }],
    [{ tipo: 'isocorico', P2: 400 }, { tipo: 'isobarico', V2: 30 }, { tipo: 'isocorico', P2: 200 }],
    [{ tipo: 'isotermico', V2: 20 }, { tipo: 'recta', P2: 200, V2: 30 }],
    [{ tipo: 'adiabatico', V2: 5 }, { tipo: 'recta', P2: 200, V2: 30 }],
    [{ tipo: 'recta', P2: 200, V2: 30 }]
  ].map(tramos => motor.camino({ P1: 200, V1: 10, T1: 300, tramos }));
  for (const c of caminos) { cerca(c.dU, 6000, 'ΔU'); cerca(c.final.T, 900, 'T final'); cerca(c.Q, c.dU + c.W, 'Q = ΔU + W'); }
  const Ws = new Set(caminos.map(c => Math.round(c.W)));
  assert.ok(Ws.size >= 4, 'los trabajos deben ser distintos');
});
function shoelace(puntos) {
  let a = 0;
  for (let i = 0; i < puntos.length; i++) { const p = puntos[i], q = puntos[(i + 1) % puntos.length]; a += p.V * q.P - q.V * p.P; }
  return a / 2;   // positivo si se recorre antihorario con V a la derecha y P hacia arriba
}
test('T10: en un ciclo ΔU = 0, Q neto = W neto = área encerrada; horario > 0 (máquina), antihorario < 0 (refrigerador)', () => {
  for (const [Pa, Pb, Va, Vb] of [[100, 300, 1, 3], [200, 400, 10, 30], [50, 75, 2, 9]]) for (const sentido of ['horario', 'antihorario']) {
    const r = motor.rectangulo({ Pa, Pb, Va, Vb, sentido, T1: 300 });
    assert.equal(r.cerrado, true); assert.equal(r.dU, 0);
    cerca(Math.abs(r.W), (Pb - Pa) * (Vb - Va), 'área');
    cerca(r.W, -shoelace(r.puntos(2)), 'shoelace con signo');
    cerca(r.Q, r.W, 'Q neto = W neto');
    cerca(r.Qabs - r.Qced, r.W, 'Qabs − Qced = W');
    assert.equal(r.sentido, sentido); assert.equal(r.tipo, sentido === 'horario' ? 'maquina' : 'refrigerador');
  }
  // Un ciclo con curvas: isoterma, isocórico e isobárico, cerrado
  const c = motor.camino({ P1: 400, V1: 10, T1: 600, tramos: [{ tipo: 'isotermico', V2: 20 }, { tipo: 'isobarico', V2: 10 }, { tipo: 'isocorico', P2: 400 }] });
  assert.equal(c.cerrado, true); cerca(c.W, -shoelace(c.puntos(3000)), 'ciclo curvo', 1e-6); cerca(c.W, 4000 * Math.log(2) - 2000, 'W');
  assert.ok(c.eficiencia > 0 && c.eficiencia < 1 - c.tramos[1].final.T / 600);
});
test('Carnot dibujado: η = W/Qc = 1 − Tf/Tc para cualquier par de focos, volúmenes y gas; las adiabáticas no tienen calor', () => {
  for (const [Tc, Tf] of [[500, 300], [400, 300], [1000, 250], [373, 273]]) for (const gas of ['monoatomico', 'diatomico']) for (const [V1, V2] of [[5, 10], [2, 7]]) {
    const r = motor.carnotCiclo({ Tc, Tf, V1, V2, nR: 3, gas });
    assert.equal(r.cerrado, true);
    cerca(r.W / r.Qc, 1 - Tf / Tc, `η ${Tc}/${Tf}`);
    cerca(r.eficiencia, 1 - Tf / Tc, 'eficiencia del camino');
    cerca(r.Qf / r.Qc, Tf / Tc, 'Qf/Qc = Tf/Tc');
    cerca(r.W, -shoelace(r.puntos(3000)), 'área', 1e-5);
    assert.equal(r.tramos[1].Q, 0); assert.equal(r.tramos[3].Q, 0);
    cerca(r.vertices[2].T, Tf, 'Tf'); cerca(r.final.T, Tc, 'vuelve a Tc');
  }
});
test('T14 y T15: ningún ciclo de la escena supera a Carnot entre su temperatura mayor y menor', () => {
  const ciclos = [motor.rectangulo({ Pa: 200, Pb: 400, Va: 10, Vb: 30, T1: 300 }), motor.rectangulo({ Pa: 100, Pb: 300, Va: 1, Vb: 3, T1: 100 }),
    motor.camino({ P1: 400, V1: 10, T1: 600, tramos: [{ tipo: 'isotermico', V2: 20 }, { tipo: 'isobarico', V2: 10 }, { tipo: 'isocorico', P2: 400 }] })];
  for (const c of ciclos) {
    const Ts = c.puntos(200).map(p => p.P * p.V / c.nR), Tmax = Math.max(...Ts), Tmin = Math.min(...Ts);
    assert.ok(c.eficiencia < 1 - Tmin / Tmax);
    assert.equal(motor.juzgar({ Tc: Tmax, Tf: Tmin, Qc: c.Qabs, W: c.W }).viola, 'ninguna');
  }
  // una máquina «sin rozamiento» no llega al 100 %
  assert.equal(motor.juzgar({ Tc: 500, Tf: 300, Qc: 1000, W: 1000 }).viola, 'segunda');
});
test('T4: toda compresión adiabática calienta el gas y toda expansión adiabática lo enfría', () => {
  for (const V2 of [2, 5, 9.9]) assert.ok(motor.proceso({ tipo: 'adiabatico', P1: 100, V1: 10, V2, T1: 300 }).final.T > 300);
  for (const V2 of [10.1, 20, 40]) assert.ok(motor.proceso({ tipo: 'adiabatico', P1: 100, V1: 10, V2, T1: 300 }).final.T < 300);
});
test('cv y cp: con el mismo calor, a volumen fijo T sube γ veces lo que sube a presión fija', () => {
  for (const gas of ['monoatomico', 'diatomico']) for (const Q of [500, 3000]) {
    const a = motor.proceso({ tipo: 'isocorico', P1: 200, V1: 10, Q, T1: 300, gas }), b = motor.proceso({ tipo: 'isobarico', P1: 200, V1: 10, Q, T1: 300, gas });
    cerca(a.dT / b.dT, a.gas.gamma, `${gas} Q=${Q}`);
  }
});
test('refrigerador: el COP de Carnot es el mayor posible', () => {
  for (const [Tc, Tf] of [[300, 250], [310, 270]]) {
    const lim = motor.refrigerador({ Qf: 100, W: 1, Tc, Tf }).copCarnot;
    assert.equal(motor.refrigerador({ Qf: lim * 10, W: 10.001, Tc, Tf }).posible, true);
    assert.equal(motor.refrigerador({ Qf: lim * 10, W: 9.99, Tc, Tf }).posible, false);
  }
});
test('límites: el estado final en los extremos queda dentro de la caja', () => {
  const caja = { Pmin: 20, Pmax: 500, Vmin: 2, Vmax: 40 };
  for (const tipo of ['isobarico', 'isocorico', 'isotermico', 'adiabatico']) {
    const l = motor.limites(Object.assign({ tipo, P1: 200, V1: 10 }, caja));
    for (const x of [l.min, l.max]) {
      const r = motor.proceso(Object.assign({ tipo, P1: 200, V1: 10, T1: 300 }, l.variable === 'P' ? { P2: x } : { V2: x }));
      assert.ok(r.final.P >= caja.Pmin - 1e-9 && r.final.P <= caja.Pmax + 1e-9 && r.final.V >= caja.Vmin - 1e-9 && r.final.V <= caja.Vmax + 1e-9, tipo);
    }
  }
});

// 4. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.proceso({ tipo: 'isobarico', P1: 0, V1: 1, V2: 2 }), /mayor que cero/);
  assert.throws(() => motor.proceso({ tipo: 'giratorio', P1: 1, V1: 1, V2: 2 }), /desconocido/);
  assert.throws(() => motor.proceso({ tipo: 'isobarico', P1: 1, V1: 1, V2: 2, Q: 3 }), /una sola/);
  assert.throws(() => motor.proceso({ tipo: 'isobarico', P1: 1, V1: 1, P2: 2 }), /no cambia/);
  assert.throws(() => motor.proceso({ tipo: 'isocorico', P1: 1, V1: 1, V2: 2 }), /no cambia/);
  assert.throws(() => motor.proceso({ tipo: 'adiabatico', P1: 1, V1: 1, Q: 2 }), /no entra ni sale calor/);
  assert.throws(() => motor.proceso({ tipo: 'isobarico', P1: 1, V1: 1, T2: 300 }), /temperatura inicial/);
  assert.throws(() => motor.proceso({ tipo: 'isobarico', P1: 100, V1: 1, Q: -1000 }), /no es posible/);
  assert.throws(() => motor.proceso({ tipo: 'recta', P1: 1, V1: 1, V2: 2 }), /P2 y V2/);
  assert.throws(() => motor.proceso({ tipo: 'isobarico', P1: 1, V1: 1, V2: 2, gas: 'plasma' }), /gas desconocido/);
  assert.throws(() => motor.camino({ P1: 1, V1: 1, tramos: [] }), /al menos un tramo/);
  assert.throws(() => motor.rectangulo({ Pa: 3, Pb: 1, Va: 1, Vb: 2 }), /Pa < Pb/);
  assert.throws(() => motor.primeraLey({ Q: 1 }), /dos de/);
  assert.throws(() => motor.carnot({ Tc: 300, Tf: 400 }), /más caliente/);
  assert.throws(() => motor.carnot({ Tc: 100, Tf: -300, unidad: 'C' }), /cero absoluto/);
  assert.throws(() => motor.carnot({ Tc: 100, Tf: 20, unidad: 'F' }), /unidad desconocida/);
  assert.throws(() => motor.maquina({ Qc: 100, W: 10, Qf: 90 }), /uno solo/);
  assert.throws(() => motor.refrigerador({ Qf: 100, Qc: 90 }), /mayor que cero|necesita trabajo/);
  assert.throws(() => motor.carnotCiclo({ Tc: 500, Tf: 300, V1: 10, V2: 5, nR: 1 }), /V2 > V1/);
  assert.throws(() => motor.estado({ P: 1, V: 1 }), /faltan datos/);
  assert.throws(() => motor.proceso({ tipo: 'isobarico', P1: 'mucha', V1: 1, V2: 2 }), /inválido/);
});

// 5. Problemas de papel (regla 6)
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
