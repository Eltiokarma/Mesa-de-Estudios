/*
 * Apertura de «Analogías» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * En verbal el choque es entre lo que se entiende de un par y lo que dice: «Lima : Perú» parece tener una sola relación,
 * y en Bolivia la capital (Sucre) y la ciudad donde funciona el Gobierno (La Paz) son dos ciudades distintas. El dato es
 * comprobable (Constitución de Bolivia de 2009). Lo que el alumno se lleva va en ficha.seLleva. La apertura vecina
 * (definiciones) abre con un hecho de la naturaleza; esta, con uno de geografía y leyes. No adelanta la Predice de la
 * idea 1 («pescador : red»), la de la idea 2 («árbol : bosque») ni la de la idea 5 («cantante : cantar»). Colores: la
 * relación «es la capital de» en naranja (c-o) y «es la sede del Gobierno de» en turquesa (c-i).
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const capital = t => ({ v: 'c-o', t }), sede = t => ({ v: 'c-i', t });

  // Una ficha con un par de la analogía, como en la hoja del simulacro.
  const ficha = (cx, y, par, c) => `<rect x="${cx - 100}" y="${y}" width="200" height="46" rx="12" style="fill:var(--card);stroke:var(${c})" stroke-width="3"/>
      <text x="${cx}" y="${y + 31}" text-anchor="middle" font-size="22" font-weight="800" fill="currentColor">${par}</text>`;
  const flecha = (cx, y1, y2, c) => `<line x1="${cx}" y1="${y1}" x2="${cx}" y2="${y2 - 10}" style="stroke:var(${c})" stroke-width="3" stroke-linecap="round"/>
      <path d="M${cx - 8} ${y2 - 12}L${cx} ${y2}L${cx + 8} ${y2 - 12}Z" style="fill:var(${c})"/>`;
  const rotulo = (cx, y, t, c) => `<text x="${cx}" y="${y}" text-anchor="middle" font-size="18" font-weight="800" style="fill:var(${c})">${t}</text>`;
  const pie = (cx, l) => l.map((t, i) => `<text x="${cx}" y="${358 + i * 26}" text-anchor="middle" font-size="22" style="fill:var(--muted)">${t}</text>`).join('');

  // El mismo par de arriba en los dos paneles. A la izquierda, una sola flecha y una sola respuesta; a la derecha, la
  // relación se escribe y cada relación lleva a su ciudad.
  const svg = `<svg viewBox="0 0 520 410" width="520" height="410" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="400" style="stroke:var(--line)" stroke-width="2"/>
    <text x="130" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">Lo que se entiende</text>
    ${ficha(130, 56, 'Lima : Perú', '--ink')}
    ${flecha(130, 108, 196, '--muted')}
    ${rotulo(146, 160, 'como', '--muted').replace('text-anchor="middle"', 'text-anchor="start"')}
    ${ficha(130, 202, 'La Paz : Bolivia', '--muted')}
    ${pie(130, ['Una relación:', 'una respuesta'])}
    <text x="390" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">Lo que dice</text>
    ${ficha(390, 56, 'Lima : Perú', '--ink')}
    ${rotulo(390, 134, 'si es «la capital de»', '--c-o')}
    ${ficha(390, 146, 'Sucre : Bolivia', '--c-o')}
    ${rotulo(390, 228, 'si es «la sede del Gobierno de»', '--c-i').replace('font-size="18"', 'font-size="16"')}
    ${ficha(390, 240, 'La Paz : Bolivia', '--c-i')}
    ${pie(390, ['Dos relaciones:', 'dos respuestas'])}
  </svg>`;

  return {
    unidad: 'razonamiento-verbal.analogias',
    titulo: '¿Por qué «Lima es al Perú como La Paz es a Bolivia» puede ser una respuesta equivocada?',
    parrafos: [
      ['Lima es la capital del Perú, y en Lima funcionan también el Gobierno, el Congreso y la Corte Suprema, así que en el Perú la capital y la sede del Gobierno son la misma ciudad. ',
        'En Bolivia están separadas, porque su Constitución de 2009 dice que la capital es ', capital('Sucre'), ', pero el Gobierno y la Asamblea Legislativa funcionan en ',
        sede('La Paz'), ', a varias horas de viaje de Sucre.'],
      ['Con lo que sabes del Perú, la comparación «Lima es al Perú como La Paz es a Bolivia» parece segura, porque de La Paz salen las noticias del Gobierno boliviano. ',
        'Si alguien la cambia por «Sucre es a Bolivia», lo primero que se piensa es que se equivocó de ciudad, y que la duda se arregla con un mapa o con un libro de geografía.'],
      ['El mapa no arregla nada, porque las dos respuestas pueden ser correctas: Lima es a la vez la capital y la sede del Gobierno del Perú, y cada respuesta copia una de esas dos relaciones. ',
        'Si la relación es «es la capital de», el par que la repite es Sucre y Bolivia; si es «es la sede del Gobierno de», el par es La Paz y Bolivia. ',
        'Dos pares de palabras unidos de la misma manera forman una analogía, y de las analogías trata esta unidad.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos dibujos con el mismo par de arriba, Lima : Perú. Lo que se entiende: una sola flecha lleva a La Paz : Bolivia, una sola respuesta. Lo que dice: si la relación es la capital de, el par es Sucre : Bolivia; si es la sede del Gobierno de, el par es La Paz : Bolivia. Dos relaciones dan dos respuestas.',
    },
    pregunta: 'Lima también es la ciudad con más habitantes de todo el Perú. Si la analogía usara esa relación, ¿qué tendrías que averiguar de Bolivia para completarla?',
    ficha: {
      seLleva: 'Antes de completar una analogía hay que decir qué relación une a las dos palabras, porque un mismo par puede tener varias: en Bolivia, la capital y la sede del Gobierno son dos ciudades distintas.',
      alcance: 'Parcial (deducción propia con el marco de lectura de PISA 2025: reflexionar sobre la relación entre dos informaciones; la analogía como formato de pregunta es del examen de admisión, no de PISA).',
      choque: 'El par «Lima : Perú» parece llevar solo a La Paz; con la relación «es la capital de» lleva a Sucre, y con «es la sede del Gobierno de», a La Paz.',
      atajo: 'Pensar que es un problema de geografía que se arregla con un mapa: el mapa dice dónde está cada cosa, pero no cuál de las dos relaciones pide el par. La trampa del tema (los dos pares hablan de capitales y países) se descarta en el párrafo 3 sin usar la oración de la misión de la idea 1.',
      porVerificar: [
        'Constitución Política del Estado Plurinacional de Bolivia (2009), artículo 6: «Sucre es la Capital de Bolivia». Que el Gobierno y la Asamblea Legislativa Plurinacional funcionen en La Paz no lo dice la Constitución: es la práctica desde fines del siglo XIX (sede de gobierno de hecho; de memoria). El Tribunal Supremo de Justicia sí está en Sucre. Por eso el texto atribuye a la Constitución solo la capital.',
        'Que en Lima funcionen el Gobierno, el Congreso y la Corte Suprema del Perú.',
        '«A varias horas de viaje»: Sucre y La Paz están a unos 400 km en línea recta y a más de 10 horas por carretera (de memoria).',
        'Que Santa Cruz de la Sierra sea la ciudad más poblada de Bolivia (respuesta de la pregunta guía; de memoria).',
      ],
      notas: [
        'Revisión del Escribidor Escribano (27 nov), hechos: el párrafo 1 decía «su Constitución de 2009 dice que la capital es Sucre, y el Gobierno y la Asamblea Legislativa funcionan en La Paz», que se lee como si la Constitución dijera las dos cosas; el artículo 6 solo fija la capital. Ahora el «pero» separa lo que dice la ley de lo que pasa en la práctica.',
        'Revisión del Escribidor Escribano (27 nov), regla: el párrafo 3 cerraba con «primero se dice con exactitud qué une a las dos palabras de un par y después se busca otro par unido de la misma manera», que es el método de la oración puente (ideas 1 y 5), y decía «el tema de los dos pares es el mismo», que adelanta la regla de la idea 1 (el mismo tema no basta). Ahora dice el choque del caso (Lima es capital y sede a la vez, y cada respuesta copia una relación) y solo nombra el tema. En el párrafo 2, «la analogía» pasó a «la comparación», para no usar el nombre del tema antes de presentarlo, y «la cosa se arreglaría» a «la duda se arregla».',
        'La pregunta se puede intentar con el texto: hay que averiguar cuál es la ciudad más poblada de Bolivia, y no basta saber dónde está el Gobierno. Muestra que cambiar la relación cambia la respuesta.',
        'Contenido, para Gerson: el tema es de geografía y leyes de otro país. Si se prefiere un ejemplo del Perú, habría que buscar uno donde dos relaciones del mismo par lleven a respuestas distintas.',
        'Doble revisión (27 nov): sin cambios. El par de arriba es el mismo en los dos paneles y cambia una sola cosa, la relación que se copia; el error es real (un alumno peruano tiende a dar La Paz por capital de Bolivia, y en Juliaca La Paz es la ciudad boliviana conocida), y Sucre como capital está en el artículo 6 de la Constitución de 2009. No pone a nadie como el problema.',
      ],
    },
  };
})());
