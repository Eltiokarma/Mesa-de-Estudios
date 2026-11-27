/*
 * Apertura de «Definiciones» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * En verbal el choque es entre lo que se entiende de una palabra y lo que dice su definición: la araña de la casa se
 * llama insecto porque es un bicho pequeño, y la definición de «insecto» la deja fuera por sus ocho patas. El dato se
 * comprueba contando patas. Lo que el alumno se lleva va en ficha.seLleva. No adelanta la Predice de la idea 1 (la ficha
 * de la motocarga) ni la de la idea 2 (las aves ponen huevos y la rana también). Colores de la unidad (leyenda de la
 * idea 1): turquesa (c-i) para lo que entra en la definición y naranja (c-o) para lo que se cuela.
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const seis = t => ({ v: 'c-i', t }), ocho = t => ({ v: 'c-o', t });
  const r1 = n => Math.round(n * 10) / 10;
  const pata = (pts, c) => `<path d="M${pts.map(([x, y]) => `${r1(x)} ${r1(y)}`).join('L')}" fill="none" style="stroke:var(${c})" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`;

  // Bichos vistos desde arriba, con la cabeza a la derecha. Las patas salen del tórax: tres por lado en los insectos y
  // cuatro por lado en la araña, para que se puedan contar.
  const hormiga = (cx, cy, c) => {
    const patas = [-9, 0, 9].flatMap(dx => [1, -1].map(s => pata([[cx + dx * 0.4, cy], [cx + dx, cy + s * 12], [cx + dx * 1.6 - 4, cy + s * 20]], c))).join('');
    return `${patas}
      <ellipse cx="${cx - 20}" cy="${cy}" rx="13" ry="9" style="fill:var(${c})"/>
      <ellipse cx="${cx}" cy="${cy}" rx="8" ry="5.5" style="fill:var(${c})"/>
      <circle cx="${cx + 15}" cy="${cy}" r="6.5" style="fill:var(${c})"/>
      ${pata([[cx + 19, cy - 3], [cx + 27, cy - 12], [cx + 33, cy - 11]], c)}${pata([[cx + 19, cy + 3], [cx + 27, cy + 12], [cx + 33, cy + 11]], c)}`;
  };
  const mariquita = (cx, cy, c) => {
    const patas = [-8, 0, 8].flatMap(dx => [1, -1].map(s => pata([[cx + dx, cy + s * 10], [cx + dx * 1.3, cy + s * 20], [cx + dx * 1.7 - 3, cy + s * 23]], c))).join('');
    return `${patas}
      <ellipse cx="${cx}" cy="${cy}" rx="17" ry="14" style="fill:var(${c})"/>
      <circle cx="${cx + 18}" cy="${cy}" r="6" style="fill:var(${c})"/>
      <line x1="${cx - 16}" y1="${cy}" x2="${cx + 13}" y2="${cy}" style="stroke:var(--card)" stroke-width="2"/>
      ${[[-7, -6], [4, -7], [-6, 6], [5, 7]].map(([dx, dy]) => `<circle cx="${cx + dx}" cy="${cy + dy}" r="2.6" style="fill:var(--card)"/>`).join('')}
      ${pata([[cx + 22, cy - 3], [cx + 30, cy - 9]], c)}${pata([[cx + 22, cy + 3], [cx + 30, cy + 9]], c)}`;
  };
  const arana = (cx, cy, c) => {
    const patas = [-9, -3, 3, 9].flatMap((dx, i) => [1, -1].map(s => pata([[cx + dx * 0.5, cy], [cx + dx * 2.2, cy + s * 16], [cx + dx * 3.4 + (i < 2 ? -4 : 4), cy + s * 27]], c))).join('');
    return `${patas}
      <circle cx="${cx - 17}" cy="${cy}" r="12" style="fill:var(${c})"/>
      <circle cx="${cx + 2}" cy="${cy}" r="8" style="fill:var(${c})"/>`;
  };
  const caja = (x, y, w, h, rotulo, c) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="none" style="stroke:var(${c})" stroke-width="3"/>
      <text x="${x + w / 2}" y="${y + 26}" text-anchor="middle" font-size="20" font-weight="800" style="fill:var(${c})">${rotulo}</text>`;
  const pie = (cx, l) => l.map((t, i) => `<text x="${cx}" y="${352 + i * 26}" text-anchor="middle" font-size="22" style="fill:var(--muted)">${t}</text>`).join('');

  // Los mismos tres bichos en los dos paneles. A la izquierda, la caja de «insectos» se arma por el tamaño y la araña
  // entra; a la derecha, la caja es la de la definición (seis patas) y la araña queda abajo, fuera.
  const svg = `<svg viewBox="0 0 520 400" width="520" height="400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="390" style="stroke:var(--line)" stroke-width="2"/>
    <text x="130" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">Lo que se entiende</text>
    ${caja(22, 48, 216, 272, 'bichos pequeños', '--muted')}
    ${hormiga(130, 116, '--c-i')}${mariquita(126, 190, '--c-i')}${arana(132, 270, '--c-o')}
    ${pie(130, ['La araña entra:', 'es insecto'])}
    <text x="390" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">Lo que dice</text>
    ${caja(282, 48, 216, 184, 'seis patas', '--c-i')}
    ${hormiga(390, 116, '--c-i')}${mariquita(386, 190, '--c-i')}${arana(392, 280, '--c-o')}
    <text x="452" y="286" text-anchor="middle" font-size="19" font-weight="800" style="fill:var(--c-o)">ocho</text>
    ${pie(390, ['La araña queda', 'fuera'])}
  </svg>`;

  return {
    unidad: 'razonamiento-verbal.definiciones',
    titulo: '¿Por qué la araña no es un insecto, si es tan pequeña como una hormiga?',
    parrafos: [
      ['Cuando aparece una araña en el rincón del baño, es común llamarla insecto, igual que a la hormiga de la cocina o a la mosca. ',
        'El diccionario de la Real Academia define al insecto como un animal con un par de antenas y ', seis('seis patas'), ', y deja fuera a la araña. ',
        'Para comprobarlo no hace falta un laboratorio: si cuentas las patas de una araña, encuentras ', ocho('ocho'), ', dos más que las de una hormiga.'],
      ['La idea que se usa en la casa es que un insecto es un bicho pequeño, de los que caminan por el suelo o vuelan cerca de la comida. ',
        'Con esa idea, la araña entra sin problema, porque es tan pequeña como una hormiga y también se mete por las rendijas. ',
        'Tampoco sirve pensar que los insectos son los bichos con alas, porque la hormiga obrera no tiene alas y es un insecto de todos modos.'],
      ['La araña y la hormiga se parecen en el tamaño, pero la definición de «insecto» no mira el tamaño del bicho ni el lugar donde vive. ',
        'Mira sus patas, que se pueden contar, y por eso la araña queda fuera aunque viva en la misma casa que la hormiga. ',
        'Esta unidad trata de las definiciones y de cómo se arma una que deje entrar justo lo que nombra la palabra, y nada más.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos dibujos con los mismos tres bichos: una hormiga, una mariquita y una araña. Lo que se entiende: una caja de bichos pequeños en la que entran los tres, y la araña pasa por insecto. Lo que dice la definición: en la caja de seis patas entran la hormiga y la mariquita, y la araña, con ocho patas, queda fuera.',
    },
    pregunta: 'El ciempiés también es un bicho pequeño que se esconde en las casas. ¿Qué tendrías que mirar en él para saber si la definición del diccionario lo deja entrar entre los insectos?',
    ficha: {
      seLleva: 'Una definición junta a las cosas por un rasgo que todas tienen y las demás no, no por cómo se ven: por eso la araña, con ocho patas, no es un insecto.',
      alcance: 'Parcial (deducción propia con el marco de lectura de PISA 2025: interpretar el sentido de una palabra con la información del texto; la definición por clase y rasgo es del examen de admisión, no de PISA).',
      choque: 'Por el tamaño, la araña es un insecto; la definición de «insecto» (seis patas) la deja fuera, porque tiene ocho.',
      atajo: 'Definir por el tamaño o por el lugar donde vive el bicho, que es lo que hace el alumno; y el arreglo «los insectos son los que tienen alas», que la hormiga obrera desmiente. Este segundo atajo es un rasgo frecuente y no necesario (idea 2), dicho sin tocar su Predice (las aves y la rana).',
      porVerificar: [
        'Definición de «insecto» en el Diccionario de la lengua española (RAE): artrópodo con cabeza diferenciada, un par de antenas y tres pares de patas, que en su mayoría tiene alas. El texto la resume en sus antenas y sus seis patas, sin copiarla.',
        'Que las hormigas obreras no tengan alas (las alas las tienen las reinas y los machos en el vuelo de apareamiento).',
        'Que el ciempiés, pese al nombre, no tenga cien patas, y que no sea un insecto (es un miriápodo, con muchas más de seis patas).',
      ],
      notas: [
        'El párrafo 3 dice que la definición de «insecto» no mira el tamaño sino las patas: es lo que el alumno se lleva, dicho del caso y no como regla.',
        'Revisión del Escribidor Escribano (27 nov): el párrafo 3 decía «Los junta por un rasgo que tienen todos los insectos y ningún otro bicho», que enunciaba la regla de las ideas 1 y 2 (rasgo que separa, presente en todos los casos); ahora dice «Mira sus patas, que se pueden contar». El cierre pasó de «de las definiciones, de cómo se arma una» (aposición que se lee como lista) a «de las definiciones y de cómo se arma una».',
        'La pregunta se puede intentar con el texto: hay que contarle las patas, y como el ciempiés tiene muchas, queda fuera. La clase la retoma para presentar el rasgo que separa.',
        'Figura: los mismos tres bichos en los dos paneles; cambia solo la caja (bichos pequeños o seis patas). El turquesa marca lo que entra y el naranja lo que se cuela, como en la leyenda de la idea 1.',
      ],
    },
  };
})());
