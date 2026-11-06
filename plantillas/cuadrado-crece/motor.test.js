// Pruebas del motor de «El cuadrado que crece». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con números al azar (semilla fija):
//    - leer y volver a escribir una expresión no cambia su valor; desarrollar no cambia su valor;
//    - las piezas del cuadrado y del cubo suman el área y el volumen; las de (a − b)² y a² − b² también;
//    - el reacomodo conserva el área y la pieza que se mueve nunca se monta sobre la que queda fija;
//    - factorizar y volver a multiplicar da el polinomio de partida;
//    - NINGÚN ERROR TÍPICO COINCIDE CON LA RESPUESTA CORRECTA (los que coinciden van en 'coinciden' y sí dan lo mismo);
//    - √(a² + b²) < a + b si los dos catetos son positivos; log(ab) = log a + log b; base^(m + n) = grupos · porGrupo.
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
  if (typeof esperado !== 'number') { assert.deepEqual(real, esperado, que); return; }
  assert.ok(Math.abs(real - esperado) <= t * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
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
  assert.equal(datos.plantilla, 'cuadrado-crece');
  assert.ok(datos.casos.length >= 15 && datos.casos.length <= 20);
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
const N = 300;
const conSigno = (k, t) => (k < 0 ? `− ${-k}${t}` : `+ ${k}${t}`);
const casi = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
// un número al azar: entero, negativo o fracción
function numAzar() { const r = rnd(); if (r < 0.6) return ent(-9, 9); return ent(-12, 12) / ent(2, 6); }

function expresionAlAzar(prof) {
  const r = rnd();
  if (prof <= 0 || r < 0.25) return rnd() < 0.5 ? String(ent(1, 9)) : ['a', 'b', 'x'][ent(0, 2)];
  const a = expresionAlAzar(prof - 1), b = expresionAlAzar(prof - 1);
  if (r < 0.45) return `${a} + ${b}`;
  if (r < 0.6) return `${a} − (${b})`;
  if (r < 0.75) return `(${a})(${b})`;
  if (r < 0.85) return `${ent(2, 9)}(${a})`;
  if (r < 0.93) return `(${a})${rnd() < 0.7 ? '²' : '³'}`;
  return `−(${a})`;
}
test('leer y volver a escribir una expresión no cambia su valor; desarrollarla tampoco', () => {
  for (let k = 0; k < N; k++) {
    const e = expresionAlAzar(3), val = { a: numAzar(), b: numAzar(), x: numAzar() };
    const v = motor.evaluar(e, val).valor;
    cerca(motor.evaluar(motor.texto(e), val).valor, v, `reescrita: ${e} → ${motor.texto(e)}`, 1e-7);
    const d = motor.desarrollar(e);
    cerca(motor.evaluar(d.texto, val).valor, v, `desarrollada: ${e} → ${d.texto}`, 1e-7);
    // la sustitución escrita, leída otra vez, da lo mismo
    cerca(motor.evaluar(motor.evaluar(e, val).sustituida, {}).valor, v, `sustituida: ${e} → ${motor.evaluar(e, val).sustituida}`, 1e-7);
    assert.ok(motor.identidad(e, d.texto).identidad, `${e} = ${d.texto} debe ser identidad`);
  }
});
test('raíces, logaritmos y potencias: se leen, se escriben y quedan exactos cuando lo son', () => {
  for (let k = 0; k < N; k++) {
    const p = ent(0, 12), q = ent(0, 12), b = [2, 3, 10][ent(0, 2)], m = ent(-3, 4);
    cerca(motor.evaluar(`√(${p * p})`).valor, p, 'raíz exacta');
    assert.equal(motor.evaluar(`√(${p * p})`).exacto, String(p));
    const L = b === 10 ? 'log' : `log_${b}`;
    const arg = Math.pow(b, m);
    const r = motor.evaluar(`${L}(${arg >= 1 ? arg : `1/${Math.round(1 / arg)}`})`);
    assert.equal(r.exacto, m < 0 ? `−${-m}` : String(m), `${L} de ${arg}`);
    cerca(motor.evaluar(motor.evaluar(`√(${p} + ${q})`).sustituida).valor, Math.sqrt(p + q), 'raíz reescrita');
  }
});
test('las piezas del cuadrado suman (a + b)², separadas o juntas; a² + b² es menor salvo que a o b sea 0 (AL8)', () => {
  for (let k = 0; k < N; k++) {
    const a = ent(0, 9), b = ent(0, 9), h = ent(0, 3) / 2, f = rnd();
    const P = motor.piezasCuadrado({ a, b, hueco: h, f });
    cerca(P.sumaPiezas, (a + b) ** 2, 'suma de piezas');
    cerca(P.sumaCuadrados + P.rectangulos, P.area, 'a² + b² + 2ab');
    assert.equal(P.sumaCuadrados < P.area, a > 0 && b > 0, `a = ${a}, b = ${b}`);
    // juntas (f = 0) no se montan y llenan el cuadrado
    const J = motor.piezasCuadrado({ a, b });
    for (const p of J.piezas) assert.ok(p.x >= 0 && p.y >= 0 && p.x + p.w <= a + b + 1e-9 && p.y + p.h <= a + b + 1e-9);
    for (let i = 0; i < J.piezas.length; i++) for (let j = i + 1; j < J.piezas.length; j++) {
      const p = J.piezas[i], q = J.piezas[j];
      const ix = Math.min(p.x + p.w, q.x + q.w) - Math.max(p.x, q.x), iy = Math.min(p.y + p.h, q.y + q.h) - Math.max(p.y, q.y);
      assert.ok(ix <= 1e-9 || iy <= 1e-9, 'dos piezas se montan');
    }
  }
});
test('(a − b)²: el cuadrado grande menos dos tiras más la esquina deja el cuadrado de lado |a − b|, también si a < b', () => {
  for (let k = 0; k < N; k++) {
    const a = ent(0, 12), b = ent(0, 12), R = motor.restaCuadrado({ a, b });
    cerca(R.cuadrado.area - R.tiras[0].area - R.tiras[1].area + R.esquina.area, R.resto.area, 'la cuenta de las piezas');
    cerca(R.resto.area, (a - b) ** 2, 'resto');
    cerca(R.valor, (a - b) ** 2, 'valor');
    assert.ok(R.valor >= 0, 'un cuadrado nunca es negativo');
  }
});
test('a² − b² = (a + b)(a − b): el reacomodo conserva el área y la pieza móvil nunca se monta sobre la fija', () => {
  for (let k = 0; k < N; k++) {
    const b = ent(1, 8), a = b + ent(1, 8), D = motor.diferenciaCuadrados({ a, b });
    cerca(D.fija.area + D.movil.area, a * a - b * b, 'L');
    cerca(D.rectangulo.area, D.valor, 'rectángulo');
    for (let f = 0; f <= 1.0001; f += 0.05) {
      const R = motor.reacomodo({ a, b, f });
      const g = R.giro * Math.PI / 180, hw = (Math.abs(Math.cos(g)) * R.w + Math.abs(Math.sin(g)) * R.h) / 2, hh = (Math.abs(Math.sin(g)) * R.w + Math.abs(Math.cos(g)) * R.h) / 2;
      const ix = Math.min(R.cx + hw, D.fija.w) - Math.max(R.cx - hw, 0), iy = Math.min(R.cy + hh, D.fija.h) - Math.max(R.cy - hh, 0);
      assert.ok(ix <= 1e-9 || iy <= 1e-9, `a = ${a}, b = ${b}, f = ${f.toFixed(2)}: la pieza se monta sobre la fija`);
    }
    const fin = motor.reacomodo({ a, b, f: 1 });
    cerca(fin.cx, D.final.x + D.final.w / 2, 'centro final x'); cerca(fin.cy, D.final.y + D.final.h / 2, 'centro final y');
  }
});
test('el cubo de arista a + b: ocho piezas (1, 3, 3 y 1 de cada forma) que suman (a + b)³', () => {
  for (let k = 0; k < N; k++) {
    const a = ent(1, 6), b = ent(1, 6), C = motor.piezasCubo({ a, b, hueco: 1, f: rnd() });
    cerca(C.sumaPiezas, (a + b) ** 3, 'volumen');
    const cuenta = {}; for (const p of C.piezas) cuenta[p.tipo] = (cuenta[p.tipo] || 0) + 1;
    assert.deepEqual(cuenta, { a3: 1, a2b: 3, ab2: 3, b3: 1 });
    const R = motor.cuboBinomio({ a, b });
    cerca(R.valor, R.terminos.a3 + 3 * R.terminos.a2b + 3 * R.terminos.ab2 + R.terminos.b3, 'desarrollo');
  }
});
test('factorizar y volver a multiplicar da el polinomio de partida (los cuatro métodos)', () => {
  for (let k = 0; k < N; k++) {
    const p = ent(1, 3), q = ent(-9, 9), r = ent(1, 3), s = ent(-9, 9), g = ent(1, 3);
    const pol = motor.desarrollar(`${g}(${p}x ${conSigno(q, '')})(${r}x ${conSigno(s, '')})`).texto;
    const F = motor.factorizar(pol);
    assert.ok(F.identidad, `${pol} → ${F.texto}`);
    assert.ok(motor.identidad(F.texto, pol).identidad, `${pol} → ${F.texto}`);
    assert.ok(F.sePuede, `${pol} se puede factorizar`);
  }
  // diferencias y trinomios cuadrados perfectos
  for (let r = 1; r <= 12; r++) {
    assert.deepEqual(motor.factorizar(`x² − ${r * r}`).metodos, ['diferencia de cuadrados']);
    assert.deepEqual(motor.factorizar(`x² − ${2 * r}x + ${r * r}`).metodos, ['trinomio cuadrado perfecto']);
    assert.deepEqual(motor.factorizar(`x² + ${2 * r}x + ${r * r}`).metodos, ['trinomio cuadrado perfecto']);
  }
});

// Regla extra de las revisiones: ningún error típico puede dar lo mismo que la respuesta correcta.
function sinChoques(R, que) {
  assert.ok(R.errores && Array.isArray(R.coinciden), `${que}: faltan errores o coinciden`);
  const sim = R.texto !== undefined && R.valor === undefined;
  for (const [k, e] of Object.entries(R.errores)) {
    if (sim) assert.notEqual(e.texto, R.texto, `${que}: el error ${k} da lo mismo que la correcta (${R.texto})`);
    else if (e.valores) assert.ok(!(e.valores.length === 1 && casi(e.valores[0], R.valor)), `${que}: el error ${k} da solo la correcta`);
    else if (e.valor !== null) assert.ok(!casi(e.valor, R.valor), `${que}: el error ${k} da ${e.valor}, igual que la correcta`);
    // un error que es un polinomio, desarrollado, tampoco puede ser el polinomio correcto
    if (e.texto !== undefined && R.polinomio) assert.equal(motor.identidad(e.texto, R.polinomio).identidad, false, `${que}: ${k}`);
  }
  for (const k of R.coinciden) assert.ok(!(k in R.errores), `${que}: ${k} está en los dos lados`);
}
test('ningún error típico coincide con la respuesta correcta; los que coinciden se apartan', () => {
  for (let k = 0; k < N; k++) {
    const a = ent(0, 9), b = ent(0, 9), sg = rnd() < 0.5 ? '+' : '-';
    sinChoques(motor.binomioCuadrado({ a, b, signo: sg }), `binomio ${a} ${sg} ${b}`);
    sinChoques(motor.binomioCuadrado({ a: numAzar(), b: numAzar(), signo: sg }), 'binomio con fracciones');
    // los que se apartaron sí dan lo mismo
    const B = motor.binomioCuadrado({ a, b, signo: sg });
    const expr = { sinDoble: sg === '+' ? 'a² + b²' : 'a² − b²', unSoloAB: sg === '+' ? 'a² + ab + b²' : 'a² − ab + b²', sinB2: 'a² + 2ab', porDos: '2(a + b)', sumaCuadrados: 'a² + b²', signoB2: 'a² − 2ab − b²', negativo: '−(a − b)²' };
    for (const c of B.coinciden) cerca(motor.evaluar(expr[c], { a, b }).valor, B.valor, `coincide ${c}`);
    sinChoques(motor.binomioCuadradoX({ b: ent(1, 9), signo: sg }), 'binomio con x');
    sinChoques(motor.cuboBinomio({ a: ent(0, 6), b: ent(0, 6) }), 'cubo');
    sinChoques(motor.productoX({ m: ent(-9, 9), n: ent(-9, 9) }), 'producto (x + m)(x + n)');
    sinChoques(motor.trinomioCuadrado({ a: ent(-5, 5), b: ent(-5, 5), c: ent(-5, 5) }), 'trinomio');
    sinChoques(motor.legendre({ a: ent(-6, 6), b: ent(-6, 6) }), 'legendre');
    sinChoques(motor.sumaProducto({ suma: ent(-9, 9), producto: ent(-20, 20) }), 'suma y producto');
    sinChoques(motor.hipotenusa({ a: ent(0, 9), b: ent(0, 9) }), 'hipotenusa');
    sinChoques(motor.raizDeSuma({ p: ent(0, 30), q: ent(0, 30) }), 'raíz de una suma');
    sinChoques(motor.raizDelCuadrado({ x: numAzar() }), 'raíz del cuadrado');
    { const n = ent(1, 9), m = ent(-9, 9), x = ent(-9, 9); if (x + n !== 0) {
      const Fz = motor.fraccionSumandos({ x, m, n }); sinChoques(Fz, 'fracción con sumandos');
      // tachar la x solo da lo mismo si x = 0 o m = n
      assert.equal(Fz.coinciden.includes('tachaX'), x === 0 || m === n, `x = ${x}, m = ${m}, n = ${n}`);
    } }
    sinChoques(motor.potenciaDeSuma({ base: ent(1, 5), m: ent(0, 4), n: ent(0, 4) }), 'potencia');
    sinChoques(motor.logProducto({ a: ent(1, 50), b: ent(1, 50), base: [2, 10][ent(0, 1)] }), 'log del producto');
    sinChoques(motor.logDeSuma({ a: ent(1, 50), b: ent(1, 50), base: [2, 10][ent(0, 1)] }), 'log de la suma');
    const bb = ent(1, 8), aa = bb + ent(1, 8);
    sinChoques(motor.diferenciaCuadrados({ a: aa, b: bb }), 'diferencia de cuadrados');
    // factorizar: los errores, multiplicados, nunca dan el polinomio de partida
    const r = ent(1, 9), m = ent(-9, 9), n = ent(-9, 9);
    for (const pol of [`x² − ${r * r}`, `x² − ${2 * r}x + ${r * r}`, motor.desarrollar(`(x ${conSigno(m, '')})(x ${conSigno(n, '')})`).texto, motor.desarrollar(`${ent(2, 5)}x(x ${conSigno(m, '')})`).texto]) {
      if (pol === '0') continue;
      const F = motor.factorizar(pol);
      for (const [k, e] of Object.entries(F.errores)) assert.equal(motor.identidad(e.texto, pol).identidad, false, `${pol}: el error ${k} (${e.expresion}) da lo mismo`);
    }
  }
});
test('√(a² + b²) es menor que a + b si los dos catetos son positivos; el cuadrado de la hipotenusa mide c²', () => {
  for (let k = 0; k < N; k++) {
    const a = ent(1, 12), b = ent(1, 12), H = motor.hipotenusa({ a, b });
    assert.ok(H.valor < a + b && H.valor > Math.max(a, b));
    cerca(H.valor * H.valor, a * a + b * b, 'Pitágoras');
    const Q = H.cuadradoC, lado = (p, q) => Math.hypot(q.x - p.x, q.y - p.y);
    for (let i = 0; i < 4; i++) cerca(lado(Q[i], Q[(i + 1) % 4]), H.valor, 'lado del cuadrado de la hipotenusa');
    cerca(lado(Q[0], Q[2]), H.valor * Math.SQRT2, 'diagonal');
  }
});
test('log(ab) = log a + log b; base^(m + n) = base^m · base^n; √(x²) = |x|; a + b y ab dan a² + b²', () => {
  for (let k = 0; k < N; k++) {
    const a = ent(1, 200), b = ent(1, 200), L = motor.logProducto({ a, b });
    cerca(L.valor, L.logA + L.logB, 'log'); cerca(L.valor, Math.log10(a * b), 'log10');
    const base = ent(1, 6), m = ent(0, 5), n = ent(0, 5), P = motor.potenciaDeSuma({ base, m, n });
    cerca(P.valor, P.grupos * P.porGrupo, 'potencia'); cerca(P.valor, base ** (m + n), 'potencia directa');
    const x = numAzar(), Q = motor.raizDelCuadrado({ x }); cerca(Q.valor, Math.abs(x), '|x|');
    if (x !== 0) cerca(Q.errores.dobleSigno.valores, [-Math.abs(x), Math.abs(x)], '±|x|');
    const u = ent(-9, 9), v = ent(-9, 9), S = motor.sumaProducto({ suma: u + v, producto: u * v });
    cerca(S.valor, u * u + v * v, 'a² + b²'); cerca(S.numeros, [Math.min(u, v), Math.max(u, v)], 'los números');
    cerca(S.sumaDeCubos, u ** 3 + v ** 3, 'a³ + b³'); cerca(S.cuadradoDeLaResta, (u - v) ** 2, '(a − b)²');
  }
});
test('regla logarítmica: las marcas van en orden y los tramos log a y log b, pegados, llegan a log(ab)', () => {
  const m = motor.marcasLog({ hasta: 3 });
  for (let i = 1; i < m.length; i++) assert.ok(m[i].pos > m[i - 1].pos);
  assert.deepEqual(m.filter(x => x.mayor).map(x => x.valor), [1, 10, 100, 1000]);
  const L = motor.logProducto({ a: 100, b: 10 });
  cerca(L.logA + L.logB, m.find(x => x.valor === 1000).pos, 'llega a 1000');
});

// 3. Errores de entrada
test('entradas inválidas', () => {
  assert.throws(() => motor.evaluar('√(−4)'), /negativo/);
  assert.throws(() => motor.evaluar('log 0'), /no es positivo/);
  assert.throws(() => motor.evaluar('1/(a − a)', { a: 2 }), /cero/);
  assert.throws(() => motor.evaluar('(a + b', { a: 1, b: 2 }), /se esperaba/);
  assert.throws(() => motor.evaluar('a + b', { a: 1 }), /falta el valor de b/);
  assert.throws(() => motor.desarrollar('√x + 1'), /no es un polinomio/);
  assert.throws(() => motor.factorizar('x² + y²'), /una sola letra/);
  assert.throws(() => motor.diferenciaCuadrados({ a: 2, b: 3 }), /mayor que b/);
  assert.throws(() => motor.piezasCuadrado({ a: -1, b: 2 }), /negativo/);
  assert.throws(() => motor.potenciaDeSuma({ base: 2, m: 1.5, n: 1 }), /entero/);
  assert.throws(() => motor.logProducto({ a: 0, b: 1 }), /mayor que cero/);
  assert.throws(() => motor.binomioCuadrado({ a: 'tres', b: 2 }), /número/);
  assert.throws(() => motor.evaluar('3 # 4'), /símbolo/);
  assert.throws(() => motor.fraccionSumandos({ x: -5, m: 3, n: 5 }), /cero/);
});

// 4. papel.json
const papel = JSON.parse(fs.readFileSync(path.join(__dirname, 'papel.json'), 'utf8'));
test('papel.json: formato', () => {
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  for (const p of papel.problemas) assert.ok(p.id && p.enunciado && p.respuesta && p.pasos.length && p.verificar.length, p.id);
});
for (const p of papel.problemas) test(`papel ${p.id}: ${p.enunciado.slice(0, 60)}`, () => {
  for (const v of p.verificar) comprobar(v.fn, v.args, v.espera, p.id);
});
