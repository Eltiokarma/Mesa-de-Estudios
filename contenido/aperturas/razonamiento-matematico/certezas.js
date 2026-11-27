/*
 * Apertura de «Certezas» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * Escrita desde cero (27 nov). El choque es un hecho que cualquiera comprueba en su casa: cuando se va la luz y hay que
 * sacar medias a oscuras de un cajón con medias negras y blancas sueltas, tres bastan para tener un par, haya 16 medias o
 * 100. Doble revisión (27 nov): la idea es intuitiva y la apertura la muestra aplicada; «Lo que predice» es la intuición
 * correcta. Lo que el alumno se lleva va en ficha.seLleva.
 * La unidad vecina (Verdades y mentiras) abre con un dato de experimentos con personas; esta, con una prueba casera.
 * No adelanta ninguna Predice: ni la de la tómbola (idea 1), ni la de los cumpleaños por mes (idea 2), ni la de los
 * guantes (idea 3, que tienen izquierdo y derecho; las medias no), ni la del bingo, ni la de las cartas que suman ni la de
 * las llaves. Dice por qué tres bastan con dos colores, que el alumno ve solo; la peor suerte como método la construye la
 * idea 1 con metas que ya no se ven a simple vista.
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

  // Lo que predice: la intuición correcta. Si las dos primeras salen distintas, la tercera repite uno de los dos colores.
  const predice = x0 => {
    const cx = x0 + 130, xs = [cx - 72, cx - 16, cx + 40];
    return `${titulo(cx, 'Lo que predice')}${cajon(x0)}
      <text x="${cx}" y="194" text-anchor="middle" font-size="17" font-weight="700" fill="currentColor">Si salen dos distintas</text>
      ${['N', 'B', '?'].map((l, i) => media(xs[i], 216, 1.25, l)).join('')}
      <text x="${r1(xs[2] + 20)}" y="310" text-anchor="middle" font-size="19" font-weight="800" style="fill:var(--c-i)">N o B</text>
      ${pie(cx, ['La tercera media', 'repite un color'])}`;
  };
  // Lo que se mide: tres medias sacadas a oscuras ya traen dos del mismo color.
  const mide = x0 => {
    const cx = x0 + 130, xs = [cx - 72, cx - 16, cx + 40];
    return `${titulo(cx, 'Lo que se mide')}${cajon(x0)}
      <text x="${cx}" y="194" text-anchor="middle" font-size="17" font-weight="700" fill="currentColor">Sacas 3 a oscuras</text>
      ${['B', 'N', 'N'].map((l, i) => media(xs[i], 216, 1.25, l)).join('')}
      <path d="M${xs[1] - 4} 276v10h${xs[2] - xs[1] + 48}v-10" fill="none" style="stroke:var(--c-i)" stroke-width="3.5" stroke-linejoin="round"/>
      <text x="${r1((xs[1] + xs[2]) / 2 + 20)}" y="310" text-anchor="middle" font-size="19" font-weight="800" style="fill:var(--c-i)">un par</text>
      ${pie(cx, ['Con 16 o con 100,', '3 traen un par'])}`;
  };
  const svg = `<svg viewBox="0 0 520 396" width="520" height="396" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="386" style="stroke:var(--line)" stroke-width="2"/>
    ${predice(0)}${mide(260)}
  </svg>`;

  return {
    unidad: 'razonamiento-matematico.certezas',
    titulo: '¿Cuántas medias tienes que sacar a oscuras para estar seguro de llevar un par?',
    parrafos: [
      ['Una mañana se va la luz y tienes que vestirte a oscuras, con un cajón de medias negras y blancas del mismo modelo, todas sueltas y revueltas. ',
        'Si sacas tres medias sin ver y después las miras con luz, siempre encuentras ', par('dos del mismo color'), ', y eso pasa igual con 16 medias en el cajón que con 100.'],
      ['Lo puedes pensar sin probar: si las dos primeras medias salen de colores distintos, ya tienes una negra y una blanca, y la tercera tiene que repetir uno de los dos colores. ',
        'Con dos medias no alcanza, porque que coincidan es probable, pero no seguro: pueden salir una negra y una blanca, y te quedas con dos medias que no hacen juego.'],
      ['Esa cuenta te ahorra llevar el cajón entero hasta la ventana para buscar con luz, porque sacas tres medias y sales vestido sin depender de la suerte. ',
        'Saber cuánto hay que sacar sin mirar para estar seguro es el tema de esta unidad, la de las certezas, donde las metas se vuelven más difíciles de ver a simple vista.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos dibujos del mismo cajón con 8 medias negras y 8 blancas, cada una con su letra. Lo que predice la cuenta: si las dos primeras medias son una negra y una blanca, la tercera repite uno de los dos colores. Lo que se mide: con 3 medias sacadas a oscuras ya hay dos del mismo color, un par, haya 16 medias o 100.',
    },
    pregunta: 'Si en el cajón también hubiera medias azules, además de las negras y las blancas, ¿cuántas tendrías que sacar a oscuras para estar seguro de tener un par?',
    ficha: {
      seLleva: 'Para estar seguro sin mirar no hace falta sacar casi todo: con medias de dos colores, si las dos primeras no coinciden, la tercera repite color, así que tres medias siempre traen un par, sea el cajón chico o enorme.',
      alcance: 'Sí en el núcleo (deducción propia con el marco de Matemática PISA 2022: incertidumbre y datos, la diferencia entre lo probable y lo seguro); el principio del palomar y el peor caso, como técnica, no son contenido PISA.',
      choque: 'Sin choque fabricado (apertura-pisa.md, punto 7): la intuición correcta (si dos salen distintas, la tercera repite color) se comprueba en el cajón, y sirve para no sacar más de 3 medias, haya 16 o 100.',
      atajo: 'Confiar en la suerte (con dos medias es probable que coincidan), que es probable y no seguro: pueden salir una de cada color. Se descarta en el párrafo 2.',
      porVerificar: [
        'Ningún dato sale de memoria: que tres medias de dos colores traen un par se comprueba con la cuenta (con dos colores, entre tres medias dos se repiten) o probando en casa.',
        'Que los cortes de luz en la mañana sean algo que el alumno reconoce: en el Perú hay cortes programados y apagones; no se afirma ninguna frecuencia.',
      ],
      notas: [
        'Medias y no guantes: las medias no tienen izquierda ni derecha, así que cualquier par del mismo color sirve. Los guantes son la Predice de la idea 3 y no se nombran.',
        'La figura muestra en «Lo que predice» la cuenta de la intuición (N, B y una tercera que solo puede ser N o B) y en «Lo que se mide» un resultado de tres medias (B, N, N). Las letras N y B siguen la regla de la unidad: el color real no se pinta.',
        'La pregunta se puede intentar con lo leído (con tres colores, la respuesta es 4) y no es ninguna Predice de la unidad; prepara la idea 2, de casilleros.',
        'Para Gerson: el párrafo 3 no da la regla (el número de colores más uno). Dice solo que el tamaño del cajón no importa, que es lo que el alumno puede comprobar.',
        'Revisión del Escribidor Escribano (27 nov, otro agente): «unas 51» pasó a «51», porque es una cuenta exacta, y el párrafo 3 dice «para tener un par», porque el tamaño sí importa para otras metas (una de cada color, idea 3).',
        'Contenido, para Gerson (revisión del 27 nov): la apertura no delata ninguna Predice ni misión, pero sí resuelve un caso de la unidad. El ejemplo 3 de la idea 2, «Medias del mismo color» (8 negras y 6 blancas en un cajón oscuro, ¿cuántas para 2 del mismo color?), tiene la respuesta que da esta apertura, 3, y la pregunta de las medias azules es el ejemplo 1 de esa idea, «Dos del mismo color» (tres colores, 4). Los ejemplos se abren con su solución después de la Predice, así que no se adelanta una respuesta que el alumno deba predecir; queda repetido. Si Gerson quiere evitarlo, lo más barato es cambiar el objeto de ese ejemplo en la unidad (por ejemplo, chompas o bolitas), no el choque de la apertura. Además, el título («tres medias bastan para tener un par») es el distractor «3 guantes» de la Predice de la idea 3; ahí la Lee presenta izquierdo y derecho antes de preguntar, y el siFuera explica por qué 3 no alcanza, así que se deja como una trampa que la idea 3 desarma. Que lo vea el lector en frío.',
        'Doble revisión (27 nov), reescrita: el párrafo 2 decía que «la cuenta que parece segura» con 8 negras y 8 blancas es sacar 9 (una más que todas las de un color), y la propia ficha admitía que no había datos de que un alumno la hiciera: era un muñeco de paja para fabricar sorpresa. Que tres medias de dos colores traen un par es intuitivo (si dos salen distintas, la tercera repite color) y útil, así que la apertura lo muestra aplicado, con «Lo que predice» como la intuición correcta, como pide el punto 7 de apertura-pisa.md. El título pasó de «¿Por qué tres medias… bastan?» a una pregunta que el alumno responde con el texto; el único error que queda descartado es el real, confiar en que dos coincidan. El párrafo 3 dice para qué sirve (no llevar el cajón a la ventana) y que en la unidad las metas se vuelven más difíciles de ver, sin nombrar guantes, tómbolas ni la regla del número de colores más uno. La pregunta de las medias azules no cambia.',
      ],
    },
  };
})());
