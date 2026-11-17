/*
 * Teoría de «Tema central e idea principal» (razonamiento-verbal.tema-e-idea-principal). Molde: docs/teoria.md y
 * docs/molde-unidad.md. Rehecha por el contrato «se entiende sin profesor» (etapa 2, docs/plan-calidad.md §7), idea por
 * idea, con lo aprobado por Gerson (docs/etapa2/propuesta-verbal.md; manda docs/etapa2/decisiones.md):
 *   1. tema          «El tema y su medida»        (nueva; aprobada por Gerson el 17 nov)
 *   2. tema-e-idea   «Lo que el texto afirma»     (rehecha; conserva su id y el avance de los alumnos)
 *   3. jerarquia     «Principal y secundarias»    (rehecha; conserva su id)
 *   4. alternativas  «Elegir en el examen»        (nueva; el título entra aquí)
 * El mapa conceptual salió de la unidad (Gerson, 17 nov): su juego queda como mesa del laboratorio sin idea.
 * Objeto de la primera pantalla en verbal: el texto en su soporte, con quién lo escribe y para quién (rv-soporte; el
 * árbol de ideas de la idea 3 es rv-arbol). Textos propios, de situaciones de Puno y del Perú (regla 5): ninguno copia
 * ni parafrasea textos de examen ni de academia. La idea principal va en cualquier lugar: al inicio, en medio, al final o
 * repartida (Gerson, 17 nov).
 *
 * Colores (regla 4, paleta de lectura con papel fijo en todo verbal, igual que app/lectura.js): lo que la frase cubre o
 * sostiene i (turquesa, continuo: la evidencia), la frase o alternativa que se prueba o se descarta o (naranja, a trazos:
 * el distractor), el tema, la idea o la alternativa aceptados f (violeta, punteado: la idea; antes verde d, cambiado el
 * 17 nov por protanopía), lo que queda fuera en gris (rv-soporte, tenue) y lo descartado tachado. El carmín (ángulos) ya
 * no se usa en la unidad. Las letras de las alternativas que nombra un resuelto van en negrita (mala/buena; Gerson,
 * mesa de revisión, 18 nov).
 * Códigos: RV1 (detalle o dato), RV2 (demasiado general), RV3 (solo una parte), RV4 (primera oración), RV11 (absoluto),
 * RV30 (se cree que sobra y sí sostiene), RV42 (cumple otra función), RV43 (todo pesa igual), RV64 (marco o persona del
 * comienzo), RV65 (nombra el tema cuando se pide la idea), RV66 (agrega un asunto); RV64 a RV66 son hipótesis nuevas
 * (docs/investigacion/razonamiento-verbal-ideas-erroneas.md).
 * Los conteos se calculan (regla 1); los textos de los ejemplos se revisaron con un script aparte (scratchpad
 * verbal-revisa.js): cada oración citada existe y cada «las cuatro», «las cinco»… coincide con el soporte.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const corto = (fn, t) => {
    // El trozo de color no se parte: con 14 letras o menos cabe en la miniatura de un caso guardado del laboratorio.
    if (t.length <= 14) return fn(t);
    const k = [t.indexOf(': '), t.indexOf(', ')].filter(i => i > 0).sort((a, b) => a - b)[0];
    if (k && k <= 14) return [fn(t.slice(0, k)), t.slice(k)];
    const ps = t.split(' '); let n = 1;
    while (n < ps.length && ps.slice(0, n + 1).join(' ').length <= 14) n++;
    return [fn(ps.slice(0, n).join(' ')), ' ' + ps.slice(n).join(' ')];
  };
  // Un trozo de color largo puede partirse en renglones (largo: true); si no, en el celular se sale a lo ancho.
  const pinto = v => t => (String(t).length > 14 ? { v, t, largo: true } : { v, t });
  const cubre = pinto('c-i'), prop = pinto('c-o');
  const opciones = (c, malas) => [{ id: 'c', texto: c, correcta: true }, ...malas.map(([texto, error, siFuera], k) => ({ id: `e${k}`, texto, error, siFuera }))];
  const voltear = (arr, s) => (s % 2 ? arr.slice().reverse() : arr.slice());
  // ---------- Idea 1: el tema y su medida (etapa 2, 17 nov; docs/etapa2/propuesta-verbal.md y decisiones.md) ----------
  // Cambia: el peldaño de la escalera de temas. Permanece: los dos avisos del mural. Progresa: qué oraciones cubre el
  // tema y si también le serviría al otro aviso. Se reserva: la persona que abre el texto (predicción).
  // Debe verse: que hay un tema justo, entre los que le sirven a otro texto y los que dejan fuera una parte.
  // Objeto de la primera pantalla (contrato, punto 1, regla de verbal): el texto en su soporte, con quién lo escribe y
  // para quién (rv-soporte, dibujo de prueba). Todos los textos son propios (regla 5).
  // Colores (docs/molde-unidad.md §5b y la paleta de lectura): lo que el tema cubre i (turquesa, continuo), el tema que
  // se prueba o la frase que se descarta o (naranja, a trazos), el tema que mide justo f (violeta, punteado: la idea,
  // Gerson 17 nov), lo que queda fuera en gris (tenue). Los conteos salen de las listas de cada peldaño (regla 1).
  const ESC = () => Kit.piezas['rv-escalera'];
  const justo = pinto('c-f');
  // La letra de una alternativa, en negrita para que no se confunda con el texto (Gerson, mesa de revisión, 18 nov):
  // la descartada en naranja (el distractor) y la correcta en violeta (la idea). El U+2060 (invisible) evita que la
  // letra sola salga en cursiva como una variable de matemática (nucleo/ecuacion.js, LETRA).
  const mala = L => ({ v: 'c-o', t: `${L}\u2060` }), buena = L => ({ v: 'c-f', t: `${L}\u2060` });
  const ora = (pre, lista) => lista.map((t, k) => ({ id: `${pre}${k + 1}`, t }));
  const oracionesDe = sop => sop.hojas.flatMap(h => (h.oraciones || []).map(o => o.id));
  const filasDe = sop => sop.hojas.flatMap(h => [...((h.tabla && h.tabla.filas) || []), ...((h.barras && h.barras.items) || [])].map(f => f.id));
  // Pinta en turquesa lo que el tema cubre y deja en gris todo lo demás del soporte (oraciones, filas y barras).
  const pinta = (sop, ids) => ({ marcas: Object.fromEntries(ids.map(i => [i, 'i'])), tenue: [...oracionesDe(sop), ...filasDe(sop)].filter(i => !ids.includes(i)) });
  const todo = sop => pinta(sop, [...oracionesDe(sop), ...filasDe(sop)]);
  const tabla = (titulo, cols, filas) => ({ titulo, cols, filas: filas.map((c, k) => ({ id: `f${k + 1}`, celdas: c })), nota: 'Datos inventados para el ejercicio.' });
  const barras = (titulo, items) => ({ titulo, max: Math.max(...items.map(x => x[1])), items: items.map(([t, v], k) => ({ id: `b${k + 1}`, t, v })), nota: 'Datos inventados para el ejercicio.' });
  // El criterio de la idea, como dato (contrato, punto 13: en verbal, el dato es la definición o el criterio que se aplica).
  const D_TEMA = 'Tema: de qué trata todo el texto. Si deja fuera una parte, es muy estrecho; si sirve para otro texto, muy amplio.';
  const D_MIXTO = 'Texto mixto: el texto y su tabla o gráfico se leen juntos, como un solo texto.';

  // El mural: el aviso que se estudia y, al lado, el otro aviso (lo que se compara se ve junto: contrato, punto 4).
  const MURAL = { soporte: 'mural', lugar: 'Mural del colegio', hojas: [
    // Quién escribe va en el título y para quién, debajo: así la figura entra en la pantalla del celular.
    { id: 'a1', titulo: 'Comunicado de la Dirección', para: 'estudiantes y familias', oraciones: ora('o', [
      'Desde el lunes, el comedor servirá el desayuno a las 7:15.',
      'Así, quienes vienen de Cabana ya no entrarán sin comer.',
      'La primera semana habrá cinco minutos de tolerancia.',
      'Si su hijo no tomará el desayuno, avise a la Dirección.']) },
    { id: 'a2', chica: true, titulo: 'Aviso del quiosco', para: 'estudiantes', oraciones: ora('q', [
      'El quiosco venderá fruta y emoliente en el recreo.',
      'Cada porción costará un sol.']) },
  ] };
  // La escalera, de lo más amplio a lo más estrecho: qué oraciones del aviso (o) y del quiosco (q) cubre cada peldaño.
  const ESCALERA = [
    { t: 'La vida escolar', o: [1, 2, 3, 4], q: [1, 2], cualquiera: true },
    { t: 'La comida en el colegio', o: [1, 2, 3, 4], q: [1, 2] },
    { t: 'El nuevo horario del desayuno', o: [1, 2, 3, 4], q: [] },
    { t: 'El desayuno de quienes viajan desde lejos', o: [1, 2], q: [] },
    { t: 'La hora del desayuno: 7:15', o: [1], q: [] },
  ];
  const N_AVISO = MURAL.hojas[0].oraciones.length;
  const JUSTO = ESCALERA.findIndex(p => p.o.length === N_AVISO && !p.q.length) + 1;
  const figMural = { soporte: MURAL, titulo: 'Escalera de temas', peldanos: ESCALERA.map(p => p.t), arriba: 'Más amplio', abajo: 'Más estrecho' };
  const estMural = n => {
    const p = ESCALERA[n - 1];
    return { n, color: n === JUSTO ? 'f' : 'o', soporte: pinta(MURAL, [...p.o.map(k => `o${k}`), ...p.q.map(k => `q${k}`)]) };
  };
  const lecturaMural = n => {
    const p = ESCALERA[n - 1];
    if (p.q.length && p.cualquiera) return [prop('Muy amplio'), ': cubre los dos avisos y cualquier otro'];
    if (p.q.length) return [prop('Muy amplio'), ': también cubre el aviso del quiosco'];
    if (p.o.length === N_AVISO) return [justo('Justo'), ': cubre las ', cubre(`${N_AVISO} oraciones`), ' y nada del quiosco'];
    return [prop('Muy estrecho'), ': cubre ', cubre(`${p.o.length} de ${N_AVISO}`), ' oraciones del aviso'];
  };

  // El cartel de la predicción: empieza y termina con una persona que no es el tema.
  const CARTEL = { soporte: 'cartel', lugar: 'Cartel en la entrada de la feria', hojas: [
    { id: 'c', titulo: 'Comunicado', de: 'la junta de la feria', para: 'vendedores y compradores', oraciones: ora('c', [
      'Doña Rufina vende queso en la feria de los domingos desde hace veinte años.',
      'Desde este mes, la feria pide que cada queso lleve una etiqueta con la fecha en que se hizo.',
      'Así, quien compra sabe cuántos días tiene el queso.',
      'Doña Rufina ya encargó sus etiquetas en una imprenta de Juliaca.']) },
  ] };
  const ESC_CARTEL = [
    { t: 'Los alimentos que se venden en las ferias', c: [1, 2, 3, 4] },
    { t: 'La etiqueta con fecha que ahora deben llevar los quesos', c: [1, 2, 3, 4] },
    { t: 'La imprenta que hace las etiquetas', c: [4] },
  ];
  const figCartel = { soporte: CARTEL, titulo: 'Escalera de temas', peldanos: ESC_CARTEL.map(p => p.t), arriba: 'Más amplio', abajo: 'Más estrecho' };
  const estCartel = (n, color, ids, extra = {}) => Object.assign({ n, color, soporte: pinta(CARTEL, ids.map(k => `c${k}`)) }, extra);

  // Lee: la tarjeta de «cubre» lleva su dibujo (contrato, punto 6: la metáfora se presenta con su dibujo antes del juego).
  const UTILES = { soporte: 'cuaderno', lugar: 'Cuaderno de Rosa', frase: { etiqueta: 'Frase', t: 'Los útiles para dibujar' }, hojas: [
    { id: 'u', titulo: 'Útiles para el lunes', de: 'la tutora', para: '1.º\u00a0B', oraciones: ora('u', [
      'Un cuaderno de cien hojas para Matemática.', 'Una caja de colores.', 'Un block de dibujo.']) },
  ] };

  // «Así se resuelve»: textos distintos de los de «Ahora tú» (docs/teoria.md 4e). Las frases candidatas van en el
  // enunciado; en «Lo aplico» la figura marca lo que cubre la frase justa.
  const RESUELVE = [
    { nombre: 'el mensaje',
      sop: { soporte: 'mensaje', lugar: 'Familias de 4.º\u00a0A', hojas: [{ id: 'm', de: 'el tutor', para: 'familias de 4.º\u00a0A', oraciones: ora('m', [
        'El viernes a las 10:00 haremos un simulacro de sismo en el colegio.',
        'Al sonar la sirena, los alumnos saldrán al patio por la escalera de su pabellón.',
        'Ese día no deben traer mochilas pesadas.']) }] },
      enunciado: 'En este mensaje del tutor, ¿cuál es el tema: «la seguridad en el colegio», «el simulacro de sismo del viernes» o «las mochilas pesadas»?',
      datos: [D_TEMA, 'Simulacro de sismo: práctica de cómo salir a un lugar seguro si tiembla.'],
      malas: ['«La seguridad en el colegio» también le serviría a un aviso de extintores: ', prop('muy amplia'), '. «Las mochilas pesadas» cubre solo la 3: ', prop('muy estrecha'), '.'],
      buena: ['«El simulacro de sismo del viernes» cubre ', cubre('las oraciones 1, 2 y 3'), ': cuándo es, qué se hace y qué no traer.'],
      sentido: 'No le serviría a otro mensaje y no deja fuera ninguna oración: tiene la medida justa.',
      respuesta: 'El simulacro de sismo del viernes' },
    { nombre: 'el folleto',
      sop: { soporte: 'folleto', lugar: 'Folleto de la municipalidad de Juliaca', hojas: [{ id: 'j', titulo: 'Municipalidad informa', de: 'la municipalidad', para: 'quienes venden en la calle', oraciones: ora('j', [
        'Julián, de 16 años, ayuda a su mamá a vender emoliente en un paradero de Juliaca.',
        'Desde marzo, la municipalidad pide a quienes venden en la calle usar vasos que se lavan, no descartables.',
        'Así se junta menos basura en los paraderos.',
        'Julián ahora lava los vasos con agua caliente después de cada venta.']) }] },
      enunciado: 'Este folleto empieza con Julián. ¿Su tema es «Julián, el vendedor de emoliente», «los vasos que se lavan en la venta callejera» o «la basura de las ciudades»?',
      datos: [D_TEMA, 'Emoliente: bebida caliente de hierbas que se vende en la calle.', 'Descartable: que se usa una vez y se bota.'],
      malas: ['«Julián» cubre solo la 1 y la 4, que cuentan un caso: ', prop('muy estrecha'), '. «La basura de las ciudades» le serviría a muchos folletos: ', prop('muy amplia'), '.'],
      buena: ['«Los vasos que se lavan» cubre ', cubre('las cuatro'), ': la regla, para qué sirve y un vendedor que ya la cumple.'],
      sentido: 'Julián abre el folleto, pero no es su asunto: el folleto trata de una regla para todos los vendedores.',
      respuesta: 'Los vasos que se lavan en la venta callejera' },
    { nombre: 'el cartel',
      sop: { soporte: 'cartel', lugar: 'Cartel en el muelle de Chimu', hojas: [{ id: 'l', titulo: 'Cuidemos el lago', de: 'la comunidad de Chimu', para: 'vecinos y visitantes', oraciones: ora('l', [
        'Mucha gente cree que lo que cae al lago se lo lleva el agua.',
        'Pero el agua del Titicaca sale muy poco: lo que cae, se queda en el lago.',
        'Por eso, una botella tirada en la orilla puede quedarse ahí muchos años.']) }] },
      enunciado: '¿Cuál es el tema del cartel: «lo que la gente cree del lago», «la contaminación del agua en el mundo» o «la basura que se queda en el Titicaca»?',
      datos: [D_TEMA],
      malas: ['«Lo que la gente cree» cubre solo la 1, que el cartel corrige: ', prop('muy estrecha'), '. «La contaminación en el mundo» le serviría a cualquier cartel: ', prop('muy amplia'), '.'],
      buena: ['«La basura que se queda en el Titicaca» cubre ', cubre('las tres'), ': la 1 dice lo que se cree; la 2 y la 3, lo que pasa.'],
      sentido: 'No le serviría a un cartel de otro lago y no deja fuera ninguna oración.',
      respuesta: 'La basura que se queda en el Titicaca' },
    { nombre: 'el texto', mixto: true,
      sop: { soporte: 'simulacro', numero: 7, hojas: [{ id: 't', oraciones: ora('t', [
        'En Puno, las heladas de junio y julio enferman a muchos niños pequeños.',
        'Por eso, el puesto de salud de Mañazo enseñó a las familias a abrigar a los bebés y a ventilar la casa sin enfriarla.',
        'La tabla compara cuántos niños atendió por resfrío antes y después de la campaña.']),
        tabla: tabla('Niños atendidos por resfrío en junio y julio', ['Año', 'Niños'], [['2024', '90'], ['2025', '35']]) }] },
      enunciado: 'El texto y la tabla giran en torno a una de estas frases: «las heladas de junio y julio», «los 35 niños de 2025», «la salud en el Perú» o «la campaña de Mañazo contra los resfríos de los niños».',
      datos: [D_TEMA, D_MIXTO, 'Ventilar: dejar que entre aire nuevo a la casa.'],
      pide: '«Giran en torno a» pide el tema central: una frase que cubra el texto y también la tabla.',
      malas: ['«Las heladas» es el marco de la 1 y «los 35 niños», una celda de la tabla: ', prop('muy estrechas'), '. «La salud en el Perú»: ', prop('muy amplia'), '.'],
      buena: ['«La campaña de Mañazo» cubre ', cubre('las oraciones 1 a 3'), ' y ', cubre('las dos filas'), ': la tabla muestra lo que logró.'],
      sentido: 'Si se tapa la tabla, la frase sigue cubriendo el texto; si se tapa el texto, la frase explica la tabla.',
      respuesta: 'La campaña de Mañazo contra los resfríos de los niños' },
  ];

  // «Ahora tú»: dos de base, dos con una persona o un lugar al comienzo y dos de examen (texto mixto, 5 alternativas).
  // Cada incorrecta sale de un error de la admisión (docs/etapa2/propuesta-verbal.md, trampas de San Marcos): RV1
  // (detalle o dato del gráfico), RV2 (demasiado general), RV3 (solo una parte), RV64 (la persona, el lugar o el marco
  // del comienzo), RV11 (absoluto) y RV66 (agrega un asunto que el texto no trata); los dos últimos, solo en el examen.
  const AHORA = [
    { sop: { soporte: 'puerta', lugar: 'Puerta del local comunal de Bellavista', hojas: [{ id: 'p', titulo: 'Aviso', de: 'la Municipalidad de Puno', para: 'vecinos de Bellavista', oraciones: ora('p', [
        'Desde el lunes, el camión de la basura pasará por el barrio a las 6:00 de la tarde.',
        'Antes pasaba en la mañana, cuando muchos vecinos ya estaban en el trabajo.',
        'Saquen sus bolsas solo cuando oigan la campana del camión.']) }] },
      pregunta: '¿Cuál es el tema de este aviso de la municipalidad?', datos: [D_TEMA],
      ok: 'El nuevo horario del camión de la basura en el barrio',
      m: [['La limpieza de las ciudades', 'RV2', 'Es del mismo asunto, pero le serviría a cualquier aviso de limpieza, también al de barrer las calles.'],
        ['La campana del camión de la basura', 'RV1', 'Sí está en la 3, pero deja fuera el cambio de hora de la 1 y la 2.']] },
    { sop: { soporte: 'cartel', lugar: 'Cartel en la biblioteca del colegio', hojas: [{ id: 'k', titulo: 'Convocatoria', de: 'la biblioteca', para: 'estudiantes de 1.º a 5.º', oraciones: ora('k', [
        'En agosto habrá un concurso de cuentos escritos por estudiantes del colegio.',
        'Cada cuento puede tener dos páginas como máximo.',
        'Los tres mejores se leerán en la radio del colegio.']) }] },
      pregunta: '¿Cuál es el tema de este cartel de la biblioteca?', datos: [D_TEMA],
      ok: 'El concurso de cuentos de los estudiantes en agosto',
      m: [['La lectura y la escritura', 'RV2', 'Tiene que ver con el cartel, pero le serviría a cualquier texto sobre libros o cuadernos.'],
        ['El largo de cada cuento', 'RV1', 'Sí está en la 2, pero deja fuera el concurso y los premios de la radio.']] },
    { sop: { soporte: 'folleto', lugar: 'Folleto del puesto de salud de Acora', hojas: [{ id: 'e', titulo: 'Puesto de salud informa', de: 'el puesto de salud', para: 'familias de Acora', oraciones: ora('e', [
        'Doña Celia, de Acora, cocinaba con leña en una cocina sin ventana.',
        'El humo de la leña en un cuarto cerrado daña los pulmones de toda la familia.',
        'Por eso, el puesto de salud enseña a construir cocinas mejoradas, con chimenea.',
        'Doña Celia ya tiene la suya, y su casa ya no se llena de humo.']) }] },
      pregunta: 'Este folleto empieza con doña Celia. ¿Cuál es su tema?',
      datos: [D_TEMA, 'Cocina mejorada: cocina de barro o ladrillo con chimenea, que saca el humo de la casa.'],
      ok: 'Las cocinas mejoradas contra el humo dentro de la casa',
      m: [['Doña Celia, la vecina de Acora que cocinaba con leña', 'RV64', 'Ella abre y cierra el folleto, pero es un caso: la 2 y la 3 tratan de las cocinas.'],
        ['La salud de las familias del campo', 'RV2', 'Es del mismo asunto, pero le serviría a un folleto de vacunas o de agua hervida.'],
        ['La chimenea de la cocina mejorada', 'RV1', 'Sí está en la 3, pero deja fuera el daño del humo de la 2.']] },
    { sop: { soporte: 'cartel', lugar: 'Cartel en la entrada de la feria de Ilave', hojas: [{ id: 'v', titulo: 'Comunicado', de: 'la municipalidad', para: 'vendedores y compradores', oraciones: ora('v', [
        'Ilave tiene una de las ferias de los domingos más grandes del sur.',
        'Desde junio, una parte de la feria será solo para productos sin químicos.',
        'Ahí podrán vender quienes muestren su constancia de la municipalidad.',
        'Así, quien compra sabe que esa papa o esa quinua se cultivó sin fertilizantes químicos.']) }] },
      pregunta: 'Este cartel empieza hablando de Ilave. ¿Cuál es su tema?',
      datos: [D_TEMA, 'Fertilizante químico: producto de fábrica que se echa a la tierra para que la planta crezca.'],
      ok: 'La nueva zona de productos sin químicos en la feria de Ilave',
      m: [['La feria de Ilave, una de las más grandes del sur', 'RV64', 'La 1 presenta la feria y el lugar, pero el cartel trata de la zona nueva.'],
        ['La comida sana', 'RV2', 'Tiene que ver con el cartel, pero le serviría a cualquier texto sobre comer bien.'],
        ['La constancia de la municipalidad', 'RV1', 'Sí está en la 3, pero deja fuera la zona nueva y para qué sirve.']] },
    { mixto: true, sop: { soporte: 'simulacro', numero: 14, hojas: [{ id: 't', oraciones: ora('t', [
        'La biblioteca de un colegio de Juliaca empezó a prestar libros para llevar a casa.',
        'Antes, los libros no podían salir de la sala de lectura.',
        'El gráfico muestra cuántos libros se leyeron en un mes, antes y después del cambio.',
        'Los profesores cuentan que ahora más alumnos comentan en clase lo que leyeron.']),
        barras: barras('Libros leídos en un mes', [['Antes', 40], ['Después', 160]]) }] },
      pregunta: 'El texto y el gráfico giran, principalmente, en torno a', datos: [D_TEMA, D_MIXTO],
      ok: 'El préstamo de libros para la casa y cuánto más leen los alumnos',
      m: [['La educación en los colegios de Juliaca', 'RV2', 'Es del mismo asunto, pero le serviría a un texto sobre uniformes o exámenes.'],
        ['Los 160 libros que se leyeron en un mes', 'RV1', 'Leíste bien el gráfico, pero es una barra: deja fuera el préstamo del texto.'],
        ['Los libros que antes no salían de la sala', 'RV3', 'Sí está en la 2, pero es el antes: deja fuera el cambio y el gráfico.'],
        ['El préstamo como la única forma de que los alumnos lean', 'RV11', 'Habla del préstamo, pero el texto no dice «única»: agrega algo que no trata.']] },
    { mixto: true, sop: { soporte: 'simulacro', numero: 15, hojas: [{ id: 't', oraciones: ora('t', [
        'En un colegio de Juliaca, el agua del caño llega solo tres horas al día.',
        'Por eso, los alumnos pusieron canaletas en el techo para juntar el agua de lluvia en dos tanques.',
        'Esa agua se usa para regar el biohuerto y limpiar los baños.',
        'La tabla muestra cuánta agua juntaron en los meses de lluvia.']),
        tabla: tabla('Agua de lluvia juntada', ['Mes', 'Litros'], [['Enero', '2400'], ['Febrero', '3100']]) }] },
      pregunta: 'El texto y la tabla dan cuenta, principalmente, de',
      datos: [D_TEMA, D_MIXTO, 'Canaleta: canal en el borde del techo que lleva el agua de lluvia.'],
      ok: 'Cómo un colegio junta agua de lluvia para cuando falta la del caño',
      m: [['El agua del caño, que llega solo tres horas al día', 'RV64', 'Es la 1, el problema que abre el texto, pero deja fuera las canaletas y la tabla.'],
        ['El cuidado del agua en el Perú', 'RV2', 'Es del mismo asunto, pero le serviría a cualquier texto sobre el agua.'],
        ['Los 3100 litros que se juntaron en febrero', 'RV1', 'Leíste bien la tabla, pero es una celda: deja fuera el texto.'],
        ['Las enfermedades que causa el agua guardada en tanques', 'RV66', 'Habla de los tanques, pero el texto no trata de enfermedades: agrega un asunto.']] },
  ];

  // Ejemplos resueltos (pestaña «Ejemplos», docs/teoria.md 4h; docs/metodo/unidad/2-ejemplos.md). La figura es el texto en
  // su soporte, sin ninguna marca (muestra el planteamiento, no la respuesta); en el resuelto, lo que cubre la frase va en
  // turquesa, lo que se descarta en naranja y la respuesta en violeta. Nivel 1: tres frases y una sola prueba. Nivel 2: una
  // trampa de estructura (persona, lugar o creencia al comienzo, dos avisos, dos partes) y cuatro frases. Nivel 3: hoja de
  // simulacro con cinco alternativas, cada una con su falla, y la redacción del examen. Revisado aparte (scratchpad
  // verbal-ejemplos.js): cada número de oración que cita un resuelto existe en su texto, y «las cuatro», «las cinco»…
  // coinciden con las oraciones del soporte.
  const fig = sop => ({ pieza: 'rv-soporte', datos: sop, estado: {} });
  const EJEMPLOS_TEMA = [
    { nivel: 1, titulo: 'El aviso del puesto de salud',
      enunciado: '¿Cuál es el tema del aviso: «la salud de las familias», «la vacunación contra la influenza en el puesto de salud» o «el DNI de los vecinos»?',
      datos: [D_TEMA, 'Influenza: la gripe, una enfermedad que se contagia.'],
      figura: fig({ soporte: 'puerta', lugar: 'Puerta del puesto de salud', hojas: [{ id: 'h', titulo: 'Aviso', de: 'el puesto de salud', para: 'vecinos', oraciones: ora('h', [
        'El puesto de salud vacunará contra la influenza del 2 al 6 de junio.', 'Pueden ir niños, adultos mayores y personas con asma.', 'La vacuna es gratuita.', 'Hay que llevar el DNI.']) }] }),
      solucion: [
        { texto: ['«La salud de las familias» también le serviría a un aviso del dentista: ', prop('muy amplia'), '. «El DNI» cubre solo la 4: ', prop('muy estrecha'), '.'] },
        { texto: ['«La vacunación contra la influenza» cubre ', cubre('las oraciones 1 a 4'), ': cuándo, quiénes pueden ir, cuánto cuesta y qué llevar.'] }],
      respuesta: [justo('La vacunación contra la influenza en el puesto de salud')] },
    { nivel: 1, titulo: 'El cartel del patio',
      enunciado: '¿Cuál es el tema del cartel: «el deporte en el colegio», «el campeonato de vóley de las secciones de quinto» o «los suplentes de cada equipo»?',
      datos: [D_TEMA],
      figura: fig({ soporte: 'cartel', lugar: 'Cartel en el patio', hojas: [{ id: 'h', titulo: 'Convocatoria', de: 'Educación Física', para: 'secciones de 5.º', oraciones: ora('h', [
        'El sábado empieza el campeonato de vóley entre las secciones de quinto.', 'Cada sección inscribe un equipo de seis jugadoras y dos suplentes.',
        'Los partidos serán en el coliseo del colegio, desde las 9:00.', 'El equipo ganador representará al colegio en los Juegos Escolares.']) }] }),
      solucion: [
        { texto: ['«El deporte en el colegio» le serviría a un cartel de fútbol o de atletismo: ', prop('muy amplia'), '. «Los suplentes» cubre una parte de la 2: ', prop('muy estrecha'), '.'] },
        { texto: ['«El campeonato de vóley» cubre ', cubre('las cuatro'), ': cuándo empieza, quiénes juegan, dónde y qué gana el campeón.'] }],
      respuesta: [justo('El campeonato de vóley de las secciones de quinto')] },
    { nivel: 1, titulo: 'El mensaje de la tutora',
      enunciado: '¿Cuál es el tema del mensaje: «las fiestas de Puno», «el desfile de 5.º\u00a0B por el aniversario de Puno» o «el uniforme de gala»?',
      datos: [D_TEMA],
      figura: fig({ soporte: 'mensaje', lugar: 'Familias de 5.º\u00a0B', hojas: [{ id: 'h', de: 'la tutora', para: 'familias de 5.º\u00a0B', oraciones: ora('h', [
        'El jueves no habrá clases por el aniversario de Puno.', 'Los alumnos de 5.º\u00a0B desfilarán a las 10:00 en la plaza de Armas.',
        'Deben ir con uniforme de gala y llegar a las 9:00.', 'Después del desfile, cada familia recoge a su hijo en la plaza.']) }] }),
      solucion: [
        { texto: ['«Las fiestas de Puno» le serviría a un mensaje sobre la Candelaria: ', prop('muy amplia'), '. «El uniforme de gala» cubre solo la 3: ', prop('muy estrecha'), '.'] },
        { texto: ['«El desfile de 5.º\u00a0B» cubre ', cubre('las cuatro'), ': el día sin clases, la hora, la ropa y el recojo.'] }],
      respuesta: [justo('El desfile de 5.º\u00a0B por el aniversario de Puno')] },
    { nivel: 1, titulo: 'El folleto del muelle',
      enunciado: 'Para este folleto, ¿la frase «los viajes por el lago Titicaca» es muy amplia, justa o muy estrecha?',
      datos: [D_TEMA],
      figura: fig({ soporte: 'folleto', lugar: 'Folleto del muelle de Puno', hojas: [{ id: 'h', titulo: 'Información para visitantes', de: 'la caseta del muelle', para: 'visitantes', oraciones: ora('h', [
        'Las lanchas a la isla Taquile salen del muelle de Puno a las 7:00 y a las 8:00.', 'El viaje dura unas tres horas.',
        'El boleto de ida y vuelta se compra en la caseta del muelle.', 'Conviene llevar abrigo: en el lago hace frío.']) }] }),
      solucion: [
        { texto: ['La frase cubre ', cubre('las cuatro oraciones'), ', pero también le serviría a un folleto de lanchas a Amantaní o a los uros: ', prop('muy amplia'), '.'] },
        { texto: ['Un tema justo sería ', justo('«las lanchas a Taquile desde el muelle de Puno»'), ': cubre las cuatro y solo este folleto.'] }],
      respuesta: [justo('Muy amplia'), ': le serviría a otro folleto del lago'] },
    { nivel: 1, titulo: 'La nota de Rosa',
      enunciado: '¿Cuál es el tema de la nota: «las plantas del lago», «dónde crece la totora en el lago» o «el sol que necesita la totora»?',
      datos: [D_TEMA],
      figura: fig({ soporte: 'cuaderno', lugar: 'Cuaderno de Rosa', hojas: [{ id: 'h', titulo: 'Ciencia y Ambiente', de: 'Rosa', para: 'estudiar para la práctica', oraciones: ora('h', [
        'La totora crece en las orillas poco hondas del lago Titicaca.', 'Necesita agua quieta y mucho sol.', 'Donde el lago es muy hondo, la totora no crece.']) }] }),
      solucion: [
        { texto: ['«Las plantas del lago» le serviría a una nota sobre el llachu u otras plantas: ', prop('muy amplia'), '. «El sol» cubre una parte de la 2: ', prop('muy estrecha'), '.'] },
        { texto: ['«Dónde crece la totora» cubre ', cubre('las tres'), ': la 1 ya lo dice, y la 2 y la 3 lo explican.'] }],
      respuesta: [justo('Dónde crece la totora en el lago')] },

    { nivel: 2, titulo: 'La bodega de don Mateo',
      enunciado: '¿Cuál es el tema: «don Mateo, el bodeguero de Ilave», «la prohibición de las bolsas de plástico en Ilave», «el cuidado del ambiente» o «la multa para quien no cumpla»?',
      datos: [D_TEMA],
      figura: fig({ soporte: 'folleto', lugar: 'Folleto de la municipalidad de Ilave', hojas: [{ id: 'h', titulo: 'Municipalidad informa', de: 'la municipalidad', para: 'bodegas y mercados', oraciones: ora('h', [
        'Don Mateo tiene una bodega en Ilave y siempre dio bolsas de plástico.', 'Desde julio, la municipalidad prohíbe entregar bolsas de plástico en bodegas y mercados.',
        'Quien vende debe ofrecer bolsas de tela o de papel.', 'Quien no cumpla pagará una multa.', 'Don Mateo ya compró sus primeras bolsas de tela.']) }] }),
      solucion: [
        { texto: ['Primero, de qué tratan las oraciones: la 1 y la 5 cuentan el caso de don Mateo; ', cubre('la 2, la 3 y la 4'), ' tratan de la prohibición.'] },
        { texto: ['«Don Mateo» deja fuera la regla y «la multa» cubre solo la 4: ', prop('muy estrechas'), '. «El cuidado del ambiente» le serviría a otro folleto: ', prop('muy amplia'), '.'] },
        { texto: ['«La prohibición de las bolsas» cubre ', cubre('las cinco'), ': don Mateo es una bodega a la que le llega la regla.'] }],
      respuesta: [justo('La prohibición de las bolsas de plástico en Ilave')] },
    { nivel: 2, titulo: 'Las laptops de la biblioteca',
      enunciado: '¿Cuál es el tema: «la plaza de Armas de Juliaca», «el préstamo de laptops en la biblioteca municipal», «las bibliotecas del Perú» o «el carné de estudiante»?',
      datos: [D_TEMA, 'Laptop: computadora portátil.'],
      figura: fig({ soporte: 'puerta', lugar: 'Puerta de la biblioteca municipal', hojas: [{ id: 'h', titulo: 'Aviso', de: 'la biblioteca municipal', para: 'estudiantes', oraciones: ora('h', [
        'La biblioteca municipal está en la plaza de Armas de Juliaca.', 'Desde abril, prestará laptops a los estudiantes por dos horas.',
        'Para pedir una, hay que dejar el carné de estudiante.', 'Las laptops no salen de la sala de lectura.']) }] }),
      solucion: [
        { texto: ['La 1 dice dónde está la biblioteca: es el lugar, no el asunto. ', cubre('La 2, la 3 y la 4'), ' tratan del préstamo.'] },
        { texto: ['«La plaza de Armas» y «el carné» cubren una oración cada una: ', prop('muy estrechas'), '. «Las bibliotecas del Perú»: ', prop('muy amplia'), '.'] },
        { texto: ['«El préstamo de laptops en la biblioteca municipal» cubre ', cubre('las cuatro'), ': la 1 dice dónde se presta.'] }],
      respuesta: [justo('El préstamo de laptops en la biblioteca municipal')] },
    { nivel: 2, titulo: 'El sol de la altura',
      enunciado: '¿Cuál es el tema: «lo que la gente cree del frío», «el sol que quema en la altura y cómo protegerse», «el clima del Perú» o «el bloqueador para los niños»?',
      datos: [D_TEMA, 'Bloqueador: crema que protege la piel del sol.'],
      figura: fig({ soporte: 'folleto', lugar: 'Folleto del puesto de salud de Puno', hojas: [{ id: 'h', titulo: 'Puesto de salud informa', de: 'el puesto de salud', para: 'familias', oraciones: ora('h', [
        'Mucha gente cree que el sol de la sierra no quema cuando hace frío.', 'Pero en Puno, por la altura, el sol quema más que en la costa, aunque el aire esté helado.',
        'Por eso, conviene usar sombrero y bloqueador también en invierno.', 'Los niños y quienes trabajan en el campo son los que más se exponen.']) }] }),
      solucion: [
        { texto: ['La 1 dice lo que se cree y la 2 lo corrige: ', cubre('la 2, la 3 y la 4'), ' tratan del sol que quema y de cómo cuidarse.'] },
        { texto: ['«Lo que la gente cree» cubre solo la 1, y «el bloqueador», parte de la 3: ', prop('muy estrechas'), '. «El clima del Perú»: ', prop('muy amplia'), '.'] },
        { texto: ['«El sol que quema en la altura y cómo protegerse» cubre ', cubre('las cuatro'), ', también la creencia que corrige.'] }],
      respuesta: [justo('El sol que quema en la altura y cómo protegerse')] },
    { nivel: 2, titulo: 'Dos avisos del club',
      enunciado: '¿«Las actividades del Club de Ciencias» es el tema del aviso 1? Si no lo es, ¿cuál sería?',
      datos: [D_TEMA],
      figura: fig({ soporte: 'mural', lugar: 'Mural del laboratorio', hojas: [
        { id: 'h', titulo: 'Aviso 1', de: 'el Club de Ciencias', para: 'estudiantes', oraciones: ora('h', [
          'En junio, el Club de Ciencias medirá cada mañana la temperatura del patio.', 'Los datos se anotarán en una tabla pegada en el laboratorio.', 'Al final del mes, se verá cuántos días heló.']) },
        { id: 'g', chica: true, titulo: 'Aviso 2', de: 'el Club de Ciencias', para: 'estudiantes', oraciones: ora('g', [
          'El viernes, el club visitará la planta de agua de Puno.', 'Hay que traer la autorización firmada.']) }] }),
      solucion: [
        { texto: ['La frase cubre las tres oraciones del aviso 1, pero también ', prop('las dos del aviso 2'), ': le sirve a otro texto. Es ', prop('muy amplia'), '.'] },
        { texto: ['Hay que bajar un peldaño: ', justo('«la medición diaria de la temperatura del patio en junio»'), ' cubre ', cubre('las tres'), ' y nada del aviso 2.'] }],
      respuesta: [justo('No'), ': el tema es la medición diaria de la temperatura del patio'] },
    { nivel: 2, titulo: 'Los waru waru de Acora',
      enunciado: '¿Cuál es el tema: «las heladas que queman la papa», «el regreso de los waru waru en Acora contra las heladas», «la agricultura en el altiplano» o «los canales con agua»?',
      datos: [D_TEMA, 'Camellón: lomo de tierra largo donde se siembra.'],
      figura: fig({ soporte: 'folleto', lugar: 'Folleto de la agencia agraria de Acora', hojas: [{ id: 'h', titulo: 'Agencia agraria informa', de: 'la agencia agraria', para: 'agricultores', oraciones: ora('h', [
        'En los últimos años, las heladas llegan antes y queman la papa recién sembrada.', 'Por eso, muchas familias de Acora vuelven a usar los waru waru.',
        'Son camellones de tierra rodeados de canales con agua.', 'El agua guarda el calor del día y protege a las plantas en la noche.']) }] }),
      solucion: [
        { texto: ['El texto tiene dos partes: un problema (', cubre('la 1'), ') y lo que hacen las familias contra él (', cubre('la 2, la 3 y la 4'), ').'] },
        { texto: ['«Las heladas» cubre solo el problema y «los canales», parte de la 3: ', prop('muy estrechas'), '. «La agricultura en el altiplano»: ', prop('muy amplia'), '.'] },
        { texto: ['«El regreso de los waru waru contra las heladas» cubre ', cubre('las dos partes'), ', sin dejar ninguna oración fuera.'] }],
      respuesta: [justo('El regreso de los waru waru en Acora contra las heladas')] },

    { nivel: 3, titulo: 'La ciclovía y el gráfico',
      enunciado: 'Pregunta 8 del simulacro: «El texto y el gráfico giran, principalmente, en torno a». ¿Qué alternativa es la correcta?',
      datos: [D_TEMA, D_MIXTO, 'Ciclovía: carril de la pista solo para bicicletas.'],
      figura: fig({ soporte: 'simulacro', numero: 8, hojas: [{ id: 'h', oraciones: ora('h', [
        'Hace cinco años, casi ningún alumno de un colegio de Juliaca iba a clases en bicicleta.',
        'Desde que se abrió una ciclovía cerca del colegio, cada vez más estudiantes la usan.',
        'El gráfico compara cuántos llegaban en bicicleta antes y después de la ciclovía.',
        'Los padres dicen que ahora sus hijos llegan más temprano y gastan menos en pasajes.']),
        barras: barras('Alumnos que llegan en bicicleta', [['Antes', 12], ['Después', 85]]) }],
        pregunta: 'El texto y el gráfico giran, principalmente, en torno a', alternativas: [
          { id: 'A', t: 'el tránsito de la ciudad de Juliaca.' }, { id: 'B', t: 'los 85 alumnos que hoy llegan en bicicleta.' },
          { id: 'C', t: 'el aumento de alumnos que van al colegio en bicicleta desde que se abrió la ciclovía.' },
          { id: 'D', t: 'lo que las familias ahorran en pasajes.' }, { id: 'E', t: 'la bicicleta como el único transporte seguro para los escolares.' }] }),
      solucion: [
        { texto: ['«Giran en torno a» pide el tema central: una frase que cubra ', cubre('las cuatro oraciones'), ' y ', cubre('el gráfico'), '.'] },
        { texto: [mala('A'), ' le serviría a cualquier texto sobre la ciudad: ', prop('muy amplia'), '. ', mala('B'), ' es una barra y ', mala('D'), ', solo la 4: ', prop('muy estrechas'), '.'] },
        { texto: [mala('E'), ' dice «único» y «seguro», y el texto no compara la bicicleta con otros transportes: habla de algo que no trata.'] },
        { texto: [buena('C'), ' cubre ', cubre('las oraciones 1 a 4'), ' y ', cubre('las dos barras'), ': el antes, el después y lo que cambió.'] }],
      respuesta: [buena('C'), ': el aumento de alumnos en bicicleta desde la ciclovía'] },
    { nivel: 3, titulo: 'El caño que gotea',
      enunciado: 'Pregunta 9 del simulacro: «El texto y la tabla dan cuenta, principalmente, de». ¿Qué alternativa es la correcta?',
      datos: [D_TEMA, D_MIXTO],
      figura: fig({ soporte: 'simulacro', numero: 9, hojas: [{ id: 'h', oraciones: ora('h', [
        'En muchas casas de Puno, un caño que gotea pasa meses sin arreglarse.', 'Parece poco, pero un goteo de todo el día suma muchos litros en un mes.',
        'La tabla compara cuánta agua pierden en un mes dos caños que gotean.', 'Por eso, la empresa de agua pide a las familias revisar sus caños cada mes.']),
        tabla: tabla('Agua que se pierde en un mes', ['Caño', 'Litros'], [['Gotea poco', '150'], ['Gotea mucho', '900']]) }],
        pregunta: 'El texto y la tabla dan cuenta, principalmente, de', alternativas: [
          { id: 'A', t: 'el agua potable en las ciudades del Perú.' }, { id: 'B', t: 'los 900 litros que pierde un caño que gotea mucho.' },
          { id: 'C', t: 'el agua que se pierde por los caños que gotean y por qué hay que revisarlos.' },
          { id: 'D', t: 'la empresa de agua de Puno.' }, { id: 'E', t: 'cómo arreglar un caño en casa sin pedir ayuda.' }] }),
      solucion: [
        { texto: ['«Dan cuenta, principalmente, de» pide el tema central: lo que cubren juntos ', cubre('el texto'), ' y ', cubre('la tabla'), '.'] },
        { texto: [mala('A'), ': ', prop('muy amplia'), '. ', mala('B'), ' es una celda de la tabla y ', mala('D'), ', quien aparece en la 4: ', prop('muy estrechas'), '. ', mala('E'), ': el texto no explica cómo arreglar un caño.'] },
        { texto: [buena('C'), ' cubre ', cubre('las oraciones 1 a 4'), ' y ', cubre('las dos filas'), ': el goteo, cuánto se pierde y el pedido de revisar.'] }],
      respuesta: [buena('C'), ': el agua que se pierde por los caños que gotean'] },
    { nivel: 3, titulo: 'La radio del campo',
      enunciado: 'Pregunta 10 del simulacro: «¿Cuál es el tema central del texto?». ¿Qué alternativa es la correcta?',
      datos: [D_TEMA, 'Chacra: terreno donde una familia siembra.'],
      figura: fig({ soporte: 'simulacro', numero: 10, hojas: [{ id: 'h', oraciones: ora('h', [
        'A las cinco de la mañana, en muchas casas del campo de Puno ya está prendida la radio.',
        'Antes de salir a la chacra, las familias escuchan las noticias en quechua o en aimara.',
        'Así se enteran de las heladas que vienen, del precio de la papa en la feria y de las reuniones de la comunidad.',
        'Muchos oyentes llaman para mandar saludos o para avisar que se les perdió un animal.',
        'Para quienes viven lejos de la ciudad, la radio sigue siendo la forma más rápida de saber qué pasa.']) }],
        pregunta: '¿Cuál es el tema central del texto?', alternativas: [
          { id: 'A', t: 'Las mañanas en el campo de Puno' }, { id: 'B', t: 'Los medios de comunicación en el Perú' },
          { id: 'C', t: 'Las heladas que anuncia la radio' },
          { id: 'D', t: 'La radio en quechua y aimara como fuente de noticias para las familias del campo' },
          { id: 'E', t: 'La radio como reemplazo del celular en el campo' }] }),
      solucion: [
        { texto: ['La 1 abre con la hora y el lugar; ', cubre('de la 2 a la 5'), ' tratan de lo que la radio en quechua y aimara les da a las familias.'] },
        { texto: [mala('A'), ' es el marco de la 1 y ', mala('C'), ', parte de la 3: ', prop('muy estrechas'), '. ', mala('B'), ' le serviría a un texto sobre periódicos: ', prop('muy amplia'), '.'] },
        { texto: [mala('E'), ' agrega el celular, del que el texto no habla. ', buena('D'), ' cubre ', cubre('las cinco oraciones'), '.'] }],
      respuesta: [buena('D'), ': la radio en quechua y aimara para las familias del campo'] },
    { nivel: 3, titulo: 'Dos opiniones sobre el uniforme',
      enunciado: 'En esta pregunta hay dos textos, A y B, de dos autores. ¿Qué alternativa dice el tema que discuten los dos?',
      datos: [D_TEMA, 'Textos A y B: dos autores que opinan sobre un mismo asunto.'],
      figura: fig({ soporte: 'simulacro', numero: 21, hojas: [
        { id: 'ha', titulo: 'Texto A', oraciones: ora('a', ['El uniforme escolar debería ser obligatorio.', 'Así, nadie se fija en quién tiene la ropa más cara.', 'Además, en la puerta se reconoce rápido quién es del colegio.']) },
        { id: 'hb', titulo: 'Texto B', oraciones: ora('b', ['El uniforme escolar no debería ser obligatorio.', 'Para muchas familias de Puno, comprar dos juegos cada año es un gasto grande.', 'Un buzo sencillo cumpliría la misma función.']) }],
        pregunta: '¿Cuál es el tema que discuten los dos textos?', alternativas: [
          { id: 'A', t: 'Las ventajas del uniforme escolar' }, { id: 'B', t: 'Si el uniforme escolar debe ser obligatorio' },
          { id: 'C', t: 'La ropa de los jóvenes de hoy' }, { id: 'D', t: 'El precio del uniforme para las familias de Puno' },
          { id: 'E', t: 'El uniforme como la causa de la igualdad en todos los colegios' }] }),
      solucion: [
        { texto: ['El texto A defiende el uniforme obligatorio y el texto B, lo contrario: el tema tiene que cubrir ', cubre('los dos textos'), '.'] },
        { texto: ['La alternativa ', mala('A'), ' cubre solo el texto A, y la ', mala('D'), ', una oración del B: ', prop('muy estrechas'), '. La ', mala('C'), ': ', prop('muy amplia'), '.'] },
        { texto: ['La ', mala('E'), ' agrega una causa y «todos los colegios», que ningún texto dice. La ', buena('B'), ' cubre ', cubre('las seis oraciones'), ': es lo que discuten.'] }],
      respuesta: [buena('B'), ': si el uniforme escolar debe ser obligatorio'] },
    { nivel: 3, titulo: 'Las truchas del lago',
      enunciado: 'Pregunta 12 del simulacro: «El texto y la tabla giran, principalmente, en torno a». ¿Qué alternativa es la correcta?',
      datos: [D_TEMA, D_MIXTO, 'Jaula flotante: red que cuelga de un marco sobre el agua, donde se crían peces.'],
      figura: fig({ soporte: 'simulacro', numero: 12, hojas: [{ id: 'h', oraciones: ora('h', [
        'La crianza de truchas en jaulas flotantes creció mucho en el lago Titicaca.', 'Muchas familias de la orilla ganan más que cuando solo pescaban.',
        'Pero el alimento que sobra y los restos de los peces ensucian el agua cerca de las jaulas.', 'La tabla muestra cuántas familias crían truchas en una bahía.']),
        tabla: tabla('Familias que crían truchas en una bahía', ['Año', 'Familias'], [['2010', '30'], ['2025', '120']]) }],
        pregunta: 'El texto y la tabla giran, principalmente, en torno a', alternativas: [
          { id: 'A', t: 'el crecimiento de la crianza de truchas en el lago y el daño que causa al agua.' }, { id: 'B', t: 'las 120 familias que crían truchas en 2025.' },
          { id: 'C', t: 'los peces del lago Titicaca.' }, { id: 'D', t: 'lo que ganan las familias que crían truchas.' },
          { id: 'E', t: 'la prohibición de las jaulas flotantes en todo el lago.' }] }),
      solucion: [
        { texto: ['El texto tiene dos caras: ', cubre('lo que se gana'), ' (la 1, la 2 y la tabla) y ', cubre('lo que se ensucia'), ' (la 3).'] },
        { texto: [mala('D'), ' cubre solo la ganancia y ', mala('B'), ' es una celda: ', prop('muy estrechas'), '. ', mala('C'), ' le serviría a un texto sobre el ispi o el carachi: ', prop('muy amplia'), '.'] },
        { texto: [mala('E'), ' agrega una prohibición que el texto no menciona. ', buena('A'), ' cubre ', cubre('las dos caras'), ' y la tabla.'] }],
      respuesta: [buena('A'), ': la crianza de truchas que crece y ensucia el agua'] },
  ];

  const temaMedida = {
    id: 'tema',
    titulo: 'El tema y su medida',
    pregunta: '¿Cómo se dice de qué trata un texto?',
    temas: ['Tema central'],
    pieza: 'rv-escalera',
    lee: {
      tarjetas: [
        { titulo: 'Todo texto habla de algo', texto: 'Un aviso del mural, un cartel de la feria o un mensaje del grupo de padres hablan de algo: ese asunto es su tema. Y alguien lo escribe para alguien: la Dirección, para los alumnos y sus familias.' },
        { titulo: 'Una frase corta', texto: 'El tema se dice en una frase corta, como el nombre de una carpeta: «La feria de ciencias». No es una oración entera: nombra el asunto, no cuenta qué pasa con él.' },
        { titulo: 'Qué quiere decir «cubre»', texto: 'Una frase cubre una oración cuando esa oración habla de lo que la frase nombra. En las figuras, lo que la frase cubre va en turquesa; lo que queda fuera, en gris.',
          pieza: 'rv-soporte', dibujo: { datos: UTILES, estado: { marcas: { u2: 'i', u3: 'i' }, tenue: ['u1'] } } },
        { titulo: 'Qué mirar al jugar', texto: 'En el mural hay dos avisos y, debajo, una escalera de temas: arriba, los más amplios; abajo, los más estrechos. Muévete por la escalera y mira qué oraciones se pintan en los dos avisos.' },
      ],
    },
    actividad: 'Subir y bajar por una escalera de temas, de lo más amplio a lo más estrecho.',
    aprendizaje: 'El tema dice de qué trata todo el texto: si deja fuera una parte, es muy estrecho; si le sirve a otro texto, muy amplio.',
    ejemplos: EJEMPLOS_TEMA,
    juega: {
      consigna: 'En el mural del colegio hay dos avisos. Busca el tema del primero: el que dice de qué trata todo, y solo eso.',
      mision: {
        texto: 'Elige el peldaño que cubra las 4 oraciones del aviso y nada del otro.',
        logrado: val => val.n === JUSTO,
        bien: 'Listo: cubre las 4 oraciones y no le serviría al aviso del quiosco.',
      },
      voz: 'Prueba arriba y abajo de la escalera, y mira también el aviso del quiosco.',
      leyenda: [
        { s: '1, 2, 3, 4', t: 'número de cada oración del aviso' },
        { s: cubre('turquesa'), t: 'oración que el tema cubre' },
        { s: 'gris', t: 'oración que queda fuera' },
        { s: prop('naranja'), t: 'el tema que estás probando' },
        { s: justo('violeta'), t: 'el tema con la medida justa' },
      ],
      controles: [{ id: 'n', etiqueta: 'Peldaño de la escalera', min: 1, max: ESCALERA.length, paso: 1, inicio: 1, decimales: 0, color: 'c-o' }],
      dibujo: val => ({ datos: figMural, estado: estMural(val.n) }),
      lectura: val => lecturaMural(val.n),
      // Gesto directo (docs/teoria.md §4b): el marcador se arrastra por los largueros y se suelta en un peldaño.
      arrastres: [{ id: 'peldano', etiqueta: 'marcador de la escalera de temas', color: 'c-o',
        donde: val => ESC().ancla(figMural, val.n),
        mover: pt => ({ n: ESC().peldanoEn(figMural, pt) }) }],
      minimo: 4,
    },
    predice: {
      pregunta: 'Este cartel de la feria empieza nombrando a una vendedora. ¿Cuál es su tema?',
      datos: ['Tema: de qué trata todo el texto, dicho en una frase.', 'Etiqueta: papel pegado a un producto, con sus datos.'],
      opciones: [
        { id: 'c', texto: 'La etiqueta con fecha que ahora deben llevar los quesos', correcta: true },
        { id: 'persona', texto: 'Doña Rufina, la vendedora que lleva veinte años en la feria', error: 'RV64', siFuera: 'Ella abre y cierra el cartel; sería el tema si todo contara su vida, no la etiqueta.' },
        { id: 'amplio', texto: 'Los alimentos que se venden en las ferias', error: 'RV2', siFuera: 'Es del mismo asunto, pero le serviría a cualquier cartel de feria, también al de las frutas.' },
        { id: 'detalle', texto: 'La imprenta donde se hacen las etiquetas', error: 'RV1', siFuera: 'Sí está en la oración 4, pero es un detalle: deja fuera la regla de la feria.' },
      ],
      pieza: 'rv-escalera',
      dibujo: { datos: { soporte: CARTEL }, estado: {} },
      revelar: { datos: figCartel, estado: estCartel(2, 'f', [1, 2, 3, 4]) },
      coincide: 'Coincide: la vendedora abre y cierra el cartel, pero todas las oraciones tratan de la etiqueta.',
    },
    mira: {
      pieza: 'rv-escalera',
      datos: figCartel,
      pasos: [
        { estado: { n: 0, soporte: { marcas: { c1: 'o', c4: 'o' }, tenue: ['c2', 'c3'] } }, texto: 'Doña Rufina solo cubre la 1 y la 4: la etiqueta queda fuera.', ecuacion: [prop('doña Rufina'), ': cubre ', cubre('2 de 4')] },
        { estado: estCartel(1, 'o', [1, 2, 3, 4], { nuevo: ['escalera'] }), texto: 'El primer peldaño cubre todo, pero le serviría a cualquier cartel de feria.', ecuacion: [prop('muy amplio'), ': cubre ', cubre('4 de 4'), ' y también otros textos'] },
        { estado: estCartel(3, 'o', [4], { nuevo: ['escalera'] }), texto: 'La imprenta solo cubre la 4: deja fuera la etiqueta y su razón.', ecuacion: [prop('muy estrecho'), ': cubre ', cubre('1 de 4')] },
        { estado: estCartel(2, 'f', [1, 2, 3, 4], { nuevo: ['escalera'] }), texto: 'La etiqueta con fecha cubre las cuatro: doña Rufina es un caso de ella.', ecuacion: [justo('justo'), ': cubre ', cubre('4 de 4'), ' y solo este cartel'] },
        { estado: estCartel(2, 'f', [1, 2, 3, 4]), texto: 'Prueba final: ¿le serviría a otro cartel? No. ¿Deja fuera alguna oración? Ninguna.' },
      ],
    },
    regla: {
      texto: 'El tema dice, en una frase, de qué trata todo el texto, también su tabla o gráfico. Muy estrecho: deja fuera una parte. Muy amplio: le serviría a otro texto.',
      ecuacion: [{ llave: [justo('tema')], nota: 'una frase', color: 'c-f' }, ' cubre ', { llave: [cubre('todas las oraciones')], nota: 'ni estrecho', color: 'c-i' }, ' y ', { llave: ['solo este texto'], nota: 'ni amplio' }],
      condicion: 'la frase cubre todas las oraciones; una persona o un lugar que abre el texto no siempre es su tema.',
    },
    resuelve: {
      pieza: 'rv-soporte',
      generar(s) {
        const R = RESUELVE[s % RESUELVE.length];
        const n = oracionesDe(R.sop).length;
        return {
          enunciado: R.enunciado,
          datos: R.datos,
          dibujo: { datos: R.sop, estado: {} },
          pasos: [
            { tipo: 'pide', texto: R.pide || `Piden el tema: una frase que diga de qué trata todo ${R.nombre}, y solo eso.` },
            { tipo: 'datos', texto: `${R.nombre.charAt(0).toUpperCase() + R.nombre.slice(1)} tiene ${n} oraciones${R.mixto ? ' y una tabla' : ''}; las frases para probar están en la pregunta.` },
            { tipo: 'regla', texto: 'Una frase es muy estrecha si deja fuera una parte del texto, y muy amplia si le serviría a otro texto.' },
            { tipo: 'aplica', texto: R.malas },
            { tipo: 'aplica', texto: R.buena, dibujo: { datos: R.sop, estado: todo(R.sop) } },
            { tipo: 'sentido', texto: R.sentido },
          ],
          respuesta: [justo(R.respuesta)],
        };
      },
    },
    ahoraTu: {
      pieza: 'rv-soporte',
      generar(s) {
        const A = AHORA[s % AHORA.length];
        return {
          pregunta: A.pregunta,
          datos: A.datos,
          dibujo: { datos: A.sop, estado: {} },
          opciones: opciones(A.ok, voltear(A.m, s)),
          solucion: { texto: `Cubre todas las oraciones${A.mixto ? ' y la tabla o el gráfico' : ''}, y no le serviría a otro texto.`, ecuacion: [justo(A.ok)],
            dibujo: { datos: A.sop, estado: todo(A.sop) } },
        };
      },
    },
  };

  // ---------- Idea 2: lo que el texto afirma (etapa 2, 17 nov; docs/etapa2/propuesta-verbal.md y decisiones.md) ----------
  // Cambia: lo que la frase afirma del tema. Permanece: el folleto de los uros y el tema («La totora, para los uros,»).
  // Progresa: cuántas oraciones cubre lo que se afirma. Se reserva: la idea que no está en ninguna oración (predicción).
  // Debe verse: que nombrar el tema no dice nada, y que la idea principal afirma algo que cubre todo el texto.
  // Objeto de la primera pantalla: el folleto que se reparte en el muelle de Puno, con su balsa de totora (rv-soporte,
  // dibujo de prueba). Colores: lo que la idea cubre i (turquesa), la idea que se prueba o (naranja, a trazos), la idea
  // principal f (violeta, punteado), lo que queda fuera en gris. Los conteos salen de las listas de cada opción (regla 1).
  // La idea principal va en cualquier lugar: al inicio, en medio, al final o repartida (Gerson, 17 nov).
  const D_IDEA = 'Idea principal: el tema más lo que todo el texto afirma de él.';
  const SOP = () => Kit.piezas['rv-soporte'];
  const FOLLETO = { soporte: 'folleto', lugar: 'Folleto que se reparte en el muelle de Puno', hojas: [
    { id: 'u', titulo: 'Los uros y la totora', de: 'la caseta del muelle', para: 'visitantes', ilustracion: 'balsa', oraciones: ora('u', [
      'Los uros del lago Titicaca usan la totora para casi todo.',
      'Con ella levantan las islas donde viven, capa sobre capa.',
      'También hacen sus casas y sus balsas.',
      'La parte blanca del tallo, el chullo, se come.',
      'Por eso, cuando el lago baja y la totora se seca, la vida en las islas se complica.']) }] };
  const TEMA_U = 'La totora, para los uros,';
  // Lo que se afirma de la totora: qué oraciones cubre cada opción (la 5 depende de que la totora sea la base de todo).
  const AFIRMA = {
    nada: { b: '(nada)', t: '…', c: null },
    come: { b: 'se come', t: 'se come.', c: [4] },
    hace: { b: 'sirve para islas, casas y balsas', t: 'sirve para hacer islas, casas y balsas.', c: [1, 2, 3] },
    base: { b: 'es la base de su vida', t: 'es la base de su vida en el lago.', c: [1, 2, 3, 4, 5] },
    turistas: { b: 'se vende a los turistas', t: 'se vende a los turistas.', c: [] },
  };
  const N_FOLLETO = oracionesDe(FOLLETO).length;
  // Todo lo que cubre la idea en turquesa y, si una oración la dice, esa oración en violeta (en = su número; null si
  // está repartida).
  const conIdea = (sop, en) => { const e = todo(sop); if (en) e.marcas[oracionesDe(sop)[en - 1]] = 'f'; return e; };
  const figFolleto = a => Object.assign({}, FOLLETO, { frase: { etiqueta: 'Tu idea', t: `${TEMA_U} ${AFIRMA[a].t}` } });
  const estFolleto = a => {
    const A = AFIRMA[a], principal = A.c && A.c.length === N_FOLLETO;
    if (!A.c) return { marcas: { frase: 'o' } };
    return Object.assign(pinta(FOLLETO, A.c.map(k => `u${k}`)), { marcas: Object.assign(Object.fromEntries(A.c.map(k => [`u${k}`, 'i'])), { frase: principal ? 'f' : 'o' }) });
  };
  const lecturaFolleto = a => {
    const A = AFIRMA[a];
    if (!A.c) return [prop('Solo nombra el tema'), ': todavía no afirma nada'];
    if (!A.c.length) return [prop('No cubre ninguna'), ': el folleto no dice eso'];
    if (A.c.length === N_FOLLETO) return [justo('Idea principal'), ': afirma algo y cubre ', cubre(`las ${N_FOLLETO}`)];
    return [prop('Muy poco'), ': cubre ', cubre(`${A.c.length} de ${N_FOLLETO}`), ' oraciones'];
  };

  // Predice: los apuntes del agua que hierve. Ninguna oración dice sola la idea (se arma uniendo las cuatro).
  const APUNTES = { soporte: 'cuaderno', lugar: 'Cuaderno de Rosa', hojas: [
    { id: 'h', titulo: 'Ciencia y Tecnología', de: 'Rosa', para: 'estudiar para la práctica', oraciones: ora('h', [
      'En Juliaca, el agua hierve a unos 87\u00a0°C.',
      'En Lima, a orillas del mar, hierve a unos 100\u00a0°C.',
      'Arriba hay menos aire que empuje sobre el agua.',
      'Por eso, en la altura los fideos tardan más en cocinarse.']) }] };
  const IDEA_AGUA = 'En la altura el agua hierve a menos grados y cocina más lento';
  const APUNTES_IDEA = Object.assign({}, APUNTES, { frase: { etiqueta: 'Idea principal', t: `${IDEA_AGUA}.` } });

  // «Así se resuelve»: la idea principal al inicio, en medio, al final y repartida. Textos distintos de «Ahora tú».
  const RESUELVE_IDEA = [
    { en: 1, nombre: 'el aviso',
      sop: { soporte: 'puerta', lugar: 'Puerta del comedor del colegio', hojas: [{ id: 'm', titulo: 'Aviso', de: 'el comedor', para: 'estudiantes', oraciones: ora('m', [
        'Desde mayo, el comedor ya no usará platos descartables.',
        'Cada estudiante traerá su propio plato y su cuchara.',
        'Al terminar, cada uno lavará lo suyo en el lavadero del patio.',
        'Así, el colegio dejará de botar cientos de platos cada día.']) }] },
      enunciado: '¿Cuál es la idea principal del aviso: «el comedor del colegio», «cada estudiante lavará lo suyo» o «desde mayo, el comedor ya no usará platos descartables»?',
      datos: [D_IDEA, 'Descartable: que se usa una vez y se bota.'],
      malas: ['«El comedor del colegio» ', prop('solo nombra el tema'), ': no afirma nada. «Cada estudiante lavará lo suyo» cubre solo la 3: ', prop('es un detalle'), '.'],
      buena: ['«Ya no usará platos descartables» cubre ', cubre('las cuatro'), ': la 2 y la 3 dicen cómo; la 4, para qué.'],
      sentido: 'Está en la primera oración: la idea principal puede ir al inicio, en medio o al final.',
      respuesta: 'Desde mayo, el comedor ya no usará platos descartables' },
    { en: 2, nombre: 'el cartel',
      sop: { soporte: 'cartel', lugar: 'Cartel en la biblioteca del colegio', hojas: [{ id: 'r', titulo: 'Consejo de la semana', de: 'la biblioteca', para: 'estudiantes', oraciones: ora('r', [
        'Rosa siempre estudiaba con el celular al lado.',
        'Estudiar con el celular cerca distrae, aunque no se use.',
        'Cada aviso que suena corta la concentración por varios minutos.',
        'Además, con solo verlo en la mesa ya dan ganas de mirarlo.',
        'Rosa ahora lo deja en otro cuarto y termina antes sus tareas.']) }] },
      enunciado: 'Este cartel empieza con Rosa. ¿Su idea principal es «Rosa y su celular», «los avisos que suenan» o «estudiar con el celular cerca distrae, aunque no se use»?',
      datos: [D_IDEA],
      malas: ['«Rosa y su celular» cubre la 1 y la 5, un caso: ', prop('muy estrecha'), '. «Los avisos que suenan» cubre solo la 3: ', prop('es un detalle'), '.'],
      buena: ['«Estudiar con el celular cerca distrae» cubre ', cubre('las cinco'), ': la 3 y la 4 dicen por qué, y Rosa es un caso.'],
      sentido: 'Está en la oración 2: antes va un caso y después, sus razones.',
      respuesta: 'Estudiar con el celular cerca distrae, aunque no se use' },
    { en: 4, nombre: 'el mensaje',
      sop: { soporte: 'mensaje', lugar: 'Familias de 3.º A', hojas: [{ id: 'p', de: 'la profesora de Comunicación', para: 'familias de 3.º A', oraciones: ora('p', [
        'Esta semana, cada estudiante leyó diez minutos en voz alta a un compañero.',
        'Los que leían con tropiezos ahora leen con más soltura.',
        'Varios pidieron llevar libros a su casa.',
        'La lectura en parejas está dando buenos resultados, y la seguiremos haciendo.']) }] },
      enunciado: '¿Cuál es la idea principal del mensaje: «la lectura en voz alta», «varios pidieron llevar libros» o «la lectura en parejas da buenos resultados y seguirá»?',
      datos: [D_IDEA, 'Soltura: facilidad para hacer algo sin trabarse.'],
      malas: ['«La lectura en voz alta» ', prop('solo nombra el tema'), '. «Varios pidieron llevar libros» cubre solo la 3: ', prop('es un detalle'), '.'],
      buena: ['«La lectura en parejas da buenos resultados» cubre ', cubre('las cuatro'), ': la 1 dice qué se hizo y la 2 y la 3, qué se logró.'],
      sentido: 'Va al final: las tres primeras son lo que la sostiene.',
      respuesta: 'La lectura en parejas da buenos resultados y seguirá' },
    { en: null, nombre: 'el cartel del biohuerto',
      sop: { soporte: 'cartel', lugar: 'Cartel en el biohuerto del colegio', hojas: [{ id: 'b', titulo: 'Nuestro biohuerto', de: 'los alumnos de 4.º', para: 'todo el colegio', oraciones: ora('b', [
        'El año pasado, las lechugas del biohuerto crecían chicas y amarillas.',
        'Este año, echamos a la tierra el abono que hicimos con las cáscaras del comedor.',
        'Ahora las lechugas salen grandes y verdes.']) }] },
      enunciado: 'Ninguna oración del cartel dice sola la idea. ¿Cuál es: «el biohuerto del colegio», «las lechugas crecían chicas» o «el abono de cáscaras hizo crecer mejor las lechugas»?',
      datos: [D_IDEA, 'Abono: lo que se echa a la tierra para que las plantas crezcan mejor.'],
      malas: ['«El biohuerto del colegio» ', prop('solo nombra el tema'), '. «Las lechugas crecían chicas» es la 1, el antes: ', prop('muy estrecha'), '.'],
      buena: ['«El abono de cáscaras hizo crecer mejor las lechugas» une ', cubre('el antes, el cambio y el después'), ': cubre las tres.'],
      sentido: 'No está escrita en una oración: se arma con las tres, y se puede creer o negar.',
      respuesta: 'El abono de cáscaras hizo crecer mejor las lechugas' },
  ];

  // «Ahora tú»: la idea al inicio, al final, en medio y repartida; los dos últimos, de examen (un relato y un texto con
  // tabla, cinco alternativas). Códigos: RV65 (nombra el tema), RV1 (detalle), RV3 (una parte), RV4 (la primera
  // oración), RV64 (la persona del comienzo), RV2 (muy general), RV11 (absoluto) y RV66 (agrega un asunto).
  const AHORA_IDEA = [
    { en: 1, sop: { soporte: 'puerta', lugar: 'Puerta de la biblioteca municipal de Puno', hojas: [{ id: 'p', titulo: 'Aviso', de: 'la biblioteca municipal', para: 'vecinos', oraciones: ora('p', [
        'Desde junio, la biblioteca abrirá también los sábados.',
        'Atenderá de 9:00 a 13:00.',
        'Así podrán venir quienes estudian o trabajan entre semana.']) }] },
      pregunta: '¿Cuál es la idea principal de este aviso de la biblioteca?', datos: [D_IDEA],
      ok: 'Desde junio, la biblioteca abrirá también los sábados',
      m: [['La biblioteca municipal de Puno y sus horarios de atención para los vecinos', 'RV65', 'Nombra bien el asunto del aviso, pero no afirma nada de él.'],
        ['La biblioteca atenderá de 9:00 a 13:00', 'RV1', 'Es cierto, está en la 2, pero es un detalle del horario nuevo.']] },
    { en: 3, sop: { soporte: 'cartel', lugar: 'Cartel en el patio', hojas: [{ id: 'k', titulo: 'Campaña', de: 'el municipio escolar', para: 'estudiantes', oraciones: ora('k', [
        'Cada recreo, el patio queda lleno de envolturas.',
        'Los tachos están solo en la puerta del comedor.',
        'Desde el lunes, habrá un tacho en cada pabellón para que el patio quede limpio.']) }] },
      pregunta: '¿Cuál es la idea principal de este cartel del patio?', datos: [D_IDEA],
      ok: 'Habrá un tacho en cada pabellón para que el patio quede limpio',
      m: [['La basura que queda en el patio del colegio después de cada recreo', 'RV65', 'Nombra el asunto de todo el cartel, pero no dice qué se hará.'],
        ['Cada recreo, el patio queda lleno de envolturas de golosinas', 'RV4', 'Es la 1, el problema; deja fuera lo que el cartel anuncia.']] },
    { en: 2, sop: { soporte: 'folleto', lugar: 'Folleto de la agencia agraria de Azángaro', hojas: [{ id: 'e', titulo: 'Agencia agraria informa', de: 'la agencia agraria', para: 'criadores de alpacas', oraciones: ora('e', [
        'Don Teófilo cría alpacas en Azángaro desde joven.',
        'Esquilar a las alpacas en la época de lluvias, y no en la de heladas, las protege del frío.',
        'Así, cuando llegan las heladas de junio, ya les volvió a crecer la fibra.',
        'Don Teófilo esquila en marzo, y este año no se le enfermó ninguna alpaca.']) }] },
      pregunta: 'Este folleto empieza con don Teófilo. ¿Cuál es su idea principal?',
      datos: [D_IDEA, 'Esquilar: cortarle la lana (la fibra) a un animal.'],
      ok: 'Esquilar en época de lluvias, no de heladas, protege a las alpacas',
      m: [['Don Teófilo, criador de alpacas de Azángaro', 'RV64', 'Él abre y cierra el folleto, pero es un caso del consejo de la 2.'],
        ['Las heladas de junio en las alturas de Azángaro', 'RV1', 'Están en la 3, pero son el marco: deja fuera cuándo esquilar.'],
        ['Las alpacas necesitan toda su fibra para aguantar el frío del altiplano', 'RV2', 'Puede ser cierto, pero le serviría a otro texto: no dice cuándo esquilar.']] },
    { en: null, sop: { soporte: 'cuaderno', lugar: 'Cuaderno de Diego', hojas: [{ id: 'd', titulo: 'Ciencia y Tecnología', de: 'Diego', para: 'estudiar para la práctica', oraciones: ora('d', [
        'Una olla con tapa hierve el agua en menos tiempo.',
        'La tapa no deja que el calor se escape con el vapor.',
        'Así se gasta menos gas al cocinar.']) }] },
      pregunta: 'Ninguna oración de estos apuntes dice sola la idea principal. ¿Cuál es?', datos: [D_IDEA],
      ok: 'Tapar la olla guarda el calor y hace gastar menos gas',
      m: [['La olla con tapa que se usa cada día en la cocina', 'RV65', 'Nombra el asunto de los apuntes, pero no afirma nada de él.'],
        ['Así se gasta menos gas al cocinar', 'RV3', 'Es la 3, la consecuencia; deja fuera por qué pasa.'],
        ['La tapa impide que el calor de la olla se escape con el vapor', 'RV1', 'Es la razón de la 2, pero sola no dice para qué sirve.']] },
    { en: null, sop: { soporte: 'simulacro', numero: 6, hojas: [{ id: 't', oraciones: ora('t', [
        'Cuando Julia llegó a Juliaca desde Lampa, hablaba quechua y casi nada de castellano.',
        'En clase no entendía y no se animaba a hablar.',
        'Su compañera Nilda, que sabía las dos lenguas, se sentaba con ella en cada recreo y le explicaba las tareas.',
        'A fin de año, Julia leyó un cuento en castellano frente a todo el salón.']) }] },
      pregunta: '¿Cuál es la idea principal del texto?',
      datos: [D_IDEA, 'Relato: texto que cuenta algo que le pasó a alguien.'],
      ok: 'Con la ayuda de una compañera, Julia aprendió castellano y ganó confianza',
      m: [['Julia llegó a un colegio de Juliaca desde Lampa hablando casi solo quechua', 'RV4', 'Es la 1, cómo empieza la historia; deja fuera la ayuda y el final.'],
        ['Julia y Nilda, dos compañeras de un colegio de Juliaca', 'RV65', 'Nombra a quienes trata el relato, pero no dice qué pasó con ellas.'],
        ['Julia leyó un cuento en castellano frente a todo el salón', 'RV3', 'Es la 4, el final; deja fuera cómo llegó a lograrlo.'],
        ['Todos los alumnos que llegan del campo necesitan una compañera así', 'RV11', 'Habla de la ayuda, pero «todos» dice más de lo que cuenta un caso.']] },
    { en: 3, mixto: true, sop: { soporte: 'simulacro', numero: 16, hojas: [{ id: 't', oraciones: ora('t', [
        'En un colegio de Puno, los alumnos de 5.º anotaron a qué hora dejaban el celular cada noche.',
        'También anotaron su nota en la práctica de la mañana siguiente.',
        'Quienes usaron el celular hasta tarde sacaron, en promedio, notas más bajas.',
        'La tabla muestra los promedios del salón.']),
        tabla: tabla('Nota promedio en la práctica', ['Dejó el celular', 'Nota'], [['Antes de las 10', '15'], ['Después de las 12', '11']]) }] },
      pregunta: '¿Cuál es la idea principal del texto y su tabla?',
      datos: [D_IDEA, D_MIXTO, 'Promedio: la nota de cada uno si la suma de todas se repartiera en partes iguales.'],
      ok: 'Quienes dejaron tarde el celular sacaron notas más bajas al otro día',
      m: [['El uso del celular de noche entre los escolares de Puno', 'RV65', 'Nombra el asunto del texto, pero no afirma nada sobre él.'],
        ['La nota de 11 que sacaron quienes dejaron el celular después de las 12', 'RV1', 'Leíste bien la tabla, pero es una celda: deja fuera la comparación.'],
        ['Los alumnos de 5.º anotaron a qué hora dejaban el celular', 'RV4', 'Es la 1, cómo se hizo; deja fuera lo que encontraron.'],
        ['Usar el celular de noche es la única causa de todas las notas bajas', 'RV66', 'Habla del celular, pero el texto no dice «única causa»: agrega algo.']] },
  ];

  // Ejemplos resueltos de la idea 2. Nivel 1: la idea dicha en una oración (al inicio, en medio o al final) o una frase
  // que solo nombra o es un detalle; un paso. Nivel 2: la idea repartida en dos oraciones o en ninguna, una creencia o
  // una persona al comienzo, o una opción que agrega; dos pasos. Nivel 3: hoja de simulacro con cinco alternativas
  // (relato con la idea implícita, texto que opina, texto con gráfico). Revisado aparte (scratchpad verbal-revisa.js):
  // cada oración que cita un resuelto existe en su texto, y cada «las cuatro», «las cinco»… coincide con el soporte.
  const EJEMPLOS_IDEA = [
    { nivel: 1, titulo: 'El aviso de la piscina',
      enunciado: '¿Qué oración dice la idea principal del aviso: la 1, la 2 o la 3?',
      datos: [D_IDEA],
      figura: fig({ soporte: 'puerta', lugar: 'Puerta de la piscina municipal', hojas: [{ id: 'h', titulo: 'Aviso', de: 'la piscina municipal', para: 'bañistas', oraciones: ora('h', [
        'Desde julio, la piscina pedirá gorro de baño a todos los bañistas.', 'El gorro evita que el pelo tape los filtros del agua.', 'Quien no lo traiga podrá comprar uno en la boletería.']) }] }),
      solucion: [
        { texto: ['La 2 dice para qué sirve el gorro y la 3, qué hacer si se olvida: ', prop('detalles'), ' de lo que dice la 1.'] },
        { texto: ['La 1 afirma lo que cambia, y ', cubre('la 2 y la 3'), ' cuelgan de ella: es la idea principal, aunque vaya al inicio.'] }],
      respuesta: [justo('La oración 1'), ': desde julio se pedirá gorro de baño'] },
    { nivel: 1, titulo: 'El estante del aula',
      enunciado: '¿Qué oración dice la idea principal del cartel: la 1, la 2 o la 3?',
      datos: [D_IDEA],
      figura: fig({ soporte: 'cartel', lugar: 'Cartel en el aula de 1.º A', hojas: [{ id: 'h', titulo: 'Nuestro estante', de: 'el comité de aula', para: 'estudiantes de 1.º A', oraciones: ora('h', [
        'En el estante del fondo hay reglas, tijeras y goma.', 'Cualquiera puede usarlas en clase y devolverlas al terminar.', 'El estante es de todos, y cuidarlo es tarea de cada uno.']) }] }),
      solucion: [
        { texto: ['La 1 dice qué hay y la 2, cómo se usa: ', prop('detalles'), '. La 3 afirma lo que el cartel quiere que se sepa y ', cubre('cubre las tres'), '.'] }],
      respuesta: [justo('La oración 3'), ': el estante es de todos y cada uno lo cuida'] },
    { nivel: 1, titulo: 'El jabón de la posta',
      enunciado: '¿Qué oración dice la idea principal del folleto: la 1, la 2, la 3 o la 4?',
      datos: [D_IDEA, 'Microbio: ser vivo tan chico que no se ve, y que puede enfermar.'],
      figura: fig({ soporte: 'folleto', lugar: 'Folleto de la posta de Chucuito', hojas: [{ id: 'h', titulo: 'Posta informa', de: 'la posta de salud', para: 'familias', oraciones: ora('h', [
        'En invierno, muchos niños de Chucuito se enferman del estómago y de los bronquios.', 'Lavarse las manos con jabón es una forma sencilla de evitar muchas de esas enfermedades.',
        'El jabón saca los microbios que quedan en las manos después de jugar.', 'Por eso, la posta regala jabón a las familias con niños pequeños.']) }] }),
      solucion: [
        { texto: ['La 1 presenta el problema; ', cubre('la 3'), ' explica por qué funciona y ', cubre('la 4'), ' dice qué hace la posta. Todas giran alrededor de la 2.'] }],
      respuesta: [justo('La oración 2'), ': lavarse las manos con jabón evita enfermedades'] },
    { nivel: 1, titulo: 'La frase que solo nombra',
      enunciado: 'Para este aviso, ¿«el campeonato de ajedrez» es la idea principal? Si no lo es, ¿qué le falta?',
      datos: [D_IDEA],
      figura: fig({ soporte: 'puerta', lugar: 'Puerta de la biblioteca del colegio', hojas: [{ id: 'h', titulo: 'Aviso', de: 'la biblioteca', para: 'estudiantes', oraciones: ora('h', [
        'El sábado habrá un campeonato de ajedrez en la biblioteca.', 'Pueden jugar estudiantes de 1.º a 5.º.', 'La inscripción es gratis y se hace con el bibliotecario.']) }] }),
      solucion: [
        { texto: ['La frase cubre ', cubre('las tres oraciones'), ', pero ', prop('solo nombra el tema'), ': no se puede creer ni negar.'] },
        { texto: ['Le falta lo que el aviso afirma: ', justo('«el sábado habrá un campeonato de ajedrez gratis en la biblioteca»'), '.'] }],
      respuesta: [justo('No'), ': solo nombra el tema; falta lo que el aviso afirma'] },
    { nivel: 1, titulo: 'La salida al museo',
      enunciado: 'En este mensaje, ¿«cada uno debe llevar dos soles» es la idea principal o un detalle?',
      datos: [D_IDEA],
      figura: fig({ soporte: 'mensaje', lugar: 'Grupo de 4.º B', hojas: [{ id: 'h', de: 'el delegado', para: 'compañeros de 4.º B', oraciones: ora('h', [
        'El jueves, el salón irá al museo Carlos Dreyer.', 'Saldremos a las 8:00 de la puerta del colegio.', 'Cada uno debe llevar dos soles para la entrada.']) }] }),
      solucion: [
        { texto: ['«Llevar dos soles» cubre solo ', prop('la 3'), ': deja fuera la salida y la hora. Es un detalle.'] },
        { texto: ['La idea principal está en la 1: ', justo('el jueves, el salón irá al museo'), '; la 2 y la 3 dicen cómo.'] }],
      respuesta: [justo('Un detalle'), ': cubre solo la oración 3'] },

    { nivel: 2, titulo: 'El agua de la quebrada',
      enunciado: 'Ninguna oración dice sola la idea. ¿Cuál es: «el agua de la quebrada», «hervir el agua cinco minutos» o «el agua de la quebrada parece limpia, pero hay que hervirla»?',
      datos: [D_IDEA, 'Quebrada: arroyo que baja entre los cerros.'],
      figura: fig({ soporte: 'folleto', lugar: 'Folleto del puesto de salud de Mañazo', hojas: [{ id: 'h', titulo: 'Puesto de salud informa', de: 'el puesto de salud', para: 'familias', oraciones: ora('h', [
        'La quebrada de la comunidad baja con agua clara.', 'Pero más arriba pastan vacas y ovejas.', 'El agua puede traer microbios que no se ven.', 'Hervirla cinco minutos antes de tomarla los mata.']) }] }),
      solucion: [
        { texto: ['Primero, qué dice cada una: ', cubre('la 1'), ', que el agua parece limpia; ', cubre('la 2 y la 3'), ', que puede traer microbios; ', cubre('la 4'), ', qué hacer.'] },
        { texto: ['«El agua de la quebrada» ', prop('solo nombra'), ' y «hervir cinco minutos» cubre solo la 4. La tercera frase une ', cubre('las cuatro'), '.'] }],
      respuesta: [justo('El agua de la quebrada parece limpia, pero hay que hervirla')] },
    { nivel: 2, titulo: 'La creencia sobre la queñua',
      enunciado: '¿Cuál es la idea principal: «los árboles de la sierra solo sirven para leña», «los manantiales en época seca» o «los bosques de queñua guardan el agua de los manantiales»?',
      datos: [D_IDEA, 'Queñua: árbol de las alturas de los Andes.', 'Manantial: lugar donde el agua sale sola de la tierra.'],
      figura: fig({ soporte: 'cartel', lugar: 'Cartel en el mirador de la comunidad', hojas: [{ id: 'h', titulo: 'Cuidemos la queñua', de: 'la comunidad', para: 'vecinos y visitantes', oraciones: ora('h', [
        'Mucha gente cree que los árboles de la sierra solo sirven para leña.', 'Pero los bosques de queñua guardan en el suelo el agua de las lluvias.',
        'Esa agua baja después, poco a poco, a los manantiales.', 'Sin queñuas, los manantiales se secan antes en la época seca.']) }] }),
      solucion: [
        { texto: ['La 1 dice lo que «mucha gente cree» y la 2 lo corrige: la 1 no es la idea del cartel, es lo que el cartel discute.'] },
        { texto: ['«Los manantiales en época seca» cubre solo la 4: ', prop('muy estrecha'), '. «Guardan el agua de los manantiales» cubre ', cubre('de la 2 a la 4'), ' y responde a la 1.'] }],
      respuesta: [justo('Los bosques de queñua guardan el agua de los manantiales')] },
    { nivel: 2, titulo: 'Dos oraciones que se completan',
      enunciado: '¿Qué oraciones, juntas, dicen la idea principal: la 1 y la 2, la 1 y la 4, o la 2 y la 3?',
      datos: [D_IDEA, 'Chuño: papa helada y secada al sol, que se guarda años.'],
      figura: fig({ soporte: 'folleto', lugar: 'Folleto de la feria gastronómica de Puno', hojas: [{ id: 'h', titulo: 'Conoce el chuño', de: 'la feria', para: 'visitantes', oraciones: ora('h', [
        'El chuño parece una comida sencilla.', 'Para hacerlo, la papa se deja helar en la noche y se pisa para sacarle el agua.',
        'Seca, dura varios años sin malograrse.', 'En realidad, es una forma muy antigua de guardar comida para los años malos.']) }] }),
      solucion: [
        { texto: ['La 2 dice cómo se hace y la 3, cuánto dura: ', prop('son detalles'), ' que sostienen la 4.'] },
        { texto: [cubre('La 1'), ' dice lo que parece y ', cubre('la 4'), ' lo que es en realidad: juntas dicen la idea, y cubren las cuatro.'] }],
      respuesta: [justo('La 1 y la 4'), ': parece sencillo, pero es una forma antigua de guardar'] },
    { nivel: 2, titulo: 'Ana y la charla',
      enunciado: 'Este folleto empieza con Ana. ¿Su idea principal es «Ana quería estudiar Enfermería», «la orientación vocacional» o «cada colegio puede pedir a la UGEL una charla de orientación gratuita»?',
      datos: [D_IDEA, 'UGEL: la oficina del Estado que ve los colegios de una provincia.', 'Orientación vocacional: ayuda para elegir qué estudiar.'],
      figura: fig({ soporte: 'folleto', lugar: 'Folleto de la UGEL Puno', hojas: [{ id: 'h', titulo: 'UGEL informa', de: 'la UGEL Puno', para: 'directores y estudiantes', oraciones: ora('h', [
        'Ana, de 16 años, quería estudiar Enfermería, pero no sabía qué preguntaban en el examen.', 'En la UGEL encontró una orientadora que la ayudó a ver los temas.',
        'Cada colegio de Puno puede pedir a la UGEL una charla gratuita de orientación vocacional.', 'Ana ya se prepara para postular.']) }] }),
      solucion: [
        { texto: ['La 1, la 2 y la 4 cuentan el caso de Ana; la 3 dice lo que vale para todos los colegios.'] },
        { texto: ['«Ana quería estudiar Enfermería» cubre solo la 1: ', prop('muy estrecha'), '. «La orientación vocacional» ', prop('solo nombra'), '. La tercera cubre ', cubre('las cuatro'), ': Ana es un caso de ella.'] }],
      respuesta: [justo('Cada colegio puede pedir a la UGEL una charla gratuita')] },
    { nivel: 2, titulo: 'Las colcas de los incas',
      enunciado: '¿Cuál es la idea principal: «las colcas», «los incas fueron los mejores constructores de América» o «los incas guardaban comida en colcas hechas donde corre el viento frío»?',
      datos: [D_IDEA, 'Colca: depósito de piedra para guardar comida.'],
      figura: fig({ soporte: 'cuaderno', lugar: 'Cuaderno de Diego', hojas: [{ id: 'h', titulo: 'Historia del Perú', de: 'Diego', para: 'estudiar para la práctica', oraciones: ora('h', [
        'Los incas guardaban comida en depósitos de piedra llamados colcas.', 'Las colcas se hacían en lomas altas, donde corre el viento.', 'El viento frío ayudaba a que el maíz y el chuño no se malograran.']) }] }),
      solucion: [
        { texto: ['«Los mejores constructores de América» ', prop('agrega'), ': ninguna oración compara a los incas con otros pueblos. «Las colcas» ', prop('solo nombra'), '.'] },
        { texto: ['La tercera cubre ', cubre('la 1, la 2 y la 3'), ': qué eran, dónde se hacían y por qué allí.'] }],
      respuesta: [justo('Los incas guardaban comida en colcas hechas donde corre el viento frío')] },

    { nivel: 3, titulo: 'El puente de la comunidad',
      enunciado: 'Pregunta 3 del simulacro: «¿Cuál es la idea principal del texto?». Ninguna oración la dice. ¿Qué alternativa es la correcta?',
      datos: [D_IDEA, 'Relato: texto que cuenta algo que le pasó a alguien.'],
      figura: fig({ soporte: 'simulacro', numero: 3, hojas: [{ id: 'h', oraciones: ora('h', [
        'En una comunidad de Huancané, el puente de madera sobre el río se rompió en febrero.', 'Los comuneros no quisieron esperar a que llegara ayuda de la ciudad.',
        'Cada familia llevó troncos, sogas y comida.', 'En una semana, entre todos, levantaron un puente nuevo.', 'Ese año, la fiesta de la comunidad se hizo sobre el puente.']) }],
        pregunta: '¿Cuál es la idea principal del texto?', alternativas: [
          { id: 'A', t: 'El puente de madera que cruzaba el río de una comunidad de Huancané se rompió en febrero.' }, { id: 'B', t: 'Las comunidades de Huancané y sus ríos.' },
          { id: 'C', t: 'Trabajando juntos, los comuneros levantaron un puente nuevo sin esperar ayuda.' },
          { id: 'D', t: 'La fiesta de la comunidad se hizo sobre el puente nuevo.' }, { id: 'E', t: 'Las comunidades del altiplano nunca necesitan la ayuda que llega desde la ciudad.' }] }),
      solucion: [
        { texto: ['El relato no dice su idea: hay que armarla. La 1 es el problema; ', cubre('de la 2 a la 4'), ', lo que hicieron; la 5, cómo terminó.'] },
        { texto: [mala('A'), ' es la 1 y ', mala('D'), ', la 5: ', prop('muy estrechas'), '. ', mala('B'), ' ', prop('solo nombra'), '.'] },
        { texto: [mala('E'), ' dice «nunca» y habla de todas las comunidades: el relato cuenta un caso. ', buena('C'), ' cubre ', cubre('las cinco'), '.'] }],
      respuesta: [buena('C'), ': trabajando juntos, levantaron el puente sin esperar ayuda'] },
    { nivel: 3, titulo: 'La opinión sobre los videojuegos',
      enunciado: 'Pregunta 5 del simulacro: «¿Cuál es la idea principal del texto?». ¿Qué alternativa es la correcta?',
      datos: [D_IDEA],
      figura: fig({ soporte: 'simulacro', numero: 5, hojas: [{ id: 'h', oraciones: ora('h', [
        'Muchos padres creen que los videojuegos solo hacen perder el tiempo.', 'Algunos juegos, sin embargo, obligan a planear, a probar y a corregir.',
        'Otros se juegan en equipo y piden ponerse de acuerdo.', 'Lo que importa no es si un chico juega, sino a qué juega y cuánto tiempo.']) }],
        pregunta: '¿Cuál es la idea principal del texto?', alternativas: [
          { id: 'A', t: 'Los videojuegos solo hacen perder el tiempo.' }, { id: 'B', t: 'Los videojuegos que se juegan en equipo.' }, { id: 'C', t: 'Los videojuegos y los padres.' },
          { id: 'D', t: 'Lo que importa es a qué juega un chico y cuánto, no si juega.' }, { id: 'E', t: 'Los videojuegos enseñan más que los libros a los chicos que juegan en equipo.' }] }),
      solucion: [
        { texto: [mala('A'), ' es lo que creen los padres, y el texto lo discute: ', prop('no es su idea'), '. ', mala('B'), ' cubre solo la 3. ', mala('C'), ' ', prop('solo nombra'), '.'] },
        { texto: [mala('E'), ' ', prop('agrega'), ' los libros, de los que el texto no habla. ', buena('D'), ' es la 4, y ', cubre('la 2 y la 3'), ' la sostienen.'] }],
      respuesta: [buena('D'), ': importa a qué juega un chico y cuánto, no si juega'] },
    { nivel: 3, titulo: 'El balde y el caño',
      enunciado: 'Pregunta 9 del simulacro: «¿Cuál es la idea principal del texto y el gráfico?». ¿Qué alternativa es la correcta?',
      datos: [D_IDEA, D_MIXTO],
      figura: fig({ soporte: 'simulacro', numero: 9, hojas: [{ id: 'h', oraciones: ora('h', [
        'En Juliaca, una familia midió cuánta agua gastaba al lavar los platos.', 'Primero los lavó con el caño abierto todo el tiempo.',
        'Después llenó un balde y enjuagó al final.', 'El gráfico muestra cuántos litros usó cada vez.', 'Lavar con balde gastó mucha menos agua que con el caño abierto.']),
        barras: barras('Litros para lavar los platos de un almuerzo', [['Caño', 60], ['Balde', 15]]) }],
        pregunta: '¿Cuál es la idea principal del texto y el gráfico?', alternativas: [
          { id: 'A', t: 'El agua que se gasta en las casas de Juliaca.' }, { id: 'B', t: 'Con el caño abierto, la familia usó 60 litros.' },
          { id: 'C', t: 'Lavar los platos con balde gasta mucha menos agua que con el caño abierto.' },
          { id: 'D', t: 'Una familia de Juliaca que midió su agua.' }, { id: 'E', t: 'Cerrar el caño mientras se lava es lo único que de verdad ahorra agua en una casa.' }] }),
      solucion: [
        { texto: ['La idea va al final, en la 5, y ', cubre('el gráfico'), ' la muestra: 15 litros contra 60.'] },
        { texto: [mala('A'), ' le serviría a otro texto. ', mala('B'), ' es una barra y ', mala('D'), ' es la 1: ', prop('muy estrechas'), '.'] },
        { texto: [mala('E'), ' dice «lo único», y el texto solo compara dos formas de lavar. ', buena('C'), ' cubre ', cubre('las cinco'), ' y el gráfico.'] }],
      respuesta: [buena('C'), ': con balde se gasta mucha menos agua que con el caño abierto'] },
    { nivel: 3, titulo: 'La oca que vuelve',
      enunciado: 'Pregunta 11 del simulacro: «¿Cuál es la idea principal del texto?». ¿Qué alternativa es la correcta?',
      datos: [D_IDEA, 'Oca: tubérculo de los Andes, pariente lejano de la papa en la chacra.', 'Tubérculo: raíz gruesa que se come, como la papa.'],
      figura: fig({ soporte: 'simulacro', numero: 11, hojas: [{ id: 'h', oraciones: ora('h', [
        'En Puno, casi todos conocen la papa, pero pocos han probado la oca.', 'La oca es un tubérculo andino que vale la pena volver a sembrar.',
        'Crece bien en la puna, donde hace mucho frío.', 'Rinde en suelos pobres, donde otros cultivos dan poco.', 'Y se come dulce después de dejarla unos días al sol.']) }],
        pregunta: '¿Cuál es la idea principal del texto?', alternativas: [
          { id: 'A', t: 'En Puno, pocos han probado la oca.' }, { id: 'B', t: 'La oca se come dulce después de asolearla.' }, { id: 'C', t: 'Los tubérculos de los Andes.' },
          { id: 'D', t: 'La oca es un tubérculo andino que vale la pena volver a sembrar.' }, { id: 'E', t: 'La oca debe reemplazar a la papa en todas las chacras de Puno, porque rinde más.' }] }),
      solucion: [
        { texto: ['La 2 lo anuncia y ', cubre('de la 3 a la 5'), ' dan sus razones: la idea va en medio, después de una presentación.'] },
        { texto: [mala('A'), ' es la 1 y ', mala('B'), ', la 5: ', prop('muy estrechas'), '. ', mala('C'), ' ', prop('solo nombra'), ', y muy amplio.'] },
        { texto: [mala('E'), ' ', prop('agrega'), ' «reemplazar» y «todas»: el texto no compara con la papa. ', buena('D'), ' cubre ', cubre('las cinco'), '.'] }],
      respuesta: [buena('D'), ': la oca vale la pena volver a sembrarla'] },
    { nivel: 3, titulo: 'Las noticias del celular',
      enunciado: 'Pregunta 13 del simulacro: «¿Cuál es la idea principal del texto?». ¿Qué alternativa es la correcta?',
      datos: [D_IDEA, 'Fuente: lugar de donde sale una noticia (una radio, un periódico, una persona).'],
      figura: fig({ soporte: 'simulacro', numero: 13, hojas: [{ id: 'h', oraciones: ora('h', [
        'Antes, en muchos pueblos del altiplano, la gente se enteraba de las noticias por la radio.', 'Hoy, muchos jóvenes las leen primero en el celular.',
        'El celular trae noticias al instante, pero también rumores falsos que corren rápido.', 'La radio tarda más, pero sus periodistas comprueban lo que dicen.',
        'Por eso, conviene comprobar en otra fuente lo que llega por el celular.']) }],
        pregunta: '¿Cuál es la idea principal del texto?', alternativas: [
          { id: 'A', t: 'Antes, en los pueblos del altiplano, la gente se enteraba de las noticias por la radio.' }, { id: 'B', t: 'Las noticias en los pueblos del altiplano.' },
          { id: 'C', t: 'Las noticias del celular llegan rápido, pero conviene comprobarlas en otra fuente.' },
          { id: 'D', t: 'La radio tarda más en dar las noticias.' }, { id: 'E', t: 'Todo lo que llega por el celular es falso.' }] }),
      solucion: [
        { texto: ['La 5 saca la conclusión de ', cubre('la 3 y la 4'), ': la idea junta la rapidez del celular y el pedido de comprobar.'] },
        { texto: [mala('A'), ' es la 1 y ', mala('D'), ', parte de la 4: ', prop('muy estrechas'), '. ', mala('B'), ' ', prop('solo nombra'), '.'] },
        { texto: [mala('E'), ' dice «todo» y «falso»: el texto habla de rumores, no de todo. ', buena('C'), ' cubre ', cubre('las cinco'), '.'] }],
      respuesta: [buena('C'), ': las noticias del celular llegan rápido, pero hay que comprobarlas'] },
  ];

  const temaIdea = {
    id: 'tema-e-idea',
    titulo: 'Lo que el texto afirma',
    pregunta: '¿Qué le falta al tema para ser la idea principal?',
    temas: ['Idea principal e ideas secundarias'],
    pieza: 'rv-soporte',
    lee: {
      tarjetas: [
        { titulo: 'Nombrar no es decir', texto: '«La totora» nombra un asunto, como el tema que buscaste en la idea anterior. «La totora flota» ya dice algo de ella: eso es afirmar.' },
        { titulo: 'Se puede creer o negar', texto: 'Lo que afirma algo se puede creer o negar: «la totora se come» es cierto o falso. «La totora», sola, no es ni cierta ni falsa: no dice nada.' },
        { titulo: 'Qué mirar al jugar', texto: 'Este folleto se reparte en el muelle de Puno. Debajo va «Tu idea», que ya trae el tema. Elige qué afirma el folleto de la totora y mira cuántas oraciones se pintan.' },
      ],
    },
    actividad: 'Completar una frase sobre la totora y ver cuántas oraciones del folleto cubre.',
    aprendizaje: 'La idea principal es el tema más lo que todo el texto afirma de él; puede ir en cualquier oración o repartida en varias.',
    ejemplos: EJEMPLOS_IDEA,
    juega: {
      consigna: 'Este folleto se reparte a los visitantes en el muelle de Puno. Ya tienes el tema; falta lo que el texto afirma de él.',
      mision: {
        texto: 'Elige lo que el folleto afirma de la totora hasta cubrir las 5 oraciones.',
        logrado: val => AFIRMA[val.a].c !== null && AFIRMA[val.a].c.length === N_FOLLETO,
        bien: 'Tema más lo que afirma todo el folleto: esa es la idea principal.',
      },
      voz: 'Una frase que solo nombra no se puede creer ni negar.',
      leyenda: [
        { s: '1, 2, 3, 4, 5', t: 'número de cada oración del folleto' },
        { s: cubre('turquesa'), t: 'oración que tu idea cubre' },
        { s: 'gris', t: 'oración que queda fuera' },
        { s: prop('naranja'), t: 'la idea que estás probando' },
        { s: justo('violeta'), t: 'la idea principal' },
      ],
      controles: [{ id: 'a', etiqueta: 'Lo que afirma de la totora', opciones: Object.entries(AFIRMA).map(([valor, x]) => ({ valor, texto: x.b })) }],
      dibujo: val => ({ datos: figFolleto(val.a), estado: estFolleto(val.a) }),
      lectura: val => lecturaFolleto(val.a),
      minimo: 4,
    },
    predice: {
      pregunta: 'En estos apuntes, ninguna oración dice sola la idea principal. ¿Cuál es?',
      datos: ['Tema: de qué trata todo el texto, dicho en una frase.', '°C: grado Celsius, la unidad del termómetro.'],
      opciones: [
        { id: 'c', texto: IDEA_AGUA, correcta: true },
        { id: 'primera', texto: 'En Juliaca, el agua de la olla hierve a unos 87\u00a0°C', error: 'RV4', siFuera: 'Es un dato cierto de la oración 1, pero deja fuera Lima, la razón y los fideos.' },
        { id: 'razon', texto: 'Arriba hay menos aire que empuje sobre el agua de la olla', error: 'RV1', siFuera: 'Es la razón de la oración 3, pero sola no dice qué pasa con el agua.' },
        { id: 'final', texto: 'Los fideos tardan más en cocinarse cuando se está en la altura', error: 'RV3', siFuera: 'Es la oración 4, pero falta por qué: el agua hierve a menos grados.' },
        { id: 'nombra', texto: 'El agua que hierve en la altura y a orillas del mar', error: 'RV65', siFuera: 'Nombra bien el asunto de todo el texto, pero no afirma nada de él.' },
      ],
      dibujo: { datos: APUNTES, estado: {} },
      revelar: { datos: APUNTES_IDEA, estado: Object.assign(todo(APUNTES), { marcas: { h1: 'i', h2: 'i', h3: 'i', h4: 'i', frase: 'f' } }) },
      coincide: 'Coincide: ninguna oración la dice sola; la idea se arma uniendo las cuatro.',
    },
    mira: {
      pieza: 'rv-soporte',
      datos: APUNTES_IDEA,
      pasos: [
        { estado: { marcas: { h1: 'i', h2: 'i', frase: 'f' }, tapar: ['frase'], nuevo: ['h1', 'h2'] }, texto: 'La 1 y la 2 comparan: arriba, el agua hierve a menos grados.', ecuacion: [cubre('87\u00a0°C'), ' en Juliaca, ', cubre('100\u00a0°C'), ' en Lima'] },
        { estado: { marcas: { h1: 'i', h2: 'i', h3: 'i', frase: 'f' }, tapar: ['frase'], nuevo: ['h3'] }, texto: 'La 3 dice por qué: arriba hay menos aire que empuje sobre el agua.' },
        { estado: { marcas: { h1: 'i', h2: 'i', h3: 'i', h4: 'i', frase: 'f' }, tapar: ['frase'], nuevo: ['h4'] }, texto: 'La 4 dice qué pasa en la cocina: los fideos tardan más.' },
        { estado: { marcas: { h1: 'i', h2: 'i', h3: 'i', h4: 'i', frase: 'f' }, nuevo: ['frase'] }, texto: 'Ninguna lo dice sola: la idea principal une las cuatro.',
          ecuacion: [{ llave: ['el agua en la altura'], nota: 'tema' }, ' + ', { llave: [justo('hierve a menos grados y cocina más lento')], nota: 'lo que afirma', color: 'c-f' }] },
        { estado: { marcas: { h1: 'i', h2: 'i', h3: 'i', h4: 'i', frase: 'f' } }, texto: 'Prueba final: se puede creer o negar, y no deja fuera ninguna oración.', ecuacion: [justo('idea principal'), ': cubre ', cubre('4 de 4')] },
      ],
    },
    regla: {
      texto: 'La idea principal es el tema más lo que todo el texto afirma de él. Puede estar en una oración (al inicio, en medio o al final) o repartida.',
      ecuacion: [{ llave: [justo('idea principal')], nota: 'se puede creer o negar', color: 'c-f' }, ' = ', { llave: ['tema'], nota: 'de qué trata' }, ' + ', { llave: ['lo que afirma'], nota: 'todo el texto' }],
      condicion: 'afirma algo y cubre todas las oraciones; si solo nombra, es el tema; si cubre una parte, es un detalle.',
    },
    resuelve: {
      pieza: 'rv-soporte',
      generar(s) {
        const R = RESUELVE_IDEA[s % RESUELVE_IDEA.length];
        const n = oracionesDe(R.sop).length;
        return {
          enunciado: R.enunciado,
          datos: R.datos,
          dibujo: { datos: R.sop, estado: {} },
          pasos: [
            { tipo: 'pide', texto: `Piden la idea principal: lo que todo ${R.nombre} afirma de su tema, no solo el tema.` },
            { tipo: 'datos', texto: `${R.nombre.charAt(0).toUpperCase() + R.nombre.slice(1)} tiene ${n} oraciones; las frases para probar están en la pregunta.` },
            { tipo: 'regla', texto: 'Si solo nombra el asunto, es el tema; si cubre una parte, es un detalle; la idea principal afirma algo y cubre todo.' },
            { tipo: 'aplica', texto: R.malas },
            { tipo: 'aplica', texto: R.buena, dibujo: { datos: R.sop, estado: conIdea(R.sop, R.en) } },
            { tipo: 'sentido', texto: R.sentido },
          ],
          respuesta: [justo(R.respuesta)],
        };
      },
    },
    ahoraTu: {
      pieza: 'rv-soporte',
      generar(s) {
        const A = AHORA_IDEA[s % AHORA_IDEA.length];
        return {
          pregunta: A.pregunta,
          datos: A.datos,
          dibujo: { datos: A.sop, estado: {} },
          opciones: opciones(A.ok, voltear(A.m, s)),
          solucion: { texto: `Afirma algo del tema y cubre todas las oraciones${A.mixto ? ' y la tabla' : ''}, esté donde esté.`, ecuacion: [justo(A.ok)],
            dibujo: { datos: A.sop, estado: conIdea(A.sop, A.en) } },
        };
      },
    },
  };

  // ---------- Idea 3: principal y secundarias (etapa 2, 17 nov; docs/etapa2/propuesta-verbal.md y decisiones.md) ----------
  // Cambia: la oración que se subraya (resaltador) y la que se tacha (lápiz). Permanece: el texto de las casas de adobe en
  // la hoja de Rosa. Progresa: qué oraciones le responden a la subrayada y qué se pierde al tachar. Se reserva: un texto
  // cuya principal no es la primera (predicción). Debe verse: que una oración manda y las otras le dan un porqué, un cómo
  // o un ejemplo, y que lo que no le responde nada sobra.
  // Objeto de la primera pantalla: la hoja de cuaderno con el texto copiado del libro, y el resaltador y el lápiz en la
  // bandeja (rv-soporte, dibujos de prueba). Colores: la principal f (violeta), la que se prueba como principal o
  // (naranja), las que la sostienen i (turquesa), lo que sobra tachado. El árbol de «Mira» es rv-arbol.
  const D_SEC = 'Idea secundaria: da un porqué, un cómo o un ejemplo de la principal.';
  const CASAS = { soporte: 'cuaderno', lugar: 'Cuaderno de Rosa', bandeja: true, hojas: [
    { id: 'c', titulo: 'Copiado del libro de Ciencias Sociales', de: 'el libro de 5.º', para: 'Rosa, que estudia para el examen', oraciones: ora('c', [
      'Las casas de adobe del altiplano están hechas para guardar el calor.',
      'El adobe absorbe el sol de día y lo suelta de noche.',
      'Sus ventanas son chicas, y así se escapa menos calor.',
      'Por ejemplo, en una casa de adobe de Ilave, la noche se siente menos fría que afuera.',
      'En la costa, muchas casas antiguas también son de adobe.']) }] };
  // El papel de cada oración del texto de las casas: la principal, las que le responden y la que sobra.
  const PAPEL_C = { principal: 1, apoyan: { 2: 'un cómo', 3: 'un cómo', 4: 'un ejemplo' }, sobra: 5 };
  const N_CASAS = oracionesDe(CASAS).length;
  const BANDEJA = () => SOP().disponer(CASAS).bandeja;
  const estCasas = (s, t) => {
    const marcas = {}, tachar = t ? [`c${t}`] : [];
    if (s === PAPEL_C.principal) { marcas[`c${s}`] = 'f'; for (const k of Object.keys(PAPEL_C.apoyan)) if (+k !== t) marcas[`c${k}`] = 'i'; }
    else if (s) marcas[`c${s}`] = 'o';
    if (t && t === s) delete marcas[`c${s}`];
    return { marcas, tachar };
  };
  const SI_MANDA = {
    2: [prop('Si manda la 2'), ', ¿a qué le responde la 1?'],
    3: [prop('Si manda la 3'), ', la 1 y la 2 quedan sueltas'],
    4: [prop('Si manda el ejemplo'), ', ¿de qué es ejemplo?'],
    5: [prop('Si manda la 5'), ': habla de la costa; nadie le responde'],
  };
  const lecturaCasas = (s, t) => {
    const P = PAPEL_C, quienes = Object.keys(P.apoyan).join(', ').replace(/, (\d)$/, ' y $1');
    if (s && s === t) return [prop('La misma oración'), ': no se subraya y se tacha a la vez'];
    if (s && s !== P.principal) return SI_MANDA[s];
    if (s === P.principal && t === P.sobra) return [justo(`La ${s} manda`), ': ', cubre(quienes), ' la sostienen; la 5 sobraba'];
    if (t && P.apoyan[t]) return [prop(`Sin la ${t}`), ` se pierde ${P.apoyan[t]}: sí la sostenía`];
    if (t === P.principal) return [prop(`Sin la ${t}`), ', las demás quedan sueltas'];
    if (s === P.principal) return [justo(`La ${s} manda`), ': ', cubre(quienes), ' le responden; ¿y la 5?'];
    if (t === P.sobra) return [`Sin la ${t}, el texto dice lo mismo. ¿Cuál manda?`];
    return ['Lleva el resaltador a la oración que creas que manda'];
  };

  // Predice y Mira: el texto del cuy, que empieza con lo que mucha gente cree (la principal es la 2).
  const CUY = { soporte: 'cuaderno', lugar: 'Cuaderno de Diego', hojas: [
    { id: 'k', titulo: 'Copiado del libro de Ciencias Sociales', de: 'el libro de 5.º', para: 'Diego, que estudia para el examen', oraciones: ora('k', [
      'Mucha gente piensa que el cuy se cría solo para las fiestas.',
      'Sin embargo, en muchas familias de Puno el cuy es una forma de ahorro.',
      'Cuando hace falta plata para útiles o una medicina, se venden algunos en la feria.',
      'Además, se reproducen rápido y comen hierba y cáscaras de la cocina.']) }] };
  const ARBOL_CUY = { soporte: CUY, titulo: 'Quién manda en el texto', vacio: 'Arriba irá la oración que manda; debajo, las que le responden.',
    raiz: { n: 2, t: 'En muchas familias de Puno, el cuy es una forma de ahorro' },
    ramas: [{ id: 'r1', n: 1, rel: 'Lo que corrige', t: 'Lo que mucha gente piensa: que es solo para fiestas' },
      { id: 'r3', n: 3, rel: '¿Cómo ahorran?', t: 'Venden algunos cuando falta plata' },
      { id: 'r4', n: 4, rel: '¿Por qué conviene?', t: 'Se reproducen rápido y comen poco' }] };
  const solo = (m, extra = {}) => Object.assign({ soporte: { marcas: m } }, extra);

  // «Así se resuelve»: la principal al final, en medio y al inicio, y una que sobra. Textos distintos de «Ahora tú».
  // est: qué número de oración es la principal, cuáles la sostienen y cuál sobra (lo que pinta la figura del paso).
  const RESUELVE_JER = [
    { nombre: 'el folleto', est: { principal: 3, apoyan: [1, 2, 4] },
      sop: { soporte: 'folleto', lugar: 'Folleto de la municipalidad de Juliaca', hojas: [{ id: 'j', titulo: 'Municipalidad informa', de: 'la municipalidad', para: 'vecinos', oraciones: ora('j', [
        'En febrero, la lluvia llena de charcos las calles de Juliaca.',
        'Muchas calles no tienen desagüe para el agua de lluvia.',
        'Por eso, en Juliaca hay calles que se inundan casi cada verano.',
        'Por ejemplo, el verano pasado varias calles del centro quedaron bajo el agua.']) }] },
      enunciado: '¿Qué oración del folleto es la principal y qué hacen las demás con ella?',
      datos: [D_IDEA, D_SEC, 'Desagüe: tubo o canal que se lleva el agua.'],
      a1: ['La 3 dice lo que pasa en la ciudad: se inunda casi cada verano. ', justo('Es la candidata'), '.'],
      a2: [cubre('La 1 y la 2'), ' le responden ¿por qué?, y ', cubre('la 4'), ' le da un ejemplo: todas cuelgan de la 3.'],
      sentido: 'Prueba: sin la 4, la 3 sigue en pie; sin la 3, las demás quedan sueltas.',
      respuesta: 'La 3; la 1 y la 2 dan el porqué; la 4, un ejemplo' },
    { nombre: 'el mensaje', est: { principal: 2, apoyan: [1, 3, 4] },
      sop: { soporte: 'mensaje', lugar: 'Familias de 5.º B', hojas: [{ id: 'm', de: 'la profesora de Comunicación', para: 'familias de 5.º B', oraciones: ora('m', [
        'El año pasado, los alumnos de 5.º B leyeron quince minutos cada mañana.',
        'Leer un poco cada día mejora la comprensión de lectura.',
        'Cada lectura deja palabras nuevas y práctica para seguir un texto largo.',
        'Al final del año, 5.º B tuvo las mejores notas del colegio en Comunicación.']) }] },
      enunciado: 'Este mensaje empieza con un caso. ¿Qué oración es la principal y qué hacen las demás?',
      datos: [D_IDEA, D_SEC],
      a1: ['La 1 y la 4 cuentan un caso, el de 5.º B. La 2 dice algo que vale para todos: ', justo('es la candidata'), '.'],
      a2: [cubre('La 3'), ' responde ¿por qué?, y el caso de ', cubre('la 1 y la 4'), ', ¿por ejemplo?: todo cuelga de la 2.'],
      sentido: 'La principal va segunda: la abre un ejemplo, no ella.',
      respuesta: 'La 2: leer un poco cada día mejora la comprensión' },
    { nombre: 'el folleto del sueño', est: { principal: 1, apoyan: [2, 3], sobra: 4 },
      sop: { soporte: 'folleto', lugar: 'Folleto del puesto de salud', hojas: [{ id: 's', titulo: 'Puesto de salud informa', de: 'el puesto de salud', para: 'familias', oraciones: ora('s', [
        'Dormir bien ayuda a los escolares a aprender.',
        'Mientras uno duerme, el cerebro ordena lo que estudió en el día.',
        'Además, quien descansa atiende mejor en clase.',
        'Los bebés recién nacidos duermen casi todo el día.']) }] },
      enunciado: '¿Qué oración del folleto no sostiene la idea principal?',
      datos: [D_IDEA, D_SEC],
      a1: ['La 1 es la principal: ', justo('dormir bien ayuda a aprender'), '. ', cubre('La 2 y la 3'), ' le responden ¿por qué?'],
      a2: ['La 4 habla de dormir, pero de bebés: ', prop('no dice por qué dormir ayuda a aprender'), '. Se tacha.'],
      sentido: 'Prueba: sin la 4, el folleto dice lo mismo. Sobraba.',
      respuesta: 'La 4: habla del sueño, pero no sostiene la principal' },
    { nombre: 'el cartel', est: { principal: 1, apoyan: [2, 3, 4] },
      sop: { soporte: 'cartel', lugar: 'Cartel en la entrada del mercado de Puno', hojas: [{ id: 'm', titulo: 'Comunicado', de: 'la municipalidad', para: 'vendedores y compradores', oraciones: ora('m', [
        'Desde abril, el mercado separará la basura en tres tachos.',
        'En el verde irán las cáscaras y los restos de comida.',
        'Así, esos restos se volverán abono para los parques de la ciudad.',
        'En los otros dos irán el plástico y el papel.']) }] },
      enunciado: 'En este cartel, ¿qué papel cumple la oración 3?',
      datos: [D_IDEA, D_SEC, 'Abono: lo que se echa a la tierra para que las plantas crezcan mejor.'],
      a1: ['La principal es la 1: ', justo('el mercado separará la basura'), '. La 2 y la 4 dicen cómo.'],
      a2: [cubre('La 3'), ' responde ¿para qué separar?: le da una razón a la principal. Es una secundaria.'],
      sentido: 'Prueba: sin la 3, la 1 sigue en pie; se pierde solo una razón.',
      respuesta: 'Una secundaria: da la razón de separar la basura' },
  ];

  // «Ahora tú»: la principal al final, el papel de una oración, la que sobra, una creencia al inicio y dos de examen
  // (seis oraciones). Códigos: RV4 (la primera oración), RV1 (un detalle), RV42 (cumple otra función), RV30 (se cree que
  // sobra y sí sostiene), RV43 (todo pesa igual). marca: la oración por la que se pregunta (en naranja: la que se prueba).
  const AHORA_JER = [
    { sop: { soporte: 'cuaderno', lugar: 'Cuaderno de Rosa', hojas: [{ id: 'a', titulo: 'Ciencia y Tecnología', de: 'Rosa', para: 'estudiar para la práctica', oraciones: ora('a', [
        'La alpaca da una fibra suave y abrigadora.',
        'Su carne tiene poca grasa.',
        'Por eso, la alpaca es muy valiosa para las familias del altiplano.']) }] },
      pregunta: '¿Qué oración de estos apuntes es la principal?', est: { principal: 3, apoyan: [1, 2] },
      ok: 'La 3', m: [['La 1', 'RV4', 'Es la primera y dice algo cierto, pero es una razón de la 3.'], ['La 2', 'RV1', 'Es un dato cierto, pero responde ¿por qué es valiosa? a la 3.']] },
    { sop: { soporte: 'mensaje', lugar: 'Grupo de 3.º A', hojas: [{ id: 'b', de: 'el profesor de Educación Física', para: 'familias de 3.º A', oraciones: ora('b', [
        'Caminar al colegio es un buen ejercicio para cada día.',
        'Mueve las piernas y hace trabajar al corazón.',
        'Por ejemplo, Lucía camina veinte minutos cada mañana y ya no se cansa al subir escaleras.']) }] },
      pregunta: 'En este mensaje, ¿qué papel cumple la oración 3?', marca: 3, est: { principal: 1, apoyan: [2, 3] },
      ok: 'Un ejemplo que sostiene la principal',
      m: [['La idea principal de todo el mensaje', 'RV42', 'Cuenta un caso; la principal es la 1, que vale para todos.'], ['Una oración que no sostiene la principal', 'RV30', 'Sí la sostiene: muestra a alguien a quien caminar le hace bien.']] },
    { sop: { soporte: 'cartel', lugar: 'Cartel en el quiosco del colegio', hojas: [{ id: 'q', titulo: 'Quiosco saludable', de: 'el quiosco', para: 'estudiantes', oraciones: ora('q', [
        'Desde este año, el quiosco del colegio ya no vende gaseosas.',
        'Ahora vende agua, fruta y refresco de quinua.',
        'Los precios son parecidos a los de antes.',
        'El colegio tiene dos patios y una cancha de fulbito.']) }] },
      pregunta: '¿Qué oración de este cartel no sostiene la idea principal?', est: { principal: 1, apoyan: [2, 3], sobra: 4 },
      ok: 'La 4', m: [['La 3', 'RV30', 'Habla de precios, y sí suma: dice que el cambio no encarece.'], ['La 1', 'RV42', 'Es la principal: las demás hablan de ella.']] },
    { sop: { soporte: 'folleto', lugar: 'Folleto del muelle de Puno', hojas: [{ id: 'l', titulo: 'El lago que cambia', de: 'la caseta del muelle', para: 'visitantes', oraciones: ora('l', [
        'Muchos creen que el lago Titicaca está siempre igual.',
        'En realidad, su nivel sube y baja según las lluvias de cada año.',
        'En los años secos, el agua baja y deja al aire las orillas.',
        'En los años de mucha lluvia, sube e inunda las chacras de la orilla.']) }] },
      pregunta: 'Este folleto empieza con lo que muchos creen. ¿Qué oración es la principal?', est: { principal: 2, apoyan: [3, 4] },
      ok: 'La 2', m: [['La 1', 'RV4', 'Abre el folleto, pero es lo que el texto corrige.'], ['La 4', 'RV1', 'Dice algo cierto, pero es un caso de lo que afirma la 2.'], ['Las cuatro: todas pesan igual', 'RV43', 'Todas dicen algo, pero la 3 y la 4 le responden a la 2.']] },
    { sop: { soporte: 'simulacro', numero: 18, hojas: [{ id: 'p', oraciones: ora('p', [
        'La papa nativa de Puno tiene cientos de variedades, de colores y formas distintas.',
        'Esa variedad la protege: si una plaga ataca a una, otras resisten.',
        'Por eso, guardar muchas variedades es una forma de asegurar la comida.',
        'Algunas comunidades siembran más de cien tipos en una sola chacra.',
        'La papa llegó a Europa hace más de cuatrocientos años.',
        'Así, cada año hay papa, aunque una variedad se pierda.']) }] },
      pregunta: '¿Qué oración no sostiene la idea principal del texto?', est: { principal: 3, apoyan: [1, 2, 4, 6], sobra: 5 },
      datos: [D_IDEA, D_SEC, 'Plaga: insectos o enfermedades que dañan un cultivo.'],
      ok: 'La 5', m: [['La 1', 'RV30', 'Sí suma: dice que hay muchas variedades, la base de la idea.'], ['La 3', 'RV42', 'Es la principal: las demás la sostienen.'], ['La 4', 'RV1', 'Es un caso, un detalle, pero muestra comunidades que guardan muchas.']] },
    { sop: { soporte: 'simulacro', numero: 19, hojas: [{ id: 'v', oraciones: ora('v', [
        'Hace unos años, en un barrio de Juliaca casi nadie separaba su basura.',
        'Un grupo de vecinas empezó a juntar botellas y cartones para venderlos.',
        'Con lo que ganaron, compraron tachos de colores para cada cuadra.',
        'Hoy, más de la mitad de las casas del barrio separa su basura.',
        'Lo que empezó como el negocio de unas pocas vecinas cambió la costumbre de todo un barrio.',
        'Ahora otros barrios piden que les enseñen.']) }] },
      pregunta: '¿Qué oración dice la idea principal del texto?', est: { principal: 5, apoyan: [1, 2, 3, 4, 6] },
      datos: [D_IDEA, D_SEC, 'Relato: texto que cuenta algo que le pasó a alguien.'],
      ok: 'La 5', m: [['La 1', 'RV4', 'Abre el relato con el antes; no dice qué cambió.'], ['La 4', 'RV1', 'Es el resultado, un dato; la 5 dice qué significa todo.'], ['La 6', 'RV42', 'Es lo que pasa después, una consecuencia; no junta el relato.']] },
  ];
  const estJer = (sop, e, marca) => {
    const ids = oracionesDe(sop), marcas = {};
    if (marca) marcas[ids[marca - 1]] = 'o';
    if (e) { for (const k of e.apoyan || []) marcas[ids[k - 1]] = 'i'; marcas[ids[e.principal - 1]] = 'f'; }
    return { marcas, tachar: e && e.sobra ? [ids[e.sobra - 1]] : [] };
  };

  // Ejemplos resueltos de la idea 3. Nivel 1: el papel de una oración o cuál manda, en tres o cuatro oraciones; un paso.
  // Nivel 2: la principal después de una creencia o de un caso, una que sobra entre las que sostienen, la pregunta a la
  // que responde una oración, la prueba de tapar; dos pasos. Nivel 3: hoja de simulacro de cinco o seis oraciones con
  // cinco alternativas (eliminar la que no sostiene, el papel de una oración, cuál manda, qué subrayar).
  // Revisado aparte (scratchpad verbal-revisa.js): cada oración citada existe y los conteos coinciden.
  const EJEMPLOS_JER = [
    { nivel: 1, titulo: 'Los libros del fin de semana',
      enunciado: 'En este aviso, ¿qué papel cumple la oración 2?',
      datos: [D_IDEA, D_SEC],
      figura: fig({ soporte: 'puerta', lugar: 'Puerta de la biblioteca del colegio', hojas: [{ id: 'h', titulo: 'Aviso', de: 'la biblioteca', para: 'estudiantes', oraciones: ora('h', [
        'La biblioteca del colegio prestará libros para el fin de semana.', 'Se piden el viernes con el carné y se devuelven el lunes.', 'Así, cada uno puede leer en casa con calma.']) }] }),
      solucion: [
        { texto: ['La 1 dice lo que cambia: ', justo('es la principal'), '. La 2 le responde «¿cómo se piden?»: ', cubre('da un cómo'), '.'] }],
      respuesta: [justo('Una secundaria'), ': dice cómo se piden los libros'] },
    { nivel: 1, titulo: 'Las plantas que curan',
      enunciado: 'En estos apuntes, ¿qué papel cumple la oración 2?',
      datos: [D_IDEA, D_SEC, 'Muña: hierba de los Andes que se toma en mate.'],
      figura: fig({ soporte: 'cuaderno', lugar: 'Cuaderno de Rosa', hojas: [{ id: 'h', titulo: 'Ciencia y Tecnología', de: 'Rosa', para: 'estudiar para la práctica', oraciones: ora('h', [
        'En el altiplano, muchas plantas se usan como remedio casero.', 'Por ejemplo, la muña se toma en mate para el dolor de estómago.', 'Y la chachacoma se toma para el mal de altura.']) }] }),
      solucion: [
        { texto: ['La 1 dice algo que vale para muchas plantas. La 2 muestra una: ', cubre('es un ejemplo'), ' de la 1, igual que la 3.'] }],
      respuesta: [justo('Una secundaria'), ': un ejemplo de la oración 1'] },
    { nivel: 1, titulo: 'La venta de queques',
      enunciado: '¿Qué oración de este mensaje es la principal: la 1, la 2 o la 3?',
      datos: [D_IDEA, D_SEC],
      figura: fig({ soporte: 'mensaje', lugar: 'Grupo de 2.º C', hojas: [{ id: 'h', de: 'la delegada', para: 'compañeros de 2.º C', oraciones: ora('h', [
        'Con la venta de queques juntamos doscientos soles.', 'Con ese dinero compramos dos pelotas y una red.', 'La venta de queques sirvió para equipar al equipo de vóley del salón.']) }] }),
      solucion: [
        { texto: [cubre('La 1 y la 2'), ' dicen cuánto se juntó y qué se compró: le responden «¿cómo?» a la 3, que junta las dos.'] }],
      respuesta: [justo('La oración 3'), ': la venta sirvió para equipar al equipo'] },
    { nivel: 1, titulo: 'La oración que sobra',
      enunciado: '¿Qué oración del cartel no sostiene la idea principal?',
      datos: [D_IDEA, D_SEC],
      figura: fig({ soporte: 'cartel', lugar: 'Cartel en la posta', hojas: [{ id: 'h', titulo: 'Cuidado con los perros', de: 'la posta', para: 'vecinos', oraciones: ora('h', [
        'Un perro de la calle puede morder si se le asusta.', 'Por eso, no hay que correr cerca de ellos.', 'Tampoco hay que quitarles la comida.', 'El perro sin pelo del Perú es una raza muy antigua.']) }] }),
      solucion: [
        { texto: ['La 1 es la principal; ', cubre('la 2 y la 3'), ' dicen cómo evitar la mordida. La 4 habla de perros, pero ', prop('no dice nada de morder'), '.'] }],
      respuesta: [justo('La oración 4'), ': habla de perros, pero no de morder'] },
    { nivel: 1, titulo: 'El agua hervida',
      enunciado: 'En este folleto, ¿qué papel cumplen la oración 2 y la 3?',
      datos: [D_IDEA, D_SEC, 'Microbio: ser vivo tan chico que no se ve, y que puede enfermar.'],
      figura: fig({ soporte: 'folleto', lugar: 'Folleto del puesto de salud', hojas: [{ id: 'h', titulo: 'Puesto de salud informa', de: 'el puesto de salud', para: 'familias', oraciones: ora('h', [
        'Conviene tomar agua hervida y no agua del caño sin hervir.', 'El agua del caño puede traer microbios.', 'Hervirla cinco minutos los mata.']) }] }),
      solucion: [
        { texto: ['La 1 aconseja algo: ', justo('es la principal'), '. ', cubre('La 2 y la 3'), ' le responden «¿por qué?»: los microbios y lo que hace el hervor.'] }],
      respuesta: [justo('Secundarias'), ': dan el porqué de la oración 1'] },

    { nivel: 2, titulo: 'Leer en voz alta',
      enunciado: '¿Qué oración dice la idea principal, y qué hace con ella la oración 1?',
      datos: [D_IDEA, D_SEC, 'Postulante: quien se prepara para entrar a la universidad.'],
      figura: fig({ soporte: 'folleto', lugar: 'Folleto de la academia', hojas: [{ id: 'h', titulo: 'Consejos para estudiar', de: 'la academia', para: 'postulantes', oraciones: ora('h', [
        'Se suele decir que leer en voz alta es cosa de niños chicos.', 'En realidad, también ayuda a los jóvenes que preparan un examen.',
        'Al leer en voz alta, uno va más lento y nota lo que no entiende.', 'Además, oírse a uno mismo ayuda a recordar.', 'Por eso, muchos postulantes repasan leyendo en voz alta.']) }] }),
      solucion: [
        { texto: ['La 1 cuenta lo que «se suele decir», y la 2 lo corrige: la 2 es la candidata.'] },
        { texto: [cubre('La 3 y la 4'), ' le responden ¿por qué?, y ', cubre('la 5'), ' saca una consecuencia: todas cuelgan de la 2. La 1 es lo que corrige.'] }],
      respuesta: [justo('La 2'), '; la 1 es lo que el texto corrige'] },
    { nivel: 2, titulo: 'El caso de doña Hilda',
      enunciado: '¿Qué oración es la principal? ¿Qué hacen con ella la 1 y la 2?',
      datos: [D_IDEA, D_SEC, 'Efectivo: billetes y monedas.'],
      figura: fig({ soporte: 'folleto', lugar: 'Folleto de la feria de Ilave', hojas: [{ id: 'h', titulo: 'Para vender más', de: 'la junta de la feria', para: 'vendedores', oraciones: ora('h', [
        'Doña Hilda vende tejidos en la feria de Ilave.', 'Desde que acepta pagos con el celular, vende más.',
        'Aceptar pagos con el celular puede hacer crecer un negocio pequeño.', 'Muchos compradores ya no llevan efectivo.', 'Y no hay que buscar sencillo para dar vuelto.']) }] }),
      solucion: [
        { texto: ['La 1 y la 2 cuentan lo que le pasó a una vendedora. La 3 dice algo que vale para cualquier negocio: es la candidata.'] },
        { texto: [cubre('La 4 y la 5'), ' le responden ¿por qué?, y ', cubre('la 1 y la 2'), ' son un ejemplo: todas cuelgan de la 3.'] }],
      respuesta: [justo('La 3'), '; la 1 y la 2 son un ejemplo'] },
    { nivel: 2, titulo: 'Subrayar y tachar',
      enunciado: 'Para estudiar este texto, ¿qué oración se subraya como principal y cuál se tacha?',
      datos: [D_IDEA, D_SEC],
      figura: fig({ soporte: 'cuaderno', lugar: 'Cuaderno de Diego', hojas: [{ id: 'h', titulo: 'Ciencias Sociales', de: 'Diego', para: 'estudiar para el examen', oraciones: ora('h', [
        'En Puno hace frío casi todo el año.', 'Por eso, una chompa de alpaca es la prenda más útil del ropero.',
        'Abriga mucho y pesa poco.', 'Además, dura años si se lava a mano.', 'Las ovejas llegaron a América con los españoles.']) }] }),
      solucion: [
        { texto: ['La 2 dice lo que el texto quiere mostrar; ', cubre('la 1, la 3 y la 4'), ' le dan un porqué: el frío, el abrigo y lo que dura.'] },
        { texto: ['La 5 habla de animales, pero ', prop('no le responde nada a la 2'), ': sin ella, el texto dice lo mismo.'] }],
      respuesta: [justo('Se subraya la 2'), ' y se tacha la 5'] },
    { nivel: 2, titulo: 'La pregunta que responde',
      enunciado: '¿A qué pregunta le responde la oración 3: «¿por qué?», «¿cómo?» o «¿por ejemplo?»?',
      datos: [D_IDEA, D_SEC, 'Ladera: el costado inclinado de un cerro.'],
      figura: fig({ soporte: 'cuaderno', lugar: 'Cuaderno de Rosa', hojas: [{ id: 'h', titulo: 'Historia del Perú', de: 'Rosa', para: 'estudiar para la práctica', oraciones: ora('h', [
        'Los andenes permiten sembrar en las laderas de los cerros.', 'Son escalones de tierra sostenidos por muros de piedra.',
        'Cada escalón es plano, así que el agua de riego no se escurre.', 'Por ejemplo, en Pisac todavía se siembra en andenes antiguos.']) }] }),
      solucion: [
        { texto: ['La 1 es la principal. La 4 empieza con «por ejemplo»; la 2 y la 3 explican de qué manera se logra sembrar en la ladera.'] },
        { texto: [cubre('La 3'), ' dice cómo el escalón plano guarda el agua: responde «¿cómo?» a la 1.'] }],
      respuesta: [justo('«¿Cómo?»'), ': explica cómo los andenes permiten sembrar'] },
    { nivel: 2, titulo: 'Tapar para probar',
      enunciado: 'Rosa cree que la principal es la 1. Si se tapa la 1, ¿las demás quedan sueltas? ¿Cuál es la principal?',
      datos: [D_IDEA, D_SEC, 'Bidón: envase grande de plástico para el agua.'],
      figura: fig({ soporte: 'folleto', lugar: 'Folleto de la junta de vecinos', hojas: [{ id: 'h', titulo: 'Agua para todos', de: 'la junta de vecinos', para: 'familias del barrio', oraciones: ora('h', [
        'Muchas familias del barrio compran agua en bidones.', 'El agua del caño a veces sale turbia o se corta.',
        'En el barrio, conseguir agua limpia es un gasto de todos los días.', 'Un bidón de veinte litros cuesta unos cinco soles.']) }] }),
      solucion: [
        { texto: ['Sin la 1, la 3 sigue diciendo lo mismo: la 1 no mandaba. Sin la 3, ', cubre('la 1, la 2 y la 4'), ' quedan sueltas.'] },
        { texto: ['La 1 y la 4 dicen cuánto se gasta y la 2, por qué: todas le responden a la 3.'] }],
      respuesta: [justo('La 3'), ': sin ella, las demás quedan sueltas'] },

    { nivel: 3, titulo: 'La kiwicha del desayuno',
      enunciado: 'Pregunta 20 del simulacro: «¿Qué oración se elimina porque no sostiene la idea principal?». ¿Qué alternativa es la correcta?',
      datos: [D_IDEA, D_SEC, 'Kiwicha: grano andino pequeño, que se come reventado o en papilla.'],
      figura: fig({ soporte: 'simulacro', numero: 20, hojas: [{ id: 'h', oraciones: ora('h', [
        'La kiwicha es un grano andino que conviene comer más seguido.', 'Tiene más proteína que el arroz.', 'Además, aporta hierro y calcio.',
        'Se puede comer reventada, como canchita, o en papilla.', 'El arroz es uno de los granos que más se comen en el Perú.', 'Por eso, algunos colegios la ponen en el desayuno escolar.']) }],
        pregunta: '¿Qué oración se elimina porque no sostiene la idea principal?', alternativas: [
          { id: 'A', t: 'La 1' }, { id: 'B', t: 'La 2' }, { id: 'C', t: 'La 4' }, { id: 'D', t: 'La 5' }, { id: 'E', t: 'La 6' }] }),
      solucion: [
        { texto: ['La 1 es la principal: ', mala('A'), ' no se elimina. ', cubre('La 2 y la 3'), ' dan razones; ', cubre('la 4'), ', cómo se come; ', cubre('la 6'), ', una consecuencia.'] },
        { texto: [mala('B'), ', ', mala('C'), ' y ', mala('E'), ' sostienen la idea. La 5 habla del arroz, pero no dice nada de la kiwicha: ', buena('D'), '.'] }],
      respuesta: [buena('D'), ': la 5, que habla del arroz y no de la kiwicha'] },
    { nivel: 3, titulo: 'La puna llena de vida',
      enunciado: 'Pregunta 22 del simulacro: «En el texto, la oración 4 cumple la función de». ¿Qué alternativa es la correcta?',
      datos: [D_IDEA, D_SEC, 'Puna: zona alta y fría de los Andes, con pastos.', 'Ichu: paja que crece en la puna.'],
      figura: fig({ soporte: 'simulacro', numero: 22, hojas: [{ id: 'h', oraciones: ora('h', [
        'Mucha gente cree que en la puna no hay nada.', 'Sin embargo, la puna está llena de vida.', 'Sus pastos aguantan el frío y la falta de lluvia.',
        'Por ejemplo, el ichu crece donde casi ninguna otra planta resiste.', 'En sus lagunas viven aves como la parihuana.', 'Y en sus pastos comen miles de alpacas y vicuñas.']) }],
        pregunta: 'En el texto, la oración 4 cumple la función de', alternativas: [
          { id: 'A', t: 'dar la idea principal.' }, { id: 'B', t: 'dar una razón de lo que la gente cree sobre la puna.' }, { id: 'C', t: 'dar un ejemplo que sostiene la idea principal.' },
          { id: 'D', t: 'corregir lo que dice la oración 1.' }, { id: 'E', t: 'agregar un dato que no tiene relación.' }] }),
      solucion: [
        { texto: ['La 1 es lo que se cree y ', justo('la 2, la principal'), ': lo corrige. ', mala('D'), ' es el papel de la 2, y ', mala('A'), ' también.'] },
        { texto: ['La 4 dice «por ejemplo» y muestra una planta que resiste: sostiene la 3, y con ella a la 2. ', mala('B'), ' y ', mala('E'), ' no van.'] },
        { texto: [buena('C'), ': es un ejemplo que, con ', cubre('la 3, la 5 y la 6'), ', muestra que la puna está llena de vida.'] }],
      respuesta: [buena('C'), ': da un ejemplo que sostiene la idea principal'] },
    { nivel: 3, titulo: 'Leer en la lengua de casa',
      enunciado: 'Pregunta 23 del simulacro: «¿Qué oración expresa la idea principal del texto?». ¿Qué alternativa es la correcta?',
      datos: [D_IDEA, D_SEC, 'Lengua materna: la primera lengua que se aprende en casa.'],
      fuente: 'Más de 40 lenguas indígenas en el Perú: Ministerio de Cultura, Base de Datos de Pueblos Indígenas.',
      figura: fig({ soporte: 'simulacro', numero: 23, hojas: [{ id: 'h', oraciones: ora('h', [
        'En el Perú se hablan más de cuarenta lenguas indígenas.', 'En Puno, muchas familias hablan quechua o aimara en casa.',
        'Cuando un niño aprende a leer en su lengua materna, entiende mejor lo que lee.', 'Después, le cuesta menos aprender a leer en castellano.',
        'Por eso, enseñar a leer primero en la lengua de la casa ayuda a los niños de Puno.']) }],
        pregunta: '¿Qué oración expresa la idea principal del texto?', alternativas: [
          { id: 'A', t: 'La 1' }, { id: 'B', t: 'La 2' }, { id: 'C', t: 'La 3' }, { id: 'D', t: 'La 4' }, { id: 'E', t: 'La 5' }] }),
      solucion: [
        { texto: [mala('A'), ' y ', mala('B'), ' presentan el marco: cuántas lenguas hay y cuáles se hablan en Puno.'] },
        { texto: [mala('C'), ' y ', mala('D'), ' dan el porqué: se entiende mejor y después cuesta menos el castellano.'] },
        { texto: ['La 5 junta todo y le responden ', cubre('las cuatro anteriores'), ': ', buena('E'), '. La principal va al final.'] }],
      respuesta: [buena('E'), ': la 5, enseñar a leer primero en la lengua de casa'] },
    { nivel: 3, titulo: 'Los techos con caída',
      enunciado: 'Pregunta 24 del simulacro: «¿Qué afirmación sobre las oraciones del texto es correcta?». ¿Qué alternativa es la correcta?',
      datos: [D_IDEA, D_SEC, 'Pendiente: inclinación de una superficie.'],
      figura: fig({ soporte: 'simulacro', numero: 24, hojas: [{ id: 'h', oraciones: ora('h', [
        'En las zonas altas de Puno, muchas casas tienen techos con mucha pendiente.', 'La razón está en el granizo y la nieve.',
        'Un techo plano los acumula, y el peso puede romperlo.', 'En un techo empinado, resbalan y caen al suelo.', 'Por eso, en las zonas altas conviene hacer los techos con mucha caída.']) }],
        pregunta: '¿Qué afirmación sobre las oraciones del texto es correcta?', alternativas: [
          { id: 'A', t: 'La 1 es la principal porque abre el texto.' }, { id: 'B', t: 'La 3 y la 4 explican por qué la 5 es cierta.' },
          { id: 'C', t: 'La 4 es un ejemplo de la 3.' }, { id: 'D', t: 'La 2 no sostiene la idea principal.' }, { id: 'E', t: 'Todas las oraciones pesan lo mismo, porque todas son ciertas.' }] }),
      solucion: [
        { texto: ['La 5 dice lo que conviene hacer: es la principal. La 1 presenta el hecho y ', cubre('la 2, la 3 y la 4'), ' dan el porqué.'] },
        { texto: [mala('A'), ': abrir el texto no lo hace principal. ', mala('C'), ': la 4 no es un caso de la 3, sino lo contrario. ', mala('D'), ': la 2 anuncia la razón.'] },
        { texto: [mala('E'), ': la 5 manda y las demás le responden. ', buena('B'), ': techo plano y techo empinado dicen por qué conviene la caída.'] }],
      respuesta: [buena('B'), ': la 3 y la 4 explican por qué la 5 es cierta'] },
    { nivel: 3, titulo: 'El casco que salva',
      enunciado: 'Pregunta 25 del simulacro: «Rosa subrayó la 1, la 2 y la 6. ¿Qué debió hacer?». ¿Qué alternativa es la correcta?',
      datos: [D_IDEA, D_SEC, 'Subrayar: marcar solo la oración principal.', 'Tachar: marcar lo que no sostiene la principal.'],
      figura: fig({ soporte: 'simulacro', numero: 25, hojas: [{ id: 'h', oraciones: ora('h', [
        'En Juliaca, miles de personas manejan moto cada día.', 'Muchos conductores no usan casco.', 'En un choque, la cabeza es la parte del cuerpo que más riesgo corre.',
        'Usar casco al manejar una moto puede salvar la vida en un accidente.', 'El casco reparte la fuerza del golpe y protege la cabeza.', 'Muchas motos de Juliaca son rojas o azules.']) }],
        pregunta: 'Rosa subrayó la 1, la 2 y la 6. ¿Qué debió hacer?', alternativas: [
          { id: 'A', t: 'Subrayar la 1, la 2 y la 3.' }, { id: 'B', t: 'Subrayar la 4 y tachar la 6.' }, { id: 'C', t: 'Subrayar todas, porque todas son ciertas.' },
          { id: 'D', t: 'Subrayar la 6 y tachar la 4.' }, { id: 'E', t: 'Subrayar la 5 y tachar la 1.' }] }),
      solucion: [
        { texto: ['La 4 dice lo que el texto quiere mostrar; ', cubre('la 1, la 2, la 3 y la 5'), ' le dan el porqué. La 6 no habla de cascos.'] },
        { texto: [mala('A'), ' y ', mala('C'), ' subrayan de más. ', mala('D'), ' tacha la principal. ', mala('E'), ' subraya un porqué y tacha otro.'] },
        { texto: [buena('B'), ': se subraya la principal y se tacha la que no la sostiene.'] }],
      respuesta: [buena('B'), ': subrayar la 4 y tachar la 6'] },
  ];

  const jerarquia = {
    id: 'jerarquia',
    titulo: 'Principal y secundarias',
    pregunta: '¿Cómo se sabe qué oración manda en un texto?',
    temas: ['Jerarquía textual', 'Idea principal e ideas secundarias', 'Subrayado'],
    pieza: 'rv-soporte',
    lee: {
      tarjetas: [
        { titulo: 'Uno manda, otros ayudan', texto: 'En un equipo hay alguien que manda y otros que lo ayudan. Un texto también tiene esa jerarquía: una oración dice la idea principal y las otras le dan un porqué, un cómo o un ejemplo.' },
        { titulo: 'Subrayar todo es no subrayar', texto: 'Si subrayas todo el texto, al repasar no sabes qué importa. Se subraya poco: la oración que manda. Lo que no la ayuda se puede tachar con lápiz.' },
        { titulo: 'Qué mirar al jugar', texto: 'Rosa copió este texto del libro para estudiar. Lleva el resaltador a la oración que creas que manda y el lápiz a la que sobra; lee qué dice cada prueba.' },
      ],
    },
    actividad: 'Subrayar una oración y tachar otra en una hoja de estudio.',
    aprendizaje: 'Las secundarias le dan a la principal un porqué, un cómo o un ejemplo; la principal puede ir en cualquier lugar, no siempre primero.',
    ejemplos: EJEMPLOS_JER,
    juega: {
      consigna: 'Rosa copió este texto del libro para el examen. Con el resaltador y el lápiz, deja a la vista solo lo que importa.',
      mision: {
        texto: 'Subraya la oración principal y tacha la que no la sostiene.',
        logrado: val => val.s === PAPEL_C.principal && val.t === PAPEL_C.sobra,
        bien: 'La 2 y la 3 dicen cómo; la 4 es un ejemplo; la 5 sobraba.',
      },
      voz: 'Pregúntale a cada oración: ¿a quién le responde?',
      leyenda: [
        { s: '1, 2, 3, 4, 5', t: 'número de cada oración del texto' },
        { s: justo('violeta'), t: 'la oración principal' },
        { s: prop('naranja'), t: 'la que pruebas como principal' },
        { s: cubre('turquesa'), t: 'oración que sostiene a la principal' },
        { s: 'tachado', t: 'oración que no la sostiene' },
      ],
      controles: [
        { id: 's', etiqueta: 'Resaltador: subraya', opciones: [{ valor: 0, texto: 'nada' }, ...[1, 2, 3, 4, 5].map(k => ({ valor: k, texto: `${k}` }))] },
        { id: 't', etiqueta: 'Lápiz: tacha', opciones: [{ valor: 0, texto: 'nada' }, ...[1, 2, 3, 4, 5].map(k => ({ valor: k, texto: `${k}` }))] },
      ],
      dibujo: val => ({ datos: CASAS, estado: estCasas(val.s, val.t) }),
      lectura: val => lecturaCasas(val.s, val.t),
      // Gesto directo (docs/teoria.md §4b): el resaltador se suelta sobre el número de una oración y el lápiz al final
      // del renglón; soltarlos en la bandeja los quita.
      arrastres: [
        { id: 'resaltador', etiqueta: 'resaltador: subraya una oración', color: 'c-o',
          donde: val => (val.s ? SOP().ancla(CASAS, `c${val.s}`) : BANDEJA().resaltador),
          mover: pt => ({ s: SOP().enBandeja(CASAS, pt) ? 0 : +SOP().cercana(CASAS, pt, oracionesDe(CASAS)).slice(1) }) },
        { id: 'lapiz', etiqueta: 'lápiz: tacha una oración',
          donde: val => (val.t ? SOP().ancla(CASAS, `c${val.t}`, 'fin') : BANDEJA().lapiz),
          mover: pt => ({ t: SOP().enBandeja(CASAS, pt) ? 0 : +SOP().cercana(CASAS, pt, oracionesDe(CASAS)).slice(1) }) },
      ],
      minimo: 3,
    },
    predice: {
      pregunta: 'Este texto empieza con lo que mucha gente cree. ¿Qué oración subrayarías como la principal?',
      datos: [D_IDEA, 'Cuy: animal pequeño que se cría en casa, en los Andes.'],
      opciones: [
        { id: 'c', texto: 'La 2', correcta: true },
        { id: 'primera', texto: 'La 1', error: 'RV4', siFuera: 'Es la que abre el texto, pero el texto la corrige: no es lo que defiende.' },
        { id: 'detalle', texto: 'La 3', error: 'RV1', siFuera: 'Dice algo importante, pero responde «¿cómo?» a otra oración.' },
        { id: 'todas', texto: 'Las cuatro: todas importan', error: 'RV43', siFuera: 'Todas dicen algo cierto, pero subrayarlo todo no deja ver cuál manda.' },
      ],
      dibujo: { datos: CUY, estado: {} },
      revelar: { datos: CUY, estado: { marcas: { k2: 'f', k3: 'i', k4: 'i' } } },
      coincide: 'Coincide: la 1 es lo que el texto corrige; la 3 y la 4 le responden a la 2.',
    },
    mira: {
      pieza: 'rv-arbol',
      datos: ARBOL_CUY,
      pasos: [
        { estado: solo({ k1: 'o' }), texto: 'La 1 cuenta lo que «mucha gente piensa»; la 2 dice otra cosa.' },
        { estado: solo({ k1: 'o', k2: 'f' }, { ver: ['raiz'], nuevo: ['raiz'] }), texto: 'La 2 afirma lo que el texto defiende: va arriba del árbol.', ecuacion: [justo('principal'), ': la oración 2'] },
        { estado: solo({ k1: 'o', k2: 'f', k3: 'i' }, { ver: ['raiz', 'r3'], nuevo: ['r3'] }), texto: 'La 3 responde «¿cómo ahorran?»: cuelga de la 2.', ecuacion: [cubre('¿cómo?'), ' → ', justo('principal')] },
        { estado: solo({ k1: 'o', k2: 'f', k3: 'i', k4: 'i' }, { ver: ['raiz', 'r3', 'r4'], nuevo: ['r4'] }), texto: 'La 4 responde «¿por qué conviene?»: también cuelga de la 2.', ecuacion: [cubre('¿por qué?'), ' → ', justo('principal')] },
        { estado: solo({ k1: 'i', k2: 'f', k3: 'i', k4: 'i' }, { ver: ['raiz', 'r1', 'r3', 'r4'], nuevo: ['r1'] }), texto: 'La 1 también cuelga: es lo que la 2 corrige, no lo que manda.' },
        { estado: solo({ k1: 'i', k2: 'f', k3: 'i', k4: 'i' }, { ver: ['raiz', 'r1', 'r3', 'r4'] }), texto: 'Prueba: quita la 2 y las demás quedan sueltas, sin a quién responder.' },
      ],
    },
    regla: {
      texto: 'La oración principal dice la idea, en cualquier lugar del texto; las secundarias le responden un porqué, un cómo o un ejemplo. Se subraya solo la principal.',
      ecuacion: [{ llave: [justo('principal')], nota: 'manda', color: 'c-f' }, ' ← ', { llave: [cubre('secundarias')], nota: '¿por qué? ¿cómo? ¿por ejemplo?', color: 'c-i' }],
      condicion: 'sin una secundaria, la principal sigue en pie; sin la principal, las demás quedan sueltas; lo que no le responde, sobra.',
    },
    resuelve: {
      pieza: 'rv-soporte',
      generar(s) {
        const R = RESUELVE_JER[s % RESUELVE_JER.length];
        const n = oracionesDe(R.sop).length;
        return {
          enunciado: R.enunciado,
          datos: R.datos,
          dibujo: { datos: R.sop, estado: {} },
          pasos: [
            { tipo: 'pide', texto: R.est.sobra && /no sostiene/.test(R.enunciado) ? 'Piden la oración que no le responde nada a la principal.' : /papel/.test(R.enunciado) ? `Piden qué hace la oración 3 con la principal de ${R.nombre}.` : `Piden cuál oración manda en ${R.nombre} y qué hacen las demás con ella.` },
            { tipo: 'datos', texto: `${R.nombre.charAt(0).toUpperCase() + R.nombre.slice(1)} tiene ${n} oraciones numeradas.` },
            { tipo: 'regla', texto: 'La principal dice la idea; las secundarias le dan un porqué, un cómo o un ejemplo. Lo que no le responde nada, sobra.' },
            { tipo: 'aplica', texto: R.a1 },
            { tipo: 'aplica', texto: R.a2, dibujo: { datos: R.sop, estado: estJer(R.sop, R.est) } },
            { tipo: 'sentido', texto: R.sentido },
          ],
          respuesta: [justo(R.respuesta)],
        };
      },
    },
    ahoraTu: {
      pieza: 'rv-soporte',
      generar(s) {
        const A = AHORA_JER[s % AHORA_JER.length];
        return {
          pregunta: A.pregunta,
          datos: A.datos || [D_IDEA, D_SEC],
          dibujo: { datos: A.sop, estado: estJer(A.sop, null, A.marca) },
          opciones: opciones(A.ok, voltear(A.m, s)),
          solucion: { texto: 'Se pregunta a cada oración a quién le responde: la principal no le responde a nadie.', ecuacion: [justo(A.ok)],
            dibujo: { datos: A.sop, estado: estJer(A.sop, A.est) } },
        };
      },
    },
  };

  // ---------- Idea 4: elegir en el examen (nueva; etapa 2, 17 nov; docs/etapa2/propuesta-verbal.md y decisiones.md) ----------
  // Cambia: qué alternativas están tachadas. Permanece: la hoja de simulacro de las alpacas (texto y gráfico). Progresa:
  // por qué falla cada tachada, hasta que queda una. Se reserva: el título del mismo texto (predicción). Debe verse: que
  // cada alternativa equivocada falla por algo distinto (amplia, estrecha, marco, agrega) y la buena tiene la medida del
  // texto y del gráfico. El título entra aquí (Gerson, 17 nov): es el tema con otro nombre.
  // Objeto de la primera pantalla: la hoja de simulacro con texto y gráfico (rv-soporte), como en San Marcos.
  // Colores: lo que la buena cubre i (turquesa), la alternativa que queda f (violeta), las descartadas tachadas; las
  // letras que nombra un resuelto, en negrita (mala/buena).
  const D_FRASE = 'Tema central y título: una frase que dice de qué trata todo el texto.';
  const D_ORACION = 'Idea principal y tesis: una oración que afirma algo de todo el texto.';
  const D_MEDIDA = 'Muy amplia: le serviría a otro texto. Muy estrecha: deja fuera una parte.';
  const D_AGREGA = 'Agrega: dice algo que ni el texto ni su gráfico dicen.';
  const D_TESIS = 'Tesis: lo que defiende el autor de un texto que opina.';
  const ORAS_ALPACA = ora('a', [
    'En las zonas altas de Puno, las heladas llegan cada año entre mayo y agosto.',
    'Muchas familias crían alpacas, y las crías son las primeras en enfermarse con el frío.',
    'Por eso, algunas comunidades construyen cobertizos: techos bajos donde las crías pasan la noche.',
    'El gráfico compara una comunidad antes y después de tener cobertizos.']);
  const BARRAS_ALPACA = barras('Crías muertas por el frío en un año', [['Antes', 40], ['Después', 12]]);
  // Cada alternativa del juego, con su falla (la que dice la lectura cuando se tacha) y si es la correcta.
  const ALTS = [
    { id: 'A', t: 'Las heladas en las zonas altas de Puno', falla: 'es el marco' },
    { id: 'B', t: 'La crianza de camélidos en los Andes del Perú', falla: 'muy amplia' },
    { id: 'C', t: 'El uso de cobertizos para proteger del frío a las crías de alpaca', ok: true },
    { id: 'D', t: 'Las 40 crías que murieron en un año sin cobertizo', falla: 'un dato' },
    { id: 'E', t: 'Los cobertizos como la única defensa de las familias contra todas las heladas', falla: 'agrega «única»' },
  ];
  const BUENA = ALTS.find(x => x.ok);
  const SIMULACRO = { soporte: 'simulacro', numero: 7, hojas: [{ id: 'h', oraciones: ORAS_ALPACA, barras: BARRAS_ALPACA }],
    pregunta: '¿Cuál es el tema central del texto?', alternativas: ALTS.map(({ id, t }) => ({ id, t })) };
  const TEXTO_ALPACA = { soporte: 'simulacro', numero: 7, hojas: [{ id: 'h', oraciones: ORAS_ALPACA, barras: BARRAS_ALPACA }] };
  const tachadas = val => ALTS.filter(x => val[x.id.toLowerCase()] === 1);
  const estSimulacro = val => {
    const t = tachadas(val), quedan = ALTS.filter(x => !t.includes(x));
    const e = { tachar: t.map(x => x.id), marcas: {} };
    if (quedan.length === 1 && quedan[0].ok) Object.assign(e.marcas, todo(TEXTO_ALPACA).marcas, { [BUENA.id]: 'f' });
    return e;
  };
  const lecturaSimulacro = val => {
    const t = tachadas(val), quedan = ALTS.filter(x => !t.includes(x));
    if (t.includes(BUENA)) return [mala(BUENA.id), ' cubría el texto y el gráfico: no se tacha'];
    if (!t.length) return ['Tacha la que falle; cada una falla por algo distinto'];
    if (quedan.length === 1) return [buena(BUENA.id), ': cubre el texto y el gráfico, sin agregar'];
    const out = [];
    t.forEach((x, k) => out.push(k ? ', ' : '', mala(x.id), `: ${x.falla}`));
    return out;
  };

  // «Así se resuelve»: título, idea principal, tesis y tema central de un texto con tabla, cada uno con cinco
  // alternativas en la hoja. buena: la letra correcta; las demás se tachan en la figura del paso.
  const sim = (numero, oraciones, pregunta, alternativas, extra = {}) => ({ soporte: 'simulacro', numero, hojas: [Object.assign({ id: 'h', oraciones: ora('h', oraciones) }, extra)],
    pregunta, alternativas: alternativas.map((t, k) => ({ id: 'ABCDE'[k], t })) });
  const RESUELVE_ALT = [
    { pide: 'Piden un título: una frase corta con la medida de todo el texto.', buena: 'C',
      sop: sim(4, ['En Puno, muchas familias guardan sus semillas de papa de un año para otro.', 'Escogen las papas más sanas y las dejan en un cuarto oscuro y fresco.',
        'Así, al llegar la siembra, no tienen que comprar semillas.', 'Además, conservan variedades que no se venden en el mercado.'],
        '¿Qué título le queda mejor al texto?', ['La papa en el Perú', 'Un cuarto oscuro y fresco', 'Guardar la semilla en casa', 'Las familias de Puno ahorran siempre en todo', 'Las variedades del mercado']),
      enunciado: 'Pregunta 4 del simulacro: «¿Qué título le queda mejor al texto?». Las alternativas están en la hoja.',
      datos: [D_FRASE, D_MEDIDA, D_AGREGA],
      descartes: [mala('A'), ': ', prop('muy amplio'), '. ', mala('B'), ' y ', mala('E'), ': ', prop('muy estrechos'), '. ', mala('D'), ' agrega «siempre» y «en todo».'],
      cubre: [buena('C'), ' cubre ', cubre('las cuatro'), ': cómo se guarda la semilla y para qué sirve.'],
      sentido: 'Un título no tiene que ser una oración: basta una frase con la medida justa.' },
    { pide: 'Piden la idea principal: una oración que afirme algo de todo el texto, no solo el tema.', buena: 'B',
      resp: 'gracias a las abuelas, los jóvenes tejen y los diseños se conservan',
      sop: sim(10, ['En la comunidad de Jayllihuaya, los jóvenes casi no sabían tejer.', 'Las abuelas empezaron a enseñarles los sábados, en el local comunal.',
        'En un año, aprendieron a tejer chalinas y chullos con los diseños de la comunidad.', 'Ahora venden sus tejidos en la feria, y los diseños no se pierden.'],
        '¿Cuál es la idea principal del texto?', ['Los tejidos de la comunidad de Jayllihuaya.', 'Gracias a las abuelas, los jóvenes aprendieron a tejer y los diseños se conservan.',
          'Los jóvenes de Jayllihuaya casi no sabían tejer.', 'Los chullos se venden en la feria.', 'Todas las comunidades del altiplano de Puno están perdiendo sus tejidos antiguos.']),
      enunciado: 'Pregunta 10 del simulacro: «¿Cuál es la idea principal del texto?». Las alternativas están en la hoja.',
      datos: [D_ORACION, D_MEDIDA, D_AGREGA, 'Chullo: gorro tejido con orejeras.'],
      descartes: [mala('A'), ' solo nombra el tema. ', mala('C'), ' es la 1 y ', mala('D'), ', parte de la 4: ', prop('muy estrechas'), '. ', mala('E'), ' agrega «todas las comunidades».'],
      cubre: [buena('B'), ' afirma algo y cubre ', cubre('las cuatro'), ': el antes, la enseñanza, lo aprendido y el resultado.'],
      sentido: 'Ninguna oración del texto la dice sola: la buena la arma con las cuatro.' },
    { pide: 'Piden la tesis: la oración que el autor defiende en todo el texto.', buena: 'D',
      sop: sim(12, ['Algunos piensan que el colegio debería prohibir los celulares en todo momento.', 'Pero un celular también sirve para buscar una palabra o grabar un experimento.',
        'Lo que hace falta son reglas claras: guardarlo en clase y usarlo cuando el profesor lo pida.', 'Prohibirlo del todo sería perder una herramienta útil.'],
        '¿Cuál es la tesis del autor?', ['El celular debe prohibirse en el colegio en todo momento.', 'El celular sirve para grabar experimentos.', 'El celular en el colegio.',
          'El colegio necesita reglas claras para el celular, no prohibirlo.', 'Los profesores deben usar el celular en todas sus clases del colegio.']),
      enunciado: 'Pregunta 12 del simulacro: «¿Cuál es la tesis del autor?». Las alternativas están en la hoja.',
      datos: [D_ORACION, D_TESIS, D_MEDIDA, D_AGREGA],
      descartes: [mala('A'), ' es lo que el autor discute, en la 1. ', mala('B'), ' es un dato de la 2. ', mala('C'), ' solo nombra. ', mala('E'), ' agrega «todas sus clases».'],
      cubre: [buena('D'), ' es lo que defienden ', cubre('la 3 y la 4'), ', y ', cubre('la 2'), ' da la razón.'],
      sentido: 'La tesis no es la primera oración: ahí el autor cuenta lo que piensan otros.' },
    { pide: '«Giran en torno a» pide el tema central: una frase que cubra el texto y también la tabla.', buena: 'C',
      sop: sim(15, ['En un colegio de Puno, los alumnos sembraron un biohuerto en el patio.', 'Con lo que cosechan, el comedor prepara ensaladas dos veces por semana.',
        'La tabla muestra cuántas porciones de verdura comieron los alumnos en un mes, antes y después del biohuerto.'],
        'El texto y la tabla giran, principalmente, en torno a', ['la alimentación de los escolares en el Perú.', 'las 160 porciones de verdura que comieron después.',
          'el biohuerto del colegio y cuántas más verduras comen los alumnos.', 'el patio de un colegio de Puno.', 'el biohuerto como la única forma de que todos los alumnos coman sano.'],
        { tabla: tabla('Porciones de verdura en un mes', ['Momento', 'Porciones'], [['Antes', '40'], ['Después', '160']]) }),
      enunciado: 'Pregunta 15 del simulacro: «El texto y la tabla giran, principalmente, en torno a». Las alternativas están en la hoja.',
      datos: [D_FRASE, D_MIXTO, D_MEDIDA, D_AGREGA],
      descartes: [mala('A'), ': ', prop('muy amplia'), '. ', mala('B'), ' es una celda y ', mala('D'), ', el lugar de la 1: ', prop('muy estrechas'), '. ', mala('E'), ' agrega «única» y «todos».'],
      cubre: [buena('C'), ' cubre ', cubre('las tres oraciones'), ' y ', cubre('las dos filas'), ': el biohuerto y lo que cambió.'],
      sentido: 'Si se tapa la tabla, la frase sigue cubriendo el texto; si se tapa el texto, explica la tabla.' },
  ];
  const estResuelto = (sop, letra) => Object.assign(todo(sop), { marcas: Object.assign(todo(sop).marcas, { [letra]: 'f' }), tachar: sop.alternativas.map(a => a.id).filter(x => x !== letra) });

  // «Ahora tú»: título, idea principal frente a tema, tema central con gráfico, idea principal, tesis y tema de dos
  // textos (A y B). Códigos: RV2 (muy amplia), RV1 (dato o detalle), RV3 (una parte), RV4 (la primera oración), RV64
  // (el marco del comienzo), RV65 (nombra el tema cuando se pide la idea), RV11 (absoluto), RV66 (agrega un asunto).
  const AHORA_ALT = [
    { sop: sim(1, ['Desde este año, el colegio abre su biblioteca en las vacaciones de julio.', 'Los alumnos pueden ir de lunes a viernes, de 9:00 a 12:00.', 'Habrá también lecturas en voz alta para los más chicos.'], null, []),
      pregunta: '¿Qué título le queda mejor al texto?', datos: [D_FRASE, D_MEDIDA, D_AGREGA],
      ok: 'Biblioteca abierta en vacaciones',
      m: [['Las bibliotecas del Perú', 'RV2', 'Es del mismo asunto, pero le serviría a cualquier texto de bibliotecas.'],
        ['Lecturas en voz alta para los más chicos', 'RV1', 'Está en la 3, pero es una parte: deja fuera la apertura en julio.'],
        ['La biblioteca que nunca cierra', 'RV11', 'Habla de la biblioteca, pero «nunca» dice más que el texto: solo julio.']] },
    { sop: sim(2, ['La quinua aguanta la helada y la sequía mejor que muchos cultivos.', 'Por eso, en los años malos, sigue dando grano.', 'Para muchas familias del altiplano, es una cosecha segura.'], null, []),
      pregunta: 'La pregunta es «¿Cuál es la idea principal?». ¿Qué alternativa responde a eso, y no solo al tema?', datos: [D_FRASE, D_ORACION],
      ok: 'La quinua es una cosecha segura: aguanta helada y sequía',
      m: [['La quinua del altiplano y el clima', 'RV65', 'Nombra bien el asunto, pero no afirma nada: eso es un tema.'],
        ['En los años malos de helada y sequía, la quinua sigue dando grano', 'RV3', 'Afirma algo, pero solo lo de la 2: deja fuera la cosecha segura.']] },
    { sop: sim(8, ['En una comunidad de Acora, el agua del pozo traía tierra y causaba diarreas.', 'La comunidad instaló en el pozo un filtro de arena y piedras.',
      'El gráfico muestra cuántos niños se enfermaron del estómago en un año, antes y después del filtro.'], null, [],
      { barras: barras('Niños con diarrea en un año', [['Antes', 30], ['Después', 8]]) }),
      pregunta: 'El texto y el gráfico giran, principalmente, en torno a', mixto: true, datos: [D_FRASE, D_MIXTO, D_MEDIDA, D_AGREGA],
      ok: 'el filtro del pozo de Acora y cuántos niños menos se enferman',
      m: [['la salud de los niños de las comunidades del Perú', 'RV2', 'Es del mismo asunto, pero le serviría a cualquier texto de salud.'],
        ['los 30 niños que se enfermaron del estómago antes del filtro', 'RV1', 'Leíste bien el gráfico, pero es una barra: deja fuera el filtro.'],
        ['el agua con tierra que traía el pozo de la comunidad', 'RV64', 'Es el problema de la 1, el marco; deja fuera el filtro y el gráfico.'],
        ['el filtro como la única forma de tener agua limpia en el campo', 'RV66', 'Habla del filtro, pero el texto no dice «única»: agrega algo.']] },
    { sop: sim(11, ['Una bolsa de plástico se usa unos minutos.', 'Pero en el lago puede quedar flotando muchos años.', 'Los peces y las aves la confunden con comida.',
      'Por eso, llevar una bolsa de tela al mercado ayuda a cuidar el Titicaca.'], null, []),
      pregunta: '¿Cuál es la idea principal del texto?', datos: [D_ORACION, D_MEDIDA, D_AGREGA],
      ok: 'Llevar bolsa de tela al mercado ayuda a cuidar el lago Titicaca',
      m: [['Una bolsa de plástico se usa solo unos minutos antes de botarla', 'RV4', 'Es la 1, cómo empieza; deja fuera el daño y lo que conviene hacer.'],
        ['Las bolsas de plástico y el lago Titicaca', 'RV65', 'Nombra el asunto, pero no afirma nada de él.'],
        ['Los peces y las aves del lago confunden las bolsas con comida', 'RV1', 'Está en la 3, pero es una razón: deja fuera la bolsa de tela.'],
        ['Las bolsas de plástico son la única basura que daña el lago', 'RV11', 'Habla de las bolsas, pero «única» dice más que el texto.']] },
    { sop: sim(13, ['Hay quien dice que hablar quechua o aimara no sirve en la ciudad.', 'Sin embargo, en Puno muchos médicos, jueces y profesores atienden a personas que hablan esas lenguas.',
      'Quien las habla se entiende mejor con ellas y las atiende mejor.', 'Saber quechua o aimara es una ventaja para trabajar en Puno.'], null, []),
      pregunta: '¿Cuál es la tesis del autor?', datos: [D_ORACION, D_TESIS, D_MEDIDA, D_AGREGA],
      ok: 'Saber quechua o aimara es una ventaja para trabajar en Puno',
      m: [['Hablar quechua o aimara no sirve de nada en la ciudad', 'RV4', 'Es lo que dicen otros, en la 1; el autor lo discute.'],
        ['Las lenguas que se hablan en las ciudades y el campo de Puno', 'RV65', 'Nombra el asunto, pero una tesis afirma algo.'],
        ['Los médicos de Puno atienden a personas que hablan aimara', 'RV1', 'Es un dato de la 2 que sostiene la tesis.'],
        ['Todos en Puno deberían hablar solo quechua o aimara', 'RV66', 'Habla de esas lenguas, pero el autor no pide «solo»: agrega.']] },
    { sop: { soporte: 'simulacro', numero: 21, hojas: [
      { id: 'ha', titulo: 'Texto A', oraciones: ora('a', ['Las tareas para la casa deberían eliminarse.', 'Los alumnos ya pasan seis horas en el colegio.', 'En casa necesitan descansar y ayudar a su familia.']) },
      { id: 'hb', titulo: 'Texto B', oraciones: ora('b', ['Las tareas para la casa son necesarias.', 'Repasar en casa ayuda a no olvidar lo aprendido.', 'Basta con que sean cortas.']) }] },
      pregunta: '¿Cuál es el tema que discuten los dos textos?', datos: [D_FRASE, D_MEDIDA, D_AGREGA, 'Textos A y B: dos autores que opinan sobre un mismo asunto.'],
      ok: 'Si las tareas para la casa deben eliminarse',
      m: [['La educación de los jóvenes en el Perú', 'RV2', 'Es del mismo asunto, pero le serviría a cualquier texto del colegio.'],
        ['El descanso que necesitan los alumnos en su casa', 'RV3', 'Es lo que dice el texto A; deja fuera el texto B.'],
        ['Las ventajas de repasar en casa lo que se aprendió', 'RV1', 'Es una razón del texto B, un detalle: deja fuera el texto A.'],
        ['Las tareas como la causa del cansancio de todos los alumnos', 'RV66', 'Habla de las tareas, pero ningún texto dice «causa» ni «todos».']] },
  ];
  // La hoja de «Ahora tú» va sin pregunta ni alternativas (las alternativas son los botones de la app).
  const sinPie = sop => Object.fromEntries(Object.entries(sop).filter(([k]) => k !== 'pregunta' && k !== 'alternativas'));

  // Ejemplos resueltos de la idea 4. Nivel 1: qué pide la pregunta (frase u oración), una frase muy estrecha o una que
  // agrega; un paso. Nivel 2: el título de un aviso, de un folleto o de un texto con gráfico; dos pasos. Nivel 3: hoja de
  // simulacro con cinco alternativas y gráfico o tabla, o dos textos (tema central, idea principal, tesis y título).
  // Revisado aparte (scratchpad verbal-revisa.js): cada oración citada existe, los conteos coinciden y el resuelto nombra
  // las cinco letras.
  const EJEMPLOS_ALT = [
    { nivel: 1, titulo: 'Qué pide el tema central',
      enunciado: 'La pregunta es «¿Cuál es el tema central del aviso?». ¿Pide una frase que nombra o una oración que afirma?',
      datos: [D_FRASE, D_ORACION],
      figura: fig({ soporte: 'puerta', lugar: 'Puerta de la dirección del colegio', hojas: [{ id: 'h', titulo: 'Aviso', de: 'la Dirección', para: 'estudiantes y familias', oraciones: ora('h', [
        'El lunes no habrá clases por la limpieza del tanque de agua.', 'Las clases se recuperarán el sábado.']) }] }),
      solucion: [
        { texto: ['«Tema central» pide una frase: ', justo('«la suspensión de clases del lunes por la limpieza del tanque»'), '. No hace falta afirmar nada.'] }],
      respuesta: [justo('Una frase'), ': la suspensión de clases por la limpieza del tanque'] },
    { nivel: 1, titulo: 'Qué pide la idea principal',
      enunciado: 'La pregunta es «¿Cuál es la idea principal?». ¿Cuál responde: «el horario de los camiones cisterna» o «los camiones cisterna ahora pasan de día»?',
      datos: [D_FRASE, D_ORACION, 'Camión cisterna: camión que reparte agua en un tanque.'],
      figura: fig({ soporte: 'folleto', lugar: 'Folleto de la junta de vecinos', hojas: [{ id: 'h', titulo: 'Junta de vecinos informa', de: 'la junta de vecinos', para: 'familias del barrio', oraciones: ora('h', [
        'Los camiones cisterna ya no subirán al barrio en la noche.', 'Desde ahora pasarán a las 7:00 y a las 15:00.', 'Así, las familias podrán llenar sus tanques de día.']) }] }),
      solucion: [
        { texto: ['«El horario de los camiones» ', prop('solo nombra'), ': sería el tema. «Ahora pasan de día» afirma algo y ', cubre('cubre las tres'), '.'] }],
      respuesta: [justo('Los camiones cisterna ahora pasan de día')] },
    { nivel: 1, titulo: 'Lo que pide «gira en torno»',
      enunciado: '«El texto gira en torno a…» ¿pide una frase o una oración? Elige: «la feria del libro del sábado» o «el sábado habrá una feria del libro».',
      datos: [D_FRASE, D_ORACION],
      figura: fig({ soporte: 'cartel', lugar: 'Cartel en la municipalidad', hojas: [{ id: 'h', titulo: 'Feria del libro', de: 'la municipalidad', para: 'vecinos y colegios', oraciones: ora('h', [
        'El sábado habrá una feria del libro en la plaza de Armas.', 'Se venderán libros usados desde un sol.', 'Los colegios pueden llevar a sus alumnos.']) }] }),
      solucion: [
        { texto: ['«Gira en torno a» pide el tema central: una frase. ', justo('«La feria del libro del sábado»'), ' nombra el asunto y ', cubre('cubre las tres'), '.'] }],
      respuesta: [justo('Una frase'), ': la feria del libro del sábado'] },
    { nivel: 1, titulo: 'La alternativa que agrega',
      enunciado: '¿Cuál de estas agrega algo que el aviso no dice: «la nueva ruta de la combi 12», «la ruta 12 como la mejor de la ciudad» o «el paradero final»?',
      datos: [D_FRASE, D_AGREGA],
      figura: fig({ soporte: 'puerta', lugar: 'Paradero de la combi 12', hojas: [{ id: 'h', titulo: 'Aviso', de: 'la empresa de transporte', para: 'pasajeros', oraciones: ora('h', [
        'Desde el lunes, la combi 12 llegará hasta el hospital.', 'Su nuevo paradero final estará en la puerta de emergencias.', 'El pasaje no cambia.']) }] }),
      solucion: [
        { texto: ['Ninguna oración compara la ruta 12 con otras: «la mejor de la ciudad» ', prop('agrega'), '. «El paradero final» solo es estrecha.'] }],
      respuesta: [justo('La ruta 12 como la mejor de la ciudad')] },
    { nivel: 1, titulo: 'Una celda de la tabla',
      enunciado: 'Para este texto con tabla, ¿la frase «los 25 kilos de basura del lunes» es muy amplia, justa o muy estrecha?',
      datos: [D_FRASE, D_MEDIDA, D_MIXTO],
      figura: fig({ soporte: 'cartel', lugar: 'Cartel del municipio escolar', hojas: [{ id: 'h', titulo: 'Menos basura', de: 'el municipio escolar', para: 'estudiantes', oraciones: ora('h', [
        'El colegio pesó la basura que juntó el lunes y el viernes.', 'El jueves hubo una campaña para reciclar botellas y papel.', 'El viernes hubo mucha menos basura.']),
        tabla: tabla('Basura del colegio', ['Día', 'Kilos'], [['Lunes', '25'], ['Viernes', '10']]) }] }),
      solucion: [
        { texto: ['La frase cubre una sola celda de la tabla y deja fuera ', cubre('la campaña y el viernes'), ': es ', prop('muy estrecha'), '.'] }],
      respuesta: [justo('Muy estrecha'), ': es una celda de la tabla'] },

    { nivel: 2, titulo: 'El título del folleto',
      enunciado: '¿Qué título le queda mejor al folleto: «Perros», «Vacuna gratis contra la rabia en Ilave», «El domingo» o «Ilave, ciudad sin perros»?',
      datos: [D_FRASE, D_MEDIDA, D_AGREGA, 'Rabia: enfermedad grave que contagia la mordida de un animal.'],
      figura: fig({ soporte: 'folleto', lugar: 'Folleto de la posta de Ilave', hojas: [{ id: 'h', titulo: 'Posta informa', de: 'la posta de salud', para: 'vecinos', oraciones: ora('h', [
        'Los perros sin dueño del mercado de Ilave serán vacunados contra la rabia.', 'La campaña será el domingo y es gratis.', 'Quien tenga perro también puede llevarlo.']) }] }),
      solucion: [
        { texto: ['Primero se descarta: «Perros», ', prop('muy amplio'), '; «El domingo», ', prop('muy estrecho'), '; «Ilave, ciudad sin perros» ', prop('agrega'), ' algo que el folleto no dice.'] },
        { texto: ['Después se comprueba: «Vacuna gratis contra la rabia en Ilave» cubre ', cubre('las tres'), ' y no le serviría a otro folleto.'] }],
      respuesta: [justo('Vacuna gratis contra la rabia en Ilave')] },
    { nivel: 2, titulo: 'El título demasiado grande',
      enunciado: 'Para este texto, ¿le queda el título «La lluvia»? Si no, ¿cuál le quedaría mejor?',
      datos: [D_FRASE, D_MEDIDA, 'Bofedal: pastizal húmedo de las alturas, con agua todo el año.'],
      figura: fig({ soporte: 'cuaderno', lugar: 'Cuaderno de Diego', hojas: [{ id: 'h', titulo: 'Ciencia y Tecnología', de: 'Diego', para: 'estudiar para la práctica', oraciones: ora('h', [
        'En enero, las lluvias del altiplano llenan los bofedales.', 'Allí comen las alpacas cuando el pasto de los cerros se seca.', 'Si los bofedales se secan, los criadores pierden su mejor pasto.']) }] }),
      solucion: [
        { texto: ['«La lluvia» le serviría a un texto sobre huaicos o sobre la cosecha: ', prop('muy amplio'), '. El texto trata de otra cosa.'] },
        { texto: ['Las tres oraciones hablan de los bofedales como pasto: ', justo('«Bofedales, el pasto de las alpacas»'), ' ', cubre('cubre las tres'), '.'] }],
      respuesta: [justo('No'), ': mejor «Bofedales, el pasto de las alpacas»'] },
    { nivel: 2, titulo: 'Dos títulos parecidos',
      enunciado: '¿Qué título le queda mejor: «La radio de los alumnos de 4.º» o «La radio que todo el colegio escucha siempre»?',
      datos: [D_FRASE, D_AGREGA],
      figura: fig({ soporte: 'mural', lugar: 'Mural del colegio', hojas: [{ id: 'h', titulo: 'Noticia del mes', de: 'el municipio escolar', para: 'estudiantes', oraciones: ora('h', [
        'Los alumnos de 4.º armaron una radio en el colegio.', 'Cada recreo pasan música, noticias del colegio y saludos.', 'Este mes, también avisaron de la campaña de vacunas.']) }] }),
      solucion: [
        { texto: ['Los dos hablan de la radio. Pero ninguna oración dice que «todo el colegio» la escuche, ni que sea «siempre»: el segundo ', prop('agrega'), '.'] },
        { texto: ['«La radio de los alumnos de 4.º» ', cubre('cubre las tres'), ' sin decir más que el texto.'] }],
      respuesta: [justo('La radio de los alumnos de 4.º')] },
    { nivel: 2, titulo: 'El título con gráfico',
      enunciado: '¿Qué título le queda al texto y su gráfico: «Árboles que dan sombra en la avenida», «Cuarenta grados al mediodía» o «Las avenidas de Juliaca»?',
      datos: [D_FRASE, D_MEDIDA, D_MIXTO],
      figura: fig({ soporte: 'folleto', lugar: 'Folleto de la junta de vecinos de Juliaca', hojas: [{ id: 'h', titulo: 'Junta de vecinos informa', de: 'la junta de vecinos', para: 'vecinos', oraciones: ora('h', [
        'En Juliaca, un grupo de vecinos plantó árboles en una avenida.', 'Ahora, al mediodía, la vereda tiene sombra.', 'El gráfico compara la temperatura del piso al sol y a la sombra.']),
        barras: barras('Grados del piso al mediodía', [['Al sol', 40], ['Sombra', 25]]) }] }),
      solucion: [
        { texto: ['«Cuarenta grados» es una barra: ', prop('muy estrecho'), '. «Las avenidas de Juliaca» le serviría a otro texto: ', prop('muy amplio'), '.'] },
        { texto: ['«Árboles que dan sombra en la avenida» cubre ', cubre('las tres oraciones'), ' y ', cubre('el gráfico'), ', que muestra lo que da la sombra.'] }],
      respuesta: [justo('Árboles que dan sombra en la avenida')] },
    { nivel: 2, titulo: 'Título o idea principal',
      enunciado: 'Para estos apuntes, ¿«Leer en voz alta ayuda a recordar» es un título o una idea principal? ¿Y «Leer en voz alta»?',
      datos: [D_FRASE, D_ORACION],
      figura: fig({ soporte: 'cuaderno', lugar: 'Cuaderno de Rosa', hojas: [{ id: 'h', titulo: 'Técnicas de estudio', de: 'Rosa', para: 'estudiar para el examen', oraciones: ora('h', [
        'Al leer en voz alta, uno se oye a sí mismo.', 'Oírse ayuda a fijar lo que se lee.', 'Por eso, leer en voz alta ayuda a recordar.']) }] }),
      solucion: [
        { texto: ['«Leer en voz alta ayuda a recordar» afirma algo y ', cubre('cubre las tres'), ': es la idea principal (es la 3).'] },
        { texto: ['«Leer en voz alta» ', prop('solo nombra'), ' el asunto: sirve como tema o como título.'] }],
      respuesta: [justo('La primera es la idea principal'), '; la segunda, el tema o título'] },

    { nivel: 3, titulo: 'La feria de semillas',
      enunciado: 'Pregunta 26 del simulacro: «El texto y la tabla giran, principalmente, en torno a». ¿Qué alternativa es la correcta?',
      datos: [D_FRASE, D_MIXTO, D_MEDIDA, D_AGREGA],
      figura: fig(sim(26, ['En algunas comunidades de Puno, cada año se hace una feria para cambiar semillas.', 'Cada familia lleva las papas, ocas y quinuas que sembró, y las cambia por otras.',
        'Así, ninguna variedad se pierde si una familia la deja de sembrar.', 'La tabla muestra cuántas variedades de papa se llevaron a una feria.'],
        'El texto y la tabla giran, principalmente, en torno a', ['la papa nativa del altiplano.', 'las 95 variedades de papa que se llevaron en 2025.',
          'las ferias para cambiar semillas, que ayudan a que no se pierdan variedades.', 'las familias de las comunidades de Puno.', 'las ferias como la única forma de salvar todos los cultivos andinos del Perú.'],
        { tabla: tabla('Variedades de papa en la feria', ['Año', 'Variedades'], [['2015', '60'], ['2025', '95']]) })),
      solucion: [
        { texto: [mala('A'), ' le serviría a otro texto: ', prop('muy amplia'), '. ', mala('B'), ' es una celda y ', mala('D'), ', quienes llevan las semillas: ', prop('muy estrechas'), '.'] },
        { texto: [mala('E'), ' agrega «única» y «todos los cultivos»: el texto habla de una feria, no compara.'] },
        { texto: [buena('C'), ' cubre ', cubre('las cuatro oraciones'), ' y ', cubre('las dos filas'), ': qué es la feria y para qué sirve.'] }],
      respuesta: [buena('C'), ': las ferias para cambiar semillas'] },
    { nivel: 3, titulo: 'El desayuno y el gráfico',
      enunciado: 'Pregunta 27 del simulacro: «¿Cuál es la idea principal del texto y el gráfico?». ¿Qué alternativa es la correcta?',
      datos: [D_ORACION, D_MIXTO, D_MEDIDA, D_AGREGA],
      figura: fig(sim(27, ['Un colegio de Ilave empezó a dar desayuno a todos sus alumnos.', 'Antes, muchos llegaban sin comer.',
        'El gráfico muestra cuántos alumnos se quedaban dormidos en la primera hora, antes y después.', 'Con el estómago lleno, los alumnos atienden mejor en clase.'],
        '¿Cuál es la idea principal del texto y el gráfico?', ['El desayuno escolar de un colegio de Ilave.', 'Antes, muchos alumnos llegaban sin comer.',
          'Desde que hay desayuno, los alumnos se duermen menos y atienden mejor.', 'Dieciocho alumnos se dormían en la primera hora.', 'El desayuno escolar resuelve todos los problemas de aprendizaje de los alumnos.'],
        { barras: barras('Alumnos que se dormían en la primera hora', [['Antes', 18], ['Después', 4]]) })),
      solucion: [
        { texto: ['Piden una oración que afirme. ', mala('A'), ' ', prop('solo nombra'), '. ', mala('B'), ' es la 2 y ', mala('D'), ', una barra: ', prop('muy estrechas'), '.'] },
        { texto: [mala('E'), ' agrega «todos los problemas»: el texto habla de dormirse y atender.'] },
        { texto: [buena('C'), ' afirma algo y cubre ', cubre('las cuatro'), ' y ', cubre('las dos barras'), '.'] }],
      respuesta: [buena('C'), ': con desayuno, se duermen menos y atienden mejor'] },
    { nivel: 3, titulo: 'La tesis de las bicicletas',
      enunciado: 'Pregunta 28 del simulacro: «¿Cuál es la tesis del autor?». ¿Qué alternativa es la correcta?',
      datos: [D_ORACION, D_TESIS, D_MEDIDA, D_AGREGA],
      figura: fig(sim(28, ['Muchos creen que en Puno no se puede andar en bicicleta por el frío y las cuestas.', 'Sin embargo, buena parte de la ciudad es plana, cerca del lago.',
        'Una bicicleta no gasta pasaje ni combustible.', 'Y pedalear abriga más que esperar la combi en el paradero.', 'Por eso, la municipalidad debería hacer ciclovías en las zonas planas.'],
        '¿Cuál es la tesis del autor?', ['En Puno no se puede andar en bicicleta por el frío.', 'La bicicleta no gasta pasaje ni combustible.', 'La bicicleta en la ciudad de Puno.',
          'La municipalidad debería hacer ciclovías en las zonas planas de Puno.', 'Todas las personas de Puno deberían dejar la combi y moverse solo en bicicleta.'])),
      solucion: [
        { texto: [mala('A'), ' es lo que el autor discute, en la 1. ', mala('B'), ' es una razón de la 3. ', mala('C'), ' ', prop('solo nombra'), '.'] },
        { texto: [mala('E'), ' agrega «todas las personas» y «solo»: el autor pide ciclovías, no que nadie use combi.'] },
        { texto: [buena('D'), ' es la 5, y ', cubre('la 2, la 3 y la 4'), ' le dan razones: es lo que defiende.'] }],
      respuesta: [buena('D'), ': la municipalidad debería hacer ciclovías en las zonas planas'] },
    { nivel: 3, titulo: 'El título de los lavaderos',
      enunciado: 'Pregunta 29 del simulacro: «¿Qué título le queda mejor al texto y la tabla?». ¿Qué alternativa es la correcta?',
      datos: [D_FRASE, D_MIXTO, D_MEDIDA, D_AGREGA],
      figura: fig(sim(29, ['En Puno, varios lavaderos de autos empezaron a reusar el agua.', 'La pasan por un filtro y la vuelven a usar en el primer enjuague.',
        'La tabla compara cuánta agua usaban por auto antes y ahora.'],
        '¿Qué título le queda mejor al texto y la tabla?', ['El agua en Puno', 'Lavaderos que reusan el agua', 'Ciento cincuenta litros por auto', 'Los autos de Puno', 'Lavaderos que ya no gastan agua'],
        { tabla: tabla('Agua por auto lavado', ['Momento', 'Litros'], [['Antes', '150'], ['Ahora', '60']]) })),
      solucion: [
        { texto: [mala('A'), ' y ', mala('D'), ' le servirían a otros textos: ', prop('muy amplios'), '. ', mala('C'), ' es una celda: ', prop('muy estrecho'), '.'] },
        { texto: [mala('E'), ' agrega: la tabla dice que ahora usan 60 litros, no que ya no gasten.'] },
        { texto: [buena('B'), ' cubre ', cubre('las tres oraciones'), ' y ', cubre('las dos filas'), ', y no dice más que ellas.'] }],
      respuesta: [buena('B'), ': Lavaderos que reusan el agua'] },
    { nivel: 3, titulo: 'Dos opiniones sobre cocinar',
      enunciado: 'Pregunta 30 del simulacro: «¿Cuál es el tema que discuten los textos A y B?». ¿Qué alternativa es la correcta?',
      datos: [D_FRASE, D_MEDIDA, D_AGREGA, 'Textos A y B: dos autores que opinan sobre un mismo asunto.'],
      figura: fig({ soporte: 'simulacro', numero: 30, hojas: [
        { id: 'ha', titulo: 'Texto A', oraciones: ora('a', ['Los colegios deberían enseñar a cocinar.', 'Muchos jóvenes viven solos cuando van a estudiar a otra ciudad.', 'Saber cocinar les ahorra dinero y les da comida más sana.']) },
        { id: 'hb', titulo: 'Texto B', oraciones: ora('b', ['Los colegios no deberían enseñar a cocinar.', 'Las horas de clase ya no alcanzan para los cursos del examen.', 'Cocinar se aprende en casa.']) }],
        pregunta: '¿Cuál es el tema que discuten los textos A y B?', alternativas: [
          { id: 'A', t: 'las ventajas de saber cocinar cuando se vive solo.' }, { id: 'B', t: 'si los colegios deben enseñar a cocinar.' }, { id: 'C', t: 'la comida de los jóvenes peruanos.' },
          { id: 'D', t: 'las horas de clase del colegio.' }, { id: 'E', t: 'la cocina como el curso más importante de todo el colegio.' }] }),
      solucion: [
        { texto: ['El texto A defiende algo y el texto B, lo contrario: el tema tiene que cubrir ', cubre('los dos textos'), '.'] },
        { texto: ['La ', mala('A'), ' cubre solo el texto A y la ', mala('D'), ', una oración del B: ', prop('muy estrechas'), '. La ', mala('C'), ': ', prop('muy amplia'), '.'] },
        { texto: ['La ', mala('E'), ' agrega «el más importante»: ningún texto lo dice. La ', buena('B'), ' cubre ', cubre('las seis oraciones'), '.'] }],
      respuesta: [buena('B'), ': si los colegios deben enseñar a cocinar'] },
  ];

  const alternativas = {
    id: 'alternativas',
    titulo: 'Elegir en el examen',
    pregunta: '¿Cómo se descarta una alternativa de tema central?',
    temas: ['Tema central', 'Idea principal e ideas secundarias'],
    pieza: 'rv-soporte',
    lee: {
      tarjetas: [
        { titulo: 'Lo que pide cada pregunta', texto: '«Tema central», «el texto gira en torno a», «da cuenta de» y «título» piden una frase. «Idea principal» y «tesis» piden una oración que afirma algo.' },
        { titulo: 'El gráfico también es texto', texto: 'En un texto mixto, el gráfico o la tabla dicen algo junto con las oraciones. Se leen los dos antes de mirar las alternativas.' },
        { titulo: 'Qué mirar al jugar', texto: 'Esta es una pregunta de simulacro con texto y gráfico, como las de San Marcos. Tacha una alternativa a la vez y lee por qué falla.' },
      ],
    },
    actividad: 'Tachar alternativas en una pregunta de simulacro hasta dejar una sola.',
    aprendizaje: 'Tema central y título piden una frase; idea principal, una oración. La buena cubre el texto y el gráfico sin agregar nada.',
    ejemplos: EJEMPLOS_ALT,
    juega: {
      consigna: 'Una hoja de simulacro para postulantes, con texto y gráfico como en San Marcos. Cada alternativa equivocada falla por algo.',
      mision: {
        texto: 'Tacha las alternativas que fallan hasta que quede una sola.',
        logrado: val => ALTS.every(x => (val[x.id.toLowerCase()] === 1) === !x.ok),
        bien: 'Queda la única que cubre el texto y el gráfico sin agregar nada.',
      },
      voz: 'Antes de tachar, pregúntate: ¿qué deja fuera o qué agrega?',
      leyenda: [
        { s: '1, 2, 3, 4', t: 'número de cada oración del texto' },
        { s: 'A–E', t: 'las alternativas de la pregunta' },
        { s: 'tachado', t: 'alternativa que descartaste' },
        { s: cubre('turquesa'), t: 'lo que la correcta cubre' },
        { s: justo('violeta'), t: 'la alternativa que queda' },
      ],
      controles: ALTS.map(x => ({ id: x.id.toLowerCase(), etiqueta: `Alternativa ${x.id}`, opciones: [{ valor: 0, texto: 'dejar' }, { valor: 1, texto: 'tachar' }] })),
      dibujo: val => ({ datos: SIMULACRO, estado: estSimulacro(val) }),
      lectura: val => lecturaSimulacro(val),
      minimo: 3,
    },
    predice: {
      pregunta: 'Para este mismo texto de las alpacas, ¿qué título le queda mejor?',
      datos: ['Título: el nombre que se le pone a un texto.', 'Cobertizo: techo bajo donde duermen los animales.'],
      opciones: [
        { id: 'c', texto: 'Cobertizos contra la helada', correcta: true },
        { id: 'amplio', texto: 'La vida en Puno', error: 'RV2', siFuera: 'Es del mismo asunto, pero le serviría a cualquier texto sobre Puno.' },
        { id: 'dato', texto: 'Cuarenta crías en un año', error: 'RV1', siFuera: 'Sale del gráfico, pero es un dato: deja fuera los cobertizos.' },
        { id: 'agrega', texto: 'El techo que salva a todas las crías', error: 'RV11', siFuera: 'Habla de los cobertizos, pero «todas» dice más que el gráfico: murieron 12.' },
      ],
      dibujo: { datos: TEXTO_ALPACA, estado: {} },
      revelar: { datos: Object.assign({}, TEXTO_ALPACA, { frase: { etiqueta: 'Título', t: 'Cobertizos contra la helada' } }), estado: Object.assign(todo(TEXTO_ALPACA), { marcas: Object.assign(todo(TEXTO_ALPACA).marcas, { frase: 'f' }) }) },
      coincide: 'Coincide: el título tiene la misma medida que el tema, ni más ni menos.',
    },
    mira: {
      pieza: 'rv-soporte',
      datos: Object.assign({}, TEXTO_ALPACA, { pregunta: '¿Qué título le queda mejor al texto?', alternativas: [
        { id: 'A', t: 'La vida en Puno' }, { id: 'B', t: 'Cuarenta crías en un año' }, { id: 'C', t: 'El techo que salva a todas las crías' }, { id: 'D', t: 'Cobertizos contra la helada' }] }),
      pasos: [
        { estado: Object.assign(todo(TEXTO_ALPACA), { nuevo: ['a1', 'a2', 'a3', 'a4'] }), texto: 'El texto trata de cobertizos contra la helada; el gráfico muestra su efecto.', ecuacion: [cubre('texto'), ' + ', cubre('gráfico')] },
        { estado: Object.assign(todo(TEXTO_ALPACA), { tachar: ['A'], nuevo: ['A'] }), texto: '«La vida en Puno» le serviría a cualquier texto de Puno.', ecuacion: [mala('A'), ': ', prop('muy amplio')] },
        { estado: Object.assign(todo(TEXTO_ALPACA), { tachar: ['A', 'B'], nuevo: ['B'] }), texto: '«Cuarenta crías» es una barra del gráfico: deja fuera los cobertizos.', ecuacion: [mala('B'), ': ', prop('muy estrecho')] },
        { estado: Object.assign(todo(TEXTO_ALPACA), { tachar: ['A', 'B', 'C'], nuevo: ['C'] }), texto: '«Todas» es absoluto: el gráfico dice que murieron 12. Agrega.', ecuacion: [mala('C'), ': ', prop('agrega')] },
        { estado: Object.assign(todo(TEXTO_ALPACA), { tachar: ['A', 'B', 'C'], marcas: Object.assign(todo(TEXTO_ALPACA).marcas, { D: 'f' }), nuevo: ['D'] }), texto: 'Queda la D: la medida del tema, dicha en pocas palabras.', ecuacion: [buena('D'), ': cubre ', cubre('texto y gráfico')] },
      ],
    },
    regla: {
      texto: 'Tema central y título piden una frase; idea principal, una oración. La correcta cubre todo el texto y el gráfico; se descarta la amplia, la estrecha y la que agrega.',
      ecuacion: [{ llave: [justo('la correcta')], nota: 'la medida del texto', color: 'c-f' }, ' cubre ', { llave: [cubre('texto y gráfico')], nota: 'todo', color: 'c-i' }, ' y ', { llave: ['nada más'], nota: 'no agrega' }],
      condicion: 'la tesis es la idea principal de un texto que opina; la que dice más que el texto, agrega.',
    },
    resuelve: {
      pieza: 'rv-soporte',
      generar(s) {
        const R = RESUELVE_ALT[s % RESUELVE_ALT.length];
        const n = oracionesDe(R.sop).length, extra = filasDe(R.sop).length ? ' y una tabla' : '';
        return {
          enunciado: R.enunciado,
          datos: R.datos,
          dibujo: { datos: R.sop, estado: {} },
          pasos: [
            { tipo: 'pide', texto: R.pide },
            { tipo: 'datos', texto: `El texto tiene ${n} oraciones${extra}, y hay ${R.sop.alternativas.length} alternativas.` },
            { tipo: 'regla', texto: 'Se descarta la muy amplia, la muy estrecha y la que agrega; queda la que cubre todo sin decir más.' },
            { tipo: 'aplica', texto: R.descartes },
            { tipo: 'aplica', texto: R.cubre, dibujo: { datos: R.sop, estado: estResuelto(R.sop, R.buena) } },
            { tipo: 'sentido', texto: R.sentido },
          ],
          respuesta: [buena(R.buena), ': ', R.resp || R.sop.alternativas.find(a => a.id === R.buena).t],
        };
      },
    },
    ahoraTu: {
      pieza: 'rv-soporte',
      generar(s) {
        const A = AHORA_ALT[s % AHORA_ALT.length], sop = sinPie(A.sop);
        return {
          pregunta: A.pregunta,
          datos: A.datos,
          dibujo: { datos: sop, estado: {} },
          opciones: opciones(A.ok, voltear(A.m, s)),
          solucion: { texto: `Tiene la medida de todo el texto${A.mixto ? ' y el gráfico' : ''}, y no agrega nada que el texto no diga.`, ecuacion: [justo(A.ok)],
            dibujo: { datos: sop, estado: todo(sop) } },
        };
      },
    },
  };

  // Una mesa del laboratorio con el juego de una idea, sin su misión (en el laboratorio nada se califica).
  const sinMision = j => Object.fromEntries(Object.entries(j).filter(([k]) => k !== 'mision'));

  // ---------- Mesa del mapa conceptual (ya no es idea de la unidad) ----------
  // Gerson, 17 nov (docs/etapa2/decisiones.md): el mapa conceptual sale de esta unidad porque San Marcos no lo pregunta;
  // su juego queda como mesa del laboratorio, en «Más mesas del tema» (laboratorioIdeas: []). El avance guardado de
  // quien ya hizo la idea no se borra: queda en est.teoria y el lector lo ignora (no hay idea con ese id).
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
  const fuera = prop;   // lo que no es fiel al texto: naranja, como un distractor (el carmín es de los ángulos)
  const ENLACE = { liberan: { ok: true, falla: null, dice: 'Fiel: el texto dice «liberan»' }, absorben: { ok: false, falla: 'invierte', dice: 'Invierte la relación: el texto dice lo contrario' }, oxigeno: { ok: false, falla: 'vacío', dice: 'Sin enlace: no afirma nada' } };
  const estMapa = (e, extra = {}) => Object.assign({ huecos: { e2: e === 'oxigeno' ? '—' : e }, marcas: { e2: ENLACE[e].ok ? 'f' : 'o', t4: 'i', p1: 'i' }, sellos: { m: ENLACE[e].ok ? { t: 'Dice lo del texto', c: 'i' } : { t: 'No es fiel', c: 'o' } } }, extra);
  // Solo el juego: la mesa del laboratorio (sus momentos se fueron con la idea).
  const mapa = {
    juega: {
      consigna: 'Completa la segunda proposición del mapa con un enlace. Compara con el texto: ¿el mapa dice lo mismo?',
      voz: 'En un mapa, la flecha y el verbo también afirman.',
      controles: [{ id: 'e', etiqueta: 'Enlace', opciones: [{ valor: 'liberan', texto: 'liberan' }, { valor: 'absorben', texto: 'absorben' }, { valor: 'oxigeno', texto: '(sin enlace)' }] }],
      dibujo: val => ({ datos: figMapa(), estado: estMapa(val.e) }),
      lectura: val => [corto(ENLACE[val.e].ok ? cubre : fuera, ENLACE[val.e].dice)],
      minimo: 3,
    },
  };

  // ---------- Laboratorio: probar propuestas en tres textos ----------
  // Más rica que la idea 2: tres textos, uno con la idea principal repartida (ninguna oración la dice sola), las cuatro
  // clases de propuesta y el marcador que recorre las oraciones. El veredicto y el conteo los calcula el código con la
  // lista de oraciones que cubre cada propuesta. Colores como en la idea 2: lo cubierto i, la propuesta o (naranja) o f
  // (violeta) si es la idea principal, lo que queda fuera en gris (ya no el carmín, que es de los ángulos).
  const TEXTOS = {
    biblioteca: { nombre: 'biblioteca', o: ['La biblioteca del barrio amplió su horario hasta las ocho de la noche.', 'También empezó a prestar libros por dos semanas.', 'Desde entonces, la visitan el doble de estudiantes.', 'Muchos dicen que antes no podían ir después del colegio.'],
      p: { tema: { t: 'La biblioteca del barrio.', c: [1, 2, 3, 4], afirma: false }, detalle: { t: 'La biblioteca abre hasta las ocho.', c: [1] }, principal: { t: 'Los cambios de la biblioteca hicieron que más estudiantes puedan usarla.', c: [1, 2, 3, 4] }, amplia: { t: 'Las bibliotecas son importantes para la educación.', c: [] } } },
    chuno: { nombre: 'chuño', o: ['En las noches de junio, la papa se deja helar en la pampa.', 'De día, el sol la descongela y se pisa para sacarle el agua.', 'Seca, se puede guardar varios años sin que se pudra.'],
      p: { tema: { t: 'El chuño.', c: [1, 2, 3], afirma: false }, detalle: { t: 'La papa se pisa para sacarle el agua.', c: [2] }, principal: { t: 'El hielo y el sol secan la papa para guardarla años.', c: [1, 2, 3] }, amplia: { t: 'En los Andes hay muchas comidas.', c: [] } } },
    paneles: { nombre: 'paneles', o: ['El colegio de Ccota instaló paneles solares.', 'Ahora tiene luz para las clases de la tarde.', 'Además, ya no paga la cuenta de electricidad.'],
      p: { tema: { t: 'Los paneles solares del colegio.', c: [1, 2, 3], afirma: false }, detalle: { t: 'Hay clases en la tarde.', c: [2] }, principal: { t: 'Los paneles solares dieron luz y ahorro al colegio.', c: [1, 2, 3] }, amplia: { t: 'La energía solar es el futuro.', c: [] } } },
  };
  function veredicto(tx, k) {
    const P = TEXTOS[tx].p[k], n = TEXTOS[tx].o.length;
    if (P.afirma === false) return 'Solo nombra el tema';
    if (P.c.length === n) return 'Idea principal';
    if (!P.c.length) return 'Habla de otro texto';
    return 'Cubre una parte';
  }
  const figLab = (tx, k) => ({ soporte: 'cuaderno', lugar: 'Hoja de práctica', hojas: [{ id: 'x', titulo: `Texto de ${TEXTOS[tx].nombre}`, oraciones: ora('o', TEXTOS[tx].o) }],
    frase: { etiqueta: 'Propuesta', t: TEXTOS[tx].p[k].t } });
  const idsDe = tx => TEXTOS[tx].o.map((t, k) => `o${k + 1}`);
  // Cubre todas las oraciones del texto elegido (con la lista de cada propuesta, la misma que pinta las marcas).
  const cubreTodo = val => TEXTOS[val.tx].p[val.k].c.length === TEXTOS[val.tx].o.length;
  const mesaPropuestas = {
    id: 'propuestas', titulo: 'Propuestas en tres textos', pieza: 'rv-soporte',
    consigna: 'Elige un texto y una propuesta. Arrastra el marcador por las oraciones para ver cuáles cubre.',
    voz: 'En el chuño, ninguna oración lo dice sola.',
    controles: [
      { id: 'tx', etiqueta: 'Texto', opciones: Object.entries(TEXTOS).map(([valor, x]) => ({ valor, texto: x.nombre })) },
      { id: 'k', etiqueta: 'Propuesta', opciones: [{ valor: 'tema', texto: 'tema' }, { valor: 'detalle', texto: 'detalle' }, { valor: 'principal', texto: 'principal' }, { valor: 'amplia', texto: 'amplia' }] },
      { id: 'f', etiqueta: 'Oración', opciones: [1, 2, 3, 4].map(k => ({ valor: k, texto: `${k}` })) },
    ],
    dibujo: val => {
      const P = TEXTOS[val.tx].p[val.k], fg = figLab(val.tx, val.k);
      const est = pinta(fg, P.c.map(k => `o${k}`));
      est.marcas.frase = veredicto(val.tx, val.k) === 'Idea principal' ? 'f' : 'o';
      return { datos: fg, estado: est };
    },
    lectura: val => {
      const T = TEXTOS[val.tx], P = T.p[val.k], f = Math.min(val.f, T.o.length), dentro = P.c.includes(f);
      return [(dentro ? cubre : prop)(`La ${f}: ${dentro ? 'cubierta' : 'fuera'}`), ` · ${veredicto(val.tx, val.k).toLowerCase()} · cubre ${P.c.length} de ${T.o.length}`];
    },
    arrastres: [{ id: 'oracion', etiqueta: 'marcador de la oración', color: 'c-o',
      donde: val => SOP().ancla(figLab(val.tx, val.k), `o${Math.min(val.f, TEXTOS[val.tx].o.length)}`),
      mover: (pt, val) => ({ f: +SOP().cercana(figLab(val.tx, val.k), pt, idsDe(val.tx)).slice(1) }) }],
    // Retos: el veredicto y la cobertura salen de veredicto() y de la lista de oraciones de cada propuesta.
    invitaciones: [
      { texto: 'En el texto del chuño, busca la propuesta que cubre todo y afirma algo.',
        logrado: val => val.tx === 'chuno' && veredicto(val.tx, val.k) === 'Idea principal',
        bien: 'Ninguna oración lo dice sola; la idea se armó uniendo las tres.' },
      { texto: 'Encuentra una propuesta que no cubra ninguna oración del texto.',
        logrado: val => TEXTOS[val.tx].p[val.k].c.length === 0,
        bien: 'Es tan amplia que podría ser de otro texto. ¿Qué la ata a este?' },
      { texto: 'En el texto de los paneles, marca una oración que el detalle deja fuera.',
        logrado: val => val.tx === 'paneles' && val.k === 'detalle' && val.f <= TEXTOS[val.tx].o.length && !TEXTOS[val.tx].p[val.k].c.includes(val.f),
        bien: 'El detalle es cierto, pero deja sin cubrir esa parte del texto.' },
      { texto: 'Guarda dos propuestas del mismo texto que cubran todo: una solo nombra el tema.',
        logrado: (val, guardados) => cubreTodo(val) && guardados.some(g => g.tx === val.tx && cubreTodo(g) && veredicto(g.tx, g.k) !== veredicto(val.tx, val.k)),
        bien: 'Las dos cubren todo; solo una afirma algo sobre el tema.' },
    ],
  };

  return {
    unidad: 'razonamiento-verbal.tema-e-idea-principal',
    version: '0.4.0',
    // Rehecha por el contrato (etapa 2, 17–18 nov): las cuatro ideas lo pasan con el validador. El tema «Mapas
    // conceptuales» salió del catálogo de esta unidad (Gerson, 17 nov: San Marcos no lo pregunta); su juego queda como
    // mesa del laboratorio.
    calidad: 2,
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rv-texto.js', '/nucleo/kit/piezas/rv-soporte.js', '/nucleo/kit/piezas/rv-escalera.js', '/nucleo/kit/piezas/rv-arbol.js'],
    historia: {
      texto: 'Entre 1977 y 1980, van Dijk llamó macroestructura al contenido global de un texto: lo que queda cuando se entiende el conjunto y no solo cada oración. El tema puede estar anunciado o tener que construirse. No todo texto tiene una oración que se pueda copiar como su idea principal.',
      pregunta: '¿Dónde está la idea principal si ninguna oración la dice?',
      fuente: { titulo: 'Matriz de teoría de razonamiento verbal (macroestructura)', url: 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/diccio_ele/diccionario/macroestructuratextual.htm' },
    },
    glosario: [
      { termino: 'tema', def: 'De qué trata un texto, dicho en pocas palabras, sin afirmar nada sobre ello.',
        simple: 'El asunto de un texto, dicho como el nombre de una carpeta.',
        ejemplos: ['«La vacunación contra la influenza en el puesto de salud», para un aviso pegado en su puerta.',
          '«El desfile de 5.º\u00a0B por el aniversario de Puno», para un mensaje de la tutora.',
          '«Las lanchas a Taquile desde el muelle de Puno», para un folleto del muelle.'],
        ver: ['tema central', 'idea principal'] },
      { termino: 'tema central', formas: ['tema central', 'temas centrales'],
        def: 'Así llama el examen a la frase que dice de qué trata todo un texto, con su tabla o gráfico.',
        simple: 'El nombre que le da el examen: de qué trata todo el texto.',
        ejemplos: ['«¿Cuál es el tema central del texto?»', '«El texto gira, principalmente, en torno a…»', '«El texto y el gráfico dan cuenta, principalmente, de…»'],
        ver: ['tema'] },
      { termino: 'cubrir', formas: ['cubrir', 'cubre', 'cubren', 'cubra'],
        def: 'Incluir una oración: una frase lo hace cuando la oración trata de lo que la frase nombra.',
        simple: 'Que la frase incluya esa oración, como una carpeta incluye sus hojas.',
        ejemplos: ['«La lluvia de febrero» incluye una oración sobre los charcos del patio.',
          '«El partido del sábado» no incluye «la tienda abre a las ocho».',
          '«La feria escolar» incluye la hora, el lugar y los premios de la feria.'],
        ver: ['tema'] },
      { termino: 'idea principal', def: 'Lo que todo el texto afirma de su tema; puede estar en una oración o repartida en varias.',
        formas: ['idea principal', 'ideas principales'],
        simple: 'Lo que el texto entero dice de su asunto, en una oración.',
        ejemplos: ['«Desde mayo, el comedor ya no usará platos descartables», para un aviso en su puerta.',
          '«Estudiar con el celular cerca distrae, aunque no se use», para un cartel de la biblioteca.',
          '«En la altura el agua hierve a menos grados y cocina más lento», armada con cuatro oraciones.'],
        ver: ['tema', 'afirmar', 'idea secundaria'] },
      { termino: 'afirmar', formas: ['afirmar', 'afirma', 'afirman', 'afirmas', 'afirmó'],
        def: 'Decir algo de un asunto que se puede creer o negar: que es, que pasa o que conviene.',
        simple: 'Decir algo que puede ser cierto o falso.',
        ejemplos: ['«La totora flota» dice algo de la totora; «la totora», sola, no.',
          '«El sábado habrá un campeonato de ajedrez» se puede creer o negar.',
          '«El campeonato de ajedrez» solo nombra: no es cierto ni falso.'],
        ver: ['idea principal', 'tema'] },
      { termino: 'idea secundaria', def: 'Oración que le da a la principal un porqué, un cómo o un ejemplo.',
        formas: ['idea secundaria', 'ideas secundarias', 'secundaria', 'secundarias'],
        simple: 'Una oración que ayuda a la principal: la explica o la muestra.',
        ejemplos: ['«El adobe absorbe el sol de día y lo suelta de noche»: dice cómo la casa guarda el calor.',
          '«Por ejemplo, en una casa de Ilave la noche se siente menos fría»: muestra un caso.',
          '«Cada aviso que suena corta la concentración»: dice por qué el celular distrae.'],
        ver: ['idea principal', 'jerarquía'] },
      { termino: 'jerarquía', def: 'Orden de importancia entre las ideas de un texto: cuál manda y cuáles la apoyan.',
        simple: 'El orden de importancia: quién manda y quién ayuda.',
        ejemplos: ['En el texto del cuy, manda la oración 2; la 3 y la 4 le responden.',
          'En el folleto de la lluvia, la 3 manda aunque va en medio.',
          'Un ejemplo nunca manda: siempre es ejemplo de otra oración.'],
        ver: ['idea principal', 'idea secundaria'] },
      { termino: 'subrayado', def: 'Marcar en el texto solo lo esencial: la oración que manda y, si hace falta, sus palabras clave.',
        formas: ['subrayado', 'subrayar', 'subraya', 'subrayas', 'subrayó'],
        simple: 'Pasar el resaltador solo por lo que más importa.',
        ejemplos: ['En la hoja de Rosa se marca la oración 1 y se tacha la 5.',
          'Marcar las cinco oraciones es como no marcar ninguna.',
          'En un texto largo, la principal y dos o tres palabras de cada apoyo.'],
        ver: ['jerarquía'] },
      { termino: 'título', formas: ['título', 'títulos'],
        def: 'Nombre que se le pone a un texto; dice de qué trata, en pocas palabras.',
        simple: 'El nombre que lleva un texto, arriba de todo.',
        ejemplos: ['«Biblioteca abierta en vacaciones», para un aviso del colegio.',
          '«Vacuna gratis contra la rabia en Ilave», para un folleto de la posta.',
          '«Lavaderos que reusan el agua», para un texto con tabla.'],
        ver: ['tema', 'tema central'] },
      { termino: 'absoluto', formas: ['absoluto', 'absolutos', 'absoluta', 'absolutas'],
        def: 'Palabra que no deja excepciones, como «todos», «nunca», «siempre» o «único».',
        simple: 'Una palabra que habla de todos los casos, sin dejar ninguno fuera.',
        ejemplos: ['«Todas las crías» es absoluto; «muchas crías», no.',
          '«La única forma» no deja lugar a otras formas.',
          '«Nunca cierra» habla de todos los días del año.'],
        ver: ['tema central'] },
      { termino: 'mapa conceptual', def: 'Esquema de conceptos unidos por flechas con verbos, que muestra cómo se relacionan las ideas.',
        formas: ['mapa conceptual', 'mapas conceptuales'],
        ejemplos: ['plantas → liberan → oxígeno.', 'lluvia → llena → ríos.', 'uros → construyen con → totora.'], ver: ['jerarquía'] },
      { termino: 'macroestructura', def: 'El contenido global que queda cuando se entiende el texto como un todo.',
        ejemplos: ['Del folleto de los uros queda: la totora es la base de su vida en el lago.',
          'De los apuntes del agua queda: en la altura hierve a menos grados y cocina más lento.',
          'Del texto del cuy queda: en Puno, el cuy es una forma de ahorro.'],
        ver: ['idea principal'] },
    ],
    laboratorio: [
      mesaPropuestas,
      // La mesa de la idea 3: el mismo juego, sin la misión (en el laboratorio nada se califica). Los retos salen de
      // PAPEL_C, el mismo papel de cada oración que pinta la figura.
      Object.assign({ id: 'jerarquia', titulo: 'Principal y secundarias', pieza: 'rv-soporte' }, sinMision(jerarquia.juega), {
        invitaciones: [
          { texto: 'Tacha una oración que sí sostiene a la principal y lee qué se pierde.',
            logrado: val => !!PAPEL_C.apoyan[val.t],
            bien: 'Sin ella, la principal sigue en pie, pero con menos apoyo.' },
          { texto: 'Pon el resaltador en el ejemplo, como si mandara.',
            logrado: val => PAPEL_C.apoyan[val.s] === 'un ejemplo',
            bien: 'Un ejemplo necesita algo de qué ser ejemplo: no puede mandar.' },
          { texto: 'Guarda la hoja bien marcada y otra con la principal equivocada.',
            logrado: (val, guardados) => guardados.some(g => g.s === PAPEL_C.principal && g.t === PAPEL_C.sobra) && guardados.some(g => g.s && g.s !== PAPEL_C.principal),
            bien: 'En una, todo cuelga de la 1; en la otra, alguna queda suelta.' },
        ] }),
      Object.assign({ id: 'mapa-conceptual', titulo: 'El enlace del mapa conceptual', pieza: 'rv-texto',
        // Retos: ENLACE dice si el enlace es fiel al texto y, si no, cómo falla.
        invitaciones: [
          { texto: 'Pon un enlace que invierta lo que dice el texto.',
            logrado: val => ENLACE[val.e].falla === 'invierte',
            bien: 'Suena científico, pero el texto dice «liberan». Vuelve a la frase.' },
          { texto: 'Deja la proposición sin enlace y mira qué afirma el mapa.',
            logrado: val => ENLACE[val.e].falla === 'vacío',
            bien: 'Sin verbo no hay relación: dos palabras juntas no afirman nada.' },
          { texto: 'Guarda un mapa fiel al texto y otro que no lo sea.',
            logrado: (val, guardados) => guardados.some(g => ENLACE[g.e].ok) && guardados.some(g => !ENLACE[g.e].ok),
            bien: 'Los conceptos son los mismos; el enlace decide si el mapa es fiel.' },
        ] }, mapa.juega),
    ],
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea). Una lista vacía:
    // la mesa no practica ninguna idea de la unidad y va en «Más mesas del tema».
    laboratorioIdeas: {
      'propuestas': ['tema-e-idea'],
      'jerarquia': ['jerarquia'],
      'mapa-conceptual': [],
    },
    ideas: [temaMedida, temaIdea, jerarquia, alternativas],
  };
});
