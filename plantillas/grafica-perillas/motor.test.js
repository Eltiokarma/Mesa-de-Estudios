// Pruebas del motor de «La gráfica con perillas». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con fichas al azar (semilla fija): el punto gemelo cae sobre g y se corre h a la derecha
//    (AL28); el ancla y las perillas van y vuelven; el dominio y el rango dicen la verdad punto por punto;
//    resolver da x con g(x) = c; la inversa deshace a g y no es 1/g (AL29); el reflejo cambia x por y; la
//    recta vertical separa funciones de relaciones; la pendiente coincide con la secante corta; cada
//    inecuación (lineal, cuadrática, con valor absoluto, racional) coincide con probar número por número, y
//    los errores típicos (AL19, AL20, AL21, AL22) dan otra cosa; la media vuelta de la recta conserva la distancia al 0.
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
  assert.equal(datos.plantilla, 'grafica-perillas');
  assert.ok(datos.casos.length >= 15 && datos.casos.length <= 20);
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera, JSON.stringify(c).slice(0, 80));
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Propiedades
const rnd = motor.azar(2026);
const al = (a, b) => a + (b - a) * rnd();
const ent = (a, b) => Math.floor(al(a, b + 1));
const elegir = l => l[Math.floor(rnd() * l.length)];
const noCero = (a, b) => { for (;;) { const v = Math.round(al(a, b) * 2) / 2; if (v !== 0) return v; } };
function fichaAlAzar(bases) {
  return { base: elegir(bases || motor.BASES), a: noCero(-3, 3), b: elegir([1, 1, 1, 2, -1, 0.5]), h: ent(-4, 4), k: ent(-4, 4) };
}
const N = 400;
const OPS = ['<', '<=', '>', '>='];
const cumple = (v, op) => (op === '<' ? v < 0 : op === '<=' ? v <= 0 : op === '>' ? v > 0 : v >= 0);
const malla = []; for (let x = -12; x <= 12; x += 0.25) malla.push(x);

