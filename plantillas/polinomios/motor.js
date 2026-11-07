/*
 * Motor de «La máquina de Ruffini»: valor numérico, grados, polinomios completos, división (clásica y por Ruffini),
 * teorema del resto, teorema del factor y raíces racionales candidatas.
 *
 * Aquí vive toda la matemática de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el
 * navegador (window.MotorPolinomios) y en Node (require('./motor.js')). Las cuentas son exactas con fracciones.
 *
 * CONVENCIONES
 *   Un polinomio en x se da como lista de coeficientes del grado mayor al término independiente, CON los ceros de
 *   los términos que faltan: 2x³ − 7x + 4 es [2, 0, -7, 4]. Cada coeficiente es un número entero o decimal, o un
 *   texto de fracción '1/2' / '-3/4'. Un divisor de primer grado a·x + b se da como [a, b]: x − 2 es [1, -2],
 *   2x − 1 es [2, -1]. Los textos usan el signo menos tipográfico (−) y superíndices (x³). Las fracciones de salida
 *   se escriben 'p/q' ('1/2', '−3/2').
 *   Cada función que responde una predicción devuelve { valor, texto, …, errores, coinciden }: 'errores' es un objeto
 *   cuyas claves son errores típicos y cada uno trae { valor o cociente/resto, texto, id, regla }; 'id' es PO1…PO35
 *   (hipótesis nuestras) o AL16 (docs/investigacion/algebra-funciones-ideas-erroneas.md). Un error que con esos
 *   números daría lo mismo que la respuesta correcta NO va en 'errores': su clave va en la lista 'coinciden'.
 *
 * FUNCIONES EXPORTADAS
 *   texto(coefs, letra?)            → texto del polinomio, p. ej. texto([2,0,-7,4]) = '2x³ − 7x + 4'; [0] → '0'.
 *                                     letra por defecto 'x'.
 *   evaluar({ coefs, x })           → { valor (número), texto (exacto: '−18', '1/2'), terminos: [{ coef, exp, valor }] }
 *                                     P(x) sustituyendo; terminos da cada coef·xᵉˣᵖ ya calculado (coef y valor números).
 *   pDeCero({ coefs })              → P(0) = término independiente. { valor, texto, errores:
 *                                     sumaCoef (PO7: suma de coeficientes), principal (PO19: coeficiente principal),
 *                                     cero (PO34: P(0) = 0) }.
 *   pDeUno({ coefs })               → P(1) = suma de coeficientes. { valor, texto, errores:
 *                                     independiente (PO12: término independiente), principal (PO20: coeficiente
 *                                     principal), sinSignos (PO21: suma de los valores absolutos) }.
 *   grado({ terminos })             → grados de un polinomio en x e y. terminos: [{ c, x, y }] (c coeficiente ≠ 0,
 *                                     x e y exponentes enteros ≥ 0). { valor: grado absoluto (GA), GR: { x, y }
 *                                     grados relativos, gradosTerminos: [grado de cada término], texto: '6', errores:
 *                                     relativo (PO10: el mayor grado relativo), sumaTodos (PO11: suma de todos los
 *                                     exponentes), sumaRelativos (PO28: GR(x) + GR(y)) }.
 *   gradoProducto({ m, n })         → grado de P·Q con grados m y n: { valor: m + n, texto, errores:
 *                                     producto (PO5: m·n), mayor (PO23: el mayor de los dos) }.
 *   gradoSuma({ m, n })             → grado de P + Q con grados distintos m ≠ n: { valor: el mayor, texto, errores:
 *                                     suma (PO6: m + n), producto (PO5: m·n), menor (PO22: el menor) }.
 *   gradoPotencia({ m, k })         → grado de [P]ᵏ con P de grado m: { valor: m·k, texto, errores:
 *                                     suma (PO13: m + k), potencia (PO14: mᵏ), igual (PO30: m) }.
 *   completo({ grado })             → términos de un polinomio completo de grado n: { valor: n + 1, texto, exponentes:
 *                                     [n, …, 0], errores: igual (PO9: n) }.
 *   gradoDeCompleto({ terminos })   → grado de un completo con t términos: { valor: t − 1, texto, errores:
 *                                     igual (PO9: t), masUno (PO29: t + 1) }.
 *   ruffini({ coefs, divisor })     → división de P entre a·x + b por Ruffini (divisor [a, b], a ≠ 0). {
 *                                     raiz: −b/a (número), raizTexto, arriba: coefs (números), productos: [null, …]
 *                                     (lo que se escribe en la segunda fila: raíz por la suma anterior),
 *                                     sumas: [ … ] (tercera fila; la última es el resto), cocienteProvisional: coefs
 *                                     (sumas sin la última), cociente: coefs (las provisionales divididas entre a),
 *                                     resto (número), texto (cociente), restoTexto, par: 'Q = …; R = …',
 *                                     errores (cada uno { cociente, resto, texto, restoTexto, par, id, regla }):
 *                                     sinCero (PO1: no pone el 0 de los términos que faltan), signo (PO2: usa b/a
 *                                     en vez de −b/a), sinDividir (PO3: no divide el cociente entre a; solo si a ≠ 1),
 *                                     restoDividido (PO4: divide también el resto entre a; solo si a ≠ 1),
 *                                     todaLaFila (PO18: toma toda la última fila como cociente, grado del dividendo) }.
 *                                     Dos resultados son iguales si cociente y resto lo son.
 *   dividir({ dividendo, divisor }) → división clásica de polinomios (divisor de grado ≥ 1, coefs completos). {
 *                                     cociente: coefs, resto: coefs (grado menor que el divisor; [0] si es exacta),
 *                                     texto (cociente), restoTexto, exacta (booleano), pasos: [{ termino: { coef, exp },
 *                                     resta: coefs, queda: coefs }] }.
 *   cajaDivision({ dividendo, divisor }) → la tabla de área de la división: { filas: [{ coef, exp, texto }] (términos
 *                                     del cociente), columnas: [ … ] (términos del divisor), celdas: [[{ coef, exp,
 *                                     texto }]] (producto de cada fila por cada columna), resto: coefs, restoTexto,
 *                                     comprobacion: coefs de divisor·cociente + resto (= dividendo) }.
 *   restoSustitucion({ dividendo, k }) → resto de P ÷ (x² + k) cambiando x² por −k. { resto: coefs [p, q] (p·x + q),
 *                                     texto: 'px + q', cociente: coefs (de dividir), errores (cada uno { resto, texto,
 *                                     id, regla }): signo (PO16: x² = k), unaVez (PO31: xⁿ → (−k)·x^(n mod 2), el
 *                                     signo de una sola sustitución), pierdeX (PO32: xⁿ → (−k)^⌊n/2⌋, se pierde la x
 *                                     que sobra) }.
 *   teoremaResto({ coefs, divisor }) → resto de P ÷ (a·x + b) = P(−b/a). { valor, texto, raiz, raizTexto, errores:
 *                                     signo (PO8: P(b/a)), parNegativo (PO15: con raíz negativa, (−r)ⁿ de exponente par
 *                                     sale negativo), independiente (PO27: el término independiente) }.
 *   factorK({ coefs, raiz })        → coefs con UN coeficiente desconocido escrito 'k' (p. ej. [1, -3, 'k', 6]);
 *                                     el valor de k para que (x − raiz) sea factor, o sea P(raiz) = 0. { valor, texto:
 *                                     'k = −1', cociente: coefs de P ÷ (x − raiz) con ese k, errores: signo (PO17:
 *                                     P(−raiz) = 0), sumaCoef (PO33: P(1) = 0), despeje (AL16: despeja con el signo
 *                                     cambiado, −k) }.
 *   raicesRacionales({ coefs })     → coefs enteros con coeficiente principal y término independiente ≠ 0. {
 *                                     valor: cuántos candidatos ±p/q hay (p divide al independiente, q al principal,
 *                                     fracciones simplificadas y sin repetir), texto, candidatos: [números ordenados],
 *                                     candidatosTexto: ['−3', '−1/2', …], raices: [las candidatas con P = 0],
 *                                     errores: soloPositivos (PO24: la mitad), soloIndependiente (PO25: ±divisores del
 *                                     independiente), sinSimplificar (PO26: 2·(divisores de p)·(divisores de q)) }.
 *   sumar({ p, q })                 → suma de dos polinomios (coefs), casilla por casilla: { coefs (sin ceros de
 *                                     adelante), texto, grado }.
 *   curva({ coefs, desde, hasta, n }) → { pts: [[x, P(x)], …] } con n + 1 puntos igualmente espaciados (n por
 *                                     defecto 200).
 *   num(texto)                      → número de un coeficiente ('1/2' → 0.5).
 *   textoNumero(x)                  → número como texto exacto si es fracción corta ('−3/2'), si no con coma decimal.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorPolinomios = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const MENOS = '−';
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
  const fAbs = a => F(Math.abs(a.n), a.d);
  const fIgual = (a, b) => a.n === b.n && a.d === b.d;
  const fNum = a => a.n / a.d + 0;
  function fPot(a, e) { let r = F(1); for (let k = 0; k < e; k++) r = fMul(r, a); return r; }
  const CERO = F(0), UNO = F(1);

  function aF(x, que) {
    if (x && typeof x === 'object' && 'n' in x && 'd' in x) return F(x.n, x.d);
    if (typeof x === 'string') {
      const m = x.replace(MENOS, '-').match(/^\s*(-?\d+)\s*(?:\/\s*(\d+))?\s*$/);
      if (!m) throw new Error(`${que || 'el coeficiente'} debe ser un número o una fracción como 1/2`);
      return F(Number(m[1]), m[2] ? Number(m[2]) : 1);
    }
    if (typeof x !== 'number' || !Number.isFinite(x)) throw new Error(`${que || 'el coeficiente'} debe ser un número`);
    for (let q = 1; q <= 1e6; q *= 10) { const p = Math.round(x * q); if (Math.abs(p / q - x) <= 1e-12 * Math.max(1, Math.abs(x))) return F(p, q); }
    throw new Error(`${que || 'el coeficiente'} debe ser exacto (entero, decimal corto o fracción)`);
  }
  const txF = a => (a.n < 0 ? MENOS : '') + (a.d === 1 ? String(Math.abs(a.n)) : `${Math.abs(a.n)}/${a.d}`);
  const num = x => fNum(aF(x));
  const textoNumero = x => txF(aF(x));

  // Lista de coeficientes → fracciones; se quitan los ceros de adelante (queda al menos [0]).
  function poli(coefs, que) {
    if (!Array.isArray(coefs) || !coefs.length) throw new Error(`${que || 'el polinomio'} debe ser una lista de coeficientes`);
    const p = coefs.map(c => aF(c, 'cada coeficiente'));
    while (p.length > 1 && p[0].n === 0) p.shift();
    return p;
  }
  const nums = p => p.map(fNum);
  const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const sup = e => String(e).split('').map(c => SUP[c]).join('');
  const potTx = (letra, e) => (e === 0 ? '' : e === 1 ? letra : letra + sup(e));
  // Un término con su signo: primero ('2x³', '−x') o siguiente (' + 2x³', ' − x').
  function terminoTx(c, e, letra, primero) {
    const neg = c.n < 0, a = fAbs(c), uno = fIgual(a, UNO);
    let cuerpo;
    if (e === 0) cuerpo = txF(a);
    else if (uno) cuerpo = potTx(letra, e);
    else cuerpo = (a.d === 1 ? txF(a) : `(${txF(a)})`) + potTx(letra, e);
    if (primero) return (neg ? MENOS : '') + cuerpo;
    return (neg ? ` ${MENOS} ` : ' + ') + cuerpo;
  }
  function textoF(p, letra) {
    letra = letra || 'x';
    const n = p.length - 1; let s = '';
    p.forEach((c, i) => { if (c.n === 0) return; s += terminoTx(c, n - i, letra, s === ''); });
    return s || '0';
  }
  const texto = (coefs, letra) => textoF(poli(coefs), letra);

  function evalF(p, x) { let r = CERO; for (const c of p) r = fSum(fMul(r, x), c); return r; }
  function conErrores(r, errores, igual) {
    r.errores = {}; r.coinciden = [];
    for (const [k, e] of Object.entries(errores)) { if (e === null) continue; if (igual(e)) r.coinciden.push(k); else r.errores[k] = e; }
    return r;
  }
  const errN = (f, id, regla) => ({ valor: fNum(f), texto: txF(f), id, regla });
  const igualValor = r => e => Math.abs(e.valor - r.valor) < 1e-12;

  // ---------- Valor numérico ----------
  function evaluar(o) {
    o = o || {};
    const p = poli(o.coefs), x = aF(o.x, 'x'), n = p.length - 1, v = evalF(p, x);
    return { valor: fNum(v), texto: txF(v), terminos: p.map((c, i) => ({ coef: fNum(c), exp: n - i, valor: fNum(fMul(c, fPot(x, n - i))) })) };
  }
  function pDeCero(o) {
    const p = poli((o || {}).coefs), v = p[p.length - 1];
    const s = p.reduce(fSum, CERO);
    return conErrores({ valor: fNum(v), texto: txF(v) }, {
      sumaCoef: errN(s, 'PO7', 'P(0) = suma de coeficientes'),
      principal: errN(p[0], 'PO19', 'P(0) = coeficiente principal'),
      cero: errN(CERO, 'PO34', 'P(0) = 0'),
    }, igualValor({ valor: fNum(v) }));
  }
  function pDeUno(o) {
    const p = poli((o || {}).coefs), s = p.reduce(fSum, CERO), abs = p.reduce((a, c) => fSum(a, fAbs(c)), CERO);
    return conErrores({ valor: fNum(s), texto: txF(s) }, {
      independiente: errN(p[p.length - 1], 'PO12', 'P(1) = término independiente'),
      principal: errN(p[0], 'PO20', 'P(1) = coeficiente principal'),
      sinSignos: errN(abs, 'PO21', 'suma los coeficientes sin sus signos'),
    }, igualValor({ valor: fNum(s) }));
  }

  // ---------- Grados ----------
  function entero(x, que, min) {
    if (!Number.isInteger(x) || x < (min === undefined ? 0 : min)) throw new Error(`${que} debe ser un entero mayor o igual que ${min === undefined ? 0 : min}`);
    return x;
  }
  const errE = (v, id, regla) => ({ valor: v, texto: String(v), id, regla });
  function grado(o) {
    o = o || {};
    if (!Array.isArray(o.terminos) || !o.terminos.length) throw new Error('terminos debe ser una lista de términos { c, x, y }');
    const T = o.terminos.map(t => {
      if (!t || aF(t.c, 'el coeficiente').n === 0) throw new Error('cada término necesita un coeficiente distinto de 0');
      return { x: entero(t.x || 0, 'el exponente de x'), y: entero(t.y || 0, 'el exponente de y') };
    });
    const g = T.map(t => t.x + t.y), GA = Math.max(...g), GRx = Math.max(...T.map(t => t.x)), GRy = Math.max(...T.map(t => t.y));
    const r = { valor: GA, texto: String(GA), GR: { x: GRx, y: GRy }, gradosTerminos: g };
    return conErrores(r, {
      relativo: errE(Math.max(GRx, GRy), 'PO10', 'toma el mayor grado relativo'),
      sumaTodos: errE(g.reduce((a, b) => a + b, 0), 'PO11', 'suma todos los exponentes del polinomio'),
      sumaRelativos: errE(GRx + GRy, 'PO28', 'suma los grados relativos'),
    }, igualValor(r));
  }
  function gradoProducto(o) {
    o = o || {}; const m = entero(o.m, 'm', 1), n = entero(o.n, 'n', 1);
    const r = { valor: m + n, texto: String(m + n) };
    return conErrores(r, { producto: errE(m * n, 'PO5', 'multiplica los grados'), mayor: errE(Math.max(m, n), 'PO23', 'se queda con el mayor') }, igualValor(r));
  }
  function gradoSuma(o) {
    o = o || {}; const m = entero(o.m, 'm', 1), n = entero(o.n, 'n', 1);
    if (m === n) throw new Error('con grados iguales los términos principales pueden anularse: usa grados distintos');
    const r = { valor: Math.max(m, n), texto: String(Math.max(m, n)) };
    return conErrores(r, { suma: errE(m + n, 'PO6', 'suma los grados'), producto: errE(m * n, 'PO5', 'multiplica los grados'), menor: errE(Math.min(m, n), 'PO22', 'se queda con el menor') }, igualValor(r));
  }
  function gradoPotencia(o) {
    o = o || {}; const m = entero(o.m, 'm', 1), k = entero(o.k, 'k', 2);
    const r = { valor: m * k, texto: String(m * k) };
    return conErrores(r, { suma: errE(m + k, 'PO13', 'suma el grado y el exponente'), potencia: errE(Math.pow(m, k), 'PO14', 'eleva el grado'), igual: errE(m, 'PO30', 'el grado no cambia') }, igualValor(r));
  }
  function completo(o) {
    const n = entero((o || {}).grado, 'el grado');
    const r = { valor: n + 1, texto: String(n + 1), exponentes: Array.from({ length: n + 1 }, (_, i) => n - i) };
    return conErrores(r, { igual: errE(n, 'PO9', 'cuenta n términos: olvida el término independiente (x⁰)') }, igualValor(r));
  }
  function gradoDeCompleto(o) {
    const t = entero((o || {}).terminos, 'el número de términos', 1);
    const r = { valor: t - 1, texto: String(t - 1) };
    return conErrores(r, { igual: errE(t, 'PO9', 'grado = número de términos'), masUno: errE(t + 1, 'PO29', 'suma 1 en vez de restarlo') }, igualValor(r));
  }

  // ---------- Ruffini ----------
  function divisorLineal(d) {
    if (!Array.isArray(d) || d.length !== 2) throw new Error('el divisor debe ser [a, b], para a·x + b');
    const a = aF(d[0], 'a'), b = aF(d[1], 'b');
    if (a.n === 0) throw new Error('el divisor a·x + b necesita a distinto de 0');
    return { a, b, raiz: fNeg(fDiv(b, a)) };
  }
  // Las tres filas con una raíz r (el p ya completo).
  function filasRuffini(p, r) {
    const productos = [null], sumas = [p[0]];
    for (let i = 1; i < p.length; i++) { const pr = fMul(r, sumas[i - 1]); productos.push(pr); sumas.push(fSum(p[i], pr)); }
    return { productos, sumas };
  }
  const igualP = (p, q) => p.length === q.length && p.every((c, i) => fIgual(c, q[i]));
  function resultado(coc, resto) {
    const c = coc.length ? coc : [CERO];
    return { cociente: nums(c), resto: fNum(resto), texto: textoF(c), restoTexto: txF(resto), par: `Q = ${textoF(c)}; R = ${txF(resto)}`, _c: c, _r: resto };
  }
  function ruffini(o) {
    o = o || {};
    const p = poli(o.coefs, 'el dividendo');
    if (p.length < 2) throw new Error('el dividendo debe ser de grado 1 o más');
    const { a, raiz } = divisorLineal(o.divisor);
    const F3 = filasRuffini(p, raiz), prov = F3.sumas.slice(0, -1), resto = F3.sumas[F3.sumas.length - 1];
    const coc = prov.map(c => fDiv(c, a));
    const R = Object.assign(resultado(coc, resto), {
      raiz: fNum(raiz), raizTexto: txF(raiz), arriba: nums(p), productos: F3.productos.map(x => (x === null ? null : fNum(x))),
      sumas: nums(F3.sumas), cocienteProvisional: nums(prov),
    });
    const conErr = (res, id, regla) => Object.assign(res, { id, regla });
    // PO1: sin los ceros (se divide otro polinomio, más corto)
    const sinCeros = p.filter((c, i) => i === 0 || c.n !== 0);
    let sinCero = null;
    if (sinCeros.length !== p.length && sinCeros.length >= 2) {
      const G = filasRuffini(sinCeros, raiz);
      sinCero = conErr(resultado(G.sumas.slice(0, -1).map(c => fDiv(c, a)), G.sumas[G.sumas.length - 1]), 'PO1', 'no pone el 0 del término que falta');
    }
    const S = filasRuffini(p, fNeg(raiz));
    const signo = conErr(resultado(S.sumas.slice(0, -1).map(c => fDiv(c, a)), S.sumas[S.sumas.length - 1]), 'PO2', 'baja la raíz con el signo del divisor');
    const aUno = fIgual(a, UNO);
    const errores = {
      sinCero, signo,
      sinDividir: aUno ? null : conErr(resultado(prov, resto), 'PO3', 'no divide el cociente entre a'),
      restoDividido: aUno ? null : conErr(resultado(coc, fDiv(resto, a)), 'PO4', 'divide también el resto entre a'),
      todaLaFila: conErr(resultado(F3.sumas.map(c => fDiv(c, a)), CERO), 'PO18', 'toma toda la última fila como cociente'),
    };
    conErrores(R, errores, e => igualP(e._c, R._c) && fIgual(e._r, R._r));
    limpiar(R); for (const e of Object.values(R.errores)) limpiar(e);
    return R;
  }
  function limpiar(r) { delete r._c; delete r._r; return r; }

  // ---------- División clásica ----------
  function dividirF(D, d) {
    if (d.length < 2) throw new Error('el divisor debe ser de grado 1 o más');
    let resto = D.slice(); const nq = Math.max(0, D.length - d.length + 1), q = Array.from({ length: nq }, () => CERO), pasos = [];
    for (let i = 0; i < nq; i++) {
      const c = fDiv(resto[i], d[0]), e = D.length - d.length - i;
      q[i] = c;
      const resta = d.map(x => fMul(x, c));
      for (let j = 0; j < d.length; j++) resto[i + j] = fRes(resto[i + j], resta[j]);
      pasos.push({ termino: { coef: fNum(c), exp: e }, resta: nums(resta), queda: nums(recortar(resto.slice(i + 1))) });
    }
    const r = recortar(resto.slice(Math.max(nq, D.length - d.length + 1)));
    return { q: q.length ? q : [CERO], r, pasos };
  }
  function recortar(p) { const s = p.slice(); while (s.length > 1 && s[0].n === 0) s.shift(); return s.length ? s : [CERO]; }
  function dividir(o) {
    o = o || {};
    const D = poli(o.dividendo, 'el dividendo'), d = poli(o.divisor, 'el divisor');
    const { q, r, pasos } = dividirF(D, d);
    return { cociente: nums(q), resto: nums(r), texto: textoF(q), restoTexto: textoF(r), exacta: r.every(c => c.n === 0), pasos };
  }
  function mulF(p, q) {
    const r = Array.from({ length: p.length + q.length - 1 }, () => CERO);
    p.forEach((a, i) => q.forEach((b, j) => { r[i + j] = fSum(r[i + j], fMul(a, b)); }));
    return r;
  }
  function sumF(p, q) {
    const n = Math.max(p.length, q.length), P = Array(n - p.length).fill(CERO).concat(p), Q = Array(n - q.length).fill(CERO).concat(q);
    return recortar(P.map((c, i) => fSum(c, Q[i])));
  }
  function cajaDivision(o) {
    o = o || {};
    const D = poli(o.dividendo, 'el dividendo'), d = poli(o.divisor, 'el divisor');
    const { q, r } = dividirF(D, d);
    const terms = p => p.map((c, i) => ({ c, e: p.length - 1 - i })).filter(t => t.c.n !== 0);
    const T = t => ({ coef: fNum(t.c), exp: t.e, texto: terminoTx(t.c, t.e, 'x', true) });
    const filas = terms(q), cols = terms(d);
    return { filas: filas.map(T), columnas: cols.map(T),
      celdas: filas.map(f => cols.map(c => T({ c: fMul(f.c, c.c), e: f.e + c.e }))),
      resto: nums(r), restoTexto: textoF(r), comprobacion: nums(sumF(mulF(d, q), r)) };
  }

  // ---------- Teorema del resto ----------
  // x² + k: cada xⁿ = (x²)^⌊n/2⌋ · x^(n mod 2) pasa a (−k)^⌊n/2⌋ · x^(n mod 2).
  function sustituir(p, regla) {
    const n = p.length - 1; let a = CERO, b = CERO;   // a·x + b
    p.forEach((c, i) => { const e = n - i, [f, x1] = regla(e); const t = fMul(c, f); if (x1) a = fSum(a, t); else b = fSum(b, t); });
    return [a, b];
  }
  function restoSustitucion(o) {
    o = o || {};
    const D = poli(o.dividendo, 'el dividendo'), k = aF(o.k, 'k');
    if (k.n === 0) throw new Error('k no puede ser 0: x² no es de la forma x² + k con k ≠ 0');
    const mk = fNeg(k);
    const bien = sustituir(D, e => [fPot(mk, Math.floor(e / 2)), e % 2 === 1]);
    const { q, r } = dividirF(D, [UNO, CERO, k]);
    const rr = r.length === 1 ? [CERO, r[0]] : r;
    if (!fIgual(rr[0], bien[0]) || !fIgual(rr[1], bien[1])) throw new Error('error interno: la sustitución no coincide con la división');
    const tx2 = ab => textoF(recortar(ab));
    const R = { resto: nums(bien), texto: tx2(bien), cociente: nums(q) };
    const e = (ab, id, regla) => ({ resto: nums(ab), texto: tx2(ab), id, regla });
    return conErrores(R, {
      signo: e(sustituir(D, x => [fPot(k, Math.floor(x / 2)), x % 2 === 1]), 'PO16', 'cambia x² por k en vez de −k'),
      unaVez: e(sustituir(D, x => [x >= 2 ? mk : UNO, x >= 2 ? x % 2 === 1 : x === 1]), 'PO31', 'sustituye una sola vez: xⁿ → −k · x^(n mod 2)'),
      pierdeX: e(sustituir(D, x => [fPot(mk, Math.floor(x / 2)), x === 1]), 'PO32', 'se pierde la x que sobra en las potencias impares'),
    }, x => x.texto === R.texto);
  }
  function teoremaResto(o) {
    o = o || {};
    const p = poli(o.coefs, 'el dividendo'), { raiz } = divisorLineal(o.divisor), v = evalF(p, raiz), n = p.length - 1;
    // PO15: (−r)ⁿ con n par sale negativo (se lee −rⁿ)
    let par = CERO;
    p.forEach((c, i) => { const e = n - i; let pw = fPot(raiz, e); if (raiz.n < 0 && e > 0 && e % 2 === 0) pw = fNeg(pw); par = fSum(par, fMul(c, pw)); });
    const r = { valor: fNum(v), texto: txF(v), raiz: fNum(raiz), raizTexto: txF(raiz) };
    return conErrores(r, {
      signo: errN(evalF(p, fNeg(raiz)), 'PO8', 'evalúa con el signo del divisor'),
      parNegativo: raiz.n < 0 ? errN(par, 'PO15', 'una potencia par de un negativo sale negativa') : null,
      independiente: errN(p[n], 'PO27', 'el resto es el término independiente'),
    }, igualValor(r));
  }
  function factorK(o) {
    o = o || {};
    if (!Array.isArray(o.coefs)) throw new Error('coefs debe ser una lista con un coeficiente k');
    const pos = o.coefs.indexOf('k');
    if (pos < 0 || o.coefs.lastIndexOf('k') !== pos) throw new Error("coefs debe tener exactamente un coeficiente 'k'");
    const con = v => o.coefs.map(c => (c === 'k' ? v : aF(c)));
    const r0 = aF(o.raiz, 'la raíz');
    // P(x) = A(x) + k·xᵉ: P(r) = A(r) + k·rᵉ
    const resolver = x => { const A = evalF(con(CERO), x), B = fPot(x, o.coefs.length - 1 - pos); if (B.n === 0) return null; return fNeg(fDiv(A, B)); };
    const k = resolver(r0);
    if (k === null) throw new Error('con esa raíz, k no aparece en P(raiz)');
    const tk = f => `k = ${txF(f)}`;
    const { q } = dividirF(con(k), [UNO, fNeg(r0)]);
    const R = { valor: fNum(k), texto: tk(k), cociente: nums(q) };
    const e = (f, id, regla) => (f === null ? null : { valor: fNum(f), texto: tk(f), id, regla });
    return conErrores(R, {
      signo: e(resolver(fNeg(r0)), 'PO17', 'usa P(−r) = 0: el factor con el signo cambiado'),
      sumaCoef: e(resolver(UNO), 'PO33', 'iguala a 0 la suma de coeficientes, P(1)'),
      despeje: e(fNeg(k), 'AL16', 'despeja k con el signo cambiado'),
    }, igualValor(R));
  }
  function divisores(n) { n = Math.abs(n); const d = []; for (let i = 1; i <= n; i++) if (n % i === 0) d.push(i); return d; }
  function raicesRacionales(o) {
    const p = poli((o || {}).coefs);
    if (!p.every(c => c.d === 1)) throw new Error('los coeficientes deben ser enteros');
    const an = p[0].n, a0 = p[p.length - 1].n;
    if (a0 === 0 || p.length < 2) throw new Error('el término independiente debe ser distinto de 0');
    const P = divisores(a0), Q = divisores(an), vistos = new Map();
    for (const a of P) for (const b of Q) for (const s of [1, -1]) { const f = F(s * a, b); vistos.set(txF(f), f); }
    const cand = [...vistos.values()].sort((x, y) => fNum(x) - fNum(y));
    const r = { valor: cand.length, texto: String(cand.length), candidatos: cand.map(fNum), candidatosTexto: cand.map(txF),
      raices: cand.filter(c => evalF(p, c).n === 0).map(fNum) };
    return conErrores(r, {
      soloPositivos: errE(cand.length / 2, 'PO24', 'solo los candidatos positivos'),
      soloIndependiente: errE(2 * P.length, 'PO25', 'solo ± divisores del término independiente'),
      sinSimplificar: errE(2 * P.length * Q.length, 'PO26', 'cuenta p/q sin simplificar (2/2, 6/2…)'),
    }, igualValor(r));
  }
  function sumar(o) {
    o = o || {};
    const r = sumF(poli(o.p, 'p'), poli(o.q, 'q'));
    return { coefs: nums(r), texto: textoF(r), grado: r.length === 1 && r[0].n === 0 ? null : r.length - 1 };
  }
  function curva(o) {
    o = o || {};
    const p = nums(poli(o.coefs)), a = Number(o.desde), b = Number(o.hasta), n = o.n === undefined ? 200 : o.n;
    if (!(b > a)) throw new Error('hasta debe ser mayor que desde');
    const pts = [];
    for (let i = 0; i <= n; i++) { const x = a + (b - a) * i / n; let y = 0; for (const c of p) y = y * x + c; pts.push([x, y]); }
    return { pts };
  }

  return { texto, evaluar, pDeCero, pDeUno, grado, gradoProducto, gradoSuma, gradoPotencia, completo, gradoDeCompleto,
    ruffini, dividir, cajaDivision, restoSustitucion, teoremaResto, factorK, raicesRacionales, sumar, curva, num, textoNumero };
});
