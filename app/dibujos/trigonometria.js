// Dibujos de las unidades de trigonometría (receta en app/dibujos/comun.js). Cada uno dice su idea en una frase.
(function (root) {
'use strict';
const D = root.Dibujos;
const rad = g => g * Math.PI / 180;
// Punto sobre la circunferencia de centro (cx, cy) y radio r, en grados (sentido matemático).
const sobre = (cx, cy, r, g) => [cx + r * Math.cos(rad(g)), cy - r * Math.sin(rad(g))];

D.registrar('trigonometria', {
  // El ángulo es un giro con sentido: antihorario positivo, horario negativo.
  'trigonometria.angulo-trigonometrico': P => {
    const [x, y] = sobre(46, 86, 92, 50);
    return P.l([[46, 86], [146, 86]], 'd') + P.l([[46, 86], [x, y]]) + P.c(46, 86, 5, 'tn')
      + P.ac(P.arco(46, 86, 44, 4, 46)) + P.punta(...sobre(46, 86, 44, 48), -138, 'tn')
      + P.p(P.arco(46, 86, 28, -4, -60), 'g') + P.t(94, 58, '+', 22) + P.t(78, 113, '−', 22) + P.t(132, 32, 'rad', 16);
  },
  // El arco es el radio por el ángulo: L = θ · r.
  'trigonometria.longitud-de-arco-y-sector': P => {
    const [x1, y1] = sobre(34, 96, 104, 8), [x2, y2] = sobre(34, 96, 104, 52);
    return P.p(`M34 96L${P.n(x1)} ${P.n(y1)}${P.arco(34, 96, 104, 8, 52).replace(/^M[^A]+/, '')}Z`, 'm')
      + P.ac(P.arco(34, 96, 104, 8, 52)) + P.l([[34, 96], [x1, y1]], 'd') + P.l([[34, 96], [x2, y2]], 'd')
      + P.p(P.arco(34, 96, 24, 8, 52), 'd') + P.t(84, 104, 'r', 18) + P.t(146, 50, 'L', 20) + P.t(66, 80, 'θ', 17);
  },
  // El triángulo notable 3-4-5 y su ángulo de 37°.
  'trigonometria.razones-trigonometricas-agudas': P =>
    P.p('M24 98H128V26Z', 'm') + P.p('M116 98V86H128', 'd') + P.ac(P.arco(24, 98, 30, 0, 34.7))
    + P.t(76, 115, '4', 18) + P.t(142, 68, '3', 18) + P.t(66, 52, '5', 18) + P.t(70, 92, '37°', 16),
  // Ángulo de elevación: de los ojos a lo alto de la torre.
  'trigonometria.triangulos-rectangulos': P =>
    P.l([[10, 102], [152, 102]], 'd') + P.r(112, 22, 28, 80, 'b', 3) + P.p('M118 34h6v8h-6zM128 34h6v8h-6zM118 52h6v8h-6zM128 52h6v8h-6z', 'f')
    + P.c(30, 72, 7, 'b') + P.l([[30, 79], [30, 98]], 'd') + P.l([[30, 98], [24, 102]], 'd') + P.l([[30, 98], [36, 102]], 'd')
    + P.l([[30, 72], [112, 72]], 'g') + P.ac('M30 72L112 22') + P.ac(P.arco(30, 72, 34, 0, 31)),
  // La recta en el plano y su pendiente: lo que sube por lo que avanza.
  'trigonometria.recta-en-el-plano': P =>
    P.ejes(30, 98) + P.l([[44, 92], [80, 92], [80, 58]], 'g') + P.ac('M22 108L148 14')
    + P.c(44, 92, 5, 'b') + P.c(80, 58, 5, 'b') + P.t(62, 110, 'Δx', 15) + P.t(98, 80, 'Δy', 15),
  // Un ángulo en posición normal: lado inicial en el eje x, signos por cuadrante.
  'trigonometria.angulos-en-posicion-normal': P => {
    const [x, y] = sobre(80, 62, 46, 135);
    return P.ejes(80, 62, 18, 144, 8, 114) + P.l([[80, 62], [x, y]]) + P.c(x, y, 5, 'a')
      + P.ac(P.arco(80, 62, 22, 2, 132)) + P.punta(...sobre(80, 62, 22, 134), 136, 'tn')
      + P.t(122, 36, '+', 20) + P.t(38, 100, '−', 20) + P.t(122, 100, '−', 20) + P.t(38, 36, '+', 20);
  },
  // Reducir al primer cuadrante: el ángulo de II se refleja en uno de I.
  'trigonometria.reduccion-al-primer-cuadrante': P => {
    const [x1, y1] = sobre(80, 66, 44, 140), [x2, y2] = sobre(80, 66, 44, 40);
    return P.ejes(80, 66, 18, 144, 10, 114) + P.c(80, 66, 44, '') + P.l([[80, 66], [x1, y1]], 'd') + P.c(x1, y1, 5, 'b')
      + P.l([[80, 66], [x2, y2]]) + P.c(x2, y2, 6, 'a') + P.ac(`M${P.n(x1 + 9)} ${P.n(y1 - 7)}Q80 10 ${P.n(x2 - 9)} ${P.n(y2 - 7)}`)
      + P.punta(x2 - 9, y2 - 7, 38, 'tn');
  },
  // La circunferencia de radio 1: el seno es la altura del punto; el coseno, su sombra en el eje x.
  'trigonometria.circunferencia-trigonometrica': P => {
    const [x, y] = sobre(72, 62, 46, 50);
    return P.ejes(72, 62, 14, 146, 8, 114) + P.c(72, 62, 46, 'b') + P.l([[72, 62], [x, y]], 'd')
      + P.l([[72, 62], [x, 62]], 'd') + P.ac(`M${P.n(x)} 62V${P.n(y)}`) + P.c(x, y, 6, 'a') + P.t(108, 44, 'sen', 15, 'start');
  },
  // sen² + cos² = 1: los cuadrados de los catetos llenan el de la hipotenusa 1.
  'trigonometria.identidades-fundamentales': P =>
    P.p('M54 76L84 36L44 6L14 46Z', 'b') + P.p('M54 76H84V106H54Z', 'm') + P.p('M84 36H124V76H84Z', 'a')
    + P.p('M54 76H84V36Z', 'b') + P.ac('M54 76L84 36') + P.t(49, 47, '1', 20) + P.t(69, 96, 'cos²', 14) + P.t(104, 61, 'sen²', 14),
  // Suma de ángulos: un giro α y luego otro β, uno tras otro.
  'trigonometria.arcos-compuestos': P => {
    const [x1, y1] = sobre(30, 96, 104, 24), [x2, y2] = sobre(30, 96, 104, 58);
    return P.l([[30, 96], [148, 96]], 'd') + P.l([[30, 96], [x1, y1]], 'd') + P.l([[30, 96], [x2, y2]])
      + P.p(P.arco(30, 96, 40, 0, 24), 'd') + P.ac(P.arco(30, 96, 58, 24, 58))
      + P.t(82, 88, 'α', 17) + P.t(76, 46, 'β', 17) + P.c(30, 96, 5, 'tn');
  },
  // Ángulo doble: el mismo giro θ dos veces.
  'trigonometria.arcos-multiples': P => {
    const [x1, y1] = sobre(30, 98, 106, 28), [x2, y2] = sobre(30, 98, 106, 56);
    return P.l([[30, 98], [148, 98]], 'd') + P.l([[30, 98], [x1, y1]], 'g') + P.l([[30, 98], [x2, y2]])
      + P.p(P.arco(30, 98, 44, 0, 28), 'd') + P.p(P.arco(30, 98, 44, 28, 56), 'd') + P.ac(P.arco(30, 98, 70, 0, 56))
      + P.t(84, 90, 'θ', 16) + P.t(70, 64, 'θ', 16) + P.t(112, 40, '2θ', 18);
  },
  // Suma a producto: dos flechas iguales en la circunferencia suman un rombo.
  'trigonometria.transformaciones-trigonometricas': P => {
    const [ax, ay] = sobre(36, 92, 64, 12), [bx, by] = sobre(36, 92, 64, 72), sx = ax + bx - 36, sy = ay + by - 92;
    return P.p(P.arco(36, 92, 64, -4, 90), 'g') + P.p(`M36 92L${P.n(ax)} ${P.n(ay)}L${P.n(sx)} ${P.n(sy)}L${P.n(bx)} ${P.n(by)}Z`, 'm')
      + P.l([[36, 92], [ax, ay]]) + P.l([[36, 92], [bx, by]]) + P.ac(`M36 92L${P.n(sx)} ${P.n(sy)}`)
      + P.punta(sx, sy, Math.atan2(sy - 92, sx - 36) * 180 / Math.PI, 'tn') + P.c(36, 92, 5, 'tn');
  },
  // La función seno: una onda que se repite cada periodo.
  'trigonometria.funciones-trigonometricas': P =>
    P.ejes(20, 62, 12, 150, 14, 110) + P.p(P.curva(x => 62 - 32 * Math.sin((x - 20) * Math.PI / 60), 20, 146), 'd')
    + P.ac(P.curva(x => 62 - 32 * Math.sin((x - 20) * Math.PI / 60), 20, 140))
    + P.l([[20, 104], [140, 104]], 'f') + P.l([[20, 99], [20, 109]], 'f') + P.l([[140, 99], [140, 109]], 'f') + P.t(80, 118, 'T', 14),
  // La inversa vive en una sola ventana: de la onda solo cuenta el tramo central.
  'trigonometria.funciones-trigonometricas-inversas': P =>
    P.r(54, 12, 52, 96, 'b', 6) + P.ejes(80, 60, 10, 150, 10, 112)
    + P.p(P.curva(x => 60 - 36 * Math.sin((x - 80) * Math.PI / 52), 12, 150), 'g')
    + P.ac(P.curva(x => 60 - 36 * Math.sin((x - 80) * Math.PI / 52), 54, 106)),
  // Una ecuación trigonométrica tiene muchas soluciones: la recta y = k corta la onda una y otra vez.
  'trigonometria.ecuaciones-trigonometricas': P => {
    const f = x => 66 - 34 * Math.sin((x - 14) * Math.PI / 46), k = 66 - 34 * 0.5;
    const cortes = [14 + 46 / 6, 14 + 46 * 5 / 6, 14 + 92 + 46 / 6, 14 + 92 + 46 * 5 / 6];
    return P.l([[10, 66], [152, 66]], 'd') + P.p(P.curva(f, 14, 148)) + P.l([[10, k], [152, k]], 'g')
      + cortes.map(x => P.c(x, k, 6, 'a')).join('') + P.t(150, k - 8, 'k', 16, 'end');
  },
  // Triángulo cualquiera y el compás de la ley de senos: el lado puede caer en dos lugares.
  'trigonometria.triangulos-oblicuangulos': P =>
    P.l([[12, 100], [152, 100]], 'd') + P.p('M22 100L92 30L130 100Z', 'm') + P.p('M92 30L56 100', 'g')
    + P.ac(P.arco(92, 30, 79, -128, -52)) + P.c(56, 100, 5, 'b') + P.c(130, 100, 5, 'a') + P.c(92, 30, 5, 'tn')
    + P.p(P.arco(22, 100, 20, 0, 45), 'd'),
  // Área con dos lados y el ángulo entre ellos.
  'trigonometria.areas-y-lineas-notables': P =>
    P.p('M18 100L64 24L146 100Z', 'a') + P.p('M64 24L82 100', 'g') + P.p(P.arco(18, 100, 26, 0, 58), 'd')
    + P.t(34, 56, 'a', 18) + P.t(82, 116, 'b', 18) + P.t(38, 94, 'C', 15),
  // La elipse es la cuerda del jardinero: dos estacas y un lápiz.
  'trigonometria.conicas': P => {
    const [x, y] = [80 + 62 * Math.cos(rad(62)), 62 - 38 * Math.sin(rad(62))];
    return '<ellipse class="b" cx="80" cy="62" rx="62" ry="38"/>' + P.ac(`M46 62L${P.n(x)} ${P.n(y)}L114 62`)
      + P.c(46, 62, 5, 'tn') + P.c(114, 62, 5, 'tn') + P.c(x, y, 6, 'a');
  },
  // Coordenadas polares: un punto se ubica con distancia y ángulo, sobre el radar.
  'trigonometria.coordenadas-polares-y-complejos': P => {
    const [x, y] = sobre(80, 62, 44, 38);
    return P.c(80, 62, 52, 'b') + P.c(80, 62, 34, '') + P.c(80, 62, 17, '')
      + [0, 45, 90, 135].map(g => { const [a, b] = sobre(80, 62, 52, g), [c, d] = sobre(80, 62, 52, g + 180); return P.l([[a, b], [c, d]], 'f'); }).join('')
      + P.ac(`M80 62L${P.n(x)} ${P.n(y)}`) + P.c(x, y, 6, 'a') + P.p(P.arco(80, 62, 22, 0, 38), 'd') + P.t(104, 92, 'r, θ', 15);
  },
});
})(typeof self !== 'undefined' ? self : this);
