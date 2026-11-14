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
  const razon = t => ({ v: 'c-i', t }), tesis = t => ({ v: 'c-o', t }), cuestion = t => ({ v: 'c-d', t }), objecion = t => ({ v: 'c-h', t });
  const opciones = (c, malas) => [{ id: 'c', texto: c, correcta: true }, ...malas.map(([texto, error, siFuera], k) => ({ id: `e${k}`, texto, error, siFuera }))];
  const voltear = (arr, s) => (s % 2 ? arr.slice().reverse() : arr.slice());
  const lista = (titulo, ors, id = 'o', pre = 'o') => ({ id, titulo, modo: 'lista', fragmentos: ors.map((t, k) => ({ id: `${pre}${k + 1}`, t })) });

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
    juega: {
      consigna: 'Marca cada oración del texto y mira qué papel cumple: tesis, razón, conclusión u objeción que el autor responde.',
      voz: 'No todo lo que aparece en el texto lo defiende el autor.',
      controles: [{ id: 'k', etiqueta: 'Marca', opciones: [1, 2, 3, 4, 5].map(k => ({ valor: k, texto: `${k}` })) }],
      dibujo: val => ({ datos: { secciones: [lista('Texto', CEL)] }, estado: { marcas: { [`o${val.k}`]: ROL[val.k][1] }, sellos: { o: { t: ROL[val.k][0].split(':')[0], c: ROL[val.k][1] } } } }),
      lectura: val => [corto(ROL[val.k][1] === 'h' ? objecion : ROL[val.k][1] === 'o' ? tesis : razon, ROL[val.k][0])],
      minimo: 3,
    },
    predice: {
      pregunta: '¿Cuál es la tesis del autor en este texto sobre los uniformes?',
      voz: 'Busca lo que el autor sostiene, no lo que cita.',
      opciones: opciones('El uniforme ayuda a que nadie se sienta menos', [
        ['El uniforme quita libertad a los alumnos', 'RV53', 'El autor lo cita para responderlo: no es su postura.'],
        ['Algunos padres lo encuentran caro', 'RV42', 'Es un detalle que el autor reconoce, no su tesis.'],
        ['Los alumnos deben opinar', 'RV7', 'El texto no lo dice.'],
      ]),
      dibujo: { datos: { secciones: [lista('Texto', ['Se dice que el uniforme quita libertad a los alumnos.', 'Es cierto que algunos padres lo encuentran caro.', 'Pero el uniforme ayuda a que nadie se sienta menos por su ropa.', 'Por eso, conviene mantenerlo.'])] }, estado: {} },
      revelar: { datos: { secciones: [lista('Texto', ['Se dice que el uniforme quita libertad a los alumnos.', 'Es cierto que algunos padres lo encuentran caro.', 'Pero el uniforme ayuda a que nadie se sienta menos por su ropa.', 'Por eso, conviene mantenerlo.'])] }, estado: { marcas: { o1: 'h', o2: 'i', o3: 'o', o4: 'o' }, sellos: { o: { t: 'Tesis: la 3', c: 'o' } } } },
      coincide: 'Coincide: «pero» marca la postura del autor frente a lo que se dice.',
    },
    mira: {
      datos: { secciones: [lista('Texto', CEL)] },
      pasos: [
        { estado: { marcas: { o1: 'h' } }, texto: '«Algunos dicen» cita una postura ajena: es una objeción.', ecuacion: [objecion('algunos dicen'), ' = otros'] },
        { estado: { marcas: { o1: 'h', o2: 'o' }, nuevo: ['o2'] }, texto: '«Sin embargo» abre la postura del autor: la tesis.', ecuacion: [tesis('sin embargo'), ' → tesis'] },
        { estado: { marcas: { o1: 'h', o2: 'o', o3: 'i', o4: 'i' }, nuevo: ['o3', 'o4'] }, texto: 'La 3 y la 4 dan razones para la tesis.', ecuacion: [razon('razones'), ' → ', tesis('tesis')] },
        { estado: { marcas: { o1: 'h', o2: 'o', o3: 'i', o4: 'i', o5: 'o' }, nuevo: ['o5'] }, texto: '«Por eso» cierra y responde la objeción: enseñar, no prohibir.', ecuacion: [tesis('conclusión'), ' responde a ', objecion('objeción')] },
      ],
    },
    regla: {
      texto: 'Un texto argumentativo defiende una tesis con razones. Puede citar una objeción para responderla: esa objeción no es la postura del autor.',
      ecuacion: [razon('razones'), ' → ', tesis('tesis'), ' ← responde a ', objecion('objeción')],
      condicion: 'marcas como «algunos dicen», «se cree» presentan a otros; «sin embargo», «pero» suelen abrir la postura del autor.',
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
          dibujo: { datos: { secciones: [lista('Texto', b.o)] }, estado: {} },
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
  const figAB = () => ({ secciones: [lista('Texto A', A, 'A', 'a'), lista('Texto B', Bt, 'B', 'b')] });
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
    juega: {
      consigna: 'Mira el debate entre A y B por partes: la cuestión que discuten, la postura de cada uno y el punto en que coinciden.',
      voz: 'Dos autores pueden coincidir en el dato y no en la propuesta.',
      controles: [{ id: 'k', etiqueta: 'Mirar', opciones: [{ valor: 'cuestion', texto: 'la cuestión' }, { valor: 'a', texto: 'A' }, { valor: 'b', texto: 'B' }, { valor: 'comun', texto: 'lo común' }] }],
      dibujo: val => ({ datos: figAB(), estado: { marcas: MIRA[val.k].marcas, sellos: MIRA[val.k].sellos } }),
      lectura: val => [corto(val.k === 'comun' ? razon : val.k === 'cuestion' ? cuestion : tesis, MIRA[val.k].dice)],
      minimo: 4,
    },
    predice: {
      pregunta: '¿Cuál es la cuestión que discuten los textos A y B sobre el huerto escolar?',
      opciones: opciones('Si conviene tener un huerto en el colegio', [
        ['Que el huerto enseña ciencias', 'RV60', 'Es la postura de A, no la pregunta que se discute.'],
        ['Que los alumnos deben comer sano', 'RV61', 'En eso coinciden; la discusión está en otra parte.'],
        ['Que el huerto quita horas de clase', 'RV60', 'Es el argumento de B, no la cuestión.'],
      ]),
      dibujo: { datos: { secciones: [lista('Texto A', ['Los alumnos deben comer sano.', 'Un huerto en el colegio enseña ciencias y da verduras.'], 'A', 'a'), lista('Texto B', ['Comer sano es importante, sin duda.', 'Pero el huerto quita horas de clase; mejor un convenio con la feria.'], 'B', 'b')] }, estado: {} },
      revelar: { datos: { secciones: [lista('Texto A', ['Los alumnos deben comer sano.', 'Un huerto en el colegio enseña ciencias y da verduras.'], 'A', 'a'), lista('Texto B', ['Comer sano es importante, sin duda.', 'Pero el huerto quita horas de clase; mejor un convenio con la feria.'], 'B', 'b')] }, estado: { marcas: { a1: 'i', b1: 'i', a2: 'o', b2: 'o' }, sellos: { A: { t: 'Sí al huerto', c: 'o' }, B: { t: 'No al huerto', c: 'o' } } } },
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
      ecuacion: [cuestion('cuestión'), ' → ', tesis('postura A'), ' ≠ ', tesis('postura B')],
      condicion: 'la cuestión se formula como pregunta neutral, sin tomar partido; la tesis de uno no es la cuestión.',
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
          dibujo: { datos: { secciones: [lista('Texto A', b.a, 'A', 'a'), lista('Texto B', b.b, 'B', 'b')] }, estado: {} },
          opciones: opciones(b.ok, voltear(b.m, s)),
          solucion: { texto: 'Se separa lo que comparten, lo que cada uno propone y la pregunta de fondo.', ecuacion: [cuestion('cuestión'), ' · ', tesis('A'), ' · ', tesis('B')] },
        };
      },
    },
  };

  // ---------- Idea 3: tesis, antítesis y síntesis ----------
  // Cambia: la propuesta de cierre. Permanece: la tesis y la antítesis. Progresa: qué cierre integra, cuál repite y
  // cuál inventa un acuerdo. Se reserva: el debate que no necesita síntesis (predicción). Debe verse: qué toma de cada lado.
  const TAS = { secciones: [
    { id: 't', titulo: 'Tesis', modo: 'tarjeta', fragmentos: [{ id: 't1', t: 'El celular debe prohibirse en clase: distrae.' }] },
    { id: 'a', titulo: 'Antítesis', modo: 'tarjeta', fragmentos: [{ id: 'a1', t: 'El celular debe permitirse: es una herramienta.' }] },
  ] };
  const CIERRE = {
    integra: { t: 'Se usa en clase solo para tareas guiadas por el profesor.', marcas: { t1: 'i', a1: 'i', s1: 'o' }, sello: ['Integra las dos', 'i'], dice: 'Toma algo de cada lado' },
    repite: { t: 'El celular debe prohibirse en clase.', marcas: { t1: 'i', a1: 'h', s1: 'h' }, sello: ['Repite la tesis', 'h'], dice: 'Repite la tesis: borra la antítesis' },
    junta: { t: 'El celular distrae y es una herramienta.', marcas: { t1: 'd', a1: 'd', s1: 'd' }, sello: ['Solo las junta', 'd'], dice: 'Junta las dos sin resolver nada' },
  };
  const figTAS = k => ({ secciones: [...TAS.secciones, { id: 's', titulo: 'Síntesis', modo: 'tarjeta', fragmentos: [{ id: 's1', t: CIERRE[k].t }] }] });
  const dialectica = {
    id: 'tesis-antitesis-sintesis',
    titulo: 'Tesis, antítesis y síntesis',
    temas: ['Tesis, antítesis y síntesis'],
    pieza: 'rv-texto',
    juega: {
      consigna: 'Una tesis y su antítesis sobre el celular. Prueba tres cierres y mira cuál toma algo válido de cada lado.',
      voz: 'Sintetizar no es elegir un ganador ni pegar las dos.',
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
      dibujo: { datos: { secciones: [{ id: 't', titulo: 'Autor A', modo: 'tarjeta', fragmentos: [{ id: 't1', t: 'La represa dará agua para riego todo el año.' }] }, { id: 'a', titulo: 'Autor B', modo: 'tarjeta', fragmentos: [{ id: 'a1', t: 'La represa inundará tierras de cultivo.' }] }] }, estado: {} },
      revelar: { datos: { secciones: [{ id: 't', titulo: 'Autor A', modo: 'tarjeta', fragmentos: [{ id: 't1', t: 'La represa dará agua para riego todo el año.' }] }, { id: 'a', titulo: 'Autor B', modo: 'tarjeta', fragmentos: [{ id: 'a1', t: 'La represa inundará tierras de cultivo.' }] }] }, estado: { marcas: { t1: 'o', a1: 'o' }, sellos: { t: { t: 'Razonable', c: 'i' }, a: { t: 'Razonable', c: 'i' } } } },
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
      ecuacion: [tesis('tesis'), ' + ', tesis('antítesis'), ' → ', razon('síntesis')],
      condicion: 'la síntesis responde a las razones de ambos lados; si no hay cómo integrarlas, el desacuerdo razonado también es un cierre.',
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
          dibujo: { datos: { secciones: [{ id: 't', titulo: 'Tesis', modo: 'tarjeta', fragmentos: [{ id: 't1', t: b.t }] }, { id: 'a', titulo: 'Antítesis', modo: 'tarjeta', fragmentos: [{ id: 'a1', t: b.a }] }] }, estado: {} },
          opciones: opciones(b.ok, voltear(b.m, s)),
          solucion: { texto: 'Toma una razón válida de cada lado en una propuesta nueva.', ecuacion: [tesis('tesis'), ' + ', tesis('antítesis'), ' → ', razon('síntesis')] },
        };
      },
    },
  };

  return {
    unidad: 'razonamiento-verbal.textos-argumentativos-y-dialecticos',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rv-texto.js'],
    historia: {
      texto: 'La Retórica de Aristóteles estudió cómo se persuade en la discusión pública y en los juicios: con razones, con la imagen de quien habla y con la disposición de quien escucha. Su análisis permite separar la fuerza de un discurso de la calidad de sus razones. Un debate no siempre termina en acuerdo.',
      pregunta: '¿Convencer es lo mismo que tener buenas razones?',
      fuente: { titulo: 'Matriz de teoría de razonamiento verbal (Aristóteles, Retórica)', url: 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/diccio_ele/diccionario/txtargumentativo.htm' },
    },
    ideas: [tesisRazones, debate, dialectica],
  };
});
