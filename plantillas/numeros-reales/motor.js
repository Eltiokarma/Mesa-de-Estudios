/*
 * Motor de «La recta en trozos»: números reales, intervalos, valor absoluto, desigualdades,
 * densidad, cotas y operaciones binarias.
 *
 * Aquí vive toda la matemática de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el
 * navegador (window.MotorReales) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 * Todo se calcula con fracciones exactas; el único irracional que aparece es √2 (en entre), escrito r + s·√2.
 *
 * Notación peruana: intervalos con ⟨ ⟩ abiertos y [ ] cerrados, «;» entre los extremos, coma decimal
 * (⟨−∞; 1/2] ∪ [3; +∞⟩, ∅, ℝ, ℝ − {2}, {1}). Las entradas aceptan textos así ('[−2; 3⟩', '⟨−∞; 0]', '∅', 'ℝ',
 * 'ℝ − {2}', '{1; 3}', con «-» o «−», «(» por «⟨», 'inf' por ∞) o listas de intervalos ya armados.
 *
 *   conjunto(X)                      el conjunto normalizado: unión de intervalos disjuntos y ordenados, su texto
 *   pertenece({ A, x })              ¿x ∈ A?, con el texto 3 ∉ [−2; 3⟩
 *   extremos({ A })                  ¿qué extremos entran? (−2 sí, 3 no) y los errores de corchetes
 *   operar({ A, B, op, decimal })    op: 'union', 'interseccion', 'diferencia' (A − B), 'complemento' (A′), 'simetrica';
 *                                    con decimal: true, los extremos van con coma decimal (4,5 y no 9/2)
 *   longitud({ A })                  suma de las longitudes (Infinity si no es acotado)
 *   cotas({ A })                     cotas, supremo, ínfimo, máximo y mínimo (null si no existen)
 *   absoluto({ a, op, r })           |x − a| op r como conjunto: «a menos de r de a» o dos rayos
 *   absolutoLineal({ a, b, op, c })  |a·x + b| op c
 *   distancia({ p, q })              |p − q|, con la cuenta
 *   imagen({ A, f })                 dónde está f(x) si x ∈ A: f = { tipo: 'afin', k, t } (k·x + t), 'cuadrado', 'inverso', 'absoluto'
 *   multiplicar({ op, k })           el sentido de la desigualdad al multiplicar los dos lados por k
 *   cadena({ lo, opLo, a, b, opHi, hi })   lo opLo a·x + b opHi hi, despejando x en los tres miembros
 *   signos({ num, den, op })         método de los puntos críticos: k·∏(a·x + b)/∏(c·x + d) op 0
 *   cuadradoDesigualdad({ op, c })   x² op c (c cuadrado de un racional)
 *   inversa({ op, c })               1/x op c, sin multiplicar por x (se multiplica por x², que es positivo)
 *   entre({ p, q })                  un racional (el promedio) y un irracional (con √2) entre p y q; también n racionales
 *   siguiente({ x })                 «el número que sigue a x» no existe; cada candidato tiene otro número antes
 *   generatriz({ entero, antes, periodo })   el número periódico como fracción: 0,(9) = 1
 *   aproximar({ entero, antes, periodo, n }) el truncamiento con n cifras y el hueco que queda hasta el número
 *   operacionTabla({ elementos, tabla })     propiedades de una operación definida por tabla de Cayley
 *   inversoTabla({ elementos, tabla, x })    el inverso de x en la tabla
 *   operacionFormula({ alfa, beta, gamma, delta, x })   a ∗ b = α·a + β·b + γ·a·b + δ: propiedades, neutro e inverso de x
 *
 * Cada resultado que es la respuesta de una predicción trae 'errores': lo que da cada error típico.
 * Un error que con esos números da lo mismo que la respuesta correcta NO va en 'errores': va en 'coinciden'.
 * Si dos errores dan lo mismo, queda el primero y el otro va a 'repetidos' ({ otro: 'primero' }); los que no tienen
 * sentido con esos números van en 'noAplica'.
 *
 * Códigos de error (docs/investigacion/algebra-funciones-ideas-erroneas.md trae AL19 a AL23, con respaldo parcial;
 * lo demás no tiene estudio y va como hipótesis):
 *   AL19 la inecuación se resuelve como ecuación (x² < 9 ⇒ x < 3)                          parcial (Tsamir y Almog 2001)
 *   AL20 no invertir el sentido al multiplicar o dividir por un negativo                     hipótesis
 *   AL21 multiplicar por una expresión de signo desconocido (1/x < 2 ⇒ 1 < 2x)               parcial (Tsamir y Almog 2001)
 *   AL22 el valor absoluto «quita el signo» (|x − 3| < 5 ⇒ x < 8)                            parcial (Almog e Ilany 2012)
 *   NR1  corchetes leídos al revés: ⟩ como «entra» y [ como «no entra»                       hipótesis
 *   NR2  los extremos siempre entran (o nunca entran), sin mirar el corchete                  hipótesis
 *   NR3  confundir la intersección con la unión (o al revés), o con la diferencia simétrica     hipótesis
 *   NR4  corchetes mal puestos al operar: en ∩ se cierra un extremo que solo está en un trozo;
 *        en A − B se deja cerrado el extremo que B quita; en A′ se copian los corchetes de A     hipótesis
 *   NR5  dentro por fuera: |x − a| ≤ r leído como dos rayos (o > r como un trozo)             hipótesis
 *   NR6  |x − a| medido desde −a (el signo del centro al revés)                               hipótesis
 *   NR7  x² con x ∈ [−2; 3] da [4; 9]: elevar solo los extremos, olvidando que pasa por 0      hipótesis
 *   NR8  (−2)² = −4: el signo se queda al elevar al cuadrado                                  hipótesis
 *   NR9  hay un «número siguiente» (0,91 después de 0,9; 1 después de 0,9…)                    hipótesis
 *   NR10 0,999… es menor que 1 («el número justo antes de 1», «le falta 0,000…1», «se acerca
 *        pero nunca llega»)                                                                   hipótesis
 *   NR11 el supremo es el máximo aunque no esté en el conjunto (máx ⟨0; 1⟩ = 1)                hipótesis
 *   NR12 si no hay máximo, tampoco hay supremo; o el máximo es «el último antes de 1»          hipótesis
 *   NR13 el neutro de una tabla se busca en la diagonal (un elemento que sale ahí; si empatan,
 *        el que aparece primero)                                                              hipótesis
 *   NR14 el neutro es el primer elemento de la tabla (o 0, o 1, sin comprobar)                 hipótesis
 *   NR15 neutro de un solo lado: basta que la fila repita la cabecera                         hipótesis
 *   NR16 el inverso de x se lee en la diagonal (x ∗ x) o es el neutro mismo                    hipótesis
 *   NR17 1/x sin partir en el 0: [−1; 2] da [−1; 1/2], o solo el trozo positivo                hipótesis
 *   NR18 si dos trozos solo se tocan en un punto, su intersección es vacía                     hipótesis
 *   NR19 conmutativa sin comprobar todos los pares                                            hipótesis
 *   NR20 al multiplicar por un negativo, ordenar los números sin cambiar los corchetes         hipótesis
 *   NR21 la unión de dos trozos separados se escribe como un solo trozo (se rellena el hueco)  hipótesis
 *   NR22 al pasar de x a k·x + t, olvidar sumar t                                             hipótesis
 *   NR23 creer que la tabla no tiene neutro cuando sí lo tiene                                hipótesis
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorReales = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const MENOS = '−';

  // ---------- Fracciones exactas (y ±∞) ----------
  function mcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; }
  function F(n, d) {
    if (d === undefined) d = 1;
    if (!Number.isSafeInteger(n) || !Number.isSafeInteger(d)) throw new Error('números demasiado grandes para el motor');
    if (d === 0) throw new Error('división entre cero');
    if (d < 0) { n = -n; d = -d; }
    const g = mcd(n, d) || 1;
    return { n: n / g + 0, d: d / g };
  }
  const MAS_INF = { inf: 1 }, MENOS_INF = { inf: -1 };
  const esInf = a => !!(a && a.inf);
  const CERO = F(0), UNO = F(1);
  const fSum = (a, b) => F(a.n * b.d + b.n * a.d, a.d * b.d);
  const fRes = (a, b) => F(a.n * b.d - b.n * a.d, a.d * b.d);
  const fMul = (a, b) => F(a.n * b.n, a.d * b.d);
  const fDiv = (a, b) => { if (b.n === 0) throw new Error('división entre cero'); return F(a.n * b.d, a.d * b.n); };
  const fNeg = a => (esInf(a) ? { inf: -a.inf } : F(-a.n, a.d));
  // compara dos extremos (fracciones o ±∞)
  function cmp(a, b) {
    if (esInf(a) || esInf(b)) { const x = esInf(a) ? a.inf : 0, y = esInf(b) ? b.inf : 0; if (x !== y) return Math.sign(x - y); if (x !== 0) return 0; }
    return Math.sign(a.n * b.d - b.n * a.d);
  }
  const igual = (a, b) => cmp(a, b) === 0;
  const num = a => (esInf(a) ? a.inf * Infinity : a.n / a.d + 0);
  const signo = a => (esInf(a) ? a.inf : Math.sign(a.n));
  function aF(x, que) {
    if (x && typeof x === 'object' && 'inf' in x) return x.inf > 0 ? MAS_INF : MENOS_INF;
    if (x && typeof x === 'object' && 'n' in x && 'd' in x) return F(x.n, x.d);
    if (x === Infinity) return MAS_INF;
    if (x === -Infinity) return MENOS_INF;
    if (typeof x === 'string') return leerNumero(x, que);
    if (typeof x !== 'number' || !Number.isFinite(x)) throw new Error(`${que || 'el valor'} debe ser un número`);
    for (let q = 1; q <= 1e9; q *= 10) { const p = Math.round(x * q); if (Math.abs(p / q - x) <= 1e-12 * Math.max(1, Math.abs(x))) return F(p, q); }
    for (let q = 2; q <= 2000; q++) { const p = Math.round(x * q); if (Math.abs(p / q - x) <= 1e-12 * Math.max(1, Math.abs(x))) return F(p, q); }
    throw new Error(`${que || 'el valor'} no tiene una fracción exacta corta`);
  }
  function fin(x, que) { const a = aF(x, que); if (esInf(a)) throw new Error(`${que || 'el valor'} debe ser finito`); return a; }
  // '−2', '3/2', '0,5', '-0.25', '−∞', '+∞', 'inf'
  function leerNumero(s, que) {
    const t = String(s).trim().replace(/−/g, '-').replace(/\s+/g, '');
    if (/^\+?(∞|inf)$/i.test(t)) return MAS_INF;
    if (/^-(∞|inf)$/i.test(t)) return MENOS_INF;
    let m = t.match(/^(-?)(\d+)\/(\d+)$/);
    if (m) return F((m[1] ? -1 : 1) * Number(m[2]), Number(m[3]));
    m = t.match(/^(-?)(\d+)(?:[.,](\d+))?$/);
    if (m) { const dec = m[3] || '', q = Math.pow(10, dec.length); return F((m[1] ? -1 : 1) * (Number(m[2]) * q + Number(dec || 0)), q); }
    throw new Error(`${que || 'el valor'}: no entiendo «${s}»`);
  }
  // Texto de un número: fracción con barra (−3/2) o, con decimal, coma decimal si es exacto (0,905)
  let DEC = false;   // con coma decimal en todos los textos (operar con decimal: true, textoConjunto(X, true))
  function txF(a, decimal) {
    if (decimal === undefined) decimal = DEC;
    if (esInf(a)) return a.inf > 0 ? '+∞' : `${MENOS}∞`;
    const s = a.n < 0 ? MENOS : '', n = Math.abs(a.n);
    if (a.d === 1) return s + n;
    if (decimal) {
      let d = a.d, k2 = 0, k5 = 0;
      while (d % 2 === 0) { d /= 2; k2++; }
      while (d % 5 === 0) { d /= 5; k5++; }
      if (d === 1) {
        const k = Math.max(k2, k5), q = Math.pow(10, k), m = n * (q / a.d);
        const e = Math.floor(m / q), r = String(m % q).padStart(k, '0').replace(/0+$/, '');
        return s + e + (r ? ',' + r : '');
      }
    }
    return `${s}${n}/${a.d}`;
  }

  const esDecimal = a => { let d = a.d; while (d % 2 === 0) d /= 2; while (d % 5 === 0) d /= 5; return d === 1; };

  // ---------- Intervalos y conjuntos ----------
  // Un intervalo es { a, b, ca, cb }: extremos (fracción o ±∞) y si cada uno entra (los infinitos nunca entran).
  const iv = (a, b, ca, cb) => ({ a, b, ca: esInf(a) ? false : !!ca, cb: esInf(b) ? false : !!cb });
  const vacioIv = I => cmp(I.a, I.b) > 0 || (cmp(I.a, I.b) === 0 && !(I.ca && I.cb));
  function normalizar(L) {
    const o = L.filter(I => !vacioIv(I)).map(I => iv(I.a, I.b, I.ca, I.cb))
      .sort((p, q) => cmp(p.a, q.a) || (p.ca === q.ca ? 0 : p.ca ? -1 : 1));
    const r = [];
    for (const I of o) {
      const u = r[r.length - 1];
      if (u && (cmp(I.a, u.b) < 0 || (cmp(I.a, u.b) === 0 && (u.cb || I.ca)))) {
        const c = cmp(I.b, u.b);
        if (c > 0) { u.b = I.b; u.cb = I.cb; } else if (c === 0) u.cb = u.cb || I.cb;
      } else r.push(Object.assign({}, I));
    }
    return r;
  }
  const TODO = () => [iv(MENOS_INF, MAS_INF, false, false)];
  function leerIntervalo(s) {
    const t = s.trim(), i = t[0], f = t[t.length - 1];
    const abre = { '[': true, '⟨': false, '(': false, '<': false, ']': false }[i];
    const cierra = { ']': true, '⟩': false, ')': false, '>': false, '[': false }[f];
    if (abre === undefined || cierra === undefined) throw new Error(`no entiendo el intervalo «${s}»`);
    const partes = t.slice(1, -1).split(';');
    if (partes.length !== 2) throw new Error(`el intervalo «${s}» debe tener dos extremos separados por «;»`);
    const a = leerNumero(partes[0], 'un extremo'), b = leerNumero(partes[1], 'un extremo');
    if ((esInf(a) && a.inf > 0) || (esInf(b) && b.inf < 0)) throw new Error(`el intervalo «${s}» tiene los infinitos al revés`);
    return iv(a, b, abre, cierra);
  }
  function leer(X, que) {
    if (Array.isArray(X)) return normalizar(X.map(I => (typeof I === 'string' ? leerIntervalo(I) : iv(aF(I.a), aF(I.b), I.ca, I.cb))));
    if (X && Array.isArray(X.intervalos)) return leer(X.intervalos.map(I => ({ a: I.a, b: I.b, ca: I.ca, cb: I.cb })));
    if (typeof X !== 'string') throw new Error(`${que || 'el conjunto'} debe ser un texto como '[−2; 3⟩' o una lista de intervalos`);
    const t = X.trim();
    if (t === '∅' || t === '{}') return [];
    if (t === 'ℝ' || t === 'R') return TODO();
    let m = t.match(/^(?:ℝ|R)\s*[−-]\s*\{(.+)\}$/);
    if (m) return operarL(TODO(), puntos(m[1]), 'diferencia');
    if (t[0] === '{' && !t.includes('∪')) return puntos(t.slice(1, -1));
    return normalizar([].concat(...t.split('∪').map(p => (p.trim()[0] === '{' ? puntos(p.trim().slice(1, -1)) : [leerIntervalo(p)]))));
  }
  function puntos(s) { return normalizar(s.split(';').map(p => { const a = leerNumero(p, 'un punto'); return iv(a, a, true, true); })); }

  function txIv(I) {
    if (!esInf(I.a) && igual(I.a, I.b)) return `{${txF(I.a)}}`;
    return (I.ca ? '[' : '⟨') + txF(I.a) + '; ' + txF(I.b) + (I.cb ? ']' : '⟩');
  }
  function texto(L) {
    if (!L.length) return '∅';
    if (L.length === 1 && esInf(L[0].a) && esInf(L[0].b)) return 'ℝ';
    // ℝ sin algunos puntos: ℝ − {2} o ℝ − {−1; 1}
    if (esInf(L[0].a) && esInf(L[L.length - 1].b) && L.every((I, k) => k === L.length - 1 || (!I.cb && !L[k + 1].ca && igual(I.b, L[k + 1].a))))
      return `ℝ ${MENOS} {${L.slice(0, -1).map(I => txF(I.b)).join('; ')}}`;
    if (L.every(I => !esInf(I.a) && igual(I.a, I.b))) return `{${L.map(I => txF(I.a)).join('; ')}}`;
    return L.map(txIv).join(' ∪ ');
  }
  const salida = L => ({ texto: texto(L), vacio: L.length === 0,
    intervalos: L.map(I => ({ a: num(I.a), b: num(I.b), ca: I.ca, cb: I.cb, texto: txIv(I) })) });

  function perteneceL(L, x) {
    return L.some(I => (cmp(x, I.a) > 0 || (igual(x, I.a) && I.ca)) && (cmp(x, I.b) < 0 || (igual(x, I.b) && I.cb)));
  }
  function complementoL(L) {
    const r = []; let a = MENOS_INF, ca = false;
    for (const I of L) { r.push(iv(a, I.a, ca, !I.ca)); a = I.b; ca = !I.cb; }
    r.push(iv(a, MAS_INF, ca, false));
    return normalizar(r);
  }
  function interseccionL(A, B) {
    const r = [];
    for (const I of A) for (const J of B) {
      const ca = cmp(I.a, J.a) > 0 ? I.ca : cmp(I.a, J.a) < 0 ? J.ca : I.ca && J.ca;
      const cb = cmp(I.b, J.b) < 0 ? I.cb : cmp(I.b, J.b) > 0 ? J.cb : I.cb && J.cb;
      const a = cmp(I.a, J.a) >= 0 ? I.a : J.a, b = cmp(I.b, J.b) <= 0 ? I.b : J.b;
      r.push(iv(a, b, ca, cb));
    }
    return normalizar(r);
  }
  function operarL(A, B, op) {
    switch (op) {
      case 'union': return normalizar(A.concat(B));
      case 'interseccion': return interseccionL(A, B);
      case 'diferencia': return interseccionL(A, complementoL(B));
      case 'complemento': return complementoL(A);
      case 'simetrica': return normalizar(interseccionL(A, complementoL(B)).concat(interseccionL(B, complementoL(A))));
      default: throw new Error("op debe ser 'union', 'interseccion', 'diferencia', 'complemento' o 'simetrica'");
    }
  }
  // Los mismos trozos con otros corchetes: cada extremo finito entra si regla(valor) es cierta
  function recorchetear(L, regla) {
    return normalizar(L.map(I => iv(I.a, I.b, esInf(I.a) ? false : regla(I.a, 'a', I), esInf(I.b) ? false : regla(I.b, 'b', I))));
  }

  // Reparte los errores: coinciden, repetidos y noAplica
  function apartar(errores, correcta) {
    const r = {}, coinciden = [], noAplica = [], repetidos = {};
    for (const [k, v] of Object.entries(errores)) {
      if (v === null || v === undefined) { noAplica.push(k); continue; }
      if (v.texto === correcta) { coinciden.push(k); continue; }
      const antes = Object.keys(r).find(q => r[q].texto === v.texto);
      if (antes) repetidos[k] = antes; else r[k] = v;
    }
    return { errores: r, coinciden, noAplica, repetidos };
  }
  const err = L => salida(L);

  // ---------- Conjunto, pertenencia, extremos ----------
  function conjunto(X) { const L = leer(X); return Object.assign(salida(L), { longitud: num(longitudL(L)), acotado: acotadoL(L) }); }
  function pertenece(o) {
    const L = leer(o.A, 'A'), x = fin(o.x, 'x'), si = perteneceL(L, x);
    return { pertenece: si, texto: `${txF(x, true)} ${si ? '∈' : '∉'} ${texto(L)}` };
  }
  // ¿Qué extremos finitos entran? Errores: corchetes al revés (NR1), todos entran o ninguno (NR2)
  function extremos(o) {
    const L = leer(o.A, 'A');
    const ext = [];
    for (const I of L) {
      if (!esInf(I.a)) ext.push({ x: I.a, entra: I.ca });
      if (!esInf(I.b) && !igual(I.a, I.b)) ext.push({ x: I.b, entra: I.cb });
    }
    const tx = f => ext.map(e => `${txF(e.x)} ${f(e) ? 'sí' : 'no'}`).join(', ');
    const correcta = tx(e => e.entra);
    const errores = {
      alReves: { texto: tx(e => !e.entra) },          // NR1
      todos: { texto: tx(() => true) },               // NR2
      ninguno: { texto: tx(() => false) }             // NR2
    };
    return Object.assign({ texto: correcta, extremos: ext.map(e => ({ x: num(e.x), texto: txF(e.x), entra: e.entra })) }, apartar(errores, correcta));
  }

  // ---------- Operaciones con conjuntos ----------
  const SIMB = { union: '∪', interseccion: '∩', diferencia: MENOS, simetrica: 'Δ' };
  function operar(o) {
    if (o && o.decimal && !DEC) { DEC = true; try { return operar(o); } finally { DEC = false; } }
    const A = leer(o.A, 'A'), op = o.op, B = op === 'complemento' ? [] : leer(o.B, 'B');
    const R = operarL(A, B, op), correcta = texto(R);
    const enA = x => perteneceL(A, x), enB = x => perteneceL(B, x);
    let errores = {};
    if (op === 'interseccion') errores = {
      comoUnion: err(operarL(A, B, 'union')),                                             // NR3
      corchetes: err(recorchetear(R, x => enA(x) || enB(x))),                               // NR4: cierra lo que está en un solo trozo
      abiertos: err(recorchetear(R, () => false)),                                          // NR4: abre todo
      vaciaSiSeTocan: R.length && R.every(I => !esInf(I.a) && igual(I.a, I.b)) ? err([]) : null,  // NR18
      comoSimetrica: err(operarL(A, B, 'simetrica'))                                        // NR3: lo que está en uno solo
    };
    else if (op === 'union') errores = {
      comoInterseccion: err(operarL(A, B, 'interseccion')),                                 // NR3
      rellenar: R.length > 1 ? err([iv(R[0].a, R[R.length - 1].b, R[0].ca, R[R.length - 1].cb)]) : null,   // NR21
      corchetes: err(recorchetear(R, x => enA(x) && enB(x)))                                // NR4
    };
    else if (op === 'diferencia') errores = {
      alReves: err(operarL(B, A, 'diferencia')),                                            // NR3 (B − A)
      comoInterseccion: err(operarL(A, B, 'interseccion')),                                 // NR3
      corchetes: err(recorchetear(R, x => enA(x)))                                          // NR4: deja el extremo que B quita
    };
    else if (op === 'complemento') errores = {
      mismosCorchetes: err(recorchetear(R, x => enA(x))),                                   // NR4
      unLado: R.length > 1 ? err([R[R.length - 1]]) : null                                 // solo el rayo de la derecha
    };
    else if (op === 'simetrica') errores = {
      comoUnion: err(operarL(A, B, 'union')), comoInterseccion: err(operarL(A, B, 'interseccion'))
    };
    const nombre = op === 'complemento' ? `${texto(A)}′` : `${texto(A)} ${SIMB[op]} ${texto(B)}`;
    return Object.assign(salida(R), { operacion: nombre }, apartar(errores, correcta));
  }

  function longitudL(L) { let s = CERO; for (const I of L) { if (esInf(I.a) || esInf(I.b)) return MAS_INF; s = fSum(s, fRes(I.b, I.a)); } return s; }
  const acotadoL = L => !L.length || (!esInf(L[0].a) && !esInf(L[L.length - 1].b));
  function longitud(o) { const L = leer(o.A, 'A'), l = longitudL(L); return { valor: num(l), texto: txF(l) }; }

  // ---------- Cotas, supremo, ínfimo, máximo y mínimo ----------
  function cotas(o) {
    const L = leer(o.A, 'A');
    if (!L.length) throw new Error('el conjunto vacío no tiene cotas útiles para esta escena');
    const ult = L[L.length - 1], pri = L[0];
    const sup = esInf(ult.b) ? null : ult.b, inf = esInf(pri.a) ? null : pri.a;
    const max = sup && ult.cb ? sup : null, min = inf && pri.ca ? inf : null;
    const txMax = max ? txF(max) : sup ? `no tiene máximo; supremo ${txF(sup)}` : 'no tiene máximo ni supremo';
    const txMin = min ? txF(min) : inf ? `no tiene mínimo; ínfimo ${txF(inf)}` : 'no tiene mínimo ni ínfimo';
    const errores = {
      supremoComoMaximo: sup ? { texto: txF(sup) } : null,                                  // NR11
      sinSupremo: sup ? { texto: 'no tiene máximo ni supremo' } : null,                     // NR12
      ultimoAntes: sup && !max ? { texto: `el número justo antes de ${txF(sup)}` } : null     // NR12 / NR9
    };
    const erroresMin = {
      infimoComoMinimo: inf ? { texto: txF(inf) } : null,
      sinInfimo: inf ? { texto: 'no tiene mínimo ni ínfimo' } : null,
      primeroDespues: inf && !min ? { texto: `el número justo después de ${txF(inf)}` } : null
    };
    const am = apartar(erroresMin, txMin);
    return Object.assign({
      acotadoSuperiormente: !!sup, acotadoInferiormente: !!inf, acotado: !!sup && !!inf,
      supremo: sup ? num(sup) : null, supremoTexto: sup ? txF(sup) : null, maximo: max ? num(max) : null, maximoTexto: txMax,
      infimo: inf ? num(inf) : null, infimoTexto: inf ? txF(inf) : null, minimo: min ? num(min) : null, minimoTexto: txMin,
      cotasSuperiores: sup ? texto([iv(sup, MAS_INF, true, false)]) : '∅', cotasInferiores: inf ? texto([iv(MENOS_INF, inf, false, true)]) : '∅',
      texto: txMax, erroresMin: am.errores, coincidenMin: am.coinciden
    }, apartar(errores, txMax));
  }

  // ---------- Valor absoluto ----------
  const OPS = { '<': '<', '<=': '<=', '≤': '<=', '>': '>', '>=': '>=', '≥': '>=' };
  const SIMBOLO = { '<': '<', '<=': '≤', '>': '>', '>=': '≥' };
  const OPUESTO = { '<': '>', '<=': '>=', '>': '<', '>=': '<=' };          // al multiplicar por un negativo
  const ESTRICTO = { '<': '<=', '<=': '<', '>': '>=', '>=': '>' };         // con o sin el igual
  function opDe(op) { const o = OPS[op]; if (!o) throw new Error('el signo debe ser <, ≤, > o ≥'); return o; }
  const conIgual = op => op === '<=' || op === '>=';
  // x op c como conjunto
  function rayo(op, c) {
    if (op === '<' || op === '<=') return [iv(MENOS_INF, c, false, op === '<=')];
    return [iv(c, MAS_INF, op === '>=', false)];
  }
  function absL(a, op, r) {
    const s = signo(r);
    if (op === '<' || op === '<=') {
      if (s < 0 || (s === 0 && op === '<')) return [];
      return [iv(fRes(a, r), fSum(a, r), op === '<=', op === '<=')];
    }
    if (s < 0 || (s === 0 && op === '>=')) return TODO();
    return normalizar([iv(MENOS_INF, fRes(a, r), false, op === '>='), iv(fSum(a, r), MAS_INF, op === '>=', false)]);
  }
  const txMenos = a => (signo(a) < 0 ? `x + ${txF(fNeg(a))}` : signo(a) === 0 ? 'x' : `x ${MENOS} ${txF(a)}`);
  function absoluto(o) {
    const a = fin(o.a, 'a'), op = opDe(o.op), r = fin(o.r, 'r');
    const R = absL(a, op, r), correcta = texto(R);
    const dentro = op === '<' || op === '<=';
    const errores = {
      sinBarras: err(rayo(op, fSum(a, r))),                                    // AL22: x − a op r
      alReves: signo(r) > 0 ? err(absL(a, OPUESTO[op], r)) : null,              // NR5
      otroCentro: signo(a) !== 0 ? err(absL(fNeg(a), op, r)) : null,            // NR6
      corchetes: signo(r) > 0 ? err(absL(a, ESTRICTO[op], r)) : null            // ≤ por <
    };
    const lectura = signo(r) <= 0 ? null : dentro
      ? `los x que están a ${op === '<' ? 'menos de' : 'lo más'} ${txF(r)} de ${txF(a)}`
      : `los x que están a ${op === '>' ? 'más de' : 'por lo menos'} ${txF(r)} de ${txF(a)}`;
    return Object.assign(salida(R), { inecuacion: `|${txMenos(a)}| ${SIMBOLO[op]} ${txF(r)}`, centro: num(a), radio: num(r), lectura,
      tipo: !R.length ? 'vacio' : R.length === 1 && !esInf(R[0].a) ? 'trozo' : R.length === 2 && esInf(R[0].a) && esInf(R[1].b) ? 'dos rayos' : 'otro' },
    apartar(errores, correcta));
  }
  // |a·x + b| op c  ⇔  |x − (−b/a)| op c/|a|
  function absolutoLineal(o) {
    const a = fin(o.a, 'a'), b = fin(o.b, 'b'), op = opDe(o.op), c = fin(o.c, 'c');
    if (a.n === 0) throw new Error('a no puede ser 0');
    const centro = fNeg(fDiv(b, a)), radio = fDiv(c, F(Math.abs(a.n), a.d));
    const R = absL(centro, op, radio), correcta = texto(R);
    // sin barras: a·x + b op c, despejando bien
    const k = fDiv(fRes(c, b), a), opS = signo(a) < 0 ? OPUESTO[op] : op;
    const dentro = op === '<' || op === '<=';
    // sin invertir: dividir entre a < 0 sin dar vuelta los extremos (solo tiene forma de intervalo si es «dentro»)
    let noInvertir = null;
    if (signo(a) < 0 && dentro && signo(c) > 0) {
      const p = fDiv(fRes(fNeg(c), b), a), q = fDiv(fRes(c, b), a), br = conIgual(op);
      noInvertir = { texto: `${br ? '[' : '⟨'}${txF(p)}; ${txF(q)}${br ? ']' : '⟩'}` };   // AL20: queda con los extremos al revés
    }
    const errores = { sinBarras: err(rayo(opS, k)), noInvertir, alReves: signo(radio) > 0 ? err(absL(centro, OPUESTO[op], radio)) : null };
    const lado = `${txF(a) === '1' ? '' : txF(a) === MENOS + '1' ? MENOS : txF(a)}x${signo(b) < 0 ? ` ${MENOS} ${txF(fNeg(b))}` : signo(b) > 0 ? ` + ${txF(b)}` : ''}`;
    return Object.assign(salida(R), { inecuacion: `|${lado}| ${SIMBOLO[op]} ${txF(c)}`, centro: num(centro), centroTexto: txF(centro), radio: num(radio), radioTexto: txF(radio) },
      apartar(errores, correcta));
  }
  function distancia(o) {
    const p = fin(o.p, 'p'), q = fin(o.q, 'q'), d = fRes(p, q), v = signo(d) < 0 ? fNeg(d) : d;
    const par = x => (signo(x) < 0 ? `(${txF(x)})` : txF(x));
    const errores = {
      sinAbsoluto: { valor: num(d), texto: txF(d) },
      restaDeAbsolutos: (() => { const x = fRes(signo(p) < 0 ? fNeg(p) : p, signo(q) < 0 ? fNeg(q) : q); const y = signo(x) < 0 ? fNeg(x) : x; return { valor: num(y), texto: txF(y) }; })()
    };
    return Object.assign({ valor: num(v), texto: txF(v), cuenta: `|${txF(p)} ${MENOS} ${par(q)}| = |${txF(d)}| = ${txF(v)}` }, apartar(errores, txF(v)));
  }

  // ---------- Imagen de un intervalo: dónde está f(x) si x ∈ A ----------
  const cuadradoF = a => (esInf(a) ? MAS_INF : fMul(a, a));
  const absF = a => (esInf(a) ? MAS_INF : signo(a) < 0 ? fNeg(a) : a);
  const invF = (a, lado) => (esInf(a) ? CERO : a.n === 0 ? (lado > 0 ? MAS_INF : MENOS_INF) : fDiv(UNO, a));
  // Imagen de un trozo donde g es monótona: crece → mismos corchetes; decrece → se dan vuelta
  function monotona(I, g, crece) {
    const ga = g(I.a, 1), gb = g(I.b, -1);
    return crece ? iv(ga, gb, I.ca, I.cb) : iv(gb, ga, I.cb, I.ca);
  }
  const NEG = [iv(MENOS_INF, CERO, false, true)], POS = [iv(CERO, MAS_INF, true, false)];
  const NEG0 = [iv(MENOS_INF, CERO, false, false)], POS0 = [iv(CERO, MAS_INF, false, false)];
  // Texto de dos extremos tal como quedan, sin ordenar ni normalizar ([5; −5⟩)
  const crudo = (p, q, cp, cq) => `${cp ? '[' : '⟨'}${txF(p)}; ${txF(q)}${cq ? ']' : '⟩'}`;
  // Ordena dos extremos llevando cada corchete pegado a su número
  function ordenarExt(p, q, cp, cq) { return cmp(p, q) <= 0 ? normalizar([iv(p, q, cp, cq)]) : normalizar([iv(q, p, cq, cp)]); }
  function imagen(o) {
    const A = leer(o.A, 'A'), f = typeof o.f === 'string' ? { tipo: o.f } : o.f;
    if (!f || !f.tipo) throw new Error("f debe ser { tipo: 'afin', k, t }, 'cuadrado', 'inverso' o 'absoluto'");
    if (A.length !== 1) throw new Error('A debe ser un solo intervalo');
    const I = A[0];
    let R, errores = {}, nombre;
    if (f.tipo === 'afin') {
      const k = fin(f.k, 'k'), t = f.t === undefined ? CERO : fin(f.t, 't');
      if (k.n === 0) throw new Error('k no puede ser 0');
      const g = a => (esInf(a) ? (signo(k) > 0 ? a : fNeg(a)) : fSum(fMul(k, a), t));
      R = normalizar([monotona(I, g, signo(k) > 0)]);
      const ga = g(I.a), gb = g(I.b);
      errores = signo(k) < 0 ? {
        sinVoltear: { texto: crudo(ga, gb, I.ca, I.cb) },                                     // AL20
        corchetesSinVoltear: err(normalizar([iv(gb, ga, I.ca, I.cb)]))                        // NR20
      } : { sinVoltear: null, corchetesSinVoltear: null };
      // olvidar sumar t: queda la imagen de k·x (NR22)
      errores.sinSumar = t.n === 0 ? null : err(normalizar([monotona(I, a => (esInf(a) ? (signo(k) > 0 ? a : fNeg(a)) : fMul(k, a)), signo(k) > 0)]));
      const tk = txF(k), tt = t.n === 0 ? '' : signo(t) < 0 ? ` ${MENOS} ${txF(fNeg(t))}` : ` + ${txF(t)}`;
      nombre = (tk === '1' ? '' : tk === MENOS + '1' ? MENOS : tk) + 'x' + tt;
    } else if (f.tipo === 'cuadrado' || f.tipo === 'absoluto') {
      const g = f.tipo === 'cuadrado' ? cuadradoF : absF;
      const Ln = interseccionL(A, NEG), Lp = interseccionL(A, POS);
      R = normalizar(Ln.map(J => monotona(J, g, false)).concat(Lp.map(J => monotona(J, g, true))));
      const conSigno = a => (esInf(a) ? a : signo(a) < 0 ? fNeg(g(a)) : g(a));
      errores = {
        extremos: err(ordenarExt(g(I.a), g(I.b), I.ca, I.cb)),                                // NR7
        signo: f.tipo === 'cuadrado' ? err(ordenarExt(conSigno(I.a), conSigno(I.b), I.ca, I.cb)) : null   // NR8
      };
      nombre = f.tipo === 'cuadrado' ? 'x²' : '|x|';
    } else if (f.tipo === 'inverso') {
      const Ln = interseccionL(A, NEG0), Lp = interseccionL(A, POS0);
      R = normalizar(Ln.map(J => monotona(J, invF, false)).concat(Lp.map(J => monotona(J, invF, false))));
      const parte = cmp(I.a, CERO) < 0 && cmp(I.b, CERO) > 0;
      errores = {
        sinPartir: parte && !esInf(I.a) && !esInf(I.b) ? err(ordenarExt(invF(I.a), invF(I.b), I.ca, I.cb)) : null,   // NR17
        soloPositivos: parte ? err(Lp.map(J => monotona(J, invF, false))) : null,                                    // NR17
        quitaCero: parte && !esInf(I.a) && !esInf(I.b) ? { texto: `${texto(ordenarExt(invF(I.a), invF(I.b), I.ca, I.cb))} ${MENOS} {0}` } : null,   // NR17: solo saca el 0
        sinVoltear: !parte && !esInf(I.a) && !esInf(I.b) && I.a.n !== 0 && I.b.n !== 0 ? { texto: crudo(invF(I.a), invF(I.b), I.ca, I.cb) } : null
      };
      nombre = '1/x';
    } else throw new Error(`no conozco la función «${f.tipo}»`);
    errores.cerrados = err(recorchetear(R, () => true));                                       // NR4: todos los extremos cerrados
    return Object.assign(salida(R), { expresion: nombre, de: texto(A) }, apartar(errores, texto(R)));
  }

  // ---------- Desigualdades ----------
  function multiplicar(o) {
    const op = opDe(o.op), k = fin(o.k, 'k');
    if (k.n === 0) return { op: null, texto: 'queda 0 = 0: multiplicar por 0 borra la desigualdad', errores: {}, coinciden: [], noAplica: [], repetidos: {} };
    const r = signo(k) > 0 ? op : OPUESTO[op];
    return Object.assign({ op: r, simbolo: SIMBOLO[r], texto: SIMBOLO[r], invierte: signo(k) < 0 },
      apartar({ sinInvertir: signo(k) < 0 ? { texto: SIMBOLO[op] } : null, invertirSiempre: signo(k) > 0 ? { texto: SIMBOLO[OPUESTO[op]] } : null }, SIMBOLO[r]));
  }
  // lo opLo a·x + b opHi hi (opLo y opHi son '<' o '<=')
  function cadena(o) {
    const lo = fin(o.lo, 'lo'), hi = fin(o.hi, 'hi'), a = fin(o.a, 'a'), b = o.b === undefined ? CERO : fin(o.b, 'b');
    const oL = opDe(o.opLo || '<'), oH = opDe(o.opHi || '<');
    if ((oL !== '<' && oL !== '<=') || (oH !== '<' && oH !== '<=')) throw new Error('en una cadena los signos van como lo < … < hi');
    if (a.n === 0) throw new Error('a no puede ser 0');
    const p = fDiv(fRes(lo, b), a), q = fDiv(fRes(hi, b), a);
    const R = signo(a) > 0 ? normalizar([iv(p, q, oL === '<=', oH === '<=')]) : normalizar([iv(q, p, oH === '<=', oL === '<=')]);
    const s = op => SIMBOLO[op];
    const pasos = [
      `${txF(lo)} ${s(oL)} ${txF(a)}x${signo(b) < 0 ? ` ${MENOS} ${txF(fNeg(b))}` : signo(b) > 0 ? ` + ${txF(b)}` : ''} ${s(oH)} ${txF(hi)}`,
      `${txF(fRes(lo, b))} ${s(oL)} ${txF(a)}x ${s(oH)} ${txF(fRes(hi, b))}`,
      signo(a) > 0 ? `${txF(p)} ${s(oL)} x ${s(oH)} ${txF(q)}` : `${txF(q)} ${s(OPUESTO[oH] === '>' ? '<' : '<=')} x ${s(OPUESTO[oL] === '>' ? '<' : '<=')} ${txF(p)}`
    ];
    const pa = fDiv(lo, a), qa = fDiv(hi, a);
    const errores = {
      sinInvertir: signo(a) < 0 ? { texto: `${txF(p)} ${s(oL)} x ${s(oH)} ${txF(q)}` } : null,                       // AL20
      soloAlMedio: b.n !== 0 ? err(signo(a) > 0 ? normalizar([iv(pa, qa, oL === '<=', oH === '<=')]) : normalizar([iv(qa, pa, oH === '<=', oL === '<=')])) : null
    };
    return Object.assign(salida(R), { pasos }, apartar(errores, texto(R)));
  }
  // Método de los puntos críticos: k·∏(a·x + b) / ∏(c·x + d) op 0
  function signosL(num0, den0, op, k) {
    const fac = (L, que) => (L || []).map(([a, b], i) => { const A = fin(a, `${que} ${i + 1}`), B = fin(b, `${que} ${i + 1}`); if (A.n === 0) throw new Error(`${que} ${i + 1}: a no puede ser 0`); return [A, B]; });
    const N = fac(num0, 'el factor'), D = fac(den0, 'el factor del denominador');
    const raices = N.concat(D).map(([a, b]) => fNeg(fDiv(b, a))).sort(cmp).filter((r, i, L) => i === 0 || !igual(r, L[i - 1]));
    const valor = x => {
      let s = signo(k);
      for (const [a, b] of N) s *= signo(fSum(fMul(a, x), b));
      for (const [a, b] of D) { const v = signo(fSum(fMul(a, x), b)); if (v === 0) return null; s *= v; }
      return s;
    };
    const cumple = s => s !== null && (op === '<' ? s < 0 : op === '<=' ? s <= 0 : op === '>' ? s > 0 : s >= 0);
    const piezas = [], tabla = [];
    const cortes = [MENOS_INF].concat(raices, [MAS_INF]);
    for (let i = 0; i < cortes.length - 1; i++) {
      const p = cortes[i], q = cortes[i + 1];
      const t = esInf(p) ? (esInf(q) ? CERO : fRes(q, UNO)) : esInf(q) ? fSum(p, UNO) : fDiv(fSum(p, q), F(2));
      const s = valor(t);
      tabla.push({ de: txF(p), a: txF(q), signo: s > 0 ? '+' : MENOS });
      if (cumple(s)) piezas.push(iv(p, q, false, false));
    }
    for (const r of raices) if (cumple(valor(r))) piezas.push(iv(r, r, true, true));
    return { L: normalizar(piezas), raices, tabla };
  }
  function signos(o) {
    const op = opDe(o.op), k = o.k === undefined ? UNO : fin(o.k, 'k');
    const S = signosL(o.num, o.den, op, k);
    return Object.assign(salida(S.L), { criticos: S.raices.map(r => txF(r)), tabla: S.tabla });
  }
  function raizExacta(c) {
    const r = x => { const s = Math.round(Math.sqrt(x)); return s * s === x ? s : null; };
    const p = r(Math.abs(c.n)), q = r(c.d);
    if (p === null || q === null) throw new Error('c debe ser el cuadrado de un racional');
    return F(p, q);
  }
  function cuadradoDesigualdad(o) {
    const op = opDe(o.op), c = fin(o.c, 'c');
    let R;
    if (signo(c) < 0) R = op === '<' || op === '<=' ? [] : TODO();
    else { const s = raizExacta(c); R = signosL([[1, fNeg(s)], [1, s]], [], op, UNO).L; }
    const errores = { comoEcuacion: signo(c) >= 0 ? err(rayo(op, raizExacta(c))) : null };   // AL19: x² < 9 ⇒ x < 3
    return Object.assign(salida(R), { inecuacion: `x² ${SIMBOLO[op]} ${txF(c)}` }, apartar(errores, texto(R)));
  }
  // 1/x op c. Se multiplica por x² (positivo si x ≠ 0): x op c·x², es decir, x·(1 − c·x) op 0.
  function inversa(o) {
    const op = opDe(o.op), c = fin(o.c, 'c');
    // 1/x − c = (1 − c·x)/x op 0
    const S = c.n === 0 ? signosL([], [[1, 0]], op, UNO) : signosL([[fNeg(c), 1]], [[1, 0]], op, UNO);
    // multiplicar por x como si fuera positivo: 1 op c·x (AL21)
    let porX = null, sinVoltear = null;
    if (c.n !== 0) {
      const opx = signo(c) > 0 ? OPUESTO[op] : op;    // 1 op c·x ⇔ c·x OPUESTO 1 ⇔ x … 1/c
      porX = err(rayo(opx, fDiv(UNO, c)));
      sinVoltear = err(rayo(op, fDiv(UNO, c)));        // «invierto los dos lados»: x op 1/c
    }
    const pasos = c.n === 0 ? null : [`1/x ${SIMBOLO[op]} ${txF(c)}`, `x ${SIMBOLO[op]} ${txF(c)}x²  (por x², que es positivo)`,
      `x·(1 ${signo(c) > 0 ? MENOS : '+'} ${txF(signo(c) > 0 ? c : fNeg(c)) === '1' ? '' : txF(signo(c) > 0 ? c : fNeg(c))}x) ${SIMBOLO[op]} 0`.replace('  ', ' ')];
    return Object.assign(salida(S.L), { inecuacion: `1/x ${SIMBOLO[op]} ${txF(c)}`, criticos: S.raices.map(r => txF(r)), pasos },
      apartar({ porX, sinVoltear }, texto(S.L)));
  }

  // ---------- Densidad ----------
  function txRad(r, s, decimal) {   // r + s·√2
    const ts = s.n === 1 && s.d !== 1 ? `√2/${s.d}` : s.d === 1 ? `${s.n === 1 ? '' : s.n}√2` : `${s.n}√2/${s.d}`;
    return r.n === 0 ? ts : `${txF(r, decimal)} + ${ts}`;
  }
  const aprox = (x, k) => { const p = Math.pow(10, k || 4), v = Math.floor(x * p) / p; return String(v).replace('.', ',') + '…'; };
  function entre(o) {
    let p = fin(o.p, 'p'), q = fin(o.q, 'q');
    if (igual(p, q)) throw new Error('p y q son el mismo número: entre ellos no hay ninguno');
    if (cmp(p, q) > 0) [p, q] = [q, p];
    const m = fDiv(fSum(p, q), F(2)), n = o.n === undefined ? 3 : o.n;
    if (!Number.isInteger(n) || n < 1 || n > 50) throw new Error('n debe ser un entero de 1 a 50');
    const h = fDiv(fRes(q, p), F(n + 1)), rac = [];
    for (let i = 1; i <= n; i++) rac.push(fSum(p, fMul(h, F(i))));
    // un cuarto del ancho por √2: p < p + s·√2 < q porque 0 < √2 < 4 (y no cae en las marcas de décimos de la lupa)
    const s = fDiv(fRes(q, p), F(4)), irr = num(p) + num(s) * Math.SQRT2;
    const dec = esDecimal(p) && esDecimal(q), t = x => txF(x, dec);   // con coma decimal solo si p y q la tienen
    return { p: t(p), q: t(q), promedio: num(m), promedioTexto: t(m), cuenta: `(${t(p)} + ${t(q)})/2 = ${t(m)}`,
      racionales: rac.map(t), racionalesValor: rac.map(num),
      irracional: { valor: irr, texto: txRad(p, s, dec), aproximado: aprox(irr, Math.max(4, String(q.d).length + 3)), forma: { r: num(p), s: num(s) } } };
  }
  // «El número que sigue a x» no existe: para cada candidato, el promedio queda en medio.
  function siguiente(o) {
    const x = fin(o.x, 'x'), dec = txF(x, true), tieneComa = dec.includes(',');
    const cifras = tieneComa ? dec.split(',')[1].length : 0;
    const paso = F(1, Math.pow(10, cifras + 1));
    const candidato = c => { const m = fDiv(fSum(x, c), F(2)); return { texto: txF(c, true), valor: num(c), contraejemplo: txF(m, true) }; };
    const errores = {
      unaCifraMas: candidato(fSum(x, paso)),                                                            // NR9: 0,9 → 0,91
      siguienteEntero: candidato(F(Math.floor(num(x)) + 1)),                                            // NR9: 0,9 → 1
      infinitosCeros: { texto: `${dec}${tieneComa ? '' : ','}000…1`, contraejemplo: null }               // NR10: 0,9000…1
    };
    return Object.assign({ existe: false, texto: 'no hay', x: dec }, apartar(errores, 'no hay'));
  }
  // Número periódico: entero, antes (cifras no periódicas) y periodo (cifras que se repiten), como textos de cifras
  function leerPeriodico(o) {
    const e = String(o.entero === undefined ? 0 : o.entero), a = String(o.antes || ''), p = String(o.periodo || '');
    if (!/^\d+$/.test(e) || !/^\d*$/.test(a) || !/^\d+$/.test(p)) throw new Error('entero, antes y periodo deben ser cifras');
    return { e, a, p };
  }
  function genF(e, a, p) {   // 0,a(p) = (ap − a) / (9…9 0…0)
    const numer = Number(a + p) - Number(a || 0), denom = Number('9'.repeat(p.length) + '0'.repeat(a.length));
    return fSum(F(Number(e)), F(numer, denom));
  }
  function generatriz(o) {
    const { e, a, p } = leerPeriodico(o);
    const v = genF(e, a, p);
    const dec = `${e},${a}${p.repeat(Math.max(1, Math.ceil(3 / p.length)))}…`;
    const nueves = /^9+$/.test(p);
    const errores = {
      justoAntes: nueves ? { texto: `${dec} < ${txF(v)}: es el número justo antes de ${txF(v)}` } : null,   // NR10
      porPoco: nueves ? { texto: `${dec} < ${txF(v)}: le falta 0,000…1` } : null,                            // NR10
      nuncaLlega: nueves ? { texto: `${dec} < ${txF(v)}: se acerca a ${txF(v)}, pero nunca llega` } : null      // NR10: un proceso que no termina
    };
    return Object.assign({ valor: num(v), texto: txF(v), decimal: dec, igualdad: `${dec} = ${txF(v)}`, relacion: nueves ? `${dec} = ${txF(v)}` : null },
      apartar(errores, `${dec} = ${txF(v)}`));
  }
  // Truncamiento con n cifras decimales y el hueco que le falta para llegar al número
  function aproximar(o) {
    const { e, a, p } = leerPeriodico(o), n = o.n;
    if (!Number.isInteger(n) || n < 1 || n > 12) throw new Error('n debe ser un entero de 1 a 12');
    let cif = a; while (cif.length < n) cif += p; cif = cif.slice(0, n);
    const t = fSum(F(Number(e)), F(Number(cif), Math.pow(10, n)));
    const G = genF(e, a, p), hueco = fRes(G, t);
    return { truncado: num(t), truncadoTexto: txF(t, true), hueco: num(hueco), huecoTexto: txF(hueco, true), generatriz: txF(G) };
  }

  // ---------- Operaciones binarias ----------
  function operacionTabla(o) {
    const E = (o.elementos || []).map(String), T = (o.tabla || []).map(f => f.map(String)), n = E.length;
    if (!n || T.length !== n || T.some(f => f.length !== n)) throw new Error('la tabla debe ser cuadrada, una fila por elemento');
    const idx = x => E.indexOf(String(x)), op = (x, y) => T[idx(x)][idx(y)];
    const cerrada = T.every(f => f.every(v => idx(v) >= 0));
    let noConm = null;
    for (const x of E) for (const y of E) if (!noConm && op(x, y) !== op(y, x)) noConm = { a: x, b: y, ab: op(x, y), ba: op(y, x) };
    let noAsoc = null;
    if (cerrada) for (const x of E) for (const y of E) for (const z of E) if (!noAsoc && op(op(x, y), z) !== op(x, op(y, z))) noAsoc = { a: x, b: y, c: z, izq: op(op(x, y), z), der: op(x, op(y, z)) };
    const izq = E.filter(e => E.every(x => op(e, x) === x)), der = E.filter(e => E.every(x => op(x, e) === x));
    const neutro = izq.find(e => der.includes(e)) || null;
    const inversos = {};
    if (neutro !== null) for (const x of E) inversos[x] = E.find(y => op(x, y) === neutro && op(y, x) === neutro) || null;
    // en la diagonal: lo que más sale ahí (empate: lo que aparece primero)
    const diag = E.map(x => op(x, x)), cuenta = {};
    diag.forEach(v => { cuenta[v] = (cuenta[v] || 0) + 1; });
    const masDiag = diag.reduce((m, v) => (cuenta[v] > cuenta[m] ? v : m), diag[0]);
    const correcta = neutro === null ? 'no tiene' : neutro;
    const errores = {
      diagonal: { texto: masDiag },                                                             // NR13
      primero: { texto: E[0] },                                                                 // NR14
      unLado: neutro === null && (izq.length || der.length) ? { texto: (izq[0] !== undefined ? izq[0] : der[0]), lado: izq.length ? 'fila' : 'columna' } : null,   // NR15
      noTiene: neutro !== null ? { texto: 'no tiene' } : null                                  // NR23
    };
    return Object.assign({ cerrada, conmutativa: !noConm, testigoNoConmutativa: noConm, asociativa: cerrada ? !noAsoc : null, testigoNoAsociativa: noAsoc,
      neutro, neutroIzquierda: izq, neutroDerecha: der, inversos, diagonal: diag, texto: correcta }, apartar(errores, correcta));
  }
  function inversoTabla(o) {
    const P = operacionTabla(o), x = String(o.x);
    if (!o.elementos.map(String).includes(x)) throw new Error(`${x} no es un elemento de la tabla`);
    if (P.neutro === null) return { inverso: null, texto: 'no hay neutro: no tiene sentido hablar de inverso', errores: {}, coinciden: [], noAplica: [], repetidos: {} };
    const E = o.elementos.map(String), T = o.tabla.map(f => f.map(String));
    const inv = P.inversos[x], correcta = inv === null ? 'no tiene' : inv;
    const errores = {
      diagonal: { texto: T[E.indexOf(x)][E.indexOf(x)] },        // NR16: x ∗ x
      neutro: { texto: P.neutro },                                // NR16: el inverso es el neutro
      elMismo: { texto: x }
    };
    return Object.assign({ inverso: inv, texto: correcta, neutro: P.neutro, cuenta: inv === null ? null : `${x} ∗ ${inv} = ${P.neutro}` }, apartar(errores, correcta));
  }
  // a ∗ b = α·a + β·b + γ·a·b + δ
  function operacionFormula(o) {
    const al = fin(o.alfa === undefined ? 0 : o.alfa, 'alfa'), be = fin(o.beta === undefined ? 0 : o.beta, 'beta');
    const ga = fin(o.gamma === undefined ? 0 : o.gamma, 'gamma'), de = fin(o.delta === undefined ? 0 : o.delta, 'delta');
    const term = (k, v, primero) => {
      if (k.n === 0) return '';
      const abs = F(Math.abs(k.n), k.d), c = abs.n === 1 && abs.d === 1 ? '' : txF(abs);
      return (k.n < 0 ? (primero ? MENOS : ` ${MENOS} `) : (primero ? '' : ' + ')) + c + v;
    };
    let tx = ''; [[al, 'a'], [be, 'b'], [ga, 'ab']].forEach(([k, v]) => { tx += term(k, v, tx === ''); });
    if (de.n !== 0) tx += tx === '' ? txF(de) : (de.n < 0 ? ` ${MENOS} ${txF(fNeg(de))}` : ` + ${txF(de)}`);
    if (tx === '') tx = '0';
    // Polinomios multilineales en a, b, c: clave = letras presentes
    const suma = (P, Q) => { const r = Object.assign({}, P); for (const [k, v] of Object.entries(Q)) r[k] = r[k] ? fSum(r[k], v) : v; return r; };
    const porK = (P, k) => { const r = {}; for (const [m, v] of Object.entries(P)) r[m] = fMul(v, k); return r; };
    const f = (P, Q) => suma(suma(suma(porK(P, al), porK(Q, be)), porK(producto(P, Q), ga)), { '': de });
    function producto(P, Q) { let r = {}; for (const [m, v] of Object.entries(Q)) { let t = {}; for (const [m2, v2] of Object.entries(P)) t[(m2 + m).split('').sort().join('')] = fMul(v2, v); r = suma(r, t); } return r; }
    const va = { a: UNO }, vb = { b: UNO }, vc = { c: UNO };
    const iz = f(f(va, vb), vc), dr = f(va, f(vb, vc));
    const claves = new Set(Object.keys(iz).concat(Object.keys(dr)));
    const asociativa = [...claves].every(k => igual(iz[k] || CERO, dr[k] || CERO));
    // neutro: a ∗ e = a  ⇔ γe = 1 − α y βe = −δ;  e ∗ a = a  ⇔ γe = 1 − β y αe = −δ
    const resolver = (k1, c1, k2, c2) => {     // k1·e = c1 y k2·e = c2
      let e = null;
      if (k1.n !== 0) e = fDiv(c1, k1); else if (c1.n !== 0) return null;
      if (k2.n !== 0) { const e2 = fDiv(c2, k2); if (e !== null && !igual(e, e2)) return null; e = e2; } else if (c2.n !== 0) return null;
      return e;
    };
    const eD = resolver(ga, fRes(UNO, al), be, fNeg(de)), eI = resolver(ga, fRes(UNO, be), al, fNeg(de));
    const neutro = eD !== null && eI !== null && igual(eD, eI) ? eD : null;
    const r = { texto: `a ∗ b = ${tx}`, conmutativa: igual(al, be), asociativa, neutro: neutro ? num(neutro) : null, neutroTexto: neutro ? txF(neutro) : 'no tiene' };
    r.erroresNeutro = apartar({ cero: { texto: '0' }, uno: { texto: '1' } }, r.neutroTexto);
    if (o.x !== undefined && neutro) {
      const x = fin(o.x, 'x'), den = fSum(be, fMul(ga, x));
      const y = den.n === 0 ? null : fDiv(fRes(fRes(neutro, fMul(al, x)), de), den);
      const ok = y !== null && igual(fSum(fSum(fSum(fMul(al, y), fMul(be, x)), fMul(ga, fMul(y, x))), de), neutro);
      r.inverso = ok ? num(y) : null; r.inversoTexto = ok ? txF(y) : 'no tiene';
      r.cuenta = ok ? `${txF(x)} ∗ ${signo(y) < 0 ? `(${txF(y)})` : txF(y)} = ${txF(neutro)}` : null;
      Object.assign(r, apartar({ opuesto: { texto: txF(fNeg(x)) }, reciproco: x.n !== 0 ? { texto: txF(fDiv(UNO, x)) } : null,
        neutroMenos: { texto: txF(fRes(neutro, x)) } }, r.inversoTexto));
    }
    // valor numérico de a ∗ b
    r.valor = (a, b) => { const A = fin(a), B = fin(b); return num(fSum(fSum(fSum(fMul(al, A), fMul(be, B)), fMul(ga, fMul(A, B))), de)); };
    return r;
  }

  return {
    conjunto, pertenece, extremos, operar, longitud, cotas, absoluto, absolutoLineal, distancia, imagen,
    multiplicar, cadena, signos, cuadradoDesigualdad, inversa, entre, siguiente, generatriz, aproximar,
    operacionTabla, inversoTabla, operacionFormula,
    textoNumero: (x, decimal) => txF(aF(x), decimal),
    textoConjunto: (X, decimal) => { const d = DEC; DEC = !!decimal; try { return texto(leer(X)); } finally { DEC = d; } },
    contiene: (X, x) => perteneceL(leer(X), fin(x))
  };
});
