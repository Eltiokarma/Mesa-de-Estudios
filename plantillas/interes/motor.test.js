// Pruebas del motor de «La alcancía que gana interés». Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json debe salir igual del motor (regla 2 de CLAUDE.md).
// 2. Propiedades, con números al azar (semilla fija):
//    - el simple crece en recta (cada periodo suma lo mismo) y el compuesto multiplica por el mismo factor;
//    - la torre: capital + interés del capital + interés sobre interés = monto, y el interés sobre interés nunca es negativo;
//    - el compuesto le gana al simple después del primer periodo y pierde antes; empatan en t = 1;
//    - las tasas equivalentes de ida y vuelta; capitalizar más seguido da más, pero nunca más que la continua;
//    - el valor presente devuelve el capital; el tiempo despejado reproduce el monto;
//    - descuentos: Dc > Dr, Dc − Dr = Dc·Dr/Vn, Dc/Dr = 1 + r·t/100, Va racional + su interés = Vn;
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
  assert.equal(datos.plantilla, 'interes');
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
const al = (a, b) => a + (b - a) * rnd();
const ent = (a, b) => Math.floor(al(a, b + 1));
const N = 400;
const casi = (a, b) => (typeof a === 'number' ? Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b)) : a === b);
// La regla extra: ningún error típico coincide con la respuesta correcta, y los apartados sí coinciden.
function sinChoques(errores, coinciden, correcto, que, recalcular) {
  assert.ok(errores && typeof errores === 'object', `${que}: falta errores`);
  for (const [k, v] of Object.entries(errores)) assert.ok(!casi(v, correcto), `${que}: el error ${k} da la respuesta (${v})`);
  if (recalcular) for (const k of coinciden) assert.ok(casi(recalcular[k], correcto), `${que}: ${k} se apartó sin coincidir`);
}
const TASAS = Object.keys(motor.POR_ANIO_TASA), TIEMPOS = Object.keys(motor.POR_ANIO_TIEMPO);
const dinero = () => ent(1, 200) * [10, 50, 100][ent(0, 2)];

