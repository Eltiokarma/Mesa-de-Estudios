/*
 * Generador: máximos, mínimos y rangos de expresiones trigonométricas; senoides con parámetros y
 * áreas en la circunferencia trigonométrica. Formato "predicciones" (docs/arquitectura.md).
 * Funciona en el navegador (window.Generadores['trig-extremos']) y en Node (require).
 *
 * Convenciones de _datos (para recalcular sin leer el código): ángulos en GRADOS; intervalos
 * cerrados [desde; hasta] salvo que se diga otra cosa. pide: 'max', 'min', 'diferencia'
 * (máximo − mínimo), 'rango' (intervalo), 'hora' (primer instante del máximo), 'valor'.
 *
 * Tipos:
 *   asenbcos     sub 'directa': y = a·sen x + b·cos x + c, x real. Campos a, b, c, pide.
 *                sub 'doble': y = 2A·sen x·cos x + 2B·cos² x + d, x real. Campos A, B, d, pide.
 *   cuadratica   sub 'seno': y = A·sen² x + B·sen x + C; sub 'coseno-doble': y = k·cos 2x + B·sen x + C.
 *                Dominio: x real (desde = null) o desde ≤ x ≤ hasta (grados). Campos sub, A (o k),
 *                B, C, desde, hasta, pide ('max', 'min' o 'diferencia').
 *                sub 'hora': temperatura T(t) = C + B·sen(πt/12) + k·cos(πt/6), 0 ≤ t < 24 (horas);
 *                pide 'hora' (primer t del máximo) o 'max' (temperatura máxima).
 *   racional     sub 'mobius': y = (a·cos x + b)/(cos x + d), x real; campos a, b, d, pide ('max',
 *                'min' o 'suma' = máximo + mínimo). sub 'simplifica': y = m·sen² x/(1 + s·cos x) + n,
 *                s = ±1, x real con el denominador distinto de cero; campos m, s, n; pide 'rango'
 *                (la respuesta es un intervalo; su clave es 'int:lo:hi:cerradoIzq:cerradoDer').
 *   secante      intervalo desde ≤ x ≤ hasta (grados) donde la secante existe. sub 'max-f': máximo (o
 *                mínimo, campo pide) de f(x) = a·sec x + b. sub 'otra': valor de g(x) = p·cos x +
 *                q·tan² x en el punto del intervalo donde sec x es máxima. Campos sub, a, b o p, q,
 *                desde, hasta, pide.
 *   senoide      precio P(t) = a + b·cos(πt/L) (t en meses, L = semiperiodo). Datos: P0 = P(0) y, según
 *                dato2, Pmin = P(L) ('min') o Pmedio = P(L/2) ('medio'). Se pide el instante t > 0
 *                (pide 'primera' o 'segunda') en que P(t) = V. Campos L, P0, dato2, P2, V, pide.
 *   area-ct      circunferencia trigonométrica de centro O(0; 0) y radio 1; A(1; 0), B(0; 1),
 *                A'(−1; 0), B'(0; −1); P = (cos θ; sen θ) es el extremo del arco θ, en el cuadrante
 *                del campo cuadrante; Q = (cos θ; 0); T = (1; tan θ) (donde la recta OP corta a la
 *                tangente por A). Se pide el área del triángulo de vértices del campo vertices
 *                (por ejemplo ['O', 'A', 'P']) en función de θ. La clave es
 *                'area:c0|cs|cc|csc|ct' con fracciones n/d: c0 + cs·sen θ + cc·cos θ + csc·sen θ·cos θ + ct·tan θ.
 *   puerta       techo y(x) = d + 2A·cos²(πx/(2L)) (metros), −L ≤ x ≤ L; puerta rectangular centrada
 *                en x = 0, apoyada en el piso y = 0, de altura h, cuyas esquinas de arriba tocan el
 *                techo. Se pide su área (m²). Campos d, A, L, h.
 *
 * Errores: TR16 (a + b como máximo: parcial), TR12 (signo por cuadrante: parcial), TR11 (cruza seno y
 * coseno: parcial), TR18, TR19 y TR22 (hipótesis del informe
 * docs/investigacion/trigonometria-ideas-erroneas.md). Los TX-* son hipótesis nuestras.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'trig-extremos';
  const INF = 'docs/investigacion/trigonometria-ideas-erroneas.md';
  const h = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente: null });
  const hi = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente: INF });
  const pa = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'parcial', fuente: INF });
  const v = P.v;
  const f = x => P.formatear(x, 2);
  const GR = Math.PI / 180;

  // Fracción como la escribe la academia: «9/8», «−3/2», «5». Si no sale limpia, null.
  function fracTxt(x) {
    if (!Number.isFinite(x)) return null;
    for (let d = 1; d <= 64; d++) { const n = Math.round(x * d); if (Math.abs(x * d - n) < 1e-9) return P.textoFraccion(P.frac(n, d)); }
    return null;
  }
  const limpia = x => fracTxt(x) !== null;
  const sen = g => Math.round(Math.sin(g * GR) * 1e12) / 1e12;
  const cos = g => Math.round(Math.cos(g * GR) * 1e12) / 1e12;
  const rad = g => P.pi(g * GR, '', 12);
  const intervaloRad = (a, b) => `[${rad(a)}; ${rad(b)}]`;
  const conSigno = (x, primero = false) => (primero ? (x < 0 ? '−' : '') + fracTxt(Math.abs(x)) : (x < 0 ? ' − ' : ' + ') + fracTxt(Math.abs(x)));
  function poli(terms) {
    let t = '';
    for (const [c, s] of terms) {
      if (!c) continue;
      const abs = Math.abs(c), cuerpo = s ? (abs === 1 ? s : `${fracTxt(abs)}${s.startsWith('(') ? '' : ' '}${s}`) : fracTxt(abs);
      t += t === '' ? (c < 0 ? '−' : '') + cuerpo : (c < 0 ? ' − ' : ' + ') + cuerpo;
    }
    return t || '0';
  }

  // Término que no va primero: «+ 4 cos x», «− cos x».
  const termino = (c, s) => `${c < 0 ? '−' : '+'} ${Math.abs(c) === 1 ? '' : fracTxt(Math.abs(c)) + ' '}${s}`;

  function cerrar(rng, semilla, o) {
    let alternativas;
    if (o.claves) alternativas = P.armarTexto({ correcta: o.correcta, errores: o.errores, rng });
    else {
      const texto = o.texto || (x => { const t = fracTxt(x); return t === null ? null : t + (o.unidad ? ' ' + o.unidad : ''); });
      const entero = x => Math.abs(x - Math.round(x)) < 1e-9;
      let errores = o.errores.filter(e => Number.isFinite(e.valor) && texto(e.valor) !== null);
      if (entero(o.correcta)) errores = errores.filter(e => entero(e.valor));
      alternativas = P.armar({ correcta: o.correcta, errores, rng, texto, negativos: true });
    }
    const usadas = new Set([...o.enunciado, ...o.pregunta, ...o.solucion.flat()].filter(x => x && x.v).map(x => x.v));
    const variables = Object.fromEntries(Object.entries(o.variables).filter(([k]) => usadas.has(k)));
    return {
      id: `${ID}#${semilla}`, variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion,
      respuesta: { valor: o.claves ? o.correcta.clave : o.correcta, unidad: o.unidad || '' }, _datos: o.datos,
    };
  }

  const TIPOS = ['asenbcos', 'asenbcos-doble', 'cuadratica-seno', 'cuadratica-coseno', 'cuadratica-hora', 'racional', 'simplifica', 'secante', 'senoide', 'area-ct', 'puerta'];
  function generar(semilla) {
    const rng = Azar.crear(`${ID}|` + semilla);
    const tipo = rng.elegir(TIPOS);
    for (let intento = 0; intento < 400; intento++) {
      const pr = construir(rng, semilla, tipo);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }
  function construir(rng, semilla, tipo) {
    return {
      asenbcos: asenbcos, 'asenbcos-doble': doble, 'cuadratica-seno': (r, s) => cuadratica(r, s, 'seno'), 'cuadratica-coseno': (r, s) => cuadratica(r, s, 'coseno-doble'), 'cuadratica-hora': cuadHora, racional, simplifica,
      secante, senoide, 'area-ct': areaCT, puerta,
    }[tipo](rng, semilla);
  }
  const PREG = { max: '¿Cuál es su valor máximo?', min: '¿Cuál es su valor mínimo?', diferencia: '¿Cuánto vale la diferencia entre su máximo y su mínimo?', suma: '¿Cuánto vale la suma de su máximo y su mínimo?' };

  // ---------- a sen x + b cos x + c ----------
  const TRIPLES = [[3, 4], [4, 3], [5, 12], [12, 5], [6, 8], [8, 6], [8, 15], [7, 24], [9, 12]];
  function errAB(pide, a, b, c, R) {
    const S = Math.abs(a) + Math.abs(b);
    const pick = (M, m) => (pide === 'max' ? M : pide === 'min' ? m : M - m);
    return [
      hi('TR16-suma-de-coeficientes', pick(c + S, c - S), `Tomaste ${pide === 'min' ? '−' : ''}(${Math.abs(a)} + ${Math.abs(b)}) como si sen x y cos x llegaran a su tope en el mismo ángulo. No pasa: el máximo de a·sen x + b·cos x es √(a² + b²).`),
      h('TX-sin-raiz', pick(c + a * a + b * b, c - a * a - b * b), 'Usaste a² + b² sin sacar la raíz. La amplitud es √(a² + b²).'),
      h('TX-rango-del-seno', pick(c + 1, c - 1), 'Usaste que sen x y cos x están entre −1 y 1 como si la expresión entera también lo estuviera. Los coeficientes estiran el rango.'),
      h('TX-sin-constante', pick(R, -R), `Olvidaste sumar la constante ${f(c)} al final.`),
    ];
  }
  function asenbcos(rng, semilla) {
    let [a, b] = rng.elegir(TRIPLES);
    if (rng.moneda()) a = -a; if (rng.moneda()) b = -b;
    const c = rng.entero(-4, 9), R = Math.hypot(a, b);
    const pide = rng.elegir(['max', 'min', 'diferencia']);
    const correcta = pide === 'max' ? c + R : pide === 'min' ? c - R : 2 * R;
    const errores = errAB(pide, a, b, c, R);
    if (pide === 'diferencia') errores.push(h('TX-diferencia-es-amplitud', R, 'Esa es la amplitud. La diferencia entre máximo y mínimo es el doble de la amplitud.'));
    const variables = { a: { nombre: 'coeficiente del seno', color: 'o' }, b: { nombre: 'coeficiente del coseno', color: 'i' }, R: { nombre: 'amplitud', color: 'h' }, y: { nombre: 'valor pedido', color: 'd' } };
    const enunciado = ['Sea y = ', v('a', poli([[a, 'sen x']])), ' ', v('b', termino(b, 'cos x')), c ? conSigno(c) : '', ', con x real.'];
    const solucion = [
      ['Una suma a·sen x + b·cos x varía entre −√(a² + b²) y √(a² + b²).'],
      [v('R', `√(${a < 0 ? `(${f(a)})` : a}² + ${b < 0 ? `(${f(b)})` : b}²)`), ` = √${a * a + b * b} = `, v('R', f(R)), '.'],
      [`Entonces y va de ${f(c)} − ${f(R)} = ${f(c - R)} a ${f(c)} + ${f(R)} = ${f(c + R)}.`],
      [{ max: 'El máximo es ', min: 'El mínimo es ', diferencia: 'La diferencia es ' }[pide], v('y', f(correcta)), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, variables, enunciado, pregunta: [PREG[pide]], solucion,
      datos: { tipo: 'asenbcos', sub: 'directa', a, b, c, pide } });
  }
  // 2A sen x cos x + 2B cos² x + d = A sen 2x + B cos 2x + (B + d)
  function doble(rng, semilla) {
    let [A, B] = rng.elegir(TRIPLES.filter(([p, q]) => p <= 12 && q <= 12));
    if (rng.moneda()) A = -A; if (rng.moneda()) B = -B;
    const d = rng.entero(-6, 6), R = Math.hypot(A, B), c = B + d;
    const pide = rng.elegir(['max', 'min', 'diferencia']);
    const pick = (M, m) => (pide === 'max' ? M : pide === 'min' ? m : M - m);
    const correcta = pick(c + R, c - R);
    const errores = [
      ...errAB(pide, A, B, c, R).slice(0, 1),
      h('TX-olvida-constante-al-degradar', pick(d + R, d - R), `Al degradar, ${f(2 * B)} cos² x = ${f(B)}(1 + cos 2x) deja un ${f(B)} suelto que olvidaste: la constante es ${f(B)} ${d < 0 ? '−' : '+'} ${f(Math.abs(d))} = ${f(c)}.`),
      h('TX-coeficientes-sin-mitad', pick(c + 2 * R, c - 2 * R), `Usaste ${f(2 * A)} y ${f(2 * B)} como coeficientes de sen 2x y cos 2x. Al usar 2 sen x cos x = sen 2x y 2 cos² x = 1 + cos 2x, quedan ${f(A)} y ${f(B)}.`),
      h('TX-sin-constante', pick(R, -R), `Olvidaste sumar la constante ${f(c)} al final.`),
    ];
    const variables = { A: { nombre: 'coeficiente de sen 2x', color: 'o' }, B: { nombre: 'coeficiente de cos 2x', color: 'i' }, R: { nombre: 'amplitud', color: 'h' }, y: { nombre: 'valor pedido', color: 'd' } };
    const enunciado = ['Sea y = ', poli([[2 * A, 'sen x · cos x'], [2 * B, 'cos² x'], [d, '']]), ', con x real.'];
    const solucion = [
      ['Usa 2 sen x cos x = sen 2x y 2 cos² x = 1 + cos 2x: y = ', v('A', poli([[A, 'sen 2x']])), ' ', v('B', termino(B, 'cos 2x')), conSigno(c), '.'],
      [v('R', `√(${f(A * A)} + ${f(B * B)}) = ${f(R)}`), ': la parte con 2x va de ', `${f(-R)} a ${f(R)}`, '.'],
      [`Entonces y va de ${f(c - R)} a ${f(c + R)}.`],
      [{ max: 'El máximo es ', min: 'El mínimo es ', diferencia: 'La diferencia es ' }[pide], v('y', f(correcta)), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, variables, enunciado, pregunta: [PREG[pide]], solucion,
      datos: { tipo: 'asenbcos', sub: 'doble', A, B, d, pide } });
  }

  // ---------- cuadrática en seno ----------
  const DOMINIOS = [null, null, [0, 90], [30, 150], [0, 30], [30, 210], [-30, 30], [150, 330], [210, 330], [0, 180], [90, 210]];
  // Rango de sen x en [α; β] (grados).
  function rangoSeno(dom) {
    if (!dom) return [-1, 1];
    const [a, b] = dom, vals = [sen(a), sen(b)];
    for (let k = -2; k <= 2; k++) { if (90 + 360 * k >= a && 90 + 360 * k <= b) vals.push(1); if (270 + 360 * k >= a && 270 + 360 * k <= b) vals.push(-1); }
    return [Math.min(...vals), Math.max(...vals)];
  }
  // Extremos de q(s) = A s² + B s + C en [s1; s2].
  function extremosCuad(A, B, C, s1, s2, conVertice = true) {
    const q = s => A * s * s + B * s + C;
    const pts = [s1, s2];
    const sv = -B / (2 * A);
    if (conVertice && sv > s1 && sv < s2) pts.push(sv);
    const vals = pts.map(q);
    return { max: Math.max(...vals), min: Math.min(...vals), sv };
  }
  function cuadratica(rng, semilla, sub) {
    const dom = rng.elegir(DOMINIOS);
    const pide = rng.elegir(['max', 'min', 'diferencia']);
    let A, B, C, k = null, expr;
    if (sub === 'seno') {
      A = rng.elegir([1, 2, -1, -2]); const sv = rng.elegir([0.5, -0.5, 0.25, -0.25, 1, -1, 1.5]); B = -2 * A * sv; C = rng.entero(-3, 4);
      if (!Number.isInteger(B) || B === 0) return null;
      expr = poli([[A, 'sen² x'], [B, 'sen x'], [C, '']]);
    } else {
      k = rng.elegir([1, 2, -1]); A = -2 * k; const sv = rng.elegir([0.5, -0.5, 0.25, -0.25, 1]); B = -2 * A * sv; C = rng.entero(-3, 4);
      if (!Number.isInteger(B) || B === 0) return null;
      expr = poli([[k, 'cos 2x'], [B, 'sen x'], [C, '']]);
    }
    const Ct = sub === 'seno' ? C : C + k; // término independiente en sen x
    const [s1, s2] = rangoSeno(dom);
    const E = extremosCuad(A, B, Ct, s1, s2);
    const pick = e => (pide === 'max' ? e.max : pide === 'min' ? e.min : e.max - e.min);
    const correcta = pick(E);
    const errores = [];
    if (dom) errores.push(h('TX-rango-completo', pick(extremosCuad(A, B, Ct, -1, 1)), `Usaste −1 ≤ sen x ≤ 1, pero x está restringido: en ese intervalo sen x solo va de ${fracTxt(s1)} a ${fracTxt(s2)}.`));
    errores.push(h('TX-sin-vertice', pick(extremosCuad(A, B, Ct, s1, s2, false)), 'Evaluaste solo en los extremos de sen x. La parábola puede tener su vértice adentro, y ahí está el máximo o el mínimo.'));
    const q = s => A * s * s + B * s + Ct;
    if (pide !== 'diferencia') {
      errores.push(h('TX-vertice-siempre', q(E.sv), 'Tomaste el vértice como respuesta sin mirar si la parábola abre hacia arriba o hacia abajo (ni si el vértice cae en el rango de sen x).'));
      errores.push(h('TX-intercambia-extremos', pide === 'max' ? E.min : E.max, `Ese es el ${pide === 'max' ? 'mínimo' : 'máximo'}: compara todos los valores candidatos antes de elegir.`));
    } else errores.push(h('TX-diferencia-es-suma', E.max + E.min, 'Sumaste el máximo y el mínimo en vez de restarlos.'));
    if (sub === 'coseno-doble') {
      // cos 2x = 1 − sen² x (falta el 2)
      const Am = -k, Cm = C + k;
      errores.push(h('TX-coseno-doble-sin-2', pick(extremosCuad(Am, B, Cm, s1, s2)), 'Usaste cos 2x = 1 − sen² x. La identidad es cos 2x = 1 − 2 sen² x.'));
    }
    const variables = { s: { nombre: 'sen x', color: 'i' }, q: { nombre: 'expresión en s', color: 'o' }, y: { nombre: 'valor pedido', color: 'd' } };
    const domTxt = dom ? `x ∈ ${intervaloRad(dom[0], dom[1])}` : 'x real';
    const enunciado = ['Sea y = ', expr, `, con ${domTxt}.`];
    const sv = E.sv;
    const solucion = [
      ...(sub === 'coseno-doble' ? [[`Con cos 2x = 1 − 2 sen² x: y = ${poli([[A, 'sen² x'], [B, 'sen x'], [Ct, '']])}.`]] : []),
      ['Llama ', v('s', 's = sen x'), '. ', dom ? `En ${intervaloRad(dom[0], dom[1])}, ` : '', v('s', `${fracTxt(s1)} ≤ s ≤ ${fracTxt(s2)}`), '.'],
      ['Completa cuadrados: ', v('q', `y = ${A === 1 ? '' : A === -1 ? '−' : fracTxt(A)}${sv === 0 ? 's²' : `(s ${sv < 0 ? '+' : '−'} ${fracTxt(Math.abs(sv))})²`}${q(sv) ? " " + conSigno(q(sv)).trim() : ""}`), `; el vértice está en s = ${fracTxt(sv)}${sv > s1 && sv < s2 ? ', dentro del rango' : ', fuera del rango de s'}.`],
      [`Valores: en s = ${fracTxt(s1)}, y = ${fracTxt(q(s1))}; en s = ${fracTxt(s2)}, y = ${fracTxt(q(s2))}${sv > s1 && sv < s2 ? `; en el vértice, y = ${fracTxt(q(sv))}` : ''}.`],
      [{ max: 'El máximo es ', min: 'El mínimo es ', diferencia: `Máximo ${fracTxt(E.max)} y mínimo ${fracTxt(E.min)}: la diferencia es ` }[pide], v('y', fracTxt(correcta)), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, variables, enunciado, pregunta: [PREG[pide]], solucion,
      datos: { tipo: 'cuadratica', sub, A: sub === 'seno' ? A : null, k, B, C, desde: dom ? dom[0] : null, hasta: dom ? dom[1] : null, pide } });
  }
  // Temperatura T = C + B·base(u) + K·cos 2u, u = πt/per (per = 12: un día; per = 6: 12 horas).
  // base sen: K = kk > 0 y cos 2u = 1 − 2 sen² u; base cos: K = −kk y cos 2u = 2 cos² u − 1. En los dos
  // casos T = C + kk + B·s − 2kk·s², con s = base(u): vértice en s = B/(4kk) = ±1/2.
  function cuadHora(rng, semilla) {
    const base = rng.elegir(['sen', 'cos']), per = rng.elegir([12, 12, 6]), ini = per === 12 && rng.moneda() ? 6 : 0;
    const kk = rng.elegir([1, 2, 3]), sv = rng.elegir([0.5, -0.5]), B = 4 * kk * sv, C = rng.entero(14, 22);
    const K = base === 'sen' ? kk : -kk;
    const pide = rng.elegir(['hora', 'hora', 'max']);
    const T = s => C + kk + B * s - 2 * kk * s * s;
    const Tmax = T(sv);
    const angulos = val => (base === 'sen' ? (val > 0 ? [30, 150] : [210, 330]) : (val > 0 ? [60, 300] : [120, 240]));
    const aT = u => u * per / 180, reloj = t => (ini + t) % 24;
    const us = angulos(sv), ts = us.map(aT);
    const correcta = pide === 'hora' ? reloj(ts[0]) : Tmax;
    const u1 = `πt/${per}`, u2 = per === 12 ? 'πt/6' : 'πt/3';
    const tope = base === 'sen' ? (B > 0 ? 90 : 270) : (B > 0 ? 0 : 180);
    const topeDoble = K > 0 ? 0 : 90;
    const errores = pide === 'hora' ? [
      h('TX-maximo-donde-la-base-es-1', reloj(aT(tope)), `Pusiste el máximo donde ${base}(${u1}) vale ${B > 0 ? '1' : '−1'}. Con el término en cos(${u2}), la temperatura es una parábola en ${base}(${u1}): su vértice no está en el tope.`),
      hi('TR22-segunda-vez', reloj(ts[1]), 'Esa es la segunda vez que llega al máximo; piden la primera.'),
      h('TX-signo-del-vertice', reloj(aT(angulos(-sv)[0])), `Tomaste ${base}(${u1}) = ${fracTxt(-sv)}: el vértice está en ${fracTxt(sv)}, con su signo.`),
      h('TX-maximo-del-termino-doble', reloj(aT(topeDoble)), `Pusiste el máximo donde el término ${K === 1 ? '' : K === -1 ? '−' : fracTxt(K) + ' '}cos(${u2}) es máximo (t = ${f(aT(topeDoble))}). Los dos términos no llegan a su tope a la misma hora: hay que escribirlos con una sola variable.`),
      ...(ini ? [h('TX-sin-sumar-hora-inicial', ts[0], `Ese es el valor de t, pero t se cuenta desde las ${ini}:00: la hora del reloj es ${ini} + t.`)] : []),
    ] : [
      h('TX-suma-de-maximos', C + Math.abs(B) + kk, `Sumaste el máximo de cada término (${f(Math.abs(B))} y ${f(kk)}). No ocurren a la misma hora.`),
      h('TX-maximo-donde-la-base-es-1', T(Math.sign(B)), `Evaluaste donde ${base}(${u1}) = ${B > 0 ? '1' : '−1'}. El máximo está en el vértice, ${fracTxt(sv)}.`),
      h('TX-coseno-doble-sin-2', C + kk + B * sv - kk * sv * sv, base === 'sen' ? 'Usaste cos 2u = 1 − sen² u. Es cos 2u = 1 − 2 sen² u.' : 'Usaste cos 2u = cos² u − 1. Es cos 2u = 2 cos² u − 1.'),
      h('TX-sin-constante-del-coseno', Tmax - kk, `Olvidaste la constante que sale de ${K === 1 ? '' : K === -1 ? '−' : fracTxt(K) + ' '}cos(${u2}) = ${base === 'sen' ? `${kk === 1 ? "" : fracTxt(kk)}(1 − 2 sen²(${u1}))` : `−${kk === 1 ? "" : fracTxt(kk)}(2 cos²(${u1}) − 1)`}.`),
    ];
    const variables = { s: { nombre: `${base}(${u1})`, color: 'i' }, T: { nombre: 'temperatura máxima', color: 'o' }, t: { nombre: 'hora del máximo', color: 'd' } };
    const desde = ini ? `t horas después de las ${ini}:00 de la mañana` : per === 12 ? 't horas después de la medianoche' : 't horas después de encender el equipo';
    const enunciado = [`La temperatura (en °C) de una sala de servidores, ${desde}, es T(t) = `, poli([[C, ''], [B, `${base}(${u1})`], [K, `cos(${u2})`]]), `, con 0 ≤ t < ${2 * per}.`];
    const pregunta = [pide === 'hora' ? (ini ? '¿A qué hora del reloj (de 0 a 24 h) llega por primera vez a su temperatura máxima?' : '¿Para qué valor de t llega por primera vez a su temperatura máxima?') : '¿Cuál es la temperatura máxima en ese tiempo?'];
    const ident = base === 'sen' ? 'cos 2u = 1 − 2 sen² u' : 'cos 2u = 2 cos² u − 1';
    const solucion = [
      [`Con u = ${u1}, cos(${u2}) = ${ident}. Llama `, v('s', `s = ${base} u`), '.'],
      [`T = ${poli([[C + kk, ''], [B, 's'], [-2 * kk, 's²']])} = ${poli([[-2 * kk, '']])}(s ${sv < 0 ? '+' : '−'} 1/2)² ${conSigno(Tmax).trim()}.`],
      ['El máximo está en ', v('s', `s = ${fracTxt(sv)}`), ' y vale ', v('T', `${fracTxt(Tmax)} °C`), '.'],
      [`${base} u = ${fracTxt(sv)} con 0° ≤ u < 360°: u = ${us[0]}° o ${us[1]}°, es decir `, v('t', `t = ${f(ts[0])} o t = ${f(ts[1])}`), ini ? `; en el reloj, ${f(reloj(ts[0]))} h o ${f(reloj(ts[1]))} h.` : '.'],
      [pide === 'hora' ? (ini ? 'La primera vez es a las ' : 'La primera vez es en ') : 'La temperatura máxima es ', pide === 'hora' ? v('t', `${f(correcta)} h`) : v('T', `${fracTxt(Tmax)} °C`), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, variables, enunciado, pregunta, solucion, unidad: pide === 'hora' ? 'h' : '°C',
      datos: { tipo: 'cuadratica', sub: 'hora', base, per, ini, K, B, C, pide } });
  }

  // ---------- racional en coseno ----------
  const limpio = (n, d) => fracTxt(n / d) === `${fracTxt(n)}/${d}`;
  function racional(rng, semilla) {
    const a = rng.elegir([1, 2, 3, -1, -2, -3]), d = rng.elegir([2, 3, 4, 5]), b = rng.entero(-4, 6);
    if (a * d === b || a === b) return null;
    const y = c => (a * c + b) / (c + d);
    const y1 = y(1), ym = y(-1);
    const M = Math.max(y1, ym), m = Math.min(y1, ym);
    const pide = rng.elegir(['max', 'min', 'suma']);
    const pick = (X, Y) => (pide === 'max' ? X : pide === 'min' ? Y : X + Y);
    const correcta = pick(M, m);
    const nM = b + Math.abs(a), nm = b - Math.abs(a);
    const errores = [
      h('TX-maximo-entre-maximo', pick(nM / (d + 1), nm / (d - 1)), 'Dividiste el máximo del numerador entre el máximo del denominador (y el mínimo entre el mínimo). Numerador y denominador dependen del mismo cos x: hay que despejar cos x o evaluar en cos x = 1 y cos x = −1.'),
      h('TX-maximo-entre-minimo', pick(nM / (d - 1), nm / (d + 1)), `${{ max: 'Dividiste el mayor numerador entre el menor denominador', min: 'Dividiste el menor numerador entre el mayor denominador', suma: 'Dividiste el mayor numerador entre el menor denominador (y el menor entre el mayor)' }[pide]} como si pudieran ocurrir a la vez. Los dos dependen del mismo cos x.`),
      h('TX-coseno-cero', pick(b / d, b / d) * (pide === 'suma' ? 2 : 1), 'Evaluaste en cos x = 0. Los extremos de esta función están en los extremos de cos x, 1 y −1.'),
      h('TX-intercambia-extremos', pide === 'max' ? m : pide === 'min' ? M : M - m, pide === 'suma' ? 'Restaste el mínimo del máximo; piden la suma.' : `Ese es el ${pide === 'max' ? 'mínimo' : 'máximo'}: compara los dos valores antes de elegir.`),
    ];
    const variables = { c: { nombre: 'cos x', color: 'i' }, y: { nombre: 'valor pedido', color: 'd' }, M: { nombre: 'extremos', color: 'o' } };
    const enunciado = ['Sea y = (', poli([[a, 'cos x'], [b, '']]), ')/(cos x + ', String(d), '), con x real.'];
    const solucion = [
      ['Despeja ', v('c', 'cos x'), ` en función de y: y(cos x + ${d}) = ${poli([[a, 'cos x'], [b, '']])} ⇒ `, v('c', `cos x = (${poli([[b, ''], [-d, 'y']])})/(y ${a < 0 ? '+' : '−'} ${Math.abs(a)})`), '.'],
      ['Como −1 ≤ cos x ≤ 1, y queda entre los valores de cos x = 1 y cos x = −1 (la función de cos x es monótona porque el denominador no se anula).'],
      [`cos x = 1: y = ${fracTxt(a + b)}/${d + 1}${limpio(a + b, d + 1) ? '' : ' = ' + fracTxt(y1)}. cos x = −1: y = ${fracTxt(b - a)}/${d - 1}${limpio(b - a, d - 1) ? '' : ' = ' + fracTxt(ym)}.`],
      ['Máximo ', v('M', fracTxt(M)), ' y mínimo ', v('M', fracTxt(m)), pide === 'suma' ? `: suman ` : '', pide === 'suma' ? v('y', fracTxt(correcta)) : '', '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, variables, enunciado, pregunta: [PREG[pide]], solucion,
      datos: { tipo: 'racional', sub: 'mobius', a, b, d, pide } });
  }
  // y = m sen² x/(1 + s cos x) + n = m(1 − s cos x) + n, con cos x ≠ −s.
  const intClave = (lo, hi, cl, cr) => ({ clave: `int:${fracTxt(lo)}:${fracTxt(hi)}:${cl ? 1 : 0}:${cr ? 1 : 0}`, texto: `${cl ? '[' : '⟨'}${fracTxt(lo)}; ${fracTxt(hi)}${cr ? ']' : '⟩'}` });
  function simplifica(rng, semilla) {
    const m = rng.elegir([1, 2, 3, -1, -2]), s = rng.elegir([1, -1]), n = rng.entero(-3, 4);
    // y = n + m − m·s·cos x. Valor excluido: cos x = −s ⇒ y = n + 2m (no se alcanza).
    const excl = n + 2 * m, alc = n; // cos x = s da y = n
    const lo = Math.min(excl, alc), hi = Math.max(excl, alc);
    const correcta = intClave(lo, hi, lo === alc, hi === alc);
    const e = (id, int, explicacion) => ({ id, ...int, explicacion, respaldo: 'hipotesis', fuente: null });
    const errores = [
      e('TX-ignora-restriccion', intClave(lo, hi, true, true), `Cerraste los dos extremos. Para simplificar hizo falta 1 ${s > 0 ? '+' : '−'} cos x ≠ 0: cos x = ${s > 0 ? '−1' : '1'} queda fuera, y el valor ${fracTxt(excl)} no se alcanza.`),
      e('TX-excluye-el-otro', intClave(lo, hi, lo === excl, hi === excl), 'Abriste el extremo equivocado. El valor que no se alcanza es el que sale con el coseno prohibido.'),
      e('TX-rango-del-coseno', intClave(n - Math.abs(m), n + Math.abs(m), true, true), `Tomaste y como ${poli([[m, 'cos x'], [n, '']])}. Al simplificar queda ${poli([[m, `(1 ${s > 0 ? '−' : '+'} cos x)`], [n, '']])}: falta el término constante.`),
      e('TX-signo-al-simplificar', intClave(Math.min(n, n - 2 * m), Math.max(n, n - 2 * m), Math.min(n, n - 2 * m) === n, Math.max(n, n - 2 * m) === n), `Simplificaste con el signo cambiado: sen² x = (1 − cos x)(1 + cos x), así que sen² x/(1 ${s > 0 ? '+' : '−'} cos x) = 1 ${s > 0 ? '−' : '+'} cos x.`),
    ];
    const variables = { c: { nombre: 'cos x', color: 'i' }, x: { nombre: 'valor prohibido', color: 'h' }, y: { nombre: 'rango', color: 'd' } };
    const den = `1 ${s > 0 ? '+' : '−'} cos x`;
    const enunciado = ['Sea y = ', `${m === 1 ? '' : m === -1 ? '−' : fracTxt(m) + ' '}sen² x/(${den})`, n ? conSigno(n) : '', ', definida para todo x real donde el denominador no se anula.'];
    const solucion = [
      ['Hace falta ', v('x', `${den} ≠ 0, o sea cos x ≠ ${s > 0 ? '−1' : '1'}`), '.'],
      [`sen² x = 1 − cos² x = (1 − cos x)(1 + cos x) ⇒ y = ${poli([[m, `(1 ${s > 0 ? '−' : '+'} cos x)`], [n, '']])}.`],
      [v('c', `−1 ≤ cos x ≤ 1`), ', sin el valor prohibido: ', `cos x = ${s > 0 ? '1' : '−1'} da y = ${fracTxt(alc)} (se alcanza); cos x = ${s > 0 ? '−1' : '1'} daría `, v('x', `y = ${fracTxt(excl)}`), ' (no se alcanza).'],
      ['El rango es ', v('y', correcta.texto), '.'],
    ];
    return cerrar(rng, semilla, { claves: true, correcta, errores, variables, enunciado, pregunta: ['¿Cuál es el rango de y?'], solucion,
      datos: { tipo: 'racional', sub: 'simplifica', m, s, n, pide: 'rango' } });
  }

  // ---------- secante en un intervalo ----------
  const INT_SEC = [[120, 180], [180, 240], [120, 240], [-60, 60], [0, 60], [-60, 0], [300, 360]];
  const sec = g => 1 / cos(g);
  function extremosSec(a, b) {
    const pts = [a, b];
    for (const g of [-180, 0, 180, 360]) if (g > a && g < b) pts.push(g);
    const vals = pts.map(g => ({ g, s: sec(g) }));
    const max = vals.reduce((p, q) => (q.s > p.s ? q : p)), min = vals.reduce((p, q) => (q.s < p.s ? q : p));
    const absMax = vals.reduce((p, q) => (Math.abs(q.s) > Math.abs(p.s) ? q : p));
    return { max, min, absMax };
  }
  function secante(rng, semilla) {
    const [a0, b0] = rng.elegir(INT_SEC), E = extremosSec(a0, b0);
    if (Math.abs(E.absMax.s - E.max.s) < 1e-9 && rng.sig() < 0.7) return null; // casi siempre con la trampa |sec|
    const sub = rng.elegir(['max-f', 'otra']);
    if (sub === 'otra') return secanteOtra(rng, semilla);
    const variables = { s: { nombre: 'sec x', color: 'i' }, x: { nombre: 'punto del máximo', color: 'h' }, y: { nombre: 'valor pedido', color: 'd' } };
    const intTxt = intervaloRad(a0, b0);
    if (sub === 'max-f') {
      const a = rng.elegir([2, 3, 4, -2, -3, -4, 1, -1]), b = rng.entero(-3, 5);
      const pide = rng.elegir(['max', 'max', 'min']);
      const fx = s => a * s + b;
      const correcta = pide === 'max' ? (a > 0 ? fx(E.max.s) : fx(E.min.s)) : (a > 0 ? fx(E.min.s) : fx(E.max.s));
      const errores = [
        h('TX-no-invierte', pide === 'max' ? (a > 0 ? fx(E.min.s) : fx(E.max.s)) : (a > 0 ? fx(E.max.s) : fx(E.min.s)), a < 0 ? `Usaste el ${pide === 'max' ? 'máximo' : 'mínimo'} de sec x, pero al multiplicar por ${f(a)} (negativo) los extremos se invierten.` : `Usaste el ${pide === 'max' ? 'mínimo' : 'máximo'} de sec x; con coeficiente positivo, el ${pide === 'max' ? 'máximo' : 'mínimo'} de f sale del ${pide === 'max' ? 'máximo' : 'mínimo'} de sec x.`),
        h('TX-maximo-de-valor-absoluto', fx(E.absMax.s), 'Tomaste el punto donde |sec x| es mayor. Con secantes negativas, el mayor valor absoluto es el valor más pequeño.'),
        h('TX-sin-signo', fx(Math.abs(E.absMax.s)), `Usaste ${f(Math.abs(E.absMax.s))} como valor de la secante sin su signo. En ${intTxt}, sec x es ${E.max.s < 0 ? 'negativa' : 'positiva'}.`),
        h('TX-coseno-por-secante', fx(cos(pide === 'max' ? (a > 0 ? E.max.g : E.min.g) : (a > 0 ? E.min.g : E.max.g))), 'Pusiste cos x donde va sec x = 1/cos x.'),
      ];
      const enunciado = ['Sea f(x) = ', poli([[a, 'sec x'], [b, '']]), `, con x ∈ ${intTxt}.`];
      const solucion = [
        [`En ${intTxt}, cos x va de ${fracTxt(Math.min(...[a0, b0, ...[-180, 0, 180, 360].filter(g => g > a0 && g < b0)].map(cos)))} a ${fracTxt(Math.max(...[a0, b0, ...[-180, 0, 180, 360].filter(g => g > a0 && g < b0)].map(cos)))}, sin pasar por 0.`],
        ['Entonces ', v('s', `${fracTxt(E.min.s)} ≤ sec x ≤ ${fracTxt(E.max.s)}`), '.'],
        a < 0 ? [`Al multiplicar por ${f(a)} (negativo), se invierten los extremos: ${fracTxt(fx(E.max.s))} ≤ f(x) ≤ ${fracTxt(fx(E.min.s))}.`] : [`Al multiplicar por ${f(a)}: ${fracTxt(fx(E.min.s))} ≤ f(x) ≤ ${fracTxt(fx(E.max.s))}.`],
        [pide === 'max' ? 'El máximo es ' : 'El mínimo es ', v('y', fracTxt(correcta)), '.'],
      ];
      return cerrar(rng, semilla, { correcta, errores, variables, enunciado, pregunta: [PREG[pide]], solucion,
        datos: { tipo: 'secante', sub, a, b, desde: a0, hasta: b0, pide } });
    }
    return null;
  }
  // g(x) = p·cos 2x + q·tan² x en el punto x₀ donde sec x es máxima; intervalos en el II y III
  // cuadrante (secante negativa), casi siempre con x₀ en un extremo del intervalo (tan x₀ ≠ 0).
  const INT_OTRA = [[120, 150], [210, 240], [135, 150], [210, 225], [120, 135], [225, 240], [120, 180], [180, 240]];
  const redondo = x => Math.round(x * 1e9) / 1e9;
  const SECT = { 120: '−2', 240: '−2', 135: '−√2', 225: '−√2', 150: '−2√3/3', 210: '−2√3/3', 180: '−1' };
  const secTxt = g => SECT[g];
  function secanteOtra(rng, semilla) {
    const [a0, b0] = rng.elegir(INT_OTRA), E = extremosSec(a0, b0), intTxt = intervaloRad(a0, b0);
    const p = rng.elegir([1, 2, 3, 4, -2, -4, 6]), q = rng.elegir([1, 2, -1, 3, -3]);
    // Valores exactos de cos 2x y tan² x en los ángulos que pueden salir (NaN en los demás).
    const C2 = { 120: -0.5, 135: 0, 150: 0.5, 180: 1, 210: 0.5, 225: 0, 240: -0.5 }, T2 = { 120: 3, 135: 1, 150: 1 / 3, 180: 0, 210: 1 / 3, 225: 1, 240: 3 };
    const c2 = x => (x in C2 ? C2[x] : NaN), t2 = x => (x in T2 ? T2[x] : NaN);
    const g = x => p * c2(x) + q * t2(x);
    const x0 = E.max.g, correcta = g(x0);
    const medio = (a0 + b0) / 2;
    const errores = [
      h('TX-maximo-de-valor-absoluto', g(E.absMax.g), `Tomaste el punto donde |sec x| es mayor (${rad(E.absMax.g)}). Ahí sec x vale ${secTxt(E.absMax.g)}: es el mínimo, no el máximo.`),
      h('TX-punto-medio', g(medio), 'Evaluaste en el punto medio del intervalo. La secante es monótona en cada tramo: su máximo está donde |cos x| es mayor.'),
      h('TX-valor-de-la-secante', E.max.s, 'Diste el máximo de sec x; piden el valor de g en ese punto.'),
      h('TX-identidad-con-signo', -p * c2(x0) + q * t2(x0), 'Cambiaste el signo de cos 2x (como si cos 2x = 1 − 2 cos² x). Es cos 2x = 2 cos² x − 1.'),
    ];
    if (!(a0 <= 180 && b0 >= 180)) errores.push(h('TX-supone-pi', g(180), `Pusiste el máximo en π, pero π no está en ${intTxt}. Sin π adentro, el máximo está en el extremo más cercano a π.`));
    const variables = { s: { nombre: 'sec x', color: 'i' }, x: { nombre: 'punto del máximo', color: 'h' }, y: { nombre: 'valor pedido', color: 'd' } };
    const enunciado = [`En el intervalo ${intTxt}, `, v('s', 'sec x'), ' alcanza su valor máximo en un punto ', v('x', 'x₀'), '. Sea g(x) = ', poli([[p, 'cos 2x'], [q, 'tan² x']]), '.'];
    const solucion = [
      [`En ${intTxt}, cos x es negativo y no se anula: sec x = 1/cos x es negativa.`],
      ['Con secante negativa, la mayor es la de menor valor absoluto, donde |cos x| es más grande: la más cercana a π.'],
      ['El máximo es ', v('s', `sec x = ${secTxt(x0)}`), ' en ', v('x', `x₀ = ${rad(x0)}`), '.'],
      [`g(x₀) = ${fracTxt(p)}·(${fracTxt(c2(x0))}) ${q < 0 ? '−' : '+'} ${fracTxt(Math.abs(q))}·(${fracTxt(t2(x0))}) = `, v('y', fracTxt(correcta)), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, variables, enunciado, pregunta: ['¿Cuánto vale g(x₀)?'], solucion,
      datos: { tipo: 'secante', sub: 'otra', p, q, desde: a0, hasta: b0, pide: 'valor' } });
  }

  // ---------- senoide: precio con un coseno ----------
  function senoide(rng, semilla) {
    const L = rng.elegir([6, 12]), b = rng.elegir([4, 6, 8, 10, 12, 20]), a = rng.elegir([20, 30, 40, 50, 60, 80]);
    if (b >= a) return null;
    const c = rng.elegir([0.5, 0, -0.5]);
    const th = { 0.5: 60, 0: 90, '-0.5': 120 }[String(c)];
    const dato2 = rng.elegir(['min', 'medio']);
    const pide = rng.elegir(['primera', 'primera', 'segunda']);
    const P0 = a + b, P2 = dato2 === 'min' ? a - b : a, V = a + b * c;
    const t1 = L * th / 180, t2 = 2 * L - t1;
    const correcta = pide === 'primera' ? t1 : t2;
    const thS = { 0.5: 30, 0: 0, '-0.5': -30 }[String(c)];
    const otro = pide === 'primera' ? t2 : t1;
    const errores = [
      hi('TR22-otra-vez', otro, `Esa es la ${pide === 'primera' ? 'segunda' : 'primera'} vez que el precio vale ${f(V)}.`),
      h('TX-arcoseno', L * Math.abs(thS) / 180 || NaN, 'Despejaste con el seno. El modelo tiene coseno: cos(πt/L) = valor.'),
      hi('TR18-periodo', pide === 'primera' ? t1 / 2 : t2 / 2, `Tomaste ${L} como el periodo. En cos(πt/${L}) el periodo es 2π/(π/${L}) = ${2 * L}: con el periodo a la mitad, los instantes salen a la mitad.`),
      hi('TR12-signo', pide === 'primera' ? L * (180 - th) / 180 : 2 * L - L * (180 - th) / 180, `Usaste cos(πt/${L}) = ${fracTxt(-c)}, con el signo cambiado. El precio ${c < 0 ? 'quedó bajo' : c > 0 ? 'quedó sobre' : 'pasa por'} el valor medio ${f(a)}.`),
      hi('TR19-amplitud-es-inicial', NaN, ''),
    ];
    // Con amplitud = precio inicial (sin valor medio): cos = V/P0.
    const cMal = V / P0, keyMal = { 0.5: 60, 0: 90, '-0.5': 120 }[String(Math.round(cMal * 2) / 2)];
    if (Math.abs(cMal * 2 - Math.round(cMal * 2)) < 1e-9 && keyMal) errores[4] = hi('TR19-amplitud-es-inicial', pide === 'primera' ? L * keyMal / 180 : 2 * L - L * keyMal / 180, `Tomaste el precio inicial como amplitud, sin valor medio. Aquí ${f(P0)} = a + b: el valor medio es a = ${f(a)} y la amplitud b = ${f(b)}.`);
    const variables = { a: { nombre: 'valor medio', color: 'o' }, b: { nombre: 'amplitud', color: 'i' }, V: { nombre: 'precio pedido', color: 'h' }, t: { nombre: 'instante', color: 'd' } };
    const r = P.frac(Math.round(V * 1000), Math.round(P0 * 1000));
    const comoFraccion = r.d <= 10 && r.n < r.d;
    const enunciado = [`El precio de un producto (en soles), t meses después de abrir una tienda, sigue el modelo P(t) = a + b·cos(πt/${L}), con a y b constantes positivas. Al abrir, el precio era S/ ${f(P0)} y`,
      dato2 === 'min' ? ` a los ${L} meses llegó a su mínimo, S/ ${f(P2)}.` : ` a los ${f(L / 2)} meses valía S/ ${f(P2)}.`];
    const pregunta = [`¿A los cuántos meses el precio vale${pide === 'segunda' ? ', por segunda vez,' : ' por primera vez'} `, v('V', comoFraccion ? `${P.textoFraccion(r)} del precio inicial` : `S/ ${f(V)}`), '?'];
    const solucion = [
      [dato2 === 'min' ? `P(0) = a + b = ${f(P0)} y P(${L}) = a − b = ${f(P2)}` : `P(0) = a + b = ${f(P0)} y P(${f(L / 2)}) = a + b·cos(π/2) = a = ${f(P2)}`, ' ⇒ ', v('a', `a = ${f(a)}`), ', ', v('b', `b = ${f(b)}`), '.'],
      [comoFraccion ? `${P.textoFraccion(r)} de ${f(P0)} es ` : 'Se pide ', v('V', `${f(V)}`), `: ${f(a)} + ${f(b)}·cos(πt/${L}) = ${f(V)} ⇒ cos(πt/${L}) = ${fracTxt(c)}.`],
      [`πt/${L} = ${th}° o ${360 - th}° (primera vuelta) ⇒ `, v('t', `t = ${f(t1)} o t = ${f(t2)}`), '.'],
      [pide === 'primera' ? 'La primera vez es a los ' : 'La segunda vez es a los ', v('t', `${f(correcta)} meses`), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores: errores.filter(e => e.explicacion), variables, enunciado, pregunta, solucion, unidad: 'meses',
      texto: x => (Math.abs(x - Math.round(x)) < 1e-9 && x > 0 ? `${f(x)} ${x === 1 ? 'mes' : 'meses'}` : null),
      datos: { tipo: 'senoide', L, P0, dato2, P2, V, pide } });
  }

  // ---------- áreas en la circunferencia trigonométrica ----------
  // Coeficientes [c0, cs, cc, csc, ct] del área sin signo; el signo lo fija el cuadrante.
  const REGIONES = [
    { v: ['O', 'A', 'P'], k: [0, 0.5, 0, 0, 0] },
    { v: ['A', 'P', "A'"], k: [0, 1, 0, 0, 0] },
    { v: ['O', 'B', 'P'], k: [0, 0, 0.5, 0, 0] },
    { v: ['O', 'Q', 'P'], k: [0, 0, 0, 0.5, 0] },
    { v: ['B', 'P', "B'"], k: [0, 0, 1, 0, 0] },
    { v: ['A', 'B', 'P'], k: [0.5, -0.5, -0.5, 0, 0] },
    { v: ["A'", 'B', 'P'], k: [-0.5, 0.5, -0.5, 0, 0] },
    { v: ['O', 'A', 'T'], k: [0, 0, 0, 0, 0.5] },
    { v: ['A', 'Q', 'P'], k: [0, 0.5, 0, -0.5, 0] },
  ];
  const CUADR = { I: 45, II: 135, III: 225, IV: 315 };
  const evalK = (k, g) => k[0] + k[1] * Math.sin(g * GR) + k[2] * Math.cos(g * GR) + k[3] * Math.sin(g * GR) * Math.cos(g * GR) + k[4] * Math.tan(g * GR);
  const TER = ['', 'sen θ', 'cos θ', 'sen θ cos θ', 'tan θ'];
  function exprArea(k) {
    const clave = 'area:' + k.map(x => { const r = P.frac(Math.round(x * 2), 2); return `${r.n}/${r.d}`; }).join('|');
    const D = k.some(x => Math.abs(x * 2) % 2 === 1) ? 2 : 1;
    const nums = k.map(x => Math.round(x * D));
    const no0 = nums.map((n, i) => [n, i]).filter(([n]) => n);
    const orden = no0.filter(([n]) => n > 0).concat(no0.filter(([n, i]) => n < 0 && i > 0), no0.filter(([n, i]) => n < 0 && i === 0));
    let t = '';
    orden.forEach(([n, i]) => { const abs = Math.abs(n), cuerpo = i === 0 ? String(abs) : (abs === 1 ? '' : abs + ' ') + TER[i]; t += t === '' ? (n < 0 ? '−' : '') + cuerpo : (n < 0 ? ' − ' : ' + ') + cuerpo; });
    if (D === 1) return { clave, texto: t };
    if (no0.length === 1) return { clave, texto: t.startsWith('−') ? `−(1/2) ${t.slice(1)}` : `(1/2) ${t}` };
    if (nums.every(n => n <= 0)) return { clave, texto: '−' + exprArea(k.map(x => -x)).texto };
    return { clave, texto: `(1/2)(${t})` };
  }
  const DESCR = { A: 'A = (1; 0)', B: 'B = (0; 1)', "A'": "A' = (−1; 0)", "B'": "B' = (0; −1)", Q: 'Q es la proyección de P sobre el eje X', T: 'T es el punto donde la recta OP corta a la recta tangente a la circunferencia en A' };
  function areaCT(rng, semilla) {
    const R = rng.elegir(REGIONES);
    const cuad = rng.elegir(R.v.includes('T') || R.v.includes('Q') ? ['II', 'III', 'IV'] : ['II', 'III', 'IV', 'II', 'III', 'IV', 'I']);
    const sgn = Math.sign(evalK(R.k, CUADR[cuad]));
    const k = R.k.map(x => sgn * x);
    const correcta = exprArea(k);
    const swap = kk => [kk[0], kk[2], kk[1], kk[3], kk[4]];
    const e = (id, kk, explicacion, resp = 'hipotesis') => ({ id, ...exprArea(kk), explicacion, respaldo: resp, fuente: resp === 'hipotesis' ? null : INF });
    const errores = [];
    const terminos = R.k.map((x, i) => [x, i]).filter(([x]) => x);
    const motivo = terminos.length === 1
      ? `${TER[terminos[0][1]]} es negativo`
      : `la expresión ${exprArea(R.k).texto} sale negativa; el área es su opuesto`;
    if (sgn < 0) errores.push(e('TR12-sin-signo', R.k, `Usaste las coordenadas como longitudes, sin signo. En el ${cuad} cuadrante, ${motivo}${terminos.length === 1 ? ': para que el área salga positiva hay que cambiarle el signo' : ''}.`, 'parcial'));
    else errores.push(e('TR12-signo-de-mas', R.k.map(x => -x), `Le pusiste un signo menos que no hace falta. En el ${cuad} cuadrante, la expresión ya es positiva.`));
    errores.push(e('TR11-cruza-seno-coseno', swap(k), 'Cambiaste seno por coseno. En la C.T., cos θ es la abscisa de P (horizontal) y sen θ su ordenada (vertical).', 'parcial'));
    errores.push(e('TX-sin-mitad', k.map(x => x * (R.k.some(y => Math.abs(y) === 1) ? 0.5 : 2)), R.k.some(y => Math.abs(y) === 1) ? 'Dividiste entre 2 dos veces: la base de este triángulo mide 2, no 1.' : 'Olvidaste el 1/2: el área del triángulo es base por altura entre 2.'));
    if (k.filter(x => x).length > 1) errores.push(e('TR12-signo-parcial', [k[0], -k[1], k[2], k[3], k[4]], 'Ajustaste el signo de una coordenada y no el de la otra. Revisa cada una en su cuadrante.'));
    errores.push(e('TX-cruza-y-sin-signo', swap(R.k), 'Cambiaste seno por coseno y además olvidaste el signo del cuadrante.'));
    if (k[4]) {
      errores.push(e('TX-tangente-por-seno', [0, k[4], 0, 0, 0], 'Usaste sen θ como la altura AT. AT está sobre la recta tangente en A: mide |tan θ|, no |sen θ|.'));
      errores.push(e('TX-tangente-por-coseno', [0, 0, k[4], 0, 0], 'Usaste cos θ como la altura AT. AT está sobre la recta tangente en A: mide |tan θ|.'));
    }
    const variables = { th: { nombre: 'arco θ', color: 'o' }, P: { nombre: 'punto P', color: 'i' }, S: { nombre: 'área', color: 'd' } };
    const puntos = R.v.filter(p => p !== 'O' && p !== 'P').map(p => DESCR[p]);
    const enunciado = ['En la circunferencia trigonométrica (centro O en el origen y radio 1), ', v('P', 'P'), ' es el extremo del arco ', v('th', 'θ'), `, con θ en el ${cuad} cuadrante. Además, ${puntos.join('; ')}.`];
    const nombre = R.v.join('');
    const base = {
      OAP: 'base OA = 1 y altura |sen θ| (la distancia de P al eje X)', APA: "base AA' = 2 y altura |sen θ|", OBP: 'base OB = 1 y altura |cos θ| (la distancia de P al eje Y)',
      OQP: 'catetos OQ = |cos θ| y QP = |sen θ|', BPB: "base BB' = 2 y altura |cos θ|", OAT: 'base OA = 1 y altura AT = |tan θ|', AQP: 'base AQ = 1 − cos θ y altura |sen θ|',
    }[nombre.replace(/'/g, '')];
    const solucion = [
      [v('P', 'P = (cos θ; sen θ)'), `. En el ${cuad} cuadrante, sen θ ${['I', 'II'].includes(cuad) ? '> 0' : '< 0'} y cos θ ${['I', 'IV'].includes(cuad) ? '> 0' : '< 0'}.`],
      base ? [`Triángulo ${R.v.join('')}: ${base}.`] : [`Con las coordenadas de ${R.v.join(', ')} y la fórmula del determinante: área = (1/2)|${exprArea(R.k.map(x => x * 2)).texto}|.`],
      ['Quita el valor absoluto con el signo del cuadrante: ', v('S', `S = ${correcta.texto}`), '.'],
    ];
    return cerrar(rng, semilla, { claves: true, correcta, errores, variables, enunciado, pregunta: [`¿Cuál es el área del triángulo ${R.v.join('')} en función de θ?`], solucion,
      datos: { tipo: 'area-ct', vertices: R.v, cuadrante: cuad } });
  }

  // ---------- puerta bajo un techo curvo ----------
  function puerta(rng, semilla) {
    const L = rng.elegir([3, 6, 9, 12]), A = rng.elegir([1, 2, 3]), d = rng.elegir([2, 3, 4]);
    const c = rng.elegir([0.5, 0, -0.5]), th = { 0.5: 60, 0: 90, '-0.5': 120 }[String(c)];
    // y = d + 2A cos²(πx/2L) = (d + A) + A cos(πx/L); puerta de altura hh: cos(πx/L) = c.
    const hh = d + A + A * c;
    const x0 = L * th / 180, ancho = 2 * x0, correcta = ancho * hh;
    const c2 = (hh - d) / (2 * A); // valor de cos² que ve el alumno
    const errores = [
      h('TX-medio-ancho', x0 * hh, 'Usaste solo la mitad del ancho: la puerta está centrada y va de −x₀ a x₀.'),
      h('TX-ancho-total', 2 * L * hh, 'Usaste todo el ancho del techo. La puerta es más angosta: sus esquinas tocan el techo a la altura dada.'),
      h('TX-altura-maxima', ancho * (d + 2 * A), 'Usaste como altura la del punto más alto del techo, no la de la puerta.'),
    ];
    // Sin el cuadrado: cos(πx/2L) = c2 (si es notable).
    const notC = { 0.75: null, 0.5: 60, 0.25: null, 0: 90, 1: 0 };
    if (notC[c2]) errores.push(h('TX-olvida-el-cuadrado', 2 * (2 * L * notC[c2] / 180) * hh, `Resolviste cos(πx/${2 * L}) = ${fracTxt(c2)} como si no hubiera cuadrado. Era cos² = ${fracTxt(c2)}; mejor degradar a cos(πx/${L}).`));
    errores.push(h('TX-angulo-doble-mal', 2 * (L * th / 360) * hh, `Al degradar usaste πx/${4 * L} en vez de πx/${L}: el ángulo doble de πx/${2 * L} es πx/${L}.`));
    const variables = { h: { nombre: 'altura de la puerta', color: 'o' }, x: { nombre: 'mitad del ancho', color: 'i' }, S: { nombre: 'área', color: 'd' } };
    const enunciado = [`El perfil del techo de un galpón es y = ${d} + ${2 * A} cos²(πx/${2 * L}), con x e y en metros y −${L} ≤ x ≤ ${L} (el piso es y = 0). Se coloca una puerta rectangular centrada en x = 0, apoyada en el piso, de `, v('h', `${f(hh)} m de altura`), ', cuyas dos esquinas de arriba tocan el techo.'];
    const solucion = [
      [`Degrada: 2 cos²(πx/${2 * L}) = 1 + cos(πx/${L}), así que y = ${d + A} + ${A === 1 ? '' : A + ' '}cos(πx/${L}).`],
      ['A la altura de la puerta: ', v('h', `${f(hh)}`), ` = ${d + A} + ${A === 1 ? '' : A + ' '}cos(πx/${L}) ⇒ cos(πx/${L}) = ${fracTxt(c)}.`],
      [`πx/${L} = ${th}° (con 0 ≤ x ≤ ${L}) ⇒ `, v('x', `x₀ = ${f(x0)} m`), `; la puerta va de −${f(x0)} a ${f(x0)}: ancho ${f(ancho)} m.`],
      ['Área = ', `${f(ancho)} · ${f(hh)} = `, v('S', `${f(correcta)} m²`), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, variables, enunciado, pregunta: ['¿Cuál es el área de la puerta?'], solucion, unidad: 'm²',
      texto: x => (limpia(x) && Math.abs(x * 2 - Math.round(x * 2)) < 1e-9 ? `${f(x)} m²` : null),
      datos: { tipo: 'puerta', d, A, L, h: hh } });
  }

  // Funciones de cálculo puras (las usa papel.json).
  const calc = {
    asenbcos: (a, b, c) => { const R = Math.hypot(a, b); return { R, max: c + R, min: c - R }; },
    rangoSeno: (desde, hasta) => { const [lo, hi] = rangoSeno(desde === null ? null : [desde, hasta]); return { min: lo, max: hi }; },
    cuadraticaSeno: (A, B, C, desde = null, hasta = null) => { const [s1, s2] = rangoSeno(desde === null ? null : [desde, hasta]); const E = extremosCuad(A, B, C, s1, s2); return { max: E.max, min: E.min, vertice: E.sv, diferencia: E.max - E.min }; },
    racional: (a, b, d) => { const y = c => (a * c + b) / (c + d); return { max: Math.max(y(1), y(-1)), min: Math.min(y(1), y(-1)) }; },
    simplifica: (m, s, n) => { const excl = n + 2 * m; return { rango: intClave(Math.min(excl, n), Math.max(excl, n), Math.min(excl, n) === n, Math.max(excl, n) === n).texto, alcanzado: n, excluido: excl }; },
    secante: (desde, hasta) => { const E = extremosSec(desde, hasta); return { max: E.max.s, puntoMax: E.max.g, min: E.min.s, puntoMin: E.min.g }; },
    senoide: (P0, Pmin, L, V) => { const a = (P0 + Pmin) / 2, b = (P0 - Pmin) / 2, c = (V - a) / b, th = Math.acos(c) / GR; return { a, b, coseno: c, primera: L * th / 180, segunda: 2 * L - L * th / 180 }; },
    areaCT: (vertices, cuadrante) => { const R = REGIONES.find(r => r.v.join() === vertices.join()); const s = Math.sign(evalK(R.k, CUADR[cuadrante])); return { area: exprArea(R.k.map(x => s * x)).texto }; },
    puerta: (d, A, L, altura) => { const c = (altura - d - A) / A, x0 = L * Math.acos(c) / Math.PI; return { mitadAncho: x0, ancho: 2 * x0, area: 2 * x0 * altura }; },
  };

  return { id: ID, titulo: 'Máximos, mínimos y rangos trigonométricos', generar, calc };
});
