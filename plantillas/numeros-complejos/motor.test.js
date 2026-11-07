// Pruebas del motor de «La flecha en el plano» (números complejos). Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con números al azar (semilla fija):
//    - iⁿ cumple el ciclo de 4, i^(n + 4) = iⁿ e iⁿ · i^(−n) = 1;
//    - producto y cociente binómicos: (z/w)·w = z, z·z̄ = |z|², |zw| = |z||w| y Arg(zw) = Arg z + Arg w (mod 360°);
//    - polar ↔ binómica de ida y vuelta, y productoPolar / cocientePolar coinciden con multiplicar / dividir;
//    - De Moivre coincide con multiplicar z por sí mismo n veces;
//    - las raíces de la cuadrática anulan el polinomio y son conjugadas cuando Δ < 0;
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
  if (esperado && typeof esperado === 'object') { assert.ok(real && typeof real === 'object', `${que}: se esperaba un objeto`); for (const [k, v] of Object.entries(esperado)) cerca(real[k], v, `${que}.${k}`, t); return; }
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
  assert.equal(datos.plantilla, 'numeros-complejos');
  assert.ok(typeof datos.verificacion === 'string', 'falta verificacion');
  assert.ok(datos.casos.length >= 15 && datos.casos.length <= 22, `hay ${datos.casos.length} casos`);
  for (const c of datos.casos) {
    assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera && typeof c.espera === 'object', JSON.stringify(c).slice(0, 80));
    for (const t of c.tambien || []) assert.ok(t.espera && typeof t.espera === 'object' && !Array.isArray(t.espera), `${c.nombre}: 'espera' de 'tambien' debe ser objeto`);
  }
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
const cx = () => ({ re: ent(-9, 9), im: ent(-9, 9) });
const noCero = () => { let z; do z = cx(); while (!z.re && !z.im); return z; };
const mulN = (p, q) => ({ re: p.re * q.re - p.im * q.im, im: p.re * q.im + p.im * q.re });
const igualN = (p, q, que, tol) => { cerca(p.re, q.re, `${que} (re)`, tol || 1e-9); cerca(p.im, q.im, `${que} (im)`, tol || 1e-9); };
const mod360 = g => ((g % 360) + 360) % 360;
const mismoAng = (a, b) => { const d = Math.abs(mod360(a) - mod360(b)); return Math.min(d, 360 - d) < 1e-7; };

test('potencias de i: ciclo de 4, i^(n+4) = iⁿ e iⁿ · i^(−n) = 1', () => {
  const ciclo = ['1', 'i', '−1', '−i'];
  for (let n = -40; n <= 60; n++) {
    const p = motor.potenciaI({ n });
    assert.equal(p.texto, ciclo[((n % 4) + 4) % 4], `i^${n}`);
    assert.equal(motor.potenciaI({ n: n + 4 }).texto, p.texto);
    igualN(mulN(p.num, motor.potenciaI({ n: -n }).num), { re: 1, im: 0 }, `i^${n} · i^${-n}`);
    assert.equal(p.vueltas * 4 + p.resto, n, 'n = 4·vueltas + resto');
  }
});
test('binómica: (z/w)·w = z, z·z̄ = |z|², |zw| = |z||w|, Arg(zw) = Arg z + Arg w', () => {
  for (let k = 0; k < N; k++) {
    const z = cx(), w = noCero(), Z = motor.multiplicar({ z, w });
    igualN(Z.num, mulN(z, w), 'producto');
    let suma = { re: 0, im: 0 }; for (const p of Z.piezas) suma = { re: suma.re + p.num.re, im: suma.im + p.num.im };
    igualN(suma, Z.num, 'las piezas suman el producto');
    igualN(mulN(motor.dividir({ z, w }).num, w), z, '(z/w)·w');
    const zb = motor.conjugado({ z }).num, m = motor.modulo({ z });
    igualN(mulN(z, zb), { re: m.valor ** 2, im: 0 }, 'z·z̄ = |z|²');
    cerca(motor.modulo({ z: mulN(z, w) }).valor, m.valor * motor.modulo({ z: w }).valor, '|zw|');
    if (z.re || z.im) assert.ok(mismoAng(motor.argumento({ z: mulN(z, w) }).grados, motor.argumento({ z }).grados + motor.argumento({ z: w }).grados), 'Arg(zw)');
    igualN(motor.sumar({ z, w }).num, { re: z.re + w.re, im: z.im + w.im }, 'suma');
    igualN(motor.restar({ z, w }).num, { re: z.re - w.re, im: z.im - w.im }, 'resta');
  }
});
test('polar: ida y vuelta, y producto / cociente en polar = binómicos', () => {
  for (let k = 0; k < N; k++) {
    const z = noCero(), Pz = motor.polar({ z });
    igualN(motor.binomica({ r: Pz.r, theta: Pz.theta }).num, z, 'polar → binómica');
    assert.ok(Pz.theta > -180 && Pz.theta <= 180, 'argumento principal');
    const a = { r: ent(1, 6), theta: ent(-180, 180) }, b = { r: ent(1, 6), theta: ent(-180, 180) };
    const A = motor.binomica(a).num, B = motor.binomica(b).num;
    igualN(motor.productoPolar({ z: a, w: b }).num, mulN(A, B), 'productoPolar', 1e-9);
    igualN(mulN(motor.cocientePolar({ z: a, w: b }).num, B), A, 'cocientePolar', 1e-9);
    const n = ent(1, 9); let p = { re: 1, im: 0 }; for (let j = 0; j < n; j++) p = mulN(p, z);
    igualN(motor.deMoivre({ z, n }).num, p, `De Moivre n = ${n}`, 1e-9);
    igualN(mulN(motor.deMoivre({ z, n: -n }).num, p), { re: 1, im: 0 }, `De Moivre n = ${-n}`, 1e-9);
  }
});
test('cuadrática: las raíces anulan el polinomio; con Δ < 0 son conjugadas', () => {
  for (let k = 0; k < N; k++) {
    const a = ent(1, 4) * (rnd() < .5 ? -1 : 1), b = ent(-9, 9), c = ent(-9, 9), Q = motor.cuadratica({ a, b, c });
    for (const x of Q.raices) { const x2 = mulN(x.num, x.num); igualN({ re: a * x2.re + b * x.num.re + c, im: a * x2.im + b * x.num.im }, { re: 0, im: 0 }, `raíz de ${a}x² + ${b}x + ${c}`, 1e-9); }
    if (Q.delta < 0) igualN(Q.raices[1].num, { re: Q.raices[0].num.re, im: -Q.raices[0].num.im }, 'conjugadas');
    const x = ent(1, 12), y = ent(1, 12);
    cerca(motor.raizNegativa({ a: x, b: y }).num.re, -Math.sqrt(x * y), '√(−a)·√(−b)');
  }
});

