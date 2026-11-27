/*
 * Apertura de «Puntos notables del triángulo» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * El choque es un experimento con papel: tres dobleces hechos a mano (cada esquina doblada por la mitad, lado sobre
 * lado) se cruzan en un solo punto, aunque tres rectas cualesquiera casi nunca lo hagan; y los dobleces de esquina
 * sobre esquina se cruzan en otro punto, así que el triángulo no tiene un solo centro. Lo que el alumno se lleva va en
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
  // Doblez de la esquina i: la recta hacia el incentro, girada `g` grados en «Lo que predice» (hecho a mano, sin cruzarse).
  const doblez = (i, g) => {
    const a = Math.atan2(I[1] - V[i][1], I[0] - V[i][0]) + g * Math.PI / 180;
    return [V[i], corte(i, [Math.cos(a), Math.sin(a)])];
  };
  const GIROS = [4, 3.5, 4.5];
  // Cruce de dos rectas (cada una dada por dos puntos).
  const cruce = ([p1, p2], [p3, p4]) => {
    const d = (p1[0] - p2[0]) * (p3[1] - p4[1]) - (p1[1] - p2[1]) * (p3[0] - p4[0]);
    const a = p1[0] * p2[1] - p1[1] * p2[0], b = p3[0] * p4[1] - p3[1] * p4[0];
    return [(a * (p3[0] - p4[0]) - (p1[0] - p2[0]) * b) / d, (a * (p3[1] - p4[1]) - (p1[1] - p2[1]) * b) / d];
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
    const cx = x0 + 130, P = ([x, y]) => `${r1(x0 + x)} ${r1(y)}`;
    const ds = [0, 1, 2].map(i => doblez(i, predice ? GIROS[i] : 0));
    const lineas = ds.map(([p, q]) => `<line x1="${r1(x0 + p[0])}" y1="${r1(p[1])}" x2="${r1(x0 + q[0])}" y2="${r1(q[1])}" stroke="currentColor" stroke-width="2.5" stroke-dasharray="8 5"/>`).join('');
    let centro;
    if (predice) {
      const c = [cruce(ds[0], ds[1]), cruce(ds[1], ds[2]), cruce(ds[2], ds[0])];
      centro = `<path d="M${c.map(P).join('L')}Z" style="fill:var(--muted)" fill-opacity=".55" stroke="currentColor" stroke-width="1.5"/>`;
    } else {
      centro = `<circle cx="${r1(x0 + I[0])}" cy="${r1(I[1])}" r="6" fill="currentColor"/>`;
    }
    return `<text x="${cx}" y="32" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      <path d="M${V.map(P).join('L')}Z" style="fill:var(--card)" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
      ${predice ? '' : [0, 1, 2].map(i => marca(i, x0)).join('')}
      ${lineas}${centro}
      ${pie.map((l, i) => `<text x="${cx}" y="${340 + i * 26}" text-anchor="middle" font-size="21" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 384" width="520" height="384" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="374" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', true, ['Tres dobleces a mano:', 'un triangulito'])}
    ${panel(260, 'Lo que se mide', false, ['Tres dobleces a mano:', 'un solo punto'])}
  </svg>`;

  return {
    unidad: 'geometria.puntos-notables',
    titulo: '¿Por qué tres dobleces hechos a mano en un triángulo de papel se cruzan en un solo punto?',
    parrafos: [
      'Recorta un triángulo de papel con los tres lados distintos y dobla cada esquina por la mitad, de modo que uno de sus lados quede justo encima del otro. ' +
        'Marca bien cada doblez y desdobla, hasta que en el papel queden tres rayas de doblez, una por esquina. ' +
        'Las tres rayas se cruzan en un mismo punto, sin dejar ningún triangulito entre ellas, aunque el triángulo sea chueco y los dobleces se hagan a mano.',
      'Tres rectas trazadas a mano casi nunca pasan por un mismo punto, porque lo normal es que se corten de dos en dos y dejen un triangulito en el medio. ' +
        'Se podría pensar que las rayas se cruzan en un punto porque ese punto es el centro del triángulo, pero si en otro triángulo igual llevas cada esquina encima de otra, los tres dobleces nuevos también apuntan a un solo punto, y ese punto no es el mismo.',
      'Dos clases de dobleces en el mismo papel dan dos puntos de cruce distintos, así que la palabra «centro» no alcanza para un triángulo. ' +
        'Esos puntos, dónde caen y qué tiene de especial cada uno, son el tema de esta unidad: los puntos notables del triángulo.',
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos dibujos del mismo triángulo de papel con las tres rayas de doblez que parten cada esquina por la mitad. Lo que predice: como tres rectas hechas a mano, se cortan de dos en dos y dejan un triangulito en el medio. Lo que se mide: las tres pasan por un solo punto.',
    },
    pregunta: 'Si el triángulo de papel tuviera sus tres lados iguales, ¿crees que el cruce de los dobleces de lado sobre lado y el de los dobleces de esquina sobre esquina quedarían separados o en el mismo sitio?',
    ficha: {
      seLleva: 'En cualquier triángulo, ciertas tres rectas se cruzan siempre en un solo punto, aunque tres rectas cualesquiera casi nunca lo hagan, y por eso un triángulo tiene más de un centro.',
      alcance: 'Parcial, por deducción propia (espacio y forma: comprobar una regularidad con un experimento y buscar su razón).',
      choque: 'Tres dobleces hechos a mano deberían dejar un triangulito, como tres rectas cualesquiera, y pasan por un solo punto.',
      atajo: '«Todos pasan por el centro del triángulo»: se descarta porque los dobleces de esquina sobre esquina también se cruzan en un punto, y es otro. Por qué se cruzan no se dice: es el tema.',
      porVerificar: [
        'Que con dobleces hechos con cuidado las tres rayas se crucen a simple vista en un punto (dentro de un milímetro, más o menos): es lo que dice la geometría (las bisectrices se cortan en el incentro), no una medición propia con papel.',
        'Que los dobleces de esquina sobre esquina (las mediatrices) también «apunten» a un punto: en un triángulo con una esquina abierta (obtusa), ese punto queda fuera del papel y hay que prolongar las rayas. El texto dice «apuntan» para no adelantar la Predice de la idea 2, que pregunta justo eso.',
      ],
      notas: [
        'La figura es el mismo triángulo en los dos paneles. En «Lo que predice», cada doblez está girado unos 4° respecto del de verdad, como si se hubiera hecho a mano sin que coincidan, y deja un triangulito sombreado. En «Lo que se mide», las tres rayas pasan por el incentro y las esquinas llevan dos arcos iguales en carmín (cada una partida por la mitad).',
        'Respuesta de la pregunta: en el triángulo de lados iguales, los dos puntos coinciden. La idea 6 (la recta de Euler) y su misión trabajan el caso de dos lados iguales, en que los centros quedan en una recta sin juntarse; la pregunta no lo toca.',
        'Revisión del Escribidor Escribano (27 nov): «estas rayas coinciden» decía que las rayas son la misma raya; lo que coincide es el cruce. El párrafo 3 enunciaba la regla de la unidad («cada centro es el punto donde se cruzan tres rectas de una misma clase»); ahora deja el choque del caso, dos cruces en un mismo papel. La pregunta tenía un inciso apretado («el de cada clase de doblez»); ahora nombra las dos clases.',
      ],
    },
  };
})());
