/*
 * Apertura de «Movimiento rectilíneo» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * El choque es el de las tormentas de la sierra: el rayo y el trueno nacen a la vez, pero el trueno llega después, y
 * más tarde cuanto más lejos cae el rayo (unos 3 s por kilómetro). Lo que el alumno se lleva va en ficha.seLleva.
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
    ${panel(0, 'Lo que predice', ['0 s', '0 s'], ['Trueno junto', 'con el destello'])}
    ${panel(260, 'Lo que se mide', ['3 s', '9 s'], ['Unos 3 s más', 'por cada kilómetro'])}
  </svg>`;

  return {
    unidad: 'fisica.movimiento-rectilineo',
    titulo: '¿Por qué el trueno llega segundos después del rayo, si los dos nacen a la vez?',
    parrafos: [
      'En la sierra, durante los meses de lluvia, las tormentas eléctricas son frecuentes, y después de cada rayo se oye su trueno. ' +
        'El rayo y el trueno nacen en el mismo instante, porque el trueno es el estruendo del aire que el rayo calienta de golpe. ' +
        'Aun así, si el rayo cayera a 1 km de ti, el trueno te llegaría unos 3 s después del destello, y si cayera a 3 km, unos 9 s después.',
      'Cuando alguien te habla de cerca, lo que ves y lo que oyes llegan juntos, así que el trueno tendría que sonar al mismo tiempo que el destello. ' +
        'Hay quien explica la espera diciendo que el trueno sale un rato después del rayo, pero en ese caso la espera sería siempre la misma, y no lo es: crece con la distancia.',
      'La luz del rayo te llega casi al instante, mientras que el sonido avanza por el aire a una rapidez que no cambia, de unos 340 m en cada segundo. ' +
        'Por eso cada kilómetro de distancia le agrega al trueno la misma espera, y un reloj sirve para medir a qué distancia cayó el rayo. ' +
        'El movimiento que avanza lo mismo en cada segundo, sin acelerar ni frenar, es el primero que estudia esta unidad, junto con la manera de decir dónde está algo y hacia dónde va.',
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos dibujos iguales: una persona y dos rayos, uno a 1 km y otro a 3 km. Lo que predice la idea de que lo que pasa a la vez se oye a la vez: los dos truenos suenan a los 0 s. Lo que se mide: el trueno del rayo a 1 km llega a los 3 s y el del rayo a 3 km, a los 9 s.',
    },
    pregunta: 'Si ves el destello de un rayo y cuentas 6 s hasta que suena el trueno, ¿a cuántos kilómetros de ti crees que cayó?',
    ficha: {
      seLleva: 'El trueno llega tarde porque el sonido viaja a una rapidez fija, unos 340 m por segundo: contando los segundos entre el destello y el trueno se sabe a qué distancia cayó el rayo.',
      alcance: 'Parcial (núcleo: qué cambia, respecto de qué y en qué intervalo; una rapidez constante convierte un tiempo en una distancia).',
      choque: 'Lo que pasa a la vez se ve y se oye a la vez; el trueno llega 3 s después del destello si el rayo cae a 1 km, y 9 s después si cae a 3 km.',
      atajo: 'El mejor alumno diría que el sonido es más lento que la luz: eso explica que haya espera, pero no que crezca parejo con la distancia, que es lo que pide una rapidez constante. La explicación trampa, que el trueno se produce después del rayo, predice una espera fija y la descarta que la espera crezca con la distancia.',
      porVerificar: [
        'Rapidez del sonido en el aire: unos 343 m/s a 20 °C y unos 331 m/s a 0 °C, así que en la sierra fría da unos 3 s por kilómetro igual (de memoria).',
        'Que el trueno sea el estruendo del aire calentado de golpe por la descarga (de memoria; es la explicación aceptada).',
        'Que las tormentas eléctricas sean frecuentes en la sierra en los meses de lluvia (de diciembre a marzo); conviene una fuente del Senamhi sobre la actividad eléctrica en Puno y Cusco.',
        'Los 3 s y 9 s salen de la cuenta con 340 m/s, no de una medición propia: falta medirlo en una tormenta o citar una práctica publicada.',
      ],
      notas: [
        'La pregunta se puede intentar con el párrafo 1: 3 s por cada kilómetro, así que 6 s son 2 km. La clase recoge la idea de rapidez constante (distancia igual en cada segundo) para presentar el MRU.',
        'El párrafo 3 dice la rapidez del sonido y que la espera crece parejo con la distancia; no da la fórmula ni hace la cuenta de la pregunta.',
        'Se descartó el choque de la rapidez media (ida y vuelta a rapideces distintas), que era el más fuerte, porque es la Predice de la idea 3; y el de la combi vecina que parece quieta, porque es la misión de la idea 5.',
        'Revisión del Escribidor Escribano (27 nov): el párrafo 1 pasó a condicional («si el rayo cayera…, el trueno te llegaría»), porque los 3 s y 9 s son cálculo con 340 m/s. No delata ninguna Predice ni misión. Contenido, para Gerson: el choque es más débil de lo que parece, porque casi todo alumno de 5.º ya sabe que el sonido es más lento que la luz, así que el panel «Lo que predice» (trueno junto con el destello) se acerca a un muñeco de paja. Lo que sí le enseña algo es que la espera crezca pareja con la distancia (3 s por kilómetro), que es la rapidez constante; el párrafo 2 lo dice al descartar la espera fija. La pregunta se responde con una regla de tres a partir del párrafo 1 (6 s, 2 km): se puede intentar, pero es fácil.',
      ],
    },
  };
})());
