/*
 * Teoría de «Reacciones químicas y balance» (quimica.reacciones-y-balance). Molde: docs/teoria.md y
 * contenido/teoria/quimica/materia-y-energia.js. Compañera: Bruna (castora), voz resolutiva y cálida.
 * Fuente del contenido: docs/teoria/matriz/quimica.json (unidad 7) y docs/teoria/fuentes/historia-ecuaciones-1.pdf.
 * Errores: docs/investigacion/estequiometria-ideas-erroneas.md (ES11–ES14), equilibrio-acidos-electroquimica
 * (EC9, EC11), quimica-materia-nomenclatura-organica (MA1, MA8, NO1); los QM- son hipótesis nuevas.
 *
 * Ficha de tarea (diseno-y-animacion)
 *   Promesa: reconocer una reacción, clasificarla, balancearla por tanteo y por ion-electrón, y decir quién se
 *     oxida y quién se reduce.
 *   Persona y condiciones: postulante de 4.º–5.º, celular de gama baja a 360 px, sin audio, a veces sin conexión.
 *   Resultado observable: balancea una ecuación nueva sin tocar subíndices, nombra oxidante y reductor y halla
 *     los electrones de una semirreacción.
 *   Orden de atención: 1.º el inventario de átomos o de cargas · 2.º la lectura en vivo · acción: ajustar
 *     coeficientes · fondo: Bruna.
 *   Estados: juego sin tocar · casos probados · predicción abierta · revelado · paso a paso · caso nuevo · acierto · «No sé».
 *   Duda que resuelve: ¿burbujas = reacción?, ¿puedo cambiar el subíndice?, ¿el que se oxida es el oxidante?
 *
 * Colores (regla 4): coeficientes naranja c-o, estado de oxidación ω verde c-d, electrones e⁻ turquesa c-i, carga
 * rojo c-h. En la lupa (sin ecuaciones a la vista), los átomos llevan su propio color y relleno.
 * Fuentes (no van al alumno): OpenStax Chemistry 2e §4.1 y §4.2 (clasificación) y §17.1 (redox, ion-electrón).
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const w = { v: 'c-d', t: 'ω' }, el = { v: 'c-i', t: 'e⁻' }, cf = t => ({ v: 'c-o', t: String(t) });
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      const txt = fmt(d.valor);
      if (vistos.has(txt) || !Number.isFinite(d.valor)) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }
  const sg = n => (n > 0 ? `+${n}` : n < 0 ? `−${-n}` : '0');

  // ---------- Lupa: átomos y especies ----------
  const ATOMOS = { C: { estilo: 'lleno', r: 6 }, H: { color: 'i', estilo: 'hueco', r: 4 }, O: { color: 'h', estilo: 'lleno', r: 6 }, Fe: { color: 'o', estilo: 'punto', r: 7 },
    Ag: { color: 'd', estilo: 'punto', r: 7 }, Cl: { color: 'd', estilo: 'lleno', r: 7 }, Na: { color: 'o', estilo: 'punto', r: 6 }, N: { color: 'i', estilo: 'lleno', r: 5 },
    A: { color: 'o', estilo: 'lleno', r: 7 }, B: { color: 'i', estilo: 'hueco', r: 7 }, X: { color: 'd', estilo: 'punto', r: 7 }, Y: { estilo: 'lleno', r: 6 } };
  const ESPECIES = {
    CH4: [['C', 0, 0], ['H', -7, -5], ['H', 7, -5], ['H', -7, 5], ['H', 7, 5]], O2: [['O', -5, 0], ['O', 5, 0]], CO2: [['C', 0, 0], ['O', -9, 0], ['O', 9, 0]],
    H2O: [['O', 0, -1], ['H', -6, 4], ['H', 6, 4]], HCO3: [['C', 0, 0], ['O', -9, 0], ['O', 9, 0], ['O', 0, -8], ['H', 0, 8]], H2O2: [['O', -5, -1], ['O', 5, -1], ['H', -10, 4], ['H', 10, 4]], H2: [['H', -4, 0], ['H', 4, 0]],
    Fe: [['Fe', 0, 0]], Fe2O3: [['Fe', -6, -4], ['Fe', 6, -4], ['O', -10, 5], ['O', 0, 6], ['O', 10, 5]],
    Ag: [['Ag', 0, 0]], Cl: [['Cl', 0, 0]], AgCl: [['Ag', -6, 0], ['Cl', 7, 0]], Na: [['Na', 0, 0]], NO3: [['N', 0, 0], ['O', -7, 4], ['O', 7, 4], ['O', 0, -7]],
    A: [['A', 0, 0]], B: [['B', 0, 0]], AB: [['A', -6, 0], ['B', 6, 0]], X: [['X', 0, 0]], XB: [['X', -6, 0], ['B', 6, 0]], AY: [['A', -6, 0], ['Y', 6, 0]], XY: [['X', -6, 0], ['Y', 6, 0]],
  };
  const lupa = (cajas, extra = {}) => ({ datos: Object.assign({ atomos: ATOMOS, especies: ESPECIES, alto: 140, separacion: 26, flechas: cajas.length > 1, cajas }, extra), estado: {} });
  const fondo = (e, n, y0 = 0.82, y1 = 0.95, x0 = 0.15, x1 = 0.85) => Array.from({ length: n }, (_, k) => ({ e, n: 1, x: x0 + (x1 - x0) * (n === 1 ? 0.5 : k / (n - 1)), y: k % 2 ? y1 : y0 }));

  // ---------- Idea 1: indicios, no pruebas ----------
  // Cambia: lo que se observa · Permanece: antes a la izquierda, después a la derecha · Progresa: del indicio a la
  // especie nueva · Se reserva: los casos físicos que dan el mismo indicio (hervir) · Debe verse: si después hay
  // partículas que antes no había.
  const FEN = {
    gas: { t: 'Burbujas al mezclar', antes: { titulo: 'Antes', forma: 'vaso', nivel: 0.8, particulas: [{ e: 'H2O', n: 5 }, { e: 'Na', n: 2 }, { e: 'HCO3', n: 2 }] }, despues: { titulo: 'Después', forma: 'cilindro', nivel: 1, particulas: [{ e: 'CO2', n: 2 }, { e: 'H2O', n: 6 }, { e: 'Na', n: 2 }] }, lee: 'Apareció CO₂, que antes no estaba: hubo reacción.' },
    hervir: { t: 'Burbujas al hervir', antes: { titulo: 'Agua', forma: 'vaso', nivel: 0.7, particulas: [{ e: 'H2O', n: 8 }] }, despues: { titulo: 'Vapor', forma: 'cilindro', nivel: 1, particulas: [{ e: 'H2O', n: 4 }] }, lee: 'Mismas moléculas de agua: no hubo reacción.' },
    solido: { t: 'Sólido que aparece', antes: { titulo: 'Antes', forma: 'vaso', nivel: 0.8, particulas: [{ e: 'H2O', n: 5 }, { e: 'Ag', n: 2 }, { e: 'Cl', n: 2 }] }, despues: { titulo: 'Después', forma: 'vaso', nivel: 0.8, particulas: [{ e: 'H2O', n: 5 }, ...fondo('AgCl', 2)] }, lee: 'Se formó AgCl, insoluble: hubo reacción.' },
    disolver: { t: 'Sólido que desaparece', antes: { titulo: 'Sal y agua', forma: 'vaso', nivel: 0.8, particulas: [{ e: 'H2O', n: 5 }, ...fondo('Na', 2, 0.92, 0.92, 0.35, 0.55), ...fondo('Cl', 2, 0.92, 0.92, 0.45, 0.65)] }, despues: { titulo: 'Disuelta', forma: 'vaso', nivel: 0.8, particulas: [{ e: 'H2O', n: 5 }, { e: 'Na', n: 2 }, { e: 'Cl', n: 2 }] }, lee: 'Mismas partículas, ahora repartidas: no hubo reacción.' },
  };
  const evidencias = {
    id: 'indicios',
    titulo: 'Indicios, no pruebas',
    temas: ['Evidencias de una reacción'],
    pieza: 'quim-particulas',
    juega: {
      consigna: 'Elige un fenómeno. Compara las partículas de antes y de después: ¿aparece alguna especie que antes no estaba?',
      voz: 'Lo que ves es una observación; falta explicar qué significa.',
      controles: [{ id: 'k', etiqueta: 'Fenómeno', opciones: Object.keys(FEN).map(k => ({ valor: k, texto: FEN[k].t })) }],
      dibujo: val => lupa([FEN[val.k].antes, FEN[val.k].despues]),
      lectura: val => [FEN[val.k].lee],
      minimo: 3,
    },
    predice: {
      pregunta: 'Mezclas dos líquidos transparentes, nitrato de plata y agua con sal, y aparece un sólido blanco. ¿Qué es ese sólido?',
      voz: 'Piensa qué partículas había antes en cada líquido.',
      opciones: [
        { id: 'c', texto: 'Cloruro de plata, una sustancia nueva', correcta: true },
        { id: 'sal', texto: 'Sal que dejó de estar disuelta', error: 'QM-PRECIP', siFuera: 'La sal puede volver a cristalizar si se evapora el agua. Aquí el agua sigue.' },
        { id: 'plata', texto: 'Plata metálica que se separó', error: 'MA8', siFuera: 'Haría falta que la plata ganara electrones. Aquí sigue como ion, unida al cloro.' },
      ],
      dibujo: lupa([{ titulo: 'Nitrato de plata', forma: 'vaso', nivel: 0.8, particulas: [{ e: 'H2O', n: 4 }, { e: 'Ag', n: 2 }, { e: 'NO3', n: 2 }] }, { titulo: 'Agua con sal', forma: 'vaso', nivel: 0.8, particulas: [{ e: 'H2O', n: 4 }, { e: 'Na', n: 2 }, { e: 'Cl', n: 2 }] }]),
      revelar: lupa([{ titulo: 'Mezcla', forma: 'vaso', nivel: 0.85, particulas: [{ e: 'H2O', n: 7 }, { e: 'Na', n: 2 }, { e: 'NO3', n: 2 }, ...fondo('AgCl', 2)] }]),
      coincide: 'Coincide: Ag⁺ y Cl⁻ se juntan en un sólido nuevo, AgCl.',
      noCoincide: 'Los iones Ag⁺ y Cl⁻ forman AgCl, que no se disuelve y cae.',
    },
    mira: {
      pieza: 'quim-cadena',
      datos: { columnas: [
        { titulo: 'Indicio', color: 'o', nodos: [{ texto: 'gas (burbujas)', desde: 1 }, { texto: 'sólido nuevo (precipitado)', desde: 2 }, { texto: 'cambio de color o de temperatura', desde: 3 }], flechas: [] },
        { titulo: 'Sin reacción', color: 'i', nodos: [{ texto: 'hervir agua', desde: 1, tenue: true }, { texto: 'sal que cristaliza al evaporar', desde: 2, tenue: true }, { texto: 'disolver soda cáustica: calienta', desde: 3, tenue: true }], flechas: [] },
      ] },
      voz: 'Pongamos cada indicio junto a su posible engaño.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Las burbujas pueden ser un gas nuevo… o el mismo líquido hirviendo.' },
        { estado: { corte: 2 }, texto: 'Un sólido puede ser una sustancia nueva… o una que ya estaba.' },
        { estado: { corte: 3 }, texto: 'El calor también aparece al disolver. Un indicio solo no basta.' },
        { estado: { corte: 3 }, texto: 'La prueba es identificar una sustancia nueva, con otras propiedades.' },
      ],
    },
    regla: {
      texto: 'Gas, precipitado, cambio de color o de temperatura son indicios de reacción. La prueba es que aparezca una sustancia nueva, con otras propiedades.',
      ecuacion: ['AgNO₃ + NaCl → AgCl(s) + NaNO₃'],
      condicion: 'un indicio aislado puede venir de un cambio físico: hervir también hace burbujas y disolver también calienta o enfría.',
      voz: 'Observa primero; explica después.',
    },
    ahoraTu: {
      voz: 'Decide si hay una sustancia nueva.',
      generar(s) {
        const C = [['Quemas papel: queda ceniza y sale humo', 1], ['Hierves agua: salen burbujas', 0], ['Disuelves azúcar en agua: el sólido desaparece', 0],
          ['Le echas limón a la leche: se forman grumos', 1], ['Un clavo se cubre de óxido rojizo', 1], ['Un hielo se derrite', 0],
          ['Una pastilla efervescente suelta burbujas en agua', 1], ['Mezclas arena con sal', 0], ['Una manzana cortada se pone marrón', 1], ['Un vidrio se empaña con tu aliento', 0]];
        const [caso, hubo] = C[s % C.length];
        return {
          pregunta: `${caso}. ¿Hubo reacción química?`,
          opciones: [
            { id: hubo ? 'c' : 'si', texto: 'Sí: se forma una sustancia nueva', correcta: !!hubo, ...(hubo ? {} : { error: 'MA1', siFuera: 'Hay un indicio, cierto. Sería reacción si aparecieran sustancias nuevas; aquí siguen las mismas.' }) },
            { id: hubo ? 'no' : 'c', texto: 'No: las sustancias son las mismas', correcta: !hubo, ...(hubo ? { error: 'MA2', siFuera: 'Sería físico si las sustancias siguieran siendo las mismas. Aquí aparecen otras.' } : {}) },
          ],
          solucion: { texto: hubo ? 'Aparecen sustancias que antes no estaban.' : 'Las partículas son las mismas: cambio físico.', ecuacion: [hubo ? 'cambio químico' : 'cambio físico'] },
        };
      },
    },
  };

  // ---------- Idea 2: clasificar por el patrón ----------
  // Cambia: el tipo de reacción · Permanece: los mismos átomos genéricos · Progresa: juntar, separar, reemplazar,
  // intercambiar · Se reserva: que una misma reacción tiene dos etiquetas · Debe verse: qué se junta o se cambia.
  const TIPOS = {
    sintesis: { t: 'Síntesis', a: [{ e: 'A', n: 3 }, { e: 'B', n: 3 }], d: [{ e: 'AB', n: 3 }], lee: 'Dos sustancias forman una sola.' },
    descomp: { t: 'Descomposición', a: [{ e: 'AB', n: 3 }], d: [{ e: 'A', n: 3 }, { e: 'B', n: 3 }], lee: 'Una sustancia se separa en varias.' },
    simple: { t: 'Desplazamiento', a: [{ e: 'X', n: 3 }, { e: 'AB', n: 3 }], d: [{ e: 'XB', n: 3 }, { e: 'A', n: 3 }], lee: 'X toma el lugar de A en el compuesto.' },
    doble: { t: 'Doble desplazamiento', a: [{ e: 'AB', n: 2 }, { e: 'XY', n: 2 }], d: [{ e: 'AY', n: 2 }, { e: 'XB', n: 2 }], lee: 'Dos compuestos intercambian sus partes.' },
  };
  const clasif = {
    id: 'clasificar',
    titulo: 'Juntar, separar, reemplazar',
    temas: ['Clasificación de las reacciones'],
    pieza: 'quim-particulas',
    juega: {
      consigna: 'Elige un tipo de reacción y compara antes y después. Fíjate qué partículas se juntan, se separan o se cambian de pareja.',
      voz: 'Sigue a una sola partícula de antes a después.',
      controles: [{ id: 'k', etiqueta: 'Tipo', opciones: Object.keys(TIPOS).map(k => ({ valor: k, texto: TIPOS[k].t })) }],
      dibujo: val => lupa([{ titulo: 'Antes', forma: 'caja', particulas: TIPOS[val.k].a }, { titulo: 'Después', forma: 'caja', particulas: TIPOS[val.k].d }]),
      lectura: val => [`${TIPOS[val.k].t}: ${TIPOS[val.k].lee}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'En 2 H₂ + O₂ → 2 H₂O, el hidrógeno pasa de 0 a +1 y el oxígeno de 0 a −2. ¿Cómo se clasifica?',
      voz: 'Puede haber más de un criterio a la vez.',
      opciones: [
        { id: 'c', texto: 'Es síntesis y también redox', correcta: true },
        { id: 'sintesis', texto: 'Solo síntesis: dos sustancias forman una', error: 'QM-CLASIF', siFuera: 'Es síntesis, bien. Sería solo eso si ningún estado de oxidación cambiara.' },
        { id: 'redox', texto: 'Solo redox: hay transferencia de electrones', error: 'QM-CLASIF', siFuera: 'Es redox, bien. Pero además dos sustancias forman una: también es síntesis.' },
        { id: 'descomp', texto: 'Descomposición: el agua se separa', error: 'QM-CLASIF', siFuera: 'Sería descomposición leída al revés: agua que da hidrógeno y oxígeno.' },
      ],
      dibujo: lupa([{ titulo: 'Antes', forma: 'caja', particulas: [{ e: 'H2', n: 4 }, { e: 'O2', n: 2 }] }, { titulo: 'Después', forma: 'caja', particulas: [] }]),
      revelar: lupa([{ titulo: 'Antes', forma: 'caja', particulas: [{ e: 'H2', n: 4 }, { e: 'O2', n: 2 }] }, { titulo: 'Síntesis y redox', forma: 'caja', particulas: [{ e: 'H2O', n: 4 }] }]),
      coincide: 'Coincide: dos sustancias forman una y cambian los estados.',
      noCoincide: 'Las etiquetas se solapan: es síntesis y es redox a la vez.',
    },
    mira: {
      datos: lupa([
        { titulo: 'Antes', forma: 'vaso', nivel: 0.85, particulas: [...fondo('Fe', 3, 0.9, 0.9, 0.2, 0.8).map(p => Object.assign(p, { desde: 1 })), { e: 'H2O', n: 4, desde: 1 }, { e: 'Ag', n: 3, desde: 1 }] },
        { titulo: 'Después', forma: 'vaso', nivel: 0.85, particulas: [{ e: 'H2O', n: 4, desde: 2 }, { e: 'Fe', n: 3, desde: 2, resalta: true }, ...fondo('Ag', 3, 0.9, 0.9, 0.2, 0.8).map(p => Object.assign(p, { desde: 2 }))] },
      ]).datos,
      voz: 'Sigamos al hierro y a la plata.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Hierro sólido en una solución con iones plata, Ag⁺.', ecuacion: ['Fe + 2 Ag⁺'] },
        { estado: { corte: 2 }, texto: 'El hierro pasa a la solución y la plata se deposita.', ecuacion: ['→ Fe²⁺ + 2 Ag'] },
        { estado: { corte: 2 }, texto: 'Un elemento reemplaza a otro: desplazamiento simple.' },
        { estado: { corte: 2 }, texto: 'Y cambian estados: Fe sube a +2, Ag baja a 0. También es redox.' },
      ],
    },
    regla: {
      texto: 'Síntesis: varias sustancias forman una. Descomposición: una forma varias. Desplazamiento: un elemento reemplaza a otro. Doble desplazamiento: dos compuestos intercambian iones.',
      ecuacion: ['A + B → AB · AB → A + B · X + AB → XB + A · AB + XY → AY + XB'],
      condicion: 'los criterios se solapan: una síntesis o un desplazamiento pueden ser también redox; combustión y ácido-base son otras etiquetas.',
      voz: 'Una reacción puede llevar dos etiquetas.',
    },
    ahoraTu: {
      voz: 'Mira qué se junta, se separa o se cambia.',
      generar(s) {
        const C = [['CaCO₃ → CaO + CO₂', 'descomp'], ['N₂ + 3 H₂ → 2 NH₃', 'sintesis'], ['Zn + CuSO₄ → ZnSO₄ + Cu', 'simple'], ['AgNO₃ + KCl → AgCl + KNO₃', 'doble'],
          ['2 H₂O₂ → 2 H₂O + O₂', 'descomp'], ['CaO + H₂O → Ca(OH)₂', 'sintesis'], ['Mg + 2 HCl → MgCl₂ + H₂', 'simple'], ['BaCl₂ + Na₂SO₄ → BaSO₄ + 2 NaCl', 'doble'], ['2 Na + Cl₂ → 2 NaCl', 'sintesis']];
        const [ec, tipo] = C[s % C.length];
        const SI = { sintesis: 'Sería síntesis si varias sustancias formaran una sola.', descomp: 'Sería descomposición si una sustancia diera varias.', simple: 'Sería desplazamiento si un elemento solo reemplazara a otro en un compuesto.', doble: 'Sería doble desplazamiento si dos compuestos intercambiaran sus iones.' };
        return {
          pregunta: `¿Qué tipo de reacción es ${ec}?`,
          opciones: Object.keys(TIPOS).map(k => (k === tipo ? { id: 'c', texto: TIPOS[k].t, correcta: true } : { id: k, texto: TIPOS[k].t, error: 'QM-CLASIF', siFuera: SI[k] })),
          solucion: { texto: TIPOS[tipo].lee, ecuacion: [ec] },
        };
      },
    },
  };

  // ---------- Idea 3: balancear por tanteo (coeficientes, nunca subíndices) ----------
  // Cambia: los coeficientes · Permanece: las fórmulas (subíndices) y el inventario por elemento · Progresa: cada
  // elemento se iguala · Se reserva: el subíndice tocado, que cambia la sustancia · Debe verse: el inventario igual
  // a los dos lados.
  const cuenta = (pares, extra = {}) => pares.map(([e, n]) => Object.assign({ e, texto: f(n, 0) }, extra));
  function metano(a, b) {
    return lupa([
      { titulo: `CH₄ + ${a} O₂`, forma: 'caja', particulas: [{ e: 'CH4', n: 1 }, { e: 'O2', n: a }], cuenta: cuenta([['C', 1], ['H', 4], ['O', 2 * a]]) },
      { titulo: `CO₂ + ${b} H₂O`, forma: 'caja', particulas: [{ e: 'CO2', n: 1 }, { e: 'H2O', n: b }], cuenta: cuenta([['C', 1], ['H', 2 * b], ['O', 2 + b]]) },
    ], { alto: 130 });
  }
  const tanteo = {
    id: 'tanteo',
    titulo: 'Coeficientes, nunca subíndices',
    temas: ['Balance por tanteo'],
    pieza: 'quim-particulas',
    juega: {
      consigna: 'Quema de metano. Cambia cuántas moléculas de O₂ y de H₂O hay. Busca que cada elemento tenga los mismos átomos a los dos lados.',
      voz: 'Compara elemento por elemento: C, después H, después O.',
      controles: [
        { id: 'a', etiqueta: 'O₂', color: 'c-o', min: 1, max: 4, paso: 1, inicio: 1, decimales: 0 },
        { id: 'b', etiqueta: 'H₂O', color: 'c-o', min: 1, max: 4, paso: 1, inicio: 1, decimales: 0 },
      ],
      dibujo: val => metano(val.a, val.b),
      lectura: val => [`H: 4 | ${2 * val.b} · O: ${2 * val.a} | ${2 + val.b}${val.b === 2 && val.a === 2 ? ' · balanceada ✓' : ''}`],
      minimo: 4,
    },
    predice: {
      pregunta: 'Para balancear H₂ + O₂ → H₂O, alguien escribe H₂ + O₂ → H₂O₂: así los oxígenos ya cuadran. ¿Qué pasó?',
      voz: 'Mira qué sustancia queda escrita.',
      opciones: [
        { id: 'c', texto: 'Cuadra, pero ahora describe otra sustancia: agua oxigenada', correcta: true },
        { id: 'vale', texto: 'Es otra forma válida de balancear', error: 'ES11', siFuera: 'Los átomos cuadran, cierto. Pero un subíndice define la sustancia: H₂O₂ no es agua.' },
        { id: 'h', texto: 'No cuadra el hidrógeno', error: 'ES12', siFuera: 'El hidrógeno sí cuadra: 2 y 2. El problema es la sustancia, no la cuenta.' },
      ],
      dibujo: lupa([{ titulo: 'H₂ + O₂', forma: 'caja', particulas: [{ e: 'H2', n: 1 }, { e: 'O2', n: 1 }] }, { titulo: 'H₂O₂', forma: 'caja', particulas: [] }]),
      revelar: lupa([{ titulo: 'H₂ + O₂', forma: 'caja', particulas: [{ e: 'H2', n: 1 }, { e: 'O2', n: 1 }] }, { titulo: 'H₂O₂ (no es agua)', forma: 'caja', particulas: [{ e: 'H2O2', n: 1 }] }]),
      coincide: 'Coincide: cambiar el subíndice cambia la sustancia. El agua es 2 H₂ + O₂ → 2 H₂O.',
      noCoincide: 'Los átomos cuadran, pero H₂O₂ es otra sustancia. Lo correcto: 2 H₂ + O₂ → 2 H₂O.',
    },
    mira: {
      datos: lupa([
        { titulo: 'Fe + O₂', forma: 'caja', particulas: [{ e: 'Fe', n: 1, desde: 1, hasta: 2 }, { e: 'Fe', n: 4, desde: 3 }, { e: 'O2', n: 1, desde: 1, hasta: 1 }, { e: 'O2', n: 3, desde: 2 }],
          cuenta: [...cuenta([['Fe', 1], ['O', 2]], { desde: 1, hasta: 1 }), ...cuenta([['Fe', 1], ['O', 6]], { desde: 2, hasta: 2 }), ...cuenta([['Fe', 4], ['O', 6]], { desde: 3 })] },
        { titulo: 'Fe₂O₃', forma: 'caja', particulas: [{ e: 'Fe2O3', n: 1, desde: 1, hasta: 1 }, { e: 'Fe2O3', n: 2, desde: 2 }],
          cuenta: [...cuenta([['Fe', 2], ['O', 3]], { desde: 1, hasta: 1 }), ...cuenta([['Fe', 4], ['O', 6]], { desde: 2 })] },
      ], { alto: 130 }).datos,
      voz: 'Igualemos elemento por elemento.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Fe + O₂ → Fe₂O₃: no cuadra ni el hierro ni el oxígeno.', ecuacion: ['Fe: 1 | 2 · O: 2 | 3'] },
        { estado: { corte: 2 }, texto: 'Oxígeno: el mínimo común de 2 y 3 es 6.', ecuacion: [cf(3), ' O₂ → ', cf(2), ' Fe₂O₃'] },
        { estado: { corte: 3 }, texto: 'Hierro: a la derecha hay 4; ponemos 4 Fe.', ecuacion: [cf(4), ' Fe + ', cf(3), ' O₂ → ', cf(2), ' Fe₂O₃'] },
        { estado: { corte: 3 }, texto: 'Inventario igual: 4 Fe y 6 O a cada lado.', ecuacion: ['Fe: 4 = 4 · O: 6 = 6'] },
      ],
    },
    regla: {
      texto: 'Se ajustan los coeficientes (cuántas moléculas), nunca los subíndices (qué sustancia), hasta que cada elemento tenga los mismos átomos a los dos lados.',
      ecuacion: [cf(4), ' Fe + ', cf(3), ' O₂ → ', cf(2), ' Fe₂O₃'],
      condicion: 'se usan los enteros más pequeños. Una ecuación balanceada no prueba que la reacción ocurra ni muestra sus pasos.',
      voz: 'Inventario igual antes y después; elemento por elemento.',
    },
    ahoraTu: {
      voz: 'Cuenta un elemento a la vez.',
      generar(s) {
        // [reactivos, productos] con [coeficiente, fórmula]; los números los comprueba contar() abajo.
        const C = [
          [[[1, 'N₂', { N: 2 }], [3, 'H₂', { H: 2 }]], [[2, 'NH₃', { N: 1, H: 3 }]]],
          [[[1, 'C₃H₈', { C: 3, H: 8 }], [5, 'O₂', { O: 2 }]], [[3, 'CO₂', { C: 1, O: 2 }], [4, 'H₂O', { H: 2, O: 1 }]]],
          [[[2, 'Al', { Al: 1 }], [3, 'Cl₂', { Cl: 2 }]], [[2, 'AlCl₃', { Al: 1, Cl: 3 }]]],
          [[[2, 'KClO₃', { K: 1, Cl: 1, O: 3 }]], [[2, 'KCl', { K: 1, Cl: 1 }], [3, 'O₂', { O: 2 }]]],
          [[[2, 'Na', { Na: 1 }], [2, 'H₂O', { H: 2, O: 1 }]], [[2, 'NaOH', { Na: 1, O: 1, H: 1 }], [1, 'H₂', { H: 2 }]]],
          [[[1, 'CH₄', { C: 1, H: 4 }], [2, 'O₂', { O: 2 }]], [[1, 'CO₂', { C: 1, O: 2 }], [2, 'H₂O', { H: 2, O: 1 }]]],
          [[[2, 'H₂O₂', { H: 2, O: 2 }]], [[2, 'H₂O', { H: 2, O: 1 }], [1, 'O₂', { O: 2 }]]],
          [[[4, 'Al', { Al: 1 }], [3, 'O₂', { O: 2 }]], [[2, 'Al₂O₃', { Al: 2, O: 3 }]]],
        ];
        const [re, pr] = C[s % C.length];
        const todos = [...re, ...pr], k = Math.floor(s / C.length) % todos.length;
        const escribir = (lado, base) => lado.map((x, i) => (base + i === k ? '__ ' : x[0] === 1 ? '' : `${x[0]} `) + x[1]).join(' + ');
        const bien = todos[k][0];
        return {
          pregunta: `¿Qué coeficiente va en el espacio para que la ecuación quede balanceada? ${escribir(re, 0)} → ${escribir(pr, re.length)}`,
          opciones: opciones(bien, [
            { id: 'mas', valor: bien + 1, error: 'ES12', siFuera: `Con ${f(bien + 1, 0)} sobraría un elemento a ese lado.` },
            { id: 'menos', valor: bien === 1 ? 3 : bien - 1, error: 'ES12', siFuera: 'Con ese número algún elemento no tendría los mismos átomos a los dos lados.' },
            { id: 'doble', valor: bien * 2, error: 'ES12', siFuera: 'Ese número sirve solo si se duplican también los demás coeficientes.' },
          ], n => f(n, 0)),
          solucion: { texto: 'Con ese coeficiente cada elemento tiene los mismos átomos a ambos lados.', ecuacion: [`${re.map(x => `${x[0] === 1 ? '' : x[0] + ' '}${x[1]}`).join(' + ')} → ${pr.map(x => `${x[0] === 1 ? '' : x[0] + ' '}${x[1]}`).join(' + ')}`] },
        };
      },
    },
  };

  // ---------- Idea 4: quién se oxida, quién se reduce ----------
  // Cambia: la reacción · Permanece: la recta de estados de oxidación · Progresa: un salto a la derecha (oxidación)
  // y otro a la izquierda (reducción) · Se reserva: el cruce de nombres (el oxidante se reduce) · Debe verse:
  // electrones perdidos = ganados.
  const recta = (saltos, extra = {}) => ({ datos: Object.assign({ min: -3, max: 4, paso: 1, cada: 1, variable: 'ω', color: 'd', filas: 2, elementos: saltos }, extra), estado: {} });
  const REAC = {
    zn: { t: 'Zn + Cu²⁺', s: [['Zn', 0, 2], ['Cu', 2, 0]], ox: 'Zn', red: 'Cu²⁺', e: 2 },
    mg: { t: 'Mg + O₂', s: [['Mg', 0, 2], ['O', 0, -2]], ox: 'Mg', red: 'O₂', e: 4 },
    cu: { t: 'Cu + Ag⁺', s: [['Cu', 0, 2], ['Ag', 1, 0]], ox: 'Cu', red: 'Ag⁺', e: 2 },
    h2: { t: 'H₂ + Cl₂', s: [['H', 0, 1], ['Cl', 0, -1]], ox: 'H₂', red: 'Cl₂', e: 2 },
  };
  const saltos = (s, desde = [0, 0]) => s.map(([x, a, b], i) => ({ tipo: 'salto', a, b, color: 'd', rotulo: `${x}: ${b > a ? 'se oxida' : 'se reduce'}`, fila: i + 1, desde: desde[i] }));
  const redox = {
    id: 'oxida-reduce',
    titulo: 'Quién se oxida, quién se reduce',
    temas: ['Oxidación, reducción y agentes'],
    pieza: 'recta',
    juega: {
      consigna: 'Elige una reacción. En la recta de estados de oxidación, un salto va a la derecha y otro a la izquierda. Compara los dos.',
      voz: 'Sube quien pierde electrones; baja quien los gana.',
      controles: [{ id: 'k', etiqueta: 'Reacción', opciones: Object.keys(REAC).map(k => ({ valor: k, texto: REAC[k].t })) }],
      dibujo: val => recta(saltos(REAC[val.k].s)),
      lectura: val => { const r = REAC[val.k]; return [`${r.ox} se oxida (reductor); ${r.red} se reduce (oxidante)`]; },
      minimo: 3,
    },
    predice: {
      pregunta: 'En el alto horno: Fe₂O₃ + 3 CO → 2 Fe + 3 CO₂. El hierro pasa de +3 a 0 y el carbono de +2 a +4. ¿Cuál es el agente reductor?',
      voz: 'Primero decide quién sube y quién baja.',
      opciones: [
        { id: 'c', texto: 'El CO: su carbono se oxida', correcta: true },
        { id: 'fe2o3', texto: 'El Fe₂O₃: pierde oxígeno', error: 'EC9', siFuera: 'Perder oxígeno suele ir con reducirse, bien. Por eso el Fe₂O₃ es el oxidante.' },
        { id: 'fe', texto: 'El Fe, que se forma', error: 'QM-AGENTE', siFuera: 'El hierro es un producto. Los agentes son reactivos.' },
        { id: 'co2', texto: 'El CO₂, porque gana oxígeno', error: 'QM-AGENTE', siFuera: 'El CO₂ es un producto. El reactivo que se oxida es el CO.' },
      ],
      dibujo: recta([]),
      revelar: recta(saltos([['Fe', 3, 0], ['C', 2, 4]])),
      coincide: 'Coincide: el C sube de +2 a +4; el CO es el reductor.',
      noCoincide: 'El C del CO sube de +2 a +4: se oxida, y el que se oxida es el reductor.',
    },
    mira: {
      datos: recta(saltos(REAC.zn.s, [1, 2])).datos,
      voz: 'Sigamos los electrones del zinc al cobre.',
      pasos: [
        { estado: { corte: 1 }, texto: 'El zinc sube de 0 a +2: pierde 2 electrones. Se oxida.', ecuacion: ['Zn → Zn²⁺ + 2 ', el] },
        { estado: { corte: 2 }, texto: 'El ion cobre baja de +2 a 0: gana 2 electrones. Se reduce.', ecuacion: ['Cu²⁺ + 2 ', el, ' → Cu'] },
        { estado: { corte: 2 }, texto: 'Los electrones que pierde el zinc son los que gana el cobre.', ecuacion: ['perdidos = ganados = 2'] },
        { estado: { corte: 2 }, texto: 'El zinc causa la reducción: es el reductor. El Cu²⁺ es el oxidante.' },
      ],
    },
    regla: {
      texto: 'Oxidarse es subir de estado de oxidación (perder electrones); reducirse es bajar (ganarlos). El agente oxidante se reduce y el agente reductor se oxida.',
      ecuacion: ['Zn → Zn²⁺ + 2 ', el, '   ·   Cu²⁺ + 2 ', el, ' → Cu'],
      condicion: 'los electrones perdidos por uno son los ganados por otro. Oxidar no es solo agregar oxígeno: también hay redox sin oxígeno.',
      voz: 'El nombre del agente es lo que le hace al otro.',
    },
    ahoraTu: {
      pieza: 'recta',
      voz: 'Ubica los dos saltos en la recta.',
      generar(s) {
        const C = [['Zn + 2 HCl → ZnCl₂ + H₂', 'Zn', 'HCl', [['Zn', 0, 2], ['H', 1, 0]]], ['2 Na + Cl₂ → 2 NaCl', 'Na', 'Cl₂', [['Na', 0, 1], ['Cl', 0, -1]]],
          ['Fe + CuSO₄ → FeSO₄ + Cu', 'Fe', 'CuSO₄', [['Fe', 0, 2], ['Cu', 2, 0]]], ['2 Mg + O₂ → 2 MgO', 'Mg', 'O₂', [['Mg', 0, 2], ['O', 0, -2]]],
          ['CuO + H₂ → Cu + H₂O', 'H₂', 'CuO', [['Cu', 2, 0], ['H', 0, 1]]], ['2 Al + 3 Cl₂ → 2 AlCl₃', 'Al', 'Cl₂', [['Al', 0, 3], ['Cl', 0, -1]]]];
        const [ec, red, ox, sal] = C[s % C.length], pideOx = s % 2 === 1;
        const bien = pideOx ? ox : red, otro = pideOx ? red : ox;
        return {
          pregunta: `En ${ec}, ¿cuál es el agente ${pideOx ? 'oxidante' : 'reductor'}?`,
          dibujo: recta([]),
          opciones: [
            { id: 'c', texto: bien, correcta: true },
            { id: 'cruce', texto: otro, error: 'QM-AGENTE', siFuera: `${otro} ${pideOx ? 'se oxida: es el reductor' : 'se reduce: es el oxidante'}. El nombre del agente es lo que provoca en el otro.` },
            { id: 'prod', texto: ec.split('→ ')[1].split(' + ')[0].replace(/^\d+ /, ''), error: 'QM-AGENTE', siFuera: 'Ese es un producto. Los agentes son reactivos.' },
          ],
          solucion: { texto: pideOx ? `${ox} contiene al que baja: se reduce, es el oxidante.` : `${red} contiene al que sube: se oxida, es el reductor.`, ecuacion: [sal.map(([x, a, b]) => `${x}: ${sg(a)} → ${sg(b)}`).join('   ·   ')], dibujo: recta(saltos(sal)) },
        };
      },
    },
  };

  // ---------- Idea 5: ion-electrón: la carga también se balancea ----------
  // Cambia: cuántos electrones se agregan · Permanece: MnO₄⁻ + 8 H⁺ a la izquierda y la carga de la derecha (+2)
  // · Progresa: la carga de la izquierda baja hasta igualar · Se reserva: la suma final, donde los electrones se
  // cancelan · Debe verse: carga izquierda = carga derecha.
  const media = n => ({ datos: { fichas: [{ t: 'MnO₄⁻', carga: -1, color: 'd' }, { t: '8 H⁺', carga: 8, color: 'h' }, { t: 'e⁻', carga: -1, n, color: 'i' }], neta: 'carga a la izquierda' }, estado: {} });
  const ionE = {
    id: 'ion-electron',
    titulo: 'La carga también se balancea',
    temas: ['Balance redox por ion-electrón'],
    pieza: 'quim-fichas',
    juega: {
      consigna: 'Semirreacción del permanganato en medio ácido. Agrega electrones a la izquierda hasta que la carga sea igual a la de la derecha.',
      voz: 'Compara las dos cargas, no solo los átomos.',
      controles: [{ id: 'n', etiqueta: 'e⁻', color: 'c-i', min: 0, max: 8, paso: 1, inicio: 0, decimales: 0 }],
      dibujo: val => media(val.n),
      lectura: val => [`Izquierda: ${sg(7 - val.n)} · derecha (Mn²⁺ + 4 H₂O): +2${7 - val.n === 2 ? ' ✓' : ''}`],
      minimo: 4,
    },
    predice: {
      pregunta: ['El Fe²⁺ pasa a Fe³⁺ y pierde 1 ', el, '. El MnO₄⁻ gana 5 ', el, '. ¿Por cuánto se multiplica la semirreacción del hierro para sumarlas?'],
      voz: 'Los electrones no pueden sobrar al sumar.',
      opciones: [
        { id: 'c', texto: 'Por 5', correcta: true },
        { id: 'uno', texto: 'Por 1: ya está balanceada', error: 'EC11', siFuera: 'Está balanceada sola, cierto. Al sumar, sobrarían 4 electrones del manganeso.' },
        { id: 'ocho', texto: 'Por 8, como los H⁺', error: 'QM-ION-E', siFuera: 'Los 8 H⁺ balancean el hidrógeno. Lo que se iguala al sumar son electrones.' },
      ],
      dibujo: { datos: { fichas: [{ t: 'Fe²⁺', carga: 1, n: 1, color: 'o' }, { t: 'MnO₄⁻', carga: -5, color: 'd' }], neta: 'e⁻ dados − tomados' }, estado: {} },
      revelar: { datos: { fichas: [{ t: 'Fe²⁺', carga: 1, n: 5, color: 'o' }, { t: 'MnO₄⁻', carga: -5, color: 'd' }], neta: 'e⁻ dados − tomados' }, estado: {} },
      coincide: 'Coincide: cinco Fe²⁺ dan los 5 electrones que toma un MnO₄⁻.',
      noCoincide: 'Cinco Fe²⁺ dan los 5 electrones que toma un MnO₄⁻: se multiplica por 5.',
    },
    mira: {
      datos: { fichas: [{ t: 'MnO₄⁻', carga: -1, color: 'd', desde: 1 }, { t: '8 H⁺', carga: 8, color: 'h', desde: 3 }, { t: 'e⁻', carga: -1, n: 5, color: 'i', desde: 4 }], neta: 'carga a la izquierda' },
      voz: 'Primero átomos, después carga.',
      pasos: [
        { estado: { corte: 1 }, texto: 'MnO₄⁻ pasa a Mn²⁺: el manganeso ya cuadra.', ecuacion: ['MnO₄⁻ → Mn²⁺'] },
        { estado: { corte: 2 }, texto: 'Los 4 O salen como agua a la derecha.', ecuacion: ['MnO₄⁻ → Mn²⁺ + 4 H₂O'] },
        { estado: { corte: 3 }, texto: 'Los 8 H del agua entran como H⁺: medio ácido.', ecuacion: ['MnO₄⁻ + 8 H⁺ → Mn²⁺ + 4 H₂O'] },
        { estado: { corte: 4 }, texto: 'Carga: +7 a la izquierda, +2 a la derecha. Faltan 5 electrones.', ecuacion: ['MnO₄⁻ + 8 H⁺ + 5 ', el, ' → Mn²⁺ + 4 H₂O'] },
        { estado: { corte: 4 }, texto: 'Se suma con 5 Fe²⁺ → 5 Fe³⁺ + 5 e⁻; los electrones se cancelan.', ecuacion: ['MnO₄⁻ + 8 H⁺ + 5 Fe²⁺ → Mn²⁺ + 4 H₂O + 5 Fe³⁺'] },
      ],
    },
    regla: {
      texto: 'Separa oxidación y reducción. En cada una, balancea el átomo central, el O con H₂O, el H con H⁺ y la carga con electrones. Iguala electrones y suma.',
      ecuacion: ['MnO₄⁻ + 8 H⁺ + 5 ', el, ' → Mn²⁺ + 4 H₂O'],
      condicion: 'así se hace en medio ácido; en medio básico, al final los H⁺ se neutralizan con OH⁻. La suma no lleva electrones.',
      voz: 'Átomos primero; la carga cierra con electrones.',
    },
    ahoraTu: {
      pieza: 'quim-fichas',
      voz: 'Compara la carga de los dos lados.',
      generar(s) {
        // [izquierda sin electrones, carga izquierda, derecha, carga derecha]
        const C = [['MnO₄⁻ + 8 H⁺', 7, 'Mn²⁺ + 4 H₂O', 2], ['Cr₂O₇²⁻ + 14 H⁺', 12, '2 Cr³⁺ + 7 H₂O', 6], ['NO₃⁻ + 4 H⁺', 3, 'NO + 2 H₂O', 0],
          ['NO₃⁻ + 2 H⁺', 1, 'NO₂ + H₂O', 0], ['SO₄²⁻ + 4 H⁺', 2, 'SO₂ + 2 H₂O', 0], ['O₂ + 4 H⁺', 4, '2 H₂O', 0], ['MnO₄⁻ + 4 H⁺', 3, 'MnO₂ + 2 H₂O', 0]];
        const [iz, qi, de, qd] = C[s % C.length], n = qi - qd;
        return {
          pregunta: ['¿Cuántos electrones van a la izquierda? ', `${iz} + n `, el, ` → ${de}`],
          opciones: opciones(n, [
            { id: 'izq', valor: qi, error: 'QM-ION-E', siFuera: 'Esa es la carga de la izquierda. Los electrones igualan la diferencia con la derecha.' },
            { id: 'suma', valor: qi + qd, error: 'EC11', siFuera: 'Eso suma las cargas. Se busca que las dos queden iguales.' },
            { id: 'h', valor: +iz.match(/(\d+) H⁺/)[1], error: 'QM-ION-E', siFuera: 'Ese es el número de H⁺. Los electrones balancean la carga.' },
            { id: 'mas', valor: n + 2, error: 'EC11', siFuera: `Con ${f(n + 2, 0)} electrones la izquierda quedaría por debajo de la derecha.` },
            { id: 'menos', valor: n - 1 > 0 ? n - 1 : n + 1, error: 'EC11', siFuera: 'Con ese número la carga de los dos lados no se iguala.' },
          ], v => f(v, 0)),
          solucion: { texto: `Izquierda ${sg(qi)}, derecha ${sg(qd)}: hacen falta ${f(n, 0)} electrones.`, ecuacion: [`${sg(qi)} − ${f(n, 0)} = ${sg(qd)}`] },
        };
      },
    },
  };

  return {
    unidad: 'quimica.reacciones-y-balance',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/quim-particulas.js', '/nucleo/kit/piezas/quim-cadena.js', '/nucleo/kit/piezas/recta.js', '/nucleo/kit/piezas/quim-fichas.js'],
    historia: {
      texto: 'Escribir una transformación de forma compacta exigió un lenguaje común. En 1813, Berzelius propuso símbolos de letras para los elementos, que se difundieron poco a poco. Su notación no era la de hoy. Una ecuación moderna suma a esos símbolos el balance de átomos y de carga: se ajustan cantidades, no sustancias.',
      pregunta: '¿Qué tendría que conservarse para que una ecuación sea creíble?',
      fuente: { titulo: 'OpenStax, Chemistry 2e, §4.1', url: 'https://openstax.org/books/chemistry-2e/pages/4-1-writing-and-balancing-chemical-equations' },
    },
    ideas: [evidencias, clasif, tanteo, redox, ionE],
  };
});
