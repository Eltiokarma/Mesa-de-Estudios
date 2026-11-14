/*
 * Teoría de «Movimiento parabólico y circular» (fisica.movimiento-parabolico-y-circular). Molde: docs/teoria.md y
 * la unidad de referencia fisica.movimiento-rectilineo.
 * Fuente del contenido: docs/teoria/matriz/fisica.json (unidad 3), las precisiones de física del expediente
 * (30° y 60° llegan igual solo con la misma rapidez, misma altura y sin aire) y historia-ecuaciones.
 * Colores (regla 4): posiciones x, y y arco s turquesa (c-i); v naranja (c-o); toda aceleración (g, a_T, a_c) verde
 * (c-d); t rojo (c-h). θ, ω y r van en tinta: no cambian de color entre ideas.
 * Códigos de error: P1, P2 y K3 de docs/investigacion/cinematica-ideas-erroneas.md; D9 de dinamica. Nuevos
 * (hipótesis, sin dato): TP-SUBIDA, TP-V0, TP-MEDIO, AN-GRADOS, AN-SIN-R, AN-VUELTA, MC-A0, MC-VR, MC-V2R,
 * MC-ATOTAL, MC-SOLO-AT, MC-SUMA, MC-SOLO-AC.
 * Estado: completa (14 nov 2026): cuatro ideas que cubren los seis temas del catálogo.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: cuatro relaciones del movimiento en el plano, cada una jugada antes de preguntarla.
 *   Persona y condiciones: postulante de 4.º, celular de gama baja a 360 px, a veces sin conexión.
 *   Resultado observable: halla vuelo, altura y alcance; pasa de grados a arco; calcula a_c y la aceleración total.
 *   Orden de atención: 1.º la trayectoria o la rueda · 2.º las flechas · acción: el botón fijo · fondo: Tilo.
 *   Estados: juego sin tocar · predicción pendiente · coincide / no coincide · paso de mira · caso nuevo · «No sé».
 *   Duda que resuelve: ¿por qué algo con rapidez constante puede tener aceleración?
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const x = { v: 'c-i', t: 'x' }, y = { v: 'c-i', t: 'y' }, s_ = { v: 'c-i', t: 's' }, v = { v: 'c-o', t: 'v' };
  const g = { v: 'c-d', t: 'g' }, t = { v: 'c-h', t: 't' }, a = { v: 'c-d', t: 'a' };
  const vx = { sub: [v, 'x'] }, vy = { sub: [v, 'y'] }, v0 = { sub: [v, '0'] };
  const aT = { sub: [a, 'T'] }, ac = { sub: [a, 'c'] };
  const G = 10; // convención didáctica, declarada en la condición de la regla
  const rad = d => d * Math.PI / 180;
  // Azar con semilla para «Ahora tú» (el mismo de nucleo/azar.js, en corto).
  function azar(sm) {
    let q = (sm * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = arr => arr[Math.floor(r() * arr.length)];
    return r;
  }
  // Opciones distintas: la correcta primero; los distractores que repiten un valor se descartan.
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      if (!Number.isFinite(d.valor)) continue;
      const txt = fmt(d.valor);
      if (vistos.has(txt)) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }
  // Seno y coseno de los ángulos de academia: 37° y 53° son los del triángulo 3-4-5 (como en la pieza triangulo).
  const SEN = { 30: 0.5, 37: 0.6, 45: Math.SQRT1_2, 53: 0.8, 60: Math.sqrt(3) / 2 };
  const COS = { 30: Math.sqrt(3) / 2, 37: 0.8, 45: Math.SQRT1_2, 53: 0.6, 60: 0.5 };

  // ---------- Idea 1: un reloj, dos movimientos (tiro parabólico) ----------
  // Cambia: v₀ y el ángulo de salida · Permanece: g hacia abajo y el reloj común (marcas cada 0,5 s) ·
  // Progresa: las sombras en el piso, equidistantes, y las alturas, que se juntan arriba ·
  // Se reserva: la cima, donde v_y = 0 y v_x sigue igual · Debe verse: el eje x es MRU y el eje y es caída libre.
  const EJE_TIRO = (xmax = 65, ymax = 42) => ({
    x: { min: 0, max: xmax, paso: 10, nombre: 'x', unidad: 'm', decimales: 0, color: 'i' },
    y: { min: 0, max: ymax, paso: 10, nombre: 'y', unidad: 'm', decimales: 0, color: 'i' },
  });
  function tiro(vi, ang, extra = {}, o = {}) {
    const ux = vi * COS[ang], uy = vi * SEN[ang], T = 2 * uy / G;
    const pos = tt => [ux * tt, uy * tt - G * tt * tt / 2];
    const curva = Array.from({ length: 41 }, (_, k) => pos(T * k / 40));
    const marcas = [];
    for (let k = 0; k * 0.5 <= T + 1e-9; k++) marcas.push(pos(k * 0.5));
    const puntos = [];
    for (const [px, py] of marcas) {
      puntos.push({ x: px, y: py, color: 'i', desde: o.marcas || 0 });
      puntos.push({ x: px, y: 0, color: 'i', abierto: true, desde: o.sombras || 0 });
    }
    return Object.assign(EJE_TIRO(o.xmax, o.ymax), { curvas: [{ puntos: curva, color: 'i', desde: o.curva || 0 }], puntos }, extra);
  }
  const tiroIdea = {
    id: 'un-reloj-dos-ejes',
    titulo: 'Un reloj, dos movimientos',
    temas: ['Movimiento en dos dimensiones', 'Tiro parabólico'],
    pieza: 'ejes',
    juega: {
      consigna: 'Elige la rapidez y el ángulo de salida. Cada medio segundo queda una marca y su sombra en el piso.',
      voz: 'Mira las sombras del piso: ¿cómo están separadas?',
      controles: [
        { id: 'v0', etiqueta: 'v₀', color: 'c-o', min: 10, max: 25, paso: 5, inicio: 20, unidad: 'm/s', decimales: 0 },
        { id: 'ang', etiqueta: 'Ángulo', opciones: [30, 37, 45, 53, 60].map(k => ({ valor: k, texto: `${k}°` })), inicio: 45 },
      ],
      dibujo: val => ({ datos: tiro(val.v0, val.ang), estado: {} }),
      lectura: val => [vx, ` = ${f(val.v0 * COS[val.ang], 1)} m/s siempre · vuelo ${f(2 * val.v0 * SEN[val.ang] / G, 2)} s`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Desde 20 m de altura, a la vez, una pelota se suelta y otra sale horizontal a 10 m/s. Sin aire, ¿cuál llega primero al piso?',
      opciones: [
        { id: 'c', texto: 'Llegan a la vez', correcta: true },
        { id: 'soltada', texto: 'La que se soltó', error: 'P1', siFuera: 'Recorre menos camino, es cierto. Pero hacia abajo las dos parten de vy = 0 con el mismo g.' },
        { id: 'lanzada', texto: 'La lanzada: va más rápido', error: 'P2', siFuera: 'Va más rápido de lado. Esa rapidez horizontal no cambia cuánto tarda en caer.' },
        { id: 'pesada', texto: 'Depende de cuál pese más', error: 'C2', siFuera: 'Con aire, la forma y el peso importan. Sin aire, caen con el mismo g.' },
      ],
      dibujo: { datos: Object.assign(EJE_TIRO(25, 22), { puntos: [{ x: 0, y: 20, color: 'o', rotulo: 'salen las dos' }] }), estado: {} },
      revelar: {
        datos: Object.assign(EJE_TIRO(25, 22), {
          curvas: [{ puntos: [[0, 20], [0, 0]], color: 'i' }, { puntos: Array.from({ length: 21 }, (_, k) => { const tt = 2 * k / 20; return [10 * tt, 20 - 5 * tt * tt]; }), color: 'o' }],
          puntos: [0, 0.5, 1, 1.5, 2].flatMap(tt => [{ x: 0, y: 20 - 5 * tt * tt, color: 'i' }, { x: 10 * tt, y: 20 - 5 * tt * tt, color: 'o', rotulo: tt === 2 ? '2 s' : undefined }]),
        }), estado: {},
      },
      coincide: 'Coincide: en cada instante están a la misma altura. Las dos caen 20 m en 2 s.',
    },
    mira: {
      datos: tiro(25, 53, {
        puntos: [
          ...[0, 1, 2, 3, 4].map(k => ({ x: 15 * k, y: 0, color: 'i', abierto: true, desde: 2 })),
          { x: 0, y: 0, color: 'o', rotulo: '25 m/s a 53°', desde: 1 },
          { x: 30, y: 20, color: 'i', rotulo: 'cima: 20 m', guias: true, desde: 3 },
          { x: 60, y: 0, color: 'i', rotulo: '60 m', desde: 4 },
        ],
      }, { curva: 1 }),
      pasos: [
        { estado: { corte: 1 }, texto: 'La velocidad de salida se parte en dos: de lado y hacia arriba.', ecuacion: [vx, ' = 25 · 0,6 = 15 m/s   ·   ', { sub: [v, 'y0'] }, ' = 25 · 0,8 = 20 m/s'] },
        { estado: { corte: 2 }, texto: 'De lado no hay aceleración: avanza 15 m cada segundo.', ecuacion: [x, ' = 15 ', t] },
        { estado: { corte: 3 }, texto: 'Hacia arriba es caída libre: vy llega a 0 a los 2 s.', ecuacion: [{ sub: [y, 'máx'] }, ' = ½ · 20 · 2 = 20 m'] },
        { estado: { corte: 4 }, texto: 'Baja otros 2 s. En 4 s, de lado avanzó 15 · 4.', ecuacion: ['R = ', vx, ' · ', t, ' = 15 · 4 = 60 m'] },
      ],
    },
    regla: {
      texto: 'El tiro se separa en dos movimientos con el mismo reloj: de lado, velocidad constante; hacia arriba, caída libre.',
      ecuacion: [x, ' = ', vx, t, '   ·   ', y, ' = ', { sub: [v, 'y0'] }, t, ' − ½ ', g, { sup: [t, '2'] }],
      condicion: 'sin aire y con g constante (aquí 10 m/s²). Igual alcance a 30° y 60° pide igual rapidez y altura.',
    },
    ahoraTu: {
      generar(sm) {
        const r = azar(sm), vi = r.de([10, 15, 20, 25, 30]), ang = r.de([37, 53]), pide = ['vuelo', 'altura', 'alcance'][sm % 3];
        const ux = vi * COS[ang], uy = vi * SEN[ang], T = 2 * uy / G, H = uy * uy / (2 * G), R = ux * T;
        const pre = ['Se lanza una pelota desde el piso con ', v0, ` = ${f(vi)} m/s a ${ang}° sobre la horizontal. Sin aire y con g = 10 m/s², `];
        // Ejes con casi la misma escala en x y en y (el plano mide 254 × 170 px): la parábola no se deforma.
        const xmax = Math.ceil(R / 10) * 10 + 10, ymax = Math.max(Math.ceil(H / 10) * 10 + 10, Math.round(xmax * 0.67 / 10) * 10);
        const dib = { datos: Object.assign(EJE_TIRO(xmax, ymax), { puntos: [{ x: 0, y: 0, color: 'o', rotulo: `${f(vi)} m/s, ${ang}°` }] }), estado: {} };
        const sol = { datos: tiro(vi, ang, {}, { xmax, ymax }), estado: {} };
        if (pide === 'vuelo') return {
          pregunta: [...pre, '¿cuánto tiempo está en el aire?'], dibujo: dib,
          opciones: opciones(T, [
            { id: 'subida', valor: T / 2, error: 'TP-SUBIDA', siFuera: 'Ese es el tiempo hasta la cima. Después tarda lo mismo en bajar.' },
            { id: 'v0', valor: 2 * vi / G, error: 'TP-V0', siFuera: 'Eso usa v₀ entera. Hacia arriba solo cuenta su parte vertical.' },
            { id: 'vx', valor: 2 * ux / G, error: 'TP-V0', siFuera: 'Eso usa la parte horizontal; el vuelo lo decide la vertical.' },
          ], n => `${f(n, 2)} s`),
          solucion: { texto: `Sube con vy = ${f(uy, 1)} m/s; pierde 10 m/s por segundo y baja igual.`, ecuacion: [t, ` = 2 · ${f(uy, 1)} / 10 = ${f(T, 2)} s`], dibujo: sol },
        };
        if (pide === 'altura') return {
          pregunta: [...pre, '¿qué altura máxima alcanza?'], dibujo: dib,
          opciones: opciones(H, [
            { id: 'sin-medio', valor: 2 * H, error: 'TP-MEDIO', siFuera: 'Eso olvida el ½: al subir, la rapidez vertical media es la mitad.' },
            { id: 'v0', valor: vi * vi / (2 * G), error: 'TP-V0', siFuera: 'Esa sería la altura lanzando hacia arriba con toda v₀.' },
            { id: 'vx', valor: ux * ux / (2 * G), error: 'TP-V0', siFuera: 'Eso usa la parte horizontal; la altura la decide la vertical.' },
          ], n => `${f(n, 2)} m`),
          solucion: { texto: `Es caída libre hacia arriba con vy = ${f(uy, 1)} m/s.`, ecuacion: [{ sub: [y, 'máx'] }, ` = ${f(uy, 1)}² / 20 = ${f(H, 2)} m`], dibujo: sol },
        };
        return {
          pregunta: [...pre, '¿a qué distancia del punto de salida cae?'], dibujo: dib,
          opciones: opciones(R, [
            { id: 'mitad', valor: R / 2, error: 'TP-SUBIDA', siFuera: 'Ese es el avance hasta la cima: falta la bajada.' },
            { id: 'v0', valor: vi * T, error: 'TP-V0', siFuera: 'Eso usa v₀ entera. De lado avanza solo con vx.' },
            { id: 'vy', valor: uy * T, error: 'TP-V0', siFuera: 'Eso usa la parte vertical; de lado avanza con vx.' },
          ], n => `${f(n, 2)} m`),
          solucion: { texto: `Vuela ${f(T, 2)} s y de lado avanza ${f(ux, 1)} m cada segundo.`, ecuacion: ['R = ', vx, ' · ', t, ` = ${f(ux, 1)} · ${f(T, 2)} = ${f(R, 2)} m`], dibujo: sol },
        };
      },
    },
  };

  // ---------- Idea 2: el ángulo se mide con el arco (magnitudes angulares) ----------
  // Cambia: el radio y el ángulo girado · Permanece: el centro y el radio de partida · Progresa: el arco s, que crece
  // con θ y con r · Se reserva: dos puntos del mismo disco con igual ω y distinta v ·
  // Debe verse: s = rθ solo con θ en radianes.
  const VISTA_RUEDA = { x0: -4.6, x1: 4.6, y0: -4.4, y1: 4.4 };
  const enCirculo = (r, deg) => [r * Math.cos(rad(deg)), r * Math.sin(rad(deg))];
  function arcoRueda(r, deg, conTexto = true, alt, rTexto = r) {
    const sv = r * rad(deg);
    return {
      vista: VISTA_RUEDA, alt: alt || `Rueda de radio ${f(r, 1)} m que gira ${f(deg, 0)}°: el borde recorre un arco de ${f(sv, 2)} m.`,
      arcos: [{ c: [0, 0], r, de: 0, a: 360, grosor: 'fino' }, { c: [0, 0], rpx: 22, de: 0, a: deg, rotulo: 'θ' }, { c: [0, 0], r, de: 0, a: deg, color: 'i', grosor: 'variable' }],
      segmentos: [{ de: [0, 0], a: enCirculo(r, 0), texto: `r = ${f(rTexto, 1)} m`, lado: -1 }, { de: [0, 0], a: enCirculo(r, deg) }],
      discos: [{ c: enCirculo(r, deg), r: 0.18, color: 'i' }],
      textos: conTexto ? [{ en: enCirculo(r + 0.75, deg / 2), texto: `s = ${f(sv, 2)} m`, color: 'i' }] : [],
    };
  }
  const angulares = {
    id: 'arco-y-radian',
    titulo: 'El arco mide el ángulo',
    temas: ['Magnitudes angulares'],
    pieza: 'fis-lienzo',
    juega: {
      consigna: 'Elige el radio de la rueda y cuánto gira. Mira el arco que recorre el punto del borde.',
      voz: 'Duplica el radio sin cambiar el ángulo. ¿Qué pasa con el arco?',
      controles: [
        { id: 'r', etiqueta: 'r', min: 1, max: 4, paso: 0.5, inicio: 2, unidad: 'm', decimales: 1 },
        { id: 'deg', etiqueta: 'Gira', min: 30, max: 360, paso: 30, inicio: 90, unidad: '°', decimales: 0 },
      ],
      dibujo: val => ({ datos: arcoRueda(val.r, val.deg), estado: {} }),
      lectura: val => [`θ = ${f(rad(val.deg), 2)} rad · `, s_, ` = ${f(val.r * rad(val.deg), 2)} m`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Otra rueda tiene radio 3 m y gira 60°. ¿Cuánto recorre un punto de su borde?',
      opciones: [
        { id: 'c', texto: `${f(Math.PI, 2)} m (π m)`, correcta: true },
        { id: 'grados', texto: '180 m', error: 'AN-GRADOS', siFuera: 'Multiplicar r por el ángulo está bien, pero con el ángulo en radianes: 60° = π/3.' },
        { id: 'sin-r', texto: `${f(Math.PI / 3, 2)} m`, error: 'AN-SIN-R', siFuera: 'Ese es el ángulo en radianes. El arco crece con el radio: falta multiplicar por 3.' },
        { id: 'vuelta', texto: `${f(6 * Math.PI, 2)} m`, error: 'AN-VUELTA', siFuera: 'Esa es la vuelta entera, 2πr. 60° es un sexto de vuelta.' },
      ],
      dibujo: { datos: arcoRueda(3, 60, false, 'Rueda de radio 3 m que gira 60°; el arco recorrido no está rotulado.'), estado: {} },
      revelar: { datos: arcoRueda(3, 60), estado: {} },
      coincide: 'Coincide: 60° es π/3 rad, y el arco es 3 veces eso.',
    },
    mira: {
      datos: {
        vista: VISTA_RUEDA, alt: 'Disco que gira 90° en 2 s: el punto a 1 m recorre 1,57 m y el punto a 3 m recorre 4,71 m.',
        arcos: [{ c: [0, 0], r: 3, de: 0, a: 360, grosor: 'fino' }, { c: [0, 0], r: 1, de: 0, a: 360, grosor: 'fino' },
          { c: [0, 0], rpx: 22, de: 0, a: 90, rotulo: 'θ', paso: 1 },
          { c: [0, 0], r: 1, de: 0, a: 90, color: 'i', grosor: 'variable', paso: 2 }, { c: [0, 0], r: 3, de: 0, a: 90, color: 'i', grosor: 'variable', paso: 3 }],
        segmentos: [{ de: [0, 0], a: [3, 0] }, { de: [0, 0], a: [0, 3], paso: 1 }],
        discos: [{ c: [1, 0], r: 0.15, hasta: 0 }, { c: [3, 0], r: 0.15, hasta: 0 }, { c: [0, 1], r: 0.15, color: 'i', paso: 1 }, { c: [0, 3], r: 0.15, color: 'i', paso: 1 }],
        textos: [{ en: [1.35, 1.35], texto: '1,57 m', color: 'i', paso: 2 }, { en: [2.75, 2.75], texto: '4,71 m', color: 'i', paso: 3 }],
        flechas: [{ de: [0, 1], d: [-0.785, 0], escala: 40, color: 'o', rotulo: 'v', paso: 4 }, { de: [0, 3], d: [-2.36, 0], escala: 40, color: 'o', rotulo: 'v', paso: 4 }],
      },
      pasos: [
        { estado: { paso: 1 }, texto: 'En 2 s el disco gira 90°: todos sus puntos giran lo mismo.', ecuacion: ['ω = ', { frac: ['θ', t] }, ' = ', { frac: ['π/2', '2'] }, ` = ${f(Math.PI / 4, 2)} rad/s`] },
        { estado: { paso: 2 }, texto: 'El punto a 1 m recorre un arco corto.', ecuacion: [s_, ` = 1 · π/2 = ${f(Math.PI / 2, 2)} m`] },
        { estado: { paso: 3 }, texto: 'El punto a 3 m recorre el triple en el mismo tiempo.', ecuacion: [s_, ` = 3 · π/2 = ${f(3 * Math.PI / 2, 2)} m`] },
        { estado: { paso: 4 }, texto: 'Misma ω, distinta rapidez: la de afuera va tres veces más rápido.', ecuacion: [v, ' = ω r'] },
      ],
    },
    regla: {
      texto: 'Un ángulo en radianes es el arco dividido entre el radio. Por eso el arco y la rapidez crecen con el radio.',
      ecuacion: [s_, ' = θ r   ·   ω = ', { frac: ['Δθ', ['Δ', t]] }, '   ·   ', v, ' = ω r'],
      condicion: 'θ va en radianes (180° = π rad). En un disco rígido, todos los puntos tienen la misma ω.',
    },
    ahoraTu: {
      pieza: 'fis-lienzo',
      generar(sm) {
        const r = azar(sm), deg = r.de([30, 45, 60, 90, 120, 135, 180, 270]), ra = r.de([2, 3, 4, 6]);
        const k = ra * deg / 180; // s = k·π
        const fpi = n => `${f(n, 2)}π m`;
        const ops = [{ id: 'c', texto: fpi(k), correcta: true },
          { id: 'grados', texto: `${f(ra * deg)} m`, error: 'AN-GRADOS', siFuera: 'Eso multiplica r por los grados. Primero pasa el ángulo a radianes.' },
          { id: 'sin-r', texto: fpi(deg / 180), error: 'AN-SIN-R', siFuera: 'Ese es el ángulo en radianes; falta multiplicar por el radio.' },
          { id: 'vuelta', texto: fpi(2 * ra), error: 'AN-VUELTA', siFuera: 'Esa es la vuelta completa, 2πr.' }];
        return {
          pregunta: `Una rueda de radio ${f(ra)} m gira ${deg}°. ¿Qué arco recorre un punto de su borde?`,
          dibujo: { datos: arcoRueda(Math.min(4, ra * 0.7), deg, false, `Rueda de radio ${f(ra)} m que gira ${deg}°; el arco no está rotulado.`, ra), estado: {} },
          opciones: ops.filter((o, i) => ops.findIndex(q => q.texto === o.texto) === i),
          solucion: { texto: `${deg}° son ${f(deg / 180, 2)}π rad; el arco es r veces eso.`, ecuacion: [s_, ` = ${f(ra)} · ${f(deg / 180, 2)}π = ${fpi(k)}`] },
        };
      },
    },
  };

  // ---------- Idea 3: rapidez constante, velocidad que gira (MCU) ----------
  // Cambia: v y r · Permanece: la rapidez en toda la vuelta · Progresa: la flecha de v, que gira; llevada a un mismo
  // origen, deja ver Δv · Se reserva: Δv, que apunta al centro · Debe verse: a_c = v²/r hacia el centro.
  const KV = 15, KA = 10; // px por m/s y por m/s², fijos para toda la unidad
  function mcu(vv, rr, o = {}) {
    const acc = vv * vv / rr, angs = o.angs || [60];
    const tang = deg => [-Math.sin(rad(deg)) * vv, Math.cos(rad(deg)) * vv];
    const rad_ = deg => [-Math.cos(rad(deg)) * acc, -Math.sin(rad(deg)) * acc];
    return {
      vista: VISTA_RUEDA, alt: o.alt || `Un cuerpo gira con rapidez constante de ${f(vv, 1)} m/s en un círculo de ${f(rr, 1)} m; su aceleración, de ${f(acc, 2)} m/s², apunta al centro.`,
      arcos: [{ c: [0, 0], r: rr, de: 0, a: 360, grosor: 'fino' }],
      discos: [{ c: [0, 0], r: 0.06 }, ...angs.map(d => ({ c: enCirculo(rr, d), r: 0.2 }))],
      flechas: [
        ...angs.map(d => ({ de: enCirculo(rr, d), d: tang(d), escala: KV, color: 'o', rotulo: 'v' })),
        ...(o.sinA ? [] : [{ de: enCirculo(rr, angs[angs.length - 1]), d: rad_(angs[angs.length - 1]), escala: KA, color: 'd', rotulo: 'ac' }]),
      ],
    };
  }
  const mcuIdea = {
    id: 'rapidez-constante-acelera',
    titulo: 'Rapidez constante, velocidad que gira',
    temas: ['MCU', 'Aceleración tangencial y centrípeta'],
    pieza: 'fis-lienzo',
    juega: {
      consigna: 'Elige la rapidez y el radio del giro. La flecha verde es la aceleración del cuerpo.',
      voz: 'Prueba la misma rapidez en un círculo más chico.',
      controles: [
        { id: 'v', etiqueta: 'v', color: 'c-o', min: 2, max: 4, paso: 0.5, inicio: 3, unidad: 'm/s', decimales: 1 },
        { id: 'r', etiqueta: 'r', min: 2, max: 4, paso: 1, inicio: 2, unidad: 'm', decimales: 0 },
      ],
      dibujo: val => ({ datos: mcu(val.v, val.r), estado: {} }),
      lectura: val => [v, ` = ${f(val.v)} m/s fija · `, ac, ` = ${f(val.v * val.v / val.r, 2)} m/s²`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Un carrito da vueltas en una pista circular, siempre a 4 m/s. ¿Tiene aceleración?',
      opciones: [
        { id: 'c', texto: 'Sí, hacia el centro de la pista', correcta: true },
        { id: 'cero', texto: 'No: su rapidez no cambia', error: 'MC-A0', siFuera: 'Su rapidez no cambia, cierto. Pero la dirección de v sí, y eso es cambiar v.' },
        { id: 'afuera', texto: 'Sí, hacia afuera de la pista', error: 'D9', siFuera: 'Hacia afuera se siente empujado quien va dentro. La aceleración del carrito apunta al centro.' },
        { id: 'adelante', texto: 'Sí, hacia adelante, como v', error: 'K3', siFuera: 'Si apuntara como v, la rapidez aumentaría. Aquí la rapidez no cambia.' },
      ],
      dibujo: { datos: mcu(4, 3, { angs: [60], sinA: true, alt: 'Carrito en una pista circular con su flecha de velocidad tangente.' }), estado: {} },
      revelar: { datos: mcu(4, 3, { angs: [60] }), estado: {} },
      coincide: 'Coincide: v cambia de dirección todo el tiempo, y ese cambio apunta al centro.',
    },
    mira: {
      datos: {
        vista: VISTA_RUEDA, alt: 'Dos velocidades de 4 m/s en un círculo de 2 m; llevadas a un mismo origen, su diferencia apunta al centro.',
        arcos: [{ c: [0, 0], r: 2, de: 0, a: 360, grosor: 'fino' }],
        discos: [{ c: [0, 0], r: 0.06 }, { c: enCirculo(2, 90), r: 0.2 }, { c: enCirculo(2, 135), r: 0.2, paso: 1 }],
        flechas: [
          { de: enCirculo(2, 90), d: [-4, 0], escala: KV, color: 'o', rotulo: 'v₁' },
          { de: enCirculo(2, 135), d: [-4 * Math.sin(rad(135)), 4 * Math.cos(rad(135))], escala: KV, color: 'o', rotulo: 'v₂', paso: 1 },
          { de: [1.2, -2.6], d: [-4, 0], escala: KV, color: 'o', discontinua: true, paso: 2 },
          { de: [1.2, -2.6], d: [-4 * Math.sin(rad(135)), 4 * Math.cos(rad(135))], escala: KV, color: 'o', discontinua: true, paso: 2 },
          { de: [1.2, -2.6], tras: [-4, 0], d: [4 - 4 * Math.sin(rad(135)), 4 * Math.cos(rad(135))], escala: KV, color: 'd', rotulo: 'Δv', paso: 3 },
          { de: enCirculo(2, 112.5), d: [-Math.cos(rad(112.5)) * 8, -Math.sin(rad(112.5)) * 8], escala: KA, color: 'd', rotulo: 'ac', paso: 4 },
        ],
      },
      pasos: [
        { estado: { paso: 1 }, texto: 'Dos instantes de la vuelta: la misma rapidez, distinta dirección.', ecuacion: [{ sub: [v, '1'] }, ' = ', { sub: [v, '2'] }, ' = 4 m/s'] },
        { estado: { paso: 2 }, texto: 'Se llevan las dos flechas a un mismo origen.', ecuacion: [['Δ', v], ' = ', { sub: [v, '2'] }, ' − ', { sub: [v, '1'] }] },
        { estado: { paso: 3 }, texto: 'La flecha que va de v₁ a v₂ es el cambio: apunta hacia adentro.', ecuacion: [['Δ', v], ' ≠ 0'] },
        { estado: { paso: 4 }, texto: 'Entre los dos instantes, la aceleración apunta al centro.', ecuacion: [ac, ' = ', { frac: [{ sup: [v, '2'] }, 'r'] }, ' = ', { frac: ['16', '2'] }, ' = 8 m/s²'] },
      ],
    },
    regla: {
      texto: 'En el MCU la rapidez no cambia, pero la dirección de la velocidad sí: hay una aceleración que apunta al centro.',
      ecuacion: [ac, ' = ', { frac: [{ sup: [v, '2'] }, 'r'] }, ' = ', { sup: ['ω', '2'] }, 'r'],
      condicion: 'rapidez constante. Si además la rapidez cambia, se suma una aceleración tangencial.',
    },
    ahoraTu: {
      pieza: 'fis-lienzo',
      generar(sm) {
        const r = azar(sm), conW = sm % 2 === 1;
        if (conW) {
          const w = r.de([2, 3, 4, 5]), rr = r.de([0.5, 1, 2, 3]), acc = w * w * rr;
          return {
            pregunta: `Un punto gira a ${f(rr, 1)} m del eje con ω = ${f(w)} rad/s constante. ¿Cuánto vale su aceleración centrípeta?`,
            opciones: opciones(acc, [
              { id: 'w-r', valor: w * rr, error: 'MC-VR', siFuera: 'Ese es ωr, la rapidez del punto, en m/s.' },
              { id: 'w2-r', valor: w * w / rr, error: 'MC-V2R', siFuera: 'Eso divide ω² entre r; con ω es ω² por r.' },
              { id: 'cero', valor: 0, error: 'MC-A0', siFuera: 'ω constante no quita la aceleración: la velocidad cambia de dirección.' },
            ], n => `${f(n, 2)} m/s²`),
            solucion: { texto: 'Con ω, la aceleración centrípeta es ω² por r.', ecuacion: [ac, ` = ${f(w)}² · ${f(rr, 1)} = ${f(acc, 2)} m/s²`] },
          };
        }
        const vv = r.de([2, 3, 4, 5, 6]), rr = r.de([2, 3, 4]), acc = vv * vv / rr; // la figura dibuja v a escala, sin a
        return {
          pregunta: ['Un carrito recorre un círculo de radio ', `${f(rr)} m con `, v, ` = ${f(vv)} m/s constante. ¿Cuánto vale su aceleración?`],
          dibujo: { datos: mcu(vv, Math.min(4, Math.max(2, rr)), { sinA: true, alt: `Carrito a ${vv} m/s en un círculo de ${rr} m.` }), estado: {} },
          opciones: opciones(acc, [
            { id: 'cero', valor: 0, error: 'MC-A0', siFuera: 'La rapidez no cambia, pero la dirección de v sí.' },
            { id: 'v-r', valor: vv / rr, error: 'MC-VR', siFuera: 'Eso es v/r, que es ω. Falta multiplicar otra vez por v.' },
            { id: 'v2r', valor: vv * vv * rr, error: 'MC-V2R', siFuera: 'Eso multiplica por r; un giro más cerrado acelera más.' },
          ], n => `${f(n, 2)} m/s²`),
          solucion: { texto: 'Apunta al centro y vale v² entre r.', ecuacion: [ac, ` = ${f(vv)}² / ${f(rr)} = ${f(acc, 2)} m/s²`] },
        };
      },
    },
  };

  // ---------- Idea 4: dos aceleraciones a la vez (MCUV) ----------
  // Cambia: el tiempo desde que arranca · Permanece: a_T, que no cambia con α constante · Progresa: v y, con ella,
  // a_c = v²/r, que crece · Se reserva: la aceleración total, que gira hacia el centro ·
  // Debe verse: a_T y a_c son perpendiculares y la total sale por Pitágoras.
  const RR = 2, ANG = 40;
  function mcuv(at, tt, o = {}) {
    const vv = at * tt, acc = vv * vv / RR, P = enCirculo(RR, ANG);
    const tg = [-Math.sin(rad(ANG)), Math.cos(rad(ANG))], ce = [-Math.cos(rad(ANG)), -Math.sin(rad(ANG))];
    const tot = [tg[0] * at + ce[0] * acc, tg[1] * at + ce[1] * acc];
    return {
      vista: VISTA_RUEDA, escalaF: KA,
      alt: `Punto de una rueda de 2 m que arranca: aT = ${f(at)} m/s², ac = ${f(acc, 2)} m/s² y la total ${f(Math.hypot(at, acc), 2)} m/s².`,
      arcos: [{ c: [0, 0], r: RR, de: 0, a: 360, grosor: 'fino' }],
      discos: [{ c: [0, 0], r: 0.06 }, { c: P, r: 0.2 }],
      flechas: [
        { de: P, d: [tg[0] * vv, tg[1] * vv], escala: KV, color: 'o', rotulo: vv > 0.4 ? 'v' : undefined, hasta: o.sinV ? -1 : undefined },
        { de: P, d: [tg[0] * at, tg[1] * at], color: 'd', rotulo: 'aT', discontinua: true, paso: o.p1 || 0 },
        { de: P, d: [ce[0] * acc, ce[1] * acc], color: 'd', rotulo: acc > 0.6 ? 'ac' : undefined, discontinua: true, paso: o.p2 || 0 },
        { de: P, d: tot, color: 'd', rotulo: 'a', paso: o.p3 || 0 },
      ],
    };
  }
  const mcuvIdea = {
    id: 'dos-aceleraciones',
    titulo: 'Dos aceleraciones a la vez',
    temas: ['MCUV', 'Aceleración tangencial y centrípeta'],
    pieza: 'fis-lienzo',
    juega: {
      consigna: 'Una rueda de 2 m de radio arranca del reposo. Elige su aceleración tangencial y avanza el reloj.',
      voz: 'Mira las dos flechas discontinuas: ¿cuál cambia con el tiempo?',
      controles: [
        { id: 'at', etiqueta: 'aT', color: 'c-d', min: 1, max: 2, paso: 0.5, inicio: 1, unidad: 'm/s²', decimales: 1 },
        { id: 't', etiqueta: 't', color: 'c-h', min: 0, max: 2, paso: 0.5, inicio: 0.5, unidad: 's', decimales: 1 },
      ],
      dibujo: val => ({ datos: mcuv(val.at, val.t), estado: {} }),
      lectura: val => [v, ` = ${f(val.at * val.t, 1)} m/s · `, ac, ` = ${f((val.at * val.t) ** 2 / RR, 2)} m/s²`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Una rueda arranca y gira cada vez más rápido, con aceleración angular α constante. ¿La aceleración total de un punto del borde es constante?',
      opciones: [
        { id: 'c', texto: 'No: su parte hacia el centro crece', correcta: true },
        { id: 'alfa', texto: 'Sí, porque α es constante', error: 'MC-ATOTAL', siFuera: 'α constante deja fija aT. Pero ac = v²/r crece con la rapidez.' },
        { id: 'solo-at', texto: 'Sí: solo tiene aceleración tangencial', error: 'MC-SOLO-AT', siFuera: 'Al arrancar, sí. En cuanto tiene rapidez, también acelera hacia el centro.' },
        { id: 'baja', texto: 'No: disminuye al ir más rápido', error: 'MC-SOLO-AC', siFuera: 'Ninguna de sus dos partes baja: aT se queda y ac crece.' },
      ],
      dibujo: { datos: mcuv(2, 0), estado: {} },
      revelar: { datos: mcuv(2, 2), estado: {} },
      coincide: 'Coincide: aT no cambia, pero ac crece con v², y la total con ella.',
    },
    mira: {
      datos: mcuv(2, 1.5, { p1: 1, p2: 2, p3: 3 }), // a_c = 4,5 m/s²: cabe a la escala fija
      pasos: [
        { estado: { paso: 1 }, texto: 'A 1,5 s, la parte tangencial sigue igual: 2 m/s².', ecuacion: [aT, ' = α r = 2 m/s²   ·   ', v, ' = 2 · 1,5 = 3 m/s'] },
        { estado: { paso: 2 }, texto: 'La parte hacia el centro sale de la rapidez de ese instante.', ecuacion: [ac, ' = ', { frac: [{ sup: [v, '2'] }, 'r'] }, ' = ', { frac: ['9', '2'] }, ' = 4,5 m/s²'] },
        { estado: { paso: 3 }, texto: 'Son perpendiculares: la total es la diagonal del rectángulo.', ecuacion: [a, ' = √(2² + 4,5²) = ', f(Math.hypot(2, 4.5), 2), ' m/s²'] },
      ],
    },
    regla: {
      texto: 'En el MCUV la aceleración tangencial no cambia, pero la centrípeta crece con la rapidez. La total suma ambas como vectores perpendiculares.',
      ecuacion: [aT, ' = α r   ·   ', ac, ' = ', { frac: [{ sup: [v, '2'] }, 'r'] }, '   ·   ', a, ' = √(', { sup: [aT, '2'] }, ' + ', { sup: [ac, '2'] }, ')'],
      condicion: 'α constante; ω = ω₀ + α t, como v = v₀ + a t en una recta.',
    },
    ahoraTu: {
      pieza: 'fis-lienzo',
      generar(sm) {
        // (a_T, a_c, v, r) con a_c = v²/r: la total sale exacta por un triple pitagórico.
        const CASOS = [[3, 4, 2, 1], [3, 4, 4, 4], [6, 8, 4, 2], [6, 8, 8, 8], [5, 12, 6, 3], [12, 5, 5, 5], [8, 6, 6, 6], [4, 3, 3, 3], [9, 12, 6, 3], [12, 16, 8, 4]];
        const [at, acc, vv, rr] = CASOS[sm % CASOS.length], tot = Math.hypot(at, acc);
        return {
          pregunta: ['Un punto gira en un círculo de ', `${f(rr)} m. En un instante va a `, v, ` = ${f(vv)} m/s y su aceleración tangencial es `, aT, ` = ${f(at)} m/s². ¿Cuánto vale su aceleración total?`],
          opciones: opciones(tot, [
            { id: 'suma', valor: at + acc, error: 'MC-SUMA', siFuera: 'Sumar sirve si apuntan igual. Estas dos son perpendiculares.' },
            { id: 'solo-ac', valor: acc, error: 'MC-SOLO-AC', siFuera: 'Esa es solo la parte hacia el centro; falta la tangencial.' },
            { id: 'solo-at', valor: at, error: 'MC-SOLO-AT', siFuera: 'Esa es solo la tangencial; con rapidez también hay ac.' },
          ], n => `${f(n, 2)} m/s²`),
          solucion: { texto: `ac = ${f(vv)}²/${f(rr)} = ${f(acc)} m/s², perpendicular a aT.`, ecuacion: [a, ` = √(${f(at)}² + ${f(acc)}²) = ${f(tot, 2)} m/s²`] },
        };
      },
    },
  };

  return {
    unidad: 'fisica.movimiento-parabolico-y-circular',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/ejes.js', '/nucleo/kit/piezas/fis-lienzo.js'],
    historia: {
      texto: 'Un proyectil avanza y cae a la vez. En 1638, Galileo explicó su camino como la suma de un avance parejo y una caída acelerada, sin aire. Después, Huygens estudió el giro: algo puede mantener su rapidez y, aun así, cambiar de dirección todo el tiempo.',
      pregunta: '¿Se puede acelerar sin ir más rápido?',
      fuente: { titulo: 'Museo Galileo — aparato de la trayectoria parabólica', url: 'https://catalogue.museogalileo.it/object/ApparatusToDemonstrateParabolicTrajectoryProjectiles.html' },
    },
    ideas: [tiroIdea, angulares, mcuIdea, mcuvIdea],
  };
});
