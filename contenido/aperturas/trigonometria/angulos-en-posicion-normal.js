/*
 * Apertura de «Ángulos en posición normal» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * El choque son los dos pedales de una bicicleta: sus bielas arman el mismo triángulo rectángulo, con los mismos lados
 * y las mismas razones, y sin embargo un pedal está arriba y adelante y el otro abajo y atrás. Lo que el alumno se
 * lleva va en ficha.seLleva. No usa los objetos de las Predice y las misiones (la casa de Luis y la plaza, la cabina de
 * la rueda, la flecha que apunta al norte, el minutero, la válvula) ni da sus respuestas (−12/13, «Positivo», «No está
 * definida», «En el I», 1/2); tampoco escribe los números de las misiones (30, 45, 150, 16, 40…): los ángulos de las
 * bielas no se escriben. Colores de la unidad (cabecera de contenido/teoria/trigonometria/angulos-en-posicion-normal.js):
 * lo vertical, la ordenada y, en naranja (c-o); lo horizontal, la abscisa x, en turquesa (c-i); la biela, que es el
 * radio vector r, en tinta.
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const y = t => ({ v: 'c-o', t }), x = t => ({ v: 'c-i', t });
  const r1 = n => Math.round(n * 10) / 10;
  // La bicicleta vista desde su lado derecho, con la marcha hacia la derecha. Biela de 17 cm (1 cm = 6,5 unidades),
  // inclinada de modo que su pedal queda 14,7 cm arriba y 8,5 cm adelante del eje.
  const CY = 190, K = 6.5, DX = 8.5 * K, DY = 14.72 * K;
  const pedal = (px, py) => `<rect x="${r1(px - 15)}" y="${r1(py - 5)}" width="30" height="10" rx="3" style="fill:var(--card)" stroke="currentColor" stroke-width="3"/>`;
  // El plato (la rueda dentada de la cadena) va detrás, en gris, para que se reconozca la bicicleta.
  // Una biela con su triángulo: el tramo horizontal en turquesa sobre la línea del eje y el vertical en naranja.
  const biela = (cx, sx, sy, rx, ry) => {
    const px = cx + sx * DX, py = CY - sy * DY;
    return `<line x1="${cx}" y1="${CY}" x2="${r1(px)}" y2="${CY}" style="stroke:var(--c-i)" stroke-width="5" stroke-linecap="round"/>
      <line x1="${r1(px)}" y1="${CY}" x2="${r1(px)}" y2="${r1(py)}" style="stroke:var(--c-o)" stroke-width="5" stroke-linecap="round"/>
      <line x1="${cx}" y1="${CY}" x2="${r1(px)}" y2="${r1(py)}" stroke="currentColor" stroke-width="8" stroke-linecap="round"/>
      ${pedal(px, py)}
      <text x="${r1(px + sx * 6)}" y="${r1(CY - sy * DY / 2 + 7)}" text-anchor="${sx > 0 ? 'start' : 'end'}" font-size="16" font-weight="800" style="fill:var(--c-o)">${ry}</text>
      <text x="${r1(cx + sx * (DX + 4))}" y="${r1(CY + (sy > 0 ? 26 : -14))}" text-anchor="${sx > 0 ? 'start' : 'end'}" font-size="18" font-weight="800" style="fill:var(--c-i)">${rx}</text>`;
  };
  const panel = (x0, titulo, real, pie) => {
    const cx = x0 + 130;
    const dientes = Array.from({ length: 24 }, (_, i) => { const a = i * Math.PI / 12; return `<line x1="${r1(cx + 30 * Math.cos(a))}" y1="${r1(CY + 30 * Math.sin(a))}" x2="${r1(cx + 36 * Math.cos(a))}" y2="${r1(CY + 36 * Math.sin(a))}" style="stroke:var(--muted)" stroke-width="4"/>`; }).join('');
    return `<text x="${cx}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      <circle cx="${cx}" cy="${CY}" r="31" style="fill:var(--card);stroke:var(--muted)" stroke-width="3"/>${dientes}
      ${biela(cx, 1, 1, '8,5 cm', '14,7 cm')}
      ${real ? biela(cx, -1, -1, '8,5 cm', '14,7 cm') : `<text x="${r1(cx + DX)}" y="${r1(CY - DY - 16)}" text-anchor="middle" font-size="18" font-weight="800" fill="currentColor">los dos pedales</text>`}
      ${real ? `<text x="${r1(cx + DX)}" y="${r1(CY - DY - 16)}" text-anchor="middle" font-size="18" font-weight="800" fill="currentColor">derecho</text>
      <text x="${r1(cx - DX)}" y="${r1(CY + DY + 30)}" text-anchor="middle" font-size="18" font-weight="800" fill="currentColor">izquierdo</text>` : ''}
      <circle cx="${cx}" cy="${CY}" r="7" fill="currentColor"/>
      ${pie.map((l, i) => `<text x="${cx}" y="${374 + i * 26}" text-anchor="middle" font-size="22" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 412" width="520" height="412" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="402" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', false, ['Mismo triángulo:', 'mismo lugar'])}
    ${panel(260, 'Lo que se mide', true, ['Mismo triángulo:', 'lugares opuestos'])}
  </svg>`;

  return {
    unidad: 'trigonometria.angulos-en-posicion-normal',
    titulo: '¿Por qué dos pedales que arman el mismo triángulo están en lugares opuestos?',
    parrafos: [
      ['En una bicicleta, cada pedal va en la punta de una biela, la barra que lo une al eje, y en las bicicletas de adulto la biela suele medir unos 17 cm. ',
        'Las dos bielas apuntan siempre en sentidos contrarios, así que, cuando el pedal derecho está ', y('14,7 cm'), ' más arriba que el eje y ',
        x('8,5 cm'), ' más adelante, el izquierdo está ', y('14,7 cm'), ' más abajo y ', x('8,5 cm'), ' más atrás.'],
      ['Con lo que sabes de triángulos rectángulos, cada biela arma un triángulo con una hipotenusa de 17 cm y catetos de 14,7 cm y 8,5 cm, y los dos triángulos son idénticos, con las mismas razones trigonométricas. ',
        'Según esas razones, nada distingue un pedal del otro, aunque uno está arriba, cerca de tu rodilla, y el otro abajo, cerca del piso.'],
      ['Los lados de un triángulo siempre se miden en positivo, así que no dicen hacia dónde apunta la biela: adelante o atrás, arriba o abajo. ',
        'Para que los números también digan hacia dónde apunta cada biela, hace falta otra manera de medirla, y de eso tratan los ángulos en posición normal, el tema de esta unidad.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos dibujos del eje de los pedales de una bicicleta vista de lado. Lo que predice el triángulo: las dos bielas de 17 cm arman el mismo triángulo, de 14,7 cm y 8,5 cm, y los dos pedales quedarían en el mismo lugar. Lo que se mide: el pedal derecho está 14,7 cm arriba y 8,5 cm adelante del eje, y el izquierdo, 14,7 cm abajo y 8,5 cm atrás.',
    },
    pregunta: 'Si al pedal que está 14,7 cm arriba del eje le das el número 14,7, ¿qué número le darías al que está 14,7 cm abajo, para que se note la diferencia?',
    ficha: {
      seLleva: 'Los lados de un triángulo solo dicen cuánto se aleja algo, no hacia dónde; para ubicar un punto que gira, como un pedal, hace falta además un signo que diga adelante o atrás, arriba o abajo.',
      alcance: 'Parcial (deducción propia con el marco de Matemática 2022: espacio y forma, ubicar con coordenadas y números con signo; las razones de ángulos en posición normal no entran en PISA).',
      choque: 'Las dos bielas arman el mismo triángulo y tendrían las mismas razones, y sus pedales están en lugares opuestos: uno arriba y adelante, el otro abajo y atrás.',
      atajo: 'Decir «arriba» o «abajo» con palabras distingue los pedales, pero no entra en una cuenta: el triángulo y sus razones siguen siendo iguales. El texto no lo menciona; la pregunta lleva a la salida (un número con signo) sin darla.',
      porVerificar: [
        'Largo de biela de una bicicleta de adulto: 165 a 175 mm, con 170 mm muy común (de memoria; las de niño son más cortas).',
        'Los 14,7 cm y 8,5 cm salen del cálculo con la biela a 60° de la horizontal (17 · sen 60° ≈ 14,7 y 17 · cos 60° = 8,5), no de una medición; el texto no escribe el ángulo.',
      ],
      notas: [
        'La pregunta se responde con lo que el alumno ya sabe de los números negativos (−14,7) y abre la idea 1 (las razones salen de x, y y r) y la 2 (el signo sale del cuadrante) sin nombrarlas.',
        'El panel «Lo que predice» dibuja una sola biela con los dos pedales encima: lo que el triángulo no distingue.',
        'Revisión del Escribidor Escribano (27 nov): a 390 px, el rótulo «14,7 cm» del pedal derecho se salía del borde del dibujo; se acercó a la barra y bajó de 18 a 16 de letra.',
        'Revisión del Escribidor Escribano (27 nov): el párrafo 3 explicaba el método (poner el eje en el origen de un plano de coordenadas y medir desde ahí), que además dejaba lista la respuesta de la pregunta (−14,7): se cambió por «hace falta otra manera de medirla». En el párrafo 2, «los dos pedales serían iguales» no decía iguales en qué; ahora «nada distingue un pedal del otro», y los pedales «están» arriba y abajo en vez de «subir» y «bajar», porque la figura los muestra quietos.',
        'Contenido, para Gerson: el choque es más débil que los otros, porque nadie cree de verdad que los dos pedales estén en el mismo lugar; lo que choca es que la descripción por triángulos no los distinga. Se entiende sin el tema, pero sorprende poco. El párrafo 1 dice «está» (no condicional): los 14,7 cm y 8,5 cm son cálculo, pero el texto no los presenta como medidos, sino como consecuencia de las bielas opuestas.',
      ],
    },
  };
})());
