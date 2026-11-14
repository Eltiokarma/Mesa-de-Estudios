/*
 * Teoría de «Funciones trigonométricas inversas» (trigonometria.funciones-trigonometricas-inversas), 5.º de secundaria.
 * Fuente del contenido: docs/teoria/matriz/trigonometria.json (unidad 14), la precisión (5) «una inversa exige una
 * rama» de docs/teoria/fuentes/teoria-152-unidades.txt y la historia de la matriz (notaciones de Euler, Lagrange y
 * Herschel). Forma: contenido/teoria/trigonometria/angulo-trigonometrico.js.
 * Convención de ramas (la misma de plantillas/funciones-trig-inversas/motor.js): arcsen [−90°, 90°], arccos [0°, 180°],
 * arctan (−90°, 90°), arccot (0°, 180°), arcsec k = arccos(1/k) en [0°, 180°] sin 90°, arccsc k = arcsen(1/k) en
 * [−90°, 90°] sin 0°. Se declara al alumno en la regla de la idea 5.
 * Compañera: Mara (coneja), cercana y rigurosa: la calculadora devuelve el ángulo de la rama, no cualquier ángulo.
 * Colores (regla 4): el ángulo que devuelve la inversa, θ, en naranja (c-o); el valor de entrada k (la razón) en
 * turquesa (c-i); la rama (el rango) en verde (c-d); el ángulo x que entra a una composición en rojo (c-h).
 * Errores: IN1 a IN29 de plantillas/funciones-trig-inversas/motor.js (hipótesis; anexo de
 * docs/investigacion/trigonometria-ideas-erroneas.md). Nuevos (hipótesis): INV-RANGO (cree que arcsen acepta |k| > 1).
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: una inversa devuelve un solo ángulo, el de su rama; fuera de la rama, función e inversa no se cancelan.
 *   Persona y condiciones: postulante de 5.º, celular de 360 px de gama baja, con o sin conexión, en el aula o en casa.
 *   Resultado observable: evalúa arcsen, arccos, arctan, arccot, arcsec y arccsc, y compone sin cancelar a ciegas.
 *   Orden de atención: 1.º la rama verde · 2.º el corte que cae en ella · acción: mover k o x · fondo: la circunferencia.
 *   Estados: juego sin tocar · probando · predicción pendiente · coincide / no coincide · paso de «Mira» · caso nuevo.
 *   Duda que resuelve: ¿por qué arcsen(sen 150°) da 30° y no 150°, y por qué sen⁻¹ x no es 1/sen x?
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (x, d = 2) => Kit.formatear(x, d);
  const th = { v: 'c-o', t: 'θ' }, k = { v: 'c-i', t: 'k' }, x = { v: 'c-h', t: 'x' };
  const rad = g => g * Math.PI / 180, deg = r => r * 180 / Math.PI;
  const mod360 = a => ((a % 360) + 360) % 360;
  const NOTABLES = [[0, '0'], [0.5, '1/2'], [Math.SQRT2 / 2, '√2/2'], [Math.sqrt(3) / 2, '√3/2'], [1, '1'], [Math.sqrt(3) / 3, '√3/3'], [Math.sqrt(3), '√3'], [2, '2'], [Math.SQRT2, '√2'], [2 * Math.sqrt(3) / 3, '2√3/3'], [1.5, '1,5']];
  function kTxt(v) {
    const e = NOTABLES.find(([a]) => Math.abs(Math.abs(v) - a) < 1e-9);
    return e ? `${v < 0 && e[0] ? '−' : ''}${e[1]}` : f(v, 2);
  }
  const g = a => `${f(Math.round(a * 10) / 10, 1)}°`;
  // Las seis inversas con la convención declarada en el encabezado (en grados).
  const ARC = {
    sen: v => (Math.abs(v) <= 1 + 1e-12 ? deg(Math.asin(Math.max(-1, Math.min(1, v)))) : NaN),
    cos: v => (Math.abs(v) <= 1 + 1e-12 ? deg(Math.acos(Math.max(-1, Math.min(1, v)))) : NaN),
    tan: v => deg(Math.atan(v)),
    cot: v => (v === 0 ? 90 : mod360(deg(Math.atan(1 / v))) % 180),
    sec: v => (Math.abs(v) >= 1 ? deg(Math.acos(1 / v)) : NaN),
    csc: v => (Math.abs(v) >= 1 ? deg(Math.asin(1 / v)) : NaN),
  };
  const FN = { sen: a => Math.sin(rad(a)), cos: a => Math.cos(rad(a)), tan: a => Math.tan(rad(a)) };
  const redondo = a => Math.round(a * 1e6) / 1e6;
  function azar(sem) {
    let q = (sem * 2654435761 + 12345) >>> 0;
    const rr = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    rr.ent = (lo, hi) => lo + Math.floor(rr() * (hi - lo + 1));
    rr.uno = xs => xs[Math.floor(rr() * xs.length)];
    return rr;
  }
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
  const lado = (px, py) => (px >= -1e-9 ? (py > 1e-9 ? 'ne' : 'se') : (py > 1e-9 ? 'no' : 'so'));
  const pto = (a, extra = {}) => {
    const px = Math.cos(rad(a)), py = Math.sin(rad(a));
    return Object.assign({ x: px, y: py, color: 'o', lado: lado(px, py) }, extra);
  };
  const plano = extra => Object.assign({ ventana: { x: [-1.7, 1.7], y: [-1.3, 1.3] }, circulos: [{ r: 1 }] }, extra);
  // La rama: medio círculo verde y grueso; con `abierta`, sus extremos son huecos (no se alcanzan).
  const RAMAS = { sen: [-90, 90], cos: [0, 180], tan: [-90, 90], cot: [0, 180], sec: [0, 180], csc: [-90, 90] };
  const rama = (fn, extra = {}) => {
    const [a, b] = RAMAS[fn];
    const abierta = fn === 'tan' || fn === 'cot';
    const huecos = { tan: [-90, 90], cot: [0, 180], sec: [90], csc: [0] }[fn] || [];
    return {
      arcos: [Object.assign({ de: a, a: b, r: 1, espiral: 0, flecha: false, color: 'd', grosor: 'variable' }, extra)],
      huecos: huecos.map(h => pto(h, Object.assign({ color: 'd', abierto: true }, extra))),
      abierta,
    };
  };
  const nombreX = (cv, texto, color, extra = {}) => Object.assign({ x: cv + 0.07, y: cv > 0.15 ? 1.2 : -1.2, texto, color, ancla: 'start' }, extra);
  const nombreFn = { sen: 'arcsen', cos: 'arccos', tan: 'arctan', cot: 'arccot', sec: 'arcsec', csc: 'arccsc' };

  // Figura de una inversa: la rama, lo que fija el valor k (recta, o punto en x = 1 o y = 1) y el ángulo θ.
  function figura(fn, v, extra = {}) {
    const t = ARC[fn](v), R = rama(fn);
    const d = { rectas: [], rotulos: [], segmentos: [], puntos: [...R.huecos] };
    if (fn === 'sen' || fn === 'csc') {
      const y = fn === 'sen' ? v : 1 / v;
      d.rectas.push({ y, color: 'i' });
      d.puntos.push(pto(180 - t, { color: undefined, abierto: true }));
    } else if (fn === 'cos' || fn === 'sec') {
      const cx = fn === 'cos' ? v : 1 / v;
      d.rectas.push({ x: cx, color: 'i' });
      d.rotulos.push(nombreX(cx, `x = ${kTxt(cx)}`, 'i'));
      d.puntos.push(pto(-t, { color: undefined, abierto: true }));
    } else if (fn === 'tan') {
      d.rectas.push({ x: 1, color: 'i' });
      d.puntos.push({ x: 1, y: v, color: 'i', rotulo: `(1; ${kTxt(v)})`, lado: 'e' });
      d.segmentos.push({ de: [0, 0], a: [1, v], color: 'o', discontinua: true, grosor: 'contorno' });
    } else {
      d.rectas.push({ y: 1, color: 'i' });
      d.puntos.push({ x: v, y: 1, color: 'i', rotulo: `(${kTxt(v)}; 1)`, lado: 'n' });
      d.segmentos.push({ de: [0, 0], a: [v, 1], color: 'o', discontinua: true, grosor: 'contorno' });
    }
    return plano(Object.assign({
      // Con tan y cot el punto (1; k) o (k; 1) ya lleva rótulo: el ángulo se rotula en su arco.
      arcos: [...R.arcos, { de: 0, a: t, r: 0.32, color: 'o', espiral: 0, rotulo: fn === 'tan' || fn === 'cot' ? g(t) : undefined }],
      rayos: [{ ang: t, color: 'o' }],
      puntos: [...d.puntos, pto(t, { rotulo: fn === 'tan' || fn === 'cot' ? undefined : g(t) })],
      rectas: d.rectas, rotulos: d.rotulos, segmentos: d.segmentos,
      alt: `${nombreFn[fn]}(${kTxt(v)}) = ${g(t)}: el ángulo de la rama verde, entre ${RAMAS[fn][0]} y ${RAMAS[fn][1]} grados`,
    }, extra));
  }

  // ---------- Idea 1: una inversa exige una rama ----------
  // Cambia: el valor k entre 0 y 0,9. · Permanece: la circunferencia y la rama verde de −90° a 90°.
  // Progresa: el ángulo θ que sube por la rama. · Se reserva: un k negativo (la predicción).
  // Debe verse: de los dos cortes con altura k, arcsen devuelve solo el que está en la rama.
  const ramaSeno = {
    id: 'rama-arcoseno',
    titulo: 'Una inversa elige una rama',
    temas: ['Arco seno, arco coseno y arco tangente', 'Dominio, rango y gráfica'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Mueve k. La recta y = k corta la circunferencia en dos puntos; arcsen k devuelve solo el que está en la rama verde.',
      voz: 'La calculadora muestra un valor principal: el de la rama.',
      controles: [{ id: 'k', etiqueta: 'k', color: 'c-i', min: 0, max: 0.9, paso: 0.1, inicio: 0.5, decimales: 1 }],
      dibujo: val => ({ datos: figura('sen', val.k), estado: {} }),
      lectura: val => ['arcsen ', k, ` = arcsen(${f(val.k, 1)}) = `, th, ` = ${g(ARC.sen(val.k))}`],
      minimo: 3,
    },
    predice: {
      pregunta: ['¿Cuánto vale arcsen(−1/2)?'],
      voz: 'Ubica la recta y = −1/2 y busca el corte de la rama.',
      opciones: [
        { id: 'c', texto: '−30°', correcta: true },
        { id: 'vuelta', texto: '330°', error: 'IN4', siFuera: '330° tiene seno −1/2, y es −30° más una vuelta. Pero no está en la rama.' },
        { id: 'otro', texto: '210°', error: 'IN1', siFuera: '210° también tiene seno −1/2. La rama de arcsen va de −90° a 90°.' },
        { id: 'signo', texto: '30°', error: 'IN29', siFuera: 'El ángulo de referencia 30° está bien. Con seno negativo, el corte de la rama queda abajo.' },
      ],
      dibujo: { datos: plano({ arcos: rama('sen').arcos, rectas: [{ y: -0.5, color: 'i' }], alt: 'La rama verde de arcsen y la recta y = −1/2' }), estado: {} },
      revelar: { datos: figura('sen', -0.5), estado: {} },
      coincide: 'Coincide: el corte de la rama está abajo, en −30°.',
      noCoincide: 'Revisemos qué corte está en la rama verde: es el de −30°.',
    },
    mira: {
      datos: plano({
        arcos: [...rama('sen').arcos.map(a => Object.assign({}, a, { desde: 1 })), { de: 0, a: -30, r: 0.32, color: 'o', espiral: 0, desde: 3 }],
        rectas: [{ y: -0.5, color: 'i', desde: 2 }],
        puntos: [pto(210, { color: undefined, abierto: true, rotulo: '210°', desde: 2 }), pto(-30, { abierto: true, color: undefined, desde: 2, hasta: 2 }), pto(-30, { rotulo: '−30°', desde: 3 })],
        rayos: [{ ang: -30, color: 'o', desde: 3 }],
        alt: 'La rama de −90 a 90 grados; la recta y = −1/2 la corta en −30 grados; el otro corte, 210 grados, queda fuera',
      }),
      voz: 'Primero la rama; después, el único corte que cae en ella.',
      pasos: [
        { estado: { corte: 1 }, texto: 'arcsen solo mira la mitad derecha: de −90° a 90°.', ecuacion: ['−90° ≤ ', th, ' ≤ 90°'] },
        { estado: { corte: 2 }, texto: 'La recta y = −1/2 corta en dos puntos.', ecuacion: ['sen ', th, ' = −1/2'] },
        { estado: { corte: 3 }, texto: 'En la rama queda uno solo: −30°.', ecuacion: ['arcsen(−1/2) = ', th, ' = −30°'] },
      ],
    },
    regla: {
      texto: 'El seno repite valores, así que su inversa se queda con una rama: arcsen k es el único ángulo entre −90° y 90° cuyo seno es k.',
      ecuacion: ['arcsen: [−1, 1] → [−90°, 90°];   arcsen(−', k, ') = −arcsen ', k],
      condicion: '−1 ≤ k ≤ 1. Fuera de ese intervalo, arcsen k no existe: ningún seno pasa de 1.',
      voz: 'Una entrada, un solo ángulo: el de la rama.',
    },
    ahoraTu: {
      pieza: 'trig-plano',
      voz: 'Busca el corte que cae en la rama.',
      generar(sem) {
        const rr = azar(sem), v = rr.uno([0.5, -0.5, Math.SQRT2 / 2, -Math.SQRT2 / 2, Math.sqrt(3) / 2, -Math.sqrt(3) / 2, 1, -1, 0, 2, -1.5]);
        const fuera = Math.abs(v) > 1, t = fuera ? NaN : redondo(ARC.sen(v));
        const fmt = a => (typeof a === 'string' ? a : g(a));
        const ops = fuera ? opciones('No existe', [
          { id: 'rango', valor: 90 * Math.sign(v), error: 'INV-RANGO', siFuera: '±90° es el extremo de la rama, con seno ±1. Ningún ángulo tiene seno mayor que 1.' },
          { id: 'inv', valor: redondo(deg(Math.asin(1 / v))), error: 'IN6', siFuera: 'Eso usa 1/k. arcsen pide un ángulo cuyo seno sea k, y no lo hay.' },
        ], fmt) : opciones(t, [
          { id: 'otro', valor: redondo(180 - t), error: 'IN1', siFuera: 'Ese ángulo tiene el mismo seno, pero está fuera de la rama de −90° a 90°.' },
          { id: 'vuelta', valor: t < 0 ? t + 360 : null, error: 'IN4', siFuera: 'Es el mismo lado con una vuelta más, y está fuera de la rama.' },
          { id: 'cos', valor: redondo(90 - t), error: 'IN7', siFuera: 'Ese es el arccos del mismo valor: el ángulo complementario.' },
          { id: 'signo', valor: -t, error: 'IN29', siFuera: 'El ángulo de referencia está bien. El signo de arcsen es el mismo que el de k.' },
        ], fmt);
        return {
          pregunta: ['¿Cuánto vale arcsen ', k, ` = arcsen(${kTxt(v)})?`],
          opciones: ops,
          solucion: fuera
            ? { texto: 'La recta queda fuera de la circunferencia: no hay ángulo.', ecuacion: [`${kTxt(v)} no está en [−1, 1]`] }
            : { texto: 'Se toma el corte que cae en la rama verde.', ecuacion: [`arcsen(${kTxt(v)}) = `, th, ` = ${g(t)}`], dibujo: { datos: figura('sen', v), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 2: cada inversa tiene su rama ----------
  // Cambia: la función (arcsen, arccos, arctan) y k entre 0 y 0,8. · Permanece: la circunferencia.
  // Progresa: la rama verde, que cambia de lugar según la función. · Se reserva: arccos de un número negativo (la
  // predicción). · Debe verse: la rama de arccos es la mitad de arriba; la de arctan, la derecha sin sus extremos.
  const tres = {
    id: 'tres-ramas',
    titulo: 'Cada inversa, su rama',
    temas: ['Arco seno, arco coseno y arco tangente', 'Dominio, rango y gráfica'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Elige la inversa y mueve k. Mira dónde queda la rama verde de cada una y qué corte devuelve.',
      voz: 'Antes del número, ubica la rama.',
      controles: [
        { id: 'fn', etiqueta: 'Inversa', opciones: [{ valor: 'sen', texto: 'arcsen' }, { valor: 'cos', texto: 'arccos' }, { valor: 'tan', texto: 'arctan' }], inicio: 'cos' },
        { id: 'k', etiqueta: 'k', color: 'c-i', min: 0, max: 0.8, paso: 0.2, inicio: 0.4, decimales: 1 },
      ],
      dibujo: val => ({ datos: figura(val.fn, val.k), estado: {} }),
      lectura: val => [`${nombreFn[val.fn]} `, k, ` = ${nombreFn[val.fn]}(${f(val.k, 1)}) = `, th, ` = ${g(ARC[val.fn](val.k))}`],
      minimo: 3,
    },
    predice: {
      pregunta: ['¿Cuánto vale arccos(−1/2)?'],
      voz: 'Ubica la recta x = −1/2 y la rama de arccos.',
      opciones: [
        { id: 'c', texto: '120°', correcta: true },
        { id: 'menos', texto: '−60°', error: 'IN2', siFuera: 'Con arcsen sí basta cambiar el signo. La rama de arccos no tiene ángulos negativos.' },
        { id: 'otro', texto: '240°', error: 'IN1', siFuera: '240° también tiene coseno −1/2. La rama de arccos va de 0° a 180°.' },
        { id: 'ref', texto: '60°', error: 'IN29', siFuera: '60° es el ángulo de referencia. Con coseno negativo, el punto queda a la izquierda.' },
      ],
      dibujo: { datos: plano({ arcos: rama('cos').arcos, rectas: [{ x: -0.5, color: 'i' }], rotulos: [nombreX(-0.5, 'x = −1/2', 'i')], alt: 'La rama de arccos, de 0 a 180 grados, y la recta x = −1/2' }), estado: {} },
      revelar: { datos: figura('cos', -0.5), estado: {} },
      coincide: 'Coincide: la recta x = −1/2 corta la rama de arriba en 120°.',
      noCoincide: 'Revisemos la rama de arriba: el corte está en 120°.',
    },
    mira: {
      datos: plano({
        arcos: [...rama('cos').arcos.map(a => Object.assign({}, a, { desde: 1 })), { de: 0, a: 120, r: 0.32, color: 'o', espiral: 0, desde: 3 }],
        rectas: [{ x: -0.5, color: 'i', desde: 2 }],
        rotulos: [nombreX(-0.5, 'x = −1/2', 'i', { desde: 2 })],
        puntos: [pto(240, { color: undefined, abierto: true, rotulo: '240°', desde: 2 }), pto(120, { rotulo: '120°', desde: 3 }), pto(60, { color: undefined, abierto: true, rotulo: '60°', desde: 4 })],
        rayos: [{ ang: 120, color: 'o', desde: 3 }],
        alt: 'La rama de arccos es la mitad de arriba; x = −1/2 la corta en 120 grados, simétrico de 60 grados',
      }),
      voz: 'El coseno es la x del punto; la rama es la mitad de arriba.',
      pasos: [
        { estado: { corte: 1 }, texto: 'arccos usa la mitad de arriba: de 0° a 180°.', ecuacion: ['0° ≤ ', th, ' ≤ 180°'] },
        { estado: { corte: 2 }, texto: 'El coseno es la x del punto: recta x = −1/2.', ecuacion: ['cos ', th, ' = −1/2'] },
        { estado: { corte: 3 }, texto: 'En la rama de arriba queda un solo corte: 120°.', ecuacion: ['arccos(−1/2) = ', th, ' = 120°'] },
        { estado: { corte: 4 }, texto: 'Es el simétrico de 60°: se resta de 180°.', ecuacion: ['arccos(−', k, ') = 180° − arccos ', k] },
      ],
    },
    regla: {
      texto: 'Cada inversa devuelve un ángulo de su rama: arccos, de 0° a 180°; arctan, entre −90° y 90° sin llegar a ellos.',
      ecuacion: ['arccos(−', k, ') = 180° − arccos ', k, ';   arctan(−', k, ') = −arctan ', k],
      condicion: 'arccos pide −1 ≤ k ≤ 1. arctan acepta cualquier k, pero nunca devuelve ±90°.',
      voz: 'Con arccos, el signo de k no pasa al ángulo.',
    },
    ahoraTu: {
      pieza: 'trig-plano',
      voz: 'Primero la rama de la función que piden.',
      generar(sem) {
        const rr = azar(sem), fn = sem % 2 ? 'tan' : 'cos';
        const v = fn === 'cos' ? rr.uno([0.5, -0.5, Math.SQRT2 / 2, -Math.SQRT2 / 2, Math.sqrt(3) / 2, -Math.sqrt(3) / 2, -1, 0])
          : rr.uno([1, -1, Math.sqrt(3), -Math.sqrt(3), Math.sqrt(3) / 3, -Math.sqrt(3) / 3]);
        const t = redondo(ARC[fn](v)), ref = redondo(ARC[fn](Math.abs(v)));
        const ds = fn === 'cos' ? [
          { id: 'menos', valor: v < 0 ? -ref : null, error: 'IN2', siFuera: 'Esa es la regla del arcsen. La rama de arccos va de 0° a 180°: no hay negativos.' },
          { id: 'otro', valor: t ? 360 - t : null, error: 'IN1', siFuera: 'Ese ángulo tiene el mismo coseno, pero está fuera de la rama de 0° a 180°.' },
          { id: 'sen', valor: redondo(90 - t), error: 'IN7', siFuera: 'Ese es el arcsen del mismo valor: el ángulo complementario.' },
          { id: 'ref', valor: v < 0 ? ref : null, error: 'IN29', siFuera: 'Es el ángulo de referencia. Con coseno negativo, el punto queda a la izquierda.' },
        ] : [
          { id: 'otro', valor: t + 180, error: 'IN1', siFuera: 'Ese ángulo tiene la misma tangente, pero está fuera de la rama entre −90° y 90°.' },
          { id: 'vuelta', valor: t < 0 ? t + 360 : null, error: 'IN4', siFuera: 'Es el mismo lado con una vuelta más, fuera de la rama.' },
          { id: 'cot', valor: redondo(90 - t), error: 'IN26', siFuera: 'Ese es el arccot del mismo valor, no el arctan.' },
          { id: 'signo', valor: -t, error: 'IN29', siFuera: 'El ángulo de referencia está bien. arctan conserva el signo de k.' },
        ];
        return {
          pregunta: [`¿Cuánto vale ${nombreFn[fn]} `, k, ` = ${nombreFn[fn]}(${kTxt(v)})?`],
          opciones: opciones(t, ds, a => g(a)),
          solucion: {
            texto: fn === 'cos' ? 'Es el corte de la recta x = k con la mitad de arriba.' : 'Es el ángulo del rayo que pasa por (1, k), en la mitad derecha.',
            ecuacion: [`${nombreFn[fn]}(${kTxt(v)}) = `, th, ` = ${g(t)}`],
            dibujo: { datos: figura(fn, v, fn === 'tan' && Math.abs(v) > 1.2 ? { ventana: { x: [-2.4, 2.4], y: [-2, 2] } } : {}), estado: {} },
          },
        };
      },
    },
  };

  // ---------- Idea 3: componer sin cancelar a ciegas ----------
  // Cambia: el ángulo x que entra, de −90° a 270°. · Permanece: la rama verde de arcsen.
  // Progresa: el punto x, que sale de la rama y su seno vuelve a ella. · Se reserva: arccos(cos x) con x fuera de
  // su rama (la predicción). · Debe verse: arcsen(sen x) = x solo mientras x está en la rama.
  const compSen = xv => {
    const t = ARC.sen(Math.sin(rad(xv)));
    const dentro = Math.abs(redondo(t) - redondo(xv)) < 1e-6;
    return plano({
      arcos: [...rama('sen').arcos, { de: 0, a: xv, r: 0.55, color: 'h', espiral: 6 }],
      rectas: [{ y: Math.sin(rad(xv)), color: 'i' }],
      rayos: [{ ang: xv, color: 'h' }, ...(dentro ? [] : [{ ang: t, color: 'o' }])],
      puntos: [pto(xv, { color: 'h', abierto: !dentro, rotulo: `x = ${g(xv)}` }), ...(dentro ? [] : [pto(t, { rotulo: g(t) })])],
      alt: `x = ${g(xv)}; su seno vuelve a la rama en ${g(t)}`,
    });
  };
  const componer = {
    id: 'componer',
    titulo: 'Componer sin cancelar a ciegas',
    temas: ['Propiedades'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Mueve el ángulo x. Se calcula sen x y después arcsen: el resultado naranja siempre cae en la rama verde, esté donde esté x.',
      voz: 'Mira qué pasa cuando x sale de la rama.',
      controles: [{ id: 'x', etiqueta: 'x', color: 'c-h', min: -90, max: 270, paso: 30, inicio: 60, unidad: '°', decimales: 0 }],
      dibujo: val => ({ datos: compSen(val.x), estado: {} }),
      lectura: val => ['arcsen(sen ', x, `) = arcsen(${kTxt(Math.sin(rad(val.x)))}) = ${g(ARC.sen(Math.sin(rad(val.x))))}`],
      minimo: 3,
    },
    predice: {
      pregunta: ['¿Cuánto vale arccos(cos 240°)?'],
      voz: 'Recuerda dónde está la rama de arccos.',
      opciones: [
        { id: 'c', texto: '120°', correcta: true },
        { id: 'cancela', texto: '240°', error: 'IN3', siFuera: 'Se cancelan si x está en la rama de arccos, de 0° a 180°. 240° está fuera.' },
        { id: 'menos', texto: '−120°', error: 'IN2', siFuera: '−120° tiene el mismo coseno, pero la rama de arccos no tiene negativos.' },
        { id: 'ref', texto: '60°', error: 'IN29', siFuera: '60° es el ángulo de referencia. cos 240° es negativo: el punto queda a la izquierda.' },
      ],
      dibujo: { datos: plano({ arcos: [...rama('cos').arcos, { de: 0, a: 240, r: 0.55, color: 'h' }], rayos: [{ ang: 240, color: 'h' }], puntos: [pto(240, { color: 'h', abierto: true, rotulo: 'x = 240°' })], alt: 'La rama de arccos y el ángulo de 240 grados, fuera de ella' }), estado: {} },
      revelar: { datos: plano({ arcos: [...rama('cos').arcos, { de: 0, a: 240, r: 0.55, color: 'h' }], rectas: [{ x: -0.5, color: 'i' }], rayos: [{ ang: 240, color: 'h' }, { ang: 120, color: 'o' }], puntos: [pto(240, { color: 'h', abierto: true, rotulo: 'x = 240°' }), pto(120, { rotulo: '120°' })], alt: 'cos 240° = −1/2; la recta x = −1/2 corta la rama de arccos en 120 grados' }), estado: {} },
      coincide: 'Coincide: cos 240° = −1/2, y la rama de arriba devuelve 120°.',
      noCoincide: 'Revisemos la rama de arriba: el corte de x = −1/2 está en 120°.',
    },
    mira: {
      datos: plano({
        arcos: [...rama('cos').arcos.map(a => Object.assign({}, a, { desde: 2 })), { de: 0, a: 240, r: 0.55, color: 'h', desde: 1 }],
        rectas: [{ x: -0.5, color: 'i', desde: 2 }],
        rotulos: [nombreX(-0.5, 'x = −1/2', 'i', { desde: 2 })],
        rayos: [{ ang: 240, color: 'h', desde: 1 }, { ang: 120, color: 'o', desde: 3 }],
        puntos: [pto(240, { color: 'h', abierto: true, rotulo: '240°', desde: 1 }), pto(120, { rotulo: '120°', desde: 3 })],
        alt: 'El ángulo 240 grados, su coseno −1/2 y el ángulo de la rama de arccos con ese coseno, 120 grados',
      }),
      voz: 'Primero la cuenta de adentro; después, la rama.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Primero se calcula lo de adentro.', ecuacion: ['cos 240° = −1/2'] },
        { estado: { corte: 2 }, texto: 'arccos busca el ángulo de la rama de arriba con ese coseno.', ecuacion: ['arccos(−1/2)'] },
        { estado: { corte: 3 }, texto: 'Es 120°: tiene el mismo coseno que 240°, y está en la rama.', ecuacion: ['arccos(cos 240°) = 120°'] },
      ],
    },
    regla: {
      texto: 'Una inversa compuesta con su función devuelve el ángulo de la rama que tiene la misma razón. Solo se cancelan si el ángulo ya estaba en la rama.',
      ecuacion: ['arcsen(sen ', x, ') = ', x, '  si −90° ≤ ', x, ' ≤ 90°;   arccos(cos ', x, ') = ', x, '  si 0° ≤ ', x, ' ≤ 180°'],
      condicion: 'al revés siempre se cancelan: sen(arcsen k) = k para todo k entre −1 y 1.',
      voz: 'Antes de tachar, pregunta si el ángulo está en la rama.',
    },
    ahoraTu: {
      voz: 'Calcula primero lo de adentro.',
      generar(sem) {
        const rr = azar(sem), fn = ['sen', 'cos', 'tan'][sem % 3];
        const xs = { sen: [120, 135, 150, 210, 240, 300, 330, 390, -150], cos: [210, 225, 240, 300, 315, 330, -60, -120, 390], tan: [120, 135, 150, 210, 240, 300, 330, -120, 225] }[fn];
        const xv = rr.uno(xs), t = redondo(ARC[fn](FN[fn](xv)));
        const otro = fn === 'sen' ? redondo(mod360(180 - t)) : fn === 'cos' ? redondo(mod360(-t)) : redondo(t + 180);
        return {
          pregunta: [`¿Cuánto vale ${nombreFn[fn]}(${fn} `, x, ') si ', x, ` = ${g(xv)}?`],
          opciones: opciones(t, [
            { id: 'cancela', valor: xv, error: 'IN3', siFuera: `Se cancelarían si ${xv}° estuviera en la rama de ${nombreFn[fn]}. No lo está.` },
            { id: 'otro', valor: otro, error: 'IN1', siFuera: 'Ese ángulo tiene la misma razón, pero no está en la rama.' },
            { id: 'vuelta', valor: mod360(xv), error: 'IN4', siFuera: 'Ese es el mismo lado de x, sin vueltas; tampoco está en la rama.' },
            { id: 'signo', valor: -t, error: 'IN29', siFuera: 'El ángulo de referencia está bien; revisa el signo de la razón.' },
          ], a => g(a)),
          solucion: {
            texto: `Lo de adentro vale ${kTxt(FN[fn](xv))}; la rama devuelve ${g(t)}.`,
            ecuacion: [`${nombreFn[fn]}(${fn} ${xv < 0 ? '(' + g(xv) + ')' : g(xv)}) = ${nombreFn[fn]}(${kTxt(FN[fn](xv))}) = ${g(t)}`],
          },
        };
      },
    },
  };

  // ---------- Idea 4: la gráfica se refleja en y = x ----------
  // Cambia: el valor k entre −1 y 1. · Permanece: la rama del seno (verde), la recta y = x y la gráfica de arcsen.
  // Progresa: el par de puntos reflejados (k, arcsen k) y (arcsen k, k). · Se reserva: la notación sen⁻¹ (la
  // predicción). · Debe verse: dominio [−1, 1] y rango [−π/2, π/2] intercambiados por el reflejo.
  const P = 64;
  const curvaSen = Array.from({ length: P + 1 }, (_, i) => { const t = -Math.PI / 2 + Math.PI * i / P; return [t, Math.sin(t)]; });
  const curvaArc = curvaSen.map(([a, b]) => [b, a]);
  const reflejo = (kv, extra = {}) => {
    const t = Math.asin(kv);
    return Object.assign({
      ventana: { x: [-1.8, 1.8], y: [-1.8, 1.8] }, numeros: 1,
      segmentos: [{ de: [-1.7, -1.7], a: [1.7, 1.7], discontinua: true }],
      rotulos: [{ x: 1.5, y: 1.68, texto: 'y = x' }],
      curvas: [{ puntos: curvaSen, color: 'd', rotulo: 'sen', en: [-Math.PI / 2, -1], lado: 's' }, { puntos: curvaArc, color: 'o', rotulo: 'arcsen', en: [-1, -Math.PI / 2], lado: 'e' }],
      puntos: kv === null ? [] : [{ x: kv, y: t, color: 'o', rotulo: `(${f(kv, 2)}; ${f(t, 2)})`, lado: kv >= 0 ? 'se' : 'no' }, { x: t, y: kv, color: 'd', abierto: true }],
      alt: 'La rama del seno entre −π/2 y π/2 y su reflejo en la recta y = x: la gráfica de arcsen, de dominio [−1, 1]',
    }, extra);
  };
  const grafica = {
    id: 'grafica-reflejo',
    titulo: 'La gráfica se refleja',
    temas: ['Dominio, rango y gráfica', 'Arco seno, arco coseno y arco tangente'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Mueve k. El punto naranja (k; arcsen k) es el reflejo, en la recta y = x, del punto verde de la rama del seno.',
      voz: 'Lo que en una gráfica es x, en la otra es y.',
      controles: [{ id: 'k', etiqueta: 'k', color: 'c-i', min: -1, max: 1, paso: 0.25, inicio: 0.25, decimales: 2 }],
      dibujo: val => ({ datos: reflejo(val.k), estado: {} }),
      lectura: val => ['arcsen ', k, ` = arcsen(${f(val.k, 2)}) = `, th, ` = ${f(Math.asin(val.k), 2)} rad`],
      minimo: 3,
    },
    predice: {
      pregunta: ['En la calculadora, la tecla sin⁻¹ calcula arcsen. ¿Qué número es sen⁻¹(1/2)?'],
      voz: 'Piensa qué hace el ⁻¹ en esa tecla.',
      opciones: [
        { id: 'c', texto: 'π/6 ≈ 0,52: el ángulo de seno 1/2', correcta: true },
        { id: 'recip', texto: '1/sen(1/2) ≈ 2,09', error: 'IN5', siFuera: 'Así se escribe la cosecante, (sen x)⁻¹. En sen⁻¹ el ⁻¹ marca la inversa.' },
        { id: 'dos', texto: '2', error: 'IN6', siFuera: 'Ese es el recíproco de 1/2. El ⁻¹ no se aplica al número sino a la función.' },
        { id: 'grados', texto: '30', error: 'IN20', siFuera: '30 es el ángulo en grados. En radianes, como en esta gráfica, vale π/6.' },
      ],
      dibujo: { datos: reflejo(null), estado: {} },
      revelar: { datos: reflejo(0.5, { puntos: [{ x: 0.5, y: Math.PI / 6, color: 'o', rotulo: 'sen⁻¹(1/2) = π/6', lado: 'se' }] }), estado: {} },
      coincide: 'Coincide: sen⁻¹ es otro nombre de arcsen; da un ángulo, π/6.',
      noCoincide: 'Revisemos el punto de la gráfica de arcsen en x = 1/2: su altura es π/6.',
    },
    mira: {
      datos: {
        ventana: { x: [-1.8, 1.8], y: [-1.8, 1.8] }, numeros: 1,
        rotulos: [{ x: 1.5, y: 1.68, texto: 'y = x', desde: 2 }, { x: -1.5, y: 1.68, texto: 'rango', color: 'o', desde: 3 }],
        segmentos: [{ de: [-1.7, -1.7], a: [1.7, 1.7], discontinua: true, desde: 2 }, { de: [-1, -1.75], a: [1, -1.75], color: 'i', rotulo: 'dominio', desde: 3 }, { de: [-1.75, -Math.PI / 2], a: [-1.75, Math.PI / 2], color: 'o', desde: 3 }],
        curvas: [{ puntos: curvaSen, color: 'd', rotulo: 'sen', en: [-Math.PI / 2, -1], lado: 's', desde: 1 }, { puntos: curvaArc, color: 'o', rotulo: 'arcsen', en: [-1, -Math.PI / 2], lado: 'e', desde: 2 }],
        alt: 'La rama del seno, su reflejo en y = x (arcsen), el dominio [−1, 1] en el eje x y el rango [−π/2, π/2] en el eje y',
      },
      voz: 'Un reflejo cambia las x por las y.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Se toma solo la rama del seno entre −π/2 y π/2.', ecuacion: ['y = sen x,  −π/2 ≤ x ≤ π/2'] },
        { estado: { corte: 2 }, texto: 'Se refleja en y = x: cada (a; b) pasa a (b; a).', ecuacion: ['y = arcsen x'] },
        { estado: { corte: 3 }, texto: 'El dominio de arcsen es el rango de la rama, y al revés.', ecuacion: ['dominio [−1, 1];   rango [−π/2, π/2]'] },
      ],
    },
    regla: {
      texto: 'La gráfica de arcsen es la rama del seno reflejada en y = x. sen⁻¹ x es otro nombre de arcsen x: un ángulo, no 1/sen x.',
      ecuacion: ['sen⁻¹ x = arcsen x ≠ ', { frac: ['1', 'sen x'] }, ' = csc x'],
      condicion: 'el reflejo vale para la rama elegida; sin rama, el seno no tiene inversa porque repite valores.',
      voz: 'El ⁻¹ de la función no es un exponente.',
    },
    ahoraTu: {
      voz: 'El dominio sale de lo que la inversa acepta.',
      generar(sem) {
        const rr = azar(sem), fn = sem % 2 ? 'cos' : 'sen';
        const a = rr.uno([2, 3, 4, 5]), b = rr.uno([-3, -2, -1, 1, 2, 3]);
        const fr = (p, q) => { const m = (u, w) => (w ? m(w, u % w) : Math.abs(u)); const d = m(p, q) || 1; const s = p * q < 0 ? '−' : ''; const P = Math.abs(p / d), Q = Math.abs(q / d); return Q === 1 ? `${s}${P}` : `${s}${P}/${Q}`; };
        const iv = (p1, p2) => `[${fr(p1, a)}, ${fr(p2, a)}]`;
        const bTxt = b > 0 ? `+ ${b}` : `− ${-b}`;
        return {
          pregunta: [`¿Cuál es el dominio de f(`, x, `) = ${nombreFn[fn]}(${a}`, x, ` ${bTxt})?`],
          opciones: opciones(iv(-1 - b, 1 - b), [
            { id: 'copia', valor: '[−1, 1]', error: 'IN14', siFuera: `[−1, 1] es lo que acepta ${nombreFn[fn]}. Aquí debe cumplirlo ${a}x ${bTxt}: falta despejar x.` },
            { id: 'signo', valor: iv(-1 + b, 1 + b), error: 'IN15', siFuera: `Despejar está bien; al pasar ${b > 0 ? b : -b} al otro lado cambia de signo.` },
            { id: 'sin-a', valor: `[${f(-1 - b)}, ${f(1 - b)}]`, error: 'IN16', siFuera: `Restar ${b} está bien; falta dividir entre ${a}.` },
          ], v => (typeof v === 'string' ? v : v)),
          solucion: {
            texto: `Lo de adentro debe estar entre −1 y 1; se despeja x.`,
            ecuacion: [`−1 ≤ ${a}`, x, ` ${bTxt} ≤ 1  ⇒  ${fr(-1 - b, a)} ≤ `, x, ` ≤ ${fr(1 - b, a)}`],
          },
        };
      },
    },
  };

  // ---------- Idea 5: arccot, arcsec y arccsc ----------
  // Cambia: la función (arcsec o arccsc) y k, con |k| ≥ 1. · Permanece: la circunferencia y la convención de ramas.
  // Progresa: la recta x = 1/k (o y = 1/k), que se acerca al centro cuando k crece. · Se reserva: arccot de un
  // negativo (la predicción). · Debe verse: arcsec k = arccos(1/k) y arccsc k = arcsen(1/k), con un hueco en la rama.
  const otras = {
    id: 'otras-tres',
    titulo: 'arccot, arcsec y arccsc',
    temas: ['Arco cotangente, arco secante y arco cosecante'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Elige arcsec o arccsc y el valor k. La figura usa 1/k: arcsec k = arccos(1/k) y arccsc k = arcsen(1/k).',
      voz: 'Pasemos k a su recíproco y usemos una rama conocida.',
      controles: [
        { id: 'fn', etiqueta: 'Inversa', opciones: [{ valor: 'sec', texto: 'arcsec' }, { valor: 'csc', texto: 'arccsc' }], inicio: 'sec' },
        { id: 'k', etiqueta: 'k', opciones: [{ valor: -2, texto: '−2' }, { valor: -1, texto: '−1' }, { valor: 1, texto: '1' }, { valor: 1.5, texto: '1,5' }, { valor: 2, texto: '2' }, { valor: 4, texto: '4' }], inicio: 2 },
      ],
      dibujo: val => ({ datos: figura(val.fn, val.k), estado: {} }),
      lectura: val => [`${nombreFn[val.fn]}(${kTxt(val.k)}) = ${val.fn === 'sec' ? 'arccos' : 'arcsen'}(${kTxt(1 / val.k)}) = `, th, ` = ${g(ARC[val.fn](val.k))}`],
      minimo: 3,
    },
    predice: {
      pregunta: ['Con la rama de arccot entre 0° y 180°, ¿cuánto vale arccot(−1)?'],
      voz: 'La cotangente es x/y; ubica el punto (−1; 1).',
      opciones: [
        { id: 'c', texto: '135°', correcta: true },
        { id: 'tan', texto: '−45°', error: 'IN19', siFuera: 'arctan(1/k) sirve con k positivo. Con k negativo cae fuera de la rama de arccot.' },
        { id: 'ref', texto: '45°', error: 'IN29', siFuera: '45° es el ángulo de referencia; su cotangente es +1, no −1.' },
        { id: 'otro', texto: '315°', error: 'IN1', siFuera: '315° tiene cotangente −1, pero está fuera de la rama de 0° a 180°.' },
      ],
      dibujo: { datos: plano({ arcos: rama('cot').arcos, puntos: rama('cot').huecos, rectas: [{ y: 1, color: 'i' }], alt: 'La rama de arccot, la mitad de arriba sin sus extremos, y la recta y = 1' }), estado: {} },
      revelar: { datos: figura('cot', -1), estado: {} },
      coincide: 'Coincide: el rayo que pasa por (−1; 1) forma 135°.',
      noCoincide: 'Revisemos el rayo que pasa por (−1; 1): forma 135°.',
    },
    mira: {
      datos: plano({
        arcos: [...rama('cot').arcos.map(a => Object.assign({}, a, { desde: 1 })), { de: 0, a: 135, r: 0.32, color: 'o', espiral: 0, rotulo: '135°', desde: 3 }],
        rectas: [{ y: 1, color: 'i', desde: 2 }],
        puntos: [...rama('cot').huecos.map(p => Object.assign({}, p, { desde: 1 })), { x: -1, y: 1, color: 'i', rotulo: '(−1; 1)', lado: 'no', desde: 2 }, pto(135, { desde: 3 })],
        segmentos: [{ de: [0, 0], a: [-1, 1], color: 'o', discontinua: true, grosor: 'contorno', desde: 3 }],
        rayos: [{ ang: 135, color: 'o', desde: 3 }],
        alt: 'La rama de arccot es la mitad de arriba sin 0 ni 180 grados; el rayo por (−1; 1) forma 135 grados',
      }),
      voz: 'La rama primero; el punto (x; 1) después.',
      pasos: [
        { estado: { corte: 1 }, texto: 'arccot usa la mitad de arriba, sin 0° ni 180°.', ecuacion: ['0° < ', th, ' < 180°'] },
        { estado: { corte: 2 }, texto: 'cot θ = x/y: con y = 1, el punto es (k; 1).', ecuacion: ['cot ', th, ' = ', { frac: ['−1', '1'] }] },
        { estado: { corte: 3 }, texto: 'El rayo por (−1; 1) forma 135° y está en la rama.', ecuacion: ['arccot(−1) = ', th, ' = 135°'] },
      ],
    },
    regla: {
      texto: 'arcsec y arccsc se pasan al recíproco y usan las ramas de arccos y arcsen. arccot usa la mitad de arriba, sin sus extremos.',
      ecuacion: ['arcsec ', k, ' = arccos ', { frac: ['1', k] }, ';   arccsc ', k, ' = arcsen ', { frac: ['1', k] }, ';   0° < arccot ', k, ' < 180°'],
      condicion: 'arcsec y arccsc piden |k| ≥ 1; arccot acepta todo k. Algunos libros usan otra rama de arccot: revisa la del examen.',
      voz: 'Declaremos la rama antes de dar el número.',
    },
    ahoraTu: {
      pieza: 'trig-plano',
      voz: 'Pasa al recíproco o ubica el punto (k; 1).',
      generar(sem) {
        const rr = azar(sem), fn = ['cot', 'sec', 'csc'][sem % 3];
        const v = fn === 'cot' ? rr.uno([1, -1, Math.sqrt(3), -Math.sqrt(3), Math.sqrt(3) / 3, -Math.sqrt(3) / 3])
          : rr.uno([2, -2, Math.SQRT2, -Math.SQRT2, 2 * Math.sqrt(3) / 3, -2 * Math.sqrt(3) / 3, -1]);
        const t = redondo(ARC[fn](v)), ref = redondo(ARC[fn](Math.abs(v)));
        const ds = fn === 'cot' ? [
          { id: 'tan', valor: redondo(deg(Math.atan(1 / v))), error: 'IN19', siFuera: 'arctan(1/k) sirve si k > 0. Con k negativo cae fuera de la rama de 0° a 180°.' },
          { id: 'ref', valor: v < 0 ? ref : null, error: 'IN29', siFuera: 'Es el ángulo de referencia; con k negativo el punto (k; 1) está a la izquierda.' },
          { id: 'arctan', valor: redondo(deg(Math.atan(v))), error: 'IN26', siFuera: 'Ese es arctan k. La cotangente es el recíproco de la tangente.' },
          { id: 'otro', valor: t + 180, error: 'IN1', siFuera: 'Ese ángulo tiene la misma cotangente, pero está fuera de la rama de 0° a 180°.' },
          { id: 'signo', valor: -t, error: 'IN29', siFuera: 'El ángulo de referencia está bien; la rama de arccot no tiene negativos.' },
        ] : [
          { id: 'menos', valor: fn === 'sec' && v < 0 ? -ref : null, error: 'IN2', siFuera: 'La rama de arcsec es la de arccos, de 0° a 180°: no hay negativos.' },
          { id: 'ref', valor: v < 0 ? ref : null, error: 'IN29', siFuera: 'Es el ángulo de referencia; con k negativo cambia el lado del punto.' },
          { id: 'comp', valor: redondo(90 - t), error: 'IN7', siFuera: fn === 'sec' ? 'Ese es arccsc del mismo valor: el complementario.' : 'Ese es arcsec del mismo valor: el complementario.' },
          { id: 'otro', valor: fn === 'sec' ? (t ? 360 - t : null) : redondo(180 - t), error: 'IN1', siFuera: 'Ese ángulo tiene la misma razón, pero está fuera de la rama.' },
        ];
        return {
          pregunta: [`¿Cuánto vale ${nombreFn[fn]} `, k, ` = ${nombreFn[fn]}(${kTxt(v)})?`],
          opciones: opciones(t, ds, a => g(a)),
          solucion: {
            texto: fn === 'cot' ? 'Es el ángulo del rayo por (k; 1), en la mitad de arriba.' : `Se pasa al recíproco: ${fn === 'sec' ? 'arccos' : 'arcsen'}(${kTxt(1 / v)}).`,
            ecuacion: [`${nombreFn[fn]}(${kTxt(v)}) = `, th, ` = ${g(t)}`],
            dibujo: { datos: figura(fn, v, fn === 'cot' && Math.abs(v) > 1.2 ? { ventana: { x: [-2.4, 2.4], y: [-1.6, 1.6] } } : {}), estado: {} },
          },
        };
      },
    },
  };

  return {
    unidad: 'trigonometria.funciones-trigonometricas-inversas',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/trig-plano.js'],
    historia: {
      texto: 'Buscar un ángulo a partir de una razón obligó a nombrar funciones nuevas. En el siglo XVIII, Daniel Bernoulli, Euler y Lagrange probaron varias notaciones; en 1813, John Herschel explicó la del exponente −1, que convivió con la forma «arc». Esa doble escritura todavía confunde: sen⁻¹ x es una inversa, no un recíproco.',
      pregunta: '¿Por qué un mismo símbolo puede significar dos cosas?',
      fuente: { titulo: 'Jeff Miller, «Earliest Uses of Symbols for Trigonometric and Hyperbolic Functions», MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/Miller/mathsym/trigonometry/' },
    },
    ideas: [ramaSeno, tres, componer, grafica, otras],
  };
});
