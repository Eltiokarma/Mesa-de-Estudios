/*
 * Teoría de «Ángulos en posición normal» (trigonometria.angulos-en-posicion-normal), 4.º de secundaria.
 * Fuente del contenido: docs/teoria/matriz/trigonometria.json (unidad 6), docs/teoria/fuentes/historia-ecuaciones.pdf
 * (trigonometría, pp. 82–100) y las «Precisiones de Geometría y Trigonometría» del expediente.
 * Forma: contenido/teoria/trigonometria/angulo-trigonometrico.js.
 * Compañera: Mara (coneja), cercana y rigurosa: los signos salen de las coordenadas, no de una tabla.
 * Colores (regla 4): el ángulo θ en naranja (c-o), la abscisa x en turquesa (c-i), la ordenada y en rojo (c-h)
 * y el radio vector r en verde (c-d). Los mismos en controles, figura, lectura y ecuaciones.
 * Errores: TR7 (la razón es una longitud), TR8 (depende del tamaño), TR11 (cruza x e y), TR12 (distancia sin signo)
 * y TR15 (el signo de −θ) de docs/investigacion/trigonometria-ideas-erroneas.md; hipótesis de distractor nuevas:
 * TRPN-INVERSA (usa la recíproca), TRPN-TODO-NEG (en el tercer cuadrante todo es negativo), TRPN-COPIA-SEN (la
 * tangente copia el signo del seno), TRPN-TAN-CERO (tan 90° = 0, el error objetivo de la matriz), TRPN-INFINITO
 * (∞ como valor), TRPN-CERO-INDEF (0 arriba se toma como no definido) y TRIG-NEGATIVO (de la unidad 1).
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: las seis razones de cualquier ángulo salen de un punto P(x, y) de su lado final y de r.
 *   Persona y condiciones: postulante de 4.º, celular de 360 px de gama baja, con o sin conexión, en el aula o en casa.
 *   Resultado observable: da signo y valor de una razón con coordenadas y distingue «vale 0» de «no está definida».
 *   Orden de atención: 1.º el punto P · 2.º sus proyecciones x e y con signo · acción: mover P o el giro · fondo: la cuadrícula.
 *   Estados: juego sin tocar · probando · predicción pendiente · coincide / no coincide · paso de «Mira» · caso nuevo.
 *   Duda que resuelve: ¿por qué tan 90° no es 0, y de dónde sale el signo de cada razón?
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const th = { v: 'c-o', t: 'θ' }, X = { v: 'c-i', t: 'x' }, Y = { v: 'c-h', t: 'y' }, R = { v: 'c-d', t: 'r' };
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const rad = g => g * Math.PI / 180;
  const mod360 = x => ((x % 360) + 360) % 360;
  // Fracción simplificada como texto: (−3, 5) → «−3/5»; (4, 2) → «2».
  function fr(p, q) {
    if (q === 0) return 'no definida';
    if (p === 0) return '0';
    const m = gcd(p, q), sg = (p < 0) !== (q < 0) ? '−' : '', a = Math.abs(p / m), b = Math.abs(q / m);
    return b === 1 ? `${sg}${a}` : `${sg}${a}/${b}`;
  }
  const cuadrante = g => { const m = mod360(g); return m === 0 || m === 90 || m === 180 || m === 270 ? 0 : m < 90 ? 1 : m < 180 ? 2 : m < 270 ? 3 : 4; };
  const ROM = ['sobre un eje', 'I', 'II', 'III', 'IV'];
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
      const txt = fmt(d.valor);
      if (vistos.has(txt)) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }
  // Las seis razones a partir de x, y, r (como pares numerador/denominador).
  const RAZON = {
    sen: (x, y, r) => [y, r], cos: (x, y, r) => [x, r], tan: (x, y) => [y, x],
    cot: (x, y) => [x, y], sec: (x, y, r) => [r, x], csc: (x, y, r) => [r, y],
  };
  const DEF = { sen: [Y, R], cos: [X, R], tan: [Y, X], cot: [X, Y], sec: [R, X], csc: [R, Y] };

  // Figura base: punto P con sus proyecciones x (turquesa) e y (roja), el radio vector r (verde) y el giro θ.
  function punto(x, y, o = {}) {
    const r = Math.hypot(x, y), g = Math.atan2(y, x) * 180 / Math.PI, L = o.L || 6;
    const ang = o.giro === undefined ? (g < 0 ? g + 360 : g) : o.giro;
    return {
      ventana: { x: [-L, L], y: [-L, L] }, numeros: 0,
      circulos: r > 0 ? [{ r, discontinua: true }] : [],
      segmentos: r > 0 ? [
        { de: [0, 0], a: [x, 0], color: 'i', rotulo: o.sinRotulos ? undefined : `x = ${f(x)}`, lado: (x > 0) !== (y > 0) ? 'adentro' : undefined },
        { de: [x, 0], a: [x, y], color: 'h', rotulo: o.sinRotulos ? undefined : `y = ${f(y)}` },
        { de: [0, 0], a: [x, y], color: 'd' },
      ] : [],
      rotulos: r > 0 && !o.sinRotulos ? [rotR(x, y, L, `r = ${o.rTxt || f(r)}`)] : [],
      arcos: r > 0 && ang ? [{ de: 0, a: ang, r: L * 0.14, color: 'o', rotulo: 'θ' }] : [],
      puntos: [{ x, y, rotulo: o.pRot || `P(${f(x)}, ${f(y)})`, lado: y >= 0 ? (x >= 0 ? 'ne' : 'no') : (x >= 0 ? 'se' : 'so') }],
      alt: o.alt || `Punto P de coordenadas ${f(x)} y ${f(y)}, a distancia ${f(r)} del origen, en el lado final de θ`,
    };
  }
  // Rótulo de r junto al radio vector, del lado contrario al pie de la ordenada (no choca con x ni con y).
  function rotR(x, y, L, texto) {
    const r = Math.hypot(x, y), s = x * y > 0 ? 1 : -1, d = 0.09 * L;
    return { x: x / 2 - s * y / r * d, y: y / 2 + s * x / r * d, texto, color: 'd' };
  }
  const rTxt = (x, y) => { const r2 = x * x + y * y, r = Math.round(Math.sqrt(r2)); return r * r === r2 ? f(r) : `√${r2}`; };

  // ---------- Idea 1: las razones salen de P(x, y) y r ----------
  // Cambia: el punto P(x, y) en la cuadrícula. · Permanece: el origen, el lado inicial sobre +x y la escala.
  // Progresa: el radio vector r y los cocientes y/r, x/r. · Se reserva: el mismo lado final con P más lejos (la
  // predicción). · Debe verse: que la razón es un cociente con signo, no una longitud, y que no depende de r.
  const razones = {
    id: 'razones-coordenadas',
    titulo: 'Las razones salen de P',
    temas: ['Razones de un ángulo en posición normal'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Mueve el punto P. El ángulo θ gira desde el eje x positivo hasta el lado por P; r mide de P al origen.',
      voz: 'Conservemos el origen como vértice; P solo elige el lado final.',
      controles: [
        { id: 'x', etiqueta: 'x', color: 'c-i', min: -4, max: 4, paso: 1, inicio: 2, decimales: 0 },
        { id: 'y', etiqueta: 'y', color: 'c-h', min: -4, max: 4, paso: 1, inicio: 3, decimales: 0 },
      ],
      dibujo: val => ({ datos: punto(val.x, val.y, { rTxt: rTxt(val.x, val.y) }), estado: {} }),
      lectura: val => {
        if (!val.x && !val.y) return ['P está en el origen: no hay lado final'];
        const r = Math.hypot(val.x, val.y);
        return [R, ` = ${rTxt(val.x, val.y)} · sen `, th, ` = ${f(val.y / r)} · cos `, th, ` = ${f(val.x / r)}`];
      },
      minimo: 3,
    },
    predice: {
      pregunta: 'Para P(−3, 4), cos θ = −0,6. Ahora P se aleja al doble sobre el mismo lado final: P(−6, 8). ¿Cuánto vale cos θ?',
      voz: 'Piensa qué cambia al alejar P y qué se queda igual.',
      opciones: [
        { id: 'c', texto: '−0,6, igual que antes', correcta: true },
        { id: 'doble', texto: '−1,2, el doble', error: 'TR8', siFuera: 'Sí se duplican x y r. Pero se dividen: −6/10 = −3/5, como antes.' },
        { id: 'longitud', texto: '−6, la abscisa de P', error: 'TR7', siFuera: 'La abscisa es −6, bien leída. El coseno la divide entre r = 10.' },
        { id: 'sin-signo', texto: '0,6', error: 'TR12', siFuera: 'El tamaño 0,6 es el correcto. Pero x es negativa: el coseno lleva su signo.' },
      ],
      dibujo: { datos: punto(-3, 4, { L: 11 }), estado: {} },
      revelar: { datos: Object.assign(punto(-6, 8, { L: 11, sinRotulos: true }), { puntos: [{ x: -3, y: 4, rotulo: 'P(−3, 4)', lado: 'o' }, { x: -6, y: 8, rotulo: 'P(−6, 8)', lado: 'no' }], rotulos: [{ x: 5.5, y: -8, texto: `cos θ = −6/10 = ${f(-0.6)}`, color: 'i' }] }), estado: {} },
      coincide: 'Coincide: x y r crecen juntos, y su cociente no cambia.',
      noCoincide: 'Revisemos: los dos puntos están en el mismo lado final.',
    },
    mira: {
      datos: {
        ventana: { x: [-6, 6], y: [-6, 6] },
        circulos: [{ r: 5, discontinua: true, desde: 3 }],
        segmentos: [
          { de: [0, 0], a: [-3, 0], color: 'i', rotulo: 'x = −3', lado: 'adentro', desde: 2 },
          { de: [-3, 0], a: [-3, 4], color: 'h', rotulo: 'y = 4', desde: 2 },
          { de: [0, 0], a: [-3, 4], color: 'd', desde: 3 },
        ],
        arcos: [{ de: 0, a: Math.atan2(4, -3) * 180 / Math.PI, r: 0.85, color: 'o', rotulo: 'θ', desde: 1 }],
        puntos: [{ x: -3, y: 4, rotulo: 'P(−3, 4)', lado: 'no', desde: 1 }],
        rotulos: [Object.assign(rotR(-3, 4, 6, 'r = 5'), { desde: 3 }), { x: 3.2, y: -3.2, texto: 'sen θ = 4/5', color: 'h', desde: 4 }, { x: 3.2, y: -4.4, texto: 'cos θ = −3/5', color: 'i', desde: 4 }, { x: 3.2, y: -5.6, texto: 'tan θ = −4/3', color: 'o', desde: 5 }],
        alt: 'Ángulo en posición normal con P(−3, 4): x = −3, y = 4, r = 5; seno 4/5, coseno −3/5 y tangente −4/3',
      },
      voz: 'Primero las coordenadas; después, los cocientes.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Vértice en el origen, lado inicial sobre +x y P en el lado final.', ecuacion: ['P(−3, 4)'] },
        { estado: { corte: 2 }, texto: 'Las coordenadas de P llevan signo: x es negativa, y positiva.', ecuacion: [X, ' = −3;  ', Y, ' = 4'] },
        { estado: { corte: 3 }, texto: 'El radio vector es una distancia: siempre positivo.', ecuacion: [R, ' = ', { raiz: ['(−3)² + 4²'] }, ' = 5'] },
        { estado: { corte: 4 }, texto: 'Seno y coseno dividen cada coordenada entre r.', ecuacion: ['sen ', th, ' = ', { frac: [Y, R] }, ' = ', { frac: ['4', '5'] }, ';  cos ', th, ' = ', { frac: [X, R] }, ' = −', { frac: ['3', '5'] }] },
        { estado: { corte: 5 }, texto: 'La tangente divide y entre x.', ecuacion: ['tan ', th, ' = ', { frac: [Y, X] }, ' = −', { frac: ['4', '3'] }] },
      ],
    },
    regla: {
      texto: 'Con P(x, y) en el lado final y r su distancia al origen, cada razón es un cociente de dos de esos números. Las otras tres son las recíprocas.',
      ecuacion: ['sen ', th, ' = ', { frac: [Y, R] }, ';  cos ', th, ' = ', { frac: [X, R] }, ';  tan ', th, ' = ', { frac: [Y, X] }, ';  ', R, ' = ', { raiz: [{ sup: [X, '2'] }, ' + ', { sup: [Y, '2'] }] }],
      condicion: 'P distinto del origen y r > 0. cot = x/y, sec = r/x y csc = r/y. Ningún denominador puede valer 0.',
      voz: 'El signo viaja con x e y; r nunca es negativo.',
    },
    ahoraTu: {
      voz: 'Ubica P, calcula r y elige qué coordenada va arriba.',
      generar(sem) {
        const rr = azar(sem), [a, b, c] = rr.uno([[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [7, 24, 25]]);
        const swap = rr.ent(0, 1), sx = rr.uno([1, -1]), sy = sem % 3 ? -sx : sx;
        const x = sx * (swap ? b : a), y = sy * (swap ? a : b), r = c;
        const fn = ['sen', 'cos', 'tan', 'sec', 'csc', 'cot'][sem % 6];
        const [p, q] = RAZON[fn](x, y, r);
        const otra = { sen: 'cos', cos: 'sen', tan: 'cot', cot: 'tan', sec: 'csc', csc: 'sec' }[fn];
        const [p2, q2] = RAZON[otra](x, y, r);
        const [num, den] = DEF[fn];
        return {
          pregunta: [`El lado final de `, th, ` pasa por P(${f(x)}, ${f(y)}). ¿Cuánto vale ${fn} `, th, '?'],
          opciones: opciones(fr(p, q), [
            { id: 'sin-signo', valor: fr(Math.abs(p), Math.abs(q)), error: 'TR12', siFuera: 'El tamaño del cociente está bien. Falta el signo: sale de las coordenadas de P.' },
            { id: 'inversa', valor: fr(q, p), error: 'TRPN-INVERSA', siFuera: `Esa es su recíproca, ${{ sen: 'csc', cos: 'sec', tan: 'cot', cot: 'tan', sec: 'cos', csc: 'sen' }[fn]}. Aquí va ${num.t} sobre ${den.t}.` },
            { id: 'cruza', valor: fr(p2, q2), error: 'TR11', siFuera: `Ese cociente es ${otra}: cambia x por y. Aquí ${fn} ${'θ'} usa ${num.t} sobre ${den.t}.` },
          ], v => v),
          solucion: {
            texto: `r = ${f(r)}; se divide ${num.t} entre ${den.t} con sus signos.`,
            ecuacion: [`${fn} `, th, ' = ', { frac: [num, den] }, ` = ${fr(p, q)}`],
            dibujo: { datos: punto(x, y, { L: c > 14 ? 26 : c > 10 ? 14 : 11, numeros: c > 14 ? 10 : 5 }), estado: {} },
          },
        };
      },
    },
  };

  // ---------- Idea 2: los signos salen de x e y ----------
  // Cambia: el giro θ, de 0° a 360° en pasos de 30°. · Permanece: la circunferencia de radio 1 y los cuatro cuadrantes.
  // Progresa: el signo de x y de y al cruzar cada eje. · Se reserva: el signo de tan θ en el tercer cuadrante (la
  // predicción; la lectura muestra solo seno y coseno). · Debe verse: que cada signo sale de una coordenada.
  const unidad1 = (g, extra = {}) => {
    const x = Math.cos(rad(g)), y = Math.sin(rad(g));
    return Object.assign({
      circulos: [{ r: 1 }],
      segmentos: [
        { de: [0, 0], a: [x, 0], color: 'i', rotulo: Math.abs(x) > 0.2 && Math.abs(y) > 0.2 ? (x > 0 ? 'x +' : 'x −') : undefined },
        { de: [x, 0], a: [x, y], color: 'h', rotulo: Math.abs(y) > 0.2 && Math.abs(x) > 0.2 ? (y > 0 ? 'y +' : 'y −') : undefined },
      ],
      rayos: [{ ang: 0, largo: 1, grosor: 'contorno' }, { ang: g, color: 'd' }],
      arcos: g ? [{ de: 0, a: g, r: 0.25, color: 'o', rotulo: `${f(g)}°` }] : [],
      puntos: [{ x, y }],
      rotulos: [{ x: 0.95, y: 0.95, texto: 'I' }, { x: -0.95, y: 0.95, texto: 'II' }, { x: -0.95, y: -0.95, texto: 'III' }, { x: 0.95, y: -0.95, texto: 'IV' }],
      alt: `Ángulo de ${f(g)} grados en la circunferencia de radio 1: x ${x > 1e-9 ? 'positiva' : x < -1e-9 ? 'negativa' : 'cero'}, y ${y > 1e-9 ? 'positiva' : y < -1e-9 ? 'negativa' : 'cero'}`,
    }, extra);
  };
  const sg = v => (Math.abs(v) < 1e-9 ? '= 0' : v > 0 ? '> 0' : '< 0');
  const SIGNOS = { 1: [1, 1], 2: [-1, 1], 3: [-1, -1], 4: [1, -1] };   // [signo de x, signo de y]
  const signoDe = (fn, q) => { const [sx, sy] = SIGNOS[q]; return { sen: sy, csc: sy, cos: sx, sec: sx, tan: sx * sy, cot: sx * sy }[fn]; };
  const signos = {
    id: 'signos-cuadrante',
    titulo: 'El signo sale de x, y',
    temas: ['Signos por cuadrante'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Gira el lado final por los cuatro cuadrantes. Mira el signo de x y de y, y qué hacen seno y coseno.',
      voz: 'Antes de cruzar un eje, anticipa qué coordenada cambia de signo.',
      controles: [{ id: 'g', etiqueta: 'θ', color: 'c-o', min: 0, max: 360, paso: 30, inicio: 30, unidad: '°', decimales: 0 }],
      dibujo: val => ({ datos: unidad1(val.g), estado: {} }),
      lectura: val => {
        const q = cuadrante(val.g);
        return [th, ` = ${f(val.g)}° · ${q ? 'cuadrante ' + ROM[q] : ROM[0]} · sen `, th, ` ${sg(Math.sin(rad(val.g)))} · cos `, th, ` ${sg(Math.cos(rad(val.g)))}`];
      },
      minimo: 4,
    },
    predice: {
      pregunta: 'Para θ = 225°, en el tercer cuadrante, seno y coseno son negativos. ¿Qué signo tiene tan θ = y/x?',
      voz: 'Escribe primero el signo de y y el de x.',
      opciones: [
        { id: 'c', texto: 'Positivo', correcta: true },
        { id: 'todo-neg', texto: 'Negativo: en el tercer cuadrante todo es negativo', error: 'TRPN-TODO-NEG', siFuera: 'x e y sí son negativas. Pero un negativo entre un negativo da positivo.' },
        { id: 'copia', texto: 'Negativo, como el seno', error: 'TRPN-COPIA-SEN', siFuera: 'El seno sí copia el signo de y. La tangente divide y entre x: −/− es +.' },
        { id: 'cero', texto: 'Cero: los signos se anulan', error: 'TR12', siFuera: 'Los signos se combinan, pero no dan cero: tan 225° = 1.' },
      ],
      dibujo: { datos: unidad1(225, { segmentos: [], puntos: [] }), estado: {} },
      revelar: { datos: unidad1(225, { rotulos: [{ x: -0.95, y: -0.95, texto: 'III' }, { x: 0.55, y: 0.45, texto: 'tan = (−)/(−) > 0', color: 'o' }] }), estado: {} },
      coincide: 'Coincide: dos signos negativos en un cociente dan positivo.',
      noCoincide: 'Revisemos los dos signos: los dos tramos apuntan al lado negativo.',
    },
    mira: {
      datos: {
        circulos: [{ r: 1 }],
        segmentos: [
          { de: [0, 0], a: [0.71, 0], color: 'i', desde: 1, hasta: 1 }, { de: [0.71, 0], a: [0.71, 0.71], color: 'h', desde: 1, hasta: 1 },
          { de: [0, 0], a: [-0.71, 0], color: 'i', desde: 2, hasta: 2 }, { de: [-0.71, 0], a: [-0.71, 0.71], color: 'h', desde: 2, hasta: 2 },
          { de: [0, 0], a: [-0.71, 0], color: 'i', desde: 3, hasta: 3 }, { de: [-0.71, 0], a: [-0.71, -0.71], color: 'h', desde: 3, hasta: 3 },
          { de: [0, 0], a: [0.71, 0], color: 'i', desde: 4, hasta: 4 }, { de: [0.71, 0], a: [0.71, -0.71], color: 'h', desde: 4, hasta: 4 },
        ],
        puntos: [{ x: 0.71, y: 0.71, desde: 1 }, { x: -0.71, y: 0.71, desde: 2 }, { x: -0.71, y: -0.71, desde: 3 }, { x: 0.71, y: -0.71, desde: 4 }],
        rotulos: [
          { x: 0.8, y: 1.12, texto: 'I: todas +', desde: 1 }, { x: -0.8, y: 1.12, texto: 'II: sen, csc +', desde: 2 },
          { x: -0.8, y: -1.18, texto: 'III: tan, cot +', desde: 3 }, { x: 0.8, y: -1.18, texto: 'IV: cos, sec +', desde: 4 },
        ],
        alt: 'Los cuatro cuadrantes con un punto en cada uno y las razones positivas: I todas, II seno, III tangente, IV coseno',
      },
      voz: 'Un cuadrante a la vez; los signos de x e y deciden.',
      pasos: [
        { estado: { corte: 1 }, texto: 'En el I, x e y son positivas: las seis razones son positivas.', ecuacion: [X, ' > 0;  ', Y, ' > 0'] },
        { estado: { corte: 2 }, texto: 'En el II, x es negativa: solo seno y cosecante quedan positivas.', ecuacion: [X, ' < 0;  ', Y, ' > 0'] },
        { estado: { corte: 3 }, texto: 'En el III, las dos son negativas: y/x y x/y son positivas.', ecuacion: [{ frac: [Y, X] }, ' = ', { frac: ['−', '−'] }, ' > 0'] },
        { estado: { corte: 4 }, texto: 'En el IV, y es negativa: solo coseno y secante quedan positivas.', ecuacion: [X, ' > 0;  ', Y, ' < 0'] },
      ],
    },
    regla: {
      texto: 'Como r siempre es positivo, el seno tiene el signo de y y el coseno el de x. La tangente es positiva cuando x e y tienen el mismo signo.',
      ecuacion: ['signo de sen ', th, ' = signo de ', Y, ';  signo de cos ', th, ' = signo de ', X],
      condicion: 'θ en posición normal y P fuera de los ejes. Cada recíproca tiene el mismo signo que su razón.',
      voz: 'La tabla de signos se reconstruye con x e y.',
    },
    ahoraTu: {
      voz: 'Ubica el cuadrante; después, el signo de x y el de y.',
      generar(sem) {
        const rr = azar(sem);
        let g = 10 * rr.ent(1, 35); while (g % 90 === 0) g += 10;
        const q = cuadrante(g);
        const par = [['sen', 'cos'], ['tan', 'cos'], ['sen', 'tan'], ['csc', 'sec'], ['cot', 'sen']][sem % 5];
        const sgTxt = s => (s > 0 ? '+' : '−');
        const combo = qq => `${par[0]} ${sgTxt(signoDe(par[0], qq))}, ${par[1]} ${sgTxt(signoDe(par[1], qq))}`;
        const otros = [1, 2, 3, 4].filter(qq => qq !== q);
        const [sx, sy] = SIGNOS[q];
        return {
          pregunta: ['El ángulo ', th, ` = ${f(g)}° está en posición normal. ¿Qué signos tienen ${par[0]} `, th, ` y ${par[1]} `, th, '?'],
          opciones: opciones(combo(q), otros.map(qq => ({
            id: `q${qq}`, valor: combo(qq), error: qq === 1 ? 'TR12' : SIGNOS[qq][0] === sy && SIGNOS[qq][1] === sx ? 'TR11' : 'TRPN-TODO-NEG',
            siFuera: `Esos signos valen en el cuadrante ${ROM[qq]}. ${f(g)}° está en el ${ROM[q]}: x ${sgTxt(sx)}, y ${sgTxt(sy)}.`,
          })), v => v),
          solucion: {
            texto: `${f(g)}° está en el cuadrante ${ROM[q]}, donde x ${sgTxt(sx)} e y ${sgTxt(sy)}.`,
            ecuacion: [X, ` ${sx > 0 ? '> 0' : '< 0'};  `, Y, ` ${sy > 0 ? '> 0' : '< 0'}`],
            dibujo: { datos: unidad1(g), estado: {} },
          },
        };
      },
    },
  };

  // ---------- Idea 3: en los ejes, cero no es «no definida» ----------
  // Cambia: el giro θ, de −360° a 450° en pasos de 90°. · Permanece: la circunferencia de radio 1 y los ejes.
  // Progresa: cuál coordenada vale 0. · Se reserva: tan 90° (la predicción; la lectura no da la tangente).
  // Debe verse: que dividir entre 0 no da un número y que 0 en el numerador sí da 0.
  const cuad = (g, extra = {}) => {
    const x = Math.round(Math.cos(rad(g))), y = Math.round(Math.sin(rad(g)));
    return Object.assign({
      circulos: [{ r: 1 }],
      rayos: [{ ang: 0, largo: 1, grosor: 'contorno' }, { ang: g, color: 'd' }],
      arcos: g ? [{ de: 0, a: g, r: 0.25, color: 'o', rotulo: `${f(g)}°` }] : [],
      puntos: [{ x, y, rotulo: `(${f(x)}, ${f(y)})`, lado: x ? (x > 0 ? 'se' : 'so') : (y > 0 ? 'ne' : 'se') }],
      alt: `Ángulo cuadrantal de ${f(g)} grados: el punto de la circunferencia es (${f(x)}, ${f(y)})`,
    }, extra);
  };
  const VAL = { '1': '1', '-1': '−1', '0': '0' };
  const valor = (fn, g) => {
    const x = Math.round(Math.cos(rad(g))), y = Math.round(Math.sin(rad(g)));
    const [p, q] = RAZON[fn](x, y, 1);
    return q === 0 ? 'no está definida' : VAL[String(p / q)];
  };
  const cuadrantales = {
    id: 'cuadrantales',
    titulo: 'Cero no es «no definida»',
    temas: ['Ángulos cuadrantales'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Gira el lado final de 90° en 90°. Sobre un eje, una de las coordenadas del punto vale 0. Mira cuál.',
      voz: 'Fíjate qué coordenada se vuelve cero en cada eje.',
      controles: [{ id: 'g', etiqueta: 'θ', color: 'c-o', min: -360, max: 450, paso: 90, inicio: 0, unidad: '°', decimales: 0 }],
      dibujo: val => ({ datos: cuad(val.g), estado: {} }),
      lectura: val => [th, ` = ${f(val.g)}° · sen `, th, ` = ${valor('sen', val.g)} · cos `, th, ` = ${valor('cos', val.g)}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Para θ = 90°, el punto es (0, 1). ¿Cuánto vale tan θ = y/x?',
      voz: 'Escribe el cociente antes de decidir.',
      opciones: [
        { id: 'c', texto: 'No está definida', correcta: true },
        { id: 'cero', texto: '0', error: 'TRPN-TAN-CERO', siFuera: 'El 0 sí aparece, pero abajo: 1/0 no es 0. Cero sería si el 0 estuviera arriba.' },
        { id: 'uno', texto: '1', error: 'TR11', siFuera: 'y vale 1, bien leído. Pero la tangente lo divide entre x = 0.' },
        { id: 'infinito', texto: 'Infinito', error: 'TRPN-INFINITO', siFuera: 'Cerca de 90° la tangente crece sin tope. Pero en 90° no hay número: es 1/0.' },
      ],
      dibujo: { datos: cuad(90), estado: {} },
      revelar: { datos: cuad(90, { rotulos: [{ x: -0.55, y: 0.45, texto: 'tan 90° = 1/0', color: 'o' }, { x: -0.55, y: 0.27, texto: 'no existe', color: 'o' }] }), estado: {} },
      coincide: 'Coincide: entre 0 no se puede dividir.',
      noCoincide: 'Revisemos dónde está el 0 en el cociente y/x.',
    },
    mira: {
      datos: cuad(90, {
        segmentos: [{ de: [0, 0], a: [0, 1], color: 'h', rotulo: 'y = 1', desde: 1 }],
        rotulos: [{ x: 0.45, y: -0.3, texto: 'x = 0', color: 'i', desde: 1 }, { x: -0.62, y: 0.55, texto: 'tan: 1/0', color: 'o', desde: 2 }, { x: -0.62, y: 0.35, texto: 'cot: 0/1 = 0', color: 'o', desde: 3 }, { x: -0.5, y: -0.3, texto: 'sec: 1/0', color: 'o', desde: 4 }, { x: -0.5, y: -0.5, texto: 'csc: 1/1', color: 'o', desde: 4 }],
      }),
      voz: 'Mira dónde queda el cero en cada cociente.',
      pasos: [
        { estado: { corte: 1 }, texto: 'En 90° el punto está sobre el eje y: x vale 0.', ecuacion: ['(', X, ', ', Y, ') = (0, 1)'] },
        { estado: { corte: 2 }, texto: 'La tangente pide dividir entre x = 0: no está definida.', ecuacion: ['tan 90° = ', { frac: ['1', '0'] }, ' → no está definida'] },
        { estado: { corte: 3 }, texto: 'La cotangente tiene el 0 arriba: vale 0.', ecuacion: ['cot 90° = ', { frac: ['0', '1'] }, ' = 0'] },
        { estado: { corte: 4 }, texto: 'La secante tampoco existe; la cosecante vale 1.', ecuacion: ['sec 90° = ', { frac: ['1', '0'] }, ';  csc 90° = ', { frac: ['1', '1'] }, ' = 1'] },
      ],
    },
    regla: {
      texto: 'En un ángulo cuadrantal una coordenada vale 0. La razón que la tiene arriba vale 0; la que la tiene abajo no está definida.',
      ecuacion: [{ frac: ['0', 'a'] }, ' = 0;   ', { frac: ['a', '0'] }, ' no está definido'],
      condicion: 'a ≠ 0. tan y sec no existen cuando x = 0 (90°, 270°); cot y csc, cuando y = 0 (0°, 180°).',
      voz: 'Cero es un valor; «no definida» es que no hay valor.',
    },
    ahoraTu: {
      voz: 'Escribe el punto del eje; después, el cociente.',
      generar(sem) {
        const rr = azar(sem), g = 90 * rr.ent(-4, 8), fn = ['tan', 'cot', 'sec', 'csc', 'sen', 'cos'][sem % 6];
        const x = Math.round(Math.cos(rad(g))), y = Math.round(Math.sin(rad(g)));
        const bien = valor(fn, g), [p, q] = RAZON[fn](x, y, 1);
        const todos = ['0', '1', '−1', 'no está definida'];
        const siF = v => {
          if (v === 'no está definida') return { e: 'TRPN-CERO-INDEF', s: `Sería cierto con 0 abajo. Aquí ${fn} = ${f(p)}/${f(q)}.` };
          if (bien === 'no está definida') return v === '0' ? { e: 'TRPN-TAN-CERO', s: `El 0 está, pero abajo: ${f(p)}/0 no da un número.` } : { e: 'TRPN-INFINITO', s: `Ese sería el valor sin el 0 abajo. Aquí ${fn} = ${f(p)}/0.` };
          if (v === '0') return { e: 'TR11', s: `Sería cierto con 0 arriba. Aquí ${fn} = ${f(p)}/${f(q)}.` };
          if (bien === '0') return { e: 'TR11', s: `Ese es el valor de la otra coordenada. Aquí ${fn} = 0/${f(q)}.` };
          return { e: 'TR12', s: `El tamaño 1 está bien; el signo sale de la coordenada: (${f(x)}, ${f(y)}).` };
        };
        return {
          pregunta: ['Para ', th, ` = ${f(g)}°, ¿cuánto vale ${fn} `, th, '?'],
          opciones: opciones(bien, todos.filter(v => v !== bien).map((v, i) => ({ id: `d${i}`, valor: v, error: siF(v).e, siFuera: siF(v).s })), v => v),
          solucion: {
            texto: `El punto es (${f(x)}, ${f(y)}); ${fn} pide ${f(p)} entre ${f(q)}.`,
            ecuacion: [`${fn} ${f(g)}° = `, { frac: [f(p), f(q)] }, q === 0 ? ' → no está definida' : ` = ${bien}`],
            dibujo: { datos: cuad(g), estado: {} },
          },
        };
      },
    },
  };

  // ---------- Idea 4: vueltas que no cambian nada y el giro negativo como reflejo ----------
  // Cambia: el giro θ y el número de vueltas n. · Permanece: el punto P del lado final cuando solo cambia n.
  // Progresa: el arco que se enrosca. · Se reserva: el giro negativo −30° (la predicción; el control va de 45° en 45°).
  // Debe verse: que −θ es el reflejo de θ en el eje x: y cambia de signo y x no.
  const EXACTO = { 30: ['1/2', '√3/2'], 45: ['√2/2', '√2/2'], 60: ['√3/2', '1/2'] };
  const vueltas = (g, extra = {}) => {
    const x = Math.cos(rad(g)), y = Math.sin(rad(g));
    return Object.assign({
      circulos: [{ r: 1 }],
      segmentos: [{ de: [0, 0], a: [x, 0], color: 'i' }, { de: [x, 0], a: [x, y], color: 'h' }],
      rayos: [{ ang: 0, largo: 1, grosor: 'contorno' }, { ang: g, color: 'd' }],
      arcos: g ? [{ de: 0, a: g, r: 0.22, espiral: 9, color: 'o', rotulo: `${f(g)}°` }] : [],
      puntos: [{ x, y, rotulo: 'P' }],
      alt: `Giro de ${f(g)} grados; su lado final es el mismo que el de ${f(mod360(g))} grados`,
    }, extra);
  };
  const reflejo = {
    ventana: { x: [-1.3, 1.3], y: [-1.3, 1.3] },
    circulos: [{ r: 1 }],
    rayos: [{ ang: 0, largo: 1, grosor: 'contorno' }, { ang: 30, color: 'd' }, { ang: -30, color: 'd', discontinua: true }],
    segmentos: [{ de: [0, 0], a: [0.866, 0], color: 'i' }, { de: [0.866, 0], a: [0.866, 0.5], color: 'h', rotulo: '+1/2' }, { de: [0.866, 0], a: [0.866, -0.5], color: 'h', rotulo: '−1/2' }],
    arcos: [{ de: 0, a: 30, r: 0.3, color: 'o', rotulo: '30°' }, { de: 0, a: -30, r: 0.3, color: 'o', rotulo: '−30°' }],
    puntos: [{ x: 0.866, y: 0.5, rotulo: 'P', lado: 'ne' }, { x: 0.866, y: -0.5, rotulo: 'P′', lado: 'se' }],
    alt: 'Los giros de 30 y menos 30 grados: sus puntos son reflejos en el eje x, con la misma x e y de signo contrario',
  };
  const coterminales = {
    id: 'coterminales-negativos',
    titulo: 'Vueltas iguales, giros reflejados',
    temas: ['Ángulos coterminales', 'Ángulos negativos'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Elige un giro θ y súmale n vueltas completas. Mira si el punto P y sus razones cambian.',
      voz: 'Conservemos el lado final; cuenta solo las vueltas.',
      controles: [
        { id: 'g', etiqueta: 'θ', color: 'c-o', min: 0, max: 315, paso: 45, inicio: 45, unidad: '°', decimales: 0 },
        { id: 'n', etiqueta: 'n', min: -2, max: 2, paso: 1, inicio: 0, unidad: ' vueltas', decimales: 0 },
      ],
      dibujo: val => ({ datos: vueltas(val.g + 360 * val.n), estado: {} }),
      lectura: val => [th, ` + 360°·n = ${f(val.g + 360 * val.n)}° · sen = ${f(Math.sin(rad(val.g)))} · cos = ${f(Math.cos(rad(val.g)))}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Sabemos que sen 30° = 1/2. ¿Cuánto vale sen(−30°)?',
      voz: 'Piensa en el sentido del giro y en dónde termina P.',
      opciones: [
        { id: 'c', texto: '−1/2', correcta: true },
        { id: 'igual', texto: '1/2, el signo del ángulo no cuenta', error: 'TR15', siFuera: 'El tamaño 1/2 es correcto. Pero −30° termina debajo del eje x: y es negativa.' },
        { id: 'cruza', texto: '−√3/2', error: 'TR11', siFuera: '√3/2 es la x de ese punto, no su y. El seno usa y.' },
        { id: 'no-existe', texto: 'No existe: el ángulo es negativo', error: 'TRIG-NEGATIVO', siFuera: 'Un ángulo negativo sí existe: es un giro horario, con su punto P.' },
      ],
      dibujo: { datos: { circulos: [{ r: 1 }], rayos: [{ ang: 0, largo: 1, grosor: 'contorno' }, { ang: 30, color: 'd' }], arcos: [{ de: 0, a: 30, r: 0.3, color: 'o', rotulo: '30°' }], segmentos: [{ de: [0.866, 0], a: [0.866, 0.5], color: 'h', rotulo: '1/2' }], puntos: [{ x: 0.866, y: 0.5, rotulo: 'P' }], alt: 'Giro de 30 grados: el punto P tiene y igual a un medio' }, estado: {} },
      revelar: { datos: reflejo, estado: {} },
      coincide: 'Coincide: −30° es el reflejo de 30° en el eje x.',
      noCoincide: 'Revisemos: el giro horario deja a P debajo del eje x.',
    },
    mira: {
      datos: {
        circulos: [{ r: 1 }],
        rayos: [{ ang: 0, largo: 1, grosor: 'contorno' }, { ang: 30, color: 'd', desde: 1 }, { ang: -30, color: 'd', discontinua: true, desde: 2 }],
        segmentos: [{ de: [0, 0], a: [0.866, 0], color: 'i', desde: 4 }, { de: [0.866, 0], a: [0.866, 0.5], color: 'h', rotulo: '+1/2', desde: 3 }, { de: [0.866, 0], a: [0.866, -0.5], color: 'h', rotulo: '−1/2', desde: 3 }],
        arcos: [{ de: 0, a: 30, r: 0.3, color: 'o', rotulo: '30°', desde: 1 }, { de: 0, a: -30, r: 0.3, color: 'o', rotulo: '−30°', desde: 2, hasta: 3 }, { de: 0, a: 330, r: 0.5, espiral: 0, color: 'o', rotulo: '330°', desde: 5 }],
        puntos: [{ x: 0.866, y: 0.5, rotulo: 'P', desde: 1 }, { x: 0.866, y: -0.5, rotulo: 'P′', lado: 'se', desde: 2 }],
        rotulos: [{ x: 0.45, y: -0.12, texto: 'x igual', color: 'i', desde: 4, hasta: 4 }],
        alt: 'Giros de 30, menos 30 y 330 grados: menos 30 y 330 terminan en el mismo punto, reflejo del de 30',
      },
      voz: 'Compara los dos puntos: uno es el espejo del otro.',
      pasos: [
        { estado: { corte: 1 }, texto: 'El giro de 30° deja a P arriba del eje x.', ecuacion: ['sen 30° = ', { frac: ['1', '2'] }] },
        { estado: { corte: 2 }, texto: 'El giro de −30° va en sentido horario, el mismo tamaño.', ecuacion: [th, ' = −30°'] },
        { estado: { corte: 3 }, texto: 'Su punto P′ es el reflejo de P: y cambia de signo.', ecuacion: ['sen(−30°) = −', { frac: ['1', '2'] }] },
        { estado: { corte: 4 }, texto: 'La abscisa no cambia: el coseno se conserva.', ecuacion: ['cos(−30°) = cos 30° = ', { frac: [{ raiz: ['3'] }, '2'] }] },
        { estado: { corte: 5 }, texto: 'Una vuelta más lleva −30° a 330°: el mismo lado final.', ecuacion: ['−30° + 360° = 330°'] },
      ],
    },
    regla: {
      texto: 'Los coterminales comparten lado final y razones. Un giro negativo refleja P en el eje x: el seno cambia de signo y el coseno no.',
      ecuacion: ['sen(', th, ' + 360°·n) = sen ', th, ';  sen(−', th, ') = −sen ', th, ';  cos(−', th, ') = cos ', th],
      condicion: 'n es un entero y los ángulos se miden desde el mismo lado inicial. También tan(−θ) = −tan θ, donde exista.',
      voz: 'Las vueltas no cambian el punto; el sentido lo refleja.',
    },
    ahoraTu: {
      voz: 'Quita las vueltas; después, mira el signo del giro.',
      generar(sem) {
        const rr = azar(sem), base = rr.uno([30, 45, 60]), neg = sem % 2 === 1, k = neg ? rr.ent(0, 3) : rr.ent(1, 3);
        const g = (neg ? -1 : 1) * (base + 360 * k), fn = sem % 4 < 2 ? 'sen' : 'cos';
        const [sv, cv] = EXACTO[base];
        const mag = fn === 'sen' ? sv : cv, otro = fn === 'sen' ? cv : sv;
        const signo = neg && fn === 'sen' ? '−' : '';
        const contra = signo ? '' : '−';
        return {
          pregunta: [`¿Cuánto vale ${fn}(${f(g)}°)?`],
          opciones: opciones(signo + mag, [
            { id: 'signo', valor: contra + mag, error: 'TR15', siFuera: fn === 'sen' ? 'El tamaño está bien. El signo sale de y: un giro horario la refleja.' : 'El tamaño está bien. El coseno no cambia de signo al reflejar: x se conserva.' },
            { id: 'cruza', valor: signo + otro, error: 'TR11', siFuera: `Ese es el valor de ${fn === 'sen' ? 'cos' : 'sen'} ${base}°: cambia x por y.` },
            { id: 'cruza-signo', valor: contra + otro, error: 'TR11', siFuera: `Ese tamaño es de ${fn === 'sen' ? 'cos' : 'sen'} ${base}°, la otra coordenada.` },
          ], v => v),
          solucion: {
            texto: `Se quitan ${f(k)} vuelta${k === 1 ? '' : 's'}${neg ? '; el giro negativo refleja P en el eje x' : ''}.`,
            ecuacion: [`${fn}(${f(g)}°) = ${fn}(${neg ? '−' : ''}${base}°) = ${signo}${mag}`],
            dibujo: { datos: vueltas(g), estado: {} },
          },
        };
      },
    },
  };

  return {
    unidad: 'trigonometria.angulos-en-posicion-normal',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/trig-plano.js'],
    historia: {
      texto: 'Las primeras tablas de cuerdas y senos servían a la astronomía y miraban ángulos de triángulos. Tradiciones griegas, indias y de lengua árabe las fueron transformando hasta hablar de funciones. Al salir del triángulo, el ángulo puede girar más de una vuelta o hacia atrás, y entonces importan los signos. La posición normal es una organización moderna: pone el giro sobre coordenadas.',
      pregunta: '¿Qué gana un ángulo cuando deja de vivir dentro de un triángulo?',
      fuente: { titulo: 'J. J. O’Connor y E. F. Robertson, «Trigonometric functions», MacTutor, University of St Andrews', url: 'https://mathshistory.st-andrews.ac.uk/HistTopics/Trigonometric_functions/' },
    },
    ideas: [razones, signos, cuadrantales, coterminales],
  };
});
