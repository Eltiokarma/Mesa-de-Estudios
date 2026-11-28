/*
 * Apertura de «Impulso y choques» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * El choque se arma en cualquier mesa con dos monedas de un sol: la que lanzas contra la otra, de frente, se queda casi
 * quieta, y la que estaba quieta sale con casi toda la rapidez. Lo que el alumno se lleva va en ficha.seLleva.
 * No adelanta la Predice de la idea 1 (6 kg·m/s hacia la izquierda), la de la idea 2 (con el doble de tiempo, la mitad
 * de fuerza: −10 N; aquí no se habla de cuánto dura el golpe), la de la idea 3 (1 m/s), la de la idea 4 (1 m/s, los
 * carritos unidos: aquí las monedas no se quedan juntas), la de la idea 5 (0,8) ni la de la idea 6 (3 m/s). La unidad
 * de teoría no fija colores; la velocidad va en naranja (c-o), como en las demás unidades de mecánica.
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const r1 = n => Math.round(n * 10) / 10;
  const flecha = (x1, y, x2, w = 5) => {
    const p = 13;
    return `<line x1="${r1(x1)}" y1="${y}" x2="${r1(x2 - p)}" y2="${y}" style="stroke:var(--c-o)" stroke-width="${w}" stroke-linecap="round"/>
      <path d="M${r1(x2)} ${y}l${-p * 1.1} -7v14Z" style="fill:var(--c-o)"/>`;
  };
  const moneda = (x, y) => `<circle cx="${r1(x)}" cy="${y}" r="17" style="fill:var(--line)" stroke="currentColor" stroke-width="2.5"/>
      <circle cx="${r1(x)}" cy="${y}" r="12" fill="none" stroke="currentColor" stroke-width="1.2"/>
      <text x="${r1(x)}" y="${y + 6}" text-anchor="middle" font-size="16" font-weight="800" fill="currentColor">1</text>`;
  // Antes: la moneda lanzada (A) va hacia la otra (B), quieta. Después: dónde está cada una y con qué rapidez sale.
  // Una flecha de 56 px es la rapidez de la moneda lanzada.
  const panel = (x0, titulo, despues, pie) => {
    const ya = 104, yd = 222, xa = x0 + 40, xb = x0 + 128;
    const [pa, va, pb, vb] = despues;
    return `<text x="${x0 + 130}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      <text x="${x0 + 10}" y="${ya - 34}" font-size="18" style="fill:var(--muted)">antes</text>
      ${moneda(xa, ya)}${flecha(xa + 22, ya, xa + 78)}${moneda(xb + 20, ya)}
      <text x="${x0 + 10}" y="${yd - 34}" font-size="18" style="fill:var(--muted)">después</text>
      ${moneda(x0 + pa, yd)}${va ? flecha(x0 + pa + 22, yd, x0 + pa + 22 + va) : ''}
      ${moneda(x0 + pb, yd)}${flecha(x0 + pb + 22, yd, x0 + pb + 22 + vb)}
      <line x1="${x0 + 10}" y1="${yd + 30}" x2="${x0 + 250}" y2="${yd + 30}" style="stroke:var(--line)" stroke-width="2"/>
      <line x1="${x0 + 10}" y1="${ya + 30}" x2="${x0 + 250}" y2="${ya + 30}" style="stroke:var(--line)" stroke-width="2"/>
      ${pie.map((l, i) => `<text x="${x0 + 130}" y="${296 + i * 26}" text-anchor="middle" font-size="22" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 336" width="520" height="336" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="326" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', [92, 18, 160, 36], ['La que golpea', 'sigue detrás'])}
    ${panel(260, 'Lo que se mide', [114, 0, 160, 56], ['La que golpea', 'se queda quieta'])}
  </svg>`;

  return {
    unidad: 'fisica.impulso-y-choques',
    titulo: '¿Por qué la moneda que golpea de frente a otra igual se queda quieta?',
    parrafos: [
      'Pon una moneda de un sol quieta sobre una mesa lisa y lanza otra igual, deslizándola, para que la golpee de frente, centro contra centro. ' +
        'La que lanzaste se detiene casi en el punto del golpe, y la que estaba quieta sale disparada con casi toda la rapidez que traía la primera. ' +
        'Las dos tienen la misma masa, 7,32 g, porque todas las monedas de un sol se acuñan iguales.',
      'Lo que esperarías es que la moneda que golpea siga avanzando detrás de la otra, más despacio, como quien empuja a alguien y sigue caminando. ' +
        'Si pensaras que el golpe frenó a la tuya y su movimiento se perdió, no se entendería que la otra salga casi con la misma rapidez, como si en el golpe no se hubiera perdido nada.',
      'En el golpe, lo que trae la moneda en movimiento pasa a la otra casi entero, y como las dos tienen la misma masa, la otra sale con la rapidez de la primera y a esta no le queda nada. ' +
        'Lo que pasa de una moneda a la otra se llama cantidad de movimiento y depende de la masa y de la velocidad de cada una; de ella y de los choques trata esta unidad.',
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos monedas de un sol iguales, antes y después del golpe de frente. Lo que predice la idea de que la que golpea sigue empujando: después, las dos avanzan, la lanzada más despacio detrás de la otra. Lo que se mide: la lanzada se queda quieta en el punto del golpe y la otra sale con la rapidez que traía la primera.',
    },
    pregunta: 'Si la moneda que lanzas tuviera el doble de masa que la que está quieta, ¿crees que después del golpe se quedaría quieta, seguiría avanzando o rebotaría hacia atrás?',
    ficha: {
      seLleva: 'En un choque de frente entre dos monedas iguales, el movimiento pasa casi entero de una a otra: la que golpea se queda quieta y la otra sale con su rapidez.',
      alcance: 'Parcial (núcleo: conservación en un sistema; lo que se transfiere en una interacción). El coeficiente de restitución y el centro de masa no entran en PISA.',
      choque: 'La moneda que golpea tendría que seguir avanzando detrás de la otra; se queda casi quieta y la otra sale con casi toda su rapidez.',
      atajo: 'La explicación trampa de que el golpe frena a la moneda lanzada y su movimiento se pierde la descarta que la otra sale casi con la misma rapidez. El mejor alumno diría que «le pasó su fuerza»: la palabra es otra, pero la idea es la del tema; lo que no puede decir sin la unidad es por qué pasa entera solo cuando las masas son iguales.',
      porVerificar: [
        'Masa de la moneda de S/ 1: 7,32 g (de memoria; datos del BCRP, que también da 25,5 mm de diámetro).',
        'Que en una mesa lisa la moneda lanzada quede casi quieta (de memoria; es una práctica clásica de laboratorio casero con monedas iguales). El roce con la mesa y el giro de las monedas la apartan un poco del caso ideal: por eso el texto dice «casi».',
        'Que el golpe tenga que ser de frente, centro contra centro: si es de costado, las dos salen en ángulo.',
      ],
      notas: [
        'La pregunta se puede intentar con el párrafo 3: si la que golpea tiene más masa, no le pasa todo a la otra y sigue avanzando, más despacio. La clase recoge la cantidad de movimiento (idea 1) y la conservación en el choque (ideas 3 y 4).',
        'Se descartaron el choque del colchón o del airbag (más tiempo, menos fuerza), que es la Predice de la idea 2, y el rebote de la pelota, que es la misión de la idea 5.',
        'La moneda de un sol también aparece en la apertura de «Movimiento parabólico» (la que se lanza en la combi); no son vecinas en la rama y el hecho es otro.',
        'Revisión del Escribidor Escribano (27 nov): «Las dos pesan lo mismo, 7,32 g» confundía masa con peso; ahora dice «tienen la misma masa». El párrafo 2 usaba «impulso» en sentido de todos los días («el golpe le gastó el impulso»), pero el impulso es un término de esta misma unidad (idea 2) y no significa eso; ahora dice «el golpe frenó a la tuya y su movimiento se perdió», y el atajo de la ficha se ajustó igual. La última oración encadenaba tres predicados con comas («depende…, se llama…, y de ella…»); ahora nombra primero y explica después. «Lo que uno espera» pasó a «Lo que esperarías». No delata: no da números de cantidad de movimiento (Predice de la idea 1) ni el coeficiente de restitución (idea 5).',
        'Tercera pasada (27 nov): sin ecuaciones en la oración ni palabras de doble sentido. La pregunta dice «pesara el doble», pero en su propio párrafo y sin «masa» al lado; se dejó.',
        'Coherencia con la unidad (28 nov): responde. La cantidad de movimiento es la idea 1, la conservación en el choque la idea 3 y el choque elástico la idea 4 («en un choque elástico de frente, los cuerpos se separan tan rápido como se acercaban»); con la idea 5 salen las dos velocidades finales, y la pregunta (doble de masa: sigue avanzando, más despacio) se puede resolver así. La pregunta pasó de «pesara el doble» a «tuviera el doble de masa», porque la unidad habla siempre de masa y Dinámica separa masa de peso',
      ],
    },
  };
})());
