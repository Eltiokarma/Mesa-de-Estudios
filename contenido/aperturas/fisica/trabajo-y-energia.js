/*
 * Apertura de «Trabajo y energía» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * El choque está en la Carretera Central: un camión baja de Ticlio a Lima casi sin acelerador, sin gastar combustible
 * en bajar, y aun así sus frenos se calientan tanto que hay que mojarlos. Lo que el alumno se lleva va en ficha.seLleva.
 * No adelanta la Predice de la idea 1 (la mochila llevada en horizontal: 0 J), la de la idea 2 (360 J), la de la idea 3
 * (baja 120 J con las dos referencias), la de la idea 4 (los dos toboganes dan la misma rapidez), la de la idea 5 (la
 * rampa de 53°) ni la de la idea 6 (625 W). Colores: la temperatura en verde (c-d), que la unidad no usa para ninguna
 * fuerza; las alturas van en tinta.
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  // Un camión chico de costado, con la cabina a la derecha, apoyado en (x, y) e inclinado `g` grados.
  const camion = (x, y, g, estilo) => `<g transform="translate(${x} ${y}) rotate(${g})" ${estilo}>
      <rect x="-34" y="-30" width="44" height="26" rx="2" stroke-width="2.5"/>
      <path d="M12 -4V-22h12l8 10v8Z" stroke-width="2.5" stroke-linejoin="round"/>
      <circle cx="-22" cy="-2" r="6" stroke-width="2.5"/><circle cx="22" cy="-2" r="6" stroke-width="2.5"/></g>`;
  // Termómetro: tubo con su bulbo; `nivel` de 0 a 1.
  const termometro = (x, nivel, texto) => {
    const arriba = 64, abajo = 148, alto = abajo - arriba, h = Math.round(alto * nivel);
    return `<rect x="${x - 8}" y="${arriba}" width="16" height="${alto + 6}" rx="8" style="fill:var(--card)" stroke="currentColor" stroke-width="2.5"/>
      <rect x="${x - 4}" y="${abajo - h}" width="8" height="${h + 6}" rx="4" style="fill:var(--c-d)"/>
      <circle cx="${x}" cy="${abajo + 14}" r="13" style="fill:var(--c-d)" stroke="currentColor" stroke-width="2.5"/>
      <text x="${x - 14}" y="${abajo + 50}" text-anchor="middle" font-size="17" font-weight="800" style="fill:var(--c-d)">frenos</text>
      <text x="${x - 14}" y="${abajo + 71}" text-anchor="middle" font-size="17" font-weight="800" style="fill:var(--c-d)">${texto}</text>`;
  };
  const vapor = (x, y) => [0, 11, 22].map(d => `<path d="M${x - 11 + d} ${y}q-6 -7 0 -14q6 -7 0 -14" fill="none" style="stroke:var(--muted)" stroke-width="2.5" stroke-linecap="round"/>`).join('');
  // La ladera baja de Ticlio (arriba a la izquierda) a Lima (abajo a la derecha), con 35° de pendiente dibujada.
  const panel = (x0, titulo, caliente, pie) => {
    const ladera = `<path d="M${x0 + 8} 100L${x0 + 190} 228H${x0 + 252}V250H${x0 + 8}Z" style="fill:var(--line)"/>
      <path d="M${x0 + 8} 100L${x0 + 190} 228H${x0 + 252}" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
    return `<text x="${x0 + 130}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      ${ladera}
      <text x="${x0 + 10}" y="72" font-size="18" font-weight="800" fill="currentColor">Ticlio, 4818 m</text>
      <text x="${x0 + 222}" y="272" text-anchor="middle" font-size="18" font-weight="800" fill="currentColor">Lima</text>
      ${camion(x0 + 58, 135, 35, 'style="fill:var(--card)" stroke="currentColor" stroke-dasharray="4 4"')}
      ${camion(x0 + 150, 200, 35, 'style="fill:var(--card)" stroke="currentColor"')}
      ${caliente ? vapor(x0 + 132, 176) : ''}
      ${termometro(x0 + 228, caliente ? 0.92 : 0.3, caliente ? 'calientes' : 'tibios')}
      ${pie.map((l, i) => `<text x="${x0 + 130}" y="${312 + i * 26}" text-anchor="middle" font-size="22" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 350" width="520" height="350" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="340" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', false, ['El roce entibia,', 'como en tus manos'])}
    ${panel(260, 'Lo que se mide', true, ['Los frenos humean', 'en la bajada'])}
  </svg>`;

  return {
    unidad: 'fisica.trabajo-y-energia',
    titulo: '¿De dónde sale el calor que hace humear los frenos de un camión que baja de la sierra?',
    parrafos: [
      'Por la Carretera Central, un camión baja de Ticlio, a 4818 m sobre el mar, hasta Lima, casi 4,7 km más abajo, y en casi toda la bajada el chofer no pisa el acelerador. ' +
        'Los frenos, en cambio, trabajan todo el camino y se calientan tanto que muchos camiones llevan un tanque de agua para mojarlos, y el agua que cae sobre ellos sale en vapor.',
      'Que los frenos se calienten no extraña, porque frenar es rozar y el roce calienta, como cuando te frotas las manos. ' +
        'Pero al frotarte las manos apenas se entibian, y eso que el esfuerzo lo pones tú, mientras que en la bajada nadie empuja al camión ni el motor lo jala. ' +
        'Con esa idea, los frenos tendrían que llegar a Lima tibios, como tus manos, y no tan calientes que el agua hierva al tocarlos.',
      'El camión trae algo desde arriba por estar a esa altura, y al bajar ese algo no se pierde: sin frenos se volvería rapidez, y los frenos lo vuelven calor para que el camión no se embale. ' +
        'Si todo lo que trae un camión cargado de 30 t fuera a parar a sus frenos, la cuenta dice que alcanzaría para hacer hervir el agua de casi cuatro tanques de techo. ' +
        'Ese algo es la energía, y esta unidad trata de ella y del trabajo, que es la manera en que una fuerza la pasa de un cuerpo a otro.',
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'El mismo camión que baja por la ladera desde Ticlio, a 4818 m, hasta Lima, con un termómetro de sus frenos. Lo que predice la idea de que el roce entibia, como al frotarse las manos: los frenos llegan tibios. Lo que se mide: los frenos llegan tan calientes que el agua que les cae sale en vapor.',
    },
    pregunta: 'Si el mismo camión bajara vacío, con menos de la mitad de su masa, ¿crees que sus frenos se calentarían más, igual o menos que cuando baja cargado?',
    ficha: {
      seLleva: 'La energía no desaparece, cambia de forma: la que tiene un camión por estar en la altura se vuelve calor en sus frenos mientras baja, y por eso humean en la bajada de la sierra.',
      alcance: 'Parcial (núcleo: conservación y transformación de la energía en un sistema, con un dato medido). El teorema del trabajo y la energía cinética en su forma algebraica no entra en PISA.',
      choque: 'El roce entibia, como las manos que se frotan, así que los frenos llegarían tibios; los de un camión que baja de Ticlio se calientan tanto que el agua que les echan sale en vapor, y nadie puso ese esfuerzo.',
      atajo: 'El roce calienta, como frotarse las manos: el texto lo da por bueno como mecanismo, pero no dice de dónde viene tanto calor, porque al frotarse las manos el esfuerzo lo pone uno y apenas las entibia, y en la bajada no lo pone nadie. No hay una explicación trampa que se pueda descartar con un dato sencillo.',
      porVerificar: [
        'Altitud de Ticlio (abra de Anticona): 4818 m; Lima, unos 150 m (de memoria): de ahí sale «casi 4,7 km más abajo».',
        'Que muchos camiones de la Carretera Central lleven un tanque de agua para enfriar los frenos y que el agua salga en vapor (de memoria; conviene una nota de prensa o del MTC).',
        'La cuenta del párrafo 3: 30 000 kg × 9,8 m/s² × 4670 m ≈ 1,4 GJ; calentar agua de 20 °C a 100 °C pide unos 335 kJ por kilo, así que alcanzaría para unos 4100 L, casi cuatro tanques de 1100 L. En la realidad, buena parte se va en el aire, la rodadura y el freno de motor, por eso el texto dice «si todo fuera a parar a sus frenos».',
        'Que el chofer casi no pise el acelerador al bajar (es lo esperado en una bajada larga, con freno de motor).',
      ],
      notas: [
        'La pregunta se puede intentar con el párrafo 3: vacío trae menos energía desde arriba, así que los frenos se calientan menos. Abre la idea de que la energía depende de la masa y de la altura (idea 3) sin dar la fórmula.',
        'Contenido, para Gerson: el camión es un vehículo, como la combi de la apertura de «Dinámica» (vecina en la rama); el tipo de hecho es distinto (allá se empuja y gana rapidez; aquí se frena y se calienta). Si se quiere evitar dos vehículos seguidos, el reemplazo sería otro choque de energía.',
        'El texto no compara caminos (toboganes o rampas) para no tocar las Predice de las ideas 4 y 5, ni habla de cargar algo en horizontal (idea 1).',
        'Revisión del Escribidor Escribano (27 nov): el párrafo 3 cerraba repitiendo la conservación como regla («Eso que cambia de forma sin desaparecer es la energía»), que la primera oración ya mostraba con el caso; ahora dice «Ese algo es la energía». La primera oración mezclaba «se convertiría» y «convierten» con un inciso entre el sujeto y el verbo («los frenos, para que la rapidez no crezca, lo convierten»); ahora va «sin frenos se volvería rapidez, y los frenos lo vuelven calor para que el camión no se embale». «En la cuenta, si todo…» pasó a «Si todo…, la cuenta dice que alcanzaría», que deja claro que es cálculo. «Lo que uno espera» pasó a «lo que esperarías». No delata: no compara caminos (ideas 4 y 5) ni da la fórmula de la energía potencial (idea 3).',
        'Doble revisión (27 nov): el párrafo 2 decía «lo que esperarías es que la bajada no le cueste nada a nadie y que los frenos lleguen fríos a Lima», y el panel «Lo que predice» ponía «frenos fríos». Era un muñeco de paja: cualquiera sabe que frenar calienta. Ahora la predicción es la que un alumno sí hace, que el roce calienta, y se lleva hasta donde da: como las manos que se frotan, los frenos llegarían tibios, y lo medido es que el agua que les cae sale en vapor, sin que nadie ponga el esfuerzo. El termómetro de «Lo que predice» pasó de «fríos» a «tibios», con el pie «El roce entibia, como en tus manos». «Unos cuatro tanques» pasó a «casi cuatro», porque la cuenta da 3,7. El título, el caso, el párrafo 3 y la pregunta no cambian.',
      ],
    },
  };
})());
