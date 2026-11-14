/*
 * Teoría de «Tema central e idea principal» (razonamiento-verbal.tema-e-idea-principal). Molde: docs/teoria.md.
 * Contenido: matriz de verbal (unidad 9), historia (macroestructura, van Dijk 1977–1980), precisión del expediente
 * («la idea principal puede estar implícita o distribuida») y códigos RV1–RV5. Textos propios (regla 5).
 * Ruta C · Comparar: se prueba una propuesta y se ve qué parte del texto cubre.
 *
 * Ficha de tarea:
 *   Promesa: distinguir el tema (de qué trata) de la idea principal (qué se afirma) y probar que cubre todo el texto.
 *   Persona y condiciones: postulante de 3.º a 5.º, celular, sin audio; tema e idea principal (UNI 11 y 14, UNMSM 4).
 *   Resultado observable: formula o elige una oración que cubre el texto sin agregar una conclusión externa.
 *   Orden de atención: 1.º la propuesta · 2.º las oraciones que cubre (i) y las que deja fuera (h) · 3.º el conteo.
 *   Estados: cubre todo · cubre una parte · es tan amplia que habla de otro texto · solo nombra el asunto.
 *   Duda que resuelve: ¿la idea principal es siempre la primera oración?
 *
 * Colores (regla 4): lo que la propuesta cubre i (turquesa, continuo), la propuesta o (naranja, discontinuo), el tema
 * o la idea que organiza d (verde, punteado), lo que queda fuera h (rojo).
 * Códigos: RV1 (detalle), RV2 (demasiado general), RV3 (omite una parte), RV4 (primera oración), RV5 (eco literal);
 * RVM1 (mapa como lista de palabras) y RVM2 (enlace invertido) son hipótesis nuevas. Los conteos se calculan (regla 1).
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
  const cubre = t => ({ v: 'c-i', t }), prop = t => ({ v: 'c-o', t }), tema = t => ({ v: 'c-d', t }), fuera = t => ({ v: 'c-h', t });
  const opciones = (c, malas) => [{ id: 'c', texto: c, correcta: true }, ...malas.map(([texto, error, siFuera], k) => ({ id: `e${k}`, texto, error, siFuera }))];
  const voltear = (arr, s) => (s % 2 ? arr.slice().reverse() : arr.slice());
  // Texto (oraciones numeradas) y debajo la propuesta en una tarjeta.
  const figura = (titulo, ors, propuesta, reserva) => ({ secciones: [
    { id: 'o', titulo, modo: 'lista', fragmentos: ors.map((t, k) => ({ id: `o${k + 1}`, t })) },
    { id: 'p', titulo: 'Propuesta', modo: 'tarjeta', fragmentos: [{ id: 'p1', t: propuesta || reserva || '…' }] },
  ] });
  // Cobertura: marca i lo que cubre, h lo que deja fuera; el sello dice cuántas oraciones cubre (contado aquí).
  function cobertura(n, lista, extra = {}) {
    const marcas = { p1: 'o' };
    for (let k = 1; k <= n; k++) marcas[`o${k}`] = lista.includes(k) ? 'i' : 'h';
    return Object.assign({ marcas, sellos: { o: { t: `Cubre ${lista.length} de ${n}`, c: lista.length === n ? 'i' : 'h' } } }, extra);
  }

  // ---------- Idea 1: tema no es idea principal ----------
  // Cambia: la propuesta. Permanece: el texto de la biblioteca. Progresa: cuántas oraciones cubre y si afirma algo.
  // Se reserva: la idea principal implícita (predicción). Debe verse: que «la biblioteca» cubre todo pero no afirma nada.
  const BIBLIO = ['La biblioteca del barrio amplió su horario hasta las ocho de la noche.', 'También empezó a prestar libros por dos semanas.', 'Desde entonces, la visitan el doble de estudiantes.', 'Muchos dicen que antes no podían ir después del colegio.'];
  const PROP = {
    tema: { t: 'La biblioteca del barrio.', cubre: [1, 2, 3, 4], dice: 'Es el tema: nombra el asunto, no afirma nada', ok: false },
    detalle: { t: 'La biblioteca abre hasta las ocho.', cubre: [1], dice: 'Es un detalle: deja fuera el resto', ok: false },
    principal: { t: 'Los cambios de la biblioteca hicieron que más estudiantes puedan usarla.', cubre: [1, 2, 3, 4], dice: 'Afirma algo y cubre todo el texto', ok: true },
    amplia: { t: 'Las bibliotecas son importantes para la educación.', cubre: [], dice: 'Demasiado amplia: habla de otro texto', ok: false },
  };
  const figBib = k => figura('Texto', BIBLIO, PROP[k].t);
  const temaIdea = {
    id: 'tema-e-idea',
    titulo: 'El tema no es la idea',
    temas: ['Tema central', 'Idea principal e ideas secundarias'],
    pieza: 'rv-texto',
    juega: {
      consigna: 'Prueba cuatro propuestas para el texto de la biblioteca. Mira cuántas oraciones cubre cada una y si dice algo del tema.',
      voz: 'Nombrar el asunto no es decir algo sobre él.',
      controles: [{ id: 'p', etiqueta: 'Propuesta', opciones: [{ valor: 'tema', texto: 'A' }, { valor: 'detalle', texto: 'B' }, { valor: 'principal', texto: 'C' }, { valor: 'amplia', texto: 'D' }] }],
      dibujo: val => ({ datos: figBib(val.p), estado: cobertura(BIBLIO.length, PROP[val.p].cubre, val.p === 'tema' ? { marcas: Object.assign(cobertura(4, [1, 2, 3, 4]).marcas, { p1: 'd' }) } : {}) }),
      lectura: val => [corto(PROP[val.p].ok ? cubre : fuera, PROP[val.p].dice)],
      minimo: 4,
    },
    predice: {
      pregunta: 'Ninguna oración de este texto dice la idea principal por sí sola. ¿Cuál es?',
      voz: 'La idea principal puede estar repartida en el texto.',
      opciones: opciones('Al cocinar, el agua hierve a menos temperatura en la altura', [
        ['En Juliaca el agua hierve a unos 87 grados', 'RV4', 'Es la primera oración, pero solo da un dato de una ciudad.'],
        ['Los fideos tardan más en cocinarse', 'RV1', 'Es un ejemplo del texto; deja fuera la explicación.'],
        ['El agua es necesaria para cocinar', 'RV2', 'Es verdad, pero tan amplia que podría ser de cualquier texto.'],
      ]),
      dibujo: { datos: figura('Texto', ['En Juliaca, el agua hierve a unos 87 grados.', 'En Lima, a orillas del mar, hierve a 100.', 'Arriba hay menos aire que empuje sobre el agua.', 'Por eso, en la altura los fideos tardan más en cocinarse.'], null, '¿?'), estado: {} },
      revelar: { datos: figura('Texto', ['En Juliaca, el agua hierve a unos 87 grados.', 'En Lima, a orillas del mar, hierve a 100.', 'Arriba hay menos aire que empuje sobre el agua.', 'Por eso, en la altura los fideos tardan más en cocinarse.'], 'Al cocinar, el agua hierve a menos temperatura en la altura.'), estado: cobertura(4, [1, 2, 3, 4]) },
      coincide: 'Coincide: no está escrita en una sola oración; se construye uniendo las cuatro.',
    },
    mira: {
      datos: figBib('principal'),
      pasos: [
        { estado: { marcas: { o1: 'd', o2: 'd', o3: 'd', o4: 'd' }, tapar: ['p1'] }, texto: 'Todas hablan de la biblioteca: ese es el tema.', ecuacion: [tema('tema'), ' = de qué trata'] },
        { estado: { marcas: { o1: 'i', o2: 'i', o3: 'o', o4: 'o' }, tapar: ['p1'], nuevo: ['o3', 'o4'] }, texto: 'Las dos primeras dicen qué cambió; las otras, qué produjo.', ecuacion: [cubre('cambios'), ' → ', prop('más estudiantes')] },
        { estado: cobertura(4, [1, 2, 3, 4], { nuevo: ['p1'] }), texto: 'La idea principal une las dos partes y cubre las cuatro.', ecuacion: [tema('tema'), ' + ', prop('lo que se afirma'), ' = idea principal'] },
      ],
    },
    regla: {
      texto: 'El tema nombra de qué trata el texto; la idea principal afirma lo más importante sobre él y cubre todo el texto. Las secundarias la explican, ejemplifican o sostienen.',
      ecuacion: [prop('idea principal'), ' = ', tema('tema'), ' + ', cubre('lo que se afirma de él')],
      condicion: 'cubre todas las partes sin agregar algo que el texto no dice; puede no estar escrita en una sola oración.',
    },
    ahoraTu: {
      generar(s) {
        const B = [
          { tema: 'las abejas', o: ['Las abejas llevan polen de flor en flor.', 'Sin ellas, muchos cultivos no darían frutos.', 'Hoy su número baja por el uso de pesticidas.'], ok: 'Las abejas son clave para los cultivos y están en peligro', m: [['Las abejas llevan polen de flor en flor', 'RV4', 'Es la primera oración: deja fuera el peligro.'], ['Los pesticidas', 'RV1', 'Es un detalle y además no afirma nada.'], ['Los insectos son importantes', 'RV2', 'Es demasiado amplia: el texto habla de abejas.']] },
          { tema: 'el reciclaje', o: ['En el colegio se juntaron mil botellas en un mes.', 'Con su venta se compraron libros para la biblioteca.', 'Ahora los alumnos separan la basura sin que se los pidan.'], ok: 'Reciclar en el colegio dio libros y creó un hábito', m: [['Se juntaron mil botellas en un mes', 'RV1', 'Es un dato; no dice qué produjo el reciclaje.'], ['El reciclaje', 'RV2', 'Nombra el tema, pero no afirma nada.'], ['Se compraron libros', 'RV3', 'Cubre una parte; deja fuera el hábito.']] },
          { tema: 'el sueño', o: ['Dormir poco baja la atención en clase.', 'También dificulta recordar lo estudiado.', 'Por eso, dormir ocho horas ayuda a aprender.'], ok: 'Dormir lo suficiente ayuda a atender y recordar', m: [['Dormir poco baja la atención', 'RV4', 'Es la primera oración; deja fuera la memoria.'], ['El sueño', 'RV2', 'Nombra el tema, pero no afirma nada.'], ['La salud depende de muchos hábitos', 'RV2', 'Es tan amplia que habla de otro texto.']] },
          { tema: 'la papa nativa', o: ['La papa nativa tiene cientos de variedades.', 'Muchas resisten heladas y plagas.', 'Sin embargo, se cultivan cada vez menos.'], ok: 'La papa nativa es valiosa, pero se cultiva cada vez menos', m: [['Tiene cientos de variedades', 'RV1', 'Es un dato: deja fuera el problema.'], ['Muchas resisten heladas', 'RV3', 'Cubre una parte: falta que se cultivan menos.'], ['La agricultura andina', 'RV2', 'Es demasiado amplia y no afirma nada.']] },
          { tema: 'el celular en clase', o: ['El celular distrae cuando se usa para jugar.', 'Pero sirve para buscar datos o grabar experimentos.', 'Todo depende de cómo se use en la clase.'], ok: 'El celular en clase ayuda o distrae según cómo se use', m: [['El celular distrae', 'RV4', 'Es la primera idea; el texto también dice que sirve.'], ['Sirve para grabar experimentos', 'RV1', 'Es un ejemplo de su uso útil.'], ['La tecnología cambió el mundo', 'RV2', 'Es tan amplia que habla de otro texto.']] },
        ];
        const b = B[s % B.length];
        return {
          pregunta: `¿Cuál es la idea principal del texto sobre ${b.tema}?`,
          dibujo: { datos: { secciones: [{ id: 'o', titulo: 'Texto', modo: 'lista', fragmentos: b.o.map((t, k) => ({ id: `o${k + 1}`, t })) }] }, estado: {} },
          opciones: opciones(b.ok, voltear(b.m, s)),
          solucion: { texto: 'Afirma algo del tema y cubre todas las oraciones.', ecuacion: [tema(b.tema), ' + ', cubre('todo el texto')] },
        };
      },
    },
  };

  // ---------- Idea 2: jerarquía y subrayado ----------
  // Cambia: la oración que se subraya. Permanece: el texto de la quinua. Progresa: el papel de cada oración (principal,
  // razón, ejemplo, dato). Se reserva: qué subrayar en un texto nuevo (predicción). Debe verse: que solo una es la principal.
  const QUI = ['La quinua es uno de los alimentos más completos.', 'Tiene proteínas con todos los aminoácidos que necesitamos.', 'Además, aporta hierro y fibra.', 'Por ejemplo, un plato de quinua da más proteína que uno de arroz.', 'En el altiplano se cultiva hace miles de años.'];
  const PAPEL = { 1: ['Principal: lo demás la sostiene', 'd'], 2: ['Secundaria: una razón', 'i'], 3: ['Secundaria: otra razón', 'i'], 4: ['Secundaria: un ejemplo', 'i'], 5: ['Dato aparte: no la sostiene', 'h'] };
  const figQui = () => ({ secciones: [{ id: 'o', titulo: 'Texto', modo: 'lista', fragmentos: QUI.map((t, k) => ({ id: `o${k + 1}`, t })) }] });
  const jerarquia = {
    id: 'jerarquia',
    titulo: 'Principal, secundarias y subrayado',
    temas: ['Jerarquía textual', 'Subrayado'],
    pieza: 'rv-texto',
    juega: {
      consigna: 'Subraya una oración a la vez. Mira qué papel cumple: idea principal, razón, ejemplo o dato aparte.',
      voz: 'Subrayar es elegir: no todo pesa igual.',
      controles: [{ id: 'k', etiqueta: 'Subrayar', opciones: [1, 2, 3, 4, 5].map(k => ({ valor: k, texto: `${k}` })) }],
      dibujo: val => ({ datos: figQui(), estado: { marcas: { [`o${val.k}`]: PAPEL[val.k][1] }, sellos: { o: { t: PAPEL[val.k][0].split(':')[0], c: PAPEL[val.k][1] === 'h' ? 'h' : PAPEL[val.k][1] === 'd' ? 'd' : 'i' } } } }),
      lectura: val => [corto(PAPEL[val.k][1] === 'h' ? fuera : PAPEL[val.k][1] === 'd' ? tema : cubre, PAPEL[val.k][0])],
      minimo: 3,
    },
    predice: {
      pregunta: 'Para estudiar este texto sobre el cóndor, ¿qué conviene subrayar?',
      opciones: opciones('La oración principal y las palabras clave de sus razones', [
        ['Todo el texto, para no perder nada', 'RV1', 'Subrayar todo es como no subrayar: no se ve qué pesa más.'],
        ['Solo la primera oración', 'RV4', 'Aquí la primera es un dato; la principal llega después.'],
        ['Las cifras, porque son lo más difícil', 'RV1', 'Las cifras ayudan, pero aquí sostienen la idea; no son la idea.'],
      ]),
      dibujo: { datos: { secciones: [{ id: 'o', titulo: 'Texto', modo: 'lista', fragmentos: [{ id: 'o1', t: 'El cóndor pesa hasta quince kilos.' }, { id: 'o2', t: 'Aun así, es un gran planeador que casi no aletea.' }, { id: 'o3', t: 'Aprovecha corrientes de aire caliente que suben.' }, { id: 'o4', t: 'Así recorre hasta trescientos kilómetros en un día.' }] }] }, estado: {} },
      revelar: { datos: { secciones: [{ id: 'o', titulo: 'Texto', modo: 'lista', fragmentos: [{ id: 'o1', t: 'El cóndor pesa hasta quince kilos.' }, { id: 'o2', t: 'Aun así, es un gran planeador que casi no aletea.' }, { id: 'o3', t: 'Aprovecha corrientes de aire caliente que suben.' }, { id: 'o4', t: 'Así recorre hasta trescientos kilómetros en un día.' }] }] }, estado: { marcas: { o2: 'd', o3: 'i' }, sellos: { o: { t: 'Principal: la 2', c: 'd' } } } },
      coincide: 'Coincide: la 2 es la idea; la 3 explica cómo lo logra; lo demás la apoya.',
    },
    mira: {
      datos: figQui(),
      pasos: [
        { estado: { marcas: { o1: 'd' } }, texto: 'La 1 afirma algo general sobre la quinua.', ecuacion: [tema('principal'), ': alimento completo'] },
        { estado: { marcas: { o1: 'd', o2: 'i', o3: 'i' }, nuevo: ['o2', 'o3'] }, texto: 'La 2 y la 3 dan razones de por qué es completa.', ecuacion: [cubre('razones'), ' → ', tema('principal')] },
        { estado: { marcas: { o1: 'd', o2: 'i', o3: 'i', o4: 'i' }, nuevo: ['o4'] }, texto: 'La 4 da un ejemplo que lo muestra.', ecuacion: [cubre('ejemplo'), ' → ', tema('principal')] },
        { estado: { marcas: { o1: 'd', o2: 'i', o3: 'i', o4: 'i' }, tachar: ['o5'], nuevo: ['o5'] }, texto: 'La 5 es cierta, pero no sostiene que sea completa.', ecuacion: [fuera('dato aparte')] },
      ],
    },
    regla: {
      texto: 'Un texto tiene jerarquía: una idea principal y secundarias que la explican, la sostienen o la ejemplifican. Subrayar bien es marcar la principal y lo esencial de sus apoyos.',
      ecuacion: [tema('principal'), ' ← ', cubre('razones'), ' + ', cubre('ejemplos')],
      condicion: 'se pregunta de cada oración qué hace con las otras; si todo se subraya, no se ve la jerarquía.',
    },
    ahoraTu: {
      generar(s) {
        const B = [
          { o: ['El ejercicio mejora el ánimo.', 'Al moverse, el cuerpo libera sustancias que dan bienestar.', 'Por ejemplo, una caminata de veinte minutos reduce la tensión.'], k: 2, ok: 'Una razón que sostiene la principal', m: [['La idea principal', 'RV42', 'La principal es la 1; la 2 explica por qué.'], ['Un ejemplo', 'RV42', 'El ejemplo es la 3, la caminata.'], ['Un dato aparte', 'RV30', 'Sí sostiene la idea: explica cómo mejora el ánimo.']] },
          { o: ['El lago Titicaca está contaminado en algunas bahías.', 'Llegan desagües sin tratar de varias ciudades.', 'Por ejemplo, la bahía interior de Puno tiene agua verde.'], k: 3, ok: 'Un ejemplo de la principal', m: [['La idea principal', 'RV42', 'La principal es la 1; la 3 la muestra en un lugar.'], ['La causa del problema', 'RV42', 'La causa está en la 2: los desagües.'], ['Un dato aparte', 'RV30', 'Muestra la contaminación: sí la sostiene.']] },
          { o: ['Leer en voz alta ayuda a los niños pequeños.', 'Escuchan palabras nuevas y aprenden a pronunciarlas.', 'Mi tío lee el periódico cada mañana.'], k: 3, ok: 'Un dato que no sostiene la principal', m: [['Un ejemplo de la principal', 'RV30', 'Habla de leer, pero no de niños ni de leer en voz alta.'], ['La idea principal', 'RV42', 'La principal es la 1.'], ['Una razón de la principal', 'RV30', 'No explica por qué leer en voz alta ayuda.']] },
          { o: ['Muchos estudiantes se cansan al leer en pantalla.', 'Sin embargo, leer en papel ayuda a recordar mejor.', 'Por eso, para estudiar conviene imprimir los textos clave.'], k: 3, ok: 'La idea principal: lo que el texto propone', m: [['Un ejemplo', 'RV42', 'No es un caso: es la conclusión que organiza el texto.'], ['Un dato aparte', 'RV30', 'Es lo que el texto quiere decir.'], ['Una razón', 'RV42', 'Las razones son la 1 y la 2; la 3 es a donde llevan.']] },
          { o: ['La papa se puede guardar años si se vuelve chuño.', 'Las heladas la congelan y luego se le saca el agua.', 'Sin agua, no se pudre.'], k: 2, ok: 'Una explicación de cómo se logra', m: [['La idea principal', 'RV42', 'La principal es la 1: que se guarda años.'], ['Un dato aparte', 'RV30', 'Sí sostiene la principal: explica el proceso.'], ['La conclusión', 'RV42', 'La 3 es la razón final; la 2 es el proceso.']] },
        ];
        const b = B[s % B.length];
        return {
          pregunta: `En este texto, ¿qué papel cumple la oración ${b.k}?`,
          dibujo: { datos: { secciones: [{ id: 'o', titulo: 'Texto', modo: 'lista', fragmentos: b.o.map((t, k) => ({ id: `o${k + 1}`, t })) }] }, estado: { marcas: { [`o${b.k}`]: 'o' } } },
          opciones: opciones(b.ok, voltear(b.m, s)),
          solucion: { texto: 'Se pregunta qué hace esa oración con la idea principal.', ecuacion: [prop(`oración ${b.k}`), ' → ', tema('principal')] },
        };
      },
    },
  };

  // ---------- Idea 3: el mapa conceptual muestra relaciones ----------
  // Cambia: el enlace entre dos conceptos del mapa. Permanece: el texto y los conceptos. Progresa: el mapa se vuelve
  // fiel al texto al elegir el enlace que lo dice. Se reserva: el mapa hecho de palabras sueltas (predicción).
  // Debe verse: que el enlace (el verbo) es lo que el mapa afirma.
  const FOTO = { secciones: [
    { id: 't', titulo: 'Texto', modo: 'tarjeta', fragmentos: [{ id: 't1', t: 'Las plantas' }, { id: 't2', t: 'usan' }, { id: 't3', t: 'la luz del sol para producir su alimento. Al hacerlo,' }, { id: 't4', t: 'liberan' }, { id: 't5', t: 'oxígeno.' }] },
  ] };
  // El mapa: tres proposiciones (concepto → enlace → concepto) en una lista; el enlace del medio se prueba.
  const figMapa = () => ({ secciones: [
    FOTO.secciones[0],
    { id: 'm', titulo: 'Mapa conceptual', modo: 'lista', fragmentos: [
      { id: 'p1', t: 'plantas → usan → luz del sol' },
      { id: 'p2a', t: 'plantas →' }, { id: 'e2', hueco: true, junto: true, reserva: 'absorben' }, { id: 'p2b', junto: true, t: '→ oxígeno' },
    ] },
  ] });
  const ENLACE = { liberan: { ok: true, dice: 'Fiel: el texto dice «liberan»' }, absorben: { ok: false, dice: 'Invierte la relación: el texto dice lo contrario' }, oxigeno: { ok: false, dice: 'Sin enlace: no afirma nada' } };
  const estMapa = (e, extra = {}) => Object.assign({ huecos: { e2: e === 'oxigeno' ? '—' : e }, marcas: { e2: ENLACE[e].ok ? 'o' : 'h', t4: 'i', p1: 'i' }, sellos: { m: ENLACE[e].ok ? { t: 'Dice lo del texto', c: 'i' } : { t: 'No es fiel', c: 'h' } } }, extra);
  const mapa = {
    id: 'mapa-conceptual',
    titulo: 'El mapa muestra relaciones',
    temas: ['Mapas conceptuales'],
    pieza: 'rv-texto',
    juega: {
      consigna: 'Completa la segunda proposición del mapa con un enlace. Compara con el texto: ¿el mapa dice lo mismo?',
      voz: 'En un mapa, la flecha y el verbo también afirman.',
      controles: [{ id: 'e', etiqueta: 'Enlace', opciones: [{ valor: 'liberan', texto: 'liberan' }, { valor: 'absorben', texto: 'absorben' }, { valor: 'oxigeno', texto: '(sin enlace)' }] }],
      dibujo: val => ({ datos: figMapa(), estado: estMapa(val.e) }),
      lectura: val => [corto(ENLACE[val.e].ok ? cubre : fuera, ENLACE[val.e].dice)],
      minimo: 3,
    },
    predice: {
      pregunta: 'Un alumno hizo este mapa del texto. ¿Qué le falta?',
      opciones: opciones('Los enlaces que dicen cómo se relacionan', [
        ['Nada: tiene todas las palabras clave', 'RVM1', 'Las palabras están, pero sin enlaces el mapa no afirma ninguna relación.'],
        ['Más palabras del texto', 'RV5', 'Agregar palabras no dice cómo se relacionan.'],
        ['Un dibujo de una planta', 'RVM1', 'Un dibujo puede ayudar a recordar, pero no dice las relaciones.'],
      ]),
      dibujo: { datos: { secciones: [FOTO.secciones[0], { id: 'm', titulo: 'Mapa del alumno', modo: 'tarjeta', fragmentos: [{ id: 'w', t: 'plantas · luz · alimento · oxígeno' }] }] }, estado: { marcas: { w: 'o' } } },
      revelar: { datos: { secciones: [FOTO.secciones[0], { id: 'm', titulo: 'Mapa con enlaces', modo: 'lista', fragmentos: [{ id: 'p1', t: 'plantas → usan → luz' }, { id: 'p2', t: 'luz → sirve para producir → alimento' }, { id: 'p3', t: 'plantas → liberan → oxígeno' }] }] }, estado: { marcas: { t2: 'i', t4: 'i', p1: 'o', p2: 'o', p3: 'o' }, sellos: { m: { t: 'Con relaciones', c: 'i' } } } },
      coincide: 'Coincide: cada enlace es un verbo del texto; eso hace del mapa una lectura.',
    },
    mira: {
      datos: figMapa(),
      pasos: [
        { estado: { huecos: { e2: '—' }, marcas: { t2: 'i', p1: 'i' } }, texto: 'La primera proposición sale del texto: «las plantas usan la luz».', ecuacion: [cubre('plantas'), ' → ', tema('usan'), ' → ', cubre('luz')] },
        { estado: estMapa('absorben', { nuevo: ['e2'] }), texto: '«Absorben oxígeno» suena a ciencia, pero el texto dice otra cosa.', ecuacion: [fuera('absorben'), ' ≠ ', cubre('liberan')] },
        { estado: estMapa('liberan', { nuevo: ['e2'] }), texto: 'Con «liberan», el mapa dice lo mismo que el texto.', ecuacion: [cubre('plantas'), ' → ', prop('liberan'), ' → ', cubre('oxígeno')] },
      ],
    },
    regla: {
      texto: 'Un mapa conceptual representa las ideas de un texto como conceptos unidos por enlaces (verbos o frases). Concepto, enlace y concepto forman una proposición fiel al texto.',
      ecuacion: [cubre('concepto'), ' → ', prop('enlace'), ' → ', cubre('concepto'), ' = proposición'],
      condicion: 'el enlace dice la relación que el texto afirma, en su dirección; palabras sueltas sin enlace no son un mapa.',
    },
    ahoraTu: {
      generar(s) {
        const B = [
          { t: 'La lluvia llena los ríos, y los ríos riegan los valles.', ok: 'ríos → riegan → valles', m: [['valles → riegan → ríos', 'RVM2', 'Tiene las palabras, pero la flecha va al revés.'], ['ríos · valles · lluvia', 'RVM1', 'Son las palabras clave, pero sin enlaces no dice nada.'], ['lluvia → seca → ríos', 'RV7', 'El texto dice lo contrario: la lluvia llena los ríos.']] },
          { t: 'El sol calienta el agua del mar y la convierte en vapor.', ok: 'sol → calienta → agua del mar', m: [['agua del mar → calienta → sol', 'RVM2', 'La relación va al revés.'], ['sol · agua · vapor', 'RVM1', 'Palabras sueltas: falta la relación.'], ['vapor → enfría → sol', 'RV7', 'El texto no dice eso.']] },
          { t: 'Las vacunas protegen al cuerpo contra algunas enfermedades.', ok: 'vacunas → protegen contra → enfermedades', m: [['enfermedades → protegen contra → vacunas', 'RVM2', 'La relación va al revés.'], ['vacunas · cuerpo · enfermedades', 'RVM1', 'Faltan los enlaces.'], ['vacunas → causan → enfermedades', 'RV7', 'Dice lo contrario del texto.']] },
          { t: 'Los árboles sujetan el suelo con sus raíces y evitan los huaicos.', ok: 'raíces → sujetan → suelo', m: [['suelo → sujeta → raíces', 'RVM2', 'La relación va al revés.'], ['árboles · raíces · huaicos', 'RVM1', 'Palabras sueltas: falta qué hace cada una.'], ['árboles → causan → huaicos', 'RV7', 'El texto dice que los evitan.']] },
          { t: 'La totora sirve a los uros para construir sus islas.', ok: 'uros → construyen con → totora', m: [['totora → construye → uros', 'RVM2', 'La relación va al revés: los uros construyen.'], ['totora · uros · islas', 'RVM1', 'Faltan los enlaces.'], ['uros → venden → islas', 'RV7', 'El texto no dice eso.']] },
        ];
        const b = B[s % B.length];
        return {
          pregunta: '¿Qué proposición de un mapa conceptual es fiel al texto?',
          dibujo: { datos: { secciones: [{ id: 't', titulo: 'Texto', modo: 'tarjeta', fragmentos: [{ id: 't1', t: b.t }] }] }, estado: {} },
          opciones: opciones(b.ok, voltear(b.m, s)),
          solucion: { texto: 'El enlace dice lo que el texto afirma, en la misma dirección.', ecuacion: [prop(b.ok.split(' → ')[1])] },
        };
      },
    },
  };

  return {
    unidad: 'razonamiento-verbal.tema-e-idea-principal',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rv-texto.js'],
    historia: {
      texto: 'Entre 1977 y 1980, van Dijk llamó macroestructura al contenido global de un texto: lo que queda cuando se entiende el conjunto y no solo cada oración. El tema puede estar anunciado o tener que construirse. No todo texto tiene una oración que se pueda copiar como su idea principal.',
      pregunta: '¿Dónde está la idea principal si ninguna oración la dice?',
      fuente: { titulo: 'Matriz de teoría de razonamiento verbal (macroestructura)', url: 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/diccio_ele/diccionario/macroestructuratextual.htm' },
    },
    ideas: [temaIdea, jerarquia, mapa],
  };
});
