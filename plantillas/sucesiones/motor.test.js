// Pruebas del motor de «La torre de fichas». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con números al azar (semilla fija): la aritmética y la geométrica por recurrencia; la cantidad de
//    términos de ida y vuelta; Gauss por suma directa; las sumas notables término a término; el método de diferencias
//    reproduce los términos; las figuras se cuentan igual por geometría que por fórmula; las cuerdas cumplen Moser;
//    y NINGÚN error típico da la respuesta correcta (no puede ser una opción incorrecta).
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
const campo = (r, k) => (k === 'valor' && (typeof r === 'number' || Array.isArray(r)) ? r : k.split('.').reduce((o, p) => (o == null ? o : o[p]), r));
function comprobar(fn, args, espera, que) {
  const r = llamar(fn, args);
  for (const [k, v] of Object.entries(espera)) {
    const x = campo(r, k);
    assert.ok(x !== undefined, `${que}: falta ${k}`);
    cerca(x, v, `${que} · ${k}`);
  }
  return r;
}

// 1. casos.json
test('casos.json: formato', () => {
  assert.equal(datos.plantilla, 'sucesiones');
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
const iguales = (a, b) => a === b || (Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b)));
// La regla extra: ningún error típico coincide con la respuesta correcta.
function sinErrorCorrecto(r, correcto, que) {
  assert.ok(r.errores && typeof r.errores === 'object', `${que}: falta errores`);
  for (const [k, v] of Object.entries(r.errores)) assert.ok(!iguales(v, correcto), `${que}: el error ${k} da la respuesta correcta (${v})`);
}

