/*
 * Teoría de «Magnitudes y vectores» (fisica.magnitudes-y-vectores). Molde de docs/teoria.md, forma de
 * contenido/teoria/fisica/movimiento-rectilineo.js. Estado: completa (cinco ideas, los seis temas del catálogo).
 * Fuente del contenido: docs/teoria/matriz/fisica.json (unidad 1) y docs/teoria/fuentes/historia-ecuaciones.pdf.
 * Colores (regla 4), los mismos en control, figura, texto y ecuación:
 *   A naranja (c-o), B turquesa (c-i), la resultante R y el unitario û verde (c-d), el ángulo θ rojo (c-h).
 *   En la idea de dimensiones, la incógnita k va en rojo (c-h); allí no hay ángulo.
 * Códigos de error nuevos (hipótesis, sin dato empírico propio; matriz: «sumar módulos ignorando el ángulo»,
 * «confundir dimensiones con unidades», «aplicar el producto escalar donde se pide el vectorial»):
 *   V-SUMA suma módulos · V-RESTA resta módulos · V-PITAGORAS usa Pitágoras sin ángulo recto · V-COS signo del coseno
 *   U-SUMA divide entre la suma de componentes · U-CAMBIO cruza componentes · U-UNOS toma î + ĵ como unitario
 *   PE-MODULOS producto sin ángulo · PE-VECTOR confunde escalar con vectorial · PE-ORDEN orden del producto cruz
 *   DIM-UNIDAD toma la unidad por la dimensión · DIM-INVERSA invierte el despeje · DIM-TERMINO copia la del otro lado
 *   CONV-UNO un solo factor · CONV-INVERSO factor al revés · CONV-CUADRADO olvida elevar el factor
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: cinco relaciones para medir y operar con flechas, cada una jugada antes de preguntarla.
 *   Persona y condiciones: postulante de 3.º, celular de gama baja a 360 px, a veces sin conexión.
 *   Resultado observable: convierte unidades, comprueba una dimensión, halla una resultante, un unitario y un producto.
 *   Orden de atención: 1.º la figura · 2.º la lectura en vivo · acción: el botón fijo · fondo: Tilo.
 *   Estados: juego sin tocar · predicción pendiente · coincide / no coincide · paso de mira · caso nuevo · «No sé».
 *   Duda que resuelve: ¿por qué 3 + 4 no siempre es 7 cuando se suman flechas, y qué cambia al cambiar de unidad?
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const A = { v: 'c-o', t: 'A' }, B = { v: 'c-i', t: 'B' }, R = { v: 'c-d', t: 'R' }, th = { v: 'c-h', t: 'θ' };
  const k = { v: 'c-h', t: 'k' }, u = { v: 'c-d', t: 'û' };
  const vA = { vec: A }, vB = { vec: B };
  const rad = g => g * Math.PI / 180;
  const cosG = g => (g % 180 === 90 ? 0 : Math.cos(rad(g)));
  const senG = g => (g % 180 === 0 ? 0 : Math.sin(rad(g)));
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = xs => xs[Math.floor(r() * xs.length)];
    return r;
  }
  // La correcta primero; los distractores que repiten un texto o no son finitos se descartan.
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

  // ---------- Idea 1: cambiar de unidad cambia el número, no la magnitud ----------
  // Cambia: la unidad de la regla · Permanece: el largo dibujado del lápiz (2,5 m) ·
  // Progresa: el número que lo mide (2,5 → 25 → 250) · Se reserva: la conversión de km/h a m/s, en saltos de 20 m ·
  // Debe verse: el mismo segmento con otro número; convertir es multiplicar por un factor que vale 1.
  const UNIDADES = { m: { k: 1, max: 3, paso: 0.5, cada: 2 }, dm: { k: 10, max: 30, paso: 5, cada: 2 }, cm: { k: 100, max: 300, paso: 50, cada: 2 } };
  const LAPIZ = 2.5;
  const reglaEn = un => {
    const U = UNIDADES[un], L = LAPIZ * U.k;
    return { datos: { min: 0, max: U.max, paso: U.paso, cada: U.cada, sufijo: ` ${un}`, decimales: 1, variable: un, color: 'o', filas: 1,
      elementos: [{ tipo: 'distancia', a: 0, b: L, color: 'o', rotulo: `L = ${f(L, 1)} ${un}` }] }, estado: {} };
  };
  // Lo que avanza en cada segundo a 72 km/h: saltos de 20 m (se calcula: 72 · 1000 / 3600).
  const V_KMH = 72, V_MS = V_KMH * 1000 / 3600;
  const saltos = (n, conRotulo) => Array.from({ length: n }, (_, i) => ({ tipo: 'salto', a: i * V_MS, b: (i + 1) * V_MS, color: 'o', rotulo: conRotulo && i === 0 ? '1 s' : undefined, desde: i + 2 }));
  const rectaV = (n, conRotulo, desde = false) => ({ min: 0, max: 100, paso: 10, cada: 2, sufijo: ' m', decimales: 0, variable: 'x (m)', color: 'i', filas: 1,
    elementos: saltos(n, conRotulo).map(e => (desde ? e : Object.assign({}, e, { desde: 0 }))) });
  const unidades = {
    id: 'unidades',
    titulo: 'Otra unidad, otro número',
    temas: ['Magnitudes fundamentales y derivadas', 'Sistema Internacional'],
    pieza: 'recta',
    juega: {
      consigna: 'El lápiz mide siempre lo mismo. Cambia la unidad de la regla y mira qué número aparece.',
      voz: '¿Qué cambia: el lápiz o el número que lo mide?',
      controles: [{ id: 'un', etiqueta: 'Unidad', opciones: [{ valor: 'm', texto: 'metro' }, { valor: 'dm', texto: 'decímetro' }, { valor: 'cm', texto: 'centímetro' }] }],
      dibujo: val => reglaEn(val.un),
      lectura: val => [`El mismo largo: ${f(LAPIZ * UNIDADES[val.un].k, 1)} ${val.un}`],
      minimo: 3,
    },
    predice: {
      pregunta: `Una combi va a ${f(V_KMH, 0)} km/h. ¿Cuántos metros avanza en cada segundo?`,
      opciones: [
        { id: 'c', texto: `${f(V_MS, 0)} m`, correcta: true },
        { id: 'solo-km', texto: `${f(V_KMH * 1000, 0)} m`, error: 'CONV-UNO', siFuera: 'Eso pasa bien los km a metros, pero son los metros de una hora entera.' },
        { id: 'por', texto: `${f(V_KMH * 3.6, 1)} m`, error: 'CONV-INVERSO', siFuera: 'El 3,6 es el factor correcto, pero aquí se divide: un segundo es poco tiempo.' },
        { id: 'minuto', texto: `${f(V_KMH * 1000 / 60, 0)} m`, error: 'CONV-UNO', siFuera: 'Esos son los metros de un minuto. Una hora tiene 3600 segundos.' },
      ],
      dibujo: { datos: rectaV(0, false), estado: {} },
      revelar: { datos: rectaV(5, true), estado: {} },
      coincide: `Coincide: 72 000 m repartidos en 3600 s dan ${f(V_MS, 0)} m cada segundo.`,
    },
    mira: {
      datos: rectaV(5, true, true),
      pasos: [
        { estado: { corte: 1 }, texto: 'En una hora avanza 72 km, que son 72 000 m.', ecuacion: ['72 km · ', { frac: ['1000 m', '1 km'] }, ' = 72 000 m'] },
        { estado: { corte: 1 }, texto: 'Una hora son 3600 segundos.', ecuacion: ['1 h · ', { frac: ['3600 s', '1 h'] }, ' = 3600 s'] },
        { estado: { corte: 2 }, texto: 'Se reparten los metros en los segundos: 20 m en cada uno.', ecuacion: [{ frac: ['72 000 m', '3600 s'] }, ' = 20 m/s'] },
        { estado: { corte: 6 }, texto: 'Cinco segundos, cinco saltos iguales: la rapidez no cambió, solo su número.', ecuacion: ['72 km/h = 20 m/s'] },
      ],
    },
    regla: {
      texto: 'Una magnitud no cambia al cambiar de unidad: cambia el número. Se multiplica por factores que valen 1. Las del SI derivadas salen de las siete fundamentales.',
      ecuacion: ['72 ', { frac: ['km', 'h'] }, ' · ', { frac: ['1000 m', '1 km'] }, ' · ', { frac: ['1 h', '3600 s'] }, ' = 20 ', { frac: ['m', 's'] }],
      condicion: 'cada factor tiene arriba y abajo lo mismo medido en dos unidades; si la unidad está al cuadrado, el factor también.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), tipo = s % 4;
        if (tipo === 0) {
          const n = r.ent(2, 8) * 18, ms = n * 1000 / 3600;
          return {
            pregunta: `Un bus va a ${f(n, 0)} km/h. ¿Cuánto es eso en m/s?`,
            opciones: opciones(ms, [
              { id: 'por', valor: n * 3.6, error: 'CONV-INVERSO', siFuera: 'Ese factor va al revés: un segundo es mucho menos que una hora.' },
              { id: 'km', valor: n * 1000, error: 'CONV-UNO', siFuera: 'Pasaste los km a metros; falta pasar la hora a segundos.' },
              { id: 'min', valor: n * 1000 / 60, error: 'CONV-UNO', siFuera: 'Eso divide entre 60: son metros por minuto.' },
            ], x => `${f(x, 2)} m/s`),
            solucion: { texto: 'Los km a metros y la hora a segundos.', ecuacion: [`${f(n, 0)} · `, { frac: ['1000', '3600'] }, ` = ${f(ms, 2)} m/s`] },
          };
        }
        if (tipo === 1) {
          const n = r.ent(2, 9) * 50;
          return {
            pregunta: `Un terreno de ${f(n, 0)} cm² dibujado en un plano, ¿cuántos m² mide?`,
            opciones: opciones(n / 10000, [
              { id: 'lineal', valor: n / 100, error: 'CONV-CUADRADO', siFuera: '100 cm son 1 m; pero en un área ese factor va al cuadrado.' },
              { id: 'inverso', valor: n * 10000, error: 'CONV-INVERSO', siFuera: 'El factor 10 000 es correcto, pero un m² es más grande: el número baja.' },
              { id: 'mil', valor: n / 1000, error: 'CONV-CUADRADO', siFuera: 'Ese factor de 1000 es para el volumen en litros, no para áreas.' },
            ], x => `${f(x, 4)} m²`),
            solucion: { texto: '1 m² es un cuadrado de 100 cm por 100 cm.', ecuacion: [`${f(n, 0)} cm² · `, { frac: ['1 m²', '10 000 cm²'] }, ` = ${f(n / 10000, 4)} m²`] },
          };
        }
        if (tipo === 2) {
          const n = r.de([0.8, 1.2, 2.7, 7.8, 13.6]);
          return {
            pregunta: `Un material tiene densidad ${f(n, 1)} g/cm³. ¿Cuánto es en kg/m³?`,
            opciones: opciones(n * 1000, [
              { id: 'g', valor: n / 1000, error: 'CONV-INVERSO', siFuera: 'Pasar los g a kg baja el número, pero el m³ lo sube un millón.' },
              { id: 'solo-kg', valor: n / 1000 * 100, error: 'CONV-CUADRADO', siFuera: 'Ese factor 100 sirve para cm a m, no para cm³ a m³.' },
              { id: 'millon', valor: n * 1e6, error: 'CONV-UNO', siFuera: 'El millón de cm³ en un m³ es correcto; falta pasar los gramos a kg.' },
            ], x => `${f(x, 3)} kg/m³`),
            solucion: { texto: 'Gramos a kg divide entre 1000; cm³ a m³ multiplica por un millón.', ecuacion: [`${f(n, 1)} · `, { frac: ['1 000 000', '1000'] }, ` = ${f(n * 1000, 0)} kg/m³`] },
          };
        }
        const mn = r.ent(2, 12) * 5, sg = mn * 60;
        return {
          pregunta: `Una clase dura ${f(mn, 0)} minutos. ¿Cuántos segundos son, la unidad del SI para el tiempo?`,
          opciones: opciones(sg, [
            { id: 'div', valor: mn / 60, error: 'CONV-INVERSO', siFuera: 'Dividir da horas: el segundo es más chico, el número sube.' },
            { id: 'cien', valor: mn * 100, error: 'CONV-UNO', siFuera: 'Un minuto tiene 60 segundos, no 100.' },
            { id: 'hora', valor: mn * 3600, error: 'CONV-UNO', siFuera: 'Ese 3600 es para horas, no para minutos.' },
          ], x => `${f(x, 2)} s`),
          solucion: { texto: 'Cada minuto son 60 segundos.', ecuacion: [`${f(mn, 0)} min · `, { frac: ['60 s', '1 min'] }, ` = ${f(sg, 0)} s`] },
        };
      },
    },
  };

  // ---------- Idea 2: cada término de una ecuación tiene la misma dimensión ----------
  // Cambia: los exponentes de M, L y T de una magnitud · Permanece: las tres filas de fichas ·
  // Progresa: las columnas de x = k t² que se van llenando · Se reserva: la incógnita k, que es «?» hasta el paso 3 ·
  // Debe verse: la columna de k sale de quitar a un lado las fichas que sobran del otro.
  const DIM = { L: [0, 1, 0], T: [0, 0, 1], M: [1, 0, 0], v: [0, 1, -1], a: [0, 1, -2], F: [1, 1, -2], E: [1, 2, -2], P: [1, 2, -3], p: [1, -1, -2], area: [0, 2, 0], f: [0, 0, -1] };
  const NOMBRES = [
    [[1, 0, 0], 'masa: es fundamental (kg)'], [[0, 1, 0], 'longitud: es fundamental (m)'], [[0, 0, 1], 'tiempo: es fundamental (s)'],
    [[0, 1, -1], 'velocidad, en m/s'], [[0, 1, -2], 'aceleración, en m/s²'], [[1, 1, -2], 'fuerza, en newton'],
    [[1, 2, -2], 'energía, en joule'], [[1, 2, -3], 'potencia, en watt'], [[1, -1, -2], 'presión, en pascal'],
    [[0, 2, 0], 'área, en m²'], [[0, 3, 0], 'volumen, en m³'], [[1, -3, 0], 'densidad, en kg/m³'],
    [[1, 1, -1], 'cantidad de movimiento'], [[0, 0, -1], 'frecuencia, en hertz'], [[0, 0, 0], 'número sin dimensión'],
  ];
  const SUPS = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const dimTxt = e => {
    const ps = ['M', 'L', 'T'].map((x, i) => (e[i] ? (e[i] === 1 ? x : x + String(e[i]).split('').map(c => SUPS[c]).join('')) : '')).filter(Boolean);
    return ps.length ? ps.join(' ') : '1';
  };
  const suma = (a, b, n = 1) => a.map((x, i) => x + n * b[i]);
  const dimEj = (oculta) => ({ datos: { columnas: [
    { nombre: 'x', exps: DIM.L },
    { nombre: 'k', color: 'h', exps: DIM.a, oculta, signo: '=' },
    { nombre: 't²', exps: [0, 0, 2], signo: '·' },
    { nombre: 'k·t²', exps: DIM.L, desde: 4 },
  ] }, estado: {} });
  const dimensiones = {
    id: 'homogeneidad',
    titulo: 'Las dimensiones deben cuadrar',
    temas: ['Análisis dimensional', 'Magnitudes fundamentales y derivadas'],
    pieza: 'fis-dimensiones',
    juega: {
      consigna: 'Arma una magnitud con fichas de masa (M), longitud (L) y tiempo (T). Las huecas dividen.',
      voz: 'Busca la fuerza: masa por aceleración.',
      controles: [
        { id: 'm', etiqueta: 'M', min: 0, max: 1, paso: 1, inicio: 0, decimales: 0 },
        { id: 'l', etiqueta: 'L', min: -3, max: 3, paso: 1, inicio: 1, decimales: 0 },
        { id: 't', etiqueta: 'T', min: -3, max: 1, paso: 1, inicio: -1, decimales: 0 },
      ],
      dibujo: val => ({ datos: { columnas: [{ nombre: dimTxt([val.m, val.l, val.t]), exps: [val.m, val.l, val.t] }] }, estado: {} }),
      lectura: val => {
        const e = [val.m, val.l, val.t], n = NOMBRES.find(([d]) => d.every((x, i) => x === e[i]));
        return [`${dimTxt(e)}: ${n ? n[1] : 'sin nombre en el SI'}`];
      },
      minimo: 3,
    },
    predice: {
      pregunta: ['En la ecuación x = ', k, ' · t², x es una distancia y t un tiempo. ¿Qué dimensión debe tener ', k, '?'],
      opciones: [
        { id: 'c', texto: 'L T⁻², como una aceleración', correcta: true },
        { id: 'igual', texto: 'L, igual que x', error: 'DIM-TERMINO', siFuera: 'L es lo que debe tener todo el producto k · t², no k sola.' },
        { id: 'inv', texto: 'L T², por el t²', error: 'DIM-INVERSA', siFuera: 'Sería cierto si x = k / t². Aquí k multiplica: debe quitar el T².' },
        { id: 'unidad', texto: 'm/s², sin dimensión', error: 'DIM-UNIDAD', siFuera: 'm/s² es la unidad de L T⁻², no su ausencia. Tiene dimensión.' },
      ],
      dibujo: dimEj(9),
      revelar: dimEj(0),
      coincide: 'Coincide: k debe quitar las dos fichas de T que pone t².',
    },
    mira: {
      datos: dimEj(3).datos,
      pasos: [
        { estado: { corte: 1, resalta: [0] }, texto: 'A la izquierda, x es una longitud: una ficha de L.', ecuacion: ['[x] = L'] },
        { estado: { corte: 2, resalta: [2] }, texto: 't² pone dos fichas de tiempo.', ecuacion: ['[t²] = T²'] },
        { estado: { corte: 3, resalta: [1] }, texto: 'k debe dar la L y quitar T²: dos fichas huecas.', ecuacion: ['[', k, '] = ', { frac: ['L', 'T²'] }, ' = L T⁻²'] },
        { estado: { corte: 4, resalta: [0, 3] }, texto: 'Producto completo: la misma fila que x. La ecuación es homogénea.', ecuacion: ['[', k, ' · t²] = L T⁻² · T² = L'] },
      ],
    },
    regla: {
      texto: 'En una ecuación física, cada término tiene la misma dimensión. Las derivadas se arman con las fundamentales: masa, longitud y tiempo, entre otras.',
      ecuacion: ['[F] = M L T⁻²   ·   [E] = M L² T⁻²   ·   [', k, ' · Q] = [', k, '] · [Q]'],
      condicion: 'solo se suman o igualan términos de la misma dimensión. Que cuadre no prueba que la ecuación sea correcta.',
    },
    ahoraTu: {
      pieza: 'fis-dimensiones',
      generar(s) {
        const r = azar(s);
        const Q = r.de([['F', 'una fuerza'], ['E', 'una energía'], ['P', 'una potencia'], ['p', 'una presión']]);
        const F = r.de([['v', 'una velocidad', 'v'], ['a', 'una aceleración', 'a'], ['area', 'un área', 'S'], ['L', 'una longitud', 'x'], ['T', 'un tiempo', 't']]);
        const n = (s % 2) + 1, kd = suma(DIM[Q[0]], DIM[F[0]], -n);
        const letra = Q[0] === 'p' ? 'p' : Q[0];
        const pot = n === 2 ? `${F[2]}²` : F[2];
        return {
          pregunta: ['En ', `${letra} = `, k, ` · ${pot}`, `, ${letra} es ${Q[1]} y ${F[2]} es ${F[1]}. ¿Qué dimensión tiene `, k, '?'],
          dibujo: { datos: { columnas: [
            { nombre: letra, exps: DIM[Q[0]] },
            { nombre: 'k', color: 'h', exps: kd, oculta: 9, signo: '=' },
            { nombre: pot, exps: DIM[F[0]].map(x => x * n), signo: '·' },
          ] }, estado: {} },
          opciones: opciones(dimTxt(kd), [
            { id: 'inv', valor: dimTxt(suma(DIM[Q[0]], DIM[F[0]], n)), error: 'DIM-INVERSA', siFuera: `Eso multiplica por ${pot}; para despejar k se divide.` },
            { id: 'igual', valor: dimTxt(DIM[Q[0]]), error: 'DIM-TERMINO', siFuera: `Esa es la dimensión de ${letra}; k es solo una parte del producto.` },
            { id: 'solo', valor: dimTxt(DIM[F[0]].map(x => -x * n)), error: 'DIM-INVERSA', siFuera: `Eso quita ${pot} pero olvida las fichas de ${letra}.` },
            { id: 'pot1', valor: dimTxt(suma(DIM[Q[0]], DIM[F[0]], -(3 - n))), error: 'DIM-EXPONENTE', siFuera: 'Revisa el exponente: cada potencia repite todas sus fichas.' },
          ], x => x),
          solucion: {
            texto: `Se quitan de ${letra} las fichas de ${pot}.`,
            ecuacion: ['[', k, `] = ${dimTxt(DIM[Q[0]])} / ${dimTxt(DIM[F[0]].map(x => x * n))} = ${dimTxt(kd)}`],
            dibujo: { datos: { columnas: [
              { nombre: letra, exps: DIM[Q[0]] },
              { nombre: 'k', color: 'h', exps: kd, signo: '=' },
              { nombre: pot, exps: DIM[F[0]].map(x => x * n), signo: '·' },
            ] }, estado: {} },
          },
        };
      },
    },
  };

  // ---------- Idea 3: la resultante depende del ángulo ----------
  // Cambia: el ángulo θ entre A y B · Permanece: los módulos (A = 6, B = 4) y el círculo donde puede caer la punta de B ·
  // Progresa: el largo de R, de A − B a A + B · Se reserva: el ángulo recto, donde vale Pitágoras ·
  // Debe verse: R va de la cola de A a la punta de B puesta a continuación.
  const colaPunta = (a, b, g, o = {}) => {
    const tip = [a + b * cosG(g), b * senG(g)], r = Math.hypot(...tip);
    // Media vuelta: dónde puede caer la punta de B con θ entre 0° y 180° (fija la escala mientras se juega).
    const circ = Array.from({ length: 19 }, (_, i) => [a + b * Math.cos(i * Math.PI / 18), b * Math.sin(i * Math.PI / 18)]);
    return {
      datos: {
        unidad: 'u',
        contorno: o.circulo === false ? undefined : circ,
        flechas: [
          { de: [0, 0], a: [a, 0], color: 'o', rotulo: 'A', valor: o.valores === false ? undefined : `${f(a, 0)}` },
          { de: [a, 0], a: tip, color: 'i', rotulo: 'B', valor: o.valores === false ? undefined : `${f(b, 0)}`, paso: o.pasoB || 0 },
        ],
        angulos: g > 0 && g < 180 ? [{ en: [a, 0], de: 0, a: g, texto: `${f(g, 0)}°`, color: 'h', paso: o.pasoB || 0 }] : [],
        guias: [{ de: [a, 0], a: [a + b + 0.5, 0], color: 'h', paso: o.pasoB || 0 }],
        resultante: { de: [0, 0], a: tip, color: 'd', rotulo: 'R', valor: o.sinR ? undefined : `${f(r, 2)}`, paso: o.pasoR === undefined ? 0 : o.pasoR },
      },
      estado: { paso: o.paso === undefined ? 9 : o.paso },
      r,
    };
  };
  const resultante = {
    id: 'resultante',
    titulo: 'La resultante depende del ángulo',
    temas: ['Suma de vectores por el método gráfico'],
    pieza: 'flechas',
    juega: {
      consigna: 'B empieza donde termina A. Cambia el ángulo y el largo de B. R va de la cola de A a la punta de B.',
      voz: 'Mira entre qué valores se mueve R.',
      controles: [
        { id: 'g', etiqueta: 'θ', color: 'c-h', min: 0, max: 180, paso: 30, inicio: 60, unidad: '°', decimales: 0 },
        { id: 'b', etiqueta: 'B', color: 'c-i', min: 2, max: 6, paso: 1, inicio: 4, decimales: 0 },
      ],
      dibujo: val => { const c = colaPunta(6, val.b, val.g, { valores: false }); return { datos: c.datos, estado: c.estado }; },
      lectura: val => [R, ` = ${f(colaPunta(6, val.b, val.g).r, 2)}  (A + B = ${f(6 + val.b, 0)})`],
      minimo: 4,
    },
    predice: {
      pregunta: ['Dos fuerzas de ', A, ' = 3 N y ', B, ' = 4 N forman un ángulo ', th, ' = 90°. ¿Cuánto mide la resultante?'],
      opciones: [
        { id: 'c', texto: '5 N', correcta: true },
        { id: 'suma', texto: '7 N', error: 'V-SUMA', siFuera: '3 + 4 = 7 sería cierto si apuntaran al mismo lado (θ = 0°).' },
        { id: 'resta', texto: '1 N', error: 'V-RESTA', siFuera: '4 − 3 = 1 sería cierto si apuntaran en sentidos opuestos (θ = 180°).' },
        { id: 'raiz', texto: '√7 N', error: 'V-PITAGORAS', siFuera: 'Pitágoras es la idea; pero se suman los cuadrados: 9 + 16.' },
      ],
      dibujo: (() => { const c = colaPunta(3, 4, 90, { circulo: false, sinR: true, pasoR: 9, paso: 0 }); return { datos: c.datos, estado: c.estado }; })(),
      revelar: (() => { const c = colaPunta(3, 4, 90, { circulo: false }); return { datos: c.datos, estado: c.estado }; })(),
      coincide: 'Coincide: A, B y R forman un triángulo rectángulo de lados 3, 4 y 5.',
    },
    mira: {
      datos: colaPunta(6, 4, 60, { circulo: false, pasoB: 1, pasoR: 2 }).datos,
      pasos: [
        { estado: { paso: 0 }, texto: 'Se dibuja A con su largo: 6 unidades.', ecuacion: [A, ' = 6'] },
        { estado: { paso: 1 }, texto: 'B empieza en la punta de A, sin cambiar largo ni dirección.', ecuacion: [B, ' = 4,   ', th, ' = 60°'] },
        { estado: { paso: 2 }, texto: 'R une la cola de A con la punta de B.', ecuacion: [{ sup: [R, '2'] }, ' = ', { sup: [A, '2'] }, ' + ', { sup: [B, '2'] }, ' + 2', A, B, ' cos ', th] },
        { estado: { paso: 2, final: true }, texto: 'Con cos 60° = 0,5: R² = 36 + 16 + 24.', ecuacion: [R, ` = √76 ≈ ${f(Math.sqrt(76), 2)}`] },
      ],
    },
    regla: {
      texto: 'Los vectores se suman poniéndolos uno a continuación del otro. El módulo de R depende del ángulo, y queda entre A − B y A + B.',
      ecuacion: [{ sup: [R, '2'] }, ' = ', { sup: [A, '2'] }, ' + ', { sup: [B, '2'] }, ' + 2', A, B, ' cos ', th],
      condicion: 'θ es el ángulo entre A y B puestos con el mismo origen; con θ = 90° queda Pitágoras.',
    },
    ahoraTu: {
      pieza: 'flechas',
      generar(s) {
        const r = azar(s);
        const [a, b, g] = r.de([[3, 4, 90], [6, 8, 90], [5, 5, 60], [5, 3, 120], [6, 6, 120], [4, 4, 0], [7, 3, 180], [8, 6, 60], [5, 12, 90]]);
        const c = colaPunta(a, b, g, { circulo: false, sinR: true, paso: 1, pasoR: 9 });
        const ops = opciones(c.r, [
          { id: 'suma', valor: a + b, error: 'V-SUMA', siFuera: 'Sumar módulos vale solo si apuntan al mismo lado.' },
          { id: 'resta', valor: Math.abs(a - b), error: 'V-RESTA', siFuera: 'Restar módulos vale solo si apuntan en sentidos opuestos.' },
          { id: 'pita', valor: Math.hypot(a, b), error: 'V-PITAGORAS', siFuera: 'Pitágoras vale solo con 90°; aquí falta el término del coseno.' },
          { id: 'cos', valor: Math.sqrt(Math.max(0, a * a + b * b - 2 * a * b * cosG(g))), error: 'V-COS', siFuera: 'Ese signo del coseno es el del lado de un triángulo, no el de la suma.' },
        ], x => `${f(x, 2)} u`);
        return {
          pregunta: ['Dos vectores de ', A, ` = ${f(a, 0)} u y `, B, ` = ${f(b, 0)} u forman `, th, ` = ${f(g, 0)}°. ¿Cuánto mide la resultante?`],
          dibujo: { datos: c.datos, estado: { paso: 1 } },
          opciones: ops,
          solucion: {
            texto: `cos ${f(g, 0)}° = ${f(cosG(g), 1)}; se reemplaza en la ley de la suma.`,
            ecuacion: [R, ` = √(${f(a * a, 0)} + ${f(b * b, 0)} + 2 · ${f(a, 0)} · ${f(b, 0)} · ${f(cosG(g), 1)}) = ${f(c.r, 2)} u`],
            dibujo: { datos: colaPunta(a, b, g, { circulo: false }).datos, estado: { paso: 9, final: true } },
          },
        };
      },
    },
  };

  // ---------- Idea 4: componentes y vector unitario ----------
  // Cambia: las componentes Aₓ y Aᵧ · Permanece: los ejes de −4 a 4 ·
  // Progresa: el largo de A (Pitágoras) · Se reserva: A = 0, que no tiene unitario ·
  // Debe verse: û apunta igual que A y mide 1; se obtiene dividiendo cada componente entre |A|.
  // Ejes de −4 a 4 dibujados como guías: fijan la escala mientras se juega y no tapan al unitario.
  const EJES = [{ de: [-4, 0], a: [4, 0] }, { de: [0, -4], a: [0, 4] }];
  const compA = (ax, ay, o = {}) => {
    const m = Math.hypot(ax, ay);
    const fl = [{ de: [0, 0], a: [ax, ay], color: 'o', rotulo: 'A', paso: 0 }];
    if (m > 0 && o.unitario) fl.push({ de: [0, 0], a: [ax / m, ay / m], color: 'd', rotulo: 'û', paso: o.pasoU || 0 });
    return { datos: { unidad: 'u', flechas: fl,
      guias: [...EJES, ...(m > 0 ? [{ de: [ax, 0], a: [ax, ay], color: 'o', paso: o.pasoG || 0 }, { de: [0, ay], a: [ax, ay], color: 'o', paso: o.pasoG || 0 }] : [])],
      segmentos: m > 0 && o.textos ? [{ de: [0, 0], a: [ax, 0], color: 'o', texto: `Aₓ = ${f(ax, 0)}`, paso: o.pasoG || 0 }, { de: [0, 0], a: [0, ay], color: 'o', texto: `Aᵧ = ${f(ay, 0)}`, paso: o.pasoG || 0 }].filter(sg => Math.hypot(sg.a[0], sg.a[1]) > 0) : [],
    }, estado: { paso: o.paso === undefined ? 9 : o.paso } };
  };
  const componentes = {
    id: 'componentes',
    titulo: 'Componentes y vector unitario',
    temas: ['Componentes y vector unitario'],
    pieza: 'flechas',
    juega: {
      consigna: 'Elige cuánto avanza A en x y cuánto en y. La flecha verde es su unitario: misma dirección, largo 1.',
      voz: 'Prueba también A = 0. ¿Hacia dónde apuntaría su unitario?',
      controles: [
        { id: 'ax', etiqueta: 'Aₓ', color: 'c-o', min: -4, max: 4, paso: 1, inicio: 3, decimales: 0 },
        { id: 'ay', etiqueta: 'Aᵧ', color: 'c-o', min: -4, max: 4, paso: 1, inicio: 2, decimales: 0 },
      ],
      dibujo: val => compA(val.ax, val.ay, { unitario: true, valor: true }),
      lectura: val => {
        const m = Math.hypot(val.ax, val.ay);
        return m ? ['|', A, `| = ${f(m, 2)} · `, u, ` = (${f(val.ax / m, 2)}; ${f(val.ay / m, 2)})`] : [A, ' = 0: no apunta a ningún lado; no tiene ', u];
      },
      minimo: 3,
    },
    predice: {
      pregunta: ['El vector ', vA, ' = 6î + 8ĵ. ¿Cuál es su vector unitario ', u, '?'],
      opciones: [
        { id: 'c', texto: '0,6î + 0,8ĵ', correcta: true },
        { id: 'suma', texto: '(6î + 8ĵ)/14', error: 'U-SUMA', siFuera: 'Dividir está bien; pero entre el largo de A, que es 10, no entre 6 + 8.' },
        { id: 'unos', texto: 'î + ĵ', error: 'U-UNOS', siFuera: 'î + ĵ mide √2, no 1, y apunta a 45°: otra dirección.' },
        { id: 'cruce', texto: '0,8î + 0,6ĵ', error: 'U-CAMBIO', siFuera: 'Mide 1, pero apunta a otro lado: cada número va con su eje.' },
      ],
      dibujo: compA(6 / 2, 8 / 2, { paso: 0 }),
      revelar: compA(6 / 2, 8 / 2, { unitario: true }),
      coincide: 'Coincide: |A| = 10, y cada componente se divide entre 10.',
    },
    mira: {
      datos: compA(3, 4, { unitario: true, pasoG: 1, pasoU: 3, textos: true }).datos,
      pasos: [
        { estado: { paso: 0 }, texto: 'A va del origen al punto (3; 4).', ecuacion: [vA, ' = 3î + 4ĵ'] },
        { estado: { paso: 1 }, texto: 'Sus componentes son lo que avanza en cada eje.', ecuacion: [{ sub: [A, 'x'] }, ' = 3,   ', { sub: [A, 'y'] }, ' = 4'] },
        { estado: { paso: 2 }, texto: 'Su módulo sale de Pitágoras con las componentes.', ecuacion: ['|', A, '| = ', { raiz: ['3² + 4²'] }, ' = 5'] },
        { estado: { paso: 3 }, texto: 'El unitario divide cada componente entre 5: mide 1.', ecuacion: [u, ' = ', { frac: [vA, ['|', A, '|']] }, ' = 0,6î + 0,8ĵ'] },
      ],
    },
    regla: {
      texto: 'Un vector se escribe con sus componentes sobre î y ĵ. Su módulo sale de Pitágoras, y el unitario es el vector dividido entre su módulo.',
      ecuacion: [vA, ' = ', { sub: [A, 'x'] }, 'î + ', { sub: [A, 'y'] }, 'ĵ   ·   |', A, '| = ', { raiz: [[{ sup: [{ sub: [A, 'x'] }, '2'] }, ' + ', { sup: [{ sub: [A, 'y'] }, '2'] }]] }, '   ·   ', u, ' = ', { frac: [vA, ['|', A, '|']] }],
      condicion: 'los ejes x e y son perpendiculares; el vector nulo no tiene unitario.',
    },
    ahoraTu: {
      pieza: 'flechas',
      generar(s) {
        const r = azar(s);
        const [p, q, m] = r.de([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [4, 3, 5], [12, 5, 13], [8, 6, 10]]);
        const sx = r.de([1, -1]), sy = r.de([1, -1]), ax = sx * p, ay = sy * q;
        const esc = Math.max(p, q) / 4;
        const dib = compA(ax / esc, ay / esc, { paso: 0 });
        if (s % 2 === 0) return {
          pregunta: ['¿Cuánto mide el vector ', vA, ` = ${f(ax, 0)}î ${ay < 0 ? '−' : '+'} ${f(Math.abs(ay), 0)}ĵ?`],
          dibujo: dib,
          opciones: opciones(m, [
            { id: 'suma', valor: Math.abs(ax) + Math.abs(ay), error: 'V-SUMA', siFuera: 'Sumar componentes es caminar por los ejes; la flecha va en diagonal.' },
            { id: 'signo', valor: Math.abs(ax + ay), error: 'V-RESTA', siFuera: 'Los signos dan la dirección; el módulo usa los cuadrados.' },
            { id: 'cuadrado', valor: m * m, error: 'V-RAIZ', siFuera: 'Eso es el módulo al cuadrado: falta la raíz.' },
          ], x => `${f(x, 2)} u`),
          solucion: { texto: 'Pitágoras con las dos componentes.', ecuacion: ['|', A, `| = √(${f(p * p, 0)} + ${f(q * q, 0)}) = ${f(m, 0)} u`] },
        };
        const uy = ay / m;
        return {
          pregunta: ['El vector ', vA, ` = ${f(ax, 0)}î ${ay < 0 ? '−' : '+'} ${f(Math.abs(ay), 0)}ĵ. ¿Cuánto vale la componente y de su unitario `, u, '?'],
          dibujo: dib,
          opciones: opciones(uy, [
            { id: 'suma', valor: ay / (Math.abs(ax) + Math.abs(ay)), error: 'U-SUMA', siFuera: 'Se divide, sí, pero entre el módulo, no entre la suma de componentes.' },
            { id: 'cruce', valor: ax / m, error: 'U-CAMBIO', siFuera: 'Esa es la componente x del unitario.' },
            { id: 'sin', valor: ay, error: 'U-UNOS', siFuera: 'Esa es la componente de A; el unitario mide 1.' },
            { id: 'signo', valor: -uy, error: 'U-SIGNO', siFuera: 'El unitario apunta igual que A: conserva el signo.' },
          ], x => f(x, 4)),
          solucion: { texto: `|A| = ${f(m, 0)}; se divide la componente y entre ${f(m, 0)}.`, ecuacion: [{ sub: [u, 'y'] }, ` = ${f(ay, 0)} / ${f(m, 0)} = ${f(uy, 4)}`] },
        };
      },
    },
  };

  // ---------- Idea 5: producto escalar y producto vectorial ----------
  // Cambia: el ángulo θ entre A (4) y B (3) · Permanece: los módulos y el círculo donde puede caer la punta de B ·
  // Progresa: la sombra de B sobre A (escalar) y el área del paralelogramo (vectorial) ·
  // Se reserva: 90°, donde el escalar es 0 y el vectorial es máximo · Debe verse: uno es un número con signo; el otro, un área con dirección.
  const prod = (a, b, g, o = {}) => {
    const tip = [b * cosG(g), b * senG(g)], circ = Array.from({ length: 19 }, (_, i) => [b * Math.cos(i * Math.PI / 18), b * Math.sin(i * Math.PI / 18)]);
    const yS = -0.7; // la sombra se dibuja un poco debajo de A, para que su rótulo no tape el de A
    const sombra = b * cosG(g);
    return { datos: {
      unidad: 'u',
      contorno: o.circulo === false ? undefined : circ,
      flechas: [{ de: [0, 0], a: [a, 0], color: 'o', rotulo: 'A' }, { de: [0, 0], a: tip, color: 'i', rotulo: 'B' }],
      angulos: g > 0 && g < 180 ? [{ en: [0, 0], de: 0, a: g, texto: `${f(g, 0)}°`, color: 'h' }] : [],
      guias: [{ de: tip, a: [sombra, yS], color: 'i', paso: o.pasoS || 0 },
        { de: [a, 0], a: [a + tip[0], tip[1]], color: 'd', paso: o.pasoP || 0 }, { de: tip, a: [a + tip[0], tip[1]], color: 'd', paso: o.pasoP || 0 }],
      segmentos: Math.abs(sombra) > 1e-9 ? [{ de: [0, yS], a: [sombra, yS], color: 'i', texto: `B cos θ = ${f(sombra, 2)}`, paso: o.pasoS || 0 }] : [],
    }, estado: { paso: o.paso === undefined ? 9 : o.paso } };
  };
  const productos = {
    id: 'productos',
    titulo: 'Producto escalar y vectorial',
    temas: ['Producto escalar y vectorial'],
    pieza: 'flechas',
    juega: {
      consigna: 'A = 4 y B = 3. Gira B. La sombra de B sobre A da el producto escalar; el paralelogramo, el vectorial.',
      voz: 'Busca dónde la sombra desaparece y dónde el área es mayor.',
      controles: [{ id: 'g', etiqueta: 'θ', color: 'c-h', min: 0, max: 180, paso: 30, inicio: 60, unidad: '°', decimales: 0 }],
      dibujo: val => prod(4, 3, val.g),
      lectura: val => [vA, '·', vB, ` = ${f(12 * cosG(val.g), 2)} · |`, vA, '×', vB, `| = ${f(12 * senG(val.g), 2)}`],
      minimo: 3,
    },
    predice: {
      pregunta: ['Dos vectores de ', A, ' = 4 y ', B, ' = 5 forman ', th, ' = 90°. ¿Cuánto vale el producto escalar ', vA, ' · ', vB, '?'],
      opciones: [
        { id: 'c', texto: '0', correcta: true },
        { id: 'modulos', texto: '20', error: 'PE-MODULOS', siFuera: '20 sería cierto si apuntaran al mismo lado; a 90° B no tiene sombra sobre A.' },
        { id: 'vector', texto: '20 k̂', error: 'PE-VECTOR', siFuera: '20 k̂ es el producto vectorial a 90°. El escalar es un número, sin dirección.' },
        { id: 'suma', texto: '9', error: 'V-SUMA', siFuera: 'El producto multiplica módulos y coseno; no los suma.' },
      ],
      dibujo: prod(4, 5, 90, { circulo: false, paso: 0, pasoS: 9, pasoP: 9 }),
      revelar: prod(4, 5, 90, { circulo: false, pasoP: 9 }),
      coincide: 'Coincide: a 90°, la sombra de B sobre A mide 0.',
    },
    mira: {
      datos: prod(4, 3, 60, { circulo: false, pasoS: 1, pasoP: 3 }).datos,
      pasos: [
        { estado: { paso: 0 }, texto: 'A mide 4, B mide 3 y forman 60°.', ecuacion: [A, ' = 4,  ', B, ' = 3,  ', th, ' = 60°'] },
        { estado: { paso: 1 }, texto: 'La sombra de B sobre A mide 3 · cos 60° = 1,5.', ecuacion: ['B cos θ = 1,5'] },
        { estado: { paso: 2 }, texto: 'El escalar es A por esa sombra: un número, sin dirección.', ecuacion: [vA, ' · ', vB, ' = ', A, B, ' cos ', th, ' = 4 · 1,5 = 6'] },
        { estado: { paso: 3 }, texto: 'El vectorial mide el área del paralelogramo.', ecuacion: ['|', vA, ' × ', vB, '| = ', A, B, ` sen `, th, ` = ${f(12 * senG(60), 2)}`] },
        { estado: { paso: 3 }, texto: 'Apunta perpendicular al plano de A y B, por la mano derecha.', ecuacion: [vA, ' × ', vB, ` = ${f(12 * senG(60), 2)} k̂`] },
      ],
    },
    regla: {
      texto: 'El producto escalar es un número: A por la sombra de B. El vectorial es un vector perpendicular a ambos, de módulo igual al área del paralelogramo.',
      ecuacion: [vA, ' · ', vB, ' = ', A, B, ' cos ', th, '   ·   |', vA, ' × ', vB, '| = ', A, B, ' sen ', th],
      condicion: 'θ es el ángulo entre A y B con el mismo origen. B × A = −(A × B): el orden importa.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        let a1 = r.ent(-4, 5), a2 = r.ent(-3, 5), b1 = r.ent(-3, 5), b2 = r.ent(-4, 5);
        if (a1 === 0) a1 = 2; if (b2 === 0) b2 = 3;
        const sg = n => (n < 0 ? `− ${f(-n, 0)}` : `+ ${f(n, 0)}`);
        const txt = (x, y) => `${f(x, 0)}î ${sg(y)}ĵ`;
        const pre = ['Si ', vA, ` = ${txt(a1, a2)} y `, vB, ` = ${txt(b1, b2)}, `];
        if (s % 2 === 0) {
          const pe = a1 * b1 + a2 * b2;
          return {
            pregunta: [...pre, '¿cuánto vale ', vA, ' · ', vB, '?'],
            opciones: opciones(pe, [
              { id: 'cruz', valor: a1 * b2 - a2 * b1, error: 'PE-VECTOR', siFuera: 'Ese cruce de componentes es el producto vectorial.' },
              { id: 'resta', valor: a1 * b1 - a2 * b2, error: 'PE-SIGNO', siFuera: 'En el escalar los dos productos se suman.' },
              { id: 'suma', valor: (a1 + a2) * (b1 + b2), error: 'PE-MODULOS', siFuera: 'Eso mezcla x con y; cada eje se multiplica con su eje.' },
            ], x => f(x, 0)),
            solucion: { texto: 'Cada componente con la de su mismo eje, y se suman.', ecuacion: [vA, ' · ', vB, ` = (${f(a1, 0)})(${f(b1, 0)}) + (${f(a2, 0)})(${f(b2, 0)}) = ${f(pe, 0)}`] },
          };
        }
        const pv = a1 * b2 - a2 * b1;
        return {
          pregunta: [...pre, '¿cuánto vale ', vA, ' × ', vB, '?'],
          opciones: opciones(pv, [
            { id: 'orden', valor: -pv, error: 'PE-ORDEN', siFuera: 'Ese es B × A: el orden cambia el signo.' },
            { id: 'escalar', valor: a1 * b1 + a2 * b2, error: 'PE-VECTOR', siFuera: 'Ese es el producto escalar: un número, sin k̂.' },
            { id: 'sin-resta', valor: a1 * b2 + a2 * b1, error: 'PE-SIGNO', siFuera: 'Los productos cruzados se restan, no se suman.' },
          ], x => `${f(x, 0)} k̂`),
          solucion: { texto: 'Se cruzan las componentes y se restan; apunta según k̂.', ecuacion: [vA, ' × ', vB, ` = [(${f(a1, 0)})(${f(b2, 0)}) − (${f(a2, 0)})(${f(b1, 0)})] k̂ = ${f(pv, 0)} k̂`] },
        };
      },
    },
  };

  return {
    unidad: 'fisica.magnitudes-y-vectores',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/recta.js', '/nucleo/kit/piezas/fis-dimensiones.js', '/nucleo/kit/piezas/flechas.js'],
    historia: {
      texto: 'Durante siglos, cada pueblo medía con sus propios patrones. El sistema métrico buscó medidas que cualquiera pudiera reproducir, y desde 2019 el SI se define con constantes de la naturaleza. En el siglo XIX, Hamilton, Grassmann y Gibbs inventaron formas de operar con magnitudes que tienen dirección. Las flechas que usamos son una convención: el desplazamiento no cambia si cambiamos de unidad.',
      pregunta: '¿Qué cambia cuando mides lo mismo en otra unidad?',
      fuente: { titulo: 'NIST — A Turning Point for Humanity: Redefining the World’s Measurement System', url: 'https://www.nist.gov/si-redefinition/turning-point-humanity-redefining-worlds-measurement-system' },
    },
    ideas: [unidades, dimensiones, resultante, componentes, productos],
  };
});
