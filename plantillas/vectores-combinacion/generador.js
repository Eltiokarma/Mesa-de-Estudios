/*
 * Generador G5: combinación lineal y condiciones (T5 y T10 de docs/clasificacion/compendio-vectores.md).
 * Formato "predicciones" con alternativas de texto (armarTexto de nucleo/predicciones.js).
 * Funciona en el navegador (window.Generadores['vectores-combinacion']) y en Node (require).
 *
 * Tipos:
 *   en-funcion        C = mA + nB con A, B enteros no paralelos: se pide C en función de A y B
 *   suma-diferencia   se dan A + B y A − B: se pide A (o B)
 *   paralelo          A = (a; t) y B = (b; c) paralelos: se pide t (puede ser negativo o fracción)
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
  const TIPOS = ['en-funcion', 'suma-diferencia', 'paralelo'];
  const numero = q => { const f = P.frac(q); return { clave: `num:${f.n}/${f.d}`, texto: P.textoFraccion(f) }; };
  const AB = ['A', 'B'];
  const par = c => `(${c.map(x => P.formatear(x)).join('; ')})`;
  const coefTexto = (m, nombre, primero) => {
    const abs = Math.abs(m), t = (abs === 1 ? '' : abs) + nombre;
    return primero ? (m < 0 ? '−' : '') + t : (m < 0 ? ' − ' : ' + ') + t;
  };

  // «2m − 3n = −9», sin términos con 0 ni coeficientes 1.
  function lin(p, q, r) {
    const ts = [];
    if (p) ts.push(coefTexto(p, 'm', true));
    if (q) ts.push(coefTexto(q, 'n', ts.length === 0));
    return `${ts.join('')} = ${P.formatear(r)}`;
  }

  function generar(semilla) {
    const rng = Azar.crear('vectores-combinacion|' + semilla);
    const tipo = rng.elegir(TIPOS);
    for (let intento = 0; intento < 500; intento++) {
      const pr = construir(rng, semilla, tipo);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  function construir(rng, semilla, tipo) {
    const v = P.v;
    const variables = { A: { nombre: 'vector A', color: 'o' }, B: { nombre: 'vector B', color: 'i' }, C: { nombre: 'vector C', color: 'h' }, X: { nombre: 'lo que se pide', color: 'd' } };
    let enunciado, pregunta, correcta, errores, solucion, datos;

    if (tipo === 'en-funcion') {
      const A = [rng.entero(-3, 3), rng.entero(-3, 3)], B = [rng.entero(-3, 3), rng.entero(-3, 3)];
      const det = A[0] * B[1] - A[1] * B[0];
      if (det === 0) return null;
      const m = rng.elegir([1, 2, 3, -1, -2]), n = rng.elegir([1, 2, 3, -1, -2, -3]);
      if (Math.abs(m) === Math.abs(n)) return null;
      const C = [m * A[0] + n * B[0], m * A[1] + n * B[1]];
      if (C.every(x => x === 0)) return null;
      const cuadricula = rng.moneda();
      correcta = P.combinacion([m, n], AB);
      enunciado = cuadricula
        ? ['En una cuadrícula de lado 1, el vector ', v('A', 'A'), ' avanza ', v('A', par(A)), ' cuadritos (horizontal; vertical), ', v('B', 'B'), ' avanza ', v('B', par(B)), ' y ', v('C', 'C'), ' avanza ', v('C', par(C)), '.']
        : ['Se tienen ', v('A', `A = ${par(A)}`), ', ', v('B', `B = ${par(B)}`), ' y ', v('C', `C = ${par(C)}`), '.'];
      pregunta = ['¿Cómo se escribe C en función de A y B?'];
      errores = [
        h('VE-coeficientes-cambiados', m !== n ? P.combinacion([n, m], AB) : null, 'Cambiaste los coeficientes: el que va con A es el que resuelve la ecuación de A. Comprueba sumando: no da C.'),
        h('VE-sentido-opuesto', P.combinacion([-m, -n], AB), 'Ese es −C: los dos signos están al revés. Comprueba sumando componente por componente.'),
        h('VE-signo-de-un-coeficiente', P.combinacion([m, -n], AB), 'Un coeficiente tiene el signo cambiado. Al despejar, revisa el signo de cada término.'),
        h('VE-componentes-como-coeficientes', C[0] !== m || C[1] !== n ? P.combinacion([C[0], C[1]], AB) : null, 'Usaste las componentes de C como si fueran los coeficientes. Los coeficientes m y n salen de un sistema: m·A + n·B = C, componente por componente.'),
        h('VE-signo-de-un-coeficiente', P.combinacion([-m, n], AB), 'Un coeficiente tiene el signo cambiado. Al despejar, revisa el signo de cada término.'),
      ];
      solucion = [
        ['Se busca m y n con m·A + n·B = C, componente por componente:'],
        [`x: ${lin(A[0], B[0], C[0])};  y: ${lin(A[1], B[1], C[1])}.`],
        [`Resolviendo el sistema: m = ${m} y n = ${n}.`.replace(/-/g, '−')],
        ['C = ', v('X', correcta.texto), '. Comprobación: ', `${m}·${par(A)} + ${n}·${par(B)} = ${par(C)}.`.replace(/\+ -/g, '− ').replace(/-/g, '−')],
      ];
      datos = { tipo, A, B, C };
    } else if (tipo === 'suma-diferencia') {
      const A = [rng.entero(-6, 6), rng.entero(-6, 6)], B = [rng.entero(-6, 6), rng.entero(-6, 6)];
      if (A.every(x => x === 0) || B.every(x => x === 0) || (A[0] === B[0] && A[1] === B[1])) return null;
      const S = [A[0] + B[0], A[1] + B[1]], D = [A[0] - B[0], A[1] - B[1]];
      const pideA = rng.moneda();
      const X = pideA ? A : B, Y = pideA ? B : A;
      correcta = P.vector(X);
      enunciado = ['Dos vectores cumplen ', v('A', `A + B = ${par(S)}`), ' y ', v('B', `A − B = ${par(D)}`), '.'];
      pregunta = [`¿Cuánto vale ${pideA ? 'A' : 'B'}?`];
      errores = [
        h('VE-confunde-A-con-B', P.vector(Y), `Ese es ${pideA ? 'B' : 'A'}. ${pideA ? 'A = [(A + B) + (A − B)]/2' : 'B = [(A + B) − (A − B)]/2'}.`),
        h('VE-sin-mitad', P.vector(pideA ? [S[0] + D[0], S[1] + D[1]] : [S[0] - D[0], S[1] - D[1]]), `Ese es ${pideA ? '2A' : '2B'}: al ${pideA ? 'sumar' : 'restar'} las dos ecuaciones queda el doble. Falta dividir entre 2.`),
        h('VE-sentido-opuesto', P.vector(X.map(x => -x)), `Ese es −${pideA ? 'A' : 'B'}: revisa el orden de la resta.`),
        h('VE-suma-por-diferencia', P.vector(pideA ? D : S), `Tomaste ${pideA ? 'A − B' : 'A + B'} como si fuera ${pideA ? 'A' : 'B'}.`),
      ];
      solucion = pideA
        ? [['Se suman las dos igualdades: (A + B) + (A − B) = 2A.'], [`2A = ${par(S)} + ${par(D)} = ${par([S[0] + D[0], S[1] + D[1]])}.`.replace(/-/g, '−')], ['A = ', v('X', correcta.texto), '.']]
        : [['Se restan las dos igualdades: (A + B) − (A − B) = 2B.'], [`2B = ${par(S)} − ${par(D)} = ${par([S[0] - D[0], S[1] - D[1]])}.`.replace(/-/g, '−')], ['B = ', v('X', correcta.texto), '.']];
      datos = { tipo, S, D, pideA };
    } else {
      // A = (a; t) paralelo a B = (b; c): a/b = t/c → t = a·c/b.
      const a = rng.elegir([1, 2, 3, 4, 6, -2, -3]), b = rng.elegir([2, 3, 4, 5, 6, -4, -5]), c = rng.elegir([2, 3, 4, 5, 6, 8, 9, -3, -6]);
      if (Math.abs(a) === Math.abs(b) || a * c === 0) return null;
      const t = P.frac(a * c, b);
      correcta = numero(t);
      const C = { x: b, y: c };
      enunciado = ['Los vectores ', v('A', `A = (${P.formatear(a)}; t)`), ' y ', v('B', `B = (${P.formatear(C.x)}; ${P.formatear(C.y)})`), ' son paralelos.'];
      pregunta = ['¿Cuánto vale t?'];
      errores = [
        h('VE-proporcion-invertida', numero(P.frac(b * c, a)), 'Armaste la proporción al revés. Paralelos quiere decir A = k·B: el cociente de las x es igual al de las y, a/b = t/c.'),
        h('VE-proporcion-invertida', numero(P.frac(a * b, c)), 'Cruzaste mal la proporción. De a/b = t/c sale t = a·c/b.'),
        h('VE-perpendicular-por-paralelo', numero(P.frac(-a * b, c)), 'Usaste la condición de perpendicular (A·B = 0). Paralelos pide componentes proporcionales.'),
        h('VE-despeje-signo', numero(P.frac(-a * c, b)), 'Cambiaste el signo al despejar.'),
        h('VE-diferencia-constante', numero(P.frac(c + a - b, 1)), 'Supusiste que las componentes se diferencian en lo mismo (t − c = a − b). Paralelos quiere decir que se multiplican por lo mismo.'),
      ];
      const k = P.frac(a, b);
      solucion = [
        ['Paralelos ⇔ A = k·B: las componentes son proporcionales.'],
        [`x: ${P.formatear(a)} = k·${P.formatear(b)} → k = ${P.textoFraccion(k)}.`],
        [`y: t = k·${P.formatear(c)} = `, v('X', correcta.texto), '.'],
      ];
      datos = { tipo, a, b, c };
    }
    const alternativas = P.armarTexto({ correcta, errores: errores.filter(Boolean), rng });
    return {
      id: `vectores-combinacion#${semilla}`, variables, enunciado, pregunta, datos: '', alternativas, solucion,
      respuesta: { valor: correcta.clave, texto: correcta.texto, unidad: '' },
      _datos: datos,
    };
  }

  return { id: 'vectores-combinacion', titulo: 'Combinación lineal y condiciones', generar };
});
