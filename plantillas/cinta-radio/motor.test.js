// Pruebas del motor de «La cinta del radio». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con ángulos y radios al azar (semilla fija): S/180 = C/200 = R/π y la ida y vuelta entre
//    sistemas; grados, minutos y segundos que se rearman; L = θr y A = θr²/2 = L·r/2 con dos datos
//    cualesquiera; las cintas no dependen del radio (TR2, TR6) y al escalar el radio el arco va por k y el área
//    por k²; la cinta doblada mide siempre r; el trapecio es la resta de dos sectores; la rueda avanza 2πr por
//    vuelta y su marca toca el piso al final de cada vuelta; la moneda alrededor del disco; faja y eje; los
//    tramos de la faja son tangentes.
// 3. Errores de entrada.
// 4. Cada problema de papel.json coincide con el motor.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const motor = require('./motor.js');
const PI = Math.PI;

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
  assert.equal(datos.plantilla, 'cinta-radio');
  assert.ok(datos.casos.length >= 15 && datos.casos.length <= 20);
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera, JSON.stringify(c).slice(0, 80));
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Propiedades
let semilla = 2026;
const rnd = () => (semilla = (Math.imul(semilla, 1664525) + 1013904223) >>> 0) / 4294967296;
const al = (a, b) => a + (b - a) * rnd();
const N = 400;

