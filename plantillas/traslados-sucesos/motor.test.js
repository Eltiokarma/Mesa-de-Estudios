// Pruebas del motor de «La posta, el paradero y la plaza». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con números al azar (semilla fija):
//    - las tomas de pastillas son las marcas que cuenta una simulación hora a hora (sin fórmula);
//    - las coincidencias por MCM son las que se hallan recorriendo los minutos con un reloj por combi; la próxima
//      coincidencia es múltiplo de cada intervalo y ningún minuto anterior lo es;
//    - el día del n-ésimo descanso por módulo es el del recorrido día a día (con otra simulación, la de la prueba);
//    - el mínimo de jugadas de las monedas coincide con una búsqueda en anchura (BFS) sobre las disposiciones de un
//      tablero chico, y con una búsqueda hasta una jugada menos que muestra que no alcanza;
//    - la distancia final por Pitágoras es la de las coordenadas sumadas paso a paso; cuatro giros de 90° al mismo lado
//      devuelven el rumbo; un giro y el mismo al otro lado se anulan;
//    - NINGÚN ERROR TÍPICO COINCIDE CON LA RESPUESTA (los que coinciden van en 'coinciden') ni con otro error.
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
  if (esperado === null) { assert.equal(real, null, que); return; }
  if (Array.isArray(esperado)) { assert.ok(Array.isArray(real), `${que}: no es lista`); assert.equal(real.length, esperado.length, `${que}: largo`); esperado.forEach((e, k) => cerca(real[k], e, `${que}[${k}]`, t)); return; }
  if (esperado && typeof esperado === 'object') {
    assert.ok(real && typeof real === 'object', `${que}: no es objeto`);
    assert.deepEqual(Object.keys(real).sort(), Object.keys(esperado).sort(), `${que}: claves`);
    for (const [k, v] of Object.entries(esperado)) cerca(real[k], v, `${que}.${k}`, t);
    return;
  }
  if (typeof esperado !== 'number') { assert.deepEqual(real, esperado, que); return; }
  assert.ok(typeof real === 'number' && Math.abs(real - esperado) <= t * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
function llamar(fn, args) {
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  return motor[fn](...args);
}
const campo = (r, k) => (k === '' ? r : k.split('.').reduce((o, p) => (o == null ? o : o[p]), r));
function comprobar(fn, args, espera, que) {
  const r = llamar(fn, args);
  for (const [k, v] of Object.entries(espera)) {
    const x = campo(r, k);
    assert.ok(x !== undefined, `${que}: falta ${k}`);
    cerca(x, v, `${que} · ${k || fn}`);
  }
}

// 1. casos.json
test('casos.json: formato', () => {
  assert.equal(datos.plantilla, 'traslados-sucesos');
  assert.ok(datos.casos.length >= 16 && datos.casos.length <= 22);
  for (const c of datos.casos) assert.ok(c.nombre && c.fn && Array.isArray(c.args) && c.espera, JSON.stringify(c).slice(0, 80));
  assert.ok(datos.casos.some(c => c.tambien && c.tambien.length), 'algún caso trae «tambien»');
});
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Propiedades
let semilla = 2026;
const rnd = () => (semilla = (Math.imul(semilla, 1664525) + 1013904223) >>> 0) / 4294967296;
const ent = (a, b) => Math.floor(a + (b - a + 1) * rnd());
const casi = (a, b) => (typeof a === 'number' && typeof b === 'number' ? Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b)) : a === b);
function sinChoques(R, correcto, que) {
  assert.ok(R.errores && typeof R.errores === 'object', `${que}: falta errores`);
  assert.ok(Array.isArray(R.coinciden), `${que}: falta coinciden`);
  assert.ok(R.repetidos && typeof R.repetidos === 'object', `${que}: falta repetidos`);
  for (const [k, v] of Object.entries(R.errores)) assert.ok(!casi(v, correcto), `${que}: el error ${k} da la respuesta (${JSON.stringify(v)})`);
  const vs = Object.values(R.errores);
  for (let i = 0; i < vs.length; i++) for (let j = i + 1; j < vs.length; j++) assert.ok(!casi(vs[i], vs[j]), `${que}: dos errores dan lo mismo`);
  for (const k of R.coinciden) assert.ok(!(k in R.errores), `${que}: ${k} coincide y está en errores`);
  for (const [k, antes] of Object.entries(R.repetidos)) { assert.ok(!(k in R.errores), `${que}: ${k} repetido y en errores`); assert.ok(antes in R.errores, `${que}: ${k} repite a ${antes}, que no está`); }
}

