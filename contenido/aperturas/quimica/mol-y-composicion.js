/*
 * Apertura de «Mol y composición» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * El choque está en el número que el alumno ve en la tabla de la pared: el cobre, que el Perú saca de sus minas y que
 * va en los cables de la casa, tiene una masa de 63,55 u, y ningún átomo de cobre tiene esa masa; solo hay átomos de
 * casi 63 u y de casi 65 u. Lo que el alumno ya sabe (protones y neutrones enteros) predice un número entero. Lo que
 * se lleva (ficha.seLleva): el número de la tabla describe una mezcla de átomos, la que sale de la mina, y con esas
 * masas se cuentan átomos pesando. Se eligió el cobre y no el cloro para no tocar la misión de la idea 1 (la mezcla de
 * cloro que da 35,45 u) ni el magnesio de su Predice (24,3 u). Colores: los átomos de 63 u en naranja (c-o) y los de
 * 65 u en turquesa (c-i).
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  // En cada panel, la casilla del cobre (como en la tabla de la pared) y debajo diez átomos de un trozo de cable:
  // siete de 63 u y tres de 65 u, que es cerca de la proporción real (69 % y 31 %). Lo único que cambia es el número de
  // la casilla.
  const casilla = (cx, numero, mide) => `
      <rect x="${cx - 58}" y="56" width="116" height="124" rx="10" style="fill:var(--card)" stroke="currentColor" stroke-width="3"/>
      <text x="${cx - 46}" y="82" font-size="18" font-weight="700" fill="currentColor">29</text>
      <text x="${cx}" y="134" text-anchor="middle" font-size="46" font-weight="800" fill="currentColor">Cu</text>
      <text x="${cx}" y="166" text-anchor="middle" font-size="${mide ? 22 : 20}" font-weight="800" ${mide ? 'style="fill:var(--c-h)"' : 'fill="currentColor"'}>${numero}</text>`;
  const atomos = cx => {
    const orden = [63, 65, 63, 63, 65, 63, 63, 65, 63, 63];
    return orden.map((m, i) => {
      const x = cx - 100 + (i % 5) * 50, y = 222 + Math.floor(i / 5) * 46, c = m === 63 ? '--c-o' : '--c-i', r = m === 63 ? 18 : 20;
      return `<circle cx="${x}" cy="${y}" r="${r}" style="fill:var(${c})" fill-opacity=".22"/>
      <circle cx="${x}" cy="${y}" r="${r}" fill="none" style="stroke:var(${c})" stroke-width="3"/>
      <text x="${x}" y="${y + 6}" text-anchor="middle" font-size="16" font-weight="800" style="fill:var(${c})">${m}</text>`;
    }).join('');
  };
  const panel = (x0, titulo, numero, mide, pie) => {
    const cx = x0 + 130;
    return `<text x="${cx}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      ${casilla(cx, numero, mide)}
      ${atomos(cx)}
      ${pie.map((l, i) => `<text x="${cx}" y="${328 + i * 26}" text-anchor="middle" font-size="22" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 384" width="520" height="384" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="374" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', '63 o 65', false, ['La tabla daría', 'un número entero'])}
    ${panel(260, 'Lo que se mide', '63,55', true, ['Ningún átomo', 'tiene 63,55 u'])}
  </svg>`;

  return {
    unidad: 'quimica.mol-y-composicion',
    titulo: '¿Por qué la tabla le da al cobre una masa de 63,55 u, si ningún átomo de cobre la tiene?',
    parrafos: [
      ['El Perú es uno de los mayores productores de cobre del mundo, y parte de ese cobre termina en los cables de luz de tu casa. ',
        'Cuando los químicos miden la masa de los átomos de cobre uno por uno, con un aparato llamado espectrómetro de masas, encuentran solo dos clases: unos de casi 63 unidades de masa atómica (u) y otros de casi 65 u.'],
      ['En el colegio aprendiste que la masa de un átomo está casi toda en sus protones y neutrones, que se cuentan con números enteros, así que la tabla periódica tendría que darle al cobre 63 o 65. ',
        'Pero la tabla de la pared del salón dice 63,55, y no hay un solo átomo de cobre que tenga esa masa. ',
        'Tampoco es un redondeo ni un error de medición, porque las dos clases de átomo se miden con mucha precisión, en 62,93\u00a0u y 64,93\u00a0u, y ninguna de las dos se redondea a 63,55.'],
      ['El número de la tabla no describe un átomo, sino el cobre tal como sale de la mina, que trae las dos clases de átomo revueltas. ',
        'Con números como ese, los químicos cuentan los átomos de una sustancia pesándola, y de cómo se hace esa cuenta trata esta unidad, el mol y la composición.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'La casilla del cobre de la tabla periódica y, debajo, diez átomos de cobre: siete de 63 u y tres de 65 u. Lo que predice la idea de que la masa es un número entero: la casilla diría 63 o 65. Lo que se mide: la casilla dice 63,55, una masa que no tiene ningún átomo.',
    },
    pregunta: '¿Crees que el cobre de una mina de Arequipa y el de una mina de Apurímac tendrían el mismo 63,55 de la tabla, si cada uno trae sus dos clases de átomo revueltas?',
    ficha: {
      seLleva: 'El número de la tabla periódica no es la masa de un átomo, sino la de la mezcla de átomos que trae un elemento en la naturaleza, y con esas masas se cuentan átomos pesando.',
      alcance: 'Parcial (núcleo del informe PISA para estequiometría: proporción y cantidad; el mol como unidad no entra en PISA). Deducción propia.',
      choque: 'Si la masa de un átomo es casi un entero (protones más neutrones), la tabla debería decir 63 o 65; dice 63,55, que no es la masa de ningún átomo de cobre.',
      atajo: 'El atajo «es un redondeo o un error de medición» se descarta porque las dos masas se miden con mucha precisión (62,9296 u y 64,9278 u; el texto da 62,93 u y 64,93 u) y ninguna se redondea a 63,55.',
      porVerificar: [
        'Masas de los isótopos del cobre: cobre-63, 62,9296 u, y cobre-65, 64,9278 u; abundancias de unos 69,2 % y 30,8 % (de memoria; masa atómica 63,546 u).',
        'Que el Perú sea uno de los mayores productores de cobre del mundo (de memoria: segundo o tercero en los últimos años; el texto no da el puesto).',
        'Que el cobre de los cables de una casa peruana venga en parte de minas peruanas (lo razonable; el texto dice «parte de ese cobre»).',
        'Que la abundancia de los isótopos del cobre sea casi la misma en cualquier mina, de Arequipa, de Apurímac o de otro país, que es la respuesta de la pregunta (lo esperado: las variaciones naturales son de milésimas; antes de publicar, confirmarlo con la IUPAC; por eso la tabla puede dar un solo número).',
      ],
      notas: [
        'Doble revisión (27 nov): el choque es justo (el mismo cobre, la misma casilla, 63 o 65 contra 63,55) y la predicción del número entero es la que haría un alumno que aprendió que el número de masa suma protones y neutrones; se mantiene. Se simplificó la última oración del párrafo 2: antes daba las masas con cuatro decimales («62,9296 u y 64,9278 u»), que cargaban la lectura sin cambiar el argumento; ahora da 62,93 u y 64,93 u y dice que ninguna se redondea a 63,55. El cobre se queda aquí, porque su proporción de isótopos (69 % y 31 %) sostiene la figura, y sale de «Estructura atómica», que ahora usa el sodio de la sal.',
        'Revisión (Escribidor Escribano, 27 nov): la pregunta anterior («tantos de 63 como de 65 darían 64; ¿qué significa 63,55?») llevaba al alumno a la idea de que el promedio se acerca al isótopo más abundante, que es justo lo que separa la respuesta de la Predice de la idea 1 (24,3 u) de su opción «25 u» (QM-PROMEDIO-SIMPLE), y se acercaba a la misión del cloro. La nueva pregunta trata de la mezcla sin pedir el promedio. Se quitó también «porque nadie puede contarlos uno por uno», que descartaba la opción «No se sabe sin contarlas una por una» (ES3) de la Predice de la idea 2.',
        'La figura dibuja siete átomos de 63 u y tres de 65 u, cerca de la proporción real: es una ilustración, no una muestra contada. Abre la idea 1 sin dar su Predice (el magnesio, 24,3 u) ni la misión (la mezcla de cloro que da 35,45 u): la apertura no enseña la cuenta del promedio ponderado.',
        'La masa se dice «masa» y no «peso» en todo el texto; «se pesan» se usa solo para la balanza.',
      ],
    },
  };
})());
