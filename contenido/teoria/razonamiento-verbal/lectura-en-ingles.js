/*
 * Teoría de «Lectura en inglés» (razonamiento-verbal.lectura-en-ingles). Molde: docs/teoria.md. Contenido: matriz de
 * verbal (unidad 18), historia (Marco común europeo de referencia, 2001 y 2020) y códigos RV1–RV4, RV10, RV11, RV36,
 * RV43, RV54 y RV55. Textos propios en inglés (regla 5); las preguntas de examen van en inglés, como en el módulo
 * lectura-ingles; consignas, voz y explicaciones, en español.
 * Ruta A · Argumentar: se marca la frase inglesa que sostiene la respuesta.
 *
 * Ficha de tarea:
 *   Promesa: leer un texto breve en inglés sin caer en falsos amigos, cuantificadores ni tiempos mal leídos.
 *   Persona y condiciones: postulante de 3.º a 5.º, nivel básico de inglés, celular, sin audio (UNMSM 2, 16 y 17).
 *   Resultado observable: identifica main idea, dato y referente; justifica con la frase inglesa pertinente.
 *   Orden de atención: 1.º el texto en inglés · 2.º la palabra o frase marcada · 3.º su sentido (lectura).
 *   Estados: palabra que engaña (h) · bien leída (i) · lo que el texto no dice (d).
 *   Duda que resuelve: ¿«actually» es «actualmente»?
 *
 * Colores (regla 4): la frase inglesa que sostiene i (turquesa, continuo), la opción o la palabra que se prueba o
 * (naranja, discontinuo), lo que el texto no dice d (verde, punteado), lo que engaña o contradice h (rojo).
 * Códigos: RV1–RV4, RV10, RV11, RV36, RV43, RV54 (falso amigo), RV55 (tiempo o modo). Sin códigos nuevos.
 */
