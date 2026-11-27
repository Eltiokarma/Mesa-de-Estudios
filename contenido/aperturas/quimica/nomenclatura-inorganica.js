/*
 * Apertura de «Nomenclatura inorgánica» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * El choque está en la ferretería: el colorante para cemento se vende como «óxido de hierro», rojo o negro, con el mismo
 * nombre; el negro se pega a un imán y el rojo no, aunque los dos tienen casi la misma proporción de hierro. Lo que el
 * alumno se lleva (ficha.seLleva): un nombre que sirve para dos sustancias no alcanza, y la química necesita nombres
 * que digan cuál es cada una. Es un hecho propio: el ejemplo del skill (la lejía que se llama «cloro») no se usa. No se
 * dan estados de oxidación (Predice de la idea 1 sobre el Fe₂O₃), ni los tres nombres de un óxido (idea 2), ni nada de
 * peróxidos (idea 3). Colores: el polvo rojo en rosa (c-h) y el imán en violeta (c-f).
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  // El polvo negro tiene que verse negro también en el tema oscuro (currentColor ahí es claro): se mezcla el violeta de
  // la unidad con negro. Si un navegador viejo no entiende color-mix, el relleno cae al negro por defecto.
  const NEGRO = 'style="fill:color-mix(in oklab, var(--c-f) 22%, black)"';
  // El mismo imán de herradura sobre dos montoncitos iguales con la misma etiqueta; a la derecha, el polvo negro sube.
  const MESA = 262;
  const monton = (cx, rojo) => `<path d="M${cx - 40} ${MESA}Q${cx - 30} ${MESA - 34} ${cx} ${MESA - 38}Q${cx + 30} ${MESA - 34} ${cx + 40} ${MESA}Z" ${rojo ? 'style="fill:var(--c-h)" fill-opacity=".75"' : `${NEGRO} stroke="currentColor" stroke-width="1.5"`}/>`;
  const iman = (cx, y) => `<path d="M${cx - 26} ${y + 56}V${y + 22}A26 26 0 0 1 ${cx + 26} ${y + 22}V${y + 56}" fill="none" style="stroke:var(--c-f)" stroke-width="16"/>
      <path d="M${cx - 34} ${y + 46}h16M${cx + 18} ${y + 46}h16" style="stroke:var(--card)" stroke-width="10"/>`;
  // Granos que suben hacia el imán (forma fija).
  const suben = (cx, y) => [[-20, 0], [-14, 16], [-24, 30], [-12, 44], [-22, 58], [20, 4], [26, 18], [14, 30], [24, 46], [16, 60], [-4, 52], [4, 38]]
    .map(([dx, dy]) => `<circle cx="${cx + dx}" cy="${y + 66 + dy}" r="3.4" ${NEGRO} stroke="currentColor" stroke-width=".8"/>`).join('');
  const panel = (x0, titulo, mide, pie) => {
    const xr = x0 + 70, xn = x0 + 186;
    return `<text x="${x0 + 130}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      ${iman(xr, 74)}${iman(xn, 74)}
      ${mide ? suben(xn, 74) : ''}
      ${monton(xr, true)}${monton(xn, false)}
      <path d="M${x0 + 14} ${MESA}H${x0 + 246}" style="stroke:var(--muted)" stroke-width="3" stroke-linecap="round"/>
      <text x="${xr}" y="${MESA + 26}" text-anchor="middle" font-size="16" fill="currentColor">óxido de</text>
      <text x="${xr}" y="${MESA + 45}" text-anchor="middle" font-size="16" fill="currentColor">hierro</text>
      <text x="${xn}" y="${MESA + 26}" text-anchor="middle" font-size="16" fill="currentColor">óxido de</text>
      <text x="${xn}" y="${MESA + 45}" text-anchor="middle" font-size="16" fill="currentColor">hierro</text>
      ${pie.map((l, i) => `<text x="${x0 + 130}" y="${342 + i * 26}" text-anchor="middle" font-size="22" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 384" width="520" height="384" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="374" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', false, ['Mismo nombre:', 'se portan igual'])}
    ${panel(260, 'Lo que se mide', true, ['El negro sube al imán;', 'el rojo, no'])}
  </svg>`;

  return {
    unidad: 'quimica.nomenclatura-inorganica',
    titulo: '¿Por qué el «óxido de hierro» rojo y el negro de la ferretería no son la misma sustancia?',
    parrafos: [
      ['En la ferretería se vende óxido de hierro para dar color al cemento de un piso o de una pared, y con ese mismo nombre viene en bolsas de color rojo o negro. ',
        'Si acercas un imán, el polvo negro se le pega y el rojo se queda en su sitio, igual que en la playa, donde los granitos oscuros de la arena suben al imán y los demás no.'],
      ['Lo que sabes de los nombres predice otra cosa: un nombre señala una cosa, y si dos polvos se llaman igual y tienen los mismos elementos, hierro y oxígeno, tendrían que ser la misma sustancia pintada de otro color. ',
        'Tampoco es que el negro sea hierro sucio o tenga mucho más metal, porque si se calcula con lo que hay en cada uno, el negro tendría unos 72 g de hierro por cada 100 g y el rojo, unos 70 g, casi lo mismo.'],
      ['El rojo y el negro tienen los mismos dos elementos, pero combinados en otra proporción, y por eso son dos sustancias distintas con un solo nombre de ferretería. ',
        'Para un químico, el nombre tiene que decir cuál de todas es, y las reglas para nombrar cada compuesto sin confundirlo con otro son la nomenclatura inorgánica, el tema de esta unidad.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos montoncitos de polvo con la misma etiqueta, «óxido de hierro», uno rojo y uno negro, cada uno bajo un imán. Lo que predice la idea de que el mismo nombre es la misma sustancia: los dos se portan igual. Lo que se mide: el polvo negro sube al imán y el rojo no.',
    },
    pregunta: 'El rojo y el negro tienen hierro y oxígeno, pero en distinta proporción. ¿Qué tendría que decir el nombre de cada uno para que nadie los confunda en la ferretería?',
    ficha: {
      seLleva: 'Un nombre que sirve para dos sustancias no alcanza: el óxido de hierro rojo y el negro tienen los mismos elementos en otra proporción, y por eso la química usa nombres que dicen cuál es cada una.',
      alcance: 'Parcial (núcleo del informe PISA para nomenclatura: un nombre identifica una sustancia, y compartir elementos no la hace igual).',
      choque: 'Mismo nombre y mismos elementos deberían ser la misma sustancia; el «óxido de hierro» negro se pega a un imán y el rojo no.',
      atajo: 'El atajo «el negro tiene más hierro o es hierro sucio» se descarta con la proporción: unos 72 g de hierro por 100 g en el negro y unos 70 g en el rojo. Decir «son de distinto color» describe la diferencia y no dice que sean sustancias distintas.',
      porVerificar: [
        'Que en las ferreterías del Perú se venda colorante para cemento como «óxido de hierro» rojo y negro (de memoria; los rótulos varían: también «ocre» u «óxido rojo»).',
        'Que el pigmento negro sea magnetita (Fe₃O₄), que se pega a un imán, y el rojo, hematita (Fe₂O₃), que un imán común no levanta (de memoria; la hematita es apenas magnética).',
        'Proporción de hierro calculada con las fórmulas y masas atómicas (Fe 55,85; O 16,00): Fe₃O₄, 72,4 %; Fe₂O₃, 69,9 %. Es un cálculo, no una medición; el texto lo dice en condicional.',
        'Que la arena de muchas playas del Perú tenga granitos negros de magnetita que suben a un imán (lo esperado: es común en arenas de playa y de río; conviene confirmar una playa concreta si se quiere nombrarla).',
      ],
      notas: [
        'Revisión (Escribidor Escribano, 27 nov): sin cambios de texto. No delata la Predice del EO del hierro en el Fe₂O₃ ni la idea 2, porque no escribe fórmulas ni estados de oxidación.',
        'El texto no escribe las fórmulas ni los estados de oxidación: la Predice de la idea 1 pregunta el estado de oxidación del hierro en el Fe₂O₃, y la idea 2 enseña los tres nombres de un óxido. La pregunta se puede intentar con lo leído (que el nombre diga cuántos átomos de cada uno, o algo sobre el hierro) y abre esas dos ideas.',
        'No se usa el ejemplo del skill (la lejía que en casa se llama «cloro»), por la regla de texto propio.',
      ],
    },
  };
})());
