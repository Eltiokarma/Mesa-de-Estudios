/*
 * Apertura de «Magnitudes proporcionales» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * Segunda versión (27 nov), escrita desde cero: el choque es propio (la pizza personal y la familiar), no el ejemplo
 * del skill. Lo que el alumno se lleva va en ficha.seLleva. No adelanta la Predice de la idea 1 (12 obreros, 15 días:
 * 9 días) ni la de la idea 2. Colores de la unidad: el ancho va en naranja (c-o, la x de la gráfica de la idea 1) y la
 * pizza que trae, en turquesa (c-i, la y).
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const ancho = t => ({ v: 'c-o', t }), pizza = t => ({ v: 'c-i', t });
  const r1 = n => Math.round(n * 10) / 10;

  // Una pizza: la masa en turquesa (la cantidad) y, si lleva rótulo, su ancho marcado en naranja.
  const unaPizza = (cx, cy, r, rotulo) => `<circle cx="${cx}" cy="${cy}" r="${r}" style="fill:var(--c-i)" fill-opacity=".2"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" style="stroke:var(--c-i)" stroke-width="3"/>
      ${[0.42, 0.7].map((k, i) => [0, 72, 144, 216, 288].map(g => {
        const a = (g + 18 + i * 36) * Math.PI / 180;
        if (rotulo && Math.sin(a) * k < 0.1 && Math.sin(a) * k > -0.5) return ''; // deja libre el rótulo del ancho
        return `<circle cx="${r1(cx + k * r * Math.cos(a))}" cy="${r1(cy + k * r * Math.sin(a))}" r="${r1(Math.max(2.5, r * 0.08))}" style="fill:var(--c-i)" fill-opacity=".5"/>`;
      }).join('')).join('')}
      ${rotulo ? `<line x1="${cx - r + 3}" y1="${cy}" x2="${cx + r - 3}" y2="${cy}" style="stroke:var(--c-o)" stroke-width="3" stroke-linecap="round"/>
      <text x="${cx}" y="${cy - 8}" text-anchor="middle" font-size="${r > 40 ? 22 : 16}" font-weight="800" style="fill:var(--c-o);stroke:var(--card)" stroke-width="4" paint-order="stroke">${rotulo}</text>` : ''}`;

  // Dos paneles con la misma escala (1 cm de ancho = 2,8 unidades): arriba la familiar y abajo cuántas personales trae.
  const R = 56, r = 28;
  const panel = (x0, titulo, n, pie) => {
    const cx = x0 + 130;
    const chicas = Array.from({ length: n }, (_, i) => unaPizza(cx - 34 + (i % 2) * 68, 232 + Math.floor(i / 2) * 62, r, i === 0 ? '20 cm' : '')).join('');
    return `<text x="${cx}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      ${unaPizza(cx, 106, R, '40 cm')}
      <text x="${cx}" y="192" text-anchor="middle" font-size="20" font-weight="700" fill="currentColor">pesa lo de</text>
      ${chicas}
      ${pie.map((l, i) => `<text x="${cx}" y="${358 + i * 24}" text-anchor="middle" font-size="21" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 400" width="520" height="400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="390" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', 2, ['Doble de ancho:', 'dos personales'])}
    ${panel(260, 'Lo que se mide', 4, ['Doble de ancho:', 'cuatro personales'])}
  </svg>`;

  return {
    unidad: 'aritmetica.magnitudes-proporcionales',
    titulo: '¿Por qué una pizza el doble de ancha pesa más del doble?',
    parrafos: [
      ['En una pizzería, la pizza personal mide unos ', ancho('20 cm'), ' de ancho y la familiar, unos ', ancho('40 cm'), '. ',
        'Si la masa de las dos tiene el mismo grosor y pones cada una en una balanza, la familiar pesa lo mismo que ',
        pizza('cuatro personales'), ' juntas.'],
      ['Con la regla de tres, la cuenta sale en un renglón: si el ancho se duplica, la pizza también, y la familiar pesaría lo de ',
        pizza('dos personales'), '. ',
        'La regla de tres inversa tampoco ayuda, porque diría que la familiar pesa lo de media personal, y basta ponerlas lado a lado para ver que la familiar es más grande.'],
      ['Las dos reglas de tres suponen que, cuando una cantidad se duplica, la otra se duplica o se queda en la mitad. ',
        'Con la pizza no pasa ninguna de las dos cosas, porque al agrandarla la masa crece a lo ancho y también a lo largo, y por eso al doble de ancho le toca lo de ',
        pizza('cuatro personales'), '. ',
        'Por eso, antes de usar una regla de tres, hay que averiguar qué le pasa a una cantidad cuando la otra se duplica, y de esa pregunta trata el tema de las magnitudes proporcionales.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos dibujos con la misma escala. En los dos, una pizza familiar de 40 cm de ancho. Lo que predice la regla de tres: la familiar pesa lo de dos pizzas personales de 20 cm. Lo que se mide: pesa lo de cuatro personales.',
    },
    pregunta: 'Un pan de molde el doble de largo, con tajadas del mismo tamaño y grosor, sí da el doble de tajadas. Al agrandarse, ¿en qué se diferencia ese pan de la pizza?',
    ficha: {
      seLleva: 'La regla de tres solo sirve si, al duplicar una cantidad, la otra se duplica o se queda en la mitad; una pizza el doble de ancha trae lo de cuatro, no lo de dos.',
      alcance: 'Sí (cantidad; cambio y relaciones).',
      choque: 'La regla de tres predice que la pizza de 40 cm trae lo de dos de 20 cm, y en la balanza pesa lo de cuatro.',
      atajo: 'La regla de tres inversa da media personal, que se descarta a la vista. La fórmula del área del círculo resolvería la cuenta, pero esa es justamente la pregunta del tema: averiguar cómo cambia una cantidad con la otra antes de calcular (aquí, la pizza crece con el cuadrado del ancho).',
      porVerificar: [
        'Anchos típicos en las pizzerías del Perú: personal de unos 20 cm y familiar de unos 40 cm (varían según la cadena; la familiar suele estar entre 36 y 40 cm).',
        'Que la familiar pese lo de cuatro personales es cálculo (el área crece con el cuadrado del ancho), no una pesada propia; vale si el grosor de la masa y los ingredientes por centímetro cuadrado son los mismos.',
      ],
      notas: [
        'Segunda versión (27 nov): Gerson rechazó la primera, que era el ejemplo del skill (la talla del niño). Esta busca un hecho propio, que un alumno de 5.º entiende sin saber el tema, y deja una oración para llevarse (seLleva).',
        'La pregunta compara pares (largo del pan y tajadas, ancho de la pizza y pizza) y se puede responder con el párrafo 3: el pan crece solo a lo largo. La clase recoge esa respuesta para presentar la proporcionalidad directa.',
        'Revisión del Escribidor Escribano (27 nov): el título y la figura decían «trae», que no dice de qué; ahora todo habla de lo que pesa, como la balanza del párrafo 1. Se quitó «Quien usa la regla de tres…» (molde) y la pregunta, que decía «¿Qué tiene ese pan que no tiene la pizza?», ahora pide la diferencia al agrandarse y aclara que las tajadas son del mismo tamaño (si no, el pan también podría crecer a lo ancho).',
        'Contenido, para Gerson: el panel «Lo que se mide» y el párrafo 1 presentan como pesada un resultado de cálculo (ver porVerificar). Antes de publicar conviene pesarlo una vez o decir «pesaría». Además, el párrafo 3 dice por qué crece (a lo ancho y a lo largo): es una pista de la causa, no la regla, pero roza el «la entrada no explica» del skill.',
      ],
    },
  };
})());
