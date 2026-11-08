/*
 * Generador «division-polinomios»: cocientes notables, teorema del resto, identidad de la división y
 * MCD y MCM de polinomios. Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['division-polinomios']) y en Node (require). No usa ningún motor: toda la cuenta
 * se hace aquí con enteros exactos (regla 1). La notación sigue a plantillas/polinomios/ (coeficientes del
 * grado mayor al independiente, signo «−», superíndices x³) y a plantillas/cuadrado-crece/.
 *
 * Tipos (entre paréntesis, la fila del grupo que cubre, por su campo «falta»):
 *   cociente      cocientes notables (xᴺʳ ± yᴺˢ)/(xʳ ± yˢ) («Cocientes notables y su término general»):
 *     exponentes    se da un término y se piden los exponentes del dividendo (m + n)
 *     central       grado absoluto del término central (con el número de términos dado o deducido)
 *     fila          tantas personas en una fila como términos; cuántas hay delante de la del centro
 *     termino       el término de lugar k, con su signo (respuesta de texto)
 *     coeficiente   coeficiente del término de lugar k en (xᴺ ± aᴺ)/(x ± a)
 *   resto2        resto lineal px + q al dividir entre un divisor de segundo grado con dos raíces
 *                 («Resto lineal por divisor de segundo grado evaluando en sus raíces»; respuesta de texto):
 *     condiciones   se dan los restos entre cada factor lineal
 *     explicito     se da P(x) y el divisor desarrollado
 *   identidad     D = d·q + R evaluada en 0 o en 1 («Identidad de la división evaluada en cero para
 *                 cociente y resto»):
 *     independiente término independiente del cociente
 *     suma          suma de coeficientes del cociente
 *   parametros    identidad con cociente desconocido («Identidad de la división con cociente desconocido»):
 *     exacta        x³ + ax² + bx + c divisible entre un trinomio: se pide a + b
 *     monico        P cuadrático mónico con un resto dado, divisible entre su cociente más k: se pide P(0)
 *   caja          volumen de una caja sin tapa como polinomio y teorema del resto («Modelar un volumen como
 *                 polinomio y usar el teorema del resto»):
 *     lado          el resto entre x − k fija el largo de la plancha
 *     resto         se pide el resto de V(x) entre x − k
 *   mcdmcm        MCD y MCM por factorización («MCD y MCM de polinomios por factorización»):
 *     mcd-valor     dos cúbicas desarrolladas; valor numérico del MCD
 *     mcm-dado      MCD dado, una cúbica completa y otra con solo su término independiente; valor del MCM
 *     grado         grado del MCD o del MCM de dos polinomios factorizados
 * Errores: hipótesis nuestras (el informe de álgebra no trae datos de división ni de cocientes notables);
 * los PO* son los de plantillas/polinomios/motor.js, AL16 el de docs/investigacion/algebra-funciones-ideas-erroneas.md.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'division-polinomios';
  const v = P.v;
  const n = x => P.formatear(x, 0);
  const ent = x => Number.isInteger(x);
  // Error numérico (armar) y de texto (armarTexto).
  const h = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente: null });
  const ht = (id, r, explicacion) => (r ? { id, clave: r.clave, texto: r.texto, explicacion, respaldo: 'hipotesis', fuente: null } : null);
  const AL16 = 'docs/investigacion/algebra-funciones-ideas-erroneas.md';

  // ---------- Texto ----------
  const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', n: 'ⁿ' };
  const sup = e => String(e).split('').map(c => SUP[c]).join('');
  const pot = (b, e) => (e === 0 ? '' : e === 1 ? b : b + sup(e));
  // Polinomio en x: coeficientes del grado mayor al independiente. [1, 0, -3, 2] → «x³ − 3x + 2».
  function polTxt(c, letra = 'x') {
    const g = c.length - 1; let t = '';
    c.forEach((a, i) => {
      if (a === 0) return;
      const e = g - i, abs = Math.abs(a);
      const cuerpo = e === 0 ? n(abs) : (abs === 1 ? '' : n(abs)) + pot(letra, e);
      t += t === '' ? (a < 0 ? '−' : '') + cuerpo : (a < 0 ? ' − ' : ' + ') + cuerpo;
    });
    return t || '0';
  }
  const factor = r => (r === 0 ? 'x' : r > 0 ? `x − ${n(r)}` : `x + ${n(-r)}`);
  const par = x => (x < 0 ? `(${n(x)})` : n(x));
  // «3p + q», «−p + q», «q»: el valor de px + q en x = r, escrito para la solución.
  const enR = r => (r === 0 ? 'q' : `${r === 1 ? '' : r === -1 ? '−' : n(r)}p + q`);
  const sgn = c => (c < 0 ? `− ${n(-c)}` : `+ ${n(c)}`);
  // (x³)ᴺ⁻ᵏ, o xᴺ⁻ᵏ si el exponente es 1; y «36/4 = 45/5 = 9» (una sola división si r = s).
  const base = (b, e) => (e === 1 ? b : `(${pot(b, e)})`);
  const divs = (r, s, N) => (r === s ? `${r * N}/${r} = ${N}` : `${r * N}/${r} = ${s * N}/${s} = ${N}`);
  const lineal = (p, q) => ({ clave: `pol:${p},${q}`, texto: polTxt([p, q]) });
  // Monomio c·xᵃyᵇ con su signo: «−x¹⁵y⁶».
  function mono(c, a, b) {
    const abs = Math.abs(c), lit = pot('x', a) + pot('y', b);
    return { clave: `mono:${c}:${a}:${b}`, texto: (c < 0 ? '−' : '') + (abs === 1 && lit ? '' : n(abs)) + lit };
  }

  // ---------- Polinomios con enteros ----------
  const evalP = (c, x) => c.reduce((s, a) => s * x + a, 0);
  function mul(a, b) {
    const r = new Array(a.length + b.length - 1).fill(0);
    a.forEach((x, i) => b.forEach((y, j) => { r[i + j] += x * y; }));
    return r;
  }
  function sumar(a, b) {
    const L = Math.max(a.length, b.length), r = [];
    for (let i = 0; i < L; i++) r.push((a[i - L + a.length] || 0) + (b[i - L + b.length] || 0));
    return r;
  }
  const deRaices = rs => rs.reduce((p, r) => mul(p, [1, -r]), [1]);
  // Recta por dos puntos con pendiente y ordenada enteras; si no, null.
  function recta(x1, y1, x2, y2) {
    if (x1 === x2) return null;
    const p = (y1 - y2) / (x1 - x2), q = y1 - p * x1;
    return ent(p) && ent(q) ? { p, q } : null;
  }

  const TIPOS = {
    cociente: ['exponentes', 'central', 'fila', 'termino', 'coeficiente'],
    resto2: ['condiciones', 'explicito'],
    identidad: ['independiente', 'suma'],
    parametros: ['exacta', 'monico'],
    caja: ['lado', 'resto'],
    mcdmcm: ['mcd-valor', 'mcm-dado', 'grado'],
  };
  const LISTA = ['cociente', 'cociente', 'resto2', 'identidad', 'parametros', 'caja', 'mcdmcm', 'mcdmcm'];

  function generar(semilla) {
    const rng = Azar.crear(`${ID}|` + semilla);
    const tipo = rng.elegir(LISTA);
    const sub = rng.elegir(TIPOS[tipo]);
    for (let intento = 0; intento < 5000; intento++) {
      const pr = construir(rng, semilla, tipo, sub);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  const FUN = {};
  function construir(rng, semilla, tipo, sub) {
    const o = FUN[tipo](rng, sub);
    if (!o) return null;
    let alternativas, respuesta;
    if (o.textual) {
      alternativas = P.armarTexto({ correcta: o.correcta, errores: o.errores.filter(Boolean), rng });
      respuesta = { valor: o.correcta.clave, texto: o.correcta.texto, unidad: '' };
    } else {
      const errores = o.errores.filter(e => ent(e.valor) && Math.abs(e.valor) < 1e6 && (o.negativos || e.valor > 0) && !(tipo === 'mcdmcm' && e.valor === -o.correcta));
      alternativas = P.armar({ correcta: o.correcta, errores, rng, negativos: true, decimales: 0, unidad: o.unidad || '' });
      respuesta = { valor: o.correcta, unidad: o.unidad || '' };
    }
    return { id: `${ID}#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion, respuesta, _datos: { tipo, sub, ...o.datos } };
  }

  // ===================== Cocientes notables =====================
  // forma: 'mm' (xᴬ − yᴮ)/(xʳ − yˢ), todos +; 'pp' (+ / +), N impar, signos alternados; 'mp' (− / +), N par, alternados.
  const SIGNOS = { mm: ['−', '−'], pp: ['+', '+'], mp: ['−', '+'] };
  const signoK = (forma, k) => (forma === 'mm' ? 1 : (k % 2 === 1 ? 1 : -1));
  const cnTxt = (forma, A, B, r, s, y = 'y') => `(${pot('x', A)} ${SIGNOS[forma][0]} ${pot(y, B)})/(${pot('x', r)} ${SIGNOS[forma][1]} ${pot(y, s)})`;

  FUN.cociente = function (rng, sub) {
    if (sub === 'exponentes') {
      const r = rng.entero(1, 5), s = rng.entero(1, 5), N = rng.entero(5, 14), k = rng.entero(2, N - 1);
      if (r === s) return null;
      const A = r * (N - k), B = s * (k - 1), correcta = (r + s) * N;
      const variables = { t: { nombre: 'término dado', color: 'i' }, N: { nombre: 'número de términos', color: 'h' },
        k: { nombre: 'lugar del término', color: 'o' }, S: { nombre: 'm + n', color: 'd' } };
      const t = mono(1, A, B).texto;
      const enunciado = [`La división (xᵐ − yⁿ)/(${pot('x', r)} − ${pot('y', s)}) da un cociente notable. Uno de los términos de su desarrollo es `, v('t', t), '.'];
      const pregunta = ['¿Cuánto vale ', v('S', 'm + n'), '?'];
      const errores = [
        h('cn-lugar-corrido', (r + s) * (N - 1), `Usaste el exponente de y como ${s}·k en vez de ${s}·(k − 1). En el lugar k, y lleva exponente ${s}·(k − 1): el primer término no tiene y.`),
        h('cn-responde-terminos', N, `${N} es el número de términos, no m + n. Con ${N} términos, m = ${r}·${N} y n = ${s}·${N}.`),
        h('cn-exponentes-del-termino', A + B, `Sumaste los exponentes del término dado. Esos son los de un término del cociente; m y n son los exponentes del dividendo.`),
        h('cn-lugar-por-terminos', (r + s) * k, `Tomaste el lugar del término (${k}) como si fuera el número de términos. Hay ${N} términos: el lugar ${k} sale del exponente de y y el total, del exponente de x.`),
        h('cn-solo-m', r * N, `Esa es solo m. Falta sumar n = ${s}·${N} = ${s * N}.`),
      ];
      const solucion = [
        [`En (xᵐ − yⁿ)/(${pot('x', r)} − ${pot('y', s)}) con `, v('N', 'N'), ' términos, el término de lugar ', v('k', 'k'), ` es ${base('x', r)}ᴺ⁻ᵏ·${base('y', s)}ᵏ⁻¹.`],
        ['Exponente de y: ', `${s}·(k − 1) = ${B} → `, v('k', `k = ${k}`), '.'],
        ['Exponente de x: ', `${r}·(N − ${k}) = ${A} → `, v('N', `N = ${N}`), ' términos.'],
        [`Como m/${r} = n/${s} = ${N}: m = ${r * N} y n = ${s * N}, así que `, v('S', `m + n = ${correcta}`), '.'],
      ];
      return { correcta, errores, variables, enunciado, pregunta, solucion, datos: { r, s, N, k, A, B } };
    }
    if (sub === 'central') {
      const r = rng.entero(1, 6), s = rng.entero(1, 6), N = 2 * rng.entero(2, 8) + 1;
      if (r === s) return null;
      const dado = rng.moneda(), kc = (N + 1) / 2;
      const grado = k => r * (N - k) + s * (k - 1);
      const correcta = grado(kc);
      const variables = { N: { nombre: 'número de términos', color: 'h' }, c: { nombre: 'lugar central', color: 'o' }, g: { nombre: 'grado del término central', color: 'd' } };
      const enunciado = dado
        ? [`El cociente notable (${pot('x', r === 1 ? 'n' : r + 'n')} − ${pot('y', s === 1 ? 'n' : s + 'n')})/(${pot('x', r)} − ${pot('y', s)}) tiene `, v('N', `${N} términos`), '.']
        : [`Considera el cociente notable ${cnTxt('mm', r * N, s * N, r, s)}.`];
      const pregunta = ['¿Cuál es el ', v('g', 'grado absoluto'), ' de su término central?'];
      const errores = [
        h('cn-central-corrido', grado(kc - 1), `Ubicaste el centro en el lugar ${kc - 1}. Con ${N} términos, el central deja ${kc - 1} antes y ${kc - 1} después: es el lugar ${kc}.`),
        h('cn-lugar-corrido', r * (N - kc) + s * kc, `Pusiste a y el exponente ${s}·${kc}. En el lugar k, y lleva ${s}·(k − 1): el primer término no tiene y.`),
        h('cn-solo-grado-x', r * (N - kc), 'Ese es solo el grado respecto de x. El grado absoluto suma los exponentes de x y de y.'),
        h('cn-grado-por-lugar', (r + s) * kc, `Multiplicaste el grado del divisor (${r + s}) por el lugar central. Los exponentes de x bajan y los de y suben: hay que calcular cada uno.`),
      ];
      const solucion = [
        ...(dado ? [] : [[`Número de términos: ${divs(r, s, N).replace(/ = \d+$/, ' = ')}`, v('N', `${N}`), '.']]),
        ['Con ', v('N', `${N} términos`), ', el central es el de lugar ', v('c', `(${N} + 1)/2 = ${kc}`), '.'],
        [`Término de lugar ${kc}: ${base('x', r)}${sup(N - kc)}·${base('y', s)}${sup(kc - 1)} = ${mono(1, r * (N - kc), s * (kc - 1)).texto}.`],
        ['Grado absoluto: ', `${r * (N - kc)} + ${s * (kc - 1)} = `, v('g', `${correcta}`), '.'],
      ];
      return { correcta, errores, variables, enunciado, pregunta, solucion, datos: { r, s, N, dado } };
    }
    if (sub === 'fila') {
      const r = rng.entero(2, 5), s = rng.entero(2, 6), N = 2 * rng.entero(4, 12) + 1;
      if (r === s) return null;
      const nombre = rng.elegir(['Lucía', 'Wilber', 'Rosa', 'Edwin', 'Maribel', 'Yony']);
      const correcta = (N - 1) / 2;
      const variables = { N: { nombre: 'personas en la fila', color: 'h' }, c: { nombre: 'lugar central', color: 'o' }, d: { nombre: 'personas delante', color: 'd' } };
      const enunciado = [`En la formación del colegio, una fila tiene tantos alumnos como términos tiene el desarrollo del cociente notable ${cnTxt('mm', r * N, s * N, r, s)}. ${nombre} está justo en el centro de la fila.`];
      const pregunta = ['¿Cuántos alumnos hay ', v('d', `delante de ${nombre}`), '?'];
      const errores = [
        h('cn-fila-cuenta-al-del-centro', (N + 1) / 2, `${(N + 1) / 2} es el lugar de ${nombre}. Delante hay uno menos: a ${nombre} no se le cuenta entre los de delante.`),
        h('cn-fila-todos-menos-uno', N - 1, `${N - 1} son todos los demás de la fila, delante y detrás. Delante solo está la mitad.`),
        h('cn-responde-terminos', N, `${N} es el total de alumnos de la fila. Se pregunta solo por los de delante.`),
        h('cn-terminos-exponente', (r * N - 1) / 2, `Tomaste el exponente ${r * N} como número de términos: con ${r * N}, el del centro sería el ${(r * N + 1) / 2} y delante habría ${(r * N - 1) / 2}. El número de términos es ${r * N}/${r} = ${N}.`),
      ];
      const solucion = [
        [`Número de términos: ${divs(r, s, N).replace(/ = \d+$/, ' = ')}`, v('N', `${N}`), ' alumnos.'],
        [`${nombre} está en el lugar `, v('c', `(${N} + 1)/2 = ${(N + 1) / 2}`), '.'],
        ['Delante quedan los lugares 1 a ', `${(N - 1) / 2}`, ': ', v('d', `${correcta} alumnos`), '.'],
      ];
      return { correcta, errores, variables, enunciado, pregunta, solucion, datos: { r, s, N } };
    }
    if (sub === 'termino') {
      const forma = rng.elegir(['mm', 'pp', 'mp']);
      const r = rng.entero(1, 4), s = rng.entero(1, 4);
      let N = rng.entero(5, 12);
      if (forma === 'pp' && N % 2 === 0) N++;
      if (forma === 'mp' && N % 2 === 1) N++;
      const k = rng.entero(2, N - 1);
      const sg = signoK(forma, k);
      const correcta = mono(sg, r * (N - k), s * (k - 1));
      const variables = { t: { nombre: 'término pedido', color: 'd' }, k: { nombre: 'lugar del término', color: 'o' }, N: { nombre: 'número de términos', color: 'h' } };
      const enunciado = [`Considera el cociente notable ${cnTxt(forma, r * N, s * N, r, s)}.`];
      const pregunta = ['¿Cuál es el ', v('t', 'término'), ' de lugar ', v('k', `${k}`), ' de su desarrollo?'];
      const otroSigno = forma === 'mm'
        ? 'Pusiste signos alternados. Con un menos arriba y abajo, todos los términos son positivos.'
        : `Te equivocaste de signo. Con divisor de la forma xʳ + yˢ los signos se alternan empezando por +: los lugares impares van con + y los pares con −; el lugar ${k} va con ${sg > 0 ? '+' : '−'}.`;
      const errores = [
        ht('cn-signo-alternado-mal', mono(forma === 'mm' ? (k % 2 === 1 ? 1 : -1) : -sg, r * (N - k), s * (k - 1)), otroSigno),
        ht('cn-lugar-corrido', mono(sg, r * (N - k), s * k), `Pusiste a y el exponente ${s}·${k}. En el lugar k, y lleva ${s}·(k − 1): el primer término no tiene y.`),
        ht('cn-empieza-en-dividendo', mono(sg, r * (N - k + 1), s * (k - 1)), `Empezaste con x elevado a ${r * N}, el exponente del dividendo. El primer término es ${pot('x', r * (N - 1))}: x pierde ${r} en cada lugar.`),
        ht('cn-cuenta-desde-el-final', mono(signoK(forma, N - k + 1), r * (k - 1), s * (N - k)), `Contaste los lugares desde el final. El primer término es el que lleva la mayor potencia de x.`),
        ht('cn-signo-y-lugar', mono(-sg, r * (N - k), s * k), `Hay dos errores: el exponente de y es ${s}·(k − 1), no ${s}·k, y el signo del lugar ${k} es ${sg > 0 ? '+' : '−'}.`),
      ];
      const regla = forma === 'mm' ? 'Con un menos arriba y abajo, todos los términos son positivos.'
        : 'Con divisor xʳ + yˢ los signos se alternan: + en los lugares impares y − en los pares.';
      const solucion = [
        [`Número de términos: ${divs(r, s, N).replace(/ = \d+$/, ' = ')}`, v('N', `${N}`), '.'],
        ['Término de lugar ', v('k', 'k'), `: ${base('x', r)}ᴺ⁻ᵏ·${base('y', s)}ᵏ⁻¹, con su signo. ${regla}`],
        [`Con k = ${k}: x lleva ${r}·(${N} − ${k}) = ${r * (N - k)} e y lleva ${s}·(${k} − 1) = ${s * (k - 1)}. El término es `, v('t', correcta.texto), '.'],
      ];
      return { textual: true, correcta, errores, variables, enunciado, pregunta, solucion, datos: { forma, r, s, N, k } };
    }
    // coeficiente: (xᴺ ± aᴺ)/(x ± a)
    const forma = rng.elegir(['mm', 'pp', 'mp']);
    const a = rng.elegir([2, 2, 3]);
    let N = rng.entero(5, 10);
    if (forma === 'pp' && N % 2 === 0) N++;
    if (forma === 'mp' && N % 2 === 1) N++;
    const k = rng.entero(2, Math.min(N - 1, a === 2 ? 7 : 5));
    const sg = signoK(forma, k), correcta = sg * a ** (k - 1);
    const variables = { k: { nombre: 'lugar del término', color: 'o' }, c: { nombre: 'coeficiente pedido', color: 'd' }, a: { nombre: 'número del divisor', color: 'i' } };
    const enunciado = [`Considera el cociente notable (${pot('x', N)} ${SIGNOS[forma][0]} ${pot(String(a), N)})/(x ${SIGNOS[forma][1]} `, v('a', String(a)), ').'];
    const pregunta = ['¿Cuál es el ', v('c', 'coeficiente'), ' del término de lugar ', v('k', `${k}`), ' de su desarrollo?'];
    const errores = [
      h('cn-signo-alternado-mal', -correcta, forma === 'mm'
        ? 'Pusiste signos alternados. Con x − a abajo y un menos arriba, todos los términos son positivos.'
        : `Te equivocaste de signo. Con x + a abajo los signos se alternan empezando por +: el lugar ${k} va con ${sg > 0 ? '+' : '−'}.`),
      h('cn-lugar-corrido', sg * a ** k, `Elevaste ${a} a ${k}. En el lugar k, el número del divisor va elevado a k − 1 = ${k - 1}: el primer término es solo una potencia de x.`),
      h('cn-cuenta-desde-el-final', signoK(forma, N - k + 1) * a ** (N - k), `Contaste los lugares desde el final. El primer término es ${pot('x', N - 1)}, sin ${a}.`),
      h('potencia-como-producto', sg * a * (k - 1), `Multiplicaste ${a}·${k - 1}. ${pot(String(a), k - 1)} es ${a} multiplicado por sí mismo ${k - 1} veces.`),
    ];
    const solucion = [
      ['Término de lugar ', v('k', 'k'), ': ', `xᴺ⁻ᵏ·`, v('a', String(a)), `ᵏ⁻¹ con su signo. ${forma === 'mm' ? 'Con x − a abajo y un menos arriba, todos son positivos.' : 'Con x + a abajo, los signos se alternan: + en los lugares impares y − en los pares.'}`],
      [`Con k = ${k}: ${pot('x', N - k)}·${pot(String(a), k - 1)}, con signo ${sg > 0 ? '+' : '−'}.`],
      ['El coeficiente es ', v('c', n(correcta)), '.'],
    ];
    return { correcta, negativos: true, errores, variables, enunciado, pregunta, solucion, datos: { forma, a, N, k } };
  };

  // ===================== Resto entre un divisor de segundo grado =====================
  FUN.resto2 = function (rng, sub) {
    const [r1, r2] = rng.barajar([-3, -2, -1, 0, 1, 2, 3]).slice(0, 2);
    if (sub === 'explicito' && (Math.abs(r1) > 2 || Math.abs(r2) > 2)) return null;
    const div = deRaices([r1, r2]);
    let R1, R2, Pc = null;
    if (sub === 'condiciones') { R1 = rng.entero(-9, 9); R2 = rng.entero(-9, 9); }
    else {
      const g = rng.entero(4, 6), m = rng.entero(1, g - 1), c1 = rng.elegir([-4, -3, -2, -1, 1, 2, 3, 4]), c0 = rng.entero(-6, 6);
      Pc = new Array(g + 1).fill(0); Pc[0] = 1; Pc[g - m] += c1; Pc[g] += c0;
      R1 = evalP(Pc, r1); R2 = evalP(Pc, r2);
    }
    const ok = recta(r1, R1, r2, R2);
    if (!ok || ok.p === 0) return null;
    const correcta = lineal(ok.p, ok.q);
    const PP = Pc ? polTxt(Pc) : 'P(x)';
    const variables = { R1: { nombre: `resto entre ${factor(r1)}`, color: 'i' }, R2: { nombre: `resto entre ${factor(r2)}`, color: 'h' }, X: { nombre: 'resto pedido', color: 'd' } };
    const prod = (r1 === 0 ? `x(${factor(r2)})` : r2 === 0 ? `x(${factor(r1)})` : `(${factor(r1)})(${factor(r2)})`);
    const rr = r1 !== 0 ? r1 : r2;
    const enunciado = sub === 'condiciones'
      ? ['Un polinomio P(x) deja resto ', v('R1', n(R1)), ` al dividirlo entre ${factor(r1)} y resto `, v('R2', n(R2)), ` al dividirlo entre ${factor(r2)}.`]
      : [`Sea P(x) = ${PP}.`];
    const pregunta = ['¿Cuál es el ', v('X', 'resto'), ` de dividir P(x) entre ${polTxt(div)}?`];
    const mal = recta(-r1, sub === 'condiciones' ? R1 : evalP(Pc, -r1), -r2, sub === 'condiciones' ? R2 : evalP(Pc, -r2));
    const cruz = recta(r1, R2, r2, R1);
    const errores = [
      ht('PO8-raiz-signo-cambiado', mal && lineal(mal.p, mal.q), `Usaste las raíces con el signo cambiado (${n(-r1)} y ${n(-r2)}). La raíz de ${factor(rr)} es ${n(rr)}: el número que lo hace cero.`),
      ht('resto-suma-de-restos', { clave: `pol:0,${R1 + R2}`, texto: n(R1 + R2) }, 'Sumaste los dos restos. Entre un divisor de segundo grado el resto es de la forma px + q: se hallan p y q con los dos restos.'),
      ht('resto-restos-como-coeficientes', lineal(R1, R2), `Pusiste los restos como coeficientes (${polTxt([R1, R2])}). Hay que pedir que px + q valga ${n(R1)} en x = ${n(r1)} y ${n(R2)} en x = ${n(r2)}.`),
      ht('resto-restos-cruzados', cruz && lineal(cruz.p, cruz.q), `Cruzaste los restos: le diste a x = ${n(r1)} el resto que corresponde a x = ${n(r2)}.`),
      ht('resto-producto-de-restos', { clave: `pol:0,${R1 * R2}`, texto: n(R1 * R2) }, 'Multiplicaste los restos, como se multiplican los factores del divisor. El resto es px + q y se halla evaluando en cada raíz.'),
    ];
    const solucion = [
      [`El divisor ${polTxt(div)} = ${prod} es de grado 2, así que el resto es de grado 1 o menos: R(x) = px + q.`],
      ...(sub === 'explicito' ? [['Teorema del resto en cada raíz: ', v('R1', `P(${n(r1)}) = ${n(R1)}`), ' y ', v('R2', `P(${n(r2)}) = ${n(R2)}`), '.']] : []),
      ['De P(x) = (', polTxt(div), ')·Q(x) + px + q, evaluando en las raíces ', `${n(r1)} y ${n(r2)}: ${enR(r1)} = `, v('R1', n(R1)), ` y ${enR(r2)} = `, v('R2', n(R2)), '.'],
      [`Restando: p = ${n(ok.p)} y q = ${n(ok.q)}. El resto es `, v('X', correcta.texto), '.'],
    ];
    return { textual: true, correcta, errores, variables, enunciado, pregunta, solucion,
      datos: sub === 'condiciones' ? { r1, r2, R1, R2 } : { r1, r2, P: Pc } };
  };

  // ===================== Identidad de la división =====================
  FUN.identidad = function (rng, sub) {
    const m = rng.entero(-4, 4), k = rng.elegir([-5, -4, -3, -2, 2, 3, 4, 5]);
    const d = [1, m, k];
    const q = [rng.entero(1, 3), rng.entero(-5, 5), rng.elegir([-7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7])];
    const R = [rng.entero(-6, 6), rng.elegir([-8, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 8])];
    const D = sumar(mul(d, q), R);
    const en = sub === 'independiente' ? 0 : 1;
    const dv = evalP(d, en), Dv = evalP(D, en), Rv = evalP(R, en);
    if (dv === 0) return null;
    const correcta = evalP(q, en), otro = evalP(q, 1 - en);
    if (Math.abs(correcta) > 40) return null;
    const variables = { D: { nombre: 'valor del dividendo', color: 'o' }, d: { nombre: 'valor del divisor', color: 'i' },
      R: { nombre: 'valor del resto', color: 'h' }, q: { nombre: sub === 'independiente' ? 'término independiente del cociente' : 'suma de coeficientes del cociente', color: 'd' } };
    const enunciado = [`Al dividir D(x) = ${polTxt(D)} entre d(x) = ${polTxt(d)} se obtiene como resto R(x) = ${polTxt(R)}.`];
    const pregunta = sub === 'independiente' ? ['¿Cuál es el ', v('q', 'término independiente del cociente'), '?'] : ['¿Cuánto suman los ', v('q', 'coeficientes del cociente'), '?'];
    const x0 = n(en);
    const errores = [
      h(sub === 'independiente' ? 'valor-en-uno-por-cero' : 'valor-en-cero-por-uno', otro, sub === 'independiente'
        ? 'Esa es la suma de coeficientes del cociente, Q(1). El término independiente es Q(0): se evalúa en x = 0.'
        : 'Ese es el término independiente del cociente, Q(0). La suma de coeficientes es Q(1): se evalúa en x = 1.'),
      h('identidad-sin-resto', Dv / dv, `Dividiste D(${x0}) entre d(${x0}) sin restar el resto. La identidad es D = d·Q + R: primero se quita R(${x0}).`),
      h('identidad-resto-sumado', (Dv + Rv) / dv, `Sumaste R(${x0}) en vez de restarlo. De D = d·Q + R sale d·Q = D − R.`),
      h('identidad-sin-dividir', Dv - Rv, `Te faltó dividir entre d(${x0}) = ${n(dv)}. D − R es d·Q, no Q.`),
    ];
    const solucion = [
      [`Identidad de la división: D(x) = d(x)·Q(x) + R(x). Se evalúa en x = ${x0}.`],
      [v('D', `D(${x0}) = ${n(Dv)}`), ', ', v('d', `d(${x0}) = ${n(dv)}`), ' y ', v('R', `R(${x0}) = ${n(Rv)}`), '.'],
      [`${n(Dv)} = ${par(dv)}·Q(${x0}) + ${par(Rv)} → Q(${x0}) = (${n(Dv)} − ${par(Rv)})/${par(dv)} = `, v('q', n(correcta)), '.'],
    ];
    return { correcta, negativos: true, errores, variables, enunciado, pregunta, solucion, datos: { D, d, R } };
  };

  // ===================== Parámetros con cociente desconocido =====================
  FUN.parametros = function (rng, sub) {
    if (sub === 'exacta') {
      const [r1, r2] = rng.barajar([-4, -3, -2, -1, 1, 2, 3, 4]).slice(0, 2);
      const m = -(r1 + r2), k = r1 * r2, t = rng.elegir([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
      if (Math.abs(k) < 2) return null;
      const c = k * t, a = m + t, b = k + m * t, correcta = a + b;
      const variables = { c: { nombre: 'término independiente', color: 'o' }, t: { nombre: 'término del cociente', color: 'i' }, S: { nombre: 'a + b', color: 'd' } };
      const enunciado = [`El polinomio x³ + ax² + bx `, v('c', sgn(c)), ` es divisible entre ${polTxt([1, m, k])}.`];
      const pregunta = ['¿Cuánto vale ', v('S', 'a + b'), '?'];
      const errores = [
        h('PO17-raices-signo-cambiado', (-m + t) + (k - m * t), `Usaste las raíces con el signo cambiado. Las raíces de ${polTxt([1, m, k])} son ${n(r1)} y ${n(r2)}.`),
        h('cociente-sin-termino', m + k, `Tomaste el cociente como x, sin su término independiente. Si el cociente fuera x, el término independiente del dividendo sería 0, no ${n(c)}.`),
        h('cociente-con-c', (m + c) + (k + m * c), `Tomaste el cociente como x ${c < 0 ? '−' : '+'} ${n(Math.abs(c))}. El término independiente ${n(c)} es el producto ${n(k)}·t: hay que dividir, t = ${n(c)}/${n(k)}.`),
        { ...h('AL16', (m - t) + (k - m * t), `Despejaste t con el signo cambiado. De ${n(k)}·t = ${n(c)} sale t = ${n(t)}.`), fuente: AL16 },
      ];
      const solucion = [
        [`El cociente es de grado 1 y mónico: x + t. Entonces x³ + ax² + bx ${sgn(c)} = (${polTxt([1, m, k])})(x + t).`],
        ['Términos independientes: ', `${n(k)}·t = `, v('c', n(c)), ' → ', v('t', `t = ${n(t)}`), '.'],
        [`Al multiplicar: a = ${n(m)} + t = ${n(a)} y b = ${n(k)} + ${par(m)}·t = ${n(b)}.`],
        [v('S', `a + b = ${n(correcta)}`), '.'],
      ];
      return { correcta, negativos: true, errores, variables, enunciado, pregunta, solucion, datos: { r1, r2, t, c } };
    }
    // monico
    const a = rng.elegir([-4, -3, -2, -1, 1, 2, 3, 4]), k = rng.elegir([1, 2, 2, 3]), j = rng.elegir([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
    const r = k * j, s = -j - k - a;
    const P0 = r - a * s, correcta = P0;
    if (s === 0 || P0 === 0) return null;
    const P1 = 1 + (s - a) + P0;
    const sMal = -j - k + a, sDes = j - k - a;
    const variables = { r: { nombre: 'resto entre x − a', color: 'i' }, k: { nombre: 'número que se suma al cociente', color: 'o' }, Q: { nombre: 'cociente', color: 'h' }, X: { nombre: 'término independiente de P', color: 'd' } };
    const enunciado = ['P(x) es un polinomio de segundo grado y mónico (su coeficiente principal es 1). Al dividir P(x) entre ', factor(a), ' se obtiene el cociente ', v('Q', 'Q(x)'), ' y el resto ', v('r', n(r)), '. Además, P(x) es divisible entre ', v('Q', 'Q(x)'), ' + ', v('k', n(k)), '.'];
    const pregunta = ['¿Cuál es el ', v('X', 'término independiente'), ' de P(x)?'];
    const errores = [
      h('valor-en-uno-por-cero', P1, 'Esa es la suma de coeficientes, P(1). El término independiente es P(0).'),
      h('PO8-raiz-signo-cambiado', r + a * sMal, `Escribiste P(x) = (${factor(-a)})·Q(x) ${sgn(r)}: cambiaste ${factor(a)} por ${factor(-a)}. Dividir entre ${factor(a)} da P(x) = (${factor(a)})·Q(x) ${sgn(r)}.`),
      h('identidad-sin-resto', -a * s, `Olvidaste el resto: P(x) = (${factor(a)})·Q(x) ${sgn(r)}, y el ${n(r)} también entra en el término independiente.`),
      { ...h('AL16', r - a * sDes, `Al despejar perdiste un signo: de ${k === 1 ? '' : n(k) + '·'}(s + ${n(k)} ${a < 0 ? '− ' + n(-a) : '+ ' + n(a)}) ${sgn(r)} = 0 sale s + ${n(k)} ${a < 0 ? '− ' + n(-a) : '+ ' + n(a)} = ${n(-r / k)}, no ${n(r / k)}.`), fuente: AL16 },
    ];
    const ra = `(${factor(a)})`;
    const solucion = [
      ['Como P es mónico de grado 2, el cociente también es mónico, de grado 1: ', v('Q', 'Q(x) = x + s'), `. Y P(x) = ${ra}(x + s) `, v('r', sgn(r)), '.'],
      [v('Q', 'Q(x)'), ' + ', v('k', n(k)), ` = x + s + ${n(k)} se anula en x = −s − ${n(k)}. Ahí P vale 0: (−s − ${n(k)} ${a < 0 ? '+ ' + n(-a) : '− ' + n(a)})·(−${n(k)}) ${sgn(r)} = 0.`],
      [`Despejando: s + ${n(k)} ${a < 0 ? '− ' + n(-a) : '+ ' + n(a)} = ${n(-r / k)}, así que s = ${n(s)}.`],
      [`P(0) = ${n(-a)}·${par(s)} ${sgn(r)} = `, v('X', n(correcta)), '.'],
    ];
    return { correcta, negativos: true, errores, variables, enunciado, pregunta, solucion, datos: { a, k, r } };
  };

  // ===================== Caja sin tapa =====================
  FUN.caja = function (rng, sub) {
    const a = rng.elegir([20, 24, 30, 36, 40]), k = rng.entero(2, 5);
    const lugar = rng.elegir(['En un taller de Juliaca', 'En la clase de arte', 'En una imprenta del mercado', 'Para la feria del colegio']);
    if (sub === 'lado') {
      const L = rng.entero(a + 2, 60), R = k * (a - 2 * k) * (L - 2 * k), base = R / (k * (a - 2 * k));
      const variables = { x: { nombre: 'lado del recorte', color: 'o' }, a: { nombre: 'ancho de la plancha', color: 'i' }, L: { nombre: 'largo de la plancha', color: 'd' }, R: { nombre: 'resto', color: 'h' } };
      const enunciado = [`${lugar}, de una plancha rectangular de cartón de `, v('a', `${a} cm de ancho`), ' se recortan en las cuatro esquinas cuadrados de ', v('x', 'x cm'), ' de lado y se doblan los bordes para armar una caja sin tapa. Su volumen V(x), en cm³, es un polinomio en x. Al dividir V(x) entre x − ', v('x', String(k)), ' se obtiene resto ', v('R', n(R)), '.'];
      const pregunta = ['¿Cuántos centímetros mide el ', v('L', 'largo'), ' de la plancha?'];
      const errores = [
        h('caja-sin-sumar-recortes', base, `${n(base)} cm es el largo del fondo de la caja. La plancha es más larga: se le quitaron dos recortes de ${k} cm.`),
        h('caja-un-solo-recorte', R / (k * (a - k)) + k, `Restaste un solo recorte a cada medida. Se recorta en las dos puntas de cada lado: el fondo mide (${a} − 2x) por (L − 2x).`),
        { ...h('AL16', base - 2 * k, `Al despejar restaste ${2 * k} en vez de sumarlo. Si L − ${2 * k} = ${n(base)}, entonces L = ${n(base)} + ${2 * k}.`), fuente: AL16 },
        h('caja-sin-altura', R / (a - 2 * k) + 2 * k, `Usaste solo el área del fondo. El volumen es fondo por altura, y la altura es x = ${k}.`),
      ];
      const solucion = [
        ['El fondo mide (', v('a', String(a)), ' − 2x) por (', v('L', 'L'), ' − 2x) y la altura es x: V(x) = x(', v('a', String(a)), ' − 2x)(', v('L', 'L'), ' − 2x).'],
        ['Teorema del resto: el resto entre x − ', v('x', String(k)), ' es V(', v('x', String(k)), `) = ${k}·${a - 2 * k}·(L − ${2 * k}) = `, v('R', n(R)), '.'],
        [`L − ${2 * k} = ${n(R)}/${k * (a - 2 * k)} = ${n(base)}, así que `, v('L', `L = ${n(base + 2 * k)} cm`), '.'],
      ];
      return { correcta: base + 2 * k, unidad: 'cm', errores, variables, enunciado, pregunta, solucion, datos: { a, k, R } };
    }
    const b = rng.elegir([16, 20, 24, 30]);
    if (b >= a) return null;
    const V = x => x * (a - 2 * x) * (b - 2 * x), correcta = V(k);
    const variables = { x: { nombre: 'lado del recorte', color: 'o' }, a: { nombre: 'largo de la plancha', color: 'i' }, b: { nombre: 'ancho de la plancha', color: 'h' }, R: { nombre: 'resto', color: 'd' } };
    const enunciado = [`${lugar}, de una plancha de cartón de `, v('a', `${a} cm`), ' por ', v('b', `${b} cm`), ' se recortan en las cuatro esquinas cuadrados de ', v('x', 'x cm'), ' de lado y se doblan los bordes para formar una caja sin tapa. Su volumen V(x), en cm³, es un polinomio en x.'];
    const pregunta = ['¿Cuál es el ', v('R', 'resto'), ' de dividir V(x) entre x − ', v('x', String(k)), '?'];
    const errores = [
      h('PO8-raiz-signo-cambiado', V(-k), `Evaluaste en x = −${k}. La raíz de x − ${k} es ${k}: el resto es V(${k}).`),
      h('valor-en-uno-por-cero', V(1), 'Calculaste V(1), la suma de coeficientes. El resto entre x − k es V(k).'),
      h('caja-un-solo-recorte', k * (a - k) * (b - k), `Restaste un solo recorte a cada medida. Se recorta en las dos puntas: el fondo mide (${a} − 2x) por (${b} − 2x).`),
      h('caja-sin-altura', (a - 2 * k) * (b - 2 * k), `Calculaste solo el área del fondo. El volumen se multiplica por la altura, x = ${k}.`),
    ];
    const solucion = [
      ['El fondo mide (', v('a', String(a)), ' − 2x) por (', v('b', String(b)), ' − 2x) y la altura es x: V(x) = x(', v('a', String(a)), ' − 2x)(', v('b', String(b)), ' − 2x).'],
      ['Teorema del resto: el resto entre x − ', v('x', String(k)), ' es V(', v('x', String(k)), ').'],
      [`V(${k}) = ${k}·${a - 2 * k}·${b - 2 * k} = `, v('R', n(correcta)), '. (Es el volumen de la caja con recortes de ', v('x', `${k} cm`), '.)'],
    ];
    return { correcta, errores, negativos: true, variables, enunciado, pregunta, solucion, datos: { a, b, k } };
  };

  // ===================== MCD y MCM =====================
  const prodF = rs => rs.map(r => `(${factor(r)})`).join('');
  FUN.mcdmcm = function (rng, sub) {
    if (sub === 'mcd-valor') {
      const [r1, r2, r3] = rng.barajar([-3, -2, -1, 1, 2, 3]).slice(0, 3);
      const kx = rng.elegir([-2, -1, 2, 3, 4, 5]);
      if ([r1, r2, r3].includes(kx)) return null;
      const A = deRaices([r1, r1, r2]), B = deRaices([r1, r2, r3]);
      const [X, Y] = rng.moneda() ? [A, B] : [B, A];
      const mcd = (kx - r1) * (kx - r2), mcm = (kx - r1) ** 2 * (kx - r2) * (kx - r3);
      const variables = { x: { nombre: 'valor de x', color: 'o' }, M: { nombre: 'MCD', color: 'd' }, c: { nombre: 'MCD factorizado', color: 'i' } };
      const enunciado = [`Sean A(x) = ${polTxt(X)} y B(x) = ${polTxt(Y)}.`];
      const pregunta = ['¿Cuál es el valor numérico del ', v('M', 'MCD mónico'), ' de A(x) y B(x) para ', v('x', `x = ${n(kx)}`), '?'];
      const errores = [
        h('mcd-mayor-potencia', (kx - r1) ** 2 * (kx - r2), `Tomaste el factor (${factor(r1)}) con su mayor exponente. En el MCD cada factor común va con su menor exponente.`),
        h('mcd-por-mcm', mcm, 'Ese es el MCM: todos los factores con su mayor exponente. El MCD lleva solo los comunes, con su menor exponente.'),
        h('factor-raiz-signo', (kx + r1) * (kx + r2), `Escribiste los factores con el signo de la raíz cambiado. Si ${n(r1)} anula al polinomio, el factor es ${factor(r1)}.`),
        h('mcd-solo-repetido', kx - r1, `Te quedaste solo con (${factor(r1)}). (${factor(r2)}) también divide a los dos polinomios.`),
      ];
      const solucion = [
        [`Factorizando (con Ruffini o buscando raíces): A(x) = ${prodF(X === A ? [r1, r1, r2] : [r1, r2, r3])} y B(x) = ${prodF(X === A ? [r1, r2, r3] : [r1, r1, r2])}.`.replace(/\((x[^)]*)\)\(\1\)/, (_, f) => `(${f})²`)],
        ['Factores comunes con su menor exponente: ', v('c', `(${factor(r1)})(${factor(r2)})`), '. Ese es el MCD.'],
        ['En ', v('x', `x = ${n(kx)}`), `: (${n(kx)} ${r1 < 0 ? '+ ' + n(-r1) : '− ' + n(r1)})(${n(kx)} ${r2 < 0 ? '+ ' + n(-r2) : '− ' + n(r2)}) = `, v('M', n(mcd)), '.'],
      ];
      if (mcd === 0) return null;
      return { correcta: mcd, negativos: true, errores, variables, enunciado, pregunta, solucion, datos: { A: X, B: Y, x: kx } };
    }
    if (sub === 'mcm-dado') {
      const [r1, r2, s, t] = rng.barajar([-3, -2, -1, 1, 2, 3, 4]).slice(0, 4);
      const kx = rng.elegir([-1, 0, 2, 5]);
      if ([r1, r2, s, t].includes(kx)) return null;
      const D = deRaices([r1, r2]), A = deRaices([r1, r2, s]), B = deRaices([r1, r2, t]);
      const cB = B[3], Dk = evalP(D, kx);
      const correcta = Dk * (kx - s) * (kx - t);
      const variables = { D: { nombre: 'MCD', color: 'i' }, c: { nombre: 'término independiente de B', color: 'o' }, t: { nombre: 'factor que falta de B', color: 'h' }, M: { nombre: 'MCM', color: 'd' } };
      const enunciado = ['El ', v('D', 'MCD mónico'), ' de A(x) y B(x) es ', v('D', polTxt(D)), `. Se sabe que A(x) = ${polTxt(A)} y que B(x) es un polinomio cúbico mónico cuyo término independiente es `, v('c', n(cB)), '.'];
      const pregunta = ['¿Cuál es el valor numérico del ', v('M', 'MCM mónico'), ` de A(x) y B(x) para x = ${n(kx)}?`];
      const errores = [
        h('mcm-producto', evalP(A, kx) * evalP(B, kx), 'Multiplicaste A·B. Así el MCD queda contado dos veces: el MCM es A·B dividido entre el MCD.'),
        h('mcd-por-mcm', Dk, `Ese es el valor del MCD en x = ${n(kx)}. El MCM lleva además los factores que no son comunes.`),
        { ...h('AL16', [r1, r2, s].includes(-t) ? NaN : Dk * (kx - s) * (kx + t), `Despejaste mal el signo del factor que falta de B. Su término independiente es ${n(D[2])}·(−t) = ${n(cB)}: t = ${n(t)}, y el factor es ${factor(t)}.`), fuente: AL16 },
        h('mcm-sin-completar', evalP(A, kx), `Ese es A(${n(kx)}). Al MCM le falta el factor de B que no está en A.`),
      ];
      const solucion = [
        ['B(x) contiene al ', v('D', 'MCD'), ' y es cúbico mónico: B(x) = (', v('D', polTxt(D)), ')(x − t).'],
        ['Término independiente: ', `${n(D[2])}·(−t) = `, v('c', n(cB)), ' → ', v('t', `t = ${n(t)}`), '.'],
        [`Dividiendo A(x) entre el MCD queda ${factor(s)}. El MCM es (${polTxt(D)})(${factor(s)})(${factor(t)}).`],
        [`En x = ${n(kx)}: ${n(Dk)}·(${n(kx - s)})·(${n(kx - t)}) = `, v('M', n(correcta)), '.'],
      ];
      if (correcta === 0) return null;
      return { correcta, negativos: true, errores, variables, enunciado, pregunta, solucion, datos: { D, A, cB, x: kx } };
    }
    // grado
    const raices = rng.barajar([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]).slice(0, 4);
    const eA = [rng.entero(1, 4), rng.entero(1, 4), rng.entero(1, 3), 0];
    const eB = [rng.entero(1, 4), rng.entero(1, 4), 0, rng.entero(1, 3)];
    const pide = rng.elegir(['mcm', 'mcd']);
    const gA = eA.reduce((x, y) => x + y), gB = eB.reduce((x, y) => x + y);
    const gMCD = Math.min(eA[0], eB[0]) + Math.min(eA[1], eB[1]);
    const gMCM = eA.map((e, i) => Math.max(e, eB[i])).reduce((x, y) => x + y);
    const maxComun = Math.max(eA[0], eB[0]) + Math.max(eA[1], eB[1]);
    const orden = rng.barajar([0, 1, 2, 3]);
    const fTo = e => orden.map(i => (e[i] ? `(${factor(raices[i])})${e[i] > 1 ? sup(e[i]) : ''}` : '')).join('');
    const variables = { G: { nombre: `grado del ${pide.toUpperCase()}`, color: 'd' }, c: { nombre: 'factores comunes', color: 'i' }, nc: { nombre: 'factores no comunes', color: 'o' } };
    const enunciado = [`Sean A(x) = ${fTo(eA)} y B(x) = ${fTo(eB)}.`];
    const pregunta = ['¿Cuál es el ', v('G', `grado del ${pide.toUpperCase()}`), ' de A(x) y B(x)?'];
    const comunes = [0, 1].map(i => `(${factor(raices[i])})`).join(' y ');
    let correcta, errores;
    if (pide === 'mcm') {
      correcta = gMCM;
      errores = [
        h('grado-mcm-suma', gA + gB, `Sumaste los grados de A y B (${gA} + ${gB}). Eso es el grado de A·B: los factores comunes quedan contados dos veces.`),
        h('mcd-mcm-al-reves', gMCD, 'Ese es el grado del MCD (comunes con su menor exponente). El MCM lleva todos los factores con su mayor exponente.'),
        h('mcm-solo-comunes', maxComun, 'Tomaste solo los factores comunes. El MCM lleva también los que están en uno solo de los polinomios.'),
        h('mcm-menor-potencia', Math.min(eA[0], eB[0]) + Math.min(eA[1], eB[1]) + eA[2] + eB[3], 'Tomaste los comunes con su menor exponente. En el MCM cada factor va con su mayor exponente.'),
      ];
    } else {
      correcta = gMCD;
      errores = [
        h('mcd-mcm-al-reves', gMCM, 'Ese es el grado del MCM. El MCD lleva solo los factores comunes, con su menor exponente.'),
        h('mcd-mayor-potencia', maxComun, 'Tomaste los factores comunes con su mayor exponente. En el MCD cada uno va con el menor.'),
        h('mcd-sin-exponentes', 2, 'Contaste cuántos factores comunes hay, sin sus exponentes. El grado suma los exponentes.'),
        h('mcd-con-no-comunes', gMCD + eA[2] + eB[3], 'Metiste también los factores que no son comunes. El MCD lleva solo los que dividen a los dos.'),
      ];
    }
    const solucion = [
      ['Factores comunes: ', v('c', comunes), '. No comunes: ', v('nc', `(${factor(raices[2])}) y (${factor(raices[3])})`), '.'],
      pide === 'mcd'
        ? [`MCD: los comunes con su menor exponente, ${Math.min(eA[0], eB[0])} y ${Math.min(eA[1], eB[1])}. Grado: `, v('G', n(correcta)), '.']
        : [`MCM: todos los factores con su mayor exponente, ${eA.map((e, i) => Math.max(e, eB[i])).join(', ')}. Grado: `, v('G', n(correcta)), '.'],
    ];
    return { correcta, errores, variables, enunciado, pregunta, solucion, datos: { pide, raices, eA, eB } };
  };

  return { id: ID, titulo: 'División de polinomios, cocientes notables, MCD y MCM', generar };
});
