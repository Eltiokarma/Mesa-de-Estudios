/*
 * Generador G7: vectores en un polígono regular (T1a de docs/clasificacion/compendio-vectores.md).
 * Formato "predicciones" (armar con radical de nucleo/predicciones.js). Funciona en el navegador
 * (window.Generadores['vectores-poligono']) y en Node (require).
 *
 * Tipos (n = 3, 4 o 6 para el centro y los vértices; n de 3 a 8 para los lados):
 *   desde-vertice   desde un vértice salen vectores a todos los demás: R = n·(vector del vértice al centro)
 *   lados-menos-uno n − 1 lados consecutivos, cola con punta: R cierra el polígono y mide un lado
 *   centro-menos-uno del centro a todos los vértices menos uno: R mide lo mismo que el radio
 * El lado se elige para que el radio salga entero o k√n (triángulo: L = 3k; cuadrado: L = 2k).
 * Las coordenadas se calculan en cada problema y R sale de sumar componentes (no de la fórmula).
 * Errores: VE-suma-modulos es parcial (E8 de docs/investigacion/); los demás, hipótesis.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const E8 = 'docs/investigacion/estatica-energia-ideas-erroneas.md';
  const h = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente: null });
  const pa = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'parcial', fuente: E8 });
  const TIPOS = ['desde-vertice', 'lados-menos-uno', 'centro-menos-uno'];
  const NOMBRE = { 3: 'triángulo equilátero', 4: 'cuadrado', 5: 'pentágono regular', 6: 'hexágono regular', 7: 'heptágono regular', 8: 'octógono regular' };
  const LETRAS = 'ABCDEFGH';
  const esEntero = x => Math.abs(x - Math.round(x)) < 1e-9;
  // Se escribe como entero o k√n: R² entero.
  const limpio = x => Number.isFinite(x) && x >= 0 && esEntero(x * x);

  // Vértices de un polígono regular de n lados y lado L, centrado en el origen.
  function vertices(n, L) {
    const Rc = L / (2 * Math.sin(Math.PI / n));
    return Array.from({ length: n }, (_, k) => {
      const t = Math.PI / 2 + 2 * Math.PI * k / n;
      return [Rc * Math.cos(t), Rc * Math.sin(t)];
    });
  }
  const modulo = (vs) => { let x = 0, y = 0; for (const [a, b] of vs) { x += a; y += b; } return Math.hypot(x, y); };
  const dif = (p, q) => [q[0] - p[0], q[1] - p[1]];
  const len = v => Math.hypot(v[0], v[1]);
  const redondeo = x => (Math.abs(x - Math.round(x)) < 1e-9 ? Math.round(x) : Math.abs(x * x - Math.round(x * x)) < 1e-7 ? Math.sqrt(Math.round(x * x)) : x);

  function generar(semilla) {
    const rng = Azar.crear('vectores-poligono|' + semilla);
    const tipo = rng.elegir(TIPOS);
    for (let intento = 0; intento < 200; intento++) {
      const pr = construir(rng, semilla, tipo);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  function construir(rng, semilla, tipo) {
    const v = P.v;
    const u = rng.elegir(['u', 'cm', 'm']);
    const variables = { L: { nombre: 'lado', color: 'o' }, R: { nombre: 'resultante', color: 'd' } };
    let enunciado, pregunta, correcta, errores, solucion;
    let n, L;
    if (tipo === 'lados-menos-uno') { n = rng.entero(3, 8); L = rng.entero(2, 12); }
    else { n = rng.elegir([3, 4, 6]); const k = rng.entero(1, 5); L = n === 3 ? 3 * k : n === 4 ? 2 * k : rng.entero(2, 10); }
    const V = vertices(n, L);
    const Rc = len(V[0]);
    const nombre = NOMBRE[n], letras = LETRAS.slice(0, n).split('');
    const conU = x => `${P.radical(x)} ${u}`;

    if (tipo === 'desde-vertice') {
      const vs = V.slice(1).map(p => dif(V[0], p));
      correcta = redondeo(modulo(vs));
      const sumaMod = vs.reduce((s, w) => s + len(w), 0);
      const mayor = Math.max(...vs.map(len));
      enunciado = [`En un ${nombre} ${letras.join('')} de lado `, v('L', `${L} ${u}`), `, se dibujan los vectores que van de A a cada uno de los otros vértices (${letras.slice(1).map(x => 'A' + x).join(', ')}).`];
      pregunta = ['¿Cuánto mide su resultante?'];
      errores = [
        pa('VE-suma-modulos', redondeo(sumaMod), 'Sumaste los módulos como números. Los vectores apuntan en direcciones distintas y se suman como flechas.'),
        h('VE-cuenta-repetido', redondeo((n - 1) * Rc), `Contaste ${n - 1} veces el vector de A al centro, uno por vector. Son ${n}: al sumar desde A, cada vértice aporta su posición y A se resta ${n - 1} veces.`),
        h('VE-hex-solo-diagonal', redondeo(mayor), 'Esa es solo la diagonal (o el vector) más largo. Los demás vectores también suman.'),
        h('VE-cuenta-repetido', redondeo(2 * n * Rc), `Contaste dos veces cada vector: la resultante es ${n} veces el vector de A al centro, no ${2 * n}.`),
        h('VE-se-anulan', 0, 'Los vectores no se anulan: todos salen de A hacia el mismo lado del polígono. Los que se anulan son los que salen del centro.'),
      ];
      solucion = [
        ['Con O el centro: cada vector A→X es OX − OA. Al sumar todos, aparece la suma de las posiciones de los otros vértices menos ', `${n - 1}·OA.`],
        [`La suma de las ${n} posiciones desde el centro es 0, así que la de los otros ${n - 1} vale −OA.`],
        [`Resultante = −OA − ${n - 1}·OA = ${n}·AO: ${n} veces el vector de A al centro, que mide el radio ${P.radical(redondeo(Rc))} ${u}.`],
        ['|R| = ', v('R', conU(correcta)), '.'],
      ];
    } else if (tipo === 'lados-menos-uno') {
      const vs = [];
      for (let k = 0; k < n - 1; k++) vs.push(dif(V[k], V[k + 1]));
      correcta = redondeo(modulo(vs));
      enunciado = [`En un ${nombre} de lado `, v('L', `${L} ${u}`), `, se dibujan, cola con punta, los vectores de ${n - 1} lados consecutivos: ${letras.slice(0, n).map((x, i) => (i < n - 1 ? x + letras[i + 1] : null)).filter(Boolean).join(', ')}.`];
      pregunta = ['¿Cuánto mide su resultante?'];
      errores = [
        pa('VE-suma-modulos', (n - 1) * L, 'Sumaste los módulos como números. Al ir cola con punta, la resultante va del inicio del primero al final del último.'),
        h('VE-se-anulan', 0, `Con los ${n} lados, sí: el polígono se cierra y la suma es 0. Aquí falta un lado, y la resultante es justo ese lado que falta.`),
        h('VE-perimetro', n * L, 'Ese es el perímetro. La resultante es una flecha, no la suma de los largos.'),
        h('VE-cuenta-repetido', 2 * L, 'Contaste dos veces el lado que cierra. La resultante es un solo lado.'),
        h('VE-cuenta-repetido', (n - 2) * L, 'Restaste el lado que falta a la suma de los largos. Los lados no van en la misma dirección.'),
      ];
      solucion = [
        [`Con los ${n} lados cola con punta se vuelve al punto de partida: la suma es 0.`],
        [`Entonces la suma de ${n - 1} lados es lo que falta para cerrar: el vector ${letras[0]}${letras[n - 1]}, al revés del lado ${letras[n - 1]}${letras[0]}.`],
        ['|R| = un lado = ', v('R', conU(correcta)), '.'],
      ];
    } else {
      const quita = rng.entero(0, n - 1);
      const vs = V.filter((_, k) => k !== quita);
      correcta = redondeo(modulo(vs));
      enunciado = [`En un ${nombre} de lado `, v('L', `${L} ${u}`), ` y centro O, se dibujan los vectores que van de O a todos los vértices menos ${letras[quita]}.`];
      pregunta = ['¿Cuánto mide su resultante?'];
      errores = [
        pa('VE-suma-modulos', redondeo((n - 1) * Rc), 'Sumaste los módulos como números. Los vectores apuntan en direcciones distintas.'),
        h('VE-se-anulan', 0, `Con los ${n} vectores, sí se anulan. Aquí falta O${letras[quita]}, y la resultante vale lo que falta: −O${letras[quita]}.`),
        h('VE-lado-por-radio', L, 'Ese es el lado. La resultante mide como el vector que falta, que va del centro a un vértice: el radio.'),
        h('VE-cuenta-repetido', redondeo(2 * Rc), 'Contaste dos veces el vector que falta. La resultante es un solo radio, al revés.'),
        h('VE-diametro', redondeo(2 * Rc), 'Ese es el diámetro. La resultante es un solo radio.'),
      ];
      solucion = [
        [`Los ${n} vectores del centro a los vértices se anulan: el polígono es simétrico.`],
        [`Si falta O${letras[quita]}, la suma de los demás es −O${letras[quita]}.`],
        [`|R| = radio = ${n === 3 ? 'L/√3' : n === 4 ? 'L/√2' : 'L'} = `, v('R', conU(correcta)), '.'],
      ];
    }
    errores = errores.filter(e => e.valor === 0 || limpio(e.valor));
    const alternativas = P.armar({ correcta, errores, rng, negativos: true, texto: conU });
    return {
      id: `vectores-poligono#${semilla}`, variables, enunciado, pregunta, datos: '', alternativas, solucion,
      respuesta: { valor: correcta, unidad: u },
      _datos: { tipo, n, L },
    };
  }

  return { id: 'vectores-poligono', titulo: 'Vectores en un polígono regular', generar };
});
