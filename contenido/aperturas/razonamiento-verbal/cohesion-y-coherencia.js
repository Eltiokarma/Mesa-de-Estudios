/*
 * Apertura de «Cohesión y coherencia textual» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * En verbal el choque es entre lo que se entiende de un texto y lo que dice: el aviso de la excursión («con su
 * apoderado y con su DNI, y si no lo trae…») se lee como si «lo» fuera el DNI, y el texto deja que sea también el
 * apoderado, porque las dos palabras son masculinas y singulares. El dato es el texto mismo. Lo que el alumno se lleva
 * va en ficha.seLleva. La apertura vecina (conectores) abre con mensajes de WhatsApp; esta, con un aviso escrito del
 * colegio. No adelanta la Predice de la idea 1 (el horario de la biblioteca), la de la idea 2 («esto» y los dos puntos)
 * ni la de la idea 3 (la elipsis del cartel de la feria). Colores: el DNI en turquesa (c-i) y el apoderado en naranja
 * (c-o), las dos palabras a las que puede ir «lo».
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const dni = t => ({ v: 'c-i', t }), apo = t => ({ v: 'c-o', t });
  const r1 = n => Math.round(n * 10) / 10;

  // Flecha curva desde el «lo» del aviso hasta lo que nombra.
  const flecha = (x1, y1, x2, y2, c) => {
    const mx = (x1 + x2) / 2, g = Math.atan2(y2 - (y1 + 40), x2 - mx), p = 13;
    return `<path d="M${x1} ${y1}Q${r1(mx)} ${y1 + 40} ${r1(x2 - p * Math.cos(g))} ${r1(y2 - p * Math.sin(g))}" fill="none" style="stroke:var(${c})" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M${x2} ${y2}L${r1(x2 - p * Math.cos(g - 0.5))} ${r1(y2 - p * Math.sin(g - 0.5))}L${r1(x2 - p * Math.cos(g + 0.5))} ${r1(y2 - p * Math.sin(g + 0.5))}Z" style="fill:var(${c})"/>`;
  };
  // El aviso, igual en los dos paneles, con las dos palabras de antes y el «lo» marcados.
  const aviso = x0 => `<rect x="${x0 + 18}" y="48" width="224" height="126" rx="12" style="fill:var(--card)" stroke="currentColor" stroke-width="2.5"/>
      <text x="${x0 + 34}" y="82" font-size="20" fill="currentColor">…con su <tspan font-weight="800" style="fill:var(--c-o)">apoderado</tspan></text>
      <text x="${x0 + 34}" y="114" font-size="20" fill="currentColor">y con su <tspan font-weight="800" style="fill:var(--c-i)">DNI</tspan>,</text>
      <text x="${x0 + 34}" y="152" font-size="20" fill="currentColor">y si no <tspan font-weight="800" text-decoration="underline">lo</tspan> trae…</text>`;
  // Lo que puede nombrar «lo»: una persona (el apoderado) y una tarjeta (el DNI).
  const persona = (cx, cy) => `<circle cx="${cx}" cy="${cy - 30}" r="13" style="fill:var(--c-o)"/>
      <path d="M${cx - 24} ${cy + 30}v-22a24 24 0 0 1 48 0v22z" style="fill:var(--c-o)"/>
      <text x="${cx}" y="${cy + 56}" text-anchor="middle" font-size="18" font-weight="800" style="fill:var(--c-o)">apoderado</text>`;
  const tarjeta = (cx, cy) => `<rect x="${cx - 38}" y="${cy - 26}" width="76" height="52" rx="7" style="fill:var(--card);stroke:var(--c-i)" stroke-width="3"/>
      <rect x="${cx - 30}" y="${cy - 17}" width="22" height="28" rx="3" style="fill:var(--c-i)" fill-opacity=".5"/>
      ${[-12, -2, 8].map(dy => `<line x1="${cx - 2}" y1="${cy + dy}" x2="${cx + 28}" y2="${cy + dy}" style="stroke:var(--c-i)" stroke-width="3" stroke-linecap="round"/>`).join('')}
      <text x="${cx}" y="${cy + 52}" text-anchor="middle" font-size="18" font-weight="800" style="fill:var(--c-i)">DNI</text>`;
  const pie = (cx, l) => l.map((t, i) => `<text x="${cx}" y="${358 + i * 26}" text-anchor="middle" font-size="22" style="fill:var(--muted)">${t}</text>`).join('');
  const LO = 122, Y = 160; // dónde queda el «lo» del aviso, medido sobre la tercera línea

  const svg = `<svg viewBox="0 0 520 404" width="520" height="404" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="394" style="stroke:var(--line)" stroke-width="2"/>
    <text x="130" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">Lo que se entiende</text>
    ${aviso(0)}${persona(66, 260)}${tarjeta(192, 256)}
    ${flecha(LO, Y, 178, 226, '--c-i')}
    ${pie(130, ['«Lo» es el DNI,', 'sin duda'])}
    <text x="390" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">Lo que dice</text>
    ${aviso(260)}${persona(326, 260)}${tarjeta(452, 256)}
    ${flecha(260 + LO, Y, 438, 226, '--c-i')}${flecha(260 + LO, Y, 318, 216, '--c-o')}
    ${pie(390, ['«Lo» puede ser', 'cualquiera de los dos'])}
  </svg>`;

  return {
    unidad: 'razonamiento-verbal.cohesion-y-coherencia',
    titulo: '¿Por qué un aviso del colegio que no tiene una sola falta se puede entender de dos maneras?',
    parrafos: [
      ['Antes de una excursión, el colegio pega un aviso en la agenda: «Cada alumno debe venir el sábado con su ', apo('apoderado'), ' y con su ', dni('DNI'),
        ', y si no lo trae, no podrá subir al bus». ',
        'Antes de «lo» hay dos palabras que pueden ir con él, «apoderado» y «DNI», porque las dos son masculinas y están en singular.'],
      ['A la primera, casi todos leen el aviso como si «lo» fuera el DNI, porque es el documento que el colegio pide siempre que hay una salida. ',
        'Un alumno que llega con su papá y se olvidó el DNI, en cambio, puede leer que «lo» es el apoderado y creer que igual subirá al bus, porque ya lo trajo. ',
        'Las dos lecturas respetan la gramática del aviso, y nada en sus palabras dice cuál de las dos quiso el colegio.'],
      ['El aviso no tiene una sola falta, y aun así falla porque el «lo» del final no queda amarrado a una sola de las dos palabras que lo preceden. ',
        'Esos amarres entre las palabras de un texto se llaman cohesión, y son, junto con la coherencia, el tema de esta unidad.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos dibujos con el mismo aviso: con su apoderado y con su DNI, y si no lo trae. Debajo, una persona, el apoderado, y una tarjeta, el DNI. Lo que se entiende: una sola flecha va de «lo» al DNI. Lo que dice el aviso: de «lo» salen dos flechas, una al DNI y otra al apoderado, porque el pronombre puede ir con cualquiera de los dos.',
    },
    pregunta: '¿Cómo escribirías de nuevo el final del aviso, desde «si no lo trae», para que solo se pueda entender de una manera?',
    ficha: {
      seLleva: 'Un texto sin una sola falta puede entenderse de dos maneras si una palabra como «lo» puede referirse a dos cosas que se nombraron antes.',
      alcance: 'Sí (marco de lectura de PISA 2025, deducción propia: integrar la información de varias oraciones y detectar una ambigüedad o un conflicto en el texto).',
      choque: 'El aviso se lee como «si no trae el DNI»; el texto también deja leer «si no trae al apoderado», porque «lo» concuerda con las dos palabras.',
      atajo: 'Que el aviso no tenga faltas no lo salva: es justamente el choque. El atajo de elegir la palabra más cercana a «lo» ya no se descarta en el texto, para no quitarle fuerza al distractor de la Predice de la idea 2 («la directora, que se nombra justo antes»).',
      porVerificar: [
        'Ninguno de memoria: el aviso es propio y el dato es la concordancia de «lo» con «apoderado» y con «DNI» (masculino singular), que se ve en el texto.',
        'Que «a su apoderado» lleve la preposición «a» si se escribe el nombre y que el pronombre «lo» la borre (por eso el aviso admite las dos lecturas): gramática general, por cotejar con la Nueva gramática si se cita en clase.',
      ],
      notas: [
        'Revisión del Escribidor Escribano (27 nov): el párrafo 3 decía «Un texto se entiende cuando sus oraciones se enlazan sin dejar dudas sobre de quién o de qué se habla, y cuando lo que dice una no choca con lo que dice otra», que enuncia a la vez la regla de la referencia (idea 2) y la de la contradicción (idea 1), y la segunda mitad no venía del choque del aviso. Se quitó y el párrafo cierra nombrando la cohesión desde el «lo» mal amarrado. En el párrafo 2, «Es fácil leerlo» pasó a «A la primera, casi todos leen el aviso» («es fácil» está en la lista de lo que no se dice) y «quien lo lee con miedo de quedarse abajo» a «esa mamá preocupada», que retoma a la mamá de la oración anterior.',
        'Contenido, para Gerson: el párrafo 2 descarta «la palabra más cercana» como atajo. No da la respuesta de la Predice de la idea 2 («esto» es todo el pedido que sigue a los dos puntos), pero le quita fuerza a su distractor («la directora, que se nombra justo antes»). La prueba de no delatar pasa; si se quiere la Predice intacta, el atajo se puede cambiar por otro.',
        'La pregunta se puede intentar con el texto: repetir el nombre («Si no trae el DNI…») o cambiar el orden. La clase la retoma en la idea 3 (repetir, sustituir o callar) sin que la apertura dé la respuesta.',
        'El aviso es invento propio y se lee como tal; no copia avisos reales ni textos de examen.',
        'Figura: el mismo aviso y los mismos dos objetos en los dos paneles; cambia solo cuántas flechas salen de «lo».',
        'Doble revisión (27 nov): dos cambios en el párrafo 2. Primero, la mamá que no puede acompañar a su hija leía «lo» como el apoderado y temía que la hija se quedara sin excursión, pero el aviso ya exige ir con el apoderado en la primera parte, así que esa lectura no le cambia nada: el riesgo verdadero de la ambigüedad es el contrario, el de un alumno que va con su papá, olvidó el DNI y cree que igual sube. Ahora el ejemplo es ese. Segundo, el pendiente del distractor: la oración que descartaba «la palabra que está más cerca de «lo»» le quitaba fuerza a la opción «A la directora, que se nombra justo antes» de la Predice de la idea 2, y se quitó; en su lugar, el párrafo dice que las dos lecturas respetan la gramática y que el aviso no dice cuál quiso el colegio.',
        'Tercera pasada (27 nov): sin ecuaciones en la oración ni palabras de doble sentido. «Falta» es siempre error de escritura, y «salida», la excursión.',
      ],
    },
  };
})());
