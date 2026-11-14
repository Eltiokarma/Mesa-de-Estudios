/*
 * Teoría de «Puntos notables del triángulo» (geometria.puntos-notables). Molde: docs/teoria.md.
 * Fuente: docs/teoria/matriz/geometria.json (unidad 7); Kedlaya, Geometry Unbound §7 (centros, Euler).
 * Compañera: Neri (nutria). Pieza: geo-figura.
 *
 * Ficha de tarea
 *   Promesa: reconocer cada centro por las líneas que lo definen y la propiedad que garantiza (equidistar, 2:1), y saber
 *     cuáles pueden salir del triángulo.
 *   Persona y condiciones: postulante de 4.º de secundaria, celular a 360 px, sin audio, quizás sin conexión.
 *   Resultado observable: usa la razón 2:1 y las seis áreas del baricentro, ubica O y H según el tipo de triángulo,
 *     calcula ∠BOC, ∠BHC, ∠BIC y ∠BEC, y usa la recta de Euler (OG:GH = 1:2) y el radio R/2 de los nueve puntos.
 *   Orden de atención: 1.º la figura y su lectura · 2.º la pregunta · acción: «Comprobar» · fondo: Neri.
 *   Estados: jugando · predicción sin elegir · comprobada · paso de «Mira» · regla · caso nuevo.
 *   Duda que resuelve: «¿los centros siempre están dentro?» y «¿cuál es cuál?».
 *
 * Colores: lo que se mueve naranja (c-o), segunda referencia turquesa (c-i), lugar o recta verde (c-d), el centro pedido rojo (c-h).
 * Códigos: GE8; GE-PN y GE-EU son hipótesis nuevas (docs/investigacion/geometria-ideas-erroneas.md no las trae).
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
  const gr = n => `${Kit.formatear(n, 1)}°`;
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
  const pt = (id, p, o = {}) => Object.assign({ id, x: p[0], y: p[1] }, o);
  // Gesto directo (docs/teoria.md §4b): la manija vive en el viewBox de geo-figura; aPlano la vuelve coordenadas del
  // problema y el lector ajusta cada valor al paso y al rango de su control.
  const enPantalla = (datos, p) => G.aPantalla(datos, p);
  const alPlano = (datos, p) => G.aPlano(datos, p);
  const B = [0, 0], C = [6, 0];
  // Centros del triángulo ABC (B y C fijos).
  const centros = A => {
    const a = U.dist(B, C), b = U.dist(A, C), c = U.dist(A, B);
    const Gc = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3];
    const mAB = U.medio(A, B), mAC = U.medio(A, C);
    const O = U.corte(mAB, [mAB[0] - (B[1] - A[1]), mAB[1] + (B[0] - A[0])], mAC, [mAC[0] - (C[1] - A[1]), mAC[1] + (C[0] - A[0])]);
    const H = [A[0] + B[0] + C[0] - 2 * O[0], A[1] + B[1] + C[1] - 2 * O[1]];
    const s = a + b + c, I = [(a * A[0] + b * B[0] + c * C[0]) / s, (a * A[1] + b * B[1] + c * C[1]) / s];
    const area = Math.abs(U.area([A, B, C])), r = area / (s / 2), R = U.dist(O, A);
    return { G: Gc, O, H, I, r, R, a, b, c, N: U.medio(O, H) };
  };
  const dentro = (P, A) => { const s1 = U.area([A, B, P]), s2 = U.area([B, C, P]), s3 = U.area([C, A, P]); return (s1 >= -1e-9 && s2 >= -1e-9 && s3 >= -1e-9) || (s1 <= 1e-9 && s2 <= 1e-9 && s3 <= 1e-9); };
  const tipo = A => { const m = Math.max(U.angulo(A, B, C), U.angulo(B, A, C), U.angulo(C, A, B)); return Math.abs(m - 90) < 0.5 ? 'rectángulo' : m > 90 ? 'obtusángulo' : 'acutángulo'; };

  // ---------- Idea 1: baricentro ----------
  // Cambia: el vértice A · Permanece: la base BC · Progresa: AG : GM, siempre 2 : 1 ·
  // Se reserva: las seis áreas iguales · Debe verse: G parte cada mediana en dos tercios y un tercio.
  const bari = (A, o = {}) => {
    const { G: Gc } = centros(A), Ma = U.medio(B, C), Mb = U.medio(A, C), Mc = U.medio(A, B), k = o.pasos || {};
    const seis = o.seis ? [['A', 'Mc', 'G'], ['Mc', 'B', 'G'], ['B', 'Ma', 'G'], ['Ma', 'C', 'G'], ['C', 'Mb', 'G'], ['Mb', 'A', 'G']].map((p, i) => ({ puntos: p, color: i % 2 ? 'i' : 'o', opacidad: 0.2, desde: k.seis || 0 })) : [];
    return {
      alt: o.alt || `Las tres medianas se cortan en el baricentro G, que parte cada una en razón 2 : 1${o.seis ? '; forman seis triángulos de igual área' : ''}`,
      vista: { x: [-1.4, 7.4], y: [-1, 5.6] },
      puntos: [pt('A', A, { rotulo: 'A', lado: 90 }), pt('B', B, { rotulo: 'B', lado: -120 }), pt('C', C, { rotulo: 'C', lado: -60 }), pt('Ma', Ma, { rotulo: 'M', lado: -90 }), pt('Mb', Mb, {}), pt('Mc', Mc, {}), pt('G', Gc, { rotulo: 'G', color: 'h', lado: 0 })],
      regiones: seis,
      segmentos: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'C', a: 'A' },
        { de: 'A', a: 'G', color: 'o', grosor: 'variable', texto: o.num ? '2k' : undefined }, { de: 'G', a: 'Ma', color: 'i', grosor: 'variable', texto: o.num ? 'k' : undefined },
        { de: 'B', a: 'Mb', grosor: 'fino' }, { de: 'C', a: 'Mc', grosor: 'fino' }, { de: 'B', a: 'Ma', marcas: 1 }, { de: 'Ma', a: 'C', marcas: 1 }],
    };
  };
  // Manija del vértice A para las figuras que dependen de (ax, ay).
  const arrastreA = dib => ({ id: 'vertice-a', etiqueta: 'vértice A', color: 'c-o',
    donde: v => enPantalla(dib(v.ax, v.ay), [v.ax, v.ay]),
    mover: (p, v) => { const q = alPlano(dib(v.ax, v.ay), p); return { ax: q[0], ay: q[1] }; } });
  const baricentro = {
    id: 'baricentro',
    titulo: 'El baricentro parte en 2 : 1',
    temas: ['Baricentro, incentro, circuncentro, ortocentro y excentro', 'Propiedades de los puntos notables'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Las tres medianas se cortan en G, el baricentro. Mueve el vértice A y compara AG con GM en la mediana AM.',
      voz: 'Mueve A. Comprueba la razón entre los dos tramos.',
      controles: [
        { id: 'ax', etiqueta: 'A a lo ancho', min: -1, max: 7, paso: 1, inicio: 2, unidad: '', decimales: 0, color: 'c-o' },
        { id: 'ay', etiqueta: 'A a lo alto', min: 2, max: 5, paso: 1, inicio: 4, unidad: '', decimales: 0, color: 'c-o' },
      ],
      dibujo: v => ({ datos: bari([v.ax, v.ay]), estado: {} }),
      // Se agarra el vértice A: las medianas y G lo siguen; la base BC no se mueve.
      arrastres: [arrastreA((ax, ay) => bari([ax, ay]))],
      lectura: v => { const A = [v.ax, v.ay], g = centros(A).G, M = U.medio(B, C); return [{ v: 'c-o', t: 'AG' }, ` = ${f(U.dist(A, g))}   ·   `, { v: 'c-i', t: 'GM' }, ` = ${f(U.dist(g, M))}   ·   razón 2 : 1`]; },
      minimo: 4,
    },
    predice: {
      pregunta: 'Las tres medianas parten el triángulo en seis triangulitos con vértice común en G. ¿Cómo son sus áreas?',
      voz: 'Antes de medir, piensa en bases iguales y alturas comunes.',
      opciones: [
        { id: 'c', texto: 'Las seis son iguales', correcta: true },
        { id: 'forma', texto: 'Distintas: tienen formas distintas', error: 'GE6', siFuera: 'Las formas sí son distintas; el área depende de base y altura, y esas se emparejan.' },
        { id: 'pares', texto: 'Iguales solo de dos en dos', error: 'GE-PN1', siFuera: 'De dos en dos sí son iguales; además, cada par iguala al de al lado.' },
      ],
      dibujo: { datos: bari([1, 4.5], { seis: true }), estado: { corte: 0 } },
      revelar: { datos: Object.assign(bari([1, 4.5], { seis: true }), { rotulos: [{ x: 3.4, y: 5.1, texto: 'cada uno: 1/6 del total', color: 'h' }] }), estado: {} },
      coincide: 'Coincide: cada triangulito es la sexta parte del área.',
    },
    mira: {
      datos: bari([1, 4.5], { seis: true, num: true, pasos: { seis: 2 } }),
      voz: 'Primero la razón 2 : 1; después las áreas.',
      pasos: [
        { estado: { corte: 1 }, texto: 'G está a dos tercios de cada vértice en su mediana.', ecuacion: [{ v: 'c-o', t: 'AG' }, ' = 2 ', { v: 'c-i', t: 'GM' }] },
        { estado: { corte: 2 }, texto: 'Los dos triangulitos junto a un lado tienen bases iguales y la misma altura.', ecuacion: ['[BMG] = [MCG]'] },
        { estado: { corte: 2 }, texto: 'Cada mediana parte el área en dos; combinando, las seis coinciden.', ecuacion: ['cada uno = ', { frac: ['[ABC]', '6'] }] },
      ],
    },
    regla: {
      texto: 'El baricentro G es el corte de las medianas. Las divide en razón 2 : 1 desde el vértice, y las tres medianas forman seis triángulos de igual área.',
      ecuacion: [{ llave: [{ v: 'c-o', t: 'AG' }], nota: 'tramo largo', color: 'c-o' }, ' = 2 · ', { llave: [{ v: 'c-i', t: 'GM' }], nota: 'tramo corto', color: 'c-i' }, '   ·   ', { v: 'c-o', t: 'AG' }, ' = ', { frac: ['2', '3'] }, ' AM'],
      condicion: 'M es el punto medio del lado opuesto a A. Vale para cualquier triángulo: G siempre queda dentro.',
      voz: 'Dos tercios desde el vértice, uno hasta el lado.',
    },
    ahoraTu: {
      voz: 'Ubica el tramo largo: siempre el del vértice.',
      generar(s) {
        const r = azar(s), tipoP = s % 3;
        if (tipoP === 2) {
          const S = 6 * r.ent(3, 20);
          return {
            pregunta: [`Un triángulo tiene área ${S}. Sus tres medianas lo parten en seis triangulitos. ¿Cuál es el área de uno de ellos?`],
            opciones: opciones(S / 6, [
              { id: 'tercio', valor: S / 3, error: 'GE-PN1', siFuera: 'Un tercio es el área de dos triangulitos juntos.' },
              { id: 'mitad', valor: S / 2, error: 'GE-PN1', siFuera: 'La mitad la corta una sola mediana.' },
              { id: 'cuarto', valor: S / 4, error: 'GE-PN1', siFuera: 'Un cuarto es el triángulo de los puntos medios, no un triangulito de G.' },
            ], n => f(n)),
            solucion: { texto: 'Los seis triangulitos tienen igual área.', ecuacion: [`${S} ÷ 6 = ${f(S / 6)}`] },
          };
        }
        const m = 3 * r.ent(2, 12);
        const pideAG = tipoP === 0;
        return {
          pregunta: [`La mediana AM de un triángulo mide ${m}. G es el baricentro. ¿Cuánto mide `, pideAG ? { v: 'c-o', t: 'AG' } : { v: 'c-i', t: 'GM' }, '?'],
          dibujo: { datos: bari([r.ent(0, 6), r.ent(3, 5)]), estado: {} },
          opciones: opciones(pideAG ? 2 * m / 3 : m / 3, [
            { id: 'otro', valor: pideAG ? m / 3 : 2 * m / 3, error: 'GE-PN2', siFuera: pideAG ? 'Ese es GM, el tramo corto.' : 'Ese es AG, el tramo largo.' },
            { id: 'mitad', valor: m / 2, error: 'GE-PN2', siFuera: 'G no es el punto medio de la mediana: la parte en 2 : 1.' },
            { id: 'doble', valor: 2 * m, error: 'GE-PN2', siFuera: 'Ese sería el doble de la mediana completa.' },
          ], n => f(n)),
          solucion: { texto: 'G parte la mediana en dos tercios y un tercio.', ecuacion: pideAG ? [`AG = ⅔ · ${m} = ${f(2 * m / 3)}`] : [`GM = ⅓ · ${m} = ${f(m / 3)}`] },
        };
      },
    },
  };

  // ---------- Idea 2: los centros y dónde quedan ----------
  // Cambia: el vértice A y el centro elegido · Permanece: la base BC · Progresa: si el centro queda dentro o fuera ·
  // Se reserva: el triángulo rectángulo · Debe verse: cada centro sale de sus líneas y de lo que equidista.
  const NOMBRE = { I: 'incentro', O: 'circuncentro', H: 'ortocentro', G: 'baricentro' };
  const centroFig = (A, cual, o = {}) => {
    const c = centros(A), P = c[cual];
    const seg = [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'C', a: 'A' }];
    const pts = [pt('A', A, { rotulo: 'A', lado: 90 }), pt('B', B, { rotulo: 'B', lado: -120 }), pt('C', C, { rotulo: 'C', lado: -60 }), pt('P', P, { rotulo: cual, color: 'h', lado: 30 })];
    const circ = [], ang = [];
    if (cual === 'O') { circ.push({ centro: 'P', r: c.R, color: 'd', discontinua: true }); ['A', 'B', 'C'].forEach(v => seg.push({ de: 'P', a: v, color: 'd', grosor: 'fino' })); }
    if (cual === 'I') { circ.push({ centro: 'P', r: c.r, color: 'd' }); ['A', 'B', 'C'].forEach(v => seg.push({ de: v, a: 'P', color: 'o', grosor: 'fino' })); }
    if (cual === 'G') ['A', 'B', 'C'].forEach((v, i) => { const M = U.medio([A, B, C][(i + 1) % 3], [A, B, C][(i + 2) % 3]); pts.push(pt('M' + i, M, {})); seg.push({ de: v, a: 'M' + i, color: 'o', grosor: 'fino' }); });
    if (cual === 'H') [[A, B, C], [B, C, A], [C, A, B]].forEach(([V, X, Y], i) => {
      const F = U.pie(V, X, Y); pts.push(pt('F' + i, F, {})); pts.push(pt('V' + i, V, { sinPunto: true }));
      seg.push({ de: 'V' + i, a: 'F' + i, color: 'o', grosor: 'fino' }, { de: 'F' + i, a: 'P', color: 'o', discontinua: true, grosor: 'fino' });
      const lejos = U.dist(F, X) > U.dist(F, Y) ? X : Y; pts.push(pt('L' + i, lejos, { sinPunto: true }));
      ang.push({ en: 'F' + i, de: 'L' + i, a: 'V' + i, color: 'o' });
    });
    return {
      alt: o.alt || `Triángulo ${tipo(A)} con su ${NOMBRE[cual]} ${dentro(P, A) ? 'dentro' : U.dist(P, A) < 1e-6 || U.dist(P, B) < 1e-6 || U.dist(P, C) < 1e-6 ? 'en un vértice' : 'fuera'} del triángulo`,
      vista: { x: [-2.4, 8.4], y: [-3.4, 7.2] },
      puntos: pts, circulos: circ, segmentos: seg, angulos: ang,
      regiones: [{ puntos: ['A', 'B', 'C'], color: 'i', opacidad: 0.08 }],
    };
  };
  const recto = (o = {}) => {
    const A = [0, 4.5], c = centros(A), k = o.pasos || {};
    return {
      alt: o.alt || 'Triángulo rectángulo en B: el circuncentro O es el punto medio de la hipotenusa AC y el ortocentro H es el vértice B',
      vista: { x: [-1.8, 7.6], y: [-1.4, 5.8] },
      puntos: [pt('A', A, { rotulo: 'A', lado: 90 }), pt('B', B, { rotulo: o.marcas ? 'B = H' : 'B', lado: -120, color: o.marcas ? 'h' : undefined }), pt('C', C, { rotulo: 'C', lado: -60 }),
        ...(o.marcas ? [pt('O', c.O, { rotulo: 'O', color: 'h', lado: 60, desde: k.o || 0 })] : [])],
      circulos: o.marcas ? [{ centro: 'O', r: c.R, color: 'd', discontinua: true, desde: k.circ || 0 }] : [],
      regiones: [{ puntos: ['A', 'B', 'C'], color: 'i', opacidad: 0.08 }],
      segmentos: [{ de: 'A', a: 'B', color: o.marcas ? 'o' : undefined, grosor: o.marcas ? 'variable' : undefined, desde: 0 }, { de: 'B', a: 'C', color: o.marcas ? 'o' : undefined, grosor: o.marcas ? 'variable' : undefined }, { de: 'C', a: 'A' },
        ...(o.marcas ? [{ de: 'A', a: 'O', marcas: 1, desde: k.o || 0 }, { de: 'O', a: 'C', marcas: 1, desde: k.o || 0 }, { de: 'B', a: 'O', color: 'd', marcas: 1, desde: k.circ || 0 }] : [])],
      angulos: [{ en: 'B', de: 'C', a: 'A', color: o.marcas ? 'h' : undefined }],
    };
  };
  const centrosIdea = {
    id: 'centros',
    titulo: 'Cada centro y sus líneas',
    temas: ['Baricentro, incentro, circuncentro, ortocentro y excentro', 'Propiedades de los puntos notables'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Elige un centro y mueve el vértice A hasta que un ángulo quede obtuso. Mira qué centros salen del triángulo.',
      voz: 'Lleva A a los extremos. Revisa dónde queda cada centro.',
      controles: [
        { id: 'c', etiqueta: 'centro', opciones: [{ valor: 'O', texto: 'circuncentro' }, { valor: 'H', texto: 'ortocentro' }, { valor: 'I', texto: 'incentro' }, { valor: 'G', texto: 'baricentro' }] },
        { id: 'ax', etiqueta: 'A a lo ancho', min: -1, max: 7, paso: 1, inicio: 2, unidad: '', decimales: 0, color: 'c-o' },
      ],
      dibujo: v => ({ datos: centroFig([v.ax + 0.5, 3.4], v.c), estado: {} }),
      // Se agarra el vértice A, que corre en una paralela a BC (altura fija 3,4).
      arrastres: [{ id: 'vertice-a', etiqueta: 'vértice A', color: 'c-o',
        donde: v => enPantalla(centroFig([v.ax + 0.5, 3.4], v.c), [v.ax + 0.5, 3.4]),
        mover: (p, v) => ({ ax: alPlano(centroFig([v.ax + 0.5, 3.4], v.c), p)[0] - 0.5 }) }],
      lectura: v => { const A = [v.ax + 0.5, 3.4], P = centros(A)[v.c]; return [`${tipo(A)}   ·   ${NOMBRE[v.c]} ${dentro(P, A) ? 'dentro' : 'fuera'}`]; },
      minimo: 5,
    },
    predice: {
      pregunta: 'Ahora el triángulo es rectángulo en B. ¿Dónde quedan su circuncentro O y su ortocentro H?',
      voz: 'Piensa en las alturas y en la mediana de la hipotenusa.',
      opciones: [
        { id: 'c', texto: 'O en el punto medio de AC; H en B', correcta: true },
        { id: 'dentro', texto: 'Los dos dentro del triángulo', error: 'GE-PN3', siFuera: 'Dentro estarían en un acutángulo. Con el ángulo recto, los dos llegan al borde.' },
        { id: 'juntos', texto: 'Los dos en B', error: 'GE-PN3', siFuera: 'H sí está en B. O equidista de los tres vértices: no puede estar en uno.' },
        { id: 'fuera', texto: 'Los dos fuera, como en el obtusángulo', error: 'GE-PN3', siFuera: 'Fuera quedarían con un ángulo obtuso. Con 90° justos, quedan en el borde.' },
      ],
      dibujo: { datos: recto(), estado: {} },
      revelar: { datos: recto({ marcas: true }), estado: {} },
      coincide: 'Coincide: O es el punto medio de la hipotenusa y H, el vértice recto.',
    },
    // Hallazgo 9: «Mira» usa el triángulo rectángulo de la predicción, no el del juego: es el caso frontera (O y H en
    // el borde) que el juego no alcanza, porque A corre a una altura fija y nunca forma 90° justos en B.
    mira: {
      datos: recto({ marcas: true, pasos: { o: 2, circ: 3 } }),
      voz: 'Cada centro se ubica por sus líneas, una por una.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Dos alturas son los catetos AB y BC: se cortan en B.', ecuacion: ['H = B'] },
        { estado: { corte: 2 }, texto: 'O equidista de los vértices: en la hipotenusa, su punto medio.', ecuacion: ['OA = OC'] },
        { estado: { corte: 3 }, texto: 'La mediana BO mide la mitad de AC: O equidista también de B.', ecuacion: ['OA = OB = OC = R'] },
      ],
    },
    regla: {
      texto: 'Incentro: bisectrices; equidista de los lados. Circuncentro: mediatrices; equidista de los vértices. Ortocentro: alturas. Baricentro: medianas. Excentro: una bisectriz interior y dos exteriores.',
      condicion: 'el triángulo es cualquiera. O y H quedan dentro solo si es acutángulo; I y G, siempre.',
      voz: 'Nombra el centro por sus líneas, no por su lugar.',
    },
    ahoraTu: {
      voz: 'Ubica qué centro es y qué ángulo forma con B y C.',
      generar(s) {
        const r = azar(s), A = 2 * r.ent(18, 40), cual = ['O', 'H', 'I', 'E'][s % 4];
        const val = { O: 2 * A, H: 180 - A, I: 90 + A / 2, E: 90 - A / 2 }[cual];
        const nom = { O: 'el circuncentro O', H: 'el ortocentro H', I: 'el incentro I', E: 'el excentro E relativo a BC' }[cual];
        const mal = [{ id: 'o', valor: 2 * A, txt: '2A es el central: vale para el circuncentro.' }, { id: 'h', valor: 180 - A, txt: '180° − A vale para el ortocentro.' },
          { id: 'i', valor: 90 + A / 2, txt: '90° + A/2 vale para el incentro.' }, { id: 'e', valor: 90 - A / 2, txt: '90° − A/2 vale para el excentro.' }];
        return {
          pregunta: [`En un triángulo acutángulo ABC, ∠A = ${A}°. ¿Cuánto mide el ángulo BXC, donde X es ${nom}?`],
          opciones: opciones(val, mal.filter(m => m.id !== cual.toLowerCase()).map(m => ({ id: m.id, valor: m.valor, error: 'GE-PN4', siFuera: m.txt })), gr),
          solucion: { texto: { O: 'BOC es central sobre el arco BC: el doble de A.', H: 'En el cuadrilátero con las alturas, BHC y A suman 180°.', I: 'Las bisectrices toman la mitad de B y de C.', E: 'Las bisectrices exteriores de B y C se cortan en E.' }[cual], ecuacion: [{ O: `2 · ${A}°`, H: `180° − ${A}°`, I: `90° + ${A}°/2`, E: `90° − ${A}°/2` }[cual], ` = ${gr(val)}`] },
        };
      },
    },
  };

  // ---------- Idea 3: recta y circunferencia de Euler ----------
  // Cambia: el vértice A · Permanece: la base BC · Progresa: O, G y H sobre una recta con OG : GH = 1 : 2 ·
  // Se reserva: la circunferencia de nueve puntos · Debe verse: su centro es el punto medio de OH y su radio, R/2.
  const euler = (A, o = {}) => {
    const c = centros(A), k = o.pasos || {};
    const Ma = U.medio(B, C), Mb = U.medio(A, C), Mc = U.medio(A, B);
    const Fa = U.pie(A, B, C), Fb = U.pie(B, A, C), Fc = U.pie(C, A, B);
    const ext = [U.mezcla(c.O, c.H, -0.4), U.mezcla(c.O, c.H, 1.4)];
    return {
      alt: o.alt || `O, G y H están alineados con GH = 2 · OG${o.nueve ? `; la circunferencia de nueve puntos tiene centro en el punto medio de OH y radio ${f(c.R / 2)}` : ''}`,
      vista: { x: [-1.6, 7.6], y: [-1.6, 6.4] },
      puntos: [pt('A', A, { rotulo: 'A', lado: 90 }), pt('B', B, { rotulo: 'B', lado: -120 }), pt('C', C, { rotulo: 'C', lado: -60 }),
        pt('O', c.O, { rotulo: 'O', color: 'i', lado: -30 }), pt('G', c.G, { rotulo: 'G', color: 'o', lado: 150 }), pt('H', c.H, { rotulo: 'H', color: 'h', lado: 150 }),
        pt('e1', ext[0], { sinPunto: true }), pt('e2', ext[1], { sinPunto: true }),
        ...(o.nueve ? [Ma, Mb, Mc, Fa, Fb, Fc, U.medio(A, c.H), U.medio(B, c.H), U.medio(C, c.H)].map((p, i) => pt('n' + i, p, { color: 'd', desde: i < 3 ? k.m || 0 : i < 6 ? k.f || 0 : k.h || 0 })).concat([pt('N', c.N, { rotulo: 'N', color: 'd', lado: 0, desde: k.n || 0 })]) : [])],
      regiones: [{ puntos: ['A', 'B', 'C'], color: 'i', opacidad: 0.06 }],
      circulos: [{ centro: 'O', r: c.R, grosor: 'fino', discontinua: true }, ...(o.nueve ? [{ centro: 'N', r: c.R / 2, color: 'd', desde: k.n || 0 }] : [])],
      segmentos: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'C', a: 'A' }, { de: 'e1', a: 'e2', color: 'd', grosor: 'fino', desde: k.recta || 0 },
        { de: 'O', a: 'G', color: 'i', grosor: 'variable', texto: o.num ? 'd' : undefined, desde: k.recta || 0 }, { de: 'G', a: 'H', color: 'h', grosor: 'variable', texto: o.num ? '2d' : undefined, desde: k.recta || 0 }],
    };
  };
  const AE = [0.5, 4.2];
  const eulerIdea = {
    id: 'euler',
    titulo: 'Recta y círculo de Euler',
    temas: ['Recta y circunferencia de Euler'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Mueve el vértice A. Mira el circuncentro O, el baricentro G y el ortocentro H, y compara las distancias OG y GH.',
      voz: 'Mueve A. Busca qué se mantiene entre O, G y H.',
      controles: [
        { id: 'ax', etiqueta: 'A a lo ancho', min: 0.5, max: 5, paso: 0.5, inicio: 1.5, unidad: '', decimales: 1, color: 'c-o' },
        { id: 'ay', etiqueta: 'A a lo alto', min: 3.5, max: 5, paso: 0.5, inicio: 4.5, unidad: '', decimales: 1, color: 'c-o' },
      ],
      dibujo: v => ({ datos: euler([v.ax, v.ay]), estado: {} }),
      // Se agarra el vértice A: O, G y H se mueven y siguen alineados.
      arrastres: [arrastreA((ax, ay) => euler([ax, ay]))],
      lectura: v => { const c = centros([v.ax, v.ay]); return [{ v: 'c-i', t: 'OG' }, ` = ${f(U.dist(c.O, c.G))}   ·   `, { v: 'c-h', t: 'GH' }, ` = ${f(U.dist(c.G, c.H))}`]; },
      minimo: 4,
    },
    predice: {
      pregunta: 'Hay una circunferencia que pasa por los puntos medios de los lados y por los pies de las alturas. Si el circunradio R mide 10, ¿cuál es su radio?',
      voz: 'Compárala con la circunferencia que pasa por A, B y C.',
      opciones: [
        { id: 'c', texto: '5', correcta: true },
        { id: 'igual', texto: '10', error: 'GE-EU1', siFuera: 'Igual a R sería la circunscrita. Esta pasa por puntos medios: queda a la mitad.' },
        { id: 'tercio', texto: '10/3', error: 'GE-EU2', siFuera: 'Un tercio viene de la razón del baricentro; aquí la escala es 1/2.' },
        { id: 'depende', texto: 'Depende de la forma del triángulo', error: 'GE-EU1', siFuera: 'Su centro sí depende de la forma; su radio siempre es la mitad de R.' },
      ],
      dibujo: { datos: euler(AE), estado: {} },
      revelar: { datos: euler(AE, { nueve: true }), estado: {} },
      coincide: 'Coincide: la circunferencia de los nueve puntos tiene radio R/2.',
    },
    mira: {
      datos: euler(AE, { nueve: true, pasos: { recta: 1, m: 2, f: 3, h: 4, n: 4 } }),
      voz: 'Primero la recta; después los nueve puntos, de tres en tres.',
      pasos: [
        { estado: { corte: 1 }, texto: 'O, G y H están alineados, con GH el doble de OG.', ecuacion: [{ v: 'c-h', t: 'GH' }, ' = 2 · ', { v: 'c-i', t: 'OG' }] },
        { estado: { corte: 2 }, texto: 'Los tres puntos medios de los lados…', ecuacion: ['M, M, M'] },
        { estado: { corte: 3 }, texto: '…los tres pies de las alturas…', ecuacion: ['F, F, F'] },
        { estado: { corte: 4 }, texto: '…y los puntos medios de AH, BH y CH: una circunferencia.', ecuacion: ['centro N = punto medio de OH', '   ·   ', 'radio = ', { frac: ['R', '2'] }] },
      ],
    },
    regla: {
      texto: 'O, G y H están alineados (recta de Euler), con GH = 2 · OG. El círculo de nueve puntos tiene centro en el medio de OH y radio R/2.',
      ecuacion: [{ v: 'c-h', t: 'GH' }, ' = 2 · ', { v: 'c-i', t: 'OG' }, '   ·   ', { llave: ['r₉'], nota: 'nueve puntos', color: 'c-d' }, ' = ', { llave: [{ frac: ['R', '2'] }], nota: 'mitad de R', color: 'c-d' }],
      condicion: 'el triángulo no es equilátero: en él los tres centros coinciden y no hay recta. R es el radio de la circunscrita.',
      voz: 'Tres puntos alineados, en razón 1 : 2. Comprueba el orden O, G, H.',
    },
    ahoraTu: {
      voz: 'Ubica el orden O, G, H y las razones 1 : 2.',
      generar(s) {
        const r = azar(s), d = r.ent(1, 9), t = s % 3;
        if (t === 2) {
          const R = 2 * r.ent(3, 15);
          return {
            pregunta: [`El circunradio de un triángulo mide ${R}. ¿Cuánto mide el radio de su circunferencia de nueve puntos?`],
            opciones: opciones(R / 2, [
              { id: 'igual', valor: R, error: 'GE-EU1', siFuera: 'Ese es el circunradio; la de nueve puntos mide la mitad.' },
              { id: 'tercio', valor: R / 3, error: 'GE-EU2', siFuera: 'Un tercio viene del baricentro; aquí es la mitad.' },
              { id: 'doble', valor: 2 * R, error: 'GE-EU1', siFuera: 'Es al revés: es la mitad, no el doble.' },
            ], n => f(n)),
            solucion: { texto: 'La circunferencia de nueve puntos tiene radio R/2.', ecuacion: [`${R} ÷ 2 = ${f(R / 2)}`] },
          };
        }
        const pideGH = t === 0;
        return {
          pregunta: pideGH ? ['En la recta de Euler de un triángulo, ', { v: 'c-i', t: 'OG' }, ` = ${d}. ¿Cuánto mide `, { v: 'c-h', t: 'GH' }, '?']
            : ['En la recta de Euler de un triángulo, ', { v: 'c-h', t: 'GH' }, ` = ${2 * d}. ¿Cuánto mide OH?`],
          opciones: opciones(pideGH ? 2 * d : 3 * d, pideGH ? [
            { id: 'igual', valor: d, error: 'GE-EU2', siFuera: 'G no es el punto medio de OH: GH es el doble de OG.' },
            { id: 'mitad', valor: d / 2, error: 'GE-EU2', siFuera: 'Es al revés: GH es el tramo largo.' },
            { id: 'triple', valor: 3 * d, error: 'GE-EU2', siFuera: 'Ese es OH completo.' },
          ] : [
            { id: 'gh', valor: 2 * d, error: 'GE-EU2', siFuera: 'Ese es solo GH; falta OG.' },
            { id: 'doble', valor: 4 * d, error: 'GE-EU2', siFuera: 'OG es la mitad de GH, no el doble.' },
            { id: 'og', valor: d, error: 'GE-EU2', siFuera: 'Ese es OG, el tramo corto.' },
          ], n => f(n)),
          solucion: { texto: 'OG : GH = 1 : 2.', ecuacion: pideGH ? [`GH = 2 · ${d} = ${2 * d}`] : [`OG = ${d} → OH = ${d} + ${2 * d} = ${3 * d}`] },
        };
      },
    },
  };

  // ---------- Laboratorio: juego libre, sin preguntas ----------
  // Mesa 1, más rica que la idea 2: los cuatro centros a la vez, con A libre en el plano (la idea lo deja a altura fija y
  // muestra un centro por vez). Deja buscar el rectángulo exacto, el isósceles con los centros alineados y el equilátero.
  const VCU = { x: [-3.4, 9.4], y: [-3.6, 7.4] };
  const cuatro = (ax, ay, circ) => {
    const A = [ax, ay], c = centros(A), fuera = ['O', 'H'].filter(k => !dentro(c[k], A));
    const lejos = p => p[0] < VCU.x[0] || p[0] > VCU.x[1] || p[1] < VCU.y[0] || p[1] > VCU.y[1];
    return {
      alt: `Triángulo ${tipo(A)}: baricentro e incentro dentro; circuncentro y ortocentro ${fuera.length ? `con ${fuera.map(k => NOMBRE[k]).join(' y ')} fuera` : 'dentro'}`,
      vista: VCU,
      puntos: [pt('A', A, { rotulo: 'A', lado: 90 }), pt('B', B, { rotulo: 'B', lado: -120 }), pt('C', C, { rotulo: 'C', lado: -60 }),
        ...['O', 'H', 'G', 'I'].filter(k => !lejos(c[k])).map(k => pt(k, c[k], { rotulo: k, color: { O: 'i', H: 'h', G: 'o', I: 'd' }[k], lado: { O: -30, H: 150, G: 30, I: -150 }[k] }))],
      regiones: [{ puntos: ['A', 'B', 'C'], color: 'i', opacidad: 0.08 }],
      circulos: circ === 'O' ? [{ centro: c.O, r: c.R, color: 'i', discontinua: true }] : circ === 'I' ? [{ centro: c.I, r: c.r, color: 'd' }] : [],
      segmentos: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'C', a: 'A' }],
    };
  };
  const mesaCuatro = {
    id: 'cuatro-centros', titulo: 'Los cuatro centros juntos', pieza: 'geo-figura',
    consigna: 'Arrastra A por todo el plano. Mira qué centros salen y cuándo se juntan. Elige qué circunferencia ver.',
    controles: [
      { id: 'ax', etiqueta: 'A a lo ancho', min: -2, max: 8, paso: 0.5, inicio: 1.5, unidad: '', decimales: 1, color: 'c-o' },
      { id: 'ay', etiqueta: 'A a lo alto', min: 1, max: 6, paso: 0.5, inicio: 4, unidad: '', decimales: 1, color: 'c-o' },
      { id: 'circ', etiqueta: 'Circunferencia', opciones: [{ valor: 'no', texto: 'ninguna' }, { valor: 'O', texto: 'circunscrita' }, { valor: 'I', texto: 'inscrita' }] },
    ],
    dibujo: v => ({ datos: cuatro(v.ax, v.ay, v.circ), estado: {} }),
    arrastres: [arrastreA((ax, ay) => cuatro(ax, ay, 'no'))],
    lectura: v => {
      const A = [v.ax, v.ay], c = centros(A), fuera = ['O', 'H'].filter(k => !dentro(c[k], A));
      return [`${tipo(A)}   ·   fuera: ${fuera.length ? fuera.join(' y ') : 'ninguno'}`];
    },
  };
  // Mesa 2, más rica que la idea 3: la circunferencia de nueve puntos siempre a la vista y A en un rango más amplio
  // (también obtusángulos, donde H sale del triángulo y la recta sigue).
  const mesaEuler = {
    id: 'euler-libre', titulo: 'Euler con nueve puntos', pieza: 'geo-figura',
    consigna: 'Arrastra A, también hasta un obtusángulo. Comprueba que O, G y H siguen en línea y el radio, R/2.',
    controles: [
      { id: 'ax', etiqueta: 'A a lo ancho', min: -1, max: 7, paso: 0.5, inicio: 1.5, unidad: '', decimales: 1, color: 'c-o' },
      { id: 'ay', etiqueta: 'A a lo alto', min: 2, max: 6, paso: 0.5, inicio: 4.5, unidad: '', decimales: 1, color: 'c-o' },
    ],
    dibujo: v => ({ datos: Object.assign(euler([v.ax, v.ay], { nueve: true }), { vista: { x: [-2.4, 8.4], y: [-3.4, 6.8] } }), estado: {} }),
    arrastres: [arrastreA((ax, ay) => Object.assign(euler([ax, ay], { nueve: true }), { vista: { x: [-2.4, 8.4], y: [-3.4, 6.8] } }))],
    lectura: v => {
      const c = centros([v.ax, v.ay]), og = U.dist(c.O, c.G);
      return [{ v: 'c-h', t: 'GH' }, ` : `, { v: 'c-i', t: 'OG' }, ` = ${og < 1e-6 ? '—' : f(U.dist(c.G, c.H) / og)}   ·   R/2 = ${f(c.R / 2)}`];
    },
  };
  // Mesa 3: las seis áreas del baricentro, que la idea 1 reserva para la predicción, con A libre y el área en vivo.
  const seisLibre = (ax, ay) => bari([ax, ay], { seis: true, alt: `Las medianas parten el triángulo en seis de área ${f(Math.abs(U.area([[ax, ay], B, C])) / 6)} cada uno` });
  const mesaSeis = {
    id: 'seis-areas', titulo: 'Seis triangulitos del baricentro', pieza: 'geo-figura',
    consigna: 'Arrastra A y deforma el triángulo. Mira el área de cada uno de los seis triangulitos.',
    controles: [
      { id: 'ax', etiqueta: 'A a lo ancho', min: -1, max: 7, paso: 0.5, inicio: 1, unidad: '', decimales: 1, color: 'c-o' },
      { id: 'ay', etiqueta: 'A a lo alto', min: 1, max: 5, paso: 0.5, inicio: 4.5, unidad: '', decimales: 1, color: 'c-o' },
    ],
    dibujo: v => ({ datos: seisLibre(v.ax, v.ay), estado: {} }),
    arrastres: [arrastreA(seisLibre)],
    lectura: v => { const S = Math.abs(U.area([[v.ax, v.ay], B, C])); return [`área ${f(S)}   ·   cada uno ${f(S / 6)}`]; },
  };

  return {
    unidad: 'geometria.puntos-notables',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/geo-figura.js'],
    historia: {
      texto: 'Los puntos notables no llegaron como un solo descubrimiento. La circunferencia de nueve puntos es un ejemplo: Brianchon y Poncelet describieron sus propiedades en 1821, y Feuerbach publicó en 1822 su tangencia con la inscrita y las exinscritas. Cada afirmación (qué puntos están, dónde está el centro, con qué es tangente) necesita su propia justificación.',
      pregunta: '¿Qué tienen en común nueve puntos tan distintos?',
      fuente: { titulo: 'K. S. Kedlaya, Geometry Unbound, cap. 7', url: 'https://kskedlaya.org/geometryunbound/gu-060118.pdf' },
    },
    // Laboratorio: los cuatro centros juntos con A libre, Euler con los nueve puntos y obtusángulos, y las seis áreas
    // del baricentro: las tres son más ricas que sus ideas.
    laboratorio: [mesaCuatro, mesaEuler, mesaSeis],
    ideas: [baricentro, centrosIdea, eulerIdea],
  };
});
