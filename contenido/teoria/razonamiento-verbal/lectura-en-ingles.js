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
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  // Gesto directo (docs/teoria.md §4b): un marcador que se arrastra por el texto inglés y se suelta en una palabra u
  // oración; la manija va sobre ella (rv-texto.ancla) y salta a la más cercana al dedo (rv-texto.cercana). El control
  // con botones es la alternativa sin arrastre.
  const RV = () => Kit.piezas['rv-texto'];
  const marcador = (datosDe, ids, control, etiqueta) => ({
    id: 'frase', etiqueta, color: 'c-o',
    donde: val => RV().ancla(datosDe(val), val[control]),
    mover: (pt, val) => ({ [control]: RV().cercana(datosDe(val), pt, ids) }),
  });
  const oraciones = n => Array.from({ length: n }, (_, k) => ({ valor: `o${k + 1}`, texto: `${k + 1}` }));
  const corto = (fn, t) => {
    // El trozo de color no se parte: con 14 letras o menos cabe en la miniatura de un caso guardado del laboratorio.
    if (t.length <= 14) return fn(t);
    const k = [t.indexOf(': '), t.indexOf(', ')].filter(i => i > 0).sort((a, b) => a - b)[0];
    if (k && k <= 14) return [fn(t.slice(0, k)), t.slice(k)];
    const ps = t.split(' '); let n = 1;
    while (n < ps.length && ps.slice(0, n + 1).join(' ').length <= 14) n++;
    return [fn(ps.slice(0, n).join(' ')), ' ' + ps.slice(n).join(' ')];
  };
  const sost = t => ({ v: 'c-i', t }), prueba = t => ({ v: 'c-o', t }), nodice = t => ({ v: 'c-d', t }), engana = t => ({ v: 'c-h', t });
  const opciones = (c, malas) => [{ id: 'c', texto: c, correcta: true }, ...malas.map(([texto, error, siFuera], k) => ({ id: `e${k}`, texto, error, siFuera }))];
  const voltear = (arr, s) => (s % 2 ? arr.slice().reverse() : arr.slice());
  const tarjeta = (titulo, frs) => ({ esquinaLibre: true, secciones: [{ id: 'o', titulo, modo: 'tarjeta', fragmentos: frs.map(([id, t]) => ({ id, t })) }] });
  const lista = (titulo, ors) => ({ esquinaLibre: true, secciones: [{ id: 'o', titulo, modo: 'lista', fragmentos: ors.map((t, k) => ({ id: `o${k + 1}`, t })) }] });
  // «Así se resuelve»: azar con semilla (el de razones-y-proporciones.js) para elegir un ítem de los bancos RES_*, que
  // son propios y distintos de los de «Ahora tú». El paso «sentido» descarta la opción más tentadora del ítem.
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    return r;
  }
  const elegirRes = (banco, s) => banco[(s + Math.floor(azar(s + 900)() * (banco.length - 1))) % banco.length];
  const minus = t => t.charAt(0).toLowerCase() + t.slice(1);
  const descarto = ([texto, , porque]) => `Descarto la más tentadora, «${texto}»: ${minus(porque)}`;

  // ---------- Idea 1: palabras que engañan ----------
  // Cambia: la palabra que se mira. Permanece: el texto de la biblioteca. Progresa: falso amigo, tiempo y
  // cuantificador. Se reserva: «some» (predicción). Debe verse: la palabra y su sentido real, junto al texto.
  const LIB = [['a', 'Actually,'], ['b', 'the town library'], ['c', 'used to'], ['d', 'open on Sundays.'], ['e', 'Now it is closed, but'], ['f', 'few'], ['g', 'people know it.']];
  const PAL = {
    a: { glosa: '«Actually» = en realidad (no «actualmente»)', trampa: true, clase: 'falso amigo' },
    b: { glosa: '«Library» = biblioteca (no «librería»)', trampa: true, clase: 'falso amigo' },
    c: { glosa: '«Used to» = antes solía: ya no', trampa: true, clase: 'tiempo' },
    f: { glosa: '«Few» = pocos (no «algunos»)', trampa: true, clase: 'cuantificador' },
  };
  // Banco de «Así se resuelve» (misma forma que el de «Ahora tú», con otras oraciones): es = sentido real de w,
  // tienta = la opción más tentadora, datos y aplica = lo que se lee y se razona en cada paso.
  const RES_PAL = [
    { t: 'She was embarrassed when she fell in the street.', w: 'embarrassed', clase: 'falso amigo', es: 'avergonzada', ok: 'Ella sintió vergüenza al caerse en la calle',
      m: [['Ella estaba embarazada cuando se cayó', 'RV54', '«Embarrassed» es avergonzada; embarazada es «pregnant».'], ['Ella se caerá en la calle', 'RV55', '«Was» y «fell» están en pasado.'], ['Ella no se cayó en la calle', 'RV10', 'No hay negación.']], tienta: 0,
      datos: '«Embarrassed» se parece a «embarazada». La oración cuenta que ella se cayó en la calle.',
      aplica: 'Caerse en la calle da vergüenza; «embarazada» no encaja con «when she fell». Entonces «embarrassed» es avergonzada.' },
    { t: 'Please use the exit at the back of the bus.', w: 'exit', clase: 'falso amigo', es: 'salida', ok: 'Por favor, usa la salida de atrás del bus',
      m: [['Por favor, ten éxito al final del viaje', 'RV54', '«Exit» es salida; éxito es «success».'], ['Usaste la salida de atrás del bus', 'RV55', '«Please use» es un pedido en presente.'], ['No uses la salida de atrás', 'RV10', 'No hay «don\'t».']], tienta: 0,
      datos: '«Exit» se parece a «éxito». La oración pide usar algo que está en la parte de atrás del bus.',
      aplica: 'En un bus, lo que se usa atrás es una puerta, no un éxito. «Exit» es salida.' },
    { t: 'Many families in Puno will travel to Lima in March.', w: 'will travel', clase: 'tiempo', es: 'viajarán', ok: 'Muchas familias de Puno viajarán a Lima en marzo',
      m: [['Muchas familias de Puno viajaron a Lima en marzo', 'RV55', '«Will travel» es futuro; el pasado sería «traveled».'], ['Pocas familias de Puno viajarán a Lima', 'RV11', '«Many» es muchas.'], ['Ninguna familia de Puno viajará a Lima', 'RV10', 'No hay negación.']], tienta: 0,
      datos: '«Will» va delante de «travel». La oración dice quiénes viajan, adónde y cuándo: en marzo.',
      aplica: '«Will» delante del verbo habla del futuro: las familias todavía no viajan. Se lee «viajarán».' },
    { t: 'A few students stayed after class to clean the room.', w: 'A few', clase: 'cuantificador', es: 'unos cuantos', ok: 'Unos cuantos estudiantes se quedaron a limpiar el aula',
      m: [['Casi ningún estudiante se quedó a limpiar el aula', 'RV11', '«A few» es unos cuantos; «few», sin la «a», sería casi ninguno.'], ['Todos los estudiantes se quedaron a limpiar', 'RV11', 'Nada dice «all».'], ['Unos cuantos estudiantes se quedarán a limpiar', 'RV55', '«Stayed» está en pasado.']], tienta: 0,
      datos: '«A few» va delante de «students». La oración dice que se quedaron después de clase a limpiar el aula.',
      aplica: 'Con la «a», «a few» es unos cuantos: sí se quedaron algunos. La palabra pequeña cambia el sentido.' },
  ];
  const REGLA_PAL = {
    'falso amigo': 'Si una palabra se parece al español, compruebo que ese sentido encaje con el resto de la oración. Si no encaja, es un falso amigo.',
    tiempo: 'El verbo dice cuándo pasa algo. Antes de elegir, miro si la oración habla de antes, de ahora o de después.',
    cuantificador: 'Un cuantificador dice cuántos y cambia todo el sentido. Lo leo completo, con las palabras pequeñas que lo acompañan.',
  };
  const basico = {
    id: 'palabras-que-enganan',
    titulo: 'Palabras que engañan',
    temas: ['Inglés básico'],
    lee: { tarjetas: [
      { titulo: 'Palabras conocidas', texto: 'En los letreros de Puno para turistas lees «hotel», «restaurant» o «museum». Se parecen al español y significan lo mismo. Se llaman cognados y te ayudan a leer más rápido.' },
      { titulo: 'Falsos amigos', texto: 'Otras palabras se parecen al español y significan otra cosa. «Carpet» no es carpeta: es alfombra. Si te fías del parecido, la oración entera cambia de sentido.',
        ecuacion: [engana('carpet'), ' = alfombra'] },
      { titulo: 'Qué mirar al jugar', texto: 'En el juego hay un aviso corto en inglés. Lleva el círculo naranja a cada palabra marcada y pregúntate si el sentido que le das encaja con el resto del aviso.' },
    ] },
    pieza: 'rv-texto',
    juega: {
      consigna: 'Arrastra el círculo naranja por el texto en inglés. Mira qué palabras se parecen al español y significan otra cosa.',
      voz: 'Un cognado se parece al español y significa lo mismo; un falso amigo, no.',
      controles: [{ id: 'k', etiqueta: 'Palabra', opciones: [{ valor: 'a', texto: 'Actually' }, { valor: 'b', texto: 'library' }, { valor: 'c', texto: 'used to' }, { valor: 'f', texto: 'few' }] }],
      dibujo: val => ({ datos: tarjeta('Text', LIB), estado: { marcas: { [val.k]: 'o' }, sellos: { o: { t: 'Revisa el sentido', c: 'h' } } } }),
      lectura: val => { const [w, sentido] = PAL[val.k].glosa.split(' = '); return [prueba(w), ` = ${sentido}`]; },
      minimo: 3,
      arrastres: [marcador(() => tarjeta('Text', LIB), ['a', 'b', 'c', 'f'], 'k', 'marcador de la palabra')],
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
        { estado: { marcas: { a: 'h', b: 'h' } }, texto: '«Actually» y «library» se parecen al español, pero son falsos amigos.', ecuacion: [engana('actually'), ' = en realidad', '   ·   ', engana('library'), ' = biblioteca'] },
        { estado: { marcas: { c: 'o', d: 'i', e: 'i' }, nuevo: ['c', 'e'] }, texto: '«Used to open» dice que antes abría; «now it is closed» lo confirma.', ecuacion: [prueba('used to'), ' = antes, ya no'] },
        { estado: { marcas: { f: 'o', g: 'i' }, nuevo: ['f'] }, texto: '«Few people» son pocas personas: casi nadie lo sabe.', ecuacion: [prueba('few'), ' = pocos'] },
      ],
    },
    regla: {
      texto: 'Al leer en inglés, revisa los falsos amigos (actually, library, assist), el tiempo del verbo (used to, will, would) y los cuantificadores y negaciones (some, few, all, no).',
      ecuacion: [{ llave: [engana('falso amigo')], nota: 'parece y no es', color: 'c-h' }, '   ·   ', prueba('tiempo'), '   ·   ', { llave: [prueba('cuantificador')], nota: 'some, few, all', color: 'c-o' }],
      condicion: 'se lee la palabra en su oración; si el sentido del español no encaja con el resto, quizá es un falso amigo.',
    },
    resuelve: {
      pieza: 'rv-texto',
      generar(s) {
        const b = elegirRes(RES_PAL, s), [antes, despues] = b.t.split(b.w);
        const frs = [...(antes.trim() ? [['a', antes.trim()]] : []), ['w', b.w], ['b', despues.trim()]];
        return {
          enunciado: `What does the sentence say? Look at «${b.w}» and choose the best Spanish version.`,
          dibujo: { datos: tarjeta('Text', frs), estado: { marcas: { w: 'o' } } },
          pasos: [
            { tipo: 'pide', texto: ['Piden la versión en español que dice lo mismo que la oración. La palabra que decide es «', prueba(b.w), '».'] },
            { tipo: 'datos', texto: b.datos },
            { tipo: 'regla', texto: REGLA_PAL[b.clase] },
            { tipo: 'aplica', texto: b.aplica, ecuacion: [prueba(b.w), ' = ', sost(b.es)],
              dibujo: { datos: tarjeta('Text', frs), estado: { marcas: { w: 'i', b: 'i' }, sellos: { o: { t: `${b.w} = ${b.es}`, c: 'i' } }, nuevo: ['w', 'b'] } } },
            { tipo: 'sentido', texto: descarto(b.m[b.tienta]) },
          ],
          respuesta: b.ok,
        };
      },
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
  // Banco de «Así se resuelve»: tema = de qué trata (en inglés para la pregunta, en español para el paso).
  const RES_MAIN = [
    { tema: 'alpacas', temaEs: 'las alpacas', o: ['Alpacas live in the high Andes of Puno.', 'Their wool keeps people warm in winter.', 'Many families sell clothes made from it.'],
      ok: 'Alpacas matter to Puno families because their wool is warm', m: [['Alpacas live in the high Andes of Puno', 'RV4', 'Es la primera oración; deja fuera la lana y la venta.'], ['Wool keeps people warm', 'RV1', 'Es un detalle: cubre solo la 2.'], ['Animals are useful', 'RV2', 'Es demasiado general: sirve para otro texto.']], tienta: 0,
      datos: 'La 1 dice dónde viven las alpacas; la 2, que su lana abriga; la 3, que muchas familias venden ropa hecha con ella.',
      aplica: 'Uno las tres: las alpacas viven en Puno, su lana abriga y da trabajo a las familias. La propuesta que junta todo eso es la main idea.' },
    { tema: 'the school garden', temaEs: 'el huerto del colegio', o: ['Students at a school in Juliaca started a garden.', 'They grow lettuce and carrots there.', 'Now the school kitchen uses their vegetables.'],
      ok: 'A school garden in Juliaca now gives vegetables to its kitchen', m: [['Students at a school in Juliaca started a garden', 'RV4', 'Es la primera oración; falta para qué sirve el huerto.'], ['They grow lettuce and carrots', 'RV1', 'Es un detalle: cubre solo la 2.'], ['Gardens are nice', 'RV2', 'Es demasiado general.']], tienta: 0,
      datos: 'La 1 cuenta que unos alumnos de Juliaca hicieron un huerto; la 2, qué siembran; la 3, que la cocina del colegio usa sus verduras.',
      aplica: 'Uno las tres: el huerto existe, da verduras y esas verduras llegan a la cocina. La propuesta que dice todo eso cubre 1, 2 y 3.' },
    { tema: 'reading on paper and on screens', temaEs: 'leer en papel y en pantalla', o: ['Reading on paper helps some people remember more.', 'Screens can make the eyes tired.', 'But a phone lets us carry many books at once.'],
      ok: 'Paper and phones each have good points for reading', m: [['Phones are better than paper for reading', 'RV11', 'El texto da ventajas a los dos, no elige uno.'], ['Screens can make the eyes tired', 'RV1', 'Es un detalle: cubre solo la 2.'], ['Reading is important', 'RV2', 'Es demasiado general.']], tienta: 0,
      datos: 'La 1 da una ventaja del papel; la 2, una desventaja de la pantalla; la 3, con «but», una ventaja del celular.',
      aplica: '«But» equilibra el texto: hay puntos a favor del papel y a favor del celular. La main idea tiene que nombrar a los dos sin elegir uno.' },
    { tema: 'the Uros', temaEs: 'los uros', o: ['The Uros live on floating islands on Lake Titicaca.', 'They build the islands with totora reeds.', 'Every few months, they add new reeds on top.'],
      ok: 'The Uros build and keep their floating islands with totora reeds', m: [['The Uros live on Lake Titicaca', 'RV4', 'Es casi la primera oración; falta cómo hacen y cuidan las islas.'], ['They add new reeds every few months', 'RV1', 'Es un detalle: cubre solo la 3.'], ['Islands are beautiful', 'RV2', 'Es demasiado general.']], tienta: 0,
      datos: 'La 1 dice dónde viven los uros; la 2, con qué hacen sus islas; la 3, que cada pocos meses ponen totora nueva encima.',
      aplica: 'Uno las tres: viven en islas flotantes, las construyen con totora y las renuevan. La main idea dice construir y mantener las islas.' },
  ];
  const figQ = k => ({ esquinaLibre: true, secciones: [lista('Text', QUI).secciones[0], { id: 'p', titulo: 'Main idea?', modo: 'tarjeta', fragmentos: [{ id: 'p1', t: PROP[k].t }] }] });
  const mainIdea = {
    id: 'main-idea',
    titulo: 'Main idea y summary',
    temas: ['Idea principal (main idea)', 'Resumen (summary)'],
    lee: { tarjetas: [
      { titulo: 'Preguntas en inglés', texto: 'En los exámenes de admisión, el texto en inglés trae sus preguntas también en inglés. «Main idea» es la idea principal y «summary», el resumen. Son preguntas que vas a encontrar seguido.' },
      { titulo: 'No hace falta cada palabra', texto: 'Lo que ya haces al leer en español sirve aquí. Para saber de qué trata un texto, busca el tema que vuelve en cada oración, aunque alguna palabra no la entiendas.' },
      { titulo: 'Qué mirar al jugar', texto: 'En el juego hay tres oraciones sobre la quinua y cuatro propuestas. Lleva el círculo naranja por cada oración y fíjate cuántas quedan en turquesa con cada propuesta.' },
    ] },
    pieza: 'rv-texto',
    juega: {
      consigna: 'Prueba cuatro propuestas de main idea sobre la quinua. Pasa el círculo naranja por cada oración: ¿la propuesta la cubre?',
      voz: 'La main idea cubre todo el texto, igual que en español.',
      controles: [
        { id: 'k', etiqueta: 'Propuesta', opciones: [{ valor: 'main', texto: 'A' }, { valor: 'detalle', texto: 'B' }, { valor: 'general', texto: 'C' }, { valor: 'primera', texto: 'D' }] },
        { id: 'f', etiqueta: 'Oración', opciones: oraciones(3) },
      ],
      dibujo: val => { const p = PROP[val.k], marcas = { p1: p.ok ? 'o' : 'h' }; [1, 2, 3].forEach(n => { marcas[`o${n}`] = p.cubre.includes(n) ? 'i' : 'h'; }); return { datos: figQ(val.k), estado: { marcas, sellos: { p: { t: `Cubre ${p.cubre.length} de 3`, c: p.ok ? 'i' : 'h' } } } }; },
      lectura: val => {
        const p = PROP[val.k], n = +val.f.slice(1), si = p.cubre.includes(n);
        return [(si ? sost : engana)(`La ${n}: ${si ? 'cubierta' : 'fuera'}`), '   ·   ', corto(p.ok ? sost : engana, p.dice)];
      },
      minimo: 3,
      arrastres: [marcador(val => figQ(val.k), ['o1', 'o2', 'o3'], 'f', 'marcador de la oración')],
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
      ecuacion: [{ llave: [prueba('main idea')], nota: 'una oración', color: 'c-o' }, ' = ', { llave: [sost('todo el texto')], nota: 'sin detalles', color: 'c-i' }],
      condicion: 'se comprueba oración por oración que la propuesta las cubre, sin agregar algo que el texto no dice.',
    },
    resuelve: {
      pieza: 'rv-texto',
      generar(s) {
        const b = elegirRes(RES_MAIN, s);
        return {
          enunciado: `What is the main idea of the text about ${b.tema}?`,
          dibujo: { datos: lista('Text', b.o), estado: {} },
          pasos: [
            { tipo: 'pide', texto: `Piden la main idea del texto sobre ${b.temaEs}: una oración en inglés que cubra las tres oraciones.` },
            { tipo: 'datos', texto: b.datos },
            { tipo: 'regla', texto: 'La main idea junta lo que dicen todas las oraciones. Un detalle o la primera oración sola se quedan cortos; una frase muy amplia habla de otro texto.' },
            { tipo: 'aplica', texto: b.aplica, ecuacion: [sost('1'), ' + ', sost('2'), ' + ', sost('3'), ' → ', prueba('main idea')],
              dibujo: { datos: lista('Text', b.o), estado: { marcas: { o1: 'i', o2: 'i', o3: 'i' }, sellos: { o: { t: 'Cubre 3 de 3', c: 'i' } }, nuevo: ['o1', 'o2', 'o3'] } } },
            { tipo: 'sentido', texto: descarto(b.m[b.tienta]) },
          ],
          respuesta: b.ok,
        };
      },
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
  // Banco de «Así se resuelve»: decide = la oración que decide y su color (vacío si ninguna lo decide).
  const RES_DICE = [
    { o: ['Carmen sells bread in the market of Juliaca.', 'She opens her stall at six in the morning.'], a: 'Carmen opens her stall early.', ok: 'True', decide: { o2: 'i' },
      m: [['False', 'RV36', 'La oración 2 lo dice: a las seis de la mañana.'], ['Not stated', 'RV34', '«At six in the morning» es temprano: sí está dicho.'], ['Only on Sundays', 'RV7', 'El texto no habla de días.']], tienta: 1,
      datos: 'El statement habla de la hora en que Carmen abre su puesto. La oración 2 habla de lo mismo.',
      aplica: 'La 2 dice «at six in the morning»: las seis es temprano. El texto lo dice con otras palabras, así que el statement es true.' },
    { o: ['The bus to Puno leaves every hour.', 'The trip takes about one hour.'], a: 'The trip to Puno takes three hours.', ok: 'False', decide: { o2: 'h' },
      m: [['True', 'RV11', 'El texto dice «about one hour», no tres.'], ['Not stated', 'RV34', 'La oración 2 habla de la duración y lo contradice.'], ['True, every hour', 'RV5', '«Every hour» habla de las salidas, no de cuánto dura el viaje.']], tienta: 2,
      datos: 'El statement habla de cuánto dura el viaje. La oración 1 habla de las salidas; la 2, de la duración.',
      aplica: 'La 2 dice «about one hour» y el statement dice «three hours». Chocan: la oración 2 lo contradice, así que es false.' },
    { o: ['Miguel plays football with his friends.', 'He practices on Saturdays.'], a: 'Miguel is the best player on the team.', ok: 'Not stated', decide: {},
      m: [['True', 'RV7', 'Que juegue no dice que sea el mejor.'], ['False', 'RV36', 'Ninguna oración dice que juegue mal.'], ['True, because he practices', 'RV7', 'Practicar los sábados no lo vuelve el mejor.']], tienta: 1,
      datos: 'El statement dice que Miguel es el mejor jugador. Busco una oración que hable de qué tan bien juega.',
      aplica: 'La 1 dice que juega con amigos; la 2, cuándo practica. Ninguna dice si es el mejor ni si juega mal: es not stated.' },
    { o: ['Our class did not go to the museum on Friday.', 'It was closed because of the rain.'], a: 'The class visited the museum on Friday.', ok: 'False', decide: { o1: 'h' },
      m: [['True', 'RV10', '«Did not go» niega la visita.'], ['Not stated', 'RV34', 'La oración 1 habla de ese viernes y lo niega.'], ['True, but it rained', 'RV10', 'No fueron: el museo estaba cerrado.']], tienta: 1,
      datos: 'El statement dice que la clase visitó el museo el viernes. La oración 1 habla de ese mismo viernes.',
      aplica: '«Did not go» niega la visita, y la 2 explica por qué: estaba cerrado. La oración 1 lo contradice: false.' },
  ];
  const figAna = k => ({ esquinaLibre: true, secciones: [lista('Text', ANA).secciones[0], { id: 'a', titulo: 'Statement', modo: 'tarjeta', fragmentos: [{ id: 'a1', t: AF[k].t }] }] });
  const dice = {
    id: 'stated-or-not',
    titulo: 'Dicho, contradicho o no dicho',
    temas: ['Lo que el texto dice y lo que no'],
    lee: { tarjetas: [
      { titulo: 'Statement', texto: 'En muchos exámenes en inglés, después del texto viene un «statement», una afirmación. Tú eliges entre tres casillas: true, false o not stated. Es una pregunta rápida, pero tiene trampa.' },
      { titulo: 'Como un testigo', texto: 'Piensa en un testigo ante un juez: no basta con decir «sí» o «no», tiene que señalar la prueba. Aquí la prueba es una frase exacta del texto en inglés.' },
      { titulo: 'Qué mirar al jugar', texto: 'En el juego, el texto cuenta tres cosas de Ana. Prueba cada afirmación, lleva el círculo naranja a la oración que habla de lo mismo y mira qué sello aparece.' },
    ] },
    pieza: 'rv-texto',
    juega: {
      consigna: 'Prueba tres afirmaciones sobre Ana. Arrastra el círculo naranja a la oración que las decide, si hay alguna.',
      voz: 'Que el texto no lo diga no lo vuelve falso.',
      controles: [
        { id: 'k', etiqueta: 'Statement', opciones: [{ valor: 'stated', texto: 'A' }, { valor: 'false', texto: 'B' }, { valor: 'notstated', texto: 'C' }] },
        { id: 'f', etiqueta: 'Oración', opciones: oraciones(3), inicio: 'o3' },
      ],
      // Si la oración marcada es la que decide, aparece el sello; si no, queda punteada (no habla de lo mismo).
      dibujo: val => {
        const a = AF[val.k], decide = a.marcas[val.f], selloSi = decide || a.sello[1] === 'd';
        return { datos: figAna(val.k), estado: Object.assign({ marcas: Object.assign({ a1: a.sello[1] === 'h' ? 'h' : 'o' }, decide ? a.marcas : { [val.f]: 'd' }) }, selloSi ? { sellos: { a: { t: a.sello[0], c: a.sello[1] } }, nuevo: ['a'] } : {}) };
      },
      lectura: val => {
        const a = AF[val.k], n = val.f.slice(1);
        if (a.sello[1] === 'd') return [nodice(`La ${n} no lo decide`), ' · ninguna lo decide'];
        if (!a.marcas[val.f]) return [nodice(`La ${n} no habla de esto`), ' · busca otra'];
        return [corto(a.sello[1] === 'h' ? engana : sost, a.dice)];
      },
      minimo: 3,
      arrastres: [marcador(val => figAna(val.k), ['o1', 'o2', 'o3'], 'f', 'marcador de la oración')],
    },
    predice: {
      pregunta: 'According to the text, «Ana never helps her grandmother» is…',
      opciones: opciones('Not stated', [
        ['True', 'RV7', 'El texto no habla de si la ayuda o no.'],
        ['False', 'RV36', 'Para ser falso, el texto tendría que decir que sí la ayuda.'],
        ['True, because «never» is in the text', 'RV5', '«Never» no aparece en el texto.'],
      ]),
      dibujo: { datos: { esquinaLibre: true, secciones: [lista('Text', ANA).secciones[0], { id: 'a', titulo: 'Statement', modo: 'tarjeta', fragmentos: [{ id: 'a1', t: 'Ana never helps her grandmother.' }] }] }, estado: { marcas: { a1: 'o' } } },
      revelar: { datos: { esquinaLibre: true, secciones: [lista('Text', ANA).secciones[0], { id: 'a', titulo: 'Statement', modo: 'tarjeta', fragmentos: [{ id: 'a1', t: 'Ana never helps her grandmother.' }] }] }, estado: { marcas: { a1: 'o', o1: 'd' }, sellos: { a: { t: 'Not stated', c: 'd' } } } },
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
      ecuacion: [sost('true'), '   ·   ', engana('false'), '   ·   ', { llave: [nodice('not stated')], nota: 'no lo decide', color: 'c-d' }],
      condicion: 'se compara quién, qué, cuándo y cuántos; lo que no se menciona no es falso.',
    },
    resuelve: {
      pieza: 'rv-texto',
      generar(s) {
        const b = elegirRes(RES_DICE, s), n = Object.keys(b.decide).map(k => k.slice(1))[0];
        const fig = estado => ({ datos: { esquinaLibre: true, secciones: [lista('Text', b.o).secciones[0], { id: 'a', titulo: 'Statement', modo: 'tarjeta', fragmentos: [{ id: 'a1', t: b.a }] }] }, estado });
        const c = b.ok === 'True' ? 'i' : b.ok === 'False' ? 'h' : 'd', fn = c === 'i' ? sost : c === 'h' ? engana : nodice;
        const marcas = Object.assign({ a1: c === 'h' ? 'h' : 'o' }, n ? b.decide : Object.fromEntries(b.o.map((_, k) => [`o${k + 1}`, 'd'])));
        return {
          enunciado: `According to the text, is «${b.a.replace(/\.$/, '')}» true, false or not stated?`,
          dibujo: fig({ marcas: { a1: 'o' } }),
          pasos: [
            { tipo: 'pide', texto: ['Piden decidir si el statement es ', sost('true'), ', ', engana('false'), ' o ', nodice('not stated'), ', con la frase del texto que lo prueba.'] },
            { tipo: 'datos', texto: b.datos },
            { tipo: 'regla', texto: 'Si una oración lo dice, es true; si una oración dice lo contrario, es false; si ninguna lo decide, es not stated. Siempre señalo la frase.' },
            { tipo: 'aplica', texto: b.aplica, ecuacion: [prueba('statement'), ' → ', fn(b.ok)],
              dibujo: fig({ marcas, sellos: { a: { t: b.ok, c } }, nuevo: ['a'] }) },
            { tipo: 'sentido', texto: descarto(b.m[b.tienta]) },
          ],
          respuesta: n ? `${b.ok}: lo decide la oración ${n}` : `${b.ok}: ninguna oración lo decide`,
        };
      },
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
          dibujo: { datos: { esquinaLibre: true, secciones: [lista('Text', b.o).secciones[0], { id: 'a', titulo: 'Statement', modo: 'tarjeta', fragmentos: [{ id: 'a1', t: b.a }] }] }, estado: { marcas: { a1: 'o' } } },
          opciones: opciones(b.ok, voltear(b.m, s)),
          solucion: { texto: 'Se busca la frase inglesa que habla de lo mismo y se compara.', ecuacion: [prueba('statement'), ' frente a ', sost('the text')] },
        };
      },
    },
  };

  // ---------- Laboratorio: all, some, not all, no ----------
  // Los cuantificadores en inglés, todos contra todos. La casilla la calcula el código recorriendo los tres mundos
  // posibles (caminan todos, caminan algunos, no camina ninguno): la afirmación es true si vale en todos los mundos
  // donde vale el texto, false si no vale en ninguno y not stated si en unos sí y en otros no. Se supone que hay
  // estudiantes (si no, «all» y «no» serían verdad a la vez).
  const CUANT = [
    { valor: 'all', texto: 'All', frase: 'All the students walk to school.', mundos: ['todos'] },
    { valor: 'some', texto: 'Some', frase: 'Some students walk to school.', mundos: ['todos', 'parte'] },
    { valor: 'notall', texto: 'Not all', frase: 'Not all the students walk to school.', mundos: ['parte', 'ninguno'] },
    { valor: 'no', texto: 'No', frase: 'No students walk to school.', mundos: ['ninguno'] },
  ];
  const MUNDOS = ['todos', 'parte', 'ninguno'];
  const CASILLA = { stated: ['True: stated', 'i'], follows: ['True: it follows', 'i'], false: ['False', 'h'], notstated: ['Not stated', 'd'] };
  function casillaCuant(tv, av) {
    const T = CUANT.find(q => q.valor === tv), A = CUANT.find(q => q.valor === av);
    const posibles = MUNDOS.filter(m => T.mundos.includes(m)), si = posibles.filter(m => A.mundos.includes(m)).length;
    if (tv === av) return 'stated';
    if (si === posibles.length) return 'follows';
    return si === 0 ? 'false' : 'notstated';
  }
  const figCuant = av => ({ esquinaLibre: true, secciones: [
    { id: 't', titulo: 'The text says one of these', modo: 'lista', fragmentos: CUANT.map(q => ({ id: q.valor, t: q.frase })) },
    { id: 'a', titulo: 'Statement', modo: 'tarjeta', fragmentos: [{ id: 'a1', t: CUANT.find(q => q.valor === av).frase }] },
  ] });
  const mesaCuant = {
    id: 'cuantificadores', titulo: 'All, some, not all, no', pieza: 'rv-texto',
    consigna: 'Arrastra el círculo naranja a lo que dice el texto y elige el statement. Mira en qué casilla cae cada par.',
    voz: '«Some» deja abierto si son todos.',
    controles: [
      { id: 't', etiqueta: 'Text', opciones: CUANT.map(q => ({ valor: q.valor, texto: q.texto })) },
      { id: 'a', etiqueta: 'Statement', opciones: CUANT.map(q => ({ valor: q.valor, texto: q.texto })), inicio: 'all' },
    ],
    dibujo: val => {
      const c = CASILLA[casillaCuant(val.t, val.a)];
      return { datos: figCuant(val.a), estado: { marcas: { [val.t]: 'i', a1: c[1] === 'i' ? 'o' : c[1] }, sellos: { a: { t: c[0], c: c[1] } } } };
    },
    lectura: val => {
      const k = casillaCuant(val.t, val.a), fn = k === 'false' ? engana : k === 'notstated' ? nodice : sost;
      return [sost(CUANT.find(q => q.valor === val.t).texto), ' → ', prueba(CUANT.find(q => q.valor === val.a).texto), ': ', fn(CASILLA[k][0])];
    },
    arrastres: [marcador(val => figCuant(val.a), CUANT.map(q => q.valor), 't', 'lo que dice el texto')],
    // Invitaciones: cada logrado pide la casilla a casillaCuant(), la misma cuenta de mundos que pone el sello.
    invitaciones: [
      { texto: 'Consigue un statement que el texto vuelva false.',
        logrado: val => casillaCuant(val.t, val.a) === 'false',
        bien: 'El texto lo contradice: no hay ningún caso posible donde valgan los dos.' },
      { texto: 'Haz que el statement se deduzca sin estar escrito en el texto.',
        logrado: val => casillaCuant(val.t, val.a) === 'follows',
        bien: 'No está escrito, pero se sigue: si caminan todos, caminan algunos.' },
      { texto: 'Busca un par que quede not stated.',
        logrado: val => casillaCuant(val.t, val.a) === 'notstated',
        bien: 'El texto deja las dos puertas abiertas. No podemos saberlo con este texto.' },
      { texto: 'Guarda dos casos con el mismo statement y casillas distintas.',
        logrado: (val, guardados) => guardados.some(g => g.a === val.a && g.t !== val.t && casillaCuant(g.t, g.a) !== casillaCuant(val.t, val.a)),
        bien: 'El statement no cambió; cambió lo que dice el texto. Eso decide.' },
    ],
  };

  return {
    unidad: 'razonamiento-verbal.lectura-en-ingles',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rv-texto.js'],
    historia: {
      texto: 'En 2001, el Consejo de Europa publicó el Marco común europeo de referencia para describir lo que una persona puede hacer con una lengua, no solo qué gramática sabe. En 2020 lo amplió. Comprender una idea, ubicar un dato y resumir son tareas distintas que se gradúan.',
      pregunta: '¿Entender cada palabra es entender el texto?',
      fuente: { titulo: 'Matriz de teoría de razonamiento verbal (MCER 2001 y 2020)', url: 'https://learnenglish.britishcouncil.org/free-resources/reading' },
    },
    glosario: [
      { termino: 'falso amigo', def: 'Palabra inglesa que se parece a una española pero significa otra cosa.',
        formas: ['falso amigo', 'falsos amigos'], ejemplo: '«Library» es biblioteca, no librería.', ver: ['cognado'] },
      { termino: 'cognado', def: 'Palabra inglesa que se parece a una española y significa lo mismo.',
        ejemplo: '«Important» es importante; «animal», animal.', ver: ['falso amigo'] },
      { termino: 'tiempo del verbo', def: 'La forma del verbo que dice cuándo ocurre algo: antes, ahora o después.',
        ejemplo: '«Walk» es presente; «walked», pasado; «will walk», futuro.', ver: ['used to'] },
      { termino: 'used to', def: 'Expresión inglesa para una costumbre del pasado que ya no ocurre.',
        ejemplo: '«We used to live near the lake»: antes vivíamos cerca del lago.', ver: ['tiempo del verbo'] },
      { termino: 'main idea', def: 'En inglés, lo más importante que afirma un texto, dicho de modo que cubra todas sus partes.',
        ver: ['idea principal', 'summary'] },
      { termino: 'summary', def: 'Versión breve de un texto en inglés que conserva lo esencial sin listar detalles.',
        ver: ['resumen', 'main idea'] },
      { termino: 'statement', def: 'Afirmación sobre un texto que se compara con lo que este dice para decidir si vale.',
        formas: ['statement', 'statements'], ver: ['not stated'] },
      { termino: 'not stated', def: 'Lo que el texto no dice ni niega: no se puede marcar como verdadero ni como falso.',
        ejemplo: '«Ana has two brothers»: ninguna oración habla de hermanos.', ver: ['statement'] },
    ],
    laboratorio: [
      mesaCuant,
      // Invitaciones de las mesas que reusan un juego: miran PAL y AF, las tablas que dan la lectura y el sello.
      Object.assign({ id: 'palabras', titulo: 'Palabras que engañan', pieza: 'rv-texto', invitaciones: [
        { texto: 'Marca la palabra que habla de algo que ya no pasa.',
          logrado: val => PAL[val.k].clase === 'tiempo',
          bien: '«Used to open» y «now it is closed» dicen lo mismo: antes sí, ahora no.' },
        { texto: 'Encuentra la palabra que dice cuántas personas lo saben.',
          logrado: val => PAL[val.k].clase === 'cuantificador',
          bien: '«Few» es pocos, casi nadie. «A few» sería otra cosa.' },
        { texto: 'Guarda dos falsos amigos distintos y compara su sentido real.',
          logrado: (val, guardados) => PAL[val.k].clase === 'falso amigo' && guardados.some(g => g.k !== val.k && PAL[g.k].clase === 'falso amigo'),
          bien: 'Se parecen al español y significan otra cosa. El resto de la oración lo delata.' },
      ] }, basico.juega),
      Object.assign({ id: 'stated', titulo: 'Stated or not stated', pieza: 'rv-texto', invitaciones: [
        { texto: 'Encuentra la oración que contradice al statement.',
          logrado: val => AF[val.k].sello[1] === 'h' && !!AF[val.k].marcas[val.f],
          bien: 'La 1 dice Puno, no Lima. Esa frase exacta lo vuelve false.' },
        { texto: 'Halla la oración que dice lo mismo que el statement A.',
          logrado: val => AF[val.k].sello[1] === 'i' && !!AF[val.k].marcas[val.f],
          bien: '«Every morning she walks to school»: ahí está la evidencia.' },
        { texto: 'Elige el statement que ninguna oración decide.',
          logrado: val => AF[val.k].sello[1] === 'd',
          bien: 'Que no se mencione no lo vuelve falso: es not stated.' },
        { texto: 'Guarda un caso false y uno not stated, y compáralos.',
          logrado: (val, guardados) => { const c = x => AF[x.k].sello[1]; return (c(val) === 'd' && guardados.some(g => c(g) === 'h')) || (c(val) === 'h' && guardados.some(g => c(g) === 'd')); },
          bien: 'Uno choca con una frase; el otro no encuentra ninguna. No son lo mismo.' },
      ] }, dice.juega),
    ],
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea). Una lista vacía:
    // la mesa no practica ninguna idea de la unidad y va en «Más mesas del tema».
    laboratorioIdeas: {
      'cuantificadores': [],
      'palabras': ['palabras-que-enganan'],
      'stated': ['stated-or-not'],
    },
    ideas: [basico, mainIdea, dice],
  };
});
