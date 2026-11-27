/*
 * Apertura de «Circunferencia y ángulos en ella» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * El choque sale de la playa: con los ojos a 1,6 m sobre el mar, el horizonte queda a unos 5 km, y un bote a 10 km no
 * se ve entero (se esconden unos 2 m de su parte baja), aunque la Tierra tenga 6371 km de radio. La salida es la recta
 * que toca la circunferencia en un solo punto, sin decir que es perpendicular al radio. Lo que el alumno se lleva va en
 * ficha.seLleva. No se adelanta ninguna Predice (el tanque echado, la bandeja, las linternas, los faroles de la pileta)
 * ni se escribe un número de sus respuestas o sus misiones (20, 24, 36, 40, 50, 60, 65, 75, 80, 110, 130, 150, 180).
 * Colores de la unidad (cabecera de contenido/teoria/geometria/circunferencia.js): la línea de la vista, que es lo que
 * se mira, en naranja (c-o); el mar en gris y la parte escondida del bote, punteada en carmín (c-h).
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const vista = t => ({ v: 'c-o', t });
  const r1 = n => Math.round(n * 10) / 10;

  // El bote: casco, cabina y mástil, con la base en (x, y). Alto total unos 58 unidades de dibujo; el casco, 18.
  const bote = (x, y, estilo) => `<g ${estilo}>
      <path d="M${x - 26} ${y - 18}H${x + 26}L${x + 18} ${y}H${x - 18}Z"/>
      <rect x="${x - 14}" y="${y - 34}" width="18" height="16"/>
      <line x1="${x + 10}" y1="${y - 18}" x2="${x + 10}" y2="${y - 58}" stroke-width="3"/>
    </g>`;
  const persona = (x, y) => `<g fill="currentColor"><circle cx="${x}" cy="${y - 44}" r="6"/>
      <path d="M${x - 6} ${y - 36}h12v20h-3v16h-6v-16h-3Z"/></g>`;
  const pies = (x0, pie) => pie.map((l, i) => `<text x="${x0 + 130}" y="${352 + i * 26}" text-anchor="middle" font-size="21" style="fill:var(--muted)">${l}</text>`).join('');
  const cota = (x1, x2, y, t) => `<path d="M${r1(x1)} ${y - 6}V${y + 6}M${r1(x1)} ${y}H${r1(x2)}M${r1(x2)} ${y - 6}V${y + 6}" fill="none" stroke="currentColor" stroke-width="2"/>
      <text x="${r1((x1 + x2) / 2)}" y="${y + 24}" text-anchor="middle" font-size="18" font-weight="800" fill="currentColor">${t}</text>`;

  // «Lo que predice»: mar plano, el bote entero.
  const plano = x0 => {
    const yM = 262, xp = x0 + 26, xb = x0 + 214;
    return `<text x="${x0 + 130}" y="32" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">Lo que predice</text>
      <rect x="${x0 + 8}" y="${yM}" width="244" height="40" style="fill:var(--muted)" fill-opacity=".22"/>
      <line x1="${x0 + 8}" y1="${yM}" x2="${x0 + 252}" y2="${yM}" style="stroke:var(--muted)" stroke-width="3"/>
      ${persona(xp, yM)}
      <line x1="${xp + 3}" y1="${yM - 42}" x2="${xb - 22}" y2="${yM - 12}" style="stroke:var(--c-o)" stroke-width="3" stroke-dasharray="7 5"/>
      ${bote(xb, yM, 'fill="currentColor" stroke="currentColor" stroke-linejoin="round"')}
      ${cota(xp, xb, yM + 16, '10 km')}
      ${pies(x0, ['A 10 km, el bote', 'se ve entero'])}`;
  };

  // «Lo que se mide»: el mar como un arco de circunferencia (curva exagerada). La vista sale del ojo y toca el arco en
  // un solo punto H; lo que queda más allá de H y debajo de esa recta no se ve.
  const curvo = x0 => {
    const R = 200, cx = x0 + 100, cy = 236 + R;              // el mar: circunferencia de centro (cx, cy)
    const sup = x => cy - Math.sqrt(R * R - (x - cx) * (x - cx));
    const xp = x0 + 20, yp = sup(xp), ojo = [xp + 3, yp - 42];
    // Punto de tangencia desde el ojo (el de la derecha).
    const dx = ojo[0] - cx, dy = ojo[1] - cy, d2 = dx * dx + dy * dy, a = R * R / d2, h = R * Math.sqrt(d2 - R * R) / d2;
    const H = [cx + a * dx - h * dy, cy + a * dy + h * dx];
    const xb = x0 + 214, yb = sup(xb);
    const pend = (H[1] - ojo[1]) / (H[0] - ojo[0]), lineaEn = x => ojo[1] + pend * (x - ojo[0]);
    // Lo que se ve del bote: lo que queda por encima de la recta de la vista.
    const ybx = lineaEn(xb + 40), yax = lineaEn(x0);
    const arco = `M${x0 + 6} ${r1(sup(x0 + 6))}A${R} ${R} 0 0 1 ${x0 + 254} ${r1(sup(x0 + 254))}`;
    return `<text x="${x0 + 130}" y="32" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">Lo que se mide</text>
      <clipPath id="ap-circ-ve"><path d="M${x0} 0H${x0 + 260}V${r1(ybx)}L${x0} ${r1(yax)}Z"/></clipPath>
      <path d="${arco}L${x0 + 254} 302H${x0 + 6}Z" style="fill:var(--muted)" fill-opacity=".22"/>
      ${bote(xb, yb, 'fill="none" style="stroke:var(--c-h)" stroke-width="2" stroke-dasharray="4 3"')}
      <path d="${arco}" fill="none" style="stroke:var(--muted)" stroke-width="3"/>
      <g clip-path="url(#ap-circ-ve)">${bote(xb, yb, 'fill="currentColor" stroke="currentColor" stroke-linejoin="round"')}</g>
      ${persona(xp, yp)}
      <line x1="${r1(ojo[0])}" y1="${r1(ojo[1])}" x2="${x0 + 252}" y2="${r1(lineaEn(x0 + 252))}" style="stroke:var(--c-o)" stroke-width="3" stroke-dasharray="7 5"/>
      <circle cx="${r1(H[0])}" cy="${r1(H[1])}" r="5" style="fill:var(--c-o)"/>
      <text x="${r1(H[0])}" y="${r1(H[1] - 14)}" text-anchor="middle" font-size="17" font-weight="800" style="fill:var(--c-o)">horizonte</text>
      ${cota(xp, H[0], 280, 'unos 5 km')}
      <text x="${x0 + 250}" y="62" text-anchor="end" font-size="15" style="fill:var(--muted)">(curva exagerada)</text>
      ${pies(x0, ['Se esconden unos', '2 m de abajo'])}`;
  };
  const svg = `<svg viewBox="0 0 520 396" width="520" height="396" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="386" style="stroke:var(--line)" stroke-width="2"/>
    ${plano(0)}${curvo(260)}
  </svg>`;

  return {
    unidad: 'geometria.circunferencia',
    titulo: '¿Por qué desde la playa no se ve entero un bote que está a 10 km?',
    parrafos: [
      ['En la orilla del mar, con los ojos a 1,6 m sobre el agua, el horizonte parece muy lejano, pero está a unos 5 km de ti. ',
        'Un bote pesquero que navega a 10 km, el doble de lejos, no se ve entero: asoman la cabina y el mástil, y unos 2 m de su parte baja quedan escondidos detrás del agua.'],
      ['La explicación más rápida es que el bote se ve chiquito porque está lejos, pero lo chiquito se arregla con unos binoculares, y el casco sigue sin aparecer. ',
        'La segunda, que la Tierra es redonda, es la buena, aunque parece quedarse corta: con 6371 km de radio, la Tierra es tan grande que su curva no debería notarse en solo 10 km de mar.'],
      ['Sí se nota, porque la ', vista('línea que va de tus ojos al horizonte'), ' no atraviesa el mar: lo toca en un solo punto, y todo lo que queda detrás de ese punto, por debajo de esa línea, se esconde. ',
        'Las rectas que tocan una circunferencia en un solo punto, las que la cortan y los ángulos que se forman con ellas son el tema de esta unidad: la circunferencia.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos dibujos de una persona en la orilla que mira un bote a 10 km. Lo que predice: con el mar plano, el bote se ve entero. Lo que se mide: el mar es parte de una circunferencia (la curva está exagerada), la línea de la vista toca el mar en el horizonte, a unos 5 km, y la parte baja del bote, unos 2 m, queda escondida.',
    },
    pregunta: 'Si subes a lo alto de un acantilado de 30 m y miras el mismo bote, ¿crees que verás más o menos de su casco que desde la orilla?',
    ficha: {
      seLleva: 'Desde la orilla del mar, el horizonte está a solo unos 5 km, porque la línea que va de tus ojos al horizonte apenas toca la Tierra, y lo que queda detrás se esconde.',
      alcance: 'Parcial, por deducción propia (espacio y forma: un modelo geométrico, la Tierra como circunferencia, explica lo que se ve).',
      choque: 'La Tierra es tan grande que su curva no debería notarse en 10 km, y desde la orilla se esconden unos 2 m de la parte baja de un bote a esa distancia.',
      atajo: 'Que el bote se ve chiquito por la distancia, que los binoculares descartan; y «la Tierra es redonda», que es la causa, pero parece no alcanzar por lo grande que es la Tierra. Lo que la resuelve es la recta que toca la circunferencia en un solo punto (la tangente), que es el tema; no se dice que es perpendicular al radio.',
      porVerificar: [
        'Horizonte a unos 5 km con los ojos a 1,6 m: la geometría sola da 4,5 km (raíz de 2 × 6371 km × 1,6 m) y la refracción del aire lo alarga a unos 4,8 km. Cálculo propio, no una medición.',
        'Unos 2 m escondidos de un bote a 10 km: 2,4 m con la geometría sola y unos 1,8 m con la refracción normal; cambia con la temperatura del aire sobre el mar. Cálculo propio.',
        'Radio medio de la Tierra: 6371 km (de memoria).',
        'Desde un acantilado de 30 m, el horizonte se va a unos 20 km y el bote se vería entero: es la respuesta de la pregunta, no se escribe en la apertura.',
      ],
      notas: [
        'Tercera pasada (27 nov): sin ecuaciones en la oración ni palabras de doble sentido (5 km, 10 km, 1,6 m y 6371 km son datos).',
        'La figura exagera la curva del mar para que se vea la recta que la toca; el texto alternativo y un rótulo lo dicen. No hay radios dibujados ni ángulos, para no adelantar la idea 1 (radio, cuerda y tangente).',
        'El párrafo 3 dice que la línea de la vista toca el mar en un solo punto: es la salida al choque y nombra la tangente sin la palabra ni la regla del ángulo recto.',
        'Revisión del Escribidor Escribano (27 nov): sin cambios en el texto. Recalculado: con los ojos a 1,6 m y R = 6371 km, el horizonte geométrico queda a 4,5 km (unos 4,9 km con la refracción normal, k ≈ 0,13), y a 10 km se esconden 2,4 m del bote sin refracción y unos 1,8 m con ella; «unos 5 km» y «unos 2 m» se sostienen. El párrafo 3 explica la salida (la línea de la vista toca el mar en un punto) y roza el «la entrada no explica»: se deja porque no da la regla del radio ni ningún número.',
      ],
    },
  };
})());
