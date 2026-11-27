/*
 * Apertura de «Productos notables» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * El choque es propio: al agrandar un cuarto cuadrado un metro por lado, la mayólica que se agrega no es 1 m² sino
 * 7 m² (de 3 m a 4 m), y la vez siguiente, 9 m². La cuenta de casi todos separa (3 + 1)² en 3² + 1². Lo que el alumno
 * se lleva va en ficha.seLleva. No adelanta la Predice de la idea 1 (el terreno de 7 m que cede franjas de 2 m:
 * 25 m²) ni la frase de su misión; no toca 31 · 29 (idea 2) ni el cubo de la idea 3. La figura pinta del mismo color
 * todo lo nuevo, sin partirlo en franjas y esquina: esa partición es la idea 1. Colores de la unidad (cabecera de
 * contenido/teoria/algebra/productos-notables.js): el primer término, el lado de antes, en naranja (c-o), y el
 * segundo, el metro nuevo, en turquesa (c-i).
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const antes = t => ({ v: 'c-o', t }), nuevo = t => ({ v: 'c-i', t });

  // El mismo piso de 4 m por 4 m en los dos paneles, con su mayólica de 1 m por 1 m. El cuarto de antes (3 m por 3 m)
  // en naranja. Lo que predice la cuenta separada: un solo metro cuadrado nuevo, en la esquina, y el resto del piso
  // sin cubrir (casillas punteadas). Lo que pide el maestro: siete mayólicas nuevas, en turquesa.
  const C = 44;
  const panel = (x0, titulo, nuevas, pie) => {
    const cx = x0 + 130, gx = cx - 2 * C + 8, gy = 62;
    let piso = '';
    for (let f = 0; f < 4; f++) for (let c = 0; c < 4; c++) {
      const x = gx + c * C, y = gy + f * C, vieja = f < 3 && c < 3, esquina = f === 3 && c === 3;
      if (vieja) piso += `<rect x="${x + 2}" y="${y + 2}" width="${C - 4}" height="${C - 4}" rx="3" style="fill:var(--c-o);stroke:var(--c-o)" fill-opacity=".22" stroke-width="2"/>`;
      else if (esquina || nuevas) piso += `<rect x="${x + 2}" y="${y + 2}" width="${C - 4}" height="${C - 4}" rx="3" style="fill:var(--c-i);stroke:var(--c-i)" fill-opacity=".3" stroke-width="2.5"/>`;
      else piso += `<rect x="${x + 4}" y="${y + 4}" width="${C - 8}" height="${C - 8}" rx="3" fill="none" style="stroke:var(--muted)" stroke-width="2" stroke-dasharray="5 4"/>`;
    }
    const lado = (x1, x2, y, t, col) => `<line x1="${x1 + 3}" y1="${y}" x2="${x2 - 3}" y2="${y}" style="stroke:var(${col})" stroke-width="3" stroke-linecap="round"/>
      <text x="${(x1 + x2) / 2}" y="${y + 24}" text-anchor="middle" font-size="20" font-weight="800" style="fill:var(${col})">${t}</text>`;
    return `<text x="${cx}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      <rect x="${gx}" y="${gy}" width="${4 * C}" height="${4 * C}" fill="none" stroke="currentColor" stroke-width="3"/>
      ${piso}
      ${lado(gx, gx + 3 * C, gy + 4 * C + 12, '3 m', '--c-o')}${lado(gx + 3 * C, gx + 4 * C, gy + 4 * C + 12, '1 m', '--c-i')}
      ${pie.map((l, i) => `<text x="${cx}" y="${306 + i * 24}" text-anchor="middle" font-size="21" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 344" width="520" height="344" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="334" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', false, ['Un metro más:', '1 m² más'])}
    ${panel(260, 'Lo que se mide', true, ['Un metro más:', '7 m² más'])}
  </svg>`;

  return {
    unidad: 'algebra.productos-notables',
    titulo: '¿Por qué agrandar un cuarto un metro más pide cada vez más mayólica?',
    parrafos: [
      ['La mayólica del piso se compra por metro cuadrado, y un cuarto cuadrado de ', antes('3 m'), ' de lado lleva 9 m². ',
        'Si el cuarto se agranda ', nuevo('1 m'), ' por lado, hasta 4 m, el maestro de obra pide 16 m², es decir, 7 m² más por un solo metro de lado. ',
        'Si después se agranda otro metro, hasta 5 m, pide 9 m² más, y el metro siguiente pide 11 m² más.'],
      ['La cuenta rápida separa el lado en dos partes: al lado de ', antes('3 m'), ' le toca su cuadrado y al metro nuevo, el suyo. ',
        'Con esa cuenta, cada metro extra pediría solo ', nuevo('1 m²'), ' más de mayólica, siempre el mismo. ',
        'Con los números a la mano basta multiplicar 4 por 4 y restar lo que ya había, pero esa resta da la cifra sin decir por qué cada metro pide más mayólica que el anterior.'],
      ['Lo nuevo no es un cuadradito de 1 m² en una esquina, y cuánto piso se agrega depende de lo grande que ya era el cuarto. ',
        'Elevar al cuadrado una suma como (3 + 1)² no es sumar los cuadrados de sus partes. ',
        'La forma que sí tiene esa cuenta, la misma para cualquier lado, es el primero de los productos notables, el tema de esta unidad.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos dibujos del mismo piso de 4 m por 4 m, con el cuarto de antes, de 3 m por 3 m, en una esquina. Lo que predice la cuenta separada: una sola mayólica nueva, de 1 m², y seis casillas del piso sin cubrir. Lo que se mide: hacen falta siete mayólicas nuevas, 7 m² más.',
    },
    pregunta: 'Si un cuarto que ya mide 8 m de lado se agranda a 9 m, ¿hará falta más o menos mayólica extra que al pasar de 3 m a 4 m?',
    ficha: {
      seLleva: 'Al agrandar un cuadrado, lo que se agrega depende de lo grande que ya era: un metro más de lado pide 7 m² en un cuarto de 3 m y más todavía en uno más grande, nunca solo 1 m².',
      alcance: 'Parcial (núcleo: relaciones entre medidas y el cambio de un área; la identidad algebraica es formalismo). Deducción propia con el marco de Matemática 2022.',
      choque: 'La cuenta separada, (3 + 1)² = 3² + 1², predice 1 m² más por el metro nuevo y el maestro pide 7 m² más (y 9 m² y 11 m² en los metros siguientes).',
      atajo: 'Multiplicar 4 × 4 y restar 9 da los 7 m², pero no dice por qué el metro siguiente pide 9 y el otro 11; el párrafo 2 lo admite y el choque se mueve a ese crecimiento. La regla de tres no aparece porque nadie la usaría aquí.',
      porVerificar: [
        'Que la mayólica se compre por metro cuadrado (en cajas que rinden un número de m²) es de memoria; el texto no cuenta lo que se pierde en los cortes, que el maestro suele sumar aparte.',
        'Los 7, 9 y 11 m² son cálculo (16 − 9, 25 − 16, 36 − 25), no una compra medida.',
      ],
      notas: [
        'Revisión del Escribidor Escribano (27 nov): «el metro nuevo no cabe en una esquina» era ambiguo y ahora dice que lo nuevo no es un cuadradito de 1 m² en la esquina; se partieron las oraciones de 43 y 41 palabras y la pregunta quedó en una sola («y por qué» sobraba). Para Gerson: el párrafo 3 dice que (3 + 1)² no es 3² + 1², que es el choque en una oración y no la fórmula; si se lee como regla, se puede quitar.',
        'La figura pinta las siete mayólicas nuevas del mismo turquesa: la partición en dos franjas y una esquina es el corazón de la idea 1 y su misión, y no se dibuja aquí.',
        'La pregunta se puede intentar con el párrafo 3 (lo que se agrega depende del tamaño de antes): de 8 m a 9 m hacen falta 17 m², más que 7. Abre la idea 1 sin ser una Predice.',
        'Contenido, para Gerson: el párrafo 3 dice que (3 + 1)² no es 3² + 1² y no da la fórmula. Las dos primeras oraciones del párrafo 1 cuentan una compra; los tres números del final son el dato que hace el choque.',
      ],
    },
  };
})());
