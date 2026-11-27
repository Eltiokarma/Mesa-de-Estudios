/*
 * Apertura de «Conectores lógico-textuales» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * En verbal el choque es entre lo que se entiende de un texto y lo que dice: «Es rica, pero cara» y «Es cara, pero rica»
 * traen los mismos dos datos y no recomiendan lo mismo, porque después del «pero» va lo que pesa más. El dato es el texto
 * mismo, y el alumno lo puede probar leyéndole los dos mensajes a alguien de su casa. Lo que el alumno se lleva va en
 * ficha.seLleva. La apertura vecina (sentido contextual) abre con un parte médico de las noticias; esta, con dos
 * mensajes de un grupo de WhatsApp. No adelanta la Predice de la idea 1 (Mateo y el baile) ni la de la idea 2 (el
 * colegio sin luz). Colores: el sabor («rica») en turquesa (c-i) y el precio («cara») en naranja (c-o).
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const rica = t => ({ v: 'c-i', t }), cara = t => ({ v: 'c-o', t });
  const r1 = n => Math.round(n * 10) / 10;
  const P = { rica: '--c-i', cara: '--c-o' };

  // Un mensaje del grupo, con las dos palabras en su color.
  const globo = (cx, y, a, b) => `<path d="M${cx - 108} ${y}h216a10 10 0 0 1 10 10v26a10 10 0 0 1 -10 10h-196l-14 10v-10a16 16 0 0 1 -16 -16v-20a10 10 0 0 1 10 -10z" style="fill:var(--card)" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>
      <text x="${cx + 4}" y="${y + 30}" text-anchor="middle" font-size="20" font-weight="700" fill="currentColor">«Es <tspan style="fill:var(${P[a]})">${a}</tspan>, pero <tspan style="fill:var(${P[b]})">${b}</tspan>»</text>`;
  // Una balanza con «rica» a la izquierda y «cara» a la derecha. g > 0 inclina hacia la derecha (pesa el precio).
  const balanza = (cx, y, g, s = 1) => {
    const L = 62 * s, a = g * Math.PI / 180, dx = L * Math.cos(a), dy = L * Math.sin(a);
    const plato = (x, yy, w, c) => `<line x1="${r1(x)}" y1="${r1(yy)}" x2="${r1(x)}" y2="${r1(yy + 14 * s)}" stroke="currentColor" stroke-width="2"/>
        <path d="M${r1(x - 24 * s)} ${r1(yy + 14 * s)}h${r1(48 * s)}a${r1(24 * s)} ${r1(10 * s)} 0 0 1 ${r1(-48 * s)} 0z" style="fill:var(${P[w]})" fill-opacity=".25"/>
        <path d="M${r1(x - 24 * s)} ${r1(yy + 14 * s)}h${r1(48 * s)}" style="stroke:var(${P[w]})" stroke-width="3" stroke-linecap="round"/>
        <text x="${r1(x)}" y="${r1(yy + 40 * s)}" text-anchor="middle" font-size="${r1(18 * s)}" font-weight="800" style="fill:var(${P[w]})">${w}</text>`;
    return `<path d="M${cx} ${y}L${r1(cx - 14 * s)} ${r1(y + 46 * s)}h${r1(28 * s)}Z" style="fill:var(--muted)"/>
      <line x1="${r1(cx - dx)}" y1="${r1(y - dy)}" x2="${r1(cx + dx)}" y2="${r1(y + dy)}" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
      <circle cx="${cx}" cy="${y}" r="4" fill="currentColor"/>
      ${plato(cx - dx, y - dy, 'rica')}${plato(cx + dx, y + dy, 'cara')}`;
  };
  const pie = (cx, l) => l.map((t, i) => `<text x="${cx}" y="${356 + i * 26}" text-anchor="middle" font-size="22" style="fill:var(--muted)">${t}</text>`).join('');

  // Los mismos dos mensajes en los dos paneles. A la izquierda, una sola balanza pareja para los dos; a la derecha, cada
  // mensaje con su balanza, inclinada hacia lo que va después del «pero».
  const svg = `<svg viewBox="0 0 520 400" width="520" height="400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="390" style="stroke:var(--line)" stroke-width="2"/>
    <text x="130" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">Lo que se entiende</text>
    ${globo(130, 50, 'rica', 'cara')}${globo(130, 112, 'cara', 'rica')}
    ${balanza(130, 222, 0, 1.15)}
    ${pie(130, ['Los dos mensajes', 'dicen lo mismo'])}
    <text x="390" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">Lo que dice</text>
    ${globo(390, 50, 'rica', 'cara')}
    ${balanza(390, 132, 14, 0.8)}
    ${globo(390, 196, 'cara', 'rica')}
    ${balanza(390, 278, -14, 0.8)}
    ${pie(390, ['Pesa lo que va', 'al final'])}
  </svg>`;

  return {
    unidad: 'razonamiento-verbal.conectores',
    titulo: '¿Por qué «es rica, pero cara» y «es cara, pero rica» no recomiendan lo mismo?',
    parrafos: [
      ['En el grupo de WhatsApp del salón, alguien pregunta adónde ir a comer después del desfile, y dos compañeros responden sobre la misma cevichería del barrio. ',
        'Uno escribe «Es ', rica('rica'), ', pero ', cara('cara'), '» y el otro, «Es ', cara('cara'), ', pero ', rica('rica'), '». ',
        'Léele los dos mensajes a alguien de tu casa y pregúntale con cuál de los dos le darían más ganas de ir a la cevichería.'],
      ['Si cuentas lo que dice cada mensaje, los dos traen los mismos datos: la comida es rica y el precio es alto. ',
        'Con esa cuenta, los mensajes valen lo mismo, como una suma en la que el orden de los números no cambia el resultado, y el «pero» uniría dos datos igual que una «y». ',
        'Tampoco es cuestión de tono, porque un mensaje escrito no lleva la voz de quien lo manda, y estos dos no tienen ni un emoji que los distinga.'],
      ['Con los mismos datos, el primer mensaje deja la idea de que no vale la pena ir, y el segundo, la de que sí. ',
        'El «pero» de los dos mensajes no se limita a juntar los datos, porque hace pesar más el que viene después. ',
        'Las palabras que dicen cómo se une una idea con otra se llaman conectores, y de ellas trata esta unidad.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos dibujos con los mismos dos mensajes: «Es rica, pero cara» y «Es cara, pero rica». Lo que se entiende: una sola balanza pareja, porque los dos traen los mismos datos y dirían lo mismo. Lo que dice cada mensaje: la balanza del primero se inclina hacia el precio y la del segundo hacia el sabor, hacia lo que va después del pero.',
    },
    pregunta: 'Si un tercer compañero escribiera «Es rica y cara», ¿su mensaje te ayudaría a decidir si vas o no a la cevichería?',
    ficha: {
      seLleva: 'Un conector no solo une dos ideas, también dice cuál pesa más: por eso «rica, pero cara» y «cara, pero rica» traen los mismos datos y no recomiendan lo mismo.',
      alcance: 'Sí (marco de lectura de PISA 2025, deducción propia: integrar y relacionar las partes de un texto; el conector como pista de la relación entre ideas).',
      choque: 'Los dos mensajes traen los mismos datos y, si solo se suman, dicen lo mismo; el primero desanima y el segundo anima a ir.',
      atajo: 'Leer el «pero» como una «y» que suma datos (el orden no importaría), y la explicación trampa del tono, que no existe en un mensaje escrito sin emojis.',
      porVerificar: [
        'Que «pero» oriente la conclusión hacia el segundo miembro (lo que va después pesa más): es la orientación argumentativa de Anscombre y Ducrot y la recogen las gramáticas del español; falta la cita con página (por ejemplo, la Nueva gramática de la RAE, capítulo de la coordinación adversativa).',
        'Que la persona a la que se le leen los mensajes elija el segundo: es lo esperado por lo anterior, no una encuesta propia.',
      ],
      notas: [
        'Revisión del Escribidor Escribano (27 nov): en el párrafo 1, «pregúntale después de cuál de los dos» se podía leer como «después de cuál mensaje»; ahora dice «pregúntale con cuál de los dos». El párrafo 3 abría con una oración de 39 palabras que juntaba el resultado y la causa con el molde «no solo une dos ideas: hace…»; ahora son dos oraciones, el resultado y lo que hace el «pero» en estos dos mensajes, dicho del caso y no como regla general de los conectores (la regla de la idea 1 es nombrar la relación antes de elegir el conector, y eso no se adelanta).',
        'El párrafo 1 propone la prueba (leer los mensajes a alguien de la casa) en lugar de afirmar un resultado que no se midió; el párrafo 3 da el resultado como lo que dejan los mensajes, que es lo que se puede comprobar leyéndolos.',
        'El párrafo 3 dice qué hace el «pero» (hace pesar más lo que viene después): es lo que el alumno se lleva y adelanta el sentido de la idea 1 (la relación decide el conector), sin la frase de su misión ni el caso de Mateo.',
        'La pregunta se puede intentar con el texto: con «y» los dos datos pesan igual y el mensaje no recomienda nada. La clase la retoma para presentar las clases de conectores (suma frente a contraste).',
      ],
    },
  };
})());
