/*
 * Teoría de «Áreas de regiones triangulares y cuadrangulares» (geometria.areas-poligonales). Molde: docs/teoria.md.
 * Fuente: docs/teoria/matriz/geometria.json (unidad 11); patrón resuelto «área del triángulo» de
 * diseno-y-animacion/references/ensenanza.md (copia que gira y forma un paralelogramo).
 * Compañera: Neri (nutria). Pieza: geo-figura.
 *
 * Ficha de tarea
 *   Promesa: medir áreas con base y altura perpendicular (también fuera), comparar áreas por razones de bases o alturas,
 *     y usar diagonales y puntos medios en cuadriláteros.
 *   Persona y condiciones: postulante de 4.º de secundaria, celular a 360 px, sin audio, quizás sin conexión.
 *   Resultado observable: calcula áreas de triángulos (bh/2, ab·sen C/2), razones de áreas, paralelogramos, rombos,
 *     trapecios y cuadriláteros por diagonales, y usa relaciones como el paralelogramo de los puntos medios.
 *   Orden de atención: 1.º la figura y su lectura · 2.º la pregunta · acción: «Comprobar» · fondo: Neri.
 *   Estados: jugando · predicción sin elegir · comprobada · paso de «Mira» · regla · caso nuevo.
 *   Duda que resuelve: «¿qué es la altura?»: la perpendicular a la recta de la base, no un lado inclinado.
 *
 * Colores: base verde (c-d), altura roja (c-h), una región naranja (c-o), la otra turquesa (c-i).
 * Códigos: GE4, GE6, GE7 (docs/investigacion/geometria-ideas-erroneas.md); GE-AR son hipótesis nuevas.
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
  const cb = { v: 'c-d', t: 'b' }, ch = { v: 'c-h', t: 'h' };
  const area = pts => Math.abs(U.area(pts));

  // ---------- Idea 1: área del triángulo ----------
  // Cambia: la posición de A sobre una paralela a la base · Permanece: base 4 y altura 3 · Progresa: nada: el área queda en 6 ·
  // Se reserva: la altura que cae fuera · Debe verse: la altura es perpendicular a la recta de la base, aunque caiga afuera.
  const triFig = (ax, o = {}) => {
    const A = [ax, 3], B = [0, 0], C = [4, 0], H = [ax, 0], k = o.pasos || {};
    const Ap = [4 + 0 - ax + 0, -3 + 3], D = [C[0] + (A[0] - B[0]), 3]; void Ap;
    return {
      alt: o.alt || `Triángulo de base 4 y altura 3 con el vértice A en (${f(ax)}; 3): área 6${ax < 0 || ax > 4 ? '; la altura cae fuera del lado' : ''}`,
      vista: { x: [-3.4, 8.6], y: [-0.9, 4.2] },
      puntos: [pt('A', A, { rotulo: 'A', lado: 90 }), pt('B', B, { rotulo: 'B', lado: -90 }), pt('C', C, { rotulo: 'C', lado: -90 }), pt('H', H, { rotulo: 'H', lado: -90 }),
        pt('p1', [-3.4, 3], { sinPunto: true }), pt('p2', [8.6, 3], { sinPunto: true }), pt('D', D, { rotulo: o.copia ? 'D' : undefined, sinPunto: !o.copia, desde: k.c || 0 })],
      regiones: [{ puntos: ['A', 'B', 'C'], color: 'o', opacidad: 0.2 }, ...(o.copia ? [{ puntos: ['A', 'C', 'D'], color: 'i', opacidad: 0.2, discontinua: true, desde: k.c || 0 }] : [])],
      segmentos: [{ de: 'A', a: 'B' }, { de: 'A', a: 'C' }, { de: 'B', a: 'C', color: 'd', grosor: 'variable', texto: 'b = 4', lado: -1 },
        { de: 'p1', a: 'p2', grosor: 'fino', discontinua: true, paralela: o.paralela ? 1 : 0 },
        ...(ax < 0 || ax > 4 ? [{ de: ax < 0 ? 'H' : 'C', a: ax < 0 ? 'B' : 'H', discontinua: true, grosor: 'fino' }] : []),
        { de: 'A', a: 'H', color: 'h', grosor: 'variable', texto: o.sinH ? undefined : 'h = 3', desde: k.h || 0 },
        ...(o.lado ? [{ de: 'A', a: 'B', color: 'i', texto: o.lado }] : [])],
      angulos: [{ en: 'H', de: ax > 0 && ax < 4 ? 'C' : (ax <= 0 ? 'B' : 'C'), a: 'A', color: 'h', desde: k.h || 0 }],
    };
  };
  const triIdea = {
    id: 'area-del-triangulo',
    titulo: 'Base por altura, sobre dos',
    temas: ['Área del triángulo con distintos datos'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'El vértice A corre por una recta paralela a la base BC. Muévelo, también más allá de B o de C, y mira el área.',
      voz: 'Corre A lejos. Comprueba si el área cambia.',
      controles: [{ id: 'ax', etiqueta: 'A a lo ancho', min: -3, max: 8, paso: 1, inicio: 1, unidad: '', decimales: 0, color: 'c-o' }],
      dibujo: v => ({ datos: triFig(v.ax, { paralela: true }), estado: {} }),
      lectura: v => [`área = `, frac([cb, ' · ', ch], '2'), ' = ', frac('4 · 3', '2'), ' = 6'],
      minimo: 4,
    },
    predice: {
      pregunta: 'Triángulo con B(0; 0), C(4; 0) y A(−2; 3): el ángulo B es obtuso. ¿Cuál es su área?',
      voz: 'Busca la perpendicular a la recta BC. Puede caer fuera.',
      opciones: [
        { id: 'c', texto: '6', correcta: true },
        { id: 'lado', texto: '2√13 ≈ 7,2', error: 'GE7', siFuera: 'Eso usa el lado AB como altura. La altura es la perpendicular desde A: mide 3.' },
        { id: 'sin2', texto: '12', error: 'GE-AR1', siFuera: '12 es base por altura: el paralelogramo. El triángulo es la mitad.' },
        { id: 'dentro', texto: 'No se puede: la altura cae fuera', error: 'GE7', siFuera: 'Fuera del lado sí se puede: se prolonga la base y se mide igual.' },
      ],
      dibujo: { datos: triFig(-2, { sinH: true, lado: 'AB = √13', alt: 'Triángulo de vértices B(0; 0), C(4; 0) y A(−2; 3), con el ángulo B obtuso' }), estado: {} },
      revelar: { datos: triFig(-2), estado: {} },
      coincide: 'Coincide: 4 · 3 / 2 = 6, con la altura medida fuera.',
    },
    mira: {
      datos: triFig(1.5, { copia: true, pasos: { h: 1, c: 2 }, alt: 'Una copia girada del triángulo completa un paralelogramo de base 4 y altura 3' }),
      voz: 'Una copia del triángulo arma un paralelogramo.',
      pasos: [
        { estado: { corte: 1 }, texto: 'La altura es perpendicular a la recta de la base.', ecuacion: [ch, ' = 3 · ', cb, ' = 4'] },
        { estado: { corte: 2 }, texto: 'Una copia girada completa un paralelogramo.', ecuacion: ['paralelogramo = ', cb, ' · ', ch, ' = 12'] },
        { estado: { corte: 2 }, texto: 'El triángulo es la mitad.', ecuacion: ['S = ', frac([cb, ' · ', ch], '2'), ' = 6'] },
      ],
    },
    regla: {
      texto: 'El área de un triángulo es base por altura sobre dos. Con dos lados y el ángulo entre ellos, es la mitad de a · b · sen C.',
      ecuacion: ['S = ', frac([cb, ' · ', ch], '2'), '   ·   S = ', frac('a · b · sen C', '2')],
      condicion: 'la altura es perpendicular a la recta de la base, aunque caiga fuera; C es el ángulo entre a y b.',
      voz: 'La altura no es un lado inclinado: búscala en perpendicular.',
    },
    ahoraTu: {
      voz: 'Ubica una base y su altura, o dos lados con su ángulo.',
      generar(s) {
        const r = azar(s);
        if (s % 2 === 0) {
          const b = r.ent(3, 12), h = r.ent(2, 9), sale = r.ent(1, 4), lado = Math.hypot(h, sale);
          return {
            pregunta: [`Un triángulo obtusángulo tiene base `, cb, ` = ${b}; desde el vértice opuesto, la perpendicular a la recta de la base mide `, ch, ` = ${h} y cae ${sale} fuera del lado. ¿Cuál es su área?`],
            dibujo: { datos: Object.assign(triFig(-1, { sinH: true }), { alt: 'Triángulo obtusángulo con la altura fuera del lado' }), estado: {} },
            opciones: opciones(b * h / 2, [
              { id: 'sin2', valor: b * h, error: 'GE-AR1', siFuera: 'Base por altura da el paralelogramo; falta dividir entre 2.' },
              { id: 'lado', valor: b * lado / 2, error: 'GE7', siFuera: 'Eso usa el lado inclinado como altura.' },
              { id: 'suma', valor: (b + sale) * h / 2, error: 'GE7', siFuera: 'La base es el lado, no el lado más lo que sale la altura.' },
            ], n => f(n)),
            solucion: { texto: 'La altura cae fuera, pero sigue siendo perpendicular.', ecuacion: [`S = ${b} · ${h} / 2 = ${f(b * h / 2)}`] },
          };
        }
        const a = r.ent(3, 12), b = r.ent(3, 12), C = r.de([30, 150, 90]);
        const S = a * b * Math.sin(U.rad(C)) / 2;
        return {
          pregunta: [`Dos lados de un triángulo miden ${a} y ${b}, y el ángulo entre ellos mide ${C}°. ¿Cuál es su área?`],
          opciones: opciones(S, [
            { id: 'sin-sen', valor: a * b / 2, error: 'GE-AR2', siFuera: C === 90 ? 'Ese es el correcto solo si C = 90°.' : 'Eso toma un lado como altura; falta el seno del ángulo.' },
            { id: 'sin2', valor: a * b * Math.sin(U.rad(C)), error: 'GE-AR1', siFuera: 'Falta dividir entre 2.' },
            { id: 'cos', valor: a * b * Math.abs(Math.cos(U.rad(C === 90 ? 60 : C))) / 2, error: 'GE-AR2', siFuera: 'El área usa el seno del ángulo, no el coseno.' },
          ], n => f(n)),
          solucion: { texto: 'Mitad del producto de los lados por el seno del ángulo.', ecuacion: [`S = ${a} · ${b} · sen ${C}° / 2 = ${f(S)}`] },
        };
      },
    },
  };

  // ---------- Idea 2: relación entre áreas de triángulos ----------
  // Cambia: el punto D en BC · Permanece: el vértice A (misma altura) · Progresa: las dos áreas y su razón ·
  // Se reserva: un caso con números · Debe verse: con la misma altura, las áreas siguen a las bases.
  const ceviana = (t, o = {}) => {
    const A = [2, 4], B = [0, 0], C = [9, 0], D = [9 * t, 0], k = o.pasos || {};
    return {
      alt: o.alt || `D parte BC en ${f(9 * t)} y ${f(9 - 9 * t)}: las áreas de ABD y ADC están en la misma razón`,
      vista: { x: [-0.8, 9.8], y: [-1, 4.8] },
      puntos: [pt('A', A, { rotulo: 'A', lado: 90 }), pt('B', B, { rotulo: 'B', lado: -120 }), pt('C', C, { rotulo: 'C', lado: -60 }), pt('D', D, { rotulo: 'D', color: 'h', lado: -90 }), pt('H', [2, 0], { sinPunto: true })],
      regiones: [{ puntos: ['A', 'B', 'D'], color: 'o', opacidad: 0.22 }, { puntos: ['A', 'D', 'C'], color: 'i', opacidad: 0.22 }],
      segmentos: [{ de: 'A', a: 'B' }, { de: 'A', a: 'C' }, { de: 'A', a: 'D', color: 'h' },
        { de: 'B', a: 'D', color: 'o', grosor: 'variable', texto: o.bases || f(9 * t), lado: -1 }, { de: 'D', a: 'C', color: 'i', grosor: 'variable', texto: o.bases2 || f(9 - 9 * t), lado: -1 },
        { de: 'A', a: 'H', discontinua: true, grosor: 'fino', texto: 'h', desde: k.h || 0 }],
      rotulos: o.areas ? [{ x: (2 + 9 * t) / 2 + 0.3, y: 1.2, texto: o.areas[0], color: 'o', desde: k.a || 0 }, { x: (2 + 9 * t + 9) / 3 + 0.4, y: 1.2, texto: o.areas[1], color: 'i', desde: k.a || 0 }] : [],
      angulos: [{ en: 'H', de: 'C', a: 'A', desde: k.h || 0 }],
    };
  };
  const razon = {
    id: 'razon-de-areas',
    titulo: 'Misma altura, razón de bases',
    temas: ['Relación entre áreas de triángulos'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'La ceviana AD parte el triángulo en dos. Corre D por la base y compara las dos áreas con los dos tramos de la base.',
      voz: 'Corre D. Compara la razón de áreas con la de bases.',
      controles: [{ id: 't', etiqueta: 'D en BC', min: 0.2, max: 0.8, paso: 0.1, inicio: 0.3, unidad: '', decimales: 1, color: 'c-h' }],
      dibujo: v => ({ datos: ceviana(v.t), estado: {} }),
      lectura: v => [`áreas ${f(9 * v.t * 2)} : ${f((9 - 9 * v.t) * 2)} · bases ${f(9 * v.t)} : ${f(9 - 9 * v.t)}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'En el triángulo ABC de área 18, D está en BC con BD = 2 · DC. ¿Cuál es el área del triángulo ABD?',
      voz: 'Los dos triángulos comparten algo. Encuéntralo.',
      opciones: [
        { id: 'c', texto: '12', correcta: true },
        { id: 'mitad', texto: '9', error: 'GE-AR3', siFuera: 'La mitad sería cierta si D fuera el punto medio; aquí BD es el doble de DC.' },
        { id: 'tercio', texto: '6', error: 'GE-AR3', siFuera: '6 es el área de ADC, el triángulo de la base corta.' },
        { id: 'doble', texto: '36', error: 'GE-AR3', siFuera: 'ABD es una parte de ABC: no puede superar 18.' },
      ],
      dibujo: { datos: ceviana(2 / 3, { bases: '2k', bases2: 'k' }), estado: {} },
      revelar: { datos: ceviana(2 / 3, { bases: '2k', bases2: 'k', areas: ['12', '6'] }), estado: {} },
      coincide: 'Coincide: misma altura, bases 2 : 1, áreas 12 y 6.',
    },
    mira: {
      datos: ceviana(2 / 3, { bases: '2k', bases2: 'k', areas: ['12', '6'], pasos: { h: 1, a: 2 } }),
      voz: 'Una sola altura sirve para los dos triángulos.',
      pasos: [
        { estado: { corte: 1 }, texto: 'ABD y ADC tienen la misma altura h desde A.', ecuacion: ['h común'] },
        { estado: { corte: 2 }, texto: 'Sus áreas son proporcionales a sus bases: 2 : 1.', ecuacion: [frac('[ABD]', '[ADC]'), ' = ', frac('BD', 'DC'), ' = 2'] },
        { estado: { corte: 2 }, texto: 'De 18, dos tercios para ABD.', ecuacion: ['[ABD] = ⅔ · 18 = 12'] },
      ],
    },
    regla: {
      texto: 'Triángulos con la misma altura tienen áreas proporcionales a sus bases; con la misma base, a sus alturas. Si son semejantes de razón k, sus áreas están en razón k².',
      ecuacion: [frac('S₁', 'S₂'), ' = ', frac('b₁', 'b₂'), ' (misma h)   ·   ', frac('S₁', 'S₂'), ' = ', { sup: ['k', '2'] }, ' (semejantes)'],
      condicion: 'las bases están en la misma recta y el vértice opuesto es común (o las alturas son iguales).',
      voz: 'Busca lo que comparten: altura, base o forma.',
    },
    ahoraTu: {
      voz: 'Decide qué comparten: altura, base o forma.',
      generar(s) {
        const r = azar(s), t = s % 3;
        if (t === 2) {
          const S = r.ent(2, 10), k = r.ent(2, 4);
          return {
            pregunta: [`Dos triángulos semejantes tienen lados correspondientes ${1} : ${k}. El menor tiene área ${S}. ¿Cuál es el área del mayor?`],
            opciones: opciones(S * k * k, [
              { id: 'k', valor: S * k, error: 'GE1', siFuera: 'Multiplicar por k sirve para longitudes; el área va por k².' },
              { id: 'k3', valor: S * k ** 3, error: 'GE2', siFuera: 'k³ es para volúmenes.' },
              { id: 'suma', valor: S + k, error: 'GE1', siFuera: 'La escala multiplica, no suma.' },
            ], n => f(n)),
            solucion: { texto: 'Semejantes: áreas en razón k².', ecuacion: [`${S} · ${k}² = ${S * k * k}`] },
          };
        }
        const p = r.ent(1, 5), q = r.ent(1, 5), S = (p + q) * r.ent(2, 6);
        return {
          pregunta: [`En un triángulo de área ${S}, una ceviana parte el lado opuesto en tramos que están en razón ${p} : ${q}. ¿Cuál es el área de la parte que corresponde al tramo ${p}?`],
          opciones: opciones(S * p / (p + q), [
            { id: 'mitad', valor: S / 2, error: 'GE-AR3', siFuera: 'La mitad sería cierta si los tramos fueran iguales.' },
            { id: 'otro', valor: S * q / (p + q), error: 'GE-AR3', siFuera: `Esa es la parte del tramo ${q}.` },
            { id: 'razon', valor: S * p / q, error: 'GE-AR3', siFuera: `La razón ${p} : ${q} se reparte sobre el total ${p} + ${q}, no sobre ${q}.` },
          ], n => f(n)),
          solucion: { texto: 'Misma altura: el área se reparte como la base.', ecuacion: [`${S} · ${p}/${p + q} = ${f(S * p / (p + q))}`] },
        };
      },
    },
  };

  // ---------- Idea 3: paralelogramos y rombos ----------
  // Cambia: la inclinación del paralelogramo · Permanece: lados 8 y 5 · Progresa: la altura 5·sen θ y el área ·
  // Se reserva: el rombo por sus diagonales · Debe verse: el rombo son cuatro triángulos que caben en medio rectángulo.
  const paraFig = t => {
    const D = U.polar([0, 0], 5, t), Cc = [8 + D[0], D[1]], H = [D[0], 0];
    return {
      alt: `Paralelogramo de lados 8 y 5 con ángulo de ${t}°: altura ${f(D[1])} y área ${f(8 * D[1])}`,
      vista: { x: [-4, 12], y: [-1, 5.6] },
      puntos: [pt('A', [0, 0], { rotulo: 'A', lado: -120 }), pt('B', [8, 0], { rotulo: 'B', lado: -60 }), pt('C', Cc, { rotulo: 'C', lado: 60 }), pt('D', D, { rotulo: 'D', lado: 120 }), pt('H', H, { sinPunto: true })],
      regiones: [{ puntos: ['A', 'B', 'C', 'D'], color: 'o', opacidad: 0.18 }],
      segmentos: [{ de: 'A', a: 'B', color: 'd', grosor: 'variable', texto: '8', lado: -1 }, { de: 'B', a: 'C' }, { de: 'C', a: 'D' }, { de: 'D', a: 'A', color: 'i', texto: '5' },
        ...(D[0] < 0 ? [{ de: 'H', a: 'A', discontinua: true, grosor: 'fino' }] : []), { de: 'D', a: 'H', color: 'h', grosor: 'variable', texto: `h = ${f(D[1])}` }],
      angulos: [{ en: 'A', de: 'B', a: 'D', color: 'i', texto: `${t}°`, radio: 20 }, { en: 'H', de: D[0] < 0 ? 'A' : 'B', a: 'D', color: 'h' }],
    };
  };
  const rombo = (o = {}) => {
    const P = [[-5, 0], [0, -3], [5, 0], [0, 3]], k = o.pasos || {};
    return {
      alt: o.alt || 'Rombo de diagonales 10 y 6: dentro del rectángulo de 10 por 6 que lo encierra ocupa la mitad',
      vista: { x: [-5.8, 5.8], y: [-3.8, 3.8] },
      puntos: [pt('A', P[0], { rotulo: 'A', lado: 180 }), pt('B', P[1], { rotulo: 'B', lado: -90 }), pt('C', P[2], { rotulo: 'C', lado: 0 }), pt('D', P[3], { rotulo: 'D', lado: 90 }), pt('O', [0, 0], { sinPunto: true })],
      regiones: [{ puntos: ['A', 'B', 'C', 'D'], color: 'o', opacidad: 0.25, sinBorde: false }, ...(o.caja ? [{ puntos: [[-5, -3], [5, -3], [5, 3], [-5, 3]], color: 'i', opacidad: 0.1, discontinua: true, desde: k.caja || 0 }] : [])],
      segmentos: [{ de: 'A', a: 'C', color: 'd', grosor: 'variable', texto: 'D = 10', lado: 1 }, { de: 'B', a: 'D', color: 'h', grosor: 'variable', texto: 'd = 6' }],
      angulos: [{ en: 'O', de: 'C', a: 'D' }],
    };
  };
  const paraIdea = {
    id: 'paralelogramos-y-rombos',
    titulo: 'Paralelogramo y rombo',
    temas: ['Área de paralelogramos y rombos'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Los lados miden 8 y 5. Inclina el paralelogramo y mira cómo cambian su altura h y su área.',
      voz: 'Inclina sin cambiar los lados. Mira qué pasa con el área.',
      controles: [{ id: 't', etiqueta: '∠A', min: 30, max: 150, paso: 15, inicio: 60, unidad: '°', decimales: 0, color: 'c-i' }],
      dibujo: v => ({ datos: paraFig(v.t), estado: {} }),
      lectura: v => [ch, ` = ${f(5 * Math.sin(U.rad(v.t)))} · área = 8 · `, ch, ` = ${f(40 * Math.sin(U.rad(v.t)))}`],
      minimo: 4,
    },
    predice: {
      pregunta: 'Un rombo tiene diagonales de 10 y 6, perpendiculares entre sí. ¿Cuál es su área?',
      voz: 'Las diagonales del rombo dejan cuatro triángulos.',
      opciones: [
        { id: 'c', texto: '30', correcta: true },
        { id: 'prod', texto: '60', error: 'GE-AR1', siFuera: '60 es el rectángulo de 10 por 6 que encierra al rombo. El rombo ocupa la mitad.' },
        { id: 'lados', texto: '34', error: 'GE-AR2', siFuera: '34 es el lado al cuadrado; el lado inclinado no es altura.' },
        { id: 'cuarto', texto: '15', error: 'GE-AR1', siFuera: '15 es la mitad del rombo: dos de los cuatro triángulos.' },
      ],
      dibujo: { datos: rombo(), estado: {} },
      revelar: { datos: rombo({ caja: true }), estado: {} },
      coincide: 'Coincide: el rombo ocupa medio rectángulo de 10 por 6.',
    },
    mira: {
      datos: rombo({ caja: true, pasos: { caja: 1 } }),
      voz: 'Encierra el rombo en un rectángulo y compara.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Las diagonales lo parten en cuatro triángulos rectángulos iguales.', ecuacion: ['4 triángulos de 5 por 3'] },
        { estado: { corte: 1 }, texto: 'El rectángulo de 10 por 6 contiene ocho de esos triángulos.', ecuacion: ['10 · 6 = 60'] },
        { estado: { corte: 1 }, texto: 'El rombo tiene cuatro: la mitad.', ecuacion: ['S = ', frac('D · d', '2'), ' = 30'] },
      ],
    },
    regla: {
      texto: 'El área de un paralelogramo es base por su altura perpendicular. La de un rombo es el producto de sus diagonales sobre dos.',
      ecuacion: ['paralelogramo: ', cb, ' · ', ch, ' = a · b · sen θ   ·   rombo: ', frac('D · d', '2')],
      condicion: 'la altura es perpendicular a la base; en el rombo, las diagonales son perpendiculares. Dos lados oblicuos no son base y altura.',
      voz: 'Lado inclinado no es altura. Mídela en perpendicular.',
    },
    ahoraTu: {
      voz: 'Decide si tienes altura, ángulo o diagonales.',
      generar(s) {
        const r = azar(s);
        if (s % 2 === 0) {
          const D = 2 * r.ent(2, 10), d = 2 * r.ent(2, 10);
          return {
            pregunta: [`Un rombo tiene diagonales de ${D} y ${d}. ¿Cuál es su área?`],
            opciones: opciones(D * d / 2, [
              { id: 'prod', valor: D * d, error: 'GE-AR1', siFuera: 'Ese es el rectángulo que lo encierra; el rombo es la mitad.' },
              { id: 'lado', valor: (D * D + d * d) / 4, error: 'GE-AR2', siFuera: 'Ese es el lado al cuadrado; el lado no es altura.' },
              { id: 'cuarto', valor: D * d / 4, error: 'GE-AR1', siFuera: 'Esa es la mitad del rombo.' },
            ], n => f(n)),
            solucion: { texto: 'Producto de diagonales sobre dos.', ecuacion: [`${D} · ${d} / 2 = ${D * d / 2}`] },
          };
        }
        const a = r.ent(4, 12), b = r.ent(3, 10), t = r.de([30, 150]);
        return {
          pregunta: [`Un paralelogramo tiene lados ${a} y ${b}, y uno de sus ángulos mide ${t}°. ¿Cuál es su área?`],
          opciones: opciones(a * b / 2, [
            { id: 'lados', valor: a * b, error: 'GE-AR2', siFuera: 'Multiplicar los dos lados supone ángulo recto; aquí la altura es b · sen 30°.' },
            { id: 'mitad', valor: a * b / 4, error: 'GE-AR1', siFuera: 'Eso divide de más: el paralelogramo no lleva el 1/2 del triángulo.' },
            { id: 'cos', valor: a * b * Math.cos(U.rad(30)), error: 'GE-AR2', siFuera: 'La altura usa el seno del ángulo, no el coseno.' },
          ], n => f(n)),
          solucion: { texto: `Altura: ${b} · sen ${t}° = ${f(b / 2)}.`, ecuacion: [`S = ${a} · ${f(b / 2)} = ${f(a * b / 2)}`] },
        };
      },
    },
  };

  // ---------- Idea 4: trapecios y trapezoides ----------
  // Cambia: las bases del trapecio · Permanece: la altura 4 · Progresa: mediana · altura ·
  // Se reserva: el trapezoide por sus diagonales · Debe verse: las diagonales parten en cuatro triángulos con el mismo seno.
  const trapFig = (B, b) => {
    const off = (B - b) / 2 + 0.6, P = [[0, 0], [B, 0], [off + b, 4], [off, 4]];
    return {
      alt: `Trapecio de bases ${B} y ${b} y altura 4: área ${f((B + b) / 2 * 4)}`,
      vista: { x: [-0.8, 12.8], y: [-1, 4.8] },
      puntos: P.map((p, i) => pt('ABCD'[i], p, { rotulo: 'ABCD'[i] })).concat([pt('H', [off, 0], { sinPunto: true }), pt('M', [off / 2, 2], { sinPunto: true }), pt('N', [(B + off + b) / 2, 2], { sinPunto: true })]),
      regiones: [{ puntos: ['A', 'B', 'C', 'D'], color: 'o', opacidad: 0.18 }],
      segmentos: [{ de: 'A', a: 'B', color: 'd', grosor: 'variable', texto: `B = ${B}`, lado: -1 }, { de: 'D', a: 'C', color: 'd', grosor: 'variable', texto: `b = ${b}` }, { de: 'B', a: 'C' }, { de: 'A', a: 'D' },
        { de: 'D', a: 'H', color: 'h', grosor: 'variable', texto: 'h = 4' }, { de: 'M', a: 'N', color: 'i', discontinua: true, texto: `${f((B + b) / 2)}` }],
      angulos: [{ en: 'H', de: 'B', a: 'D', color: 'h' }],
    };
  };
  const cuadDiag = (o = {}) => {
    const O = [0, 0], A = U.polar(O, 4, 195), C = U.polar(O, 6, 15), Bq = U.polar(O, 3, 225), D = U.polar(O, 5, 45), k = o.pasos || {};
    return {
      alt: o.alt || 'Cuadrilátero de diagonales 10 y 8 que se cortan formando 30°',
      vista: { x: [-4.8, 6.4], y: [-3, 4.2] },
      puntos: [pt('A', A, { rotulo: 'A', lado: 195 }), pt('B', Bq, { rotulo: 'B', lado: 225 }), pt('C', C, { rotulo: 'C', lado: 15 }), pt('D', D, { rotulo: 'D', lado: 45 }), pt('O', O, { rotulo: 'O', lado: 120 })],
      regiones: [{ puntos: ['A', 'B', 'C', 'D'], color: 'o', opacidad: 0.12, sinBorde: false },
        ...(o.cuatro ? [{ puntos: ['O', 'C', 'D'], color: 'i', opacidad: 0.25, desde: k.t || 0 }, { puntos: ['O', 'A', 'B'], color: 'i', opacidad: 0.25, desde: k.t || 0 }] : [])],
      segmentos: [{ de: 'A', a: 'C', color: 'd', grosor: 'variable', texto: 'p = 10' }, { de: 'B', a: 'D', color: 'h', grosor: 'variable', texto: 'q = 8' }],
      angulos: [{ en: 'O', de: 'C', a: 'D', color: 'i', texto: '30°', radio: 22 }],
    };
  };
  const trapIdea = {
    id: 'trapecios-y-trapezoides',
    titulo: 'Trapecio y cuadrilátero cualquiera',
    temas: ['Área de trapecios y trapezoides'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'El trapecio tiene altura 4. Cambia sus bases y compara el área con la mediana (punteada) por la altura.',
      voz: 'Cambia las bases. Mira qué papel cumple la mediana.',
      controles: [
        { id: 'B', etiqueta: 'B', min: 6, max: 12, paso: 1, inicio: 10, unidad: '', decimales: 0, color: 'c-d' },
        { id: 'b', etiqueta: 'b', min: 2, max: 6, paso: 1, inicio: 4, unidad: '', decimales: 0, color: 'c-d' },
      ],
      dibujo: v => ({ datos: trapFig(v.B, v.b), estado: {} }),
      lectura: v => [`área = `, frac(`${v.B} + ${v.b}`, '2'), ` · 4 = ${f((v.B + v.b) * 2)}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Un cuadrilátero sin lados paralelos tiene diagonales de 10 y 8 que se cortan formando 30°. ¿Cuál es su área?',
      voz: 'Las diagonales lo parten en cuatro triángulos.',
      opciones: [
        { id: 'c', texto: '20', correcta: true },
        { id: 'sin2', texto: '40', error: 'GE-AR1', siFuera: 'Falta el 1/2: cada triángulo usa la mitad del producto por el seno.' },
        { id: 'rombo', texto: '40, como el rombo', error: 'GE-AR4', siFuera: 'pq/2 vale con diagonales perpendiculares. Con 30°, entra sen 30° = 1/2.' },
        { id: 'nada', texto: 'No se puede: no es trapecio', error: 'GE-AR4', siFuera: 'Sin lados paralelos se puede igual: las diagonales y su ángulo bastan.' },
      ],
      dibujo: { datos: cuadDiag(), estado: {} },
      revelar: { datos: cuadDiag({ cuatro: true }), estado: {} },
      coincide: 'Coincide: 10 · 8 · sen 30° / 2 = 20.',
    },
    mira: {
      datos: cuadDiag({ cuatro: true, pasos: { t: 1 }, alt: 'Las diagonales parten el cuadrilátero en cuatro triángulos que comparten el ángulo de 30° o su suplemento' }),
      voz: 'Cuatro triángulos con el mismo seno.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Cada triángulo tiene dos tramos de diagonal y el ángulo en O.', ecuacion: ['[OCD] = ½ · OC · OD · sen 30°'] },
        { estado: { corte: 1 }, texto: '30° y 150° tienen el mismo seno: suman los cuatro.', ecuacion: ['S = ½ · sen 30° · (OA + OC)(OB + OD)'] },
        { estado: { corte: 1 }, texto: 'Los paréntesis son las diagonales completas.', ecuacion: ['S = ', frac('p · q · sen θ', '2'), ' = ', frac('10 · 8 · ½', '2'), ' = 20'] },
      ],
    },
    regla: {
      texto: 'Trapecio: la semisuma de las bases por la altura. Cuadrilátero convexo cualquiera: la mitad del producto de las diagonales por el seno del ángulo que forman.',
      ecuacion: ['trapecio: ', frac('B + b', '2'), ' · ', ch, '   ·   cuadrilátero: ', frac('p · q · sen θ', '2')],
      condicion: 'el cuadrilátero es convexo. Si las diagonales son perpendiculares, sen θ = 1 y queda pq/2.',
      voz: 'Sin lados paralelos, las diagonales hacen el trabajo.',
    },
    ahoraTu: {
      voz: 'Identifica qué datos tienes: bases y altura, o diagonales y ángulo.',
      generar(s) {
        const r = azar(s);
        if (s % 2 === 0) {
          const B = r.ent(6, 16), b = r.ent(2, B - 1), h = r.ent(2, 9);
          return {
            pregunta: [`Un trapecio tiene bases ${B} y ${b} y altura ${h}. ¿Cuál es su área?`],
            opciones: opciones((B + b) * h / 2, [
              { id: 'sin2', valor: (B + b) * h, error: 'GE-AR1', siFuera: 'Falta dividir la suma de bases entre 2.' },
              { id: 'mayor', valor: B * h, error: 'GE-AR1', siFuera: 'Eso usa solo la base mayor: sería un rectángulo.' },
              { id: 'resta', valor: (B - b) * h / 2, error: 'GE-AR1', siFuera: 'Las bases se suman: la mediana es la semisuma.' },
            ], n => f(n)),
            solucion: { texto: 'Mediana por altura.', ecuacion: [`(${B} + ${b})/2 · ${h} = ${f((B + b) * h / 2)}`] },
          };
        }
        const p = r.ent(4, 14), q = r.ent(4, 14), t = r.de([30, 90, 150]), S = p * q * Math.sin(U.rad(t)) / 2;
        return {
          pregunta: [`Un cuadrilátero convexo tiene diagonales de ${p} y ${q} que forman ${t}°. ¿Cuál es su área?`],
          opciones: opciones(S, [
            { id: 'sin2', valor: 2 * S, error: 'GE-AR1', siFuera: 'Falta el 1/2 de la fórmula.' },
            { id: 'perp', valor: p * q / 2, error: 'GE-AR4', siFuera: 'pq/2 vale solo con diagonales perpendiculares.' },
            { id: 'prod', valor: p * q, error: 'GE-AR1', siFuera: 'El producto de diagonales sin más no es un área de la figura.' },
          ], n => f(n)),
          solucion: { texto: 'Mitad del producto de diagonales por el seno.', ecuacion: [`${p} · ${q} · sen ${t}° / 2 = ${f(S)}`] },
        };
      },
    },
  };

  // ---------- Idea 5: relaciones entre áreas de cuadriláteros ----------
  // Cambia: un punto P dentro del paralelogramo · Permanece: el paralelogramo · Progresa: [PAB] + [PCD], siempre la mitad ·
  // Se reserva: el cuadrilátero de los puntos medios · Debe verse: las esquinas recortadas suman la mitad.
  const PA = [[0, 0], [8, 0], [10, 5], [2, 5]];
  const puntoP = (px, py) => {
    const P = [px, py];
    return {
      alt: `P dentro del paralelogramo de área 40: los triángulos PAB y PCD suman 20`,
      vista: { x: [-0.8, 10.8], y: [-1, 5.8] },
      puntos: PA.map((p, i) => pt('ABCD'[i], p, { rotulo: 'ABCD'[i] })).concat([pt('P', P, { rotulo: 'P', color: 'h', lado: 0 })]),
      regiones: [{ puntos: ['A', 'B', 'C', 'D'], color: 'd', opacidad: 0.05, sinBorde: false }, { puntos: ['P', 'A', 'B'], color: 'o', opacidad: 0.3 }, { puntos: ['P', 'C', 'D'], color: 'i', opacidad: 0.3 }],
      segmentos: ['A', 'B', 'C', 'D'].map(v => ({ de: 'P', a: v, grosor: 'fino' })),
    };
  };
  const QV = [[0, 0], [9, 1], [7, 6], [1.4, 4]];
  const varigArea = (o = {}) => {
    const M = QV.map((p, i) => U.medio(p, QV[(i + 1) % 4])), k = o.pasos || {};
    return {
      alt: o.alt || 'Cuadrilátero ABCD con sus puntos medios: el paralelogramo de los puntos medios tiene la mitad del área',
      vista: { x: [-0.8, 9.8], y: [-1, 6.8] },
      puntos: QV.map((p, i) => pt('ABCD'[i], p, { rotulo: 'ABCD'[i] })).concat(M.map((p, i) => pt('M' + i, p, {}))),
      regiones: [{ puntos: ['A', 'B', 'C', 'D'], color: 'd', opacidad: 0.05, sinBorde: false }, { puntos: ['M0', 'M1', 'M2', 'M3'], color: 'o', opacidad: 0.3, sinBorde: false, desde: o.sol ? 0 : 99 },
        ...(o.esquinas ? [{ puntos: ['A', 'M0', 'M3'], color: 'i', opacidad: 0.3, desde: k.e1 || 0 }, { puntos: ['C', 'M2', 'M1'], color: 'i', opacidad: 0.3, desde: k.e1 || 0 },
          { puntos: ['B', 'M1', 'M0'], color: 'h', opacidad: 0.2, desde: k.e2 || 0 }, { puntos: ['D', 'M3', 'M2'], color: 'h', opacidad: 0.2, desde: k.e2 || 0 }] : [])],
      segmentos: [...(o.diag ? [{ de: 'B', a: 'D', grosor: 'fino', discontinua: true, desde: k.e1 || 0 }, { de: 'A', a: 'C', grosor: 'fino', discontinua: true, desde: k.e2 || 0 }] : []),
        { de: 'M0', a: 'M1', color: 'o', desde: o.sol ? 0 : 99 }, { de: 'M1', a: 'M2', color: 'o', desde: o.sol ? 0 : 99 }, { de: 'M2', a: 'M3', color: 'o', desde: o.sol ? 0 : 99 }, { de: 'M3', a: 'M0', color: 'o', desde: o.sol ? 0 : 99 }],
    };
  };
  const relIdea = {
    id: 'relaciones-cuadrilateros',
    titulo: 'Mitades escondidas en cuadriláteros',
    temas: ['Relaciones entre áreas de cuadriláteros'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'El paralelogramo tiene área 40. Mueve el punto P por dentro y mira la suma de los triángulos PAB y PCD.',
      voz: 'Mueve P a cualquier lugar. Comprueba la suma.',
      controles: [
        { id: 'px', etiqueta: 'P a lo ancho', min: 3, max: 7, paso: 1, inicio: 4, unidad: '', decimales: 0, color: 'c-h' },
        { id: 'py', etiqueta: 'P a lo alto', min: 1, max: 4, paso: 1, inicio: 2, unidad: '', decimales: 0, color: 'c-h' },
      ],
      dibujo: v => ({ datos: puntoP(v.px, v.py), estado: {} }),
      lectura: v => { const P = [v.px, v.py], a = area([P, PA[0], PA[1]]), c = area([P, PA[2], PA[3]]); return [{ v: 'c-o', t: `${f(a)}` }, ' + ', { v: 'c-i', t: `${f(c)}` }, ` = ${f(a + c)}`]; },
      minimo: 4,
    },
    predice: {
      pregunta: 'Un cuadrilátero cualquiera tiene área 40. Unimos los puntos medios de sus lados. ¿Cuál es el área del paralelogramo que se forma?',
      voz: 'Mira qué recortas en cada esquina.',
      opciones: [
        { id: 'c', texto: '20', correcta: true },
        { id: 'cuarto', texto: '10', error: 'GE-AR5', siFuera: 'Un cuarto es lo que pasa en un triángulo con su triángulo medio. Aquí se recortan cuatro esquinas.' },
        { id: 'igual', texto: '40', error: 'GE-AR5', siFuera: 'El paralelogramo queda dentro: le faltan las cuatro esquinas.' },
        { id: 'depende', texto: 'Depende de la forma', error: 'GE-AR5', siFuera: 'Su forma depende del cuadrilátero; su área siempre es la mitad.' },
      ],
      dibujo: { datos: varigArea(), estado: {} },
      revelar: { datos: varigArea({ sol: true }), estado: {} },
      coincide: 'Coincide: el paralelogramo de los puntos medios tiene la mitad del área.',
    },
    mira: {
      datos: varigArea({ sol: true, esquinas: true, diag: true, pasos: { e1: 1, e2: 2 } }),
      voz: 'Usa una diagonal: cada esquina es un cuarto de un triángulo.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Con la diagonal BD, las esquinas A y C suman un cuarto.', ecuacion: ['esquinas A + C = ¼ [ABCD]'] },
        { estado: { corte: 2 }, texto: 'Con la diagonal AC pasa lo mismo en B y D.', ecuacion: ['esquinas B + D = ¼ [ABCD]'] },
        { estado: { corte: 2 }, texto: 'Las cuatro esquinas suman la mitad; queda la otra mitad.', ecuacion: ['paralelogramo = ½ · 40 = 20'] },
      ],
    },
    regla: {
      texto: 'Con P dentro de un paralelogramo, PAB y PCD suman la mitad del área. El paralelogramo de los puntos medios de un cuadrilátero tiene la mitad de su área.',
      ecuacion: ['[PAB] + [PCD] = ', frac('S', '2'), '   ·   [puntos medios] = ', frac('S', '2')],
      condicion: 'la primera pide un paralelogramo y P interior; la segunda vale para cualquier cuadrilátero convexo.',
      voz: 'Una diagonal parte el problema en triángulos conocidos.',
    },
    ahoraTu: {
      voz: 'Reconoce la relación y aplica la mitad donde corresponde.',
      generar(s) {
        const r = azar(s), S = 4 * r.ent(5, 30);
        if (s % 2 === 0) {
          const a = r.ent(2, S / 2 - 2);
          return {
            pregunta: [`P está dentro del paralelogramo ABCD de área ${S}. Si el triángulo PAB tiene área ${a}, ¿cuál es el área del triángulo PCD?`],
            opciones: opciones(S / 2 - a, [
              { id: 'igual', valor: a, error: 'GE-AR5', siFuera: 'Serían iguales solo si P estuviera a la misma distancia de AB y de CD.' },
              { id: 'resto', valor: S - a, error: 'GE-AR5', siFuera: 'Eso resta del total; PAB y PCD juntos son solo la mitad.' },
              { id: 'cuarto', valor: S / 4, error: 'GE-AR5', siFuera: 'Un cuarto sería cierto con P en el centro.' },
            ], n => f(n)),
            solucion: { texto: 'PAB y PCD suman la mitad del paralelogramo.', ecuacion: [`${S}/2 − ${a} = ${S / 2 - a}`] },
          };
        }
        return {
          pregunta: [`Un cuadrilátero convexo tiene área ${S}. ¿Cuál es el área del paralelogramo que forman los puntos medios de sus lados?`],
          opciones: opciones(S / 2, [
            { id: 'cuarto', valor: S / 4, error: 'GE-AR5', siFuera: 'Un cuarto es lo que se recorta en cada par de esquinas.' },
            { id: 'igual', valor: S, error: 'GE-AR5', siFuera: 'El paralelogramo queda dentro y es menor.' },
            { id: 'tres', valor: 3 * S / 4, error: 'GE-AR5', siFuera: 'Las cuatro esquinas suman la mitad, no un cuarto.' },
          ], n => f(n)),
          solucion: { texto: 'Las esquinas suman la mitad.', ecuacion: [`${S} / 2 = ${S / 2}`] },
        };
      },
    },
  };

  return {
    unidad: 'geometria.areas-poligonales',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/geo-figura.js'],
    historia: {
      texto: 'El papiro Rhind conserva problemas concretos de cálculo, entre ellos áreas, ligados a necesidades prácticas. Presenta procedimientos y ejemplos, no tratados ordenados como los de hoy. Comparar esas reglas con descomposiciones exactas en triángulos permite distinguir una aproximación de una equivalencia.',
      pregunta: '¿Cómo sabes que dos figuras distintas tienen la misma área?',
      fuente: { titulo: 'Euclides, Elementos I.35–41 (edición de D. E. Joyce)', url: 'https://math.clarku.edu/~djoyce/java/elements/bookI/propI41.html' },
    },
    ideas: [triIdea, razon, paraIdea, trapIdea, relIdea],
  };
});
