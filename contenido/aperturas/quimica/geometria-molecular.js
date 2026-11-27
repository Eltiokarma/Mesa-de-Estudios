/*
 * Apertura de «Geometría molecular» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * Segunda versión (27 nov), escrita desde cero: Gerson rechazó la primera (la hibridación del metano, el ejemplo del
 * skill) porque el alumno no se llevaba nada y el choque de los orbitales no se entendía sin saber el tema. El choque
 * nuevo se ve en la cocina: el hielo flota y la botella revienta en el congelador, cuando casi todo se aprieta al
 * enfriarse. Lo que el alumno se lleva (ficha.seLleva): la forma de la molécula decide cómo se comporta la sustancia.
 * La figura no dibuja moléculas, para no adelantar la idea 1 («¿Por qué el agua no es una molécula recta?»); la
 * pregunta abre esa idea sin responderla. No toca la Predice del NH₃ (idea 1), del CH₂Cl₂ (idea 3) ni la del H₂S y el
 * H₂O (idea 4). Colores: el agua líquida en turquesa (c-i); el hielo, en el color de la tarjeta con borde de tinta.
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const r1 = n => Math.round(n * 10) / 10;

  // Dos vasos iguales con la misma agua y el mismo cubo de hielo (lado L). Al flotar, el hielo deja afuera
  // 1 − 0,917 ≈ 8 % de su alto: es la densidad del hielo (0,917 g/cm³) frente a la del agua (1,000 g/cm³).
  const ARRIBA = 66, ABAJO = 300, NIVEL = 128, L = 76;
  const vaso = cx => {
    const a = 84, b = 64;
    return { borde: `M${cx - a} ${ARRIBA}L${cx - b} ${ABAJO}Q${cx - b} ${ABAJO + 8} ${cx - b + 8} ${ABAJO + 8}L${cx + b - 8} ${ABAJO + 8}Q${cx + b} ${ABAJO + 8} ${cx + b} ${ABAJO}L${cx + a} ${ARRIBA}`,
      ancho: y => a - (a - b) * (y - ARRIBA) / (ABAJO - ARRIBA) };
  };
  const panel = (x0, titulo, flota, pie) => {
    const cx = x0 + 130, v = vaso(cx), wN = v.ancho(NIVEL), wF = v.ancho(ABAJO);
    const yHielo = flota ? NIVEL - r1(L * (1 - 0.917)) : ABAJO + 8 - L - 3;
    const liquido = `M${r1(cx - wN)} ${NIVEL}L${cx - 64} ${ABAJO}Q${cx - 64} ${ABAJO + 8} ${cx - 56} ${ABAJO + 8}L${cx + 56} ${ABAJO + 8}Q${cx + 64} ${ABAJO + 8} ${cx + 64} ${ABAJO}L${r1(cx + wN)} ${NIVEL}Z`;
    // Aristas del cubo en perspectiva leve, para que se lea como un cubito y no como un cuadrado.
    const x = cx - L / 2 - 6, y = r1(yHielo), d = 10;
    const cubo = `<path d="M${x} ${y}l${d} ${-d}h${L}v${L}l${-d} ${d}" style="fill:var(--card)" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>
      <rect x="${x}" y="${y}" width="${L}" height="${L}" rx="4" style="fill:var(--card)" stroke="currentColor" stroke-width="2.5"/>
      <line x1="${x + L}" y1="${y}" x2="${x + L + d}" y2="${y - d}" stroke="currentColor" stroke-width="2.5"/>
      <text x="${x + L / 2}" y="${r1(y + L / 2 + 7)}" text-anchor="middle" font-size="19" font-weight="700" fill="currentColor">hielo</text>`;
    return `<text x="${cx}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      ${cubo}
      <path d="${liquido}" style="fill:var(--c-i)" fill-opacity=".22"/>
      <line x1="${r1(cx - wN)}" y1="${NIVEL}" x2="${r1(cx + wN)}" y2="${NIVEL}" style="stroke:var(--c-i)" stroke-width="3" stroke-linecap="round"/>
      <path d="${v.borde}" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/>
      <text x="${r1(cx + wF - 4)}" y="${flota ? 280 : NIVEL + 30}" text-anchor="end" font-size="20" font-weight="700" style="fill:var(--c-i)">agua</text>

      ${pie.map((l, i) => `<text x="${cx}" y="${346 + i * 26}" text-anchor="middle" font-size="22" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 384" width="520" height="384" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="374" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', false, ['Más apretado:', 'se hunde'])}
    ${panel(260, 'Lo que se mide', true, ['Ocupa 9 % más:', 'flota'])}
  </svg>`;

  return {
    unidad: 'quimica.geometria-molecular',
    titulo: '¿Por qué el hielo flota, si casi todo sólido se hunde en su líquido?',
    parrafos: [
      ['Si dejas una botella llena de agua en el congelador, al día siguiente la encuentras hinchada o rajada, porque el agua ocupa más espacio cuando se congela. ',
        'Al congelarse, cada litro de agua da algo más de un litro de hielo:',
        { linea: ['1 L de agua → 1,09 L de hielo'] },
        'Por eso un cubito flota en un vaso de agua con casi la décima parte afuera.'],
      ['Casi todo lo que conoces se encoge al enfriarse, y la mayoría de las sustancias quedan más apretadas cuando se vuelven sólidas. ',
        'Con la parafina de una vela pasa así: un trozo de vela sólida se hunde en la parafina derretida, y el hielo tendría que hundirse igual en el fondo del vaso. ',
        'Tampoco sirve decir que el hielo flota por el aire que tiene atrapado, porque un hielo transparente, sin una sola burbuja, también flota.'],
      ['El agua se comporta al revés que la parafina por la forma de su molécula. ',
        'Al congelarse, las moléculas de agua se enganchan unas con otras en un orden fijo que deja huecos entre ellas, y ese orden lo decide la forma de cada molécula. ',
        'Esta unidad trata de esa forma, la geometría molecular, y de cómo la forma de una molécula cambia lo que hace una sustancia.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos vasos iguales con agua y el mismo cubito de hielo. Lo que predice la regla de que los sólidos son más apretados: el hielo en el fondo del vaso. Lo que se mide: el hielo ocupa 9 % más que el agua de la que salió y flota, con casi la décima parte afuera.',
    },
    pregunta: 'Si la forma de la molécula de agua es lo que deja huecos en el hielo, ¿crees que su oxígeno y sus dos hidrógenos van en línea recta o forman un ángulo?',
    ficha: {
      seLleva: 'La forma de una molécula decide cómo se comporta una sustancia: por la forma de la molécula de agua, el hielo queda con huecos y flota.',
      alcance: 'Parcial (núcleo: la estructura de las partículas explica una propiedad que se ve; la teoría de repulsión de regiones y la hibridación no entran en PISA).',
      choque: 'Los sólidos suelen ser más apretados que su líquido y se hunden en él, como la parafina; el hielo ocupa 9 % más que el agua y flota.',
      atajo: 'La explicación trampa del aire atrapado: un hielo transparente, sin burbujas, también flota. Decir que el hielo «es más liviano» solo repite el hecho (ocupa más con la misma masa) y no dice por qué.',
      porVerificar: [
        'Densidad del hielo a 0 °C, unos 0,917 g/cm³, y del agua líquida, unos 1,000 g/cm³: de ahí salen los 1,09 L de hielo por litro de agua y el 8 % que asoma en agua dulce.',
        'Que la parafina sólida sea más densa que la derretida y un trozo de vela se hunda en ella (de memoria; es lo esperado, pero conviene probarlo con una vela).',
        'Que el hielo transparente, hecho sin burbujas, también flote (se deduce de la densidad del hielo puro).',
        'La red del hielo: cada molécula se une a cuatro vecinas por puentes de hidrógeno en un arreglo tetraédrico que deja huecos; el texto lo dice como «un orden fijo que deja huecos», sin los nombres.',
      ],
      notas: [
        'Tercera pasada (27 nov): la equivalencia «cada litro de agua da unos 1,09 L de hielo» sale a una línea sola (1 L de agua → 1,09 L de hielo), con la oración de antes terminada en dos puntos y la consecuencia («Por eso un cubito flota…») debajo. Sin palabras de doble sentido.',
        'Doble revisión (27 nov): sin cambios (piloto aprobado). Cuentas rehechas: 1 / 0,917 = 1,09 L de hielo por litro y 1 − 0,917 = 8 % afuera, «casi la décima parte». Para Gerson: el alumno sabe que el hielo flota, así que el párrafo 2 no le atribuye la creencia contraria; la deduce de la regla general («casi todo sólido se hunde en su líquido», con la parafina como caso visto), y la pregunta del título es por qué el agua es la excepción. No es un muñeco de paja, pero si se quisiera la versión del punto 7, la apertura mostraría el hielo que flota aplicado (los lagos que se congelan por arriba y no por abajo).',
        'El párrafo 3 dice que la forma decide el orden del hielo y no explica cómo: ni las regiones de electrones, ni los pares libres, ni los puentes de hidrógeno. Eso queda para las ideas 1, 3 y 4.',
        'La pregunta abre la idea 1 («¿Por qué el agua no es una molécula recta?») y se puede intentar con lo leído: una forma doblada se acomoda peor que un palito. No es una Predice ni tiene opciones.',
        'Revisión del Escribidor Escribano (27 nov): el título decía «si está hecho de la misma agua», que no nombra el choque (de qué otra cosa estaría hecho); ahora nombra la expectativa que se rompe, la misma del párrafo 2 y del panel «Lo que predice». El párrafo 3 abría con «no es de qué está hecha, sino…» (simetría de plantilla que respondía al título viejo) y ahora retoma la parafina. En la pregunta, el inciso entre el sujeto y el verbo pasó a ser el sujeto.',
        'Contenido, para Gerson: el párrafo 3 afirma que la forma de la molécula decide el orden con huecos, y el alumno tiene que creerlo sin verlo; es lo que se lleva, pero no lo puede comprobar en la apertura. Si se quiere que lo vea, haría falta un tercer dibujo (moléculas dobladas que dejan huecos) que adelantaría la idea 1.',
      ],
    },
  };
})());
