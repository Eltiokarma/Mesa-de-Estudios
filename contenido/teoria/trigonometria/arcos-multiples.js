/*
 * Teoría de «Ángulo doble, mitad y triple» (trigonometria.arcos-multiples), 5.º de secundaria.
 * Fuente del contenido: docs/teoria/matriz/trigonometria.json (unidad 11), docs/teoria/fuentes/historia-ecuaciones.pdf
 * (trigonometría, pp. 82–100) y las «Precisiones de Geometría y Trigonometría» del expediente.
 * Forma: contenido/teoria/trigonometria/angulo-trigonometrico.js.
 * Compañera: Mara (coneja), cercana y rigurosa: doblar, partir o triplicar el ángulo no hace lo mismo con su seno.
 * Colores (regla 4): cada ángulo tiene el suyo en toda la unidad. θ (o x) en naranja (c-o), el doble 2θ en rojo (c-h),
 * la mitad θ/2 en turquesa (c-i) y el triple 3θ en verde (c-d). Una curva lleva el color del ángulo que manda en ella:
 * sen² x y cos 2x en rojo, porque los dos se repiten como 2x.
 * Errores (hipótesis de distractor: docs/investigacion/trigonometria-ideas-erroneas.md no los mide; códigos nuevos
 * de esta unidad): DOBLE-SEN (sen 2θ = 2 sen θ), DOBLE-SIN-2, DOBLE-CUADRANTE, DOBLE-SIGNO, DOBLE-CRUCE,
 * DEG-SIGNO, DEG-MITAD, DEG-DOBLE (cos² x = cos 2x), DEG-UNO, MITAD-SIGNO (raíz siempre positiva),
 * MITAD-SIGNO-THETA (copiar el signo de θ), MITAD-RAIZ, MITAD-DOBLE (±), TRIPLE-SEN (sen 3θ = 3 sen θ),
 * TRIPLE-CUBO, TRIPLE-SIGNO, TRIPLE-CRUCE.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: doblar, partir o triplicar un ángulo cambia su seno con una regla propia, nunca multiplicando el valor.
 *   Persona y condiciones: postulante de 5.º, celular de 360 px de gama baja, con o sin conexión, en el aula o en casa.
 *   Resultado observable: calcula razones del doble, la mitad y el triple, baja potencias y elige el signo de la raíz.
 *   Orden de atención: 1.º el rayo θ · 2.º el rayo del ángulo nuevo y su altura · acción: mover θ · fondo: la circunferencia.
 *   Estados: juego sin tocar · probando · predicción pendiente · coincide / no coincide · paso de «Mira» · caso nuevo.
 *   Duda que resuelve: ¿por qué sen 60° no es 2 sen 30°, y quién decide el signo de sen(θ/2)?
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const th = { v: 'c-o', t: 'θ' }, x_ = { v: 'c-o', t: 'x' }, dos = { v: 'c-h', t: '2θ' }, dosx = { v: 'c-h', t: '2x' };
  const mit = { v: 'c-i', t: 'θ/2' }, tri = { v: 'c-d', t: '3θ' };
  const rad = g => g * Math.PI / 180;
  const sen = g => Math.sin(rad(g)), cos = g => Math.cos(rad(g));
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
      if (d.valor === null || d.valor === undefined) continue;
      const txt = fmt(d.valor);
      if (vistos.has(txt)) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }
  // Fracciones exactas [n, d] con d > 0.
  const mcd = (a, b) => (b ? mcd(b, a % b) : Math.abs(a));
  const Q = (n, d = 1) => { if (d === 0) return null; if (d < 0) { n = -n; d = -d; } const m = mcd(n, d) || 1; return [n / m, d / m]; };
  const qt = q => (q === null ? 'No existe' : `${q[0] < 0 ? '−' : ''}${Math.abs(q[0])}${q[1] === 1 ? '' : '/' + q[1]}`);
  const qp = q => (q[0] < 0 ? `(${qt(q)})` : qt(q));
  const CUAD = ['primer', 'segundo', 'tercer', 'cuarto'];
  // Cuadrante de un ángulo (0 a 3) o null si cae sobre un eje.
  const cuadrante = g => { const m = ((g % 360) + 360) % 360; return m % 90 === 0 ? null : Math.floor(m / 90); };
  const ROMANO = ['I', 'II', 'III', 'IV'];

  // ---------- Idea 1: doblar el ángulo no dobla el seno ----------
  // Cambia: θ, de 20° en 20°. · Permanece: la circunferencia de radio 1 y el lado inicial.
  // Progresa: la torre 2 sen θ, que se aleja de la altura real del rayo 2θ. · Se reserva: θ = 30° (la predicción).
  // Debe verse: que la altura de 2θ se arma con dos piezas iguales, sen θ cos θ.
  const V1 = { x: [-1.1, 1.75], y: [-0.3, 2.05] }, V1m = { x: [-0.75, 1.3], y: [-0.3, 1.25] };
  const semi = { de: -17, a: 197, r: 1, espiral: 0, flecha: false, color: null, grosor: 'contorno' };
  function doble(t, extra = {}) {
    const d = 2 * t, h = sen(d);
    return Object.assign({
      ventana: V1,
      rayos: [{ ang: 0, largo: 1, grosor: 'contorno' }, { ang: t, color: 'o' }, { ang: d, color: 'h' }],
      arcos: [semi, { de: 0, a: t, r: 0.22, color: 'o', rotulo: 'θ', espiral: 0 }, { de: t, a: d, r: 0.36, color: 'o', rotulo: 'θ', espiral: 0 }],
      rectas: [{ y: h, color: 'h' }],
      segmentos: [{ de: [cos(d), 0], a: [cos(d), h], color: 'h' }, { de: [1.3, 0], a: [1.3, 2 * sen(t)], color: 'o', rotulo: '2 sen θ' }],
      alt: `Giro de ${f(t)}° y su doble ${f(d)}°: la altura del doble es ${f(h)} y el doble de la altura es ${f(2 * sen(t))}`,
    }, extra);
  }
  const M1 = (() => { const t = 30, P = [cos(60), sen(60)], Qp = [cos(t) * cos(t), cos(t) * sen(t)]; return { t, P, Q: Qp }; })();
  const doblar = {
    id: 'angulo-doble',
    titulo: 'El doble del ángulo',
    temas: ['Identidades del ángulo doble'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Elige θ. El rayo rojo gira θ dos veces. Compara su altura, la línea roja, con la torre naranja 2 sen θ.',
      voz: 'Conservemos el origen: el segundo θ sale del rayo naranja.',
      controles: [{ id: 't', etiqueta: 'θ', color: 'c-o', min: 20, max: 80, paso: 20, inicio: 20, unidad: '°', decimales: 0 }],
      dibujo: val => ({ datos: doble(val.t), estado: {} }),
      lectura: val => ['sen ', dos, ` = ${f(sen(2 * val.t))}; 2 sen `, th, ` = ${f(2 * sen(val.t))}`],
      minimo: 3,
    },
    predice: {
      pregunta: ['Con ', th, ' = 30°, un caso que no probaste, ¿cuánto vale sen 60°, la altura del rayo rojo?'],
      voz: 'Piensa desde dónde sale el segundo giro.',
      opciones: [
        { id: 'c', texto: 'Cerca de 0,87', correcta: true },
        { id: 'doble', texto: '1, el doble de sen 30°', error: 'DOBLE-SEN', siFuera: 'Doblar la altura sería cierto si el segundo giro saliera del eje x. Sale del rayo θ.' },
        { id: 'sin2', texto: 'Cerca de 0,43: sen 30° · cos 30°', error: 'DOBLE-SIN-2', siFuera: 'Ese producto es una de las dos piezas de la altura. Faltaría la otra, igual a ella.' },
        { id: 'igual', texto: '0,5, igual que sen 30°', error: 'DOBLE-SEN', siFuera: 'Mismo seno sería cierto si los dos rayos tuvieran la misma altura. El rojo sube más.' },
      ],
      dibujo: { datos: doble(30, { rectas: [], segmentos: [{ de: [1.3, 0], a: [1.3, 1], color: 'o', rotulo: '2 sen θ' }] }), estado: {} },
      revelar: { datos: doble(30, { rotulos: [{ x: -0.55, y: sen(60) + 0.13, texto: `sen 60° ≈ ${f(sen(60))}`, color: 'h' }] }), estado: {} },
      coincide: 'Coincide: la altura real es 0,87; el doble de sen 30° da 1.',
      noCoincide: 'Revisemos las dos alturas: la torre y la línea roja están dibujadas.',
    },
    mira: {
      datos: {
        ventana: V1m,
        rayos: [{ ang: 0, largo: 1, grosor: 'contorno' }, { ang: M1.t, color: 'o', grosor: 'contorno' }, { ang: 2 * M1.t, color: 'h' }],
        arcos: [Object.assign({}, semi, { a: 133 }), { de: 0, a: M1.t, r: 0.22, color: 'o', espiral: 0 }, { de: M1.t, a: 2 * M1.t, r: 0.36, color: 'o', espiral: 0 }],
        rectas: [{ y: M1.P[1], color: 'h', desde: 1 }],
        puntos: [{ x: M1.P[0], y: M1.P[1], color: 'h', rotulo: 'P', lado: 'no', desde: 1 }, { x: M1.Q[0], y: M1.Q[1], rotulo: 'Q', lado: 'e', desde: 2 }],
        segmentos: [
          { de: [0, 0], a: M1.Q, color: 'o', desde: 2 },
          { de: M1.Q, a: M1.P, color: 'o', desde: 2 },
          { de: [M1.Q[0], 0], a: M1.Q, color: 'h', desde: 3 },
          { de: M1.Q, a: [M1.P[0], M1.Q[1]], grosor: 'contorno', discontinua: true, desde: 3 },
          { de: [M1.P[0], M1.Q[1]], a: M1.P, color: 'h', desde: 3 },
        ],
        rotulos: [
          { x: 0.3, y: 0.06, texto: 'cos θ', color: 'o', ancla: 'start', desde: 2 }, { x: 0.68, y: 0.7, texto: 'sen θ', color: 'o', ancla: 'start', desde: 2 },
          { x: 0.81, y: 0.2, texto: 'sen θ cos θ', color: 'h', ancla: 'start', desde: 3 },
          { x: -0.05, y: 0.62, texto: 'cos θ sen θ', color: 'h', ancla: 'end', desde: 3 },
        ],
        alt: 'La altura del punto a 60 grados se parte en dos piezas iguales, cada una seno de 30 por coseno de 30',
      },
      voz: 'Cuenta las piezas de la altura: son dos, y miden lo mismo.',
      pasos: [
        { estado: { corte: 1 }, texto: 'La altura de P es el seno del ángulo doble.', ecuacion: ['sen ', dos, ' = sen(', th, ' + ', th, ')'] },
        { estado: { corte: 2 }, texto: 'Bajamos de P al rayo θ: OQ = cos θ y QP = sen θ.', ecuacion: ['OQ = cos ', th, ';  QP = sen ', th] },
        { estado: { corte: 3 }, texto: 'La altura de Q y la subida de Q a P son iguales.', ecuacion: ['sen ', th, ' cos ', th, ' + cos ', th, ' sen ', th, ' = 2 sen ', th, ' cos ', th] },
        { estado: { corte: 3 }, texto: 'Con θ = 30°, las dos piezas suman la altura roja.', ecuacion: [`2 · ${f(sen(30))} · ${f(cos(30))} = ${f(sen(60))}`] },
        { estado: { corte: 3 }, texto: 'El coseno doble resta las proyecciones al cuadrado.', ecuacion: ['cos ', dos, ' = ', { sup: ['cos', '2'] }, ' ', th, ' − ', { sup: ['sen', '2'] }, ' ', th, ' = 1 − 2', { sup: ['sen', '2'] }, ' ', th] },
      ],
    },
    regla: {
      texto: 'El doble de un ángulo se calcula con las razones de ese ángulo; no se dobla el valor.',
      ecuacion: ['sen ', dos, ' = 2 sen ', th, ' cos ', th, ';   cos ', dos, ' = ', { sup: ['cos', '2'] }, th, ' − ', { sup: ['sen', '2'] }, th, ';   tan ', dos, ' = ', { frac: [['2 tan ', th], ['1 − ', { sup: ['tan', '2'] }, th]] }],
      condicion: 'θ real. En la tangente, tan θ debe existir y tan² θ ≠ 1.',
      voz: 'Un solo ángulo, dos razones: las dos entran en el doble.',
    },
    ahoraTu: {
      voz: 'Ubica el cuadrante: él decide el signo del coseno.',
      generar(sem) {
        const rr = azar(sem);
        const [p, q, r] = rr.uno([[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [8, 15, 17], [15, 8, 17], [7, 24, 25]]);
        const k = rr.ent(0, 3), S = p * (k < 2 ? 1 : -1), C = q * (k === 0 || k === 3 ? 1 : -1), D = r * r;
        const pide = sem % 3;
        const preg = ['Si sen ', th, ` = ${qt(Q(S, r))} y θ está en el ${CUAD[k]} cuadrante, ¿cuánto vale `];
        if (pide === 0) {
          const bien = Q(2 * S * C, D);
          return {
            pregunta: [...preg, 'sen ', dos, '?'],
            opciones: opciones(bien, [
              { id: 'doble', valor: Q(2 * S, r), error: 'DOBLE-SEN', siFuera: 'Eso dobla el seno. Doblarlo sería cierto si el segundo giro saliera del eje x.' },
              { id: 'sin2', valor: Q(S * C, D), error: 'DOBLE-SIN-2', siFuera: 'Esa es una de las dos piezas iguales de la altura; faltó el 2.' },
              { id: 'cuad', valor: Q(-2 * S * C, D), error: 'DOBLE-CUADRANTE', siFuera: `La fórmula está bien. En el ${CUAD[k]} cuadrante el coseno es ${C > 0 ? 'positivo' : 'negativo'}.` },
            ], qt),
            solucion: { texto: `En el ${CUAD[k]} cuadrante, cos θ = ${qt(Q(C, r))}.`, ecuacion: ['sen ', dos, ` = 2 · ${qp(Q(S, r))} · ${qp(Q(C, r))} = ${qt(bien)}`] },
          };
        }
        if (pide === 1) {
          const bien = Q(C * C - S * S, D);
          return {
            pregunta: [...preg, 'cos ', dos, '?'],
            opciones: opciones(bien, [
              { id: 'doble', valor: Q(2 * C, r), error: 'DOBLE-SEN', siFuera: 'Eso dobla el coseno. El ángulo se dobla, el valor no.' },
              { id: 'cruce', valor: Q(S * S - C * C, D), error: 'DOBLE-CRUCE', siFuera: 'La forma es la buena con el orden cambiado: va cos² θ menos sen² θ.' },
              { id: 'signo', valor: Q(C * C + S * S, D), error: 'DOBLE-SIGNO', siFuera: 'cos² θ + sen² θ = 1 vale siempre. En el coseno doble los cuadrados se restan.' },
            ], qt),
            solucion: { texto: 'Se usa 1 − 2 sen² θ: no hace falta el signo del coseno.', ecuacion: ['cos ', dos, ` = 1 − 2 · ${qp(Q(S, r))}² = ${qt(bien)}`] },
          };
        }
        const bien = Q(2 * S * C, C * C - S * S);
        return {
          pregunta: [...preg, 'tan ', dos, '?'],
          opciones: opciones(bien, [
            { id: 'doble', valor: Q(2 * S, C), error: 'DOBLE-SEN', siFuera: 'Eso dobla la tangente. Falta dividir entre 1 − tan² θ.' },
            { id: 'cruce', valor: Q(2 * S * C, D), error: 'DOBLE-CRUCE', siFuera: 'Ese es sen 2θ. La tangente divide sen 2θ entre cos 2θ.' },
            { id: 'cuad', valor: Q(-2 * S * C, C * C - S * S), error: 'DOBLE-CUADRANTE', siFuera: `La fórmula está bien. En el ${CUAD[k]} cuadrante, tan θ = ${qt(Q(S, C))}.` },
          ], qt),
          solucion: { texto: `Con tan θ = ${qt(Q(S, C))} se aplica la fórmula del doble.`, ecuacion: ['tan ', dos, ' = ', { frac: [`2 · ${qp(Q(S, C))}`, `1 − (${qt(Q(S, C))})²`] }, ` = ${qt(bien)}`] },
        };
      },
    },
  };

  // ---------- Idea 2: bajar la potencia dobla el ángulo ----------
  // Cambia: la función que se grafica (sen x, cos x, sen² x, cos² x). · Permanece: los ejes de 0° a 360° y la onda
  // sen x de referencia. · Progresa: la onda al cuadrado, que se encoge a [0, 1] y se repite el doble de veces.
  // · Se reserva: la fórmula de cos² x (la predicción). · Debe verse: centro 1/2, amplitud 1/2 y periodo 180°.
  const pts = (fn, desde = 0, hasta = 360) => Array.from({ length: (hasta - desde) / 5 + 1 }, (_, i) => [desde + i * 5, fn(desde + i * 5)]);
  const FUN = {
    sen: { fn: sen, txt: 'sen x', rango: 'entre −1 y 1', per: 360 },
    cos: { fn: cos, txt: 'cos x', rango: 'entre −1 y 1', per: 360 },
    sen2: { fn: x => sen(x) ** 2, txt: 'sen² x', rango: 'entre 0 y 1', per: 180 },
    cos2: { fn: x => cos(x) ** 2, txt: 'cos² x', rango: 'entre 0 y 1', per: 180 },
  };
  const ejesOnda = (curvas, puntos = []) => ({
    x: { min: 0, max: 360, paso: 90, nombre: 'x', unidad: '°', decimales: 0, color: 'o' },
    y: { min: -1.2, max: 1.2, paso: 0.5, decimales: 1 },
    curvas, puntos,
  });
  const deg2 = {
    id: 'degradacion',
    titulo: 'Bajar la potencia',
    temas: ['Degradación de potencias'],
    pieza: 'ejes',
    juega: {
      consigna: 'Elige qué graficar. La onda naranja sen x queda de referencia. Mira entre qué valores va cada una y cada cuánto se repite.',
      voz: 'Fíjate en el centro de cada onda, no solo en su forma.',
      controles: [{ id: 'g', etiqueta: 'Función', opciones: [{ valor: 'sen', texto: 'sen x' }, { valor: 'cos', texto: 'cos x' }, { valor: 'sen2', texto: 'sen² x' }, { valor: 'cos2', texto: 'cos² x' }], inicio: 'sen' }],
      dibujo: val => {
        const F = FUN[val.g];
        return { datos: ejesOnda([{ puntos: pts(sen), color: 'o', discontinua: true, rotulo: 'sen x', en: [300, sen(300)] },
          ...(val.g === 'sen' ? [] : [{ puntos: pts(F.fn), color: F.per === 180 ? 'h' : 'o', rotulo: F.txt, en: [F.per === 180 ? 225 : 160, F.fn(F.per === 180 ? 225 : 160)] }])]), estado: {} };
      },
      lectura: val => [`${FUN[val.g].txt}: ${FUN[val.g].rango}; se repite cada ${FUN[val.g].per}°`],
      minimo: 3,
    },
    predice: {
      pregunta: ['cos² x es una onda que puede escribirse como A + B cos ', dosx, '. ¿Cuánto valen A y B?'],
      voz: 'Usa el centro y la altura de la onda que viste.',
      opciones: [
        { id: 'c', texto: 'A = 1/2 y B = 1/2', correcta: true },
        { id: 'uno', texto: 'A = 1 y B = 1', error: 'DEG-MITAD', siFuera: 'La forma es buena, pero 1 + cos 2x llega a 2, y la onda solo llega a 1.' },
        { id: 'signo', texto: 'A = 1/2 y B = −1/2', error: 'DEG-SIGNO', siFuera: 'Centro y altura bien. Con menos empezaría en 0, como sen² x; cos² x empieza en 1.' },
        { id: 'doble', texto: 'A = 0 y B = 1', error: 'DEG-DOBLE', siFuera: 'Sería cierto si cos² x bajara hasta −1. Un cuadrado nunca es negativo.' },
      ],
      dibujo: { datos: ejesOnda([{ puntos: pts(x => cos(x) ** 2), color: 'h', rotulo: 'cos² x', en: [45, 0.5] }]), estado: {} },
      revelar: { datos: ejesOnda([{ puntos: pts(x => cos(x) ** 2), color: 'h', rotulo: 'cos² x', en: [45, 0.5] }, { puntos: pts(x => 0.5 + 0.5 * cos(2 * x)), color: 'h', discontinua: true, rotulo: '½ + ½ cos 2x = cos² x', en: [180, -0.6] }]), estado: {} },
      coincide: 'Coincide: centro 1/2, altura 1/2 y empieza arriba, como cos 2x.',
    },
    mira: {
      datos: ejesOnda([
        { puntos: pts(x => sen(x) ** 2), color: 'h', rotulo: 'sen² x', en: [45, 0.5] },
        { puntos: pts(() => 0.5), color: 'h', discontinua: true, desde: 2 },
        { puntos: pts(x => cos(2 * x)), color: 'h', discontinua: true, rotulo: 'cos 2x', en: [180, 1], desde: 3 },
      ], [{ x: 90, y: 1, color: 'h', desde: 1 }, { x: 180, y: 0, color: 'h', desde: 1 }]),
      voz: 'La potencia baja, el ángulo se duplica.',
      pasos: [
        { estado: { corte: 1 }, texto: 'sen² x nunca baja de 0 ni pasa de 1.', ecuacion: ['0 ≤ ', { sup: ['sen', '2'] }, ' ', x_, ' ≤ 1'] },
        { estado: { corte: 2 }, texto: 'Su centro es 1/2 y sube o baja 1/2.', ecuacion: [{ sup: ['sen', '2'] }, ' ', x_, ' = ', { frac: ['1', '2'] }, ' − ', { frac: ['1', '2'] }, ' · (onda)'] },
        { estado: { corte: 3 }, texto: 'Se repite cada 180°, como cos 2x, pero al revés.', ecuacion: ['onda = cos ', dosx] },
        { estado: { corte: 3 }, texto: 'Sale también despejando el coseno del doble.', ecuacion: ['cos ', dosx, ' = 1 − 2', { sup: ['sen', '2'] }, ' ', x_, '  ⇒  ', { sup: ['sen', '2'] }, ' ', x_, ' = ', { frac: [['1 − cos ', dosx], '2'] }] },
      ],
    },
    regla: {
      texto: 'Un cuadrado de seno o de coseno se escribe sin potencia con el coseno del doble. La potencia baja y el ángulo se duplica.',
      ecuacion: [{ sup: ['sen', '2'] }, ' ', x_, ' = ', { frac: [['1 − cos ', dosx], '2'] }, ';   ', { sup: ['cos', '2'] }, ' ', x_, ' = ', { frac: [['1 + cos ', dosx], '2'] }],
      condicion: 'x real. A la derecha va el ángulo doble, 2x, no x.',
      voz: 'Menos potencia, más ángulo; el valor no cambia.',
    },
    ahoraTu: {
      voz: 'Escribe primero la fórmula con el ángulo doble.',
      generar(sem) {
        const rr = azar(sem);
        const r = rr.uno([[1, 3], [-1, 3], [1, 5], [-3, 5], [7, 25], [-7, 25], [1, 9], [-5, 13], [2, 7], [-1, 4]]);
        const esSen = sem % 2 === 0, R = Q(r[0], r[1]);
        const bien = esSen ? Q(R[1] - R[0], 2 * R[1]) : Q(R[1] + R[0], 2 * R[1]);
        const otro = esSen ? Q(R[1] + R[0], 2 * R[1]) : Q(R[1] - R[0], 2 * R[1]);
        const sinMitad = esSen ? Q(R[1] - R[0], R[1]) : Q(R[1] + R[0], R[1]);
        const fn = esSen ? 'sen' : 'cos';
        return {
          pregunta: ['Si cos ', dosx, ` = ${qt(R)}, ¿cuánto vale `, { sup: [fn, '2'] }, ' ', x_, '?'],
          opciones: opciones(bien, [
            { id: 'signo', valor: otro, error: 'DEG-SIGNO', siFuera: `Ese es el valor de ${esSen ? 'cos²' : 'sen²'} x. Para ${fn}² x el coseno doble va con ${esSen ? 'menos' : 'más'}.` },
            { id: 'mitad', valor: sinMitad, error: 'DEG-MITAD', siFuera: 'El numerador está bien; falta dividir entre 2.' },
            { id: 'doble', valor: R, error: 'DEG-DOBLE', siFuera: `Eso iguala ${fn}² x con cos 2x. Sería cierto si la onda bajara hasta −1.` },
          ], qt),
          solucion: { texto: `Se baja la potencia con el coseno doble ${esSen ? 'restado' : 'sumado'}.`, ecuacion: [{ sup: [fn, '2'] }, ' ', x_, ' = ', { frac: [`1 ${esSen ? '−' : '+'} ${qp(R)}`, '2'] }, ` = ${qt(bien)}`] },
        };
      },
    },
  };

  // ---------- Idea 3: el signo de la mitad lo decide θ/2 ----------
  // Cambia: θ, de 45° en 45° hasta dos vueltas. · Permanece: la circunferencia y el lado inicial.
  // Progresa: el rayo turquesa θ/2, que recorre una sola vuelta mientras θ recorre dos. · Se reserva: θ = 300° (la
  // predicción). · Debe verse: que la altura de θ/2 puede tener otro signo que la de θ.
  const mitad = (t, extra = {}) => Object.assign({
    circulos: [{ r: 1 }],
    rayos: [{ ang: 0, largo: 1, grosor: 'contorno' }, { ang: t, color: 'o' }, { ang: t / 2, color: 'i' }],
    arcos: [{ de: 0, a: t, r: 0.2, color: 'o', espiral: 6 }, { de: 0, a: t / 2, r: 0.55, color: 'i', espiral: 0 }],
    segmentos: [{ de: [cos(t), 0], a: [cos(t), sen(t)], color: 'o', rotulo: 'sen θ' }, { de: [cos(t / 2), 0], a: [cos(t / 2), sen(t / 2)], color: 'i', rotulo: 'sen θ/2' }],
    rotulos: [{ x: 0.75, y: -0.18, texto: 'inicial' }],
    alt: `Giro θ de ${f(t)}° y su mitad de ${f(t / 2)}°: las alturas son ${f(sen(t))} y ${f(sen(t / 2))}`,
  }, extra);
  const cuadTxt = g => (cuadrante(g) === null ? 'sobre un eje' : `cuadrante ${ROMANO[cuadrante(g)]}`);
  const mitadIdea = {
    id: 'angulo-mitad',
    titulo: 'El signo de la mitad',
    temas: ['Ángulo mitad'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Gira θ hasta dos vueltas. El rayo turquesa marca la mitad del giro. Compara el signo de las dos alturas.',
      voz: 'Conservemos el giro completo: la mitad de 315° no es la mitad de −45°.',
      controles: [{ id: 't', etiqueta: 'θ', color: 'c-o', min: 0, max: 720, paso: 45, inicio: 135, unidad: '°', decimales: 0 }],
      dibujo: val => ({ datos: mitad(val.t), estado: {} }),
      lectura: val => [mit, ` = ${f(val.t / 2, 1)}°, ${cuadTxt(val.t / 2)}; sen `, mit, ` = ${f(sen(val.t / 2))}`],
      minimo: 3,
    },
    predice: {
      pregunta: ['Si ', th, ' = 300°, sen ', th, ' es negativo. ¿Cuánto vale sen(', mit, ')?'],
      voz: 'Ubica primero dónde queda la mitad del giro.',
      opciones: [
        { id: 'c', texto: '1/2', correcta: true },
        { id: 'theta', texto: '−1/2, con el signo de sen θ', error: 'MITAD-SIGNO-THETA', siFuera: 'El valor 1/2 está bien. Pero el signo lo da θ/2 = 150°, que está en el cuadrante II.' },
        { id: 'ambos', texto: '1/2 o −1/2: no se puede decidir', error: 'MITAD-DOBLE', siFuera: 'La fórmula da dos candidatos. Conociendo θ, la mitad del giro decide uno.' },
        { id: 'raiz', texto: '1/4', error: 'MITAD-RAIZ', siFuera: '1/4 es sen² de la mitad; falta sacar la raíz.' },
      ],
      dibujo: { datos: mitad(300, { rayos: [{ ang: 0, largo: 1, grosor: 'contorno' }, { ang: 300, color: 'o' }], arcos: [{ de: 0, a: 300, r: 0.2, color: 'o', espiral: 6 }], segmentos: [{ de: [cos(300), 0], a: [cos(300), sen(300)], color: 'o', rotulo: 'sen θ' }] }), estado: {} },
      revelar: { datos: mitad(300), estado: {} },
      coincide: 'Coincide: θ/2 = 150° está en el cuadrante II, donde el seno es positivo.',
    },
    mira: {
      datos: {
        circulos: [{ r: 1 }],
        rayos: [{ ang: 0, largo: 1, grosor: 'contorno' }, { ang: 300, color: 'o' }, { ang: 150, color: 'i', desde: 2, rotulo: '150°' }, { ang: 330, color: 'i', discontinua: true, desde: 2, hasta: 2, rotulo: '330°' }],
        arcos: [{ de: 0, a: 300, r: 0.2, color: 'o', espiral: 6 }, { de: 0, a: 150, r: 0.55, color: 'i', espiral: 0, desde: 3 }],
        segmentos: [{ de: [0, 0], a: [cos(300), 0], color: 'o', desde: 1 }, { de: [cos(150), 0], a: [cos(150), sen(150)], color: 'i', rotulo: '+1/2', desde: 3 }],
        puntos: [{ x: cos(150), y: sen(150), color: 'i', desde: 2 }, { x: cos(330), y: sen(330), color: 'i', abierto: true, desde: 2, hasta: 2 }],
        rotulos: [{ x: 0.42, y: -0.24, texto: 'cos θ = ½', color: 'o', ancla: 'start', desde: 1 }],
        alt: 'El giro de 300 grados tiene coseno un medio; su mitad, 150 grados, queda en el segundo cuadrante con seno positivo',
      },
      voz: 'Dos candidatos; la mitad del giro elige uno.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Del giro θ = 300° solo se usa su coseno.', ecuacion: ['cos 300° = ', { frac: ['1', '2'] }] },
        { estado: { corte: 2 }, texto: 'La fórmula del cuadrado da dos candidatos con alturas opuestas.', ecuacion: [{ sup: ['sen', '2'] }, mit, ' = ', { frac: [['1 − cos ', th], '2'] }, ' = ', { frac: ['1', '4'] }, '  ⇒  ±', { frac: ['1', '2'] }] },
        { estado: { corte: 3 }, texto: 'La mitad de 300° es 150°: cuadrante II.', ecuacion: [mit, ' = 150°'] },
        { estado: { corte: 3 }, texto: 'En el cuadrante II el seno es positivo.', ecuacion: ['sen ', mit, ' = +', { frac: ['1', '2'] }] },
      ],
    },
    regla: {
      texto: 'Las fórmulas de la mitad salen de bajar la potencia y sacar raíz. El signo de la raíz lo decide el cuadrante de θ/2.',
      ecuacion: ['sen ', mit, ' = ±', { raiz: ['(1 − cos ', th, ')/2'] }, ';   cos ', mit, ' = ±', { raiz: ['(1 + cos ', th, ')/2'] }],
      condicion: 'se elige un solo signo: el del cuadrante de θ/2, no el de θ. Hay que conocer el giro θ.',
      voz: 'La raíz da dos candidatos; el cuadrante de la mitad decide.',
    },
    ahoraTu: {
      voz: 'Primero divide el intervalo de θ entre dos.',
      generar(sem) {
        const rr = azar(sem);
        const [a, b] = rr.uno([[1, 2], [3, 5], [4, 5], [1, 3], [2, 3], [5, 13], [12, 13], [1, 4], [3, 4]]);
        const k = rr.ent(0, 3), esSen = sem % 2 === 0;
        // valor absoluto de la razón de la mitad = a/b; cos θ sale de 1 − 2(a/b)² (seno) o 2(a/b)² − 1 (coseno).
        const cosT = esSen ? Q(b * b - 2 * a * a, b * b) : Q(2 * a * a - b * b, b * b);
        const sgMitad = esSen ? (k < 2 ? 1 : -1) : (k === 0 || k === 3 ? 1 : -1);
        const lo = 180 * k, hi = 180 * (k + 1);
        // Signo de la razón del ángulo θ entero (el error de copiar su signo).
        const tMed = (lo + hi) / 2, sgTheta = Math.sign(esSen ? sen(tMed) : cos(tMed)) || 1;
        const fn = esSen ? 'sen' : 'cos';
        const bien = Q(sgMitad * a, b);
        return {
          pregunta: ['Si cos ', th, ` = ${qt(cosT)} y ${lo}° < `, th, ` < ${hi}°, ¿cuánto vale ${fn}(`, mit, ')?'],
          opciones: opciones(bien, [
            { id: 'signo', valor: Q(-sgMitad * a, b), error: sgTheta === -sgMitad ? 'MITAD-SIGNO-THETA' : 'MITAD-SIGNO', siFuera: `El valor ${a}/${b} está bien. El signo lo da θ/2, que queda entre ${lo / 2}° y ${hi / 2}°.` },
            { id: 'raiz', valor: Q(sgMitad * a * a, b * b), error: 'MITAD-RAIZ', siFuera: `Ese es ${fn}² de la mitad; falta sacar la raíz.` },
            { id: 'ambos', valor: `±${a}/${b}`, error: 'MITAD-DOBLE', siFuera: 'La raíz da dos candidatos, pero el intervalo de θ deja uno solo.' },
          ], v => (typeof v === 'string' ? v : qt(v))),
          solucion: { texto: `θ/2 está entre ${lo / 2}° y ${hi / 2}°: ahí el ${fn === 'sen' ? 'seno' : 'coseno'} es ${sgMitad > 0 ? 'positivo' : 'negativo'}.`, ecuacion: [`${fn} `, mit, ` = ${sgMitad > 0 ? '+' : '−'}`, { raiz: [`(1 ${esSen ? '−' : '+'} ${qp(cosT)})/2`] }, ` = ${qt(bien)}`] },
        };
      },
    },
  };

  // ---------- Idea 4: el triple y sus tres candidatos ----------
  // Cambia: θ, de 10° en 10°. · Permanece: la curva y = 3s − 4s³ y la recta del triple ingenuo y = 3s.
  // Progresa: el punto (sen θ, sen 3θ), que siempre cae sobre la curva verde. · Se reserva: sen θ = 1/3 (la
  // predicción) y los tres cortes de una altura (el final de «Mira»). · Debe verse: que sen 3θ es un cubo, no 3 sen θ.
  const cubica = s => 3 * s - 4 * s ** 3;
  const ejesTriple = (puntos, extra = []) => ({
    x: { min: -1, max: 1, paso: 0.5, nombre: 'sen θ', decimales: 1, color: 'o' },
    y: { min: -1.2, max: 1.2, paso: 0.5, nombre: 'sen 3θ', decimales: 1, color: 'd' },
    curvas: [{ puntos: Array.from({ length: 81 }, (_, i) => { const s = -1 + i / 40; return [s, cubica(s)]; }), color: 'd', rotulo: '3s − 4s³', en: [-0.75, cubica(-0.75)] },
      { puntos: [[-0.3, -0.9], [0.3, 0.9]], color: 'o', discontinua: true, rotulo: '3 sen θ', en: [0.3, 0.9] }, ...extra],
    puntos,
  });
  const triple = {
    id: 'angulo-triple',
    titulo: 'El triple y su cubo',
    temas: ['Ángulo triple'],
    pieza: 'ejes',
    juega: {
      consigna: 'Elige θ. El punto verde tiene abscisa sen θ y altura sen 3θ. Mira sobre qué curva cae; compáralo con la recta 3 sen θ.',
      voz: 'Sigue el punto: ¿se queda en la recta o en la curva?',
      controles: [{ id: 't', etiqueta: 'θ', color: 'c-o', min: 0, max: 90, paso: 10, inicio: 10, unidad: '°', decimales: 0 }],
      dibujo: val => ({ datos: ejesTriple([{ x: sen(val.t), y: sen(3 * val.t), color: 'd', guias: true }]), estado: {} }),
      lectura: val => ['sen ', th, ` = ${f(sen(val.t))}; sen `, tri, ` = ${f(sen(3 * val.t))}; 3 sen `, th, ` = ${f(3 * sen(val.t))}`],
      minimo: 3,
    },
    predice: {
      pregunta: ['Si sen ', th, ' = 1/3, ¿cuánto vale sen ', tri, '?'],
      voz: 'Usa la curva verde, no la recta.',
      opciones: [
        { id: 'c', texto: '23/27', correcta: true },
        { id: 'triple', texto: '1, el triple de 1/3', error: 'TRIPLE-SEN', siFuera: 'Triplicar sería cierto sobre la recta 3 sen θ. El punto cae en la curva, que se dobla.' },
        { id: 'cubo', texto: '5/9, que es 3 · 1/3 − 4 · (1/3)²', error: 'TRIPLE-CUBO', siFuera: 'La forma es la buena, pero el último término lleva el cubo: (1/3)³.' },
        { id: 'signo', texto: '31/27, que es 1 + 4/27', error: 'TRIPLE-SIGNO', siFuera: 'Los términos son los buenos; el del cubo se resta. Con más pasaría de 1.' },
      ],
      dibujo: { datos: ejesTriple([]), estado: {} },
      revelar: { datos: ejesTriple([{ x: 1 / 3, y: 23 / 27, color: 'd', rotulo: '23/27', guias: true }, { x: 1 / 3, y: 1, color: 'o', abierto: true }]), estado: {} },
      coincide: 'Coincide: 3 · 1/3 − 4 · 1/27 = 23/27, sobre la curva.',
    },
    mira: {
      datos: ejesTriple([
        { x: 1 / 3, y: 23 / 27, color: 'd', rotulo: '23/27', guias: true, desde: 3, hasta: 3 },
        { x: sen(10), y: 0.5, color: 'd', desde: 4 }, { x: sen(50), y: 0.5, color: 'd', desde: 4 }, { x: sen(-70), y: 0.5, color: 'd', desde: 4 },
      ], [{ puntos: [[-1, 0.5], [1, 0.5]], color: 'd', discontinua: true, rotulo: '1/2', en: [-0.92, 0.5], desde: 4 }]),
      voz: 'Triple es doble más uno; después todo en senos.',
      pasos: [
        { estado: { corte: 1 }, texto: 'El triple se arma sumando el doble y el simple.', ecuacion: ['sen ', tri, ' = sen ', dos, ' cos ', th, ' + cos ', dos, ' sen ', th] },
        { estado: { corte: 2 }, texto: 'Con cos² θ = 1 − sen² θ, todo queda en senos.', ecuacion: ['= 2 sen ', th, ' (1 − ', { sup: ['sen', '2'] }, th, ') + (1 − 2', { sup: ['sen', '2'] }, th, ') sen ', th, ' = 3 sen ', th, ' − 4', { sup: ['sen', '3'] }, th] },
        { estado: { corte: 3 }, texto: 'Con sen θ = 1/3, el punto cae en la curva a 23/27.', ecuacion: ['3 · ', { frac: ['1', '3'] }, ' − 4 · ', { frac: ['1', '27'] }, ' = ', { frac: ['23', '27'] }] },
        { estado: { corte: 4 }, texto: 'Al revés, una altura de la curva tiene tres candidatos para sen θ.', ecuacion: [`sen 3θ = 1/2 ⇒ sen θ ≈ ${f(sen(10), 3)}; ${f(sen(50), 3)}; ${f(sen(-70), 3)}`] },
      ],
    },
    regla: {
      texto: 'El seno y el coseno del triple son polinomios de grado tres en la razón del ángulo. Triplicar el ángulo no triplica el valor.',
      ecuacion: ['sen ', tri, ' = 3 sen ', th, ' − 4', { sup: ['sen', '3'] }, th, ';   cos ', tri, ' = 4', { sup: ['cos', '3'] }, th, ' − 3 cos ', th],
      condicion: 'θ real; sen³ θ es (sen θ)³. Conocido sen 3θ, hay hasta tres valores de sen θ: el intervalo elige.',
      voz: 'Tres veces el ángulo; un cubo en la fórmula.',
    },
    ahoraTu: {
      voz: 'Escribe la fórmula y cuida el cubo.',
      generar(sem) {
        const rr = azar(sem);
        const v = rr.uno([[1, 2], [-1, 2], [1, 3], [-1, 3], [2, 3], [-2, 3], [1, 4], [-1, 4], [3, 4], [-3, 4], [2, 5], [-3, 5], [1, 5]]);
        const esSen = sem % 2 === 0, [n, d] = v;
        const bien = esSen ? Q(3 * n * d * d - 4 * n * n * n, d * d * d) : Q(4 * n * n * n - 3 * n * d * d, d * d * d);
        const fn = esSen ? 'sen' : 'cos';
        return {
          pregunta: [`Si ${fn} `, th, ` = ${qt(v)}, ¿cuánto vale ${fn} `, tri, '?'],
          opciones: opciones(bien, [
            { id: 'triple', valor: Q(3 * n, d), error: 'TRIPLE-SEN', siFuera: 'Eso triplica el valor. Sería cierto sobre la recta, pero el triple sigue una curva.' },
            { id: 'cubo', valor: esSen ? Q(3 * n * d - 4 * n * n, d * d) : Q(4 * n * n - 3 * n * d, d * d), error: 'TRIPLE-CUBO', siFuera: 'La forma es buena, pero el término de 4 lleva el cubo, no el cuadrado.' },
            { id: 'cruce', valor: esSen ? Q(4 * n * n * n - 3 * n * d * d, d * d * d) : Q(3 * n * d * d - 4 * n * n * n, d * d * d), error: 'TRIPLE-CRUCE', siFuera: esSen ? 'Esa es la forma del coseno triple: 4c³ − 3c. El seno va 3s − 4s³.' : 'Esa es la forma del seno triple: 3s − 4s³. El coseno va 4c³ − 3c.' },
            { id: 'signo', valor: esSen ? Q(3 * n * d * d + 4 * n * n * n, d * d * d) : null, error: 'TRIPLE-SIGNO', siFuera: 'Los términos son los buenos; el del cubo se resta.' },
          ], qt),
          solucion: {
            texto: `Se reemplaza ${fn} θ = ${qt(v)} en el polinomio del triple.`,
            ecuacion: esSen ? [`sen `, tri, ` = 3 · ${qp(v)} − 4 · (${qt(v)})³ = ${qt(bien)}`] : [`cos `, tri, ` = 4 · (${qt(v)})³ − 3 · ${qp(v)} = ${qt(bien)}`],
          },
        };
      },
    },
  };

  return {
    unidad: 'trigonometria.arcos-multiples',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/trig-plano.js', '/nucleo/kit/piezas/ejes.js'],
    historia: {
      texto: 'En el siglo XV, al-Kashi calculaba en Samarcanda con una precisión enorme para la astronomía. Para obtener el seno de un grado partió del seno de tres grados y de la relación del ángulo triple: una ecuación de tercer grado que resolvió por aproximaciones sucesivas. Una identidad le sirvió para producir un número nuevo, no solo para reescribir.',
      pregunta: 'Si conoces sen 3°, ¿cómo encontrarías sen 1°?',
      fuente: { titulo: 'J. J. O’Connor y E. F. Robertson, «Ghiyath al-Din Jamshid al-Kashi», MacTutor, University of St Andrews', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Al-Kashi/' },
    },
    ideas: [doblar, deg2, mitadIdea, triple],
  };
});
