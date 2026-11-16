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
  // Gesto directo (docs/teoria.md §4b): la manija vive en el viewBox de geo-figura; aPlano la vuelve coordenadas del
  // plano cartesiano y el lector ajusta cada valor al paso y al rango de su control. La vista fija evita saltos.
  const enPantalla = (datos, p) => G.aPantalla(datos, p);
  const alPlano = (datos, pt) => G.aPlano(datos, pt);
  const SEP = '   ·   ';
  const sq = (b, e = '2') => ({ sup: [b, e] });
  // Ángulo (en grados, de 0 a 360) del punto q sobre la elipse de semiejes a y b; cerca de 360 vuelve a 0.
  const vuelta = (q, a, b, paso) => { let g = U.grados(Math.atan2(q[1] / b, q[0] / a)); if (g < 0) g += 360; return g > 360 - paso / 2 ? g - 360 : g; };

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
      // Sin arrastre: la razón es un control de opciones (1 : 2, 2 : 1…) y A, B están fijos. El laboratorio sí mueve A y B.
      lectura: v => { const [m, k] = RAZ[v.raz]; return [`P = ${P((k * -4 + m * 4) / (m + k), (k * -2 + m * 4) / (m + k))}`, SEP, `AB = ${f(Math.hypot(8, 6))}`]; },
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
    // Hallazgo 9: «Mira» usa el mismo dibujo del juego (divFig), con el caso de la predicción: A(1; 2), B(7; 8), 1 : 2.
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
      ecuacion: ['d = ', { raiz: [sq('Δx'), ' + ', sq('Δy')] }, SEP, 'P = ', frac([{ v: 'c-i', t: 'n' }, ' · ', { v: 'c-o', t: 'A' }, ' + ', { v: 'c-o', t: 'm' }, ' · ', { v: 'c-i', t: 'B' }], { llave: ['m + n'], nota: 'partes en total', color: 'c-h' })],
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
      // Se agarra B: A queda fija y la recta gira y se inclina con B (si B cae sobre A, se corre a y = 0).
      arrastres: [{ id: 'punto-b', etiqueta: 'punto B', color: 'c-i',
        donde: v => enPantalla(rectaFig([-2, -1], [v.bx, 3]), [v.bx, v.by === -1 && v.bx === -2 ? 0 : v.by]),
        mover: pt => { const q = alPlano(rectaFig([-2, -1], [2, 3]), pt); return { bx: q[0], by: q[1] }; } }],
      lectura: v => {
        const by = v.by === -1 && v.bx === -2 ? 0 : v.by;
        if (v.bx === -2) return ['Δx = 0: recta vertical', SEP, 'sin pendiente, x = −2'];
        const m = fr(by + 1, v.bx + 2);
        return [`m = ${n(by + 1)} / ${n(v.bx + 2)} = ${m}`, SEP, by + 1 === 0 ? 'y = −1 (horizontal)' : m === '1' ? 'y + 1 = x + 2' : `y + 1 = ${m} · (x + 2)`];
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
    // Hallazgo 9: «Mira» parte del mismo dibujo del juego (rectaFig con A(−2; −1)), con B en (2; 1).
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
      ecuacion: ['m = ', frac({ llave: [{ v: 'c-i', t: 'y₂ − y₁' }], nota: 'lo que sube', color: 'c-i', arriba: true }, { llave: [{ v: 'c-o', t: 'x₂ − x₁' }], nota: 'lo que avanza', color: 'c-o' }), SEP, 'y − y₁ = m(x − x₁)'],
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
      // Se agarra P: la recta no se mueve y la perpendicular la sigue.
      arrastres: [{ id: 'punto-p', etiqueta: 'punto P', color: 'c-o',
        donde: v => enPantalla(distFig([v.x, v.y]), [v.x, v.y]),
        mover: (pt, v) => { const q = alPlano(distFig([v.x, v.y]), pt); return { x: q[0], y: q[1] }; } }],
      lectura: v => { const e = 3 * v.x + 4 * v.y - 12; return [`3·${n(v.x)} + 4·${n(v.y)} − 12 = ${n(e)}`, SEP, `d = |${n(e)}| / 5 = ${f(Math.abs(e) / 5)}`]; },
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
    // Hallazgo 9: «Mira» usa el dibujo del juego (distFig, la misma recta) con el P de la predicción.
    mira: {
      datos: distFig([0, -2], { d: '4', h: 1 }),
      voz: 'Reemplaza, toma valor absoluto y divide.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Reemplaza P en el lado izquierdo de la ecuación.', ecuacion: ['3 · 0 + 4 · (−2) − 12 = −20'] },
        { estado: { corte: 1 }, texto: 'El signo solo dice de qué lado está P. La distancia lo quita.', ecuacion: [{ llave: [{ abs: ['−20'] }], nota: 'sin signo', color: 'c-h' }, ' = 20'] },
        { estado: { corte: 1 }, texto: 'Divide entre el largo de (A; B).', ecuacion: ['d = ', frac('20', '√(3² + 4²)'), ' = 4'] },
      ],
    },
    regla: {
      texto: 'La distancia de P(x₀; y₀) a la recta Ax + By + C = 0 se mide por la perpendicular y vale:',
      ecuacion: [{ v: 'c-h', t: 'd' }, ' = ', frac({ llave: [{ abs: ['A', { v: 'c-o', t: 'x₀' }, ' + B', { v: 'c-o', t: 'y₀' }, ' + C'] }], nota: 'P reemplazado', color: 'c-o', arriba: true }, { raiz: [sq('A'), ' + ', sq('B')] })],
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
      // Se agarran el centro C (mueve h y k) y la punta del radio (mueve r: su distancia al centro).
      arrastres: [
        { id: 'centro', etiqueta: 'centro C', color: 'c-o',
          donde: v => enPantalla(circFig(v.h, v.k, v.r), [v.h, v.k]),
          mover: (pt, v) => { const q = alPlano(circFig(v.h, v.k, v.r), pt); return { h: q[0], k: q[1] }; } },
        { id: 'radio', etiqueta: 'punta del radio', color: 'c-i',
          donde: v => enPantalla(circFig(v.h, v.k, v.r), [v.h + v.r, v.k]),
          mover: (pt, v) => { const q = alPlano(circFig(v.h, v.k, v.r), pt); return { r: Math.hypot(q[0] - v.h, q[1] - v.k) }; } },
      ],
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
    // Hallazgo 9: «Mira» usa el dibujo del juego (circFig) con la circunferencia de la predicción, C(2; −3) y r = 4.
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
      ecuacion: [{ llave: [sq({ par: ['x − ', { v: 'c-o', t: 'h' }] }), ' + ', sq({ par: ['y − ', { v: 'c-o', t: 'k' }] })], nota: 'centro, signo cambiado', color: 'c-o' }, ' = ', { sup: [{ v: 'c-i', t: 'r' }, '2'] }],
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
      // Se agarran P, que corre por la curva (mueve su x), y el foco F, que sube o baja por el eje (mueve p).
      arrastres: [
        { id: 'punto-p', etiqueta: 'punto P de la parábola', color: 'c-h',
          donde: v => enPantalla(parFig(v.p, v.t), [v.t, Math.min(v.t * v.t / (4 * v.p), 5)]),
          mover: (pt, v) => ({ t: alPlano(parFig(v.p, v.t), pt)[0] }) },
        { id: 'foco', etiqueta: 'foco F', color: 'c-o',
          donde: v => enPantalla(parFig(v.p, v.t), [0, v.p]),
          mover: (pt, v) => ({ p: alPlano(parFig(v.p, v.t), pt)[1] }) },
      ],
      lectura: v => { const y = v.t * v.t / (4 * v.p); return [`x² = ${f(4 * v.p)}y`, SEP, `P${P(v.t, y)}`, SEP, `PF = PD = ${f(y + v.p)}`]; },
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
    // Hallazgo 9: «Mira» usa el dibujo del juego (parFig) con la parábola de la predicción, x² = 8y.
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
      ecuacion: [sq('x'), ' = 4', { v: 'c-o', t: 'p' }, 'y: ', { llave: ['F(0; ', { v: 'c-o', t: 'p' }, ')'], nota: 'el foco', color: 'c-o' }, ', ', { llave: ['y = −', { v: 'c-o', t: 'p' }], nota: 'la directriz', color: 'c-i' }, SEP, sq('y'), ' = 4', { v: 'c-o', t: 'p' }, 'x: F(', { v: 'c-o', t: 'p' }, '; 0), x = −', { v: 'c-o', t: 'p' }],
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
      // Se agarra P y se lleva alrededor de la elipse: su ángulo sale de atan2 con los semiejes 5 y 3.
      arrastres: [{ id: 'punto-p', etiqueta: 'punto P de la elipse', color: 'c-h',
        donde: v => enPantalla(elFig(5, 3, v.t), [5 * Math.cos(U.rad(v.t)), 3 * Math.sin(U.rad(v.t))]),
        mover: (pt, v) => ({ t: vuelta(alPlano(elFig(5, 3, v.t), pt), 5, 3, 30) }) }],
      lectura: v => { const Pp = [5 * Math.cos(U.rad(v.t)), 3 * Math.sin(U.rad(v.t))], d1 = Math.hypot(Pp[0] + 4, Pp[1]), d2 = Math.hypot(Pp[0] - 4, Pp[1]); return [`PF₁ = ${f(d1)}`, SEP, `PF₂ = ${f(d2)}`, SEP, `suma = ${f(d1 + d2)} = 2a`]; },
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
    // Hallazgo 9: «Mira» usa el dibujo del juego (elFig, la misma elipse) con P en el extremo B del eje menor.
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
      ecuacion: [frac(sq('x'), sq({ v: 'c-h', t: 'a' })), ' + ', frac(sq('y'), sq('b')), ' = 1', SEP, { llave: [sq({ v: 'c-o', t: 'c' }), ' = ', sq({ v: 'c-h', t: 'a' }), ' − ', sq('b')], nota: 'c: centro–foco', color: 'c-o' }, SEP, 'PF₁ + PF₂ = ', { llave: ['2', { v: 'c-h', t: 'a' }], nota: 'suma fija', color: 'c-h' }],
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

  // ---------- Laboratorio: juego libre, sin preguntas ----------
  // Mesa 1, más rica que la idea 1: A y B se arrastran y la razón m : n es libre (de 1 a 5 cada parte), no solo
  // cinco razones fijas. Deja ver que P siempre queda del lado del extremo con el número más chico de su tramo.
  const repartoFig = (A, B, m, k) => divFig(A, B, m, k, { ta: `${m}`, tb: `${k}`, alt: `A${P(...A)} y B${P(...B)}; P divide AB en razón ${m} : ${k} y queda en ${P((k * A[0] + m * B[0]) / (m + k), (k * A[1] + m * B[1]) / (m + k))}` });
  // Pesos cruzados: P = (n · A + m · B)/(m + n), y AB por Pitágoras.
  const reparto = v => ({ P: [(v.k * v.ax + v.m * v.bx) / (v.m + v.k), (v.k * v.ay + v.m * v.by) / (v.m + v.k)], AB: Math.hypot(v.bx - v.ax, v.by - v.ay) });
  // Extremos de la mesa, calculados con sus rangos: la menor fracción del camino m/(m + n) y el AB más largo.
  const REPARTO_MIN = (() => { let q = 1; for (let m = 1; m <= 5; m++) for (let k = 1; k <= 5; k++) q = Math.min(q, m / (m + k)); return q; })();
  const REPARTO_AB_MAX = Math.hypot(5 - -5, 4 - -4);
  const mesaReparto = {
    id: 'reparto-libre', titulo: 'Segmento con reparto libre', pieza: 'geo-figura',
    consigna: 'Arrastra A y B por el plano cartesiano. Cambia m y n. Mira hacia qué extremo se corre P y cuánto mide AB.',
    controles: [
      { id: 'ax', etiqueta: 'x de A', min: -5, max: 5, paso: 1, inicio: -4, unidad: '', decimales: 0, color: 'c-o' },
      { id: 'ay', etiqueta: 'y de A', min: -4, max: 4, paso: 1, inicio: -3, unidad: '', decimales: 0, color: 'c-o' },
      { id: 'bx', etiqueta: 'x de B', min: -5, max: 5, paso: 1, inicio: 4, unidad: '', decimales: 0, color: 'c-i' },
      { id: 'by', etiqueta: 'y de B', min: -4, max: 4, paso: 1, inicio: 3, unidad: '', decimales: 0, color: 'c-i' },
      { id: 'm', etiqueta: 'm (tramo AP)', min: 1, max: 5, paso: 1, inicio: 1, unidad: '', decimales: 0, color: 'c-o' },
      { id: 'k', etiqueta: 'n (tramo PB)', min: 1, max: 5, paso: 1, inicio: 2, unidad: '', decimales: 0, color: 'c-i' },
    ],
    dibujo: v => ({ datos: repartoFig([v.ax, v.ay], [v.bx, v.by], v.m, v.k), estado: {} }),
    // Se agarran los dos extremos; P se recalcula con los pesos cruzados.
    arrastres: [
      { id: 'punto-a', etiqueta: 'extremo A', color: 'c-o',
        donde: v => enPantalla(repartoFig([v.ax, v.ay], [v.bx, v.by], v.m, v.k), [v.ax, v.ay]),
        mover: (pt, v) => { const q = alPlano(repartoFig([v.ax, v.ay], [v.bx, v.by], v.m, v.k), pt); return { ax: q[0], ay: q[1] }; } },
      { id: 'punto-b', etiqueta: 'extremo B', color: 'c-i',
        donde: v => enPantalla(repartoFig([v.ax, v.ay], [v.bx, v.by], v.m, v.k), [v.bx, v.by]),
        mover: (pt, v) => { const q = alPlano(repartoFig([v.ax, v.ay], [v.bx, v.by], v.m, v.k), pt); return { bx: q[0], by: q[1] }; } },
    ],
    lectura: v => { const R = reparto(v); return [`${v.m} : ${v.k}`, SEP, `P = ${P(...R.P)}`, SEP, `AB ≈ ${f(R.AB)}`]; },
    // Retos: se comprueban con reparto(), la misma cuenta de la lectura (pesos cruzados y Pitágoras).
    invitaciones: [
      { texto: 'Haz que P caiga justo en el origen, con A y B distintos.',
        logrado: v => { const R = reparto(v); return R.AB > 0 && Math.abs(R.P[0]) < 1e-9 && Math.abs(R.P[1]) < 1e-9; },
        bien: 'El origen reparte AB en la razón que elegiste. ¿Funciona con otra razón?' },
      { texto: 'Haz que P caiga en un cruce de la cuadrícula sin ser el punto medio.',
        logrado: v => { const R = reparto(v); return R.AB > 0 && v.m !== v.k && Number.isInteger(+R.P[0].toFixed(9)) && Number.isInteger(+R.P[1].toFixed(9)); },
        bien: 'Coordenadas enteras: cada avance de A a B se partió en m + n partes exactas.' },
      { texto: 'Lleva P lo más cerca de A que permitan m y n.',
        logrado: v => reparto(v).AB > 0 && v.m / (v.m + v.k) === REPARTO_MIN,
        bien: 'Con 1 : 5, P avanza solo un sexto: B lleva el peso chico.' },
      { texto: 'Estira AB todo lo que permite la mesa.',
        logrado: v => Math.abs(reparto(v).AB - REPARTO_AB_MAX) < 1e-9,
        bien: 'De esquina a esquina: √(10² + 8²). Pitágoras con los avances.' },
    ],
  };

  // Mesa 2: junta las ideas 2 y 3. La recta pasa por A y B, los dos libres (también vertical u horizontal), y P mide
  // su distancia por la perpendicular. Ninguna idea deja mover la recta y el punto a la vez.
  const MARCO = { x: [-6, 6], y: [-5, 5] };
  const recorte = (A, B) => {
    const dx = B[0] - A[0], dy = B[1] - A[1], dentro = q => q[0] >= MARCO.x[0] - 1e-9 && q[0] <= MARCO.x[1] + 1e-9 && q[1] >= MARCO.y[0] - 1e-9 && q[1] <= MARCO.y[1] + 1e-9;
    const ts = [];
    if (dx) for (const x of MARCO.x) ts.push((x - A[0]) / dx);
    if (dy) for (const y of MARCO.y) ts.push((y - A[1]) / dy);
    const qs = ts.map(t => [A[0] + t * dx, A[1] + t * dy]).filter(dentro).sort((u, w) => u[0] - w[0] || u[1] - w[1]);
    return [qs[0], qs[qs.length - 1]];
  };
  const rectaPunto = (A, B, Q) => {
    const dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy);
    if (L === 0) return Object.assign(plano(), {
      alt: `A y B coinciden en ${P(...A)}: no definen una recta`,
      puntos: [pt('A', A, { rotulo: 'A = B', color: 'd', lado: 225 }), pt('Q', Q, { rotulo: 'P', color: 'o', lado: 135 })],
    });
    const t = ((Q[0] - A[0]) * dx + (Q[1] - A[1]) * dy) / (L * L), H = [A[0] + t * dx, A[1] + t * dy], d = Math.abs(dx * (Q[1] - A[1]) - dy * (Q[0] - A[0])) / L, [e0, e1] = recorte(A, B);
    const lejos = d > 1e-9;
    return Object.assign(plano(), {
      alt: `Recta por A${P(...A)} y B${P(...B)}; el punto P${P(...Q)} está a ${f(d)} de ella, medido por la perpendicular`,
      puntos: [pt('A', A, { rotulo: 'A', color: 'd', lado: 225 }), pt('B', B, { rotulo: 'B', color: 'd', lado: 45 }), pt('Q', Q, { rotulo: 'P', color: 'o', lado: 135 }),
        pt('H', H, { color: 'h', sinPunto: !lejos }), pt('e0', e0, { sinPunto: true }), pt('e1', e1, { sinPunto: true })],
      segmentos: [{ de: 'e0', a: 'e1', color: 'd', grosor: 'variable' }, ...(lejos ? [{ de: 'Q', a: 'H', color: 'h', grosor: 'variable', texto: f(d) }] : [])],
      angulos: lejos ? [{ en: 'H', de: 'Q', a: U.dist(H, e1) > 0.5 ? 'e1' : 'e0', color: 'h' }] : [],
    });
  };
  // Avances de A a B, su largo y la distancia de P a la recta AB (la misma cuenta de rectaPunto).
  const medirRecta = v => { const dx = v.bx - v.ax, dy = v.by - v.ay, L = Math.hypot(dx, dy); return { dx, dy, L, d: L ? Math.abs(dx * (v.py - v.ay) - dy * (v.px - v.ax)) / L : NaN }; };
  // La mayor pendiente no vertical de la mesa: todo el alto de y en un solo paso de x.
  const RECTA_M_MAX = (4 - -4) / 1;
  const mesaRecta = {
    id: 'recta-y-punto', titulo: 'Recta y punto libres', pieza: 'geo-figura',
    consigna: 'Arrastra A y B para mover la recta, y P para alejarlo. Prueba una recta vertical y P sobre la recta.',
    controles: [
      { id: 'ax', etiqueta: 'x de A', min: -5, max: 5, paso: 1, inicio: -4, unidad: '', decimales: 0, color: 'c-d' },
      { id: 'ay', etiqueta: 'y de A', min: -4, max: 4, paso: 1, inicio: -2, unidad: '', decimales: 0, color: 'c-d' },
      { id: 'bx', etiqueta: 'x de B', min: -5, max: 5, paso: 1, inicio: 4, unidad: '', decimales: 0, color: 'c-d' },
      { id: 'by', etiqueta: 'y de B', min: -4, max: 4, paso: 1, inicio: 2, unidad: '', decimales: 0, color: 'c-d' },
      { id: 'px', etiqueta: 'x de P', min: -5, max: 5, paso: 1, inicio: -1, unidad: '', decimales: 0, color: 'c-o' },
      { id: 'py', etiqueta: 'y de P', min: -4, max: 4, paso: 1, inicio: 3, unidad: '', decimales: 0, color: 'c-o' },
    ],
    dibujo: v => ({ datos: rectaPunto([v.ax, v.ay], [v.bx, v.by], [v.px, v.py]), estado: {} }),
    // Se agarran A y B (la recta) y P (el punto); la vista es fija, así que cualquier dato sirve para convertir.
    arrastres: [['punto-a', 'punto A de la recta', 'c-d', 'ax', 'ay'], ['punto-b', 'punto B de la recta', 'c-d', 'bx', 'by'], ['punto-p', 'punto P', 'c-o', 'px', 'py']].map(([id, etiqueta, color, cx, cy]) => ({
      id, etiqueta, color,
      donde: v => enPantalla(plano(), [v[cx], v[cy]]),
      mover: pt => { const q = alPlano(plano(), pt); return { [cx]: q[0], [cy]: q[1] }; },
    })),
    lectura: v => {
      const dx = v.bx - v.ax, dy = v.by - v.ay, L = Math.hypot(dx, dy);
      if (L === 0) return ['A y B coinciden: no hay recta'];
      const d = Math.abs(dx * (v.py - v.ay) - dy * (v.px - v.ax)) / L;
      return [dx === 0 ? `vertical, x = ${n(v.ax)}` : `m = ${fr(dy, dx)}`, SEP, { v: 'c-h', t: 'd' }, ` = ${f(d)}${d < 1e-9 ? ': P está en la recta' : ''}`];
    },
    // Retos: se comprueban con medirRecta(), las mismas cuentas de la lectura y del dibujo (rectaPunto).
    invitaciones: [
      { texto: 'Haz una recta vertical. ¿Qué le pasa a la pendiente?',
        logrado: v => { const R = medirRecta(v); return R.L > 0 && R.dx === 0; },
        bien: 'Δx = 0: no hay división posible. La recta es x = k, sin pendiente.' },
      { texto: 'Pon P justo a 5 de la recta.',
        logrado: v => { const R = medirRecta(v); return R.L > 0 && Math.abs(R.d - 5) < 1e-9; },
        bien: 'La distancia va por la perpendicular. ¿Encuentras otro P a 5?' },
      { texto: 'Arma la recta de mayor pendiente positiva que no sea vertical.',
        logrado: v => { const R = medirRecta(v); return R.L > 0 && R.dx !== 0 && R.dy / R.dx === RECTA_M_MAX; },
        bien: 'Sube 8 por cada 1 que avanza. Un paso más y sería vertical.' },
      { texto: 'Pon P sobre la recta, lejos de A y de B.',
        logrado: v => { const R = medirRecta(v); return R.L > 0 && R.d < 1e-9 && (v.px !== v.ax || v.py !== v.ay) && (v.px !== v.bx || v.py !== v.by); },
        bien: 'Distancia 0: P cumple la ecuación de la recta.' },
      { texto: 'Guarda dos rectas paralelas que no sean la misma.',
        logrado: (v, guardados) => { const R = medirRecta(v); return R.L > 0 && guardados.some(g => { const S = medirRecta(g); return S.L > 0
          && R.dx * S.dy - R.dy * S.dx === 0 && R.dx * (g.ay - v.ay) - R.dy * (g.ax - v.ax) !== 0; }); },
        bien: 'Misma pendiente, otro lugar: las paralelas nunca se cortan.' },
    ],
  };

  // Mesa 3: la elipse con semiejes libres. La idea 6 fija a = 5 y b = 3; aquí, si b pasa a a, los focos saltan al eje y,
  // y con a = b es una circunferencia (c = 0). El caso raro que la idea no deja probar.
  const elipseLibre = (a, b, t) => {
    const M = Math.max(a, b), c = Math.sqrt(Math.abs(a * a - b * b)), enX = a >= b, F1 = enX ? [-c, 0] : [0, -c], F2 = enX ? [c, 0] : [0, c];
    const Pp = [a * Math.cos(U.rad(t)), b * Math.sin(U.rad(t))];
    return Object.assign(plano(), {
      alt: `Elipse de semiejes ${f(a)} en x y ${f(b)} en y, focos a ${f(c)} del centro${c === 0 ? ' (coinciden: es una circunferencia)' : enX ? ' sobre el eje x' : ' sobre el eje y'}; PF₁ + PF₂ = ${f(2 * M)}`,
      puntos: [pt('F1', F1, { rotulo: c === 0 ? 'F' : 'F₁', color: 'o', lado: enX ? 250 : 200 }), pt('F2', F2, { rotulo: 'F₂', color: 'o', lado: enX ? 290 : 160, sinPunto: c === 0, hueco: false }),
        pt('P', Pp, { rotulo: 'P', color: 'h', lado: U.grados(Math.atan2(Pp[1], Pp[0])) }), pt('A', [-a, 0], { color: 'h' }), pt('B', [0, -b], { color: 'i' })],
      curvas: [{ puntos: Array.from({ length: 73 }, (_, i) => [a * Math.cos(2 * Math.PI * i / 72), b * Math.sin(2 * Math.PI * i / 72)]), color: 'd', grosor: 'variable' }],
      segmentos: [{ de: 'P', a: 'F1', color: 'i', grosor: 'variable' }, ...(c === 0 ? [] : [{ de: 'P', a: 'F2', color: 'd', grosor: 'variable' }])],
    });
  };
  // Distancia centro–foco, eje de los focos y excentricidad c / (semieje mayor) de la elipse de la mesa.
  const focos = v => { const c = Math.sqrt(Math.abs(v.a * v.a - v.b * v.b)); return { c, enX: v.a >= v.b, e: c / Math.max(v.a, v.b) }; };
  // La mayor excentricidad de la mesa, buscada en la grilla de los dos semiejes.
  const ELIPSE_E_MAX = (() => { let m = 0; for (let a = 1; a <= 5.5; a += 0.5) for (let b = 1; b <= 4.5; b += 0.5) m = Math.max(m, focos({ a, b }).e); return m; })();
  const mesaElipse = {
    id: 'elipse-libre', titulo: 'Elipse con semiejes libres', pieza: 'geo-figura',
    consigna: 'Arrastra P por la curva y los vértices para cambiar a y b. Haz b mayor que a, y luego iguales.',
    controles: [
      { id: 'a', etiqueta: 'semieje en x', min: 1, max: 5.5, paso: 0.5, inicio: 5, unidad: '', decimales: 1, color: 'c-h' },
      { id: 'b', etiqueta: 'semieje en y', min: 1, max: 4.5, paso: 0.5, inicio: 3, unidad: '', decimales: 1, color: 'c-i' },
      { id: 't', etiqueta: 'P', min: 0, max: 345, paso: 15, inicio: 60, unidad: '°', decimales: 0, color: 'c-h' },
    ],
    dibujo: v => ({ datos: elipseLibre(v.a, v.b, v.t), estado: {} }),
    // Se agarran P (corre por la curva), el vértice izquierdo (mueve a) y el de abajo (mueve b): del lado opuesto al
    // inicio de P, para que las manijas no se encimen.
    arrastres: [
      { id: 'punto-p', etiqueta: 'punto P de la elipse', color: 'c-h',
        donde: v => enPantalla(plano(), [v.a * Math.cos(U.rad(v.t)), v.b * Math.sin(U.rad(v.t))]),
        mover: (pt, v) => ({ t: vuelta(alPlano(plano(), pt), v.a, v.b, 15) }) },
      { id: 'vertice-x', etiqueta: 'vértice en el eje x', color: 'c-h',
        donde: v => enPantalla(plano(), [-v.a, 0]),
        mover: pt => ({ a: -alPlano(plano(), pt)[0] }) },
      { id: 'vertice-y', etiqueta: 'vértice en el eje y', color: 'c-i',
        donde: v => enPantalla(plano(), [0, -v.b]),
        mover: pt => ({ b: -alPlano(plano(), pt)[1] }) },
    ],
    lectura: v => {
      const Pp = [v.a * Math.cos(U.rad(v.t)), v.b * Math.sin(U.rad(v.t))], c = Math.sqrt(Math.abs(v.a * v.a - v.b * v.b)), enX = v.a >= v.b;
      const F = enX ? [c, 0] : [0, c], s = Math.hypot(Pp[0] - F[0], Pp[1] - F[1]) + Math.hypot(Pp[0] + F[0], Pp[1] + F[1]);
      return [{ v: 'c-o', t: 'c' }, ` = ${f(c)}${c === 0 ? ' (circunferencia)' : enX ? ' en x' : ' en y'}`, SEP, `PF₁ + PF₂ = ${f(s)}`];
    },
    // Retos: se comprueban con focos(), la misma cuenta de la lectura (c² = a² − b² con el eje mayor que toque).
    invitaciones: [
      { texto: 'Haz que los dos focos se junten en el centro. ¿Qué curva queda?',
        logrado: v => focos(v).c === 0,
        bien: 'c = 0: todos los puntos a la misma distancia del centro. Una circunferencia.' },
      { texto: 'Arma una elipse con los focos a 3 del centro.',
        logrado: v => Math.abs(focos(v).c - 3) < 1e-9,
        bien: 'Semiejes 5 y 4: c² = 25 − 16 = 9. Se resta, no se suma.' },
      { texto: 'Haz que los focos salten al eje vertical.',
        logrado: v => focos(v).c > 0 && !focos(v).enX,
        bien: 'Los focos van siempre sobre el eje mayor, ahora el vertical.' },
      { texto: 'Arma la elipse más achatada que permite la mesa.',
        logrado: v => Math.abs(focos(v).e - ELIPSE_E_MAX) < 1e-9,
        bien: 'Excentricidad casi 1: los focos se van hacia los vértices.' },
      { texto: 'Guarda dos elipses de distinto tamaño con los mismos focos.',
        logrado: (v, guardados) => focos(v).c > 0 && guardados.some(g => g.a !== v.a && focos(g).enX === focos(v).enX && Math.abs(focos(g).c - focos(v).c) < 1e-9),
        bien: 'Mismos focos, otra suma 2a: elipses una dentro de otra.' },
    ],
  };

  return {
    unidad: 'geometria.geometria-analitica',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/geo-figura.js'],
    historia: {
      texto: 'En 1637, René Descartes publicó La Géométrie, donde problemas de rectas y curvas se resolvían con operaciones algebraicas. Una condición sobre distancias o posiciones podía escribirse como ecuación y estudiarse con álgebra. Su notación era distinta de la escolar de hoy, pero la idea de unir figura y ecuación cambió la geometría.',
      pregunta: '¿Cómo se vuelve ecuación una condición sobre distancias?',
      fuente: { titulo: 'J. J. O’Connor y E. F. Robertson, «René Descartes», MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Descartes/' },
    },
    // Glosario: las palabras que este tema estrena en el curso (docs/teoria.md, 4d). Los ejemplos salen de los casos
    // de las ideas y se comprobaron con node.
    glosario: [
      { termino: 'plano cartesiano', formas: ['plano cartesiano', 'planos cartesianos'],
        def: 'Plano con dos rectas numeradas perpendiculares, los ejes x e y; cada punto queda nombrado por un par (x; y).',
        ejemplo: '(3; −2): 3 a la derecha del origen y 2 hacia abajo.', ver: ['coordenadas'] },
      { termino: 'pesos cruzados', def: 'Para dividir AB en razón m : n, A lleva el peso n y B el peso m.',
        ejemplo: 'A(1; 2), B(7; 8), razón 1 : 2: P = (2·A + 1·B)/3 = (3; 4).', ver: ['punto medio', 'razón'] },
      { termino: 'pendiente', simbolo: 'm', def: 'Cuánto sube una recta por cada unidad que avanza hacia la derecha: Δy entre Δx. La recta vertical no tiene.',
        ejemplo: 'De (−2; −1) a (2; 1): m = 2/4 = 1/2.' },
      { termino: 'valor absoluto', def: 'Un número sin su signo: su distancia al cero. Por eso nunca es negativo.',
        ejemplo: '|−20| = 20 y |20| = 20.' },
      { termino: 'completar cuadrados', formas: ['completar cuadrados', 'completa cuadrados', 'completan cuadrados', 'completa cada cuadrado'],
        def: 'Sumar a x² + bx el número (b/2)² para que quede un binomio al cuadrado: (x + b/2)².',
        ejemplo: 'x² − 4x + 4 = (x − 2)².', ver: ['forma general'] },
      { termino: 'forma general', def: 'Ecuación desarrollada e igualada a cero: x² + y² + Dx + Ey + F = 0.', ver: ['completar cuadrados'] },
      { termino: 'parábola', def: 'Curva cuyos puntos están a igual distancia de un punto, el foco, y de una recta, la directriz.',
        ejemplo: 'x² = 8y: foco (0; 2) y directriz y = −2.', ver: ['foco', 'directriz'] },
      { termino: 'foco', def: 'Punto fijo que define la curva: la parábola tiene uno y la elipse, dos, sobre su eje mayor.',
        ejemplo: 'x²/25 + y²/9 = 1: focos en (±4; 0).', ver: ['parábola', 'elipse'] },
      { termino: 'directriz', def: 'Recta fija de la parábola: cada punto de la curva está tan lejos de ella como del foco.',
        ejemplo: 'x² = 8y: directriz y = −2.', ver: ['parábola'] },
      { termino: 'elipse', def: 'Curva cerrada en la que la suma de distancias de cada punto a dos focos es siempre 2a.',
        ejemplo: 'x²/25 + y²/9 = 1: PF₁ + PF₂ = 10 para todo punto P.', ver: ['foco', 'semieje', 'excentricidad'] },
      { termino: 'semieje', formas: ['semieje', 'semiejes'], def: 'Mitad de un eje de la elipse: va del centro a un vértice. Se llaman a y b.',
        ejemplo: 'x²/25 + y²/9 = 1: semiejes a = 5 y b = 3.', ver: ['eje mayor', 'eje menor'] },
      { termino: 'eje mayor', def: 'El segmento más largo que cruza la elipse por su centro; mide 2a y contiene a los focos.', ver: ['eje menor'] },
      { termino: 'eje menor', def: 'Segmento que cruza la elipse por su centro, perpendicular al más largo; mide 2b.', ver: ['eje mayor'] },
      { termino: 'excentricidad', simbolo: 'e', def: 'Cociente c/a entre la distancia centro–foco y el semieje mayor: dice qué tan achatada es la elipse.',
        ejemplo: 'x²/25 + y²/9 = 1: c = 4 y e = 4/5.', ver: ['elipse'] },
      { termino: 'hipérbola', def: 'Curva en la que la diferencia, sin signo, de las distancias de cada punto a dos focos es fija.',
        ver: ['elipse', 'foco'] },
    ],
    // Laboratorio: el reparto libre, la recta con el punto y la elipse con semiejes libres son más ricos que sus ideas.
    laboratorio: [mesaReparto, mesaRecta, mesaElipse],
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea). Una lista vacía:
    // la mesa no practica ninguna idea de la unidad y va en «Más mesas del tema».
    laboratorioIdeas: {
      'reparto-libre': ['distancia-y-division'],
      'recta-y-punto': ['distancia-punto-recta'],
      'elipse-libre': ['elipse'],
    },
    ideas: [divIdea, rectaIdea, distIdea, circIdea, parIdea, elIdea],
  };
});
