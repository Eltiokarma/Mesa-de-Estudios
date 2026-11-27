/*
 * Apertura de «Arreglos numéricos y cuadrados mágicos» (docs/metodo/apertura-pisa.md; criterio en
 * docs/metodo/entrada-pisa.md). Escrita desde cero (27 nov). El choque está en la caja del supermercado: si una mancha
 * hace que el lector confunda una sola cifra del código de barras, el lector no pita, aunque no sepa qué producto tiene
 * delante. La razón es que las 13 cifras no son libres: la última la decide una cuenta con las otras 12. Lo que el alumno
 * se lleva (ficha.seLleva): cuando unos números deben cumplir una cuenta, no todos se eligen a gusto; es lo que se usa en
 * los cuadrados mágicos. La unidad anterior de la rama (Razonamiento inductivo) abre con un tablero de ajedrez; esta, con
 * un objeto de la tienda.
 * No adelanta ninguna Predice: ni el reparto de 2, 4, 6, 8 y 10 (idea 1), ni la suma por lado del marco triangular (idea
 * 2), ni la mayor suma del marco cuadrado (idea 3), ni el centro del cuadrado mágico (idea 4), ni el del que multiplica
 * (idea 5) ni la cima del muro de adobes (idea 6). No escribe ninguna suma común ni ningún centro.
 * Colores de la unidad (cabecera de contenido/teoria/razonamiento-matematico/arreglos-numericos.js): las barras y las
 * cifras en tinta; la cifra que se busca, la que la cuenta decide, en carmín (c-h, la x de la unidad). Sin verde.
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const ultima = t => ({ v: 'c-h', t });

  // Código EAN-13 de ejemplo, con el prefijo 775 del Perú y su cifra de control bien calculada (775123456789 → 2).
  const CIFRAS = '7751234567892';
  const L = ['0001101', '0011001', '0010011', '0111101', '0100011', '0110001', '0101111', '0111011', '0110111', '0001011'];
  const G = L.map(c => [...c].map(b => (b === '0' ? '1' : '0')).reverse().join(''));
  const R = L.map(c => [...c].map(b => (b === '0' ? '1' : '0')).join(''));
  const PARIDAD = ['LLLLLL', 'LLGLGG', 'LLGGLG', 'LLGGGL', 'LGLLGG', 'LGGLLG', 'LGGGLL', 'LGLGLG', 'LGLGGL', 'LGGLGL'];
  const modulos = (() => {
    const d = [...CIFRAS].map(Number), p = PARIDAD[d[0]];
    let m = '101';
    for (let i = 1; i <= 6; i++) m += (p[i - 1] === 'L' ? L : G)[d[i]];
    m += '01010';
    for (let i = 7; i <= 12; i++) m += R[d[i]];
    return m + '101';
  })();
  const GUARDA = new Set([0, 1, 2, 45, 46, 47, 48, 49, 92, 93, 94]);

  const W = 2, X = 40, Y = 66, ALTO = 104;
  const barras = x0 => [...modulos].map((b, i) => (b === '1'
    ? `<rect x="${x0 + X + i * W}" y="${Y}" width="${W}" height="${ALTO + (GUARDA.has(i) ? 10 : 0)}" fill="currentColor"/>` : '')).join('');
  // Cifras bajo las barras; la quinta del grupo izquierdo queda bajo la mancha y se lee «?».
  const cifras = x0 => {
    const t = (x, c, extra = '') => `<text x="${x}" y="${Y + ALTO + 26}" text-anchor="middle" font-size="18" font-weight="700" fill="currentColor"${extra}>${c}</text>`;
    let s = t(x0 + X - 10, CIFRAS[0]);
    for (let i = 1; i <= 6; i++) s += t(x0 + X + (3 + (i - 1) * 7 + 3.5) * W, i === 5 ? '?' : CIFRAS[i]);
    for (let i = 7; i <= 11; i++) s += t(x0 + X + (50 + (i - 7) * 7 + 3.5) * W, CIFRAS[i]);
    const xu = x0 + X + (50 + 5 * 7 + 3.5) * W;
    return s + `<rect x="${xu - 10}" y="${Y + ALTO + 8}" width="20" height="25" rx="4" fill="none" style="stroke:var(--c-h)" stroke-width="2.5"/>`
      + t(xu, CIFRAS[12], ' style="fill:var(--c-h)"');
  };
  const mancha = x0 => {
    const cx = x0 + X + (3 + 4 * 7 + 3.5) * W, cy = Y + 58;
    return `<path d="M${cx - 15} ${cy - 20}q14 -10 26 -2q10 10 4 24q-4 14 -18 14q-16 -2 -18 -16q-2 -12 6 -20Z" style="fill:var(--muted)" fill-opacity=".85"/>`;
  };
  const sonido = (x, y, sale) => `<text x="${x}" y="${y}" text-anchor="middle" font-size="28" font-weight="800" style="fill:${sale ? 'currentColor' : 'var(--muted)'}">¡pip!</text>
      ${sale ? `<path d="M${x + 46} ${y - 24}q8 9 0 18M${x + 54} ${y - 30}q14 15 0 30M${x - 46} ${y - 24}q-8 9 0 18M${x - 54} ${y - 30}q-14 15 0 30" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>`
        : `<line x1="${x - 44}" y1="${y - 26}" x2="${x + 44}" y2="${y + 6}" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>`}`;
  const pie = (cx, l) => l.map((x, i) => `<text x="${cx}" y="${328 + i * 25}" text-anchor="middle" font-size="21" style="fill:var(--muted)">${x}</text>`).join('');

  const panel = (x0, titulo, sale, pieTxt) => {
    const cx = x0 + 130;
    return `<text x="${cx}" y="34" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      <rect x="${x0 + 16}" y="54" width="228" height="160" rx="8" style="fill:var(--card)" stroke="currentColor" stroke-width="2"/>
      ${barras(x0)}${mancha(x0)}${cifras(x0)}
      ${sonido(cx, 268, sale)}
      ${pie(cx, pieTxt)}`;
  };
  const svg = `<svg viewBox="0 0 520 372" width="520" height="372" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="362" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', true, ['Una cifra mal leída:', 'registra otro producto'])}
    ${panel(260, 'Lo que se mide', false, ['Una cifra mal leída:', 'no pita ni registra'])}
  </svg>`;

  return {
    unidad: 'razonamiento-matematico.arreglos-numericos',
    titulo: '¿Cómo sabe el lector de la caja que leyó mal un código de barras?',
    parrafos: [
      ['En la caja del supermercado, el lector pasa su luz sobre las barras de cada producto y pita cuando reconoce las 13 cifras impresas debajo, que en muchos productos peruanos empiezan con 775. ',
        'Si una mancha o una arruga hace que confunda una sola de esas cifras, el lector no pita, y la cajera tiene que pasar el producto otra vez o teclear el código.'],
      ['Parece que el lector no tendría cómo darse cuenta, porque no sabe qué producto le pusieron delante y lo único que ve son barras. ',
        'Con 13 cifras cualesquiera, una cifra mal leída solo daría otro código, y el lector registraría otro producto o uno que no existe, sin enterarse de que se equivocó.'],
      ['Lo que el lector usa es que las 13 cifras no son libres, porque ', ultima('la última'), ' se calcula con una cuenta a partir de las otras 12, y si una cifra cambia, la cuenta deja de cuadrar. ',
        'En los cuadrados mágicos y en los demás arreglos numéricos de esta unidad pasa algo parecido, porque sus números también tienen que cumplir una cuenta y no se pueden elegir todos a gusto.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos dibujos del mismo código de barras de 13 cifras, con una mancha que tapa una cifra y la última cifra marcada. Lo que predice la idea de que el lector solo ve barras: pita y registra otro producto. Lo que se mide: el lector no pita ni registra nada, porque la cuenta de las cifras no cuadra.',
    },
    pregunta: 'En una boleta, el total es la suma de los precios. Si una mancha tapa uno de los precios y ves los demás y el total, ¿puedes saber cuánto era el precio tapado?',
    ficha: {
      seLleva: 'Cuando unos números tienen que cumplir una cuenta, no son todos libres: la última cifra de un código de barras la deciden las otras 12, y por eso el lector de la caja descubre una cifra mal leída.',
      alcance: 'Parcial (deducción propia con el marco de Matemática PISA 2022: cantidad y razonamiento con números en un contexto real; los cuadrados mágicos como técnica de examen no son contenido PISA).',
      choque: 'Se cree que el lector, que solo ve barras, registraría otro producto con una cifra mal leída; en la caja, no pita, porque la cuenta de las 13 cifras no cuadra.',
      atajo: 'La explicación de que el lector compara con la lista de productos de la tienda: el código de una cifra cambiada falla la cuenta antes de buscar nada, y un lector suelto, sin ninguna lista, tampoco lo acepta. Se descarta en la ficha y no en el texto, para no alargar el párrafo 2.',
      porVerificar: [
        'Que los códigos de los productos hechos en el Perú empiecen con 775 (prefijo GS1 del Perú, de memoria).',
        'La cifra de control del EAN-13: se suman las cifras de los lugares impares, más tres veces las de los lugares pares (de las 12 primeras), y la última es lo que falta para llegar al siguiente múltiplo de diez. Con 775123456789 la suma da 128 y la cifra es 2. Cambiar una sola cifra cambia siempre la suma en algo que no es múltiplo de diez (1 y 3 no tienen factores comunes con 10), así que el error se detecta siempre. Cálculo propio; confirmar con la norma GS1.',
        'Que el lector «no pita» con una cifra mal leída: los lectores comprueban la cifra de control en cada lectura y descartan la que no cuadra (de memoria); también puede no pitar por otras razones (código muy dañado). El texto dice «no pita», sin afirmar que sea la única causa.',
        'El código del dibujo (7751234567892) es un ejemplo con su cifra de control bien calculada; no es el de un producto real. Las barras siguen la codificación EAN-13 (grupos L y G según la primera cifra, R a la derecha).',
      ],
      notas: [
        'La figura no dice qué cifra es la que la mancha tapa: se lee «?». La cifra marcada en carmín es la de control, la que la cuenta decide.',
        'La pregunta compara el código con una boleta (los dos tienen un número que se calcula con los demás) y se puede pensar sin la teoría: el precio tapado es el total menos los otros precios. Es la misma obligación de la que vive la unidad, sin usar un objeto de la unidad.',
        'Revisión del Escribidor Escribano (27 nov, otro agente): la pregunta hablaba de un cuadrado de 3 × 3 con filas de igual suma y preguntaba si hay casillas obligadas por las demás. Es el objeto de la idea 4, y empujar a responder «sí, hay casillas fijas» le resta a dos distractores de la unidad: «Cualquiera de los nueve» (Predice de la idea 4, el centro) y «No se sabe sin las otras casillas» (idea 5); ahora pregunta por una boleta. La última oración del párrafo 3 decía que la obligación «es la que permite resolverlos», que ya es el método de la unidad; se recortó. El 775 se presentaba como ejemplo de las 13 cifras («como el 775»), cuando es su comienzo.',
        'Para Gerson: el párrafo 3 explica el mecanismo del código (la última cifra sale de una cuenta) sin dar la cuenta, y pasa a los cuadrados mágicos con una frase general. Es la salida del choque y lo que sostiene seLleva.',
      ],
    },
  };
})());
