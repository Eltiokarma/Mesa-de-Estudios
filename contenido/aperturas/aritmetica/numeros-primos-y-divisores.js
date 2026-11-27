/*
 * Apertura de «Números primos y divisores» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * El choque es el salón de clases: 36 alumnos se reparten en grupos de trabajo iguales de siete maneras, y con un alumno
 * más, 37, de ninguna. La explicación trampa («37 es impar») se descarta con un salón de 45. Lo que el alumno se lleva va
 * en ficha.seLleva. No adelanta la Predice de la idea 1 (cuántos boletos de 1, 2, 33, 35 y 37 son primos) ni la misión
 * de la idea 1 (el número entre 20 y 28 que solo va en una fila): el texto no dice «primo» del 37 y no usa el 35 (sesión, 27 nov: el salón de 35 pasó a 45), y no usa
 * el 23. Colores de la unidad: los grupos (el envase) en turquesa (c-i) y el alumno que sobra, en naranja (c-o).
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const grupo = t => ({ v: 'c-i', t }), sobra = t => ({ v: 'c-o', t });
  const r1 = n => Math.round(n * 10) / 10;

  // Fichas con los tamaños de grupo que funcionan; las de la predicción, punteadas (se imaginan, no se comprueban).
  const TAM = [2, 3, 4, 6, 9, 12, 18];
  const fichas = (cx, y, punteadas) => TAM.map((t, i) => {
    const x = cx - 3.5 * 32 + i * 32 + 2;
    return `<rect x="${x}" y="${y}" width="28" height="28" rx="14" style="fill:var(--card);stroke:var(--c-i)" stroke-width="2.5"${punteadas ? ' stroke-dasharray="4 3"' : ''}/>
      <text x="${x + 14}" y="${y + 19}" text-anchor="middle" font-size="${t > 9 ? 13 : 15}" font-weight="800" style="fill:var(--c-i)">${punteadas ? '?' : t}</text>`;
  }).join('');
  // 37 alumnos probando grupos de 6: seis grupos llenos y uno solo, en naranja.
  const intento = (cx, y) => {
    let s = '';
    for (let g = 0; g < 6; g++) {
      const gx = cx - 110 + (g % 3) * 64, gy = y + Math.floor(g / 3) * 46;
      s += `<rect x="${gx}" y="${gy}" width="56" height="38" rx="8" fill="none" style="stroke:var(--c-i)" stroke-width="2.5"/>`;
      for (let k = 0; k < 6; k++) s += `<circle cx="${r1(gx + 11 + (k % 3) * 17)}" cy="${r1(gy + 11 + Math.floor(k / 3) * 16)}" r="6" fill="currentColor"/>`;
    }
    s += `<circle cx="${cx + 98}" cy="${y + 42}" r="8" style="fill:var(--c-o)"/>`;
    return s;
  };
  const panel = (x0, titulo, pred, pie) => {
    const cx = x0 + 130;
    return `<text x="${cx}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      <text x="${cx}" y="68" text-anchor="middle" font-size="20" font-weight="700" fill="currentColor">36 alumnos</text>
      ${fichas(cx, 80, false)}
      <text x="${cx}" y="146" text-anchor="middle" font-size="20" font-weight="700" fill="currentColor">37 alumnos</text>
      ${pred ? fichas(cx, 158, true) + `<text x="${cx}" y="222" text-anchor="middle" font-size="19" style="fill:var(--muted)">como con 36</text>`
        : `<text x="${cx}" y="180" text-anchor="middle" font-size="22" font-weight="800" style="fill:var(--c-o)">ninguna manera</text>` + intento(cx, 196)}
      ${pie.map((l, i) => `<text x="${cx}" y="${318 + i * 24}" text-anchor="middle" font-size="21" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 370" width="520" height="370" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="360" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', true, ['Un alumno más:', 'casi lo mismo'])}
    ${panel(260, 'Lo que se mide', false, ['Un alumno más:', 'siempre sobra alguien'])}
  </svg>`;

  return {
    unidad: 'aritmetica.numeros-primos-y-divisores',
    titulo: '¿Por qué un alumno más puede arruinar todos los grupos de trabajo?',
    parrafos: [
      ['En un salón de 36 alumnos, el profesor puede armar grupos de trabajo del mismo tamaño de ', grupo('siete maneras'),
        ': grupos de 2, 3, 4, 6, 9, 12 o 18, sin que nadie se quede fuera. ',
        'Si llega un alumno nuevo y el salón pasa a 37, no queda ninguna, porque con grupos de cualquier tamaño, menos el de todo el salón junto, ',
        sobra('sobra alguien'), '.'],
      ['Con un alumno más, lo esperable sería tener las mismas maneras que antes, o casi, porque uno entre 36 parece un cambio pequeño. ',
        'Si piensas que el problema es que 37 es impar, mira un salón de 45, que también es impar y aun así se arma en 5 grupos de 9 o en 9 grupos de 5.'],
      ['Hay números que se dejan partir en grupos iguales de muchas maneras, como el 36, y otros, como el 37, que no se dejan partir de ninguna. ',
        'Cuántas maneras hay no depende de qué tan grande sea el número, sino de los números que lo dividen, y de esos números trata el tema de los números primos y los divisores.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos dibujos iguales: arriba, los siete tamaños de grupo que funcionan con 36 alumnos (2, 3, 4, 6, 9, 12 y 18). Lo que predice la intuición: con 37 alumnos habría casi las mismas maneras. Lo que se mide: con 37 no hay ninguna; si se arman grupos de 6, queda un alumno solo.',
    },
    pregunta: 'Si el salón tuviera 38 alumnos, ¿de qué tamaños podría el profesor armar grupos iguales, sin que nadie trabaje solo ni se quede fuera?',
    ficha: {
      seLleva: 'Que algo se pueda repartir en grupos iguales no depende de su tamaño sino de sus divisores: 36 alumnos se agrupan de siete maneras y 37, de ninguna.',
      alcance: 'Sí, deducción propia (cantidad: estructura multiplicativa de los números, repartos en partes iguales).',
      choque: 'Un alumno más parece no cambiar nada, y pasar de 36 a 37 alumnos deja sin ninguna manera de armar grupos iguales.',
      atajo: 'La explicación trampa: «37 es impar». Se descarta con 45, impar, que se arma en grupos de 5 o de 9. El caso de los pares no basta tampoco, porque el texto no lo necesita: la pregunta (38 = 2 × 19) muestra que un par puede tener muy pocas maneras.',
      porVerificar: [
        'Que un salón de secundaria del Perú tenga entre 36 y 45 alumnos (es plausible en colegios públicos de ciudad; no se afirma en el texto, que solo dice «un salón de 36»).',
      ],
      notas: [
        'Las maneras de 36 se cuentan sin el grupo de 1 ni el de 36 (siete: 2, 3, 4, 6, 9, 12 y 18); el texto lo dice con «menos el de todo el salón junto» para 37, y con «sin que nadie se quede fuera» para 36.',
        'La palabra «primo» aparece solo al final, en el nombre del tema, y no se le pega al 37: eso lo decide el alumno en la idea 1.',
        'Revisión del Escribidor Escribano (27 nov): «Si alguien piensa…, basta mirar» pasó a de tú («Si piensas…, mira»); «qué tan grande es» pasó a «sea», y la pregunta dice «sin que nadie trabaje solo ni se quede fuera», que se entiende mejor que «de más de un alumno».',
        'Contenido (resuelto por la sesión, 27 nov: el salón de 35 pasó a 45): la Predice de la idea 1 pregunta cuántos de los boletos 1, 2, 33, 35 y 37 son primos (respuesta 2). La apertura no dice «primo», pero muestra que 37 no se agrupa de ninguna manera y que 35 sí (5 × 7), y descarta con esas palabras el error «impar» (opción de 4 boletos). El alumno llega a la Predice con dos de los cinco boletos ya resueltos y un distractor desarmado. El 37 es el choque y no se puede quitar; si Gerson quiere cuidar la Predice, el salón de la trampa puede ser de 39 (3 grupos de 13) en vez de 35, o la Predice puede cambiar el 35 y el 37 por otros boletos (por ejemplo, 39 y 41).',
        'La pregunta tiene respuesta corta (grupos de 2 o de 19) y obliga a buscar divisores, la entrada de la idea 4.',
      ],
    },
  };
})());
