/*
 * Generador: ecuaciones trigonométricas en un intervalo (cuántas soluciones, su suma, una de ellas).
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['trig-ecuaciones']) y en Node (require). No usa ningún motor.
 *
 * Convenciones de _datos (para recalcular sin leer el código):
 *   Los ángulos van en GRADOS. El intervalo es siempre semiabierto: desde ≤ x < hasta (en grados),
 *   o 0 ≤ t < T cuando la variable es el tiempo t. Valores notables escritos como texto:
 *   '1/2', '-1/2', '√2/2', '-√3/2', '√3', '-√3/3', '0', '1', '-1', '2', '3/2', etc.
 *   modo: 'grados' (respuesta en grados), 'radianes' (respuesta en radianes, múltiplo de π),
 *   'cuantas' es un número de soluciones; 'horas' y 'segundos', valores de t.
 *   pide: 'cuantas' (número de soluciones), 'suma' (suma de todas las soluciones del intervalo),
 *   'kesima' (la j-ésima solución, de menor a mayor; j en el campo j), 'mayor' (la mayor),
 *   'primera' (la menor), 'segunda', 'menor' (la menor solución estrictamente positiva).
 *
 * Tipos:
 *   lineal         fn(a·x + b) = k, fn ∈ {sen, cos}; b en grados; 0° ≤ x < 360°.
 *                  Campos: fn, a, b, k, modo, pide, j.
 *   horas          temperatura T(t) = c + p·sen(πt/12) + q·cos(πt/12), 0 ≤ t < 24 (horas);
 *                  se pide cuándo T(t) = valor. Campos: c, p, q (números; p o q pueden ser m√3,
 *                  guardados con su valor decimal y su texto pTxt, qTxt), valor, pide.
 *   suma-producto  f1(p·x) ± f2(q·x) = d, con f1, f2 ∈ {sen, cos} y d = 0 o d = g(m·x)
 *                  (m = (p + q)/2). Campos: f1, p, signo (+1 o −1), f2, q, rhs ('0' o
 *                  'sen m' o 'cos m'), m, hasta (360), modo, pide.
 *   degradar       f1²(p·x) ± f2²(q·x) = d, d ∈ {0, 1}. Campos: f1, p, signo, f2, q, d, modo, pide.
 *                  Con modo 'segundos', x = 30·t grados (x = πt/6) y 0 ≤ t < 12.
 *   cuadratica     sub 'coseno': α·sen²(x) + β·cos(x) = γ, con x = 30·t grados (πt/6), 0 ≤ t < T;
 *                  campos alfa, beta, gamma, T, pide ('cuantas'). Sub 'senales': dos señales
 *                  s1(t) = forma escrita y s2(t) = cos(πt/3) que coinciden; x = πt/6 = 30·t grados.
 *                  La forma escrita de s1: 'directa' A·sen(x) + B; 'pi-menos' A·sen(π − x) + B;
 *                  'pi-mas' A'·sen(π + x) + B (A' es el coeficiente escrito, campo Aesc);
 *                  'cos-menos' A·cos(x − π/2) + B. Campos: forma, Aesc, B, T, pide.
 *   cubica         cos(3x)·sec(x) = k en 0 ≤ x < 360°. Campos: k, modo, pide ('cuantas', 'suma' o
 *                  'cisterna'). En 'cisterna', la suma S de las soluciones en radianes, leída en
 *                  metros, es el perímetro de la base circular de una cisterna de altura h (m);
 *                  se pide su volumen en m³.
 *   tangente       (tan(p·x) + s·tan(q·x)) / (1 − s·tan(p·x)·tan(q·x)) = k, s = ±1, en
 *                  0° ≤ x < 360°; las soluciones deben dejar definidas tan(p·x) y tan(q·x).
 *                  Campos: p, q, signo (s), k, modo, pide.
 *
 * Errores con código del informe docs/investigacion/trigonometria-ideas-erroneas.md:
 * TR21 (pierde soluciones o deja una que sobra: parcial), TR12 (signo: parcial), TR11 (cruza seno
 * y coseno: parcial), TR16 (linealidad, falta el 2: parcial), TR22 y TR14 (hipótesis del informe).
 * Los TE-* son hipótesis nuestras.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'trig-ecuaciones';
  const INF = 'docs/investigacion/trigonometria-ideas-erroneas.md';
  const h = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente: null });
  const hi = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente: INF });
  const pa = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'parcial', fuente: INF });
  const v = P.v;
  const f = x => P.formatear(x, 2);
  const menos = t => String(t).replace(/^-/, '−');

  // Ángulo principal de cada valor notable, en grados.
  const NOT = {
    sen: { '0': 0, '1/2': 30, '-1/2': -30, '√2/2': 45, '-√2/2': -45, '√3/2': 60, '-√3/2': -60, '1': 90, '-1': -90 },
    cos: { '1': 0, '√3/2': 30, '√2/2': 45, '1/2': 60, '0': 90, '-1/2': 120, '-√2/2': 135, '-√3/2': 150, '-1': 180 },
    tan: { '0': 0, '√3/3': 30, '1': 45, '√3': 60, '-√3/3': -30, '-1': -45, '-√3': -60 },
  };
  function valorK(t) {
    const neg = t.startsWith('-'), s = neg ? t.slice(1) : t;
    const R = { '√2/2': Math.SQRT2 / 2, '√3/2': Math.sqrt(3) / 2, '√3/3': Math.sqrt(3) / 3, '√3': Math.sqrt(3) };
    let x = R[s];
    if (x === undefined) { const [n, d] = s.split('/'); x = Number(n) / (d ? Number(d) : 1); }
    return neg ? -x : x;
  }
  const opuesto = k => (k === '0' ? '0' : k.startsWith('-') ? k.slice(1) : '-' + k);
  const posible = k => Math.abs(valorK(k)) <= 1 + 1e-12;

  const limpiar = xs => {
    const r = [];
    for (const x of xs.map(y => Math.round(y * 1e6) / 1e6).sort((a, b) => a - b)) if (!r.length || Math.abs(r[r.length - 1] - x) > 1e-6) r.push(x);
    return r;
  };
  const sumar = xs => xs.reduce((a, b) => a + b, 0);

  // Soluciones de fn(a·x + b) = k con desde ≤ x < hasta (grados). familias: una lista por cada
  // ángulo base (sen: α y 180° − α; cos: β y −β; tan: γ).
  function familias(fn, k, a = 1, b = 0, desde = 0, hasta = 360, cerrado = false) {
    const al = (NOT[fn] || {})[k];
    if (al === undefined) return [];
    const bases = fn === 'sen' ? [al, 180 - al] : fn === 'cos' ? [al, -al] : [al];
    const per = fn === 'tan' ? 180 : 360;
    return bases.map(u0 => {
      const out = [];
      for (let n = -80; n <= 80; n++) {
        const x = (u0 + per * n - b) / a;
        if (x > desde - 1e-9 && (cerrado ? x < hasta + 1e-9 : x < hasta - 1e-9)) out.push(x);
      }
      return limpiar(out);
    });
  }
  const soluciones = (fn, k, a, b, desde, hasta, cerrado) => limpiar([].concat(...familias(fn, k, a, b, desde, hasta, cerrado)));
  const resumen = xs => ({ soluciones: xs, cuantas: xs.length, suma: sumar(xs) });

  // ---------- textos ----------
  const rad = g => P.pi(g * Math.PI / 180, '', 36);
  const angTxt = (g, modo) => (modo === 'radianes' ? rad(g) : `${f(g)}°`);
  function arg(a, b, modo, x = 'x') {
    const c = `${a === 1 ? '' : f(a)}${x}`;
    if (!b) return c;
    return `${c} ${b > 0 ? '+' : '−'} ${angTxt(Math.abs(b), modo)}`;
  }
  const intervaloTxt = (modo, hasta = 360) => (modo === 'radianes' ? `0 ≤ x < ${rad(hasta)}` : `0° ≤ x < ${hasta}°`);
  const lista = (xs, modo) => xs.map(g => angTxt(g, modo)).join('; ');
  const ORD = ['primera', 'segunda', 'tercera', 'cuarta', 'quinta', 'sexta'];
  const SINGULAR = { soluciones: 'solución', veces: 'vez' };
  const cuantasTxt = (x, palabra = 'soluciones') => `${f(x)} ${x === 1 ? SINGULAR[palabra] : palabra}`;
  // Ecuación fn(u) = k con los coeficientes enteros que pone la academia: 2 sen u = √3.
  function igualdad(fn, u, k) {
    const s = k.startsWith('-'), b = s ? k.slice(1) : k;
    if (b.endsWith('/2')) return `2 ${fn}(${u}) = ${s ? '−' : ''}${b.slice(0, -2)}`;
    if (b === '√3/3') return `3 ${fn}(${u}) = ${s ? '−' : ''}√3`;
    return `${fn}(${u}) = ${menos(k)}`;
  }
  // Término de un polinomio: «− 3 cos x», «+ cos x», «2 sen² x».
  function poli(terms) {
    let t = '';
    for (const [c, s] of terms) {
      if (!c) continue;
      const abs = Math.abs(c), cuerpo = s ? (abs === 1 ? s : `${f(abs)} ${s}`) : f(abs);
      t += t === '' ? (c < 0 ? '−' : '') + cuerpo : (c < 0 ? ' − ' : ' + ') + cuerpo;
    }
    return t || '0';
  }

  // ---------- armado común ----------
  function cerrar(rng, semilla, o) {
    const unidad = o.modo;
    // Si la correcta es entera (grados, horas, segundos, conteos), los distractores también.
    const entero = x => Math.abs(x - Math.round(x)) < 1e-9;
    if (o.modo !== 'radianes' && o.modo !== 'cisterna' && entero(o.correcta)) o = { ...o, errores: o.errores.filter(e => entero(e.valor)) };
    let alternativas;
    if (o.modo === 'radianes') {
      const conv = g => g * Math.PI / 180;
      alternativas = P.armar({ correcta: conv(o.correcta), errores: o.errores.map(e => ({ ...e, valor: conv(e.valor) })), rng, formato: 'pi', qmax: 36 });
      return armado(semilla, o, alternativas, conv(o.correcta), 'rad');
    }
    const texto = o.texto || (o.modo === 'grados' ? (g => `${f(g)}°`) : o.modo === 'cuantas' ? (x => cuantasTxt(x, o.palabra)) : o.modo === 'horas' ? (x => `${f(x)} h`) : o.modo === 'segundos' ? (x => `${f(x)} s`) : null);
    alternativas = P.armar({ correcta: o.correcta, errores: o.errores, rng, texto });
    return armado(semilla, o, alternativas, o.correcta, unidad === 'grados' ? '°' : unidad === 'cuantas' ? '' : unidad === 'horas' ? 'h' : unidad === 'segundos' ? 's' : unidad);
  }
  function armado(semilla, o, alternativas, valor, unidad) {
    const usadas = new Set([...o.enunciado, ...o.pregunta, ...o.solucion.flat()].filter(x => x && x.v).map(x => x.v));
    const variables = Object.fromEntries(Object.entries(o.variables).filter(([k]) => usadas.has(k)));
    return {
      id: `${ID}#${semilla}`, variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion, respuesta: { valor, unidad: o.unidad || unidad }, _datos: o.datos,
    };
  }
  // Valor pedido de una lista de soluciones (grados o tiempo).
  function pedido(xs, pide, j) {
    if (!xs.length) return NaN;
    if (pide === 'cuantas') return xs.length;
    if (pide === 'suma') return sumar(xs);
    if (pide === 'kesima') return xs.length >= j ? xs[j - 1] : NaN;
    if (pide === 'mayor') return xs[xs.length - 1];
    if (pide === 'primera') return xs[0];
    if (pide === 'segunda') return xs.length >= 2 ? xs[1] : NaN;
    if (pide === 'menor') { const p = xs.filter(x => x > 1e-9); return p.length ? p[0] : NaN; }
    return NaN;
  }
  const preguntaDe = (pide, j, que = 'soluciones', del = 'de la ecuación') => ({
    cuantas: `¿Cuántas ${que} tiene la ecuación en ese intervalo?`,
    suma: `¿Cuánto suman todas las ${que} ${del} en ese intervalo?`,
    kesima: `Ordenadas de menor a mayor, ¿cuál es la ${ORD[j - 1]} solución en ese intervalo?`,
    mayor: '¿Cuál es la mayor solución en ese intervalo?',
    menor: '¿Cuál es la menor solución positiva en ese intervalo?',
  }[pide]);

  const TIPOS = ['lineal', 'horas', 'suma-producto', 'degradar', 'cuadratica-coseno', 'senales', 'cubica', 'tangente'];
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
    if (tipo === 'lineal') return lineal(rng, semilla);
    if (tipo === 'horas') return horas(rng, semilla);
    if (tipo === 'suma-producto') return sumaProducto(rng, semilla);
    if (tipo === 'degradar') return degradar(rng, semilla);
    if (tipo === 'cuadratica-coseno') return cuadCoseno(rng, semilla);
    if (tipo === 'senales') return senales(rng, semilla);
    if (tipo === 'cubica') return cubica(rng, semilla);
    return tangente(rng, semilla);
  }
  const multiplo5 = xs => xs.every(x => Math.abs(x / 5 - Math.round(x / 5)) < 1e-9);

  // ---------- lineal: fn(ax + b) = k ----------
  function lineal(rng, semilla) {
    const fn = rng.elegir(['sen', 'cos']);
    const k = rng.elegir(Object.keys(NOT[fn]).filter(x => !['0', '1', '-1'].includes(x)));
    const a = rng.elegir([2, 3, 4]), b = rng.elegir([0, 30, -30, 60, -60, 90, 45]);
    const modo = rng.elegir(['grados', 'radianes']);
    const fam = familias(fn, k, a, b, 0, 360), sols = limpiar([].concat(...fam));
    if (!multiplo5(sols) || sols.length < 3) return null;
    const pide = rng.elegir(['suma', 'suma', 'kesima', 'mayor']);
    const j = pide === 'kesima' ? rng.entero(2, Math.min(4, sols.length)) : null;
    const correcta = pedido(sols, pide, j);
    if (!(correcta > 0)) return null;
    const u = arg(a, b, modo);
    const variables = { k: { nombre: 'valor de la razón', color: 'o' }, u: { nombre: 'argumento', color: 'i' }, x: { nombre: 'solución', color: 'd' } };
    const otra = fn === 'sen' ? 'cos' : 'sen';
    const unaVuelta = limpiar([].concat(...familias(fn, k, 1, 0, 0, 360)).map(w => (w - b) / a).filter(x => x >= 0));
    const swap = soluciones(otra, k, a, b, 0, 360);
    const errores = [];
    const uDe = xs => xs.map(x => a * x + b);
    const despeje = (b ? `${b > 0 ? 'restar' : 'sumar'} ${angTxt(Math.abs(b), modo)} y ` : '') + `dividir entre ${a}`;
    if (pide === 'suma') {
      errores.push(hi('TR22-una-familia', sumar(fam[0]), `Sumaste solo las soluciones de una familia (las que salen del ángulo ${angTxt(NOT[fn][k], modo)}). ${fn === 'sen' ? 'El seno' : 'El coseno'} toma el mismo valor en dos ángulos por vuelta: faltan las de la otra familia.`));
      errores.push(h('TE-suma-del-argumento', sumar(uDe(sols)), `Sumaste los valores del argumento ${u}, no los de x. A cada ángulo hallado le falta ${despeje}.`));
      errores.push(h('TE-una-vuelta-del-argumento', sumar(unaVuelta), `Buscaste el argumento solo en una vuelta (de 0 a ${angTxt(360, modo)}). Como x llega hasta ${angTxt(360, modo)}, el argumento ${u} da ${a} vueltas: hay más soluciones.`));
      errores.push(pa('TR11-cruza-seno-coseno', sumar(swap), `Resolviste ${otra}(${u}) = ${menos(k)}: cambiaste ${fn === 'sen' ? 'seno por coseno' : 'coseno por seno'}. Los ángulos de una y otra razón no son los mismos.`));
    } else {
      const tomar = xs => pedido(xs, pide, j);
      if (pide === 'kesima') errores.push(hi('TR22-primera', sols[0], 'Te quedaste con la primera solución. Piden otra: hay que listarlas todas en el intervalo y ordenarlas.'));
      else {
        const fuera = soluciones(fn, k, a, b, 360, 720)[0];
        errores.push(hi('TR21-fuera-del-intervalo', fuera, Math.abs(fuera - 360) < 1e-9 ? `x = ${angTxt(360, modo)} no entra: el intervalo es menor estricto (x < ${angTxt(360, modo)}).` : `Esa solución pasa de ${angTxt(360, modo)}: queda fuera del intervalo. La mayor es la última que cae antes de ${angTxt(360, modo)}.`));
        errores.push(hi('TR22-primera', sols[0], 'Esa es la menor solución, no la mayor: hay que listar todas las del intervalo.'));
      }
      errores.push(h('TE-valor-del-argumento', tomar(uDe(sols)), `Ese es el valor del argumento ${u}, no el de x. Falta ${despeje}.`));
      errores.push(h('TE-una-vuelta-del-argumento', tomar(unaVuelta), `Buscaste el argumento solo en una vuelta (de 0 a ${angTxt(360, modo)}). Como x llega hasta ${angTxt(360, modo)}, el argumento ${u} da ${a} vueltas.`));
      errores.push(pa('TR11-cruza-seno-coseno', tomar(swap), `Resolviste ${otra}(${u}) = ${menos(k)}: cambiaste ${fn === 'sen' ? 'seno por coseno' : 'coseno por seno'}.`));
      if (k.startsWith('-')) errores.push(pa('TR12-sin-signo', tomar(soluciones(fn, opuesto(k), a, b, 0, 360)), `Resolviste con ${menos(opuesto(k))}, sin el signo menos. El valor negativo pone los ángulos en otros cuadrantes.`));
    }
    const [izq, der] = igualdad(fn, u, k).split(' = ');
    const enunciado = ['Resuelve ', `${izq} = `, v('k', der), ` en el intervalo ${intervaloTxt(modo)}.`];
    const base = NOT[fn][k];
    const bases = fn === 'sen' ? [base, 180 - base] : [base, -base];
    const solucion = [
      ['Llama ', v('u', `u = ${u}`), '. La ecuación es ', v('k', `${fn} u = ${menos(k)}`), '.'],
      [`Si ${intervaloTxt(modo)}, entonces `, v('u', `${angTxt(b, modo)} ≤ u < ${angTxt(360 * a + b, modo)}`), `: el argumento da ${a} vueltas.`],
      [`Ángulos base: ${lista(limpiar(bases), modo)}; sumando vueltas, `, v('u', `u = ${lista(uDe(sols), modo)}`), '.'],
      [`Despeja x (${despeje}): `, v('x', `x = ${lista(sols, modo)}`), '.'],
      [{ suma: 'La suma es ', kesima: `La ${ORD[j - 1]} es `, mayor: 'La mayor es ' }[pide], v('x', angTxt(correcta, modo)), '.'],
    ];
    return cerrar(rng, semilla, { modo, correcta, errores, variables, enunciado, pregunta: [preguntaDe(pide, j)], solucion,
      datos: { tipo: 'lineal', fn, a, b, k, modo, pide, j } });
  }

  // ---------- horas: temperatura con seno y coseno ----------
  const PARES = [
    { p: '√3', q: '1', pv: Math.sqrt(3), qv: 1, R: 2, phi: 30, raiz2: false },
    { p: '1', q: '√3', pv: 1, qv: Math.sqrt(3), R: 2, phi: 60, raiz2: false },
    { p: '√3', q: '-1', pv: Math.sqrt(3), qv: -1, R: 2, phi: -30, raiz2: false },
    { p: '1', q: '-√3', pv: 1, qv: -Math.sqrt(3), R: 2, phi: -60, raiz2: false },
    { p: '1', q: '1', pv: 1, qv: 1, R: Math.SQRT2, phi: 45, raiz2: true },
  ];
  const escalar = (m, t) => { const neg = t.startsWith('-'), s = neg ? t.slice(1) : t; return (neg ? '-' : '') + (s === '1' ? f(m) : f(m) + s); };
  function horas(rng, semilla) {
    const par = rng.elegir(PARES), m = rng.elegir([2, 3, 4, 5]), c = rng.entero(12, 20);
    const sKey = par.raiz2 ? rng.elegir(['√2/2', '-√2/2', '0']) : rng.elegir(['1/2', '-1/2', '0']);
    const Rm = par.R * m, valor = c + Rm * valorK(sKey);
    const Rtxt = par.raiz2 ? `${f(m)}√2` : f(2 * m);
    const xs = soluciones('sen', sKey, 1, par.phi, 0, 360);
    const ts = xs.map(x => x / 15);
    const pide = rng.elegir(['primera', 'segunda', 'suma']);
    const correcta = pedido(ts, pide);
    if (!(correcta > 0)) return null;
    const pT = escalar(m, par.p), qT = escalar(m, par.q);
    const tomar = xs2 => pedido(xs2.map(x => x / 15), pide);
    const errores = [
      h('TE-sin-desfase', tomar(soluciones('sen', sKey, 1, 0, 0, 360)), `Resolviste sen(πt/12) = ${menos(sKey)}, sin el ángulo que aparece al juntar seno y coseno: la suma es ${Rtxt}·sen(u ${par.phi > 0 ? '+' : '−'} ${Math.abs(par.phi)}°), no ${Rtxt}·sen u.`),
      h('TE-desfase-al-reves', tomar(soluciones('sen', sKey, 1, -par.phi, 0, 360)), `Pusiste el ángulo con el signo cambiado: es sen(u ${par.phi > 0 ? '+' : '−'} ${Math.abs(par.phi)}°), no sen(u ${par.phi > 0 ? '−' : '+'} ${Math.abs(par.phi)}°).`),
      h('TE-sin-restar-angulo', pedido(limpiar(xs.map(x => x + par.phi).filter(y => y >= 0 && y < 360)).map(x => x / 15), pide), `Pasaste a horas el ángulo completo πt/12 ${par.phi > 0 ? '+' : '−'} ${Math.abs(par.phi)}°. Primero hay que ${par.phi > 0 ? 'restar' : 'sumar'} ${Math.abs(par.phi)}° y recién dividir entre 15° por hora.`),
    ];
    if (pide === 'suma') {
      errores.push(hi('TR22-una-sola', ts[0], 'Diste solo el primer instante. La temperatura pasa por ese valor más de una vez en el día: se suman todos.'));
      errores.push(h('TE-solo-medio-dia', sumar(ts.filter(t => t < 12)), 'Sumaste solo los instantes antes del mediodía. El modelo vale para todo el día, 0 ≤ t < 24.'));
    } else if (pide === 'primera') errores.push(hi('TR22-otra-vez', ts[1], 'Esa es la segunda vez que la temperatura toma ese valor; piden la primera.'));
    else errores.push(hi('TR22-primera', ts[0], 'Esa es la primera vez; piden la segunda.'));
    if (sKey.startsWith('-')) errores.push(pa('TR12-sin-signo', tomar(soluciones('sen', opuesto(sKey), 1, par.phi, 0, 360)), `Resolviste con sen = ${menos(opuesto(sKey))}: perdiste el signo. Si la temperatura queda bajo la media, el seno es negativo.`));
    const variables = { T: { nombre: 'temperatura pedida', color: 'o' }, R: { nombre: 'amplitud', color: 'i' }, phi: { nombre: 'ángulo de desfase', color: 'h' }, t: { nombre: 'instante', color: 'd' } };
    const signoQ = qT.startsWith('-') ? '−' : '+';
    const formula = `T(t) = ${c} + ${pT === '1' ? '' : pT + ' '}sen(πt/12) ${signoQ} ${qT.replace(/^-/, '') === '1' ? '' : qT.replace(/^-/, '') + ' '}cos(πt/12)`.replace('  ', ' ');
    const enunciado = ['Durante un día, la temperatura de un invernadero (en °C) sigue el modelo ', formula, ', donde t son las horas transcurridas desde la medianoche, con 0 ≤ t < 24.'];
    const pregunta = [{ primera: '¿Para qué valor de t la temperatura llega por primera vez a ', segunda: '¿Para qué valor de t la temperatura vale, por segunda vez en el día, ', suma: '¿Cuánto suman todos los valores de t del día en que la temperatura vale ' }[pide], v('T', `${f(valor)} °C`), '?'];
    const phiTxt = `${par.phi > 0 ? '+' : '−'} ${Math.abs(par.phi)}°`;
    const solucion = [
      ['Con u = πt/12 (en grados, 15t°): ', `${pT} sen u ${signoQ} ${qT.replace(/^-/, '')} cos u = `, v('R', Rtxt), ' sen(u ', v('phi', phiTxt), '), pues ', v('R', `√(${f(par.pv ** 2 * m * m)} + ${f(par.qv ** 2 * m * m)}) = ${Rtxt}`), '.'],
      [v('T', `T = ${f(valor)}`), ` ⇒ ${Rtxt} sen(u ${phiTxt}) = ${f(valor - c)} ⇒ sen(u ${phiTxt}) = ${menos(sKey)}.`],
      [`Como 0° ≤ u < 360°, el ángulo u ${phiTxt} va de ${f(par.phi)}° a ${f(360 + par.phi)}°: vale ${lista(xs.map(x => x + par.phi), 'grados')}.`],
      ['Restando el desfase y dividiendo entre 15°: ', v('t', `t = ${ts.map(f).join('; ')}`), '.'],
      [{ primera: 'La primera vez es ', segunda: 'La segunda vez es ', suma: 'La suma es ' }[pide], v('t', `${f(correcta)} h`), '.'],
    ];
    return cerrar(rng, semilla, { modo: 'horas', correcta, errores, variables, enunciado, pregunta, solucion,
      datos: { tipo: 'horas', c, p: m * par.pv, q: m * par.qv, pTxt: pT, qTxt: qT, valor, pide } });
  }

  // ---------- suma-producto ----------
  // Formas: lado izquierdo, forma de producto y factores [fn, k, coeficiente].
  const FORMAS_SP = [
    { f1: 'cos', signo: -1, f2: 'cos', rhs: '0', prod: (m, d) => `−2 sen ${m} · sen ${d} = 0`, fac: (m, d) => [['sen', '0', m], ['sen', '0', d]] },
    { f1: 'sen', signo: 1, f2: 'sen', rhs: '0', prod: (m, d) => `2 sen ${m} · cos ${d} = 0`, fac: (m, d) => [['sen', '0', m], ['cos', '0', d]] },
    { f1: 'sen', signo: -1, f2: 'sen', rhs: '0', prod: (m, d) => `2 cos ${m} · sen ${d} = 0`, fac: (m, d) => [['cos', '0', m], ['sen', '0', d]] },
    { f1: 'cos', signo: 1, f2: 'cos', rhs: 'cos m', prod: (m, d) => `2 cos ${m} · cos ${d} = cos ${m} ⇒ cos ${m} · (2 cos ${d} − 1) = 0`, fac: (m, d) => [['cos', '0', m], ['cos', '1/2', d]], comun: true },
    { f1: 'sen', signo: 1, f2: 'sen', rhs: 'sen m', prod: (m, d) => `2 sen ${m} · cos ${d} = sen ${m} ⇒ sen ${m} · (2 cos ${d} − 1) = 0`, fac: (m, d) => [['sen', '0', m], ['cos', '1/2', d]], comun: true },
  ];
  const PARES_PQ = [[3, 1], [5, 1], [5, 3], [4, 2], [6, 2], [7, 3]];
  const xk = (a, x = 'x') => (a === 1 ? x : `${f(a)}${x}`);
  const resolverFac = (fac, hasta = 360) => fac.map(([fn, k, a]) => soluciones(fn, k, a, 0, 0, hasta));
  function sumaProducto(rng, semilla) {
    const F = rng.elegir(FORMAS_SP), [p, q] = rng.elegir(PARES_PQ), m = (p + q) / 2, d = (p - q) / 2;
    const modo = rng.elegir(['grados', 'radianes']), pide = rng.elegir(['cuantas', 'suma']);
    const fac = F.fac(m, d), porFac = resolverFac(fac), sols = limpiar([].concat(...porFac));
    if (sols.length > 14 || sols.length < 3) return null;
    const correcta = pedido(sols, pide);
    if (!(correcta > 0)) return null;
    const M = xk(m), D = xk(d);
    const lhs = `${F.f1} ${xk(p)} ${F.signo > 0 ? '+' : '−'} ${F.f2} ${xk(q)}`;
    const rhs = F.rhs === '0' ? '0' : `${F.rhs.split(' ')[0]} ${M}`;
    const tomar = xs => (pide === 'cuantas' ? xs.length : sumar(xs));
    const facTxt = ([fn, k, a]) => `${fn} ${xk(a)} = ${menos(k)}`;
    const errores = [];
    if (F.comun) {
      errores.push(pa('TR21-divide-entre-factor', tomar(porFac[1]), `Dividiste entre ${F.rhs.split(' ')[0]} ${M} y perdiste las soluciones de ${facTxt(fac[0])}. No se divide entre una expresión que puede valer cero: se factoriza.`));
      const sin2 = limpiar([...porFac[0], ...soluciones('cos', '1', d, 0, 0, 360)]);
      errores.push(hi('TR16-sin-el-2', tomar(sin2), `Olvidaste el 2 de la transformación: ${F.f1} A + ${F.f2} B = 2·${F.f1 === 'cos' ? 'cos' : 'sen'}((A + B)/2)·cos((A − B)/2). Sin el 2 queda cos ${D} = 1, que no es.`));
    } else {
      errores.push(pa('TR21-solo-primer-factor', tomar(porFac[0]), `Te quedaste con ${facTxt(fac[0])} y olvidaste el otro factor: si un producto es cero, cualquiera de los dos factores puede serlo.`));
      errores.push(pa('TR21-solo-segundo-factor', tomar(porFac[1]), `Te quedaste con ${facTxt(fac[1])} y olvidaste el otro factor: si un producto es cero, cualquiera de los dos puede serlo.`));
    }
    const sinMitad = limpiar([].concat(...resolverFac(F.fac(p + q, p - q))));
    errores.push(h('TE-sin-mitades', tomar(sinMitad), `Usaste A + B y A − B sin dividirlos entre 2. La transformación lleva (A + B)/2 = ${M} y (A − B)/2 = ${D}.`));
    const repetidas = porFac[0].length + porFac[1].length > sols.length;
    if (repetidas) errores.push(h('TE-repite-comunes', pide === 'cuantas' ? porFac[0].length + porFac[1].length : sumar(porFac[0]) + sumar(porFac[1]), 'Contaste dos veces los ángulos que anulan a los dos factores a la vez. Cada solución se cuenta una sola vez.'));
    const en360 = fac.some(([fn, k, a]) => soluciones(fn, k, a, 0, 360, 361).some(x => Math.abs(x - 360) < 1e-9));
    if (en360) errores.push(hi('TR21-incluye-extremo', pide === 'cuantas' ? sols.length + 1 : sumar(sols) + 360, `Contaste también x = ${angTxt(360, modo)}, que el intervalo deja fuera (es menor estricto).`));
    const variables = { m: { nombre: 'semisuma', color: 'o' }, d: { nombre: 'semidiferencia', color: 'i' }, x: { nombre: 'soluciones', color: 'd' } };
    const enunciado = ['Resuelve ', `${lhs} = ${rhs}`, ` en el intervalo ${intervaloTxt(modo)}.`];
    const solucion = [
      [`Transforma la ${F.signo > 0 ? 'suma' : 'diferencia'} en producto con `, v('m', `(A + B)/2 = ${M}`), ' y ', v('d', `(A − B)/2 = ${D}`), ':'],
      [F.prod(M, D), '.'],
      [`Cada factor por separado: ${facTxt(fac[0])} da ${lista(porFac[0], modo)}; ${facTxt(fac[1])} da ${lista(porFac[1], modo)}.`],
      ['Juntas, sin repetir: ', v('x', lista(sols, modo)), '.'],
      [pide === 'cuantas' ? 'Son ' : 'La suma es ', v('x', pide === 'cuantas' ? cuantasTxt(correcta) : angTxt(correcta, modo)), '.'],
    ];
    return cerrar(rng, semilla, { modo: pide === 'cuantas' ? 'cuantas' : modo, correcta, errores, variables, enunciado, pregunta: [preguntaDe(pide)], solucion,
      datos: { tipo: 'suma-producto', f1: F.f1, p, signo: F.signo, f2: F.f2, q, rhs: F.rhs, m, hasta: 360, modo: pide === 'cuantas' ? 'cuantas' : modo, pide } });
  }

  // ---------- degradar cuadrados ----------
  const FORMAS_DG = [
    { f1: 'cos', signo: 1, f2: 'cos', d: 1, fac: 'cos', idea: '(1 + cos 2A)/2 + (1 + cos 2B)/2 = 1 ⇒ cos 2A + cos 2B = 0' },
    { f1: 'sen', signo: 1, f2: 'sen', d: 1, fac: 'cos', idea: '(1 − cos 2A)/2 + (1 − cos 2B)/2 = 1 ⇒ cos 2A + cos 2B = 0' },
    { f1: 'cos', signo: -1, f2: 'sen', d: 0, fac: 'cos', idea: '(1 + cos 2A)/2 − (1 − cos 2B)/2 = 0 ⇒ cos 2A + cos 2B = 0' },
    { f1: 'sen', signo: -1, f2: 'sen', d: 0, fac: 'sen', idea: '(1 − cos 2A)/2 − (1 − cos 2B)/2 = 0 ⇒ cos 2B − cos 2A = 0' },
    { f1: 'cos', signo: -1, f2: 'cos', d: 0, fac: 'sen', menos: true, idea: '(1 + cos 2A)/2 − (1 + cos 2B)/2 = 0 ⇒ cos 2A − cos 2B = 0' },
  ];
  function degradar(rng, semilla) {
    const F = rng.elegir(FORMAS_DG), [p, q] = rng.elegir([[2, 1], [3, 1], [3, 2], [4, 1], [5, 1]]);
    const modo = rng.elegir(['grados', 'radianes', 'segundos', 'segundos']);
    const pide = modo === 'segundos' ? 'suma' : rng.elegir(['cuantas', 'suma']);
    const S = p + q, Dd = p - q;
    const fac = [[F.fac, '0', S], [F.fac, '0', Dd]];
    const porFac = resolverFac(fac), sols = limpiar([].concat(...porFac));
    if (sols.length > 14 || sols.length < 3) return null;
    const aT = x => x / 30;
    const enT = modo === 'segundos';
    if (enT && !sols.every(x => Math.abs(aT(x) * 2 - Math.round(aT(x) * 2)) < 1e-9)) return null;
    const conv = xs => (enT ? xs.map(aT) : xs);
    const tomar = xs => (pide === 'cuantas' ? xs.length : sumar(conv(xs)));
    const correcta = tomar(sols);
    if (!(correcta > 0)) return null;
    const arg = n => { if (!enT) return xk(n); const r = P.frac(n, 6); return `${r.n === 1 ? '' : r.n}πt${r.d === 1 ? '' : '/' + r.d}`; };
    const argA = arg(p), argB = arg(q);
    const lhs = `${F.f1}²(${argA}) ${F.signo > 0 ? '+' : '−'} ${F.f2}²(${argB})`;
    const facTxt = ([fn, k, a]) => `${fn}(${arg(a)}) = 0`;
    const errores = [
      h('TE-degrada-sin-doble', tomar(limpiar([].concat(...resolverFac([[F.fac, '0', S / 2], [F.fac, '0', Dd / 2]])))), F.f1 === 'sen' && F.f2 === 'sen' ? 'Degradaste mal: sen² A = (1 − cos 2A)/2, con el ángulo doble. Si escribes cos A en vez de cos 2A, todos los ángulos salen a la mitad.' : F.f1 === 'cos' && F.f2 === 'cos' ? 'Degradaste mal: cos² A = (1 + cos 2A)/2, con el ángulo doble. Si escribes cos A en vez de cos 2A, todos los ángulos salen a la mitad.' : 'Degradaste mal: cos² A = (1 + cos 2A)/2 y sen² B = (1 − cos 2B)/2, con el ángulo doble. Si escribes cos A en vez de cos 2A, todos los ángulos salen a la mitad.'),
      pa('TR21-solo-primer-factor', tomar(porFac[0]), `Te quedaste con ${facTxt(fac[0])} y olvidaste el otro factor; cualquiera de los dos puede ser cero.`),
      pa('TR21-solo-segundo-factor', tomar(porFac[1]), `Te quedaste con ${facTxt(fac[1])} y olvidaste el otro factor; cualquiera de los dos puede ser cero.`),
    ];
    if (porFac[0].length + porFac[1].length > sols.length) errores.push(h('TE-repite-comunes', pide === 'cuantas' ? porFac[0].length + porFac[1].length : sumar(conv(porFac[0])) + sumar(conv(porFac[1])), 'Contaste dos veces los valores que anulan a los dos factores a la vez.'));
    if (F.fac === 'sen') errores.push(hi('TR21-incluye-extremo', pide === 'cuantas' ? sols.length + 1 : correcta + (enT ? 12 : 360), `Contaste también el extremo ${enT ? 't = 12' : 'x = ' + angTxt(360, modo)}, que el intervalo deja fuera.`));
    const variables = { A: { nombre: 'primer ángulo', color: 'o' }, B: { nombre: 'segundo ángulo', color: 'i' }, x: { nombre: enT ? 'instantes' : 'soluciones', color: 'd' } };
    const intervalo = enT ? '0 ≤ t < 12' : intervaloTxt(modo);
    const enunciado = enT
      ? ['En un circuito, el voltaje (en voltios) es V(t) = ', `${lhs}${F.d ? ' − 1' : ''}`, ', con t en segundos y ', intervalo, '.']
      : ['Resuelve ', `${lhs} = ${F.d}`, ` en el intervalo ${intervalo}.`];
    const pregunta = [enT ? '¿Cuánto suman los instantes en que el voltaje se anula?' : preguntaDe(pide)];
    const valoresTxt = xs => (enT ? conv(xs).map(f).join('; ') : lista(xs, modo));
    const solucion = [
      ['Degrada cada cuadrado con el ángulo doble, con ', v('A', `A = ${argA}`), ' y ', v('B', `B = ${argB}`), `: ${F.idea}.`],
      [`Transforma a producto: ${F.fac === 'cos' ? `2 cos(A + B)·cos(A − B) = 0` : `${F.menos ? '−' : ''}2 sen(A + B)·sen(A − B) = 0`}, o sea ${facTxt(fac[0])} o ${facTxt(fac[1])}.`],
      [`${facTxt(fac[0])} da ${valoresTxt(porFac[0])}; ${facTxt(fac[1])} da ${valoresTxt(porFac[1])}.`],
      ['Juntas, sin repetir: ', v('x', valoresTxt(sols)), '.'],
      [pide === 'cuantas' ? 'Son ' : 'La suma es ', v('x', pide === 'cuantas' ? cuantasTxt(correcta) : enT ? `${f(correcta)} s` : angTxt(correcta, modo)), '.'],
    ];
    const m = pide === 'cuantas' ? 'cuantas' : modo;
    return cerrar(rng, semilla, { modo: m, correcta, errores, variables, enunciado, pregunta, solucion,
      datos: { tipo: 'degradar', f1: F.f1, p, signo: F.signo, f2: F.f2, q, d: F.d, modo: m, pide } });
  }

  // ---------- cuadrática en coseno o en seno ----------
  const VALIDAS = ['1/2', '-1/2', '1', '-1', '0'];
  const IMPOSIBLES = ['2', '-2', '3/2', '-3/2', '3'];
  const fr = t => { const neg = t.startsWith('-'), [n, d] = (neg ? t.slice(1) : t).split('/'); return [(neg ? -1 : 1) * Number(n), d ? Number(d) : 1]; };
  // y(t) = α sen²(πt/q) + β cos(πt/q) con 0 ≤ t < T = 2q·vueltas (vueltas = 1, 3/2, 2 o 3).
  const VALIDAS_C = ['1/2', '-1/2', '0', '1/2', '-1/2', '1', '-1', '0'];
  const arcoT = q => (q === 1 ? 'πt' : `πt/${q}`);
  function cuadCoseno(rng, semilla) {
    const r1 = rng.elegir(VALIDAS_C);
    const r2 = rng.moneda() ? rng.elegir(IMPOSIBLES) : rng.elegir(VALIDAS.filter(x => x !== r1));
    const [n1, d1] = fr(r1), [n2, d2] = fr(r2);
    const A = d1 * d2, B = -(d1 * n2 + d2 * n1), C = n1 * n2; // A c² + B c + C = 0
    // Con sen² x = 1 − cos² x: A sen² x − B cos x = A + C.
    const alfa = A, beta = -B, gamma = A + C;
    if (beta === 0) return null;
    const q = rng.elegir([3, 4, 6]), vueltas = rng.elegir([1, 1.5, 2, 3]), T = 2 * q * vueltas, H = 360 * vueltas;
    const arco = arcoT(q), aT = x => x * q / 180;
    const raices = [r1, r2].filter(posible);
    const contar = h0 => limpiar([].concat(...raices.map(r => soluciones('cos', r, 1, 0, 0, h0)))).length;
    const correcta = contar(H);
    if (!correcta) return null;
    const errores = [];
    if (!posible(r2)) errores.push(pa('TR21-cuenta-imposible', correcta + 2 * vueltas, `Contaste cos(${arco}) = ${menos(r2)} como si tuviera soluciones. El coseno nunca pasa de 1 ni baja de −1: esa raíz se descarta.`));
    errores.push(h('TE-cuenta-raices', 2, 'Contaste las raíces de la ecuación de segundo grado, no los instantes. Cada valor posible del coseno se alcanza en varios instantes.'));
    errores.push(hi('TR22-una-por-raiz', raices.reduce((n, r) => n + familias('cos', r, 1, 0, 0, H)[0].length, 0), 'Tomaste un solo ángulo por cada valor del coseno y por vuelta. Salvo en 1 y −1, el coseno toma cada valor dos veces por vuelta.'));
    if (vueltas !== 1) errores.push(h('TE-una-vuelta', contar(360), `Contaste solo una vuelta (0 ≤ t < ${2 * q}). En 0 ≤ t < ${f(T)}, el ángulo ${arco} da ${f(vueltas)} vueltas.`));
    if (!Number.isInteger(vueltas)) errores.push(h('TE-vueltas-completas', contar(360 * Math.ceil(vueltas)), `Contaste ${Math.ceil(vueltas)} vueltas completas. En 0 ≤ t < ${f(T)}, el ángulo ${arco} da ${f(vueltas)} vueltas: la última queda por la mitad.`));
    if (q !== 6) errores.push(h('TE-periodo-12', contar(30 * T), `Tomaste el periodo como 12 s, como si el ángulo fuera πt/6. Con ${arco}, una vuelta dura ${2 * q} s.`));
    if (raices.some(r => r === '1' || r === '-1')) errores.push(h('TE-extremo-doble', correcta + raices.filter(r => r === '1' || r === '-1').reduce((n, r) => n + soluciones('cos', r, 1, 0, 0, H).length, 0), 'Contaste dos ángulos por vuelta para cos = 1 (o −1). Ahí el coseno llega a su tope una sola vez por vuelta.'));
    if (raices.some(r => soluciones('cos', r, 1, 0, H, H + 1).some(x => Math.abs(x - H) < 1e-9))) errores.push(hi('TR21-incluye-extremo', correcta + 1, `Contaste también t = ${f(T)}, que el intervalo deja fuera.`));
    const variables = { a: { nombre: 'valor dado', color: 'o' }, c: { nombre: 'coseno', color: 'i' }, x: { nombre: 'instantes', color: 'd' } };
    const expr = poli([[alfa, `sen²(${arco})`], [beta, `cos(${arco})`]]);
    const enunciado = ['Un sensor registra la señal y(t) = ', expr, ', con t en segundos. ', `Se observa durante 0 ≤ t < ${f(T)}.`];
    const pregunta = ['¿Cuántas veces, en ese tiempo, la señal toma el valor ', v('a', f(gamma)), '?'];
    const sols = limpiar([].concat(...raices.map(r => soluciones('cos', r, 1, 0, 0, H))));
    const solucion = [
      [`Cambia sen² por 1 − cos²: ${alfa === 1 ? '' : f(alfa)}(1 − cos²) ${beta < 0 ? '−' : '+'} ${Math.abs(beta) === 1 ? '' : f(Math.abs(beta)) + ' '}cos = `, v('a', f(gamma)), ` ⇒ ${poli([[A, 'c²'], [B, 'c'], [C, '']])} = 0, con c = cos(${arco}).`],
      ['Factoriza: ', v('c', `c = ${menos(r1)}`), ' o ', v('c', `c = ${menos(r2)}`), '.'],
      posible(r2) ? ['Las dos raíces están entre −1 y 1: las dos valen.'] : [`c = ${menos(r2)} es imposible (el coseno está entre −1 y 1): se descarta.`],
      [`En 0 ≤ t < ${f(T)} el ángulo ${arco} va de 0° a ${f(H)}° (${f(vueltas)} ${vueltas === 1 ? 'vuelta' : 'vueltas'}): `, v('x', `t = ${sols.map(x => f(aT(x))).join('; ')}`), '.'],
      ['Son ', v('x', cuantasTxt(correcta, 'veces')), '.'],
    ];
    return cerrar(rng, semilla, { modo: 'cuantas', palabra: 'veces', correcta, errores, variables, enunciado, pregunta, solucion,
      datos: { tipo: 'cuadratica', sub: 'coseno', alfa, beta, gamma, q, T, pide: 'cuantas' } });
  }

  // Dos señales que coinciden: s1 = A sen x + B (escrita con reducción) y s2 = cos 2x, x = πt/6.
  const RAICES_S = ['1/2', '-1/2', '1', '-1', '2', '-2', '3/2', '-3/2'];
  function senales(rng, semilla) {
    const r1 = rng.elegir(RAICES_S), r2 = rng.elegir(RAICES_S.filter(r => r !== r1));
    const v1 = valorK(r1), v2 = valorK(r2);
    const A = -2 * (v1 + v2), B = 1 + 2 * v1 * v2;
    if (!Number.isInteger(A) || !Number.isInteger(B) || A === 0) return null;
    if (![r1, r2].some(posible)) return null;
    const forma = rng.elegir(['directa', 'pi-menos', 'pi-mas', 'cos-menos']);
    const Aesc = forma === 'pi-mas' ? -A : A;
    const T = rng.elegir([12, 18, 24, 36]), vueltas = T / 12;
    const pide = rng.elegir(['cuantas', 'suma']);
    const validas = [r1, r2].filter(posible);
    const porRaiz = validas.map(r => soluciones('sen', r, 1, 0, 0, 360 * vueltas));
    const sols = limpiar([].concat(...porRaiz));
    const ts = sols.map(x => x / 30);
    const tomar = xs => (pide === 'cuantas' ? xs.length : sumar(xs.map(x => x / 30)));
    const correcta = tomar(sols);
    if (!(correcta > 0)) return null;
    const errores = [];
    if (forma !== 'directa') {
      const neg = limpiar([].concat(...[r1, r2].map(opuesto).filter(posible).map(r => soluciones('sen', r, 1, 0, 0, 360 * vueltas))));
      const mal = { 'pi-menos': 'sen(π − x) = sen x (el seno es positivo en el II cuadrante), no −sen x', 'pi-mas': 'sen(π + x) = −sen x (en el III cuadrante el seno es negativo), no sen x', 'cos-menos': 'cos(x − π/2) = sen x, no −sen x' }[forma];
      errores.push(hi('TR14-reduccion-con-signo', tomar(neg), `Redujiste mal: ${mal}. Con el signo cambiado, las raíces salen con el signo opuesto.`));
    }
    errores.push(hi('TR22-una-raiz', tomar(porRaiz[0]), `Usaste solo sen(πt/6) = ${menos(validas[0])}${validas.length > 1 ? ` y olvidaste sen(πt/6) = ${menos(validas[1])}` : ' y no buscaste todos sus instantes'}.`));
    if (validas.length < 2 && pide === 'cuantas') errores.push(pa('TR21-cuenta-imposible', correcta + 2 * vueltas, `Contaste sen = ${menos([r1, r2].find(r => !posible(r)))} como si tuviera soluciones. El seno está entre −1 y 1: esa raíz se descarta.`));
    if (vueltas !== 1) errores.push(h('TE-una-vuelta', tomar(sols.filter(x => x < 360)), `Tomaste solo los primeros 12 segundos. En 0 ≤ t < ${T}, el ángulo πt/6 da ${f(vueltas)} vueltas.`));
    if (!Number.isInteger(vueltas)) errores.push(h('TE-vueltas-completas', tomar(limpiar([].concat(...validas.map(r => soluciones('sen', r, 1, 0, 0, 360 * Math.ceil(vueltas)))))), `Contaste ${Math.ceil(vueltas)} vueltas completas; en ${T} s el ángulo πt/6 da ${f(vueltas)} vueltas.`));
    errores.push(h('TE-cuenta-raices', pide === 'cuantas' ? 2 : NaN, 'Contaste las raíces de la ecuación de segundo grado, no los instantes.'));
    const negs = [r1, r2].filter(r => r.startsWith('-') && posible(r));
    if (negs.length) errores.push(pa('TR12-sin-signo', tomar(limpiar([].concat(...validas.map(r => (r.startsWith('-') ? opuesto(r) : r)).map(r => soluciones('sen', r, 1, 0, 0, 360 * vueltas))))), 'Tomaste los ángulos del valor sin signo. Un seno negativo pone el ángulo en el III o el IV cuadrante.'));
    const x = 'πt/6';
    const escrita = { directa: `sen(${x})`, 'pi-menos': `sen(π − ${x})`, 'pi-mas': `sen(π + ${x})`, 'cos-menos': `cos(${x} − π/2)` }[forma];
    const s1 = poli([[Aesc, escrita], [B, '']]);
    const variables = { s: { nombre: 'seno', color: 'i' }, r: { nombre: 'raíces', color: 'o' }, t: { nombre: 'instantes', color: 'd' } };
    const enunciado = ['Dos señales de un equipo varían con el tiempo t (en segundos) según s₁(t) = ', s1, ' y s₂(t) = cos(πt/3). ', `Se observan durante 0 ≤ t < ${T}.`];
    const pregunta = [pide === 'cuantas' ? '¿Cuántas veces coinciden las dos señales en ese tiempo?' : '¿Cuánto suman los instantes en que las dos señales coinciden?'];
    const solucion = [
      [`Reduce: s₁ = ${poli([[A, 'sen(πt/6)'], [B, '']])}. Y cos(πt/3) = 1 − 2 sen²(πt/6).`],
      ['Con ', v('s', `s = sen(πt/6)`), `: ${poli([[A, 's'], [B, '']])} = 1 − 2s² ⇒ ${poli([[2, 's²'], [A, 's'], [B - 1, '']])} = 0.`],
      ['Raíces: ', v('r', `s = ${menos(r1)}`), ' y ', v('r', `s = ${menos(r2)}`), `${validas.length < 2 ? `; s = ${menos([r1, r2].find(r => !posible(r)))} no puede ser un seno y se descarta` : ''}.`],
      [`En 0 ≤ t < ${T} el ángulo πt/6 da ${f(vueltas)} vuelta${vueltas !== 1 ? 's' : ''}: `, v('t', `t = ${ts.map(f).join('; ')}`), '.'],
      [pide === 'cuantas' ? 'Coinciden ' : 'La suma es ', v('t', pide === 'cuantas' ? cuantasTxt(correcta, 'veces') : `${f(correcta)} s`), '.'],
    ];
    return cerrar(rng, semilla, { modo: pide === 'cuantas' ? 'cuantas' : 'segundos', palabra: 'veces', correcta, errores, variables, enunciado, pregunta, solucion,
      datos: { tipo: 'cuadratica', sub: 'senales', forma, Aesc, B, T, pide } });
  }

  // ---------- cúbica en coseno (o en seno) con secante (o cosecante) ----------
  // forma 'cos': cos 3x · sec x = k ⇒ 4cos² x − 3 = k (cos x ≠ 0); forma 'sen': sen 3x · csc x = k ⇒
  // 3 − 4sen² x = k (sen x ≠ 0).
  const CUB = { cos: { '-2': '1/2', '-1': '√2/2', '0': '√3/2', '1': '1' }, sen: { '2': '1/2', '1': '√2/2', '0': '√3/2', '-1': '1' } };
  function cubica(rng, semilla) {
    const forma = rng.elegir(['cos', 'sen']), fn = forma, rec = forma === 'cos' ? 'sec' : 'csc';
    const k = Number(rng.elegir(Object.keys(CUB[forma]))), cK = CUB[forma][String(k)];
    const pide = rng.elegir(['cuantas', 'cuantas', 'suma', 'cisterna']);
    const H = pide === 'cisterna' ? 360 : rng.elegir([360, 360, 180, 720]);
    const modo = pide === 'cuantas' ? 'cuantas' : pide === 'cisterna' ? 'cisterna' : rng.elegir(['grados', 'radianes']);
    const mAng = modo === 'radianes' || modo === 'cisterna' ? 'radianes' : 'grados';
    const pos = soluciones(fn, cK, 1, 0, 0, H), neg = soluciones(fn, opuesto(cK), 1, 0, 0, H);
    const sols = limpiar([...pos, ...neg]);
    if (!sols.length) return null;
    const prohib = soluciones(fn, '0', 1, 0, 0, H);
    const conProh = limpiar([...sols, ...prohib]);
    const kKey = { 1: '1', 0: '0', '-1': '-1' }[String(k)];
    const sinRec = kKey ? soluciones(fn, kKey, 3, 0, 0, H) : [];
    const c2 = forma === 'cos' ? P.frac(3 + k, 4) : P.frac(3 - k, 4);
    const ident = forma === 'cos' ? 'cos 3x = 4 cos³ x − 3 cos x' : 'sen 3x = 3 sen x − 4 sen³ x';
    const cociente = forma === 'cos' ? '4 cos² x − 3' : '3 − 4 sen² x';
    const intervalo = mAng === 'radianes' ? `0 ≤ x < ${rad(H)}` : `0° ≤ x < ${H}°`;
    const variables = { k: { nombre: 'valor dado', color: 'o' }, c: { nombre: forma === 'cos' ? 'coseno' : 'seno', color: 'i' }, x: { nombre: 'soluciones', color: 'd' }, V: { nombre: 'volumen', color: 'h' } };
    const enunciado = ['Considera la ecuación ', `${fn} 3x · ${rec} x = `, v('k', menos(String(k))), `, con ${intervalo}.`];
    const pasos = [
      [`Como ${rec} x = 1/${fn} x, hace falta ${fn} x ≠ 0: fuera ${lista(prohib, mAng)}.`],
      [`Con ${ident}, la ecuación queda ${cociente} = `, v('k', menos(String(k))), ' ⇒ ', v('c', `${fn}² x = ${P.textoFraccion(c2)}`), ` (el factor ${fn} x se simplifica porque no es cero).`],
      ['Entonces ', v('c', `${fn} x = ±${cK}`), ': ', v('x', `x = ${lista(sols, mAng)}`), '.'],
    ];
    const prohTxt = lista(prohib, mAng);
    const explProh = `Dejaste ${prohTxt}. Ahí ${fn} x = 0 y la ${rec === 'sec' ? 'secante' : 'cosecante'} no existe: no son soluciones.`;
    const explPos = `De ${fn}² x = ${P.textoFraccion(c2)} tomaste solo ${fn} x = ${cK}. También vale ${fn} x = −${cK}.`;
    const explSin = `Resolviste ${fn} 3x = ${menos(String(k))}, como si la ${rec === 'sec' ? 'secante' : 'cosecante'} no estuviera.`;
    let correcta, errores, pregunta, solucion;
    if (pide === 'cisterna') {
      const h0 = rng.elegir([2, 3, 4, 5]);
      const vol = sumaG => { const S = sumaG * Math.PI / 180, r = S / (2 * Math.PI); return Math.PI * r * r * h0; };
      const S = sumar(sols);
      correcta = vol(S);
      if (!P.pi(correcta, '', 12)) return null;
      errores = [
        pa('TR21-incluye-prohibidas', vol(sumar(conProh)), explProh),
        h('TE-solo-raiz-positiva', vol(sumar(pos)), explPos),
        h('TE-perimetro-pi-r', Math.PI * (S * Math.PI / 180 / Math.PI) ** 2 * h0, 'Usaste perímetro = π·r. El perímetro de una circunferencia es 2π·r.'),
        h('TE-volumen-sin-cuadrado', Math.PI * (S * Math.PI / 180 / (2 * Math.PI)) * h0, 'Calculaste π·r·h: el volumen del cilindro es π·r²·h, con el radio al cuadrado.'),
      ];
      if (sinRec.length) errores.push(h('TE-olvida-sec', vol(sumar(sinRec)), explSin));
      const r = S * Math.PI / 180 / (2 * Math.PI);
      enunciado.push(` La suma S de sus soluciones (en radianes), leída en metros, es el perímetro de la base circular de una cisterna de ${h0} m de altura.`);
      pregunta = ['¿Cuál es el ', v('V', 'volumen'), ' de la cisterna?'];
      solucion = [...pasos,
        ['S = ', `${rad(S)}`, ` m = 2π·r ⇒ r = ${f(r)} m.`],
        [v('V', 'V'), ` = π·r²·h = π·${f(r * r)}·${h0} = `, v('V', P.pi(correcta, 'm³')), '.']];
      return cerrar(rng, semilla, { modo: 'cisterna', texto: x => P.pi(x, 'm³'), unidad: 'm³', correcta, errores: errores.filter(e => P.pi(e.valor, '', 12)), variables, enunciado, pregunta, solucion,
        datos: { tipo: 'cubica', forma, k, hasta: H, modo: 'cisterna', pide, h: h0 } });
    }
    const tomar = xs => (pide === 'cuantas' ? xs.length : sumar(xs));
    correcta = tomar(sols);
    if (!(correcta > 0)) return null;
    errores = [pa('TR21-incluye-prohibidas', tomar(conProh), explProh), h('TE-solo-raiz-positiva', tomar(pos), explPos)];
    if (sinRec.length) errores.push(h('TE-olvida-sec', tomar(sinRec), explSin));
    if (pide === 'cuantas') errores.push(h('TE-raices-cubica', 3, `Contaste las raíces de la cúbica en ${fn} x, no los ángulos. Además, la raíz ${fn} x = 0 no vale.`));
    if ([cK, opuesto(cK)].some(r => soluciones(fn, r, 1, 0, H, H + 1).some(x => Math.abs(x - H) < 1e-9))) errores.push(hi('TR21-incluye-extremo', pide === 'cuantas' ? correcta + 1 : correcta + H, `Contaste también x = ${angTxt(H, mAng)}, que el intervalo deja fuera.`));
    if (H !== 360) errores.push(h('TE-una-vuelta-fija', tomar(limpiar([...soluciones(fn, cK, 1, 0, 0, 360), ...soluciones(fn, opuesto(cK), 1, 0, 0, 360)])), `Resolviste en una vuelta, 0 ≤ x < ${angTxt(360, mAng)}. El intervalo pedido es ${intervalo}.`));
    errores.push(h('TE-cuenta-una-por-raiz', pide === 'cuantas' ? 2 : NaN, `Contaste un ángulo por cada valor del ${fn === 'cos' ? 'coseno' : 'seno'}. Salvo ±1, cada valor aparece dos veces por vuelta.`));
    pregunta = [preguntaDe(pide)];
    solucion = [...pasos, [pide === 'cuantas' ? 'Son ' : 'La suma es ', v('x', pide === 'cuantas' ? cuantasTxt(correcta) : angTxt(correcta, modo)), '.']];
    return cerrar(rng, semilla, { modo, correcta, errores, variables, enunciado, pregunta, solucion,
      datos: { tipo: 'cubica', forma, k, hasta: H, modo, pide } });
  }

  // ---------- tangente de una suma con restricciones ----------
  const TANG = [
    { p: 2, q: 1, signo: 1 }, { p: 3, q: 1, signo: 1 }, { p: 1, q: 1, signo: 1 }, { p: 3, q: 1, signo: -1 }, { p: 5, q: 2, signo: -1 },
  ];
  const prohibido = (x, a) => Math.abs(((a * x - 90) / 180) - Math.round((a * x - 90) / 180)) < 1e-9;
  function tangente(rng, semilla) {
    const T = rng.elegir(TANG), M = T.p + T.signo * T.q, k = rng.elegir(Object.keys(NOT.tan));
    const modo = rng.elegir(['grados', 'radianes']), pide = rng.elegir(['cuantas', 'suma', 'menor']);
    const todas = soluciones('tan', k, M, 0, 0, 360);
    const malas = todas.filter(x => prohibido(x, T.p) || prohibido(x, T.q));
    const sols = todas.filter(x => !malas.includes(x));
    if (!malas.length && rng.sig() < 0.75) return null;
    if (!multiplo5(todas) || sols.length < 2) return null;
    const correcta = pedido(sols, pide);
    if (!(correcta > 0)) return null;
    const tomar = xs => pedido(xs, pide);
    const fuera = xs => xs.filter(x => !(prohibido(x, T.p) || prohibido(x, T.q)));
    const errores = [];
    if (malas.length) errores.push(pa('TR21-fuera-del-dominio', tomar(todas), `Dejaste ${lista(malas, modo)}: ahí ${prohibido(malas[0], T.p) ? `tan ${xk(T.p)}` : `tan ${xk(T.q)}`} no existe, así que la expresión de la izquierda no está definida. Se descarta.`));
    errores.push(hi('TR22-solo-principal', tomar(fuera(soluciones('tan', k, M, 0, 0, 360 / M + 1e-6).filter(x => x < 180 / M + 1e-9))), `Tomaste solo el primer ángulo. La tangente se repite cada ${angTxt(180, modo)} del argumento: ${xk(M)} = ${angTxt(NOT.tan[k], modo)} + ${angTxt(180, modo)}·n, y recién se divide entre ${M}.`));
    errores.push(h('TE-periodo-360', tomar(fuera(todas.filter(x => Math.abs(((M * x - NOT.tan[k]) / 360) - Math.round((M * x - NOT.tan[k]) / 360)) < 1e-9))), 'Repetiste el ángulo cada 360° del argumento, como el seno. La tangente se repite cada 180°: faltan la mitad de las soluciones.'));
    if (k.startsWith('-')) errores.push(pa('TR12-sin-signo', tomar(fuera(soluciones('tan', opuesto(k), M, 0, 0, 360))), `Resolviste con ${menos(opuesto(k))}, sin el signo. La tangente negativa está en el II y IV cuadrante.`));
    if (T.signo > 0 && T.p !== T.q) errores.push(h('TE-producto-por-suma', tomar(fuera(soluciones('tan', k, T.p * T.q, 0, 0, 360))), `Juntaste los ángulos multiplicándolos (${xk(T.p * T.q)}). La fórmula de la tangente de una suma da tan(${xk(T.p)} + ${xk(T.q)}) = tan ${xk(M)}.`));
    const tp = `tan ${xk(T.p)}`, tq = `tan ${xk(T.q)}`;
    const lhs = T.p === T.q ? `(2 tan x)/(1 − tan² x)` : `(${tp} ${T.signo > 0 ? '+' : '−'} ${tq})/(1 ${T.signo > 0 ? '−' : '+'} ${tp} · ${tq})`;
    const variables = { M: { nombre: 'ángulo juntado', color: 'o' }, k: { nombre: 'valor', color: 'i' }, x: { nombre: 'soluciones', color: 'd' }, mal: { nombre: 'valores prohibidos', color: 'h' } };
    const enunciado = ['Resuelve ', lhs, ' = ', v('k', menos(k)), ` en el intervalo ${intervaloTxt(modo)}.`];
    const solucion = [
      ['Es la tangente de ', T.signo > 0 ? 'una suma' : 'una diferencia', ': ', v('M', `tan ${xk(M)}`), ' = ', v('k', menos(k)), '.'],
      [`tan ${xk(M)} = ${menos(k)} ⇒ ${xk(M)} = ${angTxt(NOT.tan[k], modo)} + ${angTxt(180, modo)}·n ⇒ x = ${lista(todas, modo)}.`],
      [`Para que la expresión exista, deben existir tan ${xk(T.p)}${T.p !== T.q ? ` y tan ${xk(T.q)}` : ''}: `, malas.length ? v('mal', `se descarta ${lista(malas, modo)}`) : 'ninguna solución se descarta', '.'],
      ['Quedan ', v('x', lista(sols, modo)), '.'],
      [{ cuantas: 'Son ', suma: 'La suma es ', menor: 'La menor positiva es ' }[pide], v('x', pide === 'cuantas' ? cuantasTxt(correcta) : angTxt(correcta, modo)), '.'],
    ];
    return cerrar(rng, semilla, { modo: pide === 'cuantas' ? 'cuantas' : modo, correcta, errores, variables, enunciado, pregunta: [preguntaDe(pide)], solucion,
      datos: { tipo: 'tangente', p: T.p, q: T.q, signo: T.signo, k, modo: pide === 'cuantas' ? 'cuantas' : modo, pide } });
  }

  // Funciones de cálculo puras (las usa papel.json).
  const calc = {
    soluciones: (fn, k, a = 1, b = 0, desde = 0, hasta = 360) => resumen(soluciones(fn, k, a, b, desde, hasta)),
    union: (factores, hasta = 360) => resumen(limpiar([].concat(...factores.map(([fn, k, a, b]) => soluciones(fn, k, a, b || 0, 0, hasta))))),
    cuadraticaCoseno: (r1, r2, hasta = 360) => resumen(limpiar([].concat(...[r1, r2].filter(posible).map(r => soluciones('cos', r, 1, 0, 0, hasta))))),
    cuadraticaSeno: (r1, r2, hasta = 360) => resumen(limpiar([].concat(...[r1, r2].filter(posible).map(r => soluciones('sen', r, 1, 0, 0, hasta))))),
    cubicaSecante: k => { const c = CUB.cos[String(k)]; return resumen(limpiar([...soluciones('cos', c, 1, 0, 0, 360), ...soluciones('cos', opuesto(c), 1, 0, 0, 360)])); },
    tangenteSuma: (p, q, signo, k) => { const M = p + signo * q; return resumen(soluciones('tan', k, M, 0, 0, 360).filter(x => !(prohibido(x, p) || prohibido(x, q)))); },
    temperatura: (c, p, q, valor) => {
      // p sen u + q cos u = R sen(u + φ); los instantes t (horas) con 0 ≤ t < 24.
      const R = Math.hypot(p, q), phi = Math.round(Math.atan2(q, p) * 180 / Math.PI * 1e6) / 1e6;
      const s = (valor - c) / R, clave = Object.keys(NOT.sen).find(key => Math.abs(valorK(key) - s) < 1e-9);
      const ts = soluciones('sen', clave, 1, phi, 0, 360).map(x => x / 15);
      return { R, phi, instantes: ts, cuantas: ts.length, suma: sumar(ts) };
    },
  };

  return { id: ID, titulo: 'Ecuaciones trigonométricas en un intervalo', generar, calc };
});
