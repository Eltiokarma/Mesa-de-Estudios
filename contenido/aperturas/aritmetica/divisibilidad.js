/*
 * Apertura de «Divisibilidad» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * El choque es el calendario: el 28 de julio cayó martes en 2026, cae miércoles en 2027 y viernes en 2028, aunque un
 * año «tenga 52 semanas». Lo que el alumno se lleva va en ficha.seLleva. La explicación trampa (que la fecha solo se
 * corre por los bisiestos) se descarta con 2026 y 2027, que no lo son. No adelanta la Predice de la idea 2 (5 pedidos
 * que dejan 4 sueltos cada uno, en bolsitas de 7) ni la misión del criterio del 11: el texto no hace cuentas de restos
 * ni nombra criterios. Colores de la unidad: las semanas completas (el envase de 7) en turquesa (c-i) y lo que sobra,
 * en naranja (c-o).
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const semana = t => ({ v: 'c-i', t }), sobra = t => ({ v: 'c-o', t });

  // Cada panel: una fila de la semana por año (L M M J V S D) con la casilla del 28 de julio marcada.
  const DIAS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'], W = 25, G = 3;
  const fila = (x0, y, anio, marcado) => `<text x="${x0 - 8}" y="${y + 19}" text-anchor="end" font-size="18" font-weight="700" fill="currentColor">${anio}</text>
      ${DIAS.map((d, i) => {
        const x = x0 + i * (W + G), m = i === marcado;
        return `<rect x="${x}" y="${y}" width="${W}" height="${W}" rx="5" style="${m ? 'fill:var(--c-o)' : 'fill:var(--card)'}" stroke="currentColor" stroke-width="${m ? 0 : 1.5}"/>
          ${m ? `<text x="${x + W / 2}" y="${y + 18}" text-anchor="middle" font-size="14" font-weight="800" style="fill:var(--card)">28</text>` : ''}`;
      }).join('')}`;
  const panel = (x0, titulo, marcas, pie) => {
    const cx = x0 + 130, xi = x0 + 60;
    return `<text x="${cx}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      <text x="${cx}" y="64" text-anchor="middle" font-size="19" style="fill:var(--muted)">28 de julio</text>
      ${DIAS.map((d, i) => `<text x="${xi + i * (W + G) + W / 2}" y="${102}" text-anchor="middle" font-size="15" font-weight="700" style="fill:var(--muted)">${d}</text>`).join('')}
      ${[2026, 2027, 2028].map((a, k) => fila(xi, 112 + k * 50, a, marcas[k])).join('')}
      ${pie.map((l, i) => `<text x="${cx}" y="${306 + i * 24}" text-anchor="middle" font-size="21" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 360" width="520" height="360" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="350" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', [1, 1, 1], ['52 semanas justas:', 'siempre martes'])}
    ${panel(260, 'Lo que se mide', [1, 2, 4], ['Martes, miércoles', 'y viernes'])}
  </svg>`;

  return {
    unidad: 'aritmetica.divisibilidad',
    titulo: '¿Por qué el 28 de julio no cae cada año el mismo día de la semana?',
    parrafos: [
      ['En 2026, el 28 de julio cayó martes; en 2027 caerá miércoles, y en 2028, viernes, sin pasar por el jueves. ',
        'Puedes comprobarlo en el calendario de tu celular con cualquier fecha, por ejemplo con tu cumpleaños, que tampoco cae cada año el mismo día.'],
      ['Se suele decir que un año tiene ', semana('52 semanas'), ', y cada semana repite los mismos siete días en el mismo orden. ',
        'Si el año fuera de 52 semanas justas, el calendario de cada año sería una copia del anterior y el 28 de julio caería martes todos los años. ',
        'Echarle la culpa al año bisiesto tampoco basta, porque 2026 y 2027 no son bisiestos y la fecha se corrió igual.'],
      ['Las 52 semanas, de siete días cada una, suman 364 días:',
        { linea: [semana('52'), ' × 7 = 364'] },
        'pero un año normal tiene 365, así que el año no se deja repartir justo en semanas completas: ',
        sobra('algo queda afuera'), '. ',
        'Saber qué queda afuera cuando agrupas de siete en siete, o en grupos de cualquier tamaño, sin hacer la división completa, es el tema de la divisibilidad.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos calendarios iguales, con una fila de la semana para 2026, 2027 y 2028 y el 28 de julio marcado. Lo que predice la cuenta de 52 semanas justas: martes los tres años. Lo que se mide: martes en 2026, miércoles en 2027 y viernes en 2028.',
    },
    pregunta: 'Si hoy es martes, ¿qué día de la semana será dentro de 100 días, y cómo lo averiguarías sin contarlos uno por uno?',
    ficha: {
      seLleva: 'Un año no cabe justo en semanas completas, porque 52 semanas son 364 días y el año tiene 365, y por eso el calendario no se repite igual de un año al otro.',
      alcance: 'Sí, deducción propia (cantidad y regularidades: restos, ciclos y calendarios).',
      choque: 'Las 52 semanas predicen que el 28 de julio cae martes todos los años, y cae martes, miércoles y viernes.',
      atajo: 'La explicación trampa es que la fecha solo se corre por los bisiestos; se descarta porque de 2026 a 2027, sin bisiesto, también se corre. El salto doble a 2028 (del miércoles al viernes) sí es del 29 de febrero, y el texto lo muestra sin explicarlo: queda para quien lea la idea de los restos.',
      porVerificar: [
        'Días de la semana del 28 de julio de 2026, 2027 y 2028 (martes, miércoles y viernes): calculados con el calendario gregoriano en Node, no de memoria.',
      ],
      notas: [
        'Tercera pasada (27 nov): la cuenta de las semanas del párrafo 3 salió a su línea (52 × 7 = 364, el 52 con el color de las semanas). Lo que sobra (365 − 364) no se escribe como cuenta, porque el texto lo deja en «algo queda afuera». Sin palabras de doble sentido.',
        'Doble revisión (27 nov): el párrafo 2 decía «Un año tiene 52 semanas» y «cualquiera esperaría que el calendario se repitiera exactamente igual», justo después de que el párrafo 1 recordara que el cumpleaños no cae cada año el mismo día: nadie espera eso, y era un muñeco de paja. Ahora el párrafo 2 parte de lo que de verdad se dice («se suele decir que un año tiene 52 semanas») y saca la consecuencia como condición («si el año fuera de 52 semanas justas…»): el choque es entre ese dicho y lo que el alumno ya vio en el calendario. Las fechas se recalcularon (martes, miércoles y viernes) y la figura no cambia.',
        'Revisión del Escribidor Escribano (27 nov): el párrafo 3 decía «un día queda afuera, sin completar otra semana, y ese día es el que empuja la fecha». Eso ya es la regla de la idea 2 («al operar, mandan los sueltos») aplicada al choque, y con ella la pregunta de los 100 días sale sin pensar. Ahora el párrafo deja el hecho (364 contra 365: el año no cabe en semanas completas y algo queda afuera) y no dice que lo que sobra empuja la fecha ni cuánto la empuja; eso queda para la pregunta y la idea 2. También se cambió «igualito», que es coloquial, por «exactamente igual». El seLleva se ajustó a lo que ahora dice el texto.',
        'La pregunta se resuelve con el resto de 100 entre 7 (2: jueves) y abre la idea 2 sin sus números. No es una Predice ni tiene opciones.',
      ],
    },
  };
})());
