/*
 * Motor de «La barra que se parte»: fracciones, decimales, MCD y MCM, y promedios.
 *
 * Aquí vive toda la matemática de la plantilla (regla 1 de CLAUDE.md). No toca el DOM:
 * funciona igual en el navegador (window.MotorFracciones) y en Node (require('./motor.js')),
 * donde lo prueban casos.json y papel.json. Las fracciones son exactas (enteros, nunca coma flotante).
 *
 * Fracciones
 *   fr(n, d)                         fracción reducida { n, d } (el signo va en el numerador)
 *   crudo(n, d)                      fracción sin reducir (para mostrar 2/6 o 15/90 tal como salen)
 *   texto(f) · valor(f) · igual(f, g)
 *   simplificar(n, d)                la forma irreducible y el factor común que se quitó (el MCD)
 *   equivalentes(f, ks)              f ampliada por cada k
 *   comparar(f, g)                   cuál es mayor, por productos cruzados y con denominador común
 *   sumar(f, g) · restar(f, g)       con el denominador común (el MCM) y los errores típicos
 *   multiplicar(f, g) · dividir(f, g)
 *   fraccionDe(fs, total)            «los 2/3 de los 3/4 de …»: se multiplica
 *   parteQueFalta(fs)                1 − (suma de las partes)
 *   deLoQueQueda(fs)                 cada parte se saca de lo que va quedando
 *   partes(f)                        cómo se pinta f en barras de 1: cuántas barras y cuántos trozos llenos
 *   cuchillo(fs, N)                  partir la barra en N trozos iguales: ¿encajan los cortes de cada fracción? y la suma
 * Decimales
 *   decimal(f)                       la división larga: parte entera, anteperiodo y periodo; tipo y por qué
 *   cifras(f, k)                     las k primeras cifras decimales (texto con coma)
 *   generatriz(texto)                '0,25', '0,(3)' o '0,1(6)' → fracción, con los errores típicos
 *   compararDecimales(x, y)          el mayor de dos decimales escritos, y lo que dicen las reglas erróneas
 *   lupa(x, nivel)                   el tramo de ancho 10^−nivel que contiene x (para la recta con lupa)
 * MCD y MCM
 *   factores(n) · textoFactores(n)   descomposición en primos
 *   mcd(ns) · mcm(ns)                por descomposición (exponentes menores o mayores) y por Euclides
 *   euclides(a, b)                   las divisiones sucesivas [dividendo, divisor, cociente, resto]
 *   cintas(a, b)                     cortar dos cintas en trozos iguales lo más largos posible (MCD)
 *   coinciden(a, b)                  dos buses que salen juntos cada a y b minutos: vuelven a coincidir (MCM)
 *   cortar(largo, trozo)             cuántos trozos enteros salen y cuánto sobra
 * Promedios
 *   aritmetico(xs) · ponderado(valores, pesos) · armonico(xs)
 *   momento(valores, pesos, c)       Σ pesos·(valor − c): es cero justo en la media ponderada (el balancín queda derecho)
 *   idaVuelta(d, v1, v2)             velocidad media de ida y vuelta (la armónica), con tiempos y errores
 *   posicionViaje(d, v1, v2, t)      dónde está el auto en el instante t (para la animación)
 *
 * Cada resultado que es la respuesta de una predicción trae un campo 'errores' con lo que dan los errores típicos
 * de docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md (AR11 a AR15) y otros que son hipótesis nuestras.
 * Un error que en ese caso daría la respuesta correcta no se incluye: nunca coincide con ella.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorFracciones = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function entero(x, que, o) {
    o = o || {};
    if (typeof x !== 'number' || !Number.isInteger(x)) throw new Error(`${que} debe ser un número entero`);
    if (!Number.isSafeInteger(x)) throw new Error(`${que} es demasiado grande`);
    if (o.positivo && !(x > 0)) throw new Error(`${que} debe ser mayor que cero`);
    if (o.noCero && x === 0) throw new Error(`${que} no puede ser cero`);
    return x;
  }
  function numero(x, que, o) {
    o = o || {};
    if (typeof x !== 'number' || !Number.isFinite(x)) throw new Error(`${que} debe ser un número`);
    if (o.positivo && !(x > 0)) throw new Error(`${que} debe ser mayor que cero`);
    return x;
  }
  const limpio = x => (Math.abs(x - Math.round(x)) <= 1e-9 * Math.max(1, Math.abs(x)) ? Math.round(x) + 0 : x);
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; }
  const lcm = (a, b) => (a === 0 || b === 0 ? 0 : Math.abs(a / gcd(a, b) * b));

  // ---------- Fracciones ----------
  function crudo(n, d) {
    entero(n, 'el numerador'); entero(d, 'el denominador', { noCero: true });
    return d < 0 ? { n: -n + 0, d: -d } : { n: n + 0, d };
  }
  function fr(n, d) {
    if (d === undefined) d = 1;
    const c = crudo(n, d), g = gcd(c.n, c.d) || 1;
    return { n: c.n / g + 0, d: c.d / g };
  }
  // Acepta { n, d }, [n, d] o un entero.
  function comoFr(x, que) {
    if (typeof x === 'number') return fr(entero(x, que || 'el número'), 1);
    if (Array.isArray(x)) return fr(x[0], x[1]);
    if (x && typeof x === 'object') return fr(x.n, x.d);
    throw new Error(`${que || 'la fracción'} debe ser { n, d }, [n, d] o un entero`);
  }
  const texto = f => (f.d === 1 ? String(f.n) : `${f.n}/${f.d}`);
  const valor = f => f.n / f.d;
  const igual = (f, g) => f.n * g.d === g.n * f.d;
  const mas = (f, g) => fr(f.n * g.d + g.n * f.d, f.d * g.d);
  const menos = (f, g) => fr(f.n * g.d - g.n * f.d, f.d * g.d);
  const por = (f, g) => fr(f.n * g.n, f.d * g.d);
  const inv = (f, que) => { if (f.n === 0) throw new Error(`${que || 'la fracción'} es cero: no se puede invertir`); return fr(f.d, f.n); };
  // Quita los errores que en este caso dan lo mismo que la respuesta correcta (o lo mismo que otro error anterior).
  function filtrar(errores, correcta, eq) {
    const fuera = {}, vistos = [correcta];
    for (const [k, v] of Object.entries(errores)) {
      if (v === null || v === undefined) continue;
      if (vistos.some(w => eq(w, v))) continue;
      fuera[k] = v; vistos.push(v);
    }
    return fuera;
  }
  const eqFr = (a, b) => igual(a, b);
  const eqNum = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));

  function simplificar(n, d) {
    const c = crudo(n, d), g = gcd(c.n, c.d) || 1, f = fr(n, d);
    return { n: f.n, d: f.d, factor: g, irreducible: g === 1, texto: texto(f) };
  }
  function equivalentes(f, ks) {
    f = comoFr(f);
    if (!Array.isArray(ks) || !ks.length) throw new Error('ks debe ser una lista no vacía');
    return ks.map(k => { entero(k, 'k', { positivo: true }); return { n: f.n * k, d: f.d * k, texto: `${f.n * k}/${f.d * k}` }; });
  }
  // Para comparar: con denominador común (el MCM) o con los productos cruzados a·d contra c·b.
  function comparar(f, g) {
    f = comoFr(f, 'la primera'); g = comoFr(g, 'la segunda');
    const D = lcm(f.d, g.d), na = f.n * (D / f.d), nb = g.n * (D / g.d);
    const s = Math.sign(na - nb);
    return { mayor: s > 0 ? 'a' : s < 0 ? 'b' : 'iguales', signo: s, comun: { d: D, na, nb }, cruzados: [f.n * g.d, g.n * f.d],
      // error: el que tiene el denominador más grande «es mayor» (1/3 > 1/2 porque 3 > 2); con igual denominador no aplica
      errores: filtrar({ denominadorMayor: f.d === g.d ? null : f.d > g.d ? 'a' : 'b' }, s > 0 ? 'a' : s < 0 ? 'b' : 'iguales', (x, y) => x === y) };
  }
  // a/b + c/d. Errores: sumar numeradores y denominadores (AR12), sumar numeradores y multiplicar denominadores,
  // multiplicar en vez de sumar. Los errores van sin reducir, como los escribiría el alumno.
  function sumar(f, g) {
    f = comoFr(f, 'la primera'); g = comoFr(g, 'la segunda');
    const D = lcm(f.d, g.d), na = f.n * (D / f.d), nb = g.n * (D / g.d), r = fr(na + nb, D);
    return { resultado: r, texto: texto(r), comun: D, na, nb, sinSimplificar: crudo(na + nb, D), ampliadas: [crudo(na, D), crudo(nb, D)],
      errores: filtrar({ sumaTodo: crudo(f.n + g.n, f.d + g.d), sumaNumMultDen: crudo(f.n + g.n, f.d * g.d), multiplica: crudo(f.n * g.n, f.d * g.d) }, r, eqFr) };
  }
  function restar(f, g) {
    f = comoFr(f, 'la primera'); g = comoFr(g, 'la segunda');
    const D = lcm(f.d, g.d), na = f.n * (D / f.d), nb = g.n * (D / g.d), r = fr(na - nb, D);
    const e = { restaNumMultDen: crudo(f.n - g.n, f.d * g.d) };
    if (f.d !== g.d) e.restaTodo = crudo(f.n - g.n, f.d - g.d);
    return { resultado: r, texto: texto(r), comun: D, na, nb, sinSimplificar: crudo(na - nb, D), errores: filtrar(e, r, eqFr) };
  }
  function multiplicar(f, g) {
    f = comoFr(f, 'la primera'); g = comoFr(g, 'la segunda');
    const r = por(f, g), e = { sumaEnVezDeMultiplicar: mas(f, g) };
    if (g.n !== 0) e.cruzado = crudo(f.n * g.d, f.d * g.n);
    return { resultado: r, texto: texto(r), sinSimplificar: crudo(f.n * g.n, f.d * g.d), errores: filtrar(e, r, eqFr) };
  }
  // f ÷ g = f · (1/g). Errores: no invertir (multiplicar), invertir la fracción equivocada (el dividendo), invertir las dos.
  function dividir(f, g) {
    f = comoFr(f, 'el dividendo'); g = comoFr(g, 'el divisor');
    const r = por(f, inv(g, 'el divisor'));
    const e = { sinInvertir: por(f, g) };
    if (f.n !== 0) { e.invierteDividendo = por(inv(f), g); e.invierteAmbos = por(inv(f), inv(g)); }
    return { resultado: r, texto: texto(r), errores: filtrar(e, r, eqFr) };
  }
  // «Los f₁ de los f₂ de … de total». Errores: sumar las fracciones, sumar numeradores y denominadores, multiplicar en cruz.
  function fraccionDe(fs, total) {
    if (!Array.isArray(fs) || !fs.length) throw new Error('fs debe ser una lista no vacía de fracciones');
    const F = fs.map((x, j) => comoFr(x, `fs[${j}]`));
    const p = F.reduce(por, fr(1)), T = total === undefined ? fr(1) : comoFr(total, 'el total'), r = por(p, T);
    const e = { suma: por(F.reduce(mas, fr(0)), T) };
    if (F.length === 2) { e.sumaTodo = por(fr(F[0].n + F[1].n, F[0].d + F[1].d), T); if (F[1].n) e.cruzado = por(fr(F[0].n * F[1].d, F[0].d * F[1].n), T); }
    return { resultado: r, texto: texto(r), producto: p, sinSimplificar: crudo(F.reduce((s, x) => s * x.n, 1), F.reduce((s, x) => s * x.d, 1)), errores: filtrar(e, r, eqFr) };
  }
  // Se gastan las partes fs del total (todas del total): ¿qué parte queda? Errores: AR12 al sumar las partes; la suma sola.
  function parteQueFalta(fs) {
    if (!Array.isArray(fs) || !fs.length) throw new Error('fs debe ser una lista no vacía de fracciones');
    const F = fs.map((x, j) => comoFr(x, `fs[${j}]`)), S = F.reduce(mas, fr(0)), r = menos(fr(1), S);
    const todo = fr(F.reduce((s, x) => s + x.n, 0), F.reduce((s, x) => s + x.d, 0));
    return { resultado: r, texto: texto(r), gastado: S, errores: filtrar({ sumaTodo: menos(fr(1), todo), loGastado: S }, r, eqFr) };
  }
  // Primero se gasta fs[0] del total, luego fs[1] de lo que queda, y así. Queda Π(1 − fᵢ).
  // Error: tomar todas las partes del total (como en parteQueFalta).
  function deLoQueQueda(fs, total) {
    if (!Array.isArray(fs) || !fs.length) throw new Error('fs debe ser una lista no vacía de fracciones');
    const F = fs.map((x, j) => comoFr(x, `fs[${j}]`)), T = total === undefined ? fr(1) : comoFr(total, 'el total');
    let queda = T; const pasos = [];
    for (const f of F) { const gasta = por(f, queda); pasos.push({ gasta, antes: queda }); queda = menos(queda, gasta); }
    const r = queda, delTotal = por(menos(fr(1), F.reduce(mas, fr(0))), T);
    return { resultado: r, texto: texto(r), pasos, errores: filtrar({ todoDelTotal: delTotal }, r, eqFr) };
  }
  // Cómo se pinta f (positiva) en barras de 1 partidas en f.d trozos: cuántas barras y cuántos trozos llenos en cada una.
  function partes(f, d) {
    f = comoFr(f); if (f.n < 0) throw new Error('la fracción debe ser positiva');
    const D = d === undefined ? f.d : entero(d, 'd', { positivo: true });
    if (D % f.d) throw new Error('d debe ser un múltiplo del denominador');
    const trozos = f.n * (D / f.d), barras = Math.max(1, Math.ceil(trozos / D));
    return { d: D, trozos, barras, llenos: Array.from({ length: barras }, (_, j) => Math.max(0, Math.min(D, trozos - j * D))) };
  }

  // Un cuchillo parte la barra en N trozos iguales. Los cortes de la fracción n/d (cada 1/d) caen sobre cortes del
  // cuchillo solo si N es múltiplo de d; entonces n/d = (n·N/d)/N. Si todas encajan, la suma se lee en N-ésimos.
  // El N más chico en que encajan todas es el MCM de los denominadores.
  function cuchillo(fs, N) {
    if (!Array.isArray(fs) || !fs.length) throw new Error('fs debe ser una lista no vacía de fracciones');
    entero(N, 'N', { positivo: true });
    const F = fs.map((x, j) => comoFr(x, `fs[${j}]`));
    const cada = F.map(f => ({ encaja: N % f.d === 0, ampliada: N % f.d === 0 ? f.n * (N / f.d) : null,
      // de los cortes propios de la fracción (en 1/d, 2/d, …, (d − 1)/d), cuántos caen sobre un corte del cuchillo
      coinciden: Array.from({ length: f.d - 1 }, (_, j) => ((j + 1) * N) % f.d === 0).filter(Boolean).length, cortes: f.d - 1 }));
    const todas = cada.every(c => c.encaja), M = F.reduce((s, f) => lcm(s, f.d), 1);
    return { N, fracciones: cada, todas, mcm: M, suma: todas ? crudo(cada.reduce((s, c) => s + c.ampliada, 0), N) : null };
  }

  // ---------- Decimales ----------
  function factores(n) {
    entero(n, 'n', { positivo: true });
    const out = []; let m = n;
    for (let p = 2; p * p <= m; p++) { let e = 0; while (m % p === 0) { m /= p; e++; } if (e) out.push([p, e]); }
    if (m > 1) out.push([m, 1]);
    return out;
  }
  const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const textoFactores = n => (n === 1 ? '1' : factores(n).map(([p, e]) => (e === 1 ? String(p) : p + String(e).split('').map(c => SUP[c]).join(''))).join('·'));
  // División larga de |n|/d. El periodo empieza cuando un resto se repite. La regla: con el denominador reducido,
  // si solo tiene 2 y 5 el decimal es exacto; si no tiene ni 2 ni 5, periódico puro; si tiene los dos tipos, mixto.
  function decimal(f) {
    f = comoFr(f);
    const neg = f.n < 0, N = Math.abs(f.n), D = f.d, ent = Math.floor(N / D);
    let r = N % D; const cifras = [], vistos = new Map();
    while (r !== 0 && !vistos.has(r)) { vistos.set(r, cifras.length); r *= 10; cifras.push(Math.floor(r / D)); r %= D; }
    const ini = r === 0 ? cifras.length : vistos.get(r);
    const ante = cifras.slice(0, ini).join(''), periodo = r === 0 ? '' : cifras.slice(ini).join('');
    const fs = factores(D).map(x => x[0]), con25 = fs.some(p => p === 2 || p === 5), otros = fs.some(p => p !== 2 && p !== 5);
    const tipo = !periodo ? 'exacto' : ante ? 'periodico-mixto' : 'periodico-puro';
    const regla = D === 1 ? 'entero' : !otros ? 'exacto' : con25 ? 'periodico-mixto' : 'periodico-puro';
    const signo = neg ? '−' : '';
    const t = signo + ent + (ante || periodo ? ',' + ante + (periodo ? `(${periodo})` : '') : '');
    const puntos = signo + ent + (ante || periodo ? ',' + ante + (periodo ? periodo.repeat(Math.max(1, Math.ceil(4 / periodo.length))) + '…' : '') : '');
    return { entero: ent, negativo: neg, anteperiodo: ante, periodo, tipo, regla, factoresDen: textoFactores(D), texto: t, conPuntos: puntos };
  }
  function cifras(f, k) {
    f = comoFr(f); entero(k, 'k', { positivo: true });
    const N = Math.abs(f.n), D = f.d; let r = N % D, s = '';
    for (let j = 0; j < k; j++) { r *= 10; s += Math.floor(r / D); r %= D; }
    return (f.n < 0 ? '−' : '') + Math.floor(N / D) + ',' + s;
  }
  const pot = k => Math.pow(10, k);
  // Lee '0,25', '2,3(45)', '0,(9)' (el periodo entre paréntesis). También acepta punto en vez de coma.
  function leer(t) {
    if (typeof t !== 'string') throw new Error('el decimal debe ser un texto como "0,25" o "0,1(6)"');
    const m = /^\s*(\d+)(?:[,.](\d*)(?:\((\d+)\))?)?\s*$/.exec(t);
    if (!m) throw new Error(`no entiendo el decimal "${t}"`);
    return { ent: Number(m[1]), ante: m[2] || '', periodo: m[3] || '' };
  }
  // Fracción generatriz. Exacto: las cifras sobre 10^k. Puro: el periodo sobre tantos 9 como cifras tiene.
  // Mixto: (todo − lo que no se repite) sobre tantos 9 como cifras del periodo y tantos 0 como del anteperiodo.
  // Errores: tratarlo como exacto (cortar el número donde se dejó de escribir), el mixto como puro, el mixto sin restar
  // el anteperiodo, y el puro con la regla del mixto (un 0 de más).
  function generatriz(t) {
    const { ent, ante, periodo } = leer(t), a = ante.length, p = periodo.length;
    const B = BigInt, todo = B((ante + periodo) || '0'), soloAnte = B(ante || '0'), E = B(ent), diez = k => 10n ** B(k);
    const nueveB = k => diez(k) - 1n;
    let num, den;
    const tipo = !p ? 'exacto' : a ? 'periodico-mixto' : 'periodico-puro';
    if (!p) { den = diez(a); num = E * den + soloAnte; }
    else { den = nueveB(p) * diez(a); num = E * den + todo - soloAnte; }
    // la fracción reducida se calcula con enteros grandes (un periodo largo no entra en un número común)
    let g = num, h = den; while (h) [g, h] = [h, g % h];
    const rn = num / g, rd = den / g;
    if (rn > B(Number.MAX_SAFE_INTEGER) || rd > B(Number.MAX_SAFE_INTEGER)) throw new Error('el denominador es demasiado grande');
    const r = fr(Number(rn), Number(rd));
    const seguro = x => x <= B(Number.MAX_SAFE_INTEGER);
    const sin = seguro(num) && seguro(den) ? crudo(Number(num), Number(den)) : null;
    const e = {};
    const pon = (k, n, d) => { if (seguro(n) && seguro(d)) e[k] = crudo(Number(n), Number(d)); };
    if (p) {
      pon('comoExacto', E * diez(a + p) + todo, diez(a + p));
      if (a) { pon('comoPuro', E * nueveB(a + p) + todo, nueveB(a + p)); pon('sinRestar', E * nueveB(p) * diez(a) + todo, nueveB(p) * diez(a)); }
      else { pon('tresVeces', E * diez(3 * p) + B(periodo.repeat(3)), diez(3 * p)); pon('comoMixto', E * nueveB(p) * 10n + todo, nueveB(p) * 10n); }
    }
    return { resultado: r, texto: texto(r), sinSimplificar: sin, tipo, entero: ent, anteperiodo: ante, periodo, errores: filtrar(e, r, eqFr) };
  }
  // ¿Cuál es mayor? La regla «más largo es mayor» (AR11) lee las cifras después de la coma como un entero; la del
  // redondeo compara con una sola cifra decimal (0,25 → 0,3). Las dos parte entera se comparan primero.
  function compararDecimales(x, y) {
    const A = leer(x), B = leer(y);
    if (A.periodo || B.periodo) throw new Error('compararDecimales es para decimales exactos');
    const fa = generatriz(x).resultado, fb = generatriz(y).resultado, s = Math.sign(fa.n * fb.d - fb.n * fa.d);
    const mayor = s > 0 ? 'a' : s < 0 ? 'b' : 'iguales';
    const cmp = (u, v) => (u > v ? 'a' : u < v ? 'b' : 'iguales');
    const L = Math.max(A.ante.length, B.ante.length, 1);
    const largo = A.ent !== B.ent ? cmp(A.ent, B.ent) : cmp(Number(A.ante || '0'), Number(B.ante || '0')) === 'iguales' ? cmp(A.ante.length, B.ante.length) : cmp(Number(A.ante || '0'), Number(B.ante || '0'));
    const r1 = z => Math.round(z * 10) / 10;
    const redondeo = cmp(r1(valor(fa)), r1(valor(fb)));
    return { mayor, valores: [valor(fa), valor(fb)], fracciones: [fa, fb],
      alineados: [`${A.ent},${A.ante.padEnd(L, '0')}`, `${B.ent},${B.ante.padEnd(L, '0')}`], centesimas: [Math.round(valor(fa) * pot(L)), Math.round(valor(fb) * pot(L))],
      errores: filtrar({ masLargo: largo, redondeo }, mayor, (u, v) => u === v) };
  }
  // El tramo de la recta de ancho 10^−nivel que contiene x: lo que muestra la lupa en ese nivel.
  function lupa(x, nivel) {
    numero(x, 'x'); entero(nivel, 'nivel'); if (nivel < 0) throw new Error('nivel debe ser 0 o más');
    const w = pot(-nivel), k = Math.floor(x / w + 1e-9);
    return { desde: limpio(k * w), hasta: limpio((k + 1) * w), ancho: w, marcas: Array.from({ length: 11 }, (_, j) => limpio((k + j / 10) * w)) };
  }

  // ---------- MCD y MCM ----------
  function lista(ns, que) {
    if (!Array.isArray(ns) || ns.length < 2) throw new Error(`${que} debe ser una lista de al menos dos números`);
    ns.forEach((x, j) => entero(x, `${que}[${j}]`, { positivo: true }));
    return ns;
  }
  function euclides(a, b) {
    entero(a, 'a', { positivo: true }); entero(b, 'b', { positivo: true });
    let x = Math.max(a, b), y = Math.min(a, b); const pasos = [];
    while (y) { pasos.push([x, y, Math.floor(x / y), x % y]); [x, y] = [y, x % y]; }
    return { valor: x, pasos };
  }
  // Por descomposición: el MCD lleva los primos comunes con el menor exponente; el MCM, todos con el mayor.
  function exponentes(ns, elegir) {
    const mapas = ns.map(n => new Map(factores(n)));
    const primos = [...new Set(mapas.flatMap(m => [...m.keys()]))].sort((a, b) => a - b);
    return primos.map(p => [p, elegir(mapas.map(m => m.get(p) || 0))]).filter(x => x[1] > 0);
  }
  const deFactores = fs => fs.reduce((s, [p, e]) => s * Math.pow(p, e), 1);
  const textoDe = fs => (fs.length ? fs.map(([p, e]) => (e === 1 ? String(p) : p + String(e).split('').map(c => SUP[c]).join(''))).join('·') : '1');
  function mcd(ns) {
    lista(ns, 'ns');
    const fs = exponentes(ns, es => Math.min(...es)), v = deFactores(fs);
    return { valor: v, factores: fs, textoFactores: textoDe(fs), descomposiciones: ns.map(textoFactores),
      euclides: ns.length === 2 ? euclides(ns[0], ns[1]).pasos : null, divisoresComunes: divisores(v) };
  }
  function mcm(ns) {
    lista(ns, 'ns');
    const fs = exponentes(ns, es => Math.max(...es)), v = deFactores(fs);
    return { valor: v, factores: fs, textoFactores: textoDe(fs), descomposiciones: ns.map(textoFactores),
      porEuclides: ns.reduce((s, x) => lcm(s, x)), multiplos: ns.map(n => v / n) };
  }
  function divisores(n) { entero(n, 'n', { positivo: true }); const out = []; for (let k = 1; k <= n; k++) if (n % k === 0) out.push(k); return out; }
  // Cortar dos cintas de a y b (enteros) en trozos todos iguales, lo más largos posible y sin que sobre nada.
  // El trozo divide a las dos: es un divisor común, y el más largo es el MCD. Errores: usar el MCM (AR13), el producto,
  // un divisor común que no es el mayor (la mitad del MCD).
  function cintas(a, b) {
    entero(a, 'la cinta A', { positivo: true }); entero(b, 'la cinta B', { positivo: true });
    const g = gcd(a, b), L = lcm(a, b);
    return { trozo: g, trozosA: a / g, trozosB: b / g, trozos: a / g + b / g, comunes: divisores(g),
      errores: filtrar({ mcm: L, producto: a * b, otroDivisor: g % 2 === 0 ? g / 2 : null }, g, (x, y) => x === y) };
  }
  // Dos buses salen juntos y luego pasan cada a y b minutos: vuelven a coincidir en un múltiplo común; el primero es el MCM.
  // Errores: el MCD (AR13), el producto, la suma.
  function coinciden(a, b, hasta) {
    entero(a, 'el bus A', { positivo: true }); entero(b, 'el bus B', { positivo: true });
    const L = lcm(a, b), H = hasta === undefined ? 2 * L : entero(hasta, 'hasta', { positivo: true });
    const sal = p => Array.from({ length: Math.floor(H / p) + 1 }, (_, j) => j * p);
    return { minutos: L, vueltasA: L / a, vueltasB: L / b, salidasA: sal(a), salidasB: sal(b),
      juntos: sal(L), errores: filtrar({ mcd: gcd(a, b), producto: a * b, suma: a + b }, L, (x, y) => x === y) };
  }

  function cortar(largo, trozo) {
    entero(largo, 'el largo', { positivo: true }); entero(trozo, 'el trozo', { positivo: true });
    return { trozos: Math.floor(largo / trozo), sobra: largo % trozo, justo: largo % trozo === 0 };
  }

  // ---------- Promedios ----------
  function nums(xs, que, o) {
    if (!Array.isArray(xs) || !xs.length) throw new Error(`${que} debe ser una lista no vacía`);
    xs.forEach((x, j) => numero(x, `${que}[${j}]`, o));
    return xs;
  }
  const aritmetico = xs => limpio(nums(xs, 'xs').reduce((s, x) => s + x, 0) / xs.length);
  const armonico = xs => limpio(nums(xs, 'xs', { positivo: true }).length / xs.reduce((s, x) => s + 1 / x, 0));
  // Media ponderada: Σ pᵢ·xᵢ / Σ pᵢ. Errores: el promedio de los promedios (AR15); los pesos cruzados (con dos grupos);
  // quedarse con el valor del grupo más grande.
  function ponderado(valores, pesos) {
    nums(valores, 'valores'); nums(pesos, 'pesos', { positivo: true });
    if (valores.length !== pesos.length) throw new Error('valores y pesos deben tener el mismo largo');
    const P = pesos.reduce((s, x) => s + x, 0), S = valores.reduce((s, x, j) => s + x * pesos[j], 0), m = limpio(S / P);
    const e = { simple: aritmetico(valores) };
    if (valores.length === 2) e.pesosCruzados = limpio((valores[0] * pesos[1] + valores[1] * pesos[0]) / P);
    const jmax = pesos.indexOf(Math.max(...pesos));
    if (pesos.filter(p => p === pesos[jmax]).length === 1) e.grupoMayor = valores[jmax];
    // fracción exacta si los datos son enteros
    const exacta = valores.concat(pesos).every(Number.isInteger) ? fr(S, P) : null;
    return { media: m, sumaPesos: limpio(P), suma: limpio(S), fraccion: exacta, errores: filtrar(e, m, eqNum) };
  }
  // El balancín: cada grupo es un peso pᵢ puesto en su valor xᵢ. Gira hacia el lado de signo del momento; queda derecho
  // (momento cero) solo si el apoyo está en la media ponderada.
  function momento(valores, pesos, c) {
    nums(valores, 'valores'); nums(pesos, 'pesos', { positivo: true }); numero(c, 'c');
    if (valores.length !== pesos.length) throw new Error('valores y pesos deben tener el mismo largo');
    return limpio(valores.reduce((s, x, j) => s + pesos[j] * (x - c), 0));
  }
  // Ida y vuelta por el mismo camino de largo d. La velocidad media es distancia total entre tiempo total:
  // 2d/(d/v1 + d/v2) = 2·v1·v2/(v1 + v2), la media armónica. Más tiempo se pasa a la velocidad más baja.
  // Errores: el promedio simple (AR14), la suma de velocidades, la fórmula sin el 2 (v1·v2/(v1 + v2)).
  function idaVuelta(d, v1, v2) {
    numero(d, 'la distancia', { positivo: true }); numero(v1, 'la velocidad de ida', { positivo: true }); numero(v2, 'la velocidad de vuelta', { positivo: true });
    const t1 = limpio(d / v1), t2 = limpio(d / v2), T = limpio(t1 + t2), m = limpio(2 * d / (d / v1 + d / v2));
    return { media: m, t1, t2, tiempo: T, distancia: limpio(2 * d), pesosTiempo: [limpio(t1 / T), limpio(t2 / T)],
      errores: filtrar({ simple: limpio((v1 + v2) / 2), suma: limpio(v1 + v2), sinElDos: limpio(v1 * v2 / (v1 + v2)) }, m, eqNum) };
  }
  // Dónde está el auto en el instante t: x desde la salida (0 a d) y en qué tramo va.
  function posicionViaje(d, v1, v2, t) {
    const r = idaVuelta(d, v1, v2); numero(t, 't');
    if (t <= 0) return { x: 0, tramo: 'ida', recorrido: 0 };
    if (t < r.t1) return { x: limpio(v1 * t), tramo: 'ida', recorrido: limpio(v1 * t) };
    if (t < r.tiempo) return { x: limpio(d - v2 * (t - r.t1)), tramo: 'vuelta', recorrido: limpio(d + v2 * (t - r.t1)) };
    return { x: 0, tramo: 'llego', recorrido: r.distancia };
  }

  return { fr, crudo, texto, valor, igual, simplificar, equivalentes, comparar, sumar, restar, multiplicar, dividir,
    fraccionDe, parteQueFalta, deLoQueQueda, partes, cuchillo, decimal, cifras, generatriz, compararDecimales, lupa,
    factores, textoFactores, euclides, mcd, mcm, divisores, cintas, coinciden, cortar,
    aritmetico, ponderado, armonico, momento, idaVuelta, posicionViaje };
});
