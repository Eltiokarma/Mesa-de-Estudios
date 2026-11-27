/*
 * Apertura de «Propiedades periódicas» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * El choque está en un museo del Perú: el oro de la tumba del Señor de Sipán seguía dorado después de unos 1700 años
 * bajo tierra, el cobre enterrado suele ponerse verde y un clavo de hierro se oxida en semanas, aunque el hierro es
 * mucho más duro que el oro. Lo que el alumno se lleva (ficha.seLleva): oxidarse es soltar electrones, y cada elemento
 * los suelta con más o menos facilidad según su lugar en la tabla. No se habla de radios (idea 1 y su misión), ni de
 * iones isoelectrónicos (idea 2), ni del fósforo y el azufre (Predice de la idea 3), ni del flúor (Predice de la
 * idea 4). Colores: el oro en naranja (c-o) y la herrumbre en rosa (c-h).
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  // En cada panel, la misma orejera de oro (un disco con un borde de bolitas) y el mismo clavo de hierro.
  const orejera = (cx, cy, gastada) => {
    const bolitas = Array.from({ length: 14 }, (_, i) => {
      const a = i * Math.PI * 2 / 14;
      return `<circle cx="${(cx + 44 * Math.cos(a)).toFixed(1)}" cy="${(cy + 44 * Math.sin(a)).toFixed(1)}" r="5.5" style="fill:var(--c-o)" fill-opacity="${gastada ? '.35' : '.85'}"/>`;
    }).join('');
    const brillo = gastada ? '' : `<path d="M${cx + 50} ${cy - 50}l10 -10M${cx + 58} ${cy - 28}h14M${cx + 30} ${cy - 62}v-14" style="stroke:var(--c-o)" stroke-width="3.5" stroke-linecap="round"/>`;
    const grietas = gastada ? `<path d="M${cx - 20} ${cy - 18}l10 8l-4 10l12 6M${cx + 14} ${cy + 4}l8 -10l10 4M${cx - 6} ${cy + 22}l-10 6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity=".7"/>` : '';
    return `${brillo}<circle cx="${cx}" cy="${cy}" r="36" style="fill:var(--c-o)" fill-opacity="${gastada ? '.18' : '.5'}"/>
      <circle cx="${cx}" cy="${cy}" r="36" fill="none" style="stroke:var(--c-o)" stroke-width="3.5" ${gastada ? 'stroke-dasharray="10 6"' : ''}/>
      <circle cx="${cx}" cy="${cy}" r="16" fill="none" style="stroke:var(--c-o)" stroke-width="3"/>
      ${bolitas}${grietas}`;
  };
  const clavo = (cx, y0, oxidado) => {
    const manchas = oxidado ? [[-3, 20, 9], [4, 40, 10], [-2, 62, 9], [3, 84, 10], [-1, 104, 8], [1, 122, 6], [-12, 0, 7], [12, 2, 7]]
      .map(([dx, dy, r]) => `<ellipse cx="${cx + dx}" cy="${y0 + dy}" rx="${r}" ry="${r + 3}" style="fill:var(--c-h)" fill-opacity=".7"/>`).join('') : '';
    return `<rect x="${cx - 22}" y="${y0 - 8}" width="44" height="10" rx="4" style="fill:var(--card)" stroke="currentColor" stroke-width="3"/>
      <path d="M${cx - 6} ${y0 + 2}V${y0 + 118}L${cx} ${y0 + 140}L${cx + 6} ${y0 + 118}V${y0 + 2}" style="fill:var(--card)" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
      ${manchas}`;
  };
  const panel = (x0, titulo, mide, pie) => {
    const xo = x0 + 86, xc = x0 + 196;
    return `<text x="${x0 + 130}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      ${orejera(xo, 168, !mide)}
      ${clavo(xc, 112, mide)}
      <text x="${xo}" y="248" text-anchor="middle" font-size="19" font-weight="700" style="fill:var(--c-o)">oro</text>
      <text x="${xc}" y="282" text-anchor="middle" font-size="19" font-weight="700" ${mide ? 'style="fill:var(--c-h)"' : 'fill="currentColor"'}>hierro</text>
      ${mide ? `<text x="${xo}" y="272" text-anchor="middle" font-size="17" style="fill:var(--muted)">1700 años</text>
      <text x="${xc}" y="304" text-anchor="middle" font-size="17" style="fill:var(--muted)">semanas</text>` : ''}
      ${pie.map((l, i) => `<text x="${x0 + 130}" y="${342 + i * 26}" text-anchor="middle" font-size="22" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 384" width="520" height="384" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="374" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', false, ['El hierro, más duro,', 'duraría más'])}
    ${panel(260, 'Lo que se mide', true, ['El oro brilla;', 'el hierro se oxida'])}
  </svg>`;

  return {
    unidad: 'quimica.propiedades-periodicas',
    titulo: '¿Por qué el oro de Sipán sigue dorado después de unos 1700 años, si un clavo se oxida en semanas?',
    parrafos: [
      ['En 1987, en Lambayeque, los arqueólogos abrieron la tumba del Señor de Sipán, enterrado hace unos 1700 años, y entre sus joyas encontraron piezas de oro que seguían doradas. ',
        'El cobre que pasa siglos bajo tierra, en cambio, suele cubrirse de una costra verde, y en una ciudad húmeda como Lima un clavo de hierro que se deja al aire se llena de herrumbre en pocas semanas.'],
      ['Lo que sabes de los materiales predice otra cosa: lo más duro y resistente tendría que durar más, y el hierro es mucho más duro que el oro, que se raya con facilidad y en lámina delgada se dobla con los dedos. ',
        'Tampoco sirve pensar que la tumba protegió al oro, porque el cobre enterrado en condiciones parecidas se pone verde, ni llamarlo «metal noble», que solo repite que no se oxida y no dice por qué.'],
      ['Para un metal, oxidarse es soltar electrones a otro elemento, como el oxígeno del aire, y los átomos de oro retienen sus electrones con más fuerza que los de hierro o de cobre. ',
        'Lo que le cuesta a un átomo soltar un electrón cambia de un elemento a otro, igual que su tamaño, y de esas propiedades periódicas trata esta unidad.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'La misma orejera de oro y el mismo clavo de hierro en los dos paneles. Lo que predice la idea de que lo más duro dura más: el clavo intacto y el oro gastado. Lo que se mide: el oro sigue dorado después de unos 1700 años y el clavo se llena de herrumbre en semanas.',
    },
    pregunta: 'El oro y el hierro están en la misma tabla, pero uno se oxida y el otro no. ¿Qué crees que tendrías que medirle a un átomo para saber si un metal se oxidará con facilidad?',
    ficha: {
      seLleva: 'Que un metal se oxide no depende de lo duro que sea, sino de qué tan fácil sueltan electrones sus átomos, y eso cambia de un elemento a otro según su lugar en la tabla.',
      alcance: 'Parcial (núcleo: explicar con una propiedad de las partículas por qué dos materiales envejecen distinto; las tendencias periódicas formales no entran en PISA). Deducción propia.',
      choque: 'Lo más duro debería durar más; el hierro, más duro, se oxida en semanas, y el oro de Sipán brillaba después de unos 1700 años.',
      atajo: 'Se descartan dos atajos: «la tumba lo protegió» (el cobre de la misma tumba se corroyó) y «es un metal noble» (solo nombra el hecho). Decir que el oro «es más resistente» confunde la dureza con la resistencia a oxidarse.',
      porVerificar: [
        'El hallazgo de la tumba del Señor de Sipán en 1987 (Walter Alva) y su antigüedad, de unos 1700 años (de memoria: hacia el siglo III d. C.).',
        'Que en la tumba las piezas de cobre o de cobre dorado salieran con corrosión verde y las de oro, sin corroer (de memoria; conviene confirmarlo con el Museo Tumbas Reales de Sipán o con Alva y otros, «Das Fürstengrab von Sipán», RGZM, Maguncia, 1989, donde se restauraron las piezas). Mientras no se confirme, el texto ya no lo afirma de esa tumba: dice que el oro «seguía dorado», que se sigue de que el oro no se oxida, y que el cobre enterrado «suele» ponerse verde, que es lo general.',
        'Que un clavo de hierro sin protección se oxide en pocas semanas en el aire húmedo de Lima (lo esperado; el tiempo depende de la humedad y de la sal del aire).',
        'Energía de primera ionización: oro unos 890 kJ/mol, hierro unos 762 kJ/mol y cobre unos 745 kJ/mol (de memoria). El texto no da las cifras.',
        'Que el hierro sea mucho más duro que el oro (dureza de Mohs: oro unos 2,5 a 3, hierro unos 4 a 5; de memoria).',
      ],
      notas: [
        'Revisión (Escribidor Escribano, 27 nov): el texto ya no afirma como hecho que el cobre de la misma tumba saliera verde (ver porVerificar). Del párrafo 3 se quitó «según su lugar en la tabla» y la lista de tres propiedades, porque enunciaba la regla de la unidad; queda el choque (el oro retiene sus electrones con más fuerza) y el nombre del tema.',
        'Simplificación consciente: que un metal se corroa depende también del agua, de la capa que forma su óxido y de otras cosas; la apertura lo reduce a qué tan fácil suelta electrones, que es lo que la unidad enseña (energía de ionización y carácter metálico). Para el oro, su gran energía de ionización tiene además una causa relativista que no se menciona.',
        'La pregunta abre la idea 3 (energía de ionización) sin responder su Predice, que compara el fósforo y el azufre. No se habla del tamaño de los átomos para no tocar la idea 1, cuya misión es encontrar el átomo más grande.',
      ],
    },
  };
})());
