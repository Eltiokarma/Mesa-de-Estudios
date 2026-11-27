/*
 * Apertura de «Razonamiento inductivo» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * Escrita desde cero (27 nov). El choque está en un objeto que el alumno conoce: un tablero de ajedrez no tiene 64
 * cuadrados, sino 204, si se cuentan los de todos los tamaños. Contarlos uno por uno falla; lo que funciona es contar
 * tableros chicos y ver cómo crece la cuenta, que es la inducción. Lo que el alumno se lleva va en ficha.seLleva.
 * La unidad vecina de la rama (Arreglos numéricos) abre con un código de barras; la anterior de la lista (Certezas), con
 * una prueba casera de medias.
 * No adelanta ninguna Predice: ni la de los fósforos (idea 1), ni la de la torta y las velitas (idea 2, el patrón que se
 * rompe: por eso esta apertura no muestra un patrón que falle), ni la de las chapitas, ni la de las latas, ni la de los
 * nueves ni la de la pulsera. No da la regla de los cuadrados (la suma de los cuadrados de 1 a 8).
 * Colores de la unidad (cabecera de contenido/teoria/razonamiento-matematico/razonamiento-inductivo.js): el tablero en
 * tinta; la casilla sola (el primer dato) en naranja (c-o) y los cuadrados más grandes que se agregan, en turquesa (c-i).
 * Sin verde, carmín ni violeta.
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const casilla = t => ({ v: 'c-o', t }), grande = t => ({ v: 'c-i', t });

  // Tablero de 8 × 8 con la misma escala en los dos paneles; `marcas` son cuadrados [fila, columna, lado, color].
  const L = 23, X = 38, Y = 58;
  const tablero = (x0, marcas) => {
    let s = '';
    for (let f = 0; f < 8; f++) for (let c = 0; c < 8; c++) {
      if ((f + c) % 2) s += `<rect x="${x0 + X + c * L}" y="${Y + f * L}" width="${L}" height="${L}" style="fill:var(--muted)" fill-opacity=".38"/>`;
    }
    const borde = `<rect x="${x0 + X}" y="${Y}" width="${8 * L}" height="${8 * L}" fill="none" stroke="currentColor" stroke-width="3"/>`;
    const m = marcas.map(([f, c, n, col]) => { const d = n === 8 ? -5 : 2; return `<rect x="${x0 + X + c * L + d}" y="${Y + f * L + d}" width="${n * L - 2 * d}" height="${n * L - 2 * d}" rx="3" fill="none" style="stroke:var(${col})" stroke-width="4.5"/>`; }).join('');
    return `<rect x="${x0 + X}" y="${Y}" width="${8 * L}" height="${8 * L}" style="fill:var(--card)"/>${s}${borde}${m}`;
  };
  const pie = (cx, l) => l.map((x, i) => `<text x="${cx}" y="${292 + i * 25}" text-anchor="middle" font-size="21" style="fill:var(--muted)">${x}</text>`).join('');

  const panel = (x0, titulo, marcas, pieTxt) => {
    const cx = x0 + 130;
    return `<text x="${cx}" y="34" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      ${tablero(x0, marcas)}${pie(cx, pieTxt)}`;
  };
  const svg = `<svg viewBox="0 0 520 336" width="520" height="336" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="326" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', [[2, 5, 1, '--c-o']], ['Solo las casillas:', '64 cuadrados'])}
    ${panel(260, 'Lo que se mide', [[2, 5, 1, '--c-o'], [1, 1, 2, '--c-i'], [4, 2, 3, '--c-i'], [0, 0, 8, '--c-i']], ['De todos los tamaños:', '204 cuadrados'])}
  </svg>`;

  return {
    unidad: 'razonamiento-matematico.razonamiento-inductivo',
    titulo: '¿Por qué un tablero de ajedrez tiene más de 64 cuadrados?',
    parrafos: [
      ['Un tablero de ajedrez tiene 8 filas de 8 casillas, así que, si alguien pregunta cuántos cuadrados tiene, la respuesta que sale primero es ',
        casilla('64'), '. ',
        'Sin embargo, un bloque de 2 × 2 casillas también es un cuadrado, igual que uno de 3 × 3 o el tablero entero, y si se cuentan los de todos los tamaños, el tablero tiene ',
        grande('204 cuadrados'), '.'],
      ['La idea más directa es contarlos uno por uno sobre el tablero, pero así es fácil equivocarse, porque los cuadrados grandes se montan unos sobre otros y uno se salta alguno o lo cuenta dos veces. ',
        'La regla de tres tampoco sirve: un tablero de 2 × 2 tiene 5 cuadrados, y como el de 8 × 8 tiene 16 veces más casillas, tendría 80, que no es la cuenta.'],
      ['El 204 sale de contar primero tableros chicos, ver cómo crece la cuenta cuando se agrega una fila y una columna, y seguir así hasta el de 8 × 8. ',
        'Llegar así, desde los casos chicos, a un caso grande que no se puede contar a mano es el razonamiento inductivo, el tema de esta unidad.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos dibujos del mismo tablero de ajedrez de 8 por 8. Lo que predice la primera respuesta: solo cuentan las casillas, 64 cuadrados. Lo que se mide: también son cuadrados los bloques de 2 por 2, de 3 por 3 y el tablero entero, y en total hay 204.',
    },
    pregunta: 'Un tablero de 2 × 2 tiene 5 cuadrados: los 4 chicos y el grande que los junta. ¿Cuántos cuadrados distintos encuentras tú en un tablero de 3 × 3 casillas?',
    ficha: {
      seLleva: 'Lo que se ve primero no siempre es todo lo que hay: un tablero de ajedrez esconde 204 cuadrados, y para contarlos sin perderse se empieza por tableros chicos y se busca cómo crece la cuenta.',
      alcance: 'Parcial (deducción propia con el marco de Matemática PISA 2022: cambio y relaciones, generalizar un patrón; la inducción de examen, con sucesiones de figuras, no es contenido PISA).',
      choque: 'La primera respuesta es 64 cuadrados (las casillas); contando los de todos los tamaños, el tablero tiene 204.',
      atajo: 'Contar uno por uno sobre el tablero, que se pierde porque los cuadrados se montan; y la regla de tres desde el tablero de 2 × 2 (5 cuadrados, 16 veces más casillas, 80), que no da la cuenta. Ninguno de los dos reemplaza a contar tableros chicos y ver cómo crece la cuenta.',
      porVerificar: [
        'Ningún dato sale de memoria: 204 = 64 + 49 + 36 + 25 + 16 + 9 + 4 + 1 (en un tablero de 8 × 8 hay (9 − k)² cuadrados de lado k), y el de 2 × 2 tiene 4 + 1 = 5. Cálculo propio.',
        'Que «64» sea la primera respuesta: es la cuenta de las casillas y la que daría casi cualquiera, pero no hay datos de alumnos.',
      ],
      notas: [
        'El choque no es un patrón que se rompe, a propósito: ese es el de la idea 2 (las velitas y los pedazos), y mostrar otro antes le restaría la sorpresa a esa Predice.',
        'La figura marca la casilla sola en naranja (el primer dato) y tres cuadrados más grandes en turquesa (2 × 2, 3 × 3 y el tablero entero); no los marca todos, porque el dibujo sería una mancha.',
        'La pregunta se responde contando a mano en un tablero chico (9 + 4 + 1 = 14) y es el primer paso de la inducción: el alumno empieza a ver qué agrega cada tamaño. No es ninguna Predice de la unidad.',
        'Para Gerson: el párrafo 3 dice cómo se llega al 204 (casos chicos, ver cómo crece, seguir), sin dar la regla de los cuadrados. Es el método del tema, como el «averiguar qué le pasa a una cantidad» de la pizza.',
        'Revisión del Escribidor Escribano (27 nov, otro agente): el párrafo 2 decía que contar uno por uno «es la que más falla», una comparación sin dato; ahora dice que así es fácil equivocarse. La última oración enunciaba el método de la unidad («encontrar la regla en los casos chicos, comprobar por qué vale y usarla…»), y «comprobar por qué vale» es la regla de la idea 2 («Tres casos no prueban»); se recortó para que quede el choque y el nombre del tema.',
      ],
    },
  };
})());
