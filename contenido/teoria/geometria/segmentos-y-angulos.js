/*
 * Teoría de «Segmentos y ángulos» (geometria.segmentos-y-angulos). Molde: docs/teoria.md.
 * Fuente: docs/teoria/matriz/geometria.json (unidad 1), expediente teoria-152-unidades (precisiones de Geometría).
 * Compañera: Neri (nutria). Pieza: geo-figura.
 *
 * Ficha de tarea
 *   Promesa: distinguir lo que el dibujo sugiere de lo que la condición garantiza, en segmentos y ángulos.
 *   Persona y condiciones: postulante de 3.º de secundaria, celular de gama baja a 360 px, sin audio, quizás sin conexión.
 *   Resultado observable: resuelve sumas de segmentos, clasifica ángulos, usa complemento, suplemento y bisectriz, y
 *     encuentra ángulos entre paralelas, justificando cada igualdad con su condición.
 *   Orden de atención: 1.º la figura y su lectura en vivo · 2.º la pregunta · acción: «Comprobar» · fondo: Neri.
 *   Estados: jugando (casos probados) · predicción sin elegir · comprobada · paso de «Mira» · regla · caso nuevo.
 *   Duda que resuelve: «¿por qué es igual?» se contesta con una condición (entre, paralelas, adyacentes), no con el aspecto.
 *
 * Colores (regla 4; la app tiene cuatro tokens): en cada idea, o naranja = la medida que el alumno mueve,
 * i turquesa = la que la acompaña, d verde = la de referencia, h rojo = lo que se pide. BC es turquesa en toda la unidad.
 * Códigos de error: GE17 (docs/investigacion/geometria-ideas-erroneas.md); los GE-SEG, GE-ANG, GE-CS, GE-BIS y GE-QB
 * son nuevos e hipótesis (ver rutinas/teoria-geometria.md).
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
  const AB = { v: 'c-o', t: 'AB' }, BC = { v: 'c-i', t: 'BC' }, AC = { v: 'c-d', t: 'AC' };
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
  const giro360 = (c, q) => { const g = U.grados(Math.atan2(q[1] - c[1], q[0] - c[0])); return g < -1e-9 ? g + 360 : g; };
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

  // ---------- Idea 1: AB + BC = AC solo si B está entre A y C ----------
  // Cambia: la posición de B · Permanece: A, C y AC = 10 cm · Progresa: la diferencia entre AB + BC y AC ·
  // Se reserva: B fuera de la recta (solo en la predicción) · Debe verse: la suma exacta exige «B entre A y C».
  const tramos = (bx, by = 0) => ({
    alt: `A y C a 10 cm; B en (${f(bx)}; ${f(by)}). AB más BC ${Math.abs(by) < 1e-9 && bx >= 0 && bx <= 10 ? 'es igual a' : 'es mayor que'} AC`,
    vista: { x: [-3, 13], y: [-1.4, 3.6] },
    puntos: [
      { id: 'A', x: 0, y: 0, rotulo: 'A', lado: -90 }, { id: 'C', x: 10, y: 0, rotulo: 'C', lado: -90 },
      { id: 'B', x: bx, y: by, rotulo: 'B', color: 'o', lado: by > 0 ? 90 : -90 },
      ...(by ? [] : [{ id: 'a1', x: 0, y: 0.9, sinPunto: true }, { id: 'b1', x: bx, y: 0.9, sinPunto: true },
        { id: 'b2', x: bx, y: 1.9, sinPunto: true }, { id: 'c2', x: 10, y: 1.9, sinPunto: true }]),
      { id: 'a3', x: 0, y: -0.9, sinPunto: true }, { id: 'c3', x: 10, y: -0.9, sinPunto: true },
    ],
    segmentos: [
      { de: 'A', a: 'C', recta: true, grosor: 'fino' },
      ...(by ? [{ de: 'A', a: 'B', color: 'o', grosor: 'variable' }, { de: 'B', a: 'C', color: 'i', grosor: 'variable' }]
        : [{ de: 'a1', a: 'b1', color: 'o', grosor: 'variable', texto: `${f(Math.abs(bx))} cm` },
          { de: 'b2', a: 'c2', color: 'i', grosor: 'variable', texto: `${f(Math.abs(10 - bx))} cm` }]),
      { de: 'a3', a: 'c3', color: 'd', texto: 'AC = 10 cm' },
    ],
  });
  const BX = 4, BY = 3, dAB = Math.hypot(BX, BY), dBC = Math.hypot(10 - BX, BY);
  const fuera = {
    id: 'suma-de-segmentos',
    titulo: 'La suma exacta exige «entre»',
    temas: ['Punto, recta y plano', 'Segmentos y su medida'],
    pieza: 'geo-figura',
    // Lee (fase 2): vocabulario de segmento y «entre». No dice qué pasa con B fuera de la recta (eso es «Predice»).
    lee: {
      tarjetas: [
        { titulo: 'Un trozo de recta', texto: 'Imagina la carretera de Juliaca a Puno como si fuera una recta. Un tramo de recta entre dos puntos se llama segmento. El segmento se nombra con esos dos puntos: AB.' },
        { titulo: 'Qué quiere decir «entre»', texto: 'Si viajas de Juliaca a Puno, pasas por Caracoto: queda entre las dos ciudades. En geometría, B está entre A y C cuando está en la recta AC y en el tramo que va de A a C.' },
        { titulo: 'Qué mirar', texto: ['Al jugar, mueve B y compara dos números: la suma ', AB, ' + ', BC, ' y la medida ', AC, '. Lleva B también más allá de C y antes de A.'] },
      ],
    },
    juega: {
      consigna: 'Mueve el punto B por la recta, también fuera del tramo entre A y C. Compara la suma AB + BC con AC.',
      voz: 'Mueve B y compara las tres medidas, no solo el dibujo.',
      controles: [{ id: 'bx', etiqueta: 'B', min: -2, max: 12, paso: 1, inicio: 4, unidad: 'cm', decimales: 0, color: 'c-o' }],
      dibujo: v => ({ datos: tramos(v.bx), estado: {} }),
      // Se agarra el punto B: corre por la recta, también fuera del tramo AC.
      arrastres: [{ id: 'punto-b', etiqueta: 'punto B', color: 'c-o',
        donde: v => enPantalla(tramos(v.bx), [v.bx, 0]),
        mover: (pt, v) => ({ bx: alPlano(tramos(v.bx), pt)[0] }) }],
      lectura: v => [AB, ' + ', BC, ` = ${f(Math.abs(v.bx) + Math.abs(10 - v.bx))} cm   ·   `, AC, ' = 10 cm'],
      minimo: 3,
    },
    predice: {
      pregunta: ['Ahora B sale de la recta: queda 3 cm arriba del punto que está a 4 cm de A. ¿Cuánto mide ', AB, ' + ', BC, '?'],
      voz: 'Piensa en el camino de A a C pasando por B.',
      opciones: [
        { id: 'c', texto: `${f(dAB + dBC)} cm`, correcta: true },
        { id: 'igual', texto: '10 cm', error: 'GE-SEG1', siFuera: '10 cm sería cierto con B en la recta, entre A y C. Fuera de ella, el camino crece.' },
        { id: 'altura', texto: '13 cm', error: 'GE-SEG2', siFuera: 'Sumar la altura a AC parece razonable, pero cada tramo se mide inclinado, por separado.' },
        { id: 'nose', texto: 'No se puede saber', error: 'GE-SEG3', siFuera: 'Faltaría un dato si no supiéramos la altura. Con 4, 6 y 3 cm, cada tramo es una hipotenusa.' },
      ],
      dibujo: { datos: tramos(BX, BY), estado: {} },
      revelar: { datos: Object.assign(tramos(BX, BY), { segmentos: tramos(BX, BY).segmentos.map(s => s.de === 'A' && s.a === 'B' ? Object.assign({}, s, { texto: `${f(dAB)} cm` }) : s.de === 'B' ? Object.assign({}, s, { texto: `${f(dBC)} cm` }) : s) }), estado: {} },
      coincide: ['Coincide: 5 + 6,7 ≈ 11,7 cm. El rodeo por B es más largo que ', AC, '.'],
    },
    // Hallazgo 9: «Mira» no parte del dibujo del juego (B en la recta) sino del de la predicción (B fuera), a propósito:
    // explica el caso que el alumno acaba de predecir; el juego ya mostró la suma exacta con B entre A y C.
    mira: {
      datos: {
        alt: 'B está 3 cm arriba de la recta AC: AB mide 5, BC mide 6,7 y la suma pasa de 10',
        vista: { x: [-1, 11], y: [-1.4, 3.8] },
        puntos: [{ id: 'A', x: 0, y: 0, rotulo: 'A', lado: -90 }, { id: 'C', x: 10, y: 0, rotulo: 'C', lado: -90 }, { id: 'B', x: BX, y: BY, rotulo: 'B', color: 'o', lado: 90 },
          { id: 'H', x: BX, y: 0, rotulo: 'H', lado: -90, desde: 1 }, { id: 'B0', x: BX, y: 0, sinPunto: true }],
        segmentos: [
          { de: 'A', a: 'C', color: 'd', texto: 'AC = 10', lado: -1, desde: 3 },
          { de: 'B', a: 'H', discontinua: true, grosor: 'fino', texto: '3', lado: 1, desde: 1 },
          { de: 'A', a: 'B', color: 'o', grosor: 'variable', texto: 'AB = 5', desde: 1 },
          { de: 'B', a: 'C', color: 'i', grosor: 'variable', texto: `BC ≈ ${f(dBC)}`, desde: 2 },
        ],
        angulos: [{ en: 'H', de: 'C', a: 'B', desde: 1 }],
      },
      voz: 'Avanza paso a paso. Cada tramo tiene su propio triángulo.',
      pasos: [
        { estado: { corte: 1 }, texto: 'AB es la hipotenusa de un triángulo de catetos 4 y 3.', ecuacion: [AB, ' = ', { raiz: [{ sup: ['4', '2'] }, ' + ', { sup: ['3', '2'] }] }, ' = 5 cm'] },
        { estado: { corte: 2 }, texto: 'BC es la hipotenusa de un triángulo de catetos 6 y 3.', ecuacion: [BC, ' = ', { raiz: [{ sup: ['6', '2'] }, ' + ', { sup: ['3', '2'] }] }, ` ≈ ${f(dBC)} cm`] },
        { estado: { corte: 3 }, texto: 'El camino por B da un rodeo: la suma pasa de AC.', ecuacion: [AB, ' + ', BC, ` ≈ ${f(dAB + dBC)} > 10 = `, AC] },
        { estado: { corte: 3 }, texto: 'Solo con B sobre AC, entre A y C, desaparece el rodeo.', ecuacion: [AB, ' + ', BC, ' = ', AC] },
      ],
    },
    regla: {
      texto: 'Por dos puntos pasa una sola recta. Si B está en el segmento AC, las medidas se suman exacto; si no, AB + BC es mayor que AC.',
      ecuacion: [{ llave: [AB, ' + ', BC], nota: 'camino por B', color: 'c-o' }, ' ≥ ', { llave: [AC], nota: 'directo', color: 'c-d' }],
      condicion: 'B está en la recta AC, entre A y C.',
      voz: 'El dibujo sugiere; la condición «entre A y C» lo garantiza.',
    },
    // Así se resuelve (fase 2): el problema de «Ahora tú» con la semilla s + 900. Las mismas cuentas y la misma figura
    // (fuera.ahoraTu.generar(s + 900) sortea a, b y c en el mismo orden).
    resuelve: {
      generar(s) {
        const r = azar(s + 900), a = r.ent(2, 8), b = r.ent(2, 8), c = r.ent(2, 8);
        const p = a + b, q = b + c, t = a + b + c, BD = { v: 'c-o', t: 'BD' };
        const at = fuera.ahoraTu.generar(s + 900);
        return {
          enunciado: ['A, B, C y D están en ese orden sobre una recta. ', AC, ` = ${p} cm, `, BD, ` = ${q} cm y AD = ${t} cm. ¿Cuánto mide `, BC, '?'],
          dibujo: at.dibujo,
          pasos: [
            { tipo: 'pide', texto: ['Piden ', BC, ', el tramo del medio, entre B y C.'] },
            { tipo: 'datos', texto: ['Tengo tres medidas. ', AC, ' y ', BD, ' se enciman en el medio; AD va de punta a punta.'],
              ecuacion: [AC, ` = ${p}   ·   `, BD, ` = ${q}   ·   AD = ${t}`] },
            { tipo: 'regla', texto: ['Como los puntos están en orden, cada medida larga es la suma de sus tramos. ', AC, ' y ', BD, ' juntos cubren AD y repiten ', BC, '.'],
              ecuacion: [AC, ' + ', BD, ' = AD + ', BC] },
            { tipo: 'cuentas', texto: ['Sumo ', AC, ' y ', BD, ', y le quito AD: lo que sobra es el tramo contado dos veces.'],
              ecuacion: [BC, ` = ${p} + ${q} − ${t} = ${b} cm`], dibujo: at.solucion.dibujo },
            { tipo: 'sentido', texto: [`Compruebo: AB = ${p} − ${b} = ${a} y CD = ${q} − ${b} = ${c}. Los tres tramos suman ${a} + ${b} + ${c} = ${t}, que es AD.`] },
          ],
          respuesta: [BC, ` = ${b} cm`],
        };
      },
    },
    ahoraTu: {
      voz: 'Ubica cada medida en la recta antes de operar.',
      generar(s) {
        const r = azar(s), a = r.ent(2, 8), b = r.ent(2, 8), c = r.ent(2, 8);
        const p = a + b, q = b + c, t = a + b + c;
        const BD = { v: 'c-o', t: 'BD' };
        const fig = sol => ({
          datos: {
            alt: `A, B, C y D en una recta: AC = ${p}, BD = ${q}, AD = ${t}${sol ? `; BC = ${b}` : ''}`,
            vista: { x: [-1, t + 1], y: [-2, 3] },
            puntos: [['A', 0], ['B', a], ['C', a + b], ['D', t]].map(([id, x]) => ({ id, x, y: 0, rotulo: id, lado: -90 }))
              .concat([['p0', 0, 1], ['p1', a + b, 1], ['q0', a, 2], ['q1', t, 2], ['r0', 0, -1.1], ['r1', t, -1.1]].map(([id, x, y]) => ({ id, x, y, sinPunto: true }))),
            segmentos: [
              { de: 'A', a: 'D', grosor: 'fino' },
              { de: 'p0', a: 'p1', color: 'd', texto: `AC = ${p}` },
              { de: 'q0', a: 'q1', color: 'o', texto: `BD = ${q}` },
              { de: 'r0', a: 'r1', texto: `AD = ${t}` },
              ...(sol ? [{ de: 'B', a: 'C', color: 'i', grosor: 'variable' }] : []),
            ],
          },
          estado: {},
        });
        return {
          pregunta: ['A, B, C y D están en ese orden sobre una recta. ', AC, ` = ${p}, `, BD, ` = ${q} y AD = ${t}. ¿Cuánto mide `, BC, '?'],
          dibujo: fig(false),
          opciones: opciones(b, [
            { id: 'doble', valor: p + q, error: 'GE-SEG4', siFuera: 'Sumar AC y BD tiene sentido, pero BC queda contado dos veces.' },
            { id: 'cd', valor: t - p, error: 'GE-SEG5', siFuera: 'AD − AC sí es una resta válida: da CD, no BC.' },
            { id: 'ab', valor: t - q, error: 'GE-SEG5', siFuera: 'AD − BD sí es una resta válida: da AB, no BC.' },
            { id: 'mitad', valor: (p + q) / 2, error: 'GE-SEG4', siFuera: 'El promedio sería BC solo si AB, BC y CD midieran igual.' },
          ], n => `${f(n)} cm`),
          solucion: { texto: 'AC y BD juntos cubren AD y repiten BC una vez.', ecuacion: [AC, ' + ', { v: 'c-o', t: 'BD' }, ' − AD = ', `${p} + ${q} − ${t} = ${b} cm`], dibujo: fig(true) },
        };
      },
    },
  };

  // ---------- Idea 2: el ángulo mide la abertura, no el largo de sus lados ----------
  // Cambia: la abertura del ángulo · Permanece: el largo de los lados y el vértice · Progresa: la clase (agudo → llano → no convexo) ·
  // Se reserva: dos ángulos con lados de largos distintos · Debe verse: al alargar un lado, los grados no cambian.
  const CLASES = [[0, 0, 'nulo'], [0, 90, 'agudo'], [90, 90, 'recto'], [90, 180, 'obtuso'], [180, 180, 'llano'], [180, 360, 'no convexo']];
  const clase = g => (g === 0 ? 'nulo' : g < 90 ? 'agudo' : g === 90 ? 'recto' : g < 180 ? 'obtuso' : g === 180 ? 'llano' : 'no convexo');
  const abertura = g => ({
    alt: `Ángulo AOB de ${g}°: ${clase(g)}`,
    vista: { x: [-3.6, 3.6], y: [-3.4, 3.6] },
    puntos: [{ id: 'O', x: 0, y: 0, rotulo: 'O', lado: g > 180 ? g / 2 + 180 : g > 0 && g < 180 ? -120 : 135 }, { id: 'A', x: 3, y: 0, rotulo: 'A', lado: -90 },
      { id: 'B', x: 3 * Math.cos(U.rad(g)), y: 3 * Math.sin(U.rad(g)), rotulo: 'B', color: 'o', lado: g + 20 }],
    segmentos: [{ de: 'O', a: 'A' }, { de: 'O', a: 'B', color: 'o', grosor: 'variable' }],
    angulos: g > 0 ? [{ en: 'O', de: 'A', a: 'B', texto: `${g}°`, color: 'o', mayor: g > 180 }] : [],
  });
  const P1 = 40, Q1 = 65;
  const dosAngulos = (medidas, prolongar) => ({
    alt: medidas ? 'El ángulo P, de lados largos, mide 40°; el Q, de lados cortos, mide 65°' : 'Dos ángulos: P con lados largos y Q con lados cortos',
    vista: { x: [-0.6, 10.4], y: [-0.8, 4.4] },
    puntos: [
      { id: 'P', x: 0, y: 0, rotulo: 'P', lado: -120 }, { id: 'P1', x: 6, y: 0, sinPunto: true }, { id: 'P2', x: 6 * Math.cos(U.rad(P1)), y: 6 * Math.sin(U.rad(P1)), sinPunto: true },
      { id: 'Q', x: 7.6, y: 0, rotulo: 'Q', lado: -120 }, { id: 'Q1', x: 9.1, y: 0, sinPunto: true }, { id: 'Q2', x: 7.6 + 1.5 * Math.cos(U.rad(Q1)), y: 1.5 * Math.sin(U.rad(Q1)), sinPunto: true },
      { id: 'Q3', x: 10.2, y: 0, sinPunto: true }, { id: 'Q4', x: 7.6 + 4.2 * Math.cos(U.rad(Q1)), y: 4.2 * Math.sin(U.rad(Q1)), sinPunto: true },
    ],
    segmentos: [{ de: 'P', a: 'P1' }, { de: 'P', a: 'P2', color: 'i' }, { de: 'Q', a: 'Q1' }, { de: 'Q', a: 'Q2', color: 'o' },
      ...(prolongar ? [{ de: 'Q1', a: 'Q3', discontinua: true }, { de: 'Q2', a: 'Q4', color: 'o', discontinua: true, desde: prolongar }] : [])],
    angulos: medidas ? [{ en: 'P', de: 'P1', a: 'P2', texto: `${P1}°`, color: 'i', radio: 34, desde: medidas }, { en: 'Q', de: 'Q1', a: 'Q2', texto: `${Q1}°`, color: 'o', radio: 22, desde: medidas }] : [],
  });
  const aberturaIdea = {
    id: 'abertura',
    titulo: 'El ángulo mide la abertura',
    temas: ['Clases de ángulos'],
    pieza: 'geo-figura',
    // Lee (fase 2): partes del ángulo, grados y nombres. No dice si el largo de los lados cuenta (eso es «Predice»).
    lee: {
      tarjetas: [
        { titulo: 'Dos rayos y un vértice', texto: 'Un ángulo se forma con dos rayos que salen del mismo punto, el vértice. En ∠AOB, la letra del medio, O, es el vértice; OA y OB son sus lados.' },
        { titulo: 'Se mide en grados', texto: 'Una vuelta completa son 360°. Si giras en tu sitio hasta mirar al lado contrario, das media vuelta: 180°. En Juliaca, doblar en la esquina de dos calles que se cruzan derechas es un cuarto de vuelta: 90°.' },
        { titulo: 'Cada medida, un nombre', texto: 'Según cuántos grados mide, un ángulo es agudo, recto, obtuso, llano o no convexo. Al jugar, gira OB y fíjate en qué medida cambia el nombre.' },
      ],
    },
    juega: {
      consigna: 'Gira el lado OB. Mira cómo cambian la medida y el nombre del ángulo AOB, incluso cuando pasa de 180°.',
      voz: 'Gira OB y fíjate en el nombre que toma cada medida.',
      controles: [{ id: 'g', etiqueta: '∠AOB', min: 0, max: 330, paso: 15, inicio: 45, unidad: '°', decimales: 0, color: 'c-o' }],
      dibujo: v => ({ datos: abertura(v.g), estado: {} }),
      // Se agarra la punta B del lado OB: gira alrededor de O (de 0° a 330°, contra el reloj desde OA).
      arrastres: [{ id: 'punta-b', etiqueta: 'punta B del lado OB', color: 'c-o',
        donde: v => enPantalla(abertura(v.g), U.polar([0, 0], 3, v.g)),
        mover: (pt, v) => { const g = giro360([0, 0], alPlano(abertura(v.g), pt)); return { g: g > 345 ? 0 : g }; } }],
      lectura: v => [{ v: 'c-o', t: '∠AOB' }, ` = ${v.g}°   ·   ${clase(v.g)}`],
      minimo: 4,
    },
    predice: {
      pregunta: 'El ángulo P tiene lados largos y el ángulo Q, lados cortos. ¿Cuál de los dos mide más?',
      voz: 'Antes de medir, decide qué mira la medida de un ángulo.',
      opciones: [
        { id: 'c', texto: 'Q, aunque sus lados sean cortos', correcta: true },
        { id: 'largo', texto: 'P, porque sus lados son más largos', error: 'GE-ANG1', siFuera: 'Los lados largos sí agrandan el dibujo. La medida del ángulo cuenta la abertura, no el largo.' },
        { id: 'iguales', texto: 'Miden lo mismo', error: 'GE-ANG2', siFuera: 'Serían iguales si sus aberturas coincidieran. Al prolongar los lados de Q, su abertura sigue siendo mayor.' },
      ],
      dibujo: { datos: dosAngulos(0, 0), estado: {} },
      revelar: { datos: dosAngulos(0.5, 0.5), estado: { corte: 1 } },
      coincide: 'Coincide: Q mide 65° y P, 40°. El largo de los lados no entra en la medida.',
    },
    // Hallazgo 9: «Mira» usa los dos ángulos de la predicción, no el de la bisagra del juego: la duda que resuelve
    // (¿cuenta el largo de los lados?) solo aparece al comparar dos ángulos.
    mira: {
      datos: dosAngulos(1, 2),
      voz: 'Compara aberturas. El largo de los lados queda fuera.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Cada ángulo se mide con el arco entre sus dos lados.', ecuacion: ['∠P = 40°', '   ·   ', { v: 'c-o', t: '∠Q' }, ' = 65°'] },
        { estado: { corte: 2 }, texto: 'Prolonga los lados de Q: la abertura no cambia.', ecuacion: [{ v: 'c-o', t: '∠Q' }, ' sigue en 65°'] },
        { estado: { corte: 2 }, texto: 'Los dos son agudos: miden más de 0° y menos de 90°.', ecuacion: ['0° < 40° < 65° < 90°'] },
      ],
    },
    regla: {
      texto: 'Un ángulo mide la abertura entre sus lados, no su largo. Es agudo si mide menos de 90°, recto con 90°, obtuso entre 90° y 180°, y llano con 180°.',
      condicion: 'los lados son rayos: prolongarlos no cambia la medida. Más de 180° es un ángulo no convexo.',
      voz: 'Al alargar los lados, la medida permanece. Esa es la clave.',
    },
    // Así se resuelve (fase 2): consecutivos que se suman y se nombran, como «Ahora tú», con la semilla s + 900.
    resuelve: {
      generar(s) {
        const r = azar(s + 900), a = 5 * r.ent(3, 20), b = 5 * r.ent(2, 22), t = a + b, bien = clase(t);
        const at = aberturaIdea.ahoraTu.generar(s + 900);
        const ubica = { agudo: 'Queda por debajo de 90°: es agudo.', recto: 'Es justo 90°: es recto.', obtuso: 'Queda entre 90° y 180°: es obtuso.',
          llano: 'Es justo 180°: es llano.', 'no convexo': 'Pasa de 180°: es no convexo.' }[bien];
        return {
          enunciado: [`Los ángulos AOB = ${a}° y BOC = ${b}° son consecutivos: OB queda entre OA y OC. ¿Qué clase de ángulo es AOC?`],
          dibujo: at.dibujo,
          pasos: [
            { tipo: 'pide', texto: 'Piden la clase de ∠AOC: su nombre según cuántos grados mide.' },
            { tipo: 'datos', texto: `∠AOB mide ${a}° y ∠BOC mide ${b}°. Comparten el lado OB, que queda en medio.` },
            { tipo: 'regla', texto: 'Si OB está entre OA y OC, la abertura de AOC es la de los dos ángulos juntos. Después comparo el total con 90° y con 180°.' },
            { tipo: 'cuentas', texto: `Sumo las dos aberturas. ${ubica}`, ecuacion: [`∠AOC = ${a}° + ${b}° = ${t}°`], dibujo: at.solucion.dibujo },
            { tipo: 'sentido', texto: `Compruebo al revés: ${t}° − ${b}° = ${a}°, que es ∠AOB. La suma cuadra.` },
          ],
          respuesta: [`∠AOC = ${t}°: ${bien}`],
        };
      },
    },
    ahoraTu: {
      voz: 'Junta las dos aberturas y nombra el resultado.',
      generar(s) {
        const r = azar(s), a = 5 * r.ent(3, 20), b = 5 * r.ent(2, 22), giro = 15 * r.ent(0, 23), t = a + b;
        const p = g => [2.6 * Math.cos(U.rad(giro + g)), 2.6 * Math.sin(U.rad(giro + g))];
        const fig = sol => ({
          datos: {
            alt: `Ángulos consecutivos AOB de ${a}° y BOC de ${b}°${sol ? `; AOC mide ${t}°` : ''}`,
            vista: { x: [-3.4, 3.4], y: [-3.2, 3.2] },
            puntos: [{ id: 'O', x: 0, y: 0, rotulo: 'O', lado: giro + 180 + (a + b) / 2 }, { id: 'A', x: p(0)[0], y: p(0)[1], rotulo: 'A', lado: giro - 20 },
              { id: 'B', x: p(a)[0], y: p(a)[1], rotulo: 'B', lado: giro + a }, { id: 'C', x: p(t)[0], y: p(t)[1], rotulo: 'C', lado: giro + t + 20 }],
            segmentos: [{ de: 'O', a: 'A' }, { de: 'O', a: 'B', color: 'i' }, { de: 'O', a: 'C' }],
            angulos: [{ en: 'O', de: 'A', a: 'B', texto: `${a}°`, color: 'o', radio: 30 }, { en: 'O', de: 'B', a: 'C', texto: `${b}°`, color: 'i', radio: 30, mayor: b > 180 },
              ...(sol ? [{ en: 'O', de: 'A', a: 'C', color: 'h', radio: 46, mayor: t > 180 }] : [])],
          },
          estado: {},
        });
        const rango = { agudo: 'fuera menor que 90°', recto: 'fuera exactamente 90°', obtuso: 'estuviera entre 90° y 180°', llano: 'fuera exactamente 180°', 'no convexo': 'pasara de 180°' };
        const bien = clase(t);
        const nombres = ['agudo', 'recto', 'obtuso', 'llano', 'no convexo'];
        const ops = [{ id: 'c', texto: bien, correcta: true }];
        for (const n of nombres) if (n !== bien && ops.length < 4 && (Math.abs(nombres.indexOf(n) - nombres.indexOf(bien)) <= 2))
          ops.push({ id: n.replace(' ', '-'), texto: n, error: 'GE-ANG3', siFuera: `«${n}» sería el nombre si ${a}° + ${b}° ${rango[n]}.` });
        return {
          pregunta: [`Los ángulos AOB = ${a}° y BOC = ${b}° son consecutivos: OB queda entre OA y OC. ¿Qué clase de ángulo es AOC?`],
          dibujo: fig(false),
          opciones: ops,
          solucion: { texto: 'Las aberturas consecutivas se suman.', ecuacion: [`∠AOC = ${a}° + ${b}° = ${t}°: ${bien}`], dibujo: fig(true) },
        };
      },
    },
  };

  // ---------- Idea 3: bisectriz, complemento y suplemento ----------
  // Cambia: α y su suplemento β · Permanece: la recta AC y el vértice O · Progresa: las mitades α/2 y β/2 ·
  // Se reserva: las dos bisectrices juntas (90°) · Debe verse: las mitades suman la mitad de 180°.
  const al = { v: 'c-o', t: 'α' }, be = { v: 'c-i', t: 'β' }, x = { v: 'c-o', t: 'x' };
  const par = (a, bis, pasos) => {
    const A = [-3, 0], C = [3, 0], B = U.polar([0, 0], 3, a), M1 = U.polar([0, 0], 3, a / 2), M2 = U.polar([0, 0], 3, 90 + a / 2);
    const k = pasos || 0;
    return {
      alt: `α = ${a}° y su suplemento β = ${180 - a}° comparten el lado OB${bis ? '; sus bisectrices forman 90°' : ''}`,
      vista: { x: [-3.6, 3.6], y: [-0.6, 3.6] },
      puntos: [{ id: 'O', x: 0, y: 0, rotulo: 'O', lado: -90 }, { id: 'A', x: A[0], y: 0, rotulo: 'A', lado: -90 }, { id: 'C', x: C[0], y: 0, rotulo: 'C', lado: -90 },
        { id: 'B', x: B[0], y: B[1], rotulo: 'B', lado: a }, { id: 'M', x: M1[0], y: M1[1], sinPunto: true }, { id: 'N', x: M2[0], y: M2[1], sinPunto: true }],
      segmentos: [{ de: 'A', a: 'C' }, { de: 'O', a: 'B' },
        ...(bis ? [{ de: 'O', a: 'M', color: 'd', discontinua: true, desde: Math.min(k, 1) }, { de: 'O', a: 'N', color: 'd', discontinua: true, desde: Math.min(k, 2) }] : [])],
      angulos: bis
        ? [{ en: 'O', de: 'C', a: 'M', color: 'o', radio: 40, rayita: 1, texto: `${a / 2}°`, desde: Math.min(k, 1) }, { en: 'O', de: 'M', a: 'B', color: 'o', radio: 40, rayita: 1, desde: Math.min(k, 1) },
          { en: 'O', de: 'B', a: 'N', color: 'i', radio: 40, rayita: 2, desde: Math.min(k, 2) }, { en: 'O', de: 'N', a: 'A', color: 'i', radio: 40, rayita: 2, texto: `${(180 - a) / 2}°`, desde: Math.min(k, 2) },
          { en: 'O', de: 'M', a: 'N', color: 'h', texto: '90°', desde: Math.min(k, 3) }]
        : [{ en: 'O', de: 'C', a: 'B', color: 'o', texto: `${a}°`, radio: 30 }, { en: 'O', de: 'B', a: 'A', color: 'i', texto: `${180 - a}°`, radio: 24 }],
    };
  };
  const bisectriz = {
    id: 'bisectrices',
    titulo: 'Mitades que suman noventa',
    temas: ['Bisectriz', 'Ángulos complementarios y suplementarios'],
    pieza: 'geo-figura',
    // Lee (fase 2): complemento, suplemento y bisectriz. No dice qué forman las dos bisectrices (eso es «Predice»).
    lee: {
      tarjetas: [
        { titulo: 'Lo que falta para 90°', texto: 'En la esquina de una cancha de fulbito, las líneas forman 90°. Si una raya sale de esa esquina y abre 30° con un lado, al otro le quedan 60°. Esos 60° son el complemento de 30°.' },
        { titulo: 'Lo que falta para 180°', texto: 'Una recta es media vuelta: 180°. Si un rayo sale de un punto de la recta, la parte en dos ángulos. Lo que a uno le falta para llegar a 180° es su suplemento.' },
        { titulo: 'Partir en dos', texto: ['La bisectriz es el rayo que parte un ángulo en dos ángulos iguales. Al jugar, mueve ', al, ' y sigue a ', be, ': mira qué le pasa a uno cuando el otro crece.'] },
      ],
    },
    juega: {
      consigna: 'Cambia α. El ángulo β completa la recta AC. Observa qué le pasa a β cuando α crece.',
      voz: 'Mueve α y sigue a β: cambian juntos.',
      controles: [{ id: 'a', etiqueta: 'α', min: 20, max: 160, paso: 10, inicio: 60, unidad: '°', decimales: 0, color: 'c-o' }],
      dibujo: v => ({ datos: par(v.a, false), estado: {} }),
      // Se agarra la punta B del lado común OB: al girarla, α crece y β se achica.
      arrastres: [{ id: 'punta-b', etiqueta: 'punta B del lado común', color: 'c-o',
        donde: v => enPantalla(par(v.a, false), U.polar([0, 0], 3, v.a)),
        mover: (pt, v) => { const q = alPlano(par(v.a, false), pt); return { a: U.grados(Math.atan2(Math.max(q[1], 0), q[0])) }; } }],
      lectura: v => [al, ` = ${v.a}°   ·   `, be, ` = ${180 - v.a}°   ·   `, al, ' + ', be, ' = 180°'],
      minimo: 3,
    },
    predice: {
      pregunta: ['Con ', al, ' = 50°, trazamos la bisectriz de ', al, ' y la de ', be, '. ¿Qué ángulo forman las dos bisectrices?'],
      voz: 'Decide antes de trazar. Luego comprobamos con las mitades.',
      opciones: [
        { id: 'c', texto: '90°', correcta: true },
        { id: 'depende', texto: 'Depende de α', error: 'GE-BIS1', siFuera: 'Cada mitad sí cambia con α. Pero juntas son la mitad de 180°, para cualquier α.' },
        { id: 'llano', texto: '180°', error: 'GE-BIS2', siFuera: '180° es lo que suman α y β completos. Las bisectrices toman solo la mitad de cada uno.' },
        { id: 'alfa', texto: '50°', error: 'GE-BIS3', siFuera: '50° sería cierto si las bisectrices fueran los lados de α. Cada una parte su ángulo en dos.' },
      ],
      dibujo: { datos: par(50, false), estado: {} },
      revelar: { datos: par(50, true, 3), estado: { corte: 3 } },
      coincide: 'Coincide: 25° + 65° = 90°, la mitad de la recta.',
    },
    mira: {
      datos: par(50, true, 3),
      voz: 'Sigue las marcas: iguales dentro de cada ángulo.',
      pasos: [
        { estado: { corte: 1 }, texto: 'La bisectriz de α lo parte en dos ángulos iguales.', ecuacion: [{ frac: [al, '2'] }, ' = 25°'] },
        { estado: { corte: 2 }, texto: 'La bisectriz de β parte sus 130° en dos de 65°.', ecuacion: [{ frac: [be, '2'] }, ' = 65°'] },
        { estado: { corte: 3 }, texto: 'Entre las bisectrices quedan una mitad de cada ángulo.', ecuacion: [{ frac: [al, '2'] }, ' + ', { frac: [be, '2'] }, ' = ', { frac: [[al, ' + ', be], '2'] }, ' = ', { frac: ['180°', '2'] }, ' = 90°'] },
      ],
    },
    regla: {
      texto: 'La bisectriz divide un ángulo en dos iguales. Dos ángulos complementarios suman 90°; dos suplementarios, 180°. Las bisectrices de dos suplementarios adyacentes forman 90°.',
      ecuacion: [{ llave: ['C(', x, ')'], nota: 'complemento', color: 'c-o' }, ' = 90° − ', x, '   ·   ', { llave: ['S(', x, ')'], nota: 'suplemento', color: 'c-o' }, ' = 180° − ', x],
      condicion: 'el complemento existe si x < 90° y el suplemento si x < 180°; el resultado de 90° pide ángulos adyacentes.',
      voz: 'Deshaz las operaciones desde afuera hacia adentro.',
    },
    // Así se resuelve (fase 2): los tres tipos de «Ahora tú» (s % 3, y 900 es múltiplo de 3), con las mismas cuentas.
    // La figura es la del juego (par): x en naranja y su suplemento en turquesa; en las cuentas aparecen sus medidas.
    resuelve: {
      generar(s) {
        const r = azar(s + 900), tipo = s % 3;
        const fig = (v, medidas) => {
          const d = par(v, false);
          if (medidas) d.alt = `x = ${v}° y su suplemento, ${180 - v}°, comparten el lado OB sobre la recta AC`;
          else {
            d.alt = 'El ángulo x y su suplemento comparten el lado OB sobre la recta AC';
            d.angulos = d.angulos.map((an, i) => Object.assign({}, an, { texto: i === 0 ? 'x' : 'S(x)' }));
          }
          return { datos: d, estado: {} };
        };
        const restas = ['C(', x, ') = 90° − ', x, '   ·   S(', x, ') = 180° − ', x];
        const regla = { tipo: 'regla', texto: 'El complemento es lo que falta para 90°; el suplemento, lo que falta para 180°. Escribo cada uno como una resta.', ecuacion: restas };
        const pide = { tipo: 'pide', texto: ['Piden ', x, ', el ángulo del que parten las operaciones.'] };
        let v, enunciado, datos, cuentas, sentido;
        if (tipo === 0) {
          v = 5 * r.ent(2, 16); const k = 90 + v;
          enunciado = ['El suplemento del complemento de ', x, ` mide ${k}°. ¿Cuánto mide `, x, '?'];
          datos = `Primero se toma el complemento de x; después, el suplemento de ese resultado. Al final da ${k}°.`;
          cuentas = { texto: ['Pongo el complemento dentro del suplemento, simplifico y despejo ', x, '.'],
            ecuacion: ['180° − (90° − ', x, ') = 90° + ', x, ` = ${k}°  →  `, x, ` = ${v}°`] };
          sentido = `Compruebo: el complemento de ${v}° es ${90 - v}°, y el suplemento de ${90 - v}° es ${180 - (90 - v)}°. Cuadra.`;
        } else if (tipo === 1) {
          v = 5 * r.ent(2, 16); const k = 270 - 2 * v;
          enunciado = ['El complemento de ', x, ' más el suplemento de ', x, ` suman ${k}°. ¿Cuánto mide `, x, '?'];
          datos = `El complemento de x y el suplemento de x, juntos, suman ${k}°.`;
          cuentas = { texto: ['Sumo las dos restas: ', x, ' aparece dos veces, restando.'],
            ecuacion: ['270° − 2', x, ` = ${k}°  →  2`, x, ` = ${270 - k}°  →  `, x, ` = ${v}°`] };
          sentido = `Compruebo: el complemento de ${v}° es ${90 - v}° y el suplemento, ${180 - v}°. Suman ${(90 - v) + (180 - v)}°. Cuadra.`;
        } else {
          const m = r.de([3, 4, 7, 10]); v = (90 * m - 180) / (m - 1);
          enunciado = ['El suplemento de ', x, ` es ${m} veces su complemento. ¿Cuánto mide `, x, '?'];
          datos = `El suplemento de x es ${m} veces su complemento.`;
          cuentas = { texto: ['Escribo las dos restas, reparto el ', String(m), ' y despejo ', x, '.'],
            ecuacion: ['180° − ', x, ` = ${m}(90° − `, x, `)  →  ${m - 1}`, x, ` = ${90 * m - 180}°  →  `, x, ` = ${gr(v)}`] };
          sentido = `Compruebo: el suplemento de ${gr(v)} es ${gr(180 - v)} y el complemento, ${gr(90 - v)}. Y ${m} · ${gr(90 - v)} = ${gr(m * (90 - v))}. Cuadra.`;
        }
        return {
          enunciado,
          dibujo: fig(v, false),
          pasos: [pide, { tipo: 'datos', texto: datos }, regla,
            Object.assign({ tipo: 'cuentas', dibujo: fig(v, true) }, cuentas),
            { tipo: 'sentido', texto: sentido }],
          respuesta: [x, ` = ${gr(v)}`],
        };
      },
    },
    ahoraTu: {
      voz: 'Escribe cada operación como una resta y despeja.',
      generar(s) {
        const r = azar(s), tipo = s % 3;
        if (tipo === 0) {
          const v = 5 * r.ent(2, 16), k = 90 + v;
          return {
            pregunta: ['El suplemento del complemento de ', x, ` mide ${k}°. ¿Cuánto mide `, x, '?'],
            opciones: opciones(v, [
              { id: 'solo-s', valor: 180 - k, error: 'GE-CS1', siFuera: `${180 - k}° deshace solo el suplemento. Falta deshacer el complemento.` },
              { id: 'orden', valor: k + 90, error: 'GE-CS2', siFuera: 'Eso sería si el complemento fuera la operación de afuera.' },
              { id: 'mitad', valor: k / 2, error: 'GE-CS3', siFuera: 'Dividir entre 2 serviría con una bisectriz; aquí hay dos restas.' },
            ], gr),
            solucion: { texto: 'S(C(x)) = 180° − (90° − x) = 90° + x.', ecuacion: ['90° + ', x, ` = ${k}° → `, x, ` = ${v}°`] },
          };
        }
        if (tipo === 1) {
          const v = 5 * r.ent(2, 16), k = 270 - 2 * v;
          return {
            pregunta: ['El complemento de ', x, ' más el suplemento de ', x, ` suman ${k}°. ¿Cuánto mide `, x, '?'],
            opciones: opciones(v, [
              { id: 'sin-2', valor: 270 - k, error: 'GE-CS4', siFuera: `Restar de 270° va bien, pero x aparece dos veces: 270° − 2x = ${k}°.` },
              { id: 'solo-c', valor: 90 - k / 2, error: 'GE-CS3', siFuera: 'Repartir la suma en mitades iguales serviría si el complemento y el suplemento midieran igual.' },
              { id: 'solo-s', valor: 180 - k / 2, error: 'GE-CS3', siFuera: 'Repartir la suma en mitades iguales serviría si el complemento y el suplemento midieran igual.' },
            ], gr),
            solucion: { texto: 'Suma las dos restas: (90° − x) + (180° − x).', ecuacion: ['270° − 2', x, ` = ${k}° → `, x, ` = ${v}°`] },
          };
        }
        const m = r.de([3, 4, 7, 10]), v = (90 * m - 180) / (m - 1);
        return {
          pregunta: ['El suplemento de ', x, ` es ${m} veces su complemento. ¿Cuánto mide `, x, '?'],
          opciones: opciones(v, [
            { id: 'al-reves', valor: (180 * m - 90) / (m - 1), error: 'GE-CS2', siFuera: `Eso pone el ${m} del lado del suplemento. El enunciado multiplica al complemento.` },
            { id: 'dividir', valor: 180 / m, error: 'GE-CS4', siFuera: `Dividir 180° entre ${m} olvida que el complemento también depende de x.` },
            { id: 'noventa', valor: 90 / m, error: 'GE-CS4', siFuera: `Dividir 90° entre ${m} olvida que el suplemento también depende de x.` },
          ], gr),
          solucion: { texto: 'Escribe las dos restas y despeja x.', ecuacion: ['180° − ', x, ` = ${m}(90° − `, x, `) → `, x, ` = ${gr(v)}`] },
        };
      },
    },
  };

  // ---------- Idea 4: paralelas y una secante ----------
  // Cambia: la inclinación θ de la secante · Permanece: dos rectas paralelas · Progresa: qué pares son iguales y cuáles suman 180° ·
  // Se reserva: una recta que deja de ser paralela · Debe verse: la igualdad depende del paralelismo, no del aspecto.
  const th = { v: 'c-o', t: 'θ' };
  // Las medidas que la figura rotula: el naranja de abajo (en P), el de arriba (en Q) y el conjugado turquesa en Q.
  const medidasSecante = (t, giro = 0) => ({ abajo: t, arriba: t - giro, conjugado: 180 - t + giro });
  const secante = (t, o = {}) => {
    const giro = o.giro || 0, h = 2.4, m = medidasSecante(t, giro);
    const dx = h / Math.tan(U.rad(t)), P = [-dx / 2, 0], Q = [dx / 2, h];
    const up = U.polar(Q, 1.6, t), dn = U.polar(P, -1.6, t);
    const R = U.polar(Q, 3, giro), L = U.polar(Q, -3, giro);
    const e = o.etapa === undefined ? 9 : o.etapa;
    const txt = (v, k) => (o.textos === false ? undefined : (e >= k ? `${v}°` : undefined));
    const angs = [
      { en: 'P', de: 'Pd', a: 'Q', color: 'o', texto: txt(m.abajo, 0), radio: 24 },
      { en: 'Q', de: 'Qd', a: 'Qu', color: 'o', texto: txt(m.arriba, 1), radio: 24, desde: o.pasos ? 1 : 0 },
      { en: 'Q', de: 'Qi', a: 'P', color: 'o', texto: txt(m.arriba, 3), radio: 24, desde: o.pasos ? 3 : 0 },
      { en: 'Q', de: 'Qd', a: 'P', color: 'i', texto: txt(m.conjugado, 4), radio: 30, desde: o.pasos ? 4 : 0 },
    ];
    if (o.pasos) angs.splice(2, 0, { en: 'Q', de: 'Qi', a: 'Qb', color: 'o', texto: undefined, radio: 18, desde: 2 });
    return {
      alt: giro ? `La recta de arriba giró ${giro}°: los ángulos correspondientes miden ${t}° y ${t - giro}°` : `Paralelas cortadas por una secante de ${t}°: correspondientes y alternos internos de ${t}°, conjugados que suman 180°`,
      vista: { x: [-4, 4], y: [-1.4, 3.8] },
      puntos: [{ id: 'P', x: P[0], y: 0, rotulo: 'P', lado: -60 }, { id: 'Q', x: Q[0], y: Q[1], rotulo: 'Q', lado: 120 },
        { id: 'Pd', x: P[0] + 3, y: 0, sinPunto: true }, { id: 'Pi', x: P[0] - 3, y: 0, sinPunto: true }, { id: 'Qd', x: R[0], y: R[1], sinPunto: true }, { id: 'Qi', x: L[0], y: L[1], sinPunto: true },
        { id: 'Qu', x: up[0], y: up[1], sinPunto: true }, { id: 'Pb', x: dn[0], y: dn[1], sinPunto: true }, { id: 'Qb', x: Q[0] - Math.cos(U.rad(t)), y: Q[1] - Math.sin(U.rad(t)), sinPunto: true }],
      segmentos: [{ de: 'Pi', a: 'Pd', recta: true, paralela: giro ? 0 : 1 }, { de: 'Qi', a: 'Qd', recta: true, paralela: giro ? 0 : 1, color: giro ? 'h' : undefined }, { de: 'Pb', a: 'Qu', recta: true, grosor: 'fino' }],
      angulos: angs,
    };
  };
  // La secante pasa por el punto medio (0; 1,2) de PQ para todo θ: su punta Qu está a θ de ese centro.
  const arrastreSecante = dib => ({ id: 'secante', etiqueta: 'punta de la secante', color: 'c-o',
    donde: v => { const t = v.t, Q = [1.2 / Math.tan(U.rad(t)), 2.4]; return enPantalla(dib(t, v), U.polar(Q, 1.6, t)); },
    mover: (pt, v) => { const q = alPlano(dib(v.t, v), pt); return { t: U.grados(Math.atan2(Math.max(q[1] - 1.2, 0.01), q[0])) }; } });
  const paralelas = {
    id: 'paralelas',
    titulo: 'Paralelas: ángulos iguales y suplementarios',
    temas: ['Rectas paralelas y una secante'],
    pieza: 'geo-figura',
    // Lee (fase 2): paralelas, secante y los nombres de los pares. No dice qué pares son iguales ni qué pasa si una
    // recta gira (eso lo descubre al jugar y en «Predice»).
    lee: {
      tarjetas: [
        { titulo: 'Rieles que no se juntan', texto: 'Los rieles del tren que sale de Juliaca hacia Cusco van siempre a la misma distancia: nunca se cruzan. Dos rectas así, en el mismo plano, se llaman rectas paralelas.' },
        { titulo: 'La recta que corta', texto: 'Una recta que corta a las dos paralelas es una secante. En cada cruce se forman cuatro ángulos; en total, ocho. Cada par de ángulos tiene un nombre según dónde está.' },
        { titulo: 'Los nombres de cada par', texto: 'Los correspondientes ocupan el mismo lugar en cada cruce. Los alternos internos están entre las rectas y a distinto lado de la secante. Los conjugados internos están entre las rectas y del mismo lado.' },
        { titulo: 'Qué mirar', texto: 'Al jugar, inclina la secante y sigue a los ángulos naranjas y al turquesa. Fíjate cuáles cambian juntos y cuáles no.' },
      ],
    },
    juega: {
      consigna: 'Inclina la secante que corta las dos rectas paralelas. Mira qué ángulos naranjas siguen iguales y cuál turquesa los acompaña.',
      voz: 'Inclina la secante. Comprueba qué pares permanecen iguales.',
      controles: [{ id: 't', etiqueta: 'θ', min: 30, max: 150, paso: 10, inicio: 60, unidad: '°', decimales: 0, color: 'c-o' }],
      dibujo: v => ({ datos: secante(v.t), estado: {} }),
      // Se agarra la punta de arriba de la secante: gira alrededor del punto medio de PQ, que no se mueve.
      arrastres: [arrastreSecante(t => secante(t))],
      lectura: v => ['naranjas: ', `${v.t}°`, '   ·   turquesa: ', `${180 - v.t}°`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Ahora la recta de arriba gira 12° y deja de ser paralela; la secante no se mueve. ¿Qué pasa con los dos ángulos correspondientes?',
      voz: 'El dibujo cambió poco. Decide con la condición.',
      opciones: [
        { id: 'c', texto: 'Dejan de ser iguales: difieren en 12°', correcta: true },
        { id: 'iguales', texto: 'Siguen iguales: es la misma secante', error: 'GE17', siFuera: 'Seguirían iguales si las rectas fueran paralelas. Al girar una, su ángulo gira con ella.' },
        { id: 'suman', texto: 'Ahora suman 180°', error: 'GE17', siFuera: 'Sumar 180° es propio de los conjugados internos entre paralelas, no de los correspondientes.' },
      ],
      dibujo: { datos: secante(60, { giro: 12, textos: false }), estado: {} },
      revelar: { datos: secante(60, { giro: 12 }), estado: {} },
      coincide: 'Coincide: 60° abajo y 48° arriba. Sin paralelas, la igualdad se pierde.',
    },
    mira: {
      datos: secante(60, { pasos: true }),
      voz: 'Cada igualdad se apoya en la anterior. Síguelas en cadena.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Correspondientes: la secante cruza dos paralelas con la misma inclinación.', ecuacion: [th, ' en P = ', th, ' en Q'] },
        { estado: { corte: 2 }, texto: 'En Q, el ángulo opuesto por el vértice es igual.', ecuacion: ['opuestos por el vértice: ', th] },
        { estado: { corte: 3 }, texto: 'Así, los alternos internos también son iguales.', ecuacion: ['alternos internos: ', th, ' = ', th] },
        { estado: { corte: 4 }, texto: 'Los conjugados internos completan una recta: suman 180°.', ecuacion: [th, ' + ', { v: 'c-i', t: 'β' }, ' = 180°'] },
      ],
    },
    regla: {
      texto: 'Si dos rectas paralelas son cortadas por una secante, los correspondientes y los alternos internos son iguales, y los conjugados internos suman 180°.',
      ecuacion: [{ llave: [th], nota: 'correspondiente', color: 'c-o' }, ' = ', { llave: [th], nota: 'alterno', color: 'c-o' }, '   ·   ', th, ' + ', { llave: [{ v: 'c-i', t: 'β' }], nota: 'conjugado', color: 'c-i' }, ' = 180°'],
      condicion: 'las rectas son paralelas. Al revés también vale: si dos correspondientes son iguales, las rectas son paralelas.',
      voz: 'Primero la condición de paralelas; después las igualdades.',
    },
    // Así se resuelve (fase 2): alternos (s par) o conjugados (s impar), como «Ahora tú»; 900 es par, así que
    // paralelas.ahoraTu.generar(s + 900) es el mismo caso y da la figura. En las cuentas, la figura pasa a grados.
    resuelve: {
      generar(s) {
        const r = azar(s + 900), conj = s % 2 === 1, v = r.ent(8, 28), a1 = r.ent(2, 5);
        let a2 = r.ent(1, 4); if (a2 === a1) a2 = a1 + 1;
        const t1 = conj ? 5 * r.ent(8, 26) : 5 * r.ent(8, 28);
        const ang2 = conj ? 180 - t1 : t1, b1 = t1 - a1 * v, b2 = ang2 - a2 * v;
        const ex = (a, b) => `${a}x ${b < 0 ? '−' : '+'} ${Math.abs(b)}°`, cx_ = k => (k === 1 ? 'x' : `${k}x`);
        const e1 = ex(a1, b1), e2 = ex(a2, b2), nombre = conj ? 'conjugados internos' : 'alternos internos';
        const at = paralelas.ahoraTu.generar(s + 900);
        const enGrados = { datos: Object.assign({}, at.dibujo.datos, {
          alt: `Con x = ${v}: los ${nombre} miden ${t1}° y ${ang2}°`,
          angulos: at.dibujo.datos.angulos.map((an, i) => Object.assign({}, an, { texto: `${i === 0 ? t1 : ang2}°` })) }), estado: {} };
        let despeje;
        if (conj) despeje = [`${e1} + ${e2} = 180°  →  ${cx_(a1 + a2)} = ${180 - b1 - b2}°  →  x = ${v}`];
        else if (a1 > a2) despeje = [`${e1} = ${e2}  →  ${cx_(a1 - a2)} = ${b2 - b1}°  →  x = ${v}`];
        else despeje = [`${e1} = ${e2}  →  ${cx_(a2 - a1)} = ${b1 - b2}°  →  x = ${v}`];
        return {
          enunciado: [`Las dos rectas son paralelas. Los ángulos marcados son ${nombre}: ${e1} y ${e2}. ¿Cuánto vale x?`],
          dibujo: at.dibujo,
          pasos: [
            { tipo: 'pide', texto: 'Piden x, el número que hace verdaderas las dos expresiones a la vez.' },
            { tipo: 'datos', texto: `Las rectas son paralelas. El ángulo naranja mide ${e1} y el turquesa, ${e2}: son ${nombre}.` },
            { tipo: 'regla', texto: conj ? 'Entre paralelas, los conjugados internos completan media vuelta: juntos suman 180°.'
              : 'Entre paralelas, los alternos internos tienen la misma abertura: igualo las dos expresiones.',
              ecuacion: conj ? ['conjugados: ', th, ' + ', { v: 'c-i', t: 'β' }, ' = 180°'] : ['alternos internos: ', th, ' = ', th] },
            { tipo: 'cuentas', texto: conj ? 'Sumo las dos expresiones, igualo a 180° y despejo x.' : 'Igualo las dos expresiones, junto las x a un lado y despejo.',
              ecuacion: despeje, dibujo: enGrados },
            { tipo: 'sentido', texto: `Reemplazo x = ${v}: el naranja mide ${a1 * v + b1}° y el turquesa, ${a2 * v + b2}°. ${conj ? `Suman ${a1 * v + b1 + a2 * v + b2}°, como deben.` : 'Son iguales, como deben.'}` },
          ],
          respuesta: [`x = ${v}`],
        };
      },
    },
    ahoraTu: {
      voz: 'Decide si el par es igual o suplementario, y plantea.',
      generar(s) {
        const r = azar(s), conj = s % 2 === 1, v = r.ent(8, 28), a1 = r.ent(2, 5);
        let a2 = r.ent(1, 4); if (a2 === a1) a2 = a1 + 1;
        const t1 = conj ? 5 * r.ent(8, 26) : 5 * r.ent(8, 28); // ángulo de abajo
        const ang2 = conj ? 180 - t1 : t1;
        const b1 = t1 - a1 * v, b2 = ang2 - a2 * v;
        const ex = (a, b) => `${a}x ${b < 0 ? '−' : '+'} ${Math.abs(b)}°`;
        const d = secante(t1, { textos: false });
        d.angulos = [{ en: 'P', de: 'Pd', a: 'Q', color: 'o', texto: ex(a1, b1), radio: 24 },
          conj ? { en: 'Q', de: 'Qd', a: 'P', color: 'i', texto: ex(a2, b2), radio: 24 } : { en: 'Q', de: 'Qi', a: 'P', color: 'i', texto: ex(a2, b2), radio: 24 }];
        d.alt = `Paralelas y secante: ${conj ? 'conjugados internos' : 'alternos internos'} ${ex(a1, b1)} y ${ex(a2, b2)}`;
        const otro = conj ? (b2 - b1) / (a1 - a2) : (180 - b1 - b2) / (a1 + a2);
        return {
          pregunta: [`Las dos rectas son paralelas. Los ángulos marcados son ${conj ? 'conjugados internos' : 'alternos internos'}: ${ex(a1, b1)} y ${ex(a2, b2)}. ¿Cuánto vale x?`],
          dibujo: { datos: d, estado: {} },
          opciones: opciones(v, [
            { id: 'cambio', valor: otro, error: 'GE17', siFuera: conj ? 'Igualarlos valdría para alternos internos; los conjugados internos suman 180°.' : 'Sumar 180° valdría para conjugados internos; los alternos internos son iguales.' },
            { id: 'angulo', valor: t1, error: 'GE-QB2', siFuera: `${t1}° es el ángulo de abajo. La pregunta pide x.` },
            { id: 'uno-mas', valor: v + 2, error: 'GE-QB2', siFuera: 'Revisa el despeje: reemplaza x en las dos expresiones y compara.' },
          ], n => `${f(n, 2)}`),
          solucion: {
            texto: conj ? 'Los conjugados internos suman 180°.' : 'Los alternos internos son iguales.',
            ecuacion: conj ? [`${ex(a1, b1)} + ${ex(a2, b2)} = 180° → x = ${v}`] : [`${ex(a1, b1)} = ${ex(a2, b2)} → x = ${v}`],
          },
        };
      },
    },
  };

  // ---------- Idea 5: el quiebre entre paralelas ----------
  // Cambia: a y b, los ángulos de cada tramo con su paralela · Permanece: las paralelas · Progresa: la paralela auxiliar por V ·
  // Se reserva: la línea auxiliar (aparece en la predicción) · Debe verse: x se parte en a y b, alternos internos.
  const ca = { v: 'c-o', t: 'a' }, cb = { v: 'c-i', t: 'b' }, cx = { v: 'c-h', t: 'x' };
  // El quiebre que rotula la figura (x = a + b, por la paralela auxiliar).
  const quiebreX = v => v.a + v.b;
  const quiebre = (a, b, o = {}) => {
    const V = [3.4, 1.5];
    const T1 = U.polar(V, 1.5 / Math.sin(U.rad(a)), 180 - a), B1 = U.polar(V, 1.5 / Math.sin(U.rad(b)), 180 + b);
    const aux = o.aux || 0;
    return {
      alt: `Quiebre V entre dos paralelas: a = ${a}°, b = ${b}°${o.x ? `, x = ${a + b}°` : ''}`,
      vista: { x: [-2.6, 5.2], y: [-0.6, 3.6] },
      puntos: [{ id: 'V', x: V[0], y: V[1], rotulo: 'V', lado: 0 }, { id: 'T', x: T1[0], y: T1[1], rotulo: 'T', lado: 110 }, { id: 'B', x: B1[0], y: B1[1], rotulo: 'B', lado: -110 },
        { id: 'Td', x: T1[0] + 2, y: 3, sinPunto: true }, { id: 'Ti', x: -3, y: 3, sinPunto: true }, { id: 'Bd', x: B1[0] + 2, y: 0, sinPunto: true }, { id: 'Bi', x: -3, y: 0, sinPunto: true },
        { id: 'Vi', x: V[0] - 2, y: V[1], sinPunto: true }],
      segmentos: [{ de: 'Ti', a: 'Td', recta: true, paralela: 1 }, { de: 'Bi', a: 'Bd', recta: true, paralela: 1 },
        { de: 'V', a: 'T', grosor: 'variable' }, { de: 'V', a: 'B', grosor: 'variable' },
        ...(aux ? [{ de: 'Vi', a: 'V', recta: true, discontinua: true, grosor: 'fino', desde: o.pasos ? 1 : 0 }] : [])],
      angulos: [{ en: 'T', de: 'Td', a: 'V', color: 'o', texto: `${a}°` }, { en: 'B', de: 'Bd', a: 'V', color: 'i', texto: `${b}°` },
        ...(aux ? [{ en: 'V', de: 'T', a: 'Vi', color: 'o', radio: 30, desde: o.pasos ? 2 : 0, texto: o.x ? undefined : `${a}°` }, { en: 'V', de: 'Vi', a: 'B', color: 'i', radio: 30, desde: o.pasos ? 3 : 0, texto: o.x ? undefined : `${b}°` }] : []),
        { en: 'V', de: 'T', a: 'B', color: 'h', radio: 44, texto: o.x ? `x = ${a + b}°` : 'x', desde: o.pasos ? 4 : 0 }],
    };
  };
  // T está en y = 3 y B en y = 0, los dos a 1,5 de la altura de V (3,4; 1,5): el ángulo sale de atan2(1,5; 3,4 − x).
  const angTramo = x => U.grados(Math.atan2(1.5, 3.4 - x));
  const arrastresQuiebre = dib => [
    { id: 'punto-t', etiqueta: 'punto T en la paralela de arriba', color: 'c-o',
      donde: v => enPantalla(dib(v.a, v.b, v), U.polar([3.4, 1.5], 1.5 / Math.sin(U.rad(v.a)), 180 - v.a)),
      mover: (pt, v) => ({ a: angTramo(alPlano(dib(v.a, v.b, v), pt)[0]) }) },
    { id: 'punto-b', etiqueta: 'punto B en la paralela de abajo', color: 'c-i',
      donde: v => enPantalla(dib(v.a, v.b, v), U.polar([3.4, 1.5], 1.5 / Math.sin(U.rad(v.b)), 180 + v.b)),
      mover: (pt, v) => ({ b: angTramo(alPlano(dib(v.a, v.b, v), pt)[0]) }) },
  ];
  const QUIEBRES = [];   // todos los x de la grilla del juego (a y b de 20° a 70°, de 5° en 5°)
  for (let a = 20; a <= 70; a += 5) for (let b = 20; b <= 70; b += 5) QUIEBRES.push(quiebreX({ a, b }));
  const quiebreIdea = {
    id: 'quiebre',
    titulo: 'El quiebre entre paralelas',
    temas: ['Rectas paralelas y una secante'],
    pieza: 'geo-figura',
    // Lee (fase 2): línea quebrada y qué ángulo es cada letra. No dice en qué partes deja la paralela auxiliar el
    // quiebre (eso es «Predice»).
    lee: {
      tarjetas: [
        { titulo: 'Una línea que dobla', texto: 'El camino que sube en zigzag a un cerro de Juliaca va derecho, dobla y sigue derecho. En geometría, el punto donde una línea así cambia de dirección se llama vértice.' },
        { titulo: 'Entre dos paralelas', texto: ['Aquí la línea TVB empieza en una paralela, dobla en V y termina en la otra. El tramo de arriba forma ', ca, ' con su paralela; el de abajo, ', cb, '. El ángulo en V es el quiebre, ', cx, '.'] },
        { titulo: 'Qué mirar', texto: ['Al jugar, cambia ', ca, ' y ', cb, ' por separado. Mira cuánto mide ', cx, ' en cada caso y busca qué cuenta con ', ca, ' y ', cb, ' da ese número.'] },
      ],
    },
    juega: {
      consigna: 'La línea TVB se quiebra entre dos paralelas. Cambia los ángulos a y b, y compara el quiebre x con su suma.',
      voz: 'Cambia a y b. Mira cómo responde x.',
      controles: [
        { id: 'a', etiqueta: 'a', min: 20, max: 70, paso: 5, inicio: 40, unidad: '°', decimales: 0, color: 'c-o' },
        { id: 'b', etiqueta: 'b', min: 20, max: 70, paso: 5, inicio: 30, unidad: '°', decimales: 0, color: 'c-i' },
      ],
      dibujo: v => ({ datos: quiebre(v.a, v.b, { x: true }), estado: {} }),
      // Se agarran T y B, que corren por su paralela: V queda fijo y cada tramo se inclina.
      arrastres: arrastresQuiebre((a, b) => quiebre(a, b, { x: true })),
      lectura: v => [cx, ` = ${quiebreX(v)}°   ·   `, ca, ' + ', cb, ` = ${v.a + v.b}°`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Para explicar por qué x = a + b, trazamos por V una paralela a las dos rectas. ¿En qué dos ángulos queda partido x?',
      voz: 'Piensa en la línea auxiliar antes de verla.',
      opciones: [
        { id: 'c', texto: 'Uno igual a a y otro igual a b', correcta: true },
        { id: 'mitades', texto: 'En dos mitades iguales', error: 'GE-QB1', siFuera: 'Mitades iguales sería cierto si a y b midieran lo mismo. La paralela copia cada uno.' },
        { id: 'supl', texto: 'En 180° − a y 180° − b', error: 'GE17', siFuera: 'Esos serían los conjugados internos. Con la paralela por V, cada par es alterno interno.' },
      ],
      dibujo: { datos: quiebre(40, 30), estado: {} },
      revelar: { datos: quiebre(40, 30, { aux: 1 }), estado: {} },
      coincide: 'Coincide: la paralela por V copia a arriba y b abajo.',
    },
    mira: {
      datos: quiebre(40, 30, { aux: 1, pasos: true, x: true }),
      voz: 'Sigue la paralela auxiliar: ella hace el trabajo.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Por V trazamos una paralela a las dos rectas.', ecuacion: ['tres paralelas'] },
        { estado: { corte: 2 }, texto: 'Con la recta de arriba, VT forma alternos internos: a.', ecuacion: [ca, ' = 40°'] },
        { estado: { corte: 3 }, texto: 'Con la de abajo, VB forma alternos internos: b.', ecuacion: [cb, ' = 30°'] },
        { estado: { corte: 4 }, texto: 'El quiebre x reúne las dos partes.', ecuacion: [cx, ' = ', ca, ' + ', cb, ' = 70°'] },
      ],
    },
    regla: {
      texto: 'Si una línea se quiebra entre dos paralelas, el ángulo del quiebre es la suma de los ángulos que cada tramo forma con su paralela.',
      ecuacion: [{ llave: [cx], nota: 'quiebre', color: 'c-h' }, ' = ', { llave: [ca], nota: 'arriba', color: 'c-o' }, ' + ', { llave: [cb], nota: 'abajo', color: 'c-i' }],
      condicion: 'las rectas son paralelas y a y b se miden del lado donde está el vértice del quiebre.',
      voz: 'Una paralela auxiliar convierte el quiebre en dos alternos.',
    },
    // Así se resuelve (fase 2): pide x (s par) o b (s impar), como «Ahora tú»; la figura es la de
    // quiebreIdea.ahoraTu.generar(s + 900) y, en las cuentas, aparece la paralela auxiliar por V.
    resuelve: {
      generar(s) {
        const r = azar(s + 900), a = 5 * r.ent(4, 14), b = 5 * r.ent(4, 14), pideX = s % 2 === 0, xx = quiebreX({ a, b });
        const at = quiebreIdea.ahoraTu.generar(s + 900);
        const regla = { tipo: 'regla', texto: 'Por V trazo una paralela auxiliar. Parte el quiebre en dos alternos internos: uno copia a y el otro copia b.',
          ecuacion: [cx, ' = ', ca, ' + ', cb] };
        const conAux = { datos: quiebre(a, b, pideX ? { aux: 1, x: true } : { aux: 1 }), estado: {} };
        return {
          enunciado: pideX ? [`Las rectas son paralelas. Si a = ${a}° y b = ${b}°, ¿cuánto mide el quiebre `, cx, '?']
            : [`Las rectas son paralelas. Si a = ${a}° y el quiebre mide `, cx, ` = ${xx}°, ¿cuánto mide b?`],
          // La figura de «Ahora tú» nombra b en su texto alternativo; aquí, cuando se pide b, no se adelanta.
          dibujo: pideX ? at.dibujo : { datos: Object.assign({}, at.dibujo.datos, { alt: `Quiebre V entre dos paralelas: a = ${a}°, b sin medida y x = ${xx}°` }), estado: {} },
          pasos: pideX ? [
            { tipo: 'pide', texto: ['Piden ', cx, ', el ángulo del quiebre en V.'] },
            { tipo: 'datos', texto: ['Las rectas son paralelas. El tramo de arriba forma ', ca, ` = ${a}° con su recta y el de abajo, `, cb, ` = ${b}°.`] },
            regla,
            { tipo: 'cuentas', texto: 'El quiebre reúne las dos partes: las sumo.', ecuacion: [cx, ` = ${a}° + ${b}° = ${xx}°`], dibujo: conAux },
            { tipo: 'sentido', texto: `${xx}° es mayor que ${a}° y que ${b}°, porque el quiebre contiene a los dos. Y es menor que 180°: la línea sí dobla.` },
          ] : [
            { tipo: 'pide', texto: ['Piden ', cb, ', el ángulo que el tramo de abajo forma con su paralela.'] },
            { tipo: 'datos', texto: ['Las rectas son paralelas. Arriba, ', ca, ` = ${a}°; el quiebre completo mide `, cx, ` = ${xx}°.`] },
            regla,
            { tipo: 'cuentas', texto: ['Como ', cx, ' es la suma, ', cb, ' es lo que queda al quitarle ', ca, '.'], ecuacion: [cb, ` = ${xx}° − ${a}° = ${xx - a}°`], dibujo: conAux },
            { tipo: 'sentido', texto: `Compruebo: ${a}° + ${xx - a}° = ${xx}°, el quiebre completo.` },
          ],
          respuesta: pideX ? [cx, ` = ${xx}°`] : [cb, ` = ${xx - a}°`],
        };
      },
    },
    ahoraTu: {
      voz: 'Ubica a, b y x antes de operar.',
      generar(s) {
        const r = azar(s), a = 5 * r.ent(4, 14), b = 5 * r.ent(4, 14), pideX = s % 2 === 0;
        const d = quiebre(a, b);
        if (!pideX) d.angulos = d.angulos.map(an => an.color === 'i' ? Object.assign({}, an, { texto: 'b' }) : an.color === 'h' ? Object.assign({}, an, { texto: `${a + b}°` }) : an);
        const bien = pideX ? a + b : b;
        return {
          pregunta: pideX ? [`Las rectas son paralelas. Si a = ${a}° y b = ${b}°, ¿cuánto mide el quiebre `, cx, '?'] : [`Las rectas son paralelas. Si a = ${a}° y el quiebre mide `, cx, ` = ${a + b}°, ¿cuánto mide b?`],
          dibujo: { datos: d, estado: {} },
          opciones: opciones(bien, pideX ? [
            { id: 'supl', valor: 180 - a - b, error: 'GE17', siFuera: 'Restar de 180° sería para conjugados; aquí los pares son alternos internos.' },
            { id: 'mitad', valor: (a + b) / 2, error: 'GE-QB1', siFuera: 'El promedio sería cierto si x fuera la mitad de la suma; x es la suma.' },
            { id: 'resta', valor: Math.abs(a - b), error: 'GE-QB1', siFuera: 'Restar serviría si los tramos quedaran a lados opuestos del vértice.' },
          ] : [
            { id: 'suma', valor: a + (a + b), error: 'GE-QB1', siFuera: 'Sumar todo serviría si x fuera una parte; x es el total.' },
            { id: 'supl', valor: 180 - (a + b) - a, error: 'GE17', siFuera: 'Restar de 180° sería para conjugados; aquí los pares son alternos internos.' },
            { id: 'igual', valor: a, error: 'GE-QB1', siFuera: 'b sería igual a a solo si el quiebre fuera simétrico.' },
            { id: 'todo', valor: a + b, error: 'GE-QB1', siFuera: 'Ese es el quiebre completo; b es solo una de sus partes.' },
            { id: 'supl-x', valor: 180 - (a + b), error: 'GE17', siFuera: 'Restar el quiebre de 180° sería para conjugados; aquí los pares son alternos.' },
          ], gr),
          solucion: { texto: 'La paralela por V parte x en a y b.', ecuacion: pideX ? [cx, ` = ${a}° + ${b}° = ${a + b}°`] : [cb, ` = ${a + b}° − ${a}° = ${b}°`] },
        };
      },
    },
  };

  // ---------- Laboratorio: juego libre, sin preguntas ----------
  // Mesa 1, más rica que la idea 4: además de inclinar la secante, se gira la recta de arriba. Deja probar lo que la
  // idea reserva para la predicción: qué pasa con los correspondientes y los conjugados cuando las rectas no son paralelas.
  const mesaSecante = {
    id: 'secante-y-giro', titulo: 'Paralelas o casi paralelas', pieza: 'geo-figura',
    consigna: 'Inclina la secante y gira la recta de arriba. Busca cuándo los dos naranjas vuelven a ser iguales.',
    controles: [
      { id: 't', etiqueta: 'θ', min: 40, max: 140, paso: 5, inicio: 60, unidad: '°', decimales: 0, color: 'c-o' },
      { id: 'g', etiqueta: 'Giro de arriba', min: -20, max: 20, paso: 2, inicio: 10, unidad: '°', decimales: 0, color: 'c-h' },
    ],
    dibujo: v => ({ datos: secante(v.t, { giro: v.g }), estado: {} }),
    arrastres: [
      arrastreSecante((t, v) => secante(t, { giro: v.g })),
      // Se agarra el extremo derecho de la recta de arriba: gira alrededor de Q.
      { id: 'recta-arriba', etiqueta: 'extremo de la recta de arriba', color: 'c-h',
        donde: v => { const Q = [1.2 / Math.tan(U.rad(v.t)), 2.4]; return enPantalla(secante(v.t, { giro: v.g }), U.polar(Q, 3, v.g)); },
        mover: (pt, v) => {
          const Q = [1.2 / Math.tan(U.rad(v.t)), 2.4], q = alPlano(secante(v.t, { giro: v.g }), pt);
          return { g: U.grados(Math.atan(Math.max(-1e3, Math.min(1e3, (q[1] - Q[1]) / Math.max(q[0] - Q[0], 0.05))))) };
        } },
    ],
    lectura: v => { const m = medidasSecante(v.t, v.g); return ['naranjas ', `${m.abajo}° y ${m.arriba}°   ·   conjugados ${m.abajo + m.conjugado}°${v.g === 0 ? ': paralelas' : ''}`]; },
    // Retos comprobados con las medidas que rotula la figura (medidasSecante).
    invitaciones: [
      { texto: 'Haz que los dos ángulos naranjas vuelvan a ser iguales.',
        logrado: v => { const m = medidasSecante(v.t, v.g); return m.abajo === m.arriba; },
        bien: 'Iguales solo con giro cero: correspondientes iguales garantizan rectas paralelas.' },
      { texto: 'Consigue que los dos naranjas difieran lo más posible.',
        logrado: v => { const m = medidasSecante(v.t, v.g); return Math.abs(m.abajo - m.arriba) === Math.max(-mesaSecante.controles[1].min, mesaSecante.controles[1].max); },
        bien: 'La diferencia es el giro de la recta de arriba, no la secante.' },
      { texto: 'Haz que la secante forme un ángulo recto con la recta de abajo.',
        logrado: v => medidasSecante(v.t, v.g).abajo === 90,
        bien: 'Secante perpendicular. ¿Lo es también a la de arriba? Mira el giro.' },
      { texto: 'Haz que los conjugados internos sumen 170°.',
        logrado: v => { const m = medidasSecante(v.t, v.g); return m.abajo + m.conjugado === 170; },
        bien: 'Sumar menos de 180° delata que las rectas no son paralelas.' },
      { texto: 'Guarda dos casos con el mismo giro y distinta secante. Compara sus naranjas.',
        logrado: (v, gs) => { const d = c => { const m = medidasSecante(c.t, c.g); return m.abajo - m.arriba; };
          return v.g !== 0 && gs.some(c => c.g === v.g && c.t !== v.t && d(c) === d(v)) && gs.some(c => c.g === v.g && c.t === v.t); },
        bien: 'Otra secante, la misma diferencia: la culpa es del giro.' },
    ],
  };
  // Mesa 2: B libre en el plano, no solo en la recta. La idea 1 deja a B fuera de la recta solo en la predicción.
  // El camino A → B → C que dibuja tramosLibre; el rodeo es lo que pasa de AC = 10.
  const camino = v => Math.hypot(v.bx, v.by) + Math.hypot(10 - v.bx, v.by);
  let CAMINO_MAX = 0;   // el mayor de la grilla de la mesa (bx de −2 a 12, by de 0 a 3,5, de 0,5 en 0,5)
  for (let i = 0; i <= 28; i++) for (let j = 0; j <= 7; j++) CAMINO_MAX = Math.max(CAMINO_MAX, camino({ bx: -2 + i / 2, by: j / 2 }));
  const tramosLibre = (bx, by) => Object.assign(tramos(bx, by), { vista: { x: [-3, 13], y: [-1.4, 4.2] } });
  const mesaPunto = {
    id: 'punto-libre', titulo: 'B fuera de la recta', pieza: 'geo-figura',
    consigna: 'Arrastra B por todo el plano. Mira cuánto más largo es el camino por B que el directo de A a C.',
    controles: [
      { id: 'bx', etiqueta: 'B a lo ancho', min: -2, max: 12, paso: 0.5, inicio: 4, unidad: 'cm', decimales: 1, color: 'c-o' },
      { id: 'by', etiqueta: 'B a lo alto', min: 0, max: 3.5, paso: 0.5, inicio: 3, unidad: 'cm', decimales: 1, color: 'c-o' },
    ],
    dibujo: v => ({ datos: tramosLibre(v.bx, v.by), estado: {} }),
    // Se agarra B: se mueve en las dos direcciones.
    arrastres: [{ id: 'punto-b', etiqueta: 'punto B', color: 'c-o',
      donde: v => enPantalla(tramosLibre(v.bx, v.by), [v.bx, v.by]),
      mover: (pt, v) => { const q = alPlano(tramosLibre(v.bx, v.by), pt); return { bx: q[0], by: q[1] }; } }],
    lectura: v => { const s = camino(v); return [AB, ' + ', BC, ` ≈ ${f(s)} cm   ·   rodeo ${f(s - 10)} cm`]; },
    invitaciones: [
      { texto: 'Deja el rodeo en cero: que el camino por B mida igual que AC.',
        logrado: v => Math.abs(camino(v) - 10) < 1e-9,
        bien: 'Rodeo cero solo con B entre A y C. ¿Y si B pasa de C?' },
      { texto: 'Pon B sobre la recta, pero fuera del tramo entre A y C.',
        logrado: v => v.by === 0 && (v.bx < 0 || v.bx > 10),
        bien: 'En la recta y con rodeo: «en la recta» no basta, falta «entre».' },
      { texto: 'Busca el rodeo más grande que permite la mesa.',
        logrado: v => Math.abs(camino(v) - CAMINO_MAX) < 1e-9,
        bien: 'Lejos y alto: el rodeo crece. La suma nunca baja de AC.' },
      { texto: 'Guarda dos casos con el mismo rodeo y B en lugares distintos.',
        logrado: (v, gs) => gs.some(c => (c.bx !== v.bx || c.by !== v.by) && Math.abs(camino(c) - camino(v)) < 1e-9) && gs.some(c => c.bx === v.bx && c.by === v.by),
        bien: 'Mismo rodeo en dos lugares. ¿Están en espejo respecto del medio de AC?' },
    ],
  };

  return {
    unidad: 'geometria.segmentos-y-angulos',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/geo-figura.js'],
    historia: {
      texto: 'Los Elementos de Euclides separan el objeto ideal de su dibujo: el punto no tiene tamaño y una marca de tinta solo lo representa. Una regla sirve para explorar una figura, pero su precisión no prueba una igualdad para todos los casos. Esta unidad hereda esa separación entre dibujar, medir y justificar.',
      pregunta: '¿Basta que dos líneas parezcan paralelas?',
      fuente: { titulo: 'Euclides, Elementos, libro I (edición de D. E. Joyce)', url: 'https://math.clarku.edu/~djoyce/java/elements/bookI/bookI.html' },
    },
    // Laboratorio: la secante con la recta que gira y B libre en el plano son más ricas que sus ideas; la tercera mesa es
    // el quiebre con sus dos manijas.
    // Glosario: las palabras que el curso estrena aquí (docs/teoria.md, 4d). Es la primera unidad de geometría, así que
    // trae el vocabulario de base. Triángulo, altura, hipotenusa y cateto también salen aquí, pero se definen en
    // «Triángulos» y «Congruencia», donde son el tema; el lector los marca igual.
    glosario: [
      { termino: 'arco', def: 'Parte de una circunferencia entre dos de sus puntos. Sirve para medir la abertura de un ángulo.', ver: ['ángulo'] },
      { termino: 'punto', def: 'Lugar exacto, sin tamaño. Se nombra con una letra mayúscula, como A o B.' },
      { termino: 'recta', def: 'Línea derecha sin principio ni fin. Por dos puntos pasa una sola.', ver: ['segmento', 'rayo'] },
      { termino: 'plano', def: 'Superficie lisa que se extiende sin fin en todas direcciones, como una hoja que nunca acaba.' },
      { termino: 'segmento', def: 'Trozo de recta entre dos puntos, sus extremos. Tiene una medida fija.',
        ejemplo: `Con B entre A y C, AB = 4 y BC = 6: AC = ${4 + 6}.`, ver: ['recta'] },
      { termino: 'rayo', def: 'Parte de una recta que empieza en un punto y sigue sin fin hacia un solo lado.', ver: ['ángulo'] },
      { termino: 'ángulo', simbolo: '∠', medida: '°', def: 'Abertura entre dos rayos que salen del mismo punto. Se mide en grados.',
        ejemplo: '∠AOB: el vértice es O y los lados son OA y OB.', ver: ['vértice', 'bisectriz'] },
      { termino: 'vértice', def: 'Punto donde se juntan los lados de un ángulo o de una figura.' },
      { termino: 'ángulo agudo', formas: ['ángulo agudo', 'ángulos agudos', 'agudo', 'agudos'], def: 'El que mide más de 0° y menos de 90°: más cerrado que una esquina.' },
      { termino: 'ángulo recto', formas: ['ángulo recto', 'ángulos rectos'], def: 'El que mide exactamente 90°, como la esquina de una hoja.' },
      { termino: 'ángulo obtuso', formas: ['ángulo obtuso', 'ángulos obtusos', 'obtuso', 'obtusos'], def: 'El que mide más de 90° y menos de 180°: más abierto que una esquina.' },
      { termino: 'ángulo llano', formas: ['ángulo llano', 'ángulos llanos', 'llano'], def: 'El que mide 180°: sus dos lados forman una sola recta.' },
      { termino: 'ángulo no convexo', formas: ['ángulo no convexo', 'ángulos no convexos', 'no convexo'], def: 'El que mide más de 180° y menos de 360°: su abertura rodea por afuera.' },
      { termino: 'bisectriz', def: 'Rayo que parte un ángulo en dos ángulos iguales.', ejemplo: `La de un ángulo de 50° deja dos de ${50 / 2}°.`, ver: ['incentro'] },
      { termino: 'complemento', formas: ['complemento', 'complementos', 'complementarios', 'complementario'],
        def: 'Lo que le falta a un ángulo para llegar a 90°.', ejemplo: `El de 35° es ${90 - 35}°, porque 35° + ${90 - 35}° = 90°.`, ver: ['suplemento'] },
      { termino: 'suplemento', formas: ['suplemento', 'suplementos', 'suplementarios', 'suplementario'],
        def: 'Lo que le falta a un ángulo para llegar a 180°.', ejemplo: `El de 35° es ${180 - 35}°, porque 35° + ${180 - 35}° = 180°.`, ver: ['complemento'] },
      { termino: 'rectas paralelas', simbolo: '∥', formas: ['rectas paralelas', 'paralelas', 'paralela', 'paralelos', 'paralelo'],
        def: 'Rectas de un mismo plano que nunca se cortan, por más que se prolonguen.', ver: ['secante'] },
      { termino: 'secante', def: 'Recta que corta a otras líneas o a una curva. Al cruzar dos paralelas forma ocho ángulos.',
        ver: ['ángulos correspondientes', 'alternos internos', 'conjugados internos'] },
      { termino: 'ángulos correspondientes', formas: ['ángulos correspondientes', 'correspondientes', 'correspondiente'],
        def: 'Los que ocupan el mismo lugar en cada cruce de la secante. Entre paralelas, son iguales.', ver: ['secante'] },
      { termino: 'alternos internos', formas: ['alternos internos', 'alterno interno', 'alternos', 'alterno'],
        def: 'Ángulos entre las dos rectas y a distinto lado de la secante. Entre paralelas, son iguales.', ver: ['conjugados internos'] },
      { termino: 'conjugados internos', formas: ['conjugados internos', 'conjugado interno', 'conjugados', 'conjugado'],
        def: 'Ángulos entre las dos rectas y al mismo lado de la secante. Entre paralelas, suman 180°.',
        ejemplo: `Si uno mide 60°, el otro mide ${180 - 60}°.`, ver: ['alternos internos'] },
      { termino: 'opuestos por el vértice', formas: ['opuestos por el vértice', 'opuesto por el vértice'],
        def: 'Los dos ángulos que quedan frente a frente cuando se cruzan dos rectas. Siempre son iguales.' },
      { termino: 'adyacentes', formas: ['adyacentes', 'adyacente'], def: 'Ángulos que comparten el vértice y un lado, uno al costado del otro, sin encimarse.' },
      { termino: 'línea auxiliar', formas: ['paralela auxiliar', 'línea auxiliar', 'figura auxiliar', 'auxiliar'],
        def: 'Línea extra que se traza en la figura para hacer visible una relación y poder justificarla.' },
    ],
    laboratorio: [mesaSecante, mesaPunto, Object.assign({ id: 'quiebre', titulo: 'El quiebre entre paralelas', pieza: 'geo-figura',
      invitaciones: [
        { texto: 'Haz que el quiebre x mida justo 90°.',
          logrado: v => quiebreX(v) === 90,
          bien: 'Un quiebre recto con a + b = 90°. ¿Cuántas parejas lo logran?' },
        { texto: 'Busca el quiebre más cerrado que permite la mesa.',
          logrado: v => quiebreX(v) === Math.min(...QUIEBRES),
          bien: 'Los dos tramos casi pegados a sus paralelas: x se cierra.' },
        { texto: 'Haz el quiebre simétrico: el mismo ángulo arriba y abajo.',
          logrado: v => v.a === v.b,
          bien: 'Simétrico: la paralela auxiliar parte x en dos mitades iguales.' },
        { texto: 'Guarda dos casos con el mismo quiebre x y distintos a y b.',
          logrado: (v, gs) => gs.some(c => c.a !== v.a && quiebreX(c) === quiebreX(v)) && gs.some(c => c.a === v.a && c.b === v.b),
          bien: 'El mismo x por dos caminos: solo cuenta la suma a + b.' },
      ] }, quiebreIdea.juega)],
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea). Una lista vacía:
    // la mesa no practica ninguna idea de la unidad y va en «Más mesas del tema».
    laboratorioIdeas: {
      'secante-y-giro': ['paralelas'],
      'punto-libre': ['suma-de-segmentos'],
      'quiebre': ['quiebre'],
    },
    ideas: [fuera, aberturaIdea, bisectriz, paralelas, quiebreIdea],
  };
});
