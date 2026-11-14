/*
 * Teoría de «Longitud de la circunferencia y áreas circulares» (geometria.longitud-y-areas-circulares). Molde: docs/teoria.md.
 * Fuente: docs/teoria/matriz/geometria.json (unidad 12); Arquímedes (medida del círculo), Hipócrates de Quíos (lúnulas).
 * Compañera: Neri (nutria). Pieza: geo-figura.
 *
 * Ficha de tarea
 *   Promesa: separar longitud (2πr, arco) de región (πr², sector, segmento, corona) y armar regiones compuestas con sumas y
 *     restas que no cuenten nada dos veces.
 *   Persona y condiciones: postulante de 4.º de secundaria, celular a 360 px, sin audio, quizás sin conexión.
 *   Resultado observable: calcula longitudes de circunferencia y arco, áreas de círculo, sector, segmento, corona,
 *     trapecio circular y lúnulas.
 *   Orden de atención: 1.º la figura y su lectura · 2.º la pregunta · acción: «Comprobar» · fondo: Neri.
 *   Estados: jugando · predicción sin elegir · comprobada · paso de «Mira» · regla · caso nuevo.
 *   Duda que resuelve: «¿2πr o πr²?» y «¿(R − r)² o R² − r²?».
 *
 * Colores: radio naranja (c-o), región turquesa (c-i), longitud o arco verde (c-d), lo pedido rojo (c-h).
 * Códigos: GE1, GE19 (docs/investigacion/geometria-ideas-erroneas.md); GE-CIR son hipótesis nuevas.
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
  // «kπ» con k en forma simple: 6π, 2π, π, 4,5π.
  const pi = k => (Math.abs(k - 1) < 1e-9 ? 'π' : `${f(k)}π`);
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
  const frac = (a, b) => ({ frac: [a, b] });
  const cr = { v: 'c-o', t: 'r' }, cR = { v: 'c-o', t: 'R' };
  const sector = (c, r, de, a, n = 32) => [c, ...U.arco(c, r, de, a, n)];
  const anillo = (c, R, r, de, a) => [...U.arco(c, R, de, a, 40), ...U.arco(c, r, a, de, 40)];

  // ---------- Idea 1: π y la longitud de la circunferencia ----------
  // Cambia: el número de lados de los polígonos · Permanece: el diámetro 1 · Progresa: el intervalo que encierra a π ·
  // Se reserva: una rueda que avanza · Debe verse: C/d es la misma razón para toda circunferencia.
  const arqui = n => {
    const r = 3, Pin = Array.from({ length: n }, (_, k) => U.polar([0, 0], r, 90 + 360 * k / n)), Rout = r / Math.cos(Math.PI / n), Pout = Array.from({ length: n }, (_, k) => U.polar([0, 0], Rout, 90 + 360 * k / n));
    return {
      alt: `Circunferencia entre un polígono inscrito y uno circunscrito de ${n} lados: π queda entre ${f(n * Math.sin(Math.PI / n), 4)} y ${f(n * Math.tan(Math.PI / n), 4)}`,
      vista: { x: [-3.9, 3.9], y: [-3.9, 3.9] },
      puntos: [pt('O', [0, 0], { sinPunto: true })],
      circulos: [{ centro: 'O', r, color: 'd', grosor: 'variable' }],
      regiones: [{ puntos: Pin, color: 'i', opacidad: 0.1, sinBorde: false }, { puntos: Pout, color: 'o', opacidad: 0.04, sinBorde: false }],
    };
  };
  const rueda = (o = {}) => {
    const r = 0.5, k = o.pasos || {};
    return {
      alt: o.alt || 'Rueda de radio 0,5 m: en una vuelta avanza 2π · 0,5 = π metros; en 10 vueltas, 10π metros',
      vista: { x: [-0.4, 4.6], y: [-0.5, 1.7] },
      puntos: [pt('O', [0.5, 0.5], { sinPunto: true }), pt('O2', [0.5 + Math.PI, 0.5], { sinPunto: true, desde: k.v || 0 }), pt('s0', [0, 0], { sinPunto: true }), pt('s1', [4.6, 0], { sinPunto: true }),
        pt('a', [0.5, 0], { color: 'h' }), pt('b', [0.5 + Math.PI, 0], { color: 'h', desde: k.v || 0 })],
      circulos: [{ centro: 'O', r, color: 'o' }, { centro: 'O2', r, color: 'o', discontinua: true, desde: k.v || 0 }],
      segmentos: [{ de: 's0', a: 's1', grosor: 'fino' }, { de: 'a', a: 'b', color: 'd', grosor: 'variable', texto: 'π m', desde: k.v || 0, lado: -1 }],
      rotulos: [{ x: 0.5, y: 1.45, texto: 'r = 0,5 m', color: 'o' }],
    };
  };
  const piIdea = {
    id: 'pi',
    titulo: 'π: la razón que no cambia',
    temas: ['Número pi y longitud de la circunferencia'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'La circunferencia queda entre un polígono inscrito y uno circunscrito. Aumenta los lados y mira entre qué valores queda la razón C/d.',
      voz: 'Sube los lados. Mira cómo se estrecha el intervalo.',
      controles: [{ id: 'n', etiqueta: 'lados', min: 4, max: 24, paso: 2, inicio: 6, unidad: '', decimales: 0, color: 'c-i' }],
      dibujo: v => ({ datos: arqui(v.n), estado: {} }),
      lectura: v => [`${f(v.n * Math.sin(Math.PI / v.n), 4)} < C/d < ${f(v.n * Math.tan(Math.PI / v.n), 4)}`],
      minimo: 4,
    },
    predice: {
      pregunta: 'Una rueda de radio 0,5 m da 10 vueltas completas sin resbalar. ¿Cuánto avanza?',
      voz: 'Una vuelta deja en el piso todo el borde de la rueda.',
      opciones: [
        { id: 'c', texto: '10π ≈ 31,4 m', correcta: true },
        { id: 'radio', texto: '5π ≈ 15,7 m', error: 'GE19', siFuera: 'π · r por vuelta olvida el 2: el borde mide 2πr = π · d.' },
        { id: 'area', texto: '2,5π ≈ 7,9 m', error: 'GE19', siFuera: 'πr² = 0,25π es el área de la rueda, no su borde.' },
        { id: 'diam', texto: '10 m', error: 'GE-CIR1', siFuera: 'Una vuelta avanza más que el diámetro: π veces el diámetro.' },
      ],
      dibujo: { datos: rueda({ pasos: { v: 9 } }), estado: {} },
      revelar: { datos: rueda(), estado: {} },
      coincide: 'Coincide: π metros por vuelta, 10π en total.',
    },
    mira: {
      datos: rueda({ pasos: { v: 1 } }),
      voz: 'Desenrolla el borde: una vuelta es un perímetro.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Para toda circunferencia, C ÷ d da el mismo número: π.', ecuacion: ['π = ', frac('C', 'd'), ' ≈ 3,1416'] },
        { estado: { corte: 1 }, texto: 'En una vuelta la rueda deja en el piso su borde.', ecuacion: ['C = π · 1 = π m'] },
        { estado: { corte: 1 }, texto: 'Diez vueltas, diez bordes.', ecuacion: ['10 · π ≈ 31,4 m'] },
      ],
    },
    regla: {
      texto: 'π es la razón entre la longitud de cualquier circunferencia y su diámetro. Por eso la longitud es C = 2πr = πd.',
      ecuacion: ['C = 2π', cr, ' = π d   ·   ', frac('223', '71'), ' < π < ', frac('22', '7')],
      condicion: 'r es el radio y d = 2r. 22/7 y 3,14 son aproximaciones; π no es una fracción exacta.',
      voz: 'Borde con 2πr; región con πr². No los mezcles.',
    },
    ahoraTu: {
      voz: 'Decide si te dan el radio o el diámetro.',
      generar(s) {
        const r = azar(s), t = s % 2, x = r.ent(2, 15), n = r.ent(2, 12);
        if (t === 0) return {
          pregunta: [`Una circunferencia tiene ${s % 4 === 0 ? 'radio' : 'diámetro'} ${x} cm. ¿Cuánto mide su longitud?`],
          opciones: opciones(s % 4 === 0 ? 2 * x : x, [
            { id: 'sin2', valor: s % 4 === 0 ? x : 2 * x, error: 'GE19', siFuera: s % 4 === 0 ? 'Con el radio, la longitud lleva el 2: 2πr.' : 'Con el diámetro no se duplica: C = πd.' },
            { id: 'area', valor: s % 4 === 0 ? x * x : x * x / 4, error: 'GE19', siFuera: 'Ese es el área, πr²; se pide el borde.' },
            { id: 'cuatro', valor: 4 * x, error: 'GE19', siFuera: 'Eso duplica de más: revisa si el dato es radio o diámetro.' },
          ], k => `${pi(k)} cm`),
          solucion: { texto: s % 4 === 0 ? 'C = 2πr.' : 'C = πd.', ecuacion: [s % 4 === 0 ? `2π · ${x} = ${pi(2 * x)} cm` : `π · ${x} = ${pi(x)} cm`] },
        };
        return {
          pregunta: [`Una rueda de radio ${x} cm da ${n} vueltas sin resbalar. ¿Cuánto avanza?`],
          opciones: opciones(2 * x * n, [
            { id: 'radio', valor: x * n, error: 'GE19', siFuera: 'Por vuelta avanza 2πr, no πr.' },
            { id: 'area', valor: x * x * n, error: 'GE19', siFuera: 'πr² es el área de la rueda.' },
            { id: 'una', valor: 2 * x, error: 'GE-CIR1', siFuera: 'Eso es una sola vuelta.' },
          ], k => `${pi(k)} cm`),
          solucion: { texto: 'Cada vuelta avanza una longitud de circunferencia.', ecuacion: [`${n} · 2π · ${x} = ${pi(2 * x * n)} cm`] },
        };
      },
    },
  };

  // ---------- Idea 2: área del círculo ----------
  // Cambia: el número de sectores · Permanece: el radio · Progresa: el reacomodo se parece a un rectángulo de πr por r ·
  // Se reserva: el radio doble · Debe verse: el área usa r dos veces (base πr y altura r): crece con r².
  const recorte = (n, r = 2) => {
    const w = 360 / n, c = 2 * r * Math.sin(U.rad(w / 2)), h = r * Math.cos(U.rad(w / 2)), reg = [];
    for (let k = 0; k < n / 2; k++) {
      reg.push({ puntos: sector([k * c, h], r, 270 - w / 2, 270 + w / 2, 8), color: 'i', opacidad: 0.28, sinBorde: false });
      reg.push({ puntos: sector([k * c + c / 2, 0], r, 90 - w / 2, 90 + w / 2, 8), color: 'o', opacidad: 0.22, sinBorde: false });
    }
    return {
      alt: `Círculo de radio 2 cortado en ${n} sectores y reacomodado: casi un rectángulo de base π · 2 y altura 2`,
      vista: { x: [-1.4, 8.2], y: [h - r - 0.6, r + 0.9] },
      puntos: [pt('a', [-c / 2, h], { sinPunto: true }), pt('b', [n / 2 * c - c / 2, h], { sinPunto: true }), pt('h0', [-c / 2 - 0.3, 0], { sinPunto: true }), pt('h1', [-c / 2 - 0.3, h], { sinPunto: true })],
      regiones: reg,
      segmentos: [{ de: 'a', a: 'b', color: 'd', grosor: 'variable', texto: 'πr', lado: 1 }, { de: 'h0', a: 'h1', color: 'o', grosor: 'variable', texto: 'r' }],
    };
  };
  const dos = (o = {}) => ({
    alt: o.alt || 'Un círculo de radio 2 y otro de radio 4: el grande cubre cuatro veces el área del chico',
    vista: { x: [-2.6, 11], y: [-4.4, 4.4] }, cuadricula: o.cuadricula ? { paso: 1 } : undefined,
    puntos: [pt('O1', [0, 0], {}), pt('A1', [2, 0], { sinPunto: true }), pt('O2', [6.6, 0], {}), pt('A2', [10.6, 0], { sinPunto: true })],
    circulos: [{ centro: 'O1', r: 2, color: 'i', relleno: true }, { centro: 'O2', r: 4, color: 'o', relleno: true }],
    segmentos: [{ de: 'O1', a: 'A1', color: 'o', texto: 'r' }, { de: 'O2', a: 'A2', color: 'o', texto: '2r' }],
    rotulos: o.areas ? [{ x: 0, y: -2.7, texto: 'πr²', color: 'i' }, { x: 6.6, y: 2, texto: '4πr²', color: 'h' }] : [],
  });
  const areaCirc = {
    id: 'area-del-circulo',
    titulo: 'El círculo hecho rectángulo',
    temas: ['Área del círculo y sector circular'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'El círculo se corta en sectores iguales que se reacomodan en fila, uno arriba y otro abajo. Aumenta los sectores y mira la forma.',
      voz: 'Corta más fino. Mira a qué figura se parece.',
      controles: [{ id: 'n', etiqueta: 'sectores', min: 4, max: 24, paso: 2, inicio: 8, unidad: '', decimales: 0, color: 'c-i' }],
      dibujo: v => ({ datos: recorte(v.n), estado: {} }),
      lectura: v => [`${v.n} sectores · base ≈ πr · altura ≈ r`],
      minimo: 4,
    },
    predice: {
      pregunta: 'Un círculo tiene radio r. Otro tiene radio 2r. ¿Cuántas veces el área del primero es el área del segundo?',
      voz: 'Recuerda dónde aparece r en el rectángulo.',
      opciones: [
        { id: 'c', texto: '4 veces', correcta: true },
        { id: 'dos', texto: '2 veces', error: 'GE1', siFuera: 'El doble vale para la longitud. El área usa r dos veces: base πr y altura r.' },
        { id: 'pi', texto: 'π veces', error: 'GE-CIR2', siFuera: 'π ya está en las dos áreas; la razón entre ellas no lo lleva.' },
        { id: 'ocho', texto: '8 veces', error: 'GE2', siFuera: '8 = 2³ sería un volumen.' },
      ],
      dibujo: { datos: dos(), estado: {} },
      revelar: { datos: dos({ areas: true }), estado: {} },
      coincide: 'Coincide: π(2r)² = 4πr².',
    },
    mira: {
      datos: recorte(16),
      voz: 'La fila de sectores se vuelve un rectángulo.',
      pasos: [
        { estado: { corte: 0 }, texto: 'La mitad de los arcos queda arriba y la otra mitad abajo.', ecuacion: ['base = ', frac('2πr', '2'), ' = πr'] },
        { estado: { corte: 0 }, texto: 'La altura es el radio.', ecuacion: ['altura = r'] },
        { estado: { corte: 0 }, texto: 'El rectángulo tiene área base por altura.', ecuacion: ['S = πr · r = π', { sup: [cr, '2'] }] },
      ],
    },
    regla: {
      texto: 'El área del círculo es π por el radio al cuadrado. Si el radio se multiplica por k, el área se multiplica por k².',
      ecuacion: ['S = π', { sup: [cr, '2'] }, ' = ', frac('π d²', '4')],
      condicion: 'r es el radio. Con el diámetro, r = d/2. El área mide la región; la longitud, el borde.',
      voz: 'r aparece dos veces en el área: por eso k².',
    },
    ahoraTu: {
      voz: 'Ubica el radio; si te dan el diámetro, divídelo entre 2.',
      generar(s) {
        const r = azar(s), x = 2 * r.ent(1, 10), diam = s % 2 === 1, rr = diam ? x / 2 : x;
        return {
          pregunta: [`Un círculo tiene ${diam ? 'diámetro' : 'radio'} ${x} cm. ¿Cuál es su área?`],
          opciones: opciones(rr * rr, [
            { id: 'long', valor: 2 * rr, error: 'GE19', siFuera: 'Esa es la longitud de la circunferencia, 2πr.' },
            { id: 'diam', valor: diam ? x * x : 4 * x * x, error: 'GE19', siFuera: diam ? 'Eso eleva el diámetro; el área usa el radio: d/2.' : 'Eso usa el diámetro como radio.' },
            { id: 'sin-cuad', valor: diam ? x / 2 : 2 * x, error: 'GE19', siFuera: 'Falta elevar el radio al cuadrado.' },
          ], k => `${pi(k)} cm²`),
          solucion: { texto: diam ? `Radio = ${x}/2 = ${rr}.` : `Radio = ${rr}.`, ecuacion: [`S = π · ${rr}² = ${pi(rr * rr)} cm²`] },
        };
      },
    },
  };

  // ---------- Idea 3: arco y sector ----------
  // Cambia: el ángulo central y el radio · Permanece: la fracción del círculo · Progresa: arco y sector a la vez ·
  // Se reserva: un caso numérico con 60° · Debe verse: los dos son la fracción α/360 de su total.
  const sectorFig = (al, r, o = {}) => {
    const k = o.pasos || {};
    return {
      alt: `Sector de ${al}° en un círculo de radio ${f(r)}: arco de ${pi(r * al / 180)} y área de ${pi(r * r * al / 360)}`,
      vista: { x: [-r - 0.6, r + 0.6], y: [-r - 0.6, r + 0.6] },
      puntos: [pt('O', [0, 0], { rotulo: 'O', lado: 225 }), pt('A', U.polar([0, 0], r, 0), { sinPunto: true }), pt('B', U.polar([0, 0], r, al), { sinPunto: true })],
      circulos: [{ centro: 'O', r, grosor: 'fino', discontinua: true }],
      regiones: [{ puntos: sector([0, 0], r, 0, al), color: 'i', opacidad: 0.25, desde: k.s || 0 }],
      arcos: [{ centro: [0, 0], r, de: 0, a: al, color: 'd', grosor: 'variable', texto: o.arco, desde: k.a || 0 }],
      segmentos: [{ de: 'O', a: 'A', color: 'o', texto: o.r }, { de: 'O', a: 'B', color: 'o' }],
      angulos: [{ en: 'O', de: 'A', a: 'B', color: 'h', texto: `${al}°`, radio: 16 }],
    };
  };
  const sectorIdea = {
    id: 'arco-y-sector',
    titulo: 'Arco y sector: la misma fracción',
    temas: ['Longitud de arco', 'Área del círculo y sector circular'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Abre el ángulo central α y cambia el radio. El arco (verde) y el sector (turquesa) son la misma fracción α/360 del total.',
      voz: 'Abre α. Compara el arco con la circunferencia entera.',
      controles: [
        { id: 'al', etiqueta: 'α', min: 30, max: 330, paso: 30, inicio: 90, unidad: '°', decimales: 0, color: 'c-h' },
        { id: 'r', etiqueta: 'r', min: 1, max: 3, paso: 1, inicio: 2, unidad: '', decimales: 0, color: 'c-o' },
      ],
      dibujo: v => ({ datos: sectorFig(v.al, v.r, { r: 'r' }), estado: {} }),
      lectura: v => [`fracción ${v.al}/360 · arco ${pi(v.r * v.al / 180)} · sector ${pi(v.r * v.r * v.al / 360)}`],
      minimo: 4,
    },
    predice: {
      pregunta: 'Un sector circular tiene radio 6 y ángulo central de 60°. ¿Cuál es su área?',
      voz: 'Primero la fracción del círculo; luego, el área completa.',
      opciones: [
        { id: 'c', texto: '6π', correcta: true },
        { id: 'arco', texto: '2π', error: 'GE19', siFuera: '2π es la longitud del arco: una fracción del borde, no de la región.' },
        { id: 'todo', texto: '36π', error: 'GE19', siFuera: '36π es el círculo entero; falta tomar la fracción 60/360.' },
        { id: 'diam', texto: '24π', error: 'GE19', siFuera: 'Eso usa el diámetro como radio.' },
      ],
      dibujo: { datos: sectorFig(60, 6, { r: '6' }), estado: {} },
      revelar: { datos: sectorFig(60, 6, { r: '6', arco: '2π' }), estado: {} },
      coincide: 'Coincide: 60° es un sexto del círculo: 36π ÷ 6 = 6π.',
    },
    mira: {
      datos: sectorFig(60, 6, { r: '6', arco: '2π', pasos: { a: 1, s: 2 } }),
      voz: 'Una sola fracción sirve para el arco y para el sector.',
      pasos: [
        { estado: { corte: 0 }, texto: '60° es la sexta parte de 360°.', ecuacion: [frac('60', '360'), ' = ', frac('1', '6')] },
        { estado: { corte: 1 }, texto: 'El arco es un sexto de la circunferencia.', ecuacion: ['s = ', frac('1', '6'), ' · 2π · 6 = 2π'] },
        { estado: { corte: 2 }, texto: 'El sector es un sexto del círculo.', ecuacion: ['S = ', frac('1', '6'), ' · π · 6² = 6π'] },
      ],
    },
    regla: {
      texto: 'Un arco y su sector son la fracción α/360 de la circunferencia y del círculo. Con θ en radianes: arco rθ y sector r²θ/2.',
      ecuacion: ['s = ', frac('α', '360°'), ' · 2π', cr, ' = ', cr, 'θ   ·   S = ', frac('α', '360°'), ' · π', { sup: [cr, '2'] }, ' = ', frac([{ sup: [cr, '2'] }, 'θ'], '2')],
      condicion: 'α en grados va con 360°; θ en radianes va solo. No se mezclan las dos medidas en la misma fórmula.',
      voz: 'Primero la fracción; después el total que corresponde.',
    },
    ahoraTu: {
      voz: 'Calcula la fracción α/360 primero.',
      generar(s) {
        const r = azar(s), al = r.de([30, 45, 60, 72, 90, 120, 135, 150, 180, 240, 270]), rr = r.ent(2, 12), pideS = s % 2 === 0;
        const arco = 2 * rr * al / 360, S = rr * rr * al / 360;
        return {
          pregunta: [`Un sector tiene radio ${rr} y ángulo central de ${al}°. ¿Cuánto mide ${pideS ? 'su área' : 'su arco'}?`],
          opciones: opciones(pideS ? S : arco, [
            { id: 'cruz', valor: pideS ? arco : S, error: 'GE19', siFuera: pideS ? 'Esa es la longitud del arco.' : 'Esa es el área del sector.' },
            { id: 'todo', valor: pideS ? rr * rr : 2 * rr, error: 'GE19', siFuera: 'Ese es el total; falta la fracción α/360.' },
            { id: 'diam', valor: pideS ? 4 * S : 2 * arco, error: 'GE19', siFuera: 'Eso usa el diámetro donde va el radio.' },
          ], k => pi(k)),
          solucion: { texto: `Fracción ${al}/360.`, ecuacion: [pideS ? `${al}/360 · π · ${rr}² = ${pi(S)}` : `${al}/360 · 2π · ${rr} = ${pi(arco)}`] },
        };
      },
    },
  };

  // ---------- Idea 4: segmento circular y corona ----------
  // Cambia: los dos radios de la corona · Permanece: el centro común · Progresa: R² − r² ·
  // Se reserva: la trampa (R − r)² · Debe verse: la corona es el círculo grande menos el chico.
  const corona = (R, r, o = {}) => {
    const k = o.pasos || {}, c = Math.sqrt(R * R - r * r);
    return {
      alt: o.alt || `Corona entre círculos de radios ${R} y ${r}: área π(${R}² − ${r}²) = ${pi(R * R - r * r)}`,
      vista: { x: [-R - 0.6, R + 0.6], y: [-R - 0.6, R + 0.6] },
      puntos: [pt('O', [0, 0], { sinPunto: false }), pt('A', [R, 0], { sinPunto: true }), pt('Bq', U.polar([0, 0], r, 135), { sinPunto: true }),
        pt('T', [0, -r], { sinPunto: true }), pt('P', [-c, -r], { sinPunto: true }), pt('Q', [c, -r], { sinPunto: true })],
      regiones: [{ puntos: anillo([0, 0], R, r, 0, 359.9), color: 'i', opacidad: 0.3, desde: k.a || 0 }],
      circulos: [{ centro: 'O', r: R, color: 'o' }, { centro: 'O', r, color: 'o', discontinua: true }],
      segmentos: [{ de: 'O', a: 'A', color: 'o', texto: o.R || `R = ${R}`, lado: -1 }, { de: 'O', a: 'Bq', color: 'o', texto: o.r || `r = ${r}` },
        ...(o.cuerda ? [{ de: 'P', a: 'Q', color: 'h', grosor: 'variable', texto: o.cuerda, desde: k.c || 0 }, { de: 'O', a: 'T', grosor: 'fino', desde: k.c || 0 }] : [])],
      angulos: o.cuerda ? [{ en: 'T', de: 'Q', a: 'O', color: 'h', desde: k.c || 0 }] : [],
    };
  };
  const coronaIdea = {
    id: 'segmento-y-corona',
    titulo: 'Corona y segmento: restar regiones',
    temas: ['Segmento y corona circular'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'La corona es la región entre dos circunferencias con el mismo centro. Cambia los radios R y r y mira su área.',
      voz: 'Cambia los radios. Mira qué se resta de qué.',
      controles: [
        { id: 'R', etiqueta: 'R', min: 5, max: 8, paso: 1, inicio: 5, unidad: '', decimales: 0, color: 'c-o' },
        { id: 'r', etiqueta: 'r', min: 1, max: 4, paso: 1, inicio: 2, unidad: '', decimales: 0, color: 'c-o' },
      ],
      dibujo: v => ({ datos: corona(v.R, v.r), estado: {} }),
      lectura: v => [`corona = π(${v.R}² − ${f(v.r)}²) = ${pi(v.R * v.R - v.r * v.r)}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Una corona circular tiene radios R = 5 y r = 3. ¿Cuál es su área?',
      voz: 'Ojo con el orden: restar y luego elevar, o al revés.',
      opciones: [
        { id: 'c', texto: '16π', correcta: true },
        { id: 'resta', texto: '4π', error: 'GE-CIR3', siFuera: '4π = π(5 − 3)² sería un círculo de radio 2. La corona es el grande menos el chico.' },
        { id: 'suma', texto: '34π', error: 'GE-CIR3', siFuera: '34π suma los dos círculos; la corona resta el agujero.' },
        { id: 'long', texto: '4π, del borde', error: 'GE19', siFuera: 'Restar longitudes da un borde, no una región.' },
      ],
      dibujo: { datos: corona(5, 3), estado: {} },
      revelar: { datos: corona(5, 3, { cuerda: '8' }), estado: {} },
      coincide: 'Coincide: 25π − 9π = 16π.',
    },
    mira: {
      datos: corona(5, 3, { cuerda: '2 · 4', pasos: { c: 2 }, alt: 'Corona de radios 5 y 3; la cuerda del círculo grande tangente al chico mide 8' }),
      voz: 'Resta regiones completas, no radios.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Círculo grande menos círculo chico.', ecuacion: ['π · 5² − π · 3² = 25π − 9π'] },
        { estado: { corte: 1 }, texto: 'Queda la corona.', ecuacion: ['π(R² − r²) = 16π'] },
        { estado: { corte: 2 }, texto: 'Dato útil: la cuerda tangente al chico mide 2√(R² − r²).', ecuacion: ['(cuerda/2)² = R² − r² = 16'] },
      ],
    },
    regla: {
      texto: 'Corona: el círculo grande menos el chico. Segmento circular: el sector menos el triángulo de sus dos radios y la cuerda.',
      ecuacion: ['corona = π(', { sup: [cR, '2'] }, ' − ', { sup: [cr, '2'] }, ')   ·   segmento = ', frac([{ sup: [cr, '2'] }, '(θ − sen θ)'], '2')],
      condicion: 'los círculos de la corona son concéntricos. En el segmento, θ es el ángulo central en radianes.',
      voz: 'Primero eleva cada radio; después resta.',
    },
    ahoraTu: {
      voz: 'Resta regiones completas.',
      generar(s) {
        const r = azar(s);
        if (s % 2 === 0) {
          const R = r.ent(3, 12), rr = r.ent(1, R - 1);
          return {
            pregunta: [`Una corona circular tiene radios ${R} y ${rr}. ¿Cuál es su área?`],
            dibujo: { datos: corona(5, 3, { R: `${R}`, r: `${rr}`, alt: `Corona de radios ${R} y ${rr}` }), estado: {} },
            opciones: opciones(R * R - rr * rr, [
              { id: 'resta', valor: (R - rr) ** 2, error: 'GE-CIR3', siFuera: 'π(R − r)² es un círculo de radio R − r, no la corona.' },
              { id: 'suma', valor: R * R + rr * rr, error: 'GE-CIR3', siFuera: 'La corona resta el círculo chico; no lo suma.' },
              { id: 'long', valor: 2 * (R - rr), error: 'GE19', siFuera: 'Esa es una diferencia de longitudes.' },
            ], k => pi(k)),
            solucion: { texto: 'Grande menos chico.', ecuacion: [`π(${R}² − ${rr}²) = ${pi(R * R - rr * rr)}`] },
          };
        }
        const rr = r.ent(2, 10), th = r.de([90, 60, 180]);
        const sec = rr * rr * th / 360, triS = rr * rr * Math.sin(U.rad(th)) / 2;
        const t = th === 180 ? `${pi(sec)}` : th === 90 ? `${pi(sec)} − ${f(triS)}` : `${pi(sec)} − ${f(rr * rr / 4)}√3`;
        return {
          pregunta: [`En un círculo de radio ${rr}, una cuerda subtiende un ángulo central de ${th}°. ¿Cuál es el área del segmento circular menor?`],
          opciones: [{ id: 'c', texto: t, correcta: true },
            { id: 'sector', texto: pi(sec), error: 'GE-CIR4', siFuera: 'Ese es el sector completo; falta restar el triángulo.' },
            { id: 'tri', texto: th === 60 ? `${f(rr * rr / 4)}√3` : f(triS), error: 'GE-CIR4', siFuera: 'Ese es el triángulo; el segmento es lo que queda del sector.' }].filter((o, i, l) => l.findIndex(x => x.texto === o.texto) === i),
          solucion: { texto: 'Sector menos triángulo de los dos radios.', ecuacion: [`${pi(sec)} − ${th === 60 ? `${f(rr * rr / 4)}√3` : f(triS)}`] },
        };
      },
    },
  };

  // ---------- Idea 5: trapecio circular, lúnulas y regiones compuestas ----------
  // Cambia: el ángulo del trapecio circular · Permanece: los dos radios · Progresa: la fracción de la corona ·
  // Se reserva: las lúnulas de Hipócrates · Debe verse: sumar y restar regiones sin contar dos veces.
  const trapCirc = al => {
    const R = 5, r = 3;
    return {
      alt: `Trapecio circular de ${al}° entre radios 5 y 3: área ${pi((R * R - r * r) * al / 360)}`,
      vista: { x: [-5.6, 5.6], y: [-5.6, 5.6] },
      puntos: [pt('O', [0, 0], {}), pt('A', [5, 0], { sinPunto: true }), pt('B', U.polar([0, 0], 5, al), { sinPunto: true }), pt('Q5', U.polar([0, 0], 5, -45), { sinPunto: true }), pt('Q3', U.polar([0, 0], 3, -45), { color: 'o' })],
      circulos: [{ centro: 'O', r: 5, grosor: 'fino', discontinua: true }, { centro: 'O', r: 3, grosor: 'fino', discontinua: true }],
      regiones: [{ puntos: anillo([0, 0], 5, 3, 0, al), color: 'i', opacidad: 0.35, sinBorde: false }],
      segmentos: [{ de: 'O', a: 'A', color: 'o' }, { de: 'O', a: 'B', color: 'o' }, { de: 'O', a: 'Q5', color: 'o', grosor: 'fino', discontinua: true }],
      angulos: [{ en: 'O', de: 'A', a: 'B', color: 'h', texto: `${al}°`, radio: 16 }],
      rotulos: [{ x: 4.5, y: -4.2, texto: 'R = 5', color: 'o' }, { x: 4.1, y: -1.1, texto: 'r = 3', color: 'o' }],
    };
  };
  const lunulas = (o = {}) => {
    const A = [0, 0], B = [6, 0], C = [0, 8], k = o.pasos || {};
    const semi = (P, Q, fuera) => { const M = U.medio(P, Q), rr = U.dist(P, Q) / 2, ang = U.grados(Math.atan2(Q[1] - P[1], Q[0] - P[0])); return fuera ? U.arco(M, rr, ang, ang - 180, 40) : U.arco(M, rr, ang, ang + 180, 40); };
    return {
      alt: o.alt || 'Triángulo rectángulo de catetos 6 y 8 con semicírculos sobre sus tres lados: las dos lúnulas suman el área del triángulo',
      vista: { x: [-4.8, 9.2], y: [-3.8, 9.6] },
      puntos: [pt('A', A, { rotulo: 'A', lado: 225 }), pt('B', B, { rotulo: 'B', lado: -45 }), pt('C', C, { rotulo: 'C', lado: 135 })],
      regiones: [
        { puntos: [...semi(A, B, true)], color: 'o', opacidad: 0.25, sinBorde: false, desde: k.s || 0 },
        { puntos: [...semi(C, A, true)], color: 'o', opacidad: 0.25, sinBorde: false, desde: k.s || 0 },
        { puntos: ['A', 'B', 'C'], color: 'd', opacidad: 0.2, sinBorde: false, desde: k.t || 0 },
        { puntos: [...semi(B, C, false)], color: o.blanco ? 'h' : 'i', opacidad: o.blanco ? 0.12 : 0.0001, discontinua: true, desde: k.h || 0 },
      ],
      segmentos: [{ de: 'A', a: 'B', texto: '6' }, { de: 'A', a: 'C', texto: '8' }, { de: 'B', a: 'C', texto: '10' }],
      angulos: [{ en: 'A', de: 'B', a: 'C' }],
    };
  };
  const lunIdea = {
    id: 'trapecio-circular-y-lunulas',
    titulo: 'Sumar y restar regiones curvas',
    temas: ['Trapecio circular, lúnula y otras regiones'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'El trapecio circular es una parte de la corona entre radios 5 y 3. Abre su ángulo y mira su área.',
      voz: 'Abre el ángulo. Es la misma fracción que en el sector.',
      controles: [{ id: 'al', etiqueta: 'ángulo', min: 30, max: 270, paso: 30, inicio: 90, unidad: '°', decimales: 0, color: 'c-h' }],
      dibujo: v => ({ datos: trapCirc(v.al), estado: {} }),
      lectura: v => [`${v.al}/360 · π(25 − 9) = ${pi(16 * v.al / 360)}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Sobre los tres lados de un triángulo rectángulo de catetos 6 y 8 se dibujan semicírculos. Las dos lúnulas son lo que sobresale del semicírculo de la hipotenusa. ¿Cuánto suman sus áreas?',
      voz: 'Piensa qué se suma y qué se resta. π puede desaparecer.',
      opciones: [
        { id: 'c', texto: '24', correcta: true },
        { id: 'pi', texto: '12,5π', error: 'GE-CIR5', siFuera: '12,5π es el semicírculo de la hipotenusa: se resta, no es el resultado.' },
        { id: 'semis', texto: '12,5π − 24', error: 'GE-CIR5', siFuera: 'Eso resta en el orden contrario: el triángulo se suma.' },
        { id: 'sumapi', texto: '25π', error: 'GE-CIR5', siFuera: 'Eso suma los semicírculos de los catetos sin restar nada.' },
      ],
      dibujo: { datos: lunulas(), estado: {} },
      revelar: { datos: lunulas({ blanco: true }), estado: {} },
      coincide: 'Coincide: las lúnulas suman exactamente el área del triángulo, 24.',
    },
    mira: {
      datos: lunulas({ blanco: true, pasos: { s: 1, t: 2, h: 3 } }),
      voz: 'Suma lo que agregas; resta lo que tapas. Sin contar dos veces.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Semicírculos sobre los catetos: 4,5π + 8π.', ecuacion: ['½π · 3² + ½π · 4² = 12,5π'] },
        { estado: { corte: 2 }, texto: 'Sumamos el triángulo.', ecuacion: ['12,5π + 24'] },
        { estado: { corte: 3 }, texto: 'Restamos el semicírculo de la hipotenusa: también 12,5π, por Pitágoras.', ecuacion: ['12,5π + 24 − 12,5π = 24'] },
      ],
    },
    regla: {
      texto: 'El trapecio circular es la fracción α/360 de una corona. Las regiones compuestas se calculan sumando y restando regiones conocidas, sin contar dos veces lo que se superpone.',
      ecuacion: ['trapecio circular = ', frac('α', '360°'), ' · π(', { sup: [cR, '2'] }, ' − ', { sup: [cr, '2'] }, ')'],
      condicion: 'las lúnulas salen de semicírculos sobre los lados de un triángulo rectángulo: entonces suman su área.',
      voz: 'Antes de sumar, marca qué región se superpone.',
    },
    ahoraTu: {
      voz: 'Arma la región con piezas que sabes medir.',
      generar(s) {
        const r = azar(s);
        if (s % 2 === 0) {
          const R = r.ent(4, 12), rr = r.ent(1, R - 1), al = r.de([30, 45, 60, 90, 120, 180]);
          const S = (R * R - rr * rr) * al / 360;
          return {
            pregunta: [`Un trapecio circular está entre radios ${R} y ${rr}, con ángulo central de ${al}°. ¿Cuál es su área?`],
            opciones: opciones(S, [
              { id: 'resta', valor: (R - rr) ** 2 * al / 360, error: 'GE-CIR3', siFuera: 'Eso usa (R − r)²; la corona usa R² − r².' },
              { id: 'todo', valor: R * R - rr * rr, error: 'GE19', siFuera: 'Esa es la corona completa; falta la fracción.' },
              { id: 'sector', valor: R * R * al / 360, error: 'GE-CIR4', siFuera: 'Ese es el sector grande; falta restar el chico.' },
            ], k => pi(k)),
            solucion: { texto: `Fracción ${al}/360 de la corona.`, ecuacion: [`${al}/360 · π(${R}² − ${rr}²) = ${pi(S)}`] },
          };
        }
        const [a, b] = r.de([[3, 4], [6, 8], [5, 12], [8, 15], [9, 12], [12, 16]]);
        return {
          pregunta: [`Sobre los lados de un triángulo rectángulo de catetos ${a} y ${b} se dibujan semicírculos. ¿Cuánto suman las dos lúnulas que sobresalen del semicírculo de la hipotenusa?`],
          opciones: opciones(a * b / 2, [
            { id: 'sin2', valor: a * b, error: 'GE-AR1', siFuera: 'Ese es el rectángulo de los catetos; el triángulo es la mitad.' },
            { id: 'pi', valor: Math.PI * (a * a + b * b) / 8, error: 'GE-CIR5', siFuera: 'Ese es el semicírculo de la hipotenusa: se cancela al restar.' },
            { id: 'suma', valor: a + b, error: 'GE-CIR5', siFuera: 'Sumar catetos da una longitud, no un área.' },
          ], k => f(k)),
          solucion: { texto: 'Las lúnulas suman el área del triángulo.', ecuacion: [`${a} · ${b} / 2 = ${f(a * b / 2)}`] },
        };
      },
    },
  };

  return {
    unidad: 'geometria.longitud-y-areas-circulares',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/geo-figura.js'],
    historia: {
      texto: 'Una curva no se compara con una regla tan fácil como un segmento. Arquímedes encerró el círculo entre polígonos inscritos y circunscritos y obtuvo cotas para la razón entre longitud y diámetro: 22/7 resultó una aproximación por exceso, no el valor de π. Siglos después, Zu Chongzhi halló 355/113. El avance fue controlar el error.',
      pregunta: '¿Cómo se mide algo curvo con piezas rectas?',
      fuente: { titulo: 'Euclides, Elementos XII.2 (edición de D. E. Joyce)', url: 'https://math.clarku.edu/~djoyce/java/elements/bookXII/propXII2.html' },
    },
    ideas: [piIdea, areaCirc, sectorIdea, coronaIdea, lunIdea],
  };
});