function sinChoques(r, que) {
  assert.ok(r.errores && Array.isArray(r.coinciden), `${que}: faltan errores o coinciden`);
  for (const [k, e] of Object.entries(r.errores)) {
    assert.notEqual(e.texto, r.texto, `${que}: el error ${k} se escribe igual que la correcta`);
    if (e.num) assert.ok(Math.abs(e.num.re - r.num.re) > 1e-9 || Math.abs(e.num.im - r.num.im) > 1e-9, `${que}: el error ${k} vale lo mismo que la correcta`);
    assert.ok(/^(CX\d+|AL\d+)$/.test(e.id), `${que}: el error ${k} no tiene id`);
    assert.ok(e.regla, `${que}: el error ${k} no dice su regla`);
  }
  for (const k of r.coinciden) assert.ok(!(k in r.errores), `${que}: ${k} está en los dos lados`);
}
test('ningún error típico coincide con la respuesta correcta (casos y barrido)', () => {
  for (const c of datos.casos) for (const t of [c].concat(c.tambien || [])) { const r = llamar(t.fn || c.fn, t.args); if (r && r.errores) sinChoques(r, c.nombre); }
  for (let k = 0; k < N; k++) {
    const z = cx(), w = noCero();
    sinChoques(motor.potenciaI({ n: ent(-60, 200) }), 'iⁿ');
    sinChoques(motor.multiplicar({ z, w }), 'producto'); sinChoques(motor.dividir({ z, w }), 'cociente');
    sinChoques(motor.conjugado({ z }), 'conjugado'); sinChoques(motor.modulo({ z }), 'módulo');
    sinChoques(motor.argumento({ z: w }), 'argumento'); sinChoques(motor.polar({ z: w }), 'polar');
    const a = { r: ent(1, 6), theta: ent(-180, 180) }, b = { r: ent(1, 6), theta: ent(-180, 180) };
    sinChoques(motor.productoPolar({ z: a, w: b }), 'producto polar'); sinChoques(motor.cocientePolar({ z: a, w: b }), 'cociente polar');
    sinChoques(motor.deMoivre({ z: w, n: ent(2, 9) }), 'De Moivre'); sinChoques(motor.deMoivre({ z: w, n: -ent(1, 5) }), 'De Moivre negativo');
    sinChoques(motor.raizNegativa({ a: ent(1, 30), b: ent(1, 30) }), '√(−a)·√(−b)');
    sinChoques(motor.cuadratica({ a: ent(1, 3), b: ent(-9, 9), c: ent(-9, 20) }), 'cuadrática');
  }
});

