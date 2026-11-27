/*
 * Apertura de «Movimiento parabólico» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * Doble revisión (27 nov): el caso pasó de la combi al bus (la combi queda en «Dinámica») y el choque, del muñeco de paja
 * («la moneda cae en la puerta de atrás») a uno honesto: desde tu asiento la moneda que lanzas hacia arriba sube y baja
 * derecho, y quien la mira desde la vereda la ve avanzar unos 3,2 m con el bus y dibujar una curva. Lo que el alumno se
 * lleva va en ficha.seLleva. No adelanta la Predice de la idea 1 (la piedra lanzada de lado y la soltada llegan a la vez:
 * aquí no se comparan dos caídas ni se dice que los dos movimientos no se estorban), la de la idea 2 (25 m/s), la de la
 * idea 3 (15 m/s en lo más alto), la de la idea 4 (al doble de rapidez, cuatro veces más lejos) ni la misión de la idea 4
 * (30° y 60°). Colores de la unidad (cabecera de contenido/teoria/fisica/movimiento-parabolico-y-circular.js): la
 * velocidad en naranja (c-o) y la posición en violeta (c-f).
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const r1 = n => Math.round(n * 10) / 10;
  const flecha = (x1, y1, x2, y2, c, w = 5) => {
    const g = Math.atan2(y2 - y1, x2 - x1), p = 14, a = 0.45;
    const bx = x2 - p * Math.cos(g), by = y2 - p * Math.sin(g);
    return `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(bx)}" y2="${r1(by)}" style="stroke:var(${c})" stroke-width="${w}" stroke-linecap="round"/>
      <path d="M${r1(x2)} ${r1(y2)}L${r1(x2 - p * 1.15 * Math.cos(g - a))} ${r1(y2 - p * 1.15 * Math.sin(g - a))}L${r1(x2 - p * 1.15 * Math.cos(g + a))} ${r1(y2 - p * 1.15 * Math.sin(g + a))}Z" style="fill:var(${c})"/>`;
  };
  // Un tramo del bus de costado, que ocupa todo el panel; las ventanas van arriba. Escala: 50 px por metro.
  const bus = x0 => `<rect x="${x0 + 6}" y="112" width="248" height="124" rx="10" style="fill:var(--card)" stroke="currentColor" stroke-width="3"/>
      ${[0, 1, 2, 3].map(i => `<rect x="${x0 + 16 + i * 60}" y="124" width="50" height="40" rx="3" style="fill:var(--line)" stroke="currentColor" stroke-width="2"/>`).join('')}
      <circle cx="${x0 + 44}" cy="238" r="15" style="fill:var(--card)" stroke="currentColor" stroke-width="3"/>
      <circle cx="${x0 + 216}" cy="238" r="15" style="fill:var(--card)" stroke="currentColor" stroke-width="3"/>
      <line x1="${x0 + 2}" y1="254" x2="${x0 + 258}" y2="254" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>`;
  const moneda = (x, y) => `<circle cx="${r1(x)}" cy="${r1(y)}" r="7" style="fill:var(--line)" stroke="currentColor" stroke-width="2.5"/>`;
  // El pasajero sentado: cabeza en la ventana y mano abierta en (hx + 12, 206). `fantasma` lo dibuja punteado.
  const pasajero = (hx, fantasma) => `<g ${fantasma ? 'stroke-dasharray="4 4" opacity="0.55"' : ''}><circle cx="${hx - 14}" cy="160" r="11" style="fill:var(--card)" stroke="currentColor" stroke-width="2.5"/>
      <path d="M${hx - 14} 171v32M${hx - 14} 186l12 22h8" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g>`;
  const SUBE = 25, AVANZA = 160; // 0,5 m de subida y 3,2 m de avance, a 50 px por metro
  const panel = (x0, titulo, curva, pie) => {
    let dentro;
    if (!curva) {
      const hx = x0 + 120, mx = hx + 12;
      dentro = `${pasajero(hx)}
        <path d="M${mx - 4} 200V${206 - SUBE + 6}M${mx + 4} ${206 - SUBE + 6}V200" fill="none" style="stroke:var(--c-f)" stroke-width="3" stroke-dasharray="6 5"/>
        ${moneda(mx, 206 - SUBE)}${moneda(mx, 206)}`;
    } else {
      const h1 = x0 + 50, h2 = h1 + AVANZA, m1 = h1 + 12, m2 = h2 + 12;
      dentro = `${pasajero(h1, true)}${pasajero(h2)}
        <path d="M${m1} 206Q${(m1 + m2) / 2} ${206 - 2 * SUBE} ${m2} 206" fill="none" style="stroke:var(--c-f)" stroke-width="3" stroke-dasharray="6 5"/>
        ${moneda(m1, 206)}${moneda(m2, 206)}
        <path d="M${m1} 266v12M${m2} 266v12M${m1} 272H${m2}" fill="none" style="stroke:var(--c-f)" stroke-width="2.5"/>
        <text x="${(m1 + m2) / 2}" y="298" text-anchor="middle" font-size="20" font-weight="800" style="fill:var(--c-f)">3,2 m</text>`;
    }
    return `<text x="${x0 + 130}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      ${flecha(x0 + 82, 82, x0 + 202, 82, '--c-o')}
      <text x="${x0 + 140}" y="70" text-anchor="middle" font-size="20" font-weight="800" style="fill:var(--c-o)">18 km/h</text>
      ${bus(x0)}
      ${dentro}
      ${pie.map((l, i) => `<text x="${x0 + 130}" y="${330 + i * 26}" text-anchor="middle" font-size="22" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 368" width="520" height="368" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="358" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', false, ['Sube y baja', 'en el mismo sitio'])}
    ${panel(260, 'Lo que se mide', true, ['Desde la vereda:', 'una curva de 3,2 m'])}
  </svg>`;

  return {
    unidad: 'fisica.movimiento-parabolico-y-circular',
    titulo: '¿Qué camino sigue la moneda que lanzas hacia arriba dentro de un bus en marcha?',
    parrafos: [
      'Si vas sentado en un bus que avanza a 18 km/h por una avenida recta, sin frenar ni acelerar, y lanzas una moneda hacia arriba, la moneda vuelve a caer en tu mano. ' +
        'Desde tu asiento la ves subir y bajar en línea recta, sin irse hacia adelante ni hacia atrás.',
      'Lo que esperarías es que una persona parada en la vereda vea lo mismo que tú, una moneda que sube y baja en el mismo sitio. ' +
        'Pero una moneda que sube medio metro pasaría algo más de medio segundo en el aire, y en ese tiempo el bus avanzaría unos 3,2 m, con tu mano dentro; ' +
        'si la moneda vuelve a tu mano, también ella tuvo que avanzar esos 3,2 m mientras volaba.',
      'Para quien mira desde la vereda, la moneda no vuelve al mismo sitio: sale de tu mano, sube, baja y aterriza en tu mano 3,2 m más adelante, y su camino es una curva. ' +
        'Esta unidad trata de cómo se mueve lo que se lanza, como una piedra, una pelota o el chorro de una manguera, y ese movimiento se llama parabólico.',
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Un tramo del mismo bus que avanza a 18 km/h, con un pasajero sentado que lanza una moneda hacia arriba. Lo que predice la idea de que desde la vereda se ve lo mismo que desde el asiento: la moneda sube y baja en el mismo sitio. Lo que se mide desde la vereda: el pasajero y su mano avanzan 3,2 m mientras la moneda vuela, y la moneda dibuja una curva de 3,2 m de largo.',
    },
    pregunta: 'Si el bus frena de golpe mientras la moneda está en el aire, ¿dónde crees que caerá la moneda: en tu mano, delante de ella o detrás?',
    ficha: {
      seLleva: 'El camino de algo depende de desde dónde lo mires: la moneda que en el bus sube y baja derecho, vista desde la vereda, avanza con el bus y dibuja una curva.',
      alcance: 'Parcial (núcleo: qué cambia, respecto de qué y en qué intervalo; un movimiento en dos direcciones a la vez).',
      choque: 'Desde la vereda se tendría que ver lo mismo que desde el asiento, una moneda que sube y baja en el mismo sitio; desde la vereda, la moneda avanza unos 3,2 m mientras vuela y su camino es una curva.',
      atajo: 'El mejor alumno diría que la moneda «lleva la velocidad del bus», y con eso deduce que avanza 3,2 m: el texto lo hace con él en el párrafo 2. Lo que no sabe sin la unidad es qué forma tiene esa curva ni cómo se calcula, y que el avance de lado no estorba a la subida y la caída (idea 1, que no se dice). Se descartó el choque anterior, que la moneda caería en la puerta de atrás, porque casi nadie que haya viajado en un vehículo lo predice.',
      porVerificar: [
        'Los tiempos salen de la cuenta: una moneda que sube medio metro sale a unos 3,1 m/s y vuelve en unos 0,64 s; a 18 km/h (5 m/s) el bus avanza unos 3,2 m. No es una medición propia.',
        'Que lanzar una moneda medio metro hacia arriba quepa dentro de un bus sentado (la mano a unos 0,7 m del piso y el techo a unos 2 m; de memoria).',
        'La condición de rapidez pareja y avenida recta es necesaria: si el bus frena o acelera, la moneda no cae en la mano (eso es la pregunta).',
      ],
      notas: [
        'La figura va a escala (50 px por metro: 0,5 m de subida y 3,2 m de avance). En la predicción, la moneda sube y baja en el mismo sitio; en la medición, vista desde la vereda, el pasajero aparece punteado donde lanzó y entero donde atrapa, y la moneda dibuja la curva. No dice que la curva sea una parábola ni cómo se calcula.',
        'La pregunta se puede intentar con el párrafo 2: la moneda avanza con la rapidez que tenía el bus al lanzarla, y si el bus frena, la mano se queda atrás y la moneda cae delante de ella. Abre la idea de que el avance de lado no cambia mientras la moneda vuela.',
        'Revisión del Escribidor Escribano (27 nov): se quitó «Avanzar de lado y subir y caer son dos movimientos que ocurren a la vez». Es la regla de la idea 1 («Tiro horizontal: dos movimientos»), y junto con «cae en tu mano como si la combi estuviera parada» le daba al alumno el paso que pide su Predice: si el avance de lado no cambia la subida y la caída, la piedra lanzada de lado y la soltada llegan a la vez. Sin esa oración, el párrafo 3 queda con el choque del caso (la moneda ya avanzaba con la combi y siguió avanzando en el aire) y el nombre del tema. El autor había dejado esa decisión a Gerson; queda resuelta con el recorte. «Cuando la soltaste» pasó a «cuando salió de tu mano», porque la moneda se lanza. El párrafo 1 pasó a condicional («pasaría», «avanzaría»), porque el medio segundo y los 6 m son cálculo. «Todo lo que se lanza y vuela» pasó a ejemplos concretos (piedra, pelota, chorro de manguera), que además no promete nada sobre el aire.',
        'Doble revisión (27 nov): el choque anterior era casi un muñeco de paja (casi nadie que haya viajado en combi espera que la moneda caiga en la puerta de atrás) y la combi se repetía con «Dinámica». Antes: «¿Por qué vuelve a tu mano la moneda que lanzas hacia arriba en una combi en marcha?», con «cae en la puerta de atrás» contra «cae en tu mano». Después: «¿Qué camino sigue la moneda que lanzas hacia arriba dentro de un bus en marcha?», con la intuición del asiento (sube y baja en el mismo sitio, que es cierta desde ahí) contra lo que ve alguien en la vereda (la moneda avanza 3,2 m y dibuja una curva). Mismo caso y mismas cantidades en los dos paneles; la cuenta cambió a 18 km/h y medio metro de subida para que la curva se vea a escala. Se quitó «como si la combi estuviera parada», que insinuaba que el avance no cambia la caída (idea 1). La pregunta se mantiene, con bus en vez de combi.',
      ],
    },
  };
})());
