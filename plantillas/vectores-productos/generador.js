/*
 * Generador G3: producto escalar y producto vectorial.
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['vectores-productos']) y en Node (require).
 *
 * Tipos (docs/clasificacion/compendio-vectores.md, T13):
 *   escalar         A·B con componentes enteras en 2D o 3D (puede salir negativo o cero)
 *   angulo          el ángulo entre A y B, con vectores elegidos para que el coseno sea notable
 *   perpendicular   el valor de m que hace A ⊥ B (A·B = 0)
 *   vectorial-z     A y B en el plano xy: A × B = c·k; se pide c (con signo)
 *   modulo-cruz     |A × B| a partir de |A|, |B| y A·B
 *   area            área del triángulo de vértices enteros en el plano
 *
 * Convención de academia: cos 37° = 4/5 y cos 53° = 3/5. Errores: hipótesis nuestras.
 * Necesita la opción negativos de nucleo/predicciones.js (respuestas con signo).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const h = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente: null });
  const f = x => P.formatear(x, 2);
  const esEntero = x => Math.abs(x - Math.round(x)) < 1e-9;
  // "√24 = 2√6", "√25 = 5" o solo "√13".
  const raizDe = n => { const t = P.radical(Math.sqrt(n)); return t === `√${n}` ? t : `√${n} = ${t}`; };
  const TIPOS = ['escalar', 'angulo', 'perpendicular', 'vectorial-z', 'modulo-cruz', 'area'];

  // Vector con i, j, k: (2, −3, 1) → "2i − 3j + k".
  function ijk(c) {
    const ej = ['i', 'j', 'k'];
    let s = '';
    c.forEach((n, q) => {
      if (n === 0) return;
      const abs = Math.abs(n), t = (abs === 1 ? '' : abs) + ej[q];
      s += s === '' ? (n < 0 ? '−' : '') + t : (n < 0 ? ' − ' : ' + ') + t;
    });
    return s || '0';
  }
  const par = c => `(${c.map(n => f(n)).join('; ')})`;
  const dot = (a, b) => a.reduce((s, x, q) => s + x * b[q], 0);
  const norma2 = a => dot(a, a);

  // Coseno notable → ángulo (convención de academia).
  const NOTABLES = [[1 / 2, 60], [-1 / 2, 120], [4 / 5, 37], [3 / 5, 53], [-3 / 5, 127], [-4 / 5, 143],
    [Math.sqrt(3) / 2, 30], [-Math.sqrt(3) / 2, 150]];
  // Pares (A, B) con componentes de −4 a 4 cuyo coseno es notable. Se arman una sola vez.
  let PARES = null;
  function pares() {
    if (PARES) return PARES;
    PARES = [];
    const r = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
    const v2 = [], v3 = [];
    for (const x of r) for (const y of r) { if (x || y) v2.push([x, y, 0]); for (const z of r) if ((x || y || z) && z !== 0) v3.push([x, y, z]); }
    const probar = (lista, dim) => {
      for (let i = 0; i < lista.length; i++) for (let j = 0; j < lista.length; j++) {
        const a = lista[i], b = lista[j];
        const c = dot(a, b) / Math.sqrt(norma2(a) * norma2(b));
        for (const [val, t] of NOTABLES) if (Math.abs(c - val) < 1e-12) PARES.push({ a, b, t, dim });
      }
    };
    probar(v2, 2);
    probar(v3.concat(v2.filter(v => v[0] && v[1])), 3);
    PARES = PARES.filter(p => p.dim === 2 || p.a[2] || p.b[2]);
    return PARES;
  }

  function generar(semilla) {
    const rng = Azar.crear('vectores-productos|' + semilla);
    const tipo = rng.elegir(TIPOS);
    for (let intento = 0; intento < 500; intento++) {
      const pr = construir(rng, semilla, tipo);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  function vecAzar(rng, dim, cero = false) {
    for (;;) {
      const c = [rng.entero(-5, 5), rng.entero(-5, 5), dim === 3 ? rng.entero(-5, 5) : 0];
      if (!cero && c.filter(n => n !== 0).length < dim) continue;
      return c;
    }
  }

  function construir(rng, semilla, tipo) {
    const v = P.v;
    const variables = { A: { nombre: 'vector A', color: 'o' }, B: { nombre: 'vector B', color: 'i' }, t: { nombre: 'ángulo entre A y B', color: 'h' }, X: { nombre: 'lo que se pide', color: 'd' } };
    let enunciado, pregunta, correcta, errores, solucion, texto = x => f(x), unidad = '', datos;

    if (tipo === 'escalar') {
      const dim = rng.elegir([2, 3, 3]);
      const a = vecAzar(rng, dim), b = vecAzar(rng, dim);
      correcta = dot(a, b);
      const prods = a.map((x, q) => x * b[q]).slice(0, dim);
      const cruzado = dim === 2 ? a[0] * b[1] + a[1] * b[0] : a[0] * b[1] + a[1] * b[2] + a[2] * b[0];
      enunciado = ['Se tienen los vectores ', v('A', `A = ${ijk(a)}`), ' y ', v('B', `B = ${ijk(b)}`), '.'];
      pregunta = ['¿Cuánto vale el producto escalar A·B?'];
      errores = [
        h('VE-escalar-sin-signos', prods.reduce((s, x) => s + Math.abs(x), 0), 'Sumaste los productos sin sus signos. Cada producto aᵢbᵢ conserva su signo: (−2)·3 = −6 resta.'),
        h('VE-escalar-cruzado', cruzado, 'Multiplicaste componentes cruzadas (x con y). El producto escalar junta x con x, y con y, z con z.'),
        h('VE-escalar-como-suma', a.slice(0, dim).reduce((s, x, q) => s + x + b[q], 0), 'Sumaste las componentes en vez de multiplicarlas.'),
        h('VE-escalar-signo-final', -correcta, 'Cambiaste el signo del resultado al sumar los productos.'),
      ];
      solucion = [
        ['El producto escalar multiplica componente por componente y suma: A·B = AₓBₓ + A_yB_y', dim === 3 ? ' + A_zB_z.' : '.'],
        ['A·B = ', a.slice(0, dim).map((x, q) => `(${f(x)})(${f(b[q])})`).join(' + '), ` = ${prods.map(f).join(' + ').replace(/\+ −/g, '− ')}.`],
        ['A·B = ', v('X', f(correcta)), correcta === 0 ? ': A y B son perpendiculares.' : correcta < 0 ? ': es negativo, así que el ángulo entre A y B es obtuso.' : ': es positivo, así que el ángulo entre A y B es agudo.'],
      ];
      datos = { tipo, a, b };
    } else if (tipo === 'angulo') {
      const p = rng.elegir(pares());
      const a = p.a, b = p.b;
      correcta = p.t; texto = x => `${f(x)}°`; unidad = '°';
      const ab = dot(a, b), na = norma2(a), nb = norma2(b);
      enunciado = ['Se tienen los vectores ', v('A', `A = ${ijk(a)}`), ' y ', v('B', `B = ${ijk(b)}`), '.'];
      pregunta = ['¿Qué ángulo forman A y B?'];
      errores = [
        h('VE-signo-del-escalar', 180 - p.t, `Tomaste A·B sin su signo. ${ab < 0 ? 'A·B es negativo: el ángulo es obtuso.' : 'A·B es positivo: el ángulo es agudo.'}`),
        h('VE-escalar-por-vectorial', Math.abs(90 - p.t), 'Usaste el resultado como seno en vez de coseno. A·B = |A||B|·cos θ; el seno va con |A × B|.'),
        h('VE-perpendicular-sin-escalar-cero', 90, `Dos vectores son perpendiculares solo si A·B = 0, y aquí A·B = ${f(ab)}.`),
      ];
      const c = ab / Math.sqrt(na * nb);
      solucion = [
        ['De A·B = |A||B|·cos θ: cos θ = A·B / (|A||B|).'],
        ['A·B = ', `${f(ab)}; |A| = ${raizDe(na)}; |B| = ${raizDe(nb)}.`],
        [`cos θ = ${f(ab)} / ${P.radical(Math.sqrt(na * nb))} = ${P.radical(c)}${c < 0 ? ' (negativo: obtuso)' : ''}.`],
        ['θ = ', v('t', `${p.t}°`), p.t === 37 || p.t === 53 || p.t === 127 || p.t === 143 ? ' (triángulo 3-4-5 de academia).' : '.'],
      ];
      datos = { tipo, a, b };
    } else if (tipo === 'perpendicular') {
      // A = (a1, m, a3) y B = (b1, b2, b3) con b2 que divide a a1b1 + a3b3.
      const dim = rng.elegir([2, 3]);
      const b2 = rng.elegir([1, 2, -1, -2, 3]);
      const a1 = rng.entero(-5, 5), b1 = rng.entero(-5, 5);
      const a3 = dim === 3 ? rng.entero(-4, 4) : 0, b3 = dim === 3 ? rng.entero(-4, 4) : 0;
      const resto = a1 * b1 + a3 * b3;
      if (resto === 0 || resto % b2 !== 0 || a1 === 0 || b1 === 0 || (dim === 3 && (a3 === 0 || b3 === 0))) return null;
      correcta = -resto / b2;
      variables.X = { nombre: 'm', color: 'd' };
      const A = dim === 3 ? `${ijk([a1, 0, 0])} + mj ${a3 < 0 ? '−' : '+'} ${Math.abs(a3) === 1 ? '' : Math.abs(a3)}k` : `${ijk([a1, 0, 0])} + mj`;
      enunciado = ['Los vectores ', v('A', `A = ${A}`), ' y ', v('B', `B = ${ijk([b1, b2, b3])}`), ' son perpendiculares.'];
      pregunta = ['¿Cuánto vale m?'];
      errores = [
        h('VE-despeje-signo', resto / b2, 'Al pasar los términos al otro lado no les cambiaste el signo.'),
        h('VE-despeje-multiplica', -resto * b2, `Multiplicaste por ${b2} en vez de dividir.`),
        h('VE-despeje-sin-coeficiente', -resto, `Olvidaste que m va multiplicado por ${b2} (la componente y de B).`),
        h('VE-escalar-uno', (1 - resto) / b2, 'Igualaste A·B a 1. Perpendiculares quiere decir A·B = 0.'),
      ];
      solucion = [
        ['Perpendiculares ⇔ A·B = 0.'],
        ['A·B = ', `(${f(a1)})(${f(b1)}) + m·(${f(b2)})${dim === 3 ? ` + (${f(a3)})(${f(b3)})` : ''} = ${f(resto)} + ${f(b2)}m = 0.`.replace('+ −', '− ')],
        ['m = ', `${f(-resto)} / ${f(b2)} = `, v('X', f(correcta)), '.'],
      ];
      datos = { tipo, a: [a1, null, a3], b: [b1, b2, b3] };
    } else if (tipo === 'vectorial-z') {
      const a = vecAzar(rng, 2), b = vecAzar(rng, 2);
      correcta = a[0] * b[1] - a[1] * b[0];
      if (correcta === 0) return null;
      variables.X = { nombre: 'c', color: 'd' };
      enunciado = ['En el plano xy se tienen ', v('A', `A = ${ijk(a)}`), ' y ', v('B', `B = ${ijk(b)}`), '. Su producto vectorial es A × B = ', v('X', 'c'), 'k.'];
      pregunta = ['¿Cuánto vale c?'];
      errores = [
        h('VE-mano-derecha-invertida', -correcta, 'Calculaste B × A, que apunta al revés: A × B = −(B × A). Con i × j = k, la componente es AₓB_y − A_yBₓ, en ese orden.'),
        h('VE-signo-determinante', a[0] * b[1] + a[1] * b[0], 'Sumaste los dos productos cruzados. En el determinante se restan: AₓB_y − A_yBₓ.'),
        h('VE-escalar-por-vectorial', a[0] * b[0] + a[1] * b[1], 'Calculaste el producto escalar (x con x, y con y). El vectorial cruza: x con y.'),
        h('VE-vectorial-modulos', Math.abs(a[0] * b[1]) + Math.abs(a[1] * b[0]), 'Sumaste los productos cruzados sin sus signos.'),
      ];
      solucion = [
        ['Con i × j = k y j × i = −k (y i × i = j × j = 0), A × B = (AₓB_y − A_yBₓ) k.'],
        [`c = (${f(a[0])})(${f(b[1])}) − (${f(a[1])})(${f(b[0])}) = ${f(a[0] * b[1])} − (${f(a[1] * b[0])}).`],
        ['c = ', v('X', f(correcta)), correcta > 0 ? ': A × B sale de la pantalla (+k); de A a B se gira en sentido antihorario.' : ': A × B entra en la pantalla (−k); de A a B se gira en sentido horario.'],
      ];
      datos = { tipo, a, b };
    } else if (tipo === 'modulo-cruz') {
      const op = rng.elegir([
        { t: 37, s: [3, 5] }, { t: 53, s: [4, 5] }, { t: 127, s: [4, 5] }, { t: 143, s: [3, 5] },
        { t: 60, s: null }, { t: 120, s: null }, { t: 30, s: null }]);
      const cs = { 37: 4 / 5, 53: 3 / 5, 127: -3 / 5, 143: -4 / 5, 60: 1 / 2, 120: -1 / 2, 30: Math.sqrt(3) / 2 }[op.t];
      let A, B;
      for (;;) {
        A = rng.elegir([2, 4, 5, 6, 8, 10]); B = rng.elegir([2, 4, 5, 6, 8, 10, 12]);
        const ab = A * B * cs;
        if (op.t === 30) { if (esEntero(ab * ab)) break; } else if (esEntero(ab)) break;
      }
      const ab = A * B * cs;
      correcta = Math.sqrt(Math.max(0, A * A * B * B - ab * ab));
      texto = x => P.radical(x);
      const abT = op.t === 30 ? P.radical(ab) : f(ab);
      enunciado = ['Dos vectores tienen módulos ', v('A', `|A| = ${A}`), ' y ', v('B', `|B| = ${B}`), ', y su producto escalar es A·B = ', abT, '.'];
      pregunta = ['¿Cuánto mide |A × B|?'];
      errores = [
        h('VE-escalar-por-vectorial', Math.abs(ab), 'Creíste que |A × B| es igual a A·B. Uno lleva el coseno del ángulo y el otro el seno.'),
        h('VE-producto-modulos', A * B, 'Multiplicaste los módulos: eso solo vale si son perpendiculares. Falta el seno del ángulo.'),
        h('VE-identidad-con-mas', Math.sqrt(A * A * B * B + ab * ab), 'Usaste |A × B|² = |A|²|B|² + (A·B)². La identidad lleva signo menos, porque sen² θ = 1 − cos² θ.'),
        h('VE-sin-raiz', A * A * B * B - ab * ab, 'Calculaste |A × B|² y olvidaste sacar la raíz cuadrada.'),
      ];
      solucion = [
        ['A·B = |A||B|·cos θ y |A × B| = |A||B|·sen θ, con sen² θ + cos² θ = 1: |A × B|² = |A|²|B|² − (A·B)².'],
        ['|A × B|² = ', v('A', `${A}`), '²·', v('B', `${B}`), `² − (${abT})² = ${A * A * B * B} − ${f(ab * ab)} = ${f(A * A * B * B - ab * ab)}.`],
        ['|A × B| = ', v('X', P.radical(correcta)), `. (Con cos θ = ${P.radical(cs)}, θ = `, v('t', `${op.t}°`), '.)'],
      ];
      datos = { tipo, A, B, t: op.t };
    } else {
      // area: triángulo con vértices enteros en el plano.
      const pts = [0, 1, 2].map(() => [rng.entero(-4, 5), rng.entero(-4, 5)]);
      const u = [pts[1][0] - pts[0][0], pts[1][1] - pts[0][1]], w = [pts[2][0] - pts[0][0], pts[2][1] - pts[0][1]];
      const cruz = u[0] * w[1] - u[1] * w[0];
      if (cruz === 0) return null;
      correcta = Math.abs(cruz) / 2; unidad = 'u²'; texto = x => `${f(x)} u²`;
      variables.A = { nombre: 'vector PQ', color: 'o' }; variables.B = { nombre: 'vector PS', color: 'i' };
      const pt = q => `(${f(q[0])}; ${f(q[1])})`;
      enunciado = ['Un triángulo tiene vértices P', pt(pts[0]), ', Q', pt(pts[1]), ' y S', pt(pts[2]), ' (en unidades de la cuadrícula).'];
      pregunta = ['¿Cuánto mide su área?'];
      errores = [
        h('VE-area-sin-mitad', Math.abs(cruz), '|PQ × PS| es el área del paralelogramo que forman los dos lados. El triángulo es la mitad.'),
        h('VE-signo-determinante', Math.abs(u[0] * w[1] + u[1] * w[0]) / 2, 'Sumaste los dos productos cruzados. En el determinante se restan.'),
        h('VE-escalar-por-vectorial', Math.abs(dot(u, w)) / 2, 'Usaste el producto escalar. El área sale del producto vectorial: |u × w| = |u||w|·sen θ.'),
        h('VE-vertices-sin-restar', Math.abs(pts[1][0] * pts[2][1] - pts[1][1] * pts[2][0]) / 2, 'Usaste las coordenadas de Q y S como si fueran los lados. Los lados son vectores que salen de un mismo vértice: final menos inicio.'),
      ];
      solucion = [
        ['Dos lados desde P (final menos inicio): ', v('A', `PQ = ${par(u)}`), ' y ', v('B', `PS = ${par(w)}`), '.'],
        [`PQ × PS = (${f(u[0])}·${f(w[1])} − ${f(u[1])}·${f(w[0])}) k = ${f(cruz)} k: el paralelogramo mide ${f(Math.abs(cruz))} u².`.replace(/− −/g, '+ ')],
        ['Área del triángulo = |PQ × PS| / 2 = ', v('X', `${f(correcta)} u²`), '.'],
      ];
      datos = { tipo, pts };
    }
    if (['escalar', 'perpendicular', 'vectorial-z'].includes(tipo)) errores = errores.filter(e => esEntero(e.valor));
    const alternativas = P.armar({ correcta, errores, rng, texto, negativos: tipo !== 'angulo' && tipo !== 'modulo-cruz' && tipo !== 'area' });
    return {
      id: `vectores-productos#${semilla}`, variables, enunciado, pregunta, datos: '', alternativas, solucion,
      respuesta: { valor: correcta, unidad },
      _datos: datos,
    };
  }

  return { id: 'vectores-productos', titulo: 'Producto escalar y producto vectorial', generar, _ijk: ijk };
});