test('S/180 = C/200 = R/π, desde cualquiera de los cuatro datos, y la ida y vuelta', () => {
  for (let k = 0; k < N; k++) {
    const S = al(-720, 720);
    const a = motor.convertir({ S });
    for (const b of [motor.convertir({ C: a.C }), motor.convertir({ R: a.R }), motor.convertir({ Rpi: a.Rpi })]) {
      cerca(b.S, S, 'S'); cerca(b.C, a.C, 'C'); cerca(b.R, a.R, 'R');
    }
    cerca(a.S / 180, a.C / 200, 'S/180 = C/200'); cerca(a.C / 200, a.R / PI, 'C/200 = R/π');
    cerca(a.vueltas, S / 360, 'vueltas');
    cerca(motor.radianes(S, 'sex'), a.R, 'radianes(sex)'); cerca(motor.radianes(a.C, 'cent'), a.R, 'radianes(cent)');
    cerca(motor.radianes(a.Rpi, 'pi'), a.R, 'radianes(pi)'); cerca(motor.radianes(S / 360, 'vueltas'), a.R, 'radianes(vueltas)');
  }
  // un radián no es un grado: 1 rad ≈ 57,3°
  assert.ok(motor.convertir({ R: 1 }).S > 57 && motor.convertir({ R: 1 }).S < 58);
});
test('grados, minutos y segundos: se rearman, y nunca hay 60 segundos ni 100 minutos', () => {
  for (let k = 0; k < N; k++) {
    const S = al(0, 360), p = motor.sexagesimal(S);
    assert.ok(p.minutos < 60 && p.segundos < 60 && p.segundos >= 0);
    cerca(p.grados + p.minutos / 60 + p.segundos / 3600, S, 'sexagesimal');
    cerca(motor.desdeSexagesimal(p.grados, p.minutos, p.segundos).S, S, 'desdeSexagesimal', 1e-8);
    const C = al(0, 400), q = motor.centesimal(C);
    assert.ok(q.minutos < 100 && q.segundos < 100 && q.segundos >= 0);
    cerca(q.grados + q.minutos / 100 + q.segundos / 10000, C, 'centesimal');
    cerca(motor.desdeCentesimal(q.grados, q.minutos, q.segundos).C, C, 'desdeCentesimal', 1e-8);
  }
  // 30° exactos: 30°0'0", no 29°59'60"
  const t = motor.sexagesimal(0.1 + 0.2 + 29.7);
  assert.equal(t.grados, 30); assert.equal(t.minutos, 0); cerca(t.segundos, 0, 'segundos');
});
test('textoPi y fraccion escriben π como en el examen', () => {
  assert.equal(motor.textoPi(1), 'π'); assert.equal(motor.textoPi(2), '2π'); assert.equal(motor.textoPi(1 / 3), 'π/3');
  assert.equal(motor.textoPi(5 / 6), '5π/6'); assert.equal(motor.textoPi(-1 / 2), '−π/2'); assert.equal(motor.textoPi(0), '0');
  assert.equal(motor.textoPi(1 / PI), null);
  assert.deepEqual(motor.fraccion(0.75), { num: 3, den: 4 });
});
test('sector: con dos datos cualesquiera sale lo mismo; L = θr, A = θr²/2 = L·r/2', () => {
  for (let k = 0; k < N; k++) {
    const th = al(0.01, 2 * PI), r = al(0.1, 50), s = motor.sector({ theta: th, r });
    cerca(s.L, th * r, 'L'); cerca(s.A, th * r * r / 2, 'A'); cerca(s.A, s.ALr, 'A = L·r/2'); cerca(s.cintas, s.L / s.r, 'cintas = L/r');
    for (const o of [{ L: s.L, r }, { theta: th, L: s.L }, { theta: th, A: s.A }, { L: s.L, A: s.A }, { r, A: s.A },
      { theta: s.grados, unidad: 'sex', r }, { theta: s.centesimales, unidad: 'cent', r }, { theta: s.thetaPi, unidad: 'pi', r }]) {
      const b = motor.sector(o);
      cerca(b.theta, th, 'θ', 1e-8); cerca(b.r, r, 'r', 1e-8); cerca(b.A, s.A, 'A', 1e-8);
    }
    // los errores típicos dan otra cosa (salvo coincidencias)
    assert.ok(s.errores.arcoConGrados > s.L, 'con grados el arco sale más grande');
    cerca(s.errores.areaSinMitad, 2 * s.A, 'sin el ½');
  }
});
test('TR2 y TR6: al cambiar el radio con el mismo ángulo, las cintas no cambian; el arco va por k y el área por k²', () => {
  for (let k = 0; k < N; k++) {
    const th = al(0.05, 2 * PI), r = al(0.5, 20), f = al(0.2, 5), e = motor.escalarRadio({ theta: th, r }, f);
    cerca(e.cintasDespues, e.cintasAntes, 'cintas'); cerca(e.razonL, f, 'arco por k'); cerca(e.razonA, f * f, 'área por k²');
    cerca(motor.cintas(e.despues.cintas).total, motor.cintas(e.antes.cintas).total, 'cintas()');
    cerca(e.errores.cintasProporcionales, th * f, 'error proporcional');
  }
});
test('cintas: los tramos cubren el arco, de una en una; la cinta doblada mide siempre r', () => {
  for (let k = 0; k < N; k++) {
    const th = al(0, 7), c = motor.cintas(th);
    assert.equal(c.tramos.length, Math.ceil(th - 1e-9));
    const suma = c.tramos.reduce((s, t) => s + (t.hasta - t.desde), 0);
    cerca(suma, th, 'suma de tramos'); cerca(c.enteras + c.resto, th, 'enteras + resto');
    c.tramos.forEach((t, j) => { cerca(t.desde, j, 'desde'); if (t.completa) cerca(t.hasta - t.desde, 1, 'una cinta'); });
    const r = al(0.5, 8), f = rnd(), d = motor.cintaDoblada(r, f, al(-PI, PI), 2000);
    cerca(d.enArco + d.recto, r, 'largo de la cinta'); cerca(d.largo, r, 'largo medido', 1e-5);
    const p0 = d.puntos[0]; cerca(Math.hypot(p0.x, p0.y), r, 'empieza en la circunferencia');
  }
});
test('trapecio circular: es el sector grande menos el chico, por los dos caminos', () => {
  for (let k = 0; k < N; k++) {
    const r1 = al(0.5, 10), r2 = r1 + al(0.1, 10), th = al(0.05, 2 * PI), t = motor.trapecio({ r1, r2, theta: th });
    cerca(t.A, motor.sector({ theta: th, r: r2 }).A - motor.sector({ theta: th, r: r1 }).A, 'resta de sectores');
    cerca(t.A, t.Asectores, 'Asectores');
    const u = motor.trapecio({ L1: t.L1, L2: t.L2, h: t.h });
    cerca(u.A, t.A, 'A'); cerca(u.theta, th, 'θ', 1e-8); cerca(u.r1, r1, 'r1', 1e-8);
  }
});
test('rueda: avanza 2πr por vuelta y la marca vuelve al piso al final de cada vuelta', () => {
  for (let k = 0; k < N; k++) {
    const r = al(0.1, 50), n = Math.floor(al(1, 12)), v = motor.vueltas({ d: 2 * PI * r * n, r });
    cerca(v.n, n, 'vueltas'); cerca(motor.vueltas({ n, r }).d, 2 * PI * r * n, 'd'); cerca(motor.vueltas({ d: v.d, n }).r, r, 'r');
    const f = motor.rodar(r, v.d);
    cerca(f.marca.y, 0, 'marca en el piso', 1e-8); cerca(f.marca.x, v.d, 'marca donde toca', 1e-8);
    // a media vuelta, la marca está arriba, a 2r del piso
    const m = motor.rodar(r, PI * r); cerca(m.marca.y, 2 * r, 'arriba');
    cerca(v.errores.sinDosPi, 2 * PI * n, 'd/r son radianes');
  }
});
test('moneda alrededor de un disco: (fijo ± r)/r vueltas; al recorrer phi, gira phi·(fijo ± r)/r', () => {
  for (let k = 0; k < N; k++) {
    const r = al(0.2, 3), R = r * al(1.2, 8), phi = al(0, 2 * PI);
    const fu = motor.alrededor({ fijo: R, r, lado: 'fuera', phi }), de = motor.alrededor({ fijo: R, r, lado: 'dentro', phi });
    cerca(fu.vueltas - de.vueltas, 2, 'por fuera da 2 vueltas más que por dentro');
    cerca(fu.vueltas, R / r + 1, 'una vuelta más que el arco'); cerca(fu.giro, phi * (R + r) / r, 'giro por fuera');
    cerca(de.giro, -phi * (R - r) / r, 'giro por dentro'); cerca(Math.hypot(fu.centro.x, fu.centro.y), R + r, 'centro a R + r');
  }
});
test('faja y engranaje: mismo arco (θ1·r1 = θ2·r2); mismo eje: mismo ángulo', () => {
  for (let k = 0; k < N; k++) {
    const r1 = al(0.5, 20), r2 = al(0.5, 20), n1 = al(0.1, 50);
    for (const union of ['faja', 'cruzada', 'engranaje']) {
      const t = motor.transmision({ r1, r2, union, n1 });
      cerca(t.L1, t.L2, 'mismo arco'); cerca(t.n2 * r2, n1 * r1, 'n1·r1 = n2·r2');
    }
    const e = motor.transmision({ r1, r2, union: 'eje', n1 });
    cerca(e.theta2, e.theta1, 'mismo ángulo'); cerca(e.L2 / e.L1, r2 / r1, 'arcos proporcionales al radio');
    assert.equal(motor.transmision({ r1, r2, union: 'engranaje', n1 }).mismoSentido, false);
    assert.equal(motor.transmision({ r1, r2, union: 'faja', n1 }).mismoSentido, true);
  }
});
test('bicicleta: la cadena mueve el mismo largo en el plato y en el piñón; el piñón y la rueda giran juntos', () => {
  for (let k = 0; k < N; k++) {
    const plato = al(5, 15), pinon = al(2, 6), rueda = al(20, 40), n = al(0.5, 10), b = motor.bicicleta({ plato, pinon, rueda, vueltasPedal: n });
    cerca(b.cadena, b.vueltasPinon * 2 * PI * pinon, 'cadena');
    cerca(b.vueltasRueda, b.vueltasPinon, 'mismo eje'); cerca(b.avance, motor.vueltas({ n: b.vueltasRueda, r: rueda }).d, 'avance');
  }
});
test('faja abierta: cada tramo es tangente a las dos ruedas', () => {
  for (let k = 0; k < N; k++) {
    const c1 = { x: al(-10, 10), y: al(-10, 10) }, r1 = al(0.5, 4), r2 = al(0.5, 4);
    const ang = al(0, 2 * PI), d = Math.abs(r1 - r2) + al(0.5, 20), c2 = { x: c1.x + d * Math.cos(ang), y: c1.y + d * Math.sin(ang) };
    for (const t of motor.tangentesExternas(c1, r1, c2, r2)) {
      const u = { x: t.p2.x - t.p1.x, y: t.p2.y - t.p1.y };
      cerca(Math.hypot(t.p1.x - c1.x, t.p1.y - c1.y), r1, 'p1 en la rueda 1'); cerca(Math.hypot(t.p2.x - c2.x, t.p2.y - c2.y), r2, 'p2 en la rueda 2');
      cerca((t.p1.x - c1.x) * u.x + (t.p1.y - c1.y) * u.y, 0, 'perpendicular al radio 1', 1e-8);
      cerca((t.p2.x - c2.x) * u.x + (t.p2.y - c2.y) * u.y, 0, 'perpendicular al radio 2', 1e-8);
    }
  }
});

