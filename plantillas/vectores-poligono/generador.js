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
    let n, L, quita;
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
        pa('VE-suma-modulos', redondeo(sumaMod), 'Bien juntar todas las flechas, pero apuntan a lados distintos: se suman como flechas, no como números.'),
        h('VE-cuenta-repetido', redondeo((n - 1) * Rc), `Bien usar el centro: cada flecha es AO + OX. Al sumar, AO queda ${n} veces, no ${n - 1}.`),
        h('VE-hex-solo-diagonal', redondeo(mayor), 'Cierto, esa es la flecha más larga. Las demás también suman.'),
        h('VE-cuenta-doble', redondeo(2 * n * Rc), `Bien usar el centro, pero cada flecha cuenta una vez: la resultante es ${n} veces AO, no ${2 * n}.`),
        h('VE-se-anulan', 0, 'Se anularían si salieran del centro. Desde A, todas apuntan hacia el mismo lado del polígono.'),
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
        pa('VE-suma-modulos', (n - 1) * L, 'Si los lados fueran en línea recta, sí sumarían eso. Cola con punta, R va del inicio al final.'),
        h('VE-se-anulan', 0, `Con los ${n} lados, sí se anulan. Aquí falta uno, y la resultante es justo ese lado.`),
        h('VE-perimetro', n * L, 'Ese es el perímetro: la suma de los largos. La resultante es una flecha.'),
        h('VE-cuenta-repetido', 2 * L, 'Bien ver que la resultante es el lado que falta; ese lado cuenta una sola vez.'),
        h('VE-resta-lado', (n - 2) * L, 'Bien ver el lado que falta, pero los lados no van en la misma dirección: no se restan largos.'),
      ];
      solucion = [
        [`Con los ${n} lados cola con punta se vuelve al punto de partida: la suma es 0.`],
        [`Entonces la suma de ${n - 1} lados es lo que falta para cerrar: el vector ${letras[0]}${letras[n - 1]}, al revés del lado ${letras[n - 1]}${letras[0]}.`],
        ['|R| = un lado = ', v('R', conU(correcta)), '.'],
      ];
    } else {
      quita = rng.entero(0, n - 1);
      const vs = V.filter((_, k) => k !== quita);
      correcta = redondeo(modulo(vs));
      enunciado = [`En un ${nombre} de lado `, v('L', `${L} ${u}`), ` y centro O, se dibujan los vectores que van de O a todos los vértices menos ${letras[quita]}.`];
      pregunta = ['¿Cuánto mide su resultante?'];
      errores = [
        pa('VE-suma-modulos', redondeo((n - 1) * Rc), 'Si los radios apuntaran al mismo lado, sí sumarían eso. Apuntan a lados distintos.'),
        h('VE-se-anulan', 0, `Con los ${n} radios, sí se anulan. Aquí falta O${letras[quita]}: la suma es esa flecha al revés.`),
        h('VE-lado-por-radio', L, 'Bien ver que vale lo que falta; pero lo que falta es un radio, no un lado.'),
        h('VE-cuenta-repetido', redondeo(2 * Rc), 'Bien ver la flecha que falta; cuenta una sola vez, al revés.'),
        h('VE-diametro', redondeo(2 * Rc), 'Ese es el diámetro. La resultante es un solo radio, al revés.'),
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
      ...escenaViva({ tipo, n, L, u, V, letras, quita: typeof quita === 'number' ? quita : null }, alternativas, correcta, conU),
    };
  }

  /*
   * Escena viva (docs/escena-viva.md, sección 4): el polígono con sus flechas a escala
   * (nucleo/kit/piezas/flechas.js), la solución como línea de tiempo y la resultante que se marca en una regla
   * de la misma escala, si todas las alternativas caben sin achicar demasiado la figura.
   */
  const ROTULOS = {
    'VE-suma-modulos': 'sumando largos', 'VE-cuenta-repetido': 'contando de más', 'VE-cuenta-doble': 'contando doble',
    'VE-hex-solo-diagonal': 'solo la más larga', 'VE-se-anulan': 'se anulan', 'VE-perimetro': 'perímetro',
    'VE-resta-lado': 'restando un lado', 'VE-lado-por-radio': 'el lado', 'VE-diametro': 'diámetro',
  };
  const BONITOS = [0.01, 0.02, 0.05, 0.1, 0.2, 0.25, 0.5, 1, 2, 5];
  const pasoBonito = tope => BONITOS.reduce((q, b) => (b <= tope + 1e-12 ? b : q), BONITOS[0]);

  function escenaViva(e, alternativas, correcta, conU) {
    const v = P.v, { tipo, n, L, u, letras } = e;
    // Desde un vértice, la resultante sale larga (n radios): se gira la figura para que A quede a la izquierda
    // y R corra a lo ancho, donde hay más lugar. Girar no cambia largos ni ángulos.
    const V = tipo === 'desde-vertice' ? e.V.map(([x, y]) => [-y, x]) : e.V;
    const O = [0, 0], sum = (p, q) => [p[0] + q[0], p[1] + q[1]], por = (k, p) => [k * p[0], k * p[1]];
    const radio = redondeo(len(V[0]));
    const puntos = V.map((q, k) => ({ x: q[0], y: q[1], rotulo: letras[k] }));
    const lado = { de: V[1], a: V[2 % n], color: 'o', texto: `L = ${L} ${u}` };
    const datos = { unidad: u, contorno: V, puntos, segmentos: [lado], flechas: [], guias: [] };
    let pasos;
    const fin = (texto, ecuacion) => ({ estado: { paso: 2, final: true }, texto, ecuacion });
    if (tipo === 'desde-vertice') {
      for (let k = 1; k < n; k++) datos.flechas.push({ de: V[0], a: V[k], grosor: 'contorno' });
      datos.puntos.push({ x: 0, y: 0, rotulo: 'O', paso: 1 });
      datos.guias.push({ de: V[0], a: O, color: 'd', paso: 1 });
      for (let k = 0; k < n; k++) datos.flechas.push({ de: O, a: V[k], discontinua: true, grosor: 'contorno', paso: 2 });
      datos.resultante = { de: V[0], a: sum(V[0], por(n, por(-1, V[0]))), color: 'd', rotulo: 'R', valor: conU(correcta) };
      pasos = [
        { estado: { paso: 1 }, texto: ['Cada flecha de A se arma pasando por el centro O.'], ecuacion: ['AX = AO + OX'] },
        { estado: { paso: 2 }, texto: [`Las ${n} flechas del centro a los vértices suman cero.`], ecuacion: ['OA + OB + … = 0'] },
        fin([`Queda AO sumada ${n} veces: esa es la resultante.`], ['|R| = ', `${n} × ${P.radical(radio)} = `, v('R', conU(correcta))]),
      ];
    } else if (tipo === 'lados-menos-uno') {
      for (let k = 0; k < n - 1; k++) datos.flechas.push({ de: V[k], a: V[k + 1], grosor: 'contorno' });
      datos.segmentos = [{ de: V[0], a: V[1], color: 'o', texto: `L = ${L} ${u}` }];
      datos.guias.push({ de: V[n - 1], a: V[0], color: 'd', paso: 1 });
      datos.resultante = { de: V[0], a: V[n - 1], color: 'd', rotulo: 'R', valor: conU(correcta) };
      pasos = [
        { estado: { paso: 1 }, texto: ['Con el lado que falta, la vuelta se cierra y suma cero.'], ecuacion: [`${letras.slice(0, n).map((x, i) => x + letras[(i + 1) % n]).join(' + ')} = 0`] },
        fin(['La resultante va de ', letras[0], ' a ', letras[n - 1], ': mide un lado.'], ['|R| = ', v('L', `${L} ${u}`)]),
      ];
    } else {
      const q = e.quita, lq = letras[q];
      for (let k = 0; k < n; k++) if (k !== q) datos.flechas.push({ de: O, a: V[k], grosor: 'contorno' });
      datos.puntos.push({ x: 0, y: 0, rotulo: 'O' });
      datos.flechas.push({ de: O, a: V[q], discontinua: true, grosor: 'contorno', paso: 1 });
      datos.resultante = { de: O, a: por(-1, V[q]), color: 'd', rotulo: 'R', valor: conU(correcta) };
      pasos = [
        { estado: { paso: 1 }, texto: [`Con O${lq}, las ${n} flechas del centro se anularían.`], ecuacion: [`OA + OB + … = 0`] },
        fin([`Sin O${lq}, la suma es O${lq} al revés: un radio.`], ['|R| = ', `${n === 3 ? 'L/√3' : n === 4 ? 'L/√2' : 'L'} = `, v('R', conU(correcta))]),
      ];
    }
    // Se arrastra si todas las alternativas caben en una regla que no achica demasiado la figura.
    const xs = [...V, datos.resultante.a].map(p => p[0]), ys = [...V, datos.resultante.a].map(p => p[1]);
    const ancho = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
    const vals = alternativas.map(x => x.valor), mayor = Math.max(...vals);
    let respuesta = { valor: correcta, unidad: u };
    if (mayor <= 1.6 * ancho) {
      const qq = mayor > 20 ? 5 : mayor > 8 ? 2 : 1;
      const max = Math.ceil(mayor * 1.08 / qq) * qq;
      let hueco = Infinity;
      for (let i = 0; i < vals.length; i++) for (let j = i + 1; j < vals.length; j++) hueco = Math.min(hueco, Math.abs(vals[i] - vals[j]));
      const paso = pasoBonito(Math.min(max / 150, hueco / 2));
      datos.regla = { max, respuesta: correcta, texto: conU(correcta), decimales: paso < 0.1 ? 2 : 1 };
      respuesta = { ...respuesta, tipo: 'arrastrar', control: 'marca', paso, tolerancia: paso };
    }
    const fantasmas = {};
    for (const x of alternativas) if (x.error) fantasmas[x.error.id] = { marca: x.valor, rotulo: ROTULOS[x.error.id] || '', texto: x.texto };
    const alt = `${NOMBRE[n][0].toUpperCase()}${NOMBRE[n].slice(1)} de lado ${L} ${u} con sus flechas a escala, el largo proporcional al módulo`
      + (datos.regla ? '. Debajo, una regla con la misma escala para medir R' : '');
    return { escena: { pieza: 'flechas', datos, alt }, respuesta, pasos, fantasmas };
  }

  return { id: 'vectores-poligono', titulo: 'Vectores en un polígono regular', generar };
});
