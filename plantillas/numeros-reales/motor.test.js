// Pruebas del motor de «La recta en trozos». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con conjuntos al azar (semilla fija), comprobadas punto por punto en racionales de prueba
//    (los extremos, sus vecinos y puntos intermedios):
//    - el conjunto normalizado está ordenado, sus trozos no se tocan ni se enciman y tiene los mismos puntos;
//    - x ∈ A ∪ B ⇔ x ∈ A o x ∈ B; ∩ con «y»; A − B, A′ y A Δ B igual;
//    - |x − a| op r y |a·x + b| op c coinciden con la cuenta en cada punto;
//    - imagen: f(x) cae en el resultado para cada x de A, y cada punto del resultado tiene un x de A que llega;
//    - signos, cadena, x² op c y 1/x op c coinciden con la cuenta en cada punto que no es crítico;
//    - entre: el promedio y el irracional quedan estrictamente entre p y q; siguiente: cada candidato tiene otro antes;
//    - cotas: el supremo es cota superior y nada menor lo es; máximo solo si está en el conjunto;
//    - operación por fórmula: conmutativa, asociativa, neutro e inverso, contra la cuenta con números al azar;
//    - NINGÚN ERROR TÍPICO COINCIDE CON LA RESPUESTA CORRECTA (los que coinciden van en 'coinciden').
// 3. Errores de entrada.
// 4. Cada problema de papel.json coincide con el motor.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const motor = require('./motor.js');

