/*
 * Teoría de «Simetría en el plano y en el espacio» (geometria.simetria). Molde: docs/teoria.md.
 * Fuente: docs/teoria/matriz/geometria.json (unidad 10); programa de Erlangen (Klein, 1872): una transformación se
 * estudia por lo que conserva.
 * Compañera: Neri (nutria). Pieza: geo-figura.
 *
 * Ficha de tarea
 *   Promesa: construir el simétrico de un punto con su condición (eje mediatriz, centro punto medio, plano mediador) y
 *     saber qué conserva cada simetría: distancias siempre; la orientación, solo la central.
 *   Persona y condiciones: postulante de 4.º de secundaria, celular a 360 px, sin audio, quizás sin conexión.
 *   Resultado observable: halla simétricos en coordenadas respecto de ejes, rectas y puntos; compone reflexiones;
 *     cuenta planos de simetría de sólidos.
 *   Orden de atención: 1.º la figura y su lectura · 2.º la pregunta · acción: «Comprobar» · fondo: Neri.
 *   Estados: jugando · predicción sin elegir · comprobada · paso de «Mira» · regla · caso nuevo.
 *   Duda que resuelve: «¿reflejar es trasladar al otro lado?»: no; se invierte la orientación.
 *
 * Colores: figura original turquesa (c-i), imagen naranja (c-o), eje, centro o plano verde (c-d), lo pedido rojo (c-h).
 * Códigos: GE9; GE-SIM son hipótesis nuevas (la matriz: «trasladar al otro lado sin invertir orientación»).
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
  const f = (n, d = 2) => Kit.formatear(n, d);
  const par = p => `(${f(p[0])}; ${f(p[1])})`;
  const tri = p => `(${f(p[0])}; ${f(p[1])}; ${f(p[2])})`;
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = l => l[Math.floor(r() * l.length)];
    return r;
  }
  const pt = (id, p, o = {}) => Object.assign({ id, x: p[0], y: p[1], z: p[2] }, o);
  // Letra F (asimétrica): permite ver si la imagen quedó invertida o solo girada.
  const F = [[0, 0], [0.6, 0], [0.6, 1.4], [1.6, 1.4], [1.6, 2], [0.6, 2], [0.6, 2.6], [2, 2.6], [2, 3.2], [0, 3.2]];
  const mueve = (pts, dx, dy) => pts.map(([x, y]) => [x + dx, y + dy]);
  const opcionesTexto = (bien, malos) => {
    const vistos = new Set([bien]), ops = [{ id: 'c', texto: bien, correcta: true }];
    for (const m of malos) if (!vistos.has(m.texto) && ops.length < 4) { vistos.add(m.texto); ops.push(Object.assign({ id: m.id }, m)); }
    return ops;
  };

  // ---------- Idea 1: simetría respecto de una recta ----------
  // Cambia: la posición del eje · Permanece: la letra F · Progresa: cada punto y su imagen a igual distancia ·
  // Se reserva: un eje oblicuo · Debe verse: el eje es la mediatriz de cada segmento PP′ y la letra queda al revés.
  const axial = k => {
    const orig = mueve(F, -4, -1.6), img = orig.map(([x, y]) => [2 * k - x, y]);
    const P = orig[7], Pp = img[7];
    return {
      alt: `Letra F y su reflejo en la recta vertical x = ${k}: cada punto queda a la misma distancia del eje, y la F queda al revés`,
      vista: { x: [-4.6, 7.6], y: [-2.2, 2.4] }, cuadricula: { paso: 1 },
      puntos: [pt('P', P, { rotulo: 'P', color: 'i', lado: 90 }), pt('Q', Pp, { rotulo: "P'", color: 'o', lado: 90 }), pt('e1', [k, -2.2], { sinPunto: true }), pt('e2', [k, 2.4], { sinPunto: true }), pt('M', [k, P[1]], { sinPunto: true })],
      regiones: [{ puntos: orig, color: 'i', opacidad: 0.3, sinBorde: false }, { puntos: img, color: 'o', opacidad: 0.3, sinBorde: false }],
      segmentos: [{ de: 'e1', a: 'e2', color: 'd', grosor: 'variable' }, { de: 'P', a: 'M', discontinua: true, grosor: 'fino', marcas: 1 }, { de: 'M', a: 'Q', discontinua: true, grosor: 'fino', marcas: 1 }],
    };
  };
  const oblicua = (o = {}) => {
    const P = [5, 1], Q = [1, 5], M = [3, 3], k = o.pasos || {};
    return {
      alt: o.alt || 'Punto P(5; 1) y la recta y = x; su simétrico es P′(1; 5)',
      vista: { x: [-1, 6.6], y: [-1, 6.4] }, cuadricula: { paso: 1 }, ejes: true,
      puntos: [pt('P', P, { rotulo: 'P(5; 1)', color: 'i', lado: -30 }), pt('e1', [-1, -1], { sinPunto: true }), pt('e2', [6.2, 6.2], { sinPunto: true }),
        ...(o.sol ? [pt('M', M, { rotulo: 'M(3; 3)', lado: 0, desde: k.m || 0 }), pt('Q', Q, { rotulo: "P'(1; 5)", color: 'o', lado: 150, desde: k.q || 0 })] : [])],
      segmentos: [{ de: 'e1', a: 'e2', color: 'd', grosor: 'variable' },
        ...(o.sol ? [{ de: 'P', a: 'M', discontinua: true, marcas: 1, desde: k.m || 0 }, { de: 'M', a: 'Q', discontinua: true, marcas: 1, desde: k.q || 0 }] : [])],
      angulos: o.sol ? [{ en: 'M', de: 'e2', a: 'P', color: 'd', desde: k.m || 0 }] : [],
      rotulos: [{ x: 5.4, y: 6.2, texto: 'y = x', color: 'd' }],
    };
  };
  const axialIdea = {
    id: 'simetria-axial',
    titulo: 'El eje es la mediatriz',
    temas: ['Simetría respecto de una recta'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'La letra F se refleja en la recta verde. Mueve el eje y compara cada punto con su imagen: distancia y orientación.',
      voz: 'Mueve el eje. Fíjate hacia dónde mira la letra reflejada.',
      controles: [{ id: 'k', etiqueta: 'eje x =', min: -1, max: 2, paso: 0.5, inicio: 0, unidad: '', decimales: 1, color: 'c-d' }],
      dibujo: v => ({ datos: axial(v.k), estado: {} }),
      lectura: v => [`P a ${f(v.k + 2)} del eje · P′ a ${f(v.k + 2)} · F al revés`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Ahora el eje es la recta inclinada y = x. ¿Cuál es el simétrico de P(5; 1)?',
      voz: 'Piensa en la perpendicular al eje, no en la vertical.',
      opciones: [
        { id: 'c', texto: "P'(1; 5)", correcta: true },
        { id: 'eje-x', texto: "P'(5; −1)", error: 'GE-SIM1', siFuera: '(5; −1) sería el reflejo en el eje x. Aquí el eje es la recta y = x.' },
        { id: 'eje-y', texto: "P'(−5; 1)", error: 'GE-SIM1', siFuera: '(−5; 1) sería el reflejo en el eje y.' },
        { id: 'centro', texto: "P'(−5; −1)", error: 'GE-SIM2', siFuera: '(−5; −1) es el simétrico respecto del origen, un punto.' },
      ],
      dibujo: { datos: oblicua(), estado: {} },
      revelar: { datos: oblicua({ sol: true }), estado: {} },
      coincide: 'Coincide: reflejar en y = x intercambia las coordenadas.',
    },
    mira: {
      datos: oblicua({ sol: true, pasos: { m: 1, q: 2 } }),
      voz: 'Perpendicular al eje, misma distancia al otro lado.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Desde P, la perpendicular al eje lo corta en M(3; 3).', ecuacion: ['PM ⟂ eje'] },
        { estado: { corte: 2 }, texto: 'P′ queda a la misma distancia de M, del otro lado.', ecuacion: ["P' = 2M − P = (6 − 5; 6 − 1) = (1; 5)"] },
        { estado: { corte: 2 }, texto: 'El eje resulta mediatriz de PP′.', ecuacion: ["PM = MP' · PP' ⟂ eje"] },
      ],
    },
    regla: {
      texto: 'En la simetría respecto de una recta, el eje es la mediatriz de cada segmento PP′. Se conservan distancias y ángulos, pero la orientación se invierte.',
      ecuacion: ["eje x: (x; y) → (x; −y) · eje y: (−x; y) · y = x: (y; x)"],
      condicion: 'P′ está en la perpendicular al eje que pasa por P, a la misma distancia del eje y del otro lado.',
      voz: 'Una figura reflejada no se superpone con solo moverla.',
    },
    ahoraTu: {
      voz: 'Identifica el eje y aplica su regla a las coordenadas.',
      generar(s) {
        const r = azar(s), P = [r.ent(-6, 6) || 2, r.ent(-6, 6) || 3], t = s % 4;
        const ejes = [['el eje x', p => [p[0], -p[1]]], ['el eje y', p => [-p[0], p[1]]], ['la recta y = x', p => [p[1], p[0]]], [`la recta x = ${(s % 5) - 2}`, p => [2 * ((s % 5) - 2) - p[0], p[1]]]];
        const [nom, fun] = ejes[t], bien = fun(P);
        const malos = [{ id: 'm0', p: [P[0], -P[1]], e: 'el eje x' }, { id: 'm1', p: [-P[0], P[1]], e: 'el eje y' }, { id: 'm2', p: [P[1], P[0]], e: 'la recta y = x' }, { id: 'm3', p: [-P[0], -P[1]], e: 'el origen' }];
        return {
          pregunta: [`¿Cuál es el simétrico de P${par(P)} respecto de ${nom}?`],
          opciones: opcionesTexto(par(bien), malos.map(m => ({ id: m.id, texto: par(m.p), error: m.id === 'm3' ? 'GE-SIM2' : 'GE-SIM1', siFuera: `Ese sería el simétrico respecto de ${m.e}.` }))),
          solucion: { texto: 'Perpendicular al eje y misma distancia del otro lado.', ecuacion: [`P' = ${par(bien)}`] },
        };
      },
    },
  };

  // ---------- Idea 2: simetría respecto de un punto ----------
  // Cambia: la posición del centro O · Permanece: la letra F · Progresa: O como punto medio de cada PP′ ·
  // Se reserva: dos reflexiones seguidas · Debe verse: la simetría central es un giro de 180° y no invierte la letra.
  const central = (ox, oy) => {
    const orig = mueve(F, -3.4, -1.4), img = orig.map(([x, y]) => [2 * ox - x, 2 * oy - y]), P = orig[7], Pp = img[7];
    return {
      alt: `Letra F y su simétrica respecto del punto O(${f(ox)}; ${f(oy)}): O es el punto medio de cada PP′, y la F queda girada media vuelta`,
      vista: { x: [-3.8, 5.2], y: [-3.4, 3.6] }, cuadricula: { paso: 1 },
      puntos: [pt('O', [ox, oy], { rotulo: 'O', color: 'd', lado: -45 }), pt('P', P, { rotulo: 'P', color: 'i', lado: 90 }), pt('Q', Pp, { rotulo: "P'", color: 'o', lado: -90 })],
      regiones: [{ puntos: orig, color: 'i', opacidad: 0.3, sinBorde: false }, { puntos: img, color: 'o', opacidad: 0.3, sinBorde: false }],
      segmentos: [{ de: 'P', a: 'O', discontinua: true, grosor: 'fino', marcas: 1 }, { de: 'O', a: 'Q', discontinua: true, grosor: 'fino', marcas: 1 }],
    };
  };
  const dos = (o = {}) => {
    const orig = mueve(F, 0.6, 0.4), r1 = orig.map(([x, y]) => [-x, y]), r2 = r1.map(([x, y]) => [x, -y]), k = o.pasos || {};
    return {
      alt: o.alt || 'Letra F reflejada primero en el eje y y después en el eje x: el resultado es la F girada 180° alrededor del origen',
      vista: { x: [-3.4, 3.4], y: [-4, 4] }, cuadricula: { paso: 1 }, ejes: true,
      puntos: [pt('O', [0, 0], { rotulo: 'O', color: 'd', lado: -45 })],
      regiones: [{ puntos: orig, color: 'i', opacidad: 0.3, sinBorde: false }, { puntos: r1, color: 'd', opacidad: 0.15, discontinua: true, desde: k.r1 || 0 }, ...(o.final === false ? [] : [{ puntos: r2, color: 'o', opacidad: 0.3, sinBorde: false, desde: k.r2 || 0 }])],
      rotulos: [{ x: 1.8, y: 3.9, texto: '1', color: 'i' }, { x: -1.8, y: 3.9, texto: '2', color: 'd', desde: k.r1 || 0 }, ...(o.final === false ? [] : [{ x: -1.8, y: -3.9, texto: '3', color: 'o', desde: k.r2 || 0 }])],
    };
  };
  const centralIdea = {
    id: 'simetria-central',
    titulo: 'Simetría central: media vuelta',
    temas: ['Simetría respecto de un punto'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'La letra F tiene su simétrica respecto del punto O. Mueve O y comprueba que O queda en la mitad de cada segmento PP′.',
      voz: 'Mueve O. Compara la letra imagen con la original.',
      controles: [
        { id: 'ox', etiqueta: 'O a lo ancho', min: -1, max: 1, paso: 0.5, inicio: 0, unidad: '', decimales: 1, color: 'c-d' },
        { id: 'oy', etiqueta: 'O a lo alto', min: -1, max: 1, paso: 0.5, inicio: 0, unidad: '', decimales: 1, color: 'c-d' },
      ],
      dibujo: v => ({ datos: central(v.ox, v.oy), estado: {} }),
      lectura: v => [`O(${f(v.ox)}; ${f(v.oy)}) punto medio de PP′ · F girada`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Reflejamos la letra F en el eje y y luego el resultado en el eje x. ¿Qué transformación lleva la F original a la final?',
      voz: 'Dos reflejos: piensa cómo queda la orientación al final.',
      opciones: [
        { id: 'c', texto: 'Un giro de 180° alrededor del origen', correcta: true },
        { id: 'refl', texto: 'Una reflexión en otra recta', error: 'GE-SIM3', siFuera: 'Una reflexión invierte la letra. Dos reflexiones la devuelven derecha.' },
        { id: 'tras', texto: 'Una traslación', error: 'GE-SIM3', siFuera: 'Dos reflexiones en ejes paralelos dan traslación; aquí los ejes se cortan.' },
      ],
      dibujo: { datos: dos({ final: false }), estado: {} },
      revelar: { datos: dos(), estado: {} },
      coincide: 'Coincide: la F final es la original girada media vuelta en O.',
    },
    mira: {
      datos: dos({ pasos: { r1: 1, r2: 2 } }),
      voz: 'Sigue un punto por los dos reflejos.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Reflejar en el eje y cambia el signo de x: la F se invierte.', ecuacion: ['(x; y) → (−x; y)'] },
        { estado: { corte: 2 }, texto: 'Reflejar en el eje x cambia el signo de y; la F vuelve derecha.', ecuacion: ['(−x; y) → (−x; −y)'] },
        { estado: { corte: 2 }, texto: 'El resultado es la simetría respecto del origen: un giro de 180°.', ecuacion: ['(x; y) → (−x; −y)'] },
      ],
    },
    regla: {
      texto: 'En la simetría respecto de un punto O, O es el punto medio de cada segmento PP′. Equivale a girar 180° alrededor de O: conserva la orientación.',
      ecuacion: ["P' = 2O − P   ·   respecto del origen: (x; y) → (−x; −y)"],
      condicion: 'O, P y P′ están alineados con OP = OP′. Dos reflexiones en rectas perpendiculares que se cortan en O dan esta simetría.',
      voz: 'Media vuelta: la figura no queda al revés.',
    },
    ahoraTu: {
      voz: 'O es el punto medio: el doble de O menos P.',
      generar(s) {
        const r = azar(s), P = [r.ent(-6, 6), r.ent(-6, 6)], O = [r.ent(-3, 3), r.ent(-3, 3)];
        if (s % 2 === 0) {
          const bien = [2 * O[0] - P[0], 2 * O[1] - P[1]];
          return {
            pregunta: [`¿Cuál es el simétrico de P${par(P)} respecto del punto O${par(O)}?`],
            opciones: opcionesTexto(par(bien), [
              { id: 'medio', texto: par([(P[0] + O[0]) / 2, (P[1] + O[1]) / 2]), error: 'GE-SIM4', siFuera: 'Ese es el punto medio de P y O; O debe ser el punto medio de P y P′.' },
              { id: 'resta', texto: par([O[0] - P[0], O[1] - P[1]]), error: 'GE-SIM4', siFuera: 'O − P da el vector de P a O; falta sumarlo a O.' },
              { id: 'origen', texto: par([-P[0], -P[1]]), error: 'GE-SIM2', siFuera: 'Ese es el simétrico respecto del origen, no de O.' },
            ]),
            solucion: { texto: 'O es el punto medio de PP′.', ecuacion: [`P' = 2O − P = ${par(bien)}`] },
          };
        }
        const Q = [2 * O[0] - P[0], 2 * O[1] - P[1]];
        return {
          pregunta: [`P${par(P)} y P′${par(Q)} son simétricos respecto de un punto. ¿Cuál es ese punto?`],
          opciones: opcionesTexto(par(O), [
            { id: 'suma', texto: par([P[0] + Q[0], P[1] + Q[1]]), error: 'GE-SIM4', siFuera: 'Falta dividir entre 2: el centro es el punto medio.' },
            { id: 'resta', texto: par([(Q[0] - P[0]) / 2, (Q[1] - P[1]) / 2]), error: 'GE-SIM4', siFuera: 'Esa es la mitad del vector PP′, no el punto medio.' },
            { id: 'origen', texto: '(0; 0)', error: 'GE-SIM2', siFuera: 'El origen sería el centro solo si P′ = (−x; −y) de P.' },
          ]),
          solucion: { texto: 'El centro es el punto medio de PP′.', ecuacion: [`O = (P + P') / 2 = ${par(O)}`] },
        };
      },
    },
  };

  // ---------- Idea 3: simetría respecto de un plano ----------
  // Cambia: la altura de P sobre el plano · Permanece: el plano horizontal · Progresa: P′ a la misma distancia, abajo ·
  // Se reserva: los planos de simetría del cubo · Debe verse: se conserva la proyección y cambia el lado.
  const TD = { giro: -30, alza: 22 };
  const planoFig = (h, x) => {
    const P = [x, h, 0.6], Pp = [x, -h, 0.6], H = [x, 0, 0.6];
    return {
      alt: `Punto P a ${f(h)} sobre el plano y su simétrico P′ a ${f(h)} debajo, en la misma perpendicular`,
      tresD: TD, vista: { x: [-3.6, 3.6], y: [-3.6, 3.4] },
      puntos: [pt('P', P, { rotulo: 'P', color: 'i', lado: 0 }), pt('Q', Pp, { rotulo: "P'", color: 'o', lado: 0 }), pt('H', H, { rotulo: 'H', lado: 200 })],
      regiones: [{ puntos: [[-2.5, 0, -2], [2.5, 0, -2], [2.5, 0, 2], [-2.5, 0, 2]], color: 'd', opacidad: 0.16, sinBorde: false }],
      segmentos: [{ de: 'P', a: 'H', color: 'i', grosor: 'variable', texto: f(h) }, { de: 'H', a: 'Q', color: 'o', grosor: 'variable', discontinua: true, texto: f(h) }],
    };
  };
  const C3 = [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]];
  const CARAS = [['P4', 'P5', 'P6', 'P7'], ['P1', 'P0', 'P3', 'P2'], ['P5', 'P1', 'P2', 'P6'], ['P0', 'P4', 'P7', 'P3'], ['P7', 'P6', 'P2', 'P3'], ['P0', 'P1', 'P5', 'P4']];
  const cubo = (o = {}) => {
    const k = o.pasos || {};
    const planos = o.planos ? [
      { puntos: [[0, -1.3, -1.3], [0, 1.3, -1.3], [0, 1.3, 1.3], [0, -1.3, 1.3]], color: 'i', opacidad: 0.22, discontinua: true, desde: k.p1 || 0, hasta: k.h1 },
      { puntos: [[-1.3, 0, -1.3], [1.3, 0, -1.3], [1.3, 0, 1.3], [-1.3, 0, 1.3]], color: 'i', opacidad: 0.22, discontinua: true, desde: k.p1 || 0, hasta: k.h1 },
      { puntos: [[-1.3, -1.3, 0], [1.3, -1.3, 0], [1.3, 1.3, 0], [-1.3, 1.3, 0]], color: 'i', opacidad: 0.22, discontinua: true, desde: k.p1 || 0, hasta: k.h1 },
      { puntos: [[-1, -1, -1], [1, -1, 1], [1, 1, 1], [-1, 1, -1]], color: 'o', opacidad: 0.25, discontinua: true, desde: k.p2 || 0 },
      { puntos: [[-1, -1, 1], [1, -1, -1], [1, 1, -1], [-1, 1, 1]], color: 'o', opacidad: 0.25, discontinua: true, desde: k.p2 || 0 },
    ] : [];
    return {
      alt: o.alt || 'Cubo con sus planos de simetría: tres paralelos a las caras y seis que pasan por aristas opuestas',
      tresD: TD, vista: { x: [-2, 2], y: [-2, 2] },
      puntos: C3.map(([x, y, z], i) => pt('P' + i, [x, y, z], { sinPunto: true })),
      solidos: [{ caras: CARAS, color: 'd' }], regiones: planos,
    };
  };
  const planoIdea = {
    id: 'simetria-plano',
    titulo: 'Reflejo en un plano',
    temas: ['Simetría respecto de un plano'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'P está sobre un plano horizontal. Su simétrico P′ queda del otro lado. Cambia la altura de P y su posición, y compara las distancias.',
      voz: 'Sube y corre P. Mira la perpendicular al plano.',
      controles: [
        { id: 'h', etiqueta: 'altura de P', min: 0.5, max: 2.5, paso: 0.5, inicio: 1.5, unidad: '', decimales: 1, color: 'c-i' },
        { id: 'x', etiqueta: 'P a lo ancho', min: -1.5, max: 1.5, paso: 0.5, inicio: 0, unidad: '', decimales: 1 },
      ],
      dibujo: v => ({ datos: planoFig(v.h, v.x), estado: {} }),
      lectura: v => [`P a ${f(v.h)} arriba · P′ a ${f(v.h)} abajo · misma proyección H`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Un plano de simetría parte un sólido en dos mitades que son reflejo una de la otra. ¿Cuántos planos de simetría tiene un cubo?',
      voz: 'Cuenta por clases: así no se te escapa ninguno.',
      opciones: [
        { id: 'c', texto: '9', correcta: true },
        { id: 'tres', texto: '3', error: 'GE-SIM5', siFuera: '3 son los paralelos a las caras. Faltan los que pasan por aristas opuestas.' },
        { id: 'seis', texto: '6', error: 'GE-SIM5', siFuera: '6 son los diagonales. Faltan los tres paralelos a las caras.' },
        { id: 'doce', texto: '12', error: 'GE-SIM5', siFuera: 'Hay 12 aristas, pero cada plano diagonal pasa por dos de ellas.' },
      ],
      dibujo: { datos: cubo(), estado: {} },
      revelar: { datos: cubo({ planos: true }), estado: {} },
      coincide: 'Coincide: 3 paralelos a las caras más 6 por aristas opuestas.',
    },
    mira: {
      datos: cubo({ planos: true, pasos: { p1: 1, h1: 1, p2: 2 } }),
      voz: 'Primero una clase de planos; después la otra.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Tres planos paralelos a las caras, por el centro.', ecuacion: ['3'] },
        { estado: { corte: 2 }, texto: 'Planos por dos aristas opuestas: 12 aristas forman 6 pares.', ecuacion: ['6 (dos se dibujan)'] },
        { estado: { corte: 2 }, texto: 'En total, nueve planos de simetría.', ecuacion: ['3 + 6 = 9'] },
      ],
    },
    regla: {
      texto: 'En la simetría respecto de un plano, P y P′ están en la misma perpendicular al plano, a la misma distancia y en lados opuestos. Comparten su proyección.',
      ecuacion: ['respecto del plano xy: (x; y; z) → (x; y; −z)'],
      condicion: 'el plano es el plano mediador de PP′. Un sólido es simétrico si coincide con su reflejo como conjunto.',
      voz: 'La proyección no cambia; cambia el lado del plano.',
    },
    ahoraTu: {
      voz: 'Decide qué coordenada cambia de signo, o cuenta planos por clases.',
      generar(s) {
        const r = azar(s);
        if (s % 2 === 0) {
          const P = [r.ent(-5, 5) || 1, r.ent(-5, 5) || 2, r.ent(-5, 5) || 3], t = r.ent(0, 2);
          const nom = ['xy', 'yz', 'xz'][t], fun = [p => [p[0], p[1], -p[2]], p => [-p[0], p[1], p[2]], p => [p[0], -p[1], p[2]]];
          return {
            pregunta: [`¿Cuál es el simétrico de P${tri(P)} respecto del plano ${nom}?`],
            opciones: opcionesTexto(tri(fun[t](P)), [0, 1, 2].filter(i => i !== t).map(i => ({ id: 'p' + i, texto: tri(fun[i](P)), error: 'GE-SIM1', siFuera: `Ese sería el simétrico respecto del plano ${['xy', 'yz', 'xz'][i]}.` })).concat([{ id: 'o', texto: tri(P.map(v => -v)), error: 'GE-SIM2', siFuera: 'Ese es el simétrico respecto del origen, un punto.' }])),
            solucion: { texto: `Cambia de signo la coordenada que no está en el plano ${nom}.`, ecuacion: [`P' = ${tri(fun[t](P))}`] },
          };
        }
        const solidos = [['un prisma recto de base cuadrada (no cubo)', 5], ['un ortoedro de tres medidas distintas', 3], ['un prisma hexagonal regular', 7], ['una pirámide regular de base cuadrada', 4], ['una pirámide regular de base triangular', 3], ['un prisma triangular regular', 4], ['una pirámide regular de base hexagonal', 6]];
        const [nom, n] = solidos[r.ent(0, solidos.length - 1)];
        return {
          pregunta: [`¿Cuántos planos de simetría tiene ${nom}?`],
          opciones: [{ id: 'c', texto: `${n}`, correcta: true }, ...[n - 1, n + 1, n + 3].filter(x => x > 0).slice(0, 3).map((x, i) => ({ id: 'm' + i, texto: `${x}`, error: 'GE-SIM5', siFuera: `${x} cuenta de más o de menos: separa verticales y horizontales.` }))],
          solucion: { texto: 'Cuenta los planos verticales por cada eje de la base y agrega el horizontal si los extremos son iguales.', ecuacion: [`${n} planos`] },
        };
      },
    },
  };

  return {
    unidad: 'geometria.simetria',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/geo-figura.js'],
    historia: {
      texto: 'La simetría aparece en muchas prácticas visuales y no tiene un único inventor. Un cambio bien documentado es el programa de Erlangen de Felix Klein, en 1872: organizar las geometrías según las transformaciones y lo que estas conservan. Así, una reflexión importa por lo que hace con puntos, distancias y orientación, no solo por verse bonita.',
      pregunta: '¿Qué conserva una reflexión y qué cambia?',
      fuente: { titulo: 'K. S. Kedlaya, Geometry Unbound, cap. 3 (transformaciones)', url: 'https://kskedlaya.org/geometryunbound/gu-060118.pdf' },
    },
    ideas: [axialIdea, centralIdea, planoIdea],
  };
});
