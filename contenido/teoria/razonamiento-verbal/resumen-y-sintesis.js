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
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    return r;
  }
  // «Así se resuelve» (docs/teoria.md, 4e): cada banco RES_* trae ítems propios con la misma forma que el de «Ahora tú»
  // (la correcta y tres distractores con su error y por qué; el primero es el más tentador). Las opciones van en la
  // figura, numeradas, en un orden que da la semilla; el paso «aplica» marca la elegida (o) y tacha las demás, y el
  // paso «sentido» marca en rojo la más tentadora (h).
  // El ítem sale del segundo número de azar(s + 900) (el primero gira las opciones): así salen los cuatro en 12 semillas.
  const elegir = (B, s) => { const r = azar(s + 900); r(); return B[Math.floor(r() * B.length)]; };
  const resolver = (b, s, fuentes) => {
    const r = azar(s + 900), giro = r.ent(0, 3);
    const ops = [['ok', b.ok], ...b.m.map(([t], k) => [`m${k}`, t])];
    const orden = ops.slice(giro).concat(ops.slice(0, giro));
    const fig = { secciones: fuentes.concat([{ id: 'ops', titulo: 'Opciones', modo: 'lista', fragmentos: orden.map(([id, t]) => ({ id, t })) }]) };
    const otras = ops.map(([id]) => id).filter(id => id !== 'ok');
    const ver = estado => ({ datos: fig, estado });
    const deFuente = Object.fromEntries(fuentes.flatMap(x => x.fragmentos.map(fr => [fr.id, 'i'])));
    return {
      dibujo: ver({}),
      datos: ver({ marcas: deFuente }),
      eligo: ver({ marcas: Object.assign({}, deFuente, { ok: 'o' }), tachar: otras, sellos: { ops: { t: 'Fiel', c: 'i' } }, nuevo: ['ok'] }),
      tienta: ver({ marcas: Object.assign({}, deFuente, { ok: 'o', m0: 'h' }), tachar: otras.filter(id => id !== 'm0'), nuevo: ['m0'] }),
      sentido: `Tienta «${b.m[0][0]}», pero no sirve: ${b.m[0][2]}`,
    };
  };
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
  // Banco propio de «Así se resuelve» (misma forma que el de «Ahora tú», casos nuevos). m[0] es el distractor que más tienta.
  const RES_ALCANCE = [
    { tema: 'el lago Titicaca', t: 'En los años secos, el nivel del lago Titicaca baja varios centímetros. En los años de lluvias abundantes, se recupera en parte.',
      ok: 'El Titicaca baja en años secos y se recupera en parte con lluvias',
      m: [['El Titicaca se está secando sin remedio', 'RV11', 'exagera, porque el texto dice que se recupera en parte.'], ['Lago, nivel, lluvias, años secos', 'RV43', 'Es una lista de palabras: no dice qué las une.'], ['El lago baja porque la gente saca mucha agua', 'RV44', 'Inventa una causa: el texto habla de años secos.']],
      datos: 'El texto une dos hechos: el lago baja en años secos y se recupera «en parte» con las lluvias. «En parte» marca el alcance.',
      aplica: 'Busco la opción que guarda los dos hechos y el «en parte», sin causas nuevas. Solo una lo hace.' },
    { tema: 'el comedor popular', t: 'La mayoría de las socias del comedor popular cocina dos veces por semana. Unas pocas, que no trabajan fuera, ayudan casi todos los días.',
      ok: 'La mayoría cocina dos veces por semana; unas pocas ayudan casi a diario',
      m: [['Todas las socias cocinan todos los días', 'RV11', 'cambia el alcance, porque solo unas pocas ayudan casi a diario.'], ['Socias, comedor, cocina, semana', 'RV43', 'Es una lista sin relaciones.'], ['Unas pocas ayudan a diario porque las demás no quieren', 'RV44', 'Inventa una causa: el texto dice que esas pocas no trabajan fuera.']],
      datos: 'Hay dos grupos, cada uno con su cantidad: «la mayoría» cocina dos veces por semana y «unas pocas» ayudan casi a diario.',
      aplica: 'La opción fiel conserva «la mayoría» y «unas pocas», con lo que hace cada grupo. Las otras cambian cuántas, hacen una lista o inventan.' },
    { tema: 'los simulacros', t: 'Muchos postulantes que practicaron con simulacros mejoraron su puntaje. Algunos que no practicaron también mejoraron, aunque menos.',
      ok: 'Muchos que practicaron con simulacros mejoraron; algunos sin práctica, menos',
      m: [['Solo mejoraron los que practicaron con simulacros', 'RV11', '«solo» borra a los que mejoraron sin practicar.'], ['Postulantes, simulacros, puntaje, práctica', 'RV43', 'Es una lista sin relaciones.'], ['Los que no practicaron mejoraron porque estudiaron más horas', 'RV44', 'Inventa una causa que el texto no da.']],
      datos: 'El texto compara dos grupos: «muchos» que practicaron mejoraron, y «algunos» que no practicaron mejoraron «menos».',
      aplica: 'Comparo cada opción con los dos grupos. La fiel guarda «muchos», «algunos» y «menos»; ninguna otra conserva a los dos grupos.' },
    { tema: 'las crías de alpaca', t: 'En las heladas fuertes, varias crías de alpaca enferman. Los criadores que usan cobertizos pierden menos crías.',
      ok: 'En heladas fuertes, varias crías enferman; con cobertizos se pierden menos',
      m: [['En las heladas mueren todas las crías de alpaca', 'RV11', 'exagera, porque el texto dice «varias» y que con cobertizos se pierden menos.'], ['Heladas, alpacas, crías, cobertizos', 'RV43', 'Es una lista sin relaciones.'], ['Los criadores usan cobertizos porque se los regalan', 'RV44', 'Inventa un hecho y una causa que el texto no menciona.']],
      datos: 'El texto dice «varias crías», no todas, y une los cobertizos con perder menos crías.',
      aplica: 'Busco la opción que conserve «varias» y la relación con los cobertizos. Solo una lo hace sin exagerar ni inventar.' },
  ];
  const alcance = {
    id: 'alcance',
    titulo: 'Resumir sin cambiar el alcance',
    temas: ['Resumen literal', 'Resumen interpretativo'],
    pieza: 'rv-texto',
    // Lee (fase 2): para qué sirve un resumen y sus dos nombres, sin decir cuál de los resúmenes de la helada es fiel.
    lee: {
      tarjetas: [
        { titulo: 'Contarlo en corto', texto: 'Cuando tu prima te pregunta qué pasó en la reunión de la comunidad, no le repites todo. Le cuentas lo importante en pocas frases. Eso es un resumen: el texto en corto, con lo que no se puede quitar.' },
        { titulo: 'Dos maneras', texto: 'Un resumen literal junta frases del propio texto. Un resumen interpretativo lo cuenta con tus palabras. El examen de admisión pide los dos, y en los dos se puede fallar.' },
        { titulo: 'Qué mirar al jugar', texto: 'Verás el texto de un taller de lectura y cuatro resúmenes. Arrastra el círculo por cada frase del original y lee qué hizo el resumen con ella: la conserva, la omite o la cambia.' },
      ],
    },
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
      texto: 'Resumir es quitar detalles y conservar lo esencial con sus relaciones y su alcance. El resumen literal usa frases del texto; el interpretativo, palabras propias, sin agregar hechos ni exagerar.',
      ecuacion: [{ llave: [rel('relaciones')], nota: 'qué une', color: 'c-d' }, ' + ', { llave: [dice('alcance')], nota: 'cuántos', color: 'c-i' }],
      condicion: 'se mantienen cuantificadores (algunos, todos), negaciones y causas tal como el texto los dice.',
    },
    // Así se resuelve (fase 2): el mismo tipo de «Ahora tú», con un banco propio y el orden de opciones de azar(s + 900).
    resuelve: {
      pieza: 'rv-texto',
      generar(s) {
        const b = elegir(RES_ALCANCE, s);
        const F = resolver(b, s, [{ id: 'o', titulo: 'Original', modo: 'tarjeta', fragmentos: [{ id: 'a', t: b.t }] }]);
        return {
          enunciado: `Lee el texto sobre ${b.tema}. ¿Qué resumen conserva lo que dice, con su alcance?`,
          dibujo: F.dibujo,
          pasos: [
            { tipo: 'pide', texto: `Piden el resumen del texto sobre ${b.tema} que no cambie su alcance: cuántos, cuánto y qué relación.` },
            { tipo: 'datos', texto: b.datos, dibujo: F.datos },
            { tipo: 'regla', texto: 'Resumir es acortar sin traicionar: dejo lo esencial y no toco palabras como «algunos», «muchos» o «en parte», ni la relación entre los hechos.' },
            { tipo: 'aplica', texto: b.aplica, ecuacion: [version('resumen'), ' = ', dice('lo esencial'), ' + ', dice('alcance')], dibujo: F.eligo },
            { tipo: 'sentido', texto: F.sentido, dibujo: F.tienta },
          ],
          respuesta: b.ok,
        };
      },
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
  // Banco propio de «Así se resuelve»: oraciones nuevas, misma forma que «Ahora tú». m[0] es el distractor que más tienta.
  const RES_PARAF = [
    { o: 'El tren a Cusco sale de Juliaca los lunes y los jueves.', ok: 'Los lunes y jueves hay salida del tren de Juliaca a Cusco',
      m: [['El tren va lleno porque sale solo dos días', 'RV58', 'agrega una consecuencia que el original no dice.'], ['El tren a Cusco sale todos los días', 'RV11', 'Cambia el alcance: solo sale dos días.'], ['Hay un tren a Cusco', 'RV3', 'Pierde los días y desde dónde sale: dice menos.']],
      datos: 'El original dice tres cosas: qué (el tren a Cusco), desde dónde (Juliaca) y cuándo (los lunes y los jueves).',
      aplica: 'La versión fiel repite el qué, el desde dónde y el cuándo con otras palabras. Las demás agregan, cambian los días o quitan datos.' },
    { o: 'La mayoría de vecinos no asistió a la asamblea del sábado.', ok: 'Más de la mitad de los vecinos faltó a la asamblea del sábado',
      m: [['La asamblea se suspendió por falta de vecinos', 'RV58', 'agrega un hecho, porque el original no dice que se suspendiera.'], ['Ningún vecino fue a la asamblea', 'RV10', '«La mayoría» no es «ninguno».'], ['Hubo una asamblea el sábado', 'RV3', 'Pierde cuántos faltaron: dice menos.']],
      datos: 'El original dice quiénes faltaron («la mayoría de vecinos»), a qué (la asamblea) y cuándo (el sábado).',
      aplica: '«Más de la mitad» es otra forma de decir «la mayoría», y «faltó» equivale a «no asistió». Esa versión no suma ni quita nada.' },
    { o: 'Si el puente se termina en mayo, las combis cambiarán de ruta.', ok: 'Con el puente listo en mayo, las combis cambiarán de ruta',
      m: [['Los pasajeros llegarán más rápido a su destino', 'RV58', 'agrega una consecuencia que el original no menciona.'], ['El puente se terminará en mayo', 'RV55', 'Cambia una condición por un hecho seguro.'], ['Las combis cambiarán de ruta', 'RV3', 'Pierde la condición: dice menos.']],
      datos: 'El original es una condición: el cambio de ruta depende de que el puente se termine en mayo. No asegura que se termine.',
      aplica: '«Con el puente listo en mayo» conserva la condición con otras palabras. Las otras versiones agregan un efecto, la vuelven un hecho o la borran.' },
    { o: 'Desde enero, la biblioteca municipal presta libros por quince días.', ok: 'Desde enero, los préstamos de la biblioteca municipal duran quince días',
      m: [['Ahora la gente lee más que antes', 'RV58', 'agrega un efecto que el original no menciona.'], ['La biblioteca presta libros por un mes', 'RV11', 'Cambia cuánto: son quince días.'], ['La biblioteca presta libros', 'RV3', 'Pierde desde cuándo y por cuánto: dice menos.']],
      datos: 'El original dice quién presta (la biblioteca municipal), desde cuándo (enero) y por cuánto tiempo (quince días).',
      aplica: 'La versión fiel cambia «presta por quince días» por «los préstamos duran quince días» y conserva enero. Nada se agrega ni se pierde.' },
  ];
  const parafrasis = {
    id: 'parafrasis',
    titulo: 'Parafrasear no es inferir',
    temas: ['Paráfrasis'],
    pieza: 'rv-texto',
    // Lee (fase 2): qué es parafrasear y dónde se pide, sin hablar de lo que convierte una versión en otra cosa.
    lee: {
      tarjetas: [
        { titulo: 'Con otras palabras', texto: 'Cuando le explicas a tu abuela lo que dijo el profesor, cambias las palabras para que se entienda mejor. Eso es parafrasear: el mensaje es el mismo, las palabras son otras.' },
        { titulo: 'Por qué la piden', texto: 'En el examen, muchas preguntas piden la opción que «dice lo mismo» que una oración. Las opciones se parecen mucho entre sí, y la diferencia suele estar en una sola parte.' },
        { titulo: 'Qué mirar al jugar', texto: 'Verás la oración de Rosa y cuatro versiones. Arrastra el círculo por cada parte de la versión y lee qué hace con el original. Fíjate en quién, qué y por qué.' },
      ],
    },
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
    // Así se resuelve (fase 2): el mismo tipo de «Ahora tú», con un banco propio y el orden de opciones de azar(s + 900).
    resuelve: {
      pieza: 'rv-texto',
      generar(s) {
        const b = elegir(RES_PARAF, s);
        const F = resolver(b, s, [{ id: 'o', titulo: 'Original', modo: 'tarjeta', fragmentos: [{ id: 'a', t: b.o }] }]);
        return {
          enunciado: `Original: «${b.o}» ¿Qué versión es una paráfrasis fiel?`,
          dibujo: F.dibujo,
          pasos: [
            { tipo: 'pide', texto: 'Piden la versión que diga lo mismo que el original con otras palabras: ni más, ni menos, ni otra cosa.' },
            { tipo: 'datos', texto: b.datos, dibujo: F.datos },
            { tipo: 'regla', texto: 'Comparo parte por parte. Una paráfrasis cambia las palabras, pero deja intacta la información. Si a una versión le sobra o le falta algo, la descarto.' },
            { tipo: 'aplica', texto: b.aplica, ecuacion: [version('paráfrasis'), ' = ', dice('original')], dibujo: F.eligo },
            { tipo: 'sentido', texto: F.sentido, dibujo: F.tienta },
          ],
          respuesta: b.ok,
        };
      },
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
  // Banco propio de «Así se resuelve»: pares A/B nuevos, misma forma que «Ahora tú». m[0] es el distractor que más tienta.
  const RES_SIN = [
    { tema: 'el celular en clase', a: 'El celular en clase ayuda a buscar información.', b: 'El celular en clase distrae a los alumnos.',
      ok: 'Para A el celular ayuda a buscar información; para B, distrae',
      m: [['A y B quieren prohibir el celular en clase', 'RVR1', 'A le ve una ventaja y nadie pide prohibirlo.'], ['A dice que el celular distrae', 'RV59', 'Eso lo dice B.'], ['El celular ayuda a buscar información', 'RV3', 'Deja fuera a B.']] },
    { tema: 'la carretera nueva', a: 'La carretera nueva acorta el viaje a Puno.', b: 'La carretera nueva pasa por terrenos de cultivo.',
      ok: 'A destaca que la carretera acorta el viaje; B, que pasa por cultivos',
      m: [['A y B celebran la carretera nueva', 'RVR1', 'B señala un costo, así que no la celebra.'], ['B dice que acorta el viaje a Puno', 'RV59', 'Eso lo dice A.'], ['La carretera pasa por terrenos de cultivo', 'RV3', 'Deja fuera a A.']] },
    { tema: 'las clases virtuales', a: 'Las clases virtuales ahorran el pasaje.', b: 'Sin buena señal, las clases virtuales se cortan.',
      ok: 'A ve un ahorro en las clases virtuales; B, cortes sin buena señal',
      m: [['A y B rechazan las clases virtuales', 'RVR1', 'A les ve un ahorro.'], ['A dice que se cortan sin señal', 'RV59', 'Eso lo dice B.'], ['Las clases virtuales ahorran el pasaje', 'RV3', 'Deja fuera a B.']] },
    { tema: 'la fiesta de la Candelaria', a: 'La Candelaria atrae a miles de turistas a Puno.', b: 'En la Candelaria se junta mucha basura en las calles.',
      ok: 'Para A la Candelaria atrae turistas; para B, deja mucha basura',
      m: [['A y B se quejan de la Candelaria', 'RVR1', 'A destaca algo bueno, los turistas.'], ['B dice que atrae turistas', 'RV59', 'Eso lo dice A.'], ['La Candelaria deja basura en las calles', 'RV3', 'Deja fuera a A.']] },
  ];
  const malasSin = k => IDS_AB.filter(id => RASTRO[k][id][1] === 'h').length;
  const sintesis = {
    id: 'sintesis',
    titulo: 'Sintetizar sin borrar diferencias',
    temas: ['Síntesis'],
    pieza: 'rv-texto',
    // Lee (fase 2): qué es sintetizar y qué es una fuente, sin decir qué síntesis del huerto es la fiel.
    lee: {
      tarjetas: [
        { titulo: 'Varias voces', texto: 'En la asamblea del barrio hablaron cinco vecinos. Al día siguiente, alguien te pregunta qué se dijo. Juntar en pocas palabras lo que dijeron varias personas es sintetizar.' },
        { titulo: 'Las fuentes', texto: 'Cada texto o autor del que sale una idea es una fuente. En el examen suelen venir dos textos, A y B, sobre el mismo tema, y una pregunta pide la síntesis de ambos.' },
        { titulo: 'Qué mirar al jugar', texto: 'Verás dos textos sobre el tráfico del centro y cuatro síntesis. Arrastra el círculo por cada frase de A y de B, y lee qué hizo la síntesis con ella.' },
      ],
    },
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
    // Así se resuelve (fase 2): el mismo tipo de «Ahora tú», con un banco propio y el orden de opciones de azar(s + 900).
    resuelve: {
      pieza: 'rv-texto',
      generar(s) {
        const b = elegir(RES_SIN, s);
        const F = resolver(b, s, [{ id: 'A', titulo: 'Texto A', modo: 'tarjeta', fragmentos: [{ id: 'a1', t: b.a }] }, { id: 'B', titulo: 'Texto B', modo: 'tarjeta', fragmentos: [{ id: 'b1', t: b.b }] }]);
        return {
          enunciado: `Los textos A y B hablan sobre ${b.tema}. ¿Qué síntesis de los dos es fiel?`,
          dibujo: F.dibujo,
          pasos: [
            { tipo: 'pide', texto: `Piden una síntesis fiel: una sola idea que junte lo que dicen A y B sobre ${b.tema}.` },
            { tipo: 'datos', texto: `A dice: «${b.a}» B dice: «${b.b}»`, dibujo: F.datos },
            { tipo: 'regla', texto: 'Una síntesis junta las dos fuentes en una idea. Deja lo que dice cada una, con su autor, y no las pone de acuerdo si no lo están.' },
            { tipo: 'aplica', texto: `Rastreo cada parte hasta su fuente. Solo «${b.ok}» guarda a A y a B con lo suyo.`, ecuacion: [rel('A'), ' + ', rel('B'), ' → ', version('síntesis')], dibujo: F.eligo },
            { tipo: 'sentido', texto: F.sentido, dibujo: F.tienta },
          ],
          respuesta: b.ok,
        };
      },
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
  const fielesLab = val => { const T = tratoLab(val.q, val.r); return IDS_T.filter(id => T[id][1] !== 'h').length; };
  const figArma = (q, r) => figura(TALLER, [['r1', `${CUANT[q].t} alumnos del taller mejoraron su comprensión${RELA[r].t ? ';' : '.'}`]].concat(RELA[r].t ? [['r2', RELA[r].t]] : []), 'Tu resumen');
  const mesaArma = {
    id: 'arma-resumen', titulo: 'Arma tu resumen', pieza: 'rv-texto',
    consigna: 'Arma el resumen con sus dos piezas y arrastra el círculo por el original: mira qué conserva y qué cambia.',
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
    // Retos: cada logrado cuenta con tratoLab, la misma regla que pinta las frases y el sello.
    invitaciones: [
      { texto: 'Arma un resumen que contradiga la última frase del original.',
        logrado: val => tratoLab(val.q, val.r).e[0] === 'Lo contradice',
        bien: '«Todos» choca con «los demás no cambiaron». Una palabra bastó para contradecir.' },
      { texto: 'Busca el resumen que cambia más frases del original.',
        logrado: val => fielesLab(val) === Math.min(...Object.keys(CUANT).flatMap(q => Object.keys(RELA).map(r => fielesLab({ q, r })))),
        bien: 'Cantidad y relación cambiadas a la vez: casi nada del original queda en pie.' },
      { texto: 'Deja fiel todo salvo una frase y pon el círculo sobre ella.',
        logrado: val => fielesLab(val) === IDS_T.length - 1 && tratoLab(val.q, val.r)[val.f][1] === 'h',
        bien: 'Una sola pieza basta para que el resumen ya no sea fiel.' },
      { texto: 'Guarda dos resúmenes igual de fieles, pero con distinta relación.',
        logrado: (val, guardados) => guardados.some(g => g.r !== val.r && fielesLab(g) === fielesLab(val)),
        bien: 'Fallan en lo mismo por caminos distintos. ¿Qué frase pierde cada uno?' },
    ],
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
    glosario: [
      { termino: 'resumen', def: 'Versión más corta de un texto que conserva sus ideas esenciales y cómo se relacionan.',
        ejemplo: '«Algunos alumnos mejoraron leyendo a diario» resume las cinco frases del taller.', formas: ['resumen', 'resúmenes'], ver: ['paráfrasis', 'síntesis'] },
      { termino: 'resumen literal', def: 'Resumen armado con frases del propio texto, sin cambiar lo que dicen.',
        formas: ['resumen literal'], ver: ['resumen interpretativo'] },
      { termino: 'resumen interpretativo', def: 'Resumen con palabras propias que generaliza lo dicho, sin agregar hechos ni exagerar.',
        ejemplo: '«Avisar a tiempo protegió la cosecha» resume tres hechos de la helada.', formas: ['resumen interpretativo'], ver: ['resumen literal', 'generalizar'] },
      { termino: 'paráfrasis', def: 'Decir lo mismo que un texto con otras palabras, sin agregar, quitar ni cambiar información.',
        ejemplo: '«Como tenía fiebre, Rosa faltó» dice lo mismo que «Rosa no fue porque tenía fiebre».', formas: ['paráfrasis', 'parafrasear'], ver: ['resumen'] },
      { termino: 'síntesis', def: 'Idea nueva que reúne varias fuentes o posturas, conservando lo que comparten y en qué difieren.',
        ejemplo: 'A y B ven un problema de tráfico, pero proponen soluciones distintas.', ver: ['fuente', 'resumen'] },
      { termino: 'alcance', def: 'Hasta dónde llega lo que se afirma: a cuántos casos, personas, lugares o tiempos se refiere.',
        ejemplo: '«Algunos mejoraron» tiene menos alcance que «todos mejoraron».' },
      { termino: 'fuente', def: 'Texto o autor del que sale una información o una opinión.',
        ejemplo: 'En la síntesis del tráfico hay dos: el texto A y el texto B.', ver: ['síntesis'] },
      { termino: 'macrorregla', def: 'Operación para pasar de las oraciones a la idea global: suprimir, seleccionar, generalizar o construir.',
        formas: ['macrorreglas', 'macrorregla'], ver: ['generalizar'] },
      { termino: 'generalizar', def: 'Reemplazar varios casos concretos por una idea que los abarca a todos.',
        ejemplo: '«Radio, plástico y papas cubiertas» se generaliza como «avisar y proteger la cosecha».', formas: ['generalizar', 'generaliza', 'generalizan'], ver: ['macrorregla'] },
      { termino: 'accesorio', def: 'Lo que se puede quitar sin cambiar el sentido: detalles, repeticiones o datos menores.',
        formas: ['accesorio', 'accesorios'], ver: ['resumen'] },
    ],
    laboratorio: [
      mesaArma,
      Object.assign({ id: 'parafrasis', titulo: 'Paráfrasis o inferencia', pieza: 'rv-texto',
        // Retos: se comprueban con PARTES y PAR, las mismas tablas que marcan cada parte y ponen el sello.
        invitaciones: [
          { texto: 'Pon el círculo en la parte que agrega algo que el original no dice.',
            logrado: val => PARTES[val.k][val.f][0].startsWith('Agrega'),
            bien: 'Puede ser cierto, pero el original no lo dice: ya es una inferencia.' },
          { texto: 'Busca la versión que dice lo contrario del original.',
            logrado: val => !PAR[val.k].ok && Object.values(PARTES[val.k]).some(p => p[0].startsWith('Lo contrario')),
            bien: '«Fue» en lugar de «no fue». Vuelve a la frase: la negación cambia todo.' },
          { texto: 'Encuentra la versión que dice menos y marca lo que le falta.',
            logrado: val => PARTES[val.k][val.f][0].startsWith('Falta'),
            bien: 'Sin «porque tenía fiebre» se pierde la causa. Dice menos que el original.' },
          { texto: 'Guarda la paráfrasis y otra versión que no lo sea.',
            logrado: (val, guardados) => guardados.some(g => PAR[g.k].ok) && guardados.some(g => !PAR[g.k].ok),
            bien: 'Ponlas lado a lado: ¿qué parte de la segunda ya no está en el original?' },
        ] }, parafrasis.juega),
      Object.assign({ id: 'sintesis', titulo: 'Síntesis de dos fuentes', pieza: 'rv-texto',
        // Retos: se comprueban con RASTRO, la tabla que dice qué hizo cada síntesis con cada frase de A y de B.
        invitaciones: [
          { texto: 'Busca la síntesis que inventa un acuerdo y marca la frase que contradice.',
            logrado: val => RASTRO[val.k][val.f][0].startsWith('La contradice'),
            bien: 'B no pide prohibir autos. Juntarlos así borra su desacuerdo.' },
          { texto: 'Encuentra la síntesis que cruza a los autores y marca una frase cambiada.',
            logrado: val => RASTRO[val.k][val.f][0].startsWith('Se la atribuye'),
            bien: 'Cada propuesta quedó con el autor equivocado. ¿Quién dice qué, en realidad?' },
          { texto: 'Busca la síntesis con más frases mal recogidas.',
            logrado: val => malasSin(val.k) === Math.max(...Object.keys(RASTRO).map(malasSin)),
            bien: 'Las cuatro frases fallan. Rastrear cada parte hasta su fuente lo deja ver.' },
          { texto: 'Guarda la síntesis fiel y otra que falle en una sola frase.',
            logrado: (val, guardados) => guardados.some(g => malasSin(g.k) === 0) && guardados.some(g => malasSin(g.k) === 1),
            bien: 'Un solo descuido basta: la síntesis ya no respeta lo que dice B.' },
        ] }, sintesis.juega),
    ],
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea). Una lista vacía:
    // la mesa no practica ninguna idea de la unidad y va en «Más mesas del tema».
    laboratorioIdeas: {
      'arma-resumen': ['alcance'],
      'parafrasis': ['parafrasis'],
      'sintesis': ['sintesis'],
    },
    ideas: [alcance, parafrasis, sintesis],
  };
});