test('pastillas: las tomas son las marcas de una simulación hora a hora (con y sin la toma final)', () => {
  for (let i = 0; i < 300; i++) {
    const k = ent(1, 12), t = ent(1, 96), porToma = ent(1, 3), final = rnd() < .7;
    // simulación: un reloj avanza de hora en hora; hay toma al empezar y cada vez que pasan k horas desde la última
    let marcas = 0, desde = 0;
    for (let h = 0; h <= t; h++) {
      if (h === t && !final) break;
      if (h === 0 || desde === k) { marcas++; desde = 0; }
      desde++;
    }
    const R = motor.tomas({ k, t, porToma, final });
    assert.equal(R.tomas, marcas, `k=${k} t=${t} final=${final}`);
    assert.equal(R.pastillas, marcas * porToma);
    assert.equal(R.instantes.length, marcas);
    assert.ok(R.instantes.every((x, j) => x === j * k && x <= t));
    if (final && t % k === 0) assert.equal(R.tomas, t / k + 1, 'con los dos extremos: t/k + 1');
    sinChoques(R, R.respuesta, `tomas k=${k} t=${t}`);
  }
});

// reloj por combi, distinto del de recorrerMinutos: cada combi guarda su próxima salida
function juntasPorReloj(I, a, b) {
  const prox = I.map(() => a), out = [];
  for (let m = a; m <= b; m++) {
    const salen = prox.map(p => p === m);
    if (salen.every(Boolean)) out.push(m);
    salen.forEach((s, j) => { if (s) prox[j] += I[j]; });
  }
  return out;
}
test('combis: las coincidencias por MCM son las que se hallan recorriendo los minutos', () => {
  for (let i = 0; i < 120; i++) {
    const n = rnd() < .7 ? 2 : 3, I = Array.from({ length: n }, () => ent(2, 30));
    const inicio = ent(0, 600), fin = inicio + ent(0, 400);
    const R = motor.vecesCoinciden({ intervalos: I, inicio, fin });
    const reloj = juntasPorReloj(I, inicio, fin);
    assert.deepEqual(R.momentos, reloj, `${I} de ${inicio} a ${fin}`);
    assert.deepEqual(motor.recorrerMinutos({ intervalos: I, inicio, fin }), reloj);
    assert.ok(R.comprobado);
    assert.equal(R.veces, reloj.length);
    sinChoques(R, R.veces, `veces ${I}`);
    const P = motor.proximaCoincidencia({ intervalos: I, inicio });
    assert.ok(I.every(p => P.minutos % p === 0), 'es múltiplo de todos');
    for (let m = 1; m < P.minutos; m++) assert.ok(!I.every(p => m % p === 0), `antes de ${P.minutos} ya coincidían en ${m}`);
    const r2 = juntasPorReloj(I, inicio, inicio + P.minutos);
    assert.deepEqual(r2, [inicio, inicio + P.minutos], 'la siguiente vez juntas por reloj');
    sinChoques(P, P.minutos, `próxima ${I}`);
    for (const [k, v] of Object.entries(P.errores)) assert.equal(P.horas[k], motor.horaTexto(inicio + v));
  }
});

test('turnos: el día por módulo es el del recorrido día a día (otra simulación, con un calendario)', () => {
  const D = motor.DIAS;
  for (let i = 0; i < 200; i++) {
    const ciclo = ent(2, 12), n = ent(1, 40), primero = D[ent(0, 6)];
    // calendario: el día j (desde el primer descanso) es D[(índice + j) mod 7]; descansa si j es múltiplo de ciclo
    const k0 = D.indexOf(primero); let cuenta = 0, dia = null, j = 0;
    for (; ; j++) { if (j % ciclo === 0 && ++cuenta === n) { dia = D[(k0 + j) % 7]; break; } }
    const R = motor.descanso({ ciclo, primero, n });
    assert.equal(R.dia, dia, `ciclo ${ciclo}, ${primero}, n=${n}`);
    assert.equal(R.dias, j);
    const C = motor.recorrerDias({ ciclo, primero, n });
    assert.equal(C.dia, dia); assert.equal(C.dias, j); assert.equal(C.descansos.length, n);
    C.descansos.forEach((d, q) => { assert.equal(d.dia, q * ciclo); assert.equal(d.nombre, motor.diaSemana({ desde: primero, dias: d.dia }).dia); });
    sinChoques(R, R.dia, `turno ${ciclo} ${n}`);
  }
});

