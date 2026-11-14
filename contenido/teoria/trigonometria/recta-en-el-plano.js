/*
 * Teoría de «Plano cartesiano y la recta» (trigonometria.recta-en-el-plano), 4.º de secundaria.
 * Fuente del contenido: docs/teoria/matriz/trigonometria.json (unidad 5) y docs/teoria/fuentes/historia-ecuaciones.pdf
 * (pp. 86–87). Forma: angulo-trigonometrico.js.
 * Compañera: Mara (coneja), cercana y rigurosa: primero las diferencias de coordenadas, con su signo; después la fórmula.
 * Colores (regla 4): el avance horizontal Δx en turquesa (c-i), la subida Δy en rojo (c-h), las distancias y las
 * áreas que se miden (d, A) en verde (c-d) y la pendiente m con su inclinación θ en naranja (c-o; la recta cuya
 * pendiente se estudia también va en naranja).
 * Ronda 2 (14 nov, noche): manijas en las seis ideas (el punto B, el vértice C, la punta del avance y la subida,
 * el corte b y un punto de la recta, y un punto de la recta naranja que gira), llaves en las reglas, separadores
 * «   ·   » entre relaciones y laboratorio de tres mesas. Las seis ideas usan la misma pieza en «Juega» y en «Mira»;
 * los datos de «Mira» son otro caso de la misma figura (hallazgo 9: ver el comentario de cada mira).
 * Errores: ninguno documentado en docs/investigacion/ para esta unidad. Hipótesis de distractor (sin medir):
 * DIST-SUMA, DIST-SIN-RAIZ, DIST-SIGNO, DIV-PESOS, DIV-MEDIO, DIV-TERCIO, AREA-MITAD, AREA-SIN-ABS, AREA-CAJA,
 * BAR-MITAD, BAR-SUMA, BAR-MEDIO-LADO, PEND-VERT-CERO, PEND-SOLO-DY, PEND-INFINITO, PEND-INVERSA, PEND-SIGNO,
 * INCL-NEGATIVA, INCL-COMPLEMENTO, ECU-B-PUNTO, ECU-INVIERTE, ECU-SIGNO, ECU-M-GENERAL, PAR-PERP, PERP-INVERSA,
 * PERP-SIGNO, DIST-SIN-NORMA, DIST-SUMA-COEF, DIST-CORTE. PERP-HORIZONTAL es el error objetivo de la matriz
 * («usar −1/m con una recta horizontal sin tratar la vertical»): va en la condición de la idea 6 y en su Ahora tú.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: en el plano, distancias, áreas y rectas salen de diferencias de coordenadas con signo.
 *   Persona y condiciones: postulante de 4.º, celular de 360 px de gama baja, con o sin conexión, en el aula o en casa.
 *   Resultado observable: calcula distancia, punto de división, baricentro, área, pendiente, ecuación de una recta,
 *     paralelas, perpendiculares y distancia de un punto a una recta.
 *   Orden de atención: 1.º los dos puntos · 2.º el avance y la subida · 3.º lo que se calcula · acción: mover un punto o la pendiente.
 *   Estados: juego sin tocar · probando · predicción pendiente · coincide / no coincide · paso de «Mira» · caso nuevo.
 *   Duda que resuelve: ¿por qué la pendiente de una recta vertical no es un número, y por qué el área lleva valor absoluto?
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (x, dd = 2) => Kit.formatear(x, dd);
  const dx = { v: 'c-i', t: 'Δx' }, dy = { v: 'c-h', t: 'Δy' }, d = { v: 'c-d', t: 'd' }, A = { v: 'c-d', t: 'A' };
  const m = { v: 'c-o', t: 'm' }, th = { v: 'c-o', t: 'θ' };
  const sub = (x, i) => ({ sub: [x, i] }), cuad = x => ({ sup: [x, '2'] });
  const GRA = 180 / Math.PI;
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const P = (x, y) => `(${f(x)}; ${f(y)})`;
  // y = mx + b escrita sin «1x» ni «0x»: y = x − 1, y = −2.
  const ecRecta = (mm, bb) => {
    const t = mm === 0 ? '' : `${mm === 1 ? '' : mm === -1 ? '−' : f(mm)}x`;
    return `y = ${t}${t ? (bb ? ` ${bb < 0 ? '−' : '+'} ${f(Math.abs(bb))}` : '') : f(bb)}`;
  };
  const par = v => (v < 0 ? `(${f(v)})` : f(v));
  const menos = (letra, v) => (v === 0 ? letra : `${letra} ${v < 0 ? '+' : '−'} ${f(Math.abs(v))}`);
  // Fracción exacta p/q simplificada, con el signo adelante.
  const fr = (p, q) => { if (q < 0) { p = -p; q = -q; } const g = gcd(p, q) || 1; return q / g === 1 ? f(p / g) : `${p < 0 ? '−' : ''}${Math.abs(p / g)}/${q / g}`; };
  // Raíz exacta: √n simplificada como k√r.
  function raiz(n) {
    let k = 1, r = n;
    for (let i = Math.floor(Math.sqrt(n)); i > 1; i--) if (n % (i * i) === 0) { k = i; r = n / (i * i); break; }
    return r === 1 ? `${k}` : `${k === 1 ? '' : k}√${r}`;
  }
  function azar(sem) {
    let q = (sem * 2654435761 + 12345) >>> 0;
    const rr = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    rr.ent = (lo, hi) => lo + Math.floor(rr() * (hi - lo + 1));
    rr.uno = xs => xs[Math.floor(rr() * xs.length)];
    rr.sg = () => (rr() < 0.5 ? -1 : 1);
    return rr;
  }
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const x of distractores) {
      if (typeof x.valor === 'number' && !Number.isFinite(x.valor)) continue;
      const txt = fmt(x.valor);
      if (vistos.has(txt)) continue;
      vistos.add(txt);
      ops.push({ id: x.id, texto: txt, error: x.error, siFuera: x.siFuera });
    }
    return ops.slice(0, 4);
  }

  // Gesto directo (docs/teoria.md §4b): las manijas usan la geometría de la pieza (enPx y delPx).
  const TP = () => Kit.piezas['trig-plano'];
  const aPx = (dat, x, y) => TP().enPx(dat, x, y), dePx = (dat, pt) => TP().delPx(dat, pt);
  // Plano cuadriculado de la unidad (una sola escala) y una recta y = mx + b (o x = k) recortada a la ventana.
  const VEN = { x: [-6, 6], y: [-6, 6] };
  const plano = (o = {}) => Object.assign({ ventana: o.ventana || VEN, numeros: o.numeros === undefined ? 1 : o.numeros, segmentos: [], puntos: [], rotulos: [] }, o.extra || {});
  function recta(mv, bv, ven = VEN, o = {}) {
    if (mv === null) return Object.assign({ de: [bv, ven.y[0]], a: [bv, ven.y[1]] }, o);
    const pts = [];
    for (const x of ven.x) { const y = mv * x + bv; if (y >= ven.y[0] - 1e-9 && y <= ven.y[1] + 1e-9) pts.push([x, y]); }
    if (mv !== 0) for (const y of ven.y) { const x = (y - bv) / mv; if (x > ven.x[0] && x < ven.x[1]) pts.push([x, y]); }
    pts.sort((p, q) => p[0] - q[0]);
    return Object.assign({ de: pts[0] || [ven.x[0], bv], a: pts[pts.length - 1] || [ven.x[1], bv] }, o);
  }

  // ---------- Idea 1: la distancia es una hipotenusa ----------
  // Cambia: el punto B. · Permanece: A = (1; 1) y la cuadrícula. · Progresa: el triángulo de catetos Δx y Δy.
  // Se reserva: puntos con coordenadas negativas en distinto cuadrante (la predicción).
  // Debe verse: que d es la hipotenusa del triángulo que forman las diferencias de coordenadas.
  const triDist = (x1, y1, x2, y2, o = {}) => plano({
    ventana: o.ventana, numeros: o.numeros,
    extra: {
      segmentos: [
        { de: [x1, y1], a: [x2, y1], color: 'i', rotulo: o.rx || `Δx = ${f(x2 - x1)}`, desde: o.p1 },
        { de: [x2, y1], a: [x2, y2], color: 'h', rotulo: o.ry || `Δy = ${f(y2 - y1)}`, desde: o.p2 },
        { de: [x1, y1], a: [x2, y2], color: 'd', rotulo: o.rd === undefined ? `d ≈ ${f(Math.hypot(x2 - x1, y2 - y1))}` : o.rd, lado: 'adentro', desde: o.p3 },
      ],
      puntos: [{ x: x1, y: y1, rotulo: `A${P(x1, y1)}`, lado: o.ladoA || 'so' }, { x: x2, y: y2, rotulo: `B${P(x2, y2)}`, lado: o.ladoB || 'ne' }],
      alt: `Puntos A ${P(x1, y1)} y B ${P(x2, y2)}: catetos de ${f(Math.abs(x2 - x1))} y ${f(Math.abs(y2 - y1))}, distancia ${f(Math.hypot(x2 - x1, y2 - y1))}`,
    },
  });
  const dist1 = v => triDist(1, 1, v.x, v.y, { ventana: { x: [-1, 7.5], y: [-1, 7.5] }, ladoA: 'se' });
  const distancia = {
    id: 'distancia',
    titulo: 'La distancia es una hipotenusa',
    temas: ['Distancia entre dos puntos'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'A = (1; 1) queda fijo. Mueve el punto B y mira el triángulo que forman el avance Δx, la subida Δy y la distancia d.',
      voz: 'Cuenta los cuadritos de cada cateto antes de mirar la lectura.',
      controles: [
        { id: 'x', etiqueta: 'x de B', color: 'c-i', min: 2, max: 6, paso: 1, inicio: 4, decimales: 0 },
        { id: 'y', etiqueta: 'y de B', color: 'c-h', min: 2, max: 6, paso: 1, inicio: 4, decimales: 0 },
      ],
      dibujo: v => ({ datos: dist1(v), estado: {} }),
      lectura: v => [d, ` = √(${f(v.x - 1)}² + ${f(v.y - 1)}²) ≈ ${f(Math.hypot(v.x - 1, v.y - 1))}`],
      minimo: 3,
      // Se arrastra el punto B: los dos catetos y la hipotenusa lo siguen.
      arrastres: [{ id: 'punto-b', etiqueta: 'punto B',
        donde: v => aPx(dist1(v), v.x, v.y),
        mover: (pt, v) => { const q = dePx(dist1(v), pt); return { x: q.x, y: q.y }; } }],
    },
    predice: {
      pregunta: '¿Cuánto mide la distancia entre A = (−2; 3) y B = (4; −5)?',
      voz: 'Cuida el signo al restar coordenadas negativas.',
      opciones: [
        { id: 'c', texto: '10', correcta: true },
        { id: 'suma', texto: '14', error: 'DIST-SUMA', siFuera: '6 + 8 es lo que caminas por la cuadrícula. La distancia va en línea recta: la hipotenusa.' },
        { id: 'signo', texto: `2√2 ≈ ${f(2 * Math.SQRT2)}`, error: 'DIST-SIGNO', siFuera: 'Restar coordenadas está bien; 4 − (−2) es 6, no 2: restar un negativo suma.' },
        { id: 'raiz', texto: '100', error: 'DIST-SIN-RAIZ', siFuera: '36 + 64 = 100 está bien; eso es d². Falta la raíz.' },
      ],
      dibujo: { datos: plano({ ventana: { x: [-4, 6], y: [-7, 5] }, extra: { puntos: [{ x: -2, y: 3, rotulo: 'A(−2; 3)', lado: 'ne' }, { x: 4, y: -5, rotulo: 'B(4; −5)', lado: 'e' }], alt: 'Puntos A (−2; 3) y B (4; −5) en el plano' } }), estado: {} },
      revelar: { datos: triDist(-2, 3, 4, -5, { ventana: { x: [-4, 6], y: [-7, 5] }, rd: 'd = 10', ladoA: 'no', ladoB: 'e', numeros: 0 }), estado: {} },
      coincide: 'Coincide: catetos de 6 y 8, hipotenusa 10.',
      noCoincide: 'Revisemos los catetos: miden 6 y 8 cuadritos.',
    },
    // Hallazgo 9: «Mira» usa la misma figura del juego (el triángulo de catetos), con el caso de la predicción.
    mira: {
      datos: triDist(-2, 3, 4, -5, { ventana: { x: [-4, 6], y: [-7, 5] }, rd: 'd = 10', ladoA: 'no', ladoB: 'e', p1: 1, p2: 2, p3: 3, numeros: 0 }),
      voz: 'Primero los dos catetos, con su signo; después Pitágoras.',
      pasos: [
        { estado: { corte: 1 }, texto: 'El avance horizontal es la resta de las x.', ecuacion: [dx, ' = 4 − (−2) = 6'] },
        { estado: { corte: 2 }, texto: 'La subida es la resta de las y; aquí baja.', ecuacion: [dy, ' = −5 − 3 = −8'] },
        { estado: { corte: 3 }, texto: 'La distancia es la hipotenusa; el cuadrado borra el signo.', ecuacion: [d, ' = ', { raiz: ['6² + (−8)²'] }, ' = ', { raiz: ['100'] }, ' = 10'] },
      ],
    },
    regla: {
      texto: 'La distancia entre dos puntos es la hipotenusa del triángulo rectángulo que forman la diferencia de las x y la diferencia de las y.',
      ecuacion: [d, ' = ', { raiz: [cuad({ llave: [dx], nota: 'avance', color: 'c-i' }), ' + ', cuad({ llave: [dy], nota: 'subida', color: 'c-h' })] }],
      condicion: 'Δx = x₂ − x₁ y Δy = y₂ − y₁, con ejes perpendiculares de igual escala. El orden de los puntos no importa.',
      voz: 'Resta con cuidado; Pitágoras hace el resto.',
    },
    ahoraTu: {
      pieza: 'trig-plano',
      voz: 'Escribe Δx y Δy con su signo antes de elevar.',
      generar(sem) {
        const rr = azar(sem), [p, q] = rr.uno([[3, 4], [6, 8], [5, 12], [1, 1], [1, 2], [2, 3], [8, 15]]);
        const [ex, ey] = rr.ent(0, 1) ? [p, q] : [q, p];
        const x1 = rr.ent(-6, 2), y1 = rr.ent(-6, 2), x2 = x1 + rr.sg() * ex, y2 = y1 + rr.sg() * ey;
        const n2 = ex * ex + ey * ey;
        const signo = (x2 + x1) ** 2 + (y2 + y1) ** 2;
        return {
          pregunta: [`¿Cuánto mide la distancia entre A = ${P(x1, y1)} y B = ${P(x2, y2)}?`],
          opciones: opciones(raiz(n2), [
            { id: 'suma', valor: f(ex + ey), error: 'DIST-SUMA', siFuera: 'Sumar los catetos es caminar por la cuadrícula. La distancia es la hipotenusa.' },
            { id: 'raiz', valor: f(n2), error: 'DIST-SIN-RAIZ', siFuera: `La suma de cuadrados, ${n2}, está bien; eso es d². Falta la raíz.` },
            { id: 'signo', valor: signo > 0 ? raiz(signo) : '0', error: 'DIST-SIGNO', siFuera: 'Eso suma las coordenadas. La distancia usa sus diferencias.' },
          ], x => x),
          solucion: { texto: `Los catetos miden ${ex} y ${ey}.`, ecuacion: [d, ' = ', { raiz: [`${ex}² + ${ey}²`] }, ` = ${raiz(n2)}`] },
        };
      },
    },
  };

  // ---------- Idea 2: dividir un segmento ----------
  // Cambia: el punto B (A fijo). · Permanece: A y la cuadrícula. · Progresa: el punto medio M, promedio de A y B.
  // Se reserva: una división 1:3, que no es el promedio simple (la predicción).
  // Debe verse: que el punto que divide en m:n está más cerca del extremo que pesa más.
  const segmento = (x1, y1, x2, y2, extra = {}) => plano({ ventana: extra.ventana, extra: Object.assign({
    segmentos: [{ de: [x1, y1], a: [x2, y2], grosor: 'contorno' }],
    puntos: [{ x: x1, y: y1, rotulo: `A${P(x1, y1)}`, lado: 'so' }, { x: x2, y: y2, rotulo: `B${P(x2, y2)}`, lado: 'ne' }],
    alt: `Segmento de A ${P(x1, y1)} a B ${P(x2, y2)}`,
  }, extra.datos || {}) });
  const medio2 = v => {
    const mx = (-4 + v.x) / 2, my = (-4 + v.y) / 2;
    return segmento(-4, -4, v.x, v.y, { datos: { puntos: [{ x: -4, y: -4, rotulo: 'A(−4; −4)', lado: 'e' }, { x: v.x, y: v.y, rotulo: 'B', lado: 'ne' }, { x: mx, y: my, color: 'd', rotulo: `M${P(mx, my)}`, lado: 'no' }] } });
  };
  const division = {
    id: 'division',
    titulo: 'Promedio con pesos cruzados',
    temas: ['División de un segmento y punto medio'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'A queda fijo. Mueve B y mira el punto medio M: cada coordenada de M es el promedio de las de A y B.',
      voz: 'Compara M con los dos extremos: queda a la misma distancia.',
      controles: [
        { id: 'x', etiqueta: 'x de B', color: 'c-i', min: -2, max: 4, paso: 2, inicio: 2, decimales: 0 },
        { id: 'y', etiqueta: 'y de B', color: 'c-h', min: -2, max: 4, paso: 2, inicio: 0, decimales: 0 },
      ],
      dibujo: v => ({ datos: medio2(v), estado: {} }),
      lectura: v => ['M = ', P((-4 + v.x) / 2, (-4 + v.y) / 2), ' = promedio de A y B'],
      minimo: 3,
      // Se arrastra el extremo B: el punto medio M recorre la mitad del camino.
      arrastres: [{ id: 'punto-b', etiqueta: 'extremo B',
        donde: v => aPx(medio2(v), v.x, v.y),
        mover: (pt, v) => { const q = dePx(medio2(v), pt); return { x: q.x, y: q.y }; } }],
    },
    predice: {
      pregunta: 'A = (1; 2) y B = (9; 6). El punto P está en el segmento AB con AP : PB = 1 : 3. ¿Cuáles son las coordenadas de P?',
      voz: 'Piensa de qué extremo queda más cerca P.',
      opciones: [
        { id: 'c', texto: '(3; 3)', correcta: true },
        { id: 'pesos', texto: '(7; 5)', error: 'DIV-PESOS', siFuera: 'Ponderar está bien; el peso 3 va a A, el extremo más cercano a P.' },
        { id: 'medio', texto: '(5; 4)', error: 'DIV-MEDIO', siFuera: 'Ese es el punto medio: la división 1 : 1. Aquí AP es la cuarta parte.' },
        { id: 'tercio', texto: `(${f(11 / 3)}; ${f(10 / 3)})`, error: 'DIV-TERCIO', siFuera: 'Eso toma AP como un tercio de AB. Con 1 : 3, AB tiene 4 partes.' },
      ],
      dibujo: { datos: segmento(1, 2, 9, 6, { ventana: { x: [-1, 11], y: [-1, 8] } }), estado: {} },
      revelar: { datos: segmento(1, 2, 9, 6, { ventana: { x: [-1, 11], y: [-1, 8] }, datos: { puntos: [{ x: 1, y: 2, rotulo: 'A', lado: 'so' }, { x: 9, y: 6, rotulo: 'B', lado: 'ne' }, { x: 3, y: 3, color: 'd', rotulo: 'P(3; 3)', lado: 'se' }, { x: 5, y: 4, abierto: true }, { x: 7, y: 5, abierto: true }] } }), estado: {} },
      coincide: 'Coincide: P está a un cuarto del camino, cerca de A.',
      noCoincide: 'Revisemos: AB tiene 4 partes iguales y P está en la primera.',
    },
    // Hallazgo 9: «Mira» es el mismo segmento del juego, ahora partido en m + n partes (el caso de la predicción).
    mira: {
      datos: segmento(1, 2, 9, 6, { ventana: { x: [-1, 11], y: [-1, 8] }, datos: {
        segmentos: [{ de: [1, 2], a: [9, 6], grosor: 'contorno' }, { de: [1, 2], a: [3, 3], color: 'd', rotulo: '1 parte', desde: 2 }, { de: [3, 3], a: [9, 6], grosor: 'variable', rotulo: '3 partes', lado: 'adentro', desde: 2 }],
        puntos: [{ x: 1, y: 2, rotulo: 'A', lado: 'so' }, { x: 9, y: 6, rotulo: 'B', lado: 'ne' }, { x: 5, y: 4, abierto: true, desde: 1 }, { x: 7, y: 5, abierto: true, desde: 1 }, { x: 3, y: 3, color: 'd', rotulo: 'P(3; 3)', lado: 's', desde: 2 }],
        alt: 'Segmento de A (1; 2) a B (9; 6) partido en 4 partes iguales; P está en la primera, en (3; 3)',
      } }),
      voz: 'Partes iguales primero; las coordenadas, después.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Con AP : PB = 1 : 3, el segmento tiene 1 + 3 = 4 partes iguales.', ecuacion: ['AB = 4 partes'] },
        { estado: { corte: 2 }, texto: 'P avanza un cuarto del camino desde A.', ecuacion: ['P = A + ', { frac: ['1', '4'] }, '(B − A) = (1; 2) + (2; 1) = (3; 3)'] },
        { estado: { corte: 2 }, texto: 'Es un promedio con pesos cruzados: A pesa 3 y B pesa 1.', ecuacion: ['P = ', { frac: ['3 · A + 1 · B', '4'] }, ' = ', { frac: ['(3; 6) + (9; 6)', '4'] }, ' = (3; 3)'] },
      ],
    },
    regla: {
      texto: 'Si AP : PB = m : n, P es un promedio con pesos cruzados: A pesa n y B pesa m. El punto medio es el caso m = n.',
      ecuacion: ['P = ', { llave: [{ frac: ['n · A + m · B', 'm + n'] }], nota: 'pesos cruzados', color: 'c-d' }],
      condicion: 'P entre A y B, con m y n positivos. Se calcula con las x y con las y por separado.',
      voz: 'El extremo más cercano pesa más.',
    },
    ahoraTu: {
      voz: 'Decide primero de qué extremo queda más cerca P.',
      generar(sem) {
        const rr = azar(sem), mm = rr.ent(1, 3), nn = rr.uno([1, 2, 3, 4].filter(x => x !== mm)), vx = rr.sg() * rr.ent(1, 2), vy = rr.sg() * rr.ent(1, 2);
        const px = rr.ent(-3, 3), py = rr.ent(-3, 3), x1 = px - mm * vx, y1 = py - mm * vy, x2 = px + nn * vx, y2 = py + nn * vy;
        const no = [(mm * x1 + nn * x2) / (mm + nn), (mm * y1 + nn * y2) / (mm + nn)];
        return {
          pregunta: [`A = ${P(x1, y1)} y B = ${P(x2, y2)}. P está en el segmento AB con AP : PB = ${mm} : ${nn}. ¿Cuáles son las coordenadas de P?`],
          opciones: opciones(P(px, py), [
            { id: 'pesos', valor: P(no[0], no[1]), error: 'DIV-PESOS', siFuera: 'Ponderar está bien; los pesos van cruzados: el extremo más cercano pesa más.' },
            { id: 'medio', valor: P((x1 + x2) / 2, (y1 + y2) / 2), error: 'DIV-MEDIO', siFuera: `Ese es el punto medio, la división 1 : 1. Aquí es ${mm} : ${nn}.` },
            { id: 'tercio', valor: P(x1 + (x2 - x1) * mm / nn, y1 + (y2 - y1) * mm / nn), error: 'DIV-TERCIO', siFuera: `Eso compara AP con PB, no con AB. AB tiene ${mm + nn} partes.` },
          ], x => x),
          solucion: { texto: `AB tiene ${mm + nn} partes; P avanza ${mm} desde A.`, ecuacion: ['P = ', { frac: [`${nn} · A + ${mm} · B`, `${mm + nn}`] }, ` = ${P(px, py)}`] },
        };
      },
    },
  };

  // ---------- Idea 3: baricentro y área con coordenadas ----------
  // Cambia: el vértice C de un triángulo con base AB horizontal. · Permanece: A y B.
  // Progresa: el área (base por altura entre 2) y el baricentro G. · Se reserva: un triángulo sin lados horizontales
  // ni verticales, que pide la caja o el determinante (la predicción). · Debe verse: caja menos tres triángulos.
  const triangulo = (pts, o = {}) => plano({ ventana: o.ventana, extra: {
    segmentos: pts.map((p, k) => ({ de: p, a: pts[(k + 1) % 3], color: 'd' })).concat(o.segmentos || []),
    puntos: pts.map((p, k) => ({ x: p[0], y: p[1], rotulo: o.nombres ? `${o.nombres[k]}${P(p[0], p[1])}` : '', lado: o.lados ? o.lados[k] : 'n' })).concat(o.puntos || []),
    rotulos: o.rotulos || [],
    alt: o.alt || `Triángulo de vértices ${pts.map(p => P(p[0], p[1])).join(', ')}`,
  } });
  const det = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1]);
  const PQR = [[1, 1], [2, 6], [5, 2]];
  const tri3 = v => triangulo([[-3, -3], [3, -3], [v.x, v.y]], { nombres: ['A', 'B', 'C'], lados: ['so', 'se', 'n'], puntos: [{ x: v.x / 3, y: (v.y - 6) / 3, color: 'o', rotulo: 'G', lado: 'e' }] });
  const area = {
    id: 'baricentro-area',
    titulo: 'Caja menos esquinas',
    temas: ['Baricentro y área con coordenadas'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'A y B quedan en una recta horizontal. Mueve C: la lectura da el área y el baricentro G, el promedio de los tres vértices.',
      voz: 'Con la base horizontal, la altura se cuenta en cuadritos.',
      controles: [
        { id: 'x', etiqueta: 'x de C', color: 'c-i', min: -3, max: 3, paso: 3, inicio: 0, decimales: 0 },
        { id: 'y', etiqueta: 'y de C', color: 'c-h', min: 0, max: 3, paso: 3, inicio: 0, decimales: 0 },
      ],
      dibujo: v => ({ datos: tri3(v), estado: {} }),
      lectura: v => [A, ` = 6 · ${f(v.y + 3)} ÷ 2 = ${f(3 * (v.y + 3))} · G = ${P(v.x / 3, (v.y - 6) / 3)}`],
      minimo: 3,
      // Se arrastra el vértice C (salta de 3 en 3 para que G caiga en la cuadrícula).
      arrastres: [{ id: 'vertice-c', etiqueta: 'vértice C',
        donde: v => aPx(tri3(v), v.x, v.y),
        mover: (pt, v) => { const q = dePx(tri3(v), pt); return { x: q.x, y: q.y }; } }],
    },
    predice: {
      pregunta: '¿Cuál es el área del triángulo de vértices P = (1; 1), Q = (2; 6) y R = (5; 2)?',
      voz: 'Ningún lado es horizontal: busca otra figura que lo contenga.',
      opciones: [
        { id: 'c', texto: '9,5', correcta: true },
        { id: 'mitad', texto: '19', error: 'AREA-MITAD', siFuera: 'El determinante, 19 en valor absoluto, está bien; el área es su mitad.' },
        { id: 'abs', texto: '−9,5', error: 'AREA-SIN-ABS', siFuera: 'Con P, Q, R en ese orden el determinante sale negativo; el área es su valor absoluto.' },
        { id: 'caja', texto: '20', error: 'AREA-CAJA', siFuera: '20 es el rectángulo que lo contiene. Falta quitarle las tres esquinas.' },
      ],
      dibujo: { datos: triangulo(PQR, { ventana: { x: [-1, 7], y: [-1, 8] }, nombres: ['P', 'Q', 'R'], lados: ['so', 'n', 'e'] }), estado: {} },
      revelar: { datos: triangulo(PQR, { ventana: { x: [-1, 7], y: [-1, 8] }, nombres: ['P', 'Q', 'R'], lados: ['so', 'n', 'e'], rotulos: [{ x: 2.8, y: 3, texto: 'A = 9,5', color: 'd' }], segmentos: [{ de: [1, 1], a: [5, 1], discontinua: true }, { de: [5, 1], a: [5, 6], discontinua: true }, { de: [5, 6], a: [1, 6], discontinua: true }, { de: [1, 6], a: [1, 1], discontinua: true }] }), estado: {} },
      coincide: 'Coincide: la caja de 20 menos tres esquinas que suman 10,5.',
      noCoincide: 'Revisemos: la caja punteada mide 20 y las esquinas suman 10,5.',
    },
    // Hallazgo 9: el juego tiene base horizontal y se cuenta la altura; «Mira» toma el triángulo sin lados
    // horizontales de la predicción, en la misma pieza, porque ahí la altura ya no se cuenta y hace falta la caja.
    mira: {
      datos: triangulo(PQR, {
        ventana: { x: [-1, 7], y: [-1, 8] }, nombres: ['P', 'Q', 'R'], lados: ['so', 'n', 'e'],
        segmentos: [{ de: [1, 1], a: [5, 1], discontinua: true, desde: 1 }, { de: [5, 1], a: [5, 6], discontinua: true, desde: 1 }, { de: [5, 6], a: [1, 6], discontinua: true, desde: 1 }, { de: [1, 6], a: [1, 1], discontinua: true, desde: 1 }],
        rotulos: [{ x: 1.3, y: 4.2, texto: '2,5', desde: 2 }, { x: 4.2, y: 5.3, texto: '6', desde: 2 }, { x: 3.6, y: 1.35, texto: '2', desde: 2 }, { x: 2.65, y: 4.1, texto: '9,5', color: 'd', desde: 3 }],
        puntos: [{ x: 8 / 3, y: 3, color: 'o', rotulo: 'G', lado: 's', desde: 4 }],
        alt: 'Triángulo P (1; 1), Q (2; 6), R (5; 2) dentro de una caja de 4 por 5: la caja menos tres esquinas da 9,5; el baricentro G está en (8/3; 3)',
      }),
      voz: 'Una figura fácil, menos lo que sobra.',
      pasos: [
        { estado: { corte: 1 }, texto: 'La caja que lo contiene mide 4 por 5.', ecuacion: ['4 · 5 = 20'] },
        { estado: { corte: 2 }, texto: 'Las tres esquinas son triángulos rectángulos.', ecuacion: [{ frac: ['1 · 5', '2'] }, ' + ', { frac: ['3 · 4', '2'] }, ' + ', { frac: ['4 · 1', '2'] }, ' = 10,5'] },
        { estado: { corte: 3 }, texto: 'El triángulo es lo que queda; es la mitad del determinante.', ecuacion: [A, ' = 20 − 10,5 = ', { frac: ['|1 · 1 − 5 · 4|', '2'] }, ' = 9,5'] },
        { estado: { corte: 4 }, texto: 'El baricentro promedia los tres vértices.', ecuacion: ['G = ', { par: [{ frac: ['1 + 2 + 5', '3'] }, '; ', { frac: ['1 + 6 + 2', '3'] }] }, ' = (8/3; 3)'] },
      ],
    },
    regla: {
      texto: 'Con dos lados que salen de un mismo vértice, el área es la mitad del valor absoluto de su determinante. El baricentro promedia los tres vértices.',
      ecuacion: [A, ' = ', { frac: [{ llave: [{ abs: [sub(dx, '1'), sub(dy, '2'), ' − ', sub(dx, '2'), sub(dy, '1')] }], nota: 'determinante sin signo', color: 'c-d', arriba: true }, '2'] }, '   ·   ', 'G = ', { llave: [{ frac: ['P + Q + R', '3'] }], nota: 'promedio', color: 'c-o' }],
      condicion: 'Δx₁, Δy₁ y Δx₂, Δy₂ son los dos lados que salen del mismo vértice. El valor absoluto quita el signo del orden.',
      voz: 'El signo dice el orden de los vértices; el área no lo lleva.',
    },
    ahoraTu: {
      pieza: 'trig-plano',
      voz: 'Elige un vértice y resta coordenadas desde él.',
      generar(sem) {
        const rr = azar(sem);
        for (;;) {
          const pts = [0, 1, 2].map(() => [rr.ent(-4, 4), rr.ent(-4, 4)]);
          const D = det(pts[0], pts[1], pts[2]);
          const sx = pts[0][0] + pts[1][0] + pts[2][0], sy = pts[0][1] + pts[1][1] + pts[2][1];
          if (Math.abs(D) < 4) continue;
          const nombres = `P = ${P(...pts[0])}, Q = ${P(...pts[1])} y R = ${P(...pts[2])}`;
          const dib = { datos: triangulo(pts, { nombres: ['P', 'Q', 'R'] }), estado: {} };
          if (sem % 2 === 0) {
            const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
            return {
              pregunta: [`¿Cuál es el área del triángulo de vértices ${nombres}?`],
              opciones: opciones(Math.abs(D) / 2, [
                { id: 'mitad', valor: Math.abs(D), error: 'AREA-MITAD', siFuera: `El determinante, ${f(Math.abs(D))} en valor absoluto, está bien; el área es su mitad.` },
                { id: 'abs', valor: D / 2, error: 'AREA-SIN-ABS', siFuera: 'El determinante salió negativo por el orden de los vértices; el área es su valor absoluto.' },
                { id: 'caja', valor: (Math.max(...xs) - Math.min(...xs)) * (Math.max(...ys) - Math.min(...ys)), error: 'AREA-CAJA', siFuera: 'Esa es la caja que lo contiene; falta quitarle las esquinas.' },
              ], x => f(x)),
              solucion: { texto: 'Lados desde P; la mitad del valor absoluto del determinante.', ecuacion: [A, ' = ', { frac: [`|${f(D)}|`, '2'] }, ` = ${f(Math.abs(D) / 2)}`], dibujo: dib },
            };
          }
          if (sx % 3 || sy % 3) continue;
          return {
            pregunta: [`¿Cuál es el baricentro del triángulo de vértices ${nombres}?`],
            opciones: opciones(P(sx / 3, sy / 3), [
              { id: 'mitad', valor: P(sx / 2, sy / 2), error: 'BAR-MITAD', siFuera: 'Sumar los tres vértices está bien; son tres: se divide entre 3.' },
              { id: 'suma', valor: P(sx, sy), error: 'BAR-SUMA', siFuera: 'Esa es la suma de los vértices; falta dividir entre 3.' },
              { id: 'medio', valor: P((pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2), error: 'BAR-MEDIO-LADO', siFuera: 'Ese es el punto medio de PQ. El baricentro usa los tres vértices.' },
            ], x => x),
            solucion: { texto: 'Se promedian las x y las y de los tres vértices.', ecuacion: ['G = ', { par: [{ frac: [`${sx}`, '3'] }, '; ', { frac: [`${sy}`, '3'] }] }, ` = ${P(sx / 3, sy / 3)}`], dibujo: { datos: triangulo(pts, { nombres: ['P', 'Q', 'R'], puntos: [{ x: sx / 3, y: sy / 3, color: 'o', rotulo: 'G', lado: 's' }] }), estado: {} } },
          };
        }
      },
    },
  };

  // ---------- Idea 4: pendiente e inclinación ----------
  // Cambia: la subida Δy y el avance Δx de una recta. · Permanece: la cuadrícula y el punto (1; −3).
  // Progresa: la pendiente m y el ángulo θ que la recta forma con el eje x. · Se reserva: la recta vertical,
  // con Δx = 0 (la predicción). · Debe verse: m = Δy/Δx = tan θ, y que θ va de 0° a 180°.
  const inclinada = (ddx, ddy, o = {}) => {
    const x0 = o.x0 === undefined ? 1 : o.x0, y0 = o.y0 === undefined ? -3 : o.y0, V4 = { x: [-2, 6], y: [-7.5, 2.5] };
    const mv = ddx === 0 ? null : ddy / ddx, ang = ddx === 0 ? 90 : ((Math.atan2(ddy, ddx) * GRA) + 180) % 180;
    return plano({ ventana: V4, extra: {
      segmentos: [recta(mv, mv === null ? x0 : y0 - mv * x0, V4, { color: 'o' }), { de: [x0, y0], a: [x0 + ddx, y0], color: 'i', rotulo: o.rx === undefined ? `Δx = ${f(ddx)}` : o.rx }, { de: [x0 + ddx, y0], a: [x0 + ddx, y0 + ddy], color: 'h', rotulo: o.ry === undefined ? `Δy = ${f(ddy)}` : o.ry }],
      arcos: [{ cx: x0, cy: y0, de: 0, a: ang, r: 0.9, espiral: 0, flecha: false, color: 'o', rotulo: o.rt === undefined ? `θ ≈ ${f(ang, 1)}°` : o.rt }],
      puntos: [{ x: x0, y: y0 }, { x: x0 + ddx, y: y0 + ddy, color: 'o' }],
      alt: o.alt || `Recta que avanza ${f(ddx)} y sube ${f(ddy)}: inclinación de ${f(ang, 1)} grados`,
    } });
  };
  const pendiente = {
    id: 'pendiente',
    titulo: 'Lo que sube por paso',
    temas: ['Pendiente e inclinación'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Desde el punto (1; −3), elige cuánto avanza, Δx, y cuánto sube, Δy. La lectura da la pendiente y la inclinación θ.',
      voz: 'Prueba subidas negativas: mira hacia dónde se abre θ.',
      controles: [
        { id: 'x', etiqueta: 'Δx', color: 'c-i', min: 1, max: 4, paso: 1, inicio: 2, decimales: 0 },
        { id: 'y', etiqueta: 'Δy', color: 'c-h', min: -4, max: 4, paso: 1, inicio: 3, decimales: 0 },
      ],
      dibujo: v => ({ datos: inclinada(v.x, v.y, { rt: '' }), estado: {} }),
      lectura: v => [m, ` = ${fr(v.y, v.x)} · `, th, ` ≈ ${f(((Math.atan2(v.y, v.x) * GRA) + 180) % 180, 1)}°`],
      minimo: 3,
      // Se arrastra la punta del escalón: a la derecha cambia el avance Δx; arriba y abajo, la subida Δy.
      arrastres: [{ id: 'punta-escalon', etiqueta: 'punta del avance y la subida', color: 'c-o',
        donde: v => aPx(inclinada(v.x, v.y), 1 + v.x, -3 + v.y),
        mover: (pt, v) => { const q = dePx(inclinada(v.x, v.y), pt); return { x: q.x - 1, y: q.y + 3 }; } }],
    },
    predice: {
      pregunta: '¿Cuál es la pendiente de la recta que pasa por (2; 1) y (2; 5)?',
      voz: 'Antes de dividir, mira cuánto avanza.',
      opciones: [
        { id: 'c', texto: 'No tiene: la recta es vertical', correcta: true },
        { id: 'cero', texto: '0', error: 'PEND-VERT-CERO', siFuera: '0 es la pendiente de una horizontal, que no sube. Esta no avanza: Δx = 0.' },
        { id: 'dy', texto: '4', error: 'PEND-SOLO-DY', siFuera: 'Δy = 4 está bien; falta dividir entre Δx, y Δx vale 0.' },
        { id: 'inf', texto: '∞, un número muy grande', error: 'PEND-INFINITO', siFuera: 'Cerca de vertical la pendiente crece sin tope; pero ∞ no es un número: no hay pendiente.' },
      ],
      dibujo: { datos: plano({ extra: { puntos: [{ x: 2, y: 1, rotulo: '(2; 1)', lado: 'e' }, { x: 2, y: 5, rotulo: '(2; 5)', lado: 'e' }], alt: 'Dos puntos con la misma x: (2; 1) y (2; 5)' } }), estado: {} },
      revelar: { datos: plano({ extra: { segmentos: [recta(null, 2, VEN, { color: 'o' }), { de: [2, 1], a: [2, 5], color: 'h', rotulo: 'Δy = 4' }], arcos: [{ cx: 2, cy: 0, de: 0, a: 90, r: 1, espiral: 0, flecha: false, color: 'o', rotulo: 'θ = 90°' }], puntos: [{ x: 2, y: 1 }, { x: 2, y: 5 }], rotulos: [{ x: 3.6, y: -2.5, texto: 'Δx = 0', color: 'i' }], alt: 'Recta vertical x = 2: inclinación de 90 grados y avance cero' } }), estado: {} },
      coincide: 'Coincide: Δx = 0 y no se puede dividir entre 0.',
      noCoincide: 'Revisemos: los dos puntos tienen la misma x, así que Δx = 0.',
    },
    // Hallazgo 9: el juego arma una recta con su escalón; «Mira» pone varias rectas en el mismo plano para
    // compararlas (más empinada, vertical, bajando). Es la misma pieza; el escalón ya se vio al jugar.
    mira: {
      datos: plano({ extra: {
        segmentos: [recta(1, 0, VEN, { color: 'o', discontinua: true, desde: 1, hasta: 1 }), recta(3, 0, VEN, { color: 'o', discontinua: true, desde: 1, hasta: 1 }), recta(null, 0.02, VEN, { color: 'o', desde: 2, hasta: 2 }), recta(-1, 0, VEN, { color: 'o', desde: 3 })],
        arcos: [{ de: 0, a: 135, r: 1.2, espiral: 0, flecha: false, color: 'o', rotulo: 'θ = 135°', desde: 3 }],
        rotulos: [{ x: 3.4, y: 4.8, texto: 'm = 1', color: 'o', desde: 1, hasta: 1 }, { x: 0.9, y: 5.2, texto: 'm = 3', color: 'o', desde: 1, hasta: 1 }, { x: 1.4, y: 5.2, texto: 'x = 0', color: 'o', desde: 2, hasta: 2 }, { x: -4, y: 5, texto: 'm = −1', color: 'o', desde: 3 }],
        alt: 'Rectas por el origen: al empinarse la pendiente crece; la vertical no tiene pendiente; la de pendiente −1 se inclina 135 grados',
      } }),
      voz: 'La inclinación siempre se mide desde el eje x positivo.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Cuanto más empinada, mayor la pendiente: sube más por cada paso.', ecuacion: [m, ' = ', { frac: [dy, dx] }, ' = tan ', th] },
        { estado: { corte: 2 }, texto: 'La vertical no avanza: Δx = 0 y no hay división.', ecuacion: [dx, ' = 0', '   ·   ', th, ' = 90°', '   ·   ', 'sin pendiente'] },
        { estado: { corte: 3 }, texto: 'Si baja, la pendiente es negativa y θ es obtuso.', ecuacion: [m, ' = −1 = tan 135°'] },
      ],
    },
    regla: {
      texto: 'La pendiente es lo que sube la recta por cada unidad que avanza, y es la tangente de su inclinación θ, medida desde el eje x positivo.',
      ecuacion: [m, ' = ', { frac: [{ llave: [dy], nota: 'subida', color: 'c-h', arriba: true }, { llave: [dx], nota: 'avance', color: 'c-i' }] }, ' = tan ', { llave: [th], nota: 'inclinación', color: 'c-o' }],
      condicion: 'Δx ≠ 0 y 0° ≤ θ < 180°. Una recta vertical tiene θ = 90° y no tiene pendiente.',
      voz: 'Primero el avance: si es cero, no hay pendiente.',
    },
    ahoraTu: {
      voz: 'Resta en el mismo orden arriba y abajo.',
      generar(sem) {
        const rr = azar(sem);
        if (sem % 2 === 0) {
          const x1 = rr.ent(-5, 3), y1 = rr.ent(-5, 3), ax = rr.ent(1, 5) * rr.sg(), ay = rr.ent(1, 6) * rr.sg();
          const x2 = x1 + ax, y2 = y1 + ay;
          return {
            pregunta: [`¿Cuál es la pendiente de la recta que pasa por ${P(x1, y1)} y ${P(x2, y2)}?`],
            opciones: opciones(fr(ay, ax), [
              { id: 'inversa', valor: fr(ax, ay), error: 'PEND-INVERSA', siFuera: 'Los dos números están bien, pero invertidos: arriba va lo que sube.' },
              { id: 'signo', valor: fr(-ay, ax), error: 'PEND-SIGNO', siFuera: 'El tamaño está bien; el signo no: se restó en distinto orden arriba y abajo.' },
              { id: 'suma', valor: fr(y2 + y1, x2 + x1 || 1), error: 'DIST-SIGNO', siFuera: 'Eso suma coordenadas. La pendiente divide diferencias.' },
            ], x => x),
            solucion: { texto: 'Δy entre Δx, restando en el mismo orden.', ecuacion: [m, ' = ', { frac: [`${f(y2)} − ${par(y1)}`, `${f(x2)} − ${par(x1)}`] }, ` = ${fr(ay, ax)}`] },
          };
        }
        const [mt, ang] = rr.uno([['1', 45], ['−1', 135], ['√3', 60], ['−√3', 120], ['√3/3', 30], ['−√3/3', 150], ['0', 0]]);
        return {
          pregunta: [`Una recta tiene pendiente ${mt}. ¿Cuál es su inclinación θ, entre 0° y 180°?`],
          opciones: opciones(ang, [
            { id: 'negativa', valor: ang > 90 ? ang - 180 : 180 - ang, error: 'INCL-NEGATIVA', siFuera: ang > 90 ? 'Ese ángulo tiene la tangente pedida, pero θ se toma entre 0° y 180°.' : 'Ese ángulo tiene la tangente con el signo contrario.' },
            { id: 'comp', valor: 90 - ang, error: 'INCL-COMPLEMENTO', siFuera: 'Eso mide la inclinación desde el eje y. θ se mide desde el eje x positivo.' },
            { id: 'otro', valor: ang === 0 ? 180 : ang === 45 ? 30 : 45, error: 'PEND-INVERSA', siFuera: 'Revisa qué ángulo tiene esa tangente en la tabla de notables.' },
          ].filter(o => o.valor >= 0 && o.valor < 180), x => `${f(x)}°`),
          solucion: { texto: 'Se busca el ángulo entre 0° y 180° cuya tangente es m.', ecuacion: ['tan ', th, ` = ${mt}  ⇒  `, th, ` = ${ang}°`] },
        };
      },
    },
  };

  // ---------- Idea 5: tres ecuaciones, una recta ----------
  // Cambia: la pendiente m y el corte b con el eje y. · Permanece: la cuadrícula.
  // Progresa: la recta y = mx + b. · Se reserva: la recta dada por un punto que no es el corte (la predicción).
  // Debe verse: que punto-pendiente, ordenada al origen y general son la misma recta.
  const paso5 = v => (Math.abs(2 * v.m + v.b) <= 5.5 ? 2 : 1);
  const recta5 = v => plano({ extra: {
    segmentos: [recta(v.m, v.b, VEN, { color: 'o' })],
    puntos: [{ x: 0, y: v.b, rotulo: `(0; ${f(v.b)})`, lado: v.m > 0 ? 'no' : 'ne' }, { x: paso5(v), y: v.m * paso5(v) + v.b, color: 'o' }],
    alt: `Recta ${ecRecta(v.m, v.b)}`,
  } });
  const ecuaciones = {
    id: 'ecuaciones',
    titulo: 'Tres ecuaciones, una recta',
    temas: ['Ecuaciones de la recta'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Elige la pendiente m y el número b. La recta y = mx + b corta al eje y en b.',
      voz: 'Mira dónde cruza el eje y cuando cambias b.',
      controles: [
        { id: 'm', etiqueta: 'm', color: 'c-o', min: -2, max: 2, paso: 0.5, inicio: 1, decimales: 1 },
        { id: 'b', etiqueta: 'b', min: -3, max: 3, paso: 1, inicio: 1, decimales: 0 },
      ],
      dibujo: v => ({ datos: recta5(v), estado: {} }),
      lectura: v => [ecRecta(v.m, v.b)],
      minimo: 3,
      // Se arrastran el corte (0; b), que sube o baja la recta, y un punto de ella a 2 pasos (o a 1, si a 2 se
      // sale), que la inclina: la pendiente es lo que sube ese punto sobre el corte, por paso.
      arrastres: [
        { id: 'inclinar', etiqueta: 'punto de la recta: cambia m', color: 'c-o',
          donde: v => aPx(recta5(v), paso5(v), v.m * paso5(v) + v.b),
          mover: (pt, v) => ({ m: (dePx(recta5(v), pt).y - v.b) / paso5(v) }) },
        { id: 'corte-b', etiqueta: 'corte con el eje y: cambia b',
          donde: v => aPx(recta5(v), 0, v.b),
          mover: (pt, v) => ({ b: dePx(recta5(v), pt).y }) },
      ],
    },
    predice: {
      pregunta: 'Una recta tiene pendiente 3 y pasa por el punto (2; 1). ¿Cuál es su ecuación?',
      voz: 'El punto dado no tiene por qué estar sobre el eje y.',
      opciones: [
        { id: 'c', texto: 'y = 3x − 5', correcta: true },
        { id: 'b', texto: 'y = 3x + 1', error: 'ECU-B-PUNTO', siFuera: 'Usar el punto está bien; pero 1 es su y. El corte con el eje y está en x = 0.' },
        { id: 'invierte', texto: 'y − 2 = 3(x − 1)', error: 'ECU-INVIERTE', siFuera: 'La forma punto-pendiente está bien; se cambiaron la x y la y del punto.' },
        { id: 'signo', texto: '3x + y − 5 = 0', error: 'ECU-SIGNO', siFuera: 'La forma general está bien pensada; al pasar y, cambia de signo: 3x − y − 5 = 0.' },
      ],
      dibujo: { datos: plano({ extra: { puntos: [{ x: 2, y: 1, rotulo: '(2; 1)', lado: 'e' }], alt: 'El punto (2; 1)' } }), estado: {} },
      revelar: { datos: plano({ extra: { segmentos: [recta(3, -5, VEN, { color: 'o' })], puntos: [{ x: 2, y: 1, rotulo: '(2; 1)', lado: 'e' }, { x: 0, y: -5, color: 'o', rotulo: '(0; −5)', lado: 'e' }], alt: 'Recta de pendiente 3 que pasa por (2; 1) y corta al eje y en −5' } }), estado: {} },
      coincide: 'Coincide: al retroceder 2 pasos desde x = 2, baja 6: llega a −5.',
      noCoincide: 'Revisemos: desde (2; 1), retroceder 2 en x baja 6 en y.',
    },
    // Hallazgo 9: «Mira» es la misma pieza y la misma recta naranja del juego, con el caso de la predicción.
    mira: {
      datos: plano({ ventana: { x: [-4, 6], y: [-7, 4] }, extra: {
        segmentos: [recta(3, -5, { x: [-4, 6], y: [-7, 4] }, { color: 'o', desde: 1 }), { de: [0, -5], a: [2, -5], color: 'i', rotulo: 'Δx = 2', desde: 2 }, { de: [2, -5], a: [2, 1], color: 'h', rotulo: 'Δy = 6', desde: 2 }],
        puntos: [{ x: 2, y: 1, rotulo: '(2; 1)', lado: 'e' }, { x: 0, y: -5, color: 'o', desde: 2 }],
        rotulos: [{ x: -1.7, y: -5.3, texto: '(0; −5)', color: 'o', desde: 2 }],
        alt: 'Recta de pendiente 3 por (2; 1): retrocediendo 2 en x, baja 6, hasta (0; −5)',
      } }),
      voz: 'Una sola recta escrita de tres maneras.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Desde (2; 1), la recta sube 3 por cada paso.', ecuacion: ['y − 1 = 3(x − 2)'] },
        { estado: { corte: 2 }, texto: 'Despejando y aparece el corte con el eje y: −5.', ecuacion: ['y = 3x − 5'] },
        { estado: { corte: 2 }, texto: 'Pasando todo a un lado queda la forma general.', ecuacion: ['3x − y − 5 = 0', '   ·   ', m, ' = −', { frac: ['A', 'B'] }, ' = −', { frac: ['3', '−1'] }, ' = 3'] },
      ],
    },
    regla: {
      texto: 'Una recta no vertical queda fija con un punto y su pendiente. Las formas punto-pendiente, y = mx + b y general describen la misma recta.',
      ecuacion: [{ llave: ['y − ', sub('y', '0'), ' = ', m, '(x − ', sub('x', '0'), ')'], nota: 'punto y pendiente', color: 'c-o' }, '   ·   ', 'y = ', m, 'x + ', { llave: ['b'], nota: 'corte en y' }, '   ·   ', 'Ax + By + C = 0'],
      condicion: 'm existe: una recta vertical se escribe x = k. En la forma general, m = −A/B si B ≠ 0.',
      voz: 'Elige la forma que use los datos que tienes.',
    },
    ahoraTu: {
      voz: 'Escribe primero la forma punto-pendiente.',
      generar(sem) {
        const rr = azar(sem), mv = rr.sg() * rr.ent(1, 4), x0 = rr.ent(-4, 4) || 2, y0 = rr.ent(-4, 4), bv = y0 - mv * x0;
        const ec = (mm, bb) => `y = ${mm === 1 ? '' : mm === -1 ? '−' : f(mm)}x${bb ? ` ${bb < 0 ? '−' : '+'} ${f(Math.abs(bb))}` : ''}`;
        if (sem % 2 === 0) {
          return {
            pregunta: [`Una recta tiene pendiente ${f(mv)} y pasa por ${P(x0, y0)}. ¿Cuál es su ecuación?`],
            opciones: opciones(ec(mv, bv), [
              { id: 'b', valor: ec(mv, y0), error: 'ECU-B-PUNTO', siFuera: `${f(y0)} es la y del punto cuando x = ${f(x0)}; b es el corte con el eje y, en x = 0.` },
              { id: 'signo', valor: ec(mv, y0 + mv * x0), error: 'ECU-SIGNO', siFuera: 'La forma punto-pendiente está bien; al despejar, el signo de m·x₀ cambió.' },
              { id: 'invierte', valor: ec(mv, x0 - mv * y0), error: 'ECU-INVIERTE', siFuera: 'Se cambiaron la x y la y del punto al reemplazar.' },
            ], x => x),
            solucion: { texto: 'Punto-pendiente y después se despeja y.', ecuacion: [`${menos('y', y0)} = ${f(mv)}(${menos('x', x0)})  ⇒  ${ec(mv, bv)}`] },
          };
        }
        const Av = mv, Bv = rr.uno([1, 2, 3]) * rr.sg(), Cv = rr.ent(-6, 6);
        return {
          pregunta: [`¿Cuál es la pendiente de la recta ${f(Av)}x ${Bv < 0 ? '−' : '+'} ${f(Math.abs(Bv))}y ${Cv < 0 ? '−' : '+'} ${f(Math.abs(Cv))} = 0?`],
          opciones: opciones(fr(-Av, Bv), [
            { id: 'sin-signo', valor: fr(Av, Bv), error: 'ECU-M-GENERAL', siFuera: 'Dividir A entre B está bien; al despejar y aparece un signo menos: m = −A/B.' },
            { id: 'invierte', valor: fr(-Bv, Av), error: 'PEND-INVERSA', siFuera: 'Los coeficientes son los correctos, pero invertidos: m = −A/B.' },
            { id: 'A', valor: f(Av), error: 'ECU-M-GENERAL', siFuera: 'El coeficiente de x es la pendiente solo si el de y es −1.' },
          ], x => x),
          solucion: { texto: 'Se despeja y: la pendiente queda −A/B.', ecuacion: [m, ' = −', { frac: [f(Av), f(Bv)] }, ` = ${fr(-Av, Bv)}`] },
        };
      },
    },
  };

  // ---------- Idea 6: paralelas, perpendiculares y distancia a una recta ----------
  // Cambia: la pendiente m₂ de una segunda recta. · Permanece: la recta fija de pendiente 1/2.
  // Progresa: el producto m₁·m₂ y el ángulo entre las rectas. · Se reserva: la distancia de un punto a una recta,
  // que se mide por la perpendicular (la predicción). · Debe verse: el segmento más corto forma 90° con la recta.
  const M1 = 0.5;
  const entre = m2 => { const a = Math.abs(Math.atan(m2) - Math.atan(M1)) * GRA; return Math.min(a, 180 - a); };
  const RECTA34 = { x: [-1, 5], y: [-1, 4.4] };
  const dos6 = v => plano({ extra: {
    segmentos: [recta(M1, 1, VEN, { grosor: 'contorno' }), recta(v.m, -2, VEN, { color: 'o' })],
    puntos: [{ x: 0, y: -2 }, { x: 1.5, y: 1.5 * v.m - 2, color: 'o' }],
    alt: `Recta fija de pendiente 1/2 y recta naranja de pendiente ${f(v.m)}: forman ${f(entre(v.m), 1)} grados`,
  } });
  const perpendicular = {
    id: 'paralelas-perpendiculares',
    titulo: 'Paralelas, perpendiculares y distancia',
    temas: ['Paralelas, perpendiculares y distancia a una recta'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'La recta gris tiene pendiente 1/2. Elige la pendiente m₂ de la naranja y busca cuándo son paralelas y cuándo forman 90°.',
      voz: 'Mira el producto de las pendientes cuando forman 90°.',
      controles: [{ id: 'm', etiqueta: 'm₂', color: 'c-o', min: -3, max: 3, paso: 0.5, inicio: 2, decimales: 1 }],
      dibujo: v => ({ datos: dos6(v), estado: {} }),
      lectura: v => [sub(m, '1'), ' · ', sub(m, '2'), ` = ${f(M1 * v.m)} · ángulo ≈ ${f(entre(v.m), 1)}°`],
      minimo: 3,
      // Se arrastra un punto de la recta naranja: la recta gira alrededor de su corte (0; −2).
      arrastres: [{ id: 'girar-recta', etiqueta: 'punto de la recta naranja: cambia m₂', color: 'c-o',
        donde: v => aPx(dos6(v), 1.5, 1.5 * v.m - 2),
        mover: (pt, v) => { const q = dePx(dos6(v), pt), ax = Math.abs(q.x) < 0.3 ? (q.x < 0 ? -0.3 : 0.3) : q.x; return { m: (q.y + 2) / ax }; } }],
    },
    predice: {
      pregunta: '¿Cuál es la distancia del origen a la recta 3x + 4y − 10 = 0?',
      voz: 'De todos los caminos hasta la recta, busca el más corto.',
      opciones: [
        { id: 'c', texto: '2', correcta: true },
        { id: 'norma', texto: '10', error: 'DIST-SIN-NORMA', siFuera: '|−10| es el comienzo correcto; falta dividir entre √(3² + 4²) = 5.' },
        { id: 'coef', texto: `10/7 ≈ ${f(10 / 7)}`, error: 'DIST-SUMA-COEF', siFuera: 'Dividir 10 está bien; entre √(3² + 4²) = 5, no entre 3 + 4.' },
        { id: 'corte', texto: '2,5', error: 'DIST-CORTE', siFuera: '2,5 es el camino vertical hasta el corte con el eje y. El más corto es perpendicular.' },
      ],
      dibujo: { datos: plano({ ventana: RECTA34, extra: { segmentos: [recta(-0.75, 2.5, RECTA34, { grosor: 'contorno' })], puntos: [{ x: 0, y: 0, rotulo: 'O', lado: 'so' }], alt: 'Recta 3x + 4y − 10 = 0 y el origen' } }), estado: {} },
      revelar: { datos: plano({ ventana: RECTA34, extra: { segmentos: [recta(-0.75, 2.5, RECTA34, { grosor: 'contorno' }), { de: [0, 0], a: [1.2, 1.6], color: 'd', rotulo: 'd = 2' }, { de: [0, 0], a: [0, 2.5], discontinua: true }], rotulos: [{ x: -0.45, y: 1.25, texto: '2,5' }], puntos: [{ x: 0, y: 0, rotulo: 'O', lado: 'so' }, { x: 1.2, y: 1.6, color: 'd', rotulo: 'H', lado: 'ne' }], alt: 'El camino perpendicular del origen a la recta mide 2; el vertical, 2,5' } }), estado: {} },
      coincide: 'Coincide: el camino perpendicular mide 2, menos que cualquier otro.',
      noCoincide: 'Revisemos: el segmento verde, perpendicular a la recta, mide 2.',
    },
    // Hallazgo 9: el juego compara dos rectas; «Mira» pasa a la distancia punto-recta de la predicción, que se
    // mide justo por la perpendicular que el alumno buscó al jugar. Misma pieza, otro caso.
    mira: {
      datos: plano({ ventana: RECTA34, extra: {
        segmentos: [recta(-0.75, 2.5, RECTA34, { grosor: 'contorno' }), { de: [0, 0], a: [0, 2.5], discontinua: true, rotulo: '2,5', desde: 1, hasta: 1 }, { de: [0, 0], a: [10 / 3, 0], discontinua: true, rotulo: '3,33', desde: 1, hasta: 1 }, { de: [0, 0], a: [1.2, 1.6], color: 'd', rotulo: 'd = 2', desde: 2 }],
        puntos: [{ x: 0, y: 0, rotulo: 'O', lado: 'so' }, { x: 1.2, y: 1.6, color: 'd', rotulo: 'H(1,2; 1,6)', lado: 'ne', desde: 2 }],
        alt: 'Del origen a la recta 3x + 4y = 10: los caminos por los ejes miden 2,5 y 3,33; el perpendicular, 2',
      } }),
      voz: 'Compara varios caminos; el perpendicular gana.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Hay muchos caminos del origen a la recta; aquí, dos por los ejes.', ecuacion: ['2,5 y ', { frac: ['10', '3'] }] },
        { estado: { corte: 2 }, texto: 'El más corto es perpendicular a la recta, de pendiente 4/3.', ecuacion: [sub(m, '1'), ' · ', sub(m, '2'), ' = −', { frac: ['3', '4'] }, ' · ', { frac: ['4', '3'] }, ' = −1'] },
        { estado: { corte: 2 }, texto: 'Llega a H = (1,2; 1,6), a distancia 2 del origen.', ecuacion: [d, ' = ', { raiz: ['1,2² + 1,6²'] }, ' = 2'] },
        { estado: { corte: 2 }, texto: 'La fórmula hace esa cuenta de una vez.', ecuacion: [d, ' = ', { frac: [{ abs: ['3 · 0 + 4 · 0 − 10'] }, { raiz: ['3² + 4²'] }] }, ' = ', { frac: ['10', '5'] }, ' = 2'] },
      ],
    },
    regla: {
      texto: 'Las paralelas tienen la misma pendiente; las perpendiculares, pendientes cuyo producto es −1. La distancia de un punto a una recta se mide por la perpendicular.',
      ecuacion: [{ llave: [sub(m, '1'), ' = ', sub(m, '2')], nota: 'paralelas', color: 'c-o' }, '   ·   ', { llave: [sub(m, '1'), ' · ', sub(m, '2'), ' = −1'], nota: 'perpendiculares', color: 'c-o' }, '   ·   ', d, ' = ', { frac: [{ abs: ['A', sub('x', '0'), ' + B', sub('y', '0'), ' + C'] }, { raiz: [{ sup: ['A', '2'] }, ' + ', { sup: ['B', '2'] }] }] }],
      condicion: 'm₁·m₂ = −1 vale si ninguna es vertical. Una horizontal y una vertical también son perpendiculares.',
      voz: 'Perpendicular: invierte y cambia el signo.',
    },
    ahoraTu: {
      voz: 'Primero la pendiente de la recta dada; después la que se pide.',
      generar(sem) {
        const rr = azar(sem), tipo = sem % 3;
        if (tipo === 2) {
          const [a0, b0, c0] = rr.uno([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17]]);
          const x0 = rr.ent(-3, 3), y0 = rr.ent(-3, 3), dist = rr.ent(1, 4), sg = rr.sg();
          const Cv = sg * dist * c0 - a0 * x0 - b0 * y0;
          const nume = Math.abs(a0 * x0 + b0 * y0 + Cv);
          return {
            pregunta: [`¿Cuál es la distancia del punto ${P(x0, y0)} a la recta ${a0}x + ${b0}y ${Cv < 0 ? '−' : '+'} ${f(Math.abs(Cv))} = 0?`],
            opciones: opciones(dist, [
              { id: 'norma', valor: nume, error: 'DIST-SIN-NORMA', siFuera: `|${nume}| está bien; falta dividir entre √(A² + B²) = ${c0}.` },
              { id: 'coef', valor: Math.round(nume / (a0 + b0) * 100) / 100, error: 'DIST-SUMA-COEF', siFuera: `Dividir ${nume} está bien; entre √(A² + B²) = ${c0}, no entre A + B.` },
              { id: 'origen', valor: Math.round(Math.abs(Cv) / c0 * 100) / 100, error: 'DIST-CORTE', siFuera: 'Eso mide la distancia desde el origen. Hay que reemplazar el punto dado.' },
            ], x => f(x)),
            solucion: { texto: 'Se reemplaza el punto y se divide entre √(A² + B²).', ecuacion: [d, ' = ', { frac: [`|${a0}(${f(x0)}) + ${b0}(${f(y0)}) ${Cv < 0 ? '−' : '+'} ${f(Math.abs(Cv))}|`, `${c0}`] }, ` = ${dist}`] },
          };
        }
        const p = rr.sg() * rr.ent(1, 4), q = rr.ent(1, 4);
        if (tipo === 0 && sem % 4 === 0) {
          return {
            pregunta: ['Una recta es horizontal: y = 3. ¿Cómo es la recta perpendicular a ella que pasa por (2; 5)?'],
            opciones: [
              { id: 'c', texto: 'x = 2, una recta vertical', correcta: true },
              { id: 'horizontal', texto: 'y = 5', error: 'PAR-PERP', siFuera: 'y = 5 pasa por el punto, pero es paralela a y = 3, no perpendicular.' },
              { id: 'formula', texto: 'Su pendiente es −1/0', error: 'PERP-HORIZONTAL', siFuera: '−1/m vale si m ≠ 0. Con m = 0 no se divide: la perpendicular es vertical.' },
              { id: 'menos', texto: 'y = −x + 7', error: 'PERP-SIGNO', siFuera: 'Esa recta pasa por (2; 5), pero forma 45° con la horizontal, no 90°.' },
            ],
            solucion: { texto: 'La perpendicular a una horizontal es vertical: x = constante.', ecuacion: ['x = 2'] },
          };
        }
        const dada = fr(p, q), par = tipo === 0;
        return {
          pregunta: [`Una recta tiene pendiente ${dada}. ¿Qué pendiente tiene una recta ${par ? 'paralela' : 'perpendicular'} a ella?`],
          opciones: opciones(par ? dada : fr(-q, p), (par ? [
            { id: 'perp', valor: fr(-q, p), error: 'PAR-PERP', siFuera: 'Invertir y cambiar el signo da la perpendicular. Una paralela conserva la pendiente.' },
            { id: 'signo', valor: fr(-p, q), error: 'PERP-SIGNO', siFuera: 'Cambiar el signo da otra dirección. Las paralelas tienen la misma pendiente.' },
          ] : [
            { id: 'inversa', valor: fr(q, p), error: 'PERP-INVERSA', siFuera: 'Invertir está bien; también cambia el signo: el producto debe dar −1.' },
            { id: 'signo', valor: fr(-p, q), error: 'PERP-SIGNO', siFuera: 'Cambiar el signo está bien; también se invierte: el producto debe dar −1.' },
            { id: 'par', valor: dada, error: 'PAR-PERP', siFuera: 'La misma pendiente da una paralela, no una perpendicular.' },
          ]), x => x),
          solucion: { texto: par ? 'Las paralelas tienen la misma pendiente.' : 'Se invierte y se cambia el signo: el producto da −1.', ecuacion: par ? [sub(m, '2'), ` = ${dada}`] : [`${dada} · `, sub(m, '2'), ' = −1  ⇒  ', sub(m, '2'), ` = ${fr(-q, p)}`] },
        };
      },
    },
  };

  // ---------- Laboratorio ----------
  // Mesa 1: dos puntos libres en los cuatro cuadrantes: distancia, pendiente (también la vertical) y punto medio.
  const VLAB = { x: [-6, 7.5], y: [-6, 6] };     // más espacio a la derecha para los rótulos de Δy
  function dosPuntos(v) {
    const ax = v.x2 - v.x1, ay = v.y2 - v.y1, mx = (v.x1 + v.x2) / 2, my = (v.y1 + v.y2) / 2;
    const linea = ax === 0 && ay === 0 ? [] : [recta(ax === 0 ? null : ay / ax, ax === 0 ? v.x1 : v.y1 - (ay / ax) * v.x1, VLAB, { color: 'o', grosor: 'contorno', discontinua: true })];
    return plano({ ventana: VLAB, extra: {
      segmentos: linea.concat([
        { de: [v.x1, v.y1], a: [v.x2, v.y1], color: 'i', rotulo: ax ? `Δx = ${f(ax)}` : '' },
        { de: [v.x2, v.y1], a: [v.x2, v.y2], color: 'h', rotulo: ay ? `Δy = ${f(ay)}` : '' },
        { de: [v.x1, v.y1], a: [v.x2, v.y2], color: 'd' },
      ]),
      puntos: [{ x: v.x1, y: v.y1, rotulo: 'A', lado: 'so' }, { x: v.x2, y: v.y2, rotulo: 'B', lado: 'ne' }, { x: mx, y: my, color: 'd', rotulo: 'M', lado: 'no' }],
      alt: `A ${P(v.x1, v.y1)} y B ${P(v.x2, v.y2)}: distancia ${f(Math.hypot(ax, ay))}, punto medio ${P(mx, my)}`,
    } });
  }
  // Mesa 2: una recta y un punto: el pie de la perpendicular H y la distancia d (y el caso d = 0).
  const pasoLab = v => (Math.abs(2 * v.m + v.b) <= 5.5 ? 2 : 1);
  function rectaPunto(v) {
    const t = (v.px + (v.py - v.b) * v.m) / (1 + v.m * v.m), hx = t, hy = v.b + v.m * t;
    const dd = Math.abs(v.m * v.px - v.py + v.b) / Math.hypot(1, v.m);
    return plano({ extra: {
      segmentos: [recta(v.m, v.b, VEN, { color: 'o' })].concat(dd > 1e-9 ? [{ de: [v.px, v.py], a: [hx, hy], color: 'd', rotulo: `d ≈ ${f(dd)}` }] : []),
      puntos: [{ x: 0, y: v.b }, { x: pasoLab(v), y: v.m * pasoLab(v) + v.b, color: 'o' }, { x: hx, y: hy, color: 'd', rotulo: 'H', lado: 'se', abierto: true }, { x: v.px, y: v.py, rotulo: 'P', lado: 'ne' }],
      alt: `Recta ${ecRecta(v.m, v.b)} y punto P ${P(v.px, v.py)}: distancia ${f(dd)} por la perpendicular`,
    } });
  }
  // Mesa 3: tres vértices libres: el determinante con su signo (sentido de recorrido), el área y el baricentro.
  const triLab = v => [[v.ax, v.ay], [v.bx, v.by], [v.cx, v.cy]];
  function triLibre(v) {
    const pts = triLab(v), g = [(v.ax + v.bx + v.cx) / 3, (v.ay + v.by + v.cy) / 3];
    return triangulo(pts, { puntos: pts.map((q, k) => ({ x: q[0], y: q[1], rotulo: 'PQR'[k], lado: ['so', 'n', 'e'][k] })).concat([{ x: g[0], y: g[1], color: 'o', rotulo: 'G', lado: 's' }]),
      alt: `Triángulo ${pts.map(q => P(q[0], q[1])).join(', ')}: área ${f(Math.abs(det(...pts)) / 2)}` });
  }
  const manijaPunto = (id, etiqueta, dib, kx, ky) => ({ id, etiqueta,
    donde: v => aPx(dib(v), v[kx], v[ky]),
    mover: (pt, v) => { const q = dePx(dib(v), pt); return { [kx]: q.x, [ky]: q.y }; } });
  const coord = (id, etiqueta, inicio) => ({ id, etiqueta, min: -5, max: 5, paso: 1, inicio, decimales: 0 });
  const laboratorio = [
    {
      id: 'dos-puntos', titulo: 'Dos puntos en cualquier cuadrante', pieza: 'trig-plano',
      consigna: 'Arrastra A y B por los cuatro cuadrantes. Pon los dos en la misma vertical y mira qué pasa con la pendiente.',
      controles: [coord('x1', 'x de A', -3), coord('y1', 'y de A', -2), coord('x2', 'x de B', 3), coord('y2', 'y de B', 4)],
      dibujo: v => ({ datos: dosPuntos(v), estado: {} }),
      lectura: v => {
        const ax = v.x2 - v.x1, ay = v.y2 - v.y1;
        return [d, ` ≈ ${f(Math.hypot(ax, ay))} · `, m, ax ? ` = ${fr(ay, ax)}` : ': no hay (vertical)', ` · M = ${P((v.x1 + v.x2) / 2, (v.y1 + v.y2) / 2)}`];
      },
      arrastres: [manijaPunto('punto-a', 'punto A', dosPuntos, 'x1', 'y1'), manijaPunto('punto-b', 'punto B', dosPuntos, 'x2', 'y2')],
    },
    {
      id: 'recta-y-punto', titulo: 'El camino más corto', pieza: 'trig-plano',
      consigna: 'Mueve el punto P, el corte y la inclinación de la recta. El segmento verde es perpendicular: el camino más corto hasta ella.',
      controles: [
        { id: 'm', etiqueta: 'm', color: 'c-o', min: -3, max: 3, paso: 0.5, inicio: 0.5, decimales: 1 },
        { id: 'b', etiqueta: 'b', min: -3, max: 3, paso: 1, inicio: -1, decimales: 0 },
        coord('px', 'x de P', -2), coord('py', 'y de P', 3),
      ],
      dibujo: v => ({ datos: rectaPunto(v), estado: {} }),
      lectura: v => {
        const dd = Math.abs(v.m * v.px - v.py + v.b) / Math.hypot(1, v.m);
        return [`${ecRecta(v.m, v.b)} · P${P(v.px, v.py)} · `, d, dd > 1e-9 ? ` ≈ ${f(dd)}` : ' = 0: P está en la recta'];
      },
      arrastres: [
        manijaPunto('punto-p', 'punto P', rectaPunto, 'px', 'py'),
        { id: 'inclinar', etiqueta: 'punto de la recta: cambia m', color: 'c-o',
          donde: v => aPx(rectaPunto(v), pasoLab(v), v.m * pasoLab(v) + v.b),
          mover: (pt, v) => ({ m: (dePx(rectaPunto(v), pt).y - v.b) / pasoLab(v) }) },
        { id: 'corte-b', etiqueta: 'corte con el eje y: cambia b',
          donde: v => aPx(rectaPunto(v), 0, v.b),
          mover: (pt, v) => ({ b: dePx(rectaPunto(v), pt).y }) },
      ],
    },
    {
      id: 'triangulo-libre', titulo: 'Tres vértices y el signo', pieza: 'trig-plano',
      consigna: 'Arrastra P, Q y R. El determinante cambia de signo si los recorres al revés; el área no. Prueba ponerlos en línea.',
      controles: [coord('ax', 'x de P', -3), coord('ay', 'y de P', -2), coord('bx', 'x de Q', 0), coord('by', 'y de Q', 4), coord('cx', 'x de R', 4), coord('cy', 'y de R', -1)],
      dibujo: v => ({ datos: triLibre(v), estado: {} }),
      lectura: v => {
        const D = det(...triLab(v));
        return [A, ` = ${f(Math.abs(D) / 2)} · det = ${f(D)} · `, D > 0 ? 'P, Q, R antihorario' : D < 0 ? 'P, Q, R horario' : 'en línea, sin área'];
      },
      arrastres: [manijaPunto('vertice-p', 'vértice P', triLibre, 'ax', 'ay'), manijaPunto('vertice-q', 'vértice Q', triLibre, 'bx', 'by'), manijaPunto('vertice-r', 'vértice R', triLibre, 'cx', 'cy')],
    },
  ];

  return {
    unidad: 'trigonometria.recta-en-el-plano',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/trig-plano.js'],
    // Laboratorio: dos puntos libres (incluida la vertical), recta y punto con la perpendicular (y d = 0), y
    // un triángulo de vértices libres con el signo del determinante (incluidos los vértices en línea).
    laboratorio,
    historia: {
      texto: 'En el siglo XVII, Fermat estudió lugares geométricos con relaciones algebraicas y los compartió por cartas, al mismo tiempo que Descartes desarrollaba su geometría. El plano cartesiano no nació de una sola ocurrencia. La idea clave: todos los puntos de una recta cumplen una misma relación entre x e y, y la pendiente la resume.',
      pregunta: '¿Qué tienen en común todos los puntos de una misma recta?',
      fuente: { titulo: 'J. J. O’Connor y E. F. Robertson, «Pierre de Fermat», MacTutor, University of St Andrews', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Fermat/' },
    },
    ideas: [distancia, division, area, pendiente, ecuaciones, perpendicular],
  };
});
