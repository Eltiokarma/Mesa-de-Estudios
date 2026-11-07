/*
 * Motor de «El tablero de los caminos»: binomio de Newton. Factorial, número combinatorio C(n, k), triángulo de
 * Pascal y sus propiedades, desarrollo de (a + b)ⁿ, término general t(k+1) = C(n, k) aⁿ⁻ᵏ bᵏ, término central,
 * coeficiente de xᵐ (término independiente incluido), suma de coeficientes y el tablero de Galton.
 *
 * Aquí vive toda la matemática de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el
 * navegador (window.MotorBinomio) y en Node (require('./motor.js')). Las cuentas son exactas: enteros grandes
 * (BigInt) y fracciones de enteros grandes; nunca se pasa por decimales.
 *
 * CONVENCIONES
 *   n y k son enteros con 0 ≤ k ≤ n (n hasta 200). Un término del binomio es un monomio { c, v }: c es el
 *   coeficiente (entero, o texto de entero o fracción: 2, '−3', '1/2') y v las letras con su exponente entero
 *   (también negativo): { x: 2 } es x², { x: −1 } es 1/x, { a: 1 } es a, {} o sin v es una constante.
 *   El binomio es (A + B)ⁿ con A = { c, v } y B = { c, v }; (x − 2)⁵ es A = { c: 1, v: { x: 1 } }, B = { c: −2 }.
 *   El término de lugar L es t_L = t(k+1) con k = L − 1: k cuenta cuántas veces se eligió B (cuántas b hay en la
 *   palabra), y A se eligió n − k veces.
 *   Los textos usan el signo menos tipográfico (−), exponentes con superíndices ('84a⁶b³', 'x⁻³'), coeficiente
 *   1 omitido ('a⁶b³'), coeficiente fraccionario entre paréntesis ('(1/2)x³') y lugares como 't₄'.
 *   Cada función que responde una predicción devuelve { …, texto, num, errores, coinciden, noAplica }: num es el
 *   valor numérico (Number) para comparar; 'errores' es un objeto cuyas claves son errores típicos y cada uno trae
 *   { texto, num, id, regla }. 'id' es BN1…BN26 (hipótesis nuestras) o AL8 / AL11 (docs/investigacion/
 *   algebra-funciones-ideas-erroneas.md). Un error que con esos datos da lo mismo que la respuesta correcta NO va
 *   en 'errores': su clave va en 'coinciden'. Uno que no se puede calcular con esos datos va en 'noAplica'.
 *
 * FUNCIONES EXPORTADAS
 *   factorial({ n })          → { texto: n! exacto ('120'), num }. 0! = 1.
 *   combinatorio({ n, k })    → C(n, k) = n!/(k!(n − k)!). { texto, num, errores: variacion (BN12: n!/(n − k)!,
 *                               como si importara el orden), soloK (BN13: n!/k!, olvida el (n − k)!), todas (BN14:
 *                               2ⁿ, cuenta todas las palabras de n letras) }.
 *   caminos({ n, k })         → las palabras de n letras con k letras 'b' y n − k letras 'a', en orden alfabético
 *                               (n ≤ 12): { lista: ['aabb', 'abab', …], cuantas: C(n, k) (número) }.
 *   pascal({ n, k })          → C(n, k) + C(n, k + 1) = C(n + 1, k + 1), con 0 ≤ k < n. { texto, num, sumandos:
 *                               [texto C(n, k), texto C(n, k + 1)], errores: desfase (BN2: C(n + 1, k)), soloUno
 *                               (BN16: copia C(n, k) sin sumar), multiplica (BN15: C(n, k) · C(n, k + 1)) }.
 *   fila({ n })               → fila n del triángulo. { fila: [textos de C(n, 0) … C(n, n)], texto: suma de la fila
 *                               (2ⁿ), num, errores: sumaN (BN5: n), doble (BN6: 2n), cuadrado (BN18: n²) }.
 *   terminos({ n })           → cuántos términos tiene (a + b)ⁿ reducido. { texto: n + 1, num, errores: nTerminos
 *                               (BN1: n), reparte (AL11, o AL8 si n = 2: aⁿ + bⁿ, dos términos), sinJuntar (BN14: 2ⁿ,
 *                               una por palabra, sin juntar semejantes) }.
 *   desarrollo({ A, B, n })   → (A + B)ⁿ término por término. { terminos: [{ k, lugar, texto, coef: texto,
 *                               combinatorio: texto C(n, k), exponentes: { letra: exponente } }, …] (de k = 0 a n),
 *                               texto: 'a⁴ + 4a³b + 6a²b² + 4ab³ + b⁴' (sin juntar términos de igual parte literal) }.
 *   monomio({ c, v })         → texto del monomio: monomio({ c: −80, v: { x: 2 } }) = '−80x²'; { c: 1 } → '1'.
 *   termino({ A, B, n, lugar }) → t_lugar (1 ≤ lugar ≤ n + 1). { k, lugar, texto (monomio), coef: texto del
 *                               coeficiente, combinatorio: texto C(n, k), num: coeficiente (Number), errores (texto =
 *                               monomio): desfase (BN2: C(n, k + 1) con las mismas potencias; noAplica si k = n),
 *                               kCompleto (BN10: toma k = lugar: C(n, lugar) Aⁿ⁻ˡᵘᵍᵃʳ B^lugar; noAplica si lugar > n),
 *                               alReves (BN11: C(n, k) Aᵏ Bⁿ⁻ᵏ), sinCoef (BN3: Aⁿ⁻ᵏ Bᵏ sin C(n, k)), sinElevar
 *                               (BN4: (2x)ʲ = 2xʲ, los coeficientes de A y B entran una sola vez), sinSigno (BN8:
 *                               todo positivo) }.
 *   coeficiente({ A, B, n, m, letra }) → coeficiente de letraᵐ (letra por defecto 'x'; solo esa letra en A y B). Se
 *                               busca k con eA(n − k) + eB·k = m. { k (null si no hay), lugar, texto: coeficiente ('0' si
 *                               no hay), num, termino: texto del término, exponentes: [exponente de la letra en t(k+1)
 *                               para k = 0 … n], errores: desfase (BN2: C(n, k + 1) · cAⁿ⁻ᵏ cBᵏ), sinCoef (BN3),
 *                               sinElevar (BN4), sinSigno (BN8), central (BN19, solo si m = 0 y n par: el coeficiente
 *                               del término central), exponenteSuma (BN9, solo si eB < 0: usa eA(n − k) + |eB|·k;
 *                               si así no hay k, texto 'no tiene' y num null) }.
 *   central({ A, B, n })      → término(s) central(es). n par: uno, t(n/2 + 1); n impar: dos, t((n + 1)/2) y
 *                               t((n + 3)/2). { lugares: [números], terminos: [textos], cuantos: 1 o 2; n par: texto = el
 *                               término central ('252x⁵y⁵'), lugar: 't₆', termino; n impar: texto 't₄ y t₅'; errores: n par → masUno (BN7: k = n/2 + 1, texto = su término),
 *                               antes (BN23: lugar n/2), desfase (BN2: C(n, n/2 + 1) con las potencias del central);
 *                               n impar (texto = lugares) → soloAbajo (BN24: solo t((n + 1)/2)), soloArriba (BN25:
 *                               solo t((n + 3)/2)), ninguno (BN26: 'ninguno', porque n/2 no es entero; num null) }.
 *                               Para n par, num es el coeficiente del central; para n impar, num es 2.
 *   sumaCoeficientes({ A, B, n }) → suma de coeficientes = valor con todas las letras en 1 = (cA + cB)ⁿ. { texto,
 *                               num, errores: ignoraCoef (BN20: 2ⁿ, como si cA = cB = 1), reparte (AL11, o AL8 si
 *                               n = 2: cAⁿ + cBⁿ), sinSigno (BN8: (|cA| + |cB|)ⁿ), sumaN (BN5: n) }.
 *   galton({ n, bolitas, k }) → tablero de Galton con n filas de clavos: en promedio caen bolitas · C(n, k)/2ⁿ en el
 *                               casillero k (contado desde 0 por la izquierda). { texto (exacto, fracción si no es
 *                               entero), num, caminos: C(n, k) (número), total: 2ⁿ (número), errores: uniforme
 *                               (BN21: bolitas/(n + 1), todos los casilleros igual), desfase (BN2: bolitas ·
 *                               C(n, k − 1)/2ⁿ; noAplica si k = 0), mitad (BN22: bolitas/2, la mitad cae al centro) }.
 *   simular({ n, bolitas, semilla }) → bolitas que caen con azar de semilla fija (la misma semilla da lo mismo):
 *                               { caminos: ['abba…', …] (una palabra por bolita: a = izquierda, b = derecha),
 *                               casilleros: [cuántas cayeron en k = 0 … n] }.
 *   sub(n), sup(n)            → número con subíndices o superíndices: sub(4) = '₄', sup(-3) = '⁻³'.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorBinomio = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const MENOS = '−';
  const SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
  const SUB = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉' };
  const sup = e => String(e).split('').map(c => SUP[c]).join('');
  const sub = e => String(e).split('').map(c => SUB[c]).join('');

  // ---------- Enteros y fracciones exactas ----------
  const babs = x => (x < 0n ? -x : x);
  function bmcd(a, b) { a = babs(a); b = babs(b); while (b) [a, b] = [b, a % b]; return a; }
  function F(n, d) {
    n = BigInt(n); d = d === undefined ? 1n : BigInt(d);
    if (d === 0n) throw new Error('división entre cero');
    if (d < 0n) { n = -n; d = -d; }
    const g = bmcd(n, d) || 1n;
    return { n: n / g, d: d / g };
  }
  const fMul = (p, q) => F(p.n * q.n, p.d * q.d);
  const fSum = (p, q) => F(p.n * q.d + q.n * p.d, p.d * q.d);
  const fAbs = p => F(babs(p.n), p.d);
  const fIgual = (p, q) => p.n === q.n && p.d === q.d;
  function fPot(p, e) {
    if (e < 0) { if (p.n === 0n) throw new Error('división entre cero'); return fPot(F(p.d, p.n), -e); }
    return F(p.n ** BigInt(e), p.d ** BigInt(e));
  }
  const fNum = p => Number(p.n) / Number(p.d);
  const bTexto = b => (b < 0n ? MENOS + (-b).toString() : b.toString());
  const fTexto = p => (p.d === 1n ? bTexto(p.n) : bTexto(p.n) + '/' + p.d.toString());
  function leerF(x, que) {
    if (typeof x === 'bigint') return F(x);
    if (typeof x === 'number') {
      if (!Number.isSafeInteger(x)) throw new Error(`${que}: use un entero o una fracción como texto ('1/2')`);
      return F(x);
    }
    if (typeof x === 'string') {
      const t = x.replace(/−/g, '-').replace(/\s/g, '');
      const m = /^(-?\d+)(?:\/(\d+))?$/.exec(t);
      if (!m) throw new Error(`${que}: '${x}' no es un entero ni una fracción`);
      return F(m[1], m[2] || 1);
    }
    throw new Error(`${que}: falta el coeficiente`);
  }

  // ---------- Factorial y combinatorio ----------
  function entero(x, que, min, max) {
    if (!Number.isInteger(x)) throw new Error(`${que} debe ser un entero`);
    if (x < min || x > max) throw new Error(`${que} debe estar entre ${min} y ${max}`);
    return x;
  }
  function fact(n) { let r = 1n; for (let i = 2n; i <= BigInt(n); i++) r *= i; return r; }
  function C(n, k) {
    if (k < 0 || k > n) return 0n;
    k = Math.min(k, n - k);
    let r = 1n;
    for (let i = 1; i <= k; i++) r = (r * BigInt(n - k + i)) / BigInt(i);
    return r;
  }
  function nk(o, conK) {
    if (!o || typeof o !== 'object') throw new Error('se espera { n, k }');
    const n = entero(o.n, 'n', 0, 200);
    if (!conK) return { n };
    const k = entero(o.k, 'k', 0, n);
    return { n, k };
  }
  const E = (texto, num, id, regla) => ({ texto, num, id, regla });
  // Separa los errores que coinciden con la respuesta (por texto o por valor).
  function cerrar(r, errores, noAplica) {
    const out = {}, coinciden = [];
    for (const [k, e] of Object.entries(errores)) {
      if (e === null) continue;
      if (e.texto === r.texto) coinciden.push(k); else out[k] = e;
    }
    r.errores = out; r.coinciden = coinciden; r.noAplica = noAplica || [];
    return r;
  }
  const big = b => ({ texto: bTexto(b), num: Number(b) });

  function factorial(o) {
    const { n } = nk(o, false);
    return big(fact(n));
  }
  function combinatorio(o) {
    const { n, k } = nk(o, true);
    const r = big(C(n, k));
    const v = fact(n) / fact(n - k), s = fact(n) / fact(k), t = 2n ** BigInt(n);
    return cerrar(r, {
      variacion: E(bTexto(v), Number(v), 'BN12', 'n!/(n − k)!: cuenta las palabras como si importara el orden de las b'),
      soloK: E(bTexto(s), Number(s), 'BN13', 'n!/k!: olvida dividir entre (n − k)!'),
      todas: E(bTexto(t), Number(t), 'BN14', '2ⁿ: cuenta todas las palabras de n letras, no solo las que tienen k letras b'),
    });
  }
  function caminos(o) {
    const { n, k } = nk(o, true);
    if (n > 12) throw new Error('caminos: n hasta 12');
    const lista = [];
    for (let m = 0; m < (1 << n); m++) {
      let s = '', b = 0;
      for (let i = n - 1; i >= 0; i--) { const bit = (m >> i) & 1; s += bit ? 'b' : 'a'; b += bit; }
      if (b === k) lista.push(s);
    }
    return { lista, cuantas: lista.length };
  }
  function pascal(o) {
    const { n, k } = nk(o, true);
    if (k >= n) throw new Error('pascal: k debe ser menor que n');
    const p = C(n, k), q = C(n, k + 1);
    const r = big(C(n + 1, k + 1));
    r.sumandos = [bTexto(p), bTexto(q)];
    const d = C(n + 1, k);
    return cerrar(r, {
      desfase: E(bTexto(d), Number(d), 'BN2', 'C(n + 1, k): el resultado queda un lugar corrido a la izquierda'),
      soloUno: E(bTexto(p), Number(p), 'BN16', 'copia el número de arriba sin sumarle su vecino'),
      multiplica: E(bTexto(p * q), Number(p * q), 'BN15', 'multiplica los dos números de arriba en vez de sumarlos'),
    });
  }
  function fila(o) {
    const { n } = nk(o, false);
    const f = []; for (let k = 0; k <= n; k++) f.push(bTexto(C(n, k)));
    const r = big(2n ** BigInt(n)); r.fila = f;
    return cerrar(r, {
      sumaN: E(String(n), n, 'BN5', 'la suma de la fila es n'),
      doble: E(String(2 * n), 2 * n, 'BN6', 'la suma de la fila es 2n'),
      cuadrado: E(String(n * n), n * n, 'BN18', 'la suma de la fila es n²'),
    });
  }
  function terminos(o) {
    const { n } = nk(o, false);
    const r = { texto: String(n + 1), num: n + 1 };
    const t = 2n ** BigInt(n);
    return cerrar(r, {
      nTerminos: E(String(n), n, 'BN1', 'n términos en vez de n + 1 (olvida el término con k = 0)'),
      reparte: E('2', 2, n === 2 ? 'AL8' : 'AL11', '(a + b)ⁿ = aⁿ + bⁿ: el exponente se reparte sobre la suma'),
      sinJuntar: E(bTexto(t), Number(t), 'BN14', '2ⁿ: una por palabra, sin juntar los términos semejantes'),
    });
  }

  // ---------- Monomios ----------
  function leerMono(m, que) {
    if (!m || typeof m !== 'object') throw new Error(`${que}: se espera { c, v }`);
    const c = leerF(m.c === undefined ? 1 : m.c, que);
    const v = {};
    for (const [l, e] of Object.entries(m.v || {})) {
      if (!/^[a-z]$/.test(l)) throw new Error(`${que}: la letra '${l}' no vale`);
      if (!Number.isInteger(e)) throw new Error(`${que}: el exponente de ${l} debe ser entero`);
      if (e) v[l] = e;
    }
    return { c, v };
  }
  function monoTexto(c, v) {
    const letras = Object.keys(v).filter(l => v[l]).sort();
    const lit = letras.map(l => l + (v[l] === 1 ? '' : sup(v[l]))).join('');
    if (c.n === 0n) return '0';
    if (!lit) return fTexto(c);
    if (c.d !== 1n) return (c.n < 0n ? MENOS : '') + '(' + fTexto(fAbs(c)) + ')' + lit;
    if (c.n === 1n) return lit;
    if (c.n === -1n) return MENOS + lit;
    return bTexto(c.n) + lit;
  }
  function monomio(m) { const M = leerMono(m, 'monomio'); return monoTexto(M.c, M.v); }
  // A^p · B^q · coef
  function potencias(A, B, p, q) {
    const v = {};
    for (const [l, e] of Object.entries(A.v)) v[l] = (v[l] || 0) + e * p;
    for (const [l, e] of Object.entries(B.v)) v[l] = (v[l] || 0) + e * q;
    for (const l of Object.keys(v)) if (!v[l]) delete v[l];
    return v;
  }
  function binomio(o) {
    if (!o || typeof o !== 'object') throw new Error('se espera { A, B, n }');
    const A = leerMono(o.A, 'A'), B = leerMono(o.B, 'B');
    const n = entero(o.n, 'n', 0, 200);
    if (A.c.n === 0n || B.c.n === 0n) throw new Error('los dos términos del binomio deben ser distintos de 0');
    return { A, B, n };
  }
  // t(k+1) con un coeficiente combinatorio y potencias dadas
  function armar(A, B, comb, p, q) {
    const c = fMul(F(comb), fMul(fPot(A.c, p), fPot(B.c, q)));
    return { c, v: potencias(A, B, p, q) };
  }
  const tx = t => monoTexto(t.c, t.v);

  function desarrollo(o) {
    const { A, B, n } = binomio(o);
    const ts = [];
    for (let k = 0; k <= n; k++) {
      const t = armar(A, B, C(n, k), n - k, k);
      ts.push({ k, lugar: k + 1, texto: tx(t), coef: fTexto(t.c), combinatorio: bTexto(C(n, k)), exponentes: Object.assign({}, t.v) });
    }
    const texto = ts.map((t, i) => (i === 0 ? t.texto : (t.texto.startsWith(MENOS) ? ' − ' + t.texto.slice(1) : ' + ' + t.texto))).join('');
    return { terminos: ts, texto };
  }

  function termino(o) {
    const { A, B, n } = binomio(o);
    const L = entero(o.lugar, 'lugar', 1, n + 1), k = L - 1;
    const t = armar(A, B, C(n, k), n - k, k);
    const r = { k, lugar: L, texto: tx(t), coef: fTexto(t.c), combinatorio: bTexto(C(n, k)), num: fNum(t.c) };
    const err = {}, noAplica = [];
    const mk = (u, id, regla) => E(tx(u), fNum(u.c), id, regla);
    if (k < n) err.desfase = mk(armar(A, B, C(n, k + 1), n - k, k), 'BN2', 'usa C(n, k + 1) en t(k+1): el índice queda corrido');
    else noAplica.push('desfase');
    if (L <= n) err.kCompleto = mk(armar(A, B, C(n, L), n - L, L), 'BN10', 'toma k igual al lugar: t_L con k = L');
    else noAplica.push('kCompleto');
    err.alReves = mk(armar(A, B, C(n, k), k, n - k), 'BN11', 'cambia los exponentes: Aᵏ Bⁿ⁻ᵏ');
    err.sinCoef = mk(armar(A, B, 1n, n - k, k), 'BN3', 'olvida el coeficiente C(n, k)');
    const se = { c: fMul(F(C(n, k)), fMul(n - k ? A.c : F(1), k ? B.c : F(1))), v: t.v };
    err.sinElevar = mk(se, 'BN4', '(2x)ʲ = 2xʲ: no eleva el coeficiente de cada término');
    err.sinSigno = mk({ c: fAbs(t.c), v: t.v }, 'BN8', 'olvida el signo: todos los términos positivos');
    return cerrar(r, err, noAplica);
  }

  function unaLetra(A, B, letra) {
    for (const M of [A, B]) for (const l of Object.keys(M.v)) if (l !== letra) throw new Error(`coeficiente: solo puede haber la letra ${letra}`);
    return [A.v[letra] || 0, B.v[letra] || 0];
  }
  function buscarK(eA, eB, n, m) {
    for (let k = 0; k <= n; k++) if (eA * (n - k) + eB * k === m) return k;
    return null;
  }
  function coeficiente(o) {
    const { A, B, n } = binomio(o);
    const letra = o.letra || 'x';
    if (!Number.isInteger(o.m)) throw new Error('m debe ser un entero');
    const m = o.m, [eA, eB] = unaLetra(A, B, letra);
    if (eA === eB) throw new Error('coeficiente: los dos términos tienen la misma potencia de la letra');
    const exponentes = []; for (let k = 0; k <= n; k++) exponentes.push(eA * (n - k) + eB * k);
    const k = buscarK(eA, eB, n, m);
    const err = {}, noAplica = [];
    if (k === null) {
      return cerrar({ k: null, lugar: null, texto: '0', num: 0, termino: '0', exponentes }, {}, ['desfase', 'sinCoef', 'sinElevar', 'sinSigno', 'central', 'exponenteSuma']);
    }
    const t = armar(A, B, C(n, k), n - k, k);
    const r = { k, lugar: k + 1, texto: fTexto(t.c), num: fNum(t.c), termino: tx(t), exponentes };
    const mk = (c, id, regla) => E(fTexto(c), fNum(c), id, regla);
    if (k < n) err.desfase = mk(armar(A, B, C(n, k + 1), n - k, k).c, 'BN2', 'usa C(n, k + 1) en t(k+1): el índice queda corrido');
    else noAplica.push('desfase');
    err.sinCoef = mk(armar(A, B, 1n, n - k, k).c, 'BN3', 'olvida el coeficiente C(n, k)');
    err.sinElevar = mk(fMul(F(C(n, k)), fMul(n - k ? A.c : F(1), k ? B.c : F(1))), 'BN4', '(2x)ʲ = 2xʲ: no eleva el coeficiente de cada término');
    err.sinSigno = mk(fAbs(t.c), 'BN8', 'olvida el signo');
    if (m === 0 && n % 2 === 0) err.central = mk(armar(A, B, C(n, n / 2), n / 2, n / 2).c, 'BN19', 'cree que el término independiente es el central');
    else noAplica.push('central');
    if (eB < 0 || eA < 0) {
      const k2 = buscarK(Math.abs(eA), Math.abs(eB), n, m);
      err.exponenteSuma = k2 === null
        ? E('no tiene', null, 'BN9', 'suma los exponentes como positivos: eA(n − k) + |eB|k, y así nunca da m')
        : mk(armar(A, B, C(n, k2), n - k2, k2).c, 'BN9', 'suma los exponentes como positivos: eA(n − k) + |eB|k');
    } else noAplica.push('exponenteSuma');
    return cerrar(r, err, noAplica);
  }

  function central(o) {
    const { A, B, n } = binomio(o);
    const T = k => armar(A, B, C(n, k), n - k, k);
    if (n % 2 === 0) {
      const h = n / 2, t = T(h);
      const r = { lugares: [h + 1], terminos: [tx(t)], texto: 't' + sub(h + 1), cuantos: 1, num: fNum(t.c), termino: tx(t) };
      const err = {}, noAplica = [];
      const mk = (u, id, regla) => E(tx(u), fNum(u.c), id, regla);
      if (h + 1 <= n) err.masUno = mk(T(h + 1), 'BN7', 'el central con k = n/2 + 1 (se suma 1 dos veces)'); else noAplica.push('masUno');
      if (h >= 1) err.antes = mk(T(h - 1), 'BN23', 'el central es t(n/2)'); else noAplica.push('antes');
      if (h + 1 <= n) err.desfase = mk(armar(A, B, C(n, h + 1), h, h), 'BN2', 'usa C(n, k + 1) con las potencias del central'); else noAplica.push('desfase');
      // para el central, el texto que se compara es el término
      r.texto = tx(t); r.lugar = 't' + sub(h + 1);
      return cerrar(r, err, noAplica);
    }
    const a = (n + 1) / 2, b = (n + 3) / 2;
    const r = { lugares: [a, b], terminos: [tx(T(a - 1)), tx(T(b - 1))], texto: 't' + sub(a) + ' y t' + sub(b), cuantos: 2, num: 2 };
    return cerrar(r, {
      soloAbajo: E('t' + sub(a), 1, 'BN24', 'un solo central, t((n + 1)/2)'),
      soloArriba: E('t' + sub(b), 1, 'BN25', 'un solo central, t((n + 3)/2)'),
      ninguno: E('ninguno', null, 'BN26', 'no hay central porque n/2 no es entero'),
    });
  }

  function sumaCoeficientes(o) {
    const { A, B, n } = binomio(o);
    const v = fPot(fSum(A.c, B.c), n);
    const r = { texto: fTexto(v), num: fNum(v) };
    const ig = 2n ** BigInt(n), rep = fSum(fPot(A.c, n), fPot(B.c, n)), ss = fPot(fSum(fAbs(A.c), fAbs(B.c)), n);
    return cerrar(r, {
      ignoraCoef: E(bTexto(ig), Number(ig), 'BN20', '2ⁿ: suma la fila de Pascal sin mirar los coeficientes de A y B'),
      reparte: E(fTexto(rep), fNum(rep), n === 2 ? 'AL8' : 'AL11', 'cAⁿ + cBⁿ: el exponente se reparte sobre la suma'),
      sinSigno: E(fTexto(ss), fNum(ss), 'BN8', 'olvida el signo: (|cA| + |cB|)ⁿ'),
      sumaN: E(String(n), n, 'BN5', 'la suma de coeficientes es n'),
    });
  }

  function galton(o) {
    if (!o || typeof o !== 'object') throw new Error('se espera { n, bolitas, k }');
    const n = entero(o.n, 'n', 1, 60), k = entero(o.k, 'k', 0, n), b = entero(o.bolitas, 'bolitas', 1, 1e9);
    const tot = 2n ** BigInt(n);
    const v = F(BigInt(b) * C(n, k), tot);
    const r = { texto: fTexto(v), num: fNum(v), caminos: Number(C(n, k)), total: Number(tot) };
    const err = {}, noAplica = [];
    const u = F(b, n + 1); err.uniforme = E(fTexto(u), fNum(u), 'BN21', 'todos los casilleros reciben lo mismo: bolitas/(n + 1)');
    if (k >= 1) { const d = F(BigInt(b) * C(n, k - 1), tot); err.desfase = E(fTexto(d), fNum(d), 'BN2', 'usa C(n, k − 1): cuenta el casillero de al lado'); }
    else noAplica.push('desfase');
    const h = F(b, 2); err.mitad = E(fTexto(h), fNum(h), 'BN22', 'la mitad de las bolitas cae al centro');
    return cerrar(r, err, noAplica);
  }

  function simular(o) {
    if (!o || typeof o !== 'object') throw new Error('se espera { n, bolitas, semilla }');
    const n = entero(o.n, 'n', 1, 30), b = entero(o.bolitas, 'bolitas', 1, 5000);
    let s = ((o.semilla === undefined ? 1 : o.semilla) >>> 0) || 1;
    const azar = () => {   // mulberry32: un bit limpio por clavo
      s = (s + 0x6D2B79F5) >>> 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) >= 2147483648 ? 1 : 0;
    };
    const casilleros = new Array(n + 1).fill(0), lista = [];
    for (let i = 0; i < b; i++) {
      let w = '', kk = 0;
      for (let j = 0; j < n; j++) { const d = azar(); w += d ? 'b' : 'a'; kk += d; }
      lista.push(w); casilleros[kk]++;
    }
    return { caminos: lista, casilleros };
  }

  return { factorial, combinatorio, caminos, pascal, fila, terminos, desarrollo, monomio, termino, coeficiente, central,
    sumaCoeficientes, galton, simular, sub, sup };
});
