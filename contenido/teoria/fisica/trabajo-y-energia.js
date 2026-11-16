/*
 * Teoría de «Trabajo, energía y potencia» (fisica.trabajo-y-energia). Molde: docs/teoria.md y
 * fisica.movimiento-rectilineo.
 * Fuente del contenido: docs/teoria/matriz/fisica.json (unidad 7): W = F·Δr y el área firmada de F–x; Wneto = ΔK;
 * Ug = mgh local y Ue = kx²/2; Δ(K + U) = W no conservativo; P = W/Δt y P = Fv; eficiencia = útil/entrada.
 * Precisión del expediente: la misma rapidez abajo por caminos de igual altura exige igual estado inicial y sin
 * pérdidas; aquí el cuerpo desliza (no rueda).
 * Colores (regla 4): fuerza F naranja (c-o); distancias d, x y h turquesa (c-i); energía cinética K roja (c-h);
 * energía potencial U verde (c-d). El trabajo W, la potencia P y las pérdidas van en tinta.
 * g = 10 m/s², declarado en cada condición donde se usa.
 * Códigos de error: W1, W7, W14 y W15 (estatica-energia-ideas-erroneas). Nuevos (hipótesis, sin dato): TR-PERP,
 * TR-SIN-COS, TR-SENO, TR-SIGNO, TE-LINEAL, TE-SIN-V0, TE-SIN-MEDIO, TE-RESTA-V, EP-LINEAL, EP-SIN-MEDIO, EP-REF,
 * EP-CM, CE-CAMINO, CE-MASA, CE-SIN-RAIZ, CE-ROCE, PO-TRABAJO, PO-INVERSA, PO-EFIC, PO-SIN-T.
 * Estado: completa (14 nov 2026): cinco ideas que cubren los cinco temas del catálogo.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: cinco relaciones de la energía, cada una jugada antes de preguntarla.
 *   Persona y condiciones: postulante de 4.º, celular de gama baja a 360 px, a veces sin conexión.
 *   Resultado observable: halla W con signo, una rapidez por energía, Ue y Ug, y la potencia con su eficiencia.
 *   Orden de atención: 1.º la figura y sus barras · 2.º la lectura en vivo · acción: el botón fijo · fondo: Tilo.
 *   Estados: juego sin tocar · predicción pendiente · coincide / no coincide · paso de mira · caso nuevo · «No sé».
 *   Duda que resuelve: ¿por qué no toda fuerza hace trabajo y la rapidez abajo no depende del camino?
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const F = { v: 'c-o', t: 'F' }, d = { v: 'c-i', t: 'd' }, x = { v: 'c-i', t: 'x' }, h = { v: 'c-i', t: 'h' };
  const K = { v: 'c-h', t: 'K' }, U = { v: 'c-d', t: 'U' };
  const Ug = { sub: [U, 'g'] }, Ue = { sub: [U, 'e'] }, K0 = { sub: [K, '0'] };
  const G = 10;
  const rad = g => g * Math.PI / 180;
  function azar(sm) {
    let q = (sm * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = arr => arr[Math.floor(r() * arr.length)];
    return r;
  }
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const o of distractores) {
      if (!Number.isFinite(o.valor)) continue;
      const txt = fmt(o.valor);
      if (vistos.has(txt)) continue;
      vistos.add(txt);
      ops.push({ id: o.id, texto: txt, error: o.error, siFuera: o.siFuera });
    }
    return ops.slice(0, 4);
  }
  const caja = (cx, y0, w, hh) => ({ puntos: [[cx - w / 2, y0], [cx + w / 2, y0], [cx + w / 2, y0 + hh], [cx - w / 2, y0 + hh]], cerrado: true });
  // Gesto directo (docs/teoria.md §4b): la manija vive en las coordenadas de la figura (fis-lienzo.geometria o
  // ejes.geometria, con los mismos datos que dibuja la idea).
  const LZ = datos => Kit.piezas['fis-lienzo'].geometria(datos);
  const EJ = datos => Kit.piezas.ejes.geometria(datos);
  const v0 = { sub: ['v', '0'] };
  // Barras de energía: una por concepto, a la misma escala (px por joule), con su valor arriba y su nombre abajo.
  function barras(lista, x0, y0, ancho, kJ, o = {}) {
    const pol = [], tex = [];
    lista.forEach((b, i) => {
      const cx = x0 + i * (ancho + 0.25) + ancho / 2, alto = Math.max(0, b.val) * kJ;
      if (alto > 0.005) pol.push({ ...caja(cx, y0, ancho, alto), color: b.color, relleno: 0.35, paso: b.paso || 0 });
      tex.push({ en: [cx, y0 - 0.32], texto: b.etq, color: b.color, paso: 0 }, { en: [cx, y0 + alto + 0.12], texto: `${f(b.val, 0)} J`, color: b.color, paso: b.paso || 0 });
    });
    return { pol, tex };
  }

  // ---------- Idea 1: trabajo es fuerza a lo largo del camino ----------
  // Cambia: el ángulo de la cuerda · Permanece: F = 20 N y el recorrido de 5 m · Progresa: la parte de F a lo largo
  // del camino, que se achica · Se reserva: 90°, donde W = 0 aunque haya fuerza · Debe verse: W = F d cos θ, con signo.
  const KF1 = 4;
  function jalar(ang, o = {}) {
    const Fv = o.F || 20, dd = 5, W = Fv * dd * Math.cos(rad(ang)), c = Math.cos(rad(ang)), s = Math.sin(rad(ang));
    const P = [0.45, 0.35], A = Math.round(ang);   // el ángulo animado corre continuo; se rotula en grados enteros
    return {
      vista: { x0: -2.2, x1: 2.6, y0: -0.7, y1: 1.9 }, escalaF: KF1,
      alt: o.alt || `Caja jalada con ${f(Fv, 0)} N a ${A}° de la horizontal a lo largo de 5 m: el trabajo de la cuerda es ${f(W, 1)} J.`,
      poligonos: [{ puntos: [[-2.1, 0], [2.5, 0]], rayado: true }, caja(0, 0, 0.9, 0.7)],
      segmentos: [{ de: [-0.45, -0.35], a: [2.2, -0.35], color: 'i', grosor: 'variable', texto: 'recorre 5 m', lado: -1 }],
      flechas: [{ de: P, d: [Fv * c, Fv * s], color: 'o', rotulo: `F = ${f(Fv, 0)} N` },
        ...(o.comp !== undefined ? [{ de: P, d: [Fv * c, 0], color: 'o', discontinua: true, rotulo: `${f(Fv * c, 1)} N`, paso: o.comp }] : [])],
      arcos: ang > 0 && ang < 180 ? [{ c: P, rpx: 28, de: 0, a: ang, rotulo: `${A}°` }] : [],
    };
  }
  // La punta de F gira alrededor de su cola (la caja): ángulo desde la horizontal, de 0° a 180°; su largo es F.
  const PUNTA = [0.45, 0.35];
  const puntaF = (ang, Fv) => { const g = LZ(jalar(ang, { F: Fv })); return { x: g.X(PUNTA[0]) + Fv * KF1 * Math.cos(rad(ang)), y: g.Y(PUNTA[1]) - Fv * KF1 * Math.sin(rad(ang)) }; };
  const anguloDe = (pt, ang, Fv) => {
    const g = LZ(jalar(ang, { F: Fv })), dx = pt.x - g.X(PUNTA[0]), dy = g.Y(PUNTA[1]) - pt.y;
    let th = Math.atan2(dy, dx) * 180 / Math.PI;
    if (th < 0) th = th < -90 ? 180 : 0;   // bajo el piso, se queda en el extremo más cercano
    return { th, largo: Math.hypot(dx, dy) };
  };
  // Lectura del trabajo con el ángulo que se ve rotulado (entero), para que cos θ y W cuadren con la figura.
  const leerW = (Fv, ang) => { const A = Math.round(ang); return `W = ${f(Fv, 0)} · 5 · cos ${A}° = ${f(Fv * 5 * Math.cos(rad(A)), 1)} J`; };
  // Caso de «Ahora tú» y de «Así se resuelve» (la misma cuenta): ángulos notables con su coseno y seno de tabla.
  const COS1 = { 0: 1, 37: 0.8, 53: 0.6, 60: 0.5, 90: 0, 120: -0.5, 180: -1 }, SEN1 = { 0: 0, 37: 0.6, 53: 0.8, 60: Math.sqrt(3) / 2, 90: 1, 120: Math.sqrt(3) / 2, 180: 0 };
  const casoTrabajo = r => { const Fv = r.de([10, 20, 25, 40, 50]), dd = r.de([2, 3, 4, 5, 10]), ang = r.de([0, 37, 53, 60, 90, 120, 180]); return { Fv, dd, ang, W: Fv * dd * COS1[ang] }; };
  const trabajo = {
    id: 'trabajo-y-angulo',
    titulo: 'Solo trabaja lo que acompaña',
    temas: ['Trabajo de fuerzas constantes y variables'],
    pieza: 'fis-lienzo',
    // Lee (fase 2): contexto, el joule y qué mirar. No dice cuánto trabaja una fuerza perpendicular (la de «Predice»).
    lee: {
      tarjetas: [
        { titulo: 'Trabajo no es cansancio', texto: 'En la vida diaria, trabajo es esfuerzo: empujar una carretilla de papas en la feria de Juliaca. En física la palabra es más estrecha: mide lo que una fuerza aporta mientras el cuerpo avanza.' },
        { titulo: 'Se mide en joules', texto: ['El trabajo se mide en joules (J). Un joule es lo que aporta una fuerza de 1 N que empuja a lo largo de 1 m, en el mismo sentido del avance.'],
          ecuacion: ['1 J = 1 N · 1 m'] },
        { titulo: 'Qué mirar', texto: ['En el juego, la flecha ', F, ' gira sola alrededor de la caja. La flecha punteada es la parte de la fuerza que va a lo largo del camino. Mira su largo mientras gira.'] },
      ],
    },
    juega: {
      consigna: 'Una fuerza de 20 N jala la caja mientras avanza 5 m, y gira sola. Mira la parte punteada: la que acompaña al avance.',
      voz: 'Mira qué pasa al cruzar 90°. ¿Cuánto ayuda la fuerza al avance?',
      // Animación: el ángulo barre de 0° a 180° y vuelve (30° por segundo); W = F d cos θ se recalcula en cada cuadro.
      controles: [{ id: 'ang', etiqueta: 'Ángulo', min: 0, max: 180, paso: 30, inicio: 30, unidad: '°', decimales: 0, auto: { velocidad: 30, modo: 'rebota' } }],
      dibujo: val => ({ datos: jalar(val.ang, { comp: 0 }), estado: {} }),
      lectura: val => [leerW(20, val.ang)],
      minimo: 4,
      // Arrastra la punta de la cuerda (F) alrededor de la caja: el ángulo sigue al dedo.
      arrastres: [{ id: 'cuerda', etiqueta: 'ángulo de la cuerda (punta de F)', color: 'c-o',
        donde: val => puntaF(val.ang, 20),
        mover: (pt, val) => ({ ang: anguloDe(pt, val.ang, 20).th }) }],
    },
    predice: {
      pregunta: 'Una caja de 50 N avanza 10 m en horizontal, a velocidad constante, sostenida por una fuerza vertical hacia arriba. ¿Cuánto trabajo hace esa fuerza sobre la caja?',
      opciones: [
        { id: 'c', texto: '0 J', correcta: true },
        { id: 'todo', texto: '500 J', error: 'TR-PERP', siFuera: 'Sería cierto si la caja subiera 10 m. La fuerza es vertical y el camino, horizontal.' },
        { id: 'neg', texto: '−500 J', error: 'TR-SIGNO', siFuera: 'Negativo sería si la fuerza fuera contra el avance. Aquí es perpendicular.' },
      ],
      dibujo: { datos: jalar(90, { alt: 'Caja que avanza 5 m con una fuerza vertical hacia arriba.' }), estado: {} },
      revelar: { datos: jalar(90, { comp: 0, alt: 'La fuerza vertical no tiene parte a lo largo del camino horizontal: su trabajo es cero.' }), estado: {} },
      coincide: 'Coincide: una fuerza perpendicular al camino no hace trabajo, aunque sea grande.',
    },
    // Hallazgo 9: «Mira» pasa de la caja a la gráfica F–x a propósito: lleva el trabajo al caso que el juego no muestra
    // (una fuerza que cambia en el camino), donde W ya no es un producto sino un área.
    mira: {
      pieza: 'ejes',
      datos: {
        x: { min: 0, max: 6, paso: 1, nombre: 'x', unidad: 'm', decimales: 0, color: 'i' },
        y: { min: 0, max: 25, paso: 5, nombre: 'F', unidad: 'N', decimales: 0, color: 'o' },
        curvas: [{ puntos: [[0, 0], [4, 20], [6, 20]], color: 'o', desde: 1 }],
        areas: [{ puntos: [[0, 0], [4, 20]], color: 'i', rotulo: '40 J', desde: 2 }, { puntos: [[4, 20], [6, 20]], color: 'i', rotulo: '40 J', desde: 3 }],
      },
      pasos: [
        { estado: { corte: 1 }, texto: 'Si F cambia mientras avanza, no se puede multiplicar un solo valor.', ecuacion: [F, ' crece de 0 a 20 N'] },
        { estado: { corte: 2 }, texto: 'El trabajo es el área bajo F–x: primero un triángulo.', ecuacion: ['½ · 4 · 20 = 40 J'] },
        { estado: { corte: 3 }, texto: 'Después, un rectángulo. El trabajo total suma las dos áreas.', ecuacion: ['W = 40 + 40 = 80 J'] },
      ],
    },
    regla: {
      texto: 'Una fuerza hace trabajo solo con la parte que va a lo largo del camino. Si la fuerza cambia, el trabajo es el área bajo F–x.',
      ecuacion: ['W = ', { llave: [F, ' cos θ'], nota: 'parte que acompaña', color: 'c-o' }, ' ', d, '   ·   ', 'W = área bajo ', F, '–', x],
      condicion: 'θ es el ángulo entre F y el desplazamiento. Contra el avance (θ > 90°), el trabajo es negativo.',
    },
    // Así se resuelve: el trabajo de una fuerza inclinada, calculado igual que «Ahora tú» (casoTrabajo: W = F d cos θ
    // con el coseno de tabla de los ángulos notables).
    resuelve: {
      generar(sm) {
        const { Fv, dd, ang, W } = casoTrabajo(azar(sm + 900)), c = COS1[ang], tope = Fv * dd;
        const sentido = W > 0 ? `Sale positivo: la fuerza va a favor del avance. Y no pasa de F · d = ${f(tope, 2)} J, el caso de la fuerza justo a lo largo del camino.`
          : W < 0 ? `Sale negativo: con más de 90°, la fuerza va contra el avance y lo frena. Su tamaño no pasa de F · d = ${f(tope, 2)} J.`
            : 'Sale cero: la fuerza es perpendicular al avance y no tiene parte a lo largo del camino. N · m da J.';
        return {
          enunciado: ['Una fuerza ', F, ` = ${Fv} N actúa sobre una caja que avanza `, d, ` = ${dd} m. El ángulo entre la fuerza y el avance es ${ang}°. ¿Cuánto trabajo hace?`],
          pasos: [
            { tipo: 'pide', texto: 'Piden el trabajo W de esa fuerza: cuánto aporta al avance de la caja, con su signo.' },
            { tipo: 'datos', texto: [F, ` = ${Fv} N, `, d, ` = ${dd} m y ${ang}° entre la fuerza y el avance.`] },
            { tipo: 'regla', texto: 'Solo cuenta la parte de la fuerza que va a lo largo del camino: la fuerza por el coseno del ángulo. Esa parte se multiplica por la distancia.',
              ecuacion: ['W = ', F, ' cos θ · ', d] },
            { tipo: 'cuentas', texto: `El coseno de ${ang}° es ${f(c, 2)}: la parte que acompaña al avance es ${f(Fv * c, 2)} N.`,
              ecuacion: [`W = ${Fv} · cos ${ang}° · ${dd} = ${Fv} · ${c < 0 ? `(${f(c, 2)})` : f(c, 2)} · ${dd} = ${f(W, 2)} J`] },
            { tipo: 'sentido', texto: sentido },
          ],
          respuesta: `W = ${f(W, 2)} J`,
        };
      },
    },
    ahoraTu: {
      generar(sm) {
        const { Fv, dd, ang, W } = casoTrabajo(azar(sm)), SEN = SEN1;
        return {
          pregunta: ['Una fuerza ', F, ` = ${Fv} N actúa sobre una caja que avanza `, d, ` = ${dd} m. El ángulo entre la fuerza y el avance es ${ang}°. ¿Cuánto trabajo hace?`],
          opciones: opciones(W, [
            { id: 'sin-cos', valor: Fv * dd, error: 'TR-SIN-COS', siFuera: 'F por d vale si la fuerza va justo en el sentido del avance.' },
            { id: 'seno', valor: Fv * dd * SEN[ang], error: 'TR-SENO', siFuera: 'El seno da la parte perpendicular, que no trabaja. Va el coseno.' },
            { id: 'signo', valor: -W, error: 'TR-SIGNO', siFuera: 'El valor está bien; el signo lo da si la fuerza ayuda o frena.' },
          ], n => `${f(n, 2)} J`),
          solucion: { texto: ang === 90 ? 'Perpendicular al avance: no trabaja.' : 'Solo cuenta la parte de F a lo largo del camino.', ecuacion: [`W = ${Fv} · ${dd} · cos ${ang}° = ${f(W, 2)} J`] },
        };
      },
    },
  };

  // ---------- Idea 2: el trabajo neto se vuelve energía cinética ----------
  // Cambia: la fuerza neta y la distancia · Permanece: el carrito de 2 kg que parte del reposo · Progresa: las dos
  // barras, W y K, siempre iguales · Se reserva: duplicar v, que pide cuatro veces el trabajo · Debe verse: W = ΔK.
  const KJ2 = 0.028; // 80 J (lo más que da el juego) caben en 2,2 m de figura
  // Motor del empujón (lo mismo que dibuja): carrito de 2 kg desde el reposo, W = F d = K.
  const salida = (Fv, dd) => { const W = Fv * dd; return { W, v: Math.sqrt(2 * W / 2) }; };
  // Caso de «Ahora tú» y de «Así se resuelve» (la misma cuenta): Wneto = ½ m (v² − v₀²).
  const casoCinetica = r => { const m = r.de([1, 2, 4, 5]), vi = r.de([0, 1, 2, 3, 4]), vf = vi + r.de([1, 2, 3, 4]); return { m, vi, vf, Ki: m * vi * vi / 2, Kf: m * vf * vf / 2, W: m * (vf * vf - vi * vi) / 2 }; };
  // Escalas de la figura: 0,3 m de dibujo por metro recorrido y 2,5 px por newton. La fuerza empuja desde atrás: su
  // punta toca la espalda del carrito (x = −1,3 en la salida).
  const ME2 = 0.3, KF2 = 2.5, ATRAS = -1.3;
  // s: metros ya recorridos desde el reposo (la animación los barre de 0 a 4 m). Mientras s < d la fuerza empuja y
  // W = K = F·s; después suelta (flecha punteada donde soltó) y el carrito sigue, sin roce, con la K que ganó.
  // Sin s (predice y mira), el carrito está en la salida y las barras muestran el empujón completo.
  const recorrido = (Fv, dd, ss) => { const dentro = ss === undefined ? dd : Math.min(ss, dd), W = Fv * dentro; return { dentro, W, v: Math.sqrt(2 * W / 2) }; };
  const puntaF2 = (dd, ss) => ATRAS + ME2 * (ss === undefined ? 0 : Math.min(ss, dd));
  const VISTA2 = { x0: -2.2, x1: 2.2, y0: -0.6, y1: 3 }, PXM2 = 280 / 4.4;
  function empujon(Fv, dd, o = {}) {
    const { W, v: vv } = recorrido(Fv, dd, o.s), cx = ATRAS + 0.3 + ME2 * (o.s || 0), suelto = o.s !== undefined && o.s >= dd;
    // La flecha sale de la punta y se corre hacia atrás su propio largo (tras); el rótulo va sobre su mitad. PXM2: px por
    // metro del lienzo con esta vista (fis-lienzo: 280 px útiles para 4,4 m), solo para ubicar ese rótulo.
    const pf = puntaF2(dd, o.s), largo = Fv * KF2 / PXM2;
    const b = barras([{ etq: 'W', val: W }, { etq: 'K', val: W, color: 'h' }], 0.6, 0.3, 0.6, KJ2);
    return {
      vista: VISTA2, escalaF: KF2,
      alt: o.alt || (o.s === undefined
        ? `Carrito de 2 kg empujado con ${Fv} N a lo largo de ${dd} m desde el reposo: el trabajo, ${f(W, 0)} J, es su energía cinética; sale a ${f(vv, 2)} m/s.`
        : `Carrito de 2 kg empujado con ${Fv} N durante ${dd} m; lleva ${f(o.s, 2)} m recorridos: trabajo y energía cinética de ${f(W, 0)} J, a ${f(vv, 2)} m/s.`),
      poligonos: [{ puntos: [[-2.1, 0], [0.5, 0]], rayado: true }, caja(cx, 0.12, 0.6, 0.4), ...b.pol],
      discos: [{ c: [cx - 0.2, 0.08], r: 0.08 }, { c: [cx + 0.2, 0.08], r: 0.08 }],
      segmentos: [{ de: [ATRAS, -0.3], a: [ATRAS + dd * ME2, -0.3], color: 'i', grosor: 'variable', texto: `${dd} m`, lado: -1 }],
      flechas: [{ de: [pf, 0.32], tras: [-Fv, 0], d: [Fv, 0], color: 'o', discontinua: suelto }],
      textos: [...b.tex, { en: [pf - largo / 2, 0.62], texto: suelto ? `${Fv} N: soltó` : `${Fv} N`, color: 'o' }, { en: [-1, 1.3], texto: `v = ${f(vv, 2)} m/s`, color: 'h' }],
    };
  }
  const teorema = {
    id: 'trabajo-energia-cinetica',
    titulo: 'El trabajo neto se vuelve rapidez',
    temas: ['Teorema trabajo-energía cinética'],
    pieza: 'fis-lienzo',
    // Lee (fase 2): la energía de movimiento, el trabajo neto y qué mirar. No dice cómo crece K con la rapidez
    // (lo que pregunta «Predice»).
    lee: {
      tarjetas: [
        { titulo: 'Energía de movimiento', texto: ['Todo lo que se mueve lleva energía cinética ', K, ': una combi en la avenida, una piedra que rueda cerro abajo. Si se detiene, esa energía se fue a otra parte, como al calor de los frenos.'] },
        { titulo: 'Varias fuerzas a la vez', texto: 'Sobre un cuerpo suelen actuar varias fuerzas. El trabajo neto suma lo que aporta cada una, con su signo: lo que una empuja a favor y otra frena se compensa.' },
        { titulo: 'Qué mirar', texto: ['En el juego, el carrito parte del reposo. Hay dos barras: el trabajo W y la energía cinética ', K, '. Compáralas mientras avanza, y fíjate en la rapidez que se lee arriba.'] },
      ],
    },
    juega: {
      consigna: 'Un carrito de 2 kg parte del reposo sin rozamiento. Avanza solo, punto a punto: mira crecer W y K con cada metro empujado.',
      voz: 'Busca dos maneras de darle la misma rapidez.',
      // Animación: s, los metros recorridos, barre de 0 a 4 m (1 m por segundo de pantalla, no es el ritmo real).
      controles: [
        { id: 'F', etiqueta: 'F', color: 'c-o', min: 5, max: 20, paso: 5, inicio: 10, unidad: 'N', decimales: 0 },
        { id: 'd', etiqueta: 'd', color: 'c-i', min: 1, max: 4, paso: 1, inicio: 2, unidad: 'm', decimales: 0 },
        { id: 's', etiqueta: 'Recorrido', color: 'c-i', min: 0, max: 4, paso: 0.25, inicio: 0, unidad: 'm', decimales: 2, auto: { velocidad: 1, modo: 'repite' } },
      ],
      dibujo: val => ({ datos: empujon(val.F, val.d, { s: val.s }), estado: {} }),
      lectura: val => { const e = recorrido(val.F, val.d, val.s); return [`s = ${f(val.s, 2)} m · W = `, K, ` = ${f(e.W, 0)} J · v = ${f(e.v, 2)} m/s`]; },
      minimo: 4,
      // Arrastra la cola de F hacia atrás (más fuerza) o el final de la cota turquesa (más distancia). Las barras
      // responden. Las dos manijas devuelven también s tal cual: tomarlas pausa la animación.
      arrastres: [
        { id: 'fuerza', etiqueta: 'fuerza (cola de F)', color: 'c-o',
          donde: val => { const g = LZ({ vista: VISTA2 }); return { x: g.X(puntaF2(val.d, val.s)) - val.F * KF2, y: g.Y(0.32) }; },
          mover: (pt, val) => ({ F: (LZ({ vista: VISTA2 }).X(puntaF2(val.d, val.s)) - pt.x) / KF2, s: val.s }) },
        { id: 'distancia', etiqueta: 'distancia empujada (fin de la cota)', color: 'c-i',
          donde: val => { const g = LZ({ vista: VISTA2 }); return { x: g.X(ATRAS + val.d * ME2), y: g.Y(-0.3) }; },
          mover: (pt, val) => ({ d: (LZ({ vista: VISTA2 }).Xi(pt.x) - ATRAS) / ME2, s: val.s }) },
      ],
    },
    predice: {
      pregunta: 'Para llevar un carrito del reposo a 3 m/s hace falta un trabajo W. Desde el reposo, ¿cuánto trabajo hace falta para llevarlo a 6 m/s?',
      opciones: [
        { id: 'c', texto: '4 W', correcta: true },
        { id: 'doble', texto: '2 W', error: 'TE-LINEAL', siFuera: 'El doble de rapidez parece pedir el doble. Pero K crece con v²: el doble de v, cuatro veces K.' },
        { id: 'igual', texto: 'W', error: 'W7', siFuera: 'La energía cinética no crece igual en cada tramo: va con el cuadrado de v.' },
      ],
      dibujo: { datos: empujon(9, 1, { alt: 'Carrito de 2 kg que llega a 3 m/s con un trabajo de 9 J.' }), estado: {} },
      revelar: { datos: empujon(9, 4, { alt: 'Para llegar a 6 m/s hacen falta 36 J: cuatro veces más.' }), estado: {} },
      coincide: 'Coincide: ½ · 2 · 6² = 36 J, cuatro veces los 9 J que dan 3 m/s.',
    },
    mira: {
      datos: empujon(8, 2, { alt: 'Carrito de 2 kg que va de 3 a 5 m/s con un trabajo neto de 16 J.' }),
      pasos: [
        { estado: {}, texto: 'Un carrito de 2 kg va a 3 m/s.', ecuacion: [K0, ' = ½ · 2 · ', { sup: ['3', '2'] }, ' = 9 J'] },
        { estado: {}, texto: 'Una fuerza neta de 8 N lo empuja 2 m.', ecuacion: ['W = 8 · 2 = 16 J'] },
        { estado: {}, texto: 'Ese trabajo se suma a su energía cinética.', ecuacion: [K, ' = 9 + 16 = 25 J'] },
        { estado: {}, texto: 'De ahí sale su nueva rapidez.', ecuacion: ['½ · 2 · ', { sup: ['v', '2'] }, ' = 25   →   v = 5 m/s'] },
      ],
    },
    regla: {
      texto: 'El trabajo de la fuerza neta es lo que cambia la energía cinética. La energía cinética crece con el cuadrado de la rapidez.',
      ecuacion: [{ sub: ['W', 'neto'] }, ' = ', { llave: ['Δ', K], nota: 'cambio de cinética', color: 'c-h' }, '   ·   ', 'Δ', K, ' = ½ m ', { sup: ['v', '2'] }, ' − ½ m ', { sup: [v0, '2'] }],
      condicion: 'W es el trabajo de todas las fuerzas sobre el cuerpo (la neta), no el de una sola.',
    },
    // Así se resuelve: el trabajo neto que cambia la rapidez, calculado igual que «Ahora tú» (casoCinetica:
    // Wneto = K − K₀).
    resuelve: {
      generar(sm) {
        const { m, vi, vf, Ki, Kf, W } = casoCinetica(azar(sm + 900)), Wn = { sub: ['W', 'neto'] };
        return {
          enunciado: `Un carrito de ${m} kg pasa de ${vi} m/s a ${vf} m/s. ¿Cuánto trabajo neto se hizo sobre él?`,
          pasos: [
            { tipo: 'pide', texto: 'Piden el trabajo neto: lo que todas las fuerzas juntas aportaron para cambiar su rapidez.' },
            { tipo: 'datos', texto: `La masa es ${m} kg; la rapidez inicial, ${vi} m/s, y la final, ${vf} m/s.` },
            { tipo: 'regla', texto: 'El trabajo neto es lo que cambió la energía cinética: la del final menos la del inicio.',
              ecuacion: [Wn, ' = ', K, ' − ', K0] },
            { tipo: 'cuentas', texto: vi === 0 ? 'Parte del reposo: al inicio no tiene energía cinética. Calculo la del final.' : 'Calculo las dos energías cinéticas y las resto.',
              ecuacion: [K0, ` = ½ · ${m} · `, { sup: [`${vi}`, '2'] }, ` = ${f(Ki, 2)} J   ·   `, K, ` = ½ · ${m} · `, { sup: [`${vf}`, '2'] }, ` = ${f(Kf, 2)} J   ·   `, Wn, ` = ${f(Kf, 2)} − ${f(Ki, 2)} = ${f(W, 2)} J`] },
            { tipo: 'sentido', texto: 'Sale positivo: el carrito ganó rapidez, así que en total las fuerzas lo ayudaron. Y kg · (m/s)² es un joule.' },
          ],
          respuesta: [Wn, ` = ${f(W, 2)} J`],
        };
      },
    },
    ahoraTu: {
      generar(sm) {
        const { m, vi: v0, vf: vv, W } = casoCinetica(azar(sm));
        return {
          pregunta: `Un carrito de ${m} kg pasa de ${v0} m/s a ${vv} m/s. ¿Cuánto trabajo neto se hizo sobre él?`,
          opciones: opciones(W, [
            { id: 'sin-v0', valor: m * vv * vv / 2, error: 'TE-SIN-V0', siFuera: 'Esa es su energía final. Ya tenía energía al inicio: se resta.' },
            { id: 'resta-v', valor: m * (vv - v0) ** 2 / 2, error: 'TE-RESTA-V', siFuera: 'Eso resta rapideces antes de elevar. Se restan energías: v² − v₀².' },
            { id: 'sin-medio', valor: m * (vv * vv - v0 * v0), error: 'TE-SIN-MEDIO', siFuera: 'Falta el ½ de la energía cinética.' },
          ], n => `${f(n, 2)} J`),
          solucion: { texto: 'El trabajo neto es el cambio de energía cinética.', ecuacion: [`W = ½ · ${m} · (`, { sup: [`${vv}`, '2'] }, ' − ', { sup: [`${v0}`, '2'] }, `) = ${f(W, 2)} J`] },
        };
      },
    },
  };

  // ---------- Idea 3: energía guardada en la posición ----------
  // Cambia: cuánto se comprime el resorte · Permanece: k = 200 N/m, la recta F–x · Progresa: el triángulo bajo la recta,
  // que es Ue · Se reserva: el doble de x, que da cuatro veces el área · Debe verse: Ue = ½kx²; Ug = mgh desde una referencia.
  const K3 = 200;
  const resorteEjes = (xv, o = {}) => ({
    x: { min: 0, max: 0.4, paso: 0.1, nombre: 'x', unidad: 'm', decimales: 1, color: 'i' },
    y: { min: 0, max: 80, paso: 20, nombre: 'F', unidad: 'N', decimales: 0, color: 'o' },
    curvas: [{ puntos: [[0, 0], [0.4, 80]], color: 'o' }],
    areas: xv > 0 ? [{ puntos: [[0, 0], [xv, K3 * xv]], color: 'd', rotulo: o.sinRot ? undefined : `${f(K3 * xv * xv / 2, 1)} J` }] : [],
    puntos: xv > 0 ? [{ x: xv, y: K3 * xv, color: 'o', guias: true }] : [],
  });
  // Casos de «Ahora tú» y de «Así se resuelve» (la misma cuenta): el resorte (Ue = ½kx²) y la caja sobre la mesa
  // (Ug = mg(h₁ − h₀), con la mesa de referencia).
  const casoResorte = r => { const k = r.de([100, 200, 400, 500, 800]), xv = r.de([0.1, 0.2, 0.3, 0.05]); return { k, xv, E: k * xv * xv / 2 }; };
  const casoAltura = r => { const m = r.de([2, 3, 5, 10]), h1 = r.de([2, 4, 5, 8]), h0 = r.de([1, 0.5]); return { m, h1, h0, E: m * G * (h1 - h0) }; };
  const potencial = {
    id: 'energia-potencial',
    titulo: 'Energía guardada en la posición',
    temas: ['Energía potencial gravitatoria y elástica'],
    pieza: 'ejes',
    // Lee (fase 2): energía guardada, la constante k y la referencia, y qué mirar. No dice cómo crece la energía del
    // resorte con x (lo que pregunta «Predice»).
    lee: {
      tarjetas: [
        { titulo: 'Energía guardada', texto: 'Una honda estirada, el resorte de un colchón, una piedra en lo alto de un cerro: todos pueden soltar energía más tarde. La que depende de la posición o de la forma se llama energía potencial.' },
        { titulo: 'Duro o blando', texto: ['Cada resorte tiene su constante elástica k, en N/m: cuántos newtons pide por cada metro que se deforma. El resorte de un amortiguador es duro, de k grande; el de un lapicero, blando.'],
          ecuacion: [F, ' = k ', x] },
        { titulo: '¿Altura desde dónde?', texto: ['Para la energía de altura hay que elegir desde dónde se mide ', h, ': el piso, la mesa o el techo. Ese nivel elegido se llama referencia.'] },
        { titulo: 'Qué mirar', texto: ['En el juego, la recta es la fuerza del resorte contra su compresión ', x, '. El área verde bajo la recta es la energía guardada. Mira su forma y su tamaño cuando ', x, ' crece.'] },
      ],
    },
    juega: {
      consigna: 'Recta F–x de un resorte de k = 200 N/m; la compresión x cambia sola. El área verde es su energía potencial elástica.',
      voz: 'Mira el área cuando x se duplica. ¿Cuántas veces crece?',
      // Animación: la compresión x va y vuelve de 0,05 m a 0,4 m (0,1 m por segundo); Ue = ½ k x² en cada cuadro.
      controles: [{ id: 'x', etiqueta: 'x', color: 'c-i', min: 0.05, max: 0.4, paso: 0.05, inicio: 0.1, unidad: 'm', decimales: 2, auto: { velocidad: 0.1, modo: 'rebota' } }],
      dibujo: val => ({ datos: resorteEjes(val.x), estado: {} }),
      lectura: val => [Ue, ` = ${f(K3 * val.x * val.x / 2, 2)} J · `, F, ` = ${f(K3 * val.x, 0)} N`],
      minimo: 3,
      // Arrastra el punto de la recta hacia la derecha: más compresión. El triángulo verde responde.
      arrastres: [{ id: 'compresion', etiqueta: 'compresión del resorte', color: 'c-i',
        donde: val => { const g = EJ(resorteEjes(val.x)); return { x: g.X(val.x), y: g.Y(K3 * val.x) }; },
        mover: (pt, val) => ({ x: EJ(resorteEjes(val.x)).Xi(pt.x) }) }],
    },
    predice: {
      pregunta: 'Un resorte comprimido 0,1 m guarda 1 J. ¿Cuánta energía guarda si se comprime 0,3 m?',
      opciones: [
        { id: 'c', texto: '9 J', correcta: true },
        { id: 'lineal', texto: '3 J', error: 'EP-LINEAL', siFuera: 'Triple de x da triple de fuerza, cierto. Pero la energía es el área: crece al cuadrado.' },
        { id: 'sin-medio', texto: '18 J', error: 'EP-SIN-MEDIO', siFuera: 'Eso olvida que el área es un triángulo: lleva el ½.' },
      ],
      dibujo: { datos: resorteEjes(0.1), estado: {} },
      revelar: { datos: resorteEjes(0.3), estado: {} },
      coincide: 'Coincide: con el triple de x, el triángulo tiene triple base y triple altura: 9 veces el área.',
    },
    // Hallazgo 9: «Mira» cambia de la recta F–x del resorte al libro sobre la mesa a propósito: la idea tiene dos
    // energías de posición; el juego mide la elástica y «Mira» enseña la gravitatoria y su referencia.
    mira: {
      pieza: 'fis-lienzo',
      datos: {
        vista: { x0: -2.2, x1: 2.2, y0: -0.6, y1: 2.6 }, escalaF: 3,
        alt: 'Bloque de 2 kg sobre una mesa de 1 m: respecto al piso tiene 20 J; respecto a la mesa, 0 J; al caer al piso pierde 20 J con cualquier referencia.',
        poligonos: [{ puntos: [[-2.1, 0], [2.1, 0]], rayado: true }, { puntos: [[-1.2, 1], [0.6, 1]], grosor: 'variable' }, { puntos: [[-1, 1], [-1, 0]] }, { puntos: [[0.4, 1], [0.4, 0]] }, caja(-0.3, 1, 0.5, 0.25)],
        segmentos: [{ de: [1.2, 0], a: [1.2, 1.12], color: 'i', grosor: 'variable', texto: 'h = 1 m', paso: 1 }, { de: [-2.1, 1], a: [-1.25, 1], discontinua: true, paso: 2 }],
        textos: [{ en: [1.4, 1.75], texto: 'desde el piso: 20 J', color: 'd', paso: 1 }, { en: [-1.1, 2.05], texto: 'desde la mesa: 0 J', color: 'd', paso: 2 }, { en: [0, -0.45], texto: 'al caer al piso pierde 20 J', color: 'd', paso: 3 }],
      },
      pasos: [
        { estado: { paso: 1 }, texto: 'Energía potencial gravitatoria del bloque de 2 kg a 1 m del piso.', ecuacion: [Ug, ' = m g ', h, ' = 2 · 10 · 1 = 20 J'] },
        { estado: { paso: 2 }, texto: 'Si la referencia es la mesa, su altura es 0.', ecuacion: [Ug, ' = 0 J'] },
        { estado: { paso: 3 }, texto: 'Importa el cambio: al caer al piso pierde 20 J con ambas referencias.', ecuacion: ['Δ', Ug, ' = −20 J'] },
      ],
    },
    regla: {
      texto: 'La energía potencial depende de la posición: la altura sobre una referencia o la deformación del resorte. Lo físico es su cambio.',
      ecuacion: [Ug, ' = m g ', { llave: [h], nota: 'sobre la referencia', color: 'c-i' }, '   ·   ', Ue, ' = ½ k ', { sup: [x, '2'] }],
      condicion: 'mgh vale cerca del suelo (g constante); x es la deformación desde el largo natural del resorte.',
    },
    // Así se resuelve: la energía del resorte o la de la caja sobre la mesa, alternadas como en «Ahora tú» y calculadas
    // igual (casoResorte y casoAltura).
    resuelve: {
      generar(sm) {
        const r = azar(sm + 900);
        if (sm % 2 === 0) {
          const { k, xv, E } = casoResorte(r), Fx = k * xv;
          return {
            enunciado: ['Un resorte de k = ', `${k} N/m se comprime `, x, ` = ${f(xv, 2)} m. ¿Cuánta energía guarda?`],
            pasos: [
              { tipo: 'pide', texto: 'Piden la energía potencial elástica: la que guarda el resorte mientras está comprimido.' },
              { tipo: 'datos', texto: ['La constante es k = ', `${k} N/m y la compresión, `, x, ` = ${f(xv, 2)} m.`] },
              { tipo: 'regla', texto: ['La energía del resorte es el área del triángulo bajo la recta F–x: base ', x, ', altura k', x, ', y la mitad.'],
                ecuacion: [Ue, ' = ½ k ', { sup: [x, '2'] }] },
              { tipo: 'cuentas', texto: ['Primero elevo ', x, ' al cuadrado; después multiplico por k y saco la mitad.'],
                ecuacion: [Ue, ` = ½ · ${k} · `, { sup: [`${f(xv, 2)}`, '2'] }, ` = ½ · ${k} · ${f(xv * xv, 4)} = ${f(E, 3)} J`] },
              { tipo: 'sentido', texto: ['Al final, la fuerza es k', x, ` = ${f(Fx, 0)} N. La mitad de ${f(Fx, 0)} N por ${f(xv, 2)} m da lo mismo, y N · m es un joule.`] },
            ],
            respuesta: [Ue, ` = ${f(E, 3)} J`],
          };
        }
        const { m, h1, h0, E } = casoAltura(r), hh = h1 - h0;
        return {
          enunciado: ['Una caja de ', `${m} kg está en un estante a ${h1} m del piso. Si se toma como referencia una mesa de ${f(h0, 1)} m de alto, ¿cuánto vale su energía potencial?`],
          pasos: [
            { tipo: 'pide', texto: 'Piden la energía potencial gravitatoria de la caja, medida desde la mesa y no desde el piso.' },
            { tipo: 'datos', texto: `La masa es ${m} kg; la caja está a ${h1} m del piso y la mesa mide ${f(h0, 1)} m. Uso g = 10 m/s².` },
            { tipo: 'regla', texto: ['La energía de altura es el peso por la altura, y la altura ', h, ' se cuenta desde la referencia elegida.'],
              ecuacion: [Ug, ' = m g ', h] },
            { tipo: 'cuentas', texto: ['Sobre la mesa, ', h, ' es la diferencia de alturas; después multiplico.'],
              ecuacion: [h, ` = ${h1} − ${f(h0, 1)} = ${f(hh, 1)} m   ·   `, Ug, ` = ${m} · 10 · ${f(hh, 1)} = ${f(E, 2)} J`] },
            { tipo: 'sentido', texto: `Desde el piso serían ${f(m * G * h1, 2)} J: más, porque el piso está más abajo que la mesa. Y kg · m/s² · m es un joule.` },
          ],
          respuesta: [Ug, ` = ${f(E, 2)} J`],
        };
      },
    },
    ahoraTu: {
      generar(sm) {
        const r = azar(sm);
        if (sm % 2 === 0) {
          const { k, xv, E } = casoResorte(r);
          return {
            pregunta: ['Un resorte de k = ', `${k} N/m se comprime `, x, ` = ${f(xv, 2)} m. ¿Cuánta energía guarda?`],
            opciones: opciones(E, [
              { id: 'lineal', valor: k * xv / 2, error: 'EP-LINEAL', siFuera: 'x va al cuadrado: el área del triángulo tiene base x y altura kx.' },
              { id: 'sin-medio', valor: k * xv * xv, error: 'EP-SIN-MEDIO', siFuera: 'Falta el ½: el área es un triángulo.' },
              { id: 'fuerza', valor: k * xv, error: 'EP-LINEAL', siFuera: 'Ese es el valor de la fuerza, en N, no la energía.' },
            ], n => `${f(n, 3)} J`),
            solucion: { texto: 'Es el área bajo la recta F–x hasta x.', ecuacion: [Ue, ` = ½ · ${k} · `, { sup: [`${f(xv, 2)}`, '2'] }, ` = ${f(E, 3)} J`] },
          };
        }
        const { m, h1, h0, E } = casoAltura(r);
        return {
          pregunta: ['Una caja de ', `${m} kg está en un estante a ${h1} m del piso. Si se toma como referencia una mesa de ${f(h0, 1)} m de alto, ¿cuánto vale su energía potencial?`],
          opciones: opciones(E, [
            { id: 'piso', valor: m * G * h1, error: 'EP-REF', siFuera: 'Eso mide desde el piso; la referencia pedida es la mesa.' },
            { id: 'sin-g', valor: m * (h1 - h0), error: 'EP-SIN-MEDIO', siFuera: 'Falta g: la energía es el peso por la altura.' },
            { id: 'suma', valor: m * G * (h1 + h0), error: 'EP-REF', siFuera: 'La mesa está debajo: la altura sobre ella se resta.' },
          ], n => `${f(n, 2)} J`),
          solucion: { texto: `Sobre la mesa, la caja está a ${f(h1 - h0, 1)} m.`, ecuacion: [Ug, ` = ${m} · 10 · ${f(h1 - h0, 1)} = ${f(E, 2)} J`] },
        };
      },
    },
  };

  // ---------- Idea 4: la energía mecánica se conserva sin roce ----------
  // Cambia: la altura de salida y si hay rozamiento · Permanece: la suma K + U sin roce · Progresa: U que pasa a K
  // en la bajada · Se reserva: la rampa curva, que da la misma rapidez abajo · Debe verse: v = √(2gh) sin importar el camino.
  const KJ4 = 0.021; // 100 J caben en 2,1 m; la rampa va a 0,36 unidades por metro de altura (escala uniforme)
  // Motor de la rampa (lo mismo que dibuja): 2 kg; la altura en el avance t es h(1 − t)², la misma curva del dibujo;
  // con roce se pierde 25 % de la energía de salida a lo largo de la bajada.
  function energias(h0, roce, frac) {
    const m = 2, E = m * G * h0, perd = roce ? 0.25 * E * frac : 0, Uv = m * G * h0 * (1 - frac) * (1 - frac), Kv = E - Uv - perd;
    return { m, E, perd, Uv, Kv, vv: Math.sqrt(2 * Kv / m) };
  }
  // Punto de la rampa en el avance u (0 arriba, 1 abajo): la misma curva que se dibuja.
  const enRampa = (h0, u) => [-2 + 2.4 * u, h0 * 0.36 * (1 - u) * (1 - u)];
  function rampa(h0, roce, frac = 1, o = {}) {
    const { E, perd, Uv, Kv, vv } = energias(h0, roce, frac);
    const curva = Array.from({ length: 21 }, (_, i) => { const t = i / 20; return [-2 + 2.4 * t, h0 * 0.36 * (1 - t) * (1 - t)]; });
    const pos = enRampa(h0, frac);   // continuo: la animación barre el avance sin saltar de muestra en muestra
    const b = barras([{ etq: 'U', val: Uv, color: 'd' }, { etq: 'K', val: Kv, color: 'h' }, { etq: 'calor', val: perd }], 0.9, 0.3, 0.38, KJ4);
    return {
      vista: { x0: -2.2, x1: 2.4, y0: -0.6, y1: 2.6 },
      alt: o.alt || `Bolita de 2 kg que baja desde ${h0} m ${roce ? 'con rozamiento' : 'sin rozamiento'}: U = ${f(Uv, 0)} J, K = ${f(Kv, 0)} J${roce ? `, calor ${f(perd, 0)} J` : ''}; rapidez ${f(vv, 2)} m/s.`,
      poligonos: [{ puntos: curva, grosor: 'contorno', rayado: true }, { puntos: [[0.4, 0], [0.7, 0]], rayado: true }, ...b.pol],
      discos: [{ c: [pos[0], pos[1] + 0.12], r: 0.12 }],
      segmentos: frac === 0 || o.cota ? [{ de: [-2.1, 0], a: [-2.1, h0 * 0.36], color: 'i', grosor: 'variable', texto: `${h0} m`, lado: 1 }] : [],
      textos: [...b.tex, ...(frac > 0 ? [{ en: [-0.9, 2.3], texto: `v = ${f(vv, 2)} m/s`, color: 'h' }] : [])],
    };
  }
  const bolita = (h0, frac) => { const g = LZ(rampa(h0, false, frac)), p = enRampa(h0, frac); return { x: g.X(p[0]), y: g.Y(p[1] + 0.12) }; };
  // Caso de «Ahora tú» y de «Así se resuelve» (la misma cuenta): v = √(2gh) sin roce; con roce, K = mgh − calor.
  const casoRampa = r => { const h0 = r.de([1.25, 1.8, 3.2, 5, 7.2, 20, 45]), m = r.de([1, 2, 5]); return { h0, vv: Math.sqrt(2 * G * h0), m }; };
  const conRoce = (r, m, h0) => { const E = m * G * h0, perd = Math.round(E * r.de([0.2, 0.36, 0.5])); return { E, perd, Kv: E - perd }; };
  const conservacion = {
    id: 'conservacion-energia',
    titulo: 'La suma no cambia sin roce',
    temas: ['Conservación de la energía mecánica'],
    pieza: 'fis-lienzo',
    // Lee (fase 2): la energía mecánica, el calor del rozamiento y qué mirar. No dice de qué depende la rapidez abajo
    // (lo que pregunta «Predice»).
    lee: {
      tarjetas: [
        { titulo: 'Altura por rapidez', texto: ['Al bajar del Huajsapata o de cualquier cerro, un cuerpo cambia energía de altura ', U, ' por energía de movimiento ', K, '. La suma de las dos se llama energía mecánica.'],
          ecuacion: ['energía mecánica = ', K, ' + ', U] },
        { titulo: 'El rozamiento calienta', texto: 'Frota tus manos rápido: se calientan. El rozamiento hace eso con todo lo que desliza: convierte parte de la energía en calor, y ese calor ya no vuelve a ser rapidez.' },
        { titulo: 'Qué mirar', texto: ['En el juego, la bolita baja por la rampa y las barras muestran ', U, ', ', K, ' y el calor. Mira la suma ', U, ' + ', K, ' en cada punto, primero sin rozamiento y después con él.'] },
      ],
    },
    juega: {
      consigna: 'Una bolita de 2 kg desliza sola por la rampa, punto a punto. Mira cómo U pasa a K. Cambia la altura y el rozamiento.',
      voz: 'Sin roce, mira la suma de U y K en cada punto.',
      controles: [
        { id: 'h', etiqueta: 'h', color: 'c-i', min: 2, max: 5, paso: 1, inicio: 4, unidad: 'm', decimales: 0 },
        { id: 'roce', etiqueta: 'Rozamiento', opciones: [{ valor: 0, texto: 'Sin' }, { valor: 1, texto: 'Con' }], inicio: 0 },
        // Animación: el avance barre la bajada de arriba abajo en 4 s y vuelve a empezar (no es el ritmo real).
        { id: 'frac', etiqueta: 'Avance', min: 0, max: 1, paso: 0.25, inicio: 0.5, unidad: '', decimales: 2, auto: { velocidad: 0.25, modo: 'repite' } },
      ],
      dibujo: val => ({ datos: rampa(val.h, val.roce === 1, val.frac, { cota: true }), estado: {} }),
      lectura: val => { const e = energias(val.h, val.roce === 1, val.frac); return [U, ` = ${f(e.Uv, 0)} · `, K, ` = ${f(e.Kv, 0)} · `, U, ' + ', K, ` = ${f(e.Uv + e.Kv, 0)} J`]; },
      // Arrastra la bolita por la rampa: el avance sigue al dedo; las barras responden. La altura va con − y +.
      arrastres: [{ id: 'bolita', etiqueta: 'avance de la bolita en la rampa',
        donde: val => bolita(val.h, val.frac),
        mover: (pt, val) => {
          let mejor = val.frac, dist = Infinity;
          for (let k = 0; k <= 4; k++) { const q = bolita(val.h, k / 4), dd = Math.hypot(q.x - pt.x, q.y - pt.y); if (dd < dist - 1e-9) { dist = dd; mejor = k / 4; } }
          return { frac: mejor };
        } }],
      minimo: 4,
    },
    predice: {
      pregunta: 'Dos rampas sin roce tienen 5 m de alto: una es recta y la otra curva y más larga. ¿Cuál deja más rápida a la bolita abajo?',
      opciones: [
        { id: 'c', texto: 'Las dos, igual de rápido', correcta: true },
        { id: 'larga', texto: 'La curva: tiene más camino para acelerar', error: 'W1', siFuera: 'Más camino, sí, pero el peso hace el mismo trabajo: depende solo de cuánto baja.' },
        { id: 'recta', texto: 'La recta: es más directa', error: 'CE-CAMINO', siFuera: 'Llega antes, quizá. Pero la rapidez abajo solo depende de la altura sin roce.' },
      ],
      dibujo: { datos: rampa(5, false, 0, { alt: 'Bolita de 2 kg arriba de una rampa curva de 5 m.' }), estado: {} },
      revelar: { datos: rampa(5, false, 1, { alt: 'Abajo de la rampa, sin roce, toda la energía potencial es cinética: 10 m/s por cualquier camino.' }), estado: {} },
      coincide: 'Coincide: los 100 J de altura se vuelven 100 J de K por cualquier camino: 10 m/s.',
    },
    mira: {
      datos: rampa(5, true, 1, { alt: 'Con rozamiento, de 100 J llegan abajo 75 J de energía cinética y 25 J se vuelven calor.' }),
      pasos: [
        { estado: {}, texto: 'Arriba, 5 m: toda la energía es potencial.', ecuacion: [Ug, ' = 2 · 10 · 5 = 100 J'] },
        { estado: {}, texto: 'Sin roce, abajo sería toda cinética.', ecuacion: ['½ · 2 · ', { sup: ['v', '2'] }, ' = 100   →   v = 10 m/s'] },
        { estado: {}, texto: 'Con roce, una parte se vuelve calor: la energía no desaparece.', ecuacion: [K, ' = 100 − 25 = 75 J'] },
        { estado: {}, texto: 'Llega más lento.', ecuacion: ['v = ', { raiz: ['75'] }, ' ≈ 8,66 m/s'] },
      ],
    },
    regla: {
      texto: 'Sin rozamiento, la energía potencial que se pierde se gana como cinética: la energía mecánica, K + U, no cambia. Con rozamiento, la diferencia se vuelve calor.',
      ecuacion: [{ llave: [K0, ' + ', { sub: [U, '0'] }], nota: 'al salir', color: 'c-d' }, ' = ', K, ' + ', U, ' + calor', '   ·   ', 'v = ', { raiz: ['2 g ', h] }],
      condicion: 'v = √(2gh) supone partir del reposo, sin roce ni aire y un cuerpo que desliza, sin rodar.',
    },
    // Así se resuelve: la bajada por la rampa, sin roce (rapidez) o con roce (energía cinética), alternadas como en
    // «Ahora tú» y calculadas igual (casoRampa y conRoce).
    resuelve: {
      generar(sm) {
        const r = azar(sm + 900), { h0, vv, m } = casoRampa(r), U0 = { sub: [U, '0'] };
        if (sm % 3 === 2) {
          const { E, perd, Kv } = conRoce(r, m, h0);
          return {
            enunciado: `Un bloque de ${m} kg baja desde ${f(h0, 2)} m de altura, partiendo del reposo. El rozamiento convierte ${perd} J en calor. ¿Con qué energía cinética llega abajo?`,
            pasos: [
              { tipo: 'pide', texto: ['Piden la energía cinética ', K, ' del bloque al llegar abajo, con rozamiento.'] },
              { tipo: 'datos', texto: [`La masa es ${m} kg y parte del reposo desde `, h, ` = ${f(h0, 2)} m. El rozamiento se lleva ${perd} J en calor.`] },
              { tipo: 'regla', texto: 'La energía de arriba no desaparece: abajo se reparte entre energía cinética y calor.',
                ecuacion: [U0, ' = ', K, ' + calor'] },
              { tipo: 'cuentas', texto: 'Arriba está quieto: toda su energía es potencial. Le descuento el calor.',
                ecuacion: [U0, ` = ${m} · 10 · ${f(h0, 2)} = ${f(E, 2)} J   ·   `, K, ` = ${f(E, 2)} − ${perd} = ${f(Kv, 2)} J`] },
              { tipo: 'sentido', texto: `Llega con menos que los ${f(E, 2)} J que tendría sin rozamiento, y no falta nada: ${f(Kv, 2)} + ${perd} = ${f(E, 2)} J.` },
            ],
            respuesta: [K, ` = ${f(Kv, 2)} J`],
          };
        }
        return {
          enunciado: `Un bloque de ${m} kg se suelta desde ${f(h0, 2)} m de altura y baja por una rampa sin rozamiento. Con g = 10 m/s², ¿con qué rapidez llega abajo?`,
          pasos: [
            { tipo: 'pide', texto: 'Piden la rapidez del bloque al llegar al pie de la rampa.' },
            { tipo: 'datos', texto: [`La masa es ${m} kg; parte del reposo desde `, h, ` = ${f(h0, 2)} m, sin rozamiento.`] },
            { tipo: 'regla', texto: 'Sin rozamiento, toda la energía potencial que pierde al bajar se vuelve energía cinética.',
              ecuacion: ['m g ', h, ' = ½ m ', { sup: ['v', '2'] }] },
            { tipo: 'cuentas', texto: 'La masa está a los dos lados y se simplifica. Despejo v al cuadrado y saco la raíz.',
              ecuacion: [{ sup: ['v', '2'] }, ` = 2 · 10 · ${f(h0, 2)} = ${f(2 * G * h0, 2)}   ·   v = `, { raiz: [`${f(2 * G * h0, 2)}`] }, ` = ${f(vv, 2)} m/s`] },
            { tipo: 'sentido', texto: `De vuelta: ½ · ${m} · ${f(vv, 2)}² = ${f(m * vv * vv / 2, 2)} J, lo mismo que m g h = ${f(m * G * h0, 2)} J. Cuadra.` },
          ],
          respuesta: `v = ${f(vv, 2)} m/s`,
        };
      },
    },
    ahoraTu: {
      generar(sm) {
        const r = azar(sm), { h0, vv, m } = casoRampa(r);
        if (sm % 3 === 2) {
          const { E, perd, Kv } = conRoce(r, m, h0);
          return {
            pregunta: `Un bloque de ${m} kg baja desde ${f(h0, 2)} m de altura, partiendo del reposo. El rozamiento convierte ${perd} J en calor. ¿Con qué energía cinética llega abajo?`,
            opciones: opciones(Kv, [
              { id: 'sin-roce', valor: E, error: 'CE-ROCE', siFuera: 'Eso sería sin rozamiento. Aquí una parte se fue en calor.' },
              { id: 'suma', valor: E + perd, error: 'W14', siFuera: 'El calor no se suma a la cinética: sale de la misma energía.' },
              { id: 'perd', valor: perd, error: 'CE-ROCE', siFuera: 'Esa es la parte que se volvió calor.' },
            ], n => `${f(n, 2)} J`),
            solucion: { texto: 'De la energía de arriba se descuenta el calor.', ecuacion: [K, ` = ${m} · 10 · ${f(h0, 2)} − ${perd} = ${f(Kv, 2)} J`] },
          };
        }
        return {
          pregunta: `Un bloque de ${m} kg se suelta desde ${f(h0, 2)} m de altura y baja por una rampa sin rozamiento. Con g = 10 m/s², ¿con qué rapidez llega abajo?`,
          opciones: opciones(vv, [
            { id: 'sin-raiz', valor: 2 * G * h0, error: 'CE-SIN-RAIZ', siFuera: 'Eso es v²; falta sacar la raíz.' },
            { id: 'gh', valor: Math.sqrt(G * h0), error: 'TE-SIN-MEDIO', siFuera: 'Eso olvida el 2 que sale de despejar el ½ de K.' },
            { id: 'masa', valor: Math.sqrt(2 * G * h0 / m), error: 'CE-MASA', siFuera: 'La masa se simplifica: está en U y en K.' },
          ], n => `${f(n, 2)} m/s`),
          solucion: { texto: 'mgh = ½mv²: la masa se simplifica.', ecuacion: ['v = ', { raiz: [`2 · 10 · ${f(h0, 2)}`] }, ` = ${f(vv, 2)} m/s`] },
        };
      },
    },
  };

  // ---------- Idea 5: potencia es rapidez para hacer trabajo ----------
  // Cambia: el tiempo de subida y la eficiencia del motor · Permanece: el trabajo útil (subir 50 kg a 10 m) ·
  // Progresa: la potencia, que crece al bajar el tiempo · Se reserva: la energía de entrada, mayor que la útil ·
  // Debe verse: igual trabajo en menos tiempo es más potencia; nunca sale más de lo que entra.
  const KJ5 = 0.00022; // los 10 000 J que consume con 50 % caben en 2,2 m
  function motor(t, ef, o = {}) {
    const W = 50 * G * 10, Pu = W / t, Ein = W / ef, Pin = Ein / t, vs = 10 / t;   // sube a velocidad constante
    const b = barras([{ etq: 'entra', val: Ein }, { etq: 'útil', val: W, color: 'd' }, { etq: 'calor', val: Ein - W }], -0.3, 0.3, 0.55, KJ5);
    // La carga cuelga de una polea; su flecha de velocidad (40 px por m/s) se alarga cuando el tiempo se acorta.
    return {
      vista: { x0: -2.2, x1: 2.2, y0: -0.6, y1: 3.3 },
      alt: o.alt || `Motor que sube 50 kg a 10 m en ${f(t, 0)} s con eficiencia ${f(ef * 100, 0)} %: sube a ${f(vs, 2)} m/s; potencia útil ${f(Pu, 0)} W, de entrada ${f(Pin, 0)} W.`,
      poligonos: [caja(-1.7, 0.3, 0.72, 0.5), caja(-0.95, 0.9, 0.5, 0.35), { puntos: [[-1.45, 0.8], [-1.45, 2.2]], grosor: 'fino' }, { puntos: [[-0.95, 1.25], [-0.95, 2.2]], grosor: 'fino' }, ...b.pol],
      discos: [{ c: [-1.2, 2.2], r: 0.25 }],
      flechas: [{ de: [-0.8, 1.25], d: [0, vs], escala: 40 }],
      textos: [...b.tex, { en: [-1.7, 0.48], texto: 'motor' }, { en: [-0.95, 0.66], texto: '50 kg' },
        { en: [-1.3, 2.68], texto: `sube a ${f(vs, 2)} m/s` }, { en: [-1.3, 3.05], texto: `${f(Pu, 0)} W útiles`, color: 'd' }],
    };
  }
  // Caso de «Ahora tú» y de «Así se resuelve» (la misma cuenta): W = mgh, P útil = W/t y P que entra = P útil/η.
  const casoMotor = r => {
    const m = r.de([20, 40, 50, 80, 100]), hh = r.de([5, 10, 12, 15]), t = r.de([5, 10, 20, 25, 40]), ef = r.de([0.5, 0.75, 0.8, 1]);
    const W = m * G * hh, Pu = W / t;
    return { m, hh, t, ef, W, Pu, Pin: Pu / ef };
  };
  const potencia = {
    id: 'potencia-y-eficiencia',
    titulo: 'Potencia: trabajo por segundo',
    temas: ['Potencia y eficiencia'],
    pieza: 'fis-lienzo',
    // Lee (fase 2): el watt, la eficiencia y qué mirar. No dice si el trabajo cambia con el tiempo (lo que pregunta
    // «Predice»).
    lee: {
      tarjetas: [
        { titulo: 'Se mide en watts', texto: 'La potencia se mide en watts (W): un watt es un joule en cada segundo. Un foco LED de la casa usa unos 10 W; una terma eléctrica, unos 1500 W.',
          ecuacion: ['1 W = 1 J / 1 s'] },
        { titulo: 'Nada sale gratis', texto: 'Un motor recibe energía eléctrica y entrega trabajo útil, pero una parte se le escapa como calor: por eso se calienta. La eficiencia dice qué fracción de lo que entra sale como útil.' },
        { titulo: 'Qué mirar', texto: 'En el juego, el motor sube la caja de 50 kg y el tiempo de subida cambia solo. Mira las tres barras y los watts útiles mientras el tiempo cambia.' },
      ],
    },
    juega: {
      consigna: 'Un motor sube 50 kg a 10 m; el tiempo cambia solo, de 10 a 40 s. Mira la barra útil y la potencia.',
      voz: 'Mientras cambia el tiempo, ¿cambia la barra útil?',
      // Animación: el tiempo de subida va y vuelve de 10 s a 40 s (6 s por segundo); P = W / t en cada cuadro.
      controles: [
        { id: 't', etiqueta: 't', min: 10, max: 40, paso: 10, inicio: 20, unidad: 's', decimales: 0, auto: { velocidad: 6, modo: 'rebota' } },
        { id: 'ef', etiqueta: 'Eficiencia', opciones: [{ valor: 1, texto: '100 %' }, { valor: 0.8, texto: '80 %' }, { valor: 0.5, texto: '50 %' }], inicio: 0.8 },
      ],
      dibujo: val => ({ datos: motor(val.t, val.ef), estado: {} }),
      lectura: val => [`t = ${f(val.t, 1)} s · P útil = ${f(5000 / val.t, 0)} W · consume ${f(5000 / val.ef / val.t, 0)} W`],
      minimo: 4,
    },
    predice: {
      pregunta: 'Un motor sube la caja de 50 kg a 10 m en 10 s; otro motor sube la misma caja a la misma altura en 20 s. ¿Cuál hace más trabajo sobre la caja?',
      opciones: [
        { id: 'c', texto: 'Los dos hacen el mismo trabajo', correcta: true },
        { id: 'ana', texto: 'El de 10 s, porque lo hace más rápido', error: 'PO-TRABAJO', siFuera: 'El de 10 s desarrolla más potencia. El trabajo es el mismo: misma caja, misma altura.' },
        { id: 'beto', texto: 'El de 20 s, porque tarda más', error: 'W15', siFuera: 'Tardar más no suma trabajo: el peso sube la misma altura.' },
      ],
      dibujo: { datos: motor(20, 1, { alt: 'Subir 50 kg a 10 m siempre cuesta 5000 J de trabajo útil.' }), estado: {} },
      revelar: { datos: motor(10, 1, { alt: 'En la mitad del tiempo, el mismo trabajo de 5000 J: el doble de potencia.' }), estado: {} },
      coincide: 'Coincide: el trabajo es el mismo; el motor de 10 s usa el doble de potencia.',
    },
    mira: {
      datos: motor(10, 0.8),
      pasos: [
        { estado: {}, texto: 'Subir 50 kg a 10 m es un trabajo útil fijo.', ecuacion: ['W = 50 · 10 · 10 = 5000 J'] },
        { estado: {}, texto: 'Hacerlo en 10 s pide esta potencia útil.', ecuacion: [{ sub: ['P', 'útil'] }, ' = ', { frac: ['5000', '10'] }, ' = 500 W'] },
        { estado: {}, texto: 'Si aprovecha el 80 %, consume más de lo que entrega.', ecuacion: [{ sub: ['P', 'entra'] }, ' = ', { frac: ['500', '0,8'] }, ' = 625 W'] },
        { estado: {}, texto: 'La diferencia se vuelve calor en el motor.', ecuacion: ['625 − 500 = 125 W'] },
      ],
    },
    regla: {
      texto: 'Potencia es el trabajo hecho en cada segundo. La eficiencia es la fracción de la energía que entra que sale como útil.',
      ecuacion: ['P = ', { frac: ['W', 't'] }, ' = ', F, ' v', '   ·   ', { llave: ['η'], nota: 'eficiencia', color: 'c-d' }, ' = ', { frac: [{ sub: ['P', 'útil'] }, { sub: ['P', 'entra'] }] }],
      condicion: 'P = Fv con F en la dirección de v. η nunca pasa de 1: ninguna máquina entrega más de lo que recibe.',
    },
    // Así se resuelve: la potencia útil o la que consume el motor, alternadas como en «Ahora tú» y calculadas igual
    // (casoMotor: P = W/t y P que entra = P útil/η).
    resuelve: {
      generar(sm) {
        const { m, hh, t, ef, W, Pu, Pin } = casoMotor(azar(sm + 900)), pideEntrada = ef < 1 && sm % 2 === 1;
        const Pu_ = { sub: ['P', 'útil'] }, Pe = { sub: ['P', 'entra'] };
        const trabajo = ['W = m g ', h, ` = ${m} · 10 · ${hh} = ${f(W, 0)} J   ·   `];
        if (pideEntrada) return {
          enunciado: `Un motor con eficiencia de ${f(ef * 100, 0)} % sube ${m} kg a ${hh} m en ${t} s. Con g = 10 m/s², ¿qué potencia consume?`,
          pasos: [
            { tipo: 'pide', texto: 'Piden la potencia que consume el motor: la que entra, no la que entrega.' },
            { tipo: 'datos', texto: [`Sube ${m} kg a `, h, ` = ${hh} m en ${t} s, con eficiencia η = ${f(ef, 2)}.`] },
            { tipo: 'regla', texto: 'La potencia útil es el trabajo entre el tiempo. Lo útil es solo una fracción de lo que entra: por eso se divide entre la eficiencia.',
              ecuacion: [Pu_, ' = ', { frac: ['W', 't'] }, '   ·   ', Pe, ' = ', { frac: [Pu_, 'η'] }] },
            { tipo: 'cuentas', texto: 'Primero el trabajo útil, después la potencia útil y al final la que entra.',
              ecuacion: [...trabajo, Pu_, ` = ${f(W, 0)} / ${t} = ${f(Pu, 2)} W   ·   `, Pe, ` = ${f(Pu, 2)} / ${f(ef, 2)} = ${f(Pin, 2)} W`] },
            { tipo: 'sentido', texto: `Consume más de lo que entrega, como debe ser. La diferencia, ${f(Pin - Pu, 2)} W, se vuelve calor en el motor.` },
          ],
          respuesta: [Pe, ` = ${f(Pin, 2)} W`],
        };
        return {
          enunciado: `Una grúa sube ${m} kg a ${hh} m de altura en ${t} s, a velocidad constante. Con g = 10 m/s², ¿qué potencia útil desarrolla?`,
          pasos: [
            { tipo: 'pide', texto: 'Piden la potencia útil: cuánto trabajo hace la grúa en cada segundo.' },
            { tipo: 'datos', texto: [`Sube ${m} kg a `, h, ` = ${hh} m en ${t} s, a velocidad constante.`] },
            { tipo: 'regla', texto: 'La potencia es el trabajo dividido entre el tiempo. A velocidad constante, el trabajo útil es el peso por la altura.',
              ecuacion: ['P = ', { frac: ['W', 't'] }, '   ·   ', 'W = m g ', h] },
            { tipo: 'cuentas', texto: 'Primero el trabajo de subir la carga; después lo reparto entre los segundos.',
              ecuacion: [...trabajo, `P = ${f(W, 0)} / ${t} = ${f(Pu, 2)} W`] },
            { tipo: 'sentido', texto: `Un joule entre un segundo es un watt. Si tardara el doble, la potencia sería la mitad: ${f(Pu / 2, 2)} W.` },
          ],
          respuesta: `P = ${f(Pu, 2)} W`,
        };
      },
    },
    ahoraTu: {
      generar(sm) {
        const { m, hh, t, ef, W, Pu, Pin } = casoMotor(azar(sm)), pideEntrada = ef < 1 && sm % 2 === 1;
        return pideEntrada ? {
          pregunta: `Un motor con eficiencia de ${f(ef * 100, 0)} % sube ${m} kg a ${hh} m en ${t} s. Con g = 10 m/s², ¿qué potencia consume?`,
          opciones: opciones(Pin, [
            { id: 'util', valor: Pu, error: 'PO-EFIC', siFuera: 'Esa es la potencia útil; el motor consume más.' },
            { id: 'por', valor: Pu * ef, error: 'PO-EFIC', siFuera: 'Multiplicar por η da menos que lo útil: se divide.' },
            { id: 'sin-t', valor: W / ef, error: 'PO-SIN-T', siFuera: 'Esa es la energía consumida, en J; falta dividir entre el tiempo.' },
          ], n => `${f(n, 2)} W`),
          solucion: { texto: `Útil: ${f(Pu, 2)} W; entra lo útil entre la eficiencia.`, ecuacion: [{ sub: ['P', 'entra'] }, ` = ${f(Pu, 2)} / ${f(ef, 2)} = ${f(Pin, 2)} W`] },
        } : {
          pregunta: `Una grúa sube ${m} kg a ${hh} m de altura en ${t} s, a velocidad constante. Con g = 10 m/s², ¿qué potencia útil desarrolla?`,
          opciones: opciones(Pu, [
            { id: 'trabajo', valor: W, error: 'W15', siFuera: 'Ese es el trabajo, en J. La potencia lo divide entre el tiempo.' },
            { id: 'inversa', valor: t / W, error: 'PO-INVERSA', siFuera: 'Eso divide el tiempo entre el trabajo; es al revés.' },
            { id: 'sin-g', valor: m * hh / t, error: 'PO-SIN-T', siFuera: 'Falta g: el trabajo es peso por altura.' },
          ], n => `${f(n, 2)} W`),
          solucion: { texto: `El trabajo es ${f(W, 0)} J, hecho en ${t} s.`, ecuacion: [`P = ${f(W, 0)} / ${t} = ${f(Pu, 2)} W`] },
        };
      },
    },
  };

  // Motores de las mesas del laboratorio (los mismos que dibujan y leen). `guardado` dice si el caso actual ya se guardó.
  const trabajoCuerda = val => val.F * 5 * Math.cos(rad(val.ang));
  const guardado = (val, gs, claves) => gs.some(g => claves.every(c => g[c] === val[c]));

  return {
    unidad: 'fisica.trabajo-y-energia',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/ejes.js', '/nucleo/kit/piezas/fis-lienzo.js'],
    // Glosario del tema (docs/teoria.md, 4d): las palabras que esta unidad estrena en el curso.
    glosario: [
      { termino: 'trabajo', formas: ['trabajo'], simbolo: 'W', medida: 'J', def: 'Lo que aporta una fuerza al mover algo: su parte a lo largo del camino por la distancia.',
        ejemplo: '20 N en el sentido del avance, a lo largo de 5 m: W = 100 J.', ver: ['energía', 'potencia'] },
      { termino: 'trabajo neto', simbolo: 'Wneto', medida: 'J', def: 'Suma de lo que trabajan todas las fuerzas sobre un cuerpo; es igual al cambio de su energía cinética.',
        ejemplo: 'Fuerza neta de 8 N a lo largo de 2 m: Wneto = 16 J.', ver: ['energía cinética'] },
      { termino: 'energía', medida: 'J', def: 'Capacidad de hacer trabajo o dar calor; cambia de forma, pero no se crea ni se destruye.',
        ver: ['trabajo', 'energía mecánica'] },
      { termino: 'energía cinética', simbolo: 'K', medida: 'J', def: 'Energía de un cuerpo por moverse: crece con su masa y con el cuadrado de su rapidez.',
        ejemplo: '2 kg a 3 m/s: K = ½ · 2 · 3² = 9 J.', ver: ['trabajo neto'] },
      { termino: 'energía potencial', simbolo: 'U', medida: 'J', def: 'Energía guardada por la posición o la forma: la altura de un cuerpo, un resorte deformado, dos cargas cercanas.',
        ver: ['energía potencial gravitatoria', 'energía potencial elástica'] },
      { termino: 'energía potencial gravitatoria', simbolo: 'Ug', medida: 'J', def: 'Energía de un cuerpo por su altura sobre una referencia elegida: masa por g por altura.',
        ejemplo: 'Libro de 2 kg a 1 m del piso: Ug = 2 · 10 · 1 = 20 J.', ver: ['gravedad'] },
      { termino: 'energía potencial elástica', simbolo: 'Ue', medida: 'J', def: 'Energía guardada en un resorte estirado o comprimido; crece con el cuadrado de la deformación.',
        ejemplo: 'k = 200 N/m comprimido 0,1 m: Ue = ½ · 200 · 0,1² = 1 J.' },
      { termino: 'energía mecánica', medida: 'J', def: 'Suma de la energía cinética y la potencial de un cuerpo. Sin rozamiento, no cambia.',
        ejemplo: '2 kg en reposo a 5 m: 100 J; abajo, sin roce, K = 100 J.', ver: ['energía cinética', 'energía potencial'] },
      { termino: 'potencia', simbolo: 'P', medida: 'W', def: 'Rapidez para hacer trabajo: cuánto trabajo se hace en cada segundo.',
        ejemplo: '5000 J en 10 s: P = 500 W.', ver: ['trabajo', 'eficiencia'] },
      { termino: 'eficiencia', simbolo: 'η', medida: '%', def: 'Fracción de la energía que recibe una máquina que sale como útil. Nunca pasa de 100 %.',
        ejemplo: 'Consume 625 W y entrega 500 W útiles: η = 0,8, es decir, 80 %.', ver: ['potencia'] },
    ],
    // Laboratorio: juego libre, sin preguntas. La cuerda libre mueve fuerza y ángulo con una sola manija (en la idea,
    // F está fija y el ángulo va de 30 en 30); la rampa y el empujón son los juegos de las ideas 4 y 2.
    laboratorio: [
      {
        id: 'cuerda-libre', titulo: 'Cuerda con fuerza y ángulo', pieza: 'fis-lienzo',
        consigna: 'La cuerda gira sola mientras la caja avanza 5 m. Arrastra la punta de F: su largo es la fuerza y su giro, el ángulo.',
        controles: [
          { id: 'F', etiqueta: 'F', color: 'c-o', min: 5, max: 20, paso: 5, inicio: 15, unidad: 'N', decimales: 0 },
          { id: 'ang', etiqueta: 'Ángulo', min: 0, max: 180, paso: 15, inicio: 45, unidad: '°', decimales: 0, auto: { velocidad: 30, modo: 'rebota' } },
        ],
        dibujo: val => ({ datos: jalar(val.ang, { F: val.F, comp: 0 }), estado: {} }),
        lectura: val => [leerW(val.F, val.ang)],
        arrastres: [{ id: 'cuerda', etiqueta: 'fuerza y ángulo de la cuerda (punta de F)', color: 'c-o',
          donde: val => puntaF(val.ang, val.F),
          mover: (pt, val) => { const q = anguloDe(pt, val.ang, val.F); return { ang: q.th, F: q.largo / KF1 }; } }],
        invitaciones: [
          { texto: 'Jala con 20 N y haz que la cuerda no haga ningún trabajo.',
            logrado: val => val.F === 20 && Math.abs(trabajoCuerda(val)) < 1e-9,
            bien: 'Toda la fuerza va de lado: nada acompaña al avance. ¿Y a 120°?' },
          { texto: 'Consigue que la cuerda frene la caja con un trabajo de −50 J.',
            logrado: val => Math.abs(trabajoCuerda(val) + 50) < 1e-9,
            bien: 'Pasado 90°, la cuerda va contra el avance y su trabajo es negativo.' },
          { texto: 'Busca el trabajo más negativo que puede hacer la cuerda.',
            // El extremo de la grilla: la fuerza más grande, justo contra el avance.
            logrado: val => trabajoCuerda(val) <= trabajoCuerda({ F: 20, ang: 180 }) + 1e-9,
            bien: 'Toda la fuerza contra el avance: frena con −100 J.' },
          { texto: 'Pausa la cuerda justo cuando deja de hacer trabajo.',
            // Con la animación en pausa el ángulo queda donde se detuvo: vale si W cae a menos de 1 J de cero.
            logrado: val => Math.abs(trabajoCuerda(val)) < 1,
            bien: 'A 90° la cuerda solo jala de lado: W = 0 con cualquier fuerza.',
            pista: 'Pausa cerca de 90°; ajusta el ángulo con − y +.' },
          { texto: 'Guarda dos casos con distinta fuerza que hagan el mismo trabajo, sin ser cero.',
            logrado: (val, guardados) => Math.abs(trabajoCuerda(val)) > 1e-9 && guardado(val, guardados, ['F', 'ang'])
              && guardados.some(g => g.F !== val.F && Math.abs(trabajoCuerda(g) - trabajoCuerda(val)) < 1e-9),
            bien: 'Más fuerza, más inclinada: cuenta solo la parte que acompaña al camino.' },
        ],
      },
      Object.assign({ id: 'rampa', titulo: 'La rampa con y sin roce', pieza: 'fis-lienzo',
        invitaciones: [
          { texto: 'Haz que la bolita llegue abajo con 60 J de energía cinética.',
            logrado: val => val.frac === 1 && Math.abs(energias(val.h, val.roce === 1, val.frac).Kv - 60) < 1e-9,
            bien: 'Hay dos maneras: 3 m sin roce o 4 m con roce. ¿Las hallaste?' },
          { texto: 'Con rozamiento, consigue la mayor rapidez posible.',
            logrado: val => val.roce === 1 && energias(val.h, true, val.frac).vv >= energias(5, true, 1).vv - 1e-9,
            bien: 'Desde lo más alto y hasta abajo. Aun así, el roce se llevó un cuarto.' },
          { texto: 'Guarda el mismo punto de la bajada con y sin roce.',
            logrado: (val, guardados) => val.frac > 0 && guardado(val, guardados, ['h', 'roce', 'frac'])
              && guardados.some(g => g.h === val.h && g.frac === val.frac && g.roce !== val.roce),
            bien: 'Sin roce, U + K se queda igual; con roce, lo que falta es calor.' },
          { texto: 'Pon el roce y haz que la barra de calor llegue a 25 J.',
            logrado: val => val.roce === 1 && Math.abs(energias(val.h, true, val.frac).perd - 25) < 1e-9,
            bien: 'Ese calor salió de los 100 J de arriba: la energía no desaparece.' },
        ] }, conservacion.juega),
      Object.assign({ id: 'empujon', titulo: 'El empujón y las barras', pieza: 'fis-lienzo',
        invitaciones: [
          { texto: 'Guarda dos empujones distintos que den la misma rapidez.',
            logrado: (val, guardados) => guardado(val, guardados, ['F', 'd'])
              && guardados.some(g => g.F !== val.F && Math.abs(salida(g.F, g.d).v - salida(val.F, val.d).v) < 1e-9),
            bien: 'Mismo trabajo, misma rapidez: no importa si pusiste fuerza o distancia.' },
          { texto: 'Consigue el triple de rapidez que da empujar con 5 N por 1 m.',
            logrado: val => Math.abs(salida(val.F, val.d).v - 3 * salida(5, 1).v) < 1e-9,
            bien: 'Triple de rapidez pidió nueve veces el trabajo: K va con v².' },
          { texto: 'Busca la menor fuerza que lo haga salir a más de 5 m/s.',
            // Con 5 N no alcanza ni en 4 m (√20 ≈ 4,47 m/s); con 10 N y 3 m, sí.
            logrado: val => salida(val.F, val.d).v > 5 && !(salida(val.F - 5, 4).v > 5),
            bien: 'Con menos fuerza no alcanza ni empujando los 4 m.' },
        ] }, teorema.juega),
    ],
    historia: {
      texto: 'Comparar máquinas obligó a preguntar cuánto efecto útil daban y adónde iba lo que parecía perderse. En la década de 1840, Joule agitó agua con paletas movidas por pesas que bajaban y midió cómo subía su temperatura: el trabajo mecánico se volvía calor. Así se armó la idea de una energía que cambia de forma.',
      pregunta: '¿Adónde se va la energía que «se pierde» por rozamiento?',
      fuente: { titulo: 'Science Museum Group — réplica del calorímetro de Joule', url: 'https://collection.sciencemuseumgroup.org.uk/objects/co8404682/replica-of-calorimeter-used-by-james-joule' },
    },
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea). Una lista vacía:
    // la mesa no practica ninguna idea de la unidad y va en «Más mesas del tema».
    laboratorioIdeas: {
      'cuerda-libre': ['trabajo-y-angulo'],
      'rampa': ['conservacion-energia'],
      'empujon': ['trabajo-energia-cinetica'],
    },
    ideas: [trabajo, teorema, potencial, conservacion, potencia],
  };
});
