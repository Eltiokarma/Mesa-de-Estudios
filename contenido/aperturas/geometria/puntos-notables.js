/*
 * Apertura de «Puntos notables del triángulo» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * El choque es un experimento con papel: los tres dobleces de lado sobre lado (cada esquina doblada por la mitad) se
 * cruzan en un punto que parece el centro, y los dobleces de esquina sobre esquina se cruzan en otro punto, así que el
 * triángulo no tiene un solo centro (doble revisión, 27 nov). Lo que el alumno se lleva va en
 * ficha.seLleva. Se eligieron los dobleces de lado sobre lado porque se cruzan siempre dentro del papel: los de esquina
 * sobre esquina pueden cruzarse fuera, que es la Predice de la idea 2. No se adelanta la Predice de la idea 1 (el punto
 * de equilibrio, a 8 cm de A en una mediana de 12 cm: aquí no hay medianas ni equilibrio), la de la idea 3 (la pileta
 * en el parque de 7 m, 8 m y 9 m) ni la de la idea 6 (O, G y H en una recta), y no se escribe ningún número de las
 * respuestas o las misiones. Colores (cabecera de contenido/teoria/geometria/puntos-notables.js): los dobleces y el
 * punto en tinta; la marca de las esquinas partidas en dos, en carmín (c-h), como los ángulos de la unidad.
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const r1 = n => Math.round(n * 10) / 10;

  // El mismo triángulo de papel en los dos paneles, con los tres lados distintos y las tres esquinas agudas.
  const V = [[18, 300], [244, 300], [86, 76]];
  const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
  // Incentro: el promedio de las esquinas pesado por el lado de enfrente.
  const lados = [dist(V[1], V[2]), dist(V[0], V[2]), dist(V[0], V[1])], per = lados[0] + lados[1] + lados[2];
  const I = [0, 1].map(k => (lados[0] * V[0][k] + lados[1] * V[1][k] + lados[2] * V[2][k]) / per);
  // Dónde corta el lado de enfrente la recta que sale de la esquina i en la dirección d.
  const corte = (i, d) => {
    const p = V[i], q = V[(i + 1) % 3], s = V[(i + 2) % 3];
    const ex = s[0] - q[0], ey = s[1] - q[1], den = d[0] * ey - d[1] * ex;
    const t = ((q[0] - p[0]) * ey - (q[1] - p[1]) * ex) / den;
    return [p[0] + t * d[0], p[1] + t * d[1]];
  };
  // Doblez de la esquina i (lado sobre lado): la recta de la esquina hacia el incentro, hasta el lado de enfrente.
  const doblez = i => {
    const a = Math.atan2(I[1] - V[i][1], I[0] - V[i][0]);
    return [V[i], corte(i, [Math.cos(a), Math.sin(a)])];
  };
  // Circuncentro: el punto que queda a la misma distancia de las tres esquinas (cruce de los dobleces de esquina sobre esquina).
  const O = (() => {
    const [[ax, ay], [bx, by], [cx, cy]] = V, d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by));
    const a2 = ax * ax + ay * ay, b2 = bx * bx + by * by, c2 = cx * cx + cy * cy;
    return [(a2 * (by - cy) + b2 * (cy - ay) + c2 * (ay - by)) / d, (a2 * (cx - bx) + b2 * (ax - cx) + c2 * (bx - ax)) / d];
  })();
  // Doblez de esquina sobre esquina para el lado j (de V[j] a V[j+1]): pasa por el punto medio del lado y por `hacia`.
  // En «Lo que se mide», `hacia` es O y el doblez es perpendicular al lado; en «Lo que predice» se dibuja yendo al
  // mismo punto que los otros dobleces, que es lo que se espera. Se dibuja larga y se recorta con el papel.
  const doblez2 = (j, hacia) => {
    const p = V[j], q = V[(j + 1) % 3], m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    const dx = hacia[0] - m[0], dy = hacia[1] - m[1], n = Math.hypot(dx, dy);
    return [m, [m[0] + dx / n * 400, m[1] + dy / n * 400]];
  };
  // Marca de esquina partida en dos: dos arcos chicos iguales, uno a cada lado del doblez.
  const marca = (i, x0) => {
    const p = V[i], q = V[(i + 1) % 3], s = V[(i + 2) % 3], r = 24;
    const ang = u => Math.atan2(u[1] - p[1], u[0] - p[0]);
    const a1 = ang(q), a2 = ang(s), am = Math.atan2(I[1] - p[1], I[0] - p[0]);
    const arco = (u, v, rr) => {
      const P = a => `${r1(x0 + p[0] + rr * Math.cos(a))} ${r1(p[1] + rr * Math.sin(a))}`;
      let d = v - u; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
      return `<path d="M${P(u)}A${rr} ${rr} 0 0 ${d > 0 ? 1 : 0} ${P(u + d)}" fill="none" style="stroke:var(--c-h)" stroke-width="2.5"/>`;
    };
    return arco(a1, am, r) + arco(am, a2, r - 5);
  };
  const panel = (x0, titulo, predice, pie) => {
    const cx = x0 + 130, P = ([x, y]) => `${r1(x0 + x)} ${r1(y)}`, id = predice ? 'papel-p' : 'papel-m';
    const linea = ([p, q], estilo) => `<line x1="${r1(x0 + p[0])}" y1="${r1(p[1])}" x2="${r1(x0 + q[0])}" y2="${r1(q[1])}" ${estilo}/>`;
    const lado = [0, 1, 2].map(i => linea(doblez(i), 'stroke="currentColor" stroke-width="2.5" stroke-dasharray="8 5"')).join('');
    const esquina = [0, 1, 2].map(j => linea(doblez2(j, predice ? I : O), 'style="stroke:var(--muted)" stroke-width="3.5" stroke-dasharray="2 6" stroke-linecap="round"')).join('');
    const punto = (c, estilo) => `<circle cx="${r1(x0 + c[0])}" cy="${r1(c[1])}" r="7" ${estilo}/>`;
    const puntos = predice ? punto(I, 'fill="currentColor"')
      : punto(I, 'fill="currentColor"') + punto(O, 'style="fill:var(--card);stroke:currentColor" stroke-width="3"');
    return `<text x="${cx}" y="32" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      <clipPath id="${id}"><path d="M${V.map(P).join('L')}Z"/></clipPath>
      <path d="M${V.map(P).join('L')}Z" style="fill:var(--card)" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
      ${[0, 1, 2].map(i => marca(i, x0)).join('')}
      ${lado}<g clip-path="url(#${id})">${esquina}</g>${puntos}
      ${pie.map((l, i) => `<text x="${cx}" y="${340 + i * 26}" text-anchor="middle" font-size="21" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 384" width="520" height="384" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="374" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', true, ['Dos clases de doblez:', 'un solo centro'])}
    ${panel(260, 'Lo que se mide', false, ['Dos clases de doblez:', 'dos puntos distintos'])}
  </svg>`;

  return {
    unidad: 'geometria.puntos-notables',
    titulo: '¿Dónde queda el centro de un triángulo de papel?',
    parrafos: [
      'Recorta un triángulo de papel con los tres lados distintos y dobla cada esquina por la mitad, de modo que uno de sus lados quede justo encima del otro. ' +
        'Al desdoblar quedan tres rayas de doblez, una por esquina, y las tres se cruzan en un mismo punto, que parece el centro del triángulo.',
      'Lo natural es pensar que un triángulo tiene un solo centro, como un círculo, y que otra manera pareja de doblarlo llevaría al mismo sitio. ' +
        'Pruébalo con una copia del mismo triángulo: dobla de modo que una esquina quede encima de otra, y repite con cada par de esquinas. ' +
        'Los tres dobleces nuevos también se cruzan en un solo punto, pero ese punto no es el mismo: queda en otro sitio.',
      'Un mismo triángulo tiene por lo menos dos puntos que podrían llamarse su centro, y cada uno sale de una clase distinta de doblez. ' +
        'Esos puntos, dónde caen y qué tiene de especial cada uno, son el tema de esta unidad: los puntos notables del triángulo.',
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos dibujos del mismo triángulo de papel, con los dobleces de lado sobre lado en raya y los de esquina sobre esquina en puntos. Lo que predice: las dos clases de doblez llegan al mismo centro. Lo que se mide: los dobleces de lado sobre lado se cruzan en un punto y los de esquina sobre esquina, en otro.',
    },
    pregunta: 'Si el triángulo de papel tuviera sus tres lados iguales, ¿crees que el cruce de los dobleces de lado sobre lado y el de los dobleces de esquina sobre esquina quedarían separados o en el mismo sitio?',
    ficha: {
      seLleva: 'Un triángulo no tiene un solo centro: dos maneras parejas de doblarlo dan dos puntos de cruce distintos, y cada uno tiene su nombre.',
      alcance: 'Parcial, por deducción propia (espacio y forma: comprobar una regularidad con un experimento y buscar su razón).',
      choque: 'Se espera que un triángulo tenga un solo centro, como un círculo, y dos clases de doblez dan dos puntos distintos en el mismo papel.',
      atajo: '«Todos los dobleces pasan por el centro del triángulo»: se descarta porque los dobleces de esquina sobre esquina se cruzan en otro punto. Por qué cada clase de doblez se cruza en un solo punto no se dice: es el tema.',
      porVerificar: [
        'Que con dobleces hechos con cuidado las tres rayas se crucen a simple vista en un punto (dentro de un milímetro, más o menos): es lo que dice la geometría (las bisectrices se cortan en el incentro), no una medición propia con papel.',
        'Que los dobleces de esquina sobre esquina (las mediatrices) se crucen en un punto: en un triángulo con una esquina abierta (obtusa), ese punto queda fuera del papel y hay que prolongar las rayas. El texto dice «en otro sitio», sin «del papel», porque el alumno recorta un triángulo cualquiera; no dice dentro ni fuera, para no adelantar la Predice de la idea 2, que pregunta justo eso. El triángulo de la figura tiene las tres esquinas agudas.',
      ],
      notas: [
        'La figura es el mismo triángulo en los dos paneles, con las esquinas partidas por la mitad (dos arcos iguales en carmín) y los dobleces de lado sobre lado en raya. Los de esquina sobre esquina van en puntos grises: en «Lo que predice» se dibujan yendo al mismo punto (lo que se espera, no lo que pasa); en «Lo que se mide» son las mediatrices de verdad y se cruzan en el circuncentro, un punto hueco aparte del incentro.',
        'Doble revisión (27 nov): la versión anterior ponía como predicción que tres dobleces a mano dejarían un triangulito, como tres rectas cualesquiera. Nadie que dobla un triángulo espera eso: lo que espera es que se crucen en el centro, y eso pasa. El choque honesto es el otro, que ya estaba en el párrafo 3: hay más de un centro. Ahora el título, la figura, el párrafo 2 y la ficha cuentan ese choque, con el mismo triángulo y solo la clase de doblez cambiada. Se quitó «aunque los dobleces se hagan a mano», que prometía un cruce exacto que un doblez a mano no da.',
        'Respuesta de la pregunta: en el triángulo de lados iguales, los dos puntos coinciden. La idea 6 (la recta de Euler) y su misión trabajan el caso de dos lados iguales, en que los centros quedan en una recta sin juntarse; la pregunta no lo toca.',
        'Revisión del Escribidor Escribano (27 nov): «estas rayas coinciden» decía que las rayas son la misma raya; lo que coincide es el cruce. El párrafo 3 enunciaba la regla de la unidad («cada centro es el punto donde se cruzan tres rectas de una misma clase»); ahora deja el choque del caso, dos cruces en un mismo papel. La pregunta tenía un inciso apretado («el de cada clase de doblez»); ahora nombra las dos clases.',
      ],
    },
  };
})());
