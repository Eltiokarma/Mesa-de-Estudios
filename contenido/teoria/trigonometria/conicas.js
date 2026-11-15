/*
 * Teoría de «Lugar geométrico y cónicas» (trigonometria.conicas), 5.º de secundaria.
 * Fuente del contenido: docs/teoria/matriz/trigonometria.json (unidad 18), docs/teoria/fuentes/historia-ecuaciones.pdf
 * (trigonometría, pp. 82–100) y las «Precisiones de Geometría y Trigonometría» del expediente. Forma: angulo-trigonometrico.js.
 * Compañera: Mara (coneja), cercana y rigurosa: primero la condición del lugar; después la ecuación.
 * Colores (regla 4): la distancia al foco PF (y PF₁) en turquesa (c-i); la otra distancia de la condición, PD a la
 * directriz o PF₂ al segundo foco, en verde (c-d); los parámetros de forma p, a, b, c y el ángulo de giro θ de los
 * ejes en naranja (c-o: no salen juntos); la curva, el lugar que se busca, en rojo (c-h).
 * Ronda 2 (14 nov, noche): manijas en las cinco ideas (el punto P, el lápiz P y el foco F₂, P sobre la rama, la recta
 * por su corte con el eje y, el eje x′), llaves en las reglas, separadores «   ·   » y laboratorio de tres mesas. Las
 * cinco ideas usan la misma figura en «Juega» y en «Mira» (hallazgo 9 de docs/auditoria-teoria.md).
 * Errores (hipótesis de aula; docs/investigacion/trigonometria-ideas-erroneas.md deja fuera las cónicas): LUGAR-CIRCULO,
 * PAR-SIN-4P, PAR-2P, PAR-EJE, ELI-RESTA, ELI-HIP, ELI-C, ELI-EJE, HIP-ELIPSE, TAN-ORIGEN, TAN-SIGNO, TAN-NUNCA,
 * TAN-UN-CORTE, TAN-P, CON-DISCRIMINANTE, CON-PUNTO, ROT-DOBLE, ROT-TAN.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: pasar de la condición sobre distancias a la ecuación de la cónica, y de una ecuación general a su forma.
 *   Persona y condiciones: postulante de 5.º, celular de 360 px de gama baja, con o sin conexión, en el aula o en casa.
 *   Resultado observable: halla foco, semiejes o tangente desde la ecuación, y clasifica una ecuación general revisando que tenga puntos.
 *   Orden de atención: 1.º el punto P y sus dos distancias · 2.º la curva que forman los puntos que cumplen ·
 *     acción: mover P, un foco, una recta o los ejes · fondo: la cuadrícula a una sola escala.
 *   Estados: juego sin tocar · probando · predicción pendiente · coincide / no coincide · paso de «Mira» · caso nuevo.
 *   Duda que resuelve: ¿por qué b² = a² − c² en la elipse y c² = a² + b² en la hipérbola, y por qué B² − 4AC no basta?
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const def = nodo ? fabrica(require('../../../nucleo/kit/kit.js'), require('../../../plantillas/conicas/motor.js'))
    : fabrica(root.Kit, root.MotorConicas);
  if (nodo) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit, MCo) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const PF = { v: 'c-i', t: 'PF' }, PF1 = { sub: [{ v: 'c-i', t: 'PF' }, '1'] }, PF2 = { sub: [{ v: 'c-d', t: 'PF' }, '2'] }, PD = { v: 'c-d', t: 'PD' };
  const p = { v: 'c-o', t: 'p' }, a = { v: 'c-o', t: 'a' }, b = { v: 'c-o', t: 'b' }, c = { v: 'c-o', t: 'c' }, th = { v: 'c-o', t: 'θ' };
  const RAD = Math.PI / 180;
  const sen = g => Math.sin(g * RAD), cos = g => Math.cos(g * RAD);
  const sq = x => ({ sup: [x, '2'] });
  const SEP = '   ·   ';
  // Gesto directo (docs/teoria.md §4b): las manijas usan la geometría de la pieza.
  const TP = () => Kit.piezas['trig-plano'];
  const gr = r => r / RAD;
  // Azar con semilla para «Ahora tú» (el de la unidad de referencia).
  function azar(sem) {
    let q = (sem * 2654435761 + 12345) >>> 0;
    const rr = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    rr.ent = (lo, hi) => lo + Math.floor(rr() * (hi - lo + 1));
    rr.uno = xs => xs[Math.floor(rr() * xs.length)];
    return rr;
  }
  // Opciones distintas: la correcta primero; los distractores que repiten un texto se descartan.
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      if (typeof d.valor === 'number' && !Number.isFinite(d.valor)) continue;
      const txt = fmt(d.valor);
      if (vistos.has(txt)) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }
  // Puntos de una curva paramétrica, de t0 a t1.
  const curva = (fn, t0, t1, n = 120) => Array.from({ length: n + 1 }, (_, i) => fn(t0 + (t1 - t0) * i / n));
  const par = (x, y) => `(${f(x)}; ${f(y)})`;
  const sg = (x, txt) => (x < 0 ? ` − ${txt(-x)}` : ` + ${txt(x)}`);

  // ---------- Idea 1: el lugar de los puntos con PF = PD ----------
  // Cambia: la posición de un punto P en la cuadrícula. · Permanece: el foco F(0; 1) y la directriz y = −1.
  // Progresa: las dos distancias PF y PD, que a veces coinciden. · Se reserva: la ecuación de todos los puntos
  // que cumplen (la predicción). · Debe verse: que la curva es exactamente el conjunto de los que cumplen.
  const PARAB = { puntos: curva(x => [x, x * x / 4], -3.6, 3.6), color: 'h' };
  function lugar(x, y, extra = {}) {
    const dF = Math.hypot(x, y - 1), dD = y + 1, ok = Math.abs(dF - dD) < 1e-9;
    return Object.assign({
      ventana: { x: [-3.6, 3.6], y: [-2.1, 4.4] }, numeros: 1,
      rectas: [{ y: -1, color: 'd' }],
      rotulos: [{ x: 3.5, y: -1.75, texto: 'directriz y = −1', color: 'd', ancla: 'end' }],
      segmentos: [{ de: [x, y], a: [0, 1], color: 'i' }, { de: [x, y], a: [x, -1], color: 'd' }],
      puntos: [{ x: 0, y: 1, rotulo: 'F', lado: 'o' }, { x, y, color: ok ? 'h' : undefined, rotulo: ok ? 'P cumple' : 'P', lado: x >= 0 ? 'e' : 'o' }],
      alt: `Foco F(0; 1), directriz y = −1 y un punto P${par(x, y)}: PF = ${f(dF)}, PD = ${f(dD)}`,
    }, extra);
  }
  const parabola = {
    id: 'lugar-parabola',
    titulo: 'Un lugar: PF = PD',
    temas: ['Lugar geométrico', 'Parábola'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Mueve el punto P. Compara su distancia al foco F con su distancia a la directriz. Busca puntos donde las dos midan lo mismo.',
      voz: 'Conservemos la condición: cada punto se prueba con las dos distancias.',
      controles: [
        { id: 'x', etiqueta: 'x de P', min: -3, max: 3, paso: 1, inicio: 1, decimales: 0 },
        { id: 'y', etiqueta: 'y de P', min: 0, max: 4, paso: 0.5, inicio: 2, decimales: 1 },
      ],
      dibujo: val => ({ datos: lugar(val.x, val.y), estado: {} }),
      lectura: val => {
        const dF = Math.hypot(val.x, val.y - 1), dD = val.y + 1;
        return [PF, ` ≈ ${f(dF)}`, SEP, PD, ` = ${f(dD)}`, SEP, Math.abs(dF - dD) < 1e-9 ? 'cumple' : 'no cumple'];
      },
      minimo: 4,
      // Se arrastra el punto P por la cuadrícula; sus dos distancias lo siguen.
      arrastres: [{ id: 'punto-p', etiqueta: 'punto P', color: 'c-h',
        donde: val => TP().enPx(lugar(val.x, val.y), val.x, val.y),
        mover: (pt, val) => TP().delPx(lugar(val.x, val.y), pt) }],
    },
    predice: {
      pregunta: 'Todos los puntos con PF = PD forman una curva. Con el foco F(0; 1) y la directriz y = −1, ¿cuál es su ecuación?',
      voz: 'Prueba cada opción con un punto que ya viste cumplir.',
      opciones: [
        { id: 'c', texto: 'x² = 4y', correcta: true },
        { id: 'sin4p', texto: 'y = x²', error: 'PAR-SIN-4P', siFuera: 'Bien: es una parábola con vértice en el origen. Pero (2; 1) cumple, y 2² no es 1.' },
        { id: '2p', texto: 'x² = 2y', error: 'PAR-2P', siFuera: 'Bien la forma. Al desarrollar, −2y y +2y no se cancelan: se suman en 4y.' },
        { id: 'circulo', texto: 'x² + y² = 1', error: 'LUGAR-CIRCULO', siFuera: 'Ese es el lugar a distancia 1 del origen. Aquí se comparan dos distancias.' },
      ],
      dibujo: { datos: lugar(2, 1, { segmentos: [], puntos: [{ x: 0, y: 1, rotulo: 'F', lado: 'o' }] }), estado: {} },
      revelar: { datos: lugar(2, 1, { curvas: [Object.assign({ rotulo: 'x² = 4y', en: [-3, 2.25], lado: 'o' }, PARAB)], puntos: [{ x: 0, y: 1, rotulo: 'F', lado: 'o' }, { x: 2, y: 1, color: 'h', rotulo: '(2; 1)', lado: 'e' }, { x: -2, y: 1, color: 'h' }, { x: 0, y: 0, color: 'h' }] }), estado: {} },
      coincide: 'Coincide: x² = 4y; el punto (2; 1) cumple: 4 = 4 · 1.',
      noCoincide: 'Revisemos con el punto (2; 1), que cumple PF = PD = 2.',
    },
    mira: {
      datos: lugar(2, 1, {
        segmentos: [{ de: [2, 1], a: [0, 1], color: 'i', desde: 2 }, { de: [2, 1], a: [2, -1], color: 'd', desde: 3 }],
        puntos: [{ x: 0, y: 1, rotulo: 'F', lado: 'o' }, { x: 2, y: 1, rotulo: 'P(x; y)', lado: 'e', desde: 2 }, { x: 0, y: 0, color: 'h', rotulo: 'V', lado: 'so', desde: 5 }],
        curvas: [Object.assign({ desde: 4, rotulo: 'x² = 4y', en: [-3, 2.25], lado: 'o' }, PARAB)],
      }),
      voz: 'Dos distancias iguales; se elevan al cuadrado y se ordenan.',
      pasos: [
        { estado: { corte: 1 }, texto: 'La condición usa un foco y una recta.', ecuacion: ['F(0; 1)', SEP, 'directriz y = −1'] },
        { estado: { corte: 2 }, texto: 'La distancia de P al foco.', ecuacion: [PF, ' = ', { raiz: [sq('x'), ' + ', sq('(y − 1)')] }] },
        { estado: { corte: 3 }, texto: 'La distancia de P a la directriz es vertical.', ecuacion: [PD, ' = y + 1'] },
        { estado: { corte: 4 }, texto: 'Se igualan y se elevan al cuadrado: −2y y +2y se juntan.', ecuacion: [sq('x'), ' + ', sq('(y − 1)'), ' = ', sq('(y + 1)'), '  ⇒  ', sq('x'), ' = 4y'] },
        { estado: { corte: 5 }, texto: 'El vértice queda a mitad de camino entre F y la directriz.', ecuacion: ['V(0; 0)', SEP, p, ' = VF = 1'] },
      ],
    },
    regla: {
      texto: 'La parábola es el lugar de los puntos que están a la misma distancia del foco que de la directriz. Con F(0; p) y directriz y = −p:',
      ecuacion: [{ llave: [PF], nota: 'al foco', color: 'c-i' }, ' = ', { llave: [PD], nota: 'a la directriz', color: 'c-d' }, SEP, sq('x'), ' = 4', p, 'y'],
      condicion: 'lugar geométrico: todo punto que cumple está en la curva, y todo punto de la curva cumple. p ≠ 0.',
      voz: 'Una ecuación de lugar se prueba en los dos sentidos.',
    },
    ahoraTu: {
      voz: 'Compara la ecuación con x² = 4py o con y² = 4px.',
      generar(sem) {
        const rr = azar(sem), pv = rr.uno([-3, -2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2, 3, 4]), N = 4 * pv, tipo = sem % 3;
        if (tipo === 2) {
          return {
            pregunta: [`Una parábola tiene foco F(0; ${f(pv)}) y directriz y = ${f(-pv)}. ¿Cuál es su ecuación?`],
            opciones: opciones(`x² = ${f(N)}y`, [
              { id: 'sin4p', valor: `x² = ${f(pv)}y`, error: 'PAR-SIN-4P', siFuera: 'Bien la forma x² = ky. Pero k = 4p, no p.' },
              { id: '2p', valor: `x² = ${f(2 * pv)}y`, error: 'PAR-2P', siFuera: 'Al desarrollar, los dos términos en y se suman: queda 4p.' },
              { id: 'eje', valor: `y² = ${f(N)}x`, error: 'PAR-EJE', siFuera: 'Esa abre hacia los lados. Con el foco sobre el eje y, abre hacia arriba o abajo.' },
            ], v => v),
            solucion: { texto: `PF = PD con p = ${f(pv)} da x² = 4py.`, ecuacion: [sq('x'), ` = 4 · ${f(pv)} · y = ${f(N)}y`] },
          };
        }
        const vert = tipo === 0, ec = vert ? `x² = ${f(N)}y` : `y² = ${f(N)}x`;
        const bien = vert ? par(0, pv) : par(pv, 0);
        return {
          pregunta: [`¿Dónde está el foco de la parábola ${ec}?`],
          opciones: opciones(bien, [
            { id: 'sin4p', valor: vert ? par(0, N) : par(N, 0), error: 'PAR-SIN-4P', siFuera: `El número que acompaña es 4p. Hay que dividir ${f(N)} entre 4.` },
            { id: '2p', valor: vert ? par(0, N / 2) : par(N / 2, 0), error: 'PAR-2P', siFuera: 'Eso divide entre 2. El coeficiente es 4p: se divide entre 4.' },
            { id: 'eje', valor: vert ? par(pv, 0) : par(0, pv), error: 'PAR-EJE', siFuera: 'El foco está sobre el eje de la variable que no va al cuadrado.' },
          ], v => `F${v}`),
          solucion: { texto: `4p = ${f(N)}, así que p = ${f(pv)}.`, ecuacion: [p, ` = ${f(N)}/4 = ${f(pv)}`, SEP, `F${bien}`] },
        };
      },
    },
  };

  // ---------- Idea 2: la elipse, la cuerda del jardinero ----------
  // Cambia: la separación c de los focos y la posición de P sobre la curva. · Permanece: la cuerda 2a = 10.
  // Progresa: PF₁ y PF₂ cambian, su suma no. · Se reserva: el semieje menor con c = 4 (la predicción; el juego llega
  // a c = 3). · Debe verse: el triángulo b, c, a en el punto más alto, con a de hipotenusa.
  function elipse(cv, tg, extra = {}) {
    const bv = Math.sqrt(25 - cv * cv), P = [5 * cos(tg), bv * sen(tg)];
    return Object.assign({
      ventana: { x: [-6, 6], y: [-5.6, 5.6] }, numeros: 1,
      curvas: [{ puntos: curva(t => [5 * Math.cos(t), bv * Math.sin(t)], 0, 2 * Math.PI), color: 'h' }],
      segmentos: [{ de: P, a: [-cv, 0], color: 'i' }, { de: P, a: [cv, 0], color: 'd' }],
      puntos: [{ x: -cv, y: 0, rotulo: 'F₁', lado: 's' }, { x: cv, y: 0, rotulo: 'F₂', lado: 's' }, { x: P[0], y: P[1], rotulo: 'P', lado: P[1] >= 0 ? 'n' : 's' }],
      alt: `Elipse con focos en más y menos ${f(cv)} y cuerda 2a = 10; P en la curva`,
    }, extra);
  }
  // Ángulo (0° a 360°) del punto (u, v) del círculo auxiliar: el parámetro t del lápiz.
  const angExc = (u, v) => { const g = gr(Math.atan2(v, u)); return g < 0 ? g + 360 : g; };
  const elipseIdea = {
    id: 'elipse',
    titulo: 'La cuerda del jardinero',
    temas: ['Elipse', 'Lugar geométrico'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Una cuerda de largo 2a = 10 está atada a los dos focos. Separa los focos con c y recorre la curva con el lápiz P.',
      voz: 'Suma las dos distancias en cada punto.',
      controles: [
        { id: 'c', etiqueta: 'c', color: 'c-o', min: 0, max: 3, paso: 1, inicio: 2, decimales: 0 },
        { id: 't', etiqueta: 'lápiz P', min: 0, max: 330, paso: 30, inicio: 60, unidad: '°', decimales: 0 },
      ],
      dibujo: val => ({ datos: elipse(val.c, val.t), estado: {} }),
      lectura: val => {
        const bv = Math.sqrt(25 - val.c * val.c), P = [5 * cos(val.t), bv * sen(val.t)], d1 = Math.hypot(P[0] + val.c, P[1]);
        return [PF1, ' + ', PF2, ` ≈ ${f(d1)} + ${f(10 - d1)} = 10`];
      },
      minimo: 4,
      // Se arrastra el lápiz P por la curva (su ángulo excéntrico) y el foco F₂ por el eje (la separación c).
      arrastres: [
        { id: 'lapiz-p', etiqueta: 'lápiz P sobre la curva', color: 'c-h',
          donde: val => TP().enPx(elipse(val.c, val.t), 5 * cos(val.t), Math.sqrt(25 - val.c * val.c) * sen(val.t)),
          mover: (pt, val) => { const q = TP().delPx(elipse(val.c, val.t), pt); return { t: angExc(q.x / 5, q.y / Math.sqrt(25 - val.c * val.c)) }; } },
        { id: 'foco-2', etiqueta: 'foco F₂: cambia c', color: 'c-o',
          donde: val => TP().enPx(elipse(val.c, val.t), val.c, 0),
          mover: (pt, val) => ({ c: TP().delPx(elipse(val.c, val.t), pt).x }) },
      ],
    },
    predice: {
      pregunta: 'La cuerda sigue midiendo 2a = 10, pero ahora los focos están en (−4; 0) y (4; 0). ¿Cuánto mide b, la altura del punto más alto de la curva?',
      voz: 'Piensa en el lápiz justo arriba del centro.',
      opciones: [
        { id: 'c', texto: '3', correcta: true },
        { id: 'resta', texto: '1, que es a − c', error: 'ELI-RESTA', siFuera: 'Eso mide del foco al extremo del eje mayor. La altura sale de un triángulo rectángulo.' },
        { id: 'hip', texto: '√41 ≈ 6,4', error: 'ELI-HIP', siFuera: 'Eso suma a² + c². En la elipse, a es la hipotenusa: b² = a² − c².' },
        { id: 'c4', texto: '4, como c', error: 'ELI-C', siFuera: '4 es c, del centro al foco. b es la altura del punto más alto.' },
      ],
      dibujo: { datos: elipse(4, 90, { curvas: [], segmentos: [], puntos: [{ x: -4, y: 0, rotulo: 'F₁', lado: 's' }, { x: 4, y: 0, rotulo: 'F₂', lado: 's' }] }), estado: {} },
      revelar: { datos: elipse(4, 90, {
        numeros: 0,
        segmentos: [{ de: [0, 3], a: [-4, 0], color: 'i', rotulo: '5' }, { de: [0, 3], a: [4, 0], color: 'd', rotulo: '5' }, { de: [0, 0], a: [0, 3], color: 'o', rotulo: 'b = 3' }, { de: [0, 0], a: [4, 0], color: 'o' }],
        rotulos: [{ x: 2, y: -0.9, texto: 'c = 4', color: 'o' }],
      }), estado: {} },
      coincide: 'Coincide: 3, 4 y 5 forman un triángulo rectángulo.',
      noCoincide: 'Revisemos con el triángulo de lados b, c y a.',
    },
    mira: {
      datos: elipse(4, 90, {
        numeros: 0,
        curvas: [{ puntos: curva(t => [5 * Math.cos(t), 3 * Math.sin(t)], 0, 2 * Math.PI), color: 'h', desde: 5, rotulo: 'x²/25 + y²/9 = 1', en: [2.6, 2.6], lado: 'ne' }],
        segmentos: [{ de: [0, 3], a: [-4, 0], color: 'i', desde: 1 }, { de: [0, 3], a: [4, 0], color: 'd', desde: 1 }, { de: [0, 0], a: [4, 0], color: 'o', desde: 3 }, { de: [0, 0], a: [0, 3], color: 'o', desde: 4 }],
        puntos: [{ x: -4, y: 0, rotulo: 'F₁', lado: 's' }, { x: 4, y: 0, rotulo: 'F₂', lado: 's' }, { x: 0, y: 3, rotulo: 'B', lado: 'n', desde: 1 }],
        rotulos: [{ x: -2.9, y: 1.9, texto: '5', color: 'i', desde: 2 }, { x: 2.9, y: 1.9, texto: '5', color: 'd', desde: 2 }, { x: 2, y: -0.9, texto: 'c = 4', color: 'o', desde: 3 }, { x: 0.25, y: 1.3, texto: 'b', color: 'o', ancla: 'start', desde: 4 }],
      }),
      voz: 'El punto más alto reparte la cuerda en dos mitades iguales.',
      pasos: [
        { estado: { corte: 1 }, texto: 'En el punto más alto, B, las dos distancias son iguales.', ecuacion: [PF1, ' = ', PF2] },
        { estado: { corte: 2 }, texto: 'Como suman 10, cada una mide a = 5.', ecuacion: [PF1, ' = ', PF2, ' = ', a, ' = 5'] },
        { estado: { corte: 3 }, texto: 'Del centro al foco hay c = 4.', ecuacion: [c, ' = 4'] },
        { estado: { corte: 4 }, texto: 'b, c y a forman un triángulo rectángulo.', ecuacion: [sq(b), ' = ', sq(a), ' − ', sq(c), ' = 25 − 16 = 9'] },
        { estado: { corte: 5 }, texto: 'Con a y b se escribe la ecuación.', ecuacion: [{ frac: [sq('x'), '25'] }, ' + ', { frac: [sq('y'), '9'] }, ' = 1'] },
      ],
    },
    regla: {
      texto: 'La elipse es el lugar de los puntos cuya suma de distancias a dos focos es 2a. Centrada en el origen, con el eje focal sobre el eje x:',
      ecuacion: [PF1, ' + ', PF2, ' = ', { llave: ['2', a], nota: 'la cuerda', color: 'c-o' }, SEP, { frac: [sq('x'), sq(a)] }, ' + ', { frac: [sq('y'), sq(b)] }, ' = 1', SEP, { llave: [sq(a)], nota: 'el mayor', color: 'c-o' }, ' = ', sq(b), ' + ', sq(c)],
      condicion: 'a > c ≥ 0. Con c = 0 es una circunferencia; con a = c, el lugar es el segmento entre los focos.',
      voz: 'En la elipse, a es el mayor de los tres.',
    },
    ahoraTu: {
      voz: 'El denominador mayor dice en qué eje están los focos.',
      generar(sem) {
        const rr = azar(sem), terna = rr.uno([[5, 3, 4], [5, 4, 3], [10, 6, 8], [13, 5, 12], [13, 12, 5], [17, 8, 15], [25, 7, 24]]);
        const [av, bv, cv] = terna, enY = sem % 2 === 1;
        const ec = enY ? `x²/${f(bv * bv)} + y²/${f(av * av)} = 1` : `x²/${f(av * av)} + y²/${f(bv * bv)} = 1`;
        const fx = v => (enY ? `(0; ±${f(v)})` : `(±${f(v)}; 0)`);
        return {
          pregunta: [`¿Dónde están los focos de la elipse ${ec}?`],
          opciones: opciones(cv, [
            { id: 'hip', valor: Math.sqrt(av * av + bv * bv), error: 'ELI-HIP', siFuera: 'Eso suma los cuadrados, como en la hipérbola. En la elipse, c² = a² − b².' },
            { id: 'resta', valor: av - bv, error: 'ELI-RESTA', siFuera: 'Se restan los cuadrados, no los semiejes: c² = a² − b².' },
            { id: 'eje', valor: -cv, error: 'ELI-EJE', siFuera: 'Bien c. Pero los focos van sobre el eje del denominador mayor.' },
          ], v => (v < 0 ? (enY ? `(±${f(-v)}; 0)` : `(0; ±${f(-v)})`) : fx(v))),
          solucion: { texto: `El denominador mayor es a² = ${f(av * av)}, en ${enY ? 'y' : 'x'}.`, ecuacion: [sq(c), ` = ${f(av * av)} − ${f(bv * bv)} = ${f(cv * cv)}`, SEP, c, ` = ${f(cv)}`] },
        };
      },
    },
  };

  // ---------- Idea 3: la hipérbola, la diferencia que no cambia ----------
  // Cambia: el número a y la posición de P sobre la rama derecha. · Permanece: los focos en (±5; 0).
  // Progresa: PF₁ y PF₂ crecen juntos, su diferencia no. · Se reserva: el número b y las asíntotas (la predicción).
  // Debe verse: en la hipérbola, c es la diagonal del rectángulo de lados a y b.
  function hiperbola(av, u, extra = {}) {
    const bv = Math.sqrt(25 - av * av), U = Math.min(Math.asinh(5.3 / bv), Math.acosh(6.8 / av));
    const P = [av * Math.cosh(u), bv * Math.sinh(u)];
    return Object.assign({
      ventana: { x: [-7, 7], y: [-5.6, 5.6] }, numeros: 1,
      curvas: [{ puntos: curva(s => [av * Math.cosh(s), bv * Math.sinh(s)], -U, U), color: 'h' }, { puntos: curva(s => [-av * Math.cosh(s), bv * Math.sinh(s)], -U, U), color: 'h' }],
      segmentos: [{ de: P, a: [-5, 0], color: 'i' }, { de: P, a: [5, 0], color: 'd' }],
      puntos: [{ x: -5, y: 0, rotulo: 'F₁', lado: 's' }, { x: 5, y: 0, rotulo: 'F₂', lado: 's' }, { x: P[0], y: P[1], rotulo: 'P', lado: 'o' }],
      alt: `Hipérbola con focos en más y menos 5 y vértices en más y menos ${f(av)}; P en la rama derecha`,
    }, extra);
  }
  const uCtl = val => {
    const U = Math.min(Math.acosh(6.6 / val.a), Math.asinh(5.2 / Math.sqrt(25 - val.a * val.a)));
    return Math.max(-U, Math.min(U, val.u));
  };
  const hiperbolaIdea = {
    id: 'hiperbola',
    titulo: 'La diferencia que no cambia',
    temas: ['Hipérbola'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Los focos están fijos en (−5; 0) y (5; 0). Elige a y mueve P por la rama derecha: compara sus dos distancias.',
      voz: 'Esta vez, resta las dos distancias.',
      controles: [
        { id: 'a', etiqueta: 'a', color: 'c-o', min: 1, max: 4, paso: 1, inicio: 2, decimales: 0 },
        { id: 'u', etiqueta: 'P', min: -1.5, max: 1.5, paso: 0.5, inicio: 0.5, decimales: 1 },
      ],
      dibujo: val => ({ datos: hiperbola(val.a, uCtl(val)), estado: {} }),
      lectura: val => {
        const bv = Math.sqrt(25 - val.a * val.a), u = uCtl(val), P = [val.a * Math.cosh(u), bv * Math.sinh(u)];
        const d1 = Math.hypot(P[0] + 5, P[1]);
        return [PF1, ' − ', PF2, ` ≈ ${f(d1)} − ${f(d1 - 2 * val.a)} = ${f(2 * val.a)}`];
      },
      minimo: 4,
      // Se arrastra P por la rama derecha. Si el control pasa del borde de la figura, P se queda en el borde: en ese
      // punto, la manija devuelve el valor del control (no lo recorta).
      arrastres: [{ id: 'punto-p', etiqueta: 'punto P sobre la rama', color: 'c-h',
        donde: val => { const bv = Math.sqrt(25 - val.a * val.a), u = uCtl(val); return TP().enPx(hiperbola(val.a, u), val.a * Math.cosh(u), bv * Math.sinh(u)); },
        mover: (pt, val) => {
          const u = uCtl(val), q = TP().delPx(hiperbola(val.a, u), pt), w = Math.asinh(q.y / Math.sqrt(25 - val.a * val.a));
          return { u: Math.abs(w - u) < 1e-9 ? val.u : w };
        } }],
    },
    predice: {
      pregunta: 'Con focos en (±5; 0) y diferencia 2a = 6, la ecuación es x²/a² − y²/b² = 1. ¿Cuánto vale b?',
      voz: 'Compara con la elipse: ¿quién es ahora el mayor?',
      opciones: [
        { id: 'c', texto: '4', correcta: true },
        { id: 'elipse', texto: 'No existe: a² − c² es negativo', error: 'HIP-ELIPSE', siFuera: 'Bien en la elipse, donde b² = a² − c². En la hipérbola, c es el mayor: b² = c² − a².' },
        { id: 'resta', texto: '2, que es c − a', error: 'ELI-RESTA', siFuera: 'Esa es la distancia del vértice al foco. b sale de los cuadrados.' },
        { id: 'hip', texto: '√34 ≈ 5,83', error: 'ELI-HIP', siFuera: 'Eso suma a² + c². Aquí c es la diagonal: c² = a² + b².' },
      ],
      dibujo: { datos: hiperbola(3, 0, { segmentos: [] }), estado: {} },
      revelar: { datos: hiperbola(3, 0, {
        numeros: 0,
        segmentos: [{ de: [-3, -4], a: [3, -4], grosor: 'cuadricula' }, { de: [3, -4], a: [3, 4], grosor: 'cuadricula' }, { de: [3, 4], a: [-3, 4], grosor: 'cuadricula' }, { de: [-3, 4], a: [-3, -4], grosor: 'cuadricula' },
          { de: [-4.2, -5.6], a: [4.2, 5.6], discontinua: true }, { de: [-4.2, 5.6], a: [4.2, -5.6], discontinua: true },
          { de: [0, 0], a: [3, 0], color: 'o' }, { de: [3, 0], a: [3, 4], color: 'o' }, { de: [0, 0], a: [3, 4], color: 'o' }],
        rotulos: [{ x: 1.5, y: -0.8, texto: 'a = 3', color: 'o' }, { x: 3.2, y: 2.4, texto: 'b = 4', color: 'o', ancla: 'start' }, { x: 1.1, y: 2.5, texto: 'c = 5', color: 'o', ancla: 'end' }],
        puntos: [{ x: -5, y: 0, rotulo: 'F₁', lado: 's' }, { x: 5, y: 0, rotulo: 'F₂', lado: 's' }],
      }), estado: {} },
      coincide: 'Coincide: b² = 25 − 9 = 16, y c = 5 es la diagonal.',
      noCoincide: 'Revisemos con el rectángulo de lados 2a y 2b.',
    },
    mira: {
      datos: hiperbola(3, 0, {
        numeros: 0,
        segmentos: [{ de: [-3, -4], a: [3, -4], grosor: 'cuadricula', desde: 3 }, { de: [3, -4], a: [3, 4], grosor: 'cuadricula', desde: 3 }, { de: [3, 4], a: [-3, 4], grosor: 'cuadricula', desde: 3 }, { de: [-3, 4], a: [-3, -4], grosor: 'cuadricula', desde: 3 },
          { de: [-4.2, -5.6], a: [4.2, 5.6], discontinua: true, desde: 4 }, { de: [-4.2, 5.6], a: [4.2, -5.6], discontinua: true, desde: 4 },
          { de: [0, 0], a: [3, 4], color: 'o', desde: 3 }],
        puntos: [{ x: -5, y: 0, rotulo: 'F₁', lado: 's' }, { x: 5, y: 0, rotulo: 'F₂', lado: 's' }, { x: 3, y: 0, color: 'h', rotulo: 'V', lado: 'se', desde: 1 }],
        rotulos: [{ x: 1.1, y: 2.5, texto: 'c = 5', color: 'o', ancla: 'end', desde: 3 }, { x: 4.6, y: 5, texto: 'y = 4x/3', ancla: 'end', desde: 4 }],
      }),
      voz: 'Primero el vértice; después el rectángulo que guía a la curva.',
      pasos: [
        { estado: { corte: 1 }, texto: 'En el vértice V(3; 0), la diferencia es 8 − 2 = 6.', ecuacion: [PF1, ' − ', PF2, ' = 2', a, ' = 6'] },
        { estado: { corte: 2 }, texto: 'Los focos quedan más lejos del centro que los vértices.', ecuacion: [c, ' = 5 > ', a, ' = 3'] },
        { estado: { corte: 3 }, texto: 'El rectángulo de lados 2a y 2b tiene diagonal c.', ecuacion: [sq(c), ' = ', sq(a), ' + ', sq(b), '  ⇒  ', b, ' = 4'] },
        { estado: { corte: 4 }, texto: 'Sus diagonales son las asíntotas: la curva se acerca sin tocarlas.', ecuacion: ['y = ±', { frac: [b, a] }, 'x = ±', { frac: ['4', '3'] }, 'x'] },
        { estado: { corte: 4 }, texto: 'Con a y b se escribe la ecuación.', ecuacion: [{ frac: [sq('x'), '9'] }, ' − ', { frac: [sq('y'), '16'] }, ' = 1'] },
      ],
    },
    regla: {
      texto: 'La hipérbola es el lugar de los puntos cuya diferencia de distancias a dos focos, en valor absoluto, es 2a. Ahora c es el mayor:',
      ecuacion: ['|', PF1, ' − ', PF2, '| = ', { llave: ['2', a], nota: 'la diferencia', color: 'c-o' }, SEP, { frac: [sq('x'), sq(a)] }, ' − ', { frac: [sq('y'), sq(b)] }, ' = 1', SEP, { llave: [sq(c)], nota: 'el mayor', color: 'c-o' }, ' = ', sq(a), ' + ', sq(b)],
      condicion: '0 < a < c. Las asíntotas y = ±(b/a)x guían las ramas, que nunca las tocan.',
      voz: 'Suma en la elipse, diferencia en la hipérbola; y cambia quién es el mayor.',
    },
    ahoraTu: {
      voz: 'Ubica el término positivo: ahí están los focos.',
      generar(sem) {
        const rr = azar(sem), [av, bv, cv] = rr.uno([[3, 4, 5], [4, 3, 5], [6, 8, 10], [5, 12, 13], [12, 5, 13], [8, 15, 17], [7, 24, 25]]);
        const ec = `x²/${f(av * av)} − y²/${f(bv * bv)} = 1`;
        if (sem % 2) {
          return {
            pregunta: [`¿Cuáles son las asíntotas de la hipérbola ${ec}?`],
            opciones: opciones(`y = ±${f(bv)}x/${f(av)}`, [
              { id: 'inv', valor: `y = ±${f(av)}x/${f(bv)}`, error: 'HIP-ELIPSE', siFuera: 'La pendiente es b/a: arriba va el número que acompaña a y.' },
              { id: 'conc', valor: `y = ±${f(cv)}x/${f(av)}`, error: 'ELI-HIP', siFuera: 'Eso usa c. Las asíntotas son las diagonales del rectángulo de lados 2a y 2b.' },
              { id: 'cuad', valor: `y = ±${f(bv * bv)}x/${f(av * av)}`, error: 'ELI-RESTA', siFuera: 'Esos son a² y b². La pendiente usa a y b, sin cuadrado.' },
            ], v => v),
            solucion: { texto: `a = ${f(av)} y b = ${f(bv)}; la pendiente es b/a.`, ecuacion: [`y = ±${f(bv)}x/${f(av)}`] },
          };
        }
        return {
          pregunta: [`¿Dónde están los focos de la hipérbola ${ec}?`],
          opciones: opciones(`(±${f(cv)}; 0)`, [
            { id: 'elipse', valor: `(±${f(Math.sqrt(Math.abs(av * av - bv * bv)))}; 0)`, error: 'HIP-ELIPSE', siFuera: 'Así se hace en la elipse. En la hipérbola, c² = a² + b².' },
            { id: 'eje', valor: `(0; ±${f(cv)})`, error: 'ELI-EJE', siFuera: 'Bien c. Los focos van sobre el eje del término positivo: aquí, x.' },
            { id: 'resta', valor: `(±${f(av + bv)}; 0)`, error: 'ELI-RESTA', siFuera: 'Se suman los cuadrados, no los semiejes.' },
          ], v => `F${v}`),
          solucion: { texto: 'En la hipérbola se suman los cuadrados.', ecuacion: [sq(c), ` = ${f(av * av)} + ${f(bv * bv)} = ${f(cv * cv)}`, SEP, c, ` = ${f(cv)}`] },
        };
      },
    },
  };

  // ---------- Idea 4: la recta tangente toca una sola vez ----------
  // Cambia: la altura k de la recta y = x + k. · Permanece: la parábola x² = 4y y la pendiente 1 de la recta.
  // Progresa: el discriminante y el número de cortes (2 o 0). · Se reserva: el k que da un solo corte (la predicción;
  // el juego salta de 0,4 en 0,4 y no lo toca). · Debe verse: tangente = raíz doble, discriminante cero.
  const PX = { puntos: curva(x => [x, x * x / 4], -4, 5.6), color: 'h' };
  function tangente(k, extra = {}) {
    const D = 16 + 16 * k, pts = D < -1e-9 ? [] : Math.abs(D) < 1e-9 ? [2] : [2 - Math.sqrt(D) / 2, 2 + Math.sqrt(D) / 2];
    const x0 = Math.max(-4, -3.4 - k), x1 = Math.min(6, 7.6 - k);
    return Object.assign({
      ventana: { x: [-4, 6], y: [-3.4, 7.6] }, numeros: 1,
      curvas: [Object.assign({ rotulo: 'x² = 4y', en: [-3.5, 3.06], lado: 'o' }, PX)],
      segmentos: [{ de: [x0, x0 + k], a: [x1, x1 + k], color: 'o' }],
      puntos: pts.map(x => ({ x, y: x * x / 4, color: 'i' })),
      alt: `Parábola x² = 4y y recta y = x ${k < 0 ? '−' : '+'} ${f(Math.abs(k))}: ${pts.length === 0 ? 'no se cortan' : pts.length === 1 ? 'se tocan en un punto' : 'se cortan en dos puntos'}`,
    }, extra);
  }
  const tangenteIdea = {
    id: 'recta-tangente',
    titulo: 'Tocar una sola vez',
    temas: ['Recta tangente a una cónica'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Sube o baja la recta y = x + k sin cambiar su inclinación. Cuenta los cortes con la parábola y mira el discriminante.',
      voz: 'Fíjate en el signo del discriminante cuando los cortes se acercan.',
      controles: [{ id: 'k', etiqueta: 'k', color: 'c-o', min: -2.8, max: 2, paso: 0.4, inicio: 0.4, decimales: 1 }],
      dibujo: val => ({ datos: tangente(val.k), estado: {} }),
      lectura: val => {
        const D = 16 + 16 * val.k;
        return [{ v: 'c-o', t: 'k' }, ` = ${f(val.k)}`, SEP, `Δ = ${f(D)}: ${D > 1e-9 ? 'dos cortes' : D < -1e-9 ? 'ningún corte' : 'un corte'}`];
      },
      minimo: 3,
      // Se arrastra la recta por su corte con el eje y: la recta pasa por el dedo y conserva su inclinación.
      arrastres: [{ id: 'recta', etiqueta: 'recta y = x + k', color: 'c-o',
        donde: val => TP().enPx(tangente(val.k), 0, val.k),
        mover: (pt, val) => { const q = TP().delPx(tangente(val.k), pt); return { k: q.y - q.x }; } }],
    },
    predice: {
      pregunta: '¿Para qué valor de k la recta y = x + k toca a la parábola x² = 4y en un solo punto?',
      voz: 'Piensa entre qué dos valores del juego cambió el número de cortes.',
      opciones: [
        { id: 'c', texto: 'k = −1', correcta: true },
        { id: 'origen', texto: 'k = 0: pasa por el vértice', error: 'TAN-ORIGEN', siFuera: 'Pasar por el vértice no basta: con pendiente 1, la recta corta dos veces.' },
        { id: 'signo', texto: 'k = 1', error: 'TAN-SIGNO', siFuera: 'Bien que |k| = 1. Con k = 1 la recta queda arriba y corta dos veces.' },
        { id: 'nunca', texto: 'Ninguno: o corta dos veces o ninguna', error: 'TAN-NUNCA', siFuera: 'El juego saltaba de 0,4 en 0,4. Entre −1,2 y −0,8 hay un k con un solo corte.' },
      ],
      dibujo: { datos: tangente(-0.8), estado: {} },
      revelar: { datos: tangente(-1, { puntos: [{ x: 2, y: 1, color: 'i', rotulo: 'T(2; 1)', lado: 'se' }] }), estado: {} },
      coincide: 'Coincide: con k = −1 el discriminante es 0 y la recta toca en (2; 1).',
      noCoincide: 'Revisemos: entre −1,2 y −0,8 el discriminante pasa por cero.',
    },
    mira: {
      datos: tangente(-1, { puntos: [{ x: 2, y: 1, color: 'i', rotulo: 'T(2; 1)', lado: 'se', desde: 4 }] }),
      voz: 'Sustituir convierte la pregunta en una ecuación de segundo grado.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Se sustituye la recta en la parábola.', ecuacion: [sq('x'), ' = 4(x + k)  ⇒  ', sq('x'), ' − 4x − 4k = 0'] },
        { estado: { corte: 2 }, texto: 'Cada raíz es un punto de corte.', ecuacion: ['Δ = 16 + 16k'] },
        { estado: { corte: 3 }, texto: 'Un solo punto pide una raíz doble: Δ = 0.', ecuacion: ['16 + 16k = 0  ⇒  k = −1'] },
        { estado: { corte: 4 }, texto: 'La raíz doble da el punto de contacto.', ecuacion: [sq('(x − 2)'), ' = 0  ⇒  T(2; 1)'] },
      ],
    },
    regla: {
      texto: 'Una recta tangente a una cónica la toca así: al sustituirla, la ecuación de segundo grado tiene discriminante cero: una raíz doble, un solo punto de contacto.',
      ecuacion: [{ llave: ['Δ = 0'], nota: 'raíz doble' }],
      condicion: 'la recta no es paralela al eje de la parábola: una vertical corta x² = 4y una vez y no es recta tangente.',
      voz: 'Un solo corte no basta; hace falta la raíz doble.',
    },
    ahoraTu: {
      voz: 'Sustituye y pide raíz doble.',
      generar(sem) {
        const rr = azar(sem), tipo = sem % 3;
        if (tipo === 2) {
          const pv = rr.uno([1, 2, 3]), x0 = rr.ent(-4, 4);
          return {
            pregunta: [`La recta vertical x = ${f(x0)} corta a la parábola x² = ${f(4 * pv)}y en un solo punto. ¿Es tangente?`],
            opciones: [
              { id: 'c', texto: 'No: es paralela al eje y la atraviesa', correcta: true },
              { id: 'si', texto: 'Sí: tiene un solo punto común', error: 'TAN-UN-CORTE', siFuera: 'Un punto común basta solo si hay raíz doble. La vertical cruza la curva de lado a lado.' },
              { id: 'nunca', texto: 'No: una recta vertical no corta parábolas', error: 'TAN-NUNCA', siFuera: `Sí la corta: en (${f(x0)}; ${f(x0 * x0 / (4 * pv))}). Pero no es tangente.` },
            ],
            solucion: { texto: 'Al sustituir x no queda segundo grado en y: no hay raíz doble.', ecuacion: [`y = ${f(x0 * x0)}/${f(4 * pv)}: un punto, sin tangencia`] },
          };
        }
        if (tipo === 1) {
          const [av, bv] = rr.uno([[5, 3], [4, 2], [6, 4], [5, 4], [3, 2]]);
          return {
            pregunta: [`¿Qué recta horizontal y = k es tangente por arriba a la elipse x²/${f(av * av)} + y²/${f(bv * bv)} = 1?`],
            opciones: opciones(bv, [
              { id: 'a', valor: av, error: 'ELI-EJE', siFuera: `${f(av)} es el semieje en x. La recta horizontal toca arriba, a la altura b.` },
              { id: 'cuad', valor: bv * bv, error: 'TAN-P', siFuera: `${f(bv * bv)} es b². La altura del punto más alto es b.` },
              { id: 'cero', valor: 0, error: 'TAN-ORIGEN', siFuera: 'y = 0 pasa por el centro y corta dos veces.' },
            ], v => `y = ${f(v)}`),
            solucion: { texto: 'Con y = k queda x² = a²(1 − k²/b²): raíz doble si k = b.', ecuacion: [`k = ${f(bv)}`] },
          };
        }
        const pv = rr.uno([1, 2, 3, 0.5]), m = rr.uno([-3, -2, -1, 1, 2, 3, 0.5]), kv = -pv * m * m;
        return {
          pregunta: [`¿Para qué k la recta y = ${m === 1 ? '' : m === -1 ? '−' : f(m)}x + k es tangente a la parábola x² = ${f(4 * pv)}y?`],
          opciones: opciones(kv, [
            { id: 'signo', valor: -kv, error: 'TAN-SIGNO', siFuera: 'Bien el tamaño. La recta tangente queda debajo de esta parábola: k es negativo.' },
            { id: 'p', valor: -m * m / (4 * pv), error: 'TAN-P', siFuera: 'Eso divide entre 4p. Al pedir Δ = 0 queda k = −p m².' },
            { id: 'cero', valor: 0, error: 'TAN-ORIGEN', siFuera: 'Por el vértice pasa, pero corta dos veces si la pendiente no es cero.' },
          ], v => `k = ${f(v)}`),
          solucion: { texto: `x²${sg(-4 * pv * m, v => `${f(v)}x`)} − ${f(4 * pv)}k = 0 con Δ = 0.`, ecuacion: [`${f(16 * pv * pv * m * m)} + ${f(16 * pv)}k = 0  ⇒  k = ${f(kv)}`] },
        };
      },
    },
  };

  // ---------- Idea 5: girar los ejes y leer la ecuación general ----------
  // Cambia: el ángulo θ de los ejes nuevos x′, y′. · Permanece: la curva 5x² − 6xy + 5y² = 8, que no se mueve.
  // Progresa: el coeficiente B′ del término x′y′, que se anula en 45°. · Se reserva: una ecuación con B² − 4AC < 0
  // y sin ningún punto (la predicción). · Debe verse: se giran los ejes, no la curva; el discriminante orienta, no garantiza.
  const ELI = { puntos: curva(t => { const u = 2 * Math.cos(t), v = Math.sin(t); return [u * cos(45) - v * sen(45), u * sen(45) + v * cos(45)]; }, 0, 2 * Math.PI), color: 'h' };
  function ejes(tg, extra = {}) {
    const L = 2.7, u = [L * cos(tg), L * sen(tg)], w = [-L * sen(tg), L * cos(tg)];
    return Object.assign({
      ventana: { x: [-3, 3], y: [-3, 3] }, numeros: 1,
      curvas: [ELI],
      segmentos: [{ de: [-u[0], -u[1]], a: u, color: 'o', punta: true }, { de: [-w[0], -w[1]], a: w, color: 'o', punta: true }],
      rotulos: [{ x: 1.1 * u[0], y: 1.1 * u[1] - 0.1, texto: 'x′', color: 'o' }, { x: 1.1 * w[0] + (tg > 60 ? -0.15 : 0.15), y: 1.05 * w[1], texto: 'y′', color: 'o' }],
      arcos: tg ? [{ de: 0, a: tg, r: 0.6, color: 'o', rotulo: `${f(tg)}°` }] : [],
      alt: `Elipse 5x² − 6xy + 5y² = 8 con ejes x′, y′ girados ${f(tg)} grados`,
    }, extra);
  }
  const Bp = tg => -6 * cos(2 * tg);
  const rotacion = {
    id: 'rotacion-ecuacion-general',
    titulo: 'Girar los ejes, no la curva',
    temas: ['Rotación de ejes', 'Ecuación general de segundo grado'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'La curva 5x² − 6xy + 5y² = 8 no se mueve. Gira los ejes nuevos x′ e y′ y mira el coeficiente B′ del término x′y′.',
      voz: 'Busca el giro en que el término cruzado desaparece.',
      controles: [{ id: 't', etiqueta: 'θ', color: 'c-o', min: 0, max: 90, paso: 15, inicio: 15, unidad: '°', decimales: 0 }],
      dibujo: val => ({ datos: ejes(val.t), estado: {} }),
      lectura: val => [th, ` = ${f(val.t)}°`, SEP, `B′ = ${f(Bp(val.t))}${Math.abs(Bp(val.t)) < 1e-9 ? ', sin término x′y′' : ''}`],
      minimo: 3,
      // Se arrastra el eje x′ (un punto suyo, antes de su rótulo): los dos ejes giran juntos.
      arrastres: [{ id: 'eje-x', etiqueta: 'eje x′: gira θ', color: 'c-o',
        donde: val => TP().enPx(ejes(val.t), 2.1 * cos(val.t), 2.1 * sen(val.t)),
        mover: (pt, val) => ({ t: TP().anguloDe(ejes(val.t), pt, { cerca: val.t }) }) }],
    },
    predice: {
      pregunta: 'La ecuación x² + 2y² + 4 = 0 tiene B² − 4AC = −8, negativo como el de una elipse. ¿Qué curva dibuja?',
      voz: 'Antes de nombrarla, busca un punto que la cumpla.',
      opciones: [
        { id: 'c', texto: 'Ninguna: ningún punto real la cumple', correcta: true },
        { id: 'elipse', texto: 'Una elipse, porque el discriminante es negativo', error: 'CON-DISCRIMINANTE', siFuera: 'El signo orienta el tipo. Pero x² + 2y² nunca es negativo: no llega a −4.' },
        { id: 'circulo', texto: 'Una circunferencia de radio 2', error: 'CON-DISCRIMINANTE', siFuera: 'Sería cierto con x² + y² = 4. Aquí la suma de cuadrados tendría que dar −4.' },
        { id: 'punto', texto: 'Solo el origen', error: 'CON-PUNTO', siFuera: 'Sería cierto si la constante fuera 0. En el origen queda 4 = 0.' },
      ],
      dibujo: { datos: { ventana: { x: [-3, 3], y: [-3, 3] }, numeros: 0, rotulos: [{ x: -1.6, y: 2.3, texto: 'x² + 2y² + 4 = 0' }], alt: 'Plano vacío con la ecuación x² + 2y² + 4 = 0' }, estado: {} },
      revelar: { datos: { ventana: { x: [-3, 3], y: [-3, 3] }, numeros: 0, rotulos: [{ x: -1.6, y: 2.3, texto: 'x² + 2y² + 4 = 0' }, { x: 0.25, y: -2.3, texto: 'x² + 2y² ≥ 0 > −4', color: 'h', ancla: 'start' }], alt: 'Plano vacío: ningún punto cumple x² + 2y² + 4 = 0' }, estado: {} },
      coincide: 'Coincide: el discriminante orienta, pero aquí no hay puntos.',
      noCoincide: 'Revisemos: x² + 2y² nunca es negativo.',
    },
    mira: {
      datos: ejes(45, {
        segmentos: ejes(45).segmentos.map(s => Object.assign({}, s, { desde: 2 })),
        rotulos: ejes(45).rotulos.map(r => Object.assign({}, r, { desde: 2 })).concat([{ x: 1.6, y: -2.4, texto: 'x′²/4 + y′² = 1', color: 'h', desde: 4 }]),
        arcos: [{ de: 0, a: 45, r: 0.6, color: 'o', rotulo: '45°', desde: 2 }],
      }),
      voz: 'Un giro bien elegido deja la ecuación conocida.',
      pasos: [
        { estado: { corte: 1 }, texto: 'El término xy avisa que los ejes de la curva están girados.', ecuacion: ['A = 5', SEP, 'B = −6', SEP, 'C = 5'] },
        { estado: { corte: 2 }, texto: 'El giro que lo elimina cumple cot 2θ = (A − C)/B.', ecuacion: ['cot 2', th, ' = 0  ⇒  ', th, ' = 45°'] },
        { estado: { corte: 3 }, texto: 'Se cambian x e y por las coordenadas nuevas.', ecuacion: ['x = x′cos ', th, ' − y′sen ', th, SEP, 'y = x′sen ', th, ' + y′cos ', th] },
        { estado: { corte: 4 }, texto: 'Queda una elipse de semiejes 2 y 1.', ecuacion: ['2x′² + 8y′² = 8  ⇒  ', { frac: ['x′²', '4'] }, ' + y′² = 1'] },
        { estado: { corte: 4 }, texto: 'B² − 4AC = −64 lo anunciaba, y aquí sí hay puntos.', ecuacion: ['36 − 100 = −64 < 0'] },
      ],
    },
    regla: {
      texto: 'Girar los ejes un ángulo θ con cot 2θ = (A − C)/B quita el término xy. B² − 4AC orienta: negativo, elipse; cero, parábola; positivo, hipérbola.',
      ecuacion: ['cot 2', { llave: [th], nota: 'giro de ejes', color: 'c-o' }, ' = ', { frac: ['A − C', 'B'] }, SEP, 'x = x′cos ', th, ' − y′sen ', th, SEP, 'y = x′sen ', th, ' + y′cos ', th],
      condicion: 'B ≠ 0 para girar. En la ecuación general, el discriminante no asegura puntos: puede salir una recta, un punto o nada.',
      voz: 'El signo orienta; un punto que cumpla lo confirma.',
    },
    ahoraTu: {
      voz: 'Calcula B² − 4AC y busca un punto que cumpla.',
      generar(sem) {
        const rr = azar(sem);
        if (sem % 2) {
          const C0 = rr.ent(1, 6), Bv = rr.uno([-4, -2, 2, 4, 6]), caso = rr.uno([0, 1, 2]);
          // A − C = 0, B o −B: cot 2θ = 0, 1 o −1 (2θ = 90°, 45° o 135°). A tiene que quedar positivo.
          const A1 = caso === 0 ? C0 : caso === 1 ? C0 + Bv : C0 - Bv, A0 = A1 > 0 ? A1 : C0;
          const cot = (A0 - C0) / Bv, dos = cot === 0 ? 90 : cot === 1 ? 45 : 135, tg = dos / 2;
          const ec = `${f(A0)}x² ${Bv < 0 ? '−' : '+'} ${f(Math.abs(Bv))}xy + ${f(C0)}y² = 10`;
          return {
            pregunta: [`¿Qué ángulo θ, entre 0° y 90°, quita el término xy de ${ec}?`],
            opciones: opciones(tg, [
              { id: 'doble', valor: dos, error: 'ROT-DOBLE', siFuera: `${f(dos)}° es 2θ. El giro de los ejes es la mitad.` },
              { id: 'tan', valor: 90 - tg, error: 'ROT-TAN', siFuera: 'Eso usa tan 2θ = (A − C)/B. La fórmula lleva cotangente.' },
              { id: 'cero', valor: 0, error: 'ROT-TAN', siFuera: 'Sin girar, el término xy sigue: B no es cero.' },
            ], v => `${f(v)}°`),
            solucion: { texto: `cot 2θ = (${f(A0)} − ${f(C0)})/${f(Bv)} = ${f(cot)}.`, ecuacion: ['2', th, ` = ${f(dos)}°  ⇒  `, th, ` = ${f(tg)}°`] },
          };
        }
        const tipo = rr.uno(['elipse', 'vacio', 'hiperbola', 'punto']), A0 = rr.ent(1, 5), C0 = rr.ent(1, 5), F0 = rr.ent(2, 12);
        const Bv = tipo === 'hiperbola' ? rr.uno([-1, 1]) * (Math.ceil(2 * Math.sqrt(A0 * C0)) + rr.ent(1, 3)) : rr.uno([-1, 0, 1]);
        const Fv = tipo === 'elipse' || tipo === 'hiperbola' ? -F0 : tipo === 'vacio' ? F0 : 0;
        const ec = `${f(A0)}x²${Bv ? sg(Bv, x => `${f(x)}xy`) : ''} + ${f(C0)}y²${Fv ? sg(Fv, x => f(x)) : ''} = 0`;
        const disc = Bv * Bv - 4 * A0 * C0;
        const TX = { elipse: 'Una elipse', vacio: 'Ningún punto real', hiperbola: 'Una hipérbola', punto: 'Un solo punto: el origen' };
        const ops = [{ id: 'c', texto: TX[tipo], correcta: true }];
        const mas = {
          elipse: { id: 'elipse', error: 'CON-DISCRIMINANTE', siFuera: 'El discriminante negativo orienta a elipse, pero revisa si la constante deja puntos.' },
          vacio: { id: 'vacio', error: 'CON-DISCRIMINANTE', siFuera: 'Sería cierto si la constante fuera positiva y no hubiera cómo compensarla. Aquí sí hay puntos.' },
          hiperbola: { id: 'hiperbola', error: 'CON-DISCRIMINANTE', siFuera: 'Una hipérbola pide B² − 4AC positivo. Aquí es negativo.' },
          punto: { id: 'punto', error: 'CON-PUNTO', siFuera: 'Solo el origen cumpliría si la constante fuera 0.' },
        };
        for (const k of ['elipse', 'vacio', 'hiperbola', 'punto']) if (k !== tipo) ops.push(Object.assign({ texto: TX[k] }, mas[k]));
        if (tipo === 'hiperbola') { ops.find(o => o.id === 'elipse').siFuera = 'Una elipse pide B² − 4AC negativo. Aquí es positivo.'; ops.find(o => o.id === 'vacio').siFuera = 'Con discriminante positivo siempre hay puntos que cumplen.'; }
        const expl = { elipse: 'negativo y la constante deja puntos', vacio: 'negativo, pero la parte cuadrática nunca compensa la constante positiva', hiperbola: 'positivo', punto: 'negativo y sin constante: solo (0; 0)' }[tipo];
        return {
          pregunta: [`¿Qué representa la ecuación ${ec}?`],
          opciones: ops,
          solucion: { texto: `B² − 4AC = ${f(disc)}: ${expl}.`, ecuacion: [`B² − 4AC = ${f(Bv * Bv)} − ${f(4 * A0 * C0)} = ${f(disc)}`] },
        };
      },
    },
  };

  // ---------- Laboratorio: figuras propias de las mesas ----------
  // Mesa 1: el foco F(0; p) y la directriz y = −p se mueven juntos; P se mueve libre, también bajo la directriz.
  const VL1 = { x: [-4, 4], y: [-2.8, 5.2] };
  // Las dos distancias de P: al foco F(0; p) y a la directriz y = −p (figura, lectura y retos).
  const distF = val => Math.hypot(val.x, val.y - val.p), distD = val => Math.abs(val.y + val.p);
  function focoLibre(val) {
    const pv = val.p, dF = distF(val), dD = distD(val), ok = Math.abs(dF - dD) < 1e-9, X = 2 * Math.sqrt(pv * 5.2);
    return {
      ventana: VL1, numeros: 1,
      curvas: [{ puntos: curva(x => [x, x * x / (4 * pv)], -Math.min(4, X), Math.min(4, X)), color: 'h', discontinua: true }],
      rectas: [{ y: -pv, color: 'd' }],
      segmentos: [{ de: [val.x, val.y], a: [0, pv], color: 'i' }, { de: [val.x, val.y], a: [val.x, -pv], color: 'd' }],
      // El nombre del foco se aparta de su manija.
      puntos: [{ x: 0, y: pv }, { x: val.x, y: val.y, color: ok ? 'h' : undefined, rotulo: 'P', lado: val.x >= 0 ? 'e' : 'o' }],
      rotulos: [{ x: -0.35, y: pv + 0.3, texto: 'F', ancla: 'end' }],
      alt: `Foco F(0; ${f(pv)}), directriz y = ${f(-pv)} y P${par(val.x, val.y)}: PF = ${f(dF)}, PD = ${f(dD)}`,
    };
  }
  // Mesa 2: la cuerda 2a y la separación 2c, libres. Si c = a, la curva se aplana en el segmento F₁F₂; si c > a,
  // la cuerda no alcanza el otro foco: se dibuja tendida desde F₁ y su punta estira a.
  const VL2 = { x: [-6.6, 6.6], y: [-6, 6] };
  const bDe = val => Math.sqrt(Math.max(0, val.a * val.a - val.c * val.c));
  const puntaCuerda = val => (val.c > val.a + 1e-9 ? [2 * val.a - val.c, 0] : [val.a * cos(val.t), bDe(val) * sen(val.t)]);
  function cuerdaLibre(val) {
    const bv = bDe(val), P = puntaCuerda(val), corta = val.c > val.a + 1e-9;
    const F = [{ x: -val.c, y: 0, rotulo: 'F₁', lado: 's' }, { x: val.c, y: 0, rotulo: 'F₂', lado: 's' }];
    return {
      ventana: VL2, numeros: 1,
      curvas: corta ? [] : [{ puntos: curva(t => [val.a * Math.cos(t), bv * Math.sin(t)], 0, 2 * Math.PI), color: 'h' }],
      segmentos: corta ? [{ de: [-val.c, 0], a: P, color: 'i' }] : [{ de: P, a: [-val.c, 0], color: 'i' }, { de: P, a: [val.c, 0], color: 'd' }],
      puntos: F.concat([{ x: P[0], y: P[1], rotulo: 'P', lado: P[1] >= 0 ? 'n' : 's' }]),
      alt: corta ? `Cuerda de ${f(2 * val.a)} y focos a ${f(2 * val.c)}: la cuerda no alcanza, no hay curva`
        : `Elipse de cuerda 2a = ${f(2 * val.a)} y focos en más y menos ${f(val.c)}; semieje menor ${f(bv)}`,
    };
  }
  // Mesa 3: la recta y = mx + k contra la parábola x² = 4y, con pasos finos para atrapar la tangente (k = −m²).
  const VL3 = { x: [-4, 6], y: [-4.4, 7.6] };
  // Discriminante de x² = 4(mx + k), es decir x² − 4mx − 4k = 0 (figura, lectura y retos).
  const deltaRP = val => 16 * val.m * val.m + 16 * val.k;
  // La elipse más achatada de la grilla de la mesa 2 (menor b/a con b > 0), para el reto del extremo.
  let achatada = null;
  const masAchatada = () => {
    if (achatada === null) { achatada = Infinity; for (let i = 0; i <= 8; i++) for (let j = 0; j <= 12; j++) { const v = { a: 2 + i / 2, c: j / 2 }, bv = bDe(v); if (bv > 1e-9) achatada = Math.min(achatada, bv / v.a); } }
    return achatada;
  };
  function rectaLibre(val) {
    const D = deltaRP(val), xs = D < -1e-9 ? [] : Math.abs(D) < 1e-9 ? [2 * val.m] : [2 * val.m - Math.sqrt(D) / 2, 2 * val.m + Math.sqrt(D) / 2];
    // La recta se recorta a la ventana: entre los x donde y sale por arriba o por abajo.
    let x0 = VL3.x[0], x1 = VL3.x[1];
    if (Math.abs(val.m) > 1e-9) {
      const ya = (VL3.y[0] - val.k) / val.m, yb = (VL3.y[1] - val.k) / val.m;
      x0 = Math.max(x0, Math.min(ya, yb)); x1 = Math.min(x1, Math.max(ya, yb));
    }
    return {
      ventana: VL3, numeros: 1,
      curvas: [Object.assign({ rotulo: 'x² = 4y', en: [-3.5, 3.06], lado: 'o' }, PX)],
      segmentos: [{ de: [x0, val.m * x0 + val.k], a: [x1, val.m * x1 + val.k], color: 'o' }],
      puntos: xs.map(x => ({ x, y: x * x / 4, color: 'i' })),
      alt: `Parábola x² = 4y y recta de pendiente ${f(val.m)} y corte ${f(val.k)}: ${xs.length === 0 ? 'no se cortan' : xs.length === 1 ? 'se tocan en un punto' : 'se cortan en dos puntos'}`,
    };
  }

  // ---------- El cono que se corta (laboratorio 3D, 15 nov: exploración libre, sin predicciones) ----------
  // El tipo de curva y sus puntos los calcula plantillas/conicas/motor.js (corte3d), el mismo que usa la pieza
  // trig-cono-3d para dibujar: los retos miden lo que se ve (regla 1). φ es la inclinación del plano y g la de la
  // generatriz, las dos desde la horizontal; a, cuánto baja el plano bajo el vértice (a = 0: cónica degenerada).
  const corteDe = v => MCo.corte3d({ inclinacion: v.fi, generatriz: v.g, altura: v.a, alto: 2 });
  const mesaCono = {
    id: 'cono-corte', titulo: 'El cono que se corta', pieza: 'trig-cono-3d',
    consigna: 'Gira el cono doble con el dedo. Inclina el plano, cambia la generatriz y baja el plano: compara φ con g.',
    controles: [
      { id: 'fi', etiqueta: 'φ del plano', color: 'c-o', min: 0, max: 85, paso: 5, inicio: 30, unidad: '°', decimales: 0 },
      { id: 'g', etiqueta: 'g de la generatriz', color: 'c-i', min: 40, max: 75, paso: 5, inicio: 60, unidad: '°', decimales: 0 },
      { id: 'a', etiqueta: 'plano bajo el vértice', color: 'c-d', min: 0, max: 1.5, paso: 0.5, inicio: 1, decimales: 1 },
    ],
    dibujo: v => ({ datos: { inclinacion: v.fi, generatriz: v.g, altura: v.a }, estado: { plano: true } }),
    lectura: v => ['Corte: ', { v: 'c-h', t: corteDe(v).nombre }, ' · ', { v: 'c-o', t: 'φ' }, ` = ${v.fi}° · `, { v: 'c-i', t: 'g' }, ` = ${v.g}°`],
    invitaciones: [
      { texto: 'Corta el cono y saca una circunferencia.',
        logrado: v => corteDe(v).tipo === 'circunferencia',
        bien: 'Plano horizontal: cada punto del corte queda a la misma distancia del eje.',
        pista: 'Deja el plano sin inclinar: φ en 0°.' },
      { texto: 'Consigue una parábola.',
        logrado: v => corteDe(v).tipo === 'parabola',
        bien: 'El plano va paralelo a una generatriz: la curva nunca se cierra.',
        pista: 'Inclina el plano justo lo mismo que la generatriz: φ igual a g.' },
      { texto: 'Logra un corte que toque las dos hojas del cono.',
        logrado: v => v.a > 0 && corteDe(v).hojas === 2,
        bien: 'Más inclinado que la generatriz: una hipérbola, con una rama en cada hoja.',
        pista: 'Inclina el plano más que la generatriz.' },
      { texto: 'Pasa el plano por el vértice y saca dos rectas.',
        logrado: v => corteDe(v).tipo === 'rectas',
        bien: 'Por el vértice, la hipérbola se aplasta en dos rectas: una cónica degenerada.',
        pista: 'Baja el plano a 0 y que φ pase a g.' },
      { texto: 'Guarda dos casos con la misma φ y distinta curva.',
        logrado: (v, gs) => gs.some(p => gs.some(q => p.fi === q.fi && p.a > 0 && q.a > 0 && corteDe(p).tipo !== corteDe(q).tipo)),
        bien: 'φ sola no decide la curva: decide compararla con g.' },
    ],
  };

  return {
    unidad: 'trigonometria.conicas',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/trig-plano.js', '/plantillas/conicas/motor.js', '/nucleo/kit/piezas/trig-cono-3d.js'],
    glosario: [
      { termino: 'lugar geométrico', def: 'Conjunto de todos los puntos que cumplen una condición, y solo de ellos.',
        ejemplo: 'Los puntos a distancia 2 del origen: la circunferencia x² + y² = 4.', formas: ['lugar geométrico', 'lugares geométricos'] },
      { termino: 'cónica', def: 'Curva que sale de cortar un cono con un plano: parábola, elipse, hipérbola o circunferencia.',
        formas: ['cónica', 'cónicas'], ver: ['parábola', 'elipse', 'hipérbola'] },
      { termino: 'foco', def: 'Punto fijo desde el que se miden las distancias que definen la curva.',
        ejemplo: 'x² = 4y tiene su foco en (0; 1).', formas: ['foco', 'focos'], ver: ['directriz', 'eje focal'] },
      { termino: 'directriz', def: 'Recta fija de la parábola: cada punto de la curva está tan lejos de ella como del foco.',
        ejemplo: 'x² = 4y tiene directriz y = −1.', ver: ['foco', 'parábola'] },
      { termino: 'parábola', def: 'Curva de los puntos que están a la misma distancia de un punto fijo que de una recta fija.',
        ejemplo: 'x² = 4py, con foco (0; p) y directriz y = −p.', ver: ['foco', 'directriz'] },
      { termino: 'elipse', def: 'Curva cerrada de los puntos cuya suma de distancias a dos puntos fijos vale siempre 2a.',
        ejemplo: 'a = 5 y c = 3 dan b = 4: x²/25 + y²/16 = 1.', ver: ['foco', 'semieje'] },
      { termino: 'hipérbola', def: 'Curva de dos ramas: la diferencia de distancias de cada punto a dos puntos fijos vale siempre 2a.',
        ejemplo: 'Focos (±5; 0) y 2a = 6: x²/9 − y²/16 = 1.', ver: ['foco', 'asíntota'] },
      { termino: 'eje focal', def: 'Recta que pasa por los dos focos; en ella están los vértices de la elipse o de la hipérbola.',
        ver: ['foco'] },
      { termino: 'semieje', def: 'Mitad de un eje de la elipse: a va del centro al extremo más lejano; b, al más cercano.',
        ejemplo: 'x²/4 + y² = 1 tiene semiejes 2 y 1.', formas: ['semieje mayor', 'semieje menor', 'semieje', 'semiejes'], ver: ['elipse'] },
      { termino: 'recta tangente', def: 'Recta que se apoya en la curva en un solo punto, sin atravesarla: al sustituirla queda una raíz doble.',
        ejemplo: 'y = x − 1 toca a x² = 4y solo en (2; 1).', formas: ['recta tangente', 'rectas tangentes'], ver: ['discriminante'] },
      { termino: 'discriminante', simbolo: 'Δ', def: 'Cantidad b² − 4ac que dice cuántas raíces tiene una cuadrática; en las cónicas, B² − 4AC sugiere el tipo.',
        ejemplo: 'x² − 4x + 4 = 0: Δ = 16 − 16 = 0, una raíz doble.', ver: ['recta tangente', 'ecuación general'] },
      { termino: 'ecuación general', def: 'Igualdad de segundo grado en x e y, con término xy incluido, que describe cualquier curva de este tipo.',
        ejemplo: '5x² − 6xy + 5y² − 8 = 0 tiene A = 5, B = −6 y C = 5.',
        formas: ['ecuación general', 'ecuaciones generales'], ver: ['discriminante', 'rotación de ejes'] },
      { termino: 'generatriz', simbolo: 'g', def: 'Recta del cono que va del vértice al borde: girándola alrededor del eje se arma el cono.',
        formas: ['generatriz', 'generatrices'], ejemplo: 'Con g = 60° desde la horizontal, el cono es angosto y alto.', ver: ['cono doble'] },
      { termino: 'cono doble', def: 'Dos conos unidos por su vértice, con el mismo eje: cada mitad es una hoja.',
        formas: ['cono doble', 'conos dobles'], ver: ['generatriz', 'cónica'] },
      { termino: 'cónica degenerada', def: 'Lo que deja un plano que pasa por el vértice del cono: un punto, una recta o dos rectas.',
        formas: ['cónica degenerada', 'cónicas degeneradas'], ver: ['cono doble'] },
      { termino: 'rotación de ejes', simbolo: 'θ', def: 'Cambiar a ejes x′, y′ inclinados un ángulo θ, para que la ecuación pierda el término xy.',
        ejemplo: '5x² − 6xy + 5y² = 8 con θ = 45° queda x′²/4 + y′² = 1.',
        formas: ['rotación de ejes', 'girar los ejes', 'gira los ejes', 'giro de ejes'], ver: ['ecuación general'] },
    ],
    // Laboratorio (docs/teoria.md §4b): tres mesas sin preguntas. La primera mueve también el foco (p) y deja a P ir
    // bajo la directriz, con la parábola punteada como guía; la segunda suelta la cuerda y los focos hasta los casos
    // raros (c = a: un segmento; c > a: ningún punto); la tercera suma la pendiente y pasos finos para atrapar la tangente.
    laboratorio: [
      mesaCono,
      {
        id: 'foco-y-directriz', titulo: 'Foco y directriz libres', pieza: 'trig-plano',
        consigna: 'Arrastra P y también el foco F: la directriz se aleja con él. Sobre la curva punteada, las dos distancias coinciden.',
        controles: [
          { id: 'x', etiqueta: 'x de P', min: -3.5, max: 3.5, paso: 0.25, inicio: 2, decimales: 2 },
          { id: 'y', etiqueta: 'y de P', min: -2, max: 4.5, paso: 0.25, inicio: 1, decimales: 2 },
          { id: 'p', etiqueta: 'p', color: 'c-o', min: 0.5, max: 2, paso: 0.25, inicio: 1, decimales: 2 },
        ],
        dibujo: val => ({ datos: focoLibre(val), estado: {} }),
        lectura: val => {
          const dF = distF(val), dD = distD(val);
          return [p, ` = ${f(val.p)}`, SEP, PF, ` ≈ ${f(dF)}`, SEP, PD, ` = ${f(dD)}`, SEP, Math.abs(dF - dD) < 1e-9 ? 'cumple' : 'no cumple'];
        },
        arrastres: [
          { id: 'punto-p', etiqueta: 'punto P', color: 'c-h',
            donde: val => TP().enPx(focoLibre(val), val.x, val.y),
            mover: (pt, val) => TP().delPx(focoLibre(val), pt) },
          { id: 'foco', etiqueta: 'foco F: cambia p', color: 'c-o',
            donde: val => TP().enPx(focoLibre(val), 0, val.p),
            mover: (pt, val) => ({ p: TP().delPx(focoLibre(val), pt).y }) },
        ],
        invitaciones: [
          { texto: 'Cambia p y vuelve a poner P sobre la curva: PF = PD.',
            logrado: val => val.p !== 1 && Math.abs(distF(val) - distD(val)) < 1e-9,
            bien: 'Otro foco, otra parábola: la condición PF = PD es la misma.' },
          { texto: 'Pon P en el punto de la curva más cercano al foco.',
            logrado: val => val.x === 0 && Math.abs(distF(val) - distD(val)) < 1e-9,
            bien: 'Es el vértice: queda a mitad de camino entre el foco y la directriz.' },
          { texto: 'Pon P debajo de la directriz y compara las dos distancias.',
            logrado: val => val.y < -val.p - 1e-9,
            bien: 'Ahí P está siempre más cerca de la directriz que del foco: nunca cumple.' },
          { texto: 'Guarda dos puntos simétricos respecto al eje y, con el mismo p.',
            logrado: (val, guardados) => guardados.some(g => guardados.some(q => g.x !== 0 && g.x === -q.x && g.y === q.y && g.p === q.p
              && Math.abs(distF(g) - distF(q)) < 1e-9)),
            bien: 'Mismas distancias al foco y a la directriz: la parábola es simétrica.' },
        ],
      },
      {
        id: 'cuerda-libre', titulo: 'Cuerda y focos libres', pieza: 'trig-plano',
        consigna: 'Cambia el largo de la cuerda 2a y separa los focos. ¿Qué pasa cuando c llega a a? ¿Y si la cuerda no alcanza?',
        controles: [
          { id: 'a', etiqueta: 'a', color: 'c-o', min: 2, max: 6, paso: 0.5, inicio: 5, decimales: 1 },
          { id: 'c', etiqueta: 'c', color: 'c-o', min: 0, max: 6, paso: 0.5, inicio: 3, decimales: 1 },
          { id: 't', etiqueta: 'lápiz P', min: 0, max: 350, paso: 10, inicio: 60, unidad: '°', decimales: 0 },
        ],
        dibujo: val => ({ datos: cuerdaLibre(val), estado: {} }),
        lectura: val => {
          if (val.c > val.a + 1e-9) return [`2a = ${f(2 * val.a)} < 2c = ${f(2 * val.c)}: ningún punto`];
          if (Math.abs(val.c - val.a) < 1e-9) return [`a = c = ${f(val.a)}: el segmento F₁F₂`];
          const P = puntaCuerda(val), d1 = Math.hypot(P[0] + val.c, P[1]);
          return [PF1, ' + ', PF2, ` ≈ ${f(d1)} + ${f(2 * val.a - d1)}`, SEP, b, ` ≈ ${f(bDe(val))}`];
        },
        // P recorre la curva (en el segmento, conserva su mitad, arriba o abajo); si la cuerda no alcanza, su punta estira a.
        arrastres: [
          { id: 'lapiz-p', etiqueta: 'lápiz P: recorre la curva o estira la cuerda', color: 'c-h',
            donde: val => { const P = puntaCuerda(val); return TP().enPx(cuerdaLibre(val), P[0], P[1]); },
            mover: (pt, val) => {
              const q = TP().delPx(cuerdaLibre(val), pt);
              if (val.c > val.a + 1e-9) return { a: (q.x + val.c) / 2 };
              const bv = bDe(val);
              if (bv < 1e-9) { const g = gr(Math.acos(Math.max(-1, Math.min(1, q.x / val.a)))); return { t: sen(val.t) >= -1e-9 ? g : 360 - g }; }
              return { t: angExc(q.x / val.a, q.y / bv) };
            } },
          { id: 'foco-2', etiqueta: 'foco F₂: cambia c', color: 'c-o',
            donde: val => TP().enPx(cuerdaLibre(val), val.c, 0),
            mover: (pt, val) => ({ c: TP().delPx(cuerdaLibre(val), pt).x }) },
        ],
        invitaciones: [
          { texto: 'Lleva el lápiz P a la punta más alta de la elipse.',
            logrado: val => val.c < val.a - 1e-9 && val.t === 90 && Math.abs(Math.hypot(val.c, bDe(val)) - val.a) < 1e-9,
            bien: 'Arriba, cada tramo de cuerda mide a: por eso b² = a² − c².' },
          { texto: 'Junta los dos focos y mira qué curva dibuja la cuerda.',
            logrado: val => val.c === 0,
            bien: 'Focos juntos: todos los puntos a distancia a. Es una circunferencia.' },
          { texto: 'Haz que la curva se aplane en el segmento entre los focos.',
            logrado: val => Math.abs(val.a - val.c) < 1e-9,
            bien: 'Con c = a, b = 0: la cuerda va tensa de foco a foco.' },
          { texto: 'Busca la elipse más achatada sin que llegue a ser un segmento.',
            logrado: val => bDe(val) > 1e-9 && bDe(val) / val.a <= masAchatada() + 1e-12,
            bien: 'Con c casi igual a a, los focos llegan casi a los extremos.' },
          { texto: 'Guarda dos elipses con el mismo semieje b y distinto a.',
            logrado: (val, guardados) => guardados.some(g => guardados.some(q => g.a !== q.a && g.c < g.a && q.c < q.a
              && Math.abs(bDe(g) - bDe(q)) < 1e-9)),
            bien: 'Mismo b, otro a: los focos se acomodan para que b² = a² − c².' },
        ],
      },
      {
        id: 'recta-y-parabola', titulo: 'Recta contra parábola', pieza: 'trig-plano',
        consigna: 'Mueve la recta por su corte con el eje y; inclínala con su otro punto. Busca la posición exacta en que toca una sola vez.',
        controles: [
          { id: 'm', etiqueta: 'm', color: 'c-o', min: -1, max: 1.5, paso: 0.25, inicio: 0.5, decimales: 2 },
          { id: 'k', etiqueta: 'k', color: 'c-o', min: -2.5, max: 2, paso: 0.0625, inicio: 0.5, decimales: 4 },
        ],
        dibujo: val => ({ datos: rectaLibre(val), estado: {} }),
        lectura: val => {
          const D = deltaRP(val);
          return [`Δ = ${f(D, 3)}`, SEP, D > 1e-9 ? 'dos cortes' : D < -1e-9 ? 'ningún corte' : `tangente: k = −m² = ${f(val.k, 4)}`];
        },
        arrastres: [
          { id: 'corte-k', etiqueta: 'corte con el eje y: cambia k', color: 'c-o',
            donde: val => TP().enPx(rectaLibre(val), 0, val.k),
            mover: (pt, val) => { const q = TP().delPx(rectaLibre(val), pt); return { k: q.y - val.m * q.x }; } },
          { id: 'inclinacion', etiqueta: 'otro punto de la recta: cambia m', color: 'c-o',
            donde: val => TP().enPx(rectaLibre(val), 1.5, 1.5 * val.m + val.k),
            mover: (pt, val) => { const q = TP().delPx(rectaLibre(val), pt); return { m: (q.y - val.k) / Math.max(0.5, q.x) }; } },
        ],
        invitaciones: [
          { texto: 'Haz que la recta toque la parábola una sola vez.',
            logrado: val => Math.abs(deltaRP(val)) < 1e-9,
            bien: 'Δ = 0, raíz doble: es una recta tangente. ¿Habrá una para cada m?' },
          { texto: 'Consigue que la recta no corte la parábola.',
            logrado: val => deltaRP(val) < -1e-9,
            bien: 'Δ negativo: al sustituir, la ecuación no tiene raíces reales.' },
          { texto: 'Con la recta horizontal, haz que toque la parábola solo en su vértice.',
            logrado: val => val.m === 0 && Math.abs(deltaRP(val)) < 1e-9,
            bien: 'y = 0 se apoya en x² = 4y justo en (0; 0).' },
          { texto: 'Con m = 1, busca el menor k que todavía toque la parábola.',
            logrado: val => val.m === 1 && deltaRP(val) > -1e-9 && deltaRP({ m: 1, k: val.k - 0.0625 }) < -1e-9,
            bien: 'Justo en k = −m² la recta toca: más abajo, ya no hay corte.' },
          { texto: 'Guarda dos rectas paralelas: una que corte dos veces y otra que no corte.',
            logrado: (val, guardados) => guardados.some(g => guardados.some(q => g.m === q.m && deltaRP(g) > 1e-9 && deltaRP(q) < -1e-9)),
            bien: 'Misma inclinación: subir o bajar la recta cambia el signo de Δ.' },
        ],
      },
    ],
    historia: {
      texto: 'Apolonio de Perga estudió las curvas que salen de cortar un cono con un plano, y su obra nos llegó en griego y en traducciones árabes. Las ecuaciones cartesianas llegaron siglos después. Hoy hay tres maneras de describir la misma curva: cortar un sólido, poner una condición sobre distancias y escribir una ecuación. La tarea es reconocer cuándo coinciden.',
      pregunta: '¿Cómo saber que una condición y una ecuación describen la misma curva?',
      fuente: { titulo: 'J. J. O’Connor y E. F. Robertson, «Apollonius of Perga», MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Apollonius/' },
    },
    ideas: [parabola, elipseIdea, hiperbolaIdea, tangenteIdea, rotacion],
  };
});
