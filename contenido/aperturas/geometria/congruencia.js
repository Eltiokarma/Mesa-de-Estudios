/*
 * Apertura de «Congruencia de triángulos» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * El choque sale del campo: dos chacras con los mismos cuatro linderos (20 m, 10 m, 20 m y 10 m) pueden tener 200 m² o
 * 140 m², y por eso quien mide con wincha anota también una diagonal, que parte la chacra en dos triángulos y le quita
 * el juego. Lo que el alumno se lleva va en ficha.seLleva. No se adelanta la Predice de la idea 1 (con dos lados y un
 * ángulo que no está entre ellos salen dos tijerales: aquí no se habla de tijerales ni de ángulos dados) ni se escribe
 * un número de las respuestas o de las misiones (30, 60, 2,5, 3,5, 7,1). Colores de la unidad (cabecera de
 * contenido/teoria/geometria/congruencia.js): el primer lado dado en naranja (c-o), el segundo en turquesa (c-i), y lo
 * que no es dato (las áreas, la diagonal) en tinta.
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const largo = t => ({ v: 'c-o', t }), corto = t => ({ v: 'c-i', t });
  const r1 = n => Math.round(n * 10) / 10;

  // Las dos chacras, iguales en los dos paneles: 20 m por 10 m con esquinas rectas, y la misma con sus lados de 10 m
  // inclinados hasta quedar a 7 m de alto (área 20 × 7 = 140 m²). Escala: 1 m = 6,5 unidades de dibujo.
  const K = 6.5, A = 20 * K, B = 10 * K, H = 7 * K, D = Math.sqrt(100 - 49) * K;
  const lado = (x1, y1, x2, y2, c) => `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}" style="stroke:var(${c})" stroke-width="5" stroke-linecap="round"/>`;
  const rot = (x, y, t, c, ancla = 'middle') => `<text x="${r1(x)}" y="${r1(y)}" text-anchor="${ancla}" font-size="18" font-weight="800" style="fill:var(${c})">${t}</text>`;
  const chacra = (pts, area) => {
    const [p, q, s, t] = pts;
    const cx = (p[0] + q[0] + s[0] + t[0]) / 4, cy = (p[1] + q[1] + s[1] + t[1]) / 4;
    return `<path d="M${pts.map(([x, y]) => `${r1(x)} ${r1(y)}`).join('L')}Z" style="fill:var(--card)"/>
      ${lado(p[0], p[1], q[0], q[1], '--c-o')}${lado(s[0], s[1], t[0], t[1], '--c-o')}${lado(q[0], q[1], s[0], s[1], '--c-i')}${lado(t[0], t[1], p[0], p[1], '--c-i')}
      <text x="${r1(cx)}" y="${r1(cy + 8)}" text-anchor="middle" font-size="22" font-weight="800" fill="currentColor">${area}</text>`;
  };
  const panel = (x0, titulo, area2, pie) => {
    const cx = x0 + 130, xr = x0 + 26, yr = 76, xi = x0 + 22, yi = 240;
    const rect = [[xr, yr + B], [xr + A, yr + B], [xr + A, yr], [xr, yr]];
    const incl = [[xi, yi + H], [xi + A, yi + H], [xi + A + D, yi], [xi + D, yi]];
    return `<text x="${cx}" y="32" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      ${chacra(rect, '200 m²')}
      ${rot(xr + A / 2, yr - 8, '20 m', '--c-o')}${rot(xr + A + 8, yr + B / 2 + 6, '10 m', '--c-i', 'start')}
      ${chacra(incl, area2)}
      ${rot(xi + D + A / 2, yi - 8, '20 m', '--c-o')}${rot(xi + A + D + 4, yi + H / 2 + 14, '10 m', '--c-i', 'start')}
      ${pie.map((l, i) => `<text x="${cx}" y="${340 + i * 26}" text-anchor="middle" font-size="21" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 384" width="520" height="384" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="374" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', '200 m²', ['Mismos linderos:', 'misma área'])}
    ${panel(260, 'Lo que se mide', '140 m²', ['Mismos linderos:', 'otra área'])}
  </svg>`;

  return {
    unidad: 'geometria.congruencia',
    titulo: '¿Por qué dos chacras con los mismos cuatro linderos pueden tener áreas distintas?',
    parrafos: [
      ['Cuando se mide una chacra de cuatro lados con una wincha, no basta con anotar el largo de cada lindero: quien mide con cuidado anota también una diagonal, de una esquina a la de enfrente. ',
        'La razón se ve con dos chacras que tienen los mismos linderos: ', largo('20 m'), ', ', corto('10 m'), ', ', largo('20 m'), ' y ', corto('10 m'), '. ',
        'Si las esquinas de la primera son rectas, la chacra tiene 200 m², y la segunda, que está inclinada, tiene solo 140 m².'],
      ['Lo que parece lógico es que cuatro linderos digan todo de una chacra, y que su área salga de multiplicar ', largo('20 m'), ' por ', corto('10 m'), '. ',
        'Esa cuenta vale solo si las esquinas son rectas, y nada en los cuatro largos obliga a que lo sean: la segunda chacra es la primera con dos esquinas empujadas de costado, sin estirar ni encoger ningún lindero.'],
      ['Los cuatro linderos dejan que la chacra se aplaste y pierda área, y la diagonal, que la parte en dos triángulos, le quita ese juego. ',
        'Qué medidas bastan para que un triángulo quede fijo, y cuándo dos triángulos son iguales en todo, es el tema de esta unidad: la congruencia de triángulos.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos dibujos con las mismas dos chacras de linderos de 20 m, 10 m, 20 m y 10 m: una con esquinas rectas y otra inclinada. Lo que predice: las dos tienen 200 m². Lo que se mide: la de esquinas rectas tiene 200 m² y la inclinada, 140 m².',
    },
    pregunta: 'Al partir la chacra en dos triángulos con la diagonal, ¿por qué crees que la chacra ya no puede inclinarse sin estirar algún lindero o la diagonal?',
    ficha: {
      seLleva: 'Los cuatro linderos de una chacra no deciden su forma ni su área, y por eso se mide también una diagonal, que la parte en dos triángulos que ya no pueden cambiar de forma.',
      alcance: 'Parcial, por deducción propia (espacio y forma; medida: qué datos determinan una figura).',
      choque: 'Con los mismos linderos de 20 m, 10 m, 20 m y 10 m, una chacra tiene 200 m² y la otra, 140 m².',
      atajo: 'Multiplicar 20 por 10, que supone esquinas rectas; y la idea de que más medidas siempre dicen más (cuatro linderos contra tres lados). La explicación de por qué el triángulo no se deforma no se da: la pide la pregunta y la trabaja la idea 1.',
      porVerificar: [
        'Que al medir con wincha un terreno de cuatro lados se anote una diagonal (levantamiento por triangulación con cinta): práctica de topografía básica, de memoria.',
        'Los 140 m² son cálculo (20 m × 7 m, con los lados de 10 m inclinados hasta 7 m de alto), no una medición de una chacra real.',
      ],
      notas: [
        'La figura dibuja las mismas dos chacras en los dos paneles, con los linderos rotulados en naranja (20 m) y turquesa (10 m); solo cambia el área escrita en la inclinada. La inclinación (unos 44° con la base) no es un ángulo notable, para no dar a medir nada de la idea 6 (los triángulos de 30° y 60°, o de 37° y 53°).',
        'El párrafo 3 dice que la diagonal le quita el juego a la chacra, pero no por qué: esa es la pregunta. Que tres lados fijan un triángulo (LLL) es la respuesta que la idea 1 pone a prueba con un caso donde tres medidas no bastan (dos tijerales).',
        'No se nombran los tijerales ni los ángulos dados, que son el escenario de la Predice de la idea 1.',
        'Revisión del Escribidor Escribano (27 nov): congruencia y polígonos muestran las dos un cuadrilátero que se deforma. Para que cada una deje algo distinto, aquí el texto habla de lo que se pierde (el área) y de lo que lo fija (el triángulo); polígonos habla de lo que se conserva (la bandeja sigue paralela a la caja). Se quitó «como un marco de cuadro que se empuja de costado», que repetía el marco de la idea 4 de polígonos. Si Gerson las siente repetidas al leerlas seguidas, la que cambia de choque es esta (la diagonal también podría salir de un tijeral o de una puerta que se descuadra), porque polígonos necesita el cuadrilátero móvil.',
        'La pregunta decía «sin que cambie alguno de sus largos», que no aclaraba si contaba la diagonal; ahora lo dice.',
      ],
    },
  };
})());
