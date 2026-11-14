/*
 * Motor de «Dos flechas en la circunferencia»: transformaciones trigonométricas (suma a producto, producto a suma,
 * cocientes que se simplifican y series cortas).
 *
 * Aquí vive toda la matemática de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el
 * navegador (window.MotorTransTrig) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * Ángulos en grados sexagesimales. Los valores salen EXACTOS cuando todos los ángulos que intervienen son múltiplos
 * de 15° (0°, 15°, 30°, …): una suma de términos (n/d)·√r con su texto, '√6/2', '(2 + √3)/2', '−√2/2'. Con otros
 * ángulos, el valor es numérico (Math) y su texto lleva 3 decimales fijos con coma ('0,940'). En el texto exacto van
 * primero los términos positivos, con el entero delante ('2 + √3', '2 − √3', '√3 − 1'); si todos son negativos, el
 * signo sale afuera ('−(1 + √3)/2'). 'exacto: true' quiere decir que el RESULTADO salió exacto: puede pasar aunque
 * algún ángulo no sea múltiplo de 15°, si la fórmula lo anula (cos 20° + cos 140° + cos 260° = 0 exacto). NO se usa la convención de academia (sen 37° = 3/5): con ella, sen 53° + sen 37°
 * = 7/5 no coincidiría con 2 sen 45° cos 8°, que no es exacto.
 *
 * La idea de la escena: los puntos PA y PB de la circunferencia de radio 1 en los ángulos A y B son dos flechas
 * desde O. Su suma (la diagonal del rombo) apunta a la semisuma M = (A + B)/2 y mide 2 cos D, con D = (A − B)/2;
 * su altura es sen A + sen B = 2 sen M cos D y su abscisa cos A + cos B = 2 cos M cos D. La resta PA − PB es la
 * cuerda: mide 2 sen D y es perpendicular a la diagonal; su abscisa cos A − cos B = −2 sen M sen D (el signo menos).
 *
 * Funciones exportadas (argumentos → lo que devuelve):
 *   razon(fn, g)
 *       fn: 'sen' | 'cos' | 'tan'; g en grados. → { valor, texto, exacto } (exacto si g es múltiplo de 15°;
 *       tan 90° → { valor: null, texto: 'no existe', existe: false }).
 *   sumaAProducto({ fn, op, A, B })
 *       fn 'sen' | 'cos', op '+' | '−', A y B en grados. Transforma fn A op fn B en producto:
 *       sen+sen = 2 sen M cos D; sen−sen = 2 cos M sen D; cos+cos = 2 cos M cos D; cos−cos = −2 sen M sen D.
 *       → { valor, texto, exacto, A, B, M, D, coef (2 o −2), f1, f2, expresion ('2 sen 45° cos 30°'), directo
 *       (fn A op fn B calculado sin la fórmula), errores, coinciden }.
 *   productoASuma({ tipo, x, y, veces })
 *       tipo 'sencos' (2 sen x cos y) | 'coscos' (2 cos x cos y) | 'sensen' (2 sen x sen y); x, y en grados; veces
 *       (entero, 1 si no se da) multiplica todo: veces = 2 da 4 sen x cos y = 2 sen(x + y) + 2 sen(x − y).
 *       sencos = sen(x + y) + sen(x − y); coscos = cos(x + y) + cos(x − y); sensen = cos(x − y) − cos(x + y).
 *       → { valor, texto, exacto, x, y, terminos: [{ fn, g, signo }], expresion ('sen 90° + sen 60°'), directo,
 *       errores, coinciden }.
 *   cociente({ p, q, num, den })
 *       (sen px num sen qx)/(cos px den cos qx), con p > q > 0 enteros, num y den '+' | '−'.
 *       ++ → tan Mx; −+ → tan Dx; +− → −cot Dx; −− → −cot Mx, con M = (p + q)/2 y D = (p − q)/2.
 *       → { texto ('tan 4x'), forma: { s, fn, k: { n, d } }, M, D, valorEn(x) (la forma simplificada en x grados),
 *       originalEn(x) (el cociente sin simplificar), errores (cada uno con su forma y texto), coinciden }.
 *       Con { x } en la entrada, además en: { x, original, simplificada }. Las dos valen null donde no existen:
 *       el original cuando su denominador es 0 (también 0/0) y la forma cuando tan o cot no existe. Ejemplo:
 *       p = 3, q = 1 en x = 45° → las dos null; en x = 90° el original es 0/0 (null) y tan 180° = 0: la
 *       simplificación vale solo donde el cociente original existe.
 *   simplificar({ arriba, abajo, x })
 *       Cociente general: arriba y abajo son { fn: 'sen' | 'cos', op: '+' | '−', p, q } = fn px op fn qx, con p ≠ q
 *       enteros positivos en cualquier orden. Cada lado se vuelve producto, se cancela el factor común y queda
 *       s · tan o cot de kx. → { texto ('tan 2x'), forma, comun ('sen 3x', el factor que se cancela), valorEn(x),
 *       originalEn(x), en (si se da x) }. Error si no queda una tangente o una cotangente.
 *   agrupar({ solo, par: [p, q] })
 *       cos solo + cos p + cos q, agrupando el par con cos p + cos q = 2 cos M cos D. Hace falta que D (o M) sea
 *       ±solo (módulo 360°) y que el otro ángulo sea múltiplo de 15°. → { valor (k), texto de k, kPar (el par =
 *       kPar · cos solo), M, D, total (valor numérico de la suma), errores, coinciden }.
 *   serie({ fn, a, r, n })
 *       fn a + fn(a + r) + … (n términos) = [sen(n r/2) / sen(r/2)] · fn(a + (n − 1) r/2).
 *       → { valor, texto, exacto, factor (sen(nr/2)/sen(r/2), numérico), centro, directo, errores, coinciden }.
 *   rombo({ A, B })
 *       Geometría de las dos flechas con Math (sin redondeos de tabla). Requiere 0 < A − B < 180.
 *       → { A, B, M, D, PA, PB, suma: { x, y }, largo (2 cos D), resta: { x, y }, largoResta (2 sen D),
 *       direccionResta (M + 90), alturaSuma (sen A + sen B), abscisaSuma, alturaResta, abscisaResta,
 *       pendiente (alturaSuma/abscisaSuma, o null), direccion: { valor M, texto '45°', errores },
 *       largoExacto: { valor, texto, errores } (2 cos D; texto exacto si D es múltiplo de 15°) }.
 *   pulsos({ p, q, t0, t1, n })
 *       sen pt + sen qt = 2 sen Mt · cos Dt (p > q > 0), muestreado en n puntos de t0 a t1 (grados).
 *       → { muestras: [{ t, y1, y2, suma, env }], M, D, valor (cuántas veces se anula la envolvente 2 cos Dt en
 *       [t0; t1]), ceros (los t), texto, errores, coinciden }.
 *   exacto(t), texto(v, dec)
 *       Número exacto a partir de '√2/2' o '3/4' → { valor, texto }; número con coma decimal y signo − tipográfico.
 *   ERRORES
 *       id → descripción. TR12 y TR16 del informe docs/investigacion/trigonometria-ideas-erroneas.md; TT1 a TT13,
 *       hipótesis nuestras (el informe no trata las transformaciones).
 *
 * Cada resultado que es respuesta de una predicción trae 'errores': nombre → { id, valor, texto }, lo que dan los
 * errores típicos. Un error que en ese caso da lo mismo que la respuesta correcta se quita y su nombre queda en
 * 'coinciden'.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorTransTrig = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const GR = Math.PI / 180, TOL = 1e-9;

  const ERRORES = {
    TR12: 'signo por cuadrante: el coseno como distancia, sin signo (cos 120° tomado como +1/2)',
    TR16: 'linealidad (extensión nuestra): sen A + sen B = sen(A + B), cos A + cos B = cos(A + B)',
    TT1: 'olvida el 2 de la fórmula (o lo pone de más)',
    TT2: 'intercambia la semisuma y la semidiferencia',
    TT3: 'cambia la función: pone cos donde va sen (o al revés), o cot en vez de tan',
    TT4: 'no divide entre 2: usa A + B y A − B en lugar de (A + B)/2 y (A − B)/2',
    TT5: 'olvida el signo menos de cos A − cos B (o de 2 sen x sen y)',
    TT6: 'producto a suma con un solo término',
    TT7: 'producto a suma con la fórmula de otro producto',
    TT8: 'al agrupar, se queda con el par y olvida el término que quedó afuera',
    TT9: 'serie: n veces el término del centro',
    TT10: 'la flecha suma apunta como la primera flecha',
    TT11: 'el largo de la suma es la suma de los largos (1 + 1 = 2)',
    TT12: 'dos ondas que se suman nunca se apagan',
    TT13: 'producto a suma con el 2 de más: 2 sen x cos y = 2[sen(x + y) + sen(x − y)]'
  };

  function numero(x, que) {
    if (typeof x !== 'number' || !Number.isFinite(x)) throw new Error(`${que} debe ser un número`);
    return x;
  }

  // ---------- Fracciones ----------
  function mcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; }
  function fr(n, d) {
    if (d === undefined) d = 1;
    if (d === 0) throw new Error('denominador cero');
    if (d < 0) { n = -n; d = -d; }
    const g = mcd(n, d) || 1;
    return { n: n / g + 0, d: d / g };
  }

  // ---------- Números exactos: suma de términos (n/d)·√r, r libre de cuadrados ----------
  function sacarCuadrados(r) {
    let s = 1, t = r;
    for (let p = 2; p * p <= t; p++) while (t % (p * p) === 0) { t /= p * p; s *= p; }
    return { s, t };
  }
  function normal(terms) {
    const m = new Map();
    for (const { n, d, r } of terms) {
      if (n === 0) continue;
      const q = sacarCuadrados(r), k = m.get(q.t) || fr(0, 1), f = fr(n * q.s, d);
      m.set(q.t, fr(k.n * f.d + f.n * k.d, k.d * f.d));
    }
    return [...m.entries()].filter(([, f]) => f.n !== 0).map(([r, f]) => ({ n: f.n, d: f.d, r })).sort((x, y) => y.r - x.r);
  }
  const ex = (n, d, r) => normal([{ n, d: d || 1, r: r || 1 }]);
  const exSuma = (A, B) => normal(A.concat(B));
  const exNeg = A => A.map(t => ({ n: -t.n, d: t.d, r: t.r }));
  const exResta = (A, B) => exSuma(A, exNeg(B));
  function exProd(A, B) {
    const out = [];
    for (const a of A) for (const b of B) out.push({ n: a.n * b.n, d: a.d * b.d, r: a.r * b.r });
    return normal(out);
  }
  const exEsc = (A, n, d) => exProd(A, ex(n, d || 1));
  const exValor = A => A.reduce((s, t) => s + t.n * Math.sqrt(t.r) / t.d, 0) + 0;
  // Divide entre un exacto de un solo término; null si no se puede.
  function exDiv(A, B) {
    if (B.length === 2) {   // con el conjugado: (a√p + b√q)(a√p − b√q) = a²p − b²q, racional
      const conj = [B[0], { n: -B[1].n, d: B[1].d, r: B[1].r }], den = exProd(B, conj);
      if (den.length !== 1 || den[0].r !== 1) return null;
      return exDiv(exProd(A, conj), den);
    }
    if (B.length !== 1) return null;
    const b = B[0];   // 1/((n/d)√r) = d√r/(n r)
    return exProd(A, ex(b.d, b.n * b.r, b.r));
  }
  function exTexto(A) {
    if (!A || A.length === 0) return '0';
    const raiz = (m, r) => (r === 1 ? String(m) : (m === 1 ? `√${r}` : `${m}√${r}`));
    if (A.length === 1) {
      const t = A[0], s = t.n < 0 ? '−' : '';
      return s + (t.d === 1 ? raiz(Math.abs(t.n), t.r) : `${raiz(Math.abs(t.n), t.r)}/${t.d}`);
    }
    if (A.every(t => t.n < 0)) {   // −(2 + √3)/2 y −(1 + √3): con paréntesis, para que no se lea −1 + √3
      const s = exTexto(exNeg(A));
      return s.startsWith('(') ? '−' + s : `−(${s})`;
    }
    const L = A.reduce((l, t) => l * t.d / mcd(l, t.d), 1);
    // primero los positivos (el entero delante: 2 + √3, 1 + √3), después los negativos: 2 − √3, √3 − 1, √6 + √2
    const ent = A.filter(t => t.r === 1), rad = A.filter(t => t.r !== 1);
    const orden = ent.filter(t => t.n > 0).concat(rad.filter(t => t.n > 0), rad.filter(t => t.n < 0), ent.filter(t => t.n < 0));
    let s = '';
    orden.forEach((t, i) => {
      const n = t.n * L / t.d, m = Math.abs(n);
      s += i === 0 ? (n < 0 ? '−' : '') + raiz(m, t.r) : (n < 0 ? ' − ' : ' + ') + raiz(m, t.r);
    });
    if (L === 1) return s;
    return `(${s})/${L}`;
  }
  function exDe(t) {
    const s = String(t).trim().replace(/−/g, '-');
    let m = s.match(/^(-?)(\d*)√(\d+)(?:\/(\d+))?$/);
    if (m) return ex((m[1] ? -1 : 1) * (m[2] ? Number(m[2]) : 1), m[4] ? Number(m[4]) : 1, Number(m[3]));
    m = s.match(/^(-?\d+)(?:\/(\d+))?$/);
    if (m) return ex(Number(m[1]), m[2] ? Number(m[2]) : 1, 1);
    throw new Error(`'${t}' no es un número exacto (usa '3/4' o '√2/2')`);
  }

  // Coma decimal, signo menos tipográfico
  function texto(v, dec) {   // dec decimales fijos (3 si no se dice): 0,940
    if (v && typeof v === 'object' && v.texto) return v.texto;
    if (!Number.isFinite(v)) return '—';
    const d = dec === undefined ? 3 : dec, r = Number((Math.round(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d)) + 0;
    return (r < 0 ? '−' : '') + Math.abs(r).toFixed(d).replace('.', ',');
  }
  function grados(g) { const r = Math.round(g * 100) / 100 + 0; return `${r < 0 ? '−' : ''}${String(Math.abs(r)).replace('.', ',')}°`; }
  const fa = (f, g) => (g < 0 ? `${f}(${grados(g)})` : `${f} ${grados(g)}`);   // sen 30°, sen(−30°)

  // ---------- Ángulos notables de verdad: múltiplos de 15° ----------
  const NOT = {
    0: [ex(0), ex(1)], 15: [ex(1, 4, 6).concat(ex(-1, 4, 2)), ex(1, 4, 6).concat(ex(1, 4, 2))],
    30: [ex(1, 2), ex(1, 2, 3)], 45: [ex(1, 2, 2), ex(1, 2, 2)], 60: [ex(1, 2, 3), ex(1, 2)],
    75: [ex(1, 4, 6).concat(ex(1, 4, 2)), ex(1, 4, 6).concat(ex(-1, 4, 2))], 90: [ex(1), ex(0)]
  };
  for (const k of Object.keys(NOT)) NOT[k] = NOT[k].map(normal);
  function normalizar(g) { const r = ((g % 360) + 360) % 360; return Math.abs(r - 360) < 1e-9 ? 0 : r + 0; }
  function senCosExacto(g) {
    const r = normalizar(g);
    let ref, ss, sc;
    if (r <= 90) { ref = r; ss = 1; sc = 1; } else if (r <= 180) { ref = 180 - r; ss = 1; sc = -1; }
    else if (r <= 270) { ref = r - 180; ss = -1; sc = -1; } else { ref = 360 - r; ss = -1; sc = 1; }
    const k = Object.keys(NOT).map(Number).find(n => Math.abs(n - ref) < 1e-9);
    if (k === undefined) return null;
    return { sen: ss > 0 ? NOT[k][0] : exNeg(NOT[k][0]), cos: sc > 0 ? NOT[k][1] : exNeg(NOT[k][1]) };
  }
  // fn('sen' | 'cos') de g: exacto (lista de términos) o null
  const exFn = (fn, g) => { const e = senCosExacto(g); return e ? e[fn] : null; };
  const mathFn = (fn, g) => (fn === 'sen' ? Math.sin(g * GR) : fn === 'cos' ? Math.cos(g * GR) : Math.tan(g * GR)) + 0;
  const otra = fn => (fn === 'sen' ? 'cos' : 'sen');

  function razon(fn, g) {
    if (!['sen', 'cos', 'tan'].includes(fn)) throw new Error(`función desconocida: ${fn} (usa sen, cos o tan)`);
    numero(g, 'el ángulo');
    const e = senCosExacto(g);
    if (e) {
      if (fn !== 'tan') return { valor: exValor(e[fn]), texto: exTexto(e[fn]), exacto: true, existe: true };
      if (e.cos.length === 0) return { valor: null, texto: 'no existe', exacto: true, existe: false };
      const t = exDiv(e.sen, e.cos);
      if (t) return { valor: exValor(t), texto: exTexto(t), exacto: true, existe: true };
    }
    const v = mathFn(fn, g);
    return { valor: v, texto: texto(v), exacto: false, existe: true };
  }

  // Un número: exacto { A } si se puede, si no numérico. prod(c, [fn, g], [fn, g]) = c · fn(g) · fn(g)
  function prod(c, a, b) {
    const ea = exFn(a[0], a[1]), eb = exFn(b[0], b[1]);
    if (ea && eb) return { A: exEsc(exProd(ea, eb), c.n, c.d) };
    if ((ea && ea.length === 0) || (eb && eb.length === 0)) return { A: [] };   // un factor exacto vale 0: el producto es 0 exacto
    return { v: (c.n / c.d) * mathFn(a[0], a[1]) * mathFn(b[0], b[1]) };
  }
  // combinación de términos s · fn(g)
  function comb(ts) {
    if (ts.every(([, fn, g]) => exFn(fn, g))) return { A: ts.reduce((acc, [s, fn, g]) => exSuma(acc, exEsc(exFn(fn, g), s)), []) };
    return { v: ts.reduce((acc, [s, fn, g]) => acc + s * mathFn(fn, g), 0) };
  }
  const valorDe = X => (X.A ? exValor(X.A) : X.v + 0);
  const textoDe = X => (X.A ? exTexto(X.A) : texto(X.v));
  const pub = X => ({ valor: valorDe(X), texto: textoDe(X), exacto: !!X.A });

  // ---------- Errores: quitar los que coinciden con la correcta ----------
  const igual = (a, b) => Math.abs(a - b) <= TOL * Math.max(1, Math.abs(b));
  function errores(correcto, lista) {
    const out = {}, coinciden = [];
    for (const [k, id, X] of lista) {
      if (X === null || X === undefined) continue;
      const v = typeof X === 'number' ? X : valorDe(X);
      if (!Number.isFinite(v)) continue;
      if (igual(v, correcto)) { coinciden.push(k); continue; }
      out[k] = { id, valor: v, texto: typeof X === 'number' ? texto(X) : textoDe(X) };
    }
    return { errores: out, coinciden };
  }
  const opValido = op => {
    if (!['+', '−', '-'].includes(op)) throw new Error("op debe ser '+' o '−'");
    return op === '+' ? '+' : '−';
  };

  // ---------- Suma a producto ----------
  const FORMULAS = {   // [coef, f1 de M, f2 de D]
    'sen+': [2, 'sen', 'cos'], 'sen−': [2, 'cos', 'sen'], 'cos+': [2, 'cos', 'cos'], 'cos−': [-2, 'sen', 'sen']
  };
  function sumaAProducto(o) {
    o = o || {};
    const fn = o.fn || 'sen';
    if (!['sen', 'cos'].includes(fn)) throw new Error('fn debe ser sen o cos');
    const op = opValido(o.op || '+'), A = numero(o.A, 'el ángulo A'), B = numero(o.B, 'el ángulo B');
    const M = (A + B) / 2, D = (A - B) / 2, [c, f1, f2] = FORMULAS[fn + op], s = op === '+' ? 1 : -1;
    const R = prod(fr(c), [f1, M], [f2, D]), v = valorDe(R);
    const directo = valorDe(comb([[1, fn, A], [s, fn, B]]));
    const E = errores(v, [
      ['lineal', 'TR16', comb([[1, fn, op === '+' ? A + B : A - B]])],
      ['sinDos', 'TT1', prod(fr(c, 2), [f1, M], [f2, D])],
      ['intercambia', 'TT2', prod(fr(c), [f1, D], [f2, M])],
      ['funcion', 'TT3', prod(fr(c), [otra(f1), M], [f2, D])],
      ['sinDividir', 'TT4', prod(fr(c), [f1, A + B], [f2, A - B])],
      ['signo', 'TT5', fn === 'cos' && op === '−' ? prod(fr(-c), [f1, M], [f2, D]) : null]
    ]);
    const expresion = `${c < 0 ? '−' : ''}2 ${fa(f1, M)} ${fa(f2, D)}`;
    return Object.assign(pub(R), { fn, op, A, B, M, D, coef: c, f1, f2, expresion, directo }, E);
  }

  // ---------- Producto a suma ----------
  const PRODUCTOS = {   // 2·fx(x)·fy(y) = s1·g(x + y) + s2·g(x − y)
    sencos: { fx: 'sen', fy: 'cos', t: [[1, 'sen', '+'], [1, 'sen', '−']] },
    coscos: { fx: 'cos', fy: 'cos', t: [[1, 'cos', '+'], [1, 'cos', '−']] },
    sensen: { fx: 'sen', fy: 'sen', t: [[1, 'cos', '−'], [-1, 'cos', '+']] }
  };
  function productoASuma(o) {
    o = o || {};
    const P = PRODUCTOS[o.tipo];
    if (!P) throw new Error("tipo debe ser 'sencos', 'coscos' o 'sensen'");
    const x = numero(o.x, 'el ángulo x'), y = numero(o.y, 'el ángulo y');
    const veces = o.veces === undefined ? 1 : numero(o.veces, 'veces');
    if (!Number.isInteger(veces) || veces === 0) throw new Error('veces debe ser un entero distinto de 0');
    const ang = w => (w === '+' ? x + y : x - y);
    const ts = P.t.map(([s, g, w]) => [veces * s, g, ang(w)]);
    const R = comb(ts), v = valorDe(R);
    const directo = veces * 2 * mathFn(P.fx, x) * mathFn(P.fy, y);
    const otraF = o.tipo === 'sencos' ? 'cos' : 'sen';
    const E = errores(v, [
      ['unTermino', 'TT6', comb([ts[0]])],
      ['funcion', 'TT7', o.tipo === 'sensen' ? comb([[veces, 'cos', x - y], [veces, 'cos', x + y]]) : comb(ts.map(([s, , g]) => [s, otraF, g]))],
      ['signo', 'TT5', comb([[-ts[0][0], ts[0][1], ts[0][2]], [-ts[1][0], ts[1][1], ts[1][2]]])],
      ['dobla', 'TT13', comb(ts.map(([s, f, g]) => [2 * s, f, g]))]
    ]);
    const k = Math.abs(veces) === 1 ? '' : `${Math.abs(veces)} `;
    const expresion = ts.map(([s, f, g], i) => `${i ? (s < 0 ? ' − ' : ' + ') : (s < 0 ? '−' : '')}${k}${fa(f, g)}`).join('');
    return Object.assign(pub(R), { tipo: o.tipo, x, y, veces, terminos: ts.map(([signo, fn, g]) => ({ fn, g, signo })), expresion, directo }, E);
  }

  // ---------- Cocientes que se simplifican ----------
  // Una forma s · fn(k x), con k = n/d
  function formaTexto(F) {
    const k = fr(F.k.n, F.k.d), s = F.s < 0 ? '−' : '';
    if (k.d === 1) return `${s}${F.fn} ${k.n === 1 ? '' : k.n}x`;
    return `${s}${F.fn}(${k.n === 1 ? '' : k.n}x/${k.d})`;
  }
  function formaEn(F, x) {   // null si no existe (tan con coseno 0, cot con seno 0)
    const g = F.k.n / F.k.d * x * GR, sn = Math.sin(g), cs = Math.cos(g);
    if (Math.abs(F.fn === 'tan' ? cs : sn) < 1e-12) return null;
    const v = F.s * (F.fn === 'tan' ? sn / cs : cs / sn);
    return Math.abs(v) < 1e-12 ? 0 : v + 0;
  }
  const cocienteEn = (a, b) => (Math.abs(b) < 1e-12 ? null : a / b + 0);   // null si el denominador es 0 (también 0/0)
  const XS = [3.7, 7.3, 11.9, 17.1, 23.3];   // ángulos de prueba (grados): dos formas son iguales si coinciden en todos
  const mismaForma = (F, G) => XS.every(x => igual(formaEn(F, x), formaEn(G, x)));
  function cociente(o) {
    o = o || {};
    const p = numero(o.p, 'p'), q = numero(o.q, 'q');
    if (!Number.isInteger(p) || !Number.isInteger(q) || !(p > q && q > 0)) throw new Error('p y q deben ser enteros con p > q > 0');
    const num = opValido(o.num || '+'), den = opValido(o.den || '+');
    const kM = fr(p + q, 2), kD = fr(p - q, 2), kS = fr(p + q), kR = fr(p - q);
    // numerador: + → 2 sen M cos D; − → 2 cos M sen D. denominador: + → 2 cos M cos D; − → −2 sen M sen D.
    const TABLA = { '++': [1, 'tan', 'M'], '−+': [1, 'tan', 'D'], '+−': [-1, 'cot', 'D'], '−−': [-1, 'cot', 'M'] };
    const [s, fn, cual] = TABLA[num + den];
    const k = cual === 'M' ? kM : kD, kOtro = cual === 'M' ? kD : kM, kSin = cual === 'M' ? kS : kR;
    const F = { s, fn, k };
    const lista = [
      ['intercambia', 'TT2', { s, fn, k: kOtro }],
      ['sinDividir', 'TT4', { s, fn, k: kSin }],
      ['funcion', 'TT3', { s, fn: fn === 'tan' ? 'cot' : 'tan', k }],
      ['signo', 'TT5', s < 0 ? { s: 1, fn, k } : null]
    ];
    const out = {}, coinciden = [];
    for (const [nom, id, G] of lista) {
      if (!G) continue;
      if (mismaForma(F, G)) { coinciden.push(nom); continue; }
      out[nom] = { id, forma: G, texto: formaTexto(G), valor: formaEn(G, XS[0]) };
    }
    const sn = num === '+' ? 1 : -1, sd = den === '+' ? 1 : -1;
    const originalEn = x => cocienteEn(Math.sin(p * x * GR) + sn * Math.sin(q * x * GR), Math.cos(p * x * GR) + sd * Math.cos(q * x * GR));
    const r = { texto: formaTexto(F), forma: F, valor: formaEn(F, XS[0]), M: kM.n / kM.d, D: kD.n / kD.d, p, q, num, den,
      valorEn: x => formaEn(F, x), originalEn, errores: out, coinciden };
    if (o.x !== undefined) { const x = numero(o.x, 'x'); r.en = { x, original: originalEn(x), simplificada: formaEn(F, x) }; }
    return r;
  }

  // Cociente general: (fn p x op fn q x)/(fn p x op fn q x), con fn sen o cos y p ≠ q enteros positivos en cualquier
  // orden. Cada lado se vuelve producto c · f1(M x) · f2(D x); se cancela el factor común y queda s · tan o cot de k x.
  function lado(L, que) {
    if (!L || !['sen', 'cos'].includes(L.fn)) throw new Error(`${que}: fn debe ser sen o cos`);
    const p = numero(L.p, `${que}: p`), q = numero(L.q, `${que}: q`), op = opValido(L.op || '+');
    if (!Number.isInteger(p) || !Number.isInteger(q) || p <= 0 || q <= 0 || p === q) throw new Error(`${que}: p y q deben ser enteros positivos distintos`);
    let [c, f1, f2] = FORMULAS[L.fn + op];
    let M = fr(p + q, 2), D = fr(p - q, 2);
    if (D.n < 0) { D = fr(-D.n, D.d); if (f2 === 'sen') c = -c; }   // sen(−u) = −sen u; cos(−u) = cos u
    return { c, fs: [[f1, M], [f2, D]] };
  }
  function simplificar(o) {
    o = o || {};
    const A = lado(o.arriba, 'arriba'), B = lado(o.abajo, 'abajo');
    const mismo = (u, v) => u[0] === v[0] && u[1].n * v[1].d === v[1].n * u[1].d;
    let ia = -1, ib = -1;
    for (let i = 0; i < 2 && ia < 0; i++) for (let j = 0; j < 2; j++) if (mismo(A.fs[i], B.fs[j])) { ia = i; ib = j; break; }
    if (ia < 0) throw new Error('arriba y abajo no tienen un factor común: no se simplifica a tan o cot');
    const u = A.fs[1 - ia], v = B.fs[1 - ib];
    if (u[1].n * v[1].d !== v[1].n * u[1].d || u[0] === v[0]) throw new Error('lo que queda no es una tangente ni una cotangente');
    const F = { s: Math.sign(A.c * B.c), fn: u[0] === 'sen' ? 'tan' : 'cot', k: u[1] };
    const val = (L, x) => mathFn(L.fn, L.p * x) + (opValido(L.op || '+') === '+' ? 1 : -1) * mathFn(L.fn, L.q * x);
    const originalEn = x => cocienteEn(val(o.arriba, x), val(o.abajo, x));
    const r = { texto: formaTexto(F), forma: F, valorEn: x => formaEn(F, x), originalEn,
      comun: `${A.fs[ia][0]} ${formaTexto({ s: 1, fn: '', k: A.fs[ia][1] }).trim()}` };
    if (o.x !== undefined) { const x = numero(o.x, 'x'); r.en = { x, original: originalEn(x), simplificada: formaEn(F, x) }; }
    return r;
  }

  // ---------- Agrupar un par en una suma de tres cosenos ----------
  const mismoCos = (g, h) => { const a = normalizar(g), b = normalizar(h); return Math.abs(a - b) < 1e-9 || Math.abs(normalizar(a + b)) < 1e-9; };
  function agrupar(o) {
    o = o || {};
    const solo = numero(o.solo, 'el ángulo solo');
    if (!Array.isArray(o.par) || o.par.length !== 2) throw new Error('par debe ser una lista de dos ángulos');
    const p = numero(o.par[0], 'el primer ángulo del par'), q = numero(o.par[1], 'el segundo ángulo del par');
    const M = (p + q) / 2, D = (p - q) / 2;
    let otro;
    if (mismoCos(D, solo)) otro = M; else if (mismoCos(M, solo)) otro = D;
    else throw new Error('al agrupar el par, ni la semisuma ni la semidiferencia dan el ángulo que quedó solo');
    const c = exFn('cos', otro);
    if (!c) throw new Error('el otro ángulo del par debe ser múltiplo de 15°');
    const kPar = exEsc(c, 2), k = exSuma(ex(1), kPar), v = exValor(k);
    const absPar = exValor(kPar) < 0 ? exNeg(kPar) : kPar;
    const E = errores(v, [
      ['sinDos', 'TT1', { A: exSuma(ex(1), c) }],
      ['signo', 'TR12', { A: exSuma(ex(1), absPar) }],
      ['elPar', 'TT8', { A: kPar }]
    ]);
    const total = Math.cos(solo * GR) + Math.cos(p * GR) + Math.cos(q * GR);
    return Object.assign({ valor: v, texto: exTexto(k), solo, par: [p, q], M, D, otro, kPar: { valor: exValor(kPar), texto: exTexto(kPar) }, total: total + 0 }, E);
  }

  // ---------- Series en progresión ----------
  function serie(o) {
    o = o || {};
    const fn = o.fn || 'sen';
    if (!['sen', 'cos'].includes(fn)) throw new Error('fn debe ser sen o cos');
    const a = numero(o.a, 'a'), r = numero(o.r, 'r'), n = numero(o.n, 'n');
    if (!Number.isInteger(n) || n < 2) throw new Error('n debe ser un entero mayor o igual a 2');
    if (Math.abs(Math.sin(r / 2 * GR)) < 1e-12) throw new Error('con sen(r/2) = 0 la fórmula no sirve');
    const centro = a + (n - 1) * r / 2;
    const eN = exFn('sen', n * r / 2), eR = exFn('sen', r / 2), eC = exFn(fn, centro);
    let R = null;
    if (eN && eN.length === 0) R = { A: [] };   // sen(nr/2) = 0: la serie vale 0
    else if (eN && eR && eC) { const q = exDiv(eN, eR); if (q) R = { A: exProd(q, eC) }; }
    const factor = Math.sin(n * r / 2 * GR) / Math.sin(r / 2 * GR);
    if (!R) R = { v: factor * mathFn(fn, centro) };
    const v = valorDe(R);
    let directo = 0; for (let j = 0; j < n; j++) directo += mathFn(fn, a + j * r);
    const sR = Math.sin(r * GR);
    const E = errores(v, [
      ['nVeces', 'TT9', eC ? { A: exEsc(eC, n) } : { v: n * mathFn(fn, centro) }],
      ['lineal', 'TR16', comb([[1, fn, n * a + r * n * (n - 1) / 2]])],
      ['sinMitad', 'TT4', Math.abs(sR) < 1e-12 ? null : { v: Math.sin(n * r * GR) / sR * mathFn(fn, centro) }]
    ]);
    return Object.assign(pub(R), { fn, a, r, n, centro, factor: factor + 0, directo: directo + 0 }, E);
  }

  // ---------- Las dos flechas (geometría de la escena) ----------
  function rombo(o) {
    o = o || {};
    const A = numero(o.A, 'el ángulo A'), B = numero(o.B, 'el ángulo B');
    if (!(A - B > 0 && A - B < 180)) throw new Error('hace falta 0 < A − B < 180');
    const P = g => ({ x: Math.cos(g * GR) + 0, y: Math.sin(g * GR) + 0 });
    const PA = P(A), PB = P(B), M = (A + B) / 2, D = (A - B) / 2;
    const suma = { x: PA.x + PB.x, y: PA.y + PB.y }, resta = { x: PA.x - PB.x, y: PA.y - PB.y };
    const largo = 2 * Math.cos(D * GR), largoResta = 2 * Math.sin(D * GR);
    const dir = errores(M, [['sinDividir', 'TT4', A + B], ['intercambia', 'TT2', D], ['primera', 'TT10', A]]);
    for (const e of Object.values(dir.errores)) e.texto = grados(e.valor);
    const eD = exFn('cos', D), L = eD ? { A: exEsc(eD, 2) } : { v: largo };
    const eS = exFn('sen', D);
    const lar = errores(valorDe(L), [
      ['sumaLargos', 'TT11', { A: ex(2) }],
      ['funcion', 'TT3', eS ? { A: exEsc(eS, 2) } : { v: largoResta }],
      ['sinDos', 'TT1', eD ? { A: eD } : { v: largo / 2 }]
    ]);
    return { A, B, M, D, PA, PB, suma, resta, largo: largo + 0, largoResta: largoResta + 0, direccionResta: M + 90,
      alturaSuma: suma.y, abscisaSuma: suma.x, alturaResta: resta.y, abscisaResta: resta.x,
      pendiente: Math.abs(suma.x) < 1e-12 ? null : suma.y / suma.x,
      direccion: Object.assign({ valor: M, texto: grados(M) }, dir),
      largoExacto: Object.assign(pub(L), lar) };
  }

  // ---------- Pulsaciones: dos ondas de frecuencias cercanas ----------
  function cerosCos(k, t0, t1) {   // t en [t0; t1] con cos(k t) = 0, k > 0
    const out = [];
    for (let j = Math.ceil((k * t0 - 90) / 180 - 1e-9); (90 + 180 * j) / k <= t1 + 1e-9; j++) {
      const t = (90 + 180 * j) / k; if (t >= t0 - 1e-9) out.push(t + 0);
    }
    return out;
  }
  function pulsos(o) {
    o = o || {};
    const p = numero(o.p, 'p'), q = numero(o.q, 'q');
    if (!(p > q && q > 0)) throw new Error('hace falta p > q > 0');
    const t0 = o.t0 === undefined ? 0 : numero(o.t0, 't0'), t1 = o.t1 === undefined ? 360 : numero(o.t1, 't1');
    if (!(t1 > t0)) throw new Error('t1 debe ser mayor que t0');
    const n = o.n === undefined ? 721 : numero(o.n, 'n');
    if (!Number.isInteger(n) || n < 2) throw new Error('n debe ser un entero mayor o igual a 2');
    const M = (p + q) / 2, D = (p - q) / 2;
    const muestras = [];
    for (let i = 0; i < n; i++) {
      const t = t0 + (t1 - t0) * i / (n - 1), y1 = Math.sin(p * t * GR), y2 = Math.sin(q * t * GR);
      muestras.push({ t, y1: y1 + 0, y2: y2 + 0, suma: y1 + y2 + 0, env: 2 * Math.cos(D * t * GR) + 0 });
    }
    const ceros = cerosCos(D, t0, t1), v = ceros.length;
    const E = errores(v, [
      ['intercambia', 'TT2', cerosCos(M, t0, t1).length],
      ['sinDividir', 'TT4', cerosCos(p - q, t0, t1).length],
      ['nunca', 'TT12', 0]
    ]);
    for (const e of Object.values(E.errores)) e.texto = String(e.valor);
    return Object.assign({ valor: v, texto: String(v), ceros, M, D, p, q, muestras }, E);
  }

  function exacto(t) { const A = exDe(t); return { valor: exValor(A), texto: exTexto(A) }; }

  return { ERRORES, texto, normalizar, razon, sumaAProducto, productoASuma, cociente, simplificar, agrupar, serie, rombo, pulsos, exacto };
});
