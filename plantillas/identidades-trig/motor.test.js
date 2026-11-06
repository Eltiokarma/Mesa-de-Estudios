// Pruebas del motor de «Alturas que no se suman». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con números al azar (semilla fija):
//    - los notables exactos coinciden con Math (y los de academia, con su triángulo 3-4-5 o 7-24-25);
//    - sen² + cos² = 1 con el signo del cuadrante; 1 + tan² = sec²;
//    - sen(a ± b) y cos(a ± b) coinciden con el valor directo; tan(a ± b) con atan; la cadena con su fórmula;
//    - las tres formas de cos 2x son iguales; sen 2x = 2 sen x cos x; cos(x/2) y sen(x/2) con el signo de x/2;
//      sen 3x = sen(3 · arcsen s);
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
  assert.equal(datos.plantilla, 'identidades-trig');
  assert.ok(datos.casos.length >= 15 && datos.casos.length <= 22, `hay ${datos.casos.length} casos`);
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera, JSON.stringify(c).slice(0, 80));
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
const fval = t => { const [p, q] = String(t).replace('−', '-').split('/').map(Number); return p / (q || 1); };
// una fracción p/q con |p| ≤ q
function fraccionAzar(signo) { const q = ent(2, 30), p = ent(0, q); return `${signo < 0 && p ? '-' : ''}${p}/${q}`; }
const ACADEMIA = { 37: [3, 4, 5], 53: [4, 3, 5], 16: [7, 24, 25], 74: [24, 7, 25] };
const VERDADEROS = [0, 15, 30, 45, 60, 75, 90];
const NOTABLES = [0, 15, 16, 30, 37, 45, 53, 60, 74, 75, 90];
const conCuadrante = g => [g, 180 - g, 180 + g, 360 - g];

