/*
 * Apertura de «Estructura atómica» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * El choque se ve en la fiesta patronal y en la cocina: cada color del castillo sale de un elemento, la sal pinta de
 * amarillo la llama azul de la hornilla y el sulfato de cobre la pinta de verde (prueba de llama). Lo que el alumno ya sabe (el fierro del herrero pasa de rojo a
 * blanco cuando se calienta) dice que el color de lo caliente marca su temperatura; pero ningún metal calentado se pone
 * verde. Lo que el alumno se lleva (ficha.seLleva): cada elemento da sus propios colores de luz, y eso sale de cómo es
 * su átomo por dentro. No se nombran niveles, orbitales ni saltos de electrones (ideas 2 a 4), ni se toca la Predice
 * del sodio que pierde un electrón (idea 1) ni la de las alfas (idea 2). Colores: la llama de gas en violeta (c-f,
 * se lee azul), la llama con cobre en verde (c-d) y el cable en naranja (c-o).
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  // Dos hornillas iguales con la misma llama y la misma punta de cable metida en ella; cambia solo el color.
  const BASE = 262;
  const llama = (cx, color) => {
    const exterior = `M${cx} ${BASE - 150}C${cx + 22} ${BASE - 110} ${cx + 52} ${BASE - 70} ${cx + 46} ${BASE - 34}C${cx + 40} ${BASE - 6} ${cx - 40} ${BASE - 6} ${cx - 46} ${BASE - 34}C${cx - 52} ${BASE - 70} ${cx - 22} ${BASE - 110} ${cx} ${BASE - 150}Z`;
    const cono = `M${cx} ${BASE - 78}C${cx + 12} ${BASE - 58} ${cx + 20} ${BASE - 36} ${cx + 16} ${BASE - 22}C${cx + 10} ${BASE - 10} ${cx - 10} ${BASE - 10} ${cx - 16} ${BASE - 22}C${cx - 20} ${BASE - 36} ${cx - 12} ${BASE - 58} ${cx} ${BASE - 78}Z`;
    return `<path d="${exterior}" style="fill:var(${color})" fill-opacity=".32"/>
      <path d="${exterior}" fill="none" style="stroke:var(${color})" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="${cono}" style="fill:var(${color})" fill-opacity=".55"/>`;
  };
  const panel = (x0, titulo, color, rotulo, pie) => {
    const cx = x0 + 120;
    return `<text x="${x0 + 130}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      ${llama(cx, color)}
      <text x="${cx}" y="${BASE - 160}" text-anchor="middle" font-size="19" font-weight="700" style="fill:var(${color})">${rotulo}</text>
      <path d="M${cx + 116} ${BASE - 118}L${cx + 66} ${BASE - 86}L${cx + 18} ${BASE - 64}" fill="none" style="stroke:var(--c-o)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="${cx + 118}" y="${BASE - 128}" text-anchor="end" font-size="18" font-weight="700" style="fill:var(--c-o)">cobre</text>
      <rect x="${cx - 62}" y="${BASE}" width="124" height="12" rx="6" fill="currentColor"/>
      <path d="M${cx - 92} ${BASE + 26}H${cx + 92}" style="stroke:var(--muted)" stroke-width="3" stroke-linecap="round"/>
      <path d="M${cx - 30} ${BASE + 12}V${BASE + 26}M${cx + 30} ${BASE + 12}V${BASE + 26}" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
      ${pie.map((l, i) => `<text x="${x0 + 130}" y="${336 + i * 26}" text-anchor="middle" font-size="22" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 384" width="520" height="384" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="374" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', '--c-f', 'azul', ['Igual de caliente:', 'igual de azul'])}
    ${panel(260, 'Lo que se mide', '--c-d', 'verde', ['Con el cobre,', 'la llama sale verde'])}
  </svg>`;

  return {
    unidad: 'quimica.estructura-atomica',
    titulo: '¿Por qué el cobre pinta de verde la llama azul, si no la calienta más?',
    parrafos: [
      ['En la fiesta patronal, el castillo de fuegos artificiales suelta chispas verdes, rojas, azules y amarillas, y cada color sale de un elemento distinto mezclado con la pólvora. ',
        'Algo parecido pasa en la cocina: cuando la sopa salada hierve y se derrama sobre la hornilla, la llama azul se pinta de amarillo. ',
        'Con el cobre, la llama sale verde, como se ve en la prueba de llama del laboratorio, cuando se acerca al fuego un alambre mojado en agua con sulfato de cobre, los cristales azules que se venden en las tiendas agrícolas.'],
      ['Lo que sabes del fierro que calienta un herrero predice otra cosa: el metal se ve rojo oscuro hacia los 600 °C y pasa a amarillo y a blanco cuando se calienta más, así que el color diría qué tan caliente está algo. ',
        'Con esa regla, la llama verde tendría que estar más caliente o más fría que la azul, pero ningún metal calentado se pone verde a ninguna temperatura, porque pasa del rojo al blanco sin tocar el verde. ',
        'Tampoco es el color de lo que se acerca a la llama, porque el sulfato de cobre es azul y la pinta de verde, y la sal de cocina es blanca y la pinta de amarillo.'],
      ['Si el color no lo pone la temperatura, lo pone el elemento: cada uno da sus propios colores de luz, siempre los mismos, como una firma que lo delata. ',
        'Esa firma sale de cómo está armado el átomo por dentro, algo que ningún microscopio alcanza a ver, y de esa estructura atómica trata esta unidad.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos hornillas iguales con la misma llama y la punta de un alambre mojado en sulfato de cobre metida en ella. Lo que predice la regla de que el color sale de la temperatura: la llama, igual de caliente, sigue azul. Lo que se mide: con el cobre, la llama sale verde.',
    },
    pregunta: 'La misma llama calienta por igual al cobre y al sodio de la sal. ¿Qué crees que tienen distinto por dentro esos dos átomos para que uno dé luz verde y el otro, amarilla?',
    ficha: {
      seLleva: 'Cada elemento da sus propios colores de luz cuando se calienta, como una firma, y esa firma sale de cómo está armado su átomo por dentro, no de la temperatura.',
      alcance: 'Parcial (núcleo: una evidencia que se ve, el color de la llama, obliga a pensar en la estructura de algo que no se ve; los modelos atómicos y los números cuánticos no entran en PISA).',
      choque: 'El color de lo caliente marca la temperatura (rojo, amarillo, blanco); el cobre pinta de verde la misma llama, un color que ningún metal calentado toma.',
      atajo: 'El atajo «es el color del metal» se descarta porque el cobre es rojizo y da verde, y la sal es blanca y da amarillo. El otro atajo, «la llama está más caliente», choca con que el verde no aparece en la escala de colores de un metal calentado.',
      porVerificar: [
        'Que un metal calentado se vea rojo oscuro hacia los 600 °C y pase a amarillo y a blanco por encima de unos 1000 °C a 1300 °C (de memoria: es la escala de colores de incandescencia que usan los herreros; el rojo apenas visible empieza hacia los 500 °C a 550 °C).',
        'Que ningún cuerpo calentado se vea verde (lo esperado: la radiación de un cuerpo caliente pasa del rojo al blanco, y en el amarillo-blanco su luz mezcla todos los colores).',
        'Que un alambre mojado en una solución de sulfato de cobre pinte de verde la llama (prueba de llama escolar: el ion cobre(II) da verde o verde azulado). Se quitó el cable de cobre pelado: en la prueba de Beilstein el alambre de cobre se calienta en la llama hasta que deja de dar verde, así que el cobre limpio u oxidado no colorea la llama de forma fiable, y mojarlo con agua salada daría el amarillo del sodio, que tapa el verde.',
        'Que el sulfato de cobre se venda en las tiendas agrícolas del Perú como cristales azules, como fungicida (de memoria: se usa para el caldo bordelés).',
        'Que la sopa salada que se derrama sobre la hornilla pinte la llama de amarillo anaranjado (es el sodio de la sal; lo esperado y fácil de ver).',
        'Que cada color de los fuegos artificiales salga de un elemento distinto (de memoria: rojo del estroncio, verde del bario, azul del cobre, amarillo del sodio). Por eso el texto no le atribuye al cobre el verde del castillo: el verde de la cocina es el de la prueba de llama.',
        'Que la sal de cocina pinte la llama de amarillo por el sodio (prueba de llama conocida).',
      ],
      notas: [
        'Revisión (Escribidor Escribano, 27 nov): se cambió el cable de cobre pelado por un alambre mojado en sulfato de cobre, porque un cobre limpio no tiñe la llama de forma fiable (ver porVerificar), y se agregó la sopa salada que pinta de amarillo la llama, un hecho que el alumno sí ha visto. El choque es el mismo. La figura sigue mostrando un alambre con el rótulo «cobre»; si Gerson quiere, se puede rotular «sulfato de cobre».',
        'El párrafo 3 nombra la estructura atómica como la salida al choque y no explica cómo sale la luz: ni niveles, ni saltos de electrones. La pregunta se puede intentar con lo que sabe un alumno de 5.º (los átomos tienen protones y electrones, y cada elemento tiene un número distinto) y abre la idea 1 sin responder su Predice, que es sobre el ion Na⁺.',
        'La figura dibuja dos llamas iguales con la misma punta de cable; lo único que cambia es el color. La llama de gas va en violeta (c-f) porque no hay un azul de variable, y el turquesa (c-i) se confundía con el verde del cobre.',
      ],
    },
  };
})());
