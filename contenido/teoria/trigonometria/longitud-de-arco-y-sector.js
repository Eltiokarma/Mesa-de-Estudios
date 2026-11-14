/*
 * Teoría de «Longitud de arco y sector circular» (trigonometria.longitud-de-arco-y-sector), 3.º de secundaria.
 * Fuente del contenido: docs/teoria/matriz/trigonometria.json (unidad 2), docs/teoria/fuentes/historia-ecuaciones.pdf
 * (pp. 83–84) y las «Precisiones de Geometría y Trigonometría» del expediente. Forma: angulo-trigonometrico.js.
 * Compañera: Mara (coneja), cercana y rigurosa: el ángulo va en radianes antes de multiplicarlo por un largo.
 * Colores (regla 4): el ángulo θ en naranja (c-o; también su medida en vueltas n, que es el mismo giro en otra
 * escala), los largos que se recorren en turquesa (c-i: el arco s, los arcos L y l, el recorrido d del centro),
 * los radios en verde (c-d: r, R, el ancho h = R − r) y el área A en rojo (c-h).
 * Errores: TR4 (usa grados en s = θr o en A = θr²/2) es de docs/investigacion/trigonometria-ideas-erroneas.md.
 * Hipótesis de distractor (sin medir): ARCO-DIVIDE, ARCO-AREA, ARCO-DIAM, SEC-LINEAL, SEC-ARCO-CUADRADO,
 * SEC-ANGULO, SEC-ARCO, SEC-MITAD, TRAP-RESTA, TRAP-GRANDE, TRAP-MITAD, VUEL-CONTACTO, VUEL-TRASLADA, VUEL-DIAMETRO,
 * VUEL-RADIO, VUEL-SIN-PI, VUEL-DENTRO, VUEL-FUERA, POL-FAJA-EJE, POL-PROPORCIONAL, POL-SENTIDO, POL-IGUAL,
 * POL-INVERSA. POL-IGUAL es el error objetivo de la matriz («la misma velocidad angular a ruedas de radios distintos»).
 * Ronda 2 (14 nov, noche): manijas en las cinco ideas (fin del arco y punta del radio, borde del sector, los dos
 * radios de la banda, el centro de la rueda y el borde de la rueda B), llaves en las reglas, separador entre las
 * dos relaciones de la faja y laboratorio de tres mesas (sector completo, rueda que rodea a otra y faja con giro libre).
 * Juega y «Mira» usan la misma figura salvo en la rueda: ver su comentario (hallazgo 9 de docs/auditoria-teoria.md).
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: con θ en radianes, el radio entra una vez en el arco y dos veces en el área; una rueda gira lo que avanza su centro.
 *   Persona y condiciones: postulante de 3.º, celular de 360 px de gama baja, con o sin conexión, en el aula o en casa.
 *   Resultado observable: calcula arco, área de sector y de trapecio circular, vueltas de una rueda y giros con faja o eje común.
 *   Orden de atención: 1.º el radio verde · 2.º el arco turquesa · acción: mover ángulo o radio · fondo: la circunferencia.
 *   Estados: juego sin tocar · probando · predicción pendiente · coincide / no coincide · paso de «Mira» · caso nuevo.
 *   Duda que resuelve: ¿por qué 60° con radio 6 no da un arco de 360, y por qué una moneda que rodea a otra da dos vueltas?
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (x, d = 2) => Kit.formatear(x, d);
  const th = { v: 'c-o', t: 'θ' }, n = { v: 'c-o', t: 'n' }, s = { v: 'c-i', t: 's' }, d = { v: 'c-i', t: 'd' };
  const L = { v: 'c-i', t: 'L' }, l = { v: 'c-i', t: 'l' }, r = { v: 'c-d', t: 'r' }, R = { v: 'c-d', t: 'R' };
  const h = { v: 'c-d', t: 'h' }, A = { v: 'c-h', t: 'A' };
  const sub = (x, i) => ({ sub: [x, i] }), cuad = x => ({ sup: [x, '2'] });
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const piTxt = deg => piFrac(Math.round(deg), 180);
  function piFrac(p, q) {           // (p/q)·π, simplificado: 120, 180 → «2π/3»
    if (p === 0) return '0';
    const m = gcd(p, q), num = p / m, den = q / m;
    const sg = num < 0 ? '−' : '', a = Math.abs(num);
    return `${sg}${a === 1 ? '' : a}π${den === 1 ? '' : '/' + den}`;
  }
  const RAD = Math.PI / 180, GRA = 180 / Math.PI;
  // Gesto directo (docs/teoria.md §4b): las manijas usan la geometría de la pieza trig-plano.
  const TP = () => Kit.piezas['trig-plano'];
  const enPx = (dd, x, y) => TP().enPx(dd, x, y);
  const lejos = (dd, pt, cx = 0, cy = 0) => { const q = TP().delPx(dd, pt); return Math.hypot(q.x - cx, q.y - cy); };
  const polar = (dd, rv, g, cx = 0, cy = 0) => enPx(dd, cx + rv * Math.cos(g * RAD), cy + rv * Math.sin(g * RAD));
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
    for (const x of distractores) {
      if (typeof x.valor === 'number' && !Number.isFinite(x.valor)) continue;
      const txt = fmt(x.valor);
      if (vistos.has(txt)) continue;
      vistos.add(txt);
      ops.push({ id: x.id, texto: txt, error: x.error, siFuera: x.siFuera });
    }
    return ops.slice(0, 4);
  }

  // Un sector de ángulo g (grados) y radio rv: radio verde, arco turquesa, ángulo naranja, área roja (si se pide).
  const sector = (g, rv, o = {}) => ({
    ventana: o.ventana || { x: [-rv * 1.45, rv * 1.45], y: [-rv * 1.45, rv * 1.45] },
    ejes: false,
    circulos: [{ r: rv, discontinua: true }],
    sectores: o.area ? [{ de: 0, a: g, r: rv, color: 'h' }] : [],
    segmentos: [{ de: [0, 0], a: [rv, 0], color: 'd', rotulo: o.rr || `r = ${f(rv)}` }, { de: [0, 0], a: [rv * Math.cos(g * RAD), rv * Math.sin(g * RAD)], grosor: 'contorno' }],
    arcos: [
      { de: 0, a: g, r: rv, espiral: 0, flecha: false, color: 'i', rotulo: o.rs || `s = ${f(g * RAD * rv)}` },
      { de: 0, a: g, r: rv * 0.28, espiral: 0, flecha: false, color: 'o', rotulo: o.rt === undefined ? `${f(g)}°` : o.rt },
    ],
    rotulos: o.rotulos || [],
    alt: o.alt || `Sector de ${f(g)} grados y radio ${f(rv)}: arco de ${f(g * RAD * rv)}`,
  });

  // ---------- Idea 1: el arco cuenta radios ----------
  // Cambia: el ángulo θ y el radio r. · Permanece: el centro, el lado inicial y la escala del plano.
  // Progresa: el arco turquesa, que crece con los dos. · Se reserva: un ángulo dado en grados con un radio que el
  // juego no alcanza (la predicción). · Debe verse: que el arco se compara con la vuelta entera, 2π r.
  const arcoJ = v => sector(v.g, v.r, { ventana: { x: [-4.9, 4.9], y: [-4.9, 4.9] } });
  const arco = {
    id: 'arco',
    titulo: 'El arco cuenta radios',
    temas: ['Longitud de arco'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Elige el ángulo central θ y el radio r. La lectura pasa θ a radianes y da el largo del arco s.',
      voz: 'Primero el ángulo en radianes; después lo multiplicamos por el radio.',
      controles: [
        { id: 'g', etiqueta: 'θ', color: 'c-o', min: 30, max: 300, paso: 30, inicio: 90, unidad: '°', decimales: 0 },
        { id: 'r', etiqueta: 'r', color: 'c-d', min: 1, max: 4, paso: 0.5, inicio: 2, unidad: 'cm', decimales: 1 },
      ],
      dibujo: v => ({ datos: arcoJ(v), estado: {} }),
      lectura: v => [th, ` = ${f(v.g)}° = ${piTxt(v.g)} rad · `, s, ` = ${f(v.g * RAD * v.r)} cm`],
      minimo: 3,
      // Se arrastran el fin del arco (cambia θ) y la punta del radio verde (cambia r).
      arrastres: [
        { id: 'fin-arco', etiqueta: 'fin del arco: cambia θ', color: 'c-o',
          donde: v => polar(arcoJ(v), v.r, v.g),
          mover: (pt, v) => ({ g: TP().anguloDe(arcoJ(v), pt, { cerca: v.g }) }) },
        { id: 'radio', etiqueta: 'punta del radio r', color: 'c-d',
          donde: v => enPx(arcoJ(v), v.r, 0),
          mover: (pt, v) => ({ r: lejos(arcoJ(v), pt) }) },
      ],
    },
    predice: {
      pregunta: ['En un círculo de radio ', r, ' = 6 cm, el ángulo central mide ', th, ' = 60°. ¿Cuánto mide su arco?'],
      voz: 'Antes de multiplicar, revisa en qué unidad está el ángulo.',
      opciones: [
        { id: 'c', texto: `2π ≈ ${f(Math.PI / 3 * 6)} cm`, correcta: true },
        { id: 'grados', texto: `${f(60 * 6)} cm`, error: 'TR4', siFuera: 'Multiplicar ángulo por radio está bien, con θ en radianes: 60° son π/3.' },
        { id: 'divide', texto: `${f(60 / 6)} cm`, error: 'ARCO-DIVIDE', siFuera: 'Relacionar ángulo y radio está bien; pero un radio mayor da un arco mayor: se multiplica.' },
        { id: 'area', texto: `6π ≈ ${f(Math.PI / 3 * 36 / 2)} cm`, error: 'ARCO-AREA', siFuera: '6π es el área del sector, en cm². El arco lleva el radio una sola vez.' },
      ],
      dibujo: { datos: sector(60, 6, { rs: 's = ¿?' }), estado: {} },
      revelar: { datos: sector(60, 6, { rs: `s = 2π ≈ ${f(2 * Math.PI)}` }), estado: {} },
      coincide: 'Coincide: π/3 de radio, un poco más que un radio de largo.',
      noCoincide: 'Revisemos el arco dibujado: mide un poco más que el radio verde.',
    },
    mira: {
      datos: {
        ventana: { x: [-8.7, 8.7], y: [-8.7, 8.7] }, ejes: false,
        circulos: [{ r: 6, discontinua: true, desde: 3 }],
        segmentos: [{ de: [0, 0], a: [6, 0], color: 'd', rotulo: 'r = 6' }, { de: [0, 0], a: [3, 6 * Math.sin(60 * RAD)], grosor: 'contorno' }],
        arcos: [
          { de: 0, a: 60, r: 1.7, espiral: 0, flecha: false, color: 'o', rotulo: '60°' },
          { de: 0, a: 60, r: 6, espiral: 0, flecha: false, color: 'i', rotulo: 's = 2π', desde: 2 },
        ],
        rotulos: [{ x: 0, y: -7.6, texto: `vuelta entera: 12π ≈ ${f(12 * Math.PI, 1)} cm`, color: 'i', desde: 3 }],
        alt: 'Sector de 60 grados en un círculo de radio 6: arco de 2 pi centímetros, frente a la vuelta de 12 pi',
      },
      voz: 'El radio verde es la regla con que medimos el arco.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Primero el ángulo pasa a radianes.', ecuacion: [th, ' = 60° · ', { frac: ['π', '180°'] }, ' = ', { frac: ['π', '3'] }, ' rad'] },
        { estado: { corte: 2 }, texto: 'El arco mide π/3 radios de 6 cm.', ecuacion: [s, ' = ', th, ' · ', r, ' = ', { frac: ['π', '3'] }, ' · 6 = 2π cm'] },
        { estado: { corte: 3 }, texto: 'Con 60 en vez de π/3 saldría 360 cm: más que la vuelta.', ecuacion: ['2π · ', r, ` = 12π ≈ ${f(12 * Math.PI, 1)} cm < 360 cm`] },
      ],
    },
    regla: {
      texto: 'El arco mide tantos radios como radianes tiene su ángulo central. Por eso el radio aparece una sola vez.',
      ecuacion: [s, ' = ', { llave: [th], nota: 'en radianes', color: 'c-o' }, ' · ', { llave: [r], nota: 'la unidad', color: 'c-d' }],
      condicion: 'θ en radianes y no negativo; s y r en la misma unidad de longitud.',
      voz: 'Radianes por radio: un largo, en la unidad del radio.',
    },
    ahoraTu: {
      pieza: 'trig-plano',
      voz: 'Pasa el ángulo a radianes antes de usarlo.',
      generar(sem) {
        const rr = azar(sem), g = rr.uno([30, 45, 60, 90, 120, 135, 150, 180, 240, 270]), rv = rr.ent(2, 12);
        const sTxt = piFrac(g * rv, 180);
        const dib = { datos: sector(g, rv, { rs: `s = ${sTxt}`, rr: `r = ${rv}` }), estado: {} };
        if (sem % 2 === 0) {
          return {
            pregunta: ['Un sector tiene radio ', r, ` = ${rv} cm y ángulo central `, th, ` = ${g}°. ¿Cuánto mide su arco?`],
            opciones: opciones(sTxt, [
              { id: 'grados', valor: f(g * rv), error: 'TR4', siFuera: `Ángulo por radio está bien, con θ en radianes: ${g}° son ${piTxt(g)}.` },
              { id: 'area', valor: piFrac(g * rv * rv, 360), error: 'ARCO-AREA', siFuera: 'Eso es el área del sector: lleva el radio dos veces. El arco, una.' },
              { id: 'divide', valor: piFrac(g, 180 * rv), error: 'ARCO-DIVIDE', siFuera: 'Eso divide entre el radio. Con un radio mayor el arco crece: se multiplica.' },
            ], x => `${x} cm`),
            solucion: { texto: `${g}° son ${piTxt(g)} rad; el arco mide eso en radios.`, ecuacion: [s, ` = ${piTxt(g)} · ${rv} = ${sTxt} cm`], dibujo: dib },
          };
        }
        return {
          pregunta: ['Un arco mide ', s, ` = ${sTxt} cm y su ángulo central es `, th, ` = ${g}°. ¿Cuánto mide el radio?`],
          opciones: opciones(rv, [
            { id: 'diam', valor: 2 * rv, error: 'ARCO-DIAM', siFuera: 'Ese número es el diámetro: dos radios. El arco se mide en radios.' },
            { id: 'grados', valor: Math.round(g * rv / 180 * Math.PI / g * 100) / 100, error: 'TR4', siFuera: `Dividir s entre θ está bien, con θ en radianes: ${piTxt(g)}, no ${g}.` },
            { id: 'divide', valor: Math.round(g / 180 / (g * rv / 180) * 100) / 100, error: 'ARCO-DIVIDE', siFuera: 'Eso divide θ entre s. El radio es s entre θ.' },
          ], x => `${f(x)} cm`),
          solucion: { texto: 'Se despeja r = s/θ, con θ en radianes.', ecuacion: [r, ' = ', { frac: [sTxt, piTxt(g)] }, ` = ${rv} cm`], dibujo: dib },
        };
      },
    },
  };

  // ---------- Idea 2: el área lleva el radio dos veces ----------
  // Cambia: el ángulo θ, con el radio fijo en 2 cm. · Permanece: el radio y la escala.
  // Progresa: el sector rojo y su arco. · Se reserva: duplicar el radio (la predicción).
  // Debe verse: el sector como un triángulo de base s y altura r, por eso A = s·r/2.
  const SEC_R = 3;
  const tajadas = (g, rv, desde) => {
    const k = Math.max(3, Math.round(g / 10)), out = [];
    for (let i = 1; i < k; i++) out.push({ ang: g * i / k, largo: rv, grosor: 'cuadricula', punta: false, desde, hasta: desde });
    return out;
  };
  const secJ = v => sector(v.g, SEC_R, { area: true, ventana: { x: [-4.4, 4.4], y: [-4.4, 4.4] } });
  const area = {
    id: 'sector',
    titulo: 'El área lleva dos radios',
    temas: ['Área del sector y del trapecio circular'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Elige el ángulo θ del sector; el radio queda en 3 cm. La lectura da su arco s y su área A.',
      voz: 'Mira cómo crecen juntos el arco y el área cuando abres el ángulo.',
      controles: [{ id: 'g', etiqueta: 'θ', color: 'c-o', min: 30, max: 330, paso: 30, inicio: 90, unidad: '°', decimales: 0 }],
      dibujo: v => ({ datos: secJ(v), estado: {} }),
      lectura: v => [s, ` = ${f(v.g * RAD * SEC_R)} cm · `, A, ` = ${f(v.g * RAD * SEC_R * SEC_R / 2)} cm²`],
      minimo: 3,
      // Se arrastra el borde del sector: abre o cierra θ.
      arrastres: [{ id: 'borde', etiqueta: 'borde del sector θ', color: 'c-o',
        donde: v => polar(secJ(v), SEC_R, v.g),
        mover: (pt, v) => ({ g: TP().anguloDe(secJ(v), pt, { cerca: v.g }) }) }],
    },
    predice: {
      pregunta: 'El ángulo queda igual y el radio pasa de 2 cm a 4 cm. ¿Qué les pasa al arco y al área del sector?',
      voz: 'Piensa por separado en un largo y en una región.',
      opciones: [
        { id: 'c', texto: 'El arco se duplica y el área se cuadruplica', correcta: true },
        { id: 'lineal', texto: 'Los dos se duplican', error: 'SEC-LINEAL', siFuera: 'El arco sí se duplica. El área crece a lo largo y a lo ancho: cuatro veces.' },
        { id: 'cuadrado', texto: 'Los dos se cuadruplican', error: 'SEC-ARCO-CUADRADO', siFuera: 'El área sí se cuadruplica. El arco es un largo: crece como el radio, el doble.' },
        { id: 'angulo', texto: 'Ninguno cambia: el ángulo es el mismo', error: 'SEC-ANGULO', siFuera: 'El ángulo no cambia, es cierto. Arco y área dependen también del radio.' },
      ],
      dibujo: { datos: sector(90, 2, { area: true, ventana: { x: [-1.2, 5.2], y: [-1.2, 5.2] }, rs: 's', rr: 'r = 2', alt: 'Sector de 90 grados y radio 2' }), estado: {} },
      revelar: {
        datos: {
          ventana: { x: [-1.2, 5.2], y: [-1.2, 5.2] }, ejes: false,
          sectores: [{ de: 0, a: 90, r: 4, color: 'h' }, { de: 0, a: 90, r: 2, color: 'h' }],
          segmentos: [{ de: [0, 0], a: [4, 0], color: 'd', rotulo: 'r = 4' }, { de: [0, 0], a: [0, 4], grosor: 'contorno' }],
          arcos: [
            { de: 0, a: 90, r: 2, espiral: 0, flecha: false, color: 'i', rotulo: 's = π' },
            { de: 0, a: 90, r: 4, espiral: 0, flecha: false, color: 'i', rotulo: 's = 2π' },
          ],
          rotulos: [{ x: 0.75, y: 0.75, texto: 'π', color: 'h' }, { x: 2.3, y: 2.3, texto: 'A = 4π', color: 'h' }],
          alt: 'Dos sectores de 90 grados: radio 2 con arco pi y área pi; radio 4 con arco 2 pi y área 4 pi',
        },
        estado: {},
      },
      coincide: 'Coincide: doble de largo, y una región que crece en largo y en ancho.',
      noCoincide: 'Revisemos: el sector grande contiene cuatro veces al chico.',
    },
    mira: {
      datos: {
        ventana: { x: [-1.4, 4.6], y: [-1.2, 4.6] }, ejes: false,
        sectores: [{ de: 0, a: 60, r: 4, color: 'h', desde: 3 }],
        rayos: tajadas(60, 4, 1),
        segmentos: [{ de: [0, 0], a: [4, 0], color: 'd', rotulo: 'r' }, { de: [0, 0], a: [2, 4 * Math.sin(60 * RAD)], grosor: 'contorno' }],
        arcos: [{ de: 0, a: 60, r: 4, espiral: 0, flecha: false, color: 'i', rotulo: 's = θ · r', desde: 2 }],
        rotulos: [{ x: 1.7, y: 1.0, texto: 'A', color: 'h', desde: 3 }],
        alt: 'Sector partido en tajadas finas: cada una es casi un triángulo de altura r; las bases suman el arco s',
      },
      voz: 'Cada tajada es casi un triángulo; mira su altura.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Partido en tajadas finas, cada tajada es casi un triángulo de altura r.', ecuacion: ['tajada ≈ ', { frac: [['base · ', r], '2'] }] },
        { estado: { corte: 2 }, texto: 'Las bases de todas las tajadas suman el arco s.', ecuacion: [s, ' = ', th, ' · ', r] },
        { estado: { corte: 3 }, texto: 'El sector mide medio arco por radio; el radio entra dos veces.', ecuacion: [A, ' = ', { frac: [[s, ' · ', r], '2'] }, ' = ', { frac: [[th, ' · ', cuad(r)], '2'] }] },
        { estado: { corte: 3 }, texto: 'Doble radio: doble base y doble altura, cuatro veces el área.', ecuacion: [{ frac: [[th, ' · ', cuad({ par: ['2', r] })], '2'] }, ' = 4 · ', { frac: [[th, ' · ', cuad(r)], '2'] }] },
      ],
    },
    regla: {
      texto: 'El área del sector es medio arco por radio. Como el arco ya trae un radio, el área lleva el radio al cuadrado.',
      ecuacion: [A, ' = ', { frac: [[{ llave: [s], nota: 'base', color: 'c-i' }, ' · ', { llave: [r], nota: 'altura', color: 'c-d' }], '2'] }, ' = ', { frac: [[th, ' · ', { llave: [cuad(r)], nota: 'dos radios', color: 'c-d' }], '2'] }],
      condicion: 'θ en radianes, entre 0 y 2π; el área queda en unidades al cuadrado.',
      voz: 'Un radio para el largo y otro para el ancho.',
    },
    ahoraTu: {
      pieza: 'trig-plano',
      voz: 'Decide primero si te piden un largo o una región.',
      generar(sem) {
        const rr = azar(sem), g = rr.uno([30, 45, 60, 90, 120, 135, 150, 180, 240, 270]), rv = rr.ent(2, 10);
        const aTxt = piFrac(g * rv * rv, 360);
        const dib = { datos: sector(g, rv, { area: true, rs: `s = ${piFrac(g * rv, 180)}`, rr: `r = ${rv}` }), estado: {} };
        if (sem % 2 === 0) {
          return {
            pregunta: ['Un sector tiene radio ', r, ` = ${rv} cm y ángulo central `, th, ` = ${g}°. ¿Cuánto mide su área?`],
            opciones: opciones(aTxt, [
              { id: 'grados', valor: f(g * rv * rv / 2), error: 'TR4', siFuera: `La fórmula θr²/2 está bien, con θ en radianes: ${g}° son ${piTxt(g)}.` },
              { id: 'arco', valor: piFrac(g * rv, 180), error: 'SEC-ARCO', siFuera: 'Ese es el largo del arco. El área lleva el radio otra vez y la mitad.' },
              { id: 'mitad', valor: piFrac(g * rv * rv, 180), error: 'SEC-MITAD', siFuera: 'θ por r² va bien; falta la mitad: el sector es como un triángulo.' },
            ], x => `${x} cm²`),
            solucion: { texto: `${g}° son ${piTxt(g)} rad; el área es θ por r² entre 2.`, ecuacion: [A, ' = ', { frac: [`${piTxt(g)} · ${rv * rv}`, '2'] }, ` = ${aTxt} cm²`], dibujo: dib },
          };
        }
        const sv = rr.ent(2, 9) * 2;
        return {
          pregunta: ['El arco de un sector mide ', s, ` = ${sv} cm y su radio, `, r, ` = ${rv} cm. ¿Cuánto mide su área?`],
          opciones: opciones(sv * rv / 2, [
            { id: 'mitad', valor: sv * rv, error: 'SEC-MITAD', siFuera: 'Arco por radio va bien; falta la mitad: el sector es como un triángulo de base s.' },
            { id: 'cuadrado', valor: sv * rv * rv / 2, error: 'SEC-ARCO-CUADRADO', siFuera: 'El radio entra dos veces si usas θ. El arco ya trae uno: s·r/2.' },
            { id: 'lineal', valor: sv / 2, error: 'SEC-ARCO', siFuera: 'Medio arco es la mitad de un largo. Falta multiplicar por la altura r.' },
          ], x => `${f(x)} cm²`),
          solucion: { texto: 'El sector es medio arco por radio.', ecuacion: [A, ' = ', { frac: [`${sv} · ${rv}`, '2'] }, ` = ${f(sv * rv / 2)} cm²`] },
        };
      },
    },
  };

  // ---------- Idea 3: el trapecio circular ----------
  // Cambia: el radio interior r y el ancho h, con θ = 90°. · Permanece: el ángulo y el centro.
  // Progresa: la banda roja entre los dos arcos. · Se reserva: restar radios antes de elevar (la predicción).
  // Debe verse: que la banda es un sector grande menos uno chico, y también semisuma de arcos por ancho.
  const banda = (g, ri, Re, o = {}) => ({
    ventana: o.ventana || { x: [-0.8, 5.6], y: [-0.8, 5.6] }, ejes: false,
    sectores: [{ de: 0, a: g, r: Re, r0: ri, color: 'h' }].concat(o.chico ? [{ de: 0, a: g, r: ri, color: 'h', desde: o.chico, hasta: o.chico }] : []),
    segmentos: [
      { de: [0, 0], a: [ri, 0], color: 'd', rotulo: o.rr || `r = ${f(ri)}` },
      { de: [ri, 0], a: [Re, 0], color: 'd', rotulo: o.rh || `h = ${f(Re - ri)}` },
      { de: [0, 0], a: [Re * Math.cos(g * RAD), Re * Math.sin(g * RAD)], grosor: 'contorno' },
    ],
    arcos: [
      { de: 0, a: g, r: Re, espiral: 0, flecha: false, color: 'i', rotulo: o.rL || `L = ${f(g * RAD * Re)}`, desde: o.dL },
      { de: 0, a: g, r: ri, espiral: 0, flecha: false, color: 'i', rotulo: o.rl || `l = ${f(g * RAD * ri)}`, desde: o.dl },
      { de: 0, a: g, r: Math.min(ri * 0.4, 0.7), espiral: 0, flecha: false, color: 'o', rotulo: `${f(g)}°` },
    ],
    rotulos: o.rotulos || [],
    alt: o.alt || `Trapecio circular de ${f(g)} grados entre los radios ${f(ri)} y ${f(Re)}`,
  });
  const trapecio = {
    id: 'trapecio-circular',
    titulo: 'Sector grande menos sector chico',
    temas: ['Área del sector y del trapecio circular'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'La banda roja es un trapecio circular de 90°. Elige el radio interior r y el ancho h; la lectura da su área.',
      voz: 'Fíjate en los dos arcos turquesa: el de afuera es más largo.',
      controles: [
        { id: 'ri', etiqueta: 'r', color: 'c-d', min: 1, max: 3, paso: 0.5, inicio: 1.5, unidad: 'cm', decimales: 1 },
        { id: 'h', etiqueta: 'h', color: 'c-d', min: 0.5, max: 2, paso: 0.5, inicio: 1.5, unidad: 'cm', decimales: 1 },
      ],
      dibujo: v => ({ datos: banda(90, v.ri, v.ri + v.h), estado: {} }),
      lectura: v => [R, ` = ${f(v.ri + v.h)} cm · `, A, ` = ${f(Math.PI / 4 * ((v.ri + v.h) ** 2 - v.ri ** 2))} cm²`],
      minimo: 3,
      // Se arrastran el arco de adentro (cambia r; la banda se corre entera) y el borde de afuera (cambia el ancho h).
      arrastres: [
        { id: 'adentro', etiqueta: 'arco interior: cambia r', color: 'c-d',
          donde: v => enPx(banda(90, v.ri, v.ri + v.h), 0, v.ri),
          mover: (pt, v) => ({ ri: lejos(banda(90, v.ri, v.ri + v.h), pt) }) },
        { id: 'afuera', etiqueta: 'borde exterior: cambia h', color: 'c-d',
          donde: v => enPx(banda(90, v.ri, v.ri + v.h), v.ri + v.h, 0),
          mover: (pt, v) => ({ h: lejos(banda(90, v.ri, v.ri + v.h), pt) - v.ri }) },
      ],
    },
    predice: {
      pregunta: ['Un trapecio circular de 60° va desde ', r, ' = 2 cm hasta ', R, ' = 4 cm. ¿Cuánto mide su área?'],
      voz: 'Piensa qué figura completa contiene a la banda.',
      opciones: [
        { id: 'c', texto: `2π ≈ ${f(Math.PI / 3 * 12 / 2)} cm²`, correcta: true },
        { id: 'resta', texto: `2π/3 ≈ ${f(Math.PI / 3 * 4 / 2)} cm²`, error: 'TRAP-RESTA', siFuera: 'Usar el ancho de 2 cm es razonable; pero así sale un sector con vértice en el centro.' },
        { id: 'grande', texto: `8π/3 ≈ ${f(Math.PI / 3 * 16 / 2)} cm²`, error: 'TRAP-GRANDE', siFuera: 'Ese es el sector grande completo. Falta quitarle el sector chico del centro.' },
        { id: 'grados', texto: `${f(60 * 12 / 2)} cm²`, error: 'TR4', siFuera: 'Restar los cuadrados está bien, con θ en radianes: 60° son π/3.' },
      ],
      dibujo: { datos: banda(60, 2, 4, { rL: 'L', rl: 'l', rh: 'h = 2', ventana: { x: [-0.8, 5.2], y: [-0.8, 4.8] } }), estado: {} },
      revelar: { datos: banda(60, 2, 4, { rL: 'L = 4π/3', rl: 'l = 2π/3', rh: 'h = 2', ventana: { x: [-0.8, 5.2], y: [-0.8, 4.8] }, rotulos: [{ x: 2.4, y: 1.95, texto: 'A = 2π', color: 'h' }] }), estado: {} },
      coincide: 'Coincide: el sector de radio 4 menos el de radio 2.',
      noCoincide: 'Revisemos: la banda empieza en r = 2, no en el centro.',
    },
    mira: {
      datos: banda(60, 2, 4, { chico: 2, dl: 2, dL: 1, rL: 'L = 4π/3', rl: 'l = 2π/3', rh: 'h = 2', ventana: { x: [-0.8, 5.2], y: [-0.8, 4.8] } }),
      voz: 'Una figura que conoces, menos otra que también conoces.',
      pasos: [
        { estado: { corte: 1 }, texto: 'El sector grande, de radio R, contiene a la banda.', ecuacion: [{ frac: [[th, ' · ', cuad(R)], '2'] }, ' = ', { frac: [['π/3 · 16'], '2'] }, ' = ', { frac: ['8π', '3'] }] },
        { estado: { corte: 2 }, texto: 'Se le quita el sector chico, de radio r.', ecuacion: [{ frac: [[th, ' · ', cuad(r)], '2'] }, ' = ', { frac: ['π/3 · 4', '2'] }, ' = ', { frac: ['2π', '3'] }] },
        { estado: { corte: 3 }, texto: 'Queda la banda: se restan los cuadrados, no los radios.', ecuacion: [A, ' = ', { frac: [[th, ' (', cuad(R), ' − ', cuad(r), ')'], '2'] }, ' = 2π cm²'] },
        { estado: { corte: 3 }, texto: 'También es un trapecio: semisuma de los arcos por el ancho.', ecuacion: [{ frac: [[L, ' + ', l], '2'] }, ' · ', h, ' = ', { frac: ['4π/3 + 2π/3', '2'] }, ' · 2 = 2π'] },
      ],
    },
    regla: {
      texto: 'El trapecio circular es un sector grande menos uno chico. También se calcula como un trapecio: semisuma de los arcos por el ancho.',
      ecuacion: [A, ' = ', { frac: [[th, ' ', { llave: ['(', cuad(R), ' − ', cuad(r), ')'], nota: 'se restan', color: 'c-d' }], '2'] }, ' = ', { frac: [['(', L, ' + ', l, ') ', { llave: [h], nota: 'ancho', color: 'c-d' }], '2'] }],
      condicion: 'θ en radianes; los dos arcos tienen el mismo ángulo central y h = R − r.',
      voz: 'Restar cuadrados no es lo mismo que restar radios.',
    },
    ahoraTu: {
      pieza: 'trig-plano',
      voz: 'Ubica primero los dos radios: desde dónde y hasta dónde.',
      generar(sem) {
        const rr = azar(sem);
        if (sem % 2 === 0) {
          const g = rr.uno([30, 45, 60, 90, 120]), ri = rr.ent(1, 5), Re = ri + rr.ent(1, 4);
          const aTxt = piFrac(g * (Re * Re - ri * ri), 360);
          return {
            pregunta: ['Un trapecio circular de ', th, ` = ${g}° va desde `, r, ` = ${ri} cm hasta `, R, ` = ${Re} cm. ¿Cuánto mide su área?`],
            opciones: opciones(aTxt, [
              { id: 'resta', valor: piFrac(g * (Re - ri) ** 2, 360), error: 'TRAP-RESTA', siFuera: `Usar el ancho ${Re - ri} es razonable; pero así sale un sector con vértice en el centro.` },
              { id: 'grande', valor: piFrac(g * Re * Re, 360), error: 'TRAP-GRANDE', siFuera: 'Ese es el sector grande completo; falta quitarle el chico.' },
              { id: 'mitad', valor: piFrac(g * (Re * Re - ri * ri), 180), error: 'TRAP-MITAD', siFuera: 'Restar los cuadrados está bien; falta dividir entre 2.' },
            ], x => `${x} cm²`),
            solucion: { texto: 'Sector grande menos sector chico.', ecuacion: [A, ' = ', { frac: [`${piTxt(g)} (${Re * Re} − ${ri * ri})`, '2'] }, ` = ${aTxt} cm²`], dibujo: { datos: banda(g, ri, Re, { rL: 'L', rl: 'l', rr: `r = ${ri}`, rh: `h = ${Re - ri}`, ventana: { x: [Math.min(0, Re * Math.cos(g * RAD)) - 0.2 * Re, 1.3 * Re], y: [-0.25 * Re, (g >= 90 ? 1 : Math.sin(g * RAD)) * Re + 0.25 * Re] } }), estado: {} } },
          };
        }
        const lv = rr.ent(2, 8), Lv = lv + rr.ent(2, 8), hv = rr.ent(2, 6);
        return {
          pregunta: ['Los arcos de un trapecio circular miden ', L, ` = ${Lv} cm y `, l, ` = ${lv} cm, y su ancho es `, h, ` = ${hv} cm. ¿Cuánto mide su área?`],
          opciones: opciones((Lv + lv) / 2 * hv, [
            { id: 'mitad', valor: (Lv + lv) * hv, error: 'TRAP-MITAD', siFuera: 'Sumar los arcos y multiplicar por el ancho va bien; falta la mitad.' },
            { id: 'grande', valor: Lv * hv, error: 'TRAP-GRANDE', siFuera: 'Eso usa solo el arco de afuera, como si la banda fuera un rectángulo.' },
            { id: 'resta', valor: (Lv - lv) / 2 * hv, error: 'TRAP-RESTA', siFuera: 'Los arcos se suman, como las bases de un trapecio; no se restan.' },
          ], x => `${f(x)} cm²`),
          solucion: { texto: 'Como un trapecio: semisuma de los arcos por el ancho.', ecuacion: [A, ' = ', { frac: [`${Lv} + ${lv}`, '2'] }, ` · ${hv} = ${f((Lv + lv) / 2 * hv)} cm²`] },
        };
      },
    },
  };

  // ---------- Idea 4: la rueda gira lo que avanza su centro ----------
  // Cambia: el radio r de la rueda y el recorrido d de su centro sobre una recta. · Permanece: el suelo y la
  // posición de partida (círculo punteado). · Progresa: la marca naranja que gira y el arco que cuenta vueltas.
  // Se reserva: rodar alrededor de otra rueda (la predicción). · Debe verse: que cuenta el camino del centro.
  const rueda = (rv, dv) => {
    const giro = dv / rv * GRA;
    return {
      ventana: { x: [-1.7, 9.7], y: [-0.7, 3.5] }, ejes: false,
      circulos: [{ cx: 0, cy: rv, r: rv, discontinua: true }, { cx: dv, cy: rv, r: rv }],
      segmentos: [{ de: [-1.7, 0], a: [9.7, 0], grosor: 'contorno' }, { de: [0, 0], a: [dv, 0], color: 'i', rotulo: `d = ${f(dv)} m` }],
      rayos: [{ cx: dv, cy: rv, ang: 90 - giro, largo: rv, color: 'o', punta: false }],
      puntos: [{ x: dv + rv * Math.cos((90 - giro) * RAD), y: rv + rv * Math.sin((90 - giro) * RAD), color: 'o' }],
      arcos: [{ cx: dv, cy: rv, de: 90, a: 90 - giro, r: rv * 0.45, espiral: 3, color: 'o' }],
      alt: `Rueda de radio ${f(rv)} metros que avanza ${f(dv)} metros sin deslizar: ${f(dv / (2 * Math.PI * rv))} vueltas`,
    };
  };
  // Una moneda de radio 1 que rueda alrededor de otra igual: posiciones a 0°, 90°, 180° y 270°.
  const monedas = (corte = {}) => {
    const pos = [0, 90, 180, 270];
    return {
      ventana: { x: [-3.4, 3.4], y: [-3.4, 3.4] }, ejes: false,
      circulos: [{ r: 1 }, { r: 2, color: 'i', discontinua: true, desde: corte.camino }]
        .concat(pos.map((p, k) => ({ cx: 2 * Math.cos(p * RAD), cy: 2 * Math.sin(p * RAD), r: 1, discontinua: k > 0, desde: k ? corte.vueltas : 0 }))),
      rayos: pos.map((p, k) => ({ cx: 2 * Math.cos(p * RAD), cy: 2 * Math.sin(p * RAD), ang: 2 * p, largo: 1, color: 'o', desde: k ? corte.vueltas : 0 })),
      rotulos: [{ x: 0, y: 0, texto: 'fija' }].concat(corte.camino === undefined ? [] : [{ x: 3.35, y: -3.0, texto: 'centro: 2π · 2r', color: 'i', ancla: 'end', desde: corte.camino }]),
      alt: 'Moneda que rueda alrededor de otra igual: su marca apunta afuera, arriba, adentro y abajo; en media vuelta del recorrido ya dio una vuelta',
    };
  };
  const vueltas = {
    id: 'vueltas-rueda',
    titulo: 'La rueda gira lo que avanza',
    temas: ['Número de vueltas de una rueda'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'La rueda avanza sin deslizar. Elige su radio r y cuánto avanza su centro, d. La marca naranja cuenta las vueltas.',
      voz: 'Sigue la marca: cada vuelta completa vuelve a apuntar arriba.',
      controles: [
        { id: 'r', etiqueta: 'r', color: 'c-d', min: 0.5, max: 1.5, paso: 0.25, inicio: 1, unidad: 'm', decimales: 2 },
        { id: 'd', etiqueta: 'd', color: 'c-i', min: 0, max: 8, paso: 1, inicio: 3, unidad: 'm', decimales: 0 },
      ],
      dibujo: v => ({ datos: rueda(v.r, v.d), estado: {} }),
      lectura: v => [n, ' = ', d, ' ÷ 2π', r, ` = ${f(v.d / (2 * Math.PI * v.r))} vueltas`],
      minimo: 3,
      // Se arrastra el centro de la rueda: de lado cambia lo que avanza (d); hacia arriba, el radio (la rueda sigue
      // apoyada en el suelo, así que la altura del centro es r).
      arrastres: [{ id: 'centro', etiqueta: 'centro de la rueda: d de lado, r hacia arriba', color: 'c-i',
        donde: v => enPx(rueda(v.r, v.d), v.d, v.r),
        mover: (pt, v) => { const q = TP().delPx(rueda(v.r, v.d), pt); return { d: q.x, r: q.y }; } }],
    },
    predice: {
      pregunta: 'Una moneda rueda sin deslizar alrededor de otra igual, que está fija, hasta volver a su lugar. ¿Cuántas vueltas da sobre sí misma?',
      voz: 'Sigue el camino del centro, no solo el borde que se toca.',
      opciones: [
        { id: 'c', texto: '2 vueltas', correcta: true },
        { id: 'contacto', texto: '1 vuelta', error: 'VUEL-CONTACTO', siFuera: 'Contar el borde que toca vale en una recta. Aquí el centro recorre un círculo de radio 2r.' },
        { id: 'traslada', texto: '0: solo se traslada', error: 'VUEL-TRASLADA', siFuera: 'Sí se traslada alrededor; pero sin deslizar también gira: la marca cambia de dirección.' },
        { id: 'diametro', texto: '4 vueltas', error: 'VUEL-DIAMETRO', siFuera: 'Usar el camino del centro va bien: 2π · 2r. Se divide entre la vuelta, 2πr.' },
      ],
      dibujo: { datos: Object.assign(monedas({ vueltas: 9 }), { alt: 'Una moneda fija y otra igual a su lado, con una marca' }), estado: {} },
      revelar: { datos: monedas({ camino: 0, vueltas: 0 }), estado: {} },
      coincide: 'Coincide: en media vuelta del camino, la marca ya giró una vez.',
      noCoincide: 'Revisemos la marca naranja: a la mitad del camino ya dio una vuelta.',
    },
    // Hallazgo 9: «Juega» rueda por una recta y «Mira» rodea una moneda. Son dos representaciones a propósito: la
    // recta enseña la regla (paso 1, con su ecuación) y la moneda es el caso reservado de la predicción, que se resuelve
    // con la misma regla cambiando solo el camino del centro. La mesa «rodea» del laboratorio junta las dos.
    mira: {
      datos: monedas({ camino: 2, vueltas: 3 }),
      voz: 'La pregunta es cuánto camina el centro.',
      pasos: [
        { estado: { corte: 1 }, texto: 'En una recta, avanzar 2πr da una vuelta.', ecuacion: [n, ' = ', { frac: [d, ['2π', r]] }] },
        { estado: { corte: 2 }, texto: 'Alrededor de la moneda fija, el centro recorre un círculo de radio 2r.', ecuacion: [d, ' = 2π · 2', r] },
        { estado: { corte: 3 }, texto: 'La marca apunta afuera, arriba, adentro y abajo: ya dio una vuelta.', ecuacion: ['a la mitad del camino:  ', n, ' = 1'] },
        { estado: { corte: 3 }, texto: 'Al volver al inicio, la moneda dio dos vueltas.', ecuacion: [n, ' = ', { frac: [['2π · 2', r], ['2π', r]] }, ' = 2'] },
      ],
    },
    regla: {
      texto: 'Sin deslizar, la rueda da tantas vueltas como veces cabe su borde en el camino de su centro.',
      ecuacion: [n, ' = ', { frac: [{ llave: [d], nota: 'camino del centro', color: 'c-i' }, { llave: ['2π', r], nota: 'una vuelta', color: 'c-d' }] }],
      condicion: 'd es lo que recorre el centro. Por fuera de una rueda R, d = 2π(R + r); por dentro, 2π(R − r).',
      voz: 'Cuenta el camino del centro; el borde lo acompaña.',
    },
    ahoraTu: {
      voz: 'Primero dibuja el camino del centro.',
      generar(sem) {
        const rr = azar(sem), tipo = sem % 3;
        if (tipo === 0) {
          const rv = rr.ent(2, 15) * 5, nv = rr.ent(2, 12), dv = 2 * rv * nv;
          return {
            pregunta: ['Una rueda de radio ', r, ` = ${rv} cm avanza sin deslizar; su centro recorre `, d, ` = ${dv}π cm. ¿Cuántas vueltas da?`],
            opciones: opciones(nv, [
              { id: 'radio', valor: 2 * nv, error: 'VUEL-RADIO', siFuera: 'Dividir entre la vuelta está bien; una vuelta es 2πr, no πr.' },
              { id: 'diametro', valor: nv / 2, error: 'VUEL-DIAMETRO', siFuera: 'Una vuelta es 2πr: el diámetro ya está en el 2. No lleva otro 2.' },
              { id: 'pi', valor: Math.round(dv * Math.PI / rv * 100) / 100, error: 'VUEL-SIN-PI', siFuera: 'Eso divide el recorrido entre el radio: da radianes, no vueltas.' },
            ], x => `${f(x)} vueltas`),
            solucion: { texto: 'Cada vuelta avanza 2πr.', ecuacion: [n, ' = ', { frac: [`${dv}π`, `2π · ${rv}`] }, ` = ${nv}`] },
          };
        }
        const k = rr.ent(2, 6), rv = rr.ent(1, 4);
        if (tipo === 1) {
          return {
            pregunta: ['Una rueda de radio ', r, ` = ${rv} cm rueda sin deslizar por fuera de otra fija de radio `, R, ` = ${k * rv} cm, una vez alrededor. ¿Cuántas vueltas da?`],
            opciones: opciones(k + 1, [
              { id: 'contacto', valor: k, error: 'VUEL-CONTACTO', siFuera: `Contar el borde de contacto, ${k}, vale en una recta. Aquí el centro va por R + r.` },
              { id: 'dentro', valor: k - 1, error: 'VUEL-DENTRO', siFuera: 'R − r es el camino si rueda por dentro. Por fuera, el centro va por R + r.' },
              { id: 'doble', valor: 2 * (k + 1), error: 'VUEL-RADIO', siFuera: 'El camino del centro está bien; una vuelta mide 2πr, no πr.' },
            ], x => `${f(x)} vueltas`),
            solucion: { texto: 'El centro recorre un círculo de radio R + r.', ecuacion: [n, ' = ', { frac: [`2π(${k * rv} + ${rv})`, `2π · ${rv}`] }, ` = ${k + 1}`] },
          };
        }
        const k2 = k + 1;
        return {
          pregunta: ['Una rueda de radio ', r, ` = ${rv} cm rueda sin deslizar por dentro de un aro fijo de radio `, R, ` = ${k2 * rv} cm, una vez alrededor. ¿Cuántas vueltas da?`],
          opciones: opciones(k2 - 1, [
            { id: 'contacto', valor: k2, error: 'VUEL-CONTACTO', siFuera: `Contar el borde de contacto, ${k2}, vale en una recta. Por dentro, el centro va por R − r.` },
            { id: 'fuera', valor: k2 + 1, error: 'VUEL-FUERA', siFuera: 'R + r es el camino por fuera. Por dentro, el centro va más cerca: R − r.' },
            { id: 'doble', valor: 2 * (k2 - 1), error: 'VUEL-RADIO', siFuera: 'El camino del centro está bien; una vuelta mide 2πr, no πr.' },
          ], x => `${f(x)} vueltas`),
          solucion: { texto: 'Por dentro, el centro recorre un círculo de radio R − r.', ecuacion: [n, ' = ', { frac: [`2π(${k2 * rv} − ${rv})`, `2π · ${rv}`] }, ` = ${k2 - 1}`] },
        };
      },
    },
  };

  // ---------- Idea 5: faja, engranaje o eje común ----------
  // Cambia: la unión (faja o engranaje) y el radio de B; A gira siempre 120°. · Permanece: la rueda A y su giro.
  // Progresa: los arcos turquesa del borde, que miden lo mismo en las dos ruedas. · Se reserva: dos ruedas soldadas
  // en el mismo eje (la predicción). · Debe verse: mismo largo de borde (faja) frente a mismo ángulo (eje común).
  const RA = 1, GA = 120;
  const centroB = (ra, rB, union) => -1.6 + ra + rB + (union === 'faja' ? 0.9 : 0.14);
  const poleas = (rB, union, o = {}) => poleasG(RA, GA, rB, union, o);
  // A, de radio RA, gira GA grados y mueve a B (de radio rB) con faja o engranaje. El laboratorio cambia RA y GA.
  function poleasG(RA, GA, rB, union, o = {}) {
    const gap = union === 'faja' ? 0.9 : 0.14, D = RA + rB + gap, xa = -1.6, xb = xa + D;
    const gB = GA * RA / rB, sB = union === 'faja' ? 1 : -1;
    const datos = {
      ventana: o.ventana || { x: [-2.9, 4.7], y: [-3.0, 2.4] }, ejes: false,
      circulos: [{ cx: xa, cy: 0, r: RA }, { cx: xb, cy: 0, r: rB }],
      segmentos: [], rayos: [],
      arcos: [
        { cx: xa, cy: 0, de: 90, a: 90 + GA, r: RA, espiral: 0, color: 'i' },
        { cx: xb, cy: 0, de: 90, a: 90 + sB * gB, r: rB, espiral: 0, color: 'i' },
        { cx: xa, cy: 0, de: 90, a: 90 + GA, r: 0.45, espiral: 0, flecha: false, color: 'o' },
        { cx: xb, cy: 0, de: 90, a: 90 + sB * gB, r: Math.min(0.45, rB * 0.6), espiral: 0, flecha: false, color: 'o' },
      ],
      rotulos: [{ x: xa, y: -RA - 0.55, texto: `A: ${GA}°`, color: 'o' }, { x: xb, y: -rB - 0.55, texto: `B: ${f(gB)}°`, color: 'o' }],
      alt: `${union === 'faja' ? 'Faja' : 'Engranaje'} entre una rueda A de radio ${f(RA)} y una B de radio ${f(rB)}: A gira ${GA} grados y B gira ${f(gB)} grados${union === 'faja' ? ' en el mismo sentido' : ' en sentido contrario'}`,
    };
    for (const [cx, rv, g] of [[xa, RA, GA], [xb, rB, sB * gB]]) datos.rayos.push({ cx, cy: 0, ang: 90 + g, largo: rv, color: 'o', punta: false }, { cx, cy: 0, ang: 90, largo: rv, grosor: 'cuadricula', punta: false });
    if (union === 'faja') {
      const c = (RA - rB) / D, sn = Math.sqrt(1 - c * c);
      for (const sg of [1, -1]) datos.segmentos.push({ de: [xa + RA * c, sg * RA * sn], a: [xb + rB * c, sg * rB * sn], grosor: 'contorno' });
    } else {
      for (const [cx, rv, g] of [[xa, RA, GA], [xb, rB, sB * gB]]) {
        const z = Math.round(12 * rv);
        for (let k = 0; k < z; k++) {
          const t = (90 + g + 360 * k / z + 180 / z) * RAD;
          datos.segmentos.push({ de: [cx + rv * Math.cos(t), rv * Math.sin(t)], a: [cx + (rv + 0.13) * Math.cos(t), (rv + 0.13) * Math.sin(t)], grosor: 'contorno' });
        }
      }
    }
    return datos;
  }
  // Dos ruedas soldadas en el mismo eje: radios 1 y 3, las dos giran el mismo ángulo.
  const soldadas = (g, conArcos) => ({
    ventana: { x: [-3.6, 3.6], y: [-3.6, 3.6] }, ejes: false,
    circulos: [{ r: 1 }, { r: 3 }],
    rayos: [{ ang: 90, largo: 3, grosor: 'cuadricula', punta: false }].concat(g ? [{ ang: 90 + g, largo: 3, color: 'o', punta: false }] : []),
    arcos: g && conArcos ? [
      { de: 90, a: 90 + g, r: 0.5, espiral: 0, flecha: false, color: 'o' },
      { de: 90, a: 90 + g, r: 1, espiral: 0, color: 'i', rotulo: 's = π/2' },
      { de: 90, a: 90 + g, r: 3, espiral: 0, color: 'i', rotulo: 's = 3π/2' },
    ] : [],
    rotulos: g && conArcos ? [{ x: 0.45, y: -0.55, texto: `${g}°`, color: 'o' }] : [],
    alt: g ? `Dos ruedas soldadas de radios 1 y 3: las dos giran ${g} grados; el borde grande recorre tres veces más` : 'Dos ruedas soldadas en el mismo eje, de radios 1 y 3',
  });
  const poleasIdea = {
    id: 'faja-y-eje',
    titulo: 'Mismo borde o mismo ángulo',
    temas: ['Ruedas, poleas y engranajes'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'La rueda A gira 120°. Elige cómo mueve a B, con faja o engranaje, y el radio de B. Compara los arcos turquesa.',
      voz: 'Compara el largo de los dos arcos turquesa.',
      controles: [
        { id: 'u', etiqueta: 'Unión', opciones: [{ valor: 'faja', texto: 'Faja' }, { valor: 'engranaje', texto: 'Engranaje' }], inicio: 'faja' },
        { id: 'rb', etiqueta: 'r de B', color: 'c-d', min: 0.5, max: 2, paso: 0.5, inicio: 1, unidad: 'cm', decimales: 1 },
      ],
      dibujo: v => ({ datos: poleas(v.rb, v.u), estado: {} }),
      lectura: v => [sub(th, 'B'), ` = ${f(GA * RA / v.rb)}° · ${v.u === 'faja' ? 'mismo sentido' : 'sentido contrario'}`],
      minimo: 3,
      // Se arrastra lo alto de la rueda B: su altura sobre el eje es su radio. La unión (faja o engranaje) es una
      // opción discreta y queda con sus botones.
      arrastres: [{ id: 'borde-b', etiqueta: 'borde de la rueda B: cambia su radio', color: 'c-d',
        donde: v => enPx(poleas(v.rb, v.u), centroB(RA, v.rb, v.u), v.rb),
        mover: (pt, v) => ({ rb: TP().delPx(poleas(v.rb, v.u), pt).y }) }],
    },
    predice: {
      pregunta: 'Dos ruedas de radios 1 cm y 3 cm están soldadas en el mismo eje. Si la chica gira 90°, ¿cuánto gira la grande?',
      voz: 'Piensa qué comparten estas dos ruedas.',
      opciones: [
        { id: 'c', texto: '90°, en el mismo sentido', correcta: true },
        { id: 'faja', texto: '30°, en el mismo sentido', error: 'POL-FAJA-EJE', siFuera: 'Repartir el giro según los radios vale con faja o engranaje. Soldadas, giran juntas.' },
        { id: 'proporcional', texto: '270°, en el mismo sentido', error: 'POL-PROPORCIONAL', siFuera: 'El borde grande sí recorre tres veces más; el ángulo es el mismo: 90°.' },
        { id: 'sentido', texto: '90°, en sentido contrario', error: 'POL-SENTIDO', siFuera: 'El sentido se invierte entre engranajes que se tocan. En un mismo eje, giran hacia el mismo lado.' },
      ],
      dibujo: { datos: soldadas(0), estado: {} },
      revelar: { datos: soldadas(90, true), estado: {} },
      coincide: 'Coincide: un solo rayo gira para las dos; los bordes recorren largos distintos.',
      noCoincide: 'Revisemos: el mismo rayo naranja cruza las dos ruedas.',
    },
    mira: {
      datos: (() => {
        const p = poleas(2, 'faja');
        const xb = -1.6 + RA + 2 + 0.9;
        p.circulos.push({ cx: xb, cy: 0, r: 1, discontinua: true, desde: 3 });
        p.arcos[0].desde = 1; p.arcos[2].desde = 1;
        p.arcos[1].desde = 2; p.arcos[3].desde = 2;
        p.arcos[1].rotulo = 's'; p.arcos[0].rotulo = 's';
        p.arcos.push({ cx: xb, cy: 0, de: 90, a: 150, r: 1, espiral: 0, color: 'i', desde: 3 });
        p.rotulos.push({ x: xb, y: -0.6, texto: 'C: 60°', color: 'o', desde: 3 });
        p.alt = 'Rueda A de radio 1 que gira 120 grados y mueve con faja a B de radio 2, que gira 60; C, soldada a B, gira 60 también';
        return p;
      })(),
      voz: 'Primero el largo del borde; después, el ángulo.',
      pasos: [
        { estado: { corte: 1 }, texto: 'A gira 120°: su borde arrastra la faja un largo s.', ecuacion: [s, ' = ', sub(th, 'A'), ' · ', sub(r, 'A'), ' = ', { frac: ['2π', '3'] }, ' · 1'] },
        { estado: { corte: 2 }, texto: 'La faja mueve el borde de B el mismo largo: B gira la mitad.', ecuacion: [sub(th, 'A'), ' · ', sub(r, 'A'), ' = ', sub(th, 'B'), ' · ', sub(r, 'B'), '  ⇒  ', sub(th, 'B'), ' = 60°'] },
        { estado: { corte: 3 }, texto: 'C está soldada a B: gira el mismo ángulo, aunque su borde recorra menos.', ecuacion: [sub(th, 'C'), ' = ', sub(th, 'B'), ' = 60°'] },
        { estado: { corte: 3 }, texto: 'Con engranajes vale lo mismo contando dientes, y el sentido se invierte.', ecuacion: [sub(n, '1'), ' · ', sub('z', '1'), ' = ', sub(n, '2'), ' · ', sub('z', '2')] },
      ],
    },
    regla: {
      texto: 'Con faja o engranaje, los bordes recorren el mismo largo: la rueda chica gira más. En un mismo eje, las ruedas giran el mismo ángulo.',
      ecuacion: [{ llave: [sub(th, 'A'), ' · ', sub(r, 'A')], nota: 'largo del borde', color: 'c-i' }, ' = ', sub(th, 'B'), ' · ', sub(r, 'B'), '   ·   ', sub(th, 'B'), ' = ', { llave: [sub(th, 'C')], nota: 'mismo eje', color: 'c-o' }],
      condicion: 'sin deslizar. Vale igual para vueltas o para giros por segundo; los engranajes que se tocan giran en sentidos opuestos.',
      voz: 'Faja: mismo largo de borde. Eje común: mismo ángulo.',
    },
    ahoraTu: {
      voz: 'Pregunta qué comparten las dos ruedas: el borde o el eje.',
      generar(sem) {
        const rr = azar(sem), tipo = sem % 3;
        if (tipo === 0) {
          const ra = rr.ent(2, 6), k = rr.uno([2, 3, 4]), rb = ra * k, nb = rr.ent(2, 9), na = nb * k;
          return {
            pregunta: ['Una faja une una rueda de radio ', sub(r, 'A'), ` = ${ra} cm con otra de `, sub(r, 'B'), ` = ${rb} cm. Si A da ${na} vueltas, ¿cuántas da B?`],
            opciones: opciones(nb, [
              { id: 'igual', valor: na, error: 'POL-IGUAL', siFuera: 'Dar las mismas vueltas sería cierto en un mismo eje. Con faja se iguala el largo del borde.' },
              { id: 'inversa', valor: na * k, error: 'POL-INVERSA', siFuera: 'Usar la razón de radios está bien; la rueda grande gira menos, no más.' },
            ], x => `${f(x)} vueltas`),
            solucion: { texto: 'Los bordes recorren el mismo largo.', ecuacion: [`${na} · ${ra} = `, sub(n, 'B'), ` · ${rb}  ⇒  `, sub(n, 'B'), ` = ${nb}`] },
          };
        }
        if (tipo === 1) {
          const za = rr.uno([10, 12, 15, 20]), zb = za * rr.uno([2, 3]), nb = rr.ent(2, 8), na = nb * zb / za;
          return {
            pregunta: [`Un engranaje de ${za} dientes mueve a otro de ${zb} dientes. Si el chico da `, sub(n, 'A'), ` = ${na} vueltas, ¿cuántas da el grande?`],
            opciones: opciones(nb, [
              { id: 'igual', valor: na, error: 'POL-IGUAL', siFuera: 'Las mismas vueltas sería cierto en un mismo eje. Aquí pasan los mismos dientes.' },
              { id: 'inversa', valor: na * zb / za, error: 'POL-INVERSA', siFuera: 'Usar la razón de dientes está bien; el de más dientes gira menos.' },
            ], x => `${f(x)} vueltas`),
            solucion: { texto: 'Pasan los mismos dientes por el punto de contacto.', ecuacion: [`${na} · ${za} = `, sub(n, 'B'), ` · ${zb}  ⇒  `, sub(n, 'B'), ` = ${nb}`] },
          };
        }
        const ra = rr.ent(1, 4), rb = ra * 2, rc = rr.ent(1, 6), na = 2 * rr.ent(2, 6), nb = na / 2;
        return {
          pregunta: ['A, de radio ', sub(r, 'A'), ` = ${ra} cm, mueve con faja a B, de `, sub(r, 'B'), ` = ${rb} cm. C, de `, sub(r, 'C'), ` = ${rc} cm, está soldada a B. Si A da ${na} vueltas, ¿cuántas da C?`],
          opciones: opciones(nb, [
            { id: 'faja-eje', valor: nb * rb / rc, error: 'POL-FAJA-EJE', siFuera: 'Repartir por radios vale entre A y B. C comparte el eje con B: mismas vueltas.' },
            { id: 'igual', valor: na, error: 'POL-IGUAL', siFuera: 'Las mismas vueltas valen entre B y C, que comparten eje; entre A y B hay faja.' },
            { id: 'inversa', valor: na * 2, error: 'POL-INVERSA', siFuera: 'Usar la razón de radios está bien; B es más grande y gira menos.' },
          ], x => `${f(x)} vueltas`),
          solucion: { texto: `La faja da ${nb} vueltas a B, y C gira con B.`, ecuacion: [sub(n, 'B'), ` = ${na} · ${ra}/${rb} = ${nb}`, '   ·   ', sub(n, 'C'), ' = ', sub(n, 'B'), ` = ${nb}`] },
        };
      },
    },
  };

  // ---------- Laboratorio ----------
  const secL = v => sector(v.g, v.r, { area: true, ventana: { x: [-4.9, 4.9], y: [-4.9, 4.9] } });
  // Rueda de radio r que rueda por fuera (o por dentro) de una fija de radio R; su centro recorre p grados alrededor.
  // Sin deslizar, la marca gira p·(R + r)/r por fuera y −p·(R − r)/r por dentro (vista desde afuera).
  const caminoR = v => (v.lado === 'fuera' ? v.R + v.r : v.R - v.r);
  const vueltasRodea = v => v.p / 360 * caminoR(v) / v.r;
  function rodea(v) {
    const rc = caminoR(v), cx = rc * Math.cos(v.p * RAD), cy = rc * Math.sin(v.p * RAD);
    const marca = (v.lado === 'fuera' ? 1 : -1) * v.p * rc / v.r;
    return {
      ventana: { x: [-6.3, 6.3], y: [-6.3, 6.3] }, ejes: false,
      circulos: [{ r: v.R }, { r: rc, color: 'i', discontinua: true }, { cx: rc, cy: 0, r: v.r, discontinua: true }, { cx, cy, r: v.r }],
      arcos: v.p ? [{ de: 0, a: v.p, r: rc, espiral: 0, color: 'i' }] : [],
      rayos: [{ cx, cy, ang: marca, largo: v.r, color: 'o', punta: false }],
      puntos: [{ x: cx + v.r * Math.cos(marca * RAD), y: cy + v.r * Math.sin(marca * RAD), color: 'o' }],
      rotulos: [{ x: 0, y: 0, texto: 'fija' }],
      alt: `Rueda de radio ${f(v.r)} que rueda por ${v.lado} de una fija de radio ${f(v.R)}: su centro avanza ${f(v.p)} grados y ella da ${f(vueltasRodea(v))} vueltas`,
    };
  }
  // Ventana fija (no salta al arrastrar); los rótulos bajan bajo la rueda mayor para no quedar bajo la manija de A.
  const fajaL = v => {
    const dd = poleasG(v.ra, v.ga, v.rb, v.u, { ventana: { x: [-3.4, 3.4], y: [-2.75, 1.9] } });
    for (const t of dd.rotulos) t.y = -Math.max(v.ra, v.rb) - 0.85;
    return dd;
  };

  return {
    unidad: 'trigonometria.longitud-de-arco-y-sector',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/trig-plano.js'],
    historia: {
      texto: 'Arquímedes comparó el círculo con un triángulo: la altura es el radio y la base, la circunferencia estirada. Por eso un sector mide medio arco por radio. La fórmula con radianes es moderna, no la escribió él; pero conserva su idea: el radio entra una vez en el arco y dos veces en el área.',
      pregunta: '¿Por qué el radio aparecería una vez en el arco y dos en el área?',
      fuente: { titulo: 'Arquímedes, Medida del círculo, proposición 1; traducción y discusión del seminario de Harvard (2009)', url: 'https://people.math.harvard.edu/archive/archimedes09/pdf/Measurement.of.the.Circle.pdf' },
    },
    ideas: [arco, area, trapecio, vueltas, poleasIdea],
    // Laboratorio (docs/teoria.md §4b). «sector-completo»: θ hasta la vuelta entera y el radio libre, con arco y área a
    // la vez (los juegos los separan). «rodea»: la rueda que rueda por fuera o por dentro de otra, el caso que la idea 4
    // solo pregunta. «faja-libre»: los dos radios y el giro de A, con faja o engranaje (la idea fija A).
    laboratorio: [
      {
        id: 'sector-completo', titulo: 'Arco y área a la vez', pieza: 'trig-plano',
        consigna: 'Abre el sector hasta la vuelta entera y cambia su radio. Compara cómo crecen el arco y el área.',
        controles: [
          { id: 'g', etiqueta: 'θ', color: 'c-o', min: 10, max: 360, paso: 10, inicio: 120, unidad: '°', decimales: 0 },
          { id: 'r', etiqueta: 'r', color: 'c-d', min: 0.5, max: 4, paso: 0.5, inicio: 2, unidad: 'cm', decimales: 1 },
        ],
        dibujo: v => ({ datos: secL(v), estado: {} }),
        lectura: v => [th, ` = ${piTxt(v.g)} rad · `, s, ` = ${f(v.g * RAD * v.r)} cm · `, A, ` = ${f(v.g * RAD * v.r * v.r / 2)} cm²`],
        // El borde del sector cambia θ; el punto del círculo opuesto al borde cambia r (así nunca se tapan).
        arrastres: [
          { id: 'borde', etiqueta: 'borde del sector θ', color: 'c-o',
            donde: v => polar(secL(v), v.r, v.g),
            mover: (pt, v) => ({ g: TP().anguloDe(secL(v), pt, { cerca: v.g }) }) },
          { id: 'radio', etiqueta: 'borde del círculo: cambia r', color: 'c-d',
            donde: v => polar(secL(v), v.r, v.g + 180),
            mover: (pt, v) => ({ r: lejos(secL(v), pt) }) },
        ],
      },
      {
        id: 'rodea', titulo: 'Rodar alrededor de otra', pieza: 'trig-plano',
        consigna: 'Una rueda rueda sin deslizar por fuera o por dentro de otra fija. Lleva su centro alrededor y cuenta las vueltas de la marca.',
        controles: [
          { id: 'lado', etiqueta: 'Por', opciones: [{ valor: 'fuera', texto: 'Fuera' }, { valor: 'dentro', texto: 'Dentro' }], inicio: 'fuera' },
          { id: 'R', etiqueta: 'R fija', color: 'c-d', min: 1.5, max: 4, paso: 0.5, inicio: 2, unidad: 'cm', decimales: 1 },
          { id: 'r', etiqueta: 'r', color: 'c-d', min: 0.5, max: 1, paso: 0.25, inicio: 1, unidad: 'cm', decimales: 2 },
          { id: 'p', etiqueta: 'camino', color: 'c-i', min: 0, max: 720, paso: 15, inicio: 180, unidad: '°', decimales: 0 },
        ],
        dibujo: v => ({ datos: rodea(v), estado: {} }),
        lectura: v => [n, ` = ${f(vueltasRodea(v))} vueltas · `, R, ' = ', `${f(v.R / v.r)} `, r, ` · por ${v.lado} · ${f(v.p)}°`],
        // El centro de la rueda la lleva alrededor (camino); el punto de la rueda fija opuesto cambia R.
        arrastres: [
          { id: 'centro', etiqueta: 'centro de la rueda que rueda', color: 'c-i',
            donde: v => polar(rodea(v), caminoR(v), v.p),
            mover: (pt, v) => ({ p: TP().anguloDe(rodea(v), pt, { cerca: v.p }) }) },
          { id: 'fija', etiqueta: 'borde de la rueda fija: cambia R', color: 'c-d',
            donde: v => polar(rodea(v), v.R, v.p + 180),
            mover: (pt, v) => ({ R: lejos(rodea(v), pt) }) },
        ],
      },
      {
        id: 'faja-libre', titulo: 'Faja o engranaje, libre', pieza: 'trig-plano',
        consigna: 'Gira la rueda A desde la punta de su rayo y cambia los radios. La lectura da el giro de B y el borde recorrido.',
        controles: [
          { id: 'u', etiqueta: 'Unión', opciones: [{ valor: 'faja', texto: 'Faja' }, { valor: 'engranaje', texto: 'Engranaje' }], inicio: 'faja' },
          { id: 'ga', etiqueta: 'θ de A', color: 'c-o', min: 30, max: 360, paso: 30, inicio: 180, unidad: '°', decimales: 0 },
          { id: 'ra', etiqueta: 'r de A', color: 'c-d', min: 0.5, max: 1.5, paso: 0.25, inicio: 1, unidad: 'cm', decimales: 2 },
          { id: 'rb', etiqueta: 'r de B', color: 'c-d', min: 0.5, max: 1.5, paso: 0.25, inicio: 1.5, unidad: 'cm', decimales: 2 },
        ],
        dibujo: v => ({ datos: fajaL(v), estado: {} }),
        lectura: v => [sub(th, 'B'), ` = ${f(v.ga * v.ra / v.rb)}° · ${v.u === 'faja' ? 'mismo sentido' : 'sentido contrario'} · `, s, ` = ${f(v.ga * RAD * v.ra)} cm`],
        // La punta del rayo de A cambia su giro; lo alto de cada rueda cambia su radio.
        arrastres: [
          { id: 'giro-a', etiqueta: 'punta del rayo de A: cambia su giro', color: 'c-o',
            donde: v => polar(fajaL(v), v.ra, 90 + v.ga, -1.6, 0),
            mover: (pt, v) => ({ ga: TP().anguloDe(fajaL(v), pt, { cx: -1.6, cerca: 90 + v.ga }) - 90 }) },
          { id: 'borde-b', etiqueta: 'lo alto de B: cambia su radio', color: 'c-d',
            donde: v => enPx(fajaL(v), centroB(v.ra, v.rb, v.u), v.rb),
            mover: (pt, v) => ({ rb: TP().delPx(fajaL(v), pt).y }) },
        ],
      },
    ],
  };
});
