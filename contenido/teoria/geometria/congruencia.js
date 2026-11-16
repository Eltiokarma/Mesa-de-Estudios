/*
 * Teoría de «Congruencia de triángulos» (geometria.congruencia). Molde: docs/teoria.md.
 * Fuente: docs/teoria/matriz/geometria.json (unidad 3); Elementos I.4 (LAL por superposición) y I.8 (LLL).
 * Compañera: Neri (nutria). Pieza: geo-figura.
 *
 * Ficha de tarea
 *   Promesa: saber qué datos fijan un triángulo (LAL, ALA, LLL) y cuáles no (LLA, AAA), y usar la congruencia
 *     para probar mediatriz, bisectriz, base media y mediana a la hipotenusa.
 *   Persona y condiciones: postulante de 3.º de secundaria, celular a 360 px, sin audio, quizás sin conexión.
 *   Resultado observable: elige el criterio correcto, calcula con base media, mediana a la hipotenusa y notables.
 *   Orden de atención: 1.º la figura y su lectura · 2.º la pregunta · acción: «Comprobar» · fondo: Neri.
 *   Estados: jugando · predicción sin elegir · comprobada · paso de «Mira» · regla · caso nuevo.
 *   Duda que resuelve: «¿con dos lados y un ángulo ya está?» y «¿por qué la base media es la mitad?».
 *
 * Colores: el dato que se mueve naranja (c-o), el que lo acompaña turquesa (c-i), la referencia verde (c-d),
 * lo que se pide rojo (c-h). Códigos: GE-CON (hipótesis nuevas); GE9 para el notable mal leído por la posición.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const def = nodo ? fabrica(require('../../../nucleo/kit/kit.js'), require('../../../nucleo/kit/piezas/geo-figura.js'))
    : fabrica(root.Kit, root.Kit.piezas['geo-figura']);
  if (nodo) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit, G) {
  'use strict';
  const U = G.util;
  const f = (n, d = 1) => Kit.formatear(n, d);
  const gr = n => `${f(n)}°`;
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = l => l[Math.floor(r() * l.length)];
    return r;
  }
  // Gesto directo (docs/teoria.md §4b): la manija vive en el viewBox de geo-figura; aPlano la vuelve coordenadas del
  // problema y el lector ajusta cada valor al paso y al rango de su control.
  const enPantalla = (datos, p) => G.aPantalla(datos, p);
  const alPlano = (datos, pt) => G.aPlano(datos, pt);
  function opciones(correcta, distractores, fmt, n = 4) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      const txt = fmt(d.valor);
      if (vistos.has(txt) || !Number.isFinite(d.valor) || d.valor <= 0) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, n);
  }

  // ---------- Idea 1: qué datos fijan un triángulo ----------
  // Cambia: el ángulo entre los lados 7 y 5 · Permanece: los dos lados · Progresa: el tercer lado, uno por cada ángulo ·
  // Se reserva: el compás que corta dos veces (LLA) · Debe verse: con el ángulo no comprendido hay dos triángulos.
  const armado = (t, o = {}) => {
    const C = U.polar([0, 0], 5, t);
    return {
      alt: `Lados AB = 7 y AC = 5 con ángulo A de ${t}°: el tercer lado BC mide ${f(U.dist(C, [7, 0]))}; un solo triángulo`,
      vista: { x: [-3.6, 8], y: [-0.8, 5.4] },
      puntos: [{ id: 'A', x: 0, y: 0, rotulo: 'A', lado: -120 }, { id: 'B', x: 7, y: 0, rotulo: 'B', lado: -60 }, { id: 'C', x: C[0], y: C[1], rotulo: 'C', lado: t + 10 }],
      regiones: [{ puntos: ['A', 'B', 'C'], color: 'i', opacidad: 0.08 }],
      segmentos: [{ de: 'A', a: 'B', texto: '7', color: 'd', grosor: 'variable' }, { de: 'A', a: 'C', texto: '5', color: 'i', grosor: 'variable' },
        { de: 'B', a: 'C', color: 'h', texto: o.sinBC ? undefined : `${f(U.dist(C, [7, 0]))}` }],
      angulos: [{ en: 'A', de: 'B', a: 'C', color: 'o', texto: `${t}°` }],
    };
  };
  const t1 = 7 * Math.cos(U.rad(40)) - Math.sqrt(49 * Math.cos(U.rad(40)) ** 2 - 24), t2 = 7 * Math.cos(U.rad(40)) + Math.sqrt(49 * Math.cos(U.rad(40)) ** 2 - 24);
  const C1 = U.polar([0, 0], t1, 40), C2 = U.polar([0, 0], t2, 40);
  const lla = (paso, o = {}) => ({
    alt: o.alt || 'AB = 7, ángulo A = 40° y BC = 5: la circunferencia de centro B y radio 5 corta el lado de A en dos puntos, C₁ y C₂',
    vista: { x: [-0.8, 12.2], y: [-0.8, 6] },
    puntos: [{ id: 'A', x: 0, y: 0, rotulo: 'A', lado: -120 }, { id: 'B', x: 7, y: 0, rotulo: 'B', lado: -60 }, { id: 'R', x: 7.6 * Math.cos(U.rad(40)) + 1.3, y: 7.6 * Math.sin(U.rad(40)) + 1.1, sinPunto: true },
      { id: 'C1', x: C1[0], y: C1[1], rotulo: 'C₁', color: 'h', lado: 130, desde: paso.c || 0 }, { id: 'C2', x: C2[0], y: C2[1], rotulo: 'C₂', color: 'h', lado: 100, desde: paso.c || 0 }],
    circulos: o.compas === false ? [] : [{ centro: 'B', r: 5, color: 'i', discontinua: true, desde: paso.compas || 0 }],
    segmentos: [{ de: 'A', a: 'B', texto: '7', color: 'd', grosor: 'variable' }, { de: 'A', a: 'R', grosor: 'fino' },
      { de: 'B', a: 'C1', color: 'i', texto: '5', desde: paso.c || 0 }, { de: 'B', a: 'C2', color: 'i', texto: '5', desde: paso.c || 0 }],
    angulos: [{ en: 'A', de: 'B', a: 'R', color: 'o', texto: '40°' }],
  });
  const tipos = {
    LAL: { nombre: 'LAL', datos: (d) => [`AB = PQ = ${d.a}`, `∠A = ∠P = ${d.g}°`, `AC = PR = ${d.b}`] },
    ALA: { nombre: 'ALA', datos: (d) => [`∠A = ∠P = ${d.g}°`, `AB = PQ = ${d.a}`, `∠B = ∠Q = ${d.h}°`] },
    LLL: { nombre: 'LLL', datos: (d) => [`AB = PQ = ${d.a}`, `BC = QR = ${d.c}`, `AC = PR = ${d.b}`] },
    LLA: { nombre: 'No basta', datos: (d) => [`AB = PQ = ${d.a}`, `BC = QR = ${d.c}`, `∠A = ∠P = ${d.g}°`] },
    AAA: { nombre: 'No basta', datos: (d) => [`∠A = ∠P = ${d.g}°`, `∠B = ∠Q = ${d.h}°`, `∠C = ∠R = ${180 - d.g - d.h}°`] },
  };
  // Así se resuelve (idea 1): el mismo tipo de caso de «Ahora tú» (tipos[k].datos), con otra semilla. Solo se ajusta lo
  // que hace falta para que el triángulo exista y se pueda dibujar: LLL cumple la desigualdad triangular y LLA da dos cortes.
  const casoCriterio = s => {
    const r = azar(s + 900), k = ['LAL', 'ALA', 'LLL', 'LLA', 'AAA'][s % 5];
    const d = { a: r.ent(4, 9), b: r.ent(4, 9), c: r.ent(4, 9), g: 5 * r.ent(8, 16), h: 5 * r.ent(6, 12) };
    if (k === 'LLL') d.c = Math.min(Math.max(d.c, Math.abs(d.a - d.b) + 1), d.a + d.b - 1);
    if (k === 'LLA') { d.g = 5 * r.ent(6, 10); d.a = r.ent(6, 9); d.c = r.ent(Math.ceil(d.a * Math.sin(U.rad(d.g)) + 0.2), d.a - 1); }
    return { k, d };
  };
  // LLA: dónde corta la circunferencia de centro B y radio BC al lado que sale de A (distancias AC₁ y AC₂).
  const cortesLLA = d => {
    const q = Math.sqrt(d.c * d.c - (d.a * Math.sin(U.rad(d.g))) ** 2), m = d.a * Math.cos(U.rad(d.g));
    return [m - q, m + q];
  };
  // El triángulo ABC armado con los datos: lo dado lleva su medida (AB verde, AC turquesa, BC rojo, ángulos naranja).
  const figCriterio = (k, d, o = {}) => {
    const A = [0, 0], B = [d.a, 0];
    let C;
    if (k === 'LAL') C = U.polar(A, d.b, d.g);
    else if (k === 'LLL') { const x = (d.a * d.a + d.b * d.b - d.c * d.c) / (2 * d.a); C = [x, Math.sqrt(d.b * d.b - x * x)]; }
    else if (k === 'LLA') C = U.polar(A, cortesLLA(d)[1], d.g);
    else C = U.corte(A, U.polar(A, 1, d.g), B, U.polar(B, 1, 180 - d.h));
    const C1 = k === 'LLA' && o.dos ? U.polar(A, cortesLLA(d)[0], d.g) : null;
    const dado = { LAL: ['AB', 'AC', 'A'], ALA: ['AB', 'A', 'B'], LLL: ['AB', 'BC', 'AC'], LLA: ['AB', 'BC', 'A'], AAA: ['A', 'B', 'C'] }[k];
    const ve = x => dado.includes(x);
    const pts = [A, B, C].concat(C1 ? [C1, [d.a - d.c, 0], [d.a + d.c, d.c]] : []);
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
    return {
      alt: o.dos ? `La circunferencia de centro B y radio ${d.c} corta dos veces el lado que sale de A: hay dos triángulos ABC`
        : `Triángulo ABC con los datos marcados: ${tipos[k].datos(d).map(t => t.split(' = ')[0]).join(', ')}`,
      vista: { x: [Math.min(...xs) - 1.6, Math.max(...xs) + 1.6], y: [Math.min(...ys, 0) - 1.2, Math.max(...ys) + 1.2] },
      puntos: [{ id: 'A', x: 0, y: 0, rotulo: 'A', lado: -135 }, { id: 'B', x: d.a, y: 0, rotulo: 'B', lado: -45 },
        { id: 'C', x: C[0], y: C[1], rotulo: C1 ? 'C₂' : 'C', lado: 90 }, ...(C1 ? [{ id: 'C1', x: C1[0], y: C1[1], rotulo: 'C₁', color: 'h', lado: 150 }] : [])],
      regiones: [{ puntos: ['A', 'B', 'C'], color: 'i', opacidad: 0.08 }],
      circulos: C1 ? [{ centro: 'B', r: d.c, color: 'i', discontinua: true }] : [],
      segmentos: [{ de: 'A', a: 'B', color: ve('AB') ? 'd' : undefined, grosor: 'variable', texto: ve('AB') ? `${d.a}` : undefined },
        { de: 'A', a: 'C', color: ve('AC') ? 'i' : undefined, texto: ve('AC') ? `${d.b}` : undefined },
        { de: 'B', a: 'C', color: ve('BC') ? 'h' : undefined, texto: ve('BC') ? `${d.c}` : undefined },
        ...(C1 ? [{ de: 'B', a: 'C1', color: 'h', discontinua: true, texto: `${d.c}` }] : [])],
      angulos: [{ en: 'A', de: 'B', a: 'C', color: ve('A') ? 'o' : undefined, texto: ve('A') ? `${d.g}°` : undefined },
        ...(ve('B') ? [{ en: 'B', de: 'C', a: 'A', color: 'o', texto: `${d.h}°` }] : []),
        ...(ve('C') ? [{ en: 'C', de: 'A', a: 'B', color: 'o', texto: `${180 - d.g - d.h}°` }] : [])],
    };
  };
  const criterios = {
    id: 'criterios',
    titulo: 'Qué datos fijan un triángulo',
    temas: ['Criterios LAL, ALA y LLL'],
    pieza: 'geo-figura',
    // Lee (fase 2): qué es congruente y cómo se leen las letras, sin decir cuántos triángulos da LLA (eso es Predice).
    lee: {
      tarjetas: [
        { titulo: 'Igual forma y tamaño', texto: 'Las ventanas de una misma fila en un edificio de Juliaca suelen salir del mismo molde: una calza exacto sobre la otra. En geometría, dos figuras así se llaman congruentes.' },
        { titulo: 'Seis piezas', texto: 'Un triángulo tiene seis piezas: tres lados y tres ángulos. La pregunta del tema es cuántas piezas hay que conocer, y en qué lugar, para que el triángulo salga de una sola manera.' },
        { titulo: 'Letras que se leen', texto: 'Un criterio se nombra con letras: L por lado y A por ángulo. LAL se lee «lado, ángulo, lado», en ese orden: el ángulo va en medio de los dos lados.' },
        { titulo: 'Qué mirar', texto: 'En el juego, los lados de 7 y 5 quedan fijos y tú cambias el ángulo A. Para cada ángulo, fíjate si el tercer lado podría tomar otra medida.' },
      ],
    },
    juega: {
      consigna: 'Los lados AB = 7 y AC = 5 están fijos. Cambia el ángulo A, que queda entre ellos, y mira el tercer lado.',
      voz: 'Para cada ángulo, cuenta cuántos triángulos puedes armar.',
      controles: [{ id: 't', etiqueta: '∠A', min: 20, max: 150, paso: 10, inicio: 60, unidad: '°', decimales: 0, color: 'c-o' }],
      dibujo: v => ({ datos: armado(v.t), estado: {} }),
      // Se agarra la punta C del lado AC: gira alrededor de A con el lado de 5 fijo.
      arrastres: [{ id: 'vertice-c', etiqueta: 'vértice C', color: 'c-o',
        donde: v => enPantalla(armado(v.t), U.polar([0, 0], 5, v.t)),
        mover: (pt, v) => { const q = alPlano(armado(v.t), pt); return { t: U.grados(Math.atan2(Math.max(q[1], 0), q[0])) }; } }],
      lectura: v => [{ v: 'c-h', t: 'BC' }, ` = ${f(U.dist(U.polar([0, 0], 5, v.t), [7, 0]))}   ·   un solo triángulo`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Ahora el ángulo no queda entre los lados: AB = 7, ∠A = 40° y BC = 5, opuesto a A. ¿Cuántos triángulos distintos cumplen esos datos?',
      voz: 'El ángulo cambió de lugar. Piensa antes de trazar la circunferencia.',
      opciones: [
        { id: 'c', texto: 'Dos', correcta: true },
        { id: 'uno', texto: 'Uno: dos lados y un ángulo lo fijan', error: 'GE-CON1', siFuera: 'Uno solo sería cierto con el ángulo entre los dos lados (LAL). Aquí el ángulo es opuesto.' },
        { id: 'cero', texto: 'Ninguno', error: 'GE-CON2', siFuera: 'No habría ninguno si BC fuera más corto que la distancia de B al otro lado. Con 5 alcanza.' },
      ],
      dibujo: { datos: lla({}, { compas: false, alt: 'AB = 7 y un lado que sale de A con 40°; falta ubicar C a 5 de B' }), estado: {} },
      revelar: { datos: lla({}), estado: {} },
      coincide: 'Coincide: la circunferencia de radio 5 corta dos veces. LLA no fija el triángulo.',
    },
    // Hallazgo 9: «Mira» usa el dibujo de la predicción (LLA con el compás), no el del juego (LAL): explica el caso que
    // el alumno acaba de predecir. El juego ya mostró que con el ángulo entre los lados sale un solo triángulo.
    mira: {
      datos: lla({ compas: 1, c: 2 }),
      voz: 'Sigue la circunferencia punteada: en ella está C.',
      pasos: [
        { estado: { corte: 1 }, texto: 'C está a 5 de B: en la circunferencia de centro B.', ecuacion: ['BC = 5'] },
        { estado: { corte: 2 }, texto: 'La circunferencia corta al lado de A en dos puntos.', ecuacion: [`A${'C'}₁ ≈ ${f(t1)}`, '   ·   ', `A${'C'}₂ ≈ ${f(t2)}`] },
        { estado: { corte: 2 }, texto: 'Dos triángulos distintos con los mismos datos: LLA no es criterio.', ecuacion: ['△ABC₁ ≠ △ABC₂'] },
      ],
    },
    regla: {
      texto: 'Dos triángulos son congruentes si coinciden en LAL (ángulo entre los dos lados), ALA (lado entre los dos ángulos) o LLL. Con LLA o AAA no basta.',
      condicion: 'los elementos iguales se corresponden en el mismo orden. AAA solo asegura la misma forma, no el tamaño.',
      voz: 'Antes de nombrar el criterio, ubica dónde está el ángulo.',
    },
    // Así se resuelve (fase 2): el caso de «Ahora tú» (mismos tipos y datos) con otra semilla, resuelto paso a paso.
    resuelve: {
      generar(s) {
        const { k, d } = casoCriterio(s);
        const hay = { LAL: 'Dos lados y un ángulo', ALA: 'Dos ángulos y un lado', LLL: 'Los tres lados', LLA: 'Dos lados y un ángulo', AAA: 'Los tres ángulos y ningún lado' }[k];
        const aplica = {
          LAL: 'El ángulo A lo forman los lados AB y AC, que son justo los lados dados. Queda en medio: es LAL.',
          ALA: 'El lado AB va del vértice A al vértice B: queda entre los dos ángulos dados. Es ALA.',
          LLL: 'Me dan los tres lados, cada uno igual a su pareja del otro triángulo. Es LLL.',
          LLA: 'El ángulo A lo forman AB y AC, pero el otro lado dado es BC. El ángulo no queda entre los lados dados.',
          AAA: 'Son tres ángulos y ningún lado: ningún dato fija el tamaño del triángulo.',
        }[k];
        const [t1, t2] = k === 'LLA' ? cortesLLA(d) : [0, 0];
        const lados = [d.a, d.b, d.c].sort((x, y) => y - x);
        const sentido = {
          LAL: { texto: 'Comprueba: con esos datos el tercer lado sale de una sola medida. No hay otro triángulo posible.', ecuacion: [{ v: 'c-h', t: 'BC' }, ` ≈ ${f(U.dist(U.polar([0, 0], d.b, d.g), [d.a, 0]))}`] },
          ALA: { texto: 'Comprueba: el tercer ángulo queda fijo, y los lados que salen de A y de B se cortan en un solo punto.', ecuacion: [`∠C = 180° − ${d.g}° − ${d.h}° = ${180 - d.g - d.h}°`] },
          LLL: { texto: 'Comprueba que el triángulo se puede armar: el lado mayor es menor que la suma de los otros dos.', ecuacion: [`${lados[0]} < ${lados[1]} + ${lados[2]} = ${lados[1] + lados[2]}`] },
          LLA: { texto: `Comprueba con la circunferencia de centro B y radio ${d.c}: corta dos veces el lado que sale de A. Salen dos triángulos.`,
            ecuacion: [`AC₁ ≈ ${f(t1)}`, '   ·   ', `AC₂ ≈ ${f(t2)}`], dibujo: { datos: figCriterio(k, d, { dos: true }), estado: {} } },
          AAA: { texto: 'Comprueba: si doblas los tres lados, los ángulos no cambian. Misma forma, otro tamaño.', ecuacion: [`${d.g}° + ${d.h}° + ${180 - d.g - d.h}° = 180°`] },
        }[k];
        return {
          enunciado: [`En △ABC y △PQR se sabe: ${tipos[k].datos(d).join('; ')}. ¿Qué criterio asegura que son congruentes?`],
          dibujo: { datos: figCriterio(k, d), estado: {} },
          pasos: [
            { tipo: 'pide', texto: 'Piden el criterio que asegura △ABC ≅ △PQR, o decir que esos datos no bastan.' },
            { tipo: 'datos', texto: `${hay}, iguales en los dos triángulos.`, ecuacion: [tipos[k].datos(d).join('   ·   ')] },
            { tipo: 'regla', texto: 'Miro dónde queda la pieza del medio: un ángulo entre dos lados (LAL), un lado entre dos ángulos (ALA), o tres lados (LLL). Otra cosa no basta.' },
            { tipo: 'aplica', texto: aplica },
            Object.assign({ tipo: 'sentido' }, sentido),
          ],
          respuesta: { LAL: 'Son congruentes por LAL.', ALA: 'Son congruentes por ALA.', LLL: 'Son congruentes por LLL.', LLA: 'No basta: es LLA y puede haber dos triángulos.', AAA: 'No basta: AAA no fija el tamaño.' }[k],
        };
      },
    },
    ahoraTu: {
      voz: 'Ordena los datos: ¿el ángulo está entre los lados o no?',
      generar(s) {
        const r = azar(s), k = ['LAL', 'ALA', 'LLL', 'LLA', 'AAA'][s % 5];
        const d = { a: r.ent(4, 9), b: r.ent(4, 9), c: r.ent(4, 9), g: 5 * r.ent(8, 16), h: 5 * r.ent(6, 12) };
        const bien = tipos[k].nombre;
        const todos = ['LAL', 'ALA', 'LLL', 'No basta'];
        const motivo = { LAL: 'el ángulo quedara entre los dos lados', ALA: 'el lado quedara entre los dos ángulos', LLL: 'se dieran los tres lados', 'No basta': 'faltara un dato bien ubicado' };
        return {
          pregunta: [`En △ABC y △PQR se sabe: ${tipos[k].datos(d).join('; ')}. ¿Qué criterio asegura que son congruentes?`],
          opciones: [{ id: 'c', texto: bien, correcta: true }].concat(todos.filter(x => x !== bien).map(x => ({ id: x === 'No basta' ? 'no-basta' : x.toLowerCase(), texto: x, error: k === 'LLA' || k === 'AAA' ? 'GE-CON1' : 'GE-CON3', siFuera: `${x} sería cierto si ${motivo[x]}.` }))),
          solucion: { texto: { LAL: 'El ángulo A está entre AB y AC: LAL.', ALA: 'El lado AB está entre los ángulos A y B: ALA.', LLL: 'Los tres lados coinciden: LLL.', LLA: 'El ángulo A no está entre AB y BC: puede haber dos triángulos.', AAA: 'Iguales ángulos dan la misma forma, no el mismo tamaño.' }[k], ecuacion: [bien] },
        };
      },
    },
  };

  // ---------- Idea 2: mediatriz y bisectriz como lugares de puntos ----------
  // Cambia: la posición de P · Permanece: el segmento AB · Progresa: la diferencia PA − PB ·
  // Se reserva: la bisectriz de un ángulo · Debe verse: «equidistar» se mide con perpendiculares.
  const PA = { v: 'c-o', t: 'PA' }, PB = { v: 'c-i', t: 'PB' };
  const mediatriz = (dx, y) => {
    const P = [dx, y];
    return {
      alt: `P a ${f(U.dist(P, [-3, 0]))} de A y a ${f(U.dist(P, [3, 0]))} de B${dx === 0 ? ': está en la mediatriz y equidista' : ''}`,
      vista: { x: [-4.4, 4.4], y: [-3.6, 4.4] },
      puntos: [{ id: 'A', x: -3, y: 0, rotulo: 'A', lado: 180 }, { id: 'B', x: 3, y: 0, rotulo: 'B', lado: 0 }, { id: 'M', x: 0, y: 0, rotulo: 'M', lado: -45 },
        { id: 'P', x: dx, y, rotulo: 'P', color: 'h', lado: 90 }, { id: 'Z1', x: 0, y: -3.5, sinPunto: true }, { id: 'Z2', x: 0, y: 4.2, sinPunto: true }],
      segmentos: [{ de: 'A', a: 'B' }, { de: 'A', a: 'M', marcas: 1 }, { de: 'M', a: 'B', marcas: 1 }, { de: 'Z1', a: 'Z2', color: 'd', discontinua: true },
        { de: 'P', a: 'A', color: 'o', grosor: 'variable', texto: f(U.dist(P, [-3, 0])) }, { de: 'P', a: 'B', color: 'i', grosor: 'variable', texto: f(U.dist(P, [3, 0])) }],
      angulos: [{ en: 'M', de: 'B', a: 'Z2', color: 'd' }],
    };
  };
  const bisec = (o = {}) => {
    const O = [0, 0], P = U.polar(O, 5, 30), H1 = U.pie(P, O, [1, 0]), H2 = U.pie(P, O, U.polar(O, 1, 60));
    const k = o.pasos || {};
    return {
      alt: 'P está en la bisectriz del ángulo O de 60°, a 5 de O: sus distancias perpendiculares a los dos lados miden 2,5',
      vista: { x: [-0.8, 6.4], y: [-0.8, 5.6] },
      puntos: [{ id: 'O', x: 0, y: 0, rotulo: 'O', lado: 200 }, { id: 'X', x: 6.2, y: 0, sinPunto: true }, { id: 'Y', x: 3.1, y: 5.37, sinPunto: true },
        { id: 'P', x: P[0], y: P[1], rotulo: 'P', color: 'h', lado: 15 }, { id: 'H1', x: H1[0], y: H1[1], rotulo: 'H', lado: -90 }, { id: 'H2', x: H2[0], y: H2[1], rotulo: 'K', lado: 150 }],
      segmentos: [{ de: 'O', a: 'X' }, { de: 'O', a: 'Y' }, { de: 'O', a: 'P', color: 'd', discontinua: true, texto: k.op ? '5' : undefined, desde: k.op || 0 },
        { de: 'P', a: 'H1', color: 'o', grosor: 'variable', texto: o.d1 }, { de: 'P', a: 'H2', color: 'i', grosor: 'variable', texto: o.d2, desde: k.d2 || 0 }],
      angulos: [{ en: 'O', de: 'X', a: 'P', color: 'd', rayita: 1, radio: 40 }, { en: 'O', de: 'P', a: 'Y', color: 'd', rayita: 1, radio: 40 },
        { en: 'H1', de: 'O', a: 'P', color: 'o' }, { en: 'H2', de: 'P', a: 'O', color: 'i', desde: k.d2 || 0 }],
    };
  };
  // Así se resuelve (idea 2): la misma expresión «ax ± b» que escribe «Ahora tú».
  const exLineal = (a, b) => `${a}x ${b < 0 ? '−' : '+'} ${Math.abs(b)}`;
  // La figura del ejercicio: la de la mediatriz (P sobre la línea verde) o la de la bisectriz, con las distancias rotuladas.
  const figLugar = (med, t1, t2, alt) => {
    if (med) {
      const d = mediatriz(0, 3);
      d.segmentos.find(sg => sg.de === 'P' && sg.a === 'A').texto = t1;
      d.segmentos.find(sg => sg.de === 'P' && sg.a === 'B').texto = t2;
      d.alt = alt;
      return d;
    }
    return Object.assign(bisec({ d1: t1, d2: t2 }), { alt });
  };
  const lugares = {
    id: 'mediatriz-bisectriz',
    titulo: 'Puntos que equidistan',
    temas: ['Teorema de la mediatriz y de la bisectriz'],
    pieza: 'geo-figura',
    // Lee (fase 2): distancia a una recta, los nombres de las dos líneas y «equidistar», sin decir qué pasa en la bisectriz.
    lee: {
      tarjetas: [
        { titulo: 'La distancia a una recta', texto: 'Para ir de tu casa a la avenida recta más cercana, el camino más corto la cruza en ángulo recto. Esa es tu distancia a la avenida: se mide en perpendicular.' },
        { titulo: 'Dos líneas con nombre', texto: 'La mediatriz de un segmento AB es la recta perpendicular a AB que pasa por su punto medio. La bisectriz de un ángulo es la línea que lo parte en dos ángulos iguales.' },
        { titulo: 'Equidistar', texto: 'Equidistar es estar a la misma distancia de dos cosas. Si un paradero de Puno queda igual de lejos de dos colegios, el paradero equidista de ellos.' },
        { titulo: 'Qué mirar', texto: 'En el juego mueves P cerca de la línea verde, que es la mediatriz de AB. Compara PA y PB sobre la línea y fuera de ella.' },
      ],
    },
    juega: {
      consigna: 'Mueve el punto P. Compara sus distancias a A y a B, sobre la línea verde y fuera de ella.',
      voz: 'Sube y corre P. Comprueba cuándo PA y PB coinciden.',
      controles: [
        { id: 'dx', etiqueta: 'P a los lados', min: -2, max: 2, paso: 0.5, inicio: 0, unidad: '', decimales: 1 },
        { id: 'y', etiqueta: 'P a lo alto', min: -3, max: 4, paso: 1, inicio: 2, unidad: '', decimales: 0 },
      ],
      dibujo: v => ({ datos: mediatriz(v.dx, v.y), estado: {} }),
      // Se agarra el punto P: se mueve a los lados y a lo alto.
      arrastres: [{ id: 'punto-p', etiqueta: 'punto P', color: 'c-h',
        donde: v => enPantalla(mediatriz(v.dx, v.y), [v.dx, v.y]),
        mover: (pt, v) => { const q = alPlano(mediatriz(v.dx, v.y), pt); return { dx: q[0], y: q[1] }; } }],
      lectura: v => [PA, ` = ${f(U.dist([v.dx, v.y], [-3, 0]))}   ·   `, PB, ` = ${f(U.dist([v.dx, v.y], [3, 0]))}`],
      minimo: 4,
    },
    predice: {
      pregunta: 'Ahora P está en la bisectriz de un ángulo de 60°, a 5 de su vértice O. Su distancia a un lado mide 2,5. ¿Cuánto mide su distancia al otro lado?',
      voz: 'Piensa en cómo se mide la distancia a una recta.',
      opciones: [
        { id: 'c', texto: '2,5', correcta: true },
        { id: 'op', texto: '5', error: 'GE-CON6', siFuera: '5 es la distancia a O, el vértice. La distancia a un lado se mide en perpendicular.' },
        { id: 'depende', texto: 'Depende de dónde mida', error: 'GE-CON6', siFuera: 'A lo largo del lado sí cambia; la distancia es la perpendicular, y esa es única.' },
        { id: 'resta', texto: '2,5 por √3', error: 'GE-CON7', siFuera: 'Eso sería el tramo OH sobre el lado, no la perpendicular desde P.' },
      ],
      dibujo: { datos: bisec({ d1: '2,5' }), estado: {} },
      revelar: { datos: bisec({ d1: '2,5', d2: '2,5' }), estado: {} },
      coincide: 'Coincide: los dos triángulos OHP y OKP son congruentes.',
    },
    // Hallazgo 9: el juego mueve P junto a la mediatriz y «Mira» prueba el caso de la bisectriz, el de la predicción. Son
    // dos lugares distintos de la misma idea (equidistar); la mediatriz ya quedó vista al jugar.
    mira: {
      datos: bisec({ d1: 'PH', d2: 'PK', pasos: { op: 1, d2: 2 } }),
      voz: 'Compara los dos triángulos rectángulos pieza por pieza.',
      pasos: [
        { estado: { corte: 1 }, texto: 'OHP y OKP comparten la hipotenusa OP.', ecuacion: ['OP común'] },
        { estado: { corte: 2 }, texto: 'Tienen un ángulo recto y la mitad del ángulo O.', ecuacion: ['∠H = ∠K = 90°', '   ·   ', '∠HOP = ∠KOP'] },
        { estado: { corte: 2 }, texto: 'Por ALA son congruentes: los lados opuestos al ángulo igual coinciden.', ecuacion: [{ v: 'c-o', t: 'PH' }, ' = ', { v: 'c-i', t: 'PK' }] },
      ],
    },
    regla: {
      texto: 'Un punto de la mediatriz de AB equidista de A y de B. Un punto de la bisectriz de un ángulo equidista de sus dos lados.',
      ecuacion: [{ llave: [PA, ' = ', PB], nota: 'en la mediatriz', color: 'c-o' }, '   ·   ', { llave: [{ v: 'c-o', t: 'PH' }, ' = ', { v: 'c-i', t: 'PK' }], nota: 'en la bisectriz', color: 'c-i' }],
      condicion: 'la distancia a un lado se mide en perpendicular. Y al revés: quien equidista está en la mediatriz o en la bisectriz.',
      voz: 'Equidistar se mide con perpendiculares, no a ojo.',
    },
    // Así se resuelve (fase 2): el problema de «Ahora tú» (mismas cuentas) con otra semilla, resuelto paso a paso.
    resuelve: {
      generar(s) {
        const r = azar(s + 900), x = r.ent(2, 9), a1 = r.ent(2, 6);
        let a2 = r.ent(2, 7); if (a2 === a1) a2 += 1;
        const v = r.ent(8, 20) + Math.max(a1, a2) * x;
        const b1 = v - a1 * x, b2 = v - a2 * x;
        const med = s % 2 === 0;
        const e1 = exLineal(a1, b1), e2 = exLineal(a2, b2);
        const D1 = med ? PA : { v: 'c-o', t: 'PH' }, D2 = med ? PB : { v: 'c-i', t: 'PK' };
        const [ga, gb] = a1 > a2 ? [a1 - a2, b2 - b1] : [a2 - a1, b1 - b2];
        const alt = (t1, t2) => med ? `P en la mediatriz de AB: PA = ${t1} y PB = ${t2}` : `P en la bisectriz del ángulo O: sus distancias a los lados miden ${t1} y ${t2}`;
        return {
          enunciado: med ? ['P está en la mediatriz de AB, con ', PA, ` = ${e1} y `, PB, ` = ${e2}. ¿Cuánto mide `, PA, '?']
            : ['P está en la bisectriz del ángulo O. Sus distancias a los lados miden ', D1, ` = ${e1} y `, D2, ` = ${e2}. ¿Cuánto mide cada una?`],
          dibujo: { datos: figLugar(med, e1, e2, alt(e1, e2)), estado: {} },
          pasos: [
            { tipo: 'pide', texto: med ? ['Piden ', PA, ', la distancia de P a A. Hallar x es solo el camino.'] : 'Piden cuánto mide cada distancia de P a los lados del ángulo O.' },
            { tipo: 'datos', texto: [D1, ` = ${e1} y `, D2, ` = ${e2}, con P en la ${med ? 'mediatriz de AB' : 'bisectriz del ángulo O'}.`] },
            { tipo: 'regla', texto: med ? 'Un punto de la mediatriz está igual de lejos de A que de B. Entonces las dos expresiones valen lo mismo y puedo igualarlas.'
              : 'Un punto de la bisectriz está igual de lejos de los dos lados, medido en perpendicular. Entonces puedo igualar las dos expresiones.' },
            { tipo: 'cuentas', texto: 'Igualo, junto las x en un lado y despejo. Después reemplazo x en la primera expresión.',
              ecuacion: [`${e1} = ${e2}   →   ${ga === 1 ? '' : `${ga}x = ${gb}   →   `}x = ${x}   ·   `, D1, ` = ${a1} · ${x} + ${b1} = ${v}`],
              dibujo: { datos: figLugar(med, `${v}`, `${v}`, alt(v, v)), estado: {} } },
            { tipo: 'sentido', texto: 'Comprueba con la otra expresión: tiene que dar lo mismo, porque P equidista.', ecuacion: [D2, ` = ${a2} · ${x} + ${b2} = ${v}`] },
          ],
          respuesta: med ? [PA, ` = ${v}`] : `Cada distancia mide ${v}.`,
        };
      },
    },
    ahoraTu: {
      voz: 'Iguala las dos distancias y despeja.',
      generar(s) {
        const r = azar(s), x = r.ent(2, 9), a1 = r.ent(2, 6);
        let a2 = r.ent(2, 7); if (a2 === a1) a2 += 1;
        const v = r.ent(8, 20) + Math.max(a1, a2) * x;
        const b1 = v - a1 * x, b2 = v - a2 * x;
        const med = s % 2 === 0;
        const ex = (a, b) => `${a}x ${b < 0 ? '−' : '+'} ${Math.abs(b)}`;
        return {
          pregunta: med ? [`P está en la mediatriz de AB, con PA = ${ex(a1, b1)} y PB = ${ex(a2, b2)}. ¿Cuánto mide PA?`]
            : [`P está en la bisectriz del ángulo O. Sus distancias a los lados miden ${ex(a1, b1)} y ${ex(a2, b2)}. ¿Cuánto mide cada una?`],
          opciones: opciones(v, [
            { id: 'x', valor: x, error: 'GE-CON8', siFuera: `${x} es el valor de x. Falta reemplazarlo en la distancia.` },
            { id: 'suma', valor: 2 * v, error: 'GE-CON8', siFuera: 'Eso suma las dos distancias; cada una mide la mitad.' },
            { id: 'otro', valor: v + Math.abs(a1 - a2), error: 'GE-CON8', siFuera: 'Revisa el despeje: con x correcto las dos expresiones dan lo mismo.' },
          ], n => f(n, 2)),
          solucion: { texto: med ? 'En la mediatriz, PA = PB.' : 'En la bisectriz, las dos distancias son iguales.', ecuacion: [`${ex(a1, b1)} = ${ex(a2, b2)} → x = ${x} → ${v}`] },
        };
      },
    },
  };

  // ---------- Idea 3: la base media ----------
  // Cambia: el vértice A · Permanece: la base BC = 8 · Progresa: MN, siempre 4 y paralela ·
  // Se reserva: la paralela por M (recíproco) · Debe verse: MN = BC/2 por congruencia, no por medida.
  const base = (ax, ay, o = {}) => {
    const A = [ax, ay], B = [0, 0], C = [8, 0], M = U.medio(A, B), N = U.medio(A, C), D = [2 * N[0] - M[0], 2 * N[1] - M[1]];
    const k = o.pasos || {};
    return {
      alt: o.alt || `M y N son puntos medios de AB y AC: MN mide 4, la mitad de BC = 8, y es paralela a BC`,
      vista: { x: [-1.6, 12.4], y: [-0.8, 5.4] },
      puntos: [{ id: 'A', x: ax, y: ay, rotulo: 'A', lado: 90 }, { id: 'B', x: 0, y: 0, rotulo: 'B', lado: -120 }, { id: 'C', x: 8, y: 0, rotulo: 'C', lado: -60 },
        { id: 'M', x: M[0], y: M[1], rotulo: 'M', lado: 160 }, { id: 'N', x: N[0], y: N[1], rotulo: o.recip ? '?' : 'N', lado: 20 },
        ...(k.D !== undefined ? [{ id: 'D', x: D[0], y: D[1], rotulo: 'D', color: 'h', lado: 20, desde: k.D }] : [])],
      segmentos: [{ de: 'A', a: 'M', marcas: 1 }, { de: 'M', a: 'B', marcas: 1 }, { de: 'A', a: 'N', marcas: o.recip ? 0 : 2 }, { de: 'N', a: 'C', marcas: o.recip ? 0 : 2 },
        { de: 'B', a: 'C', color: 'd', grosor: 'variable', texto: o.bc || '8', paralela: o.paralela || o.recip ? 1 : 0 },
        { de: 'M', a: 'N', color: 'o', grosor: 'variable', texto: o.sinMN ? undefined : '4', paralela: o.paralela || o.recip ? 1 : 0 },
        ...(k.D !== undefined ? [{ de: 'N', a: 'D', color: 'o', discontinua: true, desde: k.D }, { de: 'C', a: 'D', color: 'h', grosor: 'variable', desde: k.CD }] : [])],
    };
  };
  // Así se resuelve (idea 3): el triángulo de lados a = BC, b = AC y c = AB con el triángulo de sus puntos medios.
  const figMedio = (a, b, c, conMedio) => {
    const x = (a * a + c * c - b * b) / (2 * a), A = [x, Math.sqrt(c * c - x * x)], M = U.medio(A, [0, 0]), N = U.medio(A, [a, 0]), P = [a / 2, 0];
    return {
      alt: `Triángulo de lados ${a}, ${b} y ${c}; al unir los puntos medios de sus lados sale un triángulo${conMedio ? ` de lados ${f(a / 2)}, ${f(b / 2)} y ${f(c / 2)}` : ''}`,
      vista: { x: [Math.min(0, x) - 1.6, Math.max(a, x) + 1.6], y: [-1.4, A[1] + 1.2] },
      puntos: [{ id: 'A', x: A[0], y: A[1], rotulo: 'A', lado: 90 }, { id: 'B', x: 0, y: 0, rotulo: 'B', lado: -135 }, { id: 'C', x: a, y: 0, rotulo: 'C', lado: -45 },
        { id: 'M', x: M[0], y: M[1], rotulo: 'M', lado: 160 }, { id: 'N', x: N[0], y: N[1], rotulo: 'N', lado: 20 }, { id: 'P', x: P[0], y: P[1], rotulo: 'P', lado: -90 }],
      regiones: [{ puntos: ['M', 'N', 'P'], color: 'o', opacidad: 0.1 }],
      segmentos: [{ de: 'B', a: 'C', color: 'd', texto: `${a}` }, { de: 'C', a: 'A', color: 'd', texto: `${b}` }, { de: 'A', a: 'B', color: 'd', texto: `${c}` },
        { de: 'M', a: 'N', color: 'o', grosor: 'variable', texto: conMedio ? f(a / 2) : undefined }, { de: 'N', a: 'P', color: 'o', grosor: 'variable', texto: conMedio ? f(c / 2) : undefined },
        { de: 'P', a: 'M', color: 'o', grosor: 'variable', texto: conMedio ? f(b / 2) : undefined }],
    };
  };
  const baseMedia = {
    id: 'base-media',
    titulo: 'La base media mide la mitad',
    temas: ['Teorema de la base media'],
    pieza: 'geo-figura',
    // Lee (fase 2): punto medio y base media como nombres, sin decir dónde corta la paralela (eso es Predice).
    lee: {
      tarjetas: [
        { titulo: 'El punto medio', texto: 'El punto medio de un lado lo parte en dos tramos iguales. En las figuras de este tema, dos tramos con las mismas rayitas miden lo mismo.' },
        { titulo: 'La base media', texto: 'Si unes los puntos medios de dos lados de un triángulo, obtienes un segmento llamado base media. El tercer lado, el que no tocaste, es la base con la que se compara.' },
        { titulo: 'En un techo', texto: 'En un techo a dos aguas de Puno, el carpintero clava un listón que une la mitad de una viga inclinada con la mitad de la otra. Ese listón es una base media.' },
        { titulo: 'Qué mirar', texto: 'En el juego mueves el vértice A, y los puntos medios M y N lo siguen. Mira el largo de MN y su dirección frente a la base BC.' },
      ],
    },
    juega: {
      consigna: 'M y N son los puntos medios de AB y AC. Mueve el vértice A y compara MN con la base BC.',
      voz: 'Mueve A. Busca lo que no cambia en MN.',
      controles: [
        { id: 'ax', etiqueta: 'A a lo ancho', min: -1, max: 11, paso: 1, inicio: 3, unidad: '', decimales: 0 },
        { id: 'ay', etiqueta: 'A a lo alto', min: 2, max: 5, paso: 1, inicio: 4, unidad: '', decimales: 0 },
      ],
      dibujo: v => ({ datos: base(v.ax, v.ay, { paralela: true }), estado: {} }),
      // Se agarra el vértice A: M y N lo siguen, la base BC no se mueve.
      arrastres: [{ id: 'vertice-a', etiqueta: 'vértice A', color: 'c-o',
        donde: v => enPantalla(base(v.ax, v.ay, { paralela: true }), [v.ax, v.ay]),
        mover: (pt, v) => { const q = alPlano(base(v.ax, v.ay, { paralela: true }), pt); return { ax: q[0], ay: q[1] }; } }],
      lectura: v => [{ v: 'c-o', t: 'MN' }, ' = 4   ·   ', { v: 'c-d', t: 'BC' }, ' = 8   ·   paralelas'],
      minimo: 3,
    },
    predice: {
      pregunta: 'Ahora al revés: desde el punto medio M de AB trazamos una paralela a BC. ¿Dónde corta al lado AC?',
      voz: 'Ya viste la ida. Piensa si el camino de vuelta también vale.',
      opciones: [
        { id: 'c', texto: 'En el punto medio de AC', correcta: true },
        { id: 'depende', texto: 'Depende de la forma del triángulo', error: 'GE-CON9', siFuera: 'La forma sí cambia los largos; la paralela por el punto medio siempre parte AC por la mitad.' },
        { id: 'tercio', texto: 'A un tercio de A', error: 'GE-CON9', siFuera: 'Un tercio saldría si M estuviera a un tercio de AB. Está en la mitad.' },
      ],
      dibujo: { datos: base(3, 4, { sinMN: true, recip: true, alt: 'M es punto medio de AB; desde M sale una paralela a BC que corta a AC' }), estado: {} },
      revelar: { datos: base(3, 4, { paralela: true }), estado: {} },
      coincide: 'Coincide: la paralela por un punto medio llega al otro punto medio.',
    },
    mira: {
      datos: base(3, 4, { pasos: { D: 1, CD: 2 }, alt: 'Se prolonga MN hasta D con ND = MN; el triángulo NCD copia al ANM y MBCD resulta paralelogramo' }),
      voz: 'Una copia del triángulo pequeño hace la prueba.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Prolongamos MN hasta D, con ND = MN.', ecuacion: ['ND = MN'] },
        { estado: { corte: 2 }, texto: 'ANM y CND: dos lados iguales y el ángulo opuesto por el vértice. LAL.', ecuacion: ['△ANM ≅ △CND'] },
        { estado: { corte: 2 }, texto: 'Así CD = AM = MB y CD es paralela a AB.', ecuacion: ['MBCD es paralelogramo'] },
        { estado: { corte: 2 }, texto: 'En el paralelogramo, MD = BC; y MN es la mitad de MD.', ecuacion: [{ v: 'c-o', t: 'MN' }, ' = ', { frac: [{ v: 'c-d', t: 'BC' }, '2'] }, ' = 4'] },
      ],
    },
    regla: {
      texto: 'El segmento que une los puntos medios de dos lados es paralelo al tercero y mide su mitad. La paralela por un punto medio llega al otro punto medio.',
      ecuacion: [{ llave: [{ v: 'c-o', t: 'MN' }], nota: 'base media', color: 'c-o' }, ' = ', { frac: [{ v: 'c-d', t: 'BC' }, '2'] }, '   ·   ', 'MN ∥ BC'],
      condicion: 'M y N son puntos medios de dos lados del mismo triángulo; MN se compara con el tercer lado.',
      voz: 'La prueba usa congruencia. El dibujo solo la sugiere.',
    },
    // Así se resuelve (fase 2): los dos tipos de «Ahora tú» (base media y triángulo de los puntos medios), con otra semilla.
    resuelve: {
      generar(s) {
        const r = azar(s + 900), tipo = s % 2;
        const MN = { v: 'c-o', t: 'MN' }, BC = { v: 'c-d', t: 'BC' };
        if (tipo === 0) {
          const bc = 2 * r.ent(3, 14), ax = r.ent(1, 7), ay = r.ent(3, 5);
          const fig = con => {
            const d = base(ax, ay, { sinMN: !con, bc: `${bc}`, alt: `M y N son puntos medios de AB y AC; BC mide ${bc}${con ? ` y MN, ${f(bc / 2)}` : ''}` });
            if (con) d.segmentos.find(sg => sg.de === 'M' && sg.a === 'N').texto = f(bc / 2);
            return { datos: d, estado: {} };
          };
          return {
            enunciado: ['En el triángulo ABC, M y N son puntos medios de AB y AC, y ', BC, ` = ${bc}. ¿Cuánto mide `, MN, '?'],
            dibujo: fig(false),
            pasos: [
              { tipo: 'pide', texto: ['Piden ', MN, ', el segmento que une los puntos medios de AB y AC.'] },
              { tipo: 'datos', texto: ['M y N son puntos medios, y el lado que no tocan, ', BC, `, mide ${bc}.`] },
              { tipo: 'regla', texto: 'Un segmento que une los puntos medios de dos lados va paralelo al tercer lado y mide la mitad de él.', ecuacion: [MN, ' = ', { frac: [BC, '2'] }] },
              { tipo: 'cuentas', texto: ['Parto ', BC, ' en dos.'], ecuacion: [MN, ` = ${bc} ÷ 2 = ${f(bc / 2)}`], dibujo: fig(true) },
              { tipo: 'sentido', texto: ['Comprueba al revés: el doble de ', MN, ' tiene que dar ', BC, '.'], ecuacion: [`2 · ${f(bc / 2)} = ${bc}`] },
            ],
            respuesta: [MN, ` = ${f(bc / 2)}`],
          };
        }
        const a = r.ent(5, 14), b = r.ent(5, 14), c = r.ent(Math.abs(a - b) + 1, a + b - 1);
        const p = a + b + c;
        return {
          enunciado: [`Un triángulo tiene lados ${a}, ${b} y ${c}. Unimos los puntos medios de sus tres lados. ¿Cuál es el perímetro del triángulo que se forma?`],
          dibujo: { datos: figMedio(a, b, c, false), estado: {} },
          pasos: [
            { tipo: 'pide', texto: 'Piden el perímetro del triángulo MNP, el que forman los tres puntos medios.' },
            { tipo: 'datos', texto: `El triángulo grande tiene lados ${a}, ${b} y ${c}.` },
            { tipo: 'regla', texto: 'Cada lado del triángulo MNP une dos puntos medios: es una base media y mide la mitad del lado grande que tiene enfrente.' },
            { tipo: 'cuentas', texto: 'Sumo las tres mitades.', ecuacion: [`${a}/2 + ${b}/2 + ${c}/2 = ${f(a / 2)} + ${f(b / 2)} + ${f(c / 2)} = ${f(p / 2)}`], dibujo: { datos: figMedio(a, b, c, true), estado: {} } },
            { tipo: 'sentido', texto: `Comprueba: el perímetro grande es ${p}, y el pequeño debe ser su mitad.`, ecuacion: [`${p} ÷ 2 = ${f(p / 2)}`] },
          ],
          respuesta: `El perímetro mide ${f(p / 2)}.`,
        };
      },
    },
    ahoraTu: {
      voz: 'Ubica los puntos medios y el lado que les corresponde.',
      generar(s) {
        const r = azar(s), tipo = s % 2;
        if (tipo === 0) {
          const bc = 2 * r.ent(3, 14);
          return {
            pregunta: ['En el triángulo ABC, M y N son puntos medios de AB y AC, y ', { v: 'c-d', t: 'BC' }, ` = ${bc}. ¿Cuánto mide `, { v: 'c-o', t: 'MN' }, '?'],
            dibujo: { datos: base(r.ent(1, 7), r.ent(3, 5), { sinMN: true, bc: `${bc}`, alt: `M y N son puntos medios de AB y AC; BC mide ${bc}` }), estado: {} },
            opciones: opciones(bc / 2, [
              { id: 'igual', valor: bc, error: 'GE-CON10', siFuera: 'Ser paralela a BC no la hace igual: MN mide la mitad.' },
              { id: 'doble', valor: 2 * bc, error: 'GE-CON10', siFuera: 'Es al revés: BC es el doble de MN.' },
              { id: 'tercio', valor: bc / 3, error: 'GE-CON10', siFuera: 'Un tercio no viene de los puntos medios; la razón es 1 a 2.' },
            ], n => f(n, 1)),
            solucion: { texto: 'La base media mide la mitad del tercer lado.', ecuacion: [{ v: 'c-o', t: 'MN' }, ` = ${bc} ÷ 2 = ${bc / 2}`] },
          };
        }
        const a = r.ent(5, 14), b = r.ent(5, 14), c = r.ent(Math.abs(a - b) + 1, a + b - 1);
        const p = a + b + c;
        return {
          pregunta: [`Un triángulo tiene lados ${a}, ${b} y ${c}. Unimos los puntos medios de sus tres lados. ¿Cuál es el perímetro del triángulo que se forma?`],
          opciones: opciones(p / 2, [
            { id: 'igual', valor: p, error: 'GE-CON10', siFuera: 'Cada lado nuevo mide la mitad de uno original: el perímetro también.' },
            { id: 'cuarto', valor: p / 4, error: 'GE-CON11', siFuera: 'Un cuarto es lo que pasa con el área, no con el perímetro.' },
            { id: 'tercio', valor: p / 3, error: 'GE-CON10', siFuera: 'Un tercio no viene de los puntos medios; cada lado es la mitad.' },
          ], n => f(n, 1)),
          solucion: { texto: 'Cada lado del triángulo medio es una base media.', ecuacion: [`${a}/2 + ${b}/2 + ${c}/2 = ${f(p / 2)}`] },
        };
      },
    },
  };

  // ---------- Idea 4: la mediana a la hipotenusa ----------
  // Cambia: la posición de C en la semicircunferencia · Permanece: la hipotenusa AB = 10 · Progresa: el ángulo C, siempre 90° ·
  // Se reserva: C dentro del círculo · Debe verse: MC = MA = MB = 5 porque el rectángulo tiene diagonales iguales.
  const semi = (fi, o = {}) => {
    const C = o.C || U.polar([0, 0], 5, fi), D = [-C[0], -C[1]];
    const k = o.pasos || {};
    const cm = U.dist(C, [0, 0]);
    return {
      alt: o.alt || `Triángulo rectángulo en C con hipotenusa 10: la mediana CM mide ${f(cm)}${o.C ? '' : ', la mitad de AB'}`,
      vista: { x: [-5.8, 5.8], y: [k.D !== undefined ? -5.6 : -1.6, 5.8] },
      puntos: [{ id: 'A', x: -5, y: 0, rotulo: 'A', lado: 180 }, { id: 'B', x: 5, y: 0, rotulo: 'B', lado: 0 }, { id: 'M', x: 0, y: 0, rotulo: 'M', lado: -90 },
        { id: 'C', x: C[0], y: C[1], rotulo: 'C', color: 'o', lado: 90 }, ...(k.D !== undefined ? [{ id: 'D', x: D[0], y: D[1], rotulo: 'D', lado: -90, desde: k.D }] : [])],
      arcos: o.circulo === false ? [] : [{ centro: [0, 0], r: 5, de: 0, a: 180, color: 'd', discontinua: true, desde: k.circ || 0 }],
      regiones: [{ puntos: ['A', 'B', 'C'], color: 'i', opacidad: 0.08 }],
      rotulos: o.sinAB ? [] : [{ x: 0, y: -1.2, texto: 'AB = 10' }],
      segmentos: [{ de: 'A', a: 'M', marcas: 1 }, { de: 'M', a: 'B', marcas: 1 }, { de: 'A', a: 'C' }, { de: 'B', a: 'C' },
        { de: 'C', a: 'M', color: 'h', grosor: 'variable', texto: o.sinCM ? undefined : f(cm) },
        ...(k.D !== undefined ? [{ de: 'A', a: 'D', discontinua: true, desde: k.D }, { de: 'B', a: 'D', discontinua: true, desde: k.D }, { de: 'M', a: 'D', color: 'h', discontinua: true, desde: k.D }] : [])],
      angulos: [{ en: 'C', de: 'A', a: 'B', color: 'o', texto: o.C ? `${f(U.angulo(C, [-5, 0], [5, 0]), 0)}°` : undefined }],
    };
  };
  // Así se resuelve (idea 4): el triángulo recto en C con ∠A = a. Con M en el origen, C = polar(5, 2a) deja el arco CB
  // en 2a y el ángulo inscrito en A en a.
  const figMediana = (a, o = {}) => {
    const C = U.polar([0, 0], 5, 2 * a);
    const d = semi(0, { C, sinCM: true, circulo: false, sinAB: true, alt: o.alt || `Triángulo rectángulo en C con ∠A = ${a}° y la mediana CM` });
    d.angulos = [{ en: 'C', de: 'A', a: 'B', color: 'o' }, { en: 'A', de: 'B', a: 'C', color: 'i', texto: `${a}°` }];
    if (o.copia === 'A') d.angulos.push({ en: 'C', de: 'A', a: 'M', color: 'h', texto: `${a}°`, radio: 30 });
    if (o.copia === 'B') d.angulos.push({ en: 'C', de: 'M', a: 'B', color: 'h', texto: `${90 - a}°`, radio: 30 }, { en: 'B', de: 'C', a: 'A', color: 'i', texto: `${90 - a}°` });
    return d;
  };
  const medianaHip = {
    id: 'mediana-hipotenusa',
    titulo: 'La mediana a la hipotenusa',
    temas: ['Mediana relativa a la hipotenusa'],
    pieza: 'geo-figura',
    // Lee (fase 2): hipotenusa, cateto y mediana, sin decir cuánto mide CM ni qué pasa si C sale del arco.
    lee: {
      tarjetas: [
        { titulo: 'Esquinas rectas', texto: 'Las esquinas de una hoja de cuaderno o de una losa en Juliaca miden 90°. Un triángulo con una esquina así es rectángulo; en este tema, su esquina recta está en C.' },
        { titulo: 'Hipotenusa y catetos', texto: 'En un triángulo rectángulo, el lado frente al ángulo de 90° es la hipotenusa, y es el más largo. Los otros dos, los que forman la esquina recta, son los catetos.' },
        { titulo: 'La mediana', texto: 'Una mediana une un vértice con el punto medio del lado de enfrente. Aquí importa la que sale de C, la esquina recta, y llega a M, la mitad de la hipotenusa.' },
        { titulo: 'Qué mirar', texto: 'En el juego, C corre por la semicircunferencia de diámetro AB = 10. Mira dos lecturas, el ángulo en C y el largo de CM, y fíjate cuáles cambian.' },
      ],
    },
    juega: {
      consigna: 'C se mueve por la semicircunferencia de diámetro AB = 10. Mira el ángulo en C y la mediana CM.',
      voz: 'Corre C por el arco. Comprueba qué medidas permanecen.',
      controles: [{ id: 'fi', etiqueta: 'C en el arco', min: 20, max: 160, paso: 20, inicio: 60, unidad: '°', decimales: 0 }],
      dibujo: v => ({ datos: semi(v.fi), estado: {} }),
      // Se agarra el vértice C: corre por el arco, nunca fuera de él.
      arrastres: [{ id: 'vertice-c', etiqueta: 'vértice C en el arco', color: 'c-o',
        donde: v => enPantalla(semi(v.fi), U.polar([0, 0], 5, v.fi)),
        mover: (pt, v) => { const q = alPlano(semi(v.fi), pt); return { fi: U.grados(Math.atan2(Math.max(q[1], 0), q[0])) }; } }],
      lectura: v => [{ v: 'c-o', t: '∠C' }, ` = 90°   ·   `, { v: 'c-h', t: 'CM' }, ' = 5'],
      minimo: 3,
    },
    predice: {
      pregunta: 'Ahora C se mete dentro del círculo: el ángulo en C deja de ser recto y queda obtuso. ¿Cómo queda la mediana CM?',
      voz: 'C salió del arco. Decide qué condición se perdió.',
      opciones: [
        { id: 'c', texto: 'Más corta que 5', correcta: true },
        { id: 'igual', texto: 'Sigue midiendo 5', error: 'GE-CON12', siFuera: 'Seguiría en 5 si el ángulo en C siguiera recto. Dentro del círculo, C se acerca a M.' },
        { id: 'larga', texto: 'Más larga que 5', error: 'GE-CON12', siFuera: 'Sería más larga si C saliera del círculo: ahí el ángulo queda agudo.' },
      ],
      dibujo: { datos: semi(0, { C: [1.5, 2.5], sinCM: true, alt: 'C dentro del semicírculo de diámetro AB = 10: el ángulo en C es obtuso' }), estado: {} },
      revelar: { datos: semi(0, { C: [1.5, 2.5], alt: 'C dentro del semicírculo: el ángulo en C es obtuso y la mediana CM mide 2,9' }), estado: {} },
      coincide: 'Coincide: dentro del círculo, CM queda menor que la mitad de AB.',
    },
    mira: {
      datos: semi(60, { pasos: { D: 1, circ: 3 } }),
      voz: 'Completa el rectángulo: la prueba sale de sus diagonales.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Completamos el rectángulo ACBD con el ángulo recto en C.', ecuacion: ['ACBD rectángulo'] },
        { estado: { corte: 2 }, texto: 'Sus diagonales son iguales y se cortan en su punto medio M.', ecuacion: ['CD = AB', '   ·   ', 'M punto medio de ambas'] },
        { estado: { corte: 3 }, texto: 'Por eso MC = MA = MB: C está en la circunferencia de diámetro AB.', ecuacion: [{ v: 'c-h', t: 'CM' }, ' = ', { frac: ['AB', '2'] }, ' = 5'] },
      ],
    },
    regla: {
      texto: 'En un triángulo rectángulo, la mediana relativa a la hipotenusa mide la mitad de la hipotenusa.',
      ecuacion: [{ llave: [{ v: 'c-h', t: 'CM' }], nota: 'mediana', color: 'c-h' }, ' = ', { llave: [{ frac: ['AB', '2'] }], nota: 'mitad de AB', color: 'c-h' }, '   ·   ', 'MA = MB = MC'],
      condicion: 'el ángulo en C es recto. Y al revés: si CM es la mitad de AB, el ángulo en C es recto.',
      voz: 'Sin ángulo recto, la igualdad se pierde. Verifícalo siempre.',
    },
    // Así se resuelve (fase 2): el problema de «Ahora tú» (mismo rango de ∠A y mismas dos preguntas) con otra semilla.
    resuelve: {
      generar(s) {
        const r = azar(s + 900), a = 5 * r.ent(4, 14), pide = s % 2;
        const CM = { v: 'c-h', t: 'CM' }, nom = pide ? '∠MCB' : '∠MCA', bien = pide ? 90 - a : a;
        return {
          enunciado: [`En el triángulo ABC, recto en C, M es el punto medio de la hipotenusa AB y ∠A = ${a}°. ¿Cuánto mide ${nom}?`],
          dibujo: { datos: figMediana(a), estado: {} },
          pasos: [
            { tipo: 'pide', texto: ['Piden ', nom, ': el ángulo entre la mediana ', CM, ` y el cateto ${pide ? 'CB' : 'CA'}.`] },
            { tipo: 'datos', texto: `El triángulo es recto en C y ∠A = ${a}°. M es el punto medio de la hipotenusa AB.` },
            { tipo: 'regla', texto: ['En un triángulo rectángulo, la mediana a la hipotenusa mide la mitad de ella. Así ', CM, ' es igual a MA y a MB.'], ecuacion: [CM, ' = MA = MB'] },
            pide ? { tipo: 'cuentas', texto: ['Como ', CM, ' = MB, el triángulo MCB es isósceles y copia el ángulo B. Primero saco ∠B.'],
              ecuacion: [`∠B = 90° − ${a}° = ${90 - a}°   →   ∠MCB = ${90 - a}°`], dibujo: { datos: figMediana(a, { copia: 'B', alt: `MC = MB: el ángulo MCB copia al ángulo B, de ${90 - a}°` }), estado: {} } }
              : { tipo: 'cuentas', texto: ['Como ', CM, ' = MA, el triángulo MCA es isósceles: sus ángulos en A y en C son iguales.'],
                ecuacion: [`∠MCA = ∠A = ${a}°`], dibujo: { datos: figMediana(a, { copia: 'A', alt: `MC = MA: el ángulo MCA copia al ángulo A, de ${a}°` }), estado: {} } },
            { tipo: 'sentido', texto: 'Comprueba: los dos trozos en que la mediana parte el ángulo C deben sumar 90°.', ecuacion: [`∠MCA + ∠MCB = ${a}° + ${90 - a}° = 90°`] },
          ],
          respuesta: `${nom} = ${bien}°`,
        };
      },
    },
    ahoraTu: {
      voz: 'MC = MB forma un triángulo isósceles. Úsalo.',
      generar(s) {
        const r = azar(s), a = 5 * r.ent(4, 14), pide = s % 2;
        // Con M en el origen y A = (−5, 0), ∠A es inscrito sobre el arco CB: C = polar(5, 2a) deja ∠CAB = a.
        const C = U.polar([0, 0], 5, 2 * a);
        const d = semi(0, { C, sinCM: true, circulo: false, sinAB: true, alt: `Triángulo rectángulo en C con ∠A = ${a}° y la mediana CM` });
        d.angulos = [{ en: 'C', de: 'A', a: 'B', color: 'o' }, { en: 'A', de: 'B', a: 'C', color: 'i', texto: `${a}°` }];
        const bien = pide ? 90 - a : a;
        return {
          pregunta: [`En el triángulo ABC, recto en C, M es el punto medio de la hipotenusa AB y ∠A = ${a}°. ¿Cuánto mide ${pide ? '∠MCB' : '∠MCA'}?`],
          dibujo: { datos: d, estado: {} },
          opciones: opciones(bien, [
            { id: 'otro', valor: pide ? a : 90 - a, error: 'GE-CON13', siFuera: pide ? 'Ese es ∠MCA, el que copia a A. ∠MCB copia a B.' : 'Ese es ∠MCB, el que copia a B. ∠MCA copia a A.' },
            { id: 'doble', valor: 2 * (pide ? 90 - a : a), error: 'GE-CON13', siFuera: 'El doble sería el ángulo en M, no en C.' },
            { id: 'recto', valor: 90, error: 'GE-CON12', siFuera: '90° es todo el ángulo C; la mediana lo parte en dos.' },
          ], gr),
          solucion: { texto: pide ? 'MC = MB: el triángulo MCB es isósceles y copia ∠B.' : 'MC = MA: el triángulo MCA es isósceles y copia ∠A.', ecuacion: pide ? [`∠MCB = ∠B = 90° − ${a}° = ${90 - a}°`] : [`∠MCA = ∠A = ${a}°`] },
        };
      },
    },
  };

  // ---------- Idea 5: triángulos rectángulos notables ----------
  // Cambia: el tipo y la escala k · Permanece: el ángulo recto · Progresa: los tres lados como múltiplos de k ·
  // Se reserva: el 45° visto como medio cuadrado · Debe verse: los lados salen de un cuadrado o de un equilátero partido.
  const rd = (k, m) => (m === 1 ? f(k, 2) : `${k === 1 ? '' : f(k, 2)}√${m}`);
  const notable = (tipo, k, o = {}) => {
    const datos = {
      '30-60': { ang: [30, 60], cat: [k * Math.sqrt(3), k], txt: [rd(k, 3), rd(k, 1), rd(2 * k, 1)] },
      '45-45': { ang: [45, 45], cat: [k, k], txt: [rd(k, 1), rd(k, 1), rd(k, 2)] },
      '37-53': { ang: [37, 53], cat: [4 * k, 3 * k], txt: [rd(4 * k, 1), rd(3 * k, 1), rd(5 * k, 1)] },
    }[tipo];
    const [cx, cy] = datos.cat, k2 = o.pasos || {};
    if (o.txt) datos.txt = o.txt;
    const ext = tipo === '45-45' ? [{ id: 'Q', x: cx, y: cy, sinPunto: true }] : tipo === '30-60' ? [{ id: 'Q', x: 0, y: -cy, rotulo: "C'", lado: -90, desde: k2.copia || 0 }] : [];
    return {
      alt: o.alt || `Triángulo rectángulo ${tipo.replace('-', '°-')}°: catetos ${datos.txt[0]} y ${datos.txt[1]}, hipotenusa ${datos.txt[2]}`,
      vista: tipo === '30-60' && o.copia ? { x: [-1.2, cx + 1.4], y: [-cy - 0.8, cy + 0.9] } : { x: [-1.2, Math.max(cx, cy) + 1.4], y: [-0.8, Math.max(cx, cy) + 0.9] },
      puntos: [{ id: 'A', x: cx, y: 0, rotulo: 'A', lado: -45 }, { id: 'B', x: 0, y: 0, rotulo: 'B', lado: -135 }, { id: 'C', x: 0, y: cy, rotulo: 'C', lado: 135 }, ...(o.copia ? ext : [])],
      regiones: [{ puntos: ['A', 'B', 'C'], color: 'i', opacidad: 0.08 },
        ...(o.copia && tipo === '45-45' ? [{ puntos: ['A', 'Q', 'C'], color: 'd', opacidad: 0.08, discontinua: true, desde: k2.copia || 0 }] : []),
        ...(o.copia && tipo === '30-60' ? [{ puntos: ['A', 'B', 'Q'], color: 'd', opacidad: 0.08, discontinua: true, desde: k2.copia || 0 }] : [])],
      segmentos: [{ de: 'B', a: 'A', color: 'o', texto: o.sin === 0 ? undefined : datos.txt[0] }, { de: 'B', a: 'C', color: 'i', texto: o.sin === 1 ? undefined : datos.txt[1] },
        { de: 'C', a: 'A', color: 'h', grosor: 'variable', texto: o.sin === 2 ? undefined : datos.txt[2] },
        ...(o.copia && tipo === '45-45' ? [{ de: 'C', a: 'Q', discontinua: true, desde: k2.copia || 0 }, { de: 'Q', a: 'A', discontinua: true, desde: k2.copia || 0 }] : []),
        ...(o.copia && tipo === '30-60' ? [{ de: 'A', a: 'Q', discontinua: true, desde: k2.copia || 0 }, { de: 'B', a: 'Q', discontinua: true, desde: k2.copia || 0 }] : [])],
      angulos: [{ en: 'B', de: 'A', a: 'C' }, { en: 'A', de: 'C', a: 'B', color: 'd', texto: `${datos.ang[0]}°` }, { en: 'C', de: 'B', a: 'A', color: 'd', texto: `${datos.ang[1]}°`, radio: 22 }],
    };
  };
  // Así se resuelve (idea 5): los lados de cada notable como múltiplos de k (los de «Ahora tú», sin el valor de k).
  const FORMA = { '30-60': ['k√3', 'k', '2k'], '45-45': ['k', 'k', 'k√2'], '37-53': ['4k', '3k', '5k'] };
  const LADO = [{ v: 'c-o', t: 'AB' }, { v: 'c-i', t: 'BC' }, { v: 'c-h', t: 'AC' }];
  const notables = {
    id: 'notables',
    titulo: 'Los rectángulos notables',
    temas: ['Triángulos rectángulos notables'],
    pieza: 'geo-figura',
    // Lee (fase 2): qué es un notable y la letra k, sin dar los lados del de 45° (eso es Predice).
    lee: {
      tarjetas: [
        { titulo: 'Las escuadras', texto: 'Las dos escuadras del juego de geometría tienen ángulos de 30°, 60° y 90°, y de 45°, 45° y 90°. Son triángulos rectángulos notables: sus lados guardan razones fijas.' },
        { titulo: 'La letra k', texto: 'En un notable, cada lado se escribe como un múltiplo de un mismo número k. Si el triángulo crece al doble, k también se duplica.' },
        { titulo: 'En una obra', texto: 'Un albañil de Juliaca saca una esquina recta con una cinta: marca 3 m en una pared, 4 m en la otra y comprueba que de punta a punta haya 5 m.' },
        { titulo: 'Qué mirar', texto: 'En el juego eliges los ángulos y cambias k. Mira qué múltiplo de k es cada lado y cuál de los tres es el más largo.' },
      ],
    },
    juega: {
      consigna: 'Elige un triángulo rectángulo notable y cambia su tamaño k. Mira qué múltiplo de k es cada lado.',
      voz: 'Cambia k. La razón entre los lados permanece.',
      controles: [
        { id: 'tipo', etiqueta: 'Ángulos', opciones: [{ valor: '30-60', texto: '30° y 60°' }, { valor: '37-53', texto: '37° y 53°' }] },
        { id: 'k', etiqueta: 'k', min: 1, max: 4, paso: 1, inicio: 2, unidad: '', decimales: 0, color: 'c-o' },
      ],
      dibujo: v => ({ datos: notable(v.tipo, v.k), estado: {} }),
      // Sin arrastre: el marco se ajusta a k (el triángulo llena la figura para todo k), así que un vértice no se mueve
      // en pantalla al cambiar k. Lo que cambia son los rótulos de los lados.
      lectura: v => (v.tipo === '30-60' ? ['lados: k, k√3 y 2k con k = ', `${v.k}`] : ['lados: 3k, 4k y 5k con k = ', `${v.k}`]),
      minimo: 4,
    },
    predice: {
      pregunta: 'Ahora un triángulo de 45° y 45° con hipotenusa 10. ¿Cuánto mide cada cateto?',
      voz: 'Es un tipo nuevo. Piensa qué figura lo contiene.',
      opciones: [
        { id: 'c', texto: '5√2', correcta: true },
        { id: 'mitad', texto: '5', error: 'GE-CON14', siFuera: 'La mitad de la hipotenusa es el cateto opuesto a 30°. Con 45° no es la mitad.' },
        { id: 'raiz3', texto: '5√3', error: 'GE-CON14', siFuera: '5√3 corresponde al triángulo de 30° y 60° con hipotenusa 10.' },
        { id: 'diez', texto: '10√2', error: 'GE-CON15', siFuera: '10√2 sería la hipotenusa si los catetos midieran 10. Aquí es al revés.' },
      ],
      dibujo: { datos: notable('45-45', 5 * Math.SQRT2, { txt: ['', '', '10'], alt: 'Triángulo de 45° y 45° con hipotenusa 10 y catetos por hallar' }), estado: {} },
      revelar: { datos: notable('45-45', 5 * Math.SQRT2, { txt: ['5√2', '5√2', '10'], alt: 'Triángulo de 45° y 45°: catetos 5√2 y hipotenusa 10' }), estado: {} },
      coincide: 'Coincide: hipotenusa = cateto · √2, así que cada cateto mide 10 ÷ √2 = 5√2.',
    },
    mira: {
      datos: notable('45-45', 4, { copia: true, txt: ['k', 'k', 'k√2'], pasos: { copia: 1 }, alt: 'El triángulo de 45° es medio cuadrado de lado k: su hipotenusa es la diagonal k√2' }),
      voz: 'Copia el triángulo: aparece un cuadrado.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Dos copias del triángulo de 45° forman un cuadrado de lado k.', ecuacion: ['cuadrado de lado k'] },
        { estado: { corte: 1 }, texto: 'La hipotenusa es la diagonal: por Pitágoras, k√2.', ecuacion: [{ v: 'c-h', t: 'h' }, ' = ', { raiz: [{ sup: ['k', '2'] }, ' + ', { sup: ['k', '2'] }] }, ' = k√2'] },
        { estado: { corte: 1 }, texto: 'Con hipotenusa 10: k = 10 ÷ √2 = 5√2.', ecuacion: ['k = ', { frac: ['10', '√2'] }, ' = 5√2'] },
      ],
    },
    regla: {
      texto: '30° y 60°: lados k, k√3 y 2k (medio equilátero). 45° y 45°: k, k y k√2 (medio cuadrado). 37° y 53°: 3k, 4k y 5k.',
      condicion: 'el triángulo es rectángulo. El de 37° y 53° es aproximado: tan 37° no es exactamente 3/4.',
      voz: 'Reconoce el notable por sus ángulos, no por su posición.',
    },
    // Así se resuelve (fase 2): el problema de «Ahora tú» (mismo notable, mismos lados L) con otra semilla.
    resuelve: {
      generar(s) {
        const r = azar(s + 900), tipo = ['30-60', '45-45', '37-53'][s % 3], k = r.ent(2, 6), cual = r.ent(0, 2);
        const L = {
          '30-60': [[k, 3], [k, 1], [2 * k, 1]],
          '45-45': [[k, 1], [k, 1], [k, 2]],
          '37-53': [[4 * k, 1], [3 * k, 1], [5 * k, 1]],
        }[tipo];
        const dado = (cual + 1) % 3, pide = cual, F = FORMA[tipo];
        const nombreLado = ['el cateto AB', 'el cateto BC', 'la hipotenusa AC'];
        const txt = ([a, m]) => rd(a, m), cuad = ([a, m]) => a * a * m;
        const al2 = l => (l[1] === 1 ? `${txt(l)}²` : `(${txt(l)})²`);
        const fig = todo => {
          const d = notable(tipo, k, todo ? {} : { sin: pide });
          if (!todo) d.segmentos.forEach((sg, i) => { if (i !== dado && i !== pide && i < 3) sg.texto = undefined; });
          return { datos: d, estado: {} };
        };
        const ang = tipo.replace('-', '° y ') + '°';
        return {
          enunciado: [`En el triángulo rectángulo de la figura, ${nombreLado[dado]} mide ${txt(L[dado])}. ¿Cuánto mide ${nombreLado[pide]}?`],
          dibujo: fig(false),
          pasos: [
            { tipo: 'pide', texto: ['Piden ', pide === 2 ? 'la hipotenusa ' : 'el cateto ', LADO[pide], '.'] },
            { tipo: 'datos', texto: [`Los ángulos agudos miden ${ang}, y `, LADO[dado], ` = ${txt(L[dado])}.`] },
            { tipo: 'regla', texto: `Por los ángulos reconozco el notable de ${ang}. Escribo sus tres lados con la misma k.`,
              ecuacion: [LADO[0], ` = ${F[0]}   ·   `, LADO[1], ` = ${F[1]}   ·   `, LADO[2], ` = ${F[2]}`] },
            { tipo: 'cuentas', texto: ['Igualo el lado dado a su forma con k y despejo k. Después armo ', LADO[pide], '.'],
              ecuacion: [`${F[dado] === 'k' ? '' : `${F[dado]} = ${txt(L[dado])}   →   `}k = ${k}   →   `, LADO[pide], ` = ${F[pide]} = ${txt(L[pide])}`], dibujo: fig(true) },
            { tipo: 'sentido', texto: 'Comprueba con Pitágoras: los cuadrados de los catetos suman el cuadrado de la hipotenusa.',
              ecuacion: [`${al2(L[0])} + ${al2(L[1])} = ${cuad(L[0])} + ${cuad(L[1])} = ${cuad(L[2])} = ${al2(L[2])}`] },
          ],
          respuesta: [LADO[pide], ` = ${txt(L[pide])}`],
        };
      },
    },
    ahoraTu: {
      voz: 'Identifica el notable y el lado que te dan.',
      generar(s) {
        const r = azar(s), tipo = ['30-60', '45-45', '37-53'][s % 3], k = r.ent(2, 6), cual = r.ent(0, 2);
        const L = {
          '30-60': [[k, 3], [k, 1], [2 * k, 1]],
          '45-45': [[k, 1], [k, 1], [k, 2]],
          '37-53': [[4 * k, 1], [3 * k, 1], [5 * k, 1]],
        }[tipo];
        const dado = (cual + 1) % 3, pide = cual;
        const nombreLado = ['el cateto AB', 'el cateto BC', 'la hipotenusa AC'];
        const d = notable(tipo, k, { sin: pide });
        d.segmentos.forEach((sg, i) => { if (i !== dado && i !== pide && i < 3) sg.texto = undefined; });
        if (tipo === '45-45') { /* los catetos iguales: si se pide uno, el otro también se oculta */ }
        const txt = ([a, m]) => rd(a, m);
        const malos = [];
        for (const [a, m] of [[k, 1], [k, 2], [k, 3], [2 * k, 1], [3 * k, 1], [4 * k, 1], [5 * k, 1]]) if (txt([a, m]) !== txt(L[pide])) malos.push(txt([a, m]));
        const elegidos = [...new Set(malos)].slice(0, 6).filter((_, i) => i % 2 === s % 2 || i < 1).slice(0, 3);
        return {
          pregunta: [`En el triángulo rectángulo de la figura, ${nombreLado[dado]} mide ${txt(L[dado])}. ¿Cuánto mide ${nombreLado[pide]}?`],
          dibujo: { datos: d, estado: {} },
          opciones: [{ id: 'c', texto: txt(L[pide]), correcta: true }].concat(elegidos.map((t, i) => ({ id: `d${i}`, texto: t, error: 'GE-CON14', siFuera: `${t} corresponde a otro lado o a otro notable. Ubica el lado frente a cada ángulo.` }))),
          solucion: { texto: `Es el notable de ${tipo.replace('-', '° y ')}°: escribe los tres lados con k = ${k}.`, ecuacion: [`${txt(L[0])}, ${txt(L[1])} y ${txt(L[2])}`] },
        };
      },
    },
  };

  // ---------- Laboratorio: juego libre, sin preguntas ----------
  // Mesa 1, más rica que la idea 1: el compás LLA con el ángulo A y el lado BC libres. La idea solo deja jugar LAL y
  // muestra LLA en un caso fijo; aquí se buscan los tres finales: ninguno, uno o dos triángulos.
  const VLLA = { x: [-3.6, 13], y: [-1, 9.6] };
  const llaLibre = (g, a) => {
    const c = Math.cos(U.rad(g)), disc = 49 * c * c - (49 - a * a);
    const ts = disc < -1e-9 ? [] : [7 * c - Math.sqrt(Math.max(disc, 0)), 7 * c + Math.sqrt(Math.max(disc, 0))].filter(t => t > 1e-6);
    const sol = [...new Set(ts.map(t => t.toFixed(6)))].map(Number);
    const L = Math.min(11, 9.4 / Math.sin(U.rad(g)), g > 90 ? 3.4 / Math.abs(c) : Infinity), R = U.polar([0, 0], L, g);
    const Cs = sol.map(t => U.polar([0, 0], t, g));
    return {
      alt: `AB = 7, ángulo A de ${g}° y BC = ${f(a)}: ${sol.length === 0 ? 'la circunferencia no alcanza el lado, no hay triángulo' : sol.length === 1 ? 'un solo triángulo' : 'dos triángulos distintos'}`,
      vista: VLLA,
      puntos: [{ id: 'A', x: 0, y: 0, rotulo: 'A', lado: -120 }, { id: 'B', x: 7, y: 0, rotulo: 'B', lado: -60 }, { id: 'R', x: R[0], y: R[1], sinPunto: true },
        ...Cs.map((C, i) => ({ id: `C${i}`, x: C[0], y: C[1], rotulo: Cs.length > 1 ? `C${'₁₂'[i]}` : 'C', color: 'h', lado: g + 90 }))],
      circulos: [{ centro: 'B', r: a, color: 'i', discontinua: true }],
      segmentos: [{ de: 'A', a: 'B', texto: '7', color: 'd', grosor: 'variable' }, { de: 'A', a: 'R', grosor: 'fino' },
        ...Cs.map((C, i) => ({ de: 'B', a: `C${i}`, color: 'i', grosor: 'variable' }))],
      regiones: Cs.map((C, i) => ({ puntos: ['A', 'B', `C${i}`], color: i ? 'h' : 'i', opacidad: 0.08 })),
      angulos: [{ en: 'A', de: 'B', a: 'R', color: 'o', texto: `${g}°` }],
    };
  };
  const cuantos = (g, a) => llaLibre(g, a).puntos.length - 3;
  const mesaLLA = {
    id: 'compas-lla', titulo: 'La circunferencia de LLA', pieza: 'geo-figura',
    consigna: 'Gira el lado de A y abre la circunferencia punteada de centro B. Busca cero, uno y dos triángulos con los mismos datos.',
    controles: [
      { id: 'g', etiqueta: '∠A', min: 20, max: 120, paso: 5, inicio: 40, unidad: '°', decimales: 0, color: 'c-o' },
      { id: 'a', etiqueta: 'BC', min: 2, max: 9, paso: 0.5, inicio: 5, unidad: '', decimales: 1, color: 'c-i' },
    ],
    dibujo: v => ({ datos: llaLibre(v.g, v.a), estado: {} }),
    arrastres: [
      // Se agarra el lado que sale de A (a 5 del vértice): gira y cambia ∠A.
      { id: 'lado-a', etiqueta: 'lado que sale de A', color: 'c-o',
        donde: v => enPantalla(llaLibre(v.g, v.a), U.polar([0, 0], 5, v.g)),
        mover: (pt, v) => { const q = alPlano(llaLibre(v.g, v.a), pt); return { g: U.grados(Math.atan2(Math.max(q[1], 0.01), q[0])) }; } },
      // Se agarra la circunferencia de centro B por su punto más alto: alejarlo de B la agranda.
      { id: 'compas', etiqueta: 'radio de la circunferencia', color: 'c-i',
        donde: v => enPantalla(llaLibre(v.g, v.a), [7, v.a]),
        mover: (pt, v) => { const q = alPlano(llaLibre(v.g, v.a), pt); return { a: Math.hypot(q[0] - 7, q[1]) }; } },
    ],
    lectura: v => {
      const n = cuantos(v.g, v.a);
      return [{ v: 'c-o', t: '∠A' }, ` ${v.g}°   ·   `, { v: 'c-i', t: 'BC' }, ` ${f(v.a)}   ·   ${['ningún triángulo', 'un triángulo', 'dos triángulos'][n]}`];
    },
    // Retos comprobados con cuantos(), que cuenta los cortes del compás que dibuja llaLibre().
    invitaciones: [
      { texto: 'Achica la circunferencia hasta que no alcance el lado: ningún triángulo.',
        logrado: v => cuantos(v.g, v.a) === 0,
        bien: 'BC no llega al lado de A: con esos datos no hay triángulo.' },
      { texto: 'Busca el caso en que la circunferencia apenas toca el lado: un solo triángulo.',
        logrado: v => cuantos(v.g, v.a) === 1 && v.a < 7,
        bien: 'Lo toca en un punto: ahí LLA da uno solo. ¿Y si lo abres un poco?' },
      { texto: 'Con ∠A = 40°, busca el BC más corto que ya da dos triángulos.',
        logrado: v => v.g === 40 && cuantos(v.g, v.a) === 2 && v.a === BC_DOS_40,
        bien: 'Apenas pasa la distancia de B al lado: la circunferencia corta dos veces.' },
      { texto: 'Haz obtuso el ángulo A y consigue un triángulo.',
        logrado: v => v.g > 90 && cuantos(v.g, v.a) === 1,
        bien: 'Con A obtuso la circunferencia corta una sola vez: ahí LLA sí fija el triángulo.' },
      { texto: 'Guarda dos casos con el mismo ∠A y distinto número de triángulos.',
        logrado: (v, gs) => gs.some(c => c.g === v.g && cuantos(c.g, c.a) !== cuantos(v.g, v.a)) && gs.some(c => c.g === v.g && c.a === v.a),
        bien: 'Mismo ángulo, otro BC, otro final: LLA no es criterio.' },
    ],
  };
  // El BC más corto de la grilla (de 2 a 9, de 0,5 en 0,5) que con ∠A = 40° da dos triángulos.
  const BC_DOS_40 = Array.from({ length: 15 }, (_, k) => 2 + k / 2).find(a => cuantos(40, a) === 2);
  // Mesa 2: C libre dentro y fuera del círculo. La idea 4 deja a C en el arco; la predicción lo mete adentro una vez.
  const semiLibre = (cx, cy) => Object.assign(semi(0, { C: [cx, cy], alt: `C en (${f(cx)}; ${f(cy)}): ángulo en C de ${f(U.angulo([cx, cy], [-5, 0], [5, 0]), 0)}° y mediana CM de ${f(Math.hypot(cx, cy))}` }), { vista: { x: [-5.8, 5.8], y: [-1.6, 7.6] } });
  // El ángulo en C y la mediana CM del triángulo que dibuja semiLibre (A en −5, B en 5 y M en el origen).
  const anguloC = v => U.angulo([v.cx, v.cy], [-5, 0], [5, 0]);
  const medianaCM = v => U.dist([v.cx, v.cy], U.medio([-5, 0], [5, 0]));
  let C_MAX = 0;   // el mayor ángulo en C de la grilla de la mesa
  for (let i = 0; i <= 18; i++) for (let j = 0; j <= 13; j++) C_MAX = Math.max(C_MAX, anguloC({ cx: -4.5 + i / 2, cy: 0.5 + j / 2 }));
  const mesaSemi = {
    id: 'c-libre', titulo: 'C dentro y fuera del círculo', pieza: 'geo-figura',
    consigna: 'Arrastra C a cualquier lugar. Compara el ángulo en C con la mediana CM: ¿cuándo vale 5?',
    controles: [
      { id: 'cx', etiqueta: 'C a lo ancho', min: -4.5, max: 4.5, paso: 0.5, inicio: 3, unidad: '', decimales: 1, color: 'c-o' },
      { id: 'cy', etiqueta: 'C a lo alto', min: 0.5, max: 7, paso: 0.5, inicio: 4, unidad: '', decimales: 1, color: 'c-o' },
    ],
    dibujo: v => ({ datos: semiLibre(v.cx, v.cy), estado: {} }),
    // Se agarra C: puede entrar o salir del círculo.
    arrastres: [{ id: 'vertice-c', etiqueta: 'vértice C', color: 'c-o',
      donde: v => enPantalla(semiLibre(v.cx, v.cy), [v.cx, v.cy]),
      mover: (pt, v) => { const q = alPlano(semiLibre(v.cx, v.cy), pt); return { cx: q[0], cy: q[1] }; } }],
    lectura: v => [{ v: 'c-o', t: '∠C' }, ` ${f(anguloC(v), 0)}°   ·   `, { v: 'c-h', t: 'CM' }, ` ${f(medianaCM(v))}   ·   AB/2 = 5`],
    invitaciones: [
      { texto: 'Busca otro lugar de C donde la mediana CM mida justo 5.',
        logrado: v => Math.abs(medianaCM(v) - 5) < 1e-9 && !(v.cx === 3 && v.cy === 4),
        bien: 'CM = 5 y el ángulo en C vuelve a 90°: van siempre juntos.' },
      { texto: 'Saca C del círculo hasta que el ángulo en C quede agudo.',
        logrado: v => anguloC(v) < 90 - 1e-9,
        bien: 'Afuera: ángulo agudo y CM mayor que 5. El círculo separa los casos.' },
      { texto: 'Haz el ángulo en C lo más abierto que permite la mesa.',
        logrado: v => Math.abs(anguloC(v) - C_MAX) < 1e-9,
        bien: 'Pegado a AB, el ángulo casi llega a 180° y CM se encoge.' },
      { texto: 'Guarda un caso dentro del círculo y otro fuera. Compara sus CM.',
        logrado: (v, gs) => gs.some(c => medianaCM(c) < 5 - 1e-9) && gs.some(c => medianaCM(c) > 5 + 1e-9) && gs.some(c => c.cx === v.cx && c.cy === v.cy),
        bien: 'Adentro, CM menor que 5; afuera, mayor. Solo en el borde es la mitad.' },
    ],
  };
  // Mesa 3: la base media con la base BC que también cambia (la idea la deja fija en 8) y A en un rango más amplio.
  const baseLibre = (ax, ay, cx) => {
    const A = [ax, ay], M = U.medio(A, [0, 0]), N = U.medio(A, [cx, 0]);
    return {
      alt: `M y N, puntos medios de AB y AC: MN mide ${f(cx / 2)}, la mitad de BC = ${f(cx)}`,
      vista: { x: [-3.4, 12.4], y: [-0.8, 6.4] },
      puntos: [{ id: 'A', x: ax, y: ay, rotulo: 'A', lado: 90 }, { id: 'B', x: 0, y: 0, rotulo: 'B', lado: -120 }, { id: 'C', x: cx, y: 0, rotulo: 'C', lado: -60 },
        { id: 'M', x: M[0], y: M[1], rotulo: 'M', lado: 160 }, { id: 'N', x: N[0], y: N[1], rotulo: 'N', lado: 20 }],
      regiones: [{ puntos: ['A', 'B', 'C'], color: 'i', opacidad: 0.06 }],
      segmentos: [{ de: 'A', a: 'M', marcas: 1 }, { de: 'M', a: 'B', marcas: 1 }, { de: 'A', a: 'N', marcas: 2 }, { de: 'N', a: 'C', marcas: 2 },
        { de: 'B', a: 'C', color: 'd', grosor: 'variable', texto: f(cx), paralela: 1 }, { de: 'M', a: 'N', color: 'o', grosor: 'variable', texto: f(cx / 2), paralela: 1 }],
    };
  };
  // La base media MN, medida entre los puntos medios M y N que dibuja baseLibre().
  const baseMN = v => { const P = baseLibre(v.ax, v.ay, v.cx).puntos, M = P.find(p => p.id === 'M'), N = P.find(p => p.id === 'N'); return U.dist([M.x, M.y], [N.x, N.y]); };
  const mesaBase = {
    id: 'base-libre', titulo: 'Base media con base libre', pieza: 'geo-figura',
    consigna: 'Arrastra A y también C. Estira la base y deforma el triángulo: mira qué fracción de BC es MN.',
    controles: [
      { id: 'ax', etiqueta: 'A a lo ancho', min: -3, max: 12, paso: 0.5, inicio: 3, unidad: '', decimales: 1, color: 'c-o' },
      { id: 'ay', etiqueta: 'A a lo alto', min: 1, max: 6, paso: 0.5, inicio: 4, unidad: '', decimales: 1, color: 'c-o' },
      { id: 'cx', etiqueta: 'BC', min: 2, max: 12, paso: 1, inicio: 8, unidad: '', decimales: 0, color: 'c-d' },
    ],
    dibujo: v => ({ datos: baseLibre(v.ax, v.ay, v.cx), estado: {} }),
    arrastres: [
      { id: 'vertice-a', etiqueta: 'vértice A', color: 'c-o',
        donde: v => enPantalla(baseLibre(v.ax, v.ay, v.cx), [v.ax, v.ay]),
        mover: (pt, v) => { const q = alPlano(baseLibre(v.ax, v.ay, v.cx), pt); return { ax: q[0], ay: q[1] }; } },
      { id: 'vertice-c', etiqueta: 'vértice C', color: 'c-d',
        donde: v => enPantalla(baseLibre(v.ax, v.ay, v.cx), [v.cx, 0]),
        mover: (pt, v) => ({ cx: alPlano(baseLibre(v.ax, v.ay, v.cx), pt)[0] }) },
    ],
    lectura: v => [{ v: 'c-o', t: 'MN' }, ` = ${f(v.cx / 2)}   ·   `, { v: 'c-d', t: 'BC' }, ` = ${f(v.cx)}   ·   paralelas`],
    // Retos comprobados con MN medida entre los puntos medios que dibuja baseLibre(), no con BC/2.
    invitaciones: [
      { texto: 'Haz que la base media MN mida justo 3.',
        logrado: v => Math.abs(baseMN(v) - 3) < 1e-9,
        bien: 'MN = 3 pide BC = 6, quede donde quede A.' },
      { texto: 'Busca la base media más larga que permite la mesa.',
        logrado: v => Math.abs(baseMN(v) - baseMN({ ax: 0, ay: 1, cx: mesaBase.controles[2].max })) < 1e-9,
        bien: 'La más larga sale con la base más larga. A no ayuda.' },
      { texto: 'Lleva A más allá de C, hasta que el triángulo quede obtuso en C.',
        logrado: v => v.ax > v.cx,
        bien: 'Obtuso y todo, MN sigue midiendo la mitad de BC.' },
      { texto: 'Guarda dos casos con la misma BC y A muy lejos. Compara MN.',
        logrado: (v, gs) => gs.some(c => c.cx === v.cx && Math.abs(c.ax - v.ax) >= 4) && gs.some(c => c.ax === v.ax && c.ay === v.ay && c.cx === v.cx),
        bien: 'Misma BC, misma MN: la posición de A no entra en la cuenta.' },
    ],
  };

  return {
    unidad: 'geometria.congruencia',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/geo-figura.js'],
    historia: {
      texto: 'La proposición I.4 de los Elementos justifica el criterio lado, ángulo, lado superponiendo un triángulo sobre otro. Los comentarios modernos señalan que el texto no había declarado axiomas para ese movimiento. La pregunta sigue viva: qué datos garantizan una única forma y por qué el movimiento conserva lo necesario.',
      pregunta: '¿Qué datos bastan para que no haya dos triángulos distintos?',
      fuente: { titulo: 'Euclides, Elementos I.4 (edición de D. E. Joyce)', url: 'https://math.clarku.edu/~djoyce/java/elements/bookI/propI4.html' },
    },
    // Laboratorio: las tres mesas son más ricas que sus ideas: LLA con el ángulo y el compás libres, C fuera del arco y
    // la base media con la base que se estira.
    // Glosario: las palabras que la unidad estrena (docs/teoria.md, 4d). Hipotenusa y cateto ya salen en «Segmentos y
    // ángulos», pero se definen aquí, donde son el tema; circunferencia, radio y diámetro se estrenan aquí en el curso.
    glosario: [
      { termino: 'razón', def: 'Cociente entre dos medidas: dice cuántas veces cabe una en la otra.', ejemplo: 'Lados de 6 y 3: la razón es 6 : 3 = 2.' },
      { termino: 'congruente', simbolo: '≅', formas: ['congruentes', 'congruente', 'congruencia'],
        def: 'Igual en forma y en tamaño: una figura calza exacto sobre la otra.', ver: ['criterio'] },
      { termino: 'criterio', formas: ['criterio', 'criterios'],
        def: 'Grupo mínimo de datos iguales que asegura que dos triángulos son iguales en forma y tamaño.', ver: ['LAL', 'ALA', 'LLL', 'LLA'] },
      { termino: 'LAL', def: 'Lado, ángulo, lado: dos lados iguales y el ángulo que queda entre ellos.', ver: ['criterio'] },
      { termino: 'ALA', def: 'Ángulo, lado, ángulo: dos ángulos iguales y el lado que queda entre ellos.', ver: ['criterio'] },
      { termino: 'LLL', def: 'Lado, lado, lado: los tres lados iguales, uno a uno.', ver: ['criterio'] },
      { termino: 'LLA', def: 'Dos lados y un ángulo que no queda entre ellos. No basta: puede haber dos triángulos.', ver: ['criterio'] },
      { termino: 'distancia', formas: ['distancia', 'distancias'],
        def: 'Largo del camino más corto. De un punto a una recta, se mide por la perpendicular.', ver: ['perpendicular'] },
      { termino: 'equidistar', formas: ['equidistar', 'equidista', 'equidistan', 'equidistantes'],
        def: 'Estar a la misma distancia de dos puntos o de dos líneas.', ver: ['mediatriz', 'bisectriz'] },
      { termino: 'base media', formas: ['base media', 'bases medias'],
        def: 'Segmento que une los puntos medios de dos lados de un triángulo. Mide la mitad del tercero.',
        ejemplo: `Si el tercer lado mide 8, la base media mide ${8 / 2}.`, ver: ['punto medio'] },
      { termino: 'hipotenusa', def: 'En un triángulo rectángulo, el lado opuesto al ángulo de 90°. Es el más largo.',
        ejemplo: `Con catetos 3 y 4, mide ${Math.hypot(3, 4)}.`, ver: ['cateto', 'Pitágoras'] },
      { termino: 'cateto', formas: ['cateto', 'catetos'], def: 'Cada uno de los dos lados que forman el ángulo de 90° en un triángulo rectángulo.',
        ver: ['hipotenusa'] },
      { termino: 'Pitágoras', formas: ['teorema de Pitágoras', 'Pitágoras'],
        def: 'En un triángulo rectángulo, la suma de los cuadrados de los catetos es el cuadrado de la hipotenusa.',
        ejemplo: `3² + 4² = ${3 * 3 + 4 * 4} = 5²`, ver: ['hipotenusa', 'cateto'] },
      { termino: 'triángulo rectángulo notable', formas: ['triángulo rectángulo notable', 'triángulos rectángulos notables', 'rectángulos notables', 'rectángulo notable'],
        def: 'Rectángulo de ángulos agudos 30° y 60°, 45° y 45°, o 37° y 53°: sus lados guardan razones fijas.',
        ejemplo: `El de 45° con catetos 1 tiene hipotenusa √2 ≈ ${f(Math.SQRT2, 2)}.`, ver: ['semejanza'] },
      { termino: 'circunferencia', formas: ['circunferencia', 'circunferencias'],
        def: 'Línea curva cerrada cuyos puntos están todos a la misma distancia de un punto fijo, su centro.', ver: ['radio', 'diámetro', 'círculo'] },
      { termino: 'círculo', formas: ['círculo', 'círculos'], def: 'La región plana que encierra una circunferencia, con todo su interior.', ver: ['circunferencia'] },
      { termino: 'radio', formas: ['radio', 'radios'], def: 'Segmento del centro a un punto de la circunferencia; también, su medida.', ver: ['diámetro'] },
      { termino: 'diámetro', formas: ['diámetro', 'diámetros'],
        def: 'Segmento que pasa por el centro y une dos puntos de la circunferencia. Mide dos radios.', ver: ['radio'] },
      { termino: 'semicircunferencia', def: 'Mitad de una circunferencia, de un extremo de un diámetro al otro.', ver: ['diámetro'] },
      { termino: 'paralelogramo', def: 'Cuadrilátero con sus lados opuestos paralelos de dos en dos.', ver: ['cuadrilátero'] },
      { termino: 'diagonal', formas: ['diagonal', 'diagonales'], def: 'Segmento que une dos vértices no vecinos de una figura.' },
      { termino: 'axioma', formas: ['axioma', 'axiomas'], def: 'Afirmación que se acepta sin probarla y sirve de punto de partida para probar lo demás.' },
    ],
    laboratorio: [mesaLLA, mesaSemi, mesaBase],
    ideas: [criterios, lugares, baseMedia, medianaHip, notables],
  };
});
