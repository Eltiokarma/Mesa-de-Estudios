/*
 * Apertura de «Numeración» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * El choque es el recreo del colegio: de las 9:50 a las 10:10 pasan 20 minutos, y la resta de siempre (1010 − 950)
 * da 60, porque da por hecho grupos de diez cuando el reloj junta sesenta minutos para formar una hora. Lo que el
 * alumno se lleva va en ficha.seLleva. No adelanta la Predice de la idea 1 (44 en base 5 más uno), la de la idea 2
 * (203 en base 5) ni sus misiones: no se escribe ninguna etiqueta en base 5 ni en base 6. Colores de la unidad: lo que
 * dura (la cantidad) en violeta (c-f) y los 60 minutos que forman una hora (la base) en turquesa (c-i).
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const dura = t => ({ v: 'c-f', t }), base = t => ({ v: 'c-i', t });
  const r1 = n => Math.round(n * 10) / 10;
  const rad = m => (m / 60 * 360 - 90) * Math.PI / 180; // minuto del reloj → ángulo en el SVG
  const pt = (cx, cy, r, m) => [r1(cx + r * Math.cos(rad(m))), r1(cy + r * Math.sin(rad(m)))];

  // Un reloj con su minutero en el 10 (las 10:10) y, por fuera, el tramo que dura el recreo según cada cuenta.
  const CY = 150, R = 70, RA = 88;
  const reloj = (cx, minutos) => {
    const marcas = Array.from({ length: 12 }, (_, i) => {
      const [x1, y1] = pt(cx, CY, R - (i % 3 ? 7 : 12), i * 5), [x2, y2] = pt(cx, CY, R - 2, i * 5);
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="currentColor" stroke-width="${i % 3 ? 2 : 3.5}" stroke-linecap="round"/>`;
    }).join('');
    const [mx, my] = pt(cx, CY, R - 16, 10), [hx, hy] = pt(cx, CY, R - 34, 50.8);
    // El tramo empieza en el minuto 50 y avanza en el sentido del reloj; si es de 60 minutos, da la vuelta entera.
    const ini = pt(cx, CY, RA, 50), fin = pt(cx, CY, RA, 50 + minutos - 1.6);
    const arco = minutos >= 60
      ? `<path d="M${ini[0]} ${ini[1]}A${RA} ${RA} 0 1 1 ${pt(cx, CY, RA, 20)[0]} ${pt(cx, CY, RA, 20)[1]}A${RA} ${RA} 0 0 1 ${fin[0]} ${fin[1]}" fill="none" style="stroke:var(--c-f)" stroke-width="7" stroke-linecap="round"/>`
      : `<path d="M${ini[0]} ${ini[1]}A${RA} ${RA} 0 0 1 ${fin[0]} ${fin[1]}" fill="none" style="stroke:var(--c-f)" stroke-width="7" stroke-linecap="round"/>`;
    // Punta de flecha al final del tramo, tangente al círculo.
    const g = rad(50 + minutos), [px, py] = pt(cx, CY, RA, 50 + minutos);
    const t = [-Math.sin(g), Math.cos(g)], n = [Math.cos(g), Math.sin(g)];
    const punta = `<path d="M${px} ${py}L${r1(px - 15 * t[0] + 8 * n[0])} ${r1(py - 15 * t[1] + 8 * n[1])}L${r1(px - 15 * t[0] - 8 * n[0])} ${r1(py - 15 * t[1] - 8 * n[1])}Z" style="fill:var(--c-f)"/>`;
    const [sx, sy] = pt(cx, CY, RA, 50);
    return `<circle cx="${cx}" cy="${CY}" r="${R}" style="fill:var(--card)" stroke="currentColor" stroke-width="3"/>
      ${marcas}
      <line x1="${cx}" y1="${CY}" x2="${hx}" y2="${hy}" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>
      <line x1="${cx}" y1="${CY}" x2="${mx}" y2="${my}" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
      <circle cx="${cx}" cy="${CY}" r="5" fill="currentColor"/>
      ${arco}${punta}
      <circle cx="${sx}" cy="${sy}" r="6" style="fill:var(--c-f)"/>`;
  };
  const panel = (x0, titulo, minutos, pie) => {
    const cx = x0 + 130;
    return `<text x="${cx}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      ${reloj(cx, minutos)}
      <text x="${cx}" y="276" text-anchor="middle" font-size="21" font-weight="700" fill="currentColor">de 9:50 a 10:10</text>
      <text x="${cx}" y="314" text-anchor="middle" font-size="30" font-weight="800" style="fill:var(--c-f)">${minutos} min</text>
      ${pie.map((l, i) => `<text x="${cx}" y="${352 + i * 24}" text-anchor="middle" font-size="21" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 400" width="520" height="400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="390" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', 60, ['La resta:', '1010 − 950'])}
    ${panel(260, 'Lo que se mide', 20, ['El reloj:', 'el recreo'])}
  </svg>`;

  return {
    unidad: 'aritmetica.numeracion',
    titulo: '¿Por qué la resta de las horas da 60 si el recreo dura 20 minutos?',
    parrafos: [
      ['Supón que en tu colegio el recreo empieza a las 9:50 y termina a las 10:10. ',
        'Si miras el reloj, ves que dura ', dura('20 minutos'),
        ': diez hasta que marca las diez y otros diez después, y un cronómetro lo confirma.'],
      ['Si quitas los dos puntos y restas las horas como cualquier par de números, 1010 menos 950 da ', dura('60'),
        ', que en minutos sería una hora entera, el triple de lo que dura el recreo. ',
        'Leer las horas con coma tampoco ayuda, porque la calculadora haría 10,10 menos 9,50 y daría 0,6 de hora, más de la mitad de una hora.'],
      ['Las dos cuentas agrupan de diez en diez, como los números de siempre, y tratan la hora como si tuviera cien minutos, pero en el reloj una hora se forma con ',
        base('60 minutos'), '. ',
        'Una cifra vale según cuántas unidades se juntan para formar el grupo de al lado, y ese tamaño no es diez en todas partes: de esa idea trata el tema de los sistemas de numeración.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos relojes iguales que marcan las 10:10, con el tramo que dura el recreo desde las 9:50. Lo que predice la resta 1010 menos 950: el tramo da la vuelta entera, 60 minutos. Lo que se mide en el reloj: el tramo cubre un tercio de la vuelta, 20 minutos.',
    },
    pregunta: 'En la calculadora, 975 es un número como cualquier otro. ¿Por qué crees que en un reloj nunca vas a ver las 9:75?',
    ficha: {
      seLleva: 'Una cifra no vale lo mismo en todas partes: en el reloj, 60 minutos forman una hora, y por eso las horas no se restan como los números de siempre.',
      alcance: 'Parcial, deducción propia (cantidad: el valor de posición y los sistemas que agrupan distinto, como el reloj).',
      choque: 'La resta 1010 − 950 predice 60 minutos de recreo y el reloj mide 20.',
      atajo: 'Leer la hora con coma decimal (10,10 − 9,50 = 0,6 h, unos 36 minutos), que también agrupa de diez en diez. Pasar todo a minutos sí resuelve la cuenta, pero eso ya es usar que 60 minutos forman una hora, que es la idea del tema: cada lugar vale según el tamaño del grupo.',
      porVerificar: [
        'Que un recreo de 20 minutos, de 9:50 a 10:10, sea un horario plausible en un colegio peruano (es un ejemplo: «supón que»; los horarios varían por colegio y por turno).',
      ],
      notas: [
        'Los 36 minutos del atajo no van al texto: la misión de la idea 2 dice «la caja ya guarda 36» y la prueba común lo marcaría como valor de la unidad. El texto dice «más de la mitad de una hora».',
        'Revisión del Escribidor Escribano (27 nov): el párrafo 3 decía que las cuentas tratan «los minutos como si diez de ellos formaran el grupo siguiente», y eso también pasa en el reloj (diez minutos hacen una decena de minutos); lo que de verdad suponen la resta y la coma es una hora de cien minutos, y ahora lo dice. Se cambió «Por eso la misma cifra no vale lo mismo en todas partes», cuyo «por eso» no salía de lo anterior, y «Cualquiera que lo haya vivido sabe» por «Si miras el reloj, ves». «Cien» va en letras para no escribir el 100 de la Predice 1 (100 en base 5).',
        'La pregunta se puede responder con el párrafo 3 (a los 60 minutos la hora sube en uno, así que los minutos nunca pasan de 59) y abre la idea 1, «¿Por qué en base 5 no existe la cifra 5?», sin decirla.',
      ],
    },
  };
})());
