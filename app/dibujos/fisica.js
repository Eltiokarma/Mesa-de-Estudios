// Dibujos de las unidades de física (receta en app/dibujos/comun.js). Cada uno dice su idea en una frase.
(function (root) {
'use strict';
const D = root.Dibujos;
const ang = (x1, y1, x2, y2) => Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
// Carrito con ruedas: caja de x a x + w, ruedas apoyadas en el piso y.
const carro = (P, x, w, y, c) => P.r(x, y - 26, w, 18, c, 4) + P.c(x + 8, y - 5, 5, 'tn') + P.c(x + w - 8, y - 5, 5, 'tn');
// Línea ondulada de (x1, y1) a (x2, y2): la luz que viaja.
const onda = (P, x1, y1, x2, y2, amp, vueltas) => {
  const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L, pts = [];
  for (let i = 0; i <= 48; i++) { const s = i / 48, o = amp * Math.sin(s * vueltas * 2 * Math.PI); pts.push([x1 + ux * L * s - uy * o, y1 + uy * L * s + ux * o]); }
  return 'M' + pts.map(([x, y]) => `${P.n(x)} ${P.n(y)}`).join('L');
};

D.registrar('fisica', {
  // Dos vectores se suman punta con cola: la resultante cierra el triángulo.
  'fisica.magnitudes-y-vectores': P =>
    P.l([[22, 98], [86, 98]]) + P.punta(92, 98, 0) + P.l([[92, 98], [128, 40]]) + P.punta(132, 34, ang(92, 98, 132, 34))
    + P.ac('M22 98L124 38') + P.punta(132, 34, ang(22, 98, 132, 34)) + P.c(22, 98, 5, 'tn')
    + P.t(56, 116, 'A', 16) + P.t(124, 76, 'B', 16) + P.t(64, 56, 'R', 16),
  // En el MRUV el móvil recorre cada segundo más: las marcas se separan.
  'fisica.movimiento-rectilineo': P => {
    const xs = [0, 1, 2, 3, 4].map(k => 12 + 10 * k + 5 * k * k), salto = (k, c) => P.p(`M${P.n(xs[k])} 96Q${P.n((xs[k] + xs[k + 1]) / 2)} ${P.n(96 - (xs[k + 1] - xs[k]) * 1.7)} ${P.n(xs[k + 1])} 96`, c);
    return P.l([[4, 100], [156, 100]], 'd') + [0, 1, 2].map(k => salto(k, 'd')).join('') + salto(3, 'caja') + salto(3, 'acl')
      + xs.map(x => P.c(x, 96, 4.5, 'tn')).join('') + carro(P, 122, 32, 100, 'b');
  },
  // El tiro parabólico avanza parejo mientras sube y baja: sombras iguales en el piso.
  'fisica.movimiento-parabolico-y-circular': P => {
    const y = x => 100 - 76 * (1 - ((x - 80) / 64) ** 2);
    return P.l([[8, 100], [152, 100]], 'd') + P.ac(P.curva(y, 16, 144))
      + [32, 48, 64, 80, 96, 112, 128].map(x => P.l([[x, y(x) + 6], [x, 96]], 'g') + P.l([[x, 96], [x, 104]], 'd') + P.c(x, y(x), 5, 'b')).join('')
      + P.c(16, 100, 6, 'tn');
  },
  // La barra queda quieta cuando los giros se compensan: lo pesado va cerca del apoyo.
  'fisica.estatica': P =>
    P.l([[8, 104], [152, 104]], 'd') + P.p('M64 78L52 104H76Z', 'tn') + P.r(10, 70, 142, 8, 'a', 3)
    + P.r(22, 34, 34, 36, 'b', 4) + P.r(124, 52, 20, 18, 'b', 3),
  // En el plano inclinado la fuerza neta empuja la caja cuesta abajo: acelera.
  'fisica.dinamica': P => {
    const a = Math.atan(62 / 132) * 180 / Math.PI;
    return P.p('M12 102H148V40Z', 'm') + `<g transform="rotate(${P.n(-a)} 100 63.1)">${P.r(84, 41.1, 32, 22, 'b', 4)}</g>`
      + P.ac('M78 61L42 78') + P.punta(36, 80.8, 180 - a) + P.p(P.arco(12, 102, 30, 0, a), 'd') + P.t(14, 30, 'F = m a', 16, 'start');
  },
  // La Tierra atrae al satélite hacia su centro mientras él da vueltas.
  'fisica.gravitacion': P =>
    '<ellipse class="g" cx="80" cy="62" rx="66" ry="40"/>' + P.c(62, 64, 26, 'm')
    + P.ac('M118 44L96 52') + P.punta(90, 54.3, ang(128, 40, 62, 64)) + P.r(122, 30, 14, 12, 'b', 2)
    + P.l([[114, 36], [122, 36]], 'd') + P.l([[136, 36], [144, 36]], 'd'),
  // Lo que baja por la rampa se vuelve rapidez abajo.
  'fisica.trabajo-y-energia': P =>
    P.p('M14 18C14 92 40 104 80 104C120 104 146 92 146 46', '') + P.c(28, 30, 8, 'b') + P.l([[28, 42], [28, 104]], 'g')
    + P.t(40, 76, 'h', 18, 'start') + P.c(80, 95, 8, 'a') + P.ac('M94 80H120') + P.punta(126, 80, 0),
  // Un carro choca con otro quieto: lo que uno pierde, el otro lo gana.
  'fisica.impulso-y-choques': P =>
    P.l([[6, 96], [154, 96]], 'd') + carro(P, 14, 44, 96, 'm') + carro(P, 94, 44, 96, 'b')
    + P.ac('M24 54H62') + P.punta(68, 54, 0) + P.l([[106, 54], [130, 54]], 'g') + P.punta(136, 54, 0, 'tn')
    + P.l([[74, 74], [82, 74]], 'f') + P.l([[72, 64], [80, 58]], 'f') + P.l([[72, 84], [80, 90]], 'f'),
  // El bloque del resorte va y viene alrededor del equilibrio.
  'fisica.oscilaciones': P =>
    P.l([[14, 26], [14, 98]], 'd') + P.l([[8, 98], [152, 98]], 'd') + [34, 50, 66, 82].map(y => P.l([[8, y + 6], [14, y]], 'f')).join('')
    + P.l([[14, 78], [22, 78], [27, 66], [35, 90], [43, 66], [51, 90], [59, 66], [64, 78], [72, 78]], 'd')
    + P.r(72, 60, 34, 36, 'b', 4) + P.l([[89, 30], [89, 110]], 'g') + P.ac('M70 40H108') + P.punta(64, 40, 180) + P.punta(114, 40, 0),
  // La onda viaja por la cuerda; λ es lo que mide una vuelta completa.
  'fisica.ondas-mecanicas': P =>
    P.r(4, 46, 10, 34, 'tn', 3) + P.ac(P.curva(x => 63 - 24 * Math.sin((x - 14) * Math.PI / 30), 14, 150))
    + P.l([[29, 30], [89, 30]], 'd') + P.l([[29, 24], [29, 36]], 'd') + P.l([[89, 24], [89, 36]], 'd') + P.t(59, 22, 'λ', 18),
  // Lo que flota recibe del agua un empuje que sostiene su peso.
  'fisica.fluidos': P =>
    P.p('M22 26V102H138V26', 'b') + P.p('M22 48H138V102H22Z', 'm') + P.r(58, 34, 44, 48, 'b', 4)
    + P.p('M22 26V102H138V26', '') + P.ac('M80 76V50') + P.punta(80, 44, -90),
  // El termómetro mide: el calor hace subir la columna.
  'fisica.temperatura-y-calor': P =>
    P.r(42, 12, 20, 78, 'b', 10) + P.c(52, 96, 15, 'a') + P.r(48, 38, 8, 50, 'a', 2) + P.p('M48 88H56', 'acl')
    + [22, 34, 46, 58, 70].map((y, i) => P.l([[66, y], [i % 2 ? 72 : 76, y]], 'd')).join('') + P.t(116, 66, '°C', 30),
  // El gas que se expande hace trabajo: el área bajo la curva P-V.
  'fisica.termodinamica': P => {
    const f = x => 102 - 2736 / (x - 4);
    return P.p(`${P.curva(f, 40, 140)}L140 102H40Z`, 'm') + P.ejes(24, 102, 18, 152, 10, 106)
      + P.ac(P.curva(f, 40, 136)) + P.punta(140, f(140), 14) + P.c(40, f(40), 5, 'tn')
      + P.t(12, 22, 'P', 16) + P.t(150, 118, 'V', 16, 'end');
  },
  // Cargas iguales se empujan: las esferas colgadas se separan.
  'fisica.electrostatica': P =>
    P.l([[56, 8], [104, 8]], 'd') + P.l([[80, 8], [50, 52]], 'd') + P.l([[80, 8], [110, 52]], 'd')
    + P.c(46, 64, 16, 'b') + P.c(114, 64, 16, 'b') + P.t(46, 72, '+', 24) + P.t(114, 72, '+', 24)
    + P.ac('M26 72L14 78') + P.punta(8, 81, 153) + P.ac('M134 72L146 78') + P.punta(152, 81, 27),
  // La pila empuja la corriente por el circuito y la resistencia la frena.
  'fisica.corriente-y-circuitos': P =>
    P.p('M22 54V28H56M104 28H140V98H22V70', 'd') + P.l([[8, 56], [36, 56]]) + P.l([[15, 68], [29, 68]], 'caja')
    + P.ac('M56 28L61 16L71 40L81 16L91 40L99 16L104 28') + P.punta(86, 98, 180) + P.punta(140, 66, 90)
    + P.t(44, 66, '+', 16, 'start'),
  // La corriente del cable hace un campo en círculos alrededor.
  'fisica.magnetismo': P =>
    '<ellipse class="d" cx="80" cy="40" rx="28" ry="9"/>' + P.ac('M34 76a46 14 0 1 0 92 0a46 14 0 1 0-92 0')
    + P.l([[80, 112], [80, 16]]) + P.punta(80, 8, -90) + P.punta(104, 89, -8) + P.t(92, 24, 'I', 18, 'start'),
  // El imán que entra a la bobina enciende el foco.
  'fisica.induccion-electromagnetica': P =>
    [92, 104, 116].map(x => `<ellipse class="d" cx="${x}" cy="56" rx="8" ry="26"/>`).join('')
    + P.r(16, 46, 30, 22, 'm', 3) + P.r(46, 46, 30, 22, 'b', 3) + P.t(31, 63, 'N', 15) + P.t(61, 63, 'S', 15)
    + P.l([[22, 32], [62, 32]]) + P.punta(68, 32, 0) + P.p('M116 82V100H128M92 82V108H136', 'd')
    + P.c(140, 98, 10, 'a') + P.l([[140, 76], [140, 82]], 'f') + P.l([[156, 92], [152, 94]], 'f') + P.l([[124, 82], [128, 86]], 'f'),
  // El prisma abre la luz blanca en su espectro.
  'fisica.ondas-electromagneticas': P =>
    P.p('M98 60L154 42V104Z', 'a') + P.l([[98, 60], [154, 63]], 'f') + P.l([[98, 60], [154, 83]], 'f')
    + P.p('M80 20L44 94H116Z', 'b') + P.l([[6, 72], [64, 56]]) + P.l([[64, 56], [98, 60]], 'd'),
  // La lente convergente junta los rayos paralelos en el foco.
  'fisica.optica-geometrica': P =>
    P.l([[6, 62], [154, 62]], 'g') + P.p('M80 16Q98 62 80 108Q62 62 80 16Z', 'b')
    + P.l([[8, 34], [80, 34], [150, 71.2]]) + P.l([[8, 90], [80, 90], [150, 52.8]]) + P.l([[8, 62], [150, 62]], 'd')
    + P.c(132, 62, 6, 'a') + P.t(132, 92, 'F', 17),
  // La luz que llega al metal arranca electrones.
  'fisica.fisica-moderna': P =>
    P.r(12, 88, 136, 18, 'm', 3) + P.p('M24 88V106M48 88V106M72 88V106M96 88V106M120 88V106', 'f')
    + P.ac(onda(P, 14, 12, 62, 78, 6, 4)) + P.punta(66, 83.5, ang(14, 12, 66, 84))
    + P.l([[80, 82], [110, 44]], 'g') + P.punta(114, 39, ang(80, 82, 114, 39)) + P.c(126, 30, 9, 'b') + P.t(126, 35, '−', 16),
});
})(typeof self !== 'undefined' ? self : this);
