// Pruebas del motor de «La escalera de la base». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con números al azar (semilla fija):
//    - log y potencia son inversas: log_b(bˣ) = x y b^(log_b N) = N; los logaritmos exactos lo son de verdad;
//    - log(ab) = log a + log b, log(aⁿ) = n log a, log a / log b = log_b a, bˣ⁺ᵏ = bˣ · bᵏ;
//    - la gráfica de log_b es el reflejo de la de bˣ en y = x, y la monotonía depende de si b > 1;
//    - las soluciones de cada ecuación la cumplen, y las raíces extrañas hacen negativo un argumento;
//    - NINGÚN ERROR TÍPICO COINCIDE CON LA RESPUESTA CORRECTA (en todos los casos y en un barrido de parámetros);
//    - los números de las predicciones de la escena: la respuesta sale del motor y las opciones son distintas.
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
  assert.equal(datos.plantilla, 'exponenciales-logaritmos');
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
const casi = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
const BASES = [2, 3, 4, 5, 10, '1/2', '1/3', '2/3', '3/2'];
const bnum = b => (typeof b === 'string' ? Number(b.split('/')[0]) / Number(b.split('/')[1]) : b);

test('log y potencia son inversas; un logaritmo exacto cumple Nᵈ = bᵐ', () => {
  for (let k = 0; k < N; k++) {
    const b = elegir(BASES), x = ent(-5, 6);
    const p = motor.potencia({ base: b, exp: x });
    cerca(p.valor, Math.pow(bnum(b), x), `${b}^${x}`);
    const L = motor.log({ base: b, N: p.exacto });
    assert.equal(L.valor, x, `log_${b}(${p.exacto})`);
    assert.equal(L.exacto, x < 0 ? `−${-x}` : String(x));
    const Nn = ent(1, 500), l = motor.log({ base: b, N: Nn });
    cerca(Math.pow(bnum(b), l.valor), Nn, `b^(log_b ${Nn})`, 1e-8);
    if (l.exacto && l.exacto.includes('/')) { const [m, d] = l.exacto.replace('−', '-').split('/').map(Number); cerca(Math.pow(Nn, d), Math.pow(bnum(b), m), 'exacto de verdad', 1e-9); }
  }
});
test('propiedades: producto, potencia, cambio de base y un salto más', () => {
  for (let k = 0; k < N; k++) {
    const b = elegir([2, 3, 10, '1/2']), a = ent(1, 300), c = ent(1, 300), n = ent(1, 5);
    const P = motor.logProducto({ base: b, a, b: c }); cerca(P.valor, P.logA + P.logB, 'log(ab)');
    const S = motor.logSuma({ base: b, a, b: c }); cerca(S.valor, Math.log(a + c) / Math.log(bnum(b)), 'log(a + b)');
    const Q = motor.cocienteLogs({ base: b, a, b: c === 1 ? 2 : c }); cerca(Q.valor, Q.cambioDeBase, 'cambio de base');
    const Lp = ent(-4, 6), T = motor.logPotencia({ base: b, logA: Lp, n }); cerca(T.valor, n * Lp, 'n log a');
    const D = motor.potenciaDesplazada({ base: b, valor: a, k: n }); cerca(D.valor, a * Math.pow(bnum(b), n), 'bˣ⁺ᵏ');
  }
});
test('la gráfica: log_b es el reflejo de bˣ en y = x; crece si b > 1 y decrece si 0 < b < 1', () => {
  for (const b of BASES) {
    const G = motor.grafica({ base: b, desde: -3, hasta: 3, n: 60 });
    assert.equal(G.monotonia, bnum(b) > 1 ? 'creciente' : 'decreciente');
    G.exp.forEach(([x, y], i) => { assert.ok(y > 0, 'bˣ > 0'); assert.deepEqual(G.log[i], [y, x]); });
    for (let i = 1; i < G.exp.length; i++) assert.equal(G.exp[i][1] > G.exp[i - 1][1], bnum(b) > 1, `monotonía con base ${b}`);
    const I = motor.inversa({ base: b, x: 2 }); cerca(I.reflejo, [Math.pow(bnum(b), 2), 2], 'reflejo');
  }
});
test('ecuaciones: las soluciones cumplen la ecuación y las extrañas hacen negativo un argumento', () => {
  for (let k = 0; k < N; k++) {
    // b1^(m1 x + c1) = b2^(m2 x + c2) con bases potencias de g
    const g = elegir([2, 3, 5]), p1 = ent(1, 3), p2 = ent(1, 3), E1 = [ent(-3, 3), ent(-4, 4)], E2 = [ent(-3, 3), ent(-4, 4)];
    const B = motor.ecuacionBases({ b1: g ** p1, e1: E1, b2: g ** p2, e2: E2 });
    if (B.soluciones !== 'todos') for (const s of B.soluciones) cerca(p1 * (E1[0] * s.valor + E1[1]), p2 * (E2[0] * s.valor + E2[1]), 'exponentes iguales en base g');
    // cambio de variable con raíces enteras r1, r2 de u
    const r1 = ent(-4, 8), r2 = ent(-4, 8), bs = elegir([2, 3]);
    const C = motor.cambioVariable({ base: bs, b: -(r1 + r2), c: r1 * r2 });
    for (const x of C.soluciones) cerca(Math.pow(bs * bs, x) - (r1 + r2) * Math.pow(bs, x) + r1 * r2, 0, 'cambio de variable', 1e-7);
    assert.equal(C.soluciones.length, [...new Set([r1, r2])].filter(u => u > 0).length);
    // log(x + p) + log(x + q) = v
    const p = ent(-5, 5), q = ent(-5, 5), v = ent(1, 4), lb = elegir([2, 3, 10]);
    const L = motor.ecuacionLog({ base: lb, p, q, valor: v });
    for (const x of L.soluciones) { assert.ok(x + p > 0 && x + q > 0, 'en el dominio'); cerca(Math.log(x + p) / Math.log(lb) + Math.log(x + q) / Math.log(lb), v, 'cumple', 1e-7); }
    for (const x of L.extranas) assert.ok(x + p <= 1e-9 || x + q <= 1e-9, 'una extraña hace negativo un argumento');
    for (const x of L.candidatas) cerca((x + p) * (x + q), lb ** v, 'producto de los argumentos', 1e-7);
  }
});
test('inecuaciones: el conjunto que da el motor cumple la desigualdad en puntos de prueba', () => {
  for (let k = 0; k < N; k++) {
    const b = elegir(BASES), e = ent(-3, 4), s = elegir(['<', '>', '≤', '≥']), cota = motor.potencia({ base: b, exp: e }).exacto;
    const I = motor.inecuacionExp({ base: b, cota, sentido: s });
    const cumple = (x, sg) => { const L = Math.pow(bnum(b), x), R = Math.pow(bnum(b), e); return sg === '<' ? L < R - 1e-12 : sg === '>' ? L > R + 1e-12 : sg === '≤' ? L <= R + 1e-12 : L >= R - 1e-12; };
    for (const x of [e - 1.5, e - 0.5, e + 0.5, e + 1.5]) {
      const dentro = I.sentido === '<' ? x < I.borde : I.sentido === '>' ? x > I.borde : I.sentido === '≤' ? x <= I.borde : x >= I.borde;
      assert.equal(dentro, cumple(x, s), `${b}^x ${s} ${cota}: x = ${x}`);
    }
  }
});
test('crecimiento y decaimiento: cada periodo multiplica por el mismo factor', () => {
  for (let k = 0; k < N; k++) {
    const N0 = ent(1, 50), f = ent(2, 4), t = ent(0, 8), C = motor.crecimiento({ N0, factor: f, t });
    for (let i = 1; i < C.serie.length; i++) cerca(C.serie[i] / C.serie[i - 1], f, 'factor constante');
    cerca(C.valor, N0 * f ** t, 'N0 · fᵗ');
    const T = ent(1, 10), n = ent(0, 6), D = motor.decaimiento({ N0: N0 * 64, vidaMedia: T, t: n * T });
    cerca(D.valor, N0 * 64 / 2 ** n, 'mitades');
    for (let i = 1; i < D.serie.length; i++) cerca(D.serie[i] * 2, D.serie[i - 1], 'la mitad de lo que había');
  }
  const R = motor.compararCrecimiento({ base: 3, grado: 3 }); assert.equal(R.desde, 4); assert.deepEqual(R.empates, [3]);
});

