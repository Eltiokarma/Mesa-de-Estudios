/*
 * Apertura de «Polinomios» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * El choque es propio: la distancia que necesita un auto para detenerse. Al doble de velocidad, la regla de tres
 * predice el doble y el «todo crece con el cuadrado» predice el cuádruple; las dos fallan, porque la distancia junta
 * un tramo que crece con la velocidad y otro que crece con su cuadrado: dos términos de distinto grado que no se juntan
 * en uno. Lo que el alumno se lleva va en ficha.seLleva. No adelanta ninguna Predice de la unidad (5xy, 9 dm², grado 4,
 * 6 términos, «No: con otra loseta cubren distinto», grado 5) ni las frases de sus misiones. Colores de la unidad
 * (cabecera de contenido/teoria/algebra/polinomios.js): el primer término, el tramo antes de frenar, en naranja
 * (c-o); el segundo, el tramo frenando, en turquesa (c-i), y el total, el resultado, en violeta (c-f).
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const reaccion = t => ({ v: 'c-o', t }), frenado = t => ({ v: 'c-i', t }), total = t => ({ v: 'c-f', t });
  const r1 = n => Math.round(n * 10) / 10;

  // Modelo de los datos (ficha.porVerificar): un segundo de reacción y una desaceleración de 7 m/s² en pista seca.
  // 50 km/h: 13,9 m + 13,8 m ≈ 28 m. 100 km/h: 27,8 m + 55,1 m ≈ 83 m. Los dos paneles usan la misma escala
  // (1 m = 1,9 unidades) y los mismos dos autos; solo cambia el tramo frenando del auto a 100 km/h.
  const K = 1.9;
  const fila = (x0, y, rotulo, a, b) => {
    const x = x0 + 22, wa = a * K, wb = b * K;
    const auto = `<path d="M${x} ${y - 6}v-9q0 -3 3 -3h6l5 -6h12l6 6h4q3 0 3 3v9z" style="fill:var(--card)" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/>
      <circle cx="${x + 9}" cy="${y - 5}" r="3.5" style="fill:var(--card)" stroke="currentColor" stroke-width="2.2"/><circle cx="${x + 29}" cy="${y - 5}" r="3.5" style="fill:var(--card)" stroke="currentColor" stroke-width="2.2"/>`;
    return `<text x="${x + 48}" y="${y - 8}" font-size="19" font-weight="700" fill="currentColor">${rotulo}</text>
      ${auto}
      <rect x="${x}" y="${y}" width="${r1(wa)}" height="22" style="fill:var(--c-o);stroke:var(--c-o)" fill-opacity=".3" stroke-width="2"/>
      <rect x="${r1(x + wa)}" y="${y}" width="${r1(wb)}" height="22" style="fill:var(--c-i);stroke:var(--c-i)" fill-opacity=".3" stroke-width="2"/>
      <text x="${r1(x + wa + wb + 6)}" y="${y + 18}" font-size="19" font-weight="800" style="fill:var(--c-f);stroke:var(--card)" stroke-width="5" paint-order="stroke">${Math.round(a + b)} m</text>`;
  };
  const panel = (x0, titulo, frena100, pie) => {
    const cx = x0 + 130, xm = r1(x0 + 22 + 60 * K);
    return `<text x="${cx}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      <line x1="${xm}" y1="62" x2="${xm}" y2="214" style="stroke:var(--muted)" stroke-width="2" stroke-dasharray="5 4"/>
      <text x="${xm}" y="56" text-anchor="middle" font-size="16" style="fill:var(--muted)">60 m</text>
      ${fila(x0, 100, '50 km/h', 14, 14)}
      ${fila(x0, 184, '100 km/h', 28, frena100)}
      <rect x="${x0 + 22}" y="232" width="16" height="14" style="fill:var(--c-o);stroke:var(--c-o)" fill-opacity=".3" stroke-width="2"/>
      <text x="${x0 + 44}" y="245" font-size="17" fill="currentColor">antes de frenar</text>
      <rect x="${x0 + 22}" y="256" width="16" height="14" style="fill:var(--c-i);stroke:var(--c-i)" fill-opacity=".3" stroke-width="2"/>
      <text x="${x0 + 44}" y="269" font-size="17" fill="currentColor">frenando</text>
      ${pie.map((l, i) => `<text x="${cx}" y="${308 + i * 24}" text-anchor="middle" font-size="21" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 346" width="520" height="346" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="336" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', 28, ['Doble de velocidad:', 'doble de distancia'])}
    ${panel(260, 'Lo que se mide', 55, ['Doble de velocidad:', 'casi el triple'])}
  </svg>`;

  return {
    unidad: 'algebra.polinomios',
    titulo: '¿Por qué un auto al doble de velocidad necesita casi el triple de distancia para detenerse?',
    parrafos: [
      ['Desde que el conductor ve el peligro hasta que pisa el freno pasa cerca de un segundo, y en ese tiempo el auto avanza sin frenar; después recorre otro tramo mientras frena. ',
        'En pista seca, un auto a 50 km/h avanza unos ', reaccion('14 m'), ' antes de frenar y otros ', frenado('14 m'), ' frenando, así que la distancia hasta detenerse es la suma de los dos tramos:',
        { linea: [reaccion('14 m'), ' + ', frenado('14 m'), ' = ', total('28 m')] },
        'A 100 km/h, el doble de velocidad, necesita unos ', total('83 m'), ', casi el triple.'],
      ['Con la regla de tres, al doble de velocidad le tocaría el doble de distancia:',
        { linea: ['2 × ', total('28 m'), ' = ', total('56 m')] },
        'Con esa cuenta, el auto se detendría antes de un cruce que está a 60 m, cuando en realidad lo pasa de largo. ',
        'Quien recuerda que la distancia de frenado crece con el cuadrado de la velocidad diría que hay que multiplicar por cuatro:',
        { linea: ['4 × 28 m = 112 m'] },
        'Esa cuenta también se equivocaría, casi por lo mismo, pero hacia arriba.'],
      ['Ninguna de las dos cuentas acierta porque la distancia junta dos tramos que no crecen igual. ',
        'Al doble de velocidad, el tramo antes de frenar pasa de 14 m a ', reaccion('28 m'), ', y el tramo frenando, de 14 m a unos ', frenado('55 m'), ', y juntos dan la distancia que se mide:',
        { linea: [reaccion('28 m'), ' + ', frenado('55 m'), ' = ', total('83 m')] },
        'Una cantidad hecha de partes que crecen de maneras distintas se escribe como un polinomio, y esta unidad enseña a escribirlos, a juntar sus partes y a calcular cuánto valen.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos dibujos con la misma escala de lo que avanza un auto hasta detenerse, partido en el tramo antes de frenar y el tramo frenando. A 50 km/h, 14 m más 14 m, 28 m en los dos. Lo que predice la regla de tres a 100 km/h: 28 m más 28 m, 56 m, antes de una línea a 60 m. Lo que se mide: 28 m más 55 m, unos 83 m, que pasan la línea.',
    },
    pregunta: 'Si el auto va a 150 km/h, ¿cuál de los dos tramos crees que será más largo, el que recorre antes de frenar o el que recorre frenando?',
    ficha: {
      seLleva: 'Una cantidad hecha de partes que crecen distinto no se duplica ni se cuadruplica entera: al doble de velocidad, un auto necesita casi el triple de distancia para detenerse, porque el tramo frenando crece mucho más rápido que el tramo antes de frenar.',
      alcance: 'Parcial (núcleo: cambio y relaciones, elegir entre un modelo lineal y uno que no lo es; el lenguaje de polinomios, términos y grados es formalismo). Deducción propia con el marco de Matemática 2022.',
      choque: 'La regla de tres predice 56 m a 100 km/h, el «crece con el cuadrado» predice 112 m, y el auto necesita unos 83 m.',
      atajo: 'Los dos arreglos simples: la regla de tres (todo se duplica) y la regla del cuadrado (todo se cuadruplica), descartados en el párrafo 2. Lo que no alcanza es tratar la distancia como una sola cosa: hay que ver sus dos términos por separado, que es el tema.',
      porVerificar: [
        'Los 14 m, 28 m, 55 m y 83 m salen de un modelo, no de una medición: 1 s de reacción y una desaceleración de 7 m/s² (adherencia de unos 0,7 en asfalto seco). Las tablas de seguridad vial dan cifras del mismo orden (la británica, por ejemplo, unos 23 m a 48 km/h y 73 m a 97 km/h, con 0,67 s de reacción); falta citar una tabla peruana (MTC o manual de manejo).',
        'Que el tiempo de reacción típico sea de 0,7 a 1,5 s (de memoria).',
      ],
      notas: [
        'Tercera pasada (27 nov): cada cuenta va en su línea, con los colores que ya tenía cada tramo: 14 m + 14 m = 28 m (párrafo 1), 2 × 28 m = 56 m y 4 × 28 m = 112 m (párrafo 2, las dos predicciones), y 28 m + 55 m = 83 m (párrafo 3, la suma que antes quedaba implícita). Las oraciones de alrededor terminan en dos puntos o arrancan con «Con esa cuenta» y «Esa cuenta». Sin palabras de doble sentido.',
        'Revisión del Escribidor Escribano (27 nov): «se equivocaría, esta vez por mucho más» era falso (112 m se pasa en 29 m y 56 m se queda corto en 27 m) y ahora dice «casi por lo mismo, pero hacia arriba». El párrafo 3 enunciaba el mecanismo («una que va con la velocidad y otra con la velocidad al cuadrado»); ahora da los dos tramos medidos (de 14 m a 28 m y de 14 m a unos 55 m) y deja la regla para la unidad.',
        'El choque no es un problema disfrazado: el alumno no tiene que calcular nada, solo ver que ninguna de sus dos reglas sirve. La línea punteada de 60 m hace visible la consecuencia.',
        'La pregunta se puede intentar con la figura: de 50 a 100 km/h el tramo turquesa creció mucho más que el naranja, así que a 150 km/h el tramo frenando será más largo (unos 124 m contra 42 m). Abre la idea del grado (el término de mayor grado manda) sin ser una Predice.',
        'Contenido, para Gerson: el párrafo 3 nombra el mecanismo (un tramo va con la velocidad y otro con su cuadrado) y por eso roza la física; la unidad es de álgebra y lo que se queda es que una cantidad puede tener términos de distinto grado. Es el tipo de hecho más lejano de las losetas de la teoría, a propósito.',
      ],
    },
  };
})());