test('faja cruzada: cada tramo es tangente a las dos ruedas y pasa entre ellas', () => {
  for (let k = 0; k < N; k++) {
    const c1 = { x: al(-10, 10), y: al(-10, 10) }, r1 = al(0.5, 4), r2 = al(0.5, 4);
    const ang = al(0, 2 * PI), d = r1 + r2 + al(0.5, 20), c2 = { x: c1.x + d * Math.cos(ang), y: c1.y + d * Math.sin(ang) };
    for (const t of motor.tangentesInternas(c1, r1, c2, r2)) {
      const u = { x: t.p2.x - t.p1.x, y: t.p2.y - t.p1.y };
      cerca(Math.hypot(t.p1.x - c1.x, t.p1.y - c1.y), r1, 'p1'); cerca(Math.hypot(t.p2.x - c2.x, t.p2.y - c2.y), r2, 'p2');
      cerca((t.p1.x - c1.x) * u.x + (t.p1.y - c1.y) * u.y, 0, 'perpendicular 1', 1e-8);
      cerca((t.p2.x - c2.x) * u.x + (t.p2.y - c2.y) * u.y, 0, 'perpendicular 2', 1e-8);
      // los centros quedan a lados opuestos de la recta del tramo
      const lado = q => u.x * (q.y - t.p1.y) - u.y * (q.x - t.p1.x);
      assert.ok(lado(c1) * lado(c2) < 0, 'pasa entre las ruedas');
    }
  }
  assert.throws(() => motor.tangentesInternas({ x: 0, y: 0 }, 2, { x: 3, y: 0 }, 2), /cruzada/);
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.convertir({}), /exactamente una/);
  assert.throws(() => motor.convertir({ S: 30, C: 20 }), /exactamente una/);
  assert.throws(() => motor.convertir({ S: '30' }), /número/);
  assert.throws(() => motor.desdeSexagesimal(10, 60, 0), /menores que 60/);
  assert.throws(() => motor.desdeCentesimal(10, 20, 100), /menores que 100/);
  assert.throws(() => motor.desdeSexagesimal(10, -1, 0), /negativos/);
  assert.throws(() => motor.resolverSCR({ S: 10, C: -9 }, 3), /no determina/);
  assert.throws(() => motor.radianes(30, 'grados'), /unidad desconocida/);
  assert.throws(() => motor.sector({ r: 3 }), /dos datos/);
  assert.throws(() => motor.sector({ r: 3, theta: 1, L: 3 }), /dos datos/);
  assert.throws(() => motor.sector({ r: -3, theta: 1 }), /mayor que cero/);
  assert.throws(() => motor.sector({ r: 3, theta: 0 }), /mayor que cero/);
  assert.throws(() => motor.sector({ r: 3, theta: 400, unidad: 'sex' }), /una vuelta/);
  assert.throws(() => motor.escalarRadio({ r: 3, theta: 1 }, 0), /mayor que cero/);
  assert.throws(() => motor.trapecio({ r1: 5, r2: 4, theta: 1 }), /mayor que el menor/);
  assert.throws(() => motor.trapecio({ L1: 5, L2: 4, h: 1 }), /mayor que el menor/);
  assert.throws(() => motor.cintas(-1), /negativo/);
  assert.throws(() => motor.vueltas({ d: 10 }), /dos datos/);
  assert.throws(() => motor.vueltas({ d: 10, r: 0 }), /mayor que cero/);
  assert.throws(() => motor.alrededor({ fijo: 1, r: 2, lado: 'dentro' }), /más grande/);
  assert.throws(() => motor.alrededor({ fijo: 3, r: 1, lado: 'arriba' }), /lado/);
  assert.throws(() => motor.transmision({ r1: 2, r2: 3 }), /falta n1/);
  assert.throws(() => motor.transmision({ r1: 2, r2: 3, n1: 1, theta1: 2 }), /no los dos/);
  assert.throws(() => motor.transmision({ r1: 2, r2: 3, n1: 1, union: 'cuerda' }), /union/);
  assert.throws(() => motor.tangentesExternas({ x: 0, y: 0 }, 5, { x: 1, y: 0 }, 1), /dentro/);
  assert.throws(() => motor.bicicleta({ plato: 10, pinon: 4 }), /rueda/);
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
