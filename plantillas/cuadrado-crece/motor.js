/*
 * Motor de «El cuadrado que crece»: productos notables, factorización y linealidad indebida.
 *
 * Aquí vive toda la matemática de la plantilla (regla 1 de CLAUDE.md). No toca el DOM:
 * funciona igual en el navegador (window.MotorCuadrado) y en Node (require('./motor.js')),
 * donde lo prueban casos.json y papel.json. No usa eval: las expresiones las lee un analizador propio,
 * con fracciones exactas (las raíces y los logaritmos quedan exactos cuando lo son: √25 = 5, log 1000 = 3).
 *
 *   analizar(texto)                        lee una expresión: '(a + b)²', '√(9 + 16)', 'log 100 + log 10', '2^(3 + 2)'
 *   texto(texto | árbol)                   la escribe bonita, con − tipográfico, · y exponentes
 *   evaluar(texto, valores)                sustituye y calcula: { valor, exacto, sustituida }
 *   comprobar(izq, der, valores)           ¿los dos lados dan lo mismo con esos valores?
 *   desarrollar(texto)                     multiplica todo: el polinomio en orden ('a² + 2ab + b²')
 *   identidad(izq, der)                    ¿es identidad? si no, un contraejemplo con números chicos
 *   binomioCuadrado({ a, b, signo })       (a ± b)² con números: piezas a², ab, ab, b² y sus errores (AL8)
 *   binomioCuadradoX({ b, signo, letra })  (x ± b)² desarrollado, con sus errores
 *   piezasCuadrado({ a, b, hueco, f })     el cuadrado de lado a + b partido en cuatro piezas, separadas un poco (f de 0 a 1)
 *   restaCuadrado({ a, b })                (a − b)²: el cuadrado grande menos dos tiras más la esquina, aunque a < b
 *   diferenciaCuadrados({ a, b })          a² − b² = (a + b)(a − b): el corte de la esquina y el reacomodo
 *   reacomodo({ a, b, f })                 dónde está la pieza que se mueve en el reacomodo, de f = 0 a f = 1
 *   cuboBinomio({ a, b })                  (a + b)³ = a³ + 3a²b + 3ab² + b³ con sus ocho piezas y sus errores (AL11)
 *   piezasCubo({ a, b, hueco, huecoZ, f }) las ocho piezas, separadas (huecoZ: cuánto se levanta la capa de arriba)
 *   productoX({ m, n })                    (x + m)(x + n) = x² + (m + n)x + mn
 *   trinomioCuadrado({ a, b, c })          (a + b + c)²
 *   legendre({ a, b })                     (a + b)² + (a − b)² = 2(a² + b²) y (a + b)² − (a − b)² = 4ab
 *   sumaProducto({ suma, producto })       a² + b², (a − b)² y a³ + b³ sabiendo a + b y ab
 *   factorizar(texto)                      factor común, diferencia de cuadrados, trinomio cuadrado perfecto o aspa simple
 *   hipotenusa({ a, b })                   √(a² + b²) contra a + b, con el triángulo y los cuadrados de sus lados (AL9)
 *   raizDeSuma({ p, q })                   √(p + q) contra √p + √q
 *   raizDelCuadrado({ x })                 √(x²) = |x|
 *   fraccionSumandos({ x, m, n })          (x + m)/(x + n) contra m/n: los sumandos no se tachan (AL12)
 *   potenciaDeSuma({ base, m, n })         base^(m + n) = base^m · base^n, en grupos que se cuentan (AL11)
 *   logProducto({ a, b, base })            log(ab) = log a + log b, con la regla logarítmica (AL10)
 *   logDeSuma({ a, b, base })              log(a + b) contra log a + log b (AL10)
 *
 * Cada resultado que es la respuesta de una predicción trae 'errores': lo que da cada error típico de
 * docs/investigacion/algebra-funciones-ideas-erroneas.md (AL8 a AL11 y otros que son hipótesis nuestras).
 * Un error que con esos números da lo mismo que la respuesta correcta NO va en 'errores': va en 'coinciden'
 * (por ejemplo, con b = 0 la regla falsa (a + b)² = a² + b² sí se cumple). Así ninguna opción incorrecta
 * puede ser también correcta.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorCuadrado = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const TOL = 1e-9;
  const MENOS = '−';
  function numero(x, que, o) {
    o = o || {};
    if (typeof x !== 'number' || !Number.isFinite(x)) throw new Error(`${que} debe ser un número`);
    if (o.entero && !Number.isInteger(x)) throw new Error(`${que} debe ser un número entero`);
    if (o.noNeg && x < 0) throw new Error(`${que} no puede ser negativo`);
    if (o.positivo && !(x > 0)) throw new Error(`${que} debe ser mayor que cero`);
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
  const fIgual = (a, b) => a.n === b.n && a.d === b.d;
  const fNum = a => a.n / a.d;
  function fPot(a, e) {
    if (e < 0) return fPot(fDiv(F(1), a), -e);
    let r = F(1); for (let k = 0; k < e; k++) r = fMul(r, a); return r;
  }
  function aF(x) {
    if (typeof x === 'object' && x && 'n' in x) return x;
    numero(x, 'el valor');
    for (let q = 1; q <= 1e9; q *= 10) { const p = Math.round(x * q); if (Math.abs(p / q - x) <= 1e-12 * Math.max(1, Math.abs(x))) return F(p, q); }
    for (let q = 2; q <= 20000; q++) { const p = Math.round(x * q); if (Math.abs(p / q - x) <= 1e-12 * Math.max(1, Math.abs(x))) return F(p, q); }
    throw new Error('el valor no tiene una fracción exacta corta');
  }
  const txF = a => (a.n < 0 ? MENOS : '') + (a.d === 1 ? String(Math.abs(a.n)) : `${Math.abs(a.n)}/${a.d}`);
  // raíz entera exacta de un entero no negativo (o null)
  function raizEntera(n, k) {
    if (n < 0) return null;
    const r = Math.round(Math.pow(n, 1 / k));
    for (const c of [r - 1, r, r + 1]) if (c >= 0 && Math.pow(c, k) === n) return c;
    return null;
  }

  // ---------- Valores: fracción exacta o número aproximado ----------
  // { f: fracción | null, x: número }. Las operaciones quedan exactas mientras se pueda.
  const V = f => ({ f, x: fNum(f) });
  const Vx = x => ({ f: null, x });
  function op(a, b, fe, fx) { if (a.f && b.f) { try { return V(fe(a.f, b.f)); } catch (e) { if (/división/.test(e.message)) throw e; } } return Vx(fx(a.x, b.x)); }
  const vSum = (a, b) => op(a, b, fSum, (p, q) => p + q);
  const vRes = (a, b) => op(a, b, fRes, (p, q) => p - q);
  const vMul = (a, b) => op(a, b, fMul, (p, q) => p * q);
  const vDiv = (a, b) => { if (Math.abs(b.x) < 1e-15) throw new Error('división entre cero'); return op(a, b, fDiv, (p, q) => p / q); };
  function vPot(a, e) {
    if (e.f && e.f.d === 1 && a.f) {
      if (a.f.n === 0 && e.f.n < 0) throw new Error('división entre cero');
      if (Math.abs(e.f.n) <= 64) { try { return V(fPot(a.f, e.f.n)); } catch (err) { /* demasiado grande: aproximado */ } }
    }
    if (e.f && a.f && e.f.d > 1) {
      if (a.f.n < 0) throw new Error('potencia fraccionaria de un número negativo');
      const n = raizEntera(a.f.n, e.f.d), d = raizEntera(a.f.d, e.f.d);
      if (n !== null && d !== null) return vPot(V(F(n, d)), V(F(e.f.n)));
    }
    if (a.x < 0 && !Number.isInteger(e.x)) throw new Error('potencia fraccionaria de un número negativo');
    return Vx(Math.pow(a.x, e.x));
  }
  function vRaiz(a) {
    if (a.x < -1e-15) throw new Error('raíz cuadrada de un número negativo: no existe en los reales');
    if (a.f) { const n = raizEntera(a.f.n, 2), d = raizEntera(a.f.d, 2); if (n !== null && d !== null) return V(F(n, d)); }
    return Vx(Math.sqrt(Math.max(0, a.x)));
  }
  function vLog(a, base) {
    if (!(a.x > 0)) throw new Error('logaritmo de un número que no es positivo: no existe');
    if (!(base.x > 0) || Math.abs(base.x - 1) < 1e-15) throw new Error('la base del logaritmo debe ser positiva y distinta de 1');
    if (a.f && base.f) for (let k = -60; k <= 60; k++) { try { if (fIgual(fPot(base.f, k), a.f)) return V(F(k)); } catch (e) { /* sigue */ } }
    return Vx(Math.log(a.x) / Math.log(base.x));
  }
  const vAbs = a => (a.f ? V(F(Math.abs(a.f.n), a.f.d)) : Vx(Math.abs(a.x)));
  const vTexto = v => (v.f ? txF(v.f) : null);

  // ---------- Lector de expresiones (sin eval) ----------
  const SUP = { '⁰': 0, '¹': 1, '²': 2, '³': 3, '⁴': 4, '⁵': 5, '⁶': 6, '⁷': 7, '⁸': 8, '⁹': 9 };
  const SUB = { '₀': 0, '₁': 1, '₂': 2, '₃': 3, '₄': 4, '₅': 5, '₆': 6, '₇': 7, '₈': 8, '₉': 9 };
  const SUPS = Object.keys(SUP), SUBS = Object.keys(SUB);
  function tokens(s) {
    if (typeof s !== 'string' || !s.trim()) throw new Error('la expresión está vacía');
    const t = []; let i = 0;
    while (i < s.length) {
      const c = s[i];
      if (/\s/.test(c)) { i++; continue; }
      if (/[0-9]/.test(c)) {
        let j = i; while (j < s.length && /[0-9]/.test(s[j])) j++;
        if ((s[j] === ',' || s[j] === '.') && /[0-9]/.test(s[j + 1] || '')) { j++; while (j < s.length && /[0-9]/.test(s[j])) j++; }
        t.push({ k: 'num', v: aF(Number(s.slice(i, j).replace(',', '.'))) }); i = j; continue;
      }
      if (s.startsWith('log', i)) {
        i += 3; let base = null;
        if (s[i] === '_') { i++; let j = i; while (j < s.length && /[0-9]/.test(s[j])) j++; if (j === i) throw new Error('falta la base del logaritmo'); base = Number(s.slice(i, j)); i = j; }
        else if (SUBS.includes(s[i])) { let b = ''; while (SUBS.includes(s[i])) { b += SUB[s[i]]; i++; } base = Number(b); }
        t.push({ k: 'log', base: base === null ? 10 : base }); continue;
      }
      if (/[a-zA-Z]/.test(c)) { t.push({ k: 'var', v: c }); i++; continue; }
      if (SUPS.includes(c)) { let e = ''; while (SUPS.includes(s[i])) { e += SUP[s[i]]; i++; } t.push({ k: 'sup', v: Number(e) }); continue; }
      if ('+'.includes(c)) { t.push({ k: '+' }); i++; continue; }
      if ('-−'.includes(c)) { t.push({ k: '-' }); i++; continue; }
      if ('*·×'.includes(c)) { t.push({ k: '*' }); i++; continue; }
      if ('/÷'.includes(c)) { t.push({ k: '/' }); i++; continue; }
      if (c === '^') { t.push({ k: '^' }); i++; continue; }
      if (c === '(' || c === ')' || c === '|' || c === '=') { t.push({ k: c }); i++; continue; }
      if (c === '√') { t.push({ k: 'raiz' }); i++; continue; }
      throw new Error(`no entiendo el símbolo «${c}»`);
    }
    return t;
  }
  function analizar(s) {
    if (typeof s === 'object' && s && s.t) return s;
    const t = tokens(s); let p = 0;
    const ver = () => t[p], tomar = k => { if (!t[p] || t[p].k !== k) throw new Error(`se esperaba «${k}» en «${s}»`); return t[p++]; };
    const empiezaAtomo = q => q && ['num', 'var', '(', 'raiz', 'log'].includes(q.k);
    function expr() {
      let a = termino();
      while (ver() && (ver().k === '+' || ver().k === '-')) { const o = t[p++].k; a = { t: o, a, b: termino() }; }
      return a;
    }
    function termino() {
      let a = unario();
      for (;;) {
        const q = ver();
        if (q && (q.k === '*' || q.k === '/')) { p++; a = { t: q.k, a, b: unario() }; continue; }
        if (empiezaAtomo(q)) { a = { t: '*', a, b: potencia(), implicita: true }; continue; }
        return a;
      }
    }
    function unario() {
      if (ver() && ver().k === '-') { p++; return { t: 'neg', a: unario() }; }
      if (ver() && ver().k === '+') { p++; return unario(); }
      return potencia();
    }
    function potencia() {
      let a = atomo();
      for (;;) {
        const q = ver();
        if (q && q.k === 'sup') { p++; a = { t: '^', a, b: { t: 'num', v: F(q.v) } }; continue; }
        if (q && q.k === '^') { p++; a = { t: '^', a, b: unario() }; continue; }
        return a;
      }
    }
    function atomo() {
      const q = ver();
      if (!q) throw new Error(`la expresión «${s}» termina antes de tiempo`);
      if (q.k === 'num') { p++; return { t: 'num', v: q.v }; }
      if (q.k === 'var') { p++; return { t: 'var', n: q.v }; }
      if (q.k === '(') { p++; const e = expr(); tomar(')'); return { t: 'par', a: e }; }
      if (q.k === '|') { p++; const e = expr(); tomar('|'); return { t: 'abs', a: e }; }
      if (q.k === 'raiz') { p++; return { t: 'raiz', a: potenciaSinSigno() }; }
      if (q.k === 'log') { p++; return { t: 'log', base: F(q.base), a: potenciaSinSigno() }; }
      throw new Error(`no esperaba «${q.k}» en «${s}»`);
    }
    // √x² es √(x²) y log 100 es log(100): el argumento sin paréntesis es un átomo con su exponente
    function potenciaSinSigno() { return potencia(); }
    const e = expr();
    if (p < t.length) throw new Error(`sobra algo al final de «${s}»`);
    return quitarPar(e);
  }
  // Los paréntesis se guardan solo para leer bien; el árbol que se usa no los necesita
  function quitarPar(n) {
    if (!n || typeof n !== 'object') return n;
    if (n.t === 'par') return quitarPar(n.a);
    const r = { ...n };
    if (r.a) r.a = quitarPar(r.a);
    if (r.b) r.b = quitarPar(r.b);
    return r;
  }

  // ---------- Escritura bonita ----------
  const PREC = { '+': 1, '-': 1, '*': 2, '/': 2, neg: 3, '^': 4 };
  const SUPC = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
  const sup = k => String(k).split('').map(d => SUPC[+d]).join('');
  function prec(n) { return PREC[n.t] || 9; }
  function escribir(n, sust) {
    sust = sust || null;
    const num = n0 => n0.t === 'num' || (sust && n0.t === 'var' && n0.n in sust);
    const valorDe = n0 => (n0.t === 'num' ? n0.v : sust[n0.n]);
    // √9, √a y log 100 van sin paréntesis; √(9 + 16) y log(1/2), con paréntesis
    function simpleArg(x, positivo) {
      if (x.t === 'var' && !(sust && x.n in sust)) return true;
      if (num(x)) { const v = valorDe(x); return v.d === 1 && (positivo ? v.n > 0 : v.n >= 0); }
      return false;
    }
    function w(n0, ctx) {
      switch (n0.t) {
        case 'num': case 'var': {
          if (n0.t === 'var' && !(sust && n0.n in sust)) return n0.n;
          const v = valorDe(n0), s = txF(v);
          const neg = v.n < 0, frac = v.d !== 1;
          if ((neg && ctx && ctx !== 'izq' && ctx !== 'raiz') || (frac && (ctx === 'base' || ctx === 'factor' || ctx === 'izqf'))) return `(${s})`;
          return s;
        }
        case '+': case '-': {
          const der = n0.b;
          const a = w(n0.a, 'izq');
          let b = w(der, prec(der) <= 1 ? 'parentesis' : 'der');
          if (prec(der) <= 1) b = `(${w(der)})`;
          return `${a} ${n0.t === '+' ? '+' : MENOS} ${b}`;
        }
        case '*': {
          const f = x => (prec(x) < 2 ? `(${w(x)})` : w(x, 'factor'));
          const fa = prec(n0.a) < 2 ? `(${w(n0.a)})` : w(n0.a, 'izqf');
          const fb = f(n0.b);
          // coeficiente pegado a letras, raíces y paréntesis; entre números, «·»
          const izqNum = num(n0.a) || (n0.a.t === '*' && num(rightmost(n0.a)));
          const derEmpiezaNum = num(leftmost(n0.b)) || n0.b.t === 'neg';
          const pegar = !derEmpiezaNum && !(izqNum && n0.b.t === 'par') && (izqNum || n0.a.t === 'var' || n0.a.t === '^' || n0.a.t === '*' || prec(n0.a) < 2);
          return pegar ? `${fa}${fb}` : `${fa} · ${fb}`;
        }
        case '/': {
          const fa = prec(n0.a) < 2 ? `(${w(n0.a)})` : w(n0.a, 'izq');
          const fb = prec(n0.b) <= 2 ? `(${w(n0.b)})` : w(n0.b, 'factor');
          return `${fa}/${fb}`;
        }
        case 'neg': {
          const x = n0.a, s = prec(x) <= 2 && x.t !== 'num' ? `(${w(x)})` : w(x, 'neg');
          const r = `${MENOS}${s}`;
          return ctx && ctx !== 'izq' ? `(${r})` : r;
        }
        case '^': {
          const base = n0.a, e = n0.b;
          const bs = (prec(base) < 9 || base.t === 'raiz' || base.t === 'log') ? `(${w(base)})` : w(base, 'base');
          if (num(e) && valorDe(e).d === 1 && valorDe(e).n >= 0) return `${bs}${sup(valorDe(e).n)}`;
          const es = (e.t === 'num' || e.t === 'var') && !(e.t === 'num' && (e.v.n < 0 || e.v.d !== 1)) ? w(e) : `(${w(e)})`;
          return `${bs}^${es}`;
        }
        case 'raiz': {
          const x = n0.a;
          return simpleArg(x, false) ? `√${w(x, 'raiz')}` : `√(${w(x)})`;
        }
        case 'log': {
          const b = n0.base, bt = b.n === 10 && b.d === 1 ? '' : String(b.n).split('').map(d => '₀₁₂₃₄₅₆₇₈₉'[+d]).join('');
          const x = n0.a;
          return simpleArg(x, true) ? `log${bt} ${w(x, 'raiz')}` : `log${bt}(${w(x)})`;
        }
        case 'abs': return `|${w(n0.a)}|`;
        default: throw new Error('nodo desconocido');
      }
    }
    return w(n);
  }
  function leftmost(n) { return n.t === '*' || n.t === '/' || n.t === '+' || n.t === '-' ? leftmost(n.a) : n.t === '^' ? leftmost(n.a) : n; }
  function rightmost(n) { return n.t === '*' ? rightmost(n.b) : n; }
  function texto(e) { return escribir(analizar(e)); }

  // ---------- Evaluar ----------
  function valorArbol(n, val) {
    switch (n.t) {
      case 'num': return V(n.v);
      case 'var': {
        if (!val || !(n.n in val)) throw new Error(`falta el valor de ${n.n}`);
        return V(aF(val[n.n]));
      }
      case '+': return vSum(valorArbol(n.a, val), valorArbol(n.b, val));
      case '-': return vRes(valorArbol(n.a, val), valorArbol(n.b, val));
      case '*': return vMul(valorArbol(n.a, val), valorArbol(n.b, val));
      case '/': return vDiv(valorArbol(n.a, val), valorArbol(n.b, val));
      case 'neg': { const a = valorArbol(n.a, val); return a.f ? V(fNeg(a.f)) : Vx(-a.x); }
      case '^': return vPot(valorArbol(n.a, val), valorArbol(n.b, val));
      case 'raiz': return vRaiz(valorArbol(n.a, val));
      case 'log': return vLog(valorArbol(n.a, val), V(n.base));
      case 'abs': return vAbs(valorArbol(n.a, val));
      default: throw new Error('nodo desconocido');
    }
  }
  function variablesDe(n, s) {
    s = s || new Set();
    if (n.t === 'var') s.add(n.n);
    if (n.a) variablesDe(n.a, s);
    if (n.b) variablesDe(n.b, s);
    return s;
  }
  function evaluar(e, valores) {
    const n = analizar(e), val = {};
    for (const [k, v] of Object.entries(valores || {})) val[k] = aF(v);
    const r = valorArbol(n, val);
    return { valor: limpio(r.x), exacto: vTexto(r), sustituida: escribir(n, val), expresion: escribir(n) };
  }
  function comprobar(izq, der, valores) {
    const a = evaluar(izq, valores), b = evaluar(der, valores);
    const iguales = Math.abs(a.valor - b.valor) <= 1e-9 * Math.max(1, Math.abs(a.valor), Math.abs(b.valor));
    return { iguales, izq: a, der: b, diferencia: limpio(a.valor - b.valor) };
  }

  // ---------- Polinomios en varias letras ----------
  // Un polinomio es un mapa: monomio ('a²b' guardado como 'a:2|b:1') → coeficiente (fracción).
  const clave = m => Object.keys(m).filter(k => m[k]).sort().map(k => `${k}:${m[k]}`).join('|');
  const deClave = k => (k ? Object.fromEntries(k.split('|').map(x => { const [v, e] = x.split(':'); return [v, +e]; })) : {});
  function pConst(f) { const p = new Map(); if (f.n !== 0) p.set('', f); return p; }
  function pVar(v) { return new Map([[`${v}:1`, F(1)]]); }
  function pSum(p, q, s) {
    const r = new Map(p);
    for (const [k, c] of q) { const v = r.has(k) ? (s < 0 ? fRes(r.get(k), c) : fSum(r.get(k), c)) : (s < 0 ? fNeg(c) : c); if (v.n === 0) r.delete(k); else r.set(k, v); }
    return r;
  }
  function pMul(p, q) {
    let r = new Map();
    for (const [k1, c1] of p) for (const [k2, c2] of q) {
      const m = deClave(k1), m2 = deClave(k2);
      for (const [v, e] of Object.entries(m2)) m[v] = (m[v] || 0) + e;
      r = pSum(r, new Map([[clave(m), fMul(c1, c2)]]), 1);
    }
    return r;
  }
  function pPot(p, e) { let r = pConst(F(1)); for (let k = 0; k < e; k++) r = pMul(r, p); return r; }
  function polinomioArbol(n) {
    switch (n.t) {
      case 'num': return pConst(n.v);
      case 'var': return pVar(n.n);
      case '+': return pSum(polinomioArbol(n.a), polinomioArbol(n.b), 1);
      case '-': return pSum(polinomioArbol(n.a), polinomioArbol(n.b), -1);
      case '*': return pMul(polinomioArbol(n.a), polinomioArbol(n.b));
      case 'neg': return pSum(new Map(), polinomioArbol(n.a), -1);
      case '/': {
        const q = polinomioArbol(n.b);
        if (q.size !== 1 || !q.has('')) throw new Error('no es un polinomio: hay una división entre letras');
        return pMul(polinomioArbol(n.a), pConst(fDiv(F(1), q.get(''))));
      }
      case '^': {
        if (n.b.t !== 'num' || n.b.v.d !== 1 || n.b.v.n < 0) throw new Error('no es un polinomio: el exponente no es un número natural');
        if (n.b.v.n > 12) throw new Error('exponente demasiado grande');
        return pPot(polinomioArbol(n.a), n.b.v.n);
      }
      default: throw new Error('no es un polinomio: tiene raíces, logaritmos o valor absoluto');
    }
  }
  function gradoM(m) { return Object.values(m).reduce((s, e) => s + e, 0); }
  function ordenar(p) {
    const vars = [...new Set([...p.keys()].flatMap(k => Object.keys(deClave(k))))].sort();
    return [...p.entries()].map(([k, c]) => ({ m: deClave(k), c })).sort((u, v) => {
      const g = gradoM(v.m) - gradoM(u.m); if (g) return g;
      for (const x of vars) { const d = (v.m[x] || 0) - (u.m[x] || 0); if (d) return d; }
      return 0;
    });
  }
  function txMonomio(m) { return Object.keys(m).sort().map(v => v + (m[v] > 1 ? sup(m[v]) : '')).join(''); }
  function txPol(p) {
    const t = ordenar(p);
    if (!t.length) return '0';
    return t.map(({ m, c }, i) => {
      const mon = txMonomio(m), neg = c.n < 0, a = F(Math.abs(c.n), c.d);
      let coef = a.d === 1 ? String(a.n) : `(${a.n}/${a.d})`;
      if (mon && a.n === 1 && a.d === 1) coef = '';
      const cuerpo = coef + mon;
      return i === 0 ? (neg ? MENOS : '') + cuerpo : ` ${neg ? MENOS : '+'} ${cuerpo}`;
    }).join('');
  }
  function polinomio(e) { return polinomioArbol(analizar(e)); }
  function desarrollar(e) {
    const p = polinomio(e), t = ordenar(p);
    return {
      texto: txPol(p), expresion: texto(e), grado: t.length ? gradoM(t[0].m) : 0,
      variables: [...new Set(t.flatMap(x => Object.keys(x.m)))].sort(),
      terminos: t.map(({ m, c }) => ({ monomio: txMonomio(m), coef: limpio(fNum(c)) })),
    };
  }
  const pIgual = (p, q) => pSum(p, q, -1).size === 0;
  // Busca valores chicos donde los dos lados no coinciden
  function contraejemplo(izq, der) {
    const vars = [...new Set([...variablesDe(analizar(izq)), ...variablesDe(analizar(der))])].sort();
    const prueba = [1, 2, 3, 4, 5, 6, 7, 9, 10, 0.5];
    const n = vars.length;
    const total = Math.pow(prueba.length, n);
    for (let k = 0; k < Math.min(total, 20000); k++) {
      const val = {}; let r = k;
      vars.forEach(v => { val[v] = prueba[r % prueba.length]; r = Math.floor(r / prueba.length); });
      try { const c = comprobar(izq, der, val); if (!c.iguales) return { valores: val, izq: c.izq.valor, der: c.der.valor, sustituida: `${c.izq.sustituida} = ${aproximado(c.izq)}, pero ${c.der.sustituida} = ${aproximado(c.der)}` }; } catch (e) { /* fuera del dominio: otro valor */ }
    }
    return null;
  }
  const aproximado = e => e.exacto || `unos ${String(Math.round(e.valor * 100) / 100).replace('.', ',')}`;
  function identidad(izq, der) {
    let poli = true, iguales;
    try { iguales = pIgual(polinomio(izq), polinomio(der)); } catch (e) { poli = false; }
    if (poli) {
      const dif = txPol(pSum(polinomio(izq), polinomio(der), -1));
      return { identidad: iguales, metodo: 'polinomio', diferencia: dif, contraejemplo: iguales ? null : contraejemplo(izq, der) };
    }
    const c = contraejemplo(izq, der);
    return { identidad: !c, metodo: 'numerico', contraejemplo: c };
  }

  // ---------- Armado de resultados con errores ----------
  // Cada error es { expresion, valor } (o { texto } si es simbólico). Los que dan lo mismo que la correcta
  // pasan a 'coinciden'.
  function conErrores(r, errores, igualA) {
    r.errores = {}; r.coinciden = [];
    for (const [k, e] of Object.entries(errores)) {
      if (igualA(e)) r.coinciden.push(k); else r.errores[k] = e;
    }
    return r;
  }
  const casiIgual = (a, b) => a !== null && b !== null && Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
  function errNum(expr, val, regla) {
    const e = evaluar(expr, val);
    return { expresion: e.expresion, sustituida: e.sustituida, valor: e.valor, exacto: e.exacto, regla };
  }
  // '(x + (−3))(x + (2))' se escribe '(x − 3)(x + 2)'
  const limpiarSignos = t => t.replace(/\+ \(−([0-9/]+)\) · ([a-z])/g, '− $1$2').replace(/\+ \(([0-9/]+)\) · ([a-z])/g, '+ $1$2')
    .replace(/\+ \(−([0-9/]+)\)/g, '− $1').replace(/\+ \(([0-9/]+)\)/g, '+ $1').replace(/\(−1\)([a-z])/g, '−$1');
  function errPol(expr, regla) { const d = desarrollar(expr); return { expresion: limpiarSignos(texto(expr)), texto: d.texto, regla }; }

  // ---------- (a ± b)² con números ----------
  function binomioCuadrado(o) {
    o = o || {};
    const a = numero(o.a, 'a'), b = numero(o.b, 'b'), s = o.signo === '-' || o.signo === MENOS ? MENOS : '+';
    const val = { a, b };
    const expr = `(a ${s} b)²`, des = s === '+' ? 'a² + 2ab + b²' : 'a² − 2ab + b²';
    const e = evaluar(expr, val);
    const t = { a2: evaluar('a²', val).valor, ab: evaluar('a · b', val).valor, dobleAB: evaluar('2ab', val).valor, b2: evaluar('b²', val).valor };
    const r = { expresion: expr, desarrollo: des, valor: e.valor, exacto: e.exacto, sustituida: e.sustituida, terminos: t,
      lado: limpio(s === '+' ? a + b : a - b), cuenta: `${fmtN(t.a2)} ${s} ${fmtN(t.ab)} ${s} ${fmtN(t.ab)} + ${fmtN(t.b2)}` };
    const errores = s === '+' ? {
      sinDoble: errNum('a² + b²', val, 'AL8: eleva cada término y olvida los dos rectángulos ab'),
      unSoloAB: errNum('a² + ab + b²', val, 'cuenta un solo rectángulo ab'),
      sinB2: errNum('a² + 2ab', val, 'olvida el cuadradito b²'),
      porDos: errNum('2(a + b)', val, 'multiplica por 2 en vez de elevar al cuadrado'),
    } : {
      sinDoble: errNum('a² − b²', val, 'AL8: (a − b)² = a² − b²'),
      sumaCuadrados: errNum('a² + b²', val, 'quita el doble producto y deja los cuadrados'),
      unSoloAB: errNum('a² − ab + b²', val, 'resta un solo rectángulo ab'),
      signoB2: errNum('a² − 2ab − b²', val, 'resta también el cuadradito b²'),
      negativo: errNum('−(a − b)²', val, 'cree que el cuadrado de una resta negativa es negativo'),
    };
    return conErrores(r, errores, x => casiIgual(x.valor, r.valor));
  }
  const fmtN = x => (x < 0 ? MENOS + String(-x) : String(x)).replace('.', ',');

  // ---------- (x ± b)² con letra ----------
  function binomioCuadradoX(o) {
    o = o || {};
    const b = numero(o.b, 'b'), s = o.signo === '-' || o.signo === MENOS ? MENOS : '+', x = o.letra || 'x';
    if (!/^[a-z]$/.test(x)) throw new Error('la letra debe ser una sola');
    const bt = txF(aF(b)), bb = txF(fMul(aF(b), aF(b))), ab2 = txF(fMul(F(2), aF(b))), bx = bt;
    const expr = `(${x} ${s} ${bt})²`, d = desarrollar(expr);
    const r = { expresion: texto(expr), texto: d.texto, terminos: d.terminos,
      piezas: { x2: `${x}²`, rectangulo: `${bt}${x}`, dobleProducto: `${ab2}${x}`, b2: bb } };
    const errores = s === '+' ? {
      sinDoble: errPol(`${x}² + ${bb}`, 'AL8: (x + b)² = x² + b²'),
      unSoloAB: errPol(`${x}² + ${bx}${x} + ${bb}`, 'cuenta un solo rectángulo'),
      sinB2: errPol(`${x}² + ${ab2}${x}`, 'olvida el cuadradito b²'),
    } : {
      sinDoble: errPol(`${x}² − ${bb}`, 'AL8: (x − b)² = x² − b²'),
      sumaCuadrados: errPol(`${x}² + ${bb}`, 'quita el doble producto y cambia el signo'),
      unSoloAB: errPol(`${x}² − ${bx}${x} + ${bb}`, 'resta un solo rectángulo'),
      signoB2: errPol(`${x}² − ${ab2}${x} − ${bb}`, 'resta también el cuadradito b²'),
    };
    return conErrores(r, errores, e => e.texto === r.texto);
  }

  // ---------- Geometría: el cuadrado de lado a + b ----------
  // Coordenadas con y hacia arriba; a² abajo a la izquierda y b² arriba a la derecha.
  function piezasCuadrado(o) {
    o = o || {};
    const a = numero(o.a, 'a', { noNeg: true }), b = numero(o.b, 'b', { noNeg: true });
    const hueco = o.hueco === undefined ? 0 : numero(o.hueco, 'hueco', { noNeg: true });
    const f = o.f === undefined ? 0 : Math.max(0, Math.min(1, numero(o.f, 'f')));
    const d = hueco * f / 2;
    const P = [
      { id: 'a2', tipo: 'a2', termino: 'a²', x: 0, y: 0, w: a, h: a, col: 0, fila: 0 },
      { id: 'ab1', tipo: 'ab', termino: 'ab', x: a, y: 0, w: b, h: a, col: 1, fila: 0 },
      { id: 'ab2', tipo: 'ab', termino: 'ab', x: 0, y: a, w: a, h: b, col: 0, fila: 1 },
      { id: 'b2', tipo: 'b2', termino: 'b²', x: a, y: a, w: b, h: b, col: 1, fila: 1 },
    ].map(p => ({ ...p, area: limpio(p.w * p.h), x: limpio(p.x + (p.col ? d : -d)), y: limpio(p.y + (p.fila ? d : -d)) }));
    const piezas = P.filter(p => p.area > 0);
    return { lado: limpio(a + b), area: limpio((a + b) * (a + b)), piezas, sumaPiezas: limpio(piezas.reduce((s, p) => s + p.area, 0)),
      sumaCuadrados: limpio(a * a + b * b), rectangulos: limpio(2 * a * b) };
  }

  // (a − b)²: el cuadrado del mayor menos dos tiras de ancho «el menor», más la esquina que se quitó dos veces.
  function restaCuadrado(o) {
    o = o || {};
    const a = numero(o.a, 'a', { noNeg: true }), b = numero(o.b, 'b', { noNeg: true });
    const M = Math.max(a, b), m = Math.min(a, b), grande = a >= b ? 'a' : 'b', chico = a >= b ? 'b' : 'a';
    const r = binomioCuadrado({ a, b, signo: '-' });
    return { ...r, mayor: grande, menor: chico, M, m, ladoResto: limpio(M - m),
      cuadrado: { x: 0, y: 0, w: M, h: M, area: limpio(M * M) },
      tiras: [{ id: 'tira1', x: 0, y: limpio(M - m), w: M, h: m, area: limpio(M * m) }, { id: 'tira2', x: limpio(M - m), y: 0, w: m, h: M, area: limpio(M * m) }],
      esquina: { x: limpio(M - m), y: limpio(M - m), w: m, h: m, area: limpio(m * m) },
      resto: { x: 0, y: 0, w: limpio(M - m), h: limpio(M - m), area: limpio((M - m) * (M - m)) },
      cuenta: `${fmtN(limpio(M * M))} − ${fmtN(limpio(M * m))} − ${fmtN(limpio(M * m))} + ${fmtN(limpio(m * m))} = ${fmtN(limpio((M - m) * (M - m)))}` };
  }

  // a² − b² = (a + b)(a − b), con a > b ≥ 0: se corta la esquina b × b y la tira de arriba se gira al costado.
  function diferenciaCuadrados(o) {
    o = o || {};
    const a = numero(o.a, 'a', { positivo: true }), b = numero(o.b, 'b', { noNeg: true });
    if (!(a > b)) throw new Error('para recortar, a tiene que ser mayor que b');
    const val = { a, b };
    const r = {
      valor: evaluar('a² − b²', val).valor, producto: evaluar('(a + b)(a − b)', val).valor,
      cuadrado: { x: 0, y: 0, w: a, h: a, area: limpio(a * a) },
      hueco: { x: limpio(a - b), y: limpio(a - b), w: b, h: b, area: limpio(b * b) },
      fija: { id: 'abajo', x: 0, y: 0, w: a, h: limpio(a - b), area: limpio(a * (a - b)) },
      movil: { id: 'arriba', x: 0, y: limpio(a - b), w: limpio(a - b), h: b, area: limpio((a - b) * b) },
      final: { id: 'arriba', x: a, y: 0, w: b, h: limpio(a - b), giro: 90 },
      rectangulo: { x: 0, y: 0, w: limpio(a + b), h: limpio(a - b), area: limpio((a + b) * (a - b)) },
    };
    const errores = {
      cuadradoDeResta: errNum('(a − b)²', val, 'AL8 al revés: a² − b² = (a − b)²'),
      sumaPorSuma: errNum('(a + b)²', val, 'usa (a + b) dos veces'),
    };
    return conErrores(r, errores, e => casiIgual(e.valor, r.valor));
  }
  // La pieza móvil: primero se corre a la derecha, después gira 90° y al final baja a su lugar.
  function reacomodo(o) {
    o = o || {};
    const D = diferenciaCuadrados(o), f = Math.max(0, Math.min(1, numero(o.f === undefined ? 0 : o.f, 'f')));
    const a = D.cuadrado.w, b = D.hueco.w, w = D.movil.w, h = D.movil.h;
    const c0 = { x: w / 2, y: D.movil.y + h / 2 }, c2 = { x: a + b / 2, y: (a - b) / 2 };
    const medio = { x: a + 0.75 * Math.max(w, h) + 0.3, y: c0.y };
    const suave = t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    let cx, cy, giro;
    if (f < 0.45) { const t = suave(f / 0.45); cx = c0.x + (medio.x - c0.x) * t; cy = c0.y; giro = 0; }
    else if (f < 0.7) { const t = suave((f - 0.45) / 0.25); cx = medio.x; cy = c0.y; giro = 90 * t; }
    else { const t = suave((f - 0.7) / 0.3); cx = medio.x + (c2.x - medio.x) * t; cy = c0.y + (c2.y - c0.y) * t; giro = 90; }
    return { cx: limpio(cx), cy: limpio(cy), w, h, giro: limpio(giro), alcance: limpio(medio.x + Math.max(w, h) * 0.75) };
  }

  // ---------- (a + b)³: ocho piezas ----------
  const TIPO_CUBO = ['a3', 'a2b', 'ab2', 'b3'];
  function piezasCubo(o) {
    o = o || {};
    const a = numero(o.a, 'a', { noNeg: true }), b = numero(o.b, 'b', { noNeg: true });
    const hueco = o.hueco === undefined ? 0 : numero(o.hueco, 'hueco', { noNeg: true });
    const huecoZ = o.huecoZ === undefined ? hueco : numero(o.huecoZ, 'huecoZ', { noNeg: true });
    const f = o.f === undefined ? 0 : Math.max(0, Math.min(1, numero(o.f, 'f')));
    const d = hueco * f / 2, dz = huecoZ * f / 2, piezas = [];
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) for (let k = 0; k < 2; k++) {
      const nb = i + j + k, tipo = TIPO_CUBO[nb];
      const w = i ? b : a, p = j ? b : a, h = k ? b : a;
      const vol = limpio(w * p * h);
      if (vol <= 0) continue;
      piezas.push({ tipo, i, j, k, x: limpio((i ? a : 0) + (i ? d : -d)), y: limpio((j ? a : 0) + (j ? d : -d)), z: limpio((k ? a : 0) + (k ? dz : -dz)), w, p, h, volumen: vol });
    }
    // orden para pintar de atrás hacia adelante en la vista isométrica (se ven las caras x, y y z mayores):
    // primero la capa de abajo, y en cada capa de atrás hacia adelante
    piezas.sort((u, v) => u.k - v.k || (u.i + u.j) - (v.i + v.j) || u.i - v.i);
    return { arista: limpio(a + b), volumen: limpio(Math.pow(a + b, 3)), piezas, sumaPiezas: limpio(piezas.reduce((s, q) => s + q.volumen, 0)) };
  }
  function cuboBinomio(o) {
    o = o || {};
    const a = numero(o.a, 'a'), b = numero(o.b, 'b'), val = { a, b };
    const e = evaluar('(a + b)³', val);
    const t = { a3: evaluar('a³', val).valor, a2b: evaluar('a²b', val).valor, ab2: evaluar('ab²', val).valor, b3: evaluar('b³', val).valor };
    const r = { expresion: '(a + b)³', desarrollo: 'a³ + 3a²b + 3ab² + b³', valor: e.valor, exacto: e.exacto, sustituida: e.sustituida, terminos: t,
      cuantas: { a3: 1, a2b: 3, ab2: 3, b3: 1 },
      cuenta: `${fmtN(t.a3)} + 3 · ${fmtN(t.a2b)} + 3 · ${fmtN(t.ab2)} + ${fmtN(t.b3)}`,
      identidad: identidad('(a + b)³', 'a³ + 3a²b + 3ab² + b³').identidad };
    const errores = {
      reparte: Object.assign(errNum('a³ + b³', val, 'AL11: el exponente se reparte'), { desarrollo: 'a³ + b³' }),
      unaDeCada: Object.assign(errNum('a³ + a²b + ab² + b³', val, 'cuenta una pieza de cada forma'), { desarrollo: 'a³ + a²b + ab² + b³' }),
      copiaCuadrado: Object.assign(errNum('a³ + 2ab + b³', val, 'copia el doble producto del cuadrado'), { desarrollo: 'a³ + 2ab + b³' }),
      porTres: Object.assign(errNum('3(a + b)', val, 'multiplica por 3 en vez de elevar al cubo'), { desarrollo: '3a + 3b' }),
    };
    return conErrores(r, errores, x => casiIgual(x.valor, r.valor));
  }

  // ---------- Otros productos notables ----------
  function productoX(o) {
    o = o || {};
    const m = numero(o.m, 'm'), n = numero(o.n, 'n'), x = o.letra || 'x';
    const tm = txF(aF(m)), tn = txF(aF(n));
    const f1 = m < 0 ? `(${x} − ${txF(aF(-m))})` : `(${x} + ${tm})`, f2 = n < 0 ? `(${x} − ${txF(aF(-n))})` : `(${x} + ${tn})`;
    const d = desarrollar(`${f1}${f2}`);
    const suma = txF(fSum(aF(m), aF(n))), prod = txF(fMul(aF(m), aF(n)));
    const r = { expresion: `${f1}${f2}`, texto: d.texto, suma, producto: prod, terminos: d.terminos };
    const errores = {
      soloExtremos: errPol(`${x}² + (${prod})`, 'AL8: multiplica solo los primeros y los últimos'),
      cruzada: errPol(`${x}² + (${prod})${x} + (${suma})`, 'cambia de lugar la suma y el producto'),
    };
    return conErrores(r, errores, e => e.texto === r.texto);
  }
  function trinomioCuadrado(o) {
    o = o || {};
    const val = { a: numero(o.a, 'a'), b: numero(o.b, 'b'), c: numero(o.c, 'c') };
    const e = evaluar('(a + b + c)²', val);
    const r = { expresion: '(a + b + c)²', desarrollo: desarrollar('(a + b + c)²').texto, valor: e.valor, sustituida: e.sustituida };
    const errores = {
      sinDobles: errNum('a² + b² + c²', val, 'AL8 con tres términos'),
      unSoloDoble: errNum('a² + b² + c² + ab + ac + bc', val, 'cuenta un solo rectángulo de cada par'),
    };
    return conErrores(r, errores, x => casiIgual(x.valor, r.valor));
  }
  function legendre(o) {
    o = o || {};
    const val = { a: numero(o.a, 'a'), b: numero(o.b, 'b') };
    const suma = evaluar('(a + b)² + (a − b)²', val), resta = evaluar('(a + b)² − (a − b)²', val);
    const r = {
      suma: { expresion: '(a + b)² + (a − b)²', igual: '2(a² + b²)', valor: suma.valor, comprobacion: evaluar('2(a² + b²)', val).valor },
      resta: { expresion: '(a + b)² − (a − b)²', igual: '4ab', valor: resta.valor, comprobacion: evaluar('4ab', val).valor },
      identidades: [identidad('(a + b)² + (a − b)²', '2(a² + b²)').identidad, identidad('(a + b)² − (a − b)²', '4ab').identidad],
    };
    r.valor = r.resta.valor;
    const errores = { dosAB: errNum('2ab', val, 'copia el doble producto de un solo cuadrado'), cero: errNum('0', val, 'cree que los cuadrados se cancelan') };
    return conErrores(r, errores, x => casiIgual(x.valor, r.valor));
  }
  // a + b = s y ab = p: a² + b² = s² − 2p, (a − b)² = s² − 4p, a³ + b³ = s³ − 3ps
  function sumaProducto(o) {
    o = o || {};
    const s = aF(numero(o.suma, 'la suma')), p = aF(numero(o.producto, 'el producto'));
    const s2 = fMul(s, s), r2 = fRes(s2, fMul(F(2), p));
    const dif2 = fRes(s2, fMul(F(4), p));
    const r = {
      valor: limpio(fNum(r2)), exacto: txF(r2), cuenta: `${txF(s)}² − 2 · ${txF(p)} = ${txF(s2)} − ${txF(fMul(F(2), p))} = ${txF(r2)}`,
      cuadradoDeLaSuma: limpio(fNum(s2)), rectangulos: limpio(fNum(fMul(F(2), p))),
      cuadradoDeLaResta: limpio(fNum(dif2)), sumaDeCubos: limpio(fNum(fRes(fMul(s2, s), fMul(F(3), fMul(p, s))))),
      reales: fNum(dif2) >= 0,
    };
    if (r.reales) {
      const d = vRaiz(V(dif2));
      const n1 = d.f ? fDiv(fRes(s, d.f), F(2)) : null, n2 = d.f ? fDiv(fSum(s, d.f), F(2)) : null;
      r.numeros = n1 ? [limpio(fNum(n1)), limpio(fNum(n2))] : [limpio((fNum(s) - d.x) / 2), limpio((fNum(s) + d.x) / 2)];
    }
    const errores = {
      sinDoble: { expresion: '(a + b)²', valor: limpio(fNum(s2)), regla: 'AL8: a² + b² = (a + b)²' },
      unSoloAB: { expresion: '(a + b)² − ab', valor: limpio(fNum(fRes(s2, p))), regla: 'resta un solo rectángulo ab' },
      sumaDoble: { expresion: '(a + b)² + 2ab', valor: limpio(fNum(fSum(s2, fMul(F(2), p)))), regla: 'suma 2ab en vez de restarlo' },
    };
    return conErrores(r, errores, x => casiIgual(x.valor, r.valor));
  }

  // ---------- Factorización (en una letra, con coeficientes enteros) ----------
  function coefsEnteros(e) {
    const p = polinomio(e);
    const vars = [...new Set([...p.keys()].flatMap(k => Object.keys(deClave(k))))];
    if (vars.length > 1) throw new Error('el motor factoriza polinomios de una sola letra');
    const x = vars[0] || 'x';
    let grado = 0;
    for (const k of p.keys()) grado = Math.max(grado, deClave(k)[x] || 0);
    const c = [];
    for (let g = 0; g <= grado; g++) {
      const v = p.get(g === 0 ? '' : `${x}:${g}`) || F(0);
      if (v.d !== 1) throw new Error('los coeficientes deben ser enteros');
      c.push(v.n);
    }
    return { x, c, p };   // c[g] es el coeficiente de x^g
  }
  const conSigno = (k, t) => (k < 0 ? ` − ${-k}${t}` : ` + ${k}${t}`);
  function lineal(p, q, x) {   // (px + q) como texto
    const pt = p === 1 ? '' : p === -1 ? MENOS : String(p).replace('-', MENOS);
    return q === 0 ? `${pt}${x}` : `${pt}${x}${conSigno(q, '')}`;
  }
  function factorizar(e) {
    const { x, c, p: original } = coefsEnteros(e);
    const grado = c.length - 1;
    const metodos = [], factores = [];
    // factor común: el mcd de los coeficientes y la menor potencia de x
    let g = 0; for (const k of c) g = mcd(g, k);
    if (g === 0) throw new Error('el polinomio es cero');
    let k0 = 0; while (c[k0] === 0) k0++;
    if (c[grado] < 0) g = -g;
    const resto = c.slice(k0).map(v => v / g);
    let comun = '';
    if (Math.abs(g) !== 1 || k0 > 0 || g < 0) {
      metodos.push('factor común');
      const gt = g === 1 ? '' : g === -1 ? MENOS : String(g).replace('-', MENOS);
      comun = gt + (k0 ? x + (k0 > 1 ? sup(k0) : '') : '');
      if (!comun) comun = String(g);
    }
    const d = resto.length - 1;
    let cuerpo = null, aspa = null;
    if (d === 2) {
      const [C, B, A] = resto;
      const rA = raizEntera(A, 2), rC = C < 0 ? raizEntera(-C, 2) : raizEntera(C, 2);
      if (B === 0 && C < 0 && rA !== null && rC !== null) {
        metodos.push('diferencia de cuadrados');
        cuerpo = { tipo: 'diferencia', factores: [`(${lineal(rA, rC, x)})`, `(${lineal(rA, -rC, x)})`], r: rC, s: rA };
      } else if (C > 0 && rA !== null && rC !== null && B * B === 4 * A * C) {
        metodos.push('trinomio cuadrado perfecto');
        const sg = B < 0 ? -1 : 1;
        cuerpo = { tipo: 'tcp', factores: [`(${lineal(rA, sg * rC, x)})²`], r: sg * rC, s: rA };
      } else {
        // aspa simple: (p x + q)(r x + s) con p r = A, q s = C, p s + q r = B
        busca: for (let pp = 1; pp <= Math.abs(A); pp++) {
          if (A % pp) continue;
          const rr = A / pp;
          for (let qq = -Math.abs(C); qq <= Math.abs(C); qq++) {
            if (qq === 0 && C !== 0) continue;
            if (C === 0 ? qq !== 0 : C % qq) continue;
            const ss = C === 0 ? 0 : C / qq;
            if (pp * ss + qq * rr === B) { aspa = { arriba: [pp, qq], abajo: [rr, ss], cruces: [pp * ss, qq * rr], suma: B }; break busca; }
          }
        }
        if (aspa) {
          metodos.push('aspa simple');
          const f1 = `(${lineal(aspa.arriba[0], aspa.arriba[1], x)})`, f2 = `(${lineal(aspa.abajo[0], aspa.abajo[1], x)})`;
          cuerpo = { tipo: 'aspa', factores: f1 === f2 ? [`${f1}²`] : [f1, f2], aspa };
        }
      }
    }
    const restoTexto = txPol(polinomio(resto.map((v, i) => `(${v})${x}^${i}`).join(' + ')));
    if (cuerpo) factores.push(...cuerpo.factores);
    else if (d >= 1 && (comun || d === 1)) factores.push(`(${restoTexto})`);
    const textoF = (comun ? (comun === MENOS ? MENOS : comun) : '') + (factores.length ? factores.join('') : (comun ? '' : restoTexto));
    const sePuede = metodos.length > 0;
    const final = sePuede ? textoF : txPol(original);
    // comprobación: el producto desarrollado es el polinomio de partida, y con x = 2 dan lo mismo
    const iden = identidad(final, txPol(original));
    // con un valor de x que no sea raíz, para que la comprobación no sea «0 = 0»
    const val = { [x]: [2, 3, 5, 7, 11].find(v => evaluar(txPol(original), { [x]: v }).valor !== 0) || 2 };
    const r = { polinomio: txPol(original), metodos, texto: final, factores: factores.length ? factores : [restoTexto], comun: comun || null,
      sePuede, identidad: iden.identidad, comprobacion: comprobar(final, txPol(original), val), aspa: aspa || undefined };
    if (!sePuede) r.nota = 'no se factoriza con coeficientes enteros';
    // errores típicos según el método
    const errores = {};
    if (cuerpo && cuerpo.tipo === 'diferencia' && cuerpo.s === 1 && !comun) {
      const rr = cuerpo.r, rr2 = rr * rr;
      errores.cuadradoDeResta = errPol(`(${x} − ${rr})²`, 'AL8 al revés: x² − b² = (x − b)²');
      errores.sinRaiz = errPol(`(${x} + ${rr2})(${x} − ${rr2})`, 'no saca la raíz del número');
      errores.factorComunFalso = errPol(`${x}(${x} − ${rr2})`, 'saca x de factor común aunque el número no tiene x');
      errores.sumaAlCuadrado = errPol(`(${x} + ${rr})²`, 'usa (x + b) dos veces');
    }
    if (cuerpo && cuerpo.tipo === 'tcp' && cuerpo.s === 1 && !comun) {
      const rr = Math.abs(cuerpo.r), sg = cuerpo.r < 0 ? MENOS : '+', ot = cuerpo.r < 0 ? '+' : MENOS;
      errores.diferencia = errPol(`(${x} + ${rr})(${x} − ${rr})`, 'lo confunde con la diferencia de cuadrados');
      errores.signo = errPol(`(${x} ${ot} ${rr})²`, 'el signo del binomio no es el del término del medio');
      errores.sinRaiz = errPol(`(${x} ${sg} ${rr * rr})²`, 'no saca la raíz del último término');
    }
    if (cuerpo && cuerpo.tipo === 'aspa' && !comun && resto[2] === 1) {
      const [q1, q2] = [aspa.arriba[1], aspa.abajo[1]];
      errores.signos = errPol(`(${x} + (${-q1}))(${x} + (${-q2}))`, 'cambia los signos de los dos números');
      // números que suman el término independiente y multiplican el del medio (la búsqueda al revés)
      const B = resto[1], C = resto[0];
      for (let u = -Math.abs(B) - Math.abs(C); u <= Math.abs(B) + Math.abs(C); u++) {
        const v = C - u; if (u * v === B && u <= v) { errores.invertida = errPol(`(${x} + (${u}))(${x} + (${v}))`, 'busca dos números que sumen el último y multipliquen el del medio'); break; }
      }
    }
    const polTx = cs => txPol(polinomio(cs.map((v, i) => `(${v})${x}^${i}`).join(' + ')));
    if (comun && Math.abs(g) > 1 && k0 > 0 && d >= 1) {
      // divide entre el factor común solo el primer término: 2x² + 6x = 2x(x + 6)
      const sg = g / Math.abs(g), mal = c.slice(k0).map((v, i, arr) => (i === arr.length - 1 ? v / g : v / sg));
      errores.divideSoloElPrimero = errPol(`${comun}(${polTx(mal)})`, 'divide entre el factor común solo el primer término');
    }
    if (comun && Math.abs(resto[0]) === 1 && d >= 1) {
      const sin1 = [0, ...resto.slice(1)];
      errores.pierdeElUno = Object.assign(errPol(`${comun}(${polTx(sin1)})`, 'al sacar el factor común se pierde el 1'), { expresion: `${comun}(${polTx(sin1)})` });
    }
    // un «error» que da el mismo polinomio no es error
    return conErrores(r, errores, er => pIgual(polinomio(er.texto), original));
  }

  // ---------- Raíces ----------
  function hipotenusa(o) {
    o = o || {};
    const a = numero(o.a, 'a', { noNeg: true }), b = numero(o.b, 'b', { noNeg: true }), val = { a, b };
    const e = evaluar('√(a² + b²)', val);
    const c = e.valor;
    const r = { expresion: '√(a² + b²)', valor: c, exacto: e.exacto, sustituida: e.sustituida, entera: e.exacto !== null && !e.exacto.includes('/'),
      cuadrados: { a: limpio(a * a), b: limpio(b * b), c: limpio(a * a + b * b) },
      camino: limpio(a + b), ahorro: limpio(a + b - c),
      // ángulo recto en el origen; a por el eje x, b por el eje y; cada cuadrado, hacia afuera del triángulo
      vertices: { C: { x: 0, y: 0 }, B: { x: a, y: 0 }, A: { x: 0, y: b } },
      cuadradoA: [{ x: 0, y: 0 }, { x: a, y: 0 }, { x: a, y: -a }, { x: 0, y: -a }],
      cuadradoB: [{ x: 0, y: 0 }, { x: 0, y: b }, { x: -b, y: b }, { x: -b, y: 0 }],
      cuadradoC: [{ x: a, y: 0 }, { x: 0, y: b }, { x: b, y: limpio(b + a) }, { x: limpio(a + b), y: a }] };
    const errores = {
      sumaDeRaices: errNum('a + b', val, 'AL9: √(a² + b²) = a + b'),
      sinRaiz: errNum('a² + b²', val, 'olvida la raíz'),
    };
    return conErrores(r, errores, x => casiIgual(x.valor, r.valor));
  }
  function raizDeSuma(o) {
    o = o || {};
    const p = numero(o.p, 'p', { noNeg: true }), q = numero(o.q, 'q', { noNeg: true }), val = { p, q };
    const e = evaluar('√(p + q)', val);
    const r = { expresion: '√(p + q)', valor: e.valor, exacto: e.exacto, sustituida: e.sustituida,
      catetos: [evaluar('√p', val).valor, evaluar('√q', val).valor] };
    const errores = {
      sumaDeRaices: errNum('√p + √q', val, 'AL9: √(p + q) = √p + √q'),
      sinRaiz: errNum('p + q', val, 'olvida la raíz'),
      productoDeRaices: errNum('√p · √q', val, 'mezcla con la regla del producto, √(pq) = √p · √q'),
    };
    return conErrores(r, errores, x => casiIgual(x.valor, r.valor));
  }
  function raizDelCuadrado(o) {
    o = o || {};
    const x = numero(o.x, 'x'), val = { x };
    const e = evaluar('√(x²)', val);
    const r = { expresion: '√(x²)', igual: '|x|', valor: e.valor, sustituida: e.sustituida, cuadrado: evaluar('x²', val).valor, lado: Math.abs(x) };
    const errores = {
      cancela: errNum('x', val, 'cree que la raíz y el cuadrado se cancelan y queda x'),
      sinRaiz: errNum('x²', val, 'olvida la raíz'),
    };
    if (x < 0) errores.noExiste = { expresion: 'no existe', valor: null, regla: 'cree que no hay raíz porque x es negativo, aunque x² es positivo' };
    // ±|x| son dos números: confunde la raíz con las soluciones de t² = x². Si x = 0, ±0 es solo el 0.
    const ax = Math.abs(x), txAx = txF(aF(ax));
    errores.dobleSigno = { expresion: '±|x|', texto: `±${txAx}`, valor: null, valores: ax === 0 ? [0] : [limpio(-ax), limpio(ax)], regla: 'confunde √(x²) con las soluciones de t² = x², que son dos' };
    return conErrores(r, errores, z => (z.valores ? z.valores.length === 1 && casiIgual(z.valores[0], r.valor) : z.valor !== null && casiIgual(z.valor, r.valor)));
  }

  // ---------- Simplificar sumandos como si fueran factores (AL12) ----------
  // (x + m)/(x + n) contra m/n: solo valen lo mismo si x = 0 o m = n.
  function fraccionSumandos(o) {
    o = o || {};
    const x = numero(o.x, 'x'), m = numero(o.m, 'm'), n = numero(o.n, 'n'), val = { x, m, n };
    if (Math.abs(x + n) < 1e-15) throw new Error('división entre cero: x + n vale 0');
    const e = evaluar('(x + m)/(x + n)', val);
    const r = { expresion: '(x + m)/(x + n)', valor: e.valor, exacto: e.exacto, sustituida: e.sustituida };
    const errores = {
      tachaX: Object.assign(errNum('m/n', val, 'AL12: tacha la x de arriba y la de abajo como si fueran factores'), { expresion: `${txF(aF(m))}/${txF(aF(n))}` }),
    };
    return conErrores(r, errores, z => casiIgual(z.valor, r.valor));
  }

  // ---------- Exponentes y logaritmos ----------
  function potenciaDeSuma(o) {
    o = o || {};
    const base = numero(o.base, 'la base', { positivo: true }), m = numero(o.m, 'm', { entero: true, noNeg: true }), n = numero(o.n, 'n', { entero: true, noNeg: true });
    const c = txF(aF(base)), B = aF(base).d === 1 ? c : `(${c})`, val = { m, n };
    const e = evaluar(`${B}^(m + n)`, val);
    const r = { expresion: `${B}^(m + n)`, igual: `${B}^m · ${B}^n`, valor: e.valor, sustituida: e.sustituida,
      grupos: evaluar(`${B}^m`, val).valor, porGrupo: evaluar(`${B}^n`, val).valor };
    r.cuenta = `${fmtN(r.grupos)} · ${fmtN(r.porGrupo)}`;
    const errores = {
      reparte: errNum(`${B}^m + ${B}^n`, val, 'AL11: el exponente se reparte sobre la suma'),
      multiplicaExp: errNum(`${B}^(m · n)`, val, 'multiplica los exponentes'),
      porSuma: errNum(`${B}(m + n)`, val, 'multiplica la base por el exponente'),
    };
    return conErrores(r, errores, x => casiIgual(x.valor, r.valor));
  }
  function baseLog(base) { const b = base === undefined ? 10 : numero(base, 'la base', { positivo: true }); if (b === 1) throw new Error('la base del logaritmo no puede ser 1'); return b; }
  function logProducto(o) {
    o = o || {};
    const a = numero(o.a, 'a', { positivo: true }), b = numero(o.b, 'b', { positivo: true }), base = baseLog(o.base);
    const L = base === 10 ? 'log' : `log_${base}`, val = { a, b };
    const la = evaluar(`${L}(a)`, val), lb = evaluar(`${L}(b)`, val), lab = evaluar(`${L}(a · b)`, val);
    const r = { expresion: `${L}(ab)`, igual: `${L} a + ${L} b`, valor: lab.valor, exacto: lab.exacto, logA: la.valor, logB: lb.valor,
      producto: limpio(a * b), suma: limpio(la.valor + lb.valor),
      regla: { desde: 0, hasta: Math.ceil(lab.valor - 1e-9), base } };
    const errores = {
      logDeSuma: Object.assign(errNum(`${L}(a + b)`, val, 'AL10: log a + log b = log(a + b)'), { numero: limpio(a + b) }),
      productoDeLogs: errNum(`${L}(a) · ${L}(b)`, val, 'AL10: log(ab) = log a · log b'),
      numero: errNum('a · b', val, 'da el número ab en vez de su logaritmo'),
    };
    return conErrores(r, errores, x => casiIgual(x.valor, r.valor));
  }
  function logDeSuma(o) {
    o = o || {};
    const a = numero(o.a, 'a', { positivo: true }), b = numero(o.b, 'b', { positivo: true }), base = baseLog(o.base);
    const L = base === 10 ? 'log' : `log_${base}`, val = { a, b };
    const e = evaluar(`${L}(a + b)`, val);
    const r = { expresion: `${L}(a + b)`, valor: e.valor, exacto: e.exacto, sustituida: e.sustituida };
    const errores = {
      sumaDeLogs: errNum(`${L}(a) + ${L}(b)`, val, 'AL10: log(a + b) = log a + log b'),
      productoDeLogs: errNum(`${L}(a) · ${L}(b)`, val, 'AL10: mezcla con log a · log b'),
      sinLog: errNum('a + b', val, 'da el número en vez de su logaritmo'),
    };
    return conErrores(r, errores, x => casiIgual(x.valor, r.valor));
  }
  // Marcas de una regla logarítmica: dónde va cada número (su logaritmo) entre base^desde y base^hasta
  function marcasLog(o) {
    o = o || {};
    const base = baseLog(o.base), desde = numero(o.desde === undefined ? 0 : o.desde, 'desde', { entero: true }), hasta = numero(o.hasta, 'hasta', { entero: true });
    if (base !== 10) throw new Error('la regla tiene marcas solo en base 10');
    const m = [];
    for (let k = desde; k < hasta; k++) for (let j = 1; j <= 9; j++) { const v = j * Math.pow(10, k); m.push({ valor: limpio(v), pos: limpio(Math.log10(v)), mayor: j === 1 }); }
    m.push({ valor: Math.pow(10, hasta), pos: hasta, mayor: true });
    return m;
  }

  return {
    analizar, texto, evaluar, comprobar, desarrollar, identidad,
    binomioCuadrado, binomioCuadradoX, piezasCuadrado, restaCuadrado, diferenciaCuadrados, reacomodo,
    cuboBinomio, piezasCubo, productoX, trinomioCuadrado, legendre, sumaProducto,
    factorizar, hipotenusa, raizDeSuma, raizDelCuadrado, fraccionSumandos, potenciaDeSuma, logProducto, logDeSuma, marcasLog,
    _F: F, _txF: txF,
  };
});
