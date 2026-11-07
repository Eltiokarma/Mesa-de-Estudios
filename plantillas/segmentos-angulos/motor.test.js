// Pruebas del motor de «La escuadra y las paralelas». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con datos al azar (semilla fija): en la recta, AC + BD = AD + BC y MN = (AC + BD)/2 por
//    coordenadas; BM = |AB − BC|/2; las cadenas de complementos y suplementos son lineales (el suplemento del
//    complemento de x es 90 + x); los ocho ángulos medidos con vectores no cambian al girar el dibujo, y con
//    paralelas los alternos, correspondientes y opuestos son iguales y los conjugados suman 180°; sin paralelas,
//    solo siguen valiendo los opuestos y los adyacentes (GE17); dos rectas con alternos internos distintos se
//    cortan donde dice la ley de senos; las bisectrices de consecutivos forman la semisuma; en un serrucho la
//    diferencia entre las dos sumas es un múltiplo de 180° y es 0 cuando los quiebres apuntan hacia afuera.
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
  assert.ok(typeof real === 'number' && Math.abs(real - esperado) <= t * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
function llamar(fn, args) {
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  return motor[fn](...args);
}
const campo = (r, k) => (k === 'valor' && (r === null || typeof r !== 'object') ? r : k.split('.').reduce((o, p) => (o == null ? o : o[p]), r));
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
  assert.equal(datos.plantilla, 'segmentos-angulos');
  assert.ok(datos.casos.length >= 15 && datos.casos.length <= 25);
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
const N = 400;

test('en la recta: AC + BD = AD + BC, y M, N medios de AB y CD dan MN = (AC + BD)/2 = (AD + BC)/2', () => {
  for (let k = 0; k < N; k++) {
    const a = al(-20, 20), b = a + al(0.5, 10), c = b + al(0.5, 10), d = c + al(0.5, 10);
    const r = motor.recta({ D: d, B: b, A: a, C: c });
    assert.equal(r.consecutivos, 'ABCD');
    const s = r.segmentos;
    cerca(s.AC + s.BD, s.AD + s.BC, 'AC + BD = AD + BC');
    const sol = motor.solapados({ AC: s.AC, BD: s.BD, AD: s.AD });
    cerca(sol.BC, s.BC, 'BC'); cerca(sol.AB, s.AB, 'AB'); cerca(sol.CD, s.CD, 'CD');
    const m = motor.mediosEnRecta({ A: a, B: b, C: c, D: d });
    cerca(m.MN, motor.puntosMedios({ AC: s.AC, BD: s.BD }).MN, 'MN por AC + BD');
    cerca(m.MN, motor.puntosMedios({ AD: s.AD, BC: s.BC }).MN, 'MN por AD + BC');
    cerca(r.medio('A', 'B'), m.M, 'M');
  }
});
test('A, B, C consecutivos y M medio de AC: BM = |AB − BC|/2 por coordenadas', () => {
  for (let k = 0; k < N; k++) {
    const a = al(-10, 10), b = a + al(0.5, 15), c = b + al(0.5, 15), M = (a + c) / 2;
    const r = motor.medioYDiferencia({ AB: b - a, BC: c - b });
    cerca(r.BM, Math.abs(b - M), 'BM'); cerca(r.AM, M - a, 'AM');
    assert.equal(r.mEnLado, M < b ? 'AB' : M > b ? 'BC' : 'coincide con B');
  }
});
test('moverEnRecta no deja que un punto pase a su vecino', () => {
  let p = { A: 0, B: 6, C: 14, D: 24 };
  p = motor.moverEnRecta(p, 'B', 30, { sep: 1 }); assert.equal(p.B, 13);
  p = motor.moverEnRecta(p, 'C', -5, { sep: 1 }); assert.equal(p.C, 14);
  p = motor.moverEnRecta(p, 'D', 99, { sep: 1, max: 30 }); assert.equal(p.D, 30);
  p = motor.moverEnRecta(p, 'A', 7.3, { sep: 1, paso: 0.5 }); assert.equal(p.A, 7.5);
  for (let k = 0; k < N; k++) {
    const n = ['A', 'B', 'C', 'D'][ent(0, 3)];
    p = motor.moverEnRecta(p, n, al(-40, 70), { sep: 1, min: -10, max: 40, paso: 0.5 });
    assert.equal(motor.recta(p).consecutivos, 'ABCD');
  }
});
test('complemento y suplemento: suman 90 y 180; las cadenas son lineales; «suplemento del complemento» = 90 + x', () => {
  for (let k = 0; k < N; k++) {
    const x = al(0.5, 89.5), g = motor.angulo(x);
    cerca(g.complemento + x, 90, 'C + x'); cerca(g.suplemento + x, 180, 'S + x');
    assert.equal(g.clase, 'agudo');
    cerca(motor.cadena(['suplemento', 'complemento'], x).valor, 90 + x, 'SC');
    cerca(motor.cadena(['complemento', 'complemento'], x).valor, x, 'CC');
    const y = al(90.5, 179.5);
    assert.equal(motor.angulo(y).complemento, null);
    cerca(motor.cadena(['complemento', 'suplemento'], y).valor, y - 90, 'CS');
    cerca(motor.cadena(['suplemento', 'suplemento'], y).valor, y, 'SS');
    // cualquier cadena que exista coincide con su fórmula lineal
    const ops = Array.from({ length: ent(1, 4) }, () => (rnd() < 0.5 ? 'complemento' : 'suplemento'));
    const z = al(1, 179), c = motor.cadena(ops, z), L = motor.lineal(ops);
    if (c.existe) cerca(c.valor, L.a * z + L.b, `cadena ${ops.join(' ')}`);
  }
});
test('resolverAngulo: la x hallada cumple la ecuación', () => {
  for (let k = 0; k < N; k++) {
    const x = ent(5, 85), k1 = ent(2, 4);
    const der = motor.cadena(['suplemento', 'complemento'], x).valor;   // 90 + x
    const r = motor.resolverAngulo([{ ops: ['suplemento', 'complemento'] }], [{ k: k1, ops: [] }, { valor: der - k1 * x }]);
    cerca(r.x, x, 'x');
  }
});
test('los ocho ángulos: girar todo el dibujo no cambia nada; con paralelas, cada par cumple su relación', () => {
  for (let k = 0; k < N; k++) {
    const phi = al(2, 178), g = al(-360, 360);
    const base = motor.paralelas(phi).angulos, girado = motor.ochoAngulos(g, g + 180 * ent(0, 1), g + phi).angulos;
    cerca(girado, base, 'girado', 1e-8);
    for (const tipo of ['alternos internos', 'alternos externos', 'correspondientes', 'conjugados internos', 'conjugados externos', 'opuestos por el vértice', 'adyacentes']) {
      const p = motor.par(tipo);
      for (const [i, j] of p.pares) {
        const a = base[i - 1], b = base[j - 1];
        if (p.relacion === 'iguales') cerca(a, b, `${tipo} ${i}-${j}`, 1e-9); else cerca(a + b, 180, `${tipo} ${i}-${j}`, 1e-9);
      }
    }
    cerca(base.reduce((s, v) => s + v, 0), 720, 'dos vueltas');
  }
});
test('GE17: sin paralelas, los alternos internos ya no son iguales; los opuestos y adyacentes siguen valiendo', () => {
  for (let k = 0; k < N; k++) {
    const phi = al(30, 150), t = al(-15, 15) || 3;
    if (Math.abs(t) < 0.5) continue;
    const o = motor.ochoAngulos(0, t, phi), a = o.angulos;
    assert.equal(o.paralelas, false);
    cerca(Math.abs(a[2] - a[5]), Math.abs(t), 'alternos internos difieren en lo que se inclina L2', 1e-8);
    for (const [i, j] of motor.par('opuestos por el vértice').pares) cerca(a[i - 1], a[j - 1], 'opuestos');
    for (const [i, j] of motor.par('adyacentes').pares) cerca(a[i - 1] + a[j - 1], 180, 'adyacentes');
  }
});
test('ecuacionPar: la x cumple la relación y la otra relación (GE17) da otra x', () => {
  for (let k = 0; k < N; k++) {
    const x = ent(5, 40), ang = ent(20, 160), a1 = ent(1, 5), a2 = ent(1, 5);
    if (a1 === a2) continue;
    const b1 = ang - a1 * x, b2 = ang - a2 * x;
    const r = motor.ecuacionPar('alternos internos', [a1, b1], [a2, b2]);
    cerca(r.x, x, 'x'); cerca(r.angulos, [ang, ang], 'ángulos');
    const s = motor.ecuacionPar('conjugados internos', [a1, ang - a1 * x], [a2, 180 - ang - a2 * x]);
    cerca(s.x, x, 'x conjugados'); cerca(s.angulos[0] + s.angulos[1], 180, 'suman 180');
  }
});
test('dos rectas con alternos internos distintos se cortan: R está en las dos rectas y PR sale por la ley de senos', () => {
  for (let k = 0; k < N; k++) {
    const a1 = al(20, 160), a2 = a1 + (rnd() < 0.5 ? -1 : 1) * al(1, 15), d = al(1, 10);
    if (!(a2 > 5 && a2 < 175)) continue;
    const r = motor.noParalelas(a1, a2, d), { P, Q, R, dirL2 } = r.coordenadas;
    cerca(R.y, 0, 'R en L1');
    const dirQR = Math.atan2(R.y - Q.y, R.x - Q.x) * 180 / Math.PI;
    cerca(Math.abs(Math.sin((dirQR - dirL2) * Math.PI / 180)), 0, 'R en L2', 1e-8);
    cerca(Math.hypot(R.x - P.x, R.y - P.y), r.PR, 'PR', 1e-7); cerca(Math.hypot(R.x - Q.x, R.y - Q.y), r.QR, 'QR', 1e-7);
    cerca(r.sumaTriangulo, 180, 'suma');
    assert.equal(r.lado, R.x > 0 ? 'derecha' : 'izquierda');
    const o = motor.ochoAngulos(0, dirL2, a1);
    cerca(o.angulos[2], a1, 'ángulo 3'); cerca(o.angulos[5], a2, 'ángulo 6');
  }
  assert.equal(motor.noParalelas(70, 70, 3).paralelas, true);
});
test('bisectrices de consecutivos: forman la semisuma, medida con rayos; si suman 180°, son perpendiculares', () => {
  for (let k = 0; k < N; k++) {
    const a = al(1, 170), b = al(1, 179 - a);
    const r = motor.bisectrices(a, b);
    cerca(r.entre, (a + b) / 2, 'semisuma'); cerca(r.porRayos, r.entre, 'por rayos', 1e-8);
    cerca(motor.bisectrices(a, 180 - a).entre, 90, 'par lineal');
  }
});
test('serrucho: la diferencia entre las dos sumas siempre es un múltiplo de 180°', () => {
  let vistos = 0;
  for (let k = 0; k < N * 5; k++) {
    const n = ent(1, 4), pts = [{ x: al(0, 10), y: 10 }];
    const ys = Array.from({ length: n }, () => al(0.5, 9.5)).sort((p, q) => q - p);
    for (let i = 0; i < n; i++) pts.push({ x: al(-5, 15), y: ys[i] });
    pts.push({ x: al(0, 10), y: 0 });
    let s; try { s = motor.serrucho(pts, { arriba: 10, abajo: 0 }); } catch (e) { continue; }
    if (s.angulos.some(a => a.abre === 'ninguno')) continue;
    vistos++;
    cerca(s.vueltas, Math.round(s.vueltas), 'vueltas enteras', 1e-7);
  }
  assert.ok(vistos > N);
});
test('serrucho: con la flecha hacia afuera, el quiebre es la suma de los dos de las paralelas (y al construirla con alfa y beta vuelven)', () => {
  for (let k = 0; k < N; k++) {
    const A = { x: al(-5, 5), y: 10 }, B = { x: al(-5, 5), y: 0 }, P = { x: Math.max(A.x, B.x) + al(0.3, 12), y: al(0.5, 9.5) };
    const izq = rnd() < 0.5, f = q => (izq ? { x: -q.x, y: q.y } : q);
    const s = motor.serrucho([f(A), f(P), f(B)]);
    assert.ok(s.cumple, 'cumple'); cerca(s.angulos[1].medida, s.angulos[0].medida + s.angulos[2].medida, 'P = A + B', 1e-8);
    assert.equal(s.angulos[1].abre, izq ? 'derecha' : 'izquierda');
    const alfa = al(5, 85), beta = al(5, 85), c = motor.construirQuiebre(alfa, beta, { yP: al(1, 9) });
    const t = motor.serrucho([c.A, c.P, c.B]);
    cerca(t.angulos[0].medida, alfa, 'alfa', 1e-8); cerca(t.angulos[2].medida, beta, 'beta', 1e-8);
    cerca(t.angulos[1].medida, motor.quiebre(alfa, beta).angulo, 'quiebre', 1e-8);
  }
});
test('serrucho armado con ángulos (como en el papel p9): las dos sumas son iguales', () => {
  // 25° en A, 40° en P1, 55° en P2, 80° en P3 y 40° en B (papel p9)
  const q = motor.construirQuebrada({ x: 0, y: 10 }, [{ dir: -25, largo: 5 }, { dir: -165, largo: 4 }, { dir: -40, largo: 4 }, { dir: -140 }], 0);
  const s = motor.serrucho(q, { arriba: 10, abajo: 0 });
  cerca(s.angulos.map(a => a.medida), [25, 40, 55, 80, 40], 'ángulos', 1e-8);
  assert.ok(s.cumple); cerca(s.sumaDerecha, 120, 'derecha');
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.recta({ A: 0 }), /al menos dos/);
  assert.throws(() => motor.recta({ A: 0, B: 0 }), /coinciden/);
  assert.throws(() => motor.solapados({ AC: 10, BD: 10, AD: 30 }), /consecutivos/);
  assert.throws(() => motor.puntosMedios({}), /AC y BD/);
  assert.throws(() => motor.cadena(['tangente'], 30), /desconocida/);
  assert.throws(() => motor.resolverLineal(2, 1, 2, 3), /no tiene solución/);
  assert.throws(() => motor.paralelas(0), /cortar/);
  assert.throws(() => motor.ochoAngulos(0, 0, 180), /paralela/);
  assert.throws(() => motor.par('vecinos'), /desconocido/);
  assert.throws(() => motor.ecuacionPar('alternos internos', [1, 200], [2, 0]), /entre 0° y 180°/);
  assert.throws(() => motor.serrucho([{ x: 0, y: 10 }, { x: 3, y: 12 }, { x: 0, y: 0 }]), /entre las paralelas/);
  assert.throws(() => motor.serrucho([{ x: 0, y: 10 }, { x: 3, y: 4 }, { x: 5, y: 6 }, { x: 0, y: 0 }]), /bajar/);
  assert.throws(() => motor.bisectrices(-5, 20), /positivos/);
  assert.throws(() => motor.angulo('30'), /número/);
  assert.throws(() => motor.direccion({ x: 1, y: 1 }, { x: 1, y: 1 }), /dirección/);
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
