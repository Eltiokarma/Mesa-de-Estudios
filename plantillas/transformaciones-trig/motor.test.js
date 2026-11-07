// Pruebas del motor de «Dos flechas en la circunferencia». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con números al azar (semilla fija):
//    - los múltiplos de 15° exactos coinciden con Math;
//    - suma a producto y producto a suma coinciden con el cálculo directo; los cocientes simplificados con el
//      cociente original; agrupar y las series con la suma término a término;
//    - la flecha suma es 2 cos D en la dirección M, y la resta 2 sen D en la dirección M + 90°; las pulsaciones son
//      la envolvente por la portadora;
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
  assert.ok(typeof real === 'number' && Math.abs(real - esperado) <= t * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
function llamar(fn, args) {
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  return motor[fn](...args);
}
const campo = (r, k) => k.split('.').reduce((o, p) => (o == null ? o : o[p]), r);
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
  assert.equal(datos.plantilla, 'transformaciones-trig');
  assert.ok(datos.casos.length >= 15 && datos.casos.length <= 22, `hay ${datos.casos.length} casos`);
  for (const c of datos.casos) {
    assert.ok(c.nombre && c.fn && Array.isArray(c.args), JSON.stringify(c).slice(0, 80));
    assert.ok(c.espera && typeof c.espera === 'object' && !Array.isArray(c.espera), `${c.nombre}: espera debe ser un objeto`);
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
const elegir = xs => xs[ent(0, xs.length - 1)];
const N = 300;
const GR = Math.PI / 180;
const casi = (a, b, t) => Math.abs(a - b) <= (t || 1e-9) * Math.max(1, Math.abs(a), Math.abs(b));
const S = g => Math.sin(g * GR), C = g => Math.cos(g * GR);
const Q15 = () => 15 * ent(-12, 24);

test('los múltiplos de 15° salen exactos y coinciden con Math', () => {
  for (let g = -360; g <= 720; g += 15) {
    const s = motor.razon('sen', g), c = motor.razon('cos', g);
    assert.ok(s.exacto && c.exacto, `${g}° exacto`);
    cerca(s.valor, S(g), `sen ${g}°`); cerca(c.valor, C(g), `cos ${g}°`);
    const t = motor.razon('tan', g);
    if (t.existe) cerca(t.valor, Math.tan(g * GR), `tan ${g}°`, 1e-9);
    else assert.ok(Math.abs(C(g)) < 1e-12, `tan ${g}° no existe solo si cos = 0`);
  }
  for (let k = 0; k < N; k++) { const g = ent(-500, 500) + 0.5; assert.equal(motor.razon('sen', g).exacto, false); cerca(motor.razon('cos', g).valor, C(g), 'cos numérico'); }
});
test('suma a producto y producto a suma coinciden con el cálculo directo', () => {
  for (let k = 0; k < N; k++) {
    for (const [A, B] of [[Q15(), Q15()], [ent(-300, 300) + 0.3, ent(-300, 300) + 0.7]]) for (const fn of ['sen', 'cos']) for (const op of ['+', '−']) {
      const r = motor.sumaAProducto({ fn, op, A, B });
      const d = fn === 'sen' ? S(A) + (op === '+' ? 1 : -1) * S(B) : C(A) + (op === '+' ? 1 : -1) * C(B);
      cerca(r.valor, d, `${fn} ${A}° ${op} ${fn} ${B}°`); cerca(r.directo, d, 'directo');
      cerca(r.coef * (r.f1 === 'sen' ? S : C)(r.M) * (r.f2 === 'sen' ? S : C)(r.D), d, 'la forma de producto');
    }
    for (const tipo of ['sencos', 'coscos', 'sensen']) {
      const x = elegir([Q15(), ent(-200, 200) + 0.4]), y = elegir([Q15(), ent(-200, 200) + 0.9]);
      const P = motor.productoASuma({ tipo, x, y });
      const d = 2 * (tipo === 'coscos' ? C(x) : S(x)) * (tipo === 'sencos' || tipo === 'coscos' ? C(y) : S(y));
      cerca(P.valor, d, `${tipo}(${x}, ${y})`);
      cerca(P.terminos.reduce((s, t) => s + t.signo * (t.fn === 'sen' ? S : C)(t.g), 0), d, 'los términos');
    }
  }
});
test('los cocientes simplificados coinciden con el cociente original', () => {
  for (let k = 0; k < N; k++) {
    const q = ent(1, 8), p = q + ent(1, 8), num = elegir(['+', '−']), den = elegir(['+', '−']);
    const R = motor.cociente({ p, q, num, den });
    for (let j = 0; j < 6; j++) {
      const x = ent(1, 400) / 7;
      const o = R.originalEn(x), v = R.valorEn(x), sd = den === '+' ? 1 : -1;
      if (Math.abs(Math.cos(p * x * GR) + sd * Math.cos(q * x * GR)) < 1e-6) continue;   // 0/0 o división por cero
      if (!Number.isFinite(o) || Math.abs(o) > 1e6 || Math.abs(v) > 1e6) continue;
      cerca(v, o, `(sen ${p}x ${num} sen ${q}x)/(cos ${p}x ${den} cos ${q}x) en x = ${x}`, 1e-6);
    }
  }
});
test('agrupar, series, rombo y pulsaciones coinciden con su cálculo directo', () => {
  for (let k = 0; k < N; k++) {
    // agrupar: el par (solo + 2·otro... ) se arma para que D = solo
    const solo = ent(1, 89), otro = Q15(), p = otro + solo, q = otro - solo;
    const G = motor.agrupar({ solo, par: [p, q] });
    cerca(G.valor * C(solo), C(solo) + C(p) + C(q), `agrupar ${solo}°, ${p}°, ${q}°`); cerca(G.total, C(solo) + C(p) + C(q), 'total');
    const fn = elegir(['sen', 'cos']), a = elegir([Q15(), ent(-90, 90) + .5]), r = elegir([15 * ent(1, 11), ent(1, 170) + .5]), n = ent(2, 9);
    const Se = motor.serie({ fn, a, r, n });
    let d = 0; for (let j = 0; j < n; j++) d += (fn === 'sen' ? S : C)(a + j * r);
    cerca(Se.valor, d, `serie ${fn} ${a}° + … (r = ${r}°, n = ${n})`, 1e-9); cerca(Se.directo, d, 'directo');
    const B = ent(-170, 170) + .25, A = B + ent(1, 178) + .5, Ro = motor.rombo({ A, B });
    cerca(Ro.suma.x, Ro.largo * C(Ro.M), 'abscisa de la suma'); cerca(Ro.suma.y, Ro.largo * S(Ro.M), 'altura de la suma');
    cerca(Ro.resta.x, Ro.largoResta * C(Ro.direccionResta), 'abscisa de la resta'); cerca(Ro.resta.y, Ro.largoResta * S(Ro.direccionResta), 'altura de la resta');
    cerca(Ro.suma.x * Ro.resta.x + Ro.suma.y * Ro.resta.y, 0, 'la cuerda es perpendicular a la diagonal');
    cerca(Ro.alturaSuma, S(A) + S(B), 'sen A + sen B'); cerca(Ro.abscisaResta, C(A) - C(B), 'cos A − cos B');
    assert.ok(Ro.largo > 0, 'con 0 < A − B < 180°, la diagonal mide más que 0');
    const qq = ent(1, 12), pp = qq + ent(1, 6), Pu = motor.pulsos({ p: pp, q: qq, n: 37 });
    for (const m of Pu.muestras) cerca(m.suma, m.env * S(Pu.M * m.t), 'suma = envolvente · portadora', 1e-9);
    for (const t of Pu.ceros) assert.ok(Math.abs(C(Pu.D * t)) < 1e-9 && t >= 0 && t <= 360, `cero en ${t}`);
    assert.equal(Pu.valor, Pu.ceros.length);
  }
});

// Regla de las revisiones: ningún error típico puede dar lo mismo que la respuesta correcta.
const ID_OK = id => /^(TR12|TR16|TT\d+)$/.test(id) && motor.ERRORES[id];
function sinChoques(r, que) {
  assert.ok(r.errores && Array.isArray(r.coinciden), `${que}: faltan errores o coinciden`);
  for (const [k, e] of Object.entries(r.errores)) {
    assert.ok(ID_OK(e.id), `${que}: el error ${k} no tiene id del catálogo`);
    if (e.forma) {   // cocientes: la forma del error no es la misma función que la correcta
      const fval = (F, x) => { const t = Math.tan(F.k.n / F.k.d * x * GR); return F.s * (F.fn === 'tan' ? t : 1 / t); };
      assert.ok([3.7, 7.3, 11.9, 17.1, 23.3, 31.1].some(x => !casi(r.valorEn(x), fval(e.forma, x))), `${que}: el error ${k} es la misma función`);
    } else assert.ok(!casi(e.valor, r.valor), `${que}: el error ${k} da lo mismo que la correcta (${r.texto})`);
    if (r.texto) assert.notEqual(e.texto, r.texto, `${que}: el error ${k} se escribe igual que la correcta`);
  }
  for (const k of r.coinciden) assert.ok(!(k in r.errores), `${que}: ${k} está en los dos lados`);
}
function revisar(r, que) {
  if (r.errores) sinChoques(r, que);
  for (const k of ['direccion', 'largoExacto']) if (r[k]) sinChoques(r[k], `${que} · ${k}`);
}
test('ningún error típico coincide con la respuesta correcta (casos y barrido)', () => {
  for (const c of datos.casos) {
    revisar(llamar(c.fn, c.args), c.nombre);
    for (const t of c.tambien || []) revisar(llamar(t.fn || c.fn, t.args), c.nombre);
  }
  for (let k = 0; k < N; k++) {
    revisar(motor.sumaAProducto({ fn: elegir(['sen', 'cos']), op: elegir(['+', '−']), A: Q15(), B: Q15() }), 'suma a producto exacta');
    revisar(motor.sumaAProducto({ fn: elegir(['sen', 'cos']), op: elegir(['+', '−']), A: ent(0, 180) + .5, B: ent(0, 180) }), 'suma a producto numérica');
    revisar(motor.productoASuma({ tipo: elegir(['sencos', 'coscos', 'sensen']), x: Q15(), y: Q15() }), 'producto a suma');
    const q = ent(1, 8); revisar(motor.cociente({ p: q + ent(1, 8), q, num: elegir(['+', '−']), den: elegir(['+', '−']) }), 'cociente');
    const solo = ent(1, 89), otro = 15 * ent(0, 11); revisar(motor.agrupar({ solo, par: [otro + solo, otro - solo] }), 'agrupar');
    revisar(motor.serie({ fn: elegir(['sen', 'cos']), a: Q15(), r: 15 * ent(1, 11), n: ent(2, 8) }), 'serie');
    revisar(motor.pulsos({ p: ent(9, 20), q: ent(1, 8), n: 3 }), 'pulsos');
  }
  // las flechas que se arrastran en la escena: B entre 0° y 170°, A de B + 10° a 180° (y A − B < 180°)
  for (let B = 0; B <= 170; B += 5) for (let A = B + 10; A <= Math.min(180, B + 170); A += 5) revisar(motor.rombo({ A, B }), `rombo ${A}°, ${B}°`);
});

// Las predicciones de la escena (index.html): respuesta del motor, opciones distintas y con la misma forma.
const op = (r, ...ks) => [r.texto, ...ks.map(k => { assert.ok(r.errores[k], `falta el error ${k}`); return r.errores[k].texto; })];
const R75 = motor.rombo({ A: 75, B: 15 }), R120 = motor.rombo({ A: 120, B: 0 });
const ESCENA = {
  paso2: [() => op(R75.direccion, 'sinDividir', 'intercambia', 'primera'), 'grados'],
  paso3: [() => op(R120.largoExacto, 'sumaLargos', 'funcion', 'sinDos'), 'exacto'],
  paso4: [() => op(motor.sumaAProducto({ fn: 'sen', A: 75, B: 15 }), 'lineal', 'sinDos', 'intercambia'), 'exacto'],
  paso5: [() => op(motor.sumaAProducto({ fn: 'sen', op: '−', A: 75, B: 15 }), 'lineal', 'intercambia', 'sinDos'), 'exacto'],
  paso6: [() => op(motor.sumaAProducto({ fn: 'cos', op: '−', A: 105, B: 15 }), 'signo', 'funcion', 'sinDos'), 'exacto'],
  paso7: [() => op(motor.productoASuma({ tipo: 'sencos', x: 75, y: 45 }), 'unTermino', 'funcion', 'dobla'), 'exacto'],
  paso8: [() => op(motor.cociente({ p: 5, q: 3 }), 'intercambia', 'sinDividir', 'funcion'), 'forma'],
  'tres-cosenos': [() => op(motor.agrupar({ solo: 20, par: [100, 140] }), 'sinDos', 'signo', 'elPar'), 'exacto'],
  'pulsaciones': [() => op(motor.pulsos({ p: 9, q: 7 }), 'intercambia', 'sinDividir', 'nunca'), 'entero'],
  'dos-senos': [() => op(motor.productoASuma({ tipo: 'sensen', x: 75, y: 30 }), 'signo', 'funcion', 'unTermino'), 'exacto'],
  'dos-cosenos': [() => op(motor.sumaAProducto({ fn: 'cos', A: 105, B: 15 }), 'funcion', 'lineal', 'sinDos'), 'exacto'],
  'cociente-con-resta': [() => op(motor.cociente({ p: 7, q: 3, num: '−' }), 'intercambia', 'sinDividir', 'funcion'), 'forma']
};
const FORMAS = {
  exacto: t => /^−?(\d+|\d*√\d+|\((?:−?\d*√?\d+)(?: [+−] \d*√?\d+)+\)|\d*√\d+ [+−] \d+)(\/\d+)?$/.test(t),
  grados: t => /^\d+°$/.test(t),
  forma: t => /^−?(tan|cot) \d*x$/.test(t),
  entero: t => /^\d+$/.test(t)
};
test('las predicciones de la escena: respuesta del motor, opciones distintas y de la misma forma', () => {
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  for (const [id, [f, forma]] of Object.entries(ESCENA)) {
    const ops = f();
    assert.equal(new Set(ops).size, ops.length, `${id}: opciones repetidas: ${ops.join(' · ')}`);
    for (const t of ops) assert.ok(FORMAS[forma](t), `${id}: «${t}» no tiene la forma ${forma}`);
    const largos = ops.map(t => t.length); assert.ok(Math.max(...largos) <= 3 * Math.min(...largos) + 6, `${id}: largos muy distintos: ${ops.join(' · ')}`);
    assert.ok(html.includes(`'transformaciones-trig-${id}'`) || html.includes(`id:'${id}'`), `${id}: la escena no la usa`);
  }
});

// 3. Errores de entrada
test('entradas inválidas', () => {
  assert.throws(() => motor.razon('sec', 30), /desconocida/);
  assert.throws(() => motor.razon('sen', 'treinta'), /número/);
  assert.throws(() => motor.sumaAProducto({ fn: 'tan', A: 30, B: 15 }), /sen o cos/);
  assert.throws(() => motor.sumaAProducto({ A: 30, B: 15, op: '*' }), /op/);
  assert.throws(() => motor.sumaAProducto({ A: 30 }), /ángulo B/);
  assert.throws(() => motor.productoASuma({ tipo: 'tantan', x: 1, y: 2 }), /tipo/);
  assert.throws(() => motor.cociente({ p: 3, q: 5 }), /p > q/);
  assert.throws(() => motor.cociente({ p: 5.5, q: 3 }), /enteros/);
  assert.throws(() => motor.agrupar({ solo: 20, par: [100, 150] }), /semisuma/);
  assert.throws(() => motor.agrupar({ solo: 20, par: [27, 67] }), /semisuma|15°/);
  assert.throws(() => motor.agrupar({ solo: 20, par: [100] }), /dos ángulos/);
  assert.throws(() => motor.serie({ fn: 'sen', a: 10, r: 360, n: 3 }), /sen\(r\/2\)/);
  assert.throws(() => motor.serie({ fn: 'sen', a: 10, r: 20, n: 1 }), /entero/);
  assert.throws(() => motor.rombo({ A: 15, B: 75 }), /A − B/);
  assert.throws(() => motor.rombo({ A: 200, B: 10 }), /A − B/);
  assert.throws(() => motor.pulsos({ p: 7, q: 9 }), /p > q/);
  assert.throws(() => motor.pulsos({ p: 9, q: 7, t0: 10, t1: 5 }), /t1/);
  assert.throws(() => motor.exacto('dos'), /exacto/);
});

// 4. papel.json
const papel = JSON.parse(fs.readFileSync(path.join(__dirname, 'papel.json'), 'utf8'));
test('papel.json: entre 5 y 10 problemas, con respuesta, pasos y verificación', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  const ids = new Set();
  for (const p of papel.problemas) {
    assert.ok(p.id && !ids.has(p.id), p.id); ids.add(p.id);
    assert.ok(p.enunciado && p.respuesta && Array.isArray(p.pasos) && p.pasos.length, `${p.id}: falta texto`);
    assert.ok(Array.isArray(p.verificar) && p.verificar.length, `${p.id}: falta verificar`);
    assert.ok(!/<[a-z]/i.test(p.enunciado + p.respuesta + p.pasos.join('')), `${p.id}: la app muestra texto plano, sin HTML`);
    assert.ok(!/\d\.\d/.test(p.enunciado + p.respuesta + p.pasos.join('')), `${p.id}: se escribe con coma decimal`);
  }
});
for (const p of papel.problemas) test(`papel ${p.id}: ${p.enunciado.slice(0, 60)}`, () => {
  for (const v of p.verificar) comprobar(v.fn, v.args, v.espera, p.id);
});
