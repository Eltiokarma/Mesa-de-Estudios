/*
 * Apertura de «Ordenamiento de información» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * Escrita desde cero (27 nov). El choque es de un juego que todo escolar conoce: en piedra, papel o tijera, la costumbre
 * de ordenar en cadena («si A le gana a B y B a C, A le gana a C») predice una fila, y el juego da una ronda. Lo que el
 * alumno se lleva va en ficha.seLleva: solo se ordena en fila con relaciones que pasan de uno a otro, como «más alto que».
 * La unidad vecina (Razonamiento deductivo) abre con un experimento con personas; esta, con un juego.
 * No adelanta ninguna Predice: ni la de la banca («Ciro está entre Ana y Beto»), ni la de los pisos (cuántos pisos hay
 * entre dos), ni la de «no es más alto» (el empate), ni la de las sumas, ni la de la derecha en la mesa ni la de «frente a».
 * Colores de la unidad (cabecera de contenido/teoria/razonamiento-matematico/ordenamiento-de-informacion.js): todo en
 * tinta, que es lo que amarra; la única flecha de color es la de piedra y papel, en turquesa (c-i, «hacia dónde se mide»
 * en la unidad), para que se vea que cambia de sentido. Sin verde, carmín ni violeta.
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const gana = t => ({ v: 'c-i', t });
  const r1 = n => Math.round(n * 10) / 10;

  // Punta de flecha en (x, y), apuntando en el ángulo g.
  const punta = (x, y, g, c) => {
    const p = 15, a = 0.45;
    return `<path d="M${r1(x)} ${r1(y)}L${r1(x - p * Math.cos(g - a))} ${r1(y - p * Math.sin(g - a))}L${r1(x - p * Math.cos(g + a))} ${r1(y - p * Math.sin(g + a))}Z" style="fill:${c}"/>`;
  };
  // Flecha curva de (x1, y1) a (x2, y2) con control (qx, qy); la punta sigue la tangente final.
  const flecha = (x1, y1, qx, qy, x2, y2, c = 'currentColor', w = 4) => {
    const g = Math.atan2(y2 - qy, x2 - qx), bx = x2 - 10 * Math.cos(g), by = y2 - 10 * Math.sin(g);
    const col = c === 'currentColor' ? 'currentColor' : `var(${c})`;
    return `<path d="M${r1(x1)} ${r1(y1)}Q${r1(qx)} ${r1(qy)} ${r1(bx)} ${r1(by)}" fill="none" style="stroke:${col}" stroke-width="${w}" stroke-linecap="round"/>${punta(x2, y2, g, col)}`;
  };

  // Las tres manos del juego, dibujadas como sus objetos y del mismo tamaño en los dos paneles.
  const piedra = (x, y) => `<path d="M${x - 31} ${y + 9}L${x - 24} ${y - 13}L${x - 5} ${y - 25}L${x + 19} ${y - 20}L${x + 31} ${y}L${x + 24} ${y + 21}L${x - 6} ${y + 25}Z" style="fill:var(--card)" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
      <path d="M${x - 24} ${y - 13}L${x - 6} ${y - 2}L${x + 19} ${y - 20}M${x - 6} ${y - 2}L${x - 6} ${y + 25}M${x - 6} ${y - 2}L${x + 31} ${y}" fill="none" style="stroke:var(--muted)" stroke-width="2" stroke-linejoin="round"/>`;
  const papel = (x, y) => `<path d="M${x - 22} ${y - 28}h32l12 12v44h-44Z" style="fill:var(--card)" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
      <path d="M${x + 10} ${y - 28}v12h12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M${x - 14} ${y - 6}h26M${x - 14} ${y + 4}h26M${x - 14} ${y + 14}h18" fill="none" style="stroke:var(--muted)" stroke-width="2.5" stroke-linecap="round"/>`;
  const tijera = (x, y) => `<path d="M${x - 9} ${y + 8}L${x + 14} ${y - 28}M${x + 9} ${y + 8}L${x - 14} ${y - 28}" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
      <circle cx="${x - 12}" cy="${y + 18}" r="9" style="fill:var(--card)" stroke="currentColor" stroke-width="3.5"/>
      <circle cx="${x + 12}" cy="${y + 18}" r="9" style="fill:var(--card)" stroke="currentColor" stroke-width="3.5"/>
      <circle cx="${x}" cy="${y - 4}" r="2.5" fill="currentColor"/>`;
  const nombre = (x, y, t) => `<text x="${x}" y="${y}" text-anchor="middle" font-size="17" font-weight="700" style="fill:var(--muted)">${t}</text>`;
  const pie = (cx, l) => l.map((x, i) => `<text x="${cx}" y="${352 + i * 25}" text-anchor="middle" font-size="21" style="fill:var(--muted)">${x}</text>`).join('');
  const leyenda = cx => `${flecha(cx - 78, 60, cx - 62, 60, cx - 46, 60, 'currentColor', 3)}
      <text x="${cx - 38}" y="66" font-size="17" style="fill:var(--muted)">le gana a</text>`;

  // Lo que predice: la cadena pone a las tres en fila y le da a la piedra la victoria sobre el papel.
  const predice = x0 => {
    const cx = x0 + 130, x = cx - 34, yP = 104, yT = 192, yA = 280;
    return `<text x="${cx}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">Lo que predice</text>
      ${leyenda(cx)}
      ${piedra(x, yP)}${tijera(x, yT)}${papel(x, yA)}
      ${flecha(x, yP + 30, x, yP + 46, x, yT - 34)}${flecha(x, yT + 32, x, yT + 44, x, yA - 34)}
      ${flecha(x + 40, yP + 4, x + 112, (yP + yA) / 2, x + 40, yA - 4, '--c-i', 4.5)}
      ${nombre(x - 58, yP + 6, 'piedra')}${nombre(x - 58, yT + 6, 'tijera')}${nombre(x - 58, yA + 6, 'papel')}
      ${pie(cx, ['En fila: la piedra', 'le gana al papel'])}`;
  };
  // Lo que se mide: el papel envuelve a la piedra, y las tres quedan en ronda.
  const mide = x0 => {
    const cx = x0 + 130, P = [cx, 134], T = [cx + 74, 266], A = [cx - 74, 266];
    return `<text x="${cx}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">Lo que se mide</text>
      ${leyenda(cx)}
      ${piedra(P[0], P[1])}${tijera(T[0], T[1])}${papel(A[0], A[1])}
      ${flecha(P[0] + 30, P[1] + 22, P[0] + 70, P[1] + 50, T[0] + 6, T[1] - 40)}
      ${flecha(T[0] - 30, T[1] + 10, cx, T[1] + 30, A[0] + 32, A[1] + 10)}
      ${flecha(A[0] - 6, A[1] - 40, P[0] - 70, P[1] + 50, P[0] - 34, P[1] + 20, '--c-i', 4.5)}
      ${nombre(P[0], P[1] - 34, 'piedra')}${nombre(T[0], T[1] + 48, 'tijera')}${nombre(A[0], A[1] + 48, 'papel')}
      ${pie(cx, ['En ronda: el papel', 'le gana a la piedra'])}`;
  };
  const svg = `<svg viewBox="0 0 520 392" width="520" height="392" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="382" style="stroke:var(--line)" stroke-width="2"/>
    ${predice(0)}${mide(260)}
  </svg>`;

  return {
    unidad: 'razonamiento-matematico.ordenamiento-de-informacion',
    titulo: '¿Por qué no se puede poner en fila a la piedra, el papel y la tijera?',
    parrafos: [
      ['Piedra, papel o tijera es el juego con el que muchos escolares deciden quién saca primero en un partido. ',
        'En él, la piedra le gana a la tijera porque la rompe, y la tijera le gana al papel porque lo corta. ',
        'Cualquiera que haya jugado sabe lo que pasa con la tercera pareja: ', gana('el papel le gana a la piedra'), ', porque la envuelve, ',
        'y ninguna de las tres manos les gana a las otras dos.'],
      ['Cuando ordenas cosas, piensas en cadena: si Rocío es más alta que Sara y Sara es más alta que Tania, Rocío es más alta que Tania, aunque nunca las hayas visto juntas. ',
        'Con esa costumbre, la piedra le ganaría a la tijera, la tijera al papel y, por la cadena, ', gana('la piedra al papel'), ', así que las tres quedarían en fila, de la más fuerte a la más débil. ',
        'Probar otro orden tampoco salva la fila, porque en cualquier fila en que cada mano le gane a la siguiente, la última le gana a la primera.'],
      ['La cadena funciona con estaturas porque «más alta que» pasa de una persona a otra, y con piedra, papel o tijera no funciona porque «le gana a» no pasa: lo que se forma no es una fila, sino una ronda. ',
        'Los problemas de ordenamiento de información dan pistas como «llegó antes que», «vive más arriba que» o «se sienta a la derecha de», y esta unidad trata de cómo armar con ellas la fila, el edificio o la mesa.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos dibujos con la piedra, la tijera y el papel unidos por flechas que van de quien gana a quien pierde. Lo que predice la cadena: los tres en fila, con una flecha de la piedra al papel. Lo que se mide: los tres en ronda, y la flecha va del papel a la piedra.',
    },
    pregunta: 'En una carrera, si Rocío llega antes que Sara y Sara antes que Tania, Rocío llega antes que Tania. ¿Qué tiene «llegar antes que» que no tiene «le gana a» en piedra, papel o tijera?',
    ficha: {
      seLleva: 'Solo se puede poner en fila lo que se compara con una relación que pasa de uno a otro, como «más alto que» o «llegó antes que»; en piedra, papel o tijera, «le gana a» no pasa y por eso las tres manos forman una ronda.',
      alcance: 'Parcial (deducción propia con el marco de Matemática PISA 2022: razonamiento matemático, relaciones y representaciones; el ordenamiento con pistas no es contenido PISA).',
      choque: 'La cadena predice que la piedra le gana al papel y las tres quedan en fila; en el juego, el papel le gana a la piedra y quedan en ronda.',
      atajo: 'Probar otro orden de las tres, que es lo primero que intentaría un alumno atento: en cualquier fila, la última le gana a la primera, así que ningún orden sirve. No se nombra la palabra «transitiva»; el texto dice «pasa de una persona a otra».',
      porVerificar: [
        'Que en el Perú los escolares usen piedra, papel o tijera (también llamado «yan ken po») para decidir quién saca o quién empieza: de memoria, por la experiencia común; no hay dato medido.',
        'Las reglas del juego (la piedra rompe la tijera, la tijera corta el papel, el papel envuelve la piedra) son las de siempre; no hacen falta fuentes, pero conviene que Gerson confirme que el nombre que usa el alumno es «piedra, papel o tijera».',
      ],
      notas: [
        'En RM el «dato medido» es un hecho que cualquiera comprueba jugando. «Lo que se mide» es lo que pasa en el juego.',
        'Las personas del párrafo 2 (Rocío, Sara y Tania) no son las de la unidad (Ana, Beto, Ciro, Dina, Eva, Fito) para no rozar las Predice ni las misiones, que usan esos nombres.',
        'La pregunta compara dos relaciones (llegar antes y ganar en el juego), como pide el skill, y se puede responder con el párrafo 3: llegar antes pasa de una a otra y ganar en el juego no. Abre la unidad, que usa relaciones que sí pasan.',
        'Para Gerson: la ronda del juego roza el ordenamiento circular (ideas 5 y 6), pero no dice nada de derechas ni de sillas frente a frente.',
        'Revisión del Escribidor Escribano (27 nov, otro agente): la primera oración ponía 20 palabras de marco antes del verbo («En piedra, papel o tijera, el juego con el que…, la piedra le gana»); ahora presenta el juego y después da las reglas. El párrafo 2 hablaba en primera del plural («ordenamos», «pensamos», «hayamos medido»); ahora va de tú, como el resto de la app. Contenido, para Gerson: el párrafo 3 dice que las tres manos forman «una ronda» y no una fila, y la misma unidad enseña después a ordenar gente en una mesa redonda. No se contradicen (en la mesa, la relación es «a la derecha de», no «le gana a»), pero un alumno podría creer que lo que está en ronda no se puede ordenar; si pasa en el lector en frío, la idea 5 puede recordarlo en su Lee.',
        'La pregunta se responde con el párrafo 3, que ya dice que «más alta que» pasa de una persona a otra. Es fácil a propósito, como la del pan en la pizza; no se cambió.',
      ],
    },
  };
})());