test('los notables exactos coinciden con Math; los de academia con su triángulo', () => {
  for (const g0 of VERDADEROS) for (const g of conCuadrante(g0)) for (const fn of ['sen', 'cos']) {
    const r = motor.razon(fn, g), v = fn === 'sen' ? Math.sin(g * GR) : Math.cos(g * GR);
    assert.ok(r.exacto, `${fn} ${g}° exacto`); cerca(r.valor, v, `${fn} ${g}°`);
  }
  for (const [g0, [o, a, h]] of Object.entries(ACADEMIA)) for (const g of conCuadrante(Number(g0))) {
    const q = motor.cuadranteDe(g), ss = q <= 2 ? 1 : -1, sc = q === 1 || q === 4 ? 1 : -1;
    cerca(motor.razon('sen', g).valor, ss * o / h, `sen ${g}°`); cerca(motor.razon('cos', g).valor, sc * a / h, `cos ${g}°`);
    cerca(motor.razon('tan', g).valor, ss * sc * o / a, `tan ${g}°`);
  }
  for (let k = 0; k < N; k++) {   // fuera de los notables, Math; recíprocas y cociente
    const g = ent(-720, 720) + 0.5, s = Math.sin(g * GR), c = Math.cos(g * GR);
    cerca(motor.razon('sen', g).valor, s, 'sen'); cerca(motor.razon('tan', g).valor, s / c, 'tan', 1e-7);
    cerca(motor.razon('sec', g).valor * c, 1, 'sec · cos', 1e-7); cerca(motor.razon('csc', g).valor * s, 1, 'csc · sen', 1e-7);
    const P = motor.punto(g); cerca(P.x * P.x + P.y * P.y, 1, 'en la circunferencia');
  }
});
test('pitagórica: sen² + cos² = 1 con el signo del cuadrante; 1 + tan² = sec²', () => {
  for (let k = 0; k < N; k++) {
    const c = ent(1, 4), cual = elegir(['sen', 'cos']);
    const signoDado = cual === 'sen' ? (c <= 2 ? 1 : -1) : (c === 1 || c === 4 ? 1 : -1);
    const f = fraccionAzar(signoDado);
    const P = motor.pitagorica({ [cual]: f, cuadrante: c });
    cerca(P.valor * P.valor + fval(f) ** 2, 1, `pitagórica ${cual} = ${f}`);
    const sOtro = P.pide === 'sen' ? (c <= 2 ? 1 : -1) : (c === 1 || c === 4 ? 1 : -1);
    if (P.valor !== 0) assert.equal(Math.sign(P.valor), sOtro, `signo de ${P.pide} en el cuadrante ${c}`);
    assert.equal(P.celdas.total, P.celdas.sen + P.celdas.cos, 'los cuadritos suman');
    const t = fraccionAzar(c === 1 || c === 3 ? 1 : -1).replace(/^(-?)(\d+)\/(\d+)$/, (m, s, p, q) => `${s}${p}/${Math.max(1, Number(q) - ent(0, 1))}`);
    const T = motor.secDesdeTan({ tan: t, cuadrante: c });
    cerca(T.valor * T.valor, 1 + fval(t) ** 2, `1 + tan² = sec² (tan = ${t})`);
    if (c === 2 || c === 3) assert.ok(T.valor < 0, 'sec negativa en II y III'); else assert.ok(T.valor > 0, 'sec positiva en I y IV');
  }
});
test('arcos compuestos: sen y cos de a ± b coinciden con el valor directo; tan con atan; la cadena con su fórmula', () => {
  for (const a of NOTABLES) for (const b of NOTABLES) for (const fn of ['sen', 'cos']) for (const op of ['+', '−']) {
    const r = motor.suma({ a, b, fn, op }), A = motor.punto(a), B = motor.punto(b);
    const v = fn === 'sen' ? A.y * B.x + (op === '+' ? 1 : -1) * A.x * B.y : A.x * B.x - (op === '+' ? 1 : -1) * A.y * B.y;
    cerca(r.valor, v, `${fn}(${a} ${op} ${b})`);
    if (r.tabla) cerca(r.valor, r.tabla.valor, `${fn}(${a} ${op} ${b}) contra la tabla`);
    // con ángulos verdaderos, también contra Math
    if (VERDADEROS.includes(a) && VERDADEROS.includes(b)) { const g = op === '+' ? a + b : a - b; cerca(r.valor, fn === 'sen' ? Math.sin(g * GR) : Math.cos(g * GR), `${fn} ${g}° con Math`); }
  }
  for (let k = 0; k < N; k++) {
    const a = ent(1, 89) + 0.25, b = ent(1, 89) + 0.5;
    const r = motor.suma({ a, b }); cerca(r.valor, Math.sin((a + b) * GR), 'sen(a + b) numérico');
    const C = motor.cadena({ a, b }); cerca(C.formula, C.senSuma, 'la cadena'); cerca(C.piezas.senAcosB + C.piezas.cosAsenB, C.senSuma, 'piezas');
    const ta = `${ent(1, 9)}/${ent(1, 9)}`, tb = `${ent(1, 9)}/${ent(1, 9)}`, op = elegir(['+', '−']);
    if (casi(fval(ta) * fval(tb), op === '+' ? 1 : -1)) continue;
    const T = motor.sumaTan({ ta, tb, op });
    const ang = Math.atan(fval(ta)) + (op === '+' ? 1 : -1) * Math.atan(fval(tb));
    cerca(T.valor, Math.tan(ang), `tan(${ta} ${op} ${tb})`, 1e-7);
    cerca(T.direccion[1] / T.direccion[0], T.valor, 'la dirección de la cuadrícula', 1e-9);
    cerca(T.angulo * GR, Math.atan2(T.direccion[1], T.direccion[0]), 'el ángulo de la dirección', 1e-9);
  }
});
test('arcos múltiples: sen 2x, las tres formas de cos 2x, la mitad con su signo y el triple', () => {
  for (let k = 0; k < N; k++) {
    const c = ent(1, 4), f = fraccionAzar(c <= 2 ? 1 : -1), D = motor.doble({ sen: f, cuadrante: c });
    const s = fval(f), co = D.cos.valor;
    cerca(D.senDoble.valor, 2 * s * co, 'sen 2x = 2 sen x cos x');
    D.cosDoble.formas.forEach((F, i) => cerca(F.valor, D.cosDoble.valor, `forma ${i + 1} de cos 2x`));
    cerca(D.senDoble.valor ** 2 + D.cosDoble.valor ** 2, 1, 'sen² 2x + cos² 2x = 1');
    // contra el ángulo de verdad
    const x = c === 1 ? Math.asin(s) : c === 2 ? Math.PI - Math.asin(s) : c === 3 ? Math.PI - Math.asin(s) : 2 * Math.PI + Math.asin(s);
    cerca(D.senDoble.valor, Math.sin(2 * x), 'sen 2x con Math', 1e-9); cerca(D.cosDoble.valor, Math.cos(2 * x), 'cos 2x con Math', 1e-9);
    if (D.celdas) assert.equal(D.celdas.cos2x, D.celdas.cos2 - D.celdas.sen2, 'cuadritos de cos 2x');
    // mitad: x en uno de los rangos de examen, con cos x posible ahí
    const R = elegir([[0, 90, 1], [90, 180, -1], [180, 270, -1], [270, 360, 1], [0, 180, 0], [360, 450, 1], [450, 540, -1]]);
    const cf = fraccionAzar(R[2] === 0 ? elegir([1, -1]) : R[2]);
    if (fval(cf) === 0 && R[2] !== 0) continue;
    const M = motor.mitad({ cos: cf, desde: R[0], hasta: R[1] });
    // el x de verdad en ese rango con ese coseno
    const base = Math.acos(fval(cf)) / GR, cands = [base, 360 - base, 360 + base, 720 - base].filter(g => g > R[0] - 1e-9 && g < R[1] + 1e-9);
    assert.ok(cands.length, `hay un x en ⟨${R[0]}; ${R[1]}⟩ con cos x = ${cf}`);
    cerca(M.valor, Math.cos(cands[0] / 2 * GR), `cos(x/2) con cos x = ${cf}, x en ⟨${R[0]}; ${R[1]}⟩`, 1e-9);
    cerca(M.senMitad.valor, Math.sin(cands[0] / 2 * GR), `sen(x/2) con cos x = ${cf}`, 1e-9);
    const T = motor.triple({ sen: f });
    cerca(T.valor, Math.sin(3 * Math.asin(s)), 'sen 3x', 1e-9);
  }
});
test('identidad: las verdaderas se cumplen y las de los errores típicos no', () => {
  const si = [['sen^2(x) + cos^2(x)', '1'], ['1 + tan^2(x)', 'sec^2(x)'], ['1 + cot^2(x)', 'csc^2(x)'], ['tan(x)', 'sen(x)/cos(x)'], ['sen(2x)', '2sen(x)cos(x)'],
    ['cos(2x)', 'cos^2(x) - sen^2(x)'], ['cos(2x)', '2cos^2(x) - 1'], ['sen(3x)', '3sen(x) - 4sen^3(x)'], ['sen(x + 30)', 'sen(x)cos(30) + cos(x)sen(30)']];
  const no = [['sen(x) + cos(x)', '1'], ['sen(2x)', '2sen(x)'], ['cos(x/2)', 'cos(x)/2'], ['sen^2(x)', 'sen(x^2)'], ['cos(2x)', 'cos^2(x) + sen^2(x)'], ['sen(x + 30)', 'sen(x) + sen(30)'], ['sen(3x)', '3sen(x)']];
  for (const [izq, der] of si) assert.ok(motor.identidad({ izq, der }).es, `${izq} = ${der}`);
  for (const [izq, der] of no) assert.ok(!motor.identidad({ izq, der }).es, `${izq} ≠ ${der}`);
});

