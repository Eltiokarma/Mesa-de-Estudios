/*
 * Teoría de «Magnitudes y unidades» (fisica.magnitudes-y-vectores; el id es el de antes del 16 nov, cuando la unidad
 * se partió en dos y los vectores pasaron a fisica/vectores.js). Molde de docs/teoria.md y contrato «se entiende sin
 * profesor» (docs/plan-calidad.md). Ideas: cambiar de unidad (hecha con el contrato) y dimensiones; falta la idea de
 * áreas y volúmenes (aprobada por Gerson el 16 nov).
 * Colores (regla 4): el alto L del poste y la rapidez, naranja (c-o); el factor que vale 1, verde (c-d); en la idea de
 * dimensiones, la incógnita k va en rojo (c-h).
 * Códigos de error (hipótesis, sin dato empírico propio; matriz: «confundir dimensiones con unidades»):
 *   DIM-UNIDAD toma la unidad por la dimensión · DIM-INVERSA invierte el despeje · DIM-TERMINO copia la del otro lado
 *   DIM-EXPONENTE olvida que una potencia repite las fichas
 *   CONV-UNO un solo factor · CONV-INVERSO factor al revés · CONV-CUADRADO olvida elevar el factor
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
    temas: ['Magnitudes fundamentales y derivadas', 'Sistema Internacional', 'Conversión de unidades'],
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

  return {
    unidad: 'fisica.magnitudes-y-vectores',
    // Desde el 16 nov es «Magnitudes y unidades» (Gerson eligió partir la unidad); los vectores van en fisica/vectores.js.
    // El id no cambia: el avance de los alumnos se guarda con él.
    version: '0.3.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/recta.js', '/nucleo/kit/piezas/fis-medida.js', '/nucleo/kit/piezas/fis-combi.js', '/nucleo/kit/piezas/fis-dimensiones.js'],
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
      { termino: 'masa', simbolo: 'm', medida: 'kg', def: 'Cuánta materia tiene un cuerpo. Es fundamental en el SI y no cambia de un lugar a otro.',
        ejemplos: ['Un saco de 5 kg tiene 5 kg en Lima y en la Luna.', 'Un estudiante de 60 kg sigue teniendo 60 kg en la cima del Misti.', 'Un litro de agua tiene una masa de 1 kg.'], ver: ['magnitud fundamental'] },
    ],
    historia: {
      texto: 'Durante siglos, cada pueblo medía con sus propios patrones. El sistema métrico buscó medidas que cualquiera pudiera reproducir, y desde 2019 el SI se define con constantes de la naturaleza. En el siglo XIX, Hamilton, Grassmann y Gibbs inventaron formas de operar con magnitudes que tienen dirección. Las flechas que usamos son una convención: el desplazamiento no cambia si cambiamos de unidad.',
      pregunta: '¿Qué cambia cuando mides lo mismo en otra unidad?',
      fuente: { titulo: 'NIST — A Turning Point for Humanity: Redefining the World’s Measurement System', url: 'https://www.nist.gov/si-redefinition/turning-point-humanity-redefining-worlds-measurement-system' },
    },
    ideas: [unidades, dimensiones],
  };
});
