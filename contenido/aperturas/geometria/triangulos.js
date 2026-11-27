/*
 * Apertura de «Triángulos y líneas notables» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * El choque sale de la cocina: un tallarín crudo partido en tres pedazos, en dos puntos al azar, forma un triángulo solo
 * una de cada cuatro veces (el problema del palo roto). Lo que el alumno se lleva va en ficha.seLleva: tres largos
 * cualesquiera no siempre cierran un triángulo. La pregunta pide la condición sin darla; no se adelanta la Predice de la
 * idea 4 (el codo de la lámpara: entre 15 cm y 65 cm, sin llegar) ni la de la idea 1 (los ángulos de 100° y 95°), y
 * no se escribe ningún número de las misiones ni de las respuestas (12, 15, 30, 60, 65, 90, 120, 180, 360).
 * Colores de la unidad (cabecera de contenido/teoria/geometria/triangulos.js): los lados dados en naranja (c-o) y
 * turquesa (c-i); el tercer pedazo, en tinta.
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const r1 = n => Math.round(n * 10) / 10;
  const COL = ['var(--c-o)', 'var(--c-i)', 'currentColor'];

  // Cuatro intentos con el mismo tallarín de 20 unidades, partido en tres. Solo el segundo cumple que cada pedazo sea
  // más corto que los otros dos juntos. Los mismos cuatro intentos en los dos paneles; solo cambia el resultado.
  const INTENTOS = [[3, 13, 4], [7, 6, 7], [11, 5, 4], [2, 7, 11]];
  const K = 6;                       // unidades de dibujo por unidad de tallarín
  const cierra = ([a, b, c]) => a < b + c && b < a + c && c < a + b;

  // El tallarín partido: los tres pedazos en fila, con una muesca en cada corte.
  const tallarin = (x, y, ps) => {
    let s = '', p = x;
    ps.forEach((l, i) => {
      s += `<line x1="${r1(p + 2)}" y1="${y}" x2="${r1(p + l * K - 2)}" y2="${y}" style="stroke:${COL[i]}" stroke-width="6" stroke-linecap="round"/>`;
      p += l * K;
    });
    return s;
  };
  // Lo que se arma con los pedazos, con el más largo de base. Si cierra, el triángulo de verdad; si no, los dos cortos
  // apoyados en las puntas del largo, con el hueco entre ellos. En «Lo que predice», todos cierran (dibujo sin escala).
  const armado = (cx, y, ps, predice) => {
    const orden = ps.map((l, i) => [l, i]).sort((u, v) => v[0] - u[0]);
    const [[c, ic], [a, ia], [b, ib]] = orden;
    const S = 6, base = c * S, x1 = cx - base / 2, x2 = cx + base / 2;
    const linea = (xa, ya, xb, yb, i) => `<line x1="${r1(xa)}" y1="${r1(ya)}" x2="${r1(xb)}" y2="${r1(yb)}" style="stroke:${COL[i]}" stroke-width="5" stroke-linecap="round"/>`;
    let s = linea(x1, y, x2, y, ic);
    if (predice || cierra(ps)) {
      // Punta común: la de verdad si cierra; si no, una punta cualquiera arriba (es lo que se espera, no lo que pasa).
      let px, py;
      if (cierra(ps)) { px = (a * a - b * b + c * c) / (2 * c); py = Math.sqrt(Math.max(0, a * a - px * px)); px = x1 + px * S; py = y - py * S; }
      else { px = cx - base * 0.12; py = y - 34; }
      s += linea(x1, y, px, py, ia) + linea(x2, y, px, py, ib);
    } else {
      const g = 62 * Math.PI / 180;
      const ax = x1 + a * S * Math.cos(g), ay = y - a * S * Math.sin(g), bx = x2 - b * S * Math.cos(g), by = y - b * S * Math.sin(g);
      s += linea(x1, y, ax, ay, ia) + linea(x2, y, bx, by, ib);
      s += `<line x1="${r1(ax + 4)}" y1="${r1(Math.min(ay, by) - 4)}" x2="${r1(bx - 4)}" y2="${r1(Math.min(ay, by) - 4)}" style="stroke:var(--c-h)" stroke-width="2.5" stroke-dasharray="4 4"/>`;
    }
    return s;
  };
  const marca = (x, y, ok) => ok
    ? `<path d="M${x - 9} ${y}l6 7l12 -14" fill="none" style="stroke:var(--c-i)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`
    : `<path d="M${x - 8} ${y - 8}l16 16M${x + 8} ${y - 8}l-16 16" fill="none" style="stroke:var(--c-h)" stroke-width="4" stroke-linecap="round"/>`;
  const panel = (x0, titulo, predice, pie) => {
    const cx = x0 + 130;
    const filas = INTENTOS.map((ps, i) => {
      const y = 92 + i * 66, ok = predice || cierra(ps);
      return `${tallarin(x0 + 12, y - 16, ps)}${armado(x0 + 176, y + 14, ps, predice)}${marca(x0 + 244, y - 18, ok)}`;
    }).join('');
    return `<text x="${cx}" y="32" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      ${filas}
      ${pie.map((l, i) => `<text x="${cx}" y="${366 + i * 26}" text-anchor="middle" font-size="21" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 410" width="520" height="410" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="400" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', true, ['Cuatro intentos:', 'cuatro triángulos'])}
    ${panel(260, 'Lo que se mide', false, ['Cuatro intentos:', 'un solo triángulo'])}
  </svg>`;

  return {
    unidad: 'geometria.triangulos',
    titulo: '¿Por qué un tallarín partido en tres pedazos pocas veces arma un triángulo?',
    parrafos: [
      'Toma un tallarín crudo, marca en él dos puntos elegidos al azar y pártelo ahí, de modo que te queden tres pedazos. ' +
        'Después intenta armar un triángulo sobre la mesa, juntando los pedazos punta con punta. ' +
        'Si repites el experimento muchas veces, con los puntos siempre al azar, los pedazos forman un triángulo más o menos en una de cada cuatro veces.',
      'Antes de probar, casi todos esperan que el triángulo salga siempre, porque tres palitos parecen bastar para armarlo, y cuando no cierra, le echan la culpa al pulso o a un tallarín que se partió chueco. ' +
        'Pero el pulso no explica que los intentos fallidos se parezcan tanto: casi siempre, por más que muevas los pedazos, queda un hueco arriba que no se puede cerrar.',
      'Tres pedazos de un mismo tallarín no siempre cierran un triángulo, y el tallarín lo muestra en tres de cada cuatro intentos. ' +
        'Detrás de ese hueco hay reglas que todo triángulo cumple, sea grande o chico, y que atan sus lados, sus ángulos y las líneas que se trazan dentro de él. ' +
        'Esas reglas son el tema de esta unidad: los triángulos y sus líneas notables.',
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos dibujos con los mismos cuatro tallarines, cada uno partido en tres pedazos. Lo que predice: con los cuatro se arma un triángulo. Lo que se mide: solo con uno se arma; en los otros tres, los dos pedazos cortos no alcanzan a juntarse sobre el largo.',
    },
    pregunta: '¿Qué tiene que pasar con los largos de los tres pedazos para que se puedan juntar, punta con punta, y formar un triángulo?',
    ficha: {
      seLleva: 'Con tres largos cualesquiera no siempre se arma un triángulo: si un pedazo es demasiado largo, los otros dos no alcanzan a cerrarlo.',
      alcance: 'Sí, por deducción propia (espacio y forma; incertidumbre: un experimento que se repite y una proporción).',
      choque: 'Tres palitos parecen bastar para cualquier triángulo, y un tallarín partido al azar en tres arma un triángulo solo una de cada cuatro veces.',
      atajo: 'Culpar al pulso o a un corte chueco, que no explica que los intentos fallen siempre del mismo modo (los dos cortos no alcanzan sobre el largo). No se da la regla: la pregunta la pide y la idea 4 la mide con números.',
      porVerificar: [
        'Una de cada cuatro es la probabilidad exacta si los dos puntos de corte se eligen al azar, cada uno con la misma probabilidad en todo el tallarín (el problema del palo roto, conocido en la matemática desde el siglo XIX): es cálculo, no una medición propia. Con cortes en centímetros enteros de un tallarín de 20 cm sale una de cada cinco, y si se parte primero en dos y luego el pedazo más largo, cerca de cuatro de cada diez.',
        'Que el alumno pueda elegir los puntos «al azar» en la práctica: con dos sorteos (papelitos numerados, la calculadora) y no a ojo, que tiende a cortar cerca del medio y cierra más veces.',
      ],
      notas: [
        'La figura dibuja los mismos cuatro intentos en los dos paneles: arriba de cada fila, el tallarín partido; a la derecha, lo que se arma. En «Lo que predice», los triángulos que no pueden cerrar se dibujan cerrados a propósito, sin escala, porque es lo que se espera. En «Lo que se mide», el único que cierra está a escala y en los otros tres se marca con una raya el hueco entre los dos cortos.',
        'No se escribe ninguna medida de los pedazos: la figura no deja medir la respuesta de la idea 4 (la lámpara de 40 cm y 25 cm no aparece).',
        'Duda del escritor, decidida en la revisión (27 nov): el párrafo 2 decía que «los dos pedazos más cortos, apoyados en las puntas del más largo, no alcanzan a tocarse», que es casi la respuesta de la pregunta (los dos cortos juntos tienen que pasar al largo). Ahora dice solo lo que se ve, un hueco arriba que no se cierra, y deja que el alumno descubra qué largos lo causan; la figura sigue mostrando el hueco.',
        'Revisión del Escribidor Escribano (27 nov): «Lo que uno espera es lo contrario» no decía contrario de qué (de una de cada cuatro); ahora dice qué se espera. El párrafo 3 decía «Tres largos cualesquiera…», que es la fórmula de la regla; ahora habla de los pedazos del tallarín. Verificado en la web: el problema del palo roto da 1/4 con dos cortes uniformes; aparece en un examen de Cambridge de 1854 (fuentes secundarias; Wikipedia lo atribuye a Czuber, 1884), así que «desde el siglo XIX» se sostiene.',
      ],
    },
  };
})());
