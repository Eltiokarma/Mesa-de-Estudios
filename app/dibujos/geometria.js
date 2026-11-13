// Dibujos de las unidades de geometría (receta en app/dibujos/comun.js). Cada uno dice su idea en una frase.
(function (root) {
'use strict';
const D = root.Dibujos;
const rad = g => g * Math.PI / 180;
// Punto sobre la circunferencia de centro (cx, cy) y radio r, en grados (sentido matemático).
const sobre = (cx, cy, r, g) => [cx + r * Math.cos(rad(g)), cy - r * Math.sin(rad(g))];
// Ángulo (grados, sentido matemático) de la dirección que va de p a q.
const dir = (p, q) => Math.atan2(p[1] - q[1], q[0] - p[0]) * 180 / Math.PI;
// Cuña rellena de un ángulo: vértice (cx, cy), de a1 a a2 grados.
const cuña = (P, cx, cy, r, a1, a2, c = 'a') => P.p(`M${P.n(cx)} ${P.n(cy)}${P.arco(cx, cy, r, a1, a2).replace(/^M/, 'L')}Z`, c);
const poli = (P, pts, c = 'b') => P.p('M' + pts.map(([x, y]) => `${P.n(x)} ${P.n(y)}`).join('L') + 'Z', c);
// k rayitas de «lados iguales» en la mitad del segmento pq.
const marcas = (P, p, q, k) => {
  const [mx, my] = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], L = Math.hypot(q[0] - p[0], q[1] - p[1]);
  const [ux, uy] = [(q[0] - p[0]) / L, (q[1] - p[1]) / L];
  let s = '';
  for (let i = 0; i < k; i++) { const o = (i - (k - 1) / 2) * 5; s += P.l([[mx + ux * o - uy * 6, my + uy * o + ux * 6], [mx + ux * o + uy * 6, my + uy * o - ux * 6]], 'd'); }
  return s;
};
// Flechita «>» de rectas paralelas, en (x, y), mirando a la derecha.
const paralela = (P, x, y) => P.l([[x - 4, y - 5], [x + 2, y], [x - 4, y + 5]], 'd');

D.registrar('geometria', {
  // Una secante corta dos paralelas: los ángulos alternos internos son iguales.
  'geometria.segmentos-y-angulos': P => {
    const a = [60, 84], b = [100, 40], g = dir(a, b);
    return P.l([[8, 84], [152, 84]], 'd') + P.l([[8, 40], [152, 40]], 'd') + paralela(P, 140, 40) + paralela(P, 140, 84)
      + cuña(P, ...a, 22, 0, g) + cuña(P, ...b, 22, 180, g + 180) + P.l([[38, 108], [122, 16]]);
  },
  // El ángulo externo vale lo que suman los dos internos que no son sus vecinos.
  'geometria.triangulos': P => {
    const A = [12, 100], B = [110, 100], C = [64, 14];
    return P.l([[110, 100], [154, 100]], 'd') + poli(P, [A, B, C]) + cuña(P, ...A, 20, 0, dir(A, C), 'm')
      + cuña(P, ...C, 18, dir(C, A) + 360, dir(C, B) + 360, 'm') + cuña(P, ...B, 24, 0, dir(B, C)) + poli(P, [A, B, C], '');
  },
  // Dos triángulos con los mismos lados son iguales, aunque uno esté volteado.
  'geometria.congruencia': P => {
    const t1 = [[12, 98], [70, 98], [28, 34]], t2 = t1.map(([x, y]) => [160 - x, y]);
    return poli(P, t1) + poli(P, t2, 'a')
      + [t1, t2].map(t => marcas(P, t[0], t[1], 1) + marcas(P, t[1], t[2], 2) + marcas(P, t[2], t[0], 3)).join('');
  },
  // Desde un vértice, las diagonales parten el polígono en n − 2 triángulos.
  'geometria.poligonos-y-cuadrilateros': P => {
    const V = [[70, 14], [138, 46], [120, 104], [36, 104], [16, 48]];
    return poli(P, [V[0], V[1], V[2]]) + poli(P, [V[0], V[2], V[3]], 'a') + poli(P, [V[0], V[3], V[4]], 'm')
      + P.l([V[2], V[0], V[3]], 'd') + poli(P, V, '') + P.c(...V[0], 5, 'tn');
  },
  // El ángulo inscrito mide la mitad del central que abarca el mismo arco.
  'geometria.circunferencia': P => {
    const A = sobre(80, 62, 46, 210), B = sobre(80, 62, 46, 330), V = [80, 16];
    return P.c(80, 62, 46, 'b') + cuña(P, 80, 62, 14, 210, 330, 'm') + P.l([A, [80, 62], B], 'd')
      + cuña(P, ...V, 18, 240, 300) + P.l([A, V, B]) + P.ac(P.arco(80, 62, 46, 210, 330)) + P.c(80, 62, 3.5, 'tn');
  },
  // Un corte paralelo a la base deja un triángulo semejante, más chico.
  'geometria.proporcionalidad-y-semejanza': P => {
    const A = [14, 104], B = [146, 104], C = [96, 14], t = 0.55;
    const p = [C[0] + t * (A[0] - C[0]), C[1] + t * (A[1] - C[1])], q = [C[0] + t * (B[0] - C[0]), C[1] + t * (B[1] - C[1])];
    return poli(P, [A, B, C]) + poli(P, [p, q, C], 'a') + paralela(P, 92, p[1]) + paralela(P, 84, 104);
  },
  // Las tres medianas se cruzan en un solo punto: el baricentro.
  'geometria.puntos-notables': P => {
    const A = [16, 100], B = [144, 100], C = [60, 18], m = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    const G = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3];
    return poli(P, [A, B, C]) + P.l([A, m(B, C)], 'd') + P.l([B, m(C, A)], 'd') + P.l([C, m(A, B)], 'd')
      + [m(B, C), m(C, A), m(A, B)].map(p => P.c(...p, 3.5, 'tn')).join('') + P.c(...G, 7, 'a');
  },
  // En el triángulo rectángulo, la altura a la hipotenusa cumple h² = m · n.
  'geometria.relaciones-metricas': P => {
    const A = [14, 92], B = [146, 92], H = [60, 92], C = [60, 92 - Math.sqrt(46 * 86)];
    const u = [(A[0] - C[0]) / 77.9, (A[1] - C[1]) / 77.9], v = [(B[0] - C[0]) / 106.5, (B[1] - C[1]) / 106.5];
    return poli(P, [A, B, C]) + P.l([[C[0] + 8 * u[0], C[1] + 8 * u[1]], [C[0] + 8 * u[0] + 8 * v[0], C[1] + 8 * u[1] + 8 * v[1]], [C[0] + 8 * v[0], C[1] + 8 * v[1]]], 'd')
      + P.l([[60, 84], [68, 84], [68, 92]], 'd') + P.ac(`M60 92V${P.n(C[1])}`)
      + P.t(37, 110, 'm', 16) + P.t(103, 110, 'n', 16) + P.t(50, 74, 'h', 16);
  },
  // En el hexágono regular, el lado mide lo mismo que el radio.
  'geometria.poligonos-regulares': P => {
    const V = [0, 60, 120, 180, 240, 300].map(g => sobre(80, 60, 48, g)), M = [(V[0][0] + V[1][0]) / 2, (V[0][1] + V[1][1]) / 2];
    return P.c(80, 60, 48, 'd') + poli(P, V) + poli(P, [[80, 60], V[0], V[1]], 'a') + P.l([[80, 60], M], 'g')
      + V.map(p => P.l([[80, 60], p], 'f')).join('') + P.c(80, 60, 3.5, 'tn');
  },
  // El espejo deja cada punto a la misma distancia del eje, al otro lado: la bandera mira al revés.
  'geometria.simetria': P => {
    const F = [[44, 22], [70, 34], [44, 48]], esp = pts => pts.map(([x, y]) => [160 - x, y]);
    return P.l([[80, 8], [80, 112]], 'g') + P.l([[44, 22], [44, 102]]) + P.l([[116, 22], [116, 102]]) + poli(P, F) + poli(P, esp(F), 'a')
      + P.l([[70, 34], [90, 34]], 'f') + P.c(70, 34, 4, 'tn') + P.c(90, 34, 4, 'tn') + P.l([[30, 102], [58, 102]], 'd') + P.l([[102, 102], [130, 102]], 'd');
  },
  // El paralelogramo se recorta y se vuelve un rectángulo: base por altura.
  'geometria.areas-poligonales': P =>
    poli(P, [[24, 96], [106, 96], [136, 34], [54, 34]], 'm') + poli(P, [[24, 96], [54, 96], [54, 34]], 'a')
    + poli(P, [[106, 96], [136, 96], [136, 34]], 'g') + P.l([[54, 96], [54, 34]], 'd') + P.l([[54, 88], [62, 88], [62, 96]], 'd')
    + P.p('M40 106Q82 124 118 106', 'd') + P.punta(121, 104, -30, 'tn'),
  // La corona es el círculo grande menos el chico.
  'geometria.longitud-y-areas-circulares': P => {
    const [x, y] = sobre(80, 60, 50, 24), [u, w] = sobre(80, 60, 26, 150);
    return P.c(80, 60, 50, 'a') + P.c(80, 60, 26, 'b') + P.l([[80, 60], [x, y]], 'd') + P.l([[80, 60], [u, w]], 'd')
      + P.c(80, 60, 3.5, 'tn') + P.t(118, 40, 'R', 16) + P.t(70, 52, 'r', 15);
  },
  // La varilla perpendicular al plano y la sombra de una oblicua: su proyección.
  'geometria.geometria-del-espacio': P =>
    poli(P, [[10, 98], [110, 98], [150, 62], [50, 62]], 'm') + P.l([[80, 82], [80, 14]]) + P.l([[80, 74], [89, 74], [89, 82]], 'd')
    + P.l([[80, 14], [124, 90]], 'd') + P.ac('M80 82L124 90') + P.c(80, 82, 4, 'tn') + P.c(124, 90, 4, 'tn') + P.c(80, 14, 4, 'tn'),
  // Un poliedro: caras planas, aristas y vértices que se cuentan (Euler).
  'geometria.poliedros': P => {
    const T = [80, 10], F = [80, 112], a = [28, 58], b = [68, 72], c = [132, 58], d = [94, 46];
    return poli(P, [T, a, b]) + poli(P, [T, b, c], 'a') + poli(P, [F, a, b], 'm') + poli(P, [F, b, c]) + P.l([T, d, F], 'g') + P.l([a, d, c], 'g')
      + [T, F, a, b, c, d].map(p => P.c(...p, 3.5, 'tn')).join('');
  },
  // La pirámide con la misma base y altura que el prisma es un tercio de él.
  'geometria.prisma-y-piramide': P => {
    const ab = [[22, 100], [104, 100], [136, 80], [54, 80]], ar = ab.map(([x, y]) => [x, y - 62]), V = [79, 28];
    return poli(P, [ab[0], ab[1], ar[1], ar[0]]) + poli(P, [ab[1], ab[2], ar[2], ar[1]]) + poli(P, [ar[0], ar[1], ar[2], ar[3]])
      + P.l([ab[3], ab[0]], 'g') + P.l([ab[3], ab[2]], 'g') + P.l([ab[3], ar[3]], 'g') + P.l([ab[3], V], 'g')
      + poli(P, [ab[0], ab[1], V], 'a') + poli(P, [ab[1], ab[2], V], 'm') + P.t(152, 114, '1/3', 16, 'end');
  },
  // Un triángulo rectángulo que gira sobre un cateto genera el cono.
  'geometria.solidos-de-revolucion': P =>
    P.p('M30 94L80 18L130 94A50 12 0 0 1 30 94Z', 'b') + P.p('M30 94A50 12 0 0 1 130 94', 'g')
    + poli(P, [[80, 18], [80, 94], [130, 94]], 'a') + P.p('M30 94A50 12 0 0 0 130 94', 'd') + P.l([[80, 6], [80, 114]], 'g')
    + P.p('M64 40A16 5 0 1 0 96 40', 'd') + P.punta(96, 39, -80, 'tn'),
  // La circunferencia en el plano: centro (h, k) y radio.
  'geometria.geometria-analitica': P => {
    const [x, y] = sobre(92, 50, 30, 28);
    return P.ejes(24, 100, 12, 150, 8, 110) + P.l([[92, 50], [92, 100]], 'g') + P.l([[92, 50], [24, 50]], 'g')
      + P.c(92, 50, 30, 'b') + P.ac(`M92 50L${P.n(x)} ${P.n(y)}`) + P.c(92, 50, 4, 'tn') + P.c(x, y, 6, 'a')
      + P.t(92, 116, 'h', 15) + P.t(14, 55, 'k', 15);
  },
  // ¿Cuántos triángulos hay? También cuentan los que se forman juntando piezas.
  'geometria.razonamiento-con-figuras': P =>
    poli(P, [[78, 14], [12, 104], [148, 104]]) + poli(P, [[78, 14], [58, 104], [148, 104]], 'a')
    + P.l([[58, 104], [78, 14], [104, 104]], 'd') + poli(P, [[78, 14], [12, 104], [148, 104]], '') + P.t(138, 44, '?', 26),
});
})(typeof self !== 'undefined' ? self : this);
