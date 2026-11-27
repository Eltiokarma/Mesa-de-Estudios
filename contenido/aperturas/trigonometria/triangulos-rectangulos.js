/*
 * Apertura de «Resolución de triángulos rectángulos» (docs/metodo/apertura-pisa.md; criterio en
 * docs/metodo/entrada-pisa.md). El choque es la barrera de un estacionamiento: a mitad de su giro, su punta ya subió
 * unos 2,8 m de los 4 m, y no la mitad. El atajo de Pitágoras sirve justo en la mitad del giro (catetos iguales) y en
 * ninguna otra posición: por eso hace falta el tema. Lo que el alumno se lleva va en ficha.seLleva. No usa los objetos
 * de las Predice (la cometa, la antena y su cable, el globo, el cerro, el letrero) ni escribe los números de sus
 * respuestas y misiones (40, 20, 100, 173, 30, 45, 60…): la mitad del giro no se escribe en grados. Colores de la
 * unidad (cabecera de contenido/teoria/trigonometria/triangulos-rectangulos.js): lo vertical, la altura, en naranja
 * (c-o); lo horizontal en turquesa (c-i); el ángulo en carmín (c-h); el brazo, que es la hipotenusa, en tinta.
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const alto = t => ({ v: 'c-o', t }), ang = t => ({ v: 'c-h', t });
  const r1 = n => Math.round(n * 10) / 10;
  // La barrera de lado: el eje sobre un poste y el brazo de 4 m (1 m = 46 unidades) a mitad de su giro. Echada y parada
  // van en punteado, para que se vea de dónde a dónde gira. Lo único que cambia entre los paneles es la altura de la
  // punta que se marca en naranja: 2 m en lo que predice el reparto y unos 2,8 m en lo que se mide.
  const EJE = 290, K = 46, L = 4 * K;
  const panel = (x0, titulo, alturaM, rotulo, pie) => {
    const ox = x0 + 34, a = Math.PI / 4, tx = ox + L * Math.cos(a), ty = EJE - L * Math.sin(a), hy = EJE - alturaM * K;
    const franjas = [0.2, 0.4, 0.6, 0.8].map(f => `<line x1="${r1(ox + L * f * Math.cos(a))}" y1="${r1(EJE - L * f * Math.sin(a))}" x2="${r1(ox + L * (f + 0.08) * Math.cos(a))}" y2="${r1(EJE - L * (f + 0.08) * Math.sin(a))}" style="stroke:var(--card)" stroke-width="7"/>`).join('');
    return `<text x="${x0 + 130}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      <line x1="${ox}" y1="${EJE}" x2="${ox + L}" y2="${EJE}" style="stroke:var(--muted)" stroke-width="3" stroke-dasharray="7 7"/>
      <line x1="${ox}" y1="${EJE}" x2="${ox}" y2="${EJE - L}" style="stroke:var(--muted)" stroke-width="3" stroke-dasharray="7 7"/>
      <text x="${ox + 10}" y="${EJE - L + 6}" font-size="19" font-weight="700" style="fill:var(--muted)">4 m</text>
      <path d="M${ox + 56} ${EJE}A56 56 0 0 0 ${r1(ox + 56 * Math.cos(a))} ${r1(EJE - 56 * Math.sin(a))}" fill="none" style="stroke:var(--c-h)" stroke-width="3"/>
      <line x1="${r1(tx)}" y1="${EJE}" x2="${r1(tx)}" y2="${r1(hy)}" style="stroke:var(--c-o)" stroke-width="6" stroke-linecap="round"/>
      <line x1="${r1(tx - 12)}" y1="${r1(hy)}" x2="${r1(tx + 12)}" y2="${r1(hy)}" style="stroke:var(--c-o)" stroke-width="4" stroke-linecap="round"/>
      <line x1="${ox}" y1="${EJE}" x2="${r1(tx)}" y2="${r1(ty)}" stroke="currentColor" stroke-width="11" stroke-linecap="round"/>
      ${franjas}
      <rect x="${ox - 14}" y="${EJE - 6}" width="28" height="50" rx="4" style="fill:var(--card)" stroke="currentColor" stroke-width="3"/>
      <circle cx="${ox}" cy="${EJE}" r="6" fill="currentColor"/>
      <text x="${r1(tx + 16)}" y="${r1(hy + 8)}" font-size="22" font-weight="800" style="fill:var(--c-o)">${rotulo}</text>
      <text x="${ox + 62}" y="${EJE - 12}" font-size="17" font-weight="800" style="fill:var(--c-h)">mitad</text>
      ${pie.map((l, i) => `<text x="${x0 + 130}" y="${EJE + 62 + i * 26}" text-anchor="middle" font-size="22" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 404" width="520" height="404" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="394" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', 2, '2 m', ['Mitad del giro:', 'mitad de altura'])}
    ${panel(260, 'Lo que se mide', 4 * Math.SQRT1_2, '2,8 m', ['Mitad del giro:', '2,8 m de los 4 m'])}
  </svg>`;

  return {
    unidad: 'trigonometria.triangulos-rectangulos',
    titulo: '¿Por qué, a mitad de su giro, la barrera de un estacionamiento ya subió más de la mitad?',
    parrafos: [
      ['A la salida de un estacionamiento, la barrera es un brazo de unos 4 m que gira sobre un eje, desde echada hasta quedar parada. ',
        'Cuando ha hecho ', ang('la mitad de ese giro'), ', a medio camino entre echada y parada, si midieras con una wincha, su punta estaría a unos ', alto('2,8 m'),
        ' sobre el eje, así que solo le faltaría subir 1,2 m más.'],
      ['La cuenta que haría cualquiera es repartir: si con el giro completo la punta sube 4 m, con la mitad del giro tendría que haber subido la mitad, ',
        alto('2 m'), '. ',
        'Quien recuerde el teorema de Pitágoras puede comprobar los 2,8 m, porque a mitad del giro la punta se ha alejado del eje lo mismo hacia arriba que hacia el costado, y dos catetos iguales con una hipotenusa de 4 m miden unos 2,8 m cada uno.'],
      ['En las dos mitades el brazo gira lo mismo, pero la punta sube unos 2,8 m en la primera y solo 1,2 m en la segunda, así que no sube a la par del giro. ',
        'La cuenta con Pitágoras sirve solo a mitad del giro, porque en cualquier otra posición los dos catetos son distintos y una sola ecuación no alcanza para hallar dos números desconocidos. ',
        'Calcular a qué altura queda la punta con cualquier inclinación es resolver un triángulo rectángulo, el tema de esta unidad.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos dibujos iguales de una barrera de 4 m vista de lado, a mitad de su giro entre echada y parada. Lo que predice el reparto: la punta subió la mitad, 2 m, y la marca queda por debajo de la punta. Lo que se mide: la punta está a 2,8 m sobre el eje.',
    },
    pregunta: 'Cuando la barrera ya está casi parada, ¿crees que su punta sube mucho o casi nada con cada pequeño giro que le falta?',
    ficha: {
      seLleva: 'La punta de un brazo que gira no sube a la par del ángulo: con la mitad del giro ya pasó de la mitad de la altura, y en la segunda mitad sube mucho menos.',
      alcance: 'Parcial (deducción propia con el marco de Matemática 2022: espacio y forma, relaciones en un triángulo rectángulo en un contexto real; las razones como herramienta de cálculo no son el núcleo de PISA).',
      choque: 'El reparto predice que a mitad del giro la punta subió 2 m, y está a unos 2,8 m de los 4 m.',
      atajo: 'El teorema de Pitágoras con dos catetos iguales da los 2,8 m, pero solo a mitad del giro (el triángulo es isósceles); en cualquier otra posición los catetos son distintos y Pitágoras deja dos incógnitas con una sola ecuación. El párrafo 2 lo dice y el 3 lo descarta como camino general. Dibujar a escala y medir también lo resuelve, con error; no se menciona.',
      porVerificar: [
        'Largo de una barrera vehicular de estacionamiento o de peaje: entre 3 y 6 m según el modelo; se usa 4 m como redondo (de memoria).',
        'Los 2,8 m salen del cálculo (4 m × sen 45° ≈ 2,83 m), no de una medición propia. Se toma la altura de la punta sobre el eje, no sobre el piso.',
      ],
      notas: [
        'La pregunta se puede intentar con los números del texto (2,8 m en la primera mitad, 1,2 m en la segunda): cerca de quedar parada, la punta casi no sube y se mueve sobre todo de lado. Abre la idea de que la altura depende del seno, sin nombrarlo.',
        'El panel «Lo que predice» deja la marca de 2 m por debajo de la punta del brazo: la diferencia que se ve es el choque.',
        'Revisión del Escribidor Escribano (27 nov): el párrafo 3 cerraba con la regla («hay que unir el ángulo con los lados»), y el seLleva la repetía: se quitó de los dos. El párrafo 3 abre ahora con el choque en una oración (2,8 m en la primera mitad, 1,2 m en la segunda), como pide el skill. El párrafo 1 pasó a condicional («si midieras con una wincha, su punta estaría», «le faltaría»), porque los 2,8 m son cálculo. El título tenía un inciso entre el sujeto y el verbo; se movió al principio. «Tan alta como lejos del eje» pasó a «se ha alejado del eje lo mismo hacia arriba que hacia el costado».',
      ],
    },
  };
})());
