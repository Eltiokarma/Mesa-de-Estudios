// Pruebas del motor de «El ángulo que no cambia». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con figuras al azar (semilla fija): el inscrito medido con vectores es la mitad del arco
//    que abarca, en cualquiera de los dos arcos y en cualquier punto P (GE12, GE15); en la semicircunferencia
//    es 90°; el semiinscrito; interior, exterior (dos secantes, secante y tangente, dos tangentes) e inscrito
//    calculados con coordenadas coinciden con la fórmula de arcos (GE16); los arcos de dos cuerdas suman 360°;
//    el cuadrilátero inscrito tiene los opuestos suplementarios; el ángulo de la cancha es mayor dentro y menor
//    fuera; longitud de arco y sector (GE19).
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
  assert.equal(datos.plantilla, 'angulo-inscrito');
  assert.ok(datos.casos.length >= 15 && datos.casos.length <= 20);
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera, JSON.stringify(c).slice(0, 80));
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Propiedades
const rnd = motor.azar(2026);
const al = (a, b) => a + (b - a) * rnd();
const N = 400;
// tres ángulos separados al menos 'sep' grados
function separados(n, sep) {
  for (;;) {
    const v = Array.from({ length: n }, () => al(0, 360));
    let ok = true;
    for (let i = 0; i < n && ok; i++) for (let j = i + 1; j < n; j++) { const d = motor.ccw(v[i], v[j]); if (d < sep || 360 - d < sep) { ok = false; break; } }
    if (ok) return v;
  }
}
const circulo = () => ({ r: al(0.5, 20), O: { x: al(-10, 10), y: al(-10, 10) } });

