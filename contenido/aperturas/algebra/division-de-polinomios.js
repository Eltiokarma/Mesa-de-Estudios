/*
 * Apertura de «División de polinomios y cocientes notables» (docs/metodo/apertura-pisa.md; criterio en
 * docs/metodo/entrada-pisa.md). Tercera versión (27 nov, revisión): la anterior usaba el 28 de julio que se corre un
 * día, que es el hecho de aritmetica/divisibilidad.js, y su choque era de aritmética. El choque nuevo es propio de la
 * unidad: un queque cuadrado cortado en n filas de n trozos y repartido entre n + 1 personas deja siempre un trozo,
 * sea del tamaño que sea (n² = (n + 1)(n − 1) + 1: el resto de x² entre x + 1 es el número 1, no depende de x). La
 * idea de que «más queque, más sobra» predice 4 trozos sueltos en el queque de 10 por 10, y sobra 1. Lo que el alumno
 * se lleva va en ficha.seLleva. No adelanta ninguna Predice (grado 4 del cociente, 3x², resto 7, 2x, resto 3, 8x²) ni
 * los valores de las misiones (el 17 de Ruffini, el 9984 de la calculadora). Colores de la unidad (cabecera de
 * contenido/teoria/algebra/division-de-polinomios.js): el divisor, las personas, en turquesa (c-i); el cociente, los
 * trozos de cada una, en violeta (c-f), y el resto, lo que sobra, en naranja (c-o).
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const divisor = t => ({ v: 'c-i', t }), cociente = t => ({ v: 'c-f', t }), resto = t => ({ v: 'c-o', t });

  // Un queque visto desde arriba, cortado en n filas de n trozos (C px cada uno, la misma escala en los dos paneles).
  // Los últimos `sobra` trozos, los que nadie se lleva, van en naranja.
  const C = 10;
  const queque = (x, y, n, sobra) => {
    let s = `<rect x="${x - 3}" y="${y - 3}" width="${n * C + 6}" height="${n * C + 6}" rx="6" style="fill:var(--card);stroke:currentColor" stroke-width="2"/>`;
    for (let i = 0; i < n * n; i++) {
      const f = Math.floor(i / n), c = i % n, suelto = i >= n * n - sobra;
      s += `<rect x="${x + c * C + 0.5}" y="${y + f * C + 0.5}" width="${C - 1}" height="${C - 1}" rx="1.5" style="${suelto ? 'fill:var(--c-o);stroke:var(--c-o)' : 'fill:var(--c-f);stroke:var(--c-f)'}" fill-opacity="${suelto ? '.85' : '.18'}" stroke-width="${suelto ? 1.5 : 0.8}"/>`;
    }
    return s;
  };
  // Cada panel: el queque chico (5 por 5, 6 personas) y el grande (10 por 10, 11 personas), con lo que sobra.
  const panel = (x0, titulo, sobraGrande, pie) => {
    const cx = x0 + 130, xa = x0 + 32, xb = x0 + 126, base = 164;
    const rotulos = (xc, trozos, personas, sobra) => `<text x="${xc}" y="${base + 30}" text-anchor="middle" font-size="20" font-weight="700" fill="currentColor">${trozos} trozos</text>
      <text x="${xc}" y="${base + 54}" text-anchor="middle" font-size="19" font-weight="700" style="fill:var(--c-i)">${personas} personas</text>
      <text x="${xc}" y="${base + 80}" text-anchor="middle" font-size="22" font-weight="800" style="fill:var(--c-o)">${sobra === 1 ? 'sobra 1' : `sobran ${sobra}`}</text>`;
    return `<text x="${cx}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      ${queque(xa, base - 5 * C, 5, 1)}${queque(xb, base - 10 * C, 10, sobraGrande)}
      ${rotulos(xa + 2.5 * C, 25, 6, 1)}${rotulos(xb + 5 * C, 100, 11, sobraGrande)}
      ${pie.map((l, i) => `<text x="${cx}" y="${base + 120 + i * 24}" text-anchor="middle" font-size="21" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 318" width="520" height="318" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="308" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', 4, ['Más queque:', 'más trozos sueltos'])}
    ${panel(260, 'Lo que se mide', 1, ['Chico o grande:', 'sobra un trozo'])}
  </svg>`;

  return {
    unidad: 'algebra.division-de-polinomios',
    titulo: '¿Por qué siempre sobra un trozo de queque, sea chico o grande?',
    parrafos: [
      ['Un queque horneado en un molde cuadrado se corta en filas y columnas iguales, como un tablero de ajedrez. ',
        'Si lo cortas en 5 filas de 5 trozos y lo repartes entre ', divisor('6 personas'), ', una más que las filas, a cada una le tocan ',
        cociente('4 trozos'), ' y sobra ', resto('1'), '. ',
        'Con un queque más grande, cortado en 10 filas de 10 y repartido entre ', divisor('11 personas'), ', a cada una le tocan ',
        cociente('9 trozos'), ' y vuelve a sobrar ', resto('1'), '.'],
      ['Lo esperable es que un queque más grande, repartido entre más gente, deje más trozos sueltos. ',
        'El de 10 filas tiene cuatro veces más trozos que el de 5, así que, con la misma cuenta, tendría que dejar cuatro veces más sobra: ',
        resto('4 trozos'), '. ',
        'Dividir 100 entre 11 da el trozo que sobra, pero solo para ese queque, y no dice qué pasará con uno de 20 filas o de 50 sin hacer otra división.'],
      ['Repartido siempre entre una persona más que las filas, un queque de 4 filas, de 10 o de 50 deja un solo trozo suelto: lo que sobra no cambia con el tamaño. ',
        'Para ver por qué, el número de filas se cambia por una letra, el reparto se escribe como una expresión que vale para cualquier queque y esa expresión se divide entre otra. ',
        'Dividir expresiones con letras es la división de polinomios, y esta unidad trata de esa división y del resto que deja.'],
    ],
    ecuacion: ['25 = ', divisor('6'), ' · ', cociente('4'), ' + ', resto('1'), ';   100 = ', divisor('11'), ' · ', cociente('9'), ' + ', resto('1')],
    ecuacionAntes: 3,
    figura: {
      antes: 2,
      svg,
      alt: 'Dos dibujos con la misma escala de dos queques cuadrados vistos desde arriba, uno de 5 por 5 trozos repartido entre 6 personas y otro de 10 por 10 repartido entre 11. En los dos, el chico deja 1 trozo suelto. Lo que predice la idea de que más queque deja más sobra: el grande deja 4 trozos sueltos. Lo que se mide: el grande también deja 1.',
    },
    pregunta: 'Si el queque se reparte entre una persona menos que las filas, como 4 personas para el de 5 filas, ¿crees que también sobrará lo mismo con cualquier tamaño?',
    ficha: {
      seLleva: 'Hay repartos en los que lo que sobra no cambia con el tamaño: un queque cuadrado repartido entre una persona más que sus filas deja siempre un trozo, sea chico o grande.',
      alcance: 'Parcial (núcleo: cambio y relaciones, una regularidad que vale para cualquier tamaño; la división de polinomios, Horner y Ruffini son formalismo). Deducción propia con el marco de Matemática 2022.',
      choque: 'La idea de que más queque deja más sobra predice 4 trozos sueltos en el queque de 10 por 10 entre 11 personas, y sobra 1, como en el de 5 por 5 entre 6.',
      atajo: 'Hacer la división de cada caso (100 entre 11 da 9 y sobra 1) resuelve ese queque, pero no dice por qué sobra lo mismo con cualquier tamaño sin dividir otra vez; eso lo dice el resto de la división con letras (x² entre x + 1 deja 1).',
      porVerificar: [
        'Los repartos son cálculo: 16 = 5 · 3 + 1, 25 = 6 · 4 + 1, 100 = 11 · 9 + 1, 400 = 21 · 19 + 1 y 2500 = 51 · 49 + 1. Vale para cualquier número de filas, porque n² = (n + 1)(n − 1) + 1.',
        'Que el queque de molde cuadrado se corte en filas y columnas iguales es costumbre, no una regla (de memoria).',
      ],
      notas: [
        'Tercera versión (27 nov), del revisor: la anterior repetía el hecho de aritmetica/divisibilidad.js (el 28 de julio que se corre un día) y su choque era de aritmética. Gerson pidió un choque propio de la unidad; este es «un resto que no depende del tamaño», que solo explica la división con letras.',
        'La pregunta se puede intentar probando: 25 entre 4 da 6 y sobra 1, y 100 entre 9 da 11 y sobra 1, así que también sobra lo mismo (n² = (n − 1)(n + 1) + 1, desde 3 filas). El alumno que no lo prueba puede creer que esta vez sí cambia. Abre la idea 1 (cociente y resto que reconstruyen el dividendo) y apunta al teorema del resto (idea 5) sin explicarlo.',
        'La ecuación es el algoritmo de la división de la idea 1 con números; no responde la Predice de la idea 1, que pregunta por el grado del cociente.',
        'Contenido, para Gerson: detrás del reparto está la diferencia de cuadrados (n² − 1 = (n + 1)(n − 1)), que también sostiene la apertura nueva de Factorización (el cuadrado sin una esquina). Los hechos son distintos (repartir y sobrar, rearmar una pieza) y ninguna de las dos escribe la identidad; si Gerson prefiere identidades distintas, se cambia una.',
      ],
    },
  };
})());
