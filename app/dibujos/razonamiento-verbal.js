// Dibujos de las unidades de razonamiento verbal (receta en app/dibujos/comun.js). Cada uno dice su idea en una frase.
// Objetos concretos en vez de páginas genéricas: el texto se dibuja como renglones (trazo de 2).
(function (root) {
'use strict';
const D = root.Dibujos;
// Renglones: [x1, x2, y] cada uno.
const renglones = (P, filas, c = 'd') => filas.map(([x1, x2, y]) => P.l([[x1, y], [x2, y]], c)).join('');
const poli = (P, pts, c = 'b') => P.p('M' + pts.map(([x, y]) => `${P.n(x)} ${P.n(y)}`).join('L') + 'Z', c);
// Persona de busto: hombros y cabeza.
const persona = (P, x, y, c = 'b') => P.p(`M${x - 17} ${y + 30}Q${x - 17} ${y + 10} ${x} ${y + 10}Q${x + 17} ${y + 10} ${x + 17} ${y + 30}`, c) + P.c(x, y, 10, c);

D.registrar('razonamiento-verbal', {
  // El diccionario define: la palabra, la clase a la que pertenece y lo que la distingue.
  'razonamiento-verbal.definiciones': P =>
    [[24, 'm'], [50, 'b'], [76, 'm']].map(([y, c]) => P.r(128, y, 22, 20, c, 4)).join('') + P.r(12, 12, 126, 96, 'b', 6)
    + P.r(24, 26, 56, 16, 'a', 5) + P.t(96, 40, '=', 20) + renglones(P, [[24, 120, 62], [24, 110, 78], [24, 86, 94]]),
  // Analogía: la segunda pareja guarda la misma relación que la primera.
  'razonamiento-verbal.analogias': P =>
    P.r(14, 24, 14, 14, 'b', 2) + P.p('M34 31H54', 'd') + P.punta(58, 31, 0, 'tn') + P.r(64, 14, 34, 34, 'b', 3)
    + P.c(21, 89, 7, 'b') + P.p('M34 89H54', 'd') + P.punta(58, 89, 0, 'tn') + P.c(81, 89, 17, 'a')
    + [[126, 52], [126, 70], [144, 52], [144, 70]].map(([x, y]) => P.c(x, y, 4.5, 'tn')).join(''),
  // La palabra precisa es la que encaja en el hueco de la oración.
  'razonamiento-verbal.sentido-contextual': P =>
    P.r(14, 12, 34, 16, 'b', 5) + P.r(62, 12, 36, 16, 'a', 5) + P.r(112, 12, 34, 16, 'b', 5)
    + P.p('M80 32V52', 'd') + P.punta(80, 56, 90, 'tn')
    + renglones(P, [[14, 52, 72], [108, 146, 72], [14, 120, 96]]) + P.r(58, 62, 44, 18, 'g', 5),
  // El conector es la bisagra que une dos ideas y dice cómo se relacionan.
  'razonamiento-verbal.conectores': P =>
    P.r(8, 26, 60, 60, 'b', 5) + P.r(92, 26, 60, 60, 'b', 5) + renglones(P, [[16, 58, 42], [16, 54, 56], [16, 48, 70], [102, 144, 42], [102, 140, 56], [102, 132, 70]])
    + P.l([[80, 24], [80, 88]], 'd') + [32, 56, 80].map(y => P.r(72, y - 8, 16, 16, 'a', 4)).join('') + P.t(80, 112, 'pero', 16),
  // Se elimina la oración que sobra: la que repite o no habla del tema.
  'razonamiento-verbal.eliminacion-de-oraciones': P =>
    [16, 36, 76, 96].map(y => P.r(14, y, 104, 14, 'b', 4) + P.l([[22, y + 7], [100, y + 7]], 'f')).join('')
    + P.r(44, 56, 104, 14, 'a', 4) + P.l([[52, 63], [130, 63]], 'f') + P.l([[136, 58], [146, 68]], 'd') + P.l([[146, 58], [136, 68]], 'd'),
  // El plan de redacción ordena las oraciones: de 3, 1, 2 a 1, 2, 3.
  'razonamiento-verbal.plan-de-redaccion': P => {
    const carta = (x, y, n, c) => P.r(x, y, 30, 32, c, 5) + P.t(x + 15, y + 23, n, 18);
    return carta(22, 10, '3', 'b') + carta(65, 14, '1', 'b') + carta(108, 8, '2', 'b')
      + P.p('M80 52V66', 'd') + P.punta(80, 70, 90, 'tn')
      + carta(14, 78, '1', 'b') + carta(65, 78, '2', 'b') + carta(116, 78, '3', 'b') + P.ac('M46 94H63M97 94H114');
  },
  // El pronombre apunta a algo ya dicho: así se amarran las oraciones.
  'razonamiento-verbal.cohesion-y-coherencia': P =>
    renglones(P, [[14, 38, 38], [92, 146, 38], [14, 58, 86], [96, 146, 86]]) + P.r(44, 28, 42, 20, 'a', 5)
    + P.r(64, 76, 26, 20, 'b', 5) + P.t(77, 91, 'él', 14) + P.p('M74 74Q60 56 64 52', 'd') + P.punta(65, 50, -70, 'tn'),
  // Cada tipo de texto tiene su forma: narrar, exponer, argumentar.
  'razonamiento-verbal.tipologia-textual': P =>
    [8, 59, 110].map(x => P.r(x, 16, 42, 88, 'b', 5)).join('')
    + P.l([[22, 28], [22, 92]], 'd') + [30, 52, 74].map(y => P.c(22, y, 4.5, 'a') + P.l([[30, y], [42, y]], 'd')).join('')
    + [32, 52, 72, 92].map(y => P.c(68, y, 3, 'tn') + P.l([[76, y], [92, y]], 'd')).join('')
    + P.c(131, 42, 12, 'a') + P.t(131, 49, '!', 18) + renglones(P, [[118, 144, 72], [118, 140, 86]]),
  // La idea principal es la oración que se subraya: las demás la apoyan.
  'razonamiento-verbal.tema-e-idea-principal': P =>
    P.r(12, 39, 108, 16, 'a', 4) + renglones(P, [[18, 120, 24], [18, 114, 47], [18, 124, 70], [18, 100, 93]])
    + '<g transform="rotate(-40 132 48)">' + P.r(132, 40, 32, 16, 'b', 4) + P.p('M132 42L122 48L132 54Z', 'a') + '</g>',
  // Resumir es pasar mucho texto por un embudo y quedarse con lo esencial.
  'razonamiento-verbal.resumen-y-sintesis': P =>
    renglones(P, [[22, 138, 12], [28, 132, 22], [22, 136, 32]]) + P.p('M14 42H146L98 78V96H62V78Z', 'b')
    + P.ac('M64 110H96'),
  // Un texto discontinuo se lee en tablas y gráficos, no en párrafos.
  'razonamiento-verbal.textos-discontinuos': P =>
    P.r(10, 22, 64, 78, 'b', 4) + P.r(10, 22, 64, 18, 'm', 4) + P.l([[42, 22], [42, 100]], 'f')
    + [40, 60, 80].map(y => P.l([[10, y], [74, y]], 'f')).join('')
    + P.c(118, 61, 32, 'b') + P.p('M118 61H150A32 32 0 0 0 107.06 30.93Z', 'a') + P.l([[118, 61], [96, 84]], 'd'),
  // Inferir es leer entre líneas: lo que el texto no dice, pero se deduce.
  'razonamiento-verbal.inferencias': P =>
    renglones(P, [[12, 148, 22], [12, 148, 46], [12, 148, 70], [12, 120, 94]]) + poli(P, [[106, 81], [113, 75], [140, 103], [133, 109]], 'tn') + P.c(90, 58, 26, 'b')
    + renglones(P, [[72, 108, 46], [72, 108, 70]]) + P.ac('M74 58H106'),
  // Compatible es lo que encaja con el texto; lo que choca, no.
  'razonamiento-verbal.compatibilidad': P =>
    P.p('M10 14H64V28A9 9 0 0 1 64 46V60H10Z', 'b') + renglones(P, [[18, 52, 26], [18, 48, 38], [18, 54, 50]])
    + P.p('M64 14H114V60H64V46A9 9 0 0 0 64 28Z', 'a')
    + P.p('M48 74H100V112H48V102L36 93L48 84Z', 'b') + P.l([[112, 82], [130, 100]], 'd') + P.l([[130, 82], [112, 100]], 'd'),
  // Extrapolar es llevar la idea del texto a otro mundo: ¿y si…?
  'razonamiento-verbal.extrapolacion': P =>
    P.r(10, 22, 58, 76, 'b', 5) + renglones(P, [[18, 58, 38], [18, 54, 52], [18, 58, 66], [18, 46, 80]])
    + P.ac('M68 72Q96 96 112 64') + P.punta(113, 60, -76, 'tn')
    + P.c(126, 40, 18, 'm') + '<ellipse class="d" cx="126" cy="40" rx="30" ry="8" transform="rotate(-18 126 40)"/>' + P.c(126, 40, 18, 'm')
    + P.p('M97.47 49.27A30 8 -18 0 0 154.53 30.73', 'd'),
  // Dos textos enfrentados: la tesis de A choca con la de B.
  'razonamiento-verbal.textos-argumentativos-y-dialecticos': P => {
    const carta = (x, giro, letra) => `<g transform="rotate(${giro} ${x + 24} 62)">${P.r(x, 24, 48, 76, 'b', 5)}${P.t(x + 24, 48, letra, 20)}${renglones(P, [[x + 8, x + 40, 64], [x + 8, x + 36, 76], [x + 8, x + 40, 88]])}</g>`;
    return carta(8, -8, 'A') + carta(104, 8, 'B') + poli(P, [[80, 38], [86, 54], [98, 52], [88, 64], [94, 78], [80, 68], [66, 78], [72, 64], [62, 52], [74, 54]], 'a');
  },
  // El mismo mensaje cambia según quién lo dice, a quién y en qué situación.
  'razonamiento-verbal.texto-y-contexto': P =>
    P.r(6, 8, 148, 104, 'g', 14) + persona(P, 32, 62) + persona(P, 128, 62)
    + P.p('M50 40Q80 24 110 40', 'd') + P.punta(112, 42, 35, 'tn') + P.r(62, 48, 36, 26, 'a', 3) + P.l([[62, 49], [80, 62], [98, 49]], 'd'),
  // El texto científico prueba con experimentos; el filosófico pregunta y razona.
  'razonamiento-verbal.textos-filosoficos-y-cientificos': P =>
    P.p('M42 64L24 96a6 6 0 0 0 5 9H71a6 6 0 0 0 5-9L58 64Z', 'm') + P.p('M38 16H62M42 16V46L20 96a6 6 0 0 0 5 9H75a6 6 0 0 0 5-9L58 46V16', '')
    + P.c(116, 44, 26, 'a') + P.c(96, 80, 7, 'b') + P.c(86, 96, 4, 'b') + P.t(116, 54, '?', 28),
  // Leer en inglés: la idea principal se busca igual que en castellano.
  'razonamiento-verbal.lectura-en-ingles': P =>
    P.r(16, 20, 96, 88, 'b', 6) + renglones(P, [[28, 84, 40], [28, 100, 56], [28, 96, 72], [28, 74, 88]])
    + `<g transform="rotate(10 126 26)">${P.r(102, 12, 48, 28, 'a', 6)}${P.t(126, 32, 'EN', 17)}</g>`,
});
})(typeof self !== 'undefined' ? self : this);
