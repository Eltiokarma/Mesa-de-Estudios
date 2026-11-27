/*
 * Apertura de «Reducción al primer cuadrante» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * El caso es la tapa de una laptop: abierta a 50° y abierta a 130°, su borde queda a la misma altura sobre la
 * bisagra, unos 15,3 cm, y la intuición del espejo lo explica (doble revisión del 27 nov: sin choque fabricado).
 * Lo que el alumno se lleva va en ficha.seLleva. No usa los objetos de las Predice y las misiones (la flecha que apunta
 * a los puntos cardinales, la cabina de la rueda, el minutero, la válvula, las aspas) ni escribe sus números (70, 140,
 * 180, 210, 30, 60, 150, 360…). La figura no dibuja el ángulo agudo que acompaña a 130° (α, violeta en la unidad):
 * eso queda para la idea 1. Colores de la unidad (cabecera de
 * contenido/teoria/trigonometria/reduccion-al-primer-cuadrante.js): la abertura θ en carmín (c-h) y lo que sube el
 * borde, la ordenada y, en naranja (c-o); la laptop, en tinta.
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const ang = t => ({ v: 'c-h', t }), alto = t => ({ v: 'c-o', t });
  const r1 = n => Math.round(n * 10) / 10;
  // La laptop de lado: el teclado hacia la izquierda de la bisagra (donde se sienta quien la usa) y la tapa de 20 cm
  // (1 cm = 6,6 unidades). La abertura se mide desde el teclado: a 50° la tapa se inclina hacia el teclado y a 130°,
  // hacia atrás. En los dos paneles están las dos tapas; solo cambia la altura que marca la barra naranja de la de 130°.
  const BIS = 268, K = 6.6, L = 20 * K;
  const punta = (hx, g) => [hx - L * Math.cos(g * Math.PI / 180), BIS - L * Math.sin(g * Math.PI / 180)];
  const panel = (x0, titulo, alto130, rot130, pie, espejo) => {
    const hx = x0 + 138, [ax, ay] = punta(hx, 50), [bx, by] = punta(hx, 130), h50 = BIS - ay;
    const barra = (x, h, rot, ancla, dx) => `<line x1="${r1(x)}" y1="${BIS}" x2="${r1(x)}" y2="${r1(BIS - h)}" style="stroke:var(--c-o)" stroke-width="5" stroke-linecap="round"/>
      <line x1="${r1(x - 10)}" y1="${r1(BIS - h)}" x2="${r1(x + 10)}" y2="${r1(BIS - h)}" style="stroke:var(--c-o)" stroke-width="4" stroke-linecap="round"/>
      <text x="${r1(x + dx)}" y="${r1(BIS - h - 10)}" text-anchor="${ancla}" font-size="20" font-weight="800" style="fill:var(--c-o);stroke:var(--card)" stroke-width="5" paint-order="stroke">${rot}</text>`;
    const arco = (r, g) => { const [px, py] = [hx - r * Math.cos(g * Math.PI / 180), BIS - r * Math.sin(g * Math.PI / 180)]; return `<path d="M${hx - r} ${BIS}A${r} ${r} 0 0 1 ${r1(px)} ${r1(py)}" fill="none" style="stroke:var(--c-h)" stroke-width="3"/>`; };
    return `<text x="${x0 + 130}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      <line x1="${x0 + 8}" y1="${BIS + 12}" x2="${x0 + 252}" y2="${BIS + 12}" style="stroke:var(--muted)" stroke-width="3" stroke-linecap="round"/>
      <rect x="${hx - 128}" y="${BIS - 2}" width="132" height="12" rx="4" style="fill:var(--card)" stroke="currentColor" stroke-width="3"/>
      ${espejo ? `<line x1="${hx}" y1="${BIS}" x2="${hx}" y2="${r1(BIS - L - 14)}" style="stroke:var(--muted)" stroke-width="3" stroke-dasharray="7 7"/>
      <text x="${hx}" y="${r1(BIS - L - 22)}" text-anchor="middle" font-size="17" font-weight="700" style="fill:var(--muted)">espejo</text>` : ''}
      ${arco(30, 50)}${arco(44, 130)}
      <text x="${r1(hx - 52)}" y="${BIS - 18}" text-anchor="middle" font-size="18" font-weight="800" style="fill:var(--c-h)">50°</text>
      <text x="${r1(hx + 4)}" y="${BIS - 54}" text-anchor="middle" font-size="18" font-weight="800" style="fill:var(--c-h)">130°</text>
      ${barra(ax, h50, '15,3 cm', 'middle', 0)}
      ${barra(bx, alto130, rot130, 'middle', 0)}
      <line x1="${hx}" y1="${BIS}" x2="${r1(ax)}" y2="${r1(ay)}" stroke="currentColor" stroke-width="10" stroke-linecap="round"/>
      <line x1="${hx}" y1="${BIS}" x2="${r1(bx)}" y2="${r1(by)}" stroke="currentColor" stroke-width="10" stroke-linecap="round" stroke-opacity=".45"/>
      <circle cx="${hx}" cy="${BIS}" r="6" fill="currentColor"/>
      ${pie.map((l, i) => `<text x="${x0 + 130}" y="${BIS + 62 + i * 26}" text-anchor="middle" font-size="22" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 386" width="520" height="386" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="376" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', 20 * K * Math.sin(50 * Math.PI / 180), 'igual', ['A 130°, el reflejo', 'de la tapa a 50°'], true)}
    ${panel(260, 'Lo que se mide', 20 * K * Math.sin(50 * Math.PI / 180), '15,3 cm', ['A 50° y a 130°:', 'la misma altura'])}
  </svg>`;

  return {
    unidad: 'trigonometria.reduccion-al-primer-cuadrante',
    titulo: '¿Qué tienen en común una laptop abierta a 50° y una abierta a 130°?',
    parrafos: [
      ['La tapa de una laptop gira sobre su bisagra, y en una de 14 pulgadas mide unos 20 cm desde la bisagra hasta su borde de arriba. ',
        'Si la abrieras ', ang('50°'), ' y midieras con una regla a qué altura sobre la bisagra queda ese borde, encontrarías unos ', alto('15,3 cm'), '.'],
      ['Si sigues abriéndola, el borde sube hasta que la tapa queda vertical, a 20 cm, y después vuelve a bajar, porque la tapa empieza a inclinarse hacia atrás. ',
        'Abierta hasta ', ang('130°'), ', queda tan inclinada hacia atrás como lo estaba hacia adelante a 50°, como su reflejo en un espejo, así que su borde vuelve a quedar a unos ', alto('15,3 cm'), '.'],
      ['Esa intuición del espejo es correcta, y sirve para algo que el triángulo rectángulo no puede hacer solo, porque en un triángulo rectángulo no cabe un ángulo de 130°. ',
        'Calcular con un ángulo así a través del ángulo agudo que es su reflejo, como el de 50° para el de 130°, es el tema de esta unidad, la reducción al primer cuadrante.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos dibujos iguales de una laptop vista de lado, con la tapa de 20 cm abierta a 50° hacia el teclado y a 130° hacia atrás. Lo que predice el espejo: la tapa a 130° es el reflejo de la tapa a 50°, con el borde a la misma altura. Lo que se mide: en las dos aberturas el borde queda a 15,3 cm sobre la bisagra.',
    },
    pregunta: 'Si abres la tapa solo 35°, ¿a qué otra abertura, ya inclinada hacia atrás, crees que su borde volvería a quedar a la misma altura?',
    ficha: {
      seLleva: 'Una tapa que se inclina hacia atrás deja su borde a la misma altura que si se inclinara lo mismo hacia adelante: abierta a 130° es el reflejo de abierta a 50°.',
      alcance: 'Parcial (deducción propia con el marco de Matemática 2022: espacio y forma, simetría de una posición; la reducción como técnica de cálculo no entra en PISA). En la tabla del skill, «funciones trigonométricas» es parcial por los ciclos.',
      choque: 'Sin choque fabricado (apertura-pisa.md, punto 7): la intuición del espejo (130° es el reflejo de 50°, el borde queda igual de alto) es la correcta; la apertura la muestra y dice qué permite, calcular con un ángulo que no cabe en un triángulo rectángulo.',
      atajo: 'La simetría que ve el mejor alumno (la tapa a 130° es el reflejo de la de 50°) ya es la idea del ángulo de referencia: se usa como puente, el párrafo 2 la dice y la pregunta la pone a trabajar con otra abertura. La tabla del skill (sección 7, funciones trigonométricas) dice lo mismo: el atajo es parte del tema.',
      porVerificar: [
        'Alto de la tapa de una laptop de 14 pulgadas: la pantalla 16:9 mide unos 17,4 cm de alto y la tapa, con el marco, unos 20 a 22 cm (de memoria; varía con el modelo).',
        'Los 15,3 cm salen del cálculo (20 cm · sen 50° ≈ 15,3 cm), no de una medición; se mide sobre la bisagra, no sobre la mesa. Que muchas laptops se abran hasta unos 130° o más también es de memoria (algunas llegan a 180°).',
      ],
      notas: [
        'La pregunta se responde con el espejo: 35° hacia adelante tiene su reflejo en 145° (180° − 35°), que el alumno puede hallar con la figura o con la cuenta de 50° y 130°. Abre la idea 1 (el ángulo de referencia) sin dar la cuenta; 35 y 145 no son números de las Predice ni de las misiones.',
        'Solo aparece el segundo cuadrante; los signos y los cuadrantes III y IV quedan para la idea 2.',
        'Revisión del Escribidor Escribano (27 nov): el párrafo 3 enunciaba el método («encontrar ese ángulo pequeño, el agudo que acompaña a cada ángulo, y usarlo para calcular»; «muchos ángulos grandes se comportan como uno pequeño»): se recortó para que quede el choque y el nombre del tema. El seLleva decía «por eso un ángulo grande se puede calcular con uno agudo», que es la regla, y daba la respuesta de la pregunta (cuánto se aparta de la horizontal); ahora deja solo el hecho. El párrafo 1 pasó a condicional («encontrarías», «volvería»), porque los 15,3 cm son cálculo.',
        'Doble revisión (27 nov): reescrita con los puntos 6 y 7 de apertura-pisa.md. Antes el párrafo 2 decía que, «con lo que sabes de triángulos rectángulos», a 130° el borde tendría que quedar más alto que a 50°, y el panel «Lo que predice» dibujaba la tapa de 130° más alta: un muñeco de paja, porque cualquiera que usó una laptop sabe que al echar la pantalla hacia atrás el borde baja. Ahora el párrafo 2 cuenta lo que el alumno ya ve (el borde sube hasta la vertical y luego baja, y 130° es el reflejo de 50°), el párrafo 3 dice que esa intuición es correcta y para qué sirve, y la figura pone el espejo en «Lo que predice». El título era «¿Por qué la tapa de una laptop abierta a 130° queda tan alta como abierta a 50°?»; ahora pregunta qué tienen en común, que era la pregunta vieja, y la pregunta nueva pide usar el espejo con 35°.',
        'Contenido, para Gerson (antes de la doble revisión): la pregunta («mirando cuánto se aparta la tapa de la mesa») casi dicta la respuesta; se puede pensar, pero conviene decidir si se deja la pista o se pregunta solo «¿qué tienen en común?».',
      ],
    },
  };
})());
