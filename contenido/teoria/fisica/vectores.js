/*
 * Teoría de «Vectores» (fisica.vectores), unidad nueva del 16 nov: sale de «Magnitudes y vectores», que Gerson eligió
 * partir en dos. Molde de docs/teoria.md. Ideas, mesas y glosario movidos tal cual desde magnitudes-y-vectores.js; el
 * vector unitario y las componentes van antes de sumar. 16 nov: idea nueva «¿Basta un número?» (escalar o vector, con
 * la pieza fis-dron) y las cuatro ideas pasadas por el contrato «se entiende sin profesor» (calidad: 2), con dos
 * rondas de lector en frío cada una (rutinas/frio/fisica.vectores.md).
 * 16 nov, más tarde: 15 ejemplos resueltos por idea (pestaña «Ejemplos», docs/teoria.md 4h; molde EJEMPLOS_UNIDADES),
 * con la pieza fis-fuerzas para los objetos de la vida real (caja, nudo, bote, avioneta, llave, carretilla, cuadras).
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
 *   C-SENO usa el seno para lo que avanza en x · C-MODULO toma el largo entero · C-MITAD reparte por mitades
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

  // ---------- Ejemplos resueltos (pestaña «Ejemplos», Gerson 16 nov; docs/teoria.md 4h) ----------
  // Molde: EJEMPLOS_UNIDADES de magnitudes-y-vectores.js (3 niveles × 5, la solución entera a la vista). Colores de la
  // unidad: A naranja, B turquesa, R y û verde, θ rojo; una tercera flecha C, violeta (c-f). La fuerza F y el peso P
  // van en naranja (son «la primera flecha»); el desplazamiento d y el brazo r, en turquesa. El vector lleva flecha
  // ({ vec }); su módulo, no. Las figuras de objetos de la vida real usan la pieza fis-fuerzas.
  const C = { v: 'c-f', t: 'C' }, vC = { vec: C }, vR = { vec: R };
  const F = { v: 'c-o', t: 'F' }, vF = { vec: F }, Pe = { v: 'c-o', t: 'P' };
  const dv = { v: 'c-i', t: 'd' }, vdv = { vec: dv }, rv = { v: 'c-i', t: 'r' }, vrv = { vec: rv }, tau = { v: 'c-d', t: 'τ' };
  const dA = t => ({ v: 'c-o', t }), dB = t => ({ v: 'c-i', t }), dR = t => ({ v: 'c-d', t }), dC = t => ({ v: 'c-f', t });
  const ff = datos => ({ pieza: 'fis-fuerzas', datos, estado: {} });
  const flx = (datos, estado = { final: true }) => ({ pieza: 'flechas', datos, estado });
  const raiz2 = (a, b, signo = ' + ') => ({ raiz: [[{ sup: [a, '2'] }, signo, { sup: [b, '2'] }]] });
  const ejesG = (x0, x1, y0, y1) => [{ de: [x0, 0], a: [x1, 0] }, { de: [0, y0], a: [0, y1] }];
  const sub = (v, i) => ({ sub: [v, i] });

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
  // Ejemplos resueltos de «Escalar o vector». Cuentas revisadas con un script aparte, que las rehace sin el código de la unidad: 40 + 15; 4 · 100;
  // 60 + 25 + 15 y 60 − 25 + 15; 1200/600 y 0/600; 21 − 12 y 18 + 9; 6/0,5; √(300² + 400²); 6 − 2, 5 − 2 y √(4² + 3²);
  // 1400/200 y √(600² + 800²)/200; 3,14 · 50 y 2 · 50; 40 + 30 + 40 y 110 − 30.
  const EJEMPLOS_ESCALAR = [
    { nivel: 1, titulo: 'Un saco, una fuerza, un tiempo', figura: ff({ objeto: 'caja', texto: '50 kg', flechas: [{ ang: 90, mod: 500, color: 'o', rotulo: 'F', valor: '500 N' }] }),
      enunciado: ['Un agricultor levanta un saco de papa de 50 kg con una fuerza de ', dA('500 N hacia arriba'), ' durante 2 s. ¿Cuáles de esos tres datos son vectoriales?'],
      solucion: [
        { texto: ['La masa, 50 kg, y el tiempo, 2 s, quedan dichos con un número y su unidad: son escalares.'] },
        { texto: ['La fuerza necesita además hacia dónde, ', dA('hacia arriba'), ': es un vector y se dibuja como una flecha.'] },
      ],
      respuesta: ['Solo la ', dA('fuerza'), '; la masa y el tiempo son escalares'] },
    { nivel: 1, titulo: 'Una lancha hacia Taquile', figura: ff({ objeto: 'bote', rumbo: 0, norte: true, flechas: [{ ang: 0, mod: 20, color: 'o', rotulo: 'v', valor: '20 km/h' }] }),
      enunciado: ['Una lancha va de Puno hacia la isla Taquile a ', dA('20 km/h hacia el este'), '. En ese dato, ¿qué parte es el módulo y qué parte la dirección?'],
      solucion: [
        { texto: ['La velocidad es un vector: dice cuánto y hacia dónde.'] },
        { texto: ['El módulo es el número con su unidad, ', dA('20 km/h'), ', que también se llama rapidez. La dirección es ', dA('hacia el este'), '.'] },
      ],
      respuesta: ['Módulo: ', dA('20 km/h'), '. Dirección: ', dA('hacia el este')] },
    { nivel: 1, titulo: 'Una alpaca que va y vuelve', figura: ff({ objeto: 'cuadras', rejilla: false, norte: true, tramos: [{ dir: 'E', n: 40, rotulo: '40 m' }, { dir: 'O', n: 15, rotulo: '15 m' }] }),
      enunciado: ['Una alpaca camina ', dA('40 m'), ' hacia el este y luego regresa ', dB('15 m'), ' hacia el oeste. ¿Cuál es la distancia que recorrió?'],
      solucion: [
        { texto: ['La distancia recorrida es un escalar: suma todo el camino, sin mirar hacia dónde.'], ecuacion: [dA('40 m'), ' + ', dB('15 m'), ' = 55 m'] },
      ],
      respuesta: ['55 m'] },
    { nivel: 1, titulo: '¿A 2 km de dónde?', figura: { pieza: 'fis-dron', datos: { max: 3000, paso: 1000, circulo: 2000, textoCirculo: 'Todos a 2 km de la plaza' }, estado: {} },
      enunciado: ['Un vecino dice: «La chacra queda a 2 km de la plaza». ¿Basta ese dato para llegar a la chacra?'],
      solucion: [
        { texto: ['Con solo «2 km», la chacra puede estar en cualquier punto del círculo punteado.'] },
        { texto: ['Falta hacia dónde. Dónde queda la chacra, vista desde la plaza, es un vector: un módulo, 2 km, y una dirección.'] },
      ],
      respuesta: ['No: falta la dirección, por ejemplo «hacia el norte»'] },
    { nivel: 1, titulo: 'Una vuelta a la plaza', figura: ff({ objeto: 'cuadras', plaza: [0, 0], tramos: [{ dir: 'E', n: 1, rotulo: '100 m' }, { dir: 'N', n: 1, rotulo: '100 m' }, { dir: 'O', n: 1, rotulo: '100 m' }, { dir: 'S', n: 1, rotulo: '100 m' }], resultante: { rotulo: 'R' } }),
      enunciado: ['Un ciclista da una vuelta completa a una plaza de Juliaca, que es cuadrada, de 100 m de lado. ¿Cuál es su distancia recorrida y cuál su desplazamiento?'],
      solucion: [
        { texto: ['La distancia suma los cuatro lados.'], ecuacion: ['4 × 100 m = 400 m'] },
        { texto: ['Terminó donde empezó: la flecha de la salida a la llegada no tiene largo.'], ecuacion: [vR, ' = 0'] },
      ],
      respuesta: ['Recorrió 400 m; su desplazamiento es ', dR('0')] },
    { nivel: 2, titulo: 'La carretilla en la feria', figura: ff({ objeto: 'cuadras', rejilla: false, norte: true, tramos: [{ dir: 'E', n: 60, rotulo: '60 m' }, { dir: 'O', n: 25, rotulo: '25 m' }, { dir: 'E', n: 15, rotulo: '15 m' }], resultante: { rotulo: 'Δx', valor: '50 m' } }),
      enunciado: ['En la feria de Juliaca, un vendedor empuja su carretilla ', dA('60 m'), ' al este, ', dB('25 m'), ' al oeste y ', dC('15 m'), ' al este. ¿Cuál es su distancia recorrida y cuál su desplazamiento?'],
      solucion: [
        { texto: ['La distancia suma los tres tramos.'], ecuacion: [dA('60'), ' + ', dB('25'), ' + ', dC('15'), ' = 100 m'] },
        { texto: ['El desplazamiento toma el este como positivo y el oeste como negativo.'], ecuacion: [dR('Δx'), ' = ', dA('60'), ' − ', dB('25'), ' + ', dC('15'), ' = ', dR('+50 m')] },
      ],
      respuesta: ['Recorrió 100 m; se desplazó ', dR('50 m al este')] },
    { nivel: 2, titulo: 'Ida y vuelta a la isla', figura: ff({ objeto: 'bote', rumbo: 0, flechas: [{ ang: 0, mod: 600, color: 'o', rotulo: 'ida', valor: '600 m' }, { desde: [0, 16], de: [600, 0], a: [0, 0], color: 'i', rotulo: 'vuelta', valor: '600 m' }], marcas: [{ en: [600, 0], texto: 'Isla' }] }),
      enunciado: ['Un bote va del muelle a una isla, ', dA('600 m'), ' al este, y vuelve al muelle por el mismo camino. Todo el viaje dura 10 min. ¿Rapidez media y velocidad media? Dato: 1 min = 60 s.'],
      solucion: [
        { texto: ['El tiempo en segundos: 10 × 60 = 600 s. La rapidez media usa la distancia recorrida, ida y vuelta.'], ecuacion: [{ frac: [[dA('600 m'), ' + ', dB('600 m')], '600 s'] }, ' = ', { frac: ['1200 m', '600 s'] }, ' = 2 m/s'] },
        { texto: ['La velocidad media usa el desplazamiento. Volvió al muelle: el desplazamiento es cero.'], ecuacion: [{ frac: [dR('0 m'), '600 s'] }, ' = 0 m/s'] },
      ],
      respuesta: ['Rapidez media: 2 m/s. Velocidad media: ', dR('0')] },
    { nivel: 2, titulo: 'Los kilómetros de la carretera', figura: ff({ objeto: 'cuadras', rejilla: false, inicio: 'km 12', fin: 'km 21', tramos: [{ dir: 'E', n: 18, rotulo: '18 km' }, { dir: 'O', n: 9, rotulo: '9 km' }], resultante: { rotulo: 'Δx', valor: '9 km' } }),
      enunciado: ['En la carretera de Juliaca a Puno, una combi pasa por el ', dA('km 12'), ', sigue hasta el ', dA('km 30'), ' y regresa hasta el ', dB('km 21'), '. ¿Cuál es su desplazamiento y qué distancia recorrió?'],
      solucion: [
        { texto: ['El desplazamiento es la posición final menos la inicial.'], ecuacion: [dR('Δx'), ' = ', dB('21 km'), ' − ', dA('12 km'), ' = ', dR('+9 km')] },
        { texto: ['La distancia suma la ida, del km 12 al 30, y la vuelta, del 30 al 21.'], ecuacion: ['(30 − 12) + (30 − 21) = 18 + 9 = 27 km'] },
      ],
      respuesta: [dR('9 km'), ' hacia Puno; recorrió 27 km'] },
    { nivel: 2, titulo: 'La velocidad media de una lancha', figura: ff({ objeto: 'bote', rumbo: 0, norte: true, flechas: [{ ang: 0, mod: 6, color: 'o', rotulo: 'Δx', valor: '6 km' }], marcas: [{ en: [6, 0], texto: 'Isla' }] }),
      enunciado: ['Una lancha sale de Puno y llega a una isla que está ', dA('6 km'), ' al este. Tarda 0,5 h. ¿Cuál es su velocidad media?'],
      solucion: [
        { texto: ['La velocidad media es el desplazamiento entre el tiempo.'], ecuacion: [{ frac: [dA('6 km'), '0,5 h'] }, ' = 12 km/h'] },
        { texto: ['Es un vector: lleva la dirección del desplazamiento. Sin «hacia el este», la respuesta queda incompleta.'] },
      ],
      respuesta: ['12 km/h ', dA('hacia el este')] },
    { nivel: 2, titulo: 'Cinco datos para clasificar', figura: ff({ objeto: 'carretilla', flechas: [{ hasta: 'manijas', ang: -20, mod: 40, color: 'o', rotulo: 'F', valor: '40 N' }] }),
      enunciado: ['¿Cuáles son vectoriales? 1) una temperatura de −5 °C; 2) un empuje de ', dA('40 N'), ' hacia adelante; 3) una energía de 30 J; 4) una aceleración de 2 m/s² hacia abajo; 5) un tiempo de 3 h.'],
      solucion: [
        { texto: ['Se pregunta si cada dato necesita un «hacia dónde». La temperatura, la energía y el tiempo no apuntan: son escalares, aunque −5 °C tenga signo.'] },
        { texto: ['El empuje y la aceleración sí apuntan, hacia adelante y hacia abajo: son vectores.'] },
      ],
      respuesta: ['El ', dA('empuje'), ' (2) y la aceleración (4)'] },
    { nivel: 3, titulo: 'Tres cuadras y cuatro cuadras', figura: ff({ objeto: 'cuadras', norte: true, inicio: 'Paradero', tramos: [{ dir: 'E', n: 3, rotulo: '300 m' }, { dir: 'N', n: 4, rotulo: '400 m' }], resultante: { rotulo: 'R', valor: '500 m' } }),
      enunciado: ['Desde el paradero, Luis camina ', dA('3 cuadras'), ' al este y ', dB('4 cuadras'), ' al norte. Cada cuadra mide 100 m. ¿Cuánto recorrió y a qué distancia en línea recta quedó del paradero?'],
      solucion: [
        { texto: ['La distancia recorrida suma los dos tramos.'], ecuacion: [dA('300 m'), ' + ', dB('400 m'), ' = 700 m'] },
        { texto: ['El desplazamiento va del paradero a la llegada. El este y el norte forman 90°: Pitágoras.'], ecuacion: [R, ' = ', raiz2('300', '400'), ' = √250 000 = ', dR('500 m')] },
      ],
      respuesta: ['Recorrió 700 m; quedó a ', dR('500 m'), ' del paradero'] },
    { nivel: 3, titulo: 'Cuatro tramos por cuadras', figura: ff({ objeto: 'cuadras', norte: true, inicio: 'Casa', tramos: [{ dir: 'E', n: 6, rotulo: '6' }, { dir: 'N', n: 5, rotulo: '5' }, { dir: 'O', n: 2, rotulo: '2' }, { dir: 'S', n: 2, rotulo: '2' }], resultante: { rotulo: 'R', valor: '500 m' } }),
      enunciado: ['Una alumna sale de su casa y camina ', dA('6 cuadras'), ' al este, ', dB('5'), ' al norte, ', dC('2'), ' al oeste y 2 al sur. Cada cuadra mide 100 m. ¿Cuánto mide su desplazamiento?'],
      solucion: [
        { texto: ['Se juntan los tramos de cada eje. En x: 6 al este y 2 al oeste. En y: 5 al norte y 2 al sur.'], ecuacion: ['x: ', dA('6'), ' − ', dC('2'), ' = 4 cuadras,   y: ', dB('5'), ' − 2 = 3 cuadras'] },
        { texto: ['Con 4 y 3 cuadras que forman 90°, Pitágoras.'], ecuacion: [R, ' = ', raiz2('4', '3'), ' = 5 cuadras = ', dR('500 m')] },
      ],
      respuesta: [dR('500 m'), ', aunque caminó 1500 m'] },
    { nivel: 3, titulo: 'Rapidez media y velocidad media', figura: ff({ objeto: 'cuadras', norte: true, tramos: [{ dir: 'E', n: 6, rotulo: '600 m' }, { dir: 'N', n: 8, rotulo: '800 m' }], resultante: { rotulo: 'R', valor: '1000 m' } }),
      enunciado: ['Un ciclista va ', dA('600 m'), ' al este y luego ', dB('800 m'), ' al norte, en 200 s en total. ¿Cuánto valen su rapidez media y el módulo de su velocidad media?'],
      solucion: [
        { texto: ['Rapidez media: la distancia recorrida entre el tiempo.'], ecuacion: [{ frac: [[dA('600 m'), ' + ', dB('800 m')], '200 s'] }, ' = ', { frac: ['1400 m', '200 s'] }, ' = 7 m/s'] },
        { texto: ['Velocidad media: el desplazamiento entre el tiempo. El desplazamiento sale de Pitágoras.'], ecuacion: [R, ' = ', raiz2('600', '800'), ' = ', dR('1000 m'), ',   ', { frac: [dR('1000 m'), '200 s'] }, ' = 5 m/s'] },
      ],
      respuesta: ['Rapidez media: 7 m/s. Velocidad media: 5 m/s'] },
    { nivel: 3, titulo: 'Media vuelta a la pista',
      figura: flx({ unidad: 'm', contorno: Array.from({ length: 19 }, (_, i) => [50 * Math.cos(i * Math.PI / 18), 50 * Math.sin(i * Math.PI / 18)]),
        segmentos: [{ de: [0, 0], a: [0, 50], texto: 'r = 50 m' }],
        resultante: { de: [50, 0], a: [-50, 0], color: 'd', rotulo: 'R', valor: '100 m', lejos: [0, 50] } }),
      enunciado: ['Una atleta corre media vuelta en una pista circular de 50 m de radio, de un extremo al otro. ¿Cuál es su distancia recorrida y cuál el módulo de su desplazamiento? Dato: π ≈ 3,14.'],
      solucion: [
        { texto: ['Media vuelta es la mitad de la circunferencia, 2πr: queda πr.'], ecuacion: ['π · r = 3,14 · 50 m = 157 m'] },
        { texto: ['El desplazamiento va en línea recta de un extremo al otro: cruza el centro y mide un diámetro.'], ecuacion: [R, ' = 2 · 50 m = ', dR('100 m')] },
      ],
      respuesta: ['Recorrió 157 m; se desplazó ', dR('100 m')] },
    { nivel: 3, titulo: 'Un dron que sube y baja',
      figura: flx({ unidad: 'm', flechas: [{ de: [0, 0], a: [0, 40], color: 'o', rotulo: 'sube', valor: '40 m' }, { de: [0, 40], a: [30, 40], color: 'i', rotulo: 'avanza', valor: '30 m' }, { de: [30, 40], a: [30, 0], color: 'f', rotulo: 'baja', valor: '40 m' }],
        resultante: { de: [0, 0], a: [30, 0], color: 'd', rotulo: 'R', valor: '30 m', lejos: [15, 40] } }),
      enunciado: ['Un dron sube ', dA('40 m'), ', avanza ', dB('30 m'), ' en horizontal y baja ', dC('40 m'), '. ¿Cuántos metros más larga es su distancia recorrida que su desplazamiento?'],
      solucion: [
        { texto: ['La distancia recorrida suma los tres tramos.'], ecuacion: [dA('40 m'), ' + ', dB('30 m'), ' + ', dC('40 m'), ' = 110 m'] },
        { texto: ['Subió 40 m y bajó 40 m: terminó a la misma altura. Del inicio al final solo quedan los 30 m horizontales.'], ecuacion: [R, ' = ', dR('30 m')] },
        { texto: ['Se restan.'], ecuacion: ['110 m − ', dR('30 m'), ' = 80 m'] },
      ],
      respuesta: ['80 m más larga'] },
  ];

  const escalarOVector = {
    id: 'escalar-vector',
    titulo: 'Escalar o vector',
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
    ejemplos: EJEMPLOS_ESCALAR,
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
          { de: [a, 0], a: tip, color: 'i', rotulo: 'B', valor: o.valores === false ? undefined : `${f(b, 0)}`, paso: o.pasoB || 0, lejos: [0, 0], rotuloEn: 0.72 },   // el rótulo de B, cerca de su punta: en la cola está el ángulo
        ],
        angulos: g > 0 && g < 180 ? [{ en: [a, 0], de: 0, a: g, texto: `${f(g, 0)}°`, color: 'h', paso: o.pasoB || 0 }] : [],
        guias: [{ de: [a, 0], a: [a + b + 0.5, 0], color: 'h', paso: o.pasoB || 0 }, ...(o.marco ? [marco(...o.marco)] : [])],
        resultante: { de: [0, 0], a: tip, color: 'd', rotulo: 'R', valor: o.sinR ? undefined : `${f(r, 2)}`, paso: o.pasoR === undefined ? 0 : o.pasoR, lejos: [a, 0] },
      },
      estado: { paso: o.paso === undefined ? 9 : o.paso },
      r,
    };
  };
  // El juego fija la escala con el B más largo (6): así la punta de B sigue al dedo sin que la figura se encoja.
  const MARCO_R = [[0, 0], [12.5, 6]];
  // Con los largos escritos (lector en frío, 16 nov: sin el número de A y de R, la misión se adivinaba).
  const juegoR = val => colaPunta(6, val.b, val.g, { marco: MARCO_R });
  // Ejemplos resueltos de «Suma de vectores». Cuentas revisadas con un script aparte, que las rehace sin el código de la unidad: 30 + 20; 600 − 450;
  // √(6² + 8²); 7 ± 3; 64 + 49 + 56 = 169; 6400 + 900 − 2400 = 4900; 2500 + 2500 − 2500; 400√3 ≈ 692,8; (5 − 2, 4) y 5;
  // 490 000 + 2 250 000 + 1 260 000 = 4 000 000; √(4² + 3²), 80/4 y 3 · 20; 70/250 = 7/25 y √(250² − 70²) = 240;
  // tres de 50 N a 120° suman 0; (17 + 7)/2 = 12, 17 − 12 = 5 y √(12² + 5²); F² = 2F² + 2F² cos θ → cos θ = −1/2.
  // Las figuras de flechas sueltas salen de colaPunta, la misma de «Mira»: el largo y el ángulo dibujados son los datos.
  const cp = (a, b, g, o = {}) => { const c = colaPunta(a, b, g, Object.assign({ circulo: false }, o)); return flx(c.datos, o.final === false ? c.estado : { final: true }); };
  const EJEMPLOS_SUMA = [
    { nivel: 1, titulo: 'Dos jalan hacia el mismo lado', figura: ff({ objeto: 'caja', flechas: [{ ang: 0, mod: 30, desde: [34, -20], color: 'o', rotulo: 'A', valor: '30 N' }, { ang: 0, mod: 20, desde: [34, 8], color: 'i', rotulo: 'B', valor: '20 N', lado: -1 }] }),
      enunciado: ['Dos personas jalan una caja hacia el este con cuerdas: una con ', A, ' = 30 N y la otra con ', B, ' = 20 N. ¿Cuánto mide la fuerza resultante?'],
      solucion: [
        { texto: ['Apuntan hacia el mismo lado, ', th, ' = 0°: los módulos se suman.'], ecuacion: [R, ' = ', A, ' + ', B, ' = 30 N + 20 N = 50 N'] },
      ],
      respuesta: [R, ' = 50 N hacia el este'] },
    { nivel: 1, titulo: 'La soga en la fiesta', figura: ff({ objeto: 'nudo', flechas: [{ ang: 0, mod: 600, color: 'o', rotulo: 'A', valor: '600 N' }, { ang: 180, mod: 450, color: 'i', rotulo: 'B', valor: '450 N' }] }),
      enunciado: ['En la fiesta del pueblo, dos equipos jalan una soga: uno con ', A, ' = 600 N al este y el otro con ', B, ' = 450 N al oeste. ¿Cuánto vale la resultante y hacia dónde apunta?'],
      solucion: [
        { texto: ['Apuntan en sentidos opuestos, ', th, ' = 180°: los módulos se restan, y gana el sentido de la fuerza mayor.'], ecuacion: [R, ' = ', A, ' − ', B, ' = 600 N − 450 N = 150 N'] },
      ],
      respuesta: [R, ' = 150 N hacia el este'] },
    { nivel: 1, titulo: 'Dos flechas perpendiculares', figura: cp(6, 8, 90),
      enunciado: ['Dos vectores de ', A, ' = 6 u y ', B, ' = 8 u forman ', th, ' = 90°. ¿Cuánto mide su resultante?'],
      solucion: [
        { texto: ['Con 90°, A, B y R forman un triángulo rectángulo: Pitágoras.'], ecuacion: [R, ' = ', raiz2('6', '8'), ' = √100 = 10 u'] },
      ],
      respuesta: [R, ' = 10 u'] },
    { nivel: 1, titulo: 'La mayor y la menor',
      figura: (() => { const c = colaPunta(7, 3, 60, { sinR: true, pasoR: 99 }); return flx(c.datos, { paso: 9 }); })(),
      enunciado: ['Dos fuerzas de ', A, ' = 7 N y ', B, ' = 3 N pueden formar cualquier ángulo. ¿Cuál es la resultante más grande posible y cuál la más chica?'],
      solucion: [
        { texto: ['La punta de B puede caer en cualquier punto del arco. La mayor sale cuando apuntan igual, ', th, ' = 0°; la menor, cuando se oponen, ', th, ' = 180°.'], ecuacion: ['máx: 7 N + 3 N = 10 N,   mín: 7 N − 3 N = 4 N'] },
      ],
      respuesta: ['10 N la mayor y 4 N la menor'] },
    { nivel: 1, titulo: 'Ley de cosenos con 60°', figura: cp(8, 7, 60),
      enunciado: ['Dos fuerzas de ', A, ' = 8 N y ', B, ' = 7 N forman ', th, ' = 60°. ¿Cuánto mide su resultante? Dato: cos 60° = 1/2.'],
      solucion: [
        { texto: ['Con un ángulo que no es 0°, 90° ni 180° se usa la ley de cosenos.'], ecuacion: [{ sup: [R, '2'] }, ' = 64 + 49 + 2 · 8 · 7 · cos 60° = 64 + 49 + 2 · 8 · 7 · 1/2 = 169,   ', R, ' = √169 = 13 N'] },
      ],
      respuesta: [R, ' = 13 N'] },
    { nivel: 2, titulo: 'Dos cuerdas a 120°',
      figura: ff({ objeto: 'bote', largo: 140, flechas: [{ ang: 30, mod: 80, color: 'o', rotulo: 'A', valor: '80 N' }, { ang: 150, mod: 30, color: 'i', rotulo: 'B', valor: '30 N' }, { a: [40 * Math.sqrt(3) - 15 * Math.sqrt(3), 55], color: 'd', rotulo: 'R', valor: '70 N' }], angulos: [{ de: 30, a: 150, texto: '120°', radio: 40 }] }),
      enunciado: ['Desde la orilla, dos personas jalan un bote con cuerdas: ', A, ' = 80 N y ', B, ' = 30 N, que forman ', th, ' = 120°. ¿Cuánto mide la resultante? Dato: cos 120° = −1/2.'],
      solucion: [
        { texto: ['Ley de cosenos, con θ el ángulo entre las dos cuerdas.'], ecuacion: [{ sup: [R, '2'] }, ' = ', { sup: ['80', '2'] }, ' + ', { sup: ['30', '2'] }, ' + 2 · 80 · 30 · cos 120°'] },
        { texto: ['El coseno de 120° es negativo: el último término resta.'], ecuacion: [{ sup: [R, '2'] }, ' = 6400 + 900 + 2 · 80 · 30 · (−1/2) = 6400 + 900 − 2400 = 4900,   ', R, ' = 70 N'] },
      ],
      respuesta: [R, ' = 70 N'] },
    { nivel: 2, titulo: 'Dos fuerzas iguales a 120°',
      figura: ff({ objeto: 'nudo', flechas: [{ ang: 30, mod: 50, color: 'o', rotulo: 'A', valor: '50 N' }, { ang: 150, mod: 50, color: 'i', rotulo: 'B', valor: '50 N' }, { ang: 90, mod: 50, color: 'd', rotulo: 'R', valor: '50 N', cuerda: false, discontinua: true }], angulos: [{ de: 30, a: 150, texto: '120°', radio: 30 }] }),
      enunciado: ['Dos cables sostienen un letrero; cada uno jala con ', A, ' = ', B, ' = 50 N, y forman ', th, ' = 120°. ¿Cuánto mide la resultante? Dato: cos 120° = −1/2.'],
      solucion: [
        { texto: ['Ley de cosenos, con A = B = 50 N.'], ecuacion: [{ sup: [R, '2'] }, ' = 2500 + 2500 + 2 · 50 · 50 · cos 120° = 5000 − 2500 = 2500'] },
        { texto: ['Se saca la raíz: la resultante mide lo mismo que cada cable. Pasa siempre con dos fuerzas iguales a 120°.'], ecuacion: [R, ' = √2500 = 50 N'] },
      ],
      respuesta: [R, ' = 50 N, igual que cada cable'] },
    { nivel: 2, titulo: 'Dos toros y un arado',
      figura: ff({ objeto: 'nudo', largo: 190, flechas: [{ ang: 30, mod: 400, color: 'o', rotulo: 'A', valor: '400 N' }, { ang: -30, mod: 400, color: 'i', rotulo: 'B', valor: '400 N' }, { ang: 0, mod: 400 * Math.sqrt(3), color: 'd', rotulo: 'R', cuerda: false, discontinua: true }], angulos: [{ de: -30, a: 30, texto: '60°', radio: 30 }] }),
      enunciado: ['En una chacra, dos toros jalan un arado con ', A, ' = ', B, ' = 400 N cada uno, y sus cadenas forman ', th, ' = 60°. ¿Cuánto mide la resultante? Dato: cos 60° = 1/2.'],
      solucion: [
        { texto: ['Ley de cosenos con dos módulos iguales.'], ecuacion: [{ sup: [R, '2'] }, ' = 400² + 400² + 2 · 400 · 400 · cos 60° = 400² + 400² + 400² = 3 · 400²'] },
        { texto: ['Se saca la raíz: la raíz de 3 queda afuera.'], ecuacion: [R, ' = 400√3 ≈ 693 N'] },
      ],
      respuesta: [R, ' = 400√3 ≈ 693 N'] },
    { nivel: 2, titulo: 'El método del polígono',
      figura: flx({ unidad: 'm', flechas: [{ de: [0, 0], a: [5, 0], color: 'o', rotulo: 'A', valor: '5 m' }, { de: [5, 0], a: [5, 4], color: 'i', rotulo: 'B', valor: '4 m' }, { de: [5, 4], a: [3, 4], color: 'f', rotulo: 'C', valor: '2 m' }],
        resultante: { de: [0, 0], a: [3, 4], color: 'd', rotulo: 'R', valor: '5 m', lejos: [5, 0] } }),
      enunciado: ['Un perro pastor camina ', A, ' = 5 m al este, ', B, ' = 4 m al norte y ', C, ' = 2 m al oeste. ¿Cuánto mide su desplazamiento total?'],
      solucion: [
        { texto: ['Método del polígono: cada flecha empieza en la punta de la anterior, y R va de la primera cola a la última punta.'] },
        { texto: ['El este y el oeste se restan; el norte queda solo.'], ecuacion: ['x: 5 − 2 = 3 m,   y: 4 m'] },
        { texto: ['Pitágoras con 3 y 4.'], ecuacion: [R, ' = ', raiz2('3', '4'), ' = 5 m'] },
      ],
      respuesta: [R, ' = 5 m'] },
    { nivel: 2, titulo: 'Dos lanchas y una balsa',
      figura: ff({ objeto: 'bote', rumbo: 36.87, largo: 170, flechas: [{ ang: 0, mod: 700, color: 'o', rotulo: 'A', valor: '700 N', rotuloEn: 0.8 }, { ang: 53.13, mod: 1500, color: 'i', rotulo: 'B', valor: '1500 N' }, { a: [1600, 1200], color: 'd', rotulo: 'R', valor: '2000 N' }], angulos: [{ de: 0, a: 53.13, texto: '53°', radio: 30 }] }),
      enunciado: ['Dos lanchas jalan una balsa de totora con ', A, ' = 700 N y ', B, ' = 1500 N. Las cuerdas forman ', th, ' = 53°. ¿Cuánto mide la resultante? Dato: cos 53° = 3/5.'],
      solucion: [
        { texto: ['Ley de cosenos con θ = 53°.'], ecuacion: [{ sup: [R, '2'] }, ' = 700² + 1500² + 2 · 700 · 1500 · cos 53°'] },
        { texto: ['Con cos 53° = 3/5 = 0,6, se suma y se saca la raíz.'], ecuacion: [{ sup: [R, '2'] }, ' = 490 000 + 2 250 000 + 1 260 000 = 4 000 000,   ', R, ' = 2000 N'] },
      ],
      respuesta: [R, ' = 2000 N'] },
    { nivel: 3, titulo: 'Cruzar el río Coata',
      figura: ff({ objeto: 'bote', orillas: true, ancho: 'Río Coata: 80 m de ancho', flechas: [{ ang: 90, mod: 4, color: 'o', rotulo: 'A', valor: '4 m/s' }, { de: [0, 4], ang: 0, mod: 3, color: 'i', rotulo: 'B', valor: '3 m/s' }, { a: [3, 4], color: 'd', rotulo: 'R', valor: '5 m/s' }] }),
      enunciado: ['Un bote cruza el río Coata, de 80 m de ancho: avanza a ', A, ' = 4 m/s hacia la otra orilla y la corriente lo arrastra a ', B, ' = 3 m/s. ¿Su rapidez, el tiempo de cruce y el arrastre?'],
      solucion: [
        { texto: ['Las dos velocidades forman 90°: la del bote respecto a la orilla sale de Pitágoras.'], ecuacion: [R, ' = ', raiz2('4', '3'), ' = 5 m/s'] },
        { texto: ['Para cruzar solo cuenta lo que avanza hacia la otra orilla, 4 m/s. La corriente no lo acerca ni lo aleja.'], ecuacion: ['t = 80 m ÷ 4 m/s = 20 s'] },
        { texto: ['En esos 20 s, la corriente lo lleva río abajo.'], ecuacion: ['3 m/s × 20 s = 60 m'] },
      ],
      respuesta: [R, ' = 5 m/s; tarda 20 s y llega 60 m río abajo'] },
    { nivel: 3, titulo: 'Una avioneta con viento cruzado',
      figura: ff({ objeto: 'avion', norte: true, largo: 150, flechas: [{ ang: 106.26, mod: 250, color: 'o', rotulo: 'A', valor: '250 km/h' }, { de: [-70, 240], ang: 0, mod: 70, color: 'i', rotulo: 'B', valor: '70 km/h' }, { ang: 90, mod: 240, color: 'd', rotulo: 'R', valor: '240 km/h' }], angulos: [{ de: 90, a: 106.26, texto: 'θ', radio: 60 }] }),
      enunciado: ['Una avioneta vuela a ', A, ' = 250 km/h respecto al aire, y el viento sopla a ', B, ' = 70 km/h hacia el este. ¿Hacia dónde apunta para ir al norte, y con qué rapidez avanza? Dato: sen 16° = 7/25.'],
      solucion: [
        { texto: ['Debe apuntar un poco al oeste, para que el viento la corrija. R, su velocidad respecto al suelo, apunta al norte: R = A + B.'] },
        { texto: ['A es la hipotenusa del triángulo y B, el cateto opuesto al desvío θ.'], ecuacion: ['sen ', th, ' = ', { frac: ['70', '250'] }, ' = 7/25,   ', th, ' = 16°'] },
        { texto: ['R es el otro cateto: Pitágoras.'], ecuacion: [R, ' = ', raiz2('250', '70', ' − '), ' = √57 600 = 240 km/h'] },
      ],
      respuesta: [th, ' = 16° al oeste del norte; avanza a ', R, ' = 240 km/h'] },
    { nivel: 3, titulo: 'Tres cuerdas a 120°',
      figura: ff({ objeto: 'nudo', flechas: [{ ang: 90, mod: 50, color: 'o', rotulo: 'A', valor: '50 N' }, { ang: 210, mod: 50, color: 'i', rotulo: 'B', valor: '50 N' }, { ang: 330, mod: 50, color: 'f', rotulo: 'C', valor: '50 N' }], angulos: [{ de: 210, a: 330, texto: '120°', radio: 26 }] }),
      enunciado: ['Tres niños jalan un aro con cuerdas: ', A, ', ', B, ' y ', C, ' miden 50 N cada una y están separadas 120° entre sí. ¿Cuánto vale la resultante? ¿Y si un niño suelta su cuerda?'],
      solucion: [
        { texto: ['Dos de ellas, B y C, iguales y a 120°, suman 50 N. Esa suma apunta justo al revés de A.'], ecuacion: [{ sup: [R, '2'] }, ' = 2500 + 2500 + 2 · 50 · 50 · cos 120° = 2500,   50 N'] },
        { texto: ['Esa suma de 50 N y A se anulan: el aro queda en equilibrio.'], ecuacion: [R, ' = 0'] },
        { texto: ['Si un niño suelta, quedan las otras dos: su suma mide 50 N y apunta al lado contrario de la cuerda soltada.'] },
      ],
      respuesta: [R, ' = 0; si uno suelta, 50 N hacia el lado contrario'] },
    { nivel: 3, titulo: 'Máxima, mínima y a 90°', figura: cp(12, 5, 90),
      enunciado: ['Dos fuerzas dan una resultante máxima de 17 N y una mínima de 7 N. ¿Cuánto vale la resultante si forman 90°?'],
      solucion: [
        { texto: ['La máxima es la suma de los módulos y la mínima, la resta.'], ecuacion: [A, ' + ', B, ' = 17,   ', A, ' − ', B, ' = 7'] },
        { texto: ['Se suman las dos ecuaciones: 2A = 24.'], ecuacion: [A, ' = 12 N,   ', B, ' = 17 − 12 = 5 N'] },
        { texto: ['A 90°, Pitágoras.'], ecuacion: [R, ' = ', raiz2('12', '5'), ' = √169 = 13 N'] },
      ],
      respuesta: [R, ' = 13 N'] },
    { nivel: 3, titulo: 'Iguales y con la misma resultante', figura: cp(5, 5, 120, { valores: false, sinR: true }),
      enunciado: ['Dos fuerzas de igual módulo F dan una resultante que también mide F. ¿Qué ángulo forman?'],
      solucion: [
        { texto: ['Ley de cosenos con A = B = R = F.'], ecuacion: [{ sup: ['F', '2'] }, ' = ', { sup: ['F', '2'] }, ' + ', { sup: ['F', '2'] }, ' + 2 · F · F · cos ', th] },
        { texto: ['Se despeja el coseno.'], ecuacion: ['−F² = 2F² cos ', th, '   →   cos ', th, ' = −1/2'] },
        { texto: ['El ángulo entre 0° y 180° con coseno −1/2 es 120°.'], ecuacion: [th, ' = 120°'] },
      ],
      respuesta: [th, ' = 120°'] },
  ];

  const resultante = {
    id: 'resultante',
    titulo: 'Suma de vectores',
    pregunta: '¿Por qué 3 + 4 no siempre da 7 cuando sumas flechas?',
    temas: ['Suma de vectores por el método gráfico'],
    pieza: 'flechas',
    // Contrato «se entiende sin profesor» (16 nov): Lee, misión, leyenda, Así se resuelve y las palabras del Resumen.
    lee: {
      tarjetas: [
        { titulo: 'Sumar flechas', texto: 'Sumar dos vectores es hacer un movimiento y después el otro. Por eso B se pone con su cola en la punta de A, sin cambiarle el largo ni hacia dónde apunta.' },
        { titulo: 'La resultante', texto: 'La resultante R es la flecha que va de la cola de A a la punta de B. Hace lo mismo que las dos juntas.' },
        { titulo: 'El ángulo entre dos flechas', texto: 'θ es el ángulo entre A y B si salieran del mismo punto: 0° si apuntan igual, 180° si se oponen. En el dibujo se mide en la punta de A, desde la punteada que sigue a A.' },
        { titulo: 'Qué mirar al jugar', texto: 'B gira sobre la punta de A. Mira cuánto mide R cuando B apunta como A y cuando apunta al revés.' },
      ],
    },
    actividad: 'Girar una flecha B sobre la punta de A y mirar cuánto mide la suma.',
    ejemplos: EJEMPLOS_SUMA,
    aprendizaje: 'R mide A + B si apuntan igual, A − B si se oponen, y un valor intermedio con cualquier otro ángulo.',
    juega: {
      consigna: 'B gira sola sobre la punta de A. Mira cómo R se estira hasta A + B y se encoge hasta A − B.',
      mision: {
        texto: 'Haz que R mida 0. Vas a tener que cambiar también el largo de B.',
        logrado: val => colaPunta(6, val.b, val.g).r < 1e-9,
        bien: 'A y B iguales y opuestas se anulan. Así se equilibran dos fuerzas.',
      },
      voz: 'Mira entre qué valores se mueve R.',
      leyenda: [
        { s: [A], t: 'la primera flecha; mide 6' },
        { s: [B], t: 'la segunda, puesta en la punta de A' },
        { s: [R], t: 'la resultante, la suma de A y B' },
        { s: [th], t: 'el ángulo entre A y B' },
        { s: ['- - -'], t: 'por donde seguiría A; θ sale de ahí' },
      ],
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
        { estado: { paso: 2 }, texto: 'R une la cola de A con la punta de B: ley de cosenos.', ecuacion: [{ sup: [R, '2'] }, ' = ', { sup: [A, '2'] }, ' + ', { sup: [B, '2'] }, ' + 2', A, B, ' cos ', th] },
        { estado: { paso: 2, final: true }, texto: 'Con cos 60° = 0,5, el último término da 2 · 6 · 4 · 0,5 = 24.', ecuacion: [{ sup: [R, '2'] }, ' = 36 + 16 + 24 = 76,   ', R, ` ≈ ${f(Math.sqrt(76), 2)}`] },
      ],
    },
    regla: {
      texto: 'Los vectores se suman poniéndolos uno a continuación del otro. El módulo de R depende del ángulo: queda entre la diferencia y la suma de los módulos.',
      ecuacion: [{ sup: [R, '2'] }, ' = ', { sup: [A, '2'] }, ' + ', { sup: [B, '2'] }, ' + ', { llave: ['2', A, B, ' cos ', th], nota: 'el término del ángulo', color: 'c-h' }],
      condicion: 'θ es el ángulo entre A y B, no el de adentro del triángulo: por eso el signo +. Con 90°, Pitágoras.',
    },
    resuelve: {
      pieza: 'flechas',
      generar(s) {
        const r = azar(s + 500), tipo = s % 3;
        if (tipo === 0) {
          // Con 120° el coseno es negativo y el término resta (lector en frío, ronda 2: todos los ejemplos eran de 60° o 90°).
          const [a, b, g, cs] = s === 0 ? [5, 3, 120, -0.5] : r.de([[5, 3, 60, 0.5], [8, 3, 60, 0.5], [5, 8, 60, 0.5], [7, 8, 60, 0.5], [5, 3, 120, -0.5], [8, 5, 120, -0.5]]);
          const rr = Math.sqrt(a * a + b * b + 2 * a * b * cs);
          const c = colaPunta(a, b, g, { circulo: false, sinR: true, paso: 1, pasoR: 9 });
          return {
            enunciado: ['Dos fuerzas de ', A, ` = ${f(a, 0)} N y `, B, ` = ${f(b, 0)} N forman `, th, ` = ${g}°. ¿Cuánto mide la resultante?`],
            dibujo: { datos: c.datos, estado: { paso: 1 } },
            pasos: [
              { tipo: 'pide', texto: 'Piden el módulo de R, la suma de las dos fuerzas.' },
              { tipo: 'datos', texto: `A = ${f(a, 0)} N, B = ${f(b, 0)} N y el ángulo entre ellas es ${g}°.` },
              { tipo: 'regla', texto: 'Con un ángulo cualquiera se usa la ley de cosenos, con θ entre A y B.', ecuacion: [{ sup: [R, '2'] }, ' = ', { sup: [A, '2'] }, ' + ', { sup: [B, '2'] }, ' + 2', A, B, ' cos ', th] },
              { tipo: 'cuentas', texto: cs < 0 ? `cos ${g}° = −0,5: el último término resta.` : `cos ${g}° = 0,5.`, ecuacion: [{ sup: [R, '2'] }, ` = ${f(a * a, 0)} + ${f(b * b, 0)} + 2 · ${f(a, 0)} · ${f(b, 0)} · (${f(cs, 1)}) = ${f(rr * rr, 0)},   `, R, ` = √${f(rr * rr, 0)} ≈ ${f(rr, 2)} N`], dibujo: { datos: colaPunta(a, b, g, { circulo: false }).datos, estado: { paso: 9, final: true } } },
              { tipo: 'sentido', texto: `${f(rr, 2)} N queda entre la diferencia, ${f(Math.abs(a - b), 0)} N, y la suma, ${f(a + b, 0)} N. Cuadra.` },
            ],
            respuesta: [R, ` = ${f(rr, 2)} N`],
          };
        }
        if (tipo === 1) {
          const a = r.ent(5, 12), b = r.ent(2, a - 1);
          return {
            enunciado: `Dos fuerzas de ${f(a, 0)} N y ${f(b, 0)} N actúan sobre una caja. ¿Entre qué valores puede estar su resultante?`,
            pasos: [
              { tipo: 'pide', texto: 'Piden la resultante más grande y la más chica que pueden dar.' },
              { tipo: 'datos', texto: `Se conocen los módulos, ${f(a, 0)} N y ${f(b, 0)} N; el ángulo no.` },
              { tipo: 'regla', texto: 'La mayor sale con θ = 0°, apuntando igual; la menor, con θ = 180°: la grande menos la chica.', ecuacion: ['A − B ≤ ', R, ' ≤ A + B,  con A la mayor'] },
              { tipo: 'cuentas', texto: 'Se suman y se restan los módulos.', ecuacion: [`${f(a, 0)} − ${f(b, 0)} = ${f(a - b, 0)} N,   ${f(a, 0)} + ${f(b, 0)} = ${f(a + b, 0)} N`] },
              { tipo: 'sentido', texto: 'Cualquier otro ángulo da un valor entre esos dos.' },
            ],
            respuesta: [`${f(a - b, 0)} N ≤ `, R, ` ≤ ${f(a + b, 0)} N`],
          };
        }
        const [a, b] = r.de([[6, 8], [5, 12], [9, 12], [8, 15]]), rr = Math.hypot(a, b);
        const c = colaPunta(a, b, 90, { circulo: false, sinR: true, paso: 1, pasoR: 9 });
        return {
          enunciado: ['Una persona camina ', A, ` = ${f(a, 0)} m al este y luego `, B, ` = ${f(b, 0)} m al norte. ¿Cuánto mide su desplazamiento?`],
          dibujo: { datos: c.datos, estado: { paso: 1 } },
          pasos: [
            { tipo: 'pide', texto: 'Piden el módulo de R, la flecha del inicio al final.' },
            { tipo: 'datos', texto: `Este y norte forman 90°: θ = 90°.` },
            { tipo: 'regla', texto: 'Con 90°, cos 90° = 0 y la ley de cosenos se vuelve Pitágoras.', ecuacion: [{ sup: [R, '2'] }, ' = ', { sup: [A, '2'] }, ' + ', { sup: [B, '2'] }] },
            { tipo: 'cuentas', texto: 'Se reemplaza y se saca la raíz.', ecuacion: [R, ` = √(${f(a * a, 0)} + ${f(b * b, 0)}) = ${f(rr, 0)} m`], dibujo: { datos: colaPunta(a, b, 90, { circulo: false }).datos, estado: { paso: 9, final: true } } },
            { tipo: 'sentido', texto: `Caminó ${f(a + b, 0)} m, pero quedó a ${f(rr, 0)} m del inicio: la diagonal es más corta.` },
          ],
          respuesta: [R, ` = ${f(rr, 0)} m`],
        };
      },
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
    // En el juego, A lleva escrito cuánto mide (lector en frío, 16 nov: el número estaba solo en la lectura, abajo).
    const fl = [{ de: [0, 0], a: [ax, ay], color: 'o', rotulo: 'A', valor: o.valor && m > 0 ? f(m, 2) : undefined, paso: 0 }];
    if (m > 0 && o.unitario) fl.push({ de: [0, 0], a: [ax / m, ay / m], color: 'd', rotulo: 'û', paso: o.pasoU || 0 });
    return { datos: { unidad: 'u', flechas: fl,
      guias: [...EJES, ...(m > 0 ? [{ de: [ax, 0], a: [ax, ay], color: 'o', paso: o.pasoG || 0 }, { de: [0, ay], a: [ax, ay], color: 'o', paso: o.pasoG || 0 }] : [])],
      // Aᵧ se marca en la vertical de la punta, a la derecha, lejos del rótulo de A (lector en frío: se encimaban).
      segmentos: m > 0 && o.textos ? [{ de: [0, 0], a: [ax, 0], color: 'o', texto: `Aₓ = ${f(ax, 0)}`, paso: o.pasoG || 0 }, { de: [ax, 0], a: [ax, ay], color: 'o', texto: `Aᵧ = ${f(ay, 0)}`, paso: o.pasoG || 0 }].filter(sg => Math.hypot(sg.a[0], sg.a[1]) > 0) : [],
    }, estado: { paso: o.paso === undefined ? 9 : o.paso } };
  };
  // Ejemplos resueltos de «Componentes». Cuentas revisadas con un script aparte, que las rehace sin el código de la unidad: 50 · 4/5 y 50 · 3/5;
  // 10 · 3/5 y 10 · 4/5; 40 · √3/2 ≈ 34,64 y 40 · 1/2; 100√2 · √2/2; √(5² + 12²); √(8² + 6²) y 8/10, −6/10; −10 · 4/5 y
  // 10 · 3/5; −25 · 3/5 y −25 · 4/5; (3 + 4, 5 − 2) y √58 ≈ 7,62; √(40² + 30²) y tan = 3/4; las tres cuerdas del nudo
  // (40 − 8, 30 + 6 − 12, √(32² + 24²)); (−14 + 8, 2 + 6), √100 y 180° − 53°; √(13² − 12²); −(30 − 6, 10 + 22) y
  // √(24² + 32²); 100 · 3/5 y 100 · 4/5.
  const R2 = Math.SQRT2;
  const EJEMPLOS_COMPONENTES = [
    { nivel: 1, titulo: 'Una cuerda a 37°',
      figura: ff({ objeto: 'caja', flechas: [{ ang: 37, mod: 50, desde: [0, -12], color: 'o', rotulo: 'A', valor: '50 N' }, { ang: 0, mod: 40, desde: [0, -12], color: 'o', rotulo: 'Aₓ', valor: '40 N', discontinua: true }, { de: [40, 0], ang: 90, mod: 30, desde: [0, -12], color: 'o', rotulo: 'Aᵧ', valor: '30 N', discontinua: true }], angulos: [{ desde: [0, -12], de: 0, a: 37, texto: '37°', radio: 30 }] }),
      enunciado: ['Una cuerda jala una caja con una fuerza de ', A, ' = 50 N, a ', th, ' = 37° del piso. ¿Cuánto jala en horizontal y cuánto hacia arriba? Dato: cos 37° = 4/5 y sen 37° = 3/5.'],
      solucion: [
        { texto: ['Con el ángulo medido desde el piso, el coseno da lo que jala en horizontal y el seno, lo que jala hacia arriba.'],
          ecuacion: [sub(A, 'x'), ' = 50 · cos 37° = 50 · 4/5 = 40 N,   ', sub(A, 'y'), ' = 50 · sen 37° = 50 · 3/5 = 30 N'] },
      ],
      respuesta: [sub(A, 'x'), ' = 40 N y ', sub(A, 'y'), ' = 30 N'] },
    { nivel: 1, titulo: 'Un vector a 53°',
      figura: flx({ unidad: 'u', guias: ejesG(-1, 8, -1, 9), flechas: [{ de: [0, 0], a: [6, 8], color: 'o', rotulo: 'A', valor: '10', rotuloEn: 0.75 }, { de: [0, 0], a: [6, 0], color: 'o', rotulo: 'Aₓ', valor: '6', discontinua: true }, { de: [6, 0], a: [6, 8], color: 'o', rotulo: 'Aᵧ', valor: '8', discontinua: true }], angulos: [{ en: [0, 0], de: 0, a: 53, texto: '53°', color: 'h' }] }),
      enunciado: ['Un vector ', vA, ' mide ', A, ' = 10 u y forma ', th, ' = 53° con el eje x. ¿Cuáles son sus componentes? Dato: cos 53° = 3/5 y sen 53° = 4/5.'],
      solucion: [
        { texto: ['Coseno para lo que avanza en x; seno para lo que sube en y.'],
          ecuacion: [sub(A, 'x'), ' = 10 · cos 53° = 10 · 3/5 = 6,   ', sub(A, 'y'), ' = 10 · sen 53° = 10 · 4/5 = 8'] },
      ],
      respuesta: [vA, ' = 6î + 8ĵ'] },
    { nivel: 1, titulo: 'Empujar una carretilla',
      figura: ff({ objeto: 'carretilla', flechas: [{ hasta: 'manijas', ang: -30, mod: 40, color: 'o', rotulo: 'A', valor: '40 N' }, { desde: 'manijas', de: [-40 * Math.sqrt(3) / 2, 20], a: [0, 20], color: 'o', rotulo: 'Aₓ', discontinua: true }, { desde: 'manijas', de: [0, 20], a: [0, 0], color: 'o', rotulo: 'Aᵧ', discontinua: true }],
        angulos: [{ desde: 'manijas', en: [-40 * Math.sqrt(3) / 2, 20], de: -30, a: 0, texto: '30°', radio: 30 }] }),
      enunciado: ['Un niño empuja una carretilla con ', A, ' = 40 N, inclinada ', th, ' = 30° hacia abajo. ¿Cuánto empuja hacia adelante y cuánto contra el piso? Dato: cos 30° = √3/2 y sen 30° = 1/2.'],
      solucion: [
        { texto: ['Hacia adelante va el coseno; hacia el piso, el seno.'],
          ecuacion: [sub(A, 'x'), ' = 40 · cos 30° = 40 · √3/2 = 20√3 ≈ 34,6 N,   ', sub(A, 'y'), ' = 40 · sen 30° = 40 · 1/2 = 20 N'] },
      ],
      respuesta: ['20√3 ≈ 34,6 N hacia adelante y 20 N contra el piso'] },
    { nivel: 1, titulo: 'Una avioneta al noreste',
      figura: ff({ objeto: 'avion', norte: true, flechas: [{ ang: 45, mod: 100 * R2, color: 'o', rotulo: 'A', valor: '100√2 km/h' }, { ang: 0, mod: 100, color: 'o', rotulo: 'Aₓ', valor: '100', discontinua: true }, { de: [100, 0], ang: 90, mod: 100, color: 'o', rotulo: 'Aᵧ', valor: '100', discontinua: true }], angulos: [{ de: 0, a: 45, texto: '45°', radio: 34 }] }),
      enunciado: ['Una avioneta vuela a ', A, ' = 100√2 km/h hacia el noreste, a ', th, ' = 45° del este. ¿Cuánto avanza hacia el este y cuánto hacia el norte en una hora? Dato: cos 45° = sen 45° = √2/2.'],
      solucion: [
        { texto: ['Como cos 45° = sen 45°, las dos componentes valen lo mismo.'],
          ecuacion: [sub(A, 'x'), ' = ', sub(A, 'y'), ' = 100√2 · cos 45° = 100√2 · √2/2 = 100 km/h'] },
      ],
      respuesta: ['100 km hacia el este y 100 km hacia el norte'] },
    { nivel: 1, titulo: 'El largo desde las componentes',
      figura: flx({ unidad: 'm', guias: [{ de: [-1, 0], a: [7, 0] }], flechas: [{ de: [0, 0], a: [5, 12], color: 'o', rotulo: 'A', valor: '13 m' }, { de: [0, 0], a: [5, 0], color: 'o', rotulo: 'Aₓ', valor: '5', discontinua: true }, { de: [5, 0], a: [5, 12], color: 'o', rotulo: 'Aᵧ', valor: '12', discontinua: true }] }),
      enunciado: ['Un dron se desplaza ', vA, ' = 5î + 12ĵ, en metros: 5 m al este y 12 m al norte. ¿Cuánto mide su desplazamiento?'],
      solucion: [
        { texto: ['Las dos componentes y la flecha forman un triángulo rectángulo: Pitágoras.'], ecuacion: ['|', A, '| = ', raiz2('5', '12'), ' = √169 = 13 m'] },
      ],
      respuesta: ['|', A, '| = 13 m'] },
    { nivel: 2, titulo: 'El unitario de un vector',
      figura: flx({ unidad: 'u', guias: ejesG(-1, 9, -7, 1.5), flechas: [{ de: [0, 0], a: [8, -6], color: 'o', rotulo: 'A', valor: '10' }, { de: [0, 0], a: [0.8, -0.6], color: 'd', rotulo: 'û', rotuloEn: 1, lado: -1 }] }),
      enunciado: ['¿Cuál es el vector unitario ', u, ' de ', vA, ' = 8î − 6ĵ?'],
      solucion: [
        { texto: ['Primero el módulo, con Pitágoras.'], ecuacion: ['|', A, '| = ', raiz2('8', '6'), ' = √100 = 10'] },
        { texto: ['Luego cada componente se divide entre 10, con su signo.'], ecuacion: [u, ' = ', { frac: [vA, ['|', A, '|']] }, ' = ', { frac: ['8', '10'] }, 'î − ', { frac: ['6', '10'] }, 'ĵ = 0,8î − 0,6ĵ'] },
      ],
      respuesta: [u, ' = 0,8î − 0,6ĵ: mide 1 y apunta como ', vA] },
    { nivel: 2, titulo: 'En el segundo cuadrante',
      figura: flx({ unidad: 'N', guias: ejesG(-9, 2, -1, 7), flechas: [{ de: [0, 0], a: [-8, 6], color: 'o', rotulo: 'A', valor: '10 N' }, { de: [0, 0], a: [-8, 0], color: 'o', rotulo: 'Aₓ', valor: '−8', discontinua: true }, { de: [-8, 0], a: [-8, 6], color: 'o', rotulo: 'Aᵧ', valor: '6', discontinua: true }], angulos: [{ en: [0, 0], de: 143.13, a: 180, texto: '37°', color: 'h', radio: 30 }] }),
      enunciado: ['Una fuerza de ', A, ' = 10 N apunta hacia arriba y a la izquierda, a 37° por encima del eje x negativo. Escríbela con î y ĵ. Dato: cos 37° = 4/5 y sen 37° = 3/5.'],
      solucion: [
        { texto: ['Los tamaños salen del ángulo de 37°, medido desde el eje x negativo.'], ecuacion: ['10 · cos 37° = 10 · 4/5 = 8,   10 · sen 37° = 10 · 3/5 = 6'] },
        { texto: ['Los signos salen del dibujo: va a la izquierda, x negativa; va hacia arriba, y positiva.'], ecuacion: [vA, ' = −8î + 6ĵ N'] },
      ],
      respuesta: [vA, ' = −8î + 6ĵ N'] },
    { nivel: 2, titulo: 'En el tercer cuadrante',
      figura: flx({ unidad: 'N', guias: ejesG(-17, 3, -8, 3), flechas: [{ de: [0, 0], a: [-15, -20], color: 'o', rotulo: 'A', valor: '25 N', rotuloEn: 0.8 }, { de: [0, 0], a: [-15, 0], color: 'o', rotulo: 'Aₓ', valor: '−15', discontinua: true }, { de: [-15, 0], a: [-15, -20], color: 'o', rotulo: 'Aᵧ', valor: '−20', discontinua: true }], angulos: [{ en: [0, 0], de: 180, a: 233.13, texto: '53°', color: 'h', radio: 30 }] }),
      enunciado: ['Una fuerza de ', A, ' = 25 N apunta hacia abajo y a la izquierda, a 53° por debajo del eje x negativo. ¿Cuáles son sus componentes? Dato: cos 53° = 3/5 y sen 53° = 4/5.'],
      solucion: [
        { texto: ['Primero los tamaños, con el ángulo medido desde el eje x negativo.'], ecuacion: ['25 · cos 53° = 25 · 3/5 = 15,   25 · sen 53° = 25 · 4/5 = 20'] },
        { texto: ['Va a la izquierda y hacia abajo: las dos componentes son negativas.'], ecuacion: [sub(A, 'x'), ' = −15 N,   ', sub(A, 'y'), ' = −20 N'] },
      ],
      respuesta: [vA, ' = −15î − 20ĵ N'] },
    { nivel: 2, titulo: 'Sumar por componentes',
      figura: flx({ unidad: 'm', guias: ejesG(-1, 8, -1, 6), flechas: [{ de: [0, 0], a: [3, 5], color: 'o', rotulo: 'A' }, { de: [3, 5], a: [7, 3], color: 'i', rotulo: 'B' }],
        resultante: { de: [0, 0], a: [7, 3], color: 'd', rotulo: 'R', valor: '√58 m', lejos: [3, 5] } }),
      enunciado: ['Un dron hace dos tramos: ', vA, ' = 3î + 5ĵ y ', vB, ' = 4î − 2ĵ, en metros. ¿Cuál es su desplazamiento total y cuánto mide?'],
      solucion: [
        { texto: ['Se suman las componentes de cada eje por separado.'], ecuacion: [vR, ' = (3 + 4)î + (5 − 2)ĵ = 7î + 3ĵ'] },
        { texto: ['Su módulo, con Pitágoras.'], ecuacion: [R, ' = ', raiz2('7', '3'), ' = √58 ≈ 7,62 m'] },
      ],
      respuesta: [vR, ' = 7î + 3ĵ, que mide √58 ≈ 7,62 m'] },
    { nivel: 2, titulo: 'De las componentes al ángulo',
      figura: ff({ objeto: 'carretilla', flechas: [{ hasta: 'manijas', ang: -36.87, mod: 50, color: 'o', rotulo: 'A', valor: '50 N' }, { desde: 'manijas', de: [-40, 30], a: [0, 30], color: 'o', rotulo: 'Aₓ', valor: '40 N', discontinua: true }, { desde: 'manijas', de: [0, 30], a: [0, 0], color: 'o', rotulo: 'Aᵧ', valor: '30 N', discontinua: true }],
        angulos: [{ desde: 'manijas', en: [-40, 30], de: -36.87, a: 0, texto: 'θ', radio: 30 }] }),
      enunciado: ['Una carretilla se empuja con una fuerza que tiene ', sub(A, 'x'), ' = 40 N hacia adelante y ', sub(A, 'y'), ' = 30 N contra el piso. ¿Cuánto mide la fuerza y qué ángulo forma con el piso? Dato: tan 37° = 3/4.'],
      solucion: [
        { texto: ['El módulo, con Pitágoras.'], ecuacion: [A, ' = ', raiz2('40', '30'), ' = √2500 = 50 N'] },
        { texto: ['El ángulo con el piso: lo que baja entre lo que avanza es su tangente.'], ecuacion: ['tan ', th, ' = ', { frac: ['30', '40'] }, ' = 3/4,   ', th, ' = 37°'] },
      ],
      respuesta: [A, ' = 50 N, a ', th, ' = 37° por debajo de la horizontal'] },
    { nivel: 3, titulo: 'Tres cuerdas en un nudo',
      figura: ff({ objeto: 'nudo', largo: 210, flechas: [{ ang: 37, mod: 50, color: 'o', rotulo: 'A', valor: '50 N' }, { ang: 143.13, mod: 10, color: 'i', rotulo: 'B', valor: '10 N', lado: -1 }, { ang: 270, mod: 12, color: 'f', rotulo: 'C', valor: '12 N', lado: -1 }],
        angulos: [{ de: 0, a: 36.87, texto: '37°', radio: 28 }, { de: 143.13, a: 180, texto: '37°', radio: 28 }], guias: [{ de: [-30, 0], a: [42, 0] }] }),
      enunciado: ['Sobre un nudo jalan tres cuerdas: ', A, ' = 50 N a 37°, ', B, ' = 10 N a 143° y ', C, ' = 12 N a 270°, desde el eje +x. Halla la fuerza total. Dato: cos 37° = 4/5 y sen 37° = 3/5.'],
      solucion: [
        { texto: ['A se parte con 37°. B forma 37° con el eje x negativo: va a la izquierda y hacia arriba.'], ecuacion: [vA, ' = 50 · cos 37° î + 50 · sen 37° ĵ = 40î + 30ĵ,   ', vB, ' = −10 · cos 37° î + 10 · sen 37° ĵ = −8î + 6ĵ'] },
        { texto: ['C apunta hacia abajo: solo tiene componente y, negativa.'], ecuacion: [vC, ' = −12ĵ'] },
        { texto: ['Se suman las componentes de cada eje.'], ecuacion: [vR, ' = (40 − 8)î + (30 + 6 − 12)ĵ = 32î + 24ĵ'] },
        { texto: ['Su módulo, con Pitágoras.'], ecuacion: [R, ' = ', raiz2('32', '24'), ' = √1600 = 40 N'] },
      ],
      respuesta: ['La fuerza total mide ', R, ' = 40 N'] },
    { nivel: 3, titulo: 'Hacia dónde apunta la suma',
      figura: flx({ unidad: 'N', guias: ejesG(-15, 9, -1, 9), flechas: [{ de: [0, 0], a: [-14, 2], color: 'o', rotulo: 'A' }, { de: [0, 0], a: [8, 6], color: 'i', rotulo: 'B' }],
        resultante: { de: [0, 0], a: [-6, 8], color: 'd', rotulo: 'R', valor: '10 N', lejos: [6, 0] }, angulos: [{ en: [0, 0], de: 0, a: 126.87, texto: '127°', color: 'h', radio: 22 }] }),
      enunciado: ['Dos cuerdas jalan un bote: ', vA, ' = −14î + 2ĵ y ', vB, ' = 8î + 6ĵ, en newtons. ¿Cuánto mide la fuerza total ', vR, ' = ', vA, ' + ', vB, ' y qué ángulo forma con el eje +x? Dato: tan 53° = 4/3.'],
      solucion: [
        { texto: ['Se suman las componentes.'], ecuacion: [vR, ' = (−14 + 8)î + (2 + 6)ĵ = −6î + 8ĵ'] },
        { texto: ['Su módulo, con Pitágoras.'], ecuacion: [R, ' = ', raiz2('6', '8'), ' = √100 = 10 N'] },
        { texto: ['Apunta arriba y a la izquierda. Con el eje x negativo forma un ángulo de tangente 8/6 = 4/3, o sea 53°.'], ecuacion: [th, ' = 180° − 53° = 127°'] },
      ],
      respuesta: [R, ' = 10 N, a ', th, ' = 127° del eje x positivo'] },
    { nivel: 3, titulo: 'La componente que falta',
      figura: flx({ unidad: 'u', guias: ejesG(-1, 13, -6, 1.5), flechas: [{ de: [0, 0], a: [12, -5], color: 'o', rotulo: 'A', valor: '13' }, { de: [0, 0], a: [12, 0], color: 'o', rotulo: 'Aₓ', valor: '12', discontinua: true }, { de: [12, 0], a: [12, -5], color: 'o', rotulo: 'b', discontinua: true }] }),
      enunciado: ['El vector ', vA, ' = 12î + bĵ mide ', A, ' = 13 y apunta hacia abajo y a la derecha. ¿Cuánto vale b?'],
      solucion: [
        { texto: ['El módulo sale de Pitágoras con las dos componentes.'], ecuacion: [{ sup: ['13', '2'] }, ' = ', { sup: ['12', '2'] }, ' + ', { sup: ['b', '2'] }, '   →   ', { sup: ['b', '2'] }, ' = 169 − 144 = 25'] },
        { texto: ['b puede valer 5 o −5. Como A apunta hacia abajo, su componente y es negativa.'], ecuacion: ['b = −5'] },
      ],
      respuesta: ['b = −5, y ', vA, ' = 12î − 5ĵ'] },
    { nivel: 3, titulo: 'La fuerza que equilibra',
      figura: ff({ objeto: 'nudo', flechas: [{ a: [30, 10], color: 'o', rotulo: 'A' }, { a: [-6, 22], color: 'i', rotulo: 'B' }, { a: [-24, -32], color: 'f', rotulo: 'C', valor: '40 N' }] }),
      enunciado: ['Sobre un nudo actúan ', vA, ' = 30î + 10ĵ y ', vB, ' = −6î + 22ĵ, en newtons. ¿Qué tercera fuerza ', vC, ' lo deja en equilibrio, y cuánto mide?'],
      solucion: [
        { texto: ['En equilibrio, las tres fuerzas suman cero. Primero se suman A y B.'], ecuacion: [vA, ' + ', vB, ' = (30 − 6)î + (10 + 22)ĵ = 24î + 32ĵ'] },
        { texto: ['C es la opuesta de esa suma: mismo largo y sentido contrario.'], ecuacion: [vC, ' = −24î − 32ĵ'] },
        { texto: ['Su módulo, con Pitágoras.'], ecuacion: [C, ' = ', raiz2('24', '32'), ' = √1600 = 40 N'] },
      ],
      respuesta: [vC, ' = −24î − 32ĵ N, que mide 40 N'] },
    { nivel: 3, titulo: 'Una caja en la rampa',
      figura: ff({ objeto: 'caja', rampa: 37, flechas: [{ ang: -90, mod: 100, color: 'o', rotulo: 'P', valor: '100 N' }, { ang: 217, mod: 60, color: 'o', rotulo: 'Pₓ', valor: '60 N', discontinua: true }, { ang: -53, mod: 80, color: 'o', rotulo: 'Pᵧ', valor: '80 N', discontinua: true }],
        angulos: [{ de: -90, a: -53, texto: '37°', radio: 46 }] }),
      enunciado: ['Una caja de peso ', Pe, ' = 100 N descansa sobre una rampa de 37°. ¿Qué parte del peso la empuja rampa abajo y qué parte la aprieta contra la rampa? Dato: sen 37° = 3/5 y cos 37° = 4/5.'],
      solucion: [
        { texto: ['Se usan ejes girados: x a lo largo de la rampa, y perpendicular a ella. El peso forma 37° con el eje y.'] },
        { texto: ['Rampa abajo va el seno; contra la rampa, el coseno.'], ecuacion: [sub(Pe, 'x'), ' = 100 · sen 37° = 100 · 3/5 = 60 N,   ', sub(Pe, 'y'), ' = 100 · cos 37° = 100 · 4/5 = 80 N'] },
      ],
      respuesta: [sub(Pe, 'x'), ' = 60 N rampa abajo y ', sub(Pe, 'y'), ' = 80 N contra la rampa'] },
  ];

  const componentes = {
    id: 'componentes',
    titulo: 'Componentes',
    pregunta: '¿Cómo se parte una flecha en dos, y qué flecha mide 1?',
    temas: ['Componentes y vector unitario'],
    pieza: 'flechas',
    // Contrato «se entiende sin profesor» (16 nov): Lee, misión, leyenda, Así se resuelve y las palabras del Resumen.
    lee: {
      tarjetas: [
        { titulo: 'Los ejes', texto: 'En un plano, el eje x va hacia la derecha y el eje y hacia arriba. Cada punto se dice con dos números: cuánto avanzar y cuánto subir.' },
        { titulo: 'Partir una flecha', texto: 'Una flecha que sale del origen avanza algo en x y sube algo en y: son sus componentes, Aₓ y Aᵧ. î y ĵ miden 1 y apuntan por los ejes; A = 3î + 2ĵ quiere decir: avanza 3 y sube 2.' },
        { titulo: 'Con un ángulo', texto: 'A veces te dan cuánto mide A y el ángulo θ que forma con el eje x. Entonces lo que avanza es |A| cos θ, y lo que sube, |A| sen θ.' },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a cambiar cuánto avanza y cuánto sube A. Mira cuánto mide A, su módulo |A|, y la flechita verde que sale con ella: ¿cuánto mide siempre?' },
      ],
    },
    actividad: 'Cambiar cuánto avanza y cuánto sube una flecha, y mirar su largo y su flechita verde.',
    ejemplos: EJEMPLOS_COMPONENTES,
    aprendizaje: 'A se parte en lo que avanza en x y lo que sube en y; su largo sale por Pitágoras; el unitario es A ÷ |A|.',
    juega: {
      consigna: 'Aₓ va y viene sola. Arrastra la punta de A y la flecha se queda donde la sueltes. La verde es su unitario.',
      mision: {
        texto: 'Haz que A mida justo 5.',
        logrado: val => Math.abs(Math.hypot(val.ax, val.ay) - 5) < 1e-9,
        bien: 'Avanza 3 y sube 4: 3² + 4² = 25, y √25 = 5.',
      },
      voz: 'Alarga A sin girarla. ¿Cambia la flecha verde?',
      leyenda: [
        { s: [{ sub: [A, 'x'] }], t: 'cuánto avanza A en x' },
        { s: [{ sub: [A, 'y'] }], t: 'cuánto sube A en y' },
        { s: [u], t: 'el unitario: apunta como A y mide 1' },
        { s: ['|', A, '|'], t: 'el módulo: cuánto mide A' },
        { s: [vA], t: 'el vector; sin flechita, A es su largo' },
      ],
      controles: [
        { id: 'ax', etiqueta: 'Aₓ', color: 'c-o', min: -4, max: 4, paso: 1, inicio: 3, decimales: 0, auto: { velocidad: 1.5, modo: 'rebota' } },
        { id: 'ay', etiqueta: 'Aᵧ', color: 'c-o', min: -4, max: 4, paso: 1, inicio: 2, decimales: 0 },
      ],
      dibujo: val => compA(val.ax, val.ay, { unitario: true, valor: true }),
      lectura: val => {
        const m = Math.hypot(val.ax, val.ay);
        const c = x => `${x < 0 ? '−' : ''}${f(Math.abs(x), 2)}`;
        return m > 1e-9 ? ['|', A, `| = ${f(m, 2)} · `, u, ` = ${c(val.ax / m)}î ${val.ay < 0 ? '−' : '+'} ${f(Math.abs(val.ay / m), 2)}ĵ, mide 1`] : [A, ' = 0: no apunta a ningún lado; no tiene ', u];
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
        { estado: { paso: 3 }, texto: 'A forma 53° con el eje x: coseno para avanzar, seno para subir.', ecuacion: ['5 cos 53° = 5 · 3/5 = 3,   5 sen 53° = 5 · 4/5 = 4'] },
      ],
    },
    regla: {
      texto: 'Un vector se escribe con sus componentes sobre î y ĵ. Su módulo sale de Pitágoras, y el unitario es el vector dividido entre su módulo.',
      ecuacion: [vA, ' = ', { sub: [A, 'x'] }, 'î + ', { sub: [A, 'y'] }, 'ĵ', '   ·   ', '|', A, '| = ', { llave: [{ raiz: [[{ sub: [A, 'x'] }, '²', ' + ', { sub: [A, 'y'] }, '²']] }], nota: 'el módulo', color: 'c-o' }, '   ·   ', u, ' = ', { llave: [{ frac: [vA, ['|', A, '|']] }], nota: 'û mide 1', color: 'c-d' }],
      condicion: 'los ejes son perpendiculares; con θ medido desde el eje x, Aₓ = |A| cos θ y Aᵧ = |A| sen θ.',
    },
    resuelve: {
      pieza: 'flechas',
      generar(s) {
        const r = azar(s + 300), tipo = s % 3;
        // 9, 12, 15 no sale en «Ahora tú»: el primer ejemplo resuelto no regala la respuesta del primer ejercicio.
        const [p, q, m] = s === 0 ? [9, 12, 15] : r.de([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [12, 5, 13], [8, 6, 10], [9, 12, 15]]);
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
        if (s % 3 === 2) {
          // Componentes a partir del módulo y el ángulo, con los notables de 37° y 53° (lector en frío, 16 nov: el
          // ángulo es lo más típico del examen y «Ahora tú» no lo pedía).
          const k = r.de([2, 4, 5, 10]), mod = 5 * k, g = r.de([37, 53]), ax = (g === 37 ? 4 : 3) * k, ay = (g === 37 ? 3 : 4) * k;
          return {
            pregunta: ['Un vector ', vA, ` mide ${f(mod, 0)} y forma ${g}° con el eje x. ¿Cuánto vale su componente x?`],
            dibujo: compA(ax / (mod / 4), ay / (mod / 4), { paso: 0 }),
            opciones: opciones(ax, [
              { id: 'cruce', valor: ay, error: 'C-SENO', siFuera: 'Esa es la que sube, |A| sen θ. Lo que avanza en x es |A| cos θ.' },
              { id: 'mod', valor: mod, error: 'C-MODULO', siFuera: 'Ese es todo el largo de A; lo que avanza en x es más corto.' },
              { id: 'mitad', valor: mod / 2, error: 'C-MITAD', siFuera: 'La mitad sería con 60°. Lo que avanza depende del ángulo: |A| cos θ.' },
            ], x => f(x, 1)),
            solucion: { texto: `En el triángulo de 37° y 53°, cos ${g}° = ${g === 37 ? '4/5' : '3/5'}.`, ecuacion: [{ sub: [A, 'x'] }, ` = ${f(mod, 0)} · ${g === 37 ? '4/5' : '3/5'} = ${f(ax, 0)}`] },
          };
        }
        if (s % 3 === 0) return {
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
      // A × B, perpendicular a la pantalla: ⊙ (sale) en el centro del paralelogramo (lector en frío: no se dibujaba).
      fuera: o.pasoK === undefined || !(g > 0 && g < 180) ? [] : [{ en: [(a + tip[0]) / 2, tip[1] / 2], sentido: 'sale', rotulo: 'A × B', color: 'd', paso: o.pasoK }],
    }, estado: { paso: o.paso === undefined ? 9 : o.paso } };
  };
  // El juego fija la escala con todo lo que puede ocupar la figura en la media vuelta (sombra y paralelogramo).
  const MARCO_P = [[-3, -0.7], [7, 3]];
  // Ejemplos resueltos de «Productos». Cuentas revisadas con un script aparte, que las rehace sin el código de la unidad: 6 · 5 · 1/2; 2 · 4 + 3 · (−1);
  // 3 · 8 + 4 · (−6); 4 · 5 · 1/2; 3 · 2 (î × ĵ); 8/(2√2 · 4) = √2/2; 30 · 20 − 10 · 10; 12 · √2/2 ≈ 8,49; 12 − 3m = 0;
  // 2 · 1 − 5 · 3; 50 · 20 · 4/5; 40 · 15 + (−30) · 0; 0,3 · 50 · 4/5; −12/24 y 24 · √3/2 ≈ 20,78; (40, 10) × (10, 30) = 1100.
  // Las figuras de A y B desde un mismo punto salen de prod, la misma de «Mira» (sombra de B y paralelogramo a escala).
  const pr = (a, b, g, o = {}) => {
    const c = prod(a, b, g, Object.assign({ circulo: false }, o));
    if (o.valores !== false) { c.datos.flechas[0].valor = f(a, 0); c.datos.flechas[1].valor = f(b, 0); }
    if (o.ladoB) c.datos.flechas[1].lado = o.ladoB;
    return flx(c.datos, c.estado);
  };
  const EJEMPLOS_PRODUCTOS = [
    { nivel: 1, titulo: 'El escalar con el ángulo', figura: pr(6, 5, 60, { pasoP: 99 }),
      enunciado: ['Dos vectores de ', A, ' = 6 y ', B, ' = 5 forman ', th, ' = 60°. ¿Cuánto vale ', vA, ' · ', vB, '? Dato: cos 60° = 1/2.'],
      solucion: [
        { texto: ['El producto escalar es A por la sombra de B sobre A.'], ecuacion: [vA, ' · ', vB, ' = ', A, B, ' cos ', th, ' = 6 · 5 · cos 60° = 6 · 5 · 1/2 = 15'] },
      ],
      respuesta: [vA, ' · ', vB, ' = 15: un número, sin dirección'] },
    { nivel: 1, titulo: 'El escalar con componentes',
      figura: flx({ unidad: 'u', guias: ejesG(-1, 5, -2, 4), flechas: [{ de: [0, 0], a: [2, 3], color: 'o', rotulo: 'A', rotuloEn: 0.95 }, { de: [0, 0], a: [4, -1], color: 'i', rotulo: 'B' }] }),
      enunciado: ['Si ', vA, ' = 2î + 3ĵ y ', vB, ' = 4î − ĵ, ¿cuánto vale ', vA, ' · ', vB, '?'],
      solucion: [
        { texto: ['Cada componente se multiplica con la de su mismo eje, y los dos productos se suman.'], ecuacion: [vA, ' · ', vB, ' = (2)(4) + (3)(−1) = 8 − 3 = 5'] },
      ],
      respuesta: [vA, ' · ', vB, ' = 5'] },
    { nivel: 1, titulo: '¿Son perpendiculares?',
      figura: flx({ unidad: 'u', guias: ejesG(-1, 9, -7, 5), flechas: [{ de: [0, 0], a: [3, 4], color: 'o', rotulo: 'A', rotuloEn: 0.95 }, { de: [0, 0], a: [8, -6], color: 'i', rotulo: 'B' }], angulos: [{ en: [0, 0], de: -36.87, a: 53.13, color: 'h' }] }),
      enunciado: ['¿Son perpendiculares los vectores ', vA, ' = 3î + 4ĵ y ', vB, ' = 8î − 6ĵ?'],
      solucion: [
        { texto: ['Dos vectores son perpendiculares si su producto escalar vale 0: ninguno hace sombra sobre el otro.'], ecuacion: [vA, ' · ', vB, ' = (3)(8) + (4)(−6) = 24 − 24 = 0'] },
      ],
      respuesta: ['Sí: ', vA, ' · ', vB, ' = 0, forman 90°'] },
    { nivel: 1, titulo: 'El área que encierran', figura: pr(4, 5, 30, { pasoS: 99 }),
      enunciado: ['Dos vectores de ', A, ' = 4 y ', B, ' = 5 forman ', th, ' = 30°. ¿Cuánto mide ', vA, ' × ', vB, '? Dato: sen 30° = 1/2.'],
      solucion: [
        { texto: ['El módulo del producto vectorial es el área del paralelogramo que arman A y B: base por altura.'], ecuacion: ['|', vA, ' × ', vB, '| = ', A, B, ' sen ', th, ' = 4 · 5 · sen 30° = 4 · 5 · 1/2 = 10'] },
      ],
      respuesta: ['|', vA, ' × ', vB, '| = 10'] },
    { nivel: 1, titulo: '¿Sale o entra?',
      figura: flx({ unidad: 'u', flechas: [{ de: [0, 0], a: [3, 0], color: 'o', rotulo: 'A', valor: '3î' }, { de: [0, 0], a: [0, 2], color: 'i', rotulo: 'B', valor: '2ĵ', lado: -1, rotuloEn: 0.8 }],
        guias: [{ de: [3, 0], a: [3, 2], color: 'd' }, { de: [0, 2], a: [3, 2], color: 'd' }], fuera: [{ en: [1.5, 1], sentido: 'sale', rotulo: 'A × B', color: 'd' }] }),
      enunciado: ['Si ', vA, ' = 3î y ', vB, ' = 2ĵ, ¿cuánto vale ', vA, ' × ', vB, ' y hacia dónde apunta? ¿Y ', vB, ' × ', vA, '?'],
      solucion: [
        { texto: ['î × ĵ = k̂: con la mano derecha, dedos de x hacia y, el pulgar sale de la pantalla.'], ecuacion: [vA, ' × ', vB, ' = 3 · 2 (î × ĵ) = 6k̂,  sale: ⊙'] },
        { texto: ['Si se cambia el orden, cambia el sentido.'], ecuacion: [vB, ' × ', vA, ' = −6k̂,  entra: ⊗'] },
      ],
      respuesta: ['6k̂, que sale (⊙); al revés, −6k̂, que entra (⊗)'] },
    { nivel: 2, titulo: 'El ángulo entre dos vectores',
      figura: flx({ unidad: 'u', guias: ejesG(-1, 5, -1, 3), flechas: [{ de: [0, 0], a: [2, 2], color: 'o', rotulo: 'A' }, { de: [0, 0], a: [4, 0], color: 'i', rotulo: 'B', lado: -1 }], angulos: [{ en: [0, 0], de: 0, a: 45, texto: 'θ', color: 'h', radio: 30 }] }),
      enunciado: ['¿Qué ángulo forman los vectores ', vA, ' = 2î + 2ĵ y ', vB, ' = 4î?'],
      solucion: [
        { texto: ['El escalar se calcula con componentes.'], ecuacion: [vA, ' · ', vB, ' = (2)(4) + (2)(0) = 8'] },
        { texto: ['También vale A B cos θ. Con los módulos, |A| = 2√2 y |B| = 4, se despeja el coseno.'], ecuacion: ['cos ', th, ' = ', { frac: ['8', '2√2 · 4'] }, ' = ', { frac: ['1', '√2'] }, ' = √2/2,   ', th, ' = 45°'] },
      ],
      respuesta: [th, ' = 45°'] },
    { nivel: 2, titulo: 'Una chacra en paralelogramo',
      figura: flx({ unidad: 'm', contorno: [[0, 0], [30, 10], [40, 30], [10, 20]], flechas: [{ de: [0, 0], a: [30, 10], color: 'o', rotulo: 'A' }, { de: [0, 0], a: [10, 20], color: 'i', rotulo: 'B' }],
        guias: [{ de: [30, 10], a: [40, 30], color: 'd' }, { de: [10, 20], a: [40, 30], color: 'd' }], segmentos: [{ de: [20, 15], a: [20, 15], texto: '500 m²', color: 'd' }] }),
      enunciado: ['Una chacra tiene forma de paralelogramo. Dos de sus lados, desde una esquina, son ', vA, ' = 30î + 10ĵ y ', vB, ' = 10î + 20ĵ, en metros. ¿Cuál es su área?'],
      solucion: [
        { texto: ['El área del paralelogramo es el módulo del producto vectorial de sus dos lados.'] },
        { texto: ['Se cruzan las componentes y se restan: x de A por y de B, menos y de A por x de B.'], ecuacion: [vA, ' × ', vB, ' = [(30)(20) − (10)(10)] k̂ = (600 − 100) k̂ = 500 k̂'] },
      ],
      respuesta: ['500 m²'] },
    { nivel: 2, titulo: 'Cuando los dos productos empatan', figura: pr(4, 3, 45),
      enunciado: ['Dos vectores miden ', A, ' = 4 y ', B, ' = 3. ¿Con qué ángulo ', th, ' el producto escalar vale lo mismo que el módulo del vectorial? ¿Cuánto vale cada uno?'],
      solucion: [
        { texto: ['Se igualan las dos fórmulas; A y B se cancelan.'], ecuacion: [A, B, ' cos ', th, ' = ', A, B, ' sen ', th, '   →   tan ', th, ' = 1'] },
        { texto: ['El ángulo con tangente 1 es 45°. Se reemplaza en cualquiera de las dos.'], ecuacion: [th, ' = 45°,   4 · 3 · cos 45° = 12 · √2/2 = 6√2 ≈ 8,49'] },
      ],
      respuesta: [th, ' = 45°; los dos valen 6√2 ≈ 8,49'] },
    { nivel: 2, titulo: 'El valor que los vuelve perpendiculares',
      figura: flx({ unidad: 'u', guias: ejesG(-1, 7, -4, 5), flechas: [{ de: [0, 0], a: [2, 4], color: 'o', rotulo: 'A', rotuloEn: 0.95 }, { de: [0, 0], a: [6, -3], color: 'i', rotulo: 'B' }], angulos: [{ en: [0, 0], de: -26.57, a: 63.43, color: 'h' }] }),
      enunciado: ['¿Para qué valor de m son perpendiculares ', vA, ' = 2î + mĵ y ', vB, ' = 6î − 3ĵ?'],
      solucion: [
        { texto: ['Perpendiculares quiere decir producto escalar cero.'], ecuacion: [vA, ' · ', vB, ' = (2)(6) + (m)(−3) = 12 − 3m = 0'] },
        { texto: ['Se despeja m.'], ecuacion: ['3m = 12,   m = 4'] },
      ],
      respuesta: ['m = 4, y ', vA, ' = 2î + 4ĵ'] },
    { nivel: 2, titulo: 'El vectorial con componentes',
      figura: flx({ unidad: 'u', guias: [...ejesG(-1, 6, -1, 7), { de: [2, 5], a: [5, 6], color: 'd' }, { de: [3, 1], a: [5, 6], color: 'd' }], flechas: [{ de: [0, 0], a: [2, 5], color: 'o', rotulo: 'A', rotuloEn: 0.95 }, { de: [0, 0], a: [3, 1], color: 'i', rotulo: 'B' }],
        fuera: [{ en: [2.5, 3], sentido: 'entra', rotulo: 'A × B', color: 'd' }] }),
      enunciado: ['Si ', vA, ' = 2î + 5ĵ y ', vB, ' = 3î + ĵ, ¿cuánto vale ', vA, ' × ', vB, '? ¿Sale de la pantalla o entra?'],
      solucion: [
        { texto: ['x de A por y de B, menos y de A por x de B, en ese orden.'], ecuacion: [vA, ' × ', vB, ' = [(2)(1) − (5)(3)] k̂ = (2 − 15) k̂ = −13 k̂'] },
        { texto: ['El signo menos dice que apunta contra k̂: entra en la pantalla, ⊗. De A hacia B se gira en sentido horario.'] },
      ],
      respuesta: [vA, ' × ', vB, ' = −13 k̂: entra (⊗)'] },
    { nivel: 3, titulo: 'El trabajo de jalar un costal',
      figura: ff({ objeto: 'caja', texto: 'papa', flechas: [{ ang: 37, mod: 50, color: 'o', rotulo: 'F', valor: '50 N' }, { desde: [-34, 48], ang: 0, mod: 20, color: 'i', rotulo: 'd', valor: '20 m' }], angulos: [{ de: 0, a: 37, texto: '37°', radio: 34 }] }),
      enunciado: ['Un agricultor jala un costal de papa con una soga: ', F, ' = 50 N, a ', th, ' = 37° del piso. Lo arrastra ', dv, ' = 20 m por el piso. ¿Cuánto trabajo hace la soga? Dato: cos 37° = 4/5.'],
      solucion: [
        { texto: ['El trabajo es el producto escalar de la fuerza y el desplazamiento: solo trabaja la parte de F que va en la dirección del movimiento.'], ecuacion: ['W = ', vF, ' · ', vdv, ' = ', F, dv, ' cos ', th] },
        { texto: ['Se reemplaza. El joule, J, es newton por metro.'], ecuacion: ['W = 50 · 20 · cos 37° = 50 · 20 · 4/5 = 800 J'] },
      ],
      respuesta: ['W = 800 J'] },
    { nivel: 3, titulo: 'El trabajo con componentes',
      figura: ff({ objeto: 'carretilla', flechas: [{ hasta: 'manijas', ang: -36.87, mod: 50, color: 'o', rotulo: 'F', valor: '50 N' }, { desde: 'manijas', de: [-40, 30], a: [0, 30], color: 'o', rotulo: '40 N', discontinua: true }, { desde: 'manijas', de: [0, 30], a: [0, 0], color: 'o', rotulo: '30 N', discontinua: true, rotuloEn: 0.6 }, { desde: 'piso', ang: 0, mod: 15, color: 'i', rotulo: 'd', valor: '15 m' }] }),
      enunciado: ['Se empuja una carretilla con ', vF, ' = 40î − 30ĵ N, y avanza ', vdv, ' = 15î m por el piso. ¿Cuánto trabajo hace esa fuerza? ¿Qué parte de la fuerza no trabaja?'],
      solucion: [
        { texto: ['El trabajo es el producto escalar: x con x, y con y.'], ecuacion: ['W = ', vF, ' · ', vdv, ' = (40)(15) + (−30)(0) = 600 J'] },
        { texto: ['La parte vertical, −30ĵ N, es perpendicular al desplazamiento: aprieta la carretilla contra el piso, pero no trabaja.'] },
      ],
      respuesta: ['W = 600 J; la parte vertical, de 30 N, no trabaja'] },
    { nivel: 3, titulo: 'La llave y la tuerca',
      figura: ff({ objeto: 'llave', cota: 'r = 0,3 m', flechas: [{ desde: 'punta', ang: 53.13, mod: 50, color: 'o', rotulo: 'F', valor: '50 N' }], angulos: [{ en: 'punta', de: 0, a: 53.13, texto: '53°' }], fuera: [{ en: 'tuerca', sentido: 'sale', rotulo: 'τ', color: 'd' }] }),
      enunciado: ['Para aflojar una tuerca, un mecánico empuja el extremo de una llave de ', rv, ' = 0,3 m con ', F, ' = 50 N, a ', th, ' = 53° de la llave. ¿Cuánto vale el torque? Dato: sen 53° = 4/5.'],
      solucion: [
        { texto: ['El torque, τ, es el producto vectorial del brazo y la fuerza: solo hace girar la parte de F perpendicular a la llave.'], ecuacion: [tau, ' = |', vrv, ' × ', vF, '| = ', rv, F, ' sen ', th] },
        { texto: ['Se reemplaza.'], ecuacion: [tau, ' = 0,3 · 50 · sen 53° = 0,3 · 50 · 4/5 = 12 N·m'] },
        { texto: ['Mano derecha, dedos de r hacia F: el pulgar sale de la pantalla, ⊙. La llave gira en sentido antihorario.'] },
      ],
      respuesta: [tau, ' = 12 N·m, saliendo de la pantalla (⊙)'] },
    { nivel: 3, titulo: 'El ángulo desde el escalar', figura: pr(6, 4, 120, { ladoB: -1 }),
      enunciado: ['Dos vectores de ', A, ' = 6 y ', B, ' = 4 cumplen ', vA, ' · ', vB, ' = −12. ¿Qué ángulo forman y cuánto mide ', vA, ' × ', vB, '? Dato: sen 120° = √3/2.'],
      solucion: [
        { texto: ['Del escalar se despeja el coseno. Es negativo: forman más de 90°.'], ecuacion: ['cos ', th, ' = ', { frac: ['−12', '6 · 4'] }, ' = −1/2,   ', th, ' = 120°'] },
        { texto: ['Con ese ángulo, el módulo del vectorial.'], ecuacion: ['|', vA, ' × ', vB, '| = 6 · 4 · sen 120° = 24 · √3/2 = 12√3 ≈ 20,8'] },
      ],
      respuesta: [th, ' = 120°; |', vA, ' × ', vB, '| = 12√3 ≈ 20,8'] },
    { nivel: 3, titulo: 'Tres estacas en la chacra',
      figura: flx({ unidad: 'm', guias: [...ejesG(0, 55, 0, 45), { de: [50, 20], a: [20, 40], color: 'd' }], flechas: [{ de: [10, 10], a: [50, 20], color: 'o', rotulo: 'A' }, { de: [10, 10], a: [20, 40], color: 'i', rotulo: 'B' }],
        puntos: [{ x: 10, y: 10, rotulo: 'P' }, { x: 50, y: 20, rotulo: 'Q' }, { x: 20, y: 40, rotulo: 'S' }] }),
      enunciado: ['Tres estacas marcan un terreno triangular en P(10; 10), Q(50; 20) y S(20; 40), en metros. ¿Cuál es su área?'],
      solucion: [
        { texto: ['Desde P se trazan dos lados como vectores: punta menos cola.'], ecuacion: [vA, ' = Q − P = 40î + 10ĵ,   ', vB, ' = S − P = 10î + 30ĵ'] },
        { texto: ['El vectorial da el área del paralelogramo que arman A y B.'], ecuacion: [vA, ' × ', vB, ' = [(40)(30) − (10)(10)] k̂ = 1100 k̂'] },
        { texto: ['El triángulo es la mitad de ese paralelogramo.'], ecuacion: ['Área = 1100 ÷ 2 = 550 m²'] },
      ],
      respuesta: ['550 m²'] },
  ];

  const productos = {
    id: 'productos',
    titulo: 'Productos',
    pregunta: '¿De qué dos maneras se multiplican dos flechas?',
    temas: ['Producto escalar y vectorial'],
    pieza: 'flechas',
    // Contrato «se entiende sin profesor» (16 nov): Lee, misión, leyenda, Así se resuelve y las palabras del Resumen.
    lee: {
      tarjetas: [
        { titulo: 'Dos maneras de multiplicar', texto: 'Dos flechas se multiplican de dos maneras. Una da un número: el producto escalar, A · B. La otra da una flecha nueva: el producto vectorial, A × B.' },
        { titulo: 'La sombra y el área', texto: 'La sombra de B sobre A es lo que B avanza en la dirección de A. Y A y B, desde un mismo punto, arman un paralelogramo cuya área cambia cuando B gira.' },
        { titulo: 'k̂ y la mano derecha', texto: 'Además de î y ĵ está k̂: mide 1 y sale de la pantalla hacia ti. ⊙ es una flecha que sale; ⊗, una que entra. Mano derecha: dedos de A hacia B; el pulgar da A × B.' },
        { titulo: 'Qué mirar al jugar', texto: 'B gira sola. Mira cuándo la sombra crece, cuándo desaparece y cuándo el área es la mayor.' },
      ],
    },
    actividad: 'Girar B y comparar su sombra sobre A con el área que encierran juntas.',
    ejemplos: EJEMPLOS_PRODUCTOS,
    aprendizaje: 'El producto escalar es A por la sombra de B: un número. El vectorial mide el área y apunta fuera del plano.',
    juega: {
      consigna: 'A = 4 y B = 3. B gira sola; arrástrala para dejarla quieta. Mira su sombra sobre A y el área.',
      mision: {
        texto: 'Haz que el producto escalar valga 0.',
        logrado: val => Math.abs(cosG(val.g)) < 1e-9,
        bien: 'A 90°, B no hace sombra sobre A: escalar 0 y área máxima.',
      },
      voz: 'Busca dónde la sombra desaparece y dónde el área es mayor.',
      leyenda: [
        { s: [A, ', ', B], t: 'las dos flechas: miden 4 y 3' },
        { s: [th], t: 'el ángulo entre A y B' },
        { s: ['·'], t: 'producto escalar: da un número' },
        { s: ['×'], t: 'producto vectorial: da una flecha' },
      ],
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
      datos: prod(4, 3, 60, { circulo: false, pasoS: 1, pasoP: 3, pasoK: 4 }).datos,
      pasos: [
        { estado: { paso: 0 }, texto: 'A mide 4, B mide 3 y forman 60°.', ecuacion: [A, ' = 4,  ', B, ' = 3,  ', th, ' = 60°'] },
        { estado: { paso: 1 }, texto: 'La sombra de B sobre A mide 3 · cos 60° = 1,5.', ecuacion: ['B cos θ = 3 · cos 60° = 3 · 0,5 = 1,5'] },
        { estado: { paso: 2 }, texto: 'El producto escalar da una magnitud escalar: un número, sin dirección.', ecuacion: [vA, ' · ', vB, ' = ', A, B, ' cos ', th, ' = 4 · 3 · cos 60° = 4 · 1,5 = 6'] },
        { estado: { paso: 3 }, texto: 'El vectorial mide el área del paralelogramo.', ecuacion: ['|', vA, ' × ', vB, '| = ', A, B, ` sen `, th, ` = ${f(12 * senG(60), 2)}`] },
        { estado: { paso: 4 }, texto: 'A × B sale de la pantalla: ⊙. Dedos de A a B; el pulgar apunta.', ecuacion: [vA, ' × ', vB, ` = ${f(12 * senG(60), 2)} k̂`] },
        { estado: { paso: 4 }, texto: 'Con componentes, el escalar multiplica cada eje por su eje y suma.', ecuacion: [vA, ' · ', vB, ' = ', { sub: [A, 'x'] }, { sub: [B, 'x'] }, ' + ', { sub: [A, 'y'] }, { sub: [B, 'y'] }, ';   (3î + 4ĵ) · (2î + ĵ) = 6 + 4 = 10'] },
        { estado: { paso: 4 }, texto: 'El vectorial multiplica en cruz, x de una por y de otra, y resta.', ecuacion: [vA, ' × ', vB, ' = (', { sub: [A, 'x'] }, { sub: [B, 'y'] }, ' − ', { sub: [A, 'y'] }, { sub: [B, 'x'] }, ') k̂'] },
      ],
    },
    regla: {
      texto: 'El producto escalar es un número: A por la sombra de B. El vectorial es un vector perpendicular a ambos, de módulo igual al área del paralelogramo.',
      ecuacion: [vA, ' · ', vB, ' = ', A, { llave: [B, ' cos ', th], nota: 'sombra de B', color: 'c-i' }, '   ·   ', '|', vA, ' × ', vB, '| = ', { llave: [A, B, ' sen ', th], nota: 'área', color: 'c-d' }],
      condicion: 'θ es el ángulo entre A y B. B × A mide lo mismo que A × B, pero apunta al revés.',
    },
    resuelve: {
      generar(s) {
        const r = azar(s + 800), tipo = s % 4;
        if (tipo === 3) {
          // El vectorial con componentes, resuelto (lector en frío, ronda 2: no había ningún ejemplo con números).
          const [a1, a2, b1, b2] = r.de([[3, 2, 1, 4], [2, 5, 3, 1], [4, -1, 2, 3], [1, 3, -2, 2]]), pv = a1 * b2 - a2 * b1;
          const t = (x, y) => `${f(x, 0)}î ${y < 0 ? '−' : '+'} ${f(Math.abs(y), 0)}ĵ`;
          return {
            enunciado: ['Si ', vA, ` = ${t(a1, a2)} y `, vB, ` = ${t(b1, b2)}, ¿cuánto vale `, vA, ' × ', vB, '?'],
            pasos: [
              { tipo: 'pide', texto: 'Piden el producto vectorial: una flecha que sale del plano, según k̂.' },
              { tipo: 'datos', texto: `Aₓ = ${f(a1, 0)}, Aᵧ = ${f(a2, 0)}; Bₓ = ${f(b1, 0)}, Bᵧ = ${f(b2, 0)}.` },
              { tipo: 'regla', texto: 'x de A por y de B, menos y de A por x de B. En ese orden.', ecuacion: [vA, ' × ', vB, ' = (', { sub: [A, 'x'] }, { sub: [B, 'y'] }, ' − ', { sub: [A, 'y'] }, { sub: [B, 'x'] }, ') k̂'] },
              { tipo: 'cuentas', texto: 'Se reemplaza con sus signos.', ecuacion: [`(${f(a1, 0)})(${f(b2, 0)}) − (${f(a2, 0)})(${f(b1, 0)}) = ${f(a1 * b2, 0)} − (${f(a2 * b1, 0)}) = ${f(pv, 0)}`] },
              { tipo: 'sentido', texto: pv > 0 ? `${f(pv, 0)} k̂: positivo, sale de la pantalla. B × A daría ${f(-pv, 0)} k̂.` : `${f(pv, 0)} k̂: negativo, entra en la pantalla. B × A daría ${f(-pv, 0)} k̂.` },
            ],
            respuesta: [vA, ' × ', vB, ` = ${f(pv, 0)} k̂`],
          };
        }
        if (tipo === 0) {
          const [a, b, g, cs] = r.de([[10, 5, 60, 0.5], [8, 5, 37, 0.8], [6, 10, 53, 0.6], [4, 5, 120, -0.5]]), pe = a * b * cs;
          return {
            enunciado: ['Dos vectores de ', A, ` = ${f(a, 0)} y `, B, ` = ${f(b, 0)} forman `, th, ` = ${g}°. ¿Cuánto vale `, vA, ' · ', vB, '?'],
            pasos: [
              { tipo: 'pide', texto: 'Piden el producto escalar: un número.' },
              { tipo: 'datos', texto: `A = ${f(a, 0)}, B = ${f(b, 0)} y θ = ${g}°.` },
              { tipo: 'regla', texto: 'El escalar es A por la sombra de B sobre A.', ecuacion: [vA, ' · ', vB, ' = ', A, B, ' cos ', th] },
              { tipo: 'cuentas', texto: `cos ${g}° = ${f(cs, 1)}.`, ecuacion: [vA, ' · ', vB, ` = ${f(a, 0)} · ${f(b, 0)} · ${f(cs, 1)} = ${f(pe, 0)}`] },
              { tipo: 'sentido', texto: g > 90 ? 'Pasado 90°, la sombra cae detrás de A: el escalar sale negativo.' : `Es un número, sin flecha, y menor que ${f(a, 0)} · ${f(b, 0)} = ${f(a * b, 0)} porque cos θ es menor que 1.` },
            ],
            respuesta: [vA, ' · ', vB, ` = ${f(pe, 0)}`],
          };
        }
        if (tipo === 1) {
          const [a, b, g, sn] = r.de([[6, 4, 30, 0.5], [10, 5, 37, 0.6], [5, 4, 53, 0.8], [8, 3, 90, 1]]), pv = a * b * sn;
          return {
            enunciado: ['Dos vectores de ', A, ` = ${f(a, 0)} y `, B, ` = ${f(b, 0)} forman `, th, ` = ${g}°. ¿Cuánto mide `, vA, ' × ', vB, '?'],
            pasos: [
              { tipo: 'pide', texto: 'Piden el módulo del producto vectorial: el área del paralelogramo.' },
              { tipo: 'datos', texto: `A = ${f(a, 0)}, B = ${f(b, 0)} y θ = ${g}°.` },
              { tipo: 'regla', texto: 'El área es base por altura: A por lo que B sube sobre A.', ecuacion: ['|', vA, ' × ', vB, '| = ', A, B, ' sen ', th] },
              { tipo: 'cuentas', texto: `sen ${g}° = ${f(sn, 1)}.`, ecuacion: ['|', vA, ' × ', vB, `| = ${f(a, 0)} · ${f(b, 0)} · ${f(sn, 1)} = ${f(pv, 0)}`] },
              { tipo: 'sentido', texto: `Apunta fuera del plano, según k̂; su módulo nunca pasa de ${f(a, 0)} · ${f(b, 0)} = ${f(a * b, 0)}.` },
            ],
            respuesta: ['|', vA, ' × ', vB, `| = ${f(pv, 0)}`],
          };
        }
        const [a1, a2, b1, b2] = r.de([[3, 4, 2, -1], [2, 5, 4, 1], [1, 3, 5, 2], [4, -2, 3, 6]]), pe = a1 * b1 + a2 * b2;
        const t = (x, y) => `${f(x, 0)}î ${y < 0 ? '−' : '+'} ${f(Math.abs(y), 0)}ĵ`;
        return {
          enunciado: ['Si ', vA, ` = ${t(a1, a2)} y `, vB, ` = ${t(b1, b2)}, ¿cuánto vale `, vA, ' · ', vB, '?'],
          pasos: [
            { tipo: 'pide', texto: 'Piden el producto escalar con componentes.' },
            { tipo: 'datos', texto: `Aₓ = ${f(a1, 0)}, Aᵧ = ${f(a2, 0)}; Bₓ = ${f(b1, 0)}, Bᵧ = ${f(b2, 0)}.` },
            { tipo: 'regla', texto: 'Cada componente se multiplica con la de su mismo eje, y se suman.', ecuacion: [vA, ' · ', vB, ' = ', { sub: [A, 'x'] }, { sub: [B, 'x'] }, ' + ', { sub: [A, 'y'] }, { sub: [B, 'y'] }] },
            { tipo: 'cuentas', texto: 'Se reemplaza con sus signos.', ecuacion: [`(${f(a1, 0)})(${f(b1, 0)}) + (${f(a2, 0)})(${f(b2, 0)}) = ${f(a1 * b1, 0)} + (${f(a2 * b2, 0)}) = ${f(pe, 0)}`] },
            { tipo: 'sentido', texto: pe === 0 ? 'Da 0: A y B son perpendiculares.' : `Da ${f(pe, 0)}: un número, sin î ni ĵ. ${pe < 0 ? 'Negativo: forman más de 90°.' : 'Positivo: forman menos de 90°.'}` },
          ],
          respuesta: [vA, ' · ', vB, ` = ${f(pe, 0)}`],
        };
      },
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
    // Unidad nueva del 16 nov: sale de «Magnitudes y vectores» (Gerson eligió partirla).
    version: '0.2.0',
    estado: 'completa',
    // Pasó por el contrato «se entiende sin profesor» (16 nov): misión, leyenda, aprendizaje, actividad, pregunta, palabras
    // del Resumen y 3 ejemplos por término; las cuatro ideas, con lector en frío (rutinas/frio/fisica.vectores.md).
    calidad: 2,
    requiere: ['/nucleo/kit/piezas/fis-dron.js', '/nucleo/kit/piezas/flechas.js', '/nucleo/kit/piezas/fis-fuerzas.js', '/plantillas/vectores/motor.js', '/nucleo/fisica3d.js', '/nucleo/kit/piezas/fis-espacio-3d.js'],
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
      { termino: 'ley de cosenos', formas: ['ley de cosenos', 'ley del coseno', 'teorema de cosenos'], simple: 'La fórmula que da la suma de dos flechas con cualquier ángulo.',
        def: 'Para sumar vectores: R² = A² + B² + 2AB cos θ, con θ entre A y B.',
        ejemplos: ['Con 5, 3 y 60°: R² = 25 + 9 + 15 = 49, y R = 7.', 'Con θ = 90°, cos θ = 0 y queda Pitágoras.', 'Con θ = 180°, cos θ = −1 y R = A − B.'], ver: ['resultante'] },
      { termino: 'resultante', simbolo: 'R', simple: 'La flecha que hace lo mismo que varias juntas.', def: 'Vector que reemplaza a varios: va de la cola del primero a la punta del último.',
        ejemplos: ['A = 3 y B = 4 a 90°: R = 5.', 'Dos personas jalan una caja con 30 N cada una, hacia el mismo lado: R = 60 N.', 'Con 30 N y 20 N en sentidos opuestos: R = 10 N.'], ver: ['vector'] },
      { termino: 'componente', simple: 'Lo que una flecha avanza de lado o sube; sus dos «sombras».', def: 'Lo que un vector avanza a lo largo de un eje, con su signo.',
        ejemplos: ['A = 3î + 4ĵ: Aₓ = 3 y Aᵧ = 4.', 'Una flecha de 10 a 37° del eje x tiene Aₓ = 8 y Aᵧ = 6.', 'Una flecha que apunta al oeste tiene componente x negativa.'], ver: ['vector unitario', 'módulo'] },
      { termino: 'vector unitario', simbolo: 'û', simple: 'Una flechita de largo 1 que apunta igual que la otra.', formas: ['vector unitario', 'vectores unitarios', 'unitario', 'unitarios'],
        def: 'Flecha de largo 1 que apunta igual que otra; sale de dividirla entre su módulo.',
        ejemplos: ['A = 6î + 8ĵ: û = 0,6î + 0,8ĵ.', 'î es el unitario del eje x: mide 1 y apunta a la derecha.', 'Una fuerza de 5 N hacia arriba es 5 veces el unitario ĵ.'], ver: ['componente'] },
      { termino: 'producto escalar', simbolo: 'A · B', simple: 'Un largo por la sombra del otro: da solo un número.', def: 'Número que sale de multiplicar un largo por la sombra del otro: A B cos θ.',
        ejemplos: ['A = 4 y B = 3 a 60°: A · B = 6.', 'Dos flechas perpendiculares: A · B = 0.', 'Empujar un carrito 5 m con 10 N en esa misma dirección da 50 J de trabajo.'], ver: ['producto vectorial'] },
      { termino: 'producto vectorial', simbolo: 'A × B', simple: 'Da una flecha nueva que sale del plano; mide el área que encierran.',
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
