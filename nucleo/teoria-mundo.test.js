// «En el mundo» (Gerson, 28 nov; docs/teoria.md, 4k): el momento opcional después de la regla, con un hecho real que la
// regla de la idea explica y una pregunta breve que se responde con ella. La unidad de muestra vive aquí, no en
// contenido/: comprueba el orden de los momentos, el validador (formato, topes, coma decimal, raya, oraciones de corrido
// y que no delate ninguna Predice) y el HTML del lector (app/teoria.js, mundoHTML).
const test = require('node:test');
const assert = require('node:assert/strict');
const T = require('./teoria.js');
const Kit = require('./kit/kit.js');
const Ecuacion = require('./ecuacion.js');

Kit.registrar({
  id: 'prueba-mundo',
  dibujar: (d, e) => `<svg viewBox="0 0 100 40"><circle cx="20" cy="20" r="${d.r}" fill="var(--c-i)"/><text x="60" y="25">${d.r} pm${e.marca ? ' ✓' : ''}</text></svg>`,
  alt: d => `Un átomo dibujado como círculo de radio ${d.r} pm.`,
});

const r = { v: 'c-i', t: 'r' };
// Una idea mínima y sana, con los cinco momentos de siempre.
const idea = (id, titulo, predice) => ({
  id, titulo, temas: ['Radio atómico'], pieza: 'prueba-mundo',
  juega: {
    consigna: 'Cambia el radio y mira cómo crece el átomo.', minimo: 2,
    controles: [{ id: 'r', etiqueta: 'Radio', min: 100, max: 300, paso: 10, inicio: 150, unidad: 'pm', decimales: 0, color: 'c-i' }],
    dibujo: v => ({ datos: { r: v.r }, estado: {} }), lectura: v => [r, ` = ${v.r} pm`],
  },
  predice: Object.assign({ dibujo: { datos: { r: 150 } }, revelar: { datos: { r: 250 }, estado: { marca: true } } }, predice),
  mira: { datos: { r: 200 }, pasos: [{ texto: 'Cada fila de la tabla suma un nivel de electrones.' }, { texto: 'Un nivel más lejos hace más grande el átomo.' }] },
  regla: { texto: 'El radio crece hacia abajo en un grupo.', ecuacion: [r, ' crece hacia abajo'], condicion: 'los átomos están en el mismo grupo y los radios salen de una misma tabla.' },
  ahoraTu: {
    generar: s => {
      const a = 100 + 10 * (s % 9), b = a + 50;
      return {
        pregunta: `Un átomo mide ${a} pm y otro del mismo grupo, una fila más abajo, ¿cuánto puede medir?`,
        datos: ['1 pm = 10⁻¹² m'],
        opciones: [{ id: 'si', texto: `${b} pm`, correcta: true }, { id: 'no', texto: `${a - 50} pm`, error: 'radio-baja', siFuera: 'Sería cierto si el átomo estuviera una fila más arriba, con un nivel menos.' }],
        solucion: { texto: 'Una fila más abajo suma un nivel: el radio crece.' },
      };
    },
  },
});

// El momento de muestra: el ejemplo de Gerson (el sodio burbujea en el agua; el cesio explota).
const MUNDO = {
  hecho: 'El sodio burbujea en el agua; el cesio explota',
  parrafos: [
    'Si echas un trocito de sodio al agua, corre sobre ella, burbujea y suelta hidrógeno. Un trocito de cesio, del mismo grupo pero tres filas más abajo, revienta en cuanto toca el agua y puede romper el recipiente.',
    ['Los dos reaccionan de la misma forma: cada átomo le entrega su último electrón al agua. En el cesio ese electrón está más lejos del núcleo, que lo sujeta con menos fuerza:',
      { linea: [r, '(Cs) ≈ 298 pm   ·   ', r, '(Na) ≈ 190 pm'] },
      'Por eso se suelta mucho más rápido y la reacción libera su calor de golpe.'],
  ],
  figura: { pieza: 'prueba-mundo', datos: { r: 298 } },
  pregunta: {
    texto: '¿Qué esperas del potasio, que está entre el sodio y el cesio en el mismo grupo?',
    opciones: [
      { id: 'medio', texto: 'Reacciona más fuerte que el sodio y menos que el cesio', correcta: true },
      { id: 'igual', texto: 'Igual que el sodio, porque tiene un solo electrón afuera', error: 'mismo-grupo-igual', siFuera: 'Es cierto que los dos tienen un solo electrón afuera, y por eso reaccionan de la misma forma. Pero el del potasio está un nivel más lejos y se suelta más fácil.' },
      { id: 'mas', texto: 'Más fuerte que el cesio, porque está más arriba', error: 'arriba-mas-grande', siFuera: 'Estar más arriba sí cambia el radio, pero al revés: hay un nivel menos, el último electrón queda más cerca y cuesta más soltarlo.' },
    ],
    porque: 'El potasio tiene un nivel más que el sodio y uno menos que el cesio: su último electrón queda a una distancia intermedia, y su reacción también.',
  },
  fuente: 'Radios calculados de Clementi y Raimondi (1967); reacciones de los metales alcalinos con agua, Royal Society of Chemistry.',
};