test('simple: cada periodo suma el mismo interés (recta); convertir la tasa o el tiempo da lo mismo', () => {
  for (let k = 0; k < N; k++) {
    const C = dinero(), r = ent(1, 40) / [1, 2, 4][ent(0, 2)], tasa = TASAS[ent(0, TASAS.length - 1)], tiempo = TIEMPOS[ent(0, TIEMPOS.length - 1)], t = ent(1, 60);
    const S = motor.interesSimple({ C, r, tasa, t, tiempo });
    // lo mismo con la tasa pasada a anual y el tiempo a años
    cerca(S.I, C * motor.tasaAnual(r, tasa) * motor.aAnios(t, tiempo) / 100, 'en años');
    cerca(S.M, C + S.I, 'monto');
    // el doble de tiempo, el doble de interés
    cerca(motor.interesSimple({ C, r, tasa, t: 2 * t, tiempo }).I, 2 * S.I, 'doble de tiempo');
    sinChoques(S.errores, S.coinciden, S.I, `simple ${C} ${r} ${tasa} ${t} ${tiempo}`, { unPeriodo: C * r / 100, sinConvertir: C * r * t / 100 });
    assert.equal('sinConvertir' in S.errores || S.coinciden.includes('sinConvertir'), ({ anual: 'anios', mensual: 'meses', diaria: 'dias', semestral: 'semestres', trimestral: 'trimestres', bimestral: 'bimestres', cuatrimestral: 'cuatrimestres', quincenal: 'quincenas' })[tasa] !== tiempo);
  }
});
test('compuesto: el factor se multiplica; la torre suma el monto; el interés sobre interés crece y nunca es negativo', () => {
  for (let k = 0; k < N; k++) {
    const C = dinero(), r = ent(1, 30), t = ent(0, 15);
    const X = motor.compuesto({ C, r, t });
    if (t >= 1) cerca(X.M, motor.compuesto({ C, r, t: t - 1 }).M * (1 + r / 100), 'un periodo más');
    assert.equal(X.torre.length, t + 1);
    let ant = -1;
    for (const p of X.torre) {
      cerca(p.capital + p.interesCapital + p.sobreInteres, p.M, `torre ${p.k}`);
      assert.ok(p.sobreInteres >= -1e-9 && p.sobreInteres >= ant - 1e-9, 'el interés sobre interés no baja');
      ant = p.sobreInteres;
      if (p.k) cerca(p.interesDelPeriodo, X.torre[p.k - 1].M * r / 100, 'el interés de cada periodo es r % de lo acumulado');
    }
    if (t >= 2) assert.ok(X.sobreInteres > 0, 'desde el segundo periodo el interés gana interés');
    if (t <= 1) cerca(X.sobreInteres, 0, 'en un periodo, simple y compuesto coinciden');
    sinChoques(X.errores, X.coinciden, X.M, `compuesto ${C} ${r} ${t}`, { comoSimple: X.simple.M, factorPorTiempo: C * (1 + r / 100) * t, unPeriodoMenos: C * Math.pow(1 + r / 100, t - 1) });
    sinChoques(X.erroresI, [], X.I, `interés compuesto ${C} ${r} ${t}`);
    // tasa mensual con tiempo en años: los periodos son meses
    const Y = motor.compuesto({ C, r, tasa: 'mensual', t: 1, tiempo: 'anios' });
    cerca(Y.M, C * Math.pow(1 + r / 100, 12), 'doce meses');
  }
});
test('simple contra compuesto: antes del primer periodo gana el simple, en t = 1 empatan, después gana el compuesto', () => {
  for (let k = 0; k < N; k++) {
    const C = dinero(), r = ent(1, 40), t = al(0.05, 12);
    const Q = motor.comparar({ C, r, t });
    const esperado = Math.abs(t - 1) < 1e-9 ? 'iguales' : t < 1 ? 'simple' : 'compuesto';
    assert.equal(Q.mayor, esperado, `t = ${t}`);
    sinChoques(Q.errores, Q.coinciden, Q.mayor, 'comparar');
    assert.equal(motor.comparar({ C, r, t: 1 }).mayor, 'iguales');
    const c = motor.curvas({ C, r, tmax: 10, pasos: 20 });
    // la recta: diferencias iguales; la curva: cocientes iguales
    for (let j = 2; j <= 20; j++) {
      cerca(c.simple[j].M - c.simple[j - 1].M, c.simple[1].M - c.simple[0].M, 'recta');
      cerca(c.compuesto[j].M / c.compuesto[j - 1].M, c.compuesto[1].M / c.compuesto[0].M, 'curva');
    }
    const D = motor.dobleTiempo({ C, r, t: ent(1, 10) });
    assert.ok(D.I2 > 2 * D.I1, 'con el doble de tiempo, más del doble de interés');
    sinChoques(D.errores, D.coinciden, D.I2, 'doble de tiempo');
  }
});
test('tasas equivalentes: ida y vuelta; la efectiva supera a la proporcional; capitalizar más seguido da más, hasta la continua', () => {
  for (let k = 0; k < N; k++) {
    const r = al(0.1, 15), n = [2, 3, 4, 6, 12, 24, 360][ent(0, 6)];
    const E = motor.efectiva({ r, n });
    cerca(motor.porPeriodo({ efectiva: E.efectiva, n }).r, r, 'vuelta');
    assert.ok(E.efectiva > r * n, 'efectiva mayor que la proporcional');
    sinChoques(E.errores, E.coinciden, E.efectiva, 'efectiva');
    const P = motor.porPeriodo({ efectiva: E.efectiva, n }); sinChoques(P.errores, P.coinciden, P.r, 'por periodo');
    const C = dinero(), j = ent(1, 60), t = ent(1, 5);
    let ant = 0;
    for (const m of [1, 2, 3, 4, 6, 12, 24, 360]) {
      const K = motor.capitalizacion({ C, j, m, t });
      assert.ok(K.M > ant - 1e-9, 'más seguido, más monto'); ant = K.M;
      assert.ok(K.M <= K.limite + 1e-9, 'nunca más que la continua');
      cerca(K.M, motor.compuesto({ C, r: j / m, t: m * t }).M, 'es un compuesto con j/m por periodo');
      sinChoques(K.errores, K.coinciden, K.M, `capitalización ${m}`, { comoAnual: C * (1 + j * t / 100) });
    }
    cerca(motor.capitalizacion({ C, j, m: 'continua', t }).M, C * Math.exp(j * t / 100), 'continua');
  }
});
test('valor presente y tiempo: despejar y volver da lo mismo', () => {
  for (let k = 0; k < N; k++) {
    const C = dinero(), r = ent(1, 30), tasa = TASAS[ent(0, 5)], tiempo = TIEMPOS[ent(0, 7)], t = ent(1, 36);
    const S = motor.interesSimple({ C, r, tasa, t, tiempo });
    const P = motor.capitalDesdeMonto({ M: S.M, r, tasa, t, tiempo, tipo: 'simple' });
    cerca(P.C, C, 'capital simple'); sinChoques(P.errores, P.coinciden, P.C, 'presente simple');
    // sacar el porcentaje del monto siempre da menos que el capital
    if ('interesSobreMonto' in P.errores) assert.ok(P.errores.interesSobreMonto < P.C);
    const tc = ent(1, 12), X = motor.compuesto({ C, r, t: tc });
    const Q = motor.capitalDesdeMonto({ M: X.M, r, t: tc, tipo: 'compuesto' });
    cerca(Q.C, C, 'capital compuesto'); sinChoques(Q.errores, Q.coinciden, Q.C, 'presente compuesto');
    const T1 = motor.tiempo({ C, M: X.M, r, tipo: 'compuesto' }); cerca(T1.t, tc, 'tiempo compuesto'); sinChoques(T1.errores, T1.coinciden, T1.t, 'tiempo compuesto');
    const Ms = motor.interesSimple({ C, r, t: tc }).M;
    const T2 = motor.tiempo({ C, M: Ms, r, tipo: 'simple' }); cerca(T2.t, tc, 'tiempo simple'); sinChoques(T2.errores, T2.coinciden, T2.t, 'tiempo simple');
    // dos montos del mismo capital: se recuperan C y r
    const t1 = ent(1, 6), t2 = t1 + ent(1, 6);
    for (const tipo of ['simple', 'compuesto']) {
      const m = t => (tipo === 'simple' ? motor.interesSimple({ C, r, t }).M : motor.compuesto({ C, r, t }).M);
      const D2 = motor.dosMontos({ M1: m(t1), t1, M2: m(t2), t2, tipo });
      cerca(D2.C, C, `dos montos ${tipo}: C`); cerca(D2.r, r, `dos montos ${tipo}: r`); sinChoques(D2.errores, D2.coinciden, D2.C, 'dos montos'); sinChoques(D2.erroresR, D2.coincidenR, D2.r, 'dos montos, tasa');
    }
  }
});
test('descuentos: Dc > Dr; Dc − Dr = Dc·Dr/Vn; Dc/Dr = 1 + r·t/100; Va racional + su interés = Vn; vencimiento común', () => {
  for (let k = 0; k < N; k++) {
    const Vn = dinero(), r = ent(1, 36), tasa = TASAS[ent(0, 5)], tiempo = TIEMPOS[ent(0, 7)], t = ent(1, 90);
    const D = motor.descuento({ Vn, r, tasa, t, tiempo });
    const Dc = D.comercial.D, Dr = D.racional.D;
    assert.ok(Dc > Dr, 'el comercial es mayor');
    cerca(Dc - Dr, Dc * Dr / Vn, 'diferencia'); cerca(Dc / Dr, 1 + D.rt / 100, 'cociente');
    cerca(D.racional.Va * (1 + D.rt / 100), Vn, 'el racional es interés simple sobre el valor actual');
    cerca(Dc, motor.interesSimple({ C: Vn, r, tasa, t, tiempo }).I, 'el comercial es el interés del nominal');
    cerca(D.interesDelDr, Dc - Dr, 'Dc − Dr es el interés de Dr');
    const V = motor.nominalDesdeDescuentos({ Dc, Dr }); cerca(V.Vn, Vn, 'Vn de vuelta'); cerca(V.rt, D.rt, 'r·t de vuelta');
    sinChoques(V.errores, V.coinciden, V.Vn, 'nominal');
    sinChoques(D.comercial.errores, D.comercial.coinciden, Dc, 'comercial');
    sinChoques(D.racional.errores, D.racional.coinciden, Dr, 'racional');
    const letras = Array.from({ length: ent(2, 4) }, () => ({ Vn: dinero(), t: ent(1, 120) }));
    const L = motor.vencimientoComun({ letras });
    // el descuento comercial de la letra única es la suma de los descuentos
    const S = letras.reduce((s, l) => s + l.Vn * l.t, 0); cerca(L.Vn * L.t, S, 'suma de descuentos');
    sinChoques(L.errores, L.coinciden, L.t, 'vencimiento común');
  }
});
test('los números de las predicciones de la escena: opciones distintas entre sí y de la correcta', () => {
  const distintas = (xs, que) => assert.equal(new Set(xs.map(x => (typeof x === 'number' ? x.toFixed(2) : x))).size, xs.length, `${que}: ${xs}`);
  const S1 = motor.interesSimple({ C: 2400, r: 15, tasa: 'anual', t: 8, tiempo: 'meses' });
  distintas([S1.I, S1.errores.sinConvertir, S1.errores.daElMonto, S1.errores.unPeriodo], 'paso 1');
  const X = motor.compuesto({ C: 1000, r: 10, t: 3 });
  distintas([X.M, X.errores.comoSimple, X.errores.factorPorTiempo, X.errores.unPeriodoMenos], 'paso 3');
  const E = motor.efectiva({ r: 2, n: 12 });
  distintas([E.efectiva, E.errores.proporcional, E.errores.factorComoTasa, E.errores.alReves], 'paso 5');
  const P = motor.capitalDesdeMonto({ M: 3450, r: 10, tasa: 'anual', t: 18, tiempo: 'meses' });
  distintas([P.C, P.errores.interesSobreMonto, P.errores.sinTiempo, P.errores.restaTasa], 'paso 7');
  const D = motor.descuento({ Vn: 6300, r: 15, tasa: 'anual', t: 4, tiempo: 'meses' });
  distintas([D.racional.D, D.racional.errores.comoComercial, D.racional.errores.sobreVaComercial, D.racional.errores.vaComoDescuento], 'paso 8');
  const T = motor.dobleTiempo({ C: 1000, r: 10, t: 5 }); distintas([T.I2, T.errores.doble, T.errores.daElMonto], 'experimento 1');
  const Q = motor.comparar({ C: 1000, r: 10, t: 0.5 }); distintas([Q.mayor, ...Object.values(Q.errores)], 'experimento 2');
  const Ti = motor.tiempo({ C: 1, M: 2, r: 10, tipo: 'compuesto' }); distintas([Ti.t, Ti.errores.comoSimple, Ti.errores.mitadDelSimple].map(x => x.toFixed(1)), 'experimento 3');
  const Di = motor.interesSimple({ C: 3600, r: 3, tasa: 'mensual', t: 45, tiempo: 'dias' });
  distintas([Di.I, Di.errores.anio365, Di.errores.sinConvertir, Di.errores.unPeriodo], 'experimento 4');
  const V = motor.nominalDesdeDescuentos({ Dc: 330, Dr: 300 }); distintas([V.Vn, V.errores.suma, V.errores.diferencia, V.errores.promedio], 'experimento 5');
});