// Regla de las revisiones: ningún error típico puede dar lo mismo que la respuesta correcta.
function mismo(e, r) {
  if (Array.isArray(r.valor) && r.valor.length === 2 && r.punto) return casi(e.valor[0], r.valor[0]) && casi(e.valor[1], r.valor[1]);
  if (r.soluciones !== undefined) {
    const A = (e.soluciones === 'todos' ? 'todos' : e.soluciones.map(s => (typeof s === 'number' ? s : s.valor))), Bs = r.soluciones === 'todos' ? 'todos' : r.soluciones.map(s => (typeof s === 'number' ? s : s.valor));
    if (A === 'todos' || Bs === 'todos') return A === Bs;
    return A.length === Bs.length && A.every((x, i) => casi(x, Bs[i]));
  }
  if (typeof r.valor === 'string') return e.texto === r.texto;
  if (e.valor === null || r.valor === null) return e.valor === r.valor;
  return casi(e.valor, r.valor);
}
function sinChoques(r, que, conTexto) {
  assert.ok(r.errores && Array.isArray(r.coinciden), `${que}: faltan errores o coinciden`);
  for (const [k, e] of Object.entries(r.errores)) {
    assert.ok(!mismo(e, r), `${que}: el error ${k} da lo mismo que la correcta (${r.texto})`);
    if (conTexto) assert.notEqual(e.texto, r.texto, `${que}: el error ${k} se escribe igual que la correcta`);
    assert.ok(/^(AL\d+|EL\d+)$/.test(e.id), `${que}: el error ${k} no tiene id`);
  }
  for (const k of r.coinciden) assert.ok(!(k in r.errores), `${que}: ${k} está en los dos lados`);
}
test('ningún error típico coincide con la respuesta correcta (casos y barrido)', () => {
  for (const c of datos.casos) {
    const r = llamar(c.fn, c.args); if (r.errores) sinChoques(r, c.nombre, true);
    for (const t of c.tambien || []) { const s = llamar(t.fn || c.fn, t.args); if (s.errores) sinChoques(s, c.nombre, true); }
  }
  for (let k = 0; k < N; k++) {
    const b = elegir([2, 3, 5, 10]), a = ent(1, 64), c = ent(1, 64);
    sinChoques(motor.logProducto({ base: b, a, b: c }), `log(${a} · ${c})`);
    sinChoques(motor.logSuma({ base: b, a, b: c }), `log(${a} + ${c})`);
    if (c !== 1) sinChoques(motor.cocienteLogs({ base: b, a, b: c }), `log ${a} / log ${c}`);
    sinChoques(motor.logPotencia({ base: b, logA: ent(-3, 6), n: ent(2, 4) }), 'log(aⁿ)');
    sinChoques(motor.potenciaDesplazada({ base: b, valor: ent(1, 40), k: ent(1, 3) }), 'bˣ⁺ᵏ');
    sinChoques(motor.sumaLogs({ base: b, args: [1, b, ent(1, 40)].slice(0, ent(2, 3)) }), 'log 1 + log b');
    sinChoques(motor.inversa({ base: elegir(BASES), x: ent(-3, 4) }), 'inversa');
    const g = elegir([2, 3]), p1 = ent(1, 3), p2 = ent(1, 3);
    sinChoques(motor.ecuacionBases({ b1: g ** p1, e1: [ent(-3, 3), ent(-4, 4)], b2: g ** p2, e2: [ent(-3, 3), ent(-4, 4)] }), 'ecuación exponencial');
    const r1 = ent(-4, 8), r2 = ent(-4, 8);
    sinChoques(motor.cambioVariable({ base: g, b: -(r1 + r2), c: r1 * r2 }), 'cambio de variable');
    sinChoques(motor.ecuacionLog({ base: elegir([2, 3, 10]), p: ent(-5, 5), q: ent(-5, 5), valor: ent(1, 3) }), 'ecuación logarítmica');
    sinChoques(motor.inecuacionExp({ base: elegir(BASES), cota: motor.potencia({ base: 2, exp: ent(-3, 3) }).exacto, sentido: elegir(['<', '>', '≤', '≥']) }), 'inecuación');
    sinChoques(motor.crecimiento({ N0: ent(1, 20), factor: ent(2, 4), t: ent(0, 10), ref: ent(1, 5) }), 'crecimiento');
    sinChoques(motor.decaimiento({ N0: ent(1, 50) * 16, vidaMedia: ent(1, 10), t: ent(0, 40) }), 'decaimiento');
    sinChoques(motor.compararCrecimiento({ base: ent(2, 4), grado: ent(1, 4) }), 'comparar');
  }
});

