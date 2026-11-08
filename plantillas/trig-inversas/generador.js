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
 *                   'multiplo': m·f(x) = n·g(x); 'suma': f(x) + 2·g(x) = c·π (c = [n, den]);
 *                   'triple': 2·f(x) − g(x) = c·π. Se pide x.
 *   lugar           forma 'recta': arcsec(y − a·x) + arccsc(b·x + c) = π/2; se pide la ecuación de la recta
 *                   (respuesta de texto, clave 'recta:m,n' para y = m·x + n).
 *                   forma 'circunferencia': arcsec(x² + y² + c) + arccsc(2a·x + 2b·y) = π/2; se pide el radio.
 *   interseccion    par 'tan-cos': las gráficas de y = arctan(m·x) e y = arccos x se cortan en P; par 'cot-sen':
 *                   las de y = arccot(m·x) e y = arcsen x. m = [n, den, r]: m = (n/den)·√r
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
    for (let d = 1; d <= 2000; d++) { const n = x * d, r = Math.round(n); if (Math.abs(n - r) < 1e-9 * Math.max(1, Math.abs(n))) return fr(r, d); }
    for (const r of RAICES) {
      const s = Math.sqrt(r);
      for (let d = 1; d <= 24; d++) for (let q = 1; q <= 64; q++) for (const sg of [1, -1]) {
        const pn = x * d - sg * q * s, pr = Math.round(pn);
        if (Math.abs(pn - pr) < 1e-10 * Math.max(1, Math.abs(x * d)) && Math.abs(pr) <= 2000) return textoRaiz(pr, sg * q, r, d);
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
      else if (forma === 'triple') ang = (c * PI + PI / 2) / 3; // 2f − g = cπ y g = π/2 − f → 3f = cπ + π/2
      else ang = PI - c * PI; // f + 2g = cπ y f + g = π/2 → g = cπ − π/2 → f = π − cπ
      return { x: DIR[f](ang), angulo: ang };
    },
    // arcsec U + arccsc W = π/2 ⇔ U = W (|U| ≥ 1).
    recta: ({ a, b, c }) => ({ pendiente: a + b, ordenada: c }),
    circunferencia: ({ a, b, c }) => ({ radio: Math.sqrt(a * a + b * b - c), cx: a, cy: b }),
    // arctan(m x) = arccos x = θ: cos θ = x y tan θ = m x → m x² = sen θ → m²x⁴ + x² − 1 = 0.
    // Con par 'cot-sen': arccot(m x) = arcsen x = θ, sen θ = x y cot θ = m x → m x² = cos θ: la misma cuadrática.
    interseccion: ({ m, par = 'tan-cos' }) => { const x2 = (-1 + Math.sqrt(1 + 4 * m * m)) / (2 * m * m), x = Math.sqrt(x2); return { x2, x, ordenada: par === 'cot-sen' ? Math.asin(x) : Math.acos(x) }; },
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
    const rasgos = z => [z.startsWith('−'), z.includes('√'), z.includes('/'), z.includes('π')];
    const rc = rasgos(t(correcta)), parecido = e => rasgos(t(e.valor)).filter((r, i) => r === rc[i]).length;
    lista.sort((e1, e2) => parecido(e2) - parecido(e1));
    return P.armar({ correcta, errores: lista, rng, negativos: true, texto: t });
  }

  // ---------- tipos ----------
  function complementaria(rng) {
    const par = rng.elegir(Object.keys(PARES)), [f, g] = PARES[par];
    const forma = rng.elegir(['diferencia', 'multiplo', 'suma', 'triple']);
    const fn = f.slice(3), gn = g.slice(3);
    const co = { sen: 'cos', cos: 'sen', tan: 'cot', cot: 'tan', sec: 'csc', csc: 'sec' };
    const variables = { f: { nombre: `${f} x`, color: 'o' }, g: { nombre: `${g} x`, color: 'i' }, t: { nombre: 'ángulo', color: 'h' }, R: { nombre: 'x', color: 'd' } };
    let enun, dat, ang, pasos, ang11;
    if (forma === 'diferencia') {
      const d = rng.elegir([[1, 6], [-1, 6], [0, 1], [1, 2], [-1, 2]]), dv = d[0] / d[1];
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
    } else if (forma === 'suma') {
      const c = rng.elegir([[2, 3], [5, 6], [3, 4], [1, 1], [1, 2]]), cv = c[0] / c[1];
      ang = PI - cv * PI;
      enun = [v('f', `${f} x`), ' + 2·', v('g', `${g} x`), ` = ${pi(cv * PI)}`];
      pasos = [['Como ', v('f', `${f} x`), ' + ', v('g', `${g} x`), ' = π/2, la condición queda π/2 + ', v('g', `${g} x`), ` = ${pi(cv * PI)}, así que ${g} x = ${pi(cv * PI - PI / 2)}.`],
        [`${f} x = π/2 − ${pi(cv * PI - PI / 2)} = `, v('t', pi(ang)), '.']];
      dat = { forma, c }; ang11 = PI - (cv * PI - PI); // con f + g = π: g = cπ − π y f = π − g
    } else {
      const c = rng.elegir([[1, 2], [0, 1], [1, 4], [-1, 2], [1, 1]]), cv = c[0] / c[1];
      ang = (cv * PI + PI / 2) / 3;
      enun = ['2·', v('f', `${f} x`), ' − ', v('g', `${g} x`), ` = ${pi(cv * PI)}`];
      pasos = [[v('f', `${f} x`), ' + ', v('g', `${g} x`), ' = π/2, así que ', v('g', `${g} x`), ` = π/2 − ${f} x.`],
        [`2·${f} x − (π/2 − ${f} x) = ${pi(cv * PI)} → 3·${f} x = ${pi(cv * PI + PI / 2)} → ${f} x = `, v('t', pi(ang)), '.']];
      dat = { forma, c }; ang11 = (cv * PI + PI) / 3; // con f + g = π
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
      const simples = [
        { id: 'IN11', ...op(a - b, -c), explicacion: 'Tomaste arcsec u + arccsc w = π/2 como si pidiera w = −u. Con el mismo argumento, arcsec u + arccsc u = π/2: los argumentos son iguales.', respaldo: 'hipotesis' },
        { id: 'INV-signo-al-despejar', ...op(b - a, c), explicacion: `Al pasar ${a > 0 ? '−' : '+'}${Math.abs(a) === 1 ? '' : Math.abs(a)}x al otro lado no le cambiaste el signo.`, respaldo: 'hipotesis' },
        { id: 'INV-olvida-termino', ...op(b, c), explicacion: `Olvidaste el término ${-a > 0 ? '+' : '−'} ${Math.abs(a) === 1 ? '' : Math.abs(a)}x del argumento del arcsec al despejar y.`, respaldo: 'hipotesis' },
        { id: 'INV-signo-de-la-constante', ...op(a + b, -c), explicacion: 'Cambiaste el signo del término independiente al despejar.', respaldo: 'hipotesis' },
      ];
      // Con errores dobles, ni la pendiente ni la constante de la correcta son las que más se repiten.
      const dobles = [simples[1],
        { id: 'INV-signo-al-despejar+INV-signo-de-la-constante', ...op(b - a, -c), explicacion: `Dos errores: al pasar ${a > 0 ? '−' : '+'}${Math.abs(a) === 1 ? '' : Math.abs(a)}x al otro lado no le cambiaste el signo, y además cambiaste el signo del término independiente.`, respaldo: 'hipotesis' },
        simples[0],
        { id: 'INV-olvida-termino+INV-signo-de-la-constante', ...op(b, -c), explicacion: `Dos errores: olvidaste el término ${-a > 0 ? '+' : '−'} ${Math.abs(a) === 1 ? '' : Math.abs(a)}x del arcsec y cambiaste el signo del término independiente.`, respaldo: 'hipotesis' },
      ];
      const errores = rng.moneda() ? simples : dobles;
      return {
        variables, texto: true,
        enunciado: ['Los puntos (x; y) que cumplen arcsec(', v('U', U), ') + arccsc(', v('W', W), ') = π/2 están sobre una recta.'],
        pregunta: ['¿Cuál es la ecuación de esa recta?'],
        correcta: op(a + b, c), errores,
        solucion: [
          ['Para |u| ≥ 1, arcsec u + arccsc u = π/2. Como arccsc es inyectiva, arcsec U + arccsc W = π/2 obliga a que W = U.'],
          [v('U', U), ' = ', v('W', W), ` → y = ${lineal([[a, 'x']])} + ${lineal([[b, 'x'], [c, '']])}.`],
          [v('R', textoRecta(a + b, c)), ' (solo valen los puntos con |', v('W', W), '| ≥ 1, donde existen las dos funciones).'],
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
      enunciado: ['Los puntos (x; y) que cumplen arcsec(', v('U', U), ') + arccsc(', v('W', W), ') = π/2 están sobre una circunferencia (solo valen los puntos donde existen las dos funciones).'],
      pregunta: ['¿Cuánto mide su radio?'],
      correcta: r, errores,
      solucion: [
        ['Para |u| ≥ 1, arcsec u + arccsc u = π/2; como arccsc es inyectiva, la condición obliga a que los dos argumentos sean iguales.'],
        [v('U', U), ' = ', v('W', W), ` → ${lineal([[1, 'x²'], [-2 * a, 'x'], [1, 'y²'], [-2 * b, 'y'], [c, '']])} = 0.`],
        [`Completando cuadrados: ${px} + ${py} = ${a * a + b * b} ${c > 0 ? '−' : '+'} ${Math.abs(c)} = ${r2}.`],
        ['r = √' + r2 + ' = ', v('R', ex(r)), '. Solo valen los puntos de la circunferencia con |', v('W', W), '| ≥ 1, donde existen las dos funciones.'],
      ],
      datos: { tipo: 'lugar', forma: 'circunferencia', a, b, c },
    };
  }

  const textoM = ([n, d, r]) => {
    const num = (n === 1 && r !== 1 ? '' : String(n)) + (r > 1 ? '√' + r : '');
    const k = num === '1' ? '' : num;
    if (d === 1) return k ? `${k}${r > 1 ? '·' : ''}x` : 'x';
    return k ? `${k}x/${d}` : `x/${d}`;
  };
  function interseccion(rng) {
    const par = rng.elegir(['tan-cos', 'cot-sen']);
    const [fa0, fb, dentro, fuera] = par === 'tan-cos' ? ['arctan', 'arccos', 'tan', 'cos'] : ['arccot', 'arcsen', 'cot', 'sen'];
    const otra = par === 'tan-cos' ? 'sen' : 'cos';
    const pide = rng.elegir(['x2', 'x', 'ordenada']);
    const NOT = { 30: [2, 3, 1], 45: [1, 1, 2], 60: [2, 1, 3], 37: [15, 16, 1], 53: [20, 9, 1] };
    const DIRM = par === 'tan-cos' ? NOT : { 30: NOT[60], 45: NOT[45], 60: NOT[30], 37: NOT[53], 53: NOT[37] };
    let mm;
    if (pide === 'x2') mm = rng.elegir([[1, 1, 1], [2, 1, 1], [1, 2, 1], [3, 1, 1], [1, 1, 3], [2, 3, 1], [1, 3, 1]]);
    else mm = DIRM[rng.elegir(pide === 'ordenada' ? [30, 45, 60] : [30, 45, 60, 37, 53])];
    const m = mm[0] / mm[1] * Math.sqrt(mm[2]);
    const { x2, x, ordenada } = calc.interseccion({ m, par });
    const mt = textoM(mm), fa = `${fa0}(${mt})`.replace('(x)', ' x');
    const variables = { m: { nombre: fa0, color: 'o' }, c: { nombre: fb, color: 'i' }, t: { nombre: 'ángulo θ', color: 'h' }, R: { nombre: 'lo que se pide', color: 'd' } };
    const enunciado = ['Las gráficas de y = ', v('m', fa), ' e y = ', v('c', `${fb} x`), ' se cortan en un punto P.'];
    const tm = ex(m);
    const cuerpo = [
      ['En P las dos dan el mismo ángulo θ: ', v('m', fa), ' = ', v('c', `${fb} x`), ' = ', v('t', 'θ'), `. Entonces ${fuera} θ = x y ${dentro} θ = ${mt}.`],
      [`${otra} θ = ${dentro} θ · ${fuera} θ = ${tm === '1' ? '' : '(' + tm + ')·'}x². Con sen²θ + cos²θ = 1: ${tm === '1' ? '' : '(' + tm + ')²·'}x⁴ + x² = 1.`],
      [`Con z = x²: ${ex(m * m) === '1' ? '' : '(' + ex(m * m) + ')'}z² + z − 1 = 0 → z = (−1 ± √(${ex(1 + 4 * m * m)}))/(${ex(2 * m * m)}). Como z = x² ≥ 0, se queda la raíz positiva: x² = ${ex(x2)}.`],
    ];
    const raizTexto = ex(x) || `√(${ex(x2)})`;
    if (pide === 'x2') {
      const neg = (-1 - Math.sqrt(1 + 4 * m * m)) / (2 * m * m);
      cuerpo.push(['x² = ', v('R', ex(x2)), ' (no su raíz: esa es la abscisa).']);
      const errores = [
        h('INV-valor-por-raiz', x, 'Esa es la abscisa x, la raíz del valor pedido. Pedían x².', raizTexto),
        pa('TR21', neg, 'Esa es la otra raíz de la cuadrática en z = x². Es negativa y x² no puede serlo: se descarta.'),
        h('INV-olvida-la-mitad', x2 / 2, 'En la fórmula de la cuadrática dividiste entre el doble de lo que va (2a).'),
        h(otra === 'sen' ? 'INV-da-el-seno-cuadrado' : 'INV-da-el-coseno-cuadrado', 1 - x2, `Ese es 1 − x² = ${otra}²θ. Pedían x² = ${fuera}²θ.`),
        m !== 1 ? h('INV-sin-coeficiente', (S5 - 1) / 2, `Resolviste como si el coeficiente de x dentro del ${fa0} fuera 1; aquí es ${tm}.`) : null,
      ].filter(Boolean);
      return {
        variables, enunciado, pregunta: ['¿Cuánto vale el cuadrado de la abscisa de P?'],
        correcta: x2, errores, solucion: cuerpo,
        datos: { tipo: 'interseccion', par, m: mm, pide },
      };
    }
    if (pide === 'x') {
      cuerpo.push(['La abscisa es x = ', v('R', ex(x)), '.']);
      return {
        variables, enunciado, pregunta: ['¿Cuál es la abscisa de P?'],
        correcta: x, errores: [
          h('INV-valor-por-raiz', x2, 'Ese es x², un paso intermedio. La abscisa es su raíz.'),
          h(otra === 'sen' ? 'INV-da-el-seno' : 'INV-da-el-coseno', Math.sqrt(1 - x2), `Ese es ${otra} θ. La abscisa es x = ${fuera} θ, porque y = ${fb} x.`),
          h(dentro === 'tan' ? 'INV-da-la-tangente' : 'INV-da-la-cotangente', m * x, `Ese es ${dentro} θ = ${mt}, el valor de dentro del ${fa0}, no la abscisa.`),
          h('INV-reciproco', 1 / x, `Ese es 1/x. La abscisa es ${fuera} θ.`),
          h('IN29', -x, 'Le cambiaste el signo: las dos gráficas se cortan con x > 0.'),
        ],
        solucion: cuerpo,
        datos: { tipo: 'interseccion', par, m: mm, pide },
      };
    }
    cuerpo.push(['x = ', ex(x), `, y la ordenada es y = ${fb} x = θ = `, v('R', pi(ordenada)), '.']);
    return {
      variables, enunciado, pregunta: ['¿Cuál es la ordenada de P?'],
      correcta: ordenada, opciones: { texto: z => pi(z) }, errores: [
        h('IN7', PI / 2 - ordenada, `Ese es ${par === 'tan-cos' ? 'arcsen' : 'arccos'} x, el complemento de θ. La ordenada es ${fb} x.`),
        h('IN1', PI - ordenada, `Ese ángulo está fuera de donde se cortan las dos gráficas: ${fa0} con m > 0 da un ángulo agudo para x > 0.`),
        h('INV-da-la-abscisa', x, 'Esa es la abscisa x, no la ordenada.', ex(x)),
        h('INV-doble', 2 * ordenada, 'Duplicaste el ángulo: la ordenada es θ.'),
        h('INV-mitad', ordenada / 2, 'Dividiste el ángulo entre 2: la ordenada es θ.'),
      ],
      solucion: cuerpo,
      datos: { tipo: 'interseccion', par, m: mm, pide },
    };
  }

  function transformacion(rng) {
    const a = rng.elegir([-2, 0, 1, 2, 4]), B = rng.elegir([-3, -2, -1, 1, 2, 3]), C = rng.elegir([-2, -1, 1, 2, 3]), D = rng.entero(-3, 3);
    const A = a * PI / 4, cuarto = x => Math.round(x / (PI / 4)), aB = Math.abs(B);
    const crece = B * C > 0, lo = A - aB * PI / 2, hi = A + aB * PI / 2;
    const dentro = lineal([[C, 'x'], [D, '']]);
    const tB = B === 1 ? '' : B === -1 ? '−' : `${B < 0 ? '−' : ''}${aB}`;
    const expr = A === 0 ? `${tB}arctan(${dentro})` : `${pi(A)} ${B > 0 ? '+' : '−'} ${aB === 1 ? '' : aB + '·'}arctan(${dentro})`;
    const variables = { A: { nombre: 'desplazamiento vertical', color: 'o' }, B: { nombre: 'factor del arctan', color: 'i' }, R: { nombre: 'rango y sentido', color: 'd' } };
    // Una opción = (rango, sentido, abierto); cada error cambia una de esas tres cosas.
    const RANGOS = [
      aB !== 1 ? { id: 'INV-asintotas-sin-factor', lo: A - PI / 2, hi: A + PI / 2, exp: `olvidaste multiplicar por |B| = ${aB} (${aB}·arctan va de ${pi(-aB * PI / 2)} a ${pi(aB * PI / 2)})` } : null,
      { id: 'INV-asintotas-con-pi', lo: A - aB * PI, hi: A + aB * PI, exp: 'tomaste el rango de arctan como ⟨−π; π⟩ (es ⟨−π/2; π/2⟩)' },
      A !== 0 ? { id: 'INV-sin-desplazar', lo: -aB * PI / 2, hi: aB * PI / 2, exp: `olvidaste subir (o bajar) todo en ${pi(A)}` } : null,
    ].filter(Boolean);
    const SENT = { id: 'INV-sentido-sin-reflejo', exp: `el sentido sale del signo de B·C = (${ent(B)})·(${ent(C)}), que es ${crece ? 'positivo: la gráfica sube' : 'negativo: la gráfica baja'}` + (B < 0 && C < 0 ? ' (los dos signos menos se compensan)' : B < 0 || C < 0 ? ' (un signo menos la refleja)' : '') };
    const CERR = { id: 'IN18', exp: `pusiste el rango cerrado, pero arctan nunca llega a ±π/2: y = ${pi(lo)} e y = ${pi(hi)} son asíntotas, no valores de f` };
    const op = (rg, s, cerrado) => {
      const l = rg ? rg.lo : lo, hh = rg ? rg.hi : hi, c = s ? !crece : crece, ab = !cerrado;
      const ids = [rg, s ? SENT : null, cerrado ? CERR : null].filter(Boolean);
      return {
        clave: `${cuarto(l)}|${cuarto(hh)}|${c ? 'creciente' : 'decreciente'}|${ab ? 'abierto' : 'cerrado'}`,
        texto: `rango ${ab ? '⟨' : '['}${pi(l)}; ${pi(hh)}${ab ? '⟩' : ']'}, ${c ? 'creciente' : 'decreciente'}`,
        id: ids.map(e => e.id).join('+'), respaldo: 'hipotesis',
        explicacion: (ids.length > 1 ? (ids.length === 2 ? 'Dos errores: ' : 'Tres errores: ') : '') + ids.map(e => e.exp).join('; y ') + '.',
      };
    };
    const correcta = op(null, false, false);
    const rg = rng.elegir(RANGOS);
    // Dos repartos: errores sueltos, o combinados de modo que ni el rango ni el sentido ni el cierre de la correcta
    // sean los que más se repiten entre las opciones.
    const errores = rng.moneda()
      ? [op(null, true, false), ...RANGOS.map(r => op(r, false, false)), op(null, false, true)]
      : [op(null, true, true), op(rg, false, true), op(rg, true, false), op(rg, true, true)];
    errores.forEach(e => { e.explicacion = e.explicacion.charAt(0).toUpperCase() + e.explicacion.slice(1); });
    const enB = B < 0 ? `−${aB}` : String(aB);
    return {
      variables, texto: true,
      enunciado: ['Sea f(x) = ', ...(A === 0 ? (aB === 1 ? [`${B < 0 ? '−' : ''}arctan(${dentro})`] : [v('B', enB), `·arctan(${dentro})`])
        : [v('A', pi(A)), ' + ', v('B', `(${enB})`), `·arctan(${dentro})`]), ', con x real.'],
      pregunta: ['¿Cuál es el rango de f y es creciente o decreciente?'],
      correcta, errores,
      solucion: [
        [`−π/2 < arctan(${dentro}) < π/2 para todo x (las rectas ±π/2 son asíntotas y nunca se alcanzan).`],
        ['Multiplicado por ', aB === 1 && A === 0 ? enB : v('B', enB), `: queda entre ${pi(-aB * PI / 2)} y ${pi(aB * PI / 2)}${B < 0 ? ' (el signo menos lo da vuelta)' : ''}` + (A === 0 ? '.' : '; luego se suma '), ...(A === 0 ? [] : [v('A', pi(A)), '.'])],
        [`Asíntotas horizontales y = ${pi(lo)} e y = ${pi(hi)}. B·C = (${ent(B)})·(${ent(C)}) = ${ent(B * C)} es ${crece ? 'positivo: la gráfica sube' : 'negativo: la gráfica baja'}${B < 0 && C < 0 ? ' (los dos signos menos se compensan)' : ''}.`],
        [v('R', correcta.texto), '.'],
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
    const coef = (c, primero) => (c === 1 ? (primero ? '' : ' + ') : c === -1 ? (primero ? '−' : ' − ') : (primero ? `${c} ` : (c < 0 ? ` − ${-c} ` : ` + ${c} `)));
    const x1 = hh + k, x2 = hh - k;
    const errores = [
      r.elementos === 1 ? h('INV-cuenta-repetido', 2 * r.enUno, `Los dos puntos del dominio dan el mismo valor, ${pi(r.enUno)}: el rango tiene un solo elemento y se cuenta una vez.`) : null,
      r.elementos === 2 ? h('INV-solo-positivo', r.enUno, `Solo usaste u = 1. El dominio tiene dos puntos: u = 1 y u = −1.`) : null,
      h('IN2', sumaDe(val(1, impar), val(-1, impar)), `Tomaste ${[F, G].filter(z => z === 'arccos' || z === 'arcsec').map(z => z + '(−1) = −' + z + ' 1 = 0').join(' y ')}, como si fuera impar. arccos y arcsec no son impares: arccos(−1) = π y arcsec(−1) = π.`),
      h('IN1', sumaDe(val(1, fuera), val(-1, fuera)), `Usaste 3π/2 para ${F === 'arcsen' ? 'arcsen(−1)' : 'arccsc(−1)'}: está fuera del rango principal [−π/2; π/2]. El valor es −π/2.`),
      h('INV-sin-coeficientes', sumaDe(ARC[F](1) + ARC[G](1), ARC[F](-1) + ARC[G](-1)), 'Olvidaste los coeficientes que multiplican a cada función.'),
      h('INV-signo-del-segundo', sumaDe(p * ARC[F](1) - q * ARC[G](1), p * ARC[F](-1) - q * ARC[G](-1)), `Cambiaste el signo del término con ${G}.`),
      h('INV-solo-negativo', r.enMenosUno, 'Solo usaste u = −1. El dominio tiene dos puntos: u = 1 y u = −1.'),
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
