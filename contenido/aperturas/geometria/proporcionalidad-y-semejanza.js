/*
 * Apertura de «Proporcionalidad y semejanza» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * El choque sale del estudio de fotografía: una foto de 10 cm por 15 cm ampliada a 20 cm por 25 cm no sale entera (se
 * cortan 5 cm), aunque al ancho y al alto se les sume lo mismo. Lo que el alumno se lleva va en ficha.seLleva: para
 * agrandar sin deformar ni recortar, el ancho y el alto se multiplican por lo mismo. No se habla de áreas, para no
 * adelantar la Predice de la idea 5 (el terreno partido por los puntos medios) ni su misión (la foto de 9 veces el
 * área), ni de sombras y postes (idea 3), y no se escribe ningún número de las respuestas o misiones (50, 60, 75, 1,5,
 * 2,4, 4,5). Colores de la unidad (cabecera de contenido/teoria/geometria/proporcionalidad-y-semejanza.js): el ancho en
 * naranja (c-o) y el alto en turquesa (c-i), como el segmento de arriba y el de abajo de una razón; lo que se corta,
 * punteado en carmín (c-h).
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const ancho = t => ({ v: 'c-o', t }), alto = t => ({ v: 'c-i', t });
  const r1 = n => Math.round(n * 10) / 10;

  // La foto, en centímetros de la foto chica (10 de ancho por 15 de alto): cerros, sol y una persona de cuerpo entero,
  // de la cabeza (1,5) a los zapatos (14,5). `escena(X, Y, s)` la dibuja desde (X, Y) con s unidades por centímetro.
  const escena = (X, Y, s, ox = 0, oy = 0) => {
    const p = (x, y) => `${r1(X + (x + ox) * s)} ${r1(Y + (y + oy) * s)}`;
    return `<circle cx="${r1(X + (8 + ox) * s)}" cy="${r1(Y + (2.6 + oy) * s)}" r="${r1(1.1 * s)}" style="fill:var(--muted)" fill-opacity=".45"/>
      <path d="M${p(0, 9)}L${p(2.6, 6.4)}L${p(4.8, 8.4)}L${p(7.4, 5.6)}L${p(10, 8.2)}" fill="none" style="stroke:var(--muted)" stroke-width="${r1(0.22 * s)}" stroke-linejoin="round"/>
      <line x1="${r1(X + ox * s)}" y1="${r1(Y + (14.6 + oy) * s)}" x2="${r1(X + (10 + ox) * s)}" y2="${r1(Y + (14.6 + oy) * s)}" style="stroke:var(--muted)" stroke-width="${r1(0.18 * s)}"/>
      <g fill="currentColor">
        <circle cx="${r1(X + (5 + ox) * s)}" cy="${r1(Y + (2.7 + oy) * s)}" r="${r1(1.2 * s)}"/>
        <path d="M${p(3.7, 4.3)}H${p(6.3, 4.3).split(' ')[0]}L${p(6.6, 9.6)}H${p(3.4, 9.6).split(' ')[0]}Z"/>
        <path d="M${p(4, 9.4)}L${p(4.2, 13.9)}H${p(4.9, 13.9).split(' ')[0]}L${p(5, 9.4)}ZM${p(5, 9.4)}L${p(5.1, 13.9)}H${p(5.8, 13.9).split(' ')[0]}L${p(6, 9.4)}Z"/>
        <path d="M${p(3.6, 13.8)}H${p(5, 13.8).split(' ')[0]}V${p(5, 14.5).split(' ')[1]}H${p(3.6, 14.5).split(' ')[0]}ZM${p(5, 13.8)}H${p(6.4, 13.8).split(' ')[0]}V${p(6.4, 14.5).split(' ')[1]}H${p(5, 14.5).split(' ')[0]}Z"/>
      </g>`;
  };
  const rotulo = (x, y, t, c, ancla = 'middle') => `<text x="${r1(x)}" y="${r1(y)}" text-anchor="${ancla}" font-size="18" font-weight="800" style="fill:var(${c})">${t}</text>`;
  const marco = (x, y, w, h) => `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" style="fill:var(--card)"/>`;
  const borde = (x, y, w, h) => `<path d="M${r1(x)} ${r1(y + h)}H${r1(x + w)}" style="stroke:var(--c-o)" stroke-width="4"/>
      <path d="M${r1(x + w)} ${r1(y)}V${r1(y + h)}" style="stroke:var(--c-i)" stroke-width="4"/>
      <path d="M${r1(x)} ${r1(y + h)}V${r1(y)}H${r1(x + w)}" fill="none" stroke="currentColor" stroke-width="2"/>`;

  // Los dos paneles: arriba la foto chica (5 unidades por cm) y abajo la ampliación en papel de 20 por 25 (7 por cm).
  const C = 5, S = 7, PX = 60, PY = 172;
  const panel = (x0, titulo, predice, pie) => {
    const cx = x0 + 130, fx = x0 + 105, fy = 50, px = x0 + PX, py = PY, W = 20 * S, H = 25 * S;
    let grande;
    if (predice) {
      // Lo que se espera: la foto entera en el papel grande (dibujo sin escala, solo para mostrar la idea).
      const s = 25 / 15 * S;
      grande = `${marco(px, py, W, H)}${escena(px + (W - 10 * s) / 2, py, s)}${borde(px, py, W, H)}`;
    } else {
      // Lo que pasa: ampliada a 20 de ancho, mide 30 de alto; el estudio deja los 25 del medio y corta 2,5 arriba y abajo.
      const s = 2 * S, y0 = py - 2.5 * S;
      grande = `<g opacity=".28">${escena(px, y0, s)}</g>
        <rect x="${r1(px)}" y="${r1(y0)}" width="${W}" height="${30 * S}" fill="none" style="stroke:var(--c-h)" stroke-width="2.5" stroke-dasharray="6 5"/>
        <clipPath id="ap-prop-papel"><rect x="${r1(px)}" y="${r1(py)}" width="${W}" height="${H}"/></clipPath>
        ${marco(px, py, W, H)}<g clip-path="url(#ap-prop-papel)">${escena(px, y0, s)}</g>${borde(px, py, W, H)}`;
    }
    return `<text x="${cx}" y="32" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      ${marco(fx, fy, 10 * C, 15 * C)}${escena(fx, fy, C)}${borde(fx, fy, 10 * C, 15 * C)}
      ${rotulo(fx + 5 * C, fy + 15 * C + 20, '10 cm', '--c-o')}${rotulo(fx + 10 * C + 6, fy + 7.5 * C + 6, '15 cm', '--c-i', 'start')}
      ${grande}
      ${rotulo(px + W / 2, py + H + (predice ? 22 : 40), '20 cm', '--c-o')}${rotulo(px + W + 6, py + H / 2 + 6, '25 cm', '--c-i', 'start')}
      ${pie.map((l, i) => `<text x="${cx}" y="${410 + i * 26}" text-anchor="middle" font-size="21" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 452" width="520" height="452" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="442" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', true, ['La foto entera,', 'más grande'])}
    ${panel(260, 'Lo que se mide', false, ['Se cortan 5 cm,', 'y con ellos los zapatos'])}
  </svg>`;

  return {
    unidad: 'geometria.proporcionalidad-y-semejanza',
    titulo: '¿Por qué una foto de 10 por 15 sale recortada si la amplías a 20 por 25?',
    parrafos: [
      ['En un estudio de fotografía, una foto de ', ancho('10 cm'), ' de ancho por ', alto('15 cm'), ' de alto se puede ampliar a ',
        ancho('20 cm'), ' por ', alto('25 cm'), ', un tamaño común para cuadros. ',
        'Pero la ampliación no trae la foto entera: para llenar el papel, el estudio corta 5 cm de la imagen, y en una foto de cuerpo entero se pueden perder los zapatos.'],
      ['La cuenta que parece obvia es sumar: al ancho le tocan 10 cm más y al alto también, así que la foto debería caber entera, solo que más grande. ',
        'La otra salida, estirarla hasta que llene el papel sin cortar nada, tampoco sirve, porque las caras salen más anchas y el sol redondo se vuelve ovalado.'],
      ['Sumarle lo mismo al ancho y al alto no conserva la forma de la foto, y al estudio solo le queda elegir entre deformar la imagen o cortarle un pedazo. ',
        'Cuándo dos figuras tienen la misma forma aunque sean de distinto tamaño, y cómo se reparten sus medidas, es el tema de esta unidad: proporcionalidad y semejanza.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos dibujos con la misma foto de 10 cm por 15 cm, de una persona de cuerpo entero, y su ampliación en papel de 20 cm por 25 cm. Lo que predice: la ampliación trae la foto entera. Lo que se mide: la foto ampliada mide 20 cm por 30 cm, y al llenar el papel se cortan 5 cm, con los zapatos.',
    },
    pregunta: 'La misma foto de 10 por 15 sí cabe entera, sin recortes, en un papel de 20 por 30. ¿Qué tienen 10 por 15 y 20 por 30 que no tienen 10 por 15 y 20 por 25?',
    ficha: {
      seLleva: 'Para agrandar una foto sin deformarla ni recortarla, su ancho y su alto tienen que multiplicarse por lo mismo; sumarles lo mismo a los dos cambia su forma.',
      alcance: 'Sí, por deducción propia (cantidad y espacio y forma: razón y escala).',
      choque: 'Sumando 10 cm al ancho y al alto, la foto de 10 por 15 debería caber entera en 20 por 25, y el estudio tiene que cortarle 5 cm.',
      atajo: 'Sumar lo mismo a los dos lados (pensamiento aditivo), que es el error de fondo; y estirar la foto hasta llenar el papel, que la deforma. La regla (multiplicar por lo mismo) no se da: la pregunta compara pares de medidas para que el alumno la busque.',
      porVerificar: [
        'Que los estudios de fotografía del Perú amplíen a 20 cm por 25 cm y recorten las fotos de 10 por 15 al hacerlo (de memoria: 20 por 25 es el tamaño de 8 por 10 pulgadas). Pueden ofrecer también dejar bandas blancas a los lados en lugar de cortar.',
        'Los 5 cm salen del cálculo: a 20 cm de ancho, la foto mide 30 cm de alto, y el papel tiene 25. Se reparten como el estudio decida (aquí, 2,5 cm arriba y 2,5 abajo).',
      ],
      notas: [
        'La figura dibuja la misma foto chica en los dos paneles y el mismo papel de 20 por 25. En «Lo que predice», la foto entera está dibujada dentro del papel (con un poco de papel libre a los lados, que no se nota porque el fondo es del mismo color): es lo que se espera. En «Lo que se mide», la foto ampliada a 20 por 30 se ve punteada en carmín y tenue fuera del papel.',
        'No se habla de áreas en ninguna parte, para no tocar la idea 5 (razón de áreas). La pregunta compara pares de medidas, como pide el skill (2.5): 10 y 20, 15 y 30, frente a 10 y 20, 15 y 25.',
        'Revisión del Escribidor Escribano (27 nov): sin cambios en el texto. Recalculado: 10 por 15 ampliada al doble da 20 por 30, y al papel de 25 le sobran 5 cm. 20 por 25 cm es la versión métrica de 8 por 10 pulgadas (20,3 por 25,4 cm).',
      ],
    },
  };
})());
