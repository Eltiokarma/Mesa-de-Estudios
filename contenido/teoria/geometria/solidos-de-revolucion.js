/*
 * Teoría de «Cilindro, cono y esfera» (geometria.solidos-de-revolucion). Molde: docs/teoria.md.
 * Fuente: docs/teoria/matriz/geometria.json (unidad 16); Arquímedes, Sobre la esfera y el cilindro; Euclides XII.
 * Compañera: Neri (nutria). Pieza: geo-figura (3D para cilindros y conos; corte axial en 2D para esfera y Pappus).
 *
 * Ficha de tarea
 *   Promesa: separar altura de generatriz, superficie de volumen y zona de casquete, y saber de dónde salen las
 *     fórmulas (desarrollo, sección, centroide).
 *   Persona y condiciones: postulante de 5.º de secundaria, celular a 360 px, sin audio, quizás sin conexión.
 *   Resultado observable: calcula áreas y volúmenes de cilindro, tronco de cilindro, cono, tronco de cono y esfera;
 *     el ángulo del desarrollo de un cono; zonas y casquetes; volúmenes con Pappus-Guldin.
 *   Orden de atención: 1.º la figura y su lectura · 2.º la pregunta · acción: «Comprobar» · fondo: Neri.
 *   Estados: jugando · predicción sin elegir · comprobada · paso de «Mira» · regla · caso nuevo.
 *   Duda que resuelve: «¿h o g?» y «¿la zona cerca del polo es más chica?».
 *
 * Fidelidad 3D: las siluetas del cono y del tronco de cono son las tangentes exactas a la elipse de la base en la
 * proyección; lo que queda detrás va discontinuo.
 * Colores: radio naranja (c-o), altura o eje turquesa (c-i), generatriz o superficie verde (c-d), lo pedido rojo (c-h).
 * Códigos: GE13, GE19, GE20, GE21 (docs/investigacion/geometria-ideas-erroneas.md); GE-REV1 a GE-REV5 son hipótesis
 * nuevas (rutinas/teoria-geometria.md).
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
  const pi = k => (Math.abs(k - 1) < 1e-9 ? 'π' : `${f(k)}π`);
  const pi2 = k => (Math.abs(k - 1) < 1e-9 ? 'π²' : `${f(k)}π²`);
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = l => l[Math.floor(r() * l.length)];
    return r;
  }
  function opciones(correcta, distractores, fmt = pi, n = 4) {
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
  const cr = { v: 'c-o', t: 'r' }, ch = { v: 'c-i', t: 'h' }, cg = { v: 'c-d', t: 'g' }, cR = { v: 'c-o', t: 'R' };

  // ---------- Siluetas de revolución en 3D (eje vertical, sin giro) ----------
  const ALZA = 20, TD = { giro: 0, alza: ALZA };
  const SEP = '   ·   ';   // separa dos relaciones en una lectura o ecuación
  const nb = t => t.replace(/ /g, '\u00a0');   // una relación de la lectura no se parte entre dos líneas
  // Gesto directo (docs/teoria.md §4b): la manija vive en el viewBox de geo-figura. En 3D cada manija corre por una
  // recta (generatriz, altura, radio) y G.sobreRecta da el parámetro t, elegido para que sea el valor del control;
  // en los cortes planos (desarrollo, zona, Pappus) se usa G.aPlano. El lector ajusta al paso y al rango.
  const enPantalla = (datos, p) => G.aPantalla(datos, p);
  const sobre = (datos, A, B, p) => G.sobreRecta(datos, A, B, p);
  const alPlano = (datos, p) => G.aPlano(datos, p);
  const circ = (y, r, de = 0, a = 360, n = 48) => Array.from({ length: n + 1 }, (_, k) => { const t = U.rad(de + (a - de) * k / n); return [r * Math.cos(t), y, r * Math.sin(t)]; });
  // Parámetro t del punto de tangencia de la silueta de un cono de punta a altura ya sobre la base (y0, r).
  const tangente = (y0, ya, r) => { const s = Math.sin(U.rad(ALZA)), c = Math.cos(U.rad(ALZA)); return Math.asin(Math.max(-1, Math.min(1, r * s / ((y0 - ya) * c)))); };
  const enT = (y, r, t) => [r * Math.cos(t), y, r * Math.sin(t)];

  // ---------- Idea 1: cilindro y tronco de cilindro ----------
  // Cambia: el corte inclinado · Permanece: el radio · Progresa: las generatrices mayor y menor ·
  // Se reserva: generatrices 4 y 10 · Debe verse: el corte oblicuo reparte: altura promedio.
  const cilFig = (r, g1, g2, o = {}) => {
    const k = o.pasos || {}, y0 = -1.5, gm = (g1 + g2) / 2, dg = (g2 - g1) / 2, top = Array.from({ length: 49 }, (_, i) => { const t = 2 * Math.PI * i / 48; return [r * Math.cos(t), y0 + gm + dg * Math.cos(t), r * Math.sin(t)]; });
    return {
      alt: o.alt || (g1 === g2 ? `Cilindro de radio ${o.tr || 'r'} y altura ${o.tg2 || 'h'}` : `Tronco de cilindro de radio ${o.tr || 'r'} con generatrices ${o.tg1 || g1} y ${o.tg2 || g2}: su volumen es el del cilindro de altura promedio`),
      tresD: TD, vista: { x: [-2.4, 2.4], y: [-2.1, 2.5] },
      puntos: [pt('O', [0, y0, 0], { sinPunto: true }), pt('R', [r, y0, 0], { sinPunto: true }), pt('L0', [-r, y0, 0], { sinPunto: true }), pt('L1', [-r, y0 + g1, 0], { sinPunto: true }), pt('D0', [r, y0, 0], { sinPunto: true }), pt('D1', [r, y0 + g2, 0], { sinPunto: true }),
        pt('M0', [0, y0, 0], { sinPunto: true }), pt('M1', [0, y0 + gm, 0], { sinPunto: true })],
      curvas: [{ puntos: circ(y0, r), atras: true, color: 'd' }, { puntos: top, atras: g1 === g2, color: 'd' }],
      regiones: [{ puntos: circ(y0, r), color: 'o', opacidad: 0.12, sinBorde: true }],
      segmentos: [{ de: 'L0', a: 'L1', color: g1 === g2 ? 'd' : 'i', grosor: 'variable', texto: o.tg1, lado: 1 }, { de: 'D0', a: 'D1', color: g1 === g2 ? 'i' : 'h', grosor: 'variable', texto: o.tg2, lado: -1 },
        { de: 'O', a: 'R', color: 'o', discontinua: true, texto: o.tr, lado: 1 },
        ...(g1 !== g2 ? [{ de: 'M0', a: 'M1', color: 'd', discontinua: true, texto: o.tm, desde: k.m ?? 99 }] : [])],
    };
  };
  const cilIdea = {
    id: 'cilindro',
    titulo: 'Cilindro cortado en diagonal',
    temas: ['Cilindro y tronco de cilindro'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Un cilindro de radio 1,5 se corta con un plano inclinado. Cambia la generatriz menor y la mayor y mira el volumen.',
      voz: 'Inclina el corte. ¿Qué altura representa al sólido?',
      controles: [
        { id: 'g1', etiqueta: 'generatriz menor', min: 1, max: 3, paso: 0.5, inicio: 1.5, unidad: '', decimales: 1, color: 'c-i' },
        { id: 'g2', etiqueta: 'generatriz mayor', min: 3, max: 4, paso: 0.5, inicio: 3.5, unidad: '', decimales: 1, color: 'c-h' },
      ],
      dibujo: v => ({ datos: cilFig(1.5, v.g1, v.g2, { tg1: f(v.g1), tg2: f(v.g2) }), estado: {} }),
      // Se agarra la punta de cada generatriz y se sube o se baja: el plano de corte se inclina.
      arrastres: [
        { id: 'generatriz-menor', etiqueta: 'punta de la generatriz menor', color: 'c-i',
          donde: v => enPantalla(cilFig(1.5, v.g1, v.g2), [-1.5, -1.5 + v.g1, 0]),
          mover: (p, v) => ({ g1: sobre(cilFig(1.5, v.g1, v.g2), [-1.5, -1.5, 0], [-1.5, -0.5, 0], p) }) },
        { id: 'generatriz-mayor', etiqueta: 'punta de la generatriz mayor', color: 'c-h',
          donde: v => enPantalla(cilFig(1.5, v.g1, v.g2), [1.5, -1.5 + v.g2, 0]),
          mover: (p, v) => ({ g2: sobre(cilFig(1.5, v.g1, v.g2), [1.5, -1.5, 0], [1.5, -0.5, 0], p) }) },
      ],
      lectura: v => [`V = π · 1,5² · (${f(v.g1)} + ${f(v.g2)}) / 2 = ${pi(2.25 * (v.g1 + v.g2) / 2)}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Un tronco de cilindro tiene radio 3 y sus generatrices mayor y menor miden 10 y 4. ¿Cuál es su volumen?',
      voz: 'El corte quita de un lado lo que agrega del otro.',
      opciones: [
        { id: 'c', texto: '63π', correcta: true },
        { id: 'max', texto: '90π', error: 'GE-REV1', siFuera: '90π usa la generatriz mayor: ese cilindro contiene al tronco.' },
        { id: 'min', texto: '36π', error: 'GE-REV1', siFuera: '36π usa la menor: ese cilindro queda dentro del tronco.' },
        { id: 'suma', texto: '126π', error: 'GE-REV1', siFuera: '126π suma las generatrices sin promediar.' },
      ],
      dibujo: { datos: cilFig(1.5, 1.4, 3.5, { tr: '3', tg1: '4', tg2: '10' }), estado: {} },
      revelar: { datos: cilFig(1.5, 1.4, 3.5, { tr: '3', tg1: '4', tg2: '10', tm: '7', pasos: { m: 0 } }), estado: {} },
      coincide: 'Coincide: altura promedio 7 y V = 9π · 7.',
    },
    mira: {
      datos: cilFig(1.5, 1.4, 3.5, { tr: '3', tg1: '4', tg2: '10', tm: '7', pasos: { m: 1 } }),
      voz: 'Promedia las generatrices: el eje mide eso.',
      pasos: [
        { estado: { corte: 0 }, texto: 'La base es un círculo de radio 3.', ecuacion: ['B = π · 3² = 9π'] },
        { estado: { corte: 1 }, texto: 'El eje corta el plano a la altura promedio.', ecuacion: [frac('4 + 10', '2'), ' = 7'] },
        { estado: { corte: 1 }, texto: 'Base por el eje.', ecuacion: ['V = 9π · 7 = 63π'] },
      ],
    },
    regla: {
      texto: 'Cilindro recto: volumen base por altura y área lateral 2πrh. Tronco de cilindro: base por el promedio de las generatrices mayor y menor.',
      ecuacion: ['V = π', { sup: [cr, '2'] }, ch, '   ·   ', 'A', { sub: ['', 'L'] }, ' = 2π', cr, ch, '   ·   ', 'tronco: V = π', { sup: [cr, '2'] }, ' · ', { llave: [frac(['g', { sub: ['', '1'] }, ' + g', { sub: ['', '2'] }], '2')], nota: 'altura promedio' }],
      condicion: 'el cilindro es recto y la base del tronco es un círculo perpendicular a las generatrices.',
      voz: 'Altura promedio, no la mayor ni la menor.',
    },
    ahoraTu: {
      voz: 'Decide si te piden área o volumen.',
      generar(s) {
        const r = azar(s), rr = r.ent(1, 8), h = r.ent(2, 12);
        if (s % 2 === 1) {
          const g1 = r.ent(2, 9), g2 = g1 + 2 * r.ent(1, 4);
          return {
            pregunta: [`Un tronco de cilindro tiene radio ${rr} y generatrices de ${g1} y ${g2}. ¿Cuál es su volumen?`],
            opciones: opciones(rr * rr * (g1 + g2) / 2, [
              { id: 'max', valor: rr * rr * g2, error: 'GE-REV1', siFuera: 'La mayor da un cilindro más grande que el tronco.' },
              { id: 'suma', valor: rr * rr * (g1 + g2), error: 'GE-REV1', siFuera: 'Falta promediar las generatrices.' },
              { id: 'min', valor: rr * rr * g1, error: 'GE-REV1', siFuera: 'La menor da un cilindro más chico que el tronco.' },
            ]),
            solucion: { texto: `Altura promedio ${f((g1 + g2) / 2)}.`, ecuacion: [`π · ${rr}² · ${f((g1 + g2) / 2)} = ${pi(rr * rr * (g1 + g2) / 2)}`] },
          };
        }
        const pide = r.de(['AL', 'AT', 'V']), val = { AL: 2 * rr * h, AT: 2 * rr * h + 2 * rr * rr, V: rr * rr * h }[pide];
        return {
          pregunta: [`Un cilindro recto tiene radio ${rr} y altura ${h}. ¿Cuánto mide su ${{ AL: 'área lateral', AT: 'área total', V: 'volumen' }[pide]}?`],
          opciones: opciones(val, [
            { id: 'v', valor: pide === 'V' ? 2 * rr * h : rr * rr * h, error: 'GE13', siFuera: pide === 'V' ? 'Esa es el área lateral.' : 'Ese es el volumen.' },
            { id: 'sin2', valor: pide === 'V' ? 2 * rr * rr * h : rr * h + (pide === 'AT' ? 2 * rr * rr : 0), error: 'GE19', siFuera: pide === 'V' ? 'Eso usa el diámetro donde va el radio.' : 'El borde de la base mide 2πr, no πr.' },
            { id: 'una', valor: pide === 'AT' ? 2 * rr * h + rr * rr : pide === 'AL' ? 2 * rr * h + 2 * rr * rr : rr * rr * h / 3, error: pide === 'V' ? 'GE20' : 'GE-REV2', siFuera: pide === 'AT' ? 'Hay dos bases.' : pide === 'AL' ? 'Esa suma las bases: es el área total.' : 'El tercio es del cono.' },
          ]),
          solucion: { texto: 'Lateral 2πrh; cada base πr².', ecuacion: [pide === 'V' ? `π · ${rr}² · ${h} = ${pi(val)}` : pide === 'AL' ? `2π · ${rr} · ${h} = ${pi(val)}` : `2π · ${rr} · ${h} + 2π · ${rr}² = ${pi(val)}`] },
        };
      },
    },
  };

  // ---------- Idea 2: cono y tronco de cono ----------
  // Cambia: la altura · Permanece: el radio 3 · Progresa: la generatriz ·
  // Se reserva: radio 3 y altura 4 · Debe verse: el área lateral usa g; el volumen usa h.
  const conoFig = (r, h, o = {}) => {
    const k = o.pasos || {}, e = o.escala || 0.55, y0 = -1.7, R = r * e, ya = y0 + h * e, t = tangente(y0, ya, R), T = enT(y0, R, t), T2 = enT(y0, R, Math.PI - t);
    return {
      alt: o.alt || `Cono de radio ${r} y altura ${h}: generatriz √(${r}² + ${h}²) = ${f(Math.hypot(r, h))}`,
      tresD: TD, vista: { x: [-2.4, 2.4], y: [-2.3, 2.4] },
      puntos: [pt('V', [0, ya, 0], { rotulo: 'V', lado: 90 }), pt('O', [0, y0, 0], { color: 'i' }), pt('A', [R, y0, 0], { sinPunto: true }), pt('T', T, { sinPunto: true }), pt('T2', T2, { sinPunto: true })],
      curvas: [{ puntos: circ(y0, R), atras: true, color: 'd' }],
      regiones: [{ puntos: circ(y0, R), color: 'o', opacidad: 0.1, sinBorde: true }],
      segmentos: [{ de: 'V', a: 'T2', color: 'd', grosor: 'contorno' }, { de: 'V', a: 'T', color: 'd', grosor: 'variable', texto: o.g, desde: k.g || 0 },
        { de: 'V', a: 'O', color: 'i', discontinua: true, grosor: 'variable', texto: o.h ?? `${h}`, lado: -1 }, { de: 'O', a: 'A', color: 'o', discontinua: true, texto: o.r ?? `${r}`, lado: 1 }],
    };
  };
  const conoIdea = {
    id: 'cono',
    titulo: 'Altura adentro, generatriz afuera',
    temas: ['Cono y tronco de cono'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Cono de radio 3. Cambia la altura VO. La generatriz va por el borde, de la punta al círculo de la base.',
      voz: 'Sube la punta. ¿Qué crece más, h o g?',
      controles: [{ id: 'h', etiqueta: 'altura', min: 2, max: 7, paso: 1, inicio: 4, unidad: '', decimales: 0, color: 'c-i' }],
      dibujo: v => ({ datos: conoFig(3, v.h, { g: f(Math.hypot(3, v.h)) }), estado: {} }),
      // Se agarra la punta V y se sube o se baja por la altura: la base no cambia, la generatriz sí.
      arrastres: [{ id: 'punta-v', etiqueta: 'punta V del cono', color: 'c-i',
        donde: v => enPantalla(conoFig(3, v.h), [0, -1.7 + 0.55 * v.h, 0]),
        mover: (p, v) => ({ h: sobre(conoFig(3, v.h), [0, -1.7, 0], [0, -1.15, 0], p) }) }],
      lectura: v => [nb(`g = √(3² + ${v.h}²) = ${f(Math.hypot(3, v.h))}`), SEP, nb(`lateral = ${pi(3 * Math.hypot(3, v.h))}`), SEP, nb(`V = ${pi(3 * v.h)}`)],
      minimo: 3,
    },
    predice: {
      pregunta: 'Un cono recto tiene radio 3 y altura 4. ¿Cuál es su área lateral?',
      voz: 'La superficie lateral se mide por el borde inclinado.',
      opciones: [
        { id: 'c', texto: '15π', correcta: true },
        { id: 'altura', texto: '12π', error: 'GE21', siFuera: '12π usa la altura 4; la superficie lateral va por la generatriz 5.' },
        { id: 'total', texto: '24π', error: 'GE-REV2', siFuera: '24π suma la base: es el área total.' },
        { id: 'doble', texto: '30π', error: 'GE19', siFuera: '30π usa el diámetro: el área lateral es πrg.' },
      ],
      dibujo: { datos: conoFig(3, 4, { pasos: { g: 99 } }), estado: {} },
      revelar: { datos: conoFig(3, 4, { g: '5' }), estado: {} },
      coincide: 'Coincide: g = 5 y π · 3 · 5 = 15π.',
    },
    mira: {
      datos: conoFig(3, 4, { g: '5', pasos: { g: 1 } }),
      voz: 'Radio, altura y generatriz forman un triángulo rectángulo.',
      pasos: [
        { estado: { corte: 0 }, texto: 'La altura cae dentro del cono, al centro de la base.', ecuacion: ['h = 4, r = 3'] },
        { estado: { corte: 1 }, texto: 'La generatriz va por la superficie.', ecuacion: ['g = √(3² + 4²) = 5'] },
        { estado: { corte: 1 }, texto: 'Área lateral con g; volumen con h.', ecuacion: ['π · 3 · 5 = 15π', '   ·   ', frac('π · 3² · 4', '3'), ' = 12π'] },
      ],
    },
    regla: {
      texto: 'En el cono recto, el área lateral es πrg y el volumen, un tercio de base por altura. El tronco de cono suma R², Rr y r².',
      ecuacion: ['A', { sub: ['', 'L'] }, ' = π', cr, { llave: [cg], nota: 'generatriz', color: 'c-d' }, '   ·   ', 'V = ', frac(['π', { sup: [cr, '2'] }, { llave: [ch], nota: 'altura', color: 'c-i' }], '3'), '   ·   ', 'tronco: V = ', frac(['π', ch], '3'), '(', { sup: [cR, '2'] }, ' + ', cR, cr, ' + ', { sup: [cr, '2'] }, ')'],
      condicion: 'el cono es recto: g² = r² + h². En el tronco, las bases son paralelas.',
      voz: 'g para la superficie; h para el volumen.',
    },
    ahoraTu: {
      voz: 'Arma el triángulo r, h, g antes de calcular.',
      generar(s) {
        const r = azar(s);
        if (s % 4 === 3) {
          const R = r.ent(3, 8), rr = r.ent(1, R - 1), h = 3 * r.ent(1, 4), V = h * (R * R + R * rr + rr * rr) / 3;
          return {
            pregunta: [`Un tronco de cono tiene radios ${R} y ${rr} y altura ${h}. ¿Cuál es su volumen?`],
            opciones: opciones(V, [
              { id: 'sinmedio', valor: h * (R * R + rr * rr) / 3, error: 'GE-REV3', siFuera: 'Falta el término del medio, R · r.' },
              { id: 'prom', valor: h * (R * R + rr * rr) / 2, error: 'GE-REV3', siFuera: 'Promediar las bases sirve en el cilindro, no en el tronco.' },
              { id: 'sin3', valor: h * (R * R + R * rr + rr * rr), error: 'GE20', siFuera: 'Falta dividir entre 3.' },
            ]),
            solucion: { texto: 'R², R · r y r².', ecuacion: [`π · ${h}/3 · (${R * R} + ${R * rr} + ${rr * rr}) = ${pi(V)}`] },
          };
        }
        const [rr, h, g] = r.de([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10], [9, 12, 15], [12, 5, 13], [8, 15, 17], [4, 3, 5]]), pide = ['AL', 'AT', 'V'][s % 4];
        const val = { AL: rr * g, AT: rr * g + rr * rr, V: rr * rr * h / 3 }[pide];
        return {
          pregunta: [`Un cono recto tiene radio ${rr} y altura ${h}. ¿Cuánto mide su ${{ AL: 'área lateral', AT: 'área total', V: 'volumen' }[pide]}?`],
          opciones: opciones(val, pide === 'V' ? [
            { id: 'sin3', valor: rr * rr * h, error: 'GE20', siFuera: 'Falta el tercio: es un cono, no un cilindro.' },
            { id: 'g', valor: rr * rr * g / 3, error: 'GE21', siFuera: 'El volumen usa la altura, no la generatriz.' },
            { id: 'al', valor: rr * g, error: 'GE13', siFuera: 'Esa es el área lateral.' },
          ] : [
            { id: 'h', valor: rr * h + (pide === 'AT' ? rr * rr : 0), error: 'GE21', siFuera: 'La superficie lateral usa la generatriz, no la altura.' },
            { id: 'otra', valor: pide === 'AT' ? rr * g : rr * g + rr * rr, error: 'GE-REV2', siFuera: pide === 'AT' ? 'Falta sumar la base.' : 'Esa suma la base: es el total.' },
            { id: 'doble', valor: 2 * rr * g + (pide === 'AT' ? rr * rr : 0), error: 'GE19', siFuera: 'El área lateral es πrg, sin el 2.' },
          ]),
          solucion: { texto: `g = √(${rr}² + ${h}²) = ${g}.`, ecuacion: [pide === 'V' ? `π · ${rr}² · ${h} / 3 = ${pi(val)}` : pide === 'AL' ? `π · ${rr} · ${g} = ${pi(val)}` : `π · ${rr} · ${g} + π · ${rr}² = ${pi(val)}`] },
        };
      },
    },
  };

  // ---------- Idea 3: desarrollos ----------
  // Cambia: radio y generatriz · Permanece: el arco del sector mide 2πr · Progresa: el ángulo del sector ·
  // Se reserva: r = 3, g = 5 · Debe verse: el sector tiene radio g y arco igual al borde de la base.
  const desFig = (r, g, o = {}) => {
    const th = 360 * r / g, esc = 2.6 / g, G0 = [-2, 0];
    return {
      alt: o.alt || `Desarrollo de un cono de radio ${r} y generatriz ${g}: un sector de radio ${g} y ángulo ${f(th)}°, con arco 2π · ${r}`,
      vista: { x: [-4.9, 5.3], y: [-3, 3] },
      puntos: [pt('V', G0, { rotulo: 'V', lado: 180 }), pt('P', U.polar(G0, g * esc, -th / 2), { sinPunto: true }), pt('Q', U.polar(G0, g * esc, th / 2), { sinPunto: true }), pt('C', [3, 0], { sinPunto: true }), pt('C1', [3 + r * esc, 0], { sinPunto: true })],
      regiones: [{ puntos: [G0, ...U.arco(G0, g * esc, -th / 2, th / 2, 48)], color: 'd', opacidad: 0.18, sinBorde: false }, { puntos: U.arco([3, 0], r * esc, 0, 360, 40), color: 'o', opacidad: 0.12, sinBorde: false }],
      arcos: [{ centro: G0, r: g * esc, de: -th / 2, a: th / 2, color: 'd', grosor: 'variable' }, { centro: G0, r: 0.6, de: -th / 2, a: th / 2, color: 'h', texto: o.th ?? `${f(th)}°` }],
      segmentos: [{ de: 'V', a: 'P', color: 'd', texto: o.g ?? `${g}`, lado: -1 }, { de: 'V', a: 'Q', color: 'd' }, { de: 'C', a: 'C1', color: 'o', texto: o.r ?? `${r}` }],
    };
  };
  const desIdea = {
    id: 'desarrollo',
    titulo: 'El cono abierto',
    temas: ['Desarrollos de superficies'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'El cono se corta por una generatriz y se aplana: queda un sector de radio g cuyo arco envuelve la base. Cambia r y g.',
      voz: 'Cambia r y g. ¿Cuándo el sector se vuelve más ancho?',
      controles: [
        { id: 'r', etiqueta: 'r', min: 1, max: 4, paso: 1, inicio: 3, unidad: '', decimales: 0, color: 'c-o' },
        { id: 'g', etiqueta: 'g', min: 5, max: 8, paso: 1, inicio: 5, unidad: '', decimales: 0, color: 'c-d' },
      ],
      dibujo: v => ({ datos: desFig(v.r, v.g), estado: {} }),
      // Se agarran el borde del sector (abre o cierra el abanico: con r fijo, g = 360° · r / θ) y el borde del círculo
      // de la base (r). El sector se dibuja siempre del mismo radio: lo que cambia es su ángulo.
      arrastres: [
        { id: 'borde-sector', etiqueta: 'borde del sector', color: 'c-d',
          donde: v => { const q = U.polar([-2, 0], 2.6, 180 * v.r / v.g); return enPantalla(desFig(v.r, v.g), q); },
          mover: (p, v) => { const q = alPlano(desFig(v.r, v.g), p), th = 2 * U.grados(Math.atan2(q[1], q[0] + 2)); return { g: th > 0 ? 360 * v.r / th : 99 }; } },
        { id: 'radio-base', etiqueta: 'borde del círculo de la base', color: 'c-o',
          donde: v => enPantalla(desFig(v.r, v.g), [3 + v.r * 2.6 / v.g, 0]),
          mover: (p, v) => ({ r: (alPlano(desFig(v.r, v.g), p)[0] - 3) * v.g / 2.6 }) },
      ],
      lectura: v => [nb(`ángulo = 360° · ${v.r}/${v.g} = ${f(360 * v.r / v.g)}°`), SEP, nb(`arco = 2π · ${v.r} = ${pi(2 * v.r)}`)],
      minimo: 4,
    },
    predice: {
      pregunta: 'Un cono tiene radio 3 y generatriz 5. Al desarrollar su superficie lateral, ¿qué ángulo tiene el sector?',
      voz: 'El arco del sector es el borde de la base.',
      opciones: [
        { id: 'c', texto: '216°', correcta: true },
        { id: 'h', texto: '270°', error: 'GE21', siFuera: '270° usa la altura 4 en lugar de la generatriz.' },
        { id: 'mitad', texto: '108°', error: 'GE19', siFuera: '108° compara con πg, la mitad de la circunferencia del sector.' },
        { id: 'inv', texto: '600°', error: 'GE-REV4', siFuera: 'Un sector no pasa de 360°: la razón es r/g, no g/r.' },
      ],
      dibujo: { datos: desFig(3, 5, { th: '?' }), estado: {} },
      revelar: { datos: desFig(3, 5), estado: {} },
      coincide: 'Coincide: 360° · 3/5 = 216°.',
    },
    mira: {
      datos: desFig(3, 5),
      voz: 'Arco del sector igual al borde de la base.',
      pasos: [
        { estado: { corte: 0 }, texto: 'El borde de la base mide 2π · 3 = 6π.', ecuacion: ['arco = 6π'] },
        { estado: { corte: 0 }, texto: 'El sector es parte de un círculo de radio 5, de borde 10π.', ecuacion: [frac('6π', '10π'), ' = ', frac('3', '5')] },
        { estado: { corte: 0 }, texto: 'Esa fracción de 360°.', ecuacion: [frac('3', '5'), ' · 360° = 216°'] },
      ],
    },
    regla: {
      texto: 'La superficie lateral de un cono se desarrolla en un sector de radio g cuyo arco mide 2πr. La del cilindro, en un rectángulo de 2πr por h.',
      ecuacion: ['θ = 360° · ', frac(cr, { llave: [cg], nota: 'radio del sector', color: 'c-d' }), '   ·   ', 'cilindro: 2π', cr, ' × ', ch],
      condicion: 'el cono es recto. La esfera no se puede aplanar sin deformarse.',
      voz: 'El arco del sector envuelve la base.',
    },
    ahoraTu: {
      voz: 'Iguala el arco del sector con el borde de la base.',
      generar(s) {
        const r = azar(s), [rr, g] = r.de([[1, 2], [1, 3], [1, 4], [2, 3], [3, 5], [2, 5], [1, 6], [5, 6], [3, 4], [5, 8], [5, 12], [3, 8], [4, 5]]), th = 360 * rr / g;
        if (s % 2 === 0) return {
          pregunta: [`Un cono tiene radio ${rr} y generatriz ${g}. ¿Qué ángulo tiene el sector de su desarrollo lateral?`],
          opciones: opciones(th, [
            { id: 'mitad', valor: th / 2, error: 'GE19', siFuera: 'Compara con 2πg, no con πg.' },
            { id: 'inv', valor: 360 * g / rr, error: 'GE-REV4', siFuera: 'La razón es r/g; con g/r pasa de 360°.' },
            { id: 'r', valor: 180 * rr / g + 90, error: 'GE-REV4', siFuera: 'Iguala el arco con el borde de la base.' },
          ], x => `${f(x)}°`),
          solucion: { texto: `Fracción ${rr}/${g} de 360°.`, ecuacion: [`360° · ${rr}/${g} = ${f(th)}°`] },
        };
        return {
          pregunta: [`El desarrollo lateral de un cono es un sector de radio ${g} y ángulo ${f(th)}°. ¿Cuánto mide el radio de la base?`],
          opciones: opciones(rr, [
            { id: 'diam', valor: 2 * rr, error: 'GE19', siFuera: 'Eso es el diámetro.' },
            { id: 'g', valor: g, error: 'GE21', siFuera: 'Ese es el radio del sector: la generatriz.' },
            { id: 'mitad', valor: rr / 2, error: 'GE19', siFuera: 'El arco mide 2πr: no olvides el 2.' },
          ], x => f(x)),
          solucion: { texto: 'Arco del sector = 2πr.', ecuacion: [`${f(th)}/360 · 2π · ${g} = 2π · r  ⇒  r = ${rr}`] },
        };
      },
    },
  };

  // ---------- Idea 4: esfera ----------
  // Cambia: el radio · Permanece: el cilindro que la envuelve · Progresa: área y volumen ·
  // Se reserva: la razón 2/3 de Arquímedes · Debe verse: la esfera ocupa dos tercios del cilindro.
  // o.s: radio dibujado (2 por defecto). En el juego crece con R, dentro del mismo marco, para que se pueda agarrar.
  const AR = Math.SQRT1_2;
  const esfFig = (o = {}) => { const s = o.s || 2; return {
    alt: 'Esfera de radio R dentro del cilindro de radio R y altura 2R que la envuelve',
    tresD: TD, vista: { x: [-2.6, 2.6], y: [-2.5, 2.5] },
    puntos: [pt('O', [0, 0, 0], { rotulo: 'O', lado: 200 }), pt('A', [s * AR, 0, s * AR], { sinPunto: true }), pt('L0', [-s, -s, 0], { sinPunto: true }), pt('L1', [-s, s, 0], { sinPunto: true }), pt('D0', [s, -s, 0], { sinPunto: true }), pt('D1', [s, s, 0], { sinPunto: true })],
    circulos: [{ centro: 'O', r: s, color: 'h', relleno: true, grosor: 'variable' }],
    curvas: [{ puntos: circ(0, s), atras: true, color: 'h' }, { puntos: circ(-s, s), atras: true, color: 'i' }, { puntos: circ(s, s), color: 'i' }],
    segmentos: [{ de: 'L0', a: 'L1', color: 'i' }, { de: 'D0', a: 'D1', color: 'i', texto: o.h ?? '2R', lado: 1 }, { de: 'O', a: 'A', color: 'o', discontinua: true, texto: o.R ?? 'R' }],
  }; };
  const ES = 0.35;   // radio dibujado por unidad de R en el juego
  const esfIdea = {
    id: 'esfera',
    titulo: 'La esfera en su cilindro',
    temas: ['Esfera y sus partes'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Una esfera de radio R cabe justo en un cilindro de radio R y altura 2R. Cambia R y compara volúmenes y áreas.',
      voz: 'Cambia R. Mira la razón entre esfera y cilindro.',
      controles: [{ id: 'R', etiqueta: 'R', min: 1, max: 6, paso: 1, inicio: 3, unidad: '', decimales: 0, color: 'c-o' }],
      dibujo: v => ({ datos: esfFig({ s: ES * v.R, R: `${v.R}`, h: `${2 * v.R}` }), estado: {} }),
      // Se agarra la punta del radio R y se estira: esfera y cilindro crecen juntos; la razón no cambia.
      arrastres: [{ id: 'radio', etiqueta: 'punta del radio R', color: 'c-o',
        donde: v => enPantalla(esfFig({ s: ES * v.R }), [ES * v.R * AR, 0, ES * v.R * AR]),
        mover: (p, v) => ({ R: sobre(esfFig({ s: ES * v.R }), [0, 0, 0], [ES * AR, 0, ES * AR], p) }) }],
      lectura: v => [nb(`esfera ${pi(4 * v.R ** 3 / 3)}`), SEP, nb(`cilindro ${pi(2 * v.R ** 3)}`), SEP, nb(`área esfera ${pi(4 * v.R * v.R)}`)],
      minimo: 3,
    },
    predice: {
      pregunta: 'Una esfera cabe justo dentro de un cilindro (mismo radio, altura igual al diámetro). ¿Qué fracción del volumen del cilindro ocupa la esfera?',
      voz: 'Arquímedes quiso que esto se grabara en su tumba.',
      opciones: [
        { id: 'c', texto: '2/3', correcta: true },
        { id: 'mitad', texto: '1/2', error: 'GE-REV5', siFuera: 'La esfera llena más de la mitad: 4/3 de πR³ contra 2πR³.' },
        { id: 'pi4', texto: 'π/4', error: 'GE-REV5', siFuera: 'π/4 compara un círculo con su cuadrado: es una razón de áreas planas.' },
        { id: 'tercio', texto: '1/3', error: 'GE20', siFuera: '1/3 es la razón del cono con el cilindro.' },
      ],
      dibujo: { datos: esfFig(), estado: {} },
      revelar: { datos: esfFig(), estado: {} },
      coincide: 'Coincide: (4/3)πR³ ÷ 2πR³ = 2/3.',
    },
    mira: {
      datos: esfFig(),
      voz: 'Compara las dos fórmulas con el mismo R.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Cilindro: base πR² y altura 2R.', ecuacion: ['V = 2π', { sup: [cR, '3'] }] },
        { estado: { corte: 0 }, texto: 'Esfera:', ecuacion: ['V = ', frac('4', '3'), 'π', { sup: [cR, '3'] }] },
        { estado: { corte: 0 }, texto: 'La razón no depende de R.', ecuacion: [frac('4/3', '2'), ' = ', frac('2', '3')] },
        { estado: { corte: 0 }, texto: 'Y el área de la esfera es el área lateral del cilindro.', ecuacion: ['4π', { sup: [cR, '2'] }, ' = 2π', cR, ' · 2', cR] },
      ],
    },
    regla: {
      texto: 'El área de la esfera es cuatro veces la de un círculo máximo; su volumen, cuatro tercios de π por el radio al cubo.',
      ecuacion: ['A = ', { llave: ['4π', { sup: [cR, '2'] }], nota: 'cuatro círculos máximos' }, '   ·   ', 'V = ', frac('4', '3'), 'π', { sup: [cR, '3'] }],
      condicion: 'R es el radio. Área en unidades cuadradas, volumen en cúbicas.',
      voz: 'Área con R², volumen con R³.',
    },
    ahoraTu: {
      voz: 'Área con R²; volumen con R³.',
      generar(s) {
        const r = azar(s), R = s % 2 === 0 ? r.ent(1, 10) : 3 * r.ent(1, 3);
        if (s % 2 === 0) return {
          pregunta: [`¿Cuál es el área de una esfera de radio ${R}?`],
          opciones: opciones(4 * R * R, [
            { id: 'circ', valor: R * R, error: 'GE-REV5', siFuera: 'Ese es un círculo máximo; la esfera tiene cuatro.' },
            { id: 'vol', valor: 4 * R ** 3 / 3, error: 'GE13', siFuera: 'Ese es el volumen.' },
            { id: 'dos', valor: 2 * R * R, error: 'GE-REV5', siFuera: 'Esa es media esfera.' },
          ]),
          solucion: { texto: 'Cuatro círculos máximos.', ecuacion: [`4π · ${R}² = ${pi(4 * R * R)}`] },
        };
        return {
          pregunta: [`¿Cuál es el volumen de una esfera de radio ${R}?`],
          opciones: opciones(4 * R ** 3 / 3, [
            { id: 'sin3', valor: 4 * R ** 3, error: 'GE20', siFuera: 'Falta dividir entre 3.' },
            { id: 'area', valor: 4 * R * R, error: 'GE13', siFuera: 'Esa es el área.' },
            { id: 'cil', valor: 2 * R ** 3, error: 'GE-REV5', siFuera: 'Ese es el cilindro que la envuelve.' },
          ]),
          solucion: { texto: 'Cuatro tercios de π R³.', ecuacion: [`4/3 · π · ${R}³ = ${pi(4 * R ** 3 / 3)}`] },
        };
      },
    },
  };

  // ---------- Idea 5: zona y casquete ----------
  // Cambia: la posición de la franja · Permanece: el radio y el espesor h · Progresa: nada: el área no cambia ·
  // Se reserva: la franja junto al polo · Debe verse: la zona tiene el área de la banda del cilindro: 2πRh.
  const zonaFig = (y1, h, o = {}) => {
    const R = 2.2, e = R / 5, a = y1 * e, b = (y1 + h) * e, sa = Math.sqrt(Math.max(0, R * R - a * a)), sb = Math.sqrt(Math.max(0, R * R - b * b));
    const angA = U.grados(Math.asin(a / R)), angB = U.grados(Math.asin(Math.min(1, b / R)));
    return {
      alt: o.alt || `Corte de una esfera de radio 5 con una franja de espesor ${h}: la zona y la banda del cilindro que la envuelve tienen la misma área, 2π · 5 · ${h} = ${pi(10 * h)}`,
      vista: { x: [-3.4, 3.4], y: [-2.7, 2.7] },
      puntos: [pt('O', [0, 0], { rotulo: 'O', lado: 200 }), pt('a0', [-R - 0.5, a], { sinPunto: true }), pt('a1', [R + 0.5, a], { sinPunto: true }), pt('b0', [-R - 0.5, b], { sinPunto: true }), pt('b1', [R + 0.5, b], { sinPunto: true }),
        pt('c0', [-R, -R], { sinPunto: true }), pt('c1', [-R, R], { sinPunto: true }), pt('d0', [R, -R], { sinPunto: true }), pt('d1', [R, R], { sinPunto: true }), pt('k0', [R + 0.3, a], { sinPunto: true }), pt('k1', [R + 0.3, b], { sinPunto: true })],
      circulos: [{ centro: 'O', r: R, grosor: 'contorno' }],
      arcos: [{ centro: [0, 0], r: R, de: angA, a: angB, color: 'h', grosor: 'variable' }, { centro: [0, 0], r: R, de: 180 - angB, a: 180 - angA, color: 'h', grosor: 'variable' }],
      regiones: [{ puntos: [[-sa, a], [sa, a], ...U.arco([0, 0], R, angA, angB, 20), ...U.arco([0, 0], R, 180 - angB, 180 - angA, 20)].filter(Boolean), color: 'h', opacidad: 0.12 },
        { puntos: [[R, a], [R, b], [R + 0.05, b], [R + 0.05, a]], color: 'i', opacidad: 0.6 }],
      segmentos: [{ de: 'a0', a: 'a1', grosor: 'fino', discontinua: true }, { de: 'b0', a: 'b1', grosor: 'fino', discontinua: true }, { de: 'c0', a: 'c1', color: 'i', discontinua: true, grosor: 'fino' }, { de: 'd0', a: 'd1', color: 'i', discontinua: true, grosor: 'fino' },
        { de: 'k0', a: 'k1', color: 'i', grosor: 'variable', texto: `${f(h)}` }],
    };
  };
  const EZ = 2.2 / 5;
  const zonaArrastre = (id, h, color) => Object.assign({ id: 'plano-bajo', etiqueta: 'plano de abajo de la franja' }, color ? { color } : {}, {
    donde: v => enPantalla(zonaFig(v[id], typeof h === 'number' ? h : v[h]), [2.7, v[id] * EZ]),
    mover: (p, v) => ({ [id]: alPlano(zonaFig(v[id], typeof h === 'number' ? h : v[h]), p)[1] / EZ }) });
  const zonaIdea = {
    id: 'zona-y-casquete',
    titulo: 'Franjas de igual área',
    temas: ['Superficie esférica, zona y casquete'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Dos planos paralelos, separados 2, cortan una esfera de radio 5. Sube o baja la franja y mira el área de la zona roja.',
      voz: 'Mueve la franja del ecuador al polo. ¿Cambia el área?',
      controles: [{ id: 'y', etiqueta: 'altura del plano bajo', min: -5, max: 3, paso: 1, inicio: -1, unidad: '', decimales: 0, color: 'c-i' }],
      dibujo: v => ({ datos: zonaFig(v.y, 2), estado: {} }),
      // Se agarra el plano de abajo por su extremo derecho y se sube o se baja: la franja entera se mueve con él.
      arrastres: [zonaArrastre('y', 2, 'c-i')],
      lectura: () => [nb('zona = 2π · 5 · 2 = 20π'), SEP, nb('banda = 2π · 5 · 2 = 20π')],
      minimo: 4,
    },
    predice: {
      pregunta: 'En una esfera de radio 5, dos planos paralelos separados 2 cortan una zona. Si se mueven hacia el polo sin cambiar su separación, ¿qué pasa con el área de la zona?',
      voz: 'Cerca del polo la franja es más angosta, pero más inclinada.',
      opciones: [
        { id: 'c', texto: 'No cambia: siempre 20π', correcta: true },
        { id: 'baja', texto: 'Disminuye: el borde es más chico', error: 'GE-REV5', siFuera: 'El borde se achica, pero la franja se inclina y se alarga en la misma proporción.' },
        { id: 'sube', texto: 'Aumenta: la superficie se inclina', error: 'GE-REV5', siFuera: 'La inclinación compensa justo el borde más chico: queda igual.' },
      ],
      dibujo: { datos: zonaFig(-1, 2), estado: {} },
      revelar: { datos: zonaFig(3, 2), estado: {} },
      coincide: 'Coincide: la zona mide 2πRh esté donde esté.',
    },
    mira: {
      datos: zonaFig(1, 2),
      voz: 'Arquímedes proyectó la zona sobre el cilindro.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Proyecta la zona horizontalmente sobre el cilindro que envuelve la esfera.', ecuacion: ['banda de alto h'] },
        { estado: { corte: 0 }, texto: 'La banda del cilindro tiene área fácil.', ecuacion: ['2πR · h = 2π · 5 · 2 = 20π'] },
        { estado: { corte: 0 }, texto: 'La zona tiene la misma área que su banda, esté donde esté.', ecuacion: ['zona = 2πRh'] },
        { estado: { corte: 0 }, texto: 'Un casquete es una zona con un solo plano.', ecuacion: ['casquete = 2πRh'] },
      ],
    },
    regla: {
      texto: 'El área de una zona esférica o de un casquete es 2πRh, con h la distancia entre sus planos. El casquete sólido tiene volumen πh²(3R − h)/3.',
      ecuacion: ['zona = 2π', cR, { llave: [{ v: 'c-i', t: 'h' }], nota: 'espesor', color: 'c-i' }, '   ·   ', 'casquete sólido: V = ', frac(['π', { sup: [{ v: 'c-i', t: 'h' }, '2'] }, '(3', cR, ' − ', { v: 'c-i', t: 'h' }, ')'], '3')],
      condicion: 'R es el radio de la esfera, no el del corte; h se mide perpendicular a los planos.',
      voz: 'Solo importan R y la separación h.',
    },
    ahoraTu: {
      voz: 'Ubica R y la separación h entre los planos.',
      generar(s) {
        const r = azar(s), R = r.ent(2, 10), h = r.ent(1, R);
        if (s % 2 === 0) return {
          pregunta: [`Una esfera de radio ${R} se corta con dos planos paralelos separados ${h}. ¿Cuál es el área de la zona esférica entre ellos?`],
          opciones: opciones(2 * R * h, [
            { id: 'cuatro', valor: 4 * R * h, error: 'GE-REV5', siFuera: 'El área es 2πRh: compara con la banda del cilindro.' },
            { id: 'pi', valor: R * h, error: 'GE19', siFuera: 'El borde del cilindro mide 2πR.' },
            { id: 'esf', valor: 4 * R * R, error: 'GE-REV5', siFuera: 'Esa es la esfera entera.' },
          ]),
          solucion: { texto: 'Banda del cilindro de radio R y alto h.', ecuacion: [`2π · ${R} · ${h} = ${pi(2 * R * h)}`] },
        };
        const V = h * h * (3 * R - h) / 3;
        return {
          pregunta: [`De una esfera de radio ${R} se corta un casquete sólido de altura ${h}. ¿Cuál es su volumen?`],
          opciones: opciones(V, [
            { id: 'area', valor: 2 * R * h, error: 'GE13', siFuera: 'Esa es el área del casquete.' },
            { id: 'sin3', valor: h * h * (3 * R - h), error: 'GE20', siFuera: 'Falta dividir entre 3.' },
            { id: 'R', valor: h * h * (R - h), error: 'GE-REV5', siFuera: 'Es 3R − h, no R − h.' },
          ]),
          solucion: { texto: 'πh²(3R − h)/3.', ecuacion: [`π · ${h}² · (${3 * R} − ${h}) / 3 = ${pi(V)}`] },
        };
      },
    },
  };

  // ---------- Idea 6: Pappus-Guldin ----------
  // Cambia: la distancia del centro al eje · Permanece: la región que gira · Progresa: el camino del centroide ·
  // Se reserva: el cuadrado de lado 2 a 3 del eje · Debe verse: volumen = área por camino del centroide.
  const pappFig = (d, o = {}) => {
    const a = o.a ?? 1.2, k = o.pasos || {}, c = o.circulo;
    return {
      alt: o.alt || `Región ${c ? 'circular' : 'cuadrada'} cuyo centro está a ${f(d)} del eje; al girar, el centro recorre 2π · ${f(d)}`,
      vista: { x: [-4.6, 4.6], y: [-2.6, 2.6] },
      puntos: [pt('E0', [0, -2.4], { sinPunto: true }), pt('E1', [0, 2.4], { sinPunto: true, rotulo: 'eje', lado: 90 }), pt('G', [d, 0], { rotulo: 'G', lado: 90, color: 'h' }), pt('H', [0, 0], { sinPunto: true }), pt('Gm', [-d, 0], { sinPunto: true, desde: k.g ?? 99 })],
      regiones: c ? [{ puntos: U.arco([d, 0], a / 2, 0, 360, 36), color: 'o', opacidad: 0.3, sinBorde: false }, { puntos: U.arco([-d, 0], a / 2, 0, 360, 36), color: 'o', opacidad: 0.08, discontinua: true, desde: k.g ?? 99 }]
        : [{ puntos: [[d - a / 2, -a / 2], [d + a / 2, -a / 2], [d + a / 2, a / 2], [d - a / 2, a / 2]], color: 'o', opacidad: 0.3, sinBorde: false }, { puntos: [[-d - a / 2, -a / 2], [-d + a / 2, -a / 2], [-d + a / 2, a / 2], [-d - a / 2, a / 2]], color: 'o', opacidad: 0.08, discontinua: true, desde: k.g ?? 99 }],
      curvas: [{ puntos: U.arco([0, 0], 1, 0, 360, 48).map(p => [p[0] * d, p[1] * d * 0.28]), color: 'h', discontinua: true, desde: k.g ?? 99 }],
      segmentos: [{ de: 'E0', a: 'E1', color: 'i', grosor: 'variable', discontinua: true }, { de: 'H', a: 'G', color: 'h', texto: o.d ?? 'd', lado: -1 }],
      rotulos: o.A ? [{ x: d, y: -a / 2 - 0.45, texto: o.A, color: 'o' }] : [],
    };
  };
  const pappIdea = {
    id: 'pappus',
    titulo: 'Lo que recorre el centro',
    temas: ['Teorema de Pappus-Guldin'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Un cuadrado de área 4 gira alrededor del eje y engendra un sólido de revolución: un anillo. Aleja o acerca G y mira el volumen.',
      voz: 'Aleja la región. ¿Por qué crece el volumen si el área es la misma?',
      controles: [{ id: 'd', etiqueta: 'distancia de G al eje', min: 1, max: 3.5, paso: 0.5, inicio: 2, unidad: '', decimales: 1, color: 'c-h' }],
      dibujo: v => ({ datos: pappFig(v.d, { d: f(v.d), A: 'A = 4', pasos: { g: 0 } }), estado: {} }),
      // Se agarra el centro G y se aleja o se acerca al eje; la región va con él.
      arrastres: [{ id: 'centro-g', etiqueta: 'centro G de la región', color: 'c-h',
        donde: v => enPantalla(pappFig(v.d), [v.d, 0]),
        mover: (p, v) => ({ d: alPlano(pappFig(v.d), p)[0] }) }],
      lectura: v => [`V = 4 · 2π · ${f(v.d)} = ${pi(8 * v.d)}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Un cuadrado de lado 2 gira alrededor de un eje paralelo a uno de sus lados. Su centro está a 3 del eje. ¿Cuál es el volumen del sólido?',
      voz: 'Área por el camino que recorre el centro.',
      opciones: [
        { id: 'c', texto: '24π', correcta: true },
        { id: 'sin2', texto: '12π', error: 'GE-REV3', siFuera: '12π usa π · 3; el centro recorre una vuelta completa, 2π · 3.' },
        { id: 'borde', texto: '16π', error: 'GE-REV3', siFuera: '16π usa el lado cercano (a 2); el que cuenta es el centro.' },
        { id: 'area', texto: '4π', error: 'GE13', siFuera: '4π no multiplica el área por el recorrido.' },
      ],
      dibujo: { datos: pappFig(3, { a: 2, d: '3', A: 'lado 2' }), estado: {} },
      revelar: { datos: pappFig(3, { a: 2, d: '3', A: 'lado 2', pasos: { g: 0 } }), estado: {} },
      coincide: 'Coincide: 4 · 2π · 3 = 24π.',
    },
    mira: {
      datos: pappFig(3, { a: 2, d: '3', A: 'lado 2', pasos: { g: 1 } }),
      voz: 'Un tubo enderezado: área de la sección por el largo.',
      pasos: [
        { estado: { corte: 0 }, texto: 'El área que gira es 4.', ecuacion: ['A = 2 · 2 = 4'] },
        { estado: { corte: 1 }, texto: 'Su centro G da una vuelta de radio 3.', ecuacion: ['2π · 3 = 6π'] },
        { estado: { corte: 1 }, texto: 'Volumen: área por recorrido del centro.', ecuacion: ['4 · 6π = 24π'] },
        { estado: { corte: 1 }, texto: 'Comprobación: cilindro de radio 4 menos cilindro de radio 2, altura 2.', ecuacion: ['π(16 − 4) · 2 = 24π'] },
      ],
    },
    regla: {
      texto: 'Pappus-Guldin: el volumen engendrado por una región que gira es su área por la longitud que recorre su centroide. Para superficies, la longitud de la curva por ese recorrido.',
      ecuacion: ['V = ', { v: 'c-o', t: 'A' }, ' · ', { llave: ['2π', { v: 'c-h', t: 'd' }], nota: 'camino del centro', color: 'c-h' }, '   ·   ', 'S = ', { v: 'c-d', t: 'L' }, ' · 2π', { v: 'c-h', t: 'd' }],
      condicion: 'el eje está en el plano de la región y no la atraviesa; d es la distancia del centroide al eje.',
      voz: 'Área por el camino del centro, no del borde.',
    },
    ahoraTu: {
      voz: 'Ubica el centroide y su distancia al eje.',
      generar(s) {
        const r = azar(s);
        if (s % 2 === 0) {
          const a = r.ent(1, 6), b = r.ent(1, 6), d = r.ent(Math.ceil(a / 2) + 1, 9);
          return {
            pregunta: [`Un rectángulo de ${a} por ${b} gira alrededor de un eje paralelo al lado de ${b}, y su centro está a ${d} del eje. ¿Cuál es el volumen del sólido?`],
            opciones: opciones(a * b * 2 * d, [
              { id: 'sin2', valor: a * b * d, error: 'GE-REV3', siFuera: 'El centro recorre 2πd, una vuelta completa.' },
              { id: 'borde', valor: a * b * 2 * (d - a / 2), error: 'GE-REV3', siFuera: 'Esa distancia es del lado cercano; usa la del centro.' },
              { id: 'area', valor: a * b, error: 'GE13', siFuera: 'Falta multiplicar por el recorrido del centro.' },
            ]),
            solucion: { texto: `Área ${a * b}; el centro recorre 2π · ${d}.`, ecuacion: [`${a * b} · 2π · ${d} = ${pi(2 * a * b * d)}`] },
          };
        }
        const rr = r.ent(1, 4), d = r.ent(rr + 1, 9), sup = s % 4 === 3;
        return {
          pregunta: [`Un círculo de radio ${rr} gira alrededor de un eje de su plano a ${d} de su centro y forma un toro. ¿Cuál es ${sup ? 'el área de su superficie' : 'su volumen'}?`],
          opciones: opciones(sup ? 4 * rr * d : 2 * rr * rr * d, [
            { id: 'sin2', valor: sup ? 2 * rr * d : rr * rr * d, error: 'GE-REV3', siFuera: 'El centro recorre 2πd.' },
            { id: 'otro', valor: sup ? 2 * rr * rr * d : 4 * rr * d, error: 'GE13', siFuera: sup ? 'Ese es el volumen.' : 'Esa es el área de la superficie.' },
            { id: 'diam', valor: sup ? 8 * rr * d : 8 * rr * rr * d, error: 'GE19', siFuera: 'Eso usa el diámetro como radio.' },
          ], pi2),
          solucion: { texto: sup ? 'Longitud 2πr por recorrido 2πd.' : 'Área πr² por recorrido 2πd.', ecuacion: [sup ? `2π · ${rr} · 2π · ${d} = ${pi2(4 * rr * d)}` : `π · ${rr}² · 2π · ${d} = ${pi2(2 * rr * rr * d)}`] },
        };
      },
    },
  };

  // ---------- Laboratorio: juego libre, sin preguntas ----------
  // Mesa 1, más rica que las ideas 2 y 3: radio y altura libres a la vez (en la idea el radio queda en 3), con la
  // generatriz, el área lateral, el volumen y el ángulo del desarrollo en una sola lectura.
  // Medidas del cono de la mesa: generatriz, área lateral y volumen (en múltiplos de π) y ángulo del desarrollo.
  const conoMedidas = v => { const g = Math.hypot(v.r, v.h); return { g, lateral: v.r * g, V: v.r * v.r * v.h / 3, sector: 360 * v.r / g }; };
  const conoLibre = v => conoFig(v.r, v.h, { r: f(v.r), h: f(v.h), g: f(Math.hypot(v.r, v.h)) });
  // El menor radio de la mesa cuyo volumen pasa de 20π con la mayor altura (se calcula, no se escribe).
  const CONO_RMIN = (() => { for (let r = 1; r <= 3.5; r += 0.5) if (conoMedidas({ r, h: 7 }).V > 20) return r; return null; })();
  const mesaCono = {
    id: 'cono-libre', titulo: 'Cono con radio y altura', pieza: 'geo-figura',
    consigna: 'Arrastra la punta V y el borde de la base. Haz un cono chato y uno alto: compara g, lateral y volumen.',
    controles: [
      { id: 'r', etiqueta: 'radio', min: 1, max: 3.5, paso: 0.5, inicio: 3, unidad: '', decimales: 1, color: 'c-o' },
      { id: 'h', etiqueta: 'altura', min: 1.5, max: 7, paso: 0.5, inicio: 4, unidad: '', decimales: 1, color: 'c-i' },
    ],
    dibujo: v => ({ datos: conoLibre(v), estado: {} }),
    arrastres: [
      { id: 'punta-v', etiqueta: 'punta V del cono', color: 'c-i',
        donde: v => enPantalla(conoLibre(v), [0, -1.7 + 0.55 * v.h, 0]),
        mover: (p, v) => ({ h: sobre(conoLibre(v), [0, -1.7, 0], [0, -1.15, 0], p) }) },
      { id: 'borde', etiqueta: 'borde de la base', color: 'c-o',
        donde: v => enPantalla(conoLibre(v), [0.55 * v.r, -1.7, 0]),
        mover: (p, v) => ({ r: sobre(conoLibre(v), [0, -1.7, 0], [0.55, -1.7, 0], p) }) },
    ],
    lectura: v => { const m = conoMedidas(v); return [nb(`g = ${f(m.g)}`), SEP, nb(`lateral ${pi(m.lateral)}`), SEP, nb(`V = ${pi(m.V)}`), SEP, nb(`sector ${f(m.sector, 0)}°`)]; },
    // Retos: cada uno se comprueba con conoMedidas, la misma cuenta de la lectura (lateral y V en múltiplos de π).
    invitaciones: [
      { texto: 'Arma un cono cuya generatriz mida justo 6,5.',
        logrado: v => Math.abs(conoMedidas(v).g - 6.5) < 1e-9,
        bien: 'Radio 2,5 y altura 6: un triángulo 5, 12, 13 a la mitad.' },
      { texto: 'Haz un cono tan alto que su sector desarrollado mida menos de 90°.',
        logrado: v => conoMedidas(v).sector < 90,
        bien: 'El sector se cierra porque g crece y r no. ¿Llega a 0°?' },
      { texto: 'Busca el menor radio con el que el volumen pase de 20π.',
        // El menor radio de la grilla que lo logra, con la altura más grande de la mesa.
        logrado: v => conoMedidas(v).V > 20 && v.r === CONO_RMIN,
        bien: 'Con menos radio no alcanza ni con la altura máxima: el radio va al cuadrado.' },
      { texto: 'Guarda dos conos con el mismo volumen y distinta altura.',
        logrado: (v, guardados) => guardados.some(g => g.h !== v.h && Math.abs(conoMedidas(g).V - conoMedidas(v).V) < 1e-9),
        bien: 'Mismo volumen, otra altura: compara ahora sus áreas laterales.' },
    ],
  };
  // Mesa 2, más rica que la idea 6: cuadrado o círculo, de tamaño libre, y el caso que la idea no deja probar: si la
  // región cruza el eje, Pappus ya no vale (las dos mitades barren el mismo anillo).
  const pappLibre = v => pappFig(v.d, { a: v.a, circulo: v.forma === 'circulo', d: f(v.d), pasos: { g: 0 },
    alt: `Región ${v.forma === 'circulo' ? 'circular de diámetro' : 'cuadrada de lado'} ${f(v.a)} con su centro a ${f(v.d)} del eje${v.d < v.a / 2 ? '; cruza el eje' : ''}` });
  // Área (en el círculo, coeficiente de π: A = π · a²/4), volumen por Pappus (coeficiente de π o de π²) y si cruza el eje.
  const pappMedidas = v => { const circ = v.forma === 'circulo', A = circ ? v.a * v.a / 4 : v.a * v.a; return { circ, A, V: 2 * A * v.d, cruza: v.d < v.a / 2 }; };
  const volReal = v => { const m = pappMedidas(v); return m.V * (m.circ ? Math.PI * Math.PI : Math.PI); };
  // El mayor volumen con el círculo en la mesa: se busca en la grilla de a y d (no se escribe a mano).
  const PAPP_MAX_CIRC = (() => { let m = 0; for (let a = 0.5; a <= 2.5 + 1e-9; a += 0.5) for (let d = 0.5; d <= 3.5 + 1e-9; d += 0.25) { const v = { forma: 'circulo', a, d }; if (!pappMedidas(v).cruza) m = Math.max(m, volReal(v)); } return m; })();
  const mesaPappus = {
    id: 'pappus-libre', titulo: 'Pappus con cualquier región', pieza: 'geo-figura',
    consigna: 'Elige la forma. Arrastra G y el borde de arriba. Acerca la región hasta que cruce el eje.',
    controles: [
      { id: 'forma', etiqueta: 'región', opciones: [{ valor: 'cuadrado', texto: 'cuadrado' }, { valor: 'circulo', texto: 'círculo' }] },
      { id: 'a', etiqueta: 'lado o diámetro', min: 0.5, max: 2.5, paso: 0.5, inicio: 2, unidad: '', decimales: 1, color: 'c-o' },
      { id: 'd', etiqueta: 'distancia de G al eje', min: 0.5, max: 3.5, paso: 0.25, inicio: 2, unidad: '', decimales: 2, color: 'c-h' },
    ],
    dibujo: v => ({ datos: pappLibre(v), estado: {} }),
    arrastres: [
      { id: 'centro-g', etiqueta: 'centro G de la región', color: 'c-h',
        donde: v => enPantalla(pappLibre(v), [v.d, 0]),
        mover: (p, v) => ({ d: alPlano(pappLibre(v), p)[0] }) },
      { id: 'borde', etiqueta: 'borde de arriba de la región', color: 'c-o',
        donde: v => enPantalla(pappLibre(v), [v.d, v.a / 2]),
        mover: (p, v) => ({ a: 2 * alPlano(pappLibre(v), p)[1] }) },
    ],
    lectura: v => {
      const m = pappMedidas(v);
      if (m.cruza) return [nb(`A = ${m.circ ? pi(m.A) : f(m.A)}`), SEP, nb('cruza el eje: Pappus no vale')];
      return [nb(`A = ${m.circ ? pi(m.A) : f(m.A)}`), SEP, nb(`V = ${m.circ ? pi2(m.V) : pi(m.V)}`)];
    },
    // Retos: se comprueban con pappMedidas, la misma cuenta de la lectura. V es el coeficiente de π (cuadrado) o de
    // π² (círculo); para comparar las dos formas se pasa a número con volReal.
    invitaciones: [
      { texto: 'Acerca la región hasta que toque el eje sin cruzarlo.',
        logrado: v => Math.abs(v.d - v.a / 2) < 1e-9,
        bien: 'Tocando el eje, el agujero del anillo se cierra. ¿Y si la región cruza?' },
      { texto: 'Guarda dos cuadrados de distinto lado que engendren el mismo volumen.',
        logrado: (v, guardados) => v.forma === 'cuadrado' && !pappMedidas(v).cruza && guardados.some(g => g.forma === 'cuadrado'
          && g.a !== v.a && !pappMedidas(g).cruza && Math.abs(pappMedidas(g).V - pappMedidas(v).V) < 1e-9),
        bien: 'Menos área, más lejos del eje: el camino del centro compensa.' },
      { texto: 'Guarda un cuadrado y un círculo de igual medida y distancia. ¿Cuál engendra más?',
        logrado: (v, guardados) => !pappMedidas(v).cruza && guardados.some(g => g.forma !== v.forma && g.a === v.a && g.d === v.d),
        bien: 'El círculo cabe dentro del cuadrado: menos área, menos volumen.' },
      { texto: 'Con el círculo, arma el toro de mayor volumen que permite la mesa.',
        logrado: v => v.forma === 'circulo' && !pappMedidas(v).cruza && volReal(v) >= PAPP_MAX_CIRC - 1e-9,
        bien: 'Diámetro y distancia al máximo: área grande y camino largo.' },
    ],
  };
  // Mesa 3, más rica que la idea 5: el espesor también cambia y la franja llega a los polos (casquete).
  // La franja de la mesa (esfera de radio 5): toca un polo si su plano bajo está en −5 o el alto en 5.
  const esCasquete = v => v.y === -5 || v.y + v.h === 5;
  const cruzaEcuador = v => v.y < 0 && v.y + v.h > 0;
  const zonaArea = v => 10 * v.h;   // 2π · 5 · h, en múltiplos de π
  // El mayor casquete de la mesa: se busca en la grilla de y y h.
  const ZONA_MAX_CASQUETE = (() => { let m = 0; for (let y = -5; y <= 1; y++) for (let h = 1; h <= 4; h++) if (esCasquete({ y, h })) m = Math.max(m, zonaArea({ y, h })); return m; })();
  const mesaZona = {
    id: 'zona-libre', titulo: 'Franja de espesor libre', pieza: 'geo-figura',
    consigna: 'Arrastra los dos planos: el de abajo mueve la franja, el de arriba cambia el espesor. Llega a un polo: casquete.',
    controles: [
      { id: 'y', etiqueta: 'altura del plano bajo', min: -5, max: 1, paso: 1, inicio: -1, unidad: '', decimales: 0 },
      { id: 'h', etiqueta: 'espesor', min: 1, max: 4, paso: 1, inicio: 2, unidad: '', decimales: 0, color: 'c-i' },
    ],
    dibujo: v => ({ datos: zonaFig(v.y, v.h), estado: {} }),
    arrastres: [zonaArrastre('y', 'h'), { id: 'plano-alto', etiqueta: 'plano de arriba de la franja', color: 'c-i',
      donde: v => enPantalla(zonaFig(v.y, v.h), [2.7, (v.y + v.h) * EZ]),
      mover: (p, v) => ({ h: alPlano(zonaFig(v.y, v.h), p)[1] / EZ - v.y }) }],
    lectura: v => [nb(`${esCasquete(v) ? 'casquete' : 'zona'} = 2π · 5 · ${v.h} = ${pi(zonaArea(v))}`)],
    // Retos: se comprueban con esCasquete y zonaArea, las mismas cuentas de la lectura (el área en múltiplos de π).
    invitaciones: [
      { texto: 'Lleva la franja hasta un polo para que sea un casquete.',
        logrado: v => esCasquete(v),
        bien: 'Un solo plano corta el casquete. Su área sigue siendo 2πRh.' },
      { texto: 'Consigue una zona de área 30π sin tocar los polos.',
        logrado: v => !esCasquete(v) && Math.abs(zonaArea(v) - 30) < 1e-9,
        bien: 'Espesor 3, esté donde esté: solo importan R y h.' },
      { texto: 'Arma el casquete de mayor área que permite la mesa.',
        logrado: v => esCasquete(v) && zonaArea(v) === ZONA_MAX_CASQUETE,
        bien: 'El mayor espesor da la mayor área. ¿Qué pasaría con espesor 10?' },
      { texto: 'Guarda una franja junto a un polo y otra en el ecuador, del mismo espesor.',
        logrado: (v, guardados) => guardados.some(g => g.h === v.h && ((esCasquete(g) && cruzaEcuador(v)) || (esCasquete(v) && cruzaEcuador(g)))),
        bien: 'Una ancha y baja, otra angosta e inclinada: la misma área.' },
    ],
  };

  return {
    unidad: 'geometria.solidos-de-revolucion',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/geo-figura.js'],
    historia: {
      texto: 'En Sobre la esfera y el cilindro, Arquímedes demostró que una esfera ocupa dos tercios del cilindro que la envuelve, y que su superficie equivale a cuatro círculos máximos. No lo sacó de mirar un dibujo: lo probó con argumentos geométricos. Pidió que en su tumba grabaran una esfera dentro de un cilindro.',
      pregunta: '¿Qué fracción del cilindro ocupa la esfera?',
      fuente: { titulo: 'J. J. O’Connor y E. F. Robertson, «Archimedes», MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Archimedes/' },
    },
    // Glosario: las palabras que este tema estrena en el curso (docs/teoria.md, 4d). Los ejemplos salen de las mismas
    // fórmulas de las ideas y se comprobaron con node.
    glosario: [
      { termino: 'sólido de revolución', formas: ['sólido de revolución', 'sólidos de revolución'],
        def: 'Cuerpo que engendra una región plana al dar una vuelta completa alrededor de una recta, el eje.',
        ejemplo: 'Un rectángulo que gira sobre uno de sus lados engendra un cilindro.', ver: ['cilindro', 'cono', 'esfera'] },
      { termino: 'cilindro', def: 'Sólido con dos bases circulares iguales y paralelas, unidas por una superficie curva. Lo engendra un rectángulo que gira.',
        ejemplo: 'Radio 2 y altura 5: V = π · 2² · 5 = 20π.', ver: ['tronco de cilindro', 'generatriz', 'volumen'] },
      { termino: 'cono', def: 'Sólido de base circular que se cierra en un vértice; sale de girar un triángulo rectángulo sobre un cateto.',
        ejemplo: 'Radio 3 y altura 4: V = π · 3² · 4 / 3 = 12π.', ver: ['generatriz', 'tronco de cono', 'sector circular'] },
      { termino: 'generatriz', simbolo: 'g', formas: ['generatriz', 'generatrices'],
        def: 'Segmento recto sobre la superficie lateral: une las bases o, en el cono, el vértice con la base.',
        ejemplo: 'Cono de radio 3 y altura 4: g = √(3² + 4²) = 5.', ver: ['superficie lateral'] },
      { termino: 'superficie lateral', def: 'Lo que cubre al sólido sin contar sus bases: en el cono y el cilindro, la parte curva.',
        ejemplo: 'Cono de radio 3 y g = 5: su área lateral es π · 3 · 5 = 15π.', ver: ['generatriz'] },
      { termino: 'tronco de cilindro', formas: ['tronco de cilindro', 'troncos de cilindro'],
        def: 'Parte de un cilindro entre su base y un corte inclinado; sus generatrices miden distinto.',
        ejemplo: 'Radio 3, generatrices 4 y 10: V = 9π · 7 = 63π.', ver: ['cilindro'] },
      { termino: 'tronco de cono', formas: ['tronco de cono', 'troncos de cono'],
        def: 'Lo que queda de un cono al cortarle la punta con un plano paralelo a la base.',
        ejemplo: 'Radios 2 y 1, altura 3: V = π · 3/3 · (4 + 2 + 1) = 7π.', ver: ['cono'] },
      { termino: 'esfera', def: 'Sólido formado por los puntos cuya distancia al centro es menor o igual que el radio.',
        ejemplo: 'Radio 3: V = 4/3 · π · 3³ = 36π, y su área es 4π · 3² = 36π.', ver: ['círculo máximo', 'zona esférica'] },
      { termino: 'círculo máximo', formas: ['círculo máximo', 'círculos máximos'],
        def: 'Corte de la esfera por un plano que pasa por su centro: el círculo más grande que cabe en ella.',
        ejemplo: 'Esfera de radio 5: su círculo máximo tiene área π · 5² = 25π.', ver: ['esfera'] },
      { termino: 'zona esférica', formas: ['zona esférica', 'zonas esféricas', 'zona', 'zonas'],
        def: 'Parte de la superficie de una esfera comprendida entre dos planos paralelos que la cortan.',
        ejemplo: 'Radio 5, planos separados 2: área 2π · 5 · 2 = 20π.', ver: ['casquete'] },
      { termino: 'casquete', formas: ['casquete', 'casquetes'],
        def: 'Lo que un solo plano le corta a una esfera, como una tapa. Su área es 2πRh.',
        ejemplo: 'Radio 5 y altura 2: área 2π · 5 · 2 = 20π.', ver: ['zona esférica'] },
      { termino: 'centroide', def: 'Punto de equilibrio de una región plana, su centro de gravedad. En un cuadrado o un círculo, su centro.',
        ver: ['Pappus-Guldin'] },
      { termino: 'Pappus-Guldin', formas: ['Pappus-Guldin', 'Pappus'],
        def: 'Teorema: el volumen que engendra una región al girar es su área por el camino que recorre su centroide.',
        ejemplo: 'Cuadrado de área 4 con centro a 3 del eje: V = 4 · 2π · 3 = 24π.', ver: ['centroide', 'toro'] },
      { termino: 'toro', def: 'Sólido con forma de rosquilla: lo engendra un círculo que gira alrededor de un eje que no lo corta.',
        ejemplo: 'Círculo de radio 1 a 3 del eje: V = π · 1² · 2π · 3 = 6π².', ver: ['Pappus-Guldin'] },
    ],
    // Laboratorio: las tres mesas son más ricas que sus ideas (dos medidas libres, otra forma, el caso límite).
    laboratorio: [mesaCono, mesaPappus, mesaZona],
    ideas: [cilIdea, conoIdea, desIdea, esfIdea, zonaIdea, pappIdea],
  };
});
