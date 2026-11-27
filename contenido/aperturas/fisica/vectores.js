/*
 * Apertura de «Vectores» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * Segunda versión (27 nov), escrita desde cero: el choque es algo que el alumno ha sentido (cargar entre dos una bolsa
 * del mercado y separarse), medido con dos balanzas de gancho. Lo que el alumno se lleva va en ficha.seLleva.
 * Se cuida no adelantar la Predice de la idea 1 (dos drones que vuelan 300 m: «Depende de hacia dónde vuela cada uno»)
 * ni la de la idea 3 (3 N y 4 N a 90°: 5 N, por eso no se nombra a Pitágoras). Colores de la unidad (cabecera de
 * contenido/teoria/fisica/vectores.js): el primer jalón en naranja (c-o), el segundo en turquesa (c-i) y el ángulo en
 * carmín (c-h).
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const th = t => ({ v: 'c-h', t });
  const r1 = n => Math.round(n * 10) / 10;
  // Flecha de (x1, y1) a (x2, y2) con su punta, en el color de su variable.
  const flecha = (x1, y1, x2, y2, c, w = 6) => {
    const g = Math.atan2(y2 - y1, x2 - x1), p = 16, a = 0.45;
    const bx = x2 - p * Math.cos(g), by = y2 - p * Math.sin(g);
    const q1 = [x2 - p * Math.cos(g - a) * 1.15, y2 - p * Math.sin(g - a) * 1.15], q2 = [x2 - p * Math.cos(g + a) * 1.15, y2 - p * Math.sin(g + a) * 1.15];
    return `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(bx)}" y2="${r1(by)}" style="stroke:var(${c})" stroke-width="${w}" stroke-linecap="round"/>
      <path d="M${r1(x2)} ${r1(y2)}L${r1(q1[0])} ${r1(q1[1])}L${r1(q2[0])} ${r1(q2[1])}Z" style="fill:var(${c})"/>`;
  };
  // Los dos paneles tienen la misma bolsa y las mismas cuerdas, abiertas con 120° entre ellas (60° de la vertical).
  // Solo cambia lo que marca cada balanza, y con eso el largo de la flecha de cada jalón: 1 kg = 6,5 unidades.
  const NUDO = 214, LARGO = 100, S = Math.sin(Math.PI / 3), C = Math.cos(Math.PI / 3), K = 6.5;
  const balanza = (x, y, kg, col) => `<line x1="${r1(x)}" y1="${r1(y - 30)}" x2="${r1(x)}" y2="${r1(y - 46)}" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
      <path d="M${r1(x - 7)} ${r1(y - 52)}q7 -9 14 0" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
      <circle cx="${r1(x)}" cy="${r1(y)}" r="30" style="fill:var(--card)" stroke="currentColor" stroke-width="3"/>
      <text x="${r1(x)}" y="${r1(y + 8)}" text-anchor="middle" font-size="21" font-weight="800" style="fill:var(${col})">${kg} kg</text>`;
  const panel = (x0, titulo, kg, pie) => {
    const cx = x0 + 130, ix = cx - LARGO * S, dx = cx + LARGO * S, y = NUDO - LARGO * C;
    const arco = `<path d="M${r1(cx - S * 30)} ${r1(NUDO - C * 30)}A30 30 0 0 1 ${r1(cx + S * 30)} ${r1(NUDO - C * 30)}" fill="none" style="stroke:var(--c-h)" stroke-width="3"/>`;
    const bolsa = `<path d="M${cx - 34} ${NUDO + 22}L${cx - 44} ${NUDO + 92}Q${cx - 44} ${NUDO + 100} ${cx - 36} ${NUDO + 100}L${cx + 36} ${NUDO + 100}Q${cx + 44} ${NUDO + 100} ${cx + 44} ${NUDO + 92}L${cx + 34} ${NUDO + 22}Z" style="fill:var(--card)" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
      <path d="M${cx - 16} ${NUDO + 22}Q${cx - 16} ${NUDO} ${cx} ${NUDO}Q${cx + 16} ${NUDO} ${cx + 16} ${NUDO + 22}" fill="none" stroke="currentColor" stroke-width="3"/>
      <text x="${cx}" y="${NUDO + 70}" text-anchor="middle" font-size="22" font-weight="800" fill="currentColor">10 kg</text>`;
    return `<text x="${cx}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      <line x1="${cx}" y1="${NUDO}" x2="${r1(ix)}" y2="${r1(y)}" style="stroke:var(--muted)" stroke-width="2.5"/>
      <line x1="${cx}" y1="${NUDO}" x2="${r1(dx)}" y2="${r1(y)}" style="stroke:var(--muted)" stroke-width="2.5"/>
      ${arco}
      <text x="${cx}" y="${NUDO - 40}" text-anchor="middle" font-size="21" font-weight="800" style="fill:var(--c-h)">120°</text>
      ${flecha(cx, NUDO, cx - kg * K * S, NUDO - kg * K * C, '--c-o')}${flecha(cx, NUDO, cx + kg * K * S, NUDO - kg * K * C, '--c-i')}
      ${balanza(ix, y, kg, '--c-o')}${balanza(dx, y, kg, '--c-i')}
      ${bolsa}
      ${pie.map((l, i) => `<text x="${cx}" y="${348 + i * 26}" text-anchor="middle" font-size="22" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 386" width="520" height="386" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="376" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', 5, ['Cada balanza:', 'media bolsa'])}
    ${panel(260, 'Lo que se mide', 10, ['Cada balanza:', 'la bolsa entera'])}
  </svg>`;

  return {
    unidad: 'fisica.vectores',
    titulo: '¿Por qué una bolsa que cargan dos personas se siente más pesada cuando se separan?',
    parrafos: [
      ['Cuando cargas con alguien una bolsa pesada del mercado, cada uno de un asa, la bolsa se siente liviana mientras caminan pegados, con los brazos estirados hacia abajo. ',
        'Si se separan, los brazos se abren y la misma bolsa se siente más pesada, aunque nadie le haya agregado nada. ',
        'Con dos balanzas de gancho, como las del mercado, se puede medir: una bolsa de 10 kg colgada de las dos con las cuerdas verticales hace marcar 5 kg a cada balanza. ',
        'Con las cuerdas abiertas hasta formar ', th('120°'), ' entre ellas, cada balanza marca 10 kg, la bolsa entera.'],
      ['La cuenta que haría cualquiera es repartir: la bolsa tiene 10 kg y la sostienen dos cuerdas, así que a cada una le tocan 5 kg, estén abiertas o no. ',
        'Si alguien culpa al cansancio del brazo abierto, las balanzas lo desmienten, porque no tienen músculos y aun así marcan el doble.'],
      ['Con las cuerdas abiertas, cada balanza jala hacia arriba y también hacia su costado, y la parte que va hacia el costado no sostiene la bolsa: la anula el jalón de la otra balanza. ',
        'Por eso dos jalones no se suman como dos números, y para juntarlos hay que tener en cuenta su dirección además de su tamaño. ',
        'Las cantidades que se suman así se llaman vectores, y son el tema de esta unidad.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos dibujos iguales: una bolsa de 10 kg colgada de dos balanzas con las cuerdas abiertas, con 120° entre ellas. Lo que predice el reparto: cada balanza marca 5 kg, media bolsa. Lo que se mide: cada balanza marca 10 kg, la bolsa entera.',
    },
    pregunta: 'Si las dos balanzas se separan todavía más, hasta que las cuerdas queden casi horizontales, ¿qué crees que pasará con lo que marca cada una?',
    ficha: {
      seLleva: 'Dos jalones no se suman como números: si van en direcciones distintas, parte de cada uno se gasta hacia el costado, y por eso cargar entre dos cuesta más cuando se separan.',
      alcance: 'Parcial (núcleo: qué cambia, respecto de qué y en qué intervalo).',
      choque: 'Con las cuerdas a 120°, el reparto predice 5 kg por balanza y cada una marca 10 kg, la bolsa entera.',
      atajo: 'Repartir a la mitad, que es la suma como números; y la explicación trampa del cansancio del brazo, que las balanzas descartan porque no tienen músculos. El teorema de Pitágoras no sirve porque el ángulo no es recto, y no se nombra para no tocar la Predice de la idea 3 (3 N y 4 N a 90°).',
      porVerificar: [
        'Los 10 kg con 120° salen del cálculo (cada cuerda sostiene 10 kg ÷ (2 × cos 60°) = 10 kg), no de una medición propia: falta medirlo con dos balanzas de gancho o dinamómetros, o citar una práctica publicada.',
        'Que las balanzas colgantes de gancho, de resorte o digitales, sean comunes en los mercados del Perú.',
        'La balanza marca en kilogramos porque está calibrada con la gravedad de la Tierra: lo que mide es un jalón. El texto dice «marca 10 kg», que es lo que lee el alumno en el aparato, y no dice que la bolsa «pese» más.',
      ],
      notas: [
        'Segunda versión (27 nov): Gerson rechazó la primera (dos cuerdas de 10 N a 120°, de la tabla del skill). Esta parte de algo que el alumno ha sentido y deja una oración para llevarse (seLleva).',
        'El párrafo 3 dice qué parte del jalón se pierde (la que va al costado) sin componentes ni fórmulas: eso es de la idea 2. Que la dirección importa es el corazón de la unidad y no se puede esconder; lo que no aparece es la frase de la Predice de la idea 1 ni su caso de los drones.',
        'La pregunta se puede intentar con la figura: de 5 kg a 10 kg al abrir las cuerdas, así que al abrirlas más marcarían todavía más (con las cuerdas horizontales no podrían sostener la bolsa).',
        'Revisión del Escribidor Escribano (27 nov): «cuerdas rectas» no distinguía nada (una cuerda tensa siempre es recta) y pasó a «verticales»; «brazos rectos», a «estirados hacia abajo». El «Tampoco» del párrafo 2 sumaba una explicación descartada a una cuenta que todavía no se había descartado; ahora la trampa del cansancio entra como objeción que las balanzas desmienten.',
        'Contenido, para Gerson: el párrafo 3 explica el mecanismo (la parte del jalón que va al costado se anula), más de lo que el skill pide a una entrada, aunque sin componentes ni fórmulas; es lo que sostiene seLleva. Y la oración «hay que tener en cuenta su dirección además de su tamaño» no copia la respuesta de la Predice de la idea 1 (la prueba pasa), pero un alumno que la leyó llega a esa Predice sabiendo que la dirección importa. Decidir si se acepta o se corta esa oración.',
      ],
    },
  };
})());
