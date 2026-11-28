/*
 * Apertura de «Dinámica» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * El choque es el de empujar una combi que no arranca: se empuja siempre igual y, sin embargo, quienes empujan empiezan
 * caminando y terminan corriendo detrás de ella. Lo que el alumno se lleva va en ficha.seLleva. No adelanta la Predice
 * de la idea 1 (al frenar, la aceleración apunta hacia la izquierda: aquí la fuerza y el avance van hacia el mismo
 * lado), la de la idea 2 (la caja en la Luna: el texto no compara el empujón con el peso), la de la idea 3 (4 m), la de
 * la idea 4 (12 N), la de la idea 5 (400 N) ni la de la idea 6, ni la misión de la idea 5 (la balanza del ascensor).
 * Colores de la unidad (cabecera de contenido/teoria/fisica/dinamica.js): el empujón en naranja (c-o), el color del
 * jalón; la velocidad, que la unidad no colorea, en verde (c-d), y el tiempo en turquesa (c-i).
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const r1 = n => Math.round(n * 10) / 10;
  const flecha = (x1, y1, x2, y2, c, w = 5) => {
    const g = Math.atan2(y2 - y1, x2 - x1), p = 13, a = 0.45;
    const bx = x2 - p * Math.cos(g), by = y2 - p * Math.sin(g);
    return `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(bx)}" y2="${r1(by)}" style="stroke:var(${c})" stroke-width="${w}" stroke-linecap="round"/>
      <path d="M${r1(x2)} ${r1(y2)}L${r1(x2 - p * 1.15 * Math.cos(g - a))} ${r1(y2 - p * 1.15 * Math.sin(g - a))}L${r1(x2 - p * 1.15 * Math.cos(g + a))} ${r1(y2 - p * 1.15 * Math.sin(g + a))}Z" style="fill:var(${c})"/>`;
  };
  // Una combi chica de costado, con el frente a la derecha, apoyada en y.
  const combi = (x, y) => `<path d="M${x} ${y - 2}V${y - 36}q0 -6 6 -6h58q5 0 8 4l10 14q3 4 3 9v9Z" style="fill:var(--card)" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M${x + 6} ${y - 36}h20v12h-20ZM${x + 31} ${y - 36}h20v12h-20ZM${x + 56} ${y - 36}h11l8 12h-19Z" style="fill:var(--line)" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
      <circle cx="${x + 18}" cy="${y - 4}" r="7" style="fill:var(--card)" stroke="currentColor" stroke-width="2.5"/>
      <circle cx="${x + 68}" cy="${y - 4}" r="7" style="fill:var(--card)" stroke="currentColor" stroke-width="2.5"/>`;
  // Tres momentos del empujón; la velocidad de la combi en km/h. 1 km/h = 6 px de flecha.
  const panel = (x0, titulo, vs, pie) => {
    const filas = [['5 s', 124], ['10 s', 200], ['20 s', 276]];
    return `<text x="${x0 + 130}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      <text x="${x0 + 130}" y="58" text-anchor="middle" font-size="17" style="fill:var(--muted)">el mismo empujón todo el rato</text>
      ${filas.map(([t, y], i) => `<text x="${x0 + 8}" y="${y - 12}" font-size="19" font-weight="800" style="fill:var(--c-i)">${t}</text>
      ${flecha(x0 + 52, y - 20, x0 + 76, y - 20, '--c-o')}
      ${combi(x0 + 80, y)}
      ${flecha(x0 + 176, y - 20, x0 + 176 + vs[i] * 6, y - 20, '--c-d', 4)}
      <text x="${x0 + 176}" y="${y - 32}" font-size="18" font-weight="800" style="fill:var(--c-d)">${vs[i]} km/h</text>
      <line x1="${x0 + 50}" y1="${y + 5}" x2="${x0 + 250}" y2="${y + 5}" style="stroke:var(--line)" stroke-width="2"/>`).join('')}
      ${pie.map((l, i) => `<text x="${x0 + 130}" y="${324 + i * 26}" text-anchor="middle" font-size="22" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 362" width="520" height="362" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="352" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', [5, 5, 5], ['Siempre igual', 'de rápido'])}
    ${panel(260, 'Lo que se mide', [3, 5, 11], ['Cada vez', 'más rápido'])}
  </svg>`;

  return {
    unidad: 'fisica.dinamica',
    titulo: '¿Por qué terminas corriendo detrás de la combi que empujas, si la empujas siempre igual?',
    parrafos: [
      'Cuando una combi se queda sin batería, a veces hay que empujarla entre varios hasta que tome rapidez y el motor arranque. ' +
        'Quienes empujan con la misma fuerza todo el rato empiezan caminando, a los pocos segundos tienen que trotar y al final la combi se les escapa. ' +
        'Si tres personas empujaran parejo una combi de unas 2 t por una pista plana, a los 10 s iría a unos 5 km/h, el paso de quien camina rápido, y a los 20 s, a unos 11 km/h, la rapidez de alguien que trota.',
      'Lo que esperarías es que una fuerza que no cambia dé una rapidez que no cambia, igual que cuando caminas a paso parejo y avanzas siempre igual de rápido. ' +
        'Y no es que la pista esté en bajada y la combi se vaya sola, porque en una pista plana pasa lo mismo, y si dejan de empujar, la combi se va frenando.',
      'Mientras el empujón le gane a la resistencia de las llantas, la combi no se queda con una rapidez fija, sino que gana rapidez en cada segundo hasta que se les escapa a quienes la empujan. ' +
        'Cómo se relacionan la fuerza, la masa y el cambio de la rapidez es el tema de esta unidad, la dinámica.',
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'La misma combi empujada con la misma fuerza, a los 5 s, a los 10 s y a los 20 s. Lo que predice la idea de que una fuerza fija da una rapidez fija: va siempre a 5 km/h. Lo que se mide: va a 3 km/h, a 5 km/h y a 11 km/h, cada vez más rápido.',
    },
    pregunta: 'Si en vez de tres personas empujaran seis, cada una con la misma fuerza, ¿crees que a los 10 s la combi iría más rápido, igual o más lento que con tres?',
    ficha: {
      seLleva: 'Una fuerza que no cesa y le gana al roce no mantiene la rapidez fija sino que la va aumentando, y por eso quienes empujan una combi terminan corriendo detrás de ella.',
      alcance: 'Parcial (núcleo: qué cambia y en qué intervalo; una causa constante produce un cambio que crece con el tiempo). La segunda ley con vectores y diagramas no entra en PISA.',
      choque: 'Un empujón fijo daría una rapidez fija; la combi empujada siempre igual va cada vez más rápido, de unos 3 km/h a los 5 s a unos 11 km/h a los 20 s.',
      atajo: 'La explicación trampa de la bajada la descarta que en una pista plana pasa igual (y que sin empujón la combi frena). El mejor alumno diría que la combi «agarra impulso»: es el nombre del fenómeno, no dice cuánto gana en cada segundo ni de qué depende, que es la segunda ley.',
      porVerificar: [
        'Los números salen de la cuenta, no de una medición: tres personas con unos 200 N cada una (600 N) contra una resistencia de rodadura de unos 300 N (1,5 % del peso de una combi de 2 t) dejan 300 N netos y una aceleración de 0,15 m/s²: 2,7 km/h a los 5 s, 5,4 km/h a los 10 s y 10,8 km/h a los 20 s. Con otros empujones o llantas cambian.',
        'Que una persona empuje de manera sostenida con unos 200 N y que la resistencia de rodadura de una combi sea de 1 % a 2 % de su peso (de memoria).',
        'Que una combi (Toyota Hiace) tenga unas 2 t sin pasajeros (de memoria) y que se pueda arrancar empujándola (sirve con caja mecánica).',
        'Que quienes empujan sigan empujando igual al trotar es una idealización: en la práctica el empujón baja cuando corren.',
      ],
      notas: [
        'La pregunta se puede intentar con el párrafo 3: con el doble de empujón (y el mismo freno de llantas, que ya no cambia) la combi gana rapidez más rápido, más del doble en la cuenta. La clase recoge la relación entre fuerza neta y aceleración.',
        'Se descartó el choque de la combi que se mueve aunque nadie pueda levantarla, porque compara el empujón con el peso y adelanta la Predice de la idea 2 (en la Luna, empujar de lado no depende del peso).',
        'En la figura, la predicción va a 5 km/h en las tres filas; la medición sigue la cuenta redondeada (3, 5 y 11 km/h).',
        'Revisión del Escribidor Escribano (27 nov): el párrafo 3 terminaba su primera oración con «y gana menos cuanta más masa tiene», que es la segunda ley y toca la Predice de la idea 2 (la caja de 20 kg en la Luna); se quitó, y la oración cierra ahora con el choque del caso (la combi se les escapa a quienes la empujan). «El freno de las llantas» pasó a «la resistencia de las llantas», para no confundirlo con los frenos. El párrafo 1 pasó a condicional entero («si tres personas empujaran»). «Lo que uno espera» pasó a «Lo que esperarías» (de tú) y «Tampoco es que» a «Y no es que», porque seguía a una expectativa. La pregunta preguntaba «qué cambiaría en la manera en que la combi gana rapidez», que un alumno sin el tema no sabe cómo contestar; ahora pide comparar la rapidez a los 10 s (más, igual o menos que con tres).',
        'Tercera pasada (27 nov): sin ecuaciones en la oración ni palabras de doble sentido («fuerza» y «masa» van siempre en su sentido de la física).',
        'Coherencia con la unidad (28 nov): responde en la idea 1 (Segunda ley): la regla dice que «la fuerza neta, la suma de todas las fuerzas con su sentido, le da al cuerpo una aceleración», y un ejemplo de la idea 1 (cinco cajas empujadas con fuerza constante) calcula la rapidez ganada con v = a · t. El roce de las llantas es la idea 3. seLleva decía «una fuerza que no cesa […] la va aumentando», que choca con la idea 1, donde la caja arrastrada contra el piso va a velocidad constante con la fuerza puesta; ahora dice «una fuerza que no cesa y le gana al roce», como el párrafo 3. La pregunta de seis personas se responde con la fuerza neta de la idea 1',
      ],
    },
  };
})());
