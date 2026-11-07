// Pruebas del motor de «La lámpara y la placa: fotones y efecto fotoeléctrico». Se corren desde la raíz con:
// node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con datos al azar (semilla fija): Kmax = máx(0, hc/λ − φ), es una recta en f con pendiente h que
//    empieza en f₀, y V₀ tiene el mismo número que Kmax; bajo el umbral la corriente es cero con cualquier potencia y
//    cualquier voltaje; la corriente de saturación es proporcional a la potencia y V₀ no depende de ella; la curva
//    I–V crece con V y se anula en −V₀; los electrones del dibujo cumplen v² = K + V·x y, sorteando su energía como
//    lo hace la escena, la fracción que llega al colector es la del modelo de la corriente; N·E = P; Bohr cumple la
//    fórmula de Rydberg y las líneas de Balmer de 3 a 6 se ven; λmin·V es constante; los dos juegos de constantes
//    son consistentes por dentro.
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
  assert.ok(typeof real === 'number' && Math.abs(real - esperado) <= t * Math.abs(esperado) + (esperado === 0 ? 1e-15 : 0),
    `${que}: el motor da ${real}, se esperaba ${esperado}`);
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
test('casos.json: formato y casos pedidos', () => {
  assert.equal(datos.plantilla, 'fisica-moderna');
  assert.ok(datos.casos.length >= 16, 'al menos 16 casos');
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera, JSON.stringify(c).slice(0, 80));
  const nombres = datos.casos.map(c => c.nombre).join(' ');
  for (const t of ['sin emisión', 'con emisión', 'umbral', 'en joules', '33/8 eV', 'DOBLE', 'DUPLICA', '496 nm', '3,1 × 10¹⁵', '656 nm', 'Lyman', '0,04 nm', 'MITAD', 'zinc', 'ROJA', 'Wien', 'Incertidumbre', 'JUSTO'])
    assert.ok(nombres.includes(t), `falta el caso pedido: ${t}`);
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Propiedades
const rnd = motor.azar(2026);
const al = (a, b) => a + (b - a) * rnd();
const N_ = 300;
const K = motor.constantes();

test('fotoeléctrico: Kmax = máx(0, hc/λ − φ), V₀ con el mismo número, emite solo bajo λ₀ = hc/φ', () => {
  for (let k = 0; k < N_; k++) {
    const l = al(100, 900), phi = al(1.5, 6), r = motor.fotoelectrico(l, phi);
    cerca(r.E, 1240 / l, 'E = hc/λ');
    cerca(r.Kmax, Math.max(0, 1240 / l - phi), 'Kmax', 1e-8);
    assert.equal(r.V0, r.Kmax, 'V₀ = Kmax/e');
    assert.equal(r.emite, l < r.lambda0, 'emite si λ < λ₀');
    cerca(r.lambda0, 1240 / phi, 'λ₀'); cerca(r.f0, motor.C / (r.lambda0 * 1e-9), 'f₀ = c/λ₀', 1e-8);
    cerca(r.KmaxJ, r.Kmax * motor.E_CARGA, 'Kmax en J', 1e-8);
  }
});
test('la recta Kmax–f: pendiente h y corte en f₀; prolongada, corta el eje de Kmax en −φ', () => {
  for (let k = 0; k < N_; k++) {
    const phi = al(1.5, 5), l0 = 1240 / phi, l1 = al(80, l0 * 0.95), l2 = al(80, l0 * 0.95);
    if (Math.abs(l1 - l2) < 5) continue;
    const a = motor.fotoelectrico(l1, phi), b = motor.fotoelectrico(l2, phi), r = motor.rectaKf(a.f, a.Kmax, b.f, b.Kmax);
    cerca(r.h, K.hEv, 'pendiente h', 1e-7); cerca(r.phi, phi, 'φ', 1e-7); cerca(r.f0, a.f0, 'f₀', 1e-7);
  }
});
test('fototubo: sin emisión, cero con cualquier P y V; Isat ∝ P; V₀ no depende de P; I–V crece con V y se anula en −V₀', () => {
  for (let k = 0; k < N_; k++) {
    const phi = al(1.5, 5), l = al(150, 800), P = al(1e-4, 0.2), V = al(-8, 12), o = { lambda: l, phi, P, V };
    const r = motor.fototubo(o);
    if (!r.emite) { assert.equal(r.I, 0); assert.equal(motor.fototubo({ ...o, P: 2 * P, V: 20 }).I, 0); continue; }
    const d = motor.fototubo({ ...o, P: 2 * P });
    cerca(d.Isat, 2 * r.Isat, 'Isat ∝ P'); assert.equal(d.V0, r.V0, 'V₀ no depende de P');
    cerca(r.Isat, motor.ETA * motor.E_CARGA * P / (r.E * motor.E_CARGA), 'Isat = ηeN', 1e-8);
    assert.equal(motor.fototubo({ ...o, V: -r.V0 }).I, 0, 'cero en −V₀');
    assert.equal(motor.fototubo({ ...o, V: al(0, 30) }).I, r.Isat, 'saturación con V ≥ 0');
    const pts = motor.curvaIV(o, -r.V0 - 1, 3, 60);
    for (let j = 1; j < pts.length; j++) assert.ok(pts[j].I >= pts[j - 1].I - 1e-18, 'I crece con V');
  }
});
test('electrones del dibujo: v² = K + V·x mientras viajan; la fracción que llega es la del modelo de la corriente', () => {
  for (let k = 0; k < 200; k++) {
    const Kc = al(0.05, 4), V = al(-5, 6), t = al(0, 3), e = motor.electron(Kc, V, t);
    const viaja = (e.tLlega === null || t < e.tLlega) && (e.tVuelve === null || t < e.tVuelve);
    if (viaja) assert.ok(Math.abs(e.v * e.v - (Kc + V * e.x)) < 1e-9, `v² = K + Vx (K = ${Kc}, V = ${V}, t = ${t})`);
    if (e.xMax !== null) assert.ok(e.xMax < 1, 'da la vuelta antes del colector');
  }
  for (const [l, V] of [[310, -1], [310, -0.5], [250, -2], [400, -0.3], [310, 2]]) {
    const r = motor.fototubo({ lambda: l, phi: 2.5, P: 1e-3, V }), F = motor.fotoelectrico(l, 2.5), n = 20000;
    let llegan = 0;
    for (let j = 0; j < n; j++) { const Ke = motor.emitir(F.E, 2.5, rnd()); if (motor.electron(Ke, V, 0).llega) llegan++; }
    assert.ok(Math.abs(llegan / n - r.fraccion) < 0.015, `λ = ${l}, V = ${V}: ${llegan / n} contra ${r.fraccion}`);
  }
  assert.equal(motor.emitir(2, 2.5, 0.7), null, 'bajo el umbral no sale');
  // avanzarElectron con V fijo repite la trayectoria de electron()
  for (let k = 0; k < 100; k++) {
    const Kc = al(0.05, 4), V = al(-5, 6), dt = 0.01; let s = { x: 0, v: Math.sqrt(Kc) }, t = 0, fin = null;
    for (let j = 0; j < 2000 && !fin; j++) { const r = motor.avanzarElectron(s, V, dt); t += dt; s = r; if (r.llego) fin = 'llega'; else if (r.volvio) fin = 'vuelve'; else cerca(r.x, motor.electron(Kc, V, t).x, 'paso a paso', 1e-7); }
    const e = motor.electron(Kc, V, 0);
    if (fin) assert.equal(fin === 'llega', e.llega, `K = ${Kc}, V = ${V}`);
  }
});
test('cambioFototubo: los errores dicen lo que espera cada idea', () => {
  for (let k = 0; k < 100; k++) {
    const l = al(150, 480), o0 = { lambda: l, phi: 2.5, P: al(1e-4, 1e-2), V: 0 }, f = al(1.2, 4), o1 = { ...o0, P: o0.P * f };
    const c = motor.cambioFototubo(o0, o1);
    cerca(c.razonIsat, f, 'Isat se multiplica por f', 1e-8); assert.equal(c.cambioV0, 0);
    cerca(c.errores.intensidadSubeV0.V0, c.antes.V0 * f, 'V₀ ∝ P (error)', 1e-8);
    cerca(c.errores.intensidadEsEnergia.V0, c.antes.E * f - 2.5, 'E ∝ P (error)', 1e-8);
  }
});
test('fotones por segundo: N·E = P; los juegos de constantes son consistentes por dentro', () => {
  for (let k = 0; k < N_; k++) {
    const P = al(1e-5, 1), l = al(100, 1500);
    for (const j of ['eV', 'SI']) {
      const r = motor.fotonesPorSegundo(P, l, j), k2 = motor.constantes(j);
      cerca(r.N * r.EJ, P, 'N·E = P'); cerca(r.EJ, r.E * k2.e, 'E en J = E en eV · e');
      cerca(r.EJ, k2.h * k2.c / (l * 1e-9), 'E = hc/λ', 1e-8);
    }
  }
  cerca(motor.constantes('eV').hc, 1240, 'hc'); cerca(motor.constantes('SI').h, 6.6e-34, 'h');
});
test('Bohr: ΔE = 13,6·|1/nf² − 1/ni²|; Balmer de 3 a 6 se ve, Lyman es ultravioleta y Paschen infrarrojo', () => {
  for (let ni = 2; ni <= 8; ni++) for (let nf = 1; nf < ni; nf++) {
    const r = motor.transicion(ni, nf);
    cerca(r.E, 13.6 * (1 / (nf * nf) - 1 / (ni * ni)), 'Rydberg', 1e-9);
    cerca(r.lambda * r.E, 1240, 'λ = hc/ΔE'); assert.equal(motor.transicion(nf, ni).E, r.E, 'absorbe lo que emite');
    if (nf === 1) assert.equal(r.region, 'ultravioleta');
    if (nf === 2 && ni <= 6) assert.equal(r.region, 'visible');
    if (nf === 3) assert.equal(r.region, 'infrarrojo');
    assert.ok(r.errores.unoSobreN.E !== r.E && r.errores.sumaNiveles.E > r.E);
  }
});
test('rayos X: λmin·V = hc; el espectro es cero bajo λmin y vale a lo más 1', () => {
  for (let k = 0; k < N_; k++) {
    const V = al(5e3, 1.5e5), r = motor.rayosX(V);
    cerca(r.lambdaMin * V, 1240, 'λmin·V'); cerca(motor.cambioRayosX(V, 2 * V).razon, 0.5, 'doble voltaje, mitad');
    const l = al(0.001, 1), s = motor.espectroRayosX(V, l);
    assert.ok(s >= 0 && s <= 1 + 1e-12); if (l <= r.lambdaMin) assert.equal(s, 0);
  }
});
test('color de la luz (solo dibujo): nada fuera del visible; rojo a 650 nm, azul a 460 nm, verde a 530 nm', () => {
  assert.equal(motor.colorLuz(300), null); assert.equal(motor.colorLuz(800), null);
  const r = motor.colorLuz(650), b = motor.colorLuz(460), g = motor.colorLuz(530);
  assert.ok(r.r > r.g && r.r > r.b); assert.ok(b.b > b.r && b.b > b.g); assert.ok(g.g > g.r && g.g > g.b);
  assert.equal(motor.region(379).region, 'ultravioleta'); assert.equal(motor.region(751).region, 'infrarrojo');
  assert.equal(motor.region(380).color, 'violeta'); assert.equal(motor.region(750).color, 'rojo');
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.foton('500'), /número/);
  assert.throws(() => motor.foton(0), /mayor que cero/);
  assert.throws(() => motor.fotoelectrico(500, -1), /mayor que cero/);
  assert.throws(() => motor.constantes('cgs'), /juego/);
  assert.throws(() => motor.fototubo(null), /tubo/);
  assert.throws(() => motor.fototubo({ lambda: 500, phi: 2, P: -1 }), /negativo/);
  assert.throws(() => motor.emitir(3, 2, 1.5), /entre 0 y 1/);
  assert.throws(() => motor.electron(-1, 0, 0), /negativo/);
  assert.throws(() => motor.bohr(0), /entero/);
  assert.throws(() => motor.bohr(2.5), /entero/);
  assert.throws(() => motor.transicion(2, 2), /distintos/);
  assert.throws(() => motor.rayosX(0), /mayor que cero/);
  assert.throws(() => motor.rectaKf(1e15, 1, 1e15, 2), /distintas/);
  assert.throws(() => motor.wien(-5), /mayor que cero/);
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
