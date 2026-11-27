/*
 * Apertura de «Exponentes y radicales» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * El choque es propio: la clave de 4 cifras de la tarjeta o del celular frente a la de 6. Dos cifras más parecen
 * «la mitad más» de claves, y son cien veces más. Lo que el alumno se lleva va en ficha.seLleva.
 * No adelanta la Predice de la idea 1 (2⁻³ con la hoja doblada: 1/8) ni la misión de los dobleces; tampoco toca la
 * raíz de la idea 2 ni el 27^(2/3) de la idea 3. La pregunta abre la idea 1 (¿qué pasa con cero cifras?) sin
 * responderla. Colores de la unidad (cabecera de contenido/teoria/algebra/exponentes-y-productos-notables.js): el
 * exponente, que aquí es el número de cifras, en naranja (c-o), y el resultado, las claves posibles, en violeta (c-f).
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const cifras = t => ({ v: 'c-o', t }), claves = t => ({ v: 'c-f', t });

  // Cada cuadrito son 10 000 claves, con la misma escala en los dos paneles: arriba la clave de 4 cifras (un cuadrito)
  // y abajo la de 6 (lo que se espera: un cuadrito y medio; lo que se cuenta: cien cuadritos, una rejilla de 10 por 10).
  const S = 17, P = 19;
  const cuadrito = (x, y, ancho = S) => `<rect x="${x}" y="${y}" width="${ancho}" height="${S}" rx="2" style="fill:var(--c-f);stroke:var(--c-f)" fill-opacity=".28" stroke-width="1.5"/>`;
  const rotulo = (x, y, n, cuantas) => `<text x="${x}" y="${y}" font-size="20" font-weight="800" fill="currentColor"><tspan style="fill:var(--c-o)">${n} cifras</tspan>: <tspan style="fill:var(--c-f)">${cuantas}</tspan></text>`;
  const panel = (x0, titulo, seis, pie) => {
    const cx = x0 + 130, x = x0 + 35;
    let abajo = '';
    if (seis === 'media') abajo = cuadrito(x, 152) + cuadrito(x + P, 152, S / 2);
    else for (let f = 0; f < 10; f++) for (let c = 0; c < 10; c++) abajo += cuadrito(x + c * P, 152 + f * P);
    return `<text x="${cx}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      <rect x="${x}" y="44" width="12" height="12" rx="2" style="fill:var(--c-f);stroke:var(--c-f)" fill-opacity=".28" stroke-width="1.5"/>
      <text x="${x + 18}" y="55" font-size="16" style="fill:var(--muted)">= 10 000 claves</text>
      ${rotulo(x, 84, 4, '10 000')}
      ${cuadrito(x, 94)}
      ${rotulo(x, 142, 6, seis === 'media' ? '15 000' : '1 000 000')}
      ${abajo}
      ${pie.map((l, i) => `<text x="${cx}" y="${374 + i * 24}" text-anchor="middle" font-size="21" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 410" width="520" height="410" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="400" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', 'media', ['Dos cifras más:', 'la mitad más'])}
    ${panel(260, 'Lo que se mide', 'cien', ['Dos cifras más:', 'cien veces más'])}
  </svg>`;

  return {
    unidad: 'algebra.exponentes-y-productos-notables',
    titulo: '¿Por qué dos cifras más vuelven una clave cien veces más difícil de adivinar?',
    parrafos: [
      ['La tarjeta del banco y muchos celulares piden una clave de ', cifras('4 cifras'), ', que puede ir desde 0000 hasta 9999, así que hay ',
        claves('10 000 claves'), ' posibles. ',
        'Si la clave es de ', cifras('6 cifras'), ', de 000000 a 999999, las claves posibles son ', claves('1 000 000'),
        ', y quien quiera adivinarla probando una por una tiene cien veces más trabajo.'],
      ['Seis cifras son la mitad más que cuatro, y con la regla de tres la clave larga tendría también la mitad más de claves, unas ',
        claves('15 000'), '. ',
        'Sumar lo que aporta cada cifra tampoco funciona: si cada cifra nueva agregara sus diez posibilidades, la clave de 6 cifras tendría apenas 20 claves más que la de 4.'],
      ['Una cifra nueva no se suma a las claves que ya había: cada una de ellas se puede terminar de diez maneras distintas, así que la cifra nueva las multiplica por diez. ',
        'Las claves de ', cifras('4 cifras'), ' salen de multiplicar cuatro dieces, uno tras otro, y las de ', cifras('6 cifras'), ', de multiplicar seis dieces. ',
        'Para contar cuántas veces se multiplica un número por sí mismo se usa el exponente, y esta unidad trata de los exponentes y de su operación al revés, la raíz.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos dibujos con la misma escala, en los que cada cuadrito vale 10 000 claves. Arriba, la clave de 4 cifras: un cuadrito. Lo que predice la regla de tres para la de 6 cifras: un cuadrito y medio, 15 000 claves. Lo que se cuenta: cien cuadritos, 1 000 000 de claves.',
    },
    pregunta: 'Si cada cifra que le quitas a una clave divide entre diez las claves posibles, ¿cuántas claves posibles tendría una clave que no tiene ninguna cifra?',
    ficha: {
      seLleva: 'Cada cifra que se agrega a una clave multiplica por diez las claves posibles, así que una de 6 cifras es cien veces más difícil de adivinar que una de 4, no la mitad más.',
      alcance: 'Parcial (núcleo: cambio multiplicativo y conteo; las leyes de exponentes y los radicales son formalismo que PISA no evalúa como tal). Deducción propia con el marco de Matemática 2022.',
      choque: 'La regla de tres predice que 6 cifras dan 15 000 claves, la mitad más que 4 cifras, y se cuentan 1 000 000, cien veces más.',
      atajo: 'La regla de tres (la mitad más de cifras, la mitad más de claves) y la suma de lo que aporta cada cifra (20 claves más). El atajo bueno sería contar de 000000 a 999999, que da el número sin decir por qué cada cifra multiplica; esa razón es el exponente.',
      porVerificar: [
        'Que las tarjetas de débito y crédito del Perú usen una clave de 4 cifras, y que los celulares ofrezcan claves de 4 y de 6 cifras (lo segundo es común en iPhone y Android; de memoria).',
        'El conteo de claves (10⁴ y 10⁶) es cálculo, no una medición; vale si se permite cualquier cifra en cada lugar, también repetidas y empezando en 0.',
      ],
      notas: [
        'Revisión del Escribidor Escribano (27 nov): el título calificaba («mucho más segura») y ahora dice el dato (cien veces más difícil de adivinar); «diez multiplicado cuatro veces por sí mismo» era impreciso (daría cinco dieces) y ahora dice «multiplicar cuatro dieces, uno tras otro», sin cifras sueltas que delaten la misión de la idea 2.',
        'El panel «Lo que se mide» es un conteo (cien cuadritos de 10 000), no una medida física; la figura usa la misma escala en los dos paneles, por eso el cuadrito y medio de la predicción se ve chico a propósito.',
        'La pregunta lleva a 10⁰ = 1 (una sola clave posible, la vacía) y abre la idea 1, que se pregunta por los exponentes negativos. No es una Predice ni tiene opciones.',
        'Contenido, para Gerson: el párrafo 3 dice por qué cada cifra multiplica por 10 (cada clave vieja se termina de diez maneras); es lo que sostiene seLleva y no adelanta ninguna ley de exponentes. La unidad también trae radicales y exponentes fraccionarios, que la apertura solo nombra al final («la raíz»).',
      ],
    },
  };
})());
