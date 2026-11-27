/*
 * Apertura de «Gravitación» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * El choque se ve en el cielo de noche: la Estación Espacial Internacional pasa sobre el Perú como un punto brillante y
 * da una vuelta a la Tierra cada 92 minutos, con astronautas que flotan. La explicación de siempre («allá no hay
 * gravedad») no explica que vuelva a pasar. Lo que el alumno se lleva va en ficha.seLleva. No adelanta la Predice de la
 * idea 1 (240 N), la de la idea 2 (2 N/kg), la de la idea 3 (6 GJ), la de la idea 4 (4 km/s), la de la idea 5 (24 años)
 * ni la de la idea 6 (5 km/s), ni la misión de la idea 4 (la aceleración para girar igual a la de la gravedad: el texto
 * dice que la estación cae y avanza, sin igualar nada). La unidad de teoría no fija colores; la velocidad va en naranja
 * (c-o), la gravedad en carmín (c-h) y el tiempo en turquesa (c-i).
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const r1 = n => Math.round(n * 10) / 10;
  const flecha = (x1, y1, x2, y2, c, w = 5) => {
    const g = Math.atan2(y2 - y1, x2 - x1), p = 13, a = 0.45;
    const bx = x2 - p * Math.cos(g), by = y2 - p * Math.sin(g);
    return `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(bx)}" y2="${r1(by)}" style="stroke:var(${c})" stroke-width="${w}" stroke-linecap="round"/>
      <path d="M${r1(x2)} ${r1(y2)}L${r1(x2 - p * 1.15 * Math.cos(g - a))} ${r1(y2 - p * 1.15 * Math.sin(g - a))}L${r1(x2 - p * 1.15 * Math.cos(g + a))} ${r1(y2 - p * 1.15 * Math.sin(g + a))}Z" style="fill:var(${c})"/>`;
  };
  // La Tierra y la órbita no van a escala: a escala, la estación iría pegada al borde de la Tierra (400 km sobre
  // un radio de 6371 km). La estación es un módulo con dos paneles.
  const CY = 236, RT = 70, RO = 100;
  const estacion = (x, y) => `<rect x="${x - 7}" y="${y - 6}" width="14" height="12" rx="2" style="fill:var(--card)" stroke="currentColor" stroke-width="2.5"/>
      <rect x="${x - 27}" y="${y - 4}" width="17" height="8" style="fill:var(--line)" stroke="currentColor" stroke-width="2"/>
      <rect x="${x + 10}" y="${y - 4}" width="17" height="8" style="fill:var(--line)" stroke="currentColor" stroke-width="2"/>`;
  const panel = (x0, titulo, orbita, pie) => {
    const cx = x0 + 130, ye = CY - RO;
    const camino = orbita
      ? `<circle cx="${cx}" cy="${CY}" r="${RO}" fill="none" style="stroke:var(--muted)" stroke-width="2.5" stroke-dasharray="7 6"/>
        ${flecha(cx, ye + 12, cx, ye + 46, '--c-h')}
        <text x="${cx}" y="${CY + RO + 28}" text-anchor="middle" font-size="19" font-weight="800" style="fill:var(--c-i)">una vuelta cada 92 min</text>`
      : `<line x1="${cx + 30}" y1="${ye}" x2="${x0 + 254}" y2="${ye}" style="stroke:var(--muted)" stroke-width="2.5" stroke-dasharray="7 6"/>
        <text x="${cx}" y="${CY + RO + 28}" text-anchor="middle" font-size="19" font-weight="800" style="fill:var(--muted)">se iría en línea recta</text>`;
    return `<text x="${x0 + 130}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      <text x="${x0 + 130}" y="62" text-anchor="middle" font-size="17" style="fill:var(--muted)">${orbita ? 'con gravedad' : 'sin gravedad'}</text>
      <circle cx="${cx}" cy="${CY}" r="${RT}" style="fill:var(--line)" stroke="currentColor" stroke-width="3"/>
      <text x="${cx}" y="${CY + 7}" text-anchor="middle" font-size="20" font-weight="800" fill="currentColor">Tierra</text>
      ${camino}
      ${flecha(cx + 30, ye, cx + 84, ye, '--c-o')}
      ${estacion(cx, ye)}
      ${pie.map((l, i) => `<text x="${x0 + 130}" y="${CY + RO + 70 + i * 26}" text-anchor="middle" font-size="22" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 ${CY + RO + 110}" width="520" height="${CY + RO + 110}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="${CY + RO + 100}" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', false, ['No volvería', 'a pasar'])}
    ${panel(260, 'Lo que se mide', true, ['Vuelve a pasar', 'una y otra vez'])}
  </svg>`;

  return {
    unidad: 'fisica.gravitacion',
    titulo: '¿Por qué flotan los astronautas, si en la estación espacial hay casi tanta gravedad como aquí?',
    parrafos: [
      'En una noche despejada se puede ver desde el Perú la Estación Espacial Internacional, un punto brillante que no parpadea y cruza el cielo en pocos minutos. ' +
        'Viaja a unos 400 km de altura y da una vuelta completa a la Tierra cada 92 minutos, casi 16 vueltas al día, con astronautas que flotan dentro de ella.',
      'La explicación que más se repite es que allá arriba no hay gravedad, y por eso los astronautas no caen al piso de la estación. ' +
        'Pero si no hubiera gravedad, nada jalaría a la estación hacia la Tierra, y se iría en línea recta hacia el espacio en vez de volver a pasar sobre el Perú. ' +
        'Hecha la cuenta, a 400 km de altura la gravedad sería todavía casi nueve décimas de la que te jala hacia el suelo.',
      'La estación no está quieta allá arriba: cae todo el tiempo hacia la Tierra, pero avanza de lado tan rápido que, mientras cae, la superficie curva de la Tierra se aleja debajo de ella, y nunca llega al suelo. ' +
        'Los astronautas caen con la estación y al mismo ritmo que ella, así que nada los aprieta contra el piso y flotan. ' +
        'Esa fuerza que los hace caer es la gravedad, la misma que mantiene a la Luna dando vueltas alrededor de la Tierra, y esta unidad, la gravitación, trata de cómo cambia con la masa y con la distancia.',
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'La Tierra y la estación espacial que avanza de lado sobre ella, en dos dibujos que no están a escala. Lo que predice la idea de que allá no hay gravedad: la estación se iría en línea recta y no volvería a pasar. Lo que se mide: la gravedad la jala hacia la Tierra y la estación da una vuelta cada 92 minutos.',
    },
    pregunta: '¿Qué crees que le pasaría a la estación espacial si de pronto dejara de avanzar de lado y se quedara quieta allá arriba?',
    ficha: {
      seLleva: 'En la estación espacial sí hay gravedad, casi tanta como en el suelo: los astronautas flotan porque caen junto con la estación, que avanza tan rápido de lado que nunca llega a la Tierra.',
      alcance: 'Parcial (núcleo: un modelo explica una observación y descarta una explicación popular; la gravedad como interacción a distancia que disminuye con la distancia). La ley con G y las leyes de Kepler no entran en PISA.',
      choque: 'Si allá arriba no hubiera gravedad, la estación se iría en línea recta; vuelve a pasar cada 92 minutos porque la gravedad la jala hacia la Tierra.',
      atajo: 'La explicación trampa, que en el espacio no hay gravedad, la descarta que la estación da vueltas a la Tierra en vez de alejarse. El mejor alumno diría que «la gravedad es menor allá»: es cierto, pero casi nueve décimas no alcanzan para flotar; lo que explica la flotación es que la estación y los astronautas caen juntos.',
      porVerificar: [
        'La estación orbita entre unos 400 y 420 km de altura y da una vuelta cada 92 a 93 minutos, unas 15,5 vueltas al día (de memoria; datos de la NASA). El texto dice «unas 16».',
        'Que la estación se vea desde el Perú a simple vista, sin parpadear, y cruce el cielo en unos minutos (de memoria: su órbita tiene 51,6° de inclinación, así que pasa sobre todo el Perú; la NASA publica los pasos en «Spot the Station»).',
        'La gravedad a 400 km sale de la cuenta del cuadrado inverso: (6371 ÷ 6771)² ≈ 0,885, casi nueve décimas. No es una medición.',
      ],
      notas: [
        'La pregunta se puede intentar con el párrafo 3: si dejara de avanzar de lado, caería hacia la Tierra. Abre la idea de órbita (idea 4) sin decir qué rapidez hace falta.',
        'La figura no está a escala (a escala la estación iría casi pegada al borde de la Tierra); el texto alternativo lo dice. En la predicción no hay flecha de gravedad, porque es la idea de «sin gravedad».',
        'El texto dice que la gravedad «cambia con la masa y con la distancia», el tema de la idea 1, sin decir cómo cambia, para no tocar su Predice (240 N) ni la de la idea 2 (2 N/kg).',
        'Revisión del Escribidor Escribano (27 nov): «caen junto con la estación» se podía leer como que la estación se viene abajo. El párrafo 3 dice ahora primero que la estación cae todo el tiempo pero avanza tan rápido de lado que la superficie curva de la Tierra se aleja debajo de ella, y nunca llega al suelo; después, en otra oración, que los astronautas caen con la estación y al mismo ritmo, así que nada los aprieta contra el piso. La última oración tenía un inciso entre el sujeto y el verbo («La fuerza que los hace caer, la misma que…, es la gravitación»); ahora va en orden, y usa «la gravedad» para la fuerza, como el título, y «la gravitación» para la unidad. Las nueve décimas pasaron a condicional («sería»), porque son cálculo. «Unas 16 vueltas» pasó a «casi 16» (1440 ÷ 92 da 15,7). La pregunta repetía el dato del título en una subordinada; ahora es una sola pregunta. No delata: no dice cómo cambia la gravedad con la distancia (Predices de las ideas 1 y 2) ni qué rapidez pide una órbita (idea 4).',
        'Tercera pasada (27 nov): sin ecuaciones en la oración ni palabras de doble sentido.',
      ],
    },
  };
})());
