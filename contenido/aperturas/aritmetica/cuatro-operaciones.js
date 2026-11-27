/*
 * Apertura de «Cuatro operaciones» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * El choque es el recibo de luz: el medidor de ruedas marcaba 9870 y ahora marca 0125, menos que antes, y el recibo
 * cobra 255 kWh. La resta de siempre da un número negativo y la resta al revés, 9745 kWh; ninguna cuenta lo que pasó
 * (el medidor dio la vuelta). Lo que el alumno se lleva va en ficha.seLleva. No adelanta la Predice de la idea 3
 * (complemento aritmético de 4073) ni su misión (260 para llenar el cajón): el texto dice que el medidor volvió a
 * ceros, no cómo se cuenta lo que le faltaba; eso queda para la pregunta. Colores de la unidad: el consumo, que es lo
 * que se busca, en violeta (c-f).
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const consumo = t => ({ v: 'c-f', t });

  // Un medidor de cuatro ruedas: cada cifra en su ventanita.
  const medidor = (cx, y, cifras, rotulo) => {
    const w = 30, h = 40, x0 = cx - 2 * w - 3;
    return `<text x="${cx}" y="${y - 10}" text-anchor="middle" font-size="18" style="fill:var(--muted)">${rotulo}</text>
      <rect x="${x0 - 8}" y="${y - 4}" width="${4 * w + 6 + 16}" height="${h + 8}" rx="8" style="fill:var(--card)" stroke="currentColor" stroke-width="3"/>
      ${[...cifras].map((c, i) => `<rect x="${x0 + i * (w + 2)}" y="${y}" width="${w}" height="${h}" rx="3" fill="currentColor"/>
      <text x="${x0 + i * (w + 2) + w / 2}" y="${y + 30}" text-anchor="middle" font-size="26" font-weight="800" style="fill:var(--card)">${c}</text>`).join('')}`;
  };
  // Dos paneles con la misma escala: la barra del consumo, de 0 a 9745 kWh en 150 unidades de alto.
  const BASE = 352, ESC = 125 / 9745;
  const panel = (x0, titulo, kwh, rotulo, pie) => {
    const cx = x0 + 130, h = Math.max(4, Math.round(kwh * ESC * 10) / 10);
    return `<text x="${cx}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      ${medidor(cx, 72, '9870', 'mes pasado')}
      ${medidor(cx, 144, '0125', 'este mes')}
      <line x1="${cx - 70}" y1="${BASE}" x2="${cx + 70}" y2="${BASE}" stroke="currentColor" stroke-width="2.5"/>
      <rect x="${cx - 30}" y="${Math.round((BASE - h) * 10) / 10}" width="60" height="${h}" style="fill:var(--c-f)" fill-opacity=".85"/>
      <text x="${cx}" y="${Math.round((BASE - h - 10) * 10) / 10}" text-anchor="middle" font-size="24" font-weight="800" style="fill:var(--c-f)">${rotulo}</text>
      ${pie.map((l, i) => `<text x="${cx}" y="${384 + i * 24}" text-anchor="middle" font-size="21" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 430" width="520" height="430" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="420" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', 9745, '9745 kWh', ['La resta al revés:', 'más de cinco años'])}
    ${panel(260, 'Lo que se mide', 255, '255 kWh', ['El recibo:', 'un mes de luz'])}
  </svg>`;

  return {
    unidad: 'aritmetica.cuatro-operaciones',
    titulo: '¿Cómo puede un medidor de luz marcar menos que el mes pasado?',
    parrafos: [
      ['En el recibo de luz aparecen dos lecturas del medidor, la del mes pasado y la de este mes, y el consumo en kilovatios hora (kWh) sale de comparar las dos. ',
        'Un medidor antiguo, de cuatro ruedas con números, marcaba 9870 el mes pasado y este mes marca 0125, menos que antes, aunque en la casa nadie dejó de prender la luz. ',
        'El recibo, sin embargo, cobra ', consumo('255 kWh'), ', un consumo normal para un mes.'],
      ['La resta de siempre, la lectura nueva menos la vieja, da un número negativo:',
        { linea: ['125 − 9870 = −9745'] },
        'Un consumo negativo querría decir que la casa le devolvió luz a la empresa. ',
        'Si restas al revés, el mayor menos el menor, el consumo sale enorme:',
        { linea: ['9870 − 125 = ', consumo('9745 kWh')] },
        'Es lo que una casa que gasta unos 150 kWh al mes consumiría en más de cinco años.'],
      ['Ninguna de las dos restas refleja lo que pasó en el medidor, que llegó a 9999, volvió a 0000 y siguió contando, como el cuentakilómetros de un auto viejo. ',
        'Sumar, restar, multiplicar y dividir parecen cuentas sabidas desde la primaria, pero cada una esconde lo que pasa dentro de las cifras, como lo que se lleva, lo que se presta o lo que le falta a un número para completar una vuelta; de eso trata el tema de las cuatro operaciones.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos dibujos iguales de un medidor de luz que marcaba 9870 el mes pasado y marca 0125 este mes, con una barra del consumo en la misma escala. Lo que predice la resta al revés: una barra altísima de 9745 kWh, más de cinco años de luz. Lo que se mide en el recibo: una barra baja de 255 kWh, un mes.',
    },
    pregunta: 'Con las lecturas 9870 y 0125, ¿cuántos kWh contó el medidor hasta volver a 0000, y cuántos después?',
    ficha: {
      seLleva: 'Antes de restar dos lecturas hay que saber qué cuentan: si un contador da la vuelta y vuelve a ceros, la resta de siempre da un consumo imposible.',
      alcance: 'Sí, deducción propia (cantidad: operar con sentido y juzgar si un resultado es razonable en su contexto).',
      choque: 'La resta de las lecturas predice un consumo negativo o de 9745 kWh, y el recibo cobra 255 kWh.',
      atajo: 'Restar al revés (el mayor menos el menor), que da 9745 kWh, lo de más de cinco años. Lo que sí resuelve la cuenta es sumar lo que le faltaba al medidor para dar la vuelta (130) y lo que marcó después (125): es el complemento aritmético de la idea 3, y por eso no va en el texto sino en la pregunta.',
      porVerificar: [
        'Que los recibos de luz del Perú muestren la lectura anterior, la actual y el consumo en kWh (Luz del Sur, Enel y las distribuidoras regionales; de memoria).',
        'Que haya en uso medidores electromecánicos de ruedas que dan la vuelta a ceros; los reales suelen tener cinco o seis ruedas, no cuatro: aquí son cuatro para que la cuenta sea corta.',
        'Consumo típico de una casa peruana: unos 150 kWh al mes (de memoria; varía mucho entre Lima, la sierra y la selva). Con él, 9745 kWh son unos 65 meses, más de cinco años.',
      ],
      notas: [
        'Tercera pasada (27 nov): las dos restas del párrafo 2 salieron a su línea (125 − 9870 = −9745 y 9870 − 125 = 9745 kWh, esta con el color del consumo). En el párrafo 3, «Ninguna de las dos restas cuenta lo que pasó» → «refleja lo que pasó», porque en el mismo párrafo «cuentas» es la de calcular y «siguió contando» la del medidor. La cuenta de 130 + 125 no se escribe: es la respuesta de la pregunta.',
        'Doble revisión (27 nov): sin cambios. Las cuentas cuadran (de 9870 a 10 000 faltan 130, y 130 + 125 = 255; 125 − 9870 es negativo; 9870 − 125 = 9745), las tres cuentas hablan de las mismas dos lecturas y la resta de siempre es el procedimiento que el alumno aplica tal cual a un recibo. La salida (el medidor dio la vuelta, como un cuentakilómetros) es intuitiva y el texto la dice sin fabricar sorpresa; la pregunta la pone a trabajar.',
        'La pregunta pide partir el consumo en dos tramos: lo que faltaba para llegar a 10 000 y lo que vino después. Es la entrada del complemento aritmético (idea 3) sin decir su nombre ni su cuenta. No se escribe 130 ni 260 en lo que ve el alumno.',
        'Revisión del Escribidor Escribano (27 nov): el párrafo 3 cerraba la serie «lo que se lleva, lo que se presta y lo que falta…» con otra «y de eso trata», que se lee como un cuarto miembro; ahora la serie cierra con punto y coma. Lo demás no cambió: el choque se entiende sin saber el tema y la pregunta se puede intentar contando con los dedos.',
        'El 255 del recibo no es una medición propia: sale de 130 + 125 y se presenta como lo que cobra el recibo.',
      ],
    },
  };
})());
