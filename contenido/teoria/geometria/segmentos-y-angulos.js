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
    juega: {
      consigna: 'Mueve el punto B por la recta, también fuera del tramo entre A y C. Compara la suma AB + BC con AC.',
      voz: 'Mueve B y compara las tres medidas, no solo el dibujo.',
      controles: [{ id: 'bx', etiqueta: 'B', min: -2, max: 12, paso: 1, inicio: 4, unidad: 'cm', decimales: 0, color: 'c-o' }],
      dibujo: v => ({ datos: tramos(v.bx), estado: {} }),
      lectura: v => [AB, ' + ', BC, ` = ${f(Math.abs(v.bx) + Math.abs(10 - v.bx))} cm · `, AC, ' = 10 cm'],
      minimo: 3,
    },
    predice: {
      pregunta: ['Ahora B sale de la recta: queda 3 cm arriba del punto que está a 4 cm de A. ¿Cuánto mide ', AB, ' + ', BC, '?'],
      voz: 'Piensa en el camino de A a C pasando por B.',
      opciones: [
        { id: 'c', texto: `${f(dAB + dBC)} cm`, correcta: true },
        { id: 'igual', texto: '10 cm', error: 'GE-SEG1', siFuera: '10 cm sería cierto con B en la recta, entre A y C. Fuera de ella, el camino crece.' },
        { id: 'altura', texto: '13 cm', error: 'GE-SEG2', siFuera: 'Sumar la altura a AC parece razonable, pero cada tramo se mide en diagonal, por separado.' },
        { id: 'nose', texto: 'No se puede saber', error: 'GE-SEG3', siFuera: 'Faltaría un dato si no supiéramos la altura. Con 4, 6 y 3 cm, cada tramo es una hipotenusa.' },
      ],
      dibujo: { datos: tramos(BX, BY), estado: {} },
      revelar: { datos: Object.assign(tramos(BX, BY), { segmentos: tramos(BX, BY).segmentos.map(s => s.de === 'A' && s.a === 'B' ? Object.assign({}, s, { texto: `${f(dAB)} cm` }) : s.de === 'B' ? Object.assign({}, s, { texto: `${f(dBC)} cm` }) : s) }), estado: {} },
      coincide: ['Coincide: 5 + 6,7 ≈ 11,7 cm. El rodeo por B es más largo que ', AC, '.'],
    },
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
        { estado: { corte: 1 }, texto: 'AB es la hipotenusa de un triángulo de catetos 4 y 3.', ecuacion: [AB, ' = ', { raiz: ['4² + 3²'] }, ' = 5 cm'] },
        { estado: { corte: 2 }, texto: 'BC es la hipotenusa de un triángulo de catetos 6 y 3.', ecuacion: [BC, ' = ', { raiz: ['6² + 3²'] }, ` ≈ ${f(dBC)} cm`] },
        { estado: { corte: 3 }, texto: 'El camino por B da un rodeo: la suma pasa de AC.', ecuacion: [AB, ' + ', BC, ` ≈ ${f(dAB + dBC)} > 10 = `, AC] },
        { estado: { corte: 3 }, texto: 'Solo con B sobre AC, entre A y C, desaparece el rodeo.', ecuacion: [AB, ' + ', BC, ' = ', AC] },
      ],
    },
    regla: {
      texto: 'Por dos puntos pasa una sola recta. Si B está en el segmento AC, las medidas se suman exacto; si no, AB + BC es mayor que AC.',
      ecuacion: [AB, ' + ', BC, ' ≥ ', AC],
      condicion: 'la igualdad AB + BC = AC exige que B esté en la recta AC y entre A y C.',
      voz: 'El dibujo sugiere; la condición «entre A y C» lo garantiza.',
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
    juega: {
      consigna: 'Gira el lado OB. Mira cómo cambian la medida y el nombre del ángulo AOB, incluso cuando pasa de 180°.',
      voz: 'Gira OB y fíjate en el nombre que toma cada medida.',
      controles: [{ id: 'g', etiqueta: '∠AOB', min: 0, max: 330, paso: 15, inicio: 45, unidad: '°', decimales: 0, color: 'c-o' }],
      dibujo: v => ({ datos: abertura(v.g), estado: {} }),
      lectura: v => [{ v: 'c-o', t: '∠AOB' }, ` = ${v.g}° · ${clase(v.g)}`],
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
    mira: {
      datos: dosAngulos(1, 2),
      voz: 'Compara aberturas. El largo de los lados queda fuera.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Cada ángulo se mide con el arco entre sus dos lados.', ecuacion: ['∠P = 40° · ', { v: 'c-o', t: '∠Q' }, ' = 65°'] },
        { estado: { corte: 2 }, texto: 'Prolonga los lados de Q: la abertura no cambia.', ecuacion: [{ v: 'c-o', t: '∠Q' }, ' sigue en 65°'] },
        { estado: { corte: 2 }, texto: 'Los dos son agudos: miden más de 0° y menos de 90°.', ecuacion: ['0° < 40° < 65° < 90°'] },
      ],
    },
    regla: {
      texto: 'Un ángulo mide la abertura entre sus lados, no su largo. Es agudo si mide menos de 90°, recto con 90°, obtuso entre 90° y 180°, y llano con 180°.',
      condicion: 'los lados son rayos: prolongarlos no cambia la medida. Más de 180° es un ángulo no convexo.',
      voz: 'Al alargar los lados, la medida permanece. Esa es la clave.',
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
        ? [{ en: 'O', de: 'C', a: 'M', color: 'o', radio: 40, marcas: 1, texto: `${a / 2}°`, desde: Math.min(k, 1) }, { en: 'O', de: 'M', a: 'B', color: 'o', radio: 40, marcas: 1, desde: Math.min(k, 1) },
          { en: 'O', de: 'B', a: 'N', color: 'i', radio: 40, marcas: 2, desde: Math.min(k, 2) }, { en: 'O', de: 'N', a: 'A', color: 'i', radio: 40, marcas: 2, texto: `${(180 - a) / 2}°`, desde: Math.min(k, 2) },
          { en: 'O', de: 'M', a: 'N', color: 'h', texto: '90°', desde: Math.min(k, 3) }]
        : [{ en: 'O', de: 'C', a: 'B', color: 'o', texto: `${a}°`, radio: 30 }, { en: 'O', de: 'B', a: 'A', color: 'i', texto: `${180 - a}°`, radio: 24 }],
    };
  };
  const bisectriz = {
    id: 'bisectrices',
    titulo: 'Mitades que suman noventa',
    temas: ['Bisectriz', 'Ángulos complementarios y suplementarios'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Cambia α. El ángulo β completa la recta AC. Observa qué le pasa a β cuando α crece.',
      voz: 'Mueve α y sigue a β: cambian juntos.',
      controles: [{ id: 'a', etiqueta: 'α', min: 20, max: 160, paso: 10, inicio: 60, unidad: '°', decimales: 0, color: 'c-o' }],
      dibujo: v => ({ datos: par(v.a, false), estado: {} }),
      lectura: v => [al, ` = ${v.a}° · `, be, ` = ${180 - v.a}° · `, al, ' + ', be, ' = 180°'],
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
      ecuacion: ['C(', x, ') = 90° − ', x, '   ·   S(', x, ') = 180° − ', x],
      condicion: 'el complemento existe si x < 90° y el suplemento si x < 180°; el resultado de 90° pide ángulos adyacentes.',
      voz: 'Deshaz las operaciones desde afuera hacia adentro.',
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
  const secante = (t, o = {}) => {
    const giro = o.giro || 0, h = 2.4;
    const dx = h / Math.tan(U.rad(t)), P = [-dx / 2, 0], Q = [dx / 2, h];
    const up = U.polar(Q, 1.6, t), dn = U.polar(P, -1.6, t);
    const R = U.polar(Q, 3, giro), L = U.polar(Q, -3, giro);
    const e = o.etapa === undefined ? 9 : o.etapa;
    const txt = (v, k) => (o.textos === false ? undefined : (e >= k ? `${v}°` : undefined));
    const angs = [
      { en: 'P', de: 'Pd', a: 'Q', color: 'o', texto: txt(t, 0), radio: 24 },
      { en: 'Q', de: 'Qd', a: 'Qu', color: 'o', texto: txt(t - giro, 1), radio: 24, desde: o.pasos ? 1 : 0 },
      { en: 'Q', de: 'Qi', a: 'P', color: 'o', texto: txt(t - giro, 3), radio: 24, desde: o.pasos ? 3 : 0 },
      { en: 'Q', de: 'Qd', a: 'P', color: 'i', texto: txt(180 - t + giro, 4), radio: 30, desde: o.pasos ? 4 : 0 },
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
  const paralelas = {
    id: 'paralelas',
    titulo: 'Paralelas: ángulos iguales y suplementarios',
    temas: ['Rectas paralelas y una secante'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Inclina la secante que corta las dos rectas paralelas. Mira qué ángulos naranjas siguen iguales y cuál turquesa los acompaña.',
      voz: 'Inclina la secante. Comprueba qué pares permanecen iguales.',
      controles: [{ id: 't', etiqueta: 'θ', min: 30, max: 150, paso: 10, inicio: 60, unidad: '°', decimales: 0, color: 'c-o' }],
      dibujo: v => ({ datos: secante(v.t), estado: {} }),
      lectura: v => ['naranjas: ', `${v.t}°`, ' · turquesa: ', `${180 - v.t}°`],
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
      ecuacion: [th, ' (correspondiente) = ', th, ' (alterno)   ·   ', th, ' + ', { v: 'c-i', t: 'β' }, ' = 180°'],
      condicion: 'las rectas son paralelas. Al revés también vale: si dos correspondientes son iguales, las rectas son paralelas.',
      voz: 'Primero la condición de paralelas; después las igualdades.',
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
  const quiebreIdea = {
    id: 'quiebre',
    titulo: 'El quiebre entre paralelas',
    temas: ['Rectas paralelas y una secante'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'La línea TVB se quiebra entre dos paralelas. Cambia los ángulos a y b, y compara el quiebre x con su suma.',
      voz: 'Cambia a y b. Mira cómo responde x.',
      controles: [
        { id: 'a', etiqueta: 'a', min: 20, max: 70, paso: 5, inicio: 40, unidad: '°', decimales: 0, color: 'c-o' },
        { id: 'b', etiqueta: 'b', min: 20, max: 70, paso: 5, inicio: 30, unidad: '°', decimales: 0, color: 'c-i' },
      ],
      dibujo: v => ({ datos: quiebre(v.a, v.b, { x: true }), estado: {} }),
      lectura: v => [cx, ` = ${v.a + v.b}° · `, ca, ' + ', cb, ` = ${v.a + v.b}°`],
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
      ecuacion: [cx, ' = ', ca, ' + ', cb],
      condicion: 'las rectas son paralelas y a y b se miden del lado donde está el vértice del quiebre.',
      voz: 'Una paralela auxiliar convierte el quiebre en dos alternos.',
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

  return {
    unidad: 'geometria.segmentos-y-angulos',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/geo-figura.js'],
    historia: {
      texto: 'Los Elementos de Euclides separan el objeto ideal de su dibujo: el punto no tiene tamaño y una marca de tinta solo lo representa. Una regla sirve para explorar una figura, pero su precisión no prueba una igualdad para todos los casos. Esta unidad hereda esa separación entre dibujar, medir y justificar.',
      pregunta: '¿Basta que dos líneas parezcan paralelas?',
      fuente: { titulo: 'Euclides, Elementos, libro I (edición de D. E. Joyce)', url: 'https://math.clarku.edu/~djoyce/java/elements/bookI/bookI.html' },
    },
    ideas: [fuera, aberturaIdea, bisectriz, paralelas, quiebreIdea],
  };
});
