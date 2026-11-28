/*
 * Apertura de «Factorización» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * Tercera versión (27 nov, revisión): la anterior repartía un salón en filas iguales, muy parecida a
 * aritmetica/numeros-primos-y-divisores.js (el salón de 36 y 37), y su choque era de aritmética. El choque nuevo es
 * propio de la unidad: en papel cuadriculado, un cuadrado de 10 por 10 al que le falta una esquina de 3 por 3 parece
 * una L sin arreglo, y con un solo corte recto se rearma como un rectángulo exacto de 13 por 7 (100 − 9 = 13 · 7).
 * Encontrar de qué medidas sale un área es factorizar. Lo que el alumno se lleva va en ficha.seLleva. No adelanta
 * ninguna Predice (3x²(2x + 1), la de x⁴ − 16, el aspa de 2x² + 7x + 3, el 6x² del aspa doble, x + 3, x − 1) ni los
 * valores de las misiones (el 12 y el 11 se evitan: por eso el cuadrado es de 10 y la esquina de 3). Colores de la
 * unidad (cabecera de contenido/teoria/algebra/factorizacion.js): un factor, el ancho, en turquesa (c-i); el otro, el
 * largo, en violeta (c-f), y lo que falta, la esquina, en naranja (c-o).
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const ancho = t => ({ v: 'c-i', t }), largo = t => ({ v: 'c-f', t }), falta = t => ({ v: 'c-o', t });

  // Papel cuadriculado con la misma escala en los dos paneles (C px por cuadradito).
  const C = 14;
  const cuadricula = (x, y, cols, filas, hueco) => {
    let s = '';
    for (let f = 0; f < filas; f++) for (let c = 0; c < cols; c++) {
      if (hueco && hueco(c, f)) continue;
      s += `<rect x="${x + c * C}" y="${y + f * C}" width="${C}" height="${C}" style="fill:var(--card);stroke:var(--line)" stroke-width="1"/>`;
    }
    return s;
  };
  const Y0 = 62;
  // «Lo que predice»: la L (10 por 10 sin la esquina de 3 por 3 de arriba a la derecha), con el hueco marcado.
  const predice = (x0) => {
    const cx = x0 + 130, x = cx - 5 * C, y = Y0;
    const borde = `M${x} ${y}h${7 * C}v${3 * C}h${3 * C}v${7 * C}h${-10 * C}z`;
    return `<text x="${cx}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">Lo que predice</text>
      ${cuadricula(x, y, 10, 10, (c, f) => c >= 7 && f < 3)}
      <path d="${borde}" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>
      <rect x="${x + 7 * C}" y="${y}" width="${3 * C}" height="${3 * C}" style="fill:var(--c-o);stroke:var(--c-o)" fill-opacity=".15" stroke-width="2.5" stroke-dasharray="5 4"/>
      <text x="${x + 8.5 * C}" y="${y + 1.5 * C + 7}" text-anchor="middle" font-size="18" font-weight="800" style="fill:var(--c-o)">3</text>
      <text x="${cx}" y="${y + 10 * C + 24}" text-anchor="middle" font-size="18" font-weight="700" fill="currentColor">10</text>
      <text x="${x - 10}" y="${y + 5 * C + 6}" text-anchor="end" font-size="18" font-weight="700" fill="currentColor">10</text>
      <text x="${cx}" y="${Y0 + 10 * C + 62}" text-anchor="middle" font-size="21" style="fill:var(--muted)">Pieza mordida:</text>
      <text x="${cx}" y="${Y0 + 10 * C + 86}" text-anchor="middle" font-size="21" style="fill:var(--muted)">siempre un escalón</text>`;
  };
  // «Lo que se mide»: el rectángulo de 13 por 7, hecho con el bloque de 10 por 7 y la tira de 3 por 7 girada.
  const mide = (x0) => {
    const cx = x0 + 130, x = cx - 6.5 * C, y = Y0 + 3 * C;
    return `<text x="${cx}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">Lo que se mide</text>
      ${cuadricula(x, y, 13, 7)}
      <rect x="${x}" y="${y}" width="${13 * C}" height="${7 * C}" fill="none" stroke="currentColor" stroke-width="2.5"/>
      <line x1="${x + 10 * C}" y1="${y}" x2="${x + 10 * C}" y2="${y + 7 * C}" stroke="currentColor" stroke-width="2.5" stroke-dasharray="6 4"/>
      <line x1="${x}" y1="${y - 10}" x2="${x + 13 * C}" y2="${y - 10}" style="stroke:var(--c-f)" stroke-width="3" stroke-linecap="round"/>
      <text x="${cx}" y="${y - 18}" text-anchor="middle" font-size="20" font-weight="800" style="fill:var(--c-f)">13</text>
      <line x1="${x - 10}" y1="${y}" x2="${x - 10}" y2="${y + 7 * C}" style="stroke:var(--c-i)" stroke-width="3" stroke-linecap="round"/>
      <text x="${x - 16}" y="${y + 3.5 * C + 7}" text-anchor="end" font-size="20" font-weight="800" style="fill:var(--c-i)">7</text>
      <text x="${cx}" y="${Y0 + 10 * C + 62}" text-anchor="middle" font-size="21" style="fill:var(--muted)">Con un solo corte:</text>
      <text x="${cx}" y="${Y0 + 10 * C + 86}" text-anchor="middle" font-size="21" style="fill:var(--muted)">un rectángulo exacto</text>`;
  };
  const svg = `<svg viewBox="0 0 520 300" width="520" height="300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="290" style="stroke:var(--line)" stroke-width="2"/>
    ${predice(0)}${mide(260)}
  </svg>`;

  return {
    unidad: 'algebra.factorizacion',
    titulo: '¿Cómo puede un cuadrado sin una esquina volverse un rectángulo exacto?',
    parrafos: [
      ['En una hoja de cuaderno cuadriculado, dibuja un cuadrado de 10 cuadraditos por lado y recórtale una esquina de ',
        falta('3 por 3'), ', como si le hubieran dado un mordisco. ',
        'Te queda una pieza en forma de L con 91 cuadraditos. ',
        'Si la cortas con un solo tijeretazo recto y pones uno de los pedazos, girado, al costado del otro, se forma un rectángulo completo de ',
        largo('13 cuadraditos'), ' de largo y ', ancho('7'), ' de ancho, sin huecos ni escalones.'],
      ['Si te piden armar un rectángulo con esa pieza, lo natural es pensar que no se puede, porque al mover un pedazo el hueco de la esquina reaparece en otro lado como un escalón. ',
        'Contar los 91 cuadraditos y buscar dos números que multiplicados den 91 cuesta trabajo, porque 91 parece no partirse de ninguna manera. ',
        'Y aunque encuentres 13 por 7, esa cuenta no dice qué medidas tendría el rectángulo con un cuadrado o una esquina de otro tamaño.'],
      ['La L no tenía forma de rectángulo, pero tenía el área justa de uno, y sus dos medidas salen de cómo está hecha la pieza, no de probar números al azar. ',
        'Escribir un área como el producto de dos medidas, es decir, descubrir de qué rectángulo sale, se llama factorizar, y en esta unidad se factorizan polinomios, las expresiones con letras que sirven para piezas de cualquier tamaño.'],
    ],
    ecuacion: ['100 − ', falta('9'), ' = ', largo('13'), ' × ', ancho('7')],
    ecuacionAntes: 3,
    figura: {
      antes: 2,
      svg,
      alt: 'Dos dibujos en papel cuadriculado con la misma escala. Lo que predice la idea de que una pieza mordida sigue mordida: un cuadrado de 10 por 10 cuadraditos al que le falta una esquina de 3 por 3, que deja un escalón. Lo que se mide: con un solo corte, la misma pieza se rearma como un rectángulo exacto de 13 por 7 cuadraditos.',
    },
    pregunta: 'Si el cuadrado fuera de 8 cuadraditos por lado y le recortaras una esquina de 2 por 2, ¿qué medidas crees que tendría el rectángulo?',
    ficha: {
      seLleva: 'Una pieza que no parece rectángulo puede rearmarse como uno sin perder nada: un cuadrado de 10 sin una esquina de 3 se vuelve un rectángulo exacto de 13 por 7, y esas medidas salen de la forma de la pieza, no de probar números.',
      alcance: 'Parcial (núcleo: espacio y forma, y cambio y relaciones; un área se puede reacomodar y escribir como producto de dos medidas; la factorización de polinomios y sus métodos, como el aspa, son formalismo). Deducción propia con el marco de Matemática 2022.',
      choque: 'La idea de que una pieza mordida sigue mordida predice que la L de 91 cuadraditos deja siempre un escalón, y con un solo corte se rearma como un rectángulo exacto de 13 por 7.',
      atajo: 'Contar los 91 cuadraditos y buscar sus divisores da 13 por 7 (y 91 por 1), pero no dice cómo acomodar los pedazos ni qué pasa con otro cuadrado u otra esquina; eso lo dice la factorización (aquí, 10² − 3² = (10 + 3)(10 − 3)).',
      porVerificar: [
        'Las cuentas son cálculo: 100 − 9 = 91 = 13 · 7, y con un cuadrado de 8 y una esquina de 2, 64 − 4 = 60 = 10 · 6. El corte va entre la tira de 3 por 7 de arriba y el bloque de 10 por 7 de abajo; la tira se gira y se pone al costado del bloque.',
      ],
      notas: [
        'Coherencia con la unidad (28 nov): responde en la idea 2 (productos notables al revés): «un cuadrado menos otro» se factoriza como (a + b)(a − b), y con eso la pregunta da 10 por 6. El corte y el giro de la L no están en esta unidad: están en la idea 2 de «Productos notables» (el triplay de 10 dm sin una esquina de 2), que la idea 2 de aquí cita en su tarjeta «Lo viste en Productos notables». Se actualizó la nota que nombraba el queque de División de polinomios, que ya no existe.',
        'Tercera pasada (27 nov): sin cuentas con operadores metidas en la oración (el «13 por 7» del párrafo 2 es un dato dicho en palabras, y la cuenta ya está en la ecuación aparte). En la ecuación, el punto entre 13 y 7 pasó a × porque entre números la casa escribe ×. Sin palabras de doble sentido («cuenta» y «producto» solo con su sentido de cálculo).',
        'Doble revisión (27 nov): el choque es honesto. La predicción y lo medido hablan de la misma pieza de 91 cuadraditos, y las cuentas cuadran (la tira de arriba, de 7 por 3, se gira y se pone al costado del bloque de 10 por 7: 13 por 7). Que 91 parezca primo es un tropiezo real, y que una L no se pueda volver rectángulo con un solo corte es lo que espera quien no lo ha probado; el alumno lo comprueba con tijera y cuaderno. Solo cambió la primera oración del párrafo 2: «Lo que uno espera es que una pieza mordida siga mordida» era impersonal y vago, y ahora dice qué se pensaría ante el encargo concreto, de tú.',
        'Tercera versión (27 nov), del revisor: la anterior repartía un salón en filas iguales (muy parecida a aritmetica/numeros-primos-y-divisores.js) y su choque era de aritmética. Gerson pidió un choque propio de la unidad; este es «volver a armar un rectángulo y encontrar de qué medidas sale un área».',
        'La pregunta se puede intentar dibujando en el cuaderno: sale un rectángulo de 10 por 6. Abre la idea 2 (productos notables al revés) sin responder su Predice, que es la de x⁴ − 16, y la idea 1 (escribir como producto).',
        'El cuadrado es de 10 y la esquina de 3 porque la prueba de «no delata» marca el 12 y el 11 (están en los aciertos de las misiones); con una esquina de 1 o de 2 saldrían 11 o 12.',
        'Contenido, para Gerson: detrás de la pieza está la diferencia de cuadrados, que también sostenía la versión del queque de la apertura de División de polinomios; esa versión se cambió por la estafa piramidal (un cociente notable), así que ya no se repite la identidad.',
      ],
    },
  };
})());
