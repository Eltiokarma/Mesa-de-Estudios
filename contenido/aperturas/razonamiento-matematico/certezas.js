/*
 * Apertura de «Certezas» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * Escrita desde cero (27 nov). El choque es un hecho que cualquiera comprueba en su casa: cuando se va la luz y hay que
 * sacar medias a oscuras de un cajón con medias negras y blancas sueltas, tres bastan para tener un par, haya 16 medias o
 * 100. La intuición dice que mientras más medias, más hay que sacar. Lo que el alumno se lleva va en ficha.seLleva.
 * La unidad vecina (Verdades y mentiras) abre con un dato de experimentos con personas; esta, con una prueba casera.
 * No adelanta ninguna Predice: ni la de la tómbola (idea 1), ni la de los cumpleaños por mes (idea 2), ni la de los
 * guantes (idea 3, que tienen izquierdo y derecho; las medias no), ni la del bingo, ni la de las cartas que suman ni la de
 * las llaves. No dibuja la peor suerte ni dice «la siguiente obliga»: eso lo construye la idea 1.
 * Colores de la unidad (cabecera de contenido/teoria/razonamiento-matematico/certezas.js): el color real de una media no
 * se pinta, lleva la letra de su color (N negra, B blanca); las medias y el cajón van en tinta, y el par que se forma se
 * marca en turquesa (c-i, lo que sale sin probar). Sin naranja (es la peor suerte, de la idea 1), verde, carmín ni violeta.
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const par = t => ({ v: 'c-i', t });
  const r1 = n => Math.round(n * 10) / 10;

  // Una media de pie (puño arriba, talón y punta a la derecha), escalada por s y girada g grados, con la letra de su color.
  const media = (x, y, s, letra, g = 0) => `<g transform="translate(${r1(x)} ${r1(y)}) rotate(${g} 13 20) scale(${s})">
        <path d="M0 0h16v24q0 4 4 4h6q6 0 6 6q0 6 -6 6h-18q-8 0 -8 -8Z" style="fill:var(--card)" stroke="currentColor" stroke-width="${r1(2.6 / s)}" stroke-linejoin="round"/>
        <path d="M0 6h16" fill="none" stroke="currentColor" stroke-width="${r1(1.8 / s)}"/>
        <text x="8" y="21" text-anchor="middle" font-size="13" font-weight="800" fill="currentColor">${letra}</text>
      </g>`;
  // El cajón abierto, visto de frente: 8 medias negras y 8 blancas revueltas asoman sobre el frente (igual en los dos paneles).
  const REVUELTO = 'NBBNBNNBBNBNNBNB';
  const cajon = x0 => `<path d="M${x0 + 30} 92l12 -26h176l12 26" style="fill:var(--line)" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>
      ${[...REVUELTO].map((l, i) => media(x0 + 40 + (i % 8) * 23 + (i < 8 ? 6 : 0), 70 + (i < 8 ? 0 : 22), 0.8, l, [-14, 10, -4, 16, -10, 6, -18, 12][(i * 3) % 8])).join('')}
      <rect x="${x0 + 22}" y="116" width="216" height="52" rx="6" style="fill:var(--card)" stroke="currentColor" stroke-width="3"/>
      <rect x="${x0 + 108}" y="136" width="44" height="10" rx="5" fill="currentColor"/>`;
  const pie = (cx, l) => l.map((x, i) => `<text x="${cx}" y="${356 + i * 25}" text-anchor="middle" font-size="21" style="fill:var(--muted)">${x}</text>`).join('');
  const titulo = (cx, t) => `<text x="${cx}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${t}</text>
      <text x="${cx}" y="52" text-anchor="middle" font-size="17" style="fill:var(--muted)">N: negra · B: blanca</text>`;

  // Lo que predice: con más medias en el cajón, más hay que sacar; con 8 de cada color, 9.
  const predice = x0 => {
    const cx = x0 + 130, mano = 'NBNBBNBNB';
    return `${titulo(cx, 'Lo que predice')}${cajon(x0)}
      <text x="${cx}" y="194" text-anchor="middle" font-size="17" font-weight="700" fill="currentColor">Sacas 9 a oscuras</text>
      ${[...mano].map((l, i) => media(x0 + 30 + (i < 5 ? i : i - 5 + 0.5) * 42, 206 + (i < 5 ? 0 : 52), 1, l)).join('')}
      ${pie(cx, ['Para estar seguro:', 'sacar 9 de 16'])}`;
  };
  // Lo que se mide: tres medias sacadas a oscuras ya traen dos del mismo color.
  const mide = x0 => {
    const cx = x0 + 130, xs = [cx - 72, cx - 16, cx + 40];
    return `${titulo(cx, 'Lo que se mide')}${cajon(x0)}
      <text x="${cx}" y="194" text-anchor="middle" font-size="17" font-weight="700" fill="currentColor">Sacas 3 a oscuras</text>
      ${['B', 'N', 'N'].map((l, i) => media(xs[i], 216, 1.25, l)).join('')}
      <path d="M${xs[1] - 4} 276v10h${xs[2] - xs[1] + 48}v-10" fill="none" style="stroke:var(--c-i)" stroke-width="3.5" stroke-linejoin="round"/>
      <text x="${r1((xs[1] + xs[2]) / 2 + 20)}" y="310" text-anchor="middle" font-size="19" font-weight="800" style="fill:var(--c-i)">un par</text>
      ${pie(cx, ['Con 3 medias,', 'siempre hay un par'])}`;
  };
  const svg = `<svg viewBox="0 0 520 396" width="520" height="396" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="386" style="stroke:var(--line)" stroke-width="2"/>
    ${predice(0)}${mide(260)}
  </svg>`;

  return {
    unidad: 'razonamiento-matematico.certezas',
    titulo: '¿Por qué tres medias sacadas a oscuras bastan para tener un par?',
    parrafos: [
      ['Una mañana se va la luz y tienes que vestirte a oscuras, con un cajón de medias negras y blancas del mismo modelo, todas sueltas y revueltas. ',
        'Si sacas tres medias sin ver y después las miras con luz, siempre encuentras ', par('dos del mismo color'), ', y eso pasa igual con 16 medias en el cajón que con 100.'],
      ['La cuenta que parece segura cambia con el tamaño del cajón: con 8 negras y 8 blancas habría que sacar 9, una más que todas las de un color, y con 50 de cada color, 51. ',
        'Otra idea es confiar en la suerte, porque con dos medias es muy probable que ya coincidan, pero que sea probable no es lo mismo que estar seguro, ya que pueden salir una negra y una blanca.'],
      ['Para tener un par, el tamaño del cajón no cambia lo que necesitas sacar, aunque la intuición diga que más medias piden más intentos. ',
        'Saber cuánto hay que sacar sin mirar para estar seguro, sin depender de la buena suerte, es el tema de esta unidad, la de las certezas.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos dibujos del mismo cajón con 8 medias negras y 8 blancas, cada una con su letra. Lo que predice la cuenta por tamaño: para estar seguro hay que sacar 9 medias. Lo que se mide: con 3 medias sacadas a oscuras ya hay dos del mismo color, un par.',
    },
    pregunta: 'Si en el cajón también hubiera medias azules, además de las negras y las blancas, ¿cuántas tendrías que sacar a oscuras para estar seguro de tener un par?',
    ficha: {
      seLleva: 'Para estar seguro sin mirar no hace falta sacar casi todo: de un cajón con medias de dos colores, tres medias siempre traen un par, sea el cajón chico o enorme.',
      alcance: 'Sí en el núcleo (deducción propia con el marco de Matemática PISA 2022: incertidumbre y datos, la diferencia entre lo probable y lo seguro); el principio del palomar y el peor caso, como técnica, no son contenido PISA.',
      choque: 'La cuenta por tamaño predice 9 medias con 16 en el cajón (y 51 con 100); a oscuras, 3 medias siempre traen un par, sea cual sea el tamaño.',
      atajo: 'Confiar en la suerte (con dos medias es probable que coincidan), que es probable y no seguro: pueden salir una de cada color. Y la cuenta de «una más que todas las de un color», que sirve para otra meta (tener una de cada color), no para un par; el texto no dice para qué sirve, porque eso es de la idea 3.',
      porVerificar: [
        'Ningún dato sale de memoria: que tres medias de dos colores traen un par se comprueba con la cuenta (con dos colores, entre tres medias dos se repiten) o probando en casa.',
        'Que los cortes de luz en la mañana sean algo que el alumno reconoce: en el Perú hay cortes programados y apagones; no se afirma ninguna frecuencia.',
        'Que «9 de 16» sea la cuenta que haría un alumno: es una hipótesis (la cuenta de «una más que todas las de un color»); no hay datos de alumnos. Si Gerson prefiere, el panel puede decir solo «casi todas».',
      ],
      notas: [
        'Medias y no guantes: las medias no tienen izquierda ni derecha, así que cualquier par del mismo color sirve. Los guantes son la Predice de la idea 3 y no se nombran.',
        'La figura muestra un solo resultado de tres medias (B, N, N) y no dibuja la peor suerte: que siempre pase lo dice el texto, y por qué pasa lo construye la idea 1. Las letras N y B siguen la regla de la unidad: el color real no se pinta.',
        'La pregunta se puede intentar con lo leído (con tres colores, la respuesta es 4) y no es ninguna Predice de la unidad; prepara la idea 2, de casilleros.',
        'Para Gerson: el párrafo 3 no da la regla (el número de colores más uno). Dice solo que el tamaño del cajón no importa, que es lo que el alumno puede comprobar.',
        'Revisión del Escribidor Escribano (27 nov, otro agente): «unas 51» pasó a «51», porque es una cuenta exacta, y el párrafo 3 dice «para tener un par», porque el tamaño sí importa para otras metas (una de cada color, idea 3).',
        'Contenido, para Gerson (revisión del 27 nov): la apertura no delata ninguna Predice ni misión, pero sí resuelve un caso de la unidad. El ejemplo 3 de la idea 2, «Medias del mismo color» (8 negras y 6 blancas en un cajón oscuro, ¿cuántas para 2 del mismo color?), tiene la respuesta que da esta apertura, 3, y la pregunta de las medias azules es el ejemplo 1 de esa idea, «Dos del mismo color» (tres colores, 4). Los ejemplos se abren con su solución después de la Predice, así que no se adelanta una respuesta que el alumno deba predecir; queda repetido. Si Gerson quiere evitarlo, lo más barato es cambiar el objeto de ese ejemplo en la unidad (por ejemplo, chompas o bolitas), no el choque de la apertura. Además, el título («tres medias bastan para tener un par») es el distractor «3 guantes» de la Predice de la idea 3; ahí la Lee presenta izquierdo y derecho antes de preguntar, y el siFuera explica por qué 3 no alcanza, así que se deja como una trampa que la idea 3 desarma. Que lo vea el lector en frío.',
      ],
    },
  };
})());