// Regla de las revisiones: ningún error típico puede dar lo mismo que la respuesta correcta.
function sinChoques(r, que) {
  assert.ok(r.errores && Array.isArray(r.coinciden), `${que}: faltan errores o coinciden`);
  for (const [k, e] of Object.entries(r.errores)) {
    assert.ok(!casi(e.valor, r.valor), `${que}: el error ${k} da lo mismo que la correcta (${r.texto})`);
    if (r.texto) assert.notEqual(e.texto, r.texto, `${que}: el error ${k} se escribe igual que la correcta`);
    assert.ok(/^(TR\d+|ID\d+)$/.test(e.id) && motor.ERRORES[e.id], `${que}: el error ${k} no tiene id del catálogo`);
  }
  for (const k of r.coinciden) assert.ok(!(k in r.errores), `${que}: ${k} está en los dos lados`);
}
function revisar(r, que) {
  if (r.errores) sinChoques(r, que);
  for (const k of ['senDoble', 'cosDoble']) if (r[k]) sinChoques(r[k], `${que} · ${k}`);
}
test('ningún error típico coincide con la respuesta correcta (casos y barrido)', () => {
  for (const c of datos.casos) {
    revisar(llamar(c.fn, c.args), c.nombre);
    for (const t of c.tambien || []) revisar(llamar(t.fn || c.fn, t.args), c.nombre);
  }
  for (let k = 0; k < N; k++) {
    const c = ent(1, 4);
    revisar(motor.pitagorica({ sen: fraccionAzar(c <= 2 ? 1 : -1), cuadrante: c }), 'pitagórica');
    revisar(motor.pitagorica({ cos: fraccionAzar(c === 1 || c === 4 ? 1 : -1), cuadrante: c }), 'pitagórica con cos');
    revisar(motor.secDesdeTan({ tan: `${c === 1 || c === 3 ? '' : '-'}${ent(1, 12)}/${ent(1, 12)}`, cuadrante: c }), 'sec');
    revisar(motor.cuadrado({ fn: elegir(['sen', 'cos']), g: elegir(NOTABLES.filter(g => g > 0)) }), 'cuadrado');
    revisar(motor.suma({ a: elegir(NOTABLES), b: elegir(NOTABLES), fn: elegir(['sen', 'cos']), op: elegir(['+', '−']) }), 'suma');
    revisar(motor.suma({ a: ent(1, 89) + .5, b: ent(1, 89), fn: elegir(['sen', 'cos']) }), 'suma numérica');
    const ta = `${ent(1, 9)}/${ent(1, 9)}`, tb = `${ent(1, 9)}/${ent(1, 9)}`;
    if (!casi(fval(ta) * fval(tb), 1)) revisar(motor.sumaTan({ ta, tb }), `tan(${ta} + ${tb})`);
    revisar(motor.doble({ sen: fraccionAzar(c <= 2 ? 1 : -1), cuadrante: c }), 'doble');
    const R = elegir([[0, 90, 1], [90, 180, -1], [180, 270, -1], [270, 360, 1]]), cf = fraccionAzar(R[2]);
    if (fval(cf) !== 0) revisar(motor.mitad({ cos: cf, desde: R[0], hasta: R[1] }), `mitad ${cf}`);
    revisar(motor.triple({ sen: fraccionAzar(elegir([1, -1])) }), 'triple');
  }
  // la escena que se arrastra (paso 4 y paso 6): con a, b entre 5° y 85°, la suma de alturas nunca es la altura de a + b
  for (let a = 5; a <= 85; a++) for (let b = 5; b <= 85; b++) {
    const C = motor.cadena({ a, b }); assert.ok(C.sumaDeSenos > C.senSuma + 1e-6, `con a = ${a}° y b = ${b}°, sen a + sen b no supera a sen(a + b)`);
  }
  for (let x = 5; x <= 85; x++) { const C = motor.cadena({ a: x, b: x }); assert.ok(C.sumaDeSenos > C.senSuma + 1e-6, `2 sen ${x}° > sen ${2 * x}°`); }
});

