/*
 * Apertura de «Reducción al primer cuadrante» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * El choque es la tapa de una laptop: abierta a 50° y abierta a 130°, su borde queda a la misma altura sobre la
 * bisagra, unos 15,3 cm, cuando la regla del triángulo («más ángulo, más alto») predice que a 130° quedaría más alto.
 * Lo que el alumno se lleva va en ficha.seLleva. No usa los objetos de las Predice y las misiones (la flecha que apunta
 * a los puntos cardinales, la cabina de la rueda, el minutero, la válvula, las aspas) ni escribe sus números (70, 140,
 * 180, 210, 30, 60, 150, 360…). La figura no dibuja el ángulo agudo que acompaña a 130° (α, violeta en la unidad):
 * eso es lo que pide la pregunta. Colores de la unidad (cabecera de
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
  const panel = (x0, titulo, alto130, rot130, pie) => {
    const hx = x0 + 138, [ax, ay] = punta(hx, 50), [bx, by] = punta(hx, 130), h50 = BIS - ay;
    const barra = (x, h, rot, ancla, dx) => `<line x1="${r1(x)}" y1="${BIS}" x2="${r1(x)}" y2="${r1(BIS - h)}" style="stroke:var(--c-o)" stroke-width="5" stroke-linecap="round"/>
      <line x1="${r1(x - 10)}" y1="${r1(BIS - h)}" x2="${r1(x + 10)}" y2="${r1(BIS - h)}" style="stroke:var(--c-o)" stroke-width="4" stroke-linecap="round"/>
      <text x="${r1(x + dx)}" y="${r1(BIS - h - 10)}" text-anchor="${ancla}" font-size="20" font-weight="800" style="fill:var(--c-o);stroke:var(--card)" stroke-width="5" paint-order="stroke">${rot}</text>`;
    const arco = (r, g) => { const [px, py] = [hx - r * Math.cos(g * Math.PI / 180), BIS - r * Math.sin(g * Math.PI / 180)]; return `<path d="M${hx - r} ${BIS}A${r} ${r} 0 0 1 ${r1(px)} ${r1(py)}" fill="none" style="stroke:var(--c-h)" stroke-width="3"/>`; };
    return `<text x="${x0 + 130}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      <line x1="${x0 + 8}" y1="${BIS + 12}" x2="${x0 + 252}" y2="${BIS + 12}" style="stroke:var(--muted)" stroke-width="3" stroke-linecap="round"/>
      <rect x="${hx - 128}" y="${BIS - 2}" width="132" height="12" rx="4" style="fill:var(--card)" stroke="currentColor" stroke-width="3"/>
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
    ${panel(0, 'Lo que predice', 20 * K * 0.98, 'más alto', ['Más abierta:', 'más alto el borde'])}
    ${panel(260, 'Lo que se mide', 20 * K * Math.sin(50 * Math.PI / 180), '15,3 cm', ['A 50° y a 130°:', 'la misma altura'])}
  </svg>`;

  return {
    unidad: 'trigonometria.reduccion-al-primer-cuadrante',
    titulo: '¿Por qué la tapa de una laptop abierta a 130° queda tan alta como abierta a 50°?',
    parrafos: [
      ['La tapa de una laptop gira sobre su bisagra, y en una de 14 pulgadas mide unos 20 cm desde la bisagra hasta su borde de arriba. ',
        'Si la abrieras ', ang('50°'), ' y midieras con una regla a qué altura sobre la bisagra queda ese borde, encontrarías unos ', alto('15,3 cm'),
        '; si la abrieras hasta ', ang('130°'), ', inclinada hacia atrás, el borde volvería a quedar a unos ', alto('15,3 cm'), '.'],
      ['Con lo que sabes de triángulos rectángulos, si la tapa no cambia de largo, cuanto más grande es el ángulo, más alto queda el borde, y así pasa al abrirla desde cerrada hasta dejarla vertical. ',
        'Siguiendo esa regla, a 130° el borde tendría que quedar más alto que a 50°, aunque en un triángulo rectángulo ni siquiera cabe un ángulo de 130°.'],
      ['Las dos aberturas dejan el borde igual de alto, aunque una mide más del doble que la otra, y la regla de «más ángulo, más altura» no lo explica. ',
        'Calcular con ángulos que no caben en un triángulo rectángulo, como el de 130°, es el tema de esta unidad, la reducción al primer cuadrante.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos dibujos iguales de una laptop vista de lado, con la tapa de 20 cm abierta a 50° hacia el teclado y a 130° hacia atrás. Lo que predice la regla de más ángulo, más altura: abierta a 130°, el borde queda más alto. Lo que se mide: en las dos aberturas el borde queda a 15,3 cm sobre la bisagra.',
    },
    pregunta: 'Mirando cuánto se aparta la tapa de la mesa en cada caso, ¿qué tienen en común la abertura de 50° y la de 130°?',
    ficha: {
      seLleva: 'Abrir más no siempre deja más alto el borde de algo que gira: la tapa de una laptop abierta a 130° deja su borde a la misma altura que abierta a 50°.',
      alcance: 'Parcial (deducción propia con el marco de Matemática 2022: espacio y forma, simetría de una posición; la reducción como técnica de cálculo no entra en PISA). En la tabla del skill, «funciones trigonométricas» es parcial por los ciclos.',
      choque: 'La regla del triángulo (más ángulo, más alto) predice que abierta a 130° el borde queda más alto que a 50°, y en las dos queda a unos 15,3 cm.',
      atajo: 'La simetría que ve el mejor alumno (la tapa a 130° es el reflejo de la de 50°) ya es la idea del ángulo de referencia: se usa como puente y la pregunta la pide sin darla. La tabla del skill (sección 7, funciones trigonométricas) dice lo mismo: el atajo es parte del tema.',
      porVerificar: [
        'Alto de la tapa de una laptop de 14 pulgadas: la pantalla 16:9 mide unos 17,4 cm de alto y la tapa, con el marco, unos 20 a 22 cm (de memoria; varía con el modelo).',
        'Los 15,3 cm salen del cálculo (20 cm · sen 50° ≈ 15,3 cm), no de una medición; se mide sobre la bisagra, no sobre la mesa. Que muchas laptops se abran hasta unos 130° o más también es de memoria (algunas llegan a 180°).',
      ],
      notas: [
        'La pregunta se responde mirando la figura: las dos tapas se apartan 50° de la mesa, una hacia adelante y otra hacia atrás (130° = 180° − 50°). Abre la idea 1 (el ángulo de referencia) sin dar la cuenta.',
        'El panel «Lo que predice» deja la barra de la tapa de 130° más alta que su borde: la diferencia que se ve es el choque.',
        'Solo aparece el segundo cuadrante; los signos y los cuadrantes III y IV quedan para la idea 2.',
        'Revisión del Escribidor Escribano (27 nov): el párrafo 3 enunciaba el método («encontrar ese ángulo pequeño, el agudo que acompaña a cada ángulo, y usarlo para calcular»; «muchos ángulos grandes se comportan como uno pequeño»): se recortó para que quede el choque y el nombre del tema. El seLleva decía «por eso un ángulo grande se puede calcular con uno agudo», que es la regla, y daba la respuesta de la pregunta (cuánto se aparta de la horizontal); ahora deja solo el hecho. El párrafo 1 pasó a condicional («encontrarías», «volvería»), porque los 15,3 cm son cálculo.',
        'Contenido, para Gerson: la pregunta («mirando cuánto se aparta la tapa de la mesa») casi dicta la respuesta; se puede pensar, pero conviene decidir si se deja la pista o se pregunta solo «¿qué tienen en común?».',
      ],
    },
  };
})());
