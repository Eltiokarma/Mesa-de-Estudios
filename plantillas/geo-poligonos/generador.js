/*
 * Generador: polígonos regulares, hexágono equiángulo, trapecios y cuadriláteros con ángulos.
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['geo-poligonos']) y en Node (require). No usa ningún motor.
 *
 * Tipos y campos de _datos (todos los datos del enunciado están en _datos):
 *   equiangulo     hexágono ABCDEF con sus seis ángulos de 120°. Datos: a = AB, b = BC, c = CD,
 *                  d = DE. pedido 'perimetro' (perímetro del hexágono) o 'lado' (EF).
 *                  Al prolongar AB, CD y EF se forma un triángulo equilátero: a + b + c = c + d + e = e + f + a.
 *   area-regular   sub 'dodecagono-R': dodecágono regular inscrito en una circunferencia de radio R; área.
 *                  sub 'hexagono-apotema': hexágono regular de apotema ap = k√3 (se guarda k); área.
 *                  sub 'dodecagono-apotema': dodecágono regular de apotema ap; área = 12·ap²·tan 15°,
 *                  escrita como N(2 − √3); la respuesta es la clave 'dod:N:-'.
 *   soporte        polígono regular de n lados con vértices consecutivos A, B, C, D; dentro se marca F
 *                  con ABF equilátero. pedido 'BFC' (ángulo BFC) o 'FCD' (ángulo FCD).
 *   diagonales     pentágono regular ABCDE; P es el corte de la diagonal AC con la diagonal BX
 *                  (X = 'D' o 'E'); pedido 'APB' o 'BPC' (ángulo en P).
 *   hexagono       hexágono regular ABCDEF inscrito en una circunferencia. Se da la longitud s de un
 *                  segmento (s se guarda como número; s2 = s²): seg 'BP' o 'PD' con P = AC ∩ BD;
 *                  seg 'BM', 'AM' o 'ME' con M = AC ∩ BE. Se pide el radio de la circunferencia.
 *   trapecio       sub 'segmento': bases B (mayor) y b (menor); se pide el segmento que une los puntos
 *                  medios de las diagonales. sub 'bases': mediana m y ese segmento s; se pide la base
 *                  mayor. sub 'altura': bases B y b, lados no paralelos c = AB y d = CD (trapecio
 *                  convexo ABCD con BC ∥ AD, AD = B, BC = b); se pide la distancia entre las bases.
 *   encajados      cuadrado exterior ABCD y cuadrado interior PQRS con P en AB, Q en BC, R en CD y
 *                  S en DA; el ángulo APS mide 37° (notable 3-4-5). dato 'exterior' (valor = AB) o
 *                  'interior' (valor = PQ). Se pide el alambre total: perímetro de los dos cuadrados.
 *   rombo          rombo ABCD con ángulo ABC = beta (entre 60° y 120°); E dentro del rombo con BEC
 *                  equilátero. pedido 'EAD', 'BAE' o 'AED'.
 *   cuadrados      hoja cuadrada ABCD (antihoraria) y hoja cuadrada ACEF construida sobre la diagonal AC
 *                  como lado, del mismo lado de AC que D. pedido 'BCE', 'BDE', 'CDE' o 'DEC'.
 *
 * Errores: GE11 (Pitágoras mal aplicado, parcial) y GE23 (suma de ángulos con n mal, hipótesis) de
 * docs/investigacion/geometria-ideas-erroneas.md; GE21 (apotema por lado o radio) como hipótesis;
 * el resto, códigos nuevos con prefijo (EQ, AR, PO, HX, TP, CE, RO, CS), todos hipótesis.
 * calc: funciones puras de cálculo (las usa papel.json).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const GE = 'docs/investigacion/geometria-ideas-erroneas.md';
  const h = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente: null });
  const par = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'parcial', fuente: GE });
  const v = P.v;
  const f = x => P.formatear(x, 2);
  const g = x => `${P.formatear(x, 1)}°`;
  const S3 = Math.sqrt(3);
  const esEntero = x => Math.abs(x - Math.round(x)) < 1e-9;
  const conRaiz = x => Number.isFinite(x) && x > 0 && esEntero(x * x) && x * x < 1e7;

  // ---------- Cálculo puro ----------
  const FACTOR_HEX = { BP: 1 / S3, PD: 2 / S3, BM: 1 / 2, AM: S3 / 2, ME: 3 / 2 };
  const calc = {
    anguloInterior: n => 180 * (n - 2) / n,
    equiangulo(a, b, c, d) {
      const e = a + b - d, fl = c + d - a;
      return { e, f: fl, perimetro: a + b + c + d + e + fl, ladoTriangulo: a + b + c };
    },
    areaDodecagonoR: R => 3 * R * R,
    areaHexagonoApotema(ap) { const l = 2 * ap / S3; return 6 * l * l * S3 / 4; },
    areaDodecagonoApotema: ap => ({ coef: 12 * ap * ap, valor: 12 * ap * ap * (2 - S3) }),
    areaRegular: (n, lado, apotema) => n * lado * apotema / 2,
    soporte(n) {
      const i = 180 * (n - 2) / n, base = (240 - i) / 2;
      return { interior: i, apice: i - 60, BFC: base, FCD: i - base };
    },
    diagonalesPentagono(X, pedido) {
      const arcoCX = X === 'D' ? 72 : 144;
      const APB = (72 + arcoCX) / 2;
      return pedido === 'APB' ? APB : 180 - APB;
    },
    hexagonoRadio: (seg, s) => s / FACTOR_HEX[seg],
    trapecioSegmentos: (B, b) => ({ mediana: (B + b) / 2, segmento: (B - b) / 2 }),
    trapecioBases: (m, s) => ({ mayor: m + s, menor: m - s }),
    trapecioAltura(B, b, c, d) {
      const x = B - b, s = (c + d + x) / 2;
      const area = Math.sqrt(Math.max(0, s * (s - c) * (s - d) * (s - x)));
      return 2 * area / x;
    },
    encajados(dato, valor) {
      const L = dato === 'exterior' ? valor : valor * 7 / 5, s = dato === 'exterior' ? valor * 5 / 7 : valor;
      return { exterior: L, interior: s, total: 4 * (L + s) };
    },
    rombo: beta => ({ BAE: 120 - beta / 2, EAD: 60 - beta / 2, AED: 150, CED: 30 + beta / 2, ABE: beta - 60 }),
    cuadrados: pedido => ({ BCE: 135, BDE: 135, CDE: 90, DEC: 45 })[pedido],
  };

  function generar(semilla) {
    const rng = Azar.crear('geo-poligonos|' + semilla);
    for (let intento = 0; intento < 80; intento++) {
      const pr = construir(rng, semilla);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  const TIPOS = ['equiangulo', 'area-regular', 'soporte', 'diagonales', 'hexagono', 'trapecio', 'encajados', 'rombo', 'cuadrados'];

  function construir(rng, semilla) {
    const tipo = rng.elegir(TIPOS);
    const r = ({ equiangulo, 'area-regular': areaRegular, soporte, diagonales, hexagono, trapecio, encajados, rombo, cuadrados })[tipo](rng);
    if (!r) return null;
    let alternativas;
    if (r.claves) {
      alternativas = P.armarTexto({ correcta: r.correcta, errores: r.errores, rng });
    } else {
      let errores = r.errores.filter(e => Number.isFinite(e.valor) && e.valor > 0);
      if (r.filtro) errores = errores.filter(e => r.filtro(e.valor));
      alternativas = P.armar({ correcta: r.correcta, errores, rng, texto: r.texto });
    }
    return {
      id: `geo-poligonos#${semilla}`, variables: r.variables, enunciado: r.enunciado, pregunta: r.pregunta,
      datos: '', alternativas, solucion: r.solucion,
      respuesta: { valor: r.claves ? r.correcta.clave : r.correcta, unidad: r.unidad },
      _datos: r.datos,
    };
  }

  // ---------- Hexágono equiángulo ----------
  function equiangulo(rng) {
    const ctx = rng.elegir([
      { u: 'cm', que: 'La tapa de una caja de bombones tiene forma de hexágono ABCDEF' },
      { u: 'm', que: 'Un terreno tiene forma de hexágono ABCDEF' },
      { u: 'cm', que: 'Una loseta tiene forma de hexágono ABCDEF' },
      { u: 'u', que: 'Se tiene un hexágono ABCDEF' },
    ]);
    const u = ctx.u;
    for (;;) {
      const a = rng.entero(2, 12), b = rng.entero(2, 12), c = rng.entero(2, 12), d = rng.entero(2, 12);
      const { e, f: fl, perimetro, ladoTriangulo: L } = calc.equiangulo(a, b, c, d);
      if (e < 1 || fl < 1 || e === b) continue;
      const pedido = rng.elegir(['perimetro', 'perimetro', 'lado']);
      const variables = {
        a: { nombre: 'AB', color: 'o' }, b: { nombre: 'BC', color: 'i' }, d: { nombre: 'DE', color: 'h' },
        x: { nombre: pedido === 'lado' ? 'EF' : 'perímetro', color: 'd' },
      };
      const enunciado = [`${ctx.que} cuyos seis ángulos interiores miden 120°. Se sabe que AB = `, v('a', `${a} ${u}`), ', BC = ',
        v('b', `${b} ${u}`), `, CD = ${c} ${u} y DE = `, v('d', `${d} ${u}`), '.'];
      const pregunta = [pedido === 'lado' ? '¿Cuánto mide EF?' : '¿Cuál es su perímetro?'];
      const solucion = [
        ['Cada ángulo exterior mide 60°. Al prolongar AB, CD y EF se forma un triángulo equilátero; en cada esquina queda un triángulo equilátero pequeño (con lados BC, DE y FA).'],
        ['Lado del triángulo grande: AB + BC + CD = ', v('a', a), ' + ', v('b', b), ` + ${c} = ${L}. También vale CD + DE + EF = ${L}.`],
        ['EF = ', `${L} − ${c} − `, v('d', d), ' = ', pedido === 'lado' ? v('x', `${e} ${u}`) : `${e}`, '.'],
      ];
      let correcta, errores;
      if (pedido === 'lado') {
        correcta = e;
        errores = [
          h('EQ-opuestos-iguales', b, 'Supusiste que los lados opuestos son iguales, como en el hexágono regular. En el equiángulo solo son iguales los ángulos: los lados se hallan con el triángulo equilátero que se forma al prolongar.'),
          h('EQ-falta-restar', L - d, `Restaste solo DE del lado del triángulo grande. Ese lado (${L}) está formado por CD + DE + EF: hay que restar los dos.`),
          h('EQ-copia-lado', d, 'Tomaste EF igual al lado vecino DE. Nada obliga a que dos lados seguidos sean iguales.'),
          h('EQ-signos', d + b - a, 'Cambiaste los signos al despejar: de AB + BC = DE + EF sale EF = AB + BC − DE.'),
        ];
      } else {
        correcta = perimetro;
        solucion.push(['FA = ', `${L} − EF − `, v('a', a), ` = ${L} − ${e} − ${a} = ${fl}.`]);
        solucion.push(['Perímetro = ', `${a} + ${b} + ${c} + ${d} + ${e} + ${fl} = `, v('x', `${perimetro} ${u}`), '.']);
        errores = [
          h('EQ-falta-restar', a + b + c + d + (L - d) + (L - a), `Restaste un solo lado al despejar EF y FA (EF = ${L} − DE, FA = ${L} − AB). Cada lado del triángulo grande está formado por tres segmentos.`),
          h('EQ-triangulo-grande', 3 * L, `Ese es el perímetro del triángulo equilátero grande (3 × ${L}). El hexágono no incluye las tres esquinas que se recortan.`),
          h('EQ-solo-dados', a + b + c + d, 'Sumaste solo los cuatro lados dados. Faltan EF y FA, que salen del triángulo equilátero.'),
          h('EQ-falta-FA', a + b + c + d + e, 'Hallaste EF pero olvidaste FA. Con los seis ángulos de 120°, FA también sale del triángulo equilátero grande.'),
        ];
      }
      return { variables, enunciado, pregunta, solucion, correcta, errores, texto: x => `${f(x)} ${u}`, filtro: esEntero, unidad: u,
        datos: { tipo: 'equiangulo', a, b, c, d, pedido } };
    }
  }

  // ---------- Área de polígonos regulares ----------
  function areaRegular(rng) {
    const sub = rng.elegir(['dodecagono-R', 'hexagono-apotema', 'dodecagono-apotema']);
    const ctx = rng.elegir([
      { u: 'm', que: 'Un parque', cosa: 'del parque' }, { u: 'cm', que: 'La cara de un reloj de pared', cosa: 'de la cara del reloj' },
      { u: 'm', que: 'Una pista de baile', cosa: 'de la pista' }, { u: 'u', que: 'Un polígono', cosa: 'del polígono' },
    ]);
    const u = ctx.u;
    const variables = { R: { nombre: 'radio', color: 'o' }, ap: { nombre: 'apotema', color: 'i' }, l: { nombre: 'lado', color: 'h' }, A: { nombre: 'área', color: 'd' } };
    if (sub === 'dodecagono-R') {
      const R = rng.elegir([2, 4, 6, 8, 10, 12, 20]);
      const correcta = calc.areaDodecagonoR(R);
      return {
        variables, unidad: `${u}²`, correcta,
        enunciado: [`${ctx.que} tiene forma de dodecágono regular (12 lados) inscrito en una circunferencia de radio `, v('R', `${R} ${u}`), '.'],
        pregunta: [`¿Cuál es el área ${ctx.cosa}?`],
        errores: [
          h('AR-sin-mitad', 2 * correcta, 'Calculaste cada triángulo central como R·R·sen 30° sin el 1/2. El área de un triángulo con dos lados y el ángulo entre ellos es (1/2)·R·R·sen θ.'),
          h('AR-coseno', 3 * S3 * R * R, 'Usaste cos 30° = √3/2 en lugar de sen 30° = 1/2. El área del triángulo es (1/2)·R·R·sen θ, con seno.'),
          h('AR-formula-hexagono', 3 * S3 * R * R / 2, 'Usaste la fórmula del hexágono regular (6 triángulos equiláteros de lado R). El dodecágono tiene 12 triángulos de ángulo central 30°.'),
        ],
        solucion: [
          ['El dodecágono se parte en 12 triángulos con vértice en el centro, dos lados iguales al radio ', v('R', `${R}`), ' y ángulo central 360°/12 = 30°.'],
          ['Área de cada triángulo: (1/2)·', v('R', R), '·', v('R', R), `·sen 30° = ${f(R * R / 4)}.`],
          ['Área total: 12 · ', `${f(R * R / 4)} = 3R² = `, v('A', `${f(correcta)} ${u}²`), '.'],
        ],
        texto: x => `${P.radical(x)} ${u}²`, filtro: conRaiz,
        datos: { tipo: 'area-regular', sub, R },
      };
    }
    if (sub === 'hexagono-apotema') {
      const k = rng.elegir([2, 4, 6, 8, 10]);
      const ap = k * S3, l = 2 * k, correcta = calc.areaHexagonoApotema(ap);
      return {
        variables, unidad: `${u}²`, correcta,
        enunciado: [`${ctx.que} tiene forma de hexágono regular. Su apotema (la distancia del centro a cada lado) mide `, v('ap', `${P.radical(ap)} ${u}`), '.'],
        pregunta: [`¿Cuál es el área ${ctx.cosa}?`],
        errores: [
          h('GE21-apotema-como-lado', 6 * ap * ap * S3 / 4, 'Tomaste la apotema como si fuera el lado. La apotema es la altura de cada triángulo equilátero central: lado = 2·apotema/√3.'),
          h('AR-sin-mitad', 2 * correcta, 'Multiplicaste el perímetro por la apotema sin el 1/2. El área es semiperímetro × apotema.'),
          h('AR-apotema-mitad-lado', 6 * (2 * ap) ** 2 * S3 / 4, 'Supusiste que la apotema es la mitad del lado, como en el cuadrado. En el hexágono, la apotema es la altura de un triángulo equilátero: (√3/2)·lado.'),
          h('AR-un-triangulo', correcta / 6, 'Calculaste el área de un solo triángulo central. El hexágono tiene seis.'),
        ],
        solucion: [
          ['El hexágono regular se parte en 6 triángulos equiláteros; la apotema ', v('ap', P.radical(ap)), ' es la altura de cada uno.'],
          ['Altura = (√3/2)·lado → ', v('l', `lado = ${l} ${u}`), '.'],
          ['Área = semiperímetro × apotema = ', `${3 * l} · `, v('ap', P.radical(ap)), ' = ', v('A', `${P.radical(correcta)} ${u}²`), '.'],
        ],
        texto: x => `${P.radical(x)} ${u}²`, filtro: conRaiz,
        datos: { tipo: 'area-regular', sub, k },
      };
    }
    // dodecágono con apotema: área = 12·ap²·(2 − √3)
    const ap = rng.elegir([1, 2, 3, 4, 5, 10]);
    const N = 12 * ap * ap;
    const t = (n, s) => ({ clave: `dod:${n}:${s}`, texto: `${f(n)}(2 ${s === '-' ? '−' : '+'} √3) ${u}²` });
    const e = (id, n, s, explicacion) => ({ id, ...t(n, s), explicacion, respaldo: 'hipotesis', fuente: null });
    return {
      variables, unidad: `${u}²`, claves: true, correcta: t(N, '-'),
      enunciado: [`${ctx.que} tiene forma de dodecágono regular (12 lados). Su apotema mide `, v('ap', `${ap} ${u}`), '. Usa tan 15° = 2 − √3.'],
      pregunta: [`¿Cuál es el área ${ctx.cosa}?`],
      errores: [
        e('AR-medio-lado', N / 2, '-', 'Tomaste apotema·tan 15° como el lado entero. Ese valor es medio lado: la apotema cae en el punto medio del lado.'),
        e('AR-sin-mitad', 2 * N, '-', 'Multiplicaste el perímetro por la apotema sin el 1/2. El área es semiperímetro × apotema.'),
        e('AR-tangente-invertida', N, '+', 'Usaste 2 + √3, que es tan 75° (o cot 15°). Medio lado es opuesto al ángulo de 15° del centro: medio lado = apotema·tan 15°.'),
        e('AR-dos-errores', 2 * N, '+', 'Usaste tan 75° = 2 + √3 en lugar de tan 15° y además olvidaste el 1/2 del área.'),
      ],
      solucion: [
        ['El ángulo central es 360°/12 = 30°. La apotema lo parte en dos de 15° y cae en el punto medio del lado.'],
        ['Medio lado = ', v('ap', ap), ' · tan 15° = ', v('l', `${ap}(2 − √3)`), `; perímetro = 24 · ${ap}(2 − √3).`],
        ['Área = semiperímetro × apotema = ', `12 · ${ap}(2 − √3) · `, v('ap', ap), ' = ', v('A', t(N, '-').texto), '.'],
      ],
      datos: { tipo: 'area-regular', sub, ap },
    };
  }

  // ---------- Soporte equilátero dentro de un polígono regular ----------
  function soporte(rng) {
    const n = rng.elegir([5, 5, 6, 9, 10, 12]);
    const NOM = { 5: 'pentágono', 6: 'hexágono', 9: 'eneágono', 10: 'decágono', 12: 'dodecágono' };
    const pedido = rng.elegir(['BFC', 'FCD']);
    const ctx = rng.elegir([
      `Una mesa tiene forma de ${NOM[n]} regular`, `Un vitral tiene forma de ${NOM[n]} regular`, `Se tiene un ${NOM[n]} regular`,
    ]);
    const s = calc.soporte(n), i = s.interior;
    const correcta = s[pedido];
    const de = x => { const base = (240 - x) / 2; return pedido === 'BFC' ? base : x - base; };
    const variables = { i: { nombre: 'ángulo interior', color: 'o' }, ap: { nombre: 'ángulo FBC', color: 'i' }, x: { nombre: `ángulo ${pedido}`, color: 'd' } };
    const errores = [
      h('GE23-n-menos-1', de(180 * (n - 1) / n), 'Calculaste el ángulo interior con 180°(n − 1)/n. La suma de ángulos interiores es 180°(n − 2): el polígono se parte en n − 2 triángulos.'),
      h('PO-exterior-por-interior', de(360 / n), `Usaste el ángulo exterior (360°/${n}) como si fuera el interior. El interior es 180° menos el exterior.`),
      h('PO-angulo-apice', s.apice, 'Ese es el ángulo FBC, en el vértice B. Se pide un ángulo de la base del triángulo isósceles FBC.'),
      h('PO-todo-equilatero', 60, 'Supusiste que el triángulo FBC también es equilátero. Solo es isósceles (BF = BC = lado); es equilátero solo si el ángulo FBC mide 60°.'),
      pedido === 'FCD' ? h('PO-angulo-base', s.BFC, 'Ese es el ángulo BCF. El ángulo FCD es lo que falta para completar el ángulo interior BCD.') : null,
      h('GE23-180n', de(180), 'Tomaste 180° como ángulo interior (dividiste 180°·n entre n). La suma es 180°(n − 2), no 180°·n.'),
    ].filter(Boolean);
    return {
      variables, unidad: '°', correcta, errores, texto: g, filtro: x => esEntero(x) && x < 180,
      enunciado: [`${ctx}; A, B, C y D son cuatro de sus vértices consecutivos. Dentro del polígono se marca el punto F de modo que el triángulo ABF es equilátero (F está del mismo lado de AB que C).`],
      pregunta: [`¿Cuánto mide el ángulo ${pedido}?`],
      solucion: [
        ['Ángulo interior: 180°(', `${n} − 2)/${n} = `, v('i', g(i)), '.'],
        ['El ángulo ABF mide 60°, así que FBC = ', v('i', g(i)), ' − 60° = ', v('ap', g(s.apice)), '.'],
        ['BF = BA = BC (todos son lados): el triángulo FBC es isósceles y sus ángulos de la base miden (180° − ', v('ap', g(s.apice)), `)/2 = ${g(s.BFC)}.`],
        pedido === 'BFC' ? ['Ángulo BFC = ', v('x', g(correcta)), '.'] : ['Ángulo FCD = ', v('i', g(i)), ` − ${g(s.BFC)} = `, v('x', g(correcta)), '.'],
      ],
      datos: { tipo: 'soporte', n, pedido },
    };
  }

  // ---------- Diagonales del pentágono regular ----------
  function diagonales(rng) {
    const X = rng.elegir(['D', 'E']), pedido = rng.elegir(['APB', 'BPC']);
    const correcta = calc.diagonalesPentagono(X, pedido);
    const arcoCX = X === 'D' ? 72 : 144;
    const APB = (72 + arcoCX) / 2;
    const ctx = rng.elegir(['Una estrella se dibuja dentro de un pentágono regular ABCDE trazando sus diagonales.', 'Se tiene un pentágono regular ABCDE.']);
    const variables = { arco: { nombre: 'arco de cada lado', color: 'o' }, x: { nombre: `ángulo ${pedido}`, color: 'd' } };
    return {
      variables, unidad: '°', correcta, texto: g, filtro: x => esEntero(x) && x < 180,
      enunciado: [`${ctx} Las diagonales AC y B${X} se cortan en el punto P.`],
      pregunta: [`¿Cuánto mide el ángulo ${pedido}?`],
      errores: [
        h('PO-suplemento', 180 - correcta, `Ese es el ángulo ${pedido === 'APB' ? 'BPC' : 'APB'}, su suplemento. Fíjate qué arcos abarca el ángulo que se pide.`),
        h('PO-angulo-isosceles', 36, 'Ese es el ángulo BAC del triángulo isósceles ABC (lados AB = BC y ángulo B de 108°). Se pide el ángulo en P, donde se cortan las diagonales.'),
        h('PO-sin-mitad', pedido === 'APB' ? 72 + arcoCX : 360 - 72 - arcoCX, 'Sumaste los arcos y no dividiste entre 2. Un ángulo con vértice dentro de la circunferencia mide la semisuma de los arcos que abarca.'),
        h('PO-semidiferencia', Math.abs(arcoCX - 72) / 2, 'Restaste los arcos: así se mide un ángulo con vértice fuera de la circunferencia. Con el vértice dentro, se suman.'),
        h('PO-interior', 108, 'Ese es el ángulo interior del pentágono. El ángulo entre las diagonales en P no tiene por qué ser igual.'),
        h('PO-todo-equilatero', 60, 'Supusiste un triángulo equilátero en P. Los triángulos del pentágono tienen ángulos de 36°, 72° y 108°.'),
      ],
      solucion: [
        ['Se dibuja la circunferencia que pasa por los cinco vértices: cada lado abarca un arco de 360°/5 = ', v('arco', '72°'), '.'],
        [`El ángulo APB abarca el arco AB (`, v('arco', '72°'), `) y su opuesto CP${X} abarca el arco C${X} (${arcoCX}°).`],
        [`Ángulo con vértice dentro: APB = (72° + ${arcoCX}°)/2 = ${g(APB)}.`],
        pedido === 'APB' ? ['Ángulo APB = ', v('x', g(correcta)), '.'] : ['BPC es su suplemento: 180° − ', `${g(APB)} = `, v('x', g(correcta)), '.'],
      ],
      datos: { tipo: 'diagonales', X, pedido },
    };
  }

  // ---------- Hexágono regular inscrito y sus diagonales ----------
  function hexagono(rng) {
    const ctx = rng.elegir([
      { u: 'cm', que: 'Una celda de panal de abeja se dibuja como un hexágono regular ABCDEF inscrito en una circunferencia' },
      { u: 'm', que: 'Una glorieta tiene forma de hexágono regular ABCDEF inscrito en una circunferencia' },
      { u: 'cm', que: 'Una tuerca tiene forma de hexágono regular ABCDEF inscrito en una circunferencia' },
      { u: 'u', que: 'Un hexágono regular ABCDEF está inscrito en una circunferencia' },
    ]);
    const u = ctx.u;
    for (;;) {
      const l = rng.elegir([4, 6, 8, 12, 2 * S3, 4 * S3, 6 * S3, 3 * S3]);
      const seg = rng.elegir(['BP', 'PD', 'BM', 'AM', 'ME']);
      const s = l * FACTOR_HEX[seg];
      const st = P.radical(s);
      if (!conRaiz(s) || st.includes('/') || st.includes(',')) continue;
      const corte = seg === 'BP' || seg === 'PD' ? 'P es el punto donde se cortan las diagonales AC y BD' : 'M es el punto donde se cortan la diagonal AC y la diagonal BE';
      const variables = { s: { nombre: seg, color: 'o' }, l: { nombre: 'lado', color: 'i' }, R: { nombre: 'radio', color: 'd' } };
      const correcta = calc.hexagonoRadio(seg, s);
      const expl = {
        BP: ['El triángulo BPC tiene ángulos de 30° en B y en C (ángulos PBC y PCB), así que es isósceles: BP = PC.', 'Su altura desde P cae en el punto medio de BC: BP·cos 30° = lado/2 → BP = lado/√3.'],
        PD: ['BD es una diagonal menor: mide lado·√3. El triángulo BPC es isósceles con ángulos de 30° en B y C: BP = lado/√3.', 'PD = lado·√3 − lado/√3 = 2·lado/√3.'],
        BM: ['La diagonal mayor BE es perpendicular a AC y la corta en su punto medio M.', 'En el triángulo ABM, el ángulo BAM mide 30°: BM = lado·sen 30° = lado/2.'],
        AM: ['La diagonal mayor BE es perpendicular a AC y la corta en su punto medio M.', 'En el triángulo ABM, el ángulo BAM mide 30°: AM = lado·cos 30° = lado·√3/2.'],
        ME: ['La diagonal mayor BE mide 2·lado y corta a AC en M, perpendicularmente.', 'En el triángulo ABM, BM = lado·sen 30° = lado/2, así que ME = 2·lado − lado/2 = 3·lado/2.'],
      }[seg];
      return {
        variables, unidad: u, correcta, texto: x => `${P.radical(x)} ${u}`, filtro: conRaiz,
        enunciado: [`${ctx.que}. ${corte}, y `, v('s', `${seg} = ${st} ${u}`), '.'],
        pregunta: ['¿Cuánto mide el radio de la circunferencia?'],
        errores: [
          h('HX-diagonal-como-radio', 2 * l, 'Tomaste la diagonal mayor como radio. La diagonal mayor pasa por el centro: es un diámetro, el doble del radio.'),
          h('HX-segmento-como-lado', s, `Tomaste ${seg} como si fuera el lado. ${seg} es solo un tramo de una diagonal; primero hay que relacionarlo con el lado.`),
          h('GE21-apotema-como-radio', l * S3 / 2, 'Esa es la apotema (la distancia del centro a un lado). El radio va del centro a un vértice y, en el hexágono regular, es igual al lado.'),
          h('HX-factor-invertido', s * FACTOR_HEX[seg], 'Despejaste al revés: multiplicaste por el factor en vez de dividir entre él.'),
          h('HX-radio-mitad-lado', l / 2, 'Tomaste el radio como la mitad del lado. Los seis triángulos centrales del hexágono regular son equiláteros: radio = lado.'),
        ],
        solucion: [
          [expl[0]],
          [expl[1]],
          ['Con ', v('s', `${seg} = ${st}`), ': ', v('l', `lado = ${P.radical(l)} ${u}`), '.'],
          ['En el hexágono regular, el radio de la circunferencia circunscrita es igual al lado: R = ', v('R', `${P.radical(correcta)} ${u}`), '.'],
        ],
        datos: { tipo: 'hexagono', seg, s, s2: Math.round(s * s) },
      };
    }
  }

  // ---------- Trapecios ----------
  // Ternas (proyección, altura, lado) que comparten altura.
  const TERNAS = {
    8: [[6, 10], [15, 17]], 12: [[5, 13], [9, 15], [16, 20]], 15: [[8, 17], [20, 25]],
    20: [[15, 25], [21, 29]], 24: [[7, 25], [10, 26], [18, 30], [32, 40]],
  };
  function trapecio(rng) {
    const sub = rng.elegir(['segmento', 'bases', 'altura', 'altura']);
    if (sub === 'altura') {
      const hh = Number(rng.elegir(Object.keys(TERNAS)));
      const lista = rng.barajar(TERNAS[hh]);
      const [[p, c], [q, d]] = lista;
      const b = rng.entero(2, 12), B = b + p + q;
      const u = 'm';
      const variables = { B: { nombre: 'base mayor AD', color: 'o' }, b: { nombre: 'base menor BC', color: 'i' }, x: { nombre: 'AD − BC', color: 'h' }, H: { nombre: 'ancho', color: 'd' } };
      const correcta = calc.trapecioAltura(B, b, c, d);
      const x = B - b;
      const errores = [
        h('TP-isosceles', Math.sqrt(c * c - (x / 2) ** 2), `Repartiste ${x} en dos partes iguales, como si el trapecio fuera isósceles. Los lados no paralelos miden distinto (${c} y ${d}): sus proyecciones también son distintas.`),
        par('GE7-lado-como-altura', Math.min(c, d), 'Tomaste un cable como si fuera perpendicular a las orillas. Los cables están inclinados: el ancho es la altura del trapecio, menor que los dos.'),
        par('GE11-proyeccion-completa', Math.sqrt(Math.max(c, d) ** 2 - x * x), `Usaste toda la diferencia de bases (${x}) como proyección del cable más largo. Esa diferencia se reparte entre las proyecciones de los dos cables.`),
        h('TP-sin-raiz', correcta * correcta, `Llegaste a h² = ${f(correcta * correcta)} y olvidaste sacar la raíz.`),
        par('GE11-suma', Math.sqrt(c * c + p * p), 'Sumaste los cuadrados en Pitágoras. La altura es un cateto: h² = cable² − proyección².'),
      ];
      return {
        variables, unidad: u, correcta, errores, texto: y => `${P.radical(y)} ${u}`, filtro: conRaiz,
        enunciado: ['Las orillas de un río son rectas paralelas. En una orilla están los anclajes A y D, separados ', v('B', `${B} ${u}`),
          '; en la otra, los anclajes B y C, separados ', v('b', `${b} ${u}`), `. Dos cables tensos unen A con B (${c} ${u}) y D con C (${d} ${u}), de modo que ABCD es un trapecio con BC paralelo a AD.`],
        pregunta: ['¿Cuál es el ancho del río?'],
        solucion: [
          ['Se traslada el cable DC paralelo a sí mismo hasta que C coincida con B: se forma un triángulo de lados ', `${c}, ${d} y `, v('x', `${B} − ${b} = ${x}`), '.'],
          ['La altura de ese triángulo es el ancho del río. Si su pie divide el lado de ', v('x', `${x}`), ' en p y q: ', `${c}² − p² = ${d}² − q² y p + q = ${x}.`],
          [`Restando: q² − p² = ${d * d - c * c} → q − p = ${f((d * d - c * c) / x)}; así p = ${p} y q = ${q}.`],
          ['h² = ', `${c}² − ${p}² = ${hh * hh} → h = `, v('H', `${hh} ${u}`), '.'],
        ],
        datos: { tipo: 'trapecio', sub, B, b, c, d },
      };
    }
    const ctx = rng.elegir([
      { u: 'cm', que: 'La cara de un estante tiene forma de trapecio ABCD' }, { u: 'm', que: 'Un terreno tiene forma de trapecio ABCD' },
      { u: 'cm', que: 'Una ventana tiene forma de trapecio ABCD' }, { u: 'u', que: 'Se tiene un trapecio ABCD' },
    ]);
    const u = ctx.u;
    const variables = { B: { nombre: 'base mayor', color: 'o' }, b: { nombre: 'base menor', color: 'i' }, m: { nombre: 'mediana', color: 'h' }, x: { nombre: 'pedido', color: 'd' } };
    if (sub === 'segmento') {
      let B, b;
      do { b = rng.entero(3, 20); B = b + 2 * rng.entero(2, 10); } while (B === 3 * b);
      const { mediana, segmento } = calc.trapecioSegmentos(B, b);
      return {
        variables, unidad: u, correcta: segmento, texto: x => `${f(x)} ${u}`, filtro: esEntero,
        enunciado: [`${ctx.que}, con BC paralelo a AD, BC = `, v('b', `${b} ${u}`), ' y AD = ', v('B', `${B} ${u}`), '. M y N son los puntos medios de las diagonales AC y BD.'],
        pregunta: ['¿Cuánto mide MN?'],
        errores: [
          h('TP-semisuma-por-semidiferencia', mediana, 'Esa es la mediana del trapecio (la semisuma de las bases). El segmento que une los puntos medios de las diagonales mide la semidiferencia.'),
          h('TP-sin-mitad', B - b, 'Restaste las bases y no dividiste entre 2.'),
          h('TP-mitad-base-menor', b / 2, 'Ese es el tramo de la mediana que va del lado AB hasta M. MN es lo que queda de la mitad de AD después de quitar la mitad de BC.'),
          h('TP-mitad-base-mayor', B / 2, 'Esa es la mitad de AD. Hay que quitarle la mitad de BC.'),
        ],
        solucion: [
          ['M y N están sobre la mediana del trapecio, que mide (', v('B', B), ' + ', v('b', b), `)/2 = `, v('m', `${f(mediana)}`), '.'],
          ['En el triángulo ACD, el segmento del punto medio de CD a M mide AD/2 = ', `${f(B / 2)}; en el triángulo BCD, el del punto medio de CD a N mide BC/2 = ${f(b / 2)}.`],
          ['MN = ', `${f(B / 2)} − ${f(b / 2)} = (AD − BC)/2 = `, v('x', `${f(segmento)} ${u}`), '.'],
        ],
        datos: { tipo: 'trapecio', sub, B, b },
      };
    }
    let m, s;
    do { m = rng.entero(6, 25); s = rng.entero(2, m - 2); } while (m === 3 * s || m === 2 * s);
    const { mayor } = calc.trapecioBases(m, s);
    return {
      variables, unidad: u, correcta: mayor, texto: x => `${f(x)} ${u}`, filtro: esEntero,
      enunciado: [`${ctx.que}, con BC paralelo a AD y AD mayor que BC. Su mediana mide `, v('m', `${m} ${u}`), ' y el segmento que une los puntos medios de sus diagonales mide ', v('x', `${s} ${u}`), '.'],
      pregunta: ['¿Cuánto mide la base mayor AD?'],
      errores: [
        h('TP-bases-cambiadas', m - s, 'Esa es la base menor BC. La mayor es la mediana más el segmento.'),
        h('TP-sin-mitad', (m + s) / 2, 'Tomaste la mediana como AD + BC y el segmento como AD − BC (sin dividir entre 2). Son la semisuma y la semidiferencia.'),
        h('TP-doble', 2 * (m + s), 'Duplicaste la suma: AD = mediana + segmento, sin multiplicar por 2.'),
        h('TP-segmento-a-medias', m + 2 * s, 'Tomaste el segmento como la mitad de la semidiferencia. El segmento entre los puntos medios de las diagonales es (AD − BC)/2.'),
      ],
      solucion: [
        ['Mediana: (AD + BC)/2 = ', v('m', m), ' → AD + BC = ', `${2 * m}.`],
        ['Segmento entre los puntos medios de las diagonales: (AD − BC)/2 = ', v('x', s), ' → AD − BC = ', `${2 * s}.`],
        ['Sumando: 2·AD = ', `${2 * m + 2 * s} → AD = ${mayor} ${u}.`],
      ],
      datos: { tipo: 'trapecio', sub, m, s },
    };
  }

  // ---------- Cuadrados encajados con 37° ----------
  function encajados(rng) {
    const k = rng.elegir([5, 10, 15, 20]);
    const dato = rng.elegir(['exterior', 'interior']);
    const L = 7 * k, s = 5 * k, u = 'cm';
    const valor = dato === 'exterior' ? L : s;
    const { total } = calc.encajados(dato, valor);
    const variables = { L: { nombre: 'lado exterior AB', color: 'o' }, s: { nombre: 'lado interior PQ', color: 'i' }, t: { nombre: 'ángulo APS', color: 'h' }, T: { nombre: 'alambre total', color: 'd' } };
    const ctx = rng.elegir(['Un artesano dobla alambre para armar un adorno', 'Con alambre se arma el marco de una ventana decorativa', 'Con alambre se arma un llavero']);
    const errores = dato === 'exterior' ? [
      h('CE-solo-exterior', 4 * L, 'Contaste solo el cuadrado exterior. El alambre forma los dos cuadrados.'),
      h('CE-lado-como-hipotenusa', 4 * L + 4 * (4 * L / 5), `Tomaste AB = ${L} como hipotenusa (PQ = AB·cos 37°). AB está formado por dos catetos de triángulos distintos: AP = 4k y PB = 3k.`),
      h('CE-iguales', 8 * L, 'Supusiste que los dos cuadrados tienen el mismo lado. El interior es más pequeño: su lado es la hipotenusa de los triángulos de las esquinas.'),
      h('CE-un-cateto', 4 * L + 4 * (3 * L / 5), 'Calculaste PQ con la razón 3/5 aplicada a todo AB. AB = AP + PB no es la hipotenusa de un solo triángulo.'),
    ] : [
      h('CE-solo-interior', 4 * s, 'Contaste solo el cuadrado interior. El alambre forma los dos cuadrados.'),
      h('CE-iguales', 8 * s, 'Supusiste que los dos cuadrados tienen el mismo lado. El exterior es más grande: cada lado suma dos catetos.'),
      h('CE-un-cateto', 4 * s + 4 * (4 * s / 5), `Tomaste AB igual a un solo cateto (AP = ${4 * k}). AB también incluye PB = ${3 * k}.`),
      h('CE-suma-hipotenusas', 4 * s + 4 * (2 * s), 'Sumaste dos hipotenusas para AB. AB se forma con dos catetos: AP y PB.'),
    ];
    return {
      variables, unidad: u, correcta: total, errores, texto: x => `${f(x)} ${u}`, filtro: esEntero,
      enunciado: [`${ctx}: un cuadrado exterior ABCD y un cuadrado interior PQRS, con P en AB, Q en BC, R en CD y S en DA. El ángulo APS mide `, v('t', '37°'),
        dato === 'exterior' ? ' y el lado AB mide ' : ' y el lado PQ mide ', dato === 'exterior' ? v('L', `${L} ${u}`) : v('s', `${s} ${u}`), '. Usa el triángulo notable de 37° y 53° (lados 3, 4 y 5).'],
      pregunta: ['¿Cuánto alambre se usa en total para los dos cuadrados?'],
      solucion: [
        ['En la esquina A, el triángulo APS es rectángulo con hipotenusa PS = lado interior y ángulo ', v('t', '37°'), ' en P: AP = 4k, AS = 3k, PS = 5k.'],
        ['Por la simetría del cuadrado interior, PB = AS = 3k: el lado exterior es AB = AP + PB = 7k.'],
        dato === 'exterior' ? ['7k = ', v('L', L), ` → k = ${k} y `, v('s', `PQ = 5k = ${s}`), '.'] : ['5k = ', v('s', s), ` → k = ${k} y `, v('L', `AB = 7k = ${L}`), '.'],
        ['Alambre: 4·', v('L', L), ' + 4·', v('s', s), ' = ', v('T', `${total} ${u}`), '.'],
      ],
      datos: { tipo: 'encajados', dato, valor },
    };
  }

  // ---------- Rombo con un triángulo equilátero dentro ----------
  function rombo(rng) {
    const beta = rng.elegir([70, 76, 80, 84, 100, 104, 110]);
    const pedido = rng.elegir(['EAD', 'BAE', 'AED']);
    const r = calc.rombo(beta), correcta = r[pedido];
    const ctx = rng.elegir(['Un terreno tiene forma de rombo ABCD', 'Una cometa tiene forma de rombo ABCD', 'Se tiene un rombo ABCD']);
    const variables = { b: { nombre: 'ángulo ABC', color: 'o' }, e: { nombre: 'ángulo ABE', color: 'i' }, a: { nombre: 'ángulo BAE', color: 'h' }, x: { nombre: `ángulo ${pedido}`, color: 'd' } };
    const errores = {
      EAD: [
        h('RO-angulo-base', r.BAE, 'Ese es el ángulo BAE. El ángulo EAD es lo que falta para completar el ángulo BAD del rombo.'),
        h('RO-apice', r.ABE, 'Ese es el ángulo ABE, en el vértice B. Se pide un ángulo en A.'),
        h('RO-angulo-rombo', 180 - beta, 'Ese es el ángulo BAD completo. Hay que quitarle el ángulo BAE.'),
        h('RO-sin-equilatero', (180 - beta) - (180 - beta) / 2, 'Partiste el ángulo A en dos mitades iguales, como si AE fuera la diagonal. E no está sobre la diagonal AC.'),
      ],
      BAE: [
        h('RO-apice', r.ABE, 'Ese es el ángulo ABE, en el vértice B. El triángulo ABE es isósceles (BA = BE) y se pide un ángulo de su base.'),
        h('RO-sin-restar-60', (180 - beta) / 2, 'Usaste el ángulo ABC completo como vértice del triángulo isósceles. Al ángulo ABC hay que quitarle los 60° del equilátero.'),
        h('RO-resto', r.EAD, 'Ese es el ángulo EAD, lo que queda del ángulo A del rombo.'),
        h('RO-todo-equilatero', 60, 'Supusiste que ABE es equilátero. Solo es isósceles (BA = BE).'),
      ],
      AED: [
        h('RO-sin-equilatero', 360 - r.BAE - r.CED, 'Olvidaste restar el ángulo BEC de 60° del triángulo equilátero al completar la vuelta alrededor de E.'),
        h('RO-suplemento', 180 - 150, 'Ese es el suplemento del ángulo pedido. Alrededor de E los cuatro ángulos suman 360°.'),
        h('RO-recto', 90, 'Supusiste que AE y DE son perpendiculares. Hay que calcularlo con los triángulos isósceles ABE y DCE.'),
        h('RO-doble-60', 120, 'Tomaste AED como el doble del ángulo del equilátero. Hay que completar la vuelta de 360° alrededor de E con los ángulos de los triángulos isósceles.'),
      ],
    }[pedido];
    const sol = [
      ['BE = BC = BA (lados del rombo y del equilátero). El ángulo ABE = ', v('b', `${beta}°`), ' − 60° = ', v('e', g(r.ABE)), '.'],
      ['El triángulo ABE es isósceles: BAE = BEA = (180° − ', v('e', g(r.ABE)), ') / 2 = ', v('a', g(r.BAE)), '.'],
    ];
    if (pedido === 'EAD') sol.push(['El ángulo BAD del rombo mide 180° − ', v('b', `${beta}°`), ` = ${g(180 - beta)}. EAD = ${g(180 - beta)} − `, v('a', g(r.BAE)), ' = ', v('x', g(correcta)), '.']);
    if (pedido === 'BAE') sol.push(['Ángulo BAE = ', v('x', g(correcta)), '.']);
    if (pedido === 'AED') {
      sol.push(['Igual en C: ECD = (180° − ', v('b', `${beta}°`), `) − 60° = ${g(120 - beta)} y el triángulo ECD es isósceles: CED = ${g(r.CED)}.`]);
      sol.push(['Alrededor de E: AED = 360° − ', v('a', g(r.BAE)), ` − 60° − ${g(r.CED)} = `, v('x', g(correcta)), '.']);
    }
    return {
      variables, unidad: '°', correcta, errores, texto: g, filtro: x => esEntero(x) && x < 180,
      enunciado: [`${ctx} cuyo ángulo ABC mide `, v('b', `${beta}°`), '. Dentro del rombo se ubica el punto E de modo que el triángulo BEC es equilátero.'],
      pregunta: [`¿Cuánto mide el ángulo ${pedido}?`],
      solucion: sol,
      datos: { tipo: 'rombo', beta, pedido },
    };
  }

  // ---------- Dos hojas cuadradas: una sobre la diagonal de la otra ----------
  function cuadrados(rng) {
    const pedido = rng.elegir(['BCE', 'BDE', 'CDE', 'DEC']);
    const correcta = calc.cuadrados(pedido);
    const variables = { d: { nombre: 'ángulo entre lado y diagonal (45°)', color: 'o' }, r: { nombre: 'ángulo recto', color: 'i' }, x: { nombre: `ángulo ${pedido}`, color: 'd' } };
    const sol = {
      BCE: [['La diagonal AC forma ', v('d', '45°'), ' con el lado BC: ángulo BCA = 45°.'], ['ACEF es cuadrado: ángulo ACE = ', v('r', '90°'), '.'], ['BCE = BCA + ACE = 45° + 90° = ', v('x', '135°'), '.']],
      BDE: [['El centro del cuadrado ACEF está a la distancia AC/√2 de A y de C, y desde él AC se ve con ángulo recto. D cumple lo mismo (DA = DC = AC/√2 y el ángulo ADC es recto): D es el centro de ACEF.'], ['Así A, D y E están alineados (D es el punto medio de la diagonal AE) y el ángulo CDE es ', v('r', '90°'), '.'], ['El ángulo BDC mide ', v('d', '45°'), ' (la diagonal BD con el lado DC). BDE = BDC + CDE = 45° + 90° = ', v('x', '135°'), '.']],
      CDE: [['En el cuadrado ACEF, su centro es el punto medio de la diagonal AE y de la diagonal CF; está a distancia AC/√2 de A y de C, con ángulo recto entre ellos.'], ['D cumple lo mismo: DA = DC = AC/√2 y el ángulo ADC es recto. D es el centro del cuadrado ACEF.'], ['Las diagonales de un cuadrado son perpendiculares: CDE = ', v('r', '90°'), ' = ', v('x', '90°'), '.']],
      DEC: [['D es el centro del cuadrado ACEF (DA = DC = AC/√2 y el ángulo ADC es recto), así que ED es media diagonal de ACEF.'], ['La diagonal de un cuadrado forma ', v('d', '45°'), ' con cada lado.'], ['DEC = ', v('x', '45°'), '.']],
    }[pedido];
    const errores = {
      BCE: [h('CS-solo-recto', 90, 'Tomaste solo el ángulo recto ACE de la hoja grande. Falta el ángulo BCA entre el lado y la diagonal de la hoja pequeña.'), h('CS-solo-diagonal', 45, 'Tomaste solo el ángulo BCA. Falta sumar el ángulo recto ACE.'), h('CS-dos-rectos', 180, 'Tomaste el ángulo BCA como recto. La diagonal AC forma 45° con el lado BC, no 90°.'), h('CS-equilatero', 60, 'Supusiste que las hojas forman un triángulo equilátero. No hay ningún triángulo equilátero: los ángulos salen de 45° y 90°.')],
      BDE: [h('CS-solo-recto', 90, 'Tomaste solo el ángulo CDE. Falta sumar el ángulo BDC entre la diagonal BD y el lado DC.'), h('CS-solo-diagonal', 45, 'Tomaste solo el ángulo BDC. Falta sumar el ángulo recto CDE.'), h('CS-alineados', 180, 'Supusiste que B, D y E están alineados. Los alineados son A, D y E.'), h('CS-equilatero', 60, 'Supusiste un triángulo equilátero. Los ángulos salen de 45° y 90°.')],
      CDE: [h('CS-solo-diagonal', 45, 'Ese es el ángulo entre un lado y una diagonal. D es el centro de la hoja grande, y en el centro las diagonales forman 90°.'), h('CS-dos-angulos', 135, 'Sumaste 45° de más. D es el centro de la hoja grande: DC y DE son medias diagonales perpendiculares.'), h('CS-equilatero', 60, 'Supusiste un triángulo equilátero CDE. Es isósceles rectángulo.'), h('CS-tres-partes', 120, 'Repartiste la vuelta en tres partes iguales alrededor de D. Alrededor del centro de un cuadrado hay cuatro ángulos rectos.')],
      DEC: [h('CS-solo-recto', 90, 'Ese es el ángulo CEF de la hoja grande. ED es media diagonal: forma 45° con el lado EC.'), h('CS-dos-angulos', 135, 'Sumaste el ángulo recto y el de 45°. Se pide solo el ángulo entre la media diagonal ED y el lado EC.'), h('CS-equilatero', 60, 'Supusiste un triángulo equilátero DEC. Es isósceles rectángulo.'), h('CS-mitad', 22.5, 'Partiste 45° por la mitad. La diagonal de un cuadrado parte el ángulo recto en dos de 45°.')],
    }[pedido];
    return {
      variables, unidad: '°', correcta, errores, texto: g, filtro: x => x < 180 + 1e-9,
      enunciado: ['Una hoja de papel cuadrada ABCD (vértices en sentido antihorario) está sobre la mesa. Sobre su diagonal AC, tomada como lado, se coloca otra hoja cuadrada ACEF, más grande, que queda del mismo lado de AC que el vértice D.'],
      pregunta: [`¿Cuánto mide el ángulo ${pedido}?`],
      solucion: sol,
      datos: { tipo: 'cuadrados', pedido },
    };
  }

  return { id: 'geo-poligonos', titulo: 'Polígonos regulares, trapecios y cuadriláteros', generar, calc, TIPOS };
});
