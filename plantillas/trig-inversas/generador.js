/*
 * Generador «trig-inversas»: funciones trigonométricas inversas en problemas de examen. Formato "predicciones"
 * (docs/arquitectura.md). Funciona en el navegador (window.Generadores['trig-inversas']) y en Node (require).
 *
 * Rangos principales: arcsen [−π/2; π/2], arccos [0; π], arctan ⟨−π/2; π/2⟩, arccot ⟨0; π⟩,
 * arcsec [0; π] − {π/2} (arcsec u = arccos(1/u)), arccsc [−π/2; π/2] − {0} (arccsc u = arcsen(1/u)).
 *
 * Tipos y campos de _datos:
 *   complementaria  par 'sen-cos' (arcsen x y arccos x), 'tan-cot' (arctan x y arccot x) o 'sec-csc' (arcsec x y
 *                   arccsc x); f es la primera y g la segunda. forma 'diferencia': f(x) − g(x) = d·π (d = [n, den]);
 *                   'multiplo': m·f(x) = n·g(x); 'suma': f(x) + 2·g(x) = c·π (c = [n, den]). Se pide x.
 *   lugar           forma 'recta': arcsec(y − a·x) + arccsc(b·x + c) = π/2; se pide la ecuación de la recta
 *                   (respuesta de texto, clave 'recta:m,n' para y = m·x + n).
 *                   forma 'circunferencia': arcsec(x² + y² + c) + arccsc(2a·x + 2b·y) = π/2; se pide el radio.
 *   interseccion    las gráficas de y = arctan(m·x) e y = arccos x se cortan en P; m = [n, den, r]: m = (n/den)·√r
 *                   (r = 1 si no hay raíz). pide 'x2' (cuadrado de la abscisa), 'x' (abscisa) u 'ordenada' (en rad).
 *   transformacion  f(x) = A + B·arctan(C·x + D) con A = a·π/4. Se pide el rango y si f es creciente o decreciente
 *                   (respuesta de texto, clave 'lo|hi|sentido|abierto' con lo y hi en cuartos de π).
 *   dominio-puntos  f(x) = p·F(u) + q·G(u) con u = (x − h)/k, F 'arcsen' o 'arccos', G 'arcsec' o 'arccsc'.
 *                   Se pide la suma de los elementos del rango de f.
 *   sector          un sector circular de radio R (m) cuyo ángulo central es θ = Σ s·arcfn(k) (terminos: lista de
 *                   { f: 'arccos'|'arctan'|'arccot', k, s: +1 o −1 }). pide 'area' (m²) o 'arco' (m).
 *
 * Errores: IN1 a IN29 son los de plantillas/funciones-trig-inversas/motor.js (hipótesis); TR21 de
 * docs/investigacion/trigonometria-ideas-erroneas.md (parcial); los INV-… son hipótesis nuestras.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'trig-inversas';
  const TR = 'docs/investigacion/trigonometria-ideas-erroneas.md';
  const h = (id, valor, explicacion, texto) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente: null, texto });
  const pa = (id, valor, explicacion, texto) => ({ id, valor, explicacion, respaldo: 'parcial', fuente: TR, texto });
  const v = P.v;
  const PI = Math.PI, S2 = Math.sqrt(2), S3 = Math.sqrt(3), S5 = Math.sqrt(5);

  // ---------- números exactos ----------
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  const fr = (n, d = 1) => { const g = gcd(n, d), s = d < 0 ? -1 : 1; n = s * n / g; d = s * d / g; return (n < 0 ? '−' : '') + Math.abs(n) + (d === 1 ? '' : '/' + d); };
  const RAICES = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15, 17, 19, 21, 22, 23, 26, 29, 30, 31, 33, 34, 35, 37, 38, 39, 41];
  function ex(x) {
    if (!Number.isFinite(x) || Math.abs(x) > 1e5) return null;
    if (Math.abs(x) < 1e-9) return '0';
    for (let d = 1; d <= 400; d++) { const n = x * d, r = Math.round(n); if (Math.abs(n - r) < 1e-7) return fr(r, d); }
    for (const r of RAICES) {
      const s = Math.sqrt(r);
      for (let d = 1; d <= 24; d++) for (let q = 1; q <= 24; q++) for (const sg of [1, -1]) {
        const pn = x * d - sg * q * s, pr = Math.round(pn);
        if (Math.abs(pn - pr) < 1e-7 && Math.abs(pr) <= 500) return textoRaiz(pr, sg * q, r, d);
      }
    }
    return null;
  }
  function textoRaiz(p, q, r, d) {
    const tq = (Math.abs(q) === 1 ? '' : Math.abs(q)) + '√' + r;
    if (p === 0) return (q < 0 ? '−' : '') + tq + (d > 1 ? '/' + d : '');
    let dentro, menos = false;
    if (p > 0) dentro = `${p} ${q > 0 ? '+' : '−'} ${tq}`;
    else if (q > 0) dentro = `${tq} − ${-p}`;
    else { menos = true; dentro = `${-p} + ${tq}`; }
    if (d === 1) return menos ? `−${-p} − ${tq}` : dentro;
    return (menos ? '−' : '') + `(${dentro})/${d}`;
  }
  const pi = (x, u = '') => P.pi(x, u, 24);
  const ent = n => (n < 0 ? '−' + -n : String(n));

  // ---------- inversas de verdad (rango principal) ----------
  const ARC = {
    arcsen: u => (Math.abs(u) <= 1 + 1e-12 ? Math.asin(Math.max(-1, Math.min(1, u))) : NaN),
    arccos: u => (Math.abs(u) <= 1 + 1e-12 ? Math.acos(Math.max(-1, Math.min(1, u))) : NaN),
    arctan: u => Math.atan(u),
    arccot: u => (u === 0 ? PI / 2 : (u > 0 ? Math.atan(1 / u) : PI + Math.atan(1 / u))),
    arcsec: u => (Math.abs(u) >= 1 - 1e-12 ? Math.acos(Math.max(-1, Math.min(1, 1 / u))) : NaN),
    arccsc: u => (Math.abs(u) >= 1 - 1e-12 ? Math.asin(Math.max(-1, Math.min(1, 1 / u))) : NaN),
  };
  // Razón directa que deshace a cada inversa.
  const DIR = { arcsen: Math.sin, arccos: Math.cos, arctan: Math.tan, arccot: t => 1 / Math.tan(t), arcsec: t => 1 / Math.cos(t), arccsc: t => 1 / Math.sin(t) };
  const PARES = { 'sen-cos': ['arcsen', 'arccos'], 'tan-cot': ['arctan', 'arccot'], 'sec-csc': ['arcsec', 'arccsc'] };

  // ---------- cálculo (lo usa papel.json) ----------
  const calc = {
    // f(x) + g(x) = π/2 para los tres pares. Devuelve x y el ángulo f(x).
    complementaria: ({ par, forma, d, m, n, c }) => {
      const [f] = PARES[par];
      let ang;
      if (forma === 'diferencia') ang = (PI / 2 + d * PI) / 2;
      else if (forma === 'multiplo') ang = n / (m + n) * PI / 2;
      else ang = PI - c * PI; // f + 2g = cπ y f + g = π/2 → g = cπ − π/2 → f = π − cπ
      return { x: DIR[f](ang), angulo: ang };
    },
    // arcsec U + arccsc W = π/2 ⇔ U = W (|U| ≥ 1).
    recta: ({ a, b, c }) => ({ pendiente: a + b, ordenada: c }),
    circunferencia: ({ a, b, c }) => ({ radio: Math.sqrt(a * a + b * b - c), cx: a, cy: b }),
    // arctan(m x) = arccos x = θ: cos θ = x y tan θ = m x → m x² = sen θ → m²x⁴ + x² − 1 = 0.
    interseccion: ({ m }) => { const x2 = (-1 + Math.sqrt(1 + 4 * m * m)) / (2 * m * m); return { x2, x: Math.sqrt(x2), ordenada: Math.acos(Math.sqrt(x2)) }; },
    // A + B·arctan(Cx + D): rango ⟨A − |B|π/2; A + |B|π/2⟩, creciente si B·C > 0.
    transformacion: ({ A, B, C }) => ({ lo: A - Math.abs(B) * PI / 2, hi: A + Math.abs(B) * PI / 2, creciente: B * C > 0 ? 1 : 0 }),
    // El dominio de F(u) con G(u) es u = ±1; el rango, los valores distintos de f ahí.
    dominioPuntos: ({ p, F, q, G }) => {
      const val = u => p * ARC[F](u) + q * ARC[G](u);
      const vals = [val(1), val(-1)];
      const distintos = Math.abs(vals[0] - vals[1]) < 1e-12 ? [vals[0]] : vals;
      return { suma: distintos.reduce((s, x) => s + x, 0), elementos: distintos.length, enUno: vals[0], enMenosUno: vals[1] };
    },
    // θ = Σ s·arcfn(k); área θR²/2 y arco θR.
    sector: ({ terminos, R }) => { const th = terminos.reduce((s, t) => s + t.s * ARC[t.f](t.k), 0); return { angulo: th, area: th * R * R / 2, arco: th * R }; },
  };

  // ---------- armado ----------
  // Valores con texto exacto (ex), o con el texto que trae el error (un ángulo con π, una raíz anidada).
  function armarNum(rng, correcta, textoCorrecta, errores, { texto = ex, unidad = '' } = {}) {
    const tx = x => { const t = texto(x); return t === null ? null : (unidad ? `${t} ${unidad}` : t); };
    const especiales = new Map();
    const clave = x => x.toFixed(9);
    if (textoCorrecta) especiales.set(clave(correcta), textoCorrecta);
    for (const e of errores) if (e && e.texto && Number.isFinite(e.valor)) especiales.set(clave(e.valor), e.texto);
    const t = x => especiales.get(clave(x)) || tx(x);
    if (t(correcta) === null) return null;
    const lista = errores.filter(e => e && Number.isFinite(e.valor) && Math.abs(e.valor - correcta) > 1e-9 && t(e.valor) !== null)
      .map(({ texto: _t, ...resto }) => resto);
    return P.armar({ correcta, errores: lista, rng, negativos: true, texto: t });
  }

  // ---------- tipos ----------
  function complementaria(rng) {
    const par = rng.elegir(Object.keys(PARES)), [f, g] = PARES[par];
    const forma = rng.elegir(['diferencia', 'multiplo', 'suma']);
    const fn = f.slice(3), gn = g.slice(3);
    const co = { sen: 'cos', cos: 'sen', tan: 'cot', cot: 'tan', sec: 'csc', csc: 'sec' };
    const variables = { f: { nombre: `${f} x`, color: 'o' }, g: { nombre: `${g} x`, color: 'i' }, t: { nombre: 'ángulo', color: 'h' }, R: { nombre: 'x', color: 'd' } };
    let enun, dat, ang, pasos, ang11;
    if (forma === 'diferencia') {
      const d = rng.elegir([[1, 6], [-1, 6]]), dv = d[0] / d[1];
      ang = (PI / 2 + dv * PI) / 2;
      enun = [v('f', `${f} x`), ' − ', v('g', `${g} x`), ` = ${pi(dv * PI)}`];
      pasos = [[v('f', `${f} x`), ' + ', v('g', `${g} x`), ' = π/2 (siempre, para x en el dominio).'], [`Sumando con la condición: 2·${f} x = π/2 ${dv > 0 ? '+' : '−'} ${pi(Math.abs(dv) * PI)} = ${pi(2 * ang)} → ${f} x = `, v('t', pi(ang)), '.']];
      dat = { forma, d }; ang11 = (PI + dv * PI) / 2;
    } else if (forma === 'multiplo') {
      const [m, n] = rng.elegir([[1, 2], [2, 1], [1, 1]]);
      ang = n / (m + n) * PI / 2;
      enun = [m === 1 ? '' : `${m}·`, v('f', `${f} x`), ' = ', n === 1 ? '' : `${n}·`, v('g', `${g} x`)];
      pasos = [[v('f', `${f} x`), ' + ', v('g', `${g} x`), ' = π/2, así que ', v('g', `${g} x`), ` = π/2 − ${f} x.`],
        [`${m === 1 ? '' : m + '·'}${f} x = ${n === 1 ? '' : n + '·'}(π/2 − ${f} x) → ${m + n}·${f} x = ${pi(n * PI / 2)} → ${f} x = `, v('t', pi(ang)), '.']];
      dat = { forma, m, n }; ang11 = n / (m + n) * PI;
    } else {
      const c = rng.elegir([[2, 3], [5, 6], [3, 4]]), cv = c[0] / c[1];
      ang = PI - cv * PI;
      enun = [v('f', `${f} x`), ' + 2·', v('g', `${g} x`), ` = ${pi(cv * PI)}`];
      pasos = [['Como ', v('f', `${f} x`), ' + ', v('g', `${g} x`), ' = π/2, la condición queda π/2 + ', v('g', `${g} x`), ` = ${pi(cv * PI)}, así que ${g} x = ${pi(cv * PI - PI / 2)}.`],
        [`${f} x = π/2 − ${pi(cv * PI - PI / 2)} = `, v('t', pi(ang)), '.']];
      dat = { forma, c }; ang11 = PI - (cv * PI - PI); // con f + g = π: g = cπ − π y f = π − g
    }
    const x = DIR[f](ang);
    pasos.push([`x = ${fn}(${pi(ang)}) = `, v('R', ex(x)), '.']);
    if (par === 'sec-csc') pasos.push([`Control: |x| ≥ 1, así que x está en el dominio de arcsec y de arccsc.`]);
    const errores = [
      h('INV-da-el-angulo', ang, `Ese es el valor de ${f} x, el ángulo. Pedían x: hay que aplicarle ${fn} a ese ángulo.`, pi(ang)),
      h('IN7', DIR[g](ang), `Aplicaste ${gn} en vez de ${fn}: x = ${fn}(${f} x), no ${gn}(${f} x).`),
      h('IN11', DIR[f](ang11), `Usaste ${f} x + ${g} x = π. Las dos se complementan: suman π/2.`),
      h('INV-reciproco', 1 / x, `Invertiste el resultado: x = ${fn}(${pi(ang)}), no 1/${fn}(${pi(ang)}).`),
      h('IN29', -x, `Le cambiaste el signo. ${f} x = ${pi(ang)} es ${ang > 0 ? 'positivo' : 'negativo'}, y ${fn} de ese ángulo es ${x > 0 ? 'positivo' : 'negativo'}.`),
    ];
    return {
      variables,
      enunciado: ['Resuelve la ecuación ', ...enun, '.'],
      pregunta: ['¿Cuánto vale x?'],
      correcta: x, errores, solucion: pasos,
      datos: { tipo: 'complementaria', par, ...dat },
    };
  }

  const textoRecta = (m, n) => {
    const tm = m === 0 ? '' : (m === 1 ? 'x' : m === -1 ? '−x' : `${m < 0 ? '−' : ''}${Math.abs(m)}x`);
    const tn = n === 0 ? '' : (tm ? (n > 0 ? ` + ${n}` : ` − ${-n}`) : (n < 0 ? `−${-n}` : `${n}`));
    return `y = ${tm}${tn || (tm ? '' : '0')}`;
  };
  const lineal = (coefs) => { // [[coef, 'x'], [coef, 'y'], [coef, '']] → '2x − 3y + 4'
    let t = '';
    for (const [k, s] of coefs) {
      if (k === 0) continue;
      const a = Math.abs(k), cuerpo = s ? (a === 1 ? s : `${a}${s}`) : `${a}`;
      t += t === '' ? (k < 0 ? '−' : '') + cuerpo : (k < 0 ? ' − ' : ' + ') + cuerpo;
    }
    return t || '0';
  };

  function lugar(rng) {
    if (rng.moneda()) {
      let a, b, c;
      do { a = rng.elegir([-3, -2, -1, 1, 2, 3]); b = rng.entero(1, 4); c = rng.elegir([-4, -3, -2, -1, 1, 2, 3, 4]); } while (a + b === 0 || a === b);
      const U = lineal([[1, 'y'], [-a, 'x']]), W = lineal([[b, 'x'], [c, '']]);
      const variables = { U: { nombre: 'argumento del arcsec', color: 'o' }, W: { nombre: 'argumento del arccsc', color: 'i' }, R: { nombre: 'recta', color: 'd' } };
      const op = (m, n) => ({ clave: `recta:${m},${n}`, texto: textoRecta(m, n) });
      const errores = [
        { id: 'IN11', ...op(a - b, -c), explicacion: 'Tomaste arcsec u + arccsc w = π/2 como si pidiera w = −u. Con el mismo argumento, arcsec u + arccsc u = π/2: los argumentos son iguales.', respaldo: 'hipotesis' },
        { id: 'INV-signo-al-despejar', ...op(b - a, c), explicacion: `Al pasar ${a > 0 ? '−' : '+'}${Math.abs(a)}x al otro lado no le cambiaste el signo.`, respaldo: 'hipotesis' },
        { id: 'INV-olvida-termino', ...op(b, c), explicacion: `Olvidaste el término ${-a > 0 ? '+' : '−'} ${Math.abs(a)}x del argumento del arcsec al despejar y.`, respaldo: 'hipotesis' },
        { id: 'INV-signo-de-la-constante', ...op(a + b, -c), explicacion: 'Cambiaste el signo del término independiente al despejar.', respaldo: 'hipotesis' },
      ];
      return {
        variables, texto: true,
        enunciado: ['Los puntos (x; y) que cumplen arcsec(', v('U', U), ') + arccsc(', v('W', W), ') = π/2 están sobre una recta.'],
        pregunta: ['¿Cuál es la ecuación de esa recta?'],
        correcta: op(a + b, c), errores,
        solucion: [
          ['Para |u| ≥ 1, arcsec u + arccsc u = π/2. Como arccsc es inyectiva, arcsec U + arccsc W = π/2 obliga a que W = U.'],
          [v('U', U), ' = ', v('W', W), ` → y = ${lineal([[a, 'x']])} + ${lineal([[b, 'x'], [c, '']])}.`],
          [v('R', textoRecta(a + b, c)), ' (solo los puntos con |', v('W', W), '| ≥ 1, donde existen las dos funciones).'],
        ],
        datos: { tipo: 'lugar', forma: 'recta', a, b, c },
      };
    }
    let a, b, c, r2;
    for (;;) {
      a = rng.entero(-3, 3); b = rng.entero(-3, 3); c = rng.entero(-8, 8);
      if (a === 0 && b === 0) continue;
      r2 = a * a + b * b - c;
      if (r2 <= 0 || c === 0) continue;
      if (ex(Math.sqrt(r2)) === null) continue;
      break;
    }
    const U = lineal([[1, 'x²'], [1, 'y²'], [c, '']]), W = lineal([[2 * a, 'x'], [2 * b, 'y']]);
    const variables = { U: { nombre: 'argumento del arcsec', color: 'o' }, W: { nombre: 'argumento del arccsc', color: 'i' }, R: { nombre: 'radio', color: 'd' } };
    const r = Math.sqrt(r2);
    const errores = [
      h('INV-sin-raiz', r2, `Ese es r². El radio es su raíz cuadrada.`),
      h('INV-signo-de-la-constante', Math.sqrt(a * a + b * b + c), `Pasaste ${ent(c)} al otro lado sin cambiarle el signo.`),
      h('INV-completa-sin-mitad', Math.sqrt(4 * a * a + 4 * b * b - c), 'Al completar cuadrados usaste el coeficiente entero de x y de y. Se toma la mitad: x² − 2ax = (x − a)² − a².'),
      h('INV-olvida-completar', Math.sqrt(Math.abs(c)), 'Tomaste el término independiente como r². Antes hay que completar los cuadrados con los términos en x y en y.'),
      h('INV-diametro', 2 * r, 'Ese es el diámetro.'),
    ];
    const px = a === 0 ? 'x²' : `(x ${a > 0 ? '−' : '+'} ${Math.abs(a)})²`, py = b === 0 ? 'y²' : `(y ${b > 0 ? '−' : '+'} ${Math.abs(b)})²`;
    return {
      variables,
      enunciado: ['Los puntos (x; y) que cumplen arcsec(', v('U', U), ') + arccsc(', v('W', W), ') = π/2 están sobre una circunferencia.'],
      pregunta: ['¿Cuánto mide su radio?'],
      correcta: r, errores,
      solucion: [
        ['Para |u| ≥ 1, arcsec u + arccsc u = π/2; como arccsc es inyectiva, la condición obliga a que los dos argumentos sean iguales.'],
        [v('U', U), ' = ', v('W', W), ` → ${lineal([[1, 'x²'], [-2 * a, 'x'], [1, 'y²'], [-2 * b, 'y'], [c, '']])} = 0.`],
        [`Completando cuadrados: ${px} + ${py} = ${a * a + b * b} ${c > 0 ? '−' : '+'} ${Math.abs(c)} = ${r2}.`],
        ['r = √' + r2 + ' = ', v('R', ex(r)), '.'],
      ],
      datos: { tipo: 'lugar', forma: 'circunferencia', a, b, c },
    };
  }

  function interseccion(rng) {
    const caso = rng.elegir([
      { th: null, m: [1, 1, 1], mt: '' },
      { th: 30, m: [2, 3, 1], mt: '2x/3' }, { th: 45, m: [1, 1, 2], mt: '√2·x' }, { th: 60, m: [2, 1, 3], mt: '2√3·x' },
      { th: 37, m: [15, 16, 1], mt: '15x/16' }, { th: 53, m: [20, 9, 1], mt: '20x/9' },
    ]);
    const m = caso.m[0] / caso.m[1] * Math.sqrt(caso.m[2]);
    const { x2, x, ordenada } = calc.interseccion({ m });
    const variables = { m: { nombre: 'arctan', color: 'o' }, c: { nombre: 'arccos', color: 'i' }, t: { nombre: 'ángulo θ', color: 'h' }, R: { nombre: 'lo que se pide', color: 'd' } };
    const fa = caso.th === null ? 'arctan x' : `arctan(${caso.mt})`;
    const enunciado = ['Las gráficas de y = ', v('m', fa), ' e y = ', v('c', 'arccos x'), ' se cortan en un punto P.'];
    const pasoBase = [['En P las dos dan el mismo ángulo θ: ', v('m', fa), ' = ', v('c', 'arccos x'), ' = ', v('t', 'θ'), `. Entonces cos θ = x y tan θ = ${caso.th === null ? 'x' : caso.mt}.`]];
    if (caso.th === null) {
      const errores = [
        h('INV-valor-por-raiz', Math.sqrt(x2), 'Ese es la abscisa x, la raíz del valor pedido. Pedían x².', '√((√5 − 1)/2)'),
        pa('TR21', (1 + S5) / 2, 'Tomaste la otra raíz de z² + z − 1 = 0 (cambiando su signo). Como x² = cos²θ ≤ 1, esa raíz no sirve: se descarta.'),
        h('INV-olvida-la-mitad', (S5 - 1) / 4, 'Al aplicar la fórmula de la cuadrática dividiste entre 4 en vez de entre 2a = 2.'),
        h('INV-da-el-seno-cuadrado', (3 - S5) / 2, 'Ese es 1 − x² = sen²θ. Pedían x² = cos²θ.'),
      ];
      return {
        variables, enunciado, pregunta: ['¿Cuánto vale el cuadrado de la abscisa de P?'],
        correcta: x2, textoCorrecta: '(√5 − 1)/2', errores,
        solucion: [...pasoBase,
          ['sen θ = tan θ · cos θ = x · x = x². Con sen²θ + cos²θ = 1: x⁴ + x² = 1.'],
          ['Con z = x²: z² + z − 1 = 0 → z = (−1 ± √5)/2. Como z = x² ≥ 0, se queda la raíz positiva.'],
          ['x² = ', v('R', '(√5 − 1)/2'), '.']],
        datos: { tipo: 'interseccion', m: caso.m, pide: 'x2' },
      };
    }
    const notable = [30, 45, 60].includes(caso.th);
    const pide = notable && rng.moneda() ? 'ordenada' : 'x';
    const sen = Math.sqrt(1 - x * x);
    const cuerpo = [...pasoBase,
      [`sen θ = tan θ · cos θ = m·x², con m = ${ex(m)}. Con sen²θ + cos²θ = 1: m²x⁴ + x² − 1 = 0, una cuadrática en x² con una sola raíz positiva.`],
      [`x² = (−1 + √(1 + 4m²))/(2m²) = ${ex(x2)}, así que x = ${ex(x)} (positiva, porque arctan(mx) y arccos x solo coinciden en un ángulo agudo).`],
    ];
    if (pide === 'x') {
      cuerpo.push(['La abscisa es x = cos θ = ', v('R', ex(x)), '.']);
      return {
        variables, enunciado, pregunta: ['¿Cuál es la abscisa de P?'],
        correcta: x, errores: [
          h('INV-valor-por-raiz', x2, 'Ese es x², un paso intermedio. La abscisa es su raíz.'),
          h('INV-da-el-seno', sen, 'Ese es sen θ. La abscisa es x = cos θ, porque y = arccos x.'),
          h('INV-da-la-tangente', m * x, 'Ese es tan θ = m·x, el valor de dentro del arctan, no la abscisa.'),
          h('INV-reciproco', 1 / x, 'Ese es 1/x = sec θ. La abscisa es cos θ.'),
        ],
        solucion: cuerpo,
        datos: { tipo: 'interseccion', m: caso.m, pide: 'x' },
      };
    }
    cuerpo.push(['La ordenada es y = arccos x = θ = ', v('R', pi(ordenada)), '.']);
    return {
      variables, enunciado, pregunta: ['¿Cuál es la ordenada de P?'],
      correcta: ordenada, opciones: { texto: x => pi(x) }, errores: [
        h('IN7', PI / 2 - ordenada, 'Ese es arcsen x, el complemento de θ. La ordenada es arccos x.'),
        h('IN1', PI - ordenada, 'Ese ángulo está fuera de donde se cortan las dos gráficas: arctan con m > 0 da un ángulo agudo para x > 0.'),
        h('INV-da-la-abscisa', x, 'Esa es la abscisa x = cos θ, no la ordenada.', ex(x)),
        h('INV-doble', 2 * ordenada, 'Duplicaste el ángulo: la ordenada es θ.'),
      ],
      solucion: cuerpo,
      datos: { tipo: 'interseccion', m: caso.m, pide: 'ordenada' },
    };
  }

  function transformacion(rng) {
    const a = rng.elegir([-2, 0, 1, 2, 4]), B = rng.elegir([-3, -2, -1, 1, 2, 3]), C = rng.elegir([-2, -1, 1, 2, 3]), D = rng.entero(-3, 3);
    const A = a * PI / 4, cuarto = x => Math.round(x / (PI / 4));
    const op = (lo, hi, crece, abierto = true) => ({
      clave: `${cuarto(lo)}|${cuarto(hi)}|${crece ? 'creciente' : 'decreciente'}|${abierto ? 'abierto' : 'cerrado'}`,
      texto: `rango ${abierto ? '⟨' : '['}${pi(lo)}; ${pi(hi)}${abierto ? '⟩' : ']'}, ${crece ? 'creciente' : 'decreciente'}`,
    });
    const crece = B * C > 0, lo = A - Math.abs(B) * PI / 2, hi = A + Math.abs(B) * PI / 2;
    const dentro = lineal([[C, 'x'], [D, '']]);
    const tB = B === 1 ? '' : B === -1 ? '−' : `${B < 0 ? '−' : ''}${Math.abs(B)}`;
    const expr = A === 0 ? `${tB}arctan(${dentro})` : `${pi(A)} ${B > 0 ? '+' : '−'} ${Math.abs(B) === 1 ? '' : Math.abs(B)}arctan(${dentro})`;
    const variables = { A: { nombre: 'desplazamiento vertical', color: 'o' }, B: { nombre: 'factor del arctan', color: 'i' }, R: { nombre: 'rango y sentido', color: 'd' } };
    const errores = [
      { id: 'INV-sentido-sin-reflejo', ...op(lo, hi, !crece), explicacion: `El sentido sale del signo de B·C = (${ent(B)})·(${ent(C)}): ${crece ? 'positivo, la gráfica sube' : 'negativo, la gráfica baja'}. ${B < 0 || C < 0 ? 'Un signo menos refleja la gráfica.' : ''}`.trim(), respaldo: 'hipotesis' },
      Math.abs(B) !== 1 ? { id: 'INV-asintotas-sin-factor', ...op(A - PI / 2, A + PI / 2, crece), explicacion: `Olvidaste multiplicar por |B| = ${Math.abs(B)}: el arctan va de −π/2 a π/2, y ${Math.abs(B)}·arctan va de ${pi(-Math.abs(B) * PI / 2)} a ${pi(Math.abs(B) * PI / 2)}.`, respaldo: 'hipotesis' } : null,
      { id: 'INV-asintotas-con-pi', ...op(A - Math.abs(B) * PI, A + Math.abs(B) * PI, crece), explicacion: 'Tomaste el rango de arctan como ⟨−π; π⟩. Es ⟨−π/2; π/2⟩.', respaldo: 'hipotesis' },
      A !== 0 ? { id: 'INV-sin-desplazar', ...op(-Math.abs(B) * PI / 2, Math.abs(B) * PI / 2, crece), explicacion: `Olvidaste subir (o bajar) todo en ${pi(A)}: las asíntotas son y = A ± |B|π/2.`, respaldo: 'hipotesis' } : null,
      { id: 'IN18', ...op(lo, hi, crece, false), explicacion: 'Pusiste el rango cerrado. arctan nunca llega a ±π/2: las rectas y = ' + pi(lo) + ' e y = ' + pi(hi) + ' son asíntotas, no valores de f.', respaldo: 'hipotesis' },
    ].filter(Boolean);
    return {
      variables, texto: true,
      enunciado: ['Sea f(x) = ', ...(A === 0 ? (Math.abs(B) === 1 ? [`${B < 0 ? '−' : ''}arctan(${dentro})`] : [v('B', B < 0 ? `−${-B}` : B), `·arctan(${dentro})`])
        : [v('A', pi(A)), B > 0 ? ' + ' : ' − ', ...(Math.abs(B) === 1 ? [] : [v('B', Math.abs(B)), '·']), `arctan(${dentro})`]), ', con x real.'],
      pregunta: ['¿Cuál es el rango de f y cómo es su gráfica?'],
      correcta: op(lo, hi, crece), errores,
      solucion: [
        [`−π/2 < arctan(${dentro}) < π/2 para todo x (las rectas ±π/2 son asíntotas y nunca se alcanzan).`],
        [`Multiplicado por ${B < 0 ? '−' + -B : B}: el intervalo pasa a medir |B|·π = ${pi(Math.abs(B) * PI)} de ancho${B < 0 ? ' y se da vuelta' : ''}; luego se suma ${A === 0 ? '0' : pi(A)}.`],
        [`Asíntotas horizontales y = ${pi(lo)} e y = ${pi(hi)}; la gráfica ${crece ? 'sube' : 'baja'} porque B·C = ${ent(B * C)} es ${crece ? 'positivo' : 'negativo'}.`],
        [v('R', op(lo, hi, crece).texto), '.'],
      ],
      datos: { tipo: 'transformacion', a, B, C, D, expresion: expr },
    };
  }

  function dominioPuntos(rng) {
    const F = rng.elegir(['arcsen', 'arccos']), G = rng.elegir(['arcsec', 'arccsc']);
    const p = rng.elegir([1, 2, 3]), q = rng.elegir([1, 2, -1]), hh = rng.entero(-2, 3), k = rng.elegir([1, 2, 3]);
    const u = hh === 0 ? (k === 1 ? 'x' : `x/${k}`) : (k === 1 ? `x ${hh > 0 ? '−' : '+'} ${Math.abs(hh)}` : `(x ${hh > 0 ? '−' : '+'} ${Math.abs(hh)})/${k}`);
    const r = calc.dominioPuntos({ p, F, q, G });
    const val = (u1, tabla) => p * tabla[F](u1) + q * tabla[G](u1);
    const sumaDe = (a1, a2) => (Math.abs(a1 - a2) < 1e-12 ? a1 : a1 + a2);
    const impar = { arcsen: ARC.arcsen, arccsc: ARC.arccsc, arccos: x => (x < 0 ? -ARC.arccos(-x) : ARC.arccos(x)), arcsec: x => (x < 0 ? -ARC.arcsec(-x) : ARC.arcsec(x)) };
    const fuera = { arccos: ARC.arccos, arcsec: ARC.arcsec, arcsen: x => (x < 0 ? 3 * PI / 2 : ARC.arcsen(x)), arccsc: x => (x < 0 ? 3 * PI / 2 : ARC.arccsc(x)) };
    const variables = { u: { nombre: 'argumento', color: 'o' }, D: { nombre: 'dominio', color: 'i' }, R: { nombre: 'suma del rango', color: 'd' } };
    const coef = (c, primero) => (c === 1 ? (primero ? '' : ' + ') : c === -1 ? (primero ? '−' : ' − ') : (primero ? `${c}` : (c < 0 ? ` − ${-c}` : ` + ${c}`)));
    const x1 = hh + k, x2 = hh - k;
    const errores = [
      r.elementos === 1 ? h('INV-cuenta-repetido', 2 * r.enUno, `Los dos puntos del dominio dan el mismo valor, ${pi(r.enUno)}: el rango tiene un solo elemento y se cuenta una vez.`) : null,
      r.elementos === 2 ? h('INV-solo-positivo', r.enUno, `Solo usaste u = 1. El dominio tiene dos puntos: u = 1 y u = −1.`) : null,
      h('IN2', sumaDe(val(1, impar), val(-1, impar)), `Tomaste ${[F, G].filter(z => z === 'arccos' || z === 'arcsec').map(z => z + '(−1) = −' + z + ' 1 = 0').join(' y ')}, como si fuera impar. arccos y arcsec no son impares: arccos(−1) = π y arcsec(−1) = π.`),
      h('IN1', sumaDe(val(1, fuera), val(-1, fuera)), `Usaste 3π/2 para ${F === 'arcsen' ? 'arcsen(−1)' : 'arccsc(−1)'}: está fuera del rango principal [−π/2; π/2]. El valor es −π/2.`),
      h('INV-sin-coeficientes', sumaDe(ARC[F](1) + ARC[G](1), ARC[F](-1) + ARC[G](-1)), 'Olvidaste los coeficientes que multiplican a cada función.'),
    ].filter(Boolean);
    return {
      variables,
      enunciado: ['Sea f(x) = ', `${coef(p, true)}${F}(`, v('u', u), `)${coef(q, false)}${G}(`, v('u', u), ').'],
      pregunta: ['¿Cuánto suman los elementos del rango de f?'],
      correcta: r.suma, opciones: { texto: x => pi(x) }, errores,
      solucion: [
        [`${F} pide |u| ≤ 1 y ${G} pide |u| ≥ 1: a la vez, solo |u| = 1, es decir, u = 1 o u = −1.`],
        ['Con u = ', v('u', u), ': el dominio es ', v('D', `{${ent(Math.min(x1, x2))}; ${ent(Math.max(x1, x2))}}`), '.'],
        [`f con u = 1: ${p}·${pi(ARC[F](1))} ${q < 0 ? '−' : '+'} ${Math.abs(q)}·${pi(ARC[G](1))} = ${pi(r.enUno)}. Con u = −1: ${p}·(${pi(ARC[F](-1))}) ${q < 0 ? '−' : '+'} ${Math.abs(q)}·(${pi(ARC[G](-1))}) = ${pi(r.enMenosUno)}.`],
        [r.elementos === 1 ? `Los dos valores coinciden: el rango es {${pi(r.enUno)}} y la suma es ` : `El rango es {${pi(r.enUno)}; ${pi(r.enMenosUno)}} y la suma es `, v('R', pi(r.suma)), '.'],
      ],
      datos: { tipo: 'dominio-puntos', p, F, q, G, h: hh, k },
    };
  }

  const COS = [[-1, '−1'], [-S3 / 2, '−√3/2'], [-S2 / 2, '−√2/2'], [-0.5, '−1/2'], [0, '0'], [0.5, '1/2'], [S2 / 2, '√2/2'], [S3 / 2, '√3/2']];
  const TANES = [
    { t: [['arctan', 1 / 2, '1/2', 1], ['arctan', 1 / 3, '1/3', 1]], explica: 'tan θ = (1/2 + 1/3)/(1 − 1/6) = 1, y θ está entre 0 y π/2 (los dos arcos son agudos y su producto es menor que 1): θ = π/4.' },
    { t: [['arctan', 2, '2', 1], ['arctan', 3, '3', 1]], sinPi: true, explica: 'tan θ = (2 + 3)/(1 − 6) = −1. Como 2·3 > 1, la suma de los dos arcos pasa de π/2: θ = π − π/4 = 3π/4.' },
    { t: [['arctan', 3, '3', 1], ['arctan', 1 / 2, '1/2', -1]], explica: 'tan θ = (3 − 1/2)/(1 + 3·1/2) = (5/2)/(5/2) = 1, y θ está entre 0 y π/2: θ = π/4.' },
    { t: [['arctan', 2, '2', 1], ['arctan', 1 / 3, '1/3', -1]], explica: 'tan θ = (2 − 1/3)/(1 + 2·1/3) = (5/3)/(5/3) = 1, y θ está entre 0 y π/2: θ = π/4.' },
    { t: [['arctan', 1, '1', 1], ['arctan', 2, '2', 1], ['arctan', 3, '3', 1]], explica: 'arctan 2 + arctan 3: la tangente da (2 + 3)/(1 − 6) = −1 y, como 2·3 > 1, la suma pasa de π/2: vale 3π/4. Con arctan 1 = π/4, θ = π.' },
    { t: [['arctan', 1 / 5, '1/5', 1], ['arctan', 2 / 3, '2/3', 1]], explica: 'tan θ = (1/5 + 2/3)/(1 − 2/15) = (13/15)/(13/15) = 1, y θ está entre 0 y π/2: θ = π/4.' },
    { t: [['arctan', 1 / 7, '1/7', 1], ['arctan', 3 / 4, '3/4', 1]], explica: 'tan θ = (1/7 + 3/4)/(1 − 3/28) = (25/28)/(25/28) = 1, y θ está entre 0 y π/2: θ = π/4.' },
    { t: [['arctan', S3, '√3', 1], ['arctan', S3 / 3, '√3/3', 1]] },
    { t: [['arccot', -1, '−1', 1], ['arctan', 1, '1', -1]] },
  ];
  function sector(rng) {
    let terminos, textos, explica = null;
    const conCos = rng.moneda();
    if (conCos) {
      let i, j;
      do { i = rng.entero(0, COS.length - 1); j = rng.entero(0, COS.length - 1); } while (i >= j);
      terminos = [{ f: 'arccos', k: COS[i][0], s: 1 }, { f: 'arccos', k: COS[j][0], s: -1 }];
      textos = [COS[i][1], COS[j][1]];
    } else {
      const e = rng.elegir(TANES);
      terminos = e.t.map(([f, k, , s]) => ({ f, k, s }));
      textos = e.t.map(x => x[2]);
      explica = e.explica;
    }
    const pide = rng.elegir(['area', 'arco']);
    const R = pide === 'area' ? rng.elegir([2, 4, 6, 8, 10, 12]) : rng.elegir([3, 4, 6, 8, 12]);
    const { angulo: th } = calc.sector({ terminos, R });
    const correcta = pide === 'area' ? th * R * R / 2 : th * R;
    const unidad = pide === 'area' ? 'm²' : 'm';
    const conv = x => (pide === 'area' ? x * R * R / 2 : x * R);
    let expr = '';
    terminos.forEach((t, n) => { expr += (n === 0 ? (t.s < 0 ? '−' : '') : (t.s < 0 ? ' − ' : ' + ')) + `${t.f}(${textos[n]})`; });
    const variables = { t: { nombre: 'ángulo central', color: 'o' }, R: { nombre: 'radio', color: 'i' }, S: { nombre: pide === 'area' ? 'área' : 'longitud del arco', color: 'd' } };
    const sumaTodo = terminos.reduce((s, t) => s + ARC[t.f](t.k), 0);
    const errores = [
      h('INV-suma-por-diferencia', conv(sumaTodo), 'Sumaste los arcos donde va la resta (o restaste donde va la suma). Mira el signo de cada término.'),
      pide === 'area' ? h('INV-sin-mitad', th * R * R, 'El área del sector es θR²/2: faltó dividir entre 2.') : h('INV-da-el-area', th * R * R / 2, 'Esa es el área del sector (θR²/2). La longitud del arco es θ·R.'),
      pide === 'area' ? h('INV-da-el-arco', th * R, 'Esa es la longitud del arco (θ·R). El área es θR²/2.') : h('INV-arco-con-diametro', th * 2 * R, 'Usaste el diámetro: la longitud del arco es θ·R.'),
      h('INV-solo-un-termino', conv(ARC[terminos[0].f](terminos[0].k)), 'Usaste solo el primer arco como ángulo central.'),
    ];
    if (conCos && terminos[0].k < 0) {
      const thImpar = -ARC.arccos(-terminos[0].k) - ARC.arccos(terminos[1].k);
      errores.push(h('IN2', conv(Math.abs(thImpar)), `Tomaste arccos(${textos[0]}) = −arccos(${textos[0].replace('−', '')}), como si fuera impar. arccos(−u) = π − arccos u.`));
    }
    if (!conCos && TANES.find(e => e.t.map(x => x[2]).join() === textos.join() && e.sinPi)) errores.unshift(h('IN27', conv(PI / 4), 'Usaste arctan a + arctan b = arctan((a + b)/(1 − ab)) sin sumar π. Como a·b > 1, la suma pasa de π/2: es π + arctan(−1) = 3π/4.'));
    const lista = terminos.map((t, n) => `${t.f}(${textos[n]}) = ${pi(ARC[t.f](t.k))}`).join('; ');
    return {
      variables,
      enunciado: ['Un aspersor riega un sector circular de radio ', v('R', `${R} m`), '. Su ángulo central, en radianes, es θ = ', v('t', expr), '.'],
      pregunta: [pide === 'area' ? '¿Cuál es el área del sector regado?' : '¿Cuánto mide el arco del borde del sector?'],
      correcta, opciones: { texto: x => pi(x), unidad }, errores,
      solucion: [
        [explica || `En el rango principal: ${lista}.`],
        ['θ = ', v('t', pi(th)), '.'],
        [pide === 'area' ? 'Área = θ·R²/2 = ' : 'Arco = θ·R = ', `${pi(th)}·${pide === 'area' ? R + '²/2' : R} = `, v('S', pi(correcta, unidad)), '.'],
      ],
      datos: { tipo: 'sector', terminos: terminos.map((t, n) => ({ ...t, texto: textos[n] })), R, pide },
    };
  }

  const TIPOS = { complementaria, lugar, interseccion, transformacion, 'dominio-puntos': dominioPuntos, sector };
  const NOMBRES = Object.keys(TIPOS);

  function generar(semilla) {
    const rng = Azar.crear(ID + '|' + semilla);
    for (let i = 0; i < 200; i++) {
      const pr = TIPOS[rng.elegir(NOMBRES)](rng);
      let alternativas, valor, unidad = '';
      if (pr.texto) {
        alternativas = P.armarTexto({ correcta: pr.correcta, errores: pr.errores, rng });
        valor = pr.correcta.clave;
      } else {
        const o = pr.opciones || {};
        alternativas = armarNum(rng, pr.correcta, pr.textoCorrecta, pr.errores, o);
        valor = pr.correcta; unidad = o.unidad || '';
      }
      if (!alternativas || alternativas.length < 4) continue;
      return {
        id: `${ID}#${semilla}`, variables: pr.variables, enunciado: pr.enunciado, pregunta: pr.pregunta, datos: '',
        alternativas, solucion: pr.solucion, respuesta: { valor, unidad }, _datos: pr.datos,
      };
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  return { id: ID, titulo: 'Funciones trigonométricas inversas: rangos, sumas y gráficas', generar, calc, tipos: NOMBRES, ex };
});
