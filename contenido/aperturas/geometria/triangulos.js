/*
 * Apertura de «Triángulos y líneas notables» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * Parte del caminito pelado que cruza en diagonal el pasto de una plaza: en una plaza cuadrada de 50 m de lado, por
 * las veredas se caminan 100 m y por la diagonal unos 71 m. La intuición acierta (ir derecho es más corto que dar la
 * vuelta por dos lados) y la apertura la muestra aplicada, sin choque forzado (doble revisión, 27 nov; antes era un
 * tallarín partido al azar). La pregunta invita a usar esa intuición con tres palitos, sin dar la regla ni números; no
 * se adelanta la Predice de la idea 4 (el codo de la lámpara: entre 15 cm y 65 cm, sin llegar) ni la de la idea 1, y
 * no se escribe ningún número de las misiones ni de las respuestas (12, 15, 30, 60, 62, 65, 90, 120, 180, 360).
 * Colores de la unidad (cabecera de contenido/teoria/geometria/triangulos.js): los dos lados por las veredas en
 * naranja (c-o) y turquesa (c-i); el tercero, el caminito, en tinta.
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  // El mismo parque cuadrado, visto desde arriba, en los dos paneles: A abajo a la izquierda y C arriba a la derecha.
  // Por las veredas se va de A a B (naranja) y de B a C (turquesa); por el caminito, de A a C (tinta, punteado).
  const L = 170, X = 40, Y = 74;
  const panel = (x0, titulo, mide, pie) => {
    const cx = x0 + 130, ax = x0 + X, ay = Y + L, bx = x0 + X + L, by = Y + L, Cx = x0 + X + L, Cy = Y;
    const cotas = mide
      ? `<text x="${(ax + bx) / 2}" y="${ay + 28}" text-anchor="middle" font-size="19" font-weight="800" style="fill:var(--c-o)">50 m</text>
      <text x="${bx - 12}" y="${(by + Cy) / 2 + 6}" text-anchor="end" font-size="19" font-weight="800" style="fill:var(--c-i)">50 m</text>
      <text x="${(ax + Cx) / 2 - 14}" y="${(ay + Cy) / 2 - 10}" text-anchor="middle" font-size="19" font-weight="800" fill="currentColor" transform="rotate(-45 ${(ax + Cx) / 2 - 14} ${(ay + Cy) / 2 - 10})">unos 71 m</text>`
      : `<text x="${(ax + bx) / 2}" y="${ay + 28}" text-anchor="middle" font-size="19" font-weight="800" style="fill:var(--c-o)">vereda</text>
      <text x="${bx - 12}" y="${(by + Cy) / 2 + 6}" text-anchor="end" font-size="19" font-weight="800" style="fill:var(--c-i)">vereda</text>`;
    return `<text x="${cx}" y="32" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      <rect x="${ax}" y="${Cy}" width="${L}" height="${L}" style="fill:var(--muted);fill-opacity:.18"/>
      <line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" style="stroke:var(--c-o)" stroke-width="6" stroke-linecap="round"/>
      <line x1="${bx}" y1="${by}" x2="${Cx}" y2="${Cy}" style="stroke:var(--c-i)" stroke-width="6" stroke-linecap="round"/>
      <line x1="${ax}" y1="${ay}" x2="${Cx}" y2="${Cy}" stroke="currentColor" stroke-width="4" stroke-dasharray="3 7" stroke-linecap="round"/>
      <circle cx="${ax}" cy="${ay}" r="7" fill="currentColor"/><circle cx="${Cx}" cy="${Cy}" r="7" fill="currentColor"/>
      ${cotas}
      ${pie.map((l, i) => `<text x="${cx}" y="${330 + i * 26}" text-anchor="middle" font-size="21" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 380" width="520" height="380" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="370" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', false, ['Por el caminito', 'se camina menos'])}
    ${panel(260, 'Lo que se mide', true, ['100 m por las veredas,', 'unos 71 m por el caminito'])}
  </svg>`;

  return {
    unidad: 'geometria.triangulos',
    titulo: '¿Por qué en el pasto de una plaza aparece un caminito pelado en diagonal?',
    parrafos: [
      'En muchas plazas, aunque un letrero pida no pisar el pasto, aparece un caminito de tierra que cruza en diagonal, de una esquina a la de enfrente. ' +
        'En una plaza cuadrada de 50 m de lado, quien da la vuelta por las veredas camina 100 m, y quien corta por el caminito camina unos 71 m.',
      'Aquí la intuición acierta: ir derecho es más corto que dar la vuelta por dos lados, y la gente lo sabe sin sacar ninguna cuenta. ' +
        'Y no depende de que la plaza sea cuadrada: en una plaza chueca, de cualquier forma, cortar derecho de una esquina a otra también ahorra camino.',
      'Las dos veredas y el caminito forman un triángulo, y lo que la gente sabe sin medir es una de las reglas que atan sus lados. ' +
        'Esas reglas, junto con las que unen sus ángulos y las líneas que se trazan dentro de él, son el tema de esta unidad: los triángulos y sus líneas notables.',
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos dibujos de la misma plaza cuadrada visto desde arriba, con el camino por dos veredas y el caminito en diagonal entre dos esquinas. Lo que predice: por el caminito se camina menos. Lo que se mide: 100 m por las veredas y unos 71 m por el caminito.',
    },
    pregunta: 'Con lo que sabes del caminito, ¿qué tiene que pasar con los largos de tres palitos para que se puedan juntar, punta con punta, y formar un triángulo?',
    ficha: {
      seLleva: 'Ir derecho de un punto a otro es más corto que dar la vuelta por dos lados, y esa idea de todos los días es una regla de los lados de cualquier triángulo.',
      alcance: 'Sí, por deducción propia (espacio y forma; cantidad: comparar caminos y medidas).',
      choque: 'No hay choque forzado (regla 7 de la segunda revisión): la intuición acierta, el caminito en diagonal (unos 71 m) ahorra camino frente a las dos veredas (100 m). La apertura la muestra aplicada y la pregunta invita a usarla con tres palitos.',
      atajo: 'La intuición misma, «derecho es más corto», que aquí es la buena. No se da la regla en forma de desigualdad ni con números: la pregunta la pide y la idea 4 la mide con la lámpara.',
      porVerificar: [
        'La diagonal de un cuadrado de 50 m mide 50 × raíz de 2, unos 70,7 m: cálculo, no una medición de un parque real.',
        'Que en las plazas y parques del Perú aparezcan caminitos pelados en el pasto (los «caminos del deseo») aunque haya letreros de no pisar: observación común, de memoria.',
      ],
      notas: [
        'Doble revisión (27 nov): la versión anterior partía un tallarín crudo en dos puntos al azar y decía que «casi todos esperan que el triángulo salga siempre». Gerson preguntó si alguien de verdad espera eso, y no hay fuente que lo sostenga: era un muñeco de paja, y la sorpresa de «una de cada cuatro» dependía de esa expectativa. La idea de fondo (si un lado es muy largo, los otros dos no alcanzan) es intuitiva y útil, así que la apertura se reescribió para mostrarla aplicada, con «Lo que predice» como la intuición correcta, según la regla 7. Se cambiaron el título, los tres párrafos, la figura, la pregunta y la ficha. El problema del palo roto (1/4, verificado en la web en la primera revisión) queda como idea para el laboratorio o una lectura, no para la apertura.',
        'La figura es el mismo parque en los dos paneles; en «Lo que se mide» las veredas llevan sus 50 m y el caminito, unos 71 m. Los 71 m salen de Pitágoras, que el alumno no necesita: el texto los da como medida.',
        'No aparece ninguna medida de la lámpara de la idea 4 (40 cm y 25 cm) ni los topes 15 cm y 65 cm.',
      ],
    },
  };
})());
