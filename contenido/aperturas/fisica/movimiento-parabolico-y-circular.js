/*
 * Apertura de «Movimiento parabólico» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * El choque se vive en la combi: una moneda lanzada hacia arriba mientras la combi avanza a 40 km/h vuelve a la mano,
 * aunque en el poco más de medio segundo que vuela la combi avanza unos 6 m, más que su propio largo. Lo que el alumno se lleva va
 * en ficha.seLleva. No adelanta la Predice de la idea 1 (la piedra lanzada de lado y la soltada llegan a la vez: aquí no
 * se comparan dos caídas), la de la idea 2 (25 m/s), la de la idea 3 (15 m/s en lo más alto), la de la idea 4 (al doble
 * de rapidez, cuatro veces más lejos) ni la misión de la idea 4 (30° y 60°). Colores de la unidad (cabecera de
 * contenido/teoria/fisica/movimiento-parabolico-y-circular.js): la velocidad en naranja (c-o) y la posición en violeta
 * (c-f). La figura muestra la moneda vista desde adentro de la combi.
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
  // La combi de costado, con el frente a la derecha; el pasajero va sentado al medio y lanza la moneda.
  const combi = x => `<path d="M${x + 6} 236V140q0 -16 16 -16h150q12 0 18 10l26 40q6 9 6 20v42Z" style="fill:var(--card)" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
      <path d="M${x + 20} 138h44v34h-44ZM${x + 74} 138h44v34h-44ZM${x + 128} 138h44v34h-44Z" style="fill:var(--line)" stroke="currentColor" stroke-width="2"/>
      <path d="M${x + 182} 138l24 34h-24Z" style="fill:var(--line)" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="${x + 52}" cy="238" r="15" style="fill:var(--card)" stroke="currentColor" stroke-width="3"/>
      <circle cx="${x + 180}" cy="238" r="15" style="fill:var(--card)" stroke="currentColor" stroke-width="3"/>
      <line x1="${x - 6}" y1="254" x2="${x + 238}" y2="254" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>`;
  const moneda = (x, y) => `<circle cx="${r1(x)}" cy="${r1(y)}" r="7" style="fill:var(--line)" stroke="currentColor" stroke-width="2.5"/>`;
  const panel = (x0, titulo, cae, pie) => {
    const x = x0 + 12, hx = x + 120, hy = 214;
    // El pasajero: cabeza en la ventana del medio y mano abierta a la altura de las rodillas.
    const pasajero = `<circle cx="${hx - 14}" cy="160" r="11" style="fill:var(--card)" stroke="currentColor" stroke-width="2.5"/>
      <path d="M${hx - 14} 171v32M${hx - 14} 186l12 22h8" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
    const camino = cae === 'mano'
      ? `<path d="M${hx + 8} ${hy - 6}V${hy - 64}" fill="none" style="stroke:var(--c-f)" stroke-width="3" stroke-dasharray="6 5"/>
        <path d="M${hx + 16} ${hy - 64}V${hy - 12}" fill="none" style="stroke:var(--c-f)" stroke-width="3" stroke-dasharray="6 5"/>
        ${moneda(hx + 12, hy - 72)}${moneda(hx + 12, hy - 8)}`
      : `<path d="M${hx + 8} ${hy - 8}Q${hx - 20} ${hy - 120} ${x + 12} ${hy + 4}" fill="none" style="stroke:var(--c-f)" stroke-width="3" stroke-dasharray="6 5"/>
        ${moneda(hx + 12, hy - 8)}${moneda(x + 14, hy + 2)}`;
    return `<text x="${x0 + 130}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      ${flecha(x + 70, 82, x + 190, 82, '--c-o')}
      <text x="${x + 128}" y="70" text-anchor="middle" font-size="20" font-weight="800" style="fill:var(--c-o)">40 km/h</text>
      ${combi(x)}
      ${pasajero}
      ${camino}
      ${pie.map((l, i) => `<text x="${x0 + 130}" y="${298 + i * 26}" text-anchor="middle" font-size="22" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 336" width="520" height="336" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="326" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', 'atras', ['Cae en la puerta', 'de atrás'])}
    ${panel(260, 'Lo que se mide', 'mano', ['Cae en tu mano', 'otra vez'])}
  </svg>`;

  return {
    unidad: 'fisica.movimiento-parabolico-y-circular',
    titulo: '¿Por qué vuelve a tu mano la moneda que lanzas hacia arriba en una combi en marcha?',
    parrafos: [
      'Si vas sentado en una combi que avanza a 40 km/h por una pista recta, sin frenar ni acelerar, y lanzas una moneda hacia arriba, la moneda vuelve a caer en tu mano. ' +
        'Una moneda que sube unos 40 cm pasaría algo más de medio segundo en el aire, y en ese tiempo la combi avanzaría unos 6 m.',
      'Si la moneda solo subiera y bajara, mientras está en el aire tu asiento se le adelantaría esos 6 m, más de lo que mide la combi entera. ' +
        'La moneda tendría que quedarse atrás y chocar contra la puerta trasera, y sin embargo cae en tu mano como si la combi estuviera parada.',
      'Cuando salió de tu mano, la moneda ya avanzaba con la combi a 40 km/h, y en el aire siguió avanzando así mientras subía y bajaba. ' +
        'Esta unidad trata de cómo se mueve lo que se lanza, como una piedra, una pelota o el chorro de una manguera, y ese movimiento se llama parabólico.',
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'La misma combi avanzando a 40 km/h, con un pasajero que lanza una moneda hacia arriba. Lo que predice la idea de que la moneda solo sube y baja: se queda atrás y cae en la puerta trasera. Lo que se mide: la moneda sube y vuelve a caer en la mano del pasajero.',
    },
    pregunta: 'Si la combi frena de golpe mientras la moneda está en el aire, ¿dónde crees que caerá la moneda: en tu mano, delante de ella o detrás?',
    ficha: {
      seLleva: 'Lo que se lanza desde algo que avanza sigue avanzando con él mientras sube y baja; por eso la moneda vuelve a tu mano aunque la combi recorra 6 m en ese tiempo.',
      alcance: 'Parcial (núcleo: qué cambia, respecto de qué y en qué intervalo; un movimiento en dos direcciones a la vez).',
      choque: 'Si la moneda solo subiera y bajara, la combi le sacaría 6 m en el poco más de medio segundo de vuelo y caería en la puerta de atrás; cae en la mano.',
      atajo: 'El mejor alumno diría que la moneda «lleva la velocidad de la combi»: es la explicación correcta, y el párrafo 3 la dice; lo que el tema agrega es que ese avance de lado no estorba a la subida y la caída, y juntos dan la parábola. Se pensó en la explicación trampa de que el aire de adentro arrastra la moneda, pero no se usó porque no hay un dato sencillo que la descarte.',
      porVerificar: [
        'Los tiempos salen de la cuenta: una moneda que sube 40 cm sale a unos 2,8 m/s y vuelve en unos 0,57 s; a 40 km/h (11,1 m/s) la combi avanza unos 6 m. No es una medición propia.',
        'Que una combi mida menos de 6 m de largo (una Toyota Hiace mide unos 5 m; de memoria).',
        'La condición de rapidez pareja y pista recta es necesaria: si la combi frena o acelera, la moneda no cae en la mano (eso es la pregunta).',
      ],
      notas: [
        'La figura muestra la moneda vista desde adentro de la combi: en la predicción, la moneda se queda atrás respecto del asiento; en la medición, sube y baja derecho. No dibuja la parábola vista desde la calle, para que la clase la construya.',
        'La pregunta se puede intentar con el párrafo 3: la moneda sigue avanzando a 40 km/h aunque la combi frene, así que cae delante de la mano. Abre la idea de que el avance de lado no cambia mientras la moneda vuela.',
        'Revisión del Escribidor Escribano (27 nov): se quitó «Avanzar de lado y subir y caer son dos movimientos que ocurren a la vez». Es la regla de la idea 1 («Tiro horizontal: dos movimientos»), y junto con «cae en tu mano como si la combi estuviera parada» le daba al alumno el paso que pide su Predice: si el avance de lado no cambia la subida y la caída, la piedra lanzada de lado y la soltada llegan a la vez. Sin esa oración, el párrafo 3 queda con el choque del caso (la moneda ya avanzaba con la combi y siguió avanzando en el aire) y el nombre del tema. El autor había dejado esa decisión a Gerson; queda resuelta con el recorte. «Cuando la soltaste» pasó a «cuando salió de tu mano», porque la moneda se lanza. El párrafo 1 pasó a condicional («pasaría», «avanzaría»), porque el medio segundo y los 6 m son cálculo. «Todo lo que se lanza y vuela» pasó a ejemplos concretos (piedra, pelota, chorro de manguera), que además no promete nada sobre el aire.',
      ],
    },
  };
})());