const datos = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));
const papel = JSON.parse(fs.readFileSync(path.join(__dirname, 'papel.json'), 'utf8'));
function cerca(real, esperado, que, tol) {
  const t = tol === undefined ? 1e-9 : tol;
  if (Array.isArray(esperado)) { assert.ok(Array.isArray(real), `${que}: se esperaba una lista`); assert.equal(real.length, esperado.length, `${que}: largo`); esperado.forEach((e, k) => cerca(real[k], e, `${que}[${k}]`, t)); return; }
  if (typeof esperado !== 'number') { assert.deepEqual(real, esperado, que); return; }
  assert.ok(typeof real === 'number' && Math.abs(real - esperado) <= t * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
const campo = (r, k) => k.split('.').reduce((o, p) => (o == null ? o : o[p]), r);
function comprobar(fn, args, espera, que) {
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  const r = motor[fn](...args);
  for (const [k, v] of Object.entries(espera)) {
    const x = campo(r, k);
    assert.ok(x !== undefined, `${que}: falta ${k}`);
    cerca(x, v, `${que} · ${k}`);
  }
}
function sinCoincidir(r, que) {
  for (const [k, e] of Object.entries(r.errores || {})) assert.notEqual(e.texto, r.texto, `${que}: el error ${k} da lo mismo que la respuesta`);
  const t = Object.values(r.errores || {}).map(e => e.texto);
  assert.equal(new Set(t).size, t.length, `${que}: dos errores dan lo mismo y no están en 'repetidos'`);
}

// 1. casos.json
test('casos.json: formato', () => {
  assert.equal(datos.plantilla, 'numeros-reales');
  assert.ok(datos.casos.length >= 15 && datos.casos.length <= 25);
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
// Un intervalo al azar en texto, con extremos enteros o medios, a veces infinitos
function extremo() { const v = ent(-12, 12) / (rnd() < .3 ? 2 : 1); return v; }
const tx = v => motor.textoNumero(v);
function intervaloAzar() {
  let a = extremo(), b = extremo(); if (a > b) [a, b] = [b, a];
  const infA = rnd() < .12, infB = rnd() < .12;
  const ca = !infA && rnd() < .5, cb = !infB && rnd() < .5;
  if (a === b && !(ca && cb)) b = a + 1;
  return `${ca ? '[' : '⟨'}${infA ? '−∞' : tx(a)}; ${infB ? '+∞' : tx(b)}${cb ? ']' : '⟩'}`;
}
function conjuntoAzar() { const n = ent(1, 3), L = []; for (let i = 0; i < n; i++) L.push(intervaloAzar()); return L.join(' ∪ '); }
// Puntos de prueba: cada extremo, ±1/4 y ±1/1000 a su lado, y algunos más
// Los puntos van como fracciones exactas { n, d } (el motor no adivina decimales largos); en las cuentas, como n/d.
function frac(v) { for (let d = 1; d <= 5000; d++) { const n = Math.round(v * d); if (Math.abs(n / d - v) < 1e-12) return { n, d }; } throw new Error(`${v} sin fracción corta`); }
const mcdT = (a, b) => (b ? mcdT(b, a % b) : Math.abs(a));
function mas(f, p, q) { const n = f.n * q + p * f.d, d = f.d * q, g = mcdT(n, d) || 1; return { n: n / g, d: d / g, valueOf() { return this.n / this.d; }, toString() { return `${this.n}/${this.d}`; } }; }
function prueba(...Xs) {
  const P = new Map();
  const poner = f => P.set(`${f.n}/${f.d}`, mas(f, 0, 1));
  [0, 100, -100].forEach(v => poner({ n: v, d: 1 })); poner({ n: 1, d: 2 });
  for (const X of Xs) for (const I of motor.conjunto(X).intervalos) for (const v of [I.a, I.b]) if (Number.isFinite(v)) {
    const f = frac(v); [[0, 1], [1, 4], [-1, 4], [1, 1000], [-1, 1000]].forEach(([p, q]) => P.set(`${f.n}/${f.d}+${p}/${q}`, mas(f, p, q)));
  }
  return [...P.values()];
}
const en = (X, x) => motor.contiene(X, typeof x === 'number' ? frac(x) : { n: x.n, d: x.d });
const OPS = ['<', '<=', '>', '>='];
const comparar = (v, op, c) => (op === '<' ? v < c - 1e-12 : op === '<=' ? v <= c + 1e-12 : op === '>' ? v > c + 1e-12 : v >= c - 1e-12);

test('conjunto: ordenado, sin trozos que se toquen y con los mismos puntos que la lista de entrada', () => {
  for (let k = 0; k < N; k++) {
    const partes = [intervaloAzar(), intervaloAzar(), intervaloAzar()], C = motor.conjunto(partes);
    const L = C.intervalos;
    for (let i = 1; i < L.length; i++) {
      assert.ok(L[i - 1].b <= L[i].a, `${C.texto}: desordenado`);
      if (L[i - 1].b === L[i].a) assert.ok(!L[i - 1].cb && !L[i].ca, `${C.texto}: dos trozos que se tocan sin juntarse`);
    }
    for (const x of prueba(...partes)) assert.equal(en(C.texto, x), partes.some(p => en(p, x)), `${C.texto} en ${x}`);
    assert.equal(motor.conjunto(C.texto).texto, C.texto, 'el texto se vuelve a leer igual');
  }
});

test('operar: unión, intersección, diferencia, complemento y diferencia simétrica, punto por punto', () => {
  const reglas = { union: (a, b) => a || b, interseccion: (a, b) => a && b, diferencia: (a, b) => a && !b, complemento: a => !a, simetrica: (a, b) => a !== b };
  for (let k = 0; k < N; k++) {
    const A = conjuntoAzar(), B = conjuntoAzar();
    for (const op of Object.keys(reglas)) {
      const R = motor.operar({ A, B, op });
      for (const x of prueba(A, B)) assert.equal(en(R.texto, x), reglas[op](en(A, x), en(B, x)), `${A} ${op} ${B} = ${R.texto}, en ${x}`);
      sinCoincidir(R, `${A} ${op} ${B}`);
    }
  }
});

test('absoluto: |x − a| op r y |a·x + b| op c coinciden con la cuenta', () => {
  for (let k = 0; k < N; k++) {
    const a = ent(-8, 8), r = ent(-2, 8), op = OPS[ent(0, 3)], R = motor.absoluto({ a, op, r });
    for (const x of prueba(R.texto).concat([a, a + r, a - r].map(v => mas(frac(v), 0, 1)))) assert.equal(en(R.texto, x), comparar(Math.abs(x - a), op, r), `|x − ${a}| ${op} ${r} = ${R.texto}, en ${x}`);
    sinCoincidir(R, R.inecuacion);
    const A = ent(-4, 4) || 1, b = ent(-6, 6), c = ent(-2, 9), L = motor.absolutoLineal({ a: A, b, op, c });
    for (const x of prueba(L.texto)) assert.equal(en(L.texto, x), comparar(Math.abs(A * x + b), op, c), `${L.inecuacion} = ${L.texto}, en ${x}`);
    sinCoincidir(L, L.inecuacion);
  }
});

test('imagen: f(x) cae en el resultado y cada punto del resultado viene de algún x del intervalo', () => {
  const tipos = [{ tipo: 'afin', k: 0, t: 0 }, 'cuadrado', 'inverso', 'absoluto'];
  let partidos = 0;
  for (let k = 0; k < N; k++) {
    const A = intervaloAzar(), t0 = tipos[ent(0, 3)];
    const f = typeof t0 === 'string' ? t0 : { tipo: 'afin', k: (ent(-3, 3) || 2) / (rnd() < .3 ? 2 : 1), t: ent(-5, 5) };
    const g = typeof f === 'string' ? { cuadrado: x => x * x, inverso: x => 1 / x, absoluto: x => Math.abs(x) }[f] : x => f.k * x + f.t;
    const R = motor.imagen({ A, f });
    if (f === 'inverso' && R.intervalos.length === 2) partidos++;
    for (const x of prueba(A)) if (en(A, x) && !(f === 'inverso' && +x === 0)) {
      const y = g(+x);
      // con decimales de prueba la cuenta en coma flotante puede no ser exacta: se comprueba con el valor exacto si es corto
      assert.ok(R.intervalos.some(I => (y > I.a - 1e-9) && (y < I.b + 1e-9)), `${A} → ${R.expresion}: ${x} da ${y}, fuera de ${R.texto}`);
    }
    // cada y del resultado (lejos de los extremos) tiene una preimagen en A
    const pre = typeof f === 'string' ? { cuadrado: y => [Math.sqrt(y), -Math.sqrt(y)], inverso: y => [1 / y], absoluto: y => [y, -y] }[f] : y => [(y - f.t) / f.k];
    const AA = motor.conjunto(A).intervalos;
    const dentroA = x => AA.some(I => x > I.a + 1e-7 && x < I.b - 1e-7);
    for (const I of R.intervalos) {
      const lo = Number.isFinite(I.a) ? I.a : (Number.isFinite(I.b) ? I.b - 50 : -50), hi = Number.isFinite(I.b) ? I.b : lo + 50;
      if (hi - lo < 1e-6) continue;
      for (const s of [.1, .37, .5, .81, .97]) {
        const y = lo + s * (hi - lo);
        if (f === 'inverso' && Math.abs(y) < 1e-9) continue;
        assert.ok(pre(y).some(dentroA) || pre(y).some(x => AA.some(I => x >= I.a - 1e-9 && x <= I.b + 1e-9)), `${A} → ${R.expresion} = ${R.texto}: ${y} no viene de A`);
      }
    }
    sinCoincidir(R, `${A} → ${R.expresion}`);
  }
  assert.ok(partidos > 5, `muestra: ${partidos} imágenes de 1/x partidas en dos`);
});

test('signos, cadena, x² op c y 1/x op c coinciden con la cuenta', () => {
  for (let k = 0; k < N; k++) {
    const op = OPS[ent(0, 3)];
    const num = [], den = [];
    for (let i = 0; i < ent(1, 3); i++) num.push([ent(-3, 3) || 1, ent(-6, 6)]);
    for (let i = 0; i < ent(0, 2); i++) den.push([ent(-3, 3) || 1, ent(-6, 6)]);
    const S = motor.signos({ num, den, op });
    const val = x => num.reduce((p, [a, b]) => p * (a * x + b), 1) / den.reduce((p, [a, b]) => p * (a * x + b), 1);
    const crit = num.concat(den).map(([a, b]) => -b / a);
    for (let j = 0; j < 40; j++) { const x = ent(-80, 80) / 8 + 1 / 16; if (crit.some(c => Math.abs(c - x) < 1e-9)) continue; assert.equal(en(S.texto, x), comparar(val(x), op, 0), `signos ${JSON.stringify(num)}/${JSON.stringify(den)} ${op} 0 = ${S.texto}, en ${x}`); }
    for (const [a, b] of den) assert.equal(en(S.texto, -b / a), false, 'un cero del denominador nunca entra');
    const lo = ent(-9, 3), hi = lo + ent(0, 9), a = ent(-3, 3) || 2, b = ent(-5, 5), oL = ['<', '<='][ent(0, 1)], oH = ['<', '<='][ent(0, 1)];
    const C = motor.cadena({ lo, opLo: oL, a, b, opHi: oH, hi });
    for (const x of prueba(C.texto)) assert.equal(en(C.texto, x), comparar(a * x + b, oL === '<' ? '>' : '>=', lo) && comparar(a * x + b, oH, hi), `cadena ${lo} ${oL} ${a}x + ${b} ${oH} ${hi} = ${C.texto}, en ${x}`);
    sinCoincidir(C, 'cadena');
    const c2 = [0, 1, 4, 9, 1 / 4, 25][ent(0, 5)] * (rnd() < .2 ? -1 : 1), Q = motor.cuadradoDesigualdad({ op, c: c2 });
    for (const x of prueba(Q.texto)) assert.equal(en(Q.texto, x), comparar(x * x, op, c2), `x² ${op} ${c2} = ${Q.texto}, en ${x}`);
    const c3 = ent(-4, 4) / (rnd() < .3 ? 2 : 1), I = motor.inversa({ op, c: c3 });
    for (const x of prueba(I.texto)) if (+x !== 0) assert.equal(en(I.texto, x), comparar(1 / x, op, c3), `1/x ${op} ${c3} = ${I.texto}, en ${x}`);
    assert.equal(en(I.texto, 0), false);
    sinCoincidir(I, I.inecuacion); sinCoincidir(Q, Q.inecuacion);
  }
});

test('densidad: entre p y q siempre hay un racional y un irracional; ningún candidato a «siguiente» lo es', () => {
  for (let k = 0; k < N; k++) {
    const p = ent(-200, 200) / 100, q = p + ent(1, 300) / 1000;
    const E = motor.entre({ p, q, n: 5 });
    assert.ok(p < E.promedio && E.promedio < q);
    assert.ok(p < E.irracional.valor && E.irracional.valor < q, `${E.irracional.texto} entre ${p} y ${q}`);
    E.racionalesValor.forEach((v, i) => { assert.ok(p < v && v < q); if (i) assert.ok(v > E.racionalesValor[i - 1]); });
    const S = motor.siguiente({ x: p });
    for (const e of Object.values(S.errores)) if (e.contraejemplo) { const c = Number(e.contraejemplo.replace(',', '.').replace('−', '-')); assert.ok(p < c && c < e.valor, `${e.contraejemplo} entre ${p} y ${e.texto}`); }
  }
  for (let n = 1; n <= 9; n++) { const A = motor.aproximar({ entero: 0, periodo: '9', n }); cerca(A.hueco, Math.pow(10, -n), `hueco con ${n} nueves`); }
});

test('cotas: el supremo es la menor cota superior; el máximo existe solo si está en el conjunto', () => {
  for (let k = 0; k < N; k++) {
    const A = conjuntoAzar(), K = motor.cotas({ A });
    const xs = prueba(A).filter(x => en(A, x)).map(Number);
    if (K.supremo !== null) {
      assert.ok(xs.every(x => x <= K.supremo + 1e-12), `${A}: ${K.supremoTexto} no es cota`);
      assert.ok(xs.some(x => x > K.supremo - .01), `${A}: hay cotas menores que ${K.supremoTexto}`);
      assert.equal(K.maximo !== null, en(A, K.supremo));
    } else assert.equal(K.maximo, null);
    if (K.infimo !== null) assert.equal(K.minimo !== null, en(A, K.infimo));
    sinCoincidir(K, A);
  }
});

test('operación por fórmula: propiedades, neutro e inverso contra la cuenta', () => {
  for (let k = 0; k < N; k++) {
    const o = { alfa: ent(-2, 2), beta: ent(-2, 2), gamma: [0, 0, 1, -1][ent(0, 3)], delta: ent(-4, 4) };
    const P = motor.operacionFormula(o), op = (a, b) => o.alfa * a + o.beta * b + o.gamma * a * b + o.delta;
    const vs = [-3, -1, 0, 1, 2, 5, 1 / 2];
    let conm = true, asoc = true;
    for (const a of vs) for (const b of vs) { if (Math.abs(op(a, b) - op(b, a)) > 1e-9) conm = false; for (const c of vs) if (Math.abs(op(op(a, b), c) - op(a, op(b, c))) > 1e-9) asoc = false; }
    assert.equal(P.conmutativa, conm, P.texto); assert.equal(P.asociativa, asoc, P.texto);
    if (P.neutro !== null) for (const a of vs) { cerca(op(a, P.neutro), a, `${P.texto}: a ∗ e`); cerca(op(P.neutro, a), a, `${P.texto}: e ∗ a`); }
    if (P.neutro !== null) {
      const x = ent(-5, 5), Q = motor.operacionFormula(Object.assign({ x }, o));
      if (Q.inverso !== null) { cerca(op(x, Q.inverso), P.neutro, `${P.texto}: inverso de ${x}`); sinCoincidir(Object.assign({ texto: Q.inversoTexto }, Q), P.texto); }
    }
  }
});

test('operación por tabla: el neutro cumple por los dos lados y cada inverso devuelve el neutro', () => {
  for (let k = 0; k < 100; k++) {
    const n = ent(2, 4), E = Array.from({ length: n }, (_, i) => String(i));
    const s = ent(0, n - 1);   // a ∗ b = (a + b + s) mod n, o una tabla al azar
    const T = rnd() < .5 ? E.map(a => E.map(b => String((+a + +b + s) % n))) : E.map(() => E.map(() => String(ent(0, n - 1))));
    const P = motor.operacionTabla({ elementos: E, tabla: T });
    const op = (a, b) => T[+a][+b];
    if (P.neutro !== null) for (const x of E) { assert.equal(op(P.neutro, x), x); assert.equal(op(x, P.neutro), x); }
    for (const [x, y] of Object.entries(P.inversos)) if (y !== null) { assert.equal(op(x, y), P.neutro); assert.equal(op(y, x), P.neutro); }
    sinCoincidir(P, 'tabla');
  }
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.conjunto('[1; 2; 3]'), /dos extremos/);
  assert.throws(() => motor.conjunto('{1; 2'), /no entiendo|extremo|punto/);
  assert.throws(() => motor.conjunto('[+∞; 2⟩'), /infinitos al revés/);
  assert.throws(() => motor.conjunto('[a; 2]'), /no entiendo/);
  assert.throws(() => motor.operar({ A: '[1; 2]', B: '[0; 1]', op: 'mezcla' }), /op debe ser/);
  assert.throws(() => motor.absoluto({ a: 1, op: '=', r: 2 }), /signo/);
  assert.throws(() => motor.imagen({ A: '[1; 2] ∪ [3; 4]', f: 'cuadrado' }), /un solo intervalo/);
  assert.throws(() => motor.imagen({ A: '[1; 2]', f: 'seno' }), /no conozco/);
  assert.throws(() => motor.imagen({ A: '[1; 2]', f: { tipo: 'afin', k: 0 } }), /k no puede ser 0/);
  assert.throws(() => motor.entre({ p: 1, q: 1 }), /el mismo número/);
  assert.throws(() => motor.cuadradoDesigualdad({ op: '<', c: 2 }), /cuadrado de un racional/);
  assert.throws(() => motor.cadena({ lo: 1, opLo: '>', a: 1, hi: 3 }), /cadena/);
  assert.throws(() => motor.operacionTabla({ elementos: [1, 2], tabla: [[1, 2]] }), /cuadrada/);
  assert.throws(() => motor.generatriz({ periodo: 'x' }), /cifras/);
  assert.throws(() => motor.pertenece({ A: '[1; 2]', x: Infinity }), /finito/);
});

// 4. papel.json
test('papel.json: formato y cantidad', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 8 && papel.problemas.length <= 10);
  for (const p of papel.problemas) assert.ok(p.id && p.nivel && p.enunciado && p.respuesta && p.pasos.length >= 2 && p.verificar.length >= 1, p.id);
});
for (const p of papel.problemas) test(`papel ${p.id}: ${p.respuesta}`, () => {
  for (const v of p.verificar) comprobar(v.fn, v.args, v.espera, p.id);
});
