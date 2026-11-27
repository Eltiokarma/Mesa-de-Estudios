/*
 * Apertura de «Magnitudes y vectores» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * El choque es el del recibo del agua: un metro cúbico son 1000 litros, no 10, aunque un metro sea diez veces 10 cm.
 * Lo que el alumno se lleva va en ficha.seLleva. Se cuida no adelantar la Predice de la idea 1 (72 km/h son 20 m por
 * segundo), la de la idea 2 (en 1 m² caben 10 000 cuadraditos de 1 cm: por eso aquí no se habla de áreas ni se dice por
 * qué el volumen crece así) ni la de la idea 3 (la dimensión de k). Colores: el largo de las aristas en violeta (c-f)
 * y el agua en turquesa (c-i); la unidad de teoría no fija colores propios.
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const r1 = n => Math.round(n * 10) / 10;
  // Cubo en perspectiva caballera: cara de frente de lado L, fondo corrido (D, −D).
  const L = 150, D = 46, BASE = 300;
  const cubo = (x, y, l, d, estilo, w = 3) => {
    const p = (a, b) => `${r1(a)} ${r1(b)}`;
    return `<path d="M${p(x, y)}L${p(x + l, y)}L${p(x + l, y - l)}L${p(x, y - l)}Z" ${estilo} stroke-width="${w}" stroke-linejoin="round"/>
      <path d="M${p(x, y - l)}L${p(x + d, y - l - d)}L${p(x + l + d, y - l - d)}L${p(x + l, y - l)}Z" ${estilo} stroke-width="${w}" stroke-linejoin="round"/>
      <path d="M${p(x + l, y)}L${p(x + l + d, y - d)}L${p(x + l + d, y - l - d)}L${p(x + l, y - l)}Z" ${estilo} stroke-width="${w}" stroke-linejoin="round"/>`;
  };
  const panel = (x0, titulo, lleno, litros, pie) => {
    const x = x0 + 130 - (L + D) / 2, y = BASE;
    const vacio = 'style="fill:var(--card)" stroke="currentColor"';
    const agua = 'style="fill:var(--c-i);stroke:var(--c-i)" fill-opacity=".28"';
    // Diez cubitos de 10 cm (un litro cada uno) en fila junto a la arista de abajo, o el cubo entero con agua.
    const s = L / 10, d = D / 10;
    const contenido = lleno ? cubo(x, y, L, D, agua, 2)
      : Array.from({ length: 10 }, (_, i) => cubo(x + i * s, y, s, d, agua, 1.5)).join('');
    return `<text x="${x0 + 130}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      ${cubo(x, y, L, D, vacio)}
      ${contenido}
      <path d="M${r1(x)} ${y}L${r1(x + L)} ${y}L${r1(x + L)} ${y - L}L${r1(x)} ${y - L}Z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
      <text x="${r1(x + L / 2)}" y="${y + 28}" text-anchor="middle" font-size="21" font-weight="800" style="fill:var(--c-f)">1 m</text>
      <text x="${r1(x + L / 2)}" y="${r1(y - L / 2 + 4)}" text-anchor="middle" font-size="30" font-weight="800" style="fill:var(--c-i)">${litros}</text>
      ${pie.map((l, i) => `<text x="${x0 + 130}" y="${364 + i * 26}" text-anchor="middle" font-size="22" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 402" width="520" height="402" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="392" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', false, '10 L', ['Diez veces más largo:', 'diez veces más agua'])}
    ${panel(260, 'Lo que se mide', true, '1000 L', ['Diez veces más largo:', 'mil veces más agua'])}
  </svg>`;

  return {
    unidad: 'fisica.magnitudes-y-vectores',
    titulo: '¿Por qué en un metro cúbico caben mil litros, si un metro es solo diez veces 10 cm?',
    parrafos: [
      ['En el recibo del agua, el consumo de tu casa viene en metros cúbicos, y un metro cúbico es el agua que llena una caja de 1 m de largo, 1 m de ancho y 1 m de alto. ',
        'Un litro, en cambio, es lo que cabe en un cubo de 10 cm de lado, y es lo que mide una jarra de un litro como la de la cocina. ',
        'Si llenas la caja de un metro y sacas su agua con esa jarra, tienes que llenar la jarra 1000 veces, así que en un metro cúbico caben mil litros:',
        { linea: [{ v: 'c-i', t: '1 m³' }, ' = ', { v: 'c-i', t: '1000 L' }] },
        'Es casi lo que guarda el tanque de 1100\u00a0L que muchas casas tienen en el techo.'],
      ['La cuenta rápida, la misma que sirve para pasar de metros a centímetros, parte de que un metro son diez veces 10 cm:',
        { linea: [{ v: 'c-f', t: '1 m' }, ' = 10 × ', { v: 'c-f', t: '10 cm' }] },
        'Con esa cuenta, en la caja de un metro cabrían diez litros, los de una fila de cubitos de un litro puestos uno junto al otro. ',
        'Esa cuenta se queda corta por mucho, porque diez litros apenas llenan un balde y la caja de un metro llena casi un tanque entero.'],
      'El lado de la caja mide diez veces el del cubo de un litro, y aun así la caja no guarda diez litros sino mil, cien veces más de lo que daba la cuenta. ' +
        'Este tema trata de las magnitudes y sus unidades: cómo pasar de una unidad de medida a otra sin cambiar el tamaño de lo que mides, y cómo saber si una fórmula tiene sentido.',
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos cajas iguales de 1 m de lado. Lo que predice la cuenta de multiplicar por diez: adentro caben 10 litros, una fila de diez cubitos de un litro. Lo que se mide: la caja llena guarda 1000 litros, mil veces el litro.',
    },
    pregunta: 'Si en una caja de 1 m de lado caben 1000 litros, ¿cuántos litros crees que cabrían en una caja de 2 m de lado?',
    ficha: {
      seLleva: 'Un volumen no crece como un largo: una caja diez veces más larga, ancha y alta guarda mil veces más agua, y por eso un metro cúbico son 1000 litros y no 10.',
      alcance: 'Parcial (núcleo: una cantidad se puede expresar en unidades distintas sin cambiar de tamaño; cómo cambia un volumen al cambiar de escala). El análisis dimensional formal no entra en PISA.',
      choque: 'Un metro son diez veces 10 cm, así que la cuenta lineal da 10 litros en un metro cúbico; se miden 1000 litros.',
      atajo: 'Multiplicar por diez, la regla de una conversión de largos, que es la predicción. El mejor alumno sabría que el volumen es largo por ancho por alto y llegaría a 1000; esa es justamente la pregunta de la unidad (cómo cambian las unidades de un volumen o un área), así que el texto no la responde con la cuenta. No hay una explicación trampa conocida.',
      porVerificar: [
        'Que el recibo de agua de Sedapal (y de las demás empresas de agua del Perú) traiga el consumo en metros cúbicos (de memoria; es lo esperado).',
        'Que los tanques de 1100 L para el techo sean comunes en las casas del Perú (de memoria: Rotoplas y Eternit venden ese tamaño).',
        'Lo de que 1 m³ = 1000 L y 1 L = 1 dm³ es una definición, no una medición: la medición que el alumno puede hacer es contar las jarras, y el texto no dice que alguien lo haya hecho.',
      ],
      notas: [
        'La pregunta se puede intentar con el párrafo 1: quien siga la regla lineal dirá 2000 L; quien vea la caja de 2 m llena de cajas de un metro contará 8, es decir, 8000 L. La clase recoge esa respuesta para presentar las áreas y volúmenes (idea 2).',
        'Contenido, para Gerson: el choque del volumen prepara la idea 2, cuya Predice es de áreas (10 000 cuadraditos en 1 m²). El texto no da ese valor ni el mecanismo (largo por ancho por alto), pero quien lo leyó llega a la Predice sabiendo que las unidades de área no se convierten como las de largo. Decidir si se acepta.',
        'La figura dibuja los diez cubitos de la predicción en la arista de abajo, para que se vea qué parte de la caja ocupa esa cuenta; no dibuja las capas de cubitos para no dar el mecanismo.',
        'Revisión del Escribidor Escribano (27 nov): el párrafo 3 abría con la regla de la idea 2 («Un largo y un volumen no cambian de la misma manera cuando pasas de una unidad a otra»); ahora abre con el choque del caso (la caja tiene diez veces el lado del cubo de un litro y guarda mil litros, cien veces lo que daba la cuenta). El párrafo 1 decía «vaciar la jarra 1000 veces, casi lo que guarda el tanque», que comparaba veces con litros: ahora dice «son 1000 litros». Se quitó un «muchas» de dos seguidos. Sobre la Predice de la idea 2 (10 000 cuadraditos en 1 m²): no la delata. La apertura no habla de áreas, no da el mecanismo y el juego de la idea 2, que va antes de la Predice, ya muestra cómo se cubre un piso con cuadros de 1 dm. Lo más que hace es poner en guardia contra el distractor «100» (una sola fila), que es lo que la idea quiere enseñar; el distractor «1000» sigue tentando a quien traiga el número de la apertura.',
        'Doble revisión (27 nov): «La cuenta que haría cualquiera es esta» pasó a «La cuenta rápida, la misma que sirve para pasar de metros a centímetros, es esta», porque no todos la hacen y el error real es usar para un volumen el factor de los largos. El choque es justo: la caja, el litro y las cantidades son los mismos en la predicción y en la medición.',
        'Tercera pasada (27 nov): el párrafo 1 saca a su línea 1 m³ = 1000 L (antes «son 1000 litros» en la oración) y el párrafo 2, 1 m = 10 × 10 cm (antes «un metro son diez veces 10 cm» en medio de la cuenta). En el párrafo 3, «Esta unidad trata de las magnitudes y sus unidades: cómo pasar de una unidad a otra» mezclaba la unidad del curso con la de medida: ahora «Este tema trata… de una unidad de medida a otra».',
      ],
    },
  };
})());