// Los números que usa la escena (index.html): respuesta = motor, opciones distintas entre sí y con la misma forma.
const ESCENA = {
  'paso2': () => { const r = motor.logProducto({ base: 2, a: 8, b: 4 }); return [r.texto, r.errores.productoDeLogs.texto, r.errores.precedencia.texto, r.errores.numero.texto]; },
  'paso3': () => { const r = motor.logSuma({ base: 2, a: 8, b: 8 }); return [r.texto, r.errores.sumaDeLogs.texto, r.errores.productoDeLogs.texto, r.errores.numero.texto]; },
  'paso4': () => { const r = motor.cocienteLogs({ base: 2, a: 64, b: 8 }); return [r.texto, r.errores.logDelCociente.texto, r.errores.invertido.texto, r.errores.cociente.texto]; },
  'paso5': () => { const r = motor.inversa({ base: 2, x: 3 }); return [r.texto, r.errores.reciproco.texto, r.errores.reflejoY.texto, r.errores.reflejoX.texto]; },
  'paso6': () => { const r = motor.ecuacionBases({ b1: 4, e1: [1, 1], b2: 2, e2: [3, 0] }); return [r.texto, r.errores.igualaExponentes.texto, r.errores.potenciaComoSuma.texto, r.errores.porBase.texto]; },
  'paso7': () => { const r = motor.cambioVariable({ base: 2, b: -3, c: 2 }); return [r.texto, r.errores.seQuedaEnU.texto, r.errores.descartaUno.texto]; },
  'paso8': () => { const r = motor.ecuacionLog({ base: 2, p: 0, q: -2, valor: 3 }); return [r.texto, r.errores.sinVerificar.texto, r.errores.sumaArgumentos.texto, r.errores.sinElevar.texto]; },
  'paso9': () => { const r = motor.crecimiento({ N0: 1, factor: 2, t: 6, ref: 3 }); return [r.texto, r.errores.cuadratico.texto, r.errores.unPeriodoMenos.texto, r.errores.proporcional.texto]; },
  'un-salto-mas': () => { const r = motor.potenciaDesplazada({ base: 2, valor: 5, k: 1 }); return [r.texto, r.errores.reparte.texto, r.errores.sumaK.texto, r.errores.eleva.texto]; },
  'log-del-cuadrado': () => { const r = motor.logPotencia({ base: 2, logA: 3, n: 2 }); return [r.texto, r.errores.cuadradoDelLog.texto, r.errores.sumaN.texto, r.errores.numero.texto]; },
  'log-de-uno': () => { const r = motor.sumaLogs({ base: 5, args: [1, 5] }); return [r.texto, r.errores.numero.texto, r.errores.logUnoEsUno.texto, r.errores.logBaseCero.texto]; },
  'base-menor-que-uno': () => { const r = motor.inecuacionExp({ base: '1/2', cota: '1/8', sentido: '>' }); return [r.texto, r.errores.sentidoContrario.texto, r.errores.signoPerdido.texto, r.errores.bordeOpuesto.texto]; },
  'vida-media': () => { const r = motor.decaimiento({ N0: 80, vidaMedia: 5, t: 15 }); return [r.valor, r.errores.lineal.valor, r.errores.unaMenos.valor, r.errores.divide.valor].map(v => motor.texto(v, 1)); },
  'potencia-contra-cuadrado': () => { const r = motor.compararCrecimiento({ base: 2, grado: 2 }); return [r.texto, r.errores.ultimoEmpate.texto, r.errores.primerEmpate.texto, r.errores.nunca.texto]; },
};
test('las predicciones de la escena: respuesta del motor, opciones distintas y de la misma forma', () => {
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  for (const [id, f] of Object.entries(ESCENA)) {
    const ops = f();
    assert.equal(new Set(ops).size, ops.length, `${id}: opciones repetidas: ${ops.join(' · ')}`);
    // misma forma: o todas son números, o todas son puntos, o todas empiezan igual ('x …', 'solo x …')
    const forma = t => (/^\(.*;.*\)$/.test(t) ? 'punto' : /^[−\d]/.test(t) ? 'numero' : /^(solo )?x [=<>≤≥]|^x = .* y x = /.test(t) ? 'x' : t === 'ningún x' ? 'x' : 'otro');
    assert.equal(new Set(ops.map(forma)).size, 1, `${id}: opciones de distinta forma: ${ops.join(' · ')}`);
    const largos = ops.map(t => t.length); assert.ok(Math.max(...largos) <= 3 * Math.min(...largos) + 6, `${id}: largos muy distintos: ${ops.join(' · ')}`);
    // la escena usa esa predicción con su id
    assert.ok(html.includes(`'${id}'`) || html.includes(`"${id}"`) || html.includes(`exponenciales-logaritmos-${id}`), `${id}: la escena no la usa`);
  }
});

