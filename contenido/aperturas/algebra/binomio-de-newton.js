/*
 * Apertura de «Binomio de Newton» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * El choque es propio: al lanzar tres monedas muchas veces, una cara y dos caras salen tres veces más seguido que tres
 * caras o ninguna, aunque cada moneda sea pareja. La idea de que los cuatro resultados son igual de probables predice
 * uno de cada cuatro para todos. Lo que el alumno se lleva va en ficha.seLleva. Se usan tres monedas y no cuatro para
 * no tocar la misión de la idea 1 (4 losetas con 2 turquesas dan 6 cenefas), y no se escribe ningún coeficiente de
 * (a + b)ⁿ: no se adelantan la Predice de la idea 1 (a³b² en (a + b)⁵) ni la de la idea 4 (suma de coeficientes).
 * Colores de la unidad (cabecera de contenido/teoria/algebra/binomio-de-newton.js): lo que se busca, cuántas veces
 * sale cada resultado, en violeta (c-f).
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const veces = t => ({ v: 'c-f', t });

  // Barras con la misma escala en los dos paneles (un octavo de los lanzamientos = 34 unidades de alto).
  // Lo que predice la idea de resultados parejos: 2 de cada 8 para cada uno. Lo que sale: 1, 3, 3 y 1 de cada 8.
  const U = 34, BASE = 226;
  const panel = (x0, titulo, octavos, pie) => {
    const cx = x0 + 130;
    const barras = octavos.map((n, i) => {
      const x = x0 + 34 + i * 52, h = n * U, pct = String(n * 12.5).replace('.', ',');
      return `<rect x="${x}" y="${BASE - h}" width="38" height="${h}" rx="3" style="fill:var(--c-f);stroke:var(--c-f)" fill-opacity=".3" stroke-width="2"/>
        <text x="${x + 19}" y="${BASE - h - 8}" text-anchor="middle" font-size="18" font-weight="800" style="fill:var(--c-f)">${pct}</text>
        <text x="${x + 19}" y="${BASE + 26}" text-anchor="middle" font-size="21" font-weight="700" fill="currentColor">${i}</text>`;
    }).join('');
    return `<text x="${cx}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      <text x="${cx}" y="56" text-anchor="middle" font-size="16" style="fill:var(--muted)">% de los lanzamientos</text>
      <line x1="${x0 + 24}" y1="${BASE}" x2="${x0 + 236}" y2="${BASE}" stroke="currentColor" stroke-width="2.5"/>
      ${barras}
      <text x="${cx}" y="${BASE + 50}" text-anchor="middle" font-size="17" style="fill:var(--muted)">caras en tres monedas</text>
      ${pie.map((l, i) => `<text x="${cx}" y="${BASE + 86 + i * 24}" text-anchor="middle" font-size="21" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 346" width="520" height="346" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="336" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', [2, 2, 2, 2], ['Cuatro resultados:', 'todos parejos'])}
    ${panel(260, 'Lo que se mide', [1, 3, 3, 1], ['Los del medio:', 'tres veces más'])}
  </svg>`;

  return {
    unidad: 'algebra.binomio-de-newton',
    titulo: '¿Por qué con tres monedas sale una sola cara tres veces más seguido que tres caras?',
    parrafos: [
      ['Si lanzas tres monedas a la vez, anotas cuántas caras salen y repites el lanzamiento muchas veces, las tres caras salen más o menos en ',
        veces('1 de cada 8'), ' lanzamientos, y ninguna cara, igual de poco. ',
        'En cambio, una cara sola sale más o menos en ', veces('3 de cada 8'), ' lanzamientos, y dos caras, también en 3 de cada 8: tres veces más seguido.'],
      ['Como cada moneda cae en cara o en sello con la misma probabilidad, parece justo que los cuatro resultados posibles, de cero a tres caras, salgan igual de seguido, en ',
        veces('1 de cada 4'), ' lanzamientos. ',
        'Con tres monedas se pueden anotar a mano todas las maneras de caer y contarlas, pero con ocho monedas ya son 256 maneras, y nadie las escribe una por una.'],
      ['Las tres caras se forman de una sola manera, con las tres monedas en cara, mientras que los resultados del medio se forman de varias, según cuáles monedas sean las que caen en cara. ',
        'Contar de cuántas maneras se forma cada resultado, sin anotarlas todas, es lo que hace el binomio de Newton con las potencias de una suma, y de eso trata esta unidad.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos gráficos de barras con la misma escala: qué parte de los lanzamientos de tres monedas da cero, una, dos o tres caras. Lo que predice la idea de resultados parejos: 25 % cada uno. Lo que se mide: 12,5 % para cero caras, 37,5 % para una, 37,5 % para dos y 12,5 % para tres.',
    },
    pregunta: 'Con tres monedas, ¿de cuántas maneras distintas pueden caer para que salga exactamente una cara?',
    ficha: {
      seLleva: 'Al lanzar varias monedas, los resultados del medio salen más seguido porque se pueden formar de más maneras: tres caras sale de una sola manera, y una cara, de tres.',
      alcance: 'Sí en el núcleo (probabilidad y conteo de casos: incertidumbre y datos); el desarrollo del binomio y el término general son formalismo. Deducción propia con el marco de Matemática 2022.',
      choque: 'La idea de resultados parejos predice 1 de cada 4 para cada número de caras, y las tres caras salen en 1 de cada 8, mientras que una cara sale en 3 de cada 8.',
      atajo: 'Anotar las 8 maneras de caer de tres monedas resuelve el caso a mano; el párrafo 2 lo admite y muestra que con ocho monedas ya son 256. Lo que no alcanza es la idea de que cada resultado posible es igual de probable.',
      porVerificar: [
        'Las frecuencias (1, 3, 3 y 1 de cada 8) son las probabilidades teóricas de monedas parejas; con lanzamientos reales salen cerca, no exactas. Falta un registro propio (por ejemplo, 200 lanzamientos de un salón) si se quiere decir «se mide» con datos.',
      ],
      notas: [
        'Doble revisión (27 nov): el choque es honesto (las mismas tres monedas en la predicción y en lo medido, y la idea de que todos los resultados son igual de probables es un error real y estudiado, el sesgo de equiprobabilidad de Lecoutre, de memoria). Solo cambió «salen en apenas 1 de cada 8» por «salen más o menos en 1 de cada 8», y lo mismo con 3 de cada 8: con lanzamientos de verdad las frecuencias se acercan a esas fracciones, no las clavan, y el texto ahora es cierto tal como se lee.',
        'Revisión del Escribidor Escribano (27 nov): el título decía «casi nunca salen las tres en cara», exagerado para 1 de cada 8; ahora nombra el choque con el dato (una cara sale tres veces más seguido que tres caras).',
        'Tres monedas y no cuatro: con cuatro, el seis de «dos caras» sería la respuesta de la misión de la idea 1. Por eso tampoco aparece (a + b)³ con sus coeficientes ni la suma de coeficientes de la idea 4.',
        'La pregunta se responde con el párrafo 3 (según cuál moneda cae en cara): de tres maneras. Es el «elegir en cada paréntesis» de la idea 1 con monedas, sin ser una Predice.',
        'Contenido, para Gerson: el panel «Lo que se mide» muestra probabilidades teóricas, no un conteo propio (ver porVerificar). El tipo de hecho (el azar) es distinto del de la unidad vecina (la caja de cartulina).',
      ],
    },
  };
})());