// Las predicciones de la escena (index.html): respuesta del motor, opciones distintas y con la misma forma.
const op = (r, ...ks) => [r.texto, ...ks.map(k => r.errores[k].texto)];
const D6 = motor.doble({ sen: '3/5' }), D7 = motor.doble({ sen: '1/3' });
const ESCENA = {
  paso2: () => op(motor.cuadrado({ fn: 'sen', g: 30 }), 'delCuadrado', 'doble', 'senDoble'),
  paso3: () => op(motor.pitagorica({ sen: '3/5' }), 'lineal', 'sinRaiz', 'reciproca'),
  paso4: () => op(motor.suma({ a: 45, b: 30 }), 'lineal', 'signo', 'producto'),
  paso5: () => op(motor.suma({ a: 37, b: 16 }), 'lineal', 'signo', 'formulaCoseno'),
  paso6: () => op(D6.senDoble, 'lineal', 'formulaCoseno', 'dosSenCuadrado'),
  paso7: () => op(D7.cosDoble, 'pitagorica', 'sinDos', 'sinCuadrado'),
  paso8: () => op(motor.mitad({ cos: '7/25', desde: 0, hasta: 90 }), 'lineal', 'sinRaiz', 'formulaSeno'),
  'tangente-y-secante': () => op(motor.secDesdeTan({ tan: '3/4' }), 'lineal', 'sinRaiz', 'reciproca'),
  'seno-de-una-resta': () => op(motor.suma({ a: 53, b: 37, op: '−' }), 'lineal', 'signo', 'formulaCoseno'),
  'coseno-de-una-suma': () => op(motor.suma({ a: 37, b: 16, fn: 'cos' }), 'lineal', 'signo', 'formulaSeno'),
  'tangente-de-una-suma': () => op(motor.sumaTan({ ta: '1/2', tb: '1/3' }), 'lineal', 'signo', 'producto'),
  'mitad-en-otro-cuadrante': () => op(motor.mitad({ cos: '7/25', desde: 270, hasta: 360 }), 'signo', 'formulaSeno', 'sinRaiz'),
  'angulo-triple': () => op(motor.triple({ sen: '1/3' }), 'lineal', 'signo', 'sinCubo'),
};
test('las predicciones de la escena: respuesta del motor, opciones distintas y de la misma forma', () => {
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  for (const [id, f] of Object.entries(ESCENA)) {
    const ops = f();
    assert.equal(new Set(ops).size, ops.length, `${id}: opciones repetidas: ${ops.join(' · ')}`);
    // misma forma: todas son números exactos (fracción, radical o suma de radicales entre paréntesis)
    const exacto = t => /^−?(\d+|\d*√\d+|\((?:−?\d*√?\d+)(?: [+−] \d*√?\d+)+\))(\/\d+)?$/.test(t);
    for (const t of ops) assert.ok(exacto(t), `${id}: «${t}» no es un número exacto`);
    const largos = ops.map(t => t.length); assert.ok(Math.max(...largos) <= 3 * Math.min(...largos) + 6, `${id}: largos muy distintos: ${ops.join(' · ')}`);
    assert.ok(html.includes(`'${id}'`) || html.includes(`identidades-trig-${id}`), `${id}: la escena no la usa`);
  }
});

