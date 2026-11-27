/*
 * Apertura de «Estática» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * El caso está en cualquier puerta: se abre con un dedo desde la manija y cuesta mucho cerca de la bisagra, aunque la
 * puerta es la misma. Doble revisión (27 nov): eso es intuitivo, así que la apertura no finge que el alumno espera lo
 * contrario (punto 7): «Lo que predice» es la intuición correcta (cuesta más, sin saber cuánto) y lo medido le pone el
 * número (siete veces más) y la aplica (la manija, la llave de ruedas con un tubo). Lo que el alumno se lleva va en ficha.seLleva. No adelanta la Predice de la idea 1 (500 N en la
 * balanza), la de la idea 2 (el cable más parado jala más), la de la idea 3 (el piso frena con 120 N), la de la idea 4
 * (21 cm), la de la idea 5 (la parte del cepillo de la escoba pesa más) ni la de la idea 6 (100 N), ni la misión de la
 * idea 5 (el sube y baja). No usa la bolsa colgada de dos balanzas, que es la apertura de «Vectores». Colores de la
 * unidad (cabecera de contenido/teoria/fisica/estatica.js): el empujón de la mano en naranja (c-o), el color del jalón.
 * Las distancias van en tinta: la unidad no les da color.
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const r1 = n => Math.round(n * 10) / 10;
  const flecha = (x1, y1, x2, y2, c, w = 6) => {
    const g = Math.atan2(y2 - y1, x2 - x1), p = 15, a = 0.45;
    const bx = x2 - p * Math.cos(g), by = y2 - p * Math.sin(g);
    return `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(bx)}" y2="${r1(by)}" style="stroke:var(${c})" stroke-width="${w}" stroke-linecap="round"/>
      <path d="M${r1(x2)} ${r1(y2)}L${r1(x2 - p * 1.15 * Math.cos(g - a))} ${r1(y2 - p * 1.15 * Math.sin(g - a))}L${r1(x2 - p * 1.15 * Math.cos(g + a))} ${r1(y2 - p * 1.15 * Math.sin(g + a))}Z" style="fill:var(${c})"/>`;
  };
  // La puerta vista desde arriba: 80 cm de ancho a 2,4 px por centímetro, con la bisagra a la izquierda.
  // Se empuja a 70 cm de la bisagra (la manija) y a 10 cm. Cada newton del empujón mide 6 px de flecha.
  const PX = 2.4, Y = 104, N = 6;
  const panel = (x0, titulo, cerca, pie) => {
    const xb = x0 + 34, xf = xb + 80 * PX, xm = xb + 70 * PX, xc = xb + 10 * PX;
    // Con `rotulo`, el empujón se dibuja punteado: la intuición dice que es mayor, pero no cuánto.
    const empujon = (x, f, lado, rotulo) => `${rotulo ? `<g stroke-dasharray="7 6">${flecha(x, Y + 12 + f * N, x, Y + 10, '--c-o')}</g>` : flecha(x, Y + 12 + f * N, x, Y + 10, '--c-o')}
      <text x="${x + lado * 12}" y="${r1(Y + 16 + f * N)}" text-anchor="${lado > 0 ? 'start' : 'end'}" font-size="21" font-weight="800" style="fill:var(--c-o)">${rotulo || `${f} N`}</text>`;
    return `<text x="${x0 + 130}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      <text x="${x0 + 130}" y="60" text-anchor="middle" font-size="17" style="fill:var(--muted)">puerta vista desde arriba</text>
      <line x1="${x0 + 6}" y1="${Y}" x2="${xb - 6}" y2="${Y}" stroke="currentColor" stroke-width="9"/>
      <line x1="${r1(xf + 6)}" y1="${Y}" x2="${x0 + 250}" y2="${Y}" stroke="currentColor" stroke-width="9"/>
      <rect x="${xb}" y="${Y - 5}" width="${r1(80 * PX)}" height="10" rx="2" style="fill:var(--card)" stroke="currentColor" stroke-width="2.5"/>
      <circle cx="${xb}" cy="${Y}" r="7" fill="currentColor"/>
      <rect x="${r1(xm - 4)}" y="${Y - 14}" width="8" height="9" rx="2" fill="currentColor"/>
      <text x="${xb - 8}" y="${Y - 22}" text-anchor="start" font-size="18" style="fill:var(--muted)">bisagra</text>
      <text x="${r1(xm)}" y="${Y - 22}" text-anchor="middle" font-size="18" style="fill:var(--muted)">manija</text>
      ${empujon(xm, 5, -1)}${typeof cerca === 'number' ? empujon(xc, cerca, 1) : empujon(xc, 14, 1, cerca)}
      ${pie.map((l, i) => `<text x="${x0 + 130}" y="${360 + i * 26}" text-anchor="middle" font-size="22" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 398" width="520" height="398" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="388" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', 'más de 5 N', ['Cerca de la bisagra', 'cuesta más'])}
    ${panel(260, 'Lo que se mide', 35, ['Cerca de la bisagra:', 'siete veces más'])}
  </svg>`;

  return {
    unidad: 'fisica.estatica',
    titulo: '¿Por qué la manija de una puerta va lejos de la bisagra?',
    parrafos: [
      'Una puerta se abre con un dedo si la empujas por la manija, y cuesta mucho más si la empujas cerca de la bisagra, aunque la puerta sea la misma. ' +
        'Con un dinamómetro, que es un resorte que marca en newtons cuánto empujas, se podría medir la diferencia: si en la manija, a 70 cm de la bisagra, bastara un empujón de 5 N, a 10 cm de la bisagra harían falta unos 35 N, siete veces más.',
      'Que cueste más cerca de la bisagra no te sorprende, porque lo has sentido en cualquier puerta, y tu intuición acierta: mientras más cerca de la bisagra empujas, más fuerza hace falta. ' +
        'Lo que la intuición no dice es cuánta fuerza más, y la culpa no es de una bisagra dura, porque es la misma bisagra que deja abrir la puerta con un dedo desde la manija.',
      'Ese efecto se usa todos los días: las manijas van en el borde opuesto a la bisagra, y el mecánico que no puede aflojar la tuerca de una llanta alarga su llave con un tubo para empujar más lejos de la tuerca. ' +
        'Una puerta cerrada, un letrero colgado o una escalera apoyada en la pared se quedan quietos porque las fuerzas que reciben se compensan, tanto para moverlos como para hacerlos girar, y de ese equilibrio trata esta unidad: la estática.',
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'La misma puerta vista desde arriba, con la bisagra a la izquierda y la manija a 70 cm. Lo que predice la intuición: en la manija bastan 5 N y a 10 cm de la bisagra hace falta más, sin saber cuánto. Lo que se mide: a 10 cm de la bisagra hacen falta unos 35 N, siete veces más que en la manija.',
    },
    pregunta: 'Si empujas la manija hacia la bisagra, a lo largo de la puerta y no de frente, ¿crees que la puerta se abrirá?',
    ficha: {
      seLleva: 'Para hacer girar algo no basta la fuerza: importa lo lejos del eje que empujas, y por eso la manija de una puerta está lejos de la bisagra y el mecánico alarga su llave con un tubo.',
      alcance: 'Parcial (núcleo: una fuerza produce efectos distintos según dónde y hacia dónde se aplica; el equilibrio como compensación). El torque formal y el diagrama de cuerpo libre no entran en PISA.',
      choque: 'Sin choque forzado (punto 7): la intuición, cerca de la bisagra cuesta más, es correcta; lo medido le pone número (5 N en la manija y unos 35 N a 10 cm, siete veces más) y la aplica a la manija y a la llave de ruedas.',
      atajo: 'La explicación trampa de la bisagra dura la descarta que la misma bisagra deja abrir con un dedo desde la manija. El atajo de que la puerta «pesa más» cerca de la bisagra lo descarta que la puerta es la misma y se empuja de lado. El mejor alumno diría «es como una palanca»: es el nombre del fenómeno, no la cuenta, y la cuenta es parte de la unidad (idea 5).',
      porVerificar: [
        'Los 5 N y 35 N no están medidos: los 35 N salen de la cuenta de torques (5 N × 70 cm ÷ 10 cm), sin el roce de la bisagra. Falta medirlo con un dinamómetro en una puerta real; el roce de la bisagra y un cierrapuertas cambian los números.',
        'Que 5 N basten para empezar a abrir una puerta común desde la manija (de memoria; es el orden de magnitud).',
        'Que la manija de una puerta común quede a unos 70 cm de la bisagra en una puerta de 80 cm (de memoria; hay puertas de 70 a 90 cm).',
        'Que los mecánicos alarguen la llave de ruedas con un tubo para aflojar tuercas duras (práctica conocida, de memoria).',
      ],
      notas: [
        'La pregunta se puede intentar con el párrafo 3 y la figura: empujar a lo largo de la puerta, hacia la bisagra, no la hace girar aunque se empuje fuerte. Abre la idea de que importa también la dirección del empujón (idea 5, torque).',
        'Contenido, para Gerson: el choque lleva al torque, que es la idea 5 de seis; el párrafo 3 lo enlaza con el equilibrio en general para que la apertura sirva a la unidad entera. Decidir si se prefiere un choque de la idea 1 (primera y tercera ley).',
        'El texto no dice «el peso por la distancia», que es el acierto de la misión de la idea 5, ni compara los dos lados de un eje.',
        'Revisión del Escribidor Escribano (27 nov): el párrafo 3 abría con la regla del torque («la fuerza cuenta, pero también cuenta lo lejos del eje que la aplicas»), que es la idea 5; ahora abre con el choque del caso (la misma puerta pediría siete veces más fuerza cerca de la bisagra) y deja la manija como consecuencia. El párrafo 1 pasó a condicional («se notaría», «bastara»), porque los 35 N son cálculo. «Lo que uno espera» pasó a «Lo que esperarías» (de tú), y «Tampoco es que la bisagra esté dura» a «Y no es que…», porque seguía a una expectativa, no a otra explicación descartada. «Sus fuerzas se compensan y tampoco los hacen girar» dejaba sin sujeto claro el «hacen girar»: ahora dice «las fuerzas que reciben se compensan, tanto para moverlos como para hacerlos girar». La pregunta tenía dos incisos seguidos; ahora es una sola oración en orden. Para Gerson, sobre cómo llega el alumno a la idea 1 (primera y tercera ley, el costal sobre la balanza): llega con una pregunta de giro (la puerta) que la unidad no retoma hasta la idea 5, y las ideas 1 a 4 tratan de fuerzas que se compensan sin girar. El único puente es la oración del equilibrio del párrafo 3 (la escalera, el letrero), que nombra la compensación de fuerzas. El alumno no llega mal, porque la idea 1 empieza desde cero con empujones y jalones, pero la apertura le promete algo que tarda cuatro ideas en llegar. Si se quiere un choque de las ideas 1 o 2, uno posible es la balanza de la bodega que marca más cuando se empuja el costal hacia abajo, aunque está cerca de su Predice (500 N); el del cordel que no se puede tensar del todo horizontal se parece al de la bolsa de «Vectores», la unidad vecina.',
        'Doble revisión (27 nov): el párrafo 2 decía «Lo que esperarías es que mover la misma puerta cueste lo mismo, la empujes donde la empujes», y el panel «Lo que predice» ponía 5 N en los dos puntos. Era un muñeco de paja: nadie que haya abierto una puerta espera eso, y el propio título decía que cuesta más. Se reescribió con el punto 7. Título: de «¿Por qué cuesta tanto abrir una puerta si la empujas cerca de la bisagra?» a «¿Por qué la manija de una puerta va lejos de la bisagra?». El párrafo 2 da la intuición por buena y dice lo que no sabe (cuánto más); el párrafo 3 la aplica (la manija y la llave de ruedas con un tubo) antes del equilibrio. El panel «Lo que predice» lleva ahora un empujón punteado, «más de 5 N», con el pie «Cerca de la bisagra cuesta más». No se escribió «tantas veces más cerca, tantas veces más fuerza», que se acerca al acierto de la misión de la idea 5 (el peso por la distancia).',
        'Tercera pasada (27 nov): sin ecuaciones en la oración ni palabras de doble sentido (los 5 N y 35 N son datos sueltos; «fuerza» siempre en su sentido de la física).',
      ],
    },
  };
})());
