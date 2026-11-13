// Dibujos de las unidades de aritmética (receta en app/dibujos/comun.js). Cada uno dice su idea en una frase.
(function (root) {
'use strict';
const D = root.Dibujos;
const rejilla = (P, x0, y0, filas, cols, paso, r, claseDe) => {
  let s = '';
  for (let i = 0; i < filas; i++) for (let j = 0; j < cols; j++) s += P.c(x0 + j * paso, y0 + i * paso, r, claseDe(i, j));
  return s;
};

D.registrar('aritmetica', {
  // «p y q»: el foco prende solo si los dos interruptores están cerrados.
  'aritmetica.logica-proposicional': P =>
    P.p('M14 92V40H50M74 40H90M114 40H146V92H14', 'd') + P.c(50, 40, 4, 'tn') + P.c(74, 40, 4, 'tn') + P.l([[50, 40], [74, 40]])
    + P.c(90, 40, 4, 'tn') + P.c(114, 40, 4, 'tn') + P.l([[90, 40], [110, 24]]) + P.t(62, 30, 'p', 17) + P.t(106, 64, 'q', 17)
    + P.c(80, 92, 13, 'a') + P.l([[74, 86], [86, 98]], 'd') + P.l([[86, 86], [74, 98]], 'd'),
  // Dos conjuntos y lo que tienen en común.
  'aritmetica.conjuntos': P =>
    P.p('M80 32a32 32 0 0 1 0 60a32 32 0 0 1 0-60z', 'a') + P.c(58, 62, 38, '') + P.c(102, 62, 38, '')
    + P.p('M80 32a32 32 0 0 1 0 60a32 32 0 0 1 0-60z', '')
    + [[38, 50], [44, 76], [122, 48], [116, 80], [80, 54], [80, 72]].map(([x, y]) => P.c(x, y, 4, 'tn')).join(''),
  // Razón 2 : 3, la misma en dos tamaños.
  'aritmetica.razones-y-proporciones': P =>
    P.r(20, 22, 40, 22, 'a', 3) + P.r(60, 22, 60, 22, 'b', 3) + [40, 80, 100].map(x => P.l([[x, 22], [x, 44]], 'f')).join('')
    + P.r(20, 62, 48, 26, 'a', 3) + P.r(68, 62, 72, 26, 'b', 3) + [32, 44, 56, 80, 92, 104, 116, 128].map(x => P.l([[x, 62], [x, 88]], 'f')).join('')
    + P.t(80, 112, '2 : 3 = 4 : 6', 16),
  // Directa: una recta por el origen. Inversa: una curva que baja.
  'aritmetica.magnitudes-proporcionales': P =>
    P.ejes(22, 102, 14, 150, 10, 108) + P.p(P.curva(x => 102 - 1800 / (x - 4) + 14, 28, 146), 'd')
    + P.ac('M22 102L130 18') + P.c(76, 60, 5, 'b'),
  // Tanto por ciento: la etiqueta del precio con su descuento.
  'aritmetica.porcentajes': P =>
    P.p('M40 26H132a8 8 0 0 1 8 8V86a8 8 0 0 1-8 8H40L18 60Z', 'a') + P.c(36, 60, 5, 'b')
    + P.t(92, 70, '−20 %', 24) + P.p('M36 55C26 40 10 34 6 20', 'd'),
  // Interés compuesto: cada año la torre suma una capa más grande que la anterior.
  'aritmetica.interes-y-descuento': P => {
    const h = [0, 1, 2, 3, 4].map(i => 26 * 1.32 ** i);
    return P.l([[12, 104], [150, 104]], 'd') + h.map((a, i) => {
      const x = 16 + i * 27, previo = i ? h[i - 1] : a;
      return P.r(x, 104 - previo, 22, previo, i ? 'b' : 'm', 3) + (i ? P.r(x, 104 - a, 22, a - previo, 'a', 3) : '');
    }).join('');
  },
  // Mezclar dos líquidos de distinta concentración da uno intermedio.
  'aritmetica.mezclas-y-aleaciones': P => {
    const vaso = (x, nivel, c) => P.p(`M${x} 50V96a6 6 0 0 0 6 6H${x + 26}a6 6 0 0 0 6-6V50`, 'b')
      + P.p(`M${x} ${nivel}V96a6 6 0 0 0 6 6H${x + 26}a6 6 0 0 0 6-6V${nivel}Z`, c) + P.p(`M${x} 50V96a6 6 0 0 0 6 6H${x + 26}a6 6 0 0 0 6-6V50`, '');
    return vaso(10, 62, 'a') + vaso(118, 62, 'b') + vaso(64, 70, 'm') + P.p('M34 40L58 52', 'd') + P.punta(62, 54, 27, 'tn')
      + P.p('M126 40L102 52', 'd') + P.punta(98, 54, 153, 'tn');
  },
  // Barras de frecuencias y la media como una línea.
  'aritmetica.estadistica': P =>
    P.l([[14, 104], [150, 104]], 'd') + [[24, 46], [52, 70], [80, 30], [108, 58]].map(([x, h]) => P.r(x, 104 - h, 22, h, 'b', 3)).join('')
    + P.ac('M14 53H146') + P.t(146, 46, 'x̄', 18, 'end'),
  // Contar caminos: cada elección se abre en ramas.
  'aritmetica.analisis-combinatorio': P => {
    const hojas = [18, 42, 66, 90], ramas = [30, 78];
    return ramas.map((y, i) => P.l([[24, 60], [76, y]], 'd') + P.l([[76, y], [130, hojas[2 * i]]], 'd') + P.l([[76, y], [130, hojas[2 * i + 1]]], 'd')).join('')
      + P.ac('M24 60L76 30L130 42') + P.c(24, 60, 6, 'tn') + ramas.map(y => P.c(76, y, 6, 'b')).join('')
      + hojas.map((y, i) => P.c(130, y, 6, i === 1 ? 'a' : 'b')).join('') + P.t(146, 116, '4', 16, 'end');
  },
  // Dos dados: el espacio muestral se cuenta cara por cara.
  'aritmetica.probabilidades': P => {
    const dado = (x, y, giro, pts, c) => `<g transform="rotate(${giro} ${x + 24} ${y + 24})">${P.r(x, y, 48, 48, c, 10)}${pts.map(([a, b]) => P.c(x + a, y + b, 4.5, 'tn')).join('')}</g>`;
    return dado(18, 40, -10, [[12, 12], [24, 24], [36, 36]], 'b') + dado(88, 30, 12, [[12, 12], [36, 12], [12, 36], [36, 36], [12, 24], [36, 24]], 'a');
  },
  // Numeración: el ábaco, cada varilla una potencia de la base.
  'aritmetica.numeracion': P => {
    const cuentas = [3, 1, 4];
    return P.l([[16, 100], [144, 100]]) + [40, 80, 120].map((x, i) => P.l([[x, 22], [x, 100]], 'd')
      + Array.from({ length: cuentas[i] }, (_, k) => `<ellipse class="${i === 0 ? 'a' : 'b'}" cx="${x}" cy="${92 - k * 13}" rx="14" ry="6"/>`).join('')).join('');
  },
  // Sumar en columna: la cifra que se lleva.
  'aritmetica.cuatro-operaciones': P =>
    P.c(84, 20, 9, 'a') + P.t(84, 26, '1', 15) + P.t(112, 52, '4 7', 24, 'end') + P.t(112, 80, '3 8', 24, 'end')
    + P.t(52, 80, '+', 24) + P.l([[44, 90], [118, 90]]) + P.t(112, 114, '8 5', 24, 'end'),
  // Múltiplos: saltos iguales de 3 en 3 sobre la recta.
  'aritmetica.divisibilidad': P =>
    P.l([[10, 86], [150, 86]], 'd') + [0, 1, 2, 3, 4].map(k => P.l([[18 + k * 30, 80], [18 + k * 30, 92]], 'd')).join('')
    + [0, 1, 2, 3].map(k => P.p(`M${18 + k * 30} 80Q${33 + k * 30} 50 ${48 + k * 30} 80`, k === 3 ? 'd' : 'd')).join('')
    + P.ac('M108 80Q123 50 138 80') + P.c(138, 86, 6, 'a') + P.t(18, 112, '0', 15) + P.t(138, 112, '12', 15),
  // 12 fichas se arman en rectángulo; 7 solo en una fila: es primo.
  'aritmetica.numeros-primos-y-divisores': P =>
    rejilla(P, 26, 24, 3, 4, 16, 6, () => 'b') + rejilla(P, 26, 96, 1, 7, 16, 6, () => 'a') + P.t(122, 46, '12', 16, 'start'),
  // MCM: dos cintas de 4 y de 6 vuelven a coincidir en 12.
  'aritmetica.mcd-y-mcm': P =>
    [0, 1, 2].map(k => P.r(16 + k * 40, 30, 40, 22, k % 2 ? 'm' : 'b', 3)).join('')
    + [0, 1].map(k => P.r(16 + k * 60, 66, 60, 22, k % 2 ? 'm' : 'b', 3)).join('')
    + P.ac('M136 18V100') + P.t(136, 116, '12', 15),
  // Fracción: partes iguales de una barra y de una pizza.
  'aritmetica.numeros-racionales': P =>
    P.r(14, 30, 84, 24, 'b', 4) + P.r(14, 30, 63, 24, 'a', 4) + [35, 56, 77].map(x => P.l([[x, 30], [x, 54]], 'd')).join('') + P.r(14, 30, 84, 24, '', 4)
    + P.c(118, 82, 26, 'b') + P.p('M118 82V56A26 26 0 0 1 144 82Z', 'a') + P.l([[92, 82], [144, 82]], 'd') + P.l([[118, 56], [118, 108]], 'd')
    + P.t(44, 90, '3/4', 20),
  // Un cuadrado de fichas crece con una L de 2k + 1.
  'aritmetica.potenciacion-y-radicacion': P =>
    rejilla(P, 28, 26, 4, 4, 18, 7, (i, j) => (i === 3 || j === 3 ? 'a' : 'b')) + P.t(126, 74, '√', 26, 'start'),
  // Una sucesión de figuras que crece siempre igual.
  'aritmetica.sucesiones-y-series': P => {
    let s = P.l([[10, 104], [150, 104]], 'd');
    [16, 38, 70, 112].forEach((x0, i) => { const k = i + 1;
      for (let f = 0; f < k; f++) for (let c = 0; c <= f; c++) s += P.c(x0 + (k - 1 - f) * 5 + c * 10, 96 - (k - 1 - f) * 10, 4.5, i === 3 ? 'a' : 'b'); });
    return s;
  },
  // Método regresivo: se deshacen las operaciones desde el final.
  'aritmetica.razonamiento-numerico': P =>
    P.r(8, 34, 34, 30, 'a', 8) + P.t(25, 56, '?', 20) + P.p('M46 49H60', 'd') + P.punta(64, 49, 0, 'tn') + P.t(80, 56, '×2', 16)
    + P.p('M96 49H108', 'd') + P.punta(112, 49, 0, 'tn') + P.r(116, 34, 36, 30, 'b', 8) + P.t(134, 56, '14', 18)
    + P.ac('M134 76Q80 110 26 76') + P.punta(26, 76, 214, 'tn') + P.t(80, 112, '÷2', 16),
});
})(typeof self !== 'undefined' ? self : this);
