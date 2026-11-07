// Pruebas del motor de «La antena y el arcoíris: ondas electromagnéticas». Se corren desde la raíz con:
// node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con datos al azar (semilla fija): λ·f = c para cualquier onda y con cualquier prefijo; E·λ = hc;
//    las regiones del espectro van en orden con la frecuencia y sus bordes empalman; B₀ = (campo eléctrico)/c; los dos
//    campos y el avance forman un trío perpendicular (campo eléctrico × B apunta hacia el avance) y oscilan en fase;
//    en un medio, f no cambia, v·λ' = c·λ/n… y v = λ'·f; el tiempo de viaje no depende de la frecuencia; el eco es la
//    mitad del recorrido; la regla logarítmica va y vuelve; ionizar depende solo de f.
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
  assert.equal(datos.plantilla, 'ondas-electromagneticas');
  assert.ok(datos.casos.length >= 16, 'al menos 16 casos');
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera, JSON.stringify(c).slice(0, 80));
  const nombres = datos.casos.map(c => c.nombre).join(' ');
  for (const t of ['100 MHz', '1000 kHz', '2,4 GHz', '600 nm', '0,1 nm', 'Sol', 'Luna', 'Radar', '300 V/m', 'n = 4/3', 'n = 3/2', 'Orden', 'Regiones', 'atraviesa', 'a la vez', 'ionizante'])
    assert.ok(nombres.includes(t), `falta el caso pedido: ${t}`);
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Propiedades
const rnd = motor.azar(2026);
const al = (a, b) => a + (b - a) * rnd();
const logAl = (a, b) => Math.pow(10, al(Math.log10(a), Math.log10(b)));
const N_ = 300;

