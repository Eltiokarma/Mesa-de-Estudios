/*
 * Apertura de «Materia y energía» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * El choque se ve en la cocina: el agua del caño, que en el colegio es «H₂O» y se ve tan transparente como la
 * destilada, deja costras blancas (sarro) en la tetera; la destilada de la plancha no deja nada. Lo que el alumno se
 * lleva (ficha.seLleva): mirar un material no basta para saber si es una sola sustancia. La figura no dibuja
 * partículas, para no adelantar la lupa del juego de la idea 1, y no toca la Predice del hielo en el vaso (idea 1),
 * la de las ollas de Juliaca (idea 2) ni la de la botella que suda (idea 3). Colores: el agua en turquesa (c-i); el
 * sarro, en el color de la tarjeta con borde de tinta.
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  // Dos teteras iguales, cortadas para ver adentro, con el mismo nivel de agua. La de la derecha tiene una costra de
  // sarro en el fondo; la de la izquierda, no. La costra es una forma fija (sin azar) con bultos de alto distinto.
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
      ${sarro ? `<path d="${costra}" style="fill:var(--card)" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>
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
    ${panel(0, 'Lo que predice', false, '', ['Si fuera solo H₂O,', 'quedaría limpia'])}
    ${panel(260, 'Lo que se mide', true, '<text x="398" y="256" text-anchor="middle" font-size="20" font-weight="800" fill="currentColor">sarro</text>', ['Deja una costra', 'blanca de sales'])}
  </svg>`;

  return {
    unidad: 'quimica.materia-y-energia',
    titulo: '¿Por qué el agua del caño deja una costra blanca en la tetera, si el agua es H₂O?',
    parrafos: [
      ['En muchas cocinas de Lima, Ica o Arequipa, el fondo de la tetera se cubre con los meses de una costra blanca y dura, que se conoce como sarro. ',
        'Los análisis del agua potable de Lima encuentran unas décimas de gramo de sales disueltas en cada litro, y al hervir el agua una parte de esas sales se queda pegada al metal.'],
      ['En el colegio aprendiste que el agua es H₂O, una molécula con un oxígeno y dos hidrógenos, y el agua del caño se ve tan transparente como la de un laboratorio. ',
        'Si el agua del caño fuera solo H₂O, al hervir se iría toda en vapor y la tetera quedaría limpia, que es lo que pasa con el agua destilada que se compra para la plancha. ',
        'Tampoco basta con decir que el sarro es óxido o suciedad de la tubería, porque también se forma en una tetera de vidrio y con agua que pasó por un filtro de carbón.'],
      ['El agua del caño se ve como una sola cosa y no lo es: lleva otras sustancias disueltas que no se ven, y aparecen recién cuando el agua se va en vapor. ',
        'Esta unidad, materia y energía, trata de cómo saber de qué está hecho un material aunque a la vista parezca uno solo, y de cuánta energía cuesta cambiarlo, como la que se gasta al hervir el agua.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos teteras iguales, cortadas para ver adentro, con el mismo nivel de agua. Lo que predice la idea de que el agua del caño es solo H₂O: la tetera queda limpia al hervir. Lo que se mide: en el fondo y en las paredes queda una costra blanca de sales, el sarro.',
    },
    pregunta: 'El agua del caño y el agua destilada se ven iguales dentro de un vaso. ¿Qué harías en tu casa para averiguar cuál de los dos vasos lleva algo disuelto?',
    ficha: {
      seLleva: 'Mirar un material no basta para saber si es una sola sustancia: el agua del caño se ve pura y lleva sales disueltas, que aparecen como sarro cuando el agua se evapora.',
      alcance: 'Sí en el núcleo (Ciencias PISA: explicar un fenómeno con la idea de que un material puede tener varias sustancias que no se ven); la clasificación formal de mezclas y las energías de cambio son del temario de admisión.',
      choque: 'Si el agua es H₂O y el agua del caño se ve igual que la destilada, al hervir no debería dejar nada; deja sarro, y la destilada no.',
      atajo: 'El atajo «es óxido o suciedad de la tubería» se descarta porque el sarro también aparece en una tetera de vidrio y con agua filtrada con carbón. Decir que «el agua del caño es impura» solo nombra el hecho sin decir qué la hace distinta.',
      porVerificar: [
        'Que el agua potable de Lima tenga «unas décimas de gramo» de sales disueltas por litro (de memoria: sólidos disueltos totales del orden de 0,3 a 0,5 g/L y dureza de unos 0,2 a 0,3 g/L como carbonato de calcio, según los informes de Sedapal; conviene abrir uno reciente).',
        'Que el sarro sea común también en Ica y Arequipa (de memoria: aguas duras en buena parte de la costa).',
        'Que un filtro de carbón activado doméstico no quite la dureza y que el sarro se forme igual en teteras de vidrio (es lo esperado: el carbón retiene cloro y olores, no el calcio disuelto).',
        'Que el agua destilada que se vende para la plancha no deje residuo visible al hervirse (lo esperado, porque casi no tiene sales).',
      ],
      notas: [
        'Revisión (Escribidor Escribano, 27 nov): se decidió que la apertura no delata la misión de la idea 1. La consigna de esa misión ya dice que el vaso se endulzó con azúcar, así que saber que el agua del caño lleva sales disueltas no le resuelve nada al alumno; tampoco toca la Predice del hielo. Solo se reordenó la última oración, que tenía un sujeto de 30 palabras antes del verbo.',
        'La figura no dibuja partículas ni la lupa: eso es del juego de la idea 1. La pregunta se puede intentar con lo leído (hervir o dejar secar un poco de cada agua en un platito) y abre la idea 1 («¿Sustancia pura o mezcla?») sin responder su Predice, que es sobre el hielo en el agua.',
        'La misión de la idea 1 pide armar un vaso que se vea como agua destilada y sea mezcla: la apertura muestra que eso existe (el agua del caño), pero no dice qué echar ni usa las frases del acierto. Si Gerson prefiere que la apertura no dé ninguna pista de esa misión, habría que cambiar de hecho.',
        'El párrafo 3 nombra la energía de paso, para que el nombre de la unidad no quede a medias; el choque es solo el de la sustancia.',
      ],
    },
  };
})());
