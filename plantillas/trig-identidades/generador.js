/*
 * Generador «trig-identidades»: identidades del ángulo doble y triple, arcos compuestos con condición y
 * acotación de expresiones. Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['trig-identidades']) y en Node (require).
 *
 * Convención de academia: sen 37° = 3/5, cos 37° = 4/5, sen 16° = 7/25 (triángulos 3-4-5 y 7-24-25).
 * Fracciones en _datos: [n, d] significa n/d. Ángulos en grados sexagesimales (22.5 = 22°30′).
 *
 * Tipos y campos de _datos:
 *   condicional   suma: 90 → A + B + C = 90°, se dan tanA y tanB, se pide 'pide' C ('cos' o 'sen').
 *                 suma: 180 → A, B y C son ángulos de un triángulo, se dan tanA y tanB, se pide tan C.
 *   maximo        L(x) = m·sen x·cos x + n·(cuadrado)x + c, con cuadrado 'cos' (cos²x) o 'sen' (sen²x);
 *                 se pide 'pide' ('max' o 'min') de L para x real.
 *   terreno       cuadrilátero ABCD con ángulo recto en A; AB, AD y AC son longitudes (m) y S el área (m²);
 *                 la diagonal AC forma con AB un ángulo agudo x (y 90° − x con AD). Se pide x en grados.
 *                 Los campos *texto dan el número como lo ve el alumno ('4√3').
 *   suma-k        x en el cuadrante 'cuadrante' (1 a 4) cumple sen x + cos x = k (dato 'suma') o
 *                 sen x − cos x = k (dato 'resta'), k = [n, d]. Se pide 'pide': 'producto' (sen x·cos x),
 *                 'otra' (sen x − cos x si el dato es la suma; sen x + cos x si es la resta) o 'tangente' (tan x).
 *   triangulo-doble  triángulo ABC con C = 2B; altura AH = h (H en BC) y BC = a. Se pide tan B o tan C.
 *   triple-producto  modo 'valor': E = k·F x·F(60° − x)·F(60° + x), F = 'cos' o 'sen'; se pide E.
 *                 modo 'hora': T(t) = c + 4b·cos θ·cos(60° − θ)·cos(60° + θ) con θ = k·t grados (t en horas,
 *                 0 < t ≤ 24); se pide la primera hora t > 0 con la temperatura 'pide' ('minima' o 'maxima').
 *   acotar        modo 'cuartas': E = a(sen^pot x + cos^pot x) + c con pot 4 o 6.
 *                 modo 'potencia': E = a(sen x + cos x)^pot + c con pot 2 o 4 (signo 'mas'; con 'menos',
 *                 sen x − cos x). Se pide 'pide': 'dif' (máximo − mínimo), 'suma' (máximo + mínimo), 'min' o 'max'.
 *   cofuncion     u = al·x + p y w = be·x + q (en grados) son agudos. rel 'sen-cos': sen u = cos w;
 *                 'tan-cot': tan u = cot w; 'sec-csc': sec u = csc w; 'tan-tan': tan u·tan w = 1;
 *                 'cos-cos': cos u = cos w. Se pide x (número).
 *   cadena        E = cot x − tan x − 2 tan 2x − … − 2^(n−1)·tan(2^(n−1)·x) (n términos con tangente). Se pide E.
 *   reduccion-doble  E = tan θ + cot θ (op 'suma') o cot θ − tan θ (op 'resta'), θ en grados. Se pide E.
 *
 * Errores: TR9, TR12, TR16 y TR21 de docs/investigacion/trigonometria-ideas-erroneas.md (parcial); los
 * TRI-… son hipótesis nuestras.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'trig-identidades';
  const TR = 'docs/investigacion/trigonometria-ideas-erroneas.md';
  const h = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente: null });
  const pa = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'parcial', fuente: TR });
  const v = P.v;
  const RAD = Math.PI / 180;
  const S3 = Math.sqrt(3), S2 = Math.sqrt(2);

  // ---------- números exactos ----------
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  const fr = (n, d = 1) => { const g = gcd(n, d), s = d < 0 ? -1 : 1; n = s * n / g; d = s * d / g; return (n < 0 ? '−' : '') + Math.abs(n) + (d === 1 ? '' : '/' + d); };
  const RAICES = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15, 17, 21, 30];
  // Texto exacto de x: entero, fracción, a√b/c o (p ± q√r)/d. Si no sale limpio, null (no se muestra).
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
  // Grados con minutos: 22.5 → 22°30′.
  function grados(g) {
    if (!Number.isFinite(g)) return null;
    const ent = Math.floor(g + 1e-9), min = Math.round((g - ent) * 60);
    if (Math.abs((g - ent) * 60 - min) > 1e-6) return null;
    return `${ent}°` + (min ? `${min}′` : '');
  }
  const signo = x => (x < 0 ? `− ${ex(-x)}` : `+ ${ex(x)}`);
  const conSigno = (x, sola) => (x === 0 ? '' : (x < 0 ? ` − ${-x}` : ` + ${x}`) + (sola || ''));

  // ---------- razones de academia ----------
  // sen de los ángulos notables (en grados) con la convención de academia; null si no es notable.
  const SEN_AC = { 0: 0, 16: 7 / 25, 30: 0.5, 37: 0.6, 45: S2 / 2, 53: 0.8, 60: S3 / 2, 74: 24 / 25, 90: 1 };
  function senAc(g) {
    g = ((g % 360) + 360) % 360;
    const s = g <= 90 ? 1 : g <= 180 ? 1 : -1;
    const ref = g <= 90 ? g : g <= 180 ? 180 - g : g <= 270 ? g - 180 : 360 - g;
    return ref in SEN_AC ? s * SEN_AC[ref] : null;
  }
  const cosAc = g => senAc(90 - g);
  const TAN_REF = { 15: 2 - S3, 22.5: S2 - 1, 30: S3 / 3, 37: 0.75, 45: 1, 53: 4 / 3, 60: S3, 67.5: S2 + 1, 75: 2 + S3 };
  // tan θ para θ = 90k + β con β en TAN_REF: tan β si k es par, −cot β si es impar.
  function tanRed(theta) {
    const k = Math.floor(theta / 90), b = theta - 90 * k;
    if (!(b in TAN_REF)) return null;
    return k % 2 === 0 ? TAN_REF[b] : -1 / TAN_REF[b];
  }
  const cotR = g => { const t = Math.tan(g * RAD); return Math.abs(t) > 1e12 ? 0 : 1 / t; };

  // ---------- funciones de cálculo (las usa papel.json) ----------
  const calc = {
    // A + B + C = 90°: tan C = (1 − ab)/(a + b).
    condicional90: ({ tanA, tanB }) => { const t = (1 - tanA * tanB) / (tanA + tanB), c = 1 / Math.sqrt(1 + t * t); return { tanC: t, cosC: c, senC: t * c }; },
    // A + B + C = 180°: tan C = (a + b)/(ab − 1).
    condicional180: ({ tanA, tanB }) => ({ tanC: (tanA + tanB) / (tanA * tanB - 1) }),
    // m·sen x cos x + n·cos²x (o sen²x) + c = (m/2) sen 2x ± (n/2) cos 2x + n/2 + c.
    maximo: ({ m, n, c, cuadrado }) => { const R = Math.hypot(m / 2, n / 2), base = n / 2 + c; return { max: base + R, min: base - R, amplitud: R }; },
    // AB·sen x + AD·cos x = 2S/AC → R·sen(x + φ) = 2S/AC, con φ de academia.
    terreno: ({ AB, AD, AC, S }) => {
      const R = Math.hypot(AB, AD), s = 2 * S / AC / R, phi = anguloTan(AD / AB);
      for (let g = 1; g < 180; g += 0.5) {
        const y = senAc(g);
        if (y !== null && Math.abs(y - s) < 1e-9) { const x = g - phi; if (x > 0 && x < 90) return { x, phi }; }
      }
      return { x: NaN, phi };
    },
    // sen x + cos x = k (o sen x − cos x = k) en un cuadrante dado.
    sumaK: ({ k, dato, cuadrante }) => {
      const P0 = dato === 'suma' ? (k * k - 1) / 2 : (1 - k * k) / 2;
      const otraAbs = Math.sqrt(Math.max(0, dato === 'suma' ? 2 - k * k : 2 - k * k));
      const sS = cuadrante <= 2 ? 1 : -1, sC = cuadrante === 1 || cuadrante === 4 ? 1 : -1;
      let sen, cos;
      if (dato === 'suma') { const dif = (sS > 0 && sC < 0 ? 1 : -1) * otraAbs; sen = (k + dif) / 2; cos = (k - dif) / 2; }
      else { const sum = sS * otraAbs; sen = (sum + k) / 2; cos = (sum - k) / 2; }
      return { producto: P0, otra: dato === 'suma' ? sen - cos : sen + cos, sen, cos, tangente: sen / cos };
    },
    // C = 2B, altura h y base a: h·t² + 2a·t − 3h = 0 con t = tan B.
    trianguloDoble: ({ h: al, a }) => { const t = (-2 * a + Math.sqrt(4 * a * a + 12 * al * al)) / (2 * al); return { tanB: t, tanC: 2 * t / (1 - t * t) }; },
    // k·F x·F(60 − x)·F(60 + x) = (k/4)·F 3x.
    tripleProducto: ({ F, x, k }) => (k / 4) * (F === 'cos' ? Math.cos(3 * x * RAD) : Math.sin(3 * x * RAD)),
    // T = c + b·cos 3θ con θ = k·t: primera hora t > 0 del extremo pedido.
    horaExtremo: ({ k, b, pide }) => { const objetivo = (pide === 'minima') === (b > 0) ? -1 : 1; return (objetivo === -1 ? 180 : 360) / (3 * k); },
    // Rango de las expresiones del tipo acotar.
    acotar: ({ modo, a, c, pot }) => {
      let lo, hi;
      if (modo === 'cuartas') { const f = pot === 4 ? 1 / 2 : 3 / 4; lo = a * (1 - f) + c; hi = a + c; }
      else { lo = c; hi = a * 2 ** (pot / 2) + c; }
      return { min: Math.min(lo, hi), max: Math.max(lo, hi), dif: Math.abs(hi - lo), suma: lo + hi };
    },
    // Relaciones de cofunción (los argumentos suman 90°) o igualdad de cosenos (argumentos iguales).
    cofuncion: ({ rel, al, p, be, q }) => (rel === 'cos-cos' ? (q - p) / (al - be) : (90 - p - q) / (al + be)),
    // cot x − tan x = 2 cot 2x, en cadena: E = 2^n·cot(2^n·x).
    cadena: ({ n, x }) => 2 ** n * cotR(2 ** n * x),
    // tan θ + cot θ = 2 csc 2θ; cot θ − tan θ = 2 cot 2θ.
    reduccionDoble: ({ theta, op }) => { const t = tanRed(theta); return op === 'suma' ? t + 1 / t : 1 / t - t; },
  };
  function anguloTan(t) {
    for (const [g, tv] of Object.entries(TAN_REF)) if (Math.abs(tv - t) < 1e-9) return Number(g);
    return NaN;
  }

  // ---------- armado ----------
  function armarEx(rng, correcta, errores, { texto = ex, unidad = '', positivo = false } = {}) {
    const tx = x => { const t = texto(x); return t === null ? null : (unidad ? `${t} ${unidad}` : t); };
    if (tx(correcta) === null) return null;
    const lista = errores.filter(e => e && Number.isFinite(e.valor) && Math.abs(e.valor - correcta) > 1e-9 && (!positivo || e.valor > 0) && tx(e.valor) !== null);
    return P.armar({ correcta, errores: lista, rng, negativos: true, texto: tx });
  }
  const enteroPos = x => Number.isFinite(x) && x > 0 && Math.abs(x - Math.round(x)) < 1e-9;

  // ---------- tipos ----------
  function condicional(rng) {
    const variables = { A: { nombre: 'tan A', color: 'o' }, B: { nombre: 'tan B', color: 'i' }, C: { nombre: 'tan C', color: 'h' }, R: { nombre: 'lo que se pide', color: 'd' } };
    if (rng.moneda()) {
      const T = [[3, 4], [4, 3], [5, 12], [12, 5], [7, 24], [24, 7], [8, 15], [15, 8]];
      const L = [[1, 2], [1, 3], [1, 4], [1, 5], [2, 3], [1, 7], [2, 5], [3, 5], [1, 6], [3, 4]];
      let tn, td, an, ad, bn, bd;
      for (;;) {
        [tn, td] = rng.elegir(T); [an, ad] = rng.elegir(L);
        bn = ad * td - an * tn; bd = an * td + tn * ad;
        if (bn <= 0) continue;
        const g = gcd(bn, bd); bn /= g; bd /= g;
        if (bn > 30 || bd > 30 || bn * ad === an * bd) continue;
        break;
      }
      const c = Math.round(Math.hypot(tn, td)), pide = rng.elegir(['cos', 'sen']);
      const cosC = td / c, senC = tn / c, correcta = pide === 'cos' ? cosC : senC, otra = pide === 'cos' ? senC : cosC;
      const a = fr(an, ad), b = fr(bn, bd);
      const intro = rng.elegir([
        'En el nudo de una estructura de vigas se forman tres ángulos agudos A, B y C que juntos suman 90°.',
        'Tres ángulos agudos A, B y C cumplen A + B + C = 90°.',
      ]);
      return {
        variables,
        enunciado: [intro, ' Se sabe que tan A = ', v('A', a), ' y tan B = ', v('B', b), '.'],
        pregunta: [`¿Cuánto vale ${pide} C?`],
        correcta,
        errores: [
          pa('TR9', otra, `Calculaste ${pide === 'cos' ? 'sen' : 'cos'} C. Pedían ${pide} C: ${pide === 'cos' ? 'el cateto adyacente' : 'el cateto opuesto'} a C entre la hipotenusa.`),
          h('TRI-da-la-tangente', tn / td, `Ese es tan C. Faltaba pasar a ${pide} C con el triángulo rectángulo de catetos ${tn} y ${td} e hipotenusa ${c}.`),
          h('TRI-cotangente-por-tangente', td / tn, `Ese número es cot C, que es tan(A + B). Como C = 90° − (A + B), tan C = cot(A + B): es el recíproco. Además pedían ${pide} C, no la tangente.`),
          h('TRI-secante', 1 / correcta, `Invertiste el cociente: hipotenusa entre cateto es la ${pide === 'cos' ? 'secante' : 'cosecante'}, no el ${pide === 'cos' ? 'coseno' : 'seno'}.`),
        ],
        solucion: [
          ['Si A + B + C = 90°, entonces C = 90° − (A + B) y tan C = cot(A + B). De ahí sale la condición tan A·tan B + tan B·tan C + tan C·tan A = 1.'],
          ['Reemplaza: ', v('A', a), ' · ', v('B', b), ' + (', v('A', a), ' + ', v('B', b), ')·tan C = 1, así que tan C = (1 − tan A·tan B)/(tan A + tan B) = ', v('C', fr(tn, td)), '.'],
          [`En el triángulo rectángulo de C, el cateto opuesto mide ${tn}, el adyacente ${td} y la hipotenusa √(${tn}² + ${td}²) = ${c}.`],
          [`${pide} C = ${pide === 'cos' ? td : tn}/${c} = `, v('R', ex(correcta)), '.'],
        ],
        datos: { tipo: 'condicional', suma: 90, tanA: [an, ad], tanB: [bn, bd], pide },
      };
    }
    const L = [[1, 1], [2, 1], [3, 1], [1, 2], [1, 3], [3, 2], [2, 3], [4, 3], [3, 4], [4, 1], [1, 4], [5, 1]];
    let an, ad, bn, bd, num, den;
    for (;;) {
      [an, ad] = rng.elegir(L); [bn, bd] = rng.elegir(L);
      if (an * bd === bn * ad) continue;
      num = an * bd + bn * ad; den = an * bn - ad * bd;
      if (den === 0) continue;
      const g = gcd(num, den); num /= g; den /= g;
      if (den < 0) { num = -num; den = -den; }
      if (Math.abs(num) > 30 || den > 30) continue;
      break;
    }
    const ta = an / ad, tb = bn / bd, correcta = num / den, a = fr(an, ad), b = fr(bn, bd);
    const intro = rng.elegir(['En el triángulo ABC', 'Un terreno tiene forma de triángulo ABC y, en el plano del topógrafo,']);
    variables.R = { nombre: 'tan C', color: 'd' };
    delete variables.C;
    return {
      variables,
      enunciado: [intro, ' se cumple tan A = ', v('A', a), ' y tan B = ', v('B', b), '.'],
      pregunta: ['¿Cuánto vale tan C?'],
      correcta,
      errores: [
        pa('TR12', -correcta, 'Calculaste tan(A + B) = (tan A + tan B)/(1 − tan A·tan B). Pero C = 180° − (A + B) y tan(180° − θ) = −tan θ: faltó cambiar el signo.'),
        pa('TR16', -(ta + tb), 'Tomaste tan(A + B) como tan A + tan B. La tangente de una suma no se reparte: lleva el denominador 1 − tan A·tan B.'),
        h('TRI-condicion-90', (1 - ta * tb) / (ta + tb), 'Usaste la condición de los ángulos que suman 90° (tan A·tan B + tan B·tan C + tan C·tan A = 1). En un triángulo suman 180° y la condición es tan A + tan B + tan C = tan A·tan B·tan C.'),
        h('TRI-denominador-con-mas', (ta + tb) / (ta * tb + 1), 'Pusiste tan A·tan B + 1 en el denominador. De tan A + tan B + tan C = tan A·tan B·tan C se despeja tan C = (tan A + tan B)/(tan A·tan B − 1).'),
        h('TRI-producto', ta * tb, 'Multiplicaste las dos tangentes. La condición del triángulo relaciona la suma de las tres tangentes con su producto; hay que despejar tan C.'),
      ],
      solucion: [
        ['En un triángulo, A + B + C = 180°, y de ahí sale tan A + tan B + tan C = tan A·tan B·tan C.'],
        [v('A', a), ' + ', v('B', b), ' + tan C = ', v('A', a), ' · ', v('B', b), ' · tan C → tan C·(tan A·tan B − 1) = tan A + tan B.'],
        [`tan C = (${ex(ta + tb)})/(${ex(ta * tb - 1)}) = `, v('R', ex(correcta)), correcta < 0 ? ': es negativa, así que C es obtuso.' : '.'],
      ],
      datos: { tipo: 'condicional', suma: 180, tanA: [an, ad], tanB: [bn, bd] },
    };
  }

  function maximo(rng) {
    const [a, b] = rng.elegir([[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5]]);
    const m = 2 * a, n = 2 * b, c = rng.entero(-4, 5), cuadrado = rng.elegir(['cos', 'sen']), pide = rng.elegir(['max', 'min']);
    const R = Math.hypot(a, b), base = b + c, correcta = pide === 'max' ? base + R : base - R, s = pide === 'max' ? 1 : -1;
    const variables = { m: { nombre: 'coeficiente de sen x cos x', color: 'o' }, n: { nombre: `coeficiente de ${cuadrado}²x`, color: 'i' }, c: { nombre: 'término constante', color: 'h' }, R: { nombre: pide === 'max' ? 'valor máximo' : 'valor mínimo', color: 'd' } };
    const nombre = pide === 'max' ? 'máximo' : 'mínimo';
    const cola = c === 0 ? [] : [c > 0 ? ' + ' : ' − ', v('c', Math.abs(c))];
    const intro = rng.elegir([['La lectura de un sensor de vibración, para un ángulo de giro x, es L(x) = '], ['Sea L(x) = ']]);
    const mas = cuadrado === 'cos' ? '+' : '−';
    return {
      variables,
      enunciado: [...intro, v('m', m), ' sen x cos x + ', v('n', n), ` ${cuadrado}²x`, ...cola, ', con x real.'],
      pregunta: [`¿Cuál es el valor ${nombre} de L?`],
      correcta,
      errores: [
        pa('TR16', base + s * (a + b), `Tomaste ${a} + ${b} como ${nombre} de ${a} sen 2x ${mas} ${b} cos 2x. El seno y el coseno no llegan a 1 a la vez: el ${nombre} es ${s > 0 ? '' : '−'}√(${a}² + ${b}²) = ${s > 0 ? '' : '−'}${R}.`),
        h('TRI-olvida-desplazamiento', c + s * R, `Reemplazaste ${cuadrado}²x por ${mas === '+' ? '' : '−'}(cos 2x)/2 y te olvidaste del término constante: ${cuadrado}²x = (1 ${mas} cos 2x)/2 deja ${n}/2 = ${b} sumando.`),
        h('TRI-sin-mitad', c + s * Math.hypot(m, n), `Usaste ${m} y ${n} como coeficientes de sen 2x y cos 2x. Al pasar al ángulo doble se dividen entre 2: sen x cos x = (sen 2x)/2.`),
        h('TRI-senxcosx-hasta-1', s > 0 ? m + n + c : c - m, s > 0 ? `Tomaste sen x cos x ≤ 1 y ${cuadrado}²x ≤ 1 por separado. sen x cos x llega solo a 1/2 y los dos términos no son máximos a la vez.` : `Tomaste −1 ≤ sen x cos x y ${cuadrado}²x ≥ 0 por separado. sen x cos x llega solo a −1/2, y los dos términos no son mínimos a la vez.`),
        h('TRI-da-la-amplitud', s * R, `Ese es el ${nombre} de ${a} sen 2x ${mas} ${b} cos 2x solo. Faltó sumar la parte constante, ${b} ${c >= 0 ? '+' : '−'} ${Math.abs(c)}.`),
      ],
      solucion: [
        [`sen x cos x = (sen 2x)/2 y ${cuadrado}²x = (1 ${mas} cos 2x)/2.`],
        ['L = ', `${a} sen 2x ${mas} ${b} cos 2x + ${b}${conSigno(c)}`, ` = ${a} sen 2x ${mas} ${b} cos 2x ${signo(base)}.`],
        [`El valor de ${a} sen 2x ${mas} ${b} cos 2x va de −√(${a}² + ${b}²) a √(${a}² + ${b}²), es decir, de −${R} a ${R} (no llega a ${a + b}: el seno y el coseno no valen 1 a la vez).`],
        [`${nombre} de L = ${pide === 'max' ? R : '−' + R} ${signo(base)} = `, v('R', ex(correcta)), '.'],
      ],
      datos: { tipo: 'maximo', m, n, c, cuadrado, pide },
    };
  }

  function terreno(rng) {
    const conf = rng.elegir([
      { p: 4, r: 3, phi: 37, R: 5, xs: [16, 53], raiz: false },
      { p: 3, r: 4, phi: 53, R: 5, xs: [37, 74], raiz: false },
      { p: 1, r: S3, phi: 60, R: 2, xs: [30, 60], raiz: true },
      { p: S3, r: 1, phi: 30, R: 2, xs: [30, 60], raiz: true },
    ]);
    const k = conf.raiz ? rng.elegir([2, 4, 6]) : rng.elegir([1, 2, 3, 4]);
    const x = rng.elegir(conf.xs), AB = conf.p * k, AD = conf.r * k, AC = rng.elegir([6, 8, 10, 12]);
    const V = conf.R * k * senAc(x + conf.phi), S = AC * V / 2;
    const tAB = ex(AB), tAD = ex(AD), tS = ex(S);
    const variables = { AB: { nombre: 'lado AB', color: 'o' }, AD: { nombre: 'lado AD', color: 'i' }, S: { nombre: 'área del terreno', color: 'h' }, x: { nombre: 'ángulo entre AC y AB', color: 'd' } };
    const otra = 180 - 2 * conf.phi - x;
    const errores = [
      h('TRI-olvida-restar-auxiliar', x + conf.phi, `Ese es x + ${conf.phi}°, el ángulo del seno. Hay que restarle el ángulo auxiliar ${conf.phi}°.`),
      h('TRI-angulo-auxiliar', conf.phi, `Ese es el ángulo auxiliar φ, que sale de los lados (tan φ = AD/AB). No es x.`),
      h('TRI-complemento', 90 - x, `Ese es el ángulo que AC forma con AD (90° − x), no con AB.`),
      h('TRI-auxiliar-al-reves', x + 2 * conf.phi - 90, `Tomaste el ángulo auxiliar al revés (90° − ${conf.phi}°). En AB·sen x + AD·cos x = R·sen(x + φ), cos φ = AB/R y sen φ = AD/R.`),
    ];
    if (otra >= 90) errores.push(pa('TR21', otra, `Tomaste la otra solución de sen(x + ${conf.phi}°) = ${ex(senAc(x + conf.phi))}. Con ella x no es agudo (y el ángulo entre AC y AD sería 90° − x ≤ 0): se descarta.`));
    const tR = ex(conf.R * k);
    return {
      variables,
      enunciado: ['Un terreno tiene forma de cuadrilátero ABCD con ángulo recto en A. Los lados AB y AD miden ', v('AB', `${tAB} m`), ' y ', v('AD', `${tAD} m`), `. La diagonal AC mide ${AC} m y forma con AB un ángulo agudo x (y con AD, el ángulo 90° − x). El área del terreno es `, v('S', `${tS} m²`), '.'],
      pregunta: ['¿Cuánto mide x?'],
      correcta: x,
      errores,
      opciones: { texto: grados, positivo: true },
      solucion: [
        ['La diagonal AC parte el terreno en dos triángulos: S = (1/2)·AB·AC·sen x + (1/2)·AD·AC·sen(90° − x) = (AC/2)·(AB·sen x + AD·cos x).'],
        [v('S', tS), ` = (${AC}/2)·(`, v('AB', tAB), ' sen x + ', v('AD', tAD), ` cos x) → ${tAB} sen x + ${tAD} cos x = ${ex(V)}.`],
        [`${tAB} sen x + ${tAD} cos x = ${tR}·sen(x + ${conf.phi}°), porque √((${tAB})² + (${tAD})²) = ${tR}, cos ${conf.phi}° = ${ex(AB / (conf.R * k))} y sen ${conf.phi}° = ${ex(AD / (conf.R * k))}.`],
        [`sen(x + ${conf.phi}°) = ${ex(V)}/${tR} = ${ex(senAc(x + conf.phi))} → x + ${conf.phi}° = ${x + conf.phi}°` + (otra > 0 && otra !== x ? ` (la otra opción, ${180 - x - conf.phi}°, daría x = ${otra}°, que no es agudo).` : '.')],
        ['x = ', v('x', grados(x)), '.'],
      ],
      datos: { tipo: 'terreno', AB, AD, AC, S, ABtexto: tAB, ADtexto: tAD, Stexto: tS },
    };
  }

  function sumaK(rng) {
    let [a, b, c] = rng.elegir([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]]);
    if (rng.moneda()) [a, b] = [b, a];
    const dato = rng.elegir(['suma', 'resta']);
    const cuadrante = dato === 'suma' ? rng.elegir([2, 4]) : rng.elegir([1, 3]);
    const sS = cuadrante <= 2 ? 1 : -1, sC = cuadrante === 1 || cuadrante === 4 ? 1 : -1;
    const sen = sS * a / c, cos = sC * b / c;
    const kn = dato === 'suma' ? sS * a + sC * b : sS * a - sC * b, k = kn / c, Pr = sen * cos;
    const pide = rng.elegir(['producto', 'otra', 'tangente']);
    const ROM = ['', 'I', 'II', 'III', 'IV'];
    const op = dato === 'suma' ? '+' : '−', opOtra = dato === 'suma' ? '−' : '+';
    const variables = { k: { nombre: `sen x ${op} cos x`, color: 'o' }, P: { nombre: 'sen x · cos x', color: 'i' }, R: { nombre: 'lo que se pide', color: 'd' } };
    const tk = fr(kn, c);
    const enunciado = [`Un ángulo x del ${ROM[cuadrante]} cuadrante cumple sen x ${op} cos x = `, v('k', tk), '.'];
    const pasoP = [`(sen x ${op} cos x)² = sen²x + cos²x ${op} 2 sen x cos x = 1 ${op} 2 sen x cos x, así que (`, v('k', tk), `)² = 1 ${op} 2P → P = sen x cos x = `, v('P', ex(Pr)), '.'];
    let pregunta, correcta, errores, solucion;
    if (pide === 'producto') {
      pregunta = ['¿Cuánto vale sen x · cos x?'];
      correcta = Pr;
      variables.R = { nombre: 'sen x · cos x', color: 'd' }; delete variables.P;
      errores = [
        h('TRI-olvida-el-2', 2 * Pr, `Despejaste 2 sen x cos x y no dividiste entre 2.`),
        h('TRI-signo-al-despejar', -Pr, `Te equivocaste de signo al despejar: de k² = 1 ${op} 2 sen x cos x sale sen x cos x = ${dato === 'suma' ? '(k² − 1)/2' : '(1 − k²)/2'}.`),
        pa('TR16', dato === 'suma' ? (k - 1) / 2 : (1 - k) / 2, 'Trabajaste con k sin elevarlo al cuadrado, como si (sen x ± cos x) se pudiera repartir. Hay que elevar al cuadrado los dos lados.'),
        h('TRI-olvida-sen2-mas-cos2', dato === 'suma' ? k * k / 2 : -k * k / 2, 'Olvidaste que sen²x + cos²x = 1 al desarrollar el cuadrado: ese 1 también se pasa al otro lado.'),
      ];
      solucion = [pasoP.map(s => (typeof s === 'object' && s.v === 'P' ? v('R', s.t) : s)), [`Ojo: el signo de sen x cos x cuadra con el ${ROM[cuadrante]} cuadrante (${Pr > 0 ? 'seno y coseno con el mismo signo' : 'seno y coseno de signos distintos'}).`]];
    } else if (pide === 'otra') {
      const O = dato === 'suma' ? sen - cos : sen + cos;
      pregunta = [`¿Cuánto vale sen x ${opOtra} cos x?`];
      correcta = O;
      errores = [
        pa('TR21', -O, `Al sacar la raíz salen dos valores, ±${ex(Math.abs(O))}. En el ${ROM[cuadrante]} cuadrante sen x ${opOtra} cos x es ${O > 0 ? 'positivo' : 'negativo'}: había que descartar el otro.`),
        h('TRI-sin-raiz', O * O, `Ese es (sen x ${opOtra} cos x)². Faltó sacar la raíz cuadrada.`),
        h('TRI-da-el-producto', Pr, 'Ese es sen x · cos x, un paso intermedio. Con él se calcula (sen x ' + opOtra + ' cos x)² = 1 ' + opOtra + ' 2 sen x cos x.'),
        h('TRI-olvida-el-2', Math.sign(O) * Math.sqrt(Math.max(0, 1 - (dato === 'suma' ? 1 : -1) * Pr)), `Usaste (sen x ${opOtra} cos x)² = 1 ${opOtra} sen x cos x: faltó el 2 del doble producto.`),
        h('TRI-resta-lineal', dato === 'suma' ? 1 - k : 1 + k, 'Restaste o sumaste k a 1 como si fuera lineal. Hay que pasar por el cuadrado.'),
      ];
      solucion = [pasoP, [`(sen x ${opOtra} cos x)² = 1 ${opOtra} 2P = ${ex(O * O)} → sen x ${opOtra} cos x = ±${ex(Math.abs(O))}.`],
        [`En el ${ROM[cuadrante]} cuadrante sen x es ${sS > 0 ? 'positivo' : 'negativo'} y cos x es ${sC > 0 ? 'positivo' : 'negativo'}, así que sen x ${opOtra} cos x es ${O > 0 ? 'positivo' : 'negativo'}: `, v('R', ex(O)), '.']];
    } else {
      pregunta = ['¿Cuánto vale tan x?'];
      correcta = sen / cos;
      const r1 = dato === 'suma' ? sen : sen, r2 = dato === 'suma' ? cos : -cos;
      errores = [
        h('TRI-raices-cruzadas', cos / sen, `Asignaste al revés las dos raíces: el seno es la que tiene el signo del seno en el ${ROM[cuadrante]} cuadrante.`),
        pa('TR12', -sen / cos, `El signo no cuadra: en el ${ROM[cuadrante]} cuadrante la tangente es ${sen / cos > 0 ? 'positiva' : 'negativa'}.`),
        h('TRI-raices-cruzadas-signo', -cos / sen, 'Asignaste al revés las raíces y además cambiaste el signo.'),
        h('TRI-da-el-producto', Pr, 'Ese es sen x · cos x, un paso intermedio. Con él se hallan sen x y cos x por separado.'),
      ];
      const ecu = dato === 'suma' ? `sen x y cos x suman ${tk} y multiplican ${ex(Pr)}: son las raíces de z² − (${tk})z + (${ex(Pr)}) = 0` : `sen x y −cos x suman ${tk} y multiplican ${ex(-Pr)}: son las raíces de z² − (${tk})z + (${ex(-Pr)}) = 0`;
      solucion = [pasoP, [`${ecu}, es decir, ${ex(r1)} y ${ex(r2)} (en algún orden).`],
        [`En el ${ROM[cuadrante]} cuadrante sen x es ${sS > 0 ? 'positivo' : 'negativo'}: sen x = ${ex(sen)} y cos x = ${ex(cos)}.`],
        ['tan x = sen x / cos x = ', v('R', ex(sen / cos)), '.']];
    }
    return { variables, enunciado, pregunta, correcta, errores, solucion, datos: { tipo: 'suma-k', dato, k: [kn, c], cuadrante, pide } };
  }

  function trianguloDoble(rng) {
    const [n, d] = rng.elegir([[1, 2], [1, 3], [3, 4], [2, 3], [1, 4], [2, 5]]);
    const g = gcd(3 * d * d - n * n, 2 * n * d);
    let al = 2 * n * d / g, a = (3 * d * d - n * n) / g;
    if (al * 2 <= 24 && rng.moneda()) { al *= 2; a *= 2; }
    const t = n / d, tC = 2 * t / (1 - t * t), pide = rng.elegir(['tanB', 'tanC']);
    const variables = { h: { nombre: 'altura AH', color: 'o' }, a: { nombre: 'lado BC', color: 'i' }, t: { nombre: 'tan B', color: 'h' }, C: { nombre: 'tan C', color: 'd' } };
    const neg = -3 / t, intro = rng.elegir(['El frontón de un techo es un triángulo ABC que tiene', 'Un triángulo ABC tiene']);
    const errores = pide === 'tanB' ? [
      pa('TR21', neg, `La cuadrática tiene dos raíces y tomaste la negativa. B es un ángulo agudo de triángulo (la altura cae dentro de BC): tan B > 0.`),
      h('TRI-da-la-cotangente', 1 / t, 'Ese es cot B = BH/AH. La tangente es al revés: cateto opuesto (AH) entre adyacente (BH).'),
      h('TRI-da-tan-C', tC, 'Ese es tan C = tan 2B. Pedían tan B.'),
      h('TRI-altura-entre-base', al / a, 'Dividiste la altura entre todo el lado BC. La tangente de B usa solo el tramo BH, no BC completo.'),
    ] : [
      pa('TR16', 2 * t, `Usaste tan 2B = 2 tan B. El ángulo doble no es lineal: tan 2B = 2 tan B/(1 − tan²B).`),
      h('TRI-formula-del-seno', 2 * t / (1 + t * t), 'Usaste 2 tan B/(1 + tan²B), que es sen 2B. La tangente del doble lleva 1 − tan²B en el denominador.'),
      h('TRI-da-tan-B', t, 'Ese es tan B. Pedían tan C, y C = 2B.'),
      pa('TR21', 2 * neg / (1 - neg * neg), `Partiste de la raíz negativa de la cuadrática (tan B = ${ex(neg)}). B es agudo: tan B > 0.`),
    ];
    const sol = [
      ['Con t = tan B: en el triángulo ABH, BH = AH/t; en el triángulo ACH, HC = AH/tan C = AH·cot 2B.'],
      ['Como tan 2B = 2t/(1 − t²), cot 2B = (1 − t²)/(2t).'],
      ['BH + HC = BC: ', v('h', al), '/t + ', v('h', al), '·(1 − t²)/(2t) = ', v('a', a), ` → ${al}(3 − t²) = ${2 * a}t → ${al}t² + ${2 * a}t − ${3 * al} = 0.`],
      [`Las raíces son ${fr(n, d)} y ${ex(neg)}; B es agudo, así que tan B = `, v('t', fr(n, d)), '.'],
    ];
    if (pide === 'tanC') sol.push(['tan C = tan 2B = 2t/(1 − t²) = ', v('C', ex(tC)), '.']);
    return {
      variables,
      enunciado: [intro, ' el ángulo C igual al doble del ángulo B. La altura AH (con H en el lado BC) mide ', v('h', `${al} m`), ' y el lado BC mide ', v('a', `${a} m`), '.'],
      pregunta: [pide === 'tanB' ? '¿Cuánto vale tan B?' : '¿Cuánto vale tan C?'],
      correcta: pide === 'tanB' ? t : tC,
      errores,
      solucion: sol,
      datos: { tipo: 'triangulo-doble', h: al, a, pide },
    };
  }

  function tripleProducto(rng) {
    if (rng.moneda()) {
      const F = rng.elegir(['cos', 'sen']), G = F === 'cos' ? 'sen' : 'cos', x = rng.elegir([10, 15, 20]), k = rng.elegir([2, 4, 8, 16]);
      const val = th => (F === 'cos' ? Math.cos(th * RAD) : Math.sin(th * RAD));
      const F3 = val(3 * x), correcta = k / 4 * F3, G3 = G === 'cos' ? Math.cos(3 * x * RAD) : Math.sin(3 * x * RAD);
      const variables = { k: { nombre: 'coeficiente', color: 'o' }, x: { nombre: 'ángulo menor', color: 'i' }, R: { nombre: 'valor de E', color: 'd' } };
      return {
        variables,
        enunciado: ['Calcula E = ', v('k', k), ` · ${F} `, v('x', `${x}°`), ` · ${F} ${60 - x}° · ${F} ${60 + x}°.`],
        pregunta: ['¿Cuánto vale E?'],
        correcta,
        errores: [
          h('TRI-olvida-el-cuarto', k * F3, `La identidad es 4·${F} x·${F}(60° − x)·${F}(60° + x) = ${F} 3x: el producto solo vale ${F} 3x dividido entre 4.`),
          h('TRI-cambia-funcion', k / 4 * G3, `Con ${F === 'cos' ? 'cosenos' : 'senos'} el producto da ${F} 3x, no ${G} 3x.`),
          pa('TR16', k * val(120), 'Sumaste los tres ángulos como si el producto de las razones fuera la razón de la suma. Eso no vale: hay que usar la identidad del triple.'),
          h('TRI-un-medio', k / 2 * F3, `Dividiste entre 2, como en 2 sen x cos x = sen 2x. Con tres factores, la identidad lleva un 4.`),
          h('TRI-sin-triple', k / 4 * val(x), `Usaste ${F} x en vez de ${F} 3x.`),
        ],
        solucion: [
          [`Identidad del triple: 4·${F} x·${F}(60° − x)·${F}(60° + x) = ${F} 3x.`],
          ['Aquí x = ', v('x', `${x}°`), `: 60° − x = ${60 - x}° y 60° + x = ${60 + x}°.`],
          ['E = (', v('k', k), `/4)·${F} ${3 * x}° = (${ex(k / 4)})·(${ex(F3)}) = `, v('R', ex(correcta)), '.'],
        ],
        datos: { tipo: 'triple-producto', modo: 'valor', F, x, k },
      };
    }
    const k = rng.elegir([5, 10, 15, 20]), b = rng.elegir([2, 3, 4]) * (rng.moneda() ? 1 : -1), c = rng.elegir([12, 15, 18, 20]), pide = rng.elegir(['minima', 'maxima']);
    const objetivo = (pide === 'minima') === (b > 0) ? -1 : 1, tb = 4 * b, to = objetivo === -1 ? '−1' : '1', tno = objetivo === -1 ? '1' : '−1';
    const correcta = calc.horaExtremo({ k, b, pide }), otro = (objetivo === -1 ? 360 : 180) / (3 * k);
    const variables = { b: { nombre: 'amplitud', color: 'o' }, k: { nombre: 'grados por hora', color: 'i' }, R: { nombre: 'hora pedida', color: 'd' } };
    const extremo = pide === 'minima' ? 'mínima' : 'máxima';
    const errores = [
      h('TRI-sin-triple', 3 * correcta, `Buscaste cos θ = ${to} en vez de cos 3θ = ${to}. El producto de los tres cosenos es (cos 3θ)/4: el ángulo que importa es 3θ.`),
      h('TRI-maximo-por-minimo', otro, `En ese instante cos 3θ = ${tno} y la temperatura es ${pide === 'minima' ? 'máxima' : 'mínima'}. Fíjate en el signo del coeficiente: ${b > 0 ? 'con +' : 'con −'}, la temperatura ${extremo} va con cos 3θ = ${to}.`),
      h('TRI-coseno-cero', 30 / k, 'En ese instante cos 3θ = 0: la temperatura pasa por su valor medio, no por un extremo.'),
      h('TRI-sin-triple-y-extremo', 3 * otro, 'Usaste cos θ en vez de cos 3θ y además el extremo equivocado.'),
    ].filter(e => e.valor <= 24);
        return {
      variables,
      enunciado: [`En una estación meteorológica, la temperatura (en °C) t horas después de empezar la medición es T = ${c} ${tb > 0 ? '+' : '−'} `, v('b', Math.abs(tb)), '·cos θ·cos(60° − θ)·cos(60° + θ), con θ = ', v('k', `${k}t`), ' grados (0 < t ≤ 24).'],
      pregunta: [`¿A cuántas horas de empezar se registra por primera vez la temperatura ${extremo}?`],
      correcta,
      errores,
      opciones: { unidad: 'h', positivo: true },
      solucion: [
        ['Identidad del triple: 4·cos θ·cos(60° − θ)·cos(60° + θ) = cos 3θ.'],
        [`T = ${c} ${b > 0 ? '+' : '−'} (`, v('b', Math.abs(tb)), `/4)·cos 3θ = ${c} ${b > 0 ? '+' : '−'} ${Math.abs(b)}·cos 3θ, con 3θ = 3·`, v('k', `${k}t`), ` = ${3 * k}t grados.`],
        [`La temperatura ${extremo} va con cos 3θ = ${to}${b > 0 ? '' : ' (el coeficiente es negativo: los papeles se invierten)'}; la primera vez, 3θ = ${objetivo === -1 ? 180 : 360}°.`],
        [`${3 * k}t = ${objetivo === -1 ? 180 : 360} → t = `, v('R', `${ex(correcta)} h`), '.'],
      ],
      datos: { tipo: 'triple-producto', modo: 'hora', k, b, c, pide },
    };
  }

  function acotar(rng) {
    const modo = rng.elegir(['cuartas', 'potencia']);
    const variables = { a: { nombre: 'coeficiente', color: 'o' }, c: { nombre: 'término constante', color: 'i' }, R: { nombre: 'lo que se pide', color: 'd' } };
    let a, pot, sg, rango, modelos, expr, pasos;
    const c = rng.entero(-3, 5);
    const cola = c === 0 ? [] : [c > 0 ? ' + ' : ' − ', v('c', Math.abs(c))];
    if (modo === 'cuartas') {
      pot = rng.elegir([4, 6]); a = pot === 4 ? rng.elegir([2, 4, 6, 8, 10]) : rng.elegir([4, 8, 12, 16]);
      const f = pot === 4 ? 1 / 2 : 3 / 4, tf = pot === 4 ? '1/2' : '3/4', sup = pot === 4 ? '⁴' : '⁶';
      rango = [a * (1 - f) + c, a + c];
      modelos = [
        ['TRI-seno-cuadrado-negativo', [a * (1 - f) + c, a * (1 + f) + c], `Tomaste −1 ≤ sen²2x ≤ 1. Un cuadrado no es negativo: 0 ≤ sen²2x ≤ 1.`],
        ['TR16', [a * (1 - 4 * f) + c, a + c], `Escribiste sen²x cos²x como sen²2x. Pero sen x cos x = (sen 2x)/2, así que sen²x cos²x = (sen²2x)/4.`],
        ['TRI-es-constante', [a + c, a + c], `Tomaste sen${sup}x + cos${sup}x = 1, como si fuera sen²x + cos²x. Al desarrollar aparece un término con sen²x cos²x que cambia con x.`],
        ['TRI-cada-potencia', [c, 2 * a + c], `Acotaste cada potencia entre 0 y 1 por separado. Las dos no llegan a 1 (ni a 0) a la vez.`],
      ];
      expr = ['E = ', v('a', a), `(sen${pot === 4 ? '⁴' : '⁶'}x + cos${pot === 4 ? '⁴' : '⁶'}x)`, ...cola];
      pasos = [
        [pot === 4 ? 'sen⁴x + cos⁴x = (sen²x + cos²x)² − 2 sen²x cos²x = 1 − 2 sen²x cos²x.' : 'sen⁶x + cos⁶x = (sen²x + cos²x)³ − 3 sen²x cos²x (sen²x + cos²x) = 1 − 3 sen²x cos²x.'],
        [`Como sen x cos x = (sen 2x)/2: sen${sup}x + cos${sup}x = 1 − (${tf})·sen²2x.`],
        [`0 ≤ sen²2x ≤ 1, así que ${ex(1 - f)} ≤ sen${sup}x + cos${sup}x ≤ 1 y ${ex(rango[0])} ≤ E ≤ ${ex(rango[1])}.`],
      ];
    } else {
      pot = rng.elegir([2, 4]); a = rng.elegir([2, 3, 5]); sg = rng.elegir(['mas', 'menos']);
      const nn = pot / 2, o = sg === 'mas' ? '+' : '−';
      rango = [c, a * 2 ** nn + c];
      modelos = [
        ['TRI-seno-doble-positivo', [a + c, a * 2 ** nn + c], `Tomaste 0 ≤ sen 2x ≤ 1. El seno también es negativo: −1 ≤ sen 2x ≤ 1, y 1 ${o} sen 2x va de 0 a 2.`],
        ['TRI-suma-hasta-1', [c, a + c], `Tomaste −1 ≤ sen x ${o} cos x ≤ 1. La suma de los dos llega hasta √2 en valor absoluto.`],
        ['TRI-olvida-la-potencia', [c, 2 * a + c], `Acotaste (sen x ${o} cos x)² y olvidaste elevar al resto de la potencia.`],
        ['TR16', [a + c, a + c], `Tomaste (sen x ${o} cos x)² = sen²x + cos²x = 1: faltó el doble producto ${o}2 sen x cos x.`],
      ];
      expr = ['E = ', v('a', a), `(sen x ${o} cos x)${pot === 2 ? '²' : '⁴'}`, ...cola];
      pasos = [
        [`(sen x ${o} cos x)² = sen²x + cos²x ${o} 2 sen x cos x = 1 ${o} sen 2x.`],
        [`−1 ≤ sen 2x ≤ 1, así que 0 ≤ 1 ${o} sen 2x ≤ 2` + (nn === 2 ? ' y 0 ≤ (1 ' + o + ' sen 2x)² ≤ 4.' : '.')],
        [`${ex(rango[0])} ≤ E ≤ ${ex(rango[1])}.`],
      ];
    }
    const pide = rng.elegir(modo === 'cuartas' ? ['dif', 'suma', 'min'] : ['dif', 'suma']);
    const que = { dif: 'la diferencia entre el valor máximo y el valor mínimo de E', suma: 'la suma del valor máximo y el valor mínimo de E', min: 'el valor mínimo de E', max: 'el valor máximo de E' }[pide];
    const valor = ([lo, hi]) => ({ dif: hi - lo, suma: hi + lo, min: lo, max: hi }[pide]);
    const correcta = valor(rango);
    const errores = modelos.map(([id, r, exp]) => (id === 'TR16' ? pa : h)(id, valor(r), exp));
    pasos.push([`${{ dif: 'máximo − mínimo', suma: 'máximo + mínimo', min: 'mínimo', max: 'máximo' }[pide]} = `, v('R', ex(correcta)), '.']);
    return {
      variables,
      enunciado: [...expr, ', con x real.'],
      pregunta: [`¿Cuál es ${que}?`],
      correcta, errores, solucion: pasos,
      datos: { tipo: 'acotar', modo, a, c, pot, signo: modo === 'potencia' ? sg : null, pide },
    };
  }

  function cofuncion(rng) {
    const rel = rng.elegir(['sen-cos', 'tan-cot', 'sec-csc', 'tan-tan', 'cos-cos']);
    let al, be, p, q, x;
    for (let i = 0; ; i++) {
      al = rng.entero(1, 5); be = rng.entero(1, 5); x = rng.entero(4, 20); p = 5 * rng.entero(-2, 6);
      if (al === be) continue;
      q = rel === 'cos-cos' ? (al - be) * x + p : 90 - p - (al + be) * x;
      if (Math.abs(q) > 40) continue;
      const u = al * x + p, w = be * x + q;
      if (u <= 0 || u >= 90 || w <= 0 || w >= 90) continue;
      if (rel !== 'cos-cos' && u === w) continue;
      break;
    }
    const arg = (c, k) => `${c === 1 ? '' : c}x${k === 0 ? '' : (k > 0 ? ' + ' : ' − ') + Math.abs(k)}`;
    const U = arg(al, p), W = arg(be, q);
    const FORMA = {
      'sen-cos': [`sen(${U})° = cos(${W})°`, 'sen u = cos w'], 'tan-cot': [`tan(${U})° = cot(${W})°`, 'tan u = cot w'],
      'sec-csc': [`sec(${U})° = csc(${W})°`, 'sec u = csc w'], 'tan-tan': [`tan(${U})° · tan(${W})° = 1`, 'tan u · tan w = 1, es decir, tan u = cot w'],
      'cos-cos': [`cos(${U})° = cos(${W})°`, 'cos u = cos w'],
    }[rel];
    const variables = { u: { nombre: 'primer ángulo', color: 'o' }, w: { nombre: 'segundo ángulo', color: 'i' }, R: { nombre: 'x', color: 'd' } };
    const intro = rng.elegir([
      ['Dos cables tensan una antena vertical y forman con el suelo ángulos agudos de ', v('u', `(${U})°`), ' y ', v('w', `(${W})°`), `. Se sabe que ${FORMA[0]}.`],
      ['Los ángulos ', v('u', `(${U})°`), ' y ', v('w', `(${W})°`), ` son agudos y cumplen ${FORMA[0]}.`],
    ]);
    const cumple = xx => {
      const u = al * xx + p, w = be * xx + q;
      if (!(u > 0 && u < 90 && w > 0 && w < 90)) return false;
      return rel === 'cos-cos' ? Math.abs(u - w) < 1e-9 : Math.abs(u + w - 90) < 1e-9;
    };
    let errores, sol;
    if (rel === 'cos-cos') {
      errores = [
        h('TRI-cofuncion-de-mas', (90 - p - q) / (al + be), 'Sumaste los ángulos y los igualaste a 90°. Esa es la regla para sen u = cos w; con el mismo coseno a los dos lados, los ángulos agudos son iguales.'),
        h('TRI-suma-180', (180 - p - q) / (al + be), 'Igualaste la suma a 180°. Dos ángulos suplementarios tienen cosenos opuestos, no iguales.'),
        h('TRI-signo-al-transponer', (q + p) / (al - be), 'Al pasar los números al otro lado no cambiaste el signo de uno de ellos.'),
        h('TRI-resta-al-reves', (q - p) / (al + be), 'Juntaste los términos con x sumando sus coeficientes. Al pasarlos al mismo lado, uno resta.'),
      ];
      sol = [[`Si cos u = cos w y los dos ángulos son agudos, son iguales: ${U} = ${W}.`], [`${al - be}x = ${q - p} → x = `, v('R', ex(x)), '.'], [`Control: los dos ángulos miden ${al * x + p}°.`]];
    } else {
      errores = [
        h('TRI-iguala-argumentos', (q - p) / (al - be), `Igualaste los ángulos. ${FORMA[1].split(',')[0]} no pide ángulos iguales: pide ángulos complementarios (la cofunción del complemento).`),
        h('TRI-suma-180', (180 - p - q) / (al + be), 'Igualaste la suma a 180°. Razón y co-razón son iguales cuando los ángulos suman 90°.'),
        h('TRI-ignora-constantes', 90 / (al + be), 'Igualaste a 90° solo los términos con x y olvidaste los números que suman o restan.'),
        h('TRI-signo-al-transponer', (90 + p + q) / (al + be), 'Al pasar los números al otro lado no les cambiaste el signo.'),
      ];
      sol = [[`${FORMA[1]}. Para ángulos agudos esto pasa cuando son complementarios: u + w = 90°.`], [`(${U}) + (${W}) = 90 → ${al + be}x ${p + q >= 0 ? '+' : '−'} ${Math.abs(p + q)} = 90 → x = `, v('R', ex(x)), '.'], [`Control: los ángulos miden ${al * x + p}° y ${be * x + q}°, que suman 90°.`]];
    }
    errores = errores.filter(e => enteroPos(e.valor) && !cumple(e.valor));
    return {
      variables, enunciado: intro, pregunta: ['¿Cuánto vale x?'], correcta: x, errores, solucion: sol,
      datos: { tipo: 'cofuncion', rel, al, p, be, q },
    };
  }

  function cadena(rng) {
    const [n, x] = rng.elegir([[1, 22.5], [1, 15], [1, 30], [1, 60], [2, 7.5], [2, 15], [2, 11.25], [2, 30], [3, 7.5], [3, 15]]);
    const N = 2 ** n, correcta = calc.cadena({ n, x });
    const terminos = ['cot ', v('x', grados(x)), ' − tan ', v('x', grados(x))];
    for (let j = 1; j < n; j++) terminos.push(` − ${2 ** j} tan ${grados(2 ** j * x)}`);
    const variables = { x: { nombre: 'ángulo', color: 'o' }, R: { nombre: 'valor de E', color: 'd' } };
    const tanR = g => { const t = Math.tan(g * RAD); return Math.abs(t) > 1e9 ? NaN : t; };
    const csc = g => { const s = Math.sin(g * RAD); return Math.abs(s) < 1e-12 ? NaN : 1 / s; };
    const sol = [['Identidad auxiliar: cot θ − tan θ = 2 cot 2θ.']];
    let paso = `cot ${grados(x)} − tan ${grados(x)} = 2 cot ${grados(2 * x)}`;
    for (let j = 1; j < n; j++) paso += `; ${2 ** j} cot ${grados(2 ** j * x)} − ${2 ** j} tan ${grados(2 ** j * x)} = ${2 ** (j + 1)} cot ${grados(2 ** (j + 1) * x)}`;
    sol.push([paso + '.']);
    sol.push([`E = ${N} cot ${grados(N * x)} = ${N}·(${ex(cotR(N * x))}) = `, v('R', ex(correcta)), '.']);
    return {
      variables,
      enunciado: ['Sea E = ', ...terminos, '.'],
      pregunta: ['¿Cuánto vale E?'],
      correcta,
      errores: [
        pa('TR16', cotR(N * x), `Usaste cot θ − tan θ = cot 2θ, sin el factor 2. Cada paso duplica el coeficiente: al final queda ${N}·cot ${grados(N * x)}.`),
        h('TRI-tan-por-cot', N * tanR(N * x), 'La identidad da la cotangente del doble, no la tangente.'),
        pa('TR12', -correcta, `Te equivocaste de signo: cot ${grados(N * x)} es ${correcta > 0 ? 'positiva' : 'negativa'} (${grados(N * x)} está en el ${N * x < 90 ? 'I' : 'II'} cuadrante).`),
        h('TRI-confunde-con-csc', N * csc(N * x), 'Usaste cot θ + tan θ = 2 csc 2θ. Aquí la tangente se resta: va cot θ − tan θ = 2 cot 2θ.'),
        h('TRI-cuenta-mal-los-pasos', 2 * N * cotR(2 * N * x), 'Aplicaste la identidad una vez de más: hay tantos pasos como términos con tangente.'),
      ],
      solucion: sol,
      datos: { tipo: 'cadena', n, x },
    };
  }

  function reduccionDoble(rng) {
    const beta = rng.elegir([15, 22.5, 30, 37, 53, 60, 67.5, 75]);
    const theta = 90 * rng.entero(1, 3) + beta, op = rng.elegir(['suma', 'resta']);
    const correcta = calc.reduccionDoble({ theta, op });
    const variables = { th: { nombre: 'ángulo', color: 'o' }, R: { nombre: 'valor de E', color: 'd' } };
    const tg = grados(theta), d = grados(2 * theta);
    const texto = op === 'suma' ? ['E = tan ', v('th', tg), ' + cot ', v('th', tg)] : ['E = cot ', v('th', tg), ' − tan ', v('th', tg)];
    const t = tanRed(theta);
    return {
      variables,
      enunciado: [...texto, '.'],
      pregunta: ['¿Cuánto vale E?'],
      correcta,
      errores: [
        pa('TR12', -correcta, `El signo no cuadra con el cuadrante: tan ${tg} es ${t > 0 ? 'positiva' : 'negativa'} (${tg} está en el ${['I', 'II', 'III', 'IV'][Math.floor(theta / 90)]} cuadrante).`),
        pa('TR16', correcta / 2, `Usaste ${op === 'suma' ? 'tan θ + cot θ = csc 2θ' : 'cot θ − tan θ = cot 2θ'}, sin el factor 2.`),
        h('TRI-confunde-identidad', op === 'suma' ? 1 / t - t : t + 1 / t, op === 'suma' ? 'Usaste cot θ − tan θ = 2 cot 2θ. Con la suma, la identidad es tan θ + cot θ = 2 csc 2θ.' : 'Usaste tan θ + cot θ = 2 csc 2θ. Con la resta, la identidad es cot θ − tan θ = 2 cot 2θ.'),
        h('TRI-doble-factor', 2 * correcta, 'Pusiste el factor 2 dos veces.'),
      ],
      solucion: [
        [op === 'suma' ? 'Identidad auxiliar: tan θ + cot θ = 2 csc 2θ.' : 'Identidad auxiliar: cot θ − tan θ = 2 cot 2θ.'],
        [`Con θ = ${tg}: 2θ = ${d}. ${op === 'suma' ? 'csc' : 'cot'} ${d} = ${ex(op === 'suma' ? correcta / 2 : correcta / 2)} (reduce al primer cuadrante y fíjate en el signo).`],
        [`Control: tan ${tg} = ${ex(t)} y cot ${tg} = ${ex(1 / t)}.`],
        [`E = 2·(${ex(correcta / 2)}) = `, v('R', ex(correcta)), '.'],
      ],
      datos: { tipo: 'reduccion-doble', theta, op },
    };
  }

  const TIPOS = { condicional, maximo, terreno, 'suma-k': sumaK, 'triangulo-doble': trianguloDoble, 'triple-producto': tripleProducto, acotar, cofuncion, cadena, 'reduccion-doble': reduccionDoble };
  const NOMBRES = Object.keys(TIPOS);

  function generar(semilla) {
    const rng = Azar.crear(ID + '|' + semilla);
    for (let i = 0; i < 200; i++) {
      const pr = TIPOS[rng.elegir(NOMBRES)](rng);
      const alternativas = armarEx(rng, pr.correcta, pr.errores, pr.opciones);
      if (!alternativas || alternativas.length < 4) continue;
      return {
        id: `${ID}#${semilla}`, variables: pr.variables, enunciado: pr.enunciado, pregunta: pr.pregunta, datos: '',
        alternativas, solucion: pr.solucion, respuesta: { valor: pr.correcta, unidad: (pr.opciones && pr.opciones.unidad) || '' },
        _datos: pr.datos,
      };
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  return { id: ID, titulo: 'Ángulo doble, triple y condiciones entre ángulos', generar, calc, tipos: NOMBRES, ex };
});
