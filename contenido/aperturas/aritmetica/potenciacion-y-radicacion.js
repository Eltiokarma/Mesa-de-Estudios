/*
 * Apertura de «Potenciación y radicación» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * El hecho se prueba con las manos: una hoja bond A4 no se deja doblar por la mitad más de siete u ocho veces. Desde la
 * doble revisión (27 nov) no se fabrica sorpresa: la intuición de duplicar es la correcta, y la apertura la muestra
 * aplicada (128 capas, casi 13 mm, un taco que no cede). Lo que el alumno se lleva va en ficha.seLleva. No es la pizza (agrandar una figura): aquí se multiplica por dos una y otra vez. No
 * adelanta ninguna Predice (600 por 6, 2021 entre 44² y 45², 9 × 9 con residuo 18, del cubo de 8 al de 9, los 22
 * cuadrados de tres cifras, √2): no escribe 64, 36, 81, 100 ni 121, aciertos de misiones. Colores de la unidad: los
 * dobleces (el exponente) en turquesa (c-i) y las capas que salen (el número) en naranja (c-o).
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const dobleces = t => ({ v: 'c-i', t }), capas = t => ({ v: 'c-o', t });
  const r1 = n => Math.round(n * 10) / 10;

  // El papel doblado visto de costado, con la misma escala en los dos paneles: 0,1 mm de hoja = 1,4 unidades.
  const BASE = 290, K = 1.4;
  const pila = (cx, n, rotulo) => {
    const h = r1(n * K), y = r1(BASE - h), w = 120;
    // Las capas se dibujan como rayas finas; con muchas capas se ve el bloque.
    const rayas = Array.from({ length: n }, (_, i) => `M${cx - w / 2} ${r1(BASE - i * K - K / 2)}h${w}`).join('');
    return `<rect x="${cx - w / 2}" y="${y}" width="${w}" height="${h}" rx="3" style="fill:var(--c-o)" fill-opacity=".22"/>
      <path d="${rayas}" style="stroke:var(--c-o)" stroke-width=".7" fill="none"/>
      <path d="M${cx + w / 2} ${y}q${r1(Math.min(18, h / 2 + 4))} ${r1(h / 2)} 0 ${h}" fill="none" style="stroke:var(--c-o)" stroke-width="3"/>
      <rect x="${cx - w / 2}" y="${y}" width="${w}" height="${h}" rx="3" fill="none" style="stroke:var(--c-o)" stroke-width="2.5"/>
      <text x="${cx}" y="${r1(y - 12)}" text-anchor="middle" font-size="26" font-weight="800" style="fill:var(--c-o)">${rotulo}</text>`;
  };
  const panel = (x0, titulo, n, rotulo, pie) => {
    const cx = x0 + 130;
    return `<text x="${cx}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      <text x="${cx}" y="62" text-anchor="middle" font-size="20" font-weight="700" style="fill:var(--c-i)">7 dobleces</text>
      <line x1="${cx - 90}" y1="${BASE + 1}" x2="${cx + 90}" y2="${BASE + 1}" stroke="currentColor" stroke-width="2.5"/>
      ${pila(cx, n, rotulo)}
      ${pie.map((l, i) => `<text x="${cx}" y="${324 + i * 24}" text-anchor="middle" font-size="21" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 380" width="520" height="380" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="370" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', 128, '128 capas', ['Duplicar 7 veces:', '128 × 0,1 mm'])}
    ${panel(260, 'Lo que se mide', 128, 'casi 13 mm', ['Con una regla:', 'un cuaderno delgado'])}
  </svg>`;

  return {
    unidad: 'aritmetica.potenciacion-y-radicacion',
    titulo: '¿Por qué una hoja de papel no se deja doblar más de siete u ocho veces?',
    parrafos: [
      ['Toma una hoja bond A4 y dóblala por la mitad una y otra vez, sin desdoblarla: al sexto o séptimo doblez el papel ya casi no cede, por más fuerza que hagas. ',
        'La falta de fuerza no lo explica, porque el límite es casi el mismo para cualquier persona, sea un niño o un adulto fuerte.'],
      ['Lo que pasa lo puedes predecir sin doblar nada, porque cada doblez pone una mitad de la hoja sobre la otra y duplica las capas que había, así que después de ', dobleces('siete dobleces'), ' hay ', capas('128 capas'), ':',
        { linea: ['2 × 2 × 2 × 2 × 2 × 2 × 2 = ', capas('128')] },
        'Una resma de 500 hojas mide unos 50\u00a0mm de alto, así que cada hoja tiene una décima de milímetro:',
        { linea: ['50\u00a0mm ÷ 500 = 0,1\u00a0mm'] },
        'Las 128 capas forman un bloque de casi 13\u00a0mm, el grosor de un cuaderno delgado:',
        { linea: [capas('128'), ' × 0,1\u00a0mm = 12,8\u00a0mm'] }],
      ['Cada doblez también parte la hoja por la mitad, así que al final queda un taco de apenas 2 o 3\u00a0cm de lado y más de 1\u00a0cm de grueso, que se parece más a un dado que a una hoja. ',
        'Multiplicar por dos siete veces seguidas te dio las capas y el grosor sin contar nada, y de esas cuentas trata el tema de la potenciación y la radicación. ',
        'El tema estudia los números que salen de multiplicar un número por sí mismo varias veces, como los cuadrados y los cubos, y el camino de vuelta, que es la raíz.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos dibujos con la misma escala de una hoja doblada siete veces, vista de costado. Lo que predice la cuenta de duplicar en cada doblez: 128 capas de 0,1 mm. Lo que se mide con una regla: un bloque de casi 13 mm, el grosor de un cuaderno delgado.',
    },
    pregunta: 'Si en vez de doblar la hoja en dos la doblaras en tres partes iguales cada vez, como una carta, ¿cuántas capas tendrías después de tres dobleces?',
    ficha: {
      seLleva: 'Con una multiplicación repetida se predice sin doblar nada que siete dobleces juntan 128 capas, casi 13 mm de papel en un taco pequeño, y por eso una hoja no se deja doblar muchas veces.',
      alcance: 'Parcial, deducción propia (cantidad y cambio: crecimiento multiplicativo; la tabla de la entrada PISA pone «cambio multiplicativo» en exponenciales).',
      choque: 'Sin choque fabricado: la intuición del alumno (cada doblez duplica las capas) es correcta, y la apertura muestra lo que permite: predecir 128 capas y casi 13 mm sin doblar, y entender por qué la hoja deja de ceder.',
      atajo: 'La versión anterior oponía la suma de una o dos capas por doblez (unas 14 capas), que nadie haría con la hoja en la mano, porque al segundo doblez ya se ven 4. La explicación trampa es la falta de fuerza; se descarta porque el límite es casi el mismo para cualquiera. También influye que el papel se acorta a la mitad en cada doblez, y eso es otra vez una potencia de 2, y ahora el texto lo usa para decir por qué el taco ya no cede.',
      porVerificar: [
        'Tamaño del taco después de siete dobleces alternados de una A4 (210 × 297 mm): unos 26 × 19 mm, cálculo propio; con aire entre las capas, el grosor real pasa de 13 mm.',
        'Que una hoja bond A4 común no se deje doblar a mano más de siete u ocho veces (dato muy difundido; Britney Gallivan llegó a 12 con un papel muy largo en 2002; de memoria).',
        'Grosor de la hoja bond de 75 g/m²: unos 0,1 mm; una resma de 500 hojas mide unos 5 cm (de memoria; varía entre 4,5 y 5,5 cm según la marca).',
        'Que 128 capas de 0,1 mm (12,8 mm) sean «el grosor de un cuaderno delgado» (comparación propia, por verificar con un cuaderno de 50 hojas).',
      ],
      notas: [
        'Tercera pasada (27 nov): en el párrafo 2, cada cuenta va en su línea: 2 × 2 × 2 × 2 × 2 × 2 × 2 = 128 (en vez de la lista «2, 4, 8 y así hasta 128»), 50 mm ÷ 500 = 0,1 mm (la resma pasa de «unos 5 cm» a «unos 50 mm», para no meter la equivalencia 5 cm = 50 mm en la oración) y 128 × 0,1 mm = 12,8 mm. Las capas llevan su color. Sin palabras de doble sentido («fuerza» siempre es la de las manos).',
        'Doble revisión (27 nov): la versión anterior oponía «sumar una o dos capas por doblez» (unas 14 capas) a las 128 que salen al duplicar. Era un muñeco de paja: con la hoja en la mano, cualquiera ve 2 capas al primer doblez y 4 al segundo, y nadie suma. Duplicar es la intuición correcta, así que la apertura ya no fabrica sorpresa: «Lo que predice» es la cuenta de duplicar (128 capas de 0,1 mm) y «Lo que se mide», el bloque de casi 13 mm, y el texto muestra lo que permite la cuenta (saber el grosor sin doblar y ver que queda un taco pequeño que no cede). Se quitó «siempre en el mismo sentido», que haría una tira y no un taco. La falta de fuerza pasó al párrafo 1. Queda el punto de abajo (el puente hacia cuadrados y raíces), que no se resuelve con este hecho.',
        'No repite la pizza: allá se agranda una figura y su área crece con el cuadrado del ancho; aquí se multiplica por dos una y otra vez. El tema de la unidad (cuadrados, cubos y raíces) se nombra solo al final.',
        'La pregunta da 3 × 3 × 3 = 27 capas, un cubo, y abre la idea 1 (cuadrados y cubos perfectos) sin decirla. No es una Predice.',
        'Revisión del Escribidor Escribano (27 nov): «Cada doblez no agrega capas» era falso al pie de la letra (agrega tantas como había) y pasó a «no suma una capa». La última oración tenía un sujeto de 30 palabras antes de «son»; ahora el verbo llega pronto («El tema … trata de …»).',
        'Contenido, para Gerson (respuesta honesta a si el alumno llega bien a la unidad): llega a medias. Se lleva que multiplicar por lo mismo una y otra vez crece mucho más rápido que sumar, y eso le sirve para la palabra «potencia». Pero el choque deja fija la base (2) y hace crecer el exponente (los dobleces), y la unidad hace lo contrario: deja fijo el exponente (2 o 3) y mueve la base (cuadrados y cubos perfectos, residuos, √2). El «camino de vuelta» del papel tampoco es una raíz: saber cuántos dobleces dan 128 capas es un logaritmo, no una raíz. El puente real es la pregunta (tres partes, tres dobleces: 27 capas, un cubo), y el texto no lo prepara. Si Gerson quiere un choque de cuadrados o raíces, una pista: una bandeja cuadrada se arma con 49 caramelos y no con 50, aunque 50 parezca más redondo; o la diagonal de una baldosa de 1 m mide unos 1,41 m y ninguna regla la da exacta.',
        'La unidad pone el acento en cuadrados, cubos y raíces, y el choque es de potencias de 2: es la entrada más cotidiana que se encontró sin repetir la pizza ni adelantar las Predice. Si Gerson prefiere un choque de cuadrados, hay que buscar otro hecho.',
      ],
    },
  };
})());
