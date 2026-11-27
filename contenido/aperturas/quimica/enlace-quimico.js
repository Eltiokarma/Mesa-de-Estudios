/*
 * Apertura de «Enlace químico» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * El choque está en la cocina: el azúcar y la sal se ven casi iguales (granos blancos que se disuelven en agua), pero en
 * la sartén el azúcar se derrite en caramelo antes de los 200 °C y la sal sigue en granos, porque se funde recién a
 * 801 °C. Lo que el alumno se lleva (ficha.seLleva): dos sustancias que se ven iguales pueden tener sus átomos unidos
 * de maneras muy distintas, y eso decide cómo se comportan. No se usa la corriente eléctrica de la sal (Predice y
 * misión de la idea 1) ni se dice cómo están acomodados el sodio y el cloro en el grano (respuesta de esa Predice).
 * Colores: el caramelo en naranja (c-o); la sal, en el color de la tarjeta con borde de tinta.
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  // La misma sartén sobre la misma llama, con azúcar a la izquierda y sal a la derecha.
  const FONDO = 214;
  const sarten = cx => `
      <path d="M${cx + 96} ${FONDO - 26}L${cx + 124} ${FONDO - 44}" stroke="currentColor" stroke-width="9" stroke-linecap="round"/>
      <path d="M${cx - 100} ${FONDO - 30}Q${cx - 94} ${FONDO} ${cx - 70} ${FONDO}H${cx + 70}Q${cx + 94} ${FONDO} ${cx + 100} ${FONDO - 30}" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
      ${[-40, 0, 40].map(d => `<path d="M${cx + d} ${FONDO + 44}c-12 -10 -8 -22 0 -32c8 10 12 22 0 32z" style="fill:var(--c-f)" fill-opacity=".45"/>`).join('')}
      <path d="M${cx - 70} ${FONDO + 52}H${cx + 70}" style="stroke:var(--muted)" stroke-width="3" stroke-linecap="round"/>`;
  const charco = (cx, color) => `<path d="M${cx - 38} ${FONDO - 3}Q${cx - 40} ${FONDO - 14} ${cx - 20} ${FONDO - 14}Q${cx} ${FONDO - 18} ${cx + 22} ${FONDO - 14}Q${cx + 40} ${FONDO - 13} ${cx + 38} ${FONDO - 3}Z" style="fill:var(${color})" fill-opacity=".6"/>
      <path d="M${cx - 38} ${FONDO - 3}Q${cx - 40} ${FONDO - 14} ${cx - 20} ${FONDO - 14}Q${cx} ${FONDO - 18} ${cx + 22} ${FONDO - 14}Q${cx + 40} ${FONDO - 13} ${cx + 38} ${FONDO - 3}" fill="none" style="stroke:var(${color})" stroke-width="2.5"/>`;
  // La sal derretida que predice la idea de «se ven iguales»: un charco claro, sin el dorado del caramelo.
  const charcoSal = cx => `<path d="M${cx - 38} ${FONDO - 3}Q${cx - 40} ${FONDO - 14} ${cx - 20} ${FONDO - 14}Q${cx} ${FONDO - 18} ${cx + 22} ${FONDO - 14}Q${cx + 40} ${FONDO - 13} ${cx + 38} ${FONDO - 3}Z" style="fill:var(--card)" stroke="currentColor" stroke-width="2.5"/>`;
  // Granos de sal como cubitos apilados en un montón (forma fija).
  const granos = cx => [[-24, 0], [-12, 0], [0, 0], [12, 0], [24, 0], [-18, -11], [-6, -11], [6, -11], [18, -11], [-12, -22], [0, -22], [12, -22], [-6, -33], [6, -33]]
    .map(([dx, dy]) => `<rect x="${cx + dx - 5.5}" y="${FONDO - 14 + dy}" width="11" height="11" rx="1.5" style="fill:var(--card)" stroke="currentColor" stroke-width="2"/>`).join('');
  const panel = (x0, titulo, mide, pie) => {
    const cx = x0 + 124, xa = cx - 46, xs = cx + 46;
    return `<text x="${x0 + 130}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      ${sarten(cx)}
      ${charco(xa, '--c-o')}
      ${mide ? granos(xs) : charcoSal(xs)}
      <text x="${xa}" y="${FONDO - 62}" text-anchor="middle" font-size="19" font-weight="700" style="fill:var(--c-o)">azúcar</text>
      <text x="${xs}" y="${FONDO - 62}" text-anchor="middle" font-size="19" font-weight="700" fill="currentColor">sal</text>
      ${mide ? `<text x="${xa}" y="${FONDO - 38}" text-anchor="middle" font-size="16" style="fill:var(--muted)">se derrite</text>
      <text x="${xs}" y="${FONDO - 86}" text-anchor="middle" font-size="16" style="fill:var(--muted)">sigue en granos</text>` : ''}
      ${pie.map((l, i) => `<text x="${x0 + 130}" y="${320 + i * 26}" text-anchor="middle" font-size="22" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 384" width="520" height="384" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="374" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', false, ['Se ven iguales:', 'se derriten igual'])}
    ${panel(260, 'Lo que se mide', true, ['Azúcar: unos 186 °C', 'Sal: 801 °C'])}
  </svg>`;

  return {
    unidad: 'quimica.enlace-quimico',
    titulo: '¿Por qué el azúcar se derrite en la sartén y la sal, que se ve casi igual, sigue en granos?',
    parrafos: [
      ['Si calientas azúcar en una sartén, se derrite antes de los 200 °C y se vuelve el caramelo dorado que se usa para la crema volteada. ',
        'La sal de cocina, en la misma sartén y con el fuego al máximo, sigue en granos, porque se derrite recién a 801 °C, una temperatura que una sartén de casa no alcanza.'],
      ['Los dos son granos blancos y brillantes que se disuelven en agua, tan parecidos que más de una vez alguien ha echado sal al café, así que lo esperable sería que se comportaran parecido al calentarlos. ',
        'Tampoco sirve decir que el azúcar se derrite porque viene de una planta y la sal no porque viene del mar o de una mina, ya que el estaño de soldar sale de minas como la de San Rafael, en Puno, y se derrite con la punta caliente de un cautín.'],
      ['La diferencia no se ve en el grano, sino en cómo se unen los átomos por dentro, y en el azúcar y en la sal se unen de maneras muy distintas. ',
        'Esas uniones entre átomos se llaman enlaces químicos, y esta unidad trata de sus clases y de lo que cada una le hace a una sustancia.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'La misma sartén sobre la misma llama, con un montón de azúcar y otro de sal. Lo que predice la idea de que lo que se ve igual se comporta igual: los dos se derriten. Lo que se mide: el azúcar se vuelve caramelo, hacia los 186 °C, y la sal sigue en granos, porque se funde a 801 °C.',
    },
    pregunta: 'El azúcar está hecho de tres no metales (carbono, hidrógeno y oxígeno), y la sal, de un metal y un no metal. ¿Crees que eso tenga que ver con la forma en que se unen sus átomos?',
    ficha: {
      seLleva: 'Dos sustancias que se ven iguales pueden tener sus átomos unidos de maneras muy distintas, y esa manera de unirse decide cosas como la temperatura a la que se derriten.',
      alcance: 'Parcial (núcleo: explicar una propiedad que se ve con la manera en que se unen las partículas; los tipos de enlace y las estructuras de Lewis no entran en PISA). Deducción propia.',
      choque: 'El azúcar y la sal se ven casi iguales y se disuelven igual; en la sartén el azúcar se derrite hacia los 186 °C y la sal sigue sólida hasta 801 °C.',
      atajo: 'La explicación trampa «el azúcar viene de una planta y la sal de una mina» se descarta con el estaño de soldar, que sale de una mina y se derrite con un cautín. Decir que «el azúcar se quema» no alcanza: antes de oscurecerse, se derrite.',
      porVerificar: [
        'Punto de fusión del cloruro de sodio: 801 °C (dato de tabla, de memoria).',
        'Que la sacarosa se derrita hacia los 186 °C y empiece a caramelizarse cerca de esa temperatura (de memoria: se descompone al fundirse; la caramelización puede empezar algo antes, hacia los 160 °C). El texto dice «antes de los 200 °C».',
        'Que una sartén en una cocina doméstica no llegue a 801 °C (lo esperado: una sartén vacía al máximo pasa poco de los 300 °C a 400 °C).',
        'Que el estaño se saque en la mina San Rafael (Antauta, Melgar, Puno), una de las mayores minas de estaño del mundo (de memoria). Punto de fusión del estaño puro, 232 °C, y de la soldadura de estaño y plomo, unos 183 °C a 190 °C (de memoria): el texto no da la cifra, solo que se derrite con un cautín.',
      ],
      notas: [
        'Doble revisión (27 nov): el choque es honesto (el azúcar y la sal se confunden de verdad en la cocina, y en la sartén se portan muy distinto) y se mantiene. Se cambió el contraejemplo de la explicación trampa: antes era la parafina, que sale del petróleo, y un alumno atento objetaría que el petróleo también viene de seres vivos; ahora es el estaño de soldar de la mina San Rafael, en Puno, que sale de una mina como la sal y se derrite con un cautín. Para que la predicción sea una que el alumno de verdad haría, el párrafo 2 recuerda que se confunden al endulzar el café.',
        'Revisión (Escribidor Escribano, 27 nov): se quitó «en la sal no hay moléculas sueltas», porque descartaba de antemano la opción «Moléculas sueltas, cada una con un sodio y un cloro» (error EN1) de la Predice de la idea 1. Para el atajo de la planta y la mina, un alumno podría objetar que el petróleo también viene de seres vivos; si Gerson lo prefiere, el estaño de soldar, que sale de una mina y se derrite con un cautín, sería un contraejemplo más limpio.',
        'El párrafo 3 dice solo que en el azúcar y en la sal los átomos se unen de maneras muy distintas: no dice que la sal esté hecha de iones ni cómo se acomodan, que es la respuesta de la Predice de la idea 1. Tampoco usa la corriente eléctrica, que es la Predice y la misión de esa idea.',
        'Precisión para Gerson: al derretir el azúcar no se rompen los enlaces de dentro de la molécula, sino las uniones débiles entre moléculas; por eso el texto dice «moléculas que se sueltan unas de otras». La idea 1 distingue enlace iónico, covalente y metálico, y la pregunta la abre sin responderla.',
      ],
    },
  };
})());
