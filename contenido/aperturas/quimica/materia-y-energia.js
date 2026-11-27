/*
 * Apertura de «Materia y energía» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * Doble revisión (27 nov): la idea es intuitiva y se muestra aplicada (punto 7). En las salineras de Maras, el sol
 * evapora un agua transparente y queda la sal; en la tetera, el agua del caño deja sarro y la destilada no. Lo que el
 * alumno se lleva (ficha.seLleva): mirar un material no basta para saber si es una sola sustancia. La figura no dibuja
 * partículas, para no adelantar la lupa del juego de la idea 1, y no toca la Predice del hielo en el vaso (idea 1),
 * la de las ollas de Juliaca (idea 2) ni la de la botella que suda (idea 3). Colores: el agua en turquesa (c-i); el
 * sarro, en el color de la tarjeta con borde de tinta.
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  // Dos teteras iguales, cortadas para ver adentro, con el mismo nivel de agua del caño. A la izquierda, la costra que
  // se espera, en trazo punteado; a la derecha, la costra de sarro que se ve. La costra es una forma fija (sin azar)
  // con bultos de alto distinto.
  const ABAJO = 290, ARRIBA = 170, NIVEL = 206;
  const anchoEn = y => 84 - 30 * (ABAJO - y) / (ABAJO - ARRIBA); // media anchura del cuerpo a la altura y
  const tetera = (cx, sarro) => {
    const a = anchoEn(ABAJO), t = anchoEn(ARRIBA), wN = anchoEn(NIVEL);
    const cuerpo = `M${cx - a + 12} ${ABAJO}Q${cx - a} ${ABAJO} ${cx - a + 1} ${ABAJO - 12}L${cx - t} ${ARRIBA}Q${cx - t + 8} ${ARRIBA - 26} ${cx} ${ARRIBA - 28}Q${cx + t - 8} ${ARRIBA - 26} ${cx + t} ${ARRIBA}L${cx + a - 1} ${ABAJO - 12}Q${cx + a} ${ABAJO} ${cx + a - 12} ${ABAJO}Z`;
    const agua = `M${(cx - wN).toFixed(1)} ${NIVEL}L${cx - a + 1} ${ABAJO - 12}Q${cx - a} ${ABAJO} ${cx - a + 12} ${ABAJO}L${cx + a - 12} ${ABAJO}Q${cx + a} ${ABAJO} ${cx + a - 1} ${ABAJO - 12}L${(cx + wN).toFixed(1)} ${NIVEL}Z`;
    const bultos = [14, 20, 12, 22, 16, 24, 13, 21, 17, 23, 12, 19, 15];
    const x0 = cx - a + 5, paso = (2 * a - 10) / (bultos.length - 1);
    let costra = `M${x0} ${ABAJO - 3}L${x0} ${ABAJO - 10}`;
    bultos.forEach((h, i) => { const x = x0 + i * paso; costra += `Q${(x - paso / 2).toFixed(1)} ${ABAJO - 3 - h - 6} ${x.toFixed(1)} ${ABAJO - 3 - h}`; });
    costra += `L${cx + a - 5} ${ABAJO - 3}Z`;
    // Granitos de la costra, para que se lea como un sólido y no como un charco, en tema claro y oscuro.
    const granos = bultos.slice(1, -1).map((h, i) => { const x = x0 + (i + 1) * paso; return `<circle cx="${(x - paso / 3).toFixed(1)}" cy="${ABAJO - 9 - (i % 3) * 3}" r="2"/><circle cx="${(x + paso / 4).toFixed(1)}" cy="${ABAJO - 13 + (i % 2) * 5}" r="1.6"/>`; }).join('');
    const tL = cx - t - 3; // el pico sale del costado izquierdo
    return `
      <path d="M${tL + 4} ${ARRIBA + 34}L${tL - 40} ${ARRIBA - 22}" fill="none" stroke="currentColor" stroke-width="16" stroke-linecap="round"/>
      <path d="M${tL + 4} ${ARRIBA + 34}L${tL - 40} ${ARRIBA - 22}" fill="none" style="stroke:var(--bg)" stroke-width="9" stroke-linecap="round"/>
      <path d="M${cx - 46} ${ARRIBA - 20}Q${cx} ${ARRIBA - 100} ${cx + 46} ${ARRIBA - 20}" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
      <path d="${cuerpo}" style="fill:var(--bg)"/>
      <path d="${agua}" style="fill:var(--c-i)" fill-opacity=".22"/>
      <line x1="${(cx - wN).toFixed(1)}" y1="${NIVEL}" x2="${(cx + wN).toFixed(1)}" y2="${NIVEL}" style="stroke:var(--c-i)" stroke-width="3" stroke-linecap="round"/>
      ${sarro === 'esperado' ? `<path d="${costra}" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" stroke-dasharray="7 5"/>` : ''}
      ${sarro === true ? `<path d="${costra}" style="fill:var(--card)" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>
      <g fill="currentColor" fill-opacity=".55">${granos}</g>` : ''}
      <path d="${cuerpo}" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/>
      <circle cx="${cx}" cy="${ARRIBA - 34}" r="7" style="fill:var(--card)" stroke="currentColor" stroke-width="3"/>
      <line x1="${cx - 100}" y1="${ABAJO + 10}" x2="${cx + 100}" y2="${ABAJO + 10}" style="stroke:var(--muted)" stroke-width="3" stroke-linecap="round"/>`;
  };
  const panel = (x0, titulo, sarro, rotulo, pie) => {
    const cx = x0 + 138;
    return `<text x="${x0 + 130}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      ${tetera(cx, sarro)}
      <text x="${cx}" y="${NIVEL + 28}" text-anchor="middle" font-size="19" font-weight="700" style="fill:var(--c-i)">agua</text>
      ${rotulo}
      ${pie.map((l, i) => `<text x="${x0 + 130}" y="${340 + i * 26}" text-anchor="middle" font-size="22" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 384" width="520" height="384" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="374" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', 'esperado', '<text x="138" y="256" text-anchor="middle" font-size="20" font-weight="800" fill="currentColor">¿sales?</text>', ['Lo disuelto se queda', 'cuando el agua se va'])}
    ${panel(260, 'Lo que se mide', true, '<text x="398" y="256" text-anchor="middle" font-size="20" font-weight="800" fill="currentColor">sarro</text>', ['Deja una costra', 'blanca de sales'])}
  </svg>`;

  return {
    unidad: 'quimica.materia-y-energia',
    titulo: '¿Qué tienen en común la sal de Maras y la costra blanca de la tetera?',
    parrafos: [
      ['En las salineras de Maras, en el Cusco, un manantial deja correr un agua tan transparente como la del caño hacia miles de pozas en la ladera. ',
        'Durante semanas, el sol evapora el agua de cada poza y en el fondo queda una capa blanca de sal, que los salineros raspan y embolsan.'],
      ['Lo que te dice la intuición es cierto: el agua del manantial lleva sal disuelta que no se ve, y cuando el agua se va en vapor, la sal se queda. ',
        'Lo mismo pasa en tu cocina, donde el agua del caño deja con los meses una costra blanca en el fondo de la tetera, el sarro, mientras que el agua destilada que se compra para la plancha no deja nada. ',
        'El sarro no es óxido de la tubería, porque también se forma en una tetera de vidrio: son sales que el agua traía disueltas.'],
      ['Por eso mirar un material no basta para saber de qué está hecho: dos aguas que se ven iguales pueden llevar cosas distintas, y dejarlas evaporar es una manera de averiguarlo. ',
        'Esta unidad, materia y energía, trata de cómo se distingue una sustancia pura de una mezcla y de cuánta energía cuesta cambiar un material, como la que pone el sol para evaporar el agua de Maras.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos teteras iguales, cortadas para ver adentro, con el mismo nivel de agua del caño. Lo que predice la idea de que lo disuelto se queda cuando el agua se evapora: una costra en el fondo, dibujada en punteado. Lo que se mide: en el fondo queda una costra blanca de sales, el sarro.',
    },
    pregunta: 'El agua de mar y el agua del caño se ven igual de transparentes en un vaso. Si dejas secar al sol un platito de cada una, ¿cuál crees que dejará más polvo blanco, y por qué?',
    ficha: {
      seLleva: 'Mirar un material no basta para saber si es una sola sustancia: el agua de Maras y la del caño se ven puras y llevan sales disueltas, que quedan a la vista cuando el agua se evapora.',
      alcance: 'Sí en el núcleo (Ciencias PISA: explicar un fenómeno con la idea de que un material puede tener varias sustancias que no se ven); la clasificación formal de mezclas y las energías de cambio son del temario de admisión.',
      choque: 'Sin choque forzado (punto 7 de la segunda revisión): la intuición «lo disuelto se queda cuando el agua se evapora» es correcta y se muestra aplicada (la sal de Maras, el sarro de la tetera); lo que se lleva es que el aspecto no basta para saber si algo es una sola sustancia.',
      atajo: 'El atajo «el sarro es óxido de la tubería» se descarta porque también aparece en una tetera de vidrio. La versión anterior oponía el sarro a «el agua es H₂O», como si un alumno creyera que el agua del caño es H₂O pura: era un muñeco de paja y se quitó.',
      porVerificar: [
        'Salineras de Maras (Urubamba, Cusco): un manantial salado alimenta unas 3000 a 5000 pozas en la ladera, el agua se evapora al sol en unas semanas y los salineros de la zona raspan la sal (de memoria; el texto dice «miles de pozas» y «durante semanas»).',
        'Que el sarro se forme igual en teteras de vidrio (es lo esperado: son sales de calcio y magnesio del agua, no óxido del metal).',
        'Que el agua del caño de buena parte del Perú deje sarro (de memoria: aguas duras en buena parte de la costa y en muchas ciudades de la sierra; en ciudades de agua blanda se nota menos).',
        'Que el agua destilada que se vende para la plancha no deje residuo visible al hervirse (lo esperado, porque casi no tiene sales).',
      ],
      notas: [
        'Doble revisión (27 nov): reescrita. Antes: «¿Por qué el agua del caño deja una costra blanca en la tetera, si el agua es H₂O?», con la predicción de que el agua del caño, por ser H₂O, dejaría la tetera limpia. Gerson la puso de ejemplo de muñeco de paja: nadie cree que el agua del caño sea H₂O pura. Después: la idea es intuitiva y útil, así que la apertura la muestra aplicada en las salineras de Maras y en la tetera, y «Lo que predice» es la intuición correcta (la costra punteada que la medición confirma). Se quitaron los datos de Sedapal (décimas de gramo por litro) y el filtro de carbón, que cargaban el texto y no hacían falta. La pregunta ahora pide usar la idea con el agua de mar y la del caño en un platito; no se compara con la destilada, porque el texto ya dice que esa no deja nada.',
        'Revisión (Escribidor Escribano, 27 nov): se decidió que la apertura no delata la misión de la idea 1. La consigna de esa misión ya dice que el vaso se endulzó con azúcar, así que saber que el agua del caño lleva sales disueltas no le resuelve nada al alumno; tampoco toca la Predice del hielo. Solo se reordenó la última oración, que tenía un sujeto de 30 palabras antes del verbo.',
        'La figura no dibuja partículas ni la lupa: eso es del juego de la idea 1. La pregunta se puede intentar con lo leído (hervir o dejar secar un poco de cada agua en un platito) y abre la idea 1 («¿Sustancia pura o mezcla?») sin responder su Predice, que es sobre el hielo en el agua.',
        'La misión de la idea 1 pide armar un vaso que se vea como agua destilada y sea mezcla: la apertura muestra que eso existe (el agua del caño), pero no dice qué echar ni usa las frases del acierto. Si Gerson prefiere que la apertura no dé ninguna pista de esa misión, habría que cambiar de hecho.',
        'El párrafo 3 nombra la energía de paso, para que el nombre de la unidad no quede a medias; el choque es solo el de la sustancia.',
      ],
    },
  };
})());
