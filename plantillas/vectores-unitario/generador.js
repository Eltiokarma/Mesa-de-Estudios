/*
 * Generador G4: el vector unitario (T12 de docs/clasificacion/compendio-vectores.md).
 * Formato "predicciones" con alternativas de texto (armarTexto de nucleo/predicciones.js).
 * Funciona en el navegador (window.Generadores['vectores-unitario']) y en Node (require).
 *
 * Tipos:
 *   unitario      el unitario de un vector entero de módulo entero (ternas y cuádruplas pitagóricas)
 *   con-modulo    el vector de módulo dado paralelo (o antiparalelo) a otro
 *   constante     la constante c > 0 que hace unitario a c·v
 *   unitario-suma el unitario de A + B (no es la suma de los unitarios)
 *   recta         el unitario en la dirección de la recta y = mx + b, hacia x creciente
 * Todo con fracciones exactas. Errores: hipótesis nuestras (no hay informe de vectores).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const h = (id, r, explicacion) => (r ? { id, clave: r.clave, texto: r.texto, explicacion, respaldo: 'hipotesis', fuente: null } : null);
  const TIPOS = ['unitario', 'con-modulo', 'constante', 'unitario-suma', 'recta'];
  // [x, y, z, módulo]: vectores enteros con módulo entero.
  const BASE2 = [[3, 4, 0, 5], [4, 3, 0, 5], [5, 12, 0, 13], [12, 5, 0, 13], [6, 8, 0, 10], [8, 15, 0, 17], [15, 8, 0, 17], [7, 24, 0, 25], [9, 12, 0, 15]];
  const BASE3 = [[1, 2, 2, 3], [2, 1, 2, 3], [2, 3, 6, 7], [3, 6, 2, 7], [2, 6, 9, 11], [4, 4, 7, 9], [1, 4, 8, 9], [4, 8, 1, 9]];
  const numero = q => ({ clave: 'num:' + P.frac(q).n + '/' + P.frac(q).d, texto: P.textoFraccion(q) });
  const fr = (n, d) => P.frac(n, d);
  const vec = (cs, d) => P.vector(cs.map(c => fr(c, d)));
  // Vector con i, j, k: (2, −3, 1) → "2i − 3j + k".
  function ijk(c) {
    const ej = ['i', 'j', 'k']; let s = '';
    c.forEach((n, q) => {
      if (n === 0) return;
      const abs = Math.abs(n), t = (abs === 1 ? '' : abs) + ej[q];
      s += s === '' ? (n < 0 ? '−' : '') + t : (n < 0 ? ' − ' : ' + ') + t;
    });
    return s || '0';
  }

  function elegirVector(rng, dim) {
    const b = rng.elegir(dim === 3 ? BASE3 : BASE2);
    const s = [rng.moneda() ? 1 : -1, rng.moneda() ? 1 : -1, rng.moneda() ? 1 : -1];
    const c = [b[0] * s[0], b[1] * s[1], dim === 3 ? b[2] * s[2] : 0];
    return { c: c.slice(0, dim), m: b[3], dim };
  }

  // Pares (A, B) enteros con |A|, |B| y |A + B| enteros, no paralelos. Se arman una sola vez.
  let PARES = null;
  function paresSuma() {
    if (PARES) return PARES;
    const cand = [];
    for (const [x, y] of [[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5]])
      for (const sx of [1, -1]) for (const sy of [1, -1]) cand.push([sx * x, sy * y]);
    for (let k = 1; k <= 12; k++) cand.push([k, 0], [-k, 0], [0, k], [0, -k]);
    PARES = [];
    for (const a of cand) for (const b of cand) {
      if (a[0] * b[1] - a[1] * b[0] === 0) continue;
      const s = Math.hypot(a[0] + b[0], a[1] + b[1]);
      if (Number.isInteger(s) && s > 0 && s <= 25) PARES.push([a, b]);
    }
    return PARES;
  }

  function generar(semilla) {
    const rng = Azar.crear('vectores-unitario|' + semilla);
    const tipo = rng.elegir(TIPOS);
    for (let intento = 0; intento < 500; intento++) {
      const pr = construir(rng, semilla, tipo);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  function construir(rng, semilla, tipo) {
    const v = P.v;
    const variables = { A: { nombre: 'vector dado', color: 'o' }, B: { nombre: 'otro vector', color: 'i' }, k: { nombre: 'módulo pedido', color: 'h' }, X: { nombre: 'lo que se pide', color: 'd' } };
    let enunciado, pregunta, correcta, errores, solucion, datos;
    const suma = c => c.reduce((s, x) => s + Math.abs(x), 0);

    if (tipo === 'unitario') {
      const { c, m, dim } = elegirVector(rng, rng.elegir([2, 2, 3]));
      correcta = vec(c, m);
      enunciado = ['Se tiene el vector ', v('A', `A = ${ijk(c)}`), '.'];
      pregunta = ['¿Cuál es el vector unitario de A?'];
      errores = [
        h('VE-unitario-sin-dividir', vec(c, 1), 'Ese es el mismo A: no lo dividiste entre su módulo. Un unitario mide 1.'),
        h('VE-unitario-entre-suma', vec(c, suma(c)), `Dividiste entre la suma de las componentes (${suma(c)}). Hay que dividir entre el módulo, √(x² + y²${dim === 3 ? ' + z²' : ''}) = ${m}.`),
        h('VE-sentido-opuesto', vec(c.map(x => -x), m), 'Ese unitario apunta al revés: es el de −A.'),
        dim === 2 ? h('VE-sen-cos-cambiados', vec([c[1], c[0]], m), 'Cambiaste el orden de las componentes. El unitario conserva x en el primer lugar e y en el segundo.')
                  : h('VE-unitario-sin-raiz', vec(c, m * m), `Dividiste entre ${m * m}, que es el módulo al cuadrado. El módulo es su raíz, ${m}.`),
        h('VE-unitario-unos', P.vector(c.map(x => Math.sign(x))), 'Pusiste 1 en cada componente, con su signo. Ese vector no mide 1 (mide √2 o √3).'),
      ];
      solucion = [
        [`Módulo: |A| = √(${c.map(x => (x < 0 ? `(${P.formatear(x)})²` : `${P.formatear(x)}²`)).join(' + ')}) = √${m * m} = ${m}.`],
        ['El unitario es A dividido entre su módulo: ', v('X', `û = A/${m} = ${correcta.texto}`), '.'],
        ['Comprobación: la suma de los cuadrados de sus componentes es 1.'],
      ];
      datos = { tipo, c };
    } else if (tipo === 'con-modulo') {
      const { c, m } = elegirVector(rng, rng.elegir([2, 2, 3]));
      const k = m * rng.elegir([2, 3, 4]); // módulo pedido: múltiplo del módulo, así B sale entero
      const anti = rng.elegir([false, false, true]);
      const s = anti ? -1 : 1;
      correcta = vec(c.map(x => s * k * x), m);
      enunciado = ['Se tiene ', v('A', `A = ${ijk(c)}`), '. Se busca un vector B de módulo ', v('k', `${k}`), anti ? ', paralelo a A pero de sentido contrario (antiparalelo).' : ', paralelo a A y del mismo sentido.'];
      pregunta = ['¿Cuál es B?'];
      errores = [
        h('VE-unitario-sin-escalar', vec(c.map(x => s * x), m), `Ese es el unitario${anti ? ' de −A' : ' de A'}: mide 1. Falta multiplicarlo por ${k}.`),
        h('VE-unitario-sin-dividir', vec(c.map(x => s * k * x), 1), `Multiplicaste A por ${k} sin dividirlo antes entre su módulo (${m}). Ese vector mide ${k * m}, no ${k}.`),
        h('VE-sentido-opuesto', vec(c.map(x => -s * k * x), m), anti ? 'Ese vector tiene el mismo sentido que A. Antiparalelo pide el sentido contrario.' : 'Ese vector apunta al revés de A. Paralelo y del mismo sentido pide el mismo unitario.'),
        h('VE-modulo-entre', vec(c.map(x => s * x), k * m), `Dividiste entre ${k} en vez de multiplicar: ese vector mide 1/${k}.`),
      ];
      solucion = [
        [`|A| = ${m}, así que el unitario de A es û = A/${m} = ${vec(c, m).texto}.`],
        [anti ? 'Antiparalelo: se usa −û. ' : 'Paralelo y del mismo sentido: se usa û. ', 'Un vector de módulo ', v('k', `${k}`), ' en esa dirección es ', v('k', `${k}`), anti ? '·(−û).' : '·û.'],
        ['B = ', v('X', correcta.texto), '.'],
      ];
      datos = { tipo, c, k, anti };
    } else if (tipo === 'constante') {
      const { c, m } = elegirVector(rng, rng.elegir([2, 3]));
      correcta = numero(fr(1, m));
      enunciado = ['Para cierto número c > 0, el vector ', v('A', `c·(${ijk(c)})`), ' es unitario.'];
      pregunta = ['¿Cuánto vale c?'];
      errores = [
        h('VE-constante-invertida', numero(m), `Ese es el módulo del vector. c es su inverso: c·${m} tiene que dar 1.`),
        h('VE-unitario-entre-suma', numero(fr(1, suma(c))), `Usaste la suma de las componentes (${suma(c)}). Lo que tiene que valer 1 es el módulo, no la suma.`),
        h('VE-unitario-sin-raiz', numero(fr(1, m * m)), `Dividiste entre ${m * m}, el módulo al cuadrado. El módulo es ${m}.`),
        h('VE-raiz-que-no-cumple', numero(fr(-1, m)), 'Si c fuera negativo también saldría unitario, pero el problema pide c > 0.'),
      ];
      solucion = [
        [`|c·A| = c·|A| para c > 0, y |A| = √(${c.map(x => (x < 0 ? `(${P.formatear(x)})²` : `${P.formatear(x)}²`)).join(' + ')}) = ${m}.`],
        [`c·${m} = 1 → c = `, v('X', correcta.texto), '.'],
      ];
      datos = { tipo, c };
    } else if (tipo === 'unitario-suma') {
      // A y B no paralelos, de módulo entero, cuya suma también tiene módulo entero (así se puede
      // escribir la suma de los unitarios como distractor).
      const [a, b] = rng.elegir(paresSuma());
      const ma = Math.hypot(...a), mb = Math.hypot(...b);
      const S = [a[0] + b[0], a[1] + b[1]], m = Math.round(Math.hypot(...S));
      correcta = vec(S, m);
      const errores0 = [
        h('VE-unitario-sin-dividir', P.vector(S), `Ese es A + B, que mide ${m}. Falta dividirlo entre su módulo.`),
        h('VE-sentido-opuesto', vec(S.map(x => -x), m), 'Ese unitario apunta al revés: es el de −(A + B).'),
        h('VE-unitario-de-la-resta', Number.isInteger(Math.hypot(a[0] - b[0], a[1] - b[1])) ? vec([a[0] - b[0], a[1] - b[1]], Math.hypot(a[0] - b[0], a[1] - b[1])) : null, 'Restaste A − B en vez de sumar.'),
        h('VE-unitario-entre-suma', vec(S, suma(S)), `Dividiste entre la suma de las componentes de A + B (${suma(S)}). Hay que dividir entre su módulo, ${m}.`),
        h('VE-sen-cos-cambiados', vec([S[1], S[0]], m), 'Cambiaste el orden de las componentes de A + B.'),
      ];
      // La suma de los unitarios solo se puede escribir si los dos módulos son enteros.
      if (Number.isInteger(ma) && Number.isInteger(mb)) {
        const L = ma * mb;
        errores0.unshift(h('VE-suma-de-unitarios', vec([a[0] * mb + b[0] * ma, a[1] * mb + b[1] * ma], L), 'Sumaste los unitarios de A y de B. El unitario de una suma no es la suma de los unitarios: esa suma ni siquiera mide 1.'));
      }
      errores = errores0;
      enunciado = ['Se tienen ', v('A', `A = ${ijk(a)}`), ' y ', v('B', `B = ${ijk(b)}`), '.'];
      pregunta = ['¿Cuál es el vector unitario de A + B?'];
      solucion = [
        ['Primero se suma: A + B = ', `${P.vector(S).texto}.`],
        [`|A + B| = √(${S.map(x => (x < 0 ? `(${P.formatear(x)})²` : `${P.formatear(x)}²`)).join(' + ')}) = ${m}.`],
        ['Unitario de A + B = (A + B)/', `${m} = `, v('X', correcta.texto), '.'],
        ['Ojo: sumar los unitarios de A y de B da otro vector, que no mide 1.'],
      ];
      datos = { tipo, a, b };
    } else {
      // recta y = (p/q)x + b; dirección (q; p) con módulo entero r.
      const [q, p0, r] = rng.elegir([[4, 3, 5], [3, 4, 5], [12, 5, 13], [5, 12, 13], [15, 8, 17], [8, 15, 17]]);
      const p = rng.moneda() ? p0 : -p0;
      const b = rng.entero(-5, 5);
      correcta = vec([q, p], r);
      const mT = P.textoFraccion(fr(p, q));
      const mTexto = `(${mT})`;
      enunciado = ['Se tiene la recta ', v('A', `y = ${mTexto}x${b === 0 ? '' : (b < 0 ? ' − ' : ' + ') + Math.abs(b)}`), '.'];
      pregunta = ['¿Cuál es el vector unitario paralelo a la recta que apunta hacia donde crece x?'];
      errores = [
        h('VE-pendiente-a-direccion', vec([p, q], r), 'Pusiste la pendiente al revés, como (m; 1). La dirección de y = mx + b es (1; m): por cada paso en x, y sube m.'),
        h('VE-pendiente-signo', vec([q, -p], r), 'Cambiaste el signo de la pendiente. Con y = mx + b, la dirección es (1; m), con el signo de m.'),
        h('VE-unitario-sin-dividir', P.vector([1, fr(p, q)]), `(1; m) da la dirección, pero no mide 1: mide ${r}/${q}. Falta dividir entre su módulo.`),
        h('VE-sentido-opuesto', vec([-q, -p], r), 'Ese unitario apunta hacia donde x decrece.'),
        h('VE-ordenada-en-direccion', b !== 0 && Number.isInteger(Math.hypot(1, b)) ? vec([1, b], Math.hypot(1, b)) : null, 'Usaste el término independiente b como si fuera la pendiente. b solo sube o baja la recta.'),
      ];
      solucion = [
        [`La recta sube ${mT} por cada unidad que avanza x: su dirección es (1; ${mT}), o, sin fracciones, (${q}; ${p < 0 ? '−' : ''}${p0}).`],
        [`Su módulo es √(${q}² + ${p0}²) = ${r}.`],
        ['Unitario hacia x creciente: ', v('X', correcta.texto), '. El término independiente no cambia la dirección.'],
      ];
      datos = { tipo, p, q, b };
    }
    const alternativas = P.armarTexto({ correcta, errores: errores.filter(Boolean), rng });
    return {
      id: `vectores-unitario#${semilla}`, variables, enunciado, pregunta, datos: '', alternativas, solucion,
      respuesta: { valor: correcta.clave, texto: correcta.texto, unidad: '' },
      _datos: datos,
    };
  }

  return { id: 'vectores-unitario', titulo: 'El vector unitario', generar };
});
