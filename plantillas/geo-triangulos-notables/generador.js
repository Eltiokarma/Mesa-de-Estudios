/*
 * Generador: triángulos (desigualdad triangular, condición de obtusángulo y acutángulo con lados
 * enteros) y puntos notables (ángulos con incentro, excentro, ortocentro y circuncentro; pies de las
 * alturas; ortocentro y Pitágoras; bisectrices con 37°/2 y 53°/2; punto medio del arco).
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['geo-triangulos-notables']) y en Node (require). No usa ningún motor: el
 * cálculo está en `calc` (funciones puras, que también verifica papel.json).
 *
 * Tipos y campos de _datos (las longitudes en la unidad `u`; los ángulos en grados):
 *   desigualdad   sub 'max' | 'min' | 'cuantos': dos lados a y b; el tercero x es entero. Se pide
 *                 el mayor x, el menor x o cuántos valores puede tomar.
 *                 sub 'diagonal': cuadrilátero ABCD con AB = p, BC = q, CD = r, DA = s; la diagonal
 *                 AC es entera; pide 'max' | 'min' | 'cuantos'.
 *                 sub 'punto-interior': P está dentro del triángulo ABC; PA = p, PB = q, AB = c; el
 *                 perímetro de ABC es entero. Se pide el menor perímetro posible.
 *                 sub 'doble-angulo': en ABC, ∠A = 2·∠C y AB = c; BC es entero; pide 'max' | 'min'.
 *                 sub 'punto-dos': P dentro de ABC con PA = p y PB = q (no se da AB); perímetro
 *                 entero; se pide el menor perímetro posible (> PA + PB + |PA − PB| = 2·máx).
 *                 sub 'isosceles-ceviana': D en AC con ∠DBC = ∠DCB (así DC = BD); AB = c, BD = m; AC
 *                 es entero; se pide el menor AC.
 *                 sub 'contar': N es el perímetro; se pide cuántos triángulos distintos (no
 *                 congruentes) tienen lados enteros y ese perímetro.
 *   obtusangulo   dos lados a < b y el tercero x entero.
 *                 sub 'entre-cuantos' | 'entre-max' | 'entre-min': el ángulo entre los lados a y b
 *                 es obtuso; se pide cuántos x, el mayor x o el menor x.
 *                 sub 'perimetros': igual que 'entre-*'; cerco a k soles el metro (campo k); se pide
 *                 la diferencia de costo entre el cerco de perímetro máximo y el de perímetro mínimo.
 *                 sub 'opuesto-cuantos': el ángulo opuesto al lado b es obtuso; cuántos x.
 *                 sub 'acutangulo': el triángulo es acutángulo; cuántos x.
 *                 sub 'relacion': AB = a, AC = b, ∠B obtuso y ∠A > ∠C; BC es entero y queda un solo
 *                 valor; se pide BC.
 *   angulos       sub 'incentro' (∠BIC, bisectrices interiores de B y C), 'excentro' (∠BEC,
 *                 bisectrices exteriores de B y C), 'int-ext' (∠BEC, interior de B y exterior de C),
 *                 'ortocentro' (∠BHC), 'circuncentro' (∠BOC): se da A (∠BAC). En los dos últimos el
 *                 triángulo es acutángulo.
 *                 sub 'orto-incentro': triángulo acutángulo, se da theta = ∠BHC (H ortocentro); se
 *                 pide ∠BIC (I incentro).
 *                 sub 'pies-alturas': triángulo acutángulo con ∠B = B y ∠C = C; E es el pie de la
 *                 altura desde B (en AC), F el de la altura desde C (en AB), O el circuncentro.
 *                 pide 'AEF' (∠AEF), 'AFE' (∠AFE), 'OAB' (∠OAB) o 'AO-EF' (ángulo entre AO y EF).
 *   ortocentro    las alturas desde A y desde B se cortan en H; la recta CH corta a AB en F.
 *                 Se dan AF, FB y además AC (pide 'CF') o BC (pide 'AC').
 *   mitades       BH es la altura (H en AC), BH = h, ∠A = A, ∠C = C (37, 53, 60 o 74); las bisectrices
 *                 de A y de C cortan a BH en P y Q. Se pide PQ. Convención de academia:
 *                 tan 37° = 3/4, tan 53° = 4/3, tan 74° = 24/7, tan(37°/2) = 1/3, tan(53°/2) = 1/2.
 *   arco          ABC inscrito; la bisectriz de A pasa por el incentro I, corta a la circunferencia
 *                 en M y llega al excentro E relativo a BC. Se dan AI = p e IM = q; pide 'AE' o 'IE'.
 *
 * Errores: GE8 (la ceviana cae en el punto medio, parcial), GE11 (Pitágoras mal aplicado, parcial),
 * GE15 (central igual al inscrito, hipótesis del informe) y los GT-* nuevos (hipótesis nuestras),
 * entre ellos los del documento de trampas: GT-limite-incluido (el valor que la desigualdad estricta
 * excluye), GT-sin-condicion-obtuso (solo la desigualdad triangular) y GT-formula-excentro.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const INF = 'docs/investigacion/geometria-ideas-erroneas.md';
  const h = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente: null });
  const hi = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente: INF });
  const pa = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'parcial', fuente: INF });
  const v = P.v;

  // ---------- cálculo puro ----------
  const isqrt = N => { let r = Math.floor(Math.sqrt(N)); while (r * r > N) r--; while ((r + 1) * (r + 1) <= N) r++; return r; };
  const mayorMenorQueRaiz = N => { const r = isqrt(N); return r * r === N ? r - 1 : r; };  // mayor entero x con x² < N
  const rango = (lo, hi) => ({ min: lo, max: hi, cuantos: Math.max(0, hi - lo + 1) });
  const TAN = { 37: 3 / 4, 53: 4 / 3, 60: Math.sqrt(3), 74: 24 / 7 };
  const TAN_MITAD = { 37: 1 / 3, 53: 1 / 2, 60: 1 / Math.sqrt(3), 74: 3 / 4 };
  const simple = (x, qmax) => { for (let q = 1; q <= qmax; q++) if (Math.abs(x * q - Math.round(x * q)) < 1e-9) return true; return false; };
  const calc = {
    tercerLado: (a, b) => rango(Math.abs(a - b) + 1, a + b - 1),
    diagonal: (p, q, r, s) => rango(Math.max(Math.abs(p - q), Math.abs(r - s)) + 1, Math.min(p + q, r + s) - 1),
    perimetroInterior: (p, q, c) => c + p + q + 1,
    perimetroDosDistancias: (p, q) => 2 * Math.max(p, q) + 1,
    isoscelesCeviana: (c, m) => rango(m + Math.abs(c - m) + 1, c + 2 * m - 1),
    obtusoRelacion: (c, b) => rango(Math.max(c, b - c) + 1, mayorMenorQueRaiz(b * b - c * c)),
    dobleAngulo: c => rango(c + 1, 2 * c - 1),
    contarTriangulos: N => {
      let n = 0;
      for (let a = 1; a <= N; a++) for (let b = a; b <= N; b++) { const c = N - a - b; if (c >= b && a + b > c) n++; }
      return n;
    },
    obtusoEntre: (a, b) => rango(isqrt(a * a + b * b) + 1, a + b - 1),
    obtusoOpuesto: (a, b) => rango(b - a + 1, mayorMenorQueRaiz(b * b - a * a)),
    acutangulo: (a, b) => rango(isqrt(b * b - a * a) + 1, mayorMenorQueRaiz(a * a + b * b)),
    angulo: (cual, A) => ({ incentro: 90 + A / 2, excentro: 90 - A / 2, 'int-ext': A / 2, ortocentro: 180 - A, circuncentro: 2 * A })[cual],
    ortoIncentro: theta => 180 - theta / 2,
    piesAlturas: (B, C) => ({ AEF: B, AFE: C, 'AO-EF': 90 }),
    ortocentroPitagoras: (AF, FB, lado, pide) => {
      if (pide === 'CF') return Math.sqrt(lado * lado - AF * AF);        // lado = AC
      const CF = Math.sqrt(lado * lado - FB * FB);                        // lado = BC
      return Math.sqrt(CF * CF + AF * AF);
    },
    mitades: (A, C, hh) => {
      const HP = hh / TAN[A] * TAN_MITAD[A], HQ = hh / TAN[C] * TAN_MITAD[C];
      return { HP, HQ, PQ: Math.abs(HP - HQ) };
    },
    arcoMedio: (p, q) => ({ AE: p + 2 * q, IE: 2 * q, ME: q }),
  };

  // ---------- texto exacto ----------
  function exacto(x) {
    if (!Number.isFinite(x) || x <= 0 || x > 1e6) return null;
    for (let q = 1; q <= 12; q++) {
      const p = x * q, r = Math.round(p);
      if (Math.abs(p - r) < 1e-9 * Math.max(1, r)) return q === 1 ? P.formatear(r) : `${r}/${q}`;
    }
    const t = P.radical(x);
    return /,/.test(t) ? null : t;
  }
  const n = x => exacto(x) || P.formatear(x, 2);
  const entero = x => Number.isInteger(x) && x > 0;

  const SUBS = {
    desigualdad: ['max', 'min', 'cuantos', 'diagonal', 'punto-interior', 'punto-dos', 'doble-angulo', 'isosceles-ceviana', 'contar'],
    obtusangulo: ['entre-cuantos', 'entre-max', 'entre-min', 'perimetros', 'opuesto-cuantos', 'acutangulo', 'relacion'],
    angulos: ['incentro', 'excentro', 'int-ext', 'ortocentro', 'circuncentro', 'orto-incentro', 'orto-incentro', 'pies-alturas'],
  };
  const PIDES = { diagonal: ['max', 'min', 'cuantos'], 'doble-angulo': ['max', 'min'], 'pies-alturas': ['AEF', 'AFE', 'OAB', 'AO-EF'], ortocentro: ['CF', 'AC'], arco: ['AE', 'IE'] };

  function generar(semilla) {
    const rng = Azar.crear('geo-triangulos-notables|' + semilla);
    const tipo = rng.elegir(['desigualdad', 'desigualdad', 'obtusangulo', 'obtusangulo', 'angulos', 'angulos', 'ortocentro', 'mitades', 'arco']);
    // El subtipo (y lo que se pide) se eligen una sola vez: así los reintentos no sesgan el reparto.
    const sub = SUBS[tipo] ? rng.elegir(SUBS[tipo]) : null;
    const clave = sub || tipo;
    const plan = { sub, pide: PIDES[clave] ? rng.elegir(PIDES[clave]) : null };
    for (let intento = 0; intento < 5000; intento++) {
      const pr = construir(rng, semilla, tipo, plan);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  function construir(rng, semilla, tipo, plan) {
    const u = rng.elegir(['cm', 'm']);
    const o = { desigualdad, obtusangulo, angulos, ortocentro, mitades, arco }[tipo](rng, u, plan);
    if (!o) return null;
    const texto = o.texto || (x => `${exacto(x)}${o.unidad ? ' ' + o.unidad : ''}`);
    if (!exacto(o.correcta)) return null;
    const conRaiz = exacto(o.correcta).includes('√');
    o.errores = o.errores.filter(Boolean);
    if (o.unidad === '°') o.errores = o.errores.filter(e => e.valor < 180); // un ángulo de triángulo no llega a 180°
    const sirve = e => exacto(e.valor) !== null && (conRaiz || !exacto(e.valor).includes('√')) && (!o.enteros || Number.isInteger(e.valor));
    // Cambios de distractor (para que la correcta no se adivine por quedar en un extremo): se aplican solo
    // si el número de alternativas no cambia, así los reintentos (y con ellos el azar y _datos) son los mismos.
    const cuantas = lista => new Set([texto(o.correcta), ...lista.filter(sirve).map(e => texto(e.valor))]).size;
    for (const [de, a] of o.cambios || []) {
      const i = o.errores.indexOf(de);
      if (i < 0) continue;
      const otra = o.errores.slice(); otra[i] = a;
      if (Math.min(5, cuantas(otra)) === Math.min(5, cuantas(o.errores))) o.errores = otra;
    }
    // Listas completas de reemplazo, en orden de preferencia, con la misma condición.
    const alterno = (o.alternos || []).find(l => Math.min(5, cuantas(l.filter(Boolean))) === Math.min(5, cuantas(o.errores)));
    if (alterno) o.errores = alterno.filter(Boolean);
    const errores = o.errores.filter(sirve);
    const alternativas = P.armar({ correcta: o.correcta, errores, rng, texto });
    return {
      id: `geo-triangulos-notables#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion, respuesta: { valor: o.correcta, unidad: o.unidad || '' }, _datos: o.datos,
    };
  }

  // ---------- desigualdad triangular ----------
  function desigualdad(rng, u, plan) {
    const sub = plan.sub, L = x => `${x} ${u}`;
    if (sub === 'max' || sub === 'min' || sub === 'cuantos') {
      const a = rng.entero(3, 16), b = rng.entero(3, 16);
      if (Math.abs(a - b) < 2) return null;
      const R = calc.tercerLado(a, b), lo = Math.abs(a - b), hiS = a + b;
      const ctx = rng.elegir(['listones', 'cerco', 'puro']);
      if (ctx === 'listones') u = 'cm'; else if (ctx === 'cerco') u = 'm';
      const variables = { a: { nombre: 'primer lado', color: 'o' }, b: { nombre: 'segundo lado', color: 'i' }, x: { nombre: 'tercer lado', color: 'd' } };
      const enunciado = ctx === 'listones'
        ? ['Un carpintero tiene dos listones de ', v('a', L(a)), ' y ', v('b', L(b)), ' y quiere cortar un tercero, de longitud entera, para armar un marco triangular uniendo los tres por sus extremos.']
        : ctx === 'cerco'
          ? ['Un corral triangular tiene dos lados de ', v('a', L(a)), ' y ', v('b', L(b)), '. El tercer lado mide un número entero de ' + (u === 'm' ? 'metros' : 'centímetros') + '.']
          : ['Dos lados de un triángulo miden ', v('a', L(a)), ' y ', v('b', L(b)), '. El ', v('x', 'tercer lado'), ' mide un número entero.'];
      const paso1 = ['Desigualdad triangular: cada lado es menor que la suma de los otros dos y mayor que su diferencia. ', `${lo} < x < ${hiS}`, ' (las dos desigualdades son estrictas: con x = ', `${lo}`, ' o ', `${hiS}`, ' los tres lados quedarían en una sola recta).'];
      if (sub === 'max') {
        const pregunta = ['¿Cuál es el ', v('x', 'mayor valor'), ' que puede tener el tercer lado?'];
        const errores = [
          h('GT-limite-incluido', hiS, `Tomaste x = ${a} + ${b}. Con ese valor los tres lados quedan sobre una recta y no hay triángulo: la desigualdad es estricta.`),
          h('GT-cota-equivocada', R.min, 'Ese es el menor valor posible, no el mayor.'),
          h('GT-no-supera-al-mayor', Math.max(a, b), 'Supusiste que el tercer lado no puede superar al mayor de los otros dos. Sí puede: lo que no puede es igualar o superar su suma.'),
        ];
        const solucion = [paso1, ['El mayor entero menor que ', `${hiS}`, ' es ', v('x', L(R.max)), '.']];
        return { correcta: R.max, unidad: u, errores, variables, enunciado, pregunta, solucion, enteros: true, datos: { tipo: 'desigualdad', sub, a, b, u } };
      }
      if (sub === 'min') {
        const pregunta = ['¿Cuál es el ', v('x', 'menor valor'), ' que puede tener el tercer lado?'];
        const errores = [
          h('GT-limite-incluido', lo, `Tomaste x = ${Math.max(a, b)} − ${Math.min(a, b)}. Con ese valor los tres lados quedan sobre una recta y no hay triángulo: la desigualdad es estricta.`),
          h('GT-solo-cota-superior', 1, `Usaste solo x < ${hiS}. También hace falta que el lado mayor, ${Math.max(a, b)}, sea menor que la suma de los otros dos: x > ${lo}.`),
          h('GT-cota-equivocada', R.max, 'Ese es el mayor valor posible, no el menor.'),
          h('GT-no-menor-que-lados', Math.min(a, b), 'Supusiste que el tercer lado no puede ser menor que los otros dos. Sí puede, siempre que supere su diferencia.'),
        ];
        const solucion = [paso1, ['El menor entero mayor que ', `${lo}`, ' es ', v('x', L(R.min)), '.']];
        return { correcta: R.min, unidad: u, errores, variables, enunciado, pregunta, solucion, enteros: true, datos: { tipo: 'desigualdad', sub, a, b, u } };
      }
      const pregunta = ['¿Cuántos valores enteros puede tener el ', v('x', 'tercer lado'), '?'];
      const errores = [
        h('GT-limite-incluido', R.cuantos + 2, `Contaste también ${lo} y ${hiS}. Con esos valores no hay triángulo: las desigualdades son estrictas.`),
        h('GT-limite-incluido-uno', R.cuantos + 1, `Contaste uno de los extremos (${lo} o ${hiS}). Ninguno de los dos da triángulo.`),
        h('GT-solo-cota-superior', hiS - 1, `Usaste solo x < ${hiS} y contaste desde 1. Falta la otra condición: x > ${lo}.`),
      ];
      const cambios = [[errores[1], h('GT-resta-sin-mas-uno', R.cuantos - 1, `Restaste los extremos, ${R.max} − ${R.min} = ${R.cuantos - 1}, y olvidaste sumar 1: así dejas fuera uno de los valores. De ${R.min} a ${R.max} hay ${R.max} − ${R.min} + 1.`)]];
      const solucion = [paso1, ['Los valores van de ', `${R.min}`, ' a ', `${R.max}`, ': son ', v('x', `${R.max} − ${R.min} + 1 = ${R.cuantos}`), ' valores.']];
      return { correcta: R.cuantos, unidad: '', errores, cambios, variables, enunciado, pregunta, solucion, enteros: true, datos: { tipo: 'desigualdad', sub, a, b, u } };
    }
    if (sub === 'diagonal') {
      const p = rng.entero(3, 15), q = rng.entero(3, 15), r = rng.entero(3, 15), s = rng.entero(3, 15);
      const lo1 = Math.abs(p - q), hi1 = p + q, lo2 = Math.abs(r - s), hi2 = r + s;
      const R = calc.diagonal(p, q, r, s), pide = plan.pide;
      if (R.cuantos < 3) return null;
      const soloABC = rango(lo1 + 1, hi1 - 1), soloACD = rango(lo2 + 1, hi2 - 1);
      if (soloABC[pide] === R[pide] && soloACD[pide] === R[pide]) return null; // la trampa no muerde
      u = 'm';
      const variables = { x: { nombre: 'diagonal AC', color: 'd' } };
      const enunciado = [`Un terreno tiene forma de cuadrilátero ABCD (no necesariamente convexo), con AB = ${L(p)}, BC = ${L(q)}, CD = ${L(r)} y DA = ${L(s)}. Un `, v('x', 'sendero recto'), ' une las esquinas A y C, y su longitud es un número entero de metros.'];
      const que = { max: 'el mayor valor que puede tener', min: 'el menor valor que puede tener', cuantos: 'cuántos valores enteros puede tener' }[pide];
      const pregunta = [`¿Cuál es ${que.startsWith('cuántos') ? 'el número de valores enteros que puede tener' : que} el `, v('x', 'sendero AC'), '?'];
      const lim = { max: Math.min(hi1, hi2), min: Math.max(lo1, lo2), cuantos: R.cuantos + 2 }[pide];
      const errores = [
        h('GT-un-solo-triangulo', soloABC[pide], 'Usaste solo el triángulo ABC. La diagonal también es lado del triángulo ACD, y tiene que cumplir las dos desigualdades a la vez.'),
        h('GT-un-solo-triangulo', soloACD[pide], 'Usaste solo el triángulo ACD. La diagonal también es lado del triángulo ABC, y tiene que cumplir las dos desigualdades a la vez.'),
        h('GT-limite-incluido', lim, pide === 'cuantos' ? 'Contaste también los dos extremos. Con ellos un triángulo queda aplastado sobre una recta.' : 'Tomaste el valor límite. Con ese valor un triángulo queda aplastado sobre una recta: la desigualdad es estricta.'),
        h('GT-cota-equivocada', pide === 'max' ? R.min : pide === 'min' ? R.max : R.max, pide === 'cuantos' ? 'Ese es el mayor valor de AC, no la cantidad de valores.' : `Ese es el ${pide === 'max' ? 'menor' : 'mayor'} valor posible.`),
      ];
      const solucion = [
        ['En el triángulo ABC: ', `${lo1} < AC < ${hi1}`, '.'],
        ['En el triángulo ACD: ', `${lo2} < AC < ${hi2}`, '.'],
        ['Las dos a la vez: ', v('x', `${R.min - 1} < AC < ${R.max + 1}`), `, es decir, AC entre ${R.min} y ${R.max}.`],
        [pide === 'cuantos' ? ['Son ', v('x', `${R.cuantos}`), ' valores.'] : [pide === 'max' ? 'El mayor es ' : 'El menor es ', v('x', L(R[pide])), '.']].flat(),
      ];
      return { correcta: R[pide], unidad: pide === 'cuantos' ? '' : u, errores, variables, enunciado, pregunta, solucion, enteros: true, datos: { tipo: 'desigualdad', sub, pide, p, q, r, s, u } };
    }
    if (sub === 'punto-interior') {
      const p = rng.entero(2, 12), q = rng.entero(2, 12), c = rng.entero(3, 20);
      if (p === q || c <= Math.abs(p - q) || c >= p + q) return null;
      const correcta = calc.perimetroInterior(p, q, c);
      u = 'm';
      const variables = { p: { nombre: 'PA', color: 'o' }, q: { nombre: 'PB', color: 'i' }, c: { nombre: 'AB', color: 'h' }, x: { nombre: 'perímetro', color: 'd' } };
      const enunciado = ['Un terreno tiene forma de triángulo ABC, con el lado ', v('c', `AB = ${c} m`), '. Dentro del terreno hay un pozo P que está a ', v('p', `${p} m`), ' de la esquina A y a ', v('q', `${q} m`), ' de la esquina B. El perímetro del terreno es un número entero de metros.'];
      const pregunta = ['¿Cuál es el menor valor que puede tener el ', v('x', 'perímetro'), '?'];
      const errores = [
        h('GT-limite-incluido', c + p + q, `Tomaste CA + CB = PA + PB. Eso solo pasaría con P sobre el borde (en C); con P dentro, CA + CB es estrictamente mayor que ${p + q}.`),
        h('GT-olvida-lado', p + q + 1, `Encontraste bien que CA + CB > ${p + q}, pero olvidaste sumar el lado AB = ${c} al perímetro.`),
        h('GT-semiperimetro', 2 * (p + q) + 1, `Usaste PA + PB < semiperímetro. La propiedad del punto interior es PA + PB < CA + CB, sin el lado AB.`),
      ];
      const solucion = [
        ['Se prolonga AP hasta cortar BC en Q. En el triángulo ACQ: CA + CQ > AQ = PA + PQ. En el triángulo PQB: PQ + QB > PB.'],
        ['Sumando: CA + CB > PA + PB = ', v('p', `${p}`), ' + ', v('q', `${q}`), ` = ${p + q}. La igualdad no se alcanza porque P está dentro.`],
        [v('x', 'Perímetro'), ' = ', v('c', `${c}`), ` + CA + CB > ${c + p + q}.`],
        ['El menor entero mayor que ', `${c + p + q}`, ' es ', v('x', `${correcta} m`), '. (Se acerca tanto como se quiera poniendo C muy cerca de P.)'],
      ];
      return { correcta, unidad: 'm', errores, variables, enunciado, pregunta, solucion, enteros: true, datos: { tipo: 'desigualdad', sub, p, q, c, u } };
    }
    if (sub === 'doble-angulo') {
      const c = rng.entero(3, 15), pide = plan.pide, R = calc.dobleAngulo(c);
      const variables = { c: { nombre: 'AB', color: 'o' }, x: { nombre: 'BC', color: 'd' } };
      const enunciado = ['En el triángulo ABC, el ángulo A mide el doble que el ángulo C, y ', v('c', `AB = ${L(c)}`), '. El lado ', v('x', 'BC'), ' mide un número entero.'];
      const pregunta = ['¿Cuál es el ', v('x', pide === 'max' ? 'mayor valor' : 'menor valor'), ' que puede tener BC?'];
      const errores = pide === 'max' ? [
        h('GT-limite-incluido', 2 * c, `Tomaste BC = 2·AB. Ese valor solo se alcanzaría con el ángulo C = 60° y A = 120°, y entonces B = 0°: no hay triángulo.`),
        h('GT-cota-equivocada', R.min, 'Ese es el menor valor posible de BC, no el mayor.'),
        h('GT-lado-menor', c - 1, 'Pensaste que al ángulo mayor se opone el lado menor. Es al revés: como A > C, BC (frente a A) es mayor que AB (frente a C).'),
      ] : [
        h('GT-limite-incluido', c, `Tomaste BC = AB. Eso pasaría con A = C, pero A es el doble de C: BC es estrictamente mayor que AB.`),
        h('GT-cota-equivocada', R.max, 'Ese es el mayor valor posible de BC, no el menor.'),
        h('GT-lado-menor', 1, 'Pensaste que al ángulo mayor se opone el lado menor (BC < AB). Es al revés: BC, frente al ángulo mayor, es mayor que AB.'),
        h('GT-limite-doble', 2 * c + 1, 'Tomaste 2·AB como cota inferior. 2·AB es la cota superior: BC < 2·AB.'),
      ];
      const solucion = [
        ['Como A > C, el lado frente a A es mayor que el lado frente a C: ', v('x', 'BC'), ' > ', v('c', `${c}`), '.'],
        ['Se traza la bisectriz AD del ángulo A (D en BC): el ángulo DAC mide lo mismo que C, así que el triángulo ADC es isósceles y AD = DC.'],
        ['Los triángulos BAD y BCA son semejantes (comparten B, y BAD = C): BD = AB²/BC. En el triángulo ABD, AD < AB + BD, es decir, BC − AB²/BC < AB + AB²/BC, que da BC < 2·AB = ', `${2 * c}`, '.'],
        [`Entonces ${c} < BC < ${2 * c}: `, v('x', pide === 'max' ? `el mayor entero es ${L(R.max)}` : `el menor entero es ${L(R.min)}`), '.'],
      ];
      return { correcta: R[pide], unidad: u, errores, variables, enunciado, pregunta, solucion, enteros: true, datos: { tipo: 'desigualdad', sub, pide, c, u } };
    }
    if (sub === 'punto-dos') {
      const p = rng.entero(2, 15), q = rng.entero(2, 15);
      if (p === q) return null;
      u = 'm';
      const M = Math.max(p, q), m = Math.min(p, q), correcta = calc.perimetroDosDistancias(p, q);
      const variables = { p: { nombre: 'PA', color: 'o' }, q: { nombre: 'PB', color: 'i' }, x: { nombre: 'perímetro', color: 'd' } };
      const enunciado = ['Un terreno tiene forma de triángulo ABC. Dentro del terreno hay un pozo P que está a ', v('p', `${p} m`), ' de la esquina A y a ', v('q', `${q} m`), ' de la esquina B. El perímetro del terreno es un número entero de metros.'];
      const pregunta = ['¿Cuál es el menor valor que puede tener el ', v('x', 'perímetro'), '?'];
      const errores = [
        h('GT-limite-incluido', 2 * M, `Tomaste el valor límite ${2 * M}. Para llegar a él, A, P y B tendrían que estar en una recta y C sobre P: P ya no estaría dentro. La desigualdad es estricta.`),
        h('GT-olvida-lado', p + q + 1, `Encontraste bien que CA + CB > ${p + q}, pero olvidaste sumar el lado AB, que mide más de ${M} − ${m} = ${M - m}.`),
        h('GT-cota-equivocada', 2 * (p + q) + 1, `Usaste AB > PA + PB. Es al revés: en el triángulo APB, AB < PA + PB; la cota inferior de AB es PA − PB.`),
        h('GT-ab-minimo-uno', p + q + 2, 'Tomaste AB como 1, el menor entero. Los lados no tienen por qué ser enteros (solo el perímetro), y además AB es mayor que la diferencia de PA y PB.'),
      ];
      const solucion = [
        ['Como P está dentro: CA + CB > PA + PB = ', v('p', `${p}`), ' + ', v('q', `${q}`), ` = ${p + q} (se prolonga AP hasta BC y se usa dos veces la desigualdad triangular).`],
        ['En el triángulo APB: AB > ', `${M} − ${m} = ${M - m}`, '.'],
        [v('x', 'Perímetro'), ` = AB + CA + CB > ${M - m} + ${p + q} = ${2 * M}. El valor ${2 * M} no se alcanza, pero se acerca tanto como se quiera (A, P y B casi en línea y C muy cerca de P).`],
        ['El menor entero es ', v('x', `${correcta} m`), '.'],
      ];
      return { correcta, unidad: 'm', errores, variables, enunciado, pregunta, solucion, enteros: true, datos: { tipo: 'desigualdad', sub, p, q, u } };
    }
    if (sub === 'isosceles-ceviana') {
      const c = rng.entero(3, 15), m = rng.entero(2, 15);
      if (c === m) return null;
      const R = calc.isoscelesCeviana(c, m), lo = Math.abs(c - m);
      const variables = { c: { nombre: 'AB', color: 'o' }, m: { nombre: 'BD', color: 'i' }, x: { nombre: 'AC', color: 'd' } };
      const enunciado = ['En el triángulo ABC se ubica el punto D en el lado AC de modo que el ángulo DBC mide lo mismo que el ángulo DCB. Se sabe que ', v('c', `AB = ${L(c)}`), ' y ', v('m', `BD = ${L(m)}`), '. El lado ', v('x', 'AC'), ' mide un número entero.'];
      const pregunta = ['¿Cuál es el ', v('x', 'menor valor'), ' que puede tener AC?'];
      const errores = [
        h('GT-limite-incluido', R.min - 1, `Tomaste AD = ${lo}, el valor límite. Con él, A, B y D quedan en una recta: la desigualdad es estricta.`),
        h('GT-sin-isosceles', lo + 1, `Ese es el menor valor de AD, no de AC. Falta sumar DC, que mide lo mismo que BD (${m}) porque el triángulo DBC es isósceles.`),
        h('GT-cota-equivocada', R.max, 'Ese es el mayor valor posible de AC, no el menor.'),
        h('GT-un-solo-triangulo', Math.abs(c - 2 * m) + 1 > 0 && Math.abs(c - 2 * m) + 1 !== R.min ? Math.abs(c - 2 * m) + 1 : -1, 'Aplicaste la desigualdad en el triángulo ABC con BC = 2·BD. BC no mide eso: en el isósceles DBC, BC es menor que BD + DC.'),
      ];
      const solucion = [
        ['Como los ángulos DBC y DCB son iguales, el triángulo DBC es isósceles: DC = BD = ', v('m', `${m}`), '.'],
        ['En el triángulo ABD: ', `${lo} < AD < ${c + m}`, '.'],
        [v('x', 'AC'), ` = AD + DC, así que ${lo + m} < AC < ${c + 2 * m}.`],
        ['El menor entero es ', v('x', L(R.min)), '.'],
      ];
      return { correcta: R.min, unidad: u, errores, variables, enunciado, pregunta, solucion, enteros: true, datos: { tipo: 'desigualdad', sub, c, m, u } };
    }
    // contar
    const N = rng.entero(7, 36), correcta = calc.contarTriangulos(N);
    let conDeg = 0, todas = 0, ordenadas = 0, escalenos = 0;
    for (let a = 1; a <= N; a++) for (let b = a; b <= N; b++) {
      const c = N - a - b; if (c < b) continue;
      todas++;
      if (a + b >= c) conDeg++;
      if (a + b > c) { ordenadas += a === b && b === c ? 1 : (a === b || b === c ? 3 : 6); if (a < b && b < c) escalenos++; }
    }
    const variables = { N: { nombre: 'perímetro', color: 'o' }, x: { nombre: 'número de triángulos', color: 'd' } };
    const enunciado = ['Con un alambre de ', v('N', `${N} cm`), ' se quiere doblar un triángulo cuyos lados midan un número entero de centímetros, usando todo el alambre.'];
    const pregunta = ['¿Cuántos ', v('x', 'triángulos distintos'), ' se pueden formar? (Dos triángulos con los mismos tres lados cuentan como uno.)'];
    const errores = [
      h('GT-limite-incluido', conDeg, 'Contaste también los casos en que un lado es igual a la suma de los otros dos. Ahí el alambre queda doblado sobre una recta: no hay triángulo.'),
      h('GT-sin-desigualdad', todas, 'Contaste todas las maneras de repartir el alambre en tres números enteros. Falta la desigualdad triangular: el lado mayor debe ser menor que la mitad del perímetro.'),
      h('GT-cuenta-ordenadas', ordenadas, 'Contaste el mismo triángulo varias veces, con los lados en distinto orden. Se pide contar triángulos, no órdenes.'),
      h('GT-solo-escalenos', escalenos, 'Contaste solo los triángulos con los tres lados distintos. Los isósceles (y el equilátero, si lo hay) también son triángulos.'),
    ];
    const cmax = Math.ceil(N / 2) - 1;
    const ternas = [];
    for (let c = Math.ceil(N / 3); c <= cmax; c++) {
      const t = [];
      for (let a = 1; a <= N; a++) { const b = N - c - a; if (a <= b && b <= c) t.push(`(${a}, ${b}, ${c})`); }
      if (t.length) ternas.push(`con c = ${c}, ${t.join(', ')}`);
    }
    const ternasTxt = ternas.join('; ');
    const solucion = [
      ['Se ordenan los lados a ≤ b ≤ c, con a + b + c = ', v('N', `${N}`), '. La desigualdad triangular pide a + b > c, es decir, c < ', `${N}/2`, `: el lado mayor va de ${Math.ceil(N / 3)} a ${cmax}.`],
      ['Para cada c se buscan a ≤ b ≤ c con a + b = ', `${N} − c`, ': ', ternasTxt, '.'],
      ['En total: ', v('x', `${correcta}`), ' triángulos.'],
    ];
    return { correcta, unidad: '', errores, variables, enunciado, pregunta, solucion, enteros: true, datos: { tipo: 'desigualdad', sub, N } };
  }

  // ---------- obtusángulo y acutángulo ----------
  function obtusangulo(rng, u, plan) {
    const sub = plan.sub, L = x => `${x} ${u}`;
    const a = sub === 'relacion' ? rng.entero(3, 30) : rng.entero(2, 15), b = sub === 'relacion' ? rng.entero(4, 40) : rng.entero(3, 20);
    if (a >= b) return null;
    const variables = { a: { nombre: 'lado menor dado', color: 'o' }, b: { nombre: 'lado mayor dado', color: 'i' }, x: { nombre: 'tercer lado', color: 'd' } };
    const tri = calc.tercerLado(a, b);
    const S2 = a * a + b * b, D2 = b * b - a * a, rS = isqrt(S2), rD = isqrt(D2);
    const cuadS = rS * rS === S2, cuadD = rD * rD === D2;
    const raizS = cuadS ? `${rS}` : `√${S2}`, raizD = cuadD ? `${rD}` : `√${D2}`;
    if (sub.startsWith('entre') || sub === 'perimetros') {
      const R = calc.obtusoEntre(a, b);
      if (R.cuantos < 2) return null;
      const agudos = rango(tri.min, mayorMenorQueRaiz(S2));
      const ctx = rng.moneda();
      if (ctx || sub === 'perimetros') u = 'm';
      const enunciado = ctx || sub === 'perimetros'
        ? ['Se quiere cercar un terreno triangular. Dos de sus lados miden ', v('a', L(a)), ' y ', v('b', L(b)), ', y el ángulo que forman es obtuso. El tercer lado mide un número entero de ' + (u === 'm' ? 'metros' : 'centímetros') + '.']
        : ['En un triángulo, dos lados miden ', v('a', L(a)), ' y ', v('b', L(b)), ' y el ángulo comprendido entre ellos es obtuso. El ', v('x', 'tercer lado'), ' es entero.'];
      const pasos = [
        ['Desigualdad triangular: ', `${b - a} < x < ${a + b}`, '.'],
        ['El ángulo entre ', v('a', `${a}`), ' y ', v('b', `${b}`), ' es obtuso: el lado opuesto, x, cumple x² > ', `${a}² + ${b}² = ${S2}`, ', o sea x > ', raizS, cuadS ? ' (con x = ' + rS + ' el ángulo sería recto).' : '.'],
        ['Las dos a la vez: ', v('x', `x va de ${R.min} a ${R.max}`), '.'],
      ];
      if (sub === 'entre-cuantos') {
        const pregunta = ['¿Cuántos valores enteros puede tener el ', v('x', 'tercer lado'), '?'];
        const errores = [
          h('GT-sin-condicion-obtuso', tri.cuantos, 'Usaste solo la desigualdad triangular. Falta la condición de obtusángulo: x² > a² + b².'),
          h('GT-limite-incluido', R.cuantos + 1, `Contaste también x = ${a + b}: con ese valor los lados quedan sobre una recta.`),
          h('GT-condicion-invertida', agudos.cuantos, 'Contaste los triángulos con ese ángulo agudo (x² < a² + b²). Para que sea obtuso, el lado opuesto tiene que ser mayor: x² > a² + b².'),
          cuadS ? h('GT-limites-incluidos', R.cuantos + 2, `Contaste también x = ${rS} (ángulo recto) y x = ${a + b} (lados sobre una recta). Ninguno de los dos da un triángulo obtusángulo.`) : null,
        ];
        const cambios = [[errores[1], h('GT-resta-sin-mas-uno', R.cuantos - 1, `Restaste los extremos, ${R.max} − ${R.min} = ${R.cuantos - 1}, y olvidaste sumar 1: así dejas fuera uno de los valores. De ${R.min} a ${R.max} hay ${R.max} − ${R.min} + 1.`)]];
        const solucion = [...pasos, ['Son ', v('x', `${R.max} − ${R.min} + 1 = ${R.cuantos}`), ' valores.']];
        return { correcta: R.cuantos, unidad: '', errores, cambios, variables, enunciado, pregunta, solucion, enteros: true, datos: { tipo: 'obtusangulo', sub, a, b, u } };
      }
      if (sub === 'entre-max') {
        const pregunta = ['¿Cuál es el ', v('x', 'mayor valor'), ' que puede tener el tercer lado?'];
        const errores = [
          h('GT-limite-incluido', a + b, `Tomaste x = ${a} + ${b}. Con ese valor los lados quedan sobre una recta: no hay triángulo.`),
          h('GT-cota-equivocada', R.min, 'Ese es el menor valor posible, no el mayor.'),
          h('GT-condicion-invertida', agudos.max, 'Usaste la condición al revés (x² < a² + b²): ese es el mayor valor con el ángulo agudo. Si el ángulo es obtuso, x es mayor.'),
        ];
        const solucion = [...pasos, ['El mayor es ', v('x', L(R.max)), '.']];
        return { correcta: R.max, unidad: u, errores, variables, enunciado, pregunta, solucion, enteros: true, datos: { tipo: 'obtusangulo', sub, a, b, u } };
      }
      if (sub === 'entre-min') {
        const pregunta = ['¿Cuál es el ', v('x', 'menor valor'), ' que puede tener el tercer lado?'];
        const errores = [
          h('GT-sin-condicion-obtuso', tri.min, 'Usaste solo la desigualdad triangular. Falta la condición de obtusángulo: x² > a² + b².'),
          cuadS ? h('GT-limite-incluido', rS, `Con x = ${rS}, ${rS}² = ${a}² + ${b}²: el ángulo es recto, no obtuso. La desigualdad es estricta.`)
                : h('GT-redondeo-abajo', rS, `√${S2} está entre ${rS} y ${rS + 1}. Redondeaste hacia abajo, pero x tiene que ser mayor que √${S2}.`),
          h('GT-cota-equivocada', R.max, 'Ese es el mayor valor posible, no el menor.'),
          h('GT-mayor-que-el-mayor', b + 1, `Pediste solo que x sea el lado mayor (x > ${b}). Ser el lado mayor no basta para que el ángulo opuesto sea obtuso: hace falta x² > a² + b².`),
        ];
        const solucion = [...pasos, ['El menor es ', v('x', L(R.min)), '.']];
        return { correcta: R.min, unidad: u, errores, variables, enunciado, pregunta, solucion, enteros: true, datos: { tipo: 'obtusangulo', sub, a, b, u } };
      }
      // perímetros con costo
      const k = rng.elegir([5, 8, 10, 12, 15, 20, 25, 30, 40, 50]);
      const sol = x => `S/ ${P.formatear(x)}`;
      variables.k = { nombre: 'costo por metro', color: 'h' };
      const enun = [...enunciado, ' El cerco cuesta ', v('k', `${sol(k)} por ${u === 'm' ? 'metro' : 'centímetro'}`), '.'];
      const pregunta = ['¿Cuánto más cuesta cercar el terreno de ', v('x', 'perímetro máximo'), ' que el de perímetro mínimo?'];
      const correcta = k * (R.max - R.min);
      const errores = [
        h('GT-sin-condicion-obtuso', k * (tri.max - tri.min), 'Usaste solo la desigualdad triangular para el lado mínimo. Con el ángulo obtuso, el tercer lado tiene que cumplir además x² > a² + b².'),
        h('GT-limite-incluido', k * (a + b - R.min), `Tomaste el lado máximo igual a ${a} + ${b}. Con ese valor no hay triángulo.`),
        cuadS ? h('GT-limite-incluido-recto', k * (R.max - rS), `Tomaste el lado mínimo x = ${rS}: con él el ángulo es recto, no obtuso.`)
              : h('GT-redondeo-abajo', k * (R.max - rS), `Redondeaste √${S2} hacia abajo (${rS}). El lado mínimo tiene que ser mayor que √${S2}.`),
        h('GT-condicion-invertida', k * (agudos.max - tri.min), 'Usaste los triángulos con el ángulo agudo (x² < a² + b²). Para el obtuso, x² > a² + b².'),
      ];
      // El límite incluido y el redondeo dan siempre lo mismo (k más que la correcta): uno de los dos se cambia
      // por un error que queda por debajo. Si no, todos los errores cuestan de más.
      const dosVeces = h('GT-estricta-dos-veces', k * (R.max - R.min - 1), `Tomaste el lado mínimo ${R.min + 1}: al menor entero que cumple x² > ${S2} le sumaste otra unidad por la desigualdad estricta, y te salió (${R.max} − ${R.min + 1})·${k} = ${sol(k * (R.max - R.min - 1))}. ${R.min} ya la cumple (${R.min}² = ${R.min * R.min}): la diferencia de lados es ${R.max - R.min}.`);
      const alternos = [[errores[0], dosVeces, errores[2], errores[3]], [errores[0], dosVeces, errores[2]]];
      const solucion = [...pasos, ['Los perímetros se diferencian solo en el tercer lado: ', `${R.max} − ${R.min} = ${R.max - R.min} ${u}`, '.'],
        ['Diferencia de costo: ', `${R.max - R.min} · `, v('k', `${k}`), ' = ', v('x', sol(correcta)), '.']];
      return { correcta, unidad: 'soles', texto: sol, errores, alternos, variables, enunciado: enun, pregunta, solucion, enteros: true, datos: { tipo: 'obtusangulo', sub, a, b, k, u } };
    }
    if (sub === 'opuesto-cuantos') {
      const R = calc.obtusoOpuesto(a, b);
      if (R.cuantos < 2) return null;
      const agudo = rango(mayorMenorQueRaiz(D2) + (cuadD ? 2 : 1), tri.max); // ángulo opuesto a b agudo
      const enunciado = ['En un triángulo, dos lados miden ', v('a', L(a)), ' y ', v('b', L(b)), '. El ángulo opuesto al lado de ', v('b', L(b)), ' es obtuso, y el ', v('x', 'tercer lado'), ' mide un número entero.'];
      const pregunta = ['¿Cuántos valores puede tener el ', v('x', 'tercer lado'), '?'];
      const errores = [
        h('GT-sin-condicion-obtuso', tri.cuantos, 'Usaste solo la desigualdad triangular. Falta la condición de obtusángulo: el lado opuesto al ángulo obtuso cumple b² > a² + x².'),
        h('GT-limite-incluido', R.cuantos + 1, `Contaste también x = ${b - a}: con ese valor los lados quedan sobre una recta.`),
        cuadD ? h('GT-limites-incluidos', R.cuantos + 2, `Contaste también x = ${rD} (ángulo recto) y x = ${b - a} (lados sobre una recta). Ninguno de los dos da un triángulo obtusángulo.`) : null,
        h('GT-obtuso-frente-a-x', calc.obtusoEntre(a, b).cuantos, 'Pusiste el ángulo obtuso frente al tercer lado. El enunciado lo pone frente al lado de ' + b + ': b² > a² + x².'),
        h('GT-condicion-invertida', agudo.cuantos, 'Contaste los triángulos con ese ángulo agudo (x² > b² − a²). Para que sea obtuso, x² < b² − a².'),
      ];
      const cambios = [[errores[1], h('GT-resta-sin-mas-uno', R.cuantos - 1, `Restaste los extremos, ${R.max} − ${R.min} = ${R.cuantos - 1}, y olvidaste sumar 1: así dejas fuera uno de los valores. De ${R.min} a ${R.max} hay ${R.max} − ${R.min} + 1.`)]];
      const solucion = [
        ['Desigualdad triangular: ', `${b - a} < x < ${a + b}`, '.'],
        ['El ángulo opuesto a ', v('b', `${b}`), ' es obtuso: ', `${b}² > ${a}² + x²`, ', o sea x² < ', `${D2}`, ' y x < ', raizD, '.'],
        ['Las dos a la vez: x va de ', `${R.min}`, ' a ', `${R.max}`, ': ', v('x', `${R.cuantos}`), ' valores.'],
      ];
      return { correcta: R.cuantos, unidad: '', errores, cambios, variables, enunciado, pregunta, solucion, enteros: true, datos: { tipo: 'obtusangulo', sub, a, b, u } };
    }
    if (sub === 'relacion') {
      // Lados AB = a (dato menor) y AC = b; ∠B obtuso y ∠A > ∠C; BC = x entero y único.
      const R = calc.obtusoRelacion(a, b);
      if (R.cuantos !== 1 || a <= b - a) return null; // la relación de ángulos tiene que pesar
      const sinRel = rango(b - a + 1, mayorMenorQueRaiz(D2));
      const variables = { a: { nombre: 'AB', color: 'o' }, b: { nombre: 'AC', color: 'i' }, x: { nombre: 'BC', color: 'd' } };
      const enunciado = ['En el triángulo ABC, ', v('a', `AB = ${L(a)}`), ' y ', v('b', `AC = ${L(b)}`), '. El ángulo B es obtuso y el ángulo A es mayor que el ángulo C. El lado ', v('x', 'BC'), ' mide un número entero.'];
      const pregunta = ['¿Cuánto mide ', v('x', 'BC'), '?'];
      const errores = [
        h('GT-sin-relacion-angulos', sinRel.min, `Usaste el ángulo obtuso y la desigualdad triangular, pero no la relación de ángulos. Como A > C, el lado opuesto a A (BC) es mayor que el opuesto a C (AB = ${a}).`),
        h('GT-limite-incluido', a, `Con BC = ${a} el triángulo sería isósceles y A sería igual a C. Como A > C, BC > ${a} estrictamente.`),
        h('GT-sin-condicion-obtuso', b + a - 1, `Usaste solo BC < AB + AC. Con el ángulo B obtuso, AC es el lado mayor y AC² > AB² + BC².`),
        cuadD ? h('GT-limite-incluido-recto', rD, `Con BC = ${rD}, ${b}² = ${a}² + ${rD}²: el ángulo B es recto, no obtuso. La desigualdad es estricta.`)
              : h('GT-redondeo-arriba', rD + 1, `Redondeaste √${D2} hacia arriba. BC tiene que ser menor que √${D2}; con ${rD + 1} el ángulo B ya no es obtuso.`),
        h('GT-relacion-invertida', sinRel.min <= a - 1 ? a - 1 : -1, 'Pusiste la relación al revés: al ángulo mayor se opone el lado mayor, así que BC > AB.'),
      ];
      const solucion = [
        ['Al ángulo mayor se opone el lado mayor: como A > C, BC > AB = ', v('a', `${a}`), '.'],
        ['El ángulo B es obtuso: AC² > AB² + BC², es decir, ', `${b}² > ${a}² + BC²`, `, BC² < ${D2} y BC < ${raizD}.`],
        ['La desigualdad triangular pide además BC > ', `${b} − ${a} = ${b - a}`, '. Juntando todo: ', `${Math.max(a, b - a)} < BC < ${raizD}`, '.'],
        ['El único entero es ', v('x', L(R.min)), '.'],
      ];
      return { correcta: R.min, unidad: u, errores, variables, enunciado, pregunta, solucion, enteros: true, datos: { tipo: 'obtusangulo', sub, a, b, u } };
    }
    // acutángulo
    const R = calc.acutangulo(a, b);
    if (R.cuantos < 2) return null;
    const unaSola = rango(tri.min, mayorMenorQueRaiz(S2));
    const enunciado = ['Un triángulo acutángulo (con sus tres ángulos agudos) tiene dos lados de ', v('a', L(a)), ' y ', v('b', L(b)), '. El ', v('x', 'tercer lado'), ' mide un número entero.'];
    const pregunta = ['¿Cuántos valores puede tener el ', v('x', 'tercer lado'), '?'];
    const errores = [
      h('GT-sin-condicion-acutangulo', tri.cuantos, 'Usaste solo la desigualdad triangular. Para que los tres ángulos sean agudos, el cuadrado del lado mayor tiene que ser menor que la suma de los cuadrados de los otros dos.'),
      h('GT-una-sola-condicion', unaSola.cuantos, `Solo pediste que x sea agudo frente a x (x² < ${S2}). Si x es pequeño, el lado mayor es ${b}, y también se necesita ${b}² < ${a}² + x².`),
      cuadS || cuadD ? h('GT-limite-incluido', R.cuantos + (cuadS ? 1 : 0) + (cuadD ? 1 : 0), `Contaste ${[cuadD ? `x = ${rD}` : '', cuadS ? `x = ${rS}` : ''].filter(Boolean).join(' y ')}: con ese valor un ángulo es recto, y recto no es agudo.`) : null,
      h('GT-supone-x-mayor', R.max - b + 1, `Supusiste que x es el lado mayor (x ≥ ${b}). También puede ser menor que ${b}, siempre que ${b}² < ${a}² + x².`),
    ];
    const solucion = [
      ['Si x es el lado mayor: x² < ', `${a}² + ${b}² = ${S2}`, ', o sea x < ', raizS, '.'],
      ['Si el lado mayor es ', v('b', `${b}`), ': ', `${b}² < ${a}² + x²`, ', o sea x > ', raizD, '.'],
      ['(La desigualdad triangular ya queda cumplida.) x va de ', `${R.min}`, ' a ', `${R.max}`, ': ', v('x', `${R.cuantos}`), ' valores.'],
    ];
    return { correcta: R.cuantos, unidad: '', errores, variables, enunciado, pregunta, solucion, enteros: true, datos: { tipo: 'obtusangulo', sub, a, b, u } };
  }

  // ---------- ángulos con puntos notables ----------
  const g = x => `${P.formatear(x, 1)}°`;
  function angulos(rng, u, plan) {
    const sub = plan.sub;
    const variables = { A: { nombre: 'ángulo A', color: 'o' }, x: { nombre: 'ángulo pedido', color: 'd' } };
    const base = { texto: g, unidad: '°', enteros: true };
    if (['incentro', 'excentro', 'int-ext', 'ortocentro', 'circuncentro'].includes(sub)) {
      const agudo = sub === 'ortocentro' || sub === 'circuncentro';
      const A = agudo ? 2 * rng.entero(16, 43) : 2 * rng.entero(10, 75);
      const correcta = calc.angulo(sub, A);
      const que = {
        incentro: ['las bisectrices interiores de los ángulos B y C se cortan en I', '∠BIC'],
        excentro: ['las bisectrices de los ángulos exteriores en B y en C se cortan en E', '∠BEC'],
        'int-ext': ['la bisectriz interior del ángulo B y la bisectriz del ángulo exterior en C se cortan en E', '∠BEC'],
        ortocentro: ['las alturas trazadas desde B y desde C se cortan en H', '∠BHC'],
        circuncentro: ['O es el centro de la circunferencia que pasa por A, B y C', '∠BOC'],
      }[sub];
      const ctx = !agudo && rng.moneda();
      const enunciado = ctx
        ? ['Un terreno triangular ABC tiene en la esquina A un ángulo de ', v('A', g(A)), '. Dos caminos rectos parten en dos partes iguales ', sub === 'incentro' ? 'los ángulos B y C del terreno (bisectrices interiores) y se cruzan en I.' : sub === 'excentro' ? 'los ángulos exteriores en B y en C (bisectrices exteriores) y se cruzan en E, fuera del terreno.' : 'el ángulo B del terreno y el ángulo exterior en C, y se cruzan en E, fuera del terreno.']
        : [`En el triángulo ${agudo ? 'acutángulo ' : ''}ABC, `, v('A', `∠A = ${g(A)}`), ` y ${que[0]}.`];
      const pregunta = ['¿Cuánto mide el ángulo ', v('x', que[1]), '?'];
      const E = {
        exc: h('GT-formula-excentro', 90 - A / 2, sub === 'incentro' ? 'Usaste la fórmula del excentro (90° − A/2). Con las bisectrices interiores el punto queda dentro del triángulo y el ángulo es obtuso: 90° + A/2.' : 'Usaste la fórmula del excentro (90° − A/2), que es para dos bisectrices exteriores.'),
        inc: h('GT-formula-incentro', 90 + A / 2, 'Usaste la fórmula del incentro (90° + A/2), que es para dos bisectrices interiores.'),
        ie: h('GT-formula-int-ext', A / 2, 'Usaste la fórmula de una bisectriz interior con una exterior (A/2).'),
        orto: h('GT-formula-ortocentro', 180 - A, 'Usaste la fórmula del ortocentro (180° − A).'),
        circ: h('GT-formula-circuncentro', 2 * A, 'Usaste la fórmula del circuncentro (2A): ese es un ángulo central, que vale el doble del inscrito.'),
      };
      let errores, solucion;
      if (sub === 'incentro') {
        errores = [E.exc, h('GT-sin-mitad', 90 + A, 'Olvidaste la mitad: las bisectrices toman la mitad de B y de C, y por eso queda A/2.'), E.ie, E.orto, E.circ];
        solucion = [['En el triángulo BIC: ∠BIC = 180° − B/2 − C/2 = 180° − (B + C)/2.'], ['Como B + C = 180° − A: ∠BIC = 180° − (180° − A)/2 = 90° + A/2.'], [v('x', '∠BIC'), ' = 90° + ', v('A', g(A)), '/2 = ', v('x', g(correcta)), '.']];
      } else if (sub === 'excentro') {
        errores = [E.inc, h('GT-sin-mitad', 90 - A, 'Olvidaste la mitad: cada bisectriz exterior toma la mitad del ángulo exterior.'), E.ie, E.orto];
        solucion = [['Los ángulos exteriores en B y C miden 180° − B y 180° − C; sus bisectrices toman la mitad.'], ['En el triángulo BEC: ∠BEC = 180° − (180° − B)/2 − (180° − C)/2 = (B + C)/2 = 90° − A/2.'], [v('x', '∠BEC'), ' = 90° − ', v('A', g(A)), '/2 = ', v('x', g(correcta)), '.']];
      } else if (sub === 'int-ext') {
        errores = [h('GT-sin-mitad', A, 'Olvidaste la mitad: el ángulo exterior en C es A + B, y su mitad menos la mitad de B deja A/2.'), E.exc, E.inc, E.orto];
        solucion = [['Ángulo exterior en C: A + B. En el triángulo BEC, ese ángulo exterior partido en dos es (A + B)/2 = ∠BEC + B/2.'], ['∠BEC = (A + B)/2 − B/2 = A/2.'], [v('x', '∠BEC'), ' = ', v('A', g(A)), '/2 = ', v('x', g(correcta)), '.']];
      } else if (sub === 'ortocentro') {
        errores = [E.inc, E.circ, h('GT-igual-a-A', A, 'Igualaste el ángulo en H con el ángulo A. Los dos suman 180°: el cuadrilátero que forman A, los pies de las alturas y H tiene dos ángulos rectos.'), E.exc];
        solucion = [['Sean E y F los pies de las alturas desde B y C. El cuadrilátero AFHE tiene ángulos rectos en E y F.'], ['Entonces ∠FHE = 360° − 90° − 90° − A = 180° − A, y ∠BHC es su opuesto por el vértice.'], [v('x', '∠BHC'), ' = 180° − ', v('A', g(A)), ' = ', v('x', g(correcta)), '.']];
      } else {
        errores = [hi('GE15-central-igual-inscrito', A, 'Igualaste el ángulo central con el inscrito. El central BOC abarca el mismo arco BC que el inscrito A, y vale el doble.'), hi('GE15-mitad', A / 2, 'Tomaste la mitad en vez del doble: el inscrito es la mitad del central, no al revés.'), E.orto, E.inc];
        solucion = [['El ángulo inscrito A y el ángulo central BOC abarcan el mismo arco BC.'], ['El central vale el doble del inscrito.'], [v('x', '∠BOC'), ' = 2·', v('A', g(A)), ' = ', v('x', g(correcta)), '.']];
      }
      return { ...base, correcta, errores, variables, enunciado, pregunta, solucion, datos: { tipo: 'angulos', sub, A } };
    }
    if (sub === 'orto-incentro') {
      const A = 2 * rng.entero(16, 43), theta = 180 - A, correcta = calc.ortoIncentro(theta);
      variables.A = { nombre: '∠BHC', color: 'o' };
      const enunciado = ['En el triángulo acutángulo ABC, H es el ortocentro (donde se cortan las alturas) e I es el incentro (donde se cortan las bisectrices). Se sabe que ', v('A', `∠BHC = ${g(theta)}`), '.'];
      const pregunta = ['¿Cuánto mide el ángulo ', v('x', '∠BIC'), '?'];
      const errores = [
        h('GT-angulo-H-como-A', 90 + theta / 2, `Usaste ∠BHC = ${g(theta)} como si fuera el ángulo A. Primero hay que hallar A: ∠BHC = 180° − A.`),
        h('GT-formula-excentro', 90 - A / 2, 'Usaste la fórmula del excentro (90° − A/2). El incentro está dentro del triángulo: ∠BIC = 90° + A/2, que es obtuso.'),
        h('GT-formula-int-ext', A / 2, 'Usaste A/2, la fórmula de una bisectriz interior con una exterior.'),
        h('GT-formula-circuncentro', 2 * A, 'Usaste la fórmula del circuncentro (2A).'),
      ];
      const solucion = [
        ['Con el ortocentro: ∠BHC = 180° − A, así que A = 180° − ', v('A', g(theta)), ` = ${g(A)}.`],
        ['Con el incentro: ∠BIC = 90° + A/2.'],
        [v('x', '∠BIC'), ` = 90° + ${g(A)}/2 = `, v('x', g(correcta)), '.'],
      ];
      return { ...base, correcta, errores, variables, enunciado, pregunta, solucion, datos: { tipo: 'angulos', sub, theta } };
    }
    // pies de las alturas
    const B = rng.entero(46, 84), C = rng.entero(46, 84), A = 180 - B - C;
    if (A <= 20 || A >= 88 || B === C) return null;
    const pide = plan.pide;
    const variables2 = { B: { nombre: 'ángulo B', color: 'o' }, C: { nombre: 'ángulo C', color: 'i' }, x: { nombre: 'ángulo pedido', color: 'd' } };
    const enunciado = ['En el triángulo acutángulo ABC, ', v('B', `∠B = ${g(B)}`), ' y ', v('C', `∠C = ${g(C)}`), '. E es el pie de la altura trazada desde B (sobre AC), F es el pie de la altura trazada desde C (sobre AB) y O es el circuncentro.'];
    if (pide === 'AFE' || pide === 'OAB') {
      const afe = pide === 'AFE', correcta = afe ? C : 90 - C;
      const pregunta = ['¿Cuánto mide el ángulo ', v('x', afe ? '∠AFE' : '∠OAB'), '?'];
      const errores = afe ? [
        h('GT-angulo-cruzado', B, 'Ese es el ángulo AEF. En el cuadrilátero inscriptible BCEF, el ángulo AFE (en F) es igual al ángulo del vértice opuesto, C.'),
        h('GT-complemento', 90 - C, 'Ese es el ángulo OAB (el que forma AO con AB), no el ángulo AFE.'),
        h('GT-angulo-A', A, 'Ese es el ángulo A. El triángulo AFE tiene el ángulo A, pero sus otros dos ángulos son B y C cruzados.'),
        h('GT-suplemento', 180 - C, 'Ese es el ángulo BFE, el suplemento de AFE.'),
      ] : [
        h('GT-angulo-AFE', C, 'Ese es el ángulo AFE. El ángulo OAB sale del triángulo isósceles AOB: 90° − C.'),
        h('GT-angulo-cruzado', 90 - B, 'Usaste B en vez de C. El ángulo central AOB abarca el arco AB, y el inscrito que abarca ese arco está en C.'),
        h('GT-sin-mitad', 180 - 2 * C, 'Olvidaste dividir entre 2: en el triángulo isósceles AOB, los ángulos de la base suman 180° − 2C, y cada uno es la mitad.'),
        h('GT-mitad-de-A', A / 2, 'Tomaste AO como bisectriz de A. AO no parte el ángulo A en dos: forma 90° − C con AB.'),
      ];
      const solucion = afe ? [
        ['Los ángulos BEC y BFC son rectos: E y F están en la circunferencia de diámetro BC. BCEF es un cuadrilátero inscriptible.'],
        ['En un cuadrilátero inscriptible, el ángulo exterior en un vértice es igual al ángulo interior del vértice opuesto.'],
        [v('x', '∠AFE'), ' = ∠ECB = ', v('C', g(C)), '.'],
      ] : [
        ['El ángulo central AOB abarca el mismo arco AB que el inscrito C: ∠AOB = 2·', v('C', g(C)), ` = ${g(2 * C)}.`],
        ['El triángulo AOB es isósceles (OA = OB): sus ángulos de la base miden (180° − ', `${g(2 * C)})/2.`],
        [v('x', '∠OAB'), ' = 90° − ', v('C', g(C)), ' = ', v('x', g(correcta)), '.'],
      ];
      return { ...base, correcta, errores, variables: variables2, enunciado, pregunta, solucion, datos: { tipo: 'angulos', sub, pide, B, C } };
    }
    if (pide === 'AEF') {
      const pregunta = ['¿Cuánto mide el ángulo ', v('x', '∠AEF'), '?'];
      const errores = [
        h('GT-angulo-cruzado', C, 'Ese es el ángulo AFE. En el cuadrilátero inscriptible BCEF, el ángulo AEF (en E) es igual al ángulo del vértice opuesto, B.'),
        h('GT-complemento', 90 - B, 'Ese es el ángulo OAC (el que forma AO con AC), no el ángulo AEF.'),
        h('GT-angulo-A', A, 'Ese es el ángulo A. El triángulo AEF tiene el ángulo A, pero sus otros dos ángulos son B y C cruzados.'),
        h('GT-suplemento', 180 - B, 'Ese es el ángulo FEC, el suplemento de AEF.'),
      ];
      const solucion = [
        ['Los ángulos BEC y BFC son rectos: E y F están en la circunferencia de diámetro BC. BCEF es un cuadrilátero inscriptible.'],
        ['En un cuadrilátero inscriptible, el ángulo exterior en un vértice es igual al ángulo interior del vértice opuesto.'],
        [v('x', '∠AEF'), ' = ∠FBC = ', v('B', g(B)), '.'],
      ];
      return { ...base, correcta: B, errores, variables: variables2, enunciado, pregunta, solucion, datos: { tipo: 'angulos', sub, pide, B, C } };
    }
    const pregunta = ['¿Qué ángulo forman las rectas ', v('x', 'AO y EF'), '?'];
    const errores = [
      h('GT-angulo-AEF', B, 'Ese es el ángulo AEF. A él hay que sumarle el ángulo OAE para cerrar el triángulo que forman AO, EF y AC.'),
      h('GT-angulo-OAC', 90 - B, 'Ese es el ángulo OAC. Falta sumarle el ángulo AEF = B.'),
      h('GT-angulo-A', A, 'Ese es el ángulo A del triángulo. AO no es bisectriz de A: forma con AC el ángulo 90° − B.'),
      h('GT-angulo-cruzado', C, 'Ese es el ángulo AFE. Con AO se combina el ángulo AEF = B, no C.'),
    ];
    const solucion = [
      ['BCEF es inscriptible (ángulos rectos en E y F sobre BC): ∠AEF = ', v('B', g(B)), '.'],
      ['El triángulo AOC es isósceles (OA = OC) con ∠AOC = 2B: ∠OAC = 90° − ', v('B', g(B)), ` = ${g(90 - B)}.`],
      ['En el triángulo que forman AO, EF y AC: 180° − ', `${g(B)} − ${g(90 - B)}`, ' = ', v('x', '90°'), '. Siempre son perpendiculares.'],
    ];
    return { ...base, correcta: 90, errores, variables: variables2, enunciado, pregunta, solucion, datos: { tipo: 'angulos', sub, pide, B, C } };
  }

  // ---------- ortocentro y Pitágoras ----------
  const CATETOS = (() => {
    const t = {};
    for (const hh of [8, 9, 12, 15, 16, 20, 21, 24, 30, 36]) { t[hh] = []; for (let m = 1; m <= 50; m++) if (Number.isInteger(Math.sqrt(m * m + hh * hh))) t[hh].push(m); }
    return t;
  })();
  function ortocentro(rng, u, plan) {
    u = 'm';
    const hh = rng.elegir(Object.keys(CATETOS).map(Number));
    const AF = rng.elegir(CATETOS[hh]), FB = rng.elegir(CATETOS[hh]);
    if (AF === FB || hh * hh <= AF * FB) return null;  // ángulo C agudo: H dentro
    const AC = Math.hypot(AF, hh), BC = Math.hypot(FB, hh), pide = plan.pide;
    const variables = { AF: { nombre: 'AF', color: 'o' }, FB: { nombre: 'FB', color: 'i' }, lado: { nombre: pide === 'CF' ? 'AC' : 'BC', color: 'h' }, x: { nombre: pide === 'CF' ? 'canaleta CF' : 'AC', color: 'd' } };
    const intro = ['La estructura de un techo es un triángulo ABC con la viga AB abajo. Dos tirantes, AD y BE, son alturas del triángulo (D en BC y E en AC) y se cruzan en H. Una canaleta recta baja desde C, pasa por H y llega a la viga AB en F. Se mide '];
    const datos = { tipo: 'ortocentro', pide, AF, FB, u };
    if (pide === 'CF') {
      datos.AC = AC;
      const enunciado = [...intro, v('AF', `AF = ${AF} m`), ', ', v('FB', `FB = ${FB} m`), ' y ', v('lado', `AC = ${AC} m`), '.'];
      const pregunta = ['¿Cuánto mide la ', v('x', 'canaleta CF'), '?'];
      const errores = [
        pa('GE11-suma', Math.hypot(AC, AF), 'Sumaste los cuadrados, pero CF es un cateto: AC es la hipotenusa del triángulo AFC. Se resta: CF² = AC² − AF².'),
        h('GT-resta-lados', AC - AF, 'Restaste las longitudes. En el triángulo rectángulo se restan los cuadrados, no los lados.'),
        hi('GE22-pareja', Math.sqrt(Math.abs(AC * AC - FB * FB)), 'Usaste FB con AC, que no están en el mismo triángulo rectángulo. AC va con AF (triángulo AFC).'),
        h('GT-sin-raiz', AC * AC - AF * AF, 'Calculaste CF² = AC² − AF² y olvidaste sacar la raíz cuadrada.'),
        h('GT-sin-perpendicular', (AF + FB) / 2, 'Tomaste CF como si fuera la mediana. CF pasa por el ortocentro, así que es la tercera altura: es perpendicular a AB.'),
      ];
      const solucion = [
        ['Las tres alturas de un triángulo pasan por el ortocentro H. La canaleta CF pasa por H: es la tercera altura, perpendicular a AB.'],
        ['El triángulo AFC es rectángulo en F, con hipotenusa AC.'],
        [v('x', 'CF'), ' = √(', v('lado', `${AC}`), '² − ', v('AF', `${AF}`), `²) = √${AC * AC - AF * AF} = `, v('x', `${hh} m`), '.'],
      ];
      return { correcta: hh, unidad: 'm', errores, variables, enunciado, pregunta, solucion, datos };
    }
    datos.BC = BC;
    const enunciado = [...intro, v('AF', `AF = ${AF} m`), ', ', v('FB', `FB = ${FB} m`), ' y ', v('lado', `BC = ${BC} m`), '.'];
    const pregunta = ['¿Cuánto mide el lado ', v('x', 'AC'), '?'];
    const errores = [
      pa('GE8-ceviana-media', BC, 'Supusiste que F es el punto medio de AB y el triángulo es isósceles. F es el pie de la altura, y aquí AF ≠ FB.'),
      h('GT-suma-catetos', AF + hh, 'Sumaste los catetos AF y CF. La hipotenusa sale de la suma de sus cuadrados.'),
      h('GT-da-la-canaleta', hh, 'Ese es CF, la altura. Falta el último paso: AC² = AF² + CF².'),
      h('GT-pitagoras-sin-altura', Math.hypot(BC, AF), 'Usaste BC como cateto de AFC. BC está en el otro triángulo rectángulo (BFC); primero se halla CF.'),
      hi('GE11-resta', Math.sqrt(Math.abs(BC * BC - FB * FB - AF * AF)), 'Restaste AF² en vez de sumarlo. AC es la hipotenusa de AFC: AC² = CF² + AF².'),
    ];
    const solucion = [
      ['Las tres alturas pasan por el ortocentro H. La canaleta CF pasa por H: es la tercera altura, perpendicular a AB.'],
      ['En el triángulo rectángulo BFC: CF = √(', v('lado', `${BC}`), '² − ', v('FB', `${FB}`), `²) = ${hh} m.`],
      ['En el triángulo rectángulo AFC: ', v('x', 'AC'), ' = √(', v('AF', `${AF}`), `² + ${hh}²) = `, v('x', `${AC} m`), '.'],
    ];
    return { correcta: AC, unidad: 'm', errores, variables, enunciado, pregunta, solucion, datos };
  }

  // ---------- bisectrices con 37°/2 y 53°/2 ----------
  function mitades(rng, u) {
    const [A, C] = rng.elegir([[53, 37], [37, 53], [53, 37], [37, 53], [53, 60], [60, 53], [37, 60], [60, 37], [74, 53], [53, 74], [74, 60], [60, 74]]);
    const hh = rng.elegir([8, 9, 12, 16, 18, 24, 27, 32, 36, 45, 48, 54, 64, 72, 96, 108, 144]);
    const { HP, HQ, PQ } = calc.mitades(A, C, hh);
    if (![PQ, HP, HQ].every(x => simple(x, 6)) || PQ <= 0) return null;
    const variables = { h: { nombre: 'altura BH', color: 'o' }, A: { nombre: 'ángulo A', color: 'i' }, C: { nombre: 'ángulo C', color: 'h' }, x: { nombre: 'PQ', color: 'd' } };
    const enunciado = ['En el triángulo ABC, ', v('A', `∠A = ${A}°`), ' y ', v('C', `∠C = ${C}°`), '. La altura BH (H en AC) mide ', v('h', `${hh} ${u}`), '. Las bisectrices de los ángulos A y C cortan a BH en P y Q, respectivamente.'];
    const con74 = A === 74 || C === 74;
    const pregunta = ['¿Cuánto mide ', v('x', 'PQ'), `? (Usa los notables de academia: tan 37° = 3/4 y tan 53° = 4/3${con74 ? ' y tan 74° = 24/7' : ''}.)`];
    const sw = { 37: 53, 53: 37, 60: 60, 74: 74 };
    const TM = { 37: 1 / 3, 53: 1 / 2, 60: 1 / Math.sqrt(3), 74: 3 / 4 };
    const cruzado = Math.abs(hh / TAN[A] * TM[sw[A]] - hh / TAN[C] * TM[sw[C]]);
    const errores = [
      h('GT-suma-en-vez-de-resta', HP + HQ, 'Sumaste HP y HQ. P y Q están los dos sobre BH, medidos desde H: PQ es su diferencia.'),
      h('GT-mitades-cruzadas', cruzado, 'Cambiaste los notables de las mitades: tan(37°/2) = 1/3 y tan(53°/2) = 1/2 (en el triángulo 3-4-5, la mitad del ángulo menor da la tangente menor).'),
      h('GT-cateto-equivocado', Math.abs(hh * TM[A] - hh * TM[C]), 'Multiplicaste la altura BH por la tangente de la mitad. HP es el cateto opuesto a A/2 en el triángulo AHP, cuyo cateto adyacente es AH, no BH.'),
      h('GT-mitad-de-la-distancia', Math.abs(hh / TAN[A] - hh / TAN[C]) / 2, 'Tomaste la mitad de la diferencia AH − HC. Las bisectrices no parten los segmentos por la mitad; hay que usar la tangente de la mitad del ángulo.'),
    ];
    const ah = x => (x === 60 ? `${exacto(hh / Math.sqrt(3))}` : `${exacto(hh / TAN[x])}`);
    const tmTxt = { 37: '1/3', 53: '1/2', 60: '√3/3', 74: '3/4' };
    const solucion = [
      ['En el triángulo rectángulo AHB: AH = BH/tan A = ', v('h', `${hh}`), '/tan ', v('A', `${A}°`), ` = ${ah(A)} ${u}.`],
      ['La bisectriz de A forma ', v('A', `${A}°/2`), ' con AC. En el triángulo AHP: HP = AH·tan(', `${A}°/2) = ${ah(A)}·(${tmTxt[A]}) = ${exacto(HP)} ${u}.`],
      ['Igual con C: HC = ', `${ah(C)} ${u}`, ' y HQ = ', `${ah(C)}·(${tmTxt[C]}) = ${exacto(HQ)} ${u}.`],
      [v('x', 'PQ'), ` = |${exacto(HP)} − ${exacto(HQ)}| = `, v('x', `${exacto(PQ)} ${u}`), '.'],
    ];
    return { correcta: PQ, unidad: u, errores, variables, enunciado, pregunta, solucion, datos: { tipo: 'mitades', A, C, h: hh, u } };
  }

  // ---------- punto medio del arco: incentro y excentro ----------
  function arco(rng, u, plan) {
    const p = rng.entero(2, 15), q = rng.entero(2, 12), pide = plan.pide;
    if (p === q) return null;
    const { AE, IE } = calc.arcoMedio(p, q);
    const variables = { p: { nombre: 'AI', color: 'o' }, q: { nombre: 'IM', color: 'i' }, x: { nombre: pide, color: 'd' } };
    const enunciado = ['El triángulo ABC está inscrito en una circunferencia. La bisectriz del ángulo A pasa por el incentro I, vuelve a cortar a la circunferencia en M y, prolongada, llega al excentro E relativo al lado BC. Se sabe que ', v('p', `AI = ${p} ${u}`), ' y ', v('q', `IM = ${q} ${u}`), '.'];
    const pregunta = ['¿Cuánto mide ', v('x', pide), '?'];
    const errores = pide === 'AE' ? [
      h('GT-excentro-en-arco', p + q, 'Pusiste el excentro E sobre la circunferencia, en M. E está más allá: M es el punto medio de IE.'),
      h('GT-solo-IE', IE, 'Ese es IE. Falta sumar AI.'),
      h('GT-me-doble', p + 3 * q, 'Tomaste ME = 2·MI. M equidista de I y de E: ME = MI.'),
      h('GT-doble', 2 * (p + q), 'Duplicaste AM. Lo que se duplica es MI: E está tan lejos de M como I.'),
    ] : [
      h('GT-solo-IM', q, 'Ese es IM. M es el punto medio de IE: IE = 2·IM.'),
      h('GT-AM', p + q, 'Ese es AM. Se pide el segmento entre el incentro y el excentro.'),
      h('GT-AI-por-IE', p, 'Usaste AI. La distancia de I a E no depende de AI: es el doble de IM.'),
      h('GT-me-doble', 3 * q, 'Tomaste ME = 2·MI. M equidista de I y de E: ME = MI.'),
    ];
    const solucion = [
      ['M es el punto medio del arco BC: MB = MC. Además ∠MBI = ∠MBC + ∠CBI = A/2 + B/2 y ∠MIB = A/2 + B/2 (ángulo exterior del triángulo ABI): MB = MI.'],
      ['El excentro E también está en la bisectriz de A, y ∠IBE = 90° (bisectriz interior y exterior de B). En el triángulo rectángulo IBE, M es el punto medio de la hipotenusa: MI = MB = ME.'],
      pide === 'AE'
        ? [v('x', 'AE'), ' = ', v('p', `${p}`), ' + ', v('q', `${q}`), ' + ', v('q', `${q}`), ' = ', v('x', `${AE} ${u}`), '.']
        : [v('x', 'IE'), ' = 2·', v('q', `${q}`), ' = ', v('x', `${IE} ${u}`), '.'],
    ];
    return { correcta: pide === 'AE' ? AE : IE, unidad: u, errores, variables, enunciado, pregunta, solucion, datos: { tipo: 'arco', pide, p, q, u } };
  }

  return { id: 'geo-triangulos-notables', titulo: 'Lados posibles y ángulos en los puntos notables', generar, calc };
});
