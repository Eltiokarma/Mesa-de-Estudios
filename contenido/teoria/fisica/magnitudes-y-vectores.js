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

  // ---------- Idea 2: en un área el factor va al cuadrado; en un volumen, al cubo ----------
  // Nueva el 16 nov (Gerson aprobó sacar estas conversiones de la idea 1, donde llegaban sin preparación). Pieza
  // fis-area: el mismo piso cubierto con cuadros de 1 m y de 1 dm, lado a lado, y un cubo con cuadrícula para el volumen.
  // Cambia: el lado del piso · Permanece: el piso es uno solo · Progresa: los cuadros que caben (× 100 al pasar a dm²) ·
  // Se reserva: m² a cm² (10 000), que se predice · Debe verse: el factor 10 entra una vez por cada lado.
  const Ar = { v: 'c-o', t: 'A' };
  const pisoDoble = L => ({ datos: { color: 'o', cuadros: [
    { lado: L, max: 3, celdas: 1, arriba: `${f(L, 1)} m`, abajo: `${f(L * L, 2)} m²`, nombre: 'cuadros de 1 m' },
    { lado: L * 10, max: 30, celdas: 1, arriba: `${f(L * 10, 0)} dm`, abajo: `${f(L * L * 100, 0)} dm²`, nombre: 'cuadros de 1 dm' },
  ] }, estado: {} });
  const VISTAS_AREA = [
    { cuadros: [{ lado: 1, celdas: 10, fila: true, arriba: '1 m = 10 dm', abajo: '100 dm²', nombre: 'cuadros de 1 dm' }] },
    { cuadros: [{ lado: 1, celdas: 10, arriba: '1 m = 10 dm', abajo: '1 m² = 100 dm²', nombre: 'cuadros de 1 dm' },
      { lado: 1, celdas: 10, arriba: '1 dm = 10 cm', abajo: '1 dm² = 100 cm²', nombre: 'un dm², en cm' }] },
    { cubo: { n: 10, arriba: '1 dm = 10 cm', abajo: '1 dm³ = 1000 cm³ = 1 L', nombre: 'cubitos de 1 cm' } },
  ];
  // Datos creíbles: chacras de la sierra en hectáreas, tanques de agua de los techos, botellas.
  const CHACRAS = [0.5, 1.5, 2, 2.5, 3];
  const TANQUES = [600, 1100, 2500];
  const BOTELLAS = [250, 500, 625, 750];
  const areas = {
    id: 'areas-volumenes',
    titulo: 'Áreas y volúmenes',
    pregunta: '¿Por qué un metro cuadrado no son 100 centímetros cuadrados?',
    temas: ['Conversión de unidades'],
    pieza: 'fis-area',
    lee: {
      tarjetas: [
        { titulo: 'Área: cuántos cuadros caben', texto: 'El área de un piso dice cuántos cuadros de una medida caben en él. Un metro cuadrado, m², es un cuadro de 1 m de lado.' },
        { titulo: 'Volumen: cuántos cubos caben', texto: 'El volumen dice cuántos cubos de una medida caben dentro, por ejemplo cubitos de 1 cm de lado. Un litro es lo que cabe en un cubo de 10 cm de lado.' },
        { titulo: 'Medidas de terrenos', texto: 'En el campo, las chacras se miden en hectáreas. Una hectárea es un cuadrado de 100 m de lado.' },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a cubrir el mismo piso con cuadros de 1 m y con cuadros de 1 dm, que miden 10 cm de lado. Compara los dos números.' },
      ],
    },
    aprendizaje: 'De m² a dm², el número se multiplica por 100 y no por 10: el factor 10 entra una vez por cada lado.',
    juega: {
      consigna: 'El piso de un cuarto cuadrado, cubierto dos veces: con cuadros de 1 m y con cuadros de 1 dm.',
      mision: {
        texto: 'Cambia el lado hasta que el piso tenga 625 cuadros de 1 dm.',
        logrado: val => Math.abs(val.L - 2.5) < 1e-9,
        bien: 'Listo: 625 dm². Son 6,25 m²: cada metro cuadrado guarda 100 decímetros cuadrados.',
      },
      voz: '¿Cuántos cuadros de 1 dm caben en uno de 1 m?',
      leyenda: [
        { s: Ar, t: 'el área del piso' },
        { s: 'm²', t: 'metro cuadrado: cuadro de 1 m de lado' },
        { s: 'dm²', t: 'decímetro cuadrado: cuadro de 10 cm de lado' },
      ],
      controles: [
        { id: 'L', etiqueta: 'Lado del piso', color: 'c-o', min: 1, max: 3, paso: 0.5, inicio: 2, unidad: 'm', decimales: 1 },
      ],
      dibujo: val => pisoDoble(val.L),
      lectura: val => [Ar, ` = ${f(val.L * val.L, 2)} m² = ${f(val.L * val.L * 100, 0)} dm²`],
      minimo: 3,
    },
    predice: {
      pregunta: '¿Cuántos cuadraditos de 1 cm de lado caben en 1 m²?',
      opciones: [
        { id: 'c', texto: '10 000', correcta: true },
        { id: 'fila', texto: '100', error: 'CONV-CUADRADO', siFuera: 'Esos caben en una sola fila: 1 m tiene 100 cm. Pero hay 100 filas.' },
        { id: 'mil', texto: '1000', error: 'CONV-CUADRADO', siFuera: 'Mil serían 10 filas de 100. En 1 m hay 100 filas, no 10.' },
        { id: 'millon', texto: '1 000 000', error: 'CONV-CUBO', siFuera: 'Un millón es lo que cabe en un metro cúbico: ahí el factor va tres veces.' },
      ],
      dibujo: { datos: { cuadros: [{ lado: 1, celdas: 1, arriba: '1 m', abajo: '1 m²', nombre: 'un cuadro de 1 m de lado' }] }, estado: {} },
      revelar: { datos: VISTAS_AREA[1], estado: {} },
      coincide: 'Coincide: 100 filas de 100 cuadraditos son 10 000 cm².',
    },
    mira: {
      datos: { color: 'o', vistas: VISTAS_AREA },
      pasos: [
        { estado: { vista: 0 }, texto: 'Un metro tiene 10 dm: en una fila caben 10 cuadros de 1 dm.', ecuacion: ['1 m = 10 dm'] },
        { estado: { vista: 0 }, texto: 'Son 10 filas de 10: el factor 10 entra dos veces.', ecuacion: ['1 m² = 10 dm × 10 dm = 100 dm²'] },
        { estado: { vista: 1 }, texto: 'Cada dm² tiene 100 cm²: 100 veces 100.', ecuacion: ['1 m² = 100 × 100 cm² = 10 000 cm²'] },
        { estado: { vista: 2 }, texto: 'En un volumen el factor entra tres veces: largo, ancho y alto.', ecuacion: ['1 dm³ = 10 × 10 × 10 cm³ = 1000 cm³'] },
        { estado: { vista: 2 }, texto: 'Un cubo de 10 cm de lado guarda justo un litro.', ecuacion: ['1 dm³ = 1 L = 1000 cm³'] },
        { estado: { vista: 2 }, texto: 'Un metro cúbico son 10 por 10 por 10 de esos cubos: 1000 litros.', ecuacion: ['1 m³ = (10 dm)³ = 1000 dm³ = 1000 L'] },
      ],
    },
    regla: {
      texto: 'En un área el factor va al cuadrado; en un volumen, al cubo. De unidad grande a chica se multiplica; de chica a grande, se divide.',
      ecuacion: ['1 m² = (100 cm)² = 10 000 cm²', '   ·   ', '1 m³ = (10 dm)³ = 1000 dm³ = 1000 L'],
      condicion: 'se cambia de unidad dentro de una misma magnitud: un área no se pasa a volumen, ni un largo a área.',
    },
    resuelve: {
      pieza: 'fis-area',
      generar(s) {
        const r = azar(s + 900), tipo = s % 4;
        if (tipo === 0) {
          const ha = r.de(CHACRAS);
          return {
            enunciado: `Una chacra en Puno mide ${f(ha, 1)} hectáreas. ¿Cuántos m² son?`,
            dibujo: { datos: { cuadros: [{ lado: 100, celdas: 0.1, arriba: '100 m', abajo: '1 ha = 10 000 m²', nombre: 'cada cuadro: 10 m × 10 m = 100 m²' }] }, estado: {} },
            pasos: [
              { tipo: 'pide', texto: 'Piden la misma área en metros cuadrados.' },
              { tipo: 'datos', texto: `La chacra mide ${f(ha, 1)} ha.` },
              { tipo: 'regla', texto: 'Una hectárea es un cuadrado de 100 m de lado: 100 por 100 metros cuadrados.', ecuacion: ['1 ha = 100 m × 100 m = 10 000 m²'] },
              { tipo: 'cuentas', texto: 'Se multiplica por 10 000.', ecuacion: [`${f(ha, 1)} × 10 000 = ${f(ha * 10000, 0)} m²`] },
              { tipo: 'sentido', texto: 'El m² es mucho más chico que la hectárea: el número tenía que subir, y subió mucho.' },
            ],
            respuesta: `${f(ha * 10000, 0)} m²`,
          };
        }
        if (tipo === 1) {
          const m2 = r.de([1.5, 2, 2.4, 3]);
          return {
            enunciado: `Una pizarra tiene ${f(m2, 1)} m² de área. ¿Cuántos cm² son?`,
            pasos: [
              { tipo: 'pide', texto: 'Piden la misma área en centímetros cuadrados.' },
              { tipo: 'datos', texto: `La pizarra tiene ${f(m2, 1)} m².` },
              { tipo: 'regla', texto: 'En un área el factor va al cuadrado: 100 cm por 100 cm.', ecuacion: ['1 m² = (100 cm)² = 10 000 cm²'] },
              { tipo: 'cuentas', texto: 'Se multiplica por 10 000, no por 100.', ecuacion: [`${f(m2, 1)} × 10 000 = ${f(m2 * 10000, 0)} cm²`] },
              { tipo: 'sentido', texto: 'Un cm² es una uña de chico: en una pizarra caben muchísimos.' },
            ],
            respuesta: `${f(m2 * 10000, 0)} cm²`,
          };
        }
        if (tipo === 2) {
          const L = r.de(TANQUES);
          return {
            enunciado: `Un tanque de agua del techo guarda ${f(L, 0)} L. ¿Cuántos m³ son?`,
            dibujo: { datos: VISTAS_AREA[2], estado: {} },
            pasos: [
              { tipo: 'pide', texto: 'Piden el mismo volumen en metros cúbicos.' },
              { tipo: 'datos', texto: `El tanque guarda ${f(L, 0)} litros.` },
              { tipo: 'regla', texto: 'Un m³ es un cubo de 10 dm de lado, y cada dm³ es un litro.', ecuacion: ['1 m³ = (10 dm)³ = 1000 dm³ = 1000 L'] },
              { tipo: 'cuentas', texto: 'Se divide entre 1000.', ecuacion: [`${f(L, 0)} ÷ 1000 = ${f(L / 1000, 2)} m³`] },
              { tipo: 'sentido', texto: 'Un m³ es un cubo de 1 m de lado: un tanque cabe en uno o en pocos de esos.' },
            ],
            respuesta: `${f(L / 1000, 2)} m³`,
          };
        }
        const cm3 = r.de(BOTELLAS);
        return {
          enunciado: `Una botella tiene ${f(cm3, 0)} cm³ de gaseosa. ¿Cuántos litros son?`,
          pasos: [
            { tipo: 'pide', texto: 'Piden el mismo volumen en litros.' },
            { tipo: 'datos', texto: `La botella tiene ${f(cm3, 0)} cm³.` },
            { tipo: 'regla', texto: 'Un litro es un cubo de 10 cm de lado: 10 por 10 por 10 cm³.', ecuacion: ['1 L = 1 dm³ = 1000 cm³'] },
            { tipo: 'cuentas', texto: 'Se divide entre 1000.', ecuacion: [`${f(cm3, 0)} ÷ 1000 = ${f(cm3 / 1000, 3)} L`] },
            { tipo: 'sentido', texto: 'Una botella personal tiene menos de un litro: tiene sentido.' },
          ],
          respuesta: `${f(cm3 / 1000, 3)} L`,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        // Otro tipo que el del ejemplo resuelto con la misma semilla (lector en frío, 16 nov: «es casi el mismo problema»).
        const r = azar(s), tipo = (s + 2) % 4;
        if (tipo === 0) {
          const ha = r.de(CHACRAS);
          return {
            pregunta: `Una chacra mide ${f(ha, 1)} hectáreas. ¿Cuántos m² son? (1 ha es un cuadrado de 100 m de lado)`,
            opciones: opciones(ha * 10000, [
              { id: 'cien', valor: ha * 100, error: 'CONV-CUADRADO', siFuera: 'Por 100 es un solo lado; la hectárea es 100 m por 100 m.' },
              { id: 'mil', valor: ha * 1000, error: 'CONV-CUADRADO', siFuera: 'Mil no sale de ningún lado: son 100 × 100 = 10 000.' },
              { id: 'inverso', valor: ha / 10000, error: 'CONV-INVERSO', siFuera: 'Dividir achica el número; el m² es más chico que la hectárea.' },
            ], x => `${f(x, 4)} m²`),
            solucion: { texto: 'Una hectárea son 100 m × 100 m.', ecuacion: [`${f(ha, 1)} × 10 000 = ${f(ha * 10000, 0)} m²`] },
          };
        }
        if (tipo === 1) {
          const m2 = r.de([1.5, 2, 2.4, 3]);
          return {
            pregunta: `Una pizarra tiene ${f(m2, 1)} m². ¿Cuántos cm² son?`,
            opciones: opciones(m2 * 10000, [
              { id: 'cien', valor: m2 * 100, error: 'CONV-CUADRADO', siFuera: 'Por 100 pasa un largo a cm; un área lleva el factor al cuadrado.' },
              { id: 'millon', valor: m2 * 1e6, error: 'CONV-CUBO', siFuera: 'Un millón es para m³; en un área el factor va dos veces.' },
              { id: 'inverso', valor: m2 / 10000, error: 'CONV-INVERSO', siFuera: 'Dividir achica el número; el cm² es más chico, el número sube.' },
            ], x => `${f(x, 4)} cm²`),
            solucion: { texto: 'El factor va al cuadrado: 100 × 100.', ecuacion: [`${f(m2, 1)} × 10 000 = ${f(m2 * 10000, 0)} cm²`] },
          };
        }
        if (tipo === 2) {
          const L = r.de(TANQUES);
          return {
            pregunta: `Un tanque de agua guarda ${f(L, 0)} L. ¿Cuántos m³ son?`,
            opciones: opciones(L / 1000, [
              { id: 'por', valor: L * 1000, error: 'CONV-INVERSO', siFuera: 'Multiplicar agranda el número; el m³ es mucho más grande que el litro.' },
              { id: 'cien', valor: L / 100, error: 'CONV-CUADRADO', siFuera: 'Entre 100 sería si 1 m³ fueran 100 L; son 10 × 10 × 10 = 1000.' },
              { id: 'diez', valor: L / 10, error: 'CONV-UNO', siFuera: 'Entre 10 cambia un largo; un volumen lleva el factor tres veces.' },
            ], x => `${f(x, 3)} m³`),
            solucion: { texto: '1 m³ = 1000 L.', ecuacion: [`${f(L, 0)} ÷ 1000 = ${f(L / 1000, 2)} m³`] },
          };
        }
        const cm3 = r.de(BOTELLAS);
        return {
          pregunta: `Una botella tiene ${f(cm3, 0)} cm³. ¿Cuántos litros son?`,
          opciones: opciones(cm3 / 1000, [
            { id: 'cien', valor: cm3 / 100, error: 'CONV-CUADRADO', siFuera: 'Entre 100 sería si un litro fueran 100 cm³; son 1000.' },
            { id: 'por', valor: cm3 * 1000, error: 'CONV-INVERSO', siFuera: 'Multiplicar agranda el número; el litro es más grande que el cm³.' },
            { id: 'diez', valor: cm3 / 10, error: 'CONV-UNO', siFuera: 'Entre 10 cambia un largo; un volumen lleva el factor tres veces.' },
          ], x => `${f(x, 3)} L`),
          solucion: { texto: '1 L = 1000 cm³.', ecuacion: [`${f(cm3, 0)} ÷ 1000 = ${f(cm3 / 1000, 3)} L`] },
        };
      },
    },
  };

  // ---------- Idea 3: los dos lados de una fórmula tienen la misma dimensión ----------
  // Rehecha el 16 nov contra el contrato «se entiende sin profesor» (docs/plan-calidad.md): Gerson no entendió las
  // «fichas huecas que dividen» ni la lectura «L⁻² T⁻¹: sin nombre en el SI». Ahora es una balanza (pieza
  // fis-balanza-dim): a cada lado, de qué está hecho ese lado de una fórmula real, escrito en letras.
  // Cambia: la fórmula que se prueba · Permanece: la distancia d a la izquierda (L) ·
  // Progresa: cuáles cuadran · Se reserva: despejar la dimensión de una constante k · Debe verse: se opera como con letras.
  const DIM = { L: [0, 1, 0], T: [0, 0, 1], M: [1, 0, 0], v: [0, 1, -1], a: [0, 1, -2], F: [1, 1, -2], E: [1, 2, -2], P: [1, 2, -3], p: [1, -1, -2], area: [0, 2, 0] };
  const SUPS = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const dimTxt = e => {
    const ps = ['M', 'L', 'T'].map((x, i) => (e[i] ? (e[i] === 1 ? x : x + String(e[i]).split('').map(c => SUPS[c]).join('')) : '')).filter(Boolean);
    return ps.length ? ps.join(' ') : '1';
  };
  const suma = (a, b, n = 1) => a.map((x, i) => x + n * b[i]);
  // Fórmulas que alguien propone para la distancia d de una combi: la balanza dice cuáles pueden estar bien.
  const FORMULAS = {
    'v/t': { der: 'v / t', exps: [0, 1, -2], cuenta: 'L T⁻¹ ÷ T = L T⁻²' },
    'vt': { der: 'v · t', exps: [0, 1, 0], cuenta: 'L T⁻¹ × T = L' },
    'vt2': { der: 'v · t²', exps: [0, 1, 1], cuenta: 'L T⁻¹ × T² = L T' },
    'at': { der: 'a · t', exps: [0, 1, -1], cuenta: 'L T⁻² × T = L T⁻¹' },
    'at2': { der: '½ a · t²', exps: [0, 1, 0], cuenta: 'L T⁻² × T² = L' },
  };
  const balanzaD = f => ({ datos: { izq: { nombre: 'd', exps: DIM.L }, der: { nombre: FORMULAS[f].der, exps: FORMULAS[f].exps } }, estado: {} });
  const VISTAS_K = [
    { izq: { nombre: 'x', exps: DIM.L }, der: { nombre: 'k · t²', oculta: true } },
    { izq: { nombre: 'x', exps: DIM.L }, der: { nombre: 'k · t²', oculta: true } },
    { izq: { nombre: 'x', exps: DIM.L }, der: { nombre: 'k · t²', exps: DIM.L } },
  ];
  const dimensiones = {
    id: 'homogeneidad',
    titulo: 'Las dimensiones deben cuadrar',
    pregunta: '¿Cómo sabes si una fórmula de física puede estar bien escrita?',
    temas: ['Análisis dimensional', 'Magnitudes fundamentales y derivadas'],
    pieza: 'fis-balanza-dim',
    lee: {
      tarjetas: [
        { titulo: 'Las letras de base', texto: 'Las magnitudes fundamentales, como la masa (M), la longitud (L) y el tiempo (T), son las letras con que se arman todas las demás.' },
        { titulo: 'De qué está hecha una magnitud', texto: 'La rapidez es una magnitud derivada: una longitud entre un tiempo. Su dimensión es L T⁻¹, se mida en m/s o en km/h.' },
        { titulo: 'Letras que se operan', texto: 'Las dimensiones se multiplican y se dividen como letras: L entre T es L T⁻¹, y T por T es T². Un número como ½ no tiene dimensión.' },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a hacer análisis dimensional: poner fórmulas de una distancia en una balanza y mirar cuándo queda derecha.' },
      ],
    },
    aprendizaje: 'Una fórmula solo puede estar bien si sus dos lados tienen la misma dimensión; las dimensiones se multiplican y dividen como letras.',
    juega: {
      consigna: 'Alguien anota fórmulas para la distancia d que recorre una combi. La balanza compara de qué está hecho cada lado.',
      mision: {
        texto: 'Encuentra la fórmula con aceleración que deja la balanza derecha.',
        logrado: val => val.f === 'at2',
        bien: 'Esa es: ½ a t² es una longitud, como d. El ½ no tiene dimensión.',
      },
      voz: '¿Qué fórmulas dejan la balanza derecha?',
      leyenda: [
        { s: 'd', t: 'distancia: L' }, { s: 'v', t: 'rapidez: L T⁻¹' }, { s: 'a', t: 'aceleración: L T⁻²' }, { s: 't', t: 'tiempo: T' },
        { s: 'L', t: 'una longitud (metros)' }, { s: 'T', t: 'un tiempo (segundos)' }, { s: 'T⁻¹', t: '«entre un tiempo»: por segundo' },
        { s: '[ ]', t: '«la dimensión de»: [d] = L' },
      ],
      controles: [
        { id: 'f', etiqueta: 'Fórmula', opciones: [
          { valor: 'v/t', texto: 'd = v / t' }, { valor: 'vt', texto: 'd = v · t' }, { valor: 'vt2', texto: 'd = v · t²' },
          { valor: 'at', texto: 'd = a · t' }, { valor: 'at2', texto: 'd = ½ a · t²' },
        ] },
      ],
      dibujo: val => balanzaD(val.f),
      lectura: val => [`[${FORMULAS[val.f].der}] = ${FORMULAS[val.f].cuenta}`],
      minimo: 3,
    },
    predice: {
      pregunta: ['En la fórmula x = ', k, ' · t², x es una distancia y t un tiempo. ¿Qué dimensión debe tener ', k, '?'],
      opciones: [
        { id: 'c', texto: 'L T⁻², como una aceleración', correcta: true },
        { id: 'igual', texto: 'L, igual que x', error: 'DIM-TERMINO', siFuera: 'L es lo que debe tener todo el lado k · t², no k sola: falta quitar el T².' },
        { id: 'inv', texto: 'L T², por el t²', error: 'DIM-INVERSA', siFuera: 'Sería cierto si x = k / t². Aquí k multiplica: debe quitar el T².' },
        { id: 'unidad', texto: 'Ninguna: k es solo un número', error: 'DIM-UNIDAD', siFuera: 'Si k fuera solo un número, el lado derecho sería T², un tiempo al cuadrado, y no una distancia.' },
      ],
      dibujo: { datos: VISTAS_K[0], estado: {} },
      revelar: { datos: VISTAS_K[2], estado: {} },
      coincide: 'Coincide: k = L T⁻² quita las dos T de t², y el lado derecho queda L.',
    },
    mira: {
      datos: { vistas: VISTAS_K },
      pasos: [
        { estado: { vista: 0 }, texto: 'A la izquierda, x es una distancia: su dimensión es L.', ecuacion: ['[x] = L'] },
        { estado: { vista: 0 }, texto: 't² es un tiempo por otro tiempo.', ecuacion: ['[t²] = T × T = T²'] },
        { estado: { vista: 1 }, texto: 'Para que quede L, k debe traer L y quitar T²: dividir entre T².', ecuacion: ['[', k, '] = L ÷ T² = L T⁻²'] },
        { estado: { vista: 2 }, texto: 'Con eso, la balanza queda derecha.', ecuacion: ['[', k, ' · t²] = L T⁻² × T² = L = [x]'] },
        { estado: { vista: 2 }, texto: 'L T⁻² es una aceleración: k puede ser algo como ½ a.', ecuacion: ['x = ½ a t²'] },
      ],
    },
    regla: {
      texto: 'En una fórmula de física, los dos lados tienen la misma dimensión, como una balanza derecha. Las dimensiones se multiplican y se dividen como letras.',
      ecuacion: ['[v · t] = L T⁻¹ × T = L = [d]'],
      condicion: 'cada término se escribe con M, L y T. Ojo: cuadrar no prueba la fórmula, porque un ½ no tiene dimensión.',
    },
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        const Q = r.de([['F', 'una fuerza', 'masa por aceleración'], ['E', 'una energía', 'fuerza por distancia'], ['P', 'una potencia', 'energía entre tiempo'], ['p', 'una presión', 'fuerza entre área']]);
        const F = r.de([['v', 'una rapidez', 'v'], ['a', 'una aceleración', 'a'], ['area', 'un área', 'S'], ['L', 'una longitud', 'x'], ['T', 'un tiempo', 't']]);
        const n = (s % 2) + 1, kd = suma(DIM[Q[0]], DIM[F[0]], -n), letra = Q[0];
        const pot = n === 2 ? `${F[2]}²` : F[2], dp = DIM[F[0]].map(x => x * n);
        const bal = conK => ({ datos: { izq: { nombre: letra, exps: DIM[Q[0]] }, der: conK ? { nombre: `k · ${pot}`, exps: DIM[Q[0]] } : { nombre: `k · ${pot}`, oculta: true } }, estado: {} });
        return {
          enunciado: ['En ', `${letra} = `, k, ` · ${pot}`, `, ${letra} es ${Q[1]} y ${F[2]} es ${F[1]}. ¿Qué dimensión tiene `, k, '?'],
          dibujo: bal(false),
          pasos: [
            { tipo: 'pide', texto: ['Piden de qué está hecha ', k, ': su dimensión.'] },
            { tipo: 'datos', texto: `${letra} es ${Q[1]}: ${Q[2]}. ${pot} trae su dimensión ${n === 2 ? 'dos veces' : 'una vez'}.`, ecuacion: [`[${letra}] = ${dimTxt(DIM[Q[0]])}`, '  y  ', `[${pot}] = ${dimTxt(dp)}`] },
            { tipo: 'regla', texto: 'Los dos lados deben tener la misma dimensión. Para despejar, se divide.', ecuacion: ['[', k, `] = [${letra}] ÷ [${pot}]`] },
            { tipo: 'cuentas', texto: 'Se dividen las letras: se restan los exponentes, y lo que queda con 0 desaparece.', ecuacion: ['[', k, `] = ${dimTxt(DIM[Q[0]])} ÷ ${dimTxt(dp)} = ${dimTxt(kd)}`], dibujo: bal(true) },
            { tipo: 'sentido', texto: ['Comprueba: ', k, ` por ${pot} debe dar ${dimTxt(DIM[Q[0]])}. Da.`], ecuacion: [`${dimTxt(kd)} × ${dimTxt(dp)} = ${dimTxt(DIM[Q[0]])}`] },
          ],
          respuesta: ['[', k, `] = ${dimTxt(kd)}`],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        const Q = r.de([['F', 'una fuerza'], ['E', 'una energía'], ['P', 'una potencia'], ['p', 'una presión']]);
        const F = r.de([['v', 'una rapidez', 'v'], ['a', 'una aceleración', 'a'], ['area', 'un área', 'S'], ['L', 'una longitud', 'x'], ['T', 'un tiempo', 't']]);
        const n = (s % 2) + 1, kd = suma(DIM[Q[0]], DIM[F[0]], -n);
        const letra = Q[0];
        const pot = n === 2 ? `${F[2]}²` : F[2];
        const dp = DIM[F[0]].map(x => x * n);
        return {
          pregunta: ['En ', `${letra} = `, k, ` · ${pot}`, `, ${letra} es ${Q[1]} y ${F[2]} es ${F[1]}. ¿Qué dimensión tiene `, k, '?'],
          dibujo: { datos: { izq: { nombre: letra, exps: DIM[Q[0]] }, der: { nombre: `k · ${pot}`, oculta: true } }, estado: {} },
          opciones: opciones(dimTxt(kd), [
            { id: 'inv', valor: dimTxt(suma(DIM[Q[0]], DIM[F[0]], n)), error: 'DIM-INVERSA', siFuera: `Eso multiplica por ${pot}; para despejar k se divide.` },
            { id: 'igual', valor: dimTxt(DIM[Q[0]]), error: 'DIM-TERMINO', siFuera: `Esa es la dimensión de ${letra}; k es solo una parte del lado derecho.` },
            { id: 'solo', valor: dimTxt(DIM[F[0]].map(x => -x * n)), error: 'DIM-INVERSA', siFuera: `Eso quita ${pot}, pero olvida lo que trae ${letra}.` },
            { id: 'pot1', valor: dimTxt(suma(DIM[Q[0]], DIM[F[0]], -(3 - n))), error: 'DIM-EXPONENTE', siFuera: `Revisa el exponente: ${pot} trae su dimensión ${n === 2 ? 'dos veces' : 'una vez'}.` },
          ], x => x),
          solucion: {
            texto: `Se divide la dimensión de ${letra} entre la de ${pot}.`,
            ecuacion: ['[', k, `] = ${dimTxt(DIM[Q[0]])} ÷ ${dimTxt(dp)} = ${dimTxt(kd)}`],
            dibujo: { datos: { izq: { nombre: letra, exps: DIM[Q[0]] }, der: { nombre: `k · ${pot}`, exps: DIM[Q[0]] } }, estado: {} },
          },
        };
      },
    },
  };

  return {
    unidad: 'fisica.magnitudes-y-vectores',
    // Desde el 16 nov es «Magnitudes y unidades» (Gerson eligió partir la unidad); los vectores van en fisica/vectores.js.
    // El id no cambia: el avance de los alumnos se guarda con él.
    version: '0.4.0',
    estado: 'completa',
    // Pasó por el contrato «se entiende sin profesor» (16 nov): el validador exige misión, leyenda, aprendizaje, pregunta
    // y 3 ejemplos por término del glosario.
    calidad: 2,
    requiere: ['/nucleo/kit/piezas/recta.js', '/nucleo/kit/piezas/fis-medida.js', '/nucleo/kit/piezas/fis-combi.js', '/nucleo/kit/piezas/fis-area.js', '/nucleo/kit/piezas/fis-balanza-dim.js'],
    // Glosario del tema (docs/teoria.md, 4d): las palabras que esta unidad estrena en el curso (es la primera).
    glosario: [
      { termino: 'factor de conversión', formas: ['factor de conversión', 'factores de conversión', 'factor', 'factores'],
        def: 'Fracción que vale 1 y cambia la unidad: arriba y abajo dice lo mismo, como 100 cm sobre 1 m.',
        ejemplos: ['De m a cm: 100 cm sobre 1 m.', 'De horas a segundos: 3600 s sobre 1 h.', 'De m² a cm²: el de m a cm, al cuadrado, 10 000.'], ver: ['magnitud'] },
      { termino: 'área', formas: ['área', 'áreas'], def: 'Cuánta superficie ocupa algo: cuántos cuadros de una medida caben en él.',
        ejemplos: ['El piso de un aula de 7 m por 8 m: 56 m².', 'Una cancha de fútbol: unos 7000 m².', 'Una hoja A4: unos 620 cm².'], ver: ['volumen', 'hectárea'] },
      { termino: 'volumen', formas: ['volumen', 'volúmenes'], def: 'Cuánto espacio ocupa algo: cuántos cubos de una medida caben dentro.',
        ejemplos: ['Un tanque de agua del techo: 1100 L, que es 1,1 m³.', 'Una botella personal: 500 cm³, medio litro.', 'Un cubo de 1 m de lado: 1 m³, que son 1000 L.'], ver: ['área', 'litro'] },
      { termino: 'hectárea', simbolo: 'ha', formas: ['hectárea', 'hectáreas'], def: 'Medida de terrenos: un cuadrado de 100 m de lado, o sea 10 000 m².',
        ejemplos: ['Una chacra de 2 ha mide 20 000 m².', 'Una cancha de fútbol ocupa unas tres cuartas partes de una hectárea.', 'Media hectárea son 5000 m².'], ver: ['área'] },
      { termino: 'litro', simbolo: 'L', formas: ['litro', 'litros'], def: 'Medida de volumen: lo que cabe en un cubo de 10 cm de lado, 1 dm³.',
        ejemplos: ['Una botella grande de gaseosa: 3 L.', 'Un balde: unos 10 L.', '1000 L llenan un cubo de 1 m de lado.'], ver: ['volumen'] },
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
    ideas: [unidades, areas, dimensiones],
  };
});
