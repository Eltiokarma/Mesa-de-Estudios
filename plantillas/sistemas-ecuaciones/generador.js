/*
 * Generador «Sistemas, raíces y potencias» (álgebra: sistemas de ecuaciones y temas vecinos).
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['sistemas-ecuaciones']) y en Node (require). No usa ningún motor: toda la
 * matemática está aquí, con enteros y fracciones exactas (P.frac).
 *
 * Tipos (y qué fila del grupo cubre cada uno, por su campo «falta»):
 *   trabajo         (sub propia | pago) dos albañiles que trabajan en su casa y en la del otro, con
 *                   tarifas distintas y deudas que se equilibran: jornadas en la casa propia, o lo que
 *                   uno le debía al otro. Cubre «planteo de intercambio de trabajo con pagos equilibrados».
 *   enteros         (sub maximo | cuantas) dos ecuaciones (cantidad y precio) con tres incógnitas enteras
 *                   positivas: el mayor valor de una, o cuántas soluciones hay. Cubre «sistemas con más
 *                   incógnitas que ecuaciones y soluciones enteras positivas».
 *   parametro       (sub suma | diferencia | unica) x ± y = S, x·y = um + w: valores de m sin soluciones
 *                   reales (intervalo) o con una sola solución. Cubre «sistemas no lineales y condición de
 *                   raíces no reales».
 *   vieta           (sub rectangulo | cuadrados | inversas | desplazadas) la ecuación de segundo grado con
 *                   raíces dadas por suma y producto: lados de un rectángulo con área y perímetro, o x₁²,
 *                   1/x₁, x₁ + k a partir de otra ecuación. Cubre «construir la cuadrática a partir de suma y
 *                   producto de raíces» (las dos filas).
 *   franja          (sub perimetro | ancho) una vereda de ancho fijo alrededor de un jardín rectangular:
 *                   perímetro del jardín (ecuación lineal) o ancho de la vereda (cuadrática). Cubre
 *                   «planteo con áreas de una franja alrededor de un rectángulo».
 *   exponencial     (sub resta | razon) aˣ·bʸ = pᴺ con a y b potencias de p, más una condición lineal: x·y,
 *                   x + y o x. Cubre «ecuaciones exponenciales con dos variables resueltas por leyes de
 *                   exponentes».
 *   vandermonde     (sub variable | determinante) x + y + z = 1, ax + by + cz = d, a²x + b²y + c²z = d²:
 *                   una incógnita por Cramer, o el determinante del sistema. Cubre «determinante de
 *                   Vandermonde dentro de la regla de Cramer».
 *   matriz          (sub entrada | traza) potencias de una matriz triangular 2 × 2: un elemento de Aⁿ, o la
 *                   traza de A + A² + ⋯ + Aⁿ. Cubre «potencias de una matriz por inducción y su traza».
 *   valor-absoluto  P(t) = c ∓ a·|t − k| con a hallado con un dato: el valor en otra semana. Cubre «evaluar
 *                   funciones con valor absoluto en contexto».
 *
 * Respuestas: números (armar) en trabajo, enteros, franja, exponencial, matriz y valor-absoluto; texto
 * (armarTexto, clave canónica) en parametro (intervalos ⟨a; b] o fracciones), vieta (ecuación con
 * coeficientes enteros primitivos y principal positivo) y vandermonde (fracciones).
 * Errores: AL8, AL19, AL22 y AL28 (parciales) de docs/investigacion/algebra-funciones-ideas-erroneas.md;
 * MT1, MT6, MT27, MT29, MT30, MT31 de docs/investigacion/matematica-avanzada-ideas-erroneas.md (hipótesis);
 * los demás, hipótesis nuestras sacadas de docs/clasificacion/trampas-admision-unmsm/aritmetica-algebra.md
 * (trampas 33, 37, 38, 40, 41 y 53).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'sistemas-ecuaciones';
  const AL = 'docs/investigacion/algebra-funciones-ideas-erroneas.md';
  const MTF = 'docs/investigacion/matematica-avanzada-ideas-erroneas.md';
  const v = P.v;
  const MENOS = '−';
  // Error numérico (armar) y error de texto (armarTexto).
  const h = (id, valor, explicacion, respaldo = 'hipotesis', fuente = null) => ({ id, valor, explicacion, respaldo, fuente });
  const ht = (id, r, explicacion, respaldo = 'hipotesis', fuente = null) => (r ? { id, clave: r.clave, texto: r.texto, explicacion, respaldo, fuente } : null);
  const f = x => P.formatear(x, 2);
  const ent = n => (n < 0 ? MENOS : '') + Math.abs(n);
  const par = n => (n < 0 ? `(${ent(n)})` : String(n));
  const corto = x => Number.isFinite(x) && Math.abs(x * 100 - Math.round(x * 100)) < 1e-7 && Math.abs(x) < 1e7;
  const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
  const mcm = (a, b) => Math.abs(a * b) / (mcd(a, b) || 1);
  const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', '-': '⁻', x: 'ˣ', y: 'ʸ', '+': '⁺', ' ': '' };
  const sup = n => String(n).split('').map(c => SUP[c]).join('');

  // ---- Fracciones exactas ----
  const Q = (n, d = 1) => P.frac(n, d);
  const sum = (a, b) => Q(a.n * b.d + b.n * a.d, a.d * b.d);
  const res = (a, b) => Q(a.n * b.d - b.n * a.d, a.d * b.d);
  const mul = (a, b) => Q(a.n * b.n, a.d * b.d);
  const div = (a, b) => Q(a.n * b.d, a.d * b.n);
  const neg = a => Q(-a.n, a.d);
  const tf = q => P.textoFraccion(q);
  const parF = q => (q.n < 0 ? `(${tf(q)})` : tf(q));
  const numero = q => { const r = Q(q); return { clave: `num:${r.n}/${r.d}`, texto: tf(r) }; };

  // «2x − y + 3z», «x² − 11x + 24», «m − 3»: términos [coeficiente entero, letra] ('' es la constante).
  function poli(terms) {
    let t = '';
    for (const [c, s] of terms) {
      if (c === 0) continue;
      const abs = Math.abs(c), cuerpo = s ? (abs === 1 ? '' : abs) + s : String(abs);
      t += t === '' ? (c < 0 ? MENOS : '') + cuerpo : (c < 0 ? ' − ' : ' + ') + cuerpo;
    }
    return t || '0';
  }

  // Ecuación ax² + bx + c = 0 con enteros primitivos y a > 0 (clave canónica).
  function ecuacion(A, B, C) {
    if (A === 0) return null;
    const g = mcd(mcd(A, B), C) * (A < 0 ? -1 : 1);
    [A, B, C] = [A / g + 0, B / g + 0, C / g + 0];
    return { clave: `ec:${A},${B},${C}`, texto: poli([[A, 'x²'], [B, 'x'], [C, '']]) + ' = 0', coef: [A, B, C] };
  }
  // x² − s·x + p = 0 con s y p fracciones.
  function desdeSumaProducto(s, p) {
    const L = mcm(s.d, p.d);
    return ecuacion(L, -s.n * (L / s.d), p.n * (L / p.d));
  }

  // Intervalo: lo y hi fracciones o null (infinito); cl y ch dicen si el extremo es cerrado.
  function intervalo(lo, hi, cl = false, ch = false) {
    const clave = 'int:' + (lo ? `${cl ? '[' : '('}${lo.n}/${lo.d}` : '(-inf') + ';' + (hi ? `${hi.n}/${hi.d}${ch ? ']' : ')'}` : 'inf)');
    const texto = (lo ? (cl ? '[' : '⟨') + tf(lo) : '⟨−∞') + '; ' + (hi ? tf(hi) + (ch ? ']' : '⟩') : '+∞⟩');
    return { clave, texto };
  }

  const SUBS = { trabajo: ['propia', 'propia', 'pago'], enteros: ['maximo', 'cuantas'], parametro: ['suma', 'suma', 'diferencia', 'unica'],
    vieta: ['rectangulo', 'cuadrados', 'inversas', 'desplazadas'], franja: ['perimetro', 'perimetro', 'ancho'], exponencial: ['resta', 'razon'],
    vandermonde: ['variable', 'variable', 'determinante'], matriz: ['entrada', 'traza'] };
  const TIPOS = ['trabajo', 'enteros', 'parametro', 'parametro', 'vieta', 'vieta', 'franja', 'exponencial', 'vandermonde', 'matriz', 'valor-absoluto'];

  function generar(semilla) {
    const rng = Azar.crear(ID + '|' + semilla);
    const tipo = rng.elegir(TIPOS);
    const sub = SUBS[tipo] ? rng.elegir(SUBS[tipo]) : null;   // el sub se fija antes de los reintentos
    for (let intento = 0; intento < 5000; intento++) {
      const pr = construir(rng, semilla, tipo, sub);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  function construir(rng, semilla, tipo, sub) {
    if (tipo === 'trabajo') return trabajo(rng, semilla, sub);
    if (tipo === 'enteros') return enteros(rng, semilla, sub);
    if (tipo === 'parametro') return parametro(rng, semilla, sub);
    if (tipo === 'vieta') return vieta(rng, semilla, sub);
    if (tipo === 'franja') return franja(rng, semilla, sub);
    if (tipo === 'exponencial') return exponencial(rng, semilla, sub);
    if (tipo === 'vandermonde') return vandermonde(rng, semilla, sub);
    if (tipo === 'matriz') return matriz(rng, semilla, sub);
    return valorAbsoluto(rng, semilla);
  }

  function cerrar(rng, semilla, o) {
    let alternativas, valor, texto;
    if (o.textos) {
      alternativas = P.armarTexto({ correcta: o.correcta, errores: o.errores.filter(Boolean), rng });
      valor = o.correcta.clave; texto = o.correcta.texto;
    } else {
      const errores = o.errores.filter(e => e && (o.enteros ? Number.isInteger(e.valor) : corto(e.valor)));
      alternativas = P.armar({ correcta: o.correcta, errores, rng, texto: o.texto, negativos: !!o.negativos });
      valor = o.correcta; texto = (o.texto || (x => f(x)))(o.correcta);
    }
    return {
      id: `${ID}#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion, respuesta: { valor, texto, unidad: o.unidad || '' }, _datos: o.datos,
    };
  }

  // ======================= trabajo: jornadas cruzadas con deudas que se equilibran =======================
  const PAREJAS = [['Rosa', 'Javier'], ['Nilda', 'Óscar'], ['Elena', 'Wilber'], ['Carmen', 'Rubén'], ['Yolanda', 'Percy']];
  const TARIFAS = [[80, 100], [90, 120], [100, 120], [100, 150], [60, 90], [80, 120], [120, 150], [60, 80]];
  function trabajo(rng, semilla, sub) {
    const [A, B] = rng.elegir(PAREJAS);
    let [a, b] = rng.elegir(TARIFAS);
    if (rng.moneda()) [a, b] = [b, a];
    const g = mcd(a, b), t = rng.entero(1, 3);
    const r = t * b / g, j = t * a / g;   // r: jornadas de A en casa de B; j: de B en casa de A (a·r = b·j)
    const x = rng.entero(2, 12);          // jornadas de A en su propia casa
    const T = x + r, H = x + j;
    if (T > 40) return null;
    const variables = { T: { nombre: `jornadas de ${A} en total`, color: 'o' }, H: { nombre: `jornadas en la casa de ${A}`, color: 'i' },
      x: { nombre: 'lo que se pide', color: 'd' } };
    const enunciado = [`${A} y ${B} son albañiles y se ayudaron a construir sus casas: cada uno trabajó algunas jornadas en su propia casa y otras en la casa del otro. ${A} trabajó `,
      v('T', `${T} jornadas`), ` en total, entre las dos casas. En la casa de ${A} se trabajaron `, v('H', `${H} jornadas`),
      ', sumando las de los dos. Por cada jornada en la casa del otro, ', `${A} cobra S/ ${a} y ${B} cobra S/ ${b}`,
      `. Al hacer cuentas, lo que ${A} le debía a ${B} era justo lo que ${B} le debía a ${A}.`];
    const D = T - H, ra = b / g, ja = a / g;
    const solucion = [
      [`Llama r a las jornadas de ${A} en la casa de ${B}, j a las de ${B} en la casa de ${A}, y x a las de ${A} en su propia casa.`],
      [`${A} trabajó en total x + r = `, v('T', String(T)), `; en la casa de ${A} se trabajó x + j = `, v('H', String(H)), '. Restando: r − j = ', `${T} − ${H} = ${ent(D)}.`],
      [`Deudas iguales: ${A} le debe a ${B} ${b}·j y ${B} le debe a ${A} ${a}·r. Entonces `, `${a}·r = ${b}·j, o sea r/j = ${ra}/${ja}: r = ${ra}k y j = ${ja}k.`],
      [`r − j = ${ra}k − ${ja}k = ${poli([[ra - ja, 'k']])} = ${ent(D)}, así que k = ${t}: r = ${r} y j = ${j}.`],
    ];
    let correcta, errores, pregunta;
    if (sub === 'propia') {
      correcta = x;
      pregunta = ['¿Cuántas ', v('x', `jornadas trabajó ${A} en su propia casa`), '?'];
      solucion.push([`x = ${T} − ${r} = `, v('x', `${x} jornadas`), ` (comprueba: x + j = ${x} + ${j} = ${H}).`]);
      const r1 = b * H / a, r2 = a * T / b;
      errores = [
        h('trabajo-sin-casa-propia', T - r1, `Tomaste las ${H} jornadas de la casa de ${A} como si todas fueran de ${B}. En esa casa también trabajó ${A}: esas ${H} jornadas son las de ${A} más las de ${B}.`),
        h('trabajo-sin-casa-propia', H - r2, `Tomaste las ${T} jornadas de ${A} como si todas fueran en la casa de ${B}. ${A} también trabajó en su casa: sus ${T} jornadas se reparten entre las dos casas.`),
        h('responde-otra-cantidad', r, `Esas son las jornadas de ${A} en la casa de ${B}. Se pregunta por las que trabajó en su propia casa.`),
        h('responde-otra-cantidad', j, `Esas son las jornadas de ${B} en la casa de ${A}. Se pregunta por las de ${A} en su propia casa.`),
      ];
    } else {
      correcta = b * j;
      pregunta = ['¿Cuánto ', v('x', `le debía ${A} a ${B}`), ', en soles, antes de cancelar las cuentas?'];
      solucion.push([`${A} le debía a ${B} sus ${j} jornadas a S/ ${b}: ${b} · ${j} = `, v('x', `S/ ${b * j}`), ` (lo mismo que ${a} · ${r}).`]);
      errores = [
        h('tarifa-cruzada', a * j, `Multiplicaste las jornadas de ${B} por la tarifa de ${A}. Cada jornada se paga con la tarifa de quien la trabaja: ${B} cobra S/ ${b}.`),
        h('tarifa-cruzada', b * r, `Multiplicaste las jornadas de ${A} en la casa de ${B} por la tarifa de ${B}. Lo que ${A} debe son las jornadas de ${B} en su casa, a la tarifa de ${B}.`),
        h('trabajo-sin-casa-propia', b * H, `Tomaste las ${H} jornadas de la casa de ${A} como si todas fueran de ${B}. En esa casa también trabajó ${A}, y esas jornadas no se le pagan a nadie.`),
        h('suma-de-deudas', 2 * b * j, `Sumaste las dos deudas. Se pregunta solo lo que ${A} le debía a ${B}.`),
      ];
    }
    return cerrar(rng, semilla, { correcta, errores, enteros: true, texto: sub === 'pago' ? (y => `S/ ${f(y)}`) : (y => `${f(y)} ${y === 1 ? 'jornada' : 'jornadas'}`),
      unidad: sub === 'pago' ? 'soles' : 'jornadas', variables, enunciado, pregunta, solucion, datos: { tipo: 'trabajo', sub, a, b, T, H } });
  }

  // ======================= enteros: dos ecuaciones, tres incógnitas enteras positivas =======================
  // [plural, singular, «los»/«las»] de cada artículo, y el lugar.
  const COSAS = [[['cuadernos', 'cuaderno', 'los'], ['lapiceros', 'lapicero'], ['borradores', 'borrador'], 'una librería'],
    [['polos', 'polo', 'los'], ['gorras', 'gorra'], ['pares de medias', 'par de medias'], 'una tienda del mercado'],
    [['cuadernos', 'cuaderno', 'los'], ['reglas', 'regla'], ['lápices', 'lápiz'], 'un bazar de Juliaca'],
    [['chompas', 'chompa', 'las'], ['chalinas', 'chalina'], ['pares de guantes', 'par de guantes'], 'una feria de Puno']];
  const cuantos = (n, [pl, sg]) => `${f(n)} ${n === 1 ? sg : pl}`;
  function soluciones(p, q, r, N, S, minimo = 1) {
    const sols = [], K = S - r * N;
    for (let x = minimo; x <= N; x++) {
      const resto = K - (p - r) * x;
      if (resto < (q - r) * minimo || resto % (q - r) !== 0) continue;
      const y = resto / (q - r), z = N - x - y;
      if (z >= minimo) sols.push([x, y, z]);
    }
    return sols;
  }
  function enteros(rng, semilla, sub) {
    const [o1, o2, o3, lugar] = rng.elegir(COSAS);
    const [c1, c2, c3] = [o1[0], o2[0], o3[0]];
    const r = rng.entero(1, 3), q = r + rng.entero(1, 3), p = q + rng.entero(1, 4);
    const N = rng.entero(8, 24);
    const x0 = rng.entero(1, N - 2), y0 = rng.entero(1, N - x0 - 1), z0 = N - x0 - y0;
    const S = p * x0 + q * y0 + r * z0;
    const sols = soluciones(p, q, r, N, S);
    if (sols.length < 2 || sols.length > 6) return null;
    const variables = { N: { nombre: 'cantidad de artículos', color: 'o' }, S: { nombre: 'dinero pagado', color: 'i' }, x: { nombre: 'lo que se pide', color: 'd' } };
    const enunciado = [`En ${lugar}, Pedro compró `, v('N', `${N} artículos`), ` entre ${c1}, ${c2} y ${c3}, y pagó `, v('S', `S/ ${S}`), `. Cada ${o1[1]} costó S/ ${p}; cada ${o2[1]}, S/ ${q}, y cada ${o3[1]}, S/ ${r}. Compró por lo menos uno de cada tipo.`];
    const K = S - r * N, dp = p - r, dq = q - r;
    const solucion = [
      [`Con x ${c1}, y ${c2} y z ${c3}: x + y + z = `, v('N', String(N)), ' y ', poli([[p, 'x'], [q, 'y'], [r, 'z']]), ' = ', v('S', String(S)), '.'],
      [`${r === 1 ? 'Resta la primera ecuación a la segunda' : `A la segunda ecuación réstale ${r} veces la primera`}: ${poli([[dp, 'x'], [dq, 'y']])} = ${S} − ${r * N} = ${K}.`],
      [`Prueba x = 1, 2, 3…: y tiene que salir entero y z = ${N} − x − y tiene que ser por lo menos 1. Las compras posibles (x; y; z) son ${sols.map(s => `(${s.join('; ')})`).join(', ')}.`],
    ];
    const ceros = soluciones(p, q, r, N, S, 0);
    let correcta, errores, pregunta, texto;
    if (sub === 'maximo') {
      const max = sols[sols.length - 1];
      correcta = max[0];
      texto = y => cuantos(y, o1);
      pregunta = ['¿Cuál es la ', v('x', `mayor cantidad de ${c1}`), ' que pudo comprar?'];
      solucion.push(['La mayor x es ', v('x', cuantos(correcta, o1)), ` (con ${cuantos(max[1], o2)} y ${cuantos(max[2], o3)}).`]);
      errores = [
        h('enteros-con-cero', Math.max(...ceros.map(s => s[0])), `Aceptaste compras con 0 ${c2} o 0 ${c3}. El enunciado dice que compró por lo menos uno de cada tipo.`),
        h('enteros-minimo', sols[0][0], `Esa es la menor cantidad posible de ${c1}, no la mayor.`),
        h('enteros-solo-dinero', Math.floor((S - q - r) / p), `Usaste solo el dinero: un artículo de cada uno de los otros, el resto en ${c1}, y te quedaste con la parte entera de ${S - q - r}/${p}. Pero también tienen que ser ${N} artículos en total.`),
        h('responde-otra-cantidad', max[1], `Esa es la cantidad de ${c2} en esa compra. Se pregunta por ${o1[2]} ${c1}.`),
      ];
    } else {
      correcta = sols.length;
      texto = y => `${f(y)}`;
      pregunta = ['¿De ', v('x', 'cuántas maneras distintas'), ' pudo hacer la compra?'];
      solucion.push(['Hay ', v('x', String(correcta)), ' maneras.']);
      let candidatos = 0;
      for (let xx = 1; K - dp * xx >= dq; xx++) candidatos++;
      const sinZ = [];
      for (let xx = 1; K - dp * xx >= dq; xx++) if ((K - dp * xx) % dq === 0) sinZ.push(xx);
      errores = [
        h('enteros-con-cero', ceros.length, `Contaste también compras con 0 de algún artículo. El enunciado dice que compró por lo menos uno de cada tipo.`),
        h('enteros-sin-comprobar', candidatos, 'Contaste todos los valores de x que dejan y positivo, sin comprobar que y salga entero ni que z sea por lo menos 1.'),
        h('enteros-olvida-una-condicion', sinZ.length, `Comprobaste que x e y salgan enteros y positivos, pero no que z = ${N} − x − y sea por lo menos 1.`),
        h('responde-otra-cantidad', sols[sols.length - 1][0], `Esa es la mayor cantidad de ${c1}. Se pregunta de cuántas maneras pudo hacer la compra.`),
      ];
    }
    return cerrar(rng, semilla, { correcta, errores, enteros: true, texto, unidad: sub === 'maximo' ? c1 : '', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'enteros', sub, p, q, r, N, S } });
  }

  // ======================= parametro: x ± y = S, x·y = um + w =======================
  function parametro(rng, semilla, sub) {
    const u = rng.elegir([1, 1, 2, 3]), w = rng.entero(-6, 6);
    const S = rng.entero(2, 9);
    const prod = poli([[u, 'm'], [w, '']]);
    const umbral = k => div(res(k, Q(w)), Q(u));   // m tal que um + w = k
    const variables = { S: { nombre: sub === 'diferencia' ? 'diferencia' : 'suma', color: 'o' }, k: { nombre: 'producto', color: 'i' }, m: { nombre: 'parámetro', color: 'd' } };
    const enunciado = ['Se tiene el sistema ', v('S', sub === 'diferencia' ? `x − y = ${S}` : `x + y = ${S}`), ' ; ', v('k', `x·y = ${prod}`), ', donde m es un número real.'];
    const S2 = S * S;
    const ladoK = `${u === 1 && w === 0 ? 'm' : prod}`;
    let correcta, errores, pregunta, solucion;
    if (sub === 'suma' || sub === 'unica') {
      const m0 = umbral(Q(S2, 4));
      solucion = [
        ['De la primera, y = ', `${S} − x. En la segunda: x(${S} − x) = ${ladoK}, o sea x² − ${S}x + (${ladoK}) = 0.`],
        [`Cada raíz real x da una solución (x; ${S} − x). Esa ecuación tiene discriminante Δ = ${S}² − 4(${ladoK}) = ${S2} − 4(${ladoK}).`],
      ];
      if (sub === 'suma') {
        correcta = intervalo(m0, null);
        pregunta = ['¿Para qué valores de ', v('m', 'm'), ' el sistema no tiene ninguna solución (x; y) con x e y reales?'];
        solucion.push([`No hay raíces reales cuando Δ < 0: ${ladoK} > ${tf(Q(S2, 4))}, o sea m > ${tf(m0)}.`], ['m ∈ ', v('m', correcta.texto), '.']);
        errores = [
          ht('T40-discriminante-positivo', intervalo(null, m0), 'Pediste Δ > 0. Con Δ > 0 la ecuación tiene dos raíces reales y el sistema sí tiene soluciones reales; sin soluciones reales es Δ < 0.'),
          ht('extremo-incluido', intervalo(m0, null, true), `Incluiste m = ${tf(m0)}. Con ese valor Δ = 0 y hay una solución real (x = y = ${tf(Q(S, 2))}).`),
          ht('discriminante-sin-4', intervalo(umbral(Q(S2)), null), `Olvidaste el 4: escribiste Δ = ${S2} − (${ladoK}). El término independiente va multiplicado por 4: Δ = ${S2} − 4(${ladoK}).`),
          ht('responde-el-complemento', intervalo(null, m0, false, true), 'Ese es el conjunto donde el sistema sí tiene soluciones reales (Δ ≥ 0): justo lo contrario de lo que se pide.'),
        ];
      } else {
        correcta = numero(m0);
        pregunta = ['¿Para qué valor de ', v('m', 'm'), ' el sistema tiene una sola solución real (x; y)?'];
        solucion.push([`Si Δ > 0 hay dos soluciones (los valores de x e y se intercambian); una sola cuando Δ = 0: ${ladoK} = ${tf(Q(S2, 4))}, con x = y = ${tf(Q(S, 2))}.`], ['m = ', v('m', correcta.texto), '.']);
        errores = [
          ht('discriminante-sin-4', numero(umbral(Q(S2))), `Olvidaste el 4: escribiste Δ = ${S2} − (${ladoK}). El término independiente va multiplicado por 4: Δ = ${S2} − 4(${ladoK}).`),
          ht('discriminante-entre-2', numero(umbral(Q(S2, 2))), `Dividiste ${S2} entre 2. De ${S2} − 4(${ladoK}) = 0 sale ${ladoK} = ${S2}/4.`),
          ht('discriminante-signo-de-c', numero(umbral(Q(-S2, 4))), `Pusiste Δ = b² + 4c. El término independiente es ${ladoK}, con su signo: Δ = ${S2} − 4(${ladoK}).`),
          ht('responde-otra-cantidad', numero(Q(S, 2)), `Ese es el valor de x (y de y) en la solución única, no el de m.`),
        ];
      }
    } else {
      const m0 = umbral(Q(-S2, 4));
      correcta = intervalo(null, m0);
      pregunta = ['¿Para qué valores de ', v('m', 'm'), ' el sistema no tiene ninguna solución (x; y) con x e y reales?'];
      solucion = [
        [`De la primera, x = y + ${S}. En la segunda: (y + ${S})y = ${ladoK}, o sea y² + ${S}y − (${ladoK}) = 0.`],
        [`Δ = ${S}² + 4(${ladoK}). No hay raíces reales cuando Δ < 0: ${ladoK} < ${tf(Q(-S2, 4))}, o sea m < ${tf(m0)}.`],
        ['m ∈ ', v('m', correcta.texto), '.'],
      ];
      errores = [
        ht('T40-discriminante-positivo', intervalo(m0, null), 'Pediste Δ > 0. Con Δ > 0 hay dos raíces reales y el sistema sí tiene soluciones reales; sin soluciones reales es Δ < 0.'),
        ht('extremo-incluido', intervalo(null, m0, false, true), `Incluiste m = ${tf(m0)}. Con ese valor Δ = 0 y hay una solución real.`),
        ht('vieta-diferencia-como-suma', intervalo(umbral(Q(S2, 4)), null), `Usaste t² − ${S}t + (${ladoK}) = 0, como si x − y = ${S} fuera una suma. Con x − y = ${S}, al reemplazar x = y + ${S} queda y² + ${S}y − (${ladoK}) = 0: cambian de signo el término en y y el independiente.`),
        ht('discriminante-sin-4', intervalo(null, umbral(Q(-S2))), `Olvidaste el 4: escribiste Δ = ${S2} + (${ladoK}). El término independiente va multiplicado por 4: Δ = ${S2} + 4(${ladoK}).`),
      ];
    }
    return cerrar(rng, semilla, { textos: true, correcta, errores, variables, enunciado, pregunta, solucion, datos: { tipo: 'parametro', sub, S, u, w } });
  }

  // ======================= vieta: la ecuación por suma y producto =======================
  function vieta(rng, semilla, sub) {
    const variables = { E: { nombre: 'ecuación dada', color: 'o' }, s: { nombre: 'suma de raíces', color: 'i' }, p: { nombre: 'producto de raíces', color: 'h' }, x: { nombre: 'ecuación pedida', color: 'd' } };
    let correcta, errores, enunciado, pregunta, solucion, datos, k = null;
    const sp = (s, p) => desdeSumaProducto(s, p);
    if (sub === 'rectangulo') {
      const L = rng.entero(3, 16), W = rng.entero(2, 12);
      if (L <= W) return null;
      const A = L * W, Pm = 2 * (L + W), s = L + W;
      variables.s.nombre = 'perímetro'; variables.p.nombre = 'área'; delete variables.E;
      enunciado = ['Un terreno rectangular tiene ', v('p', `${A} m²`), ' de área y ', v('s', `${Pm} m`), ' de perímetro.'];
      pregunta = ['¿Cuál de estas ecuaciones tiene como ', v('x', 'raíces el largo y el ancho'), ' del terreno (en metros)?'];
      correcta = sp(Q(s), Q(A));
      solucion = [
        ['El perímetro tiene dos largos y dos anchos: largo + ancho = ', v('s', String(Pm)), `/2 = ${s}.`],
        ['largo · ancho = ', v('p', String(A)), '.'],
        ['Dos números con suma s y producto p son las raíces de x² − s·x + p = 0: ', v('x', correcta.texto), ` (sus raíces son ${L} y ${W}).`],
      ];
      errores = [
        ht('T53-perimetro-como-suma', sp(Q(Pm), Q(A)), `Usaste el perímetro (${Pm}) como la suma del largo y el ancho. El perímetro suma dos largos y dos anchos: largo + ancho = ${Pm}/2.`),
        ht('vieta-signo-suma', ecuacion(1, s, A), 'En x² + bx + c = 0 la suma de raíces es −b: con suma positiva, el término en x va con signo menos.'),
        ht('vieta-suma-producto-cambiados', ecuacion(1, -A, s), 'Pusiste el producto donde va la suma y al revés. En x² − s·x + p = 0, el coeficiente de x es la suma.'),
        ht('vieta-signo-producto', ecuacion(1, -s, -A), 'En x² + bx + c = 0 el producto de raíces es c, con su signo: con producto positivo, c es positivo.'),
      ];
      datos = { tipo: 'vieta', sub, L, W };
    } else {
      const a = sub === 'inversas' ? rng.entero(1, 4) : 1;
      const b = rng.elegir([-7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7]), c = rng.elegir([-8, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6]);
      if (b * b - 4 * a * c <= 0) return null;
      const dada = ecuacion(a, b, c);
      if (!dada || dada.coef[0] !== a) return null;   // la dada se escribe tal cual (primitiva)
      const S0 = Q(-b, a), P0 = Q(c, a);
      enunciado = ['Las raíces de ', v('E', dada.texto), ' son x₁ y x₂.'];
      const base = [['Por Vieta: ', v('s', 'x₁ + x₂'), ` = ${tf(S0)} y `, v('p', 'x₁·x₂'), ` = ${tf(P0)}.`]];
      if (sub === 'cuadrados') {
        const s = Q(b * b - 2 * c), p = Q(c * c);
        correcta = sp(s, p);
        pregunta = ['¿Qué ecuación tiene como raíces ', v('x', 'x₁² y x₂²'), '?'];
        solucion = [...base,
          ['Suma nueva: x₁² + x₂² = (x₁ + x₂)² − 2x₁x₂ = ', `${par(-b)}² − 2·${par(c)} = ${tf(s)}.`],
          ['Producto nuevo: x₁²·x₂² = (x₁x₂)² = ', `${par(c)}² = ${tf(p)}.`],
          ['La ecuación: x² − (suma)x + (producto) = 0 → ', v('x', correcta.texto), '.']];
        errores = [
          ht('AL8-suma-de-cuadrados', sp(Q(b * b), p), 'Tomaste x₁² + x₂² como (x₁ + x₂)². Falta restar el doble producto: (x₁ + x₂)² = x₁² + 2x₁x₂ + x₂².', 'parcial', AL),
          ht('identidad-signo-del-doble-producto', sp(Q(b * b + 2 * c), p), 'Sumaste el doble producto en vez de restarlo: x₁² + x₂² = (x₁ + x₂)² − 2x₁x₂.'),
          ht('vieta-signo-suma', sp(neg(s), p), 'La suma nueva va con signo menos en el término en x: x² − (suma)x + (producto) = 0.'),
          ht('producto-sin-elevar', sp(s, Q(c)), 'Dejaste el producto como x₁·x₂. El producto de las nuevas raíces es x₁²·x₂² = (x₁x₂)².'),
        ];
      } else if (sub === 'inversas') {
        const s = Q(-b, c), p = Q(a, c);
        correcta = sp(s, p);
        pregunta = ['¿Qué ecuación tiene como raíces ', v('x', '1/x₁ y 1/x₂'), '?'];
        solucion = [...base,
          ['Suma nueva: 1/x₁ + 1/x₂ = (x₁ + x₂)/(x₁x₂) = ', `${tf(S0)} ÷ ${parF(P0)} = ${tf(s)}.`],
          ['Producto nuevo: 1/(x₁x₂) = ', `${tf(p)}.`],
          ['La ecuación: x² − (suma)x + (producto) = 0, con coeficientes enteros: ', v('x', correcta.texto), '.']];
        errores = [
          ht('vieta-signo-suma', sp(neg(s), p), 'La suma nueva va con signo menos en el término en x: x² − (suma)x + (producto) = 0.'),
          ht('inversa-de-la-suma', sp(div(Q(1), S0), p), 'Tomaste 1/x₁ + 1/x₂ como 1/(x₁ + x₂). Las fracciones se suman con denominador común: (x₁ + x₂)/(x₁x₂).'),
          ht('inversa-solo-producto', sp(S0, p), 'Invertiste el producto, pero dejaste la suma de las raíces viejas. La suma nueva es 1/x₁ + 1/x₂ = (x₁ + x₂)/(x₁x₂).'),
          ht('inversa-sin-invertir-producto', sp(s, P0), 'Dejaste el producto x₁·x₂. El producto nuevo es (1/x₁)(1/x₂) = 1/(x₁x₂).'),
        ];
      } else {
        k = rng.entero(1, 4);
        const s = Q(-b + 2 * k), p = Q(c - b * k + k * k);
        correcta = sp(s, p);
        pregunta = ['¿Qué ecuación tiene como raíces ', v('x', `x₁ + ${k} y x₂ + ${k}`), '?'];
        solucion = [...base,
          [`Suma nueva: (x₁ + ${k}) + (x₂ + ${k}) = (x₁ + x₂) + ${2 * k} = ${tf(s)}.`],
          [`Producto nuevo: (x₁ + ${k})(x₂ + ${k}) = x₁x₂ + ${k}(x₁ + x₂) + ${k * k} = ${par(c)} + ${k}·${par(-b)} + ${k * k} = ${tf(p)}.`],
          ['La ecuación: ', v('x', correcta.texto), '.']];
        errores = [
          ht('desplaza-una-vez', sp(Q(-b + k), p), `Sumaste ${k} una sola vez. Cada raíz aumenta en ${k}: la suma aumenta en ${2 * k}.`),
          ht('AL8-producto-sin-termino-cruzado', sp(s, Q(c + k * k)), `Multiplicaste (x₁ + ${k})(x₂ + ${k}) como x₁x₂ + ${k * k}: faltó el término ${k}(x₁ + x₂).`),
          ht('vieta-signo-suma', sp(neg(s), p), 'La suma nueva va con signo menos en el término en x: x² − (suma)x + (producto) = 0.'),
          ht('AL28-desplazamiento-contrario', sp(Q(-b - 2 * k), Q(c + b * k + k * k)), `Esa ecuación tiene raíces x₁ − ${k} y x₂ − ${k}: corriste las raíces hacia el otro lado.`, 'parcial', AL),
        ];
      }
      datos = { tipo: 'vieta', sub, a, b, c, ...(k ? { k } : {}) };
    }
    return cerrar(rng, semilla, { textos: true, correcta, errores, variables, enunciado, pregunta, solucion, datos });
  }

  // ======================= franja: vereda alrededor de un jardín =======================
  function raizPositiva(A, B, C) {   // raíz positiva de Ax² + Bx + C = 0 (A > 0, C < 0)
    const D = B * B - 4 * A * C;
    return (-B + Math.sqrt(D)) / (2 * A);
  }
  function franja(rng, semilla, sub) {
    const variables = { w: { nombre: 'ancho de la vereda', color: 'o' }, A: { nombre: 'área de la vereda', color: 'i' }, L: { nombre: 'medidas del jardín', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
    if (sub === 'perimetro') {
      delete variables.L;
      const w = rng.entero(1, 3), L = rng.entero(5, 20), W = rng.entero(3, 15);
      if (L < W || L + W <= 4 * w) return null;
      const A = 2 * w * (L + W) + 4 * w * w, Pj = 2 * (L + W);
      const enunciado = ['Alrededor de un jardín rectangular se construye una vereda de ', v('w', `${w} m`), ' de ancho, pegada a sus cuatro lados. La vereda ocupa ', v('A', `${A} m²`), '.'];
      const pregunta = ['¿Cuál es el ', v('x', 'perímetro del jardín'), '?'];
      const solucion = [
        ['Llama a y b al largo y al ancho del jardín. El terreno con la vereda mide (a + 2·', v('w', String(w)), ') por (b + 2·', v('w', String(w)), ').'],
        [`Área de la vereda = (a + ${2 * w})(b + ${2 * w}) − ab = ${2 * w}(a + b) + ${4 * w * w}: son cuatro tiras pegadas a los lados y cuatro esquinas de ${w} × ${w}.`],
        [`${2 * w}(a + b) + ${4 * w * w} = `, v('A', String(A)), ` → a + b = ${A - 4 * w * w}/${2 * w} = ${L + W}.`],
        ['Perímetro = 2(a + b) = ', v('x', `${Pj} m`), '.'],
      ];
      const errores = [
        h('T53-franja-sin-esquinas', A / w, `Tomaste la vereda como cuatro tiras de ${w} m pegadas a los lados, sin las cuatro esquinas de ${w} × ${w}.`),
        h('T53-esquinas-dos-veces', (A - 8 * w * w) / w, `Contaste las esquinas dos veces: tomaste dos tiras del largo + ${2 * w} y dos del ancho + ${2 * w}, y cada esquina entra en dos tiras.`),
        h('T53-semiperimetro', (A - 4 * w * w) / (2 * w), `${L + W} es el largo más el ancho. El perímetro tiene dos largos y dos anchos.`),
        h('responde-otra-cantidad', Pj + 8 * w, 'Ese es el perímetro del borde exterior de la vereda. Se pregunta por el del jardín.'),
      ];
      return cerrar(rng, semilla, { correcta: Pj, errores, texto: y => `${f(y)} m`, unidad: 'm', variables, enunciado, pregunta, solucion, datos: { tipo: 'franja', sub, w, A } });
    }
    const w = rng.elegir([0.5, 1, 1.5, 2, 2.5, 3]), L = rng.entero(4, 20), W = rng.entero(3, 15);
    if (L <= W) return null;
    const A = 2 * w * (L + W) + 4 * w * w;
    if (!corto(A)) return null;
    delete variables.w; variables.L = { nombre: 'largo del jardín', color: 'h' }; variables.W = { nombre: 'ancho del jardín', color: 'o' };
    const enunciado = ['Alrededor de un jardín rectangular de ', v('L', `${L} m`), ' por ', v('W', `${W} m`), ' se construye una vereda de ancho uniforme, pegada a sus cuatro lados. La vereda ocupa ', v('A', `${f(A)} m²`), '.'];
    const pregunta = ['¿Cuál es el ', v('x', 'ancho de la vereda'), '?'];
    const solucion = [
      ['Con ancho x, el terreno con la vereda mide (', v('L', String(L)), ' + 2x) por (', v('W', String(W)), ' + 2x).'],
      [`Área de la vereda = (${L} + 2x)(${W} + 2x) − ${L}·${W} = 4x² + ${2 * (L + W)}x.`],
      ['4x² + ', `${2 * (L + W)}x = `, v('A', f(A)), ` → la raíz positiva es x = ${f(w)} (la otra es negativa).`],
      ['Ancho: ', v('x', `${f(w)} m`), '.'],
    ];
    const errores = [
      h('T53-franja-sin-esquinas', A / (2 * (L + W)), 'Tomaste la vereda como cuatro tiras pegadas a los lados, sin las cuatro esquinas cuadradas.'),
      h('T53-esquinas-dos-veces', raizPositiva(8, 2 * (L + W), -A), `Contaste las esquinas dos veces (8x² en vez de 4x²): las tiras largas ya llegan hasta las esquinas.`),
      h('franja-un-solo-lado', raizPositiva(1, L + W, -A), `Sumaste x una sola vez a cada medida, (${L} + x)(${W} + x). La vereda está a los dos lados: cada medida crece 2x.`),
      h('responde-otra-cantidad', 2 * w, 'Ese es 2x: lo que crece cada medida con la vereda. El ancho de la vereda es la mitad.'),
      h('raiz-negativa-sin-signo', w + (L + W) / 2, `Ese número es la otra raíz sin su signo menos: la ecuación también tiene la raíz −${f(w + (L + W) / 2)}, que es negativa y no sirve como ancho.`),
    ];
    return cerrar(rng, semilla, { correcta: w, errores, texto: y => `${f(y)} m`, unidad: 'm', variables, enunciado, pregunta, solucion, datos: { tipo: 'franja', sub, L, W, A } });
  }

  // ======================= exponencial: aˣ·bʸ = pᴺ con una condición lineal =======================
  const BASES = { 2: [2, 3, 4, 5], 3: [2, 3, 4], 5: [2, 3] };   // exponentes de las bases (4 = 2², 8 = 2³…)
  // Resuelve α·x + β·y = γ con la condición (x − y = d, o x = k·y). Devuelve [x, y] enteros o null.
  function resolverCond(al, be, ga, sub, d) {
    let x, y;
    if (sub === 'resta') { const den = al + be; if (den === 0 || (ga - al * d) % den !== 0) return null; y = (ga - al * d) / den; x = y + d; }
    else { const den = al * d + be; if (den === 0 || ga % den !== 0) return null; y = ga / den; x = d * y; }
    return [x, y];
  }
  function exponencial(rng, semilla, sub) {
    const p = rng.elegir([2, 2, 3, 5]);
    const [m1, m2] = rng.barajar(BASES[p]).slice(0, 2);
    const y = rng.entero(1, 5), d = sub === 'resta' ? rng.elegir([-2, -1, 1, 2, 3]) : rng.elegir([2, 3]);
    const x = sub === 'resta' ? y + d : d * y;
    if (x < 1) return null;
    const N = m1 * x + m2 * y;
    if (N > 30) return null;
    const pide = rng.elegir(['xy', 'suma', 'x']);
    const Qv = ([a, b]) => (pide === 'xy' ? a * b : pide === 'suma' ? a + b : a);
    const a = p ** m1, b = p ** m2;
    const cond = sub === 'resta' ? (d > 0 ? `x − y = ${d}` : `y − x = ${-d}`) : `x = ${d}y`;
    const pideTxt = pide === 'xy' ? 'x·y' : pide === 'suma' ? 'x + y' : 'x';
    const variables = { E: { nombre: 'ecuación exponencial', color: 'o' }, c: { nombre: 'condición', color: 'i' }, x: { nombre: 'lo que se pide', color: 'd' } };
    const enunciado = ['Los números reales x e y cumplen ', v('E', `${a}ˣ · ${b}ʸ = ${p}${sup(N)}`), ' y ', v('c', cond), '.'];
    const pregunta = ['¿Cuánto vale ', v('x', pideTxt), '?'];
    const correcta = Qv([x, y]);
    const solucion = [
      [`Escribe todo en base ${p}: ${a} = ${p}${sup(m1)} y ${b} = ${p}${sup(m2)}, así que ${a}ˣ = ${p}${sup(m1)}ˣ y ${b}ʸ = ${p}${sup(m2)}ʸ (potencia de potencia: se multiplican los exponentes).`],
      ['Producto de igual base: se suman los exponentes: ', v('E', `${p}${sup(m1 + 'x+' + m2 + 'y')} = ${p}${sup(N)}`), ` → ${m1}x + ${m2}y = ${N}.`],
      ['Con ', v('c', cond), `: x = ${x} e y = ${y}.`],
      [v('x', pideTxt), ' = ', v('x', String(correcta)), '.'],
    ];
    const e1 = resolverCond(1, 1, N - m1 - m2, sub, d), e2 = resolverCond(1, 1, N, sub, d), e3 = (N % (m1 + m2) === 0) ? resolverCond(1, 1, N / (m1 + m2), sub, d) : null;
    const otra = pide === 'xy' ? x + y : pide === 'suma' ? x * y : y;
    const errores = [
      e1 && h('potencia-de-potencia-suma', Qv(e1), `Escribiste (${p}${sup(m1)})ˣ como ${p}${sup(m1 + '+x')}: en una potencia de potencia los exponentes se multiplican, no se suman.`),
      e2 && h('exponentes-sin-cambiar-base', Qv(e2), `Igualaste x + y = ${N} sin pasar ${a} y ${b} a base ${p}. Los exponentes solo se igualan cuando las bases son la misma.`),
      e3 && h('AL11-bases-multiplicadas', Qv(e3), `Juntaste ${p}${sup(m1)}ˣ · ${p}${sup(m2)}ʸ como ${p} elevado a ${m1 + m2}(x + y). Con bases iguales se suman los exponentes: ${m1}x + ${m2}y.`),
      h('responde-otra-cantidad', otra, `Ese es el valor de ${pide === 'xy' ? 'x + y' : pide === 'suma' ? 'x·y' : 'y'}. Se pregunta por ${pideTxt}.`),
    ];
    return cerrar(rng, semilla, { correcta, errores, enteros: true, negativos: true, texto: z => f(z), variables, enunciado, pregunta, solucion,
      datos: { tipo: 'exponencial', sub, p, m1, m2, N, d, pide } });
  }

  // ======================= vandermonde: Cramer con un determinante de Vandermonde =======================
  const det3 = M => M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) - M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0]) + M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0]);
  const conColumna = (M, j, col) => M.map((fila, i) => fila.map((x, k) => (k === j ? col[i] : x)));
  function vandermonde(rng, semilla, sub) {
    const [a, b, c, d] = rng.barajar([-3, -2, -1, 1, 2, 3, 4, 5]).slice(0, 4);
    const M = [[1, 1, 1], [a, b, c], [a * a, b * b, c * c]], col = [1, d, d * d];
    const D = det3(M);
    const nombres = ['x', 'y', 'z'];
    const variables = { S: { nombre: 'sistema', color: 'o' }, D: { nombre: 'determinante del sistema', color: 'i' }, Dv: { nombre: 'determinante de la incógnita', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
    const ecs = [poli([[1, 'x'], [1, 'y'], [1, 'z']]) + ' = 1', poli([[a, 'x'], [b, 'y'], [c, 'z']]) + ` = ${ent(d)}`, poli([[a * a, 'x'], [b * b, 'y'], [c * c, 'z']]) + ` = ${d * d}`];
    const enunciado = ['Se tiene el sistema ', v('S', ecs.join(' ; ')), '.'];
    const vdm = `(${ent(b)} − ${par(a)})(${ent(c)} − ${par(a)})(${ent(c)} − ${par(b)})`;
    const paso1 = [`Los coeficientes de x, y, z en la segunda ecuación son a = ${ent(a)}, b = ${ent(b)} y c = ${ent(c)}; en la tercera están sus cuadrados. El determinante del sistema es de Vandermonde: `, v(sub === 'determinante' ? 'x' : 'D', 'Δ'), ` = (b − a)(c − a)(c − b) = ${vdm} = ${ent(D)}.`];
    if (sub === 'determinante') { delete variables.D; delete variables.Dv; }
    let correcta, errores, pregunta, solucion;
    const sarrus = { p: M[0][0] * M[1][1] * M[2][2] + M[0][1] * M[1][2] * M[2][0] + M[0][2] * M[1][0] * M[2][1], s: M[0][2] * M[1][1] * M[2][0] + M[0][0] * M[1][2] * M[2][1] + M[0][1] * M[1][0] * M[2][2] };
    if (sub === 'determinante') {
      correcta = numero(Q(D));
      pregunta = ['¿Cuánto vale el ', v('x', 'determinante de la matriz de coeficientes'), ' del sistema?'];
      solucion = [paso1, ['Puedes comprobarlo con Sarrus: ', `${ent(sarrus.p)} − ${par(sarrus.s)} = `, v('x', ent(D)), '.']];
      errores = [
        ht('vandermonde-signo', numero(Q(-D)), 'Restaste al revés en los factores, (a − b)(a − c)(b − c): eso cambia el signo. Es (b − a)(c − a)(c − b), cada uno menos los anteriores.'),
        ht('MT27-solo-diagonal-principal', numero(Q(b * c * c)), 'Multiplicaste solo la diagonal principal. En un 3 × 3 se suman los productos de tres diagonales y se restan los de las otras tres.', 'hipotesis', MTF),
        ht('MT6-suma-seis-diagonales', numero(Q(sarrus.p + sarrus.s)), 'Sumaste los seis productos de Sarrus. Los de las diagonales que bajan a la izquierda se restan.', 'hipotesis', MTF),
        ht('vandermonde-sin-un-factor', numero(Q((b - a) * (c - a))), 'Te faltó el factor (c − b). En Vandermonde 3 × 3 entran las tres diferencias.'),
      ];
    } else {
      const i = rng.entero(0, 2);
      const Dv = det3(conColumna(M, i, col)), sig = (i + 1) % 3, Dsig = det3(conColumna(M, sig, col));
      correcta = numero(Q(Dv, D));
      const n = nombres[i];
      pregunta = ['¿Cuánto vale ', v('x', n), '?'];
      solucion = [paso1,
        ['Para ', n, ' se cambia su columna por (1; ', ent(d), '; ', String(d * d), '): sigue siendo de Vandermonde, con ', ent(d), ' en lugar de ', ent([a, b, c][i]), '. ', v('Dv', `Δ${n}`), ` = ${ent(Dv)}.`],
        ['Cramer: ', v('x', n), ' = ', v('Dv', `Δ${n}`), '/', v('D', 'Δ'), ` = ${ent(Dv)}/${par(D)} = `, v('x', correcta.texto), '.']];
      errores = [
        ht('MT29-sin-dividir', numero(Q(Dv)), `Te quedaste con Δ${n} y no dividiste entre Δ.`, 'hipotesis', MTF),
        Dv !== 0 ? ht('MT30-cociente-al-reves', numero(Q(D, Dv)), `Dividiste al revés: es Δ${n}/Δ, no Δ/Δ${n}.`, 'hipotesis', MTF) : null,
        ht('MT31-otra-columna', numero(Q(Dsig, D)), `Ese es el valor de ${nombres[sig]}: cambiaste otra columna. Para ${n} se reemplaza la columna de los coeficientes de ${n}.`, 'hipotesis', MTF),
        ht('vandermonde-signo', numero(Q(-Dv, D)), 'Uno de los dos determinantes te salió con el signo cambiado: al usar Vandermonde, cada factor es «el de la derecha menos el de la izquierda».'),
      ];
      return cerrar(rng, semilla, { textos: true, correcta, errores, variables, enunciado, pregunta, solucion, datos: { tipo: 'vandermonde', sub, a, b, c, d, i } });
    }
    return cerrar(rng, semilla, { textos: true, correcta, errores, variables, enunciado, pregunta, solucion, datos: { tipo: 'vandermonde', sub, a, b, c, d } });
  }

  // ======================= matriz: potencias de una triangular =======================
  const mul2 = (X, Y) => [[X[0][0] * Y[0][0] + X[0][1] * Y[1][0], X[0][0] * Y[0][1] + X[0][1] * Y[1][1]], [X[1][0] * Y[0][0] + X[1][1] * Y[1][0], X[1][0] * Y[0][1] + X[1][1] * Y[1][1]]];
  const potencias = (A, n) => { const out = [A]; for (let k = 2; k <= n; k++) out.push(mul2(out[out.length - 1], A)); return out; };
  const txtM = M => `(${M[0].map(ent).join('; ')}) y (${M[1].map(ent).join('; ')})`;
  function matriz(rng, semilla, sub) {
    const variables = { A: { nombre: 'matriz A', color: 'o' }, n: { nombre: 'exponente', color: 'i' }, x: { nombre: 'lo que se pide', color: 'd' } };
    if (sub === 'entrada') {
      const forma = rng.elegir(['k', 'k', 'doble']);
      let A, n, pos, correcta, errores, solucion;
      if (forma === 'k') {
        const k = rng.entero(2, 5); n = rng.entero(6, 20);
        const abajo = rng.moneda();
        A = abajo ? [[1, 0], [k, 1]] : [[1, k], [0, 1]]; pos = abajo ? [1, 0] : [0, 1];
        const pot = potencias(A, n);
        correcta = pot[n - 1][pos[0]][pos[1]];
        solucion = [
          ['Calcula las primeras potencias: ', `A² tiene filas ${txtM(pot[1])}; A³ tiene filas ${txtM(pot[2])}.`],
          [`Cada vez que se multiplica por A, ese elemento aumenta en ${k}: en Aⁿ vale ${k}n (se comprueba por inducción: Aⁿ·A suma ${k} más).`],
          ['Con ', v('n', `n = ${n}`), `: ${k} · ${n} = `, v('x', String(correcta)), '.'],
        ];
        errores = [
          k ** n < 1e7 ? h('MT1-potencia-por-entradas', k ** n, `Elevaste cada elemento a la ${n}. Una potencia de una matriz es multiplicarla por sí misma (fila por columna), no elevar cada elemento.`, 'hipotesis', MTF) : null,
          h('induccion-desfase', k * (n - 1), `Te quedaste una potencia atrás: ${k}(n − 1) es el elemento de Aⁿ⁻¹. En A¹ ya vale ${k}.`),
          2 ** (n - 1) * k < 1e7 ? h('patron-que-se-duplica', 2 ** (n - 1) * k, `Viste que en A² vale ${2 * k} y supusiste que se duplica en cada potencia. En A³ vale ${3 * k}, no ${4 * k}: crece de ${k} en ${k}.`) : null,
          h('patron-suma-uno', k + n - 1, `Supusiste que aumenta de 1 en 1. Calcula A³: aumenta de ${k} en ${k}.`),
        ];
      } else {
        const a = rng.elegir([2, 3]); n = rng.entero(4, a === 2 ? 9 : 6);
        A = [[a, 1], [0, a]]; pos = [0, 1];
        const m = a === 2 ? 3 : 2;   // la potencia en que el patrón de la diagonal ya falla a la vista
        const pot = potencias(A, n);
        correcta = pot[n - 1][0][1];
        solucion = [
          ['Calcula las primeras potencias: ', `A² tiene filas ${txtM(pot[1])}; A³ tiene filas ${txtM(pot[2])}.`],
          [`El patrón: Aⁿ tiene filas (${a}ⁿ; n·${a}ⁿ⁻¹) y (0; ${a}ⁿ) (por inducción: al multiplicar por A, el de arriba a la derecha pasa a ser ${a}ⁿ + ${a}·n·${a}ⁿ⁻¹ = (n + 1)·${a}ⁿ).`],
          ['Con ', v('n', `n = ${n}`), `: ${n} · ${a}${sup(n - 1)} = `, v('x', String(correcta)), '.'],
        ];
        errores = [
          h('MT1-potencia-por-entradas', 1, `Elevaste cada elemento a la ${n} (1ⁿ = 1). Una potencia de una matriz es multiplicarla por sí misma, fila por columna.`, 'hipotesis', MTF),
          h('patron-como-la-diagonal', a ** n, `Supusiste que ese elemento sigue el mismo patrón que la diagonal, ${a}ⁿ. Calcula A${sup(m)}: vale ${m * a ** (m - 1)}, no ${a ** m}.`),
          h('induccion-desfase', n * a ** n, `Pusiste n·${a}ⁿ. Comprueba con n = 1: debe dar 1, el elemento de A.`),
          h('induccion-desfase', (n - 1) * a ** (n - 2), `Te quedaste una potencia atrás: (n − 1)·${a}ⁿ⁻² es el elemento de Aⁿ⁻¹.`),
        ];
      }
      const lugar = pos[0] === 0 ? 'fila 1, columna 2' : 'fila 2, columna 1';
      const enunciado = ['Sea ', v('A', 'A'), ` la matriz de filas ${txtM(A)}.`];
      const pregunta = ['¿Cuánto vale el elemento de la ', v('x', lugar), ' de A', v('n', sup(n)), '?'];
      return cerrar(rng, semilla, { correcta, errores, enteros: true, texto: z => f(z), variables, enunciado, pregunta, solucion, datos: { tipo: 'matriz', sub, forma, A, n } });
    }
    const [a, c] = rng.elegir([[1, 2], [2, 1], [1, -1], [-1, 2], [2, -1], [1, 3], [3, -1], [-1, 3], [2, 3]]);
    const b = rng.entero(1, 5), n = rng.entero(3, 5);
    const A = [[a, b], [0, c]];
    delete variables.n;
    const pot = potencias(A, n);
    const correcta = pot.reduce((s, M) => s + M[0][0] + M[1][1], 0);
    let sumaTraza = 0; for (let k = 1; k <= n; k++) sumaTraza += (a + c) ** k;
    const enunciado = ['Sea ', v('A', 'A'), ` la matriz de filas ${txtM(A)}.`];
    const pregunta = ['¿Cuánto vale la ', v('x', 'traza'), ' de ', n === 3 ? 'A + A² + A³' : `A + A² + ⋯ + A${sup(n)}`, '?'];
    const solucion = [
      ['A es triangular: al multiplicar triangulares, la diagonal se multiplica elemento a elemento. ', `A² tiene filas ${txtM(pot[1])}; A³ tiene filas ${txtM(pot[2])}.`],
      [`Por inducción, Aᵏ tiene diagonal ${par(a)}ᵏ y ${par(c)}ᵏ (lo de arriba a la derecha no entra en la traza).`],
      [`Traza de la suma = suma de las trazas = (${Array.from({ length: n }, (_, k) => `${par(a)}${sup(k + 1)}`).join(' + ')}) + (${Array.from({ length: n }, (_, k) => `${par(c)}${sup(k + 1)}`).join(' + ')}) = `, v('x', ent(correcta)), '.'],
    ];
    const errores = [
      h('traza-de-potencia-como-potencia-de-traza', sumaTraza, `Tomaste la traza de Aᵏ como (traza A)ᵏ = ${par(a + c)}ᵏ. La traza de Aᵏ es ${par(a)}ᵏ + ${par(c)}ᵏ, la suma de las potencias de la diagonal.`),
      h('solo-la-ultima-potencia', a ** n + c ** n, `Esa es solo la traza de A${sup(n)}. Se pide la de la suma de todas las potencias, desde A.`),
      h('potencias-iguales-a-A', n * (a + c), `Sumaste ${n} veces la traza de A, como si todas las potencias fueran iguales a A.`),
      h('traza-como-suma-de-elementos', pot.reduce((s, M) => s + M[0][0] + M[0][1] + M[1][0] + M[1][1], 0), 'Sumaste todos los elementos de la matriz. La traza es solo la suma de la diagonal principal.'),
    ];
    return cerrar(rng, semilla, { correcta, errores, enteros: true, negativos: true, texto: z => f(z), variables, enunciado, pregunta, solucion, datos: { tipo: 'matriz', sub, A, n } });
  }

  // ======================= valor-absoluto: producción P(t) = c ∓ a·|t − k| =======================
  const TALLERES = [['Un taller de Juliaca teje chompas de alpaca', 'chompas', 'Cuántas'], ['Una panadería de Puno hornea panes', 'panes', 'Cuántos'],
    ['Una granja de Arequipa recoge bandejas de huevos', 'bandejas', 'Cuántas'], ['Una fábrica de Ayaviri produce quesos', 'quesos', 'Cuántos']];
  function valorAbsoluto(rng, semilla) {
    const [quien, cosa, cuantas] = rng.elegir(TALLERES);
    const signo = rng.elegir([-1, -1, 1]);    // −1: máximo en la semana k; +1: mínimo en la semana k
    const a = rng.elegir([4, 5, 6, 8, 10, 12, 15, 20]), k = rng.entero(6, 12), c = rng.entero(10, 40) * 10;
    const t1 = rng.entero(1, k - 2), t2 = rng.entero(1, 20);
    if (t2 <= t1 || t2 === k) return null;
    const Pf = (aa, t, abs = true) => c + signo * aa * (abs ? Math.abs(t - k) : (t - k));
    const v1 = Pf(a, t1);
    const correcta = Pf(a, t2);
    if (v1 <= 0 || correcta <= 0 || Pf(a, 1) <= 0 || Pf(a, 20) <= 0) return null;
    const formula = `P(t) = ${c} ${signo < 0 ? '−' : '+'} a·|t − ${k}|`;
    const variables = { F: { nombre: 'fórmula', color: 'o' }, d: { nombre: 'dato', color: 'i' }, a: { nombre: 'parámetro a', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
    const enunciado = [`${quien}. En la semana t (de 1 a 20) produce `, v('F', formula), `, donde a es un número positivo. En la semana ${t1} produjo `, v('d', `${v1} ${cosa}`), '.'];
    const pregunta = [`¿${cuantas} `, v('x', `${cosa} producirá en la semana ${t2}`), '?'];
    const solucion = [
      ['Con el dato: ', v('d', String(v1)), ` = ${c} ${signo < 0 ? '−' : '+'} a·|${t1} − ${k}| = ${c} ${signo < 0 ? '−' : '+'} a·${k - t1}, así que `, v('a', `a = ${a}`), '.'],
      [`En la semana ${t2}: P(${t2}) = ${c} ${signo < 0 ? '−' : '+'} `, v('a', String(a)), `·|${t2} − ${k}| = ${c} ${signo < 0 ? '−' : '+'} ${a}·${Math.abs(t2 - k)} = `, v('x', `${correcta} ${cosa}`), '.'],
    ];
    const aMal = (v1 - c) / (signo * (t1 - k));   // sin valor absoluto al hallar a (sale −a)
    const errores = [
      h('AL22-sin-valor-absoluto', Pf(aMal, t2, false), `Quitaste el valor absoluto: tomaste |${t1} − ${k}| como ${ent(t1 - k)} y a te salió ${f(aMal)}, que no es positivo. |t − ${k}| es la distancia entre t y ${k}, nunca negativa.`, 'parcial', AL),
      h('AL22-sin-valor-absoluto', Pf(aMal, t2, true), `Al hallar a quitaste el valor absoluto y te salió a = ${f(aMal)}, pero a es positivo: |${t1} − ${k}| = ${k - t1}, no ${ent(t1 - k)}.`, 'parcial', AL),
      h('AL22-sin-valor-absoluto', Pf(a, t2, false), `Al evaluar quitaste el valor absoluto: |${t2} − ${k}| = ${Math.abs(t2 - k)}, no ${ent(t2 - k)}.`, 'parcial', AL),
      h('responde-otra-cantidad', a, 'Ese es el valor de a. Falta reemplazarlo en la fórmula con la semana pedida.'),
      h('responde-otra-cantidad', Math.abs(correcta - v1), `Esa es la diferencia entre la producción de la semana ${t2} y la de la semana ${t1}, no la producción.`),
    ];
    return cerrar(rng, semilla, { correcta, errores, enteros: true, texto: z => `${f(z)} ${cosa}`, unidad: cosa, variables, enunciado, pregunta, solucion,
      datos: { tipo: 'valor-absoluto', signo, c, k, t1, v1, t2 } });
  }

  return { id: ID, titulo: 'Sistemas, raíces y potencias', generar };
});
