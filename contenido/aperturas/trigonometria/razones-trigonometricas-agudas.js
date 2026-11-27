/*
 * Apertura de «Razones trigonométricas de ángulos agudos» (docs/metodo/apertura-pisa.md; criterio en
 * docs/metodo/entrada-pisa.md). El choque es la pendiente de una rampa: el porcentaje hace creer que el 100 % es una
 * pared, y una rampa de 100 % se levanta 45°, a medio camino entre el piso y la pared. Lo que el alumno se lleva va en
 * ficha.seLleva. No usa los objetos de las Predice (la escalera, el poste y su sombra, la señal, la estaca, la calamina)
 * ni adelanta la de la idea 2 (el cociente no cambia si el triángulo crece: «Son iguales»), así que el texto no compara
 * rampas grandes y chicas. Tampoco escribe los números de las respuestas y las misiones (87, 37, 20, 75, 90…): por eso
 * la pared se nombra «vertical» y no con sus grados. Colores de la unidad (cabecera de
 * contenido/teoria/trigonometria/razones-trigonometricas-agudas.js): lo que sube, el cateto opuesto, en naranja (c-o);
 * lo que avanza, el adyacente, en turquesa (c-i); el ángulo en carmín (c-h); la razón, aquí la pendiente, en violeta
 * (c-f).
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const sube = t => ({ v: 'c-o', t }), avanza = t => ({ v: 'c-i', t }), ang = t => ({ v: 'c-h', t }), pend = t => ({ v: 'c-f', t });
  const r1 = n => Math.round(n * 10) / 10;
  const PISO = 280, L = 176;
  const p = (x, a, l = L) => [x + l * Math.cos(a * Math.PI / 180), PISO - l * Math.sin(a * Math.PI / 180)];
  // Dos rampas del mismo largo, de 50 % y de 100 %, que salen del mismo punto. Solo cambia su inclinación.
  const panel = (x0, titulo, a50, a100, mide, pie) => {
    const ox = x0 + 24, [x5, y5] = p(ox, a50), [xc, yc] = p(ox, a100);
    const rampa = (x, y, w) => `<line x1="${ox}" y1="${PISO}" x2="${r1(x)}" y2="${r1(y)}" stroke="currentColor" stroke-width="${w}" stroke-linecap="round"/>`;
    const arco = (a, r) => { const [ax, ay] = [ox + r * Math.cos(a * Math.PI / 180), PISO - r * Math.sin(a * Math.PI / 180)]; return `<path d="M${ox + r} ${PISO}A${r} ${r} 0 0 0 ${r1(ax)} ${r1(ay)}" fill="none" style="stroke:var(--c-h)" stroke-width="3"/>`; };
    const catetos = mide ? `<line x1="${ox}" y1="${PISO}" x2="${r1(xc)}" y2="${PISO}" style="stroke:var(--c-i)" stroke-width="5" stroke-linecap="round"/>
      <line x1="${r1(xc)}" y1="${PISO}" x2="${r1(xc)}" y2="${r1(yc)}" style="stroke:var(--c-o)" stroke-width="5" stroke-linecap="round"/>
      <text x="${r1((ox + xc) / 2)}" y="${PISO + 26}" text-anchor="middle" font-size="19" font-weight="800" style="fill:var(--c-i)">avanza 1 m</text>
      <text x="${r1(xc + 8)}" y="${PISO - 34}" font-size="19" font-weight="800" style="fill:var(--c-o)">sube</text>
      <text x="${r1(xc + 8)}" y="${PISO - 12}" font-size="19" font-weight="800" style="fill:var(--c-o)">1 m</text>
      ${arco(a100, 46)}<text x="${ox + 54}" y="${PISO - 14}" font-size="20" font-weight="800" style="fill:var(--c-h)">45°</text>` : '';
    return `<text x="${x0 + 130}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      <line x1="${x0 + 10}" y1="${PISO}" x2="${x0 + 244}" y2="${PISO}" style="stroke:var(--muted)" stroke-width="3" stroke-linecap="round"/>
      ${catetos}
      ${rampa(x5, y5, 4)}${rampa(xc, yc, 7)}
      <text x="${r1(x5 + 6)}" y="${r1(y5 - 8)}" font-size="21" font-weight="800" style="fill:var(--c-f);stroke:var(--card)" stroke-width="5" paint-order="stroke">50 %</text>
      <text x="${r1(xc + (mide ? -8 : 10))}" y="${r1(yc - 10)}" text-anchor="${mide ? 'end' : 'start'}" font-size="21" font-weight="800" style="fill:var(--c-f);stroke:var(--card)" stroke-width="5" paint-order="stroke">100 %</text>
      <circle cx="${ox}" cy="${PISO}" r="5" fill="currentColor"/>
      ${pie.map((l, i) => `<text x="${x0 + 130}" y="${PISO + 66 + i * 26}" text-anchor="middle" font-size="22" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 386" width="520" height="386" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="376" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', 45, 90, false, ['100 %: una pared;', '50 %: a medio camino'])}
    ${panel(260, 'Lo que se mide', Math.atan(0.5) * 180 / Math.PI, 45, true, ['100 %: a medio camino;', '50 %: unos 27°'])}
  </svg>`;

  return {
    unidad: 'trigonometria.razones-trigonometricas-agudas',
    titulo: '¿Por qué una rampa con 100 % de pendiente no es una pared?',
    parrafos: [
      ['En la entrada de un colegio o de una municipalidad suele haber una rampa para sillas de ruedas, y el Reglamento Nacional de Edificaciones fija su pendiente máxima: si salva un desnivel de hasta 25 cm, puede llegar a ',
        pend('12 %'), ', es decir, subir ', sube('12 cm'), ' por cada metro que ', avanza('avanza'), ':',
        { linea: [pend('12 %'), ' = ', { frac: [[sube('12 cm')], [avanza('100 cm')]] }] },
        'Si pusieras un transportador junto a esa rampa, marcaría unos ', ang('7°'), ' sobre el piso. ',
        'Una rampa de ', pend('100 %'), ', en cambio, sube ', sube('1 m'), ' por cada ', avanza('metro'), ' que avanza:',
        { linea: [pend('100 %'), ' = ', { frac: [[sube('1 m')], [avanza('1 m')]] }] },
        'Junto a esa otra rampa, el mismo transportador marcaría ', ang('45°'), '.'],
      ['Un porcentaje suele contar partes de un todo, así que parece natural que el 100 % sea lo más empinado posible, una pared vertical, y que el 50 % quede a medio camino entre el piso y la pared. ',
        'Pero el transportador dejaría la rampa de 100 % justo a medio camino, y la de 50 % se levantaría apenas unos ', ang('27°'), '.'],
      ['La pendiente no reparte los grados que hay entre el piso y la pared: compara dos largos, lo que la rampa sube y lo que avanza. ',
        'Un cociente así, entre dos lados de un triángulo rectángulo, se llama razón trigonométrica, y es el tema de esta unidad.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos dibujos con dos rampas del mismo largo que salen del mismo punto del piso, una de 50 % y otra de 100 % de pendiente. Lo que predice el porcentaje: la de 100 % es una pared vertical y la de 50 % queda a medio camino. Lo que se mide: la de 100 %, que sube 1 m por cada metro que avanza, se levanta 45°, a medio camino, y la de 50 %, unos 27°.',
    },
    pregunta: 'Si una rampa de 100 % se levanta 45°, ¿crees que una de 200 % se levantaría el doble, hasta quedar como una pared?',
    ficha: {
      seLleva: 'La pendiente de una rampa compara lo que sube con lo que avanza y no reparte grados; por eso una rampa de 100 % se levanta 45°, a medio camino entre el piso y una pared.',
      alcance: 'Sí en el núcleo (deducción propia con el marco de Matemática 2022: la pendiente como razón entre dos cantidades, espacio y forma); el nombre y las seis razones no entran en PISA.',
      choque: 'El porcentaje hace esperar que el 100 % sea una pared y el 50 %, medio camino; la rampa de 100 % se levanta 45° y la de 50 %, unos 27°.',
      atajo: 'El mejor alumno, si sabe que la pendiente es lo que sube entre lo que avanza, lo resuelve: con 1 m y 1 m el triángulo es isósceles y el ángulo es 45°. Ese atajo ya es una razón trigonométrica (la tangente), así que se usa como puente: el párrafo 3 lo dice y nombra el tema; la pregunta lleva a un caso (200 %) que ya no sale con el triángulo isósceles.',
      porVerificar: [
        'Norma A.120 del Reglamento Nacional de Edificaciones (accesibilidad): pendiente máxima de 12 % para diferencias de nivel de hasta 0,25 m (de memoria; los demás tramos bajan hasta 2 %). Confirmar el artículo y su versión vigente.',
        'Ángulos por cálculo, no medidos: arctan 0,12 ≈ 6,8° («unos 7°»), arctan 0,5 ≈ 26,6° («unos 27°») y arctan 1 = 45°.',
      ],
      notas: [
        'La pregunta se puede intentar con lo leído: si 100 % ya es medio camino, 200 % (sube 2 m por cada metro) queda más empinada pero no llega a la pared; da unos 63°, y ninguna pendiente es una pared.',
        'El texto no dice «tangente» ni da la fórmula: la idea 1 nombra los lados desde el ángulo y la idea 2 muestra que el cociente no depende del tamaño. No se comparan rampas de distinto tamaño, para no tocar la Predice de la idea 2.',
        'Revisión del Escribidor Escribano (27 nov): el párrafo 1 decía «con un transportador se mide» y el 2, «el transportador pone», cuando los ángulos son cálculo: pasaron a condicional («marcaría», «dejaría», «se levantaría»). El párrafo 3 decía que el cociente «cambia cuando cambia el ángulo», que ya es parte de la regla: se quitó y queda solo el nombre.',
        'Tercera pasada (27 nov): el párrafo 1 saca a su línea 12 % = 12 cm / 100 cm y 100 % = 1 m / 1 m, como fracciones con los colores de lo que sube y lo que avanza; la oración larga del transportador se partió en dos para que cada línea siga a su rampa.',
      ],
    },
  };
})());