// 3. Errores de entrada
test('entradas inválidas', () => {
  assert.throws(() => motor.razon('seno', 30), /desconocida/);
  assert.throws(() => motor.razon('sen', 'treinta'), /número/);
  assert.throws(() => motor.pitagorica({}), /sen o cos/);
  assert.throws(() => motor.pitagorica({ sen: '3/5', cos: '4/5' }), /uno solo/);
  assert.throws(() => motor.pitagorica({ sen: '6/5' }), /entre −1 y 1/);
  assert.throws(() => motor.pitagorica({ sen: '3/5', cuadrante: 3 }), /signo/);
  assert.throws(() => motor.pitagorica({ sen: '3/5', cuadrante: 5 }), /cuadrante/);
  assert.throws(() => motor.pitagorica({ sen: 'tres quintos' }), /fracción/);
  assert.throws(() => motor.secDesdeTan({ tan: '3/4', cuadrante: 2 }), /signo/);
  assert.throws(() => motor.cuadrado({ fn: 'tan', g: 30 }), /sen o cos/);
  assert.throws(() => motor.suma({ a: 30, b: 45, fn: 'tan' }), /sumaTan/);
  assert.throws(() => motor.suma({ a: 30, b: 45, op: '*' }), /op/);
  assert.throws(() => motor.sumaTan({ ta: '2', tb: '1/2' }), /no existe/);
  assert.throws(() => motor.mitad({ cos: '7/25', desde: 0, hasta: 360 }), /un solo cuadrante/);
  assert.throws(() => motor.mitad({ cos: '-7/25', desde: 0, hasta: 90 }), /signo/);
  assert.throws(() => motor.mitad({ cos: '7/25', desde: 90, hasta: 0 }), /mayor/);
  assert.throws(() => motor.triple({ sen: '3/2' }), /entre −1 y 1/);
  assert.throws(() => motor.identidad({ izq: 'sen(x', der: '1' }), /mal escrita/);
  assert.throws(() => motor.identidad({ izq: 'y + 1', der: '1' }), /no entiendo/);
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
