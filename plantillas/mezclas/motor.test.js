// Pruebas del motor de «La balanza de las mezclas». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, contra cuentas hechas de otra manera (fracciones a mano con enteros, fuerza bruta): el valor medio
//    queda entre el mínimo y el máximo; los momentos son iguales a los dos lados del valor medio; escalar las cantidades
//    no lo cambia; el aspa reproduce el valor medio; el agua nunca sube el grado; quilates y ley de ida y vuelta; la
//    balanza baja hacia donde dice; y lo más importante para la escena: ningún error típico da la respuesta correcta ni
//    dos errores dan lo mismo. Bordes: un solo ingrediente, cantidades 0, valor medio igual a un extremo.
// 3. Errores de entrada.
// 4. Cada problema de papel.json coincide con el motor.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const M = require('./motor.js');

const datos = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));
function cerca(real, esperado, que) {
  if (typeof esperado !== 'number') { assert.deepEqual(real, esperado, que); return; }
  assert.ok(Math.abs(real - esperado) <= 1e-9 * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
function llamar(fn, args) { assert.equal(typeof M[fn], 'function', `motor.${fn} no existe`); return M[fn](...args); }
const campo = (r, k) => (k === 'valor' && (typeof r !== 'object' || r === null || Array.isArray(r)) ? r : k.split('.').reduce((o, p) => (o == null ? o : o[p]), r));
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
  assert.equal(datos.plantilla, 'mezclas');
  assert.ok(datos.casos.length >= 15 && datos.casos.length <= 22);
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera, JSON.stringify(c).slice(0, 80));
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Propiedades
let semilla = 2026;
const rnd = () => (semilla = (Math.imul(semilla, 1664525) + 1013904223) >>> 0) / 4294967296;
const ent = (a, b) => a + Math.floor((b - a + 1) * rnd());
const ser = v => JSON.stringify(v);
function erroresDistintos(errores, correcta, que) {
  const vals = Object.values(errores).map(ser);
  for (const [k, e] of Object.entries(errores)) assert.notEqual(ser(e), ser(correcta), `${que}: el error ${k} da la respuesta correcta`);
  assert.equal(new Set(vals).size, vals.length, `${que}: dos errores dan lo mismo`);
}
// fracción exacta a mano: [num, den] con enteros de JavaScript (los datos de prueba son chicos)
const g = (a, b) => (b ? g(b, a % b) : Math.abs(a));
const fr = (n, d) => { const k = g(n, d) || 1; return [n / k, d / k]; };
const iguales = (x, [n, d]) => Math.abs(x - n / d) < 1e-9;

test('valor medio: exacto contra Σ q·p / Σ q con enteros, entre el mínimo y el máximo, momentos iguales a los dos lados', () => {
  for (let t = 0; t < 3000; t++) {
    const n = ent(1, 4), L = Array.from({ length: n }, () => ({ cantidad: ent(0, 40), precio: ent(0, 30) }));
    if (L.every(x => x.cantidad === 0)) L[0].cantidad = 1;
    const R = M.precioMedio(L);
    const sq = L.reduce((s, x) => s + x.cantidad, 0), sp = L.reduce((s, x) => s + x.cantidad * x.precio, 0);
    assert.ok(iguales(R.precioMedio, fr(sp, sq)));
    assert.equal(R.costo, sp); assert.equal(R.total, sq);
    const conPeso = L.filter(x => x.cantidad > 0).map(x => x.precio);
    assert.ok(R.precioMedio >= Math.min(...conPeso) - 1e-12 && R.precioMedio <= Math.max(...conPeso) + 1e-12, 'entre el mínimo y el máximo');
    assert.ok(Math.abs(R.momentoIzquierda - R.momentoDerecha) < 1e-9, 'momentos iguales');
    const izq = L.filter(x => x.precio * sq < sp).reduce((s, x) => s + x.cantidad * (sp / sq - x.precio), 0);
    assert.ok(Math.abs(izq - R.momentoIzquierda) < 1e-6);
    erroresDistintos(R.errores, R.respuesta, JSON.stringify(L));
    // el texto en soles: exacto con 2 decimales, o «≈»
    const exacto = (sp * 100) % sq === 0;
    assert.equal(R.soles.startsWith('≈'), !exacto, R.soles);
    // la balanza en el valor medio no se inclina
    const B = M.balanza(L.map(x => ({ cantidad: x.cantidad, valor: x.precio })), M.Q(`${sp}/${sq}`));
    assert.equal(B.estado, 'equilibrio'); assert.equal(B.angulo, 0);
  }
});

test('homogeneidad: escalar todas las cantidades no cambia el valor medio', () => {
  for (let t = 0; t < 600; t++) {
    const L = [{ cantidad: ent(1, 30), valor: ent(0, 40) }, { cantidad: ent(1, 30), valor: ent(0, 40) }];
    const f = ent(2, 9), E = M.escalar(L, f);
    assert.equal(E.media, E.mediaEscalada);
    assert.ok(iguales(M.mezcla(L.map(x => ({ cantidad: x.cantidad * f, valor: x.valor }))).media, fr(L[0].cantidad * L[0].valor + L[1].cantidad * L[1].valor, L[0].cantidad + L[1].cantidad)));
    erroresDistintos(E.errores, E.respuesta, 'escalar');
  }
});

test('regla del aspa: la proporción es irreducible, inversa a las distancias y reproduce el valor medio', () => {
  for (let t = 0; t < 3000; t++) {
    const p1 = ent(0, 40), p2 = ent(0, 40), pm = ent(-2, 42);
    const A = M.aspa(p1, p2, pm);
    const lo = Math.min(p1, p2), hi = Math.max(p1, p2);
    if (p1 === p2) { assert.equal(A.posible, pm === p1); continue; }
    if (pm < lo || pm > hi) { assert.equal(A.posible, false); assert.match(A.razon, /entre/); continue; }
    assert.equal(A.posible, true);
    const [q1, q2] = A.proporcion;
    assert.equal(g(q1, q2), 1, 'irreducible');
    assert.equal(q1 * Math.abs(pm - p1), q2 * Math.abs(p2 - pm), 'momentos iguales');
    assert.ok(iguales(M.mezcla([{ cantidad: q1, valor: p1 }, { cantidad: q2, valor: p2 }]).media, [pm, 1]), 'reproduce pm');
    erroresDistintos(A.errores, A.respuesta, `aspa(${p1}, ${p2}, ${pm})`);
    // ningún error reproduce pm
    for (const [k, v] of Object.entries(A.errores)) if (v[0] + v[1]) assert.ok(!iguales(A.daria[k], [pm, 1]), `${k} no debe dar pm`);
    if (pm !== p2) {
      const q = ent(1, 30), C = M.cantidadPara(p1, q, p2, pm);
      assert.ok(Math.abs(C.cantidad * q1 - q * q2) < 1e-9, 'cantidadPara sigue la proporción');
      erroresDistintos(C.errores, C.respuesta, 'cantidadPara');
    }
  }
});

test('agua: nunca sube el grado; aguaPara deja exactamente el grado pedido', () => {
  for (let t = 0; t < 2000; t++) {
    const V = ent(1, 50), g0 = ent(1, 100), w = ent(0, 60);
    const G = M.gradoMezcla([{ volumen: V, grado: g0 }, { volumen: w, grado: 0 }]);
    assert.ok(G.grado <= g0 + 1e-12, 'el agua no sube el grado');
    if (w > 0) assert.ok(G.grado < g0);
    assert.ok(Math.abs(G.alcohol - V * g0 / 100) < 1e-9, 'el alcohol puro no cambia');
    const gf = ent(1, 100), A = M.aguaPara(V, g0, gf);
    if (gf > g0) { assert.equal(A.posible, false); continue; }
    assert.equal(A.posible, true);
    assert.ok(Math.abs(M.gradoMezcla([{ volumen: V, grado: g0 }, { volumen: A.agua, grado: 0 }]).grado - gf) < 1e-9);
    erroresDistintos(A.errores, A.respuesta, `aguaPara(${V}, ${g0}, ${gf})`);
  }
});

test('ley y quilates: ida y vuelta, oro fino y aleaciones', () => {
  for (let k = 0; k <= 24; k++) {
    const L = M.leyDeQuilates(k); assert.ok(Math.abs(M.quilates(L.ley).quilates - k) < 1e-12);
    const masa = ent(1, 100), O = M.oroFino(masa, k);
    assert.ok(Math.abs(O.fino + O.liga - masa) < 1e-9);
    assert.ok(Math.abs(O.fino * 24 - masa * k) < 1e-9);
    assert.equal(O.partes.filter(p => p.tipo === 'fino').length, k);
    erroresDistintos(O.errores, O.respuesta, `oroFino(${masa}, ${k})`);
  }
  assert.equal(M.quilates(1).quilates, 24);
  for (let t = 0; t < 1000; t++) {
    const m = ent(1, 200), k0 = ent(0, 23), kf = ent(k0, 24), A = M.oroPara(m, k0, kf);
    if (kf === 24) { assert.equal(A.posible, false); continue; }
    assert.equal(A.posible, true);
    const L = M.leyMedia([{ masa: m, ley: M.Q(`${k0}/24`) }, { masa: A.agregar, ley: 1 }]);
    assert.ok(Math.abs(L.quilates - kf) < 1e-9, 'llega a kf');
    assert.ok(Math.abs(m * A.d1 - A.agregar * A.d2) < 1e-9, 'momentos en quilates');
    erroresDistintos(A.errores, A.respuesta, `oroPara(${m}, ${k0}, ${kf})`);
  }
});

test('balanza: baja hacia el lado del momento mayor; «casi» solo cerca del equilibrio', () => {
  for (let t = 0; t < 2000; t++) {
    const L = [{ cantidad: ent(0, 40), valor: 2 }, { cantidad: ent(0, 40), valor: 7 }];
    if (!L[0].cantidad && !L[1].cantidad) L[0].cantidad = 1;
    const ap = ent(20, 70) / 10, B = M.balanza(L, ap, 0.1);
    const mom = L[0].cantidad * (2 - ap) + L[1].cantidad * (7 - ap);
    assert.ok(Math.abs(B.momento - mom) < 1e-9);
    if (B.estado === 'casi') assert.ok(Math.abs(ap - B.media) < 0.05 + 1e-12);
    else if (Math.abs(mom) < 1e-12) assert.equal(B.estado, 'equilibrio');
    else assert.equal(B.estado, mom > 0 ? 'baja-derecha' : 'baja-izquierda');
    assert.ok(Math.abs(B.angulo) <= M.ANG_MAX + 1e-12);
    assert.equal(Math.sign(B.angulo), Math.sign(B.momento));
  }
  assert.equal(M.ajustar(4.66, 0.1, 0, 10), 4.7);
  assert.equal(M.ajustar(12, 0.1, 0, 10), 10);
  assert.equal(M.mover(4.5, 1, 0.1, 0, 10), 4.6);
  assert.equal(M.mover(0, -1, 0.1, 0, 10), 0);
  assert.equal(M.regla(0, 10, 2).length, 6);
  assert.equal(M.regla(2, 3, 0.5)[1].texto, '2,5');
});

test('qué pasa si: más alcohol y sacar y reponer', () => {
  for (let t = 0; t < 500; t++) {
    const a = { volumen: ent(1, 30), grado: ent(0, 100) }, b = { volumen: ent(1, 30), grado: ent(0, 100) }, R = M.masAlcohol(a, b);
    const x = a.volumen * a.grado - b.volumen * b.grado;
    assert.equal(R.respuesta, x === 0 ? 'igual' : x > 0 ? 'A' : 'B');
    erroresDistintos(R.errores, R.respuesta, 'masAlcohol');
    const V = ent(2, 60), g0 = ent(1, 100), s = ent(0, V), S = M.sacarYReponer(V, g0, s);
    assert.ok(Math.abs(S.grado - g0 * (V - s) / V) < 1e-9);
    assert.ok(S.grado <= g0);
    erroresDistintos(S.errores, S.respuesta, 'sacarYReponer');
  }
});

test('bordes: un solo ingrediente, cantidades 0 y valor medio en un extremo', () => {
  const U = M.precioMedio([{ cantidad: 30, precio: 4 }]);
  assert.equal(U.precioMedio, 4); assert.deepEqual(U.errores, {});
  const C0 = M.precioMedio([{ cantidad: 0, precio: 4 }, { cantidad: 20, precio: 6 }]);
  assert.equal(C0.precioMedio, 6);
  assert.deepEqual(M.aspa(3, 8, 8).proporcion, [0, 1]);
  assert.equal(M.cantidadPara(3, 10, 8, 3).cantidad, 0);
  assert.equal(M.cantidadPara(3, 10, 8, 8).posible, false);
  assert.equal(M.aguaPara(10, 40, 40).agua, 0);
  assert.equal(M.oroPara(10, 18, 18).agregar, 0);
  assert.equal(M.texto(1 / 3), '≈ 0,33');
  assert.equal(M.soles(4.8), 'S/ 4,80');
  assert.equal(M.milesimas(0.75), '0,750');
  assert.equal(M.grados(30), '30°');
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => M.precioMedio([]), /al menos un ingrediente/);
  assert.throws(() => M.precioMedio([{ cantidad: 0, precio: 4 }]), /no tiene cantidad/);
  assert.throws(() => M.precioMedio([{ cantidad: -1, precio: 4 }]), /mayor o igual que 0/);
  assert.throws(() => M.precioMedio([{ cantidad: 1, precio: 'x' }]), /número/);
  assert.throws(() => M.gradoMezcla([{ volumen: 1, grado: 120 }]), /entre 0 y 100/);
  assert.throws(() => M.oroFino(10, 25), /entre 0 y 24/);
  assert.throws(() => M.ley(30, 20), /entre 0 y 20/);
  assert.throws(() => M.aguaPara(0, 50, 40), /mayor que 0/);
  assert.throws(() => M.sacarYReponer(10, 50, 11), /entre 0 y 10/);
  assert.throws(() => M.regla(5, 5, 1), /hasta debe ser mayor/);
  assert.throws(() => M.Q(Infinity), /finito/);
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
    const todo = [p.enunciado, p.respuesta, ...p.pasos].join(' ');
    assert.ok(!/<[a-z]/i.test(todo), `${p.id}: la app muestra texto plano, sin HTML`);
    assert.ok(!/\d\.\d/.test(todo), `${p.id}: se escribe con coma decimal`);
    assert.ok(!/·/.test(todo), `${p.id}: un solo signo de producto (×)`);
  }
  // la indicación no adelanta las reglas que miden las predicciones
  assert.ok(!/ponder|aspa|invers|24|distancia|promedio|cruz/i.test(papel.indicacion));
  assert.ok(!/ponder|aspa|promedio|24/i.test(papel.titulo));
});
for (const p of (papel && papel.problemas) || []) test(`papel ${p.id}: la respuesta coincide con el motor`, () => {
  for (const x of p.verificar) comprobar(x.fn, x.args, x.espera, p.id);
});