const PRED1 = {
  pregunta: '¿Qué átomo es más grande, el litio o el potasio?',
  opciones: [{ id: 'k', texto: 'El potasio', correcta: true }, { id: 'li', texto: 'El litio', error: 'radio-baja', siFuera: 'Sería cierto si el litio tuviera más niveles; está dos filas más arriba, con menos niveles.' }],
};
const PRED2 = {
  pregunta: '¿Qué pasa con el tamaño del sodio cuando pierde su último electrón?',
  opciones: [{ id: 'chico', texto: 'El ion es más pequeño que su átomo', correcta: true }, { id: 'grande', texto: 'El ion es más grande que su átomo', error: 'ion-crece', siFuera: 'Sería cierto si ganara un electrón: un anión crece, pero el sodio pierde uno.' }],
};
const unidad = mundo => ({
  unidad: 'quimica.prueba-mundo', version: '0.1.0', estado: 'borrador', requiere: [],
  ideas: [Object.assign(idea('radio', 'Radio atómico', PRED1), mundo === undefined ? {} : { mundo }), idea('iones', 'Radio de los iones', PRED2)],
});
const cambia = cambio => Object.assign({}, MUNDO, cambio);
const preguntaCon = cambio => cambia({ pregunta: Object.assign({}, MUNDO.pregunta, cambio) });
const problemas = mundo => T.problemas(unidad(mundo), { semillas: 8 });
const delMundo = mundo => problemas(mundo).filter(p => /mundo/.test(p));

test('la unidad de muestra es sana, con y sin «En el mundo»', () => {
  assert.deepEqual(problemas(undefined), []);
  assert.deepEqual(problemas(MUNDO), []);
});

test('orden: «En el mundo» va después de la regla y antes de «Así se resuelve» y «Ahora tú», solo si la idea lo trae', () => {
  const d = unidad(MUNDO);
  assert.deepEqual(T.momentosDe(d.ideas[0]), ['juega', 'predice', 'mira', 'regla', 'mundo', 'ahora-tu']);
  assert.deepEqual(T.momentosDe(d.ideas[1]), ['juega', 'predice', 'mira', 'regla', 'ahora-tu']);
  assert.deepEqual(T.momentosDe(Object.assign({ lee: {}, resuelve: {} }, d.ideas[0])), ['lee', 'juega', 'predice', 'mira', 'regla', 'mundo', 'resuelve', 'ahora-tu']);
});

test('formato: hecho, 2 o 3 párrafos, pregunta con opciones, porqué y fuente', () => {
  assert.match(delMundo(cambia({ hecho: '' })).join('\n'), /sin hecho/);
  assert.match(delMundo(cambia({ parrafos: [MUNDO.parrafos[0]] })).join('\n'), /parrafos: de 2 a 3/);
  assert.match(delMundo(cambia({ pregunta: undefined })).join('\n'), /sin pregunta/);
  assert.match(delMundo(preguntaCon({ porque: undefined })).join('\n'), /sin porque/);
  assert.match(delMundo(preguntaCon({ texto: 'Qué esperas del potasio, que está entre el sodio y el cesio.' })).join('\n'), /termina en «\?»/);
  assert.match(delMundo(preguntaCon({ opciones: MUNDO.pregunta.opciones.map(o => Object.assign({}, o, { correcta: false, siFuera: o.siFuera || 'Sería cierto si el potasio estuviera en otro grupo de la tabla.' })) })).join('\n'), /0 opciones correctas/);
  assert.match(delMundo(preguntaCon({ opciones: [MUNDO.pregunta.opciones[0], Object.assign({}, MUNDO.pregunta.opciones[1], { siFuera: undefined })] })).join('\n'), /no trae siFuera/);
  assert.match(delMundo(cambia({ fuente: undefined })).join('\n'), /fuente/);
  assert.match(delMundo(cambia({ parrafos: [MUNDO.parrafos[0], [{ linea: [r, ' = '] }, { linea: [] }, 'Una oración entera que explica por qué pasa lo que pasa en el agua.']] })).join('\n'), /línea suelta vacía/);
});

