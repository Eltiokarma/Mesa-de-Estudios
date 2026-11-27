/*
 * Apertura de «Movimiento rectilíneo» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * Doble revisión (27 nov): la idea es intuitiva (más lejos, más espera), así que la apertura no fabrica sorpresa y la
 * muestra aplicada (punto 7): como el sonido avanza lo mismo en cada segundo, contar los segundos entre el destello y el
 * trueno da la distancia del rayo, unos 3 s por kilómetro. Lo que el alumno se lleva va en ficha.seLleva.
 * No adelanta la Predice de la idea 1 (la combi en x = 20 m), la de la idea 2 (4 m/s), la de la idea 3 (rapidez media
 * de 3 m/s: aquí no se promedia nada), la de la idea 4 (15 s) ni la de la idea 5 (el bote a 7 m/s), ni la misión de la
 * idea 5 (la combi que parece quieta). Colores de la unidad (cabecera de contenido/teoria/fisica/movimiento-rectilineo.js):
 * el tiempo en turquesa (c-i) y la posición o distancia en violeta (c-f). El rayo va en tinta, sin color de variable.
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const PISO = 236, KM = 60;
  const nube = (x, y) => `<path d="M${x - 34} ${y + 14}q-14 0 -14 -12q0 -13 15 -13q3 -14 19 -14q12 0 17 9q5 -5 12 -5q14 0 15 14q12 1 12 11q0 10 -13 10Z" style="fill:var(--line)" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>`;
  const rayo = (x) => `<path d="M${x + 12} 94l-14 52h12l-12 46h10l-10 44" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round"/>`;
  // Quien mira y escucha, de pie a la izquierda.
  const persona = x => `<circle cx="${x}" cy="${PISO - 50}" r="9" style="fill:var(--card)" stroke="currentColor" stroke-width="3"/>
      <path d="M${x} ${PISO - 41}v24M${x} ${PISO - 17}l-9 17M${x} ${PISO - 17}l9 17M${x - 11} ${PISO - 32}h22" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>`;
  const panel = (x0, titulo, esperas, pie) => {
    const xp = x0 + 24, x1 = xp + KM, x3 = xp + 3 * KM;
    const marca = (x, km, s) => `<line x1="${x}" y1="${PISO - 6}" x2="${x}" y2="${PISO + 6}" stroke="currentColor" stroke-width="2.5"/>
      <text x="${x}" y="${PISO + 28}" text-anchor="middle" font-size="20" font-weight="800" style="fill:var(--c-f)">${km} km</text>
      <text x="${x}" y="${PISO + 54}" text-anchor="middle" font-size="17" style="fill:var(--muted)">trueno:</text>
      <text x="${x}" y="${PISO + 78}" text-anchor="middle" font-size="22" font-weight="800" style="fill:var(--c-i)">${s}</text>`;
    return `<text x="${x0 + 130}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      ${nube(x1, 80)}${nube(x3, 80)}
      ${rayo(x1)}${rayo(x3)}
      <line x1="${x0 + 8}" y1="${PISO}" x2="${x0 + 252}" y2="${PISO}" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
      ${persona(xp)}
      ${marca(x1, 1, esperas[0])}${marca(x3, 3, esperas[1])}
      ${pie.map((l, i) => `<text x="${x0 + 130}" y="${352 + i * 26}" text-anchor="middle" font-size="22" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 390" width="520" height="390" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="380" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', ['antes', 'después'], ['Más lejos,', 'más espera'])}
    ${panel(260, 'Lo que se mide', ['3 s', '9 s'], ['Unos 3 s más', 'por cada kilómetro'])}
  </svg>`;

  return {
    unidad: 'fisica.movimiento-rectilineo',
    titulo: '¿Cómo puedes saber a qué distancia cayó un rayo con solo contar segundos?',
    parrafos: [
      'En la sierra, durante los meses de lluvia, las tormentas eléctricas son frecuentes, y después de cada rayo se oye su trueno. ' +
        'Ya sabes que el trueno llega después del destello, porque la luz te alcanza casi al instante y el sonido viaja mucho más lento por el aire.',
      ['De ahí sale lo que esperarías: mientras más lejos caiga el rayo, más tarda en llegarte su trueno. ',
        'La intuición acierta, y la espera además crece de manera pareja, porque el sonido avanza unos 340 m en cada segundo, ni más ni menos, así que para recorrer un kilómetro tarda unos 3 s:',
        { linea: [{ v: 'c-f', t: '1000 m' }, ' ÷ 340 m/s ≈ ', { v: 'c-i', t: '3 s' }] },
        'Así, el trueno de un rayo a 1 km te llegaría a los 3 s, y el de uno a 3 km, a los 9 s.'],
      'Por eso basta contar los segundos entre el destello y el trueno para saber a qué distancia cayó el rayo, algo útil en el altiplano, donde los rayos son un peligro para quien está en el campo. ' +
        'El movimiento que avanza lo mismo en cada segundo, sin acelerar ni frenar, es el primero que estudia esta unidad, junto con la manera de decir dónde está algo y hacia dónde va.',
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos dibujos iguales: una persona y dos rayos, uno a 1 km y otro a 3 km. Lo que predice la intuición: el trueno del rayo lejano llega después que el del cercano, más lejos, más espera. Lo que se mide: el trueno del rayo a 1 km llega a los 3 s y el del rayo a 3 km, a los 9 s, unos 3 s más por cada kilómetro.',
    },
    pregunta: 'Si en un trueno cuentas 12 s y, unos minutos después, en el siguiente cuentas 6 s, ¿crees que la tormenta se acercó o se alejó de ti, y cuántos kilómetros?',
    ficha: {
      seLleva: 'Como el sonido avanza lo mismo en cada segundo, unos 340 m, contar los segundos entre el destello y el trueno dice a qué distancia cayó el rayo: unos 3 s por cada kilómetro.',
      alcance: 'Parcial (núcleo: qué cambia, respecto de qué y en qué intervalo; una rapidez constante convierte un tiempo en una distancia).',
      choque: 'Sin choque forzado (punto 7 de la segunda revisión): la intuición, más lejos más espera, es correcta; lo medido la vuelve útil, porque la espera crece pareja, 3 s a 1 km y 9 s a 3 km, y contar segundos da la distancia.',
      atajo: 'El mejor alumno sabe que el sonido es más lento que la luz, y el texto parte de ahí en vez de fingir que no lo sabe. Lo que la unidad agrega es que la espera crece pareja con la distancia porque la rapidez del sonido no cambia, y que eso convierte un tiempo en una distancia.',
      porVerificar: [
        'Rapidez del sonido en el aire: unos 343 m/s a 20 °C y unos 331 m/s a 0 °C, así que en la sierra fría da unos 3 s por kilómetro igual (de memoria).',
        'Que el trueno sea el estruendo del aire calentado de golpe por la descarga (de memoria; es la explicación aceptada).',
        'Que las tormentas eléctricas sean frecuentes en la sierra en los meses de lluvia (de diciembre a marzo); conviene una fuente del Senamhi sobre la actividad eléctrica en Puno y Cusco.',
        'Los 3 s y 9 s salen de la cuenta con 340 m/s, no de una medición propia: falta medirlo en una tormenta o citar una práctica publicada.',
        'Que los rayos sean un peligro para quien está en el campo en el altiplano (de memoria: Puno suele figurar entre las regiones con más muertes por rayo; conviene una fuente del Senamhi o del Indeci).',
      ],
      notas: [
        'La pregunta se puede intentar con el párrafo 2: a 3 s por kilómetro, 12 s son 4 km y 6 s son 2 km, así que la tormenta se acercó unos 2 km. La clase recoge la idea de rapidez constante (distancia igual en cada segundo) para presentar el MRU.',
        'El texto dice la rapidez del sonido y que la espera crece pareja con la distancia; no da la fórmula ni hace la cuenta de la pregunta, ni dice qué significa que los segundos bajen de un trueno al siguiente.',
        'Se descartó el choque de la rapidez media (ida y vuelta a rapideces distintas), que era el más fuerte, porque es la Predice de la idea 3; y el de la combi vecina que parece quieta, porque es la misión de la idea 5.',
        'Revisión del Escribidor Escribano (27 nov): el párrafo 1 pasó a condicional («si el rayo cayera…, el trueno te llegaría»), porque los 3 s y 9 s son cálculo con 340 m/s. No delata ninguna Predice ni misión. Contenido, para Gerson: el choque es más débil de lo que parece, porque casi todo alumno de 5.º ya sabe que el sonido es más lento que la luz, así que el panel «Lo que predice» (trueno junto con el destello) se acerca a un muñeco de paja. Lo que sí le enseña algo es que la espera crezca pareja con la distancia (3 s por kilómetro), que es la rapidez constante; el párrafo 2 lo dice al descartar la espera fija. La pregunta se responde con una regla de tres a partir del párrafo 1 (6 s, 2 km): se puede intentar, pero es fácil.',
        'Doble revisión (27 nov): era casi un muñeco de paja (el panel «Lo que predice» ponía el trueno junto con el destello, y casi todo alumno sabe que el sonido es más lento que la luz). Se reescribió con el punto 7: el título pasó de «¿Por qué el trueno llega segundos después del rayo, si los dos nacen a la vez?» a «¿Cómo puedes saber a qué distancia cayó un rayo con solo contar segundos?»; el párrafo 1 parte de lo que el alumno ya sabe; el párrafo 2 presenta la intuición (más lejos, más espera) como correcta y le agrega los 3 s por kilómetro; el párrafo 3 la aplica (saber dónde cayó el rayo, útil en el altiplano). El panel «Lo que predice» pasó de «0 s, 0 s» a «antes, después» con el pie «Más lejos, más espera». La pregunta ya no es la regla de tres directa (6 s, 2 km): compara dos truenos (12 s y 6 s) para decir si la tormenta se acerca y cuánto, que es para lo que sirve contar.',
        'Tercera pasada (27 nov): el párrafo 2 saca a su línea 1000 m ÷ 340 m/s ≈ 3 s (antes «son unos 3 s por cada kilómetro» en la oración); los ejemplos de 1 km y 3 km siguen en la oración como datos.',
      ],
    },
  };
})());
