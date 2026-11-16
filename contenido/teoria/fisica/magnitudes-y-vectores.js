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
  const nodo = typeof module === 'object' && module.exports;
  // nucleo/fisica3d.js arma la mesa 3D «Flechas en el espacio» con el motor de plantillas/vectores (regla 1).
  const def = nodo ? fabrica(require('../../../nucleo/kit/kit.js'), require('../../../nucleo/fisica3d.js')) : fabrica(root.Kit, root.Fisica3D);
  if (nodo) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit, F3) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const A = { v: 'c-o', t: 'A' }, B = { v: 'c-i', t: 'B' }, R = { v: 'c-d', t: 'R' }, th = { v: 'c-h', t: 'θ' };
  const k = { v: 'c-h', t: 'k' }, u = { v: 'c-d', t: 'û' };
  const vA = { vec: A }, vB = { vec: B };
  const rad = g => g * Math.PI / 180;
  const cosG = g => (g % 180 === 90 ? 0 : Math.cos(rad(g)));
  const senG = g => (g % 180 === 0 ? 0 : Math.sin(rad(g)));
  // Gesto directo (docs/teoria.md §4b): la manija vive en las coordenadas de la figura (flechas.geometria) y su
  // inversa (Xi, Yi) da las unidades del problema; el lector ajusta cada valor al paso y al rango de su control.
  const FL = () => Kit.piezas.flechas;
  // Ángulo de un punto visto desde un origen, entre 0° y 180° (lo que queda bajo el eje se pega al eje más cercano).
  const anguloDe = (o, q) => {
    const dx = q[0] - o[0], dy = q[1] - o[1];
    if (dy < 0) return dx >= 0 ? 0 : 180;
    return Math.atan2(dy, dx) * 180 / Math.PI;
  };
  // Una guía con paso 99 no se dibuja, pero cuenta para la escala: así la figura no se encoge mientras se arrastra.
  const marco = (de, a) => ({ de, a, paso: 99 });
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
  // Rehecha el 16 nov contra el contrato «se entiende sin profesor» (docs/plan-calidad.md): Gerson pidió un poste de
  // luz medido con reglas de distintas escalas, en SVG (pieza fis-medida). Antes era una barra sobre una recta que
  // cambiaba de regla al cambiar de unidad, y así no se podía comparar.
  // Cambia: el alto del poste · Permanece: el poste es uno solo y las tres reglas lo miden juntas ·
  // Progresa: los tres números a la vez (6,5 m, 65 dm, 650 cm) · Se reserva: la conversión de km/h a m/s ·
  // Debe verse: el mismo alto con tres números; la regla más fina da el número más grande.
  const POSTE = 8;   // m: los postes de alumbrado de baja tensión suelen medir unos 8 m
  // Largos creíbles para los ejercicios de la idea 1 (contrato, punto 10: nada de lápices de 2,5 m).
  const LARGOS = [{ que: 'Una puerta', m: 2.1 }, { que: 'Una pizarra', m: 2.4 }, { que: 'Un poste de luz', m: 8.5 },
    { que: 'Una cancha de vóley', m: 18 }, { que: 'Un estudiante', m: 1.65 }];
  const MISION = 6.5;
  const Lp = { v: 'c-o', t: 'L' };
  const medida = L => ({ datos: { objeto: 'poste', alto: L, max: 10, color: 'o', variable: 'L' }, estado: {} });
  // Lo que avanza en cada segundo a 72 km/h: tramos de 20 m (se calcula: 72 · 1000 / 3600).
  const V_KMH = 72, V_MS = V_KMH * 1000 / 3600;
  // La combi en su pista (pieza fis-combi): dónde está en cada segundo. segundos: 0 la deja en la partida.
  const pista = (segundos, v = V_MS) => ({ v, segundos, max: Math.max(100, Math.ceil(5 * v / 20) * 20), paso: 10, numero: 20, color: 'o' });
  const unidades = {
    id: 'unidades',
    titulo: 'Otra unidad, otro número',
    pregunta: '¿Qué cambia cuando mides lo mismo en otra unidad?',
    temas: ['Magnitudes fundamentales y derivadas', 'Sistema Internacional'],
    pieza: 'recta',
    lee: {
      tarjetas: [
        { titulo: 'Medir es contar', texto: 'Medir algo es contar cuántas veces cabe en él una unidad: el metro, el decímetro o el centímetro. El número que sale depende de la unidad que elijas.' },
        { titulo: 'Las unidades de la ciencia', texto: 'La ciencia usa el Sistema Internacional: el metro para el largo y el segundo para el tiempo. Así cualquiera, en cualquier país, mide igual.' },
        { titulo: 'Unidades que se juntan', texto: 'Una rapidez junta dos unidades. 60 km/h dice cuántos kilómetros se avanzan en una hora; en metros por segundo, m/s, dice cuántos metros en un segundo.' },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a medir un poste de luz con tres reglas a la vez. Cambia su alto y mira las tres reglas juntas: ¿marcan la misma altura?' },
      ],
    },
    aprendizaje: 'El poste mide lo mismo en cualquier unidad; cambia el número: en decímetros es 10 veces más y en centímetros, 100 veces más.',
    juega: {
      pieza: 'fis-medida',
      consigna: 'Los postes de luz de Juliaca miden unos 8 m. Aquí medimos uno con tres reglas a la vez.',
      mision: {
        texto: `Cambia el alto del poste hasta que la regla de centímetros marque ${f(MISION * 100, 0)}.`,
        logrado: val => Math.abs(val.L - MISION) < 1e-9,
        bien: `Listo: ${f(MISION * 100, 0)} cm. Mira las otras reglas: ${f(MISION, 1)} m y ${f(MISION * 10, 0)} dm. Es el mismo poste.`,
      },
      voz: 'Mira las tres reglas: ¿marcan alturas distintas o la misma altura con otro número?',
      leyenda: [
        { s: Lp, t: 'el alto del poste' },
        { s: 'm', t: 'metro' },
        { s: 'dm', t: 'decímetro: 10 caben en un metro' },
        { s: 'cm', t: 'centímetro: 100 caben en un metro' },
      ],
      controles: [
        { id: 'L', etiqueta: 'Alto del poste, L', color: 'c-o', min: 4, max: 10, paso: 0.1, inicio: POSTE, unidad: 'm', decimales: 1 },
      ],
      dibujo: val => medida(val.L),
      lectura: val => [Lp, ` = ${f(val.L, 1)} m = ${f(val.L * 10, 0)} dm = ${f(val.L * 100, 0)} cm`],
      minimo: 3,
    },
    predice: {
      pregunta: `Una combi va a ${f(V_KMH, 0)} km/h. ¿Cuántos metros avanza en cada segundo?`,
      opciones: [
        { id: 'c', texto: `${f(V_MS, 0)} m`, correcta: true },
        { id: 'solo-km', texto: `${f(V_KMH * 1000, 0)} m`, error: 'CONV-UNO', siFuera: 'Eso pasa bien los km a metros, pero son los metros de una hora entera.' },
        { id: 'por', texto: `${f(V_KMH * 3.6, 1)} m`, error: 'CONV-INVERSO', siFuera: 'Multiplicaste: 72 × 3,6 = 259,2 m en un segundo, más que dos canchas de fútbol. Una combi no corre tanto.' },
        { id: 'minuto', texto: `${f(V_KMH * 1000 / 60, 0)} m`, error: 'CONV-UNO', siFuera: 'Esos son los metros de un minuto. Una hora tiene 3600 segundos.' },
      ],
      pieza: 'fis-combi',
      dibujo: { datos: pista(0), estado: {} },
      revelar: { datos: pista(5), estado: {} },
      coincide: `Coincide: 72 000 m repartidos en 3600 s dan ${f(V_MS, 0)} m cada segundo.`,
    },
    // «Predice», «Mira» y «Así se resuelve» muestran la combi en su pista (pieza fis-combi, 16 nov): antes eran saltos
    // sobre una recta que hablaban de una combi que no se dibujaba.
    mira: {
      pieza: 'fis-combi',
      datos: pista(5),
      // Las unidades se tachan arriba con abajo (lector en frío, 16 nov: no se veía por qué el factor de la hora va al revés).
      pasos: [
        { estado: { corte: 0 }, texto: '72 km/h quiere decir 72 km en una hora.', ecuacion: ['72 km/h = ', { frac: ['72 km', '1 h'] }] },
        { estado: { corte: 0 }, texto: 'Algo entre algo igual da 1, y 1000 m es igual a 1 km.', ecuacion: [{ frac: ['1000 m', '1 km'] }, ' = 1'] },
        { estado: { corte: 0 }, texto: 'Por 1 nada cambia: el km de arriba se tacha con el de abajo.',
          ecuacion: [{ frac: [['72 ', { tacha: 'km' }], '1 h'] }, ' × ', { frac: ['1000 m', ['1 ', { tacha: 'km' }]] }, ' = ', { frac: ['72 000 m', '1 h'] }] },
        { estado: { corte: 0 }, texto: 'Para tachar la hora de abajo, el factor lleva la hora arriba.',
          ecuacion: [{ frac: ['72 000 m', ['1 ', { tacha: 'h' }]] }, ' × ', { frac: [['1 ', { tacha: 'h' }], '3600 s'] }, ' = ', { frac: ['72 000 m', '3600 s'] }] },
        { estado: { corte: 1 }, texto: 'Se reparten los metros entre los segundos: 20 m en cada uno.', ecuacion: [{ frac: ['72 000 m', '3600 s'] }, ' = 20 m/s'] },
        { estado: { corte: 3 }, texto: 'Atajo: por 1000 y entre 3600 es entre 3,6, porque 3600 ÷ 1000 = 3,6.', ecuacion: ['72 ÷ 3,6 = 20'] },
        { estado: { corte: 5 }, texto: 'Cinco segundos, cinco tramos iguales: la misma rapidez, otro número.', ecuacion: ['72 km/h = 20 m/s'] },
      ],
    },
    regla: {
      texto: 'Cambiar de unidad no cambia lo medido: el poste es el mismo y la combi va igual de rápido. Cambia el número: se multiplica por factores que valen 1.',
      ecuacion: [{ frac: [['72 ', { tacha: 'km' }], ['1 ', { tacha: 'h' }]] }, ' × ', { llave: [{ frac: ['1000 m', ['1 ', { tacha: 'km' }]] }], nota: 'vale 1', color: 'c-d' }, ' × ', { llave: [{ frac: [['1 ', { tacha: 'h' }], '3600 s'] }], nota: 'vale 1', color: 'c-d' }, ' = 20 ', { frac: ['m', 's'] }],
      condicion: 'cada factor vale 1 y va de modo que la unidad vieja se tache: arriba si estaba abajo, y al revés.',
    },
    resuelve: {
      pieza: 'fis-combi',
      generar(s) {
        const r = azar(s + 900), tipo = s % 4;
        if (tipo === 0) {
          // Sin 72 km/h: ese es el caso de «Predice» y «Mira».
          const n = r.de([36, 54, 90, 108]), ms = n * 1000 / 3600;
          return {
            enunciado: `Una combi va a ${f(n, 0)} km/h. ¿Cuántos metros avanza en cada segundo?`,
            dibujo: { datos: pista(0, ms), estado: {} },
            pasos: [
              { tipo: 'pide', texto: 'Piden la rapidez en metros por segundo: cuántos metros avanza en un segundo.' },
              { tipo: 'datos', texto: `Va a ${f(n, 0)} km/h: avanza ${f(n, 0)} km en cada hora.` },
              { tipo: 'regla', texto: 'Cada unidad se cambia con un factor que vale 1: los km a metros y la hora a segundos.', ecuacion: ['1 km = 1000 m', '  y  ', '1 h = 60 × 60 s = 3600 s'] },
              { tipo: 'cuentas', texto: 'Los km y las horas se tachan y queda m/s. Es lo mismo que dividir entre 3,6.', ecuacion: [`${f(n, 0)} `, { frac: [{ tacha: 'km' }, { tacha: 'h' }] }, ' × ', { frac: ['1000 m', ['1 ', { tacha: 'km' }]] }, ' × ', { frac: [['1 ', { tacha: 'h' }], '3600 s'] }, ` = ${f(ms, 2)} m/s`], dibujo: { datos: pista(1, ms), estado: {} } },
              { tipo: 'sentido', texto: `${f(ms, 2)} m en un segundo: menos que una cancha de fútbol. Es creíble para un vehículo.` },
            ],
            respuesta: `${f(ms, 2)} m/s`,
          };
        }
        if (tipo === 1) {
          const o = r.de(LARGOS);
          return {
            enunciado: `${o.que} mide ${f(o.m, 2)} m. ¿Cuántos centímetros son?`,
            pasos: [
              { tipo: 'pide', texto: 'Piden el mismo largo en centímetros.' },
              { tipo: 'datos', texto: `Mide ${f(o.m, 2)} m.` },
              { tipo: 'regla', texto: 'En un metro caben 100 centímetros: ese es el factor que vale 1.', ecuacion: [{ frac: ['100 cm', '1 m'] }, ' = 1'] },
              { tipo: 'cuentas', texto: 'Se multiplica por 100.', ecuacion: [`${f(o.m, 2)} m × `, { frac: ['100 cm', '1 m'] }, ` = ${f(o.m * 100, 0)} cm`] },
              { tipo: 'sentido', texto: 'El centímetro es más chico que el metro: el número tenía que subir, y subió.' },
            ],
            respuesta: `${f(o.m * 100, 0)} cm`,
          };
        }
        if (tipo === 2) {
          const mn = r.ent(2, 12) * 5, sg = mn * 60;
          return {
            enunciado: `Una clase dura ${f(mn, 0)} minutos. ¿Cuántos segundos son?`,
            pasos: [
              { tipo: 'pide', texto: 'Piden el mismo tiempo en segundos, la unidad del Sistema Internacional.' },
              { tipo: 'datos', texto: `La clase dura ${f(mn, 0)} min.` },
              { tipo: 'regla', texto: 'Un minuto son 60 segundos: ese es el factor que vale 1.', ecuacion: [{ frac: ['60 s', '1 min'] }, ' = 1'] },
              { tipo: 'cuentas', texto: 'Se multiplica por 60.', ecuacion: [`${f(mn, 0)} min × `, { frac: ['60 s', '1 min'] }, ` = ${f(sg, 0)} s`] },
              { tipo: 'sentido', texto: 'El segundo es más chico que el minuto: el número tenía que subir, y subió.' },
            ],
            respuesta: `${f(sg, 0)} s`,
          };
        }
        const v = r.de([5, 10, 15, 25]), kmh = v * 3.6;
        return {
          enunciado: `${v <= 10 ? 'Un ciclista' : 'Un carro'} va a ${f(v, 0)} m/s. ¿Cuántos km/h son?`,
          dibujo: { datos: pista(0, v), estado: {} },
          pasos: [
            { tipo: 'pide', texto: 'Piden la misma rapidez en kilómetros por hora.' },
            { tipo: 'datos', texto: `Avanza ${f(v, 0)} m en cada segundo.`, dibujo: { datos: pista(1, v), estado: {} } },
            { tipo: 'regla', texto: 'Es el camino de vuelta: los metros a km y los segundos a horas. Ahora se multiplica por 3,6.', ecuacion: [{ frac: ['1 km', '1000 m'] }, ' × ', { frac: ['3600 s', '1 h'] }, ' = 3,6'] },
            { tipo: 'cuentas', texto: 'Se multiplica por 3,6.', ecuacion: [`${f(v, 0)} × 3,6 = ${f(kmh, 0)} km/h`] },
            { tipo: 'sentido', texto: 'En una hora se avanza mucho más que en un segundo: el número tenía que subir.' },
          ],
          respuesta: `${f(kmh, 0)} km/h`,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), tipo = s % 4;
        if (tipo === 0) {
          const n = r.de([36, 54, 90, 108]), ms = n * 1000 / 3600;   // velocidades creíbles; sin 72, el caso de «Predice»
          return {
            pregunta: `Un bus va a ${f(n, 0)} km/h. ¿Cuánto es eso en m/s?`,
            opciones: opciones(ms, [
              { id: 'por', valor: n * 3.6, error: 'CONV-INVERSO', siFuera: 'Multiplicar por 3,6 agranda el número; de km/h a m/s, el número baja.' },
              { id: 'km', valor: n * 1000, error: 'CONV-UNO', siFuera: 'Pasaste los km a metros; falta pasar la hora a segundos.' },
              { id: 'min', valor: n * 1000 / 60, error: 'CONV-UNO', siFuera: 'Eso divide entre 60: son metros por minuto.' },
            ], x => `${f(x, 2)} m/s`),
            solucion: { texto: 'Por 1000 y entre 3600: es dividir entre 3,6.', ecuacion: [`${f(n, 0)} ÷ 3,6 = ${f(ms, 2)} m/s`] },
          };
        }
        if (tipo === 1) {
          const o = r.de(LARGOS);
          return {
            pregunta: `${o.que} mide ${f(o.m, 2)} m. ¿Cuántos centímetros son?`,
            opciones: opciones(o.m * 100, [
              { id: 'dm', valor: o.m * 10, error: 'CONV-UNO', siFuera: 'Por 10 da decímetros; en un metro caben 100 cm.' },
              { id: 'inverso', valor: o.m / 100, error: 'CONV-INVERSO', siFuera: 'Dividir achica el número; el centímetro es más chico, el número sube.' },
              { id: 'mm', valor: o.m * 1000, error: 'CONV-UNO', siFuera: 'Por 1000 da milímetros; en un metro caben 100 cm.' },
            ], x => `${f(x, 3)} cm`),
            solucion: { texto: 'En un metro caben 100 cm.', ecuacion: [`${f(o.m, 2)} m × `, { frac: ['100 cm', '1 m'] }, ` = ${f(o.m * 100, 0)} cm`] },
          };
        }
        if (tipo === 2) {
          const mn = r.ent(2, 12) * 5, sg = mn * 60;
          return {
            pregunta: `Una clase dura ${f(mn, 0)} minutos. ¿Cuántos segundos son, la unidad del SI para el tiempo?`,
            opciones: opciones(sg, [
              { id: 'div', valor: mn / 60, error: 'CONV-INVERSO', siFuera: 'Dividir da horas: el segundo es más chico, el número sube.' },
              { id: 'cien', valor: mn * 100, error: 'CONV-UNO', siFuera: 'Un minuto tiene 60 segundos, no 100.' },
              { id: 'hora', valor: mn * 3600, error: 'CONV-UNO', siFuera: 'Ese 3600 es para horas, no para minutos.' },
            ], x => `${f(x, 2)} s`),
            solucion: { texto: 'Cada minuto son 60 segundos.', ecuacion: [`${f(mn, 0)} min × `, { frac: ['60 s', '1 min'] }, ` = ${f(sg, 0)} s`] },
          };
        }
        const v = r.de([5, 10, 15, 25]);
        return {
          pregunta: `${v <= 10 ? 'Un ciclista' : 'Un carro'} va a ${f(v, 0)} m/s. ¿Cuántos km/h son?`,
          opciones: opciones(v * 3.6, [
            { id: 'entre', valor: v / 3.6, error: 'CONV-INVERSO', siFuera: 'Entre 3,6 es para ir de km/h a m/s; aquí es el camino de vuelta.' },
            { id: 'sesenta', valor: v * 60, error: 'CONV-UNO', siFuera: 'Eso son metros por minuto; falta pasar a km y a horas.' },
            { id: 'tres-mil', valor: v * 3600, error: 'CONV-UNO', siFuera: 'Eso son metros por hora; falta pasar los metros a km.' },
          ], x => `${f(x, 2)} km/h`),
          solucion: { texto: 'De m/s a km/h se multiplica por 3,6.', ecuacion: [`${f(v, 0)} × 3,6 = ${f(v * 3.6, 0)} km/h`] },
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
  const expsDe = val => [val.m, val.l, val.t].map(x => Math.round(x) || 0);
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
    pregunta: '¿Cómo sabes si una fórmula de física puede estar bien escrita?',
    temas: ['Análisis dimensional', 'Magnitudes fundamentales y derivadas'],
    pieza: 'fis-dimensiones',
    juega: {
      consigna: 'Las fichas de tiempo cambian solas: mira aparecer la velocidad y la aceleración en la lectura. Las huecas dividen.',
      voz: 'Busca la fuerza: masa por aceleración.',
      controles: [
        { id: 'm', etiqueta: 'M', min: 0, max: 1, paso: 1, inicio: 0, decimales: 0 },
        { id: 'l', etiqueta: 'L', min: -3, max: 3, paso: 1, inicio: 1, decimales: 0 },
        // El exponente de T barre de 1 a −3 y vuelve (cada paso, una ficha de tiempo más o menos). Va rápido a propósito:
        // cada magnitud dura poco más de medio segundo; «⏸ Pausa» deja leerla.
        { id: 't', etiqueta: 'T', min: -3, max: 1, paso: 1, inicio: -1, decimales: 0, auto: { velocidad: 1.8, modo: 'rebota' } },
      ],
      // Las fichas son enteras: mientras el exponente barre, se toma el entero más cercano.
      dibujo: val => { const e = expsDe(val); return { datos: { columnas: [{ nombre: dimTxt(e), exps: e }] }, estado: {} }; },
      lectura: val => {
        const e = expsDe(val), n = NOMBRES.find(([d]) => d.every((x, i) => x === e[i]));
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
        { estado: { corte: 2, resalta: [2] }, texto: 't² pone dos fichas de tiempo.', ecuacion: ['[', { sup: ['t', '2'] }, '] = ', { sup: ['T', '2'] }] },
        { estado: { corte: 3, resalta: [1] }, texto: 'k debe dar la L y quitar T²: dos fichas huecas.', ecuacion: ['[', k, '] = ', { frac: ['L', { sup: ['T', '2'] }] }, ' = L ', { sup: ['T', '−2'] }] },
        { estado: { corte: 4, resalta: [0, 3] }, texto: 'Producto completo: la misma fila que x. La ecuación es homogénea.', ecuacion: ['[', k, ' · ', { sup: ['t', '2'] }, '] = L ', { sup: ['T', '−2'] }, ' · ', { sup: ['T', '2'] }, ' = L'] },
      ],
    },
    regla: {
      texto: 'En una ecuación física, cada término tiene la misma dimensión. Las magnitudes derivadas se arman con las magnitudes fundamentales: masa, longitud y tiempo, entre otras.',
      ecuacion: ['[F] = M L ', { sup: ['T', '−2'] }, '   ·   ', '[E] = M ', { sup: ['L', '2'] }, ' ', { sup: ['T', '−2'] }, '   ·   ', '[', k, ' · Q] = ', { llave: ['[', k, '] · [Q]'], nota: 'se multiplican', color: 'c-h' }],
      condicion: 'en el análisis dimensional solo se suman o igualan términos de igual dimensión. Que cuadre no prueba que la ecuación sea correcta.',
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
        guias: [{ de: [a, 0], a: [a + b + 0.5, 0], color: 'h', paso: o.pasoB || 0 }, ...(o.marco ? [marco(...o.marco)] : [])],
        resultante: { de: [0, 0], a: tip, color: 'd', rotulo: 'R', valor: o.sinR ? undefined : `${f(r, 2)}`, paso: o.pasoR === undefined ? 0 : o.pasoR },
      },
      estado: { paso: o.paso === undefined ? 9 : o.paso },
      r,
    };
  };
  // El juego fija la escala con el B más largo (6): así la punta de B sigue al dedo sin que la figura se encoja.
  const MARCO_R = [[0, 0], [12.5, 6]];
  const juegoR = val => colaPunta(6, val.b, val.g, { valores: false, marco: MARCO_R });
  const resultante = {
    id: 'resultante',
    titulo: 'La resultante depende del ángulo',
    pregunta: '¿Por qué 3 + 4 no siempre da 7 cuando sumas flechas?',
    temas: ['Suma de vectores por el método gráfico'],
    pieza: 'flechas',
    juega: {
      consigna: 'B gira sola sobre la punta de A. Mira cómo R se estira hasta A + B y se encoge hasta A − B.',
      voz: 'Mira entre qué valores se mueve R.',
      controles: [
        { id: 'g', etiqueta: 'θ', color: 'c-h', min: 0, max: 180, paso: 30, inicio: 60, unidad: '°', decimales: 0, auto: { velocidad: 30, modo: 'rebota' } },
        { id: 'b', etiqueta: 'B', color: 'c-i', min: 2, max: 6, paso: 1, inicio: 4, decimales: 0 },
      ],
      dibujo: val => { const c = juegoR(val); return { datos: c.datos, estado: c.estado }; },
      lectura: val => [th, ` = ${f(val.g, 0)}° → `, R, ` = ${f(colaPunta(6, val.b, val.g).r, 2)}  (A + B = ${f(6 + val.b, 0)})`],
      minimo: 4,
      // Arrastra la punta de B: su giro es θ y su distancia a la punta de A es el largo de B.
      arrastres: [
        { id: 'punta-b', etiqueta: 'punta de B', color: 'c-i',
          donde: val => { const g = FL().geometria(juegoR(val).datos), tip = [6 + val.b * cosG(val.g), val.b * senG(val.g)]; return { x: g.X(tip[0]), y: g.Y(tip[1]) }; },
          mover: (pt, val) => {
            const g = FL().geometria(juegoR(val).datos), q = [g.Xi(pt.x), g.Yi(pt.y)];
            return { g: anguloDe([6, 0], q), b: Math.hypot(q[0] - 6, Math.max(0, q[1])) };
          } },
      ],
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
        { estado: { paso: 0 }, texto: 'A es una magnitud vectorial: se dibuja con su largo, 6 unidades.', ecuacion: [A, ' = 6'] },
        { estado: { paso: 1 }, texto: 'B empieza en la punta de A, sin cambiar largo ni dirección.', ecuacion: [B, ' = 4,   ', th, ' = 60°'] },
        { estado: { paso: 2 }, texto: 'R une la cola de A con la punta de B.', ecuacion: [{ sup: [R, '2'] }, ' = ', { sup: [A, '2'] }, ' + ', { sup: [B, '2'] }, ' + 2', A, B, ' cos ', th] },
        { estado: { paso: 2, final: true }, texto: 'Con cos 60° = 0,5: R² = 36 + 16 + 24.', ecuacion: [R, ` = √76 ≈ ${f(Math.sqrt(76), 2)}`] },
      ],
    },
    regla: {
      texto: 'Los vectores se suman poniéndolos uno a continuación del otro. El módulo de R depende del ángulo, y queda entre A − B y A + B.',
      ecuacion: [{ sup: [R, '2'] }, ' = ', { sup: [A, '2'] }, ' + ', { sup: [B, '2'] }, ' + ', { llave: ['2', A, B, ' cos ', th], nota: 'lo que pone θ', color: 'c-h' }],
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
            ecuacion: [R, ` = √(${f(a * a, 0)} + ${f(b * b, 0)} + 2 · ${f(a, 0)} · ${f(b, 0)} · cos ${f(g, 0)}°) = √(${f(a * a, 0)} + ${f(b * b, 0)} + 2 · ${f(a, 0)} · ${f(b, 0)} · ${f(cosG(g), 1)}) = ${f(c.r, 2)} u`],
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
    pregunta: '¿Cómo se parte una flecha en dos, y qué flecha mide 1?',
    temas: ['Componentes y vector unitario'],
    pieza: 'flechas',
    juega: {
      consigna: 'Aₓ va y viene sola. Mira la flecha verde, el unitario: gira con A, pero siempre mide 1.',
      voz: 'Prueba también A = 0. ¿Hacia dónde apuntaría su unitario?',
      controles: [
        { id: 'ax', etiqueta: 'Ax', color: 'c-o', min: -4, max: 4, paso: 1, inicio: 3, decimales: 0, auto: { velocidad: 1.5, modo: 'rebota' } },
        { id: 'ay', etiqueta: 'Ay', color: 'c-o', min: -4, max: 4, paso: 1, inicio: 2, decimales: 0 },
      ],
      dibujo: val => compA(val.ax, val.ay, { unitario: true, valor: true }),
      lectura: val => {
        const m = Math.hypot(val.ax, val.ay);
        return m > 1e-9 ? ['|', A, `| = ${f(m, 2)} · `, u, ` = (${f(val.ax / m, 2)}; ${f(val.ay / m, 2)})`] : [A, ' = 0: no apunta a ningún lado; no tiene ', u];
      },
      minimo: 3,
      // Arrastra la punta de A: su sombra en x es Aₓ y su sombra en y es Aᵧ (los ejes de −4 a 4 fijan la escala).
      arrastres: [
        { id: 'punta-a', etiqueta: 'punta de A', color: 'c-o',
          donde: val => { const g = FL().geometria(compA(val.ax, val.ay, { unitario: true }).datos); return { x: g.X(val.ax), y: g.Y(val.ay) }; },
          mover: (pt, val) => { const g = FL().geometria(compA(val.ax, val.ay, { unitario: true }).datos); return { ax: g.Xi(pt.x), ay: g.Yi(pt.y) }; } },
      ],
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
        { estado: { paso: 2 }, texto: 'Su módulo sale de Pitágoras con las componentes.', ecuacion: ['|', A, '| = ', { raiz: [[{ sup: ['3', '2'] }, ' + ', { sup: ['4', '2'] }]] }, ' = 5'] },
        { estado: { paso: 3 }, texto: 'El unitario divide cada componente entre 5: mide 1.', ecuacion: [u, ' = ', { frac: [vA, ['|', A, '|']] }, ' = 0,6î + 0,8ĵ'] },
      ],
    },
    regla: {
      texto: 'Un vector se escribe con sus componentes sobre î y ĵ. Su módulo sale de Pitágoras, y el unitario es el vector dividido entre su módulo.',
      ecuacion: [vA, ' = ', { sub: [A, 'x'] }, 'î + ', { sub: [A, 'y'] }, 'ĵ', '   ·   ', '|', A, '| = ', { llave: [{ raiz: [[{ sup: [{ sub: [A, 'x'] }, '2'] }, ' + ', { sup: [{ sub: [A, 'y'] }, '2'] }]] }], nota: 'el módulo', color: 'c-o' }, '   ·   ', u, ' = ', { llave: [{ frac: [vA, ['|', A, '|']] }], nota: 'mide 1', color: 'c-d' }],
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
        { de: [a, 0], a: [a + tip[0], tip[1]], color: 'd', paso: o.pasoP || 0 }, { de: tip, a: [a + tip[0], tip[1]], color: 'd', paso: o.pasoP || 0 },
        ...(o.marco ? [marco(...o.marco)] : [])],
      segmentos: Math.abs(sombra) > 1e-9 ? [{ de: [0, yS], a: [sombra, yS], color: 'i', texto: `B cos θ = ${f(sombra, 2)}`, paso: o.pasoS || 0 }] : [],
    }, estado: { paso: o.paso === undefined ? 9 : o.paso } };
  };
  // El juego fija la escala con todo lo que puede ocupar la figura en la media vuelta (sombra y paralelogramo).
  const MARCO_P = [[-3, -0.7], [7, 3]];
  const productos = {
    id: 'productos',
    titulo: 'Producto escalar y vectorial',
    pregunta: '¿De qué dos maneras se multiplican dos flechas?',
    temas: ['Producto escalar y vectorial'],
    pieza: 'flechas',
    juega: {
      consigna: 'A = 4 y B = 3. B gira sola. Mira la sombra de B sobre A (escalar) y el área del paralelogramo (vectorial).',
      voz: 'Busca dónde la sombra desaparece y dónde el área es mayor.',
      controles: [{ id: 'g', etiqueta: 'θ', color: 'c-h', min: 0, max: 180, paso: 30, inicio: 60, unidad: '°', decimales: 0, auto: { velocidad: 30, modo: 'rebota' } }],
      dibujo: val => prod(4, 3, val.g, { marco: MARCO_P }),
      lectura: val => [vA, '·', vB, ` = ${f(12 * cosG(val.g), 2)} · |`, vA, '×', vB, `| = ${f(12 * senG(val.g), 2)}`],
      minimo: 3,
      // Arrastra la punta de B por su media vuelta: su giro es θ (el largo de B queda en 3).
      arrastres: [
        { id: 'giro-b', etiqueta: 'punta de B', color: 'c-h',
          donde: val => { const g = FL().geometria(prod(4, 3, val.g, { marco: MARCO_P }).datos); return { x: g.X(3 * cosG(val.g)), y: g.Y(3 * senG(val.g)) }; },
          mover: (pt, val) => { const g = FL().geometria(prod(4, 3, val.g, { marco: MARCO_P }).datos); return { g: anguloDe([0, 0], [g.Xi(pt.x), g.Yi(pt.y)]) }; } },
      ],
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
        { estado: { paso: 1 }, texto: 'La sombra de B sobre A mide 3 · cos 60° = 1,5.', ecuacion: ['B cos θ = 3 · cos 60° = 3 · 0,5 = 1,5'] },
        { estado: { paso: 2 }, texto: 'El producto escalar da una magnitud escalar: un número, sin dirección.', ecuacion: [vA, ' · ', vB, ' = ', A, B, ' cos ', th, ' = 4 · 3 · cos 60° = 4 · 1,5 = 6'] },
        { estado: { paso: 3 }, texto: 'El vectorial mide el área del paralelogramo.', ecuacion: ['|', vA, ' × ', vB, '| = ', A, B, ` sen `, th, ` = ${f(12 * senG(60), 2)}`] },
        { estado: { paso: 3 }, texto: 'Apunta perpendicular al plano de A y B, por la mano derecha.', ecuacion: [vA, ' × ', vB, ` = ${f(12 * senG(60), 2)} k̂`] },
      ],
    },
    regla: {
      texto: 'El producto escalar es un número: A por la sombra de B. El vectorial es un vector perpendicular a ambos, de módulo igual al área del paralelogramo.',
      ecuacion: [vA, ' · ', vB, ' = ', A, { llave: [B, ' cos ', th], nota: 'sombra de B', color: 'c-i' }, '   ·   ', '|', vA, ' × ', vB, '| = ', { llave: [A, B, ' sen ', th], nota: 'área', color: 'c-d' }],
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

  // Mesas del laboratorio: la escala se fija con los largos máximos, para que las puntas sigan al dedo.
  const sumaLibre = val => colaPunta(val.a, val.b, val.g, { marco: [[-4, 0], [12.5, 6]] });
  const prodLibre = val => prod(val.a, val.b, val.g, { marco: [[-5, -0.7], [10, 5]] });
  // Lo que miden la sombra (escalar) y el paralelogramo (área del vectorial) en la mesa libre; lo usan la lectura y los retos.
  const escalarLibre = val => val.a * val.b * cosG(val.g);
  const areaLibre = val => Math.abs(val.a * val.b * senG(val.g));
  const rLibre = val => sumaLibre(val).r;
  const modA = val => Math.hypot(val.ax, val.ay);
  // Flechas en el espacio (laboratorio 3D, 15 nov: exploración libre, sin predicciones). Módulo, A · B y A × B salen del
  // motor de plantillas/vectores a través de nucleo/fisica3d.js: la figura, la lectura y los retos usan el mismo número.
  const esp = val => F3.vectores(val);
  const casi = (a, b) => Math.abs(a - b) < 1e-9;
  const mesaEspacio = {
    id: 'flechas-espacio', titulo: 'Flechas en el espacio', pieza: 'fis-espacio-3d',
    consigna: 'Az sube y baja sola: mira cómo cambia el largo de A. Gira el espacio con el dedo; después mira A × B.',
    controles: [
      { id: 'ver', etiqueta: 'Mirar', opciones: [{ valor: 'comp', texto: 'Componentes' }, { valor: 'cruz', texto: 'A × B' }] },
      { id: 'ax', etiqueta: 'Ax', color: 'c-o', min: -2, max: 2, paso: 1, inicio: 2, decimales: 0 },
      { id: 'ay', etiqueta: 'Ay', color: 'c-o', min: -2, max: 2, paso: 1, inicio: 1, decimales: 0 },
      // Az barre de −2 a 2 y vuelve; los cuadros casi nunca caen justo en 0, así la flecha de Az no desaparece y la
      // escena 3D se mueve sin rearmarse (fis-espacio-3d, forma y mover). Los retos piden valores que el alumno fija.
      { id: 'az', etiqueta: 'Az', color: 'c-o', min: -2, max: 2, paso: 1, inicio: 1, decimales: 0, auto: { velocidad: 1, modo: 'rebota' } },
      { id: 'b', etiqueta: 'B', color: 'c-i', opciones: ['x', 'y', 'z', 'xy'].map(k => ({ valor: k, texto: F3.BNOMBRE[k] })) },
    ],
    dibujo: val => ({ datos: esp(val).datos, estado: {} }),
    lectura: val => {
      const e = esp(val);
      return val.ver === 'cruz' ? [A, ' · ', B, ` = ${f(e.punto)} · |`, A, ' × ', B, `| = ${f(e.modCruz)}`] : ['|', A, `| = √(${[val.ax, val.ay, val.az].map(x => f(x * x)).join(' + ')}) = ${f(e.modA)}`];
    },
    invitaciones: [
      { texto: 'Arma una A que mida justo 3 sin ponerla sobre un eje.',
        logrado: val => casi(esp(val).modA, 3) && [val.ax, val.ay, val.az].filter(x => x !== 0).length >= 2,
        bien: 'Tres sombras, un solo largo: √(4 + 4 + 1) = 3. Pitágoras dos veces.',
        pista: 'Prueba componentes 2, 2 y 1, con el signo que quieras.' },
      { texto: 'Mirando A × B, logra un producto cero sin que A sea cero.',
        logrado: val => val.ver === 'cruz' && esp(val).modA > 0 && casi(esp(val).modCruz, 0),
        bien: 'A quedó paralela a B: no hay paralelogramo, no hay área.',
        pista: 'Pon A en la misma dirección que B. Mira si queda área entre las dos.' },
      { texto: 'Logra que A × B apunte hacia arriba, con z positivo.',
        logrado: val => val.ver === 'cruz' && esp(val).cruz[2] > 1e-9,
        bien: 'Cambia el orden de los giros y la flecha cambia de lado. Míralo de costado.',
        pista: 'Con B = î, prueba Ay negativa. Gira el espacio y mira hacia dónde sale.' },
      { texto: 'Haz A · B = 0 con una A de largo 2 o más.',
        logrado: val => val.ver === 'cruz' && esp(val).modA >= 2 - 1e-9 && casi(esp(val).punto, 0),
        bien: 'Perpendiculares: la sombra de A sobre B no mide nada, pero el área es máxima.',
        pista: 'Elige B = k̂ y deja Az en 0.' },
      { texto: 'Guarda dos A del mismo largo que apunten a lugares distintos.',
        logrado: (val, guardados) => guardados.some(a => guardados.some(b => esp(a).modA > 0 && casi(esp(a).modA, esp(b).modA)
          && (a.ax !== b.ax || a.ay !== b.ay || a.az !== b.az))),
        bien: 'El largo no dice hacia dónde: para eso están las tres componentes.' },
    ],
  };

  return {
    unidad: 'fisica.magnitudes-y-vectores',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/recta.js', '/nucleo/kit/piezas/fis-medida.js', '/nucleo/kit/piezas/fis-combi.js', '/nucleo/kit/piezas/fis-dimensiones.js', '/nucleo/kit/piezas/flechas.js',
      '/plantillas/vectores/motor.js', '/nucleo/fisica3d.js', '/nucleo/kit/piezas/fis-espacio-3d.js'],
    // Glosario del tema (docs/teoria.md, 4d): las palabras que esta unidad estrena en el curso (es la primera).
    glosario: [
      { termino: 'magnitud', def: 'Propiedad de algo que se puede medir y decir con un número y una unidad.',
        ejemplos: ['El largo de una mesa: 2,5 m, que también son 250 cm.', 'La temperatura de Juliaca una mañana de julio: −8 °C.', 'La masa de una pelota de fútbol: unos 0,43 kg.'], ver: ['magnitud fundamental', 'magnitud derivada'] },
      { termino: 'magnitud fundamental', formas: ['magnitud fundamental', 'magnitudes fundamentales'],
        def: 'Una de las siete que el SI toma como base, como la masa, la longitud y el tiempo.',
        ejemplos: ['La longitud se mide en metros y el tiempo, en segundos.', 'La masa de un saco de quinua se mide en kilogramos.', 'La corriente de un foco se mide en amperios, otra de las siete.'], ver: ['magnitud derivada', 'Sistema Internacional'] },
      { termino: 'magnitud derivada', formas: ['magnitud derivada', 'magnitudes derivadas'],
        def: 'La que se arma combinando las fundamentales, como la velocidad: longitud entre tiempo.',
        ejemplos: ['[F] = M L T⁻²: la fuerza sale de masa, longitud y tiempo.', 'La rapidez de una combi: metros entre segundos, m/s.', 'El área de un terreno: metro por metro, m².'], ver: ['magnitud fundamental', 'dimensión'] },
      { termino: 'Sistema Internacional', simbolo: 'SI', def: 'Acuerdo mundial de unidades: metro, kilogramo, segundo y otras cuatro de base.',
        ejemplos: ['72 km/h, en unidades del SI, son 20 m/s.', 'La masa va en kilogramos, no en libras ni en arrobas.', 'Un viaje de 2 h, en segundos del SI, son 7200 s.'], ver: ['magnitud fundamental'] },
      { termino: 'dimensión', simbolo: '[ ]', formas: ['dimensión', 'dimensiones'],
        def: 'Cómo se arma una magnitud con masa (M), longitud (L) y tiempo (T), sin mirar la unidad.',
        ejemplos: ['[v] = L T⁻¹, se mida en m/s o en km/h.', 'Un área tiene dimensión L², se mida en m² o en hectáreas.', 'La aceleración es L T⁻², se mida en m/s² o en km/h².'], ver: ['análisis dimensional'] },
      { termino: 'análisis dimensional', def: 'Comprobar con M, L y T que cada término de una ecuación tenga la misma dimensión, o despejar una.',
        ejemplos: ['Si x = k t², entonces [k] = L T⁻².', 'En d = v t los dos lados son L: la fórmula puede estar bien.', 'En v = d + t se suma longitud con tiempo: la fórmula está mal.'], ver: ['dimensión'] },
      { termino: 'magnitud escalar', formas: ['magnitud escalar', 'magnitudes escalares'],
        def: 'La que queda dicha del todo con un número y su unidad, sin dirección.',
        ejemplos: ['Una masa de 3 kg o un tiempo de 10 s.', 'La temperatura de un vaso de agua: 20 °C.', 'El volumen de una botella: 0,5 L. No apunta a ningún lado.'], ver: ['vector'] },
      { termino: 'vector', formas: ['vector', 'vectores', 'magnitud vectorial', 'magnitudes vectoriales'],
        def: 'Flecha con tamaño, dirección y sentido; representa magnitudes como el desplazamiento o la fuerza.',
        ejemplos: ['Una fuerza de 4 N hacia arriba.', 'El desplazamiento de una combi: 3 km hacia el norte.', 'La velocidad del viento: 5 m/s hacia el este.'], ver: ['módulo', 'magnitud escalar', 'componente'] },
      { termino: 'módulo', simbolo: '|A|', def: 'El tamaño de un vector: el largo de su flecha. Nunca es negativo.',
        ejemplos: ['A = 3î + 4ĵ mide |A| = 5.', 'Una fuerza de 10 N hacia abajo tiene módulo 10 N.', 'Caminar 3 m al este y 4 m al norte: el desplazamiento mide 5 m.'], ver: ['vector'] },
      { termino: 'resultante', simbolo: 'R', def: 'Vector que reemplaza a varios: va de la cola del primero a la punta del último.',
        ejemplos: ['A = 3 y B = 4 a 90°: R = 5.', 'Dos personas jalan una caja con 30 N cada una, hacia el mismo lado: R = 60 N.', 'Con 30 N y 20 N en sentidos opuestos: R = 10 N.'], ver: ['vector'] },
      { termino: 'componente', def: 'Lo que un vector avanza a lo largo de un eje, con su signo.',
        ejemplos: ['A = 3î + 4ĵ: Aₓ = 3 y Aᵧ = 4.', 'Una flecha de 10 a 37° del eje x tiene Aₓ = 8 y Aᵧ = 6.', 'Una flecha que apunta al oeste tiene componente x negativa.'], ver: ['vector unitario', 'módulo'] },
      { termino: 'vector unitario', simbolo: 'û', formas: ['vector unitario', 'vectores unitarios', 'unitario', 'unitarios'],
        def: 'Flecha de largo 1 que apunta igual que otra; sale de dividirla entre su módulo.',
        ejemplos: ['A = 6î + 8ĵ: û = 0,6î + 0,8ĵ.', 'î es el unitario del eje x: mide 1 y apunta a la derecha.', 'Una fuerza de 5 N hacia arriba es 5 veces el unitario ĵ.'], ver: ['componente'] },
      { termino: 'producto escalar', simbolo: 'A · B', def: 'Número que sale de multiplicar un largo por la sombra del otro: A B cos θ.',
        ejemplos: ['A = 4 y B = 3 a 60°: A · B = 6.', 'Dos flechas perpendiculares: A · B = 0.', 'Empujar un carrito 5 m con 10 N en esa misma dirección da 50 J de trabajo.'], ver: ['producto vectorial'] },
      { termino: 'producto vectorial', simbolo: 'A × B',
        def: 'Vector perpendicular a los dos, cuyo largo es el área de su paralelogramo: A B sen θ.',
        ejemplos: ['A = 4 y B = 5 a 90°: |A × B| = 20.', 'Dos flechas paralelas: |A × B| = 0, no encierran área.', 'Girar una llave de 0,2 m con 10 N perpendicular: torque de 2 N·m.'], ver: ['producto escalar'] },
      { termino: 'masa', simbolo: 'm', medida: 'kg', def: 'Cuánta materia tiene un cuerpo. Es fundamental en el SI y no cambia de un lugar a otro.',
        ejemplos: ['Un saco de 5 kg tiene 5 kg en Lima y en la Luna.', 'Un estudiante de 60 kg sigue teniendo 60 kg en la cima del Misti.', 'Un litro de agua tiene una masa de 1 kg.'], ver: ['magnitud fundamental'] },
    ],
    // Laboratorio: juego libre, sin preguntas. Las dos mesas nuevas sueltan los dos largos y el ángulo a la vez (en
    // los juegos, A queda fijo); la del medio es el juego de las componentes, con su punta arrastrable.
    laboratorio: [
      mesaEspacio,
      {
        id: 'suma-libre', titulo: 'Dos flechas sin amarras', pieza: 'flechas',
        consigna: 'Arrastra la punta de A o la de B, o usa los botones. Busca dos casos con el mismo R y otro ángulo.',
        controles: [
          { id: 'a', etiqueta: 'A', color: 'c-o', min: 2, max: 6, paso: 1, inicio: 5, decimales: 0 },
          { id: 'b', etiqueta: 'B', color: 'c-i', min: 1, max: 6, paso: 1, inicio: 3, decimales: 0 },
          { id: 'g', etiqueta: 'θ', color: 'c-h', min: 0, max: 180, paso: 15, inicio: 90, unidad: '°', decimales: 0 },
        ],
        dibujo: val => { const c = sumaLibre(val); return { datos: c.datos, estado: c.estado }; },
        lectura: val => [A, ` = ${f(val.a, 0)} · `, B, ` = ${f(val.b, 0)} · `, th, ` = ${f(val.g, 0)}° → `, R, ` = ${f(rLibre(val), 2)}`],
        // Retos: cada uno lo comprueba la misma resultante que se dibuja (colaPunta).
        invitaciones: [
          { texto: 'Haz que R mida lo mismo que A + B.',
            logrado: val => Math.abs(rLibre(val) - (val.a + val.b)) < 1e-9,
            bien: 'Solo a 0° los módulos se suman: las dos flechas apuntan igual.' },
          { texto: 'Consigue que R mida justo 5, sin que A ni B midan 5.',
            logrado: val => Math.abs(rLibre(val) - 5) < 1e-9 && val.a !== 5 && val.b !== 5,
            bien: 'Un triángulo 3, 4, 5 escondido en la suma. ¿Qué ángulo lo arma?' },
          { texto: 'Haz que R sea más corta que A y también que B.',
            logrado: val => rLibre(val) < Math.min(val.a, val.b) - 1e-9,
            bien: 'Sumar flechas puede dar menos que cada una. ¿Desde qué ángulo pasa?' },
          { texto: 'Guarda dos casos con el mismo R y distinto ángulo.',
            logrado: (val, guardados) => guardados.some(x => x.g !== val.g && Math.abs(rLibre(x) - rLibre(val)) < 1e-9)
              && guardados.some(x => x.a === val.a && x.b === val.b && x.g === val.g),
            bien: 'Mismo R por dos caminos: los largos compensan lo que cambia el ángulo.' },
        ],
        arrastres: [
          { id: 'punta-a', etiqueta: 'punta de A', color: 'c-o',
            donde: val => { const g = FL().geometria(sumaLibre(val).datos); return { x: g.X(val.a), y: g.Y(0) }; },
            mover: (pt, val) => ({ a: FL().geometria(sumaLibre(val).datos).Xi(pt.x) }) },
          { id: 'punta-b', etiqueta: 'punta de B', color: 'c-i',
            donde: val => { const g = FL().geometria(sumaLibre(val).datos); return { x: g.X(val.a + val.b * cosG(val.g)), y: g.Y(val.b * senG(val.g)) }; },
            mover: (pt, val) => {
              const g = FL().geometria(sumaLibre(val).datos), q = [g.Xi(pt.x), g.Yi(pt.y)];
              return { g: anguloDe([val.a, 0], q), b: Math.hypot(q[0] - val.a, Math.max(0, q[1])) };
            } },
        ],
      },
      Object.assign({ id: 'componentes', titulo: 'Componentes y unitario', pieza: 'flechas',
        // Retos: el módulo es el mismo Math.hypot que dibuja compA; el unitario, cada componente entre el módulo.
        invitaciones: [
          { texto: 'Consigue que A mida justo 5.',
            logrado: val => Math.abs(modA(val) - 5) < 1e-9,
            bien: 'Componentes 3 y 4, módulo 5: Pitágoras con las sombras de A.' },
          { texto: 'Haz que el unitario apunte hacia abajo y a la izquierda.',
            logrado: val => modA(val) > 0 && val.ax / modA(val) < 0 && val.ay / modA(val) < 0,
            bien: 'El unitario copia los signos de A: misma dirección, largo 1.' },
          { texto: 'Guarda dos A de distinto largo con el mismo unitario.',
            logrado: (val, guardados) => modA(val) > 0 && guardados.some(x => modA(x) > 0 && Math.abs(modA(x) - modA(val)) > 1e-9
              && Math.abs(x.ax / modA(x) - val.ax / modA(val)) < 1e-9 && Math.abs(x.ay / modA(x) - val.ay / modA(val)) < 1e-9)
              && guardados.some(x => x.ax === val.ax && x.ay === val.ay),
            bien: 'Distinto largo, mismo unitario: û solo guarda hacia dónde apunta A.' },
        ] }, componentes.juega),
      {
        id: 'productos-libre', titulo: 'Sombra y área a la vez', pieza: 'flechas',
        consigna: 'Cambia los dos largos y el ángulo. Compara la sombra de B sobre A con el área del paralelogramo.',
        controles: [
          { id: 'a', etiqueta: 'A', color: 'c-o', min: 1, max: 5, paso: 1, inicio: 4, decimales: 0 },
          { id: 'b', etiqueta: 'B', color: 'c-i', min: 1, max: 5, paso: 1, inicio: 3, decimales: 0 },
          { id: 'g', etiqueta: 'θ', color: 'c-h', min: 0, max: 180, paso: 15, inicio: 45, unidad: '°', decimales: 0 },
        ],
        dibujo: val => prodLibre(val),
        lectura: val => [`${f(val.a, 0)} y ${f(val.b, 0)} a ${f(val.g, 0)}°: escalar ${f(escalarLibre(val), 2)} · área ${f(areaLibre(val), 2)}`],
        // Retos: la sombra y el área son las de la figura (A B cos θ y A B sen θ).
        invitaciones: [
          { texto: 'Haz que el producto escalar valga 0.',
            logrado: val => Math.abs(escalarLibre(val)) < 1e-9,
            bien: 'A 90° la sombra desaparece y el área es la mayor. ¿Coincidencia?' },
          { texto: 'Busca el menor ángulo que da un producto escalar negativo.',
            logrado: val => escalarLibre(val) < -1e-9 && escalarLibre(Object.assign({}, val, { g: val.g - 15 })) >= -1e-9,
            bien: 'Pasado 90°, la sombra cae detrás de A: el escalar tiene signo.' },
          { texto: 'Haz que el área sea 0 sin que el escalar sea 0.',
            logrado: val => areaLibre(val) < 1e-9 && Math.abs(escalarLibre(val)) > 1e-9,
            bien: 'Flechas alineadas: no encierran área, pero la sombra es entera.' },
          { texto: 'Guarda dos casos con la misma área y distinto producto escalar.',
            logrado: (val, guardados) => guardados.some(x => Math.abs(areaLibre(x) - areaLibre(val)) < 1e-9 && Math.abs(escalarLibre(x) - escalarLibre(val)) > 1e-9)
              && guardados.some(x => x.a === val.a && x.b === val.b && x.g === val.g),
            bien: 'Misma área, otra sombra: cada producto mira el ángulo a su manera.' },
        ],
        arrastres: [
          { id: 'punta-a', etiqueta: 'punta de A', color: 'c-o',
            donde: val => { const g = FL().geometria(prodLibre(val).datos); return { x: g.X(val.a), y: g.Y(0) }; },
            mover: (pt, val) => ({ a: FL().geometria(prodLibre(val).datos).Xi(pt.x) }) },
          { id: 'punta-b', etiqueta: 'punta de B', color: 'c-i',
            donde: val => { const g = FL().geometria(prodLibre(val).datos); return { x: g.X(val.b * cosG(val.g)), y: g.Y(val.b * senG(val.g)) }; },
            mover: (pt, val) => {
              const g = FL().geometria(prodLibre(val).datos), q = [g.Xi(pt.x), g.Yi(pt.y)];
              return { g: anguloDe([0, 0], q), b: Math.hypot(q[0], Math.max(0, q[1])) };
            } },
        ],
      },
    ],
    historia: {
      texto: 'Durante siglos, cada pueblo medía con sus propios patrones. El sistema métrico buscó medidas que cualquiera pudiera reproducir, y desde 2019 el SI se define con constantes de la naturaleza. En el siglo XIX, Hamilton, Grassmann y Gibbs inventaron formas de operar con magnitudes que tienen dirección. Las flechas que usamos son una convención: el desplazamiento no cambia si cambiamos de unidad.',
      pregunta: '¿Qué cambia cuando mides lo mismo en otra unidad?',
      fuente: { titulo: 'NIST — A Turning Point for Humanity: Redefining the World’s Measurement System', url: 'https://www.nist.gov/si-redefinition/turning-point-humanity-redefining-worlds-measurement-system' },
    },
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea). Una lista vacía:
    // la mesa no practica ninguna idea de la unidad y va en «Más mesas del tema».
    laboratorioIdeas: {
      'flechas-espacio': ['componentes', 'productos'],
      'suma-libre': ['resultante'],
      'componentes': ['componentes'],
      'productos-libre': ['productos'],
    },
    ideas: [unidades, dimensiones, resultante, componentes, productos],
  };
});
