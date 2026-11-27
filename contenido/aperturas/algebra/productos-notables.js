/*
 * Apertura de «Productos notables» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * El choque es propio (doble revisión, 27 nov): al agrandar un cuarto cuadrado un metro por lado, el mismo metro pide
 * cada vez más mayólica (7, 9 y 11 m² de 3 m a 6 m), y la idea de «el mismo metro, la misma mayólica» predice 7 m²
 * siempre. Lo que el alumno
 * se lleva va en ficha.seLleva. No adelanta la Predice de la idea 1 (el terreno de 7 m que cede franjas de 2 m:
 * 25 m²) ni la frase de su misión; no toca 31 · 29 (idea 2) ni el cubo de la idea 3. La figura da barras de lo nuevo,
 * sin partirlo en franjas y esquina: esa partición es la idea 1. Colores de la unidad (cabecera de
 * contenido/teoria/algebra/productos-notables.js): el primer término, el lado de antes, en naranja (c-o), y el
 * segundo, el metro nuevo, en turquesa (c-i).
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const antes = t => ({ v: 'c-o', t }), nuevo = t => ({ v: 'c-i', t });

  // Barras con la misma escala en los dos paneles (U unidades de alto por metro cuadrado): la mayólica extra que pide
  // cada metro de lado, al pasar de 3 m a 4 m, de 4 m a 5 m y de 5 m a 6 m. Lo que predice la idea de que el mismo
  // metro pide la misma mayólica: 7, 7 y 7 m². Lo que pide el maestro: 7, 9 y 11 m² (16 − 9, 25 − 16, 36 − 25).
  const U = 11, BASE = 220, PASOS = ['3 → 4', '4 → 5', '5 → 6'];
  const panel = (x0, titulo, extra, pie) => {
    const cx = x0 + 130;
    const barras = extra.map((n, i) => {
      const x = x0 + 40 + i * 64, h = n * U;
      return `<rect x="${x}" y="${BASE - h}" width="44" height="${h}" rx="3" style="fill:var(--c-i);stroke:var(--c-i)" fill-opacity=".3" stroke-width="2"/>
        <text x="${x + 22}" y="${BASE - h - 8}" text-anchor="middle" font-size="19" font-weight="800" style="fill:var(--c-i)">${n} m²</text>
        <text x="${x + 22}" y="${BASE + 26}" text-anchor="middle" font-size="18" font-weight="700" fill="currentColor">${PASOS[i]}</text>`;
    }).join('');
    return `<text x="${cx}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      <text x="${cx}" y="56" text-anchor="middle" font-size="16" style="fill:var(--muted)">mayólica extra por cada metro</text>
      <line x1="${x0 + 26}" y1="${BASE}" x2="${x0 + 234}" y2="${BASE}" stroke="currentColor" stroke-width="2.5"/>
      ${barras}
      <text x="${cx}" y="${BASE + 52}" text-anchor="middle" font-size="17" style="fill:var(--muted)">lado del cuarto, en metros</text>
      ${pie.map((l, i) => `<text x="${cx}" y="${BASE + 88 + i * 24}" text-anchor="middle" font-size="21" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 344" width="520" height="344" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="334" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', [7, 7, 7], ['El mismo metro:', 'la misma mayólica'])}
    ${panel(260, 'Lo que se mide', [7, 9, 11], ['El mismo metro:', 'cada vez más'])}
  </svg>`;

  return {
    unidad: 'algebra.productos-notables',
    titulo: '¿Por qué agrandar un cuarto un metro más pide cada vez más mayólica?',
    parrafos: [
      ['La mayólica del piso se compra por metro cuadrado, y un cuarto cuadrado de ', antes('3 m'), ' de lado lleva 9 m². ',
        'Si el cuarto se agranda ', nuevo('1 m'), ' por lado, hasta 4 m, el maestro de obra pide 16 m², así que por un solo metro de lado hacen falta:',
        { linea: ['16 m² − 9 m² = 7 m²'] },
        'Si después se agranda otro metro, hasta 5 m, pide 9 m² más, y el metro siguiente pide 11 m² más.'],
      ['Un metro de lado parece siempre el mismo metro, así que es fácil esperar que cada metro nuevo pida la misma mayólica extra que el primero, ',
        nuevo('7 m²'), ' cada vez. ',
        'Con los números a la mano basta multiplicar el lado nuevo por sí mismo y restar lo que ya había, pero esa resta da cada cifra por separado y no dice por qué cada metro pide más que el anterior.'],
      ['Lo nuevo no es un pedazo fijo que se pega al cuarto, porque tiene que acompañar los lados del piso que ya había, y esos lados son más largos en un cuarto más grande. ',
        'Elevar al cuadrado una suma, como el lado de ', antes('3 m'), ' más el ', nuevo('metro nuevo'), ', tiene una forma que vale para cualquier lado, y esa forma es el primero de los productos notables, el tema de esta unidad.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos gráficos de barras con la misma escala: cuánta mayólica extra pide cada metro de lado al agrandar un cuarto cuadrado de 3 m a 4 m, de 4 m a 5 m y de 5 m a 6 m. Lo que predice la idea de que el mismo metro pide la misma mayólica: 7 m² las tres veces. Lo que pide el maestro: 7 m², 9 m² y 11 m².',
    },
    pregunta: 'Si un cuarto que ya mide 8 m de lado se agranda a 9 m, ¿cuánta mayólica extra crees que pedirá el maestro?',
    ficha: {
      seLleva: 'Al agrandar un cuadrado, lo que se agrega depende de lo grande que ya era: el mismo metro de lado pide 7 m² en un cuarto de 3 m, 9 m² en uno de 4 m y más todavía en uno más grande.',
      alcance: 'Parcial (núcleo: relaciones entre medidas y el cambio de un área; la identidad algebraica es formalismo). Deducción propia con el marco de Matemática 2022.',
      choque: 'La idea de que el mismo metro pide la misma mayólica predice 7 m² extra cada vez, y el maestro pide 7 m², 9 m² y 11 m² en los metros siguientes.',
      atajo: 'Multiplicar el lado nuevo por sí mismo y restar lo que había da cada cifra (16 − 9, 25 − 16, 36 − 25), pero no dice por qué cada metro pide más que el anterior; el párrafo 2 lo admite y el choque está en ese crecimiento. La regla de tres no aparece porque nadie la usaría aquí.',
      porVerificar: [
        'Que la mayólica se compre por metro cuadrado (en cajas que rinden un número de m²) es de memoria; el texto no cuenta lo que se pierde en los cortes, que el maestro suele sumar aparte.',
        'Los 7, 9 y 11 m² son cálculo (16 − 9, 25 − 16, 36 − 25), no una compra medida.',
      ],
      notas: [
        'Tercera pasada (27 nov): la resta «16 m², es decir, 7 m² más» del párrafo 1 salió a su línea (16 m² − 9 m² = 7 m²). Los 9 m² y 11 m² de los metros siguientes quedan como datos en la oración. Sin palabras de doble sentido («cuarto» solo es la habitación).',
        'Doble revisión (27 nov): la versión anterior ponía como predicción que el metro nuevo pide solo 1 m², es decir, (3 + 1)² = 3² + 1². Con un piso de verdad delante nadie cuenta así (el mismo texto admitía que basta multiplicar 4 por 4), así que era un muñeco de paja. Ahora la predicción es la de un alumno real, «el mismo metro, la misma mayólica» (7 m² cada vez), y lo medido es el mismo caso con los mismos números: 7, 9 y 11 m². La figura pasó de dos pisos de mayólicas a dos gráficos de barras con la misma escala, sin dibujar las franjas ni la esquina (siguen siendo de la idea 1). La pregunta ahora pide la cifra de 8 m a 9 m (17 m²), que se saca siguiendo la serie o con la resta; antes preguntaba «más o menos», que el choque ya respondía. Que un alumno espere lo mismo cada vez es deducción propia (ilusión de linealidad), por probar con alumnos.',
        'Revisión del Escribidor Escribano (27 nov): «el metro nuevo no cabe en una esquina» era ambiguo y ahora dice que lo nuevo no es un cuadradito de 1 m² en la esquina; se partieron las oraciones de 43 y 41 palabras y la pregunta quedó en una sola («y por qué» sobraba). Para Gerson: el párrafo 3 dice que (3 + 1)² no es 3² + 1², que es el choque en una oración y no la fórmula; si se lee como regla, se puede quitar.',
        'La figura no parte lo nuevo en dos franjas y una esquina: esa partición es el corazón de la idea 1 y su misión, y no se dibuja aquí.',
        'La pregunta se puede intentar siguiendo la serie (7, 9, 11, …) o con la resta 81 − 64: hacen falta 17 m². Abre la idea 1 sin ser una Predice.',
        'Contenido, para Gerson: el párrafo 3 ya no dice que (3 + 1)² no es 3² + 1² (eso lo pregunta la idea 1); dice por qué lo nuevo crece (acompaña los lados del piso que ya había) sin dar la fórmula.',
      ],
    },
  };
})());
