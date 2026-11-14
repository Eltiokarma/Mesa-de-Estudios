/*
 * Teoría de «Ecuaciones trigonométricas» (trigonometria.ecuaciones-trigonometricas), 5.º de secundaria.
 * Fuente del contenido: docs/teoria/matriz/trigonometria.json (unidad 15), el microguion «Trigonometría 15: una
 * ecuación necesita todas sus soluciones y su dominio» y las «Precisiones de Geometría y Trigonometría» de
 * docs/teoria/fuentes/teoria-152-unidades.txt (sen θ = ±1 tiene una solución por vuelta; |k| > 1, ninguna).
 * Forma: contenido/teoria/trigonometria/angulo-trigonometrico.js.
 * Compañera: Mara (coneja), cercana y rigurosa: la calculadora da un valor principal; el conjunto se revisa entero.
 * Colores (regla 4): el ángulo θ en naranja (c-o; el valor principal α también es un ángulo: naranja discontinuo),
 * el valor k de la primera ecuación (la recta y = k) en turquesa (c-i), el valor c de la segunda condición (la
 * recta x = c, el segundo factor o la segunda ecuación) en verde (c-d) y las vueltas n en rojo (c-h).
 * Ronda 2 (14 nov, noche): manijas en las cinco ideas (la recta y = k por su extremo, el borde b de la franja, la
 * recta x = c por su cruce con el eje x, y las dos rectas del sistema); la vuelta n de la idea 2 queda con − y +.
 * Llaves en las cinco reglas, separadores «   ·   » y laboratorio de tres mesas. Cada idea usa en «Mira» la misma
 * figura que movió en «Juega» (hallazgo 9).
 * Errores: TR21 y TR22 de docs/investigacion/trigonometria-ideas-erroneas.md (parcial); TR12 (parcial). Hipótesis
 * nuestras: ECU-SIEMPRE-DOS (dos soluciones por vuelta siempre), ECU-RANGO (busca solución con |k| > 1),
 * ECU-INFINITAS (da la solución general cuando piden un intervalo), ECU-CUADRANTE (pone las soluciones en otros
 * cuadrantes), ECU-PATRON (usa la familia de otra función), ECU-EXTREMO (incluye un extremo abierto o deja uno
 * cerrado), ECU-UNA-VUELTA (cuenta solo la primera vuelta), ECU-FACTOR (iguala a cero un solo factor),
 * ECU-SIS-UNION (une los conjuntos de un sistema), ECU-SIS-PRIMERA (resuelve solo la primera ecuación),
 * ECU-SIS-VACIO (cree que el sistema no tiene solución).
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: resolver una ecuación trigonométrica es hallar todo el conjunto solución dentro del intervalo pedido.
 *   Persona y condiciones: postulante de 5.º, celular de 360 px de gama baja, con o sin conexión, en el aula o en casa.
 *   Resultado observable: lista las soluciones de un intervalo, escribe la solución general y descarta extremos y divisiones.
 *   Orden de atención: 1.º la recta y = k · 2.º sus cortes con la circunferencia · acción: mover k · fondo: los ejes.
 *   Estados: juego sin tocar · probando · predicción pendiente · coincide / no coincide · paso de «Mira» · caso nuevo.
 *   Duda que resuelve: ¿por qué la calculadora da un solo ángulo si la ecuación tiene dos, uno o ninguno por vuelta?
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (x, d = 2) => Kit.formatear(x, d);
  const th = { v: 'c-o', t: 'θ' }, al = { v: 'c-o', t: 'α' }, k = { v: 'c-i', t: 'k' }, c = { v: 'c-d', t: 'c' }, n = { v: 'c-h', t: 'n' };
  const rad = g => g * Math.PI / 180, deg = x => x * 180 / Math.PI;
  const mod360 = x => ((x % 360) + 360) % 360;
  const FN = { sen: g => Math.sin(rad(g)), cos: g => Math.cos(rad(g)), tan: g => (mod360(g) % 180 === 90 ? NaN : Math.tan(rad(g))) };
  // Valores notables escritos como en el examen: 0,5 → «1/2», 0,866… → «√3/2».
  const NOTABLES = [[0, '0'], [0.5, '1/2'], [Math.SQRT2 / 2, '√2/2'], [Math.sqrt(3) / 2, '√3/2'], [1, '1'], [Math.sqrt(3) / 3, '√3/3'], [Math.sqrt(3), '√3'], [1.2, '1,2'], [1.5, '3/2'], [2, '2']];
  function kTxt(v) {
    const e = NOTABLES.find(([x]) => Math.abs(Math.abs(v) - x) < 1e-9);
    return e ? `${v < 0 && e[0] ? '−' : ''}${e[1]}` : f(v, 2);
  }
  // Soluciones enteras (en grados) de fn θ = v en [a, b] o [a, b): se prueba cada grado (cálculo independiente de la regla).
  function soluciones(fn, v, a = 0, b = 360, cerrado = false) {
    const out = [];
    for (let g = a; cerrado ? g <= b : g < b; g++) { const y = FN[fn](g); if (Number.isFinite(y) && Math.abs(y - v) < 1e-9) out.push(g); }
    return out;
  }
  const lista = xs => (!xs.length ? 'ninguna' : xs.length === 1 ? `${f(xs[0])}°` : `${xs.slice(0, -1).map(x => `${f(x)}°`).join(', ')} y ${f(xs[xs.length - 1])}°`);
  const orden = xs => [...new Set(xs.map(x => Math.round(x * 1e6) / 1e6))].sort((p, q) => p - q);
  // Azar con semilla para «Ahora tú» (el de la unidad modelo).
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
      if (d.valor === null || d.valor === undefined || (typeof d.valor === 'number' && !Number.isFinite(d.valor))) continue;
      const txt = fmt(d.valor);
      if (vistos.has(txt)) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }
  // Un punto de la circunferencia en el ángulo g, con el rótulo hacia afuera.
  const pto = (g, extra = {}) => {
    const x = Math.cos(rad(g)), y = Math.sin(rad(g));
    return Object.assign({ x, y, color: 'o', rotulo: `${f(g, 1)}°`, lado: x >= -1e-9 ? (y > 1e-9 ? 'ne' : 'se') : (y > 1e-9 ? 'no' : 'so') }, extra);
  };
  const rayo = (g, extra = {}) => Object.assign({ ang: g, color: 'o', punta: false, grosor: 'contorno' }, extra);
  const plano = extra => Object.assign({ ventana: { x: [-1.7, 1.7], y: [-1.3, 1.3] }, circulos: [{ r: 1 }] }, extra);
  // El nombre de una recta vertical va abajo, junto a ella (arriba choca con el eje y).
  // Arriba si c ≥ 0 y abajo si c < 0: así no choca con el nombre del eje y ni con los rótulos de los cortes.
  const nombreX = (cv, texto, color, extra = {}) => Object.assign({ x: cv + 0.07, y: cv >= 0 ? 1.2 : -1.2, texto, color, ancla: 'start' }, extra);
  const fnTxt = { sen: 'sen', cos: 'cos', tan: 'tan' };
  // Gesto directo (docs/teoria.md §4b): las manijas usan la geometría de las piezas. La de «ejes» no trae inversa:
  // se invierte aquí con una función lineal (como `inversa` en fisica/movimiento-rectilineo.js).
  const TP = () => Kit.piezas['trig-plano'], EJES = () => Kit.piezas.ejes;
  const xDeEjes = (d, px) => { const G = EJES().geometria(d), a = G.X(d.x.min), b = G.X(d.x.max); return d.x.min + (px - a) / (b - a) * (d.x.max - d.x.min); };
  const yDeEjes = (d, py) => { const G = EJES().geometria(d), a = G.Y(d.y.min), b = G.Y(d.y.max); return d.y.min + (py - a) / (b - a) * (d.y.max - d.y.min); };
  // Manija de la recta y = k en su extremo derecho (o izquierdo, si ahí va su rótulo).
  const manijaY = (d, kv, x = 1.58) => TP().enPx(d, x, kv);

  // ---------- Idea 1: cuántas veces corta la recta ----------
  // Cambia: la altura k de la recta y = k, entre −0,9 y 0,9. · Permanece: la circunferencia de radio 1 y el lado inicial.
  // Progresa: los dos cortes, que se acercan al subir k. · Se reserva: la recta que toca la cima (k = 1) y la que
  // pasa por fuera (la predicción y «Mira»). · Debe verse: cada solución es un punto de la circunferencia con altura k.
  const cortes = (kv, extra = {}) => {
    const angs = Math.abs(kv) <= 1 ? orden([mod360(deg(Math.asin(kv))), mod360(180 - deg(Math.asin(kv)))]) : [];
    return plano(Object.assign({
      rectas: [{ y: kv, color: 'i' }],
      rayos: angs.map(g => rayo(g)),
      puntos: angs.map(g => pto(g)),
      alt: `La recta y = ${f(kv, 1)} corta la circunferencia en ${angs.length} puntos`,
    }, extra));
  };
  const cuantas = {
    id: 'cortes-recta',
    titulo: 'Cuántas veces corta la recta',
    temas: ['Ecuaciones elementales'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Mueve k. Resolver sen θ = k es buscar los puntos de la circunferencia que tienen altura k: están donde la recta turquesa la corta.',
      voz: 'Conservemos el origen y miremos cada corte como un ángulo.',
      controles: [{ id: 'k', etiqueta: 'k', color: 'c-i', min: -0.9, max: 0.9, paso: 0.1, inicio: 0.5, decimales: 1 }],
      dibujo: val => ({ datos: cortes(val.k), estado: {} }),
      lectura: val => {
        const a = mod360(deg(Math.asin(val.k))), b = mod360(180 - deg(Math.asin(val.k)));
        const [p, q] = orden([a, b]);
        return ['sen ', th, ' = ', k, ` = ${f(val.k, 1)}:  `, th, ` = ${f(p, 1)}° o ${f(q, 1)}°`];
      },
      minimo: 3,
      // Se arrastra la recta y = k por su extremo derecho, arriba y abajo: los dos cortes responden.
      arrastres: [{ id: 'recta-k', etiqueta: 'recta y = k', color: 'c-i',
        donde: val => manijaY(cortes(val.k), val.k),
        mover: (pt, val) => ({ k: TP().delPx(cortes(val.k), pt).y }) }],
    },
    predice: {
      pregunta: ['En [0°, 360°), ¿cuántas soluciones tiene sen ', th, ' = 1?'],
      voz: 'Piensa dónde queda la recta y = 1 respecto a la circunferencia.',
      opciones: [
        { id: 'c', texto: 'Una: 90°', correcta: true },
        { id: 'dos', texto: 'Dos, como con los otros valores', error: 'ECU-SIEMPRE-DOS', siFuera: 'Con |k| < 1 hay dos cortes. En y = 1 la recta toca la cima: los dos cortes se juntan.' },
        { id: 'cero', texto: 'Ninguna', error: 'ECU-RANGO', siFuera: 'Sería cierto con k mayor que 1. La altura 1 sí se alcanza, en la cima.' },
        { id: 'inf', texto: 'Infinitas', error: 'ECU-INFINITAS', siFuera: 'Hay infinitas si se dan todas las vueltas. En [0°, 360°) hay una sola vuelta.' },
      ],
      dibujo: { datos: plano({ rectas: [{ y: 0.5, color: 'i', rotulo: 'y = 0,5' }], puntos: [pto(30), pto(150)], alt: 'La recta y = 0,5 corta la circunferencia en dos puntos' }), estado: {} },
      revelar: { datos: plano({ rectas: [{ y: 1, color: 'i', rotulo: 'y = 1' }], rayos: [rayo(90)], puntos: [pto(90, { lado: 'ne' })], alt: 'La recta y = 1 toca la circunferencia solo en la cima, a 90 grados' }), estado: {} },
      coincide: 'Coincide: la recta toca la cima en un solo punto, 90°.',
      noCoincide: 'Revisemos la cima: la recta y = 1 la toca en un solo punto.',
    },
    mira: {
      datos: plano({
        rectas: [{ y: 0.5, color: 'i', rotulo: 'y = 1/2', desde: 1, hasta: 1 }, { y: 1, color: 'i', rotulo: 'y = 1', desde: 2, hasta: 2 }, { y: 1.2, color: 'i', rotulo: 'y = 1,2', desde: 3 }],
        puntos: [pto(30, { desde: 1, hasta: 1 }), pto(150, { desde: 1, hasta: 1 }), pto(90, { desde: 2, hasta: 2 })],
        rotulos: [{ x: 0, y: -0.5, texto: 'sin cortes', desde: 3 }],
        alt: 'Tres rectas horizontales: a altura un medio corta en dos puntos, a altura 1 toca en uno y a 1,2 no corta',
      }),
      voz: 'Sube la recta y cuenta los cortes en cada altura.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Con k = 1/2, la recta corta la circunferencia dos veces.', ecuacion: ['sen ', th, ' = ', { frac: ['1', '2'] }, ':  ', th, ' = 30° o 150°'] },
        { estado: { corte: 2 }, texto: 'Con k = 1, los dos cortes se juntan en la cima.', ecuacion: ['sen ', th, ' = 1:  ', th, ' = 90°'] },
        { estado: { corte: 3 }, texto: 'Con k = 1,2, la recta queda por encima: no hay cortes.', ecuacion: ['sen ', th, ' = 1,2:  sin solución, porque −1 ≤ sen ', th, ' ≤ 1'] },
      ],
    },
    regla: {
      texto: 'En una vuelta, sen θ = k tiene dos soluciones si |k| < 1, una si k = ±1 y ninguna si |k| > 1. Con cos θ = k pasa lo mismo.',
      ecuacion: [{ abs: [k] }, ' < 1: dos', '   ·   ', k, ' = ±1: una', '   ·   ', { llave: [{ abs: [k] }, ' > 1'], nota: 'fuera del círculo', color: 'c-i' }, ': ninguna'],
      condicion: 'se cuenta en una sola vuelta, por ejemplo en [0°, 360°). En k = 0 también hay dos: 0° y 180°.',
      voz: 'Antes de calcular, mira si la altura cabe en la circunferencia.',
    },
    ahoraTu: {
      pieza: 'trig-plano',
      voz: 'Ubica la recta antes de contar.',
      generar(sem) {
        const rr = azar(sem), fn = sem % 2 ? 'cos' : 'sen';
        const v = rr.uno([0.5, -0.5, Math.SQRT2 / 2, -Math.sqrt(3) / 2, 1, -1, 0, 1.5, -2, 1.2]);
        const sols = soluciones(fn, v), m = sols.length;
        const ops = [];
        if (m === 2) ops.push({ id: 'una', valor: 1, error: 'TR22', siFuera: 'Esa es la que da la calculadora. Hay otro ángulo de la vuelta con el mismo valor.' });
        if (m !== 2) ops.push({ id: 'dos', valor: 2, error: 'ECU-SIEMPRE-DOS', siFuera: m === 1 ? 'Con |k| < 1 serían dos. Con k = ±1 los dos cortes se juntan en uno.' : 'Con |k| ≤ 1 habría cortes. Este valor queda fuera de [−1, 1].' });
        if (m === 0) ops.push({ id: 'rango', valor: 1, error: 'ECU-RANGO', siFuera: 'La calculadora marca error con razón: ningún seno ni coseno pasa de 1 en valor absoluto.' });
        if (m > 0) ops.push({ id: 'cero', valor: 0, error: 'ECU-RANGO', siFuera: 'Sería cierto si |k| > 1. Este valor está dentro de [−1, 1].' });
        ops.push({ id: 'inf', valor: Infinity, error: 'ECU-INFINITAS', siFuera: 'Infinitas serían con todas las vueltas. Aquí se cuenta solo [0°, 360°).' });
        const fmt = x => (x === Infinity ? 'Infinitas' : `${x} ${x === 1 ? 'solución' : 'soluciones'}`);
        const opsTxt = opciones(m, ops.map(o => Object.assign({}, o, { valor: o.valor === Infinity ? 'inf' : o.valor })), x => (x === 'inf' ? 'Infinitas' : fmt(x)));
        const vista = fn === 'sen' ? { y: v } : { x: v };
        const vent = Math.abs(v) > 1.25 ? { ventana: { x: [-2.2, 2.2], y: [-2.2, 2.2] } } : {};
        return {
          pregunta: ['En [0°, 360°), ¿cuántas soluciones tiene ', `${fnTxt[fn]} `, th, ' = ', k, ` = ${kTxt(v)}?`],
          opciones: opsTxt,
          solucion: {
            texto: m ? `La recta corta la circunferencia en ${m === 1 ? 'un punto' : 'dos puntos'}.` : 'La recta no corta la circunferencia: el valor pasa de 1.',
            ecuacion: [th, ` = ${lista(sols)}`],
            dibujo: { datos: plano(Object.assign({ rectas: [Object.assign({ color: 'i', rotulo: fn === 'sen' ? `y = ${kTxt(v)}` : undefined }, vista)], rotulos: fn === 'sen' ? [] : [nombreX(v, `x = ${kTxt(v)}`, 'i', Math.abs(v) > 1.25 ? { y: v > 0 ? 2.1 : -2.1 } : {})], rayos: sols.map(g => rayo(g)), puntos: sols.map(g => pto(g)), alt: `La recta ${fn === 'sen' ? 'y' : 'x'} = ${kTxt(v)} y sus ${m} cortes con la circunferencia` }, vent)), estado: {} },
          },
        };
      },
    },
  };

  // ---------- Idea 2: la calculadora da un solo valor ----------
  // Cambia: el valor k (positivo) y la vuelta n. · Permanece: la recta y = k y la circunferencia.
  // Progresa: el arco que da n vueltas más hasta cada solución. · Se reserva: k negativo, donde el valor principal
  // es negativo (la predicción). · Debe verse: dos familias, α + 360°·n y 180° − α + 360°·n.
  const vueltas = (kv, nv) => {
    const a = deg(Math.asin(kv)), t1 = a + 360 * nv, t2 = 180 - a + 360 * nv;
    return plano({
      rectas: [{ y: kv, color: 'i' }],
      rayos: [rayo(a, { grosor: undefined, discontinua: true, largo: 1.12 }), rayo(180 - a)],
      arcos: [{ de: 0, a: t1, r: 0.28, color: 'o', espiral: 9 }, { de: 0, a: t2, r: 0.5, color: 'o', espiral: 9 }],
      puntos: [pto(a, { rotulo: `${f(t1, 1)}°` }), pto(180 - a, { rotulo: `${f(t2, 1)}°` })],
      alt: `Con k = ${f(kv, 1)} y n = ${nv}: soluciones ${f(t1, 1)} y ${f(t2, 1)} grados`,
    });
  };
  const familias = {
    id: 'solucion-general',
    titulo: 'La calculadora da un valor',
    temas: ['Solución general y particular', 'Ecuaciones elementales'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Mueve k y la vuelta n. El rayo discontinuo α es lo que da la calculadora; los arcos llegan a las dos soluciones.',
      voz: 'La calculadora muestra un valor principal; revisemos las soluciones del intervalo.',
      controles: [
        { id: 'k', etiqueta: 'k', color: 'c-i', min: 0.1, max: 0.9, paso: 0.1, inicio: 0.5, decimales: 1 },
        { id: 'n', etiqueta: 'n', color: 'c-h', min: -1, max: 1, paso: 1, inicio: 0, decimales: 0 },
      ],
      dibujo: val => ({ datos: vueltas(val.k, val.n), estado: {} }),
      lectura: val => {
        const a = deg(Math.asin(val.k));
        return [al, ` = ${f(a, 1)}°`, '   ·   ', th, ` = ${f(a + 360 * val.n, 1)}° o ${f(180 - a + 360 * val.n, 1)}°`];
      },
      minimo: 3,
      // Se arrastra la recta y = k; la vuelta n es un entero y queda con − y +.
      arrastres: [{ id: 'recta-k', etiqueta: 'recta y = k', color: 'c-i',
        donde: val => manijaY(vueltas(val.k, val.n), val.k),
        mover: (pt, val) => ({ k: TP().delPx(vueltas(val.k, val.n), pt).y }) }],
    },
    predice: {
      pregunta: ['La calculadora da arcsen(−1/2) = −30°. ¿Qué soluciones tiene sen ', th, ' = −1/2 en [0°, 360°)?'],
      voz: 'Ubica la recta y = −1/2 antes de elegir.',
      opciones: [
        { id: 'c', texto: '210° y 330°', correcta: true },
        { id: 'calc', texto: 'Solo −30°', error: 'TR22', siFuera: '−30° cumple la ecuación, pero no está en [0°, 360°). Además hay otro corte en esa vuelta.' },
        { id: 'cuad', texto: '150° y 210°', error: 'ECU-CUADRANTE', siFuera: 'El ángulo de referencia 30° está bien. Con seno negativo, los puntos quedan abajo: III y IV.' },
        { id: 'una', texto: 'Solo 330°', error: 'TR22', siFuera: '330° es −30° más una vuelta, y cumple. Falta el otro corte de la recta.' },
      ],
      dibujo: { datos: plano({ rectas: [{ y: -0.5, color: 'i', rotulo: 'y = −1/2' }], rayos: [rayo(-30, { grosor: undefined, discontinua: true, largo: 1.12 })], alt: 'La recta y = −1/2 y el rayo del valor principal, −30 grados' }), estado: {} },
      revelar: { datos: plano({ rectas: [{ y: -0.5, color: 'i', rotulo: 'y = −1/2' }], rayos: [rayo(210), rayo(330)], arcos: [{ de: 0, a: 210, r: 0.28, color: 'o' }, { de: 0, a: 330, r: 0.5, color: 'o' }], puntos: [pto(210), pto(330)], alt: 'Los dos cortes de la recta y = −1/2: 210 y 330 grados' }), estado: {} },
      coincide: 'Coincide: −30° se lleva a 330° sumando una vuelta, y el otro corte es 180° − (−30°) = 210°.',
      noCoincide: 'Revisemos los dos cortes de la recta: los dos están dibujados.',
    },
    mira: {
      datos: plano({
        rectas: [{ y: -0.5, color: 'i', rotulo: 'y = −1/2' }],
        rayos: [rayo(-30, { grosor: undefined, discontinua: true, largo: 1.12, desde: 1, hasta: 2 }), rayo(210, { desde: 2 }), rayo(330, { desde: 3 })],
        arcos: [{ de: 0, a: 210, r: 0.28, color: 'o', desde: 2 }, { de: 0, a: 330, r: 0.5, color: 'o', desde: 3 }],
        puntos: [pto(-30, { rotulo: 'α = −30°', desde: 1, hasta: 2 }), pto(210, { desde: 2 }), pto(330, { desde: 3 })],
        alt: 'El valor principal −30 grados, el corte simétrico 210 grados y el mismo punto con una vuelta más, 330 grados',
      }),
      voz: 'Primero el valor principal; después, el corte que falta.',
      pasos: [
        { estado: { corte: 1 }, texto: 'La calculadora da un solo ángulo, el valor principal.', ecuacion: [al, ' = arcsen(−1/2) = −30°'] },
        { estado: { corte: 2 }, texto: 'El otro corte está a la misma altura, al otro lado del eje y.', ecuacion: [th, ' = 180° − ', al, ' = 180° − (−30°) = 210°'] },
        { estado: { corte: 3 }, texto: '−30° no está en [0°, 360°); con una vuelta más, sí.', ecuacion: [th, ' = ', al, ' + 360° = 330°'] },
        { estado: { corte: 3 }, texto: 'Dando valores a n salen todas las soluciones.', ecuacion: [th, ' = −30° + 360°', n, '  o  ', th, ' = 210° + 360°', n] },
      ],
    },
    regla: {
      texto: 'Si α es el valor que da la calculadora, sen θ = k tiene dos familias de soluciones. La solución particular son las que caen en el intervalo pedido.',
      // Las dos familias van en líneas separadas («o» entre ellas: el texto de la regla lo dice).
      ecuacion: [th, ' = ', { llave: [al], nota: 'calculadora', color: 'c-o' }, ' + 360°', n, '   ·   ', th, ' = ', { llave: ['180° − ', al], nota: 'el otro corte', color: 'c-o' }, ' + 360°', n],
      condicion: '|k| ≤ 1, α = arcsen k entre −90° y 90°, n entero. Coseno: θ = ±α + 360°n. Tangente: θ = α + 180°n.',
      voz: 'Una familia por cada corte; las vueltas las pone n.',
    },
    ahoraTu: {
      voz: 'Primero el valor principal; después, los cortes de la vuelta.',
      generar(sem) {
        const rr = azar(sem), fn = ['sen', 'cos', 'tan'][sem % 3];
        const v = fn === 'tan' ? rr.uno([1, -1, Math.sqrt(3), -Math.sqrt(3), Math.sqrt(3) / 3, -Math.sqrt(3) / 3])
          : rr.uno([0.5, -0.5, Math.SQRT2 / 2, -Math.SQRT2 / 2, Math.sqrt(3) / 2, -Math.sqrt(3) / 2]);
        const a = Math.round(deg(fn === 'sen' ? Math.asin(v) : fn === 'cos' ? Math.acos(v) : Math.atan(v)));
        const sols = soluciones(fn, v);
        const patronSen = orden([mod360(a), mod360(180 - a)]), patronCos = orden([mod360(a), mod360(-a)]);
        const otro = fn === 'cos' ? patronSen : fn === 'sen' ? patronCos : patronSen;
        const sinSigno = soluciones(fn, Math.abs(v));
        const fmt = xs => (Array.isArray(xs) ? lista(xs) : xs);
        return {
          pregunta: ['La calculadora da ', al, ` = arc${fn === 'sen' ? 'sen' : fn === 'cos' ? 'cos' : 'tan'}(${kTxt(v)}) = ${f(a)}°. ¿Qué soluciones tiene ${fnTxt[fn]} `, th, ` = ${kTxt(v)} en [0°, 360°)?`],
          opciones: opciones(sols, [
            { id: 'calc', valor: [a], error: 'TR22', siFuera: a < 0 ? 'Ese ángulo cumple, pero está fuera de [0°, 360°); y falta la otra solución.' : 'Ese ángulo cumple. En la vuelta hay otra solución con el mismo valor.' },
            { id: 'patron', valor: otro, error: 'ECU-PATRON', siFuera: fn === 'tan' ? 'Esa es la familia del seno. La tangente se repite cada 180°: θ = α + 180°n.' : fn === 'sen' ? 'Esa es la familia del coseno, ±α. El seno repite su valor en 180° − α.' : 'Esa es la familia del seno, 180° − α. El coseno repite su valor en −α.' },
            { id: 'signo', valor: sinSigno, error: 'TR12', siFuera: 'Esos ángulos dan el valor positivo. Aquí el valor es negativo: los cortes cambian de cuadrante.' },
            { id: 'una', valor: [mod360(a)], error: 'TR22', siFuera: 'Ese ángulo cumple. Falta el otro de la misma vuelta.' },
          ].filter(d => JSON.stringify(d.valor) !== JSON.stringify(sols)), fmt),
          solucion: {
            texto: fn === 'tan' ? 'La tangente repite su valor cada 180°.' : fn === 'sen' ? 'El seno repite su valor en 180° − α.' : 'El coseno repite su valor en −α.',
            ecuacion: [th, ' = ', fn === 'tan' ? `${f(a)}° + 180°` : fn === 'sen' ? `${f(a)}° + 360°` : `±${f(a)}° + 360°`, n, fn === 'sen' ? `  o  ${f(180 - a)}° + 360°` : '', fn === 'sen' ? n : '', `  ⇒  ${lista(sols)}`],
          },
        };
      },
    },
  };

  // ---------- Idea 3: los extremos del intervalo cuentan ----------
  // Cambia: el final b del intervalo [0°, b]. · Permanece: la gráfica de sen θ y la recta y = 1/2.
  // Progresa: la ventana sombreada, que deja entrar más cortes. · Se reserva: un intervalo abierto a la derecha
  // (la predicción). · Debe verse: un extremo con «[» entra; con «)» queda fuera, aunque sea coterminal con 0°.
  const curvaSen = { puntos: Array.from({ length: 145 }, (_, i) => [i * 5, Math.sin(rad(i * 5))]), color: 'o' };
  const grafica = (b, kv, puntos, extra = {}) => Object.assign({
    compacto: true,
    x: { min: 0, max: 720, paso: 90, nombre: 'θ', unidad: '°', decimales: 0, color: 'o' },
    y: { min: -1.2, max: 1.2, paso: 0.5, decimales: 1 },
    areas: [{ puntos: [[0, -1.2], [b, -1.2], [b, 1.2], [0, 1.2]], color: 'd', cerrada: true }],
    curvas: [curvaSen, { puntos: [[0, kv], [720, kv]], color: 'i', discontinua: true }],
    puntos,
    alt: `Gráfica de sen θ de 0 a 720 grados, la recta y = ${f(kv, 1)} y el intervalo hasta ${f(b)} grados sombreado`,
  }, extra);
  const franja = b => {
    const s = soluciones('sen', 0.5, 0, b, true);
    return grafica(b, 0.5, [30, 150, 390, 510].map(g => ({ x: g, y: 0.5, color: 'o', abierto: !s.includes(g), rotulo: s.includes(g) ? `${g}°` : undefined })));
  };
  const extremos = {
    id: 'extremos',
    titulo: 'Los extremos del intervalo cuentan',
    temas: ['Solución general y particular'],
    pieza: 'ejes',
    juega: {
      consigna: 'Ecuación: sen θ = 1/2. Mueve el final b del intervalo [0°, b] y cuenta los cortes dentro de la franja verde.',
      voz: 'Fíjate en lo que pasa justo cuando b cae en un corte.',
      controles: [{ id: 'b', etiqueta: 'b', color: 'c-d', min: 90, max: 720, paso: 30, inicio: 180, unidad: '°', decimales: 0 }],
      dibujo: val => {
        return { datos: franja(val.b), estado: {} };
      },
      lectura: val => {
        const s = soluciones('sen', 0.5, 0, val.b, true);
        return [`[0°, ${f(val.b)}°]: `, th, ` = ${lista(s)}`];
      },
      minimo: 3,
      // Se arrastra el borde derecho de la franja verde (el final b del intervalo), de lado a lado.
      arrastres: [{ id: 'borde-b', etiqueta: 'final b del intervalo', color: 'c-d',
        donde: val => { const d = franja(val.b), G = EJES().geometria(d); return { x: G.X(val.b), y: G.Y(-0.95) }; },
        mover: (pt, val) => ({ b: xDeEjes(franja(val.b), pt.x) }) }],
    },
    predice: {
      pregunta: ['¿Cuántas soluciones tiene sen ', th, ' = 0 en el intervalo [0°, 360°)?'],
      voz: 'Mira con cuidado los dos extremos del intervalo.',
      opciones: [
        { id: 'c', texto: 'Dos: 0° y 180°', correcta: true },
        { id: 'tres', texto: 'Tres: 0°, 180° y 360°', error: 'ECU-EXTREMO', siFuera: 'Sería cierto en [0°, 360°]. El «)» deja fuera a 360°, aunque esté en el mismo lugar que 0°.' },
        { id: 'una', texto: 'Una: 180°', error: 'ECU-EXTREMO', siFuera: '180° cumple. El «[» sí deja entrar a 0°, y sen 0° = 0.' },
        { id: 'inf', texto: 'Infinitas: 180° · n', error: 'ECU-INFINITAS', siFuera: 'Esa es la solución general. El intervalo pide solo las de una vuelta.' },
      ],
      dibujo: { datos: grafica(360, 0, [], { alt: 'Gráfica de sen θ de 0 a 720 grados con el intervalo de 0 a 360 grados sombreado' }), estado: {} },
      revelar: { datos: grafica(360, 0, [{ x: 0, y: 0, color: 'o', rotulo: '0°' }, { x: 180, y: 0, color: 'o', rotulo: '180°' }, { x: 360, y: 0, color: 'o', abierto: true, rotulo: '360° queda fuera' }], { alt: 'Cortes de sen θ = 0: 0 y 180 grados dentro; 360 grados es un punto hueco, fuera del intervalo' }), estado: {} },
      coincide: 'Coincide: 0° y 180° entran; 360° queda fuera por el «)».',
      noCoincide: 'Revisemos los extremos: el punto hueco de 360° está fuera.',
    },
    mira: {
      datos: grafica(360, 0, [
        { x: 0, y: 0, color: 'o', rotulo: '0°', desde: 2 }, { x: 180, y: 0, color: 'o', rotulo: '180°', desde: 2 },
        { x: 360, y: 0, color: 'o', abierto: true, rotulo: '360°: fuera', desde: 3 },
        { x: 540, y: 0, color: 'h', abierto: true, desde: 1, hasta: 1 }, { x: 720, y: 0, color: 'h', abierto: true, desde: 1, hasta: 1 },
      ], { alt: 'La solución general 180 n marcada en la gráfica; dentro de [0, 360) quedan 0 y 180 grados' }),
      voz: 'Primero todas las soluciones; después, la franja.',
      pasos: [
        { estado: { corte: 1 }, texto: 'La solución general de sen θ = 0 da un corte cada 180°.', ecuacion: [th, ' = 180° · ', n] },
        { estado: { corte: 2 }, texto: 'Con n = 0 y n = 1 se cae dentro: 0° y 180°.', ecuacion: [n, ' = 0:  0°', '   ·   ', n, ' = 1:  180°'] },
        { estado: { corte: 3 }, texto: 'Con n = 2 sale 360°, y el «)» lo deja fuera.', ecuacion: ['0° ≤ ', th, ' < 360°'] },
      ],
    },
    regla: {
      texto: 'La solución particular sale de la general: se dan valores enteros a n y se conservan solo los ángulos del intervalo, mirando cada extremo.',
      ecuacion: [{ llave: ['[0°'], nota: 'entra' }, ', ', { llave: ['360°)'], nota: 'queda fuera' }],
      condicion: 'el intervalo es parte de la ecuación. 0° y 360° son coterminales, pero son números distintos.',
      voz: 'Revisemos los extremos antes de dar la lista.',
    },
    ahoraTu: {
      voz: 'Cuenta en la gráfica y revisa los dos extremos.',
      generar(sem) {
        const rr = azar(sem), fn = sem % 2 ? 'cos' : 'sen';
        const v = rr.uno([0, 1, -1, 0.5, -0.5]);
        const b = rr.uno([180, 360, 540, 720]), cerrado = rr.ent(0, 1) === 1;
        const sols = soluciones(fn, v, 0, b, cerrado), m = sols.length;
        const otro = soluciones(fn, v, 0, b, !cerrado).length, sinCero = sols.filter(g => g !== 0).length, vuelta = soluciones(fn, v, 0, 360).length;
        const fmt = x => `${x} ${x === 1 ? 'solución' : 'soluciones'}`;
        const I = `[0°, ${f(b)}°${cerrado ? ']' : ')'}`;
        return {
          pregunta: ['¿Cuántas soluciones tiene ', `${fnTxt[fn]} `, th, ` = ${kTxt(v)} en el intervalo ${I}?`],
          opciones: opciones(m, [
            { id: 'extremo', valor: otro, error: 'ECU-EXTREMO', siFuera: cerrado ? `Sería cierto con «)». El «]» deja entrar a ${f(b)}°.` : `Sería cierto con «]». El «)» deja fuera a ${f(b)}°.` },
            { id: 'cero', valor: sinCero, error: 'ECU-EXTREMO', siFuera: 'Sería cierto si el intervalo empezara en «(». Con «[», 0° entra.' },
            { id: 'vuelta', valor: vuelta, error: 'ECU-UNA-VUELTA', siFuera: 'Así se cuenta en una vuelta. Este intervalo mide otra cosa: hay que recorrerlo entero.' },
            { id: 'dos', valor: 2 * b / 360, error: 'ECU-SIEMPRE-DOS', siFuera: 'Dos por vuelta vale si |k| < 1. Con k = 0, ±1 o en los extremos, hay que contar.' },
            { id: 'mas', valor: m + 1, error: 'ECU-EXTREMO', siFuera: 'Revisemos cada corte de la franja: alguno de los que cuentas no cumple o está fuera.' },
          ], fmt),
          solucion: {
            texto: `Dentro de ${I} quedan ${m === 1 ? 'este ángulo' : m ? 'estos ángulos' : 'ninguno'}.`,
            ecuacion: [th, ` = ${lista(sols)}`],
            dibujo: { datos: grafica(b, v, sols.map(g => ({ x: g, y: v, color: 'o' })), {
              curvas: [fn === 'sen' ? curvaSen : { puntos: Array.from({ length: 145 }, (_, i) => [i * 5, Math.cos(rad(i * 5))]), color: 'o' }, { puntos: [[0, v], [720, v]], color: 'i', discontinua: true }],
              alt: `Gráfica de ${fnTxt[fn]} θ, la recta y = ${kTxt(v)} y el intervalo ${I}: ${m} soluciones`,
            }), estado: {} },
          },
        };
      },
    },
  };

  // ---------- Idea 4: factorizar sin dividir ----------
  // Cambia: el valor c del segundo factor, en sen θ · (cos θ − c) = 0. · Permanece: la recta y = 0 del primer factor.
  // Progresa: los cuatro cortes, dos por cada recta. · Se reserva: la ecuación sin factorizar y la división entre
  // sen θ (la predicción). · Debe verse: un producto es cero si lo es cualquiera de sus factores.
  const producto = (cv, extra = {}) => {
    const s1 = soluciones('sen', 0), a = deg(Math.acos(cv)), s2 = orden([a, 360 - a]);
    return plano(Object.assign({
      rectas: [{ y: 0, color: 'i' }, { x: cv, color: 'd' }],
      // Con c grande, el rótulo pasa a la izquierda de la recta: arriba a la derecha está el botón de la lupa.
      rotulos: [Object.assign(nombreX(cv, `x = ${kTxt(cv)}`, 'd'), cv > 0.5 ? { x: cv - 0.07, ancla: 'end' } : {})],
      puntos: [...s1.map(g => pto(g, { color: 'i' })), ...s2.map(g => pto(g, { color: 'd' }))],
      alt: `Los cortes de y = 0 (0 y 180 grados) y de x = ${f(cv, 1)} (${f(s2[0], 1)} y ${f(s2[1], 1)} grados) con la circunferencia`,
    }, extra));
  };
  const factores = {
    id: 'factorizar',
    titulo: 'Factorizar, no dividir',
    temas: ['Ecuaciones no elementales'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Ecuación: sen θ · (cos θ − c) = 0. Mueve c. Cada factor que se anula aporta sus cortes: y = 0 y x = c.',
      voz: 'Conservemos los dos factores; cada uno aporta sus ángulos.',
      controles: [{ id: 'c', etiqueta: 'c', color: 'c-d', min: -0.9, max: 0.9, paso: 0.3, inicio: 0.3, decimales: 1 }],
      dibujo: val => ({ datos: producto(val.c), estado: {} }),
      lectura: val => {
        const a = deg(Math.acos(val.c));
        return [th, ` = ${lista(orden([0, 180, a, 360 - a]).map(x => Math.round(x * 10) / 10))}: cuatro`];
      },
      minimo: 3,
      // Se arrastra la recta x = c por su cruce con el eje x (ahí no hay otro trazo), de lado a lado.
      arrastres: [{ id: 'recta-c', etiqueta: 'recta x = c', color: 'c-d',
        donde: val => TP().enPx(producto(val.c), val.c, 0),
        mover: (pt, val) => ({ c: TP().delPx(producto(val.c), pt).x }) }],
    },
    predice: {
      pregunta: ['¿Qué soluciones tiene 2 sen ', th, ' cos ', th, ' = sen ', th, ' en [0°, 360°)?'],
      voz: 'Antes de simplificar, piensa qué pasa si sen θ vale cero.',
      opciones: [
        { id: 'c', texto: '0°, 60°, 180° y 300°', correcta: true },
        { id: 'divide', texto: '60° y 300°', error: 'TR21', siFuera: 'Esas cumplen. Al dividir entre sen θ se pierden los ángulos donde sen θ = 0.' },
        { id: 'extremo', texto: '0°, 60°, 180°, 300° y 360°', error: 'ECU-EXTREMO', siFuera: 'Todas cumplen la ecuación, pero 360° está fuera de [0°, 360°).' },
        { id: 'una', texto: '60°', error: 'TR22', siFuera: '60° cumple. Hay otros ángulos de la vuelta que también la cumplen.' },
      ],
      dibujo: { datos: plano({ alt: 'Circunferencia de radio 1, sin cortes marcados' }), estado: {} },
      revelar: { datos: producto(0.5, { alt: 'Cortes de y = 0 en 0 y 180 grados y de x = 1/2 en 60 y 300 grados' }), estado: {} },
      coincide: 'Coincide: los dos factores aportan sus ángulos, y ninguno se pierde.',
      noCoincide: 'Revisemos los dos factores: sus cuatro cortes están dibujados.',
    },
    mira: {
      datos: plano({
        rectas: [{ y: 0, color: 'i', desde: 2 }, { x: 0.5, color: 'd', desde: 3 }],
        puntos: [pto(0, { color: 'i', desde: 2, hasta: 3 }), pto(180, { color: 'i', desde: 2, hasta: 3 }), pto(0, { color: 'h', abierto: true, rotulo: '0° ✕', desde: 4 }), pto(180, { color: 'h', abierto: true, rotulo: '180° ✕', desde: 4 }), pto(60, { color: 'd', desde: 3 }), pto(300, { color: 'd', desde: 3 })],
        rotulos: [nombreX(0.5, 'x = 1/2', 'd', { desde: 3 })],
        alt: 'Los cortes de sen θ = 0 en 0 y 180 grados y los de cos θ = 1/2 en 60 y 300 grados',
      }),
      voz: 'Un factor a la vez, sin tachar ninguno.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Se pasa todo a un lado y se saca el factor común.', ecuacion: ['sen ', th, ' · (2 cos ', th, ' − 1) = 0'] },
        { estado: { corte: 2 }, texto: 'Primer factor: sen θ = 0 da 0° y 180°.', ecuacion: ['sen ', th, ' = 0  ⇒  ', th, ' = 0°, 180°'] },
        { estado: { corte: 3 }, texto: 'Segundo factor: cos θ = 1/2 da 60° y 300°.', ecuacion: ['cos ', th, ' = ', c, ' = ', { frac: ['1', '2'] }, '  ⇒  ', th, ' = 60°, 300°'] },
        { estado: { corte: 4 }, texto: 'Dividir entre sen θ supone que no es cero: se borran 0° y 180°.', ecuacion: ['4 soluciones', '   ·   ', 'dividiendo, solo 2'] },
      ],
    },
    regla: {
      texto: 'No dividas entre una expresión que puede valer cero. Pasa todo a un lado, factoriza e iguala a cero cada factor.',
      ecuacion: [{ llave: ['A'], nota: 'factor 1' }, ' · ', { llave: ['B'], nota: 'factor 2' }, ' = 0', '   ·   ', '⇔  A = 0  o  B = 0'],
      condicion: 'cada factor está definido en ese ángulo. Si elevas al cuadrado, comprueba cada solución en la ecuación original.',
      voz: 'Cada factor merece su propia revisión.',
    },
    ahoraTu: {
      voz: 'Saca el factor común antes de simplificar.',
      generar(sem) {
        const rr = azar(sem), tipo = sem % 2 ? 'cuad' : 'mixto';
        const fa = rr.uno(['sen', 'cos']), fb = fa === 'sen' ? 'cos' : 'sen';
        const [B, Btxt] = rr.uno([[1, '1'], [-1, '−1'], [Math.SQRT2, '√2'], [Math.sqrt(3), '√3'], [-Math.sqrt(3), '−√3']]);
        const f2 = tipo === 'cuad' ? fa : fb, v = B / 2, coef = Btxt === '1' ? '' : Btxt === '−1' ? '−' : Btxt + ' ';
        const s1 = soluciones(fa, 0), s2 = soluciones(f2, v), todo = orden([...s1, ...s2]);
        const pregunta = tipo === 'cuad'
          ? ['¿Qué soluciones tiene 2 ', { sup: [fnTxt[fa], '2'] }, ' ', th, ` = ${coef}${fnTxt[fa]} `, th, ' en [0°, 360°)?']
          : ['¿Qué soluciones tiene 2 ', `${fnTxt[fa]} `, th, ` ${fnTxt[fb]} `, th, ` = ${coef}${fnTxt[fa]} `, th, ' en [0°, 360°)?'];
        return {
          pregunta,
          opciones: opciones(todo, [
            { id: 'divide', valor: s2, error: 'TR21', siFuera: `Esas cumplen. Al dividir entre ${fnTxt[fa]} θ se pierden los ángulos donde vale cero.` },
            { id: 'factor', valor: s1, error: 'ECU-FACTOR', siFuera: 'Esas anulan el primer factor. El segundo factor también puede valer cero.' },
            { id: 'extremo', valor: s1.includes(0) ? [...todo, 360] : null, error: 'ECU-EXTREMO', siFuera: 'Todas cumplen, pero 360° está fuera de [0°, 360°).' },
            { id: 'una', valor: orden([...s1.slice(0, 1), ...s2.slice(0, 1)]), error: 'TR22', siFuera: 'Esas cumplen. Cada factor tiene dos soluciones en la vuelta.' },
          ], lista),
          solucion: {
            texto: `Un factor da ${lista(s1)}; el otro, ${lista(s2)}.`,
            ecuacion: [`${fnTxt[fa]} `, th, ` · (2 ${fnTxt[f2]} `, th, `${B < 0 ? ' + ' + Btxt.slice(1) : ' − ' + Btxt}) = 0  ⇒  `, th, ` = ${lista(todo)}`],
          },
        };
      },
    },
  };

  // ---------- Idea 5: un sistema pide las dos a la vez ----------
  // Cambia: k (sen θ = k) y c (cos θ = c). · Permanece: la circunferencia; cada ecuación, su recta y su color.
  // Progresa: los cortes huecos de cada ecuación y el punto lleno donde coinciden. · Se reserva: un sistema con
  // valores notables (la predicción). · Debe verse: la solución es la intersección de los dos conjuntos, no la unión.
  const sistema = (kv, cv, extra = {}) => {
    const a = deg(Math.asin(kv)), b = deg(Math.acos(cv));
    const s1 = orden([mod360(a), mod360(180 - a)]), s2 = orden([b, mod360(360 - b)]);
    const com = s1.filter(g => s2.some(h => Math.abs(g - h) < 1e-6));
    return plano(Object.assign({
      rectas: [{ y: kv, color: 'i', rotulo: `y = ${kTxt(kv)}` }, { x: cv, color: 'd' }],
      rotulos: [nombreX(cv, `x = ${kTxt(cv)}`, 'd')],
      puntos: [...s1.filter(g => !com.includes(g)).map(g => pto(g, { color: 'i', abierto: true, rotulo: undefined })), ...s2.filter(g => !com.some(h => Math.abs(g - h) < 1e-6)).map(g => pto(g, { color: 'd', abierto: true, rotulo: undefined })), ...com.map(g => pto(g, { rotulo: `${f(g, 1)}°` }))],
      alt: `Los cortes de y = ${kTxt(kv)} y de x = ${kTxt(cv)}: ${com.length ? 'coinciden en ' + com.map(g => f(g, 1) + ' grados').join(' y ') : 'no coinciden'}`,
    }, extra));
  };
  const comunes = (kv, cv) => {
    const a = deg(Math.asin(kv)), b = deg(Math.acos(cv));
    const s1 = orden([mod360(a), mod360(180 - a)]), s2 = orden([b, mod360(360 - b)]);
    return s1.filter(g => s2.some(h => Math.abs(g - h) < 1e-6));
  };
  const sistemas = {
    id: 'sistemas',
    titulo: 'Un sistema pide ambas',
    temas: ['Sistemas de ecuaciones trigonométricas'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Sistema: sen θ = k y cos θ = c. Mueve k y c. Los huecos cumplen una sola ecuación; un punto lleno cumple las dos.',
      voz: 'Busca valores que hagan coincidir un corte de cada recta.',
      controles: [
        { id: 'k', etiqueta: 'k', color: 'c-i', min: -0.8, max: 0.8, paso: 0.2, inicio: 0.6, decimales: 1 },
        { id: 'c', etiqueta: 'c', color: 'c-d', min: -0.8, max: 0.8, paso: 0.2, inicio: 0.4, decimales: 1 },
      ],
      dibujo: val => ({ datos: sistema(val.k, val.c), estado: {} }),
      lectura: val => {
        const s = comunes(val.k, val.c);
        return [k, ` = ${f(val.k, 1)} · `, c, ` = ${f(val.c, 1)} · cumplen las dos: `, s.length ? [th, ` = ${s.map(g => f(g, 1) + '°').join(' y ')}`] : 'ninguno'].flat();
      },
      minimo: 3,
      // Se arrastran las dos rectas: y = k por su extremo izquierdo (a la derecha va su rótulo) y x = c por su
      // cruce con el eje x.
      arrastres: [
        { id: 'recta-k', etiqueta: 'recta y = k', color: 'c-i',
          donde: val => manijaY(sistema(val.k, val.c), val.k, -1.58),
          mover: (pt, val) => ({ k: TP().delPx(sistema(val.k, val.c), pt).y }) },
        { id: 'recta-c', etiqueta: 'recta x = c', color: 'c-d',
          donde: val => TP().enPx(sistema(val.k, val.c), val.c, 0),
          mover: (pt, val) => ({ c: TP().delPx(sistema(val.k, val.c), pt).x }) },
      ],
    },
    predice: {
      pregunta: ['Sistema en [0°, 360°): sen ', th, ' = √3/2 y cos ', th, ' = −1/2. ¿Qué ángulos cumplen las dos ecuaciones?'],
      voz: 'Resuelve cada ecuación y compara las dos listas.',
      opciones: [
        { id: 'c', texto: 'Solo 120°', correcta: true },
        { id: 'union', texto: '60°, 120° y 240°', error: 'ECU-SIS-UNION', siFuera: 'Esa es la unión: cada uno cumple alguna. El sistema pide que cumpla las dos.' },
        { id: 'primera', texto: '60° y 120°', error: 'ECU-SIS-PRIMERA', siFuera: 'Esas resuelven la primera ecuación. 60° no cumple cos θ = −1/2.' },
        { id: 'vacio', texto: 'Ninguno', error: 'ECU-SIS-VACIO', siFuera: 'Sería cierto si las listas no compartieran ángulos. Las dos contienen 120°.' },
      ],
      dibujo: { datos: plano({ rectas: [{ y: Math.sqrt(3) / 2, color: 'i', rotulo: 'y = √3/2' }, { x: -0.5, color: 'd' }], rotulos: [nombreX(-0.5, 'x = −1/2', 'd')], alt: 'Las rectas y = raíz de 3 sobre 2 y x = −1/2 sobre la circunferencia' }), estado: {} },
      revelar: { datos: sistema(Math.sqrt(3) / 2, -0.5), estado: {} },
      coincide: 'Coincide: 120° está en las dos listas; 60° y 240° solo en una.',
      noCoincide: 'Revisemos qué punto está en las dos rectas: el punto lleno.',
    },
    mira: {
      datos: plano({
        rectas: [{ y: Math.sqrt(3) / 2, color: 'i', rotulo: 'y = √3/2', desde: 1 }, { x: -0.5, color: 'd', desde: 2 }],
        rotulos: [nombreX(-0.5, 'x = −1/2', 'd', { desde: 2 })],
        puntos: [pto(60, { color: 'i', abierto: true, rotulo: undefined, desde: 1 }), pto(120, { color: 'i', abierto: true, desde: 1, hasta: 2 }), pto(240, { color: 'd', abierto: true, desde: 2 }), pto(120, { desde: 3 })],
        alt: 'Soluciones de la primera ecuación, 60 y 120 grados; de la segunda, 120 y 240 grados; en común, 120 grados',
      }),
      voz: 'Dos listas; la respuesta es lo que comparten.',
      pasos: [
        { estado: { corte: 1 }, texto: 'La primera ecuación da 60° y 120°.', ecuacion: [{ sub: ['S', '1'] }, ' = {60°, 120°}'] },
        { estado: { corte: 2 }, texto: 'La segunda ecuación da 120° y 240°.', ecuacion: [{ sub: ['S', '2'] }, ' = {120°, 240°}'] },
        { estado: { corte: 3 }, texto: 'El sistema se queda con lo que está en las dos listas.', ecuacion: [{ sub: ['S', '1'] }, ' ∩ ', { sub: ['S', '2'] }, ' = {120°}'] },
      ],
    },
    regla: {
      texto: 'Un sistema pide que se cumplan todas sus ecuaciones a la vez. Su conjunto solución es la intersección de los conjuntos de cada ecuación.',
      ecuacion: ['S = ', { llave: [{ sub: ['S', '1'] }], nota: 'ecuación 1', color: 'c-i' }, ' ∩ ', { llave: [{ sub: ['S', '2'] }], nota: 'ecuación 2', color: 'c-d' }],
      condicion: 'los dos conjuntos se calculan en el mismo intervalo. Si no comparten ningún ángulo, el sistema no tiene solución.',
      voz: 'La unión junta; el sistema exige las dos.',
    },
    ahoraTu: {
      voz: 'Resuelve cada ecuación por separado y compara.',
      generar(sem) {
        const rr = azar(sem), par = [['sen', 'cos'], ['sen', 'tan'], ['cos', 'tan']][sem % 3];
        const t0 = rr.uno([30, 45, 60, 120, 135, 150, 210, 225, 240, 300, 315, 330]);
        const incompatible = rr.ent(0, 4) === 0;
        const t1 = incompatible ? rr.uno([30, 45, 60, 120, 135, 150, 210, 225, 240, 300, 315, 330].filter(g => soluciones(par[1], FN[par[1]](g)).every(h => !soluciones(par[0], FN[par[0]](t0)).includes(h)))) : t0;
        const v1 = FN[par[0]](t0), v2 = FN[par[1]](t1);
        const S1 = soluciones(par[0], v1), S2 = soluciones(par[1], v2), S = S1.filter(g => S2.includes(g));
        const union = orden([...S1, ...S2]);
        return {
          pregunta: ['Sistema en [0°, 360°): ', `${fnTxt[par[0]]} `, th, ` = ${kTxt(v1)} y ${fnTxt[par[1]]} `, th, ` = ${kTxt(v2)}. ¿Qué ángulos cumplen las dos?`],
          opciones: opciones(S, [
            { id: 'union', valor: union, error: 'ECU-SIS-UNION', siFuera: 'Esa es la unión: cada ángulo cumple alguna. El sistema pide las dos a la vez.' },
            { id: 'primera', valor: S1, error: 'ECU-SIS-PRIMERA', siFuera: 'Esas resuelven la primera ecuación. Falta revisar la segunda.' },
            { id: 'segunda', valor: S2, error: 'ECU-SIS-PRIMERA', siFuera: 'Esas resuelven la segunda ecuación. Falta revisar la primera.' },
            { id: 'vacio', valor: S.length ? [] : null, error: 'ECU-SIS-VACIO', siFuera: 'Sería cierto si las listas no compartieran ángulos. Compara las dos otra vez.' },
          ], xs => (xs.length ? lista(xs) : 'Ninguno')),
          solucion: {
            texto: S.length ? 'Se queda el ángulo que está en las dos listas.' : 'Las dos listas no comparten ningún ángulo.',
            ecuacion: [{ sub: ['S', '1'] }, ` = {${S1.map(g => g + '°').join(', ')}}`, '   ·   ', { sub: ['S', '2'] }, ` = {${S2.map(g => g + '°').join(', ')}}`, '   ·   ', `S = ${S.length ? '{' + S.map(g => g + '°').join(', ') + '}' : '∅'}`],
          },
        };
      },
    },
  };

  // ---------- Laboratorio: figuras propias de las mesas ----------
  // Soluciones en una vuelta [0°, 360°), con decimales (las de `soluciones` son enteras): sen, cos o tan θ = v.
  function vuelta(fn, v) {
    if (fn === 'tan') { const a = deg(Math.atan(v)); return orden([mod360(a), mod360(a + 180)]); }
    if (Math.abs(v) > 1 + 1e-12) return [];
    const a = deg(fn === 'sen' ? Math.asin(Math.max(-1, Math.min(1, v))) : Math.acos(Math.max(-1, Math.min(1, v))));
    return orden((fn === 'sen' ? [a, 180 - a] : [a, -a]).map(x => mod360(Math.round(x * 1e6) / 1e6)));
  }
  // Mesa 1: las tres funciones con k de −2 a 2 en una ventana más grande.
  const VL = { x: [-2.3, 2.3], y: [-2.2, 2.2] };
  const mesaTres = (fn, v) => {
    const sols = vuelta(fn, v);
    return plano({
      ventana: VL,
      rectas: [fn === 'sen' ? { y: v, color: 'i' } : { x: fn === 'cos' ? v : 1, color: 'i' }],
      segmentos: fn === 'tan' ? [{ de: [-Math.cos(Math.atan(v)) * 1.6, -Math.sin(Math.atan(v)) * 1.6], a: [Math.cos(Math.atan(v)) * 1.6, Math.sin(Math.atan(v)) * 1.6], discontinua: true }] : [],
      rayos: sols.map(g => rayo(g)),
      puntos: [...sols.map(g => pto(g)), ...(fn === 'tan' ? [{ x: 1, y: v, color: 'i' }] : [])],
      rotulos: sols.length ? [] : [{ x: 0, y: -1.55, texto: 'no corta: sin solución', color: 'i' }],
      alt: `${fnTxt[fn]} θ = ${kTxt(v)}: ${sols.length} soluciones en una vuelta`,
    });
  };
  const manijaTres = (fn, v) => (fn === 'sen' ? TP().enPx(mesaTres(fn, v), 2.1, v) : fn === 'cos' ? TP().enPx(mesaTres(fn, v), v, -1.95) : TP().enPx(mesaTres(fn, v), 1, v));
  // Mesa 2: la franja [0°, b] sobre la gráfica de sen o cos, con k libre: los cortes se cuentan solos.
  const curvaCos = { puntos: Array.from({ length: 145 }, (_, i) => [i * 5, Math.cos(rad(i * 5))]), color: 'o' };
  const enFranja = (fn, v, b) => [0, 360].flatMap(o => vuelta(fn, v).map(g => g + o)).filter(g => g <= b + 1e-9);
  const mesaFranja = (fn, v, b) => {
    const todos = [0, 360].flatMap(o => vuelta(fn, v).map(g => g + o)), s = enFranja(fn, v, b);
    if (Math.abs(v) <= 1 + 1e-12 && fn === 'cos' && Math.abs(v - 1) < 1e-9) todos.push(720);   // cos 720° = 1
    return grafica(b, v, todos.map(g => ({ x: g, y: v, color: 'o', abierto: !(g <= b + 1e-9) })), {
      curvas: [fn === 'sen' ? curvaSen : curvaCos, { puntos: [[0, v], [720, v]], color: 'i', discontinua: true }],
      alt: `Gráfica de ${fnTxt[fn]} θ, la recta y = ${kTxt(v)} y el intervalo [0°, ${f(b)}°]: ${s.length} cortes dentro`,
    });
  };
  const cuentaFranja = (fn, v, b) => enFranja(fn, v, b).length + (fn === 'cos' && Math.abs(v - 1) < 1e-9 && b >= 720 ? 1 : 0);
  // Mesa 3: sen θ · (cos θ − c) = 0 con c de −1,5 a 1,5: el segundo factor puede no aportar o repetir un ángulo.
  const mesaFactor = cv => {
    const s1 = [0, 180], s2 = vuelta('cos', cv), todo = orden([...s1, ...s2]);
    return plano({
      ventana: { x: [-1.8, 1.8], y: [-1.3, 1.3] },
      rectas: [{ y: 0, color: 'i' }, { x: cv, color: 'd' }],
      rotulos: [Object.assign(nombreX(cv, `x = ${kTxt(cv)}`, 'd'), cv > 0.9 ? { x: cv - 0.07, ancla: 'end' } : {})],
      puntos: [...s1.map(g => pto(g, { color: 'i', rotulo: undefined })), ...s2.map(g => pto(g, { color: 'd', rotulo: s1.includes(g) ? `${f(g)}°: repetido` : `${f(g, 1)}°` }))],
      alt: `Cortes de y = 0 y de x = ${kTxt(cv)}: ${todo.length} soluciones distintas`,
    });
  };

  return {
    unidad: 'trigonometria.ecuaciones-trigonometricas',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/trig-plano.js', '/nucleo/kit/piezas/ejes.js'],
    // Laboratorio (docs/teoria.md §4b): tres mesas sin preguntas. La primera compara seno, coseno y tangente con k de
    // −2 a 2 (la tangente siempre corta dos veces; seno y coseno, no). La segunda junta la función, la recta y el
    // final del intervalo en dos vueltas, con k = ±1 y 0 incluidos. La tercera abre c más allá de 1 en el producto
    // sen θ · (cos θ − c) = 0: el segundo factor deja de aportar, o repite un ángulo con c = ±1.
    laboratorio: [
      {
        id: 'tres-funciones', titulo: 'Seno, coseno y tangente', pieza: 'trig-plano',
        consigna: 'Elige la función y mueve k entre −2 y 2. Cuenta los cortes de cada vuelta: la tangente se comporta distinto.',
        controles: [
          { id: 'fn', etiqueta: 'Función', opciones: [{ valor: 'sen', texto: 'sen' }, { valor: 'cos', texto: 'cos' }, { valor: 'tan', texto: 'tan' }], inicio: 'sen' },
          { id: 'k', etiqueta: 'k', color: 'c-i', min: -2, max: 2, paso: 0.1, inicio: 1.2, decimales: 1 },
        ],
        dibujo: val => ({ datos: mesaTres(val.fn, val.k), estado: {} }),
        lectura: val => {
          const s = vuelta(val.fn, val.k);
          return [`${fnTxt[val.fn]} `, th, ` = ${kTxt(val.k)}: `, s.length ? [th, ` = ${s.map(g => f(g, 1) + '°').join(' o ')}`] : 'sin solución'].flat();
        },
        arrastres: [{ id: 'valor-k', etiqueta: 'valor k en la figura', color: 'c-i',
          donde: val => manijaTres(val.fn, val.k),
          mover: (pt, val) => { const q = TP().delPx(mesaTres(val.fn, val.k), pt); return { k: val.fn === 'cos' ? q.x : q.y }; } }],
      },
      {
        id: 'franja-libre', titulo: 'La franja y la recta', pieza: 'ejes',
        consigna: 'Elige seno o coseno, sube o baja la recta y corre el final b. Prueba k = 1, k = 0 y b justo sobre un corte.',
        controles: [
          { id: 'fn', etiqueta: 'Función', opciones: [{ valor: 'sen', texto: 'sen' }, { valor: 'cos', texto: 'cos' }], inicio: 'cos' },
          { id: 'k', etiqueta: 'k', color: 'c-i', min: -1, max: 1, paso: 0.25, inicio: 0.5, decimales: 2 },
          { id: 'b', etiqueta: 'b', color: 'c-d', min: 30, max: 720, paso: 30, inicio: 300, unidad: '°', decimales: 0 },
        ],
        dibujo: val => ({ datos: mesaFranja(val.fn, val.k, val.b), estado: {} }),
        lectura: val => {
          const m = cuentaFranja(val.fn, val.k, val.b);
          return [`${fnTxt[val.fn]} `, th, ` = ${kTxt(val.k)} en [0°, ${f(val.b)}°]: ${m} ${m === 1 ? 'solución' : 'soluciones'}`];
        },
        arrastres: [
          { id: 'borde-b', etiqueta: 'final b del intervalo', color: 'c-d',
            donde: val => { const G = EJES().geometria(mesaFranja(val.fn, val.k, val.b)); return { x: G.X(val.b), y: G.Y(-0.95) }; },
            mover: (pt, val) => ({ b: xDeEjes(mesaFranja(val.fn, val.k, val.b), pt.x) }) },
          { id: 'recta-k', etiqueta: 'recta y = k', color: 'c-i',
            donde: val => { const G = EJES().geometria(mesaFranja(val.fn, val.k, val.b)); return { x: G.X(705), y: G.Y(val.k) }; },
            mover: (pt, val) => ({ k: yDeEjes(mesaFranja(val.fn, val.k, val.b), pt.y) }) },
        ],
      },
      {
        id: 'factor-fuera', titulo: 'Un factor que no aporta', pieza: 'trig-plano',
        consigna: 'Ecuación: sen θ · (cos θ − c) = 0. Lleva c más allá de 1 y también justo a 1 o −1.',
        controles: [{ id: 'c', etiqueta: 'c', color: 'c-d', min: -1.5, max: 1.5, paso: 0.1, inicio: 1.2, decimales: 1 }],
        dibujo: val => ({ datos: mesaFactor(val.c), estado: {} }),
        lectura: val => {
          const m = orden([0, 180, ...vuelta('cos', val.c)]).length;
          return [c, ` = ${kTxt(val.c)}: ${m} soluciones distintas`];
        },
        arrastres: [{ id: 'recta-c', etiqueta: 'recta x = c', color: 'c-d',
          donde: val => TP().enPx(mesaFactor(val.c), val.c, 0),
          mover: (pt, val) => ({ c: TP().delPx(mesaFactor(val.c), pt).x }) }],
      },
    ],
    historia: {
      texto: 'En 1593, Adriaan van Roomen desafió a los matemáticos con una ecuación de grado cuarenta y cinco. François Viète vio que escondía una relación entre un ángulo y su múltiplo, y en 1595 publicó sus soluciones. Mirar la ecuación como un problema de ángulos le mostró soluciones que el álgebra sola ocultaba.',
      pregunta: '¿Cuántas soluciones puede ocultar una sola ecuación?',
      fuente: { titulo: 'J. J. O’Connor y E. F. Robertson, «François Viète», MacTutor, University of St Andrews', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Viete/' },
    },
    ideas: [cuantas, familias, extremos, factores, sistemas],
  };
});
