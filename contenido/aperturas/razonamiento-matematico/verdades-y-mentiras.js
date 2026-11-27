/*
 * Apertura de «Verdades y mentiras» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * Escrita desde cero (27 nov). El choque es un dato medido sobre personas: mirando la cara se descubre una mentira casi
 * tan poco como tirando una moneda (54 de cada 100 aciertos, metaanálisis de Bond y DePaulo, 2006), y la señal que más
 * gente cree, que el mentiroso esquiva la mirada, no sirve. Lo que el alumno se lleva (ficha.seLleva): a quien miente lo
 * delata lo que dice, cuando choca con otra frase o con un hecho, no su cara.
 * No adelanta ninguna Predice: ni la de «Yo digo la verdad» (idea 1), ni la de «Todos aprobaron» (idea 2), ni la del par
 * que se contradice (idea 3), ni la de la mochila (idea 4), ni la del podio (idea 5) ni la de cuántos mienten (idea 6).
 * La pregunta no da la regla del par que se contradice: pide qué revisar en lo que escriben.
 * Colores de la unidad (cabecera de contenido/teoria/razonamiento-matematico/verdades-y-mentiras.js): tinta para lo que
 * amarra; la barra de lo que se supone (mirar la cara) en naranja (c-o) y la de la moneda en gris. Sin verde, carmín ni
 * violeta.
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const cara = t => ({ v: 'c-o', t });

  // Dos barras con la misma escala (0 a 100 aciertos de cada 100 veredictos) y la marca de la moneda en 50.
  const X0 = 66, ANCHO = 172;
  const px = v => X0 + ANCHO * v / 100;
  const rostro = (x, y) => `<circle cx="${x}" cy="${y}" r="17" style="fill:var(--card)" stroke="currentColor" stroke-width="3"/>
      <circle cx="${x - 2}" cy="${y - 4}" r="2.6" fill="currentColor"/><circle cx="${x + 8}" cy="${y - 4}" r="2.6" fill="currentColor"/>
      <path d="M${x - 5} ${y + 8}h11" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>`;
  const moneda = (x, y) => `<circle cx="${x}" cy="${y}" r="17" style="fill:var(--card)" stroke="currentColor" stroke-width="3"/>
      <circle cx="${x}" cy="${y}" r="12" fill="none" style="stroke:var(--muted)" stroke-width="1.5"/>
      <text x="${x}" y="${y + 6}" text-anchor="middle" font-size="15" font-weight="800" fill="currentColor">S/</text>`;
  const barra = (x0, y, v, estilo, rotulo) => `<rect x="${x0 + X0}" y="${y}" width="${ANCHO}" height="30" rx="6" style="fill:var(--line)"/>
      <rect x="${x0 + X0}" y="${y}" width="${Math.round(ANCHO * v / 100)}" height="30" rx="6" style="${estilo}"/>
      <text x="${x0 + px(v) - 8}" y="${y + 21}" text-anchor="end" font-size="18" font-weight="800" style="fill:var(--card)">${rotulo}</text>`;
  const pie = (cx, l) => l.map((x, i) => `<text x="${cx}" y="${342 + i * 25}" text-anchor="middle" font-size="21" style="fill:var(--muted)">${x}</text>`).join('');

  const panel = (x0, titulo, vCara, rCara, pieTxt) => {
    const cx = x0 + 130, m = x0 + px(50);
    return `<text x="${cx}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      <line x1="${m}" y1="84" x2="${m}" y2="226" stroke="currentColor" stroke-width="2" stroke-dasharray="5 4"/>
      <text x="${x0 + X0}" y="80" font-size="17" font-weight="700" fill="currentColor">Mirando la cara</text>
      ${rostro(x0 + 34, 105)}${barra(x0, 90, vCara, 'fill:var(--c-o)', rCara)}
      <text x="${x0 + X0}" y="170" font-size="17" font-weight="700" fill="currentColor">Tirando una moneda</text>
      ${moneda(x0 + 34, 195)}${barra(x0, 180, 50, 'fill:var(--muted)', '50')}
      <line x1="${x0 + X0}" y1="236" x2="${x0 + X0 + ANCHO}" y2="236" style="stroke:var(--muted)" stroke-width="2"/>
      ${[0, 50, 100].map(v => `<line x1="${x0 + px(v)}" y1="231" x2="${x0 + px(v)}" y2="241" style="stroke:var(--muted)" stroke-width="2"/>
      <text x="${x0 + px(v)}" y="260" text-anchor="middle" font-size="16" style="fill:var(--muted)">${v}</text>`).join('')}
      <text x="${x0 + X0 + ANCHO / 2}" y="284" text-anchor="middle" font-size="16" style="fill:var(--muted)">aciertos de cada 100</text>
      ${pie(cx, pieTxt)}`;
  };
  const svg = `<svg viewBox="0 0 520 380" width="520" height="380" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="370" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', 80, 'la mayoría', ['Mirando la cara,', 'la mentira se nota'])}
    ${panel(260, 'Lo que se mide', 54, '54', ['Mirando la cara:', 'casi como una moneda'])}
  </svg>`;

  return {
    unidad: 'razonamiento-matematico.verdades-y-mentiras',
    titulo: '¿Por qué casi nadie descubre una mentira mirando la cara?',
    parrafos: [
      ['Cuando en tu casa se acaba la gaseosa de la refrigeradora y cada hermano jura que no fue él, lo primero que haces es mirarles la cara. ',
        'En cientos de experimentos, miles de personas vieron videos de gente que mentía o decía la verdad y tuvieron que decir cuál era cuál: ',
        cara('acertaron 54 de cada 100 veces'), ', y tirando una moneda habrían acertado 50.'],
      ['Casi todo el mundo cree que la mentira se nota, que quien miente se pone nervioso, se toca la cara o esquiva la mirada, y que fijándose bien se le descubre la mayoría de las veces. ',
        'En una encuesta hecha en 58 países, la señal más nombrada fue la de esquivar la mirada, pero en los experimentos esa señal no sirve, porque los mentirosos miran a los ojos tanto como los demás.'],
      ['La cara casi no delata a nadie, y en la vida real tampoco hay una manera segura de saber quién miente, porque se puede mentir con una historia que no choca con nada. ',
        'En los acertijos de verdades y mentiras de esta unidad, en cambio, cada persona dice siempre la verdad o miente siempre. Con esa regla se descubre quién miente sin ver ninguna cara, solo con lo que dice cada uno.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos dibujos de barras con la misma escala, de 0 a 100 aciertos. Lo que predice la creencia común: mirando la cara se acierta la mayoría de las veces, mucho más que tirando una moneda, que acierta 50. Lo que se mide: mirando la cara se acierta 54 de cada 100 veces, casi lo mismo que la moneda.',
    },
    pregunta: 'En un juego por mensajes, cada jugador dice siempre la verdad o miente siempre, y nadie ve la cara de los demás. ¿Qué revisarías en lo que escribe cada uno para descubrir quién miente?',
    ficha: {
      seLleva: 'Mirando la cara, casi nadie descubre una mentira: se acierta poco más que tirando una moneda. En un acertijo, donde cada uno dice siempre la verdad o miente siempre, lo que dicen basta para saber quién miente.',
      alcance: 'Parcial (deducción propia con el marco de Matemática PISA 2022: razonamiento matemático; la lógica de veraces y mentirosos no es contenido PISA, pero el dato medido es de incertidumbre y datos).',
      choque: 'Se cree que la mentira se nota en la cara; mirando la cara se acierta 54 de cada 100 veces, casi lo mismo que con una moneda (50).',
      atajo: 'La explicación trampa: «quien miente esquiva la mirada». Es la señal que más gente cree, y en los estudios no distingue a quien miente. Otro atajo que se descarta es fijarse mejor: el promedio de 54 junta a miles de personas, también a las que se creían buenas para eso.',
      porVerificar: [
        '54 de cada 100: Bond y DePaulo, «Accuracy of deception judgments», Personality and Social Psychology Review 10 (2006), metaanálisis de 206 documentos con 24 483 jueces; acierto promedio de 54 % (de memoria: 47 % de las mentiras y 61 % de las verdades). Confirmar cifras.',
        'La encuesta de 58 países: Global Deception Research Team, «A world of lies», Journal of Cross-Cultural Psychology 37 (2006); de memoria, esquivar la mirada fue la creencia más nombrada (cerca de dos de cada tres respuestas). Confirmar el número de países y la cifra.',
        'Que esquivar la mirada no se relaciona con mentir: DePaulo y otros, «Cues to deception», Psychological Bulletin 129 (2003), de memoria (efecto cercano a cero).',
        'Los experimentos casi siempre son de adultos que juzgan videos o grabaciones de desconocidos, no de hermanos que se conocen; el texto dice «gente que mentía», sin afirmar que con conocidos pase igual.',
      ],
      notas: [
        'La barra de «Lo que predice» no es un dato: dibuja la creencia de que «se nota casi siempre» y lleva el rótulo «la mayoría», sin número. La de «Lo que se mide» y la de la moneda sí son datos.',
        'La pregunta se puede intentar con el párrafo 3: revisar si lo que escribe uno choca con lo que escribe otro o con lo que se sabe. No dice que en un par que se contradice uno mienta (eso es de la idea 3) ni pide suponer tarjetas (idea 1).',
        'Se evitan los nombres de la unidad (Ana, Beto, Ciro, Rosa, Eva, Fito, Gaby, Hugo) y las frases de sus respuestas; la prueba común lo comprueba.',
        'Para Gerson: el párrafo 3 nombra la salida (lo que dice la persona, cuando choca con otra frase o con un hecho) y no da ningún método.',
        'Revisión del Escribidor Escribano (27 nov, otro agente): el párrafo 3, la pregunta y seLleva prometían que a quien miente «lo delata lo que dice», como si las técnicas de la unidad sirvieran para descubrir mentiras en la vida real. No es así: alguien puede mentir sin contradecirse, y los acertijos funcionan porque cada personaje miente siempre o dice siempre la verdad. Ahora el párrafo 3 lo dice (en dos oraciones, para no pasar de 40 palabras), la pregunta pone esa regla a los hermanos y seLleva separa la vida real del acertijo. El párrafo 2 pasó de «Casi todos creemos» a «Casi todo el mundo cree». Datos: el 54 %, los 206 documentos y los 24 483 jueces de Bond y DePaulo, y los 58 países de la encuesta (estudio 1 del Global Deception Research Team), se confirmaron en fuentes secundarias y en el resumen de PubMed el 27 nov; el desglose 47 % y 61 % sigue de memoria.',
        'Doble revisión (27 nov): el dato y la creencia hablan del mismo caso (mirar la cara para saber si alguien miente), y el 54 frente al 50 de la moneda es medido. Dos cambios. La pregunta ponía a los hermanos de la gaseosa a mentir siempre, y convertir a la familia del alumno en mentirosos fijos no hace falta: ahora la regla es de un juego por mensajes, con jugadores. Y la creencia se dibujaba como «casi todo» (barra en 88), más de lo que se sabe que la gente cree; ahora dice «la mayoría de las veces» (barra en 80, sin número), que es lo que muestran los estudios de confianza: la gente cree que acierta bastante más que una moneda. El pie del panel dice «Mirando la cara, la mentira se nota», la voz de la creencia popular.',
        'Tercera pasada (27 nov): sin ecuaciones en la oración ni palabras de doble sentido. «Cara» se usa solo como rostro; la moneda aparece sin hablar de cara y sello.',
      ],
    },
  };
})());