// BFS sobre disposiciones de monedas en un tablero chico de la red triangular
const clave = p => p[0] + ',' + p[1];
function tablero(filas, margen) {
  const out = [];
  for (let v = -margen; v < filas + margen; v++) for (let u = -margen - filas; u < filas + margen; u++) {
    const x = u + v / 2;
    if (x >= -margen && x <= filas - 1 + margen) out.push([u, v]);
  }
  return out;
}
const firma = pos => pos.map(clave).sort().join(';');
function normal(pos) {   // la figura sin importar dónde está: corrida para que su menor punto quede en (0, 0)
  const m = pos.map(p => p.slice()).sort((a, b) => a[1] - b[1] || a[0] - b[0])[0];
  return firma(pos.map(p => [p[0] - m[0], p[1] - m[1]]));
}
function bfs(inicio, metaNormal, puntos, tope) {
  let capa = [inicio], vistos = new Set([firma(inicio)]);
  for (let d = 0; d <= tope; d++) {
    for (const pos of capa) if (normal(pos) === metaNormal) return d;
    const sig = [];
    for (const pos of capa) {
      const ocup = new Set(pos.map(clave));
      for (let i = 0; i < pos.length; i++) for (const q of puntos) {
        if (ocup.has(clave(q))) continue;
        const nueva = pos.slice(); nueva[i] = q;
        const f = firma(nueva); if (vistos.has(f)) continue;
        vistos.add(f); sig.push(nueva);
      }
    }
    capa = sig;
  }
  return null;   // no llega en 'tope' jugadas
}
test('monedas: el mínimo por la regla coincide con una búsqueda en anchura', () => {
  for (const filas of [2, 3]) {
    const R = motor.monedasTriangulo({ filas }), P = tablero(filas, 1);
    const meta = normal(motor.triangulo(filas, true));
    assert.equal(bfs(R.inicio, meta, P, R.minimo + 1), R.minimo, `triángulo de ${filas} filas`);
    sinChoques(R, R.minimo, `monedas ${filas}`);
  }
  // 10 monedas: búsqueda hasta 2 jugadas en un tablero con margen 1: no se llega; y la solución del motor llega en 3
  const R = motor.monedasTriangulo({ filas: 4 }), P = tablero(4, 1);
  assert.equal(bfs(R.inicio, normal(motor.triangulo(4, true)), P, 2), null, 'con 2 jugadas no alcanza');
  const fin = R.inicio.map(p => { const j = R.mover.findIndex(q => clave(q) === clave(p)); return j >= 0 ? R.a[j] : p; });
  assert.ok(motor.revisarMonedas(fin, 4).llego, 'moviendo las del motor se llega');
  assert.equal(R.mover.length, R.minimo);
  sinChoques(R, R.minimo, 'monedas 4');
  // el reto del paso 7: con la fila de 4 del invertido a la altura de la moneda de arriba (v = 3) hacen falta 4
  let mejor = 0;
  for (let du = -8; du <= 8; du++) { const meta = motor.triangulo(4, true).map(p => [p[0] + du, p[1]]); mejor = Math.max(mejor, meta.filter(q => R.inicio.some(p => clave(p) === clave(q))).length); }
  assert.equal(10 - mejor, 4, 'reto del paso 7');
  // desempate de la traslación: con 6 monedas hay dos de peso 1; gana la de menor dv
  assert.deepEqual(motor.minMovimientos(motor.triangulo(3), motor.triangulo(3, true)).traslado, [0, -1]);
  // la regla para triángulos más grandes: ⌊monedas/3⌋ jugadas
  for (let f = 2; f <= 7; f++) { const T = motor.monedasTriangulo({ filas: f }); assert.equal(T.minimo, Math.floor(T.monedas / 3)); sinChoques(T, T.minimo, `f=${f}`); }
  // revisarMonedas: corrido a cualquier lugar sigue siendo la meta; una moneda fuera de lugar deja faltan = 1
  for (let i = 0; i < 20; i++) {
    const du = ent(-5, 5), dv = ent(-5, 5), m = motor.triangulo(4, true).map(p => [p[0] + du, p[1] + dv]);
    assert.ok(motor.revisarMonedas(m, 4).llego);
    const otra = m.slice(); otra[ent(0, 9)] = [40, 40];
    assert.equal(motor.revisarMonedas(otra, 4).faltan, 1);
  }
});

