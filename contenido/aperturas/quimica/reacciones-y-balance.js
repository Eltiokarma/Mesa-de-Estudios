/*
 * Apertura de «Reacciones y balance» (docs/metodo/apertura-pisa.md; criterio en docs/metodo/entrada-pisa.md).
 * El choque está en la balanza de la cocina: una bola de virulana que se quema marca más que antes, cuando todo lo que el
 * alumno ha visto quemarse (leña, vela, papel) queda en menos. Lo que el alumno se lleva (ficha.seLleva): en una
 * reacción la materia no aparece ni desaparece, se reacomoda en sustancias nuevas, y las cuentas de antes y después
 * tienen que cuadrar. El texto no dice de dónde salen los gramos de más: esa es la pregunta. No se usa el horno de cal
 * (Predice de la idea 2), el agua oxigenada (Predice de la idea 3) ni el metano (misión de la idea 3). Colores: el
 * peso de antes en turquesa (c-i) y la lectura de después en rosa (c-h).
 */
(function (raiz, def) {
  if (typeof module === 'object' && module.exports) module.exports = def;
  else (raiz.Aperturas = raiz.Aperturas || {})[def.unidad] = def;
})(typeof self !== 'undefined' ? self : this, (function () {
  // La misma balanza de cocina con la misma bola de virulana quemada; lo único que cambia es la lectura.
  const PLATO = 196;
  // Bola de virulana: rulos de alambre en espiral (forma fija, sin azar), con algunas chispas apagadas.
  const bola = (cx, cy) => {
    let d = '';
    for (let k = 0; k < 7; k++) {
      const a0 = k * 0.9, r = 42 - k * 2, ox = 7 * Math.sin(k * 2.3), oy = 5 * Math.cos(k * 1.7), pts = [];
      for (let i = 0; i <= 28; i++) {
        const t = a0 + i * 0.42, rr = r * (0.15 + 0.85 * Math.abs(Math.sin(t * (1.1 + 0.17 * k) + k * 0.7)));
        pts.push(`${(cx + ox + rr * Math.cos(t)).toFixed(1)} ${(cy + oy + 0.75 * rr * Math.sin(t)).toFixed(1)}`);
      }
      d += 'M' + pts.join('L');
    }
    return `<ellipse cx="${cx}" cy="${cy}" rx="46" ry="34" fill="currentColor" fill-opacity=".14"/>
      <path d="${d}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" opacity=".85"/>`;
  };
  const balanza = (cx, lectura) => `
      <path d="M${cx - 76} ${PLATO}H${cx + 76}" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>
      <path d="M${cx - 8} ${PLATO + 3}V${PLATO + 18}M${cx + 8} ${PLATO + 3}V${PLATO + 18}" stroke="currentColor" stroke-width="4"/>
      <rect x="${cx - 84}" y="${PLATO + 18}" width="168" height="74" rx="14" style="fill:var(--card)" stroke="currentColor" stroke-width="3.5"/>
      <rect x="${cx - 74}" y="${PLATO + 32}" width="148" height="44" rx="6" style="fill:var(--c-h)" fill-opacity=".14"/>
      <rect x="${cx - 74}" y="${PLATO + 32}" width="148" height="44" rx="6" fill="none" style="stroke:var(--c-h)" stroke-width="2.5"/>
      <text x="${cx}" y="${PLATO + 63}" text-anchor="middle" font-size="18" font-weight="800" style="fill:var(--c-h)">${lectura}</text>`;
  const panel = (x0, titulo, lectura, pie) => {
    const cx = x0 + 130;
    return `<text x="${cx}" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">${titulo}</text>
      <text x="${cx}" y="70" text-anchor="middle" font-size="17" style="fill:var(--c-i)" font-weight="700">antes de quemarla: 10 g</text>
      ${bola(cx, PLATO - 40)}
      ${balanza(cx, lectura)}
      ${pie.map((l, i) => `<text x="${cx}" y="${330 + i * 26}" text-anchor="middle" font-size="22" style="fill:var(--muted)">${l}</text>`).join('')}`;
  };
  const svg = `<svg viewBox="0 0 520 384" width="520" height="384" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="260" y1="12" x2="260" y2="374" style="stroke:var(--line)" stroke-width="2"/>
    ${panel(0, 'Lo que predice', 'menos de 10 g', ['Lo quemado', 'pesa menos'])}
    ${panel(260, 'Lo que se mide', 'más de 10 g', ['La virulana quemada', 'pesa más'])}
  </svg>`;

  return {
    unidad: 'quimica.reacciones-y-balance',
    titulo: '¿Por qué una bola de virulana pesa más después de quemarse que antes?',
    parrafos: [
      ['La virulana, la lana de acero con que se lavan las ollas, arde con chispas anaranjadas si le acercas una llama, y queda convertida en una masa oscura que se desmorona entre los dedos. ',
        'Si la pesas en una balanza de cocina antes y después, la bola quemada marca más que la bola entera, y si todo su hierro llegara a quemarse, 10 g de virulana pasarían a pesar unos 14 g.'],
      ['Todo lo que has visto quemarse predice lo contrario: la leña queda en un puñado de ceniza, la vela se acaba y el papel casi desaparece, así que lo quemado tendría que pesar menos. ',
        'Tampoco es que el fuego le deje algo suyo encima, porque si la virulana se quema dentro de un frasco bien cerrado, el frasco entero marca en la balanza lo mismo antes y después.'],
      ['Al arder, la virulana no crea materia ni la recibe del fuego, y aun así la balanza marca unos gramos que la bola entera no tenía. ',
        'Escribir cada reacción química de modo que las cuentas de antes y de después cuadren es el trabajo de esta unidad, reacciones químicas y balance.'],
    ],
    figura: {
      antes: 2,
      svg,
      alt: 'La misma balanza de cocina con la misma bola de virulana quemada, que antes de quemarse pesaba 10 g. Lo que predice la idea de que lo quemado pesa menos: la balanza marca menos de 10 g. Lo que se mide: la virulana quemada marca más de 10 g.',
    },
    pregunta: 'Si en el frasco cerrado la balanza marca lo mismo antes y después, ¿de dónde crees que sacó la virulana los gramos que ganó al quemarse?',
    ficha: {
      seLleva: 'En una reacción química la materia no aparece ni desaparece: se reacomoda en sustancias nuevas, y por eso lo que pesa más o menos después es porque algo entró o salió.',
      alcance: 'Parcial (núcleo del informe PISA para estequiometría: conservación y límites del sistema; el balance de ecuaciones y las redox no entran en PISA).',
      choque: 'Lo quemado pesa menos (leña, vela, papel); la virulana quemada pesa más, y en un frasco cerrado el total no cambia.',
      atajo: 'La explicación trampa «el fuego le dejó hollín o algo suyo» se descarta con el frasco cerrado, que marca lo mismo antes y después. El atajo «se quemó, así que pesa menos» es justo la predicción que falla.',
      porVerificar: [
        'Que la virulana quemada marque más en una balanza de cocina (demostración clásica; la ganancia depende de cuánto hierro llega a reaccionar, y con una balanza de 1 g puede hacer falta una bola de varios gramos para que se note).',
        'Que 10 g de hierro pasen a unos 14 g si todo se convierte en óxido (cálculo, no medición: 10 g de Fe dan 14,3 g de Fe₂O₃ o 13,8 g de Fe₃O₄; el texto lo dice en condicional).',
        'Que en un frasco bien cerrado la masa total no cambie (ley de conservación de la masa; con una balanza de cocina la diferencia no se ve).',
        'Que «virulana» se entienda en todo el Perú como lana de acero para lavar ollas (de memoria: es una marca que se volvió nombre común; el texto la presenta como «la lana de acero»).',
      ],
      notas: [
        'Doble revisión (27 nov): sin cambios. El choque es honesto: «lo quemado pesa menos» es una idea que los alumnos traen de verdad (la leña, la vela, el papel), y la comparación es justa (la misma bola, la misma balanza, antes y después; el frasco cerrado descarta que el fuego le deje algo). Las cuentas se rehicieron: 10 g de hierro dan 14,3 g de Fe₂O₃ o 13,8 g de Fe₃O₄, así que «unos 14 g» vale con las dos.',
        'Revisión (Escribidor Escribano, 27 nov): el párrafo 3 decía «se forma una sustancia nueva con lo que ya había dentro del frasco», que respondía la pregunta guía, y enunciaba la ley de conservación («la materia no aparece ni desaparece»), que es la regla de la unidad. Quedó el choque: no crea materia, no la recibe del fuego y aun así gana gramos.',
        'La pregunta deja abierta la fuente de los gramos de más (el oxígeno del aire del frasco), que el alumno puede deducir con lo leído: si nada entró al frasco y la virulana ganó masa, algo de adentro del frasco la perdió. El texto no nombra el oxígeno para no responderla.',
        'Seguridad, para Gerson: la apertura describe la demostración y no le pide al alumno que la haga; si se convierte en actividad, va con un adulto y sobre un plato que no arda.',
        'La idea de la misión de la idea 3 («cada átomo de antes sigue ahí después») está en el seLleva como «la materia se reacomoda», sin repetir su frase.',
      ],
    },
  };
})());
