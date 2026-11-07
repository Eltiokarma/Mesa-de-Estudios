// Pruebas del motor de «El reloj y el calendario». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con números al azar (semilla fija):
//    - el ángulo es el menor entre las dos agujas: coincide con la diferencia de sus posiciones y nunca pasa de 180°;
//    - cada hora que da horaConAngulo forma de verdad ese ángulo, y no se pierde ninguna (barrido fino);
//    - las coincidencias caen cada 720/11 min (superpuestas y opuestas) y forman el ángulo pedido;
//    - un reloj que se adelanta acumula 720 min justo al volver a la hora correcta; horaMarcada y horaReal se deshacen;
//    - campanadas: el tiempo es (m − 1) intervalos, y campanadasEn lo deshace;
//    - calendario: el ciclo de 400 años tiene 97 bisiestos y 146 097 días (un número exacto de semanas);
//      el día de la semana avanza el resto de dividir los días entre 7; los conteos de un mes suman sus días;
//    - NINGÚN ERROR TÍPICO COINCIDE CON LA RESPUESTA (los que coinciden van en 'coinciden' y sí dan lo mismo).
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
  if (esperado && typeof esperado === 'object') { assert.ok(real && typeof real === 'object', `${que}: no es objeto`); for (const [k, v] of Object.entries(esperado)) cerca(real[k], v, `${que}.${k}`, t); return; }
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
  assert.equal(datos.plantilla, 'relojes-calendarios');
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
const ent = (a, b) => Math.floor(a + (b - a + 1) * rnd());
const N = 400;
const casi = (a, b) => {
  if (typeof a === 'number' && typeof b === 'number') return Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
  if (a && b && typeof a === 'object' && 'M' in a) return casi(a.M, b.M);
  return JSON.stringify(a) === JSON.stringify(b);
};
function sinChoques(errores, coinciden, correcto, que, recalcular) {
  assert.ok(errores && typeof errores === 'object', `${que}: falta errores`);
  for (const [k, v] of Object.entries(errores)) assert.ok(!casi(v, correcto), `${que}: el error ${k} da la respuesta (${JSON.stringify(v)})`);
  if (recalcular) for (const k of coinciden) assert.ok(casi(recalcular[k], correcto), `${que}: ${k} se apartó sin coincidir`);
}
const menorDe = x => { const y = ((x % 360) + 360) % 360; return Math.min(y, 360 - y); };

