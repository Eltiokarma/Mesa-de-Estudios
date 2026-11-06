/*
 * Motor de «Alturas que no se suman»: identidades trigonométricas fundamentales, arcos compuestos y arcos múltiples.
 *
 * Aquí vive toda la matemática de la plantilla (regla 1 de CLAUDE.md). No toca el DOM:
 * funciona igual en el navegador (window.MotorIdTrig) y en Node (require('./motor.js')),
 * donde lo prueban casos.json y papel.json.
 *
 * Ángulos en grados sexagesimales. Los valores de los ángulos notables salen EXACTOS, como suma de términos
 * (n/d)·√r: '3/5', '√2/4', '(√6 + √2)/4', '4√2/9'. Convención de academia, igual que en circunferencia-trig:
 * sen 37° = 3/5 y sen 16° = 7/25 (el ángulo de verdad es 36,87° y 16,26°); con ella 37° + 16° = 53° sale exacto.
 *
 *   razon(fn, g)                         sen, cos, tan, cot, sec o csc de g: exacto si g reduce a un notable
 *   punto(g)                             (cos g; sen g) en la circunferencia de radio 1 (los notables, de academia)
 *   pitagorica({ sen | cos, cuadrante }) la otra razón con sen² + cos² = 1, el signo y los cuadritos que se cuentan
 *   secDesdeTan({ tan, cuadrante })      1 + tan² = sec²: el triángulo dividido entre cos x
 *   cuadrado({ fn, g })                  sen² g = (sen g)², que no es sen(g²) (TR17)
 *   suma({ a, b, fn, op })               sen, cos de a ± b con las piezas del rectángulo (TR16)
 *   sumaTan({ ta, tb, op })              tan(a ± b) con tangentes racionales y el punto de la cuadrícula
 *   cadena({ a, b })                     alturas de a, b y a + b para la escena que se arrastra (Math, sin academia)
 *   doble({ sen | cos, cuadrante })      sen 2x, cos 2x (tres formas) y tan 2x, con los cuadritos de cos 2x
 *   mitad({ cos, desde, hasta })         sen(x/2) y cos(x/2) con el signo del cuadrante de x/2 (TR12)
 *   triple({ sen })                      sen 3x = 3 sen x − 4 sen³x
 *   identidad({ izq, der })              ¿dos expresiones en x son iguales? (se prueban en muchos ángulos)
 *   exacto(x), texto(v), fraccion(t)     números exactos n·√r/d y sus sumas
 *
 * Cada resultado que es la respuesta de una predicción trae 'errores': nombre → { id, valor, texto }, con lo que
 * dan los errores típicos de docs/investigacion/trigonometria-ideas-erroneas.md (TR12, TR16, TR17) y los nuestros
 * (ID1 a ID15, hipótesis). Un error que en ese caso da lo mismo que la respuesta correcta se quita y su nombre
 * queda en 'coinciden'.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorIdTrig = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const GR = Math.PI / 180, TOL = 1e-9;
  const FNS = ['sen', 'cos', 'tan', 'cot', 'sec', 'csc'];

  // Los errores típicos (ids para la medición). TR: del informe; ID: hipótesis nuestras.
  const ERRORES = {
    TR12: 'signo por cuadrante: el seno o el coseno como distancia, sin signo',
    TR16: 'linealidad: sen(a + b) = sen a + sen b, sen 2x = 2 sen x, cos(x/2) = (cos x)/2',
    TR17: 'notación: sen²x leído como sen(x²)',
    ID1: 'la pitagórica sin cuadrados: sen x + cos x = 1 (o 1 + tan x = sec x)',
    ID2: 'olvida sacar la raíz: cos x = 1 − sen²x',
    ID3: 'cambia una razón por su recíproca: cos x = 1/sen x, sec x = cos x',
    ID4: 'signo cambiado en arcos compuestos: cos(a + b) con +, sen(a + b) con −',
    ID5: 'usa la fórmula del coseno para el seno (o al revés)',
    ID6: 'multiplica las razones: sen(a + b) = sen a · sen b',
    ID7: 'cos 2x = cos²x + sen²x',
    ID8: 'olvida el 2: cos 2x = 1 − sen²x',
    ID9: 'el cuadrado como doble: sen²x = 2 sen x',
    ID10: 'sen²x leído como sen 2x',
    ID11: 'tan(a + b) con + en el denominador',
    ID12: 'sen 3x = 3 sen x + 4 sen³x (signo)',
    ID13: 'sen 3x = 3 sen x − 4 sen x (sin el cubo)',
    ID14: 'en el ángulo mitad, usa la fórmula del seno para el coseno',
    ID15: 'olvida el cuadrado: cos 2x = 1 − 2 sen x'
  };

  function numero(x, que) {
    if (typeof x !== 'number' || !Number.isFinite(x)) throw new Error(`${que} debe ser un número`);
    return x;
  }

  // ---------- Fracciones ----------
  function mcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; }
  function fr(n, d) {
    if (d === undefined) d = 1;
    if (!Number.isInteger(n) || !Number.isInteger(d)) throw new Error('la fracción debe tener números enteros');
    if (d === 0) throw new Error('denominador cero');
    if (d < 0) { n = -n; d = -d; }
    const g = mcd(n, d) || 1;
    return { n: n / g + 0, d: d / g };
  }
  // '3/5', '−3/5', '-3/5', 0.6 (si es una fracción simple) o { n, d }
  function fraccion(t) {
    if (t && typeof t === 'object' && 'n' in t) return fr(t.n, t.d);
    if (typeof t === 'number') {
      numero(t, 'el número');
      for (let q = 1; q <= 1000; q++) { const p = Math.round(t * q); if (Math.abs(p / q - t) < 1e-12) return fr(p, q); }
      throw new Error(`${t} no es una fracción simple: escríbelo como texto 'n/d'`);
    }
    if (typeof t !== 'string') throw new Error('se esperaba una fracción como texto (\'3/5\')');
    const m = t.trim().replace('−', '-').match(/^(-?\d+)(?:\/(\d+))?$/);
    if (!m) throw new Error(`'${t}' no es una fracción (usa 'n/d')`);
    return fr(Number(m[1]), m[2] ? Number(m[2]) : 1);
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
  const exF = f => ex(f.n, f.d, 1);
  const exSuma = (A, B) => normal(A.concat(B));
  const exNeg = A => A.map(t => ({ n: -t.n, d: t.d, r: t.r }));
  const exResta = (A, B) => exSuma(A, exNeg(B));
  function exProd(A, B) {
    const out = [];
    for (const a of A) for (const b of B) out.push({ n: a.n * b.n, d: a.d * b.d, r: a.r * b.r });
    return normal(out);
  }
  const exEsc = (A, f) => exProd(A, exF(f));
  const exValor = A => A.reduce((s, t) => s + t.n * Math.sqrt(t.r) / t.d, 0) + 0;
  const exRacional = A => (A.length === 0 ? fr(0, 1) : A.length === 1 && A[0].r === 1 ? fr(A[0].n, A[0].d) : null);
  // √(n/d) = √(n·d)/d, exacto
  function exRaiz(f) {
    if (f.n < 0) throw new Error('raíz de un número negativo');
    if (f.n === 0) return [];
    return ex(1, f.d, f.n * f.d);
  }
  // Divide entre un exacto de un solo término (para tan = sen/cos y las recíprocas).
  function exDiv(A, B) {
    if (B.length === 0) return null;
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
    const L = A.reduce((l, t) => l * t.d / mcd(l, t.d), 1);
    // los radicales primero (de mayor a menor) y el entero al final: (√6 + √2)/4, (√2 + 1)/2
    const orden = A.filter(t => t.r !== 1).concat(A.filter(t => t.r === 1));
    // si hay algún término positivo, va primero: (√2 − √3)/2, (1 − √3)/2
    const kp = orden.findIndex(t => t.n > 0);
    if (kp > 0) orden.unshift(orden.splice(kp, 1)[0]);
    let s = '';
    orden.forEach((t, i) => {
      const n = t.n * L / t.d, m = Math.abs(n);
      s += i === 0 ? (n < 0 ? '−' : '') + raiz(m, t.r) : (n < 0 ? ' − ' : ' + ') + raiz(m, t.r);
    });
    return L === 1 ? s : `(${s})/${L}`;
  }
  // Un exacto «público»: { valor, texto, terminos }
  const pub = A => (A === null ? null : { valor: exValor(A), texto: exTexto(A), terminos: A.map(t => ({ ...t })) });
  // De una entrada: fracción ('3/5', '-3/5') o un radical de un solo término ('√2/2', '-√3/2', '2√2/3').
  function exDe(t) {
    if (typeof t === 'string') {
      const m = t.trim().replace('−', '-').match(/^(-?)(\d*)√(\d+)(?:\/(\d+))?$/);
      if (m) return ex((m[1] ? -1 : 1) * (m[2] ? Number(m[2]) : 1), m[4] ? Number(m[4]) : 1, Number(m[3]));
    }
    return exF(fraccion(t));
  }

  // Coma decimal, signo menos tipográfico
  function texto(v, dec) {
    if (v && typeof v === 'object' && v.texto) return v.texto;
    if (!Number.isFinite(v)) return '—';
    const p = Math.pow(10, dec === undefined ? 2 : dec), r = Math.round(v * p) / p + 0;
    return (r < 0 ? '−' : '') + String(Math.abs(r)).replace('.', ',');
  }

  // ---------- Ángulos notables (primer cuadrante, valores de academia) ----------
  const NOT = {
    0: [ex(0), ex(1)], 15: [ex(1, 4, 6).concat(ex(-1, 4, 2)), ex(1, 4, 6).concat(ex(1, 4, 2))],
    16: [ex(7, 25), ex(24, 25)], 30: [ex(1, 2), ex(1, 2, 3)], 37: [ex(3, 5), ex(4, 5)], 45: [ex(1, 2, 2), ex(1, 2, 2)],
    53: [ex(4, 5), ex(3, 5)], 60: [ex(1, 2, 3), ex(1, 2)], 74: [ex(24, 25), ex(7, 25)],
    75: [ex(1, 4, 6).concat(ex(1, 4, 2)), ex(1, 4, 6).concat(ex(-1, 4, 2))], 90: [ex(1), ex(0)]
  };
  for (const k of Object.keys(NOT)) NOT[k] = NOT[k].map(normal);
  const NOTABLES = Object.keys(NOT).map(Number);
  function normalizar(g) { const r = ((g % 360) + 360) % 360; return Math.abs(r - 360) < 1e-9 ? 0 : r + 0; }
  function cuadranteDe(g) {
    const r = normalizar(g);
    if ([0, 90, 180, 270].some(q => Math.abs(r - q) < 1e-9)) return 0;   // sobre un eje
    return r < 90 ? 1 : r < 180 ? 2 : r < 270 ? 3 : 4;
  }
  // sen y cos exactos de g, o null si g no reduce a un notable
  function senCosExacto(g) {
    numero(g, 'el ángulo');
    const r = normalizar(g);
    let ref, ss, sc;
    if (r <= 90) { ref = r; ss = 1; sc = 1; } else if (r <= 180) { ref = 180 - r; ss = 1; sc = -1; }
    else if (r <= 270) { ref = r - 180; ss = -1; sc = -1; } else { ref = 360 - r; ss = -1; sc = 1; }
    const k = NOTABLES.find(n => Math.abs(n - ref) < 1e-9);
    if (k === undefined) return null;
    return { sen: ss > 0 ? NOT[k][0] : exNeg(NOT[k][0]), cos: sc > 0 ? NOT[k][1] : exNeg(NOT[k][1]) };
  }
  function razonExacta(fn, g) {
    const e = senCosExacto(g); if (!e) return undefined;
    switch (fn) {
      case 'sen': return e.sen;
      case 'cos': return e.cos;
      case 'tan': return exDiv(e.sen, e.cos);
      case 'cot': return exDiv(e.cos, e.sen);
      case 'sec': return exDiv(ex(1), e.cos);
      case 'csc': return exDiv(ex(1), e.sen);
    }
    return undefined;
  }
  function razon(fn, g) {
    if (!FNS.includes(fn)) throw new Error(`función desconocida: ${fn} (usa ${FNS.join(', ')})`);
    numero(g, 'el ángulo');
    const e = razonExacta(fn, g);
    if (e !== undefined) return e === null ? { valor: null, texto: 'no existe', existe: false } : Object.assign(pub(e), { existe: true, exacto: true });
    const s = Math.sin(g * GR), c = Math.cos(g * GR);
    const v = { sen: s, cos: c, tan: s / c, cot: c / s, sec: 1 / c, csc: 1 / s }[fn];
    return { valor: v + 0, texto: texto(v), existe: true, exacto: false };
  }
  function punto(g) {
    const e = senCosExacto(g);
    if (e) return { x: exValor(e.cos), y: exValor(e.sen), exacto: true };
    return { x: Math.cos(g * GR) + 0, y: Math.sin(g * GR) + 0, exacto: false };
  }

  // ---------- Errores: quitar los que coinciden con la correcta ----------
  const igual = (a, b) => Math.abs(a - b) <= TOL * Math.max(1, Math.abs(b));
  function errores(correcto, lista) {
    const out = {}, coinciden = [];
    for (const [k, id, A] of lista) {
      if (A === null || A === undefined) continue;
      const v = Array.isArray(A) ? exValor(A) : A.valor !== undefined ? A.valor : A;
      if (igual(v, correcto)) { coinciden.push(k); continue; }
      out[k] = { id, valor: v, texto: Array.isArray(A) ? exTexto(A) : texto(v, 4) };
    }
    return { errores: out, coinciden };
  }
  function cuadranteValido(c) {
    if (c === undefined) return 1;
    if (![1, 2, 3, 4].includes(c)) throw new Error('el cuadrante debe ser 1, 2, 3 o 4');
    return c;
  }
  const SIGNOS = { sen: [0, 1, 1, -1, -1], cos: [0, 1, -1, -1, 1], tan: [0, 1, -1, 1, -1] };

  // ---------- Identidades fundamentales ----------
  // Con sen (o cos) de x y el cuadrante, la otra razón: sen² + cos² = 1. Si la fracción es p/q, el cuadrado sobre la
  // hipotenusa tiene q² cuadritos de lado 1/q: p² son de sen² y q² − p² de cos².
  function pitagorica(o) {
    o = o || {};
    const dado = o.sen !== undefined ? 'sen' : o.cos !== undefined ? 'cos' : null;
    if (!dado || (o.sen !== undefined && o.cos !== undefined)) throw new Error('da sen o cos (uno solo)');
    const D = exDe(o[dado]), vd = exValor(D);
    if (Math.abs(vd) > 1 + 1e-12) throw new Error(`${dado} x debe estar entre −1 y 1`);
    const c = cuadranteValido(o.cuadrante), pide = dado === 'sen' ? 'cos' : 'sen';
    const s = SIGNOS[pide][c], sd = SIGNOS[dado][c];
    if (vd !== 0 && Math.sign(vd) !== sd) throw new Error(`en el cuadrante ${c}, ${dado} x tiene signo ${sd > 0 ? '+' : '−'}`);
    const d2 = exRacional(exProd(D, D));
    if (!d2) throw new Error(`${dado} x debe ser una fracción o un radical de un solo término`);
    const resto = fr(d2.d - d2.n, d2.d);
    const A = exEsc(exRaiz(resto), fr(s, 1)), v = exValor(A);
    const absD = vd < 0 ? exNeg(D) : D;
    const E = errores(v, [
      ['lineal', 'ID1', exEsc(exResta(ex(1), absD), fr(s, 1))],     // cos x = 1 − sen x
      ['sinRaiz', 'ID2', exF(fr(s * resto.n, resto.d))],            // cos x = 1 − sen²x
      ['reciproca', 'ID3', vd === 0 ? null : exDiv(ex(1), D)]       // cos x = 1/sen x
    ]);
    const f = exRacional(D), racional = exRacional(A);
    return Object.assign(pub(A), { dado, pide, cuadrante: c, signo: s, cuadrado: pub(exF(resto)),
      celdas: f ? { lado: f.d, total: f.d * f.d, [dado]: f.n * f.n, [pide]: f.d * f.d - f.n * f.n } : null,
      ladoEnCeldas: f && racional ? Math.abs(racional.n) * f.d / racional.d : null,
      tan: pub(dado === 'sen' ? exDiv(D, A) : exDiv(A, D)) }, E);
  }
  // 1 + tan²x = sec²x: el triángulo de hipotenusa 1 dividido entre cos x tiene catetos 1 y tan x, e hipotenusa sec x.
  function secDesdeTan(o) {
    o = o || {};
    if (o.tan === undefined) throw new Error('falta tan');
    const t = fraccion(o.tan), c = cuadranteValido(o.cuadrante);
    if (t.n !== 0 && Math.sign(t.n) !== SIGNOS.tan[c]) throw new Error(`en el cuadrante ${c}, tan x tiene signo ${SIGNOS.tan[c] > 0 ? '+' : '−'}`);
    const s = SIGNOS.cos[c], sec2 = fr(t.d * t.d + t.n * t.n, t.d * t.d);
    const A = exEsc(exRaiz(sec2), fr(s, 1)), v = exValor(A);
    const E = errores(v, [
      ['lineal', 'ID1', exF(fr(s * (t.d + Math.abs(t.n)), t.d))],     // sec x = 1 + tan x
      ['sinRaiz', 'ID2', exF(fr(s * sec2.n, sec2.d))],                // sec x = 1 + tan²x
      ['reciproca', 'ID3', exDiv(ex(1), A)]                           // da cos x = 1/sec x
    ]);
    return Object.assign(pub(A), { cuadrante: c, sec2: pub(exF(sec2)), cos: pub(exDiv(ex(1), A)),
      celdas: { lado: t.d, cateto: t.d * t.d, tan: t.n * t.n, sec: t.d * t.d + t.n * t.n } }, E);
  }
  // sen²g = (sen g)²; no es sen(g²) (TR17), ni 2 sen g (ID9), ni sen 2g (ID10)
  function cuadrado(o) {
    o = o || {};
    const fn = o.fn || 'sen';
    if (!['sen', 'cos'].includes(fn)) throw new Error('fn debe ser sen o cos');
    const g = numero(o.g, 'el ángulo');
    const e = razonExacta(fn, g);
    const R = e !== undefined && e !== null ? exProd(e, e) : null;
    const v = R ? exValor(R) : Math.pow(fn === 'sen' ? Math.sin(g * GR) : Math.cos(g * GR), 2);
    const exOnum = (h, k) => { const z = razonExacta(fn, h); return z !== undefined && z !== null ? (k ? exEsc(z, fr(k, 1)) : z) : (k || 1) * (fn === 'sen' ? Math.sin(h * GR) : Math.cos(h * GR)); };
    const E = errores(v, [
      ['delCuadrado', 'TR17', exOnum(g * g)],      // sen(g²)
      ['doble', 'ID9', exOnum(g, 2)],              // 2 sen g
      ['senDoble', 'ID10', exOnum(2 * g)]          // sen 2g
    ]);
    return Object.assign(R ? pub(R) : { valor: v, texto: texto(v, 4) }, { fn, g, gCuadrado: g * g, reducido: normalizar(g * g) }, E);
  }

  // ---------- Arcos compuestos ----------
  // sen(a ± b) = sen a cos b ± cos a sen b;  cos(a ± b) = cos a cos b ∓ sen a sen b
  // En el rectángulo: la altura de a + b es (sen a)(cos b) + (cos a)(sen b), y su abscisa (cos a)(cos b) − (sen a)(sen b).
  function suma(o) {
    o = o || {};
    const a = numero(o.a, 'el ángulo a'), b = numero(o.b, 'el ángulo b'), fn = o.fn || 'sen', op = o.op || '+';
    if (!['sen', 'cos'].includes(fn)) throw new Error('fn debe ser sen o cos (para tan usa sumaTan)');
    if (!['+', '−', '-'].includes(op)) throw new Error("op debe ser '+' o '−'");
    const mas = op === '+', A = senCosExacto(a), B = senCosExacto(b);
    if (!A || !B) {   // sin notables: numérico
      const sa = Math.sin(a * GR), ca = Math.cos(a * GR), sb = Math.sin(b * GR), cb = Math.cos(b * GR);
      const v = fn === 'sen' ? sa * cb + (mas ? 1 : -1) * ca * sb : ca * cb - (mas ? 1 : -1) * sa * sb;
      const E = errores(v, fn === 'sen'
        ? [['lineal', 'TR16', mas ? sa + sb : sa - sb], ['signo', 'ID4', sa * cb - (mas ? 1 : -1) * ca * sb], ['formulaCoseno', 'ID5', ca * cb - (mas ? 1 : -1) * sa * sb], ['producto', 'ID6', sa * sb]]
        : [['lineal', 'TR16', mas ? ca + cb : ca - cb], ['signo', 'ID4', ca * cb + (mas ? 1 : -1) * sa * sb], ['formulaSeno', 'ID5', sa * cb + (mas ? 1 : -1) * ca * sb], ['producto', 'ID6', ca * cb]]);
      return Object.assign({ valor: v + 0, texto: texto(v, 4), exacto: false, fn, a, b, op: mas ? '+' : '−', angulo: mas ? a + b : a - b }, E);
    }
    const sAcB = exProd(A.sen, B.cos), cAsB = exProd(A.cos, B.sen), cAcB = exProd(A.cos, B.cos), sAsB = exProd(A.sen, B.sen);
    const pm = (X, Y, s) => (s ? exSuma(X, Y) : exResta(X, Y));
    const R = fn === 'sen' ? pm(sAcB, cAsB, mas) : pm(cAcB, sAsB, !mas);
    const v = exValor(R);
    const E = errores(v, fn === 'sen'
      ? [['lineal', 'TR16', pm(A.sen, B.sen, mas)], ['signo', 'ID4', pm(sAcB, cAsB, !mas)], ['formulaCoseno', 'ID5', pm(cAcB, sAsB, !mas)], ['producto', 'ID6', sAsB]]
      : [['lineal', 'TR16', pm(A.cos, B.cos, mas)], ['signo', 'ID4', pm(cAcB, sAsB, mas)], ['formulaSeno', 'ID5', pm(sAcB, cAsB, mas)], ['producto', 'ID6', cAcB]]);
    const ang = mas ? a + b : a - b, directo = senCosExacto(ang);
    return Object.assign(pub(R), { exacto: true, fn, a, b, op: mas ? '+' : '−', angulo: ang,
      sena: pub(A.sen), cosa: pub(A.cos), senb: pub(B.sen), cosb: pub(B.cos),
      piezas: { senAcosB: pub(sAcB), cosAsenB: pub(cAsB), cosAcosB: pub(cAcB), senAsenB: pub(sAsB) },
      // si a ± b también es notable, el valor de la tabla (para comprobar)
      tabla: directo ? pub(directo[fn]) : null,
      sumaDe: pub(fn === 'sen' ? pm(A.sen, B.sen, mas) : pm(A.cos, B.cos, mas)) }, E);
  }
  // tan(a ± b) = (tan a ± tan b)/(1 ∓ tan a · tan b), con tangentes racionales. Si tan a = p/q, el ángulo a es la
  // dirección (q; p) en la cuadrícula; a + b es la del producto (q₁ + p₁i)(q₂ + p₂i).
  function sumaTan(o) {
    o = o || {};
    const ta = fraccion(o.ta), tb = fraccion(o.tb), op = o.op || '+', mas = op === '+';
    if (!['+', '−', '-'].includes(op)) throw new Error("op debe ser '+' o '−'");
    const num = fr(ta.n * tb.d + (mas ? 1 : -1) * tb.n * ta.d, ta.d * tb.d);
    const prod = fr(ta.n * tb.n, ta.d * tb.d);
    const den = fr(prod.d + (mas ? -1 : 1) * prod.n, prod.d);
    // direcciones en la cuadrícula (con b > 0 hacia la izquierda de a; con '−' hacia la derecha)
    const va = [ta.d, ta.n], vb = [tb.d, mas ? tb.n : -tb.n];
    const vs = [va[0] * vb[0] - va[1] * vb[1], va[0] * vb[1] + va[1] * vb[0]];
    const ang = Math.atan2(vs[1], vs[0]) / GR, angulo = Math.abs(ang - Math.round(ang)) < 1e-9 ? Math.round(ang) : ang;
    if (den.n === 0) return { valor: null, texto: 'no existe', existe: false, angulo, direccion: vs, errores: {}, coinciden: [] };   // a ± b = ±90°
    const R = fr(num.n * den.d, num.d * den.n), v = R.n / R.d;
    const denMal = fr(prod.d + (mas ? 1 : -1) * prod.n, prod.d);
    const E = errores(v, [
      ['lineal', 'TR16', exF(num)],
      ['signo', 'ID11', denMal.n === 0 ? null : exF(fr(num.n * denMal.d, num.d * denMal.n))],
      ['producto', 'ID6', exF(prod)]
    ]);
    return Object.assign(pub(exF(R)), { existe: true, ta: pub(exF(ta)), tb: pub(exF(tb)), op: mas ? '+' : '−', numerador: pub(exF(num)), denominador: pub(exF(den)),
      direccionA: va, direccionB: vb, direccion: vs, angulo,
      // vs = m·(dirección de a) + n·(perpendicular de a): los pasos que se dan en la cuadrícula
      pasos: { largo: vb[0], alto: vb[1] } }, E);
  }
  // Para la escena que se arrastra: alturas (senos) y abscisas de a, b y a + b, con cualquier ángulo. Es la geometría
  // de verdad (Math), sin la convención de academia: con ella, sen 5° + sen 11° quedaría por debajo de «sen 16° = 7/25».
  function cadena(o) {
    o = o || {};
    const a = numero(o.a, 'el ángulo a'), b = numero(o.b, 'el ángulo b');
    const P = g => ({ x: Math.cos(g * GR) + 0, y: Math.sin(g * GR) + 0 });
    const A = P(a), B = P(b), S = P(a + b);
    return { a, b, suma: a + b, sena: A.y, senb: B.y, senSuma: S.y, cosa: A.x, cosb: B.x, cosSuma: S.x,
      sumaDeSenos: A.y + B.y, diferencia: A.y + B.y - S.y, pasaDeUno: A.y + B.y > 1 + 1e-12,
      formula: A.y * B.x + A.x * B.y, piezas: { senAcosB: A.y * B.x, cosAsenB: A.x * B.y } };
  }

  // ---------- Arcos múltiples ----------
  // Con sen x (o cos x) y el cuadrante de x: sen 2x = 2 sen x cos x; cos 2x = cos²x − sen²x = 1 − 2sen²x = 2cos²x − 1.
  function doble(o) {
    o = o || {};
    const P = pitagorica({ sen: o.sen, cos: o.cos, cuadrante: o.cuadrante });
    const S = o.sen !== undefined ? exDe(o.sen) : P.terminos, C = o.cos !== undefined ? exDe(o.cos) : P.terminos;
    const s2 = exProd(S, S), c2 = exProd(C, C);
    const sen2 = exEsc(exProd(S, C), fr(2, 1));
    const f1 = exResta(c2, s2), f2 = exResta(ex(1), exEsc(s2, fr(2, 1))), f3 = exResta(exEsc(c2, fr(2, 1)), ex(1));
    const tan2 = f1.length === 0 ? { valor: null, texto: 'no existe', existe: false } : pub(exDiv(sen2, f1));   // null si cos 2x no es de un solo término
    const vs = exValor(sen2), vc = exValor(f1);
    const Es = errores(vs, [
      ['lineal', 'TR16', exEsc(S, fr(2, 1))],              // sen 2x = 2 sen x
      ['formulaCoseno', 'ID5', f1],                        // usa cos²x − sen²x
      ['dosSenCuadrado', 'ID9', exEsc(s2, fr(2, 1))]       // 2 sen²x
    ]);
    const Ec = errores(vc, [
      ['pitagorica', 'ID7', exSuma(c2, s2)],               // cos²x + sen²x
      ['sinDos', 'ID8', exResta(ex(1), s2)],               // 1 − sen²x
      ['sinCuadrado', 'ID15', exResta(ex(1), exEsc(S, fr(2, 1)))],   // 1 − 2 sen x
      ['lineal', 'TR16', exEsc(C, fr(2, 1))]               // 2 cos x
    ]);
    const fs = exRacional(S), cel = fs ? { lado: fs.d, total: fs.d * fs.d, sen2: fs.n * fs.n, cos2: fs.d * fs.d - fs.n * fs.n, cos2x: fs.d * fs.d - 2 * fs.n * fs.n } : null;
    return { cuadrante: P.cuadrante, sen: pub(S), cos: pub(C), sen2: pub(s2), cos2: pub(c2),
      senDoble: Object.assign(pub(sen2), Es),
      cosDoble: Object.assign(pub(f1), { formas: [pub(f1), pub(f2), pub(f3)] }, Ec),
      tanDoble: tan2, celdas: cel };
  }
  // cos(x/2) = ±√((1 + cos x)/2), sen(x/2) = ±√((1 − cos x)/2); el signo lo da el cuadrante de x/2.
  // x está en ⟨desde; hasta⟩ (grados); x/2 tiene que caer en un solo cuadrante.
  function mitad(o) {
    o = o || {};
    const c = fraccion(o.cos);
    if (Math.abs(c.n) > c.d) throw new Error('cos x debe estar entre −1 y 1');
    const desde = o.desde === undefined ? 0 : numero(o.desde, 'desde'), hasta = o.hasta === undefined ? 90 : numero(o.hasta, 'hasta');
    if (!(hasta > desde)) throw new Error('hasta debe ser mayor que desde');
    const m0 = desde / 2, m1 = hasta / 2;
    const q = cuadranteDe((m0 + m1) / 2);
    if (q === 0 || m1 - m0 > 90 || cuadranteDe(m0 + 1e-6) !== q || cuadranteDe(m1 - 1e-6) !== q) throw new Error('x/2 tiene que caer en un solo cuadrante');
    // cos x tiene que ser posible en ⟨desde; hasta⟩
    const qx0 = cuadranteDe((desde + hasta) / 2);
    if (hasta - desde <= 90 && c.n !== 0 && qx0 && Math.sign(c.n) !== SIGNOS.cos[qx0]) throw new Error(`con x en ⟨${desde}°; ${hasta}°⟩, cos x no puede tener ese signo`);
    const sc = SIGNOS.cos[q], ss = SIGNOS.sen[q];
    const pc = fr(c.d + c.n, 2 * c.d), ps = fr(c.d - c.n, 2 * c.d);
    const C = exEsc(exRaiz(pc), fr(sc, 1)), S = exEsc(exRaiz(ps), fr(ss, 1));
    const vc = exValor(C);
    const E = errores(vc, [
      ['signo', 'TR12', exNeg(C)],                          // el mismo número con el otro signo
      ['lineal', 'TR16', exF(fr(c.n, 2 * c.d))],           // cos(x/2) = (cos x)/2
      ['sinRaiz', 'ID2', exF(fr(sc * pc.n, pc.d))],        // (1 + cos x)/2, sin la raíz
      ['formulaSeno', 'ID14', exEsc(exRaiz(ps), fr(sc, 1))]   // √((1 − cos x)/2) con el signo del coseno
    ]);
    const xRef = Math.acos(c.n / c.d) / GR;
    return Object.assign(pub(C), { cuadranteMitad: q, signoCos: sc, signoSen: ss, rangoMitad: [m0, m1],
      senMitad: pub(S), dentro: pub(exF(pc)), cosx: pub(exF(c)), xReferencia: xRef }, E);
  }
  // sen 3x = 3 sen x − 4 sen³x
  function triple(o) {
    o = o || {};
    const S = exDe(o.sen), vs = exValor(S);
    if (Math.abs(vs) > 1 + 1e-12) throw new Error('sen x debe estar entre −1 y 1');
    const S3 = exProd(S, exProd(S, S));
    const R = exResta(exEsc(S, fr(3, 1)), exEsc(S3, fr(4, 1))), v = exValor(R);
    const E = errores(v, [
      ['lineal', 'TR16', exEsc(S, fr(3, 1))],                               // 3 sen x
      ['signo', 'ID12', exSuma(exEsc(S, fr(3, 1)), exEsc(S3, fr(4, 1)))],   // 3 sen x + 4 sen³x
      ['sinCubo', 'ID13', exResta(exEsc(S, fr(3, 1)), exEsc(S, fr(4, 1)))]  // 3 sen x − 4 sen x
    ]);
    return Object.assign(pub(R), { sen: pub(S), sen3: pub(S3), x: Math.asin(vs) / GR }, E);
  }

  // ---------- ¿Son iguales dos expresiones? ----------
  // Gramática pequeña: números, x, + − * / ^, paréntesis y sen cos tan cot sec csc con su argumento entre paréntesis;
  // 'sen^2(x)' es (sen x)². Multiplicación implícita entre un número y lo que sigue: 2sen(x), 2x.
  function analizar(t) {
    const s = String(t).replace(/−/g, '-').replace(/·/g, '*').replace(/\s+/g, '');
    let i = 0;
    const ver = () => s[i], comer = c => { if (s[i] !== c) throw new Error(`expresión mal escrita cerca de «${s.slice(i)}» en «${t}»`); i++; };
    function primario() {
      const c = ver();
      if (c === '(') { comer('('); const e = expr(); comer(')'); return e; }
      if (c === '-') { comer('-'); const e = potencia(); return x => -e(x); }
      if (/\d/.test(c)) { let j = i; while (/[\d.]/.test(s[j] || '')) j++; const v = Number(s.slice(i, j)); i = j; return () => v; }
      if (c === 'x') { comer('x'); return x => x; }
      const fn = FNS.find(f => s.startsWith(f, i));
      if (fn) {
        i += fn.length; let exp = 1;
        if (ver() === '^') { comer('^'); let j = i; while (/\d/.test(s[j] || '')) j++; exp = Number(s.slice(i, j)); i = j; }
        comer('('); const arg = expr(); comer(')');
        const f = { sen: Math.sin, cos: Math.cos, tan: Math.tan, cot: z => 1 / Math.tan(z), sec: z => 1 / Math.cos(z), csc: z => 1 / Math.sin(z) }[fn];
        return x => Math.pow(f(arg(x) * GR), exp);
      }
      throw new Error(`no entiendo «${s.slice(i)}» en «${t}»`);
    }
    function potencia() { const b = primario(); if (ver() === '^') { comer('^'); const e = potencia(); return x => Math.pow(b(x), e(x)); } return b; }
    function termino() {
      let a = potencia();
      for (;;) {
        if (ver() === '*') { comer('*'); const b = potencia(), p = a; a = x => p(x) * b(x); }
        else if (ver() === '/') { comer('/'); const b = potencia(), p = a; a = x => p(x) / b(x); }
        else if (ver() && /[a-z(]/.test(ver())) { const b = potencia(), p = a; a = x => p(x) * b(x); }   // implícita
        else return a;
      }
    }
    function expr() {
      let a = termino();
      for (;;) {
        if (ver() === '+') { comer('+'); const b = termino(), p = a; a = x => p(x) + b(x); }
        else if (ver() === '-') { comer('-'); const b = termino(), p = a; a = x => p(x) - b(x); }
        else return a;
      }
    }
    const f = expr();
    if (i !== s.length) throw new Error(`sobra «${s.slice(i)}» en «${t}»`);
    return f;
  }
  function identidad(o) {
    o = o || {};
    if (typeof o.izq !== 'string' || typeof o.der !== 'string') throw new Error('izq y der deben ser expresiones (texto)');
    const L = analizar(o.izq), R = analizar(o.der);
    const pruebas = [7, 19, 23.5, 41, 58, 66.6, 83, 101, 127, 163, 199, 222, 251, 288, 311, 347];
    let usados = 0, contraejemplo = null;
    for (const g of pruebas) {
      const l = L(g), r = R(g);
      if (!Number.isFinite(l) || !Number.isFinite(r) || Math.abs(l) > 1e6 || Math.abs(r) > 1e6) continue;
      usados++;
      if (Math.abs(l - r) > 1e-9 * Math.max(1, Math.abs(l), Math.abs(r))) { contraejemplo = { x: g, izq: l, der: r }; break; }
    }
    if (usados < 5 && !contraejemplo) throw new Error('casi ningún ángulo de prueba sirve: revisa la expresión');
    return { es: !contraejemplo, contraejemplo, probados: usados };
  }

  function exacto(x) {   // para el HTML: un número exacto a partir de un texto '3/5' o una fracción
    return pub(exDe(x));
  }

  return { FNS, ERRORES, NOTABLES, fraccion, exacto, texto, normalizar, cuadranteDe, razon, punto,
    pitagorica, secDesdeTan, cuadrado, suma, sumaTan, cadena, doble, mitad, triple, identidad };
});