// 3. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.interesSimple({ C: 0, r: 10, t: 1 }), /mayor que cero/);
  assert.throws(() => motor.interesSimple({ C: '100', r: 10, t: 1 }), /número/);
  assert.throws(() => motor.interesSimple({ C: 100, r: -1, t: 1 }), /negativo/);
  assert.throws(() => motor.interesSimple({ C: 100, r: 10, t: 1, tasa: 'semanal' }), /tasa desconocida/);
  assert.throws(() => motor.interesSimple({ C: 100, r: 10, t: 1, tiempo: 'semanas' }), /tiempo desconocida/);
  assert.throws(() => motor.compuesto({ C: 100, r: 10, t: -2 }), /negativo/);
  assert.throws(() => motor.efectiva({ r: 2, n: 0 }), /mayor que cero/);
  assert.throws(() => motor.capitalizacion({ C: 100, j: 12, m: 2.5 }), /entero/);
  assert.throws(() => motor.capitalDesdeMonto({ M: 100, r: 10, t: 1, tipo: 'continuo' }), /tipo/);
  assert.throws(() => motor.tiempo({ C: 100, M: 50, r: 10 }), /menor que el capital/);
  assert.throws(() => motor.tiempo({ C: 100, M: 150, r: 0 }), /mayor que cero/);
  assert.throws(() => motor.descuento({ Vn: 100, r: 10, t: 2, tasa: 'anual', tiempo: 'horas' }), /tiempo desconocida/);
  assert.throws(() => motor.nominalDesdeDescuentos({ Dc: 100, Dr: 120 }), /mayor que el racional/);
  assert.throws(() => motor.vencimientoComun({ letras: [{ Vn: 100, t: 3 }] }), /al menos dos/);
  assert.throws(() => motor.dosMontos({ M1: 300, t1: 5, M2: 200, t2: 8 }), /mayores/);
  assert.throws(() => motor.dosMontos({ M1: 100, t1: 5, M2: 1000, t2: 6 }), /capital positivo/);
  assert.throws(() => motor.vencimientoComun({ letras: [{ Vn: 100, t: 3 }, { Vn: -5, t: 2 }] }), /mayor que cero/);
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
