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
  // Gesto directo (docs/teoria.md §4b): la manija vive en el viewBox de geo-figura; aPlano la vuelve coordenadas del
  // problema (sobreRecta, en 3D) y el lector ajusta cada valor al paso y al rango de su control.
  const enPantalla = (datos, p) => G.aPantalla(datos, p);
  const alPlano = (datos, pt) => G.aPlano(datos, pt);
  const SEP = '   ·   ';
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
      // Se agarra el eje (una manija arriba, sobre la recta verde) y se corre a lo ancho.
      arrastres: [{ id: 'eje', etiqueta: 'eje de simetría', color: 'c-d',
        donde: v => enPantalla(axial(v.k), [v.k, 1.8]),
        mover: (pt, v) => ({ k: alPlano(axial(v.k), pt)[0] }) }],
      lectura: v => [`P a ${f(v.k - axial(v.k).puntos[0].x)} del eje`, SEP, `P′ a ${f(axial(v.k).puntos[1].x - v.k)}`, SEP, 'F al revés'],
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
    // Hallazgo 9: son dos representaciones a propósito. El juego usa un eje vertical (se mide a lo ancho); «Mira»
    // resuelve el caso reservado de la predicción, el eje oblicuo y = x, donde ya no basta medir a lo ancho.
    // El laboratorio («Espejo que gira») junta los dos: la misma F con el eje a cualquier ángulo.
    mira: {
      datos: oblicua({ sol: true, pasos: { m: 1, q: 2 } }),
      voz: 'Perpendicular al eje, misma distancia al otro lado.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Desde P, la perpendicular al eje lo corta en M(3; 3).', ecuacion: ['PM ⟂ eje'] },
        { estado: { corte: 2 }, texto: 'P′ queda a la misma distancia de M, del otro lado.', ecuacion: ["P' = 2M − P = (6 − 5; 6 − 1) = (1; 5)"] },
        { estado: { corte: 2 }, texto: 'El eje resulta mediatriz de PP′.', ecuacion: ["PM = MP'", SEP, "PP' ⟂ eje"] },
      ],
    },
    regla: {
      texto: 'En la simetría respecto de una recta, el eje de simetría es la mediatriz de cada segmento PP′. Se conservan distancias y ángulos, pero la orientación se invierte.',
      ecuacion: ['eje x: (x; y) → (x; −y)', SEP, 'eje y: (−x; y)', SEP, 'y = x: ', { llave: ['(y; x)'], nota: 'se intercambian', color: 'c-o' }],
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
      // Se agarra el centro O: la F imagen gira media vuelta alrededor de donde lo sueltes.
      arrastres: [{ id: 'centro', etiqueta: 'centro O', color: 'c-d',
        donde: v => enPantalla(central(v.ox, v.oy), [v.ox, v.oy]),
        mover: (pt, v) => { const q = alPlano(central(v.ox, v.oy), pt); return { ox: q[0], oy: q[1] }; } }],
      lectura: v => [`O(${f(v.ox)}; ${f(v.oy)}): punto medio de PP′`, SEP, 'F girada'],
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
    // Hallazgo 9: dos representaciones a propósito. El juego muestra la simetría central ya hecha; «Mira» resuelve la
    // predicción (dos reflexiones seguidas) con la misma letra F y los mismos colores: original turquesa, final naranja.
    // La mesa «Dos espejos» del laboratorio deja mover los dos espejos y llegar a la media vuelta con 90°.
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
      texto: 'En la simetría central, respecto de un punto O, O es el punto medio de cada segmento PP′. Equivale a girar 180° alrededor de O: conserva la orientación.',
      ecuacion: ["P' = ", { llave: ['2O − P'], nota: 'O al medio', color: 'c-d' }, SEP, 'origen: (x; y) → ', { llave: ['(−x; −y)'], nota: 'ambos cambian', color: 'c-o' }],
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
      // En 3D: se agarra P y se sube o baja por su perpendicular al plano (mueve la altura), y se agarra su proyección H
      // para correrla sobre el plano (mueve P a lo ancho). sobreRecta lee el dedo a lo largo de cada dirección.
      arrastres: [
        { id: 'punto-p', etiqueta: 'punto P, sube o baja', color: 'c-i',
          donde: v => enPantalla(planoFig(v.h, v.x), [v.x, v.h, 0.6]),
          mover: (pt, v) => ({ h: G.sobreRecta(planoFig(v.h, v.x), [v.x, 0, 0.6], [v.x, 1, 0.6], pt) }) },
        { id: 'pie-h', etiqueta: 'proyección H, sobre el plano', color: 'c-d',
          donde: v => enPantalla(planoFig(v.h, v.x), [v.x, 0, 0.6]),
          mover: (pt, v) => ({ x: G.sobreRecta(planoFig(v.h, v.x), [0, 0, 0.6], [1, 0, 0.6], pt) }) },
      ],
      lectura: v => [`P a ${f(v.h)} arriba`, SEP, `P′ a ${f(v.h)} abajo`, SEP, 'misma H'],
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
    // Hallazgo 9: dos representaciones a propósito. El juego refleja un punto (qué hace la simetría); «Mira» resuelve la
    // predicción, que pregunta por los planos de simetría de un cubo (qué sólidos coinciden con su reflejo).
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
      ecuacion: ['plano xy: (x; y; z) → ', { llave: ['(x; y; −z)'], nota: 'z cambia signo', color: 'c-o' }],
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


  // ---------- Laboratorio: juego libre, sin preguntas ----------
  // Reflejo de q en la recta que pasa por A con dirección de a grados: A + R(q − A), con R la matriz de reflexión.
  const refleja = (q, A, a) => {
    const c = Math.cos(U.rad(2 * a)), sn = Math.sin(U.rad(2 * a)), x = q[0] - A[0], y = q[1] - A[1];
    return [A[0] + c * x + sn * y, A[1] + sn * x - c * y];
  };
  // F más chica (tres cuartos), para que la F y su imagen quepan juntas con el eje a cualquier ángulo.
  const F34 = F.map(([x, y]) => [0.75 * x, 0.75 * y]);
  // Mesa 1, más rica que la idea 1: el eje pasa por el origen y gira (el caso oblicuo que la idea reserva), y la F se
  // arrastra a cualquier lado. P es la esquina de arriba a la derecha; la lectura da el ángulo del eje y PM = MP′.
  const espejoGira = (a, fx, fy) => {
    const orig = mueve(F34, fx, fy), img = orig.map(q => refleja(q, [0, 0], a)), P = orig[7], Pp = img[7], M = [(P[0] + Pp[0]) / 2, (P[1] + Pp[1]) / 2];
    const e = [Math.cos(U.rad(a)), Math.sin(U.rad(a))], d = U.dist(P, M), lejos = d > 1e-6;
    return {
      alt: `Letra F y su reflejo en una recta por el origen inclinada ${f(a, 0)}°: P y P′ están a ${f(d)} del eje, y la F queda al revés`,
      vista: { x: [-5, 5], y: [-4.6, 4.6] }, cuadricula: { paso: 1 }, ejes: true,
      puntos: [pt('P', P, { rotulo: 'P', color: 'i', lado: 90 }), pt('Q', Pp, { rotulo: "P'", color: 'o', lado: 90 }), pt('M', M, { sinPunto: true }),
        pt('e1', [-e[0], -e[1]], { sinPunto: true }), pt('e2', [e[0], e[1]], { sinPunto: true })],
      regiones: [{ puntos: orig, color: 'i', opacidad: 0.3, sinBorde: false }, { puntos: img, color: 'o', opacidad: 0.3, sinBorde: false }],
      segmentos: [{ de: 'e1', a: 'e2', color: 'd', grosor: 'variable', recta: true }, ...(lejos ? [{ de: 'P', a: 'M', discontinua: true, grosor: 'fino', marcas: 1 }, { de: 'M', a: 'Q', discontinua: true, grosor: 'fino', marcas: 1 }] : [])],
      angulos: lejos ? [{ en: 'M', de: 'P', a: 'e2', color: 'd' }] : [],
    };
  };
  // Ángulo de la recta (0° a 180°) que pasa por el origen y por q; cerca de 180° vuelve a 0°.
  const direccion = (q, paso) => { let g = U.grados(Math.atan2(q[1], q[0])); if (g < 0) g += 180; if (g >= 180) g -= 180; return g > 180 - paso / 2 ? g - 180 : g; };
  // Motor de los retos: P y su imagen P′ con las mismas funciones que dibujan (mueve, F34, refleja).
  const ppDe = v => { const P = mueve(F34, v.fx, v.fy)[7]; return [P, refleja(P, [0, 0], v.a)]; };
  const sepPP = v => U.dist(...ppDe(v));
  // La mayor separación PP′ de toda la grilla de la mesa (se calcula una vez, con el mismo motor).
  const MAX_PP = (() => { let m = 0; for (let a = 0; a <= 165; a += 15) for (let fx = -3; fx <= 1.5; fx += 0.5) for (let fy = -3; fy <= 1; fy += 0.5) m = Math.max(m, sepPP({ a, fx, fy })); return m; })();
  const mesaEspejo = {
    id: 'espejo-que-gira', titulo: 'Espejo que gira', pieza: 'geo-figura',
    consigna: 'Gira el eje desde su manija y arrastra la F. Busca cuándo P′ cae sobre P y cuándo intercambia coordenadas.',
    controles: [
      { id: 'a', etiqueta: 'ángulo del eje', min: 0, max: 165, paso: 15, inicio: 45, unidad: '°', decimales: 0, color: 'c-d' },
      { id: 'fx', etiqueta: 'F a lo ancho', min: -3, max: 1.5, paso: 0.5, inicio: 0.5, unidad: '', decimales: 1, color: 'c-i' },
      { id: 'fy', etiqueta: 'F a lo alto', min: -3, max: 1, paso: 0.5, inicio: -2.5, unidad: '', decimales: 1, color: 'c-i' },
    ],
    dibujo: v => ({ datos: espejoGira(v.a, v.fx, v.fy), estado: {} }),
    arrastres: [
      // Se agarra el eje a 3,5 del origen y se gira; el ángulo sale de atan2.
      { id: 'eje', etiqueta: 'eje, gíralo', color: 'c-d',
        donde: v => enPantalla(espejoGira(v.a, v.fx, v.fy), [3.5 * Math.cos(U.rad(v.a)), 3.5 * Math.sin(U.rad(v.a))]),
        mover: (pt, v) => ({ a: direccion(alPlano(espejoGira(v.a, v.fx, v.fy), pt), 15) }) },
      // Se agarra la esquina de abajo de la F (su punto de anclaje) y se arrastra la letra entera.
      { id: 'letra', etiqueta: 'letra F', color: 'c-i',
        donde: v => enPantalla(espejoGira(v.a, v.fx, v.fy), [v.fx, v.fy]),
        mover: (pt, v) => { const q = alPlano(espejoGira(v.a, v.fx, v.fy), pt); return { fx: q[0], fy: q[1] }; } },
    ],
    lectura: v => {
      const P = mueve(F34, v.fx, v.fy)[7], Pp = refleja(P, [0, 0], v.a);
      return [`eje a ${f(v.a, 0)}°`, SEP, `P${par(P)} → P′${par(Pp)}`];
    },
    invitaciones: [
      { texto: 'Haz que P′ caiga justo sobre P.',
        logrado: v => sepPP(v) < 1e-6,
        bien: 'P quedó sobre el eje: es su propio simétrico. ¿Pasa con otro punto?' },
      { texto: 'Gira el eje hasta que P′ cambie solo el signo de la x de P.',
        logrado: v => { const [P, Q] = ppDe(v); return Math.abs(P[0]) > 1e-6 && Math.abs(Q[0] + P[0]) < 1e-6 && Math.abs(Q[1] - P[1]) < 1e-6; },
        bien: 'Eje vertical: es el eje y, y su regla es (−x; y).' },
      { texto: 'Separa P de su reflejo P′ lo más que puedas.',
        logrado: v => sepPP(v) > MAX_PP - 1e-6,
        bien: 'PP′ es el doble de la distancia de P al eje: aléjalo del espejo.' },
      { texto: 'Guarda dos casos con la F quieta y ejes perpendiculares. Compara los P′.',
        logrado: (v, guardados) => guardados.some(g => g.fx === v.fx && g.fy === v.fy && Math.abs(Math.abs(g.a - v.a) - 90) < 1e-9
          && (([q1, q2]) => Math.hypot(q1[0] + q2[0], q1[1] + q2[1]) < 1e-6)([ppDe(g)[1], ppDe(v)[1]])),
        bien: 'Los dos P′ quedan opuestos respecto del origen: media vuelta entre ellos.' },
    ],
  };
  // Mesa 2: dos espejos seguidos. La idea 2 solo predice un caso (dos ejes perpendiculares); aquí se mueve el segundo
  // espejo: paralelo al primero da una traslación de 2d; si se cortan con ángulo θ, un giro de 2θ (con 90°, media vuelta).
  const dosEspejos = (modo, d, t) => {
    const orig = mueve(F34, -3, -1), A2 = modo === 'paralelos' ? [d, 0] : [0, 0], a2 = modo === 'paralelos' ? 90 : 90 + t;
    const r1 = orig.map(q => refleja(q, [0, 0], 90)), r2 = r1.map(q => refleja(q, A2, a2)), e = [Math.cos(U.rad(a2)), Math.sin(U.rad(a2))];
    const giro = modo === 'paralelos' ? `una traslación de ${f(2 * d)} a la derecha` : `un giro de ${f(2 * t, 0)}° en el origen`;
    return {
      alt: `Letra F reflejada en el eje y y después en un segundo espejo ${modo === 'paralelos' ? `paralelo, a ${f(d)}` : `que lo corta a ${f(t, 0)}°`}: el resultado es ${giro}`,
      vista: { x: [-5, 5], y: [-4.4, 4.4] }, cuadricula: { paso: 1 }, ejes: true,
      puntos: [pt('m1a', [0, -4.4], { sinPunto: true }), pt('m1b', [0, 4.4], { sinPunto: true }),
        pt('m2a', [A2[0] - e[0], A2[1] - e[1]], { sinPunto: true }), pt('m2b', [A2[0] + e[0], A2[1] + e[1]], { sinPunto: true })],
      regiones: [{ puntos: orig, color: 'i', opacidad: 0.3, sinBorde: false }, { puntos: r1, color: 'd', opacidad: 0.12, discontinua: true }, { puntos: r2, color: 'o', opacidad: 0.3, sinBorde: false }],
      segmentos: [{ de: 'm1a', a: 'm1b', color: 'd', grosor: 'variable', recta: true }, { de: 'm2a', a: 'm2b', color: 'h', grosor: 'variable', recta: true }],
    };
  };
  // Motor de los retos: la F original y la final, tal como las dibuja dosEspejos.
  const finalDe = v => { const d = dosEspejos(v.modo, v.d, v.t); return { o: d.regiones[0].puntos, f: d.regiones[2].puntos }; };
  const desplazaDe = v => { const { o, f: q } = finalDe(v); return [q[0][0] - o[0][0], q[0][1] - o[0][1]]; };
  const esTraslacion = (v, dx, dy) => { const { o, f: q } = finalDe(v); return o.every((p, k) => Math.abs(q[k][0] - p[0] - dx) < 1e-6 && Math.abs(q[k][1] - p[1] - dy) < 1e-6); };
  // Giro de la F final respecto de la original, en grados (0 a 360), medido con su primer lado.
  const giroDe = v => { const { o, f: q } = finalDe(v); let g = U.grados(Math.atan2(q[1][1] - q[0][1], q[1][0] - q[0][0]) - Math.atan2(o[1][1] - o[0][1], o[1][0] - o[0][0])); while (g < 0) g += 360; while (g >= 360) g -= 360; return g; };
  const MIN_GIRO = Math.min(...[15, 30, 45, 60, 75, 90].map(t => giroDe({ modo: 'cortan', d: 1.5, t })));
  const mesaDos = {
    id: 'dos-espejos', titulo: 'Dos espejos', pieza: 'geo-figura',
    consigna: 'La F se refleja en el eje y, y luego en el espejo rojo. Muévelo: paralelo o cortando. Mira la F final.',
    controles: [
      { id: 'modo', etiqueta: 'Espejos', opciones: [{ valor: 'paralelos', texto: 'paralelos' }, { valor: 'cortan', texto: 'se cortan' }] },
      { id: 'd', etiqueta: 'separación (paralelos)', min: 0.5, max: 2.5, paso: 0.5, inicio: 1.5, unidad: '', decimales: 1, color: 'c-h' },
      { id: 't', etiqueta: 'ángulo θ (se cortan)', min: 15, max: 90, paso: 15, inicio: 45, unidad: '°', decimales: 0, color: 'c-h' },
    ],
    dibujo: v => ({ datos: dosEspejos(v.modo, v.d, v.t), estado: {} }),
    // Una sola manija sobre el espejo rojo: si son paralelos, lo corre (d); si se cortan, lo gira en el origen (θ).
    arrastres: [{ id: 'espejo-2', etiqueta: 'segundo espejo', color: 'c-h',
      donde: v => enPantalla(dosEspejos(v.modo, v.d, v.t), v.modo === 'paralelos' ? [v.d, 3] : [4 * Math.cos(U.rad(90 + v.t)), 4 * Math.sin(U.rad(90 + v.t))]),
      mover: (pt, v) => {
        const q = alPlano(dosEspejos(v.modo, v.d, v.t), pt);
        return v.modo === 'paralelos' ? { d: q[0] } : { t: U.grados(Math.atan2(q[1], q[0])) - 90 };
      } }],
    lectura: v => (v.modo === 'paralelos'
      ? [`paralelos a ${f(v.d)}`, SEP, `traslación de ${f(2 * v.d)}`]
      : [`se cortan a ${f(v.t, 0)}°`, SEP, `giro de ${f(2 * v.t, 0)}°`]),
    invitaciones: [
      { texto: 'Consigue que la F final quede 4 a la derecha de la original.',
        logrado: v => esTraslacion(v, 4, 0),
        bien: 'Espejos a 2: la F avanza 4. Comprueba si siempre sale el doble.' },
      { texto: 'Haz que la F final quede girada media vuelta, de cabeza.',
        logrado: v => { const { o, f: q } = finalDe(v); return o.every((p, k) => Math.abs(q[k][0] + p[0]) < 1e-6 && Math.abs(q[k][1] + p[1]) < 1e-6); },
        bien: 'Espejos perpendiculares: dos reflejos dan media vuelta, la simetría central.' },
      { texto: 'Busca el giro más pequeño que logran los dos espejos.',
        logrado: v => v.modo === 'cortan' && Math.abs(giroDe(v) - MIN_GIRO) < 1e-6,
        bien: 'Con θ = 15° la F gira 30°: el giro es el doble del ángulo.' },
      { texto: 'Guarda dos espejos paralelos, uno al doble de separación que el otro.',
        logrado: (v, guardados) => v.modo === 'paralelos' && guardados.some(g => g.modo === 'paralelos' && g.d !== v.d
          && (Math.abs(2 * desplazaDe(g)[0] - desplazaDe(v)[0]) < 1e-6 || Math.abs(2 * desplazaDe(v)[0] - desplazaDe(g)[0]) < 1e-6)),
        bien: 'Doble separación, doble traslación: la F avanza siempre 2d.' },
    ],
  };

  // Retos de la mesa del plano: P, P′ y H salen de planoFig, la misma función que dibuja.
  const plano3 = v => { const ps = planoFig(v.h, v.x).puntos.map(p => [p.x, p.y, p.z]); return { P: ps[0], Q: ps[1], H: ps[2] }; };
  const sepPlano = v => { const { P, Q } = plano3(v); return U.dist(P, Q); };
  const MAX_PLANO = Math.max(...[0.5, 1, 1.5, 2, 2.5].map(h => sepPlano({ h, x: 0 })));
  const retosPlano = [
    { texto: 'Lleva P lo más lejos que puedas de su simétrico P′.',
      logrado: v => sepPlano(v) > MAX_PLANO - 1e-9,
      bien: 'P′ se aleja igual que P: PP′ es el doble de la altura.' },
    { texto: 'Haz que P y P′ queden justo a 2 de distancia.',
      logrado: v => Math.abs(sepPlano(v) - 2) < 1e-9,
      bien: 'Uno arriba y uno abajo: el plano queda justo en la mitad.' },
    { texto: 'Guarda dos casos con la misma proyección H y distinta altura.',
      logrado: (v, guardados) => guardados.some(g => g.h !== v.h && U.dist(plano3(g).H, plano3(v).H) < 1e-9),
      bien: 'H no se movió con la altura: P y P′ comparten su proyección.' },
  ];

  return {
    unidad: 'geometria.simetria',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/geo-figura.js'],
    historia: {
      texto: 'La simetría aparece en muchas prácticas visuales y no tiene un único inventor. Un cambio bien documentado es el programa de Erlangen de Felix Klein, en 1872: organizar las geometrías según las transformaciones y lo que estas conservan. Así, una reflexión importa por lo que hace con puntos, distancias y orientación, no solo por verse bonita.',
      pregunta: '¿Qué conserva una reflexión y qué cambia?',
      fuente: { titulo: 'K. S. Kedlaya, Geometry Unbound, cap. 3 (transformaciones)', url: 'https://kskedlaya.org/geometryunbound/gu-060118.pdf' },
    },
    // Glosario (docs/teoria.md, 4d): las palabras que este tema estrena en el curso. Mediatriz, punto medio, perpendicular,
    // proyección y giro vienen de unidades anteriores y el lector las marca solas.
    glosario: [
      { termino: 'sólido', formas: ['sólido', 'sólidos'], def: 'Figura de tres dimensiones que encierra una parte del espacio, como un cubo o una esfera.', ver: ['volumen'] },
      { termino: 'cara', formas: ['cara', 'caras'], def: 'Cada uno de los polígonos planos que limitan un cuerpo de tres dimensiones.', ejemplo: 'Un cubo tiene 6 caras cuadradas.', ver: ['arista'] },
      { termino: 'perpendicular al plano', def: 'Recta que forma 90° con todas las rectas del plano que pasan por su pie.', ver: ['perpendicular', 'pie'] },
      { termino: 'transformación', def: 'Regla que lleva cada punto de una figura a otro punto, que se llama su imagen.',
        formas: ['transformación', 'transformaciones'], ver: ['simetría', 'traslación'] },
      { termino: 'simetría', def: 'Transformación que lleva cada punto al otro lado de un eje, un centro o un plano, a igual distancia.',
        ver: ['simétrico', 'eje de simetría', 'simetría central', 'plano de simetría'] },
      { termino: 'simétrico', def: 'Imagen de un punto o de una figura: a la misma distancia del eje, centro o plano, del otro lado.',
        formas: ['simétrico', 'simétricos', 'simétrica', 'simétricas'], ejemplo: 'Respecto del eje x, el de P(5; 1) es (5; −1).', ver: ['simetría'] },
      { termino: 'eje de simetría', def: 'Recta que hace de espejo: es la mediatriz de cada segmento entre un punto y su imagen.',
        formas: ['eje de simetría', 'ejes de simetría'], ejemplo: 'Con el eje x = 2, el punto (0; 3) va a (4; 3).', ver: ['reflexión', 'mediatriz'] },
      { termino: 'simetría central', def: 'Simetría respecto de un punto O, que queda en la mitad de cada segmento PP′. Es media vuelta.',
        ejemplo: 'Respecto de O(1; 0), el punto P(3; 2) va a (−1; −2).', ver: ['orientación'] },
      { termino: 'plano de simetría', def: 'Plano que parte un sólido en dos mitades, cada una reflejo exacto de la otra.',
        formas: ['plano de simetría', 'planos de simetría'], ejemplo: 'Un cubo tiene 9: tres paralelos a las caras y seis por aristas opuestas.', ver: ['plano mediador'] },
      { termino: 'plano mediador', def: 'Plano perpendicular a un segmento por su punto medio: sus puntos están a igual distancia de ambos extremos.',
        ver: ['plano de simetría', 'punto medio'] },
      { termino: 'reflexión', def: 'Simetría que actúa como un espejo, en una recta o en un plano. Invierte la orientación de la figura.',
        formas: ['reflexión', 'reflexiones', 'reflejo', 'reflejos'], ver: ['orientación', 'eje de simetría'] },
      { termino: 'orientación', def: 'Hacia dónde mira una figura o en qué sentido se recorre: la letra derecha o al revés.',
        ejemplo: 'Reflejada en el eje y, la F queda al revés; girada 180°, queda derecha.', ver: ['reflexión'] },
      { termino: 'traslación', def: 'Mover toda la figura la misma distancia y en la misma dirección, sin girarla.',
        formas: ['traslación', 'traslaciones'], ejemplo: 'Dos espejos paralelos a 1,5 trasladan la F 3 unidades.' },
      { termino: 'coordenadas', def: 'Par de números (x; y) que ubica un punto: cuánto a lo ancho y cuánto a lo alto del origen.',
        formas: ['coordenada', 'coordenadas'], ver: ['origen'] },
      { termino: 'origen', def: 'El punto (0; 0), donde se cortan el eje x y el eje y.', ver: ['coordenadas'] },
      { termino: 'arista', def: 'Segmento donde se juntan dos caras de un sólido.', ejemplo: 'Un cubo tiene 12.' },
      { termino: 'superponer', def: 'Poner una figura sobre otra de modo que coincidan punto por punto.',
        formas: ['superponer', 'superpone', 'superponen', 'superponerse'] },
    ],
    // Laboratorio: el espejo que gira y los dos espejos son más ricos que sus ideas; la tercera mesa es el juego del
    // reflejo en un plano, con sus dos manijas en 3D.
    laboratorio: [mesaEspejo, mesaDos, Object.assign({ id: 'reflejo-plano', titulo: 'Reflejo en un plano', pieza: 'geo-figura', invitaciones: retosPlano }, planoIdea.juega)],
    ideas: [axialIdea, centralIdea, planoIdea],
  };
});
