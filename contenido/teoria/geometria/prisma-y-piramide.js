/*
 * Teoría de «Prisma y pirámide» (geometria.prisma-y-piramide). Molde: docs/teoria.md.
 * Fuente: docs/teoria/matriz/geometria.json (unidad 15); Euclides, Elementos XI y XII; papiro de Moscú, problema 14.
 * Compañera: Neri (nutria). Pieza: geo-figura en 3D; sólidos armados con su casco convexo.
 *
 * Ficha de tarea
 *   Promesa: separar altura de arista y de apotema, y área de volumen, en prismas, pirámides y sus troncos.
 *   Persona y condiciones: postulante de 5.º de secundaria, celular a 360 px, sin audio, quizás sin conexión.
 *   Resultado observable: calcula volumen de prismas rectos y oblicuos, diagonal y área de un ortoedro, área lateral
 *     y volumen de una pirámide regular, volumen de troncos de pirámide y de prisma triangular, y escala k², k³.
 *   Orden de atención: 1.º la figura y su lectura · 2.º la pregunta · acción: «Comprobar» · fondo: Neri.
 *   Estados: jugando · predicción sin elegir · comprobada · paso de «Mira» · regla · caso nuevo.
 *   Duda que resuelve: «¿la arista inclinada es la altura?» y «¿por qué el tronco no es el promedio de las bases?».
 *
 * Colores por idea: lo dado en naranja (c-o), lo auxiliar en turquesa (c-i), la base o el área en verde (c-d) y lo
 * pedido en rojo (c-h). Los segmentos que pasan por dentro del sólido van discontinuos.
 * Códigos: GE2, GE13, GE14, GE20, GE21 (docs/investigacion/geometria-ideas-erroneas.md); GE-PP1 a GE-PP4 son
 * hipótesis nuevas (rutinas/teoria-geometria.md).
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
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = l => l[Math.floor(r() * l.length)];
    return r;
  }
  function opciones(correcta, distractores, fmt = x => f(x), n = 4) {
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
  const pt = (id, p, o = {}) => Object.assign({ id, x: p[0], y: p[1], z: p[2] }, o);
  const frac = (a, b) => ({ frac: [a, b] });

  // ---------- Vectores, casco convexo y marcas 3D ----------
  const sum = (...vs) => vs.reduce((s, v) => [s[0] + v[0], s[1] + v[1], s[2] + v[2]]);
  const por = (v, k) => [v[0] * k, v[1] * k, v[2] * k];
  const res = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const cruz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const pto = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const uni = v => por(v, 1 / Math.hypot(v[0], v[1], v[2]));
  function casco(P) {
    const caras = [], vistas = new Set(), n = P.length;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) for (let k = j + 1; k < n; k++) {
      const c = cruz(res(P[j], P[i]), res(P[k], P[i]));
      if (Math.hypot(...c) < 1e-9) continue;
      let nr = uni(c), d = pto(nr, P[i]);
      const lados = P.map(p => pto(nr, p) - d);
      if (lados.every(x => x >= -1e-7)) { nr = por(nr, -1); d = -d; } else if (!lados.every(x => x <= 1e-7)) continue;
      const cop = P.map((p, m) => m).filter(m => Math.abs(pto(nr, P[m]) - d) < 1e-7), clave = cop.join(',');
      if (vistas.has(clave)) continue;
      vistas.add(clave);
      const cen = por(cop.reduce((s, m) => sum(s, P[m]), [0, 0, 0]), 1 / cop.length);
      const u = uni(res(P[cop[0]], cen)), w = cruz(nr, u), ang = m => Math.atan2(pto(res(P[m], cen), w), pto(res(P[m], cen), u));
      caras.push(cop.sort((a, b) => ang(a) - ang(b)));
    }
    return caras;
  }
  const escuadra = (V, u, w, s = 0.28, o = {}) => Object.assign({ puntos: [V, sum(V, por(uni(u), s)), sum(V, por(uni(u), s), por(uni(w), s)), sum(V, por(uni(w), s))], sinBorde: false, opacidad: 0.05 }, o);
  const arco3 = (V, u, v, r, n = 16) => {
    const a = uni(u), b = uni(v), c = Math.max(-1, Math.min(1, pto(a, b))), t = Math.acos(c), w = uni(res(b, por(a, c)));
    const p = k => sum(V, por(a, r * Math.cos(t * k)), por(w, r * Math.sin(t * k)));
    return { puntos: Array.from({ length: n + 1 }, (_, k) => p(k / n)), rotulo: sum(V, por(a, (r + 0.55) * Math.cos(t / 2)), por(w, (r + 0.55) * Math.sin(t / 2))) };
  };
  const TD = { giro: -28, alza: 22 };
  const SEP = '   ·   ';   // separa dos relaciones en una lectura o ecuación
  const nb = t => t.replace(/ /g, '\u00a0');   // una relación de la lectura no se parte entre dos líneas
  // Gesto directo (docs/teoria.md §4b): la manija vive en el viewBox de geo-figura. En 3D aPlano no sirve: cada manija
  // corre por una recta del espacio (arista, altura, diagonal) y G.sobreRecta da el parámetro t a lo largo de ella;
  // la recta se elige para que t sea justo el valor del control. El lector ajusta al paso y al rango.
  const enPantalla = (datos, p) => G.aPantalla(datos, p);
  const sobre = (datos, A, B, p) => G.sobreRecta(datos, A, B, p);
  const enPlano = (datos, O, e1, e2, p) => {
    const g = G.geometria(datos), a = g.S(O), b = g.S(sum(O, e1)), c = g.S(sum(O, e2));
    const m = [b[0] - a[0], b[1] - a[1], c[0] - a[0], c[1] - a[1]], x = p.x - a[0], y = p.y - a[1], det = m[0] * m[3] - m[2] * m[1];
    return [(x * m[3] - m[2] * y) / det, (m[0] * y - x * m[1]) / det];
  };
  // Sólido desde una lista de puntos: ids S0…; color y desde/hasta opcionales.
  const solido = (P, pre, o = {}) => ({
    puntos: P.map((p, i) => pt(pre + i, p, { sinPunto: true, desde: o.desde, hasta: o.hasta })),
    solido: Object.assign({ caras: casco(P).map(c => c.map(i => pre + i)), color: o.color || 'd' }, o.desde !== undefined ? { desde: o.desde } : {}, o.hasta !== undefined ? { hasta: o.hasta } : {}),
  });
  const rot = (p, texto, color, o = {}) => Object.assign({ x: p[0], y: p[1], z: p[2], texto, color }, o);

  // ---------- Idea 1: prisma recto y oblicuo ----------
  // Cambia: la inclinación de las aristas laterales · Permanece: base y altura · Progresa: la arista se alarga ·
  // Se reserva: arista 10 a 53° · Debe verse: el volumen usa la altura perpendicular, no la arista.
  const prismaFig = (th, o = {}) => {
    const k = o.pasos || {}, h = 2.5, dx = h / Math.tan(U.rad(th)), y0 = -1.25;
    const base = [[-1, y0, -1], [1, y0, -1], [1, y0, 1], [-1, y0, 1]].map(p => [p[0] - dx / 2, p[1], p[2]]);
    const tope = base.map(p => [p[0] + dx, p[1] + h, p[2]]), S = solido([...base, ...tope], 'S');
    const T = tope[2], Hp = [T[0], y0, T[2]], ar = arco3(base[2], res(T, base[2]), [1, 0, 0], 0.8);
    return {
      alt: o.alt || `Prisma de base cuadrada con aristas laterales a ${th}° de la base: la altura perpendicular no cambia y el volumen tampoco`,
      tresD: TD, vista: { x: [-3.2, 3.2], y: [-2.3, 2.3] },
      puntos: [...S.puntos, pt('T', T, { sinPunto: true }), pt('Hp', Hp, { color: 'h', sinPunto: th === 90, desde: k.h || 0 }), pt('B2', base[2], { sinPunto: true })],
      solidos: [S.solido],
      regiones: [{ puntos: base, color: 'd', opacidad: 0.2, desde: k.b || 0 }, ...(th < 90 ? [escuadra(Hp, [0, 1, 0], [-1, 0, 0], 0.26, { color: 'h', desde: k.h || 0 })] : [])],
      segmentos: [{ de: 'B2', a: 'T', color: 'o', grosor: 'variable', texto: o.arista, lado: -1 }, ...(th < 90 ? [{ de: 'T', a: 'Hp', color: 'h', grosor: 'variable', discontinua: true, texto: o.h, desde: k.h || 0 }] : [])],
      curvas: th < 90 && o.angulo ? [{ puntos: ar.puntos, color: 'i' }] : [],
      rotulos: [...(th < 90 && o.angulo ? [rot(ar.rotulo, `${th}°`, 'i')] : []), ...(o.B ? [rot(sum(base[0], [0.9, 0, 1.25]), o.B, 'd', { desde: k.b || 0 })] : [])],
    };
  };
  const prismaIdea = {
    id: 'prisma',
    titulo: 'La altura no es la arista',
    temas: ['Prisma recto, oblicuo y regular', 'Áreas y volúmenes'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Inclina el prisma. La base mide 4 y la altura (roja) se mantiene en 2,5. Mira la arista lateral y el volumen.',
      voz: 'Inclina. La arista se alarga; ¿cambia el volumen?',
      controles: [{ id: 'th', etiqueta: 'arista con la base', min: 45, max: 90, paso: 15, inicio: 60, unidad: '°', decimales: 0, color: 'c-o' }],
      dibujo: v => ({ datos: prismaFig(v.th, { h: '2,5', arista: f(2.5 / Math.sin(U.rad(v.th))) }), estado: {} }),
      // Se agarra la esquina de arriba T y se corre de lado a la misma altura: la arista se inclina, h no cambia.
      // T = (1 + dx/2, 1,25, 1) con dx = h / tan θ; la recta de arriba da t = dx/2.
      arrastres: [{ id: 'esquina-t', etiqueta: 'esquina de arriba del prisma', color: 'c-o',
        donde: v => enPantalla(prismaFig(v.th), [1 + 1.25 / Math.tan(U.rad(v.th)), 1.25, 1]),
        mover: (p, v) => ({ th: U.grados(Math.atan2(2.5, 2 * sobre(prismaFig(v.th), [1, 1.25, 1], [2, 1.25, 1], p))) }) }],
      lectura: v => [nb(`arista = ${f(2.5 / Math.sin(U.rad(v.th)))}`), SEP, nb('V = 4 · 2,5 = 10')],
      minimo: 3,
    },
    predice: {
      pregunta: 'Un prisma oblicuo tiene base de 12 cm². Sus aristas laterales miden 10 cm y forman 53° con la base. ¿Cuál es su volumen?',
      voz: 'Busca la altura perpendicular a la base.',
      opciones: [
        { id: 'c', texto: '96 cm³', correcta: true },
        { id: 'arista', texto: '120 cm³', error: 'GE21', siFuera: '120 usa la arista inclinada como altura.' },
        { id: 'cos', texto: '72 cm³', error: 'GE-PP1', siFuera: '72 usa 10 · cos 53° = 6, la sombra de la arista, no la altura.' },
        { id: 'tercio', texto: '40 cm³', error: 'GE20', siFuera: 'El tercio es de la pirámide; el prisma es base por altura.' },
      ],
      dibujo: { datos: prismaFig(53, { arista: '10', B: '12', angulo: true, pasos: { h: 99 } }), estado: {} },
      revelar: { datos: prismaFig(53, { arista: '10', B: '12', h: '8', angulo: true }), estado: {} },
      coincide: 'Coincide: altura 10 · sen 53° = 8 y V = 12 · 8.',
    },
    mira: {
      datos: prismaFig(53, { arista: '10', B: '12', h: '8', angulo: true, pasos: { b: 1, h: 2 } }),
      voz: 'Base por altura, con la altura perpendicular.',
      pasos: [
        { estado: { corte: 0 }, texto: 'La arista lateral está inclinada 53°.', ecuacion: ['arista = 10'] },
        { estado: { corte: 1 }, texto: 'Las secciones paralelas a la base son todas iguales a ella.', ecuacion: ['B = 12'] },
        { estado: { corte: 2 }, texto: 'La altura cae perpendicular a la base.', ecuacion: ['h = 10 · sen 53° = 8'] },
        { estado: { corte: 2 }, texto: 'Volumen: base por altura.', ecuacion: ['V = 12 · 8 = 96 cm³'] },
      ],
    },
    regla: {
      texto: 'El volumen de todo prisma, recto u oblicuo, es el área de la base por la altura perpendicular. En el recto, el área lateral es perímetro por altura.',
      ecuacion: ['V = ', { v: 'c-d', t: 'B' }, ' · ', { llave: [{ v: 'c-h', t: 'h' }], nota: 'no la arista', color: 'c-h' }, '   ·   ', 'recto: ', { v: 'c-d', t: 'A' }, { sub: ['', 'L'] }, ' = (2p) · ', { v: 'c-h', t: 'h' }],
      condicion: 'h es perpendicular a las bases. Un prisma regular es un prisma recto cuya base es un polígono regular.',
      voz: 'La arista inclinada no es la altura.',
    },
    ahoraTu: {
      voz: 'Ubica la altura perpendicular antes de multiplicar.',
      generar(s) {
        const r = azar(s);
        if (s % 2 === 0) {
          const th = r.de([30, 37, 53, 60]), m = r.ent(1, 4), L = th === 37 || th === 53 ? 5 * m : 2 * m, B = r.ent(3, 15);
          const h = { 30: L / 2, 37: 3 * m, 53: 4 * m, 60: null }[th];
          if (h === null) {
            return {
              pregunta: [`Un prisma oblicuo tiene base de ${B} cm² y aristas laterales de ${L} cm que forman 60° con la base. ¿Cuál es su volumen?`],
              opciones: [{ id: 'c', texto: `${f(B * m)}√3 cm³`, correcta: true }, { id: 'arista', texto: `${f(B * L)} cm³`, error: 'GE21', siFuera: 'La arista inclinada no es la altura.' },
                { id: 'cos', texto: `${f(B * m)} cm³`, error: 'GE-PP1', siFuera: 'Esa es la sombra de la arista: lleva el coseno.' }],
              solucion: { texto: `h = ${L} · sen 60° = ${m === 1 ? '' : m}√3.`, ecuacion: [`V = ${B} · ${m === 1 ? '' : m}√3 = ${f(B * m)}√3 cm³`] },
            };
          }
          const cs = { 30: null, 37: 4 * m, 53: 3 * m }[th];
          return {
            pregunta: [`Un prisma oblicuo tiene base de ${B} cm² y aristas laterales de ${L} cm que forman ${th}° con la base. ¿Cuál es su volumen?`],
            opciones: opciones(B * h, [
              { id: 'arista', valor: B * L, error: 'GE21', siFuera: 'La arista inclinada no es la altura.' },
              { id: 'cos', valor: cs === null ? NaN : B * cs, error: 'GE-PP1', siFuera: 'Esa es la sombra de la arista: lleva el coseno.' },
              { id: 'tercio', valor: B * h / 3, error: 'GE20', siFuera: 'El tercio es de la pirámide.' },
            ], x => `${f(x)} cm³`),
            solucion: { texto: `h = ${L} · sen ${th}° = ${f(h)}.`, ecuacion: [`V = ${B} · ${f(h)} = ${f(B * h)} cm³`] },
          };
        }
        const a = r.ent(2, 9), h = r.ent(3, 15), pide = r.de(['AL', 'AT', 'V']);
        const val = { AL: 4 * a * h, AT: 4 * a * h + 2 * a * a, V: a * a * h }[pide], txt = { AL: 'su área lateral', AT: 'su área total', V: 'su volumen' }[pide], u = pide === 'V' ? 'cm³' : 'cm²';
        return {
          pregunta: [`Un prisma regular cuadrangular tiene arista básica de ${a} cm y altura de ${h} cm. ¿Cuánto mide ${txt}?`],
          opciones: opciones(val, [
            { id: 'al', valor: pide === 'AL' ? a * h : 4 * a * h, error: pide === 'AL' ? 'GE-PP2' : 'GE-PP2', siFuera: pide === 'AL' ? 'Esa es una sola cara lateral; hay cuatro.' : 'Esa es solo el área lateral.' },
            { id: 'v', valor: pide === 'V' ? 4 * a * h : a * a * h, error: 'GE13', siFuera: pide === 'V' ? 'Eso es el área lateral, no el volumen.' : 'Ese es el volumen: se pedía un área.' },
            { id: 'una', valor: pide === 'AT' ? 4 * a * h + a * a : a * a * h / 3, error: pide === 'AT' ? 'GE-PP2' : 'GE20', siFuera: pide === 'AT' ? 'El prisma tiene dos bases.' : 'El tercio es de la pirámide.' },
          ], x => `${f(x)} ${u}`),
          solucion: { texto: 'Perímetro de la base 4a; base a².', ecuacion: [pide === 'AL' ? `4 · ${a} · ${h} = ${val}` : pide === 'AT' ? `4 · ${a} · ${h} + 2 · ${a}² = ${val}` : `${a}² · ${h} = ${val}`] },
        };
      },
    },
  };

  // ---------- Idea 2: paralelepípedo y cubo ----------
  // Cambia: las tres medidas · Permanece: la caja recta · Progresa: diagonal de la base y del sólido ·
  // Se reserva: 3, 4 y 12 · Debe verse: Pitágoras dos veces.
  const cajaFig = (a, b, c, o = {}) => {
    const k = o.pasos || {}, e = o.escala || 0.5, X = a * e / 2, Z = b * e / 2, Y = c * e / 2;
    const P = [[-X, -Y, Z], [X, -Y, Z], [X, -Y, -Z], [-X, -Y, -Z], [-X, Y, Z], [X, Y, Z], [X, Y, -Z], [-X, Y, -Z]], S = solido(P, 'S');
    return {
      alt: o.alt || `Ortoedro de ${a}, ${b} y ${c}: diagonal de la base √(${a}² + ${b}²) y diagonal del sólido √(${a}² + ${b}² + ${c}²) = ${f(Math.hypot(a, b, c))}`,
      tresD: TD, vista: { x: [-2.6, 2.6], y: [-2.1, 2.1] },
      puntos: [...S.puntos, pt('A', P[0], { rotulo: 'A', lado: 210 }), pt('C', P[2], { rotulo: 'C', lado: -20, desde: k.d || 0 }), pt('G', P[6], { rotulo: 'G', lado: 45, color: 'h' })],
      solidos: [S.solido],
      segmentos: [{ de: 'S0', a: 'S1', color: 'o', grosor: 'variable', texto: o.ta ?? `${a}`, lado: 1 }, { de: 'S1', a: 'S2', color: 'o', grosor: 'variable', texto: o.tb ?? `${b}`, lado: 1 },
        { de: 'S2', a: 'S6', color: 'o', grosor: 'variable', texto: o.tc ?? `${c}` },
        { de: 'A', a: 'C', color: 'i', discontinua: true, grosor: 'variable', texto: o.dB, lado: -1, desde: k.d || 0 }, { de: 'A', a: 'G', color: 'h', discontinua: true, grosor: 'variable', texto: o.D, desde: k.D || 0 }],
    };
  };
  const cajaArrastres = (fig, e = 0.5) => [
    { id: 'largo', etiqueta: 'esquina del largo', color: 'c-o',
      donde: v => enPantalla(fig(v), [v.a * e / 2, -v.c * e / 2, v.b * e / 2]),
      mover: (p, v) => ({ a: sobre(fig(v), [0, -v.c * e / 2, v.b * e / 2], [e / 2, -v.c * e / 2, v.b * e / 2], p) }) },
    { id: 'ancho', etiqueta: 'esquina del ancho', color: 'c-o',
      donde: v => enPantalla(fig(v), [v.a * e / 2, -v.c * e / 2, -v.b * e / 2]),
      mover: (p, v) => ({ b: sobre(fig(v), [v.a * e / 2, -v.c * e / 2, 0], [v.a * e / 2, -v.c * e / 2, -e / 2], p) }) },
    { id: 'alto', etiqueta: 'esquina G del alto', color: 'c-o',
      donde: v => enPantalla(fig(v), [v.a * e / 2, v.c * e / 2, -v.b * e / 2]),
      mover: (p, v) => ({ c: sobre(fig(v), [v.a * e / 2, 0, -v.b * e / 2], [v.a * e / 2, e / 2, -v.b * e / 2], p) }) },
  ];
  const cajaIdea = {
    id: 'paralelepipedo',
    titulo: 'Pitágoras dos veces',
    temas: ['Paralelepípedos y cubo'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Cambia el largo, el ancho y la altura de la caja. La diagonal AG cruza por dentro, de una esquina a la opuesta.',
      voz: 'Cambia las medidas. Mira la diagonal de la base y la de la caja.',
      controles: [
        { id: 'a', etiqueta: 'largo', min: 1, max: 6, paso: 1, inicio: 4, unidad: '', decimales: 0, color: 'c-o' },
        { id: 'b', etiqueta: 'ancho', min: 1, max: 5, paso: 1, inicio: 3, unidad: '', decimales: 0, color: 'c-o' },
        { id: 'c', etiqueta: 'alto', min: 1, max: 6, paso: 1, inicio: 3, unidad: '', decimales: 0, color: 'c-o' },
      ],
      dibujo: v => ({ datos: cajaFig(v.a, v.b, v.c, { dB: f(Math.hypot(v.a, v.b)), D: f(Math.hypot(v.a, v.b, v.c)) }), estado: {} }),
      // Se agarran tres esquinas, una por medida: el largo por la arista de adelante, el ancho por la de la derecha y
      // el alto por la esquina G. Cada una corre por su recta desde el centro de la caja.
      arrastres: cajaArrastres(v => cajaFig(v.a, v.b, v.c)),
      lectura: v => [nb(`AC = ${f(Math.hypot(v.a, v.b))}`), SEP, nb(`AG = ${f(Math.hypot(v.a, v.b, v.c))}`), SEP, nb(`V = ${v.a * v.b * v.c}`), SEP, nb(`A = ${2 * (v.a * v.b + v.b * v.c + v.a * v.c)}`)],
      minimo: 4,
    },
    predice: {
      pregunta: 'Una caja tiene 3 cm de ancho, 4 cm de largo y 12 cm de alto. ¿Cuánto mide su diagonal AG?',
      voz: 'Primero la diagonal del piso; después sube.',
      opciones: [
        { id: 'c', texto: '13 cm', correcta: true },
        { id: 'base', texto: '5 cm', error: 'GE-PP3', siFuera: '5 es la diagonal del piso, AC; falta subir 12.' },
        { id: 'suma', texto: '19 cm', error: 'GE-PP3', siFuera: 'Sumar las tres medidas da un camino quebrado, más largo.' },
        { id: 'cara', texto: '12,4 cm', error: 'GE-PP3', siFuera: '√(3² + 12²) es la diagonal de una cara lateral.' },
      ],
      dibujo: { datos: cajaFig(4, 3, 12, { escala: 0.27, pasos: { d: 99, D: 99 } }), estado: {} },
      revelar: { datos: cajaFig(4, 3, 12, { escala: 0.27, dB: '5', D: '13' }), estado: {} },
      coincide: 'Coincide: √(9 + 16 + 144) = 13.',
    },
    mira: {
      datos: cajaFig(4, 3, 12, { escala: 0.27, dB: '5', D: '13', pasos: { d: 1, D: 2 } }),
      voz: 'Un triángulo rectángulo en el piso y otro de pie.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Las tres medidas salen de una esquina, a 90° entre sí.', ecuacion: ['4, 3, 12'] },
        { estado: { corte: 1 }, texto: 'En el piso, AC es la hipotenusa de 4 y 3.', ecuacion: ['AC = √(4² + 3²) = 5'] },
        { estado: { corte: 2 }, texto: 'De pie, AG es la hipotenusa de AC y la altura.', ecuacion: ['AG = √(5² + 12²) = 13'] },
      ],
    },
    regla: {
      texto: 'En un paralelepípedo rectangular de medidas a, b y c, la diagonal se obtiene con Pitágoras dos veces. En el cubo, a = b = c.',
      ecuacion: [{ llave: [{ v: 'c-h', t: 'D' }], nota: 'diagonal', color: 'c-h' }, ' = √(a² + b² + c²)', '   ·   ', 'V = abc', '   ·   ', 'A = 2(ab + bc + ca)', '   ·   ', 'cubo: ', { v: 'c-h', t: 'D' }, ' = a√3'],
      condicion: 'las tres medidas son perpendiculares entre sí (caja recta).',
      voz: 'Cada medida al cuadrado, una sola vez.',
    },
    ahoraTu: {
      voz: 'Piso primero, altura después.',
      generar(s) {
        const r = azar(s);
        if (s % 3 === 2) {
          const a = r.ent(2, 9);
          return {
            pregunta: [`Un cubo tiene arista ${a} cm. ¿Cuánto mide su diagonal?`],
            opciones: [{ id: 'c', texto: `${a}√3 cm`, correcta: true }, { id: 'cara', texto: `${a}√2 cm`, error: 'GE-PP3', siFuera: 'Esa es la diagonal de una cara.' },
              { id: 'tres', texto: `${3 * a} cm`, error: 'GE-PP3', siFuera: 'Sumar tres aristas da un camino quebrado.' }, { id: 'raiz', texto: `${f(Math.sqrt(3 * a))} cm`, error: 'GE19', siFuera: 'Las aristas se elevan al cuadrado antes de sumar.' }].filter((o, i, l) => l.findIndex(x => x.texto === o.texto) === i),
            solucion: { texto: 'Pitágoras con a, a y a.', ecuacion: [`√(3 · ${a}²) = ${a}√3`] },
          };
        }
        const [a, b, c, D] = r.de([[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [4, 4, 7, 9], [2, 6, 9, 11], [3, 4, 12, 13], [2, 10, 11, 15], [6, 6, 7, 11], [4, 8, 8, 12]]);
        if (s % 3 === 0) return {
          pregunta: [`Un paralelepípedo rectangular mide ${a} cm, ${b} cm y ${c} cm. ¿Cuánto mide su diagonal?`],
          opciones: opciones(D, [
            { id: 'suma', valor: a + b + c, error: 'GE-PP3', siFuera: 'Ese es un camino quebrado, más largo que la diagonal.' },
            { id: 'base', valor: Math.hypot(a, b), error: 'GE-PP3', siFuera: 'Esa es la diagonal de una cara.' },
            { id: 'sinraiz', valor: Math.sqrt(a + b + c), error: 'GE19', siFuera: 'Las medidas se elevan al cuadrado antes de sumar.' },
          ], x => `${f(x)} cm`),
          solucion: { texto: 'Cada medida al cuadrado.', ecuacion: [`√(${a}² + ${b}² + ${c}²) = ${D} cm`] },
        };
        return {
          pregunta: [`Un paralelepípedo rectangular mide ${a} cm, ${b} cm y ${c} cm. ¿Cuál es su área total?`],
          opciones: opciones(2 * (a * b + b * c + a * c), [
            { id: 'mitad', valor: a * b + b * c + a * c, error: 'GE-PP2', siFuera: 'Cada cara tiene su gemela opuesta: multiplica por 2.' },
            { id: 'vol', valor: a * b * c, error: 'GE13', siFuera: 'Ese es el volumen.' },
            { id: 'una', valor: 2 * (a * b + b * c), error: 'GE-PP2', siFuera: 'Falta un par de caras.' },
          ], x => `${f(x)} cm²`),
          solucion: { texto: 'Tres pares de caras iguales.', ecuacion: [`2(${a}·${b} + ${b}·${c} + ${a}·${c}) = ${2 * (a * b + b * c + a * c)} cm²`] },
        };
      },
    },
  };

  // ---------- Idea 3: pirámide regular y apotema ----------
  // Cambia: la altura · Permanece: la base cuadrada de lado 6 · Progresa: la apotema de la pirámide ·
  // Se reserva: altura 4 · Debe verse: la cara sube por la apotema, no por la altura.
  const pirFig = (h, o = {}) => {
    const k = o.pasos || {}, e = 0.5, L = 3 * e, y0 = -1.4, V = [0, y0 + h * e, 0], O = [0, y0, 0], M = [0, y0, L];
    const P = [[-L, y0, L], [L, y0, L], [L, y0, -L], [-L, y0, -L], V], S = solido(P, 'S');
    return {
      alt: o.alt || `Pirámide regular de base cuadrada de lado 6 y altura ${h}: la apotema de la pirámide mide √(${h}² + 3²) = ${f(Math.hypot(h, 3))}`,
      tresD: TD, vista: { x: [-2.3, 2.3], y: [-2.2, 2.6] },
      puntos: [...S.puntos, pt('V', V, { rotulo: 'V', lado: 90 }), pt('O', O, { color: 'o', desde: k.h || 0 }), pt('M', M, { color: 'h', rotulo: 'M', lado: 250 })],
      solidos: [S.solido],
      regiones: [escuadra(O, [0, 1, 0], [0, 0, 1], 0.22, { color: 'o', desde: k.h || 0 }), escuadra(M, res(V, M), [1, 0, 0], 0.22, { color: 'h' })],
      segmentos: [{ de: 'S1', a: 'S2', color: 'd', grosor: 'variable', texto: '6', lado: 1 }, { de: 'V', a: 'O', color: 'o', discontinua: true, grosor: 'variable', texto: o.h, desde: k.h || 0 },
        { de: 'O', a: 'M', color: 'i', discontinua: true, texto: '3', desde: k.m || 0 }, { de: 'V', a: 'M', color: 'h', grosor: 'variable', texto: o.ap, desde: k.a || 0 }],
    };
  };
  const pirIdea = {
    id: 'piramide',
    titulo: 'La cara sube por la apotema',
    temas: ['Pirámide regular y apotema', 'Áreas y volúmenes'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Pirámide regular de base cuadrada de lado 6. Cambia la altura VO. La apotema VM sube por la cara hasta el medio de un lado.',
      voz: 'Sube la punta. Compara la altura con la apotema.',
      controles: [{ id: 'h', etiqueta: 'altura', min: 2, max: 7, paso: 1, inicio: 4, unidad: '', decimales: 0, color: 'c-o' }],
      dibujo: v => ({ datos: pirFig(v.h, { h: `${v.h}`, ap: f(Math.hypot(v.h, 3)) }), estado: {} }),
      // Se agarra la punta V y se sube o se baja por la altura; la base no cambia.
      arrastres: [{ id: 'punta-v', etiqueta: 'punta V de la pirámide', color: 'c-o',
        donde: v => enPantalla(pirFig(v.h), [0, -1.4 + v.h * 0.5, 0]),
        mover: (p, v) => ({ h: sobre(pirFig(v.h), [0, -1.4, 0], [0, -0.9, 0], p) }) }],
      lectura: v => [nb(`VM = √(${v.h}² + 3²) = ${f(Math.hypot(v.h, 3))}`), SEP, nb(`V = 36 · ${v.h} / 3 = ${12 * v.h}`)],
      minimo: 3,
    },
    predice: {
      pregunta: 'Una pirámide regular de base cuadrada tiene lado 6 y altura 4. ¿Cuál es su área lateral?',
      voz: 'Cada cara es un triángulo. ¿Cuánto mide su altura?',
      opciones: [
        { id: 'c', texto: '60', correcta: true },
        { id: 'altura', texto: '48', error: 'GE21', siFuera: '48 usa la altura 4 en cada cara; la cara sube por la apotema, que mide 5.' },
        { id: 'sin2', texto: '120', error: 'GE-PP2', siFuera: 'Cada cara es un triángulo: base por altura entre 2.' },
        { id: 'total', texto: '96', error: 'GE-PP2', siFuera: '96 suma la base: esa es el área total.' },
      ],
      dibujo: { datos: pirFig(4, { h: '4', pasos: { a: 99 } }), estado: {} },
      revelar: { datos: pirFig(4, { h: '4', ap: '5' }), estado: {} },
      coincide: 'Coincide: apotema 5 y cuatro caras de 6 · 5 / 2.',
    },
    mira: {
      datos: pirFig(4, { h: '4', ap: '5', pasos: { h: 0, m: 1, a: 2 } }),
      voz: 'Altura, apotema de la base y apotema de la pirámide: un triángulo rectángulo.',
      pasos: [
        { estado: { corte: 0 }, texto: 'La altura VO cae al centro de la base.', ecuacion: ['VO = 4'] },
        { estado: { corte: 1 }, texto: 'Del centro al punto medio de un lado: la apotema de la base.', ecuacion: ['OM = 3'] },
        { estado: { corte: 2 }, texto: 'VM es la altura de cada cara.', ecuacion: ['VM = √(4² + 3²) = 5'] },
        { estado: { corte: 2 }, texto: 'Cuatro caras triangulares.', ecuacion: ['4 · ', frac('6 · 5', '2'), ' = 60'] },
      ],
    },
    regla: {
      texto: 'En una pirámide regular, el área lateral es el semiperímetro de la base por la apotema de la pirámide. El volumen es un tercio de la base por la altura.',
      ecuacion: [{ v: 'c-d', t: 'A' }, { sub: ['', 'L'] }, ' = p · ', { llave: [{ v: 'c-h', t: 'ap' }], nota: 'altura de cara', color: 'c-h' }, '   ·   ', 'V = ', frac([{ v: 'c-d', t: 'B' }, ' · ', { v: 'c-o', t: 'h' }], '3'), '   ·   ', { sup: [{ v: 'c-h', t: 'ap' }, '2'] }, ' = ', { sup: [{ v: 'c-o', t: 'h' }, '2'] }, ' + ', { llave: [{ sup: [{ v: 'c-i', t: 'a' }, '2'] }], nota: 'apotema de base', color: 'c-i' }],
      condicion: 'la base es regular y la punta está sobre su centro; a es la apotema de la base y p su semiperímetro.',
      voz: 'Altura para el volumen; apotema para el área.',
    },
    ahoraTu: {
      voz: 'Arma el triángulo de altura, apotema de la base y apotema.',
      generar(s) {
        const r = azar(s), [m, h, ap] = r.de([[3, 4, 5], [4, 3, 5], [5, 12, 13], [6, 8, 10], [8, 6, 10], [12, 5, 13], [8, 15, 17], [12, 9, 15]]), L = 2 * m, pide = ['AL', 'AT', 'V'][s % 3];
        const AL = 2 * L * ap, val = { AL, AT: AL + L * L, V: L * L * h / 3 }[pide], u = pide === 'V' ? '' : '';
        return {
          pregunta: [`Una pirámide regular de base cuadrada tiene lado ${L} y altura ${h}. ¿Cuánto mide su ${{ AL: 'área lateral', AT: 'área total', V: 'volumen' }[pide]}?`],
          opciones: opciones(val, pide === 'V' ? [
            { id: 'sin3', valor: L * L * h, error: 'GE20', siFuera: 'Falta el tercio: la pirámide es un tercio del prisma.' },
            { id: 'ap', valor: L * L * ap / 3, error: 'GE21', siFuera: 'El volumen usa la altura, no la apotema.' },
            { id: 'al', valor: AL, error: 'GE13', siFuera: 'Esa es el área lateral.' },
          ] : [
            { id: 'altura', valor: 2 * L * h + (pide === 'AT' ? L * L : 0), error: 'GE21', siFuera: 'Cada cara sube por la apotema, no por la altura.' },
            { id: 'sin2', valor: 4 * L * ap + (pide === 'AT' ? L * L : 0), error: 'GE-PP2', siFuera: 'Cada cara es un triángulo: falta dividir entre 2.' },
            { id: 'otra', valor: pide === 'AT' ? AL : AL + L * L, error: 'GE-PP2', siFuera: pide === 'AT' ? 'Falta sumar la base.' : 'Esa incluye la base: es el área total.' },
          ], x => f(x) + u),
          solucion: { texto: `Apotema √(${h}² + ${m}²) = ${ap}.`, ecuacion: [pide === 'V' ? `${L}² · ${h} / 3 = ${f(val)}` : pide === 'AL' ? `4 · ${L} · ${ap} / 2 = ${val}` : `${AL} + ${L}² = ${val}`] },
        };
      },
    },
  };

  // ---------- Idea 4: tronco de pirámide (papiro de Moscú) ----------
  // Cambia: el lado menor · Permanece: lado mayor 4 y altura 6 · Progresa: el volumen ·
  // Se reserva: la pirámide completa que se recorta · Debe verse: el tronco no es el promedio de las bases por h.
  const troncoFig = (b, o = {}) => {
    const k = o.pasos || {}, a = 4, h = 6, e = 0.36, y0 = -1.5, A = a * e / 2, Bm = b * e / 2, y1 = y0 + h * e, H = h * a / (a - b), yV = y0 + H * e;
    const P = [[-A, y0, A], [A, y0, A], [A, y0, -A], [-A, y0, -A], [-Bm, y1, Bm], [Bm, y1, Bm], [Bm, y1, -Bm], [-Bm, y1, -Bm]], S = solido(P, 'S');
    const V = [0, yV, 0];
    return {
      alt: o.alt || `Tronco de pirámide de bases cuadradas de lados 4 y ${f(b)} y altura 6: volumen ${f(h / 3 * (a * a + a * b + b * b))}`,
      tresD: TD, vista: o.H ? { x: [-2.1, 2.1], y: [-2.1, 3.4] } : { x: [-1.7, 1.7], y: [-1.95, 1.1] },
      puntos: [...S.puntos, pt('V', V, { rotulo: 'V', lado: 90, desde: k.v ?? 99 }), pt('O0', [0, y0, 0], { sinPunto: true }), pt('O1', [0, y1, 0], { sinPunto: true })],
      solidos: [S.solido],
      segmentos: [{ de: 'S0', a: 'S1', color: 'o', grosor: 'variable', texto: '4', lado: -1 }, { de: 'S4', a: 'S5', color: 'i', grosor: 'variable', texto: f(b), lado: -1 },
        { de: 'O0', a: 'O1', color: 'h', discontinua: true, texto: '6' },
        ...[4, 5, 6, 7].map(i => ({ de: 'S' + i, a: 'V', discontinua: true, grosor: 'fino', desde: k.v ?? 99 }))],
      rotulos: o.H ? [rot([0.35, (y1 + yV) / 2, 0], o.H, 'h', { ancla: 'start', desde: k.v ?? 99 })] : [],
    };
  };
  const vt = (a, b, h) => h / 3 * (a * a + a * b + b * b);
  const troncoIdea = {
    id: 'tronco-de-piramide',
    titulo: 'El tronco del papiro',
    temas: ['Tronco de pirámide', 'Áreas y volúmenes'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Tronco de pirámide con base mayor de lado 4 y altura 6. Cambia el lado de la base menor y mira el volumen.',
      voz: 'Cambia la base de arriba. ¿Crece el volumen como esperabas?',
      controles: [{ id: 'b', etiqueta: 'lado menor', min: 1, max: 3.5, paso: 0.5, inicio: 2, unidad: '', decimales: 1, color: 'c-i' }],
      dibujo: v => ({ datos: troncoFig(v.b), estado: {} }),
      // Se agarra la esquina de la base menor y se abre o se cierra por la diagonal de arriba.
      arrastres: [{ id: 'esquina-b', etiqueta: 'esquina de la base menor', color: 'c-i',
        donde: v => enPantalla(troncoFig(v.b), [v.b * 0.18, -1.5 + 6 * 0.36, v.b * 0.18]),
        mover: (p, v) => ({ b: sobre(troncoFig(v.b), [0, -1.5 + 6 * 0.36, 0], [0.18, -1.5 + 6 * 0.36, 0.18], p) }) }],
      lectura: v => [`V = 6/3 · (16 + ${f(4 * v.b)} + ${f(v.b * v.b)}) = ${f(vt(4, v.b, 6))}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Problema del papiro de Moscú: un tronco de pirámide de bases cuadradas de lados 4 y 2 tiene altura 6. ¿Cuál es su volumen?',
      voz: 'Cuidado: no es un prisma con la base promedio.',
      opciones: [
        { id: 'c', texto: '56', correcta: true },
        { id: 'prom', texto: '60', error: 'GE-PP4', siFuera: '60 = 6 · (16 + 4)/2 promedia las bases como en un prisma.' },
        { id: 'sinraiz', texto: '40', error: 'GE-PP4', siFuera: '40 olvida el término del medio, √(16 · 4) = 8.' },
        { id: 'prisma', texto: '96', error: 'GE20', siFuera: '96 es el prisma de base 16: el tronco es menor.' },
      ],
      dibujo: { datos: troncoFig(2), estado: {} },
      revelar: { datos: troncoFig(2, { H: '12', pasos: { v: 0 } }), estado: {} },
      coincide: 'Coincide: 64 − 8 = 56, como en el papiro.',
    },
    mira: {
      datos: troncoFig(2, { H: '12', pasos: { v: 1 } }),
      voz: 'Completa la pirámide y quítale la punta.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Las bases son semejantes con razón 2 : 4.', ecuacion: ['k = ', frac('2', '4'), ' = ', frac('1', '2')] },
        { estado: { corte: 1 }, texto: 'La pirámide completa mide el doble de alto que la punta: 12.', ecuacion: ['V grande = ', frac('16 · 12', '3'), ' = 64'] },
        { estado: { corte: 1 }, texto: 'La punta tiene base 4 y altura 6.', ecuacion: ['V punta = ', frac('4 · 6', '3'), ' = 8'] },
        { estado: { corte: 1 }, texto: 'El tronco es lo que queda.', ecuacion: ['64 − 8 = 56'] },
        { estado: { corte: 1 }, texto: 'La fórmula da lo mismo.', ecuacion: [frac('6', '3'), ' · (16 + 4 + √(16 · 4)) = 56'] },
      ],
    },
    regla: {
      texto: 'El volumen de un tronco de pirámide de bases B y b y altura h es h/3 por la suma de B, b y su media geométrica.',
      ecuacion: ['V = ', frac({ v: 'c-h', t: 'h' }, '3'), ' · (', { v: 'c-o', t: 'B' }, ' + ', { v: 'c-i', t: 'b' }, ' + ', { llave: ['√(', { v: 'c-o', t: 'B' }, { v: 'c-i', t: 'b' }, ')'], nota: 'base media' }, ')'],
      condicion: 'las bases son paralelas y semejantes; h es la distancia perpendicular entre ellas.',
      voz: 'Tres sumandos: las dos bases y su media geométrica.',
    },
    ahoraTu: {
      voz: 'Bases B y b, y la raíz de su producto.',
      generar(s) {
        const r = azar(s), a = r.ent(3, 10), b = r.ent(1, a - 1), h = 3 * r.ent(1, 5), B = a * a, bb = b * b, V = vt(a, b, h);
        return {
          pregunta: [`Un tronco de pirámide tiene bases cuadradas de lados ${a} y ${b} y altura ${h}. ¿Cuál es su volumen?`],
          opciones: opciones(V, [
            { id: 'prom', valor: h * (B + bb) / 2, error: 'GE-PP4', siFuera: 'Promediar las bases sirve en el prisma, no en el tronco.' },
            { id: 'sinraiz', valor: h / 3 * (B + bb), error: 'GE-PP4', siFuera: 'Falta la media geométrica √(Bb).' },
            { id: 'prisma', valor: h * B, error: 'GE20', siFuera: 'Ese es el prisma de la base mayor.' },
          ]),
          solucion: { texto: `B = ${B}, b = ${bb}, √(Bb) = ${a * b}.`, ecuacion: [`${h}/3 · (${B} + ${bb} + ${a * b}) = ${f(V)}`] },
        };
      },
    },
  };

  // ---------- Idea 5: tronco de prisma triangular ----------
  // Cambia: las tres aristas laterales · Permanece: la base B = 10 · Progresa: el promedio de las aristas ·
  // Se reserva: 4, 6 y 8 · Debe verse: el corte oblicuo reparte: B por el promedio de las tres.
  const tpFig = (h1, h2, h3, o = {}) => {
    const e = 0.45, y0 = -1.4, T = [[-1.5, y0, 0.9], [1.5, y0, 0.9], [-0.4, y0, -1.6]], hs = [h1, h2, h3];
    const P = [...T, ...T.map((p, i) => [p[0], y0 + hs[i] * e, p[2]])], S = solido(P, 'S');
    return {
      alt: o.alt || `Tronco de prisma triangular de base 10 con aristas ${h1}, ${h2} y ${h3}: volumen 10 · (${h1} + ${h2} + ${h3}) / 3 = ${f(10 * (h1 + h2 + h3) / 3)}`,
      tresD: TD, vista: { x: [-2.4, 2.4], y: [-2.2, 2.6] },
      puntos: S.puntos,
      solidos: [S.solido],
      regiones: [{ puntos: T, color: 'd', opacidad: 0.22 }],
      segmentos: [0, 1, 2].map(i => ({ de: 'S' + i, a: 'S' + (i + 3), color: ['o', 'i', 'h'][i], grosor: 'variable', discontinua: i === 2, texto: `${hs[i]}`, lado: i === 0 ? 1 : -1 })),
      rotulos: [rot([0, y0, 0.15], 'B = 10', 'd')],
    };
  };
  const TP = [[-1.5, -1.4, 0.9], [1.5, -1.4, 0.9], [-0.4, -1.4, -1.6]], HS = ['h1', 'h2', 'h3'];
  const tpArrastres = HS.map((id, i) => ({
    id: `arista-${i + 1}`, etiqueta: `punta de la arista ${i + 1}`, color: ['c-o', 'c-i', 'c-h'][i],
    donde: v => enPantalla(tpFig(v.h1, v.h2, v.h3), sum(TP[i], [0, v[id] * 0.45, 0])),
    mover: (p, v) => ({ [id]: sobre(tpFig(v.h1, v.h2, v.h3), TP[i], sum(TP[i], [0, 0.45, 0]), p) }),
  }));
  const tpIdea = {
    id: 'tronco-de-prisma',
    titulo: 'Corte oblicuo: el promedio',
    temas: ['Tronco de prisma'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Un prisma triangular recto de base 10 se corta con un plano inclinado. Cambia las tres aristas laterales y mira el volumen.',
      voz: 'Cambia una arista. ¿Cuánto pesa cada una en el volumen?',
      controles: [
        { id: 'h1', etiqueta: 'arista 1', min: 1, max: 6, paso: 1, inicio: 4, unidad: '', decimales: 0, color: 'c-o' },
        { id: 'h2', etiqueta: 'arista 2', min: 1, max: 6, paso: 1, inicio: 2, unidad: '', decimales: 0, color: 'c-i' },
        { id: 'h3', etiqueta: 'arista 3', min: 1, max: 6, paso: 1, inicio: 5, unidad: '', decimales: 0, color: 'c-h' },
      ],
      dibujo: v => ({ datos: tpFig(v.h1, v.h2, v.h3), estado: {} }),
      // Se agarra la punta de cada arista lateral y se sube o se baja: el corte inclinado cambia.
      arrastres: tpArrastres,
      lectura: v => [`V = 10 · (${v.h1} + ${v.h2} + ${v.h3}) / 3 = ${f(10 * (v.h1 + v.h2 + v.h3) / 3)}`],
      minimo: 4,
    },
    predice: {
      pregunta: 'Un tronco de prisma triangular recto tiene base de 10 cm² y aristas laterales de 4, 6 y 8 cm. ¿Cuál es su volumen?',
      voz: 'El corte inclinado quita de un lado y agrega del otro.',
      opciones: [
        { id: 'c', texto: '60 cm³', correcta: true },
        { id: 'max', texto: '80 cm³', error: 'GE-PP4', siFuera: '80 usa la arista mayor: ese prisma contiene al tronco.' },
        { id: 'min', texto: '40 cm³', error: 'GE-PP4', siFuera: '40 usa la arista menor: ese prisma queda dentro del tronco.' },
        { id: 'suma', texto: '180 cm³', error: 'GE-PP4', siFuera: '180 suma las aristas sin dividir entre 3.' },
      ],
      dibujo: { datos: tpFig(4, 6, 8), estado: {} },
      revelar: { datos: tpFig(4, 6, 8), estado: {} },
      coincide: 'Coincide: promedio de aristas 6 y V = 10 · 6.',
    },
    mira: {
      datos: tpFig(4, 6, 8),
      voz: 'Promedio de las tres aristas por la base.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Las aristas laterales son perpendiculares a la base.', ecuacion: ['4, 6, 8'] },
        { estado: { corte: 0 }, texto: 'Su promedio hace de altura del prisma equivalente.', ecuacion: [frac('4 + 6 + 8', '3'), ' = 6'] },
        { estado: { corte: 0 }, texto: 'Base por altura promedio.', ecuacion: ['V = 10 · 6 = 60 cm³'] },
      ],
    },
    regla: {
      texto: 'Un tronco de prisma triangular recto tiene por volumen el área de la base por el promedio de sus tres aristas laterales.',
      ecuacion: ['V = ', { v: 'c-d', t: 'B' }, ' · ', { llave: [frac([{ v: 'c-o', t: 'a' }, ' + ', { v: 'c-i', t: 'b' }, ' + ', { v: 'c-h', t: 'c' }], '3')], nota: 'altura promedio' }],
      condicion: 'la base es un triángulo y las aristas son perpendiculares a ella; si el tronco es oblicuo, se usa la sección recta.',
      voz: 'Promedia las tres aristas, no tomes la mayor.',
    },
    ahoraTu: {
      voz: 'Promedio de las aristas, por la base.',
      generar(s) {
        const r = azar(s), B = r.ent(2, 12), a = r.ent(1, 9), b = r.ent(1, 9), c = 3 * r.ent(1, 4) - ((a + b) % 3);
        const cc = c > 0 ? c : c + 3, suma = a + b + cc;
        return {
          pregunta: [`Un tronco de prisma triangular recto tiene base de ${B} cm² y aristas laterales de ${a}, ${b} y ${cc} cm. ¿Cuál es su volumen?`],
          opciones: opciones(B * suma / 3, [
            { id: 'max', valor: B * Math.max(a, b, cc), error: 'GE-PP4', siFuera: 'La arista mayor da un prisma más grande que el tronco.' },
            { id: 'suma', valor: B * suma, error: 'GE-PP4', siFuera: 'Falta dividir la suma entre 3.' },
            { id: 'min', valor: B * Math.min(a, b, cc), error: 'GE-PP4', siFuera: 'La arista menor da un prisma más chico que el tronco.' },
          ], x => `${f(x)} cm³`),
          solucion: { texto: `Promedio (${a} + ${b} + ${cc}) / 3 = ${f(suma / 3)}.`, ecuacion: [`V = ${B} · ${f(suma / 3)} = ${f(B * suma / 3)} cm³`] },
        };
      },
    },
  };

  // ---------- Idea 6: semejanza de sólidos ----------
  // Cambia: el plano de corte de una pirámide · Permanece: la pirámide · Progresa: k, k², k³ ·
  // Se reserva: el corte a media altura · Debe verse: el volumen escala con el cubo de la razón.
  const corteFig = t => {
    const L = 1.6, y0 = -1.5, H = 3.4, yc = y0 + H * (1 - t), l = L * t, V = [0, y0 + H, 0];
    const Pg = [[-L, y0, L], [L, y0, L], [L, y0, -L], [-L, y0, -L], V], Sg = solido(Pg, 'G'), Pc = [[-l, yc, l], [l, yc, l], [l, yc, -l], [-l, yc, -l], V], Sc = solido(Pc, 'Q', { color: 'h' });
    return {
      alt: `Pirámide cortada por un plano paralelo a la base a ${f(t, 2)} de su altura desde la punta: la pirámide de arriba tiene ${f(t ** 3, 3)} del volumen`,
      tresD: TD, vista: { x: [-2.4, 2.4], y: [-2.2, 2.4] },
      puntos: [...Sg.puntos, ...Sc.puntos],
      solidos: [Sg.solido, Sc.solido],
      regiones: [{ puntos: Pc.slice(0, 4), color: 'h', opacidad: 0.25, sinBorde: false }],
    };
  };
  const semIdea = {
    id: 'semejanza-de-solidos',
    titulo: 'Escala al cubo',
    temas: ['Semejanza de sólidos'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Corta la pirámide con un plano paralelo a la base. La punta es semejante a la pirámide entera. Cambia la razón k de alturas.',
      voz: 'Mueve el corte. Compara alturas, áreas y volúmenes.',
      controles: [{ id: 't', etiqueta: 'k', min: 0.25, max: 1, paso: 0.25, inicio: 0.75, unidad: '', decimales: 2, color: 'c-o' }],
      dibujo: v => ({ datos: corteFig(v.t), estado: {} }),
      // Se agarra la esquina del corte y se desliza por la arista lateral, desde la punta V hasta la base.
      // k va en naranja, como en la regla (regla 4).
      arrastres: [{ id: 'corte', etiqueta: 'esquina del plano de corte', color: 'c-o',
        donde: v => enPantalla(corteFig(v.t), [1.6 * v.t, 1.9 - 3.4 * v.t, 1.6 * v.t]),
        mover: (p, v) => ({ t: sobre(corteFig(v.t), [0, 1.9, 0], [1.6, -1.5, 1.6], p) }) }],
      lectura: v => [nb(`alturas ×${f(v.t)}`), SEP, nb(`áreas ×${f(v.t ** 2, 4)}`), SEP, nb(`volúmenes ×${f(v.t ** 3, 4)}`)],
      minimo: 3,
    },
    predice: {
      pregunta: 'Una pirámide se corta con un plano paralelo a la base, a la mitad de su altura. ¿Qué fracción del volumen total tiene la pirámide de arriba?',
      voz: 'La punta es una copia de la pirámide, a escala.',
      opciones: [
        { id: 'c', texto: '1/8', correcta: true },
        { id: 'mitad', texto: '1/2', error: 'GE2', siFuera: 'La mitad de la altura no es la mitad del volumen: se reducen las tres medidas.' },
        { id: 'cuarto', texto: '1/4', error: 'GE2', siFuera: '1/4 es la razón de las bases (áreas); el volumen va al cubo.' },
        { id: 'sexto', texto: '1/6', error: 'GE20', siFuera: 'No hay que dividir entre 3 otra vez: el tercio está en las dos pirámides.' },
      ],
      dibujo: { datos: corteFig(0.5), estado: {} },
      revelar: { datos: corteFig(0.5), estado: {} },
      coincide: 'Coincide: (1/2)³ = 1/8; el tronco se queda con 7/8.',
    },
    mira: {
      datos: corteFig(0.5),
      voz: 'Alto, ancho y largo se reducen a la vez.',
      pasos: [
        { estado: { corte: 0 }, texto: 'La punta tiene la mitad de altura y la mitad de lado.', ecuacion: ['k = ', frac('1', '2')] },
        { estado: { corte: 0 }, texto: 'Su base es un cuarto de la base grande.', ecuacion: ['B pequeña = ', { sup: [frac('1', '2'), '2'] }, ' B = ', frac('B', '4')] },
        { estado: { corte: 0 }, texto: 'Volumen: base un cuarto y altura la mitad.', ecuacion: [frac('1', '4'), ' · ', frac('1', '2'), ' = ', frac('1', '8')] },
      ],
    },
    regla: {
      texto: 'Si dos sólidos son semejantes con razón k entre longitudes que se corresponden, sus áreas están en razón k² y sus volúmenes en razón k³.',
      ecuacion: [frac([{ v: 'c-h', t: 'V' }, '₁'], [{ v: 'c-h', t: 'V' }, '₂']), ' = ', { sup: [{ v: 'c-o', t: 'k' }, '3'] }, '   ·   ', frac('A₁', 'A₂'), ' = ', { sup: [{ v: 'c-o', t: 'k' }, '2'] }, '   ·   ', { llave: [{ v: 'c-o', t: 'k' }], nota: 'razón de largos', color: 'c-o' }, ' = ', frac('h₁', 'h₂')],
      condicion: 'las longitudes comparadas se corresponden (altura con altura, arista con arista).',
      voz: 'Longitud k; área k²; volumen k³.',
    },
    ahoraTu: {
      voz: 'Saca la razón de longitudes y elévala al exponente que toca.',
      generar(s) {
        const r = azar(s), [p, q] = r.de([[1, 2], [2, 3], [3, 4], [1, 3], [3, 5], [2, 5]]), m = r.ent(1, 5), vol = s % 2 === 0;
        const chico = vol ? m * p ** 3 : m * p * p, grande = vol ? m * q ** 3 : m * q * q;
        return {
          pregunta: [`Dos pirámides semejantes tienen alturas ${p} y ${q}. ${vol ? 'El volumen' : 'El área total'} de la menor es ${chico}. ¿Cuánto mide ${vol ? 'el volumen' : 'el área total'} de la mayor?`],
          opciones: opciones(grande, [
            { id: 'lin', valor: chico * q / p, error: 'GE2', siFuera: 'Esa escala es lineal; ' + (vol ? 'el volumen va al cubo.' : 'el área va al cuadrado.') },
            { id: 'otro', valor: vol ? chico * q * q / (p * p) : chico * q ** 3 / p ** 3, error: 'GE2', siFuera: vol ? 'Esa es la escala de las áreas.' : 'Esa es la escala de los volúmenes.' },
            { id: 'suma', valor: chico + (q - p), error: 'GE2', siFuera: 'La semejanza multiplica; no suma.' },
          ]),
          solucion: { texto: `k = ${q}/${p}; ${vol ? 'volumen al cubo' : 'área al cuadrado'}.`, ecuacion: [`${chico} · (${q}/${p})${vol ? '³' : '²'} = ${f(grande)}`] },
        };
      },
    },
  };

  // ---------- Laboratorio: juego libre, sin preguntas ----------
  // Mesa 1, más rica que las ideas 1 y 3: la pirámide dentro del prisma de igual base y altura. La cúspide se corre
  // por la tapa (pirámide oblicua: el volumen no cambia) y se cambian lado y altura. Tres manijas.
  const EP = 0.5, Y0 = -1.25;
  // Motor de la mesa: el prisma es base por altura y la pirámide, un tercio. Lectura, texto alternativo y retos
  // usan estas dos; la cúspide (cx, cz) no entra: misma base y misma altura.
  const volPrisma = v => v.a * v.a * v.h, volPir = v => volPrisma(v) / 3;
  const casi = (x, y) => Math.abs(x - y) < 1e-9;
  const enPrisma = v => {
    const L = v.a * EP / 2, yT = Y0 + v.h * EP, Vx = v.cx * L, Vz = v.cz * L;
    const base = [[-L, Y0, L], [L, Y0, L], [L, Y0, -L], [-L, Y0, -L]], tapa = base.map(q => [q[0], yT, q[2]]);
    const Pr = solido([...base, ...tapa], 'R'), Pi = solido([...base, [Vx, yT, Vz]], 'Q', { color: 'h' });
    return {
      alt: `Prisma de base cuadrada de lado ${f(v.a)} y altura ${f(v.h)} con una pirámide de la misma base y altura dentro: volúmenes ${f(volPrisma(v))} y ${f(volPir(v))}`,
      tresD: TD, vista: { x: [-2.6, 2.6], y: [-2.1, 2.3] },
      puntos: [...Pr.puntos, ...Pi.puntos, pt('Vc', [Vx, yT, Vz], { color: 'h' }), pt('Hc', [Vx, Y0, Vz], { sinPunto: true })],
      solidos: [Pr.solido, Pi.solido],
      regiones: [{ puntos: base, color: 'd', opacidad: 0.2 }],
      segmentos: [{ de: 'Vc', a: 'Hc', color: 'i', discontinua: true, texto: f(v.h), lado: 1 }, { de: 'R0', a: 'R1', color: 'd', grosor: 'variable', texto: f(v.a), lado: -1 }],
    };
  };
  const mesaEnPrisma = {
    id: 'piramide-en-prisma', titulo: 'Pirámide dentro del prisma', pieza: 'geo-figura',
    consigna: 'Arrastra la cúspide por la tapa, la esquina de la base y la altura. Compara los dos volúmenes.',
    controles: [
      { id: 'a', etiqueta: 'lado de la base', min: 2, max: 5, paso: 0.5, inicio: 4, unidad: '', decimales: 1, color: 'c-d' },
      { id: 'h', etiqueta: 'altura', min: 1, max: 5, paso: 0.5, inicio: 4, unidad: '', decimales: 1, color: 'c-i' },
      { id: 'cx', etiqueta: 'cúspide a lo ancho', min: -1, max: 1, paso: 0.25, inicio: 0, unidad: '', decimales: 2, color: 'c-h' },
      { id: 'cz', etiqueta: 'cúspide a lo hondo', min: -1, max: 1, paso: 0.25, inicio: 0, unidad: '', decimales: 2, color: 'c-h' },
    ],
    dibujo: v => ({ datos: enPrisma(v), estado: {} }),
    arrastres: [
      { id: 'cuspide', etiqueta: 'cúspide de la pirámide', color: 'c-h',
        donde: v => enPantalla(enPrisma(v), [v.cx * v.a * EP / 2, Y0 + v.h * EP, v.cz * v.a * EP / 2]),
        mover: (p, v) => { const L = v.a * EP / 2, [u, w] = enPlano(enPrisma(v), [0, Y0 + v.h * EP, 0], [L, 0, 0], [0, 0, L], p); return { cx: u, cz: w }; } },
      { id: 'esquina', etiqueta: 'esquina de la base', color: 'c-d',
        donde: v => enPantalla(enPrisma(v), [v.a * EP / 2, Y0, v.a * EP / 2]),
        mover: (p, v) => ({ a: sobre(enPrisma(v), [0, Y0, 0], [EP / 2, Y0, EP / 2], p) }) },
      { id: 'tapa', etiqueta: 'esquina de la tapa (altura)', color: 'c-i',
        donde: v => enPantalla(enPrisma(v), [v.a * EP / 2, Y0 + v.h * EP, v.a * EP / 2]),
        mover: (p, v) => ({ h: sobre(enPrisma(v), [v.a * EP / 2, Y0, v.a * EP / 2], [v.a * EP / 2, Y0 + EP, v.a * EP / 2], p) }) },
    ],
    lectura: v => [nb(`prisma ${f(volPrisma(v))}`), SEP, nb(`pirámide ${f(volPir(v))}`), SEP, nb('razón 3')],
    // Retos (docs/teoria.md §4d): cada logrado usa volPrisma y volPir, las mismas de la lectura.
    invitaciones: [
      { texto: 'Haz que la pirámide tenga volumen 12.',
        logrado: v => casi(volPir(v), 12),
        bien: 'Base 9 y altura 4: 9 · 4 / 3 = 12. El prisma mide 36.' },
      { texto: 'Lleva la cúspide a una esquina de la tapa. ¿Cambió el volumen?',
        logrado: v => Math.abs(v.cx) === 1 && Math.abs(v.cz) === 1,
        bien: 'Pirámide oblicua, misma base y altura: sigue siendo un tercio del prisma.' },
      { texto: 'Arma la pirámide más grande que permite esta mesa.',
        logrado: v => casi(volPir(v), VOL_MAX),
        bien: 'Lado 5 y altura 5: 125/3. El prisma sigue siendo el triple.' },
      { texto: 'Guarda dos pirámides de igual volumen y bases distintas.',
        logrado: (v, guardados) => guardados.some(g => g.a !== v.a && casi(volPir(g), volPir(v)))
          && guardados.some(g => g.a === v.a && g.h === v.h && g.cx === v.cx && g.cz === v.cz),
        bien: 'Base más chica y más altura: el volumen se compensa.' },
    ],
  };
  // La pirámide más grande de la mesa: la misma cuenta con los máximos de lado y de altura.
  const VOL_MAX = volPir({ a: mesaEnPrisma.controles[0].max, h: mesaEnPrisma.controles[1].max });
  // Mesa 2, más rica que la idea 4: las dos bases y la altura libres. La base menor llega a 0 (pirámide) y a 3 con la
  // mayor en 3 (prisma): los dos casos límite. La lectura pone al lado el «promedio de bases por altura», que falla.
  const ET = 0.3, YT = -1.4, XA = 1.25;
  // Motor de la mesa: vt es el volumen exacto; promedio, el «promedio de bases por la altura» que falla.
  const volTronco = v => vt(v.a, v.b, v.h), promedio = v => (v.a * v.a + v.b * v.b) / 2 * v.h;
  const fallo = v => promedio(v) - volTronco(v);
  const troncoLibre = v => {
    const A = v.a * ET / 2, Bm = v.b * ET / 2, y1 = YT + v.h * ET;
    const base = [[-A, YT, A], [A, YT, A], [A, YT, -A], [-A, YT, -A]];
    const P = v.b > 0 ? [...base, [-Bm, y1, Bm], [Bm, y1, Bm], [Bm, y1, -Bm], [-Bm, y1, -Bm]] : [...base, [0, y1, 0]], S = solido(P, 'S');
    return {
      alt: `Tronco de bases cuadradas de lados ${f(v.a)} y ${f(v.b)} y altura ${f(v.h)}: volumen ${f(volTronco(v))}; el promedio de bases por la altura daría ${f(promedio(v))}`,
      tresD: TD, vista: { x: [-1.8, 1.8], y: [-1.95, 1.6] },
      puntos: [...S.puntos, pt('h0', [XA, YT, 0], { sinPunto: true }), pt('h1', [XA, y1, 0], { sinPunto: true }), pt('c1', [Bm, y1, Bm], { sinPunto: true })],
      solidos: [S.solido],
      segmentos: [{ de: 'S0', a: 'S1', color: 'o', grosor: 'variable', texto: f(v.a), lado: -1 }, { de: 'h0', a: 'h1', color: 'h', grosor: 'variable', texto: f(v.h), lado: -1 }],
      rotulos: v.b > 0 ? [rot([0, y1 + 0.25, 0], f(v.b), 'i')] : [],
    };
  };
  const mesaTronco = {
    id: 'tronco-libre', titulo: 'Tronco entre pirámide y prisma', pieza: 'geo-figura',
    consigna: 'Arrastra las dos esquinas y la altura. Lleva la base menor a 0 y a la mayor. ¿Cuándo acierta el promedio?',
    controles: [
      { id: 'a', etiqueta: 'lado mayor', min: 3, max: 6, paso: 0.5, inicio: 4, unidad: '', decimales: 1, color: 'c-o' },
      { id: 'b', etiqueta: 'lado menor', min: 0, max: 3, paso: 0.5, inicio: 2, unidad: '', decimales: 1, color: 'c-i' },
      { id: 'h', etiqueta: 'altura', min: 2, max: 8, paso: 1, inicio: 6, unidad: '', decimales: 0, color: 'c-h' },
    ],
    dibujo: v => ({ datos: troncoLibre(v), estado: {} }),
    arrastres: [
      { id: 'esquina-mayor', etiqueta: 'esquina de la base mayor', color: 'c-o',
        donde: v => enPantalla(troncoLibre(v), [v.a * ET / 2, YT, v.a * ET / 2]),
        mover: (p, v) => ({ a: sobre(troncoLibre(v), [0, YT, 0], [ET / 2, YT, ET / 2], p) }) },
      { id: 'esquina-menor', etiqueta: 'esquina de la base menor', color: 'c-i',
        donde: v => enPantalla(troncoLibre(v), [v.b * ET / 2, YT + v.h * ET, v.b * ET / 2]),
        mover: (p, v) => ({ b: sobre(troncoLibre(v), [0, YT + v.h * ET, 0], [ET / 2, YT + v.h * ET, ET / 2], p) }) },
      { id: 'altura', etiqueta: 'tope de la altura', color: 'c-h',
        donde: v => enPantalla(troncoLibre(v), [XA, YT + v.h * ET, 0]),
        mover: (p, v) => ({ h: sobre(troncoLibre(v), [XA, YT, 0], [XA, YT + ET, 0], p) }) },
    ],
    lectura: v => [nb(`V = ${f(volTronco(v))}`), SEP, nb(`promedio por h = ${f(promedio(v))}`)],
    invitaciones: [
      { texto: 'Haz que el promedio de bases por la altura acierte el volumen.',
        logrado: v => casi(fallo(v), 0),
        bien: 'Solo acierta con bases iguales: ya no es tronco, es prisma.' },
      { texto: 'Arma otro tronco de volumen 56, distinto al del papiro.',
        logrado: v => casi(volTronco(v), PAPIRO) && !(v.a === 4 && v.b === 2 && v.h === 6),
        bien: 'Lados 4 y 1, altura 8: también 56, con otras medidas.' },
      { texto: 'Busca el tronco donde el promedio se equivoca por más.',
        logrado: v => casi(fallo(v), FALLO_MAX),
        bien: 'Bases muy distintas y mucha altura: el promedio se pasa por 48.' },
      { texto: 'Convierte el tronco en pirámide y compara con base por altura.',
        logrado: v => casi(volTronco(v), v.a * v.a * v.h / 3),
        bien: 'Base menor 0: el tronco es una pirámide, un tercio de base por altura.' },
    ],
  };
  // El tronco del papiro (lados 4 y 2, altura 6) y el mayor fallo del promedio en la grilla de la mesa.
  const PAPIRO = vt(4, 2, 6);
  const FALLO_MAX = (() => {
    const [ca, cb, ch] = mesaTronco.controles, pasos = c => Array.from({ length: Math.round((c.max - c.min) / c.paso) + 1 }, (_, k) => c.min + k * c.paso);
    return Math.max(...pasos(ca).flatMap(a => pasos(cb).flatMap(b => pasos(ch).map(h => fallo({ a, b, h })))));
  })();


  // ---------- El prisma que se corta (laboratorio 3D, 15 nov: exploración libre, sin predicciones) ----------
  // La sección la calcula nucleo/geometria3d.js (seccion) a través de la pieza geo-corte-3d: los retos miden lo mismo
  // que se dibuja (regla 1). El plano se orienta con su inclinación desde el piso y su giro, y se sube o se baja.
  const CAJAS = { cubo: { a: 2, b: 2, c: 2 }, ladrillo: { a: 3, b: 1.6, c: 2 } };
  const CORTE = () => Kit.piezas['geo-corte-3d'];
  const datosCorte = v => {
    const t = v.inc * Math.PI / 180, g = v.giro * Math.PI / 180;
    return { caja: CAJAS[v.forma], normal: [Math.sin(t) * Math.sin(g), Math.cos(t), Math.sin(t) * Math.cos(g)], d: v.d };
  };
  const seccionDe = v => CORTE().corte(datosCorte(v));
  const mesaCorte = {
    id: 'prisma-corte', titulo: 'El prisma que se corta', pieza: 'geo-corte-3d',
    consigna: 'Gira el prisma con el dedo. Inclina, gira y sube el plano: mira qué sección plana deja el corte.',
    controles: [
      { id: 'forma', etiqueta: 'Prisma', opciones: [{ valor: 'cubo', texto: 'Cubo' }, { valor: 'ladrillo', texto: 'Ladrillo' }] },
      { id: 'inc', etiqueta: 'Inclinación', color: 'c-i', min: 0, max: 80, paso: 5, inicio: 0, unidad: '°', decimales: 0 },
      { id: 'giro', etiqueta: 'Giro', color: 'c-d', min: 0, max: 90, paso: 5, inicio: 0, unidad: '°', decimales: 0 },
      { id: 'd', etiqueta: 'Altura del plano', color: 'c-o', min: -1.8, max: 1.8, paso: 0.2, inicio: 0, decimales: 1 },
    ],
    dibujo: v => ({ datos: datosCorte(v), estado: { plano: true } }),
    lectura: v => { const s = seccionDe(v); return [s.lados >= 3 ? `Sección: ${s.nombre} · área ${s.area < 0.005 ? 'casi 0' : f(s.area)}` : 'El plano no toca el prisma']; },
    invitaciones: [
      { texto: 'Consigue una sección triangular de área 0,5 o más.',
        logrado: v => seccionDe(v).lados === 3 && seccionDe(v).area >= 0.5,
        bien: 'El plano cortó solo tres caras: las de una esquina.',
        pista: 'Inclina el plano y súbelo hasta que pase cerca de una esquina.' },
      { texto: 'Saca un hexágono del cubo.',
        logrado: v => v.forma === 'cubo' && seccionDe(v).lados === 6,
        bien: 'Seis caras cortadas, seis lados. Ningún prisma de cuatro caras laterales da más.',
        pista: 'Inclina unos 55°, gira 45° y deja la altura en 0.' },
      { texto: 'Busca una sección de cinco lados.',
        logrado: v => seccionDe(v).lados === 5,
        bien: 'Cinco lados: el plano corta cinco de las seis caras.',
        pista: 'Parte de un hexágono y sube un poco el plano.' },
      { texto: 'En el ladrillo, logra una sección que no sea rectángulo ni triángulo.',
        logrado: v => v.forma === 'ladrillo' && seccionDe(v).lados >= 4 && !['rectángulo', 'cuadrado'].includes(seccionDe(v).nombre),
        bien: 'Inclinado en dos direcciones, el corte deja de ser rectángulo.',
        pista: 'Usa inclinación y giro a la vez; con uno solo sale un rectángulo.' },
      { texto: 'Guarda dos cortes del cubo con los mismos lados y distinta área.',
        logrado: (v, guardados) => guardados.some(a => guardados.some(b => a.forma === 'cubo' && b.forma === 'cubo'
          && seccionDe(a).lados >= 3 && seccionDe(a).lados === seccionDe(b).lados && Math.abs(seccionDe(a).area - seccionDe(b).area) > 0.01)),
        bien: 'La forma se repite, pero el tamaño depende de dónde cortas.' },
    ],
  };

  return {
    unidad: 'geometria.prisma-y-piramide',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/geo-figura.js', '/nucleo/kit/piezas/geo-corte-3d.js'],
    historia: {
      texto: 'El problema 14 del papiro de Moscú, escrito en Egipto hace más de 3800 años, calcula el volumen de un tronco de pirámide de bases cuadradas: lados 4 y 2, altura 6. El procedimiento da 56, igual que la fórmula exacta de hoy. El papiro no explica cómo se obtuvo la regla.',
      pregunta: '¿Por qué el volumen no es el promedio de las bases por la altura?',
      fuente: { titulo: 'J. J. O’Connor y E. F. Robertson, «Egyptian papyri», MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/HistTopics/Egyptian_papyri/' },
    },
    // Glosario por tema (docs/teoria.md §4d). «Prisma», «pirámide», «cara lateral» y «arista lateral» vienen de
    // Poliedros; «apotema», «volumen», «media geométrica» y «semiperímetro», de unidades anteriores.
    glosario: [
      { termino: 'sección plana', formas: ['sección plana', 'secciones planas'],
        def: 'La figura que deja un plano al pasar a través de un sólido: lo que se ve al cortarlo.',
        ejemplo: 'Un cubo cortado por el medio, en horizontal, deja un cuadrado.', ver: ['plano'] },
      { termino: 'prisma recto', formas: ['prisma recto', 'prismas rectos'],
        def: 'El que tiene las aristas laterales a 90° de las bases: su altura mide lo mismo que ellas.', ver: ['prisma oblicuo'] },
      { termino: 'prisma oblicuo', formas: ['prisma oblicuo', 'prismas oblicuos'],
        def: 'El de aristas laterales inclinadas: su altura, a 90° de la base, es más corta que ellas.',
        ejemplo: 'Arista 10 a 53° de la base: altura 10 · sen 53° = 8.', ver: ['prisma recto'] },
      { termino: 'prisma regular', formas: ['prisma regular', 'prismas regulares'],
        def: 'Prisma recto cuya base es un polígono regular, como un lápiz hexagonal.', ver: ['prisma recto'] },
      { termino: 'pirámide regular', formas: ['pirámide regular', 'pirámides regulares'],
        def: 'Pirámide de base regular con la punta justo encima del centro de esa base.', ver: ['apotema de la pirámide'] },
      { termino: 'apotema de la pirámide',
        def: 'Altura de una cara lateral: va de la punta al punto medio de un lado de la base.',
        ejemplo: 'Altura 4 y apotema de la base 3: mide √(4² + 3²) = 5.', ver: ['pirámide regular', 'área lateral', 'apotema'] },
      { termino: 'área lateral', formas: ['área lateral', 'áreas laterales'],
        def: 'Suma de las áreas de las caras laterales, sin contar las bases.',
        ejemplo: 'Pirámide de base cuadrada de lado 6 y apotema 5: 4 · 6 · 5 / 2 = 60.', ver: ['área total'] },
      { termino: 'área total', formas: ['área total', 'áreas totales'],
        def: 'Área lateral más el área de las bases: todo lo que habría que forrar.',
        ejemplo: 'Esa misma pirámide: 60 + 6² = 96.', ver: ['área lateral'] },
      { termino: 'paralelepípedo', formas: ['paralelepípedo', 'paralelepípedos', 'paralelepípedo rectangular'],
        def: 'Prisma de seis caras que son paralelogramos, opuestas de dos en dos. El rectangular es una caja.',
        ejemplo: 'Caja de 4, 3 y 12: diagonal √(4² + 3² + 12²) = 13.' },
      { termino: 'cúspide', def: 'Punta de una pirámide: el vértice donde se juntan todas sus caras laterales.' },
      { termino: 'tronco de pirámide', formas: ['tronco de pirámide', 'troncos de pirámide'],
        def: 'Lo que queda de una pirámide entre la base y un corte paralelo a ella: tiene dos bases semejantes.',
        ejemplo: 'Lados 4 y 2, altura 6: V = 6/3 · (16 + 4 + 8) = 56.', ver: ['pirámide regular', 'media geométrica'] },
      { termino: 'tronco de prisma', formas: ['tronco de prisma', 'troncos de prisma'],
        def: 'Lo que queda de un prisma bajo un corte inclinado: sus aristas laterales miden distinto.',
        ejemplo: 'Base 10 y aristas 4, 6 y 8: V = 10 · 6 = 60.', ver: ['equivalente'] },
      { termino: 'sólidos semejantes', formas: ['sólidos semejantes', 'sólidos son semejantes'],
        def: 'Uno es copia a escala del otro: todas sus longitudes se multiplican por un mismo número k.',
        ejemplo: 'Con k = 1/2, el volumen queda en (1/2)³ = 1/8.', ver: ['semejanza'] },
    ],
    // Laboratorio: primero el prisma que se corta, en 3D (exploración libre). La pirámide en su prisma y el tronco libre
    // son más ricas que sus ideas; la última mesa es el corte de la idea 6 con su gesto.
    // La mesa de la escala trae sus retos en el primer objeto; los cuenta k³, la misma razón de la lectura.
    laboratorio: [mesaCorte, mesaEnPrisma, mesaTronco, Object.assign({ id: 'escala', titulo: 'Escala al cubo', pieza: 'geo-figura', invitaciones: [
      { texto: 'Haz que la punta tenga justo 1/8 del volumen de la pirámide.',
        logrado: v => casi(v.t ** 3, 1 / 8),
        bien: 'k = 1/2: la mitad de alto deja solo un octavo del volumen.' },
      { texto: 'Corta lo más cerca posible de la punta y lee los volúmenes.',
        logrado: v => v.t === semIdea.juega.controles[0].min,
        bien: 'k = 1/4 deja 1/64 del volumen arriba: casi todo es tronco.' },
      { texto: 'Guarda dos cortes en que uno tenga el doble de k que el otro.',
        logrado: (v, guardados) => guardados.some(g => casi(v.t, 2 * g.t) || casi(g.t, 2 * v.t)) && guardados.some(g => g.t === v.t),
        bien: 'Doble de k, ocho veces el volumen: 2³ = 8.' },
    ] }, semIdea.juega)],
    ideas: [prismaIdea, cajaIdea, pirIdea, troncoIdea, tpIdea, semIdea],
  };
});