(function (root, fabrica) {
  const def = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const corto = (fn, t) => {
    if (t.length <= 26) return fn(t);
    const k = [t.indexOf(': '), t.indexOf(', ')].filter(i => i > 0).sort((a, b) => a - b)[0];
    if (k && k <= 24) return [fn(t.slice(0, k)), t.slice(k)];
    const ps = t.split(' '); let n = 1;
    while (n < ps.length && ps.slice(0, n + 1).join(' ').length <= 18) n++;
    return [fn(ps.slice(0, n).join(' ')), ' ' + ps.slice(n).join(' ')];
  };
  const sost = t => ({ v: 'c-i', t }), prueba = t => ({ v: 'c-o', t }), nodice = t => ({ v: 'c-d', t }), engana = t => ({ v: 'c-h', t });
  const opciones = (c, malas) => [{ id: 'c', texto: c, correcta: true }, ...malas.map(([texto, error, siFuera], k) => ({ id: `e${k}`, texto, error, siFuera }))];
  const voltear = (arr, s) => (s % 2 ? arr.slice().reverse() : arr.slice());
  const tarjeta = (titulo, frs) => ({ secciones: [{ id: 'o', titulo, modo: 'tarjeta', fragmentos: frs.map(([id, t]) => ({ id, t })) }] });
  const lista = (titulo, ors) => ({ secciones: [{ id: 'o', titulo, modo: 'lista', fragmentos: ors.map((t, k) => ({ id: `o${k + 1}`, t })) }] });

  // ---------- Idea 1: palabras que engañan ----------
  // Cambia: la palabra que se mira. Permanece: el texto de la biblioteca. Progresa: falso amigo, tiempo y
  // cuantificador. Se reserva: «some» (predicción). Debe verse: la palabra y su sentido real, junto al texto.
  const LIB = [['a', 'Actually,'], ['b', 'the town library'], ['c', 'used to'], ['d', 'open on Sundays.'], ['e', 'Now it is closed, but'], ['f', 'few'], ['g', 'people know it.']];
  const PAL = {
    a: { glosa: '«Actually» = en realidad (no «actualmente»)', trampa: true },
    b: { glosa: '«Library» = biblioteca (no «librería»)', trampa: true },
    c: { glosa: '«Used to» = antes solía: ya no', trampa: true },
    f: { glosa: '«Few» = pocos (no «algunos»)', trampa: true },
  };
  const basico = {
    id: 'palabras-que-enganan',
    titulo: 'Palabras que engañan',
    temas: ['Inglés básico'],
    pieza: 'rv-texto',
    juega: {
      consigna: 'Marca palabras del texto en inglés. Mira cuáles se parecen al español y significan otra cosa, o cambian el tiempo.',
      voz: 'Que se parezca al español no garantiza que signifique lo mismo.',
      controles: [{ id: 'k', etiqueta: 'Palabra', opciones: [{ valor: 'a', texto: 'Actually' }, { valor: 'b', texto: 'library' }, { valor: 'c', texto: 'used to' }, { valor: 'f', texto: 'few' }] }],
      dibujo: val => ({ datos: tarjeta('Text', LIB), estado: { marcas: { [val.k]: 'o' }, sellos: { o: { t: 'Revisa el sentido', c: 'h' } } } }),
      lectura: val => { const [w, sentido] = PAL[val.k].glosa.split(' = '); return [prueba(w), ` = ${sentido}`]; },
      minimo: 3,
    },
    predice: {
      pregunta: '«Some students walk to school.» What does the sentence say?',
      voz: 'Fíjate en la primera palabra.',
      opciones: opciones('Algunos estudiantes caminan al colegio', [
        ['Todos los estudiantes caminan al colegio', 'RV11', '«Some» es «algunos»; «all» sería «todos».'],
        ['Ningún estudiante camina al colegio', 'RV10', 'No hay negación: la oración afirma que algunos sí caminan.'],
        ['Los estudiantes caminaban al colegio', 'RV55', '«Walk» está en presente; el pasado sería «walked».'],
      ]),
      dibujo: { datos: tarjeta('Text', [['s', 'Some'], ['t', 'students'], ['w', 'walk'], ['r', 'to school.']]), estado: { marcas: { s: 'o' } } },
      revelar: { datos: tarjeta('Text', [['s', 'Some'], ['t', 'students'], ['w', 'walk'], ['r', 'to school.']]), estado: { marcas: { s: 'i', w: 'i' }, sellos: { o: { t: 'some = algunos', c: 'i' } } } },
      coincide: 'Coincide: «some» limita a algunos y «walk» está en presente.',
    },
    mira: {
      datos: tarjeta('Text', LIB),
      pasos: [
        { estado: { marcas: { a: 'h', b: 'h' } }, texto: '«Actually» y «library» se parecen al español, pero son falsos amigos.', ecuacion: [engana('actually'), ' = en realidad · ', engana('library'), ' = biblioteca'] },
        { estado: { marcas: { c: 'o', d: 'i', e: 'i' }, nuevo: ['c', 'e'] }, texto: '«Used to open» dice que antes abría; «now it is closed» lo confirma.', ecuacion: [prueba('used to'), ' = antes, ya no'] },
        { estado: { marcas: { f: 'o', g: 'i' }, nuevo: ['f'] }, texto: '«Few people» son pocas personas: casi nadie lo sabe.', ecuacion: [prueba('few'), ' = pocos'] },
      ],
    },
    regla: {
      texto: 'Al leer en inglés, revisa los falsos amigos (actually, library, assist), el tiempo del verbo (used to, will, would) y los cuantificadores y negaciones (some, few, all, no).',
      ecuacion: [engana('falso amigo'), ' · ', prueba('tiempo'), ' · ', prueba('cuantificador')],
      condicion: 'se lee la palabra en su oración; si el sentido del español no encaja con el resto, quizá es un falso amigo.',
    },
    ahoraTu: {
      generar(s) {
        const B = [
          { t: 'My brother assisted the meeting at the school.', w: 'assisted', ok: 'Ayudó en la reunión', m: [['Asistió a la reunión', 'RV54', '«Assist» es ayudar; «asistir» a un lugar es «attend».'], ['Organizará la reunión', 'RV55', '«Assisted» está en pasado.'], ['No fue a la reunión', 'RV10', 'No hay negación.']] },
          { t: 'Few farmers in the valley grow coffee.', w: 'Few', ok: 'Pocos agricultores del valle cultivan café', m: [['Algunos agricultores cultivan café', 'RV11', '«A few» se acerca a «algunos»; «few» solo es «pocos», casi ninguno.'], ['Todos los agricultores cultivan café', 'RV11', 'Nada dice «all».'], ['Los agricultores cultivaban café', 'RV55', '«Grow» está en presente.']] },
          { t: 'We used to live near the lake.', w: 'used to', ok: 'Antes vivíamos cerca del lago', m: [['Vivimos cerca del lago', 'RV55', '«Used to» habla de algo que ya no pasa.'], ['Usamos el lago para vivir', 'RV54', '«Used to» no es «usar»: es una costumbre pasada.'], ['Viviremos cerca del lago', 'RV55', 'No habla del futuro.']] },
          { t: 'Actually, the test is on Monday, not Friday.', w: 'Actually', ok: 'En realidad, el examen es el lunes', m: [['Actualmente, el examen es el viernes', 'RV54', '«Actually» es «en realidad», y el texto dice «not Friday».'], ['El examen fue el lunes', 'RV55', '«Is» está en presente.'], ['No hay examen', 'RV10', 'La negación es solo para el viernes.']] },
          { t: 'The new library will open next year.', w: 'library', ok: 'La nueva biblioteca abrirá el próximo año', m: [['La nueva librería abrirá el próximo año', 'RV54', '«Library» es biblioteca; librería es «bookstore».'], ['La nueva biblioteca abrió el año pasado', 'RV55', '«Will open» es futuro.'], ['La biblioteca no abrirá', 'RV10', 'No hay negación.']] },
        ];
        const b = B[s % B.length];
        const [antes, despues] = b.t.split(b.w);
        return {
          pregunta: 'What does the sentence say? Choose the best Spanish version.',
          dibujo: { datos: tarjeta('Text', [...(antes.trim() ? [['a', antes.trim()]] : []), ['w', b.w], ['b', despues.trim()]]), estado: { marcas: { w: 'o' } } },
          opciones: opciones(b.ok, voltear(b.m, s)),
          solucion: { texto: `«${b.w}» decide el sentido de la oración.`, ecuacion: [prueba(b.w), ' → ', sost(b.ok.split(' ').slice(0, 3).join(' '))] },
        };
      },
    },
  };

  // ---------- Idea 2: main idea y summary ----------
  // Cambia: la propuesta. Permanece: el texto sobre la quinua. Progresa: qué cubre cada propuesta. Se reserva: el
  // resumen que repite detalles (predicción). Debe verse: la propuesta que cubre las tres oraciones.
  const QUI = ['Quinoa grows in the Andes, even in cold and dry places.', 'It has more protein than rice or wheat.', 'Today, people in many countries buy it.'];
  const PROP = {
    main: { t: 'Quinoa is a strong and nutritious crop that is now popular around the world.', cubre: [1, 2, 3], dice: 'Cubre las tres oraciones', ok: true },
    detalle: { t: 'Quinoa has more protein than rice.', cubre: [2], dice: 'Es un detalle: cubre solo la 2', ok: false },
    general: { t: 'Food is important for people.', cubre: [], dice: 'Demasiado general: otro texto', ok: false },
    primera: { t: 'Quinoa grows in the Andes.', cubre: [1], dice: 'Es la primera oración: deja fuera el resto', ok: false },
  };
  const figQ = k => ({ secciones: [lista('Text', QUI).secciones[0], { id: 'p', titulo: 'Main idea?', modo: 'tarjeta', fragmentos: [{ id: 'p1', t: PROP[k].t }] }] });
  const mainIdea = {
    id: 'main-idea',
    titulo: 'Main idea y summary',
    temas: ['Idea principal (main idea)', 'Resumen (summary)'],
    pieza: 'rv-texto',
    juega: {
      consigna: 'Prueba cuatro propuestas de main idea para el texto sobre la quinua. Mira qué oraciones cubre cada una.',
      voz: 'La main idea cubre todo el texto, igual que en español.',
      controles: [{ id: 'k', etiqueta: 'Propuesta', opciones: [{ valor: 'main', texto: 'A' }, { valor: 'detalle', texto: 'B' }, { valor: 'general', texto: 'C' }, { valor: 'primera', texto: 'D' }] }],
      dibujo: val => { const p = PROP[val.k], marcas = { p1: p.ok ? 'o' : 'h' }; [1, 2, 3].forEach(n => { marcas[`o${n}`] = p.cubre.includes(n) ? 'i' : 'h'; }); return { datos: figQ(val.k), estado: { marcas, sellos: { p: { t: `Cubre ${p.cubre.length} de 3`, c: p.ok ? 'i' : 'h' } } } }; },
      lectura: val => [corto(PROP[val.k].ok ? sost : engana, PROP[val.k].dice)],
      minimo: 3,
    },
    predice: {
      pregunta: 'Which is the best summary of the text about the vicuña?',
      opciones: opciones('Vicuñas were in danger, but protection helped them recover', [
        ['Vicuñas live high. Their wool is fine. Hunters killed them.', 'RV43', 'Repite datos en lista; no dice qué los une ni que se recuperaron.'],
        ['Vicuñas have the finest wool in the world', 'RV1', 'Es un detalle del texto, no el resumen.'],
        ['All animals in Peru are protected now', 'RV11', 'El texto habla solo de la vicuña.'],
      ]),
      dibujo: { datos: lista('Text', ['Vicuñas live high in the Andes and have very fine wool.', 'In the 1960s, hunters had killed most of them.', 'After the government protected them, their number grew again.']), estado: {} },
      revelar: { datos: lista('Text', ['Vicuñas live high in the Andes and have very fine wool.', 'In the 1960s, hunters had killed most of them.', 'After the government protected them, their number grew again.']), estado: { marcas: { o1: 'i', o2: 'i', o3: 'i' }, sellos: { o: { t: 'Cubre 3 de 3', c: 'i' } } } },
      coincide: 'Coincide: el resumen une el peligro y la recuperación, sin listar detalles.',
    },
    mira: {
      datos: figQ('main'),
      pasos: [
        { estado: { marcas: { o1: 'i' }, tapar: ['p1'] }, texto: 'La 1 dice dónde crece y que resiste el frío.', ecuacion: [sost('strong crop')] },
        { estado: { marcas: { o1: 'i', o2: 'i' }, tapar: ['p1'], nuevo: ['o2'] }, texto: 'La 2 dice que es nutritiva.', ecuacion: [sost('strong'), ' + ', sost('nutritious')] },
        { estado: { marcas: { o1: 'i', o2: 'i', o3: 'i', p1: 'o' }, sellos: { p: { t: 'Cubre 3 de 3', c: 'i' } }, nuevo: ['o3', 'p1'] }, texto: 'La 3: se vende en el mundo. La main idea une las tres.', ecuacion: [sost('strong'), ' + ', sost('nutritious'), ' + ', sost('popular')] },
      ],
    },
    regla: {
      texto: 'La main idea afirma lo más importante y cubre todo el texto; el summary lo dice en pocas palabras, sin listar detalles ni cambiar quién hace qué ni cuántos.',
      ecuacion: [prueba('main idea'), ' = ', sost('todo el texto'), ' en una oración'],
      condicion: 'se comprueba oración por oración que la propuesta las cubre, sin agregar algo que el texto no dice.',
    },
    ahoraTu: {
      generar(s) {
        const B = [
          { o: ['Many children in the city do not sleep enough.', 'They use phones late at night.', 'As a result, they feel tired at school.'], ok: 'Using phones at night makes many children tired at school', m: [['Children use phones', 'RV1', 'Es un detalle: falta el sueño y el cansancio.'], ['Sleep is important for everybody', 'RV2', 'Es demasiado general.'], ['Many children in the city do not sleep enough', 'RV4', 'Es la primera oración; deja fuera la causa y el efecto.']] },
          { o: ['Lake Titicaca is shared by Peru and Bolivia.', 'Some parts of the lake are polluted.', 'Local groups are cleaning the shores.'], ok: 'Groups are cleaning Lake Titicaca because parts are polluted', m: [['Lake Titicaca is in two countries', 'RV4', 'Es la primera oración; deja fuera lo principal.'], ['All the lake is polluted', 'RV11', 'El texto dice «some parts».'], ['Lakes are beautiful', 'RV2', 'Es demasiado general.']] },
          { o: ['Bicycles do not pollute the air.', 'Riding one is also good exercise.', 'So more people in Lima now ride to work.'], ok: 'More people ride bicycles because they are clean and healthy', m: [['Bicycles do not pollute', 'RV1', 'Es un detalle.'], ['Everybody in Lima rides a bicycle', 'RV11', 'El texto dice «more people», no todos.'], ['Exercise is good', 'RV2', 'Demasiado general.']] },
          { o: ['The Inca road system was very long.', 'Runners called chasquis carried messages on it.', 'Messages could travel hundreds of kilometers in days.'], ok: 'Inca roads and chasquis made messages travel fast', m: [['The Inca road system was very long', 'RV4', 'Es la primera oración; faltan los chasquis.'], ['Chasquis were runners', 'RV1', 'Es un detalle.'], ['The Incas had no roads', 'RV10', 'Dice lo contrario del texto.']] },
          { o: ['Potatoes first grew in the Andes.', 'Later, they traveled to Europe.', 'Now they are eaten all over the world.'], ok: 'Potatoes came from the Andes and spread around the world', m: [['Potatoes traveled to Europe', 'RV1', 'Es un detalle.'], ['Potatoes first grew in the Andes', 'RV4', 'Es la primera oración.'], ['People eat food', 'RV2', 'Demasiado general.']] },
        ];
        const b = B[s % B.length];
        return {
          pregunta: 'What is the main idea of the text?',
          dibujo: { datos: lista('Text', b.o), estado: {} },
          opciones: opciones(b.ok, voltear(b.m, s)),
          solucion: { texto: 'La main idea cubre las tres oraciones sin agregar nada.', ecuacion: [prueba('main idea'), ' = ', sost('1 + 2 + 3')] },
        };
      },
    },
  };

  // ---------- Idea 3: lo que el texto dice y lo que no ----------
  // Cambia: la afirmación. Permanece: el texto sobre Ana. Progresa: dicho, contradicho, no dicho. Se reserva: otra
  // afirmación con «never» (predicción). Debe verse: la frase inglesa que decide cada caso.
  const ANA = ['Ana lives in Puno with her grandmother.', 'Every morning she walks to school.', 'She wants to study medicine.'];
  const AF = {
    stated: { t: 'Ana walks to school every morning.', marcas: { o2: 'i' }, sello: ['Stated: lo dice', 'i'], dice: 'Lo dice la oración 2' },
    false: { t: 'Ana lives in Lima.', marcas: { o1: 'h' }, sello: ['False: lo contradice', 'h'], dice: 'La 1 dice Puno: lo contradice' },
    notstated: { t: 'Ana has two brothers.', marcas: {}, sello: ['Not stated', 'd'], dice: 'No lo dice ni lo niega' },
  };
  const figAna = k => ({ secciones: [lista('Text', ANA).secciones[0], { id: 'a', titulo: 'Statement', modo: 'tarjeta', fragmentos: [{ id: 'a1', t: AF[k].t }] }] });
  const dice = {
    id: 'stated-or-not',
    titulo: 'Dicho, contradicho o no dicho',
    temas: ['Lo que el texto dice y lo que no'],
    pieza: 'rv-texto',
    juega: {
      consigna: 'Prueba tres afirmaciones sobre Ana. Mira si el texto las dice, las contradice o no dice nada.',
      voz: 'Que el texto no lo diga no lo vuelve falso.',
      controles: [{ id: 'k', etiqueta: 'Statement', opciones: [{ valor: 'stated', texto: 'A' }, { valor: 'false', texto: 'B' }, { valor: 'notstated', texto: 'C' }] }],
      dibujo: val => ({ datos: figAna(val.k), estado: { marcas: Object.assign({ a1: AF[val.k].sello[1] === 'h' ? 'h' : 'o' }, AF[val.k].marcas), sellos: { a: { t: AF[val.k].sello[0], c: AF[val.k].sello[1] } } } }),
      lectura: val => [corto(AF[val.k].sello[1] === 'h' ? engana : AF[val.k].sello[1] === 'd' ? nodice : sost, AF[val.k].dice)],
      minimo: 3,
    },
    predice: {
      pregunta: 'According to the text, «Ana never helps her grandmother» is…',
      opciones: opciones('Not stated', [
        ['True', 'RV7', 'El texto no habla de si la ayuda o no.'],
        ['False', 'RV36', 'Para ser falso, el texto tendría que decir que sí la ayuda.'],
        ['True, because «never» is in the text', 'RV5', '«Never» no aparece en el texto.'],
      ]),
      dibujo: { datos: { secciones: [lista('Text', ANA).secciones[0], { id: 'a', titulo: 'Statement', modo: 'tarjeta', fragmentos: [{ id: 'a1', t: 'Ana never helps her grandmother.' }] }] }, estado: { marcas: { a1: 'o' } } },
      revelar: { datos: { secciones: [lista('Text', ANA).secciones[0], { id: 'a', titulo: 'Statement', modo: 'tarjeta', fragmentos: [{ id: 'a1', t: 'Ana never helps her grandmother.' }] }] }, estado: { marcas: { a1: 'o', o1: 'd' }, sellos: { a: { t: 'Not stated', c: 'd' } } } },
      coincide: 'Coincide: el texto nombra a la abuela, pero no dice nada sobre ayudarla.',
    },
    mira: {
      datos: figAna('notstated'),
      pasos: [
        { estado: { marcas: { a1: 'o' } }, texto: 'Primero se busca una oración que hable de lo mismo: hermanos.', ecuacion: [prueba('brothers'), ' → ¿dónde?'] },
        { estado: { marcas: { a1: 'o', o1: 'd', o2: 'd', o3: 'd' }, nuevo: ['o1', 'o2', 'o3'] }, texto: 'Ninguna habla de hermanos: ni lo dice ni lo niega.', ecuacion: [nodice('no brothers in the text')] },
        { estado: { marcas: { a1: 'o' }, sellos: { a: { t: 'Not stated', c: 'd' } }, nuevo: ['a'] }, texto: 'Por eso es «not stated», no «false».', ecuacion: [nodice('not stated'), ' ≠ ', engana('false')] },
      ],
    },
    regla: {
      texto: 'Una afirmación es true si el texto la dice, false si la contradice y not stated si el texto no la decide. Se justifica con la frase inglesa exacta.',
      ecuacion: [sost('true'), ' · ', engana('false'), ' · ', nodice('not stated')],
      condicion: 'se compara quién, qué, cuándo y cuántos; lo que no se menciona no es falso.',
    },
    ahoraTu: {
      generar(s) {
        const B = [
          { o: ['Luis has a small farm near Juliaca.', 'He grows potatoes and keeps some alpacas.'], a: 'Luis grows potatoes.', ok: 'True', m: [['False', 'RV36', 'La oración 2 lo dice.'], ['Not stated', 'RV34', 'Está dicho en la oración 2.'], ['Only in summer', 'RV7', 'El texto no habla de estaciones.']] },
          { o: ['The museum opens from Tuesday to Sunday.', 'It is free on the first Sunday of the month.'], a: 'The museum opens on Mondays.', ok: 'False', m: [['True', 'RV10', 'Abre de martes a domingo: el lunes no.'], ['Not stated', 'RV9', 'Se deduce que el lunes está cerrado.'], ['Only on Sundays', 'RV11', 'Abre más días.']] },
          { o: ['Rosa plays the charango.', 'She learned from her uncle.'], a: 'Rosa plays the charango in a band.', ok: 'Not stated', m: [['True', 'RV7', 'El texto no habla de una banda.'], ['False', 'RV36', 'Tampoco lo niega.'], ['True, because she plays', 'RV7', 'Tocar no implica tocar en una banda.']] },
          { o: ['Few tourists visit the village in the rainy season.', 'Most come in July.'], a: 'Many tourists visit in the rainy season.', ok: 'False', m: [['True', 'RV11', '«Few» es pocos: lo contradice.'], ['Not stated', 'RV34', 'Sí lo dice: pocos.'], ['Only in July', 'RV7', 'No responde a la afirmación.']] },
          { o: ['The school will build a new library.', 'Work starts next year.'], a: 'The new library is already open.', ok: 'False', m: [['True', 'RV55', '«Will build» es futuro: aún no existe.'], ['Not stated', 'RV9', 'Se deduce que no está abierta.'], ['True, next year', 'RV55', 'El próximo año empiezan las obras.']] },
        ];
        const b = B[s % B.length];
        return {
          pregunta: 'According to the text, the statement is…',
          dibujo: { datos: { secciones: [lista('Text', b.o).secciones[0], { id: 'a', titulo: 'Statement', modo: 'tarjeta', fragmentos: [{ id: 'a1', t: b.a }] }] }, estado: { marcas: { a1: 'o' } } },
          opciones: opciones(b.ok, voltear(b.m, s)),
          solucion: { texto: 'Se busca la frase inglesa que habla de lo mismo y se compara.', ecuacion: [prueba('statement'), ' frente a ', sost('the text')] },
        };
      },
    },
  };

  return {
    unidad: 'razonamiento-verbal.lectura-en-ingles',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rv-texto.js'],
    historia: {
      texto: 'En 2001, el Consejo de Europa publicó el Marco común europeo de referencia para describir lo que una persona puede hacer con una lengua, no solo qué gramática sabe. En 2020 lo amplió. Comprender una idea, ubicar un dato y resumir son tareas distintas que se gradúan.',
      pregunta: '¿Entender cada palabra es entender el texto?',
      fuente: { titulo: 'Matriz de teoría de razonamiento verbal (MCER 2001 y 2020)', url: 'https://learnenglish.britishcouncil.org/free-resources/reading' },
    },
    ideas: [basico, mainIdea, dice],
  };
});
