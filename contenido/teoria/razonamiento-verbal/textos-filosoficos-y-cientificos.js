/*
 * Teoría de «Textos filosóficos y científicos» (razonamiento-verbal.textos-filosoficos-y-cientificos). Molde:
 * docs/teoria.md. Contenido: matriz de verbal (unidad 17), historia (Descartes, 1637; Philosophical Transactions,
 * 1665) y códigos RV47, RV52, RV53 y RV56. Textos propios (regla 5).
 * Ruta A · Argumentar: se marca cada parte y se ve qué función cumple y qué justifica de verdad.
 *
 * Ficha de tarea:
 *   Promesa: reconocer la función de cada parte (dato, método, explicación, límite; pregunta, término, tesis, objeción).
 *   Persona y condiciones: postulante de 3.º a 5.º, celular, sin audio; textos filosóficos y científicos (UNI 20).
 *   Resultado observable: distingue observación de explicación y dice qué evidencia faltaría para sostener la tesis.
 *   Orden de atención: 1.º la parte marcada · 2.º su función (sello) · 3.º qué sostiene y qué no · acción: marcar otra.
 *   Estados: dato · hipótesis · conclusión que excede el estudio; pregunta · definición · tesis · objeción.
 *   Duda que resuelve: ¿si dos cosas suben juntas, una causa la otra?
 *
 * Colores (regla 4): el dato o la razón i (turquesa, continuo), la conclusión o la tesis o (naranja, discontinuo), la
 * pregunta, el término o el límite d (verde, punteado), lo que excede o la objeción h (rojo).
 * Códigos: RV47 (junto no es causa), RV52 (hipótesis como hecho), RV53 (objeción como tesis), RV56 (ejemplo por
 * definición). Sin códigos nuevos.
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
  const dato = t => ({ v: 'c-i', t }), concl = t => ({ v: 'c-o', t }), marco = t => ({ v: 'c-d', t }), excede = t => ({ v: 'c-h', t });
  const opciones = (c, malas) => [{ id: 'c', texto: c, correcta: true }, ...malas.map(([texto, error, siFuera], k) => ({ id: `e${k}`, texto, error, siFuera }))];
  const voltear = (arr, s) => (s % 2 ? arr.slice().reverse() : arr.slice());
  const lista = (titulo, ors) => ({ secciones: [{ id: 'o', titulo, modo: 'lista', fragmentos: ors.map((t, k) => ({ id: `o${k + 1}`, t })) }] });

  // ---------- Idea 1: dato, método, explicación y límite ----------
  // Cambia: la parte marcada. Permanece: el texto del estudio de los huertos. Progresa: de lo observado a lo explicado
  // y al límite. Se reserva: una correlación tomada por causa (predicción). Debe verse: que la explicación es una
  // hipótesis y que el texto declara su límite.
  const EST = ['En diez colegios con huerto, los alumnos comían más verduras.', 'Se comparó con diez colegios sin huerto, de la misma zona.', 'Una explicación posible: cultivar despierta interés por probar lo cosechado.', 'El estudio no siguió a los alumnos fuera del colegio.'];
  const PARTE = { 1: ['Dato: lo que se observó', 'i'], 2: ['Método: cómo se comparó', 'd'], 3: ['Explicación propuesta: es una hipótesis', 'o'], 4: ['Límite: lo que el estudio no cubre', 'd'] };
  const cientifico = {
    id: 'texto-cientifico',
    titulo: 'Dato, método, explicación y límite',
    temas: ['Rasgos del texto científico'],
    pieza: 'rv-texto',
    juega: {
      consigna: 'Marca cada oración del informe y mira qué función cumple: dato, método, explicación o límite del estudio.',
      voz: 'Lo observado y lo que se propone para explicarlo no pesan igual.',
      controles: [{ id: 'k', etiqueta: 'Marca', opciones: [1, 2, 3, 4].map(k => ({ valor: k, texto: `${k}` })) }],
      dibujo: val => ({ datos: lista('Informe', EST), estado: { marcas: { [`o${val.k}`]: PARTE[val.k][1] }, sellos: { o: { t: PARTE[val.k][0].split(':')[0], c: PARTE[val.k][1] } } } }),
      lectura: val => [corto(PARTE[val.k][1] === 'o' ? concl : PARTE[val.k][1] === 'd' ? marco : dato, PARTE[val.k][0])],
      minimo: 3,
    },
    predice: {
      pregunta: 'Según este informe sobre leer y las notas, ¿qué conclusión está respaldada?',
      voz: 'Distingue «van juntos» de «uno causa el otro».',
      opciones: opciones('Leer más y tener mejores notas aparecen juntos', [
        ['Leer más causa mejores notas', 'RV47', 'Aparecen juntos, pero el informe no prueba que uno cause el otro.'],
        ['Está comprobado que leer sube las notas', 'RV52', 'El informe solo lo propone como posible explicación.'],
        ['Leer no tiene relación con las notas', 'RV34', 'El informe sí encontró que van juntos.'],
      ]),
      dibujo: { datos: lista('Informe', ['Los alumnos que leen más tienen, en promedio, mejores notas.', 'Quizá leer amplía el vocabulario.', 'También podría ser que los alumnos con buenas notas lean más.']), estado: {} },
      revelar: { datos: lista('Informe', ['Los alumnos que leen más tienen, en promedio, mejores notas.', 'Quizá leer amplía el vocabulario.', 'También podría ser que los alumnos con buenas notas lean más.']), estado: { marcas: { o1: 'i', o2: 'o', o3: 'd' }, sellos: { o: { t: 'Van juntos', c: 'i' } } } },
      coincide: 'Coincide: el dato es que van juntos; la causa queda abierta, y el propio informe lo dice.',
    },
    mira: {
      datos: lista('Informe', EST),
      pasos: [
        { estado: { marcas: { o1: 'i' } }, texto: 'El dato: en los colegios con huerto se comían más verduras.', ecuacion: [dato('dato observado')] },
        { estado: { marcas: { o1: 'i', o2: 'd' }, nuevo: ['o2'] }, texto: 'El método: se comparó con colegios parecidos sin huerto.', ecuacion: [marco('comparación')] },
        { estado: { marcas: { o1: 'i', o2: 'd', o3: 'o' }, nuevo: ['o3'] }, texto: '«Una explicación posible»: es una hipótesis, no un hecho comprobado.', ecuacion: [concl('hipótesis'), ' ≠ hecho'] },
        { estado: { marcas: { o1: 'i', o2: 'd', o3: 'o', o4: 'd' }, nuevo: ['o4'] }, texto: 'El límite: no se sabe qué comen fuera del colegio.', ecuacion: [marco('límite'), ' → no generalizar'] },
      ],
    },
    regla: {
      texto: 'Un texto científico separa datos, método, explicación y límites. La explicación propuesta es una hipótesis; que dos cosas aparezcan juntas no prueba que una cause la otra.',
      ecuacion: [dato('datos'), ' + ', marco('método'), ' → ', concl('hipótesis'), ' (con ', marco('límites'), ')'],
      condicion: 'la conclusión no va más allá de lo que el método observó; palabras como «quizá» o «posible» marcan hipótesis.',
    },
    ahoraTu: {
      generar(s) {
        const B = [
          { o: ['En los meses con más helados vendidos hubo más ahogados en la playa.'], ok: 'Ambos suben en verano: no se prueba que uno cause el otro', m: [['Comer helado causa ahogamientos', 'RV47', 'Aparecen juntos; el calor puede explicar los dos.'], ['Está comprobado que el helado es peligroso', 'RV52', 'El texto no prueba nada sobre el helado.'], ['No hay ninguna relación', 'RV34', 'Sí aparecen juntos: eso es lo que se observó.']] },
          { o: ['Se midió la temperatura del lago cada mes durante un año.', 'Quizá el calentamiento explique que haya menos peces.'], ok: 'Que el calentamiento reduzca los peces es una hipótesis', m: [['Está probado que el calor mató a los peces', 'RV52', '«Quizá» marca una hipótesis.'], ['Se contaron los peces cada mes', 'RV7', 'El texto dice que se midió la temperatura.'], ['El lago se enfrió', 'RV7', 'El texto no lo dice.']] },
          { o: ['En el estudio participaron cuarenta alumnos de Juliaca.', 'Los que durmieron ocho horas rindieron mejor en la prueba.'], ok: 'El resultado vale para esos cuarenta alumnos', m: [['Vale para todos los estudiantes del mundo', 'RV7', 'El estudio declara su grupo: cuarenta alumnos de Juliaca.'], ['Dormir ocho horas garantiza aprobar', 'RV52', 'Rindieron mejor; no se dice que todos aprobaran.'], ['Dormir no influye en el rendimiento', 'RV34', 'El estudio encontró lo contrario.']] },
          { o: ['Las plantas regadas con agua de lluvia crecieron más que las regadas con agua de pozo.', 'Todas estaban en la misma huerta.'], ok: 'Con ese método, el agua de lluvia dio más crecimiento', m: [['El agua de pozo es venenosa', 'RV7', 'El texto no dice nada de veneno.'], ['Está comprobado para todas las plantas', 'RV7', 'Solo se probó en esa huerta.'], ['No hubo diferencia', 'RV34', 'Sí la hubo.']] },
          { o: ['Los pueblos con más antenas de celular tienen más casos de gripe.', 'Los pueblos con más antenas también tienen más habitantes.'], ok: 'Puede que la población explique ambos datos', m: [['Las antenas causan gripe', 'RV47', 'El texto mismo da otra explicación: hay más gente.'], ['Está probado que las antenas enferman', 'RV52', 'Nada se probó sobre las antenas.'], ['La gripe no tiene relación con nada', 'RV34', 'Los datos sí muestran una relación.']] },
        ];
        const b = B[s % B.length];
        return {
          pregunta: '¿Qué conclusión respalda de verdad el texto?',
          dibujo: { datos: lista('Informe', b.o), estado: {} },
          opciones: opciones(b.ok, voltear(b.m, s)),
          solucion: { texto: 'Se separa lo observado de lo que se propone para explicarlo.', ecuacion: [dato('dato'), ' ≠ ', concl('causa probada')] },
        };
      },
    },
  };

  // ---------- Idea 2: pregunta, término, tesis y objeción ----------
  // Cambia: la parte marcada. Permanece: el texto sobre la amistad. Progresa: la pregunta, el término definido, la
  // tesis, la objeción y la respuesta. Se reserva: qué entiende el autor por un término (predicción).
  // Debe verse: la definición estipulada y la objeción que el autor responde.
  const FIL = ['¿Qué hace que alguien sea un amigo verdadero?', 'Llamaremos «amigo» a quien busca nuestro bien, no solo pasar el rato.', 'Por eso, un amigo puede decirnos lo que no queremos oír.', 'Se dirá que un amigo debe hacernos sentir bien.', 'Pero sentirse bien un momento no es lo mismo que estar bien.'];
  const PFIL = { 1: ['Pregunta: lo que se investiga', 'd'], 2: ['Término definido por el autor', 'd'], 3: ['Tesis: lo que sostiene', 'o'], 4: ['Objeción: lo que otros dirían', 'h'], 5: ['Respuesta a la objeción', 'i'] };
  const filosofico = {
    id: 'texto-filosofico',
    titulo: 'Pregunta, término, tesis y objeción',
    temas: ['Rasgos del texto filosófico'],
    pieza: 'rv-texto',
    juega: {
      consigna: 'Marca cada oración del texto sobre la amistad y mira su función: pregunta, término, tesis, objeción o respuesta.',
      voz: 'Un texto filosófico razona: no solo opina.',
      controles: [{ id: 'k', etiqueta: 'Marca', opciones: [1, 2, 3, 4, 5].map(k => ({ valor: k, texto: `${k}` })) }],
      dibujo: val => ({ datos: lista('Texto', FIL), estado: { marcas: { [`o${val.k}`]: PFIL[val.k][1] }, sellos: { o: { t: PFIL[val.k][0].split(':')[0], c: PFIL[val.k][1] } } } }),
      lectura: val => [corto(PFIL[val.k][1] === 'h' ? excede : PFIL[val.k][1] === 'o' ? concl : PFIL[val.k][1] === 'd' ? marco : dato, PFIL[val.k][0])],
      minimo: 3,
    },
    predice: {
      pregunta: 'En este texto, ¿qué entiende el autor por «valiente»?',
      opciones: opciones('Quien actúa bien aunque tenga miedo', [
        ['Quien no siente miedo', 'RV53', 'Es la idea común que el autor discute, no la suya.'],
        ['Un bombero que entra a un incendio', 'RV56', 'Es un ejemplo posible, no lo que el autor define.'],
        ['Quien gana una pelea', 'RV7', 'El texto no habla de peleas.'],
      ]),
      dibujo: { datos: lista('Texto', ['Suele creerse que valiente es quien no siente miedo.', 'Aquí llamaremos «valiente» a quien actúa bien aunque tenga miedo.', 'Sin miedo, no habría nada que vencer.']), estado: {} },
      revelar: { datos: lista('Texto', ['Suele creerse que valiente es quien no siente miedo.', 'Aquí llamaremos «valiente» a quien actúa bien aunque tenga miedo.', 'Sin miedo, no habría nada que vencer.']), estado: { marcas: { o1: 'h', o2: 'd', o3: 'i' }, sellos: { o: { t: 'Definición: la 2', c: 'd' } } } },
      coincide: 'Coincide: «llamaremos» introduce la definición del autor; la 1 es la idea que discute.',
    },
    mira: {
      datos: lista('Texto', FIL),
      pasos: [
        { estado: { marcas: { o1: 'd' } }, texto: 'Empieza con una pregunta: qué es un amigo verdadero.', ecuacion: [marco('pregunta')] },
        { estado: { marcas: { o1: 'd', o2: 'd' }, nuevo: ['o2'] }, texto: '«Llamaremos» fija cómo usará el autor la palabra «amigo».', ecuacion: [marco('término'), ' = busca nuestro bien'] },
        { estado: { marcas: { o1: 'd', o2: 'd', o3: 'o' }, nuevo: ['o3'] }, texto: 'De esa definición saca su tesis: puede decirnos lo que no queremos oír.', ecuacion: [marco('término'), ' → ', concl('tesis')] },
        { estado: { marcas: { o2: 'd', o3: 'o', o4: 'h', o5: 'i' }, nuevo: ['o4', 'o5'] }, texto: '«Se dirá…» presenta una objeción; «pero…» la responde.', ecuacion: [excede('objeción'), ' ← ', dato('respuesta')] },
      ],
    },
    regla: {
      texto: 'Un texto filosófico plantea una pregunta, define o distingue sus términos y defiende una tesis con razones, respondiendo objeciones. Lo que entiende por un término se lee en su definición.',
      ecuacion: [marco('pregunta'), ' → ', marco('términos'), ' → ', concl('tesis'), ' ← ', excede('objeción')],
      condicion: 'se separa lo que el autor sostiene de lo que cita para discutir; un ejemplo no reemplaza la definición.',
    },
    ahoraTu: {
      generar(s) {
        const B = [
          { o: ['Muchos creen que ser libre es hacer lo que uno quiera.', 'Aquí entenderemos por libertad poder elegir lo que es bueno para uno.'], ok: 'Poder elegir lo que es bueno para uno', m: [['Hacer lo que uno quiera', 'RV53', 'Es lo que «muchos creen»; el autor propone otra cosa.'], ['Salir de la cárcel', 'RV56', 'Es un caso posible, no la definición del autor.'], ['No tener reglas', 'RV7', 'El texto no lo dice.']] },
          { o: ['¿Qué es aprender?', 'Llamaremos aprender a poder usar lo sabido en un caso nuevo.', 'Repetir de memoria, entonces, no basta.'], ok: 'Poder usar lo sabido en un caso nuevo', m: [['Repetir de memoria', 'RV53', 'El autor dice que eso no basta.'], ['Sacar buena nota en un examen', 'RV56', 'Es un caso posible, no la definición.'], ['Ir al colegio', 'RV7', 'El texto no lo dice.']] },
          { o: ['Se suele decir que justo es dar a todos lo mismo.', 'Pero aquí justo será dar a cada uno lo que necesita.'], ok: 'Dar a cada uno lo que necesita', m: [['Dar a todos lo mismo', 'RV53', 'Es lo que «se suele decir»; el autor lo cambia.'], ['Un juez que dicta sentencia', 'RV56', 'Es un ejemplo, no la definición.'], ['Que nadie tenga nada', 'RV7', 'El texto no lo dice.']] },
          { o: ['¿Qué es un buen ciudadano?', 'Entenderé por buen ciudadano a quien cuida lo que es de todos.', 'Por eso, no basta con no hacer daño.'], ok: 'Quien cuida lo que es de todos', m: [['Quien no hace daño', 'RV53', 'El autor dice que eso no basta.'], ['Quien vota en las elecciones', 'RV56', 'Es un caso posible, no su definición.'], ['Quien vive en la ciudad', 'RV7', 'El texto no lo dice.']] },
          { o: ['Algunos piensan que la felicidad es tener muchas cosas.', 'Aquí llamaremos felicidad a estar en paz con lo que uno hace.'], ok: 'Estar en paz con lo que uno hace', m: [['Tener muchas cosas', 'RV53', 'Es lo que «algunos piensan»; el autor propone otra cosa.'], ['Ganar la lotería', 'RV56', 'Es un caso, no la definición.'], ['No trabajar', 'RV7', 'El texto no lo dice.']] },
        ];
        const b = B[s % B.length];
        const termino = { 0: 'libertad', 1: 'aprender', 2: 'justo', 3: 'buen ciudadano', 4: 'felicidad' }[s % B.length];
        return {
          pregunta: `En este texto, ¿qué entiende el autor por «${termino}»?`,
          dibujo: { datos: lista('Texto', b.o), estado: {} },
          opciones: opciones(b.ok, voltear(b.m, s)),
          solucion: { texto: 'Se busca la frase con «llamaremos», «entenderé por» o «aquí será».', ecuacion: [marco('definición del autor'), ' ≠ ', excede('idea común')] },
        };
      },
    },
  };

  return {
    unidad: 'razonamiento-verbal.textos-filosoficos-y-cientificos',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rv-texto.js'],
    historia: {
      texto: 'En 1637, Descartes publicó el Discurso del método para examinar cómo razonar y buscar conocimiento. En 1665, Henry Oldenburg inició Philosophical Transactions para hacer circular observaciones y resultados. Son necesidades parecidas pero distintas: justificar un modo de pensar y comunicar lo observado. Filosofía y ciencia se cruzaron muchas veces.',
      pregunta: '¿Qué diferencia hay entre observar algo y explicarlo?',
      fuente: { titulo: 'Matriz de teoría de razonamiento verbal (Descartes 1637; Philosophical Transactions 1665)', url: 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/diccio_ele/diccionario/txtargumentativo.htm' },
    },
    ideas: [cientifico, filosofico],
  };
});
