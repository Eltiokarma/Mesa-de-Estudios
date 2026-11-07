/*
 * Motor de «El radar»: coordenadas polares. Ubicar el punto (r; θ) (también con r negativo), sus otras escrituras y
 * el polo; pasar de polares a cartesianas y de cartesianas a polares con el cuadrante correcto; las curvas r = a,
 * θ = k, r = a cos θ, r = a sen θ y las rosas r = a cos(nθ), r = a sen(nθ); y la forma polar de un complejo
 * (r cis θ y r·e^(iθ)), que es el mismo par (r; θ) del punto (x; y).
 *
 * Aquí vive toda la matemática de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el
 * navegador (window.MotorPolares) y en Node (require('./motor.js')). Las cuentas son exactas cuando se puede:
 * fracciones y radicales de un solo término (k√m, con m sin factores cuadrados) y ángulos notables (múltiplos de 30°
 * o de 45°). Con otros ángulos, los textos van con a lo más dos decimales y coma.
 *
 * CONVENCIONES
 *   - Un punto en polares es { r, theta }: r es la distancia con signo (número, texto de fracción '5/2' o de radical
 *     '2√3'; puede ser negativo o 0) y theta el ángulo en grados sexagesimales (número, cualquier valor).
 *   - Un punto en cartesianas es { x, y } (números, fracciones o radicales, como r).
 *   - θ se mide desde el eje polar (la semirrecta horizontal hacia la derecha) en sentido antihorario.
 *   - RANGO PRINCIPAL: θ en [0°; 360°⟩ con r ≥ 0. Toda respuesta «normalizada» usa ese rango. (Los números
 *     complejos de plantillas/numeros-complejos usan ⟨−180°; 180°]; formaPolar da los dos.)
 *   - r negativo: (−r; θ) es el mismo punto que (r; θ + 180°): se camina |r| en sentido contrario, pasando por el polo.
 *   - Un mismo punto tiene infinitas escrituras: (r; θ + 360°k) y (−r; θ + 180° + 360°k), con k entero.
 *   - El polo es r = 0 con cualquier θ.
 *   - En θ = k, r recorre TODOS los reales (positivos, 0 y negativos): la gráfica es la recta completa que pasa por el
 *     polo. (Si se pidiera r ≥ 0 sería una semirrecta; la escena no usa esa convención.)
 *   - Los textos usan el signo menos tipográfico (−), la coma decimal y punto y coma entre coordenadas: '(2; 210°)',
 *     '(−2√3; 2)', '(5/2; 45°)'. Los racionales no enteros van como fracción ('5/2', aunque se den como 2.5); los
 *     valores que no son exactos (ángulos no notables) y los grados no enteros, con a lo más dos decimales y coma.
 *   - Cada función que responde una predicción devuelve { …, texto, num, errores, coinciden, noAplica }. num es un
 *     objeto de números para comparar (un punto { x, y }, o lo que diga la función). 'errores' es un objeto cuyas claves
 *     son errores típicos; cada uno trae { texto, num, id, regla }. Un error que con esos datos da lo mismo que la
 *     respuesta correcta (igual num o igual texto) NO va en 'errores': su clave va en 'coinciden'. Uno que no se puede
 *     calcular con esos datos va en 'noAplica'.
 *
 * IDS DE ERROR
 *   CP1…CP27 son hipótesis nuestras (no hay informe de polares). TR11 (cruza seno y coseno) y TR12 (el seno como
 *   distancia sin signo) son de docs/investigacion/trigonometria-ideas-erroneas.md, con respaldo parcial; AL9
 *   (√(a² + b²) = a + b) es de docs/investigacion/algebra-funciones-ideas-erroneas.md, parcial.
 *   CP1 cociente: el cuadrante es ⌊θ/90°⌋ (sin sumar 1).       CP2 referencia: reduce al primer cuadrante.
 *   CP3 ignoraSigno: con r < 0 se ubica (|r|; θ).              CP4 reflejaX: con r < 0, (|r|; −θ).
 *   CP5 reflejaY: con r < 0, (|r|; 180° − θ).                  CP6 suma90: con r < 0 se suman 90° en vez de 180°.
 *   CP7 mismoAngulo: al cambiar el signo de r se deja θ.       CP8 anguloOpuesto: al cambiar el signo de r, θ → −θ.
 *   CP9 desdeVertical: mide θ desde el eje vertical.           CP10 arctanDirecto: θ = arctan(y/x) de la calculadora.
 *   CP11 arctanInvertido: θ = arctan(x/y).                     CP12 referencia: el ángulo agudo con el eje x.
 *   CP13 sinRaiz: r = x² + y².                                 CP14 sinR: x = cos θ, y = sen θ (olvida r).
 *   CP15 centroPolo: r = a cos θ es la circunferencia de centro en el polo y radio |a|.
 *   CP16 centroEnA: centro (a; 0) (o (0; a)) y radio |a|.       CP17 ejeCruzado: cos ↔ sen (el centro en el otro eje).
 *   CP18 ignoraSignoA: con a < 0, el centro como si a fuera positivo.
 *   CP19 sinX: la cartesiana de r = a cos θ es x² + y² = a.      CP20 cuadradoMal: √(x² + y²) = ax ⟹ x² + y² = a²x².
 *   CP21 siempreN: la rosa tiene n pétalos.                     CP22 siempre2n: la rosa tiene 2n pétalos.
 *   CP23 largoMitad: el pétalo mide |a|/2.                      CP24 cruzaAyN: lee a como el número y n como el largo.
 *   CP25 semirrecta: θ = k es una semirrecta.                   CP26 circunferencia: θ = k es una circunferencia.
 *   CP27 horizontal: θ = k es una recta horizontal (como y = k).
 *   TR11 cruza: x = r sen θ, y = r cos θ.                       TR12 sinSigno: x e y sin signo (como en el I cuadrante).
 *   AL9 sumaPartes: r = |x| + |y|.
 *
 * FUNCIONES EXPORTADAS (o = objeto de argumentos)
 *   punto({ r, theta })            → { x, y } numéricos (para dibujar).
 *   dePunto({ x, y })              → { r ≥ 0, theta en [0°; 360°⟩ } numéricos (para arrastrar; el polo da theta 0).
 *   normal(theta)                  → theta reducido a [0°; 360°⟩ (número).
 *   cuadrante({ r, theta })        → dónde queda el punto. { cuadrante: 1 a 4, 0 si está sobre un eje, −1 si es el
 *                                    polo; direccion: ángulo real del punto en [0°; 360°⟩ (con r < 0 suma 180°); texto:
 *                                    'III cuadrante', 'sobre un eje', 'el polo'; lugar: igual, pero sobre un eje
 *                                    dice cuál ('sobre el eje polar', 'sobre el eje y, abajo'…); num { k: cuadrante }; errores:
 *                                    cociente (CP1; noAplica si ⌊θ/90°⌋ = 0), referencia (CP2: siempre I),
 *                                    desdeVertical (CP9: el cuadrante de θ + 90°) }. Los errores se calculan con la
 *                                    dirección real (θ + 180° si r < 0); fuera de un cuadrante, noAplica.
 *   positivo({ r, theta })         → la escritura principal: r ≥ 0 y θ en [0°; 360°⟩. { r: texto, theta, texto:
 *                                    '(2; 210°)' o 'el polo', polo: booleano, num { x, y }, errores (solo si r < 0):
 *                                    reflejaX (CP4), reflejaY (CP5), ignoraSigno (CP3), suma90 (CP6) }.
 *   conRNegativo({ r, theta })     → con r > 0, la escritura con −r y θ en [0°; 360°⟩: (−r; θ + 180°). { r, theta, texto
 *                                    '(−3; 240°)', num, errores: mismoAngulo (CP7), suma90 (CP6), anguloOpuesto (CP8) }.
 *   equivalentes({ r, theta, desde, hasta }) → todas las escrituras del punto con θ en [desde; hasta⟩ (grados; por
 *                                    defecto [−360°; 360°⟩): { lista: [{ r: número, theta, texto }] ordenada por theta,
 *                                    con r de los dos signos }. El polo lanza «el polo tiene infinitas escrituras».
 *   mismoPunto({ p, q })           → { valor: booleano } (p, q en polares; compara las coordenadas cartesianas).
 *   aCartesianas({ r, theta })     → x = r cos θ, y = r sen θ. { x, y (números), xTexto, yTexto, texto '(−2√3; 2)',
 *                                    exacto (θ notable), cuadrante, num { x, y }, errores: cruza (TR11), sinSigno
 *                                    (TR12: |x| y |y|), sinR (CP14), ignoraSignoR (CP3, solo si r < 0) }.
 *   aPolares({ x, y })             → r = √(x² + y²) y θ en [0°; 360°⟩ según el cuadrante. { r: texto, rNum, theta,
 *                                    texto '(2; 120°)' o 'el polo', polo, cuadrante, num { x, y }, errores (cada uno un
 *                                    par polar con su num cartesiano): arctanDirecto (CP10: arctan(y/x) reducido a
 *                                    [0°; 360°⟩; noAplica si x = 0), arctanInvertido (CP11; noAplica si y = 0),
 *                                    referencia (CP12), sinRaiz (CP13), sumaPartes (AL9) }. x, y racionales o radicales.
 *   rectaTheta({ k })              → la gráfica de θ = k (r recorre todos los reales). { texto: 'una recta que pasa
 *                                    por el polo', cartesiana: 'y = √3x', 'x = 0' o 'y = 0', num: null, errores
 *                                    (frases): semirrecta (CP25), circunferencia (CP26), horizontal (CP27) }.
 *                                    k debe ser notable (múltiplo de 30° o de 45°).
 *   circuloPolo({ a })             → r = a (a ≠ 0): { radio: texto de |a|, cartesiana: 'x² + y² = 9', texto }.
 *   circuloEje({ a, f })           → r = a cos θ (f = 'cos') o r = a sen θ (f = 'sen'), a ≠ 0: circunferencia que pasa
 *                                    por el polo, de diámetro |a|. { centro: { x, y } (números), radio (número),
 *                                    texto: 'centro (2; 0) y radio 2', canonica: '(x − 2)² + y² = 4', num { x, y, r },
 *                                    errores: centroPolo (CP15), centroEnA (CP16), ejeCruzado (CP17), ignoraSignoA
 *                                    (CP18; coincide si a > 0) }.
 *   cartesianaEje({ a, f })        → la ecuación cartesiana de r = a cos θ o a sen θ (se multiplica por r: r² = ar cos θ).
 *                                    { texto: 'x² + y² = 4x', pasos: [textos], num: null, errores: sinX (CP19),
 *                                    cuadradoMal (CP20), ejeCruzado (CP17), centroEnA (CP16: x² + y² = 2ax) }.
 *   petalos({ a, n, f })           → la rosa r = a cos(nθ) (f = 'cos') o a sen(nθ) (f = 'sen'), n entero ≥ 2, a ≠ 0.
 *                                    { petalos: n si n es impar y 2n si es par, largo: texto de |a|, vuelta: 180 si n
 *                                    es impar y 360 si es par (grados que bastan para dibujarla una vez), texto: '3
 *                                    pétalos de largo 2', num { p, L }, errores: siempreN (CP21), siempre2n (CP22),
 *                                    largoMitad (CP23), cruzaAyN (CP24: |a| pétalos según la regla y largo n;
 *                                    noAplica si |a| no es entero ≥ 2) }.
 *   radio({ tipo, a, n, k, theta }) → r numérico de la curva en el ángulo theta. tipo: 'circulo' (r = a), 'cos', 'sen',
 *                                    'rosaCos', 'rosaSen'.
 *   muestrear({ tipo, a, n, k, pasos }) → [{ x, y }, …] para dibujar la curva una vez (tipo 'recta': θ = k con r de −a a
 *                                    a). pasos por defecto 360.
 *   formaPolar({ re, im })         → el complejo z = re + im·i como par polar. { r: texto, theta en [0°; 360°⟩,
 *                                    principal: theta en ⟨−180°; 180°] (como en numeros-complejos), par: '(2; 120°)',
 *                                    polar: '2 cis 120°', radianes: '2π/3' (null si θ no es múltiplo de 15°),
 *                                    exponencial: '2e^(i·2π/3)' (si θ no es múltiplo de 15°, con los radianes en
 *                                    decimales: '√5e^(i·2,03)'), binomica: 'x + yi' sin partes 0 ('3i', '−2',
 *                                    '−1 − √3 i'), num { x, y } }. z ≠ 0.
 *   texto(v)                       → texto exacto de un número (5/2, −2√3, 3).
 *   radianes(theta)                → texto de theta en radianes como múltiplo de π ('5π/4', 'π', '0'), o null.
 *   decimal(x, d)                  → número con coma decimal y a lo más d decimales (por defecto 2).
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorPolares = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const MENOS = '−';
  const GR = Math.PI / 180;
  const TOL = 1e-9;

  // ---------- Números exactos k·√m (k fracción, m entero sin cuadrados) ----------
  function mcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; }
  function R(n, d, m) {
    if (d === undefined) d = 1;
    if (m === undefined) m = 1;
    if (![n, d, m].every(Number.isSafeInteger)) throw new Error('números demasiado grandes para el motor');
    if (d === 0) throw new Error('división entre cero');
    if (m < 0) throw new Error('el radicando debe ser positivo');
    if (n === 0 || m === 0) return { n: 0, d: 1, m: 1 };
    for (let f = 2; f * f <= m; f++) while (m % (f * f) === 0) { m /= f * f; n *= f; }
    if (d < 0) { n = -n; d = -d; }
    const g = mcd(n, d) || 1;
    return { n: n / g + 0, d: d / g, m };
  }
  const CERO = R(0), UNO = R(1);
  const val = x => (x.n / x.d) * Math.sqrt(x.m);
  const esCero = x => x.n === 0;
  const racional = x => x.m === 1;
  const neg = x => R(-x.n, x.d, x.m);
  const abs = x => R(Math.abs(x.n), x.d, x.m);
  const mul = (x, y) => R(x.n * y.n, x.d * y.d, x.m * y.m);
  function inv(y) { if (esCero(y)) throw new Error('división entre cero'); return R(y.d, y.n * y.m, y.m); }
  const div = (x, y) => mul(x, inv(y));
  function sum(x, y) {
    if (esCero(x)) return y;
    if (esCero(y)) return x;
    if (x.m !== y.m) throw new Error('no se pueden sumar radicales distintos en forma exacta');
    return R(x.n * y.d + y.n * x.d, x.d * y.d, x.m);
  }
  function raiz(x) {
    if (!racional(x)) throw new Error('raíz de un radical: fuera del alcance del motor');
    if (x.n < 0) throw new Error('raíz de un negativo');
    return R(1, x.d, x.n * x.d);
  }
  function aR(x, que) {
    que = que || 'el valor';
    if (x && typeof x === 'object' && 'n' in x && 'd' in x) return R(x.n, x.d, x.m || 1);
    if (typeof x === 'string') {
      const s = x.replace(/−/g, '-').replace(/\s+/g, '').replace(',', '.');
      let m = s.match(/^(-?\d+)(?:\/(\d+))?$/);
      if (m) return R(Number(m[1]), m[2] ? Number(m[2]) : 1);
      m = s.match(/^(-?)(\d*)√(\d+)(?:\/(\d+))?$/);
      if (m) return R((m[1] ? -1 : 1) * (m[2] ? Number(m[2]) : 1), m[4] ? Number(m[4]) : 1, Number(m[3]));
      if (/^-?\d+\.\d+$/.test(s)) return aR(Number(s), que);
      throw new Error(`${que} debe ser un número, una fracción como 1/2 o un radical como √3`);
    }
    if (typeof x !== 'number' || !Number.isFinite(x)) throw new Error(`${que} debe ser un número`);
    for (let q = 1; q <= 1e6; q *= 10) { const p = Math.round(x * q); if (Math.abs(p / q - x) <= 1e-12 * Math.max(1, Math.abs(x))) return R(p, q); }
    throw new Error(`${que} debe ser exacto (entero, decimal corto, fracción o radical)`);
  }

  function decimal(x, d) {
    if (d === undefined) d = 2;
    const f = Math.pow(10, d);
    let v = Math.round(x * f) / f;
    if (Object.is(v, -0) || Math.abs(v) < 0.5 / f) v = 0;
    let t = String(Math.abs(v));
    if (/e/.test(t)) t = Math.abs(v).toFixed(d).replace(/0+$/, '').replace(/\.$/, '');
    return (v < 0 ? MENOS : '') + t.replace('.', ',');
  }
  // texto de un número exacto sin signo
  function txAbs(x) {
    const n = Math.abs(x.n), d = x.d;
    if (x.m === 1) return d === 1 ? String(n) : `${n}/${d}`;
    const c = n === 1 ? '' : String(n);
    return d === 1 ? `${c}√${x.m}` : `${c}√${x.m}/${d}`;
  }
  const tx = x => (x.n < 0 ? MENOS : '') + txAbs(x);
  // un valor es un R exacto o un número (cuando el ángulo no es notable)
  const esR = v => v && typeof v === 'object' && 'n' in v;
  const vNum = v => (esR(v) ? val(v) : v) + 0;
  const vTx = v => (esR(v) ? tx(v) : decimal(v, 2));
  const vAbs = v => (esR(v) ? abs(v) : Math.abs(v));

  // ---------- Ángulos ----------
  function ang(g, que) {
    if (typeof g !== 'number' || !Number.isFinite(g)) throw new Error(`${que || 'theta'} debe ser un número (grados)`);
    return g;
  }
  function limpio(g) { return Math.abs(g - Math.round(g)) < 1e-9 ? Math.round(g) : g; }
  function normal(g) { let p = ((limpio(g) % 360) + 360) % 360; p = limpio(p); if (p >= 360) p -= 360; return p + 0; }
  const txG = g => `${decimal(limpio(g), 2)}°`;
  // valor exacto de cos y sen en ángulos notables (múltiplos de 30° o de 45°)
  function notable(g) {
    if (Math.abs(g - Math.round(g)) > 1e-9) return null;
    const k = ((Math.round(g) % 360) + 360) % 360;
    if (k % 30 && k % 45) return null;
    const TAB = { 0: [UNO, CERO], 30: [R(1, 2, 3), R(1, 2)], 45: [R(1, 2, 2), R(1, 2, 2)], 60: [R(1, 2), R(1, 2, 3)] };
    const q = Math.floor(k / 90), resto = k % 90;
    let [c, s] = TAB[resto];
    for (let j = 0; j < q; j++) [c, s] = [neg(s), c];   // girar 90°: (c, s) → (−s, c)
    return [c, s];
  }
  function atanG(y, x) { return limpio(Math.atan2(y, x) / GR); }
  function radianes(g) {
    if (typeof g !== 'number' || !Number.isFinite(g)) return null;
    const k = Math.round(g);
    if (Math.abs(g - k) > 1e-9 || k % 15) return null;
    const m = mcd(k, 180) || 1, p = k / m, q = 180 / m;
    if (p === 0) return '0';
    const s = p < 0 ? MENOS : '', P = Math.abs(p) === 1 ? '' : String(Math.abs(p));
    return q === 1 ? `${s}${P}π` : `${s}${P}π/${q}`;
  }

  // ---------- Pares ----------
  const par = (a, b) => `(${a}; ${b})`;
  const parPolar = (rt, g) => par(rt, txG(g));
  // coordenadas cartesianas de (r; θ): exactas si θ es notable
  function cart(r, g) {
    const N = notable(g);
    if (N) return { X: mul(r, N[0]), Y: mul(r, N[1]), exacto: true };
    return { X: val(r) * Math.cos(g * GR), Y: val(r) * Math.sin(g * GR), exacto: false };
  }
  const numXY = c => ({ x: vNum(c.X), y: vNum(c.Y) });
  const txXY = c => par(vTx(c.X), vTx(c.Y));
  function cuadDe(x, y) {
    const e = v => Math.abs(v) < 1e-9;
    if (e(x) && e(y)) return -1;
    if (e(x) || e(y)) return 0;
    return x > 0 ? (y > 0 ? 1 : 4) : (y > 0 ? 2 : 3);
  }
  // punto de un par polar exacto (r R, g grados)
  function salidaPolar(r, g) {
    const c = cart(r, g);
    return { texto: parPolar(tx(r), g), num: numXY(c) };
  }

  function mismoNum(p, q) {
    if (!p || !q) return false;
    for (const k of Object.keys(q)) { if (!(k in p) || Math.abs(p[k] - q[k]) > 1e-7 * Math.max(1, Math.abs(q[k]))) return false; }
    return true;
  }
  // Arma { errores, coinciden, noAplica }: cada candidato es [clave, id, regla, () => { texto, num } o null]
  function errores(correcta, lista) {
    const out = { errores: {}, coinciden: [], noAplica: [] };
    for (const [k, id, regla, f] of lista) {
      let e;
      try { e = f(); } catch (err) { if (/división entre cero|no aplica|radicales distintos/.test(err.message)) { out.noAplica.push(k); continue; } throw err; }
      if (e === null) { out.noAplica.push(k); continue; }
      if (e.texto === correcta.texto || (e.num && correcta.num && mismoNum(e.num, correcta.num))) { out.coinciden.push(k); continue; }
      out.errores[k] = Object.assign({ id, regla }, e);
    }
    return out;
  }
  function polarDe(o, que) {
    if (!o || typeof o !== 'object' || !('r' in o) || !('theta' in o)) throw new Error(`${que || 'el punto'} debe ser { r, theta }`);
    return { r: aR(o.r, 'r'), g: ang(o.theta) };
  }

  // ---------- Ubicar ----------
  function punto(o) { const r = Number(typeof o.r === 'number' ? o.r : val(aR(o.r, 'r'))), g = ang(o.theta) * GR; return { x: r * Math.cos(g) + 0, y: r * Math.sin(g) + 0 }; }
  function dePunto(o) {
    const x = Number(o.x), y = Number(o.y), r = Math.hypot(x, y);
    return { r, theta: r < 1e-12 ? 0 : normal(Math.atan2(y, x) / GR) };
  }
  const NOMBRE_C = ['', 'I cuadrante', 'II cuadrante', 'III cuadrante', 'IV cuadrante'];
  const txC = k => (k === -1 ? 'el polo' : k === 0 ? 'sobre un eje' : NOMBRE_C[k]);
  function cuadranteDir(d) { d = normal(d); return d % 90 === 0 ? 0 : Math.floor(d / 90) + 1; }
  function cuadrante(o) {
    const { r, g } = polarDe(o);
    if (esCero(r)) return { cuadrante: -1, direccion: null, texto: txC(-1), lugar: txC(-1), num: { k: -1 }, errores: {}, coinciden: [], noAplica: ['cociente', 'referencia', 'desdeVertical'] };
    const d = normal(r.n < 0 ? g + 180 : g), k = cuadranteDir(d);
    const LUGAR = { 0: 'sobre el eje polar', 90: 'sobre el eje y, arriba', 180: 'sobre el eje x, a la izquierda', 270: 'sobre el eje y, abajo' };
    const base = { cuadrante: k, direccion: d, texto: txC(k), lugar: k === 0 ? LUGAR[d] : txC(k), num: { k } };
    const sal = j => ({ texto: txC(j), num: { k: j } });
    return Object.assign(base, errores(base, [
      ['cociente', 'CP1', 'el cuadrante es el cociente entero de θ entre 90°, sin sumar 1 (p. ej., 210°/90° → II)', () => { if (k === 0) return null; const j = Math.floor(d / 90); return j === 0 ? null : sal(j); }],
      ['referencia', 'CP2', 'se reduce el ángulo al primer cuadrante y se ubica ahí', () => (k === 0 ? null : sal(1))],
      ['desdeVertical', 'CP9', 'el ángulo se mide desde el eje vertical, no desde el eje polar', () => (k === 0 ? null : sal(cuadranteDir(d + 90)))],
    ]));
  }
  function positivo(o) {
    const { r, g } = polarDe(o);
    if (esCero(r)) return { r: '0', theta: null, polo: true, texto: 'el polo', num: { x: 0, y: 0 }, errores: {}, coinciden: [], noAplica: [] };
    const R0 = abs(r), t = r.n < 0 ? normal(g + 180) : normal(g);
    const base = Object.assign({ r: tx(R0), theta: t, polo: false }, salidaPolar(R0, t));
    if (r.n > 0) return Object.assign(base, { errores: {}, coinciden: [], noAplica: [] });
    return Object.assign(base, errores(base, [
      ['reflejaX', 'CP4', 'con r negativo se refleja el punto en el eje x: (|r|; −θ)', () => salidaPolar(R0, normal(-g))],
      ['reflejaY', 'CP5', 'con r negativo se refleja el punto en el eje y: (|r|; 180° − θ)', () => salidaPolar(R0, normal(180 - g))],
      ['ignoraSigno', 'CP3', 'se ignora el signo de r: (|r|; θ)', () => salidaPolar(R0, normal(g))],
      ['suma90', 'CP6', 'con r negativo se suman 90° en vez de 180°', () => salidaPolar(R0, normal(g + 90))],
    ]));
  }
  function conRNegativo(o) {
    const { r, g } = polarDe(o);
    if (r.n <= 0) throw new Error('r debe ser positivo');
    const N = neg(r), t = normal(g + 180);
    const base = Object.assign({ r: tx(N), theta: t }, salidaPolar(N, t));
    return Object.assign(base, errores(base, [
      ['mismoAngulo', 'CP7', 'al cambiar el signo de r se deja el mismo ángulo: (−r; θ)', () => salidaPolar(N, normal(g))],
      ['suma90', 'CP6', 'al cambiar el signo de r se suman 90° en vez de 180°', () => salidaPolar(N, normal(g + 90))],
      ['anguloOpuesto', 'CP8', 'al cambiar el signo de r también se cambia el signo del ángulo: (−r; −θ)', () => salidaPolar(N, normal(-g))],
    ]));
  }
  function equivalentes(o) {
    const { r, g } = polarDe(o);
    if (esCero(r)) throw new Error('el polo tiene infinitas escrituras: (0; θ) con cualquier θ');
    const desde = o.desde === undefined ? -360 : ang(o.desde, 'desde'), hasta = o.hasta === undefined ? 360 : ang(o.hasta, 'hasta');
    if (!(hasta > desde)) throw new Error('hasta debe ser mayor que desde');
    const lista = [];
    for (const [rr, base] of [[r, g], [neg(r), g + 180]]) {
      let t = limpio(base);
      while (t >= desde - 1e-9) t = limpio(t - 360);
      while (t < desde - 1e-9) t = limpio(t + 360);
      for (; t < hasta - 1e-9; t = limpio(t + 360)) lista.push({ r: val(rr) + 0, theta: t + 0, texto: parPolar(tx(rr), t) });
    }
    lista.sort((p, q) => p.theta - q.theta);
    return { lista };
  }
  function mismoPunto(o) {
    const a = punto(o.p), b = punto(o.q);
    return { valor: Math.abs(a.x - b.x) < 1e-9 && Math.abs(a.y - b.y) < 1e-9 };
  }

  // ---------- Polares ↔ cartesianas ----------
  function aCartesianas(o) {
    const { r, g } = polarDe(o), c = cart(r, g), n = numXY(c);
    const base = { x: n.x, y: n.y, xTexto: vTx(c.X), yTexto: vTx(c.Y), texto: txXY(c), exacto: c.exacto, cuadrante: cuadDe(n.x, n.y), num: n };
    const sal = (X, Y) => ({ texto: par(vTx(X), vTx(Y)), num: { x: vNum(X), y: vNum(Y) } });
    return Object.assign(base, errores(base, [
      ['cruza', 'TR11', 'se cruzan coseno y seno: x = r sen θ, y = r cos θ', () => sal(c.Y, c.X)],
      ['sinSigno', 'TR12', 'coseno y seno sin signo, como en el primer cuadrante: x = |r cos θ|, y = |r sen θ|', () => sal(vAbs(c.X), vAbs(c.Y))],
      ['sinR', 'CP14', 'se olvida multiplicar por r: x = cos θ, y = sen θ', () => { const u = cart(UNO, g); return sal(u.X, u.Y); }],
      ['ignoraSignoR', 'CP3', 'se ignora el signo de r', () => { if (r.n >= 0) return null; const u = cart(abs(r), g); return sal(u.X, u.Y); }],
    ]));
  }
  function aPolares(o) {
    if (!o || typeof o !== 'object' || !('x' in o) || !('y' in o)) throw new Error('el punto debe ser { x, y }');
    const X = aR(o.x, 'x'), Y = aR(o.y, 'y'), x = val(X), y = val(Y);
    if (esCero(X) && esCero(Y)) return { r: '0', rNum: 0, theta: null, polo: true, texto: 'el polo', cuadrante: -1, num: { x: 0, y: 0 }, errores: {}, coinciden: [], noAplica: [] };
    const s = sum(mul(X, X), mul(Y, Y)), r = raiz(s), t = normal(atanG(y, x));
    const base = { r: tx(r), rNum: val(r), theta: t, polo: false, texto: parPolar(tx(r), t), cuadrante: cuadDe(x, y), num: { x, y } };
    // rr: un R exacto o { texto, v } (una suma de radicales distintos)
    const sal = (rr, g) => { const v = esR(rr) ? val(rr) : rr.v; return { texto: parPolar(esR(rr) ? tx(rr) : rr.texto, g), num: { x: v * Math.cos(g * GR), y: v * Math.sin(g * GR) } }; };
    return Object.assign(base, errores(base, [
      ['arctanDirecto', 'CP10', 'θ = arctan(y/x), lo que da la calculadora (entre −90° y 90°), sin mirar el cuadrante', () => (esCero(X) ? null : sal(r, normal(limpio(Math.atan(y / x) / GR))))],
      ['arctanInvertido', 'CP11', 'θ = arctan(x/y): se invierte el cociente', () => (esCero(Y) ? null : sal(r, normal(limpio(Math.atan(x / y) / GR))))],
      ['referencia', 'CP12', 'se toma el ángulo agudo con el eje x, sin cuadrante', () => sal(r, atanG(Math.abs(y), Math.abs(x)))],
      ['sinRaiz', 'CP13', 'r = x² + y²: se olvida sacar la raíz', () => sal(s, t)],
      ['sumaPartes', 'AL9', 'r = |x| + |y| (como si √(x² + y²) fuera x + y)', () => {
        const A = abs(X), B = abs(Y);
        if (A.m === B.m) return sal(sum(A, B), t);
        return sal({ texto: `${txAbs(A)} + ${txAbs(B)}`, v: val(A) + val(B) }, t); }],
    ]));
  }

  // ---------- Curvas ----------
  function aNoCero(a) { const A = aR(a, 'a'); if (esCero(A)) throw new Error('a debe ser distinto de 0'); return A; }
  function fDe(f) { if (f !== 'cos' && f !== 'sen') throw new Error("f debe ser 'cos' o 'sen'"); return f; }
  function rectaTheta(o) {
    const k = ang(o && o.k, 'k'), N = notable(k);
    if (!N) throw new Error('k debe ser un ángulo notable (múltiplo de 30° o de 45°)');
    const [c, s] = N;
    let cartesiana;
    if (esCero(c)) cartesiana = 'x = 0';
    else if (esCero(s)) cartesiana = 'y = 0';
    else { const m = div(s, c), t = txAbs(m), sg = m.n < 0 ? MENOS : ''; cartesiana = `y = ${sg}${t === '1' ? '' : t.includes('/') ? '(' + t + ')' : t}x`; }
    const base = { texto: 'una recta que pasa por el polo', cartesiana, k: normal(k), num: null };
    const f = t => () => ({ texto: t, num: null });
    return Object.assign(base, errores(base, [
      ['semirrecta', 'CP25', 'θ = k es una semirrecta que empieza en el polo (olvida que r también puede ser negativo)', f('una semirrecta que empieza en el polo')],
      ['circunferencia', 'CP26', 'θ = k es una circunferencia con centro en el polo (como r = k)', f('una circunferencia con centro en el polo')],
      ['horizontal', 'CP27', 'θ = k es una recta horizontal (como y = k)', f('una recta horizontal que no pasa por el polo')],
    ]));
  }
  function circuloPolo(o) {
    const A = aNoCero(o && o.a), rad = abs(A), r2 = mul(A, A);
    return { radio: tx(rad), radioNum: val(rad), cartesiana: `x² + y² = ${tx(r2)}`, texto: `circunferencia con centro en el polo y radio ${tx(rad)}` };
  }
  const txCentro = (cx, cy) => par(tx(cx), tx(cy));
  function salCirc(cx, cy, rad) { return { texto: `centro ${txCentro(cx, cy)} y radio ${tx(rad)}`, num: { x: val(cx) + 0, y: val(cy) + 0, r: val(rad) } }; }
  function circuloEje(o) {
    const A = aNoCero(o && o.a), f = fDe(o.f), h = div(A, R(2)), rad = abs(h);
    const [cx, cy] = f === 'cos' ? [h, CERO] : [CERO, h];
    const base = Object.assign({ centro: { x: val(cx) + 0, y: val(cy) + 0 }, radio: val(rad), canonica: canon(cx, cy, mul(rad, rad)) }, salCirc(cx, cy, rad));
    return Object.assign(base, errores(base, [
      ['centroPolo', 'CP15', 'r = a cos θ es la circunferencia con centro en el polo y radio |a|', () => salCirc(CERO, CERO, abs(A))],
      ['centroEnA', 'CP16', 'el centro está en a sobre el eje (no en a/2) y el radio es |a|', () => (f === 'cos' ? salCirc(A, CERO, abs(A)) : salCirc(CERO, A, abs(A)))],
      ['ejeCruzado', 'CP17', 'se cruzan coseno y seno: el centro queda en el otro eje', () => (f === 'cos' ? salCirc(CERO, h, rad) : salCirc(h, CERO, rad))],
      ['ignoraSignoA', 'CP18', 'con a negativo, el centro se ubica como si a fuera positivo', () => (f === 'cos' ? salCirc(abs(h), CERO, rad) : salCirc(CERO, abs(h), rad))],
    ]));
  }
  function canon(cx, cy, r2) {
    const t = (v, c) => (esCero(c) ? `${v}²` : `(${v} ${c.n > 0 ? MENOS : '+'} ${txAbs(c)})²`);
    return `${t('x', cx)} + ${t('y', cy)} = ${tx(r2)}`;
  }
  function coefVar(c, v) { const t = tx(c); return t === '1' ? v : t === MENOS + '1' ? MENOS + v : t + v; }
  function cartesianaEje(o) {
    const A = aNoCero(o && o.a), f = fDe(o.f), v = f === 'cos' ? 'x' : 'y', w = f === 'cos' ? 'y' : 'x';
    const fn = f === 'cos' ? 'cos θ' : 'sen θ';
    const ec = (rhs) => ({ texto: `x² + y² = ${rhs}`, num: null });
    const c = tx(A), pre = c === '1' ? '' : c === MENOS + '1' ? MENOS : c + ' ';
    const base = Object.assign(ec(coefVar(A, v)), { pasos: [`r = ${pre}${fn}`, `r² = ${pre}r ${fn}`, `x² + y² = ${coefVar(A, v)}`] });
    return Object.assign(base, errores(base, [
      ['sinX', 'CP19', `se cambia r por √(x² + y²) y se olvida el ${v}: x² + y² = a`, () => ec(tx(A))],
      ['cuadradoMal', 'CP20', `√(x² + y²) = a${v} y se eleva: x² + y² = a²${v}² (cambió ${fn} por ${v}, no por ${v}/r)`, () => ec(coefVar(mul(A, A), v + '²'))],
      ['ejeCruzado', 'CP17', 'se cruzan coseno y seno', () => ec(coefVar(A, w))],
      ['centroEnA', 'CP16', `se toma el centro en a y el radio |a|: x² + y² = 2a${v}`, () => ec(coefVar(mul(R(2), A), v))],
    ]));
  }
  function petalos(o) {
    const A = aNoCero(o && o.a), n = o.n;
    fDe(o.f || 'cos');
    if (!Number.isSafeInteger(n) || n < 2) throw new Error('n debe ser un entero mayor o igual que 2');
    const regla = m => (m % 2 ? m : 2 * m), L = abs(A);
    const sal = (p, Lr) => ({ texto: `${p} pétalos de largo ${tx(Lr)}`, num: { p, L: val(Lr) } });
    const base = Object.assign({ petalos: regla(n), largo: tx(L), vuelta: n % 2 ? 180 : 360 }, sal(regla(n), L));
    return Object.assign(base, errores(base, [
      ['siempreN', 'CP21', 'la rosa siempre tiene n pétalos', () => sal(n, L)],
      ['siempre2n', 'CP22', 'la rosa siempre tiene 2n pétalos', () => sal(2 * n, L)],
      ['largoMitad', 'CP23', 'el pétalo mide |a|/2 (como el radio de r = a cos θ)', () => sal(regla(n), div(L, R(2)))],
      ['cruzaAyN', 'CP24', 'se cruzan a y n: a da el número de pétalos y n el largo', () => (L.d === 1 && L.m === 1 && L.n >= 2 ? sal(regla(L.n), R(n)) : null)],
    ]));
  }
  function radio(o) {
    const a = val(aR(o.a === undefined ? 1 : o.a, 'a')), n = o.n || 1, g = ang(o.theta) * GR;
    switch (o.tipo) {
      case 'circulo': return a;
      case 'cos': return a * Math.cos(g);
      case 'sen': return a * Math.sin(g);
      case 'rosaCos': return a * Math.cos(n * g);
      case 'rosaSen': return a * Math.sin(n * g);
      default: throw new Error("tipo debe ser 'circulo', 'cos', 'sen', 'rosaCos' o 'rosaSen'");
    }
  }
  function muestrear(o) {
    const pasos = o.pasos || 360, out = [];
    if (o.tipo === 'recta') {
      const a = val(aR(o.a, 'a')), k = ang(o.k, 'k');
      for (let j = 0; j <= pasos; j++) out.push(punto({ r: -a + 2 * a * j / pasos, theta: k }));
      return out;
    }
    const n = o.n || 1, vuelta = o.tipo === 'circulo' ? 360 : o.tipo === 'cos' || o.tipo === 'sen' ? 180 : (n % 2 ? 180 : 360);
    for (let j = 0; j <= pasos; j++) { const t = vuelta * j / pasos; out.push(punto({ r: radio(Object.assign({}, o, { theta: t })), theta: t })); }
    return out;
  }

  // ---------- Forma polar de un complejo ----------
  function formaPolar(o) {
    if (!o || typeof o !== 'object' || !('re' in o) || !('im' in o)) throw new Error('z debe ser { re, im }');
    const P = aPolares({ x: o.re, y: o.im });
    if (P.polo) throw new Error('z = 0 no tiene argumento');
    const t = P.theta, rad = radianes(t), rt = P.r === '1' ? '' : P.r;
    const principal = t > 180 ? limpio(t - 360) : t;
    const X = aR(o.re, 'la parte real'), Y = aR(o.im, 'la parte imaginaria');
    const yi = (() => { const a = txAbs(Y); return (a === '1' ? '' : Y.m === 1 ? a : a + ' ') + 'i'; })();
    const binomica = esCero(Y) ? tx(X) : esCero(X) ? (Y.n < 0 ? MENOS : '') + yi : `${tx(X)} ${Y.n < 0 ? MENOS : '+'} ${yi}`;
    return { r: P.r, theta: t, principal: principal + 0, par: P.texto, polar: `${rt ? rt + ' ' : ''}cis ${txG(t)}`, radianes: rad,
      exponencial: `${rt}e^(i·${rad === null ? decimal(t * GR, 2) : rad})`, binomica, num: P.num };
  }

  return {
    punto, dePunto, normal, cuadrante, positivo, conRNegativo, equivalentes, mismoPunto, aCartesianas, aPolares,
    rectaTheta, circuloPolo, circuloEje, cartesianaEje, petalos, radio, muestrear, formaPolar, radianes, decimal,
    texto: v => tx(aR(v)),
  };
});
