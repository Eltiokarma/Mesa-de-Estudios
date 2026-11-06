// Pruebas del motor de «La barra que se parte». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con números al azar (semilla fija): las operaciones con fracciones coinciden con la cuenta en
//    coma flotante y dan fracciones irreducibles; la división larga y la generatriz son inversas; la regla de los
//    factores 2 y 5 decide el tipo de decimal; MCD·MCM = a·b, Euclides y descomposición coinciden; el trozo de las
//    cintas divide a las dos y ninguno más largo lo hace; los buses no coinciden antes del MCM; la media ponderada
//    queda entre los valores y la de ida y vuelta es la armónica. Y lo más importante para la escena: ningún error
//    típico da la respuesta correcta.
// 3. Errores de entrada.
// 4. Cada problema de papel.json coincide con el motor.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const M = require('./motor.js');

const datos = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));
const esFr = x => x && typeof x === 'object' && !Array.isArray(x) && Object.keys(x).length === 2 && 'n' in x && 'd' in x;
// Una fracción esperada se compara como valor, salvo en los campos que se muestran tal cual (sin reducir).
function cerca(real, esperado, que, literal) {
  if (Array.isArray(esperado)) { assert.ok(Array.isArray(real), `${que}: no es lista`); assert.equal(real.length, esperado.length, `${que}: largo`); esperado.forEach((e, k) => cerca(real[k], e, `${que}[${k}]`, literal)); return; }
  if (esFr(esperado)) {
    assert.ok(esFr(real), `${que}: no es una fracción`);
    if (literal) assert.deepEqual({ n: real.n, d: real.d }, esperado, `${que}: el motor da ${real.n}/${real.d}`);
    else assert.equal(real.n * esperado.d, esperado.n * real.d, `${que}: el motor da ${real.n}/${real.d}, se esperaba ${esperado.n}/${esperado.d}`);
    return;
  }
  if (typeof esperado !== 'number') { assert.deepEqual(real, esperado, que); return; }
  assert.ok(Math.abs(real - esperado) <= 1e-9 * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
function llamar(fn, args) { assert.equal(typeof M[fn], 'function', `motor.${fn} no existe`); return M[fn](...args); }
const campo = (r, k) => (k === 'valor' && (typeof r !== 'object' || r === null) ? r : k.split('.').reduce((o, p) => (o == null ? o : o[p]), r));
function comprobar(fn, args, espera, que) {
  const r = llamar(fn, args);
  for (const [k, v] of Object.entries(espera)) {
    const x = campo(r, k);
    assert.ok(x !== undefined, `${que}: falta ${k}`);
    cerca(x, v, `${que} · ${k}`, /sinSimplificar|errores/.test(k));
  }
}

// 1. casos.json
test('casos.json: formato', () => {
  assert.equal(datos.plantilla, 'fracciones');
  assert.ok(datos.casos.length >= 15 && datos.casos.length <= 20);
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera, JSON.stringify(c).slice(0, 80));
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Propiedades
let semilla = 2026;
const rnd = () => (semilla = (Math.imul(semilla, 1664525) + 1013904223) >>> 0) / 4294967296;
const ent = (a, b) => a + Math.floor((b - a + 1) * rnd());
const N = 500;
const v = f => f.n / f.d;
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const casi = (a, b, que) => assert.ok(Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b)), `${que}: ${a} contra ${b}`);
const irreducible = (f, que) => { assert.ok(f.d > 0, `${que}: denominador positivo`); assert.equal(gcd(f.n, f.d) || 1, f.n === 0 ? f.d : 1, `${que}: irreducible`); };
const fAzar = (pos) => [ent(pos ? 1 : -9, 12), ent(1, 12)];
// Ningún error típico coincide con la respuesta correcta (ni entre sí): si coincidiera, la escena tendría dos opciones
// iguales o una «incorrecta» que es la correcta.
function erroresDistintos(r, correcta, eq, que) {
  const vals = Object.values(r.errores);
  for (const [k, e] of Object.entries(r.errores)) assert.ok(!eq(e, correcta), `${que}: el error ${k} da la respuesta correcta`);
  for (let i = 0; i < vals.length; i++) for (let j = i + 1; j < vals.length; j++) assert.ok(!eq(vals[i], vals[j]), `${que}: dos errores dan lo mismo`);
}
const eqF = (a, b) => a.n * b.d === b.n * a.d, eqN = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a)), eqS = (a, b) => a === b;

