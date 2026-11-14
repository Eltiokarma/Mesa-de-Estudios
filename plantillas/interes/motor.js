/*
 * Motor de «La alcancía que gana interés»: interés simple y compuesto, tasas equivalentes, capitalización,
 * valor presente y futuro, descuento comercial y racional, y vencimiento común.
 *
 * Aquí vive toda la matemática de la plantilla (regla 1 de CLAUDE.md). No toca el DOM:
 * funciona igual en el navegador (window.MotorInteres) y en Node (require('./motor.js')),
 * donde lo prueban casos.json y papel.json.
 *
 * Convenciones de academia: las tasas r van en % (r = 10 es el 10 %); año comercial de 360 días,
 * mes de 30 días. Las unidades de tasa son 'anual', 'semestral', 'cuatrimestral', 'trimestral', 'bimestral',
 * 'mensual', 'quincenal' y 'diaria'; las de tiempo, 'anios', 'semestres', 'cuatrimestres', 'trimestres',
 * 'bimestres', 'meses', 'quincenas' y 'dias'.
 *
 *   aAnios(t, unidad)                          tiempo en años (año comercial)
 *   tasaAnual(r, unidad)                       tasa proporcional anual (para el interés simple)
 *   interesSimple({ C, r, tasa, t, tiempo })   I = C·r·t/100 con r y t en la misma unidad; M = C + I
 *   compuesto({ C, r, tasa, t, tiempo })       M = C(1 + r/100)^t con t en periodos de la tasa; la torre por periodo
 *   curvas({ C, r, tmax, pasos })              puntos de M contra t: la recta del simple y la curva del compuesto
 *   dobleTiempo({ C, r, t })                   el interés compuesto en t y en 2t periodos
 *   comparar({ C, r, t })                      ¿cuál da más, el simple o el compuesto, en t periodos?
 *   efectiva({ r, n })                         tasa efectiva de n periodos: (1 + r/100)^n − 1
 *   porPeriodo({ efectiva, n })                la tasa por periodo equivalente a una efectiva de n periodos
 *   capitalizacion({ C, j, m, t })             tasa nominal anual j capitalizable m veces al año (o 'continua')
 *   capitalDesdeMonto({ M, r, tasa, t, tiempo, tipo })   valor presente: el capital que produce M
 *   tiempo({ C, M, r, tipo })                  periodos para que C llegue a M (simple o compuesto)
 *   descuento({ Vn, r, tasa, t, tiempo })      Dc = Vn·r·t/100 y Dr = Vn·r·t/(100 + r·t), con sus valores actuales
 *   nominalDesdeDescuentos({ Dc, Dr, t, tiempo })   Vn = Dc·Dr/(Dc − Dr); con el plazo t, la tasa anual r
 *   vencimientoComun({ letras })               t = Σ Vn·t / Σ Vn (descuento comercial a la misma tasa)
 *
 * Cada resultado que es la respuesta de una predicción trae 'errores' con lo que dan los errores típicos
 * (AR16 de docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md; lo demás son hipótesis nuestras).
 * Un error que en ese caso da justo la respuesta correcta no se ofrece: va a 'coinciden'.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorInteres = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const TOL = 1e-9;
  const POR_ANIO_TASA = { anual: 1, semestral: 2, cuatrimestral: 3, trimestral: 4, bimestral: 6, mensual: 12, quincenal: 24, diaria: 360 };
  const POR_ANIO_TIEMPO = { anios: 1, semestres: 2, cuatrimestres: 3, trimestres: 4, bimestres: 6, meses: 12, quincenas: 24, dias: 360 };
  // La unidad de tiempo que corresponde a cada tasa (para saber si ya están en la misma unidad).
  const MISMA = { anual: 'anios', semestral: 'semestres', cuatrimestral: 'cuatrimestres', trimestral: 'trimestres', bimestral: 'bimestres', mensual: 'meses', quincenal: 'quincenas', diaria: 'dias' };

  function numero(x, que, o) {
    o = o || {};
    if (typeof x !== 'number' || !Number.isFinite(x)) throw new Error(`${que} debe ser un número`);
    if (o.positivo && !(x > 0)) throw new Error(`${que} debe ser mayor que cero`);
    if (o.noNegativo && x < 0) throw new Error(`${que} no puede ser negativo`);
    if (o.entero && !Number.isInteger(x)) throw new Error(`${que} debe ser un número entero`);
    return x;
  }
  // Redondea el ruido de coma flotante cerca de un número con hasta 6 decimales (299,99999999 → 300).
  function limpio(x) {
    for (const p of [1, 100, 1e4, 1e6]) { const y = Math.round(x * p) / p; if (Math.abs(x - y) <= 1e-12 * Math.max(1, Math.abs(x))) return y + 0; }
    return x;
  }
  const igual = (a, b) => (typeof a === 'number' && typeof b === 'number'
    ? Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b)) : a === b);
  // Separa los errores que en este caso dan justo la respuesta (no se pueden ofrecer como opción incorrecta).
  function apartar(errores, correcto) {
    const e = {}, coinciden = [];
    for (const [k, v] of Object.entries(errores)) {
      if (v === null || v === undefined || (typeof v === 'number' && !Number.isFinite(v))) continue;
      if (igual(v, correcto)) coinciden.push(k); else e[k] = typeof v === 'number' ? limpio(v) : v;
    }
    return { errores: e, coinciden };
  }
  function unidadTasa(u) {
    const x = u === undefined ? 'anual' : u;
    if (!(x in POR_ANIO_TASA)) throw new Error(`unidad de tasa desconocida: ${u}`);
    return x;
  }
  function unidadTiempo(u) {
    const x = u === undefined ? 'anios' : u;
    if (!(x in POR_ANIO_TIEMPO)) throw new Error(`unidad de tiempo desconocida: ${u}`);
    return x;
  }
  function aAnios(t, unidad) { numero(t, 'el tiempo', { noNegativo: true }); return limpio(t / POR_ANIO_TIEMPO[unidadTiempo(unidad)]); }
  function tasaAnual(r, unidad) { numero(r, 'la tasa', { noNegativo: true }); return limpio(r * POR_ANIO_TASA[unidadTasa(unidad)]); }
  // El tiempo medido en periodos de la tasa (8 meses con tasa anual → 2/3 de periodo).
  const enPeriodos = (t, tiempo, tasa) => t / POR_ANIO_TIEMPO[tiempo] * POR_ANIO_TASA[tasa];

  // ---------- Interés simple ----------
  // I = C·r·t/100, con r y t en la misma unidad. Errores: no convertir (usa t tal cual con la tasa), año de 365 días,
  // dar el monto en vez del interés, quedarse con el interés de un solo periodo de la tasa.
  function interesSimple(o) {
    const C = numero(o.C, 'el capital C', { positivo: true }), r = numero(o.r, 'la tasa r', { noNegativo: true });
    const tasa = unidadTasa(o.tasa), tiempo = unidadTiempo(o.tiempo), t = numero(o.t, 'el tiempo t', { noNegativo: true });
    const tP = enPeriodos(t, tiempo, tasa);
    const I = limpio(C * r * tP / 100), M = limpio(C + I);
    const err = { daElMonto: M, unPeriodo: limpio(C * r / 100) };
    if (MISMA[tasa] !== tiempo) err.sinConvertir = limpio(C * r * t / 100);
    if (tiempo === 'dias' && tasa !== 'diaria') err.anio365 = limpio(C * tasaAnual(r, tasa) * t / 36500);
    const a = apartar(err, I);
    return { I, M, tEnPeriodos: limpio(tP), tAnios: aAnios(t, tiempo), rAnual: tasaAnual(r, tasa), porPeriodo: limpio(C * r / 100),
      errores: a.errores, coinciden: a.coinciden };
  }

  // ---------- Interés compuesto ----------
  // M = C(1 + r/100)^t, con t en periodos de capitalización (la unidad de la tasa). La torre separa, en cada periodo k,
  // el capital, el interés del capital (k veces C·r/100, como en el simple) y el interés sobre el interés (lo que falta).
  // Errores de M: calcularlo como simple (AR16), multiplicar el factor por el tiempo, contar un periodo menos.
  function compuesto(o) {
    const C = numero(o.C, 'el capital C', { positivo: true }), r = numero(o.r, 'la tasa r', { noNegativo: true });
    const tasa = unidadTasa(o.tasa), tiempo = o.tiempo === undefined ? MISMA[tasa] : unidadTiempo(o.tiempo);
    const t = numero(o.t, 'el tiempo t', { noNegativo: true });
    const n = enPeriodos(t, tiempo, tasa), f = 1 + r / 100;
    const M = limpio(C * Math.pow(f, n)), I = limpio(M - C), Ms = limpio(C * (1 + r * n / 100));
    const torre = [];
    for (let k = 0; k <= Math.floor(n + TOL); k++) {
      const Mk = C * Math.pow(f, k), ic = C * r * k / 100;
      torre.push({ k, M: limpio(Mk), capital: C, interesCapital: limpio(ic), sobreInteres: limpio(Mk - C - ic), interesDelPeriodo: k ? limpio(Mk - Mk / f) : 0 });
    }
    const err = { comoSimple: Ms, factorPorTiempo: limpio(C * f * n) };
    if (n >= 1) err.unPeriodoMenos = limpio(C * Math.pow(f, n - 1));
    const a = apartar(err, M);
    const ai = apartar({ comoSimple: limpio(Ms - C), unPeriodo: limpio(C * r / 100) }, I);
    return { M, I, n: limpio(n), factor: limpio(Math.pow(f, n)), simple: { M: Ms, I: limpio(Ms - C) }, sobreInteres: limpio(M - Ms), torre,
      errores: a.errores, coinciden: a.coinciden, erroresI: ai.errores };
  }
  // Puntos de M contra t para la gráfica: recta del simple y curva del compuesto.
  function curvas(o) {
    const C = numero(o.C, 'el capital C', { positivo: true }), r = numero(o.r, 'la tasa r', { noNegativo: true });
    const tmax = numero(o.tmax, 'tmax', { positivo: true }), pasos = o.pasos || 60;
    const simple = [], comp = [];
    for (let j = 0; j <= pasos; j++) { const t = tmax * j / pasos; simple.push({ t, M: C * (1 + r * t / 100) }); comp.push({ t, M: C * Math.pow(1 + r / 100, t) }); }
    return { simple, compuesto: comp };
  }
  // Doble de tiempo: el interés compuesto crece más del doble. I(2t)/I(t) = (1 + r/100)^t + 1.
  function dobleTiempo(o) {
    const A = compuesto({ C: o.C, r: o.r, t: o.t }), B = compuesto({ C: o.C, r: o.r, t: 2 * o.t });
    const a = apartar({ doble: limpio(2 * A.I), cuadruple: limpio(4 * A.I), daElMonto: B.M }, B.I);
    return { I1: A.I, I2: B.I, M2: B.M, razon: limpio(B.I / A.I), errores: a.errores, coinciden: a.coinciden };
  }
  // ¿Cuál da más en t periodos? Antes del primer periodo gana el simple; justo en 1 empatan; después gana el compuesto.
  function comparar(o) {
    const s = interesSimple({ C: o.C, r: o.r, t: o.t, tasa: 'anual', tiempo: 'anios' }), c = compuesto({ C: o.C, r: o.r, t: o.t });
    const mayor = igual(s.M, c.M) || o.r === 0 ? 'iguales' : s.M > c.M ? 'simple' : 'compuesto';
    const a = apartar({ compuestoSiempre: 'compuesto', iguales: 'iguales', simpleSiempre: 'simple' }, mayor);
    return { simple: s.M, compuesto: c.M, diferencia: limpio(c.M - s.M), mayor, errores: a.errores, coinciden: a.coinciden };
  }

  // ---------- Tasas equivalentes ----------
  // Efectiva de n periodos a la tasa r por periodo: (1 + r/100)^n − 1, en %. No es r·n (eso es la tasa proporcional).
  function efectiva(o) {
    const r = numero(o.r, 'la tasa r', { noNegativo: true }), n = numero(o.n, 'n', { positivo: true });
    const F = Math.pow(1 + r / 100, n), e = limpio((F - 1) * 100);
    const a = apartar({ proporcional: limpio(r * n), factorComoTasa: limpio(F * 100), sinCambio: r, alReves: limpio(r / n) }, e);
    return { efectiva: e, factor: limpio(F), errores: a.errores, coinciden: a.coinciden };
  }
  // La tasa por periodo que, compuesta n veces, da la efectiva: (1 + e/100)^(1/n) − 1. Error: dividir entre n.
  function porPeriodo(o) {
    const e = numero(o.efectiva, 'la tasa efectiva', { noNegativo: true }), n = numero(o.n, 'n', { positivo: true });
    const r = limpio((Math.pow(1 + e / 100, 1 / n) - 1) * 100);
    const a = apartar({ proporcional: limpio(e / n) }, r);
    return { r, errores: a.errores, coinciden: a.coinciden };
  }
  // Tasa nominal anual j capitalizable m veces al año (m = 'continua' para capitalización continua), durante t años.
  function capitalizacion(o) {
    const C = numero(o.C, 'el capital C', { positivo: true }), j = numero(o.j, 'la tasa nominal j', { noNegativo: true });
    const t = o.t === undefined ? 1 : numero(o.t, 'el tiempo t', { noNegativo: true });
    let M, ef, porP = null;
    if (o.m === 'continua') { M = C * Math.exp(j * t / 100); ef = (Math.exp(j / 100) - 1) * 100; }
    else {
      const m = numero(o.m, 'm', { positivo: true, entero: true });
      porP = j / m; M = C * Math.pow(1 + porP / 100, m * t); ef = (Math.pow(1 + porP / 100, m) - 1) * 100;
    }
    M = limpio(M);
    const a = apartar({ comoAnual: limpio(C * (1 + j * t / 100)) }, M);
    return { M, I: limpio(M - C), porPeriodo: porP === null ? null : limpio(porP), efectiva: limpio(ef), limite: limpio(C * Math.exp(j * t / 100)),
      errores: a.errores, coinciden: a.coinciden };
  }

  // ---------- Valor presente ----------
  // El capital que produce el monto M. Simple: C = M/(1 + r·t/100); compuesto: C = M/(1 + r/100)^t.
  // Errores: sacar el porcentaje sobre el monto y restarlo, dividir entre (1 + r) sin el tiempo, restar r % del monto.
  function capitalDesdeMonto(o) {
    const M = numero(o.M, 'el monto M', { positivo: true }), r = numero(o.r, 'la tasa r', { noNegativo: true });
    const tasa = unidadTasa(o.tasa), tiempo = o.tiempo === undefined ? MISMA[tasa] : unidadTiempo(o.tiempo);
    const t = numero(o.t, 'el tiempo t', { noNegativo: true }), tipo = o.tipo || 'simple';
    if (tipo !== 'simple' && tipo !== 'compuesto') throw new Error("tipo debe ser 'simple' o 'compuesto'");
    const n = enPeriodos(t, tiempo, tasa);
    const factor = tipo === 'simple' ? 1 + r * n / 100 : Math.pow(1 + r / 100, n);
    const C = limpio(M / factor);
    const err = { interesSobreMonto: limpio(M * (2 - factor)), sinTiempo: limpio(M / (1 + r / 100)), restaTasa: limpio(M * (1 - r / 100)) };
    if (tipo === 'compuesto') err.comoSimple = limpio(M / (1 + r * n / 100));
    const a = apartar(err, C);
    return { C, I: limpio(M - C), factor: limpio(factor), errores: a.errores, coinciden: a.coinciden };
  }
  // Periodos (de la tasa) para que C llegue a M. Compuesto: log(M/C)/log(1 + r/100).
  function tiempo(o) {
    const C = numero(o.C, 'el capital C', { positivo: true }), M = numero(o.M, 'el monto M', { positivo: true }), r = numero(o.r, 'la tasa r', { positivo: true });
    if (M < C) throw new Error('el monto no puede ser menor que el capital');
    const tipo = o.tipo || 'simple';
    if (tipo !== 'simple' && tipo !== 'compuesto') throw new Error("tipo debe ser 'simple' o 'compuesto'");
    const ts = limpio((M / C - 1) * 100 / r), tc = limpio(Math.log(M / C) / Math.log(1 + r / 100));
    const t = tipo === 'simple' ? ts : tc;
    const err = tipo === 'compuesto' ? { comoSimple: ts, mitadDelSimple: limpio(ts / 2) } : { comoCompuesto: tc };
    const a = apartar(err, t);
    return { t, errores: a.errores, coinciden: a.coinciden };
  }

  // ---------- Descuento ----------
  // Una letra de valor nominal Vn que vence dentro de t. Con r·t en % (misma unidad):
  //   comercial (o abusivo): Dc = Vn·r·t/100 (se calcula sobre el nominal);
  //   racional (o matemático): Dr = Va·r·t/100 = Vn·r·t/(100 + r·t) (se calcula sobre lo que se recibe hoy).
  //   Va = Vn − D. Relaciones: Dc − Dr = Dc·Dr/Vn y Dc/Dr = 1 + r·t/100.
  function descuento(o) {
    const Vn = numero(o.Vn, 'el valor nominal Vn', { positivo: true }), r = numero(o.r, 'la tasa r', { noNegativo: true });
    const tasa = unidadTasa(o.tasa), tiempo = o.tiempo === undefined ? MISMA[tasa] : unidadTiempo(o.tiempo);
    const t = numero(o.t, 'el tiempo t', { noNegativo: true });
    const rt = limpio(r * enPeriodos(t, tiempo, tasa));           // r·t en %
    const Dc = limpio(Vn * rt / 100), Dr = limpio(Vn * rt / (100 + rt));
    const VaC = limpio(Vn - Dc), VaR = limpio(Vn - Dr);
    const crudo = MISMA[tasa] !== tiempo ? r * t : null;          // r·t sin convertir
    const ec = apartar({ comoRacional: Dr, vaComoDescuento: VaC, sinConvertir: crudo === null ? null : limpio(Vn * crudo / 100) }, Dc);
    const er = apartar({ comoComercial: Dc, vaComoDescuento: VaR, sobreVaComercial: limpio(VaC * rt / 100), sinConvertir: crudo === null ? null : limpio(Vn * crudo / (100 + crudo)) }, Dr);
    return { rt, comercial: { D: Dc, Va: VaC, errores: ec.errores, coinciden: ec.coinciden },
      racional: { D: Dr, Va: VaR, errores: er.errores, coinciden: er.coinciden },
      diferencia: limpio(Dc - Dr), cociente: limpio(Dc / Dr), interesDelDr: limpio(Dr * rt / 100),
      // si 100/(r·t) es entero, el dibujo arma Va con fichas del tamaño del descuento
      fichas: Number.isInteger(limpio(100 / rt)) ? limpio(100 / rt) : null };
  }
  // Con los dos descuentos de una misma letra: Vn = Dc·Dr/(Dc − Dr) y r·t = (Dc/Dr − 1)·100.
  function nominalDesdeDescuentos(o) {
    const Dc = numero(o.Dc, 'Dc', { positivo: true }), Dr = numero(o.Dr, 'Dr', { positivo: true });
    if (!(Dc > Dr)) throw new Error('el descuento comercial siempre es mayor que el racional');
    const Vn = limpio(Dc * Dr / (Dc - Dr));
    const a = apartar({ suma: limpio(Dc + Dr), diferencia: limpio(Dc - Dr), promedio: limpio((Dc + Dr) / 2) }, Vn);
    const rt = limpio((Dc / Dr - 1) * 100), res = { Vn, rt, errores: a.errores, coinciden: a.coinciden };
    // Con el plazo (t en la unidad 'tiempo', meses si no se dice): la tasa anual y la tasa por unidad de ese tiempo.
    if (o.t !== undefined) {
      const t = numero(o.t, 'el tiempo t', { positivo: true }), tiempo = o.tiempo === undefined ? 'meses' : unidadTiempo(o.tiempo);
      res.r = limpio(rt / aAnios(t, tiempo)); res.rPorUnidad = limpio(rt / t);
    }
    return res;
  }
  // Dos montos del mismo capital en dos tiempos: se despejan C y r (r en % por unidad de tiempo).
  // Simple: el interés de cada periodo es (M2 − M1)/(t2 − t1). Compuesto: (1 + r/100)^(t2 − t1) = M2/M1.
  // Error: tomar M1 como el capital (restar en vez de retroceder hasta t = 0).
  function dosMontos(o) {
    const M1 = numero(o.M1, 'M1', { positivo: true }), M2 = numero(o.M2, 'M2', { positivo: true });
    const t1 = numero(o.t1, 't1', { positivo: true }), t2 = numero(o.t2, 't2', { positivo: true }), tipo = o.tipo || 'simple';
    if (!(t2 > t1) || !(M2 > M1)) throw new Error('el segundo tiempo y el segundo monto deben ser mayores');
    if (tipo !== 'simple' && tipo !== 'compuesto') throw new Error("tipo debe ser 'simple' o 'compuesto'");
    const simple = () => { const p = (M2 - M1) / (t2 - t1), C0 = M1 - p * t1; return { C: C0, r: 100 * p / C0, rM1: 100 * p / M1 }; };
    const comp = () => { const f = Math.pow(M2 / M1, 1 / (t2 - t1)); return { C: M1 / Math.pow(f, t1), r: 100 * (f - 1), rM1: 100 * (f - 1) }; };
    const S = simple(), K = comp(), R = tipo === 'simple' ? S : K, O = tipo === 'simple' ? K : S;
    if (!(R.C > 0)) throw new Error('esos montos no salen de un capital positivo');
    const C = limpio(R.C), r = limpio(R.r);
    // errores del capital: tomar M1 como capital; resolver con el otro tipo de interés
    const a = apartar({ m1ComoCapital: M1, otroTipo: O.C > 0 ? limpio(O.C) : null }, C);
    // errores de la tasa: con M1 como capital (en el simple cambia la tasa; en el compuesto no), con el otro tipo
    const b = apartar({ m1ComoCapital: limpio(R.rM1), otroTipo: O.C > 0 ? limpio(O.r) : null }, r);
    return { C, r, errores: a.errores, coinciden: a.coinciden, erroresR: b.errores, coincidenR: b.coinciden };
  }
  // Varias letras que se cambian por una sola de valor Σ Vn: vence en Σ Vn·t / Σ Vn (descuento comercial, misma tasa).
  function vencimientoComun(o) {
    if (!o || !Array.isArray(o.letras) || o.letras.length < 2) throw new Error('hacen falta al menos dos letras');
    o.letras.forEach((l, k) => { numero(l.Vn, `Vn de la letra ${k + 1}`, { positivo: true }); numero(l.t, `t de la letra ${k + 1}`, { noNegativo: true }); });
    const S = o.letras.reduce((s, l) => s + l.Vn, 0), t = limpio(o.letras.reduce((s, l) => s + l.Vn * l.t, 0) / S);
    const a = apartar({ promedioSimple: limpio(o.letras.reduce((s, l) => s + l.t, 0) / o.letras.length) }, t);
    return { Vn: limpio(S), t, errores: a.errores, coinciden: a.coinciden };
  }

  return { POR_ANIO_TASA, POR_ANIO_TIEMPO, aAnios, tasaAnual, interesSimple, compuesto, curvas, dobleTiempo, comparar,
    efectiva, porPeriodo, capitalizacion, capitalDesdeMonto, tiempo, descuento, nominalDesdeDescuentos, dosMontos, vencimientoComun };
});