test('topes: hecho 10, párrafo 60 (sin sus líneas), pregunta 40, opción 14, porqué 40', () => {
  const largo = n => Array.from({ length: n }, (_, i) => (i % 2 ? 'agua' : 'sodio')).join(' ');
  assert.match(delMundo(cambia({ hecho: largo(11) })).join('\n'), /hecho de 11 palabras \(tope 10\)/);
  assert.match(delMundo(cambia({ parrafos: [MUNDO.parrafos[0], `${largo(61)}.`] })).join('\n'), /tarjeta de 61 palabras \(tope 60\)/);
  assert.match(delMundo(preguntaCon({ texto: `¿${largo(41)}?` })).join('\n'), /pregunta de 41 palabras \(tope 40\)/);
  assert.match(delMundo(preguntaCon({ porque: `${largo(41)}.` })).join('\n'), /siFuera de 41 palabras \(tope 40\)/);
  assert.match(delMundo(preguntaCon({ opciones: [Object.assign({}, MUNDO.pregunta.opciones[0], { texto: largo(15) }), MUNDO.pregunta.opciones[1]] })).join('\n'), /opcion de 15 palabras \(tope 14\)/);
  // La línea suelta no cuenta para el tope del párrafo (es una ecuación).
  const conLineaLarga = [MUNDO.parrafos[0], ['Los dos le entregan al agua su último electrón, que en el cesio está más lejos del núcleo:', { linea: Array.from({ length: 40 }, () => [r, ' + ']).flat() }]];
  assert.deepEqual(delMundo(cambia({ parrafos: conLineaLarga })), []);
});

