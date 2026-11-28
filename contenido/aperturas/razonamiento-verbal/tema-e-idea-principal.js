/*
 * Apertura de «Tema central e idea principal» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * En verbal el choque es entre lo que se entiende de un texto y lo que dice: en la fábula de la zorra y las uvas la zorra
 * aparece en cada oración y hace todo, así que parece que el texto trata de ella; lo que el texto dice es sobre las
 * personas que desprecian lo que no consiguen. El dato es el texto mismo, contado aquí con palabras propias (la fábula se
 * atribuye a Esopo y es de dominio público). Lo que el alumno se lleva va en ficha.seLleva. Las aperturas de esta tanda
 * abren con un hecho de la naturaleza, de geografía, de un parte médico, de WhatsApp y de un aviso del colegio; esta, con
 * un relato. No adelanta la Predice de la idea 1 (el cartel de la etiqueta de los quesos) ni la de la idea 2 (el agua que
 * hierve en la altura). Colores: la zorra en naranja (c-o) y las uvas en morado (c-f); la persona, en el tono apagado.
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const zorra = t => ({ v: 'c-o', t }), uvas = t => ({ v: 'c-f', t });

  // La escena, igual en los dos paneles: la parra arriba con un racimo, la zorra sentada mirándolo y su frase.
  // En «Lo que dice» se agrega detrás de la zorra la silueta de una persona que estira el brazo hacia el racimo.
  const parra = x0 => `<path d="M${x0 + 20} 66H${x0 + 240}" style="stroke:var(--c-d)" stroke-width="5" stroke-linecap="round"/>
      ${[[40, 58], [86, 74], [150, 60], [210, 72]].map(([dx, y]) => `<path d="M${x0 + dx} ${y}q14 -18 28 0q-14 18 -28 0z" style="fill:var(--c-d)"/>`).join('')}
      <line x1="${x0 + 176}" y1="66" x2="${x0 + 176}" y2="84" style="stroke:var(--c-d)" stroke-width="3"/>
      ${[[0, 0], [-10, 0], [10, 0], [-5, 10], [5, 10], [15, 10], [-15, 10], [0, 20], [-10, 20], [10, 20], [-5, 30], [5, 30], [0, 40]]
        .map(([dx, dy]) => `<circle cx="${x0 + 176 + dx}" cy="${92 + dy}" r="6.5" style="fill:var(--c-f)"/>`).join('')}`;
  const laZorra = x0 => {
    const x = x0 + 96, y = 262;
    return `<path d="M${x - 10} ${y + 36}C${x - 70} ${y + 40} ${x - 84} ${y + 6} ${x - 66} ${y - 10}C${x - 58} ${y + 14} ${x - 36} ${y + 22} ${x - 12} ${y + 20}Z" style="fill:var(--c-o)"/>
      <path d="M${x - 72} ${y - 6}c4 -8 10 -6 6 4z" style="fill:var(--card)"/>
      <path d="M${x - 24} ${y + 38}C${x - 30} ${y - 2} ${x - 16} ${y - 44} ${x + 10} ${y - 52}C${x + 26} ${y - 30} ${x + 28} ${y + 10} ${x + 22} ${y + 38}Z" style="fill:var(--c-o)"/>
      <path d="M${x + 2} ${y - 58}L${x + 4} ${y - 84}L${x + 16} ${y - 64}L${x + 26} ${y - 82}L${x + 30} ${y - 60}L${x + 52} ${y - 82}L${x + 34} ${y - 44}C${x + 26} ${y - 34} ${x + 6} ${y - 36} ${x + 2} ${y - 50}Z" style="fill:var(--c-o)"/>
      <circle cx="${x + 24}" cy="${y - 60}" r="3" fill="currentColor"/>
      <path d="M${x + 2} ${y - 10}c6 12 14 14 20 10" fill="none" style="stroke:var(--card)" stroke-width="3" stroke-linecap="round"/>
      <path d="M${x - 2} ${y + 38}v-26M${x + 14} ${y + 38}v-26" style="stroke:var(--card)" stroke-width="2"/>`;
  };
  const frase = x0 => `<path d="M${x0 + 140} 236h102a10 10 0 0 1 10 10v20a10 10 0 0 1 -10 10h-102a10 10 0 0 1 -10 -10v-20a10 10 0 0 1 10 -10h6l-14 -16l26 16z" style="fill:var(--card)" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>
      <text x="${x0 + 191}" y="262" text-anchor="middle" font-size="15" font-weight="800" fill="currentColor">«Están verdes»</text>`;
  // Una persona de pie, de perfil, con el brazo estirado hacia el racimo: va detrás de la zorra, en tono apagado.
  const persona = x0 => {
    const x = x0 + 66;
    return `<g style="fill:var(--muted)" opacity=".35">
      <circle cx="${x}" cy="128" r="17"/>
      <path d="M${x - 20} 300V172a20 20 0 0 1 20 -20h0a20 20 0 0 1 20 20V300z"/>
      <path d="M${x + 8} 160L${x + 62} 126l8 12L${x + 18} 182z"/>
    </g>`;
  };
  const pie = (cx, l) => l.map((t, i) => `<text x="${cx}" y="${346 + i * 26}" text-anchor="middle" font-size="22" style="fill:var(--muted)">${t}</text>`).join('');

  const svg = `<svg viewBox="0 0 520 392" width="520" height="392" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="382" style="stroke:var(--line)" stroke-width="2"/>
    <text x="130" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">Lo que se entiende</text>
    ${parra(0)}${laZorra(0)}${frase(0)}
    <line x1="20" y1="300" x2="240" y2="300" stroke="currentColor" stroke-width="2"/>
    ${pie(130, ['Trata de', 'una zorra'])}
    <text x="390" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">Lo que dice</text>
    ${parra(260)}${persona(260)}${laZorra(260)}${frase(260)}
    <line x1="280" y1="300" x2="500" y2="300" stroke="currentColor" stroke-width="2"/>
    ${pie(390, ['Dice algo', 'de las personas'])}
  </svg>`;

  return {
    unidad: 'razonamiento-verbal.tema-e-idea-principal',
    titulo: '¿De qué trata una fábula en la que solo aparecen una zorra y unas uvas?',
    parrafos: [
      ['Una fábula muy antigua, que se atribuye al griego Esopo, cuenta que una ', zorra('zorra'), ' con hambre vio unas ', uvas('uvas'), ' maduras colgadas de una parra. ',
        'Saltó varias veces sin alcanzarlas y se fue diciendo que no las quería, porque de todos modos estaban verdes. ',
        'En toda la fábula no aparece ninguna persona: solo hay una zorra, una parra y unas uvas que nadie llega a probar.'],
      ['Si te preguntan de qué trata, lo primero que sale es «de una zorra que quería unas uvas», porque la zorra está en cada oración y es la que hace todo. ',
        'Esa respuesta cuenta bien lo que pasa, pero no dice por qué alguien se tomaría el trabajo de contarlo durante tantos siglos. ',
        'En los libros del colegio, la fábula suele terminar con una moraleja que lo explica, y esta versión no la trae, como tampoco la traen los textos de un examen.'],
      ['La fábula habla de una zorra, pero lo que dice es sobre las personas: cuenta lo que hace alguien que no consigue algo y prefiere decir que nunca lo quiso. ',
        'Por eso la zorra puede aparecer en cada oración sin que la fábula trate de los zorros. ',
        'Esta unidad trata del tema y de la idea principal de un texto, y de cómo encontrarlos aunque ninguna oración los diga.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos dibujos de la misma escena: una parra con un racimo de uvas y, debajo, una zorra sentada que dice «Están verdes». Lo que se entiende: la fábula trata de una zorra. Lo que dice: detrás de la zorra aparece la silueta de una persona que estira el brazo hacia el racimo sin alcanzarlo, porque la fábula dice algo de las personas.',
    },
    pregunta: 'Si al final la zorra hubiera ido a buscar un palo para bajar las uvas, ¿la fábula seguiría diciendo lo mismo de las personas?',
    ficha: {
      seLleva: 'Para saber de qué trata un texto no basta con ver quién aparece en cada oración: la fábula de la zorra y las uvas habla de una zorra y dice algo de las personas.',
      alcance: 'Sí (marco de lectura de PISA 2025, deducción propia: identificar la idea principal de un texto cuando no está dicha en una oración).',
      choque: 'Por quién aparece en cada oración, la fábula trata de una zorra; lo que dice es sobre las personas que desprecian lo que no consiguen.',
      atajo: 'Tomar como tema al personaje que se repite (la zorra) y buscar la oración que lo resume, que aquí no existe porque la versión no trae moraleja. Muchas versiones la traen; por eso esta la quita, para que el atajo no alcance.',
      porVerificar: [
        'Que la fábula de la zorra y las uvas se atribuya a Esopo (siglos VII y VI a. C.) y que su argumento sea el que cuenta el párrafo 1; el texto es un resumen propio, no una traducción.',
        'Que la fábula sea conocida por los alumnos peruanos (suele estar en los libros de primaria, de memoria).',
      ],
      notas: [
        'La idea principal de la fábula se dice en el párrafo 3: es el choque y no la respuesta de una Predice. La prueba de no delatar pasa con las Predice de las ideas 1 a 4.',
        'La pregunta se puede intentar con el texto: si la zorra busca un palo, ya no desprecia lo que no alcanza, y la fábula diría otra cosa (que hay que buscar la manera). Sirve para presentar la idea 2: la idea principal es lo que afirma todo el texto.',
        'Revisión del Escribidor Escribano (27 nov): el párrafo 3 decía «Para saber de qué trata un texto no basta con ver quién aparece en cada oración, porque hay que preguntarse qué dice el texto entero», que es la regla de la idea 2 (la idea principal es lo que afirma todo el texto); ahora dice el choque del caso: la zorra aparece en cada oración y la fábula no trata de los zorros. En el párrafo 2, «la oración que lo resume» tenía un «lo» sin referente claro; ahora dice «la oración que resume la fábula».',
        'Contenido, para Gerson: la fábula es de Esopo, griego, y no del Perú; es un relato universal. Se eligió porque el choque (el personaje no es el tema) se entiende sin saber el tema; si se prefiere un texto peruano, haría falta otro relato que todos conozcan.',
        'Figura: la misma escena en los dos paneles; en «Lo que dice» se agrega la silueta de una persona detrás de la zorra.',
        'Doble revisión (27 nov), pendiente de la fábula: se queda. La fábula de Esopo es de un griego, pero es un relato que se cuenta en la primaria peruana y su choque (el personaje que aparece en cada oración no es el tema) se entiende sin saber el tema. Lo que se cambió es el párrafo 2: decía que con la respuesta «de una zorra que quería unas uvas» la fábula sería «un texto sobre la vida de los zorros, como los de un libro de ciencias», una lectura que ningún alumno hace, porque todos saben que una fábula enseña algo. Ahora el párrafo 2 dice lo cierto: esa respuesta cuenta lo que pasa y no dice por qué se cuenta, y lo que se lo diría, la moraleja, no está en esta versión ni suele estar en los textos de examen. Así el quitar la moraleja deja de ser un arreglo escondido: se dice, y se dice para qué sirve. En el párrafo 3, «la vida de los zorros» pasó a «los zorros».',
        'Tercera pasada (27 nov): sin ecuaciones en la oración ni palabras de doble sentido. «Trata de» se usa siempre como «habla de»; «verdes» es siempre sin madurar.',
        'Coherencia con la unidad (28 nov): responde a medias. La idea 1 avisa que una persona o un lugar que abre el texto no siempre es su tema, y la idea 2 enseña a armar la idea principal cuando ninguna oración la dice, con relatos de examen; con eso la pregunta del palo se puede pensar (lo que el texto afirma cambia). Lo que la unidad no enseña es el paso de la fábula: que un texto con animales diga algo de las personas. Sus relatos son de personas (Julia y Nilda), y con su regla del tema («cubre todas las oraciones») un alumno podría responder «la zorra y las uvas». Sin cambios en el texto; queda para la teoría.',
      ],
    },
  };
})());
