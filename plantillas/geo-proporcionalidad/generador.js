/*
 * Generador: proporcionalidad y semejanza (Thales, bisectriz, incentro, cuerdas, raíces de áreas,
 * mástil sobre el suelo). Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['geo-proporcionalidad']) y en Node (require). No usa ningún motor: el cálculo
 * está en `calc` (funciones puras, que también verifica papel.json).
 *
 * Tipos y campos de _datos (todas las longitudes en la unidad `u`, que es «cm» o «m»):
 *   thales           sub 'tres': tres paralelas L1, L2, L3 cortadas por dos secantes; en la primera
 *                    AB = a, BC = b; en la segunda DE = c (D, E, F en L1, L2, L3). Se pide EF.
 *                    sub 'total': igual, pero de la segunda secante se da DF = d. Se pide EF.
 *                    sub 'triangulo': triángulo ABC, M en AB y N en AC con MN ∥ BC; AM = a, MB = b,
 *                    BC = L. Se pide MN.
 *                    sub 'cometa': triángulo ABC, P en AB con AP = a, PB = b; la paralela a BC por P
 *                    corta AC en Q; la paralela a AB por Q corta BC en R; BC = L. Se pide RC.
 *   bisectriz        sub 'segmento': AB = c, AC = b, BC = a; la bisectriz interior de A corta BC en D.
 *                    Se pide BD.
 *                    sub 'perimetro': la bisectriz interior de A corta BC en D; BD = m, DC = n,
 *                    AB = c. Se pide el perímetro de ABC.
 *                    sub 'exterior': AB = c > AC = b, BC = a; la bisectriz exterior de A corta la
 *                    prolongación de BC (más allá de C) en E. Se pide CE.
 *   incentro         lados BC = a, AC = b, AB = c; I es el incentro.
 *                    sub 'razon': AD es la bisectriz de A (D en BC). Se pide AI/ID.
 *                    sub 'paralela': la paralela a BC por I corta AB en M y AC en N. pide = 'MN'
 *                    (longitud de MN) o 'perimetro' (perímetro del triángulo AMN).
 *                    sub 'rombo': la paralela a BC por I corta AB en M; la paralela a AB por I corta
 *                    BC en N. Se pide el perímetro de BMIN.
 *   bis-semejanza    sub 'cuadrado': cuadrado ABCD de lado L; E en BC con BE = p; AE corta la diagonal
 *                    BD en F. Se pide AF.
 *                    sub 'paralela-vertice': AB = c, AC = b; la bisectriz de A corta BC en D; la
 *                    paralela a AB por D corta AC en E. Se pide DE.
 *   cuerdas          sub 'producto': dos cuerdas AB y CD se cortan en P; PA = pa, PB = pb, PC = pc.
 *                    Se pide PD.
 *                    sub 'iguales': A está en la circunferencia, AB = AC = s (cuerdas iguales); una
 *                    cuerda AD corta la cuerda BC en E, con AE = e. Se pide ED.
 *                    sub 'diametro-altura': triángulo ABC inscrito, AB = c, AC = b, altura AH = h
 *                    (H en BC). Se pide el radio R de la circunferencia circunscrita.
 *   raices-areas     por un punto interior P se trazan paralelas a los tres lados; quedan tres
 *                    triángulos de áreas S1, S2, S3 (con vértice en P) y tres paralelogramos.
 *                    sub 'total': se dan S1, S2, S3; se pide el área S del triángulo.
 *                    sub 'tercera': se dan S, S1, S2; se pide S3.
 *   mastil           (geometría del espacio) en el suelo, estacas A, B, C con AB = c, AC = b,
 *                    BC = a; un mástil vertical de altura H se para en D, en BC, donde la bisectriz
 *                    de A corta a BC. Se pide la distancia de la punta del mástil a la estaca B.
 *
 * Errores: GE1 (sumar áreas en vez de raíces, parcial), GE8 (la bisectriz parte el lado por la
 * mitad, parcial), GE11 (Pitágoras restando, parcial), GE19 y GE22 (hipótesis del informe) y los
 * GP-* nuevos (hipótesis nuestras).
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
  const sq = Math.sqrt;
  const calc = {
    thalesTres: (a, b, c) => b * c / a,
    thalesTotal: (a, b, d) => ({ DE: d * a / (a + b), EF: d * b / (a + b) }),
    corolario: (a, b, L) => L * a / (a + b),
    cometa: (a, b, L) => ({ BR: L * a / (a + b), RC: L * b / (a + b) }),
    bisectriz: (a, b, c) => ({ BD: a * c / (b + c), DC: a * b / (b + c) }),
    perimetroBisectriz: (m, n, c) => ({ AC: c * n / m, perimetro: c + c * n / m + m + n }),
    bisectrizExterior: (a, b, c) => ({ CE: a * b / (c - b), BE: a * c / (c - b) }),
    incentroRazon: (a, b, c) => (b + c) / a,
    incentroParalela: (a, b, c) => ({ MN: a * (b + c) / (a + b + c), perimetro: b + c }),
    rombo: (a, b, c) => ({ lado: a * c / (a + b + c), perimetro: 4 * a * c / (a + b + c) }),
    cuadrado: (L, p) => { const AE = sq(L * L + p * p); return { AE, AF: AE * L / (L + p), FE: AE * p / (L + p) }; },
    paralelaVertice: (b, c) => b * c / (b + c),
    cuerdas: (pa, pb, pc) => pa * pb / pc,
    cuerdasIguales: (s, e) => ({ AD: s * s / e, ED: s * s / e - e }),
    circunradio: (b, c, h) => b * c / (2 * h),
    raicesAreas: (s1, s2, s3) => (sq(s1) + sq(s2) + sq(s3)) ** 2,
    terceraArea: (S, s1, s2) => (sq(S) - sq(s1) - sq(s2)) ** 2,
    mastil: (a, b, c, H) => { const BD = a * c / (b + c), DC = a * b / (b + c); return { BD, DC, TB: sq(BD * BD + H * H), TC: sq(DC * DC + H * H) }; },
  };

  // ---------- texto exacto: entero, fracción p/q (q ≤ 12) o a√b ----------
  function exacto(x) {
    if (!Number.isFinite(x) || x <= 0 || x > 1e5) return null;
    for (let q = 1; q <= 12; q++) {
      const p = x * q, r = Math.round(p);
      if (Math.abs(p - r) < 1e-9 * Math.max(1, r)) return q === 1 ? P.formatear(r) : `${r}/${q}`;
    }
    const t = P.radical(x);
    return /,/.test(t) ? null : t;
  }
  const n = x => exacto(x) || P.formatear(x, 2);
  // Fracción con denominador pequeño (para que la respuesta sea «de academia»).
  const simple = (x, qmax) => { for (let q = 1; q <= qmax; q++) if (Math.abs(x * q - Math.round(x * q)) < 1e-9) return true; return false; };
  const triangulo = (a, b, c) => a + b > c && a + c > b && b + c > a;
  const mcd = (a, b) => { while (b) [a, b] = [b, a % b]; return a; };

  const SUBS = {
    thales: ['tres', 'total', 'triangulo', 'cometa'], bisectriz: ['segmento', 'segmento', 'perimetro', 'exterior'],
    incentro: ['razon', 'paralela', 'rombo'], 'bis-semejanza': ['cuadrado', 'paralela-vertice'],
    cuerdas: ['producto', 'producto', 'iguales', 'diametro-altura'], 'raices-areas': ['total', 'total', 'tercera'],
  };
  const PIDES = { paralela: ['MN', 'perimetro'], cuadrado: ['AF', 'razon'] };

  function generar(semilla) {
    const rng = Azar.crear('geo-proporcionalidad|' + semilla);
    const tipo = rng.elegir(['thales', 'thales', 'bisectriz', 'bisectriz', 'incentro', 'bis-semejanza', 'cuerdas', 'cuerdas', 'raices-areas', 'mastil']);
    // El subtipo (y lo que se pide) se eligen una sola vez: así los reintentos no sesgan el reparto.
    const sub = SUBS[tipo] ? rng.elegir(SUBS[tipo]) : null;
    const plan = { sub, pide: PIDES[sub] ? rng.elegir(PIDES[sub]) : null };
    for (let intento = 0; intento < 5000; intento++) {
      const pr = construir(rng, semilla, tipo, plan);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  function construir(rng, semilla, tipo, plan) {
    const u = rng.elegir(['cm', 'm']);
    const o = { thales, bisectriz, incentro, 'bis-semejanza': bisSemejanza, cuerdas, 'raices-areas': raicesAreas, mastil }[tipo](rng, u, plan);
    if (!o) return null;
    const conU = o.unidad === undefined ? o.datos.u : o.unidad;
    const texto = x => { const t = exacto(x); return conU ? `${t} ${conU}` : t; };
    // Respuesta «de academia»: entera, a√b o fracción de denominador 8 como mucho (nada de 63/10).
    if (!exacto(o.correcta) || (!exacto(o.correcta).includes('√') && !simple(o.correcta, 8))) return null;
    // Misma forma: si la correcta no lleva raíz, tampoco sus distractores.
    const conRaiz = exacto(o.correcta).includes('√');
    const errores = o.errores.filter(e => exacto(e.valor) !== null && (conRaiz || !exacto(e.valor).includes('√')));
    const alternativas = P.armar({ correcta: o.correcta, errores, rng, texto });
    return {
      id: `geo-proporcionalidad#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion, respuesta: { valor: o.correcta, unidad: conU }, _datos: o.datos,
    };
  }

  // ---------- Thales ----------
  function thales(rng, u, plan) {
    const sub = plan.sub;
    const L = x => `${n(x)} ${u}`;
    if (sub === 'tres') {
      const a = rng.entero(2, 12), b = rng.entero(2, 15), c = rng.entero(2, 15);
      if (a === b || a === c || (b * c) % a !== 0) return null;
      const x = calc.thalesTres(a, b, c);
      const ctx = rng.moneda(); if (ctx) u = 'm';
      const variables = { a: { nombre: 'AB', color: 'o' }, b: { nombre: 'BC', color: 'i' }, c: { nombre: 'DE', color: 'h' }, x: { nombre: 'EF', color: 'd' } };
      const enunciado = ctx
        ? ['Tres calles rectas y paralelas, L₁, L₂ y L₃, son cruzadas por dos avenidas que no son paralelas. La primera avenida corta a L₁, L₂ y L₃ en A, B y C; la segunda, en D, E y F. Se mide ',
           v('a', `AB = ${L(a)}`), ', ', v('b', `BC = ${L(b)}`), ' y ', v('c', `DE = ${L(c)}`), '.']
        : ['Las rectas L₁, L₂ y L₃ son paralelas. Una secante las corta en A, B y C, y otra secante en D, E y F (A y D en L₁, B y E en L₂, C y F en L₃). Además, ',
           v('a', `AB = ${L(a)}`), ', ', v('b', `BC = ${L(b)}`), ' y ', v('c', `DE = ${L(c)}`), '.'];
      const pregunta = ['¿Cuánto mide ', v('x', 'EF'), '?'];
      const errores = [
        hi('GE22-razon-invertida', a * c / b, `Emparejaste mal los segmentos: escribiste EF/DE = AB/BC. Las paralelas cortan segmentos proporcionales en el mismo orden: AB/BC = DE/EF, así que EF = BC·DE/AB.`),
        h('GP-diferencia-constante', c + (b - a), `Sumaste la misma diferencia (BC − AB = ${b - a}) a DE. Thales no conserva diferencias sino razones: EF/DE = BC/AB.`),
        h('GP-copia-segmento', b, 'Copiaste BC como si las dos secantes cortaran segmentos iguales. Eso solo pasa si las secantes son paralelas; aquí se conserva la razón, no la longitud.'),
        hi('GE22-parte-todo', c * (a + b) / a, `Calculaste DF (todo el tramo de la segunda secante) en vez de EF. EF es solo la parte entre L₂ y L₃.`),
      ];
      const solucion = [
        ['Por el teorema de Thales, las paralelas cortan a las dos secantes en segmentos proporcionales: AB/BC = DE/EF.'],
        [v('a', `${a}`), '/', v('b', `${b}`), ' = ', v('c', `${c}`), '/EF.'],
        [v('x', 'EF'), ` = ${b}·${c}/${a} = `, v('x', L(x)), '.'],
      ];
      return { correcta: x, errores, variables, enunciado, pregunta, solucion, datos: { tipo: 'thales', sub, a, b, c, u } };
    }
    if (sub === 'total') {
      u = 'km';
      const a = rng.entero(2, 12), b = rng.entero(2, 12), k = rng.entero(1, 6);
      if (a === b) return null;
      const g = mcd(a, b), d = (a + b) / g * k * rng.entero(1, 3);
      const { EF } = calc.thalesTotal(a, b, d);
      const variables = { a: { nombre: 'AB', color: 'o' }, b: { nombre: 'BC', color: 'i' }, d: { nombre: 'DF', color: 'h' }, x: { nombre: 'EF', color: 'd' } };
      const enunciado = ['Tres caminos rectos y paralelos, L₁, L₂ y L₃, son cortados por dos carreteras. La primera carretera pasa por los pueblos A, B y C (uno en cada camino, en ese orden) y la segunda por los pueblos D, E y F (D en L₁, E en L₂ y F en L₃). Se sabe que ',
        v('a', `AB = ${L(a)}`), ', ', v('b', `BC = ${L(b)}`), ' y que de D a F hay ', v('d', L(d)), '.'];
      const pregunta = ['¿Qué distancia hay entre los pueblos ', v('x', 'E y F'), '?'];
      const errores = [
        hi('GE22-parte-equivocada', d * a / (a + b), 'Esa es la distancia DE: emparejaste EF con AB. EF corresponde a BC, porque los dos están entre L₂ y L₃.'),
        hi('GE22-parte-parte', d * b / a, `Usaste EF/DF = BC/AB (parte sobre parte de un lado y parte sobre todo del otro). Debe ser la misma comparación en las dos secantes: EF/DF = BC/AC.`),
        h('GP-mitad', d / 2, 'Partiste DF por la mitad, como si E fuera el punto medio. E divide a DF en la misma razón en que B divide a AC.'),
        h('GP-resta', d - b, `Restaste BC de DF. Los segmentos de dos secantes distintas no se restan: son proporcionales.`),
      ];
      const solucion = [
        ['Corolario de Thales: las paralelas dividen a las dos secantes en la misma razón. EF/DF = BC/AC.'],
        ['AC = ', v('a', `${a}`), ' + ', v('b', `${b}`), ` = ${a + b}.`],
        [v('x', 'EF'), ' = ', v('d', `${n(d)}`), `·${b}/${a + b} = `, v('x', L(EF)), '.'],
      ];
      return { correcta: EF, errores, variables, enunciado, pregunta, solucion, datos: { tipo: 'thales', sub, a, b, d, u } };
    }
    if (sub === 'triangulo') {
      const a = rng.entero(1, 9), b = rng.entero(1, 9);
      if (a === b) return null;
      const BC = (a + b) / mcd(a, b) * rng.entero(1, 4);
      const MN = calc.corolario(a, b, BC);
      const variables = { a: { nombre: 'AM', color: 'o' }, b: { nombre: 'MB', color: 'i' }, L: { nombre: 'BC', color: 'h' }, x: { nombre: 'MN', color: 'd' } };
      const ctx = rng.moneda(); if (ctx) u = 'cm';
      const enunciado = ctx
        ? ['Un letrero tiene forma de triángulo ABC con ', v('L', `BC = ${L(BC)}`), '. Se le pega una cinta recta MN paralela a BC, con M en AB y N en AC, tal que ', v('a', `AM = ${L(a)}`), ' y ', v('b', `MB = ${L(b)}`), '.']
        : ['En el triángulo ABC, ', v('L', `BC = ${L(BC)}`), '. Se ubican M en AB y N en AC con MN ∥ BC, ', v('a', `AM = ${L(a)}`), ' y ', v('b', `MB = ${L(b)}`), '.'];
      const pregunta = ['¿Cuánto mide ', v('x', 'MN'), '?'];
      const errores = [
        hi('GE22-parte-parte', BC * a / b, `Usaste MN/BC = AM/MB (parte sobre parte). Los triángulos AMN y ABC son semejantes: se compara AM con todo AB.`),
        hi('GE22-parte-equivocada', BC * b / (a + b), 'Usaste MB/AB en vez de AM/AB. MN está del lado de A: corresponde a AM.'),
        h('GP-base-media', BC / 2, 'Tomaste MN como base media (la mitad de BC). Eso solo pasa si M es el punto medio de AB.'),
        h('GP-resta', BC - b, 'Restaste MB de BC. Los lados de dos triángulos semejantes no se restan: se multiplican por la misma razón.'),
      ];
      const solucion = [
        ['Como MN ∥ BC, el triángulo AMN es semejante al ABC (corolario de Thales).'],
        ['Razón de semejanza: AM/AB = ', v('a', `${a}`), `/(${a} + `, v('b', `${b}`), `) = ${a}/${a + b}.`],
        [v('x', 'MN'), ' = ', v('L', `${BC}`), `·${a}/${a + b} = `, v('x', L(MN)), '.'],
      ];
      return { correcta: MN, errores, variables, enunciado, pregunta, solucion, datos: { tipo: 'thales', sub, a, b, L: BC, u } };
    }
    // cometa: dos pares de paralelas
    u = 'cm';
    const a = rng.entero(1, 9), b = rng.entero(1, 9);
    if (a === b) return null;
    const BC = (a + b) / mcd(a, b) * rng.entero(1, 4);
    const { RC } = calc.cometa(a, b, BC);
    const variables = { a: { nombre: 'AP', color: 'o' }, b: { nombre: 'PB', color: 'i' }, L: { nombre: 'BC', color: 'h' }, x: { nombre: 'RC', color: 'd' } };
    const enunciado = ['Una cometa se arma sobre un triángulo de varillas ABC con ', v('L', `BC = ${L(BC)}`), '. En AB se marca P con ', v('a', `AP = ${L(a)}`), ' y ', v('b', `PB = ${L(b)}`),
      '. Desde P se pone una varilla paralela a BC que llega a AC en Q, y desde Q otra varilla paralela a AB que llega a BC en R.'];
    const pregunta = ['¿Cuánto mide ', v('x', 'RC'), '?'];
    const errores = [
      hi('GE22-parte-equivocada', BC * a / (a + b), 'Esa es la medida de BR. Al pasar por Q, la razón se da vuelta: CR/RB = CQ/QA = PB/AP.'),
      hi('GE22-parte-parte', BC * b / a, 'Usaste RC/BC = PB/AP (parte sobre parte). Con la paralela QR ∥ AB, se compara CR con todo CB, igual que CQ con todo CA.'),
      h('GP-mitad', BC / 2, 'Supusiste que R es el punto medio de BC. R divide a BC en la misma razón en que Q divide a CA.'),
      h('GP-copia-segmento', b, 'Copiaste PB en RC. Los segmentos se trasladan por razones, no por longitudes: PB está en AB y RC en BC, que miden distinto.'),
    ];
    const solucion = [
      ['PQ ∥ BC: por Thales en el triángulo ABC, AQ/QC = AP/PB = ', v('a', `${a}`), '/', v('b', `${b}`), '.'],
      ['QR ∥ AB: por Thales otra vez, CR/RB = CQ/QA = ', `${b}/${a}`, '. Entonces RC es ', `${b}/${a + b}`, ' de BC.'],
      [v('x', 'RC'), ' = ', v('L', `${BC}`), `·${b}/${a + b} = `, v('x', L(RC)), '.'],
    ];
    return { correcta: RC, errores, variables, enunciado, pregunta, solucion, datos: { tipo: 'thales', sub, a, b, L: BC, u } };
  }

  // ---------- bisectriz ----------
  function bisectriz(rng, u, plan) {
    const sub = plan.sub;
    const L = x => `${n(x)} ${u}`;
    if (sub === 'segmento') {
      const b = rng.entero(3, 15), c = rng.entero(3, 15), a = rng.entero(3, 24);
      if (b === c || !triangulo(a, b, c) || (a * c) % (b + c) !== 0) return null;
      const { BD } = calc.bisectriz(a, b, c);
      const ctx = rng.moneda(); if (ctx) u = 'm';
      const variables = { c: { nombre: 'AB', color: 'o' }, b: { nombre: 'AC', color: 'i' }, a: { nombre: 'BC', color: 'h' }, x: { nombre: 'BD', color: 'd' } };
      const enunciado = ctx
        ? ['Un terreno tiene forma de triángulo ABC con ', v('c', `AB = ${L(c)}`), ', ', v('b', `AC = ${L(b)}`), ' y ', v('a', `BC = ${L(a)}`), '. Desde la esquina A se levanta un muro recto que parte el ángulo A en dos ángulos iguales y llega al lado BC en D.']
        : ['En el triángulo ABC, ', v('c', `AB = ${L(c)}`), ', ', v('b', `AC = ${L(b)}`), ' y ', v('a', `BC = ${L(a)}`), '. La bisectriz interior del ángulo A corta a BC en D.'];
      const pregunta = ['¿Cuánto mide ', v('x', 'BD'), '?'];
      const errores = [
        pa('GE8-bisectriz-mitad', a / 2, 'Supusiste que la bisectriz parte el lado opuesto por la mitad. Eso solo pasa si AB = AC; la bisectriz lo divide en la razón de los lados que la rodean.'),
        h('GP-bisectriz-invertida', a * b / (b + c), 'Pusiste la razón al revés: esa es la medida de DC. BD está junto a B, así que le corresponde el lado AB: BD/DC = AB/AC.'),
        h('GP-parte-sobre-parte', a * c / b, `Escribiste BD/BC = AB/AC: comparaste una parte con el todo de un lado y una parte con la otra parte del otro. Es BD/DC = AB/AC, con BD + DC = BC.`),
        h('GP-copia-lado', c, 'Copiaste AB en BD, como si el triángulo ABD fuera isósceles. La bisectriz no hace iguales esos dos segmentos.'),
      ];
      const solucion = [
        ['Teorema de la bisectriz interior: BD/DC = AB/AC = ', v('c', `${c}`), '/', v('b', `${b}`), '.'],
        ['BC se reparte en ', `${c} + ${b} = ${b + c}`, ' partes iguales; BD toma ', `${c}`, ' de ellas.'],
        [v('x', 'BD'), ' = ', v('a', `${a}`), `·${c}/${b + c} = `, v('x', L(BD)), '.'],
      ];
      return { correcta: BD, errores, variables, enunciado, pregunta, solucion, datos: { tipo: 'bisectriz', sub, a, b, c, u } };
    }
    if (sub === 'perimetro') {
      u = 'm';
      const m = rng.entero(2, 12), nn = rng.entero(2, 12), c = rng.entero(3, 20);
      if (m === nn || (c * nn) % m !== 0) return null;
      const { AC, perimetro } = calc.perimetroBisectriz(m, nn, c);
      if (!triangulo(m + nn, AC, c) || AC > 40) return null;
      const variables = { c: { nombre: 'AB', color: 'o' }, m: { nombre: 'BD', color: 'i' }, nn: { nombre: 'DC', color: 'h' }, x: { nombre: 'perímetro', color: 'd' } };
      const enunciado = ['Un terreno triangular ABC se divide en dos parcelas con un cerco recto AD que parte el ángulo A en dos ángulos iguales (D en BC). El lado ', v('c', `AB mide ${L(c)}`), ' y el cerco llega a BC de modo que ', v('m', `BD = ${L(m)}`), ' y ', v('nn', `DC = ${L(nn)}`), '.'];
      const pregunta = ['¿Cuál es el ', v('x', 'perímetro'), ' del terreno ABC?'];
      const errores = [
        h('GP-bisectriz-invertida', c + c * m / nn + m + nn, `Pusiste la razón al revés (AC/AB = BD/DC). AC está junto a DC: AB/AC = BD/DC.`),
        h('GP-isosceles-supuesto', 2 * c + m + nn, 'Tomaste AC = AB, como si el terreno fuera isósceles. Si lo fuera, D sería el punto medio de BC, y aquí BD ≠ DC.'),
        h('GP-olvida-lado', c + AC, 'Sumaste solo AB y AC: falta el lado BC = BD + DC.'),
        h('GP-parte-sobre-todo', c + c * nn / (m + nn) + m + nn, 'Escribiste AC/AB = DC/BC: comparaste una parte con el todo. El teorema de la bisectriz compara parte con parte: AB/AC = BD/DC.'),
      ];
      const solucion = [
        ['Teorema de la bisectriz interior: AB/AC = BD/DC.'],
        [v('c', `${c}`), '/AC = ', v('m', `${m}`), '/', v('nn', `${nn}`), ` → AC = ${c}·${nn}/${m} = ${n(AC)} ${u}.`],
        ['BC = ', v('m', `${m}`), ' + ', v('nn', `${nn}`), ` = ${m + nn} ${u}.`],
        [v('x', 'Perímetro'), ` = ${c} + ${n(AC)} + ${m + nn} = `, v('x', L(perimetro)), '.'],
      ];
      return { correcta: perimetro, errores, variables, enunciado, pregunta, solucion, datos: { tipo: 'bisectriz', sub, m, n: nn, c, u } };
    }
    // exterior
    const b = rng.entero(2, 12), c = rng.entero(3, 16), a = rng.entero(3, 20);
    if (c <= b || !triangulo(a, b, c) || (a * b) % (c - b) !== 0) return null;
    const { CE, BE } = calc.bisectrizExterior(a, b, c);
    if (CE > 60) return null;
    const variables = { c: { nombre: 'AB', color: 'o' }, b: { nombre: 'AC', color: 'i' }, a: { nombre: 'BC', color: 'h' }, x: { nombre: 'CE', color: 'd' } };
    const enunciado = ['En el triángulo ABC, ', v('c', `AB = ${L(c)}`), ', ', v('b', `AC = ${L(b)}`), ' y ', v('a', `BC = ${L(a)}`), '. La bisectriz del ángulo exterior en A corta a la prolongación de BC (más allá de C) en E.'];
    const pregunta = ['¿Cuánto mide ', v('x', 'CE'), '?'];
    const errores = [
      h('GP-exterior-como-interior', a * b / (b + c), 'Usaste la cuenta de la bisectriz interior (repartir BC en la razón de los lados). La exterior corta fuera del lado: BE/CE = AB/AC con BE = BC + CE.'),
      h('GP-be-por-ce', BE, 'Esa es la medida de BE, desde B hasta E. CE es la parte que queda fuera del lado: BE − BC.'),
      h('GP-exterior-suma', a * b / (b + c) + a, 'Mezclaste las dos bisectrices: repartiste BC como con la interior y le sumaste BC. Con la exterior, la diferencia BE − CE es BC, y BE/CE = AB/AC.'),
      pa('GE8-bisectriz-mitad', a / 2, 'Supusiste que la bisectriz reparte por mitades. Ni la interior ni la exterior lo hacen si AB ≠ AC.'),
    ];
    const solucion = [
      ['Teorema de la bisectriz exterior: BE/CE = AB/AC = ', v('c', `${c}`), '/', v('b', `${b}`), '.'],
      ['Como E está más allá de C, BE = ', v('a', `${a}`), ' + CE.'],
      [`(${a} + CE)/CE = ${c}/${b} → ${b}·${a} = (${c} − ${b})·CE.`],
      [v('x', 'CE'), ` = ${a * b}/${c - b} = `, v('x', L(CE)), '.'],
    ];
    return { correcta: CE, errores, variables, enunciado, pregunta, solucion, datos: { tipo: 'bisectriz', sub, a, b, c, u } };
  }

  // ---------- incentro ----------
  function incentro(rng, u, plan) {
    const sub = plan.sub;
    const L = x => `${n(x)} ${u}`;
    const a = rng.entero(3, 18), b = rng.entero(3, 18), c = rng.entero(3, 18);
    if (!triangulo(a, b, c)) return null;
    const variables = { a: { nombre: 'BC', color: 'o' }, b: { nombre: 'AC', color: 'i' }, c: { nombre: 'AB', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
    const lados = [v('c', `AB = ${L(c)}`), ', ', v('b', `AC = ${L(b)}`), ' y ', v('a', `BC = ${L(a)}`)];
    if (sub === 'razon') {
      const r = calc.incentroRazon(a, b, c);
      if (exacto(r) === null) return null;
      variables.x.nombre = 'AI/ID';
      const enunciado = ['En el triángulo ABC, ', ...lados, '. La bisectriz del ángulo A corta a BC en D, e I es el incentro del triángulo.'];
      const pregunta = ['¿Cuánto vale la razón ', v('x', 'AI/ID'), '?'];
      const errores = [
        h('GP-incentro-invertido', a / (b + c), 'Diste la razón al revés: ID/AI. El incentro queda más cerca de D que de A cuando AB + AC > BC.'),
        h('GP-incentro-como-baricentro', 2, 'Usaste la razón 2 del baricentro. El incentro no divide a la bisectriz siempre igual: depende de los lados, AI/ID = (AB + AC)/BC.'),
        h('GP-razon-de-lados', c / b, 'Esa es la razón BD/DC del teorema de la bisectriz. Para el incentro hay que aplicarlo otra vez, en el triángulo ABD, con la bisectriz de B.'),
        h('GP-ai-sobre-ad', (b + c) / (a + b + c), 'Esa es AI/AD, la parte sobre el todo. Se pedía AI/ID, parte sobre parte.'),
      ];
      const BD = a * c / (b + c);
      const solucion = [
        ['Teorema de la bisectriz en ABC: BD = ', v('a', `${a}`), '·', v('c', `${c}`), `/(${c} + ${b}) = ${n(BD)} ${u}.`],
        ['En el triángulo ABD, BI es bisectriz de B (I es el incentro): AI/ID = AB/BD = ', v('c', `${c}`), Number.isInteger(BD) ? `/${BD}.` : ` ÷ ${n(BD)}.`],
        ['Simplificando: ', v('x', 'AI/ID'), ' = (AB + AC)/BC = ', `(${c} + ${b})/${a} = `, v('x', exacto(r)), '.'],
      ];
      return { correcta: r, unidad: '', errores, variables, enunciado, pregunta, solucion, datos: { tipo: 'incentro', sub, a, b, c, u } };
    }
    if (sub === 'paralela') {
      const pide = plan.pide;
      const { MN, perimetro } = calc.incentroParalela(a, b, c);
      const p = a + b + c;
      const enunciado = ['En el triángulo ABC, ', ...lados, '. Por el incentro I se traza una recta paralela a BC que corta a AB en M y a AC en N.'];
      if (pide === 'MN') {
        variables.x.nombre = 'MN';
        const pregunta = ['¿Cuánto mide ', v('x', 'MN'), '?'];
        const errores = [
          h('GP-base-media', a / 2, 'Tomaste MN como base media. Por I pasa la paralela, pero I no está a media altura: su distancia a BC es el inradio.'),
          h('GP-incentro-como-baricentro', 2 * a / 3, 'Usaste la razón 2/3 del baricentro. Para el incentro, AI/AD = (AB + AC)/(AB + AC + BC).'),
          h('GP-incentro-invertido', a * a / p, 'Usaste ID/AD en vez de AI/AD. MN está del lado de A, así que corresponde a AI.'),
          h('GP-perimetro-por-lado', b + c, 'Ese es el perímetro del triángulo AMN (AB + AC), no la medida de MN.'),
        ];
        const solucion = [
          ['Sea D el pie de la bisectriz de A en BC. El incentro cumple AI/ID = (AB + AC)/BC, así que AI/AD = ', `(${c} + ${b})/(${c} + ${b} + ${a}) = ${b + c}/${p}.`],
          ['Como MN ∥ BC, el triángulo AMN es semejante al ABC con razón AI/AD.'],
          [v('x', 'MN'), ' = ', v('a', `${a}`), `·${b + c}/${p} = `, v('x', L(MN)), '.'],
        ];
        return { correcta: MN, errores, variables, enunciado, pregunta, solucion, datos: { tipo: 'incentro', sub, pide, a, b, c, u } };
      }
      variables.x.nombre = 'perímetro de AMN';
      const pregunta = ['¿Cuál es el ', v('x', 'perímetro del triángulo AMN'), '?'];
      const errores = [
        h('GP-base-media', p / 2, 'Tomaste AMN como el triángulo de la base media (la mitad del perímetro). La paralela pasa por I, no por los puntos medios.'),
        h('GP-incentro-como-baricentro', 2 * p / 3, 'Usaste la razón 2/3 del baricentro. Con el incentro hay un atajo mejor: MI = MB y NI = NC.'),
        h('GP-todo-el-perimetro', p, 'Ese es el perímetro de ABC. Al recortar por MN, BC se cambia por MN, que es más corta.'),
        h('GP-perimetro-menos-base', b + c - a, `Restaste BC. Lo que pasa es que MN = MI + IN se reparte en MB + NC: el perímetro de AMN es AB + AC.`),
      ];
      const solucion = [
        ['BI es bisectriz de B y MI ∥ BC: el ángulo MIB es igual al IBC (alternos), que es igual al MBI. El triángulo MBI es isósceles: MI = MB.'],
        ['Del mismo modo, con la bisectriz de C, NI = NC.'],
        ['Perímetro de AMN = AM + (MI + IN) + NA = (AM + MB) + (AN + NC) = AB + AC.'],
        [v('x', 'Perímetro'), ' = ', v('c', `${c}`), ' + ', v('b', `${b}`), ' = ', v('x', L(perimetro)), '.'],
      ];
      return { correcta: perimetro, errores, variables, enunciado, pregunta, solucion, datos: { tipo: 'incentro', sub, pide, a, b, c, u } };
    }
    // rombo
    const { lado, perimetro } = calc.rombo(a, b, c);
    const p = a + b + c;
    if (exacto(perimetro) === null || !Number.isInteger(perimetro)) return null;
    variables.x.nombre = 'perímetro de BMIN';
    const enunciado = ['En el triángulo ABC, ', ...lados, '. I es el incentro. La paralela a BC trazada por I corta a AB en M, y la paralela a AB trazada por I corta a BC en N.'];
    const pregunta = ['¿Cuál es el ', v('x', 'perímetro del cuadrilátero BMIN'), '?'];
    const errores = [
      h('GP-incentro-como-baricentro', 4 * c / 3, 'Pusiste BM = AB/3, como si I fuera el baricentro. El incentro divide a la bisectriz según los lados: AI/AD = (AB + AC)/(AB + AC + BC).'),
      h('GP-base-media', 2 * c, 'Pusiste BM = AB/2, como si M fuera el punto medio. Por I pasa la paralela, y I no está a media altura.'),
      h('GP-incentro-invertido', 4 * c * (b + c) / p, 'Usaste AM en vez de BM. El lado del rombo que está en AB es BM, el tramo de B a M.'),
      h('GP-paralelogramo-sin-rombo', 2 * (lado + a / 2), 'Tomaste BN como la mitad de BC. BMIN no solo es paralelogramo: es rombo, porque MI = MB (triángulo isósceles MBI). Sus cuatro lados miden BM.'),
    ];
    const solucion = [
      ['BI es bisectriz de B y MI ∥ BC: el ángulo MIB es igual al IBC, que es igual al MBI. Entonces MI = MB, y BMIN (que es paralelogramo) es un rombo.'],
      ['Sea D el pie de la bisectriz de A. El incentro cumple AI/AD = (AB + AC)/(AB + AC + BC) = ', `${b + c}/${p}`, '; por Thales (MI ∥ BC), AM/AB también vale eso.'],
      ['BM = ', v('c', `${c}`), ` − ${c}·${b + c}/${p} = ${c}·`, v('a', `${a}`), `/${p} = ${n(lado)} ${u}.`],
      [v('x', 'Perímetro'), ` = 4·${n(lado)} = `, v('x', L(perimetro)), '.'],
    ];
    return { correcta: perimetro, errores, variables, enunciado, pregunta, solucion, datos: { tipo: 'incentro', sub, a, b, c, u } };
  }

  // ---------- bisectriz y semejanza ----------
  const TRIPLES = [[4, 3]]; // AF = 20k/7: con otros triples la fracción sale fea
  function bisSemejanza(rng, u, plan) {
    const sub = plan.sub;
    const L = x => `${n(x)} ${u}`;
    if (sub === 'cuadrado') {
      const pide = plan.pide;
      const [Lb, p] = pide === 'AF' ? (k => rng.elegir(TRIPLES).map(x => x * k))(rng.entero(1, 5)) : [rng.entero(3, 20), rng.entero(1, 19)];
      if (p >= Lb || mcd(Lb, p) !== 1 && pide === 'razon') return null;
      const { AE, AF } = calc.cuadrado(Lb, p);
      if (pide === 'AF' && !simple(AF, 12)) return null;
      const variables = { L: { nombre: 'lado del cuadrado', color: 'o' }, p: { nombre: 'BE', color: 'i' }, x: { nombre: pide === 'AF' ? 'AF' : 'AF/FE', color: 'd' } };
      const ctx = rng.moneda(); if (ctx) u = 'cm';
      const enunciado = ctx
        ? ['Una loseta cuadrada ABCD tiene ', v('L', `${L(Lb)} de lado`), '. En el borde BC se marca E con ', v('p', `BE = ${L(p)}`), '. Se corta en línea recta de A a E, y ese corte cruza la diagonal BD en F.']
        : ['ABCD es un cuadrado de ', v('L', `lado ${L(Lb)}`), '. E es un punto de BC con ', v('p', `BE = ${L(p)}`), '. El segmento AE corta a la diagonal BD en F.'];
      const paso2 = ['La diagonal BD forma 45° con BA y con BC: es la bisectriz del ángulo recto ABE. (También: los triángulos AFD y EFB son semejantes, porque AD ∥ BE.)'];
      const paso3 = ['Teorema de la bisectriz en ABE: AF/FE = AB/BE = ', v('L', `${Lb}`), '/', v('p', `${p}`), '.'];
      if (pide === 'razon') {
        const r = Lb / p;
        const pregunta = ['¿Cuánto vale la razón ', v('x', 'AF/FE'), '?'];
        const errores = [
          pa('GE8-bisectriz-mitad', 1, 'Supusiste que F es el punto medio de AE. BF es bisectriz del ángulo ABE, y la bisectriz reparte AE en la razón AB/BE, no por mitades.'),
          h('GP-bisectriz-invertida', p / Lb, 'Diste la razón al revés (FE/AF). AF está del lado de A, que corresponde al lado AB del cuadrado.'),
          h('GP-parte-sobre-todo', Lb / (Lb + p), 'Esa es AF/AE, la parte sobre el todo. Se pedía AF/FE, parte sobre parte.'),
          h('GP-todo-sobre-parte', (Lb + p) / p, 'Esa es AE/FE, el todo sobre una parte. Se pedía AF/FE, parte sobre parte.'),
        ];
        const solucion = [paso2, paso3, ['Como AB es el lado del cuadrado: ', v('x', 'AF/FE'), ' = ', v('x', exacto(r)), '.']];
        return { correcta: r, unidad: '', errores, variables, enunciado, pregunta, solucion, datos: { tipo: 'bis-semejanza', sub, pide, L: Lb, p, u } };
      }
      const pregunta = ['¿Cuánto mide ', v('x', 'AF'), '?'];
      const errores = [
        pa('GE8-bisectriz-mitad', AE / 2, 'Supusiste que F es el punto medio de AE. BF es bisectriz del ángulo ABE, y la bisectriz reparte AE en la razón AB/BE, no por mitades.'),
        h('GP-bisectriz-invertida', AE * p / (Lb + p), 'Esa es la medida de FE. AF está del lado de A, que corresponde al lado AB del cuadrado: AF/FE = AB/BE.'),
        h('GP-resta', AE - p, 'Restaste BE de AE. Los segmentos que corta la diagonal son proporcionales, no se obtienen restando.'),
        h('GP-copia-lado', Lb, 'Tomaste AF igual al lado del cuadrado, como si el triángulo ABF fuera isósceles. No lo es: el ángulo BAF no mide 45°.'),
      ];
      const solucion = [
        ['AE por Pitágoras en el triángulo ABE: AE = √(', v('L', `${Lb}`), '² + ', v('p', `${p}`), `²) = ${n(AE)} ${u}.`],
        paso2, paso3,
        [v('x', 'AF'), ` = ${n(AE)}·${Lb}/${Lb + p} = `, v('x', L(AF)), '.'],
      ];
      return { correcta: AF, errores, variables, enunciado, pregunta, solucion, datos: { tipo: 'bis-semejanza', sub, pide, L: Lb, p, u } };
    }
    const b = rng.entero(3, 20), c = rng.entero(3, 20);
    if (b === c) return null;
    const DE = calc.paralelaVertice(b, c);
    if (!simple(DE, 6)) return null;
    const variables = { c: { nombre: 'AB', color: 'o' }, b: { nombre: 'AC', color: 'i' }, x: { nombre: 'DE', color: 'd' } };
    const enunciado = ['En el triángulo ABC, ', v('c', `AB = ${L(c)}`), ' y ', v('b', `AC = ${L(b)}`), '. La bisectriz del ángulo A corta a BC en D. Por D se traza una paralela a AB que corta a AC en E.'];
    const pregunta = ['¿Cuánto mide ', v('x', 'DE'), '?'];
    const errores = [
      pa('GE8-bisectriz-mitad', c / 2, 'Supusiste que D es el punto medio de BC, y entonces DE sería base media (AB/2). La bisectriz reparte BC en la razón AB/AC.'),
      h('GP-bisectriz-invertida', c * c / (b + c), 'Usaste CD/CB = AB/(AB + AC). CD le corresponde al lado AC: CD/CB = AC/(AB + AC).'),
      h('GP-promedio', (b + c) / 2, 'Promediaste AB y AC. La paralela por D da un triángulo semejante: DE se obtiene con una razón, no con un promedio.'),
      h('GP-resta', Math.abs(b - c), 'Restaste los lados. Con la paralela, DE es AB multiplicado por la razón CD/CB.'),
    ];
    const solucion = [
      ['Teorema de la bisectriz: BD/DC = AB/AC = ', v('c', `${c}`), '/', v('b', `${b}`), `, así que CD/CB = ${b}/${b + c}.`],
      ['DE ∥ AB: el triángulo CDE es semejante al CBA. DE/AB = CD/CB.'],
      [v('x', 'DE'), ' = ', v('c', `${c}`), `·${b}/${b + c} = `, v('x', L(DE)), '. (Además AE = DE: el ángulo ADE es igual al DAB, que es igual al DAE.)'],
    ];
    return { correcta: DE, errores, variables, enunciado, pregunta, solucion, datos: { tipo: 'bis-semejanza', sub, b, c, u } };
  }

  // ---------- cuerdas y ángulos inscritos ----------
  const ALTURAS = (() => {
    const t = {};
    for (const hh of [8, 12, 15, 20, 24]) {
      t[hh] = [];
      for (let m = 1; m < 60; m++) { const H = Math.sqrt(m * m + hh * hh); if (Number.isInteger(H)) t[hh].push(H); }
    }
    return t;
  })();
  function cuerdas(rng, u, plan) {
    const sub = plan.sub;
    const L = x => `${n(x)} ${u}`;
    if (sub === 'producto') {
      const PA = rng.entero(2, 12), PB = rng.entero(2, 15), PC = rng.entero(2, 12);
      if (PC === PA || PC === PB || (PA * PB) % PC !== 0) return null;
      const PD = calc.cuerdas(PA, PB, PC);
      const variables = { A: { nombre: 'PA', color: 'o' }, B: { nombre: 'PB', color: 'i' }, C: { nombre: 'PC', color: 'h' }, x: { nombre: 'PD', color: 'd' } };
      const ctx = rng.moneda(); if (ctx) u = 'm';
      const enunciado = ctx
        ? ['En una plaza circular hay dos senderos rectos AB y CD que van de borde a borde y se cruzan en la pileta P. Se mide ', v('A', `PA = ${L(PA)}`), ', ', v('B', `PB = ${L(PB)}`), ' y ', v('C', `PC = ${L(PC)}`), '.']
        : ['En una circunferencia, las cuerdas AB y CD se cortan en P. Además, ', v('A', `PA = ${L(PA)}`), ', ', v('B', `PB = ${L(PB)}`), ' y ', v('C', `PC = ${L(PC)}`), '.'];
      const pregunta = ['¿Cuánto mide ', v('x', 'PD'), '?'];
      const errores = [
        hi('GE22-pareja', PA * PC / PB, 'Emparejaste mal los lados de los triángulos semejantes: escribiste PA·PC = PB·PD. Los que se multiplican son los dos tramos de la misma cuerda: PA·PB = PC·PD.'),
        hi('GE22-pareja-otra', PB * PC / PA, 'Escribiste PB·PC = PA·PD. Cada producto debe usar los dos tramos de una misma cuerda: PA·PB = PC·PD.'),
        h('GP-suma-constante', PA + PB - PC, 'Supusiste que las dos cuerdas miden lo mismo (PA + PB = PC + PD). Las cuerdas pueden medir distinto; lo que se conserva es el producto de sus tramos.'),
        h('GP-copia-segmento', PA, 'Copiaste PA en PD, como si P estuviera en el centro de las dos cuerdas. No se sabe eso: se usa la semejanza de los triángulos APC y DPB.'),
      ];
      const solucion = [
        ['Los ángulos CAB y CDB abarcan el mismo arco CB: son iguales. También son iguales los opuestos por el vértice en P.'],
        ['Los triángulos APC y DPB son semejantes: PA/PD = PC/PB, es decir, PA·PB = PC·PD.'],
        [v('A', `${PA}`), '·', v('B', `${PB}`), ' = ', v('C', `${PC}`), `·PD → `, v('x', 'PD'), ` = ${PA * PB}/${PC} = `, v('x', L(PD)), '.'],
      ];
      return { correcta: PD, errores, variables, enunciado, pregunta, solucion, datos: { tipo: 'cuerdas', sub, PA, PB, PC, u } };
    }
    if (sub === 'iguales') {
      u = 'm';
      const s = rng.entero(3, 16), e = rng.entero(2, 15);
      if (e >= s || (s * s) % e !== 0) return null;
      const { AD, ED } = calc.cuerdasIguales(s, e);
      if (ED > 80) return null;
      const variables = { s: { nombre: 'AB = AC', color: 'o' }, e: { nombre: 'AE', color: 'i' }, x: { nombre: 'ED', color: 'd' } };
      const enunciado = ['Un jardín tiene borde circular. Desde un punto A del borde salen dos caminos rectos iguales, ', v('s', `AB = AC = ${L(s)}`), ', hasta los puntos B y C del borde, y un camino recto une B con C. Otro camino recto sale de A, cruza BC en E y llega al borde en D. Se sabe que ', v('e', `AE = ${L(e)}`), '.'];
      const pregunta = ['¿Cuánto mide el tramo ', v('x', 'ED'), '?'];
      const errores = [
        h('GP-pide-ED', AD, 'Esa es la medida de todo AD. Se pide solo el tramo ED, desde el cruce E hasta el borde.'),
        h('GP-resta', s - e, 'Restaste AE de AB. AD no mide lo mismo que AB: sale de la semejanza AB/AE = AD/AB.'),
        h('GP-cuerda-igual', s, 'Supusiste que ED mide como las cuerdas iguales. Lo que se cumple es AB² = AE·AD.'),
        hi('GE22-pareja', e * e / s, 'Emparejaste mal los lados (AE/AB = ED/AE). Los triángulos semejantes son ABE y ADB, con el lado AB en los dos: AB/AE = AD/AB.'),
      ];
      const solucion = [
        ['Como AB = AC, los arcos AB y AC son iguales. El ángulo ABC (que abarca el arco AC) es igual al ángulo ADB (que abarca el arco AB).'],
        ['Los triángulos ABE y ADB comparten el ángulo A: son semejantes. AB/AE = AD/AB, es decir, AB² = AE·AD.'],
        [v('s', `${s}`), '² = ', v('e', `${e}`), `·AD → AD = ${s * s}/${e} = ${n(AD)} ${u}.`],
        [v('x', 'ED'), ` = AD − AE = ${n(AD)} − ${e} = `, v('x', L(ED)), '.'],
      ];
      return { correcta: ED, errores, variables, enunciado, pregunta, solucion, datos: { tipo: 'cuerdas', sub, s, e, u } };
    }
    // diametro-altura
    const hh = rng.elegir([8, 12, 12, 15, 20, 24, 24]);
    const op = ALTURAS[hh];
    if (op.length < 2) return null;
    const c = rng.elegir(op), b = rng.elegir(op);
    if (b === c) return null;
    const R = calc.circunradio(b, c, hh);
    const variables = { c: { nombre: 'AB', color: 'o' }, b: { nombre: 'AC', color: 'i' }, h: { nombre: 'altura AH', color: 'h' }, x: { nombre: 'radio', color: 'd' } };
    const enunciado = ['El triángulo ABC está inscrito en una circunferencia. Se sabe que ', v('c', `AB = ${L(c)}`), ', ', v('b', `AC = ${L(b)}`), ' y que la altura ', v('h', `AH mide ${L(hh)}`), ' (H en BC).'];
    const pregunta = ['¿Cuánto mide el ', v('x', 'radio'), ' de la circunferencia?'];
    const errores = [
      hi('GE19-diametro-por-radio', b * c / hh, 'Ese valor es el diámetro AE. La semejanza da AB·AC = AH·(2R); falta dividir entre 2.'),
      hi('GE19-radio-por-mitad', b * c / (4 * hh), 'Dividiste entre 2 dos veces. La semejanza da AB·AC = AH·AE, y AE ya es el diámetro, 2R.'),
      h('GP-promedio', (b + c) / 2, 'Promediaste AB y AC. El radio sale de una semejanza con el diámetro, no de un promedio de cuerdas.'),
      h('GP-supone-recto', Math.sqrt(b * b + c * c) / 2, 'Supusiste que el ángulo A es recto (BC como diámetro). Nada lo dice; se traza el diámetro desde A.'),
    ];
    const solucion = [
      ['Se traza el diámetro AE. El ángulo ACE es recto (abarca media circunferencia) y el ángulo AEC es igual al ABC (abarcan el mismo arco AC).'],
      ['Los triángulos rectángulos AHB y ACE son semejantes: AB/AE = AH/AC, es decir, AB·AC = AH·2R.'],
      [v('c', `${c}`), '·', v('b', `${b}`), ' = ', v('h', `${hh}`), `·2R → `, v('x', 'R'), ` = ${b * c}/${2 * hh} = `, v('x', L(R)), '.'],
    ];
    return { correcta: R, errores, variables, enunciado, pregunta, solucion, datos: { tipo: 'cuerdas', sub, b, c, h: hh, u } };
  }

  // ---------- raíces de áreas ----------
  function raicesAreas(rng, u, plan) {
    const sub = plan.sub;
    const k = rng.elegir([1, 1, 2, 3]);
    const m1 = rng.entero(1, 5), m2 = rng.entero(1, 6), m3 = rng.entero(1, 6);
    if (m1 === m2 && m2 === m3) return null;
    const S1 = k * m1 * m1, S2 = k * m2 * m2, S3 = k * m3 * m3, S = calc.raicesAreas(S1, S2, S3);
    const A = x => `${n(x)} ${u}²`;
    const variables = { s1: { nombre: 'S₁', color: 'o' }, s2: { nombre: 'S₂', color: 'i' }, s3: { nombre: 'S₃', color: 'h' }, S: { nombre: 'área total', color: 'd' } };
    const ctx = rng.moneda(); if (ctx) u = 'm';
    const intro = ctx
      ? 'Un terreno triangular ABC tiene un pozo P en su interior. Por P pasan tres caminos rectos, cada uno paralelo a un lado del terreno. Los caminos dejan tres parcelas triangulares con una esquina en P'
      : 'Por un punto P interior al triángulo ABC se trazan paralelas a los tres lados. Se forman tres triángulos con un vértice en P';
    const raices = sq(S1) + sq(S2) + sq(S3);
    if (sub === 'total') {
      const enunciado = [intro, ' (y tres paralelogramos). Las áreas de esos triángulos son ', v('s1', A(S1)), ', ', v('s2', A(S2)), ' y ', v('s3', A(S3)), '.'];
      const pregunta = ['¿Cuál es el ', v('S', 'área'), ctx ? ' de todo el terreno?' : ' del triángulo ABC?'];
      const errores = [
        pa('GE1-suma-areas', S1 + S2 + S3, 'Sumaste las tres áreas y olvidaste los tres paralelogramos. En triángulos semejantes, lo que se suma son los lados (las raíces de las áreas), no las áreas.'),
        h('GP-raices-sin-cuadrado', raices, 'Sumaste las raíces de las áreas, pero no elevaste al cuadrado: esa suma es proporcional a un lado, no al área.'),
        h('GP-paralelogramo-sin-2', S1 + S2 + S3 + sq(S1 * S2) + sq(S1 * S3) + sq(S2 * S3), 'Al desarrollar el cuadrado olvidaste el 2 de los dobles productos: cada paralelogramo mide 2√(SᵢSⱼ).'),
        h('GP-doble-de-la-suma', 2 * (S1 + S2 + S3), 'Supusiste que los paralelogramos suman lo mismo que los triángulos. Cada paralelogramo mide 2√(SᵢSⱼ), que depende de los dos triángulos vecinos.'),
      ];
      const solucion = [
        ['Cada triángulo pequeño es semejante al ABC. Si el lado de ABC mide ℓ, sus lados correspondientes miden k₁ℓ, k₂ℓ y k₃ℓ, y los tres tramos juntos completan el lado: k₁ + k₂ + k₃ = 1.'],
        ['Las áreas van con el cuadrado de la razón: √S₁ + √S₂ + √S₃ = √S.'],
        ['√S = √', v('s1', n(S1)), ' + √', v('s2', n(S2)), ' + √', v('s3', n(S3)), ` = ${exacto(sq(S1))} + ${exacto(sq(S2))} + ${exacto(sq(S3))} = ${exacto(raices)}.`],
        [v('S', 'S'), ` = (${exacto(raices)})² = `, v('S', A(S)), '.'],
      ];
      return { correcta: S, unidad: `${u}²`, errores, variables, enunciado, pregunta, solucion, datos: { tipo: 'raices-areas', sub, S1, S2, S3, u } };
    }
    variables.S.nombre = 'área del triángulo ABC'; variables.s3.nombre = 'S₃ (la que se pide)';
    const enunciado = [intro, ' (y tres paralelogramos). El triángulo ABC tiene ', v('S', `área ${A(S)}`), ', y dos de esos triángulos miden ', v('s1', A(S1)), ' y ', v('s2', A(S2)), '.'];
    const pregunta = ['¿Cuánto mide el área del ', v('s3', 'tercer triángulo'), '?'];
    const errores = [
      pa('GE1-resta-areas', S - S1 - S2, 'Restaste las áreas, como si el triángulo ABC fuera solo la suma de los tres pequeños. Faltan los tres paralelogramos; lo que se resta son las raíces: √S₃ = √S − √S₁ − √S₂.'),
      h('GP-raices-sin-cuadrado', sq(S) - sq(S1) - sq(S2), 'Hallaste √S₃, pero no elevaste al cuadrado.'),
      h('GP-promedio', (S1 + S2) / 2, 'Promediaste las dos áreas conocidas. S₃ sale de las raíces: √S₁ + √S₂ + √S₃ = √S.'),
      h('GP-doble-de-la-suma', S / 2 - S1 - S2, 'Supusiste que los paralelogramos suman lo mismo que los triángulos. Cada paralelogramo mide 2√(SᵢSⱼ).'),
    ];
    const solucion = [
      ['Los tres triángulos son semejantes al ABC y sus lados correspondientes juntos completan el lado de ABC: √S₁ + √S₂ + √S₃ = √S.'],
      ['√S₃ = √', v('S', n(S)), ' − √', v('s1', n(S1)), ' − √', v('s2', n(S2)), ` = ${exacto(sq(S))} − ${exacto(sq(S1))} − ${exacto(sq(S2))} = ${exacto(sq(S3))}.`],
      [v('s3', 'S₃'), ` = (${exacto(sq(S3))})² = `, v('s3', A(S3)), '.'],
    ];
    return { correcta: S3, unidad: `${u}²`, errores, variables, enunciado, pregunta, solucion, datos: { tipo: 'raices-areas', sub, S, S1, S2, u } };
  }

  // ---------- mástil (espacio) ----------
  function mastil(rng, u, plan) {
    u = 'm';
    const mm = rng.entero(1, 5), nn = rng.entero(1, 5);
    if (mm === nn || mcd(mm, nn) !== 1) return null;
    const k = rng.entero(1, 4), s = rng.entero(k + 1, 3 * k + 2);
    const c = mm * s, b = nn * s, a = k * (mm + nn);
    if (!triangulo(a, b, c) || c > 30 || b > 30) return null;
    const H = rng.entero(2, 15);
    const { BD, TB } = calc.mastil(a, b, c, H);
    const variables = { c: { nombre: 'AB', color: 'o' }, b: { nombre: 'AC', color: 'i' }, H: { nombre: 'altura del mástil', color: 'h' }, x: { nombre: 'distancia a B', color: 'd' } };
    const L = x => `${n(x)} ${u}`;
    const enunciado = ['En un patio plano hay tres estacas A, B y C, con ', v('c', `AB = ${L(c)}`), ', ', v('b', `AC = ${L(b)}`), ` y BC = ${L(a)}. Sobre el segmento BC, en el punto D donde llega la bisectriz del ángulo BAC, se levanta un mástil vertical de `, v('H', L(H)), ' de altura.'];
    const pregunta = ['¿Qué ', v('x', 'distancia'), ' hay desde la punta del mástil hasta la estaca B?'];
    const dist = d => sq(d * d + H * H);
    const errores = [
      pa('GE8-bisectriz-mitad', dist(a / 2), 'Pusiste el mástil en el punto medio de BC. La bisectriz parte BC en la razón AB/AC, no por la mitad.'),
      h('GP-bisectriz-invertida', dist(a * b / (b + c)), 'Usaste DC en vez de BD: BD está junto a B, así que le corresponde AB en la razón BD/DC = AB/AC.'),
      h('GP-suma-sin-pitagoras', BD + H, 'Sumaste BD y la altura. El mástil es perpendicular al suelo: la punta, D y B forman un triángulo rectángulo, y la distancia es su hipotenusa.'),
      pa('GE11-resta', BD > H ? sq(BD * BD - H * H) : sq(H * H - BD * BD), 'Restaste los cuadrados. La distancia pedida es la hipotenusa del triángulo rectángulo (BD y la altura son los catetos): se suman.'),
    ];
    const solucion = [
      ['Teorema de la bisectriz en el suelo: BD/DC = AB/AC = ', v('c', `${c}`), '/', v('b', `${b}`), '.'],
      [`BD = ${a}·${c}/${b + c} = ${n(BD)} ${u}.`],
      ['El mástil es perpendicular al suelo, así que es perpendicular a DB: el triángulo con vértices en la punta, D y B es rectángulo en D.'],
      [v('x', 'Distancia'), ` = √(${n(BD)}² + `, v('H', `${H}`), `²) = √${n(BD * BD + H * H)} = `, v('x', L(TB)), '.'],
    ];
    return { correcta: TB, errores, variables, enunciado, pregunta, solucion, datos: { tipo: 'mastil', a, b, c, H, u } };
  }

  return { id: 'geo-proporcionalidad', titulo: 'Paralelas, bisectrices y semejanza', generar, calc };
});
