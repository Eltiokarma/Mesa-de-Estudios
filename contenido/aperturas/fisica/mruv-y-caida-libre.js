/*
 * Apertura de «MRUV y caída libre» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * El choque está en el baño: una ducha que gotea suelta las gotas a ritmo parejo y, sin embargo, se separan al caer.
 * Lo que el alumno se lleva va en ficha.seLleva. No adelanta la Predice de la idea 1 (−3 m/s²), la de la idea 2 (al
 * doble de rapidez, el cuádruple de frenada: 100 m), la de la idea 3 (6 m), la de la idea 4 (a los 5 s), la de la
 * idea 5 (la canica y la piedra llegan a la vez: aquí las gotas son iguales y no se compara el peso) ni la de la idea 6
 * (10 m/s² en el punto más alto). Tampoco la misión de la idea 5 («en la mitad del tiempo, ¿cae la mitad?»): la figura
 * no rotula distancias ni tiempos de caída. Colores de la unidad (cabecera de contenido/teoria/fisica/
 * mruv-y-caida-libre.js): la posición y las separaciones en violeta (c-f); las gotas van en tinta.
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const r1 = n => Math.round(n * 10) / 10;
  // La ducha a 2 m del piso, 115 px por metro. Cuatro gotas por segundo: en un instante hay gotas que bajaron
  // 0 cm, 31 cm y 123 cm (5 t² con t = 0; 0,25 s y 0,5 s). La predicción, a rapidez fija, las deja igual de separadas:
  // 0 cm, 62 cm y 123 cm. La primera y la última coinciden en los dos paneles; solo cambia la del medio.
  const TOPE = 88, PX = 115, PISO = TOPE + 2 * PX;
  const gota = (x, y) => `<path d="M${x} ${r1(y - 13)}C${x + 3} ${r1(y - 6)} ${x + 8} ${r1(y - 2)} ${x + 8} ${r1(y + 3)}A8 8 0 0 1 ${x - 8} ${r1(y + 3)}C${x - 8} ${r1(y - 2)} ${x - 3} ${r1(y - 6)} ${x} ${r1(y - 13)}Z" style="fill:var(--card)" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>`;
  const llave = (x, y1, y2) => `<path d="M${x} ${r1(y1 + 4)}h8v${r1(y2 - y1 - 8)}h-8" fill="none" style="stroke:var(--c-f)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
  const panel = (x0, titulo, cms, pie) => {
    const cx = x0 + 110, ys = cms.map(c => TOPE + 14 + c / 100 * PX);
    const ducha = `<path d="M${cx + 60} 52h-40q-10 0 -10 10v8" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M${cx - 26} ${TOPE - 4}q26 -22 52 0Z" style="fill:var(--card)" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>`;
    return `<text x="${x0 + 130}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      ${ducha}
      ${ys.map(y => gota(cx, y)).join('')}
      ${llave(cx + 24, ys[0], ys[1])}${llave(cx + 24, ys[1], ys[2])}
      <line x1="${x0 + 30}" y1="${PISO + 16}" x2="${x0 + 230}" y2="${PISO + 16}" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
      ${pie.map((l, i) => `<text x="${x0 + 130}" y="${PISO + 56 + i * 26}" text-anchor="middle" font-size="22" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 ${PISO + 90}" width="520" height="${PISO + 90}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="${PISO + 80}" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', [0, 62, 123], ['Gotas igual', 'de separadas'])}
    ${panel(260, 'Lo que se mide', [0, 31, 123], ['Cada vez', 'más separadas'])}
  </svg>`;

  return {
    unidad: 'fisica.mruv-y-caida-libre',
    titulo: '¿Por qué las gotas de una ducha que gotea se separan al caer, si salen a ritmo parejo?',
    parrafos: [
      'Una ducha mal cerrada suelta sus gotas a ritmo parejo, y puedes contarlas con un reloj: por ejemplo, cuatro gotas en cada segundo. ' +
        'Si filmas las gotas con la cámara lenta del celular, verás que cerca de la ducha van más juntas y que, mientras bajan, se separan cada vez más. ' +
        'Cada gota sale casi quieta y llegaría al piso, 2 m más abajo, a más de 20 km/h, más o menos la rapidez de una bicicleta en la ciclovía.',
      'Si cada gota cayera siempre igual de rápido, como los carros de una fila que avanzan a la misma rapidez, todas irían igual de separadas, porque salen una tras otra con el mismo intervalo. ' +
        'Tampoco sirve decir que la gota de abajo es más pesada y por eso se escapa, porque todas salen de la misma ducha y son iguales.',
      'Cada gota baja cada vez más rápido, así que la que va más abajo, que lleva más tiempo cayendo, va más rápido que la que viene detrás y se le aleja. ' +
        'Cuando la rapidez de algo cambia mientras pasa el tiempo, su movimiento tiene aceleración, y esta unidad trata de ella: del movimiento que gana o pierde rapidez de manera pareja y de la caída libre.',
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos duchas iguales con tres gotas en el aire, la primera junto a la ducha y la última cerca del piso. Lo que predice la idea de que las gotas caen a rapidez fija: las tres igual de separadas. Lo que se mide: la gota del medio va cerca de la primera y lejos de la última, porque las gotas se separan cada vez más al caer.',
    },
    pregunta: 'Si la ducha goteara más rápido, ocho gotas por segundo en vez de cuatro, ¿crees que cerca del piso las gotas irían más juntas, igual de separadas o más separadas que antes?',
    ficha: {
      seLleva: 'Lo que cae no baja a rapidez fija sino cada vez más rápido; por eso las gotas que salen parejas de una ducha se van separando mientras caen.',
      alcance: 'Parcial (núcleo: qué cambia, respecto de qué y en qué intervalo; una rapidez que cambia con el tiempo).',
      choque: 'Gotas que salen a ritmo parejo y cayeran a rapidez fija irían igual de separadas; se ven cada vez más separadas mientras bajan.',
      atajo: 'Pensar la caída como un movimiento a rapidez fija, que es lo que el alumno trae de la unidad anterior (los carros en fila). La explicación trampa, que la gota de abajo es más pesada, la descarta que todas las gotas son iguales; el texto no dice nada sobre si el peso cambia la caída, para no tocar la Predice de la idea 5.',
      porVerificar: [
        'Los 20 km/h salen de la cuenta de caída libre desde 2 m (unos 6,3 m/s, 22 km/h, sin aire); el aire apenas frena a una gota en 2 m, pero no está medido. Que una bicicleta en la ciclovía vaya a unos 15 a 20 km/h es de memoria.',
        'Las posiciones de la figura (0 cm, 31 cm y 123 cm debajo de la ducha con cuatro gotas por segundo) salen de 5 t², no de una medición: falta filmarlo con cámara lenta o citar una práctica publicada.',
        'Que la ducha quede a unos 2 m del piso (de memoria; es la altura usual).',
      ],
      notas: [
        'La pregunta se puede intentar con los párrafos 1 y 3: si salen el doble de seguido, la siguiente gota sale antes y a cada altura dos gotas vecinas se separan la mitad, así que irían más juntas. La clase recoge que la separación depende de cuánto gana rapidez cada gota en el intervalo.',
        'La figura no rotula los centímetros de caída ni los tiempos para no dar la proporción entre tiempo y distancia, que es la misión de la idea 5.',
        'Se descartaron el choque de la frenada (al doble de rapidez, el cuádruple de distancia), que es la Predice de la idea 2, y el de la canica y la piedra, que es la Predice de la idea 5.',
        'Revisión del Escribidor Escribano (27 nov): «la que va adelante» pasó a «la que va más abajo», porque en una caída «adelante» no se ve; «lo que avanza una bicicleta» pasó a «más o menos la rapidez de una bicicleta». Los 20 km/h ya iban en condicional («llegaría»). No delata: el texto no dice nada del peso en la caída (Predice de la idea 5) ni de la frenada (idea 2).',
      ],
    },
  };
})());
