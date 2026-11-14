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
    const Fv = 20, dd = 5, W = Fv * dd * Math.cos(rad(ang)), c = Math.cos(rad(ang)), s = Math.sin(rad(ang));
    const P = [0.45, 0.35];
    return {
      vista: { x0: -2.2, x1: 2.6, y0: -0.7, y1: 1.9 }, escalaF: KF1,
      alt: o.alt || `Caja jalada con 20 N a ${ang}° de la horizontal a lo largo de 5 m: el trabajo de la cuerda es ${f(W, 1)} J.`,
      poligonos: [{ puntos: [[-2.1, 0], [2.5, 0]], rayado: true }, caja(0, 0, 0.9, 0.7)],
      segmentos: [{ de: [-0.45, -0.35], a: [2.2, -0.35], color: 'i', grosor: 'variable', texto: 'recorre 5 m', lado: -1 }],
      flechas: [{ de: P, d: [Fv * c, Fv * s], color: 'o', rotulo: 'F = 20 N' },
        ...(o.comp ? [{ de: P, d: [Fv * c, 0], color: 'o', discontinua: true, rotulo: `${f(Fv * c, 1)} N`, paso: o.comp }] : [])],
      arcos: ang > 0 && ang < 180 ? [{ c: P, rpx: 28, de: 0, a: ang, rotulo: `${ang}°` }] : [],
    };
  }
  const trabajo = {
    id: 'trabajo-y-angulo',
    titulo: 'Solo trabaja lo que acompaña',
    temas: ['Trabajo de fuerzas constantes y variables'],
    pieza: 'fis-lienzo',
    juega: {
      consigna: 'Una cuerda jala una caja con 20 N mientras avanza 5 m. Cambia el ángulo de la cuerda.',
      voz: 'Prueba 90°. ¿Cuánto ayuda la cuerda al avance?',
      controles: [{ id: 'ang', etiqueta: 'Ángulo', min: 0, max: 180, paso: 30, inicio: 30, unidad: '°', decimales: 0 }],
      dibujo: val => ({ datos: jalar(val.ang), estado: {} }),
      lectura: val => [`W = 20 · 5 · cos ${val.ang}° = ${f(100 * Math.cos(rad(val.ang)), 1)} J`],
      minimo: 4,
    },
    predice: {
      pregunta: 'Caminas 10 m en horizontal, a velocidad constante, sosteniendo una mochila de 50 N. ¿Cuánto trabajo hace sobre la mochila la fuerza hacia arriba de tu mano?',
      opciones: [
        { id: 'c', texto: '0 J', correcta: true },
        { id: 'todo', texto: '500 J', error: 'TR-PERP', siFuera: 'Sería cierto si la subieras 10 m. Tu fuerza es vertical y el camino horizontal.' },
        { id: 'neg', texto: '−500 J', error: 'TR-SIGNO', siFuera: 'Negativo sería si la fuerza fuera contra el avance. Aquí es perpendicular.' },
      ],
      dibujo: { datos: jalar(90, { alt: 'Caja que avanza 5 m con una fuerza vertical hacia arriba.' }), estado: {} },
      revelar: { datos: jalar(90, { comp: 0, alt: 'La fuerza vertical no tiene parte a lo largo del camino horizontal: su trabajo es cero.' }), estado: {} },
      coincide: 'Coincide: una fuerza perpendicular al camino no hace trabajo, aunque sea grande.',
    },
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
      ecuacion: ['W = ', F, ' ', d, ' cos θ   ·   W = área bajo ', F, '–', x],
      condicion: 'θ es el ángulo entre F y el desplazamiento. Contra el avance (θ > 90°), el trabajo es negativo.',
    },
    ahoraTu: {
      generar(sm) {
        const r = azar(sm), Fv = r.de([10, 20, 25, 40, 50]), dd = r.de([2, 3, 4, 5, 10]), ang = r.de([0, 37, 53, 60, 90, 120, 180]);
        const COS = { 0: 1, 37: 0.8, 53: 0.6, 60: 0.5, 90: 0, 120: -0.5, 180: -1 }, SEN = { 0: 0, 37: 0.6, 53: 0.8, 60: Math.sqrt(3) / 2, 90: 1, 120: Math.sqrt(3) / 2, 180: 0 };
        const W = Fv * dd * COS[ang];
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
  function empujon(Fv, dd, o = {}) {
    const W = Fv * dd, vv = Math.sqrt(2 * W / 2);
    const b = barras([{ etq: 'W', val: W }, { etq: 'K', val: W, color: 'h' }], 0.6, 0.3, 0.6, KJ2);
    return {
      vista: { x0: -2.2, x1: 2.2, y0: -0.6, y1: 3 }, escalaF: 4,
      alt: o.alt || `Carrito de 2 kg empujado con ${Fv} N a lo largo de ${dd} m desde el reposo: el trabajo, ${f(W, 0)} J, es su energía cinética; sale a ${f(vv, 2)} m/s.`,
      poligonos: [{ puntos: [[-2.1, 0], [0.3, 0]], rayado: true }, caja(-1.5, 0.12, 0.6, 0.4), ...b.pol],
      discos: [{ c: [-1.7, 0.08], r: 0.08 }, { c: [-1.3, 0.08], r: 0.08 }],
      segmentos: [{ de: [-1.8, -0.3], a: [-1.8 + dd * 0.35, -0.3], color: 'i', grosor: 'variable', texto: `${dd} m`, lado: -1 }],
      flechas: [{ de: [-1.2, 0.32], d: [Fv, 0], color: 'o', rotulo: `${Fv} N` }],
      textos: [...b.tex, { en: [-1.1, 1.0], texto: `v = ${f(vv, 2)} m/s`, color: 'h' }],
    };
  }
  const teorema = {
    id: 'trabajo-energia-cinetica',
    titulo: 'El trabajo neto se vuelve rapidez',
    temas: ['Teorema trabajo-energía cinética'],
    pieza: 'fis-lienzo',
    juega: {
      consigna: 'Un carrito de 2 kg parte del reposo sin rozamiento. Elige la fuerza y por cuántos metros empuja.',
      voz: 'Busca dos maneras de darle la misma rapidez.',
      controles: [
        { id: 'F', etiqueta: 'F', color: 'c-o', min: 5, max: 20, paso: 5, inicio: 10, unidad: 'N', decimales: 0 },
        { id: 'd', etiqueta: 'd', color: 'c-i', min: 1, max: 4, paso: 1, inicio: 2, unidad: 'm', decimales: 0 },
      ],
      dibujo: val => ({ datos: empujon(val.F, val.d), estado: {} }),
      lectura: val => [`W = `, K, ` = ${f(val.F * val.d, 0)} J · v = ${f(Math.sqrt(val.F * val.d), 2)} m/s`],
      minimo: 4,
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
        { estado: {}, texto: 'Un carrito de 2 kg va a 3 m/s.', ecuacion: [K0, ' = ½ · 2 · 3² = 9 J'] },
        { estado: {}, texto: 'Una fuerza neta de 8 N lo empuja 2 m.', ecuacion: ['W = 8 · 2 = 16 J'] },
        { estado: {}, texto: 'Ese trabajo se suma a su energía cinética.', ecuacion: [K, ' = 9 + 16 = 25 J'] },
        { estado: {}, texto: 'De ahí sale su nueva rapidez.', ecuacion: ['½ · 2 · v² = 25   →   v = 5 m/s'] },
      ],
    },
    regla: {
      texto: 'El trabajo de la fuerza neta es lo que cambia la energía cinética. La energía cinética crece con el cuadrado de la rapidez.',
      ecuacion: [{ sub: ['W', 'neto'] }, ' = Δ', K, ' = ½ m v² − ½ m ', { sup: [{ sub: ['v', '0'] }, '2'] }],
      condicion: 'W es el trabajo de todas las fuerzas sobre el cuerpo (la neta), no el de una sola.',
    },
    ahoraTu: {
      generar(sm) {
        const r = azar(sm), m = r.de([1, 2, 4, 5]), v0 = r.de([0, 1, 2, 3, 4]), vv = v0 + r.de([1, 2, 3, 4]);
        const W = m * (vv * vv - v0 * v0) / 2;
        return {
          pregunta: `Un carrito de ${m} kg pasa de ${v0} m/s a ${vv} m/s. ¿Cuánto trabajo neto se hizo sobre él?`,
          opciones: opciones(W, [
            { id: 'sin-v0', valor: m * vv * vv / 2, error: 'TE-SIN-V0', siFuera: 'Esa es su energía final. Ya tenía energía al inicio: se resta.' },
            { id: 'resta-v', valor: m * (vv - v0) ** 2 / 2, error: 'TE-RESTA-V', siFuera: 'Eso resta rapideces antes de elevar. Se restan energías: v² − v₀².' },
            { id: 'sin-medio', valor: m * (vv * vv - v0 * v0), error: 'TE-SIN-MEDIO', siFuera: 'Falta el ½ de la energía cinética.' },
          ], n => `${f(n, 2)} J`),
          solucion: { texto: 'El trabajo neto es el cambio de energía cinética.', ecuacion: [`W = ½ · ${m} · (${vv}² − ${v0}²) = ${f(W, 2)} J`] },
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
  const potencial = {
    id: 'energia-potencial',
    titulo: 'Energía guardada en la posición',
    temas: ['Energía potencial gravitatoria y elástica'],
    pieza: 'ejes',
    juega: {
      consigna: 'Comprime un resorte de k = 200 N/m. La fuerza crece con x; el área sombreada es la energía guardada.',
      voz: 'Duplica la compresión. ¿Cuántas veces crece el área?',
      controles: [{ id: 'x', etiqueta: 'x', color: 'c-i', min: 0.05, max: 0.4, paso: 0.05, inicio: 0.1, unidad: 'm', decimales: 2 }],
      dibujo: val => ({ datos: resorteEjes(val.x), estado: {} }),
      lectura: val => [Ue, ` = ${f(K3 * val.x * val.x / 2, 2)} J · `, F, ` = ${f(K3 * val.x, 0)} N`],
      minimo: 3,
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
    mira: {
      pieza: 'fis-lienzo',
      datos: {
        vista: { x0: -2.2, x1: 2.2, y0: -0.6, y1: 2.6 }, escalaF: 3,
        alt: 'Libro de 2 kg sobre una mesa de 1 m: respecto al piso tiene 20 J; respecto a la mesa, 0 J; al caer al piso pierde 20 J con cualquier referencia.',
        poligonos: [{ puntos: [[-2.1, 0], [2.1, 0]], rayado: true }, { puntos: [[-1.2, 1], [0.6, 1]], grosor: 'variable' }, { puntos: [[-1, 1], [-1, 0]] }, { puntos: [[0.4, 1], [0.4, 0]] }, caja(-0.3, 1, 0.5, 0.25)],
        segmentos: [{ de: [1.2, 0], a: [1.2, 1.12], color: 'i', grosor: 'variable', texto: 'h = 1 m', paso: 1 }, { de: [-2.1, 1], a: [-1.25, 1], discontinua: true, paso: 2 }],
        textos: [{ en: [1.4, 1.75], texto: 'desde el piso: 20 J', color: 'd', paso: 1 }, { en: [-1.1, 2.05], texto: 'desde la mesa: 0 J', color: 'd', paso: 2 }, { en: [0, -0.45], texto: 'al caer al piso pierde 20 J', color: 'd', paso: 3 }],
      },
      pasos: [
        { estado: { paso: 1 }, texto: 'Libro de 2 kg sobre una mesa de 1 m, desde el piso.', ecuacion: [Ug, ' = m g ', h, ' = 2 · 10 · 1 = 20 J'] },
        { estado: { paso: 2 }, texto: 'Si la referencia es la mesa, su altura es 0.', ecuacion: [Ug, ' = 0 J'] },
        { estado: { paso: 3 }, texto: 'Importa el cambio: al caer al piso pierde 20 J con ambas referencias.', ecuacion: ['Δ', Ug, ' = −20 J'] },
      ],
    },
    regla: {
      texto: 'La energía potencial depende de la posición: la altura sobre una referencia o la deformación del resorte. Lo físico es su cambio.',
      ecuacion: [Ug, ' = m g ', h, '   ·   ', Ue, ' = ½ k ', { sup: [x, '2'] }],
      condicion: 'mgh vale cerca del suelo (g constante); x es la deformación desde el largo natural del resorte.',
    },
    ahoraTu: {
      generar(sm) {
        const r = azar(sm);
        if (sm % 2 === 0) {
          const k = r.de([100, 200, 400, 500, 800]), xv = r.de([0.1, 0.2, 0.3, 0.05]), E = k * xv * xv / 2;
          return {
            pregunta: ['Un resorte de k = ', `${k} N/m se comprime `, x, ` = ${f(xv, 2)} m. ¿Cuánta energía guarda?`],
            opciones: opciones(E, [
              { id: 'lineal', valor: k * xv / 2, error: 'EP-LINEAL', siFuera: 'x va al cuadrado: el área del triángulo tiene base x y altura kx.' },
              { id: 'sin-medio', valor: k * xv * xv, error: 'EP-SIN-MEDIO', siFuera: 'Falta el ½: el área es un triángulo.' },
              { id: 'fuerza', valor: k * xv, error: 'EP-LINEAL', siFuera: 'Ese es el valor de la fuerza, en N, no la energía.' },
            ], n => `${f(n, 3)} J`),
            solucion: { texto: 'Es el área bajo la recta F–x hasta x.', ecuacion: [Ue, ` = ½ · ${k} · ${f(xv, 2)}² = ${f(E, 3)} J`] },
          };
        }
        const m = r.de([2, 3, 5, 10]), h1 = r.de([2, 4, 5, 8]), h0 = r.de([1, 0.5]), E = m * G * (h1 - h0);
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
  function rampa(h0, roce, frac = 1, o = {}) {
    const m = 2, E = m * G * h0, perd = roce ? 0.25 * E * frac : 0, Uv = m * G * h0 * (1 - frac), Kv = E - Uv - perd, vv = Math.sqrt(2 * Kv / m);
    const curva = Array.from({ length: 21 }, (_, i) => { const t = i / 20; return [-2 + 2.4 * t, h0 * 0.36 * (1 - t) * (1 - t)]; });
    const pos = curva[Math.round(frac * 20)];
    const b = barras([{ etq: 'U', val: Uv, color: 'd' }, { etq: 'K', val: Kv, color: 'h' }, { etq: 'calor', val: perd }], 0.9, 0.3, 0.38, KJ4);
    return {
      vista: { x0: -2.2, x1: 2.4, y0: -0.6, y1: 2.6 },
      alt: o.alt || `Carrito de 2 kg que baja desde ${h0} m ${roce ? 'con rozamiento' : 'sin rozamiento'}: U = ${f(Uv, 0)} J, K = ${f(Kv, 0)} J${roce ? `, calor ${f(perd, 0)} J` : ''}; rapidez ${f(vv, 2)} m/s.`,
      poligonos: [{ puntos: curva, grosor: 'contorno', rayado: true }, { puntos: [[0.4, 0], [0.7, 0]], rayado: true }, ...b.pol],
      discos: [{ c: [pos[0], pos[1] + 0.12], r: 0.12 }],
      segmentos: frac === 0 ? [{ de: [-2.1, 0], a: [-2.1, h0 * 0.36], color: 'i', grosor: 'variable', texto: `${h0} m`, lado: 1 }] : [],
      textos: [...b.tex, ...(frac > 0 ? [{ en: [-0.9, 2.3], texto: `v = ${f(vv, 2)} m/s`, color: 'h' }] : [])],
    };
  }
  const conservacion = {
    id: 'conservacion-energia',
    titulo: 'La suma no cambia sin roce',
    temas: ['Conservación de la energía mecánica'],
    pieza: 'fis-lienzo',
    juega: {
      consigna: 'Un carrito de 2 kg baja por una rampa. Elige la altura de salida, si hay rozamiento y en qué parte de la bajada mirarlo.',
      voz: 'Sin roce, mira la suma de U y K en cada punto.',
      controles: [
        { id: 'h', etiqueta: 'h', color: 'c-i', min: 2, max: 5, paso: 1, inicio: 4, unidad: 'm', decimales: 0 },
        { id: 'roce', etiqueta: 'Rozamiento', opciones: [{ valor: 0, texto: 'Sin' }, { valor: 1, texto: 'Con' }], inicio: 0 },
        { id: 'frac', etiqueta: 'Avance', min: 0, max: 1, paso: 0.25, inicio: 0.5, unidad: '', decimales: 2 },
      ],
      dibujo: val => ({ datos: rampa(val.h, val.roce === 1, val.frac), estado: {} }),
      lectura: val => { const E = 20 * val.h, Uv = E * (1 - val.frac), perd = val.roce ? 0.25 * E * val.frac : 0; return [U, ' + ', K, ` = ${f(E - perd, 0)} J`]; },
      minimo: 4,
    },
    predice: {
      pregunta: 'Dos rampas sin roce tienen 5 m de alto: una es recta y la otra curva y más larga. ¿Cuál deja más rápido al carrito abajo?',
      opciones: [
        { id: 'c', texto: 'Las dos, igual de rápido', correcta: true },
        { id: 'larga', texto: 'La curva: tiene más camino para acelerar', error: 'W1', siFuera: 'Más camino, sí, pero el peso hace el mismo trabajo: depende solo de cuánto baja.' },
        { id: 'recta', texto: 'La recta: es más directa', error: 'CE-CAMINO', siFuera: 'Llega antes, quizá. Pero la rapidez abajo solo depende de la altura sin roce.' },
      ],
      dibujo: { datos: rampa(5, false, 0, { alt: 'Carrito de 2 kg arriba de una rampa curva de 5 m.' }), estado: {} },
      revelar: { datos: rampa(5, false, 1, { alt: 'Abajo de la rampa, sin roce, toda la energía potencial es cinética: 10 m/s por cualquier camino.' }), estado: {} },
      coincide: 'Coincide: los 100 J de altura se vuelven 100 J de K por cualquier camino: 10 m/s.',
    },
    mira: {
      datos: rampa(5, true, 1, { alt: 'Con rozamiento, de 100 J llegan abajo 75 J de energía cinética y 25 J se vuelven calor.' }),
      pasos: [
        { estado: {}, texto: 'Arriba, 5 m: toda la energía es potencial.', ecuacion: [Ug, ' = 2 · 10 · 5 = 100 J'] },
        { estado: {}, texto: 'Sin roce, abajo sería toda cinética.', ecuacion: ['½ · 2 · v² = 100   →   v = 10 m/s'] },
        { estado: {}, texto: 'Con roce, una parte se vuelve calor: la energía no desaparece.', ecuacion: [K, ' = 100 − 25 = 75 J'] },
        { estado: {}, texto: 'Llega más lento.', ecuacion: ['v = √75 ≈ 8,66 m/s'] },
      ],
    },
    regla: {
      texto: 'Sin rozamiento, la energía potencial que se pierde se gana como cinética: la suma no cambia. Con rozamiento, la diferencia se vuelve calor.',
      ecuacion: [K0, ' + ', { sub: [U, '0'] }, ' = ', K, ' + ', U, ' + calor   ·   v = √(2 g ', h, ')'],
      condicion: 'v = √(2gh) supone partir del reposo, sin roce ni aire y un cuerpo que desliza, sin rodar.',
    },
    ahoraTu: {
      generar(sm) {
        const r = azar(sm), h0 = r.de([1.25, 1.8, 3.2, 5, 7.2, 20, 45]), vv = Math.sqrt(2 * G * h0), m = r.de([1, 2, 5]);
        if (sm % 3 === 2) {
          const E = m * G * h0, perd = Math.round(E * r.de([0.2, 0.36, 0.5])), Kv = E - perd;
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
          solucion: { texto: 'mgh = ½mv²: la masa se simplifica.', ecuacion: [`v = √(2 · 10 · ${f(h0, 2)}) = ${f(vv, 2)} m/s`] },
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
    const W = 50 * G * 10, Pu = W / t, Ein = W / ef, Pin = Ein / t;
    const b = barras([{ etq: 'entra', val: Ein }, { etq: 'útil', val: W, color: 'd' }, { etq: 'calor', val: Ein - W }], -0.3, 0.3, 0.55, KJ5);
    return {
      vista: { x0: -2.2, x1: 2.2, y0: -0.6, y1: 2.9 },
      alt: o.alt || `Motor que sube 50 kg a 10 m en ${t} s con eficiencia ${f(ef * 100, 0)} %: potencia útil ${f(Pu, 0)} W, de entrada ${f(Pin, 0)} W.`,
      poligonos: [caja(-1.6, 0.3, 0.7, 0.5), ...b.pol],
      textos: [...b.tex, { en: [-1.6, 0.48], texto: 'motor' }, { en: [-1.4, 2.4], texto: `${f(Pu, 0)} W útiles`, color: 'd' }],
    };
  }
  const potencia = {
    id: 'potencia-y-eficiencia',
    titulo: 'Potencia: trabajo por segundo',
    temas: ['Potencia y eficiencia'],
    pieza: 'fis-lienzo',
    juega: {
      consigna: 'Un motor sube 50 kg a 10 m de altura. Elige cuánto tarda y qué fracción de lo que consume aprovecha.',
      voz: 'Cambia solo el tiempo. ¿Cambia la barra útil?',
      controles: [
        { id: 't', etiqueta: 't', min: 10, max: 40, paso: 10, inicio: 20, unidad: 's', decimales: 0 },
        { id: 'ef', etiqueta: 'Eficiencia', opciones: [{ valor: 1, texto: '100 %' }, { valor: 0.8, texto: '80 %' }, { valor: 0.5, texto: '50 %' }], inicio: 0.8 },
      ],
      dibujo: val => ({ datos: motor(val.t, val.ef), estado: {} }),
      lectura: val => [`P útil = ${f(5000 / val.t, 0)} W · consume ${f(5000 / val.ef / val.t, 0)} W`],
      minimo: 4,
    },
    predice: {
      pregunta: 'Ana sube una caja al segundo piso en 10 s; Beto sube la misma caja al mismo piso en 20 s. ¿Quién hace más trabajo sobre la caja?',
      opciones: [
        { id: 'c', texto: 'Los dos hacen el mismo trabajo', correcta: true },
        { id: 'ana', texto: 'Ana, porque lo hace más rápido', error: 'PO-TRABAJO', siFuera: 'Ana desarrolla más potencia. El trabajo es el mismo: misma caja, misma altura.' },
        { id: 'beto', texto: 'Beto, porque tarda más', error: 'W15', siFuera: 'Tardar más no suma trabajo: el peso sube la misma altura.' },
      ],
      dibujo: { datos: motor(20, 1, { alt: 'Subir 50 kg a 10 m siempre cuesta 5000 J de trabajo útil.' }), estado: {} },
      revelar: { datos: motor(10, 1, { alt: 'En la mitad del tiempo, el mismo trabajo de 5000 J: el doble de potencia.' }), estado: {} },
      coincide: 'Coincide: el trabajo es el mismo; Ana usa el doble de potencia.',
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
      ecuacion: ['P = ', { frac: ['W', 't'] }, ' = ', F, ' v   ·   η = ', { frac: [{ sub: ['P', 'útil'] }, { sub: ['P', 'entra'] }] }],
      condicion: 'P = Fv con F en la dirección de v. η nunca pasa de 1: ninguna máquina entrega más de lo que recibe.',
    },
    ahoraTu: {
      generar(sm) {
        const r = azar(sm), m = r.de([20, 40, 50, 80, 100]), hh = r.de([5, 10, 12, 15]), t = r.de([5, 10, 20, 25, 40]), ef = r.de([0.5, 0.75, 0.8, 1]);
        const W = m * G * hh, Pu = W / t, Pin = Pu / ef, pideEntrada = ef < 1 && sm % 2 === 1;
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

  return {
    unidad: 'fisica.trabajo-y-energia',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/ejes.js', '/nucleo/kit/piezas/fis-lienzo.js'],
    historia: {
      texto: 'Comparar máquinas obligó a preguntar cuánto efecto útil daban y adónde iba lo que parecía perderse. En la década de 1840, Joule agitó agua con paletas movidas por pesas que bajaban y midió cómo subía su temperatura: el trabajo mecánico se volvía calor. Así se armó la idea de una energía que cambia de forma.',
      pregunta: '¿Adónde se va la energía que «se pierde» por rozamiento?',
      fuente: { titulo: 'Science Museum Group — réplica del calorímetro de Joule', url: 'https://collection.sciencemuseumgroup.org.uk/objects/co8404682/replica-of-calorimeter-used-by-james-joule' },
    },
    ideas: [trabajo, teorema, potencial, conservacion, potencia],
  };
});
