/*
 * Teoría de «Tema central e idea principal» (razonamiento-verbal.tema-e-idea-principal). Molde: docs/teoria.md y
 * docs/molde-unidad.md. Se rehace por el contrato «se entiende sin profesor» (etapa 2, docs/plan-calidad.md §7), idea por
 * idea, con lo aprobado por Gerson (docs/etapa2/propuesta-verbal.md; manda docs/etapa2/decisiones.md):
 *   1. tema          «El tema y su medida»        (nueva, 17 nov: ya pasa el contrato)
 *   2. tema-e-idea   «El tema no es la idea»      (de la ronda anterior; se rehace después)
 *   3. jerarquia     principal y secundarias      (de la ronda anterior; se rehace después)
 *   4. alternativas  «Elegir en el examen»        (falta escribirla)
 * El mapa conceptual salió de la unidad (Gerson, 17 nov): su juego queda como mesa del laboratorio sin idea.
 * Objeto de la primera pantalla en verbal: el texto en su soporte, con quién lo escribe y para quién (rv-soporte).
 * Textos propios, de situaciones de Puno y del Perú (regla 5): ninguno copia ni parafrasea textos de examen.
 *
 * Colores (regla 4, paleta de lectura igual que app/lectura.js): lo que la frase cubre i (turquesa, continuo), la frase
 * o el tema que se prueba o se descarta o (naranja, a trazos), el tema o la idea aceptados f (violeta, punteado; antes
 * verde d, cambiado el 17 nov por protanopía), lo que queda fuera en gris (rv-soporte) o, en las ideas 2 y 3 que aún
 * no se rehacen, h (carmín).
 * Códigos: RV1 (detalle o dato), RV2 (demasiado general), RV3 (solo una parte), RV4 (primera oración), RV5 (eco literal),
 * RV11 (absoluto), RV64 (marco o persona del comienzo), RV66 (agrega un asunto); RV64 a RV66 son hipótesis nuevas
 * (docs/investigacion/razonamiento-verbal-ideas-erroneas.md). RVM1 y RVM2 quedan solo en la mesa del mapa.
 * Los conteos se calculan (regla 1).
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  // Gesto directo (docs/teoria.md §4b): el marcador se arrastra por las oraciones y se suelta en una (rv-texto.ancla
  // pone la manija sobre el número de la oración; rv-texto.cercana elige la más cercana al dedo).
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
  // Un trozo de color largo puede partirse en renglones (largo: true); si no, en el celular se sale a lo ancho.
  const pinto = v => t => (String(t).length > 14 ? { v, t, largo: true } : { v, t });
  const cubre = pinto('c-i'), prop = pinto('c-o'), tema = pinto('c-f'), fuera = pinto('c-h');
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
    // El sello va en la tarjeta de la propuesta: arriba a la derecha lo taparía el botón de la lupa.
    return Object.assign({ marcas, sellos: { p: { t: `Cubre ${lista.length} de ${n}`, c: lista.length === n ? 'i' : 'h' } } }, extra);
  }

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
        { texto: ['A le serviría a cualquier texto sobre la ciudad: ', prop('muy amplia'), '. B es una barra y D, solo la 4: ', prop('muy estrechas'), '.'] },
        { texto: ['E dice «único» y «seguro», y el texto no compara la bicicleta con otros transportes: habla de algo que no trata.'] },
        { texto: ['C cubre ', cubre('las oraciones 1 a 4'), ' y ', cubre('las dos barras'), ': el antes, el después y lo que cambió.'] }],
      respuesta: [justo('C'), ': el aumento de alumnos en bicicleta desde la ciclovía'] },
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
        { texto: ['A: ', prop('muy amplia'), '. B es una celda de la tabla y D, quien aparece en la 4: ', prop('muy estrechas'), '. E: el texto no explica cómo arreglar un caño.'] },
        { texto: ['C cubre ', cubre('las oraciones 1 a 4'), ' y ', cubre('las dos filas'), ': el goteo, cuánto se pierde y el pedido de revisar.'] }],
      respuesta: [justo('C'), ': el agua que se pierde por los caños que gotean'] },
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
        { texto: ['A es el marco de la 1 y C, parte de la 3: ', prop('muy estrechas'), '. B le serviría a un texto sobre periódicos: ', prop('muy amplia'), '.'] },
        { texto: ['E agrega el celular, del que el texto no habla. D cubre ', cubre('las cinco oraciones'), '.'] }],
      respuesta: [justo('D'), ': la radio en quechua y aimara para las familias del campo'] },
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
        { texto: ['La alternativa A cubre solo el texto A, y la D, una oración del B: ', prop('muy estrechas'), '. La C: ', prop('muy amplia'), '.'] },
        { texto: ['La E agrega una causa y «todos los colegios», que ningún texto dice. La B cubre ', cubre('las seis oraciones'), ': es lo que discuten.'] }],
      respuesta: [justo('B'), ': si el uniforme escolar debe ser obligatorio'] },
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
        { texto: ['D cubre solo la ganancia y B es una celda: ', prop('muy estrechas'), '. C le serviría a un texto sobre el ispi o el carachi: ', prop('muy amplia'), '.'] },
        { texto: ['E agrega una prohibición que el texto no menciona. A cubre ', cubre('las dos caras'), ' y la tabla.'] }],
      respuesta: [justo('A'), ': la crianza de truchas que crece y ensucia el agua'] },
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

  // ---------- Idea 2: tema no es idea principal ----------
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
      dibujo: val => ({ datos: figBib(val.p), estado: cobertura(BIBLIO.length, PROP[val.p].cubre, val.p === 'tema' ? { marcas: Object.assign(cobertura(4, [1, 2, 3, 4]).marcas, { p1: 'f' }) } : {}) }),
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
        { estado: { marcas: { o1: 'f', o2: 'f', o3: 'f', o4: 'f' }, tapar: ['p1'] }, texto: 'Todas hablan de la biblioteca: ese es el tema.', ecuacion: [tema('tema'), ' = de qué trata'] },
        { estado: { marcas: { o1: 'i', o2: 'i', o3: 'o', o4: 'o' }, tapar: ['p1'], nuevo: ['o3', 'o4'] }, texto: 'Las dos primeras dicen qué cambió; las otras, qué produjo.', ecuacion: [cubre('cambios'), ' → ', prop('más estudiantes')] },
        { estado: cobertura(4, [1, 2, 3, 4], { nuevo: ['p1'] }), texto: 'La idea principal une las dos partes y cubre las cuatro.', ecuacion: [tema('tema'), ' + ', prop('lo que afirma')] },
      ],
    },
    regla: {
      texto: 'El tema nombra de qué trata el texto; la idea principal afirma lo más importante sobre él y cubre todo el texto. Las secundarias la explican, ejemplifican o sostienen.',
      ecuacion: [{ llave: [tema('tema')], nota: 'de qué trata', color: 'c-f' }, ' + ', { llave: [cubre('afirmación')], nota: 'qué dice de él', color: 'c-i' }],
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

  // ---------- Idea 3: jerarquía y subrayado ----------
  // Cambia: la oración que se subraya. Permanece: el texto de la quinua. Progresa: el papel de cada oración (principal,
  // razón, ejemplo, dato). Se reserva: qué subrayar en un texto nuevo (predicción). Debe verse: que solo una es la principal.
  const QUI = ['La quinua es uno de los alimentos más completos.', 'Tiene proteínas con todos los aminoácidos que necesitamos.', 'Además, aporta hierro y fibra.', 'Por ejemplo, un plato de quinua da más proteína que uno de arroz.', 'En el altiplano se cultiva hace miles de años.'];
  const PAPEL = { 1: ['Principal: lo demás la sostiene', 'f'], 2: ['Secundaria: una razón', 'i'], 3: ['Secundaria: otra razón', 'i'], 4: ['Secundaria: un ejemplo', 'i'], 5: ['Dato aparte: no la sostiene', 'h'] };
  // Debajo del texto, una tarjeta para el sello del papel (arriba lo taparía la lupa).
  const PAPEL_T = { id: 'r', titulo: 'Papel', modo: 'tarjeta', fragmentos: [] };
  const figQui = () => ({ secciones: [{ id: 'o', titulo: 'Texto', modo: 'lista', fragmentos: QUI.map((t, k) => ({ id: `o${k + 1}`, t })) }, PAPEL_T] });
  const jerarquia = {
    id: 'jerarquia',
    titulo: 'Principal, secundarias y subrayado',
    temas: ['Jerarquía textual', 'Subrayado'],
    pieza: 'rv-texto',
    juega: {
      consigna: 'Subraya una oración a la vez. Mira qué papel cumple: idea principal, razón, ejemplo o dato aparte.',
      voz: 'Subrayar es elegir: no todo pesa igual.',
      controles: [{ id: 'k', etiqueta: 'Subrayar', opciones: [1, 2, 3, 4, 5].map(k => ({ valor: k, texto: `${k}` })) }],
      dibujo: val => ({ datos: figQui(), estado: { marcas: { [`o${val.k}`]: PAPEL[val.k][1] }, sellos: { r: { t: PAPEL[val.k][0].split(':')[0], c: PAPEL[val.k][1] === 'h' ? 'h' : PAPEL[val.k][1] === 'f' ? 'f' : 'i' } } } }),
      lectura: val => [corto(PAPEL[val.k][1] === 'h' ? fuera : PAPEL[val.k][1] === 'f' ? tema : cubre, PAPEL[val.k][0])],
      minimo: 3,
      // Arrastra el resaltador de oración en oración.
      arrastres: [{ id: 'subrayado', etiqueta: 'resaltador', color: 'c-i',
        donde: val => RV().ancla(figQui(), `o${val.k}`),
        mover: pt => ({ k: +RV().cercana(figQui(), pt, QUI.map((t, k) => `o${k + 1}`)).slice(1) }) }],
    },
    predice: {
      pregunta: 'Para estudiar este texto sobre el cóndor, ¿qué conviene subrayar?',
      opciones: opciones('La oración principal y las palabras clave de sus razones', [
        ['Todo el texto, para no perder nada', 'RV1', 'Subrayar todo es como no subrayar: no se ve qué pesa más.'],
        ['Solo la primera oración', 'RV4', 'Aquí la primera es un dato; la principal llega después.'],
        ['Las cifras, porque son lo más difícil', 'RV1', 'Las cifras ayudan, pero aquí sostienen la idea; no son la idea.'],
      ]),
      dibujo: { datos: { secciones: [{ id: 'o', titulo: 'Texto', modo: 'lista', fragmentos: [{ id: 'o1', t: 'El cóndor pesa hasta quince kilos.' }, { id: 'o2', t: 'Aun así, es un gran planeador que casi no aletea.' }, { id: 'o3', t: 'Aprovecha corrientes de aire caliente que suben.' }, { id: 'o4', t: 'Así recorre hasta trescientos kilómetros en un día.' }] }, PAPEL_T] }, estado: {} },
      revelar: { datos: { secciones: [{ id: 'o', titulo: 'Texto', modo: 'lista', fragmentos: [{ id: 'o1', t: 'El cóndor pesa hasta quince kilos.' }, { id: 'o2', t: 'Aun así, es un gran planeador que casi no aletea.' }, { id: 'o3', t: 'Aprovecha corrientes de aire caliente que suben.' }, { id: 'o4', t: 'Así recorre hasta trescientos kilómetros en un día.' }] }, PAPEL_T] }, estado: { marcas: { o2: 'f', o3: 'i' }, sellos: { r: { t: 'Principal: la 2', c: 'f' } } } },
      coincide: 'Coincide: la 2 es la idea; la 3 explica cómo lo logra; lo demás la apoya.',
    },
    mira: {
      datos: figQui(),
      pasos: [
        { estado: { marcas: { o1: 'f' } }, texto: 'La 1 afirma algo general sobre la quinua.', ecuacion: [tema('principal'), ': alimento completo'] },
        { estado: { marcas: { o1: 'f', o2: 'i', o3: 'i' }, nuevo: ['o2', 'o3'] }, texto: 'La 2 y la 3 dan razones de por qué es completa.', ecuacion: [cubre('razones'), ' → ', tema('principal')] },
        { estado: { marcas: { o1: 'f', o2: 'i', o3: 'i', o4: 'i' }, nuevo: ['o4'] }, texto: 'La 4 da un ejemplo que lo muestra.', ecuacion: [cubre('ejemplo'), ' → ', tema('principal')] },
        { estado: { marcas: { o1: 'f', o2: 'i', o3: 'i', o4: 'i' }, tachar: ['o5'], nuevo: ['o5'] }, texto: 'La 5 es cierta, pero no sostiene que sea completa.', ecuacion: [fuera('dato aparte')] },
      ],
    },
    regla: {
      texto: 'Un texto tiene jerarquía: una idea principal y secundarias que la explican, la sostienen o la ejemplifican. Subrayar bien es marcar la principal y lo esencial de sus apoyos.',
      ecuacion: [tema('principal'), ' ← ', { llave: [cubre('apoyos')], nota: 'razones y ejemplos', color: 'c-i' }],
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
  const ENLACE = { liberan: { ok: true, falla: null, dice: 'Fiel: el texto dice «liberan»' }, absorben: { ok: false, falla: 'invierte', dice: 'Invierte la relación: el texto dice lo contrario' }, oxigeno: { ok: false, falla: 'vacío', dice: 'Sin enlace: no afirma nada' } };
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
      ecuacion: [cubre('A'), ' → ', { llave: [prop('enlace')], nota: 'el verbo', color: 'c-o' }, ' → ', cubre('B')],
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

  // ---------- Laboratorio: probar propuestas en tres textos ----------
  // Más rica que la idea 1: tres textos, uno con la idea principal repartida (ninguna oración la dice sola), las cuatro
  // clases de propuesta y el marcador que recorre las oraciones. El veredicto y el conteo los calcula el código con la
  // lista de oraciones que cubre cada propuesta.
  const TEXTOS = {
    biblioteca: { nombre: 'biblioteca', o: BIBLIO, p: { tema: { t: PROP.tema.t, c: [1, 2, 3, 4], afirma: false }, detalle: { t: PROP.detalle.t, c: [1] }, principal: { t: PROP.principal.t, c: [1, 2, 3, 4] }, amplia: { t: PROP.amplia.t, c: [] } } },
    chuno: { nombre: 'chuño', o: ['En las noches de junio, la papa se deja helar en la pampa.', 'De día, el sol la descongela y se pisa para sacarle el agua.', 'Seca, se puede guardar varios años sin que se pudra.'],
      p: { tema: { t: 'El chuño.', c: [1, 2, 3], afirma: false }, detalle: { t: 'La papa se pisa para sacarle el agua.', c: [2] }, principal: { t: 'El hielo y el sol secan la papa para guardarla años.', c: [1, 2, 3] }, amplia: { t: 'En los Andes hay muchas comidas.', c: [] } } },
    paneles: { nombre: 'paneles', o: ['El colegio de Ccota instaló paneles solares.', 'Ahora tiene luz para las clases de la tarde.', 'Además, ya no paga la cuenta de electricidad.'],
      p: { tema: { t: 'Los paneles solares del colegio.', c: [1, 2, 3], afirma: false }, detalle: { t: 'Hay clases en la tarde.', c: [2] }, principal: { t: 'Los paneles solares dieron luz y ahorro al colegio.', c: [1, 2, 3] }, amplia: { t: 'La energía solar es el futuro.', c: [] } } },
  };
  function veredicto(tx, k) {
    const P = TEXTOS[tx].p[k], n = TEXTOS[tx].o.length;
    if (P.afirma === false) return ['Solo nombra el tema', 'f'];
    if (P.c.length === n) return ['Idea principal', 'i'];
    if (!P.c.length) return ['Habla de otro texto', 'h'];
    return ['Cubre una parte', 'h'];
  }
  const figLab = (tx, k) => figura('Texto', TEXTOS[tx].o, TEXTOS[tx].p[k].t);
  const idsDe = tx => TEXTOS[tx].o.map((t, k) => `o${k + 1}`);
  // Cubre todas las oraciones del texto elegido (con la lista de cada propuesta, la misma que pinta las marcas).
  const cubreTodo = val => TEXTOS[val.tx].p[val.k].c.length === TEXTOS[val.tx].o.length;
  const mesaPropuestas = {
    id: 'propuestas', titulo: 'Propuestas en tres textos', pieza: 'rv-texto',
    consigna: 'Elige un texto y una propuesta. Arrastra el marcador por las oraciones para ver cuáles cubre.',
    voz: 'En el chuño, ninguna oración lo dice sola.',
    controles: [
      { id: 'tx', etiqueta: 'Texto', opciones: Object.entries(TEXTOS).map(([valor, x]) => ({ valor, texto: x.nombre })) },
      { id: 'k', etiqueta: 'Propuesta', opciones: [{ valor: 'tema', texto: 'tema' }, { valor: 'detalle', texto: 'detalle' }, { valor: 'principal', texto: 'principal' }, { valor: 'amplia', texto: 'amplia' }] },
      { id: 'f', etiqueta: 'Oración', opciones: [1, 2, 3, 4].map(k => ({ valor: k, texto: `${k}` })) },
    ],
    dibujo: val => {
      const T = TEXTOS[val.tx], P = T.p[val.k], v = veredicto(val.tx, val.k), n = T.o.length;
      const est = cobertura(n, P.c);
      if (P.afirma === false) est.marcas.p1 = 'f';
      est.sellos = { p: { t: v[0], c: v[1] } };   // el conteo va en la lectura: junto al título no cabe
      return { datos: figLab(val.tx, val.k), estado: est };
    },
    lectura: val => {
      const T = TEXTOS[val.tx], P = T.p[val.k], f = Math.min(val.f, T.o.length), dentro = P.c.includes(f);
      return [(dentro ? cubre : fuera)(`La ${f}: ${dentro ? 'cubierta' : 'fuera'}`), ` · cubre ${P.c.length} de ${T.o.length}`];
    },
    arrastres: [{ id: 'oracion', etiqueta: 'marcador de la oración', color: 'c-o',
      donde: val => RV().ancla(figLab(val.tx, val.k), `o${Math.min(val.f, TEXTOS[val.tx].o.length)}`),
      mover: (pt, val) => ({ f: +RV().cercana(figLab(val.tx, val.k), pt, idsDe(val.tx)).slice(1) }) }],
    // Retos: el veredicto y la cobertura salen de veredicto() y de la lista de oraciones de cada propuesta.
    invitaciones: [
      { texto: 'En el texto del chuño, busca la propuesta que cubre todo y afirma algo.',
        logrado: val => val.tx === 'chuno' && veredicto(val.tx, val.k)[0] === 'Idea principal',
        bien: 'Ninguna oración lo dice sola; la idea se armó uniendo las tres.' },
      { texto: 'Encuentra una propuesta que no cubra ninguna oración del texto.',
        logrado: val => TEXTOS[val.tx].p[val.k].c.length === 0,
        bien: 'Es tan amplia que podría ser de otro texto. ¿Qué la ata a este?' },
      { texto: 'En el texto de los paneles, marca una oración que el detalle deja fuera.',
        logrado: val => val.tx === 'paneles' && val.k === 'detalle' && val.f <= TEXTOS[val.tx].o.length && !TEXTOS[val.tx].p[val.k].c.includes(val.f),
        bien: 'El detalle es cierto, pero deja sin cubrir esa parte del texto.' },
      { texto: 'Guarda dos propuestas del mismo texto que cubran todo: una solo nombra el tema.',
        logrado: (val, guardados) => cubreTodo(val) && guardados.some(g => g.tx === val.tx && cubreTodo(g) && veredicto(g.tx, g.k)[0] !== veredicto(val.tx, val.k)[0]),
        bien: 'Las dos cubren todo; solo una afirma algo sobre el tema.' },
    ],
  };

  return {
    unidad: 'razonamiento-verbal.tema-e-idea-principal',
    version: '0.3.0',
    // Borrador mientras se rehace por el contrato (etapa 2): el tema «Mapas conceptuales» del catálogo ya no está en
    // ninguna idea (Gerson, 17 nov) y falta la idea 4, «Elegir en el examen». Las ideas 2 y 3 siguen como estaban.
    // calidad: 2 se declara cuando las cuatro ideas pasen el contrato; la idea 1 ya lo cumple (comprobado con el
    // validador sobre la idea sola, con calidad: 2).
    estado: 'borrador',
    requiere: ['/nucleo/kit/piezas/rv-texto.js', '/nucleo/kit/piezas/rv-soporte.js', '/nucleo/kit/piezas/rv-escalera.js'],
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
      { termino: 'idea principal', def: 'Lo más importante que el texto afirma sobre su asunto; cubre todas sus partes.',
        formas: ['idea principal', 'ideas principales'], ejemplo: '«Los cambios de la biblioteca hicieron que más estudiantes la usen.»', ver: ['tema', 'idea secundaria'] },
      { termino: 'idea secundaria', def: 'Idea que explica, sostiene o ejemplifica a la principal.',
        formas: ['idea secundaria', 'ideas secundarias', 'secundaria', 'secundarias'], ejemplo: '«Además, aporta hierro y fibra.»', ver: ['idea principal', 'jerarquía'] },
      { termino: 'jerarquía', def: 'Orden de importancia entre las ideas de un texto: cuál manda y cuáles la apoyan.',
        ver: ['idea principal', 'idea secundaria'] },
      { termino: 'subrayado', def: 'Marcar en el texto solo lo esencial: la idea que manda y las palabras clave de sus apoyos.',
        formas: ['subrayado', 'subrayar', 'subraya'], ver: ['jerarquía'] },
      { termino: 'mapa conceptual', def: 'Esquema de conceptos unidos por flechas con verbos, que muestra cómo se relacionan las ideas.',
        formas: ['mapa conceptual', 'mapas conceptuales'], ejemplo: 'plantas → liberan → oxígeno.', ver: ['enlace', 'proposición'] },
      { termino: 'enlace', formas: ['enlace'], def: 'Verbo o frase sobre la flecha de un mapa conceptual: dice qué relación hay entre dos conceptos.',
        ejemplo: 'En «plantas → usan → luz», es «usan».', ver: ['mapa conceptual'] },
      { termino: 'proposición', def: 'Unidad de un mapa conceptual: concepto, enlace y concepto que afirman algo.',
        formas: ['proposición', 'proposiciones'], ejemplo: '«plantas → liberan → oxígeno».', ver: ['enlace'] },
      { termino: 'macroestructura', def: 'El contenido global que queda cuando se entiende el texto como un todo.',
        ver: ['idea principal'] },
    ],
    laboratorio: [
      mesaPropuestas,
      Object.assign({ id: 'jerarquia', titulo: 'Principal y secundarias', pieza: 'rv-texto',
        // Retos: PAPEL guarda el papel de cada oración, el mismo que pinta la marca y el sello.
        invitaciones: [
          { texto: 'Subraya la oración que no sostiene la idea principal.',
            logrado: val => PAPEL[val.k][1] === 'h',
            bien: 'Es cierta, pero no dice por qué la quinua es completa.' },
          { texto: 'Subraya la secundaria que da un ejemplo.',
            logrado: val => PAPEL[val.k][0].includes('ejemplo'),
            bien: 'El plato de quinua muestra lo que la principal afirma.' },
          { texto: 'Guarda dos oraciones distintas que den razones de la idea principal.',
            logrado: (val, guardados) => PAPEL[val.k][0].includes('razón') && guardados.some(g => g.k !== val.k && PAPEL[g.k][0].includes('razón')),
            bien: 'Dos razones, un mismo peso: las dos sostienen la principal.' },
        ] }, jerarquia.juega),
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
    ideas: [temaMedida, temaIdea, jerarquia],
  };
});
