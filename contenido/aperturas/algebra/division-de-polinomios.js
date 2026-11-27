/*
 * Apertura de «División de polinomios y cocientes notables» (docs/metodo/apertura-pisa.md; criterio en
 * docs/metodo/entrada-pisa.md). Cuarta versión (27 nov), investigada de nuevo: Gerson rechazó el queque (25 trozos entre
 * 6 personas y 100 entre 11), porque cambiaba el divisor de un ejemplo al otro para fabricar la sorpresa. Esta parte de
 * una sola pirámide de dinero con una sola regla (cada persona trae a 3) en los dos paneles: la promesa dice que todos
 * cobran y, cuando se detiene después de tres rondas, 27 de 40 no cobran. El total 1 + 3 + 9 + 27 es el polinomio
 * 1 + x + x² + x³ con x = 3, que sale de dividir x⁴ − 1 entre x − 1 (un cociente notable, idea 6). Lo que el alumno se
 * lleva va en ficha.seLleva. No adelanta ninguna Predice (grado 4 del cociente, 3x², resto 7, 2x, resto 3, 8x²) ni los
 * valores de las misiones (el 17 de Ruffini, el 9984 y el 1248 de la calculadora). Colores de la unidad (cabecera de
 * contenido/teoria/algebra/division-de-polinomios.js): el divisor en turquesa (c-i) y el cociente, aquí el total de la
 * pirámide, en violeta (c-f). No hay resto (la división es exacta), así que el naranja no aparece.
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const divisor = t => ({ v: 'c-i', t }), cociente = t => ({ v: 'c-f', t });

  // Una persona de la pirámide: llena (violeta) si cobra, hueca si pagó y no trajo a nadie.
  const persona = (x, y, r, cobra) => cobra
    ? `<circle cx="${x}" cy="${y}" r="${r}" style="fill:var(--c-f);stroke:var(--c-f)" fill-opacity=".75" stroke-width="1.5"/>`
    : `<circle cx="${x}" cy="${y}" r="${r}" style="fill:var(--card)" stroke="currentColor" stroke-width="2"/>`;
  // La pirámide de tres rondas, la misma en los dos paneles: 1 arriba, 3, 9 y, debajo de cada una de las 9, sus 3.
  // `cobranTodos`: lo que promete la pirámide; si no, las 27 de la última ronda quedan huecas.
  const piramide = (cx, cobranTodos) => {
    const y0 = 66, y1 = 106, y2 = 148, y3 = [186, 204, 222];
    const x1 = [-70, 0, 70].map(d => cx + d), x2 = Array.from({ length: 9 }, (_, i) => cx + (i - 4) * 26);
    let s = '';
    for (const x of x1) s += `<line x1="${cx}" y1="${y0}" x2="${x}" y2="${y1}" style="stroke:var(--line)" stroke-width="2"/>`;
    x2.forEach((x, i) => { s += `<line x1="${x1[Math.floor(i / 3)]}" y1="${y1}" x2="${x}" y2="${y2}" style="stroke:var(--line)" stroke-width="2"/>`; });
    for (const x of x2) s += `<line x1="${x}" y1="${y2}" x2="${x}" y2="${y3[2]}" style="stroke:var(--line)" stroke-width="2"/>`;
    s += persona(cx, y0, 10, true) + x1.map(x => persona(x, y1, 9, true)).join('') + x2.map(x => persona(x, y2, 7, true)).join('');
    for (const x of x2) for (const y of y3) s += persona(x, y, 6.5, cobranTodos);
    return s;
  };
  const panel = (x0, titulo, cobranTodos, pie) => {
    const cx = x0 + 130;
    return `<text x="${cx}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      ${piramide(cx, cobranTodos)}
      ${pie.map((l, i) => `<text x="${cx}" y="${262 + i * 26}" text-anchor="middle" font-size="21" font-weight="${i ? 800 : 400}" style="fill:var(${i ? '--c-f' : '--muted'})">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 336" width="520" height="336" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="296" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', true, ['Cada uno trae a 3:', 'cobran los 40'])}
    ${panel(260, 'Lo que se mide', false, ['Se detiene:', '27 de 40 no cobran'])}
    ${persona(150, 320, 8, true)}<text x="164" y="327" font-size="20" fill="currentColor">cobra</text>
    ${persona(290, 320, 8, false)}<text x="304" y="327" font-size="20" fill="currentColor">no cobra</text>
  </svg>`;

  return {
    unidad: 'algebra.division-de-polinomios',
    titulo: '¿Por qué en una pirámide de dinero pierde la mayoría, si cada uno solo tiene que traer a tres?',
    parrafos: [
      ['Una pirámide de dinero funciona así: entras pagando una cuota y te prometen cobrar cuando traigas a tres personas nuevas que también paguen. ',
        'En la primera ronda, la persona que la empieza trae a 3; en la segunda, cada una de esas 3 trae a otras 3, que son 9, y en la tercera, esas 9 traen a 27. ',
        'Después de tres rondas, la pirámide junta a ', cociente('40 personas'), ', contando a la primera.'],
      ['La promesa suena pareja, porque si cada persona trae a tres, a cada una le llega su turno de cobrar. ',
        'Y si algún día la pirámide se detiene, lo esperable es que pierdan solo los últimos en entrar, que serían unos pocos. ',
        'Pero la pirámide tiene que detenerse, porque la gente no alcanza: en la ronda 16 harían falta más de 43 millones de personas nuevas, más que todo el Perú.'],
      ['Si se detiene después de la tercera ronda, las 27 personas que entraron al final pagaron y todavía no trajeron a nadie, así que no cobran: son más de dos tercios de las ',
        cociente('40'), '. ',
        'Sumar ronda por ronda muestra lo que pasa en esta pirámide, pero no dice qué pasa con 10 o con 16 rondas sin hacer cada vez una suma más larga.'],
      ['Para verlo con cualquier número de rondas, el 3 se cambia por una letra, x, y el total 1 + 3 + 9 + 27 pasa a ser el polinomio 1 + x + x² + x³. ',
        'Ese polinomio es lo que se obtiene al dividir un polinomio entre otro, y de esas divisiones, con su cociente y su resto, trata esta unidad. ',
        'Las que salen exactas y se repiten tanto como la de la pirámide tienen nombre propio: se llaman cocientes notables.'],
    ],
    ecuacion: ['1 + 3 + 9 + 27 = (81 − 1) ÷ ', divisor('2'), ' = ', cociente('40')],
    ecuacionAntes: 4,
    figura: {
      antes: 2,
      svg,
      alt: 'Dos dibujos iguales de una pirámide de dinero de tres rondas: una persona arriba, 3 debajo, 9 debajo de ellas y 27 al final, 40 en total. Lo que predice la promesa de que cada uno trae a tres: las 40 cobran. Lo que se mide cuando la pirámide se detiene: las 27 del final no trajeron a nadie y no cobran, 27 de 40.',
    },
    pregunta: 'Si la misma pirámide avanza una ronda más, ¿crees que la parte de los que no cobran será mayor, menor o casi igual que 27 de 40?',
    ficha: {
      seLleva: 'En una pirámide de dinero en la que cada uno trae a tres, cuando se detiene, los que no cobran son más de dos tercios de todos, no unos pocos al final.',
      alcance: 'Parcial (núcleo: cambio y relaciones, un total que crece de forma multiplicativa y se escribe para cualquier número de rondas; contexto de la competencia financiera; la división de polinomios, Horner y Ruffini son formalismo). Deducción propia con el marco de Matemática 2022.',
      choque: 'La promesa de que a cada uno le llega su turno, con el arreglo de que solo pierden unos pocos al final, predice que casi todos cobran; cuando la pirámide de tres rondas se detiene, 27 de 40 no cobran.',
      atajo: 'Sumar ronda por ronda (1 + 3 + 9 + 27 = 40) resuelve esta pirámide y está bien; no dice, sin otra suma cada vez, qué pasa con 10 o 16 rondas, ni por qué la parte de los que no cobran queda siempre por encima de dos tercios. Eso lo da 1 + x + x² + … + xⁿ = (xⁿ⁺¹ − 1) ÷ (x − 1), el cociente notable de la idea 6, que la apertura muestra con números en la ecuación y no escribe con letras.',
      porVerificar: [
        'Las cuentas son cálculo: 1 + 3 + 9 + 27 = 40 = (81 − 1) ÷ 2; 27 ÷ 40 = 0,675, más de 2/3; con una ronda más, 81 de 121, unos 0,669; en general, 3ⁿ de (3ⁿ⁺¹ − 1) ÷ 2, que siempre pasa de 2/3. 3¹⁶ = 43 046 721.',
        'Población del Perú, unos 34 millones (estimación del INEI para 2025, de memoria).',
        'La regla «cobras cuando traes a tres» es un modelo simplificado: las pirámides reales cambian el número de personas, la cuota y el pago. Que la SBS y el Indecopi alerten sobre esquemas piramidales en el Perú, y que la competencia financiera de PISA trate fraudes, sale de memoria.',
      ],
      notas: [
        'Investigada de nuevo (27 nov): Gerson rechazó el queque (25 trozos entre 6 personas, sobra 1; 100 entre 11, sobra 1) porque cambiaba el divisor a escondidas. Se probaron tres candidatos: (1) la regla del 9 como resto de un polinomio en x = 10 (2026 deja 1 entre 9 y sus cifras suman 10, que también deja 1), descartada porque «Divisibilidad» (idea 3, doña Juana y las bolsitas de 9) ya la enseña entera y el choque era débil; (2) los polos de promoción, un costo fijo del diseño más un precio por polo, dividido entre n polos, descartada porque es dividir entre un monomio (función afín y fracciones, no la división de la unidad) y su choque es el de la regla de tres, que ya usa «Magnitudes proporcionales»; (3) la pirámide de dinero, elegida: un solo caso y una sola regla en los dos paneles, una predicción que la gente de verdad hace (la promesa del esquema) y algo útil para llevarse.',
        'La pregunta se puede intentar a mano: con una ronda más entran 81, el total es 121 y no cobran 81, unos 0,669 contra 0,675; queda casi igual, un poco menor. La respuesta abre la idea 6 (el total para cualquier número de rondas) y no está en el texto, que no dice «siempre».',
        'La ecuación muestra con números el cociente notable de x⁴ − 1 entre x − 1 con x = 3; no responde la Predice de la idea 6 (el cuarto término de x⁶ − 64 entre x − 2, 8x²) ni la misión (9984 ÷ 8).',
        'Contenido, para Gerson: la apertura apunta sobre todo a la idea 6 (cocientes notables); el algoritmo de la división (ideas 1 a 5) entra solo como «dividir un polinomio entre otro, con su cociente y su resto». Si prefieres una apertura sobre el resto, el candidato que queda es la regla del 9, a cambio de repetir lo de «Divisibilidad». Tema sensible: nadie es culpado; el título habla de la pirámide, no de quien entra.',
      ],
    },
  };
})());
