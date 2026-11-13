// Dibujos de las unidades de química (receta en app/dibujos/comun.js). Cada uno dice su idea en una frase.
(function (root) {
'use strict';
const D = root.Dibujos;
// Vaso de laboratorio de x a x + w, borde arriba en y0, fondo en y1, con líquido desde el nivel.
const vaso = (P, x, w, y0, y1, nivel, c) => {
  const borde = `M${x} ${y0}V${y1 - 6}a6 6 0 0 0 6 6H${x + w - 6}a6 6 0 0 0 6-6V${y0}`;
  return P.p(borde, 'b') + P.p(`M${x} ${nivel}V${y1 - 6}a6 6 0 0 0 6 6H${x + w - 6}a6 6 0 0 0 6-6V${nivel}Z`, c) + P.p(borde, '');
};
// Hexágono de lado r con centro (cx, cy), vértices arriba y abajo.
const hex = (P, cx, cy, r, c) => P.p('M' + [0, 1, 2, 3, 4, 5].map(k => {
  const a = (k * 60 - 90) * Math.PI / 180; return `${P.n(cx + r * Math.cos(a))} ${P.n(cy + r * Math.sin(a))}`;
}).join('L') + 'Z', c);
const gota = (x, y, s = 1) => `M${x} ${y}C${x} ${y}${' '}${x - 9 * s} ${y + 12 * s} ${x - 9 * s} ${y + 18 * s}a${9 * s} ${9 * s} 0 0 0 ${18 * s} 0C${x + 9 * s} ${y + 12 * s} ${x} ${y} ${x} ${y}Z`;
const puntos = (P, lista, r, c) => lista.map(([x, y]) => P.c(x, y, r, c)).join('');

D.registrar('quimica', {
  // Con la lupa se ve si es una sustancia o una mezcla de dos.
  'quimica.materia-y-energia': P =>
    P.l([[92, 82], [126, 112]], 'caja') + P.c(64, 54, 38, 'b')
    + puntos(P, [[48, 36], [80, 42], [44, 66], [70, 76]], 6, 'a f') + puntos(P, [[64, 30], [60, 54], [86, 62], [52, 82]], 4.5, 'tn')
    + P.c(64, 54, 38, '') + P.c(64, 54, 32, 'f'),
  // El átomo: núcleo chico con protones y electrones que giran alrededor.
  'quimica.estructura-atomica': P =>
    [0, 60, -60].map(g => `<ellipse class="d" cx="80" cy="62" rx="58" ry="17" transform="rotate(${g} 80 62)"/>`).join('')
    + puntos(P, [[74, 57], [86, 67]], 7, 'a') + puntos(P, [[86, 56], [74, 68]], 7, 'b')
    + puntos(P, [[138, 62], [51, 12], [109, 12]], 5, 'tn'),
  // La tabla: el lugar del elemento (fila y columna) dice cómo es.
  'quimica.tabla-periodica': P => {
    const w = 8.4, h = 11, x0 = 4.4, y0 = 22, filas = c => (c === 0 || c === 17 ? [0, 6] : c === 1 || c >= 12 ? [1, 6] : [3, 6]);
    let s = '';
    for (let c = 0; c < 18; c++) { const [a, b] = filas(c); for (let f = a; f <= b; f++) s += P.r(x0 + c * w, y0 + f * h, w, h, c === 16 ? 'a f' : 'b f', 1); }
    return s + P.ac(`M${P.n(x0 + 16.5 * w)} 10V16`) + P.punta(x0 + 16.5 * w, 20, 90);
  },
  // El enlace: dos átomos comparten un par de electrones.
  'quimica.enlace-quimico': P =>
    P.c(58, 62, 34, 'b') + P.c(102, 62, 34, 'b') + P.p('M80 35.6A34 34 0 0 1 80 88.4A34 34 0 0 1 80 35.6Z', 'a')
    + P.c(58, 62, 34, '') + P.c(102, 62, 34, '') + P.c(80, 53, 4.5, 'tn') + P.c(80, 71, 4.5, 'tn')
    + P.t(46, 69, 'H', 20) + P.t(114, 69, 'H', 20),
  // Las cargas se cruzan y dan el nombre: Fe³⁺ con O²⁻ es Fe₂O₃.
  'quimica.nomenclatura-inorganica': P =>
    P.r(14, 12, 56, 42, 'b', 8) + P.r(90, 12, 56, 42, 'm', 8) + P.t(36, 42, 'Fe', 22) + P.t(58, 30, '3+', 14, 'start')
    + P.t(112, 42, 'O', 22) + P.t(126, 30, '2−', 14, 'start') + P.ac('M62 60L98 84') + P.ac('M98 60L62 84')
    + P.t(80, 112, 'Fe₂O₃', 24),
  // El mol se cuenta pesando: un montón de partículas equilibra unos gramos.
  'quimica.mol-y-composicion': P =>
    P.l([[64, 104], [96, 104]], 'd') + P.l([[80, 104], [80, 34]]) + P.l([[26, 34], [134, 34]]) + P.c(80, 34, 5, 'tn')
    + P.l([[18, 74], [36, 34], [54, 74]], 'f') + P.l([[106, 74], [124, 34], [142, 74]], 'f')
    + puntos(P, [[23, 68], [30, 68], [37, 68], [44, 68], [51, 68], [27, 61], [34, 61], [41, 61], [48, 61], [31, 54], [38, 54], [45, 54]], 3.5, 'a f')
    + P.p('M14 74H58Q54 86 36 86Q18 86 14 74Z', 'b') + P.p('M102 74H146Q142 86 124 86Q106 86 102 74Z', 'b')
    + P.p('M112 74L116 56H132L136 74Z', 'b') + P.t(124, 71, 'g', 14) + P.t(36, 108, 'mol', 16),
  // Los mismos átomos antes y después: solo cambian de pareja.
  'quimica.reacciones-y-balance': P =>
    P.l([[16, 36], [30, 36]], 'd') + P.l([[16, 84], [30, 84]], 'd') + P.l([[52, 50], [52, 70]], 'd')
    + puntos(P, [[16, 36], [30, 36], [16, 84], [30, 84]], 6, 'b') + puntos(P, [[52, 50], [52, 70]], 9, 'a')
    + P.l([[70, 60], [90, 60]]) + P.punta(96, 60, 0)
    + [36, 84].map(y => P.l([[110, y - 8], [124, y]], 'd') + P.l([[138, y - 8], [124, y]], 'd') + P.c(110, y - 8, 6, 'b') + P.c(138, y - 8, 6, 'b') + P.c(124, y, 9, 'a')).join(''),
  // Con dos de uno por cada uno del otro, el que falta limita y el otro sobra.
  'quimica.estequiometria': P =>
    [26, 60, 94].map(y => P.l([[22, y], [40, y]], 'd') + P.c(22, y, 8, 'a') + P.c(40, y, 8, 'b') + P.l([[48, y], [60, y]], 'f')).join('')
    + P.l([[64, 18], [64, 102]], 'd') + P.r(84, 34, 62, 52, 'g', 10) + P.c(102, 60, 8, 'b') + P.c(128, 60, 8, 'b')
    + P.t(115, 108, 'sobra', 15),
  // Las partículas del gas golpean el émbolo y lo sostienen.
  'quimica.gases': P =>
    P.p('M34 22V104H126V22', 'b') + P.r(34, 36, 92, 12, 'a', 3) + P.l([[80, 36], [80, 8]])
    + puntos(P, [[50, 64], [78, 58], [108, 70], [62, 88], [96, 92], [114, 56]], 4.5, 'tn')
    + P.l([[50, 64], [42, 72]], 'f') + P.l([[78, 58], [76, 70]], 'f') + P.l([[108, 70], [100, 80]], 'f') + P.l([[62, 88], [52, 82]], 'f')
    + P.l([[96, 92], [108, 86]], 'f') + P.l([[114, 56], [104, 62]], 'f') + P.p('M34 22V104H126V22', ''),
  // Sólido ordenado, líquido suelto, gas libre: más calor, más desorden.
  'quimica.liquidos-y-solidos': P =>
    [6, 58, 110].map(x => P.r(x, 26, 44, 56, 'b', 6)).join('') + P.r(58, 54, 44, 28, 'm', 6)
    + puntos(P, [0, 1, 2].flatMap(i => [0, 1, 2].map(j => [16 + j * 12, 48 + i * 12])), 4.5, 'tn')
    + puntos(P, [[66, 74], [78, 72], [92, 75], [70, 62], [84, 63], [95, 62]], 4.5, 'tn')
    + puntos(P, [[120, 36], [142, 46], [124, 70], [140, 74]], 4.5, 'tn') + P.ac('M14 102H140') + P.punta(146, 102, 0),
  // Más soluto en la misma agua: la solución está más concentrada.
  'quimica.soluciones': P =>
    vaso(P, 16, 52, 30, 104, 50, 'm') + vaso(P, 92, 52, 30, 104, 50, 'a')
    + puntos(P, [[32, 66], [52, 80], [38, 92]], 4, 'tn')
    + puntos(P, [[102, 60], [116, 64], [132, 58], [106, 76], [122, 78], [136, 72], [110, 92], [126, 92], [138, 88], [118, 70]], 4, 'tn'),
  // Para reaccionar hay que subir la loma de energía.
  'quimica.cinetica-quimica': P =>
    P.ejes(14, 106, 8, 152, 8, 112) + P.l([[38, 70], [140, 70]], 'g')
    + P.p('M14 70H36C58 70 64 26 80 26C96 26 104 90 122 90H150') + P.l([[80, 66], [80, 38]], 'd') + P.punta(80, 34, -90)
    + P.c(80, 17, 8, 'a') + P.c(24, 62, 7, 'b'),
  // El equilibrio: la ida y la vuelta van a la vez y a la par.
  'quimica.equilibrio-quimico': P =>
    P.ac('M56 50H104') + P.p('M104 50L94 41', 'caja') + P.p('M104 50L94 41', 'acl')
    + P.ac('M104 72H56') + P.p('M56 72L66 81', 'caja') + P.p('M56 72L66 81', 'acl')
    + puntos(P, [[20, 34], [38, 46], [18, 64], [36, 80]], 7, 'b') + puntos(P, [[30, 98]], 7, 'm')
    + puntos(P, [[124, 34], [142, 48], [122, 66], [140, 82]], 7, 'm') + puntos(P, [[128, 98]], 7, 'b'),
  // El pH ubica la gota en la escala: ácido, neutro o básico.
  'quimica.acidos-y-bases': P =>
    P.r(10, 64, 140, 20, 'b', 4) + P.r(10, 64, 40, 20, 'm', 4)
    + Array.from({ length: 13 }, (_, k) => P.l([[20 + k * 10, 64], [20 + k * 10, 84]], 'f')).join('') + P.r(10, 64, 140, 20, '', 4)
    + P.p(gota(30, 14, 1.1), 'a') + P.l([[30, 48], [30, 58]], 'g')
    + P.t(14, 104, '0', 15) + P.t(80, 104, '7', 15) + P.t(146, 104, '14', 15) + P.t(118, 46, 'pH', 22),
  // En la pila los electrones van por el alambre de un vaso al otro.
  'quimica.electroquimica': P =>
    vaso(P, 8, 56, 48, 106, 62, 'm') + vaso(P, 96, 56, 48, 106, 62, 'm')
    + P.p('M44 86V40H116V86H108V48H52V86Z', 'b d')
    + P.r(18, 30, 12, 64, 'b', 2) + P.r(130, 30, 12, 64, 'b', 2) + P.p('M24 30V14H136V30', 'd')
    + P.ac('M54 14H98') + P.punta(104, 14, 0),
  // Una cadena de carbonos con un enlace doble.
  'quimica.hidrocarburos': P => {
    const v = [[14, 78], [40, 46], [66, 78], [92, 46], [118, 78], [144, 46]];
    return P.l(v) + P.ac('M77 79L95 57') + puntos(P, v, 5, 'tn');
  },
  // El grupo que cuelga de la cadena (aquí OH) decide la función.
  'quimica.funciones-organicas': P => {
    const v = [[12, 84], [38, 52], [64, 84], [90, 52]];
    return P.l(v) + P.l([[90, 52], [110, 76]]) + puntos(P, v, 5, 'tn') + P.c(124, 84, 22, 'a') + P.t(124, 91, 'OH', 18);
  },
  // Las piezas (azúcares) se unen en cadena y sueltan agua en cada unión.
  'quimica.biomoleculas-y-productos-naturales': P =>
    P.l([[38, 82], [60, 82]], 'd') + P.l([[86, 82], [108, 82]], 'd') + P.c(49, 82, 4.5, 'tn') + P.c(97, 82, 4.5, 'tn')
    + hex(P, 24, 82, 16, 'b') + hex(P, 72, 82, 16, 'b') + hex(P, 120, 82, 16, 'b') + P.l([[136, 82], [152, 82]], 'g')
    + P.p(gota(97, 22, 0.9), 'a') + P.l([[97, 66], [97, 54]], 'g') + P.punta(97, 50, -90, 'tn'),
  // La torre separa el petróleo: cada fracción sale a su altura.
  'quimica.recursos-naturales': P =>
    P.l([[10, 94], [46, 94]], 'd') + P.punta(52, 94, 0) + P.r(56, 10, 34, 98, 'b', 12)
    + [32, 54, 76].map(y => P.l([[60, y], [86, y]], 'f')).join('')
    + [22, 44, 66].map(y => P.ac(`M90 ${y}H124V${y + 8}`)).join('') + [22, 44, 66].map(y => P.c(124, y + 18, 5, 'tn')).join('')
    + P.p('M64 108c0-8 6-10 9-16c3 6 9 8 9 16Z', 'm'),
  // El humo de la chimenea vuelve como lluvia ácida.
  'quimica.ambiente-y-quimica-aplicada': P =>
    P.l([[6, 106], [154, 106]], 'd') + P.p('M14 106V74L34 62V74L54 62V74L74 62V106Z', 'b') + P.r(82, 40, 16, 66, 'b', 2)
    + P.p('M90 34c-6-6 2-12 8-10c2-10 18-12 24-4c8-4 18 2 16 10c8 2 8 14-2 14H96c-8 0-10-6-6-10Z', 'a')
    + [[104, 58], [118, 54], [132, 58], [111, 74], [125, 72], [139, 74]].map(([x, y]) => P.l([[x, y], [x - 3, y + 8]], 'd')).join(''),
});
})(typeof self !== 'undefined' ? self : this);
