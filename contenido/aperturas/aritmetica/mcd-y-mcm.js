/*
 * Apertura de «MCD y MCM» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * El choque son las alarmas de dos remedios en el celular: un jarabe cada 6 horas y una pastilla cada 8, que empiezan
 * juntos a las 7 de la mañana y vuelven a sonar juntos a la misma hora del día siguiente. Si la pastilla pasa a ser
 * cada 9 horas, más espaciada, lo esperable es que tarden más en coincidir, y coinciden antes: a la 1 de la madrugada.
 * Segunda versión del choque (revisión del Escribidor Escribano, 27 nov): la primera mostraba que multiplicar los
 * tiempos y sumarlos no da la primera coincidencia, y eso desarmaba dos distractores de la Predice de la idea 2
 * (12 y 18: «216», producto, y «30», suma). Esta no multiplica ni suma nada. Lo que el alumno se lleva va en
 * ficha.seLleva. No se escriben 12, 18, 36, 48, 10, 20 ni 40 (respuestas y aciertos de Predice y misiones): las horas
 * van en la hora del reloj. Colores de la unidad: la coincidencia (el múltiplo común) en violeta (c-f); el jarabe en
 * turquesa (c-i) y la pastilla en tinta, que además se distinguen por la forma (círculo y cuadrado).
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const junta = t => ({ v: 'c-f', t });
  const r1 = n => Math.round(n * 10) / 10;

  // Líneas de tiempo de 36 horas desde las 7 de la mañana, con la misma escala en los dos paneles.
  const X0 = 34, ANCHO = 192, H = 36, hx = (x0, h) => r1(x0 + X0 + h / H * ANCHO);
  const banda = (x, y1, y2, punteada) => `<rect x="${r1(x - 15)}" y="${y1}" width="30" height="${y2 - y1}" rx="15" style="fill:var(--c-f)" fill-opacity="${punteada ? '.08' : '.16'}"/>
      <rect x="${r1(x - 15)}" y="${y1}" width="30" height="${y2 - y1}" rx="15" fill="none" style="stroke:var(--c-f)" stroke-width="3"${punteada ? ' stroke-dasharray="6 4"' : ''}/>`;
  // Una línea de tiempo: el jarabe arriba (círculos, cada 6 h) y la pastilla abajo (cuadrados, cada `cada` horas).
  // Si `cada` es null, la pastilla todavía no se dibuja (es lo que se predice, no lo que se ve).
  const linea = (x0, y, rotulo, cada, junto) => {
    const yj = y + 26, yp = y + 50;
    const jarabe = Array.from({ length: Math.floor(H / 6) + 1 }, (_, k) => `<circle cx="${hx(x0, 6 * k)}" cy="${yj}" r="7" style="fill:var(--c-i)"/>`).join('');
    const pastilla = cada ? Array.from({ length: Math.floor(H / cada) + 1 }, (_, k) => `<rect x="${r1(hx(x0, cada * k) - 6.5)}" y="${yp - 6.5}" width="13" height="13" fill="currentColor"/>`).join('') : '';
    const marca = junto === null
      ? banda(hx(x0, 30), yj - 16, yp + 16, true) + `<text x="${hx(x0, 30)}" y="${yp + 6}" text-anchor="middle" font-size="20" font-weight="800" style="fill:var(--c-f)">?</text>`
      : banda(hx(x0, junto), yj - 16, yp + 16, false);
    return `<text x="${x0 + 14}" y="${y}" font-size="18" font-weight="700" fill="currentColor">${rotulo}</text>
      ${marca}
      <line x1="${hx(x0, 0)}" y1="${yj}" x2="${hx(x0, H)}" y2="${yj}" style="stroke:var(--line)" stroke-width="2"/>
      <line x1="${hx(x0, 0)}" y1="${yp}" x2="${hx(x0, H)}" y2="${yp}" style="stroke:var(--line)" stroke-width="2"/>
      ${jarabe}${pastilla}`;
  };
  const panel = (x0, titulo, cada9, junto9, pie) => {
    const cx = x0 + 130;
    return `<text x="${cx}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      ${linea(x0, 70, 'pastilla cada 8 h', 8, 24)}
      ${linea(x0, 172, 'pastilla cada 9 h', cada9, junto9)}
      ${[0, 24].map(h => `<line x1="${hx(x0, h)}" y1="256" x2="${hx(x0, h)}" y2="266" stroke="currentColor" stroke-width="2"/>`).join('')}
      <text x="${hx(x0, 0) - 12}" y="286" text-anchor="start" font-size="16" style="fill:var(--muted)">7:00</text>
      <text x="${hx(x0, 24)}" y="286" text-anchor="middle" font-size="16" style="fill:var(--muted)">7:00 del otro día</text>
      ${pie.map((l, i) => `<text x="${cx}" y="${322 + i * 26}" text-anchor="middle" font-size="21" style="${i ? 'fill:var(--c-f);font-weight:800' : 'fill:var(--muted)'}">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 370" width="520" height="370" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="360" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', null, null, ['Con la pastilla de 9 h:', 'juntas más tarde'])}
    ${panel(260, 'Lo que se mide', 9, 18, ['Con la pastilla de 9 h:', 'juntas antes'])}
  </svg>`;

  return {
    unidad: 'aritmetica.mcd-y-mcm',
    titulo: '¿Por qué una pastilla que se toma menos seguido coincide antes con el jarabe?',
    parrafos: [
      ['El médico receta un jarabe cada 6 horas y una pastilla cada 8, y en la casa ponen dos alarmas en el celular que suenan juntas a las 7 de la mañana. ',
        'El jarabe vuelve a sonar a la 1 de la tarde, a las 7 de la noche y a la 1 de la madrugada, y la pastilla, a las 3 de la tarde y a las 11 de la noche. ',
        'Las dos vuelven a sonar juntas ', junta('a las 7 de la mañana del día siguiente'), '.'],
      ['Supón ahora que el médico cambia la pastilla por otra que se toma cada 9 horas, más espaciada que la primera. ',
        'Con las tomas más separadas, lo esperable es que las dos alarmas tarden más en encontrarse y no vuelvan a sonar juntas hasta pasadas las 7 de la mañana del día siguiente.'],
      ['La lista de alarmas dice otra cosa: la nueva pastilla suena a las 4 de la tarde y a la 1 de la madrugada, y a esa hora coincide con el jarabe, ',
        junta('seis horas antes'), ' que la pastilla de 8. ',
        'Cuándo vuelven a coincidir no depende solo de qué tan seguido suene cada alarma, sino de cómo encajan sus tiempos entre sí. ',
        'El tema del MCD y el MCM trata de encontrar esa primera coincidencia y también el trozo más largo que cabe justo en dos medidas.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos dibujos con la misma escala, de las 7 de la mañana al día siguiente. Arriba, en los dos, las alarmas del jarabe cada 6 horas (círculos) y de la pastilla cada 8 horas (cuadrados), que vuelven a sonar juntas a las 7 de la mañana del otro día. Abajo, la pastilla cada 9 horas. Lo que predice la intuición: con la pastilla más espaciada, las alarmas coinciden más tarde. Lo que se mide: coinciden antes, a la 1 de la madrugada.',
    },
    pregunta: 'Y si la pastilla fuera cada 7 horas, ¿crees que las dos alarmas volverían a sonar juntas antes o después que con la pastilla de 8?',
    ficha: {
      seLleva: 'Cuándo vuelven a coincidir dos cosas que se repiten no depende solo de qué tan seguido se repite cada una: una pastilla más espaciada puede coincidir antes con el jarabe.',
      alcance: 'Sí, deducción propia (cantidad y regularidades: ciclos que se repiten y su primera coincidencia).',
      choque: 'Con el jarabe cada 6 horas, una pastilla cada 9 horas, más espaciada que la de 8, hace esperar que las alarmas tarden más en coincidir, y coinciden a la 1 de la madrugada (a las 18 horas), seis horas antes que con la de 8 (a las 24).',
      atajo: 'Escribir la lista de alarmas resuelve cada caso, pero no explica por qué un tiempo más largo junta antes: eso depende de lo que comparten 6 y 9 (el 3) frente a 6 y 8 (el 2), que es el tema. Multiplicar o sumar los tiempos no aparece en el texto, para no desarmar los distractores de la Predice de la idea 2.',
      porVerificar: [
        'Que «cada 6 horas», «cada 8 horas» y «cada 9 horas» sean pautas de receta: las dos primeras son comunes (muchos analgésicos y antibióticos; de memoria); cada 9 horas es rara y aquí es un supuesto («Supón ahora»).',
      ],
      notas: [
        'Tercera pasada (27 nov): sin ecuaciones en la oración ni palabras de doble sentido.',
        'Doble revisión (27 nov): sin cambios. Las horas se recalcularon (6 y 8 vuelven a coincidir a las 24 horas; 6 y 9, a las 18, seis horas antes) y entre un caso y otro cambia una sola cosa, la pastilla, con el jarabe fijo. La predicción (más espaciada, coincide más tarde) es el razonamiento de «más es más» que de verdad hace un alumno. Queda dicho que cada 9 horas no es una receta común: el texto la presenta como supuesto («Supón ahora»).',
        'Revisión del Escribidor Escribano (27 nov), cambio de enfoque pedido en el encargo. Antes, el párrafo 2 decía «La cuenta rápida es multiplicar las 6 horas del jarabe por las 8 de la pastilla, que da dos días justos» y «Sumar las horas sirve menos todavía», y el 3, que la multiplicación «se salta» la primera coincidencia. La Predice de la idea 2 (12 y 18, respuesta 36) tiene como distractores el producto (216) y la suma (30): el alumno llegaba a predecir con esas dos dudas ya resueltas. Ahora el choque es otro, con las mismas alarmas: una pastilla más espaciada (cada 9 horas) coincide antes con el jarabe que la de 8. El texto no multiplica ni suma; el alumno se lleva que la primera coincidencia no depende solo de qué tan seguido se repite cada cosa.',
        'La pregunta (cada 7 horas) tiene respuesta: coinciden después, a las 42 horas, porque 6 y 7 no comparten nada; con eso el alumno ve que más espaciado no siempre junta antes. No se escribe 42 ni la cuenta. Abre la idea 2 sin decirla.',
        'El texto no escribe 12 (respuesta de la Predice 1), 36 (Predice 2) ni 18, 48, 10, 20 o 40 (datos y aciertos de misiones): las horas van como hora del reloj y «seis horas antes» va en palabras.',
      ],
    },
  };
})());
