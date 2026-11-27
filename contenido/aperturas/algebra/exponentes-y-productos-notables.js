/*
 * Apertura de «Exponentes y radicales» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * La clave de 4 cifras de la tarjeta o del celular frente a la de 6. Desde la doble revisión (27 nov) no fabrica
 * sorpresa: la intuición correcta (cada cifra multiplica por diez) se muestra aplicada al tiempo de probar todas las
 * claves y al bloqueo de la tarjeta. Lo que el alumno se lleva va en ficha.seLleva.
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

  // Cada cuadrito son 10 000 claves, con la misma escala en los dos paneles. «Lo que predice» es la intuición correcta
  // (doble revisión, 27 nov): cada cifra nueva multiplica por diez, así que 4 cifras dan un cuadrito y 5 cifras, una
  // fila de diez; la sexta vuelve a multiplicar por diez. «Lo que se mide» es el conteo de 000000 a 999999: cien
  // cuadritos, una rejilla de 10 por 10.
  const S = 17, P = 19;
  const cuadrito = (x, y) => `<rect x="${x}" y="${y}" width="${S}" height="${S}" rx="2" style="fill:var(--c-f);stroke:var(--c-f)" fill-opacity=".28" stroke-width="1.5"/>`;
  const rotulo = (x, y, n, cuantas) => `<text x="${x}" y="${y}" font-size="20" font-weight="800" fill="currentColor"><tspan style="fill:var(--c-o)">${n} cifras</tspan>: <tspan style="fill:var(--c-f)">${cuantas}</tspan></text>`;
  const panel = (x0, titulo, cuenta, pie) => {
    const cx = x0 + 130, x = x0 + 35;
    let abajo = '';
    if (!cuenta) {
      for (let c = 0; c < 10; c++) abajo += cuadrito(x + c * P, 152);
      abajo += `<text x="${x}" y="206" font-size="20" font-weight="800" fill="currentColor"><tspan style="fill:var(--c-o)">6 cifras</tspan>: diez filas</text>
        <text x="${x}" y="232" font-size="20" font-weight="800" fill="currentColor">como esa, <tspan style="fill:var(--c-f)">1 000 000</tspan></text>`;
    } else for (let f = 0; f < 10; f++) for (let c = 0; c < 10; c++) abajo += cuadrito(x + c * P, 152 + f * P);
    return `<text x="${cx}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      <rect x="${x}" y="44" width="12" height="12" rx="2" style="fill:var(--c-f);stroke:var(--c-f)" fill-opacity=".28" stroke-width="1.5"/>
      <text x="${x + 18}" y="55" font-size="16" style="fill:var(--muted)">= 10 000 claves</text>
      ${rotulo(x, 84, 4, '10 000')}
      ${cuadrito(x, 94)}
      ${cuenta ? rotulo(x, 142, 6, '1 000 000') : rotulo(x, 142, 5, '100 000')}
      ${abajo}
      ${pie.map((l, i) => `<text x="${cx}" y="${374 + i * 24}" text-anchor="middle" font-size="21" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 410" width="520" height="410" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="400" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', false, ['Cada cifra más:', 'diez veces más'])}
    ${panel(260, 'Lo que se mide', true, ['Contando todas:', 'cien veces más'])}
  </svg>`;

  return {
    unidad: 'algebra.exponentes-y-productos-notables',
    titulo: '¿Cuánto más difícil de adivinar es una clave de 6 cifras que una de 4?',
    parrafos: [
      ['La tarjeta del banco y muchos celulares piden una clave de ', cifras('4 cifras'), ', que puede ir desde 0000 hasta 9999, así que hay ',
        claves('10 000 claves'), ' posibles. ',
        'Si la clave es de ', cifras('6 cifras'), ', de 000000 a 999999, las claves posibles son ', claves('1 000 000'),
        ', cien veces más, aunque la clave solo tenga dos cifras más.'],
      ['Esa cuenta se puede hacer sin escribir ninguna lista, porque cada clave que ya tenías se puede terminar de diez maneras distintas cuando le agregas una cifra. ',
        'Así, cada cifra nueva multiplica por diez las claves posibles, y dos cifras nuevas las multiplican por cien. ',
        'Quien probara una clave por segundo tardaría menos de 3 horas en recorrer todas las de 4 cifras, y más de 11 días con las de 6 cifras.'],
      ['Por eso el banco bloquea la tarjeta después de unos pocos intentos fallidos: con 10 000 claves, probarlas todas sería cuestión de una tarde. ',
        'Las claves de ', cifras('4 cifras'), ' salen de multiplicar cuatro dieces, uno tras otro, y las de ', cifras('6 cifras'), ', de multiplicar seis dieces. ',
        'Para contar cuántas veces se multiplica un número por sí mismo se usa el exponente, y esta unidad trata de los exponentes y de su operación al revés, la raíz.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos dibujos con la misma escala, en los que cada cuadrito vale 10 000 claves. Lo que predice la idea de que cada cifra multiplica por diez: 4 cifras, un cuadrito; 5 cifras, una fila de diez cuadritos, y 6 cifras, diez filas como esa. Lo que se cuenta de 000000 a 999999: cien cuadritos, 1 000 000 de claves.',
    },
    pregunta: 'Si cada cifra que le quitas a una clave divide entre diez las claves posibles, ¿cuántas claves posibles tendría una clave que no tiene ninguna cifra?',
    ficha: {
      seLleva: 'Cada cifra que se agrega a una clave multiplica por diez las claves posibles, así que una de 6 cifras es cien veces más difícil de adivinar que una de 4, y por eso el banco bloquea la tarjeta tras pocos intentos.',
      alcance: 'Parcial (núcleo: cambio multiplicativo y conteo; las leyes de exponentes y los radicales son formalismo que PISA no evalúa como tal). Deducción propia con el marco de Matemática 2022.',
      choque: 'No hay choque fabricado (doble revisión, 27 nov): la intuición correcta, cada cifra multiplica por diez, predice 1 000 000 de claves para 6 cifras, y el conteo de 000000 a 999999 lo confirma. La apertura muestra dónde sirve: el tiempo de probarlas todas y el bloqueo de la tarjeta.',
      atajo: 'Contar de 000000 a 999999 da el número sin decir por qué cada cifra multiplica; el párrafo 2 da esa razón (cada clave vieja se termina de diez maneras) y el párrafo 3 la nombra como exponente. Se quitaron la regla de tres (15 000 claves) y la suma de lo que aporta cada cifra (20 claves más), que eran muñecos de paja.',
      porVerificar: [
        'Que las tarjetas de débito y crédito del Perú usen una clave de 4 cifras, y que los celulares ofrezcan claves de 4 y de 6 cifras (lo segundo es común en iPhone y Android; de memoria).',
        'Que los bancos bloqueen la tarjeta tras unos pocos intentos fallidos (suelen ser tres; de memoria, falta una fuente peruana como la SBS o un banco).',
        'Los tiempos son cálculo: 10 000 s son unas 2 h 47 min y 1 000 000 s, unos 11,6 días.',
        'El conteo de claves (10⁴ y 10⁶) es cálculo, no una medición; vale si se permite cualquier cifra en cada lugar, también repetidas y empezando en 0.',
      ],
      notas: [
        'Tercera pasada (27 nov): sin ecuaciones con operadores metidas en la oración ni palabras de doble sentido («cuenta» solo es la que se calcula, nunca la del banco). Se probó sacar a líneas «10 × 10 × 10 × 10 = 10 000» y la de seis dieces, pero la prueba de aperturas marca el valor 10 como acierto de la misión de la idea 2 (el junto de 10 m), así que «multiplicar cuatro dieces» y «seis dieces» se quedan en palabras.',
        'Doble revisión (27 nov): reescrita. Antes, el título era «¿Por qué dos cifras más vuelven una clave cien veces más difícil de adivinar?» y el choque enfrentaba el conteo con la regla de tres (6 cifras, la mitad más: 15 000 claves) y con la suma (20 claves más). Las dos eran muñecos de paja: el propio párrafo 1 ya contaba de 000000 a 999999 y nadie que lea eso espera 15 000. La idea es intuitiva y útil, así que ahora «Lo que predice» es la intuición correcta (cada cifra multiplica por diez) y la apertura la muestra aplicada: una clave por segundo tarda menos de 3 horas con 4 cifras y más de 11 días con 6, y por eso el banco bloquea la tarjeta. La figura cambió el cuadrito y medio de la regla de tres por la fila de diez de 5 cifras.',
        'Revisión del Escribidor Escribano (27 nov): el título calificaba («mucho más segura») y ahora dice el dato (cien veces más difícil de adivinar); «diez multiplicado cuatro veces por sí mismo» era impreciso (daría cinco dieces) y ahora dice «multiplicar cuatro dieces, uno tras otro», sin cifras sueltas que delaten la misión de la idea 2.',
        'El panel «Lo que se mide» es un conteo (cien cuadritos de 10 000), no una medida física; la figura usa la misma escala en los dos paneles.',
        'La pregunta lleva a 10⁰ = 1 (una sola clave posible, la vacía) y abre la idea 1, que se pregunta por los exponentes negativos. No es una Predice ni tiene opciones.',
        'Contenido, para Gerson: el párrafo 3 dice por qué cada cifra multiplica por 10 (cada clave vieja se termina de diez maneras); es lo que sostiene seLleva y no adelanta ninguna ley de exponentes. La unidad también trae radicales y exponentes fraccionarios, que la apertura solo nombra al final («la raíz»).',
      ],
    },
  };
})());