// 3. Errores de entrada
test('entradas inválidas', () => {
  assert.throws(() => motor.log({ base: 1, N: 5 }), /no puede ser 1/);
  assert.throws(() => motor.log({ base: -2, N: 5 }), /mayor que cero/);
  assert.throws(() => motor.log({ base: 2, N: 0 }), /mayores que cero/);
  assert.throws(() => motor.log({ base: 2, N: -8 }), /mayores que cero/);
  assert.throws(() => motor.log({ base: 'dos', N: 8 }), /fracción/);
  assert.throws(() => motor.regla({ base: 2, desde: 3, hasta: 1 }), /mayor que desde/);
  assert.throws(() => motor.regla({ base: 2, desde: 0, hasta: 2.5 }), /entero/);
  assert.throws(() => motor.cocienteLogs({ base: 2, a: 8, b: 1 }), /vale 0/);
  assert.throws(() => motor.potenciaDesplazada({ base: 2, valor: -3, k: 1 }), /mayor que cero/);
  assert.throws(() => motor.ecuacionBases({ b1: 4, e1: [1, 1], b2: 3, e2: [1, 0] }), /misma base|un mismo número/);
  assert.throws(() => motor.ecuacionBases({ b1: 4, e1: [1], b2: 2, e2: [1, 0] }), /\[m, c\]/);
  assert.throws(() => motor.inecuacionExp({ base: 2, cota: -1, sentido: '>' }), /positiva/);
  assert.throws(() => motor.inecuacionExp({ base: 2, cota: 4, sentido: '=' }), /sentido/);
  assert.throws(() => motor.crecimiento({ N0: 1, factor: 2, t: 2.5 }), /entero/);
  assert.throws(() => motor.decaimiento({ N0: 0, vidaMedia: 5, t: 10 }), /mayor que cero/);
  assert.throws(() => motor.compararCrecimiento({ base: 1, grado: 2 }), /mayor que 1/);
  assert.throws(() => motor.sumaLogs({ base: 2, args: [] }), /lista/);
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