test('aritmética: el término por recurrencia, la fórmula r·n + (a₁ − r) y los errores típicos dan otra cosa', () => {
  for (let k = 0; k < N; k++) {
    const a1 = ent(-20, 40), r = ent(-9, 12), n = ent(1, 80);
    const A = motor.aritmetica({ a1, r, n });
    let t = a1; for (let j = 1; j < n; j++) t += r;
    cerca(A.an, t, 'recurrencia'); cerca(A.formula.b * n + A.formula.c, t, 'fórmula');
    sinErrorCorrecto(A, A.an, `aritmética ${a1}, ${r}, ${n}`);
    const m = ent(1, 40), D = motor.desdeOtroTermino({ a1, r, m, n });
    cerca(D.an, A.an, 'desde otro término'); sinErrorCorrecto(D, D.an, 'desde otro término');
    // el objeto entero acierta solo si no hay parte fija (a₁ = r) o si n = m
    if (r !== 0 && a1 !== r && n !== m) assert.ok('objetoEntero' in D.errores);
    if (r !== 0 && n >= 1) {
      const C = motor.cantidadTerminos({ a1, r, an: A.an }); assert.equal(C.n, n); sinErrorCorrecto(C, n, 'cantidad de términos');
      const S = motor.sumaAritmetica({ a1, r, n }); cerca(S.S, Array.from({ length: n }, (_, j) => a1 + j * r).reduce((s, x) => s + x, 0), 'suma');
      sinErrorCorrecto(S, S.S, 'suma aritmética');
    }
  }
});
test('geométrica: término, suma finita e infinita; ningún error es la respuesta', () => {
  for (let k = 0; k < N; k++) {
    const a1 = ent(1, 9) * (rnd() < 0.2 ? -1 : 1), q = [2, 3, -2, 0.5, 1.5, 4][ent(0, 5)], n = ent(1, 14);
    const G = motor.geometrica({ a1, q, n });
    let t = a1, s = 0; for (let j = 1; j <= n; j++) { s += t; if (j < n) t *= q; }
    cerca(G.an, t, 'recurrencia'); sinErrorCorrecto(G, G.an, `geométrica ${a1}, ${q}, ${n}`);
    const S = motor.sumaGeometrica({ a1, q, n }); cerca(S.S, s, 'suma'); sinErrorCorrecto(S, S.S, 'suma geométrica');
    const qi = al(-0.9, 0.9), I = motor.sumaInfinita({ a1, q: qi });
    cerca(I.S, a1 / (1 - qi), 'infinita'); sinErrorCorrecto(I, I.S, 'suma infinita');
    // las sumas parciales se acercan al límite
    assert.ok(Math.abs(I.parciales[11] - I.S) <= Math.abs(I.parciales[0] - I.S) + 1e-12);
  }
  for (let d = 0; d <= 30; d++) { const D = motor.dobleces(d); assert.equal(D.capas, 2 ** d); sinErrorCorrecto(D, D.capas, `dobleces ${d}`); }
  for (let k = 1; k <= 30; k++) {
    const M = motor.mitades(k); cerca(M.suma + M.falta, 1, 'el cuadrado entero');
    cerca(M.piezas.reduce((s, p) => s + p.w * p.h, 0), M.suma, 'área de las piezas');
    cerca(M.resto.w * M.resto.h, M.falta, 'lo que falta');
  }
});
test('segundo orden: a, b y c reproducen los términos; la tabla de diferencias termina en una constante', () => {
  for (let k = 0; k < N; k++) {
    let a = ent(-4, 4); if (a === 0) a = 1;
    const b = ent(-10, 10), c = ent(-20, 20), f = n => a * n * n + b * n + c, m = ent(3, 6), K = ent(1, 30);
    const t = Array.from({ length: m }, (_, j) => f(j + 1));
    const S = motor.segundoOrden({ terminos: t, k: K });
    assert.equal(S.a, a); assert.equal(S.b, b); assert.equal(S.c, c); assert.equal(S.ak, f(K));
    sinErrorCorrecto(S, S.ak, `segundo orden ${a}, ${b}, ${c}, k ${K}`);
    const D = motor.diferencias(t.concat([f(m + 1)]));
    assert.equal(D.orden, 2); assert.equal(D.constante, 2 * a);
    const Sg = motor.siguiente(t.concat([f(m + 1)]));
    assert.equal(Sg.siguiente, f(m + 2)); sinErrorCorrecto(Sg, Sg.siguiente, 'siguiente');
  }
});
test('figuras: el conteo por geometría coincide con la fórmula; lo nuevo es la diferencia; ningún error es la respuesta', () => {
  for (const tipo of motor.TIPOS) {
    let ant = 0;
    for (let n = 1; n <= 24; n++) {
      const F = motor.figura(tipo, n);
      assert.equal(F.cantidad, F.porFormula, `${tipo} ${n}: geometría ${F.cantidad}, fórmula ${F.porFormula}`);
      assert.equal(F.nuevos, F.cantidad - ant, `${tipo} ${n}: nuevos`); ant = F.cantidad;
      assert.equal(F.piezas.filter(p => p.paso === n).length, F.nuevos, `${tipo} ${n}: las piezas del último paso`);
      sinErrorCorrecto(F, F.cantidad, `${tipo} ${n}`);
      // ninguna pieza repetida
      const vistas = new Set(F.piezas.map(p => p.tipo === 'ficha' ? `${p.x},${p.y}` : [[p.x1, p.y1], [p.x2, p.y2]].map(z => z.map(v => v.toFixed(6)).join(',')).sort().join('|')));
      assert.equal(vistas.size, F.cantidad, `${tipo} ${n}: piezas repetidas`);
    }
  }
  // palitos compartidos: en la fila de cuadrados son n − 1 y contarlos dos veces da 4n
  for (let n = 1; n <= 30; n++) {
    const F = motor.figura('cuadrados', n);
    assert.equal(F.compartidos, n - 1); assert.equal(F.cantidad + F.compartidos, 4 * n);
    const T = motor.figura('triangulo-palitos', n);
    assert.ok(T.piezas.every(p => p.deArriba === 1), 'cada palito es lado de un solo triangulito hacia arriba');
    assert.equal(T.cantidad, 3 * n * (n + 1) / 2);
  }
});
test('sumas notables, Gauss y apretones: término a término; ningún error es la respuesta', () => {
  const term = { naturales: j => j, pares: j => 2 * j, impares: j => 2 * j - 1, cuadrados: j => j * j, cubos: j => j ** 3 };
  for (let n = 1; n <= 120; n++) {
    for (const [tipo, t] of Object.entries(term)) {
      const S = motor.sumaNotable(tipo, n); let s = 0; for (let j = 1; j <= n; j++) s += t(j);
      assert.equal(S.S, s, `${tipo} ${n}`); sinErrorCorrecto(S, S.S, `${tipo} ${n}`);
      const H = motor.sumaHasta({ tipo, ultimo: t(n) }); assert.equal(H.n, n); assert.equal(H.S, s); sinErrorCorrecto(H, H.S, `hasta ${tipo} ${n}`);
    }
    const G = motor.gauss(n); assert.equal(2 * G.S, G.area); sinErrorCorrecto(G, G.S, `gauss ${n}`);
    if (n <= 200) G.escalera.forEach((x, j) => assert.equal(x + G.copia[j], n + 1, 'cada fila del rectángulo mide n + 1'));
    if (n >= 2 && n <= 60) {
      const A = motor.apretones(n); assert.equal(A.pares.length, A.total); assert.equal(A.nuevos.reduce((s, x) => s + x, 0), A.total);
      sinErrorCorrecto(A, A.total, `apretones ${n}`);
    }
  }
});
test('regiones del círculo: Moser contra las cuerdas dibujadas; 1, 2, 4, 8, 16 y luego 31', () => {
  for (let n = 1; n <= 30; n++) { const R = motor.regionesCirculo(n); sinErrorCorrecto(R, R.regiones, `regiones ${n}`); }
  assert.deepEqual(motor.regionesCirculo(6).serie, [1, 2, 4, 8, 16, 31]);
  for (let k = 0; k < 120; k++) {
    const n = ent(1, 8), A = []; while (A.length < n) { const a = al(0, 360); if (A.every(b => Math.abs(a - b) > 1)) A.push(a); }
    const C = motor.cuerdas(A);
    if (C.generales) { assert.equal(C.regiones, motor.regionesCirculo(n).regiones); assert.equal(C.cruces.length, motor.comb(n, 4)); }
  }
  // los puntos de la escena: cada prefijo está en posición general
  const ESC = [165, 30, 105, 230, 280, 340];
  for (let n = 1; n <= 6; n++) { const C = motor.cuerdas(ESC.slice(0, n)); assert.ok(C.generales); assert.equal(C.regiones, motor.regionesCirculo(n).regiones); }
  // las regiones mientras se trazan las cuerdas: suben de a poco y terminan en el total
  const Cp = motor.cuerdas(ESC); assert.equal(Cp.progreso.length, Cp.cuerdas.length + 1); assert.equal(Cp.progreso[0], 1);
  assert.equal(Cp.progreso[Cp.progreso.length - 1], Cp.regiones); Cp.progreso.slice(1).forEach((x, j) => assert.ok(x > Cp.progreso[j]));
});
test('analogías y distribuciones: la regla encontrada da lo mismo que la regla con que se armaron las filas', () => {
  // las reglas, escritas aparte (no se leen del motor)
  const R = { suma: (a, b) => a + b, producto: (a, b) => a * b, dobleDeLaSuma: (a, b) => 2 * (a + b), productoMasUno: (a, b) => a * b + 1,
    sumaDeCuadrados: (a, b) => a * a + b * b, diferencia: (a, b) => a - b, dobleDelPrimeroMasSegundo: (a, b) => 2 * a + b, productoMenosSuma: (a, b) => a * b - (a + b) };
  let probadas = 0;
  for (let k = 0; k < N; k++) {
    const nombre = Object.keys(R)[ent(0, Object.keys(R).length - 1)], f = R[nombre];
    const filas = Array.from({ length: 3 }, () => { const a = ent(2, 12), b = ent(1, 9); return [a, b, f(a, b)]; });
    const x = filas[2][2]; filas[2] = [filas[2][0], filas[2][1], null];
    let r; try { r = motor.regla(filas); } catch (e) { assert.match(e.message, /más de una regla/); continue; }
    probadas++;
    assert.equal(r.valor, x, `${nombre}: ${JSON.stringify(filas)}`); assert.ok(r.reglas.includes(nombre));
    sinErrorCorrecto(r, r.valor, nombre);
  }
  assert.ok(probadas > N / 2, 'casi siempre dos filas bastan');
  const r1 = motor.regla([[12, 8, 40], [15, 9, 48], [7, 5, null]]); assert.equal(r1.valor, 24); assert.equal(r1.regla, 'dobleDeLaSuma');
  // dos filas que cumplen a · b + 1, a² + b y b² − a: se rechaza; con una tercera fila, queda una sola regla
  assert.throws(() => motor.regla([[2, 3, 7], [4, 5, 21], [6, 1, null]]), /más de una regla/);
  const r2 = motor.regla([[2, 3, 7], [4, 5, 21], [3, 2, 7], [6, 1, null]]); assert.deepEqual(r2.reglas, ['productoMasUno']);
  // y nunca se devuelve una respuesta con dos reglas posibles
  for (let k = 0; k < N; k++) { const filas = [[ent(1, 9), ent(1, 9), ent(1, 60)], [ent(1, 9), ent(1, 9), ent(1, 60)], [ent(1, 9), ent(1, 9), null]];
    try { assert.equal(motor.regla(filas).reglas.length, 1); } catch (e) { assert.match(e.message, /ninguna regla|más de una regla/); } }
});
test('los números de las predicciones de la escena: opciones distintas entre sí y de la correcta', () => {
  const distintos = xs => assert.equal(new Set(xs.map(x => +x.toFixed(9))).size, xs.length, xs.join(' · '));
  const T = motor.desdeOtroTermino({ a1: 5, r: 3, m: 10, n: 20 }); distintos([T.an, T.errores.objetoEntero, T.errores.diferenciaComoTermino, T.errores.aditiva]);
  const F = motor.figura('cuadrados', 10); distintos([F.cantidad, F.errores.cuentaDoble, F.errores.diferenciaComoTermino, F.errores.nEnVezDeNmenos1]);
  const A = motor.aritmetica({ a1: 7, r: 4, n: 50 }); distintos([A.an, A.errores.nEnVezDeNmenos1, A.errores.diferenciaComoTermino, A.errores.objetoEntero]);
  const G = motor.gauss(100); distintos([G.S, G.errores.sinDividir, G.errores.nCuadradoMedio, G.errores.nMenosUno]);
  const Q = motor.segundoOrden({ terminos: [4, 12, 24, 40], k: 10 }), Qf = motor.figura('cuadricula', 10);
  distintos([Q.ak, Q.errores.comoLinealUltima, Q.errores.objetoEntero, Qf.errores.cuentaDoble]);
  const D = motor.dobleces(10); distintos([D.capas, D.errores.comoAritmetica, D.errores.potenciaAlReves, D.errores.objetoEntero]);
  const I = motor.sumaInfinita({ a1: 0.5, q: 0.5 }); distintos([I.S, I.errores.primerTerminoUno, I.errores.diverge]);
  const P = motor.figura('triangulo-palitos', 10); distintos([P.cantidad, P.errores.cuentaDoble, P.errores.comoLineal, P.errores.objetoEntero]);
  const H = motor.apretones(10); distintos([H.total, H.errores.cuentaDoble, H.errores.nCuadrado, H.errores.conUnoMismo]);
  const R = motor.regionesCirculo(6); distintos([R.regiones, R.errores.geometrica, R.errores.mismoAumento, R.errores.objetoEntero]);
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.aritmetica({ a1: 2, r: 3, n: 0 }), /al menos 1/);
  assert.throws(() => motor.aritmetica({ a1: 2, r: 3, n: 2.5 }), /entero/);
  assert.throws(() => motor.aritmetica({ a1: '2', r: 3, n: 2 }), /número/);
  assert.throws(() => motor.cantidadTerminos({ a1: 7, r: 4, an: 20 }), /no es un término/);
  assert.throws(() => motor.cantidadTerminos({ a1: 7, r: 0, an: 7 }), /r = 0/);
  assert.throws(() => motor.sumaInfinita({ a1: 1, q: 1 }), /\|q\| < 1/);
  assert.throws(() => motor.sumaInfinita({ a1: 1, q: -2 }), /\|q\| < 1/);
  assert.throws(() => motor.segundoOrden({ terminos: [1, 2, 4, 8], k: 5 }), /segunda diferencia/);
  assert.throws(() => motor.segundoOrden({ terminos: [1, 2], k: 5 }), /al menos 3/);
  assert.throws(() => motor.siguiente([1, 5, 2, 9]), /ley de formación/);
  assert.throws(() => motor.figura('estrella', 3), /desconocido/);
  assert.throws(() => motor.figura('cuadrados', 0), /al menos 1/);
  assert.throws(() => motor.sumaNotable('primos', 3), /desconocida/);
  assert.throws(() => motor.sumaHasta({ tipo: 'impares', ultimo: 40 }), /no es el último/);
  assert.throws(() => motor.apretones(1), /al menos 2/);
  assert.throws(() => motor.regla([[1, 2, 3], [4, 5, 9]]), /null/);
  assert.throws(() => motor.regla([[1, 2, 30], [4, 5, 7], [1, 1, null]]), /ninguna regla/);
  assert.throws(() => motor.regla([[2, 2, 4], [1, 1, null]]), /dos filas|más de una regla/);
  assert.throws(() => motor.dobleces(-1), /al menos 0/);
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
