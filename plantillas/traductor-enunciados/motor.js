/*
 * Motor de «El traductor de enunciados»: letras, ecuaciones y planteo.
 *
 * Aquí vive toda la matemática de la plantilla (regla 1 de CLAUDE.md). No toca el DOM:
 * funciona igual en el navegador (window.MotorTraductor) y en Node (require('./motor.js')),
 * donde lo prueban casos.json y papel.json. No usa eval: las expresiones las lee un analizador propio.
 *
 *   analizar(texto)                       lee una expresión o una ecuación ('S = 6P', '(x − 3)(x − 5) = 8', '2x − 3')
 *   texto(texto | árbol)                  la escribe bonita, con − tipográfico, · y exponentes: '2(x − 3)', 'x² − 5x'
 *   polinomio(texto)                      la expresión como polinomio normalizado: { texto, grado, variables, coef }
 *   evaluar(texto, valores)               sustituye y calcula, con fracciones exactas
 *   comprobar(ecuacion, valores)          ¿la ecuación es verdadera con esos valores? con la sustitución escrita
 *   porCada({ n, m, letraN, letraM, valorM })   «hay n N por cada m M»: m·N = n·M, la invertida y la aditiva
 *   traducir(frase, letras)               frase tipo examen → expresión o ecuación (plantillas de frase con parámetros)
 *   cadena(x, ops)                        la «máquina» de la frase: el número pasa por cada operación, en orden
 *   resolver(ecuacion, variable)          lineal o cuadrática, con pasos, soluciones exactas y sus errores típicos
 *   balanza(ecuacion, operaciones)        la misma operación a los dos lados (o a uno solo): qué soluciones se ganan o pierden
 *   pesos(ecuacion, valores)              lo que pesa cada plato con un valor de la variable: para inclinar la balanza
 *   sistema(ec1, ec2)                     sistema lineal 2 × 2: única, ninguna o infinitas; eliminación con su error
 *   edades({ conocida, valor, incognita, tiempo, k })   «hace n años la edad de A era k veces la de B»
 *   lineaEdades(edades, tiempos)          las edades a lo largo del tiempo: la diferencia no cambia, la razón sí
 *   sumaEdades({ suma, personas, tiempo }) cuánto suman las edades dentro de n años
 *   moviles({ distancia, v1, v2, sentido })   encuentro (sentidos opuestos) o alcance (mismo sentido)
 *   posiciones(movil, t)                  dónde está cada móvil en el instante t
 *   mezcla({ cantidad, precio1, precio2, precioMezcla })   mezcla de dos ingredientes como sistema 2 × 2
 *   comparar(e1, e2, variable)            ¿cuál es mayor, 2n o n + 2? depende de n
 *
 * Cada resultado que es la respuesta de una predicción trae un campo 'errores' con lo que dan los errores
 * típicos de docs/investigacion/algebra-funciones-ideas-erroneas.md (AL1, AL3, AL5, AL6, AL14 a AL18) y de
 * docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md (RM1, RM3, RM4): son las opciones incorrectas.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorTraductor = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const TOL = 1e-9;
  function numero(x, que, o) {
    o = o || {};
    if (typeof x !== 'number' || !Number.isFinite(x)) throw new Error(`${que} debe ser un número`);
    if (o.positivo && !(x > 0)) throw new Error(`${que} debe ser mayor que cero`);
    if (o.entero && !Number.isInteger(x)) throw new Error(`${que} debe ser un número entero`);
    return x;
  }
  const limpio = x => (Math.abs(x - Math.round(x)) <= TOL * Math.max(1, Math.abs(x)) ? Math.round(x) + 0 : x + 0);

  // ---------- Fracciones exactas ----------
  function mcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; }
  function F(n, d) {
    if (d === undefined) d = 1;
    if (!Number.isSafeInteger(n) || !Number.isSafeInteger(d)) throw new Error('números demasiado grandes para el motor');
    if (d === 0) throw new Error('división entre cero');
    if (d < 0) { n = -n; d = -d; }
    const g = mcd(n, d) || 1;
    return { n: n / g + 0, d: d / g };
  }
  const fSum = (a, b) => F(a.n * b.d + b.n * a.d, a.d * b.d);
  const fRes = (a, b) => F(a.n * b.d - b.n * a.d, a.d * b.d);
  const fMul = (a, b) => F(a.n * b.n, a.d * b.d);
  const fDiv = (a, b) => { if (b.n === 0) throw new Error('división entre cero'); return F(a.n * b.d, a.d * b.n); };
  const fNeg = a => F(-a.n, a.d);
  const fCero = a => a.n === 0;
  const fIgual = (a, b) => a.n === b.n && a.d === b.d;
  const fNum = a => a.n / a.d;
  function fPot(a, e) { let r = F(1); for (let k = 0; k < e; k++) r = fMul(r, a); return r; }
  // Un número de JS como fracción exacta (2.5 → 5/2); los decimales de hasta 9 cifras.
  function aF(x) {
    if (typeof x === 'object' && x && 'n' in x) return x;
    numero(x, 'el valor');
    for (let q = 1; q <= 1e9; q *= 10) { const p = Math.round(x * q); if (Math.abs(p / q - x) <= 1e-12 * Math.max(1, Math.abs(x))) return F(p, q); }
    // fracciones como 1/3 o 34/15, que llegan como decimales periódicos
    for (let q = 2; q <= 20000; q++) { const p = Math.round(x * q); if (Math.abs(p / q - x) <= 1e-12 * Math.max(1, Math.abs(x))) return F(p, q); }
    throw new Error('el valor no tiene una fracción exacta corta');
  }
  const MENOS = '−';
  const txF = a => (a.n < 0 ? MENOS : '') + (a.d === 1 ? String(Math.abs(a.n)) : `${Math.abs(a.n)}/${a.d}`);

  // ---------- Lector de expresiones (sin eval) ----------
  // Fichas: números (coma o punto decimal), letras sueltas (cada letra es una variable), + − · / ^ ( ) =.
  function fichas(t) {
    if (typeof t !== 'string' || !t.trim()) throw new Error('falta la expresión');
    const s = t.replace(/[−–]/g, '-').replace(/[·×*]/g, '*').replace(/÷/g, '/').replace(/[⁰¹²³⁴⁵⁶]/g, c => '^' + '⁰¹²³⁴⁵⁶'.indexOf(c));
    const out = [];
    for (let i = 0; i < s.length;) {
      const ch = s[i];
      if (/\s/.test(ch)) { i++; continue; }
      if (/[0-9]/.test(ch)) {
        let j = i; while (j < s.length && /[0-9]/.test(s[j])) j++;
        if ((s[j] === ',' || s[j] === '.') && /[0-9]/.test(s[j + 1] || '')) { j++; while (j < s.length && /[0-9]/.test(s[j])) j++; }
        out.push({ t: 'num', v: aF(Number(s.slice(i, j).replace(',', '.'))) }); i = j; continue;
      }
      if (/[a-zA-Z]/.test(ch)) { out.push({ t: 'var', v: ch }); i++; continue; }
      if ('+-*/^()='.includes(ch)) { out.push({ t: ch }); i++; continue; }
      throw new Error(`no entiendo el símbolo «${ch}»`);
    }
    return out;
  }
  function leer(t) {
    const fs = fichas(t); let k = 0;
    const ver = () => fs[k], tomar = () => fs[k++];
    const esperar = c => { const f = tomar(); if (!f || f.t !== c) throw new Error(c === ')' ? 'falta cerrar un paréntesis' : `se esperaba «${c}»`); };
    function expr() {
      let a = termino();
      while (ver() && (ver().t === '+' || ver().t === '-')) { const op = tomar().t; a = { t: op, a, b: termino() }; }
      return a;
    }
    function termino() {
      let a = unario();
      for (;;) {
        const f = ver();
        if (f && (f.t === '*' || f.t === '/')) { tomar(); a = { t: f.t, a, b: unario() }; continue; }
        // multiplicación sin signo: 6P, 2(x − 3), (x − 3)(x − 5), x(x + 1)
        if (f && (f.t === 'var' || f.t === '(')) { a = { t: '*', a, b: potencia(), junto: true }; continue; }
        if (f && f.t === 'num') throw new Error('falta un signo entre dos números');
        return a;
      }
    }
    function unario() {
      const f = ver();
      if (f && f.t === '-') { tomar(); return { t: 'neg', a: unario() }; }
      if (f && f.t === '+') { tomar(); return unario(); }
      return potencia();
    }
    function potencia() {
      const a = atomo();
      if (ver() && ver().t === '^') {
        tomar();
        const e = ver();
        if (!e || e.t !== 'num' || e.v.d !== 1 || e.v.n < 0 || e.v.n > 6) throw new Error('el exponente debe ser un entero de 0 a 6');
        tomar(); return { t: '^', a, e: e.v.n };
      }
      return a;
    }
    function atomo() {
      const f = tomar();
      if (!f) throw new Error('la expresión termina antes de tiempo');
      if (f.t === 'num') return { t: 'num', v: f.v };
      if (f.t === 'var') return { t: 'var', v: f.v };
      if (f.t === '(') { const a = expr(); esperar(')'); return { t: 'par', a }; }
      throw new Error(`no esperaba «${f.t}»`);
    }
    const izq = expr();
    let der = null;
    if (ver() && ver().t === '=') { tomar(); der = expr(); }
    if (k < fs.length) throw new Error(ver().t === '=' ? 'hay más de un signo =' : `sobra «${ver().t === 'num' ? txF(ver().v) : ver().t === 'var' ? ver().v : ver().t}»`);
    return { izq, der };
  }
  const quitarPar = n => (n && n.t === 'par' ? quitarPar(n.a) : n);
  function variablesDe(n, set) {
    set = set || new Set();
    if (!n) return set;
    if (n.t === 'var') set.add(n.v);
    for (const h of [n.a, n.b]) if (h) variablesDe(h, set);
    return set;
  }
  function analizar(t) {
    const r = leer(t);
    const vars = [...variablesDe(r.izq, variablesDe(r.der))].sort();
    return { tipo: r.der ? 'ecuacion' : 'expresion', izq: r.izq, der: r.der, variables: vars, texto: r.der ? `${escribir(r.izq)} = ${escribir(r.der)}` : escribir(r.izq) };
  }

  // ---------- Escribir bonito ----------
  const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶' };
  // o.sustituir: { letra: número } escribe el número en lugar de la letra (con · y paréntesis si hace falta).
  function escribir(n, o) {
    o = o || {};
    const sust = o.sustituir || null;
    const esSuma = m => m.t === '+' || m.t === '-';
    function w(m) {
      switch (m.t) {
        case 'num': return txF(m.v);
        case 'var': return sust && sust[m.v] !== undefined ? txF(aF(sust[m.v])) : m.v;
        case 'par': return `(${w(m.a)})`;
        case 'neg': { const s = w(m.a); return MENOS + (esSuma(m.a) || /^−/.test(s) ? `(${s})` : s); }
        case '+': { const b = quitarPar(m.b); if (b.t === 'neg') return `${w(m.a)} − ${envolverResta(b.a)}`; return `${w(m.a)} + ${w(m.b)}`; }
        case '-': return `${w(m.a)} − ${envolverResta(m.b)}`;
        case '/': return `${envolverFactor(m.a)}/${envolverFactor(m.b)}`;
        case '^': { const s = w(m.a), simple = m.a.t === 'par' || /^[0-9]+$/.test(s) || (m.a.t === 'var' && !(sust && sust[m.a.v] !== undefined));
          return (simple ? s : `(${s})`) + SUP[m.e]; }
        case '*': {
          const A = m.a, B = m.b, sa = envolverFactor(A), sb = envolverFactor(B);
          // 6P, 2x, 2(x − 3), (x − 3)(x − 5), xy: juntos; si se sustituye un número fuera de un paréntesis, con ·
          const aJuntable = (A.t === 'num' && A.v.d === 1 && A.v.n >= 0) || A.t === 'var' || A.t === 'par' || A.t === '^' || A.t === '*';
          if (aJuntable && B.t === 'par') return sa + sb;
          const conNumero = sust && (contieneSust(A) || contieneSust(B));
          const bJuntable = B.t === 'var' || (B.t === '^' && B.a.t === 'var') || (B.t === '*' && B.junto && quitarPar(B.a).t !== 'num');
          if (!conNumero && aJuntable && bJuntable) return sa + sb;
          return `${sa} · ${sb}`;
        }
      }
      throw new Error('nodo desconocido');
    }
    function contieneSust(m) { if (!sust) return false; if (m.t === 'var') return sust[m.v] !== undefined; return [m.a, m.b].some(h => h && contieneSust(h)); }
    function envolverResta(m) { const s = w(m); return esSuma(m) || m.t === 'neg' ? `(${s})` : s; }
    function envolverFactor(m) { const s = w(m); return esSuma(m) || m.t === 'neg' || /^−/.test(s) && m.t !== 'par' ? `(${s})` : s; }
    return w(n);
  }
  function texto(t) {
    if (typeof t === 'string') return analizar(t).texto;
    if (t && t.izq) return t.der ? `${escribir(t.izq)} = ${escribir(t.der)}` : escribir(t.izq);
    return escribir(t);
  }

  // ---------- Polinomios en varias letras (coeficientes exactos) ----------
  // Un polinomio es un objeto { clave del monomio: fracción }; la clave es 'x^2*y' ('' para la constante).
  const claveDe = m => Object.keys(m).filter(v => m[v]).sort().map(v => (m[v] === 1 ? v : `${v}^${m[v]}`)).join('*');
  function deClave(k) { const m = {}; if (!k) return m; for (const p of k.split('*')) { const [v, e] = p.split('^'); m[v] = e ? Number(e) : 1; } return m; }
  const pLimpio = p => { const q = {}; for (const k in p) if (!fCero(p[k])) q[k] = p[k]; return q; };
  const pConst = c => pLimpio({ '': c });
  function pSum(a, b) { const q = Object.assign({}, a); for (const k in b) q[k] = q[k] ? fSum(q[k], b[k]) : b[k]; return pLimpio(q); }
  const pNeg = a => { const q = {}; for (const k in a) q[k] = fNeg(a[k]); return q; };
  const pRes = (a, b) => pSum(a, pNeg(b));
  function pMul(a, b) {
    let q = {};
    for (const ka in a) for (const kb in b) {
      const ma = deClave(ka), mb = deClave(kb), m = Object.assign({}, ma);
      for (const v in mb) m[v] = (m[v] || 0) + mb[v];
      q = pSum(q, { [claveDe(m)]: fMul(a[ka], b[kb]) });
    }
    return q;
  }
  function pPot(a, e) { let r = pConst(F(1)); for (let k = 0; k < e; k++) r = pMul(r, a); return r; }
  const esConstante = p => Object.keys(p).every(k => k === '');
  const constanteDe = p => p[''] || F(0);
  const gradoMono = k => Object.values(deClave(k)).reduce((s, e) => s + e, 0);
  const grado = p => { const ks = Object.keys(p); return ks.length ? Math.max(...ks.map(gradoMono)) : -Infinity; };
  const letrasDe = p => [...new Set(Object.keys(p).flatMap(k => Object.keys(deClave(k))))].sort();
  // Polinomio en una sola letra: lista de coeficientes [c0, c1, c2, …]
  function coefs(p, v) {
    const ls = letrasDe(p);
    if (ls.some(l => l !== v)) throw new Error(`la ecuación tiene otras letras además de ${v}: ${ls.filter(l => l !== v).join(', ')}`);
    const g = Math.max(0, grado(p)), c = Array.from({ length: g + 1 }, () => F(0));
    for (const k in p) c[gradoMono(k)] = p[k];
    return c;
  }
  const deCoefs = (c, v) => { let p = {}; c.forEach((a, e) => { p = pSum(p, { [e ? claveDe({ [v]: e }) : '']: a }); }); return p; };
  // División exacta entre un polinomio de una letra (la balanza ÷ x). Devuelve null si no es exacta.
  function pDivExacta(a, b) {
    if (esConstante(b)) { const c = constanteDe(b); if (fCero(c)) throw new Error('división entre cero'); const q = {}; for (const k in a) q[k] = fDiv(a[k], c); return q; }
    const ls = [...new Set(letrasDe(a).concat(letrasDe(b)))];
    if (ls.length !== 1) return null;
    const v = ls[0];
    const n = coefs(a, v), d = coefs(b, v);
    while (d.length && fCero(d[d.length - 1])) d.pop();
    const q = Array.from({ length: Math.max(1, n.length - d.length + 1) }, () => F(0)), r = n.slice();
    for (let e = n.length - d.length; e >= 0; e--) {
      const f = fDiv(r[e + d.length - 1], d[d.length - 1]); q[e] = f;
      for (let j = 0; j < d.length; j++) r[e + j] = fRes(r[e + j], fMul(f, d[j]));
    }
    if (r.some(x => !fCero(x))) return null;
    return deCoefs(q, v);
  }
  function aPoli(n) {
    switch (n.t) {
      case 'num': return pConst(n.v);
      case 'var': return { [n.v]: F(1) };
      case 'par': return aPoli(n.a);
      case 'neg': return pNeg(aPoli(n.a));
      case '+': return pSum(aPoli(n.a), aPoli(n.b));
      case '-': return pRes(aPoli(n.a), aPoli(n.b));
      case '*': return pMul(aPoli(n.a), aPoli(n.b));
      case '^': return pPot(aPoli(n.a), n.e);
      case '/': { const q = pDivExacta(aPoli(n.a), aPoli(n.b)); if (!q) throw new Error('la expresión no es un polinomio (hay una letra dividiendo)'); return q; }
    }
    throw new Error('nodo desconocido');
  }
  // Texto de un polinomio ordenado: grado de mayor a menor y, en el mismo grado, por orden alfabético.
  function escribirPoli(p) {
    const ks = Object.keys(p).sort((a, b) => gradoMono(b) - gradoMono(a) || (a < b ? -1 : a > b ? 1 : 0));
    if (!ks.length) return '0';
    return ks.map((k, j) => {
      const c = p[k], neg = c.n < 0, a = F(Math.abs(c.n), c.d);
      const mono = Object.entries(deClave(k)).map(([v, e]) => v + (e > 1 ? SUP[e] : '')).join('');
      const coef = !k ? txF(a) : (a.n === 1 && a.d === 1 ? '' : txF(a));
      const cuerpo = coef && k && a.d !== 1 ? `(${coef})${mono}` : coef + mono;
      return j === 0 ? (neg ? MENOS : '') + cuerpo : (neg ? ` ${MENOS} ` : ' + ') + cuerpo;
    }).join('');
  }
  function polinomio(t) {
    const a = typeof t === 'string' ? analizar(t) : t;
    if (a.tipo === 'ecuacion') throw new Error('se esperaba una expresión, no una ecuación');
    const p = aPoli(a.izq);
    return { texto: escribirPoli(p), grado: Math.max(0, grado(p)), variables: letrasDe(p), coef: Object.fromEntries(Object.entries(p).map(([k, c]) => [k || '1', fNum(c)])) };
  }

  // ---------- Evaluar y comprobar ----------
  function evalF(n, val) {
    switch (n.t) {
      case 'num': return n.v;
      case 'var': if (val[n.v] === undefined) throw new Error(`falta el valor de ${n.v}`); return aF(val[n.v]);
      case 'par': return evalF(n.a, val);
      case 'neg': return fNeg(evalF(n.a, val));
      case '+': return fSum(evalF(n.a, val), evalF(n.b, val));
      case '-': return fRes(evalF(n.a, val), evalF(n.b, val));
      case '*': return fMul(evalF(n.a, val), evalF(n.b, val));
      case '/': return fDiv(evalF(n.a, val), evalF(n.b, val));
      case '^': return fPot(evalF(n.a, val), n.e);
    }
    throw new Error('nodo desconocido');
  }
  function evaluar(t, valores) {
    const a = typeof t === 'string' ? analizar(t) : t;
    if (a.tipo === 'ecuacion') throw new Error('para una ecuación usa comprobar');
    const v = evalF(a.izq, valores || {});
    return { valor: limpio(fNum(v)), texto: txF(v), sustituida: escribir(a.izq, { sustituir: valores }) };
  }
  // ¿La ecuación es verdadera con esos valores? Se sustituye cada letra por su número, como en el aula.
  function comprobar(t, valores) {
    const a = typeof t === 'string' ? analizar(t) : t;
    if (a.tipo !== 'ecuacion') throw new Error('falta el signo = : no es una ecuación');
    let i, d;
    try { i = evalF(a.izq, valores || {}); d = evalF(a.der, valores || {}); }
    catch (e) { if (/división entre cero/.test(e.message)) return { definida: false, verdadera: false, sustituida: `${escribir(a.izq, { sustituir: valores })} = ${escribir(a.der, { sustituir: valores })}` }; throw e; }
    const ver = fIgual(i, d);
    return { definida: true, izq: limpio(fNum(i)), der: limpio(fNum(d)), izqTexto: txF(i), derTexto: txF(d), verdadera: ver,
      diferencia: limpio(fNum(fRes(i, d))),
      sustituida: `${escribir(a.izq, { sustituir: valores })} = ${escribir(a.der, { sustituir: valores })}`,
      resultado: `${txF(i)} ${ver ? '=' : '≠'} ${txF(d)}` };
  }

  // ---------- «Hay n N por cada m M» (Clement, AL1 y RM1) ----------
  // La ecuación correcta junta la letra con el número del otro lado: m·N = n·M (con m = 1, N = n·M).
  // Errores: la invertida, que copia el orden de las palabras (n·N = m·M, AL1), y la aditiva, que lee
  // «por cada» como «más que» (N = M + (n − m), AL3).
  function porCada(o) {
    const n = numero(o.n, 'n', { positivo: true, entero: true }), m = numero(o.m === undefined ? 1 : o.m, 'm', { positivo: true, entero: true });
    const N = o.letraN || 'S', M = o.letraM || 'P';
    if (N === M) throw new Error('las dos letras deben ser distintas');
    const lado = (k, L) => (k === 1 ? L : `${k}${L}`);
    const ec = `${lado(m, N)} = ${lado(n, M)}`, inv = `${lado(n, N)} = ${lado(m, M)}`;
    // «por cada» leído como «más que»: N = M + n (AL3); y la estrategia aditiva de Karplus, que conserva la diferencia: N − M = n − m
    const dif = n - m, difTxt = dif === 0 ? `${N} = ${M}` : `${N} = ${M} ${dif > 0 ? '+' : MENOS} ${Math.abs(dif)}`;
    const r = { ecuacion: texto(ec), errores: { invertida: { ecuacion: texto(inv) }, suma: { ecuacion: `${N} = ${M} + ${n}` }, diferencia: { ecuacion: difTxt } } };
    if (o.valorM !== undefined) {
      const vM = numero(o.valorM, 'valorM', { positivo: true });
      if (!Number.isInteger(vM / m)) throw new Error(`${M} debe ser múltiplo de ${m} para armar grupos completos`);
      r[M] = vM; r[N] = limpio(n * vM / m); r.grupos = vM / m;
      r.comprobacion = comprobar(ec, { [N]: r[N], [M]: vM });
      r.errores.invertida.valor = limpio(m * vM / n);
      r.errores.invertida.comprobacion = comprobar(inv, { [N]: r[N], [M]: vM });
      r.errores.suma.valor = limpio(vM + n); r.errores.diferencia.valor = limpio(vM + dif);
    }
    return r;
  }

  // ---------- Traductor de frases (plantillas de frase con parámetros) ----------
  const NUMS = { un: 1, uno: 1, una: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10, once: 11, doce: 12, quince: 15, veinte: 20 };
  const VECES = { doble: 2, triple: 3, 'cuádruple': 4, cuadruple: 4, 'quíntuple': 5, quintuple: 5, 'séxtuple': 6, sextuple: 6 };
  function leerNum(s) {
    s = String(s).trim().toLowerCase();
    if (/^[-−]?\d+([.,]\d+)?$/.test(s)) return Number(s.replace(',', '.').replace('−', '-'));
    if (NUMS[s] !== undefined) return NUMS[s];
    throw new Error(`no entiendo el número «${s}»`);
  }
  function leerVeces(s) {
    s = s.trim().toLowerCase();
    if (VECES[s] !== undefined) return VECES[s];
    const m = s.match(/^(\S+) veces$/); if (m) return leerNum(m[1]);
    throw new Error(`no entiendo «${s}»`);
  }
  // La letra de una palabra: la que diga 'letras' (también en singular) o su inicial en mayúscula.
  function letraDe(p, letras) {
    letras = letras || {};
    const w = p.toLowerCase();
    for (const c of [w, w.replace(/es$/, ''), w.replace(/s$/, '')]) if (letras[c]) return letras[c];
    return p[0].toUpperCase();
  }
  const kL = (k, L) => (k === 1 ? L : `${k}${L}`);
  const PLANTILLAS = [
    { id: 'por-cada', ejemplo: 'hay 6 estudiantes por cada profesor',
      re: /^hay (\S+) (\S+) por cada (?:(\S+) )?(\S+)$/i,
      armar: (m, L) => { const n = leerNum(m[1]), mm = m[3] ? leerNum(m[3]) : 1, r = porCada({ n, m: mm, letraN: letraDe(m[2], L), letraM: letraDe(m[4], L) });
        return { ecuacion: r.ecuacion, errores: { invertida: r.errores.invertida.ecuacion, suma: r.errores.suma.ecuacion, diferencia: r.errores.diferencia.ecuacion } }; } },
    { id: 'veces', ejemplo: 'el número de estudiantes es 6 veces el de profesores',
      re: /^el número de (\S+) es (.+?) (?:del?|el de) (\S+)$/i,
      armar: (m, L) => { const N = letraDe(m[1], L), M = letraDe(m[3], L), k = leerVeces(m[2].replace(/^el /, ''));
        return { ecuacion: texto(`${N} = ${kL(k, M)}`), errores: { invertida: texto(`${kL(k, N)} = ${M}`), suma: texto(`${N} = ${M} + ${k}`) } }; } },
    // «el doble de un número, disminuido en 3»: primero el doble, después se resta (2x − 3). Con la coma
    // después de «doble» («el doble, de un número disminuido en 3») la operación va adentro: 2(x − 3).
    { id: 'multiplo-cambio', ejemplo: 'el doble de un número, disminuido en 3',
      re: /^(?:el |la )?([^\s,]+(?: veces)?)(,)? de un número,? (disminuido|aumentado) en (\S+)(?:,? (?:es|equivale a) (\S+))?$/i,
      armar: (m, L, x) => {
        const k = leerVeces(m[1]), c = leerNum(m[4]), op = m[3].toLowerCase() === 'disminuido' ? '-' : '+', s = op === '-' ? MENOS : '+';
        const fuera = `${kL(k, x)} ${s} ${c}`, dentro = `${k}(${x} ${s} ${c})`;
        const e = m[2] ? dentro : fuera, otra = m[2] ? fuera : dentro;
        // la «máquina»: qué se le hace al número, en orden
        const cFuera = [{ op: 'por', v: k }, { op: op === '-' ? 'menos' : 'mas', v: c }], cDentro = [{ op: op === '-' ? 'menos' : 'mas', v: c }, { op: 'por', v: k }];
        const cadenas = { expresion: m[2] ? cDentro : cFuera, agrupado: m[2] ? cFuera : cDentro };
        if (op === '-') cadenas.alReves = m[2] ? [{ op: 'restarDe', v: c }, { op: 'por', v: k }] : [{ op: 'por', v: k }, { op: 'restarDe', v: c }];
        const errores = { agrupado: texto(otra) };
        if (op === '-') errores.alReves = texto(m[2] ? `${k}(${c} − ${x})` : `${c} − ${kL(k, x)}`);
        if (m[5] !== undefined) { const r = leerNum(m[5]); return { ecuacion: texto(`${e} = ${r}`), cadenas, errores: Object.fromEntries(Object.entries(errores).map(([n, t]) => [n, `${t} = ${r}`])) }; }
        return { expresion: texto(e), cadenas, errores };
      } },
    { id: 'excede', ejemplo: 'Mara excede a Beto en 13',
      re: /^(\S+) excede a (\S+) en (\S+)$/i,
      armar: (m, L) => { const A = letraDe(m[1], L), B = letraDe(m[2], L), c = leerNum(m[3]);
        return { ecuacion: texto(`${A} − ${B} = ${c}`), errores: { alReves: texto(`${B} − ${A} = ${c}`) } }; } },
    { id: 'edad-hace', ejemplo: 'hace 4 años, la edad de Mara era el doble de la de Beto',
      re: /^hace (\S+) años,? la edad de (\S+) era (?:el |la )?(\S+(?: veces)?) (?:de )?la de (\S+)$/i,
      armar: (m, L) => edadFrase(leerNum(m[1]), -1, letraDe(m[2], L), leerVeces(m[3]), letraDe(m[4], L)) },
    { id: 'edad-dentro', ejemplo: 'dentro de 5 años, la edad de Mara será el doble de la de Beto',
      re: /^dentro de (\S+) años,? la edad de (\S+) será (?:el |la )?(\S+(?: veces)?) (?:de )?la de (\S+)$/i,
      armar: (m, L) => edadFrase(leerNum(m[1]), 1, letraDe(m[2], L), leerVeces(m[3]), letraDe(m[4], L)) },
    { id: 'suma-dentro', ejemplo: 'dentro de 5 años, las edades de Mara y Beto sumarán 50',
      re: /^dentro de (\S+) años,? las edades de (\S+) y (\S+) sumarán (\S+)(?: años)?$/i,
      armar: (m, L) => { const n = leerNum(m[1]), A = letraDe(m[2], L), B = letraDe(m[3], L), s = leerNum(m[4]);
        return { ecuacion: texto(`(${A} + ${n}) + (${B} + ${n}) = ${s}`), simplificada: texto(`${A} + ${B} = ${s - 2 * n}`),
          errores: { unaVez: texto(`${A} + ${B} + ${n} = ${s}`), sinTiempo: texto(`${A} + ${B} = ${s}`) } }; } },
  ];
  function edadFrase(n, signo, A, k, B) {
    const s = signo < 0 ? MENOS : '+';
    return { ecuacion: texto(`${A} ${s} ${n} = ${k}(${B} ${s} ${n})`),
      errores: { sinTiempo: texto(`${A} = ${kL(k, B)}`), soloPrimera: texto(`${A} ${s} ${n} = ${kL(k, B)}`), soloSegunda: texto(`${A} = ${k}(${B} ${s} ${n})`) } };
  }
  function traducir(frase, letras) {
    if (typeof frase !== 'string' || !frase.trim()) throw new Error('falta la frase');
    const f = frase.trim().replace(/\s+/g, ' ').replace(/[.:]$/, '');
    const L = Object.assign({}, letras || {});
    const x = L.numero || 'x';
    for (const p of PLANTILLAS) {
      const m = f.match(p.re);
      if (!m) continue;
      return Object.assign({ plantilla: p.id, frase: f }, p.armar(m, L, x));
    }
    throw new Error('no reconozco la frase: prueba con una de las plantillas (' + PLANTILLAS.map(p => `«${p.ejemplo}»`).join(', ') + ')');
  }
  const plantillasDeFrase = () => PLANTILLAS.map(p => ({ id: p.id, ejemplo: p.ejemplo }));

  // La máquina de una frase: el número entra y pasa por cada operación. Devuelve el valor después de cada una.
  // ops: [{ op: 'por'|'mas'|'menos'|'restarDe', v }]; 'restarDe' es «v menos lo que llega» (el «disminuido» al revés).
  function cadena(x, ops) {
    let a = aF(x);
    const valores = [limpio(fNum(a))];
    for (const o of ops || []) {
      const v = aF(o.v);
      if (o.op === 'por') a = fMul(a, v); else if (o.op === 'mas') a = fSum(a, v); else if (o.op === 'menos') a = fRes(a, v);
      else if (o.op === 'restarDe') a = fRes(v, a); else throw new Error("op debe ser 'por', 'mas', 'menos' o 'restarDe'");
      valores.push(limpio(fNum(a)));
    }
    return { valores, resultado: valores[valores.length - 1] };
  }

  // ---------- Resolver ecuaciones lineales y cuadráticas ----------
  // Raíces racionales de a·x² + b·x + c (o null si Δ no es un cuadrado perfecto de fracciones).
  function raizF(q) {
    if (q.n < 0) return null;
    const rn = Math.round(Math.sqrt(q.n)), rd = Math.round(Math.sqrt(q.d));
    return rn * rn === q.n && rd * rd === q.d ? F(rn, rd) : null;
  }
  // Factor lineal (x − r) bonito: 'x − 3', 'x + 1/2', 'x'
  const factorTxt = (v, r) => (fCero(r) ? v : `${v} ${r.n > 0 ? MENOS : '+'} ${txF(F(Math.abs(r.n), r.d))}`);
  const ordenar = xs => xs.slice().sort((a, b) => fNum(a) - fNum(b));
  // Una ecuación como polinomio igualado a cero: izq − der.
  function aCero(a) { return pRes(aPoli(a.izq), aPoli(a.der)); }
  function soluciones1(p, v) {
    // soluciones exactas o aproximadas de p(v) = 0, para grado ≤ 2
    const c = coefs(p, v), g = c.length - 1;
    if (Object.keys(p).length === 0) return { tipo: 'identidad', exactas: [], valores: [], textos: [] };
    if (g === 0) return { tipo: 'ninguna', exactas: [], valores: [], textos: [] };
    if (g === 1) { const r = fDiv(fNeg(c[0]), c[1]); return { tipo: 'unica', exactas: [r], valores: [fNum(r)], textos: [txF(r)] }; }
    // grado 3 o más con término independiente 0 (x³ = 4x): se saca x como factor y se resuelve lo que queda
    if (g > 2 && fCero(c[0])) {
      let k = 0; while (fCero(c[k])) k++;
      const resto = deCoefs(c.slice(k), v), r = soluciones1(resto, v);
      if (r.tipo === 'identidad') throw new Error('ecuación sin forma conocida');
      const pares = [[0, '0', F(0)]];
      r.valores.forEach((x, j) => { if (Math.abs(x) > 1e-12) pares.push([x, r.textos[j], r.exactas ? r.exactas[j] : null]); });
      pares.sort((a, b) => a[0] - b[0]);
      return { tipo: ['', 'unica', 'dos', 'tres', 'cuatro'][pares.length] || 'varias', exactas: r.exactas ? pares.map(q => q[2]) : null,
        valores: pares.map(q => q[0]), textos: pares.map(q => q[1]), factorComun: { k, resto } };
    }
    if (g === 2) {
      const [C, B, A] = c, D = fRes(fMul(B, B), fMul(F(4), fMul(A, C)));
      if (D.n < 0) return { tipo: 'sin-reales', exactas: [], valores: [], textos: [], discriminante: D };
      const rD = raizF(D);
      if (rD) {
        const r1 = fDiv(fRes(fNeg(B), rD), fMul(F(2), A)), r2 = fDiv(fSum(fNeg(B), rD), fMul(F(2), A));
        const xs = fIgual(r1, r2) ? [r1] : ordenar([r1, r2]);
        return { tipo: xs.length === 1 ? 'doble' : 'dos', exactas: xs, valores: xs.map(fNum), textos: xs.map(txF), discriminante: D };
      }
      const s = Math.sqrt(fNum(D)), a2 = 2 * fNum(A), mb = -fNum(B);
      const vals = [(mb - s) / a2, (mb + s) / a2].sort((p, q) => p - q);
      // texto con raíz: (−b ± √Δ)/(2a), simplificado si Δ tiene un cuadrado adentro
      const tr = textoIrracional(fNeg(B), D, fMul(F(2), A));
      return { tipo: 'dos', exactas: null, valores: vals, discriminante: D, textoRaiz: tr, textos: tr[0] === '±' ? [MENOS + tr.slice(1), tr.slice(1)] : [tr.replace('±', MENOS), tr.replace('±', '+')] };
    }
    throw new Error('el motor resuelve ecuaciones de grado 1 y 2 (y las de grado mayor que tienen a x como factor común)');
  }
  // (p ± √D)/q con D entero o fracción: saca los cuadrados de la raíz.
  function textoIrracional(p, D, q) {
    // √(n/d) = √(n·d)/d
    let rad = D.n * D.d, fuera = F(1, D.d);
    for (let k = Math.floor(Math.sqrt(rad)); k > 1; k--) if (rad % (k * k) === 0) { rad /= k * k; fuera = fMul(fuera, F(k)); break; }
    // (p ± fuera·√rad)/q = p/q ± (fuera/q)√rad
    const a = fDiv(p, q), b = fDiv(fuera, q), sb = b.n < 0 ? F(-b.n, b.d) : b;
    const raiz = (sb.n === 1 && sb.d === 1 ? '' : sb.d === 1 ? String(sb.n) : `(${txF(sb)})`) + `√${rad}`;
    return fCero(a) ? `±${raiz}` : `${txF(a)} ± ${raiz}`;
  }
  const solTexto = r => r.textos;
  // ¿Es la expresión un producto de dos factores de grado 1 en v? Devuelve sus polinomios.
  function dosFactores(n, v) {
    n = quitarPar(n);
    if (n.t !== '*') return null;
    const a = aPoli(n.a), b = aPoli(n.b);
    try { if (coefs(a, v).length === 2 && coefs(b, v).length === 2) return [a, b]; } catch (e) { return null; }
    return null;
  }
  function resolver(t, variable) {
    const a = typeof t === 'string' ? analizar(t) : t;
    if (a.tipo !== 'ecuacion') throw new Error('falta el signo = : no es una ecuación');
    const vs = a.variables;
    const v = variable || (vs.length === 1 ? vs[0] : vs.length === 0 ? 'x' : null);
    if (!v) throw new Error(`la ecuación tiene varias letras (${vs.join(', ')}): di cuál se despeja`);
    if (vs.some(l => l !== v)) throw new Error(`la ecuación tiene otras letras además de ${v}`);
    const pI = aPoli(a.izq), pD = aPoli(a.der), p = pRes(pI, pD), c = coefs(p, v), g = Object.keys(p).length ? c.length - 1 : 0;
    const r = soluciones1(p, v);
    const pasos = [`${a.texto}`];
    const esCero = Object.keys(pD).length === 0;
    if (!esCero && g !== 1) pasos.push(`Se resta ${escribirPoli(pD)} a los dos lados: ${escribirPoli(p)} = 0`);
    else if (g !== 1 && escribirPoli(pI) !== escribir(a.izq)) pasos.push(`Se desarrolla: ${escribirPoli(p)} = 0`);
    if (r.tipo === 'identidad') pasos.push('Queda 0 = 0: es verdadera para cualquier valor de ' + v + '. Es una identidad: tiene infinitas soluciones.');
    else if (r.tipo === 'ninguna') pasos.push(`Queda ${txF(c[0])} = 0, que es falso para cualquier valor de ${v}: no tiene solución.`);
    else if (g === 1) {
      // letras a un lado y números al otro; la letra queda del lado donde su coeficiente es positivo
      let a1 = F(0), b1 = F(0), a2 = F(0), b2 = F(0);
      try { const ci = coefs(pI, v), cd = coefs(pD, v); if (ci.length <= 2 && cd.length <= 2) { a1 = ci[1] || F(0); b1 = ci[0]; a2 = cd[1] || F(0); b2 = cd[0]; } else throw 0; }
      catch (e) { a1 = c[1]; b1 = c[0]; }
      const A = fRes(a1, a2), Bc = fRes(b2, b1), pos = A.n > 0, Ap = pos ? A : fNeg(A), Bp = pos ? Bc : fNeg(Bc);
      const lados = `${escribirPoli(pI)} = ${escribirPoli(pD)}`;
      if (lados !== a.texto) pasos.push(`Se desarrolla: ${lados}`);
      const mono = escribirPoli(deCoefs([F(0), Ap], v));
      const junta = pos ? `${mono} = ${txF(Bp)}` : `${txF(Bp)} = ${mono}`;
      if (junta !== a.texto && junta !== lados) pasos.push(`Se suma o se resta lo mismo a los dos lados hasta dejar ${v} en un lado y los números en el otro: ${junta}`);
      if (!fIgual(Ap, F(1))) pasos.push(`Se divide entre ${txF(Ap)} los dos lados: ${v} = ${txF(r.exactas[0])}`);
    }
    else if (g > 2) {
      const { k, resto } = r.factorComun, fx = k === 1 ? v : `${v}${SUP[k]}`;
      pasos.push(`Se saca ${fx} como factor común: ${fx}(${escribirPoli(resto)}) = 0`,
        `Si un producto vale 0, uno de los factores vale 0: ${v} = 0 o ${escribirPoli(resto)} = 0`, `${v} = ${solTexto(r).join(' o ' + v + ' = ')}`);
    }
    else if (g === 2) {
      const [C, B, A] = c;
      if (fCero(C)) {
        const otro = fDiv(fNeg(B), A);
        pasos.push(`Se saca ${v} como factor común: ${v}(${escribirPoli(deCoefs([B, A], v))}) = 0`,
          `Si un producto vale 0, uno de los factores vale 0: ${v} = 0 o ${escribirPoli(deCoefs([B, A], v))} = 0`, `${v} = 0 o ${v} = ${txF(otro)}`);
      } else if (r.exactas && r.exactas.length && fIgual(A, F(1))) {
        const xs = r.exactas;
        if (xs.length === 2) pasos.push(`Se factoriza: (${factorTxt(v, xs[0])})(${factorTxt(v, xs[1])}) = 0`, `${factorTxt(v, xs[0])} = 0 o ${factorTxt(v, xs[1])} = 0`, `${v} = ${txF(xs[0])} o ${v} = ${txF(xs[1])}`);
        else pasos.push(`Se factoriza: (${factorTxt(v, xs[0])})² = 0`, `${v} = ${txF(xs[0])} (raíz doble)`);
      } else {
        pasos.push(`Fórmula general con a = ${txF(A)}, b = ${txF(B)}, c = ${txF(C)}: Δ = b² − 4ac = ${txF(r.discriminante)}`);
        if (r.tipo === 'sin-reales') pasos.push('Δ es negativo: no hay soluciones reales.');
        else pasos.push(`${v} = ${solTexto(r).join(' o ' + v + ' = ')}`);
      }
    }
    const res = { variable: v, grado: g, tipo: r.tipo, soluciones: r.valores.map(limpio), solucionesTexto: solTexto(r), pasos,
      normalizada: `${escribirPoli(p)} = 0` };
    if (r.discriminante) res.discriminante = limpio(fNum(r.discriminante));
    // Comprobación: cada solución en la ecuación original
    if (r.exactas) res.comprobaciones = r.exactas.map(x => comprobar(a, { [v]: x }));
    // ----- errores típicos -----
    const err = {};
    // AL15: dividir entre la variable cuando 0 es solución: se pierde x = 0
    if (g >= 2 && fCero(c[0])) {
      const q = soluciones1(deCoefs(c.slice(1), v), v);
      if (!q.valores.some(z => Math.abs(z) < 1e-12)) err.dividirEntreX = q.valores.map(limpio);
      // y además quedarse solo con la raíz positiva (x³ = 4x ⇒ x² = 4 ⇒ x = 2)
      if (q.valores.length === 2 && Math.abs(q.valores[0] + q.valores[1]) < 1e-12) err.dividirYSoloPositiva = [limpio(Math.max(...q.valores))];
    }
    // x² = 9 ⇒ x = 3: solo la raíz positiva
    if (g === 2 && fCero(c[1]) && r.valores.length === 2) err.soloPositiva = [limpio(Math.max(...r.valores))];
    // AL16: pasar al otro lado sin cambiar el signo (3x − 7 = 2x + 5 ⇒ 3x + 2x = 5 − 7)
    if (g === 1 && !esCero) {
      let ci, cd;
      try { ci = coefs(pI, v); cd = coefs(pD, v); } catch (e) { ci = null; }
      if (ci && ci.length <= 2 && cd.length <= 2) {
        const a1 = ci[1] || F(0), b1 = ci[0], a2 = cd[1] || F(0), b2 = cd[0];
        const den = fSum(a1, a2);
        if (!fCero(a2) || !fCero(b1)) err.pasarSignoMal = fCero(den) ? null : [limpio(fNum(fDiv(fSum(b2, b1), den)))];
      }
    }
    // AL14: (x − p)(x − q) = k con k ≠ 0: «cada factor vale k», o se ignora el k
    const fs = dosFactores(a.izq, v);
    if (fs && esConstante(pD) && !fCero(constanteDe(pD))) {
      const k = constanteDe(pD);
      const resolver1 = (q, val) => { const cc = coefs(q, v); return limpio(fNum(fDiv(fRes(val, cc[0]), cc[1]))); };
      err.cadaFactorIgualK = [resolver1(fs[0], k), resolver1(fs[1], k)].sort((x, y) => x - y);
      err.ignoraK = [resolver1(fs[0], F(0)), resolver1(fs[1], F(0))].sort((x, y) => x - y);
    }
    if (Object.keys(err).length) res.errores = err;
    return res;
  }

  // ---------- La balanza ----------
  // Lo que pesa cada plato con unos valores. Si un plato divide entre 0, el plato queda «sin definir».
  function pesos(t, valores) {
    const a = typeof t === 'string' ? analizar(t) : t;
    const c = comprobar(a, valores);
    if (!c.definida) return { definida: false, equilibrio: false };
    return { definida: true, izq: c.izq, der: c.der, diferencia: c.diferencia, equilibrio: c.verdadera,
      inclinacion: c.verdadera ? 0 : c.izq > c.der ? -1 : 1 };   // −1: baja el plato izquierdo
  }
  const OPS = { sumar: '+', restar: '-', multiplicar: '*', dividir: '/' };
  function conjunto(a, v) {
    try { const r = resolver(a, v); return { tipo: r.tipo, valores: r.soluciones, texto: r.solucionesTexto }; }
    catch (e) { return { tipo: 'grado-alto', valores: null, texto: [] }; }
  }
  // Aplica operaciones en orden. Cada una: { op: 'sumar'|'restar'|'multiplicar'|'dividir', expr: '5x', lado: 'ambos'|'izquierdo'|'derecho' }.
  function balanza(t, operaciones, variable) {
    let a = typeof t === 'string' ? analizar(t) : t;
    if (a.tipo !== 'ecuacion') throw new Error('falta el signo = : no es una ecuación');
    const v = variable || a.variables[0] || 'x';
    const ini = conjunto(a, v);
    const estados = [{ texto: a.texto, ecuacion: a.texto, soluciones: ini.valores, solucionesTexto: ini.texto, tipo: ini.tipo }];
    let antes = ini;
    for (const o of operaciones || []) {
      const op = OPS[o.op]; if (!op) throw new Error("op debe ser 'sumar', 'restar', 'multiplicar' o 'dividir'");
      const lado = o.lado || 'ambos'; if (!['ambos', 'izquierdo', 'derecho'].includes(lado)) throw new Error("lado debe ser 'ambos', 'izquierdo' o 'derecho'");
      const e = analizar(String(o.expr)); if (e.tipo !== 'expresion') throw new Error('la operación lleva una expresión, no una ecuación');
      const pe = aPoli(e.izq);
      if ((op === '*' || op === '/') && Object.keys(pe).length === 0) throw new Error(op === '/' ? 'no se puede dividir entre 0' : 'multiplicar por 0 deja 0 = 0 y borra la ecuación');
      const aplicar = (pl) => {
        if (op === '+') return pSum(pl, pe); if (op === '-') return pRes(pl, pe); if (op === '*') return pMul(pl, pe);
        const q = pDivExacta(pl, pe); if (!q) throw new Error(`${escribirPoli(pl)} no se divide exactamente entre ${escribirPoli(pe)}`); return q;
      };
      const pI = aPoli(a.izq), pD = aPoli(a.der);
      const nI = lado === 'derecho' ? pI : aplicar(pI), nD = lado === 'izquierdo' ? pD : aplicar(pD);
      const txt = `${escribirPoli(nI)} = ${escribirPoli(nD)}`;
      a = analizar(txt);
      const desp = conjunto(a, v);
      const est = { operacion: `${({ '+': 'sumar', '-': 'restar', '*': 'multiplicar por', '/': 'dividir entre' })[op]} ${e.texto}${lado === 'ambos' ? ' a los dos lados' : ' solo al lado ' + lado}`,
        texto: txt, ecuacion: txt, soluciones: desp.valores, solucionesTexto: desp.texto, tipo: desp.tipo };
      // Qué soluciones se pierden o aparecen (comparando con las de antes)
      if (antes.valores && desp.valores) {
        const esta = (x, xs) => xs.some(y => Math.abs(x - y) <= 1e-9 * Math.max(1, Math.abs(x)));
        est.perdidas = antes.tipo === 'identidad' || desp.tipo === 'identidad' ? [] : antes.valores.filter(x => !esta(x, desp.valores));
        est.ganadas = antes.tipo === 'identidad' || desp.tipo === 'identidad' ? [] : desp.valores.filter(x => !esta(x, antes.valores));
        est.conserva = antes.tipo === desp.tipo || (['unica', 'dos', 'doble'].includes(antes.tipo) && ['unica', 'dos', 'doble'].includes(desp.tipo)) ? !est.perdidas.length && !est.ganadas.length : false;
      }
      // Dividir o multiplicar por algo que puede valer 0: los valores donde vale 0 se pierden o se agregan
      if ((op === '/' || op === '*') && !esConstante(pe)) {
        const z = conjunto(analizar(`${escribirPoli(pe)} = 0`), v);
        est.ceroEn = z.valores || [];
        est.advertencia = op === '/' ? `si ${e.texto} vale 0 se está dividiendo entre 0: hay que ver aparte si ${v} = ${(z.texto || []).join(' o ')} es solución`
          : `multiplicar por ${e.texto} agrega la solución ${v} = ${(z.texto || []).join(' o ')}`;
      }
      if (lado !== 'ambos') est.advertencia = 'la operación se hizo en un solo plato: la balanza ya no está en equilibrio con las soluciones de antes';
      estados.push(est); antes = desp;
    }
    return { variable: v, estados, final: estados[estados.length - 1] };
  }

  // ---------- Sistemas lineales 2 × 2 ----------
  function lineal2(t, vs) {
    const a = typeof t === 'string' ? analizar(t) : t;
    if (a.tipo !== 'ecuacion') throw new Error('cada parte del sistema debe ser una ecuación');
    const p = aCero(a);
    if (grado(p) > 1) throw new Error('el sistema debe ser lineal');
    const ls = letrasDe(p).filter(l => !vs.includes(l));
    if (ls.length) throw new Error(`letra de más en el sistema: ${ls.join(', ')}`);
    return { a: p[vs[0]] || F(0), b: p[vs[1]] || F(0), c: fNeg(constanteDe(p)), texto: a.texto };
  }
  function sistema(t1, t2, variables) {
    const a1 = typeof t1 === 'string' ? analizar(t1) : t1, a2 = typeof t2 === 'string' ? analizar(t2) : t2;
    const vs = variables || [...new Set(a1.variables.concat(a2.variables))].sort();
    if (vs.length !== 2) throw new Error('el sistema 2 × 2 necesita exactamente dos letras');
    const [x, y] = vs, e1 = lineal2(a1, vs), e2 = lineal2(a2, vs);
    const det = fRes(fMul(e1.a, e2.b), fMul(e2.a, e1.b));
    const forma = e => `${escribirPoli(pSum({ [x]: e.a }, { [y]: e.b }))} = ${txF(e.c)}`;
    const r = { variables: vs, ecuaciones: [a1.texto, a2.texto], ordenadas: [forma(e1), forma(e2)], determinante: limpio(fNum(det)) };
    if (fCero(det)) {
      // proporcionales: ¿también el lado derecho?
      const dx = fRes(fMul(e1.c, e2.b), fMul(e2.c, e1.b)), dy = fRes(fMul(e1.a, e2.c), fMul(e2.a, e1.c));
      r.tipo = fCero(dx) && fCero(dy) ? 'infinitas' : 'ninguna';
      r.pasos = [r.ordenadas[0], r.ordenadas[1], r.tipo === 'infinitas' ? 'Una ecuación es la otra multiplicada por un número: dicen lo mismo y tienen infinitas soluciones.' : 'Los lados izquierdos son proporcionales y los derechos no: las ecuaciones se contradicen y no hay solución.'];
      return r;
    }
    const vx = fDiv(fRes(fMul(e1.c, e2.b), fMul(e2.c, e1.b)), det), vy = fDiv(fRes(fMul(e1.a, e2.c), fMul(e2.a, e1.c)), det);
    r.tipo = 'unica'; r.valores = { [x]: limpio(fNum(vx)), [y]: limpio(fNum(vy)) }; r.textos = { [x]: txF(vx), [y]: txF(vy) };
    r.comprobaciones = [comprobar(a1, { [x]: vx, [y]: vy }), comprobar(a2, { [x]: vx, [y]: vy })];
    // Eliminación: una ecuación por un número f para que una letra se cancele al sumar. Se prefiere un f entero.
    r.pasos = [r.ordenadas[0], r.ordenadas[1]];
    const E = [e1, e2], cands = [];
    for (const [cual, elim] of [[1, 'b'], [0, 'b'], [1, 'a'], [0, 'a']]) {
      const otra = 1 - cual;
      if (fCero(E[cual][elim]) || fCero(E[otra][elim])) continue;
      cands.push({ cual, otra, elim, f: fDiv(fNeg(E[otra][elim]), E[cual][elim]) });
    }
    const el = cands.find(c => c.f.d === 1) || cands[0];
    if (el) {
      const { cual, otra, elim, f } = el, queda = elim === 'a' ? 'b' : 'a', vQ = queda === 'a' ? x : y, vE = elim === 'a' ? x : y;
      const m = { a: fMul(f, E[cual].a), b: fMul(f, E[cual].b), c: fMul(f, E[cual].c) };
      const ord = ['primera', 'segunda'];
      const valQ = queda === 'a' ? vx : vy, valE = elim === 'a' ? vx : vy;
      r.pasos.push(`Se multiplica la ${ord[cual]} por ${txF(f)} (los dos lados): ${forma(m)}`,
        `Se suman las dos: ${escribirPoli({ [vQ]: fSum(E[otra][queda], m[queda]) })} = ${txF(fSum(E[otra].c, m.c))}, así que ${vQ} = ${txF(valQ)}`,
        `Se reemplaza en la ${ord[otra]}: ${vE} = ${txF(valE)}`);
      // AL18: multiplicar solo el lado izquierdo (el derecho queda sin multiplicar)
      const kQ = fSum(E[otra][queda], m[queda]), cMal = fSum(E[otra].c, E[cual].c);
      if (!fCero(kQ) && !fCero(E[otra][elim])) {
        const qMal = fDiv(cMal, kQ), eMal = fDiv(fRes(E[otra].c, fMul(E[otra][queda], qMal)), E[otra][elim]);
        const val = { [vQ]: qMal, [vE]: eMal };
        r.errores = { multiplicaUnLado: { [x]: limpio(fNum(val[x])), [y]: limpio(fNum(val[y])),
          cumplePrimera: comprobar(a1, val).verdadera, cumpleSegunda: comprobar(a2, val).verdadera } };
      }
    } else r.pasos.push(`${x} = ${txF(vx)}, ${y} = ${txF(vy)}`);
    return r;
  }

  // ---------- Edades ----------
  // «Hace n años (tiempo = −n) / dentro de n años (tiempo = +n), la edad de A era/será k veces la de B.»
  // Se conoce la edad de hoy de una persona; se busca la de la otra.
  function edades(o) {
    const k = numero(o.k, 'k', { positivo: true }), t = numero(o.tiempo, 'tiempo'), val = numero(o.valor, 'la edad conocida', { positivo: true });
    const A = o.conocida || 'M', B = o.incognita || 'B';
    if (A === B) throw new Error('las dos personas necesitan letras distintas');
    const s = t < 0 ? MENOS : '+', n = Math.abs(t);
    const ec = t === 0 ? `${val} = ${kL(k, B)}` : `${val} ${s} ${n} = ${k}(${B} ${s} ${n})`;
    const r = resolver(ec, B);
    const b = r.soluciones[0];
    if (b + t < 0 || val + t < 0) throw new Error('con esos datos alguien tendría edad negativa');
    const res = { [A]: val, [B]: limpio(b), ecuacion: texto(ec), pasos: r.pasos,
      entonces: { [A]: limpio(val + t), [B]: limpio(b + t) }, diferencia: limpio(val - b),
      errores: {
        // 30 = 2B: sin el tiempo
        sinTiempo: limpio(val / k),
        // 30 − 4 = 2B: el tiempo solo a la persona conocida (sale la edad de B en ese momento, no la de hoy)
        soloConocida: limpio((val + t) / k),
        // 30 = 2(B − 4): el tiempo solo a la incógnita
        soloIncognita: limpio(val / k - t) } };
    res.comprobacion = `${val + t} = ${k} · ${limpio(b + t)}`;
    return res;
  }
  // Edades de cada persona en varios instantes (tiempo en años desde hoy). La diferencia no cambia; la razón sí (RM3).
  function lineaEdades(hoy, tiempos) {
    const ks = Object.keys(hoy || {});
    if (ks.length !== 2) throw new Error('lineaEdades necesita exactamente dos personas');
    ks.forEach(k => numero(hoy[k], `la edad de ${k}`));
    return (tiempos || [0]).map(t => {
      numero(t, 'el tiempo');
      const e = Object.fromEntries(ks.map(k => [k, limpio(hoy[k] + t)]));
      return Object.assign({ t }, e, { diferencia: limpio(e[ks[0]] - e[ks[1]]), razon: e[ks[1]] > 0 ? limpio(e[ks[0]] / e[ks[1]]) : null });
    });
  }
  // Dentro de n años, cada persona suma n: la suma crece personas · n.
  function sumaEdades(o) {
    const s = numero(o.suma, 'la suma', { positivo: true }), p = numero(o.personas === undefined ? 2 : o.personas, 'personas', { positivo: true, entero: true }), t = numero(o.tiempo, 'el tiempo');
    const v = limpio(s + p * t);
    if (v < 0) throw new Error('la suma quedaría negativa');
    return { valor: v, aumento: limpio(p * t), errores: { unaVez: limpio(s + t), sinCambio: s, porLaMitad: limpio(s + t / 2) } };
  }

  // ---------- Móviles ----------
  // Encuentro: salen a la vez, uno hacia el otro, separados 'distancia'. Alcance: el de atrás (v1) persigue al de adelante (v2).
  function moviles(o) {
    const d = numero(o.distancia, 'la distancia', { positivo: true }), v1 = numero(o.v1, 'v1', { positivo: true }), v2 = numero(o.v2, 'v2', { positivo: true });
    const sentido = o.sentido || 'opuesto';
    if (sentido !== 'opuesto' && sentido !== 'mismo') throw new Error("sentido debe ser 'opuesto' o 'mismo'");
    const r = { sentido, distancia: d, v1, v2 };
    if (sentido === 'opuesto') {
      const t = limpio(d / (v1 + v2));
      Object.assign(r, { tiempo: t, alcanza: true, posicion: limpio(v1 * t), recorrido1: limpio(v1 * t), recorrido2: limpio(v2 * t), rapidezRelativa: v1 + v2,
        sistema: [`p = ${v1}t`, `p = ${d} − ${v2}t`], ecuacion: `${v1}t + ${v2}t = ${d}`,
        errores: { restaRapideces: v1 === v2 ? null : limpio(d / Math.abs(v1 - v2)), promedio: limpio(d / ((v1 + v2) / 2)), soloRapido: limpio(d / Math.max(v1, v2)), soloLento: limpio(d / Math.min(v1, v2)) } });
    } else {
      const alcanza = v1 > v2, t = alcanza ? limpio(d / (v1 - v2)) : null;
      Object.assign(r, { tiempo: t, alcanza, rapidezRelativa: v1 - v2, posicion: alcanza ? limpio(v1 * t) : null, recorrido1: alcanza ? limpio(v1 * t) : null, recorrido2: alcanza ? limpio(v2 * t) : null,
        sistema: [`p = ${v1}t`, `p = ${d} + ${v2}t`], ecuacion: `${v1}t − ${v2}t = ${d}`,
        errores: { sumaRapideces: limpio(d / (v1 + v2)), soloRapido: limpio(d / v1), soloLento: limpio(d / v2), promedio: limpio(d / ((v1 + v2) / 2)) } });
    }
    return r;
  }
  // Posición p de cada móvil (en km, desde la salida del primero, en el sentido del primero) en el instante t.
  // (La posición se llama p y no x: en esta plantilla x es siempre la incógnita.)
  function posiciones(o, t) {
    numero(t, 't');
    const m = moviles(o);
    const x1 = limpio(m.v1 * t), x2 = limpio(m.sentido === 'opuesto' ? m.distancia - m.v2 * t : m.distancia + m.v2 * t);
    return { t, x1, x2, separacion: limpio(Math.abs(x2 - x1)), cruzaron: m.sentido === 'opuesto' ? x1 >= x2 - 1e-9 : x1 >= x2 - 1e-9 };
  }

  // ---------- Mezclas ----------
  // cantidad = x + y; precio1·x + precio2·y = precioMezcla·cantidad
  function mezcla(o) {
    const q = numero(o.cantidad, 'la cantidad', { positivo: true }), p1 = numero(o.precio1, 'precio1', { positivo: true }), p2 = numero(o.precio2, 'precio2', { positivo: true }), pm = numero(o.precioMezcla, 'el precio de la mezcla', { positivo: true });
    if (p1 === p2) throw new Error('los dos precios deben ser distintos');
    if ((pm - p1) * (pm - p2) > 0) throw new Error('el precio de la mezcla debe estar entre los dos precios');
    const s = sistema(`x + y = ${String(q).replace('.', ',')}`, `${String(p1).replace('.', ',')}x + ${String(p2).replace('.', ',')}y = ${String(limpio(pm * q)).replace('.', ',')}`, ['x', 'y']);
    return { x: s.valores.x, y: s.valores.y, sistema: s.ecuaciones, pasos: s.pasos,
      errores: { mitades: limpio(q / 2), precioPromedio: limpio((p1 + p2) / 2), alReves: { x: s.valores.y, y: s.valores.x } } };
  }

  // ---------- ¿Cuál es mayor? (AL5) ----------
  function comparar(t1, t2, variable) {
    const a = analizar(`${t1} = ${t2}`), v = variable || a.variables[0];
    const p = aCero(a), c = coefs(p, v);
    if (c.length > 2) throw new Error('comparar trabaja con expresiones de grado 1');
    if (c.length < 2 || fCero(c[1])) {
      const d = fNum(c[0] || F(0));
      return { igualesEn: null, siempre: d === 0 ? 'iguales' : d > 0 ? 'primera' : 'segunda' };
    }
    const x0 = fDiv(fNeg(c[0]), c[1]), crece = c[1].n > 0;
    return { igualesEn: limpio(fNum(x0)), igualesTexto: txF(x0), primeraMayorSi: `${v} ${crece ? '>' : '<'} ${txF(x0)}`, segundaMayorSi: `${v} ${crece ? '<' : '>'} ${txF(x0)}`,
      errores: { siemprePrimera: 'multiplicar siempre agranda' } };
  }

  return { analizar, texto, polinomio, evaluar, comprobar, porCada, traducir, plantillasDeFrase, cadena, resolver, balanza, pesos, sistema,
    edades, lineaEdades, sumaEdades, moviles, posiciones, mezcla, comparar };
});