test('fracciones: las cuatro operaciones coinciden con la cuenta decimal y dan irreducibles; ningún error da lo correcto', () => {
  for (let k = 0; k < N; k++) {
    const a = fAzar(), b = fAzar(true);
    const s = M.sumar(a, b), r = M.restar(a, b), p = M.multiplicar(a, b), d = M.dividir(a, b);
    casi(v(s.resultado), a[0] / a[1] + b[0] / b[1], 'suma'); casi(v(r.resultado), a[0] / a[1] - b[0] / b[1], 'resta');
    casi(v(p.resultado), (a[0] / a[1]) * (b[0] / b[1]), 'producto'); casi(v(d.resultado), (a[0] / a[1]) / (b[0] / b[1]), 'cociente');
    [s, r, p, d].forEach((x, j) => irreducible(x.resultado, `op ${j}`));
    // el denominador común es el MCM de los denominadores, y las fracciones ampliadas valen lo mismo
    assert.equal(s.comun, M.mcm([M.fr(a[0], a[1]).d, M.fr(b[0], b[1]).d]).valor);
    casi(s.na / s.comun, a[0] / a[1], 'ampliada a'); casi(s.nb / s.comun, b[0] / b[1], 'ampliada b');
    for (const [x, que] of [[s, 'suma'], [r, 'resta'], [p, 'producto'], [d, 'cociente']]) erroresDistintos(x, x.resultado, eqF, que);
    // la división deshace la multiplicación
    assert.ok(M.igual(M.multiplicar(d.resultado, b).resultado, M.fr(a[0], a[1])));
    // comparar: el signo coincide con la resta
    const c = M.comparar(a, b); assert.equal(c.signo, Math.sign(r.resultado.n));
    if (c.errores.denominadorMayor) assert.notEqual(c.errores.denominadorMayor, c.mayor);
    // simplificar: la forma reducida vale lo mismo y el factor es el MCD
    const m = ent(1, 9), q = M.simplificar(a[0] * m, a[1] * m); casi(q.n / q.d, a[0] / a[1], 'simplificar'); assert.equal(q.factor % m, 0);
  }
});
test('fracción de fracción, la parte que falta y «de lo que queda»', () => {
  for (let k = 0; k < N; k++) {
    const a = fAzar(true), b = fAzar(true), T = ent(1, 500);
    const f = M.fraccionDe([a, b], T); casi(v(f.resultado), T * a[0] / a[1] * b[0] / b[1], 'de'); erroresDistintos(f, f.resultado, eqF, 'de');
    const pa = [ent(1, 5), ent(6, 12)], pb = [ent(1, 5), ent(6, 12)];
    const q = M.parteQueFalta([pa, pb]); casi(v(q.resultado) + v(q.gastado), 1, 'falta + gastado'); erroresDistintos(q, q.resultado, eqF, 'falta');
    const l = M.deLoQueQueda([pa, pb], T); casi(v(l.resultado), T * (1 - pa[0] / pa[1]) * (1 - pb[0] / pb[1]), 'queda'); erroresDistintos(l, l.resultado, eqF, 'queda');
    const pt = M.partes(M.fr(a[0], a[1])); assert.equal(pt.llenos.reduce((s, x) => s + x, 0), pt.trozos);
    // el cuchillo: encajan todas exactamente cuando N es múltiplo del MCM, y la suma es la de sumar()
    const Nc = ent(1, 60), cu = M.cuchillo([a, b], Nc), mm = M.mcm([M.fr(a[0], a[1]).d, M.fr(b[0], b[1]).d]).valor;
    assert.equal(cu.todas, Nc % mm === 0); assert.equal(cu.mcm, mm);
    if (cu.todas) assert.ok(M.igual(cu.suma, M.sumar(a, b).resultado));
    cu.fracciones.forEach(c => assert.ok(c.coinciden <= c.cortes && (!c.encaja || c.coinciden === c.cortes)));
    const c2 = M.cortar(ent(1, 99), ent(1, 30)); assert.ok(c2.sobra >= 0 && c2.justo === (c2.sobra === 0));
  }
});
test('decimales: la división larga y la generatriz son inversas; el tipo lo deciden los factores 2 y 5', () => {
  for (let k = 0; k < N; k++) {
    const n = ent(0, 300), d = ent(1, 120), dec = M.decimal([n, d]);
    assert.equal(dec.tipo, dec.regla === 'entero' ? 'exacto' : dec.regla, `${n}/${d}: tipo`);
    const g = M.generatriz(dec.texto); assert.ok(M.igual(g.resultado, M.fr(n, d)), `${n}/${d} → ${dec.texto} → ${g.texto}`);
    irreducible(g.resultado, 'generatriz');
    erroresDistintos(g, g.resultado, eqF, `generatriz ${dec.texto}`);
    casi(Number(M.cifras([n, d], 8).replace(',', '.')), Math.floor(n / d * 1e8 + 1e-7) / 1e8, 'cifras');
  }
  // un periodo que no es el más corto también da la misma fracción
  assert.ok(M.igual(M.generatriz('0,(33)').resultado, M.fr(1, 3)));
  assert.ok(M.igual(M.generatriz('0,1(66)').resultado, M.fr(1, 6)));
});
test('comparar decimales: el mayor es el de mayor valor y la regla «más largo es mayor» lo contradice cuando se elige', () => {
  for (let k = 0; k < N; k++) {
    const x = `${ent(0, 2)},${String(ent(0, 999)).padStart(ent(1, 3), '0')}`, y = `${ent(0, 2)},${String(ent(0, 99)).padStart(ent(1, 2), '0')}`;
    const c = M.compararDecimales(x, y), [a, b] = c.valores;
    assert.equal(c.mayor, a > b ? 'a' : a < b ? 'b' : 'iguales', `${x} contra ${y}`);
    erroresDistintos(c, c.mayor, eqS, `${x} contra ${y}`);
    const [ua, ub] = c.alineados; assert.equal(ua.length, ub.length);
  }
  const l = M.lupa(0.37, 1); assert.ok(l.desde <= 0.37 && 0.37 < l.hasta);
});
test('MCD y MCM: MCD·MCM = a·b; Euclides y descomposición coinciden; los dos dividen y son múltiplos', () => {
  for (let k = 0; k < N; k++) {
    const a = ent(1, 400), b = ent(1, 400), g = M.mcd([a, b]), m = M.mcm([a, b]);
    assert.equal(g.valor * m.valor, a * b);
    assert.equal(M.euclides(a, b).valor, g.valor); assert.equal(m.porEuclides, m.valor);
    assert.equal(a % g.valor, 0); assert.equal(b % g.valor, 0); assert.equal(m.valor % a, 0); assert.equal(m.valor % b, 0);
    assert.equal(M.factores(a).reduce((s, [p, e]) => s * p ** e, 1), a);
    // cintas: el trozo divide a las dos y ningún trozo más largo lo hace
    const c = M.cintas(a, b);
    assert.equal(c.trozo * c.trozosA, a); assert.equal(c.trozo * c.trozosB, b);
    for (let t = c.trozo + 1; t <= Math.min(a, b); t++) assert.ok(a % t || b % t, `${t} también cabe en ${a} y ${b}`);
    erroresDistintos(c, c.trozo, eqS, `cintas ${a}, ${b}`);
    // buses: antes del MCM no salen juntos
    const z = M.coinciden(a, b);
    for (let t = 1; t < z.minutos; t++) assert.ok(t % a || t % b, `salen juntos a los ${t}`);
    erroresDistintos(z, z.minutos, eqS, `buses ${a}, ${b}`);
  }
  const t = M.mcm([4, 6, 10]); assert.equal(t.valor, 60); assert.equal(M.mcd([12, 18, 30]).valor, 6);
});
test('promedios: la ponderada queda entre los valores; la de ida y vuelta es la armónica y nunca pasa la simple', () => {
  for (let k = 0; k < N; k++) {
    const x1 = ent(0, 20), x2 = ent(0, 20), p1 = ent(1, 40), p2 = ent(1, 40);
    const w = M.ponderado([x1, x2], [p1, p2]);
    assert.ok(w.media >= Math.min(x1, x2) - 1e-9 && w.media <= Math.max(x1, x2) + 1e-9);
    casi(w.media, (x1 * p1 + x2 * p2) / (p1 + p2), 'ponderada'); erroresDistintos(w, w.media, eqN, 'ponderada');
    if (p1 === p2) casi(w.media, (x1 + x2) / 2, 'pesos iguales');
    assert.ok(Math.abs(M.momento([x1, x2], [p1, p2], w.media)) < 1e-6, 'el balancín queda derecho en la media');
    if (x1 !== x2) assert.ok(M.momento([x1, x2], [p1, p2], w.media + 0.5) < 0 && M.momento([x1, x2], [p1, p2], w.media - 0.5) > 0);
    const d = ent(1, 300), v1 = ent(1, 120), v2 = ent(1, 120), iv = M.idaVuelta(d, v1, v2);
    casi(iv.media, iv.distancia / iv.tiempo, 'distancia entre tiempo'); casi(iv.media, M.armonico([v1, v2]), 'armónica');
    assert.ok(iv.media <= (v1 + v2) / 2 + 1e-9); erroresDistintos(iv, iv.media, eqN, 'ida y vuelta');
    const t = iv.tiempo * rnd(), pos = M.posicionViaje(d, v1, v2, t); assert.ok(pos.x >= -1e-9 && pos.x <= d + 1e-9);
    casi(M.posicionViaje(d, v1, v2, iv.t1).x, d, 'llega al final de la ida');
  }
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => M.fr(1, 0), /cero/);
  assert.throws(() => M.fr(1.5, 2), /entero/);
  assert.throws(() => M.sumar('1/2', [1, 3]), /debe ser/);
  assert.throws(() => M.dividir([1, 2], [0, 3]), /invertir/);
  assert.throws(() => M.generatriz('0,2(3'), /no entiendo/);
  assert.throws(() => M.generatriz(0.25), /texto/);
  assert.throws(() => M.compararDecimales('0,(3)', '0,3'), /exactos/);
  assert.throws(() => M.mcd([12]), /al menos dos/);
  assert.throws(() => M.mcm([12, 0]), /mayor que cero/);
  assert.throws(() => M.cintas(24, 2.5), /entero/);
  assert.throws(() => M.ponderado([1, 2], [1]), /mismo largo/);
  assert.throws(() => M.idaVuelta(10, 0, 5), /mayor que cero/);
  assert.throws(() => M.partes([1, 2], 5), /múltiplo/);
  assert.throws(() => M.lupa(0.3, -1), /nivel/);
  assert.throws(() => M.cuchillo([[1, 2]], 0), /mayor que cero/);
  assert.throws(() => M.momento([1, 2], [1], 1), /mismo largo/);
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
    assert.ok(!/<[a-z]/i.test([p.enunciado, p.respuesta, ...p.pasos].join(' ')), `${p.id}: la app muestra texto plano, sin HTML`);
    assert.ok(!/\d\.\d/.test([p.enunciado, p.respuesta, ...p.pasos].join(' ')), `${p.id}: se escribe con coma decimal`);
  }
});
for (const p of (papel && papel.problemas) || []) test(`papel ${p.id}: la respuesta coincide con el motor`, () => {
  for (const x of p.verificar) comprobar(x.fn, x.args, x.espera, p.id);
});
