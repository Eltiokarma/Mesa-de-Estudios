/*
 * Apertura de «Polígonos y cuadriláteros» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * Parte de un costurero (o una caja de herramientas) de bandejas: los brazos giran 50° al abrirlo y la bandeja no se
 * inclina, como espera cualquiera; la apertura muestra dónde se usa ese arreglo, sin choque forzado (doble revisión). Lo que el alumno se lleva va en ficha.seLleva: una figura de cuatro lados puede cambiar de forma
 * y conservar algo. Se cuida no adelantar la Predice de la idea 4 (en el marco inclinado, las diagonales se cortan en
 * su punto medio: aquí no se habla de diagonales) ni la de la idea 5 (las diagonales del rombo, en ángulo recto), y no
 * se escribe ningún número de las respuestas o las misiones (35, 45, 70, 90, 180, 540, 4,5). Colores de la unidad
 * (cabecera de contenido/teoria/geometria/poligonos-y-cuadrilateros.js): un par de lados de enfrente en naranja (c-o,
 * los dos brazos) y el otro en turquesa (c-i, la bandeja y la caja entre los dos tornillos); el ángulo dado, en carmín
 * (c-h).
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const brazo = t => ({ v: 'c-o', t }), ang = t => ({ v: 'c-h', t });
  const r1 = n => Math.round(n * 10) / 10;

  // La misma caja en los dos paneles: dos brazos iguales (LARGO) con un tornillo en la caja (B1, B2) y otro en la
  // bandeja (T1, T2), girados 50° desde la horizontal; T1T2 queda paralela a B1B2 y la bandeja sigue horizontal en los
  // dos paneles. «Lo que predice» es la intuición, que acierta: la bandeja sube derecha. «Lo que se mide» la carga de un
  // solo lado y marca 0°, para descartar que la enderece su peso (doble revisión, 27 nov).
  const G = 50 * Math.PI / 180, LARGO = 100, SEP = 50, Y_B = 268;
  const tornillo = (x, y) => `<circle cx="${r1(x)}" cy="${r1(y)}" r="5" style="fill:var(--card)" stroke="currentColor" stroke-width="2.5"/>`;
  const panel = (x0, titulo, predice, pie) => {
    const cx = x0 + 130, b1 = [x0 + 58, Y_B], b2 = [x0 + 58 + SEP, Y_B];
    const t1 = [b1[0] + LARGO * Math.cos(G), b1[1] - LARGO * Math.sin(G)];
    const giro = 0;                                  // la bandeja no se inclina
    const t2 = [t1[0] + SEP * Math.cos(giro), t1[1] - SEP * Math.sin(giro)];
    // La bandeja, dibujada horizontal y girada alrededor de T1.
    const rotar = `rotate(${r1(-giro * 180 / Math.PI)} ${r1(t1[0])} ${r1(t1[1])})`;
    const boton = (x, y) => `<circle cx="${r1(x)}" cy="${r1(y)}" r="6" style="fill:var(--muted)"/>`;
    // Botones repartidos en «Lo que predice»; en «Lo que se mide», amontonados en una punta de la bandeja.
    const botones = predice
      ? boton(t1[0] + 4, t1[1] - 8) + boton(t1[0] + 20, t1[1] - 8) + boton(t1[0] + 36, t1[1] - 8)
      : boton(t1[0] - 8, t1[1] - 8) + boton(t1[0] + 5, t1[1] - 8) + boton(t1[0] - 2, t1[1] - 19) + boton(t1[0] - 8, t1[1] - 30);
    const bandeja = `<g transform="${rotar}">
        <path d="M${r1(t1[0] - 16)} ${r1(t1[1] - 22)}V${r1(t1[1])}H${r1(t1[0] + SEP + 16)}V${r1(t1[1] - 22)}" style="fill:var(--card)" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
        ${botones}
        <line x1="${r1(t1[0])}" y1="${r1(t1[1])}" x2="${r1(t1[0] + SEP)}" y2="${r1(t1[1])}" style="stroke:var(--c-i)" stroke-width="5"/>
      </g>`;
    // Arco del giro de la bandeja, con la horizontal punteada de referencia.
    const ref = `<line x1="${r1(t1[0])}" y1="${r1(t1[1])}" x2="${r1(t1[0] + 86)}" y2="${r1(t1[1])}" style="stroke:var(--muted)" stroke-width="2" stroke-dasharray="5 5"/>`;
    const rArm = 30, arcoBrazo = `<line x1="${b1[0]}" y1="${Y_B}" x2="${b1[0] + 44}" y2="${Y_B}" style="stroke:var(--muted)" stroke-width="2" stroke-dasharray="5 5"/>
      <path d="M${r1(b1[0] + rArm)} ${Y_B}A${rArm} ${rArm} 0 0 0 ${r1(b1[0] + rArm * Math.cos(G))} ${r1(Y_B - rArm * Math.sin(G))}" fill="none" style="stroke:var(--c-h)" stroke-width="3"/>`;
    return `<text x="${cx}" y="32" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      <path d="M${x0 + 26} ${Y_B - 14}V${Y_B + 48}H${x0 + 146}V${Y_B - 14}" style="fill:var(--card)" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
      <line x1="${b1[0]}" y1="${Y_B}" x2="${b2[0]}" y2="${Y_B}" style="stroke:var(--c-i)" stroke-width="5"/>
      ${ref}${arcoBrazo}
      <line x1="${b1[0]}" y1="${Y_B}" x2="${r1(t1[0])}" y2="${r1(t1[1])}" style="stroke:var(--c-o)" stroke-width="6" stroke-linecap="round"/>
      <line x1="${b2[0]}" y1="${Y_B}" x2="${r1(t2[0])}" y2="${r1(t2[1])}" style="stroke:var(--c-o)" stroke-width="6" stroke-linecap="round"/>
      ${bandeja}
      ${tornillo(b1[0], Y_B)}${tornillo(b2[0], Y_B)}${tornillo(t1[0], t1[1])}${tornillo(t2[0], t2[1])}
      <text x="${x0 + 152}" y="${Y_B + 14}" font-size="18" font-weight="800" style="fill:var(--c-o)">brazos:</text>
      <text x="${x0 + 152}" y="${Y_B + 36}" font-size="18" font-weight="800" style="fill:var(--c-o)">50°</text>
      ${predice ? '' : `<text x="${r1(t1[0] + SEP / 2 + 6)}" y="${r1(t1[1] - 46)}" text-anchor="middle" font-size="19" font-weight="800" style="fill:var(--c-h)">bandeja: 0°</text>`}
      ${pie.map((l, i) => `<text x="${cx}" y="${358 + i * 26}" text-anchor="middle" font-size="21" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 400" width="520" height="400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="390" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', true, ['La bandeja sube', 'sin inclinarse'])}
    ${panel(260, 'Lo que se mide', false, ['Cargada de un lado,', 'sigue a 0°'])}
  </svg>`;

  return {
    unidad: 'geometria.poligonos-y-cuadrilateros',
    titulo: '¿Cómo sube la bandeja de un costurero sin que se caigan los botones?',
    parrafos: [
      ['Hay costureros y cajas de herramientas con bandejas que se abren hacia un costado: cada bandeja va unida a la caja por dos ',
        brazo('brazos'), ' iguales, con un tornillo en cada punta. ',
        'Al abrir la caja, los brazos giran unos ', ang('50°'), ', y la bandeja sube y se corre hacia afuera sin inclinarse, con los botones y los carretes en su sitio.'],
      ['Eso es lo que cualquiera espera de una caja bien hecha, y no es por el peso de la bandeja, como en una lámpara que cuelga del techo: cargada de un solo lado, sigue sin inclinarse. ',
        'La mantienen derecha los dos brazos, y el mismo arreglo de cuatro tornillos mueve el limpiaparabrisas de muchos buses, que barre el vidrio con la escobilla siempre parada.'],
      ['Los dos brazos, la bandeja y la caja forman una figura de cuatro lados que cambia de forma cada vez que abres el costurero, y aun así la bandeja queda tan horizontal como el fondo de la caja. ',
        'Qué cambia y qué se conserva en las figuras de muchos lados, sobre todo en las de cuatro, es el tema de esta unidad: polígonos y cuadriláteros.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos dibujos del mismo costurero visto de lado, con la bandeja unida a la caja por dos brazos iguales que giraron 50°. Lo que predice: la bandeja sube sin inclinarse. Lo que se mide: con los botones amontonados en una punta, la bandeja sigue horizontal, inclinada 0°.',
    },
    pregunta: '¿Qué crees que tienen que cumplir los dos brazos y los cuatro tornillos para que la bandeja salga siempre horizontal?',
    ficha: {
      seLleva: 'Una figura de cuatro lados puede cambiar de forma y conservar algo, y eso se aprovecha: los brazos del costurero giran y la bandeja sale siempre horizontal, como la escobilla de un limpiaparabrisas de bus sale siempre parada.',
      alcance: 'Parcial, por deducción propia (espacio y forma: qué cambia y qué se conserva cuando una figura se mueve).',
      choque: 'No hay choque forzado (regla 7 de la segunda revisión): la intuición acierta, la bandeja sube derecha. Lo que la apertura muestra es para qué sirve y que no es cosa del peso: cargada de un lado sigue a 0°, mientras los brazos giran 50°.',
      atajo: 'Que la bandeja cuelga y su peso la endereza, como una lámpara: se descarta porque cargada de un solo lado sigue horizontal. La razón (los cuatro tornillos forman un paralelogramo, con los lados de enfrente paralelos) no se da: la pide la pregunta.',
      porVerificar: [
        'Que los costureros y las cajas de herramientas de bandejas que se abren hacia el costado («tipo acordeón») se vendan en el Perú, y que sus dos brazos sean iguales (si no lo son, la bandeja sí se inclina).',
        'Los 50° de giro de los brazos son un valor de ejemplo, no una medición de un costurero real.',
        'Que los limpiaparabrisas de pantógrafo (dos brazos paralelos que mantienen la escobilla vertical) sean comunes en los buses y camiones del Perú: de memoria; el mecanismo es el mismo paralelogramo articulado.',
        'Que la bandeja no se incline cargada de un solo lado supone tornillos sin juego; en una caja vieja y floja puede inclinarse un poco.',
      ],
      notas: [
        'Tercera pasada (27 nov): sin ecuaciones en la oración ni palabras de doble sentido (los 50° son un dato; «peso» aparece una sola vez).',
        'Duda del escritor, decidida en la revisión (27 nov): el párrafo 3 decía que «algo de esa figura no cambia nunca», una afirmación general que el alumno podía llevar a la Predice de la idea 4 para descartar «Nada fijo: depende de cuánto se incline». Ahora repite solo el hecho del párrafo 1 (la bandeja queda tan horizontal como la caja) y no dice nada general de la figura ni de sus diagonales. La pregunta pide la condición (brazos iguales y tornillos a la misma distancia en la caja y en la bandeja) sin darla.',
        'Doble revisión (27 nov): la versión anterior ponía como predicción que la bandeja giraría con los brazos y los botones se caerían. Nadie que haya abierto un costurero espera eso (Gerson lo señaló): es un muñeco de paja. Como la idea es intuitiva y útil, ahora «Lo que predice» es la intuición correcta (la bandeja sube derecha) y el texto muestra dónde se usa el mismo arreglo (el limpiaparabrisas de bus) y descarta la explicación del peso, que sí es una idea que un alumno trae. El título dejó de preguntar «por qué» algo que nadie duda y pregunta cómo funciona. La figura ya no dibuja una bandeja girada: en «Lo que se mide» los botones van amontonados en una punta y la bandeja marca 0°.',
        'Revisión del Escribidor Escribano (27 nov): la pregunta decía «los dos brazos, y los tornillos donde giran», con un inciso que la cortaba; ahora es de corrido. Sobre la repetición con congruencia, ver la nota de esa apertura: aquí se queda lo que se conserva y allá lo que se pierde.',
      ],
    },
  };
})());
