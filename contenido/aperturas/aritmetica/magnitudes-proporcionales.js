/*
 * Apertura de «Magnitudes proporcionales» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * Es el ejemplo aprobado del skill (6 bis); la revisión del 27 nov cambió «en promedio» por «típico» (ver ficha.notas). Colores de la unidad: la edad va en naranja (c-o,
 * la x de la gráfica de la idea 1) y la talla en turquesa (c-i, la y).
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const edad = t => ({ v: 'c-o', t }), talla = t => ({ v: 'c-i', t });

  // Dos paneles de barras con la misma escala (180 cm = 200 unidades) y la misma línea de base.
  const K = 200 / 180, BASE = 268;
  const panel = (x0, titulo, tallas, pie) => {
    const barras = tallas.map((cm, i) => {
      const x = x0 + 52 + i * 92, h = cm * K, y = BASE - h;
      return `<rect x="${x}" y="${y.toFixed(1)}" width="64" height="${h.toFixed(1)}" rx="6" style="fill:var(--c-i)"/>
        <text x="${x + 32}" y="${(y - 10).toFixed(1)}" text-anchor="middle" font-size="24" font-weight="700" style="fill:var(--c-i)">${String(cm).replace('.', ',')} cm</text>
        <text x="${x + 32}" y="${BASE + 28}" text-anchor="middle" font-size="22" font-weight="700" style="fill:var(--c-o)">${i ? 4 : 2} años</text>`;
    }).join('');
    return `<text x="${x0 + 130}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      ${barras}
      <line x1="${x0 + 30}" y1="${BASE}" x2="${x0 + 230}" y2="${BASE}" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      ${pie.map((l, i) => `<text x="${x0 + 130}" y="${BASE + 62 + i * 26}" text-anchor="middle" font-size="22" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const guias = [50, 100, 150].map(cm => `<line x1="20" y1="${(BASE - cm * K).toFixed(1)}" x2="500" y2="${(BASE - cm * K).toFixed(1)}" stroke="currentColor" stroke-opacity=".14" stroke-width="1.5" stroke-dasharray="4 6"/>`).join('');
  const svg = `<svg viewBox="0 0 520 360" width="520" height="360" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    ${guias}
    <line x1="260" y1="12" x2="260" y2="350" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', [87, 174], ['Doble de edad,', 'doble de talla'])}
    ${panel(260, 'Lo que se mide', [87, 103], ['Doble de edad,', '16 cm más'])}
  </svg>`;

  return {
    unidad: 'aritmetica.magnitudes-proporcionales',
    titulo: '¿Por qué la regla de tres a veces falla?',
    parrafos: [
      ['En el control de crecimiento del centro de salud, la enfermera mide al niño y anota su talla en una tarjeta. ',
        'Según las tablas de la OMS, un niño típico mide unos ', talla('87 cm'), ' a los ', edad('2 años'),
        ' y unos ', talla('103 cm'), ' a los ', edad('4'), '.'],
      ['Con la regla de tres, la cuenta sale en un renglón: al doble de edad, el doble de talla. El niño de ', edad('4 años'),
        ' mediría ', talla('174 cm'), ', lo que mide un adulto alto. La regla de tres inversa tampoco salva la cuenta, porque predice que a los ',
        edad('4 años'), ' el niño mediría ', talla('43,5 cm'), ', menos que un recién nacido.'],
      'Las dos reglas de tres devuelven un número con cualquier par de datos, aunque las cantidades no cambien de esa manera. Por eso, antes de calcular, hay que averiguar cómo cambia una cantidad cuando cambia la otra. De esa pregunta trata el tema de las magnitudes proporcionales.',
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'Dos gráficos de barras con la misma escala. Lo que predice la regla de tres: 87 cm a los 2 años y 174 cm a los 4, el doble. Lo que se mide: 87 cm a los 2 años y 103 cm a los 4, solo 16 cm más.',
    },
    pregunta: 'Cinco menús de S/\u00a010 cuestan S/\u00a050, y ahí la regla de tres no falla. ¿Qué tienen el número de menús y su precio que no tienen la edad y la talla de un niño?',
    ficha: {
      alcance: 'Sí (cantidad; cambio y relaciones).',
      choque: 'La regla de tres predice 174 cm a los 4 años y se miden unos 103 cm.',
      atajo: 'La regla de tres inversa, que da 43,5 cm: menos que un recién nacido. Las dos reglas fallan, así que hay que decidir si hay proporcionalidad antes de calcular.',
      porVerificar: [
        'Medianas de talla de la OMS: niños unos 87,1 cm a los 2 años y 103,3 cm a los 4; niñas unos 85,7 y 102,7 cm.',
        'Talla de un recién nacido: unos 50 cm.',
        '174 cm como talla de un adulto peruano alto.',
      ],
      notas: [
        'Revisión del 27 nov: «un niño mide en promedio unos 87 cm» pasó a «un niño típico mide unos 87 cm», porque las tablas de la OMS dan medianas y no promedios. El resto del texto es el del ejemplo aprobado y cumple las reglas de la casa.',
      ],
    },
  };
})());
