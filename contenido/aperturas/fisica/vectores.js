/*
 * Apertura de «Vectores» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md). Sale de la fila de
 * vectores de la tabla del atajo: 300 m al este y 400 m al norte no sirve (Pitágoras lo resuelve sin vectores), y el
 * choque se mueve a dos fuerzas iguales con 120° entre ellas. Se cuida no adelantar la Predice de la idea 1 (dos drones
 * que vuelan 300 m: «depende de hacia dónde»): la apertura no dice qué le falta al número, solo que las cuentas fallan.
 * Colores de la unidad (cabecera de contenido/teoria/fisica/vectores.js): la primera fuerza en naranja (c-o), la
 * segunda en turquesa (c-i), los ángulos en carmín (c-h) y la resultante en violeta (c-f).
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const A = t => ({ v: 'c-o', t }), B = t => ({ v: 'c-i', t }), th = t => ({ v: 'c-h', t }), R = t => ({ v: 'c-f', t });
  const r1 = n => Math.round(n * 10) / 10;
  // Flecha de (x1, y1) a (x2, y2) con su punta, en el color de su variable.
  const flecha = (x1, y1, x2, y2, c, w = 5) => {
    const g = Math.atan2(y2 - y1, x2 - x1), p = 16, a = 0.45;
    const bx = x2 - p * Math.cos(g), by = y2 - p * Math.sin(g);
    const q1 = [x2 - p * Math.cos(g - a) * 1.15, y2 - p * Math.sin(g - a) * 1.15], q2 = [x2 - p * Math.cos(g + a) * 1.15, y2 - p * Math.sin(g + a) * 1.15];
    return `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(bx)}" y2="${r1(by)}" style="stroke:var(${c})" stroke-width="${w}" stroke-linecap="round"/>
      <path d="M${r1(x2)} ${r1(y2)}L${r1(q1[0])} ${r1(q1[1])}L${r1(q2[0])} ${r1(q2[1])}Z" style="fill:var(${c})"/>`;
  };
  // Misma escala en los dos paneles: 10 N = 100 unidades. Las cuerdas van a 60° de la vertical, con 120° entre ellas.
  const K = 10, OY = 268;
  const panel = (x0, titulo, newtons, pie) => {
    const cx = x0 + 130, s = Math.sin(Math.PI / 3) * 10 * K, c = Math.cos(Math.PI / 3) * 10 * K;
    const arco = `<path d="M${r1(cx - Math.sin(Math.PI / 3) * 30)} ${r1(OY - 15)}A30 30 0 0 1 ${r1(cx + Math.sin(Math.PI / 3) * 30)} ${r1(OY - 15)}" fill="none" style="stroke:var(--c-h)" stroke-width="3"/>`;
    return `<text x="${cx}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      ${arco}
      <text x="${cx - 10}" y="${OY - 46}" text-anchor="end" font-size="22" font-weight="800" style="fill:var(--c-h)">120°</text>
      ${flecha(cx, OY, cx - s, OY - c, '--c-o')}${flecha(cx, OY, cx + s, OY - c, '--c-i')}
      <text x="${r1(cx - s - 6)}" y="${r1(OY - c + 34)}" text-anchor="middle" font-size="22" font-weight="700" style="fill:var(--c-o)">10 N</text>
      <text x="${r1(cx + s + 6)}" y="${r1(OY - c + 34)}" text-anchor="middle" font-size="22" font-weight="700" style="fill:var(--c-i)">10 N</text>
      ${flecha(cx, OY, cx, OY - newtons * K, '--c-f', 6)}
      <text x="${cx + 14}" y="${r1(OY - newtons * K + 18)}" font-size="24" font-weight="800" style="fill:var(--c-f)">${newtons} N</text>
      <circle cx="${cx}" cy="${OY}" r="9" style="fill:var(--card)" stroke="currentColor" stroke-width="3"/>
      ${pie.map((l, i) => `<text x="${cx}" y="${312 + i * 26}" text-anchor="middle" font-size="22" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 362" width="520" height="362" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="352" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', 20, ['El doble', 'de una cuerda'])}
    ${panel(260, 'Lo que se mide', 10, ['Lo mismo que', 'una cuerda'])}
  </svg>`;

  return {
    unidad: 'fisica.vectores',
    titulo: '¿Por qué dos cuerdas que jalan con 10 N no suman 20 N?',
    parrafos: [
      ['Cuando dos personas arrastran un ropero con dos cuerdas, cada una se pone a un lado para no estorbar a la otra, y las cuerdas forman un ángulo. ',
        'En el laboratorio del colegio, esa situación se puede medir con dinamómetros, que son resortes con una escala en newtons. ',
        'Dos estudiantes jalan una argolla con 10\u00a0N cada uno, con ', th('120°'), ' entre sus cuerdas; para que la argolla no se mueva, un tercer dinamómetro tiene que sostenerla, y ese dinamómetro marca ',
        R('10 N'), '.'],
      ['Si las fuerzas se sumaran como números, el tercer dinamómetro tendría que marcar el doble de lo que jala cada cuerda. ',
        'Quien note que las cuerdas no van en la misma línea probaría con el teorema de Pitágoras, pero ese teorema solo vale cuando el ángulo es recto, y estas cuerdas forman uno de ',
        th('120°'), '.'],
      ['El tercer dinamómetro marca ', R('10 N'), ', lo mismo que una sola cuerda, y ninguna de las dos cuentas llega a ese número. ',
        'Una medición bien hecha no se descarta, así que lo que hay que cambiar es la manera de sumar: para fuerzas como estas, los físicos usan vectores, que son el tema de esta unidad.'],
    ],
    ecuacion: [
      ['Como números: ', A('10 N'), ' + ', B('10 N'), ' = ', R('20 N')],
      ['Con Pitágoras: ', { raiz: [{ sup: [A('10'), '2'] }, ' + ', { sup: [B('10'), '2'] }] }, ' ≈ ', R('14,1 N')],
    ],
    figura: {
      antes: 2,
      svg,
      pie: 'La flecha violeta es el jalón de las dos cuerdas juntas sobre la argolla.',
      alt: 'Dos dibujos con la misma escala: una argolla jalada por dos cuerdas de 10 N con 120° entre ellas. Lo que predice la suma de números: un jalón total de 20 N, el doble de una cuerda. Lo que se mide: un jalón total de 10 N, lo mismo que una cuerda.',
    },
    pregunta: 'Si los dos estudiantes van cerrando el ángulo entre sus cuerdas hasta jalar juntos hacia el mismo lado, ¿qué le pasa a la marca del tercer dinamómetro?',
    ficha: {
      alcance: 'Parcial (núcleo: qué cambia, respecto de qué y en qué intervalo).',
      choque: 'Dos fuerzas de 10 N con 120° entre ellas dan 10 N, no 20 N.',
      atajo: 'El teorema de Pitágoras da unos 14,1 N, pero exige un ángulo recto; el primer choque de la tabla (300 m y 400 m dan 500 m) lo resuelve Pitágoras sin vectores y se descartó.',
      porVerificar: [
        'Los 10 N del tercer dinamómetro salen de la suma de vectores (2 × 10 N × cos 60° = 10 N), no de una medición propia: el texto los presenta como lo que marcaría el aparato. Falta medirlo con la mesa de fuerzas o con tres dinamómetros, o citar una práctica de laboratorio publicada.',
        'El ropero es un contexto inventado: que dos personas que lo arrastran se pongan cada una a un lado es plausible, pero no sale de una fuente.',
        'Que los colegios del piloto tengan dinamómetros en su laboratorio.',
      ],
      notas: [
        'Revisión del 27 nov: se quitó «Las dos cuentas tratan cada fuerza como un número suelto, y la medición dice otra cosa», porque explicaba el choque (la entrada no explica) y le adelantaba a la Predice de la idea 1 que el número solo no basta («Depende de hacia dónde vuela cada uno»). El choque sigue mostrando que el ángulo importa, y eso no se puede evitar sin perderlo; lo que ya no dice es qué le falta al número.',
      ],
    },
  };
})());
