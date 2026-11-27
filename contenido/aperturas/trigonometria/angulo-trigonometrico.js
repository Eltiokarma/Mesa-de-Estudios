/*
 * Apertura de «Ángulo trigonométrico y sistemas de medida» (docs/metodo/apertura-pisa.md; criterio en
 * docs/metodo/entrada-pisa.md). El choque es el minutero de un reloj: de 7:00 a 8:15 empieza en el 12 y termina en el
 * 3, a un cuarto de vuelta, pero giró una vuelta y un cuarto, 450°. Lo que el alumno se lleva va en ficha.seLleva.
 * No adelanta la Predice de la idea 1 (el timón: 150° a la izquierda y 240° a la derecha dan −90°, por eso el texto no
 * escribe «90°» y dice «un cuarto de vuelta») ni la de la idea 2 (55ᵍ, complemento 40,5°); tampoco usa el timón, que
 * es el objeto de la idea 1, ni los números de sus misiones (60, 45, 63…). Colores de la unidad (cabecera de
 * contenido/teoria/trigonometria/angulo-trigonometrico.js): el giro y su medida en grados van en carmín (c-h); el
 * reloj, en tinta.
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const giro = t => ({ v: 'c-h', t });
  const r1 = n => Math.round(n * 10) / 10;
  const CY = 190, R = 72;
  // Punto a un ángulo φ (en grados) medido desde el 12, en el sentido de las agujas del reloj.
  const en = (cx, rho, phi) => [cx + rho * Math.sin(phi * Math.PI / 180), CY - rho * Math.cos(phi * Math.PI / 180)];
  // Recorrido del minutero en carmín: del 12 hasta φ, con el radio creciendo de r0 a rf para que las vueltas no se pisen.
  const recorrido = (cx, phiF, r0, rf) => {
    const pts = [];
    for (let i = 0; i <= 90; i++) { const f = phiF * i / 90; pts.push(en(cx, r0 + (rf - r0) * i / 90, f)); }
    const [xa, ya] = pts[pts.length - 2], [xb, yb] = pts[pts.length - 1];
    const g = Math.atan2(yb - ya, xb - xa), p = 15, a = 0.5;
    const q1 = [xb - p * Math.cos(g - a), yb - p * Math.sin(g - a)], q2 = [xb - p * Math.cos(g + a), yb - p * Math.sin(g + a)];
    return `<path d="M${pts.map(([x, y]) => `${r1(x)} ${r1(y)}`).join('L')}" fill="none" style="stroke:var(--c-h)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M${r1(xb + 4 * Math.cos(g))} ${r1(yb + 4 * Math.sin(g))}L${r1(q1[0])} ${r1(q1[1])}L${r1(q2[0])} ${r1(q2[1])}Z" style="fill:var(--c-h)"/>`;
  };
  // La esfera del reloj a las 8:15: el minutero en el 3 y el horario entre el 8 y el 9.
  const reloj = cx => {
    const marcas = Array.from({ length: 12 }, (_, i) => {
      const [x1, y1] = en(cx, R - 3, i * 30), [x2, y2] = en(cx, R - (i % 3 ? 10 : 16), i * 30);
      return `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}" stroke="currentColor" stroke-width="${i % 3 ? 2 : 3.5}" stroke-linecap="round"/>`;
    }).join('');
    const nums = [[0, '12'], [90, '3'], [180, '6'], [270, '9']].map(([f, t]) => {
      const [x, y] = en(cx, R - 26, f);
      return `<text x="${r1(x)}" y="${r1(y + 7)}" text-anchor="middle" font-size="20" font-weight="800" fill="currentColor">${t}</text>`;
    }).join('');
    const [hx, hy] = en(cx, 30, 247.5), [mx, my] = en(cx, 42, 90);
    return `<circle cx="${cx}" cy="${CY}" r="${R}" style="fill:var(--card)" stroke="currentColor" stroke-width="3.5"/>
      ${marcas}${nums}
      <line x1="${cx}" y1="${CY}" x2="${r1(hx)}" y2="${r1(hy)}" style="stroke:var(--muted)" stroke-width="6" stroke-linecap="round"/>
      <line x1="${cx}" y1="${CY}" x2="${r1(mx)}" y2="${r1(my)}" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
      <circle cx="${cx}" cy="${CY}" r="5" fill="currentColor"/>`;
  };
  const panel = (x0, titulo, phiF, r0, rf, rotulo, rx, ry, pie) => {
    const cx = x0 + 130;
    return `<text x="${cx}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      ${reloj(cx)}
      ${recorrido(cx, phiF, r0, rf)}
      <text x="${cx + rx}" y="${ry}" text-anchor="middle" font-size="22" font-weight="800" style="fill:var(--c-h);stroke:var(--card)" stroke-width="5" paint-order="stroke">${rotulo}</text>
      ${pie.map((l, i) => `<text x="${cx}" y="${336 + i * 26}" text-anchor="middle" font-size="22" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 386" width="520" height="386" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="376" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', 90, 88, 88, '¼ de vuelta', -68, 84, ['Del 12 al 3:', 'un cuarto de vuelta'])}
    ${panel(260, 'Lo que se mide', 450, 84, 104, '450°', -84, 84, ['De 7:00 a 8:15:', 'una vuelta y un cuarto'])}
  </svg>`;

  return {
    unidad: 'trigonometria.angulo-trigonometrico',
    titulo: '¿Cuánto gira el minutero si termina a solo un cuarto de vuelta de donde empezó?',
    parrafos: [
      ['Si sales de tu casa a las 7:00 y llegas al colegio a las 8:15, el minutero de tu reloj empieza apuntando al 12 y termina apuntando al 3. ',
        'El minutero da una vuelta entera cada hora, así que gira 6° por minuto, y en esos 75 minutos de camino giró en total:',
        { linea: ['75 × 6° = ', giro('450°')] }],
      ['En geometría, el ángulo entre dos rayos es la abertura que queda entre ellos, y entre el 12 y el 3 de un reloj hay ', giro('un cuarto de vuelta'), '. ',
        'Con esa idea, tu minutero habría girado lo mismo que si hubieras llegado a las 7:15, y la hora entera de viaje no aparecería en la cuenta. ',
        'Medir la abertura por el otro lado, del 3 al 12 pasando por el 6, tampoco alcanza, porque la abertura entre dos posiciones de la aguja nunca llega a una vuelta entera.'],
      ['La cuenta de 6° por minuto es la correcta, porque incluye las vueltas completas; la abertura, en cambio, solo mira dónde empieza y dónde termina la aguja, y no ve cuántas vueltas dio ni hacia qué lado giró. ',
        'Contar el giro entero, con sus vueltas y su sentido, es el trabajo del ángulo trigonométrico, el tema de esta unidad.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos relojes iguales que marcan las 8:15. Lo que predice la abertura entre el 12 y el 3: el minutero giró un cuarto de vuelta. Lo que se mide de 7:00 a 8:15: el minutero dio una vuelta entera y un cuarto más, 450°.',
    },
    pregunta: 'Si atrasas el reloj una hora y cuarto moviendo el minutero con la mano, ¿crees que su giro mide lo mismo que cuando el reloj avanza esa hora y cuarto por su cuenta?',
    ficha: {
      seLleva: 'Un ángulo puede medir un giro y no solo una abertura: el minutero que avanza una hora y cuarto gira una vuelta y un cuarto, aunque termine a un cuarto de vuelta de donde empezó.',
      alcance: 'Parcial (deducción propia con el marco de Matemática 2022: cantidad y cambio, medir un giro; el formalismo del signo y los sistemas de medida no entra en PISA).',
      choque: 'La abertura entre el 12 y el 3 predice un cuarto de vuelta, y el minutero giró 450° entre las 7:00 y las 8:15.',
      atajo: 'Medir la abertura por el otro lado (del 3 al 12 pasando por el 6) tampoco alcanza, porque ninguna abertura llega a una vuelta (se descarta en el párrafo 2). El mejor alumno sumaría una vuelta entera al cuarto de vuelta: ese atajo ya es el tema (un ángulo que pasa de una vuelta), así que se usa como puente y la entrada no lo desarma.',
      porVerificar: [
        'Ninguno medido: que el minutero gire 6° por minuto es exacto (360° en una hora), y 75 minutos dan 450°.',
      ],
      notas: [
        'El reloj gira en sentido horario, que en trigonometría es el negativo: el texto no lo dice, para no adelantar la idea 1; la pregunta abre el sentido (avanzar o atrasar el reloj) sin dar el signo.',
        'La figura no escribe 90° en el panel de la predicción (dice «¼ de vuelta»), porque 90 sale de la respuesta de la Predice de la idea 1 (−90°) y la prueba común lo atraparía.',
        'Doble revisión (27 nov): la comparación es justa (el mismo minutero, de 7:00 a 8:15, con la abertura y con el giro) y la predicción equivocada no es del alumno sino de la definición de ángulo de geometría, que sí trae del colegio. Pero ningún alumno cree que el minutero giró solo un cuarto de vuelta en una hora y cuarto, así que el párrafo 3 abría como si la abertura fuera su intuición. Ahora abre diciendo que la cuenta de 6° por minuto es la correcta, porque cuenta las vueltas, y que lo que se queda corto es la abertura (antes: «Una abertura solo mira dónde empieza…»).',
        'Revisión del Escribidor Escribano (27 nov): «ninguna abertura entre dos agujas» hablaba de dos agujas cuando el choque es una sola aguja en dos momentos; ahora dice «dos posiciones de la aguja». La última oración se acortó («con sus vueltas y su sentido»). La pregunta decía «cuando avanza solo», ambiguo (¿por sí solo o únicamente?); ahora dice «cuando el reloj avanza esa hora y cuarto por su cuenta».',
        'Tercera pasada (27 nov): el párrafo 1 saca a su línea 75 × 6° = 450° (antes «en esos 75 minutos giró 450°» en la oración). No se escribe 360° ÷ 60 para no poner el 60 de las misiones. En el párrafo 3, «La cuenta de 6° por minuto es la correcta, porque cuenta las vueltas» usaba «cuenta» en dos sentidos: ahora «porque incluye las vueltas completas».',
      ],
    },
  };
})());
