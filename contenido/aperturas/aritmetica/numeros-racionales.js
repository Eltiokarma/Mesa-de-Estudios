/*
 * Apertura de «Números racionales» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * El choque es una cuenta de S/ 10 entre tres amigos: la calculadora da 3,3333333, con S/ 3,33 cada uno falta un
 * céntimo y con S/ 3,34 sobran dos, aunque S/ 10 entre cuatro o entre cinco salga justo. La explicación trampa (la
 * calculadora corta los treses por falta de espacio) se descarta: con más cifras seguirían saliendo treses. Lo que el
 * alumno se lleva va en ficha.seLleva. No adelanta la Predice de la idea 4 (cuál de cuatro fracciones da un decimal
 * exacto: 7/40) ni la de la idea 5 (0,2727… = 3/11): no dice qué denominadores dan decimal exacto. Colores de la
 * unidad: la parte de cada uno en naranja (c-o), las partes en que se reparte en turquesa (c-i) y el céntimo que no
 * cuadra (el resto) en carmín (c-h).
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const parte = t => ({ v: 'c-o', t }), partes = t => ({ v: 'c-i', t }), resto = t => ({ v: 'c-h', t });

  // El billete de S/ 10 arriba y, abajo, lo que pone cada uno de los tres amigos.
  const billete = (cx, y) => `<rect x="${cx - 62}" y="${y}" width="124" height="58" rx="6" style="fill:var(--card)" stroke="currentColor" stroke-width="3"/>
      <rect x="${cx - 54}" y="${y + 8}" width="108" height="42" rx="3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 3"/>
      <text x="${cx}" y="${y + 38}" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">S/ 10</text>`;
  const persona = (x, y, monto) => `<circle cx="${x}" cy="${y}" r="13" style="fill:var(--c-i)" fill-opacity=".85"/>
      <path d="M${x - 22} ${y + 44}Q${x - 22} ${y + 18} ${x} ${y + 18}Q${x + 22} ${y + 18} ${x + 22} ${y + 44}Z" style="fill:var(--c-i)" fill-opacity=".85"/>
      <text x="${x}" y="${y + 72}" text-anchor="middle" font-size="17" font-weight="800" style="fill:var(--c-o)">${monto}</text>`;
  const panel = (x0, titulo, monto, cierre, pie) => {
    const cx = x0 + 130;
    return `<text x="${cx}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      ${billete(cx, 52)}
      ${[-1, 0, 1].map(k => `<line x1="${cx}" y1="112" x2="${cx + k * 80}" y2="138" style="stroke:var(--muted)" stroke-width="2"/>`).join('')}
      ${[-1, 0, 1].map(k => persona(cx + k * 80, 158, monto)).join('')}
      ${cierre}
      ${pie.map((l, i) => `<text x="${cx}" y="${330 + i * 24}" text-anchor="middle" font-size="21" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 380" width="520" height="380" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="370" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', 'S/ 3,33…', `<text x="130" y="282" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">juntan S/ 10</text>`,
      ['Con decimales,', 'el reparto sale justo'])}
    ${panel(260, 'Lo que se mide', 'S/ 3,33', `<text x="368" y="282" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">juntan S/ 9,99</text>
      <circle cx="476" cy="274" r="15" fill="none" style="stroke:var(--c-h)" stroke-width="3" stroke-dasharray="4 3"/>
      <text x="476" y="306" text-anchor="middle" font-size="16" font-weight="800" style="fill:var(--c-h)">1 cént.</text>`,
      ['Falta un céntimo', 'que nadie pone'])}
  </svg>`;

  return {
    unidad: 'aritmetica.numeros-racionales',
    titulo: '¿Por qué una cuenta de S/\u00a010 entre tres amigos nunca sale justa en céntimos?', // espacio duro: «S/» no queda solo al final del renglón
    parrafos: [
      ['Tres amigos comparten una cuenta de S/ 10, y la calculadora del celular dice que a cada uno le toca ', parte('3,3333333'),
        ', con treses hasta que se acaba la pantalla. ',
        'Si cada uno paga S/ 3,33, juntan S/ 9,99 y ', resto('falta un céntimo'), '; si cada uno pone S/ 3,34, juntan S/ 10,02 y sobran dos.'],
      ['Con la coma decimal, cualquier reparto parecería salir justo, como S/ 10 entre ', partes('cuatro'), ', que da S/ 2,50 a cada uno, o entre ',
        partes('cinco'), ', que da S/ 2. ',
        'Podrías culpar a la calculadora por cortar los treses cuando se le acaba el espacio, pero una calculadora con mil cifras seguiría mostrando treses hasta el final de la pantalla.'],
      ['Un tercio de S/ 10 es una cantidad exacta, que se escribe 10/3, aunque su decimal no termine nunca, y por eso ningún número entero de céntimos da justo esa cantidad. ',
        'Las fracciones y sus decimales, los que terminan y los que se repiten sin fin, son el tema de los números racionales.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos dibujos iguales: un billete de S/ 10 que se reparte entre tres amigos. Lo que predice la coma decimal: cada uno pone S/ 3,33… y juntan S/ 10 justos. Lo que se mide al pagar en céntimos: cada uno pone S/ 3,33, juntan S/ 9,99 y falta un céntimo.',
    },
    pregunta: 'Si la cuenta de S/ 10 fuera entre ocho amigos, ¿crees que el reparto saldría justo en céntimos, o sobraría o faltaría algo, como entre tres?',
    ficha: {
      seLleva: 'Hay repartos exactos como fracción, como 10/3, cuyo decimal nunca termina; por eso, al dividir S/ 10 entre tres, siempre sobra o falta un céntimo.',
      alcance: 'Sí, deducción propia (cantidad: fracciones, decimales y redondeo con dinero).',
      choque: 'La coma decimal hace esperar que S/ 10 entre tres salga justo, como entre cuatro o entre cinco, y en céntimos siempre falta o sobra uno.',
      atajo: 'Redondear (dos pagan S/ 3,33 y uno S/ 3,34), que arregla el pago pero no explica por qué entre cuatro no hace falta. La explicación trampa es culpar a la pantalla de la calculadora; se descarta porque con más cifras saldrían más treses.',
      porVerificar: [
        'Que la calculadora de un celular común muestre 3,3333333 (8 cifras) para 10 ÷ 3; depende del modelo y de la app, y algunas muestran más treses.',
      ],
      notas: [
        'Revisión del Escribidor Escribano (27 nov): «Uno podría culpar» pasó a de tú («Podrías culpar») y «ningún número de céntimos la alcanza», que deja dudar si alcanzar es llegar o pasarse, ahora dice «ningún número entero de céntimos da justo esa cantidad».',
        'La pregunta (S/ 10 entre 8 = S/ 1,25, exacto) entra a la idea 4 sin decir qué denominadores dan decimal exacto. No usa 40 ni 11 (Predice de las ideas 4 y 5).',
        'El párrafo 3 dice que 10/3 es exacto como fracción: es el punto de llegada del tema (racional = fracción), no una regla de la unidad.',
      ],
    },
  };
})());