test('escritura: coma decimal, sin raya y oraciones de corrido', () => {
  assert.match(delMundo(cambia({ parrafos: [MUNDO.parrafos[0], 'El radio del cesio mide unos 2.98 veces cien picómetros, más que el del sodio.'] })).join('\n'), /coma decimal/);
  assert.match(delMundo(cambia({ parrafos: [MUNDO.parrafos[0], 'El cesio — el más grande del grupo — explota apenas toca el agua del recipiente.'] })).join('\n'), /sin raya/);
  assert.match(delMundo(cambia({ parrafos: [MUNDO.parrafos[0], 'El cesio explota. Su último electrón está lejos del núcleo y se suelta muy fácil.'] })).join('\n'), /oración de 3 palabras \(mínimo 10/);
  assert.match(delMundo(preguntaCon({ opciones: [Object.assign({}, MUNDO.pregunta.opciones[0], { texto: 'Reacciona 1.5 veces más que el sodio' }), MUNDO.pregunta.opciones[1]] })).join('\n'), /coma decimal/);
});

test('figura: pieza del kit o SVG propio con colores de variable y texto alternativo', () => {
  assert.deepEqual(delMundo(cambia({ figura: undefined })), [], 'la figura es opcional');
  assert.match(delMundo(cambia({ figura: { pieza: 'prueba-mundo', datos: { r: NaN } } })).join('\n'), /NaN/);
  const svg = '<svg viewBox="0 0 100 40"><circle cx="20" cy="20" r="10" fill="var(--c-i)"/><circle cx="70" cy="20" r="16" fill="var(--c-h)"/></svg>';
  assert.deepEqual(delMundo(cambia({ figura: { svg, alt: 'El átomo de sodio, chico, junto al de cesio, más grande.' } })), []);
  assert.match(delMundo(cambia({ figura: { svg: svg.replace('var(--c-h)', '#ff0000'), alt: 'El átomo de sodio, chico, junto al de cesio.' } })).join('\n'), /color suelto #ff0000/);
  assert.match(delMundo(cambia({ figura: { svg } })).join('\n'), /texto alternativo/);
  assert.match(delMundo(cambia({ figura: { svg: svg.replace('var(--c-h)', 'var(--c-x)'), alt: 'El átomo de sodio, chico, junto al de cesio.' } })).join('\n'), /no es un color de variable/);
});

test('no delata: ni la Predice de su idea ni la de las ideas que siguen', () => {
  // La respuesta de la Predice de la idea 2 (todavía no predicha) dentro del hecho de la idea 1.
  const delata2 = cambia({ parrafos: [MUNDO.parrafos[0], 'Al soltar ese electrón queda un catión, y el ion es más pequeño que su átomo de cesio.'] });
  const p2 = delMundo(delata2).join('\n');
  assert.match(p2, /\[mundo-predice\].*Predice de la idea 2 \(iones\), que viene después/);
  assert.match(p2, /idea 1 \(radio\) mundo párrafo 2/);
  // También en la pregunta y sus opciones.
  const enOpcion = preguntaCon({ opciones: [MUNDO.pregunta.opciones[0], Object.assign({}, MUNDO.pregunta.opciones[1], { siFuera: 'Sería cierto si no lo soltara: el ion es más pequeño que su átomo, y el potasio lo suelta.' })] });
  assert.match(delMundo(enOpcion).join('\n'), /mundo opción 2.*\[mundo-predice\]|\[mundo-predice\].*idea 2/);
  // La de su propia idea, en una idea con una Predice de respuesta larga.
  const d = unidad(MUNDO);
  d.ideas[1].mundo = Object.assign({}, MUNDO, { parrafos: [MUNDO.parrafos[0], 'Cuando el sodio lo suelta, el ion es más pequeño que su átomo y el agua se calienta.'] });
  assert.match(T.problemas(d, { semillas: 8 }).join('\n'), /idea 2 \(iones\) mundo párrafo 2: \[mundo-predice\].*respuesta de su Predice/);
});

test('HTML del lector: etiqueta, hecho, párrafos con su línea suelta, fuente y la pregunta con opciones y comprobar', () => {
  global.window = { Ecuacion };
  const { mundoHTML, mundoFbHTML } = require('../app/teoria.js');
  const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const html = mundoHTML(Ecuacion, esc, MUNDO, MUNDO.pregunta.opciones);
  assert.match(html, /<span class="te-mundo-et">En el mundo<\/span>/);
  assert.match(html, /<h3 class="te-mundo-hecho">El sodio burbujea en el agua; el cesio explota<\/h3>/);
  // Tres <p> en el párrafo 2: el texto, la línea suelta (con la r en su color) y el texto que sigue.
  assert.equal((html.match(/<p class="te-ec te-mundo-linea">/g) || []).length, 1);
  assert.match(html, /te-mundo-linea">[^]*?c-i[^]*?298 pm/);
  assert.match(html, /<p>Por eso se suelta mucho más rápido/);
  assert.match(html, /<p class="te-mundo-fuente">Fuente: Radios calculados de Clementi y Raimondi \(1967\)/);
  assert.match(html, /<p class="te-mundo-q">¿Qué esperas del potasio/);
  assert.equal((html.match(/class="alt" role="radio"/g) || []).length, 3, 'los mismos botones .alt de Predice');
  assert.ok(!/class="alt nose"/.test(html), 'sin «No sé»: no se califica');
  assert.match(html, /<button type="button" class="btn borde te-mundo-comprobar">Comprobar<\/button>/);
  assert.match(html, /<div class="te-fb" aria-live="polite"><\/div>/);
  assert.ok(!/NaN|undefined|\[object/.test(html));
  // Al comprobar: la opción que no era trae su siFuera y siempre el porqué; la correcta, solo el porqué.
  const mal = mundoFbHTML(Ecuacion, MUNDO.pregunta, MUNDO.pregunta.opciones[1]);
  assert.match(mal, /^<p>Es cierto que los dos tienen un solo electrón afuera[^]*<p class="te-sol">El potasio tiene un nivel más/);
  const bien = mundoFbHTML(Ecuacion, MUNDO.pregunta, MUNDO.pregunta.opciones[0]);
  assert.equal(bien, `<p class="te-sol">${Ecuacion.html(MUNDO.pregunta.porque)}</p>`);
});

test('texto plano del momento (mapa-unidad, reglas): todos los campos que ve el alumno', () => {
  const campos = T.textoMundo(MUNDO).map(([c]) => c);
  assert.deepEqual(campos, ['hecho', 'párrafo 1', 'párrafo 2', 'pregunta', 'opción 1', 'opción 2', 'opción 3', 'explicación']);
  const { textoMundo } = require('../herramientas/mapa-unidad.js');
  const t = textoMundo(MUNDO);
  assert.match(t, /^EN EL MUNDO · El sodio burbujea/);
  assert.match(t, /\n {4}r\(Cs\) ≈ 298 pm/);
  assert.match(t, /✓ Reacciona más fuerte que el sodio/);
  assert.match(t, /Fuente: Radios calculados/);
});
