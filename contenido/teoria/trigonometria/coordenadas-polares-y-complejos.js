/*
 * Teoría de «Coordenadas polares y números complejos» (trigonometria.coordenadas-polares-y-complejos), 5.º de secundaria.
 * Fuente del contenido: docs/teoria/matriz/trigonometria.json (unidad 19: (−2, π/6) es (−√3, −1); (1 + i)² = 2i;
 * radio polar firmado frente a módulo no negativo) y su historia (De Moivre). Forma:
 * contenido/teoria/trigonometria/angulo-trigonometrico.js.
 * Compañera: Mara (coneja), cercana y rigurosa: conserva el origen y el sentido del ángulo; el cuadrante decide.
 * Colores (regla 4): el ángulo θ (argumento) en naranja (c-o); el radio r (módulo |z|) en verde (c-d); las
 * coordenadas x, y (partes a, b de z = a + bi) en turquesa (c-i); el exponente n en rojo (c-h).
 * Notación: cis θ = cos θ + i sen θ (se declara en la regla de la idea 2). Argumentos entre 0° y 360°.
 * Errores: CP3, CP4, CP5, CP14 de plantillas/coordenadas-polares/motor.js (CP3 parcial, Habre 2017; los demás,
 * hipótesis); CX11, CX17, CX18, CX19, CX20, CX21, CX22, CX23, CX24, CX30, CX31 de plantillas/numeros-complejos/motor.js
 * (CX17 y CX18 parciales; los demás, hipótesis); TR11 (parcial). Nuevos (hipótesis): POL-CUADRANTE (elige otro
 * cuadrante para el argumento), POL-ARG-FIJO (eleva el módulo y deja el argumento), POL-REPARTE ((a + b)ⁿ = aⁿ + bⁿ),
 * POL-EXP-REAL (lee e^{iθ} como un número real), POL-SIN-I (suma las partes sin la i).
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: un punto o un complejo se describe con un largo y un giro; multiplicar suma giros y multiplica largos.
 *   Persona y condiciones: postulante de 5.º, celular de 360 px de gama baja, con o sin conexión, en el aula o en casa.
 *   Resultado observable: convierte entre polares y cartesianas, escribe z en forma trigonométrica y exponencial, y usa De Moivre.
 *   Orden de atención: 1.º el giro θ desde el eje · 2.º el largo r · acción: mover r, θ o las partes · fondo: los ejes.
 *   Estados: juego sin tocar · probando · predicción pendiente · coincide / no coincide · paso de «Mira» · caso nuevo.
 *   Duda que resuelve: ¿por qué (−2; 30°) cae en el tercer cuadrante y por qué arctan(b/a) no basta para el argumento?
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (v, d = 2) => Kit.formatear(v, d);
  const th = { v: 'c-o', t: 'θ' }, r = { v: 'c-d', t: 'r' }, n = { v: 'c-h', t: 'n' };
  const xx = { v: 'c-i', t: 'x' }, yy = { v: 'c-i', t: 'y' }, a = { v: 'c-i', t: 'a' }, b = { v: 'c-i', t: 'b' };
  const mz = { abs: [{ v: 'c-d', t: 'z' }] };
  const rad = g => g * Math.PI / 180, deg = x => x * 180 / Math.PI;
  const mod360 = x => ((x % 360) + 360) % 360;
  const gcd = (p, q) => (q ? gcd(q, p % q) : Math.abs(p));
  const G = x => `${f(Math.round(x * 100) / 100)}°`;

  // Números exactos de la forma (p/q)·√s, con s en {1, 2, 3}: [p, q, s].
  const simp = ([p, q, s]) => { if (!p) return [0, 1, 1]; const m = gcd(p, q) || 1; return [p / m * Math.sign(q), Math.abs(q / m), s]; };
  const REF = { 0: [1, 1, 1], 30: [1, 2, 3], 45: [1, 2, 2], 60: [1, 2, 1], 90: [0, 1, 1] };
  function cosE(t) {
    const u = mod360(Math.round(t));
    const ref = u <= 90 ? u : u <= 180 ? 180 - u : u <= 270 ? u - 180 : 360 - u;
    const [p, q, s] = REF[ref];
    return simp([Math.cos(rad(u)) < -1e-12 ? -p : p, q, s]);
  }
  const senE = t => cosE(90 - t);
  const por = (k, [p, q, s]) => simp([k * p, q, s]);
  const valE = ([p, q, s]) => p / q * Math.sqrt(s);
  function txt([p, q, s], conI = false) {
    if (!p) return '0';
    const sg = p < 0 ? '−' : '', P = Math.abs(p);
    let core = s === 1 ? `${P}` : `${P === 1 ? '' : P}√${s}`;
    if (q !== 1) core = `${core}/${q}`;
    if (conI) return `${sg}${core === '1' ? '' : core + (s === 1 && q === 1 ? '' : ' ')}i`;
    return sg + core;
  }
  function bin(A, B) {
    if (!B[0]) return txt(A);
    const im = txt([Math.abs(B[0]), B[1], B[2]], true);
    if (!A[0]) return `${B[0] < 0 ? '−' : ''}${im}`;
    return `${txt(A)} ${B[0] < 0 ? '−' : '+'} ${im}`;
  }
  const par = (A, B) => `(${txt(A)}; ${txt(B)})`;
  // Módulo exacto de rⁿ con r en {1, 2, 3, √2}.
  function potTxt(rv, k) {
    if (rv === 'r2') return k % 2 ? `${2 ** ((k - 1) / 2) === 1 ? '' : 2 ** ((k - 1) / 2)}√2` : `${2 ** (k / 2)}`;
    return `${rv ** k}`;
  }
  const rTxt = rv => (rv === 'r2' ? '√2' : `${rv}`);
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
      if (d.valor === null || d.valor === undefined) continue;
      const t = fmt(d.valor);
      if (vistos.has(t)) continue;
      vistos.add(t);
      ops.push({ id: d.id, texto: t, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }
  const lado = (px, py) => (px >= -1e-9 ? (py >= -1e-9 ? 'ne' : 'se') : (py >= -1e-9 ? 'no' : 'so'));
  const cis = (m, t) => `${m} cis ${G(mod360(t))}`;

  // ---------- Idea 1: un punto, muchos nombres ----------
  // Cambia: el radio r (positivo) y el ángulo θ. · Permanece: el polo, el eje polar y la escala.
  // Progresa: el punto que se aleja por el rayo θ. · Se reserva: r negativo, que cruza el polo (la predicción).
  // Debe verse: x = r cos θ e y = r sen θ; (−r; θ) es el punto opuesto, a θ + 180°.
  const polar = (rv, tv, extra = {}) => {
    const px = rv * Math.cos(rad(tv)), py = rv * Math.sin(rad(tv));
    return Object.assign({
      ventana: { x: [-2.4, 2.4], y: [-2.4, 2.4] }, numeros: 1,
      circulos: rv ? [{ r: Math.abs(rv), discontinua: true }] : [],
      rayos: [{ ang: tv, largo: 2.3, grosor: 'contorno', discontinua: true, punta: false }],
      arcos: [{ de: 0, a: tv, r: 0.45, color: 'o', rotulo: `${f(tv)}°` }],
      segmentos: [{ de: [0, 0], a: [px, py], color: 'd', rotulo: `r = ${f(rv)}`, lado: rv < 0 ? 'adentro' : undefined }],
      puntos: [{ x: px, y: py, color: 'i', rotulo: `(${f(px)}; ${f(py)})`, lado: lado(px, py) }],
      alt: `Punto de coordenadas polares (${f(rv)}; ${f(tv)} grados): x = ${f(px)}, y = ${f(py)}`,
    }, extra);
  };
  const polares = {
    id: 'polar-punto',
    titulo: 'Un punto, muchos nombres',
    temas: ['Coordenadas polares'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Mueve r y θ. El punto está a r unidades del polo, sobre el rayo que forma θ con el eje x.',
      voz: 'Conservemos el polo y el eje; primero el giro, después el largo.',
      controles: [
        { id: 'r', etiqueta: 'r', color: 'c-d', min: 0.5, max: 2, paso: 0.5, inicio: 1.5, decimales: 1 },
        { id: 't', etiqueta: 'θ', color: 'c-o', min: 0, max: 330, paso: 30, inicio: 60, unidad: '°', decimales: 0 },
      ],
      dibujo: val => ({ datos: polar(val.r, val.t), estado: {} }),
      lectura: val => ['(', r, '; ', th, `) = (${f(val.r)}; ${f(val.t)}°) → (`, xx, '; ', yy, `) = (${f(val.r * Math.cos(rad(val.t)))}; ${f(val.r * Math.sin(rad(val.t)))})`],
      minimo: 3,
    },
    predice: {
      pregunta: ['¿Dónde está el punto de coordenadas polares (', r, '; ', th, ') = (−2; 30°)?'],
      voz: 'Primero el rayo de 30°; después, el signo de r.',
      opciones: [
        { id: 'c', texto: 'En (−√3; −1), tercer cuadrante', correcta: true },
        { id: 'sin-signo', texto: 'En (√3; 1), primer cuadrante', error: 'CP3', siFuera: 'Así queda (2; 30°). Con r negativo se avanza hacia atrás, cruzando el polo.' },
        { id: 'refx', texto: 'En (√3; −1), cuarto cuadrante', error: 'CP4', siFuera: 'Ese es el reflejo en el eje x, (2; −30°). r negativo da el punto opuesto, no el reflejo.' },
        { id: 'refy', texto: 'En (−√3; 1), segundo cuadrante', error: 'CP5', siFuera: 'Ese es el reflejo en el eje y. El opuesto cambia de signo las dos coordenadas.' },
      ],
      dibujo: { datos: polar(2, 30, { segmentos: [], puntos: [], circulos: [{ r: 2, discontinua: true }], alt: 'El rayo de 30 grados y la circunferencia de radio 2' }), estado: {} },
      revelar: { datos: polar(-2, 30, { puntos: [{ x: -Math.sqrt(3), y: -1, color: 'i', rotulo: '(−√3; −1)', lado: 'so' }] }), estado: {} },
      coincide: 'Coincide: con r = −2 se camina hacia atrás y se llega a (−√3; −1).',
      noCoincide: 'Revisemos el segmento verde: sale del polo hacia el lado contrario del rayo.',
    },
    mira: {
      datos: {
        ventana: { x: [-2.4, 2.4], y: [-2.4, 2.4] }, numeros: 1,
        circulos: [{ r: 2, discontinua: true }],
        rayos: [{ ang: 30, largo: 2.3, grosor: 'contorno', discontinua: true, punta: false, desde: 1 }],
        arcos: [{ de: 0, a: 30, r: 0.45, color: 'o', rotulo: '30°', desde: 1 }, { de: 0, a: 210, r: 0.75, color: 'o', rotulo: '210°', desde: 4 }],
        segmentos: [{ de: [0, 0], a: [-Math.sqrt(3), -1], color: 'd', rotulo: 'r = −2', lado: 'adentro', desde: 2 }],
        puntos: [{ x: -Math.sqrt(3), y: -1, color: 'i', rotulo: '(−√3; −1)', lado: 'so', desde: 3 }],
        alt: 'El rayo de 30 grados; r = −2 lleva al punto opuesto, (−√3; −1), que también es (2; 210 grados)',
      },
      voz: 'El signo de r dice hacia qué lado del polo caminar.',
      pasos: [
        { estado: { corte: 1 }, texto: 'θ = 30° marca la dirección del rayo.', ecuacion: [th, ' = 30°'] },
        { estado: { corte: 2 }, texto: 'r = −2: se camina 2 unidades hacia atrás, cruzando el polo.', ecuacion: [r, ' = −2'] },
        { estado: { corte: 3 }, texto: 'Las fórmulas dan el punto con sus signos.', ecuacion: [xx, ' = −2 cos 30° = −√3;   ', yy, ' = −2 sen 30° = −1'] },
        { estado: { corte: 4 }, texto: 'El mismo punto se llama también (2; 210°).', ecuacion: ['(−2; 30°) = (2; 210°) = (2; −150°)'] },
      ],
    },
    regla: {
      texto: 'Un punto (r; θ) está en x = r cos θ, y = r sen θ. Tiene infinitos nombres: sumar vueltas a θ, o cambiar el signo de r y sumar 180°.',
      ecuacion: [xx, ' = ', r, ' cos ', th, ';   ', yy, ' = ', r, ' sen ', th, ';   (', r, '; ', th, ') = (−', r, '; ', th, ' + 180°)'],
      condicion: 'θ desde el eje x positivo, antihorario. En el polo, r = 0 y cualquier θ sirve.',
      voz: 'Muchos nombres, un solo punto.',
    },
    ahoraTu: {
      pieza: 'trig-plano',
      voz: 'Primero el rayo, después el signo de r.',
      generar(sem) {
        const rr = azar(sem), rv = rr.uno([2, 4, -2, -4, 2, -2]), tv = rr.uno([30, 45, 60, 120, 135, 150, 210, 240, 300, 315, 330]);
        const X = por(rv, cosE(tv)), Y = por(rv, senE(tv)), R = Math.abs(rv);
        return {
          pregunta: ['Un punto tiene coordenadas polares (', r, '; ', th, `) = (${f(rv)}; ${tv}°). ¿Cuáles son sus coordenadas cartesianas (`, xx, '; ', yy, ')?'],
          opciones: opciones(par(X, Y), [
            { id: 'sin-signo', valor: rv < 0 ? par(por(R, cosE(tv)), por(R, senE(tv))) : null, error: 'CP3', siFuera: 'Así queda con r positivo. Con r negativo, el punto pasa al otro lado del polo.' },
            { id: 'cruza', valor: par(Y, X), error: 'TR11', siFuera: 'Las dos coordenadas están bien calculadas, pero cruzadas: x usa el coseno.' },
            { id: 'sin-r', valor: par(cosE(tv), senE(tv)), error: 'CP14', siFuera: 'Ese es el punto de la circunferencia de radio 1. Falta multiplicar por r.' },
            { id: 'refx', valor: par(X, por(-1, Y)), error: 'CP4', siFuera: 'Ese es el reflejo en el eje x. Revisa el signo de sen θ.' },
          ], v => v),
          solucion: {
            texto: rv < 0 ? 'Con r negativo, las fórmulas ya cruzan el polo.' : 'Se multiplica r por el coseno y por el seno.',
            ecuacion: [xx, ` = ${f(rv)} cos ${tv}° = ${txt(X)};   `, yy, ` = ${f(rv)} sen ${tv}° = ${txt(Y)}`],
            dibujo: { datos: polar(rv, tv, { ventana: { x: [-4.6, 4.6], y: [-4.6, 4.6] }, numeros: 2, segmentos: [{ de: [0, 0], a: [valE(X), valE(Y)], color: 'd', rotulo: `r = ${f(rv)}`, lado: rv < 0 ? 'adentro' : undefined }], puntos: [{ x: valE(X), y: valE(Y), color: 'i', rotulo: par(X, Y), lado: lado(valE(X), valE(Y)) }] }), estado: {} },
          },
        };
      },
    },
  };

  // ---------- Idea 2: el argumento depende del cuadrante ----------
  // Cambia: las partes a (positiva) y b de z = a + bi. · Permanece: el plano complejo y su escala.
  // Progresa: el módulo verde y el arco del argumento. · Se reserva: a negativa, donde arctan(b/a) engaña (la
  // predicción). · Debe verse: el argumento se lee desde el eje real positivo, según el cuadrante de (a; b).
  const complejo = (av, bv, extra = {}) => {
    const m = Math.hypot(av, bv), t = mod360(deg(Math.atan2(bv, av)));
    return Object.assign({
      ventana: { x: [-3.4, 3.4], y: [-3.4, 3.4] }, numeros: 1, nombres: ['Re', 'Im'],
      segmentos: [{ de: [av, 0], a: [av, bv], color: 'i', discontinua: true, grosor: 'contorno' }, { de: [0, 0], a: [av, bv], color: 'd', punta: true, rotulo: `|z| = ${f(m)}`, lado: av < 0 ? 'adentro' : undefined }],
      arcos: m ? [{ de: 0, a: t, r: 0.6, color: 'o', rotulo: G(t) }] : [],
      puntos: [{ x: av, y: bv, color: 'i', rotulo: `${f(av)} ${bv < 0 ? '−' : '+'} ${f(Math.abs(bv))}i`, lado: lado(av, bv) }],
      alt: `z = ${f(av)} + ${f(bv)}i: módulo ${f(m)} y argumento ${G(t)}`,
    }, extra);
  };
  const argumento = {
    id: 'argumento',
    titulo: 'El cuadrante decide el argumento',
    temas: ['Forma trigonométrica de un complejo'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Mueve a y b. La flecha verde mide |z|; el arco naranja es el argumento θ, desde el eje real positivo.',
      voz: 'Conservemos el eje real como lado inicial del giro.',
      controles: [
        { id: 'a', etiqueta: 'a', color: 'c-i', min: 1, max: 3, paso: 1, inicio: 2, decimales: 0 },
        { id: 'b', etiqueta: 'b', color: 'c-i', min: -3, max: 3, paso: 1, inicio: 2, decimales: 0 },
      ],
      dibujo: val => ({ datos: complejo(val.a, val.b), estado: {} }),
      lectura: val => [mz, ` = ${f(Math.hypot(val.a, val.b))};  `, th, ` = ${G(mod360(deg(Math.atan2(val.b, val.a))))}`],
      minimo: 3,
    },
    predice: {
      pregunta: ['¿Cuál es el argumento de z = −2 − 2i, entre 0° y 360°?'],
      voz: 'Ubica primero el punto (−2; −2) en el plano.',
      opciones: [
        { id: 'c', texto: '225°', correcta: true },
        { id: 'arctan', texto: '45°', error: 'CX17', siFuera: 'arctan(b/a) = 45° sería el argumento si a > 0. Aquí a < 0: el punto está en el III cuadrante.' },
        { id: 'ii', texto: '135°', error: 'POL-CUADRANTE', siFuera: '45° como referencia está bien. Con a y b negativos, el punto está en el III, no en el II.' },
        { id: 'iv', texto: '315°', error: 'POL-CUADRANTE', siFuera: '45° como referencia está bien. 315° tiene b < 0 pero a > 0: es el IV cuadrante.' },
      ],
      dibujo: { datos: complejo(-2, -2, { segmentos: [], arcos: [], alt: 'El punto −2 − 2i en el plano complejo' }), estado: {} },
      revelar: { datos: complejo(-2, -2, { numeros: 0 }), estado: {} },
      coincide: 'Coincide: el giro llega al III cuadrante, 180° + 45°.',
      noCoincide: 'Revisemos el arco naranja: llega al III cuadrante.',
    },
    mira: {
      datos: complejo(-2, -2, {
        segmentos: [{ de: [-2, 0], a: [-2, -2], color: 'i', discontinua: true, grosor: 'contorno', desde: 1 }, { de: [0, 0], a: [-2, -2], color: 'd', punta: true, rotulo: '|z| = 2√2', lado: 'adentro', desde: 1 }],
        numeros: 0,
        arcos: [{ de: 180, a: 225, r: 1.1, color: 'o', espiral: 0, flecha: false, rotulo: '45°', desde: 2 }, { de: 0, a: 225, r: 0.6, color: 'o', rotulo: '225°', desde: 3 }],
        puntos: [{ x: -2, y: -2, color: 'i', rotulo: '−2 − 2i', lado: 'so' }],
      }),
      voz: 'Largo primero, giro después.',
      pasos: [
        { estado: { corte: 1 }, texto: 'El módulo es la distancia al origen.', ecuacion: [mz, ' = √(4 + 4) = 2√2'] },
        { estado: { corte: 2 }, texto: 'Con el eje real, la flecha forma 45°.', ecuacion: ['tan 45° = ', { frac: ['2', '2'] }] },
        { estado: { corte: 3 }, texto: 'En el III cuadrante, el giro completo es 180° + 45°.', ecuacion: [th, ' = 225°'] },
        { estado: { corte: 3 }, texto: 'Con módulo y argumento se escribe la forma trigonométrica.', ecuacion: ['z = 2√2 (cos 225° + i sen 225°)'] },
      ],
    },
    regla: {
      texto: 'Todo z ≠ 0 se escribe con su módulo y su argumento. El argumento se elige por el cuadrante de (a; b); arctan(b/a) solo da el ángulo de referencia.',
      ecuacion: ['z = ', a, ' + ', b, 'i = ', mz, '(cos ', th, ' + i sen ', th, ') = ', mz, ' cis ', th, ';   ', mz, ' = √(', { sup: [a, '2'] }, ' + ', { sup: [b, '2'] }, ')'],
      condicion: '|z| nunca es negativo. θ se repite cada 360°; z = 0 no tiene argumento.',
      voz: 'El cuadrante decide; la tangente solo ayuda.',
    },
    ahoraTu: {
      pieza: 'trig-plano',
      voz: 'Ubica el punto antes de calcular el ángulo.',
      generar(sem) {
        const rr = azar(sem), m = rr.uno([2, 4, 6]), tv = rr.uno([120, 135, 150, 210, 225, 240, 300, 315, 330, 30, 60, 90, 180, 270]);
        const A = por(m, cosE(tv)), B = por(m, senE(tv));
        const av = valE(A), bv = valE(B);
        const arct = Math.abs(av) < 1e-9 ? null : Math.round(deg(Math.atan(bv / av)));
        const ref = Math.round(deg(Math.atan2(Math.abs(bv), Math.abs(av))));
        const fmt = ([mm, t]) => `${mm}(cos ${G(mod360(t))} + i sen ${G(mod360(t))})`;
        return {
          pregunta: ['Escribe z = ', bin(A, B), ' en forma trigonométrica, con el argumento entre 0° y 360°.'],
          opciones: opciones([`${m}`, tv], [
            { id: 'arctan', valor: arct === null ? null : [`${m}`, arct], error: 'CX17', siFuera: 'arctan(b/a) da el argumento si a > 0. Aquí hay que mirar el cuadrante del punto.' },
            { id: 'ref', valor: [`${m}`, ref], error: 'CX18', siFuera: 'Ese es el ángulo de referencia con el eje real. El argumento se mide desde el eje real positivo.' },
            { id: 'sin-raiz', valor: [`${m * m}`, tv], error: 'CX11', siFuera: 'El argumento está bien. a² + b² es el cuadrado del módulo: falta la raíz.' },
          ], fmt),
          solucion: {
            texto: `El punto está a ${m} del origen y gira ${G(tv)}.`,
            ecuacion: [mz, ` = ${m};   `, th, ` = ${G(tv)}`],
            dibujo: { datos: complejo(av, bv, { ventana: { x: [-6.8, 6.8], y: [-6.8, 6.8] }, numeros: 0, puntos: [{ x: av, y: bv, color: 'i', rotulo: bin(A, B), lado: lado(av, bv) }], segmentos: [{ de: [av, 0], a: [av, bv], color: 'i', discontinua: true, grosor: 'contorno' }, { de: [0, 0], a: [av, bv], color: 'd', punta: true, rotulo: `|z| = ${m}`, lado: av < 0 ? 'adentro' : undefined }] }), estado: {} },
          },
        };
      },
    },
  };

  // ---------- Idea 3: multiplicar es girar y estirar ----------
  // Cambia: el módulo y el argumento de w. · Permanece: z = 1,5 cis 30°, fijo.
  // Progresa: la flecha z·w, que gira lo que gira w y se estira lo que mide w. · Se reserva: un producto cuyo
  // argumento pasa de 360° (la predicción). · Debe verse: |zw| = |z||w| y arg(zw) = arg z + arg w.
  const flecha = (m, t, color, rotulo, extra = {}) => Object.assign({ de: [0, 0], a: [m * Math.cos(rad(t)), m * Math.sin(rad(t))], color, punta: true, rotulo }, extra);
  const producto = (r1, t1, r2, t2, extra = {}) => {
    const R = r1 * r2, T = t1 + t2;
    return Object.assign({
      ventana: { x: [-3.4, 3.4], y: [-3.4, 3.4] }, numeros: 1, nombres: ['Re', 'Im'],
      segmentos: [flecha(r1, t1, undefined, 'z', { grosor: 'contorno' }), flecha(r2, t2, 'i', 'w'), flecha(R, T, 'd', 'z·w')],
      arcos: [{ de: 0, a: t1, r: 0.5, color: 'o', espiral: 0 }, { de: t1, a: T, r: 0.5, color: 'o', espiral: 6 }],
      alt: `z = ${f(r1)} cis ${G(t1)} por w = ${f(r2)} cis ${G(t2)} da ${f(R)} cis ${G(mod360(T))}`,
    }, extra);
  };
  const multiplicar = {
    id: 'multiplicar',
    titulo: 'Multiplicar es girar y estirar',
    temas: ['Forma trigonométrica de un complejo'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'z está fijo. Mueve el módulo y el argumento de w, y mira la flecha verde de z·w: cuánto gira y cuánto se estira.',
      voz: 'Compara el giro de z·w con los giros de z y de w.',
      controles: [
        { id: 'm', etiqueta: '|w|', color: 'c-d', min: 0.5, max: 2, paso: 0.5, inicio: 1, decimales: 1 },
        { id: 't', etiqueta: 'arg w', color: 'c-o', min: 0, max: 150, paso: 30, inicio: 60, unidad: '°', decimales: 0 },
      ],
      dibujo: val => ({ datos: producto(1.5, 30, val.m, val.t), estado: {} }),
      lectura: val => ['z·w = ', `${f(1.5 * val.m)} cis ${G(30 + val.t)}`],
      minimo: 3,
    },
    predice: {
      pregunta: ['z = 2 cis 300° y w = 3 cis 120°. ¿Cuánto vale z·w, con el argumento entre 0° y 360°?'],
      voz: 'Piensa qué pasa con los largos y qué pasa con los giros.',
      opciones: [
        { id: 'c', texto: '6 cis 60°', correcta: true },
        { id: 'suma', texto: '5 cis 60°', error: 'CX19', siFuera: 'El giro está bien. Los módulos se multiplican: 2 · 3 = 6.' },
        { id: 'resta', texto: '6 cis 180°', error: 'CX21', siFuera: 'Restar argumentos es la regla de la división. En el producto se suman.' },
        { id: 'multi', texto: '6 cis 0°', error: 'CX20', siFuera: 'Los módulos están bien. Los argumentos se suman: 300° + 120° = 420°, una vuelta y 60°.' },
      ],
      dibujo: { datos: producto(2, 300, 3, 120, { ventana: { x: [-6.4, 6.4], y: [-6.4, 6.4] }, numeros: 0, segmentos: [flecha(2, 300, undefined, 'z', { grosor: 'contorno' }), flecha(3, 120, 'i', 'w')], arcos: [], alt: 'Las flechas de z = 2 cis 300 grados y w = 3 cis 120 grados' }), estado: {} },
      revelar: { datos: producto(2, 300, 3, 120, { ventana: { x: [-6.4, 6.4], y: [-6.4, 6.4] }, numeros: 0, arcos: [{ de: 0, a: 300, r: 1.3, color: 'o', espiral: 0, rotulo: '300°' }, { de: 300, a: 420, r: 1.3, color: 'o', espiral: 10, rotulo: '+120°' }] }), estado: {} },
      coincide: 'Coincide: largos 2 · 3 = 6; giros 300° + 120° = 420°, que es 60°.',
      noCoincide: 'Revisemos la flecha verde: mide 6 y apunta a 60°.',
    },
    mira: {
      datos: {
        ventana: { x: [-6.4, 6.4], y: [-6.4, 6.4] }, numeros: 0, nombres: ['Re', 'Im'],
        segmentos: [flecha(2, 300, undefined, 'z', { grosor: 'contorno', desde: 1 }), flecha(3, 120, 'i', 'w', { desde: 1 }), flecha(6, 60, 'd', 'z·w = 6 cis 60°', { desde: 3 })],
        arcos: [{ de: 0, a: 300, r: 1.3, color: 'o', espiral: 0, rotulo: '300°', desde: 2 }, { de: 300, a: 420, r: 1.3, color: 'o', espiral: 10, rotulo: '+120°', desde: 2 }],
        alt: 'z gira 300 grados; w suma 120 grados más, una vuelta y 60 grados; el largo pasa a 6',
      },
      voz: 'Primero los giros; después, los largos.',
      pasos: [
        { estado: { corte: 1 }, texto: 'z mide 2 y gira 300°; w mide 3 y gira 120°.', ecuacion: ['z = 2 cis 300°;   w = 3 cis 120°'] },
        { estado: { corte: 2 }, texto: 'Los giros se suman: una vuelta y 60° más.', ecuacion: ['300° + 120° = 420° = 360° + 60°'] },
        { estado: { corte: 3 }, texto: 'Los largos se multiplican.', ecuacion: [{ abs: ['z·w'] }, ' = 2 · 3 = 6;   z·w = 6 cis 60°'] },
      ],
    },
    regla: {
      texto: 'Al multiplicar complejos, los módulos se multiplican y los argumentos se suman. Al dividir, los módulos se dividen y los argumentos se restan.',
      ecuacion: [{ sub: [r, '1'] }, ' cis ', { sub: [th, '1'] }, ' · ', { sub: [r, '2'] }, ' cis ', { sub: [th, '2'] }, ' = ', { sub: [r, '1'] }, { sub: [r, '2'] }, ' cis(', { sub: [th, '1'] }, ' + ', { sub: [th, '2'] }, ')'],
      condicion: 'para dividir, el divisor no puede ser 0. El argumento final se puede llevar a [0°, 360°) quitando vueltas.',
      voz: 'Multiplicar estira y gira; dividir encoge y regresa.',
    },
    ahoraTu: {
      voz: 'Separa largos y giros.',
      generar(sem) {
        const rr = azar(sem), op = sem % 2 ? 'div' : 'mul';
        const r2 = rr.uno([1, 2, 3]), r1 = op === 'div' ? r2 * rr.uno([2, 3, 4]) : rr.uno([2, 3, 4, 5]);
        const t1 = rr.uno([60, 90, 150, 210, 240, 300, 330]), t2 = rr.uno([30, 45, 120, 135, 270]);
        const R = op === 'mul' ? r1 * r2 : r1 / r2, T = op === 'mul' ? t1 + t2 : t1 - t2;
        const fmt = ([m, t]) => cis(f(m), t);
        const ds = op === 'mul' ? [
          { id: 'suma', valor: [r1 + r2, T], error: 'CX19', siFuera: 'El argumento está bien. Los módulos se multiplican, no se suman.' },
          { id: 'multi', valor: [R, t1 * t2], error: 'CX20', siFuera: 'El módulo está bien. Los argumentos se suman, no se multiplican.' },
          { id: 'resta', valor: [R, t1 - t2], error: 'CX21', siFuera: 'Restar argumentos es la regla de la división.' },
        ] : [
          { id: 'suma', valor: [R, t1 + t2], error: 'CX22', siFuera: 'El módulo está bien. Al dividir, los argumentos se restan.' },
          { id: 'restam', valor: r1 - r2 > 0 ? [r1 - r2, T] : null, error: 'CX23', siFuera: 'El argumento está bien. Los módulos se dividen, no se restan.' },
          { id: 'alreves', valor: [R, t2 - t1], error: 'CX24', siFuera: 'Se resta al revés: el argumento del dividendo menos el del divisor.' },
        ];
        return {
          pregunta: [`z = ${r1} cis ${t1}° y w = ${r2} cis ${t2}°. ¿Cuánto vale ${op === 'mul' ? 'z·w' : 'z/w'}, con el argumento entre 0° y 360°?`],
          opciones: opciones([R, T], ds, fmt),
          solucion: {
            texto: op === 'mul' ? 'Módulos multiplicados; argumentos sumados.' : 'Módulos divididos; argumentos restados.',
            ecuacion: [op === 'mul' ? `${r1} · ${r2} = ${f(R)};   ${t1}° + ${t2}° = ${T}°` : `${r1} / ${r2} = ${f(R)};   ${t1}° − ${t2}° = ${T}°`, mod360(T) !== T ? ` → ${G(mod360(T))}` : ''],
          },
        };
      },
    },
  };

  // ---------- Idea 4: De Moivre, potencias que giran ----------
  // Cambia: el exponente n, el argumento θ y el módulo r de z. · Permanece: el plano complejo.
  // Progresa: la escalera de puntos z, z², …, zⁿ, cada uno θ más girado. · Se reserva: (1 + i)⁸, con un módulo
  // irracional (la predicción). · Debe verse: zⁿ tiene módulo rⁿ y argumento nθ.
  const escalera = (rv, tv, nv, extra = {}) => {
    const pts = Array.from({ length: nv }, (_, k) => { const m = rv ** (k + 1), t = tv * (k + 1); return [m * Math.cos(rad(t)), m * Math.sin(rad(t))]; });
    const [ux, uy] = pts[nv - 1];
    return Object.assign({
      ventana: { x: [-2.6, 2.6], y: [-2.6, 2.6] }, numeros: 1, nombres: ['Re', 'Im'],
      circulos: [{ r: 1, discontinua: true }],
      curvas: [{ puntos: [[0, 0], ...pts], color: 'i', discontinua: true }],
      segmentos: [{ de: [0, 0], a: [ux, uy], color: 'd', punta: true }],
      arcos: [{ de: 0, a: tv * nv, r: 0.35, color: 'o', espiral: 6 }],
      puntos: pts.map(([px, py], k) => ({ x: px, y: py, color: k === nv - 1 ? 'd' : 'i', abierto: k !== nv - 1, rotulo: k === nv - 1 ? `z${'¹²³⁴⁵⁶'[k]}` : undefined, lado: lado(px, py) })),
      alt: `Potencias de z = ${f(rv)} cis ${tv} grados hasta n = ${nv}: módulo ${f(rv ** nv)} y argumento ${tv * nv} grados`,
    }, extra);
  };
  const demoivre = {
    id: 'de-moivre',
    titulo: 'De Moivre: potencias que giran',
    temas: ['Teorema de De Moivre'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Mueve r, θ y n. Cada potencia de z gira θ más y multiplica el largo por r: los puntos forman una escalera en espiral.',
      voz: 'Cuenta cuántas veces se suma el giro.',
      controles: [
        { id: 'r', etiqueta: 'r', color: 'c-d', min: 0.8, max: 1.2, paso: 0.1, inicio: 1.1, decimales: 1 },
        { id: 't', etiqueta: 'θ', color: 'c-o', min: 15, max: 60, paso: 15, inicio: 30, unidad: '°', decimales: 0 },
        { id: 'n', etiqueta: 'n', color: 'c-h', min: 1, max: 5, paso: 1, inicio: 3, decimales: 0 },
      ],
      dibujo: val => ({ datos: escalera(val.r, val.t, val.n), estado: {} }),
      lectura: val => [{ sup: ['z', n] }, ` = ${f(val.r ** val.n)} cis ${G(val.n * val.t)}`],
      minimo: 3,
    },
    predice: {
      pregunta: ['¿Cuánto vale ', { sup: ['(1 + i)', '8'] }, '?'],
      voz: 'Antes de multiplicar ocho veces, escribe 1 + i con su largo y su giro.',
      opciones: [
        { id: 'c', texto: '16', correcta: true },
        { id: 'reparte', texto: '2', error: 'POL-REPARTE', siFuera: 'Sería cierto si la potencia se repartiera: 1⁸ + i⁸. Una potencia de una suma no se reparte.' },
        { id: 'modulo', texto: '256', error: 'AL9', siFuera: 'El giro de 360° está bien. El módulo de 1 + i es √2, no 1 + 1.' },
        { id: 'porn', texto: '8√2', error: 'CX31', siFuera: 'El giro está bien. El módulo se eleva a la 8: (√2)⁸ = 16, no 8 · √2.' },
      ],
      dibujo: { datos: escalera(Math.SQRT2, 45, 1, { ventana: { x: [-6, 19], y: [-10, 5] }, numeros: 0, circulos: [], alt: 'El complejo 1 + i en el plano' }), estado: {} },
      revelar: { datos: escalera(Math.SQRT2, 45, 8, { ventana: { x: [-6, 19], y: [-10, 5] }, numeros: 0, circulos: [], puntos: Array.from({ length: 8 }, (_, k) => { const m = Math.SQRT2 ** (k + 1), t = 45 * (k + 1); return { x: m * Math.cos(rad(t)), y: m * Math.sin(rad(t)), color: k === 7 ? 'd' : 'i', abierto: k !== 7, rotulo: k === 7 ? '(1 + i)⁸ = 16' : undefined, lado: 'no' }; }) }), estado: {} },
      coincide: 'Coincide: ocho giros de 45° son una vuelta, y (√2)⁸ = 16.',
      noCoincide: 'Revisemos la escalera: el octavo punto cae en el eje real, en 16.',
    },
    mira: {
      datos: escalera(Math.SQRT2, 45, 8, {
        ventana: { x: [-6, 19], y: [-10, 5] }, numeros: 0, circulos: [],
        curvas: [{ puntos: [[0, 0], ...Array.from({ length: 8 }, (_, k) => { const m = Math.SQRT2 ** (k + 1), t = 45 * (k + 1); return [m * Math.cos(rad(t)), m * Math.sin(rad(t))]; })], color: 'i', discontinua: true, desde: 2 }],
        segmentos: [{ de: [0, 0], a: [16, 0], color: 'd', punta: true, rotulo: '16', desde: 3 }],
        arcos: [{ de: 0, a: 360, r: 1.6, color: 'o', espiral: 6, desde: 2 }],
        puntos: [{ x: 1, y: 1, color: 'i', rotulo: '1 + i', lado: 'no', desde: 1 }],
      }),
      voz: 'Largo y giro por separado.',
      pasos: [
        { estado: { corte: 1 }, texto: '1 + i mide √2 y gira 45°.', ecuacion: ['1 + i = √2 cis 45°'] },
        { estado: { corte: 2 }, texto: 'Ocho potencias: ocho giros de 45°, una vuelta entera.', ecuacion: ['8 · 45° = 360°'] },
        { estado: { corte: 3 }, texto: 'El largo se eleva a la 8 y cae en el eje real.', ecuacion: [{ sup: ['(√2)', '8'] }, ' = 16;   ', { sup: ['(1 + i)', '8'] }, ' = 16 cis 360° = 16'] },
      ],
    },
    regla: {
      texto: 'Teorema de De Moivre: para elevar un complejo a la n, se eleva su módulo a la n y se multiplica su argumento por n.',
      ecuacion: [{ sup: [['(', r, ' cis ', th, ')'], n] }, ' = ', { sup: [r, n] }, ' cis(', n, th, ')'],
      condicion: 'n es un entero. Si n es negativo, z no puede ser 0.',
      voz: 'n giros iguales y n estiramientos iguales.',
    },
    ahoraTu: {
      voz: 'Escribe z con su largo y su giro antes de elevar.',
      generar(sem) {
        const rr = azar(sem), rv = rr.uno([1, 2, 'r2', 'r2', 2]), tv = rr.uno([30, 45, 60, 90, 120, 135, 150]), nv = rr.ent(2, 6);
        const fmt = ([m, t]) => cis(m, t);
        const R = potTxt(rv, nv);
        return {
          pregunta: ['¿Cuánto vale ', { sup: [`(${rTxt(rv)} cis ${tv}°)`, String(nv)] }, ', con el argumento entre 0° y 360°?'],
          opciones: opciones([R, tv * nv], [
            { id: 'sin-mod', valor: rv === 1 ? null : [rTxt(rv), tv * nv], error: 'CX30', siFuera: 'El giro está bien. El módulo también se eleva a la n.' },
            { id: 'porn', valor: [rv === 'r2' ? `${nv}√2` : `${nv * rv}`, tv * nv], error: 'CX31', siFuera: 'El giro está bien. El módulo se eleva a la n; no se multiplica por n.' },
            { id: 'fijo', valor: [R, tv], error: 'POL-ARG-FIJO', siFuera: 'El módulo está bien. El argumento también cambia: se multiplica por n.' },
          ], fmt),
          solucion: {
            texto: `Módulo a la ${nv}; argumento por ${nv}.`,
            ecuacion: [{ sup: [`(${rTxt(rv)})`, String(nv)] }, ` = ${R};   ${nv} · ${tv}° = ${nv * tv}°${mod360(nv * tv) !== nv * tv ? ' → ' + G(mod360(nv * tv)) : ''}`],
          },
        };
      },
    },
  };

  // ---------- Idea 5: la forma exponencial ----------
  // Cambia: el módulo r y el ángulo θ (en radianes) de r·e^{iθ}. · Permanece: el plano complejo y la circunferencia de radio 1.
  // Progresa: el punto que gira sobre la circunferencia de radio r. · Se reserva: θ = π, media vuelta (la predicción).
  // Debe verse: e^{iθ} = cos θ + i sen θ es un punto de la circunferencia unitaria, no un número real grande.
  const PI = ['0', 'π/6', 'π/3', 'π/2', '2π/3', '5π/6', 'π', '7π/6', '4π/3', '3π/2', '5π/3', '11π/6'];
  const piTxt = gr => PI[Math.round(mod360(gr) / 30)] || `${f(gr)}°`;
  const ePow = (m, gr) => [m === 1 ? '' : `${m}`, { sup: ['e', `i${piTxt(gr)}`] }];
  const expo = (m, gr, extra = {}) => {
    const px = m * Math.cos(rad(gr)), py = m * Math.sin(rad(gr));
    return Object.assign({
      ventana: { x: [-2.4, 2.4], y: [-2.4, 2.4] }, numeros: 1, nombres: ['Re', 'Im'],
      circulos: [{ r: 1, discontinua: true }, ...(m !== 1 ? [{ r: m, discontinua: true }] : [])],
      segmentos: [{ de: [0, 0], a: [px, py], color: 'd', punta: true }],
      arcos: [{ de: 0, a: gr, r: 0.45, color: 'o', rotulo: piTxt(gr) }],
      puntos: [{ x: px, y: py, color: 'i', rotulo: `${f(px)} ${py < -1e-9 ? '−' : '+'} ${f(Math.abs(py))}i`, lado: lado(px, py) }],
      alt: `${f(m)} e elevado a i ${piTxt(gr)}: el punto ${f(px)} + ${f(py)} i`,
    }, extra);
  };
  const exponencial = {
    id: 'exponencial',
    titulo: 'La forma exponencial',
    temas: ['Forma exponencial'],
    pieza: 'trig-plano',
    juega: {
      consigna: ['Mueve r y θ. El número ', r, { sup: ['e', ['i', th]] }, ' es el punto de largo r y giro θ; la lectura da a + bi.'],
      voz: 'e con exponente imaginario no crece: gira.',
      controles: [
        { id: 'm', etiqueta: 'r', color: 'c-d', min: 1, max: 2, paso: 0.5, inicio: 1, decimales: 1 },
        { id: 'g', etiqueta: 'θ', color: 'c-o', min: 0, max: 150, paso: 30, inicio: 60, unidad: '°', decimales: 0 },
      ],
      dibujo: val => ({ datos: expo(val.m, val.g), estado: {} }),
      lectura: val => [...ePow(val.m, val.g), ` = ${f(val.m * Math.cos(rad(val.g)))} ${Math.sin(rad(val.g)) < 0 ? '−' : '+'} ${f(Math.abs(val.m * Math.sin(rad(val.g))))}i`],
      minimo: 3,
    },
    predice: {
      pregunta: ['¿Cuánto vale ', { sup: ['e', 'iπ'] }, '?'],
      voz: 'Piensa en el giro de π radianes desde el eje real.',
      opciones: [
        { id: 'c', texto: '−1', correcta: true },
        { id: 'real', texto: 'Cerca de 23,14', error: 'POL-EXP-REAL', siFuera: 'Ese es e elevado a π, sin la i. Con la i, el exponente es un giro, no un crecimiento.' },
        { id: 'uno', texto: '1', error: 'POL-CUADRANTE', siFuera: 'Sería cierto con un giro de 2π, una vuelta entera. π es media vuelta.' },
        { id: 'i', texto: 'i', error: 'POL-CUADRANTE', siFuera: 'i es un giro de π/2, un cuarto de vuelta. π es media vuelta.' },
      ],
      dibujo: { datos: expo(1, 0, { segmentos: [], arcos: [], puntos: [{ x: 1, y: 0, color: 'i', rotulo: '1', lado: 'ne' }], alt: 'La circunferencia de radio 1 y el punto 1' }), estado: {} },
      revelar: { datos: expo(1, 180, { puntos: [{ x: -1, y: 0, color: 'i', rotulo: '−1', lado: 'no' }] }), estado: {} },
      coincide: 'Coincide: media vuelta lleva el 1 al −1.',
      noCoincide: 'Revisemos el giro: π radianes es media vuelta, hasta −1.',
    },
    mira: {
      datos: expo(1, 180, {
        segmentos: [{ de: [0, 0], a: [-1, 0], color: 'd', punta: true, desde: 2 }],
        arcos: [{ de: 0, a: 180, r: 0.45, color: 'o', rotulo: 'π', desde: 2 }],
        puntos: [{ x: 1, y: 0, color: 'i', abierto: true, rotulo: '1', lado: 'ne', desde: 1 }, { x: -1, y: 0, color: 'i', rotulo: '−1', lado: 'no', desde: 3 }],
      }),
      voz: 'Un giro, escrito como exponente.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Se parte del 1, en el eje real.', ecuacion: [{ sup: ['e', 'i·0'] }, ' = 1'] },
        { estado: { corte: 2 }, texto: ['El punto de la circunferencia que gira ', th, ' se escribe así.'], ecuacion: [{ sup: ['e', ['i', th]] }, ' = cos ', th, ' + i sen ', th] },
        { estado: { corte: 3 }, texto: 'Con θ = π, media vuelta, se llega a −1.', ecuacion: [{ sup: ['e', 'iπ'] }, ' = cos π + i sen π = −1'] },
      ],
    },
    regla: {
      texto: 'La forma exponencial escribe el mismo complejo con el giro como exponente. Multiplicar suma los exponentes, igual que se suman los argumentos.',
      ecuacion: [r, { sup: ['e', ['i', th]] }, ' = ', r, '(cos ', th, ' + i sen ', th, ');   ', { sup: ['e', 'iα'] }, ' · ', { sup: ['e', 'iβ'] }, ' = ', { sup: ['e', 'i(α + β)'] }],
      condicion: 'θ va en radianes. r es el módulo, mayor o igual que 0.',
      voz: 'Exponente imaginario: giro; número delante: largo.',
    },
    ahoraTu: {
      pieza: 'trig-plano',
      voz: 'Lee el giro en radianes y ubica el punto.',
      generar(sem) {
        const rr = azar(sem), m = rr.uno([2, 4, 6]), gr = rr.uno([30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]);
        const A = por(m, cosE(gr)), B = por(m, senE(gr));
        const abs = ([p, q, s]) => [Math.abs(p), q, s];
        return {
          pregunta: ['Escribe ', ...ePow(m, gr), ' en la forma a + bi.'],
          opciones: opciones(bin(A, B), [
            { id: 'cruza', valor: bin(B, A), error: 'TR11', siFuera: 'Los dos números están bien, pero cruzados: la parte real usa el coseno.' },
            { id: 'ref', valor: bin(abs(A), abs(B)), error: 'CX18', siFuera: 'Los tamaños están bien. Los signos salen del cuadrante del giro.' },
            { id: 'sin-r', valor: bin(cosE(gr), senE(gr)), error: 'CP14', siFuera: 'Ese es el punto de radio 1. Falta multiplicar por el módulo.' },
            { id: 'sin-i', valor: B[0] && A[0] && B[2] === A[2] ? txt(simp([A[0] * B[1] + B[0] * A[1], A[1] * B[1], A[2]])) : null, error: 'POL-SIN-I', siFuera: 'Las partes están bien, pero se sumaron: la parte imaginaria va con i.' },
          ], v => v),
          solucion: {
            texto: 'Se multiplica el módulo por el coseno y por el seno.',
            ecuacion: [`${m}(cos ${piTxt(gr)} + i sen ${piTxt(gr)}) = ${bin(A, B)}`],
            dibujo: { datos: expo(m, gr, { ventana: { x: [-6.8, 6.8], y: [-6.8, 6.8] }, numeros: 2, arcos: [{ de: 0, a: gr, r: 1.2, color: 'o', rotulo: piTxt(gr) }], puntos: [{ x: valE(A), y: valE(B), color: 'i', rotulo: bin(A, B), lado: lado(valE(A), valE(B)) }] }), estado: {} },
          },
        };
      },
    },
  };

  return {
    unidad: 'trigonometria.coordenadas-polares-y-complejos',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/trig-plano.js'],
    historia: {
      texto: 'En el siglo XVIII, Abraham de Moivre encontró una relación entre las potencias de un número complejo y los múltiplos de un ángulo. Con ella, multiplicar se pudo ver como girar y estirar. La idea no nació sola: los complejos y sus notaciones siguieron cambiando con el trabajo de varios autores.',
      pregunta: '¿Qué tiene que ver multiplicar con girar?',
      fuente: { titulo: 'J. J. O’Connor y E. F. Robertson, «Abraham de Moivre», MacTutor, University of St Andrews', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/De_Moivre/' },
    },
    ideas: [polares, argumento, multiplicar, demoivre, exponencial],
  };
});