test('λ·f = c con cualquier prefijo; E·λ = hc; E en J = E en eV · e', () => {
  const PF = { Hz: 1, kHz: 1e3, MHz: 1e6, GHz: 1e9, THz: 1e12 };
  for (let k = 0; k < N_; k++) {
    const u = Object.keys(PF)[k % 5], v = al(1, 999), r = motor.onda(v, u);
    cerca(r.f, v * PF[u], 'prefijo'); cerca(r.lambda * r.f, motor.C, 'λ·f = c', 1e-9);
    cerca(r.E * r.lambdaNm, motor.HC_EV_NM, 'E·λ = hc', 1e-9); cerca(r.EJ, r.E * motor.E_CARGA, 'J y eV', 1e-9);
    const l = logAl(1e-13, 1e4), q = motor.ondaDeLambda(l, 'm');
    cerca(q.f * l, motor.C, 'f = c/λ'); assert.equal(q.region, motor.region(l).region);
  }
});
test('regiones: en orden con la frecuencia, bordes que empalman y la luz visible es una franja angosta', () => {
  const R = motor.regiones();
  assert.deepEqual(R.map(r => r.region), ['radio', 'microondas', 'infrarrojo', 'visible', 'ultravioleta', 'rayosX', 'gamma']);
  for (let k = 1; k < R.length; k++) { assert.equal(R[k].lambdaMax, R[k - 1].lambdaMin, 'empalman'); cerca(R[k].fMin, R[k - 1].fMax, 'empalman en f'); }
  let antes = -1;
  for (let k = 0; k < N_; k++) {
    const f = logAl(1e4, 1e22), o = motor.region(motor.C / f).orden, g = f * al(1.01, 50), o2 = motor.region(motor.C / g).orden;
    assert.ok(o2 >= o, 'más frecuencia, región igual o más alta'); antes = o;
  }
  assert.ok(antes >= 0);
  const vis = R[3]; assert.ok(vis.fMax / vis.fMin < 2, 'el visible no llega a duplicar la frecuencia');
});
test('campos: B₀ = (campo eléctrico)/c; perpendiculares entre sí y al avance; en fase', () => {
  for (let k = 0; k < N_; k++) {
    const e0 = al(0.01, 1e4), r = motor.campos(e0);
    cerca(r.B0 * motor.C, e0, 'c·B₀'); cerca(motor.campoDeB(r.B0).electrico0, e0, 'ida y vuelta');
    // dirección: un avance al azar y un campo eléctrico perpendicular a él
    const kv = [al(-1, 1), al(-1, 1), al(-1, 1)], a = [al(-1, 1), al(-1, 1), al(-1, 1)];
    if (Math.hypot(...kv) < 0.1) continue;
    const ev = motor.producto(kv, a); if (Math.hypot(...ev) < 0.05) continue;
    const b = motor.direccionB(ev, kv);
    assert.ok(Math.abs(motor.punto(b, ev)) < 1e-9 && Math.abs(motor.punto(b, kv)) < 1e-9, 'B ⊥ E y B ⊥ avance');
    assert.ok(motor.punto(motor.producto(ev, b), kv) > 0, 'campo eléctrico × B hacia el avance');
    const x = al(0, 5), t = al(0, 5), s = motor.instante(x, t, 1.3, 0.7);
    assert.equal(s.electrico, s.B, 'en fase'); assert.ok(Math.abs(s.B) <= 1);
  }
});
test('medio: f y color no cambian; v = c/n; λ\' = λ/n; v = λ\'·f', () => {
  for (let k = 0; k < N_; k++) {
    const l = al(380, 750), n = al(1, 2.5), r = motor.medio(l, n);
    cerca(r.f, motor.C / (l * 1e-9), 'f igual'); assert.equal(r.color, motor.region(l * 1e-9).color, 'color igual');
    cerca(r.v, motor.C / n, 'v = c/n'); cerca(r.lambdaNm, l / n, 'λ/n'); cerca(r.v, r.lambdaNm * 1e-9 * r.f, 'v = λ\'·f', 1e-9);
    cerca(r.errores.cambiaF.f * r.errores.cambiaF.lambdaNm * 1e-9, r.v, 'el error OE12 también cumple v = λf con su λ fija', 1e-9);
  }
});
test('viaje y eco: el tiempo no depende de la onda; el eco es la mitad del recorrido', () => {
  for (let k = 0; k < N_; k++) {
    const d = logAl(1, 1e13), r = motor.viaje(d), t = motor.viaje(d, 1.5);
    cerca(r.t * motor.C, d, 'd = c·t'); cerca(t.t, 1.5 * r.t, 'en el medio tarda n veces');
    cerca(r.min * 60 + r.s, r.t, 'min y s', 1e-9); assert.ok(r.s < 60 + 1e-9);
    const c = motor.carrera(d, al(0, 2) * r.t); assert.ok(c.pos.every(p => p.x === c.pos[0].x), 'todas a la par');
    const e = motor.eco(2 * r.t); cerca(e.d, d, 'eco'); cerca(e.errores.sinMitad, 2 * d, 'error sin la mitad');
  }
});
test('regla logarítmica: posicion y frecuenciaEn son inversas; ionizar depende solo de f', () => {
  for (let k = 0; k < N_; k++) {
    const f = logAl(1e4, 1e22); cerca(motor.frecuenciaEn(motor.posicion(f, 1e4, 1e22), 1e4, 1e22), f, 'ida y vuelta', 1e-9);
    assert.equal(motor.ionizante(f).ioniza, motor.foton(f).E >= 10);
  }
  for (const m of motor.materiales()) for (const r of motor.regiones()) assert.ok(['si', 'no', 'parcial'].includes(motor.atraviesa(m.id, r.region)));
  assert.equal(motor.referencias().length, 6);
});
test('color de la luz (solo dibujo): nada fuera del visible; rojo a 650 nm, azul a 460 nm, verde a 530 nm', () => {
  assert.equal(motor.colorLuz(300), null); assert.equal(motor.colorLuz(800), null);
  const r = motor.colorLuz(650), b = motor.colorLuz(460), g = motor.colorLuz(530);
  assert.ok(r.r > r.g && r.r > r.b); assert.ok(b.b > b.r && b.b > b.g); assert.ok(g.g > g.r && g.g > g.b);
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.onda('100', 'MHz'), /número/);
  assert.throws(() => motor.onda(100, 'mhz'), /unidad/);
  assert.throws(() => motor.ondaDeLambda(0, 'nm'), /mayor que cero/);
  assert.throws(() => motor.aMetros(3, 'pulgadas'), /unidad/);
  assert.throws(() => motor.medio(600, 0.5), /menor que 1/);
  assert.throws(() => motor.direccionB([1, 0, 0], [1, 0, 0]), /perpendicular/);
  assert.throws(() => motor.direccionB([0, 0, 0], [1, 0, 0]), /cero/);
  assert.throws(() => motor.viaje(-1), /negativo/);
  assert.throws(() => motor.atraviesa('madera', 'radio'), /material/);
  assert.throws(() => motor.atraviesa('pared', 'sonido'), /región/);
  assert.throws(() => motor.posicion(10, 100, 10), /fmax/);
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
