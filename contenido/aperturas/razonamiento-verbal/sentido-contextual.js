/*
 * Apertura de «Precisión léxica y sentido contextual» (docs/metodo/apertura-pisa.md; criterio en
 * docs/metodo/entrada-pisa.md). En verbal el choque es entre lo que se entiende de un texto y lo que dice: el parte
 * médico «grave, pero estable» se lee como «ya está bien», y en el hospital «estable» quiere decir que el paciente no
 * cambia. El dato es el texto mismo (una fórmula común de los partes médicos). Lo que el alumno se lleva va en
 * ficha.seLleva. La apertura vecina (analogías) abre con geografía y leyes; esta, con un texto de salud de las noticias.
 * No adelanta la Predice de la idea 1 («clara» y su contrario), la de la idea 2 («delgado») ni la de la idea 3
 * («examinó»). Colores: la palabra «estable» y su línea en turquesa (c-i); «grave», en carmín (c-h).
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const estable = t => ({ v: 'c-i', t }), grave = t => ({ v: 'c-h', t });
  const r1 = n => Math.round(n * 10) / 10;

  // Dos gráficas con la misma escala: el estado del paciente a lo largo de un día, de «grave» (arriba) a «bien»
  // (abajo). A la izquierda, la lectura de afuera: la línea baja hasta «bien». A la derecha, lo que dice el parte: la
  // línea se queda en «grave», sin subir ni bajar.
  const X0 = 72, X1 = 246, ARRIBA = 92, ABAJO = 272;
  const panel = (x0, titulo, pts, pie) => {
    const x = t => x0 + X0 + (X1 - X0) * t, y = v => ARRIBA + (ABAJO - ARRIBA) * v;
    const d = 'M' + pts.map(([t, v]) => `${r1(x(t))} ${r1(y(v))}`).join('L');
    return `<text x="${x0 + 130}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      <line x1="${x0 + X0}" y1="${ARRIBA - 14}" x2="${x0 + X0}" y2="${ABAJO}" stroke="currentColor" stroke-width="2.5"/>
      <line x1="${x0 + X0}" y1="${ABAJO}" x2="${x0 + X1}" y2="${ABAJO}" stroke="currentColor" stroke-width="2.5"/>
      <text x="${x0 + X0 - 8}" y="${ARRIBA + 7}" text-anchor="end" font-size="19" font-weight="800" style="fill:var(--c-h)">grave</text>
      <text x="${x0 + X0 - 8}" y="${ABAJO - 2}" text-anchor="end" font-size="19" font-weight="700" fill="currentColor">bien</text>
      <line x1="${x0 + X0}" y1="${ARRIBA}" x2="${x0 + X1}" y2="${ARRIBA}" style="stroke:var(--c-h)" stroke-width="1.5" stroke-dasharray="5 6"/>
      <text x="${x0 + (X0 + X1) / 2}" y="${ABAJO + 26}" text-anchor="middle" font-size="18" style="fill:var(--muted)">horas del día</text>
      <path d="${d}" fill="none" style="stroke:var(--c-i)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      ${pie.map((l, i) => `<text x="${x0 + 130}" y="${346 + i * 26}" text-anchor="middle" font-size="22" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 384" width="520" height="384" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="374" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que se entiende', [[0, 0], [0.25, 0.05], [0.55, 0.45], [0.8, 0.85], [1, 0.95]], ['«Estable»:', 'ya está bien'])}
    ${panel(260, 'Lo que dice', [[0, 0], [1, 0]], ['«Estable»:', 'no cambia'])}
  </svg>`;

  return {
    unidad: 'razonamiento-verbal.sentido-contextual',
    titulo: '¿Cómo puede un paciente estar grave y estable al mismo tiempo?',
    parrafos: [
      ['Cuando una persona famosa está internada, el parte médico que leen los noticieros suele decir que se encuentra en estado ', grave('grave'), ', pero ', estable('estable'), '. ',
        'En el lenguaje de los médicos, un paciente estable es uno cuyo pulso, presión y respiración no han cambiado de manera importante en las últimas horas, ni para mejor ni para peor.'],
      ['Fuera del hospital, «estable» es una palabra que tranquiliza: un trabajo estable no se pierde y una mesa estable no se cae. ',
        'Con ese sentido, el parte parece decir que el peligro ya pasó, y la gente que lo lee en la noticia se queda tranquila sin motivo. ',
        'Buscar la palabra en el diccionario tampoco resuelve la duda, porque trae varios sentidos de «estable» y no dice cuál es el del parte médico.'],
      ['El parte no se contradice: dice que el paciente está mal y que no empeora, y quien entiende «ya está bien» le pone a la palabra el sentido que tiene en la calle. ',
        'La palabra es la misma en el hospital y en la calle, y lo que cambia es el lugar donde aparece y, con él, lo que quiere decir. ',
        'Esta unidad trata de ese sentido que una palabra toma en su contexto y de cómo elegir la palabra precisa.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos gráficas iguales del estado de un paciente durante un día, de grave arriba a bien abajo. Lo que se entiende: la línea baja de grave a bien, porque estable se lee como ya está bien. Lo que dice el parte: la línea se queda en grave todo el día, porque estable quiere decir que no cambia.',
    },
    pregunta: 'Un parte médico dice «estado leve y estable» y otro, «estado grave y estable». ¿Qué palabra de cada parte te dice cuánto peligro corre cada paciente?',
    ficha: {
      seLleva: 'Una palabra cambia de sentido según dónde se usa: en un parte médico, «estable» quiere decir que el paciente no cambia, no que ya esté bien.',
      alcance: 'Sí (marco de lectura de PISA 2025, deducción propia: comprender el sentido literal y localizar en el texto la información que fija el sentido de una palabra).',
      choque: 'Con el sentido de la calle, «grave, pero estable» se lee como «ya está bien»; en el parte quiere decir que sigue grave y no cambia.',
      atajo: 'Buscar «estable» en el diccionario, que trae varios sentidos y no dice cuál es el del parte. Y pensar que el parte se contradice (grave y estable no pueden ir juntos), que se descarta en el párrafo 3: el parte afirma las dos cosas.',
      porVerificar: [
        'Que la fórmula «estado grave, pero estable» sea común en los partes médicos que difunden los hospitales y los noticieros del Perú (de memoria, por uso frecuente en la prensa).',
        'El sentido clínico de «estable»: signos vitales (pulso, presión, respiración) que se mantienen sin cambios importantes en un periodo; no implica mejoría ni que el paciente esté fuera de peligro.',
        'Que el Diccionario de la lengua española traiga varias acepciones de «estable» (la primera: que se mantiene sin peligro de cambiar, caer o desaparecer).',
      ],
      notas: [
        'Revisión del Escribidor Escribano (27 nov): el párrafo 3 decía «el lector tiene que buscar en el texto las pistas que dicen cuál le toca», que es la regla de la idea 1 (la acepción la piden las pistas de la oración); ahora dice solo el choque del caso (la palabra es la misma y cambia el lugar). «Una persona conocida» pasó a «una persona famosa» (conocida también es «a quien conozco», y el parte de los noticieros es de alguien famoso); «quien lo lee» pasó a «la gente que lo lee», para no repetir «quien» en dos párrafos seguidos; el sentido clínico ahora dice «no han cambiado de manera importante», que es más fiel que «no han cambiado».',
        'El parte dice «grave, pero estable»; el «pero» también empuja a leer que el peligro pasó, y no se comenta aquí porque es el choque de la apertura de conectores.',
        'La pregunta se puede intentar con el texto: «leve» y «grave» dicen cuánto peligro hay; «estable» solo dice que no cambia.',
        'Figura: dos gráficas con la misma escala; cambia solo la línea. El carmín marca el nivel «grave» y el turquesa, al paciente estable.',
      ],
    },
  };
})());
