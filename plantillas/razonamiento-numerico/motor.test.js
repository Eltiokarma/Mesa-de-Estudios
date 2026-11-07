// Pruebas del motor de «Las fichas que se cambian». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, contra cuentas hechas de otra manera:
//    falsa suposición contra la búsqueda de todos los repartos (muchos datos al azar, también sin solución);
//    el examen contra probar todas las cantidades de buenas; el método regresivo de ida y vuelta para cadenas al azar
//    (con fracciones exactas); el cuadrado mágico 3 × 3 con 1 a 9 tiene 8 soluciones, todas con el 5 en el centro, y
//    son giros y reflejos de una sola; las distribuciones contra un conteo directo con otro algoritmo; ningún error
//    típico da la respuesta correcta ni dos errores lo mismo; el dibujo (fichas dentro de su mitad, sin encimarse).
//    Bordes: sin solución, todos de un tipo, más del total.
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
  assert.ok(typeof real === 'number' && Math.abs(real - esperado) <= 1e-9 * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
function llamar(fn, args) { assert.equal(typeof M[fn], 'function', `motor.${fn} no existe`); return M[fn](...args); }
const campo = (r, k) => (k === 'valor' && (typeof r !== 'object' || r === null || Array.isArray(r)) ? r : k.split('.').reduce((o, p) => (o == null ? undefined : o[p]), r));
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
  assert.equal(datos.plantilla, 'razonamiento-numerico');
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

test('falsa suposición contra la búsqueda de todos los repartos', () => {
  let con = 0, sin = 0;
  for (let t = 0; t < 3000; t++) {
    const total = ent(0, 40), va = ent(-5, 30), vb = ent(-5, 30), b0 = ent(0, total), v = t % 2 ? (total - b0) * va + b0 * vb : ent(-60, 400);
    const repartos = [];
    for (let b = 0; b <= total; b++) if ((total - b) * va + b * vb === v) repartos.push(b);
    const R = M.falsaSuposicion(total, v, va, vb);
    if (va === vb) { assert.equal(R.posible, false); continue; }
    if (repartos.length) {
      con++;
      assert.equal(R.posible, true, `${total}, ${v}, ${va}, ${vb}`);
      assert.equal(R.otros, repartos[0]); assert.equal(R.supuestos, total - repartos[0]);
      assert.equal(R.cambios.length, R.otros + 1);
      R.cambios.forEach((c, i) => assert.equal(c, total * va + i * (vb - va)));
      assert.equal(R.cambios[R.cambios.length - 1], v);
    } else { sin++; assert.equal(R.posible, false, `${total}, ${v}, ${va}, ${vb}`); assert.ok(R.razon); }
  }
  assert.ok(con > 100 && sin > 100);
});

test('corral, corral al revés y examen: contra probar todas las cantidades', () => {
  for (let t = 0; t < 800; t++) {
    const n = ent(1, 40), c = ent(0, n), patas = 2 * (n - c) + 4 * c;
    const A = M.corral(n, patas), B = M.corralAlReves(n, patas);
    assert.equal(A.respuesta, c); assert.equal(B.respuesta, c); assert.equal(B.gallinas, n - c);
    erroresDistintos(A.errores, A.respuesta, 'corral'); erroresDistintos(B.errores, B.respuesta, 'corralAlReves');
    // con patas impares nunca hay reparto
    const imp = M.corral(n, patas + 1);
    assert.equal(imp.posible, false);
    const N = ent(5, 80), buenas = ent(0, N), bu = ent(1, 6), ma = -ent(0, 3), p = buenas * bu + (N - buenas) * ma;
    const E = M.examen(N, p, bu, ma);
    assert.equal(E.respuesta, buenas); assert.equal(E.incorrectas, N - buenas);
    erroresDistintos(E.errores, E.respuesta, 'examen');
  }
});

// ida y vuelta: x → cadena → final → regresivo devuelve x (fracciones exactas)
const opAzar = () => {
  const r = ent(0, 4);
  if (r === 4) return { op: 'gasta', parte: [1, ent(2, 5)], mas: ent(-6, 9) };
  return { op: ['mas', 'menos', 'por', 'entre'][r], k: r >= 2 ? ent(1, 6) : ent(0, 20) };
};
test('método regresivo: ida y vuelta para cadenas al azar', () => {
  for (let t = 0; t < 1500; t++) {
    const cadena = Array.from({ length: ent(1, 5) }, opAzar), x = M.fr(ent(-30, 200), ent(1, 3));
    const final = cadena.reduce((v, o) => M.aplicar(o, v), x);
    const R = M.regresivo(cadena, final);
    assert.equal(ser(R.respuesta), ser(x.d === 1 ? x.n : M.frTexto(x)), 'vuelve al inicio');
    assert.equal(R.vuelta.length, cadena.length);
    assert.equal(R.ida.length, cadena.length + 1);
    erroresDistintos(R.errores, R.respuesta, 'regresivo');
    // cada operación y su contraria se anulan
    for (const o of cadena) { const y = M.aplicar(o, x), z = M.invertir(o).reduce((v, q) => M.aplicar(q, v), y); assert.deepEqual(z, x); }
  }
});
test('el error «hacia adelante» es aplicar la cadena al final; «sin invertir» es la cadena al revés', () => {
  const cad = [{ op: 'por', k: 3 }, { op: 'menos', k: 8 }, { op: 'entre', k: 2 }, { op: 'mas', k: 10 }];
  assert.equal(M.regresivo(cad, 30).errores.haciaAdelante, ((30 * 3 - 8) / 2) + 10);
  assert.equal(M.regresivo(cad, 30).errores.ordenSinInvertir, ((30 + 10) / 2 - 8) * 3);
  assert.equal(M.regresivo(cad, 30).errores.invierteSinOrden, ((30 / 3 + 8) * 2) - 10);
});

// otro algoritmo para las distribuciones: permutaciones por intercambio (Heap) y contar
function heap(a, f) {
  const n = a.length, c = Array(n).fill(0); f(a);
  let i = 0;
  while (i < n) { if (c[i] < i) { const j = i % 2 ? c[i] : 0; [a[j], a[i]] = [a[i], a[j]]; f(a); c[i]++; i = 0; } else { c[i] = 0; i++; } }
}
test('distribuciones: contra un conteo directo con otro algoritmo', () => {
  const pruebas = [['triangulo3', [1, 2, 3, 4, 5, 6]], ['triangulo3', [2, 3, 4, 5, 6, 7]], ['triangulo3', [1, 3, 4, 6, 8, 11]],
    ['cuadrado3', [1, 2, 3, 4, 5, 6, 7, 8, 9]], ['cuadrado3', [1, 2, 3, 4, 5, 6, 7, 8, 10]], ['triangulo4', [1, 2, 3, 4, 5, 6, 7, 8, 9]]];
  for (const [tipo, nums] of pruebas) {
    const t = M.tablero(tipo), cuenta = {};
    let total = 0;
    heap(nums.slice(), a => {
      const s = t.lineas.map(L => L.reduce((x, i) => x + a[i], 0));
      if (s.every(v => v === s[0])) { cuenta[s[0]] = (cuenta[s[0]] || 0) + 1; total++; }
    });
    const D = M.distribuir(tipo, nums);
    assert.equal(D.soluciones, total, tipo + ' ' + nums);
    assert.deepEqual(D.sumas, Object.keys(cuenta).map(Number).sort((a, b) => a - b));
    D.detalle.forEach(d => {
      assert.equal(d.soluciones, cuenta[d.suma]);
      assert.ok(M.comprobar(tipo, d.muestra).valido);
      // la cuenta de la suma total: L × S = total + lo que se cuenta de más en las casillas compartidas
      assert.equal(t.lineas.length * d.suma, D.total + d.sumaCompartidas);
      // ninguna solución tiene simetrías propias aquí: cada clase tiene tantas como simetrías
      assert.equal(d.soluciones, d.distintas * t.simetrias.length);
    });
  }
});
test('cuadrado mágico 3 × 3 con 1 a 9: 8 soluciones, centro 5, una sola sin giros ni reflejos', () => {
  const D = M.distribuir('cuadrado3', [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  assert.equal(D.soluciones, 8); assert.deepEqual(D.sumas, [15]); assert.equal(D.distintas, 1); assert.deepEqual(D.posibles[4], [5]);
  // las esquinas son pares y los del medio de los lados impares
  for (const i of [0, 2, 6, 8]) assert.deepEqual(D.posibles[i], [2, 4, 6, 8]);
  for (const i of [1, 3, 5, 7]) assert.deepEqual(D.posibles[i], [1, 3, 7, 9]);
  const C = M.cuadradosDistintos();
  assert.equal(C.vistas.length, 8); assert.equal(new Set(C.vistas.map(ser)).size, 8);
  C.vistas.forEach(v => assert.ok(M.comprobar('cuadrado3', v).valido));
  assert.equal(M.TABLEROS.cuadrado3.simetrias.length, 8); assert.equal(M.TABLEROS.triangulo3.simetrias.length, 6); assert.equal(M.TABLEROS.triangulo4.simetrias.length, 6);
  // las simetrías mandan líneas a líneas
  for (const t of Object.values(M.TABLEROS)) {
    const claves = new Set(t.lineas.map(L => L.slice().sort().join(',')));
    for (const g of t.simetrias) for (const L of t.lineas) assert.ok(claves.has(L.map(i => g[i]).sort().join(',')));
  }
});
test('predicciones de distribución: errores distintos y la correcta', () => {
  const m = M.menorSuma('triangulo3', [1, 2, 3, 4, 5, 6]); erroresDistintos(m.errores, m.respuesta, 'menorSuma');
  const c = M.centroMagico(); erroresDistintos(c.errores, c.respuesta, 'centro');
  const q = M.cuadradosDistintos(); erroresDistintos(q.errores, q.respuesta, 'cuadrados');
  for (let d = 1; d <= 5; d++) {
    const s = M.subirTodos('triangulo3', [1, 2, 3, 4, 5, 6], d);
    assert.equal(s.respuesta, 9 + 3 * d); erroresDistintos(s.errores, s.respuesta, 'subir');
    const f = M.subirFichas('triangulo3', [1, 3, 5, 6, 2, 4], d);
    assert.equal(f.respuesta, 10 + 3 * d); erroresDistintos(f.errores, f.respuesta, 'subirFichas');
  }
  // las respuestas de las predicciones de la escena
  const pred = [M.corral(20, 64), M.examen(50, 140, 4, -1), M.corralAlReves(20, 64),
    M.regresivo([{ op: 'por', k: 3 }, { op: 'menos', k: 8 }, { op: 'entre', k: 2 }, { op: 'mas', k: 10 }], 30),
    M.mercado([{ op: 'gasta', parte: [1, 2], mas: 5 }, { op: 'gasta', parte: [1, 2], mas: 3 }], 12),
    M.ordenCambiado([{ op: 'mas', k: 6 }, { op: 'por', k: 2 }], 30, 0)];
  for (const P of pred) { erroresDistintos(P.errores, P.respuesta, 'predicción'); assert.equal(Object.keys(P.errores).length, 3); Object.values(P.errores).forEach(v => assert.ok(Number.isInteger(v) && v > 0)); }
});
test('comprobar: líneas incompletas, repetidas y completas', () => {
  const v = M.comprobar('cuadrado3', Array(9).fill(null));
  assert.equal(v.puestas, 0); assert.equal(v.iguales, false); assert.ok(v.lineas.every(l => l.suma === null));
  assert.equal(M.comprobar('triangulo3', [1, 1, 3, 4, 5, 6]).repetidas, true);
  assert.equal(M.comprobar('triangulo3', [1, 1, 3, 4, 5, 6]).valido, false);
});

test('dibujo: el corral pone cada ficha en su mitad, sin encimarse', () => {
  for (const W of [336, 520, 700]) for (const n of [10, 15, 20]) for (let c = 0; c <= n; c += 3) {
    const fichas = Array.from({ length: n }, (_, i) => (i < c ? 'c' : 'g'));
    const G = M.corralGeo(fichas, W, 230, { abajo: 30 });
    G.pos.forEach((p, i) => { assert.equal(M.mitadDe(G, p), fichas[i], 'en su mitad'); });
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) assert.ok(Math.hypot(G.pos[i].x - G.pos[j].x, G.pos[i].y - G.pos[j].y) >= 2 * G.r - 1e-9, 'encimadas');
    const U = M.corralGeo(fichas.map(() => '?'), W, 230, { una: true });
    assert.equal(U.pos.length, n);
  }
  for (const tipo of Object.keys(M.TABLEROS)) for (const W of [336, 600]) {
    const G = M.tableroGeo(tipo, W, 330);
    for (let i = 0; i < G.cas.length; i++) for (let j = i + 1; j < G.cas.length; j++) assert.ok(Math.hypot(G.cas[i].x - G.cas[j].x, G.cas[i].y - G.cas[j].y) > 2 * G.r, tipo + ' casillas encimadas');
    G.banca.forEach(b => assert.ok(b.y > Math.max(...G.cas.map(c => c.y)) + G.r, 'la banca va debajo'));
  }
  const T = M.tiraGeo(4, 336, 150);
  assert.ok(T.cajas[4].x + T.bw <= 336 - 7.9 && T.fw > 20);
  assert.equal(M.cercana([{ x: 0, y: 0 }, { x: 10, y: 0 }], { x: 9, y: 1 }, 20), 1);
  assert.equal(M.cercana([{ x: 0, y: 0 }], { x: 90, y: 1 }, 20), null);
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => M.fr(1, 0), /cero/);
  assert.throws(() => M.fr(1.5, 2), /enteros/);
  assert.throws(() => M.falsaSuposicion(2.5, 10, 2, 4), /entero/);
  assert.throws(() => M.falsaSuposicion(-1, 10, 2, 4), /negativo/);
  assert.throws(() => M.contarCorral(['x']), /gallina/);
  assert.throws(() => M.corralAlReves(15, 45), /entero/);
  assert.throws(() => M.examen(10, 41, 4, -1), /entero/);
  assert.throws(() => M.regresivo([], 3), /al menos una/);
  assert.throws(() => M.aplicar({ op: 'raiz', k: 2 }, 3), /desconocida/);
  assert.throws(() => M.aplicar({ op: 'entre', k: 0 }, 3), /cero/);
  assert.throws(() => M.aplicar({ op: 'gasta', parte: [3, 2], mas: 1 }, 3), /entre 0 y 1/);
  assert.throws(() => M.ordenCambiado([{ op: 'mas', k: 1 }], 3, 0), /dos operaciones/);
  assert.throws(() => M.mercado([{ op: 'mas', k: 1 }], 3), /gasta/);
  assert.throws(() => M.tablero('pentagono'), /desconocido/);
  assert.throws(() => M.distribuir('triangulo3', [1, 2, 3]), /6 fichas/);
  assert.throws(() => M.distribuir('triangulo3', [1, 1, 2, 3, 4, 5]), /no se repiten/);
  assert.throws(() => M.comprobar('cuadrado3', [1, 2]), /9 casillas/);
  assert.throws(() => M.subirFichas('triangulo3', [1, 2, 3, 4, 5, 6], 1), /no tiene todas/);
  assert.throws(() => M.corralGeo(['g'], 40, 40), /chico/);
  assert.throws(() => M.tiraGeo(0, 300, 100), /al menos una/);
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
  // la indicación y el título no adelantan lo que miden las predicciones
  assert.ok(!/sup[oó]n|todos|al rev[eé]s|atr[aá]s|final|contrari|deshac|invert|esquina|v[eé]rtice|dos veces|centro|diferencia|falta|sobra/i.test(papel.indicacion));
  assert.ok(!/sup[oó]n|al rev[eé]s|atr[aá]s|cangrejo|regresiv|esquina|v[eé]rtice|centro|dos veces/i.test(papel.titulo));
});
for (const p of (papel && papel.problemas) || []) test(`papel ${p.id}: la respuesta coincide con el motor`, () => {
  for (const x of p.verificar) comprobar(x.fn, x.args, x.espera, p.id);
});
