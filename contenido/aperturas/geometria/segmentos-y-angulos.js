/*
 * Apertura de «Segmentos y ángulos» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * El choque es de la vista contra la regla: en una pared de mayólicas negras y blancas con las hileras corridas, las
 * rayas de cemento se ven inclinadas y son paralelas (la ilusión de la «pared del café»). Lo que el alumno se lleva va
 * en ficha.seLleva: para saber si dos rectas son paralelas, o cuánto se abre un ángulo, se mide; el ojo no basta.
 * No adelanta la Predice de la idea 1 (el rodeo de la combi), la de la idea 3 (los dos relojes: la abertura y no el
 * largo de los lados) ni la de la idea 5 (el riel que se abre 8°), y no escribe ningún valor de las misiones (10, 60,
 * 90, 120, 180). Colores de la unidad (cabecera de contenido/teoria/geometria/segmentos-y-angulos.js): el tramo que se
 * mide va en naranja (c-o), como el primer tramo de la unidad; las mayólicas, en tinta y en el color de la tarjeta.
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const tramo = t => ({ v: 'c-o', t });
  const r1 = n => Math.round(n * 10) / 10;

  // La misma pared en los dos paneles: 7 hileras de mayólicas cuadradas (lado L) con una raya de cemento de G entre
  // hileras. Cada hilera se corre un poco respecto de la de abajo (CORRE), que es lo que hace ver inclinadas las rayas.
  const L = 26, G = 2.5, FILAS = 8, ARRIBA = 52, X0 = 16, ANCHO = 228;
  const CORRE = [0, 8, 16, 24, 16, 8, 0, 8];
  const pared = (x0, id) => {
    let m = '';
    for (let f = 0; f < FILAS; f++) {
      const y = ARRIBA + f * (L + G);
      for (let k = -2; k * L < ANCHO + 2 * L; k++) {
        const x = x0 + X0 + k * L + CORRE[f];
        m += `<rect x="${r1(x)}" y="${r1(y)}" width="${L}" height="${L}" style="fill:${(k & 1) ? 'var(--card)' : 'currentColor'}"/>`;
      }
    }
    const alto = FILAS * (L + G) - G;
    return `<clipPath id="${id}"><rect x="${x0 + X0}" y="${ARRIBA}" width="${ANCHO}" height="${alto}"/></clipPath>
      <rect x="${x0 + X0}" y="${ARRIBA}" width="${ANCHO}" height="${alto}" style="fill:var(--muted)"/>
      <g clip-path="url(#${id})">${m}</g>
      <rect x="${x0 + X0}" y="${ARRIBA}" width="${ANCHO}" height="${alto}" fill="none" style="stroke:var(--muted)" stroke-width="2"/>`;
  };
  // Raya de cemento entre la hilera f − 1 y la f (su centro).
  const raya = f => ARRIBA + f * (L + G) - G / 2;
  // Cota vertical entre dos rayas, con su rótulo al lado: lo que mide la regla en cada extremo.
  const cota = (x, y1, y2, lado) => {
    const t = lado < 0 ? 'end' : 'start';
    return `<line x1="${x}" y1="${r1(y1 + 3)}" x2="${x}" y2="${r1(y2 - 3)}" style="stroke:var(--c-o)" stroke-width="4" stroke-linecap="round"/>
      <path d="M${x - 6} ${r1(y1 + 9)}L${x} ${r1(y1)}L${x + 6} ${r1(y1 + 9)}M${x - 6} ${r1(y2 - 9)}L${x} ${r1(y2)}L${x + 6} ${r1(y2 - 9)}" fill="none" style="stroke:var(--c-o)" stroke-width="3" stroke-linejoin="round"/>`;
  };
  const panel = (x0, titulo, mide, pie) => {
    const cx = x0 + 130, ya = raya(3), yb = raya(4);
    const medida = mide ? `
      <line x1="${x0 + X0}" y1="${r1(ya)}" x2="${x0 + X0 + ANCHO}" y2="${r1(ya)}" style="stroke:var(--c-o)" stroke-width="3"/>
      <line x1="${x0 + X0}" y1="${r1(yb)}" x2="${x0 + X0 + ANCHO}" y2="${r1(yb)}" style="stroke:var(--c-o)" stroke-width="3"/>
      <rect x="${x0 + X0 + 4}" y="${r1(ya + 2)}" width="18" height="${r1(yb - ya - 4)}" style="fill:var(--card)"/>
      <rect x="${x0 + X0 + ANCHO - 22}" y="${r1(ya + 2)}" width="18" height="${r1(yb - ya - 4)}" style="fill:var(--card)"/>
      ${cota(x0 + X0 + 13, ya, yb)}${cota(x0 + X0 + ANCHO - 13, ya, yb)}` : '';
    return `<text x="${cx}" y="32" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      ${pared(x0, `ap-seg-${x0}`)}${medida}
      ${pie.map((l, i) => `<text x="${cx}" y="${306 + i * 26}" text-anchor="middle" font-size="21" style="fill:${i === 0 && mide ? 'var(--c-o)' : 'var(--muted)'}"${i === 0 && mide ? ' font-weight="800"' : ''}>${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 352" width="520" height="352" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="342" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', false, ['Las rayas se ven', 'inclinadas'])}
    ${panel(260, 'Lo que se mide', true, ['20 cm y 20 cm:', 'son paralelas'])}
  </svg>`;

  return {
    unidad: 'geometria.segmentos-y-angulos',
    titulo: '¿Por qué una pared de mayólicas bien puesta se ve torcida?',
    parrafos: [
      ['Imagina una pared con mayólicas negras y blancas en hileras, en la que cada hilera está corrida un poco respecto de la de abajo, como en la figura. ',
        'Las rayas de cemento que separan las hileras se ven inclinadas, unas abiertas hacia un lado y otras hacia el otro, como si fueran cuñas. ',
        'Con una regla se mide otra cosa: entre dos rayas vecinas hay ', tramo('20 cm'), ' en un extremo de la pared y ', tramo('20 cm'),
        ' en el otro, el alto de una mayólica.'],
      ['Lo que ves te dice que las rayas no son paralelas, como si las hileras se hubieran puesto chuecas. ',
        'Pero la regla marca la misma distancia en toda la pared, y si tapas las mayólicas de arriba y de abajo con dos hojas de papel, la raya que queda a la vista se ve derecha.'],
      ['La pared está derecha y es el ojo el que la ve torcida: la explicación más aceptada es que ve cada raya junto con las mayólicas de al lado, y el contraste entre negras y blancas la desvía. ',
        'Por eso, en geometría, que dos rectas se vean paralelas o que un ángulo se vea grande no prueba nada, y los problemas de examen avisan que el dibujo no está a escala. ',
        'Medir tramos de recta y ángulos, y razonar con esas medidas, es el tema de esta primera unidad: segmentos y ángulos.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos dibujos de la misma pared de mayólicas negras y blancas, con cada hilera corrida respecto de la de abajo. Lo que predice la vista: las rayas de cemento se ven inclinadas, como cuñas. Lo que se mide: entre dos rayas vecinas hay 20 cm en los dos extremos, así que son paralelas.',
    },
    pregunta: 'Si no tuvieras una regla, ¿qué podrías comprobar en la pared con un hilo tenso o con una escuadra para saber que dos rayas de cemento son paralelas?',
    ficha: {
      seLleva: 'A simple vista, dos rectas paralelas pueden parecer inclinadas, así que para saber si lo son, o cuánto se abre un ángulo, hay que medir y no confiar en el ojo.',
      alcance: 'Parcial, por deducción propia (espacio y forma: interpretar una figura y comprobar con medidas).',
      choque: 'Las rayas de cemento se ven inclinadas, como cuñas, y la regla marca 20 cm entre dos rayas vecinas en los dos extremos de la pared.',
      atajo: 'Que las hileras se pusieron chuecas, que la regla descarta porque la distancia es la misma en toda la pared; tapar las mayólicas vecinas deja ver la raya derecha. No hay un atajo de cálculo: el choque es entre la vista y la medida.',
      porVerificar: [
        'Es la ilusión de la «pared del café». Verificado en la web (27 nov): Richard L. Gregory y Priscilla Heard, «Border locking and the Café Wall illusion», Perception 8 (1979), pp. 365-380; la vio Steve Simpson, de su laboratorio, en un café al pie de St Michael\'s Hill, en Bristol. Una versión anterior la describió Hugo Münsterberg en 1894. La explicación de Gregory y Heard (el «border locking») no está cerrada: por eso el párrafo 3 dice «la explicación más aceptada». La ilusión solo aparece si el cemento tiene un gris entre el de las dos mayólicas, como en la figura.',
        'Que tapar las hileras vecinas haga ver derecha la raya: la ilusión depende del contraste de las mayólicas a los dos lados de la raya y del gris del cemento; por comprobar con la figura en papel.',
        'Mayólicas de 20 cm por 20 cm: medida común en las tiendas del Perú (de memoria). La pared es imaginada («Imagina una pared…»), no una foto de una pared real.',
      ],
      notas: [
        'Tercera pasada (27 nov): sin ecuaciones en la oración ni palabras de doble sentido (los 20 cm son un dato).',
        'La figura es la misma pared en los dos paneles; en «Lo que se mide» se agregan las dos rayas marcadas en naranja y las cotas de 20 cm en cada extremo. Al marcar las rayas, la ilusión se debilita en ese panel, que es lo que se quiere mostrar.',
        'La ilusión necesita que el cemento sea de un gris intermedio entre las dos mayólicas: se usa var(--muted) con tinta y el color de la tarjeta, que funciona en el tema claro y en el oscuro. Revisar que se vea a 390 px (la captura de la ficha).',
        'La pregunta se puede intentar sin teoría (medir la distancia en varios sitios, o cruzar las dos rayas con un hilo y comparar las esquinas que se forman) y lleva a la idea 5, sin dar su Predice.',
        'Revisión del Escribidor Escribano (27 nov, otro agente): el párrafo 3 daba como hecho la causa de la ilusión («el ojo… lo engaña»), que los especialistas aún discuten; ahora dice «la explicación más aceptada». Su segunda oración enunciaba una regla de método («la geometría no se fía de la vista»); ahora deja el choque del caso: verse paralelas o verse grande no prueba nada.',
        'Doble revisión (27 nov): el párrafo 2 decía que «lo primero que se le ocurre a cualquiera es culpar al albañil». Ponía a una persona como la causa de algo que no hizo, y Gerson pidió que ningún ejemplo culpe a nadie; ahora dice «como si las hileras se hubieran puesto chuecas». El párrafo 3 abre diciendo en corto que la pared está derecha y el ojo la ve torcida, antes de la explicación. El choque se queda: la ilusión es real y fuerte, no un muñeco de paja, y la regla mide el mismo caso con las mismas rayas.',
      ],
    },
  };
})());
