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

  // Los mismos dos mensajes en los dos paneles (doble revisión, 27 nov). A la izquierda, lo que se entiende al leerlos,
  // que es la intuición correcta: uno quita las ganas y el otro las da. A la derecha, por qué: cada mensaje con su balanza,
  // inclinada hacia lo que va después del «pero».
  const efecto = (cx, y, t) => `<text x="${cx}" y="${y}" text-anchor="middle" font-size="19" font-weight="800" fill="currentColor">${t}</text>`;
  const svg = `<svg viewBox="0 0 520 400" width="520" height="400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="390" style="stroke:var(--line)" stroke-width="2"/>
    <text x="130" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">Lo que se entiende</text>
    ${globo(130, 50, 'rica', 'cara')}
    ${efecto(130, 150, 'Mejor no vamos')}
    ${globo(130, 196, 'cara', 'rica')}
    ${efecto(130, 296, 'Vale la pena ir')}
    ${pie(130, ['Cada mensaje', 'recomienda otra cosa'])}
    <text x="390" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">Lo que dice</text>
    ${globo(390, 50, 'rica', 'cara')}
    ${balanza(390, 132, 14, 0.8)}
    ${globo(390, 196, 'cara', 'rica')}
    ${balanza(390, 278, -14, 0.8)}
    ${pie(390, ['Pesa lo que va', 'después del «pero»'])}
  </svg>`;

  return {
    unidad: 'razonamiento-verbal.conectores',
    titulo: '¿Por qué «es rica, pero cara» y «es cara, pero rica» no recomiendan lo mismo?',
    parrafos: [
      ['En el grupo de WhatsApp del salón, alguien pregunta adónde ir a comer después del desfile, y dos compañeros responden sobre la misma cevichería del barrio. ',
        'Uno escribe «Es ', rica('rica'), ', pero ', cara('cara'), '» y el otro, «Es ', cara('cara'), ', pero ', rica('rica'), '». ',
        'Seguro que al leerlos ya sentiste la diferencia: el primero te quita las ganas de ir a la cevichería y el segundo te las da.'],
      ['Los dos mensajes, sin embargo, traen los mismos datos, porque en los dos la comida es rica y el precio es alto. ',
        'Tampoco los distingue el tono, porque un mensaje escrito no lleva la voz de quien lo manda, y estos dos no tienen ni un emoji. ',
        'Lo único que cambia es el orden de las dos palabras alrededor del «pero».'],
      ['El «pero» no se limita a juntar los datos, porque hace pesar más el que viene después, y por eso cada mensaje recomienda otra cosa. ',
        'Lo que sentiste sirve también al escribir: si quieres animar a alguien, dejas lo bueno para después del «pero», y si quieres advertirle, lo malo. ',
        'Las palabras que dicen cómo se une una idea con otra se llaman conectores, y de ellas trata esta unidad.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos dibujos con los mismos dos mensajes: «Es rica, pero cara» y «Es cara, pero rica». Lo que se entiende: el primero dice mejor no vamos y el segundo, vale la pena ir. Lo que dice cada mensaje: la balanza del primero se inclina hacia el precio y la del segundo hacia el sabor, hacia lo que va después del pero.',
    },
    pregunta: 'Si un tercer compañero escribiera «Es rica y cara», ¿su mensaje te ayudaría a decidir si vas o no a la cevichería?',
    ficha: {
      seLleva: 'Un conector no solo une dos ideas, también dice cuál pesa más: por eso «rica, pero cara» y «cara, pero rica» traen los mismos datos y no recomiendan lo mismo.',
      alcance: 'Sí (marco de lectura de PISA 2025, deducción propia: integrar y relacionar las partes de un texto; el conector como pista de la relación entre ideas).',
      choque: 'Sin choque fabricado (apertura-pisa.md, punto 7): el alumno ya siente que el primer mensaje desanima y el segundo anima; lo que se le muestra es que los datos son los mismos y que la diferencia la hace el «pero», que pone el peso en lo que va después.',
      atajo: 'La explicación trampa del tono, que no existe en un mensaje escrito sin emojis. Leer el «pero» como una «y» ya no se le atribuye al alumno en el texto: aparece solo en la pregunta, como el mensaje de un tercero.',
      porVerificar: [
        'Que «pero» oriente la conclusión hacia el segundo miembro (lo que va después pesa más): es la orientación argumentativa de Anscombre y Ducrot y la recogen las gramáticas del español; falta la cita con página (por ejemplo, la Nueva gramática de la RAE, capítulo de la coordinación adversativa).',
        'Que casi cualquiera sienta que el primer mensaje desanima y el segundo anima: es lo esperado por lo anterior, no una encuesta propia; el texto lo dice como «seguro que ya sentiste», que el alumno comprueba al leer.',
      ],
      notas: [
        'Revisión del Escribidor Escribano (27 nov): en el párrafo 1, «pregúntale después de cuál de los dos» se podía leer como «después de cuál mensaje»; ahora dice «pregúntale con cuál de los dos». El párrafo 3 abría con una oración de 39 palabras que juntaba el resultado y la causa con el molde «no solo une dos ideas: hace…»; ahora son dos oraciones, el resultado y lo que hace el «pero» en estos dos mensajes, dicho del caso y no como regla general de los conectores (la regla de la idea 1 es nombrar la relación antes de elegir el conector, y eso no se adelanta).',
        'El párrafo 1 propone la prueba (leer los mensajes a alguien de la casa) en lugar de afirmar un resultado que no se midió; el párrafo 3 da el resultado como lo que dejan los mensajes, que es lo que se puede comprobar leyéndolos.',
        'El párrafo 3 dice qué hace el «pero» (hace pesar más lo que viene después): es lo que el alumno se lleva y adelanta el sentido de la idea 1 (la relación decide el conector), sin la frase de su misión ni el caso de Mateo.',
        'La pregunta se puede intentar con el texto: con «y» los dos datos pesan igual y el mensaje no recomienda nada. La clase la retoma para presentar las clases de conectores (suma frente a contraste).',
        'Doble revisión (27 nov), reescrita: el párrafo 2 decía que, si se cuentan los datos, los dos mensajes «valen lo mismo, como una suma», y que el «pero» uniría igual que una «y». Nadie lee así un mensaje de WhatsApp: cualquier alumno siente la diferencia a la primera, así que el choque era forzado. La idea es intuitiva y útil, y ahora la apertura la usa como intuición correcta (punto 7): el párrafo 1 dice lo que el alumno ya sintió, el párrafo 2 muestra que los datos y el tono no cambian, y el párrafo 3 dice qué hace el «pero» y dónde sirve al escribir (dejar lo bueno o lo malo para después del «pero»). La figura cambió a la izquierda: en vez de una balanza pareja (la lectura que nadie hace), cada mensaje con lo que se entiende («Mejor no vamos», «Vale la pena ir»); la derecha, con las balanzas inclinadas, sigue igual. No toca la Predice de la idea 1 (Mateo y el «sin embargo»).',
        'Tercera pasada (27 nov): sin ecuaciones en la oración ni palabras de doble sentido. «Rica» es siempre sabrosa y «cara», costosa (nunca rostro ni adinerada); el contexto de la cevichería no deja otra lectura.',
      ],
    },
  };
})());
