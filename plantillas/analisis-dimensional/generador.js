/*
 * Generador «La balanza de dimensiones»: principio de homogeneidad. Amplía la balanza de
 * plantillas/vectores/ (que trabaja una constante en d = P·t + Q·t², los exponentes de un tiempo de
 * caída y ω dentro de un seno) con fórmulas nuevas, constantes en ecuaciones inventadas pero
 * coherentes, cocientes de constantes y proposiciones teóricas. Unidad fisica.magnitudes-y-vectores.
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['analisis-dimensional']) y en Node (require). No usa ningún motor.
 *
 * Tipos:
 *   exponentes    una magnitud se propone como Q = k·a^x·b^y(·c^z), con k un número; se pide un
 *                 exponente (sub uno) o la suma de los exponentes (sub suma). Respuesta numérica,
 *                 escrita como fracción («−1/2»).
 *   constante     una ecuación física inventada y dimensionalmente correcta. Respuesta: una dimensión
 *                 («ML²T⁻²», o «1» si es adimensional), con armarTexto.
 *                 sub suma        la constante de un término de una suma: [A]
 *                 sub argumento   la constante dentro de un seno, un coseno, una exponencial o un
 *                                 logaritmo: el argumento no tiene dimensión
 *                 sub combinada   el cociente de las constantes de dos términos: [A/B]
 *   proposiciones tres proposiciones V/F sobre la homogeneidad y las magnitudes fundamentales y
 *                 derivadas; la respuesta es la secuencia (armarTexto).
 *
 * Convenciones: dimensiones con M (masa), L (longitud), T (tiempo) y Θ (temperatura); los números,
 * los ángulos en radianes y las funciones sen, cos, e^( ) y log son adimensionales.
 * Errores: AD-todos-uno, AD-constante-igual-al-miembro, AD-multiplica, AD-sin-exponente y
 * AD-argumento-con-dimension, los mismos códigos que la balanza de plantillas/vectores/index.html;
 * PR2-raiz (docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md); AD-no-detecta, la trampa de la
 * fila 2019-II #103 del lote, y los demás AD- nuevos. Todos son hipótesis: no hay informe de ideas
 * erróneas en análisis dimensional.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'analisis-dimensional';
  const TRANS = 'docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md';
  const BAL = 'plantillas/vectores/index.html';
  const v = P.v;

  // ---- Dimensiones: { M, L, T, Θ } con exponentes enteros o fraccionarios ----
  const BASES = ['M', 'L', 'T', 'Θ'];
  const dim = (M = 0, L = 0, T = 0, Th = 0) => ({ M, L, T, 'Θ': Th });
  const mul = (a, b) => dim(a.M + b.M, a.L + b.L, a.T + b.T, a['Θ'] + b['Θ']);
  const pot = (a, k) => dim(a.M * k, a.L * k, a.T * k, a['Θ'] * k);
  const div = (a, b) => mul(a, pot(b, -1));
  const UNO = dim();
  const SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
  const fr = x => P.textoFraccion(P.frac(Math.round(x * 6), 6));
  function texto(d) {
    const partes = BASES.filter(b => Math.abs(d[b]) > 1e-12).map(b => {
      if (Math.abs(d[b] - 1) < 1e-12) return b;
      if (Number.isInteger(d[b])) return b + [...String(d[b])].map(c => SUP[c]).join('');
      return `${b}^(${fr(d[b])})`;
    });
    return partes.length ? partes.join('') : '1 (adimensional)';
  }
  const clave = d => 'dim:' + BASES.map(b => fr(d[b])).join(',');
  const opcion = d => ({ clave: clave(d), texto: texto(d) });

  // Magnitudes: símbolo, nombre con artículo y dimensión.
  const MAG = {
    m: ['m', 'la masa', dim(1)], h: ['h', 'la altura', dim(0, 1)], x: ['x', 'la posición', dim(0, 1)], R: ['R', 'el radio', dim(0, 1)],
    L: ['L', 'el largo', dim(0, 1)], d: ['d', 'la deformación', dim(0, 1)], S: ['S', 'el área', dim(0, 2)], t: ['t', 'el tiempo', dim(0, 0, 1)], v: ['v', 'la rapidez', dim(0, 1, -1)], a: ['a', 'la aceleración', dim(0, 1, -2)],
    g: ['g', 'la aceleración de la gravedad', dim(0, 1, -2)], F: ['F', 'la fuerza', dim(1, 1, -2)], E: ['E', 'la energía', dim(1, 2, -2)],
    W: ['W', 'el trabajo', dim(1, 2, -2)], Pot: ['P', 'la potencia', dim(1, 2, -3)], p: ['p', 'la presión', dim(1, -1, -2)],
    rho: ['ρ', 'la densidad', dim(1, -3)], A: ['A', 'el área', dim(0, 2)], V: ['V', 'el volumen', dim(0, 3)], f: ['f', 'la frecuencia', dim(0, 0, -1)],
    w: ['ω', 'la velocidad angular', dim(0, 0, -1)], Q: ['Q', 'el caudal', dim(0, 3, -1)], q: ['q', 'la cantidad de movimiento', dim(1, 1, -1)],
    sig: ['σ', 'la tensión superficial', dim(1, 0, -2)], K: ['K', 'la constante del resorte', dim(1, 0, -2)], mu: ['μ', 'la densidad lineal de la cuerda', dim(1, -1)],
    G: ['G', 'la constante de gravitación', dim(-1, 3, -2)], M: ['M', 'la masa del planeta', dim(1)], Te: ['T', 'la temperatura', dim(0, 0, 0, 1)],
    c: ['c', 'el calor específico', dim(0, 2, -2, -1)], Ft: ['F', 'la tensión de la cuerda', dim(1, 1, -2)], Per: ['T', 'el periodo', dim(0, 0, 1)],
  };
  const sim = k => MAG[k][0], nom = k => MAG[k][1], D = k => MAG[k][2];

  // ---- exponentes: fórmulas propuestas con su respuesta ----
  const FORMULAS = [
    { q: 'Per', ctx: 'El periodo T de un péndulo simple', fs: ['L', 'g'], e: [0.5, -0.5] },
    { q: 'v', ctx: 'La rapidez v de una onda en una cuerda', fs: ['Ft', 'mu'], e: [0.5, -0.5] },
    { q: 'v', ctx: 'La rapidez v con que sale el agua por un agujero en el fondo de un tanque', fs: ['g', 'h'], e: [0.5, 0.5] },
    { q: 'Pot', ctx: 'La potencia P que entrega un molino de viento', fs: ['rho', 'A', 'v'], e: [1, 1, 3] },
    { q: 'F', ctx: 'La fuerza F del aire sobre un auto en la carretera', fs: ['rho', 'v', 'A'], e: [1, 2, 1] },
    { q: 'f', ctx: 'La frecuencia f con que oscila un bloque colgado de un resorte', fs: ['m', 'K'], e: [-0.5, 0.5] },
    { q: 'Per', ctx: 'El periodo T de un satélite en órbita circular', fs: ['R', 'G', 'M'], e: [1.5, -0.5, -0.5] },
    { q: 't', ctx: 'El tiempo t que tarda en caer una piedra soltada en un pozo', fs: ['h', 'g'], e: [0.5, -0.5] },
    { q: 'h', ctx: 'La altura máxima h de una pelota lanzada hacia arriba', fs: ['v', 'g'], e: [2, -1] },
    { q: 'f', ctx: 'La frecuencia f con que vibra una gota de agua', fs: ['sig', 'rho', 'R'], e: [0.5, -0.5, -1.5] },
    { q: 'F', ctx: 'La fuerza centrípeta F sobre una combi que da una curva', fs: ['m', 'v', 'R'], e: [1, 2, -1] },
    { q: 'p', ctx: 'La presión p que ejerce un chorro de agua al chocar contra una pared', fs: ['rho', 'v'], e: [1, 2] },
    { q: 'E', ctx: 'La energía E guardada en un resorte estirado una longitud d', fs: ['K', 'd'], e: [1, 2] },
    { q: 'v', ctx: 'La rapidez v de un satélite en órbita circular', fs: ['G', 'M', 'R'], e: [0.5, 0.5, -0.5] },
  ];
  const LETRAS = ['x', 'y', 'z'];
  // «−3x + 2y + z», sin coeficientes 1 ni términos con 0.
  function lineal(cs) {
    let t = '';
    cs.forEach((c, i) => {
      if (!c) return;
      const abs = Math.abs(c), term = (abs === 1 ? '' : fr(abs)) + LETRAS[i];
      t += t === '' ? (c < 0 ? '−' : '') + term : (c < 0 ? ' − ' : ' + ') + term;
    });
    return t || '0';
  }

  // Resuelve [q] = Π [f_i]^(x_i) por Gauss (exacto en racionales chicos). null si no hay solución única.
  function resolver(dq, dfs) {
    const n = dfs.length, filas = BASES.filter(b => Math.abs(dq[b]) > 0 || dfs.some(d => Math.abs(d[b]) > 0)).map(b => [...dfs.map(d => d[b]), dq[b]]);
    let fila = 0; const piv = [];
    for (let col = 0; col < n; col++) {
      let p = -1; for (let r = fila; r < filas.length; r++) if (Math.abs(filas[r][col]) > 1e-12 && (p < 0 || Math.abs(filas[r][col]) > Math.abs(filas[p][col]))) p = r;
      if (p < 0) return null;
      [filas[fila], filas[p]] = [filas[p], filas[fila]];
      const k = filas[fila][col]; for (let c = col; c <= n; c++) filas[fila][c] /= k;
      for (let r = 0; r < filas.length; r++) if (r !== fila) { const m = filas[r][col]; for (let c = col; c <= n; c++) filas[r][c] -= m * filas[fila][c]; }
      piv.push(col); fila++;
    }
    if (filas.slice(fila).some(r => Math.abs(r[n]) > 1e-9)) return null;
    return piv.map((_, i) => Math.round(filas[i][n] * 6) / 6);
  }

  const TIPOS = [['exponentes', 'uno'], ['exponentes', 'uno'], ['exponentes', 'suma'], ['exponentes', 'suma'],
    ['constante', 'suma'], ['constante', 'suma'], ['constante', 'argumento'], ['constante', 'argumento'], ['constante', 'combinada'],
    ['proposiciones', 'vf'], ['proposiciones', 'vf'], ['proposiciones', 'vf']];

  function generar(semilla) {
    const rng = Azar.crear(ID + '|' + semilla);
    const [tipo, sub] = rng.elegir(TIPOS);
    for (let intento = 0; intento < 5000; intento++) {
      const pr = tipo === 'exponentes' ? exponentes(rng, semilla, sub) : tipo === 'constante' ? constante(rng, semilla, sub) : proposiciones(rng, semilla);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }
  const salida = (semilla, o, alternativas, respuesta) => ({
    id: `${ID}#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
    alternativas, solucion: o.solucion, respuesta, _datos: o.datos,
  });

  // ---- exponentes ----
  function exponentes(rng, semilla, sub) {
    const F = rng.elegir(FORMULAS), n = F.fs.length;
    const dq = D(F.q), dfs = F.fs.map(D);
    const e = resolver(dq, dfs);
    const j = rng.entero(0, n - 1);
    const preguntar = vec => (sub === 'suma' ? vec.reduce((s, x) => s + x, 0) : vec[j]);
    const correcta = preguntar(e);
    const conRaiz = e.some(x => !Number.isInteger(x));
    // Error de signo en T: los datos con el tiempo en el numerador (g como L·T², v como L·T).
    const conTvolteado = resolver(dq, dfs.map(d => dim(d.M, d.L, -d.T, d['Θ'])));
    const cruzado = e.slice(); [cruzado[0], cruzado[1]] = [cruzado[1], cruzado[0]];
    const hh = (id, vec, explicacion, fuente = BAL) => (vec ? { id, valor: preguntar(vec), explicacion, respaldo: 'hipotesis', fuente } : null);
    const errores = [
      hh('AD-todos-uno', F.fs.map(() => 1), 'Pusiste 1 en todos los exponentes, como si la fórmula fuera un simple producto. Los exponentes salen de igualar, base por base (M, L y T), las dimensiones de los dos lados.'),
      conRaiz ? hh('PR2-raiz', e.map(x => 2 * x), 'Te salió el doble: igualaste bien las bases pero olvidaste dividir al final (es como olvidar una raíz cuadrada). Revisa cada ecuación de M, L y T y despeja cada exponente hasta el final.', TRANS)
        : hh('AD-exponente-mitad', e.map(x => x / 2), 'Te salió la mitad: dividiste de más al despejar. Revisa cada ecuación de M, L y T; aquí los exponentes son enteros.', null),
      hh('AD-signo-T', conTvolteado, 'Escribiste el tiempo en el numerador en alguna dimensión (por ejemplo, [g] = LT² en vez de LT⁻²). Cuando el tiempo divide, su exponente es negativo.', null),
      hh('AD-invierte', e.map(x => -x), 'Te salieron los exponentes con el signo cambiado: pusiste la magnitud que se pide en el otro lado de la ecuación. [Q] = Π[dato]^exp: las dimensiones de los datos, con sus exponentes, deben dar las de Q.', null),
      sub === 'uno' ? hh('AD-cruza-exponentes', cruzado, `Intercambiaste los exponentes de ${sim(F.fs[0])} y de ${sim(F.fs[1])}. Fíjate en qué base aparece cada magnitud: por ejemplo, la que trae masa es la única que puede equilibrar la M.`, null) : null,
    ].filter(Boolean);
    const variables = { q: { nombre: nom(F.q), color: 'o' }, a: { nombre: nom(F.fs[0]), color: 'i' }, b: { nombre: nom(F.fs[1]), color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
    // Los dos primeros factores llevan color; el tercero (si hay) va sin color, para no confundirlo con lo que se pide.
    const col = i => (i === 0 ? 'a' : i === 1 ? 'b' : null);
    const vc = (k, t) => (k ? v(k, t) : t);
    const formula = [v('q', sim(F.q)), ' = k·', ...F.fs.flatMap((k, i) => [i ? '·' : '', vc(col(i), `${sim(k)}^${LETRAS[i]}`)])];
    const lista = F.fs.map((k, i) => `${nom(k)} (${sim(k)})`);
    const enunciado = [`${F.ctx} depende ${(lista.slice(0, -1).join(', ') + ' y ' + lista[n - 1]).replace(/^el /, 'del ').replace(/^la /, 'de la ')}, según `, ...formula, ', donde k es un número sin dimensión.'];
    const pide = sub === 'suma' ? ['¿Cuánto vale ', v('x', LETRAS.slice(0, n).join(' + ')), '?'] : ['¿Cuánto vale el exponente ', v('x', LETRAS[j]), '?'];
    const solucion = [
      ['Por homogeneidad, las dimensiones de los dos lados son iguales: [', v('q', sim(F.q)), '] = ', texto(dq), ' y ', ...F.fs.flatMap((k, i) => [i ? ', ' : '', `[${sim(k)}] = ${texto(D(k))}`]), '.'],
      ['Se iguala el exponente de cada base: ' + BASES.filter(b => Math.abs(dq[b]) > 0 || dfs.some(d => Math.abs(d[b]) > 0)).map(b =>
        `${b}: ${lineal(dfs.map(d => d[b]))} = ${fr(dq[b])}`).join('; ') + '.'],
      ['Resolviendo: ', ...e.flatMap((x, i) => [i ? ', ' : '', vc(col(i), `${LETRAS[i]} = ${fr(x)}`)]), sub === 'suma' ? [', y la suma es ', v('x', fr(correcta)), '.'] : ['. Entonces ', v('x', `${LETRAS[j]} = ${fr(correcta)}`), '.']].flat(),
    ];
    const o = { variables, enunciado, pregunta: pide, solucion, datos: { tipo: 'exponentes', sub, q: F.q, fs: F.fs, ...(sub === 'uno' ? { j } : {}) } };
    const alternativas = P.armar({ correcta, errores, rng, negativos: true, texto: fr });
    return salida(semilla, o, alternativas, { valor: correcta, unidad: '' });
  }

  // ---- constante ----
  const MIEMBROS = ['E', 'F', 'p', 'Pot', 'v', 'x', 'q', 'Q'];
  const FACTORES = ['v', 't', 'h', 'm', 'a', 'F', 'rho', 'S', 'f', 'V'];
  const PROCESOS = { E: 'la energía E que se le da a un sistema', F: 'la fuerza F sobre un cuerpo', p: 'la presión p dentro de un recipiente', Pot: 'la potencia P de un motor',
    v: 'la rapidez v de un móvil', x: 'la posición x de una partícula', q: 'la cantidad de movimiento q de un cuerpo', Q: 'el caudal Q de un río' };
  // Un término: constante · factor^exp (· factor^exp). Devuelve { segs, dim, dimUno }.
  function termino(rng, letra, color, excluir) {
    const nf = rng.elegir([1, 1, 2]), fs = rng.barajar(FACTORES.filter(k => !excluir.includes(k))).slice(0, nf);
    // A lo más un factor que divide, y va al final: «A·v²/a».
    const ex = fs.map((_, i) => rng.elegir(i === nf - 1 ? [1, 1, 2, 3, -1] : [1, 1, 2, 3]));
    const segs = [v(color, letra)];
    let d = UNO, d1 = UNO;
    fs.forEach((k, i) => {
      d = mul(d, pot(D(k), ex[i])); d1 = mul(d1, D(k));
      segs.push(ex[i] === -1 ? `/${sim(k)}` : `·${sim(k)}${ex[i] === 1 ? '' : SUP[String(ex[i])]}`);
    });
    return { segs, dim: d, dimUno: d1, fs, ex };
  }
  const lista = ks => { const t = ks.map(k => `${sim(k)} es ${nom(k)}`); return t.length > 1 ? t.slice(0, -1).join(', ') + ' y ' + t[t.length - 1] : t[0]; };

  function constante(rng, semilla, sub) {
    const mk = rng.elegir(MIEMBROS), dm = D(mk);
    const variables = { A: { nombre: 'constante A', color: 'o' }, B: { nombre: 'constante B', color: 'i' }, m: { nombre: PROCESOS[mk], color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
    const hh = (id, d, explicacion, fuente = null) => (d ? { id, ...opcion(d), explicacion, respaldo: 'hipotesis', fuente } : null);
    let enunciado, pregunta, correcta, errores, solucion, datos;
    if (sub === 'suma' || sub === 'combinada') {
      const t1 = termino(rng, 'A', 'A', [mk]), t2 = termino(rng, 'B', 'B', [mk, ...t1.fs]);
      const dA = div(dm, t1.dim), dB = div(dm, t2.dim);
      if ([dA, dB, div(dA, dB), t1.dim, t2.dim].some(d => BASES.some(b => Math.abs(d[b]) > 5))) return null;
      const usados = [...t1.fs, ...t2.fs];
      enunciado = [`En un laboratorio se propone que ${PROCESOS[mk]} cumple `, v('m', sim(mk)), ' = ', ...t1.segs, ' + ', ...t2.segs, `, donde ${lista(usados)}. La ecuación es dimensionalmente correcta.`];
      const base = [
        ['Homogeneidad: cada término de la suma tiene la dimensión del miembro izquierdo, [', v('m', sim(mk)), `] = ${texto(dm)}.`],
        ['Primer término: [', v('A', 'A'), `]·${texto(t1.dim)} = ${texto(dm)}, así que [`, v('A', 'A'), `] = ${texto(dA)}.`],
        ['Segundo término: [', v('B', 'B'), `]·${texto(t2.dim)} = ${texto(dm)}, así que [`, v('B', 'B'), `] = ${texto(dB)}.`],
      ];
      if (sub === 'suma') {
        pregunta = ['¿Cuál es la ', v('x', 'dimensión de A'), '?'];
        correcta = opcion(dA);
        errores = [
          hh('AD-constante-igual-al-miembro', dm, `Le diste a A la dimensión de ${sim(mk)}. Es el término completo, A por sus factores, el que pesa lo mismo que ${sim(mk)}: hay que dividir entre la dimensión de los factores.`, BAL),
          hh('AD-multiplica', mul(dm, t1.dim), `Multiplicaste por la dimensión de los factores en vez de dividir. Si [A]·[factores] = [${sim(mk)}], entonces [A] = [${sim(mk)}]/[factores].`, BAL),
          t1.ex.some(x => x !== 1) ? hh('AD-sin-exponente', div(dm, t1.dimUno), 'Dividiste entre los factores sin su exponente. Un factor al cuadrado pesa dos veces; uno que divide pesa con exponente −1.', BAL) : null,
          hh('AD-despeje-invertido', div(t1.dim, dm), `Despejaste al revés: [A] = [factores]/[${sim(mk)}]. Es [${sim(mk)}]/[factores].`),
          hh('AD-otro-termino', dB, `Esa es la dimensión de B, la constante del otro término. Cada constante se despeja de su propio término.`),
        ];
        solucion = [...base.slice(0, 2), ['Respuesta: [', v('x', 'A'), '] = ', v('x', texto(dA)), '.']];
      } else {
        const dq = div(dA, dB);
        pregunta = ['¿Cuál es la ', v('x', 'dimensión de A/B'), '?'];
        correcta = opcion(dq);
        errores = [
          hh('AD-producto-por-cociente', mul(dA, dB), 'Multiplicaste las dimensiones de A y de B. Se pide el cociente: [A/B] = [A]/[B].'),
          hh('AD-cociente-invertido', div(dB, dA), 'Calculaste [B/A], el cociente al revés.'),
          hh('AD-solo-A', dA, 'Esa es solo la dimensión de A. Falta dividir entre la de B.'),
          hh('AD-cociente-sin-dimension', UNO, 'Supusiste que A y B pesan lo mismo porque están en la misma ecuación. Lo que pesa igual son los términos completos (A con sus factores y B con los suyos), no las constantes solas.'),
          hh('AD-constante-igual-al-miembro', div(dm, dB), `Le diste a A la dimensión de ${sim(mk)}, sin dividir entre sus factores.`, BAL),
        ];
        solucion = [...base, ['Entonces [', v('x', 'A/B'), `] = ${texto(dA)} / ${texto(dB)} = `, v('x', texto(dq)), '.']];
      }
      datos = { tipo: 'constante', sub, miembro: mk, t1: { fs: t1.fs, ex: t1.ex }, t2: { fs: t2.fs, ex: t2.ex } };
    } else {
      // argumento: miembro = A·FUN(B·X^a)
      const xk = rng.elegir(['t', 'h', 'x', 'V', 'm', 'v', 'f']), a = rng.elegir([1, 1, 1, 2]);
      if (xk === mk) return null;
      const fun = rng.elegir(['sen', 'cos', 'exp', 'log']);
      const dX = pot(D(xk), a), dB = pot(dX, -1), pideAB = rng.moneda();
      const inner = [v('B', 'B'), `·${sim(xk)}${a === 1 ? '' : SUP[String(a)]}`];
      const cuerpo = fun === 'exp' ? ['e^(−', ...inner, ')'] : fun === 'log' ? ['log(', ...inner, ')'] : [`${fun}(`, ...inner, ')'];
      enunciado = [`Se propone que ${PROCESOS[mk]} cambia según `, v('m', sim(mk)), ' = ', v('A', 'A'), '·', ...cuerpo, `, donde ${lista([xk])}. La ecuación es dimensionalmente correcta.`];
      const nombreFun = fun === 'exp' ? 'una exponencial' : fun === 'log' ? 'un logaritmo' : `un ${fun === 'sen' ? 'seno' : 'coseno'}`;
      const base = [
        [`Lo que va dentro de ${nombreFun} debe ser un número sin dimensión: [`, v('B', 'B'), `]·${texto(dX)} = 1, así que [`, v('B', 'B'), `] = ${texto(dB)}.`],
        [`${nombreFun.replace(/^un[a]? /, (m) => m === 'una ' ? 'La ' : 'El ')} no tiene dimensión, así que [`, v('A', 'A'), '] = [', v('m', sim(mk)), `] = ${texto(dm)}.`],
      ];
      if (!pideAB) {
        pregunta = ['¿Cuál es la ', v('x', 'dimensión de B'), '?'];
        correcta = opcion(dB);
        errores = [
          hh('AD-copia-dimension', dX, `Le diste a B la misma dimensión que ${sim(xk)}${a === 1 ? '' : SUP[String(a)]}. B debe cancelarla para que el argumento quede sin dimensión: [B] es la inversa.`),
          hh('AD-argumento-con-dimension', div(dm, dX), `Hiciste que B·${sim(xk)}${a === 1 ? '' : SUP[String(a)]} pesara lo mismo que ${sim(mk)}. Dentro de ${nombreFun} solo puede ir un número: el argumento es adimensional.`, BAL),
          hh('AD-constante-sin-dimension', UNO, `Supusiste que B no tiene dimensión porque está dentro de ${nombreFun}. Lo adimensional es el producto B·${sim(xk)}${a === 1 ? '' : SUP[String(a)]}; para eso, B tiene que tener la dimensión inversa.`),
          hh('AD-constante-igual-al-miembro', dm, `Le diste a B la dimensión de ${sim(mk)}. Esa es la dimensión de A; B se despeja del argumento, que es adimensional.`, BAL),
        ];
        solucion = [base[0], ['Respuesta: [', v('x', 'B'), '] = ', v('x', texto(dB)), '.']];
      } else {
        const dAB = mul(dm, dB);
        pregunta = ['¿Cuál es la ', v('x', 'dimensión de A·B'), '?'];
        correcta = opcion(dAB);
        errores = [
          hh('AD-argumento-con-dimension', mul(dm, div(dm, dX)), `Hiciste que B·${sim(xk)}${a === 1 ? '' : SUP[String(a)]} pesara lo mismo que ${sim(mk)}. Dentro de ${nombreFun} solo puede ir un número.`, BAL),
          hh('AD-copia-dimension', mul(dm, dX), `Le diste a B la dimensión de ${sim(xk)}${a === 1 ? '' : SUP[String(a)]}. Para que el argumento sea un número, B debe tener la dimensión inversa.`),
          hh('AD-constante-sin-dimension', dm, `Tomaste B como un número sin dimensión porque está dentro de ${nombreFun}. Lo adimensional es el producto B·${sim(xk)}${a === 1 ? '' : SUP[String(a)]}.`),
          hh('AD-solo-B', dB, 'Esa es solo la dimensión de B. Falta multiplicar por la de A, que es la del miembro izquierdo.'),
        ];
        solucion = [...base, ['[', v('x', 'A·B'), `] = ${texto(dm)} · ${texto(dB)} = `, v('x', texto(dAB)), '.']];
      }
      datos = { tipo: 'constante', sub, miembro: mk, fun, x: xk, a, pide: pideAB ? 'AB' : 'B' };
    }
    const o = { variables, enunciado, pregunta, solucion, datos };
    // Distractores con exponentes desmedidos (más de 6) no engañan a nadie: se dejan fuera.
    const grande = e => /[⁷⁸⁹]|[¹][⁰-⁹]/.test(e.texto);
    const alternativas = P.armarTexto({ correcta, errores: errores.filter(e => e && !grande(e)), rng });
    return salida(semilla, o, alternativas, { valor: correcta.clave, texto: correcta.texto, unidad: '' });
  }

  // ---- proposiciones ----
  const PROPS = [
    { id: 'H1', v: true, idea: 'detecta', t: 'Si una ecuación no es dimensionalmente homogénea, entonces es incorrecta.', por: 'Una ecuación física correcta siempre es homogénea; si no lo es, tiene un error. Por eso la homogeneidad sirve para detectar errores.' },
    { id: 'H2', v: false, idea: 'detecta', t: 'El principio de homogeneidad no sirve para detectar errores en una ecuación física.', por: 'Sí sirve: si los términos de una ecuación no tienen la misma dimensión, la ecuación está mal.' },
    { id: 'H3', v: true, idea: 'detecta', t: 'En una ecuación física correcta, todos los términos de una suma tienen la misma dimensión.', por: 'Es el principio de homogeneidad: solo se suman o se igualan cantidades de la misma dimensión.' },
    { id: 'S1', v: false, idea: 'suficiente', t: 'Toda ecuación dimensionalmente homogénea es físicamente correcta.', por: 'La homogeneidad es necesaria pero no suficiente: E = m·v² es homogénea y le falta el ½.' },
    { id: 'S2', v: true, idea: 'suficiente', t: 'Con el análisis dimensional no se puede hallar el valor de las constantes numéricas de una fórmula, como el 2π del péndulo.', por: 'Los números no tienen dimensión, así que el análisis dimensional no los ve: se hallan con la teoría o con un experimento.' },
    { id: 'S3', v: true, idea: 'suficiente', t: 'Una ecuación puede ser dimensionalmente homogénea y estar equivocada en un factor numérico.', por: 'La homogeneidad no ve los números: E = m·v² pesa lo mismo que E = ½·m·v².' },
    { id: 'N1', v: false, idea: 'numeros', t: 'El número 2π de la fórmula T = 2π·√(L/g) tiene dimensión de tiempo.', por: 'Los números, como 2π, no tienen dimensión: el tiempo lo da √(L/g).' },
    { id: 'N2', v: true, idea: 'numeros', t: 'Los números, los ángulos medidos en radianes y las funciones como sen x no tienen dimensión.', por: 'Su dimensión es 1: no cambian la dimensión de un término.' },
    { id: 'N3', v: false, idea: 'numeros', t: 'En la expresión sen(ω·t), el producto ω·t tiene dimensión de tiempo.', por: 'El argumento de un seno es un ángulo, sin dimensión: ω·t es adimensional, por eso [ω] = T⁻¹.' },
    { id: 'F1', v: true, idea: 'fundamental', t: 'La masa, la longitud, el tiempo y la temperatura son magnitudes fundamentales del SI.', por: 'El SI tiene siete magnitudes fundamentales: longitud, masa, tiempo, intensidad de corriente, temperatura, cantidad de sustancia e intensidad luminosa.' },
    { id: 'F2', v: false, idea: 'fundamental', t: 'La fuerza es una magnitud fundamental del SI.', por: 'La fuerza es derivada: sale de la masa, la longitud y el tiempo, [F] = MLT⁻².' },
    { id: 'F3', v: false, idea: 'fundamental', t: 'La velocidad es una magnitud fundamental, porque se mide directamente con el velocímetro.', por: 'La velocidad es derivada, [v] = LT⁻¹: sale de dividir una longitud entre un tiempo, aunque un aparato la muestre directamente.' },
    { id: 'F4', v: true, idea: 'fundamental', t: 'La presión es una magnitud derivada.', por: 'La presión es fuerza entre área: [p] = ML⁻¹T⁻², derivada de M, L y T.' },
    { id: 'A1', v: false, idea: 'suma', t: 'Se puede sumar una velocidad con una aceleración si las dos están en unidades del SI.', por: 'Solo se suman magnitudes de la misma dimensión: LT⁻¹ y LT⁻² no se pueden sumar, estén en las unidades que estén.' },
    { id: 'A2', v: false, idea: 'suma', t: 'Al sumar dos longitudes, el resultado tiene dimensión L².', por: 'Sumar no cambia la dimensión: L + L sigue siendo L. Las dimensiones se suman (en el exponente) solo al multiplicar.' },
    { id: 'A3', v: true, idea: 'suma', t: 'Si A + B = C es una ecuación física correcta, entonces A, B y C tienen la misma dimensión.', por: 'Es el principio de homogeneidad aplicado a una suma: [A] = [B] = [C].' },
    { id: 'U1', v: false, idea: 'unica', t: 'Si dos magnitudes tienen la misma dimensión, son la misma magnitud física.', por: 'El trabajo y el momento de una fuerza tienen la misma dimensión, ML²T⁻², y son magnitudes distintas.' },
    { id: 'U2', v: true, idea: 'unica', t: 'El trabajo y la energía cinética tienen la misma dimensión.', por: 'Los dos son ML²T⁻²: el trabajo cambia la energía cinética, así que tienen que pesar igual.' },
  ];
  const IDEAS = {
    detecta: { id: 'AD-no-detecta', que: 'creer que la homogeneidad no sirve para detectar errores' },
    suficiente: { id: 'AD-homogenea-es-correcta', que: 'creer que una ecuación homogénea ya es correcta' },
    numeros: { id: 'AD-numeros-con-dimension', que: 'darles dimensión a los números o a los argumentos de las funciones' },
    fundamental: { id: 'AD-fundamental-derivada', que: 'confundir magnitudes fundamentales con derivadas' },
    suma: { id: 'AD-suma-distintas', que: 'creer que se pueden sumar magnitudes de distinta dimensión, o que sumar cambia la dimensión' },
    unica: { id: 'AD-misma-dimension-misma-magnitud', que: 'creer que cada dimensión corresponde a una sola magnitud' },
  };
  const ROMANOS = ['I', 'II', 'III'];
  const vf = arr => arr.map(b => (b ? 'V' : 'F')).join('');
  function proposiciones(rng, semilla) {
    // La trampa de la fila del lote (AD-no-detecta) sale en la mitad de los problemas.
    const resto = rng.barajar(Object.keys(IDEAS).filter(i => i !== 'detecta'));
    const ideas = rng.barajar(rng.moneda() ? ['detecta', ...resto.slice(0, 2)] : resto.slice(0, 3));
    const elegidas = ideas.map(i => rng.elegir(PROPS.filter(p => p.idea === i)));
    const verdad = elegidas.map(p => p.v);
    const correcta = { clave: 'vf:' + vf(verdad), texto: vf(verdad) };
    const errores = elegidas.map((p, j) => {
      const otra = verdad.slice(); otra[j] = !otra[j];
      return { id: IDEAS[p.idea].id, clave: 'vf:' + vf(otra), texto: vf(otra), respaldo: 'hipotesis', fuente: p.idea === 'detecta' ? 'docs/clasificacion/trampas-admision-unmsm/fisica.md' : null,
        explicacion: `Juzgaste mal la proposición ${ROMANOS[j]}: es ${p.v ? 'verdadera' : 'falsa'}. El error de fondo es ${IDEAS[p.idea].que}. ${p.por}` };
    });
    const variables = { x: { nombre: 'lo que se pide', color: 'd' } };
    const enunciado = ['Sobre el análisis dimensional, indica si cada proposición es verdadera (V) o falsa (F).', ...elegidas.map((p, j) => ` ${ROMANOS[j]}. ${p.t}`)];
    const pregunta = ['¿Cuál es la ', v('x', 'secuencia correcta'), ' (I, II, III)?'];
    const solucion = [...elegidas.map((p, j) => [`${ROMANOS[j]}: ${p.v ? 'verdadera' : 'falsa'}. ${p.por}`]), ['Secuencia: ', v('x', correcta.texto), '.']];
    const o = { variables, enunciado, pregunta, solucion, datos: { tipo: 'proposiciones', sub: 'vf', props: elegidas.map(p => p.id) } };
    const alternativas = P.armarTexto({ correcta, errores, rng });
    return salida(semilla, o, alternativas, { valor: correcta.clave, texto: correcta.texto, unidad: '' });
  }

  return { id: ID, titulo: 'La balanza de dimensiones', generar };
});
