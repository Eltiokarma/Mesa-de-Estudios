/*
 * Apertura de «Razonamiento deductivo y parentesco» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * Escrita desde cero (27 nov), con los cuatro puntos de «Lo que el alumno se lleva». El choque es el de la conjunción
 * (Tversky y Kahneman, 1983) con un caso propio: Rosa, que arma robots, y la apuesta entre «trabaja en un banco» y
 * «trabaja en un banco y dicta robótica». Lo que el alumno se lleva va en ficha.seLleva.
 * No adelanta ninguna Predice: ni la del cuadro (idea 1, «Ciro juega ajedrez»), ni la de los músicos (idea 2), ni la de
 * los aros (idea 3, «Ningún quenista baila diablada»), ni la del condicional (idea 4, la pista seca) ni la de los padres y
 * los hijos que van a pescar (idea 5). Colores de la paleta de deducción de la unidad (cabecera de
 * contenido/teoria/razonamiento-matematico/razonamiento-deductivo.js): el primer grupo en naranja (c-o, trabajan en un
 * banco) y el segundo en turquesa (c-i, dictan robótica); sin carmín ni verde, y sin violeta (es lo seguro, ya comprobado).
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const banco = t => ({ v: 'c-o', t }), robot = t => ({ v: 'c-i', t });
  const r1 = n => Math.round(n * 10) / 10;

  // Personas como puntos en una rejilla escalonada; cada punto que cae dentro del círculo (cx, cy, r) se dibuja, con el
  // color de su grupo. `dentro` decide, para un punto, si además está en el segundo grupo.
  const gente = (cx, cy, r, color, dentro) => {
    let s = '';
    for (let y = cy - r + 12; y <= cy + r - 10; y += 15) {
      const fila = Math.round((y - cy) / 15);
      for (let x = cx - r + 10 + (fila % 2 ? 7.5 : 0); x <= cx + r - 10; x += 15) {
        if ((x - cx) ** 2 + (y - cy) ** 2 > (r - 9) ** 2) continue;
        const c = dentro && dentro(x, y) ? '--c-i' : color;
        s += `<circle cx="${r1(x)}" cy="${r1(y)}" r="3.6" style="fill:var(${c})" fill-opacity=".75"/>`;
      }
    }
    return s;
  };
  const aro = (cx, cy, r, color, relleno) => `<circle cx="${cx}" cy="${cy}" r="${r}" style="fill:var(${color})" fill-opacity="${relleno}"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" style="stroke:var(${color})" stroke-width="3.5"/>`;
  const rotulo = (x, y, lineas, color, t = 18) => lineas.map((l, i) => `<text x="${x}" y="${y + i * (t + 3)}" text-anchor="middle" font-size="${t}" font-weight="800" style="fill:var(${color});stroke:var(--card)" stroke-width="4" paint-order="stroke">${l}</text>`).join('');

  const pie = (cx, l) => l.map((x, i) => `<text x="${cx}" y="${352 + i * 25}" text-anchor="middle" font-size="21" style="fill:var(--muted)">${x}</text>`).join('');

  // Lo que predice: la opción que encaja con la historia se siente más grande que la opción sola.
  const predice = x0 => {
    const cx = x0 + 130;
    return `<text x="${cx}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">Lo que predice</text>
      ${aro(cx - 80, 200, 40, '--c-o', 0.1)}${gente(cx - 80, 200, 40, '--c-o')}
      ${aro(cx + 48, 186, 74, '--c-i', 0.1)}${gente(cx + 48, 186, 74, '--c-i')}
      ${rotulo(cx - 80, 146, ['banco'], '--c-o')}
      ${rotulo(cx + 40, 98, ['banco y robótica'], '--c-i')}
      ${pie(cx, ['Banco y robótica:', 'más probable'])}`;
  };
  // Lo que se mide: quien dicta robótica y trabaja en un banco está dentro del grupo del banco.
  const mide = x0 => {
    const cx = x0 + 130, cy = 186, R = 100, sx = cx + 24, sy = 200, sr = 44;
    const enSub = (x, y) => (x - sx) ** 2 + (y - sy) ** 2 <= (sr - 6) ** 2;
    return `<text x="${cx}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">Lo que se mide</text>
      ${aro(cx, cy, R, '--c-o', 0.08)}
      <circle cx="${sx}" cy="${sy}" r="${sr}" style="fill:var(--c-i)" fill-opacity=".12"/>
      ${gente(cx, cy, R, '--c-o', enSub)}
      <circle cx="${sx}" cy="${sy}" r="${sr}" fill="none" style="stroke:var(--c-i)" stroke-width="3.5"/>
      ${rotulo(cx, 112, ['banco'], '--c-o')}
      ${rotulo(sx - 6, sy + sr + 24, ['banco y robótica'], '--c-i', 17)}
      ${pie(cx, ['Banco y robótica:', 'cabe dentro de banco'])}`;
  };
  const svg = `<svg viewBox="0 0 520 392" width="520" height="392" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="382" style="stroke:var(--line)" stroke-width="2"/>
    ${predice(0)}${mide(260)}
  </svg>`;

  return {
    unidad: 'razonamiento-matematico.razonamiento-deductivo',
    titulo: '¿Puede ser más probable que Rosa sea dos cosas que una sola?',
    parrafos: [
      ['Rosa tiene 31 años, estudió ingeniería electrónica en la UNI y desde niña desarmaba radios para ver cómo funcionaban. ',
        'Con esos datos, ¿qué te parece más probable: que Rosa ', banco('trabaje en un banco'), ', o que ', banco('trabaje en un banco'), ' y además ',
        robot('dicte talleres de robótica'), ' los sábados? ',
        'En 1983, los psicólogos Amos Tversky y Daniel Kahneman le hicieron una pregunta como esta, con otra persona y otras opciones, a un grupo de universitarios de Canadá, y unos 85 de cada 100 eligieron la segunda opción.'],
      ['La elección se siente razonable, porque la segunda opción encaja con lo que sabes de Rosa y la primera no encaja con nada. ',
        'Con esa idea, la opción de banco y robótica le ganaría a la de banco, y mientras más detalles de la historia coinciden, más segura parece la apuesta.'],
      ['Sin embargo, toda persona que ', banco('trabaja en un banco'), ' y ', robot('dicta robótica'), ' también trabaja en un banco, así que el grupo de la segunda opción cabe entero dentro del de la primera y no puede ser más grande. ',
        'Lo que encaja con la historia no siempre es lo que se puede asegurar, y separar lo creíble de lo que no puede fallar es el trabajo del razonamiento deductivo, el tema de esta unidad.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos dibujos de grupos de personas. Lo que predice la historia de Rosa: el grupo de quienes trabajan en un banco y dictan robótica es más grande que el de quienes trabajan en un banco. Lo que se mide: ese grupo está dentro del grupo del banco y es más chico.',
    },
    pregunta: 'Tu amiga apuesta a que Rosa trabaja en un banco y dicta robótica, y tú, a que trabaja en un banco. ¿Hay algún caso en que ella gane la apuesta y tú la pierdas?',
    ficha: {
      seLleva: 'Lo que encaja con una historia no es lo más seguro: un grupo que cumple dos condiciones siempre cabe dentro del que cumple una sola, así que nunca puede ser más probable.',
      alcance: 'Parcial (deducción propia con el marco de Matemática PISA 2022: razonamiento matemático e incertidumbre; la lógica formal de la unidad, los cuadros de doble entrada y el parentesco no son contenido PISA).',
      choque: 'La historia de Rosa hace elegir «banco y robótica» como más probable, y ese grupo cabe dentro de «banco»: no puede ser mayor.',
      atajo: 'La idea de que más detalles que coinciden dan más pruebas, que es la que hace caer; y la de que las dos opciones valen lo mismo porque «las dos pueden pasar», que no ve que una cabe dentro de la otra. Sin probabilidad formal: el dibujo de los grupos (Venn) basta, y es lo que la idea 3 trabaja después.',
      porVerificar: [
        'El experimento: Tversky y Kahneman, «Extensional versus intuitive reasoning: The conjunction fallacy in probability judgment», Psychological Review 90 (1983). De memoria: la versión de dos opciones del problema de Linda se hizo con 142 estudiantes de la Universidad de Columbia Británica (Canadá), y el 85 % eligió la conjunción. Confirmar el número de estudiantes, el porcentaje y la universidad en el artículo. Revisión (27 nov): el 85 % se confirmó en una fuente secundaria (Charness, Karni y Levin, que citan la p. 297 del artículo); los 142 estudiantes no, así que el texto ya no da ese número y dice «unos 85 de cada 100».',
        'El caso de Rosa es propio (la persona, la UNI y los oficios), hecho para que el alumno lo reconozca; no es el del experimento, que usaba a «Linda», cajera de banco y feminista. El texto lo dice: «con otra persona y otras opciones».',
      ],
      notas: [
        'La figura dibuja cada opción como un grupo de personas: en «Lo que predice», el tamaño del grupo es lo probable que se siente; en «Lo que se mide», es el grupo real. Así el choque se ve sin números de probabilidad.',
        'La pregunta se puede responder con la figura: no hay ningún caso, porque si gana ella (banco y robótica), Rosa trabaja en un banco y también gana el alumno. Abre la idea de la unidad sin decirla: una conclusión es segura cuando vale en todos los casos.',
        'Para Gerson: el párrafo 3 dice por qué la segunda opción no puede ser mayor (el grupo cabe dentro del otro). Es la salida del choque y lo que sostiene seLleva; no adelanta la regla de los aros (idea 3) ni ningún «Ningún… es…».',
        'El parentesco, que también es de la unidad, no aparece en la apertura: forzarlo en el mismo choque lo volvía otro tema.',
        'Revisión del Escribidor Escribano (27 nov, otro agente): el párrafo 2 decía que la segunda opción sería más probable «que solo trabaje en un banco». Ese «solo» cambia la primera opción por «banco y no robótica», y con esa lectura la segunda sí podría ser más probable, que es justo lo que el choque niega; ahora compara «banco y robótica» con «banco». Se quitó el número de estudiantes, que no está confirmado, y «lo que sabemos de Rosa» pasó a «lo que sabes», de tú.',
        'Doble revisión (27 nov): las cuentas cuadran (las dos opciones hablan de la misma Rosa, y el grupo de banco y robótica cabe en el de banco), y el error es real: es la falacia de la conjunción, medida en el experimento que se cita. Rosa no es un estereotipo que hiera: es una ingeniera, y lo que hace caer es que la historia encaja, no un prejuicio sobre ella. Único cambio: «otros oficios» pasó a «otras opciones», porque en el experimento original la segunda opción no era un oficio (Linda era «cajera de banco y feminista»).',
        'Tercera pasada (27 nov): sin ecuaciones en la oración ni palabras de doble sentido. «Grupo» va como grupo de personas del experimento (párrafo 1) y como conjunto (párrafo 3), en párrafos distintos y con el mismo sentido de base.',
      ],
    },
  };
})());
