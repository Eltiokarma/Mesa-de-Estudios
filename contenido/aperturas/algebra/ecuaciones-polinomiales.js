/*
 * Apertura de «Ecuaciones polinomiales» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * El choque es propio: con un cuadrado de cartulina de 20 cm se arma una caja sin tapa cortando un cuadradito en cada
 * esquina. Con cortes de 5 cm sale una caja honda de medio litro, y con cortes de unos 1,9 cm sale una caja plana que
 * también guarda medio litro. Quien espera «corte más grande, caja de más capacidad» espera una sola respuesta.
 * Lo que el alumno se lleva va en ficha.seLleva. No adelanta ninguna Predice (2 raíces no reales, producto −5, 3/2,
 * 2 − 3i, 2 raíces reales, suma −2) ni las frases de sus misiones (la caja de aristas de la idea 2 no se nombra).
 * Colores de la unidad (cabecera de contenido/teoria/algebra/ecuaciones-polinomiales.js): la raíz, que aquí es el
 * corte, en violeta (c-f).
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const corte = t => ({ v: 'c-f', t });
  const r1 = n => Math.round(n * 10) / 10;

  // V(x) = x (20 − 2x)². V = 500 en x = 5 (caja de 10 × 10 × 5) y en x = (15 − √125)/2 ≈ 1,91 (caja de 16,2 × 16,2
  // × 1,9). La tercera raíz, ≈ 13,09, no cabe en la cartulina. Las dos cajas, con la misma escala (1 cm = 6,5
  // unidades) en los dos paneles, dibujadas en perspectiva caballera; solo cambia lo que se espera de la plana.
  const K = 6.5;
  // Caja sin tapa: cara del frente, costado derecho y, por la abertura, el fondo y las paredes de adentro (recortados
  // a la abertura), para que se lea hueca y no como un bloque.
  let n = 0;
  const caja = (x, yb, lado, alto) => {
    const w = lado * K, h = alto * K, dx = w * 0.42, dy = -w * 0.3, yt = yb - h, id = `ap-caja-${n++}`;
    const P = pts => 'M' + pts.map(p => `${r1(p[0])} ${r1(p[1])}`).join('L') + 'Z';
    const boca = P([[x, yt], [x + w, yt], [x + w + dx, yt + dy], [x + dx, yt + dy]]);
    return `<clipPath id="${id}"><path d="${boca}"/></clipPath>
      <path d="${P([[x + w, yb], [x + w + dx, yb + dy], [x + w + dx, yt + dy], [x + w, yt]])}" style="fill:var(--card)" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="${boca}" style="fill:var(--muted)" fill-opacity=".38"/>
      <g clip-path="url(#${id})">
        <path d="${P([[x + dx, yt + dy], [x + w + dx, yt + dy], [x + w + dx, yt + dy + h], [x + dx, yt + dy + h]])}" style="fill:var(--card)" fill-opacity=".85" stroke="currentColor" stroke-width="1.5"/>
        <path d="${P([[x, yt], [x + dx, yt + dy], [x + dx, yt + dy + h], [x, yt + h]])}" style="fill:var(--muted)" fill-opacity=".3" stroke="currentColor" stroke-width="1.5"/>
      </g>
      <path d="${boca}" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>
      <rect x="${r1(x)}" y="${r1(yt)}" width="${r1(w)}" height="${r1(h)}" style="fill:var(--card)" stroke="currentColor" stroke-width="2.5"/>
      <line x1="${r1(x - 8)}" y1="${r1(yt)}" x2="${r1(x - 8)}" y2="${r1(yb)}" style="stroke:var(--c-f)" stroke-width="3.5" stroke-linecap="round"/>`;
  };
  const panel = (x0, titulo, plana, pie) => {
    const cx = x0 + 130;
    return `<text x="${cx}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      ${caja(x0 + 34, 152, 10, 5)}
      <text x="${x0 + 136}" y="118" font-size="19" font-weight="800" style="fill:var(--c-f)">corte 5 cm</text>
      <text x="${x0 + 136}" y="142" font-size="19" font-weight="700" fill="currentColor">500 cm³</text>
      ${caja(x0 + 34, 262, 16.2, 1.9)}
      <text x="${cx}" y="292" text-anchor="middle" font-size="19" fill="currentColor"><tspan font-weight="800" style="fill:var(--c-f)">corte 1,9 cm</tspan><tspan font-weight="700">: ${plana}</tspan></text>
      ${pie.map((l, i) => `<text x="${cx}" y="${330 + i * 24}" text-anchor="middle" font-size="21" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 368" width="520" height="368" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="358" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', 'mucho menos', ['Medio litro:', 'un solo corte'])}
    ${panel(260, 'Lo que se mide', '500 cm³', ['Medio litro:', 'dos cortes'])}
  </svg>`;

  return {
    unidad: 'algebra.ecuaciones-polinomiales',
    titulo: '¿Por qué una caja honda y una caja plana, hechas con la misma cartulina, guardan lo mismo?',
    parrafos: [
      ['Para armar una caja sin tapa con un cuadrado de cartulina de 20 cm de lado, se corta un cuadradito igual en cada esquina y se doblan los cuatro bordes hacia arriba. ',
        'Con cortes de ', corte('5 cm'), ' sale una caja honda de 10 cm de ancho y 5 cm de alto, que se llena con medio litro de arroz, una cantidad que en centímetros cúbicos se escribe así:',
        { linea: ['0,5 L = 500 cm³'] },
        'Con cortes de unos ', corte('1,9 cm'), ' sale una caja plana de unos 16,2 cm de ancho, y en ella también cabe el medio litro de arroz.'],
      ['Lo esperable es que un corte más grande dé una caja más honda y, por eso, de más capacidad, de modo que para medio litro habría un solo corte posible. ',
        'Con esa idea en la cabeza, quien busca la caja de medio litro probando cortes con la calculadora se detiene al encontrar el de 5 cm, convencido de que no hay otro.'],
      ['Al agrandar el corte, la caja gana altura pero pierde fondo, y por eso un corte chico y uno grande pueden terminar guardando lo mismo. ',
        'La cuenta del volumen con un corte desconocido es una ecuación de tercer grado, y esta unidad trata de las ecuaciones polinomiales, de cuántas soluciones pueden tener y de cómo encontrarlas.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos dibujos con la misma escala de dos cajas sin tapa hechas con la misma cartulina: una honda, con cortes de 5 cm, que guarda 500 cm³, y una plana, con cortes de 1,9 cm. Lo que predice la idea de que un corte más grande da más capacidad: la plana guarda mucho menos. Lo que se mide: la plana también guarda 500 cm³.',
    },
    pregunta: 'Con la misma cartulina de 20 cm de lado, ¿crees que algún corte dará una caja de un litro, es decir, de 1000 cm³?',
    ficha: {
      seLleva: 'Una misma pregunta, como qué corte da una caja de medio litro, puede tener más de una respuesta correcta, y quien se detiene en la primera se pierde las otras.',
      alcance: 'Parcial (núcleo: modelar una situación y ver cuántas soluciones tiene; las relaciones de Vieta, las raíces racionales y las conjugadas son formalismo). Deducción propia con el marco de Matemática 2022.',
      choque: 'La idea de «corte más grande, más capacidad» predice un solo corte para medio litro y hay dos: 5 cm y unos 1,9 cm.',
      atajo: 'Probar cortes con la calculadora encuentra el de 5 cm y se detiene; el párrafo 2 lo dice. La regla «más corte, más capacidad» es la idea previa que falla. La fórmula de la cuadrática no alcanza sin antes saber que hay una raíz (5) y bajar el grado, que es tema de la unidad.',
      porVerificar: [
        'Las dos capacidades son cálculo: 5 · 10² = 500 cm³ y 1,91 · 16,18² ≈ 500 cm³ (con 1,9 cm exactos da unos 499 cm³). Falta armar las dos cajas y llenarlas con medio litro de arroz para decir que «cabe» por medición; el arroz no rellena los rincones como el agua.',
        'La capacidad máxima, con cortes de unos 3,3 cm, es de unos 593 cm³ (cálculo): por eso la pregunta tiene respuesta «no».',
        'Que la cartulina se pueda doblar en bordes de 1,9 cm sin romperse es de memoria.',
      ],
      notas: [
        'Tercera pasada (27 nov): la equivalencia «medio litro, es decir, 500 cm³» del párrafo 1 salió a su línea (0,5 L = 500 cm³) y la oración termina en dos puntos antes de ella. La pregunta repite «un litro, es decir, de 1000 cm³», pero no se toca porque esta pasada no cambia preguntas. Sin palabras de doble sentido («grado» solo es el de la ecuación).',
        'Revisión del Escribidor Escribano (27 nov): el párrafo 3 decía que la capacidad «primero sube y después baja», que es casi la respuesta de la pregunta guía (hay un máximo); ahora deja la pista (gana altura, pierde fondo) y el choque (un corte chico y uno grande guardan lo mismo). «Suele parar» era una generalización sin dato y ahora es «se detiene», atado a la idea del párrafo.',
        'La pregunta se puede intentar con el párrafo 3: si la capacidad sube y después baja, hay un máximo, y si ese máximo no llega a 1000 cm³, ningún corte sirve (no llega: unos 593 cm³). El alumno que no lo ve puede probar cortes. Abre la idea de que una ecuación puede tener menos soluciones reales que su grado sin responder la Predice de la idea 1.',
        'La tercera raíz de la cúbica (unos 13,1 cm) no cabe en la cartulina; la apertura no la nombra, y la unidad la recoge cuando cuenta raíces y grado.',
        'Contenido, para Gerson: el párrafo 3 da el mecanismo (gana altura, pierde fondo) en una oración; es lo que hace creíble el choque sin dar la ecuación.',
      ],
    },
  };
})());
