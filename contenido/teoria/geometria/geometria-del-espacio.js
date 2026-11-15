/*
 * Teoría de «Rectas y planos en el espacio» (geometria.geometria-del-espacio). Molde: docs/teoria.md.
 * Fuente: docs/teoria/matriz/geometria.json (unidad 13); Euclides, Elementos XI; Monge, Géométrie descriptive (1799).
 * Compañera: Neri (nutria). Pieza: geo-figura en 3D (proyección ortogonal).
 *
 * Ficha de tarea
 *   Promesa: elegir el triángulo o la sección correcta para medir un ángulo o una distancia en el espacio, sin medir
 *     el ángulo que se ve en el dibujo.
 *   Persona y condiciones: postulante de 5.º de secundaria, celular a 360 px, sin audio, quizás sin conexión.
 *   Resultado observable: decide si una recta es perpendicular a un plano; calcula proyecciones, ángulos recta-plano,
 *     distancias con tres perpendiculares, diedros y distancias entre rectas cruzadas; decide si tres caras forman
 *     un triedro.
 *   Orden de atención: 1.º la figura y su lectura · 2.º la pregunta · acción: «Comprobar» · fondo: Neri.
 *   Estados: jugando · predicción sin elegir · comprobada · paso de «Mira» · regla · caso nuevo.
 *   Duda que resuelve: «¿cuál de todos estos ángulos es el que se pide?».
 *
 * Fidelidad 3D: los ángulos rectos se dibujan como cuadraditos en el espacio (se ven como rombos en la proyección) y
 * los ángulos como arcos en su propio plano; la pieza no usa la marca de ángulo plana, que mediría el dibujo.
 * Colores por idea: lo que se da en naranja (c-o), lo perpendicular o auxiliar en turquesa (c-i), la proyección o la
 * segunda recta en verde (c-d), lo pedido en rojo (c-h).
 * Códigos: GE-ESP1 a GE-ESP8, hipótesis nuevas (rutinas/teoria-geometria.md).
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
  const SEP = '   ·   ';   // separa dos relaciones en una lectura o ecuación
  const nb = t => t.replace(/ /g, '\u00a0');   // una relación de la lectura no se parte entre dos líneas
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = l => l[Math.floor(r() * l.length)];
    return r;
  }
  // Opciones con textos ya armados: quita repetidos y deja la correcta primero.
  function opcionesTxt(correcta, distractores, n = 4) {
    const vistos = new Set([correcta]);
    const ops = [{ id: 'c', texto: correcta, correcta: true }];
    for (const d of distractores) {
      if (!d.texto || vistos.has(d.texto)) continue;
      vistos.add(d.texto);
      ops.push({ id: d.id, texto: d.texto, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, n);
  }
  const pt = (id, p, o = {}) => Object.assign({ id, x: p[0], y: p[1], z: p[2] }, o);
  // «k√n» con k simple: 5√3, √2, 2,5√2; n = 1 da el número solo.
  const raiz = (k, n) => (n === 1 ? f(k) : `${Math.abs(k - 1) < 1e-9 ? '' : f(k)}√${n}`);
  // Seno y coseno de los ángulos de examen como coeficiente por raíz: [coef, raíz].
  const SEN = { 30: [0.5, 1], 37: [0.6, 1], 45: [0.5, 2], 53: [0.8, 1], 60: [0.5, 3], 90: [1, 1] };
  const COS = { 30: [0.5, 3], 37: [0.8, 1], 45: [0.5, 2], 53: [0.6, 1], 60: [0.5, 1], 90: [0, 1] };

  // ---------- Vectores 3D (y hacia arriba, z hacia quien mira) ----------
  const sum = (...vs) => vs.reduce((s, v) => [s[0] + v[0], s[1] + v[1], s[2] + v[2]]);
  const por = (v, k) => [v[0] * k, v[1] * k, v[2] * k];
  const res = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const lar = v => Math.hypot(v[0], v[1], v[2]);
  const uni = v => por(v, 1 / lar(v));
  const pto = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  // Cuadradito de ángulo recto en el espacio, en el vértice V entre las direcciones u y w.
  const escuadra = (V, u, w, s = 0.32, o = {}) => Object.assign({ puntos: [V, sum(V, por(uni(u), s)), sum(V, por(uni(u), s), por(uni(w), s)), sum(V, por(uni(w), s))], sinBorde: false, opacidad: 0.05 }, o);
  // Arco del ángulo entre u y v, dibujado en su propio plano, y el punto donde va su rótulo.
  const arco3 = (V, u, v, r, n = 18) => {
    const a = uni(u), b = uni(v), c = Math.max(-1, Math.min(1, pto(a, b))), t = Math.acos(c), w = uni(res(b, por(a, c)));
    const p = k => sum(V, por(a, r * Math.cos(t * k)), por(w, r * Math.sin(t * k)));
    return { puntos: Array.from({ length: n + 1 }, (_, k) => p(k / n)), rotulo: sum(V, por(a, (r + 0.42) * Math.cos(t / 2)), por(w, (r + 0.42) * Math.sin(t / 2))) };
  };
  const TD = { giro: -32, alza: 24 };
  // Gesto directo (docs/teoria.md §4b): la manija vive en el viewBox de geo-figura. En 3D aPlano no sirve; para un
  // punto que se mueve en un plano del espacio (O + u·e1 + w·e2), enPlano invierte la proyección y da (u, w).
  // El lector ajusta cada valor al paso y al rango de su control.
  const enPantalla = (datos, p) => G.aPantalla(datos, p);
  const enPlano = (datos, O, e1, e2, p) => {
    const g = G.geometria(datos), a = g.S(O), b = g.S(sum(O, e1)), c = g.S(sum(O, e2));
    const m = [b[0] - a[0], b[1] - a[1], c[0] - a[0], c[1] - a[1]], x = p.x - a[0], y = p.y - a[1], det = m[0] * m[3] - m[2] * m[1];
    return [(x * m[3] - m[2] * y) / det, (m[0] * y - x * m[1]) / det];
  };
  const plano = (x = 3.6, z0 = -2.6, z1 = 2.6, o = {}) => Object.assign({ puntos: [[-x, 0, z0], [x, 0, z0], [x, 0, z1], [-x, 0, z1]], opacidad: 0.07, sinBorde: false }, o);

  // ---------- Idea 1: recta perpendicular a un plano ----------
  // Cambia: la inclinación de la varilla · Permanece: las dos rectas a y b del piso · Progresa: el ángulo con a ·
  // Se reserva: la varilla vertical · Debe verse: ser perpendicular a una sola recta del plano no basta.
  const varilla = (fi, o = {}) => {
    const k = o.pasos || {}, T = [3 * Math.sin(U.rad(fi)), 3 * Math.cos(U.rad(fi)), 0], O = [0, 0, 0];
    const conA = fi === 0 ? [] : [arco3(O, [1, 0, 0], T, 0.9)];
    return {
      alt: o.alt || `Varilla inclinada ${fi}° respecto de la vertical: forma 90° con la recta b del piso y ${90 - fi}° con la recta a`,
      tresD: TD, vista: { x: [-3.6, 3.6], y: [-2.2, 3.5] },
      puntos: [pt('O', O, { rotulo: 'O', lado: 225 }), pt('T', T, { rotulo: 'L', color: 'o', lado: 30, hasta: k.hT }), pt('a0', [-3.2, 0, 0], { sinPunto: true }), pt('a1', [3.2, 0, 0], { sinPunto: true, rotulo: 'a', lado: 0, desde: k.a || 0 }),
        pt('b0', [0, 0, -2.4], { sinPunto: true }), pt('b1', [0, 0, 2.4], { sinPunto: true, rotulo: 'b', lado: 250 }), pt('V', [0, 3, 0], { color: 'o', sinPunto: true, desde: k.v ?? 99 })],
      regiones: [plano(), escuadra(O, T, [0, 0, 1], 0.55, { color: 'd', hasta: k.hT }),
        ...(fi === 0 ? [escuadra(O, T, [1, 0, 0], 0.4, { color: 'i', desde: k.a || 0 })] : []),
        escuadra(O, [0, 1, 0], [1, 0, 0], 0.4, { color: 'i', desde: k.v ?? 99 }), escuadra(O, [0, 1, 0], [0, 0, 1], 0.4, { color: 'd', desde: k.v ?? 99 })],
      segmentos: [{ de: 'a0', a: 'a1', color: 'i', grosor: 'variable', desde: k.a || 0 }, { de: 'b0', a: 'b1', color: 'd', grosor: 'variable' },
        { de: 'O', a: 'T', color: 'o', grosor: 'variable', hasta: k.hT }, { de: 'O', a: 'V', color: 'o', grosor: 'variable', desde: k.v ?? 99 }],
      curvas: conA.map(c => ({ puntos: c.puntos, color: 'h', desde: k.a || 0, hasta: k.hT })),
      rotulos: conA.map(c => ({ x: c.rotulo[0], y: c.rotulo[1], z: c.rotulo[2], texto: `${90 - fi}°`, color: 'h', desde: k.a || 0, hasta: k.hT })),
    };
  };
  const perpIdea = {
    id: 'recta-perpendicular',
    titulo: 'Perpendicular a todo el plano',
    temas: ['Recta perpendicular a un plano'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'La varilla L sale del punto O del piso. Inclínala y mira qué ángulo forma con las rectas a y b del piso.',
      voz: 'Inclina la varilla. ¿Con cuál recta sigue a 90°?',
      controles: [{ id: 'fi', etiqueta: 'inclinación', min: 0, max: 60, paso: 15, inicio: 30, unidad: '°', decimales: 0, color: 'c-o' }],
      dibujo: v => ({ datos: varilla(v.fi), estado: {} }),
      // Se agarra la punta L de la varilla: gira alrededor de O en el plano vertical que contiene a la recta a.
      arrastres: [{ id: 'punta-l', etiqueta: 'punta de la varilla L', color: 'c-o',
        donde: v => enPantalla(varilla(v.fi), [3 * Math.sin(U.rad(v.fi)), 3 * Math.cos(U.rad(v.fi)), 0]),
        mover: (p, v) => { const [u, w] = enPlano(varilla(v.fi), [0, 0, 0], [1, 0, 0], [0, 1, 0], p); return { fi: U.grados(Math.atan2(u, w)) }; } }],
      lectura: v => [nb(`con a: ${90 - v.fi}°`), SEP, nb('con b: 90°'), SEP, v.fi === 0 ? 'L ⊥ piso' : 'L no es ⊥ al piso'],
      minimo: 3,
    },
    predice: {
      pregunta: 'Una varilla clavada en el piso forma 90° con una recta trazada en el piso. ¿Basta eso para que sea perpendicular al piso?',
      voz: 'Piensa en la varilla inclinada que acabas de mover.',
      opciones: [
        { id: 'c', texto: 'No: necesita dos rectas del piso que se corten', correcta: true },
        { id: 'si', texto: 'Sí: con una recta basta', error: 'GE-ESP1', siFuera: 'La varilla inclinada forma 90° con b y aun así está inclinada.' },
        { id: 'tres', texto: 'No: necesita tres rectas del piso', error: 'GE-ESP1', siFuera: 'Con dos rectas que se cortan ya alcanza; una tercera no agrega nada.' },
      ],
      dibujo: { datos: varilla(30, { pasos: { a: 99 } }), estado: {} },
      revelar: { datos: varilla(30), estado: {} },
      coincide: 'Coincide: inclinada, forma 90° con b pero 60° con a.',
    },
    mira: {
      datos: varilla(30, { pasos: { a: 1, hT: 1, v: 2 }, alt: 'La varilla inclinada forma 90° solo con b; la vertical forma 90° con a y con b' }),
      voz: 'Una sola recta no decide; dos rectas que se cortan sí.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Inclinada hacia a, la varilla sigue a 90° de b.', ecuacion: ['L ⊥ b'] },
        { estado: { corte: 1 }, texto: 'Pero con a forma 60°: no es perpendicular al piso.', ecuacion: ['L con a: 60°'] },
        { estado: { corte: 2 }, texto: 'Vertical, forma 90° con a y con b.', ecuacion: ['L ⊥ a  y  L ⊥ b'] },
        { estado: { corte: 2 }, texto: 'Entonces forma 90° con toda recta del piso que pase por O.', ecuacion: ['L ⊥ piso'] },
      ],
    },
    regla: {
      texto: 'Una recta es perpendicular a un plano si es perpendicular a dos rectas del plano que se cortan. Entonces es perpendicular a todas las rectas del plano.',
      ecuacion: [{ v: 'c-o', t: 'L' }, ' ⊥ ', { v: 'c-i', t: 'a' }, '  y  ', { v: 'c-o', t: 'L' }, ' ⊥ ', { v: 'c-d', t: 'b' }, '  ⇒  ', { v: 'c-o', t: 'L' }, ' ⊥ plano'],
      condicion: 'a y b se cortan. Dos rectas paralelas del plano no bastan.',
      voz: 'Dos rectas que se cortan. Una sola no alcanza.',
    },
    ahoraTu: {
      voz: 'El poste forma 90° con toda recta del piso que pase por su pie.',
      generar(s) {
        const r = azar(s), [p, q, h] = r.de([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [12, 16, 20], [7, 24, 25]]);
        const [alto, piso] = s % 4 < 2 ? [p, q] : [q, p];
        if (s % 2 === 0) return {
          pregunta: [`Un poste vertical de ${alto} m está en un piso horizontal. Un punto del piso está a ${piso} m del pie del poste. ¿Qué distancia hay desde la punta del poste hasta ese punto?`],
          opciones: opcionesTxt(`${h} m`, [
            { id: 'suma', texto: `${alto + piso} m`, error: 'GE-ESP1', siFuera: 'El camino por el pie es más largo que el cable recto.' },
            { id: 'alto', texto: `${alto} m`, error: 'GE-ESP1', siFuera: 'Esa es la altura; el punto está corrido en el piso.' },
            { id: 'resta', texto: `${f(Math.sqrt(Math.abs(alto * alto - piso * piso)))} m`, error: 'GE19', siFuera: 'Los catetos se suman al cuadrado; no se restan.' },
          ]),
          solucion: { texto: 'El poste forma 90° con la recta del piso: triángulo rectángulo.', ecuacion: [`√(${alto}² + ${piso}²) = ${h} m`] },
        };
        return {
          pregunta: [`Un cable de ${h} m va desde la punta de un poste vertical hasta un punto del piso a ${piso} m del pie. ¿Cuánto mide el poste?`],
          opciones: opcionesTxt(`${alto} m`, [
            { id: 'resta', texto: `${h - piso} m`, error: 'GE19', siFuera: 'Se restan los cuadrados, no las longitudes.' },
            { id: 'hip', texto: `${f(Math.sqrt(h * h + piso * piso))} m`, error: 'GE19', siFuera: 'El cable es la hipotenusa: los cuadrados se restan.' },
            { id: 'cable', texto: `${h} m`, error: 'GE-ESP1', siFuera: 'El cable va inclinado; el poste es más corto.' },
          ]),
          solucion: { texto: 'Poste, piso y cable forman un triángulo rectángulo.', ecuacion: [`√(${h}² − ${piso}²) = ${alto} m`] },
        };
      },
    },
  };

  // ---------- Idea 2: proyección ortogonal y ángulo recta-plano ----------
  // Cambia: el ángulo real y el giro de la cámara · Permanece: AB · Progresa: la proyección AB′ ·
  // Se reserva: el caso 10 y 30° · Debe verse: el ángulo dibujado cambia al girar; el real, no.
  const DIR = uni([1, 0, 0.35]), A2 = [-2.6, 0, -0.4];
  const puntaB = (th, L = 4.4) => sum(A2, por(DIR, L * Math.cos(U.rad(th))), [0, L * Math.sin(U.rad(th)), 0]);
  // o.L cambia el largo dibujado (laboratorio); con 0° o 90° no hay arco ni escuadra que dibujar sin dividir entre 0.
  const proyFig = (th, giro, o = {}) => {
    const k = o.pasos || {}, L = o.L || 4.4, A = A2, c = Math.cos(U.rad(th));
    const B = puntaB(th, L), Bp = sum(A, por(DIR, L * c)), ar = th > 0 ? arco3(A, DIR, res(B, A), Math.min(1.25, 0.6 * L)) : null;
    return {
      alt: o.alt || `Segmento AB que forma ${th}° con el plano; su proyección AB′ mide AB · cos ${th}°`,
      tresD: { giro, alza: 24 }, vista: { x: [-3.7, 3.7], y: [-2.1, 4.6] },
      puntos: [pt('A', A, { rotulo: 'A', lado: 200 }), pt('B', B, { rotulo: 'B', lado: 60, color: 'o' }), pt('Bp', Bp, { rotulo: "B'", lado: -30, color: 'd', desde: k.p || 0 })],
      regiones: [plano(), ...(th > 0 ? [escuadra(Bp, [0, 1, 0], th < 90 ? res(A, Bp) : por(DIR, -1), 0.3, { color: 'i', desde: k.p || 0 })] : [])],
      segmentos: [{ de: 'A', a: 'B', color: 'o', grosor: 'variable', texto: o.AB }, { de: 'B', a: 'Bp', color: 'i', discontinua: true, texto: o.BB, desde: k.p || 0 },
        { de: 'A', a: 'Bp', color: 'd', grosor: 'variable', texto: o.ABp, lado: 1, desde: k.p || 0 }],
      curvas: ar ? [{ puntos: ar.puntos, color: 'h', desde: k.a || 0 }] : [],
      rotulos: ar ? [{ x: ar.rotulo[0], y: ar.rotulo[1], z: ar.rotulo[2], texto: `${th}°`, color: 'h', desde: k.a || 0 }] : [],
    };
  };
  const proyIdea = {
    id: 'proyeccion-y-angulo',
    titulo: 'La sombra que mide el ángulo',
    temas: ['Proyección ortogonal', 'Ángulo entre recta y plano'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'B′ es el pie de la perpendicular desde B al plano. Cambia el ángulo real y gira la cámara: compara lo dibujado con lo real.',
      voz: 'Gira la cámara. El ángulo real no cambia; el dibujo sí.',
      controles: [
        { id: 'th', etiqueta: 'ángulo real', min: 15, max: 75, paso: 15, inicio: 30, unidad: '°', decimales: 0, color: 'c-h' },
        { id: 'giro', etiqueta: 'cámara', min: -60, max: 60, paso: 30, inicio: -30, unidad: '°', decimales: 0, color: 'c-i' },
      ],
      dibujo: v => ({ datos: proyFig(v.th, v.giro), estado: {} }),
      // Se agarra B: sube y baja por su arco en el plano vertical de AB′ (el ángulo real). La cámara queda en − y +.
      arrastres: [{ id: 'punta-b', etiqueta: 'punta B del segmento', color: 'c-h',
        donde: v => enPantalla(proyFig(v.th, v.giro), puntaB(v.th)),
        mover: (p, v) => { const [u, w] = enPlano(proyFig(v.th, v.giro), A2, DIR, [0, 1, 0], p); return { th: U.grados(Math.atan2(w, u)) }; } }],
      lectura: v => [nb(`ángulo real ${v.th}°`), SEP, nb(`AB′ = ${f(Math.cos(U.rad(v.th)), 3)} · AB`)],
      minimo: 4,
    },
    predice: {
      pregunta: 'Un segmento AB de 10 cm forma 30° con un plano. ¿Cuánto mide su proyección AB′ sobre el plano?',
      voz: 'La proyección y la perpendicular forman un triángulo rectángulo.',
      opciones: [
        { id: 'c', texto: '5√3 ≈ 8,66 cm', correcta: true },
        { id: 'sen', texto: '5 cm', error: 'GE-ESP2', siFuera: '5 cm es la altura BB′, el cateto opuesto a 30°.' },
        { id: 'igual', texto: '10 cm', error: 'GE-ESP3', siFuera: 'La proyección es más corta, salvo que AB sea paralelo al plano.' },
        { id: 'largo', texto: '10√3 ≈ 17,3 cm', error: 'GE-ESP3', siFuera: 'La proyección nunca es más larga que el segmento.' },
      ],
      dibujo: { datos: proyFig(30, -30, { AB: '10', pasos: { p: 99 } }), estado: {} },
      revelar: { datos: proyFig(30, -30, { AB: '10', ABp: '5√3', BB: '5' }), estado: {} },
      coincide: 'Coincide: 10 · cos 30° = 5√3.',
    },
    mira: {
      datos: proyFig(30, -30, { AB: '10', ABp: '5√3', BB: '5', pasos: { p: 1, a: 2 } }),
      voz: 'Baja la perpendicular; el ángulo se mide con la sombra.',
      pasos: [
        { estado: { corte: 0 }, texto: 'AB llega al plano en A.', ecuacion: ['AB = 10'] },
        { estado: { corte: 1 }, texto: 'Desde B, la perpendicular al plano cae en B′. AB′ es la proyección.', ecuacion: ["BB′ ⊥ plano"] },
        { estado: { corte: 2 }, texto: 'El ángulo con el plano es el de AB con AB′.', ecuacion: ['ángulo = 30°'] },
        { estado: { corte: 2 }, texto: 'En el triángulo rectángulo ABB′:', ecuacion: ["AB′ = 10 · cos 30° = 5√3", '   ·   ', "BB′ = 10 · sen 30° = 5"] },
      ],
    },
    regla: {
      texto: 'La proyección ortogonal de un segmento une los pies de las perpendiculares al plano. El ángulo entre una recta y un plano es el que forma con su proyección.',
      ecuacion: [{ llave: [{ v: 'c-d', t: "AB′" }], nota: 'la sombra', color: 'c-d' }, ' = ', { v: 'c-o', t: 'AB' }, ' · cos ', { v: 'c-h', t: 'θ' }, '   ·   ', { llave: [{ v: 'c-i', t: "BB′" }], nota: 'la altura', color: 'c-i' }, ' = ', { v: 'c-o', t: 'AB' }, ' · sen ', { v: 'c-h', t: 'θ' }],
      condicion: 'θ va de 0° a 90°. Se mide con la proyección, no con el dibujo ni con otra recta del plano.',
      voz: 'Primero la perpendicular; después el triángulo rectángulo.',
    },
    ahoraTu: {
      voz: 'Arma el triángulo rectángulo con la perpendicular al plano.',
      generar(s) {
        const r = azar(s), th = r.de([30, 37, 53, 60]), m = r.ent(1, 6), L = th === 37 || th === 53 ? 5 * m : 2 * m;
        const proy = raiz(L * COS[th][0], COS[th][1]), alto = raiz(L * SEN[th][0], SEN[th][1]), pideP = s % 2 === 0;
        return {
          pregunta: [`Un segmento de ${L} cm forma ${th}° con un plano. ¿Cuánto mide ${pideP ? 'su proyección sobre el plano' : 'la distancia de su extremo superior al plano'}?`],
          opciones: opcionesTxt(`${pideP ? proy : alto} cm`, [
            { id: 'cruz', texto: `${pideP ? alto : proy} cm`, error: 'GE-ESP2', siFuera: pideP ? 'Esa es la altura sobre el plano: lleva el seno.' : 'Esa es la proyección: lleva el coseno.' },
            { id: 'igual', texto: `${L} cm`, error: 'GE-ESP3', siFuera: 'El segmento está inclinado: sus catetos son más cortos.' },
            { id: 'doble', texto: `${raiz(2 * L * (pideP ? COS : SEN)[th][0], (pideP ? COS : SEN)[th][1])} cm`, error: 'GE-ESP3', siFuera: 'Un cateto no puede ser más largo que el segmento.' },
          ]),
          solucion: { texto: pideP ? 'Proyección: cateto junto al ángulo.' : 'Altura: cateto opuesto al ángulo.', ecuacion: [pideP ? `${L} · cos ${th}° = ${proy} cm` : `${L} · sen ${th}° = ${alto} cm`] },
        };
      },
    },
  };

  // ---------- Idea 3: teorema de las tres perpendiculares ----------
  // Cambia: la altura de P y la distancia de A a la recta l · Permanece: PA ⊥ plano · Progresa: PB ·
  // Se reserva: el caso 4, 3 · Debe verse: PB también es perpendicular a l.
  const tresFig = (h, d, o = {}) => {
    const k = o.pasos || {}, e = 0.7, xl = 2, A = [xl - d * e, 0, 0.3], B = [xl, 0, 0.3], P = [xl - d * e, h * e, 0.3];
    return {
      alt: o.alt || `PA perpendicular al plano mide ${h}; A está a ${d} de la recta l; PB mide √(${h}² + ${d}²) = ${f(Math.hypot(h, d))} y es perpendicular a l`,
      tresD: TD, vista: { x: [-3.8, 3.8], y: [-2.2, 3.2] },
      puntos: [pt('P', P, { rotulo: 'P', lado: 120 }), pt('A', A, { rotulo: 'A', lado: 220 }), pt('B', B, { rotulo: 'B', lado: -60, color: 'h', desde: k.b || 0 }),
        pt('l0', [xl, 0, -2.4], { sinPunto: true, rotulo: 'l', lado: 60 }), pt('l1', [xl, 0, 2.4], { sinPunto: true })],
      regiones: [plano(3.6, -2.4, 2.4), escuadra(A, [0, 1, 0], [1, 0, 0], 0.32, { color: 'i' }), escuadra(B, [-1, 0, 0], [0, 0, 1], 0.32, { color: 'd', desde: k.b || 0 }),
        escuadra(B, res(P, B), [0, 0, -1], 0.32, { color: 'h', desde: k.p || 0 })],
      segmentos: [{ de: 'l0', a: 'l1', grosor: 'contorno' }, { de: 'P', a: 'A', color: 'i', grosor: 'variable', texto: o.PA ?? `${h}`, lado: -1 },
        { de: 'A', a: 'B', color: 'd', grosor: 'variable', texto: o.AB ?? `${d}`, lado: -1, desde: k.b || 0 }, { de: 'P', a: 'B', color: 'h', grosor: 'variable', texto: o.PB, desde: k.p || 0 }],
    };
  };
  const E3 = 0.7, XL = 2;
  const tresArrastres = fig => [
    { id: 'punto-p', etiqueta: 'punto P', color: 'c-i',
      donde: v => enPantalla(fig(v), [XL - v.d * E3, v.h * E3, 0.3]),
      mover: (p, v) => ({ h: G.sobreRecta(fig(v), [XL - v.d * E3, 0, 0.3], [XL - v.d * E3, E3, 0.3], p) }) },
    { id: 'pie-a', etiqueta: 'pie A en el piso', color: 'c-d',
      donde: v => enPantalla(fig(v), [XL - v.d * E3, 0, 0.3]),
      mover: (p, v) => ({ d: G.sobreRecta(fig(v), [XL, 0, 0.3], [XL - E3, 0, 0.3], p) }) },
  ];
  const tresIdea = {
    id: 'tres-perpendiculares',
    titulo: 'Tres perpendiculares',
    temas: ['Teorema de las tres perpendiculares'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'PA es perpendicular al plano y AB es perpendicular a la recta l. Cambia la altura de P y la distancia de A a l.',
      voz: 'Mira el ángulo de PB con la recta l.',
      controles: [
        { id: 'h', etiqueta: 'PA', min: 1, max: 4, paso: 1, inicio: 3, unidad: '', decimales: 0, color: 'c-i' },
        { id: 'd', etiqueta: 'AB', min: 1, max: 4, paso: 1, inicio: 2, unidad: '', decimales: 0, color: 'c-d' },
      ],
      dibujo: v => ({ datos: tresFig(v.h, v.d, { PB: f(Math.hypot(v.h, v.d)) }), estado: {} }),
      // Se agarran P (sube y baja por la perpendicular PA) y A (se acerca o se aleja de l, por el piso).
      arrastres: tresArrastres(v => tresFig(v.h, v.d, { PB: f(Math.hypot(v.h, v.d)) })),
      lectura: v => [nb(`PB = √(${v.h}² + ${v.d}²) = ${f(Math.hypot(v.h, v.d))}`), SEP, nb('PB ⊥ l')],
      minimo: 4,
    },
    predice: {
      pregunta: 'PA es perpendicular al plano y mide 4. La recta l del plano está a 3 de A. ¿Cuál es la distancia de P a la recta l?',
      voz: 'La distancia a una recta va por la perpendicular a ella.',
      opciones: [
        { id: 'c', texto: '5', correcta: true },
        { id: 'pa', texto: '4', error: 'GE-ESP4', siFuera: '4 es la distancia de P al plano, no a la recta l.' },
        { id: 'ab', texto: '3', error: 'GE-ESP4', siFuera: '3 es la distancia de A a l; P está más arriba.' },
        { id: 'suma', texto: '7', error: 'GE-ESP4', siFuera: 'El camino P → A → B es más largo que el directo PB.' },
      ],
      dibujo: { datos: tresFig(4, 3, { pasos: { b: 99, p: 99 }, AB: '' }), estado: {} },
      revelar: { datos: tresFig(4, 3, { PB: '5' }), estado: {} },
      coincide: 'Coincide: PB = √(16 + 9) = 5.',
    },
    mira: {
      datos: tresFig(4, 3, { PB: '5', pasos: { b: 1, p: 2 } }),
      voz: 'Tres perpendiculares: al plano, a la recta y la que resulta.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Primera: PA es perpendicular al plano.', ecuacion: ['PA ⊥ plano'] },
        { estado: { corte: 1 }, texto: 'Segunda: desde A, la perpendicular a l cae en B.', ecuacion: ['AB ⊥ l'] },
        { estado: { corte: 2 }, texto: 'Tercera: PB también es perpendicular a l. Es la distancia de P a l.', ecuacion: ['PB ⊥ l'] },
        { estado: { corte: 2 }, texto: 'PAB es rectángulo en A.', ecuacion: ['PB = √(4² + 3²) = 5'] },
      ],
    },
    regla: {
      texto: 'Si PA es perpendicular a un plano y AB es perpendicular a una recta l del plano, entonces PB también es perpendicular a l.',
      ecuacion: [{ v: 'c-i', t: 'PA' }, ' ⊥ plano,  ', { v: 'c-d', t: 'AB' }, ' ⊥ l  ⇒  ', { v: 'c-h', t: 'PB' }, ' ⊥ l', '   ·   ', { llave: [{ sup: [{ v: 'c-h', t: 'PB' }, '2'] }], nota: 'distancia a l', color: 'c-h' }, ' = ', { sup: [{ v: 'c-i', t: 'PA' }, '2'] }, ' + ', { sup: [{ v: 'c-d', t: 'AB' }, '2'] }],
      condicion: 'A y B están en el plano; B es el pie de la perpendicular desde A a l.',
      voz: 'Primero al plano, luego a la recta. La tercera sale sola.',
    },
    ahoraTu: {
      voz: 'Ubica el triángulo rectángulo PAB, recto en A.',
      generar(s) {
        const r = azar(s), [p, q, h] = r.de([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [12, 16, 20]]);
        const [pa, ab] = s % 4 < 2 ? [p, q] : [q, p];
        if (s % 2 === 0) return {
          pregunta: [`PA es perpendicular a un plano y mide ${pa}. Una recta l del plano está a ${ab} de A. ¿Cuál es la distancia de P a la recta l?`],
          opciones: opcionesTxt(`${h}`, [
            { id: 'pa', texto: `${pa}`, error: 'GE-ESP4', siFuera: 'Esa es la distancia de P al plano.' },
            { id: 'suma', texto: `${pa + ab}`, error: 'GE-ESP4', siFuera: 'El camino quebrado es más largo que PB.' },
            { id: 'ab', texto: `${ab}`, error: 'GE-ESP4', siFuera: 'Esa es la distancia de A a l.' },
          ]),
          solucion: { texto: 'PB es perpendicular a l por las tres perpendiculares.', ecuacion: [`PB = √(${pa}² + ${ab}²) = ${h}`] },
        };
        return {
          pregunta: [`PA es perpendicular a un plano. La distancia de P a una recta l del plano es ${h}, y la de A a l es ${ab}. ¿Cuánto mide PA?`],
          opciones: opcionesTxt(`${pa}`, [
            { id: 'resta', texto: `${h - ab}`, error: 'GE19', siFuera: 'Se restan los cuadrados, no las longitudes.' },
            { id: 'pb', texto: `${h}`, error: 'GE-ESP4', siFuera: 'PB va inclinado; PA es más corto.' },
            { id: 'hip', texto: f(Math.hypot(h, ab)), error: 'GE19', siFuera: 'PB es la hipotenusa: los cuadrados se restan.' },
          ]),
          solucion: { texto: 'PAB es rectángulo en A.', ecuacion: [`PA = √(${h}² − ${ab}²) = ${pa}`] },
        };
      },
    },
  };

  // ---------- Idea 4: ángulo diedro ----------
  // Cambia: la abertura del diedro · Permanece: la distancia de P a la arista · Progresa: la altura de P sobre la otra cara ·
  // Se reserva: el caso 60° · Debe verse: el diedro se mide con dos perpendiculares a la arista.
  const diedroFig = (al, o = {}) => {
    // o.r: largo dibujado de OP; o.vista: marco del laboratorio. Con diedro obtuso, H cae en la prolongación del piso.
    const k = o.pasos || {}, c = Math.cos(U.rad(al)), sn = Math.sin(U.rad(al)), u2 = [c, sn, 0], O = [0, 0, 0.6], rP = o.r || 2.6, P = sum(O, por(u2, rP)), H = [rP * c, 0, 0.6];
    const ar = arco3(O, [1, 0, 0], u2, 0.85), cara = (u, w) => [[0, 0, -1.8], [0, 0, 1.8], sum([0, 0, 1.8], por(u, w)), sum([0, 0, -1.8], por(u, w))];
    return {
      alt: o.alt || `Diedro de ${al}°: P está en una cara a ${o.d || 'd'} de la arista; su distancia a la otra cara es ${o.d || 'd'} · sen ${al}°`,
      tresD: { giro: -50, alza: 25 }, vista: o.vista || { x: [-2.1, 2.9], y: [-1.7, 3.1] },
      puntos: [pt('O', O, { rotulo: 'O', lado: 200 }), pt('P', P, { rotulo: 'P', lado: 120, color: 'o' }), pt('Q', [3.1, 0, 0.6], { sinPunto: true }), pt('H', H, { rotulo: 'H', lado: -60, color: 'h', desde: k.h || 0 }),
        pt('e0', [0, 0, -1.8], { sinPunto: true }), pt('e1', [0, 0, 1.8], { sinPunto: true, rotulo: 'arista', lado: 200 })],
      regiones: [{ puntos: cara([1, 0, 0], 3.4), opacidad: 0.08, sinBorde: false }, { puntos: cara(u2, 3.4), color: 'o', opacidad: 0.08, sinBorde: false },
        ...(al > 90 ? [{ puntos: cara([-1, 0, 0], 2.8), opacidad: 0.03, discontinua: true }] : []),
        escuadra(O, [1, 0, 0], [0, 0, -1], 0.3, { desde: k.a || 0 }), escuadra(O, u2, [0, 0, -1], 0.3, { desde: k.a || 0 }), escuadra(H, [0, 1, 0], [c >= 0 ? -1 : 1, 0, 0], 0.26, { color: 'h', desde: k.h || 0 })],
      segmentos: [{ de: 'e0', a: 'e1', grosor: 'contorno' }, { de: 'O', a: 'Q', color: 'i', grosor: 'variable', desde: k.a || 0 }, { de: 'O', a: 'P', color: 'o', grosor: 'variable', texto: o.d },
        { de: 'P', a: 'H', color: 'h', grosor: 'variable', discontinua: true, texto: o.PH, lado: 1, desde: k.h || 0 }],
      curvas: [{ puntos: ar.puntos, color: 'i', desde: k.a || 0 }],
      rotulos: [{ x: ar.rotulo[0], y: ar.rotulo[1], z: ar.rotulo[2], texto: `${al}°`, color: 'i', desde: k.a || 0 }],
    };
  };
  const diedroIdea = {
    id: 'diedro',
    titulo: 'El diedro se mide de canto',
    temas: ['Ángulo diedro'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Dos semiplanos comparten la arista. Ábrelos como una puerta. El diedro se mide con dos perpendiculares a la arista desde O.',
      voz: 'Abre la puerta. Mira cuánto sube P sobre el piso.',
      controles: [{ id: 'al', etiqueta: 'diedro', min: 15, max: 90, paso: 15, inicio: 45, unidad: '°', decimales: 0, color: 'c-i' }],
      dibujo: v => ({ datos: diedroFig(v.al, { d: '4', PH: f(4 * Math.sin(U.rad(v.al))) }), estado: {} }),
      // Se agarra P y se abre la puerta: P gira alrededor de O en el plano perpendicular a la arista.
      arrastres: [{ id: 'punto-p', etiqueta: 'punto P de la puerta', color: 'c-i',
        donde: v => enPantalla(diedroFig(v.al), sum([0, 0, 0.6], por([Math.cos(U.rad(v.al)), Math.sin(U.rad(v.al)), 0], 2.6))),
        mover: (p, v) => { const [u, w] = enPlano(diedroFig(v.al), [0, 0, 0.6], [1, 0, 0], [0, 1, 0], p); return { al: U.grados(Math.atan2(w, u)) }; } }],
      lectura: v => [nb('OP = 4'), SEP, nb(`PH = 4 · sen ${v.al}° = ${f(4 * Math.sin(U.rad(v.al)))}`)],
      minimo: 3,
    },
    predice: {
      pregunta: 'Un diedro mide 60°. Un punto P de una cara está a 6 cm de la arista. ¿A qué distancia está P de la otra cara?',
      voz: 'Ubica el ángulo plano del diedro: perpendicular a la arista.',
      opciones: [
        { id: 'c', texto: '3√3 ≈ 5,2 cm', correcta: true },
        { id: 'cos', texto: '3 cm', error: 'GE-ESP2', siFuera: '3 = 6 · cos 60° es la sombra de OP en la otra cara.' },
        { id: 'arista', texto: '6 cm', error: 'GE-ESP5', siFuera: '6 es la distancia a la arista; a la cara es la perpendicular, más corta.' },
        { id: 'tan', texto: '6√3 ≈ 10,4 cm', error: 'GE-ESP5', siFuera: 'Un cateto no puede superar a OP, que mide 6.' },
      ],
      dibujo: { datos: diedroFig(60, { d: '6', pasos: { h: 99 } }), estado: {} },
      revelar: { datos: diedroFig(60, { d: '6', PH: '3√3' }), estado: {} },
      coincide: 'Coincide: 6 · sen 60° = 3√3.',
    },
    mira: {
      datos: diedroFig(60, { d: '6', PH: '3√3', pasos: { a: 1, h: 2 } }),
      voz: 'El ángulo plano del diedro se arma perpendicular a la arista.',
      pasos: [
        { estado: { corte: 0 }, texto: 'OP es perpendicular a la arista, en una cara.', ecuacion: ['OP = 6'] },
        { estado: { corte: 1 }, texto: 'Otra perpendicular a la arista, en la otra cara. Entre ambas, el diedro.', ecuacion: ['ángulo plano = 60°'] },
        { estado: { corte: 2 }, texto: 'PH es perpendicular a la otra cara: triángulo OHP, recto en H.', ecuacion: ['PH = 6 · sen 60° = 3√3'] },
      ],
    },
    regla: {
      texto: 'Un diedro se mide con su ángulo plano: dos perpendiculares a la arista, una en cada cara, desde el mismo punto.',
      ecuacion: ['distancia de P a la otra cara = ', { llave: [{ v: 'c-o', t: 'OP' }], nota: 'a la arista', color: 'c-o' }, ' · sen ', { llave: [{ v: 'c-i', t: 'α' }], nota: 'ángulo plano', color: 'c-i' }],
      condicion: 'OP es perpendicular a la arista y α es el ángulo plano del diedro, hasta 90°.',
      voz: 'Corta el diedro con un plano perpendicular a la arista.',
    },
    ahoraTu: {
      voz: 'Arma el ángulo plano y el triángulo rectángulo.',
      generar(s) {
        const r = azar(s), al = r.de([30, 37, 45, 53, 60]), m = r.ent(1, 6), d = al === 37 || al === 53 ? 5 * m : 2 * m;
        const ok = raiz(d * SEN[al][0], SEN[al][1]), cs = raiz(d * COS[al][0], COS[al][1]);
        return {
          pregunta: [`Un diedro mide ${al}°. Un punto P de una de sus caras está a ${d} cm de la arista. ¿A qué distancia está P de la otra cara?`],
          opciones: opcionesTxt(`${ok} cm`, [
            { id: 'cos', texto: `${cs} cm`, error: 'GE-ESP2', siFuera: 'Eso es la sombra sobre la otra cara: lleva el coseno.' },
            { id: 'arista', texto: `${d} cm`, error: 'GE-ESP5', siFuera: 'Esa es la distancia a la arista.' },
            { id: 'doble', texto: `${raiz(2 * d * SEN[al][0], SEN[al][1])} cm`, error: 'GE-ESP5', siFuera: 'Un cateto no puede superar la distancia a la arista.' },
          ]),
          solucion: { texto: 'Cateto opuesto al ángulo plano.', ecuacion: [`${d} · sen ${al}° = ${ok} cm`] },
        };
      },
    },
  };

  // ---------- Idea 5: distancia entre rectas cruzadas ----------
  // Cambia: el par de rectas del cubo · Permanece: el cubo · Progresa: el segmento perpendicular común ·
  // Se reserva: arista con diagonal de la base · Debe verse: la distancia es el único segmento perpendicular a las dos.
  const C3 = [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]];
  const CARAS = [['P4', 'P5', 'P6', 'P7'], ['P1', 'P0', 'P3', 'P2'], ['P5', 'P1', 'P2', 'P6'], ['P0', 'P4', 'P7', 'P3'], ['P7', 'P6', 'P2', 'P3'], ['P0', 'P1', 'P5', 'P4']];
  const NOM = { P4: 'A', P5: 'B', P1: 'C', P0: 'D', P7: 'E', P6: 'F', P2: 'G', P3: 'H' };
  const LADO = { P4: 225, P5: -45, P1: -20, P0: 200, P7: 150, P6: 30, P2: 20, P3: 150 };
  const PARES = {
    aa: { l1: ['P4', 'P5'], l2: ['P1', 'P2'], m: [1, -1, 1], n: [1, -1, -1], txt: 'AB y CG', k: [1, 1] },
    ad: { l1: ['P4', 'P7'], l2: ['P5', 'P0'], m: [-1, -1, 1], n: [0, -1, 0], txt: 'AE y BD', k: [0.5, 2] },
    dd: { l1: ['P4', 'P1'], l2: ['P6', 'P3'], m: [0, -1, 0], n: [0, 1, 0], txt: 'AC y FH', k: [1, 1] },
  };
  const cuboFig = (par, a, o = {}) => {
    const k = o.pasos || {}, q = PARES[par], X = id => C3[+id.slice(1)];
    const d1 = res(X(q.l1[1]), X(q.l1[0])), d2 = res(X(q.l2[1]), X(q.l2[0])), mn = res(q.n, q.m);
    return {
      alt: o.alt || `Cubo de arista ${a}: las rectas cruzadas ${q.txt} están a ${raiz(a * q.k[0], q.k[1])}, la longitud de su perpendicular común`,
      tresD: TD, vista: { x: [-2.1, 2.1], y: [-1.95, 2.05] },
      puntos: [...C3.map((p, i) => pt('P' + i, p, { sinPunto: true, rotulo: NOM['P' + i], lado: LADO['P' + i] })), pt('M', q.m, { color: 'h', desde: k.m || 0 }), pt('N', q.n, { color: 'h', desde: k.m || 0 })],
      solidos: [{ caras: CARAS }],
      regiones: [escuadra(q.m, d1, mn, 0.22, { color: 'h', desde: k.m || 0 }), escuadra(q.n, d2, por(mn, -1), 0.22, { color: 'h', desde: k.m || 0 })],
      segmentos: [{ de: q.l1[0], a: q.l1[1], color: 'o', grosor: 'variable' }, { de: q.l2[0], a: q.l2[1], color: 'd', grosor: 'variable' },
        { de: 'M', a: 'N', color: 'h', grosor: 'variable', discontinua: par === 'dd', texto: o.d, desde: k.m || 0 }],
    };
  };
  const cruzIdea = {
    id: 'rectas-cruzadas',
    titulo: 'Rectas que se cruzan sin tocarse',
    temas: ['Distancia entre rectas cruzadas'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Elige un par de rectas del cubo de arista 4. No se cortan ni son paralelas. El segmento rojo es perpendicular a las dos.',
      voz: 'Cambia el par. Busca el segmento que hace 90° con ambas.',
      controles: [{ id: 'par', etiqueta: 'rectas', opciones: [{ valor: 'aa', texto: 'AB y CG' }, { valor: 'ad', texto: 'AE y BD' }, { valor: 'dd', texto: 'AC y FH' }] }],
      dibujo: v => ({ datos: cuboFig(v.par, 4, { d: raiz(4 * PARES[v.par].k[0], PARES[v.par].k[1]) }), estado: {} }),
      lectura: v => [`${PARES[v.par].txt}: distancia ${raiz(4 * PARES[v.par].k[0], PARES[v.par].k[1])}`],
      minimo: 2,
    },
    predice: {
      pregunta: 'En un cubo de arista 4, ¿cuál es la distancia entre la arista AE y la diagonal BD de la base?',
      voz: 'Busca el punto de BD más cercano a la arista.',
      opciones: [
        { id: 'c', texto: '2√2', correcta: true },
        { id: 'arista', texto: '4', error: 'GE-ESP6', siFuera: '4 es la distancia a B o a D; el punto medio de BD está más cerca.' },
        { id: 'diag', texto: '4√2', error: 'GE-ESP6', siFuera: '4√2 es la diagonal BD misma, no la distancia.' },
        { id: 'mitad', texto: '2', error: 'GE-ESP6', siFuera: '2 es media arista; el segmento va en diagonal por la base.' },
      ],
      dibujo: { datos: cuboFig('ad', 4, { pasos: { m: 99 } }), estado: {} },
      revelar: { datos: cuboFig('ad', 4, { d: '2√2' }), estado: {} },
      coincide: 'Coincide: la mitad de la diagonal AC, 2√2.',
    },
    mira: {
      datos: cuboFig('ad', 4, { d: '2√2', pasos: { m: 1 } }),
      voz: 'Solo un segmento es perpendicular a las dos rectas.',
      pasos: [
        { estado: { corte: 0 }, texto: 'AE es vertical; BD está en la base. No se cortan ni son paralelas.', ecuacion: ['AE y BD se cruzan'] },
        { estado: { corte: 1 }, texto: 'AM, hasta el centro de la base, va por el piso: perpendicular a AE.', ecuacion: ['AM ⊥ AE'] },
        { estado: { corte: 1 }, texto: 'Y perpendicular a BD: las diagonales del cuadrado se cortan a 90°.', ecuacion: ['AM ⊥ BD'] },
        { estado: { corte: 1 }, texto: 'Mide media diagonal de la base.', ecuacion: ['AM = ', { frac: ['4√2', '2'] }, ' = 2√2'] },
      ],
    },
    regla: {
      texto: 'Dos rectas cruzadas no se cortan ni son paralelas. Su distancia es la longitud del único segmento perpendicular a las dos.',
      ecuacion: ['d = ', { llave: [{ v: 'c-h', t: 'MN' }], nota: 'perpendicular común', color: 'c-h' }, ',  con  ', { v: 'c-h', t: 'MN' }, ' ⊥ ', { v: 'c-o', t: 'L₁' }, '  y  ', { v: 'c-h', t: 'MN' }, ' ⊥ ', { v: 'c-d', t: 'L₂' }],
      condicion: 'las rectas no se cortan ni son paralelas; cualquier otro segmento entre ellas es más largo que MN.',
      voz: 'Busca el segmento que hace 90° con las dos.',
    },
    ahoraTu: {
      voz: 'Ubica la perpendicular común dentro del cubo.',
      generar(s) {
        const r = azar(s), a = r.ent(2, 10), par = ['aa', 'ad', 'dd'][s % 3], q = PARES[par];
        const ok = raiz(a * q.k[0], q.k[1]);
        return {
          pregunta: [`En un cubo ABCD-EFGH de arista ${a} (ABCD es la base, AE una arista vertical), ¿cuál es la distancia entre las rectas cruzadas ${q.txt}?`],
          dibujo: { datos: cuboFig(par, a, { pasos: { m: 99 }, alt: `Cubo de arista ${a} con las rectas ${q.txt} marcadas` }), estado: {} },
          opciones: opcionesTxt(ok, [
            { id: 'arista', texto: f(a), error: 'GE-ESP6', siFuera: 'Esa es la arista: revisa qué segmento es perpendicular a las dos.' },
            { id: 'diag', texto: raiz(a, 2), error: 'GE-ESP6', siFuera: 'Esa es una diagonal de cara, no la distancia.' },
            { id: 'esp', texto: raiz(a, 3), error: 'GE-ESP6', siFuera: 'Esa es la diagonal del cubo.' },
            { id: 'media', texto: raiz(a * 0.5, 2), error: 'GE-ESP6', siFuera: 'Media diagonal de cara: revisa si el segmento común va por ahí.' },
          ]),
          solucion: { texto: par === 'ad' ? 'De A al centro de la base: media diagonal.' : 'El segmento común es una arista o une los centros de dos caras.', ecuacion: [`d = ${ok}`] },
        };
      },
    },
  };

  // ---------- Idea 6: ángulo triedro ----------
  // Cambia: las tres caras · Permanece: el vértice O · Progresa: si el desarrollo cierra en punta ·
  // Se reserva: 150°, 120° y 100° · Debe verse: dos condiciones a la vez (desigualdad y suma menor que 360°).
  const triedroFig = (a, b, c) => {
    const R = 2.6, O = [0, 0], colores = ['o', 'i', 'd'], cortes = [0, a, a + b, a + b + c];
    return {
      alt: `Desarrollo de un triedro con caras de ${a}°, ${b}° y ${c}°: suman ${a + b + c}°; ${cierra(a, b, c) ? 'al plegarlo cierra en punta' : 'al plegarlo no cierra'}`,
      vista: { x: [-3.2, 3.2], y: [-3.2, 3.2] },
      puntos: [pt('O', O, { rotulo: 'O', lado: 250 }), pt('E0', U.polar(O, R, -90), { sinPunto: true }), pt('E3', U.polar(O, R, -90 + a + b + c), { sinPunto: true })],
      regiones: [0, 1, 2].map(i => ({ puntos: [O, ...U.arco(O, R, -90 + cortes[i], -90 + cortes[i + 1], 24)], color: colores[i], opacidad: 0.22, sinBorde: false })),
      segmentos: [{ de: 'O', a: 'E0', color: 'h', grosor: 'variable' }, { de: 'O', a: 'E3', color: 'h', grosor: 'variable' }],
      rotulos: [0, 1, 2].map(i => { const m = U.polar(O, R * 0.62, -90 + (cortes[i] + cortes[i + 1]) / 2); return { x: m[0], y: m[1], texto: `${[a, b, c][i]}°`, color: colores[i] }; }),
    };
  };
  // Borde i: está a −90° + (suma de las caras hasta la i). El ángulo desde el borde anterior es la cara i;
  // pasado de largo hacia atrás (más de 265°) cuenta como negativo y el lector lo deja en el mínimo.
  const CARA = ['a', 'b', 'c'], COLCARA = ['c-o', 'c-i', 'c-d'];
  const triArrastres = CARA.map((id, i) => ({
    id: `borde-${i + 1}`, etiqueta: `borde final de la cara ${i + 1}`, color: COLCARA[i],
    donde: v => enPantalla(triedroFig(v.a, v.b, v.c), U.polar([0, 0], 2.6, -90 + CARA.slice(0, i + 1).reduce((s, k) => s + v[k], 0))),
    mover: (p, v) => {
      const q = G.aPlano(triedroFig(v.a, v.b, v.c), p), prev = -90 + CARA.slice(0, i).reduce((s, k) => s + v[k], 0);
      let d = ((U.grados(Math.atan2(q[1], q[0])) - prev) % 360 + 360) % 360;
      if (d > 265) d -= 360;
      return { [id]: d };
    },
  }));
  function cierra(a, b, c) { const m = Math.max(a, b, c); return a + b + c < 360 && m < a + b + c - m; }
  const trIdea = {
    id: 'triedro',
    titulo: 'Tres caras que cierran',
    temas: ['Ángulo triedro'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Las tres caras de un triedro, abiertas sobre la mesa. Al plegarlas, los dos bordes rojos deben juntarse en una arista. Cambia las caras.',
      voz: 'Prueba caras grandes y una muy chica. ¿Cierra la punta?',
      controles: [
        { id: 'a', etiqueta: 'cara 1', min: 20, max: 170, paso: 10, inicio: 80, unidad: '°', decimales: 0, color: 'c-o' },
        { id: 'b', etiqueta: 'cara 2', min: 20, max: 170, paso: 10, inicio: 100, unidad: '°', decimales: 0, color: 'c-i' },
        { id: 'c', etiqueta: 'cara 3', min: 20, max: 170, paso: 10, inicio: 120, unidad: '°', decimales: 0, color: 'c-d' },
      ],
      dibujo: v => ({ datos: triedroFig(v.a, v.b, v.c), estado: {} }),
      // Se agarra el borde final de cada cara: abrirlo agranda esa cara y corre las siguientes.
      arrastres: triArrastres,
      lectura: v => {
        const m = Math.max(v.a, v.b, v.c), resto = v.a + v.b + v.c - m;
        return [nb(`suma ${v.a + v.b + v.c}° ${v.a + v.b + v.c < 360 ? '<' : '≥'} 360°`), SEP, nb(`mayor ${m}° ${m < resto ? '<' : '≥'} ${resto}°`), SEP, cierra(v.a, v.b, v.c) ? 'cierra' : nb('no cierra')];
      },
      minimo: 4,
    },
    predice: {
      pregunta: '¿Pueden 150°, 120° y 100° ser las tres caras de un triedro?',
      voz: 'Revisa las dos condiciones, no solo una.',
      opciones: [
        { id: 'c', texto: 'No: suman más de 360°', correcta: true },
        { id: 'si', texto: 'Sí: cada una es menor que la suma de las otras', error: 'GE-ESP7', siFuera: 'Esa condición se cumple, pero suman 370°: al plegar se montan.' },
        { id: 'desig', texto: 'No: 150° supera a la suma de las otras', error: 'GE-ESP8', siFuera: '120° + 100° = 220°, que es mayor que 150°.' },
      ],
      dibujo: { datos: triedroFig(150, 120, 100), estado: {} },
      revelar: { datos: triedroFig(150, 120, 100), estado: {} },
      coincide: 'Coincide: 370° no caben alrededor de un vértice.',
    },
    mira: {
      datos: triedroFig(150, 120, 100),
      voz: 'Dos condiciones, y las dos tienen que cumplirse.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Al plegar el desarrollo, los bordes rojos deben juntarse sin montarse.', ecuacion: ['150° + 120° + 100° = 370°'] },
        { estado: { corte: 0 }, texto: 'Las caras ya pasan de una vuelta: se montan.', ecuacion: ['370° ≥ 360°'] },
        { estado: { corte: 0 }, texto: 'La otra condición sí se cumple, pero no basta.', ecuacion: ['150° < 120° + 100°'] },
      ],
    },
    regla: {
      texto: 'En un triedro, cada cara es menor que la suma de las otras dos, y las tres juntas suman menos de 360°.',
      ecuacion: [{ v: 'c-o', t: 'α' }, ' < ', { v: 'c-i', t: 'β' }, ' + ', { v: 'c-d', t: 'γ' }, '   ·   ', { v: 'c-o', t: 'α' }, ' + ', { v: 'c-i', t: 'β' }, ' + ', { v: 'c-d', t: 'γ' }, ' < 360°'],
      condicion: 'las tres caras son de un mismo vértice; basta revisar la desigualdad con la cara mayor.',
      voz: 'Mayor contra la suma de las otras; y total contra 360°.',
    },
    ahoraTu: {
      voz: 'Revisa la cara mayor y la suma total.',
      generar(s) {
        const r = azar(s);
        if (s % 2 === 0) {
          const tipo = (s / 2) % 3;
          let tri;
          if (tipo === 0) { const a = 10 * r.ent(4, 12), b = 10 * r.ent(4, 12); const lo = Math.abs(a - b) / 10 + 1, hi = Math.min(a + b, 360 - a - b) / 10 - 1; tri = [a, b, 10 * r.ent(lo, Math.max(lo, hi))]; }
          else if (tipo === 1) { const a = 10 * r.ent(11, 16), b = 10 * r.ent(11, 16); tri = [a, b, 10 * r.ent(Math.max(36 - (a + b) / 10, 2), 16)]; }
          else { const a = 10 * r.ent(3, 6), b = 10 * r.ent(3, 6); tri = [a, b, 10 * r.ent((a + b) / 10 + 1, 17)]; }
          const [a, b, c] = tri, m = Math.max(a, b, c), suma = a + b + c;
          const correcta = suma >= 360 ? 'suma' : m >= suma - m ? 'desig' : 'si';
          const textos = { si: 'Sí, forman un triedro', suma: 'No: suman 360° o más', desig: 'No: una cara no es menor que la suma de las otras' };
          const err = { si: ['GE-ESP7', 'Revisa la suma total y la cara mayor.'], suma: ['GE-ESP7', `Suman ${suma}°, menos de 360°.`], desig: ['GE-ESP8', `La mayor, ${m}°, es menor que ${suma - m}°.`] };
          const ops = [{ id: 'c', texto: textos[correcta], correcta: true }, ...['si', 'suma', 'desig'].filter(x => x !== correcta).map(x => ({ id: x, texto: textos[x], error: err[x][0], siFuera: err[x][1] }))];
          return {
            pregunta: [`¿Pueden ${a}°, ${b}° y ${c}° ser las tres caras de un triedro?`],
            opciones: ops,
            solucion: { texto: `Suma ${suma}°; la mayor, ${m}°, contra ${suma - m}°.`, ecuacion: [`${suma}° ${suma < 360 ? '<' : '≥'} 360°`, SEP, `${m}° ${m < suma - m ? '<' : '≥'} ${suma - m}°`] },
          };
        }
        const a = 10 * r.ent(5, 13), b = 10 * r.ent(4, 9), lo = Math.abs(a - b), hi = Math.min(a + b, 360 - a - b);
        const ok = 10 * Math.round((lo + hi) / 20);
        const malos = [{ id: 'bajo', v: lo, e: 'GE-ESP8', t: `Con ${lo}° la mayor iguala a la suma de las otras: no cierra.` },
          { id: 'alto', v: hi, e: hi === a + b ? 'GE-ESP8' : 'GE-ESP7', t: hi === a + b ? `Con ${hi}° esa cara iguala a ${a}° + ${b}°.` : `Con ${hi}° las tres suman 360°.` },
          { id: 'muy', v: hi + 20, e: 'GE-ESP7', t: 'Revisa la suma total y la cara mayor.' }];
        return {
          pregunta: [`Dos caras de un triedro miden ${a}° y ${b}°. ¿Cuál de estos valores puede medir la tercera cara?`],
          opciones: opcionesTxt(`${ok}°`, malos.filter(x => x.v > 0 && x.v !== ok).map(x => ({ id: x.id, texto: `${x.v}°`, error: x.e, siFuera: x.t }))),
          solucion: { texto: `La tercera va entre ${lo}° y ${hi}°, sin llegar a ninguno.`, ecuacion: [`${lo}° < ${ok}° < ${hi}°`] },
        };
      },
    },
  };

  // ---------- Laboratorio: juego libre, sin preguntas ----------
  // Mesa 1, más rica que la idea 2: también cambia el largo de AB, y el ángulo llega a 0° (AB acostado: la sombra es
  // el segmento entero) y a 90° (AB de pie: la sombra es un punto). Se arrastra B en su plano vertical: ángulo y largo.
  const ESC = 0.9;
  // Motor de la mesa: la sombra AB′ = AB · cos θ y la altura BB′ = AB · sen θ. Dibujo, lectura y retos usan estas dos.
  const largoSombra = v => v.ab * Math.cos(U.rad(v.th)), alturaB = v => v.ab * Math.sin(U.rad(v.th));
  const casi = (x, y) => Math.abs(x - y) < 1e-9;
  const sombra = v => proyFig(v.th, v.giro, { L: ESC * v.ab, AB: f(v.ab), ABp: f(largoSombra(v)), BB: v.th > 0 ? f(alturaB(v)) : '',
    alt: `Segmento AB de ${f(v.ab)} a ${v.th}° del plano: su sombra AB′ mide ${f(largoSombra(v))} y la altura BB′, ${f(alturaB(v))}` });
  const mesaSombra = {
    id: 'sombra-libre', titulo: 'Sombra de cualquier segmento', pieza: 'geo-figura',
    consigna: 'Arrastra B: cambia el ángulo y el largo de AB. Prueba 0° y 90°. Gira la cámara y compara la sombra.',
    controles: [
      { id: 'th', etiqueta: 'ángulo real', min: 0, max: 90, paso: 5, inicio: 30, unidad: '°', decimales: 0, color: 'c-h' },
      { id: 'ab', etiqueta: 'AB', min: 1, max: 4, paso: 0.5, inicio: 4, unidad: '', decimales: 1, color: 'c-o' },
      { id: 'giro', etiqueta: 'cámara', min: -60, max: 60, paso: 10, inicio: -30, unidad: '°', decimales: 0, color: 'c-i' },
    ],
    dibujo: v => ({ datos: sombra(v), estado: {} }),
    arrastres: [{ id: 'punta-b', etiqueta: 'punta B del segmento', color: 'c-h',
      donde: v => enPantalla(sombra(v), puntaB(v.th, ESC * v.ab)),
      mover: (p, v) => { const [u, w] = enPlano(sombra(v), A2, DIR, [0, 1, 0], p); return { th: U.grados(Math.atan2(w, u)), ab: Math.hypot(u, w) / ESC }; } }],
    lectura: v => [nb(`θ = ${v.th}°`), SEP, nb(`AB = ${f(v.ab)}`), SEP, nb(`AB′ = ${f(largoSombra(v))}`), SEP, nb(`BB′ = ${f(alturaB(v))}`)],
    // Retos (docs/teoria.md §4d): cada logrado usa largoSombra y alturaB, las mismas que dibujan.
    invitaciones: [
      { texto: 'Haz que la sombra AB′ mida justo la mitad de AB.',
        logrado: v => casi(largoSombra(v), v.ab / 2),
        bien: 'La mitad pide θ = 60°: cos 60° = 1/2, con cualquier largo de AB.' },
      { texto: 'Consigue que la sombra de AB se reduzca a un solo punto.',
        logrado: v => casi(largoSombra(v), 0),
        bien: 'AB de pie, a 90°: la sombra es solo el punto A.' },
      { texto: 'Haz que la sombra AB′ y la altura BB′ midan lo mismo.',
        logrado: v => v.th > 0 && v.th < 90 && casi(largoSombra(v), alturaB(v)),
        bien: 'A 45° los dos catetos son iguales: el triángulo ABB′ es isósceles.' },
      { texto: 'Guarda dos casos con la misma sombra AB′ y distinto ángulo real.',
        logrado: (v, guardados) => guardados.some(g => g.th !== v.th && casi(largoSombra(g), largoSombra(v)))
          && guardados.some(g => g.th === v.th && g.ab === v.ab && g.giro === v.giro),
        bien: 'La misma sombra no dice el ángulo: también importa el largo de AB.' },
      { texto: 'Guarda dos casos con el mismo AB y ángulo, y otra cámara.',
        logrado: (v, guardados) => guardados.some(g => g.th === v.th && g.ab === v.ab && g.giro !== v.giro)
          && guardados.some(g => g.th === v.th && g.ab === v.ab && g.giro === v.giro),
        bien: 'El dibujo cambió y AB′ no: el ángulo real no depende de la cámara.' },
    ],
  };
  // Mesa 2, más rica que la idea 3: A puede caer sobre la recta l (AB = 0, entonces PB = PA) y las medidas van de
  // medio en medio. Se arrastran P y A, como en la idea.
  // Motor de la mesa: PB = √(PA² + AB²), por las tres perpendiculares.
  const largoPB = v => Math.hypot(v.h, v.d);
  const tresLibre = v => tresFig(v.h, v.d, { PA: f(v.h), AB: v.d > 0 ? f(v.d) : '', PB: f(largoPB(v)),
    alt: `PA de ${f(v.h)} perpendicular al plano y A a ${f(v.d)} de la recta l: PB mide ${f(largoPB(v))} y es perpendicular a l` });
  const mesaTres = {
    id: 'tres-perpendiculares-libre', titulo: 'Tres perpendiculares sin límites', pieza: 'geo-figura',
    consigna: 'Arrastra P y A. Lleva A hasta la recta l: ¿qué pasa con PB? Compara PB con PA y AB.',
    controles: [
      { id: 'h', etiqueta: 'PA', min: 0.5, max: 4, paso: 0.5, inicio: 3, unidad: '', decimales: 1, color: 'c-i' },
      { id: 'd', etiqueta: 'AB', min: 0, max: 4, paso: 0.5, inicio: 2, unidad: '', decimales: 1, color: 'c-d' },
    ],
    dibujo: v => ({ datos: tresLibre(v), estado: {} }),
    arrastres: tresArrastres(tresLibre),
    lectura: v => [nb(`PA = ${f(v.h)}`), SEP, nb(`AB = ${f(v.d)}`), SEP, nb(`PB = ${f(largoPB(v))}`)],
    invitaciones: [
      { texto: 'Haz que la distancia PB de P a la recta l mida justo 5.',
        logrado: v => casi(largoPB(v), 5),
        bien: 'PA y AB de 3 y 4: el triángulo PAB es el 3-4-5.' },
      { texto: 'Con PA = 2, busca la distancia PB más corta posible.',
        logrado: v => v.h === 2 && largoPB(v) <= v.h + 1e-9,
        bien: 'A sobre l: PB = PA. Más cerca de l, imposible.' },
      { texto: 'Consigue que el triángulo PAB tenga sus dos catetos iguales.',
        logrado: v => v.d > 0 && casi(v.h, v.d),
        bien: 'PA = AB: PB mide PA · √2, como la diagonal de un cuadrado.' },
      { texto: 'Guarda dos casos con la misma PB y distinta altura PA.',
        logrado: (v, guardados) => guardados.some(g => g.h !== v.h && casi(largoPB(g), largoPB(v)))
          && guardados.some(g => g.h === v.h && g.d === v.d),
        bien: 'P más alto y A más cerca de l dan la misma distancia.' },
    ],
  };
  // Mesa 3, más rica que la idea 4: el diedro pasa de 90° (obtuso: H cae en la prolongación de la otra cara) y OP
  // cambia. Se arrastra P: el ángulo y la distancia a la arista a la vez.
  const RD = 0.65, VD = { x: [-3.4, 2.9], y: [-1.9, 3.1] };
  // Motor de la mesa: PH = OP · sen α es la distancia a la otra cara; OH = OP · cos α dice dónde cae H (negativo: fuera).
  const largoPH = v => v.d * Math.sin(U.rad(v.al)), pieH = v => v.d * Math.cos(U.rad(v.al));
  const diedroLibre = v => diedroFig(v.al, { r: RD * v.d, vista: VD, d: f(v.d), PH: f(largoPH(v)),
    alt: `Diedro de ${v.al}°: P a ${f(v.d)} de la arista está a ${f(largoPH(v))} de la otra cara${v.al > 90 ? '; H cae en la prolongación de esa cara' : ''}` });
  const mesaDiedro = {
    id: 'diedro-abierto', titulo: 'Diedro hasta obtuso', pieza: 'geo-figura',
    consigna: 'Arrastra P: abre la puerta más allá de 90° y aléjala de la arista. Mira dónde cae H.',
    controles: [
      { id: 'al', etiqueta: 'diedro', min: 15, max: 165, paso: 15, inicio: 120, unidad: '°', decimales: 0, color: 'c-i' },
      { id: 'd', etiqueta: 'OP', min: 1, max: 4, paso: 0.5, inicio: 4, unidad: '', decimales: 1, color: 'c-o' },
    ],
    dibujo: v => ({ datos: diedroLibre(v), estado: {} }),
    arrastres: [{ id: 'punto-p', etiqueta: 'punto P de la puerta', color: 'c-i',
      donde: v => enPantalla(diedroLibre(v), sum([0, 0, 0.6], por([Math.cos(U.rad(v.al)), Math.sin(U.rad(v.al)), 0], RD * v.d))),
      mover: (p, v) => { const [u, w] = enPlano(diedroLibre(v), [0, 0, 0.6], [1, 0, 0], [0, 1, 0], p); return { al: U.grados(Math.atan2(w, u)), d: Math.hypot(u, w) / RD }; } }],
    lectura: v => [nb(`α = ${v.al}°`), SEP, nb(`OP = ${f(v.d)}`), SEP, nb(`PH = ${f(largoPH(v))}${v.al > 90 ? ', H fuera' : ''}`)],
    invitaciones: [
      { texto: 'Haz que P quede justo a 2 de la otra cara.',
        logrado: v => casi(largoPH(v), 2),
        bien: 'OP y el diedro se compensan. ¿Hay otra manera de llegar a 2?' },
      { texto: 'Con OP = 3, aleja P lo más posible de la otra cara.',
        logrado: v => v.d === 3 && largoPH(v) >= v.d - 1e-9,
        bien: 'A 90° el seno vale 1: PH llega a medir lo mismo que OP.' },
      { texto: 'Consigue que H caiga sobre la otra cara, no en su prolongación.',
        logrado: v => pieH(v) > 1e-9,
        bien: 'Con diedro agudo, H cae en la cara; con obtuso, fuera de ella.' },
      { texto: 'Guarda dos diedros distintos con el mismo OP y la misma PH.',
        logrado: (v, guardados) => guardados.some(g => g.al !== v.al && g.d === v.d && casi(largoPH(g), largoPH(v)))
          && guardados.some(g => g.al === v.al && g.d === v.d),
        bien: 'α y 180° − α tienen el mismo seno: la misma distancia.' },
    ],
  };

  return {
    unidad: 'geometria.geometria-del-espacio',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/geo-figura.js'],
    historia: {
      texto: 'Un dibujo en perspectiva deforma ángulos y longitudes. En 1799, Gaspard Monge publicó un método para representar un objeto con dos proyecciones ortogonales sobre planos perpendiculares: la planta y el alzado. Con ellas, ingenieros y canteros podían medir en el papel las longitudes y los ángulos reales de una pieza antes de cortarla.',
      pregunta: '¿Por qué el ángulo que ves dibujado no siempre es el real?',
      fuente: { titulo: 'Euclides, Elementos XI (edición de D. E. Joyce)', url: 'https://math.clarku.edu/~djoyce/java/elements/bookXI/bookXI.html' },
    },
    // Glosario por tema (docs/teoria.md §4d): lo que esta unidad estrena en el curso. «Plano», «perpendicular»,
    // «perpendicular al plano», «proyección», «arista», «cara» y «cubo» salen antes en el curso (hasta Simetría); el
    // lector los marca con su definición de allá.
    glosario: [
      { termino: 'pie de la perpendicular', def: 'Punto donde toca el plano, o la recta, la línea que baja a 90° desde un punto.',
        ver: ['proyección ortogonal'] },
      { termino: 'proyección ortogonal', def: 'Sombra que deja una figura sobre un plano cuando cada punto baja a 90° hasta él.',
        ejemplo: 'Un segmento de 10 a 30° del plano deja una sombra de 5√3 ≈ 8,66.', ver: ['pie de la perpendicular', 'ángulo con el plano', 'proyección'] },
      { termino: 'ángulo con el plano', formas: ['ángulo con el plano', 'ángulo entre una recta y un plano'],
        def: 'El que forma una recta con su sombra sobre ese plano. Va de 0° a 90°.',
        ejemplo: 'Si la sombra mide la mitad del segmento, el ángulo es 60°.', ver: ['proyección ortogonal'] },
      { termino: 'tres perpendiculares', formas: ['teorema de las tres perpendiculares', 'tres perpendiculares'],
        def: 'Teorema: si PA cae a 90° sobre un plano y AB forma 90° con una recta l suya, PB también.',
        ejemplo: 'PA = 4 y AB = 3: la distancia de P a l es PB = 5.', ver: ['pie de la perpendicular', 'perpendicular al plano'] },
      { termino: 'diedro', formas: ['ángulo diedro', 'diedro', 'diedros'],
        def: 'Abertura entre dos semiplanos que comparten su borde recto, como una puerta entreabierta y la pared.',
        ejemplo: 'Abierto 60°: un punto a 6 de la bisagra queda a 3√3 ≈ 5,2 de la pared.', ver: ['semiplano', 'ángulo plano', 'arista'] },
      { termino: 'semiplano', def: 'Mitad de un plano: la parte que queda a un lado de una recta, que le sirve de borde.' },
      { termino: 'ángulo plano', formas: ['ángulo plano del diedro', 'ángulo plano'],
        def: 'Medida de un diedro: dos rayos a 90° de la arista, uno en cada cara, desde un mismo punto.', ver: ['diedro'] },
      { termino: 'rectas cruzadas', formas: ['rectas cruzadas', 'recta cruzada'],
        def: 'Dos rectas del espacio que no se cortan ni son paralelas: no caben en un mismo plano.',
        ejemplo: 'En un cubo, una arista vertical y una diagonal de la base que no la toca.', ver: ['perpendicular común'] },
      { termino: 'perpendicular común', def: 'Único segmento que forma 90° con dos rectas cruzadas a la vez. Su largo es la distancia entre ellas.',
        ejemplo: 'En un cubo de arista 4, entre AE y BD mide 2√2.', ver: ['rectas cruzadas'] },
      { termino: 'triedro', def: 'Rincón de tres caras planas que salen de un mismo vértice, como la esquina de una caja.',
        ejemplo: 'Caras de 80°, 100° y 120°: suman 300°, menos de 360°, y cierran.', ver: ['desarrollo'] },
      { termino: 'desarrollo', def: 'Figura plana que se obtiene al abrir las caras de un sólido o de un rincón sobre la mesa.' },
      { termino: 'perspectiva', def: 'Manera de dibujar en el papel un objeto de tres dimensiones tal como se ve desde un lugar.' },
      { termino: 'planta', def: 'Vista de un objeto desde arriba, proyectada a 90° sobre el piso.', ver: ['alzado', 'proyección ortogonal'] },
      { termino: 'alzado', def: 'Vista de un objeto de frente, proyectada a 90° sobre un plano vertical.', ver: ['planta'] },
    ],
    // Laboratorio: las tres mesas son más ricas que sus ideas (rango completo, caso límite y un control más).
    laboratorio: [mesaSombra, mesaTres, mesaDiedro],
    ideas: [perpIdea, proyIdea, tresIdea, diedroIdea, cruzIdea, trIdea],
  };
});
