/*
 * Motor de «El reloj y el calendario»: cronometría de razonamiento matemático (ángulo entre las agujas,
 * adelantos y atrasos, campanadas, años bisiestos y día de la semana de una fecha).
 *
 * Aquí vive toda la matemática de la plantilla (regla 1 de CLAUDE.md). No toca el DOM:
 * funciona igual en el navegador (window.MotorRelojes) y en Node (require('./motor.js')),
 * donde lo prueban casos.json y papel.json.
 *
 * Convenciones (notación de academia peruana):
 *   - H es la hora que marca el horario (entero de 0 a 12; 12 equivale a 0) y M los minutos (0 ≤ M < 60, puede ser
 *     fraccionario). El minutero avanza 6° por minuto y el horario 0,5° por minuto (30° por hora).
 *   - α = |30H − 11M/2| es el ángulo «de fórmula»; el ángulo entre las agujas es el menor de α y 360° − α.
 *   - Las fracciones exactas se devuelven como { num, den, entero, resto } (16 4/11 → entero 16, resto 4, den 11),
 *     con num/den ya simplificado. Las horas del día van en minutos desde las 0:00 (0 a 1439).
 *   - Días de la semana: índice 0 = lunes … 6 = domingo; nombres en DIAS ('lunes', 'martes', 'miércoles', 'jueves',
 *     'viernes', 'sábado', 'domingo'). Calendario gregoriano. Una fecha es { a, m, d } (año, mes 1-12, día).
 *
 * Funciones (argumentos entre llaves; todos números salvo donde se dice):
 *   posiciones({ H, M })        grados de cada aguja medidos desde las 12 en sentido horario:
 *                               { horario: 30H + M/2, minutero: 6M } (mod 360) y el horario «quieto» 30H.
 *   angulo({ H, M })            { formula: |30H − 11M/2|, menor, mayor: 360 − menor, errores } con errores:
 *                               horarioQuieto (menor de |30H − 6M|), noMenor (= mayor), signoCambiado (menor de 30H + 11M/2).
 *   horaConAngulo({ H, alfa })  los M en [0, 60) en que, entre las H y las H+1, las agujas forman el ángulo alfa (0 a 180;
 *                               0 = superpuestas, 180 = opuestas). { soluciones: [{ M, fraccion }], primera (el primer M > 0),
 *                               errores } con errores (todos el primer M > 0 de su ecuación, con su fraccion):
 *                               horarioQuieto (|30H − 6M| = alfa), sumaRapideces (6,5 en vez de 5,5 por minuto) y
 *                               conElSuplemento (resuelve con 180 − alfa; 0 ↔ 180). alfa debe ser múltiplo de 0,5.
 *   coincidencias({ horas, tipo }) cuántas veces, en [0, horas) contadas desde las 12:00 (0:00), las agujas quedan
 *                               'superpuestas', 'opuestas' o 'rectas' (90°). horas entero positivo. { veces, instantes
 *                               (minutos, exactos como número), errores: unaPorHora, mitad (lo de la mitad del tiempo),
 *                               contarExtremos (veces + 1) }.
 *   vuelveHoraCorrecta({ a, cada })  un reloj que se adelanta (o atrasa) a minutos cada 'cada' horas vuelve a marcar la
 *                               hora correcta cuando acumula 720 min (12 h). { minutos: 720, periodos: 720/a,
 *                               horas: 720·cada/a, dias: horas/24, errores (en horas): dia24 (acumula 1440),
 *                               unaHora (acumula 60) y sinCada (720/a como si el adelanto fuera por hora); erroresDias: los mismos en días }.
 *   horaMarcada({ inicio, transcurrido, a, cada, tipo })  se pone en hora a la hora real 'inicio' (minutos del día);
 *                               pasan 'transcurrido' horas reales; tipo 'adelanta' o 'atrasa'. { real, desfase
 *                               (a·transcurrido/cada, en min), marcada (minutos del día, mod 1440), errores: signoCambiado
 *                               (el desfase al revés), unPeriodo (solo a minutos), sinDesfase (la hora real) }.
 *   horaReal({ inicio, marcada, a, cada, tipo })  lo inverso: el reloj marca 'marcada' (minutos del día, después de
 *                               'inicio', menos de 24 h). En cada hora real el reloj avanza 60 ± a/cada min.
 *                               { real, transcurrido (h reales), desfase, errores: desfaseConTiempoMarcado (calcula el
 *                               desfase con el tiempo que marca el reloj), signoCambiado (suma o resta al revés) }.
 *   dosRelojes({ a, b, cada, mismoSentido })  dos relojes puestos en hora a la vez; uno se aparta a min y el otro b min
 *                               cada 'cada' horas. Por defecto mismoSentido = false (uno se adelanta y el otro se atrasa).
 *                               Vuelven a marcar la misma hora cuando su diferencia llega a 720 min.
 *                               { rapidez (min de diferencia por 'cada' horas), horas, dias, errores (en horas):
 *                               otraRapidez (|a − b| o a + b al revés), dia24, soloUno (720·cada/a); erroresDias: en días }.
 *   campanadas({ n, t, m })     un reloj da n campanadas en t segundos (desde la primera hasta la última; n ≥ 2).
 *                               ¿Cuánto tarda en dar m campanadas? { intervalos: n − 1, intervalo: t/(n − 1),
 *                               intervalosM: m − 1, tiempo: (m − 1)·intervalo, errores: proporcional (m·t/n),
 *                               intervalosComoCampanadas (m·intervalo) }.
 *   campanadasEn({ n, t, T })   cuántas campanadas da en T segundos (contando la que da en el instante 0):
 *                               { intervalo, campanadas: ⌊T/intervalo⌋ + 1, errores: proporcional (n·T/t),
 *                               sinMasUno (⌊T/intervalo⌋) }.
 *   esBisiesto(a)               true si a es divisible por 4 y no por 100, o si es divisible por 400.
 *   diasDelAnio(a), diasDelMes(m, a)   365 o 366; 28 a 31.
 *   bisiestos({ desde, hasta }) años bisiestos entre dos años, ambos incluidos. { cuantos, lista, errores:
 *                               soloCada4 (todo múltiplo de 4), sinRegla400 (quita todos los múltiplos de 100) }.
 *   diaSemana({ a, m, d })      { indice, nombre } del día de la semana de esa fecha.
 *   diasEntre(f1, f2)           días de f1 a f2 (negativo si f2 es antes).
 *   semanas(dias)               { semanas: ⌊dias/7⌋, resto: dias mod 7 } (dias ≥ 0).
 *   desdeFecha({ desde, hasta, dia })  'desde' cae en el día 'dia' (nombre o índice; si falta, el del calendario).
 *                               { dias, semanas, resto (0 a 6, hacia adelante), febreros29 (los 29 de febrero que hay
 *                               de por medio), indice, nombre, errores (nombres de días): contarPartida (cuenta también
 *                               el día de partida: un día más hacia donde se avanza), sinBisiestos (sin los 29 de
 *                               febrero), alReves (avanza el resto hacia el otro lado) }.
 *   mes({ diasMes, primerDia }) un mes de 28 a 31 días que empieza en primerDia (nombre o índice).
 *                               { conteo (7 números, de lunes a domingo), cinco (nombres de los días que salen 5 veces,
 *                               en orden desde primerDia), ultimo (nombre del último día), errores: soloElPrimero
 *                               ([primerDia]), unoDeMas (un día más de los que tocan), ninguno ([]: «4 semanas») }.
 *   agujas(minutos)             el reloj a 'minutos' desde las 12:00 (se toma mod 720): { H (0 a 11), M, horario, minutero,
 *                               menor, formula } (para dibujar y arrastrar el minutero).
 *   sumarDias(f, n)             la fecha { a, m, d } que cae n días después de f (n negativo: antes).
 *   reloj12(minutos)            { h (1 a 12), m (0 a 59, entero o con fracción), sufijo: 'a. m.' | 'p. m.' } de una hora
 *                               del día en minutos (se toma mod 1440).
 *   fraccion(num, den)          { num, den, entero, resto } simplificada (num y den enteros; den > 0).
 *
 * Cada resultado que es la respuesta de una predicción trae 'errores' con lo que da cada error típico. Respaldos
 * (docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md): el ángulo sin el avance del horario y las
 * campanadas como proporción se ligan a AR7 (ilusión de linealidad; el informe no tiene cifra para estos casos);
 * sumar las rapideces se liga a RM4 (hipótesis); no contar el 29 de febrero o el día de partida figura en el informe
 * como «sin dato». Todo lo demás son hipótesis nuestras.
 * Un error que en ese caso da justo la respuesta correcta no se ofrece: va a 'coinciden'.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorRelojes = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const DIAS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
  const EPS = 1e-9;

  function numero(x, que, o) {
    o = o || {};
    if (typeof x !== 'number' || !Number.isFinite(x)) throw new Error(`${que} debe ser un número`);
    if (o.entero && !Number.isInteger(x)) throw new Error(`${que} debe ser un número entero`);
    if (o.positivo && !(x > 0)) throw new Error(`${que} debe ser mayor que cero`);
    if (o.noNegativo && x < 0) throw new Error(`${que} no puede ser negativo`);
    if (o.min !== undefined && x < o.min) throw new Error(`${que} debe ser al menos ${o.min}`);
    if (o.max !== undefined && x > o.max) throw new Error(`${que} debe ser como mucho ${o.max}`);
    return x;
  }
  // Redondea el ruido de coma flotante cerca de un número con hasta 6 decimales.
  function limpio(x) {
    for (const p of [1, 100, 1e4, 1e6]) { const y = Math.round(x * p) / p; if (Math.abs(x - y) <= 1e-11 * Math.max(1, Math.abs(x))) return y + 0; }
    return x;
  }
  const igual = (a, b) => {
    if (typeof a === 'number' && typeof b === 'number') return Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
    if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((x, k) => igual(x, b[k]));
    if (a && b && typeof a === 'object' && typeof b === 'object' && 'M' in a && 'M' in b) return igual(a.M, b.M);
    return a === b;
  };
  function apartar(errores, correcto) {
    const e = {}, coinciden = [];
    for (const [k, v] of Object.entries(errores)) {
      if (v === null || v === undefined || (typeof v === 'number' && !Number.isFinite(v))) continue;
      if (igual(v, correcto)) coinciden.push(k); else e[k] = typeof v === 'number' ? limpio(v) : v;
    }
    return { errores: e, coinciden };
  }
  const mod = (x, n) => ((x % n) + n) % n;
  const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
  function fraccion(num, den) {
    numero(num, 'el numerador', { entero: true }); numero(den, 'el denominador', { entero: true, positivo: true });
    const g = mcd(num, den) || 1, n = num / g, d = den / g;
    const entero = Math.floor(n / d);
    return { num: n, den: d, entero, resto: n - entero * d };
  }
  // Minutos del día en [0, 1440), sin que el ruido de coma flotante deje 1440.
  const delDia = x => { const y = limpio(mod(x, 1440)); return y >= 1440 ? 0 : y; };
  const menorDe = x => { const y = mod(x, 360); return limpio(y > 180 ? 360 - y : y); };

  // ---------- Ángulo entre las agujas ----------
  function hm(o) {
    const H = numero(o.H, 'la hora H', { entero: true, min: 0, max: 12 });
    const M = numero(o.M, 'los minutos M', { noNegativo: true });
    if (!(M < 60)) throw new Error('los minutos M deben ser menos de 60');
    return { H: H % 12, H0: H, M };
  }
  function posiciones(o) {
    const { H, M } = hm(o);
    return { horario: limpio(mod(30 * H + M / 2, 360)), minutero: limpio(mod(6 * M, 360)), horarioQuieto: limpio(30 * H) };
  }
  function angulo(o) {
    const { H0, M } = hm(o);
    const formula = limpio(Math.abs(30 * H0 - 11 * M / 2));
    const menor = menorDe(formula), mayor = limpio(360 - menor);
    const a = apartar({ horarioQuieto: menorDe(30 * H0 - 6 * M), noMenor: mayor, signoCambiado: menorDe(30 * H0 + 11 * M / 2) }, menor);
    return { formula, menor, mayor, errores: a.errores, coinciden: a.coinciden };
  }
  // Resuelve |30H − vM| ≡ alfa (mod 360), con v en medios grados por minuto (11 → 5,5; 12 → 6; 13 → 6,5), para M en [0, 60).
  // M = (60H − 2s·alfa − 720k)/v con s = ±1: numerador entero si 2·alfa es entero.
  function resolver(H, alfa, v) {
    const dos = Math.round(2 * alfa), out = [];
    for (const s of [1, -1]) for (let k = -3; k <= 3; k++) {
      const num = 60 * H - s * dos - 720 * k;   // en medios grados: 2·(30H − s·alfa − 360k)
      if (num < 0 || num >= 60 * v) continue;
      if (!out.some(x => x.num * v === num * x.vv)) out.push({ num, vv: v });
    }
    return out.map(x => ({ M: limpio(x.num / v), fraccion: fraccion(x.num, v) })).sort((p, q) => p.M - q.M);
  }
  function horaConAngulo(o) {
    const H = numero(o.H, 'la hora H', { entero: true, min: 0, max: 12 }) % 12;
    const alfa = numero(o.alfa, 'el ángulo', { min: 0, max: 180 });
    if (!Number.isInteger(2 * alfa)) throw new Error('el ángulo debe ser múltiplo de 0,5');
    const soluciones = resolver(H, alfa, 11);
    const primeraDe = l => l.find(x => x.M > EPS) || null;
    const primera = primeraDe(soluciones);
    const err = { horarioQuieto: primeraDe(resolver(H, alfa, 12)), sumaRapideces: primeraDe(resolver(H, alfa, 13)),
      conElSuplemento: primeraDe(resolver(H, 180 - alfa, 11)) };
    const e = {}, coinciden = [];
    for (const [k, v] of Object.entries(err)) { if (!v) continue; if (primera && igual(v.M, primera.M)) coinciden.push(k); else e[k] = v; }
    return { soluciones, primera, errores: e, coinciden };
  }
  // Cuántas veces quedan superpuestas, opuestas o en ángulo recto en [0, horas): el minutero le saca 5,5° por minuto
  // al horario; la diferencia vuelve a valer lo mismo cada 720/11 min (superpuestas y opuestas: 11 veces en 12 h)
  // y el ángulo recto pasa dos veces en cada vuelta (22 en 12 h).
  function coincidencias(o) {
    const horas = numero(o.horas, 'las horas', { entero: true, positivo: true });
    const tipo = o.tipo || 'superpuestas';
    const fase = { superpuestas: [0], opuestas: [180], rectas: [90, 270] }[tipo];
    if (!fase) throw new Error("tipo debe ser 'superpuestas', 'opuestas' o 'rectas'");
    const fin = horas * 60, instantes = [];
    // diferencia minutero − horario = 5,5·M (mod 360) desde las 12:00
    for (let vuelta = 0; ; vuelta++) {
      let alguno = false;
      for (const f of fase) {
        const M = (f + 360 * vuelta) * 2 / 11;
        if (M < fin - EPS) { instantes.push(limpio(M)); alguno = true; }
      }
      if (!alguno) break;
    }
    instantes.sort((p, q) => p - q);
    const veces = instantes.length, porHora = fase.length;
    const mitad = horas % 2 === 0 ? coincidencias({ horas: horas / 2, tipo }).veces : null;
    const a = apartar({ unaPorHora: porHora * horas, mitad, contarExtremos: veces + 1 }, veces);
    return { veces, instantes, errores: a.errores, coinciden: a.coinciden };
  }

  // ---------- Adelantos y atrasos ----------
  function ritmo(o) {
    return { a: numero(o.a, 'el adelanto a', { positivo: true }), cada: numero(o.cada, 'el periodo', { positivo: true }) };
  }
  const enDias = e => Object.fromEntries(Object.entries(e).map(([k, v]) => [k, limpio(v / 24)]));
  function vuelveHoraCorrecta(o) {
    const { a, cada } = ritmo(o);
    const horas = limpio(720 * cada / a);
    const x = apartar({ dia24: limpio(1440 * cada / a), unaHora: limpio(60 * cada / a), sinCada: limpio(720 / a) }, horas);
    return { minutos: 720, periodos: limpio(720 / a), horas, dias: limpio(horas / 24), errores: x.errores, coinciden: x.coinciden,
      erroresDias: enDias(x.errores) };
  }
  function sentido(t) {
    if (t !== 'adelanta' && t !== 'atrasa') throw new Error("tipo debe ser 'adelanta' o 'atrasa'");
    return t === 'adelanta' ? 1 : -1;
  }
  function horaMarcada(o) {
    const { a, cada } = ritmo(o), s = sentido(o.tipo || 'adelanta');
    const inicio = numero(o.inicio, 'la hora de inicio', { min: 0 }), T = numero(o.transcurrido, 'el tiempo transcurrido', { noNegativo: true });
    const real = delDia(inicio + 60 * T), desfase = limpio(a * T / cada);
    const marcada = delDia(real + s * desfase);
    const x = apartar({ signoCambiado: delDia(real - s * desfase), unPeriodo: delDia(real + s * a), sinDesfase: real }, marcada);
    return { real, desfase, marcada, errores: x.errores, coinciden: x.coinciden };
  }
  function horaReal(o) {
    const { a, cada } = ritmo(o), s = sentido(o.tipo || 'adelanta');
    const inicio = numero(o.inicio, 'la hora de inicio', { min: 0 }), marcada = numero(o.marcada, 'la hora marcada', { min: 0 });
    const avanceMarcado = mod(marcada - inicio, 1440);          // lo que avanzó el reloj, en min
    const porHora = 60 + s * a / cada;                            // minutos que avanza el reloj por hora real
    if (!(porHora > 0)) throw new Error('el reloj no puede atrasarse una hora o más por hora');
    const T = avanceMarcado / porHora, desfase = limpio(a * T / cada);
    const real = delDia(inicio + 60 * T);
    const dM = a * (avanceMarcado / 60) / cada;                 // desfase calculado con el tiempo que marca el reloj
    const x = apartar({ desfaseConTiempoMarcado: delDia(marcada - s * dM), signoCambiado: delDia(marcada + s * desfase) }, real);
    return { real, transcurrido: limpio(T), desfase, errores: x.errores, coinciden: x.coinciden };
  }
  function dosRelojes(o) {
    const a = numero(o.a, 'el desfase a', { positivo: true }), b = numero(o.b, 'el desfase b', { positivo: true });
    const cada = numero(o.cada, 'el periodo', { positivo: true }), mismo = !!o.mismoSentido;
    const rapidez = limpio(mismo ? Math.abs(a - b) : a + b);
    if (!(rapidez > 0)) throw new Error('si los dos se apartan igual y hacia el mismo lado, nunca se separan');
    const horas = limpio(720 * cada / rapidez), otra = mismo ? a + b : Math.abs(a - b);
    const x = apartar({ otraRapidez: otra > 0 ? limpio(720 * cada / otra) : null, dia24: limpio(1440 * cada / rapidez), soloUno: limpio(720 * cada / a) }, horas);
    return { rapidez, horas, dias: limpio(horas / 24), errores: x.errores, coinciden: x.coinciden, erroresDias: enDias(x.errores) };
  }

  // ---------- Campanadas ----------
  function campanadas(o) {
    const n = numero(o.n, 'las campanadas n', { entero: true, min: 2 }), t = numero(o.t, 'el tiempo t', { positivo: true });
    const m = numero(o.m, 'las campanadas m', { entero: true, min: 1 });
    const intervalo = limpio(t / (n - 1)), tiempo = limpio((m - 1) * t / (n - 1));
    const x = apartar({ proporcional: limpio(m * t / n), intervalosComoCampanadas: limpio(m * t / (n - 1)) }, tiempo);
    return { intervalos: n - 1, intervalo, intervalosM: m - 1, tiempo, errores: x.errores, coinciden: x.coinciden };
  }
  function campanadasEn(o) {
    const n = numero(o.n, 'las campanadas n', { entero: true, min: 2 }), t = numero(o.t, 'el tiempo t', { positivo: true });
    const T = numero(o.T, 'el tiempo T', { noNegativo: true });
    const intervalo = t / (n - 1), q = Math.floor(T / intervalo + EPS);
    const x = apartar({ proporcional: limpio(n * T / t), sinMasUno: q }, q + 1);
    return { intervalo: limpio(intervalo), campanadas: q + 1, errores: x.errores, coinciden: x.coinciden };
  }

  // ---------- Calendario ----------
  function anio(a) { return numero(a, 'el año', { entero: true, min: 1 }); }
  const esBisiesto = a => { anio(a); return (a % 4 === 0 && a % 100 !== 0) || a % 400 === 0; };
  const diasDelAnio = a => (esBisiesto(a) ? 366 : 365);
  const DM = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  function diasDelMes(m, a) { numero(m, 'el mes', { entero: true, min: 1, max: 12 }); return m === 2 && esBisiesto(a) ? 29 : (anio(a), DM[m - 1]); }
  function fecha(f, que) {
    if (!f || typeof f !== 'object') throw new Error(`${que} debe ser una fecha { a, m, d }`);
    anio(f.a); numero(f.m, `el mes de ${que}`, { entero: true, min: 1, max: 12 });
    numero(f.d, `el día de ${que}`, { entero: true, min: 1, max: diasDelMes(f.m, f.a) });
    return f;
  }
  // Días desde una fecha fija (algoritmo de días civiles, calendario gregoriano proléptico).
  function ordinal(f) {
    let y = f.a; const m = f.m; if (m <= 2) y -= 1;
    const era = Math.floor(y / 400), yoe = y - era * 400, mp = (m + 9) % 12;
    const doy = Math.floor((153 * mp + 2) / 5) + f.d - 1, doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy;
    return era * 146097 + doe;
  }
  // 0000-03-01 (ordinal 0) fue miércoles en el gregoriano proléptico.
  function diaSemana(f) { fecha(f, 'la fecha'); const i = mod(ordinal(f) + 2, 7); return { indice: i, nombre: DIAS[i] }; }
  function diasEntre(f1, f2) { fecha(f1, 'la primera fecha'); fecha(f2, 'la segunda fecha'); return ordinal(f2) - ordinal(f1); }
  function semanas(d) { numero(d, 'los días', { entero: true, noNegativo: true }); return { semanas: Math.floor(d / 7), resto: d % 7 }; }
  function indiceDia(x, que) {
    if (typeof x === 'number') { numero(x, que, { entero: true, min: 0, max: 6 }); return x; }
    const i = DIAS.indexOf(x);
    if (i < 0) throw new Error(`${que} desconocido: ${x}`);
    return i;
  }
  // Los 29 de febrero que hay entre f1 (excluida) y f2 (incluida), si f2 va después.
  function febreros29(f1, f2) {
    const [p, q] = ordinal(f1) <= ordinal(f2) ? [f1, f2] : [f2, f1];
    let n = 0;
    for (let y = p.a; y <= q.a; y++) if (esBisiesto(y)) { const o = ordinal({ a: y, m: 2, d: 29 }); if (o > ordinal(p) && o <= ordinal(q)) n++; }
    return n;
  }
  function desdeFecha(o) {
    const f1 = fecha(o.desde, 'la fecha de partida'), f2 = fecha(o.hasta, 'la fecha buscada');
    const dia = o.dia === undefined ? diaSemana(f1).indice : indiceDia(o.dia, 'el día');
    const dias = diasEntre(f1, f2), s = Math.sign(dias) || 1, resto = mod(dias, 7);
    const i = mod(dia + dias, 7), b = febreros29(f1, f2);
    const x = apartar({ contarPartida: DIAS[mod(dia + dias + s, 7)], sinBisiestos: b ? DIAS[mod(dia + dias - s * b, 7)] : null,
      alReves: DIAS[mod(dia - dias, 7)] }, DIAS[i]);
    return { dias, semanas: Math.floor(Math.abs(dias) / 7), resto, febreros29: b, indice: i, nombre: DIAS[i], errores: x.errores, coinciden: x.coinciden };
  }
  function mes(o) {
    const n = numero(o.diasMes, 'los días del mes', { entero: true, min: 28, max: 31 }), p = indiceDia(o.primerDia, 'el primer día');
    const conteo = [0, 0, 0, 0, 0, 0, 0];
    for (let d = 0; d < n; d++) conteo[(p + d) % 7]++;
    const cinco = []; for (let k = 0; k < n - 28; k++) cinco.push(DIAS[(p + k) % 7]);
    const uno = []; for (let k = 0; k < n - 27; k++) uno.push(DIAS[(p + k) % 7]);
    const x = apartar({ soloElPrimero: [DIAS[p]], unoDeMas: uno, ninguno: [] }, cinco);
    return { conteo, cinco, ultimo: DIAS[(p + n - 1) % 7], errores: x.errores, coinciden: x.coinciden };
  }
  function bisiestos(o) {
    const desde = anio(o.desde), hasta = anio(o.hasta);
    if (hasta < desde) throw new Error('el año final debe ser mayor o igual que el inicial');
    const lista = [], c4 = [], s400 = [];
    for (let y = desde; y <= hasta; y++) { if (esBisiesto(y)) lista.push(y); if (y % 4 === 0) { c4.push(y); if (y % 100 !== 0) s400.push(y); } }
    const x = apartar({ soloCada4: c4.length, sinRegla400: s400.length }, lista.length);
    return { cuantos: lista.length, lista, errores: x.errores, coinciden: x.coinciden };
  }

  function agujas(minutos) {
    numero(minutos, 'los minutos');
    const x = mod(minutos, 720);
    let H = Math.floor(x / 60 + EPS), M = limpio(x - 60 * H);
    if (M < 0) M = 0;
    if (M >= 60) { H += 1; M = 0; }
    H %= 12;
    const P = posiciones({ H, M }), A = angulo({ H, M });
    return { H, M, horario: P.horario, minutero: P.minutero, menor: A.menor, formula: A.formula };
  }
  // Inversa de ordinal (algoritmo de días civiles).
  function sumarDias(f, n) {
    fecha(f, 'la fecha'); numero(n, 'los días', { entero: true });
    const z = ordinal(f) + n, era = Math.floor(z / 146097), doe = z - era * 146097;
    const yoe = Math.floor((doe - Math.floor(doe / 1460) + Math.floor(doe / 36524) - Math.floor(doe / 146096)) / 365);
    const doy = doe - (365 * yoe + Math.floor(yoe / 4) - Math.floor(yoe / 100)), mp = Math.floor((5 * doy + 2) / 153);
    const d = doy - Math.floor((153 * mp + 2) / 5) + 1, m = mp < 10 ? mp + 3 : mp - 9;
    return { a: yoe + era * 400 + (m <= 2 ? 1 : 0), m, d };
  }

  // ---------- Formato de hora ----------
  function reloj12(minutos) {
    numero(minutos, 'los minutos');
    const x = mod(minutos, 1440), h24 = Math.floor(x / 60 + EPS) % 24, m = limpio(x - 60 * h24);
    return { h: h24 % 12 === 0 ? 12 : h24 % 12, m: m < 0 ? 0 : m, sufijo: h24 < 12 ? 'a. m.' : 'p. m.' };
  }

  return { DIAS, fraccion, posiciones, angulo, horaConAngulo, coincidencias, vuelveHoraCorrecta, horaMarcada, horaReal, dosRelojes,
    campanadas, campanadasEn, esBisiesto, diasDelAnio, diasDelMes, bisiestos, diaSemana, diasEntre, semanas, desdeFecha, mes, agujas, sumarDias, reloj12 };
});
