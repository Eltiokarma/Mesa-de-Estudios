// Pruebas del motor de «El taller y la pared». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con números al azar (semilla fija): la directa conserva el cociente y la inversa el producto;
//    la regla de tres de ida y vuelta; la compuesta da lo mismo por proporciones que por la obra constante, y cada
//    error típico da otra cosa; el reparto suma el total y sus partes van en la razón de sus índices; los engranajes
//    conservan z·n y alternan el sentido; la serie de razones; el rectángulo conserva el área.
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
  if (typeof esperado !== 'number') { assert.deepEqual(real, esperado, que); return; }
  assert.ok(Math.abs(real - esperado) <= t * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
function llamar(fn, args) {
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  return motor[fn](...args);
}
const campo = (r, k) => (k === 'valor' && typeof r === 'number' ? r : k.split('.').reduce((o, p) => (o == null ? o : o[p]), r));
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
  assert.equal(datos.plantilla, 'regla-de-tres');
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
const ent = (a, b) => Math.floor(al(a, b + 1));
const N = 400;

test('directa: el cociente no cambia y la gráfica pasa por el origen; inversa: el producto no cambia', () => {
  for (let k = 0; k < N; k++) {
    const c = al(0.1, 50), xs = [al(0.5, 9), al(10, 19), al(20, 40)];
    const d = motor.tabla('directa', c, xs), i = motor.tabla('inversa', c, xs);
    const rd = motor.relacion(d), ri = motor.relacion(i);
    assert.equal(rd.tipo, 'directa'); cerca(rd.k, c, 'k');
    assert.equal(ri.tipo, 'inversa'); cerca(ri.producto, c, 'producto');
    // una tabla con diferencia fija no es proporcional (salvo diferencia cero)
    const s = al(1, 10), a = motor.relacion(xs.map(x => [x, x + s]));
    assert.equal(a.tipo, 'ninguna'); assert.equal(a.diferenciaFija, true);
    const cd = motor.curva('directa', c, 0, 10, 20); cerca(cd[0].y, 0, 'pasa por el origen');
    for (const p of motor.curva('inversa', c, 0.5, 10, 20)) cerca(p.x * p.y, c, 'hipérbola');
  }
});
test('regla de tres simple: ida y vuelta, y los errores típicos dan otra cosa', () => {
  for (let k = 0; k < N; k++) {
    const a1 = ent(2, 30), b1 = ent(2, 30); let a2 = ent(2, 30); if (a2 === a1) a2++;
    const d = motor.reglaDeTres({ tipo: 'directa', a1, b1, a2 }), i = motor.reglaDeTres({ tipo: 'inversa', a1, b1, a2 });
    cerca(d.b2 / a2, b1 / a1, 'cociente'); cerca(i.b2 * a2, a1 * b1, 'producto');
    cerca(motor.reglaDeTres({ tipo: 'directa', a1: a2, b1: d.b2, a2: a1 }).b2, b1, 'vuelta directa');
    cerca(motor.reglaDeTres({ tipo: 'inversa', a1: a2, b1: i.b2, a2: a1 }).b2, b1, 'vuelta inversa');
    cerca(i.errores.comoDirecta, d.b2, 'la inversa hecha como directa es la directa');
    assert.notEqual(i.errores.comoDirecta, i.b2);
    // más de la primera: en la directa sube, en la inversa baja
    if (a2 > a1) { assert.ok(d.b2 > b1); assert.ok(i.b2 < b1); }
  }
});
test('Sr. Alto: la razón se mantiene y la diferencia no', () => {
  for (let k = 0; k < N; k++) {
    const bb = ent(2, 10), bc = bb + ent(1, 8), ab = bb + ent(1, 10), r = motor.srAlto({ bajoBotones: bb, bajoClips: bc, altoBotones: ab });
    cerca(r.clips / ab, bc / bb, 'razón'); assert.ok(r.clips - ab > bc - bb, 'la diferencia crece con la altura');
    cerca(r.errores.aditiva - ab, bc - bb, 'la aditiva conserva la diferencia');
  }
});
test('compuesta: proporciones, obra constante y método de signos coinciden; cada error típico da otra cosa', () => {
  for (let k = 0; k < N; k++) {
    const A = { obreros: ent(2, 20), dias: ent(2, 30), horas: ent(4, 10) };
    const B = { obreros: ent(2, 20), horas: ent(4, 10), dias: null };
    const t = motor.trabajo(A, B);
    cerca(motor.horasHombre({ ...B, dias: t.valor }), motor.horasHombre(A), 'el trabajo no cambia');
    const c = motor.compuesta({ incognita: { nombre: 'dias', antes: A.dias }, magnitudes: [
      { nombre: 'obreros', antes: A.obreros, despues: B.obreros, relacion: 'inversa' }, { nombre: 'horas', antes: A.horas, despues: B.horas, relacion: 'inversa' }] });
    cerca(c.valor, t.valor, 'proporciones = obra');
    // método de signos: los + van arriba, los − abajo
    const arriba = A.dias * A.obreros * A.horas, abajo = B.obreros * B.horas;
    assert.deepEqual(c.signos.map(s => s.antes), ['+', '+']);
    cerca(c.valor, arriba / abajo, 'signos');
    if (A.horas !== B.horas) {
      cerca(c.errores['olvida-horas'], t.errores.olvidaHoras, 'olvida horas');
      cerca(c.errores['invierte-horas'], t.errores.horasDirectas, 'horas directas'); assert.ok(Math.abs(t.errores.olvidaHoras - t.valor) > 1e-9); assert.ok(Math.abs(t.errores.horasDirectas - t.valor) > 1e-9); }
    // despejar cualquier otro dato da lo mismo de vuelta
    cerca(motor.trabajo(A, { ...B, dias: t.valor, obreros: null }).valor, B.obreros, 'obreros de vuelta');
    cerca(motor.trabajo(A, { ...B, dias: t.valor, horas: null }).valor, B.horas, 'horas de vuelta');
    cerca(motor.trabajo(A, { ...B, dias: t.valor, obra: null }).valor, 1, 'la misma obra');
  }
});
test('obra: duplicar obreros y días cuadruplica la obra; la obra y los días son directos', () => {
  for (let k = 0; k < N; k++) {
    const O = ent(1, 20), D = ent(1, 30), f = al(0.2, 5);
    cerca(motor.trabajo({ obreros: O, dias: D }, { obreros: 2 * O, dias: 2 * D, obra: null }).valor, 4, 'por 4');
    cerca(motor.trabajo({ obreros: O, dias: D }, { obreros: O, obra: f, dias: null }).valor, D * f, 'directa con la obra');
    const r = motor.rectangulo(O * D, al(1, 25)); cerca(r.area, O * D, 'área'); cerca(r.filasEnteras + r.resto, r.dias, 'filas');
    assert.ok(r.resto >= 0 && r.resto < 1);
  }
});
test('reparto: las partes suman el total y van en la razón de sus pesos; el inverso hecho como directo da otra cosa', () => {
  for (let k = 0; k < N; k++) {
    const n = ent(2, 5), d = Array.from({ length: n }, () => ent(1, 12)), iv = Array.from({ length: n }, () => ent(1, 12)), S = ent(100, 10000);
    for (const o of [{ directo: d }, { inverso: iv }, { directo: d, inverso: iv }]) {
      const r = motor.reparto({ total: S, ...o });
      cerca(r.partes.reduce((s, x) => s + x, 0), S, 'suma');
      r.partes.forEach((p, j) => cerca(p / r.partes[0], ((o.directo ? d[j] : 1) / (o.inverso ? iv[j] : 1)) / ((o.directo ? d[0] : 1) / (o.inverso ? iv[0] : 1)), 'razón'));
      r.enteros.forEach((e, j) => cerca(r.partes[j], e * r.kEnteros, 'enteros'));
    }
    const r = motor.reparto({ total: S, inverso: iv });
    cerca(r.errores.comoDirecto, motor.reparto({ total: S, directo: iv }).partes, 'como directo');
    // al índice más chico le toca más en el inverso
    const jmin = iv.indexOf(Math.min(...iv)); assert.ok(r.partes.every(p => p <= r.partes[jmin] + 1e-9));
  }
});
test('engranajes: z·n se conserva en toda la fila; el sentido se alterna', () => {
  for (let k = 0; k < N; k++) {
    const z = Array.from({ length: ent(2, 5) }, () => ent(8, 80)), n1 = al(0.5, 40), e = motor.engranajes({ dientes: z, vueltas1: n1 });
    e.vueltas.forEach((n, j) => cerca(n * z[j], n1 * z[0], 'dientes que pasan'));
    e.sentido.forEach((s, j) => assert.equal(s, j % 2 ? -1 : 1));
    cerca(e.vueltas[z.length - 1], n1 * z[0] / z[z.length - 1], 'solo importan la primera y la última');
    const g = motor.girosEngranajes(z, n1); g.forEach((x, j) => cerca(Math.abs(x), e.vueltas[j], 'giros'));
  }
});
test('serie de razones iguales y proporciones', () => {
  for (let k = 0; k < N; k++) {
    const b = Array.from({ length: ent(2, 4) }, () => ent(1, 12)), kk = ent(1, 9), sum = kk * b.reduce((s, x) => s + x, 0);
    const s = motor.serieRazones({ consecuentes: b, sumaAntecedentes: sum });
    cerca(s.k, kk, 'k'); s.antecedentes.forEach((a, j) => cerca(a / b[j], kk, 'razón')); cerca(s.razonDeSumas, kk, 'suma');
    const P = s.antecedentes.reduce((p, x) => p * x, 1); cerca(motor.serieRazones({ consecuentes: b, productoAntecedentes: P }).k, kk, 'producto');
    const a = al(1, 50), c = al(1, 50), m = motor.mediaProporcional(a, c); cerca(a / m.b, m.b / c, 'continua');
    assert.ok(m.errores.promedio >= m.b - 1e-9, 'la media aritmética nunca es menor que la geométrica');
    const x = motor.cuartaProporcional(a, c, 7); cerca(a / c, 7 / x.x, 'cuarta');
  }
});
test('crecimiento: la estatura sube con la edad, pero no es proporcional', () => {
  let ant = -1;
  for (let e = 0; e <= 16; e += 0.5) { const h = motor.crecimiento(e); assert.ok(h > ant); ant = h; }
  assert.ok(motor.crecimiento(0) > 0, 'al nacer no mide cero: la gráfica no pasa por el origen');
  assert.ok(motor.crecimiento(10) < 2 * motor.crecimiento(5));
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.razon(3, 0), /mayor que cero/);
  assert.throws(() => motor.razon('3', 2), /número/);
  assert.throws(() => motor.serieRazones({ consecuentes: [2, 3] }), /exactamente uno/);
  assert.throws(() => motor.serieRazones({ consecuentes: [2, 3], k: 2, sumaAntecedentes: 10 }), /exactamente uno/);
  assert.throws(() => motor.serieRazones({ consecuentes: [], k: 2 }), /no vacía/);
  assert.throws(() => motor.relacion([[1, 2]]), /dos filas/);
  assert.throws(() => motor.relacion([[1, 2], [3]]), /\[x, y\]/);
  assert.throws(() => motor.tabla('lineal', 2, [1]), /tipo/);
  assert.throws(() => motor.curva('inversa', 2, 0, 5), /x = 0/);
  assert.throws(() => motor.reglaDeTres({ tipo: 'directa', a1: 0, b1: 2, a2: 3 }), /mayor que cero/);
  assert.throws(() => motor.reglaDeTres({ tipo: 'cruzada', a1: 1, b1: 2, a2: 3 }), /tipo/);
  assert.throws(() => motor.compuesta({ incognita: { antes: 3 }, magnitudes: [] }), /magnitudes/);
  assert.throws(() => motor.compuesta({ incognita: { antes: 3 }, magnitudes: [{ antes: 1, despues: 2, relacion: 'otra' }] }), /relacion/);
  assert.throws(() => motor.trabajo({ obreros: 2, dias: 3 }, { obreros: null, dias: null }), /exactamente un dato/);
  assert.throws(() => motor.trabajo({ obreros: 2, dias: 3 }, { obreros: 4 }), /exactamente un dato/);
  assert.throws(() => motor.trabajo({ obreros: -2, dias: 3 }, { obreros: 4, dias: null }), /mayor que cero/);
  assert.throws(() => motor.reparto({ total: 100 }), /índices/);
  assert.throws(() => motor.reparto({ total: 100, directo: [1, 2], inverso: [3] }), /mismo largo/);
  assert.throws(() => motor.engranajes({ dientes: [20], vueltas1: 3 }), /al menos dos/);
  assert.throws(() => motor.engranajes({ dientes: [20, 7.5], vueltas1: 3 }), /entero/);
  assert.throws(() => motor.crecimiento(30), /edad/);
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