test('AL28: el gemelo de (x0; f(x0)) cae sobre g, y con b = 1 se corre exactamente h a la derecha', () => {
  for (let i = 0; i < N; i++) {
    const g = fichaAlAzar(), x0 = al(-3, 3), r = motor.gemelo(g, x0);
    if (!r.definido) continue;
    cerca(r.sobreG, r.gemelo.y, 'el gemelo está sobre g', 1e-8);
    if (g.b === 1) {
      cerca(r.desplazamiento.dx, g.h, 'corre h');
      if (g.h !== 0) assert.ok(r.errores.hAlReves.x !== r.gemelo.x, 'al revés es otro punto');
      if (g.h > 0) assert.ok(r.gemelo.x > r.base.x, 'f(x − h) con h > 0 va a la derecha');
    }
  }
});
test('el ancla y las perillas van y vuelven', () => {
  for (let i = 0; i < N; i++) {
    const g = fichaAlAzar(), A = motor.ancla(g), hk = motor.desdeAncla(g, A);
    cerca(hk.h, g.h, 'h'); cerca(hk.k, g.k, 'k');
    if (!A.asintotas) cerca(motor.evaluar(g, A.x).valor, A.y, 'el ancla está sobre g');
    const P = { x: al(-5, 5), y: al(-5, 5) }, g2 = { ...g, ...motor.desdeAncla(g, P) }, A2 = motor.ancla(g2);
    cerca(A2.x, P.x, 'ancla x'); cerca(A2.y, P.y, 'ancla y');
  }
});
test('dominio y rango: cada x de la malla está en el dominio si y solo si g está definida; cada valor está en el rango', () => {
  for (let i = 0; i < N / 2; i++) {
    const g = fichaAlAzar(), D = motor.dominio(g).intervalos, Rg = motor.rango(g).intervalos;
    for (const x of malla) {
      const v = motor.evaluar(g, x).valor;
      // los bordes exactos de un intervalo abierto pueden dar ±∞ o NaN: se comparan solo los de adentro
      const borde = D.some(I => Math.abs(x - I.lo) < 1e-9 || Math.abs(x - I.hi) < 1e-9);
      if (!borde) assert.equal(motor.pertenece(D, x), v !== null, `${JSON.stringify(g)} en x = ${x}`);
      if (v !== null && Math.abs(v) < 1e6 && !Rg.some(I => Math.abs(v - I.lo) < 1e-9 || Math.abs(v - I.hi) < 1e-9))
        assert.ok(motor.pertenece(Rg, v), `${JSON.stringify(g)}: g(${x}) = ${v} fuera del rango ${motor.rango(g).texto}`);
    }
  }
});
test('resolver: cada x que devuelve cumple g(x) = c; ceros son los x con g(x) = 0', () => {
  for (let i = 0; i < N; i++) {
    const g = fichaAlAzar(), c = al(-6, 6);
    for (const x of motor.resolver(g, c)) cerca(motor.evaluar(g, x).valor, c, `${JSON.stringify(g)} = ${c}`, 1e-7);
    for (const x of motor.ceros(g).ceros) cerca(motor.evaluar(g, x).valor, 0, 'cero', 1e-7);
  }
});
test('AL29: la inversa deshace a g (f⁻¹(f(x)) = x) y casi nunca es 1/g', () => {
  const inyectivas = motor.BASES.filter(b => b !== 'cuadratica' && b !== 'abs');
  let distintas = 0, total = 0;
  for (let i = 0; i < N; i++) {
    const g = fichaAlAzar(inyectivas), I = motor.inversa(g);
    assert.equal(I.invertible, true);
    for (const x of [-2.5, -1, 0.5, 1.75, 3]) {
      const y = motor.evaluar(g, x).valor;
      if (y === null || Math.abs(y) > 1e5) continue;
      const v = motor.evaluar(I.ficha, y).valor;
      cerca(v, x, `${JSON.stringify(g)}: f⁻¹(f(${x}))`, 1e-7);
      cerca(motor.inversaEn(g, y).valor, x, 'inversaEn', 1e-7);
      const r = motor.reciproco(g, x).valor; total++;
      if (r === null || Math.abs(r - motor.evaluar(I.ficha, x).valor) > 1e-6) distintas++;
    }
    // el dominio de la inversa es el rango de g
    assert.equal(I.dominio.texto, motor.rango(g).texto);
  }
  assert.ok(distintas / total > 0.95, 'f⁻¹ y 1/f dan cosas distintas');
  // la cuadrática y el valor absoluto no son inyectivos: el testigo da dos x con la misma y
  for (let i = 0; i < N / 4; i++) {
    const g = fichaAlAzar(['cuadratica', 'abs']), I = motor.inversa(g);
    assert.equal(I.invertible, false);
    const [x1, x2] = I.testigo.xs;
    assert.ok(x1 !== x2);
    cerca(motor.evaluar(g, x1).valor, I.testigo.y, 'testigo 1'); cerca(motor.evaluar(g, x2).valor, I.testigo.y, 'testigo 2');
  }
});
test('el reflejo en y = x cambia x por y, y a medio camino toca la recta y = x', () => {
  for (let i = 0; i < N; i++) {
    const p = { x: al(-9, 9), y: al(-9, 9) };
    const r0 = motor.reflejoAnimado(p, 0), r1 = motor.reflejoAnimado(p, 1), rm = motor.reflejoAnimado(p, 0.5);
    cerca(r0.x, p.x, 't = 0'); cerca(r1.x, p.y, 'x ↔ y'); cerca(r1.y, p.x, 'y ↔ x'); cerca(rm.x, rm.y, 'sobre y = x');
  }
  const g = { base: 'exp2' };
  for (const tr of motor.muestrearReflejo(g, -4, 4, -4, 4)) for (const [x, y] of tr) if (x > -4 && x < 4) cerca(motor.evaluar(g, y).valor, x, 'punto del reflejo', 1e-7);
});
test('muestrear: los puntos de cada tramo están sobre g (o pegados al borde) y en orden', () => {
  for (let i = 0; i < N / 2; i++) {
    const g = fichaAlAzar(), tramos = motor.muestrear(g, -8, 8, { y0: -6, y1: 6, n: 120 });
    for (const t of tramos) {
      for (let j = 0; j < t.length; j++) {
        const [x, y] = t[j];
        if (j) assert.ok(x > t[j - 1][0], 'x crece');
        if (y > -18 && y < 18) cerca(motor.evaluar(g, x).valor, y, 'sobre g', 1e-7);
      }
    }
  }
  // 1/g: cada punto es el recíproco de g, y se corta en los ceros de g
  const g2 = { base: 'cuadratica', k: -1 };
  const rec = motor.muestrearReciproco(g2, -4, 4, { y0: -4, y1: 4 });
  assert.ok(rec.length >= 3, 'x² − 1 tiene dos ceros: 1/(x² − 1) se parte en tres');
  for (const t of rec) for (const [x, y] of t) if (Math.abs(y) < 12) cerca(1 / motor.evaluar(g2, x).valor, y, '1/g', 1e-7);
  // 1/x se parte en dos tramos, uno a cada lado de la asíntota
  assert.equal(motor.muestrear({ base: 'reciproca', h: 1 }, -5, 5, { y0: -5, y1: 5 }).length, 2);
});
test('recta vertical: una función nunca da dos cortes; el reflejo de una no inyectiva sí', () => {
  for (let i = 0; i < N / 4; i++) {
    const g = fichaAlAzar();
    assert.equal(motor.esFuncion({ tipo: 'funcion', ficha: g }, -6, 6).esFuncion, true);
    const ref = motor.esFuncion({ tipo: 'reflejo', ficha: g }, -12, 12, 0.125);
    if (g.base === 'cuadratica' || g.base === 'abs') {
      assert.equal(ref.esFuncion, false, `reflejo de ${JSON.stringify(g)}`);
      for (const y of ref.testigo.ys) cerca(motor.evaluar(g, y).valor, ref.testigo.x, 'el corte está sobre el reflejo', 1e-7);
    } else assert.equal(ref.esFuncion, true, `reflejo de ${JSON.stringify(g)}`);
  }
  assert.equal(motor.esFuncion({ tipo: 'vertical', x: 2 }, -3, 3).esFuncion, false);
  assert.equal(motor.esFuncion({ tipo: 'puntos', puntos: [[1, 2], [1, 3], [2, 2]] }, 0, 3).esFuncion, false);
  assert.equal(motor.esFuncion({ tipo: 'puntos', puntos: [[1, 2], [2, 2], [3, 2]] }, 0, 3).esFuncion, true);
});
test('AL25: la pendiente es la de la secante corta, y crecer rápido no es estar más arriba', () => {
  for (let i = 0; i < N; i++) {
    const g = fichaAlAzar(), x = al(-3, 3), p = motor.pendiente(g, x).valor;
    if (p === null) continue;
    const d = 1e-6, s = motor.secante(g, x - d, x + d).valor;
    if (s === null || Math.abs(p) > 1e4) continue;
    assert.ok(Math.abs(s - p) <= 1e-4 * Math.max(1, Math.abs(p)), `${JSON.stringify(g)} en ${x}: ${p} contra ${s}`);
  }
  for (let i = 0; i < N; i++) {
    const A = { m: al(-3, 3), n: al(-5, 5) }, B = { m: al(-3, 3), n: al(-5, 5) }, x = al(-5, 5), r = motor.compararRectas(A, B, x);
    assert.equal(r.masRapida, A.m > B.m ? 'A' : 'B');
    if (r.cruce) cerca(A.m * r.cruce.x + A.n, B.m * r.cruce.x + B.n, 'se cruzan', 1e-8);
    // a un lado del cruce, la más rápida va abajo: altura y pendiente no son lo mismo
    if (r.cruce) { const izq = motor.compararRectas(A, B, r.cruce.x - 1); assert.notEqual(izq.masAlta, izq.masRapida); }
  }
});
test('AL20, AL16, AL19: la inecuación lineal coincide con probar cada número; sin invertir sale lo contrario', () => {
  for (let i = 0; i < N; i++) {
    const m = elegir([-4, -3, -2, -1, 1, 2, 3, 5]), n = ent(-6, 6), c = ent(-10, 10), op = elegir(OPS);
    const r = motor.inecuacionLineal(m, n, op, c);
    for (const x of malla) assert.equal(motor.pertenece(r.intervalos, x), cumple(m * x + n - c, op), `${m}x + ${n} ${op} ${c} en ${x}`);
    assert.equal(r.invierte, m < 0);
    if (m < 0) assert.notEqual(r.errores.sinInvertir.texto, r.texto);
    else assert.equal(r.errores.sinInvertir.texto, r.texto);
    // cada paso dice lo mismo que el anterior: se prueba con la frontera ± 1
    for (const x of [r.frontera - 1, r.frontera + 1]) for (const p of r.pasos) {
      const izq = p.m * x + (p === r.pasos[0] ? n : 0);
      assert.equal(cumple(izq - p.valor, p.op), cumple(m * x + n - c, op), `paso ${p.texto} en ${x}`);
    }
  }
});
test('la media vuelta de la recta (×(−1)) conserva la distancia al 0; trasladar y escalar empiezan en u', () => {
  for (let i = 0; i < N; i++) {
    const u = al(-10, 10), t = rnd();
    const g = motor.posicionRecta({ tipo: 'girar' }, u, t);
    cerca(Math.hypot(g.x, g.y), Math.abs(u), 'radio');
    cerca(motor.posicionRecta({ tipo: 'girar' }, u, 1).x, -u, 'termina en −u');
    cerca(motor.posicionRecta({ tipo: 'trasladar', d: 3 }, u, 0).x, u, 'trasladar');
    cerca(motor.posicionRecta({ tipo: 'escalar', f: 0.5 }, u, 1).x, u / 2, 'escalar');
  }
});
test('AL19: inecuación cuadrática por signos, comparada número por número', () => {
  for (let i = 0; i < N; i++) {
    const A = elegir([-2, -1, 1, 2]), r1 = ent(-5, 5), r2 = ent(-5, 5), op = elegir(OPS);
    // A(x − r1)(x − r2) y también sin raíces reales: A(x² + 1)
    const sinRaices = rnd() < 0.2;
    const B = sinRaices ? 0 : -A * (r1 + r2), C = sinRaices ? A : A * r1 * r2;
    const r = motor.inecuacionCuadratica(A, B, C, op);
    for (const x of malla) assert.equal(motor.pertenece(r.intervalos, x), cumple(A * x * x + B * x + C, op), `${A}x² + ${B}x + ${C} ${op} 0 en ${x}`);
  }
});
test('AL22: |x − c| op r coincide con la distancia; quitar las barras da otra cosa', () => {
  for (let i = 0; i < N; i++) {
    const c = ent(-5, 5), rr = ent(-2, 6), op = elegir(OPS), r = motor.valorAbsoluto(c, rr, op);
    for (const x of malla) assert.equal(motor.pertenece(r.intervalos, x), cumple(Math.abs(x - c) - rr, op), `|x − ${c}| ${op} ${rr} en ${x}`);
    if (rr > 0) assert.notEqual(r.errores.quitaBarras.texto, r.texto);
  }
});
test('AL23: las soluciones de |px + q| = rx + s cumplen; las descartadas no', () => {
  for (let i = 0; i < N; i++) {
    const p = elegir([-3, -2, -1, 1, 2, 3]), q = ent(-6, 6), r = elegir([-2, -1, 1, 2, 0.5]), s = ent(-6, 6);
    const a = motor.absIgual(p, q, r, s);
    for (const x of a.soluciones) cerca(Math.abs(p * x + q), r * x + s, 'cumple', 1e-8);
    for (const x of a.descartadas) assert.ok(r * x + s < 0, 'se descarta porque el lado derecho es negativo');
  }
});
test('AL21: la racional por signos; multiplicar sin mirar el signo pierde un tramo', () => {
  for (let i = 0; i < N; i++) {
    const n = elegir([-3, -2, -1, 1, 2, 3, 4]), p = ent(-4, 4), c = elegir([-2, -1, 1, 2, 3]), op = elegir(OPS);
    const r = motor.inecuacionRacional(n, p, op, c);
    for (const x of malla) {
      const ok = x === p ? false : cumple(n / (x - p) - c, op);
      assert.equal(motor.pertenece(r.intervalos, x), ok, `${n}/(x − ${p}) ${op} ${c} en ${x}`);
    }
    assert.notEqual(r.errores.multiplicaSinSigno.texto, r.texto);
  }
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.evaluar({ base: 'seno' }, 1), /base desconocida/);
  assert.throws(() => motor.evaluar({ base: 'lineal', a: 0 }, 1), /a no puede ser 0/);
  assert.throws(() => motor.evaluar({ base: 'lineal', b: 0 }, 1), /b no puede ser 0/);
  assert.throws(() => motor.evaluar({ base: 'lineal', h: '2' }, 1), /h debe ser un número/);
  assert.throws(() => motor.evaluar({ base: 'lineal' }, NaN), /x debe ser un número/);
  assert.throws(() => motor.evaluar(null, 1), /ficha/);
  assert.throws(() => motor.vertice({ base: 'lineal' }), /vértice/);
  assert.throws(() => motor.cuadraticaGeneral(0, 1, 1), /no sería cuadrática/);
  assert.throws(() => motor.inecuacionLineal(0, 1, '<', 2), /m no puede ser 0/);
  assert.throws(() => motor.inecuacionLineal(1, 1, '=<', 2), /operador/);
  assert.throws(() => motor.valorAbsoluto('3', 1, '<'), /números/);
  assert.throws(() => motor.inecuacionRacional(0, 1, '<', 2), /n no puede ser 0/);
  assert.throws(() => motor.secante({ base: 'raiz' }, 1, 1), /distintos/);
  assert.throws(() => motor.cortesVertical({ tipo: 'nube' }, 1), /desconocido/);
  assert.throws(() => motor.posicionRecta({ tipo: 'saltar' }, 1, 0), /desconocida/);
  assert.throws(() => motor.desdeAncla({ base: 'lineal' }, { x: 1 }), /numéricas/);
  // fuera del dominio no explota: dice que no está definida
  assert.equal(motor.evaluar({ base: 'raiz' }, -1).definido, false);
  assert.equal(motor.evaluar({ base: 'reciproca', h: 2 }, 2).definido, false);
  assert.equal(motor.gemelo({ base: 'log2' }, 0).definido, false);
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
