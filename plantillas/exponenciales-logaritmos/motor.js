/*
 * Motor de «La escalera de la base»: función exponencial y logarítmica, propiedades, ecuaciones e inecuaciones,
 * crecimiento y decaimiento.
 *
 * Aquí vive toda la matemática de la plantilla (regla 1 de CLAUDE.md). No toca el DOM:
 * funciona igual en el navegador (window.MotorExpLog) y en Node (require('./motor.js')),
 * donde lo prueban casos.json y papel.json. Las cuentas son exactas con fracciones mientras se pueda:
 * log₂ 32 = 5, log₈ 64 = 2, log₆₄ 8 = 1/2; un logaritmo que no es racional (log₂ 5) queda aproximado.
 *
 *   potencia({ base, exp })                 baseᵉˣᵖ, exacta si se puede
 *   log({ base, N })                        log_base N: el número de saltos de ×base que llevan de 1 a N
 *   regla({ base, desde, hasta })           la escalera de la base: marcas k con su potencia baseᵏ (regla logarítmica)
 *   grafica({ base, desde, hasta, n })      puntos de y = baseˣ y de y = log_base x, monotonía, dominio y rango
 *   inversa({ base, x })                    el punto (x; baseˣ) y su reflejo en y = x, con sus errores (AL29)
 *   logProducto({ base, a, b })             log(ab) = log a + log b (AL10)
 *   logSuma({ base, a, b })                 log(a + b), que NO es log a + log b (AL10)
 *   cocienteLogs({ base, a, b })            log a / log b = log_b a, el cambio de base (AL31)
 *   logPotencia({ base, logA, n })          log(aⁿ) = n · log a (AL31)
 *   potenciaDesplazada({ base, valor, k })  si baseˣ = valor, baseˣ⁺ᵏ = valor · baseᵏ (AL11)
 *   sumaLogs({ base, args })                log_b 1 = 0 y log_b b = 1
 *   ecuacionBases({ b1, e1, b2, e2 })       b1^(m1·x + c1) = b2^(m2·x + c2), llevando las dos a la misma base (AL32)
 *   cambioVariable({ base, b, c })          (base²)ˣ + b · baseˣ + c = 0 con u = baseˣ
 *   ecuacionLog({ base, p, q, valor })      log(x + p) + log(x + q) = valor, con la verificación del dominio
 *   inecuacionExp({ base, cota, sentido })  baseˣ > cota o baseˣ < cota: se invierte si la base está entre 0 y 1
 *   inecuacionLog({ base, p, cota, sentido })  log_base(x + p) > cota (u otro sentido), con el dominio x + p > 0
 *   igualdadLog({ base, p, q })             log(x + p) = log(x + q): sin solución si p ≠ q
 *   crecimiento({ N0, factor, t, ref })     N = N0 · factorᵗ, contra t² y otros errores (AL33)
 *   decaimiento({ N0, vidaMedia, t })       N = N0 · (1/2)^(t / vidaMedia)
 *   compararCrecimiento({ base, grado, hasta })  desde qué n entero baseⁿ le gana para siempre a nᵍʳᵃᵈᵒ (AL33)
 *   curvaPotencia({ grado, desde, hasta, n })    puntos de y = xᵍʳᵃᵈᵒ, para dibujarla junto a la exponencial
 *
 * Cada resultado que es la respuesta de una predicción trae 'errores': lo que da cada error típico de
 * docs/investigacion/algebra-funciones-ideas-erroneas.md (AL10, AL11, AL29, AL31, AL32, AL33) y de los que son
 * hipótesis nuestras (EL1 a EL23, anotados en la escena). Un error que con esos números da lo mismo que la
 * respuesta correcta NO va en 'errores': va en 'coinciden'. Así ninguna opción incorrecta puede ser también correcta.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorExpLog = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const TOL = 1e-9;
  const MENOS = '−';
  const casi = (a, b) => a !== null && b !== null && Math.abs(a - b) <= TOL * Math.max(1, Math.abs(a), Math.abs(b));
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
  const fIgual = (a, b) => a.n === b.n && a.d === b.d;
  const fNum = a => a.n / a.d;
  function fPot(a, e) {
    if (e < 0) return fPot(fDiv(F(1), a), -e);
    let r = F(1); for (let k = 0; k < e; k++) r = fMul(r, a); return r;
  }
  // Lee un número o una fracción escrita '1/2' (también '−3/4').
  function aF(x, que) {
    if (typeof x === 'object' && x && 'n' in x) return x;
    if (typeof x === 'string') {
      const m = x.replace(MENOS, '-').match(/^\s*(-?\d+)\s*(?:\/\s*(\d+))?\s*$/);
      if (!m) throw new Error(`${que || 'el valor'} debe ser un número o una fracción como 1/2`);
      return F(Number(m[1]), m[2] ? Number(m[2]) : 1);
    }
    if (typeof x !== 'number' || !Number.isFinite(x)) throw new Error(`${que || 'el valor'} debe ser un número`);
    for (let q = 1; q <= 1e6; q *= 10) { const p = Math.round(x * q); if (Math.abs(p / q - x) <= 1e-12 * Math.max(1, Math.abs(x))) return F(p, q); }
    for (let q = 2; q <= 5000; q++) { const p = Math.round(x * q); if (Math.abs(p / q - x) <= 1e-12 * Math.max(1, Math.abs(x))) return F(p, q); }
    return null;   // no tiene fracción corta: se trabaja aproximado
  }
  function num(x, que, o) {
    o = o || {};
    let v;
    if (typeof x === 'string') v = fNum(aF(x, que));
    else if (typeof x === 'number' && Number.isFinite(x)) v = x;
    else throw new Error(`${que} debe ser un número`);
    if (o.entero && !Number.isInteger(v)) throw new Error(`${que} debe ser un número entero`);
    if (o.positivo && !(v > 0)) throw new Error(`${que} debe ser mayor que cero`);
    if (o.noNeg && v < 0) throw new Error(`${que} no puede ser negativo`);
    return v;
  }
  function base(x, que) {
    const b = num(x, que || 'la base');
    if (!(b > 0)) throw new Error(`${que || 'la base'} debe ser mayor que cero`);
    if (casi(b, 1)) throw new Error(`${que || 'la base'} no puede ser 1: 1 elevado a cualquier número da 1`);
    return b;
  }
  // Texto con coma decimal y signo menos tipográfico. Las fracciones exactas se escriben p/q.
  function txNum(x, dec) {
    if (x === null || x === undefined) return '—';
    const p = Math.pow(10, dec === undefined ? 2 : dec), r = Math.round(x * p) / p + 0;
    let [e, f] = String(Math.abs(r)).split('.');
    if (e.length > 4) e = e.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return (r < 0 ? MENOS : '') + e + (f ? ',' + f : '');
  }
  const txF = a => (a.n < 0 ? MENOS : '') + (a.d === 1 ? String(Math.abs(a.n)) : `${Math.abs(a.n)}/${a.d}`);
  // Un valor { valor, exacto }: el texto exacto si lo hay; si no, con dos decimales.
  const tx = v => (v.exacto !== null && v.exacto !== undefined ? v.exacto : txNum(v.valor));
  const val = (x, f) => ({ valor: limpio(x), exacto: f ? txF(f) : null, f: f || null });

  // ---------- Potencias y logaritmos ----------
  // baseᵉˣᵖ. Exacta si la base es fracción y el exponente un entero (o una fracción con raíz exacta).
  function potenciaV(b, e) {
    const fb = aF(b), fe = aF(e);
    if (fb && fe) {
      try {
        if (fe.d === 1 && Math.abs(fe.n) <= 60) return val(fNum(fPot(fb, fe.n)), fPot(fb, fe.n));
        if (fb.n > 0) {
          const rn = raizEntera(fb.n, fe.d), rd = raizEntera(fb.d, fe.d);
          if (rn !== null && rd !== null && Math.abs(fe.n) <= 60) { const r = fPot(F(rn, rd), fe.n); return val(fNum(r), r); }
        }
      } catch (err) { /* demasiado grande: aproximado */ }
    }
    return val(Math.pow(num(b, 'la base'), num(e, 'el exponente')), null);
  }
  function raizEntera(n, k) {
    if (n < 0) return null;
    const r = Math.round(Math.pow(n, 1 / k));
    for (const c of [r - 1, r, r + 1]) if (c >= 0 && Math.pow(c, k) === n) return c;
    return null;
  }
  // log_b N. Exacto si N = b^(m/n) con n ≤ 12: se comprueba con fracciones que Nⁿ = bᵐ.
  function logV(b, N) {
    const vb = base(b), vN = num(N, 'el número');
    if (!(vN > 0)) throw new Error('el logaritmo solo existe para números mayores que cero');
    const x = Math.log(vN) / Math.log(vb), fb = aF(b), fN = aF(N);
    if (fb && fN) {
      for (let d = 1; d <= 12; d++) {
        const m = Math.round(x * d);
        if (Math.abs(m / d - x) > 1e-7) continue;
        try { if (fIgual(fPot(fN, d), fPot(fb, m))) return val(m / d, F(m, d)); } catch (err) { /* sigue */ }
      }
    }
    return val(x, null);
  }
  function potencia(o) {
    o = o || {};
    const b = num(o.base, 'la base', { positivo: true }), r = potenciaV(o.base, o.exp);
    return { base: b, exp: num(o.exp, 'el exponente'), valor: r.valor, exacto: r.exacto, texto: tx(r) };
  }
  function log(o) {
    o = o || {};
    const r = logV(o.base, o.N);
    return { base: base(o.base), N: num(o.N, 'el número'), valor: r.valor, exacto: r.exacto, texto: tx(r),
      // lo que dice la escalera: cuántos saltos de ×base llevan de 1 a N
      saltos: r.valor, entero: Number.isInteger(r.valor) };
  }
  // La escalera (regla logarítmica): las marcas k = desde, …, hasta están a la misma distancia y en cada una va baseᵏ.
  function regla(o) {
    o = o || {};
    const b = base(o.base), desde = num(o.desde === undefined ? 0 : o.desde, 'desde', { entero: true }), hasta = num(o.hasta, 'hasta', { entero: true });
    if (hasta <= desde) throw new Error('hasta debe ser mayor que desde');
    const marcas = [];
    for (let k = desde; k <= hasta; k++) { const p = potenciaV(o.base, k); marcas.push({ k, valor: p.valor, texto: tx(p) }); }
    return { base: b, factor: tx(potenciaV(o.base, 1)), desde, hasta, marcas,
      // dónde va un número cualquiera: en su logaritmo
      posicion: N => logV(o.base, N).valor };
  }

  // ---------- La gráfica: y = bˣ y y = log_b x, reflejadas en y = x ----------
  function grafica(o) {
    o = o || {};
    const b = base(o.base), desde = num(o.desde === undefined ? -4 : o.desde, 'desde'), hasta = num(o.hasta === undefined ? 4 : o.hasta, 'hasta');
    const n = num(o.n === undefined ? 160 : o.n, 'n', { entero: true });
    const exp = [], lg = [];
    for (let i = 0; i <= n; i++) {
      const x = desde + (hasta - desde) * i / n, y = Math.pow(b, x);
      exp.push([x, y]);
      lg.push([y, x]);   // el reflejo: se cambian x e y
    }
    const crece = b > 1;
    return { base: b, exp, log: lg, monotonia: crece ? 'creciente' : 'decreciente',
      fijoExp: [0, 1], fijoLog: [1, 0],
      dominioExp: 'ℝ', rangoExp: '⟨0; +∞⟩', dominioLog: '⟨0; +∞⟩', rangoLog: 'ℝ',
      asintotaExp: 'y = 0', asintotaLog: 'x = 0' };
  }
  const punto = (a, b) => `(${a}; ${b})`;
  function inversa(o) {
    o = o || {};
    const b = base(o.base), x = num(o.x, 'x'), y = potenciaV(o.base, o.x), fx = aF(o.x);
    const xt = fx ? txF(fx) : txNum(x), yt = tx(y);
    const rec = y.f ? val(1 / y.valor, fDiv(F(1), y.f)) : val(1 / y.valor, null);
    const r = { base: b, punto: [x, y.valor], reflejo: [y.valor, x], valor: [y.valor, x], texto: punto(yt, xt) };
    const errores = {
      reciproco: { valor: [x, rec.valor], texto: punto(xt, tx(rec)), id: 'AL29', regla: 'f⁻¹ = 1/f: deja x y pone 1/bˣ' },
      reflejoY: { valor: [-x, y.valor], texto: punto(x === 0 ? '0' : (x < 0 ? xt.replace(MENOS, '') : MENOS + xt), yt), id: 'EL17', regla: 'refleja en el eje y' },
      reflejoX: { valor: [x, -y.valor], texto: punto(xt, MENOS + yt), id: 'EL18', regla: 'refleja en el eje x' },
    };
    return conErrores(r, errores, e => casi(e.valor[0], r.valor[0]) && casi(e.valor[1], r.valor[1]));
  }

  // ---------- Propiedades ----------
  function conErrores(r, errores, igual) {
    r.errores = {}; r.coinciden = [];
    for (const [k, e] of Object.entries(errores)) { if (e === null) continue; if (igual(e)) r.coinciden.push(k); else r.errores[k] = e; }
    return r;
  }
  const igualValor = r => e => casi(e.valor, r.valor);
  const err = (v, id, regla, extra) => Object.assign({ valor: v.valor, exacto: v.exacto, texto: tx(v), id, regla }, extra || {});
  const vSuma = (p, q) => (p.f && q.f ? val(fNum(fSum(p.f, q.f)), fSum(p.f, q.f)) : val(p.valor + q.valor, null));
  const vMul = (p, q) => (p.f && q.f ? val(fNum(fMul(p.f, q.f)), fMul(p.f, q.f)) : val(p.valor * q.valor, null));
  const vDiv = (p, q) => { if (casi(q.valor, 0)) throw new Error('división entre cero'); return p.f && q.f ? val(fNum(fDiv(p.f, q.f)), fDiv(p.f, q.f)) : val(p.valor / q.valor, null); };
  const vNum = x => { const f = aF(x); return val(num(x, 'el valor'), f); };

  function logProducto(o) {
    o = o || {};
    const a = vNum(o.a), b = vNum(o.b);
    if (!(a.valor > 0 && b.valor > 0)) throw new Error('a y b deben ser mayores que cero');
    const la = logV(o.base, o.a), lb = logV(o.base, o.b), lab = logV(o.base, vMul(a, b).f ? txF(vMul(a, b).f) : a.valor * b.valor);
    const r = { base: base(o.base), valor: lab.valor, exacto: lab.exacto, texto: tx(lab), logA: la.valor, logB: lb.valor, suma: limpio(la.valor + lb.valor),
      producto: vMul(a, b).valor };
    return conErrores(r, {
      productoDeLogs: err(vMul(la, lb), 'AL10', 'log(ab) = log a · log b'),
      precedencia: err(vMul(la, b), 'EL2', '(log a) · b: el logaritmo se toma solo del primer factor'),
      numero: err(vMul(a, b), 'EL1', 'da el número ab, no su logaritmo'),
    }, igualValor(r));
  }
  function logSuma(o) {
    o = o || {};
    const a = vNum(o.a), b = vNum(o.b);
    if (!(a.valor > 0 && b.valor > 0)) throw new Error('a y b deben ser mayores que cero');
    const s = vSuma(a, b), l = logV(o.base, s.f ? txF(s.f) : s.valor), la = logV(o.base, o.a), lb = logV(o.base, o.b);
    const r = { base: base(o.base), valor: l.valor, exacto: l.exacto, texto: tx(l), suma: s.valor, logA: la.valor, logB: lb.valor,
      // dónde cae log a + log b en la escalera: en el producto ab
      sumaDeLogsEs: vMul(a, b).valor };
    return conErrores(r, {
      sumaDeLogs: err(vSuma(la, lb), 'AL10', 'log(a + b) = log a + log b'),
      productoDeLogs: err(vMul(la, lb), 'AL10', 'log(a + b) = log a · log b'),
      numero: err(s, 'EL1', 'da el número a + b, no su logaritmo'),
    }, igualValor(r));
  }
  // log a / log b (en cualquier base) = log_b a: cuántos saltos de ×b caben en a.
  function cocienteLogs(o) {
    o = o || {};
    const la = logV(o.base, o.a), lb = logV(o.base, o.b);
    if (casi(lb.valor, 0)) throw new Error('log b vale 0: no se puede dividir');
    const q = vDiv(la, lb), cb = logV(o.b, o.a), cociente = vDiv(vNum(o.a), vNum(o.b));
    const r = { base: base(o.base), valor: q.valor, exacto: q.exacto, texto: tx(q), logA: la.valor, logB: lb.valor,
      cambioDeBase: cb.valor, grupos: q.valor, porGrupo: lb.valor };
    const lc = logV(o.base, cociente.f ? txF(cociente.f) : cociente.valor);
    return conErrores(r, {
      logDelCociente: err(lc, 'AL31', 'log a / log b = log(a/b)'),
      invertido: casi(la.valor, 0) ? null : err(vDiv(lb, la), 'AL31', 'base y argumento invertidos: log_a b'),
      cociente: err(cociente, 'EL24', 'divide los números: a/b'),
    }, igualValor(r));
  }
  // Si log a = logA, log(aⁿ) = n · logA.
  function logPotencia(o) {
    o = o || {};
    const L = vNum(o.logA), n = vNum(o.n), a = potenciaV(o.base, o.logA), an = potenciaV(a.f ? txF(a.f) : a.valor, o.n);
    const v = vMul(n, L);
    const r = { base: base(o.base), valor: v.valor, exacto: v.exacto, texto: tx(v), a: a.valor, an: an.valor };
    return conErrores(r, {
      cuadradoDelLog: err(potenciaV(L.f ? txF(L.f) : L.valor, o.n), 'AL31', 'log(aⁿ) = (log a)ⁿ'),
      sumaN: err(vSuma(L, n), 'EL23', 'log(aⁿ) = log a + n'),
      numero: err(an, 'EL1', 'da el número aⁿ, no su logaritmo'),
    }, igualValor(r));
  }
  // Si baseˣ = valor, entonces baseˣ⁺ᵏ = valor · baseᵏ (un salto más en la escalera multiplica por la base).
  function potenciaDesplazada(o) {
    o = o || {};
    const v = vNum(o.valor), k = vNum(o.k), bk = potenciaV(o.base, o.k);
    if (!(v.valor > 0)) throw new Error('baseˣ siempre es mayor que cero');
    const r0 = vMul(v, bk);
    const r = { base: base(o.base), valor: r0.valor, exacto: r0.exacto, texto: tx(r0), x: logV(o.base, o.valor).valor };
    return conErrores(r, {
      reparte: err(vSuma(v, bk), 'AL11', 'baseˣ⁺ᵏ = baseˣ + baseᵏ'),
      sumaK: err(vSuma(v, k), 'EL19', 'baseˣ⁺ᵏ = baseˣ + k'),
      eleva: err(potenciaV(v.f ? txF(v.f) : v.valor, num(o.base, 'la base')), 'EL20', 'eleva el resultado a la base: (baseˣ)^base'),
    }, igualValor(r));
  }
  // log_b de cada argumento, sumados. log_b 1 = 0 (cero saltos) y log_b b = 1 (un salto).
  function sumaLogs(o) {
    o = o || {};
    const b = base(o.base);
    if (!Array.isArray(o.args) || !o.args.length) throw new Error('args debe ser una lista de números');
    const ls = o.args.map(x => logV(o.base, x));
    const s = ls.reduce((p, q) => vSuma(p, q), val(0, F(0)));
    const r = { base: b, valor: s.valor, exacto: s.exacto, texto: tx(s), logs: ls.map(x => x.valor) };
    const args = o.args.map(x => vNum(x));
    const conUno = o.args.some(x => casi(num(x, 'arg'), 1)), conBase = o.args.some(x => casi(num(x, 'arg'), b));
    const cambia = (f) => ls.map((l, i) => f(args[i]) || l).reduce((p, q) => vSuma(p, q), val(0, F(0)));
    return conErrores(r, {
      numero: err(args.reduce((p, q) => vSuma(p, q), val(0, F(0))), 'EL1', 'suma los números, no sus logaritmos'),
      logUnoEsUno: conUno ? err(cambia(a => (casi(a.valor, 1) ? val(1, F(1)) : null)), 'EL13', 'log_b 1 = 1') : null,
      logBaseCero: conBase ? err(cambia(a => (casi(a.valor, b) ? val(0, F(0)) : null)), 'EL21', 'log_b b = 0') : null,
    }, igualValor(r));
  }

  // ---------- Ecuaciones ----------
  // Soluciones como lista ordenada; el texto dice 'x = 4', 'x = 0 y x = 1' o 'sin solución'.
  function txSol(lista, letra) {
    const L = letra || 'x';
    if (lista === 'todos') return `todo número real`;
    if (!lista.length) return 'sin solución';
    const ts = lista.map(v => `${L} = ${tx(v)}`);
    return ts.length === 1 ? `solo ${ts[0]}` : ts.slice(0, -1).join(', ') + ' y ' + ts[ts.length - 1];
  }
  const ordenar = l => l.slice().sort((p, q) => p.valor - q.valor);
  const igualLista = (A, B) => A !== 'todos' && B !== 'todos' && A.length === B.length && A.every((v, i) => casi(v.valor, B[i].valor));
  // a·x + c = 0 con fracciones: una solución, ninguna o todas.
  function lineal(a, c) {
    if (fNum(a) === 0) return fNum(c) === 0 ? 'todos' : [];
    const x = fDiv(F(-c.n, c.d), a);
    return [val(fNum(x), x)];
  }
  function exponente(e, que) {
    if (!Array.isArray(e) || e.length !== 2) throw new Error(`${que} debe ser [m, c] para m·x + c`);
    const m = aF(e[0], que), c = aF(e[1], que);
    if (!m || !c) throw new Error(`${que} debe tener números enteros o fracciones`);
    return { m, c };
  }
  function txExp(E) {
    const m = E.m, c = E.c, ms = fNum(m) === 1 ? '' : fNum(m) === -1 ? MENOS : txF(m);
    let t = fNum(m) === 0 ? '' : `${ms}x`;
    if (fNum(c) !== 0 || !t) t += t ? (fNum(c) < 0 ? ` ${MENOS} ${txF(F(-c.n, c.d))}` : ` + ${txF(c)}`) : txF(c);
    return t;
  }
  // La base común más chica: b1 = gᵖ¹ y b2 = gᵖ² con exponentes enteros.
  function baseComun(b1, b2) {
    for (let g = 2; g <= 1000; g++) {
      const p1 = logV(g, b1), p2 = logV(g, b2);
      if (p1.f && p2.f && p1.f.d === 1 && p2.f.d === 1) return { g, p1: p1.f.n, p2: p2.f.n };
    }
    throw new Error('las bases no son potencias enteras de un mismo número');
  }
  function ecuacionBases(o) {
    o = o || {};
    const b1 = base(o.b1, 'b1'), b2 = base(o.b2, 'b2');
    const E1 = exponente(o.e1, 'e1'), E2 = exponente(o.e2, 'e2');
    const { g, p1, p2 } = baseComun(o.b1, o.b2);
    // p1·(m1x + c1) = p2·(m2x + c2)
    const res = (A, B) => lineal(fRes(A.m, B.m), fRes(A.c, B.c));
    const por = (E, p) => ({ m: fMul(E.m, F(p)), c: fMul(E.c, F(p)) });
    const mas = (E, k) => ({ m: E.m, c: fSum(E.c, F(k)) });
    const I = por(E1, p1), D = por(E2, p2);
    const sol = res(I, D);
    const r = { valor: sol === 'todos' ? null : sol.length ? sol[0].valor : null, soluciones: sol, texto: txSol(sol),
      comun: g, p1, p2, izquierda: `${g}^(${txExp(I)})`, derecha: `${g}^(${txExp(D)})`,
      expIzq: txExp(I), expDer: txExp(D) };
    if (sol !== 'todos' && sol.length) {
      const x = sol[0].f;
      const ei = fSum(fMul(E1.m, x), E1.c), ed = fSum(fMul(E2.m, x), E2.c);
      r.comprobacion = { izquierda: potenciaV(txF(F(aF(o.b1).n, aF(o.b1).d)), txF(ei)).valor, derecha: potenciaV(txF(F(aF(o.b2).n, aF(o.b2).d)), txF(ed)).valor,
        exponenteComun: fNum(fMul(ei, F(p1))) };
    }
    const errSol = (s, id, regla) => ({ soluciones: s, valor: s === 'todos' ? 'todos' : s.length ? s[0].valor : null, texto: txSol(s), id, regla });
    const errores = {
      igualaExponentes: b1 === b2 ? null : errSol(res(E1, E2), 'AL32', 'iguala los exponentes aunque las bases son distintas'),
      potenciaComoSuma: p1 === 1 && p2 === 1 ? null : errSol(res(p1 === 1 ? E1 : mas(E1, p1), p2 === 1 ? E2 : mas(E2, p2)), 'EL7', '(gᵖ)ᴱ = g^(p + E): suma los exponentes en una potencia de potencia'),
      porBase: p1 === 1 && p2 === 1 ? null : errSol(res(p1 === 1 ? E1 : mas(E1, p1 - 1), p2 === 1 ? E2 : mas(E2, p2 - 1)), 'EL8', '4ⁿ = 2 · 2ⁿ: cambia la base 4 por un 2 que multiplica'),
    };
    return conErrores(r, errores, e => (e.soluciones === 'todos' || sol === 'todos') ? e.soluciones === sol : igualLista(e.soluciones, sol));
  }
  // Raíces racionales (o aproximadas) de A·u² + B·u + C = 0.
  function cuadratica(A, B, C) {
    const fa = aF(A), fb = aF(B), fc = aF(C);
    const d = B * B - 4 * A * C;
    if (d < -TOL) return [];
    if (fa && fb && fc) {
      const D = fRes(fMul(fb, fb), fMul(F(4), fMul(fa, fc)));
      const rn = raizEntera(D.n, 2), rd = raizEntera(D.d, 2);
      if (rn !== null && rd !== null) {
        const s = F(rn, rd), dos = fMul(F(2), fa), mb = F(-fb.n, fb.d);
        const r1 = fDiv(fRes(mb, s), dos), r2 = fDiv(fSum(mb, s), dos);
        const l = [val(fNum(r1), r1)]; if (!fIgual(r1, r2)) l.push(val(fNum(r2), r2));
        return ordenar(l);
      }
    }
    const s = Math.sqrt(Math.max(0, d));
    const l = [val((-B - s) / (2 * A), null)]; if (s > TOL) l.push(val((-B + s) / (2 * A), null));
    return ordenar(l);
  }
  // (base²)ˣ + b·baseˣ + c = 0. Con u = baseˣ (siempre positiva): u² + b·u + c = 0; luego x = log_base u.
  function cambioVariable(o) {
    o = o || {};
    const bs = base(o.base), B = num(o.b, 'b'), C = num(o.c, 'c');
    const us = cuadratica(1, B, C);
    const validas = us.filter(u => u.valor > TOL), descartadas = us.filter(u => !(u.valor > TOL));
    const sol = ordenar(validas.map(u => logV(o.base, u.f ? txF(u.f) : u.valor)));
    const r = { base: bs, cuadrado: potenciaV(o.base, 2).valor, u: us.map(u => u.valor), uTexto: us.map(tx), descartadas: descartadas.map(u => u.valor),
      soluciones: sol.map(s => s.valor), texto: txSol(sol), valor: sol.map(s => s.valor) };
    const errores = {
      seQuedaEnU: { soluciones: us, valor: us.map(u => u.valor), texto: txSol(us), id: 'EL3', regla: 'da los valores de u = baseˣ como si fueran x' },
      descartaUno: validas.some(u => casi(u.valor, 1)) ? (() => { const s = sol.filter(x => !casi(x.valor, 0)); return { soluciones: s, valor: s.map(x => x.valor), texto: txSol(s), id: 'EL4', regla: 'cree que baseˣ = 1 no tiene solución' }; })() : null,
    };
    return conErrores(r, errores, e => igualLista(e.soluciones, sol));
  }
  // log(x + p) + log(x + q) = valor, en base 'base'. Se junta: (x + p)(x + q) = base^valor, y se verifica que los dos
  // argumentos salgan positivos (el dominio): una raíz que hace negativo un argumento es extraña.
  function ecuacionLog(o) {
    o = o || {};
    const bs = base(o.base), p = num(o.p, 'p'), q = num(o.q, 'q'), K = potenciaV(o.base, o.valor), k = num(o.valor, 'valor');
    const desde = Math.max(-p, -q);
    const enDominio = x => x.valor + p > TOL && x.valor + q > TOL;
    const cand = cuadratica(1, p + q, p * q - K.valor);
    const sol = cand.filter(enDominio), ext = cand.filter(x => !enDominio(x));
    const r = { base: bs, producto: K.valor, candidatas: cand.map(x => x.valor), extranas: ext.map(x => x.valor), soluciones: sol.map(x => x.valor),
      valor: sol.map(x => x.valor), texto: txSol(sol), dominio: { desde, texto: `x > ${txNum(desde)}` },
      argumentos: cand.map(x => [limpio(x.valor + p), limpio(x.valor + q)]) };
    const s2 = cuadratica(1, p + q, p * q - k).filter(enDominio);
    const sumaArg = (() => { const x = (K.valor - p - q) / 2, f = aF(x); return [val(x, f)]; })();
    const errores = {
      sinVerificar: ext.length ? { soluciones: cand, valor: cand.map(x => x.valor), texto: txSol(cand), id: 'EL5', regla: 'no descarta la raíz que hace negativo un argumento' } : null,
      sumaArgumentos: { soluciones: sumaArg, valor: sumaArg.map(x => x.valor), texto: txSol(sumaArg), id: 'AL10', regla: 'log(x + p) + log(x + q) = log(2x + p + q)' },
      sinElevar: { soluciones: s2, valor: s2.map(x => x.valor), texto: txSol(s2), id: 'EL14', regla: '(x + p)(x + q) = valor: se olvida de elevar la base' },
    };
    return conErrores(r, errores, e => igualLista(e.soluciones, sol));
  }

  // ---------- Inecuaciones ----------
  const CONTRA = { '<': '>', '>': '<', '≤': '≥', '≥': '≤' };
  function inecuacionExp(o) {
    o = o || {};
    const b = base(o.base), s = o.sentido;
    if (!CONTRA[s]) throw new Error('el sentido debe ser <, >, ≤ o ≥');
    const c = num(o.cota, 'la cota');
    if (!(c > 0)) throw new Error('la cota debe ser mayor que cero (baseˣ siempre es positiva)');
    const k = logV(o.base, o.cota), mk = k.f ? val(-k.valor, F(-k.f.n, k.f.d)) : val(-k.valor, null);
    const sentido = b > 1 ? s : CONTRA[s];
    const t = (sg, v) => `x ${sg} ${tx(v)}`;
    const r = { base: b, borde: k.valor, sentido, invierte: b < 1, texto: t(sentido, k), valor: t(sentido, k) };
    return conErrores(r, {
      sentidoContrario: { texto: t(CONTRA[sentido], k), id: 'EL6', regla: b < 1 ? 'con base entre 0 y 1 no invierte la desigualdad' : 'invierte la desigualdad sin motivo' },
      signoPerdido: { texto: t(CONTRA[sentido], mk), id: 'EL15', regla: 'al escribir (1/2)ˣ = 2⁻ˣ pierde el signo de un solo lado' },
      bordeOpuesto: { texto: t(sentido, mk), id: 'EL25', regla: 'cambia el signo del borde' },
    }, e => e.texto === r.texto);
  }

  // log_b(x + p) (sentido) cota. El argumento debe ser positivo (x > −p) y log_b(x + p) (sentido) cota equivale a
  // x + p (sentido) b^cota si b > 1, o al sentido contrario si 0 < b < 1. El resultado junta las dos condiciones.
  function inecuacionLog(o) {
    o = o || {};
    const b = base(o.base), s = o.sentido;
    if (!CONTRA[s]) throw new Error('el sentido debe ser <, >, ≤ o ≥');
    const P = vNum(o.p), K = potenciaV(o.base, o.cota);
    const L = K.f && P.f ? val(fNum(fRes(K.f, P.f)), fRes(K.f, P.f)) : val(K.valor - P.valor, null);
    const mp = P.f ? val(-P.valor, F(-P.f.n, P.f.d)) : val(-P.valor, null);
    const conDominio = sg => (sg === '<' || sg === '≤') ? `${tx(mp)} < x ${sg} ${tx(L)}` : `x ${sg} ${tx(L)}`;
    const sentido = b > 1 ? s : CONTRA[s];
    const r = { base: b, dominio: { desde: mp.valor, texto: `x > ${tx(mp)}` }, borde: L.valor, sentido, invierte: b < 1, texto: conDominio(sentido) };
    r.valor = r.texto;
    return conErrores(r, {
      sentidoContrario: { texto: conDominio(CONTRA[sentido]), id: 'EL6', regla: b < 1 ? 'con base entre 0 y 1 no invierte la desigualdad' : 'invierte la desigualdad sin motivo' },
      sinDominio: { texto: `x ${sentido} ${tx(L)}`, id: 'EL5', regla: 'olvida que el argumento debe ser positivo' },
    }, e => e.texto === r.texto);
  }
  // log(x + p) = log(x + q): con la misma base, los argumentos tienen que ser iguales; si p ≠ q, nunca lo son.
  function igualdadLog(o) {
    o = o || {};
    const b = base(o.base), p = num(o.p, 'p'), q = num(o.q, 'q'), desde = Math.max(-p, -q);
    const sol = casi(p, q) ? 'todos' : [];
    return { base: b, soluciones: sol, valor: sol === 'todos' ? null : [], dominio: { desde, texto: `x > ${txNum(desde)}` },
      texto: sol === 'todos' ? `todo x > ${txNum(desde)}` : 'sin solución', errores: {}, coinciden: [] };
  }

  // ---------- Crecimiento y decaimiento ----------
  function crecimiento(o) {
    o = o || {};
    const N0 = vNum(o.N0), fac = num(o.factor, 'el factor', { positivo: true }), t = num(o.t, 't', { entero: true, noNeg: true });
    if (!(N0.valor > 0)) throw new Error('N0 debe ser mayor que cero');
    const serie = [];
    for (let k = 0; k <= t; k++) serie.push(vMul(N0, potenciaV(o.factor, k)).valor);
    const N = vMul(N0, potenciaV(o.factor, t));
    const r = { N0: N0.valor, factor: fac, t, valor: N.valor, exacto: N.exacto, texto: tx(N), serie,
      cuadratica: serie.map((_, k) => limpio(N0.valor * k * k)), saltos: t };
    const errores = {
      cuadratico: err(val(N0.valor * t * t, aF(N0.valor * t * t)), 'AL33', 'confunde factorᵗ con t²'),
      unPeriodoMenos: t >= 1 ? err(vMul(N0, potenciaV(o.factor, t - 1)), 'EL10', 'cuenta un periodo de menos') : null,
      lineal: err(val(N0.valor + (N0.valor * fac - N0.valor) * t, aF(N0.valor + (N0.valor * fac - N0.valor) * t)), 'AL33', 'suma siempre lo del primer periodo: sin factor constante'),
      proporcional: o.ref === undefined ? null : (() => { const tr = num(o.ref, 'ref', { entero: true, positivo: true }), Nr = vMul(N0, potenciaV(o.factor, tr)), v = Nr.valor * t / tr;
        return err(val(v, aF(v)), 'EL9', `regla de tres: si en ${tr} hay ${tx(Nr)}, en ${t} habría ${txNum(v)}`); })(),
    };
    return conErrores(r, errores, igualValor(r));
  }
  function decaimiento(o) {
    o = o || {};
    const N0 = vNum(o.N0), T = num(o.vidaMedia, 'la vida media', { positivo: true }), t = num(o.t, 't', { noNeg: true });
    if (!(N0.valor > 0)) throw new Error('N0 debe ser mayor que cero');
    const n = vDiv(vNum(o.t), vNum(o.vidaMedia));
    const N = vMul(N0, potenciaV('1/2', n.f ? txF(n.f) : n.valor));
    const serie = [];
    if (Number.isInteger(n.valor)) for (let k = 0; k <= n.valor; k++) serie.push(vMul(N0, potenciaV('1/2', k)).valor);
    const r = { N0: N0.valor, vidaMedia: T, t, periodos: n.valor, valor: N.valor, exacto: N.exacto, texto: tx(N), serie };
    const lin = Math.max(0, N0.valor - N0.valor / 2 * n.valor);
    return conErrores(r, {
      lineal: err(val(lin, aF(lin)), 'EL11', 'pierde siempre la misma cantidad (la mitad del inicio) en cada vida media'),
      unaMenos: n.valor >= 1 ? err(vMul(N0, potenciaV('1/2', n.f ? txF(fRes(n.f, F(1))) : n.valor - 1)), 'EL10', 'cuenta una vida media de menos') : null,
      divide: casi(n.valor, 0) ? null : err(vDiv(N0, n), 'EL12', 'divide entre el número de vidas medias'),
    }, igualValor(r));
  }
  // Desde qué n entero (n ≥ 0) baseⁿ > nᵍ para siempre. Se recorre hasta n = 200 (la tabla, hasta 'hasta').
  function compararCrecimiento(o) {
    o = o || {};
    const b = num(o.base, 'la base', { entero: true }), g = num(o.grado, 'el grado', { entero: true, positivo: true }), hasta = num(o.hasta === undefined ? 12 : o.hasta, 'hasta', { entero: true });
    if (b < 2) throw new Error('la base debe ser un entero mayor que 1');
    const tabla = [], empates = [];
    let ultimaPerdida = -1;
    for (let n = 0; n <= 200; n++) {
      const e = Math.pow(b, n), p = Math.pow(n, g);
      if (n <= hasta) tabla.push([n, e, p]);
      if (e === p) empates.push(n);
      if (e <= p) ultimaPerdida = n;
    }
    // pasado n = 200, el cociente baseⁿ/nᵍ ya solo crece: base · (n/(n + 1))ᵍ ≥ 1
    if (b * Math.pow(200 / 201, g) < 1) throw new Error('el grado es demasiado grande para comparar hasta n = 200');
    const desde = ultimaPerdida + 1;
    const tx2 = n => (n === null ? 'ningún x' : `x = ${n}`);
    const r = { base: b, grado: g, desde, valor: desde, texto: tx2(desde), empates, tabla };
    return conErrores(r, {
      ultimoEmpate: empates.length ? { valor: empates[empates.length - 1], texto: tx2(empates[empates.length - 1]), id: 'EL16', regla: 'confunde empatar con ganar' } : null,
      primerEmpate: empates.length > 1 ? { valor: empates[0], texto: tx2(empates[0]), id: 'EL22', regla: 'toma el primer empate' } : null,
      nunca: { valor: null, texto: tx2(null), id: 'AL33', regla: 'cree que nᵍ crece más que la exponencial' },
    }, e => e.valor === desde);
  }

  function curvaPotencia(o) {
    o = o || {};
    const g = num(o.grado, 'el grado', { entero: true, positivo: true }), desde = num(o.desde, 'desde'), hasta = num(o.hasta, 'hasta'), n = num(o.n === undefined ? 120 : o.n, 'n', { entero: true });
    const pts = [];
    for (let i = 0; i <= n; i++) { const x = desde + (hasta - desde) * i / n; pts.push([x, Math.pow(x, g)]); }
    return { grado: g, pts };
  }

  return {
    potencia, log, regla, grafica, inversa,
    logProducto, logSuma, cocienteLogs, logPotencia, potenciaDesplazada, sumaLogs,
    ecuacionBases, cambioVariable, ecuacionLog, inecuacionExp, inecuacionLog, igualdadLog,
    crecimiento, decaimiento, compararCrecimiento, curvaPotencia,
    texto: txNum, _F: F, _txF: txF,
  };
});
