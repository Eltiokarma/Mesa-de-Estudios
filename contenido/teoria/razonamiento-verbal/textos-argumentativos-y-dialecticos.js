/*
 * Teoría de «Textos argumentativos, dialécticos y debate» (razonamiento-verbal.textos-argumentativos-y-dialecticos).
 * Molde: docs/teoria.md. Contenido: matriz de verbal (unidad 15), historia (Retórica de Aristóteles) y códigos RV42,
 * RV53 y RV59–RV62. Textos propios (regla 5). Ruta A · Argumentar: se marca la función de cada parte y su autor.
 *
 * Ficha de tarea:
 *   Promesa: separar tesis, razones y objeciones, y atribuir cada postura al autor correcto.
 *   Persona y condiciones: postulante de 3.º a 5.º, celular, sin audio; textos A/B (UNI 12, UNMSM 2, 12 y 14).
 *   Resultado observable: identifica la cuestión, atribuye posturas y formula una objeción pertinente.
 *   Orden de atención: 1.º la parte marcada · 2.º su función o su autor (sello) · acción: marcar otra.
 *   Estados: tesis · razón · objeción citada · punto común · desacuerdo.
 *   Duda que resuelve: ¿la frase que el autor cita para refutar es su tesis?
 *
 * Colores (regla 4): las razones i (turquesa, continuo), la tesis o la postura o (naranja, discontinuo), la cuestión o
 * el punto común d (verde, punteado), la objeción citada o lo que choca h (rojo).
 * Códigos: RV42, RV53 (objeción tomada por tesis), RV59 (autoría cruzada), RV60 (tesis tomada como cuestión), RV61
 * (desacuerdo donde coinciden); RVD5 (exigir síntesis a todo debate) es hipótesis nueva.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  // Gesto directo (docs/teoria.md §4b): un marcador que se arrastra por el texto y se suelta en una oración; la manija
  // va sobre su número (rv-texto.ancla) y salta a la más cercana al dedo (rv-texto.cercana). Los botones son la
  // alternativa sin arrastre. Cada idea traduce la oración elegida al valor de su control.
  const RV = () => Kit.piezas['rv-texto'];
  const corto = (fn, t) => {
    // El trozo de color no se parte: con 14 letras o menos cabe en la miniatura de un caso guardado del laboratorio.
    if (t.length <= 14) return fn(t);
    const k = [t.indexOf(': '), t.indexOf(', ')].filter(i => i > 0).sort((a, b) => a - b)[0];
    if (k && k <= 14) return [fn(t.slice(0, k)), t.slice(k)];
    const ps = t.split(' '); let n = 1;
    while (n < ps.length && ps.slice(0, n + 1).join(' ').length <= 14) n++;
    return [fn(ps.slice(0, n).join(' ')), ' ' + ps.slice(n).join(' ')];
  };
  const razon = t => ({ v: 'c-i', t }), tesis = t => ({ v: 'c-o', t }), cuestion = t => ({ v: 'c-d', t }), objecion = t => ({ v: 'c-h', t });
  const opciones = (c, malas) => [{ id: 'c', texto: c, correcta: true }, ...malas.map(([texto, error, siFuera], k) => ({ id: `e${k}`, texto, error, siFuera }))];
  const voltear = (arr, s) => (s % 2 ? arr.slice().reverse() : arr.slice());
  const lista = (titulo, ors, id = 'o', pre = 'o') => ({ id, titulo, modo: 'lista', fragmentos: ors.map((t, k) => ({ id: `${pre}${k + 1}`, t })) });
  // Semillas de «Así se resuelve» (azar(s + 900)), el mismo generador de aritmetica/razones-y-proporciones.js.
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.de = xs => xs[Math.floor(r() * xs.length)];
    return r;
  }
  // Banco propio de cada «Así se resuelve»: recorre los ítems con la semilla, mezclados por azar(s + 900).
  const elige = (RES, s) => RES[(s + Math.floor(azar(s + 900)() * RES.length)) % RES.length];
  // El paso «sentido» descarta la opción más tentadora del ítem (la primera mala) con su porqué.
  const descarta = m => `Descarto «${m[0][0]}». ${m[0][2]}`;

  // ---------- Idea 1: la tesis y sus razones ----------
  // Cambia: la oración marcada. Permanece: el texto sobre el celular en clase. Progresa: el papel de cada oración.
  // Se reserva: el texto que abre con la objeción (predicción). Debe verse: que la 1 es una objeción citada.
  const CEL = ['Algunos dicen que el celular en clase solo distrae.', 'Sin embargo, bien usado es una herramienta valiosa.', 'Permite buscar datos al instante.', 'También sirve para grabar y revisar experimentos.', 'Por eso, conviene enseñar a usarlo, no prohibirlo.'];
  const ROL = { 1: ['Objeción citada para responderla', 'h'], 2: ['Tesis: lo que el autor defiende', 'o'], 3: ['Razón que apoya la tesis', 'i'], 4: ['Otra razón', 'i'], 5: ['Conclusión: retoma la tesis', 'o'] };
  const tesisRazones = {
    id: 'tesis-razones',
    titulo: 'La tesis y sus razones',
    temas: ['Tesis y argumentos'],
    pieza: 'rv-texto',
    // Lee (fase 2): vocabulario (tesis, argumento, objeción), sin decir qué conector abre la postura del autor (Predice).
    lee: {
      tarjetas: [
        { titulo: 'Defender una idea', texto: 'En una asamblea del colegio, alguien propone cambiar la hora de salida y da sus motivos. Lo que propone es su tesis; los motivos con que busca convencer son sus argumentos, o razones.' },
        { titulo: 'La idea contraria', texto: 'Cuando alguien piensa lo contrario de una tesis y lo dice, plantea una objeción. En un texto corto pueden aparecer, en pocas líneas, una tesis, sus razones y alguna objeción.' },
        { titulo: 'Qué mirar al jugar', texto: 'El texto del juego trata del celular en clase. Lleva el círculo naranja de oración en oración y lee el sello que aparece sobre el texto: dice qué papel cumple cada una.' },
      ],
    },
    juega: {
      consigna: 'Arrastra el círculo naranja por las oraciones y mira qué papel cumple cada una: tesis, razón, conclusión u objeción.',
      voz: 'No todo lo que aparece en el texto lo defiende el autor.',
      controles: [{ id: 'k', etiqueta: 'Marca', opciones: [1, 2, 3, 4, 5].map(k => ({ valor: k, texto: `${k}` })) }],
      dibujo: val => ({ datos: { esquinaLibre: true, secciones: [lista('Texto', CEL)] }, estado: { marcas: { [`o${val.k}`]: ROL[val.k][1] }, sellos: { o: { t: ROL[val.k][0].split(':')[0], c: ROL[val.k][1] } } } }),
      lectura: val => [corto(ROL[val.k][1] === 'h' ? objecion : ROL[val.k][1] === 'o' ? tesis : razon, ROL[val.k][0])],
      minimo: 3,
      arrastres: [{
        id: 'frase', etiqueta: 'círculo de la oración', color: 'c-o',
        donde: val => RV().ancla({ esquinaLibre: true, secciones: [lista('Texto', CEL)] }, `o${val.k}`),
        mover: pt => ({ k: +RV().cercana({ esquinaLibre: true, secciones: [lista('Texto', CEL)] }, pt, CEL.map((_, j) => `o${j + 1}`)).slice(1) }),
      }],
    },
    predice: {
      pregunta: '¿Cuál es la tesis del autor en este texto sobre los uniformes?',
      voz: 'Busca lo que el autor sostiene, no lo que cita.',
      opciones: opciones('El uniforme ayuda a que nadie se sienta menos', [
        ['El uniforme quita libertad a los alumnos', 'RV53', 'El autor lo cita para responderlo: no es su postura.'],
        ['Algunos padres lo encuentran caro', 'RV42', 'Es un detalle que el autor reconoce, no su tesis.'],
        ['Los alumnos deben opinar', 'RV7', 'El texto no lo dice.'],
      ]),
      dibujo: { datos: { esquinaLibre: true, secciones: [lista('Texto', ['Se dice que el uniforme quita libertad a los alumnos.', 'Es cierto que algunos padres lo encuentran caro.', 'Pero el uniforme ayuda a que nadie se sienta menos por su ropa.', 'Por eso, conviene mantenerlo.'])] }, estado: {} },
      revelar: { datos: { esquinaLibre: true, secciones: [lista('Texto', ['Se dice que el uniforme quita libertad a los alumnos.', 'Es cierto que algunos padres lo encuentran caro.', 'Pero el uniforme ayuda a que nadie se sienta menos por su ropa.', 'Por eso, conviene mantenerlo.'])] }, estado: { marcas: { o1: 'h', o2: 'i', o3: 'o', o4: 'o' }, sellos: { o: { t: 'Tesis: la 3', c: 'o' } } } },
      coincide: 'Coincide: «pero» marca la postura del autor frente a lo que se dice.',
    },
    mira: {
      datos: { esquinaLibre: true, secciones: [lista('Texto', CEL)] },
      pasos: [
        { estado: { marcas: { o1: 'h' } }, texto: '«Algunos dicen» cita una postura ajena: es una objeción.', ecuacion: [objecion('algunos dicen'), ' = otros'] },
        { estado: { marcas: { o1: 'h', o2: 'o' }, nuevo: ['o2'] }, texto: '«Sin embargo» abre la postura del autor: la tesis.', ecuacion: [tesis('sin embargo'), ' → tesis'] },
        { estado: { marcas: { o1: 'h', o2: 'o', o3: 'i', o4: 'i' }, nuevo: ['o3', 'o4'] }, texto: 'La 3 y la 4 dan razones para la tesis.', ecuacion: [razon('razones'), ' → ', tesis('tesis')] },
        { estado: { marcas: { o1: 'h', o2: 'o', o3: 'i', o4: 'i', o5: 'o' }, nuevo: ['o5'] }, texto: '«Por eso» cierra y responde la objeción: enseñar, no prohibir.', ecuacion: [tesis('conclusión'), ' responde a ', objecion('objeción')] },
      ],
    },
    regla: {
      texto: 'Un texto argumentativo defiende una tesis con argumentos, es decir, razones. Puede citar una objeción para responderla: esa objeción no es la postura del autor.',
      ecuacion: [razon('razones'), ' → ', { llave: [tesis('tesis')], nota: 'lo que defiende', color: 'c-o' }, ' ← responde a ', { llave: [objecion('objeción')], nota: 'lo de otros', color: 'c-h' }],
      condicion: 'marcas como «algunos dicen», «se cree» presentan a otros; «sin embargo», «pero» suelen abrir la postura del autor.',
    },
    // Así se resuelve (fase 2): el mismo tipo de «Ahora tú» (hallar la tesis), con un banco propio. tesis: el número de
    // la oración que el autor defiende; marcas: el papel de cada oración, con los colores de la unidad.
    resuelve: {
      generar(s) {
        const RES = [
          { tema: 'la bicicleta en Juliaca', o: ['Muchos creen que la bicicleta es solo para quien no tiene carro.', 'Se equivocan: la bicicleta conviene a cualquiera que viaje por la ciudad.', 'Es barata y, en una ciudad plana como Juliaca, cansa poco.'], tesis: 2,
            marcas: { o1: 'h', o2: 'o', o3: 'i' }, ok: 'La bicicleta conviene a cualquiera que viaje por la ciudad', m: [['La bicicleta es solo para quien no tiene carro', 'RV53', 'Es lo que «muchos creen»; el autor lo rechaza.'], ['La bicicleta es barata y cansa poco', 'RV42', 'Son las razones, no la tesis.'], ['Hay que prohibir los carros', 'RV7', 'El texto no lo propone.']],
            datos: 'Tres oraciones: la 1 abre con «muchos creen»; la 2, con «se equivocan»; la 3 da dos ventajas de la bicicleta.',
            aplica: '«Muchos creen» trae una opinión ajena y «se equivocan» la rechaza: ahí empieza la voz del autor. La 3 lo apoya.' },
          { tema: 'el desayuno escolar', o: ['Según algunos, el desayuno en el colegio es un gasto que podría ahorrarse.', 'Un niño con hambre no atiende ni aprende.', 'Por eso, el desayuno escolar es una inversión, no un gasto.'], tesis: 3,
            marcas: { o1: 'h', o2: 'i', o3: 'o' }, ok: 'El desayuno escolar es una inversión, no un gasto', m: [['El desayuno es un gasto que podría ahorrarse', 'RV53', 'Lo dicen «algunos»; el autor lo responde.'], ['Un niño con hambre no aprende', 'RV42', 'Es la razón que sostiene la tesis.'], ['Los niños deben desayunar en casa', 'RV7', 'El texto no lo dice.']],
            datos: 'Tres oraciones: la 1 cita lo que dicen «algunos»; la 2 da un hecho sobre el hambre; la 3 abre con «por eso».',
            aplica: 'La 1 es de otros. La 2 es una razón. La 3 saca la conclusión del autor y contesta a la 1: inversión, no gasto.' },
          { tema: 'aprender en la lengua materna', o: ['Aprender en quechua o aimara ayuda a entender las primeras lecciones.', 'Se objeta que así se retrasa el castellano.', 'Pero quien lee bien en su lengua aprende después el castellano con más facilidad.'], tesis: 1,
            marcas: { o1: 'o', o2: 'h', o3: 'i' }, ok: 'Aprender en quechua o aimara ayuda a entender las primeras lecciones', m: [['Quien lee bien en su lengua aprende castellano más fácil', 'RV42', 'Tienta por el «pero», aunque solo responde a la objeción: es una razón que apoya la 1.'], ['Así se retrasa el castellano', 'RV53', 'Es la objeción que el autor cita y responde.'], ['Hay que dejar de enseñar castellano', 'RV7', 'El texto no lo propone.']],
            datos: 'Tres oraciones: la 1 afirma algo; la 2 abre con «se objeta»; la 3, con «pero», contesta esa objeción.',
            aplica: 'Aquí el autor empieza con su postura. La 2 trae la objeción y la 3 la responde para defender lo que dijo en la 1.' },
          { tema: 'la lectura en Puno', o: ['Hay quien dice que en Puno ya nadie compra libros.', 'La última feria del libro, sin embargo, se llenó tres días seguidos.', 'Leer sigue interesando, si los libros llegan a la gente.'], tesis: 3,
            marcas: { o1: 'h', o2: 'i', o3: 'o' }, ok: 'Leer sigue interesando, si los libros llegan a la gente', m: [['La feria se llenó tres días seguidos', 'RV42', 'Tienta por el «sin embargo», pero es el dato que apoya la tesis.'], ['En Puno ya nadie compra libros', 'RV53', 'Es lo que «hay quien dice»; el autor lo desmiente.'], ['Los libros son muy caros', 'RV7', 'El texto no habla de precios.']],
            datos: 'Tres oraciones: la 1 cita lo que «hay quien dice»; la 2 trae un hecho con «sin embargo»; la 3 hace una afirmación general.',
            aplica: 'La 1 es ajena. La 2 es un hecho que la desmiente, o sea, una razón. La 3 es lo que el autor concluye y defiende.' },
        ];
        const b = elige(RES, s);
        const fig = (estado) => ({ datos: { esquinaLibre: true, secciones: [lista('Texto', b.o)] }, estado });
        return {
          enunciado: `Lee el texto sobre ${b.tema}. ¿Cuál es la tesis del autor?`,
          dibujo: fig({}),
          pasos: [
            { tipo: 'pide', texto: 'Piden la tesis: la idea que el autor defiende, no cualquier oración que aparezca en el texto.' },
            { tipo: 'datos', texto: b.datos },
            { tipo: 'regla', texto: 'Separo las voces: lo que el autor cita de otros no es su postura. La tesis es lo que defiende; las razones la sostienen.',
              ecuacion: [objecion('lo citado'), ' ≠ ', tesis('tesis'), ' ← ', razon('razones')] },
            { tipo: 'aplica', texto: b.aplica, ecuacion: [tesis(`tesis: la ${b.tesis}`)],
              dibujo: fig({ marcas: b.marcas, sellos: { o: { t: `Tesis: la ${b.tesis}`, c: 'o' } }, nuevo: Object.keys(b.marcas).concat('o') }) },
            { tipo: 'sentido', texto: descarta(b.m) },
          ],
          respuesta: b.ok,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const B = [
          { o: ['Hay quienes creen que leer en pantalla es igual que en papel.', 'No es así: en papel se recuerda mejor lo leído.', 'Además, la pantalla cansa más la vista.'], ok: 'En papel se lee mejor que en pantalla', m: [['Leer en pantalla es igual que en papel', 'RV53', 'El autor lo cita para negarlo.'], ['La pantalla cansa la vista', 'RV42', 'Es una razón, no la tesis.'], ['Hay que prohibir las pantallas', 'RV7', 'El texto no lo propone.']] },
          { o: ['Se dice que el deporte quita tiempo de estudio.', 'Pero el ejercicio mejora la atención en clase.', 'Por eso, el deporte también ayuda a estudiar.'], ok: 'El deporte también ayuda a estudiar', m: [['El deporte quita tiempo de estudio', 'RV53', 'Es la objeción que el autor responde.'], ['El ejercicio mejora la atención', 'RV42', 'Es la razón, no la tesis.'], ['Hay que hacer deporte todos los días', 'RV7', 'El texto no lo dice.']] },
          { o: ['Muchos piensan que la quinua es solo comida de la sierra.', 'Sin embargo, hoy se come en todo el país y fuera de él.', 'Por eso, es un producto nacional.'], ok: 'La quinua es un producto de todo el país', m: [['La quinua es solo de la sierra', 'RV53', 'Es lo que «muchos piensan»; el autor lo niega.'], ['La quinua se come fuera del Perú', 'RV42', 'Es una razón de la tesis.'], ['La quinua es cara', 'RV7', 'El texto no lo dice.']] },
          { o: ['Algunos dicen que reciclar no sirve si la ciudad no lo hace.', 'Pero cada casa que separa su basura reduce lo que va al botadero.', 'Reciclar en casa, entonces, sí sirve.'], ok: 'Reciclar en casa sí sirve', m: [['Reciclar no sirve si la ciudad no lo hace', 'RV53', 'Es la objeción citada.'], ['Cada casa reduce la basura', 'RV42', 'Es la razón.'], ['La ciudad debe reciclar', 'RV7', 'El texto no lo propone.']] },
          { o: ['Se cree que las tareas largas enseñan más.', 'No necesariamente: el cansancio baja la atención.', 'Tareas cortas y bien pensadas enseñan mejor.'], ok: 'Las tareas cortas y bien pensadas enseñan mejor', m: [['Las tareas largas enseñan más', 'RV53', 'Es lo que «se cree»; el autor lo discute.'], ['El cansancio baja la atención', 'RV42', 'Es la razón.'], ['No deben dejarse tareas', 'RV7', 'El texto no lo dice.']] },
        ];
        const b = B[s % B.length];
        return {
          pregunta: '¿Cuál es la tesis del autor?',
          dibujo: { datos: { esquinaLibre: true, secciones: [lista('Texto', b.o)] }, estado: {} },
          opciones: opciones(b.ok, voltear(b.m, s)),
          solucion: { texto: 'Se separa lo que el autor cita de lo que sostiene.', ecuacion: [objecion('lo citado'), ' ≠ ', tesis('tesis')] },
        };
      },
    },
  };

  // ---------- Idea 2: dos autores, una cuestión ----------
  // Cambia: lo que se mira (la cuestión, la postura de A, la de B, el punto común). Permanece: los textos A y B.
  // Progresa: el debate se arma pieza por pieza. Se reserva: identificar la cuestión en otro par (predicción).
  // Debe verse: que comparten un dato y se oponen en la propuesta.
  const A = ['El tráfico del centro creció mucho este año.', 'Hay que prohibir los autos los domingos.'];
  const Bt = ['Es cierto: el tráfico del centro creció.', 'Pero prohibir autos dañaría a los comerciantes; mejor más buses.'];
  const figAB = () => ({ esquinaLibre: true, secciones: [lista('Texto A', A, 'A', 'a'), lista('Texto B', Bt, 'B', 'b')] });
  const MIRA = {
    cuestion: { marcas: { a2: 'd', b2: 'd' }, sellos: { A: { t: '¿Qué hacer?', c: 'd' } }, dice: 'Cuestión: qué hacer con el tráfico' },
    a: { marcas: { a2: 'o' }, sellos: { A: { t: 'Postura de A', c: 'o' } }, dice: 'A: prohibir autos los domingos' },
    b: { marcas: { b2: 'o' }, sellos: { B: { t: 'Postura de B', c: 'o' } }, dice: 'B: más buses, no prohibir' },
    comun: { marcas: { a1: 'i', b1: 'i' }, sellos: { A: { t: 'Coinciden', c: 'i' }, B: { t: 'Coinciden', c: 'i' } }, dice: 'Coinciden: el tráfico creció' },
  };
  const debate = {
    id: 'cuestion-y-posturas',
    titulo: 'Dos autores, una cuestión',
    temas: ['La cuestión disputada', 'Puntos de vista en un debate'],
    pieza: 'rv-texto',
    // Lee (fase 2): dos voces y el vocabulario del debate, sin decir dónde está la cuestión del huerto (Predice).
    lee: {
      tarjetas: [
        { titulo: 'Dos voces', texto: 'En la radio, dos invitados opinan sobre el mismo problema de Juliaca. Cada uno tiene su postura: lo que piensa y defiende. Escuchar bien es saber qué dijo cada uno, sin cruzarlos.' },
        { titulo: 'Palabras del debate', texto: 'En un debate se habla del punto común, lo que ambos aceptan, y de la cuestión disputada, el asunto de fondo que se discute. En el juego descubrirás dónde está cada uno.' },
        { titulo: 'Qué mirar al jugar', texto: 'Los textos A y B tratan del tráfico del centro. Lleva el círculo naranja por sus oraciones y mira los sellos junto a A y B. La cuestión tiene su propio botón.' },
      ],
    },
    juega: {
      consigna: 'Arrastra el círculo naranja por las oraciones de A y B: la postura de cada uno y el punto común. La cuestión, en su botón.',
      voz: 'Dos autores pueden coincidir en el dato y no en la propuesta.',
      controles: [{ id: 'k', etiqueta: 'Mirar', opciones: [{ valor: 'cuestion', texto: 'la cuestión' }, { valor: 'a', texto: 'A' }, { valor: 'b', texto: 'B' }, { valor: 'comun', texto: 'lo común' }] }],
      dibujo: val => ({ datos: figAB(), estado: { marcas: MIRA[val.k].marcas, sellos: MIRA[val.k].sellos } }),
      lectura: val => [corto(val.k === 'comun' ? razon : val.k === 'cuestion' ? cuestion : tesis, MIRA[val.k].dice)],
      minimo: 4,
      // La cuestión no está escrita en ninguna oración: es la pregunta detrás de a2 y b2. Con ella elegida, la manija
      // descansa en la propuesta de A; al moverla, se elige la oración bajo el dedo.
      arrastres: [{
        id: 'frase', etiqueta: 'círculo de la oración de A o de B', color: 'c-o',
        donde: val => RV().ancla(figAB(), { cuestion: 'a2', a: 'a2', b: 'b2', comun: 'b1' }[val.k]),
        mover: pt => ({ k: { a1: 'comun', b1: 'comun', a2: 'a', b2: 'b' }[RV().cercana(figAB(), pt, ['a1', 'a2', 'b1', 'b2'])] }),
      }],
    },
    predice: {
      pregunta: '¿Cuál es la cuestión que discuten los textos A y B sobre el huerto escolar?',
      opciones: opciones('Si conviene tener un huerto en el colegio', [
        ['Que el huerto enseña ciencias', 'RV60', 'Es la postura de A, no la pregunta que se discute.'],
        ['Que los alumnos deben comer sano', 'RV61', 'En eso coinciden; la discusión está en otra parte.'],
        ['Que el huerto quita horas de clase', 'RV60', 'Es el argumento de B, no la cuestión.'],
      ]),
      dibujo: { datos: { esquinaLibre: true, secciones: [lista('Texto A', ['Los alumnos deben comer sano.', 'Un huerto en el colegio enseña ciencias y da verduras.'], 'A', 'a'), lista('Texto B', ['Comer sano es importante, sin duda.', 'Pero el huerto quita horas de clase; mejor un convenio con la feria.'], 'B', 'b')] }, estado: {} },
      revelar: { datos: { esquinaLibre: true, secciones: [lista('Texto A', ['Los alumnos deben comer sano.', 'Un huerto en el colegio enseña ciencias y da verduras.'], 'A', 'a'), lista('Texto B', ['Comer sano es importante, sin duda.', 'Pero el huerto quita horas de clase; mejor un convenio con la feria.'], 'B', 'b')] }, estado: { marcas: { a1: 'i', b1: 'i', a2: 'o', b2: 'o' }, sellos: { A: { t: 'Sí al huerto', c: 'o' }, B: { t: 'No al huerto', c: 'o' } } } },
      coincide: 'Coincide: los dos quieren que coman sano; discuten si el huerto es el camino.',
    },
    mira: {
      datos: figAB(),
      pasos: [
        { estado: { marcas: { a1: 'i', b1: 'i' }, sellos: { A: { t: 'Coinciden', c: 'i' }, B: { t: 'Coinciden', c: 'i' } } }, texto: 'A y B aceptan el mismo dato: el tráfico creció.', ecuacion: [razon('dato común')] },
        { estado: { marcas: { a1: 'i', b1: 'i', a2: 'o', b2: 'o' }, nuevo: ['a2', 'b2'] }, texto: 'Se oponen en la propuesta: prohibir autos o poner más buses.', ecuacion: [tesis('A: prohibir'), ' ≠ ', tesis('B: buses')] },
        { estado: { marcas: { a2: 'd', b2: 'd' }, sellos: { A: { t: '¿Qué hacer?', c: 'd' } } }, texto: 'La cuestión es la pregunta que los dos responden distinto.', ecuacion: [cuestion('¿qué hacer con el tráfico?')] },
      ],
    },
    regla: {
      texto: 'La cuestión disputada es la pregunta que los autores responden distinto. Cada postura va con su autor; pueden coincidir en los datos y no en la propuesta.',
      ecuacion: [{ llave: [cuestion('cuestión')], nota: 'la pregunta', color: 'c-d' }, ' → ', tesis('postura A'), ' ≠ ', tesis('postura B')],
      condicion: 'la cuestión se formula como pregunta neutral, sin tomar partido; la tesis de uno no es la cuestión.',
    },
    // Así se resuelve (fase 2): el mismo tipo de «Ahora tú» (cuestión, punto común o postura en un debate A/B), con un
    // banco propio. marcas y sellos: lo que se marca al resolver, como en MIRA.
    resuelve: {
      generar(s) {
        const RES = [
          { tema: 'la sombra en la plaza', a: ['La plaza necesita más sombra.', 'Hay que plantar árboles nativos, como la queñua.'], b: ['Sí, falta sombra en la plaza.', 'Pero los árboles tardan años en crecer; mejor toldos ya.'], pide: 'cuestión',
            ok: 'Cómo dar sombra a la plaza', m: [['Que la plaza necesita sombra', 'RV61', 'En eso coinciden: no es lo que discuten.'], ['Que hay que plantar queñuas', 'RV60', 'Es la postura de A, no la pregunta.'], ['Que los árboles tardan años', 'RV60', 'Es el argumento de B.']],
            marcas: { a1: 'i', b1: 'i', a2: 'd', b2: 'd' }, sellos: { A: { t: '¿Cómo dar sombra?', c: 'd' } },
            aplica: 'Los dos aceptan que falta sombra. Se separan en el cómo: árboles o toldos. La pregunta que responden distinto es la cuestión.' },
          { tema: 'la biblioteca del colegio', a: ['Pocos alumnos usan la biblioteca.', 'Debe abrir también los sábados.'], b: ['Es verdad que pocos la usan.', 'Pero abrir más días no basta; primero hay que comprar libros nuevos.'], pide: 'punto común',
            ok: 'Que pocos alumnos usan la biblioteca', m: [['Que debe abrir los sábados', 'RV59', 'Eso lo propone A; B dice que no basta.'], ['Que hay que comprar libros nuevos', 'RV59', 'Eso lo propone B.'], ['Que la biblioteca debe cerrarse', 'RV7', 'Ninguno de los dos lo dice.']],
            marcas: { a1: 'i', b1: 'i' }, sellos: { A: { t: 'Coinciden', c: 'i' }, B: { t: 'Coinciden', c: 'i' } },
            aplica: 'B empieza con «es verdad que pocos la usan»: acepta el dato de A. Luego propone otra cosa. El punto común es ese dato.' },
          { tema: 'el agua del barrio', a: ['El agua llega solo unas horas al día.', 'La municipalidad debe construir un reservorio nuevo.'], b: ['El agua llega pocas horas, cierto.', 'Pero se pierde en tuberías rotas; primero hay que repararlas.'], pide: 'postura de A',
            ok: 'Que se construya un reservorio nuevo', m: [['Que primero se reparen las tuberías', 'RV59', 'Esa es la postura de B, no la de A.'], ['Que el agua llega pocas horas', 'RV61', 'Ahí coinciden: no distingue a A.'], ['Que el agua se pierde en tuberías', 'RV59', 'Eso lo dice B.']],
            marcas: { a2: 'o' }, sellos: { A: { t: 'Postura de A', c: 'o' } },
            aplica: 'La primera oración de A es un dato que B también acepta. Lo que A propone, y B no, está en la segunda: el reservorio.' },
          { tema: 'la feria de la avenida', a: ['La feria atrae a mucha gente.', 'Debe quedarse en la avenida principal.'], b: ['Atrae a mucha gente, sin duda.', 'Pero cierra el paso a las ambulancias; mejor llevarla al campo ferial.'], pide: 'postura de B',
            ok: 'Que la feria se lleve al campo ferial', m: [['Que se quede en la avenida', 'RV59', 'Esa es la postura de A.'], ['Que atrae a mucha gente', 'RV61', 'Ahí coinciden: no distingue a B.'], ['Que la feria se suspenda', 'RV7', 'B no dice eso: propone otro lugar.']],
            marcas: { b2: 'o' }, sellos: { B: { t: 'Postura de B', c: 'o' } },
            aplica: 'B acepta el dato de A con «sin duda». Su propuesta llega después del «pero»: llevar la feria al campo ferial.' },
        ];
        const b = elige(RES, s);
        const pideTxt = b.pide === 'cuestión' ? 'la cuestión que discuten' : b.pide === 'punto común' ? 'el punto en que coinciden' : `la ${b.pide}`;
        const fig = (estado) => ({ datos: { esquinaLibre: true, secciones: [lista('Texto A', b.a, 'A', 'a'), lista('Texto B', b.b, 'B', 'b')] }, estado });
        return {
          enunciado: `A y B debaten sobre ${b.tema}. ¿Cuál es ${pideTxt}?`,
          dibujo: fig({}),
          pasos: [
            { tipo: 'pide', texto: `Piden ${pideTxt}. Antes de elegir, separo lo que dice cada autor.` },
            { tipo: 'datos', texto: 'Cada texto tiene dos oraciones: en la primera, un dato; en la segunda, lo que su autor propone.', ecuacion: [tesis('A'), '   ·   ', tesis('B')] },
            { tipo: 'regla', texto: 'Cada postura va con su autor. Lo que los dos aceptan es el punto común; la pregunta que responden distinto es la cuestión.',
              ecuacion: [razon('punto común'), '   ·   ', cuestion('cuestión'), '   ·   ', tesis('postura')] },
            { tipo: 'aplica', texto: b.aplica, dibujo: fig({ marcas: b.marcas, sellos: b.sellos, nuevo: Object.keys(b.marcas).concat(Object.keys(b.sellos)) }) },
            { tipo: 'sentido', texto: descarta(b.m) },
          ],
          respuesta: b.ok,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const B = [
          { a: ['Las tareas ayudan a practicar.', 'Deben dejarse todos los días.'], b: ['Practicar es necesario.', 'Pero tareas diarias quitan descanso; mejor tres por semana.'], pide: 'cuestión', ok: 'Con qué frecuencia dejar tareas', m: [['Que las tareas ayudan a practicar', 'RV61', 'En eso coinciden.'], ['Que deben dejarse todos los días', 'RV60', 'Es la postura de A.'], ['Que hay que descansar', 'RV60', 'Es el argumento de B.']] },
          { a: ['El turismo crece en Cusco.', 'Trae empleo y debe crecer más.'], b: ['El turismo creció, es verdad.', 'Pero encarece las viviendas; hay que ponerle límites.'], pide: 'punto común', ok: 'Que el turismo en Cusco creció', m: [['Que trae empleo', 'RV59', 'Eso lo dice A; B no lo discute ni lo afirma.'], ['Que hay que ponerle límites', 'RV59', 'Eso lo dice B.'], ['Que debe crecer más', 'RV59', 'Eso lo dice A.']] },
          { a: ['Los uniformes evitan diferencias.', 'Deben ser obligatorios.'], b: ['Evitar diferencias es bueno.', 'Pero los uniformes son caros; que sean opcionales.'], pide: 'postura de B', ok: 'Que el uniforme sea opcional', m: [['Que sea obligatorio', 'RV59', 'Esa es la postura de A.'], ['Que evitar diferencias es bueno', 'RV61', 'Ahí coinciden: no es lo que distingue a B.'], ['Que no haya uniformes', 'RV7', 'B no dice eso: dice opcionales.']] },
          { a: ['La minería trae inversión.', 'Debe ampliarse en la región.'], b: ['La inversión es real.', 'Pero los ríos se contaminan; hay que controlarla antes de ampliarla.'], pide: 'cuestión', ok: 'Si se debe ampliar la minería en la región', m: [['Que la minería trae inversión', 'RV61', 'En eso coinciden.'], ['Que los ríos se contaminan', 'RV60', 'Es el argumento de B.'], ['Que debe ampliarse', 'RV60', 'Es la postura de A.']] },
          { a: ['Leer en pantalla es práctico.', 'Los textos escolares deben ser digitales.'], b: ['Es práctico, sí.', 'Pero en papel se recuerda mejor; mejor libros impresos.'], pide: 'postura de A', ok: 'Que los textos escolares sean digitales', m: [['Que sean impresos', 'RV59', 'Esa es la postura de B.'], ['Que leer en pantalla es práctico', 'RV61', 'Ahí coinciden.'], ['Que en papel se recuerda mejor', 'RV59', 'Eso lo dice B.']] },
        ];
        const b = B[s % B.length];
        return {
          pregunta: `En este debate entre A y B, ¿cuál es ${b.pide === 'cuestión' ? 'la cuestión que discuten' : b.pide === 'punto común' ? 'el punto en que coinciden' : `la ${b.pide}`}?`,
          dibujo: { datos: { esquinaLibre: true, secciones: [lista('Texto A', b.a, 'A', 'a'), lista('Texto B', b.b, 'B', 'b')] }, estado: {} },
          opciones: opciones(b.ok, voltear(b.m, s)),
          solucion: { texto: 'Se separa lo que comparten, lo que cada uno propone y la pregunta de fondo.', ecuacion: [cuestion('cuestión'), '   ·   ', tesis('A'), '   ·   ', tesis('B')] },
        };
      },
    },
  };

  // ---------- Idea 3: tesis, antítesis y síntesis ----------
  // Cambia: la propuesta de cierre. Permanece: la tesis y la antítesis. Progresa: qué cierre integra, cuál repite y
  // cuál inventa un acuerdo. Se reserva: el debate que no necesita síntesis (predicción). Debe verse: qué toma de cada lado.
  const TAS = { esquinaLibre: true, secciones: [
    { id: 't', titulo: 'Tesis', modo: 'tarjeta', fragmentos: [{ id: 't1', t: 'El celular debe prohibirse en clase: distrae.' }] },
    { id: 'a', titulo: 'Antítesis', modo: 'tarjeta', fragmentos: [{ id: 'a1', t: 'El celular debe permitirse: es una herramienta.' }] },
  ] };
  const CIERRE = {
    integra: { t: 'Se usa en clase solo para tareas guiadas por el profesor.', marcas: { t1: 'i', a1: 'i', s1: 'o' }, sello: ['Integra las dos', 'i'], dice: 'Toma algo de cada lado' },
    repite: { t: 'El celular debe prohibirse en clase.', marcas: { t1: 'i', a1: 'h', s1: 'h' }, sello: ['Repite la tesis', 'h'], dice: 'Repite la tesis: borra la antítesis' },
    junta: { t: 'El celular distrae y es una herramienta.', marcas: { t1: 'd', a1: 'd', s1: 'd' }, sello: ['Solo las junta', 'd'], dice: 'Junta las dos sin resolver nada' },
  };
  const figTAS = k => ({ esquinaLibre: true, secciones: [...TAS.secciones, { id: 's', titulo: 'Síntesis', modo: 'tarjeta', fragmentos: [{ id: 's1', t: CIERRE[k].t }] }] });
  const dialectica = {
    id: 'tesis-antitesis-sintesis',
    titulo: 'Tesis, antítesis y síntesis',
    temas: ['Tesis, antítesis y síntesis'],
    pieza: 'rv-texto',
    // Lee (fase 2): tesis, antítesis y síntesis con un caso de barrio, sin decir si todo debate debe cerrar así (Predice).
    lee: {
      tarjetas: [
        { titulo: 'Dos posturas opuestas', texto: 'En una junta vecinal, unos quieren cerrar la calle los domingos para la feria y otros quieren dejarla abierta. A la primera postura se le puede llamar tesis; a la que la contradice, antítesis.' },
        { titulo: 'Una tercera propuesta', texto: 'Una propuesta nueva que recoge algo válido de cada lado se llama síntesis. Un texto que pone a dialogar posturas opuestas se llama dialéctico.' },
        { titulo: 'Qué mirar al jugar', texto: 'En el juego, la tesis y la antítesis hablan del celular en clase. Prueba los cierres A, B y C, y mira qué sello recibe la tarjeta de síntesis.' },
      ],
    },
    juega: {
      consigna: 'Una tesis y su antítesis sobre el celular. Prueba tres cierres y mira cuál toma algo válido de cada lado.',
      voz: 'Sintetizar no es elegir un ganador ni pegar las dos.',
      // Sin arrastre: lo que cambia es la tarjeta de síntesis entera; no hay una parte del texto que agarrar.
      controles: [{ id: 'k', etiqueta: 'Cierre', opciones: [{ valor: 'integra', texto: 'A' }, { valor: 'repite', texto: 'B' }, { valor: 'junta', texto: 'C' }] }],
      dibujo: val => ({ datos: figTAS(val.k), estado: { marcas: CIERRE[val.k].marcas, sellos: { s: { t: CIERRE[val.k].sello[0], c: CIERRE[val.k].sello[1] } } } }),
      lectura: val => [corto(CIERRE[val.k].sello[1] === 'h' ? objecion : CIERRE[val.k].sello[1] === 'd' ? cuestion : razon, CIERRE[val.k].dice)],
      minimo: 3,
    },
    predice: {
      pregunta: 'Dos autores discuten si un río debe tener represa, y cada uno da buenas razones. ¿El texto tiene que terminar en una síntesis?',
      opciones: opciones('No: puede cerrar con un desacuerdo razonado', [
        ['Sí: todo debate termina en síntesis', 'RVD5', 'Muchos debates la buscan, pero también es válido mostrar el desacuerdo.'],
        ['Sí: si no, el texto está incompleto', 'RVD5', 'Un texto dialéctico puede presentar posturas sin conciliarlas.'],
        ['No: gana el que habla último', 'RV33', 'El orden no decide quién tiene razón.'],
      ]),
      dibujo: { datos: { esquinaLibre: true, secciones: [{ id: 't', titulo: 'Autor A', modo: 'tarjeta', fragmentos: [{ id: 't1', t: 'La represa dará agua para riego todo el año.' }] }, { id: 'a', titulo: 'Autor B', modo: 'tarjeta', fragmentos: [{ id: 'a1', t: 'La represa inundará tierras de cultivo.' }] }] }, estado: {} },
      revelar: { datos: { esquinaLibre: true, secciones: [{ id: 't', titulo: 'Autor A', modo: 'tarjeta', fragmentos: [{ id: 't1', t: 'La represa dará agua para riego todo el año.' }] }, { id: 'a', titulo: 'Autor B', modo: 'tarjeta', fragmentos: [{ id: 'a1', t: 'La represa inundará tierras de cultivo.' }] }] }, estado: { marcas: { t1: 'o', a1: 'o' }, sellos: { t: { t: 'Razonable', c: 'i' }, a: { t: 'Razonable', c: 'i' } } } },
      coincide: 'Coincide: un debate puede quedar abierto si ambas posturas tienen razones.',
    },
    mira: {
      datos: figTAS('integra'),
      pasos: [
        { estado: { marcas: { t1: 'o' }, tapar: ['s1'] }, texto: 'La tesis: prohibir, porque distrae.', ecuacion: [tesis('tesis')] },
        { estado: { marcas: { t1: 'o', a1: 'o' }, tapar: ['s1'], nuevo: ['a1'] }, texto: 'La antítesis: permitir, porque es herramienta.', ecuacion: [tesis('tesis'), ' ↔ ', tesis('antítesis')] },
        { estado: { marcas: CIERRE.integra.marcas, sellos: { s: { t: 'Integra las dos', c: 'i' } }, nuevo: ['s1'] }, texto: 'La síntesis toma lo válido de cada una: usarlo, pero guiado.', ecuacion: [razon('lo válido de A'), ' + ', razon('lo válido de B'), ' → síntesis'] },
      ],
    },
    regla: {
      texto: 'En la secuencia tesis, antítesis y síntesis, la síntesis integra lo válido de cada postura en una nueva. No repite una ni las pega; y no todo debate termina así.',
      ecuacion: [tesis('tesis'), ' + ', tesis('antítesis'), ' → ', { llave: [razon('síntesis')], nota: 'integra ambas', color: 'c-i' }],
      condicion: 'la síntesis responde a las razones de ambos lados; si no hay cómo integrarlas, el desacuerdo razonado también es un cierre.',
    },
    // Así se resuelve (fase 2): el mismo tipo de «Ahora tú» (elegir la síntesis), con un banco propio. dt y da: la razón
    // válida de cada lado, que la síntesis tiene que recoger.
    resuelve: {
      generar(s) {
        const RES = [
          { tema: 'la hora de salida', t: 'La salida debe ser a la una: los alumnos llegan cansados a la tarde.', a: 'La salida debe ser a las tres: falta tiempo para repasar.', dt: 'el descanso', da: 'el repaso',
            ok: 'Salir a la una y abrir talleres de repaso voluntarios por la tarde', m: [['Salir a la una y a las tres a la vez', 'RV9', 'Junta las dos sin resolver: se contradice.'], ['La salida debe ser a la una', 'RVD5', 'Repite la tesis: borra la razón del otro lado.'], ['La salida debe ser a las tres', 'RVD5', 'Repite la antítesis.']] },
          { tema: 'los perros de la calle', t: 'Los perros de la calle deben recogerse: muerden y ensucian.', a: 'Hay que dejarlos libres: son seres vivos que sienten.', dt: 'la seguridad', da: 'el cuidado del animal',
            ok: 'Recogerlos en un albergue que los cuide y los dé en adopción', m: [['Deben recogerse de la calle', 'RVD5', 'Repite la tesis: no dice nada del cuidado del animal.'], ['Hay que dejarlos libres', 'RVD5', 'Repite la antítesis.'], ['Recogerlos y dejarlos libres a la vez', 'RV9', 'Junta las dos: se contradice.']] },
          { tema: 'la pesca en el lago', t: 'Hay que pescar todo el año: muchas familias viven del lago.', a: 'Hay que prohibir la pesca: los peces se están acabando.', dt: 'el sustento de las familias', da: 'la vida de los peces',
            ok: 'Pescar casi todo el año y parar en la época de cría', m: [['Pescar siempre y prohibir la pesca', 'RV9', 'Junta las dos frases: se contradice.'], ['Hay que pescar todo el año', 'RVD5', 'Repite la tesis.'], ['Hay que prohibir la pesca', 'RVD5', 'Repite la antítesis.']] },
          { tema: 'los exámenes', t: 'Los exámenes deben quedarse: muestran cuánto se aprendió.', a: 'Los exámenes deben eliminarse: causan mucho miedo.', dt: 'la medida de lo aprendido', da: 'la calma de los alumnos',
            ok: 'Exámenes cortos y frecuentes, que cuenten menos cada uno', m: [['Los exámenes deben quedarse', 'RVD5', 'Repite la tesis: no atiende al miedo.'], ['Los exámenes deben eliminarse', 'RVD5', 'Repite la antítesis.'], ['Que haya y no haya exámenes', 'RV9', 'Las junta: se contradice.']] },
        ];
        const b = elige(RES, s);
        const tarjetas = [{ id: 't', titulo: 'Tesis', modo: 'tarjeta', fragmentos: [{ id: 't1', t: b.t }] }, { id: 'a', titulo: 'Antítesis', modo: 'tarjeta', fragmentos: [{ id: 'a1', t: b.a }] }];
        return {
          enunciado: `Debate sobre ${b.tema}. ¿Qué propuesta funciona como síntesis de la tesis y la antítesis?`,
          dibujo: { datos: { esquinaLibre: true, secciones: tarjetas }, estado: {} },
          pasos: [
            { tipo: 'pide', texto: 'Piden la propuesta que cierra este debate como síntesis entre la tesis y la antítesis.' },
            { tipo: 'datos', texto: `La tesis cuida ${b.dt}; la antítesis, ${b.da}. Cada lado trae una razón que vale la pena conservar.`, ecuacion: [tesis(b.dt), ' ↔ ', tesis(b.da)] },
            { tipo: 'regla', texto: 'Una síntesis no elige ganador ni pega las dos frases: arma una propuesta nueva que respete la razón de cada lado.',
              ecuacion: [tesis('tesis'), ' + ', tesis('antítesis'), ' → ', razon('síntesis')] },
            { tipo: 'aplica', texto: `«${b.ok}» atiende ${b.dt} y ${b.da}: recoge la razón de cada lado.`,
              dibujo: { datos: { esquinaLibre: true, secciones: [...tarjetas, { id: 's', titulo: 'Síntesis', modo: 'tarjeta', fragmentos: [{ id: 's1', t: b.ok }] }] }, estado: { marcas: { t1: 'i', a1: 'i', s1: 'o' }, sellos: { s: { t: 'Integra las dos', c: 'i' } }, nuevo: ['t1', 'a1', 's1', 's'] } } },
            { tipo: 'sentido', texto: descarta(b.m) },
          ],
          respuesta: b.ok,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const B = [
          { t: 'Las tareas deben ser diarias para practicar.', a: 'Las tareas deben eliminarse para descansar.', ok: 'Tareas breves algunos días, para practicar sin agotar', m: [['Las tareas deben ser diarias', 'RVD5', 'Repite la tesis: borra la antítesis.'], ['Las tareas deben eliminarse', 'RVD5', 'Repite la antítesis.'], ['Las tareas son diarias y se eliminan', 'RV9', 'Junta las dos: se contradice.']] },
          { t: 'El turismo debe crecer: trae empleo.', a: 'El turismo debe frenarse: encarece la vida.', ok: 'Que crezca con límites que cuiden la vivienda local', m: [['El turismo debe crecer', 'RVD5', 'Repite la tesis.'], ['El turismo debe frenarse', 'RVD5', 'Repite la antítesis.'], ['El turismo crece y se frena', 'RV9', 'Junta las dos sin resolver: se contradice.']] },
          { t: 'Los textos deben ser digitales: son prácticos.', a: 'Los textos deben ser impresos: se recuerdan mejor.', ok: 'Impresos para estudiar y digitales para consultar', m: [['Los textos deben ser digitales', 'RVD5', 'Repite la tesis.'], ['Los textos deben ser impresos', 'RVD5', 'Repite la antítesis.'], ['Deben ser digitales e impresos a la vez', 'RV9', 'Las junta sin decir cómo.']] },
          { t: 'Hay que construir la carretera: une a los pueblos.', a: 'No hay que construirla: corta el bosque.', ok: 'Construirla por el trazo que corte menos bosque', m: [['Hay que construir la carretera', 'RVD5', 'Repite la tesis.'], ['No hay que construirla', 'RVD5', 'Repite la antítesis.'], ['Se construye y no se construye', 'RV9', 'Junta las dos: se contradice.']] },
          { t: 'La feria debe ser diaria: más ventas.', a: 'La feria debe ser semanal: menos basura.', ok: 'Dos días por semana, con limpieza organizada', m: [['La feria debe ser diaria', 'RVD5', 'Repite la tesis.'], ['La feria debe ser semanal', 'RVD5', 'Repite la antítesis.'], ['Diaria y semanal a la vez', 'RV9', 'Junta las dos: se contradice.']] },
        ];
        const b = B[s % B.length];
        return {
          pregunta: '¿Qué propuesta funciona como síntesis de la tesis y la antítesis?',
          dibujo: { datos: { esquinaLibre: true, secciones: [{ id: 't', titulo: 'Tesis', modo: 'tarjeta', fragmentos: [{ id: 't1', t: b.t }] }, { id: 'a', titulo: 'Antítesis', modo: 'tarjeta', fragmentos: [{ id: 'a1', t: b.a }] }] }, estado: {} },
          opciones: opciones(b.ok, voltear(b.m, s)),
          solucion: { texto: 'Toma una razón válida de cada lado en una propuesta nueva.', ecuacion: [tesis('tesis'), ' + ', tesis('antítesis'), ' → ', razon('síntesis')] },
        };
      },
    },
  };

  // ---------- Laboratorio: el debate que se arma ----------
  // Lo que la idea 2 deja fijo: qué dice B. Aquí B acepta o niega el dato y propone lo mismo que A u otra cosa.
  // El código decide qué se discute: si difieren en el dato, hay cuestión de hecho; si difieren en la propuesta,
  // cuestión de qué hacer; si en nada, no hay debate. El marcador elige la fila (dato o propuesta) y el sello de B
  // dice si en esa fila coinciden o se oponen.
  const B_DATO = { acepta: 'Es cierto: el tráfico del centro creció.', niega: 'No es cierto: el tráfico del centro no creció.' };
  const B_PROP = { prohibir: 'Igual que A, propongo prohibir los autos los domingos.', buses: 'Propongo otra cosa: más buses, sin prohibir autos.' };
  const figDeb = val => ({ esquinaLibre: true, secciones: [lista('Texto A', A, 'A', 'a'), lista('Texto B', [B_DATO[val.dato], B_PROP[val.prop]], 'B', 'b')] });
  const difiere = val => ({ 1: val.dato === 'niega', 2: val.prop === 'buses' });
  const tipoDebate = val => {
    const d = difiere(val);
    if (d[1] && d[2]) return 'Discuten el dato y qué hacer';
    if (d[1]) return 'Discuten el dato, no qué hacer';
    if (d[2]) return 'Discuten qué hacer, no el dato';
    return 'No hay debate: coinciden';
  };
  const mesaDebate = {
    id: 'debate-armado', titulo: 'Arma el debate', pieza: 'rv-texto',
    consigna: 'Decide si B acepta el dato de A y qué propone. Arrastra el círculo naranja a una fila: ¿coinciden o se oponen?',
    voz: 'La cuestión está donde las posturas se separan.',
    controles: [
      { id: 'dato', etiqueta: 'B y el dato', opciones: [{ valor: 'acepta', texto: 'lo acepta' }, { valor: 'niega', texto: 'lo niega' }] },
      { id: 'prop', etiqueta: 'B propone', opciones: [{ valor: 'buses', texto: 'otra cosa' }, { valor: 'prohibir', texto: 'lo mismo' }] },
      { id: 'f', etiqueta: 'Fila', opciones: [{ valor: '1', texto: 'dato' }, { valor: '2', texto: 'propuesta' }] },
    ],
    dibujo: val => {
      const d = difiere(val), m = {};
      [1, 2].forEach(n => { const c = d[n] ? 'o' : 'i'; m[`a${n}`] = c; m[`b${n}`] = c; });
      return { datos: figDeb(val), estado: { marcas: m, sellos: { B: d[val.f] ? { t: 'Se oponen aquí', c: 'o' } : { t: 'Coinciden aquí', c: 'i' } }, nuevo: [`a${val.f}`, `b${val.f}`] } };
    },
    lectura: val => { const t = tipoDebate(val); return [corto(t.startsWith('No hay') ? razon : cuestion, t)]; },
    arrastres: [{
      id: 'fila', etiqueta: 'círculo de la fila', color: 'c-o',
      donde: val => RV().ancla(figDeb(val), `b${val.f}`),
      mover: (pt, val) => ({ f: RV().cercana(figDeb(val), pt, ['a1', 'a2', 'b1', 'b2']).slice(1) }),
    }],
    // Retos: logrado usa difiere y tipoDebate, las mismas funciones que pintan las filas y la lectura.
    invitaciones: [
      { texto: 'Arma un debate en el que A y B no tengan nada que discutir.',
        logrado: val => { const d = difiere(val); return !d[1] && !d[2]; },
        bien: 'Si coinciden en dato y propuesta, no hay cuestión: solo hay acuerdo.' },
      { texto: 'Haz que A y B discutan el dato, pero no qué hacer.',
        logrado: val => { const d = difiere(val); return d[1] && !d[2]; },
        bien: 'Proponen lo mismo partiendo de hechos distintos. ¿Qué tendrían que comprobar?' },
      { texto: 'Con B aceptando el dato, deja el círculo en la fila donde se oponen.',
        logrado: val => val.dato === 'acepta' && difiere(val)[val.f],
        bien: 'Ahí está la cuestión: en la propuesta, no en el dato.' },
      { texto: 'Guarda dos debates que discutan cuestiones distintas.',
        logrado: (val, guardados) => { const hay = v => difiere(v)[1] || difiere(v)[2];
          return hay(val) && guardados.some(g => hay(g) && tipoDebate(g) !== tipoDebate(val)); },
        bien: 'Cambia lo que se discute según dónde se separan las posturas.' },
    ],
  };

  return {
    unidad: 'razonamiento-verbal.textos-argumentativos-y-dialecticos',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rv-texto.js'],
    historia: {
      texto: 'La Retórica de Aristóteles estudió cómo se persuade en la discusión pública y en los juicios: con razones, con la imagen de quien habla y con la disposición de quien escucha. Su análisis permite separar la fuerza de un discurso de la calidad de sus razones. Un debate no siempre termina en acuerdo.',
      pregunta: '¿Convencer es lo mismo que tener buenas razones?',
      fuente: { titulo: 'Matriz de teoría de razonamiento verbal (Aristóteles, Retórica)', url: 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/diccio_ele/diccionario/txtargumentativo.htm' },
    },
    glosario: [
      { termino: 'tesis', def: 'Idea que el autor defiende en un texto y que busca que el lector acepte.',
        formas: ['tesis'], ejemplo: 'En el texto del celular: bien usado, es una herramienta valiosa.', ver: ['argumento', 'postura', 'antítesis'] },
      { termino: 'argumento', def: 'Razón que el autor da para que se acepte lo que defiende.',
        formas: ['argumento', 'argumentos'], ejemplo: '«Permite buscar datos al instante» apoya usar el celular en clase.', ver: ['tesis', 'objeción'] },
      { termino: 'antítesis', def: 'Postura opuesta a otra, que responde la misma pregunta de manera contraria.',
        formas: ['antítesis'], ejemplo: 'Frente a «prohibir el celular», la contraria es «permitirlo».', ver: ['tesis', 'síntesis'] },
      { termino: 'postura', def: 'Lo que alguien piensa y defiende sobre un asunto que se discute.',
        formas: ['postura', 'posturas'], ver: ['tesis', 'debate'] },
      { termino: 'objeción', def: 'Idea en contra de la tesis; el autor puede citarla para responderla, sin hacerla suya.',
        formas: ['objeción', 'objeciones'], ejemplo: '«Algunos dicen que el celular solo distrae»: el autor lo cita para rebatirlo.', ver: ['tesis', 'argumento'] },
      { termino: 'cuestión disputada', def: 'Pregunta de fondo que dos o más autores responden de manera distinta.',
        formas: ['cuestión disputada', 'cuestión'], ejemplo: 'A y B discuten: ¿qué hacer con el tráfico del centro?', ver: ['debate', 'punto común'] },
      { termino: 'debate', def: 'Discusión en la que posturas distintas sobre un mismo asunto se enfrentan con razones.',
        formas: ['debate', 'debates'], ver: ['postura', 'cuestión disputada'] },
      { termino: 'punto común', def: 'Lo que dos autores aceptan, aunque discutan otra cosa.',
        formas: ['punto común', 'puntos comunes'], ejemplo: 'A y B aceptan que el tráfico creció; discrepan en qué hacer.', ver: ['cuestión disputada'] },
      { termino: 'dialéctico', def: 'Que presenta posturas opuestas sobre un asunto y las hace dialogar, con acuerdo final o sin él.',
        formas: ['dialéctico', 'dialéctica', 'dialécticos', 'dialécticas'], ver: ['tesis', 'antítesis', 'síntesis'] },
      { termino: 'desacuerdo razonado', def: 'Cierre de un debate en que cada postura queda clara con sus razones, sin acuerdo.',
        ejemplo: 'Represa sí o no: cada autor muestra sus razones y no se concilian.', ver: ['debate', 'síntesis'] },
    ],
    laboratorio: [
      mesaDebate,
      Object.assign({
        id: 'tesis-razones', titulo: 'El texto del celular', pieza: 'rv-texto',
        // Retos: logrado lee ROL, lo mismo que pone el sello del papel de cada oración.
        invitaciones: [
          { texto: 'Lleva el círculo a la oración que dice lo que el autor defiende.',
            logrado: val => ROL[val.k][0].startsWith('Tesis'),
            bien: '«Sin embargo» abre la voz del autor. Lo de antes era de otros.' },
          { texto: 'Busca la oración que retoma la tesis al final.',
            logrado: val => ROL[val.k][0].startsWith('Conclusión'),
            bien: '«Por eso» vuelve a la tesis y responde la objeción del inicio.' },
          { texto: 'Guarda dos oraciones distintas que cumplan el mismo papel en el texto.',
            logrado: (val, guardados) => guardados.some(g => g.k !== val.k && ROL[g.k][1] === ROL[val.k][1]),
            bien: 'Mismo papel, distinto contenido. Señala qué frase permite sostenerlo.' },
          { texto: 'Guarda la objeción y la oración que la responde.',
            logrado: (val, guardados) => { const es = (v, r) => ROL[v.k][0].startsWith(r);
              return (es(val, 'Objeción') && guardados.some(g => es(g, 'Conclusión'))) || (es(val, 'Conclusión') && guardados.some(g => es(g, 'Objeción'))); },
            bien: 'Prohibir frente a enseñar a usarlo: el autor cita para contestar.' },
        ],
      }, tesisRazones.juega),
      Object.assign({
        id: 'cuestion', titulo: 'El debate del tráfico', pieza: 'rv-texto',
        // Retos: logrado lee MIRA, lo mismo que marca las oraciones y pone los sellos de A y de B.
        invitaciones: [
          { texto: 'Marca las oraciones en que A y B coinciden.',
            logrado: val => !!(MIRA[val.k].sellos.A && MIRA[val.k].sellos.B),
            bien: 'Comparten el dato. Coincidir en algo no cierra la discusión.' },
          { texto: 'Pon el círculo en la propuesta de B.',
            logrado: val => !!MIRA[val.k].sellos.B && !MIRA[val.k].sellos.A,
            bien: 'Más buses, sin prohibir: esa es la postura de B, no la de A.' },
          { texto: 'Guarda la postura de A y la de B para compararlas.',
            logrado: (val, guardados) => { const postura = v => Object.values(MIRA[v.k].marcas).includes('o');
              return postura(val) && guardados.some(g => g.k !== val.k && postura(g)); },
            bien: 'Responden distinto a la misma pregunta: ¿qué hacer con el tráfico?' },
        ],
      }, debate.juega),
    ],
    ideas: [tesisRazones, debate, dialectica],
  };
});
