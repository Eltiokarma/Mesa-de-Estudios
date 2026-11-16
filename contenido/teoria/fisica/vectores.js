/*
 * Teoría de «Vectores» (fisica.vectores), unidad nueva del 16 nov: sale de «Magnitudes y vectores», que Gerson eligió
 * partir en dos. Molde de docs/teoria.md. Ideas, mesas y glosario movidos tal cual desde magnitudes-y-vectores.js; el
 * vector unitario y las componentes van antes de sumar. Pendiente (docs/plan-calidad.md, etapa 1): la idea «escalar o
 * vector» y pasar cada idea por el contrato «se entiende sin profesor».
 * Colores (regla 4), los mismos en control, figura, texto y ecuación:
 *   A naranja (c-o), B turquesa (c-i), la resultante R y el unitario û verde (c-d), el ángulo θ rojo (c-h).
 * Códigos de error nuevos (hipótesis, sin dato empírico propio; matriz: «sumar módulos ignorando el ángulo»,
 * «aplicar el producto escalar donde se pide el vectorial»):
 *   V-SUMA suma módulos · V-RESTA resta módulos · V-PITAGORAS usa Pitágoras sin ángulo recto · V-COS signo del coseno
 *   U-SUMA divide entre la suma de componentes · U-CAMBIO cruza componentes · U-UNOS toma î + ĵ como unitario
 *   PE-MODULOS producto sin ángulo · PE-VECTOR confunde escalar con vectorial · PE-ORDEN orden del producto cruz
 *   ESC-IGUAL mismo número, mismo lugar · ESC-NADA cree que no se sabe ni la distancia · ESC-OPUESTO siempre opuestos
 *   ESC-SINRUMBO ignora el «hacia dónde» · ESC-UNIDAD cree que la unidad decide · ESC-SUBEBAJA toma subir o bajar por
 *   dirección · ESC-DISTANCIA da la distancia recorrida por desplazamiento · ESC-SENTIDO invierte el sentido ·
 *   ESC-ULTIMO toma solo el último tramo · ESC-MOVIMIENTO cree que moverse vuelve vector a la distancia ·
 *   ESC-PESO confunde masa con peso · ESC-TIEMPO cree que el tiempo apunta
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

  // ---------- Idea 1: ¿basta un número? Escalar o vector (16 nov, contrato «se entiende sin profesor») ----------
  // Pieza fis-dron: un dron sale de la plaza y vuela en línea recta. Cambia: cuánto vuela y hacia dónde · Permanece:
  // la plaza y los lugares del mapa · Progresa: el círculo punteado de los puntos a la misma distancia pasa por el
  // colegio y por el mercado · Se reserva: el nombre «vector» hasta «Mira» · Debe verse: mismo número, otro lugar.
  const DR = () => Kit.piezas['fis-dron'];
  const LUGARES = [
    { nombre: 'Colegio', largo: 300, rumbo: 'NE' },
    { nombre: 'Mercado', largo: 300, rumbo: 'NO' },
    { nombre: 'Paradero', largo: 150, rumbo: 'S' },
  ];
  const RUMBO_TXT = { E: 'Este', NE: 'Noreste', N: 'Norte', NO: 'Noroeste', O: 'Oeste', SO: 'Suroeste', S: 'Sur', SE: 'Sureste' };
  const RUMBO_DE = { 0: 'E', 45: 'NE', 90: 'N', 135: 'NO', 180: 'O', 225: 'SO', 270: 'S', 315: 'SE' };
  const hacia = r => `hacia el ${RUMBO_TXT[r].toLowerCase()}`;
  const vuelo = (largo, rumbo, o = {}) => ({ datos: { lugares: LUGARES, drones: [{ largo, rumbo, valor: `${f(largo, 0)} m` }],
    circulo: o.circulo === false ? null : largo, textoCirculo: o.circulo === false ? '' : `Todos a ${f(largo, 0)} m de la plaza` }, estado: {} });
  const VISTAS_V = [
    { lugares: LUGARES, drones: [{ largo: 300, rumbo: 'NE', valor: '300 m' }] },
    { lugares: LUGARES, drones: [{ largo: 300, rumbo: 'NE', valor: '300 m' }, { largo: 300, rumbo: 'NO', valor: '300 m', color: 'i' }] },
    { lugares: LUGARES, circulo: 300, textoCirculo: 'Con solo «300 m»: cualquiera de estos puntos' },
    { lugares: LUGARES, drones: [{ largo: 300, rumbo: 'NO', valor: '300 m', color: 'i' }], circulo: 300, textoCirculo: '«300 m hacia el noroeste»: un solo punto' },
  ];
  // Magnitudes para clasificar. El enunciado no dice «hacia dónde» (lector en frío, 16 nov: con «hacia Puno» en el texto
  // se contestaba por la palabra); las escalares traen la trampa que hace pensar que apuntan (bajar, ser negativa…).
  const DATOS_EV = [
    { q: 'Una combi va a 40 km/h. ¿Qué clase de magnitud es su velocidad?', es: 'v', mag: 'la velocidad' },
    { q: 'Empujas una puerta con 20 N. ¿Qué clase de magnitud es esa fuerza?', es: 'v', mag: 'la fuerza' },
    { q: 'Un dron se desplazó 300 m. ¿Qué clase de magnitud es su desplazamiento?', es: 'v', mag: 'el desplazamiento' },
    { q: 'Una piedra cae con 9,8 m/s². ¿Qué clase de magnitud es su aceleración?', es: 'v', mag: 'la aceleración' },
    { q: 'En la noche, la temperatura baja a −8 °C. ¿Qué clase de magnitud es la temperatura?', es: 'e', mag: 'la temperatura',
      trampa: { id: 'baja', texto: 'Vectorial: baja y hasta es negativa', error: 'ESC-SUBEBAJA', siFuera: 'Bajar es cambiar de valor, y el signo de −8 °C no apunta a ningún lado.' },
      nota: 'Bajar o ser negativa no es apuntar hacia un lado: sigue siendo escalar.' },
    { q: 'Un ciclista recorre 700 m entre ida y vuelta. ¿Qué clase de magnitud es la distancia recorrida?', es: 'e', mag: 'la distancia recorrida',
      trampa: { id: 'mueve', texto: 'Vectorial: el ciclista se movió', error: 'ESC-MOVIMIENTO', siFuera: 'Se movió, pero la distancia suma todo el camino sin mirar hacia dónde. La flecha es el desplazamiento.' },
      nota: 'Suma todo el camino sin mirar hacia dónde: es escalar. La flecha sería el desplazamiento.' },
    { q: 'Un saco de quinua tiene 50 kg. ¿Qué clase de magnitud es su masa?', es: 'e', mag: 'la masa',
      trampa: { id: 'cae', texto: 'Vectorial: si lo sueltas, cae', error: 'ESC-PESO', siFuera: 'Lo que tira hacia abajo es el peso, una fuerza. La masa solo dice cuánta materia hay.' },
      nota: 'Lo que tira hacia abajo es el peso, una fuerza; la masa no apunta.' },
    { q: 'El viaje a Puno dura 45 min. ¿Qué clase de magnitud es el tiempo?', es: 'e', mag: 'el tiempo',
      trampa: { id: 'avanza', texto: 'Vectorial: el tiempo avanza', error: 'ESC-TIEMPO', siFuera: 'Que el tiempo pase no es apuntar en el espacio: 45 min no tiene rumbo.' },
      nota: 'Que el tiempo pase no es apuntar hacia un lado: es escalar.' },
  ];
  const QUIEN_EV = ['Un ciclista', 'Una vicuña', 'Una alumna', 'Un perro'];
  const escalarOVector = {
    id: 'escalar-vector',
    titulo: '¿Basta un número?',
    pregunta: '¿Basta con decir «300 m» para saber dónde aterrizó un dron?',
    temas: ['Escalares y vectores'],
    pieza: 'fis-dron',
    lee: {
      tarjetas: [
        { titulo: 'Datos con número y unidad', texto: 'Muchos datos se dicen con un número y su unidad: una masa de 50 kg, una clase de 45 min. Con otros, como un vuelo de 300 m, vale la pena preguntarse si basta con el número.' },
        { titulo: 'El rumbo', texto: 'En un mapa, el rumbo dice hacia dónde se va: norte, sur, este, oeste, o entre dos, como noreste. El norte va arriba.' },
        { titulo: 'Distancia y desplazamiento', texto: 'La distancia recorrida es todo el camino que haces. El desplazamiento solo mira de dónde saliste y a dónde llegaste.' },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a mover un dron que sale de la plaza. Cambia cuánto vuela y hacia dónde, y mira el círculo punteado: ¿por dónde pasa?' },
      ],
    },
    actividad: 'Volar un dron desde la plaza y cambiar cuánto vuela y hacia dónde.',
    aprendizaje: 'Con solo «300 m», el dron puede estar en cualquier punto de un círculo; con el rumbo, en uno solo: eso es un vector.',
    juega: {
      pieza: 'fis-dron',
      consigna: 'Un dron sale de la plaza y vuela en línea recta. Tú decides cuánto vuela y hacia dónde.',
      mision: {
        texto: 'Lleva el dron al mercado.',
        logrado: val => val.largo === 300 && val.rumbo === 'NO',
        bien: 'Llegaste: 300 m hacia el noroeste. Hacia el noreste habrías caído en el colegio.',
      },
      voz: '¿Por qué lugares pasa el círculo punteado?',
      leyenda: [
        { s: 'N', t: 'el norte: arriba en el mapa' },
        { s: '→', t: 'el vuelo, de la plaza al dron' },
        { s: '100 m', t: 'cada cuadro del mapa' },
      ],
      controles: [
        { id: 'largo', etiqueta: 'Cuánto vuela', color: 'c-o', min: 100, max: 400, paso: 50, inicio: 200, unidad: 'm', decimales: 0 },
        { id: 'rumbo', etiqueta: 'Hacia dónde', opciones: ['E', 'NE', 'N', 'NO', 'O', 'SO', 'S', 'SE'].map(r => ({ valor: r, texto: RUMBO_TXT[r] })) },
      ],
      // Gesto directo: el dron se arrastra; el largo se ajusta a 50 m y el rumbo, al más cercano de los ocho.
      arrastres: [
        { id: 'dron', etiqueta: 'el dron', color: 'c-o',
          donde: val => { const p = DR().punto({}, val.largo, val.rumbo); return { x: p[0], y: p[1] }; },
          mover: pt => {
            const c = DR().constantes, dx = pt.x - c.CX, dy = c.CY - pt.y;
            const g = ((Math.round(Math.atan2(dy, dx) * 180 / Math.PI / 45) * 45) % 360 + 360) % 360;
            return { largo: Math.hypot(dx, dy) / c.RPX * 400, rumbo: RUMBO_DE[g] };
          } },
      ],
      dibujo: val => vuelo(val.largo, val.rumbo),
      lectura: val => [`Voló ${f(val.largo, 0)} m ${hacia(val.rumbo)}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Dos drones salen de la plaza y cada uno vuela 300 m en línea recta. ¿Dónde aterrizan?',
      opciones: [
        { id: 'c', texto: 'Depende de hacia dónde vuela cada uno', correcta: true },
        { id: 'igual', texto: 'En el mismo lugar: los dos volaron 300 m', error: 'ESC-IGUAL', siFuera: 'Sería cierto si volaran hacia el mismo lado. 300 m al noreste y 300 m al noroeste terminan lejos.' },
        { id: 'nada', texto: 'No se sabe ni a qué distancia de la plaza quedan', error: 'ESC-NADA', siFuera: 'Eso sí se sabe: los dos quedan a 300 m de la plaza. Lo que falta es el rumbo.' },
        { id: 'opuestos', texto: 'Siempre en lados opuestos de la plaza', error: 'ESC-OPUESTO', siFuera: 'Solo si vuelan en sentidos contrarios; pueden ir hacia cualquier lado.' },
      ],
      dibujo: { datos: { lugares: LUGARES }, estado: {} },
      revelar: { datos: VISTAS_V[1], estado: {} },
      coincide: 'Coincide: los dos quedan a 300 m de la plaza, pero cada uno donde lo llevó su rumbo.',
    },
    mira: {
      datos: { vistas: VISTAS_V },
      pasos: [
        { estado: { vista: 0 }, texto: 'Un dron vuela 300 m hacia el noreste y aterriza en el colegio.' },
        { estado: { vista: 1 }, texto: 'Otro vuela también 300 m, pero hacia el noroeste: llega al mercado.' },
        { estado: { vista: 2 }, texto: 'Con solo «300 m», el dron podría estar en cualquier punto del círculo.' },
        { estado: { vista: 3 }, texto: 'Con «300 m hacia el noroeste» queda un solo punto: eso es un vector.' },
        { estado: { vista: 3 }, texto: 'Su largo es el módulo, 300 m; hacia dónde apunta, su dirección y sentido.' },
        { estado: { vista: 3 }, texto: 'Distancia recorrida: escalar. Desplazamiento, de la salida a la llegada: vector.' },
      ],
    },
    regla: {
      texto: 'Una magnitud escalar queda dicha con un número y su unidad, como 5 kg. Una vectorial necesita además hacia dónde: es una flecha, y su largo es el módulo.',
      condicion: 'el «hacia dónde» puede ser un rumbo o «hacia arriba»; sin él, un dato vectorial queda incompleto.',
    },
    resuelve: {
      generar(s) {
        const r = azar(s + 700);
        if (s % 2 === 0) {
          // La semilla 0, la primera que se ve, es una vectorial sin «hacia dónde» en el texto (lector en frío, ronda 2:
          // solo había visto resuelto el caso escalar y dudaba con el peso).
          const d = DATOS_EV[s === 0 ? 3 : (s / 2 + r.ent(0, 7)) % DATOS_EV.length];
          const v = d.es === 'v';
          return {
            enunciado: d.q,
            pasos: [
              { tipo: 'pide', texto: 'Piden saber si esa magnitud necesita un «hacia dónde» para quedar completa.' },
              { tipo: 'datos', texto: `La magnitud es ${d.mag}. El enunciado no dice hacia dónde: eso no decide.` },
              { tipo: 'regla', texto: 'Escalar: basta un número y su unidad. Vectorial: además, hacia dónde. Se mira la magnitud misma, no si el texto lo escribe.' },
              { tipo: 'aplica', texto: v ? `${d.mag.charAt(0).toUpperCase() + d.mag.slice(1)} siempre va hacia algún lado; si no lo dicen, el dato está incompleto.` : `No tiene sentido preguntar hacia dónde apunta ${d.mag}.` },
              { tipo: 'sentido', texto: v ? 'Se puede dibujar como una flecha: es un vector.' : d.nota },
            ],
            respuesta: v ? 'Vectorial.' : 'Escalar.',
          };
        }
        const a = r.ent(3, 9) * 100, b = r.ent(1, a / 100 - 1) * 100, q = r.de(QUIEN_EV);
        return {
          enunciado: `${q} avanza ${f(a, 0)} m hacia el este y luego regresa ${f(b, 0)} m hacia el oeste. ¿Cuál es su desplazamiento?`,
          dibujo: { datos: { drones: [{ largo: a - b, rumbo: 'E', valor: `${f(a - b, 0)} m` }], max: 900, paso: 300 }, estado: {} },
          pasos: [
            { tipo: 'pide', texto: 'Piden el desplazamiento: la flecha de donde salió a donde terminó.' },
            { tipo: 'datos', texto: `Ida: ${f(a, 0)} m al este. Vuelta: ${f(b, 0)} m al oeste.` },
            { tipo: 'regla', texto: 'El desplazamiento solo mira el inicio y el final; la vuelta deshace parte de la ida.' },
            { tipo: 'cuentas', texto: 'Como van en sentidos contrarios, se restan.', ecuacion: [`${f(a, 0)} m − ${f(b, 0)} m = ${f(a - b, 0)} m`] },
            { tipo: 'sentido', texto: `Es un vector: módulo ${f(a - b, 0)} m, hacia el este. La distancia recorrida, un escalar, suma todo: ${f(a + b, 0)} m.` },
          ],
          respuesta: `${f(a - b, 0)} m hacia el este`,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s + 11);
        if (s % 2 === 0) {
          const d = DATOS_EV[(Math.floor(s / 2) + r.ent(0, 7)) % DATOS_EV.length], v = d.es === 'v';
          const ops = v ? [
            { id: 'c', texto: 'Vectorial: siempre va hacia algún lado', correcta: true },
            { id: 'sin', texto: 'Escalar: el dato no dice hacia dónde', error: 'ESC-SINRUMBO', siFuera: `Que aquí no lo digan no cambia qué es: ${d.mag} siempre va hacia algún lado. El dato está incompleto.` },
            { id: 'unidad', texto: 'Escalar: se dice con número y unidad', error: 'ESC-UNIDAD', siFuera: 'Todo lo que se mide tiene número y unidad. Lo que decide es si además necesita un hacia dónde.' },
          ] : [
            { id: 'c', texto: 'Escalar: no apunta hacia ningún lado', correcta: true },
            d.trampa,
            { id: 'unidad', texto: 'Vectorial: tiene número y unidad', error: 'ESC-UNIDAD', siFuera: 'Todo lo que se mide tiene número y unidad. Vectorial es lo que además necesita un hacia dónde.' },
          ];
          return {
            pregunta: d.q,
            opciones: ops,
            solucion: { texto: v ? `${d.mag.charAt(0).toUpperCase() + d.mag.slice(1)} siempre va hacia algún lado: es un vector, aunque el dato no lo diga.` : d.nota },
          };
        }
        const a = r.ent(3, 9) * 100, q = r.de(QUIEN_EV);
        let b = r.ent(1, a / 100 - 1) * 100;
        if (2 * b === a) b -= 100;   // si la vuelta es la mitad, dos opciones dirían lo mismo
        return {
          pregunta: `${q} avanza ${f(a, 0)} m hacia el norte y regresa ${f(b, 0)} m hacia el sur. ¿Cuál es su desplazamiento?`,
          opciones: [
            { id: 'c', texto: `${f(a - b, 0)} m hacia el norte`, correcta: true },
            { id: 'dist', texto: `${f(a + b, 0)} m hacia el norte`, error: 'ESC-DISTANCIA', siFuera: 'Eso es la distancia recorrida: suma la ida y la vuelta. El desplazamiento solo mira inicio y final.' },
            { id: 'sentido', texto: `${f(a - b, 0)} m hacia el sur`, error: 'ESC-SENTIDO', siFuera: 'Regresó menos de lo que avanzó: terminó al norte de donde salió.' },
            { id: 'vuelta', texto: `${f(b, 0)} m hacia el sur`, error: 'ESC-ULTIMO', siFuera: 'Eso es solo el último tramo. El desplazamiento va del inicio al final.' },
          ],
          solucion: { texto: 'Ida y vuelta en sentidos contrarios: se restan.', ecuacion: [`${f(a, 0)} m − ${f(b, 0)} m = ${f(a - b, 0)} m`] },
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
    // Contrato «se entiende sin profesor» (16 nov): Lee, misión, leyenda, Así se resuelve y las palabras del Resumen.
    lee: {
      tarjetas: [
        { titulo: 'Los ejes', texto: 'En un plano, el eje x va hacia la derecha y el eje y hacia arriba. Cada punto se dice con dos números: cuánto avanzar y cuánto subir.' },
        { titulo: 'Partir una flecha', texto: 'Una flecha que sale del origen avanza algo en x y sube algo en y. Esos dos números son sus componentes, Aₓ y Aᵧ. Si son negativos, va hacia la izquierda o hacia abajo.' },
        { titulo: 'î y ĵ', texto: 'î es una flecha de largo 1 hacia la derecha, y ĵ, una de largo 1 hacia arriba. A = 3î + 2ĵ quiere decir: avanza 3 y sube 2.' },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a cambiar cuánto avanza y cuánto sube A. Mira cuánto mide A y la flechita verde que sale con ella: ¿cuánto mide siempre?' },
      ],
    },
    actividad: 'Cambiar cuánto avanza y cuánto sube una flecha, y mirar su largo y su flechita verde.',
    aprendizaje: 'A se parte en lo que avanza en x y lo que sube en y; su largo sale por Pitágoras; el unitario es A ÷ |A|.',
    juega: {
      consigna: 'Aₓ va y viene sola; tú cambias Aᵧ o arrastras la punta de A. La flecha verde es su unitario.',
      mision: {
        texto: 'Haz que A mida justo 5.',
        logrado: val => Math.abs(Math.hypot(val.ax, val.ay) - 5) < 1e-9,
        bien: 'Avanza 3 y sube 4: 3² + 4² = 25, y √25 = 5.',
      },
      voz: 'Prueba también A = 0. ¿Hacia dónde apuntaría su unitario?',
      leyenda: [
        { s: [{ sub: [A, 'x'] }], t: 'cuánto avanza A en x' },
        { s: [{ sub: [A, 'y'] }], t: 'cuánto sube A en y' },
        { s: [u], t: 'el unitario: apunta como A y mide 1' },
        { s: ['|', A, '|'], t: 'el módulo: cuánto mide A' },
      ],
      controles: [
        { id: 'ax', etiqueta: 'Aₓ', color: 'c-o', min: -4, max: 4, paso: 1, inicio: 3, decimales: 0, auto: { velocidad: 1.5, modo: 'rebota' } },
        { id: 'ay', etiqueta: 'Aᵧ', color: 'c-o', min: -4, max: 4, paso: 1, inicio: 2, decimales: 0 },
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
      ecuacion: [vA, ' = ', { sub: [A, 'x'] }, 'î + ', { sub: [A, 'y'] }, 'ĵ', '   ·   ', '|', A, '| = ', { llave: [{ raiz: [[{ sub: [A, 'x'] }, '²', ' + ', { sub: [A, 'y'] }, '²']] }], nota: 'el módulo', color: 'c-o' }, '   ·   ', u, ' = ', { llave: [{ frac: [vA, ['|', A, '|']] }], nota: 'mide 1', color: 'c-d' }],
      condicion: 'los ejes x e y son perpendiculares; el vector nulo no tiene unitario.',
    },
    resuelve: {
      pieza: 'flechas',
      generar(s) {
        const r = azar(s + 300), tipo = s % 3;
        const [p, q, m] = r.de([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [12, 5, 13], [8, 6, 10]]);
        const esc = Math.max(p, q) / 4;
        if (tipo === 0) return {
          enunciado: ['¿Cuánto mide el vector ', vA, ` = ${f(p, 0)}î + ${f(q, 0)}ĵ?`],
          dibujo: compA(p / esc, q / esc, { paso: 0 }),
          pasos: [
            { tipo: 'pide', texto: 'Piden el módulo de A: cuánto mide la flecha.' },
            { tipo: 'datos', texto: `A avanza ${f(p, 0)} en x y sube ${f(q, 0)} en y.`, ecuacion: [{ sub: [A, 'x'] }, ` = ${f(p, 0)},   `, { sub: [A, 'y'] }, ` = ${f(q, 0)}`] },
            { tipo: 'regla', texto: 'Las componentes y la flecha forman un triángulo rectángulo: Pitágoras.', ecuacion: ['|', A, '| = ', { raiz: [[{ sub: [A, 'x'] }, '²', ' + ', { sub: [A, 'y'] }, '²']] }] },
            { tipo: 'cuentas', texto: 'Se reemplaza y se saca la raíz.', ecuacion: ['|', A, `| = √(${f(p * p, 0)} + ${f(q * q, 0)}) = √${f(m * m, 0)} = ${f(m, 0)}`] },
            { tipo: 'sentido', texto: `${f(m, 0)} es más que cada componente y menos que su suma, ${f(p + q, 0)}: la diagonal es un atajo.` },
          ],
          respuesta: `|A| = ${f(m, 0)}`,
        };
        if (tipo === 1) {
          // Ángulos notables de 37° y 53° (triángulo 3, 4, 5), como en el examen.
          const k = r.de([2, 5, 10, 20]), mod = 5 * k, g = r.de([37, 53]), ax = (g === 37 ? 4 : 3) * k, ay = (g === 37 ? 3 : 4) * k;
          return {
            enunciado: ['Un vector ', vA, ` mide ${f(mod, 0)} y forma ${g}° con el eje x. ¿Cuáles son sus componentes?`],
            dibujo: compA(ax / (mod / 4), ay / (mod / 4), { paso: 0 }),
            pasos: [
              { tipo: 'pide', texto: 'Piden cuánto avanza A en x y cuánto sube en y.' },
              { tipo: 'datos', texto: `|A| = ${f(mod, 0)} y el ángulo con el eje x es ${g}°.` },
              { tipo: 'regla', texto: 'Con el ángulo medido desde el eje x: el coseno da lo que avanza; el seno, lo que sube.', ecuacion: [{ sub: [A, 'x'] }, ' = |', A, '| cos θ,   ', { sub: [A, 'y'] }, ' = |', A, '| sen θ'] },
              { tipo: 'cuentas', texto: `En el triángulo de 37° y 53°, cos ${g}° = ${g === 37 ? '4/5' : '3/5'} y sen ${g}° = ${g === 37 ? '3/5' : '4/5'}.`, ecuacion: [{ sub: [A, 'x'] }, ` = ${f(mod, 0)} · ${g === 37 ? '4/5' : '3/5'} = ${f(ax, 0)},   `, { sub: [A, 'y'] }, ` = ${f(mod, 0)} · ${g === 37 ? '3/5' : '4/5'} = ${f(ay, 0)}`] },
              { tipo: 'sentido', texto: `Con ${g}°, ${g === 37 ? 'menos de 45°, avanza más de lo que sube' : 'más de 45°, sube más de lo que avanza'}: ${f(ax, 0)} y ${f(ay, 0)} cuadran.` },
            ],
            respuesta: [vA, ` = ${f(ax, 0)}î + ${f(ay, 0)}ĵ`],
          };
        }
        return {
          enunciado: ['¿Cuál es el vector unitario de ', vA, ` = ${f(p, 0)}î + ${f(q, 0)}ĵ?`],
          dibujo: compA(p / esc, q / esc, { paso: 0 }),
          pasos: [
            { tipo: 'pide', texto: 'Piden una flecha que apunte igual que A y mida 1.' },
            { tipo: 'datos', texto: `A avanza ${f(p, 0)} y sube ${f(q, 0)}.` },
            { tipo: 'regla', texto: 'El unitario es A dividido entre su módulo: cada componente entre |A|.', ecuacion: [u, ' = ', { frac: [vA, ['|', A, '|']] }] },
            { tipo: 'cuentas', texto: `Primero el módulo, con Pitágoras: ${f(m, 0)}. Luego se divide.`, ecuacion: [u, ` = ${f(p, 0)}/${f(m, 0)} î + ${f(q, 0)}/${f(m, 0)} ĵ = ${f(p / m, 2)}î + ${f(q / m, 2)}ĵ`] },
            { tipo: 'sentido', texto: `Comprobación: ${f(p / m, 2)}² + ${f(q / m, 2)}² = 1. Mide 1, como debe.` },
          ],
          respuesta: [u, ` = ${f(p / m, 2)}î + ${f(q / m, 2)}ĵ`],
        };
      },
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
    unidad: 'fisica.vectores',
    // Unidad nueva del 16 nov: sale de «Magnitudes y vectores» (Gerson eligió partirla). Ideas, mesas y glosario se movieron
    // tal cual; las ideas nuevas (escalar o vector) y el contrato «se entiende sin profesor» vienen después, una por una.
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/fis-dron.js', '/nucleo/kit/piezas/flechas.js', '/plantillas/vectores/motor.js', '/nucleo/fisica3d.js', '/nucleo/kit/piezas/fis-espacio-3d.js'],
    glosario: [
      { termino: 'magnitud escalar', formas: ['magnitud escalar', 'magnitudes escalares', 'escalar', 'escalares'],
        simple: 'Queda dicha con un número y su unidad: 5 kg, 20 °C, 45 min.',
        def: 'La que queda dicha del todo con un número y su unidad, sin dirección.',
        ejemplos: ['Una masa de 3 kg o un tiempo de 10 s.', 'La temperatura de un vaso de agua: 20 °C.', 'El volumen de una botella: 0,5 L. No apunta a ningún lado.'], ver: ['vector'] },
      { termino: 'vector', formas: ['vector', 'vectores', 'magnitud vectorial', 'magnitudes vectoriales', 'vectorial', 'vectoriales'],
        simple: 'Un dato con cuánto y hacia dónde: 300 m hacia el noroeste.',
        def: 'Flecha con tamaño, dirección y sentido; representa magnitudes como el desplazamiento o la fuerza.',
        ejemplos: ['Una fuerza de 4 N hacia arriba.', 'El desplazamiento de una combi: 3 km hacia el norte.', 'La velocidad del viento: 5 m/s hacia el este.'], ver: ['módulo', 'magnitud escalar', 'componente'] },
      { termino: 'módulo', simbolo: '|A|', simple: 'Cuánto mide la flecha, sin importar hacia dónde apunta.', def: 'El tamaño de un vector: el largo de su flecha. Nunca es negativo.',
        ejemplos: ['A = 3î + 4ĵ mide |A| = 5.', 'Una fuerza de 10 N hacia abajo tiene módulo 10 N.', 'Caminar 3 m al este y 4 m al norte: el desplazamiento mide 5 m.'], ver: ['vector'] },
      { termino: 'desplazamiento', simbolo: 'Δx', medida: 'm', simple: 'La flecha de donde saliste a donde llegaste, sin contar el camino.',
        def: 'Cambio de posición: va de donde empezó a donde terminó. En una recta, su signo da el sentido.',
        ejemplos: ['Ir a la tienda y volver a casa: el desplazamiento es 0.', 'Un dron que vuela 300 m hacia el noroeste: 300 m al noroeste.', 'De x = 5 m a x = 2 m: Δx = −3 m, hacia atrás.'], ver: ['distancia recorrida', 'vector'] },
      { termino: 'distancia recorrida', medida: 'm', def: 'Todo el camino hecho, sumando idas y vueltas. Nunca es negativa.',
        ejemplos: ['Ir 4 m y volver 4 m: recorriste 8 m, aunque Δx = 0.', 'Dar una vuelta de 400 m a la pista: 400 m recorridos.', 'Ir 600 m al este y volver 200 m: 800 m recorridos.'], ver: ['desplazamiento'] },
      { termino: 'resultante', simbolo: 'R', def: 'Vector que reemplaza a varios: va de la cola del primero a la punta del último.',
        ejemplos: ['A = 3 y B = 4 a 90°: R = 5.', 'Dos personas jalan una caja con 30 N cada una, hacia el mismo lado: R = 60 N.', 'Con 30 N y 20 N en sentidos opuestos: R = 10 N.'], ver: ['vector'] },
      { termino: 'componente', simple: 'Lo que una flecha avanza de lado o sube; sus dos «sombras».', def: 'Lo que un vector avanza a lo largo de un eje, con su signo.',
        ejemplos: ['A = 3î + 4ĵ: Aₓ = 3 y Aᵧ = 4.', 'Una flecha de 10 a 37° del eje x tiene Aₓ = 8 y Aᵧ = 6.', 'Una flecha que apunta al oeste tiene componente x negativa.'], ver: ['vector unitario', 'módulo'] },
      { termino: 'vector unitario', simbolo: 'û', simple: 'Una flechita de largo 1 que apunta igual que la otra.', formas: ['vector unitario', 'vectores unitarios', 'unitario', 'unitarios'],
        def: 'Flecha de largo 1 que apunta igual que otra; sale de dividirla entre su módulo.',
        ejemplos: ['A = 6î + 8ĵ: û = 0,6î + 0,8ĵ.', 'î es el unitario del eje x: mide 1 y apunta a la derecha.', 'Una fuerza de 5 N hacia arriba es 5 veces el unitario ĵ.'], ver: ['componente'] },
      { termino: 'producto escalar', simbolo: 'A · B', def: 'Número que sale de multiplicar un largo por la sombra del otro: A B cos θ.',
        ejemplos: ['A = 4 y B = 3 a 60°: A · B = 6.', 'Dos flechas perpendiculares: A · B = 0.', 'Empujar un carrito 5 m con 10 N en esa misma dirección da 50 J de trabajo.'], ver: ['producto vectorial'] },
      { termino: 'producto vectorial', simbolo: 'A × B',
        def: 'Vector perpendicular a los dos, cuyo largo es el área de su paralelogramo: A B sen θ.',
        ejemplos: ['A = 4 y B = 5 a 90°: |A × B| = 20.', 'Dos flechas paralelas: |A × B| = 0, no encierran área.', 'Girar una llave de 0,2 m con 10 N perpendicular: torque de 2 N·m.'], ver: ['producto escalar'] },
    ],
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
    laboratorioIdeas: {
      'flechas-espacio': ['componentes', 'productos'],
      'suma-libre': ['resultante'],
      'componentes': ['componentes'],
      'productos-libre': ['productos'],
    },
    // El vector unitario y las componentes van antes de sumar (Gerson, 16 nov).
    ideas: [escalarOVector, componentes, resultante, productos],
  };
});
