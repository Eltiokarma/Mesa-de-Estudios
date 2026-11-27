/*
 * Apertura de «Números primos y divisores» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * Doble revisión (27 nov): el salón de alumnos pasó a chupetines para las sorpresas de un cumpleaños, para que ninguna
 * persona sea «la que sobra». 18 chupetines se reparten en bolsitas iguales de cuatro maneras y 19, de ninguna; la
 * explicación trampa («19 es impar») se descarta con 21. No usa el 37, el 35 ni el 33 (boletos de la Predice 1), ni el
 * 23 (misión 1), el 11, el 14, el 15, el 30, el 40, el 48 o el 60 (respuestas y aciertos de otras ideas). Colores de la unidad: las
 * bolsitas (el envase) en turquesa (c-i) y el chupetín que sobra, en naranja (c-o).
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const grupo = t => ({ v: 'c-i', t }), sobra = t => ({ v: 'c-o', t });
  const r1 = n => Math.round(n * 10) / 10;

  // Fichas con los tamaños de bolsita que funcionan; las de la predicción, punteadas (se imaginan, no se comprueban).
  const TAM = [2, 3, 6, 9];
  const fichas = (cx, y, punteadas) => TAM.map((t, i) => {
    const x = cx - 2 * 40 + i * 40 + 6;
    return `<rect x="${x}" y="${y}" width="28" height="28" rx="14" style="fill:var(--card);stroke:var(--c-i)" stroke-width="2.5"${punteadas ? ' stroke-dasharray="4 3"' : ''}/>
      <text x="${x + 14}" y="${y + 19}" text-anchor="middle" font-size="${t > 9 ? 13 : 15}" font-weight="800" style="fill:var(--c-i)">${punteadas ? '?' : t}</text>`;
  }).join('');
  // 19 chupetines probando bolsitas de 3: seis bolsitas llenas y un chupetín suelto, en naranja.
  const intento = (cx, y) => {
    let s = '';
    for (let g = 0; g < 6; g++) {
      const gx = cx - 110 + (g % 3) * 64, gy = y + Math.floor(g / 3) * 46;
      s += `<rect x="${gx}" y="${gy}" width="56" height="38" rx="8" fill="none" style="stroke:var(--c-i)" stroke-width="2.5"/>`;
      for (let k = 0; k < 3; k++) s += `<circle cx="${r1(gx + 12 + k * 16)}" cy="${r1(gy + 19)}" r="6" fill="currentColor"/>`;
    }
    s += `<circle cx="${cx + 98}" cy="${y + 42}" r="8" style="fill:var(--c-o)"/>`;
    return s;
  };
  const panel = (x0, titulo, pred, pie) => {
    const cx = x0 + 130;
    return `<text x="${cx}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      <text x="${cx}" y="68" text-anchor="middle" font-size="20" font-weight="700" fill="currentColor">18 chupetines</text>
      ${fichas(cx, 80, false)}
      <text x="${cx}" y="146" text-anchor="middle" font-size="20" font-weight="700" fill="currentColor">19 chupetines</text>
      ${pred ? fichas(cx, 158, true) + `<text x="${cx}" y="222" text-anchor="middle" font-size="19" style="fill:var(--muted)">como con 18</text>`
        : `<text x="${cx}" y="180" text-anchor="middle" font-size="22" font-weight="800" style="fill:var(--c-o)">ninguna manera</text>` + intento(cx, 196)}
      ${pie.map((l, i) => `<text x="${cx}" y="${318 + i * 24}" text-anchor="middle" font-size="21" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 370" width="520" height="370" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="360" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', true, ['Un chupetín más:', 'casi lo mismo'])}
    ${panel(260, 'Lo que se mide', false, ['Un chupetín más:', 'siempre sobra alguno'])}
  </svg>`;

  return {
    unidad: 'aritmetica.numeros-primos-y-divisores',
    titulo: '¿Por qué 18 chupetines se reparten en bolsitas iguales y 19 no?',
    parrafos: [
      ['Para las sorpresas de un cumpleaños tienes 18 chupetines y quieres que todas las bolsitas lleven la misma cantidad, sin que sobre ninguno. ',
        'Puedes poner 2, 3, 6 o 9 en cada bolsita, así que tienes ', grupo('cuatro maneras'), ' de armar varias bolsitas con más de un chupetín. ',
        'Si en la tienda te dan uno de más y ahora tienes 19, no queda ninguna: salvo que pongas uno por bolsita o todos en una sola, con cualquier tamaño de bolsita ',
        sobra('sobra algún chupetín'), '.'],
      ['Con un chupetín más, lo esperable sería tener las mismas maneras que antes, o casi, porque 19 es apenas mayor que 18. ',
        'Si piensas que el problema es que 19 es impar, mira lo que pasa con 21 chupetines, que también es impar y aun así se reparten en 3 bolsitas de 7 o en 7 bolsitas de 3.'],
      ['Hay números que se dejan partir en grupos iguales de muchas maneras, como el 18, y otros, como el 19, que no se dejan partir de ninguna. ',
        'Por eso, cuando vas a comprar algo para repartirlo en partes iguales, conviene mirar los números que dividen a la cantidad y no qué tan grande es; de esos números trata el tema de los números primos y los divisores.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos dibujos iguales: arriba, los cuatro tamaños de bolsita que funcionan con 18 chupetines (2, 3, 6 y 9). Lo que predice la intuición: con 19 chupetines habría casi las mismas maneras. Lo que se mide: con 19 no hay ninguna; si se arman bolsitas de 3, queda un chupetín suelto.',
    },
    pregunta: 'Si compraras 20 chupetines, ¿de cuántos chupetines podrías armar cada bolsita para que todas lleven lo mismo y no sobre ninguno?',
    ficha: {
      seLleva: 'Para repartir algo en partes iguales importa qué números dividen a la cantidad, no qué tan grande es: 18 chupetines se reparten en bolsitas iguales de cuatro maneras y 19, de ninguna.',
      alcance: 'Sí, deducción propia (cantidad: estructura multiplicativa de los números, repartos en partes iguales).',
      choque: 'Un chupetín más parece no cambiar nada, y pasar de 18 a 19 deja sin ninguna manera de armar bolsitas iguales.',
      atajo: 'La explicación trampa: «19 es impar». Se descarta con 21, impar, que se reparte en bolsitas de 3 o de 7. La pregunta (20 = 2 × 2 × 5) obliga a buscar todos los divisores, no solo el 2.',
      porVerificar: [
        'Ninguno: las maneras de 18 (2, 3, 6 y 9) y que 19 es primo se comprobaron con cálculo.',
      ],
      notas: [
        'Tercera pasada (27 nov): sin ecuaciones en la oración ni palabras de doble sentido.',
        'Doble revisión (27 nov): el título decía «¿Por qué un alumno más puede arruinar todos los grupos de trabajo?» y el cuerpo contaba un salón de 36 alumnos al que llegaba un alumno nuevo. Gerson advirtió que pone a una persona como el problema y puede hacer sentir mal al alumno nuevo. Ahora el reparto es de chupetines para las sorpresas de un cumpleaños (18 y 19), la misma idea sin nadie que «sobre». Se cambiaron también los números: el 37 era un boleto de la Predice 1, y la apertura le adelantaba al alumno que 37 no se agrupa de ninguna manera; 18, 19, 20 y 21 no aparecen en ninguna Predice ni misión (se probó antes 42 y 43, pero 42 trae el 14, acierto de la misión 5). El párrafo 3 ahora dice dónde sirve la idea (elegir una cantidad para repartir), y el seLleva lo recoge.',
        'Las maneras de 18 se cuentan sin la bolsita de 1 ni la de 18 (cuatro: 2, 3, 6 y 9); el texto lo dice con «varias bolsitas con más de un chupetín» para 18 y con «salvo que pongas uno por bolsita o todos en una sola» para 19.',
        'La palabra «primo» aparece solo al final, en el nombre del tema, y no se le pega al 19: eso lo decide el alumno en la idea 1.',
        'La pregunta tiene respuesta corta (bolsitas de 2, 4, 5 o 10) y obliga a buscar divisores, la entrada de la idea 4.',
      ],
    },
  };
})());
