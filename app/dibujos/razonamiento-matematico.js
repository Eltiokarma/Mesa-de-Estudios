// Dibujos de las unidades de razonamiento matemático (receta en app/dibujos/comun.js). Cada uno dice su idea en una frase.
(function (root) {
'use strict';
const D = root.Dibujos;
const rad = g => g * Math.PI / 180;
const sobre = (cx, cy, r, g) => [cx + r * Math.cos(rad(g)), cy - r * Math.sin(rad(g))];
const poli = (P, pts, c = 'b') => P.p('M' + pts.map(([x, y]) => `${P.n(x)} ${P.n(y)}`).join('L') + 'Z', c);
// Engranaje de n dientes y radio medio r, girado «giro» grados.
const engranaje = (P, cx, cy, r, n, c, giro = 0) => {
  const a = 360 / n, pts = [];
  for (let k = 0; k < n; k++) {
    const b = giro + k * a;
    pts.push(sobre(cx, cy, r - 4, b), sobre(cx, cy, r + 4, b + a * 0.14), sobre(cx, cy, r + 4, b + a * 0.4), sobre(cx, cy, r - 4, b + a * 0.54));
  }
  return poli(P, pts, c);
};
// Fósforo: palito y cabeza.
const fosforo = (P, x1, y1, x2, y2, c = 'tn') => P.l([[x1, y1], [x2, y2]]) + P.c(x2, y2, 4.5, c);

D.registrar('razonamiento-matematico', {
  // El parentesco se deduce recorriendo el árbol: dos nietos de los mismos abuelos son primos.
  'razonamiento-matematico.razonamiento-deductivo': P =>
    P.l([[62, 22], [98, 22]], 'd') + P.l([[80, 22], [80, 40], [36, 40], [36, 52]], 'd') + P.l([[80, 40], [124, 40], [124, 52]], 'd')
    + P.l([[36, 70], [36, 86]], 'd') + P.l([[124, 70], [124, 86]], 'd') + P.ac('M36 86V40H124V86')
    + P.c(62, 22, 10, 'b') + P.c(98, 22, 10, 'b') + P.c(36, 60, 10, 'b') + P.c(124, 60, 10, 'b') + P.c(36, 98, 10, 'a') + P.c(124, 98, 10, 'a'),
  // Una figura se dibuja de un solo trazo si el lápiz nunca se levanta.
  'razonamiento-matematico.trazos-y-perimetros': P =>
    P.p('M40 106V58H120V106ZM40 58L80 22L120 58M40 58L120 106M120 58L40 106', 'd')
    + P.ac('M40 106V58H120L40 106H120') + P.punta(124, 106, 0, 'tn') + P.c(40, 106, 6, 'a'),
  // En la mesa redonda, cada lugar se ubica respecto de otro: a su derecha, frente a él.
  'razonamiento-matematico.ordenamiento-de-informacion': P => {
    const sillas = [90, 150, 210, 270, 330, 30].map(g => sobre(80, 62, 42, g));
    return P.c(80, 62, 26, 'm') + sillas.map((p, i) => P.c(...p, 9, i === 0 ? 'a' : 'b')).join('')
      + P.ac(P.arco(80, 62, 56, 98, 142)) + P.punta(...sobre(80, 62, 56, 144), -234, 'tn') + P.l([sillas[0], sillas[3]], 'g');
  },
  // Si uno miente, el otro dice la verdad: se supone y se comprueba.
  'razonamiento-matematico.verdades-y-mentiras': P => {
    const persona = x => P.p(`M${x - 18} 114Q${x - 18} 92 ${x} 92Q${x + 18} 92 ${x + 18} 114`, 'b') + P.c(x, 80, 10, 'b');
    const globo = (x, c, letra) => P.p(`M${x - 28} 18H${x + 28}a6 6 0 0 1 6 6V52a6 6 0 0 1-6 6H${x + 6}L${x - 2} 68L${x - 4} 58H${x - 28}a6 6 0 0 1-6-6V24a6 6 0 0 1 6-6Z`, c) + P.t(x, 47, letra, 22);
    return persona(40) + persona(120) + globo(40, 'b', 'V') + globo(120, 'a', 'F');
  },
  // Los tramos se siguen con la brújula; la distancia es la recta del inicio al fin.
  'razonamiento-matematico.traslados-y-puntos-cardinales': P =>
    P.l([[132, 20], [132, 50]], 'd') + P.l([[118, 36], [146, 36]], 'f') + P.punta(132, 16, -90, 'tn') + P.t(132, 64, 'N', 15)
    + P.l([[22, 104], [96, 28]], 'g') + P.ac('M22 104V64H64V28H96') + P.c(22, 104, 6, 'tn') + P.c(96, 28, 6, 'a'),
  // En el cuadrado mágico, filas, columnas y diagonales suman lo mismo.
  'razonamiento-matematico.arreglos-numericos': P => {
    const nums = [2, 7, 6, 9, 5, 1, 4, 3, 8];
    return nums.map((v, i) => { const x = 18 + (i % 3) * 27, y = 20 + Math.floor(i / 3) * 27;
      return P.r(x, y, 27, 27, i === 4 ? 'a' : 'b', 2) + P.t(x + 13.5, y + 20, v, 17); }).join('')
      + P.l([[106, 60], [124, 60]], 'd') + P.punta(128, 60, 0, 'tn') + P.t(146, 66, '15', 17);
  },
  // Se prueban casos chicos, se mira cómo crece y se generaliza: 4, 7, 10…
  'razonamiento-matematico.razonamiento-inductivo': P => {
    const fila = (y, k, nuevo) => {
      let s = '';
      for (let i = 0; i < k; i++) {
        const x = 14 + i * 22, d = `M${x} ${y}H${x + 22}M${x} ${y + 22}H${x + 22}` + (i === 0 ? `M${x} ${y}V${y + 22}` : '') + `M${x + 22} ${y}V${y + 22}`;
        s += nuevo && i === k - 1 ? P.ac(`M${x} ${y}H${x + 22}V${y + 22}H${x}`) : P.p(d);
      }
      return s;
    };
    return fila(10, 1) + fila(46, 2) + fila(82, 3, true) + P.t(150, 28, '4', 16, 'end') + P.t(150, 64, '7', 16, 'end') + P.t(150, 100, '10', 16, 'end');
  },
  // Dominó, dados y fósforos: juegos con reglas fijas que se razonan.
  'razonamiento-matematico.juegos-recreativos': P =>
    P.r(18, 14, 42, 92, 'b', 8) + P.l([[24, 60], [54, 60]], 'd') + [[28, 24], [39, 37], [50, 50]].map(([x, y]) => P.c(x, y, 4, 'tn')).join('')
    + [[28, 70], [50, 70], [39, 83], [28, 96], [50, 96]].map(([x, y]) => P.c(x, y, 4, 'tn')).join('')
    + fosforo(P, 82, 104, 140, 104) + fosforo(P, 84, 98, 108, 58) + P.l([[138, 98], [114, 58]], 'g')
    + fosforo(P, 120, 44, 148, 20, 'a'),
  // El ángulo entre las agujas sale de dónde está cada una a esa hora.
  'razonamiento-matematico.cronometria-y-calendarios': P => {
    const [hx, hy] = sobre(58, 60, 26, 30), [mx, my] = sobre(58, 60, 38, 90);
    return P.c(58, 60, 46, 'b') + [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(g => P.l([sobre(58, 60, 46, g), sobre(58, 60, 40, g)], 'f')).join('')
      + P.p(`M58 60${P.arco(58, 60, 22, 30, 90).replace(/^M/, 'L')}Z`, 'a') + P.l([[58, 60], [hx, hy]]) + P.l([[58, 60], [mx, my]], 'd') + P.c(58, 60, 4, 'tn')
      + P.r(114, 62, 38, 42, 'b', 4) + P.r(114, 62, 38, 12, 'm', 4) + P.l([[124, 56], [124, 66]], 'd') + P.l([[142, 56], [142, 66]], 'd')
      + [0, 1, 2].map(i => [0, 1, 2].map(j => P.c(122 + j * 11, 82 + i * 9, 2, i === 1 && j === 1 ? 'tn' : 'm')).join('')).join('');
  },
  // Para tener certeza se cuenta el peor caso: todas las que no sirven, y una más.
  'razonamiento-matematico.certezas': P =>
    P.p('M14 52V100a6 6 0 0 0 6 6H84a6 6 0 0 0 6-6V52', 'b') + [[30, 92, 'm'], [50, 92, 'b'], [70, 92, 'm'], [40, 74, 'b'], [60, 74, 'a'], [76, 72, 'b']].map(([x, y, c]) => P.c(x, y, 8, c)).join('')
    + P.p('M94 44Q108 24 118 24', 'd') + P.punta(121, 24, 0, 'tn') + [24, 46, 68].map(y => P.c(136, y, 9, 'b')).join('') + P.c(136, 96, 10, 'a')
    + P.l([[124, 82], [148, 82]], 'g'),
  // Una pastilla cada 8 horas: se cuentan las tomas, que son una más que los intervalos.
  'razonamiento-matematico.frecuencia-de-sucesos': P => {
    const xs = [18, 49, 80, 111, 142];
    return P.l([[10, 86], [150, 86]], 'd') + xs.map(x => P.l([[x, 80], [x, 92]], 'd')).join('')
      + xs.slice(0, 4).map(x => P.p(`M${x} 74Q${x + 15.5} 50 ${x + 31} 74`, 'f')).join('')
      + xs.map((x, i) => P.r(x - 6, 26, 12, 30, i === 0 ? 'a' : 'b', 6) + P.l([[x - 6, 41], [x + 6, 41]], 'f')).join('') + P.t(33, 112, '8 h', 14);
  },
  // Dos engranajes en contacto giran en sentidos contrarios; el chico da más vueltas.
  'razonamiento-matematico.ruedas-poleas-engranajes': P =>
    engranaje(P, 52, 62, 36, 12, 'b') + engranaje(P, 110, 62, 20, 7, 'a', 13) + P.c(52, 62, 6, 'tn') + P.c(110, 62, 4, 'tn')
    + P.p(P.arco(52, 62, 47, 110, 165), 'd') + P.punta(...sobre(52, 62, 47, 167), -257, 'tn')
    + P.p(P.arco(110, 62, 31, 70, 15), 'd') + P.punta(...sobre(110, 62, 31, 13), 77, 'tn'),
  // El camino más corto que toca la orilla se halla reflejando el destino.
  'razonamiento-matematico.maximos-y-minimos': P =>
    P.r(-4, 80, 168, 44, 'm', 0) + P.l([[0, 80], [160, 80]], 'd') + P.l([[130, 50], [130, 110]], 'f') + P.l([[90.5, 80], [130, 110]], 'g')
    + P.ac('M30 34L90.5 80L130 50') + P.c(30, 34, 6, 'tn') + P.c(130, 50, 6, 'tn') + P.c(130, 110, 6, 'b') + P.c(90.5, 80, 5, 'a'),
  // La balanza compara: el platillo más pesado baja.
  'razonamiento-matematico.cortes-y-pesadas': P =>
    P.p('M60 106L66 98H94L100 106Z', 'b') + P.l([[80, 98], [80, 30]]) + P.l([[30, 38], [130, 22]])
    + P.l([[18, 76], [30, 38], [42, 76]], 'f') + P.l([[118, 62], [130, 22], [142, 62]], 'f')
    + P.r(20, 58, 20, 18, 'a', 3) + P.r(116, 48, 11, 14, 'b', 2) + P.r(129, 46, 11, 16, 'b', 2)
    + P.p('M8 76H52Q46 90 30 90Q14 90 8 76Z', 'b') + P.p('M108 62H152Q146 76 130 76Q114 76 108 62Z', 'b') + P.c(80, 30, 5, 'tn'),
  // Del enunciado a la ecuación: lo que no se conoce se vuelve x.
  'razonamiento-matematico.planteo-de-ecuaciones': P =>
    P.p('M18 10H134a6 6 0 0 1 6 6V40a6 6 0 0 1-6 6H62L50 58L48 46H18a6 6 0 0 1-6-6V16a6 6 0 0 1 6-6Z', 'b')
    + P.l([[24, 22], [124, 22]], 'f') + P.l([[24, 34], [96, 34]], 'f') + P.r(16, 76, 28, 30, 'a', 6) + P.t(30, 98, 'x', 20)
    + P.t(90, 98, '+ 3 = 8', 20),
  // Un cuadrado que vuelca: su esquina dibuja arcos de circunferencia.
  'razonamiento-matematico.transformaciones-de-figuras': P =>
    P.l([[6, 100], [154, 100]], 'd') + P.r(14, 70, 30, 30, 'b', 2) + P.r(44, 70, 30, 30, 'g', 2) + P.r(104, 70, 30, 30, 'm', 2)
    + P.ac('M14 70A42.43 42.43 0 0 1 74 70A30 30 0 0 1 104 100') + P.c(14, 70, 5, 'tn') + P.c(74, 70, 4, 'b') + P.c(104, 100, 6, 'a'),
  // Por las calles, el camino más corto de A a B solo avanza y sube.
  'razonamiento-matematico.rutas-y-visualizacion-espacial': P => {
    let s = '';
    for (let i = 0; i < 4; i++) s += P.l([[24, 24 + i * 24], [136, 24 + i * 24]], 'd');
    for (let j = 0; j < 5; j++) s += P.l([[24 + j * 28, 24], [24 + j * 28, 96]], 'd');
    return s + P.ac('M24 96H80V48H136V24') + P.c(24, 96, 6, 'tn') + P.c(136, 24, 7, 'a');
  },
  // Un eje que no empieza en cero agranda las diferencias: hay que leer la escala.
  'razonamiento-matematico.tablas-graficos-y-suficiencia': P =>
    P.l([[26, 12], [26, 84]], 'd') + P.l([[26, 84], [20, 89], [32, 94], [26, 99], [26, 106]], 'd') + P.l([[20, 106], [150, 106]], 'd')
    + [[40, 52], [70, 30], [100, 70], [128, 44]].map(([x, y], i) => P.r(x, y, 20, 106 - y, i === 1 ? 'a' : 'b', 2)).join('')
    + P.l([[22, 30], [30, 30]], 'd') + P.l([[22, 70], [30, 70]], 'd'),
  // El diagrama de flujo repite el bucle hasta que la condición se cumple.
  'razonamiento-matematico.diagramas-de-flujo': P =>
    '<ellipse class="b" cx="66" cy="14" rx="24" ry="9"/>' + P.l([[66, 23], [66, 32]], 'd') + P.punta(66, 35, 90, 'tn')
    + P.r(40, 36, 52, 20, 'b', 4) + P.l([[66, 56], [66, 64]], 'd') + P.punta(66, 67, 90, 'tn')
    + poli(P, [[66, 68], [94, 84], [66, 100], [38, 84]], 'a') + P.l([[66, 100], [66, 114]], 'd')
    + P.ac('M94 84H130V46H100') + P.punta(96, 46, 180, 'tn'),
});
})(typeof self !== 'undefined' ? self : this);