test('ángulo: es el menor entre las dos agujas, nunca pasa de 180° y coincide con sus posiciones', () => {
  for (let k = 0; k < N; k++) {
    const H = ent(0, 12), M = ent(0, 59 * 11) / 11;
    const A = motor.angulo({ H, M }), P = motor.posiciones({ H, M });
    assert.ok(A.menor >= 0 && A.menor <= 180 + 1e-9);
    cerca(A.menor + A.mayor, 360, 'menor + mayor');
    cerca(A.menor, menorDe(P.minutero - P.horario), 'diferencia de posiciones');
    cerca(P.horario, ((30 * H + M / 2) % 360), 'el horario avanza medio grado por minuto');
    // un minuto después, el minutero le saca 5,5° más al horario
    if (M + 1 < 60) cerca(menorDe(motor.posiciones({ H, M: M + 1 }).minutero - motor.posiciones({ H, M: M + 1 }).horario - (P.minutero - P.horario)), 5.5, 'el minutero gana 5,5° por minuto');
    const G = motor.agujas(60 * H + M);
    assert.equal(G.H, H % 12); cerca(G.M, M, 'agujas: minutos'); cerca(G.menor, A.menor, 'agujas: ángulo');
    sinChoques(A.errores, A.coinciden, A.menor, `ángulo ${H}:${M}`, { horarioQuieto: menorDe(30 * H - 6 * M), noMenor: A.mayor, signoCambiado: menorDe(30 * H + 5.5 * M) });
  }
});
test('horaConAngulo: cada solución forma el ángulo pedido y un barrido fino no encuentra otras', () => {
  for (let k = 0; k < 150; k++) {
    const H = ent(0, 11), alfa = ent(0, 360) / 2;
    const R = motor.horaConAngulo({ H, alfa });
    for (const s of R.soluciones) {
      cerca(motor.angulo({ H, M: s.M }).menor, alfa, `${H} h ${s.M} min`);
      cerca(s.fraccion.num / s.fraccion.den, s.M, 'la fracción es el número');
      cerca(s.fraccion.entero * s.fraccion.den + s.fraccion.resto, s.fraccion.num, 'número mixto');
    }
    // barrido: donde el ángulo cruza alfa tiene que haber una solución cerca
    let ant = motor.angulo({ H, M: 0 }).menor - alfa;
    for (let j = 1; j < 6000; j++) {
      const M = j / 100, d = motor.angulo({ H, M }).menor - alfa;
      if (ant * d < 0) assert.ok(R.soluciones.some(s => Math.abs(s.M - M) < 0.02), `falta una solución cerca de ${H} h ${M} min para ${alfa}°`);
      ant = d;
    }
    if (R.primera) sinChoques(R.errores, R.coinciden, R.primera, `hora con ${alfa}° a las ${H}`);
    // con el horario quieto, la «solución» cae en un múltiplo de 5 min si se superponen
    if (alfa === 0 && R.errores.horarioQuieto) cerca(R.errores.horarioQuieto.M % 5, 0, 'horario quieto');
  }
});
test('coincidencias: cada 720/11 min (o la mitad, en ángulo recto), con el ángulo pedido; 11 por cada 12 h', () => {
  for (const tipo of ['superpuestas', 'opuestas', 'rectas']) for (const horas of [1, 3, 6, 12, 24, 36]) {
    const C = motor.coincidencias({ horas, tipo }), alfa = { superpuestas: 0, opuestas: 180, rectas: 90 }[tipo];
    for (const t of C.instantes) {
      const H = Math.floor(t / 60 + 1e-9) % 12, M = t - 60 * Math.floor(t / 60 + 1e-9);
      cerca(motor.angulo({ H, M: M < 60 ? M : 0 }).menor, alfa, `${tipo} en ${t}`);
      assert.ok(t >= 0 && t < horas * 60);
    }
    if (horas % 12 === 0) assert.equal(C.veces, (tipo === 'rectas' ? 22 : 11) * horas / 12);
    if (tipo !== 'rectas') for (let j = 1; j < C.instantes.length; j++) cerca(C.instantes[j] - C.instantes[j - 1], 720 / 11, 'separación');
    sinChoques(C.errores, C.coinciden, C.veces, `${tipo} en ${horas} h`);
  }
});
test('adelantos: acumula 720 min al volver a la hora correcta; horaMarcada y horaReal se deshacen; dos relojes', () => {
  for (let k = 0; k < N; k++) {
    const a = ent(1, 12), cada = [1, 2, 3, 4, 6, 12, 24][ent(0, 6)];
    const V = motor.vuelveHoraCorrecta({ a, cada });
    cerca(V.horas / cada * a, 720, 'acumula 12 h'); cerca(V.dias * 24, V.horas, 'días');
    sinChoques(V.errores, V.coinciden, V.horas, 'vuelve');
    // al cabo de V.horas, el reloj marca lo mismo que la hora real (mod 12 h)
    const X = motor.horaMarcada({ inicio: 0, transcurrido: V.horas, a, cada, tipo: 'adelanta' });
    cerca(((X.marcada - X.real) % 720 + 720) % 720, 0, 'marca la hora correcta');
    for (const tipo of ['adelanta', 'atrasa']) {
      const inicio = ent(0, 23) * 60, T = ent(1, 20);
      const Mk = motor.horaMarcada({ inicio, transcurrido: T, a, cada, tipo });
      cerca(Mk.desfase, a * T / cada, 'desfase');
      sinChoques(Mk.errores, Mk.coinciden, Mk.marcada, 'hora marcada');
      if (Mk.desfase < 600 && 60 * T + (tipo === 'adelanta' ? 1 : -1) * Mk.desfase < 1440) {
        const R = motor.horaReal({ inicio, marcada: Mk.marcada, a, cada, tipo });
        cerca(R.real, Mk.real, `de vuelta a la hora real (${tipo})`); cerca(R.transcurrido, T, 'tiempo');
        sinChoques(R.errores, R.coinciden, R.real, 'hora real');
      }
    }
    const b = ent(1, 12), D = motor.dosRelojes({ a, b, cada });
    cerca(D.horas * D.rapidez / cada, 720, 'la diferencia llega a 12 h');
    sinChoques(D.errores, D.coinciden, D.horas, 'dos relojes');
    if (a !== b) { const S = motor.dosRelojes({ a, b, cada, mismoSentido: true }); assert.ok(S.horas > D.horas, 'en el mismo sentido se separan más despacio'); }
  }
});
test('campanadas: el tiempo es (m − 1) intervalos; contarlas en un tiempo lo deshace; la proporción siempre falla', () => {
  for (let k = 0; k < N; k++) {
    const n = ent(2, 12), i = ent(1, 6), t = i * (n - 1), m = ent(2, 24);
    const C = motor.campanadas({ n, t, m });
    cerca(C.tiempo, (m - 1) * i, 'tiempo'); cerca(C.intervalo, i, 'intervalo');
    sinChoques(C.errores, C.coinciden, C.tiempo, 'campanadas', { proporcional: m * t / n, intervalosComoCampanadas: m * i });
    const E = motor.campanadasEn({ n, t, T: C.tiempo });
    assert.equal(E.campanadas, m, 'de vuelta');
    sinChoques(E.errores, E.coinciden, E.campanadas, 'campanadas en', { proporcional: n * C.tiempo / t });
    // con m = n la proporción da lo mismo (coincide): no se ofrece
    if (m === n) assert.ok(C.coinciden.includes('proporcional'));
  }
});
test('calendario: el ciclo de 400 años; el día de la semana avanza el resto; los meses', () => {
  const B = motor.bisiestos({ desde: 1601, hasta: 2000 });
  assert.equal(B.cuantos, 97);
  assert.equal(motor.diasEntre({ a: 1601, m: 1, d: 1 }, { a: 2001, m: 1, d: 1 }), 146097);
  assert.equal(146097 % 7, 0);
  assert.equal(motor.esBisiesto(1900), false); assert.equal(motor.esBisiesto(2000), true); assert.equal(motor.esBisiesto(2028), true); assert.equal(motor.esBisiesto(2027), false);
  assert.equal(motor.diasDelMes(2, 2028), 29); assert.equal(motor.diasDelMes(2, 2100), 28); assert.equal(motor.diasDelAnio(2024), 366);
  // fechas conocidas
  assert.equal(motor.diaSemana({ a: 2026, m: 11, d: 7 }).nombre, 'sábado');
  assert.equal(motor.diaSemana({ a: 1821, m: 7, d: 28 }).nombre, 'sábado');
  assert.equal(motor.diaSemana({ a: 2000, m: 1, d: 1 }).nombre, 'sábado');
  for (let k = 0; k < N; k++) {
    const f1 = { a: ent(1900, 2100), m: ent(1, 12), d: 1 }; f1.d = ent(1, motor.diasDelMes(f1.m, f1.a));
    const f2 = { a: ent(1900, 2100), m: ent(1, 12), d: 1 }; f2.d = ent(1, motor.diasDelMes(f2.m, f2.a));
    const D = motor.desdeFecha({ desde: f1, hasta: f2 }), n = motor.diasEntre(f1, f2);
    assert.equal(D.nombre, motor.diaSemana(f2).nombre, 'el día que da el salto es el del calendario');
    assert.equal(D.indice, (motor.diaSemana(f1).indice + D.resto) % 7, 'avanza el resto');
    assert.equal(D.resto, ((n % 7) + 7) % 7);
    sinChoques(D.errores, D.coinciden, D.nombre, 'día de la semana');
    // un año después, la misma fecha corre 1 día (2 si hay un 29 de febrero de por medio)
    if (!(f1.m === 2 && f1.d === 29) && f1.a < 2100) {
      const Y = motor.desdeFecha({ desde: f1, hasta: { a: f1.a + 1, m: f1.m, d: f1.d } });
      assert.equal(Y.resto, 1 + Y.febreros29);
    }
    const dm = ent(28, 31), p = ent(0, 6), Ms = motor.mes({ diasMes: dm, primerDia: p });
    assert.equal(Ms.conteo.reduce((s, x) => s + x, 0), dm);
    assert.equal(Ms.cinco.length, dm - 28);
    assert.deepEqual(Ms.cinco, motor.DIAS.filter((_, j) => Ms.conteo[j] === 5).sort((x, y) => ((motor.DIAS.indexOf(x) - p + 7) % 7) - ((motor.DIAS.indexOf(y) - p + 7) % 7)));
    sinChoques(Ms.errores, Ms.coinciden, Ms.cinco, 'mes');
    const y1 = ent(1583, 2400), y2 = y1 + ent(0, 400), Bq = motor.bisiestos({ desde: y1, hasta: y2 });
    cerca(Bq.cuantos, Bq.lista.length, 'lista'); sinChoques(Bq.errores, Bq.coinciden, Bq.cuantos, 'bisiestos');
    assert.deepEqual(motor.sumarDias(f1, n), f2, 'sumar los días lleva de f1 a f2');
    const s = motor.semanas(Math.abs(n)); assert.equal(7 * s.semanas + s.resto, Math.abs(n));
  }
});
test('las opciones de las predicciones de la escena son distintas entre sí y de la correcta', () => {
  const distintas = (xs, que) => assert.equal(new Set(xs.map(x => JSON.stringify(x))).size, xs.length, `${que}: ${JSON.stringify(xs)}`);
  const A = motor.angulo({ H: 3, M: 30 }); distintas([A.menor, A.errores.horarioQuieto, A.errores.signoCambiado, A.errores.noMenor], 'paso 1');
  const S = motor.horaConAngulo({ H: 3, alfa: 0 }); distintas([S.primera.M, S.errores.horarioQuieto.M, S.errores.sinElMedio.M, S.errores.conElSuplemento.M], 'paso 3');
  const C = motor.coincidencias({ horas: 24 }); distintas([C.veces, C.errores.unaPorHora, C.errores.mitad, C.errores.contarExtremos], 'paso 4');
  const V = motor.vuelveHoraCorrecta({ a: 5, cada: 4 }); distintas([V.horas, V.errores.dia24, V.errores.unaHora, V.errores.sinCada], 'paso 5');
  for (const x of [V.horas, V.errores.dia24, V.errores.unaHora, V.errores.sinCada]) assert.ok(Number.isInteger(x / 24), 'días enteros en las opciones');
  const K = motor.campanadas({ n: 6, t: 5, m: 12 }); distintas([K.tiempo, K.errores.proporcional, K.errores.intervalosComoCampanadas], 'paso 6');
  const F = motor.desdeFecha({ desde: { a: 2027, m: 3, d: 15 }, hasta: { a: 2028, m: 3, d: 15 }, dia: 'lunes' });
  distintas([F.nombre, F.errores.sinBisiestos, F.errores.contarPartida, F.errores.alReves], 'paso 8');
  const R = motor.horaConAngulo({ H: 2, alfa: 90 }); distintas([R.primera.M, R.errores.horarioQuieto.M, R.errores.signoCambiado.M], 'experimento 1');
  const Mk = motor.horaMarcada({ inicio: 480, transcurrido: 10, a: 3, cada: 1, tipo: 'atrasa' }); distintas([Mk.marcada, Mk.errores.signoCambiado, Mk.errores.unPeriodo, Mk.errores.sinDesfase], 'experimento 2');
  const D = motor.dosRelojes({ a: 2, b: 1, cada: 1 }); distintas([D.horas, D.errores.otraRapidez, D.errores.dia24, D.errores.soloUno], 'experimento 3');
  const E = motor.campanadasEn({ n: 5, t: 12, T: 24 }); distintas([E.campanadas, E.errores.proporcional, E.errores.sinMasUno], 'experimento 4');
  const B = motor.bisiestos({ desde: 1901, hasta: 2100 }); distintas([B.cuantos, B.errores.soloCada4, B.errores.sinRegla400], 'experimento 5');
  const Ms = motor.mes({ diasMes: 31, primerDia: 'jueves' }); distintas([Ms.cinco, Ms.errores.contarPartida, Ms.errores.alReves, Ms.errores.restoDesplazado], 'experimento 6');
  // el 15 de marzo de 2027 es lunes de verdad
  assert.equal(motor.diaSemana({ a: 2027, m: 3, d: 15 }).nombre, 'lunes');
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.angulo({ H: 13, M: 0 }), /como mucho 12/);
  assert.throws(() => motor.angulo({ H: 2.5, M: 0 }), /entero/);
  assert.throws(() => motor.angulo({ H: 3, M: 60 }), /menos de 60/);
  assert.throws(() => motor.angulo({ H: 3, M: -1 }), /negativo/);
  assert.throws(() => motor.angulo({ H: '3', M: 0 }), /número/);
  assert.throws(() => motor.horaConAngulo({ H: 3, alfa: 200 }), /como mucho 180/);
  assert.throws(() => motor.horaConAngulo({ H: 3, alfa: 10.3 }), /múltiplo de 0,5/);
  assert.throws(() => motor.coincidencias({ horas: 12, tipo: 'llanas' }), /tipo/);
  assert.throws(() => motor.coincidencias({ horas: 0 }), /mayor que cero/);
  assert.throws(() => motor.vuelveHoraCorrecta({ a: 0, cada: 1 }), /mayor que cero/);
  assert.throws(() => motor.horaMarcada({ inicio: 0, transcurrido: 1, a: 1, cada: 1, tipo: 'corre' }), /tipo/);
  assert.throws(() => motor.horaReal({ inicio: 0, marcada: 10, a: 60, cada: 1, tipo: 'atrasa' }), /una hora o más/);
  assert.throws(() => motor.dosRelojes({ a: 2, b: 2, cada: 1, mismoSentido: true }), /nunca se separan/);
  assert.throws(() => motor.campanadas({ n: 1, t: 5, m: 3 }), /al menos 2/);
  assert.throws(() => motor.campanadasEn({ n: 4, t: 0, T: 3 }), /mayor que cero/);
  assert.throws(() => motor.diaSemana({ a: 2027, m: 2, d: 29 }), /como mucho 28/);
  assert.throws(() => motor.diaSemana({ a: 2027, m: 13, d: 1 }), /como mucho 12/);
  assert.throws(() => motor.desdeFecha({ desde: { a: 2027, m: 1, d: 1 }, hasta: { a: 2027, m: 1, d: 2 }, dia: 'lúnes' }), /desconocido/);
  assert.throws(() => motor.mes({ diasMes: 32, primerDia: 0 }), /como mucho 31/);
  assert.throws(() => motor.bisiestos({ desde: 2000, hasta: 1900 }), /mayor o igual/);
  assert.throws(() => motor.fraccion(1, 0), /mayor que cero/);
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