test('plano: la distancia por Pitágoras es la de las coordenadas paso a paso; giros que vuelven', () => {
  const R4 = ['N', 'E', 'S', 'O'], d = { N: [0, 1], E: [1, 0], S: [0, -1], O: [-1, 0] };
  for (let i = 0; i < 200; i++) {
    const tramos = Array.from({ length: ent(1, 6) }, () => [R4[ent(0, 3)], ent(0, 12)]);
    let x = 0, y = 0; for (const [r, c] of tramos) for (let k = 0; k < c; k++) { x += d[r][0]; y += d[r][1]; }
    const R = motor.recorrido(tramos);
    assert.equal(R.x, x); assert.equal(R.y, y);
    assert.ok(Math.abs(R.distancia - Math.hypot(x, y)) < 1e-12);
    assert.deepEqual(R.puntos[R.puntos.length - 1], [x, y]);
    // el exacto vale lo mismo que la distancia
    const m = R.exacto.match(/^(\d*)√(\d+)$/), val = m ? (m[1] ? +m[1] : 1) * Math.sqrt(+m[2]) : +R.exacto;
    assert.ok(Math.abs(val - R.distancia) < 1e-9, R.exacto);
    sinChoques(R, R.distancia, 'recorrido');
  }
  for (const r of R4) for (const lado of ['D', 'I']) {
    let q = r; for (let k = 0; k < 4; k++) q = motor.girar(q, lado, 90);
    assert.equal(q, r, 'cuatro giros de 90° devuelven el rumbo');
    assert.equal(motor.girar(motor.girar(r, lado, 90), lado === 'D' ? 'I' : 'D', 90), r);
    assert.equal(motor.girar(r, 'D', 270), motor.girar(r, 'I', 90));
    assert.equal(motor.girar(r, lado, 360), r);
  }
  for (let i = 0; i < 100; i++) {
    const g = Array.from({ length: ent(1, 6) }, () => [rnd() < .5 ? 'D' : 'I', 90 * ent(1, 4)]);
    const G = motor.giros({ inicio: 'N', giros: g });
    const neto = g.reduce((s, [l, a]) => s + (l === 'D' ? a : -a), 0);
    assert.equal(G.final, motor.girar('N', 'D', ((neto % 360) + 360) % 360));
    sinChoques(G, G.nombre, 'giros');
    const pasos = []; for (let k = 0; k < ent(1, 5); k++) { pasos.push(['avanza', ent(0, 9)]); pasos.push([rnd() < .5 ? 'D' : 'I']); }
    pasos.push(['avanza', ent(1, 9)]);
    const C = motor.caminarConGiros({ inicio: R4[ent(0, 3)], pasos });
    sinChoques(C, C.respuesta, 'caminar');
  }
});

test('las predicciones de la escena tienen errores distintos de la respuesta', () => {
  const E = motor.escena;
  sinChoques(motor.tomas(E.pastillas), 9, 'paso 1');
  sinChoques(motor.proximaCoincidencia(E.combis), 48, 'paso 3');
  sinChoques(motor.vecesCoinciden(E.combis), 6, 'paso 4');
  sinChoques(motor.descanso(E.turno), 'sábado', 'paso 5');
  sinChoques(motor.monedasTriangulo(E.monedas), 3, 'paso 6');
  sinChoques(motor.recorrido(E.plaza), 13, 'paso 8');
  sinChoques(motor.tomas(E.dosPastillas), 20, 'exp 1');
  sinChoques(motor.proximaCoincidencia(E.tresCombis), 120, 'exp 2');
  sinChoques(motor.giros(E.guardia), 'este', 'exp 3');
  sinChoques(motor.monedasTriangulo(E.seisMonedas), 2, 'exp 4');
  sinChoques(motor.caminarConGiros(E.pileta), '10 cuadras hacia el sureste', 'exp 5');
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.tomas({ k: 0, t: 4 }), /mayor que cero/);
  assert.throws(() => motor.tomas({ k: 1.5, t: 4 }), /entero/);
  assert.throws(() => motor.tomas(), /objeto/);
  assert.throws(() => motor.proximaCoincidencia({ intervalos: [12] }), /al menos 2/);
  assert.throws(() => motor.vecesCoinciden({ intervalos: [12, 18], inicio: 400, fin: 300 }), /antes/);
  assert.throws(() => motor.descanso({ ciclo: 6, primero: 'Lunes', n: 3 }), /lunes/);
  assert.throws(() => motor.minMovimientos([[0, 0]], [[0, 0], [1, 0]]), /mismas/);
  assert.throws(() => motor.monedasTriangulo({ filas: 1 }), /al menos 2/);
  assert.throws(() => motor.recorrido([['X', 3]]), /'N'/);
  assert.throws(() => motor.girar('N', 'D', 45), /múltiplo de 90/);
  assert.throws(() => motor.girar('N', 'arriba', 90), /lado/);
  assert.throws(() => motor.caminarConGiros({ inicio: 'N', pasos: [['salta', 2]] }), /avanza/);
  assert.throws(() => motor.horaTexto(-5), /negativo/);
});

// 4. papel.json
const papel = JSON.parse(fs.readFileSync(path.join(__dirname, 'papel.json'), 'utf8'));
test('papel.json: formato', () => {
  assert.ok(papel.titulo && papel.problemas.length >= 8 && papel.problemas.length <= 10);
  for (const p of papel.problemas) assert.ok(p.id && p.enunciado && p.respuesta && p.pasos.length && p.verificar.length, p.id);
});
for (const p of papel.problemas) test(`papel ${p.id}`, () => {
  for (const v of p.verificar) comprobar(v.fn, v.args, v.espera, p.id);
});
