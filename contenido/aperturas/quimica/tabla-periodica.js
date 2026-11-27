/*
 * Apertura de «Tabla periódica» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * El choque está en la casa: el cloro de la lejía y el yodo del botiquín desinfectan y forman sales parecidas, aunque
 * tienen 17 y 53 protones; sus vecinos de número, el argón y el azufre, no se les parecen. Lo que el alumno se lleva
 * (ficha.seLleva): el parecido entre elementos no está en el vecino de al lado, reaparece más adelante, y la tabla se
 * arma para juntarlo. Se eligió el cloro y el yodo, y no el sodio y el potasio, para no darle al alumno el corte de la
 * tira de la misión de la idea 1 (litio, sodio y potasio en columna) ni la Predice del rubidio. No se dicen periodos,
 * grupos ni electrones de valencia (idea 2). Color: el par de parientes en rosa (c-h).
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  // Las casillas en una sola fila, por número: 16, 17, 18, un salto y 53. No se dibuja la tabla con columnas, para no
  // responder la pregunta del final (¿fila o columna?).
  const L = 50, Y = 168;
  const casilla = (x, z, s, marcada) => `<g>
      <rect x="${x}" y="${Y}" width="${L}" height="${L + 6}" rx="7" ${marcada ? 'style="fill:var(--c-h)" fill-opacity=".16"' : 'style="fill:var(--card)"'}/>
      <rect x="${x}" y="${Y}" width="${L}" height="${L + 6}" rx="7" fill="none" ${marcada ? 'style="stroke:var(--c-h)" stroke-width="3.5"' : 'stroke="currentColor" stroke-width="2.5"'}/>
      <text x="${x + 6}" y="${Y + 16}" font-size="13" font-weight="700" fill="currentColor">${z}</text>
      <text x="${x + L / 2}" y="${Y + 44}" text-anchor="middle" font-size="22" font-weight="800" ${marcada ? 'style="fill:var(--c-h)"' : 'fill="currentColor"'}>${s}</text></g>`;
  const panel = (x0, titulo, mide, pie) => {
    const xs = [x0 + 8, x0 + 8 + (L + 4), x0 + 8 + 2 * (L + 4)], xI = x0 + 244 - L, cx = x => x + L / 2;
    const arco = (xa, xb, alto) => `<path d="M${cx(xa) + 4} ${Y - 8}Q${(cx(xa) + cx(xb)) / 2} ${Y - 8 - alto} ${cx(xb) - 4} ${Y - 8}" fill="none" style="stroke:var(--c-h)" stroke-width="4" stroke-linecap="round"/>`;
    const enlace = mide
      ? `${arco(xs[1], xI, 100)}<text x="${(cx(xs[1]) + cx(xI)) / 2}" y="${Y - 66}" text-anchor="middle" font-size="18" font-weight="700" style="fill:var(--c-h)">parientes</text>`
      : `${arco(xs[1], xs[2], 44)}<text x="${(cx(xs[1]) + cx(xs[2])) / 2}" y="${Y - 42}" text-anchor="middle" font-size="18" font-weight="700" style="fill:var(--c-h)">parientes</text>`;
    return `<text x="${x0 + 130}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      ${casilla(xs[0], 16, 'S', false)}
      ${casilla(xs[1], 17, 'Cl', true)}
      ${casilla(xs[2], 18, 'Ar', !mide)}
      <text x="${(xs[2] + L + xI) / 2}" y="${Y + 36}" text-anchor="middle" font-size="22" font-weight="800" fill="currentColor" opacity=".55">…</text>
      ${casilla(xI, 53, 'I', mide)}
      <text x="${cx(xs[1])}" y="${Y + L + 32}" text-anchor="middle" font-size="16" style="fill:var(--muted)">lejía</text>
      <text x="${cx(xI)}" y="${Y + L + 32}" text-anchor="middle" font-size="16" style="fill:var(--muted)">botiquín</text>
      ${enlace}
      ${pie.map((l, i) => `<text x="${x0 + 130}" y="${336 + i * 26}" text-anchor="middle" font-size="22" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 384" width="520" height="384" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="374" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', false, ['El pariente del cloro', 'sería su vecino'])}
    ${panel(260, 'Lo que se mide', true, ['Un pariente del cloro', 'es el yodo, el 53'])}
  </svg>`;

  return {
    unidad: 'quimica.tabla-periodica',
    titulo: '¿Por qué el cloro de la lejía se parece al yodo del botiquín y no a sus vecinos?',
    parrafos: [
      ['En la casa se desinfecta el baño con lejía, que actúa gracias a un compuesto de cloro, y en el botiquín se guarda yodo para limpiar una herida. ',
        'Los dos elementos matan microbios de una manera parecida y forman con el sodio sales que se parecen, aunque el cloro tiene 17 protones y el yodo, 53.'],
      ['Si los elementos se parecieran más cuanto más cerca están sus números, el pariente más cercano del cloro sería el argón, que tiene 18 protones, o el azufre, que tiene 16. ',
        'Pero el argón es un gas que casi no reacciona con nada, tanto que se usa para proteger el metal al soldar, y el azufre es un polvo amarillo que nadie usa para desinfectar el agua ni el baño. ',
        'Tampoco basta con decir que el cloro y el yodo se parecen porque son no metales, ya que el argón y el azufre también lo son.'],
      ['El yodo, que se parece al cloro, no está a su lado: aparece 36 lugares más adelante, y casi todos los elementos de ese tramo no se parecen a ninguno de los dos. ',
        'La tabla periódica de la pared del salón está armada para que esos parientes queden a la vista, y de cómo lo logra trata esta unidad.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Las casillas del azufre (16), el cloro (17) y el argón (18) en fila y, después de un salto, la del yodo (53). Lo que predice la idea de que los parecidos van por número: el pariente del cloro es su vecino, el argón. Lo que se mide: un pariente del cloro es el yodo, 36 lugares más adelante.',
    },
    pregunta: 'Entre el cloro, que tiene 17 protones, y el yodo, que tiene 53, ¿crees que hay otro elemento que se parezca a los dos, y cuántos protones tendría?',
    ficha: {
      seLleva: 'Los elementos que se parecen no son vecinos de número: el parecido reaparece más adelante, y la tabla periódica está armada para juntar a esos parientes.',
      alcance: 'Parcial (núcleo: buscar regularidades en datos y usarlas para predecir; la configuración electrónica que explica la periodicidad no entra en PISA). Deducción propia.',
      choque: 'Si el parecido fuera por cercanía de número, el pariente del cloro (17) sería el argón (18) o el azufre (16); el que se le parece es el yodo (53).',
      atajo: 'El atajo «se parecen porque los dos son no metales» se descarta porque el argón y el azufre también son no metales y no se les parecen.',
      porVerificar: [
        'Que la lejía desinfecte gracias a un compuesto de cloro (hipoclorito de sodio, NaClO) y que el yodo del botiquín sea tintura de yodo o povidona yodada (uso común en el Perú; la marca no se nombra).',
        'Que el cloro y el yodo maten microbios «de una manera parecida» (los dos son oxidantes; es una simplificación aceptable).',
        'Que el azufre no se use para desinfectar agua ni superficies de la casa (de memoria; sí se usa en pomadas para la piel, y por eso se quitó «no sirve para limpiar una herida»).',
        'Que el argón se use como gas de protección al soldar (soldadura TIG y MIG; de memoria, uso común).',
        'Números atómicos: azufre 16, cloro 17, argón 18 y yodo 53.',
      ],
      notas: [
        'Tercera pasada (27 nov): sin ecuaciones en la oración ni palabras de doble sentido; «tabla» es siempre la tabla periódica y «compuesto» se usa una sola vez.',
        'Doble revisión (27 nov): corrección de un dato. El párrafo 3 decía «El pariente del cloro no está al lado: aparece 36 lugares más adelante, después de un tramo de elementos que no se le parecen», y eso es falso: en ese tramo está el bromo (35), que sí se le parece, y es justo la respuesta de la pregunta guía, así que el texto y la pregunta se contradecían. Ahora dice que el yodo aparece 36 lugares más adelante y que casi todos los elementos del tramo no se parecen a ninguno de los dos; la figura dice «un pariente», no «el pariente». La comparación es justa (mismo cloro, mismo criterio de parecido) y la predicción «los parecidos son vecinos de número» es la que haría quien ordena por número sin conocer las familias; se mantiene.',
        'Revisión (Escribidor Escribano, 27 nov): la pregunta «¿fila o columna?» se cambió porque sí delataba la Predice de la idea 1, que da al rubidio «en su misma columna» bajo el potasio y pregunta cómo es: quien respondió «columna» en la apertura ya tiene la respuesta. La nueva pregunta se puede intentar con lo leído (lo natural es buscar a mitad de camino) y su respuesta es el bromo, con 35 protones, que tampoco da el largo de corte que pide la misión. También se ató el párrafo 3 al caso (36 lugares) para que no enuncie la ley periódica.',
        'No se usa el sodio y el potasio, el ejemplo más obvio, porque la misión de la idea 1 pide cortar la tira para que el litio, el sodio y el potasio queden en columna, y su Predice pregunta por el rubidio, bajo el potasio. Con el cloro y el yodo la apertura deja la idea (los parientes reaparecen más adelante) sin dar el largo del corte.',
        'La pregunta abre la idea 1 («¿Por qué la tabla periódica tiene filas y columnas justo de ese largo?»). La pregunta de «¿fila o columna?» que había antes se cambió en la revisión (ver la nota anterior).',
        'El yodo aparece también en la Predice de la idea 2 (la sal yodada, su periodo y sus electrones de valencia); la apertura no dice ninguna de las dos cosas.',
      ],
    },
  };
})());
