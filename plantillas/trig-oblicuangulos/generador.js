/*
 * Generador «Triángulos oblicuángulos: cosenos, senos, tangentes y áreas». Formato "predicciones"
 * (docs/arquitectura.md). Funciona en el navegador (window.Generadores['trig-oblicuangulos']) y en Node.
 *
 * Convención de academia: sen 37° = 3/5, sen 53° = 4/5, sen 16° = 7/25, sen 74° = 24/25, tan 8° = 1/7,
 * tan(53°/2) = 1/2 y tan(37°/2) = 1/3; para un obtuso, sen(180° − x) = sen x y cos(180° − x) = −cos x.
 * En un triángulo ABC, a es el lado opuesto a A, b el opuesto a B y c el opuesto a C. Ángulos en grados.
 *
 * Tipos y campos de _datos:
 *   ceviana        Terreno ABC con AB = c, BC = a, CA = b; un alambre une A con un punto D del lado BC y mide d.
 *                  { a, b2, c, d, pide }, con b2 = CA² (CA puede salir como raíz); pide 'BD' o 'DC'. Se halla cos B con los tres lados y luego BD con la ley
 *                  de cosenos en ABD (una sola raíz cae dentro del lado BC).
 *   faro           Distancia entre dos barcos vistos desde un faro; theta: ángulo entre las direcciones horizontales
 *                  desde el pie del faro hacia los barcos. { sub, theta, p, q, h, tA, tB, L1, L2 }.
 *                  sub 'directo': los barcos están a p y q del pie del faro.
 *                  sub 'depresion': el faro mide h y los barcos se ven con depresiones de tangentes tA y tB
 *                  (distancias horizontales h/tA y h/tB).
 *                  sub 'visuales': el faro mide h y los barcos están a L1 y L2 de la luz (en línea recta).
 *   ley-tangentes  { sub, a, b, C, s, k }. sub 'semidiferencia': lados a > b y el ángulo C entre ellos; respuesta
 *                  tan((A − B)/2) = (a − b)/(a + b) · cot(C/2). sub 'rectangulo': triángulo recto en C con
 *                  a + b = s y tan((A − B)/2) = k; respuesta el área a·b/2 (en m²).
 *   areas          { sub, b, c, A }. sub 'area': S = b·c·sen A / 2. sub 'bisectriz': longitud de la bisectriz del
 *                  ángulo A (entre los lados b y c) hasta el lado opuesto: 2bc·cos(A/2)/(b + c); con A = 90°
 *                  es la bisectriz del ángulo recto hasta la hipotenusa.
 *   circunradio    { sub, R, A, B, a, p }. sub 'area-R': circunradio R y dos ángulos A y B (C = 180° − A − B);
 *                  respuesta S = 2R²·sen A·sen B·sen C. sub 'lado-R': lado a y su ángulo opuesto A; respuesta
 *                  R = a/(2 sen A). sub 'perimetro': perímetro p y ángulos A, B; respuesta el área.
 *   circunradio, sub 'en-funcion' (sale en cerca del 11 % de las semillas, por un sorteo aparte): triángulo ABC
 *                  recto en C con perímetro 2p y ángulo agudo θ en A. { sub, pide }: pide 'area' (respuesta
 *                  «p²·senθ·cosθ/((1 + senθ)·(1 + cosθ))») o 'radio' («p/(1 + senθ + cosθ)»). Respuesta en texto.
 *   ley-tangentes, sub 'constante' (otro 11 %, sorteo aparte): { sub, forma }, forma es la identidad escrita con
 *                  una constante k (p. ej. «(a − b)/(a + b) = k·tan((A − B)/2)»); respuesta k en función de C, en texto
 *                  («tan(C/2)», «cot(C/2)»…).
 *   lado-minimo    Ángulo A y área S fijos; los lados b y c varían. { sub, A, k, S }. S está en m² (S = k²·sen A / 2).
 *                  sub 'valor': el menor valor posible de a. sub 'lados': cuánto miden b y c cuando a es mínimo
 *                  (b = c = k).
 *   doblez         Hoja rectangular ABCD con AB = L y BC = W (L > W); se dobla para que C caiga sobre A; el doblez
 *                  corta AB en E. { sub, L, W }. sub 'coseno': cos del ángulo AEC (obtuso, con la hoja desdoblada)
 *                  = −(L² − W²)/(L² + W²). sub 'longitud': AE = (L² + W²)/(2L).
 *
 * Errores: TR12 (signo del coseno de un obtuso) y TR9 (razón equivocada) son «parcial» con fuente en
 * docs/investigacion/trigonometria-ideas-erroneas.md; TR24 (ley de cosenos con el signo cambiado) está en ese
 * informe sin estudio, así que va como hipótesis. Los OB-* son hipótesis nuestras.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'trig-oblicuangulos';
  const TRF = 'docs/investigacion/trigonometria-ideas-erroneas.md';
  const h = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente: null });
  const p = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'parcial', fuente: TRF });
  const v = P.v;

  // ---------- Números exactos: q·√r ----------
  const LIBRES = [];
  for (let r = 1; r <= 120; r++) { let ok = true; for (let k = 2; k * k <= r; k++) if (r % (k * k) === 0) { ok = false; break; } if (ok) LIBRES.push(r); }
  const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  function exacto(x, dmax = 60, rmax = 120) {
    if (!Number.isFinite(x)) return null;
    if (Math.abs(x) < 1e-12) return '0';
    for (const r of LIBRES) {
      if (r > rmax) break;
      const y = x / Math.sqrt(r);
      for (let d = 1; d <= dmax; d++) {
        const n = Math.round(y * d);
        if (n === 0 || Math.abs(n) > 1e6) continue;
        if (Math.abs(y * d - n) < 1e-10 + 1e-12 * Math.abs(n)) {
          const g = mcd(n, d), nn = Math.abs(n / g), dd = d / g, s = n < 0 ? '−' : '';
          if (r === 1) return s + P.formatear(nn, 0) + (dd === 1 ? '' : '/' + dd);
          return s + (nn === 1 ? '' : P.formatear(nn, 0)) + '√' + r + (dd === 1 ? '' : '/' + dd);
        }
      }
    }
    return null;
  }
  const ex = x => exacto(x) || exacto(x, 3000, 1) || P.formatear(x, 2);
  const fr = ([n, d]) => (d === 1 ? `${n}` : `${n}/${d}`);
  const entreP = t => (/[/√]/.test(t) || t.startsWith('−') ? `(${t})` : t);
  const FORMAS = {
    longitud: x => x > 0 && exacto(x) !== null && !exacto(x).includes('/'),
    fraccion: x => exacto(x) !== null && !exacto(x).includes('√') && x !== 0,
    mixta: x => x > 0 && exacto(x) !== null,
  };

  // ---------- Razones de academia ----------
  const r2 = Math.SQRT2, r3 = Math.sqrt(3), r5 = Math.sqrt(5), r10 = Math.sqrt(10);
  const BASE = {
    0: [0, 1], 8: [r2 / 10, 7 * r2 / 10], 16: [7 / 25, 24 / 25], 18.5: [1 / r10, 3 / r10], 26.5: [1 / r5, 2 / r5], 30: [1 / 2, r3 / 2],
    37: [3 / 5, 4 / 5], 45: [r2 / 2, r2 / 2], 53: [4 / 5, 3 / 5], 60: [r3 / 2, 1 / 2], 63.5: [2 / r5, 1 / r5], 71.5: [3 / r10, 1 / r10],
    74: [24 / 25, 7 / 25], 82: [7 * r2 / 10, r2 / 10], 90: [1, 0],
  };
  function trig(g) {
    if (BASE[g]) return { sen: BASE[g][0], cos: BASE[g][1] };
    if (BASE[180 - g]) return { sen: BASE[180 - g][0], cos: -BASE[180 - g][1] };
    throw new Error(`ángulo sin razones de academia: ${g}°`);
  }
  const sen = g => trig(g).sen, cos = g => trig(g).cos;
  const cot = g => cos(g) / sen(g);

  // ---------- Cálculo (regla 1): funciones puras, las mismas que verifica papel.json ----------
  const calc = {
    trig,
    leyCosenos: ({ b, c, A }) => Math.sqrt(b * b + c * c - 2 * b * c * cos(A)),
    cosLLL: ({ a, b, c }) => (b * b + c * c - a * a) / (2 * b * c),
    // D en BC con AD = d: x² − 2c·cos B·x + c² − d² = 0, y se queda la raíz de (0, a).
    ceviana: ({ a, b, c, d }) => {
      const cB = (a * a + c * c - b * b) / (2 * a * c);
      const r = raices(1, -2 * c * cB, c * c - d * d).filter(x => x > 1e-9 && x < a - 1e-9);
      if (r.length !== 1) throw new Error('el alambre no da un solo punto D en BC');
      return { BD: r[0], DC: a - r[0], cosB: cB };
    },
    faro: ({ p, q, theta }) => Math.sqrt(p * p + q * q - 2 * p * q * cos(theta)),
    tanSemidiferencia: ({ a, b, C }) => (a - b) / (a + b) * cot(C / 2),
    catetosTangentes: ({ s, k }) => { const kk = num(k), a = s * (1 + kk) / 2, b = s * (1 - kk) / 2; return { a, b, area: a * b / 2 }; },
    areaLAL: ({ b, c, A }) => b * c * sen(A) / 2,
    bisectriz: ({ b, c, A }) => 2 * b * c * cos(A / 2) / (b + c),
    radio: ({ a, A }) => a / (2 * sen(A)),
    areaCircunradio: ({ R, A, B }) => 2 * R * R * sen(A) * sen(B) * sen(180 - A - B),
    areaPerimetro: ({ p, A, B }) => { const C = 180 - A - B, R = p / (2 * (sen(A) + sen(B) + sen(C))); return 2 * R * R * sen(A) * sen(B) * sen(C); },
    // bc = 2S/sen A fijo; a² = (b − c)² + 2bc(1 − cos A): mínimo con b = c.
    ladoMinimo: ({ S, A }) => { const bc = 2 * S / sen(A); return { a: Math.sqrt(2 * bc * (1 - cos(A))), b: Math.sqrt(bc) }; },
    doblez: ({ L, W }) => ({ AE: (L * L + W * W) / (2 * L), cos: -(L * L - W * W) / (L * L + W * W) }),
  };
  function num(k) { return Array.isArray(k) ? k[0] / k[1] : k; }
  function raices(A2, B, C) {
    const disc = B * B - 4 * A2 * C;
    if (disc < -1e-9) return [];
    const r = Math.sqrt(Math.max(0, disc));
    return [(-B - r) / (2 * A2), (-B + r) / (2 * A2)].sort((x, y) => x - y);
  }

  const TIPOS = ['ceviana', 'faro', 'ley-tangentes', 'areas', 'circunradio', 'lado-minimo', 'doblez'];
  function generar(semilla) {
    // Un sorteo aparte decide si sale un problema simbólico; así el resto de semillas no cambia.
    const simb = Azar.crear(ID + '|simbolico|' + semilla).sig();
    if (simb < 0.22) return simb < 0.11 ? circunradioSimbolico(semilla) : tangentesSimbolico(semilla);
    const rng = Azar.crear(ID + '|' + semilla);
    const tipo = rng.elegir(TIPOS), pref = rng.sig();   // pref fija el subtipo en todos los intentos
    for (let intento = 0; intento < 200; intento++) {
      const pr = construir(rng, semilla, tipo, pref);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  const porPref = (pref, lista) => lista[Math.min(lista.length - 1, Math.floor(pref * lista.length))];
  function construir(rng, semilla, tipo, pref) {
    const r = ({ ceviana, faro, 'ley-tangentes': leyTangentes, areas, circunradio, 'lado-minimo': ladoMinimo, doblez })[tipo](rng, pref);
    if (!r) return null;
    const { correcta, unidad = 'm', forma = 'longitud', negativos = false } = r;
    const ok = FORMAS[forma];
    if (!ok(correcta)) return null;
    const errores = r.errores.filter(e => Number.isFinite(e.valor) && (negativos || e.valor > 0) && ok(e.valor));
    const texto = x => exacto(x) + (unidad ? ' ' + unidad : '');
    const alternativas = P.armar({ correcta, errores, rng, texto, negativos });
    return {
      id: `${ID}#${semilla}`, variables: r.variables, enunciado: r.enunciado, pregunta: r.pregunta, datos: '',
      alternativas, solucion: r.solucion, respuesta: { valor: correcta, unidad }, _datos: { tipo, ...r.datos },
    };
  }

  // ---------- ceviana: ley de cosenos dos veces ----------
  const CEVIANAS = [];
  for (const B of [60, 120, 37, 53, 127, 143]) for (let c = 2; c <= 30; c++) for (let x = 1; x <= 30; x++) {
    const d2 = c * c + x * x - 2 * c * x * cos(B), d = Math.round(Math.sqrt(d2));
    if (Math.abs(d2 - Math.round(d2)) > 1e-9 || d * d !== Math.round(d2) || d === 0) continue;
    for (let a = x + 1; a <= x + 25; a++) {
      const b2 = c * c + a * a - 2 * a * c * cos(B);
      if (Math.abs(b2 - Math.round(b2)) > 1e-9 || b2 <= 0) continue;
      const b = Math.sqrt(Math.round(b2)), x2 = 2 * c * cos(B) - x;
      if (x2 > -0.5 && x2 < a + 0.5) continue;                  // la otra raíz no debe caer en el lado (ni en sus extremos)
      if (!Number.isInteger(b) && exacto(b) === null) continue;
      CEVIANAS.push({ B, c, x, d, a, b: Number.isInteger(b) ? b : Math.round(b2), bEntero: Number.isInteger(b), x2 });
    }
  }
  function ceviana(rng, pref) {
    const pide = pref < 0.7 ? 'BD' : 'DC';
    const enteros = CEVIANAS.filter(o => o.bEntero);
    const lista = rng.sig() < 0.5 ? enteros : CEVIANAS;
    for (let k = 0; k < 60; k++) {
      const r = cevianaCon(rng.elegir(lista), pide);
      const distintos = new Set(r.errores.filter(e => FORMAS.longitud(e.valor)).map(e => exacto(e.valor)));
      distintos.delete(exacto(r.correcta));
      if (distintos.size >= 3) return r;
    }
    return null;
  }
  function cevianaCon(o, pide) {
    const b = o.bEntero ? o.b : Math.sqrt(o.b), { a, c, d, x, B } = o;
    const correcta = pide === 'BD' ? x : a - x, cB = cos(B);
    const variables = {
      c: { nombre: 'lado AB', color: 'o' }, a: { nombre: 'lado BC', color: 'i' }, d: { nombre: 'alambre AD', color: 'd' }, x: { nombre: pide, color: 'h' },
    };
    const bTxt = ex(b);
    const enunciado = ['Un terreno tiene forma de triángulo ABC, con AB = ', v('c', `${c} m`), ', BC = ', v('a', `${a} m`), ` y CA = ${bTxt} m. Un alambre recto va del vértice A a un punto D del lado BC y mide AD = `, v('d', `${d} m`), '.'];
    const pregunta = [`¿Cuánto mide ${pide}?`];
    const otraX = o.x2, signo = raices(1, 2 * c * cB, c * c - d * d).filter(z => z > 0)[0];
    const aPide = z => (pide === 'BD' ? z : a - z);
    const errores = [
      h('OB-segmento-cambiado', pide === 'BD' ? a - x : x, pide === 'BD' ? 'Ese es DC. La ley de cosenos en el triángulo ABD, con el ángulo B, da la distancia desde B.' : 'Ese es BD, la distancia desde B. Se pide DC = BC − BD.'),
      otraX > 0 ? h('OB-otra-raiz', Math.abs(aPide(otraX)), `La ecuación de segundo grado tiene otra raíz, ${ex(otraX)}, pero con ella D quedaría fuera del lado BC (que mide ${a}), más allá de C.`)
                : h('OB-otra-raiz', aPide(-otraX), `La otra raíz de la ecuación es negativa (${ex(otraX)}): D quedaría al otro lado de B, fuera del terreno. No se toma su valor absoluto.`),
      h('TR24', aPide(signo), 'Cambiaste el signo del término 2·AB·BD·cos B en la ley de cosenos. Es AD² = AB² + BD² − 2·AB·BD·cos B; si B es obtuso, el coseno es negativo y el término termina sumando solo.'),
      h('OB-pitagoras', aPide(Math.sqrt(Math.abs(d * d - c * c))), 'Usaste Pitágoras en el triángulo ABD, como si el ángulo B fuera recto. B no es recto: hay que hallar cos B con los tres lados del terreno.'),
      h('OB-punto-medio', a / 2, 'Supusiste que D es el punto medio de BC. Nada lo dice: D se ubica con la longitud del alambre.'),
    ];
    // Ángulo equivocado: en el triángulo del segmento pedido se usa el coseno del otro vértice.
    const cC = (a * a + b * b - c * c) / (2 * a * b);
    const [lado, cosOtro] = pide === 'BD' ? [c, cC] : [b, cB];
    const equivocada = raices(1, -2 * lado * cosOtro, lado * lado - d * d).filter(z => z > 0);
    if (equivocada.length) errores.push(h('OB-angulo-equivocado', equivocada[equivocada.length - 1], pide === 'BD'
      ? 'Usaste cos C en el triángulo ABD. En ABD, el ángulo entre AB y BD es B: va cos B.'
      : 'Usaste cos B en el triángulo ADC. En ADC, el ángulo entre CA y CD es C: va cos C (o halla BD con cos B y réstalo de BC).'));
    const solucion = [
      ['Ley de cosenos en ABC para hallar cos B: ', `cos B = (AB² + BC² − CA²)/(2·AB·BC) = (${c * c} + ${a * a} − ${Math.round(b * b)})/(2·${c}·${a}) = ${ex(cB)}.`],
      ['Ley de cosenos en ABD, con BD = x: ', v('d', `${d}`), '² = ', v('c', `${c}`), `² + x² − 2·${c}·x·${entreP(ex(cB))}.`],
      [`x² ${2 * c * cB >= 0 ? '−' : '+'} ${ex(Math.abs(2 * c * cB))}x ${c * c - d * d >= 0 ? '+' : '−'} ${Math.abs(c * c - d * d)} = 0 → x = ${ex(x)} o x = ${ex(otraX)}. Solo ${ex(x)} cae dentro de BC (entre 0 y `, v('a', `${a}`), ').'],
      pide === 'BD' ? ['BD = ', v('x', `${ex(x)} m`), '.'] : ['DC = ', `${a} − ${ex(x)} = `, v('x', `${ex(correcta)} m`), '.'],
    ];
    return { correcta, errores, variables, enunciado, pregunta, solucion, datos: { a, b2: Math.round(b * b), c, d, pide } };
  }

  // ---------- faro ----------
  const THETAS = [60, 120, 37, 53, 127, 143, 90];
  const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]];
  function faro(rng, pref) {
    const sub = porPref(pref, ['directo', 'depresion', 'visuales']);
    const theta = rng.elegir(THETAS);
    let pp, q, hh = null, tA = null, tB = null, L1 = null, L2 = null;
    if (sub === 'directo') { pp = rng.entero(2, 15); q = rng.entero(2, 15); if (pp === q) return null; }
    else if (sub === 'depresion') {
      const TS = [[1, 2], [1, 3], [2, 3], [3, 4], [1, 4], [4, 3], [1, 1], [3, 2], [5, 12], [7, 24], [2, 1], [3, 1]];
      const [x, y] = [rng.elegir(TS), rng.elegir(TS)];
      if (x[0] * y[1] === y[0] * x[1]) return null;
      hh = rng.elegir([12, 24, 36, 48, 60, 72, 84, 120, 168]);
      pp = hh * x[1] / x[0]; q = hh * y[1] / y[0]; tA = x; tB = y;
      if (!Number.isInteger(pp) || !Number.isInteger(q)) return null;
    } else {
      // h es cateto común de dos ternas pitagóricas (escaladas): horizontales pp y q, visuales L1 y L2.
      const opciones = [];
      for (const t1 of TRIPLES) for (const k1 of [1, 2, 3, 4, 5, 6]) for (const i1 of [0, 1]) {
        const H = t1[i1] * k1;
        for (const t2 of TRIPLES) for (const k2 of [1, 2, 3, 4, 5, 6]) for (const i2 of [0, 1]) {
          if (t2[i2] * k2 !== H) continue;
          const a1 = t1[1 - i1] * k1, a2 = t2[1 - i2] * k2;
          if (a1 < a2 && H <= 60) opciones.push([H, a1, t1[2] * k1, a2, t2[2] * k2]);
        }
      }
      [hh, pp, L1, q, L2] = rng.elegir(opciones);
    }
    const cruz = 2 * pp * q * cos(theta);
    if (Math.abs(cruz - Math.round(cruz)) > 1e-9) return null;
    const correcta = calc.faro({ p: pp, q, theta });
    const u = sub === 'directo' ? 'km' : 'm';
    const variables = {
      p: { nombre: 'distancia al primer barco', color: 'o' }, q: { nombre: 'distancia al segundo barco', color: 'i' },
      t: { nombre: 'ángulo entre las direcciones', color: 'd' }, D: { nombre: 'distancia entre los barcos', color: 'h' },
    };
    let enunciado;
    const angTxt = ['. Vistas desde el pie del faro, las direcciones horizontales hacia los dos barcos forman un ángulo de ', v('t', `${theta}°`), '. El mar está en calma (es un plano horizontal).'];
    if (sub === 'directo') enunciado = ['Desde un faro se observan dos barcos. Uno está a ', v('p', `${pp} km`), ' del pie del faro y el otro a ', v('q', `${q} km`), ...angTxt];
    else if (sub === 'depresion') enunciado = [`Desde la luz de un faro, a ${hh} m sobre el nivel del mar, se ve un barco con un ángulo de depresión de tangente `, v('p', fr(tA)), ' y otro con un ángulo de depresión de tangente ', v('q', fr(tB)), ...angTxt];
    else enunciado = [`La luz de un faro está a ${hh} m sobre el nivel del mar. Un barco está a `, v('p', `${L1} m`), ' de la luz y otro a ', v('q', `${L2} m`), ' (distancias en línea recta desde la luz)', ...angTxt];
    const pregunta = ['¿Qué distancia separa a los dos barcos?'];
    const errores = [
      h('TR24', Math.sqrt(pp * pp + q * q + 2 * pp * q * cos(theta)), 'Cambiaste el signo de la ley de cosenos. Es D² = p² + q² − 2pq·cos θ: con θ obtuso el coseno es negativo y el término ya suma solo.'),
      h('OB-pitagoras', Math.sqrt(pp * pp + q * q), `Usaste Pitágoras, que solo vale si las direcciones forman 90°. Con ${theta}° falta el término −2pq·cos θ.`),
      h('OB-sin-raiz', correcta * correcta, `Calculaste D² y olvidaste sacar la raíz cuadrada.`),
      h('OB-resta-distancias', Math.abs(pp - q), 'Restaste las distancias como si los barcos estuvieran en la misma dirección. Forman un ángulo: va la ley de cosenos.'),
    ];
    if (sub !== 'directo') {
      const l1 = sub === 'visuales' ? L1 : Math.hypot(pp, hh), l2 = sub === 'visuales' ? L2 : Math.hypot(q, hh);
      errores.unshift(h('OB-distancia-visual', Math.sqrt(l1 * l1 + l2 * l2 - 2 * l1 * l2 * cos(theta)), 'Usaste en la ley de cosenos las visuales desde la luz del faro. El ángulo θ está en el plano del mar, en el pie del faro: ahí los lados son las distancias horizontales.'));
      if (sub === 'depresion') errores.unshift(h('OB-tangente-por-cotangente', calc.faro({ p: hh * tA[0] / tA[1], q: hh * tB[0] / tB[1], theta }), 'Multiplicaste la altura por la tangente de la depresión. La distancia horizontal es el cateto adyacente al ángulo: altura·cot, es decir, altura dividida entre la tangente.'));
    }
    const pasoDist = sub === 'directo' ? null
      : sub === 'depresion' ? ['Distancias horizontales desde el pie del faro: ', v('p', `${hh}·${fr([tA[1], tA[0]])} = ${pp} m`), ' y ', v('q', `${hh}·${fr([tB[1], tB[0]])} = ${q} m`), ' (altura · cot de la depresión).']
      : ['Distancias horizontales, con Pitágoras en cada triángulo vertical: ', v('p', `√(${L1}² − ${hh}²) = ${pp} m`), ' y ', v('q', `√(${L2}² − ${hh}²) = ${q} m`), '.'];
    const solucion = [
      ...(pasoDist ? [pasoDist] : []),
      ['En el plano del mar, el triángulo pie–barco–barco tiene lados ', v('p', `${pp}`), ' y ', v('q', `${q}`), ' con ', v('t', `${theta}°`), ' entre ellos: ley de cosenos.'],
      theta === 90 ? [`Como cos 90° = 0, queda Pitágoras: D² = ${pp}² + ${q}² = ${ex(correcta * correcta)}.`]
        : [`D² = ${pp}² + ${q}² − 2·${pp}·${q}·${entreP(ex(cos(theta)))} = ${ex(pp * pp + q * q)} ${-cruz >= 0 ? '+' : '−'} ${ex(Math.abs(cruz))} = ${ex(correcta * correcta)}.`],
      ['D = ', v('D', `${ex(correcta)} ${u}`), '.'],
    ];
    return { correcta, errores, variables, enunciado, pregunta, solucion, unidad: u, datos: { sub, theta, p: pp, q, h: hh, tA: tA && tA[0] / tA[1], tB: tB && tB[0] / tB[1], L1, L2 } };
  }

  // ---------- ley de tangentes ----------
  const COT_MEDIO = { 60: '√3', 90: '1', 120: '√3/3', 74: '4/3', 106: '3/4', 53: '2', 127: '1/2', 37: '3', 143: '1/3' };
  const MEDIO = { 60: '30°', 90: '45°', 120: '60°', 74: '37°', 106: '53°', 53: '53°/2', 127: '127°/2', 37: '37°/2', 143: '143°/2' };
  function leyTangentes(rng, pref) {
    const sub = pref < 0.6 ? 'semidiferencia' : 'rectangulo';
    if (sub === 'semidiferencia') {
      const C = rng.elegir(Object.keys(COT_MEDIO).map(Number));
      const b = rng.entero(2, 15), a = b + rng.entero(1, 12);
      const k = (a - b) / (a + b), ct = cot(C / 2), correcta = k * ct;
      const variables = {
        a: { nombre: 'lado a', color: 'o' }, b: { nombre: 'lado b', color: 'i' }, C: { nombre: 'ángulo C', color: 'd' }, T: { nombre: 'tan((A − B)/2)', color: 'h' },
      };
      const enunciado = ['En el triángulo ABC, los lados BC y CA miden a = ', v('a', `${a}`), ' y b = ', v('b', `${b}`), ', y el ángulo entre ellos mide C = ', v('C', `${C}°`), '.'];
      const pregunta = ['¿Cuánto vale tan((A − B)/2)?'];
      const errores = [
        h('OB-tangentes-invertida', (a + b) / (a - b) * ct, 'Pusiste la razón de lados al revés. En la ley de tangentes, la diferencia de lados va con la semidiferencia de ángulos: (a − b)/(a + b) = tan((A − B)/2)/tan((A + B)/2).'),
        h('OB-tangente-de-C-medio', k / ct, `Usaste tan(C/2) en lugar de cot(C/2). (A + B)/2 = 90° − C/2, así que tan((A + B)/2) = cot(C/2) = ${COT_MEDIO[C]}.`),
        h('OB-sin-semisuma', k, 'Te quedaste con (a − b)/(a + b). Falta multiplicar por tan((A + B)/2), que no vale 1 salvo que C sea recto.'),
        h('OB-angulo-sin-mitad', k * cot(C), 'Usaste cot C en vez de cot(C/2): en la ley de tangentes van los semiángulos.'),
      ];
      const solucion = [
        ['Ley de tangentes: (a − b)/(a + b) = tan((A − B)/2) / tan((A + B)/2).'],
        ['A + B = 180° − ', v('C', `${C}°`), `, así que (A + B)/2 = 90° − ${MEDIO[C]} y tan((A + B)/2) = cot ${MEDIO[C]} = ${COT_MEDIO[C]}.`],
        ['(a − b)/(a + b) = (', v('a', `${a}`), ' − ', v('b', `${b}`), `)/(${a} + ${b}) = ${ex(k)}.`],
        ['tan((A − B)/2) = ', `${ex(k)} · ${COT_MEDIO[C]} = `, v('T', ex(correcta)), '.'],
      ];
      return { correcta, errores, variables, enunciado, pregunta, solucion, unidad: '', forma: 'mixta', datos: { sub, a, b, C } };
    }
    const KS = [[1, 7], [1, 2], [1, 3], [1, 5], [1, 4], [2, 3], [3, 5], [2, 5], [1, 6]];
    const kk = rng.elegir(KS), kv = kk[0] / kk[1];
    const s = 2 * kk[1] * rng.entero(1, 4);
    const a = s * (1 + kv) / 2, b = s * (1 - kv) / 2;
    if (!Number.isInteger(Math.round(a * 1e9) / 1e9) || !Number.isInteger(Math.round(b * 1e9) / 1e9)) return null;
    const correcta = a * b / 2;
    const variables = {
      s: { nombre: 'suma de catetos', color: 'o' }, k: { nombre: 'tan((A − B)/2)', color: 'i' }, d: { nombre: 'diferencia de catetos', color: 'd' }, S: { nombre: 'área', color: 'h' },
    };
    const enunciado = ['Un terreno tiene forma de triángulo ABC, recto en C. Sus catetos BC = a y CA = b (con a > b) suman ', v('s', `${s} m`), ', y los ángulos agudos cumplen ', v('k', `tan((A − B)/2) = ${kk[0]}/${kk[1]}`), '.'];
    const pregunta = ['¿Cuál es el área del terreno?'];
    const errores = [
      h('OB-area-sin-mitad', a * b, 'Multiplicaste los catetos y olvidaste dividir entre 2: el área de un triángulo rectángulo es la mitad del producto de los catetos.'),
      h('OB-isosceles', s * s / 8, 'Tomaste los catetos iguales (la mitad de la suma cada uno). Si fueran iguales, A = B y tan((A − B)/2) sería 0.'),
      h('OB-suma-diferencia-como-catetos', s * (kv * s) / 2, 'Usaste la suma y la diferencia de los catetos como si fueran los catetos. Primero hay que despejar a y b.'),
      h('OB-tangente-como-razon', s * s * kv / ((1 + kv) ** 2) / 2, `Tomaste ${kk[0]}/${kk[1]} como la razón b/a. La ley de tangentes dice que (a − b)/(a + b) = tan((A − B)/2) / tan((A + B)/2).`),
    ];
    const solucion = [
      ['Ley de tangentes: (a − b)/(a + b) = tan((A − B)/2) / tan((A + B)/2). Con C = 90°, (A + B)/2 = 45° y tan 45° = 1.'],
      ['a − b = ', v('s', `${s}`), ' · ', v('k', `${kk[0]}/${kk[1]}`), ' = ', v('d', `${ex(kv * s)}`), '.'],
      [`a = (${s} + ${ex(kv * s)})/2 = ${ex(a)} m y b = (${s} − ${ex(kv * s)})/2 = ${ex(b)} m.`],
      ['Área = a·b/2 = ', `${ex(a)}·${ex(b)}/2 = `, v('S', `${ex(correcta)} m²`), '.'],
    ];
    return { correcta, errores, variables, enunciado, pregunta, solucion, unidad: 'm²', datos: { sub, s, k: kk } };
  }

  // ---------- áreas y bisectriz ----------
  const PARES_BIS = [];
  for (let b = 2; b <= 40; b++) for (let c = b + 1; c <= 40; c++) if ((b * c) % (b + c) === 0) PARES_BIS.push([b, c]);
  function areas(rng, pref) {
    const sub = pref < 0.5 ? 'area' : 'bisectriz';
    if (sub === 'area') {
      const A = rng.elegir([30, 150, 37, 53, 127, 143, 45, 135, 60, 120]);
      const b = rng.entero(3, 24), c = rng.entero(3, 24);
      if (b === c) return null;
      const correcta = calc.areaLAL({ b, c, A });
      const variables = { b: { nombre: 'lado b', color: 'o' }, c: { nombre: 'lado c', color: 'i' }, A: { nombre: 'ángulo entre ellos', color: 'd' }, S: { nombre: 'área', color: 'h' } };
      const enunciado = ['Un terreno triangular ABC tiene los lados AB = ', v('c', `${c} m`), ' y AC = ', v('b', `${b} m`), ', que forman en A un ángulo de ', v('A', `${A}°`), '.'];
      const pregunta = ['¿Cuál es el área del terreno?'];
      const errores = [
        h('OB-area-sin-mitad', b * c * sen(A), 'Olvidaste el 1/2: el área es (1/2)·b·c·sen A, la mitad del paralelogramo que forman los dos lados.'),
        p('TR9', b * c * Math.abs(cos(A)) / 2, 'Usaste el coseno donde va el seno. La altura sobre AB es AC·sen A: el seno da el cateto opuesto al ángulo.'),
        h('OB-como-rectangulo', b * c / 2, `Calculaste como si el ángulo A fuera recto. Con ${A}° la altura es AC·sen A, menor que AC.`),
        h('OB-seno-de-otro', A > 90 ? b * c * sen(A - 90) / 2 : b * c * sen(90 - A) / 2, A > 90 ? `Restaste 90° al ángulo. El seno de un obtuso es el de su suplemento: sen ${A}° = sen ${180 - A}°.` : `Usaste el complemento del ángulo (${90 - A}°).`),
      ];
      const solucion = [
        ['La altura desde C sobre AB mide AC·sen A = ', v('b', `${b}`), '·sen ', v('A', `${A}°`), ` = ${b}·${ex(sen(A))}${A > 90 ? ` (sen ${A}° = sen ${180 - A}°)` : ''}.`],
        ['S = (1/2)·AB·AC·sen A = (1/2)·', v('c', `${c}`), '·', v('b', `${b}`), `·${ex(sen(A))} = `, v('S', `${ex(correcta)} m²`), '.'],
      ];
      return { correcta, errores, variables, enunciado, pregunta, solucion, unidad: 'm²', datos: { sub, b, c, A } };
    }
    const A = rng.elegir([60, 90, 120]);
    const [b0, c0] = rng.elegir(PARES_BIS);
    const [b, c] = rng.moneda() ? [b0, c0] : [c0, b0];
    const correcta = calc.bisectriz({ b, c, A });
    const variables = { b: { nombre: 'lado AC', color: 'o' }, c: { nombre: 'lado AB', color: 'i' }, A: { nombre: 'ángulo A', color: 'd' }, w: { nombre: 'bisectriz AD', color: 'h' } };
    const enunciado = A === 90
      ? ['En el triángulo ABC, recto en A, los catetos miden AB = ', v('c', `${c} cm`), ' y AC = ', v('b', `${b} cm`), '. El punto D de la hipotenusa BC cumple ∠BAD = ∠DAC.']
      : ['En el triángulo ABC, AB = ', v('c', `${c} cm`), ', AC = ', v('b', `${b} cm`), ' y el ángulo A mide ', v('A', `${A}°`), '. La bisectriz del ángulo A corta al lado BC en D.'];
    const pregunta = ['¿Cuánto mide AD?'];
    const m = Math.sqrt(b * b + c * c + 2 * b * c * cos(A)) / 2;
    const errores = [
      h('OB-bisectriz-sin-2', correcta / 2, 'Te faltó el 2: al igualar áreas, sen A = 2·sen(A/2)·cos(A/2), y de ahí AD = 2bc·cos(A/2)/(b + c).'),
      h('OB-media-armonica', 2 * b * c / (b + c), 'Usaste 2bc/(b + c) sin el factor cos(A/2). Ese factor sale de comparar sen A con sen(A/2).'),
      h('OB-mediana-por-bisectriz', m, 'Esa es la mediana desde A (D en el punto medio de BC). La bisectriz parte el ángulo en dos iguales, no el lado: D divide BC en la razón AB : AC.'),
      h('OB-area-sin-mitad', 2 * correcta, 'Pusiste el 1/2 en las áreas de las dos partes pero no en la del triángulo grande. Las tres áreas llevan (1/2)·lado·lado·seno.'),
      h('OB-angulo-entero', 2 * b * c * cos(A) / (b + c), 'Usaste cos A en vez de cos(A/2): la bisectriz forma A/2 con cada lado.'),
    ];
    const solucion = [
      ['Las áreas de ABD y ADC suman la de ABC. Con AD = w y cada mitad del ángulo A/2 = ', `${A / 2}°`, ':'],
      ['(1/2)·', v('c', `${c}`), '·w·sen ', `${A / 2}° + (1/2)·`, v('b', `${b}`), `·w·sen ${A / 2}° = (1/2)·${c}·${b}·sen `, v('A', `${A}°`), '.'],
      [`w·(${c} + ${b})·${entreP(ex(sen(A / 2)))} = ${b * c}·${entreP(ex(sen(A)))} → w = (${b * c}·${entreP(ex(sen(A)))}) ÷ (${b + c}·${entreP(ex(sen(A / 2)))}).`],
      ['AD = w = 2bc·cos(A/2)/(b + c) = ', v('w', `${ex(correcta)} cm`), '.'],
    ];
    return { correcta, errores, variables, enunciado, pregunta, solucion, unidad: 'cm', datos: { sub, b, c, A } };
  }

  // ---------- circunradio ----------
  const JUEGOS = [[30, 60], [45, 45], [30, 30], [37, 53], [60, 60], [16, 74], [53, 53], [37, 37], [45, 90], [30, 90]];
  const RACIONALES = [[37, 53], [16, 74], [53, 53], [37, 37]];
  function circunradio(rng, pref) {
    const sub = porPref(pref, ['area-R', 'lado-R', 'perimetro']);
    const variables = { R: { nombre: 'circunradio', color: 'o' }, A: { nombre: 'ángulo A', color: 'i' }, B: { nombre: 'ángulo B', color: 'd' }, S: { nombre: sub === 'lado-R' ? 'circunradio' : 'área', color: 'h' } };
    if (sub === 'lado-R') {
      const A = rng.elegir([30, 150, 37, 53, 127, 143, 45, 135, 60, 120, 74, 106, 90]);
      variables.a = { nombre: 'lado a', color: 'd' }; delete variables.B; delete variables.R;
      let a = null;
      for (const x of rng.barajar(Array.from({ length: 40 }, (_, i) => i + 2))) if (FORMAS.longitud(calc.radio({ a: x, A }))) { a = x; break; }
      if (a === null) return null;
      const correcta = calc.radio({ a, A });
      const enunciado = ['Un terreno triangular ABC está inscrito en una circunferencia (sus tres vértices están sobre ella). El lado BC mide ', v('a', `${a} m`), ' y el ángulo opuesto, A, mide ', v('A', `${A}°`), '.'];
      const pregunta = ['¿Cuánto mide el radio de la circunferencia?'];
      const errores = [
        h('OB-senos-sin-2R', a / sen(A), 'Ese es el diámetro. La ley de senos dice a/sen A = 2R: falta dividir entre 2.'),
        h('OB-senos-invertida', a * sen(A) / 2, 'Multiplicaste por sen A. De a/sen A = 2R se despeja R = a/(2·sen A).'),
        p('TR9', cos(A) !== 0 ? a / (2 * Math.abs(cos(A))) : NaN, 'Usaste el coseno donde va el seno: la ley de senos relaciona cada lado con el seno del ángulo opuesto.'),
        h('OB-sin-seno', a / 2, 'Tomaste el lado como si fuera el diámetro. Eso solo pasa si A = 90°.'),
      ];
      const solucion = [
        ['Ley de senos con la circunferencia circunscrita: a/sen A = 2R.'],
        ['sen ', v('A', `${A}°`), ` = ${ex(sen(A))}${A > 90 ? ` (igual que sen ${180 - A}°)` : ''}, así que 2R = `, v('a', `${a}`), ` / ${entreP(ex(sen(A)))} = ${ex(a / sen(A))}.`],
        ['R = ', v('S', `${ex(correcta)} m`), '.'],
      ];
      return { correcta, errores, variables, enunciado, pregunta, solucion, datos: { sub, a, A } };
    }
    const [A, B] = rng.elegir(sub === 'perimetro' ? RACIONALES : JUEGOS), C = 180 - A - B;
    const prod = sen(A) * sen(B) * sen(C), suma = sen(A) + sen(B) + sen(C);
    if (sub === 'area-R') {
      let R = null;
      for (const x of rng.barajar([2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25])) if (FORMAS.longitud(calc.areaCircunradio({ R: x, A, B })) && FORMAS.longitud(calc.areaCircunradio({ R: x, A, B }) / 4)) { R = x; break; }
      if (R === null) return null;
      const correcta = calc.areaCircunradio({ R, A, B });
      const enunciado = ['Los vértices de un terreno triangular ABC están sobre una circunferencia de radio ', v('R', `${R} m`), '. Los ángulos del terreno en A y en B miden ', v('A', `${A}°`), ' y ', v('B', `${B}°`), '.'];
      const pregunta = ['¿Cuál es el área del terreno?'];
      const errores = [
        h('OB-area-R-sin-2', correcta / 2, 'Usaste S = R²·sen A·sen B·sen C: falta el 2. Con a = 2R·sen A y b = 2R·sen B, el área (1/2)·a·b·sen C da 2R²·sen A·sen B·sen C.'),
        h('OB-area-sin-mitad', correcta * 2, 'Calculaste a·b·sen C sin el 1/2 del área.'),
        h('OB-senos-sin-2R', correcta / 4, 'Tomaste a = R·sen A (sin el 2). La ley de senos da a = 2R·sen A: el diámetro, no el radio.'),
        h('OB-area-un-seno', 2 * R * R * sen(C), 'Te quedaste con 2R²·sen C: faltan los senos de A y B, que salen de los lados a = 2R·sen A y b = 2R·sen B.'),
      ];
      const solucion = [
        [`C = 180° − ${A}° − ${B}° = ${C}°.`],
        ['Ley de senos: a = 2R·sen A y b = 2R·sen B. El área es (1/2)·a·b·sen C = 2R²·sen A·sen B·sen C.'],
        ['S = 2·', v('R', `${R}`), `²·${entreP(ex(sen(A)))}·${entreP(ex(sen(B)))}·${entreP(ex(sen(C)))} = `, v('S', `${ex(correcta)} m²`), '.'],
      ];
      return { correcta, errores, variables, enunciado, pregunta, solucion, unidad: 'm²', datos: { sub, R, A, B } };
    }
    // perímetro: p = 2R·(sen A + sen B + sen C)
    let pp = null;
    for (const x of rng.barajar(Array.from({ length: 120 }, (_, i) => i + 6))) {
      const S = calc.areaPerimetro({ p: x, A, B });
      if (FORMAS.longitud(S) && FORMAS.longitud(S / 4) && FORMAS.longitud(x / (2 * suma))) { pp = x; break; }
    }
    if (pp === null) return null;
    const R = pp / (2 * suma), correcta = calc.areaPerimetro({ p: pp, A, B });
    variables.R = { nombre: 'perímetro', color: 'o' };
    const enunciado = ['Un terreno triangular ABC tiene un perímetro de ', v('R', `${pp} m`), '. Sus ángulos en A y en B miden ', v('A', `${A}°`), ' y ', v('B', `${B}°`), '.'];
    const pregunta = ['¿Cuál es el área del terreno?'];
    const errores = [
      h('OB-area-R-sin-2', correcta / 2, 'Usaste S = R²·sen A·sen B·sen C: falta el 2.'),
      h('OB-area-sin-mitad', correcta * 2, 'Calculaste a·b·sen C sin el 1/2 del área.'),
      h('OB-senos-sin-2R', correcta * 4, 'Tomaste p = R·(sen A + sen B + sen C), sin el 2: el radio te salió el doble y el área, cuatro veces mayor.'),
      h('OB-area-perimetro', pp * R / 2, 'Usaste S = p·R/2. Esa fórmula usa el inradio (el de la circunferencia inscrita), no el circunradio.'),
    ];
    const solucion = [
      [`C = 180° − ${A}° − ${B}° = ${C}°. Ley de senos: a = 2R·sen A, b = 2R·sen B, c = 2R·sen C.`],
      ['Perímetro: ', v('R', `${pp}`), ` = 2R·(${ex(sen(A))} + ${ex(sen(B))} + ${ex(sen(C))}) = 2R·${ex(suma)} → R = ${ex(R)} m.`],
      [`Lados: ${ex(2 * R * sen(A))}, ${ex(2 * R * sen(B))} y ${ex(2 * R * sen(C))} m.`],
      [`S = 2R²·sen A·sen B·sen C = 2·${entreP(ex(R))}²·${ex(prod)} = `, v('S', `${ex(correcta)} m²`), '.'],
    ];
    return { correcta, errores, variables, enunciado, pregunta, solucion, unidad: 'm²', datos: { sub, p: pp, A, B } };
  }

  // ---------- lado mínimo con área y ángulo fijos ----------
  function ladoMinimo(rng, pref) {
    const sub = pref < 0.7 ? 'valor' : 'lados';
    const A = rng.elegir([60, 90, 120, 53, 37, 127, 143]);
    const K = { 60: [2, 4, 6, 8, 10], 120: [2, 4, 6, 8, 10], 90: [2, 4, 6, 8, 10], 53: [5, 10, 15], 127: [5, 10, 15], 37: [10, 20], 143: [10, 20] }[A];
    const k = rng.elegir(K), S = k * k * sen(A) / 2;
    const { a } = calc.ladoMinimo({ S, A });
    const correcta = sub === 'valor' ? a : k;
    const variables = { A: { nombre: 'ángulo A', color: 'd' }, S: { nombre: 'área', color: 'o' }, a: { nombre: sub === 'valor' ? 'lado a mínimo' : 'lados b y c', color: 'h' } };
    const Stxt = ex(S);
    const enunciado = ['Se quiere cercar un jardín con forma de triángulo ABC cuyo ángulo en A mide ', v('A', `${A}°`), ' y cuya área es ', v('S', `${Stxt} m²`), '. Los lados AB y AC pueden tener cualquier longitud que cumpla esas dos condiciones; el lado BC (opuesto a A) es una reja cara.'];
    const pregunta = [sub === 'valor' ? '¿Cuál es la menor longitud posible de BC?' : '¿Cuánto deben medir AB y AC para que BC sea lo más corto posible?'];
    const bc = 2 * S / sen(A);
    const errores = sub === 'valor' ? [
      h('TR24', Math.sqrt(2 * bc * (1 + cos(A))), 'Cambiaste el signo en la ley de cosenos: es a² = b² + c² − 2bc·cos A.'),
      h('OB-pitagoras', Math.sqrt(2 * bc), 'Usaste a² = b² + c² (Pitágoras), que solo vale si A = 90°.'),
      h('OB-sin-raiz', 2 * bc * (1 - cos(A)), 'Ese es a², el cuadrado del lado: falta la raíz.'),
      h('OB-minimo-equilatero', Math.sqrt(bc), 'Supusiste que BC es mínimo cuando mide igual que AB y AC (triángulo equilátero). Lo que se iguala son AB y AC; BC depende del ángulo A.'),
      h('OB-producto-sin-2', Math.sqrt(bc * (1 - cos(A))), 'Te faltó un 2: con b = c, b² + c² = 2bc, y a² = 2bc − 2bc·cos A = 2bc(1 − cos A).'),
    ] : [
      h('OB-lado-equivocado', a, 'Esa es la longitud mínima de BC, no la de AB y AC.'),
      h('OB-sin-raiz', bc, 'Ese es el producto AB·AC = 2S/sen A. Si AB = AC, cada uno es su raíz cuadrada.'),
      h('OB-sin-seno', Math.sqrt(2 * S), 'Olvidaste dividir entre sen A: el área es (1/2)·b·c·sen A, así que b·c = 2S/sen A.'),
      h('OB-area-sin-mitad', Math.sqrt(bc / 2), 'Usaste S = b·c·sen A, sin el 1/2.'),
    ];
    const solucion = [
      ['Área: (1/2)·b·c·sen ', v('A', `${A}°`), ' = ', v('S', Stxt), ` → b·c = 2·${entreP(Stxt)}/${entreP(ex(sen(A)))} = ${ex(bc)}, fijo.`],
      ['Ley de cosenos: a² = b² + c² − 2bc·cos A = (b − c)² + 2bc(1 − cos A). Como bc es fijo, a² es mínimo cuando b − c = 0.'],
      [`Con b = c: b² = ${ex(bc)}, b = c = ${ex(k)} m, y a² = 2·${ex(bc)}·(1 − ${entreP(ex(cos(A)))}) = ${ex(a * a)}.`],
      sub === 'valor' ? ['BC mínimo = ', v('a', `${ex(a)} m`), '.'] : ['AB = AC = ', v('a', `${ex(k)} m`), '.'],
    ];
    return { correcta, errores, variables, enunciado, pregunta, solucion, datos: { sub, A, k, S } };
  }

  // ---------- doblez de un rectángulo ----------
  const RAZONES = [[2, 1], [3, 1], [3, 2], [4, 3], [5, 2], [4, 1], [5, 1], [5, 3], [7, 1]];
  function doblez(rng, pref) {
    const sub = pref < 0.65 ? 'coseno' : 'longitud';
    const [l, w] = rng.elegir(RAZONES);
    const den = sub === 'longitud' ? 2 * l / mcd(2 * l, l * l + w * w) : 1;
    const m = den * rng.entero(1, 3), L = l * m, W = w * m;
    const { AE, cos: cAEC } = calc.doblez({ L, W });
    const EB = L - AE;
    const variables = { L: { nombre: 'lado AB', color: 'o' }, W: { nombre: 'lado BC', color: 'i' }, x: { nombre: 'AE = EC', color: 'd' }, r: { nombre: sub === 'coseno' ? 'cos AEC' : 'AE', color: 'h' } };
    const enunciado = ['Una hoja rectangular ABCD tiene AB = ', v('L', `${L} cm`), ' y BC = ', v('W', `${W} cm`), '. Se dobla de modo que el vértice C cae exactamente sobre el vértice A; el doblez es un segmento que corta al lado AB en E y al lado CD en F.'];
    const pregunta = [sub === 'coseno' ? 'Con la hoja ya desdoblada, ¿cuánto vale el coseno del ángulo AEC?' : '¿Cuánto mide AE?'];
    let correcta, errores;
    if (sub === 'coseno') {
      correcta = cAEC;
      const s = 2 * L * W / (L * L + W * W);
      errores = [
        p('TR12', -cAEC, 'Ese es el coseno del ángulo BEC, que es agudo. El ángulo AEC es su suplemento y es obtuso: cos(180° − x) = −cos x, así que el coseno es negativo.'),
        p('TR9', -s, 'Ese es el seno con signo menos. En el triángulo rectángulo EBC, el coseno de BEC es EB/EC (adyacente sobre hipotenusa), no BC/EC.'),
        h('OB-doblez-seno', s, 'Ese es el seno del ángulo AEC (que es positivo, igual al de BEC). Se pide el coseno.'),
        h('OB-doblez-cotangente', -EB / W, 'Dividiste EB entre BC: eso es la cotangente de BEC, no su coseno. El coseno usa la hipotenusa EC.'),
      ];
    } else {
      correcta = AE;
      errores = [
        h('OB-doblez-mitad-diagonal', Math.sqrt(L * L + W * W) / 2, 'Esa es la mitad de la diagonal AC (la distancia del centro de la hoja a A). E está en el lado AB, no en el centro.'),
        h('OB-doblez-mitad-lado', L / 2, 'Supusiste que E es el punto medio de AB. E es el punto de AB que queda a la misma distancia de A que de C.'),
        h('OB-doblez-segmento-cambiado', EB, 'Ese es EB, el resto del lado AB.'),
        h('OB-doblez-sin-cuadrado', (L + W) / 2, 'Planteaste EC = EB + BC sin cuadrados. En el triángulo rectángulo EBC va Pitágoras: EC² = EB² + BC².'),
      ];
    }
    const solucion = [
      ['El doblez es la mediatriz de AC: cada punto del doblez está a la misma distancia de A que de C. Por eso AE = EC = x.'],
      ['En el triángulo rectángulo EBC: x² = (', v('L', `${L}`), ' − x)² + ', v('W', `${W}`), `² → 0 = ${L * L} − ${2 * L}x + ${W * W} → x = ${ex(AE)}.`],
      sub === 'coseno'
        ? [`EB = ${L} − ${ex(AE)} = ${ex(EB)}; cos BEC = EB/EC = ${ex(EB / AE)}. El ángulo AEC es su suplemento (obtuso): cos AEC = `, v('r', ex(correcta)), '.']
        : ['AE = ', v('r', `${ex(correcta)} cm`), '.'],
    ];
    return { correcta, errores, variables, enunciado, pregunta, solucion, unidad: sub === 'coseno' ? '' : 'cm', forma: sub === 'coseno' ? 'fraccion' : 'longitud', negativos: sub === 'coseno', datos: { sub, L, W } };
  }


  // ---------- Problemas simbólicos (respuesta en texto, armarTexto) ----------
  const simbolico = (semilla, tipo, datos, partes) => {
    const rng = Azar.crear(ID + '|simbolico|' + semilla + '|problema');
    const r = partes(rng);
    const alternativas = P.armarTexto({ correcta: r.correcta, errores: r.errores, rng });
    return {
      id: `${ID}#${semilla}`, variables: r.variables, enunciado: r.enunciado, pregunta: r.pregunta, datos: '', alternativas,
      solucion: r.solucion, respuesta: { valor: r.correcta.clave, unidad: '' }, _datos: { tipo, ...datos(r) },
    };
  };
  const X = (id, texto, explicacion) => ({ id, clave: texto, texto, explicacion, respaldo: 'hipotesis', fuente: null });

  // Triángulo rectángulo con perímetro 2p y un ángulo agudo θ: lados 2R·senθ, 2R·cosθ y 2R.
  function circunradioSimbolico(semilla) {
    return simbolico(semilla, 'circunradio', r => ({ sub: 'en-funcion', pide: r.pide }), rng => {
      const pide = rng.sig() < 0.6 ? 'area' : 'radio';
      const variables = { p: { nombre: 'semiperímetro', color: 'o' }, t: { nombre: 'ángulo agudo', color: 'i' }, R: { nombre: 'circunradio', color: 'd' }, S: { nombre: pide === 'area' ? 'área' : 'circunradio', color: 'h' } };
      const enunciado = ['Un terreno tiene forma de triángulo ABC, recto en C. Su perímetro es fijo e igual a ', v('p', '2p'), ', y su ángulo agudo en A mide ', v('t', 'θ'), '. Sea R el radio de la circunferencia que pasa por A, B y C.'];
      let correcta, errores, pregunta;
      if (pide === 'area') {
        correcta = { clave: 'p²·senθ·cosθ/((1 + senθ)·(1 + cosθ))', texto: 'p²·senθ·cosθ/((1 + senθ)·(1 + cosθ))' };
        pregunta = ['¿Cuál es el área del terreno en función de θ?'];
        errores = [
          X('OB-area-sin-mitad', '2p²·senθ·cosθ/((1 + senθ)·(1 + cosθ))', 'Te faltó el 1/2 del área: S = (1/2)·a·b = 2R²·senθ·cosθ, no 4R²·senθ·cosθ.'),
          X('OB-perimetro-como-semiperimetro', 'p²·senθ·cosθ/(4·(1 + senθ)·(1 + cosθ))', 'Tomaste p como el perímetro. El perímetro es 2p: 2R(1 + senθ + cosθ) = 2p.'),
          X('OB-sin-cuadrado', '2p²·senθ·cosθ/(1 + senθ + cosθ)', 'R lleva (1 + senθ + cosθ) en el denominador y en el área va R²: ese factor también se eleva al cuadrado.'),
          X('OB-cuadrado-repartido', 'p²·senθ·cosθ', '(1 + senθ + cosθ)² no es 1 + sen²θ + cos²θ: faltan los dobles productos. Se cumple (1 + senθ + cosθ)² = 2(1 + senθ)(1 + cosθ).'),
        ];
      } else {
        correcta = { clave: 'p/(1 + senθ + cosθ)', texto: 'p/(1 + senθ + cosθ)' };
        pregunta = ['¿Cuánto mide R en función de θ?'];
        errores = [
          X('OB-senos-sin-2R', '2p/(1 + senθ + cosθ)', 'Tomaste cada lado como R·sen del ángulo opuesto. La ley de senos da a = 2R·sen A: la hipotenusa es el diámetro, 2R.'),
          X('OB-perimetro-como-semiperimetro', 'p/(2·(1 + senθ + cosθ))', 'Tomaste p como el perímetro. El perímetro es 2p.'),
          X('OB-sin-hipotenusa', 'p/(senθ + cosθ)', 'Sumaste solo los catetos. El perímetro también lleva la hipotenusa, 2R·sen 90° = 2R.'),
        ];
      }
      const solucion = [
        ['Ley de senos: BC = 2R·sen ', v('t', 'θ'), ', AC = 2R·cos θ (el ángulo B es 90° − θ) y AB = 2R·sen 90° = 2R: la hipotenusa es el diámetro.'],
        ['Perímetro: 2R(1 + senθ + cosθ) = ', v('p', '2p'), ' → ', v('R', 'R = p/(1 + senθ + cosθ)'), '.'],
        ...(pide === 'area' ? [
          ['Área: (1/2)·BC·AC = 2R²·senθ·cosθ = 2p²·senθ·cosθ/(1 + senθ + cosθ)².'],
          ['Con (1 + senθ + cosθ)² = 1 + sen²θ + cos²θ + 2senθ + 2cosθ + 2senθcosθ = 2(1 + senθ)(1 + cosθ): S = ', v('S', correcta.texto), '.'],
        ] : [['R = ', v('S', correcta.texto), '.']]),
      ];
      return { correcta, errores, variables, enunciado, pregunta, solucion, pide };
    });
  }

  // La «constante» de una forma de la ley de tangentes: (a − b)/(a + b) = tan((A − B)/2)·tan(C/2).
  const FORMAS_TAN = [
    { forma: '(a − b)/(a + b) = k·tan((A − B)/2)', k: 'tan' },
    { forma: 'tan((A − B)/2) = k·(a − b)/(a + b)', k: 'cot' },
    { forma: '(a + b)·tan((A − B)/2) = k·(a − b)', k: 'cot' },
    { forma: '(a − b)·cot((A − B)/2) = k·(a + b)', k: 'tan' },
  ];
  function tangentesSimbolico(semilla) {
    return simbolico(semilla, 'ley-tangentes', r => ({ sub: 'constante', forma: r.forma }), rng => {
      const F = rng.elegir(FORMAS_TAN);
      const otra = F.k === 'tan' ? 'cot' : 'tan';
      const t = (fn, arg) => (arg === 'C' ? `${fn} C` : `${fn}(C/2)`);
      const correcta = { clave: t(F.k, 'C/2'), texto: t(F.k, 'C/2') };
      const errores = [
        X('OB-tangentes-invertida', t(otra, 'C/2'), `Al despejar, tan((A + B)/2) = cot(C/2) quedó del lado equivocado: dividir entre cot(C/2) es multiplicar por tan(C/2).`),
        X('OB-angulo-sin-mitad', t(F.k, 'C'), 'En la ley de tangentes van los semiángulos: (A + B)/2 = 90° − C/2, no 90° − C.'),
        X('OB-sin-semisuma', '1', 'Te olvidaste de tan((A + B)/2). Vale 1 solo si C = 90°; en general es cot(C/2).'),
        X('OB-funcion-cambiada', t(F.k === 'tan' ? 'sen' : 'cos', 'C/2'), `tan(90° − C/2) es cot(C/2): la co-razón de la tangente es la cotangente, no el ${F.k === 'tan' ? 'seno' : 'coseno'}.`),
      ];
      const variables = { k: { nombre: 'constante k', color: 'h' }, d: { nombre: 'semidiferencia (A − B)/2', color: 'o' }, s: { nombre: 'semisuma (A + B)/2', color: 'i' } };
      const enunciado = ['En todo triángulo ABC, con a, b y c opuestos a A, B y C, se cumple ', F.forma, ', donde k depende solo del ángulo ', 'C', '.'];
      const pregunta = ['¿Qué es k?'];
      const solucion = [
        ['Ley de tangentes: (a − b)/(a + b) = tan', v('d', '((A − B)/2)'), ' / tan', v('s', '((A + B)/2)'), '.'],
        ['Como A + B = 180° − C, ', v('s', '(A + B)/2 = 90° − C/2'), ' y tan((A + B)/2) = cot(C/2).'],
        ['Así, (a − b)/(a + b) = tan((A − B)/2)·tan(C/2). Llevada a la forma dada: ', F.forma.replace('k', correcta.texto), ', es decir, ', v('k', `k = ${correcta.texto}`), '.'],
      ];
      return { correcta, errores, variables, enunciado, pregunta, solucion, forma: F.forma };
    });
  }

  return { id: ID, titulo: 'Triángulos oblicuángulos: cosenos, senos, tangentes y áreas', generar, calc, exacto };
});
