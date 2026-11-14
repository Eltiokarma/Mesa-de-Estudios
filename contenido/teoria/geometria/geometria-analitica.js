/*
 * Teoría de «Geometría analítica» (geometria.geometria-analitica). Molde: docs/teoria.md.
 * Fuente: docs/teoria/matriz/geometria.json (unidad 17); OpenStax, Precalculus 2e (2.1, 10.1, 10.3); Descartes (1637).
 * Compañera: Neri (nutria). Pieza: geo-figura con cuadrícula y ejes.
 *
 * Ficha de tarea
 *   Promesa: pasar de una condición geométrica (distancia, pendiente, igualdad de distancias) a su ecuación y volver,
 *     comprobando con puntos de la cuadrícula.
 *   Persona y condiciones: postulante de 5.º de secundaria, celular a 360 px, sin audio, quizás sin conexión.
 *   Resultado observable: calcula distancias y puntos de división, pendientes y ecuaciones de rectas, distancia de
 *     un punto a una recta, centro y radio de una circunferencia, foco y directriz de una parábola y focos de una elipse.
 *   Orden de atención: 1.º la figura y su lectura · 2.º la pregunta · acción: «Comprobar» · fondo: Neri.
 *   Estados: jugando · predicción sin elegir · comprobada · paso de «Mira» · regla · caso nuevo.
 *   Duda que resuelve: «¿con qué signo sale el centro?» y «¿la recta vertical tiene pendiente 0?».
 *
 * Coordenadas escritas como (x; y), con punto y coma, para no confundir con la coma decimal.
 * Colores por idea: dato naranja (c-o), segundo dato o auxiliar turquesa (c-i), la recta o curva verde (c-d) y lo
 * pedido rojo (c-h).
 * Códigos: GE-AN1 a GE-AN5, hipótesis nuevas (rutinas/teoria-geometria.md).
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
  const n = x => (x < 0 ? `−${f(-x)}` : f(x));
  const P = (x, y) => `(${n(x)}; ${n(y)})`;
  // «+ 3», «− 3» para armar ecuaciones; «x» sin coeficiente 1.
  const sg = x => (x < 0 ? ` − ${f(-x)}` : ` + ${f(x)}`);
  const cuad = (v, h) => (h === 0 ? `${v}²` : `(${v}${sg(-h)})²`);
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = l => l[Math.floor(r() * l.length)];
    return r;
  }
  function opcionesTxt(correcta, distractores, k = 4) {
    const vistos = new Set([correcta]);
    const ops = [{ id: 'c', texto: correcta, correcta: true }];
    for (const d of distractores) {
      if (!d.texto || vistos.has(d.texto) || /NaN|Infinity/.test(d.texto)) continue;
      vistos.add(d.texto);
      ops.push({ id: d.id, texto: d.texto, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, k);
  }
  const pt = (id, p, o = {}) => Object.assign({ id, x: p[0], y: p[1] }, o);
  const frac = (a, b) => ({ frac: [a, b] });
  const plano = (x = [-6, 6], y = [-5, 5]) => ({ vista: { x, y }, cuadricula: { paso: 1 }, ejes: true });

  // ---------- Idea 1: distancia y punto que divide un segmento ----------
  // Cambia: la razón m : n · Permanece: A y B · Progresa: P se acerca al extremo de menor peso ·
  // Se reserva: la razón 1 : 2 · Debe verse: P queda más cerca del extremo que pesa más (pesos cruzados).
  const RAZ = { '1:1': [1, 1], '1:2': [1, 2], '2:1': [2, 1], '1:3': [1, 3], '3:1': [3, 1] };
  const divFig = (A, B, m, k, o = {}) => {
    const Pp = [(k * A[0] + m * B[0]) / (m + k), (k * A[1] + m * B[1]) / (m + k)], kk = o.pasos || {};
    return Object.assign(plano(o.vx, o.vy), {
      alt: o.alt || `A${P(...A)} y B${P(...B)}; P divide AB en razón ${m} : ${k} y queda en ${P(...Pp)}`,
      puntos: [pt('A', A, { rotulo: 'A', color: 'o', lado: 200 }), pt('B', B, { rotulo: 'B', color: 'i', lado: 20 }), pt('Pp', Pp, { rotulo: 'P', color: 'h', lado: 110, desde: kk.p || 0 }), pt('Q', [B[0], A[1]], { sinPunto: true, desde: kk.d ?? 99 })],
      segmentos: [{ de: 'A', a: 'Pp', color: 'o', grosor: 'variable', texto: o.ta, desde: kk.p || 0 }, { de: 'Pp', a: 'B', color: 'i', grosor: 'variable', texto: o.tb, desde: kk.p || 0 },
        { de: 'A', a: 'Q', grosor: 'fino', discontinua: true, texto: o.dx, lado: -1, desde: kk.d ?? 99 }, { de: 'Q', a: 'B', grosor: 'fino', discontinua: true, texto: o.dy, lado: -1, desde: kk.d ?? 99 }],
    });
  };
  const divIdea = {
    id: 'distancia-y-division',
    titulo: 'Distancia y reparto de un segmento',
    temas: ['Distancia y punto que divide un segmento'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'P divide el segmento AB en la razón AP : PB que elijas. Cambia la razón y mira hacia qué extremo se corre P.',
      voz: 'Cambia la razón. ¿P se acerca a A o a B?',
      controles: [{ id: 'raz', etiqueta: 'AP : PB', opciones: Object.keys(RAZ).map(v => ({ valor: v, texto: v.replace(':', ' : ') })) }],
      dibujo: v => ({ datos: divFig([-4, -2], [4, 4], ...RAZ[v.raz]), estado: {} }),
      lectura: v => { const [m, k] = RAZ[v.raz]; return [`P = (${k} · A + ${m} · B) / ${m + k} = ${P((k * -4 + m * 4) / (m + k), (k * -2 + m * 4) / (m + k))}`, 'AB = √(8² + 6²) = 10']; },
      minimo: 3,
    },
    predice: {
      pregunta: 'A(1; 2) y B(7; 8). El punto P de AB cumple AP : PB = 1 : 2. ¿Cuáles son las coordenadas de P?',
      voz: 'AP es la parte chica: P está cerca de A.',
      opciones: [
        { id: 'c', texto: '(3; 4)', correcta: true },
        { id: 'al-reves', texto: '(5; 6)', error: 'GE-AN1', siFuera: '(5; 6) está a 1/3 desde B: los pesos van cruzados.' },
        { id: 'medio', texto: '(4; 5)', error: 'GE-AN1', siFuera: '(4; 5) es el punto medio, razón 1 : 1.' },
        { id: 'sin-div', texto: '(9; 12)', error: 'GE-AN1', siFuera: 'Falta dividir entre m + n = 3.' },
      ],
      dibujo: { datos: divFig([1, 2], [7, 8], 1, 2, { vx: [-1, 9], vy: [-1, 9], pasos: { p: 99 } }), estado: {} },
      revelar: { datos: divFig([1, 2], [7, 8], 1, 2, { vx: [-1, 9], vy: [-1, 9] }), estado: {} },
      coincide: 'Coincide: un tercio del camino de A a B.',
    },
    mira: {
      datos: divFig([1, 2], [7, 8], 1, 2, { vx: [-1, 9], vy: [-1, 9], dx: '6', dy: '6', pasos: { p: 2, d: 0 } }),
      voz: 'Avanza la fracción m/(m + n) del camino.',
      pasos: [
        { estado: { corte: 0 }, texto: 'De A a B se avanza 6 a la derecha y 6 hacia arriba.', ecuacion: ['AB = √(6² + 6²) = 6√2'] },
        { estado: { corte: 1 }, texto: 'AP es 1 de las 3 partes del segmento.', ecuacion: [frac('1', '1 + 2'), ' = ', frac('1', '3')] },
        { estado: { corte: 2 }, texto: 'Un tercio de cada avance, desde A.', ecuacion: ['P = (1 + 2; 2 + 2) = (3; 4)'] },
        { estado: { corte: 2 }, texto: 'Con la fórmula: pesos cruzados.', ecuacion: ['P = ', frac('2 · A + 1 · B', '3')] },
      ],
    },
    regla: {
      texto: 'La distancia entre dos puntos sale de Pitágoras. El punto que divide AB en razón AP : PB = m : n se obtiene con pesos cruzados.',
      ecuacion: ['d = √(Δx² + Δy²)   ·   P = ', frac([{ v: 'c-i', t: 'n' }, ' · ', { v: 'c-o', t: 'A' }, ' + ', { v: 'c-o', t: 'm' }, ' · ', { v: 'c-i', t: 'B' }], 'm + n')],
      condicion: 'P está entre A y B y la razón es AP : PB; con P = punto medio, m = n.',
      voz: 'Cada extremo lleva el número del tramo contrario.',
    },
    ahoraTu: {
      voz: 'Avanza la fracción del camino desde A.',
      generar(s) {
        const r = azar(s);
        if (s % 2 === 0) {
          const [p, q, h] = r.de([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10], [12, 5, 13]]), A = [r.ent(-5, 3), r.ent(-5, 3)], sx = r.de([1, -1]), B = [A[0] + sx * p, A[1] + q];
          return {
            pregunta: [`¿Cuál es la distancia entre A${P(...A)} y B${P(...B)}?`],
            opciones: opcionesTxt(f(h), [
              { id: 'suma', texto: f(p + q), error: 'GE-AN1', siFuera: 'Sumar los avances da un camino en escalera, más largo.' },
              { id: 'sinraiz', texto: f(p * p + q * q), error: 'GE19', siFuera: 'Falta sacar la raíz cuadrada.' },
              { id: 'resta', texto: f(Math.abs(q - p)), error: 'GE-AN1', siFuera: 'Los avances se elevan al cuadrado y se suman.' },
            ]),
            solucion: { texto: `Δx = ${p}, Δy = ${q}.`, ecuacion: [`√(${p}² + ${q}²) = ${h}`] },
          };
        }
        const [m, k] = r.de([[1, 2], [2, 1], [1, 3], [3, 1], [1, 1], [2, 3]]), t = m + k, A = [r.ent(-5, 2), r.ent(-5, 2)], B = [A[0] + t * r.ent(1, 3), A[1] + t * r.ent(-2, 3)];
        const Pp = [(k * A[0] + m * B[0]) / t, (k * A[1] + m * B[1]) / t], Pr = [(m * A[0] + k * B[0]) / t, (m * A[1] + k * B[1]) / t];
        return {
          pregunta: [`A${P(...A)} y B${P(...B)}. P está en AB con AP : PB = ${m} : ${k}. ¿Cuáles son las coordenadas de P?`],
          opciones: opcionesTxt(P(...Pp), [
            { id: 'al-reves', texto: P(...Pr), error: 'GE-AN1', siFuera: 'Los pesos van cruzados: A lleva n y B lleva m.' },
            { id: 'medio', texto: P((A[0] + B[0]) / 2, (A[1] + B[1]) / 2), error: 'GE-AN1', siFuera: 'Ese es el punto medio.' },
            { id: 'sin-div', texto: P(k * A[0] + m * B[0], k * A[1] + m * B[1]), error: 'GE-AN1', siFuera: `Falta dividir entre ${t}.` },
          ]),
          solucion: { texto: `Desde A se avanza ${m}/${t} del camino.`, ecuacion: [`P = (${k}·A + ${m}·B)/${t} = ${P(...Pp)}`] },
        };
      },
    },
  };

  // ---------- Idea 2: pendiente y ecuación de la recta ----------
  // Cambia: el punto B · Permanece: A(−2; −1) · Progresa: Δy/Δx ·
  // Se reserva: la recta vertical · Debe verse: pendiente 0 es horizontal; la vertical no tiene pendiente.
  const rectaFig = (A, B, o = {}) => {
    const k = o.pasos || {}, vert = A[0] === B[0], m = vert ? null : (B[1] - A[1]) / (B[0] - A[0]);
    // La recta se recorta al marco [−6, 6] × [−5, 5] (la pieza no recorta).
    const cortes = vert ? [[A[0], -5], [A[0], 5]] : [[-6, A[1] + m * (-6 - A[0])], [6, A[1] + m * (6 - A[0])], ...(m === 0 ? [] : [[A[0] + (-5 - A[1]) / m, -5], [A[0] + (5 - A[1]) / m, 5]])]
      .filter(q => q[0] >= -6 - 1e-9 && q[0] <= 6 + 1e-9 && q[1] >= -5 - 1e-9 && q[1] <= 5 + 1e-9).sort((u, w) => u[0] - w[0] || u[1] - w[1]);
    const ext = [cortes[0], cortes[cortes.length - 1]];
    return Object.assign(plano(), {
      alt: o.alt || `Recta por A${P(...A)} y B${P(...B)}: ${vert ? 'es vertical y su pendiente no está definida' : `pendiente ${f(m)}`}`,
      puntos: [pt('A', A, { rotulo: 'A', color: 'o', lado: 225 }), pt('B', B, { rotulo: 'B', color: 'i', lado: 45 }), pt('Q', [B[0], A[1]], { sinPunto: true }), pt('e0', ext[0], { sinPunto: true }), pt('e1', ext[1], { sinPunto: true })],
      segmentos: [{ de: 'e0', a: 'e1', color: 'd', grosor: 'variable', desde: k.r || 0 },
        ...(vert ? [] : [{ de: 'A', a: 'Q', color: 'o', texto: `Δx = ${n(B[0] - A[0])}`, lado: B[1] === A[1] ? -1 : Math.sign(B[0] - A[0]) * Math.sign(B[1] - A[1]) }]),
        ...(B[1] === A[1] ? [] : [{ de: 'Q', a: 'B', color: 'i', texto: `Δy = ${n(B[1] - A[1])}`, lado: vert ? 1 : Math.sign(B[0] - A[0]) * Math.sign(B[1] - A[1]) }])],
    });
  };
  // Fracción reducida p/q como texto: 4/7, −1/2, 3.
  const fr = (p, q) => { const g = (a, b) => (b ? g(b, a % b) : Math.abs(a)), d = g(p, q) || 1, s = Math.sign(p) * Math.sign(q), a = Math.abs(p) / d, b = Math.abs(q) / d; return `${s < 0 ? '−' : ''}${b === 1 ? a : `${a}/${b}`}`; };
  const rectaIdea = {
    id: 'pendiente-y-recta',
    titulo: 'Cuánto sube por cada paso',
    temas: ['Pendiente y ecuación de la recta'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'La recta pasa por A(−2; −1) y por B. Mueve B y mira cuánto sube la recta (Δy) por lo que avanza (Δx).',
      voz: 'Mueve B. Pon B justo encima de A. ¿Qué pasa?',
      controles: [
        { id: 'bx', etiqueta: 'x de B', min: -2, max: 5, paso: 1, inicio: 2, unidad: '', decimales: 0, color: 'c-o' },
        { id: 'by', etiqueta: 'y de B', min: -4, max: 4, paso: 1, inicio: 3, unidad: '', decimales: 0, color: 'c-i' },
      ],
      dibujo: v => ({ datos: rectaFig([-2, -1], [v.bx, v.by === -1 && v.bx === -2 ? 0 : v.by]), estado: {} }),
      lectura: v => {
        const by = v.by === -1 && v.bx === -2 ? 0 : v.by;
        if (v.bx === -2) return ['Δx = 0: recta vertical', 'pendiente no definida · x = −2'];
        const m = fr(by + 1, v.bx + 2);
        return [`m = ${n(by + 1)} / ${n(v.bx + 2)} = ${m}`, by + 1 === 0 ? 'y = −1 (horizontal)' : m === '1' ? 'y + 1 = x + 2' : `y + 1 = ${m} · (x + 2)`];
      },
      minimo: 4,
    },
    predice: {
      pregunta: '¿Cuál es la pendiente de la recta que pasa por (2; 1) y (2; 5)?',
      voz: 'Mira cuánto avanza x entre los dos puntos.',
      opciones: [
        { id: 'c', texto: 'No está definida: es vertical', correcta: true },
        { id: 'cero', texto: '0', error: 'GE-AN2', siFuera: 'Pendiente 0 es una recta horizontal: no sube nada.' },
        { id: 'cuatro', texto: '4', error: 'GE-AN2', siFuera: '4 es Δy; falta dividir entre Δx, que es 0.' },
        { id: 'inf', texto: '1', error: 'GE-AN2', siFuera: 'Pendiente 1 sube 1 por cada 1 que avanza: 45°.' },
      ],
      dibujo: { datos: rectaFig([2, 1], [2, 5], { pasos: { r: 99 } }), estado: {} },
      revelar: { datos: rectaFig([2, 1], [2, 5]), estado: {} },
      coincide: 'Coincide: Δx = 0 y no se divide entre 0. La recta es x = 2.',
    },
    mira: {
      datos: rectaFig([-2, -1], [2, 1]),
      voz: 'Pendiente: lo que sube por cada unidad que avanza.',
      pasos: [
        { estado: { corte: 0 }, texto: 'De A a B se avanza 4 y se sube 2.', ecuacion: ['m = ', frac('Δy', 'Δx'), ' = ', frac('2', '4'), ' = ', frac('1', '2')] },
        { estado: { corte: 0 }, texto: 'Punto y pendiente dan la ecuación.', ecuacion: ['y − (−1) = ', frac('1', '2'), '(x − (−2))'] },
        { estado: { corte: 0 }, texto: 'Despejando:', ecuacion: ['y = ', frac('x', '2')] },
        { estado: { corte: 0 }, texto: 'Si Δx = 0, no hay división: recta vertical x = k.', ecuacion: ['pendiente no definida'] },
      ],
    },
    regla: {
      texto: 'La pendiente es lo que sube la recta por cada unidad que avanza. Con un punto y la pendiente se escribe la ecuación.',
      ecuacion: ['m = ', frac({ v: 'c-i', t: 'y₂ − y₁' }, { v: 'c-o', t: 'x₂ − x₁' }), '   ·   y − y₁ = m(x − x₁)'],
      condicion: 'x₂ ≠ x₁. Si x₂ = x₁, la recta es vertical, x = x₁, y no tiene pendiente.',
      voz: 'Horizontal: pendiente 0. Vertical: sin pendiente.',
    },
    ahoraTu: {
      voz: 'Δy arriba, Δx abajo, en el mismo orden.',
      generar(s) {
        const r = azar(s), A = [r.ent(-5, 2), r.ent(-5, 3)], dx = r.de([1, 2, 3, 4, -2]), dy = r.ent(-4, 5), B = [A[0] + dx, A[1] + dy], m = dy / dx;
        const fm = x => { const g = (a, b) => (b ? g(b, a % b) : Math.abs(a)); const d = g(dy, dx), p = dy / d * Math.sign(dx), q = Math.abs(dx) / d; return q === 1 ? n(p) : `${p < 0 ? '−' : ''}${Math.abs(p)}/${q}`; };
        return {
          pregunta: [`¿Cuál es la pendiente de la recta que pasa por ${P(...A)} y ${P(...B)}?`],
          opciones: opcionesTxt(fm(m), [
            { id: 'inv', texto: dy === 0 ? '' : (() => { const g = (a, b) => (b ? g(b, a % b) : Math.abs(a)); const d = g(dx, dy), p = dx / d * Math.sign(dy), q = Math.abs(dy) / d; return q === 1 ? n(p) : `${p < 0 ? '−' : ''}${Math.abs(p)}/${q}`; })(), error: 'GE-AN2', siFuera: 'Eso es Δx/Δy: va al revés.' },
            { id: 'signo', texto: m === 0 ? 'No está definida' : (() => { const g = (a, b) => (b ? g(b, a % b) : Math.abs(a)); const d = g(dy, dx), p = -dy / d * Math.sign(dx), q = Math.abs(dx) / d; return q === 1 ? n(p) : `${p < 0 ? '−' : ''}${Math.abs(p)}/${q}`; })(), error: 'GE-AN2', siFuera: 'Revisa el signo: resta en el mismo orden arriba y abajo.' },
            { id: 'dy', texto: n(dy) === fm(m) ? '' : n(dy), error: 'GE-AN2', siFuera: 'Falta dividir entre Δx.' },
          ]),
          solucion: { texto: `Δy = ${n(dy)}, Δx = ${n(dx)}.`, ecuacion: [`m = ${n(dy)} / ${n(dx)} = ${fm(m)}`] },
        };
      },
    },
  };

  // ---------- Idea 3: distancia de un punto a una recta ----------
  // Cambia: el punto P · Permanece: la recta 3x + 4y − 12 = 0 · Progresa: la perpendicular ·
  // Se reserva: P debajo de la recta · Debe verse: la distancia va por la perpendicular y nunca es negativa.
  const L3 = [3, 4, -12];
  const distFig = (Pp, o = {}) => {
    const [A, B, C] = L3, v = (A * Pp[0] + B * Pp[1] + C) / (A * A + B * B), H = [Pp[0] - A * v, Pp[1] - B * v];
    return Object.assign(plano(), {
      alt: o.alt || `Recta 3x + 4y − 12 = 0 y punto P${P(...Pp)}: la distancia por la perpendicular es ${f(Math.abs(A * Pp[0] + B * Pp[1] + C) / 5)}`,
      puntos: [pt('P', Pp, { rotulo: 'P', color: 'o', lado: 200 }), pt('H', H, { color: 'h', desde: o.h ?? 0 }), pt('r0', [-4, 6], { sinPunto: true }), pt('r1', [6, -1.5], { sinPunto: true })],
      segmentos: [{ de: 'r0', a: 'r1', color: 'd', grosor: 'variable' }, { de: 'P', a: 'H', color: 'h', grosor: 'variable', texto: o.d, desde: o.h ?? 0 }],
      angulos: [{ en: 'H', de: 'P', a: 'r1', color: 'h', desde: o.h ?? 0 }],
    });
  };
  const distIdea = {
    id: 'distancia-punto-recta',
    titulo: 'El camino más corto',
    temas: ['Distancia de un punto a una recta'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Mueve P. Su distancia a la recta 3x + 4y − 12 = 0 va por la perpendicular. Mira el valor de 3x + 4y − 12 en P.',
      voz: 'Pon P a cada lado de la recta. Mira el signo.',
      controles: [
        { id: 'x', etiqueta: 'x de P', min: -5, max: 5, paso: 1, inicio: -2, unidad: '', decimales: 0, color: 'c-o' },
        { id: 'y', etiqueta: 'y de P', min: -4, max: 4, paso: 1, inicio: -2, unidad: '', decimales: 0, color: 'c-o' },
      ],
      dibujo: v => ({ datos: distFig([v.x, v.y], { d: f(Math.abs(3 * v.x + 4 * v.y - 12) / 5) }), estado: {} }),
      lectura: v => { const e = 3 * v.x + 4 * v.y - 12; return [`3·${n(v.x)} + 4·${n(v.y)} − 12 = ${n(e)}`, `d = |${n(e)}| / 5 = ${f(Math.abs(e) / 5)}`]; },
      minimo: 4,
    },
    predice: {
      pregunta: '¿Cuál es la distancia del punto P(0; −2) a la recta 3x + 4y − 12 = 0?',
      voz: 'Reemplaza P en la ecuación y piensa en el signo.',
      opciones: [
        { id: 'c', texto: '4', correcta: true },
        { id: 'neg', texto: '−4', error: 'GE-AN3', siFuera: 'Una distancia no es negativa: falta el valor absoluto.' },
        { id: 'sin-div', texto: '20', error: 'GE-AN3', siFuera: 'Falta dividir entre √(3² + 4²) = 5.' },
        { id: 'vert', texto: '5', error: 'GE-AN3', siFuera: '5 es la distancia vertical hasta la recta; la perpendicular es más corta.' },
      ],
      dibujo: { datos: distFig([0, -2], { h: 99 }), estado: {} },
      revelar: { datos: distFig([0, -2], { d: '4' }), estado: {} },
      coincide: 'Coincide: |0 − 8 − 12| / 5 = 20/5 = 4.',
    },
    mira: {
      datos: distFig([0, -2], { d: '4', h: 1 }),
      voz: 'Reemplaza, toma valor absoluto y divide.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Reemplaza P en el lado izquierdo de la ecuación.', ecuacion: ['3 · 0 + 4 · (−2) − 12 = −20'] },
        { estado: { corte: 1 }, texto: 'El signo solo dice de qué lado está P. La distancia lo quita.', ecuacion: ['|−20| = 20'] },
        { estado: { corte: 1 }, texto: 'Divide entre el largo de (A; B).', ecuacion: ['d = ', frac('20', '√(3² + 4²)'), ' = 4'] },
      ],
    },
    regla: {
      texto: 'La distancia de P(x₀; y₀) a la recta Ax + By + C = 0 se mide por la perpendicular y vale:',
      ecuacion: ['d = ', frac(['|A', { v: 'c-o', t: 'x₀' }, ' + B', { v: 'c-o', t: 'y₀' }, ' + C|'], '√(A² + B²)')],
      condicion: 'la recta está escrita como Ax + By + C = 0, con todo a un lado, y A, B no son ambos 0.',
      voz: 'Valor absoluto arriba; raíz de A² + B² abajo.',
    },
    ahoraTu: {
      voz: 'Pasa todo a un lado antes de reemplazar.',
      generar(s) {
        const r = azar(s), [A, B, c] = r.de([[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [6, 8, 10], [8, -6, 10], [3, -4, 5]]), C = r.ent(-15, 15), x0 = r.ent(-5, 5), y0 = r.ent(-5, 5);
        const e = A * x0 + B * y0 + C;
        const ec = `${A}x ${B < 0 ? '−' : '+'} ${Math.abs(B)}y${C === 0 ? '' : sg(C)} = 0`;
        return {
          pregunta: [`¿Cuál es la distancia del punto ${P(x0, y0)} a la recta ${ec}?`],
          opciones: opcionesTxt(f(Math.abs(e) / c), [
            { id: 'neg', texto: e < 0 ? n(e / c) : '', error: 'GE-AN3', siFuera: 'Una distancia no es negativa.' },
            { id: 'sin-div', texto: f(Math.abs(e)), error: 'GE-AN3', siFuera: `Falta dividir entre √(${A}² + ${B}²) = ${c}.` },
            { id: 'sin-c', texto: f(Math.abs(A * x0 + B * y0) / c), error: 'GE-AN3', siFuera: 'Falta sumar C al reemplazar.' },
            { id: 'cuad', texto: f(Math.abs(e) / (c * c)), error: 'GE19', siFuera: 'Se divide entre la raíz de A² + B², no entre A² + B².' },
          ]),
          solucion: { texto: `Reemplaza: ${n(e)}.`, ecuacion: [`|${n(e)}| / ${c} = ${f(Math.abs(e) / c)}`] },
        };
      },
    },
  };

  // ---------- Idea 4: ecuación de la circunferencia ----------
  // Cambia: centro y radio · Permanece: la condición «distancia al centro = r» · Progresa: la ecuación ·
  // Se reserva: la forma general · Debe verse: el centro sale con el signo contrario al del paréntesis.
  const circFig = (h, k, r, o = {}) => Object.assign(plano(o.vx, o.vy), {
    alt: o.alt || `Circunferencia de centro ${P(h, k)} y radio ${f(r)}`,
    puntos: o.oculto ? [] : [pt('C', [h, k], { rotulo: 'C', color: 'o', lado: 200 }), pt('R', [h + r, k], { color: 'i' })],
    circulos: o.oculto ? [] : [{ centro: 'C', r, color: 'd', grosor: 'variable' }],
    segmentos: o.oculto ? [] : [{ de: 'C', a: 'R', color: 'i', grosor: 'variable', texto: f(r) }],
  });
  const ecCirc = (h, k, r) => `${cuad('x', h)} + ${cuad('y', k)} = ${f(r * r)}`;
  const circIdea = {
    id: 'circunferencia',
    titulo: 'Todos a la misma distancia',
    temas: ['Ecuación de la circunferencia'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'La circunferencia son los puntos a distancia r del centro C. Mueve el centro y cambia el radio; mira la ecuación.',
      voz: 'Mueve el centro a la izquierda. ¿Qué signo sale en la ecuación?',
      controles: [
        { id: 'h', etiqueta: 'x del centro', min: -3, max: 3, paso: 1, inicio: 2, unidad: '', decimales: 0, color: 'c-o' },
        { id: 'k', etiqueta: 'y del centro', min: -2, max: 2, paso: 1, inicio: -1, unidad: '', decimales: 0, color: 'c-o' },
        { id: 'r', etiqueta: 'radio', min: 1, max: 3, paso: 1, inicio: 3, unidad: '', decimales: 0, color: 'c-i' },
      ],
      dibujo: v => ({ datos: circFig(v.h, v.k, v.r), estado: {} }),
      lectura: v => [ecCirc(v.h, v.k, v.r)],
      minimo: 4,
    },
    predice: {
      pregunta: '¿Cuál es el centro y el radio de la circunferencia x² + y² − 4x + 6y − 3 = 0?',
      voz: 'Completa cuadrados: agrupa x con x, y con y.',
      opciones: [
        { id: 'c', texto: 'C(2; −3), r = 4', correcta: true },
        { id: 'signos', texto: 'C(−2; 3), r = 4', error: 'GE-AN4', siFuera: 'El centro sale con la mitad del coeficiente cambiada de signo: −4x da 2.' },
        { id: 'r3', texto: 'C(2; −3), r = √3', error: 'GE-AN4', siFuera: 'El 3 no es r²: al completar cuadrados se suma 4 + 9.' },
        { id: 'r2', texto: 'C(2; −3), r = 16', error: 'GE-AN4', siFuera: '16 es r²; el radio es su raíz.' },
      ],
      dibujo: { datos: circFig(2, -3, 4, { vx: [-4, 8], vy: [-8, 2], oculto: true, alt: 'Plano cartesiano vacío: la circunferencia aparece al comprobar' }), estado: {} },
      revelar: { datos: circFig(2, -3, 4, { vx: [-4, 8], vy: [-8, 2] }), estado: {} },
      coincide: 'Coincide: (x − 2)² + (y + 3)² = 16.',
    },
    mira: {
      datos: circFig(2, -3, 4, { vx: [-4, 8], vy: [-8, 2] }),
      voz: 'Completa cada cuadrado sumando lo mismo a ambos lados.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Agrupa y pasa el número.', ecuacion: ['(x² − 4x) + (y² + 6y) = 3'] },
        { estado: { corte: 0 }, texto: 'Mitad del coeficiente, al cuadrado: 4 y 9.', ecuacion: ['(x² − 4x + 4) + (y² + 6y + 9) = 3 + 4 + 9'] },
        { estado: { corte: 0 }, texto: 'Se forman los cuadrados.', ecuacion: ['(x − 2)² + (y + 3)² = 16'] },
        { estado: { corte: 0 }, texto: 'Centro con signos cambiados; radio, raíz de 16.', ecuacion: ['C(2; −3), r = 4'] },
      ],
    },
    regla: {
      texto: 'La circunferencia de centro (h; k) y radio r reúne los puntos a distancia r del centro.',
      ecuacion: ['(x − ', { v: 'c-o', t: 'h' }, ')² + (y − ', { v: 'c-o', t: 'k' }, ')² = ', { sup: [{ v: 'c-i', t: 'r' }, '2'] }],
      condicion: 'r > 0. En la forma general se completan cuadrados; si el lado derecho sale 0 o negativo, no hay circunferencia.',
      voz: 'Dentro del paréntesis, el centro va con el signo cambiado.',
    },
    ahoraTu: {
      voz: 'Completa cuadrados o lee el centro con signo cambiado.',
      generar(s) {
        const r = azar(s), h = r.ent(-6, 6), k = r.ent(-6, 6), rr = r.ent(1, 7);
        if (s % 2 === 0) return {
          pregunta: [`¿Cuál es la ecuación de la circunferencia de centro ${P(h, k)} y radio ${rr}?`],
          opciones: opcionesTxt(ecCirc(h, k, rr), [
            { id: 'signos', texto: ecCirc(-h, -k, rr), error: 'GE-AN4', siFuera: 'Dentro del paréntesis va x − h: el signo se cambia.' },
            { id: 'r', texto: `${cuad('x', h)} + ${cuad('y', k)} = ${rr}`, error: 'GE-AN4', siFuera: 'A la derecha va r², no r.' },
            { id: 'ambos', texto: ecCirc(-h, -k, Math.sqrt(rr)), error: 'GE-AN4', siFuera: 'Revisa signos y radio al cuadrado.' },
          ]),
          solucion: { texto: '(x − h)² + (y − k)² = r².', ecuacion: [ecCirc(h, k, rr)] },
        };
        const D = -2 * h, E = -2 * k, F = h * h + k * k - rr * rr;
        const gen = `x² + y²${D ? sg(D) + 'x' : ''}${E ? sg(E) + 'y' : ''}${F ? sg(F) : ''} = 0`;
        return {
          pregunta: [`¿Cuál es el centro y el radio de la circunferencia ${gen}?`],
          opciones: opcionesTxt(`C${P(h, k)}, r = ${rr}`, [
            { id: 'signos', texto: `C${P(-h, -k)}, r = ${rr}`, error: 'GE-AN4', siFuera: 'El centro es la mitad del coeficiente con signo cambiado.' },
            { id: 'r2', texto: `C${P(h, k)}, r = ${rr * rr}`, error: 'GE-AN4', siFuera: 'Ese es r²; el radio es su raíz.' },
            { id: 'mitad', texto: `C${P(D, E)}, r = ${rr}`, error: 'GE-AN4', siFuera: 'Falta dividir el coeficiente entre −2.' },
          ]),
          solucion: { texto: 'Completa cuadrados.', ecuacion: [ecCirc(h, k, rr)] },
        };
      },
    },
  };

  // ---------- Idea 5: parábola ----------
  // Cambia: p y el punto sobre la curva · Permanece: foco y directriz · Progresa: PF = PD ·
  // Se reserva: x² = 8y · Debe verse: cada punto equidista del foco y de la directriz.
  const parFig = (p, t, o = {}) => {
    const Pp = [t, t * t / (4 * p)], F = [0, p], D = [t, -p], curva = Array.from({ length: 61 }, (_, i) => { const x = -6 + 12 * i / 60; return [x, x * x / (4 * p)]; }).filter(q => q[1] <= 5.4);
    return Object.assign(plano(), {
      alt: o.alt || `Parábola x² = ${f(4 * p)}y con foco (0; ${f(p)}) y directriz y = −${f(p)}: el punto P está a ${f(Pp[1] + p)} de los dos`,
      puntos: [pt('F', F, { rotulo: 'F', color: 'o', lado: 160 }), pt('P', Pp, { rotulo: 'P', color: 'h', lado: 45, desde: o.p ?? 0 }), pt('D', D, { color: 'i', desde: o.p ?? 0 }), pt('d0', [-6, -p], { sinPunto: true }), pt('d1', [6, -p], { sinPunto: true, rotulo: o.dir ?? `y = −${f(p)}`, lado: 135 })],
      curvas: [{ puntos: curva, color: 'd', grosor: 'variable', desde: o.c ?? 0 }],
      segmentos: [{ de: 'd0', a: 'd1', color: 'i', grosor: 'variable' }, { de: 'P', a: 'F', color: 'h', marcas: 1, desde: o.p ?? 0 }, { de: 'P', a: 'D', color: 'h', marcas: 1, discontinua: true, desde: o.p ?? 0 }],
    });
  };
  const parIdea = {
    id: 'parabola',
    titulo: 'Equidistante de foco y directriz',
    temas: ['Parábola'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'F es el foco y la recta horizontal, la directriz. Mueve P por la curva: PF y PD son iguales. Cambia p.',
      voz: 'Mueve P. Compara las dos distancias rojas.',
      controles: [
        { id: 'p', etiqueta: 'p', min: 0.5, max: 2, paso: 0.5, inicio: 1, unidad: '', decimales: 1, color: 'c-o' },
        { id: 't', etiqueta: 'x de P', min: -4, max: 4, paso: 1, inicio: 2, unidad: '', decimales: 0, color: 'c-h' },
      ],
      dibujo: v => ({ datos: parFig(v.p, v.t), estado: {} }),
      lectura: v => { const y = v.t * v.t / (4 * v.p); return [`x² = ${f(4 * v.p)}y · P${P(v.t, y)}`, `PF = PD = ${f(y + v.p)}`]; },
      minimo: 4,
    },
    predice: {
      pregunta: '¿Dónde está el foco de la parábola x² = 8y?',
      voz: 'Compara con x² = 4py.',
      opciones: [
        { id: 'c', texto: '(0; 2)', correcta: true },
        { id: 'ocho', texto: '(0; 8)', error: 'GE-AN5', siFuera: '8 es 4p; el foco está a p = 2 del vértice.' },
        { id: 'eje', texto: '(2; 0)', error: 'GE-AN5', siFuera: 'Con x², la parábola abre hacia arriba: el foco está en el eje y.' },
        { id: 'dir', texto: '(0; −2)', error: 'GE-AN5', siFuera: 'y = −2 es la directriz; el foco está del lado de la curva.' },
      ],
      dibujo: { datos: parFig(2, 4, { p: 99, alt: 'Parábola x² = 8y con vértice en el origen' }), estado: {} },
      revelar: { datos: parFig(2, 4), estado: {} },
      coincide: 'Coincide: 4p = 8, p = 2. El punto (4; 2) está a 4 del foco y de la directriz.',
    },
    mira: {
      datos: parFig(2, 4),
      voz: 'La condición PF = PD se vuelve ecuación.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Foco (0; p) y directriz y = −p.', ecuacion: ['PF = PD'] },
        { estado: { corte: 0 }, texto: 'Escribe las dos distancias.', ecuacion: ['√(x² + (y − p)²) = y + p'] },
        { estado: { corte: 0 }, texto: 'Eleva al cuadrado y simplifica.', ecuacion: ['x² = 4py'] },
        { estado: { corte: 0 }, texto: 'Aquí 4p = 8.', ecuacion: ['p = 2: F(0; 2), directriz y = −2'] },
      ],
    },
    regla: {
      texto: 'La parábola reúne los puntos que están a igual distancia del foco y de la directriz. Con vértice en el origen:',
      ecuacion: ['x² = 4', { v: 'c-o', t: 'p' }, 'y: F(0; ', { v: 'c-o', t: 'p' }, '), directriz y = −', { v: 'c-o', t: 'p' }, '   ·   y² = 4', { v: 'c-o', t: 'p' }, 'x: F(', { v: 'c-o', t: 'p' }, '; 0), directriz x = −', { v: 'c-o', t: 'p' }],
      condicion: 'p ≠ 0. Si p < 0, abre hacia abajo o a la izquierda. Con vértice (h; k), x y y se trasladan.',
      voz: 'El foco está a p del vértice, hacia donde abre.',
    },
    ahoraTu: {
      voz: 'Iguala el coeficiente con 4p.',
      generar(s) {
        const r = azar(s), p = r.de([1, 2, 3, -1, -2, -3, 0.5, 4]), vert = s % 2 === 0, pide = s % 4 < 2 ? 'foco' : 'directriz';
        const ec = vert ? `x² = ${n(4 * p)}y` : `y² = ${n(4 * p)}x`;
        const ok = pide === 'foco' ? (vert ? P(0, p) : P(p, 0)) : (vert ? `y = ${n(-p)}` : `x = ${n(-p)}`);
        return {
          pregunta: [`¿Cuál es ${pide === 'foco' ? 'el foco' : 'la directriz'} de la parábola ${ec}?`],
          opciones: opcionesTxt(ok, pide === 'foco' ? [
            { id: '4p', texto: vert ? P(0, 4 * p) : P(4 * p, 0), error: 'GE-AN5', siFuera: 'Ese es 4p; el foco está a p.' },
            { id: 'eje', texto: vert ? P(p, 0) : P(0, p), error: 'GE-AN5', siFuera: 'Revisa qué variable está al cuadrado: el foco va en el eje de la otra.' },
            { id: 'signo', texto: vert ? P(0, -p) : P(-p, 0), error: 'GE-AN5', siFuera: 'El foco va hacia donde abre la parábola.' },
          ] : [
            { id: 'signo', texto: vert ? `y = ${n(p)}` : `x = ${n(p)}`, error: 'GE-AN5', siFuera: 'La directriz está del lado opuesto al foco.' },
            { id: '4p', texto: vert ? `y = ${n(-4 * p)}` : `x = ${n(-4 * p)}`, error: 'GE-AN5', siFuera: 'La directriz está a p del vértice, no a 4p.' },
            { id: 'eje', texto: vert ? `x = ${n(-p)}` : `y = ${n(-p)}`, error: 'GE-AN5', siFuera: 'Revisa hacia dónde abre: la directriz es perpendicular al eje.' },
          ]),
          solucion: { texto: `4p = ${n(4 * p)}, p = ${n(p)}.`, ecuacion: [pide === 'foco' ? `F = ${ok}` : `directriz ${ok}`] },
        };
      },
    },
  };

  // ---------- Idea 6: elipse ----------
  // Cambia: el punto sobre la elipse · Permanece: los focos y 2a · Progresa: PF₁ y PF₂ se reparten 2a ·
  // Se reserva: x²/25 + y²/9 = 1 · Debe verse: c² = a² − b², no a² + b².
  const elFig = (a, b, t, o = {}) => {
    const c = Math.sqrt(a * a - b * b), Pp = [a * Math.cos(U.rad(t)), b * Math.sin(U.rad(t))];
    return Object.assign(plano(), {
      alt: o.alt || `Elipse de semiejes ${f(a)} y ${f(b)} con focos en (±${f(c)}; 0): PF₁ + PF₂ = ${f(2 * a)} para todo P`,
      puntos: [pt('F1', [-c, 0], { rotulo: 'F₁', color: 'o', lado: 250, desde: o.f ?? 0 }), pt('F2', [c, 0], { rotulo: 'F₂', color: 'o', lado: 290, desde: o.f ?? 0 }), pt('P', Pp, { rotulo: 'P', color: 'h', lado: U.grados(Math.atan2(Pp[1], Pp[0])), desde: o.p ?? 0 }),
        pt('O', [0, 0], { sinPunto: true }), pt('B', [0, b], { sinPunto: true }), pt('A', [a, 0], { sinPunto: true })],
      curvas: [{ puntos: Array.from({ length: 73 }, (_, i) => [a * Math.cos(2 * Math.PI * i / 72), b * Math.sin(2 * Math.PI * i / 72)]), color: 'd', grosor: 'variable' }],
      segmentos: [{ de: 'P', a: 'F1', color: 'i', grosor: 'variable', desde: o.p ?? 0 }, { de: 'P', a: 'F2', color: 'd', grosor: 'variable', desde: o.p ?? 0 },
        ...(o.tri ? [{ de: 'F2', a: 'B', color: 'h', discontinua: true, texto: o.tri, desde: o.f ?? 0 }, { de: 'O', a: 'B', grosor: 'fino', texto: `${f(b)}`, lado: 1, desde: o.f ?? 0 }, { de: 'O', a: 'F2', grosor: 'fino', texto: 'c', lado: -1, desde: o.f ?? 0 }] : [])],
    });
  };
  const elIdea = {
    id: 'elipse',
    titulo: 'La suma que no cambia',
    temas: ['Elipse'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Elipse x²/25 + y²/9 = 1. Mueve P por la elipse y mira cómo se reparten PF₁ y PF₂.',
      voz: 'Mueve P. Una distancia crece y la otra baja. ¿Y la suma?',
      controles: [{ id: 't', etiqueta: 'P', min: 0, max: 330, paso: 30, inicio: 60, unidad: '°', decimales: 0, color: 'c-h' }],
      dibujo: v => ({ datos: elFig(5, 3, v.t), estado: {} }),
      lectura: v => { const Pp = [5 * Math.cos(U.rad(v.t)), 3 * Math.sin(U.rad(v.t))], d1 = Math.hypot(Pp[0] + 4, Pp[1]), d2 = Math.hypot(Pp[0] - 4, Pp[1]); return [`PF₁ = ${f(d1)} · PF₂ = ${f(d2)}`, `suma = ${f(d1 + d2)} = 2a`]; },
      minimo: 4,
    },
    predice: {
      pregunta: 'En la elipse x²/25 + y²/9 = 1, ¿a qué distancia del centro están los focos?',
      voz: 'Desde el extremo B del eje menor, la suma 2a se reparte en dos mitades.',
      opciones: [
        { id: 'c', texto: '4', correcta: true },
        { id: 'suma', texto: '√34', error: 'GE-AN5', siFuera: 'c² = a² + b² es de la hipérbola; en la elipse, c² = a² − b².' },
        { id: 'a', texto: '5', error: 'GE-AN5', siFuera: '5 es a, la distancia del centro al vértice.' },
        { id: 'b', texto: '3', error: 'GE-AN5', siFuera: '3 es b, el semieje menor.' },
      ],
      dibujo: { datos: elFig(5, 3, 60, { f: 99, p: 99, alt: 'Elipse x²/25 + y²/9 = 1' }), estado: {} },
      revelar: { datos: elFig(5, 3, 90, { tri: '5' }), estado: {} },
      coincide: 'Coincide: c = √(25 − 9) = 4.',
    },
    mira: {
      datos: elFig(5, 3, 90, { tri: '5', p: 1 }),
      voz: 'En el extremo B del eje menor, PF₁ = PF₂ = a.',
      pasos: [
        { estado: { corte: 0 }, texto: 'a² = 25 y b² = 9: a = 5 y b = 3.', ecuacion: ['2a = 10'] },
        { estado: { corte: 1 }, texto: 'En B, las dos distancias a los focos son iguales: 5 cada una.', ecuacion: ['BF₂ = a = 5'] },
        { estado: { corte: 1 }, texto: 'Triángulo rectángulo con catetos b y c.', ecuacion: ['c² = a² − b² = 25 − 9 = 16'] },
        { estado: { corte: 1 }, texto: 'Focos en (±4; 0).', ecuacion: ['c = 4'] },
      ],
    },
    regla: {
      texto: 'La elipse reúne los puntos cuya suma de distancias a dos focos es 2a. Con centro en el origen y eje mayor en x:',
      ecuacion: [frac('x²', [{ v: 'c-h', t: 'a' }, '²']), ' + ', frac('y²', 'b²'), ' = 1   ·   ', { v: 'c-o', t: 'c' }, '² = ', { v: 'c-h', t: 'a' }, '² − b²   ·   PF₁ + PF₂ = 2', { v: 'c-h', t: 'a' }],
      condicion: 'a > b > 0 y los focos están sobre el eje mayor. La excentricidad c/a está entre 0 y 1.',
      voz: 'En la elipse se resta: c² = a² − b².',
    },
    ahoraTu: {
      voz: 'Identifica a² (el mayor) y b².',
      generar(s) {
        const r = azar(s), [b, c, a] = r.de([[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [6, 8, 10], [8, 6, 10], [8, 15, 17]]), pide = s % 2 === 0 ? 'c' : 'e';
        const ec = `x²/${a * a} + y²/${b * b} = 1`;
        if (pide === 'c') return {
          pregunta: [`¿A qué distancia del centro están los focos de la elipse ${ec}?`],
          opciones: opcionesTxt(f(c), [
            { id: 'suma', texto: `√${a * a + b * b}`, error: 'GE-AN5', siFuera: 'En la elipse, c² = a² − b².' },
            { id: 'a', texto: f(a), error: 'GE-AN5', siFuera: 'Ese es a: llega al vértice.' },
            { id: 'resta', texto: f(a - b), error: 'GE19', siFuera: 'Se restan los cuadrados, no los semiejes.' },
          ]),
          solucion: { texto: `a = ${a}, b = ${b}.`, ecuacion: [`c = √(${a * a} − ${b * b}) = ${c}`] },
        };
        const g = (x, y) => (y ? g(y, x % y) : x), d = g(c, a);
        return {
          pregunta: [`¿Cuál es la excentricidad de la elipse ${ec}?`],
          opciones: opcionesTxt(`${c / d}/${a / d}`, [
            { id: 'inv', texto: `${a / d}/${c / d}`, error: 'GE-AN5', siFuera: 'La excentricidad de la elipse es menor que 1: c/a.' },
            { id: 'b', texto: `${b / g(b, a)}/${a / g(b, a)}`, error: 'GE-AN5', siFuera: 'Se usa c, no b: e = c/a.' },
            { id: 'ba', texto: `${c / g(c, b)}/${b / g(c, b)}`, error: 'GE-AN5', siFuera: 'Se divide entre a, el semieje mayor.' },
          ]),
          solucion: { texto: `c = √(${a * a} − ${b * b}) = ${c}.`, ecuacion: [`e = ${c}/${a}`] },
        };
      },
    },
  };

  return {
    unidad: 'geometria.geometria-analitica',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/geo-figura.js'],
    historia: {
      texto: 'En 1637, René Descartes publicó La Géométrie, donde problemas de rectas y curvas se resolvían con operaciones algebraicas. Una condición sobre distancias o posiciones podía escribirse como ecuación y estudiarse con álgebra. Su notación era distinta de la escolar de hoy, pero la idea de unir figura y ecuación cambió la geometría.',
      pregunta: '¿Cómo se vuelve ecuación una condición sobre distancias?',
      fuente: { titulo: 'J. J. O’Connor y E. F. Robertson, «René Descartes», MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Descartes/' },
    },
    ideas: [divIdea, rectaIdea, distIdea, circIdea, parIdea, elIdea],
  };
});
