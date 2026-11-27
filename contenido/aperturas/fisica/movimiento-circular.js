/*
 * Apertura de «Movimiento circular» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * El choque está en los videos del celular: las ruedas de un auto que avanza parecen quietas o girando al revés. El
 * celular graba unas 30 fotos por segundo; un aro de cinco rayos que da 6 vueltas por segundo gira entre foto y foto
 * justo lo que separa dos rayos, y todas las fotos salen iguales. Lo que el alumno se lleva va en ficha.seLleva.
 * No adelanta la Predice de la idea 1 (2π rad), la de la idea 2 (el ventilador a 120 vueltas por minuto tarda 0,5 s:
 * por eso aquí no aparece un ventilador), la de la idea 3 (el piñón da dos vueltas), la de la idea 4 (sí acelera, hacia
 * el centro), la de la idea 5 (18 rad) ni la de la idea 6. Colores de la unidad (cabecera de
 * contenido/teoria/fisica/movimiento-circular.js): el giro en violeta (c-f) y el tiempo en turquesa (c-i).
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const r1 = n => Math.round(n * 10) / 10;
  // Una rueda vista de costado: llanta, aro y cinco rayos que salen del centro, girados `g` grados.
  const rueda = (cx, cy, g) => {
    const rayos = Array.from({ length: 5 }, (_, k) => {
      const a = (g + k * 72 - 90) * Math.PI / 180;
      return `<line x1="${cx}" y1="${cy}" x2="${r1(cx + 20 * Math.cos(a))}" y2="${r1(cy + 20 * Math.sin(a))}" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>`;
    }).join('');
    return `<circle cx="${cx}" cy="${cy}" r="33" style="fill:var(--muted)" stroke="currentColor" stroke-width="3"/>
      <circle cx="${cx}" cy="${cy}" r="22" style="fill:var(--card)" stroke="currentColor" stroke-width="2.5"/>
      ${rayos}<circle cx="${cx}" cy="${cy}" r="5" fill="currentColor"/>`;
  };
  const panel = (x0, titulo, giros, pie) => {
    const xs = [x0 + 48, x0 + 130, x0 + 212], cy = 150;
    return `<text x="${x0 + 130}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      <text x="${x0 + 130}" y="74" text-anchor="middle" font-size="19" font-weight="800" style="fill:var(--c-i)">una foto cada 1/30 s</text>
      ${xs.map((x, i) => `<rect x="${x - 39}" y="${cy - 45}" width="78" height="90" rx="6" fill="none" style="stroke:var(--line)" stroke-width="2.5"/>
      ${rueda(x, cy, giros[i])}
      <text x="${x}" y="${cy + 70}" text-anchor="middle" font-size="18" style="fill:var(--muted)">foto ${i + 1}</text>`).join('')}
      ${giros[2] !== giros[0] ? `<path d="M${x0 + 60} 248Q${x0 + 130} 268 ${x0 + 200} 248" fill="none" style="stroke:var(--c-f)" stroke-width="4" stroke-linecap="round"/>
      <path d="M${x0 + 212} 242l-16 -4l4 14Z" style="fill:var(--c-f)"/>` : ''}
      ${pie.map((l, i) => `<text x="${x0 + 130}" y="${304 + i * 26}" text-anchor="middle" font-size="22" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 342" width="520" height="342" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="332" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', [0, 15, 30], ['La rueda gira', 'hacia adelante'])}
    ${panel(260, 'Lo que se mide', [0, 0, 0], ['La rueda sale', 'igual en cada foto'])}
  </svg>`;

  return {
    unidad: 'fisica.movimiento-circular',
    titulo: '¿Por qué en los videos las ruedas de un auto en marcha a veces parecen quietas?',
    parrafos: [
      'En un video grabado con el celular, a veces las ruedas de un auto que avanza rápido por la pista parecen quietas. ' +
        'El celular graba unas 30 fotos en cada segundo, y el video es esa fila de fotos pasadas una tras otra. ' +
        'La rueda de un auto que va a unos 40 km/h da unas 6 vueltas por segundo, así que un aro de cinco rayos gira entre foto y foto justo la quinta parte de una vuelta.',
      'Si la rueda da 6 vueltas en cada segundo, el video tendría que mostrarla girando muy rápido hacia adelante. ' +
        'Y no se trata de un engaño del ojo, como cuando algo se mueve tan rápido que se ve borroso, porque si detienes el video y pasas las fotos una por una, los rayos salen en el mismo sitio en todas.',
      'Entre una foto y la siguiente, cada rayo avanza justo hasta donde estaba su vecino, y como los cinco rayos son iguales, las fotos salen idénticas. ' +
        'Lo que muestra el video depende de cuánto gira la rueda en cada intervalo, y de eso trata esta unidad: del ángulo que gira algo que da vueltas, de cuánto tarda en dar una vuelta y de qué tan rápido gira.',
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Tres fotos seguidas de la misma rueda de cinco rayos, tomadas cada 1/30 de segundo. Lo que predice la idea de que el video muestra el giro: los rayos aparecen cada vez más girados hacia adelante. Lo que se mide: los rayos salen en la misma posición en las tres fotos, y la rueda parece quieta.',
    },
    pregunta: 'Si el auto va un poco más lento, y entre foto y foto cada rayo no alcanza a llegar al lugar de su vecino, ¿hacia dónde crees que parecerá girar la rueda en el video?',
    ficha: {
      seLleva: 'Un video no muestra el giro entero sino fotos sueltas: si entre foto y foto la rueda gira justo lo que separa dos rayos, en el video parece quieta.',
      alcance: 'Parcial (núcleo: qué cambia y en qué intervalo; un fenómeno periódico observado a intervalos fijos). El radián y la aceleración centrípeta no entran en PISA.',
      choque: 'Una rueda que da 6 vueltas por segundo tendría que verse girando rápido; en el video, a 30 fotos por segundo, sale quieta.',
      atajo: 'La explicación trampa del engaño del ojo (la rueda borrosa) la descarta que el efecto queda en las fotos del video, que se pueden pasar una por una. El mejor alumno podría decir que «la cámara no alcanza»; es cierto, pero no dice por qué la rueda sale quieta y no borrosa, que es la cuenta de cuánto gira en cada intervalo.',
      porVerificar: [
        'Que los celulares graben video a 30 fotos por segundo por omisión (de memoria; muchos también graban a 60, y el efecto aparece a otras rapideces).',
        'La rapidez de 40 km/h sale de la cuenta con una rueda de unos 62 cm de diámetro (unos 1,95 m por vuelta): 6 vueltas por segundo son unos 11,7 m/s, 42 km/h. Depende del tamaño de la llanta.',
        'Que el efecto se vea en videos de autos con aros de cinco rayos (es el efecto estroboscópico; falta grabarlo o citar un video).',
      ],
      notas: [
        'La pregunta se puede intentar con la figura: si cada rayo se queda corto, en la foto siguiente el rayo más cercano al lugar de partida está un poco atrás, y la rueda parece girar hacia atrás. La clase recoge la idea de ángulo girado en cada intervalo (ideas 1 y 2).',
        'En la figura, la rueda de la predicción gira 15° por foto, en el sentido de las agujas del reloj (un ángulo que se ve); la real gira 72°, la quinta parte de una vuelta, y por eso sale igual. Los rayos no se distinguen entre sí, a propósito: si uno tuviera color, se vería que avanza.',
        'Se evitó el ventilador, que es el objeto de la Predice de la idea 2, aunque el efecto también se ve en sus aspas.',
        'Revisión del Escribidor Escribano (27 nov): el párrafo 1 decía que las ruedas «incluso parecen girar hacia atrás», que es la respuesta de la pregunta «Antes de seguir»; se quitó para que la pregunta se piense y no se recuerde. La tercera oración tenía un inciso entre el sujeto y el verbo («Un aro de cinco rayos que da 6 vueltas por segundo, lo que da la rueda de un auto a unos 40 km/h, gira…»); ahora va en orden: la rueda da 6 vueltas, así que el aro gira la quinta parte entre foto y foto. «Tampoco es un engaño del ojo» seguía a una predicción, no a otra explicación descartada: pasó a «Y no se trata de un engaño del ojo». No delata: no toca el ventilador (Predice de la idea 2) ni da radianes.',
      ],
    },
  };
})());
