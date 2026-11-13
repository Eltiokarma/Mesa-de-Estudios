// Dibujos de las unidades de álgebra (receta en app/dibujos/comun.js). Cada uno dice su idea en una frase.
(function (root) {
'use strict';
const D = root.Dibujos;
const ang = (x1, y1, x2, y2) => Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
// Recta numérica con flechas en los dos extremos.
const recta = (P, y) => P.l([[12, y], [148, y]], 'd') + P.punta(152, y, 0, 'tn') + P.punta(8, y, 180, 'tn');

D.registrar('algebra', {
  // «Si está en A, está en B»: A vive dentro de B.
  'algebra.logica-y-conjuntos': P =>
    P.c(86, 60, 48, 'b') + P.c(70, 70, 24, 'a') + P.t(70, 77, 'A', 20) + P.t(116, 40, 'B', 20),
  // Un intervalo es un trozo de la recta: un extremo entra y el otro no.
  'algebra.numeros-reales': P =>
    recta(P, 66) + P.ac('M44 66H116') + P.c(44, 66, 7, 'tn') + P.c(116, 66, 7, 'b')
    + P.t(44, 98, 'a', 18) + P.t(116, 98, 'b', 18) + P.t(44, 44, '[', 26) + P.t(116, 44, ')', 26),
  // (a + b)² son cuatro piezas: a², dos veces ab y b².
  'algebra.exponentes-y-productos-notables': P =>
    P.r(34, 12, 62, 62, 'b', 2) + P.r(96, 12, 28, 62, 'a', 2) + P.r(34, 74, 62, 28, 'a', 2) + P.r(96, 74, 28, 28, 'm', 2)
    + P.t(65, 50, 'a²', 20) + P.t(110, 94, 'b²', 14) + P.t(110, 47, 'ab', 14) + P.t(65, 93, 'ab', 14)
    + P.t(65, 117, 'a', 15) + P.t(110, 117, 'b', 15),
  // Las raíces de la cuadrática: donde la parábola corta el eje.
  'algebra.ecuaciones-lineales-y-cuadraticas': P =>
    P.ejes(30, 70, 10, 152, 8, 112) + P.p(P.curva(x => 70 - 30 / 1024 * (x - 56) * (x - 120), 38, 138))
    + P.c(56, 70, 6, 'a') + P.c(120, 70, 6, 'a'),
  // Puntos críticos: el signo cambia de tramo en tramo.
  'algebra.inecuaciones': P =>
    recta(P, 70) + P.p(P.curva(x => 70 - 0.039 * (x - 56) * (x - 104), 36, 124), 'g')
    + P.ac('M56 70H104') + P.c(56, 70, 6, 'b') + P.c(104, 70, 6, 'b')
    + P.t(24, 42, '+', 26) + P.t(80, 92, '−', 26) + P.t(136, 42, '+', 26),
  // El valor absoluto es distancia: la gráfica en V.
  'algebra.valor-absoluto-y-radicales': P =>
    P.ejes(80, 102, 10, 150, 8, 112) + P.l([[44, 66], [116, 66]], 'g') + P.ac('M26 48L80 102L134 48')
    + P.c(44, 66, 5, 'b') + P.c(116, 66, 5, 'b') + P.t(120, 30, '|x|', 18),
  // Un polinomio se ordena por grados: cubo, cuadrado, barra y unidad.
  'algebra.polinomios': P =>
    P.r(10, 50, 32, 32, 'a', 1) + P.p('M10 50L22 38H54L42 50Z', 'm') + P.p('M42 50L54 38V70L42 82Z', 'm')
    + P.r(66, 50, 32, 32, 'b', 1) + P.r(110, 50, 9, 32, 'b', 1) + P.r(132, 73, 9, 9, 'b', 1)
    + P.t(30, 106, 'x³', 17) + P.t(82, 106, 'x²', 17) + P.t(114, 106, 'x', 17) + P.t(137, 106, '1', 17),
  // Ruffini: bajar, multiplicar y sumar; lo último es el resto.
  'algebra.division-de-polinomios': P =>
    P.l([[42, 16], [42, 104]], 'd') + P.l([[42, 72], [152, 72]], 'd') + P.r(124, 78, 26, 24, 'a', 4)
    + [['1', '0', '−7', '6'], ['', '1', '1', '−6'], ['1', '1', '−6', '0']].map((fila, i) =>
      fila.map((s, j) => (s ? P.t(58 + j * 26, [36, 62, 96][i], s, 15) : '')).join('')).join('')
    + P.t(26, 62, '1', 15) + P.l([[62, 84], [80, 66]], 'f'),
  // Factorizar es armar un rectángulo con las piezas: x² + 5x + 6.
  'algebra.factorizacion': P => {
    let s = P.r(26, 14, 44, 44, 'b d', 1);
    for (let k = 0; k < 3; k++) s += P.r(70 + k * 13, 14, 13, 44, 'm d', 1);
    for (let k = 0; k < 2; k++) s += P.r(26, 58 + k * 13, 44, 13, 'm d', 1);
    for (let i = 0; i < 2; i++) for (let j = 0; j < 3; j++) s += P.r(70 + j * 13, 58 + i * 13, 13, 13, 'a d', 1);
    return s + P.r(26, 14, 83, 70, '', 2) + P.t(68, 106, 'x + 3', 17) + P.t(114, 55, 'x + 2', 17, 'start');
  },
  // Una ecuación de grado 3 tiene hasta tres raíces: tres cortes con el eje.
  'algebra.ecuaciones-polinomiales': P =>
    P.ejes(18, 64, 10, 152, 8, 112) + P.p(P.curva(x => 64 - 0.00094 * (x - 36) * (x - 80) * (x - 124), 26, 136))
    + [36, 80, 124].map(x => P.c(x, 64, 6, 'a')).join(''),
  // La función es una máquina: a cada x le toca un solo valor.
  'algebra.funciones': P =>
    P.p('M64 34L56 18H104L96 34', 'b') + P.r(52, 34, 56, 50, 'a', 10) + P.t(80, 68, 'f', 28)
    + P.l([[12, 60], [42, 60]], 'd') + P.punta(48, 60, 0) + P.l([[112, 60], [142, 60]], 'd') + P.punta(148, 60, 0)
    + P.t(24, 50, 'x', 18) + P.t(132, 50, 'y', 18) + P.c(70, 92, 5, 'tn') + P.c(90, 92, 5, 'tn'),
  // La inversa es el reflejo de la gráfica en la recta y = x.
  'algebra.tipos-de-funciones-e-inversa': P => {
    const f = [], g = [];
    for (let x = 30; x <= 110; x += 2) { const y = 100 - (x - 30) ** 2 / 80; f.push([x, y]); g.push([30 + 100 - y, 100 - (x - 30)]); }
    return P.ejes(30, 100, 12, 150, 8, 112) + P.l([[30, 100], [124, 6]], 'g') + P.l(f) + P.ac(P.l(g).match(/d="([^"]+)"/)[1])
      + P.l([[90, 55], [75, 40]], 'f') + P.c(90, 55, 5, 'b') + P.c(75, 40, 5, 'a');
  },
  // Cada escalón multiplica por la base: la escalera de potencias.
  'algebra.exponenciales-y-logaritmos': P =>
    P.l([[10, 104], [150, 104]], 'd') + [8, 16, 32, 64].map((h, i) => P.r(20 + i * 32, 104 - h, 26, h, i === 3 ? 'a' : 'b', 3)).join('')
    + P.p(P.curva(x => 104 - 8 * 2 ** ((x - 33) / 32), 12, 146), 'g') + P.t(24, 30, '×2', 18, 'start'),
  // Multiplicar por i gira la flecha 90°.
  'algebra.numeros-complejos': P =>
    P.ejes(64, 82, 10, 152, 8, 114) + P.l([[64, 82], [118, 57]]) + P.punta(124, 54, ang(64, 82, 124, 54))
    + P.ac('M64 82L39 28') + P.punta(36, 22, ang(64, 82, 36, 22)) + P.p(P.arco(64, 82, 24, 25, 115), 'd')
    + P.t(84, 50, '90°', 14) + P.t(132, 46, 'z', 17) + P.t(14, 24, 'iz', 17, 'start'),
  // La matriz identidad: unos en la diagonal, ceros en el resto.
  'algebra.matrices-y-determinantes': P =>
    `<g transform="rotate(38.66 80 60)">${P.r(30, 49, 100, 22, 'a', 11)}</g>`
    + P.p('M30 16H20V104H30', '') + P.p('M130 16H140V104H130', '')
    + [36, 60, 84].map((y, i) => [50, 80, 110].map((x, j) => P.t(x, y + 7, i === j ? '1' : '0', 20)).join('')).join(''),
  // La solución del sistema es el punto donde se cruzan las dos rectas.
  'algebra.sistemas-de-ecuaciones': P =>
    P.ejes(20, 106, 12, 152, 8, 114) + P.l([[20, 96], [150, 30]]) + P.l([[24, 24], [150, 100]], 'd')
    + P.l([[87, 66], [87, 106]], 'g') + P.l([[20, 62], [81, 62]], 'g') + P.c(87, 62, 7, 'a'),
  // El mejor valor está en un vértice de la región factible.
  'algebra.programacion-lineal': P =>
    P.ejes(20, 104, 10, 152, 8, 114) + P.p('M20 104V40L78 28L128 62L140 104Z', 'm')
    + P.l([[104, 26], [152, 98]], 'g') + P.c(20, 40, 4.5, 'tn') + P.c(78, 28, 4.5, 'tn') + P.c(140, 104, 4.5, 'tn')
    + P.c(128, 62, 7, 'a'),
  // Sumar la mitad, la cuarta, la octava…: nunca se pasa de 1.
  'algebra.sucesiones-y-series': P => {
    let s = '', x = 12, w = 68;
    for (let k = 0; k < 6; k++) { s += P.r(x, 52, w, 26, k % 2 ? 'm' : 'a', 0) + P.l([[x + w, 52], [x + w, 78]], 'f'); x += w; w /= 2; }
    return s + P.r(12, 52, 136, 26, '', 3) + P.l([[12, 34], [148, 34]], 'f') + P.l([[12, 28], [12, 40]], 'f')
      + P.l([[148, 28], [148, 40]], 'f') + P.t(80, 28, '1', 18) + P.t(46, 102, '½', 18) + P.t(97, 102, '¼', 18) + P.t(122, 102, '⅛', 16);
  },
  // El triángulo de Pascal da los coeficientes del binomio.
  'algebra.binomio-de-newton': P =>
    [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]].map((fila, r) => fila.map((v, k) => {
      const x = 80 + (k - r / 2) * 25, y = 16 + r * 22;
      return P.c(x, y, 10, r === 4 ? 'a d' : 'b d') + P.t(x, y + 5, String(v), 14);
    }).join('')).join(''),
});
})(typeof self !== 'undefined' ? self : this);
