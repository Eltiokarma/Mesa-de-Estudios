/*
 * Apertura de «Geometría molecular» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * Sale del ejemplo aprobado del skill (6, hibridación), adaptado a la unidad, que empieza por la forma (repulsión de
 * regiones, idea 1) y sigue con la hibridación (idea 2): el párrafo 3 nombra las dos, y la pregunta abre la idea 1 sin
 * responderla. El balón de gas peruano es una mezcla de propano y butano, no «casi todo propano». Color de la unidad:
 * los ángulos en turquesa (c-i, `colores.angulo` de la teoría).
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  const r1 = n => Math.round(n * 10) / 10;
  const pt = (cx, cy, r, g) => [r1(cx + r * Math.cos(g * Math.PI / 180)), r1(cy + r * Math.sin(g * Math.PI / 180))];
  // Arco de ángulo entre dos direcciones (grados de SVG), con su rótulo en la bisectriz.
  const arco = (cx, cy, g1, g2, txt, rr = 34, rt = 62) => {
    const [x1, y1] = pt(cx, cy, rr, g1), [x2, y2] = pt(cx, cy, rr, g2), [tx, ty] = pt(cx, cy, rt, (g1 + g2) / 2);
    const barre = g2 > g1 ? 1 : 0, grande = Math.abs(g2 - g1) > 180 ? 1 : 0;
    return `<path d="M${x1} ${y1}A${rr} ${rr} 0 ${grande} ${barre} ${x2} ${y2}" fill="none" style="stroke:var(--c-i)" stroke-width="3"/>
      <text x="${tx}" y="${ty + 8}" text-anchor="middle" font-size="22" font-weight="800" style="fill:var(--c-i)">${txt}</text>`;
  };
  const enlace = (cx, cy, [x, y], punteado) => `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="currentColor" stroke-width="5" stroke-linecap="round"${punteado ? ' stroke-dasharray="2 10"' : ''}/>`;
  const H = ([x, y]) => `<circle cx="${x}" cy="${y}" r="20" style="fill:var(--card)" stroke="currentColor" stroke-width="2.5"/><text x="${x}" y="${y + 8}" text-anchor="middle" font-size="22" font-weight="700" fill="currentColor">H</text>`;
  const C = (cx, cy) => `<circle cx="${cx}" cy="${cy}" r="24" fill="currentColor"/><text x="${cx}" y="${cy + 8}" text-anchor="middle" font-size="22" font-weight="800" style="fill:var(--card)">C</text>`;
  const L = 105;
  const panel = (x0, titulo, dirs, punteado, arcos, pie) => {
    const cx = x0 + 130, cy = 186, hs = dirs.map(([g, k]) => pt(cx, cy, L * k, g));
    return `<text x="${cx}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      ${hs.map((p, i) => enlace(cx, cy, p, punteado === i)).join('')}
      ${arcos.map(a => arco(cx, cy, ...a)).join('')}
      ${hs.map(H).join('')}${C(cx, cy)}
      ${pie.map((l, i) => `<text x="${cx}" y="${338 + i * 26}" text-anchor="middle" font-size="22" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  // Lo que predice: tres enlaces p a 90° (arriba, a la derecha y hacia ti, en perspectiva) y el del orbital s, punteado.
  // Lo que se mide: un tetraedro (uno arriba y tres abajo, uno hacia ti), con los mismos cuatro H y el mismo largo.
  const svg = `<svg viewBox="0 0 520 380" width="520" height="380" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="370" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', [[-90, 1], [0, 0.95], [140, 0.85], [52, 0.92]], 3, [[-90, 0, '90°']], ['Cuatro enlaces', 'distintos'])}
    ${panel(260, 'Lo que se mide', [[-90, 1], [158, 1], [25, 1], [98, 0.88]], -1, [[-90, -202, '109,5°', 34, 66]], ['Cuatro enlaces', 'iguales'])}
  </svg>`;

  return {
    unidad: 'quimica.geometria-molecular',
    titulo: '¿Por qué el carbono no obedece a su propia configuración?',
    parrafos: [
      ['El balón de gas de tu cocina trae una mezcla de propano y butano, y el pariente más simple de esos dos gases es el metano, CH₄. ',
        'Los experimentos muestran que el carbono del metano forma cuatro enlaces idénticos, con el mismo largo y la misma energía, que apuntan a las esquinas de un tetraedro con ángulos de ',
        { v: 'c-i', t: '109,5°' }, '.'],
      'La configuración del carbono, 1s²\u00a02s²\u00a02p², solo tiene dos electrones sueltos, así que el carbono formaría dos enlaces. Si un electrón del 2s salta al orbital 2p vacío, quedan cuatro electrones sueltos y cuatro enlaces posibles, pero no serían iguales. Tres usarían orbitales p, perpendiculares entre sí, y el cuarto usaría el orbital s, que no apunta en ninguna dirección.',
      'El experimento y esta descripción no pueden tener razón a la vez sobre el metano. Cuando los datos contradicen una descripción, los químicos no descartan los datos: ajustan la descripción. Esta unidad hace ese ajuste en dos pasos: primero explica la geometría molecular, que es la forma que toman los enlaces alrededor de un átomo, y después la hibridación, que describe los orbitales de esos enlaces.',
    ],
    figura: {
      antes: 2,
      svg,
      pie: 'El enlace punteado es el del orbital s, y su lugar en el dibujo es arbitrario, porque ese orbital no apunta hacia ningún lado.',
      alt: 'Dos dibujos del metano con el mismo carbono y los mismos cuatro hidrógenos. Lo que predice la configuración: tres enlaces a 90° entre sí y un cuarto enlace distinto, punteado. Lo que se mide: cuatro enlaces iguales hacia las esquinas de un tetraedro, a 109,5° entre sí.',
    },
    pregunta: ['Los cuatro hidrógenos del metano podrían acomodarse de muchas maneras alrededor del carbono. ¿Qué tendría que pasar entre esos cuatro enlaces iguales para que cada par quede a ', { v: 'c-i', t: '109,5°' }, '?'],
    ficha: {
      alcance: 'No, en sentido formal (núcleo: un modelo se construye para explicar evidencia y tiene límites).',
      choque: 'La configuración, aun con la promoción de un electrón, predice cuatro enlaces distintos; se miden cuatro iguales a 109,5°.',
      atajo: 'La promoción de un electrón del 2s al 2p da cuatro enlaces, pero no iguales: tres p a 90° y uno s sin dirección.',
      porVerificar: [
        'Composición del gas de balón (GLP) en el Perú: mezcla de propano y butano (la proporción varía según el proveedor).',
        'Ángulo H–C–H del metano: 109,47° (se redondea a 109,5°).',
      ],
      notas: [
        'Revisión del 27 nov: la pregunta ya no es la del ejemplo aprobado del skill (qué les pasa a los orbitales 2s y 2p), sino qué pasa entre los enlaces para que queden a 109,5°, porque la unidad abre con la repulsión (idea 1) y la hibridación llega en la idea 2. Queda coherente porque el párrafo 3 nombra primero la geometría molecular y la pregunta parte del ángulo medido de la figura; el texto no menciona la repulsión, así que no la adelanta. Lo que se pierde: el choque del texto es de orbitales y la pregunta es de forma, y el puente es solo el ángulo de 109,5°. Si Gerson prefiere que choque y pregunta hablen de lo mismo, la otra salida es volver a la pregunta del skill y dejar la repulsión para la teoría.',
        'Revisión del 27 nov: el párrafo 3 decía que el ajuste «lleva dos nombres»; la geometría molecular es la forma medida, no un ajuste a la configuración, así que ahora dice que la unidad hace el ajuste en dos pasos: primero explica la forma y después describe los orbitales.',
      ],
    },
  };
})());
