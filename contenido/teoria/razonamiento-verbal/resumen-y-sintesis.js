/*
 * Teoría de «Resumen y síntesis» (razonamiento-verbal.resumen-y-sintesis). Molde: docs/teoria.md. Contenido: matriz de
 * verbal (unidad 10), historia (macrorreglas de van Dijk, 1977 y 1980), precisión del expediente («parafrasear no es
 * inferir») y códigos RV7, RV11, RV43, RV44, RV58 y RV59–RV61. Textos propios (regla 5).
 * Ruta C · Comparar: se pone una versión junto al original y se ve qué conserva y qué cambia.
 *
 * Ficha de tarea:
 *   Promesa: elegir el resumen o la síntesis que conserva relaciones, alcance y autoría del original.
 *   Persona y condiciones: postulante de 3.º a 5.º, celular, sin audio; resumen y síntesis (UNI 15, UNMSM 5).
 *   Resultado observable: produce o selecciona un resumen que conserva alcance, relaciones y postura.
 *   Orden de atención: 1.º el original · 2.º la versión propuesta · 3.º lo que cambia (h) o se conserva (i).
 *   Estados: fiel · lista sin jerarquía · alcance cambiado · relación inventada · desacuerdo borrado.
 *   Duda que resuelve: ¿por qué «todos mejoraron» no resume «algunos mejoraron»?
 *
 * Colores (regla 4): lo que el original dice i (turquesa, continuo), la versión propuesta o (naranja, discontinuo),
 * la relación o la autoría d (verde, punteado), lo que cambia o se inventa h (rojo).
 * Códigos: RV7, RV11, RV43 (resumen como lista), RV44 (relación inventada), RV58 (dar por dicho lo deducido), RV59
 * (autoría cruzada), RV61; RVR1 (síntesis que borra un desacuerdo) es hipótesis nueva.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  // Gesto directo (docs/teoria.md §4b): el marcador se arrastra por las frases y se suelta en la que se quiere comparar
  // (rv-texto.ancla pone la manija; rv-texto.cercana elige la frase más cercana al dedo). Comparar parte por parte es
  // lo que pide la ruta C: la lectura dice qué hizo la versión con esa frase.
  const RV = () => Kit.piezas['rv-texto'];
  const marcador = (datosDe, ids, ctrl, etiqueta) => ({
    id: 'frase', etiqueta, color: 'c-i',
    donde: val => RV().ancla(datosDe(val), val[ctrl]),
    mover: (pt, val) => ({ [ctrl]: RV().cercana(datosDe(val), pt, ids) }),
  });
  // [lo que pasó, color]: i conserva, d se omite sin daño (un detalle), h cambia, inventa o borra.
  const lee = ([t, c]) => { const k = t.indexOf(': '); const fn = c === 'i' ? dice : c === 'd' ? rel : cambia; return k > 0 ? [fn(t.slice(0, k)), t.slice(k)] : [fn(t)]; };
  const corto = (fn, t) => {
    // El trozo de color no se parte: con 14 letras o menos cabe en la miniatura de un caso guardado del laboratorio.
    if (t.length <= 14) return fn(t);
    const k = [t.indexOf(': '), t.indexOf(', ')].filter(i => i > 0).sort((a, b) => a - b)[0];
    if (k && k <= 14) return [fn(t.slice(0, k)), t.slice(k)];
    const ps = t.split(' '); let n = 1;
    while (n < ps.length && ps.slice(0, n + 1).join(' ').length <= 14) n++;
    return [fn(ps.slice(0, n).join(' ')), ' ' + ps.slice(n).join(' ')];
  };
  const dice = t => ({ v: 'c-i', t }), version = t => ({ v: 'c-o', t }), rel = t => ({ v: 'c-d', t }), cambia = t => ({ v: 'c-h', t });
  const opciones = (c, malas) => [{ id: 'c', texto: c, correcta: true }, ...malas.map(([texto, error, siFuera], k) => ({ id: `e${k}`, texto, error, siFuera }))];
  const voltear = (arr, s) => (s % 2 ? arr.slice().reverse() : arr.slice());
  // Original arriba (fragmentos marcables) y la versión abajo; la versión puede tener trozos que cambian (h).
  const figura = (original, versionFrs, tituloV = 'Resumen') => ({ secciones: [
    { id: 'o', titulo: 'Original', modo: 'tarjeta', fragmentos: original.map(([id, t]) => ({ id, t })) },
    { id: 'v', titulo: tituloV, modo: 'tarjeta', fragmentos: versionFrs.map(([id, t]) => ({ id, t })) },
  ] });

  // ---------- Idea 1: resumir sin cambiar el alcance ----------
  // Cambia: la versión del resumen. Permanece: el texto del taller de lectura. Progresa: qué conserva cada versión.
  // Se reserva: el resumen interpretativo de otro texto (predicción). Debe verse: la palabra que cambia el alcance.
  const TALLER = [['a', 'En el taller de lectura del colegio,'], ['b', 'algunos alumnos'], ['c', 'mejoraron su comprensión en dos meses.'], ['d', 'Los que más avanzaron leían veinte minutos diarios en casa.'], ['e', 'Los demás no cambiaron.']];
  const RES = {
    literal: { frs: [['r1', 'Algunos alumnos del taller mejoraron su comprensión;'], ['r2', 'avanzaron más los que leían a diario en casa.']], marcas: { b: 'i', c: 'i', d: 'i', r1: 'o', r2: 'o' }, dice: 'Fiel: conserva «algunos» y la relación', ok: true },
    todos: { frs: [['r1', 'Todos los alumnos del taller'], ['r2', 'mejoraron su comprensión.']], marcas: { b: 'h', e: 'h', r1: 'h', r2: 'o' }, dice: 'Cambia el alcance: «algunos» → «todos»', ok: false },
    lista: { frs: [['r1', 'Taller de lectura. Dos meses. Veinte minutos. Algunos alumnos.']], marcas: { r1: 'h' }, dice: 'Es una lista: no dice qué une los datos', ok: false },
    causa: { frs: [['r1', 'El taller hizo que los alumnos'], ['r2', 'leyeran en casa todos los días.']], marcas: { d: 'h', r1: 'h', r2: 'h' }, dice: 'Inventa una causa que el texto no da', ok: false },
  };
  const figTaller = k => figura(TALLER, RES[k].frs);
  // Qué hace cada resumen con cada frase del original.
  const TRATO = {
    literal: { a: ['Conserva: el taller', 'i'], b: ['Conserva: «algunos»', 'i'], c: ['Conserva: mejoraron', 'i'], d: ['Conserva: la relación', 'i'], e: ['Lo omite: se entiende', 'd'] },
    todos: { a: ['Conserva: el taller', 'i'], b: ['Lo cambia: «todos»', 'h'], c: ['Conserva: mejoraron', 'i'], d: ['Lo pierde: la relación', 'h'], e: ['Lo contradice', 'h'] },
    lista: { a: ['Palabra suelta', 'h'], b: ['Palabra suelta', 'h'], c: ['Lo pierde: mejoraron', 'h'], d: ['Solo «veinte minutos»', 'h'], e: ['Lo pierde', 'h'] },
    causa: { a: ['Conserva: el taller', 'i'], b: ['Lo pierde: «algunos»', 'h'], c: ['Lo pierde: mejoraron', 'h'], d: ['Lo invierte: es causa', 'h'], e: ['Lo pierde', 'h'] },
  };
  const IDS_T = TALLER.map(([id]) => id);
  const alcance = {
    id: 'alcance',
    titulo: 'Resumir sin cambiar el alcance',
    temas: ['Resumen literal', 'Resumen interpretativo'],
    pieza: 'rv-texto',
    juega: {
      consigna: 'Compara cuatro resúmenes del texto del taller. Mira qué conserva cada uno y qué cambia sin que el texto lo diga.',
      voz: 'Fíjate en palabras como «algunos» o «todos».',
      controles: [
        { id: 'k', etiqueta: 'Resumen', opciones: [{ valor: 'literal', texto: 'A' }, { valor: 'todos', texto: 'B' }, { valor: 'lista', texto: 'C' }, { valor: 'causa', texto: 'D' }] },
        { id: 'f', etiqueta: 'Frase', opciones: IDS_T.map((id, k) => ({ valor: id, texto: `${k + 1}` })), inicio: 'b' },
      ],
      dibujo: val => {
        const marcas = Object.fromEntries(Object.entries(RES[val.k].marcas).filter(([id]) => id[0] === 'r'));
        marcas[val.f] = TRATO[val.k][val.f][1];
        return { datos: figTaller(val.k), estado: { marcas, sellos: { v: RES[val.k].ok ? { t: 'Fiel', c: 'i' } : { t: 'Cambia el texto', c: 'h' } } } };
      },
      lectura: val => lee(TRATO[val.k][val.f]),
      minimo: 3,
      // Pasa el marcador por el original: frase por frase, qué conservó el resumen y qué cambió.
      arrastres: [marcador(val => figTaller(val.k), IDS_T, 'f', 'frase del original')],
    },
    predice: {
      pregunta: 'Un resumen interpretativo usa palabras propias. ¿Cuál resume este texto sobre la helada sin inventar nada?',
      voz: 'Con palabras propias, pero sin agregar hechos.',
      opciones: opciones('Avisar de la helada a tiempo permitió proteger la mayor parte de la cosecha', [
        ['Gracias a la radio, la helada no hizo ningún daño', 'RV11', '«Ningún daño» exagera: el texto dice que se perdió una parte.'],
        ['Helada, radio, plástico, cosecha, comunidad', 'RV43', 'Son las palabras clave, pero no dicen qué las une.'],
        ['La comunidad compró radios porque temía la helada', 'RV44', 'Inventa una compra y una causa que el texto no menciona.'],
      ]),
      dibujo: { datos: figura([['a', 'La radio anunció la helada con un día de anticipación.'], ['b', 'Las familias cubrieron sus papas con plástico.'], ['c', 'Esa noche se perdió solo una parte pequeña de la cosecha.']], [['r1', '¿?']], 'Resumen interpretativo'), estado: {} },
      revelar: { datos: figura([['a', 'La radio anunció la helada con un día de anticipación.'], ['b', 'Las familias cubrieron sus papas con plástico.'], ['c', 'Esa noche se perdió solo una parte pequeña de la cosecha.']], [['r1', 'Avisar de la helada a tiempo permitió proteger la mayor parte de la cosecha.']], 'Resumen interpretativo'), estado: { marcas: { a: 'i', b: 'i', c: 'i', r1: 'o' }, sellos: { v: { t: 'Fiel', c: 'i' } } } },
      coincide: 'Coincide: generaliza los tres hechos en una idea, sin agregar ni exagerar.',
    },
    mira: {
      datos: figTaller('literal'),
      pasos: [
        { estado: { marcas: { b: 'i', c: 'i' }, tapar: ['r1', 'r2'] }, texto: 'Lo esencial: algunos mejoraron. «Algunos» es parte de lo que se dice.', ecuacion: [dice('algunos'), ' mejoraron'] },
        { estado: { marcas: { b: 'i', c: 'i', d: 'd' }, tapar: ['r1', 'r2'], nuevo: ['d'] }, texto: 'Lo que avanzaron más tenían algo en común: leer a diario.', ecuacion: [rel('leer a diario'), ' → más avance'] },
        { estado: { marcas: RES.literal.marcas, sellos: { v: { t: 'Fiel', c: 'i' } }, nuevo: ['r1', 'r2'] }, texto: 'El resumen conserva el alcance y la relación; quita lo accesorio.', ecuacion: [dice('lo esencial'), ' + ', rel('sus relaciones')] },
      ],
    },
    regla: {
      texto: 'Resumir es quitar detalles y conservar lo esencial con sus relaciones y su alcance. El literal usa frases del texto; el interpretativo, palabras propias, sin agregar hechos ni exagerar.',
      ecuacion: [{ llave: [rel('relaciones')], nota: 'qué une', color: 'c-d' }, ' + ', { llave: [dice('alcance')], nota: 'cuántos', color: 'c-i' }],
      condicion: 'se mantienen cuantificadores (algunos, todos), negaciones y causas tal como el texto los dice.',
    },
    ahoraTu: {
      generar(s) {
        const B = [
          { t: 'Algunos ríos de la costa se secan en invierno. En verano vuelven a cargar agua por las lluvias de la sierra.', ok: 'Algunos ríos costeños se secan en invierno y crecen en verano por lluvias andinas', m: [['Los ríos de la costa están secos todo el año', 'RV11', 'Exagera: el texto dice que en verano vuelven a tener agua.'], ['Ríos, costa, invierno, verano, lluvias', 'RV43', 'Es una lista de palabras: no dice qué las une.'], ['Los ríos se secan porque la gente usa mucha agua', 'RV44', 'Inventa una causa: el texto habla de lluvias.']] },
          { t: 'Varios estudios indican que el ejercicio puede mejorar la memoria. Aún no se sabe cuánto ejercicio hace falta.', ok: 'El ejercicio podría mejorar la memoria, aunque no se sabe cuánto se necesita', m: [['Está comprobado que el ejercicio mejora siempre la memoria', 'RV11', '«Puede» no es «siempre»: el texto deja una duda.'], ['Hay que hacer una hora diaria de ejercicio', 'RV7', 'El texto dice que eso aún no se sabe.'], ['Estudios, ejercicio, memoria, cantidad', 'RV43', 'Son palabras clave, sin la relación entre ellas.']] },
          { t: 'Pocos peruanos hablan aimara. La mayoría vive en Puno y transmite la lengua en la familia.', ok: 'El aimara tiene pocos hablantes, sobre todo en Puno, y se transmite en familia', m: [['La mayoría de peruanos habla aimara', 'RV11', 'Cambia el alcance: el texto dice «pocos».'], ['El aimara se enseña en todos los colegios', 'RV7', 'El texto dice que se transmite en la familia.'], ['Aimara, Puno, familia, lengua', 'RV43', 'Es una lista sin relaciones.']] },
          { t: 'La feria vendió más este año. Sin embargo, los productores ganaron menos por los costos del transporte.', ok: 'La feria vendió más, pero los productores ganaron menos por el transporte', m: [['La feria vendió más y los productores ganaron más', 'RV7', 'Borra el contraste: ganaron menos.'], ['Los productores ganaron menos porque vendieron menos', 'RV44', 'Inventa la causa: vendieron más; el problema fue el transporte.'], ['Feria, ventas, productores, transporte', 'RV43', 'Es una lista sin relaciones.']] },
          { t: 'No todas las plantas necesitan mucha agua. Los cactus, por ejemplo, guardan agua en sus tallos.', ok: 'Algunas plantas, como los cactus, viven con poca agua porque la guardan', m: [['Ninguna planta necesita mucha agua', 'RV10', '«No todas» no es «ninguna».'], ['Los cactus necesitan mucha agua', 'RV7', 'El texto dice lo contrario: guardan agua.'], ['Plantas, agua, cactus, tallos', 'RV43', 'Es una lista sin relaciones.']] },
        ];
        const b = B[s % B.length];
        return {
          pregunta: '¿Qué resumen conserva lo que dice el texto, con su alcance?',
          dibujo: { datos: { secciones: [{ id: 'o', titulo: 'Original', modo: 'tarjeta', fragmentos: [{ id: 'a', t: b.t }] }] }, estado: {} },
          opciones: opciones(b.ok, voltear(b.m, s)),
          solucion: { texto: 'Conserva lo esencial, sus relaciones y palabras como «algunos» o «pocos».', ecuacion: [version('resumen'), ' = ', dice('lo esencial'), ' + ', dice('alcance')] },
        };
      },
    },
  };

  // ---------- Idea 2: parafrasear no es inferir ----------
  // Cambia: la versión de la oración. Permanece: la oración original. Progresa: de decir lo mismo a decir más o menos.
  // Se reserva: distinguir paráfrasis de inferencia en otra oración (predicción). Debe verse: la parte que se agrega.
  const ORI = [['a', 'Rosa no fue al colegio'], ['b', 'porque tenía fiebre.']];
  const PAR = {
    fiel: { frs: [['p1', 'Como estaba con fiebre,'], ['p2', 'Rosa faltó al colegio.']], marcas: { a: 'i', b: 'i', p1: 'o', p2: 'o' }, dice: 'Paráfrasis: lo mismo, otras palabras', ok: true },
    infiere: { frs: [['p1', 'Rosa faltó al colegio por fiebre'], ['p2', 'y se perdió el examen.']], marcas: { a: 'i', b: 'i', p1: 'o', p2: 'h' }, dice: 'Agrega algo: ya no es paráfrasis', ok: false },
    cambia: { frs: [['p1', 'Rosa fue al colegio'], ['p2', 'aunque tenía fiebre.']], marcas: { a: 'h', p1: 'h', p2: 'o' }, dice: 'Cambia lo que pasó: dice lo contrario', ok: false },
    corta: { frs: [['p1', 'Rosa no fue al colegio.']], marcas: { a: 'i', b: 'h', p1: 'o' }, dice: 'Pierde la causa: dice menos', ok: false },
  };
  // Qué hace cada parte de la versión con el original (la versión corta tiene una sola parte).
  const PARTES = {
    fiel: { p1: ['Lo mismo: la causa', 'i'], p2: ['Lo mismo: faltó', 'i'] },
    infiere: { p1: ['Lo mismo: faltó por fiebre', 'i'], p2: ['Agrega: el texto no lo dice', 'h'] },
    cambia: { p1: ['Lo contrario: «fue»', 'h'], p2: ['«Aunque» cambia la relación', 'h'] },
    corta: { p1: ['Lo mismo, sin la causa', 'h'], p2: ['Falta: «porque tenía fiebre»', 'h'] },
  };
  const parteDe = (k, f) => (PAR[k].frs.length > 1 ? f : 'p1');
  const figPar = k => figura(ORI, PAR[k].frs, 'Versión');
  const parafrasis = {
    id: 'parafrasis',
    titulo: 'Parafrasear no es inferir',
    temas: ['Paráfrasis'],
    pieza: 'rv-texto',
    juega: {
      consigna: 'Compara versiones de la oración de Rosa. Mira cuál dice lo mismo con otras palabras y cuál dice más o menos.',
      voz: 'Una paráfrasis no suma ni quita información.',
      controles: [
        { id: 'k', etiqueta: 'Versión', opciones: [{ valor: 'fiel', texto: 'A' }, { valor: 'infiere', texto: 'B' }, { valor: 'cambia', texto: 'C' }, { valor: 'corta', texto: 'D' }] },
        { id: 'f', etiqueta: 'Parte', opciones: [{ valor: 'p1', texto: '1' }, { valor: 'p2', texto: '2' }] },
      ],
      dibujo: val => {
        const marcas = Object.fromEntries(Object.entries(PAR[val.k].marcas).filter(([id]) => id[0] !== 'p'));
        marcas[parteDe(val.k, val.f)] = PARTES[val.k][val.f][1] === 'i' ? 'o' : 'h';
        return { datos: figPar(val.k), estado: { marcas, sellos: { v: PAR[val.k].ok ? { t: 'Paráfrasis', c: 'i' } : { t: 'No es paráfrasis', c: 'h' } } } };
      },
      lectura: val => lee(PARTES[val.k][val.f]),
      minimo: 3,
      // Pasa el marcador por la versión: parte por parte, si dice lo mismo, agrega, quita o cambia.
      arrastres: [{ id: 'parte', etiqueta: 'parte de la versión', color: 'c-o',
        donde: val => RV().ancla(figPar(val.k), parteDe(val.k, val.f)),
        mover: (pt, val) => ({ f: RV().cercana(figPar(val.k), pt, PAR[val.k].frs.map(([id]) => id)) }) }],
    },
    predice: {
      pregunta: 'Para la oración del puente, ¿cuál de estas versiones es una inferencia y no una paráfrasis?',
      opciones: opciones('Los vehículos tuvieron que buscar otra ruta', [
        ['Las lluvias obligaron a cerrar el puente', 'RV58', 'Dice lo mismo con otras palabras: es una paráfrasis.'],
        ['A causa de las lluvias, el puente quedó cerrado', 'RV58', 'Cambia el orden, pero no agrega nada: es paráfrasis.'],
        ['Por las lluvias, cerraron el puente', 'RV58', 'Es la misma información: paráfrasis.'],
      ]),
      dibujo: { datos: figura([['a', 'El puente se cerró por las lluvias.']], [['p1', '¿Qué versión agrega algo?']], 'Versiones'), estado: {} },
      revelar: { datos: figura([['a', 'El puente se cerró por las lluvias.']], [['p1', 'Los vehículos tuvieron que buscar otra ruta.']], 'Inferencia'), estado: { marcas: { a: 'i', p1: 'h' }, sellos: { v: { t: 'Agrega una consecuencia', c: 'h' } } } },
      coincide: 'Coincide: «buscar otra ruta» es razonable, pero el original no lo dice: se deduce.',
    },
    mira: {
      datos: figura(ORI, PAR.infiere.frs, 'Versión'),
      pasos: [
        { estado: { marcas: { a: 'i', b: 'i' }, tapar: ['p1', 'p2'] }, texto: 'El original dice dos cosas: que faltó y por qué.', ecuacion: [dice('faltó'), ' + ', dice('fiebre')] },
        { estado: { marcas: { a: 'i', b: 'i', p1: 'o' }, tapar: ['p2'], nuevo: ['p1'] }, texto: '«Faltó por fiebre» dice lo mismo con otras palabras.', ecuacion: [version('faltó por fiebre'), ' = ', dice('lo mismo')] },
        { estado: { marcas: { a: 'i', b: 'i', p1: 'o', p2: 'h' }, sellos: { v: { t: 'No es paráfrasis', c: 'h' } }, nuevo: ['p2'] }, texto: '«Se perdió el examen» puede ser cierto, pero el texto no lo dice.', ecuacion: [cambia('+ el examen'), ': inferencia'] },
      ],
    },
    regla: {
      texto: 'Una paráfrasis dice lo mismo que el original con otras palabras: no agrega, no quita y no cambia. Si suma una consecuencia o una causa nueva, ya es una inferencia.',
      ecuacion: [version('paráfrasis'), ' = ', dice('original'), '   ·   ', { llave: [dice('original'), ' + ', cambia('algo')], nota: 'ya es inferencia', color: 'c-h' }],
      condicion: 'se compara parte por parte: quién, qué, cuándo, por qué y cuánto deben quedar igual.',
    },
    ahoraTu: {
      generar(s) {
        const B = [
          { o: 'La biblioteca abre de lunes a viernes.', ok: 'Los días hábiles, la biblioteca está abierta', m: [['La biblioteca cierra los fines de semana porque no hay lectores', 'RV58', 'Agrega una causa que el original no da.'], ['La biblioteca abre todos los días', 'RV11', 'Cambia el alcance: no abre sábado ni domingo.'], ['La biblioteca abre', 'RV3', 'Pierde los días: dice menos.']] },
          { o: 'Pocos alumnos entregaron la tarea a tiempo.', ok: 'La mayoría de alumnos no entregó la tarea a tiempo', m: [['Ningún alumno entregó la tarea', 'RV10', '«Pocos» no es «ninguno».'], ['La tarea era muy difícil', 'RV58', 'Puede ser una razón, pero el original no la dice.'], ['Muchos alumnos entregaron la tarea a tiempo', 'RV11', 'Dice lo contrario: eran pocos.']] },
          { o: 'El mercado se mudó al nuevo local en marzo.', ok: 'En marzo, el mercado pasó a funcionar en el nuevo local', m: [['El mercado vende más desde marzo', 'RV58', 'Agrega un efecto que el original no menciona.'], ['El mercado se mudará en marzo', 'RV55', 'Cambia el tiempo: ya se mudó.'], ['El mercado tiene un local', 'RV3', 'Pierde cuándo y que se mudó.']] },
          { o: 'Si llueve, la excursión se suspende.', ok: 'La lluvia haría que se suspenda la excursión', m: [['Si no llueve, la excursión se hace', 'RV63', 'Puede suspenderse por otra razón: eso no lo dice el original.'], ['Mañana va a llover', 'RV58', 'El original no dice que vaya a llover.'], ['La excursión se suspendió', 'RV55', 'Cambia una condición por un hecho.']] },
          { o: 'Casi todos los vecinos votaron por arreglar la pista.', ok: 'La gran mayoría de vecinos votó por arreglar la pista', m: [['Todos los vecinos votaron por arreglar la pista', 'RV11', '«Casi todos» no es «todos».'], ['La pista ya fue arreglada', 'RV58', 'Votar no es arreglar: agrega un hecho.'], ['Los vecinos votaron', 'RV3', 'Pierde qué votaron y cuántos.']] },
        ];
        const b = B[s % B.length];
        return {
          pregunta: '¿Qué versión es una paráfrasis fiel del original?',
          dibujo: { datos: { secciones: [{ id: 'o', titulo: 'Original', modo: 'tarjeta', fragmentos: [{ id: 'a', t: b.o }] }] }, estado: { marcas: { a: 'i' } } },
          opciones: opciones(b.ok, voltear(b.m, s)),
          solucion: { texto: 'Dice lo mismo, con otras palabras: ni más ni menos.', ecuacion: [version('paráfrasis'), ' = ', dice('original')] },
        };
      },
    },
  };

  // ---------- Idea 3: síntesis de dos fuentes ----------
  // Cambia: la síntesis propuesta. Permanece: los textos A y B. Progresa: qué síntesis conserva acuerdo, diferencia y
  // autoría. Se reserva: la síntesis que inventa un acuerdo (predicción). Debe verse: el punto donde A y B difieren.
  const A = [['a1', 'Hay mucho tráfico en el centro.'], ['a2', 'Hay que prohibir los autos los domingos.']];
  const Bt = [['b1', 'El tráfico del centro creció mucho.'], ['b2', 'Hay que mejorar los buses, no prohibir autos.']];
  const figSin = sin => ({ secciones: [
    { id: 'A', titulo: 'Texto A', modo: 'tarjeta', fragmentos: A.map(([id, t]) => ({ id, t })) },
    { id: 'B', titulo: 'Texto B', modo: 'tarjeta', fragmentos: Bt.map(([id, t]) => ({ id, t })) },
    { id: 'v', titulo: 'Síntesis', modo: 'tarjeta', fragmentos: [{ id: 's1', t: sin }] },
  ] });
  const SIN = {
    fiel: { t: 'A y B ven un problema de tráfico, pero proponen soluciones distintas.', marcas: { a1: 'i', b1: 'i', a2: 'd', b2: 'd', s1: 'o' }, dice: 'Fiel: acuerdo y diferencia', ok: true },
    acuerdo: { t: 'A y B piden prohibir los autos para reducir el tráfico.', marcas: { b2: 'h', s1: 'h' }, dice: 'Inventa un acuerdo: B no lo pide', ok: false },
    cruzada: { t: 'A propone mejorar los buses y B, prohibir los autos.', marcas: { a2: 'h', b2: 'h', s1: 'h' }, dice: 'Cruza los autores', ok: false },
    una: { t: 'Hay que prohibir los autos en el centro los domingos.', marcas: { a2: 'i', s1: 'h' }, dice: 'Solo resume A: borra a B', ok: false },
  };
  // Qué hace cada síntesis con cada frase de A y de B: así se rastrea cada parte hasta su fuente.
  const RASTRO = {
    fiel: { a1: ['La recoge: problema común', 'i'], b1: ['La recoge: problema común', 'i'], a2: ['La recoge: solución de A', 'i'], b2: ['La recoge: solución de B', 'i'] },
    acuerdo: { a1: ['La recoge', 'i'], b1: ['La recoge', 'i'], a2: ['La recoge', 'i'], b2: ['La contradice: B no prohíbe', 'h'] },
    cruzada: { a1: ['La omite', 'h'], b1: ['La omite', 'h'], a2: ['Se la atribuye a B', 'h'], b2: ['Se la atribuye a A', 'h'] },
    una: { a1: ['La omite', 'h'], b1: ['La omite', 'h'], a2: ['La recoge', 'i'], b2: ['La borra', 'h'] },
  };
  const IDS_AB = ['a1', 'a2', 'b1', 'b2'];
  const sintesis = {
    id: 'sintesis',
    titulo: 'Sintetizar sin borrar diferencias',
    temas: ['Síntesis'],
    pieza: 'rv-texto',
    juega: {
      consigna: 'Dos textos opinan sobre el tráfico. Prueba cuatro síntesis y mira cuál conserva lo que comparten, en qué difieren y quién dice qué.',
      voz: 'Sintetizar no es poner de acuerdo a los autores.',
      controles: [
        { id: 'k', etiqueta: 'Síntesis', opciones: [{ valor: 'fiel', texto: 'A' }, { valor: 'acuerdo', texto: 'B' }, { valor: 'cruzada', texto: 'C' }, { valor: 'una', texto: 'D' }] },
        { id: 'f', etiqueta: 'Frase', opciones: [{ valor: 'a1', texto: 'A1' }, { valor: 'a2', texto: 'A2' }, { valor: 'b1', texto: 'B1' }, { valor: 'b2', texto: 'B2' }], inicio: 'b2' },
      ],
      dibujo: val => ({ datos: figSin(SIN[val.k].t), estado: { marcas: { s1: SIN[val.k].ok ? 'o' : 'h', [val.f]: RASTRO[val.k][val.f][1] }, sellos: { v: SIN[val.k].ok ? { t: 'Fiel', c: 'i' } : { t: 'No es fiel', c: 'h' } } } }),
      lectura: val => lee(RASTRO[val.k][val.f]),
      minimo: 3,
      // Pasa el marcador por A y B: qué hizo la síntesis con cada frase de cada fuente.
      arrastres: [marcador(val => figSin(SIN[val.k].t), IDS_AB, 'f', 'frase de las fuentes')],
    },
    predice: {
      pregunta: '¿Qué síntesis de los textos A y B sobre el huerto escolar es fiel?',
      opciones: opciones('El huerto escolar tiene un beneficio para A y un costo para B', [
        ['A y B apoyan el huerto escolar', 'RVR1', 'A lo apoya; B señala un costo. Juntarlos así borra el desacuerdo.'],
        ['B dice que el huerto enseña ciencias', 'RV59', 'Eso lo dice A; B habla de horas de matemática.'],
        ['El huerto enseña ciencias', 'RV3', 'Es verdad según A, pero deja fuera lo que dice B.'],
      ]),
      dibujo: { datos: { secciones: [{ id: 'A', titulo: 'Texto A', modo: 'tarjeta', fragmentos: [{ id: 'a1', t: 'El huerto escolar enseña ciencias.' }] }, { id: 'B', titulo: 'Texto B', modo: 'tarjeta', fragmentos: [{ id: 'b1', t: 'El huerto quita horas de matemática.' }] }] }, estado: {} },
      revelar: { datos: { secciones: [{ id: 'A', titulo: 'Texto A', modo: 'tarjeta', fragmentos: [{ id: 'a1', t: 'El huerto escolar enseña ciencias.' }] }, { id: 'B', titulo: 'Texto B', modo: 'tarjeta', fragmentos: [{ id: 'b1', t: 'El huerto quita horas de matemática.' }] }] }, estado: { marcas: { a1: 'i', b1: 'd' }, sellos: { B: { t: 'A: beneficio · B: costo', c: 'd' } } } },
      coincide: 'Coincide: la síntesis junta las dos miradas sin cambiar quién dice qué.',
    },
    mira: {
      datos: figSin(SIN.fiel.t),
      pasos: [
        { estado: { marcas: { a1: 'i', b1: 'i' }, tapar: ['s1'] }, texto: 'A y B coinciden en el diagnóstico: hay mucho tráfico.', ecuacion: [dice('acuerdo'), ': tráfico'] },
        { estado: { marcas: { a1: 'i', b1: 'i', a2: 'd', b2: 'd' }, tapar: ['s1'], nuevo: ['a2', 'b2'] }, texto: 'Difieren en la solución: prohibir autos o mejorar buses.', ecuacion: [rel('A: prohibir'), ' ≠ ', rel('B: buses')] },
        { estado: { marcas: SIN.fiel.marcas, sellos: { v: { t: 'Fiel', c: 'i' } }, nuevo: ['s1'] }, texto: 'La síntesis conserva las dos cosas, y quién dice cada una.', ecuacion: [dice('acuerdo'), ' + ', rel('diferencia')] },
      ],
    },
    regla: {
      texto: 'Una síntesis reúne varias fuentes en una sola idea: conserva lo que comparten, en qué difieren y quién dice qué. No inventa un acuerdo que no existe.',
      ecuacion: [{ llave: [dice('acuerdo')], nota: 'lo común', color: 'c-i' }, ' + ', { llave: [rel('diferencia')], nota: 'quién dice qué', color: 'c-d' }],
      condicion: 'cada afirmación de la síntesis se puede rastrear hasta la fuente que la dice.',
    },
    ahoraTu: {
      generar(s) {
        const B = [
          { a: 'Leer en papel ayuda a recordar.', b: 'Leer en pantalla permite buscar rápido.', ok: 'Cada formato tiene una ventaja distinta: A destaca el papel y B, la pantalla', m: [['A y B prefieren leer en papel', 'RVR1', 'B destaca la pantalla: no hay ese acuerdo.'], ['A dice que en pantalla se busca rápido', 'RV59', 'Eso lo dice B.'], ['Leer en papel ayuda a recordar', 'RV3', 'Deja fuera a B.']] },
          { a: 'Las tareas ayudan a practicar.', b: 'Muchas tareas quitan tiempo de descanso.', ok: 'Las tareas sirven para practicar, pero en exceso quitan descanso', m: [['A y B piden eliminar las tareas', 'RVR1', 'A las defiende; ninguno pide eliminarlas.'], ['A dice que quitan descanso', 'RV59', 'Eso lo dice B.'], ['Las tareas ayudan a practicar', 'RV3', 'Deja fuera a B.']] },
          { a: 'El turismo da trabajo en Cusco.', b: 'El turismo encarece las viviendas en Cusco.', ok: 'Para A el turismo da empleo; para B, encarece la vivienda', m: [['A y B celebran el turismo', 'RVR1', 'B señala un problema: no lo celebra.'], ['B dice que el turismo da trabajo', 'RV59', 'Eso lo dice A.'], ['El turismo encarece las viviendas', 'RV3', 'Deja fuera a A.']] },
          { a: 'Los uniformes evitan diferencias entre alumnos.', b: 'Los uniformes son caros para algunas familias.', ok: 'A ve en el uniforme igualdad; B, un gasto para algunas familias', m: [['A y B rechazan los uniformes', 'RVR1', 'A los defiende.'], ['A dice que son caros', 'RV59', 'Eso lo dice B.'], ['Los uniformes evitan diferencias', 'RV3', 'Deja fuera a B.']] },
          { a: 'La minería trae inversión a la región.', b: 'La minería puede contaminar los ríos.', ok: 'A destaca la inversión minera y B, el riesgo de contaminar ríos', m: [['A y B se oponen a la minería', 'RVR1', 'A destaca un beneficio.'], ['A dice que contamina los ríos', 'RV59', 'Eso lo dice B.'], ['La minería trae inversión', 'RV3', 'Deja fuera a B.']] },
        ];
        const b = B[s % B.length];
        return {
          pregunta: '¿Qué síntesis de los textos A y B es fiel?',
          dibujo: { datos: { secciones: [{ id: 'A', titulo: 'Texto A', modo: 'tarjeta', fragmentos: [{ id: 'a1', t: b.a }] }, { id: 'B', titulo: 'Texto B', modo: 'tarjeta', fragmentos: [{ id: 'b1', t: b.b }] }] }, estado: {} },
          opciones: opciones(b.ok, voltear(b.m, s)),
          solucion: { texto: 'Junta las dos miradas y conserva quién dice qué.', ecuacion: [rel('A'), ' + ', rel('B'), ' → ', version('síntesis')] },
        };
      },
    },
  };

  // ---------- Laboratorio: arma tu resumen ----------
  // Más rica que la idea 1: el alumno arma el resumen con dos piezas (cuántos mejoraron y qué relación pone) y recorre
  // el original con el marcador. Qué pasa con cada frase y cuántas quedan fieles lo calcula el código con estas reglas:
  // «algunos» conserva el alcance y otro cuantificador lo cambia; la relación se conserva, se pierde o se invierte;
  // «todos» contradice la última frase.
  const CUANT = { algunos: { t: 'Algunos', b: ['Conserva: «algunos»', 'i'] }, muchos: { t: 'Muchos', b: ['Lo cambia: «muchos»', 'h'] }, todos: { t: 'Todos los', b: ['Lo cambia: «todos»', 'h'] } };
  const RELA = {
    relacion: { t: 'avanzaron más los que leían a diario.', d: ['Conserva: la relación', 'i'] },
    nada: { t: '', d: ['Lo pierde: la relación', 'h'] },
    causa: { t: 'el taller los hizo leer a diario.', d: ['Lo invierte: es causa', 'h'] },
  };
  const tratoLab = (q, r) => ({ a: ['Conserva: el taller', 'i'], b: CUANT[q].b, c: ['Conserva: mejoraron', 'i'], d: RELA[r].d, e: q === 'todos' ? ['Lo contradice', 'h'] : ['Lo omite: se entiende', 'd'] });
  const figArma = (q, r) => figura(TALLER, [['r1', `${CUANT[q].t} alumnos del taller mejoraron su comprensión${RELA[r].t ? ';' : '.'}`]].concat(RELA[r].t ? [['r2', RELA[r].t]] : []), 'Tu resumen');
  const mesaArma = {
    id: 'arma-resumen', titulo: 'Arma tu resumen', pieza: 'rv-texto',
    consigna: 'Arma el resumen con sus dos piezas y pasa el marcador por el original: mira qué conserva y qué cambia.',
    voz: 'Una palabra de cantidad cambia todo el resumen.',
    controles: [
      { id: 'q', etiqueta: 'Cuántos', opciones: Object.entries(CUANT).map(([valor, x]) => ({ valor, texto: x.t.toLowerCase() })) },
      { id: 'r', etiqueta: 'Relación', opciones: [{ valor: 'relacion', texto: 'la del texto' }, { valor: 'nada', texto: 'ninguna' }, { valor: 'causa', texto: 'otra causa' }] },
      { id: 'f', etiqueta: 'Frase', opciones: IDS_T.map((id, k) => ({ valor: id, texto: `${k + 1}` })), inicio: 'b' },
    ],
    dibujo: val => {
      const T = tratoLab(val.q, val.r), fieles = IDS_T.filter(id => T[id][1] !== 'h').length;
      const marcas = { r1: val.q === 'algunos' ? 'o' : 'h', r2: val.r === 'relacion' ? 'o' : 'h', [val.f]: T[val.f][1] };
      return { datos: figArma(val.q, val.r), estado: { marcas, sellos: { v: fieles === IDS_T.length ? { t: 'Fiel', c: 'i' } : { t: `Cambia ${IDS_T.length - fieles} de ${IDS_T.length}`, c: 'h' } } } };
    },
    lectura: val => {
      const T = tratoLab(val.q, val.r), fieles = IDS_T.filter(id => T[id][1] !== 'h').length;
      return lee(T[val.f]).concat([` · fiel en ${fieles} de ${IDS_T.length}`]);
    },
    arrastres: [marcador(val => figArma(val.q, val.r), IDS_T, 'f', 'frase del original')],
  };

  return {
    unidad: 'razonamiento-verbal.resumen-y-sintesis',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rv-texto.js'],
    historia: {
      texto: 'En 1977, van Dijk propuso las macrorreglas para explicar cómo se pasa de las oraciones de un texto a su idea global: suprimir, seleccionar, generalizar y construir. No buscaba acortar a ciegas, sino conservar lo pertinente. No hay un único resumen correcto, pero sí resúmenes que traicionan el texto.',
      pregunta: '¿Qué no se puede quitar al resumir?',
      fuente: { titulo: 'Matriz de teoría de razonamiento verbal (macrorreglas)', url: 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/diccio_ele/diccionario/macrorreglastextuales.htm' },
    },
    laboratorio: [
      mesaArma,
      Object.assign({ id: 'parafrasis', titulo: 'Paráfrasis o inferencia', pieza: 'rv-texto' }, parafrasis.juega),
      Object.assign({ id: 'sintesis', titulo: 'Síntesis de dos fuentes', pieza: 'rv-texto' }, sintesis.juega),
    ],
    ideas: [alcance, parafrasis, sintesis],
  };
});
