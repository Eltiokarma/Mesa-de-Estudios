/*
 * Apertura de «Estructura atómica» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * Doble revisión (27 nov): la idea es intuitiva y se muestra aplicada (punto 7). Cada color del castillo de la fiesta
 * sale de un elemento elegido por el pirotécnico, y la sal que se derrama en la hornilla pinta la llama del amarillo del
 * sodio: cada elemento da siempre sus propios colores de luz, como una firma, y esa firma sirve para reconocerlo (la
 * prueba de llama, el helio hallado en la luz del Sol). Lo que el alumno se lleva (ficha.seLleva): la luz que da un
 * elemento es su firma, y esa firma sale de cómo es su átomo por dentro. No se nombran niveles, orbitales ni saltos de
 * electrones (ideas 2 a 4), ni se toca la Predice del sodio que pierde un electrón (idea 1). El cobre ya no aparece
 * aquí: queda para «Mol y composición», la unidad que sigue. Colores: la llama con sal en naranja (c-o, se lee
 * amarillo anaranjado, como la del sodio).
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  // Dos hornillas iguales con la misma llama y los mismos granitos de sal cayendo en ella. A la izquierda, la llama
  // que se espera, en trazo punteado; a la derecha, la que se ve, en trazo lleno. Coinciden: la intuición es correcta.
  const BASE = 262;
  const llama = (cx, punteada) => {
    const exterior = `M${cx} ${BASE - 150}C${cx + 22} ${BASE - 110} ${cx + 52} ${BASE - 70} ${cx + 46} ${BASE - 34}C${cx + 40} ${BASE - 6} ${cx - 40} ${BASE - 6} ${cx - 46} ${BASE - 34}C${cx - 52} ${BASE - 70} ${cx - 22} ${BASE - 110} ${cx} ${BASE - 150}Z`;
    const cono = `M${cx} ${BASE - 78}C${cx + 12} ${BASE - 58} ${cx + 20} ${BASE - 36} ${cx + 16} ${BASE - 22}C${cx + 10} ${BASE - 10} ${cx - 10} ${BASE - 10} ${cx - 16} ${BASE - 22}C${cx - 20} ${BASE - 36} ${cx - 12} ${BASE - 58} ${cx} ${BASE - 78}Z`;
    return `<path d="${exterior}" style="fill:var(--c-o)" fill-opacity="${punteada ? '.14' : '.32'}"/>
      <path d="${exterior}" fill="none" style="stroke:var(--c-o)" stroke-width="3.5" stroke-linejoin="round" ${punteada ? 'stroke-dasharray="10 7"' : ''}/>
      <path d="${cono}" style="fill:var(--c-o)" fill-opacity="${punteada ? '.25' : '.55'}"/>`;
  };
  // Granitos de sal (forma fija) que caen sobre el borde de la llama.
  const sal = cx => [[60, -96], [72, -80], [54, -70], [80, -62], [66, -52], [88, -44]]
    .map(([dx, dy]) => `<rect x="${cx + dx - 4}" y="${BASE + dy - 4}" width="8" height="8" rx="1.5" style="fill:var(--card)" stroke="currentColor" stroke-width="2"/>`).join('');
  const panel = (x0, titulo, punteada, rotulo, pie) => {
    const cx = x0 + 120;
    return `<text x="${x0 + 130}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      ${llama(cx, punteada)}
      <text x="${cx}" y="${BASE - 160}" text-anchor="middle" font-size="19" font-weight="700" style="fill:var(--c-o)">${rotulo}</text>
      ${sal(cx)}
      <text x="${cx + 112}" y="${BASE - 108}" text-anchor="end" font-size="18" font-weight="700" fill="currentColor">sal</text>
      <rect x="${cx - 62}" y="${BASE}" width="124" height="12" rx="6" fill="currentColor"/>
      <path d="M${cx - 92} ${BASE + 26}H${cx + 92}" style="stroke:var(--muted)" stroke-width="3" stroke-linecap="round"/>
      <path d="M${cx - 30} ${BASE + 12}V${BASE + 26}M${cx + 30} ${BASE + 12}V${BASE + 26}" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
      ${pie.map((l, i) => `<text x="${x0 + 130}" y="${336 + i * 26}" text-anchor="middle" font-size="22" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 384" width="520" height="384" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="374" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', true, '¿amarilla?', ['El sodio de la sal', 'da su amarillo'])}
    ${panel(260, 'Lo que se mide', false, 'amarilla', ['Con sal, la llama', 'sale amarilla'])}
  </svg>`;

  return {
    unidad: 'quimica.estructura-atomica',
    titulo: '¿Cómo sabe el pirotécnico de qué color saldrán las chispas del castillo?',
    parrafos: [
      ['En la fiesta patronal, el castillo suelta chispas rojas, verdes y amarillas, y cada color lo elige el pirotécnico antes de armarlo, porque sale de un elemento distinto mezclado con la pólvora. ',
        'En tu cocina se ve lo mismo en pequeño: cuando la sopa salada hierve y se derrama sobre la hornilla, la llama azul se pinta de un amarillo anaranjado, el color que da el sodio de la sal.'],
      ['Lo que sugieren el castillo y la hornilla es cierto: cada elemento da sus propios colores de luz, siempre los mismos, así que su luz funciona como una firma. ',
        'Con esa firma, un laboratorio reconoce qué elementos lleva una muestra acercándola a una llama, y los astrónomos encontraron el helio en la luz del Sol casi treinta años antes de hallarlo en la Tierra. ',
        'El color no es el del polvo que se echa al fuego, porque la sal es blanca y la llama sale amarilla.'],
      ['Si un elemento da siempre los mismos colores y otro elemento da otros, algo fijo y distinto tiene que haber dentro de cada átomo. ',
        'Esta unidad trata de eso que no se ve con ningún microscopio del colegio: cómo está armado el átomo por dentro, su estructura atómica.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos hornillas iguales con la misma llama y granitos de sal cayendo en ella. Lo que predice la idea de que cada elemento da su color: la llama se pintará del amarillo del sodio. Lo que se mide: con la sal, la llama sale amarilla.',
    },
    pregunta: 'La misma llama calienta por igual al sodio de la sal y al elemento que da el verde del castillo. ¿Qué crees que tienen distinto por dentro esos átomos para dar colores distintos?',
    ficha: {
      seLleva: 'Cada elemento da sus propios colores de luz, siempre los mismos, como una firma que sirve para reconocerlo, y esa firma sale de cómo está armado su átomo por dentro.',
      alcance: 'Parcial (núcleo: una evidencia que se ve, el color de la llama, sirve para reconocer elementos y obliga a pensar en la estructura de algo que no se ve; los modelos atómicos y los números cuánticos no entran en PISA).',
      choque: 'Sin choque forzado (punto 7 de la segunda revisión): la intuición «cada elemento da su color» es correcta y se muestra aplicada (castillo, prueba de llama, helio en el Sol); la pregunta abierta es qué hay dentro del átomo que fija esa firma.',
      atajo: 'El atajo «es el color del polvo» se descarta con la sal, que es blanca y pinta la llama de amarillo. La versión anterior usaba «el color marca la temperatura, como en el fierro del herrero», que nadie aplica a una llama de cocina: era un muñeco de paja y se quitó.',
      porVerificar: [
        'Que cada color de los fuegos artificiales salga de un elemento distinto (de memoria: rojo del estroncio, verde del bario, amarillo del sodio, azul del cobre). El texto no nombra los elementos del castillo.',
        'Que la sopa salada que se derrama sobre la hornilla pinte la llama de amarillo anaranjado (es el sodio de la sal; lo esperado y fácil de ver).',
        'Que el helio se descubriera en la luz del Sol en 1868 (eclipse; Janssen y Lockyer) y en la Tierra en 1895 (Ramsay): 27 años, «casi treinta» (de memoria).',
        'Que la prueba de llama sirva en el laboratorio para reconocer elementos (es una prueba escolar clásica).',
      ],
      notas: [
        'Doble revisión (27 nov): reescrita. Antes: «¿Por qué el cobre pinta de verde la llama azul, si no la calienta más?», con la predicción de que el color de la llama marca su temperatura, como el fierro del herrero. Gerson la puso de ejemplo de muñeco de paja: nadie cree que el cobre colorea la llama porque la calienta más. Después: la idea es intuitiva y útil, así que la apertura la muestra aplicada (el pirotécnico elige el elemento para elegir el color; la luz es una firma que delata al elemento) y «Lo que predice» es la intuición correcta, con la llama punteada que la medición confirma.',
        'Doble revisión (27 nov): se quitó el cobre de esta unidad porque aparece también en «Mol y composición» (63,55 u), la unidad que sigue; ahí el cobre hace falta por su proporción de isótopos (69 % y 31 %). Aquí lo reemplaza el sodio de la sal, que el alumno ve en su cocina.',
        'El párrafo 3 nombra la estructura atómica como la salida y no explica cómo sale la luz: ni niveles, ni saltos de electrones. La pregunta se puede intentar con lo que sabe un alumno de 5.º (los átomos tienen protones y electrones, y cada elemento tiene un número distinto) y abre la idea 1 sin responder su Predice, que es sobre el ion Na⁺.',
      ],
    },
  };
})());
