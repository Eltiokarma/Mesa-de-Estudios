/*
 * Apertura de «Longitud de arco y sector circular» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * El choque es la salida escalonada de los 200 m planos: todos dan la misma media vuelta y el corredor de la calle 8
 * arranca unos 26 m adelante del de la calle 1. Lo que el alumno se lleva va en ficha.seLleva. No usa los objetos de
 * la unidad (el columpio, el abanico, el limpiaparabrisas, la moneda que rueda, la bici) ni adelanta la Predice de la
 * idea 2 (al duplicar el radio, el arco se duplica y el área se cuadruplica): el texto no habla de áreas ni de dobles.
 * Tampoco escribe los números de las respuestas y las misiones (400, 2,09, 30, 20, 45…): por eso la carrera es la de
 * 200 m y no la de 400 m. Colores de la unidad (cabecera de contenido/teoria/trigonometria/longitud-de-arco-y-sector.js):
 * el giro en carmín (c-h), la distancia al centro de la curva en naranja (c-o, el radio) y el camino curvo en
 * turquesa (c-i, el arco).
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const giro = t => ({ v: 'c-h', t }), radio = t => ({ v: 'c-o', t }), arco = t => ({ v: 'c-i', t });
  const r1 = n => Math.round(n * 10) / 10;
  // La curva de la pista vista desde arriba. No está a escala: las calles van más anchas para que se vean los dos
  // corredores (a escala, la calle 8 queda apenas un 23 % más lejos del centro que la 1). Se corre de izquierda a
  // derecha por arriba y después baja la recta final. La salida de la calle 8 se adelanta lo mismo que en la pista:
  // π · (R8 − R1) de camino sobre su propia curva.
  const CY = 206, R1 = 60, R8 = 98;
  const pt = (cx, r, a) => [cx + r * Math.cos(a * Math.PI / 180), CY - r * Math.sin(a * Math.PI / 180)];
  const media = (cx, r, a0) => { const [x0, y0] = pt(cx, r, a0), [x1, y1] = pt(cx, r, 0); return `M${r1(x0)} ${r1(y0)}A${r1(r)} ${r1(r)} 0 0 1 ${r1(x1)} ${r1(y1)}`; };
  // Cuánto se adelanta la salida de la calle 8 sobre su propia línea: π · (R8 − R1) de camino, en grados de su curva.
  const ADELANTO = 180 * (R8 - R1) / R8;
  const corredor = (cx, r, a, n) => {
    const [x, y] = pt(cx, r, a), [xa, ya] = pt(cx, r - 10, a), [xb, yb] = pt(cx, r + 10, a);
    const [tx, ty] = pt(cx, n === 1 ? r - 22 : r + 22, a);
    return `<line x1="${r1(xa)}" y1="${r1(ya)}" x2="${r1(xb)}" y2="${r1(yb)}" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
      <circle cx="${r1(x)}" cy="${r1(y)}" r="7" fill="currentColor"/>
      <text x="${r1(tx)}" y="${r1(ty + 7)}" text-anchor="middle" font-size="19" font-weight="800" fill="currentColor">${n}</text>`;
  };
  const panel = (x0, titulo, escalonada, pie) => {
    const cx = x0 + 130, a8 = escalonada ? 180 - ADELANTO : 180;
    const calles = Array.from({ length: 9 }, (_, i) => {
      const r = R1 - (R8 - R1) / 14 + i * (R8 - R1) / 7;
      return `<path d="${media(cx, r, 180)}L${r1(cx + r)} ${CY + 82}M${r1(cx - r)} ${CY + 82}L${r1(cx - r)} ${CY}" fill="none" style="stroke:var(--line)" stroke-width="2"/>`;
    }).join('');
    // El camino que corre cada uno, en turquesa: el de la calle 1 entero y el de la calle 8 desde su salida.
    const tramo8 = escalonada ? `<path d="${(() => { const [xs, ys] = pt(cx, R8, 180), [xe, ye] = pt(cx, R8, a8); return `M${r1(xs)} ${r1(ys)}A${r1(R8)} ${r1(R8)} 0 0 1 ${r1(xe)} ${r1(ye)}`; })()}" fill="none" style="stroke:var(--c-i)" stroke-width="9" stroke-linecap="round" stroke-opacity=".3"/>` : '';
    const [lx, ly] = pt(cx, R8 + 8, 180 - ADELANTO / 2), [ra, rya] = pt(cx, R1, 90), [rb, ryb] = pt(cx, R8, 90);
    return `<text x="${cx}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      ${calles}
      <path d="${media(cx, R1, 180)}L${r1(cx + R1)} ${CY + 82}" fill="none" style="stroke:var(--c-i)" stroke-width="4" stroke-linecap="round"/>
      <path d="${media(cx, R8, a8)}L${r1(cx + R8)} ${CY + 82}" fill="none" style="stroke:var(--c-i)" stroke-width="4" stroke-linecap="round"/>
      ${tramo8}
      <line x1="${r1(cx + R1 - 14)}" y1="${CY + 82}" x2="${r1(cx + R8 + 14)}" y2="${CY + 82}" stroke="currentColor" stroke-width="4"/>
      <text x="${r1(cx + (R1 + R8) / 2)}" y="${CY + 108}" text-anchor="middle" font-size="18" font-weight="700" fill="currentColor">meta</text>
      <text x="${cx}" y="${CY + 50}" text-anchor="middle" font-size="19" font-weight="800" style="fill:var(--c-h)">media</text>
      <text x="${cx}" y="${CY + 74}" text-anchor="middle" font-size="19" font-weight="800" style="fill:var(--c-h)">vuelta</text>
      <line x1="${r1(ra)}" y1="${r1(rya)}" x2="${r1(rb)}" y2="${r1(ryb)}" style="stroke:var(--c-o)" stroke-width="4" stroke-linecap="round"/>
      <text x="${cx}" y="${r1(rya + 28)}" text-anchor="middle" font-size="20" font-weight="800" style="fill:var(--c-o)">8,5 m</text>
      ${corredor(cx, R1, 180, 1)}${corredor(cx, R8, a8, 8)}
      ${escalonada ? `<text x="${r1(lx)}" y="${r1(ly + 4)}" text-anchor="end" font-size="21" font-weight="800" style="fill:var(--c-i);stroke:var(--card)" stroke-width="5" paint-order="stroke">26 m</text>` : ''}
      ${pie.map((l, i) => `<text x="${cx}" y="${348 + i * 26}" text-anchor="middle" font-size="22" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 386" width="520" height="386" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="376" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', false, ['Misma media vuelta:', 'salen parejos'])}
    ${panel(260, 'Lo que se mide', true, ['La calle 8 sale', '26 m adelante'])}
  </svg>`;

  return {
    unidad: 'trigonometria.longitud-de-arco-y-sector',
    titulo: '¿Por qué en los 200 m planos el corredor de la calle de afuera sale adelante?',
    parrafos: [
      ['En una carrera de 200 m planos, cada atleta corre por su propia calle, de ', radio('1,22 m'), ' de ancho, y en la curva todos giran ',
        giro('media vuelta'), ' antes de la recta final. ',
        'Sin embargo, no salen de la misma línea: el de la calle 8, la de más afuera, arranca unos ', arco('26 m'), ' más adelante que el de la calle 1, la de más adentro.'],
      ['Si todos giran la misma media vuelta, lo esperable es que recorran lo mismo y salgan parejos, como en los 100 m planos. ',
        'Alguien dirá que se escalonan para no estorbarse al arrancar, pero en los 100 m planos corren por las mismas calles y salen todos de la misma línea.'],
      ['Los dos corredores giran lo mismo, pero el de la calle 8 corre unos ', radio('8,5 m'), ' más lejos del centro de la curva, y con el mismo giro el camino más alejado del centro es más largo. ',
        'Esos 8,5 m más afuera se vuelven unos ', arco('26 m'), ' más de camino, y la salida escalonada los descuenta para que todos lleguen a la meta habiendo corrido lo mismo. ',
        'Medir un camino curvo a partir de su giro y de su distancia al centro es el tema de esta unidad, la longitud de arco.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos dibujos iguales de la curva de una pista atlética vista desde arriba, con la calle 1 por dentro y la calle 8 por fuera, y la meta al final de la recta. Lo que predice la media vuelta igual para todos: los dos corredores salen de la misma línea. Lo que se mide: el de la calle 8 sale unos 26 m más adelante sobre su curva.',
    },
    pregunta: 'Si la curva diera solo un cuarto de vuelta en vez de media, ¿cuántos metros de ventaja crees que necesitaría el corredor de la calle 8?',
    ficha: {
      seLleva: 'En una curva, el camino de afuera es más largo aunque gire lo mismo, y crece con la distancia al centro: por eso en la pista el corredor de la calle de afuera sale adelante.',
      alcance: 'Parcial (deducción propia con el marco de Matemática 2022: espacio y forma, medir un camino curvo; las fórmulas del arco y del sector en radianes no entran en PISA).',
      choque: 'Con la misma media vuelta, todos deberían salir de la misma línea, y el de la calle 8 sale unos 26 m adelante del de la calle 1.',
      atajo: 'La explicación trampa de que se escalonan para no estorbarse: en los 100 m planos usan las mismas calles y salen parejos. El mejor alumno diría que la curva de afuera es más grande y usaría el perímetro de la circunferencia (media vuelta = π · r): ese atajo ya es la longitud de arco para un giro de media vuelta, así que se usa como puente; la pregunta lleva a un giro que no es media vuelta.',
      porVerificar: [
        'Reglamento de World Athletics para la pista de 400 m: calles de 1,22 m; la carrera se mide a 0,30 m del borde interior en la calle 1 y a 0,20 m de la línea interior en las demás, sobre curvas de unos 36,5 m de radio. De ahí: calle 1 a 36,8 m del centro y calle 8 a unos 45,24 m, 8,44 m más afuera, y π · 8,44 ≈ 26,5 m de escalonamiento en los 200 m (cálculo propio, no la tabla oficial; conviene compararlo con la tabla de marcas de salida).',
        'Que la salida de los 100 m planos sea en línea recta y pareja para todas las calles (es así en el reglamento; de memoria).',
      ],
      notas: [
        'El texto dice «unos 8,5 m» y «unos 26 m» redondeados. El 26 m en turquesa es un arco (el camino de más) y el 8,5 m en naranja es una diferencia de radios, como en la cabecera de la unidad.',
        'La pregunta se puede pensar con la proporción (la mitad del giro, la mitad de ventaja: unos 13 m) y abre la idea 1 (el arco depende del ángulo y del radio) sin dar la fórmula.',
        'La figura no está a escala (las calles van más anchas para que se vean los dos corredores); la salida de la calle 8 se adelanta π · (R8 − R1) sobre su propia curva, como en la pista.',
        'Revisión del Escribidor Escribano (27 nov): «todos dan la misma curva» chocaba con el párrafo 3, donde la gracia es que las curvas no son la misma; ahora «en la curva todos giran media vuelta». «Las dos calles giran» pasó a «los dos corredores giran», y se quitó la coma que abría un inciso sin cerrarlo. La última oración se rehízo para que el sujeto no sea una pregunta indirecta («Cuánto mide… es»).',
        'Contenido, para Gerson: el párrafo 3 ya dice por qué (el camino de afuera es más largo con el mismo giro); es lo que el alumno se lleva y no da la fórmula, pero roza el «la entrada no explica», como el párrafo 3 de la pizza.',
        'Tercera pasada (27 nov): sin ecuaciones en la oración ni palabras de doble sentido («calle» va siempre como carril de la pista). Los 8,5 m que se vuelven 26 m se dejaron como dato: escribir la cuenta con π adelantaría la pregunta del cuarto de vuelta.',
      ],
    },
  };
})());