test('GE12 y GE15: el inscrito medido con vectores es la mitad del arco que abarca, en cualquier punto de cualquiera de los dos arcos', () => {
  const vistos = new Set();
  for (let k = 0; k < N; k++) {
    const [a, b, p] = separados(3, 2), { r, O } = circulo(), ins = motor.inscrito(a, b, p, r, O);
    cerca(ins.porCoordenadas, ins.angulo, 'coordenadas = arco/2', 1e-8);
    cerca(ins.arcoAbarcado + ins.arcoConP, 360, 'los dos arcos suman 360°');
    // el central AOB (por coordenadas) es el arco menor; si P está en el mayor, el inscrito es su mitad
    cerca(motor.central(a, b, r, O).angulo, ins.arcoMenor, 'central = arco menor', 1e-8);
    if (ins.pEnArco === 'mayor') cerca(ins.angulo, ins.central / 2, 'mitad del central');
    if (ins.pEnArco === 'menor') cerca(ins.angulo, 180 - ins.central / 2, '180° − la mitad del central');
    vistos.add(ins.pEnArco);
    // otro punto del mismo arco ve AB con el mismo ángulo (el ángulo no cambia)
    const q = motor.n360(a + (ins.pEnArco === 'mayor' === (motor.ccw(a, b) <= 180) ? motor.ccw(a, b) + al(0.05, 0.95) * (360 - motor.ccw(a, b)) : al(0.05, 0.95) * motor.ccw(a, b)));
    const otro = motor.inscrito(a, b, q, r, O);
    if (otro.pEnArco === ins.pEnArco) cerca(otro.porCoordenadas, ins.porCoordenadas, 'mismo arco, mismo ángulo', 1e-8);
    // los errores típicos dan otra cosa
    assert.ok(Math.abs(ins.errores.igualArco - ins.angulo) > 1e-6 && Math.abs(ins.errores.dobleArco - ins.angulo) > 1e-6);
  }
  assert.ok(vistos.has('mayor') && vistos.has('menor'), 'el azar cubre los dos arcos');
});
test('en la semicircunferencia, el inscrito mide 90° (y los vectores PA y PB son perpendiculares)', () => {
  for (let k = 0; k < N; k++) {
    const a = al(0, 360), b = a + 180, p = a + al(1, 179) * (rnd() < 0.5 ? 1 : -1), { r, O } = circulo();
    const ins = motor.inscrito(a, b, p, r, O);
    assert.equal(ins.recto, true); assert.equal(ins.pEnArco, 'semicircunferencia');
    cerca(ins.porCoordenadas, 90, 'recto', 1e-8);
    const PA = { x: ins.A.x - ins.P.x, y: ins.A.y - ins.P.y }, PB = { x: ins.B.x - ins.P.x, y: ins.B.y - ins.P.y };
    assert.ok(Math.abs(PA.x * PB.x + PA.y * PB.y) <= 1e-8 * r * r * 4, 'PA · PB = 0');
  }
});
test('semiinscrito: el ángulo entre la tangente y la cuerda es la mitad del arco de su lado, y es el límite del inscrito', () => {
  for (let k = 0; k < N; k++) {
    const [a, b] = separados(2, 2), { r, O } = circulo(), s = motor.semiinscrito(a, b, r, O), ar = motor.arcos(a, b);
    cerca(s.haciaMenor, ar.menor / 2, 'lado del menor', 1e-8); cerca(s.haciaMayor, ar.mayor / 2, 'lado del mayor', 1e-8);
    cerca(s.haciaMenor + s.haciaMayor, 180, 'suman 180°', 1e-8);
    assert.ok(Math.abs(s.tangentePorRadio) <= 1e-9, 'tangente ⟂ radio');
    // P en el arco mayor, muy cerca de A: el inscrito ya vale lo mismo que el semiinscrito
    const haciaMayor = motor.ccw(a, b) <= 180 ? -1 : 1, p = a + haciaMayor * 1e-4;
    cerca(motor.inscrito(a, b, p, r, O).porCoordenadas, s.haciaMenor, 'límite del inscrito', 1e-6);
  }
});
test('GE16: dos cuerdas que se cortan dentro: el ángulo con vectores es la semisuma de los arcos', () => {
  for (let k = 0; k < N; k++) {
    // a1, b1, a2, b2 alternados en la curva: las cuerdas a1–a2 y b1–b2 se cortan dentro
    const v = separados(4, 3).sort((x, y) => x - y), { r, O } = circulo();
    const res = motor.rectasPorPuntos(v[0], v[2], v[1], v[3], r, O);
    assert.equal(res.tipo, 'interior'); assert.equal(res.posicion, 'dentro');
    cerca(res.angulo, res.porArcos, 'coordenadas = (arco1 + arco2)/2', 1e-8);
    cerca(res.porArcos, motor.interior(res.arcos.entreLados, res.arcos.opuesto).angulo, 'fórmula', 1e-9);
    // los arcos entre los lados del ángulo son los de los extremos de las cuerdas
    cerca(res.arcos.entreLados, motor.ccw(v[0], v[1]), 'arco AB', 1e-7); cerca(res.arcos.opuesto, motor.ccw(v[2], v[3]), 'arco CD', 1e-7);
    // el ángulo vecino (180° − el ángulo) abarca los otros dos arcos
    cerca(180 - res.angulo, (motor.ccw(v[1], v[2]) + motor.ccw(v[3], v[0])) / 2, 'el vecino', 1e-7);
    assert.ok(res.angulo > res.errores.resta - 1e-12, 'restar da menos');
  }
});
test('GE16: Q dentro con dos rayos cualesquiera, coordenadas = fórmula', () => {
  for (let k = 0; k < N; k++) {
    const { r, O } = circulo(), t = al(0, 0.98) * r, f = al(0, 360);
    const Q = { x: O.x + t * Math.cos(f), y: O.y + t * Math.sin(f) }, d1 = al(0, 360), d2 = d1 + al(2, 178) * (rnd() < 0.5 ? 1 : -1);
    const res = motor.dosRectas(Q, d1, d2, r, O);
    assert.equal(res.tipo, 'interior');
    cerca(res.angulo, res.porArcos, 'coordenadas = semisuma', 1e-7);
    cerca(res.arcos.entreLados + res.arcos.opuesto, 2 * res.angulo, 'arcos', 1e-7);
  }
});
test('GE16: dos secantes desde fuera: coordenadas = semidiferencia; y con la figura armada por arcos', () => {
  for (let k = 0; k < N; k++) {
    const { r, O } = circulo(), q = al(0, 360), d = al(1.05, 6) * r;
    const Q = { x: O.x + d * Math.cos(q * Math.PI / 180), y: O.y + d * Math.sin(q * Math.PI / 180) };
    // los rayos hacia la circunferencia forman con QO un ángulo menor que asin(r/d)
    const m = Math.asin(r / d) * 180 / Math.PI * 0.98, haciaO = q + 180;
    const d1 = haciaO + al(-m, m), d2 = haciaO + al(-m, m);
    if (Math.abs(d1 - d2) < 0.5) continue;
    const res = motor.dosRectas(Q, d1, d2, r, O);
    assert.equal(res.tipo, 'exterior'); assert.equal(res.subtipo, 'dos secantes');
    cerca(res.angulo, res.porArcos, 'coordenadas = (lejano − cercano)/2', 1e-7);
    assert.ok(res.arcos.lejano > res.arcos.cercano);
    cerca(res.porArcos, motor.exterior(res.arcos.lejano, res.arcos.cercano).angulo, 'fórmula', 1e-9);
    // armar la figura con esos arcos da el mismo ángulo
    const L = al(10, 300), c = al(1, Math.min(L - 1, 359 - L)), e = motor.exteriorConArcos(L, c, r, al(0, 360));
    cerca(e.angulo, (L - c) / 2, 'figura armada', 1e-7); cerca(e.arcos.lejano, L, 'lejano', 1e-7); cerca(e.arcos.cercano, c, 'cercano', 1e-7);
    const i = motor.interiorConArcos(L, c, r, al(0, 360));
    cerca(i.angulo, (L + c) / 2, 'interior armado', 1e-7);
  }
});
test('GE16: secante y tangente, y dos tangentes: coordenadas = fórmula; las tangentes miden lo mismo y son perpendiculares al radio', () => {
  for (let k = 0; k < N; k++) {
    const { r, O } = circulo(), q = al(0, 360), d = al(1.05, 8) * r;
    const Q = { x: O.x + d * Math.cos(q * Math.PI / 180), y: O.y + d * Math.sin(q * Math.PI / 180) };
    const t = motor.tangentes(Q, r, O);
    cerca(t.longitudes[0], t.longitudes[1], 'tangentes iguales', 1e-9); cerca(t.longitud, t.longitudes[0], 'longitud', 1e-9);
    for (const x of t.perpendicular) assert.ok(Math.abs(x) <= 1e-7 * d * r);
    cerca(t.angulo, 180 - t.cercano, 'ángulo = 180° − arco cercano', 1e-7);
    assert.equal(t.dosRectas.subtipo, 'dos tangentes'); cerca(t.dosRectas.porArcos, t.angulo, 'dosRectas', 1e-7);
    cerca(motor.dosTangentes(t.cercano).angulo, t.angulo, 'fórmula', 1e-7);
    // una tangente y una secante hacia el centro
    const dirT = Math.atan2(t.puntos[0].y - Q.y, t.puntos[0].x - Q.x) * 180 / Math.PI, dirO = q + 180 + al(-1, 1) * 0.5 * (90 - Math.acos(r / d) * 180 / Math.PI);
    const st = motor.dosRectas(Q, dirT, dirO, r, O);
    assert.equal(st.subtipo, 'secante y tangente');
    cerca(st.angulo, st.porArcos, 'secante y tangente: coordenadas = fórmula', 1e-6);
  }
});
test('cuando Q cruza la circunferencia, el ángulo pasa de semidiferencia a inscrito y a semisuma', () => {
  // A y B fijos (arco de 110°); C y D se acercan, se juntan en un punto de la curva y se cruzan
  const pasos = [];
  for (const c of [150, 160, 170, 175, 180, 185, 190, 200, 210]) {
    const d = 360 - c, res = motor.rectasPorPuntos(55, c, 305, d, 5);
    pasos.push(res.tipo);
    if (res.tipo === 'exterior') cerca(res.angulo, (110 - Math.abs(d - c)) / 2, `exterior c=${c}`, 1e-7);
    if (res.tipo === 'interior') cerca(res.angulo, (110 + Math.abs(d - c)) / 2, `interior c=${c}`, 1e-7);
    if (res.tipo === 'inscrito') cerca(res.angulo, 55, 'inscrito', 1e-7);
  }
  assert.deepEqual(pasos, ['exterior', 'exterior', 'exterior', 'exterior', 'inscrito', 'interior', 'interior', 'interior', 'interior']);
});
test('cuadrilátero inscrito: los opuestos suman 180° y los ángulos suman 360°', () => {
  for (let k = 0; k < N; k++) {
    const v = separados(4, 2).sort((x, y) => x - y), { r, O } = circulo();
    const orden = rnd() < 0.5 ? v : v.slice().reverse(), c = motor.cuadrilatero(orden, r, O);
    cerca(c.opuestos[0], 180, 'A + C', 1e-8); cerca(c.opuestos[1], 180, 'B + D', 1e-8); cerca(c.suma, 360, 'suma', 1e-8);
    c.angulos.forEach((x, i) => cerca(x, c.porArcos[i], `vértice ${i}: coordenadas = arco/2`, 1e-8));
  }
});
test('el ángulo de la cancha: igual sobre la curva, mayor dentro y menor fuera (del mismo lado de AB)', () => {
  const vistos = new Set();
  for (let k = 0; k < N; k++) {
    const [a, b] = separados(2, 10), { r, O } = circulo();
    const p = motor.n360(a + motor.ccw(a, b) + al(0.05, 0.95) * (360 - motor.ccw(a, b)));   // P del lado del arco que no es el antihorario AB
    const P = motor.puntoEn(p, r, O), ins = motor.inscrito(a, b, p, r, O);
    const ms = motor.puntoEn(motor.n360(a + motor.ccw(a, b) / 2), r, O);   // punto medio del arco AB del otro lado
    const s = al(0.03, 0.97), dentro = { x: ms.x + (P.x - ms.x) * s, y: ms.y + (P.y - ms.y) * s };   // dentro: en la cuerda que une los dos arcos
    const fuera = { x: O.x + (P.x - O.x) * al(1.05, 3), y: O.y + (P.y - O.y) * al(1.05, 3) };
    const X = motor.anguloDesde(P, a, b, r, O);
    cerca(X.angulo, ins.porCoordenadas, 'sobre', 1e-8); cerca(X.inscrito, ins.angulo, 'inscrito', 1e-9);
    for (const [Y, esperado] of [[dentro, 'mayor'], [fuera, 'menor']]) {
      let res;
      try { res = motor.anguloDesde(Y, a, b, r, O); } catch (e) { continue; }   // en la recta AB
      const A = motor.puntoEn(a, r, O), B = motor.puntoEn(b, r, O), lado = (B.x - A.x) * (Y.y - A.y) - (B.y - A.y) * (Y.x - A.x);
      const ladoP = (B.x - A.x) * (P.y - A.y) - (B.y - A.y) * (P.x - A.x);
      if (Math.sign(lado) !== Math.sign(ladoP)) continue;   // del otro lado de AB
      assert.equal(res.comparado, esperado, `${esperado}: ${res.angulo} frente a ${res.inscrito}`);
      // y con dos rayos desde Y hacia A y B, la fórmula de arcos da lo mismo
      const dr = motor.dosRectas(Y, Math.atan2(A.y - Y.y, A.x - Y.x) * 180 / Math.PI, Math.atan2(B.y - Y.y, B.x - Y.x) * 180 / Math.PI, r, O);
      cerca(dr.porArcos, res.angulo, 'dosRectas', 1e-6);
      vistos.add(esperado);
    }
  }
  assert.ok(vistos.has('mayor') && vistos.has('menor'));
});
test('GE19: longitud de arco y sector', () => {
  for (let k = 0; k < N; k++) {
    const t = al(1, 360), r = al(0.1, 50), l = motor.longitudArco(t, r), s = motor.sector(t, r);
    cerca(l.longitud, l.pi * Math.PI, 'π aparte'); cerca(s.area, s.pi * Math.PI, 'π aparte');
    cerca(l.longitud, (t / 360) * 2 * Math.PI * r, 'θ/360 · 2πr'); cerca(s.area, (t / 360) * Math.PI * r * r, 'θ/360 · πr²');
    cerca(s.area, l.longitud * r / 2, 'sector = arco · r / 2');
    cerca(l.errores.conDiametro, 2 * l.pi, 'con el diámetro, el doble'); cerca(s.errores.conDiametro, 4 * s.pi, 'con el diámetro, el cuádruple');
  }
  cerca(motor.longitudArco(360, 3).pi, 6, 'vuelta completa'); cerca(motor.sector(360, 3).pi, 9, 'círculo');
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.inscrito(10, 10, 90), /coinciden/);
  assert.throws(() => motor.inscrito(10, 370, 90), /coinciden/);
  assert.throws(() => motor.inscrito(10, 100, 10), /coinciden/);
  assert.throws(() => motor.inscrito('a', 100, 10), /número/);
  assert.throws(() => motor.inscrito(10, 100, 200, -1), /mayor que cero/);
  assert.throws(() => motor.inscrito(10, 100, 200, 1, { x: 'a', y: 0 }), /numéricas/);
  assert.throws(() => motor.dosRectas({ x: 0, y: 0 }, 10, 190), /misma/);
  assert.throws(() => motor.dosRectas({ x: 0, y: 3 }, 0, 10), /no corta/);
  assert.throws(() => motor.dosRectas({ x: 0, y: 3 }, 80, 100), /no va hacia/);
  assert.throws(() => motor.rectasPorPuntos(0, 180, 10, 170), /paralelas/);
  assert.throws(() => motor.rectasPorPuntos(0, 0, 10, 170), /coinciden/);
  assert.throws(() => motor.exterior(30, 110), /mayor que el cercano/);
  assert.throws(() => motor.exterior(300, 100), /más de 360/);
  assert.throws(() => motor.exteriorConArcos(200, 170), /menos de 360/);
  assert.throws(() => motor.interior(200, 160), /menos de 360/);
  assert.throws(() => motor.dosTangentes(200), /menor de 180/);
  assert.throws(() => motor.tangentes({ x: 0.5, y: 0 }), /fuera/);
  assert.throws(() => motor.anguloDesde({ x: 0, y: 0 }, 180, 0), /recta AB/);
  assert.throws(() => motor.cuadrilatero([0, 180, 90, 270]), /orden/);
  assert.throws(() => motor.cuadrilatero([0, 90, 180]), /cuatro/);
  assert.throws(() => motor.longitudArco(0, 6), /mayor que cero/);
  assert.throws(() => motor.longitudArco(400, 6), /360/);
  assert.throws(() => motor.sector(60, '6'), /número/);
  assert.throws(() => motor.anguloDe({ x: 0, y: 0 }), /centro/);
  // acepta [x, y]
  cerca(motor.dosRectas([0, 10], -60, -120, 5).angulo, 60, 'con listas');
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
