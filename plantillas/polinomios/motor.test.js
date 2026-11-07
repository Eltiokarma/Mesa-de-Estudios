// Pruebas del motor de «La máquina de Ruffini». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con polinomios al azar (semilla fija):
//    - Ruffini y la división clásica cumplen dividendo = divisor · cociente + resto, y el resto de Ruffini es P(raíz);
//    - el resto por sustitución (x² + k) es el de la división clásica;
//    - P(0) es el término independiente y P(1) la suma de coeficientes;
//    - factorK deja P(raíz) = 0 y las raíces racionales anulan P (y toda raíz racional es candidata);
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
  const r = llamar(fn, args);
  if (typeof espera !== 'object' || espera === null) { cerca(r, espera, que); return; }
  for (const [k, v] of Object.entries(espera)) { const x = campo(r, k); assert.ok(x !== undefined, `${que}: falta ${k}`); cerca(x, v, `${que} · ${k}`); }
}

// 1. casos.json
test('casos.json: formato', () => {
  assert.equal(datos.plantilla, 'polinomios');
  assert.ok(datos.casos.length >= 15 && datos.casos.length <= 22, `hay ${datos.casos.length} casos`);
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera !== undefined, JSON.stringify(c).slice(0, 80));
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
const ev = (p, x) => p.reduce((a, c) => a * x + c, 0);
function poliAzar(gmin, gmax, ceros) {
  const g = ent(gmin, gmax), p = [ent(1, 4) * (rnd() < .5 ? -1 : 1)];
  for (let i = 0; i < g; i++) p.push(ceros && rnd() < .3 ? 0 : ent(-9, 9));
  return p;
}
function mul(p, q) { const r = Array(p.length + q.length - 1).fill(0); p.forEach((a, i) => q.forEach((b, j) => { r[i + j] += a * b; })); return r; }
function suma(p, q) { const n = Math.max(p.length, q.length), P = Array(n - p.length).fill(0).concat(p), Q = Array(n - q.length).fill(0).concat(q); return P.map((c, i) => c + Q[i]); }
const recorta = p => { const s = p.slice(); while (s.length > 1 && Math.abs(s[0]) < 1e-12) s.shift(); return s; };

test('Ruffini: dividendo = divisor · cociente + resto y resto = P(raíz)', () => {
  for (let k = 0; k < N; k++) {
    const p = poliAzar(1, 5, true), a = ent(1, 3), b = ent(-6, 6);
    const R = motor.ruffini({ coefs: p, divisor: [a, b] });
    cerca(recorta(suma(mul([a, b], R.cociente), [R.resto])), recorta(p), `(${p}) ÷ (${a}x + ${b})`, 1e-9);
    cerca(R.resto, ev(p, -b / a), 'resto = P(−b/a)', 1e-9);
    cerca(motor.teoremaResto({ coefs: p, divisor: [a, b] }).valor, R.resto, 'teorema del resto', 1e-9);
    assert.equal(R.cociente.length, p.length - 1, 'el cociente tiene un grado menos');
  }
});
test('división clásica y por sustitución: dividendo = divisor · cociente + resto, resto de grado menor', () => {
  for (let k = 0; k < N; k++) {
    const D = poliAzar(2, 6, true), d = poliAzar(1, 3, true);
    const R = motor.dividir({ dividendo: D, divisor: d });
    cerca(recorta(suma(mul(recorta(d), R.cociente), R.resto)), recorta(D), `(${D}) ÷ (${d})`, 1e-9);
    assert.ok(recorta(R.resto).length < recorta(d).length || (R.resto.length === 1 && R.resto[0] === 0), 'grado del resto');
    const kk = ent(-5, 5) || 1, S = motor.restoSustitucion({ dividendo: D, k: kk }), C = motor.dividir({ dividendo: D, divisor: [1, 0, kk] });
    cerca(recorta(S.resto), recorta(C.resto.length === 1 ? [0, C.resto[0]] : C.resto), 'sustitución = división', 1e-9);
    const caja = motor.cajaDivision({ dividendo: D, divisor: [1, 0, kk] }); cerca(caja.comprobacion, recorta(D), 'la caja suma el dividendo', 1e-9);
  }
});
test('P(0), P(1), factor y raíces racionales', () => {
  for (let k = 0; k < N; k++) {
    const p = poliAzar(1, 5, true);
    cerca(motor.pDeCero({ coefs: p }).valor, ev(p, 0), 'P(0)'); cerca(motor.pDeUno({ coefs: p }).valor, ev(p, 1), 'P(1)');
    const r = ent(-4, 4) || 2, q = p.slice(); const pos = ent(1, q.length - 1); q[pos] = 'k';
    const K = motor.factorK({ coefs: q, raiz: r }), con = q.map(c => (c === 'k' ? K.valor : c));
    cerca(ev(con, r), 0, 'P(r) = 0 con ese k', 1e-9);
    // raíces racionales: (2x − 1)(x + r1)(x − r2) con independiente ≠ 0
    const r1 = ent(1, 5), r2 = ent(1, 5), P3 = mul(mul([2, -1], [1, r1]), [1, -r2]), RR = motor.raicesRacionales({ coefs: P3 });
    for (const z of [0.5, -r1, r2]) assert.ok(RR.raices.some(x => Math.abs(x - z) < 1e-12), `${z} es raíz de ${P3}`);
    for (const x of RR.raices) cerca(ev(P3, x), 0, 'anula P', 1e-9);
  }
});

function mismo(e, r) {
  if (r.cociente !== undefined && e.cociente !== undefined && r.resto !== undefined && typeof r.resto === 'number') return e.texto === r.texto && Math.abs(e.resto - r.resto) < 1e-12;
  if (Array.isArray(r.resto)) return e.texto === r.texto;
  return Math.abs(e.valor - r.valor) < 1e-12;
}
function sinChoques(r, que) {
  assert.ok(r.errores && Array.isArray(r.coinciden), `${que}: faltan errores o coinciden`);
  for (const [k, e] of Object.entries(r.errores)) {
    assert.ok(!mismo(e, r), `${que}: el error ${k} da lo mismo que la correcta`);
    assert.ok(/^(PO\d+|AL\d+)$/.test(e.id), `${que}: el error ${k} no tiene id`);
    assert.ok(e.regla, `${que}: el error ${k} no dice su regla`);
  }
  for (const k of r.coinciden) assert.ok(!(k in r.errores), `${que}: ${k} está en los dos lados`);
}
test('ningún error típico coincide con la respuesta correcta (casos y barrido)', () => {
  for (const c of datos.casos) for (const t of [c].concat(c.tambien || [])) { const r = llamar(t.fn || c.fn, t.args); if (r && r.errores) sinChoques(r, c.nombre); }
  for (let k = 0; k < N; k++) {
    const p = poliAzar(1, 5, true);
    sinChoques(motor.pDeCero({ coefs: p }), 'P(0)'); sinChoques(motor.pDeUno({ coefs: p }), 'P(1)');
    sinChoques(motor.ruffini({ coefs: p, divisor: [ent(1, 3), ent(-6, 6)] }), 'Ruffini');
    sinChoques(motor.teoremaResto({ coefs: p, divisor: [ent(1, 3), ent(-6, 6)] }), 'resto');
    sinChoques(motor.restoSustitucion({ dividendo: poliAzar(2, 6, true), k: ent(1, 4) * (rnd() < .5 ? -1 : 1) }), 'x² + k');
    const q = p.slice(); q[ent(1, q.length - 1)] = 'k'; const r = ent(-4, 4) || 3;
    try { sinChoques(motor.factorK({ coefs: q, raiz: r }), 'factorK'); } catch (e) { if (!/no aparece/.test(e.message)) throw e; }
    const m = ent(1, 8), n = ent(1, 8);
    sinChoques(motor.gradoProducto({ m, n }), 'P·Q'); if (m !== n) sinChoques(motor.gradoSuma({ m, n }), 'P + Q');
    sinChoques(motor.gradoPotencia({ m, k: ent(2, 5) }), '[P]ᵏ');
    sinChoques(motor.completo({ grado: ent(0, 20) }), 'completo'); sinChoques(motor.gradoDeCompleto({ terminos: ent(1, 20) }), 'grado de completo');
    sinChoques(motor.grado({ terminos: [{ c: 1, x: ent(0, 6), y: ent(0, 6) }, { c: -2, x: ent(0, 6), y: ent(0, 6) }, { c: 3, x: ent(0, 6), y: ent(0, 6) }] }), 'grado');
    const r1 = ent(1, 5), r2 = ent(1, 5);
    sinChoques(motor.raicesRacionales({ coefs: mul(mul([ent(1, 3), -1], [1, r1]), [1, -r2]) }), 'candidatos');
  }
});

// Las predicciones de la escena (index.html): respuesta = motor, opciones distintas y con la misma forma.
const P = { Q: [3, 0, -5, 4, -6], M: [{ c: 4, x: 3, y: 2 }, { c: -7, x: 5, y: 1 }, { c: 2, x: 1, y: 4 }] };
const ESCENA = {
  'paso2': () => { const r = motor.pDeCero({ coefs: P.Q }); return [r.texto, r.errores.sumaCoef.texto, r.errores.principal.texto, r.errores.cero.texto]; },
  'paso3': () => { const r = motor.grado({ terminos: P.M }); return [r.texto, r.errores.relativo.texto, r.errores.sumaTodos.texto, r.errores.sumaRelativos.texto]; },
  'paso4': () => { const r = motor.gradoProducto({ m: 3, n: 4 }); return [r.texto, r.errores.producto.texto, r.errores.mayor.texto]; },
  'paso5': () => { const r = motor.ruffini({ coefs: [2, 0, -7, 4], divisor: [1, -2] }); return [r.texto, r.errores.sinCero.texto, r.errores.signo.texto, r.errores.todaLaFila.texto]; },
  'paso6': () => { const r = motor.teoremaResto({ coefs: [1, -3, 1, 4], divisor: [1, 2] }); return [r.texto, r.errores.signo.texto, r.errores.parNegativo.texto, r.errores.independiente.texto]; },
  'paso7': () => { const r = motor.ruffini({ coefs: [4, -2, 6, 1], divisor: [2, -1] }); return [r.par, r.errores.sinDividir.par, r.errores.restoDividido.par, r.errores.signo.par]; },
  'paso8': () => { const r = motor.factorK({ coefs: [1, -3, 'k', 6], raiz: 2 }); return [r.texto, r.errores.signo.texto, r.errores.sumaCoef.texto, r.errores.despeje.texto]; },
  'p-de-uno': () => { const r = motor.pDeUno({ coefs: [2, -5, 1, 7] }); return [r.texto, r.errores.independiente.texto, r.errores.principal.texto, r.errores.sinSignos.texto]; },
  'trece-terminos': () => { const r = motor.gradoDeCompleto({ terminos: 13 }); return [r.texto, r.errores.igual.texto, r.errores.masUno.texto]; },
  'grado-de-la-suma': () => { const r = motor.gradoSuma({ m: 5, n: 3 }); return [r.texto, r.errores.suma.texto, r.errores.producto.texto, r.errores.menor.texto]; },
  'entre-x2-mas-1': () => { const r = motor.restoSustitucion({ dividendo: [1, 3, 0, -2, 5], k: 1 }); return [r.texto, r.errores.signo.texto, r.errores.unaVez.texto, r.errores.pierdeX.texto]; },
  'candidatos': () => { const r = motor.raicesRacionales({ coefs: [2, -3, -11, 6] }); return [r.texto, r.errores.soloPositivos.texto, r.errores.soloIndependiente.texto, r.errores.sinSimplificar.texto]; },
};
test('las predicciones de la escena: respuesta del motor, opciones distintas y de la misma forma', () => {
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  const forma = t => (/^Q = .*; R = /.test(t) ? 'par' : /^k = /.test(t) ? 'k' : /^[−\d]+$/.test(t) ? 'entero' : /x/.test(t) ? 'polinomio' : 'otro');
  for (const [id, f] of Object.entries(ESCENA)) {
    const ops = f();
    assert.equal(new Set(ops).size, ops.length, `${id}: opciones repetidas: ${ops.join(' · ')}`);
    assert.equal(new Set(ops.map(forma)).size, 1, `${id}: opciones de distinta forma: ${ops.join(' · ')}`);
    assert.ok(!ops.map(forma).includes('otro'), `${id}: forma desconocida`);
    const largos = ops.map(t => t.length); assert.ok(Math.max(...largos) <= 3 * Math.min(...largos) + 6, `${id}: largos muy distintos`);
    assert.ok(html.includes(`'${id}'`) || html.includes(`polinomios-${id}`), `${id}: la escena no la usa`);
  }
});

// 3. Errores de entrada
test('entradas inválidas', () => {
  assert.throws(() => motor.ruffini({ coefs: [1, 2], divisor: [0, 1] }), /a distinto de 0/);
  assert.throws(() => motor.ruffini({ coefs: [5], divisor: [1, 1] }), /grado 1 o más/);
  assert.throws(() => motor.ruffini({ coefs: [1, 2], divisor: [1] }), /\[a, b\]/);
  assert.throws(() => motor.dividir({ dividendo: [1, 2, 3], divisor: [4] }), /grado 1 o más/);
  assert.throws(() => motor.texto([]), /lista/);
  assert.throws(() => motor.texto(['dos']), /fracción/);
  assert.throws(() => motor.gradoSuma({ m: 3, n: 3 }), /distintos/);
  assert.throws(() => motor.gradoProducto({ m: 2.5, n: 3 }), /entero/);
  assert.throws(() => motor.grado({ terminos: [{ c: 0, x: 2 }] }), /distinto de 0/);
  assert.throws(() => motor.factorK({ coefs: [1, 2, 3], raiz: 1 }), /'k'/);
  assert.throws(() => motor.factorK({ coefs: ['k', 1], raiz: 0 }), /no aparece/);
  assert.throws(() => motor.raicesRacionales({ coefs: [1, 2, 0] }), /distinto de 0/);
  assert.throws(() => motor.raicesRacionales({ coefs: [1, '1/2', 3] }), /enteros/);
  assert.throws(() => motor.restoSustitucion({ dividendo: [1, 2, 3], k: 0 }), /k no puede ser 0/);
  assert.throws(() => motor.curva({ coefs: [1], desde: 2, hasta: 1 }), /mayor que desde/);
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