// Las predicciones de la escena (index.html): respuesta = motor, opciones distintas y con la misma forma.
const E = (r, ks) => [r.texto].concat(ks.map(k => r.errores[k].texto));
const ESCENA = {
  'paso1': () => E(motor.potenciaI({ n: 2 }), ['cuadradoPositivo', 'sigueI', 'nVeces']),
  'paso2': () => E(motor.potenciaI({ n: 43 }), ['cicloTres', 'cociente', 'corrido']),
  'paso3': () => E(motor.multiplicar({ z: { re: 2, im: 3 }, w: { re: 1, im: -2 } }), ['partePorParte', 'cuadradoPositivo', 'sigueI']),
  'paso4': () => E(motor.modulo({ z: { re: -4, im: 3 } }), ['sumaPartes', 'raizDeSuma', 'sinRaiz']),
  'paso5': () => E(motor.conjugado({ z: { re: -3, im: 2 } }), ['cambiaReal', 'opuesto', 'intercambia']),
  'paso6': () => E(motor.dividir({ z: { re: 5, im: 1 }, w: { re: 1, im: -1 } }), ['partePorParte', 'porW', 'sinDenominador']),
  'paso7': () => E(motor.polar({ z: { re: -1, im: '√3' } }), ['arctanDirecto', 'referencia', 'sinRaiz']),
  'paso8': () => E(motor.productoPolar({ z: { r: 2, theta: 10 }, w: { r: 3, theta: 30 } }), ['sumaModulos', 'multiplicaArgumentos', 'restaArgumentos']),
  'inverso': () => E(motor.potenciaI({ n: -1 }), ['comoPositivo', 'seCancelan', 'soloSigno']),
  'raices-negativas': () => E(motor.raizNegativa({ a: 4, b: 9 }), ['juntaRaices', 'sigueI', 'noExiste']),
  'cociente-polar': () => E(motor.cocientePolar({ z: { r: 6, theta: 100 }, w: { r: 2, theta: 40 } }), ['sumaArgumentos', 'restaModulos', 'restaAlReves']),
  'de-moivre': () => E(motor.deMoivre({ z: { re: 1, im: 1 }, n: 8 }), ['reparte', 'sinModulo', 'porN']),
  'cuadratica': () => E(motor.cuadratica({ a: 1, b: -4, c: 13 }), ['signoB', 'sinDividirIm', 'sinDividir']),
};
// en estos experimentos las opciones son frases que empiezan con el valor (la forma la da la frase)
const FRASE = new Set(['inverso', 'raices-negativas']);
test('las predicciones de la escena: respuesta del motor, opciones distintas y de la misma forma', () => {
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  const forma = t => (/cis/.test(t) ? 'polar' : /±/.test(t) ? 'pm' : /^[−\d√ +()/i]+$/.test(t) ? 'complejo' : 'otro');
  for (const [id, f] of Object.entries(ESCENA)) {
    const ops = f();
    assert.equal(new Set(ops).size, ops.length, `${id}: opciones repetidas: ${ops.join(' · ')}`);
    if (!FRASE.has(id)) {
      assert.equal(new Set(ops.map(forma)).size, 1, `${id}: opciones de distinta forma: ${ops.join(' · ')}`);
      assert.ok(!ops.map(forma).includes('otro'), `${id}: forma desconocida`);
      const largos = ops.map(t => t.length); assert.ok(Math.max(...largos) <= 3 * Math.min(...largos) + 6, `${id}: largos muy distintos`);
    }
    assert.ok(html.includes(`numeros-complejos-${id}'`) || html.includes(`id:'${id}'`), `${id}: la escena no la usa`);
  }
});

// 3. Errores de entrada
test('entradas inválidas', () => {
  assert.throws(() => motor.potenciaI({ n: 2.5 }), /entero/);
  assert.throws(() => motor.multiplicar({ z: { re: 1 }, w: { re: 1, im: 1 } }), /\{ re, im \}/);
  assert.throws(() => motor.multiplicar({ z: { re: '√2', im: 1 }, w: { re: 1, im: 1 } }), /racionales/);
  assert.throws(() => motor.dividir({ z: { re: 1, im: 1 }, w: { re: 0, im: 0 } }), /división entre cero/);
  assert.throws(() => motor.argumento({ z: { re: 0, im: 0 } }), /no está definido/);
  assert.throws(() => motor.sumar({ z: { re: 'dos', im: 1 }, w: { re: 1, im: 1 } }), /fracción/);
  assert.throws(() => motor.productoPolar({ z: { r: -2, theta: 10 }, w: { r: 1, theta: 0 } }), /positivo/);
  assert.throws(() => motor.binomica({ r: 2, theta: 'treinta' }), /grados/);
  assert.throws(() => motor.deMoivre({ z: { re: 1, im: 1 }, n: 1.5 }), /entero/);
  assert.throws(() => motor.deMoivre({ z: { re: 0, im: 0 }, n: 2 }), /no está definido/);
  cerca(motor.deMoivre({ z: { re: 1, im: 1 }, n: 0 }).num, { re: 1, im: 0 }, 'z⁰ = 1');
  assert.throws(() => motor.raizNegativa({ a: -4, b: 9 }), /positivos/);
  assert.throws(() => motor.cuadratica({ a: 0, b: 1, c: 1 }), /distinto de 0/);
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
