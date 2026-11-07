// Pruebas del motor de «El plano que se deforma». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con matrices al azar (semilla fija):
//    - det(AB) = det A · det B, det(Aᵀ) = det A, det(kA) = kⁿ det A; intercambiar filas cambia el signo; fila de ceros
//      o filas proporcionales dan 0; Sarrus = cofactores = eliminación;
//    - A · A⁻¹ = I; Cramer cumple el sistema; (AB)ᵀ = BᵀAᵀ; las cizallas conservan el área y terminan en un rectángulo;
//    - NINGÚN ERROR TÍPICO COINCIDE CON LA RESPUESTA CORRECTA (en todos los casos y en un barrido de parámetros);
//    - las predicciones de la escena: la respuesta sale del motor, las opciones son distintas y de la misma forma.
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
  if (Array.isArray(esperado)) { assert.ok(Array.isArray(real), `${que}: se esperaba una lista`); assert.equal(real.length, esperado.length, `${que}: largo`); esperado.forEach((e, k) => cerca(real[k], e, `${que}[${k}]`, t)); return; }
  if (esperado && typeof esperado === 'object') { for (const [k, v] of Object.entries(esperado)) cerca(real[k], v, `${que}.${k}`, t); return; }
  if (typeof esperado !== 'number') { assert.deepEqual(real, esperado, que); return; }
  assert.ok(Math.abs(real - esperado) <= t * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
function llamar(fn, args) { assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`); return motor[fn](...args); }
const campo = (r, k) => k.split('.').reduce((o, p) => (o == null ? o : o[p]), r);
function comprobar(fn, args, espera, que) {
  assert.ok(espera && typeof espera === 'object' && !Array.isArray(espera), `${que}: 'espera' debe ser un objeto`);
  const r = llamar(fn, args);
  for (const [k, v] of Object.entries(espera)) { const x = campo(r, k); assert.ok(x !== undefined, `${que}: falta ${k}`); cerca(x, v, `${que} · ${k}`); }
}

// 1. casos.json
test('casos.json: formato', () => {
  assert.equal(datos.plantilla, 'matrices');
  assert.ok(datos.casos.length >= 15 && datos.casos.length <= 22, `hay ${datos.casos.length} casos`);
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera && typeof c.espera === 'object', JSON.stringify(c).slice(0, 80));
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Propiedades
function azar(sem) { let s = (sem >>> 0) || 1; return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296; }
const rnd = azar(2026);
const ent = (a, b) => a + Math.floor((b - a + 1) * rnd());
const N = 300;
const matAzar = (m, n, r) => Array.from({ length: m }, () => Array.from({ length: n }, () => ent(-(r || 6), r || 6)));
const mul = (A, B) => A.map(f => B[0].map((_, j) => f.reduce((s, a, k) => s + a * B[k][j], 0)));
const tr = A => A[0].map((_, j) => A.map(f => f[j]));
const D = M => motor.det({ M }).valor;
const cercaM = (A, B, que) => cerca(A, B, que, 1e-9);

test('determinante: producto, transpuesta, kA, filas intercambiadas, ceros y proporcionales; Sarrus = cofactores', () => {
  for (let k = 0; k < N; k++) {
    const n = ent(2, 4), A = matAzar(n, n), B = matAzar(n, n), c = ent(-3, 3);
    cerca(D(mul(A, B)), D(A) * D(B), 'det(AB)');
    cerca(D(tr(A)), D(A), 'det(Aᵀ)');
    cerca(D(A.map(f => f.map(x => c * x))), c ** n * D(A), 'det(kA)');
    cerca(motor.detK({ detA: D(A), k: c, n }).valor, c ** n * D(A), 'detK');
    const S = A.slice(); [S[0], S[1]] = [S[1], S[0]]; cerca(D(S), -D(A), 'intercambio');
    const Z = A.map((f, i) => (i === n - 1 ? f.map(() => 0) : f)); cerca(D(Z), 0, 'fila de ceros');
    const P = A.map((f, i) => (i === n - 1 ? A[0].map(x => c * x) : f)); cerca(D(P), 0, 'proporcionales');
    if (n === 2) cerca(motor.det2({ M: A }).valor, A[0][0] * A[1][1] - A[0][1] * A[1][0], 'ad − bc');
    if (n === 3) { const r = motor.det3({ M: A }); cerca(r.valor, D(A), 'Sarrus'); cerca(r.cofactores.reduce((s, x) => s + x.termino, 0), r.valor, 'cofactores'); cerca(r.principales - r.secundarias, r.valor, 'diagonales'); }
  }
});
test('inversa, Cramer, transpuesta del producto, cizallas y composición', () => {
  for (let k = 0; k < N; k++) {
    const A = matAzar(2, 2, 5), d = A[0][0] * A[1][1] - A[0][1] * A[1][0];
    if (d !== 0) {
      const I = motor.inversa2({ M: A }); cercaM(mul(A, I.matriz), [[1, 0], [0, 1]], 'A·A⁻¹'); cercaM(mul(I.matriz, A), [[1, 0], [0, 1]], 'A⁻¹·A');
      const b = [ent(-9, 9), ent(-9, 9)], C = motor.cramer2({ A, b });
      cerca([A[0][0] * C.x + A[0][1] * C.y, A[1][0] * C.x + A[1][1] * C.y], b, 'Cramer cumple el sistema');
    } else assert.throws(() => motor.inversa2({ M: A }), /no tiene inversa/);
    if (A[0][0] !== 0 && d !== 0) {
      const Z = motor.cizalla({ M: A });
      for (const p of Z.pasos) cerca(p.u[0] * p.v[1] - p.u[1] * p.v[0], d, 'la cizalla conserva el área con signo');
      const f = Z.pasos[2]; cerca([f.u[1], f.v[0]], [0, 0], 'termina en un rectángulo'); cerca(Z.ancho * Z.alto, d, 'ancho · alto = det');
    }
    const P = motor.paralelogramo({ M: A }); cerca(P.area, Math.abs(d), 'área'); assert.equal(P.orientacion, d > 0 ? 'antihorario' : d < 0 ? 'horario' : 'plano');
    const m = ent(1, 3), n = ent(1, 3), q = ent(1, 3), X = matAzar(m, n), Y = matAzar(n, q);
    cercaM(motor.productoTranspuesta({ A: X, B: Y }).matriz, mul(tr(Y), tr(X)), '(AB)ᵀ = BᵀAᵀ');
    cercaM(motor.producto({ A: X, B: Y }).matriz, mul(X, Y), 'fila por columna');
    const B = matAzar(2, 2, 3); cercaM(motor.composicion({ primero: B, luego: A }).matriz, mul(A, B), 'primero B, luego A = AB');
    const p = [ent(-5, 5), ent(-5, 5)]; cerca(motor.aplicar({ M: mul(A, B), p }), motor.aplicar({ M: A, p: motor.aplicar({ M: B, p }) }), 'AB·p = A(B·p)');
  }
  const A3 = [[2, 1, 0], [1, 3, 1], [0, 1, 2]], b3 = [3, 9, 7], C3 = motor.cramer3({ A: A3, b: b3 });
  cerca(A3.map(f => f[0] * C3.x + f[1] * C3.y + f[2] * C3.z), b3, 'Cramer 3 × 3');
});

function sinChoques(r, que) {
  assert.ok(r.errores && Array.isArray(r.coinciden), `${que}: faltan errores o coinciden`);
  const vistos = new Set([r.texto]);
  for (const [k, e] of Object.entries(r.errores)) {
    assert.ok(!vistos.has(e.texto), `${que}: el error ${k} da lo mismo que la correcta u otro error (${e.texto})`); vistos.add(e.texto);
    if (e.valor !== undefined && typeof r.valor === 'number' && /^[−\d/]+$/.test(r.texto)) assert.ok(Math.abs(e.valor - r.valor) > 1e-12, `${que}: ${k} vale lo mismo`);
    assert.ok(/^(MT\d+|AL\d+)$/.test(e.id), `${que}: el error ${k} no tiene id`);
    assert.ok(e.regla, `${que}: el error ${k} no dice su regla`);
  }
  for (const k of r.coinciden) assert.ok(!(k in r.errores), `${que}: ${k} está en los dos lados`);
}
test('ningún error típico coincide con la respuesta correcta (casos y barrido)', () => {
  for (const c of datos.casos) for (const t of [c].concat(c.tambien || [])) { const r = llamar(t.fn || c.fn, t.args); if (r && r.errores) sinChoques(r, c.nombre); }
  for (let k = 0; k < N; k++) {
    const A = matAzar(2, 2), B = matAzar(2, 2), d = A[0][0] * A[1][1] - A[0][1] * A[1][0];
    sinChoques(motor.det2({ M: A }), 'det2'); sinChoques(motor.det3({ M: matAzar(3, 3) }), 'det3');
    sinChoques(motor.producto({ A, B }), 'producto'); sinChoques(motor.producto({ A: matAzar(2, 3), B: matAzar(3, ent(1, 3)) }), 'producto rectangular');
    sinChoques(motor.composicion({ primero: B, luego: A }), 'composición');
    sinChoques(motor.construir({ filas: ent(1, 4), columnas: ent(1, 4), formula: { i: ent(-3, 3), j: ent(-3, 3), c: ent(-2, 2) } }), 'construir');
    const M = matAzar(ent(1, 4), ent(1, 4)); sinChoques(motor.elemento({ M, i: ent(1, M.length), j: ent(1, M[0].length) }), 'elemento');
    sinChoques(motor.ordenProducto({ A: [ent(1, 5), ent(1, 5)], B: [ent(1, 5), ent(1, 5)] }), 'órdenes');
    sinChoques(motor.detK({ detA: ent(-9, 9), k: ent(-4, 4), n: ent(1, 4) }), 'det(kA)');
    sinChoques(motor.propiedadesDet({ detA: ent(-6, 6), detB: ent(-6, 6) }), 'propiedades');
    sinChoques(motor.productoTranspuesta({ A, B }), '(AB)ᵀ');
    if (d !== 0) { sinChoques(motor.inversa2({ M: A }), 'inversa'); sinChoques(motor.cramer2({ A, b: [ent(-9, 9), ent(-9, 9)] }), 'Cramer'); }
    const K = matAzar(2, 2); K[ent(0, 1)][ent(0, 1)] = 'k';
    try { sinChoques(motor.kSinInversa({ M: K }), 'k sin inversa'); } catch (e) { if (!/no depende de k/.test(e.message)) throw e; }
  }
});

// Las predicciones de la escena (index.html): respuesta = motor, opciones distintas y con la misma forma.
const ESCENA = {
  'paso2': () => { const r = motor.construir({ filas: 2, columnas: 3, formula: { i: 2, j: -1, c: 0 } }); return [r.texto, r.errores.cambiaIJ.texto, r.errores.ordenAlReves.texto, r.errores.porColumnas.texto]; },
  'paso3': () => { const r = motor.producto({ A: [[1, 2], [3, -1]], B: [[2, 0], [1, 4]] }); return [r.texto, r.errores.elementoAElemento.texto, r.errores.alReves.texto, r.errores.filaPorFila.texto]; },
  'paso4': () => { const r = motor.composicion({ primero: [[2, 0], [0, 1]], luego: [[0, -1], [1, 0]] }); return [r.texto, r.errores.alReves.texto, r.errores.suma.texto, r.errores.elementoAElemento.texto]; },
  'paso5': () => { const r = motor.det2({ M: [[2, 2], [1, 3]] }); return [r.texto, r.errores.sumaDiagonales.texto, r.errores.alReves.texto, r.errores.filas.texto]; },
  'paso6': () => { const r = motor.det2({ M: [[1, 4], [2, 3]] }); return [r.texto, r.errores.sinSigno.texto, r.errores.sumaDiagonales.texto, r.errores.filas.texto]; },
  'paso7': () => { const r = motor.kSinInversa({ M: [['k', 6], [2, 3]] }); return [r.texto, r.errores.sumaDiagonales.texto, r.errores.filas.texto, r.errores.cero.texto]; },
  'paso8': () => { const r = motor.inversa2({ M: [[4, 3], [2, 2]] }); return [r.texto, r.errores.sinDividir.texto, r.errores.sinSignos.texto, r.errores.sinIntercambiar.texto]; },
  'el-triple': () => { const r = motor.detK({ detA: 4, k: 3, n: 2 }); return [r.texto, r.errores.lineal.texto, r.errores.porElementos.texto]; },
  'dos-determinantes': () => { const r = motor.propiedadesDet({ detA: 2, detB: 3 }); return [r.texto, r.errores.suma.texto, r.errores.transpuesta.texto, r.errores.ordenCambia.texto]; },
  'ordenes': () => { const r = motor.ordenProducto({ A: [2, 3], B: [3, 4] }); return [r.texto, r.errores.medio.texto, r.errores.reves.texto, r.errores.mismoOrden.texto]; },
  'sarrus': () => { const r = motor.det3({ M: [[2, 1, 3], [0, 4, 1], [1, 2, 5]] }); return [r.texto, r.errores.sumaTodo.texto, r.errores.soloPrincipal.texto, r.errores.alReves.texto]; },
  'cramer': () => { const r = motor.cramer2({ A: [[2, 1], [1, 2]], b: [5, 4] }); return [r.texto, r.errores.sinDividir.texto, r.errores.alReves.texto, r.errores.otraColumna.texto]; },
};
test('las predicciones de la escena: respuesta del motor, opciones distintas y de la misma forma', () => {
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  const forma = t => (/^\[.*\]$/.test(t) ? 'matriz' : /^AB .*; BA /.test(t) ? 'ordenes' : /^det\(.*\) = [−\d/]+$/.test(t) ? 'det' : /^k = [−\d/]+$/.test(t) ? 'k' : /^x = [−\d/]+$/.test(t) ? 'x' : /^[−\d/]+$/.test(t) ? 'numero' : 'otro');
  for (const [id, f] of Object.entries(ESCENA)) {
    const ops = f();
    assert.equal(new Set(ops).size, ops.length, `${id}: opciones repetidas: ${ops.join(' · ')}`);
    assert.equal(new Set(ops.map(forma)).size, 1, `${id}: opciones de distinta forma: ${ops.join(' · ')}`);
    assert.ok(!ops.map(forma).includes('otro'), `${id}: forma desconocida`);
    const largos = ops.map(t => t.length); assert.ok(Math.max(...largos) <= 3 * Math.min(...largos) + 6, `${id}: largos muy distintos`);
    assert.ok(html.includes(`'${id}'`) || html.includes(`matrices-${id}`), `${id}: la escena no la usa`);
  }
});

// 3. Errores de entrada
test('entradas inválidas', () => {
  assert.throws(() => motor.producto({ A: [[1, 2]], B: [[1, 2]] }), /columnas de A/);
  assert.throws(() => motor.sumar({ A: [[1, 2]], B: [[1], [2]] }), /mismo orden/);
  assert.throws(() => motor.det({ M: [[1, 2, 3], [4, 5, 6]] }), /cuadradas/);
  assert.throws(() => motor.det2({ M: [[1, 2, 3], [4, 5, 6], [7, 8, 9]] }), /2 × 2/);
  assert.throws(() => motor.det3({ M: [[1, 2], [3, 4]] }), /3 × 3/);
  assert.throws(() => motor.textoMatriz([[1, 2], [3]]), /mismo largo/);
  assert.throws(() => motor.textoMatriz([]), /lista de filas/);
  assert.throws(() => motor.textoMatriz([['dos']]), /fracción/);
  assert.throws(() => motor.inversa2({ M: [[2, 4], [1, 2]] }), /no tiene inversa/);
  assert.throws(() => motor.cramer2({ A: [[2, 4], [1, 2]], b: [1, 1] }), /det = 0/);
  assert.throws(() => motor.kSinInversa({ M: [[1, 2], [3, 4]] }), /'k'/);
  assert.throws(() => motor.kSinInversa({ M: [['k', 0], [0, 0]] }), /no depende de k/);
  assert.throws(() => motor.elemento({ M: [[1, 2, 3], [4, 5, 6]], i: 3, j: 2 }), /no existe/);
  assert.throws(() => motor.cizalla({ M: [[0, 1], [1, 0]] }), /a ≠ 0/);
  assert.throws(() => motor.composicion({ primero: [[1, 2]], luego: [[1, 0], [0, 1]] }), /cuadradas/);
  assert.equal(motor.textoNumero('-6/4'), '−3/2');
});

// 4. papel.json
const papel = JSON.parse(fs.readFileSync(path.join(__dirname, 'papel.json'), 'utf8'));
test('papel.json: entre 8 y 10 problemas, con respuesta, pasos y verificación', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 8 && papel.problemas.length <= 10);
  const ids = new Set();
  for (const p of papel.problemas) {
    assert.ok(p.id && !ids.has(p.id), p.id); ids.add(p.id);
    assert.ok(p.enunciado && p.respuesta && Array.isArray(p.pasos) && p.pasos.length, `${p.id}: falta texto`);
    assert.ok(Array.isArray(p.verificar) && p.verificar.length, `${p.id}: falta verificar`);
    assert.ok(!/<[a-z]/i.test(p.enunciado + p.respuesta + p.pasos.join('')), `${p.id}: texto plano, sin HTML`);
    assert.ok(!/\d\.\d/.test(p.enunciado + p.respuesta + p.pasos.join('')), `${p.id}: se escribe con coma decimal`);
  }
});
for (const p of papel.problemas) test(`papel ${p.id}: ${p.enunciado.slice(0, 60)}`, () => {
  for (const v of p.verificar) comprobar(v.fn, v.args, v.espera, p.id);
});
