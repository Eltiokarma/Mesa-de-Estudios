/*
 * Teoría de «Cohesión y coherencia textual» (razonamiento-verbal.cohesion-y-coherencia). Molde: docs/teoria.md y
 * docs/molde-unidad.md. Se rehace por el contrato «se entiende sin profesor» (etapa 9, docs/plan-calidad.md §7), con la
 * propuesta de docs/etapa9/propuesta-verbal.md como guion (Gerson delegó el criterio y revisa después):
 *   1. no-contradiccion          «Un texto que no se contradice»   rehecha el 26 nov (conserva su id; pasa al primer lugar)
 *   2. referente                 «A quién se refiere»              rehecha (conserva su id)
 *   3. repetir-sustituir-callar  «Repetir, sustituir o callar»     rehecha (conserva su id)
 *   4. conocido-y-nuevo          «Lo conocido trae lo nuevo»       rehecha (conserva su id)
 *   5. incluir                   «La oración que falta»            nueva (inclusión de enunciado)
 * Segunda unidad de la rama «Oraciones y orden», después de Conectores (requiere): usa «conector», «contraste» y
 * «expectativa» sin definirlas. No adelanta Plan de redacción (ordenar un texto) ni Eliminación de oraciones (eliminar
 * por redundancia, impertinencia o incompatibilidad); «contradicción» se estrena aquí. No usa «pista» ni «contexto»
 * (Sentido contextual) ni «inferencia» ni «conclusión» (Inferencias).
 * Objeto de la primera pantalla en verbal: el texto en su soporte, con quién lo escribe y para quién (rv-soporte). Textos,
 * avisos y mensajes propios (regla 5): ninguno copia un examen ni un manual. San Marcos no pregunta esta unidad por
 * separado; el nivel 3 de la idea 5 sigue la forma que se supone de la UNI (un texto con una oración que falta y cinco
 * alternativas), como hipótesis: en el repo no hay examen de verbal de la UNI.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: decidir si un texto se sostiene (no se contradice, cada palabra tiene su referente, cada oración parte de
 *   algo dicho) y elegir la oración que falta.
 *   Persona y condiciones: postulante de 5.º o preuniversitario, celular de gama baja, sin audio, sin profesor.
 *   Resultado observable: dice qué nombra un pronombre, qué se calló, de qué parte una oración y por qué una candidata
 *   falla de un lado.
 *   Orden de atención: 1.º lo que está en negrita (la palabra o el espacio) · 2.º lo de antes y lo de después · 3.º si
 *   choca con algo del texto · acción: tocar la oración.
 *   Estados: lo que decide (turquesa) · lo que falla o choca (naranja) · lo que encaja (violeta) · tachado.
 *
 * Colores (regla 4; paleta de lectura con papel fijo en todo verbal, como en Conectores): lo que decide (la evidencia),
 * i (turquesa, continuo); lo que se prueba y falla, o (naranja, a trazos); la respuesta, f (violeta, punteado); lo
 * descartado, gris con raya de tinta. La palabra por la que se pregunta o el espacio «¿…?», en negrita y en tinta. Sin
 * verde ni carmín. Lo comprueba cohesion-y-coherencia.test.js.
 * Códigos (docs/investigacion/razonamiento-verbal-ideas-erroneas.md y contenido/razonamiento-verbal/codigos.json): RV9,
 * RV27, RV28 y, como hipótesis de esta unidad (sección «Cohesión y coherencia (códigos RVK, etapa 9)»), RVK1 a RVK18.
 * Lo que decide cada juego lo calcula el código con un mundo chico (regla 1): los días del horario, el género, el número
 * y el sentido de cada nombre, a quién recupera lo callado, de qué parte cada oración, qué retoma y qué presenta cada
 * candidata. Los ejemplos, los «Así se resuelve», los «Ahora tú» y las predicciones se revisaron con un script aparte
 * que no usa el código de la unidad (scratchpad e9-verbal/rev/revisa.js).
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  // ---------- Ayudantes de la etapa 9 (los de Conectores, con la pieza rv-soporte) ----------
  // Un trozo de color largo puede partirse en renglones (largo: true); si no, en el celular se sale a lo ancho.
  const pinto = v => t => (String(t).length > 14 ? { v, t, largo: true } : { v, t });
  const cubre = pinto('c-i'), prop = pinto('c-o'), justo = pinto('c-f');
  // La letra de una alternativa, en negrita (Gerson, mesa del 17 nov): la descartada en naranja y la correcta en violeta.
  // El U+2060 (invisible) evita que la letra sola salga en cursiva, como una variable (nucleo/ecuacion.js, LETRA).
  const mala = L => ({ v: 'c-o', t: `${L}⁠` }), buena = L => ({ v: 'c-f', t: `${L}⁠` });
  const opciones = (c, malas) => [{ id: 'c', texto: c, correcta: true }, ...malas.map(([texto, error, siFuera], k) => ({ id: `e${k}`, texto, error, siFuera }))];
  const voltear = (arr, s) => (s % 2 ? arr.slice().reverse() : arr.slice());
  const sinMision = j => Object.fromEntries(Object.entries(j).filter(([k]) => k !== 'mision'));
  const LETRAS = 'ABCDE';
  const fig = sop => ({ pieza: 'rv-soporte', datos: sop, estado: {} });
  const HUECO = '¿…?';
  // Una oración en trozos (rv-soporte, etapa 7): «[w:…]» es la palabra por la que se pregunta (en negrita); «[p:…]»,
  // «[q:…]» y las demás letras son trozos que se pueden marcar (id de la oración + la letra). Con `cambia`, un trozo toma
  // otro texto ({ w: 'lo' }); con `reservas`, guarda el ancho del más largo (el juego cambia un trozo sin mover el texto).
  //   oracion('h1', 'La biblioteca abre [p:todos los días].')
  function oracion(id, plantilla, cambia, reservas) {
    const frags = [];
    let k = 0;
    const de = (l, t) => (cambia && cambia[l] !== undefined ? cambia[l] : t);
    for (const m of plantilla.split(/(\[[a-z]:[^\]]+\])/)) {
      const e = m.match(/^\[([a-z]):([^\]]+)\]$/);
      if (e) frags.push(Object.assign({ id: `${id}${e[1]}`, t: de(e[1], e[2]) }, e[1] === 'w' ? { negrita: true } : {},
        reservas && reservas[e[1]] ? { reserva: reservas[e[1]] } : {}));
      else if (m.trim()) frags.push({ id: `${id}t${k++}`, t: m.trim() });
    }
    const t = plantilla.replace(/\[([a-z]):([^\]]+)\]/g, (_, l, x) => de(l, x));
    return { id, t, frags };
  }
  // Una lista de oraciones; la que no trae trozos va como texto simple.
  const ors = (pre, lista) => lista.map((t, k) => (typeof t === 'string' ? (/\[[a-z]:/.test(t) ? oracion(`${pre}${k + 1}`, t) : { id: `${pre}${k + 1}`, t }) : t));
  const papel = (soporte, lugar, titulo, de, para, oraciones, extra) => Object.assign({ soporte, lugar, hojas: [Object.assign({ id: 'k' }, titulo ? { titulo } : {}, { de, para, oraciones })] }, extra || {});
  // La hoja de simulacro: un texto de dos a cinco oraciones, la pregunta y las alternativas A–E (formato UNI, hipótesis);
  // sin alternativas, cuando son los botones de «Ahora tú».
  const sim = (numero, oraciones, pregunta, alts) => ({ soporte: 'simulacro', numero, hojas: [{ id: 'h', titulo: 'Texto', oraciones }],
    pregunta: alts && alts.length ? pregunta : null, alternativas: (alts || []).map((t, k) => ({ id: LETRAS[k], t })) });
  // Los trozos marcables de una hoja: todos los de las oraciones en trozos, menos los de texto corrido (t0, t1…) y la
  // palabra en negrita (w).
  const trozosHoja = sop => sop.hojas.flatMap(h => (h.oraciones || []).flatMap(o => (o.frags || []).filter(f => !/t\d+$/.test(f.id) && !/w$/.test(f.id)).map(f => f.id)));
  // El estado de una hoja resuelta: lo que decide en turquesa, la buena en violeta y las demás tachadas.
  const estHoja = (sop, L, marcas) => ({ marcas: Object.assign(Object.fromEntries((marcas || trozosHoja(sop)).map(id => [id, 'i'])), L ? { [L]: 'f' } : {}),
    tachar: L ? sop.alternativas.map(a => a.id).filter(id => id !== L) : [] });
  // «Así se resuelve»: el enunciado, los datos y la respuesta, armados igual en las cinco ideas.
  const resuelveDe = (R, regla) => ({
    enunciado: `Pregunta ${R.sop.numero} del simulacro. ${R.sop.pregunta}`,
    datos: R.datos, dibujo: { datos: R.sop, estado: {} },
    respuesta: [buena(R.buena), ': ', R.sop.alternativas.find(a => a.id === R.buena).t],
    pasos: [
      { tipo: 'pide', texto: R.pide },
      { tipo: 'datos', texto: R.tengo },
      { tipo: 'regla', texto: regla },
      { tipo: 'aplica', texto: R.malas },
      { tipo: 'aplica', texto: R.bien, dibujo: { datos: R.sop, estado: estHoja(R.sop, R.buena, R.marcas) } },
      { tipo: 'sentido', texto: R.sentido },
    ],
  });
  // «Ahora tú»: la hoja trae el texto; las opciones son los botones. Cada caso: { o: oraciones, pregunta, ok, por, m:
  // [[texto, código, siFuera]…] }. La solución marca lo que decide (los trozos de la hoja).
  const ahoraDe = (lista, base, s, datos) => {
    const A = lista[s % lista.length], sop = sim(base + (s % lista.length), ors('h', A.o));
    return {
      pregunta: A.pregunta,
      datos: A.datos || datos,
      dibujo: { datos: sop, estado: {} },
      opciones: opciones(A.ok, voltear(A.m, s)),
      solucion: { texto: A.por, ecuacion: [justo(A.ok)], dibujo: { datos: sop, estado: estHoja(sop) } },
    };
  };

  // ---------- Idea 1: un texto que no se contradice (conserva su id; etapa 9, va primero) ----------
  // Cambia: los días que abre la biblioteca y el día que no atiende. Permanece: la puerta, la bibliotecaria y el
  // «Además» que enlaza las dos oraciones. Progresa: de un horario que choca a uno que se puede creer entero. Se reserva:
  // dos oraciones de tiempos distintos (predicción). Debe verse: que el «Además» no impide el choque, y que el choque está
  // en un día que a la vez abre y no atiende.
  // Objeto de la primera pantalla: la puerta de la biblioteca municipal de Ayaviri (la bibliotecaria, para los lectores).
  // Colores: los dos trozos que chocan, o; los que pueden ser verdad a la vez, i; el horario que cumple la misión, f.
  // Códigos: RV9 (choque implícito), RVK1 (el conector o la buena escritura como prueba), RVK2 (choque donde cambia el
  // tiempo, la persona o la parte) y RVK3 (hablar de lo mismo basta).

  // El juego: el mundo chico de los días (1 lunes … 7 domingo). El código decide si el horario choca.
  const ABRE1 = [{ t: 'todos los días', dias: [1, 2, 3, 4, 5, 6, 7] }, { t: 'de lunes a sábado', dias: [1, 2, 3, 4, 5, 6] }, { t: 'de lunes a viernes', dias: [1, 2, 3, 4, 5] }];
  const CIERRA1 = [{ t: 'el domingo', dia: 7 }, { t: 'el sábado', dia: 6 }, { t: 'el lunes', dia: 1 }];
  const choca1 = val => ABRE1[val.a].dias.includes(CIERRA1[val.c].dia);
  const listo1 = val => !choca1(val) && ABRE1[val.a].dias.includes(6);
  const may = t => t.charAt(0).toUpperCase() + t.slice(1);
  const puerta1 = val => papel('puerta', 'Puerta de la biblioteca municipal de Ayaviri', 'Horario de atención', 'la bibliotecaria', 'los lectores', [
    oracion('h1', 'La biblioteca abre [p:todos los días].', { p: ABRE1[val.a].t }, { p: 'de lunes a viernes' }),
    oracion('h2', 'Además, [q:el domingo] no atiende.', { q: CIERRA1[val.c].t }, { q: 'el domingo' }),
    { id: 'h3', t: 'Los libros prestados se devuelven en el mostrador.' },
  ]);
  const INI1 = { a: 0, c: 0 };
  const est1 = val => { const m = choca1(val) ? 'o' : listo1(val) ? 'f' : 'i'; return { marcas: { h1p: m, h2q: m } }; };
  const lectura1 = val => {
    const a = ABRE1[val.a], c = CIERRA1[val.c];
    if (choca1(val)) return [prop(`«${may(a.t)}»`), ` incluye ${c.t}: abre y no atiende`];
    if (listo1(val)) return [justo('Ningún día abre y cierra a la vez'), '; el sábado abre'];
    return [cubre('No se contradice'), ', pero el sábado no abre'];
  };

  // La predicción: dos oraciones de dos tiempos. El juego solo mostró oraciones del mismo tiempo.
  const AVISO1 = (marcas) => ({ datos: papel('puerta', 'Puerta de la biblioteca municipal de Ayaviri', 'Aviso', 'la bibliotecaria', 'los lectores', [
    oracion('f1', '[p:Hasta marzo], la biblioteca abrió [x:solo los sábados].'),
    oracion('f2', '[q:Desde abril], abre [y:también los domingos].'),
  ]), estado: marcas ? { marcas } : {} });

  // Los Datos de la idea: la definición y sus tres condiciones (contrato, punto 13: el criterio entre el que se decide).
  const D_CONTRA = 'Contradicción: dos afirmaciones que no pueden ser verdad a la vez.';
  const D_TRES = 'Hay contradicción si se afirma y se niega lo mismo, de lo mismo y en el mismo momento.';
  const D_QUIEN = 'Lo que una persona cree o dice se le atribuye a ella, no al texto.';
  const D_TODOS = '«Todos» y «ninguno» hablan de cada uno del grupo, sin excepción.';
  const D_IDEA1 = [D_CONTRA, D_TRES, D_QUIEN, D_TODOS];

  // «Así se resuelve»: cuatro hojas con un texto y cinco alternativas. La buena: C, A, E y B (en la unidad, cada letra
  // cuatro veces en las 20 hojas). Ningún caso es de «Ahora tú» ni de los ejemplos. Revisado aparte (scratchpad
  // e9-verbal/rev/revisa.js): solo una alternativa cumple.
  const REGLA1 = 'Se contradicen dos oraciones que afirman y niegan lo mismo, de lo mismo y a la vez; otro tiempo, persona o parte no chocan.';
  const RESUELVE_1 = [
    { sop: sim(9, ors('h', ['El comedor del colegio de Lampa atiende [p:de lunes a viernes].', 'El menú de esta semana trae sopa de quinua.', '[q:Los martes, el comedor permanece cerrado].', 'El almuerzo se sirve a la una.']),
      '¿Qué dos oraciones no pueden ser verdad a la vez?', ['1 y 2', '2 y 4', '1 y 3', '3 y 4', '2 y 3']), buena: 'C',
      pide: 'Piden las dos oraciones que afirman y niegan lo mismo a la vez.', datos: D_IDEA1,
      tengo: [cubre('«De lunes a viernes»'), ' incluye el martes, y ', cubre('«los martes… cerrado»'), ' niega que atienda ese día.'],
      malas: [mala('A'), ' y ', mala('E'), ' juntan el menú con el horario: el menú no dice qué días atiende. ', mala('B'), ' y ', mala('D'), ' juntan la hora del almuerzo, que no choca con nada.'],
      bien: [buena('C'), ': ', justo('la 1 y la 3'), ' afirman y niegan que el comedor atienda los martes.'],
      sentido: 'Relee: si atiende de lunes a viernes, el martes no puede estar cerrado. Una de las dos sobra o está mal.' },
    { sop: sim(10, ors('h', ['[p:Todos los socios] de la cooperativa de Cabana votaron el domingo.', 'Luego, el presidente agradeció a los socios.', '[q:Dos socios no votaron] porque estaban de viaje.']),
      '¿Qué cambio quita la contradicción del texto?', ['Cambiar «Todos» por «Casi todos» en la 1', 'Poner «sin embargo» al inicio de la 3', 'Quitar «Luego» al inicio de la 2', 'Cambiar «domingo» por «sábado» en la 1', 'Cambiar «de viaje» por «enfermos» en la 3']), buena: 'A',
      pide: 'Piden el cambio que deja de afirmar y negar lo mismo.', datos: D_IDEA1,
      tengo: [cubre('«Todos los socios»'), ' votaron, y ', cubre('«dos socios no votaron»'), ': se afirma y se niega que esos dos votaran.'],
      malas: [mala('B'), ' y ', mala('C'), ' cambian el enlace, no lo que se dice. ', mala('D'), ' cambia el día, pero la 3 sigue negando que todos votaran. ', mala('E'), ' cambia el motivo, no el choque.'],
      bien: [buena('A'), ': con ', justo('«casi todos»'), ', dos pueden faltar sin contradicción.'],
      sentido: 'Relee: casi todos votaron; dos no votaron porque estaban de viaje. Las tres oraciones se pueden creer juntas.' },
    { sop: sim(11, [{ id: 'h1', t: 'Un compañero copió en la pizarra cinco pares de oraciones.' }],
      '¿En qué par las dos oraciones pueden ser verdad a la vez?', ['«Nadie llegó tarde al ensayo. Rosa llegó tarde al ensayo.»', '«La tienda está cerrada ahora. Ahora mismo, la tienda atiende.»', '«El río estaba seco. Por eso, nadamos en él esa tarde.»', '«Toda la clase aprobó. Tres alumnos de la clase desaprobaron.»', '«Ayer llovió toda la tarde en Puno. Hoy hace sol en Puno.»']), buena: 'E',
      pide: 'Piden el par que no afirma y niega lo mismo a la vez.', datos: D_IDEA1,
      tengo: ['En cada par se pregunta si hablan de lo mismo, en el mismo momento, y si una niega a la otra.'],
      malas: [mala('A'), ' y ', mala('D'), ' niegan lo que dice «nadie» o «toda». ', mala('B'), ' dice cerrada y abierta en el mismo momento. ', mala('C'), ': alguien nada en un río seco, y «por eso» no lo arregla.'],
      bien: [buena('E'), ': ', justo('ayer y hoy'), ' son dos tiempos; el clima cambió.'],
      sentido: 'Relee el par E: que ayer lloviera no impide que hoy haga sol.' },
    { sop: sim(12, ors('h', ['[p:Pedro cree] que el puente de Lampa se caerá con las lluvias.', '[q:El ingeniero municipal asegura] que el puente resistirá.']),
      '¿Por qué el texto no se contradice?', ['Porque el puente es el mismo en las dos oraciones', 'Porque cada oración dice lo que piensa otra persona', 'Porque las dos oraciones hablan de tiempos distintos', 'Porque el ingeniero sabe más de puentes que Pedro', 'Porque nadie sabe si las lluvias serán fuertes']), buena: 'B',
      pide: 'Piden por qué «se caerá» y «resistirá» no chocan en este texto.', datos: D_IDEA1,
      tengo: [cubre('«Pedro cree»'), ' y ', cubre('«el ingeniero asegura»'), ': cada opinión es de alguien distinto.'],
      malas: [mala('A'), ' es cierto, pero no explica por qué no chocan. ', mala('C'), ' no se cumple: las dos hablan de las mismas lluvias. Lo que dicen ', mala('D'), ' y ', mala('E'), ' no está en el texto.'],
      bien: [buena('B'), ': el texto ', justo('cuenta dos opiniones'), '; no afirma por su cuenta las dos cosas.'],
      sentido: 'Relee: el texto dice qué piensa cada uno. Que dos personas no estén de acuerdo no es una contradicción del texto.' },
  ];

  // «Ahora tú»: seis casos de cuatro opciones; cada parte de la regla (mismo momento, otro tiempo, otra persona, otra
  // parte, el conector que no arregla y el texto de cuatro oraciones). Dos incorrectas no comparten código.
  const AHORA_1 = [
    { o: ['[p:Ningún alumno] de 5.º A faltó a la clausura.', '[q:Dos alumnos de 5.º A] no fueron a la clausura.'], pregunta: '¿Se contradicen las dos oraciones?', ok: 'Sí: «ningún alumno» deja fuera a esos dos',
      por: '«Ningún alumno faltó» y «dos no fueron» afirman y niegan lo mismo, del mismo grupo y del mismo día.', datos: D_IDEA1,
      m: [['No: la segunda solo cuenta una excepción', 'RV9', 'Bien visto que son dos alumnos, pero solo cabría esa excepción si la 1 dijera «casi ningún alumno»; con «ningún», no cabe.'],
        ['Sí: las dos hablan de la misma clausura', 'RVK3', 'Acertaste el «sí», pero hablar de la misma clausura no basta: chocan porque «ningún alumno faltó» no deja lugar a esos dos.'],
        ['No: las dos oraciones están escritas sin errores', 'RVK1', 'Están bien escritas, pero eso no basta: lo que dicen no se puede creer a la vez.']] },
    { o: ['[p:El año pasado], el pasaje de la combi a Juliaca costaba cuatro soles.', '[q:Este año] cuesta cinco soles.'], pregunta: '¿Se contradicen las dos oraciones?', ok: 'No: cada precio es de un año distinto',
      por: '«El año pasado» y «este año» son dos tiempos: el precio subió.',
      m: [['Sí: un mismo pasaje no tiene dos precios', 'RVK2', 'Bien visto que hay dos precios, pero solo chocarían si fueran del mismo año; aquí uno es del año pasado y el otro, de este.'],
        ['Sí: falta un «pero» entre las dos', 'RVK1', 'Un «pero» las uniría, es cierto, pero no cambia lo que dicen: sin él tampoco chocan.'],
        ['No: las dos oraciones hablan de la combi', 'RVK3', 'Acertaste el «no», pero no por esa razón: no chocan porque cada precio es de un año distinto.']] },
    { o: ['[p:Ana cree] que el simulacro será fácil.', '[q:Luis cree] que será muy difícil.'], pregunta: '¿Se contradice el texto?', ok: 'No: son las opiniones de dos personas', datos: D_IDEA1,
      por: 'Cada oración dice lo que cree alguien distinto: el texto no afirma las dos cosas.',
      m: [['Sí: «fácil» y «difícil» se oponen', 'RVK2', '«Fácil» y «difícil» se oponen, sí, pero cada uno dice lo que cree: el texto no afirma las dos cosas.'],
        ['Sí: falta un conector que las una', 'RVK1', 'Es cierto que un conector las uniría, pero no decide si chocan: eso depende de lo que dicen.'],
        ['No: las dos hablan del mismo simulacro', 'RVK3', 'Acertaste el «no», pero hablar del mismo simulacro no lo explica: no chocan porque opinan dos personas.']] },
    { o: ['[p:El pozo del barrio se secó] en julio.', 'Por eso, en julio, [q:los vecinos sacaron agua] del pozo para regar.'], pregunta: '¿Se contradice el texto?', ok: 'Sí: de un pozo seco no se saca agua',
      por: '«Se secó» y «sacaron agua» chocan en el mismo pozo y el mismo mes; «por eso» no lo arregla.',
      m: [['No: «por eso» une bien las dos oraciones', 'RVK1', '«Por eso» une las oraciones, es cierto, pero no arregla lo que dicen: un pozo seco y vecinos que sacan agua no se pueden creer a la vez.'],
        ['Sí: las dos hablan del mismo pozo', 'RVK3', 'Acertaste el «sí», pero hablar del mismo pozo no basta: chocan porque de un pozo seco no se saca agua.'],
        ['No: la segunda oración no dice que hubiera agua', 'RV9', 'Es cierto que no lo dice con esas palabras, pero si sacaron agua es porque había agua, y el pozo estaba seco.']] },
    { o: ['[p:La casa] de mi abuelo es de adobe.', '[q:Su puerta] es de madera de eucalipto.'], pregunta: '¿Se contradicen las dos oraciones?', ok: 'No: hablan de partes distintas de la casa',
      por: 'La primera habla de la casa y la segunda, de su puerta: no se niega lo mismo.',
      m: [['Sí: una casa no es de dos materiales', 'RVK2', 'Bien visto que hay dos materiales, pero solo chocarían si fueran de la misma parte; aquí uno es de la casa y el otro, de su puerta.'],
        ['Sí: debería decir «pero» al inicio de la segunda', 'RVK1', 'Sí, un «pero» las uniría, pero no decide si chocan: eso depende de lo que dicen.'],
        ['No: las dos oraciones hablan de mi abuelo', 'RVK3', 'Acertaste el «no», pero el motivo es otro: hablan de dos partes distintas de la casa.']] },
    { o: ['La feria del colegio empezó a las nueve de la mañana.', '[p:Ningún puesto] vendió comida.', 'Los padres de familia vendieron las entradas.', '[q:El puesto de 5.º B vendió anticuchos] toda la tarde.'],
      pregunta: '¿Qué dos oraciones no pueden ser verdad a la vez?', ok: 'La 2 y la 4', datos: D_IDEA1,
      por: '«Ningún puesto vendió comida» y «el puesto de 5.º B vendió anticuchos» se niegan.',
      m: [['La 1 y la 4', 'RVK2', 'Bien visto que la 1 habla de la hora, pero empezar a las nueve no impide que un puesto venda en la tarde: la 1 y la 4 no chocan.'],
        ['La 2 y la 3', 'RVK3', 'Las dos hablan de vender, es cierto, pero las entradas no son comida: la 3 no niega a la 2.'],
        ['La 1 y la 3', 'RVK1', 'Hiciste bien en buscar un choque, pero que la feria empezara a las nueve y que los padres vendieran entradas se puede creer a la vez.']] },
  ];

  // Ejemplos resueltos de la idea 1. La figura es el texto en su soporte, sin marcas. Nivel 1: un paso (¿se contradice
  // este par?, ¿lo arregla el conector?). Nivel 2: elegir entre tres de una lista. Nivel 3: la hoja de simulacro con cinco
  // alternativas; las correctas son A, B, C, D y E. Revisado aparte (scratchpad e9-verbal/rev/revisa.js): una tabla de
  // qué afirma cada oración, de qué, cuándo y quién, decide cuál choca; solo una cumple y la correcta no es la más larga
  // ni la más corta.
  const EJEMPLOS_1 = [
    { nivel: 1, titulo: 'La tienda de don Lucho',
      enunciado: '¿Se contradicen las dos oraciones del cartel?',
      datos: D_IDEA1,
      figura: fig(papel('cartel', 'Cartel de una tienda de Juliaca', 'Atención', 'don Lucho', 'los clientes', ors('k', ['La tienda abre todos los días.', 'Los domingos está cerrada.']))),
      solucion: [{ texto: [cubre('«Todos los días»'), ' incluye el domingo, y ', cubre('«los domingos está cerrada»'), ' lo niega.'] }],
      respuesta: [justo('Sí'), ': abre y no abre el domingo'] },
    { nivel: 1, titulo: 'La mudanza de Lucía',
      enunciado: '¿Se contradicen las dos oraciones del mensaje de Lucía?',
      datos: D_IDEA1,
      figura: fig(papel('mensaje', 'Promoción 2026', null, 'Lucía', 'la promoción', ors('k', ['En 2020 vivía en Juliaca.', 'Ahora mi casa está en Puno, cerca del muelle.']))),
      solucion: [{ texto: [cubre('«En 2020»'), ' y ', cubre('«ahora»'), ' son dos tiempos: Lucía se mudó.'] }],
      respuesta: [justo('No'), ': cada oración es de otro tiempo'] },
    { nivel: 1, titulo: 'La plaza nueva',
      enunciado: '¿Se contradice el texto del periódico mural?',
      datos: D_IDEA1,
      figura: fig(papel('mural', 'Mural del colegio', 'Opiniones del barrio', 'el club de periodismo', 'todo el colegio', ors('k', ['Para doña Elsa, la plaza quedó bonita.', 'Para don Mario, quedó fea.']))),
      solucion: [{ texto: [cubre('«Para doña Elsa»'), ' y ', cubre('«para don Mario»'), ': son dos opiniones, cada una de su dueño.'] }],
      respuesta: [justo('No'), ': cuenta lo que opinan dos personas'] },
    { nivel: 1, titulo: 'La mochila de Raúl',
      enunciado: '¿Se contradicen las dos oraciones de la nota?',
      datos: D_IDEA1,
      figura: fig(papel('puerta', 'Puerta de la dirección', 'Objeto perdido', 'la auxiliar', 'los estudiantes', ors('k', ['Se encontró una mochila negra en el patio.', 'Su cierre es rojo.']))),
      solucion: [{ texto: ['La primera habla de ', cubre('la mochila'), ' y la segunda, de ', cubre('su cierre'), ': dos partes distintas.'] }],
      respuesta: [justo('No'), ': hablan de partes distintas'] },
    { nivel: 1, titulo: 'El préstamo imposible',
      enunciado: '¿El «además» quita el choque entre las dos oraciones?',
      datos: D_IDEA1,
      figura: fig(papel('cuaderno', 'Cuaderno de la bibliotecaria', 'Lunes 3', 'la bibliotecaria', 'el registro', ors('k', ['Ese día, la biblioteca estuvo cerrada.', 'Además, ese día prestó veinte libros.']))),
      solucion: [{ texto: [cubre('«Estuvo cerrada»'), ' y ', cubre('«prestó veinte libros»'), ' chocan el mismo día. El conector une, pero no lo arregla.'] }],
      respuesta: [justo('No'), ': el texto se sigue contradiciendo'] },

    { nivel: 2, titulo: 'La feria de los domingos',
      enunciado: '¿Qué oración contradice el aviso: «Este sábado hubo feria en Juliaca», «En 2019 la feria era los sábados» o «Mi tío dice que la feria es los sábados»?',
      datos: D_IDEA1,
      figura: fig(papel('puerta', 'Puerta de la municipalidad de Juliaca', 'Aviso', 'la municipalidad', 'los vecinos', ors('k', ['La feria de Juliaca se hace solo los domingos.']))),
      solucion: [
        { texto: [cubre('«Solo los domingos»'), ' niega que haya feria un sábado de ahora.'] },
        { texto: [prop('«En 2019»'), ' es otro tiempo; ', prop('«mi tío dice»'), ' es la opinión de alguien.'] }],
      respuesta: [justo('«Este sábado hubo feria en Juliaca»')] },
    { nivel: 2, titulo: 'El buzo del viernes',
      enunciado: '¿Qué oración contradice la nota: «El lunes, Carla vino sin buzo», «Carla cree que el buzo es incómodo» o «El viernes, Carla vino sin buzo»?',
      datos: D_IDEA1,
      figura: fig(papel('mural', 'Mural del colegio', 'Educación Física', 'el profesor de Educación Física', 'los estudiantes de 5.º A', ors('k', ['Todos los alumnos de 5.º A vinieron con buzo el viernes.']))),
      solucion: [
        { texto: [cubre('«Todos… el viernes»'), ' incluye a Carla ese día.'] },
        { texto: [prop('«El lunes»'), ' es otro día; ', prop('«Carla cree»'), ' es una opinión, no dice qué llevó puesto.'] }],
      respuesta: [justo('«El viernes, Carla vino sin buzo»')] },
    { nivel: 2, titulo: 'La panadería sin pan',
      enunciado: '¿Qué oración puede ser verdad junto con el aviso: «Esta mañana compré ahí pan recién horneado», «Ayer la panadería horneó pan de quinua» o «Hoy la panadería horneó pan de maíz»?',
      datos: D_IDEA1,
      figura: fig(papel('puerta', 'Puerta de una panadería de Puno', 'Aviso', 'la panadería', 'los clientes', ors('k', ['Hoy no horneamos pan: el horno está en reparación.']))),
      solucion: [
        { texto: [cubre('«Hoy no horneamos»'), ' niega cualquier pan recién hecho de hoy.'] },
        { texto: [prop('«Esta mañana compré… recién horneado»'), ' y ', prop('«hoy horneó pan de maíz»'), ' chocan con eso.'] }],
      respuesta: [justo('«Ayer la panadería horneó pan de quinua»'), ': es otro día'] },
    { nivel: 2, titulo: 'Lunes o martes',
      enunciado: '¿Por qué el texto no se contradice: «son dos personas que dicen cosas distintas», «son dos tiempos distintos» o «hablan de dos exámenes de cursos distintos»?',
      datos: D_IDEA1,
      figura: fig(papel('mensaje', 'Delegados de 5.º', null, 'el delegado', 'los compañeros', ors('k', ['El profesor dice que el examen será el lunes.', 'La directora dice que será el martes.']))),
      solucion: [
        { texto: [cubre('«El profesor dice»'), ' y ', cubre('«la directora dice»'), ': el texto cuenta lo que dice cada uno.'] },
        { texto: ['Las dos hablan del mismo examen y del mismo tiempo: ', prop('las otras razones'), ' no se cumplen.'] }],
      respuesta: [justo('«Son dos personas que dicen cosas distintas»')] },
    { nivel: 2, titulo: 'La combi de Lampa',
      enunciado: '¿Qué cambio quita el choque: poner «sin embargo» al inicio de la segunda, cambiar «ayer» por «hoy» en la segunda o poner «también» en la segunda?',
      datos: D_IDEA1,
      figura: fig(papel('cuaderno', 'Cuaderno del paradero', 'Registro', 'el controlador', 'la empresa', ors('k', ['Ninguna combi llegó a Lampa ayer.', 'Una combi llegó a Lampa ayer por la tarde.']))),
      solucion: [
        { texto: [cubre('«Ninguna… ayer»'), ' y ', cubre('«una… ayer»'), ' afirman y niegan lo mismo, del mismo día.'] },
        { texto: [prop('«Sin embargo»'), ' y ', prop('«también»'), ' cambian el enlace, no lo que se dice. Con «hoy», ya son dos días.'] }],
      respuesta: [justo('Cambiar «ayer» por «hoy» en la segunda')] },

    { nivel: 3, titulo: 'El concurso de matemática',
      enunciado: 'Pregunta 21 del simulacro. ¿Qué dos oraciones no pueden ser verdad a la vez?',
      datos: D_IDEA1,
      figura: fig(sim(21, ors('h', ['El concurso de matemática de Puno se dio el sábado.', 'Participaron los cinco colegios del distrito.', 'Los ganadores recibieron medallas.', 'El colegio San Juan, del mismo distrito, no se presentó al concurso.']),
        '¿Qué dos oraciones no pueden ser verdad a la vez?', ['2 y 4', '1 y 3', '1 y 2', '3 y 4', '1 y 4'])),
      solucion: [
        { texto: [cubre('«Los cinco colegios»'), ' participaron, y ', cubre('«San Juan no se presentó»'), ': si San Juan es del distrito, chocan.'] },
        { texto: [mala('B'), ', ', mala('C'), ' y ', mala('E'), ' juntan el día con otro dato que no lo niega.'] },
        { texto: [mala('D'), ' no choca: las medallas no dicen quién fue. ', buena('A'), ': ', justo('la 2 y la 4'), '.'] }],
      respuesta: [buena('A'), ': 2 y 4'] },
    { nivel: 3, titulo: 'El agua del colegio',
      enunciado: 'Pregunta 22 del simulacro. ¿Qué cambio quita la contradicción del texto?',
      datos: D_IDEA1,
      figura: fig(sim(22, ors('h', ['El lunes, el colegio de Ayaviri no tuvo agua en todo el día.', 'Por eso, los alumnos trajeron botellas de casa.', 'Ese lunes, al mediodía, se lavaron las manos en los caños del patio.']),
        '¿Qué cambio quita la contradicción del texto?', ['Cambiar «Por eso» por «Además» en la 2', 'Cambiar «Ese lunes» por «El martes» en la 3', 'Quitar «de casa» al final de la 2', 'Poner «sin embargo» al inicio de la 3', 'Cambiar «al mediodía» por «en la tarde» en la 3'])),
      solucion: [
        { texto: [cubre('«No tuvo agua en todo el día»'), ' choca con lavarse en los caños ', cubre('ese lunes'), '.'] },
        { texto: [mala('A'), ', ', mala('C'), ' y ', mala('D'), ' cambian enlaces o detalles, no el choque. ', mala('E'), ' sigue siendo el mismo lunes.'] },
        { texto: [buena('B'), ': con ', justo('el martes'), ', son dos días distintos.'] }],
      respuesta: [buena('B'), ': cambiar «Ese lunes» por «El martes» en la 3'] },
    { nivel: 3, titulo: 'El lago y los pescadores',
      enunciado: 'Pregunta 23 del simulacro. ¿Por qué el texto no se contradice?',
      datos: D_IDEA1,
      figura: fig(sim(23, ors('h', ['Los pescadores de Chucuito creen que este año habrá pocos peces en el lago.', 'Los técnicos del ministerio dicen que habrá tantos como el año pasado.']),
        '¿Por qué el texto no se contradice?', ['Porque el lago es el mismo en las dos oraciones', 'Porque los técnicos saben mucho más que los pescadores', 'Porque cada oración cuenta lo que piensa otro grupo', 'Porque una oración habla de este año y la otra no', 'Porque nadie sabe cuántos peces hay en el lago'])),
      solucion: [
        { texto: [cubre('«Los pescadores creen»'), ' y ', cubre('«los técnicos dicen»'), ': el texto cuenta dos opiniones.'] },
        { texto: [mala('A'), ' es cierto, pero no explica por qué no chocan. Lo que dicen ', mala('B'), ' y ', mala('E'), ' no está en el texto.'] },
        { texto: [mala('D'), ' no se cumple: las dos hablan de este año. ', buena('C'), ': ', justo('dos opiniones'), ' no son un choque del texto.'] }],
      respuesta: [buena('C'), ': cada oración cuenta lo que piensa otro grupo'] },
    { nivel: 3, titulo: 'La campaña de vacunación',
      enunciado: 'Pregunta 24 del simulacro. ¿Qué oración se puede agregar al final sin que el texto se contradiga?',
      datos: D_IDEA1,
      figura: fig(sim(24, ors('h', ['La posta de Lampa vacunó a todos los niños del barrio en mayo.', 'La campaña duró tres semanas.']),
        '¿Qué oración se puede agregar al final sin que el texto se contradiga?', ['En mayo, la posta no vacunó a ningún niño.', 'Dos niños del barrio se quedaron sin vacunar en mayo.', 'La campaña de mayo duró solo una semana.', 'En junio, la posta empezó a vacunar a los adultos.', 'Ningún niño del barrio fue vacunado ese año.'])),
      solucion: [
        { texto: [mala('A'), ', ', mala('B'), ' y ', mala('E'), ' niegan que ', cubre('todos los niños'), ' fueran vacunados en mayo.'] },
        { texto: [mala('C'), ' niega que ', cubre('la campaña duró tres semanas'), '.'] },
        { texto: [buena('D'), ': ', justo('junio y los adultos'), ' son otro tiempo y otro grupo.'] }],
      respuesta: [buena('D'), ': en junio, la posta empezó a vacunar a los adultos'] },
    { nivel: 3, titulo: 'La laguna congelada',
      enunciado: 'Pregunta 25 del simulacro. ¿Qué dos oraciones no pueden ser verdad a la vez?',
      datos: D_IDEA1,
      figura: fig(sim(25, ors('h', ['Esa mañana de julio, la laguna de la comunidad amaneció congelada por completo.', 'Los niños fueron a mirarla antes de ir a la escuela.', 'Después, la profesora les explicó por qué se congela el agua.', 'Esa misma mañana, unos patos nadaban por toda la laguna.']),
        '¿Qué dos oraciones no pueden ser verdad a la vez?', ['2 y 3', '1 y 2', '3 y 4', '2 y 4', '1 y 4'])),
      solucion: [
        { texto: [cubre('«Congelada por completo»'), ' no deja agua libre, y ', cubre('«los patos nadaban»'), ' la necesita, esa misma mañana.'] },
        { texto: [mala('A'), ', ', mala('B'), ', ', mala('C'), ' y ', mala('D'), ' juntan oraciones que se pueden creer a la vez.'] },
        { texto: [buena('E'), ': ', justo('la 1 y la 4'), ' chocan sin decir «no»: nadar pide agua.'] }],
      respuesta: [buena('E'), ': 1 y 4'] },
  ];

  const noContradiccion = {
    id: 'no-contradiccion',
    titulo: 'Un texto que no se contradice',
    pregunta: '¿Cuándo dos oraciones de un texto no pueden ser verdad a la vez?',
    temas: ['Principio de no contradicción'],
    pieza: 'rv-soporte',
    lee: {
      tarjetas: [
        { titulo: 'La puerta de la biblioteca', texto: 'En Ayaviri, la bibliotecaria pegó en la puerta el horario de atención, y con él los lectores deciden qué día ir. Si dos oraciones del horario chocan, nadie sabe cuándo encontrará abierta la biblioteca.',
          pieza: 'rv-soporte', dibujo: { datos: puerta1(INI1), estado: {} } },
        { titulo: 'Cohesión', texto: 'Las palabras que enlazan una oración con otra forman la cohesión: un conector como «además», un pronombre como «ella» o un nombre que se repite. Las verás de cerca en las ideas que siguen.' },
        { titulo: 'Coherencia', texto: 'La coherencia es que el texto entero tenga sentido: que sus oraciones se puedan creer juntas. Un aviso con los enlaces bien puestos puede, aun así, no tener sentido.' },
        { titulo: 'Qué mirar al jugar', texto: 'Toca cada oración del horario para cambiar los días. Busca si queda algún día en que la biblioteca abre y, a la vez, no atiende.' },
      ],
    },
    actividad: 'Arreglar el horario de la puerta de la biblioteca para que no se contradiga.',
    aprendizaje: 'Un texto se contradice si afirma y niega lo mismo, de lo mismo y a la vez; otro tiempo, persona o parte no chocan.',
    ejemplos: EJEMPLOS_1,
    juega: {
      consigna: 'La bibliotecaria de Ayaviri pegó el horario en la puerta. Sus dos primeras oraciones tienen que poder ser verdad a la vez.',
      mision: {
        texto: 'Arma un horario que no se contradiga y en el que se pueda ir el sábado.',
        logrado: listo1,
        bien: '«De lunes a sábado» y «el domingo» no chocan: ningún día abre y cierra.',
      },
      voz: '¿Queda algún día en que abre y no atiende a la vez?',
      leyenda: [
        { s: prop('naranja'), t: 'dos partes que chocan' },
        { s: cubre('turquesa'), t: 'dos partes que no chocan' },
        { s: justo('violeta'), t: 'horario sin choque que abre el sábado' },
      ],
      controles: [
        { id: 'a', etiqueta: 'Abre', opciones: ABRE1.map((x, v) => ({ valor: v, texto: x.t })) },
        { id: 'c', etiqueta: 'No atiende', opciones: CIERRA1.map((x, v) => ({ valor: v, texto: x.t })) },
      ],
      dibujo: val => ({ datos: Object.assign({ toques: { h1: 'a', h2: 'c' } }, puerta1(val)), estado: est1(val) }),
      lectura: lectura1,
      minimo: 3,
    },
    predice: {
      pregunta: 'En la misma puerta hay un aviso nuevo. ¿Se contradicen sus dos oraciones?',
      voz: 'Elige antes de ver: después lo comprobamos.',
      opciones: opciones('No: cada oración habla de un tiempo distinto', [
        ['Sí: dice «solo los sábados» y después «también los domingos»', 'RVK2', 'Los dos horarios se oponen, sí, pero uno vale hasta marzo y el otro, desde abril: en tiempos distintos no chocan.'],
        ['No: las dos oraciones hablan de la biblioteca', 'RVK3', 'Acertaste el «no», pero no por esa razón: el horario del juego también hablaba de la biblioteca, y chocaba.'],
        ['Sí: le falta un conector entre las dos', 'RVK1', 'Es cierto que no hay conector, pero eso no crea un choque: un conector une las oraciones, no cambia lo que dicen.'],
      ]),
      dibujo: AVISO1(),
      revelar: AVISO1({ f1p: 'i', f2q: 'i', f1x: 'f', f2y: 'f' }),
      coincide: 'Coincide: «hasta marzo» y «desde abril» son dos tiempos; el horario cambió, no chocó.',
    },
    mira: {
      datos: AVISO1().datos,
      voz: 'Miremos qué dice cada oración, y de cuándo.',
      pasos: [
        { estado: { marcas: { f1x: 'o', f2y: 'o' }, nuevo: ['f1x', 'f2y'] }, texto: '«Solo los sábados» y «también los domingos» parecen chocar.',
          ecuacion: [prop('solo los sábados'), ' y ', prop('también los domingos')] },
        { estado: { marcas: { f1x: 'o', f2y: 'o', f1p: 'i', f2q: 'i' }, nuevo: ['f1p', 'f2q'] }, texto: 'Pero la primera habla de hasta marzo, y la segunda, de abril en adelante.',
          ecuacion: [cubre('hasta marzo'), ' y ', cubre('desde abril'), ': dos tiempos'] },
        { estado: { marcas: { f1x: 'o', f2y: 'o', f1p: 'i', f2q: 'i' } }, texto: 'Si las dos fueran desde abril, «solo los sábados» sí chocaría con «también los domingos».',
          ecuacion: ['mismo tiempo', ' + ', 'sí y no', ' → ', { negrita: 'choque' }] },
        { estado: { marcas: { f1x: 'f', f2y: 'f', f1p: 'i', f2q: 'i' }, nuevo: ['f1x', 'f2y'] }, texto: 'Aquí no hay choque: el horario cambió de un tiempo al otro.',
          ecuacion: [justo('no se contradice')] },
      ],
    },
    regla: {
      texto: 'Un texto se contradice si afirma y niega lo mismo, de lo mismo y a la vez; un conector no lo arregla. Otro tiempo, persona o parte no chocan.',
      ecuacion: ['lo mismo', ' + ', 'a la vez', ' + ', 'sí y no', ' → ', { negrita: 'contradicción' }],
      voz: 'Antes de decir que chocan, pregunta: ¿de lo mismo y a la vez?',
      condicion: 'las dos oraciones hablan de lo mismo y de la misma parte, en el mismo momento y en boca de la misma persona.',
    },
    resuelve: {
      pieza: 'rv-soporte',
      generar(s) { return resuelveDe(RESUELVE_1[s % RESUELVE_1.length], REGLA1); },
    },
    ahoraTu: {
      pieza: 'rv-soporte',
      voz: 'Otro texto. Pregúntate de qué habla cada oración, y de cuándo.',
      generar(s) { return ahoraDe(AHORA_1, 13, s, D_IDEA1); },
    },
  };

  // ---------- Idea 2: a quién se refiere (conserva su id; etapa 9) ----------
  // Cambia: el nombre que se le une a cada pronombre del mensaje. Permanece: el mensaje de la mamá. Progresa: de
  // uniones que no concuerdan o no tienen sentido a tres uniones que se leen bien. Se reserva: la palabra que anuncia lo
  // que viene y recoge un pedido entero (predicción). Debe verse: que «lo» no va con «el horno», el nombre más cercano
  // que concuerda, sino con «el pan».
  // Objeto de la primera pantalla: un mensaje del grupo «Familia Quispe» (la mamá, para Rosa).
  // Colores: el pronombre bien unido, f; mal unido, o; el referente con sentido que se eligió, i.
  // Códigos: RV27 (el nombre más cercano), RVK4, RVK5, RVK6 (concuerda sin sentido), RVK8, RVK14 (no concuerda) y RVK15.

  // El juego: el mundo chico del mensaje. Cada palabra con su género y su número; el sentido es un dato del texto (qué
  // se pone en la canasta, qué se lleva de visita, quién espera a Rosa). El código decide concordancia y sentido.
  const NOMBRES2 = { r: { t: 'Rosa', g: 'f', n: 's' }, a: { t: 'el pan', g: 'm', n: 's' }, b: { t: 'el horno', g: 'm', n: 's' },
    c: { t: 'la canasta', g: 'f', n: 's' }, d: { t: 'la mesa', g: 'f', n: 's' }, e: { t: 'tu abuela', g: 'f', n: 's' } };
  const DONDE2 = { r: 'm1r', a: 'm1a', b: 'm1b', c: 'm1c', d: 'm1d', e: 'm3e' };
  const PRON2 = [
    { id: 'lo', t: 'lo', o: 'm2', g: 'm', n: 's', cand: ['a', 'b', 'd'], bien: 'a', por: { b: 'el horno no va a la canasta' } },
    { id: 'la', t: 'la', o: 'm3', g: 'f', n: 's', cand: ['c', 'd', 'a'], bien: 'c', por: { d: 'nadie lleva la mesa de visita' } },
    { id: 'ella', t: 'ella', o: 'm4', g: 'f', n: 's', cand: ['e', 'c', 'r'], bien: 'e', por: { c: 'una canasta no espera a nadie', r: 'a Rosa la esperan: «te»' } },
  ];
  const concuerda2 = (p, k) => NOMBRES2[k].g === p.g && NOMBRES2[k].n === p.n;
  const elegido2 = (val, p) => (val[p.id] ? p.cand[val[p.id] - 1] : null);
  const listo2 = val => PRON2.every(p => elegido2(val, p) === p.bien);
  const mensaje2 = () => papel('mensaje', 'Familia Quispe', null, 'la mamá', 'Rosa', [
    oracion('m1', '[r:Rosa], [a:el pan] está en [b:el horno], y [c:la canasta], en [d:la mesa].'),
    oracion('m2', 'Cuando esté dorado, [w:lo] pones en la canasta.'),
    oracion('m3', 'Después, [w:la] llevas a casa de [e:tu abuela].'),
    oracion('m4', '[w:Ella] te espera a las siete.'),
  ]);
  const INI2 = { lo: 0, la: 0, ella: 0 };
  const est2 = val => {
    const marcas = {};
    for (const p of PRON2) {
      const k = elegido2(val, p); if (!k) continue;
      const ok = k === p.bien;
      marcas[`${p.o}w`] = ok ? 'f' : 'o';
      if (marcas[DONDE2[k]] !== 'i') marcas[DONDE2[k]] = ok ? 'i' : 'o';
    }
    return { marcas };
  };
  const lectura2 = val => {
    if (listo2(val)) return [justo('Tres uniones con sentido'), ': el pan, la canasta y la abuela'];
    for (const p of PRON2) {
      const k = elegido2(val, p);
      if (!k || k === p.bien) continue;
      const par = `«${may(p.t)}» y «${NOMBRES2[k].t}»`;
      return concuerda2(p, k) ? [prop(par), ` concuerdan; ${p.por[k]}`] : [prop(par), ' no concuerdan'];
    }
    const b = PRON2.filter(p => elegido2(val, p) === p.bien).length;
    return b ? [cubre(`${b} de 3 bien unidos`), '; faltan los demás'] : ['Toca una oración y une su pronombre con un nombre del mensaje'];
  };

  // La predicción: «esto» anuncia lo que viene y recoge el pedido entero. El juego solo mostró pronombres que retoman un
  // nombre dicho antes.
  const COMUNICADO2 = marcas => ({ datos: papel('mural', 'Mural del colegio', 'Comunicado', 'la Dirección', 'todas las secciones', [
    oracion('f1', 'La directora pidió [w:esto]: [p:cada sección dejará su aula limpia antes de salir].'),
    { id: 'f2', t: 'El lunes se revisarán todas las aulas.' },
  ]), estado: marcas ? { marcas } : {} });

  // Los Datos de la idea: los criterios para hallar un referente (contrato, punto 13).
  const D_REFERENTE = 'Referente: aquello que nombra un pronombre como «lo», «ella» o «esto».';
  const D_CONCUERDA = 'Concordancia: el pronombre y su referente tienen el mismo género y el mismo número.';
  const D_SENTIDO = 'Con el referente puesto en lugar del pronombre, la oración tiene que tener sentido.';
  const D_ANA_CATA = 'Anáfora: retoma algo dicho antes. Catáfora: anuncia algo que se dice después.';
  const D_IDEA2 = [D_REFERENTE, D_CONCUERDA, D_SENTIDO, D_ANA_CATA];

  // «Así se resuelve»: la buena es D, B, A y E (cada letra cuatro veces en las 20 hojas de la unidad).
  const REGLA2 = 'El referente concuerda con el pronombre y, puesto en su lugar, da sentido a la oración; no siempre es el nombre más cercano. Puede estar antes o después, y puede ser una idea entera.';
  const RESUELVE_2 = [
    { sop: sim(9, ors('h', ['Don Julio llegó a la feria de Lampa con su hijo y [p:un costal de papas].', 'Antes del mediodía, ya [w:lo] había vendido.']),
      '¿A qué se refiere «lo» en la oración 2?', ['A don Julio', 'A su hijo', 'A la feria de Lampa', 'Al costal de papas', 'Al mediodía']), buena: 'D',
      pide: 'Piden qué nombra «lo» en la oración 2.', datos: D_IDEA2,
      tengo: ['«Lo había vendido»: se busca algo masculino y singular que se pueda vender, como ', cubre('un costal de papas'), '.'],
      malas: [mala('C'), ' no concuerda: «la feria» es femenino. ', mala('A'), ' y ', mala('B'), ' concuerdan, pero nadie vende a una persona. ', mala('E'), ' es un momento, no algo que se vende.'],
      bien: [buena('D'), ': ', justo('el costal de papas'), ' concuerda y se puede vender todo.'],
      sentido: 'Relee con el referente: antes del mediodía ya había vendido el costal de papas.' },
    { sop: sim(10, ors('h', ['Para la excursión a Sillustani, cada alumno traerá [w:esto]: [p:una casaca, agua y un gorro].', 'El bus saldrá a las siete.']),
      '¿A qué se refiere «esto» en la oración 1?', ['A la excursión', 'A la casaca, el agua y el gorro', 'Al bus que saldrá a las siete de la mañana', 'A cada alumno', 'A Sillustani']), buena: 'B',
      pide: 'Piden qué nombra «esto» en la oración 1.', datos: D_IDEA2,
      tengo: ['Después de los dos puntos viene lo que cada alumno traerá: ', cubre('una casaca, agua y un gorro'), '.'],
      malas: [mala('A'), ' y ', mala('E'), ' son a dónde se va, no lo que se trae. ', mala('C'), ' está en otra oración, después del punto. ', mala('D'), ' es quien trae, no lo traído.'],
      bien: [buena('B'), ': ', justo('la casaca, el agua y el gorro'), ', lo que sigue a los dos puntos.'],
      sentido: 'Relee: cada alumno traerá una casaca, agua y un gorro. «Esto» es una catáfora.' },
    { sop: sim(11, ors('h', ['En la asamblea, [p:los padres pidieron más horas de inglés].', 'La directora aceptó [w:eso] de inmediato.']),
      '¿A qué se refiere «eso» en la oración 2?', ['Al pedido de más horas de inglés', 'A los padres de familia', 'A la asamblea que se hizo en el colegio', 'Al curso de inglés', 'A la directora']), buena: 'A',
      pide: 'Piden qué nombra «eso» en la oración 2.', datos: D_IDEA2,
      tengo: [cubre('«Pidieron más horas de inglés»'), ': lo que se acepta es un pedido.'],
      malas: [mala('B'), ', ', mala('C'), ' y ', mala('E'), ' no se aceptan: son personas o una reunión. ', mala('D'), ' no basta: el curso ya existía, y lo que se aceptó fue tener más horas.'],
      bien: [buena('A'), ': «eso» recoge ', justo('el pedido entero'), ', no un solo nombre.'],
      sentido: 'Relee: la directora aceptó de inmediato el pedido de más horas de inglés.' },
    { sop: sim(12, ors('h', ['[p:Rosa] le prestó [q:su calculadora] a Pedro.', '[w:Él] [x:la] devolvió al día siguiente.']),
      '¿A qué se refieren «él» y «la» en la oración 2?', ['Él, a Pedro; la, a Rosa', 'Él, a Rosa; la, a la calculadora', 'Él, a la calculadora; la, a Rosa', 'Él, a Pedro; la, al día siguiente', 'Él, a Pedro; la, a la calculadora']), buena: 'E',
      pide: 'Piden el referente de «él» y el de «la».', datos: D_IDEA2,
      tengo: ['«Él» pide un masculino: solo Pedro. «La» pide un femenino que se devuelve: ', cubre('su calculadora'), '.'],
      malas: [mala('B'), ' y ', mala('C'), ' no concuerdan con «él». ', 'En ', mala('A'), ', Rosa concuerda con «la», pero a una persona no se la devuelve. ', mala('D'), ': «al día siguiente» no concuerda con «la».'],
      bien: [buena('E'), ': ', justo('Pedro'), ' devolvió ', justo('la calculadora'), '.'],
      sentido: 'Relee con los dos: Pedro devolvió la calculadora al día siguiente.', marcas: ['h1q'] },
  ];

  // «Ahora tú»: seis casos de cuatro opciones; cada parte de la regla (concordancia, sentido, el más cercano, la
  // catáfora, la idea entera). Dos incorrectas no comparten código.
  const AHORA_2 = [
    { o: ['El perro persiguió [p:al gato] hasta el techo.', 'Allí, [w:este] se quedó quieto, a salvo.'], pregunta: '¿A qué se refiere «este»?', ok: 'Al gato, que huía del perro',
      por: 'Quedarse «a salvo» va con el que huía, y el que huía es el gato.',
      m: [['Al techo, el último nombrado', 'RV27', 'El techo es el último nombre antes de «este», es cierto, pero «allí» ya es el techo, y un techo no se pone a salvo.'],
        ['Al perro, que lo perseguía', 'RVK6', 'El perro concuerda con «este», sí, pero él perseguía: el que se queda a salvo es el perseguido.'],
        ['A nadie: debió repetir el nombre', 'RVK8', 'Sí, repetir «el gato» también serviría, pero no hace falta: «este» ya retoma al gato sin duda.']] },
    { o: ['[p:Lucía] recibió la casaca de Ana porque [w:ella] tenía mucho frío.'], pregunta: '¿A qué se refiere «ella»?', ok: 'A Lucía',
      por: 'Quien tiene frío es quien recibe la casaca: Lucía.',
      m: [['A Ana', 'RV27', 'Es cierto que Ana es el nombre más cercano, pero ella dio la casaca: quien la recibe por tener frío es otra persona.'],
        ['A la casaca', 'RVK6', '«La casaca» concuerda con «ella», es cierto, pero una casaca no tiene frío.'],
        ['No se sabe: debió repetir el nombre', 'RVK8', 'Sí, repetir el nombre ayudaría, pero no hace falta: el sentido ya dice quién tenía frío.']] },
    { o: ['Solo te pido [w:esto]: [p:llega temprano mañana].'], pregunta: '¿A qué se refiere «esto»?', ok: 'Al pedido que sigue: llegar temprano',
      por: '«Esto» anuncia lo que viene después de los dos puntos: el pedido entero.',
      m: [['A mañana, la última palabra del pedido', 'RVK5', 'Miraste bien hacia adelante, pero «esto» no nombra solo «mañana»: recoge el pedido entero.'],
        ['A algo dicho antes', 'RVK4', 'Muchas veces el referente está antes, sí, pero aquí no hay nada antes de «esto»: lo pedido viene después.'],
        ['A ti, a quien se le pide', 'RVK6', 'Es cierto que el texto te nombra con «te», pero tú eres a quien se le pide, no lo que se pide.']] },
    { o: ['Mi abuela sembró [p:papa] en la chacra.', 'Después, [w:la] cosechó en mayo.'], pregunta: '¿A qué se refiere «la»?', ok: 'A la papa sembrada',
      por: 'Lo que se siembra y después se cosecha es la papa.',
      m: [['A la chacra', 'RV27', '«La chacra» concuerda con «la», es cierto, pero una chacra no se cosecha.'],
        ['A mi abuela', 'RVK6', '«Mi abuela» concuerda con «la», sí, pero ella es quien cosecha, no lo cosechado.'],
        ['A lo que viene después: mayo', 'RVK15', 'Bien que mires adelante, pero «mayo» no concuerda con «la», y «la» no anuncia nada: retoma algo ya dicho.']] },
    { o: ['Carlos visitó a [p:su abuelo] en el hospital.', '[w:Lo] encontró mucho mejor.'], pregunta: '¿A qué se refiere «Lo»?', ok: 'A su abuelo',
      por: 'El que estaba en el hospital y mejoró es el abuelo.',
      m: [['Al hospital', 'RV27', 'Es cierto que «el hospital» concuerda con «lo», pero un hospital no puede estar mejor de salud.'],
        ['A Carlos', 'RVK6', 'Carlos concuerda con «lo», es cierto, pero él es quien encontró a alguien, no a quien encontraron.'],
        ['A lo que viene después', 'RVK15', 'Bien que mires adelante, pero después de «lo» no viene nadie nuevo: «lo» retoma a alguien ya nombrado.']] },
    { o: ['[p:El municipio cerró el mercado por una semana].', '[w:Eso] molestó a los comerciantes.'], pregunta: '¿A qué se refiere «Eso»?', ok: 'A que cerraran el mercado una semana',
      por: 'Lo que molestó es el hecho entero: el cierre por una semana.',
      m: [['Al mercado', 'RVK5', 'El mercado está en el texto, sí, pero no fue el mercado lo que molestó: molestó que lo cerraran.'],
        ['A una semana', 'RV27', 'Es cierto que «una semana» es lo último que se nombró, pero una semana sola no molesta a nadie.'],
        ['Al municipio, que fue el que decidió el cierre', 'RVK6', 'El municipio hizo algo, es cierto, pero «eso» no nombra al que lo hizo: nombra lo que hizo.']] },
  ];

  // Ejemplos resueltos de la idea 2. Nivel 1: un paso (qué nombra un pronombre, si mira atrás o adelante). Nivel 2: tres
  // nombres de una lista. Nivel 3: la hoja de simulacro; las correctas son A, B, C, D y E. Revisado aparte (scratchpad
  // e9-verbal/rev/revisa.js): una tabla de género, número y sentido decide el referente; solo una alternativa cumple.
  const EJEMPLOS_2 = [
    { nivel: 1, titulo: 'El queso de la tía',
      enunciado: '¿A qué se refiere «Lo» en la nota de la refrigeradora?',
      datos: [D_REFERENTE, D_CONCUERDA],
      figura: fig(papel('cuaderno', 'Nota en la refrigeradora', null, 'la tía Rosa', 'la familia', ors('k', ['Compré queso en la feria.', '[w:Lo] guardé en la refrigeradora.']))),
      solucion: [{ texto: ['«Lo» pide un masculino singular: ', cubre('el queso'), '. «La feria» es femenino.'] }],
      respuesta: [justo('Al queso')] },
    { nivel: 1, titulo: 'La carta de Julia',
      enunciado: '¿A qué se refiere «Él» en el mensaje de Julia?',
      datos: [D_REFERENTE, D_CONCUERDA],
      figura: fig(papel('mensaje', 'Primos Mamani', null, 'Julia', 'los primos', ors('k', ['Le escribí una carta a mi abuelo.', '[w:Él] la leyó dos veces.']))),
      solucion: [{ texto: ['«Él» es masculino: solo ', cubre('mi abuelo'), ' concuerda. Además, una carta no lee: alguien la lee.'] }],
      respuesta: [justo('A mi abuelo')] },
    { nivel: 1, titulo: 'Una cosa importante',
      enunciado: '¿«Una cosa» retoma algo dicho antes o anuncia lo que viene?',
      datos: [D_ANA_CATA],
      figura: fig(papel('mensaje', 'Delegados de 5.º', null, 'el delegado', 'los compañeros', ors('k', ['Les digo [w:una cosa]: [p:mañana no hay clases].']))),
      solucion: [{ texto: ['Antes no hay nada que decir; después de los dos puntos viene ', cubre('lo que se dice'), '.'] }],
      respuesta: [justo('Anuncia lo que viene'), ': es una catáfora'] },
    { nivel: 1, titulo: 'El examen del profesor',
      enunciado: '¿Por qué «lo» no se refiere al escritorio, que es el nombre más cercano?',
      datos: [D_REFERENTE, D_CONCUERDA, D_SENTIDO],
      figura: fig(papel('cuaderno', 'Cuaderno de Mateo', null, 'Mateo', 'su diario', ors('k', ['El profesor dejó el examen sobre el escritorio y [w:lo] revisó con lapicero rojo.']))),
      solucion: [{ texto: ['Los dos concuerdan, pero ', cubre('se revisa con lapicero'), ' un examen, no un escritorio.'] }],
      respuesta: [justo('Porque no tiene sentido'), ': lo revisado es el examen'] },
    { nivel: 1, titulo: 'La lluvia y el partido',
      enunciado: '¿A qué se refiere «Eso» en el mensaje?',
      datos: [D_REFERENTE, D_SENTIDO],
      figura: fig(papel('mensaje', 'Club de fútbol', null, 'el entrenador', 'el equipo', ors('k', ['[p:Ayer llovió toda la tarde].', '[w:Eso] arruinó el partido.']))),
      solucion: [{ texto: ['Lo que arruinó el partido es un hecho entero: ', cubre('que lloviera toda la tarde'), '.'] }],
      respuesta: [justo('A que lloviera toda la tarde')] },

    { nivel: 2, titulo: 'La carga de leña',
      enunciado: '¿A qué se refiere «la»: «el cerro por donde iba el burro», «la carga de leña» o «la casa»?',
      datos: [D_REFERENTE, D_CONCUERDA, D_SENTIDO],
      figura: fig(papel('cuaderno', 'Cuaderno de Comunicación', 'Mi viaje al campo', 'Elvis', 'la profesora', ors('k', ['El burro llevaba la carga de leña por el cerro.', 'Al llegar, [w:la] dejamos junto a la casa.']))),
      solucion: [
        { texto: [prop('«El cerro»'), ' no concuerda: es masculino.'] },
        { texto: ['«La casa» concuerda, pero no se deja junto a sí misma; ', cubre('la carga'), ' sí se deja.'] }],
      respuesta: [justo('«La carga de leña»')] },
    { nivel: 2, titulo: 'Las llamas del tío',
      enunciado: '¿A qué se refiere «Las»: «el tío Julián, que cría animales», «noviembre» o «las llamas y las ovejas»?',
      datos: [D_REFERENTE, D_CONCUERDA],
      figura: fig(papel('folleto', 'Folleto de la feria ganadera', 'Criadores de Macusani', 'la asociación', 'los visitantes', ors('k', ['El tío Julián cría llamas y ovejas.', '[w:Las] esquila cada año en noviembre.']))),
      solucion: [
        { texto: ['«Las» es femenino y plural. ', prop('«El tío Julián»'), ' y ', prop('«noviembre»'), ' son masculinos y singulares.'] },
        { texto: ['Lo que se esquila son ', cubre('las llamas y las ovejas'), '.'] }],
      respuesta: [justo('«Las llamas y las ovejas»')] },
    { nivel: 2, titulo: 'El horario de invierno',
      enunciado: '¿A qué se refiere «lo siguiente»: «solo el día, el lunes», «algo que ya se les dijo en la reunión de padres» o «que el lunes empieza el horario de invierno»?',
      datos: [D_REFERENTE, D_ANA_CATA],
      figura: fig(papel('puerta', 'Puerta de la dirección', 'Aviso', 'la directora', 'las familias', ors('k', ['Les aviso [w:lo siguiente]: [p:el lunes empieza el horario de invierno].']))),
      solucion: [
        { texto: ['«Lo siguiente» anuncia lo que viene: ', cubre('todo lo que sigue a los dos puntos'), '.'] },
        { texto: [prop('«El lunes»'), ' es solo una parte, y antes de los dos puntos no se dijo nada.'] }],
      respuesta: [justo('«Que el lunes empieza el horario de invierno»')] },
    { nivel: 2, titulo: 'La vecina enferma',
      enunciado: '¿A qué se refiere «ella»: «la vecina», «doña Carmen» o «la sopa»?',
      datos: [D_REFERENTE, D_CONCUERDA, D_SENTIDO],
      figura: fig(papel('cuaderno', 'Cuaderno de Comunicación', 'Una buena vecina', 'Gabriela', 'la profesora', ors('k', ['Doña Carmen le llevó sopa a la vecina porque [w:ella] estaba enferma.']))),
      solucion: [
        { texto: ['Las tres concuerdan. Se lleva sopa a quien ', cubre('está enferma'), ': la vecina.'] },
        { texto: [prop('«Doña Carmen»'), ' es quien lleva; ', prop('una sopa'), ' no se enferma.'] }],
      respuesta: [justo('«La vecina»')] },
    { nivel: 2, titulo: 'El examen de admisión',
      enunciado: '¿A qué se refiere «lo»: «Luis», «la buena nota que sacó Luis» o «el examen de admisión»?',
      datos: [D_REFERENTE, D_CONCUERDA, D_SENTIDO],
      figura: fig(papel('mensaje', 'Promoción 2026', null, 'la delegada', 'la promoción', ors('k', ['Luis dio el examen de admisión y [w:lo] aprobó con buena nota.']))),
      solucion: [
        { texto: [prop('«La buena nota»'), ' no concuerda. ', prop('«Luis»'), ' concuerda, pero es quien aprueba.'] },
        { texto: ['Lo que se aprueba es ', cubre('el examen'), '.'] }],
      respuesta: [justo('«El examen de admisión»')] },

    { nivel: 3, titulo: 'La maqueta del lago',
      enunciado: 'Pregunta 21 del simulacro. ¿A qué se refiere «la» en la oración 3?',
      datos: D_IDEA2,
      figura: fig(sim(21, ors('h', ['La profesora Ruth llevó a sus alumnos al museo de Puno.', 'Allí, un guía les mostró una maqueta del lago.', 'Ellos [w:la] tocaron con cuidado para no romperla.']),
        '¿A qué se refiere «la» en la oración 3?', ['A la maqueta del lago', 'A la profesora Ruth', 'Al museo de Puno', 'A la visita guiada por el museo', 'Al guía del museo'])),
      solucion: [
        { texto: [mala('C'), ' y ', mala('E'), ' no concuerdan. ', mala('D'), ' no está en el texto.'] },
        { texto: [mala('B'), ' concuerda, pero ', cubre('«para no romperla»'), ' habla de un objeto.'] },
        { texto: [buena('A'), ': ', justo('la maqueta'), ' es lo que se toca con cuidado.'] }],
      respuesta: [buena('A'), ': a la maqueta del lago'] },
    { nivel: 3, titulo: 'El afiche de la feria',
      enunciado: 'Pregunta 22 del simulacro. ¿A qué se refiere «lo» en la oración 3?',
      datos: D_IDEA2,
      figura: fig(sim(22, ors('h', ['Los delegados prepararon un afiche para la feria.', 'Lo pegaron en la puerta de la escuela.', 'Así, todos los padres [w:lo] vieron al llegar.']),
        '¿A qué se refiere «lo» en la oración 3?', ['A los delegados', 'Al afiche pegado', 'A la escuela', 'A la feria', 'A todos los padres'])),
      solucion: [
        { texto: [mala('A'), ' y ', mala('E'), ' son plurales. ', mala('C'), ' y ', mala('D'), ' son femeninos.'] },
        { texto: [cubre('«Así»'), ' dice que lo vieron porque estaba pegado en la puerta. ', buena('B'), ': ', justo('el afiche'), '.'] }],
      respuesta: [buena('B'), ': al afiche pegado'] },
    { nivel: 3, titulo: 'El wifi de la plaza',
      enunciado: 'Pregunta 23 del simulacro. ¿A qué se refiere «esto» en la oración 1?',
      datos: D_IDEA2,
      figura: fig(sim(23, ors('h', ['El alcalde anunció [w:esto]: la plaza de Ayaviri tendrá wifi gratis desde julio.', 'Los jóvenes celebraron el anuncio.']),
        '¿A qué se refiere «esto» en la oración 1?', ['Al alcalde de Ayaviri', 'A los jóvenes', 'A que la plaza tendrá wifi gratis', 'A algo que el alcalde anunció antes', 'Al mes de julio'])),
      solucion: [
        { texto: [mala('A'), ' es quien anuncia; ', mala('B'), ', quienes celebran.'] },
        { texto: [mala('D'), ' busca atrás, y antes no hay nada. ', mala('E'), ' es solo una parte.'] },
        { texto: [buena('C'), ': «esto» anuncia ', justo('lo que sigue a los dos puntos'), '.'] }],
      respuesta: [buena('C'), ': a que la plaza tendrá wifi gratis'] },
    { nivel: 3, titulo: 'El viaje de promoción',
      enunciado: 'Pregunta 24 del simulacro. ¿A qué se refiere «Eso» en la oración 2?',
      datos: D_IDEA2,
      figura: fig(sim(24, ors('h', ['Este año, el colegio no organizó el viaje de promoción.', '[w:Eso] entristeció a los alumnos de quinto.']),
        '¿A qué se refiere «Eso» en la oración 2?', ['Al colegio', 'Al viaje de promoción', 'A los alumnos de quinto de secundaria', 'A que no hubiera viaje de promoción', 'A este año'])),
      solucion: [
        { texto: [mala('A'), ' y ', mala('E'), ' no entristecen por sí solos. ', mala('C'), ' nombra a los que se entristecen.'] },
        { texto: [mala('B'), ': el viaje no entristece; entristece ', cubre('que no se organizara'), '.'] },
        { texto: [buena('D'), ': «eso» recoge ', justo('el hecho entero'), '.'] }],
      respuesta: [buena('D'), ': a que no hubiera viaje de promoción'] },
    { nivel: 3, titulo: 'La chompa de Mariela',
      enunciado: 'Pregunta 25 del simulacro. ¿A qué se refieren «Él» y «la» en la oración 2?',
      datos: D_IDEA2,
      figura: fig(sim(25, ors('h', ['Mariela le regaló una chompa a su hermano.', '[w:Él] se [x:la] puso para ir al colegio.']),
        '¿A qué se refieren «Él» y «la» en la oración 2?', ['Él, a Mariela; la, a la chompa', 'Él, al hermano; la, a Mariela', 'Él, al colegio; la, a la chompa', 'Él, al hermano; la, al colegio', 'Él, al hermano; la, a la chompa'])),
      solucion: [
        { texto: [mala('A'), ': Mariela no concuerda con «él». ', mala('D'), ': el colegio no concuerda con «la».'] },
        { texto: [mala('B'), ': a Mariela no se la pone nadie. ', mala('C'), ': un colegio no se pone ropa.'] },
        { texto: [buena('E'), ': ', justo('el hermano'), ' se puso ', justo('la chompa'), '.'] }],
      respuesta: [buena('E'), ': él, al hermano; la, a la chompa'] },
  ];

  const referencia = {
    id: 'referente',
    titulo: 'A quién se refiere',
    pregunta: '¿Cómo sabes a qué se refiere «lo», «ella» o «esto»?',
    temas: ['Anáfora y catáfora'],
    pieza: 'rv-soporte',
    lee: {
      tarjetas: [
        { titulo: 'El mensaje de la mamá', texto: 'La mamá de Rosa le dejó un encargo en el grupo de la familia. Para cumplirlo, Rosa tiene que saber qué nombra cada «lo», «la» y «ella» del mensaje.',
          pieza: 'rv-soporte', dibujo: { datos: mensaje2(), estado: {} } },
        { titulo: 'Pronombre y referente', texto: 'Un pronombre como «lo», «la» o «ella» ocupa el lugar de un nombre para no repetirlo. Lo que nombra se llama su referente.' },
        { titulo: 'Concordancia', texto: 'Un pronombre y su referente concuerdan: tienen el mismo género (masculino o femenino) y el mismo número (singular o plural). «Las» va con «las semillas»; «él», con «Luis».' },
        { titulo: 'Qué mirar al jugar', texto: 'Toca cada oración para unir su pronombre con un nombre del mensaje. Lee la oración con ese nombre en su lugar: ¿se entiende el encargo?' },
      ],
    },
    actividad: 'Unir cada pronombre del mensaje de la mamá con lo que nombra.',
    aprendizaje: 'El referente concuerda con el pronombre y da sentido; no siempre es el más cercano, y puede venir después o ser una idea entera.',
    ejemplos: EJEMPLOS_2,
    juega: {
      consigna: 'La mamá de Rosa le dejó un encargo. Los pronombres van en negrita, y cada uno nombra algo del mensaje.',
      mision: {
        texto: 'Une cada pronombre del mensaje con lo que nombra.',
        logrado: listo2,
        bien: '«Lo» va con el pan, aunque «el horno» esté más cerca y concuerde.',
      },
      voz: '¿Concuerdan? Y con ese nombre en su lugar, ¿tiene sentido?',
      leyenda: [
        { s: 'negrita', t: 'el pronombre' },
        { s: prop('naranja'), t: 'unión que no concuerda o no tiene sentido' },
        { s: cubre('turquesa'), t: 'el nombre elegido, si concuerda y tiene sentido' },
        { s: justo('violeta'), t: 'el pronombre, ya unido a ese nombre' },
      ],
      controles: PRON2.map(p => ({ id: p.id, etiqueta: `«${p.t}»`, opciones: [{ valor: 0, texto: HUECO }].concat(p.cand.map((k, v) => ({ valor: v + 1, texto: NOMBRES2[k].t }))) })),
      dibujo: val => ({ datos: Object.assign({ toques: { m2: 'lo', m3: 'la', m4: 'ella' } }, mensaje2()), estado: est2(val) }),
      lectura: lectura2,
      minimo: 3,
    },
    predice: {
      pregunta: 'En el mural del colegio hay un comunicado. ¿A qué se refiere «esto»?',
      voz: 'Elige antes de ver: después lo comprobamos.',
      opciones: opciones('A todo el pedido que sigue a los dos puntos', [
        ['A la directora, que se nombra justo antes', 'RV27', 'La directora es el nombre más cercano, sí, pero ella es quien pide: «esto» nombra lo que pidió.'],
        ['A algo que se dijo antes, en otro comunicado', 'RVK4', 'Es cierto que en el juego el referente estaba antes, pero aquí no hay otro comunicado: lo pedido viene después de los dos puntos.'],
        ['Al aula, que se nombra después', 'RVK5', 'Miraste bien hacia adelante, pero «esto» no nombra solo el aula: recoge el pedido entero.'],
      ]),
      dibujo: COMUNICADO2(),
      revelar: COMUNICADO2({ f1w: 'f', f1p: 'i' }),
      coincide: 'Coincide: «esto» anuncia lo que viene, y aquí recoge el pedido entero.',
    },
    mira: {
      datos: COMUNICADO2().datos,
      voz: 'Busquemos qué se pidió: antes y después de «esto».',
      pasos: [
        { estado: { marcas: { f1w: 'o' }, nuevo: ['f1w'] }, texto: 'Antes de «esto» solo está la directora: ella pide, no es lo pedido.',
          ecuacion: ['antes: ', prop('la directora'), ', quien pide'] },
        { estado: { marcas: { f1w: 'o', f1p: 'i' }, nuevo: ['f1p'] }, texto: 'Después de los dos puntos viene lo pedido, entero.',
          ecuacion: [{ negrita: 'esto' }, ' → ', cubre('cada sección deja su aula limpia')] },
        { estado: { marcas: { f1w: 'o', f1p: 'i' } }, texto: 'La palabra que retoma lo dicho es una anáfora; la que anuncia lo que viene, una catáfora.',
          ecuacion: [{ negrita: 'anáfora' }, ': mira atrás; ', { negrita: 'catáfora' }, ': mira adelante'] },
        { estado: { marcas: { f1w: 'f', f1p: 'i' }, nuevo: ['f1w'] }, texto: 'Aquí «esto» es catáfora, y su referente es una oración entera.',
          ecuacion: [justo('esto'), ' → ', justo('todo el pedido')] },
      ],
    },
    regla: {
      texto: 'El referente concuerda con el pronombre y, puesto en su lugar, da sentido a la oración; no siempre es el nombre más cercano. Puede estar antes (anáfora) o después (catáfora), y puede ser una idea entera.',
      ecuacion: [cubre('referente'), ': concuerda + tiene sentido'],
      voz: 'Pon el referente en lugar del pronombre y relee.',
      condicion: 'al poner el referente en lugar del pronombre, la oración se lee bien y tiene sentido.',
    },
    resuelve: {
      pieza: 'rv-soporte',
      generar(s) { return resuelveDe(RESUELVE_2[s % RESUELVE_2.length], REGLA2); },
    },
    ahoraTu: {
      pieza: 'rv-soporte',
      voz: 'Otro texto. Prueba cada nombre en lugar del pronombre.',
      generar(s) { return ahoraDe(AHORA_2, 13, s, D_IDEA2); },
    },
  };

  // ---------- Idea 3: repetir, sustituir o callar (conserva su id; etapa 9) ----------
  // Cambia: cómo se vuelve a nombrar a la vicuña en las oraciones 2 y 4. Permanece: el folleto y el guardaparque de la
  // oración 3. Progresa: de repetir a sustituir y a callar. Se reserva: lo callado es un verbo (predicción). Debe verse:
  // que callar sirve en la 2 (justo antes se habló de la vicuña) y no en la 4 (justo antes se habló del guardaparque).
  // Objeto de la primera pantalla: el folleto del club de ciencias, para los visitantes de la feria.
  // Colores: lo que se recupera bien, i; el espacio que recupera a otro, o; las dos formas de la misión cumplida, f.
  // Códigos: RV27, RVK6, RVK7, RVK8, RVK14, RVK16 (callar cambia de quién se habla) y RVK17 (un sustituto que no le
  // corresponde).

  // El juego: tres formas de nombrar (repetir, sustituir, callar). Callar recupera a quien hizo algo en la oración de
  // justo antes: la vicuña en la 1, el guardaparque en la 3. El código decide de quién se habla.
  const FORMAS3 = [{ t: 'La vicuña', b: 'repetir' }, { t: 'Este animal', b: 'sustituir' }, { t: '[ ]', b: 'callar' }];
  const ANTES3 = { s1: 'v', s2: 'g' };          // quién hizo algo en la oración de justo antes
  const de3 = (val, s) => (val[s] === 2 ? ANTES3[s] : 'v');
  const listo3 = val => de3(val, 's1') === 'v' && de3(val, 's2') === 'v' && [val.s1, val.s2].sort().join() === '1,2';
  const folleto3 = val => papel('folleto', 'Feria de ciencias del colegio', 'La vicuña', 'el club de ciencias', 'los visitantes', [
    oracion('v1', '[v:La vicuña] vive en la puna, sobre los cuatro mil metros.'),
    oracion('v2', '[w:La vicuña] come el ichu de los cerros.', { w: FORMAS3[val.s1].t }, { w: 'Este animal' }),
    oracion('v3', '[g:Un guardaparque] la cuida de los cazadores.'),
    oracion('v4', '[w:La vicuña] recorre los cerros todo el día.', { w: FORMAS3[val.s2].t }, { w: 'Este animal' }),
  ]);
  const INI3 = { s1: 0, s2: 0 };
  const est3 = val => {
    const marcas = {};
    for (const [s, o] of [['s1', 'v2'], ['s2', 'v4']]) {
      const ok = de3(val, s) === 'v';
      marcas[`${o}w`] = listo3(val) ? 'f' : ok ? 'i' : 'o';
      if (!ok) marcas.v3g = 'o';
    }
    if (de3(val, 's1') === 'v' || de3(val, 's2') === 'v') marcas.v1v = 'i';
    return { marcas };
  };
  const lectura3 = val => {
    if (listo3(val)) return [justo('Elipsis en la 2 y sustitución en la 4'), ': siempre es la vicuña'];
    if (de3(val, 's2') === 'g') return [prop('Si callas en la 4'), ', el lector recupera «un guardaparque»'];
    if (val.s1 === val.s2) return [cubre(`Las dos oraciones ${val.s1 ? 'sustituyen' : 'repiten'} el nombre`), '; prueba dos formas distintas'];
    return [cubre('Siempre se habla de la vicuña'), `: ${FORMAS3[val.s1].b} y ${FORMAS3[val.s2].b}`];
  };

  // La predicción: lo que se calla es un verbo. El juego solo calló quién hace algo.
  const FERIA3 = (w, marcas) => ({ datos: papel('cartel', 'Cartel de un puesto de la feria de Juliaca', 'Puesto 14', 'la familia Condori', 'los clientes', [
    oracion('f1', `En nuestro puesto, mi tía [p:vende] papa; mi mamá, ${w ? '[w:(vende)] ' : ''}chuño.`),
    { id: 'f2', t: 'Atendemos los sábados desde las seis.' },
  ]), estado: marcas ? { marcas } : {} });

  // Los Datos de la idea: las tres formas de volver a nombrar algo (contrato, punto 13).
  const D_REPITE = 'Repetición: se vuelve a nombrar algo con la misma palabra.';
  const D_SUSTITUYE = 'Sustitución: se nombra con un pronombre, con otro nombre o con uno más general.';
  const D_CALLA = 'Elipsis: se calla algo ya dicho; el lector lo recupera de lo dicho justo antes.';
  const D_IDEA3 = [D_REPITE, D_SUSTITUYE, D_CALLA];

  // «Así se resuelve»: la buena es E, C, D y A (cada letra cuatro veces en las 20 hojas de la unidad).
  const REGLA3 = 'Lo dicho se repite, se sustituye o se calla; lo callado se recupera de lo dicho justo antes, y el verbo va en la persona y el número de quien hace la acción.';
  const RESUELVE_3 = [
    { sop: sim(9, ors('h', ['Mi abuelo me tejió [p:un chullo] de alpaca.', '[w:Lo] uso todas las mañanas para ir al colegio.']),
      '¿Qué recurso usa la oración 2 para volver a nombrar el chullo?', ['Repetición: dice «chullo» otra vez', 'Elipsis: calla la palabra «chullo»', 'Sustitución por una palabra más general', 'No lo vuelve a nombrar', 'Sustitución por un pronombre']), buena: 'E',
      pide: 'Piden con qué forma la oración 2 vuelve a nombrar el chullo.', datos: D_IDEA3,
      tengo: ['«Lo» ocupa el lugar de ', cubre('«un chullo»'), ': es un pronombre.'],
      malas: [mala('A'), ': «chullo» no se repite. ', mala('B'), ' y ', mala('D'), ': sí se nombra, con «lo». ', mala('C'), ': «lo» no es un nombre más general.'],
      bien: [buena('E'), ': ', justo('sustitución por un pronombre'), '.'],
      sentido: 'Relee con el nombre: uso el chullo todas las mañanas. «Lo» lo retoma sin repetirlo.' },
    { sop: sim(10, ors('h', ['En la fiesta de Juliaca, los varones [p:bailaron] diablada.', 'Las mujeres, morenada.']),
      '¿Qué palabra se calló en la oración 2?', ['la diablada', 'los varones', 'bailaron', 'ninguna: la oración está incompleta', 'Juliaca']), buena: 'C',
      pide: 'Piden la palabra que la oración 2 calla después de «Las mujeres».', datos: D_IDEA3,
      tengo: ['La coma de la oración 2 marca el lugar de lo callado; justo antes se dijo ', cubre('«bailaron»'), '.'],
      malas: [mala('A'), ' es lo que bailaron los varones; ', mala('B'), ' son otras personas. ', mala('D'), ': callar no es una falta. ', mala('E'), ' es el lugar.'],
      bien: [buena('C'), ': las mujeres ', justo('bailaron'), ' morenada.'],
      sentido: 'Relee completando: las mujeres bailaron morenada. Se entiende sin repetir el verbo.' },
    { sop: sim(11, ors('h', ['[p:El cóndor andino] vuela sobre el cañón del Colca.', '[w:¿…?] puede planear horas sin mover las alas.']),
      '¿Qué expresión puede ir en el espacio sin cambiar de quién se habla?', ['El cañón del Colca', 'Este pez', 'Ellas', 'Esta ave', 'El Colca']), buena: 'D',
      pide: 'Piden una forma de volver a nombrar al cóndor.', datos: D_IDEA3,
      tengo: ['Lo que planea sin mover las alas es ', cubre('el cóndor andino'), '.'],
      malas: [mala('A'), ' y ', mala('E'), ' nombran otra cosa del texto. ', mala('B'), ': el cóndor no es un pez. ', mala('C'), ' no concuerda: es plural.'],
      bien: [buena('D'), ': ', justo('esta ave'), ' es un nombre más general para el cóndor.'],
      sentido: 'Relee: esta ave puede planear horas sin mover las alas. Se sigue hablando del cóndor.' },
    { sop: sim(12, ors('h', ['Mi hermano saludó a [p:la enfermera] de la posta.', '[w:¿…?] le sonrió y le dio un caramelo.']),
      '¿Qué va en el espacio para que el caramelo lo dé la enfermera?', ['Ella', 'Nada: se calla', 'Él', 'Mi hermano', 'Este hospital']), buena: 'A',
      pide: 'Piden la forma que vuelve a nombrar a la enfermera en la oración 2.', datos: [D_SUSTITUYE, D_CALLA, 'Concordancia: el pronombre y su referente tienen el mismo género y el mismo número.'],
      tengo: ['Justo antes, quien hizo algo es mi hermano; ', cubre('la enfermera'), ' es a quien saludó.'],
      malas: [mala('B'), ': callar recupera a mi hermano. ', mala('C'), ' y ', mala('D'), ' nombran al hermano. ', mala('E'), ': un hospital no da caramelos.'],
      bien: [buena('A'), ': ', justo('«ella»'), ' concuerda solo con la enfermera.'],
      sentido: 'Relee: ella le sonrió y le dio un caramelo. Se habla de la enfermera.' },
  ];

  // «Ahora tú»: seis casos de cuatro opciones; cada parte de la regla (sustitución, elipsis de quien hace algo, de un
  // verbo, el sustituto que corresponde, callar que cambia de persona, una cadena en un texto de tres oraciones).
  const AHORA_3 = [
    { o: ['Rosa trajo [p:una olla de barro] de Pucará.', '[w:Esa vasija] sirve para cocinar mazamorra.'], pregunta: '¿Qué hace «esa vasija» en la oración 2?', ok: 'Nombra la olla de forma más general', datos: D_IDEA3,
      por: '«Esa vasija» vuelve a nombrar la olla con una palabra más general: es una sustitución.',
      m: [['Presenta otra cosa que Rosa trajo', 'RVK8', 'Es cierto que «vasija» es otra palabra, pero no presenta nada nuevo: es la misma olla, nombrada de forma más general.'],
        ['Nombra a Rosa con otra palabra', 'RVK6', 'Rosa concuerda con «esa vasija», sí, pero una persona no sirve para cocinar mazamorra.'],
        ['Nombra el barro de la olla con otra palabra', 'RVK14', 'El barro está en el texto, es cierto, pero «barro» es masculino y «esa vasija», femenino; además, con barro solo no se cocina.']] },
    { o: ['[p:Mis primos] llegaron de Azángaro.', 'Trajeron chuño y queso.'], pregunta: '¿Quién trajo chuño y queso?', ok: 'Mis primos', datos: D_IDEA3,
      por: 'La oración 2 calla quién trajo: se recupera de justo antes, «mis primos».',
      m: [['Azángaro', 'RV27', 'Azángaro es lo último que se nombró, es cierto, pero un lugar no trae chuño ni queso.'],
        ['Nadie: falta quién lo trajo', 'RVK8', 'La 2 no dice quién, sí, pero no falta: se calla porque ya se sabe.'],
        ['Yo, que escribo el texto', 'RVK7', 'Bien pensado en quien escribe, pero eso pediría «traje»: «trajeron» es plural, como «mis primos».']] },
    { o: ['Ana [p:lleva] cuentos a la biblioteca; Luis, revistas.'], pregunta: '¿Qué palabra se calló después de «Luis»?', ok: 'lleva', datos: D_IDEA3,
      por: 'Luis lleva revistas: se calla el verbo, que ya se dijo.',
      m: [['cuentos', 'RVK7', 'Es cierto que los cuentos se dijeron antes, pero los lleva Ana: Luis lleva revistas, y lo callado es otra palabra.'],
        ['Ana', 'RVK16', 'Ana se nombra antes, es cierto, pero después de la coma ya está Luis, que es otro que hace algo.'],
        ['nada: la oración está incompleta', 'RVK8', 'Sí falta una palabra, pero la oración no está incompleta: se calla porque ya se dijo.']] },
    { o: ['[p:La quinua] crece en el altiplano.', '[w:¿…?] aguanta el frío de las noches.'], pregunta: '¿Qué expresión puede ir en el espacio?', ok: 'Este grano', datos: D_IDEA3,
      por: 'La quinua es un grano: «este grano» la nombra de forma más general.',
      m: [['Esta fruta', 'RVK17', 'Sí, sustituir sirve aquí, pero con otro nombre: la quinua no es una fruta.'],
        ['Él', 'RVK14', 'Sí, un pronombre podría ir, pero tendría que ser femenino: «él» no concuerda con «la quinua».'],
        ['El altiplano', 'RVK7', 'El altiplano está en el texto, sí, pero con él la oración ya no habla de la quinua.']] },
    { o: ['Don Pedro saludó [p:al alcalde] en la plaza.', 'Después, [w:¿…?] le regaló un queso.'], pregunta: '¿Qué va en el espacio para que el queso lo regale el alcalde?', ok: 'el alcalde', datos: D_IDEA3,
      por: 'Callar recuperaría a don Pedro, que hizo algo justo antes: hay que nombrar al alcalde.',
      m: [['nada: se calla', 'RVK16', 'Es cierto que callar evita repetir, pero aquí el lector recuperaría a don Pedro, que hizo algo justo antes.'],
        ['él', 'RV27', '«Él» evita repetir, es cierto, pero puede ser cualquiera de los dos hombres: no deja claro quién regaló el queso.'],
        ['don Pedro', 'RVK7', 'Sí, repetir un nombre es claro, pero con «don Pedro» el queso lo regalaría don Pedro.']] },
    { o: ['Mi papá trabaja en [p:una panadería] de Juliaca.', 'Se levanta a las cuatro de la mañana.', 'A esa hora, [w:el local] ya huele a pan.'], pregunta: '¿A qué se refiere «el local»?', ok: 'A la panadería', datos: D_IDEA3,
      por: '«El local» es un nombre más general para la panadería, que huele a pan.',
      m: [['A Juliaca', 'RVK14', 'Juliaca es un lugar del texto, sí, pero una ciudad no es un local.'],
        ['A la casa de mi papá', 'RVK8', 'Bien pensado en un lugar, pero la casa no se nombró: «el local» retoma un lugar que el texto ya dijo.'],
        ['A las cuatro de la mañana', 'RVK7', 'Es cierto que las cuatro de la mañana están en el texto, pero son un momento, no un lugar.']] },
  ];

  // Ejemplos resueltos de la idea 3. Nivel 1: un paso (qué forma usa, qué se calló, quién hizo algo). Nivel 2: tres de
  // una lista. Nivel 3: la hoja de simulacro; las correctas son A, B, C, D y E. Revisado aparte (scratchpad
  // e9-verbal/rev/revisa.js).
  const EJEMPLOS_3 = [
    { nivel: 1, titulo: 'El poncho de Pucará',
      enunciado: '¿Con qué forma vuelve a nombrar el poncho la oración 2?',
      datos: D_IDEA3,
      figura: fig(papel('mensaje', 'Familia Huanca', null, 'el tío Rómulo', 'la familia', ors('k', ['Compré un poncho en Pucará.', '[w:El poncho] es de lana de oveja.']))),
      solucion: [{ texto: ['La oración 2 dice ', cubre('«el poncho»'), ' otra vez: es la misma palabra.'] }],
      respuesta: [justo('Repetición')] },
    { nivel: 1, titulo: 'Mi hermana en Arequipa',
      enunciado: '¿Quién vive con la tía, según la oración 2?',
      datos: D_IDEA3,
      figura: fig(papel('cuaderno', 'Cuaderno de Comunicación', 'Mi familia', 'Diana', 'la profesora', ors('k', ['[p:Mi hermana] estudia en Arequipa.', 'Vive con mi tía.']))),
      solucion: [{ texto: ['La 2 calla quién vive; se recupera de justo antes: ', cubre('mi hermana'), '.'] }],
      respuesta: [justo('Mi hermana')] },
    { nivel: 1, titulo: 'El charango de Mateo',
      enunciado: '¿Con qué forma vuelve a nombrar el charango la oración 2?',
      datos: D_IDEA3,
      figura: fig(papel('mural', 'Mural del colegio', 'Música andina', 'el taller de música', 'todo el colegio', ors('k', ['Mateo trajo [p:un charango] a la clase.', '[w:Este instrumento] tiene diez cuerdas.']))),
      solucion: [{ texto: [cubre('«Este instrumento»'), ' nombra al charango con una palabra más general.'] }],
      respuesta: [justo('Sustitución'), ': un nombre más general'] },
    { nivel: 1, titulo: 'El pan y el queso',
      enunciado: '¿Qué palabra se calla después de «tú»?',
      datos: D_IDEA3,
      figura: fig(papel('mensaje', 'Paseo de la promoción', null, 'Ximena', 'Andrés', ors('k', ['Yo [p:llevo] el pan; tú, el queso.']))),
      solucion: [{ texto: ['Se calla el verbo ', cubre('«llevo»'), ', pero con la persona de «tú»: llevas.'] }],
      respuesta: [justo('«Llevas»')] },
    { nivel: 1, titulo: 'El tren de Puno',
      enunciado: '¿Qué llegó al Cusco en la noche, según la oración 2?',
      datos: D_IDEA3,
      figura: fig(papel('cuaderno', 'Cuaderno de viaje', 'Mis vacaciones', 'Kevin', 'su diario', ors('k', ['[p:El tren] salió de Puno a las ocho.', 'Llegó al Cusco en la noche.']))),
      solucion: [{ texto: ['La 2 calla quién llegó; justo antes, lo que salió de Puno fue ', cubre('el tren'), '.'] }],
      respuesta: [justo('El tren')] },

    { nivel: 2, titulo: 'La alpaca de las alturas',
      enunciado: '¿Qué puede reemplazar a «La alpaca» en la oración 2: «este animal», «esta planta» o «este pueblo»?',
      datos: D_IDEA3,
      figura: fig(papel('folleto', 'Folleto de la feria ganadera', 'Criar alpacas', 'la asociación de criadores', 'los visitantes', ors('k', ['[p:La alpaca] vive en las alturas de Puno.', '[w:La alpaca] da una fibra suave.']))),
      solucion: [
        { texto: ['La alpaca es un animal: ', cubre('«este animal»'), ' la nombra de forma más general.'] },
        { texto: [prop('«Esta planta»'), ' y ', prop('«este pueblo»'), ' nombrarían otra cosa.'] }],
      respuesta: [justo('«Este animal»')] },
    { nivel: 2, titulo: 'Los útiles de Andrea',
      enunciado: '¿Qué se calló después de «su hermano»: «Andrea», «un libro» o «compró»?',
      datos: D_IDEA3,
      figura: fig(papel('cuaderno', 'Cuaderno de Comunicación', 'De compras', 'Andrea', 'la profesora', ors('k', ['Andrea [p:compró] un libro; su hermano, dos cuadernos.']))),
      solucion: [
        { texto: ['La coma marca lo callado; justo antes se dijo ', cubre('«compró»'), '.'] },
        { texto: [prop('«Andrea»'), ' es otra persona y ', prop('«un libro»'), ' es lo que ella compró.'] }],
      respuesta: [justo('«Compró»')] },
    { nivel: 2, titulo: 'El sol en la calle',
      enunciado: '¿Qué hace la oración 2 con «un sol»: «lo repite igual», «lo sustituye» o «lo calla»?',
      datos: D_IDEA3,
      figura: fig(papel('mensaje', 'Primos Mamani', null, 'Brayan', 'los primos', ors('k', ['Encontré [p:un sol] en la calle.', '[w:Lo] guardé en mi monedero.']))),
      solucion: [
        { texto: [cubre('«Lo»'), ' es un pronombre en lugar de «un sol»: lo sustituye.'] },
        { texto: ['No es ', prop('repetición'), ' ni ', prop('elipsis'), ': no dice «sol» ni lo calla.'] }],
      respuesta: [justo('«Lo sustituye»')] },
    { nivel: 2, titulo: 'Sofía en la posta',
      enunciado: '¿Quién recetó el jarabe en la oración 3: «Sofía», «el doctor» o «la enfermera»?',
      datos: D_IDEA3,
      figura: fig(papel('cuaderno', 'Cuaderno de Sofía', null, 'Sofía', 'su diario', ors('k', ['Sofía llegó a la posta con tos.', '[p:El doctor] la atendió enseguida.', 'Le recetó un jarabe.']))),
      solucion: [
        { texto: ['La 3 calla quién recetó; justo antes, quien hizo algo fue ', cubre('el doctor'), '.'] },
        { texto: [prop('«Sofía»'), ' es la atendida; ', prop('la enfermera'), ' no está en el texto.'] }],
      respuesta: [justo('«El doctor»')] },
    { nivel: 2, titulo: 'La carretera a Arequipa',
      enunciado: '¿Qué va en el espacio para no repetir «La carretera»: «Este río», «Esta vía» o «Esta ciudad»?',
      datos: D_IDEA3,
      figura: fig(papel('folleto', 'Folleto de una empresa de buses', 'Viaje a Arequipa', 'la empresa', 'los pasajeros', ors('k', ['[p:La carretera] de Puno a Arequipa es muy larga.', '[w:¿…?] cruza varios pueblos de la sierra.']))),
      solucion: [
        { texto: ['Una carretera es una vía: ', cubre('«esta vía»'), ' la nombra de forma más general.'] },
        { texto: [prop('«Este río»'), ' y ', prop('«esta ciudad»'), ' nombrarían otra cosa.'] }],
      respuesta: [justo('«Esta vía»')] },

    { nivel: 3, titulo: 'Elena llegó tarde',
      enunciado: 'Pregunta 21 del simulacro. Según la oración 3, ¿quién pidió que avisara?',
      datos: D_IDEA3,
      figura: fig(sim(21, ors('h', ['Elena llegó tarde al ensayo.', 'La profesora la esperó en la puerta.', 'Le pidió que avisara la próxima vez.']),
        'Según la oración 3, ¿quién pidió que avisara?', ['La profesora', 'Elena', 'La puerta', 'El ensayo', 'Nadie: falta quién lo pidió'])),
      solucion: [
        { texto: ['La 3 calla quién pidió; justo antes, quien hizo algo fue ', cubre('la profesora'), '.'] },
        { texto: [mala('B'), ' es a quien se lo pidieron. ', mala('C'), ' y ', mala('D'), ' no piden nada. ', mala('E'), ': callar no es una falta.'] },
        { texto: [buena('A'), ': ', justo('la profesora'), '.'] }],
      respuesta: [buena('A'), ': la profesora'] },
    { nivel: 3, titulo: 'El volcán de Arequipa',
      enunciado: 'Pregunta 22 del simulacro. ¿Con qué forma vuelve a nombrar al Misti la oración 2?',
      datos: D_IDEA3,
      figura: fig(sim(22, ors('h', ['El Misti se ve desde toda la ciudad de Arequipa.', '[w:Este volcán] mide más de cinco mil metros.']),
        '¿Con qué forma vuelve a nombrar al Misti la oración 2?', ['Repetición de la misma palabra, «Misti»', 'Sustitución por un nombre más general', 'Sustitución por un pronombre', 'Elipsis: calla el nombre', 'No lo vuelve a nombrar'])),
      solucion: [
        { texto: [cubre('«Este volcán»'), ' nombra al Misti con una palabra más general.'] },
        { texto: [mala('A'), ': no dice «Misti». ', mala('C'), ': «volcán» no es un pronombre. ', mala('D'), ' y ', mala('E'), ': sí lo nombra.'] },
        { texto: [buena('B'), ': ', justo('sustitución por un nombre más general'), '.'] }],
      respuesta: [buena('B'), ': sustitución por un nombre más general'] },
    { nivel: 3, titulo: 'La kermés de quinto',
      enunciado: 'Pregunta 23 del simulacro. ¿Qué palabra se calló en las oraciones 2 y 3?',
      datos: D_IDEA3,
      figura: fig(sim(23, ors('h', ['En la kermés, 5.º A vendió anticuchos.', '5.º B, picarones.', 'Y 5.º C, emoliente.']),
        '¿Qué palabra se calló en las oraciones 2 y 3?', ['anticuchos', '5.º A', 'vendió', 'la kermés', 'ninguna: están incompletas'])),
      solucion: [
        { texto: ['Cada coma marca lo callado; justo antes se dijo ', cubre('«vendió»'), '.'] },
        { texto: [mala('A'), ' es lo que vendió 5.º A. ', mala('B'), ' es otra sección. ', mala('D'), ' es el lugar. ', mala('E'), ': callar no es una falta.'] },
        { texto: [buena('C'), ': 5.º B ', justo('vendió'), ' picarones.'] }],
      respuesta: [buena('C'), ': vendió'] },
    { nivel: 3, titulo: 'Las islas de los uros',
      enunciado: 'Pregunta 24 del simulacro. ¿Qué expresión puede ir en el espacio sin cambiar de qué se habla?',
      datos: D_IDEA3,
      figura: fig(sim(24, ors('h', ['Los uros viven en islas flotantes del lago Titicaca.', '[w:¿…?] están hechas de totora.']),
        '¿Qué expresión puede ir en el espacio sin cambiar de qué se habla?', ['Ellos', 'Estos pueblos', 'Los uros', 'Esas islas', 'El lago'])),
      solucion: [
        { texto: ['Lo hecho de totora son ', cubre('las islas'), ': «hechas» es femenino y plural.'] },
        { texto: [mala('A'), ', ', mala('B'), ' y ', mala('C'), ' nombran a los uros; ', mala('E'), ', al lago.'] },
        { texto: [buena('D'), ': ', justo('esas islas'), ' retoma las islas flotantes.'] }],
      respuesta: [buena('D'), ': esas islas'] },
    { nivel: 3, titulo: 'Los picarones',
      enunciado: 'Pregunta 25 del simulacro. ¿Qué expresión puede ir en el espacio sin cambiar de qué se habla?',
      datos: D_IDEA3,
      figura: fig(sim(25, ors('h', ['El picarón es un dulce de zapallo y camote.', '[w:¿…?] se sirve con miel de chancaca.']),
        '¿Qué expresión puede ir en el espacio sin cambiar de qué se habla?', ['El zapallo y el camote', 'Esta fruta', 'Ellos', 'El camote', 'Este dulce'])),
      solucion: [
        { texto: ['Lo que se sirve con miel es ', cubre('el picarón'), ', que es un dulce.'] },
        { texto: [mala('A'), ' y ', mala('D'), ' son sus ingredientes. ', mala('B'), ' no le corresponde. ', mala('C'), ' es plural.'] },
        { texto: [buena('E'), ': ', justo('este dulce'), ' nombra al picarón de forma más general.'] }],
      respuesta: [buena('E'), ': este dulce'] },
  ];

  const recursos = {
    id: 'repetir-sustituir-callar',
    titulo: 'Repetir, sustituir o callar',
    pregunta: '¿De cuántas maneras se puede volver a nombrar algo?',
    temas: ['Repetición, sustitución y elipsis'],
    pieza: 'rv-soporte',
    lee: {
      tarjetas: [
        { titulo: 'El folleto de la vicuña', texto: 'El club de ciencias escribió un folleto para la feria. Habla de la vicuña de principio a fin, pero no puede decir «la vicuña» en cada oración sin cansar al lector.',
          pieza: 'rv-soporte', dibujo: { datos: folleto3(INI3), estado: {} } },
        { titulo: 'Tres formas', texto: 'Algo ya dicho se puede repetir con la misma palabra, sustituir por otra (un pronombre o un nombre más general, como «este animal») o callar.' },
        { titulo: 'Callar', texto: 'En «Pedro llegó tarde. Pidió disculpas», no se dice quién pidió disculpas: el lector lo recupera. Callar algo que se entiende se llama elipsis.' },
        { titulo: 'Qué mirar al jugar', texto: 'Toca las oraciones 2 y 4 para cambiar cómo se nombra a la vicuña. En «[ ]» no se dice nada: ¿de quién habla entonces la oración?' },
      ],
    },
    actividad: 'Nombrar otra vez a la vicuña en el folleto sin perder de quién se habla.',
    aprendizaje: 'Lo ya dicho se repite, se sustituye o se calla; lo callado se recupera de lo dicho justo antes.',
    ejemplos: EJEMPLOS_3,
    juega: {
      consigna: 'El club de ciencias escribió un folleto sobre la vicuña. En las oraciones 2 y 4, la negrita marca cómo se la vuelve a nombrar.',
      mision: {
        texto: 'Usa una sustitución y una elipsis sin que cambie de quién se habla.',
        logrado: listo3,
        bien: 'Callar sirve en la 2: justo antes se habla de la vicuña.',
      },
      voz: 'Si callas el nombre, ¿a quién recupera el lector?',
      leyenda: [
        { s: 'negrita', t: 'cómo vuelve la vicuña; [ ]: se calla' },
        { s: cubre('turquesa'), t: 'se sigue hablando de la vicuña' },
        { s: prop('naranja'), t: 'se recupera a otro' },
        { s: justo('violeta'), t: 'las dos formas de la misión' },
      ],
      controles: [
        { id: 's1', etiqueta: 'Oración 2', opciones: FORMAS3.map((f, v) => ({ valor: v, texto: f.b })) },
        { id: 's2', etiqueta: 'Oración 4', opciones: FORMAS3.map((f, v) => ({ valor: v, texto: f.b })) },
      ],
      dibujo: val => ({ datos: Object.assign({ toques: { v2: 's1', v4: 's2' } }, folleto3(val)), estado: est3(val) }),
      lectura: lectura3,
      minimo: 3,
    },
    predice: {
      pregunta: 'En el cartel de un puesto de la feria, ¿qué palabra se calló después de «mi mamá»?',
      voz: 'Elige antes de ver: después lo comprobamos.',
      opciones: opciones('vende', [
        ['papa', 'RVK7', 'La papa se dijo antes, es cierto, pero la vende la tía: la mamá vende chuño, y lo callado es otra palabra.'],
        ['mi tía', 'RVK16', 'La tía se nombra antes, sí, pero después de la coma ya hay otra persona que hace algo: la mamá.'],
        ['ninguna: la oración está incompleta', 'RVK8', 'Sí falta una palabra, pero la oración no está incompleta: se calla porque ya se dijo antes.'],
      ]),
      dibujo: FERIA3(),
      revelar: FERIA3(true, { f1p: 'i', f1w: 'f' }),
      coincide: 'Coincide: se calló el verbo «vende», que ya se había dicho.',
    },
    mira: {
      datos: FERIA3(true).datos,
      voz: 'Leamos la oración entera y busquemos lo que falta.',
      pasos: [
        { estado: { marcas: { f1p: 'i' }, nuevo: ['f1p'] }, texto: 'La primera parte dice quién vende y qué vende.',
          ecuacion: ['mi tía ', cubre('vende'), ' papa'] },
        { estado: { marcas: { f1p: 'i', f1w: 'o' }, nuevo: ['f1w'] }, texto: 'Después de «mi mamá» viene una coma: ahí se calla algo.',
          ecuacion: ['mi mamá, ', { negrita: '[ ]' }, ' chuño'] },
        { estado: { marcas: { f1p: 'i', f1w: 'o' } }, texto: 'Lo callado se recupera de lo dicho justo antes: en la primera parte, después de «mi tía», viene el verbo.',
          ecuacion: [cubre('vende'), ' → ', { negrita: '[ ]' }] },
        { estado: { marcas: { f1p: 'i', f1w: 'f' }, nuevo: ['f1w'] }, texto: 'Callar no es una falta: la coma marca dónde va «vende».',
          ecuacion: [justo('mi mamá vende chuño')] },
      ],
    },
    regla: {
      texto: 'Lo ya dicho se vuelve a nombrar repitiéndolo, sustituyéndolo (con un pronombre, otro nombre o uno más general) o callándolo. Lo callado se recupera de lo dicho justo antes.',
      ecuacion: ['repetir, sustituir o callar', ' → ', { negrita: 'lo mismo' }],
      voz: 'Antes de callar un nombre, mira quién hizo algo justo antes.',
      condicion: 'lo que se calla ya se dijo justo antes, y el verbo va en la persona y el número de quien hace la acción.',
    },
    resuelve: {
      pieza: 'rv-soporte',
      generar(s) { return resuelveDe(RESUELVE_3[s % RESUELVE_3.length], REGLA3); },
    },
    ahoraTu: {
      pieza: 'rv-soporte',
      voz: 'Otro texto. Busca qué se dijo justo antes.',
      generar(s) { return ahoraDe(AHORA_3, 13, s, D_IDEA3); },
    },
  };

  // ---------- Idea 4: lo conocido trae lo nuevo (conserva su id; etapa 9) ----------
  // Cambia: cómo sigue cada una de las oraciones 2, 3 y 4 del mural. Permanece: la oración 1 (los incas y sus caminos).
  // Progresa: de oraciones que saltan a algo que nadie presentó a una cadena en que cada una parte de lo nuevo de la
  // anterior. Se reserva: un texto en que todas vuelven al tema del inicio (predicción). Debe verse: que «los mensajes»
  // sin presentar cortan el hilo, aunque sean del mismo tema.
  // Objeto de la primera pantalla: el periódico mural de 5.º A (el equipo de Historia, para todo el colegio).
  // Colores: de lo que parte una oración, si ya se dijo, i; si nadie lo presentó, o; la cadena de la misión, f.
  // Códigos: RV28 (lo nuevo tomado como conocido), RVK1, RVK3, RVK7, RVK8, RVK9 (una sola forma de hilo), RVK10 (volver al
  // tema corta el hilo) y RVK12.

  // El juego: cada versión dice de qué parte (su tópico) y qué trae de nuevo. Una oración sigue el hilo si parte de algo
  // ya dicho; la misión pide además que parta de lo nuevo de la anterior. El código lo decide.
  const VERS4 = {
    o2: [{ pl: '[p:Los incas] también hicieron [n:puentes de soga].', parte: 'incas', trae: 'puentes', b: 'Los incas también…' },
      { pl: '[p:Por esos caminos] corrían [n:los chasquis].', parte: 'caminos', trae: 'chasquis', b: 'Por esos caminos…' },
      { pl: '[p:Los chasquis] vivían en [n:casitas junto al camino].', parte: 'chasquis', trae: 'casitas', b: 'Los chasquis vivían…' }],
    o3: [{ pl: '[p:Esos puentes] cruzaban [n:ríos profundos].', parte: 'puentes', trae: 'ríos', b: 'Esos puentes…' },
      { pl: '[p:Los chasquis] llevaban [n:mensajes] corriendo.', parte: 'chasquis', trae: 'mensajes', b: 'Los chasquis llevaban…' },
      { pl: '[p:Los mensajes] viajaban [n:de posta en posta].', parte: 'mensajes', trae: 'postas', b: 'Los mensajes viajaban…' }],
    o4: [{ pl: '[p:Los incas] gobernaban [n:desde el Cusco].', parte: 'incas', trae: 'Cusco', b: 'Los incas gobernaban…' },
      { pl: '[p:Esos mensajes] llegaban [n:al Cusco] en pocos días.', parte: 'mensajes', trae: 'Cusco', b: 'Esos mensajes…' },
      { pl: '[p:Las llamas] cargaban [n:la comida].', parte: 'llamas', trae: 'comida', b: 'Las llamas…' }],
  };
  const NOMBRE4 = { caminos: 'los caminos', incas: 'los incas', chasquis: 'los chasquis', puentes: 'los puentes', mensajes: 'los mensajes', llamas: 'las llamas', casitas: 'las casitas', ríos: 'los ríos', postas: 'las postas' };
  const SLOTS4 = ['o2', 'o3', 'o4'];
  // El recorrido: qué se sabe al llegar a cada oración y si sigue el hilo y si parte de lo nuevo de la anterior.
  function hilo4(val) {
    const sabe = new Set(['incas', 'caminos']); let antes = 'caminos';
    return SLOTS4.map((s, k) => {
      const v = VERS4[s][val[s]];
      const r = { s, k: k + 2, parte: v.parte, sigue: sabe.has(v.parte), lineal: v.parte === antes };
      sabe.add(v.parte); sabe.add(v.trae); antes = v.trae;
      return r;
    });
  }
  const listo4 = val => hilo4(val).every(r => r.lineal);
  const mural4 = val => papel('mural', 'Periódico mural de 5.º A', 'El Qhapaq Ñan', 'el equipo de Historia', 'todo el colegio', [
    oracion('o1', '[a:Los incas] construyeron [n:una red de caminos] por los Andes.'),
    ...SLOTS4.map(s => oracion(s, VERS4[s][val[s]].pl)),
  ]);
  const INI4 = { o2: 0, o3: 0, o4: 0 };
  const est4 = val => {
    const h = hilo4(val), ok = listo4(val), marcas = {};
    h.forEach((r, i) => {
      marcas[`${r.s}p`] = ok ? 'f' : r.sigue ? 'i' : 'o';
      if (r.lineal) marcas[`${i ? h[i - 1].s : 'o1'}n`] = ok ? 'f' : 'i';
    });
    return { marcas };
  };
  const lectura4 = val => {
    const h = hilo4(val);
    if (listo4(val)) return [justo('Cada oración parte de lo nuevo'), ' de la anterior'];
    const c = h.find(r => !r.sigue);
    if (c) return [prop(`La ${c.k} parte de «${NOMBRE4[c.parte]}»`), ', que nadie presentó'];
    const v = h.find(r => !r.lineal);
    return [cubre(`La ${v.k} vuelve a «${NOMBRE4[v.parte]}»`), ', ya dicho antes'];
  };

  // La predicción: las tres oraciones vuelven al tema del inicio. El juego solo premió partir de lo nuevo de la anterior.
  const QUINUA4 = marcas => ({ datos: papel('folleto', 'Feria de la quinua de Cabana', 'La quinua', 'la cooperativa de Cabana', 'los visitantes', [
    oracion('f1', '[p:La quinua] crece bien en el altiplano.'),
    oracion('f2', '[q:Aguanta] heladas y sequías.'),
    oracion('f3', '[r:Sus granos] se comen en sopa o en mazamorra.'),
  ]), estado: marcas ? { marcas } : {} });

  // Los Datos de la idea (contrato, punto 13).
  const D_TOPICO = 'Tópico: lo ya conocido de lo que parte una oración.';
  const D_COMENTO = 'Comento: lo nuevo que la oración dice sobre su tópico.';
  const D_DE_DONDE = 'El tópico puede ser lo nuevo de la oración anterior o el tema del inicio.';
  const D_NADIE = 'Si el tópico no se presentó antes, el lector no sabe de qué se habla.';
  const D_IDEA4 = [D_TOPICO, D_COMENTO, D_DE_DONDE, D_NADIE];

  // «Así se resuelve»: la buena es A, D, B y C (cada letra cuatro veces en las 20 hojas de la unidad).
  const REGLA4 = 'Cada oración parte de algo dicho: lo nuevo de la anterior o el tema del inicio. Si parte de algo que nadie presentó, el hilo se corta.';
  const RESUELVE_4 = [
    { sop: sim(9, ors('h', ['[p:Ayaviri] es la capital de la provincia de Melgar.', '[q:En Ayaviri] se prepara un queso muy conocido.', '[r:Ese queso] se vende en todo el sur.', '[s:Las ruedas del camión] se cambiaron ayer.']),
      '¿Qué oración corta el hilo del texto?', ['La 4', 'La 2', 'La 3', 'La 1', 'Ninguna']), buena: 'A',
      pide: 'Piden la oración que parte de algo que nadie presentó.', datos: D_IDEA4,
      tengo: ['La 2 parte de ', cubre('Ayaviri'), ' y la 3, de ', cubre('ese queso'), ', lo nuevo de la 2.'],
      malas: [mala('B'), ' y ', mala('C'), ' parten de algo ya dicho. ', mala('D'), ' presenta el tema. ', mala('E'), ': sí hay un corte.'],
      bien: [buena('A'), ': ', prop('«las ruedas del camión»'), ' no se presentaron: el lector no sabe de qué camión se habla.'],
      sentido: 'Relee sin la 4: Ayaviri, su queso y dónde se vende. El hilo no se corta.', marcas: ['h2q', 'h3r'] },
    { sop: sim(10, ors('h', ['Mi colegio organizó una campaña de reciclaje.', 'En la campaña juntamos [n:botellas de plástico].', '[w:¿…?]']),
      '¿Qué oración puede ir como 3 sin cortar el hilo?', ['Los premios del concurso se entregan en diciembre.', 'El papel se recicla en Arequipa.', 'Las latas se aplastan con el pie.', 'Esas botellas se vendieron a una recicladora.', 'Los ganadores viajarán a Lima.']), buena: 'D',
      pide: 'Piden la oración que parte de algo ya dicho.', datos: D_IDEA4,
      tengo: ['Lo nuevo de la 2 son ', cubre('botellas de plástico'), '; la 3 puede partir de ahí.'],
      malas: [mala('A'), ' y ', mala('E'), ' parten de premios y ganadores que nadie presentó. ', mala('B'), ' y ', mala('C'), ' saltan al papel y a las latas, que nadie presentó.'],
      bien: [buena('D'), ': ', justo('«esas botellas»'), ' retoma lo nuevo de la 2.'],
      sentido: 'Relee: juntamos botellas; esas botellas se vendieron. Cada oración se apoya en la anterior.' },
    { sop: sim(11, ors('h', ['La Candelaria se celebra en Puno en febrero.', 'En la fiesta bailan [n:miles de danzantes].', '[p:Esos danzantes] ensayan durante meses.']),
      '¿De qué parte la oración 3?', ['De la fiesta de la Candelaria, el tema del inicio', 'De los danzantes, lo nuevo de la 2', 'De febrero, el mes de la fiesta', 'De algo que nadie presentó', 'De Puno, la ciudad']), buena: 'B',
      pide: 'Piden el tópico de la oración 3: de qué conocido parte.', datos: D_IDEA4,
      tengo: [cubre('«Esos danzantes»'), ' retoma a los danzantes que trajo la 2.'],
      malas: [mala('A'), ' es de lo que parte la 2. ', mala('C'), ' y ', mala('E'), ' están en la 1, pero la 3 no habla de ellos. ', mala('D'), ': los danzantes ya se presentaron.'],
      bien: [buena('B'), ': parte de ', justo('los danzantes'), ', lo nuevo de la 2.'],
      sentido: 'Relee: miles de danzantes; esos danzantes ensayan. La 3 avanza desde la 2.' },
    { sop: sim(12, [{ id: 'h1', t: 'La profesora escribió cinco textos cortos en la pizarra.' }],
      '¿En qué texto se corta el hilo?', ['«Compré pan. Ese pan era de la panadería de Rosa.»', '«Rosa canta en el coro. También baila huaino en la fiesta.»', '«Rosa canta en el coro. Los premios fueron caros.»', '«Hay un perro en la puerta. El perro ladra.»', '«Llegó el bus. Venía lleno de gente.»']), buena: 'C',
      pide: 'Piden el texto cuya segunda oración parte de algo que nadie presentó.', datos: D_IDEA4,
      tengo: ['En cada texto se mira de qué parte la segunda oración: si ya se dijo o no.'],
      malas: [mala('A'), ' y ', mala('D'), ' parten de lo nuevo de la primera. ', mala('B'), ' y ', mala('E'), ' vuelven al tema del inicio: Rosa y el bus.'],
      bien: [buena('C'), ': ', prop('«los premios»'), ' no se presentaron.'],
      sentido: 'Relee el texto C: ¿qué premios? El lector no tiene de dónde agarrarse.' },
  ];

  // «Ahora tú»: seis casos de cuatro opciones; cada parte de la regla (de qué parte una oración, cuál corta el hilo,
  // cuál sigue, lo nuevo de la anterior, el tema del inicio, un texto de cuatro oraciones).
  const AHORA_4 = [
    { o: ['En Juliaca hay [n:una feria muy grande] los lunes.', '[p:En esa feria] se vende ropa, ganado y herramientas.'], pregunta: '¿De qué parte la oración 2?', ok: 'De la feria, dicha en la 1', datos: D_IDEA4,
      por: '«En esa feria» retoma la feria que trajo la 1: lo conocido de la 2.',
      m: [['De la ropa y el ganado', 'RV28', 'Es cierto que la ropa y el ganado están en la 2, pero son lo nuevo que dice, no aquello de lo que parte.'],
        ['De los lunes, el día de la feria', 'RVK7', 'Los lunes están en la 1, es cierto, pero la 2 no empieza por ellos ni habla de ellos.'],
        ['De nada ya dicho: es un tema nuevo', 'RVK8', 'Es cierto que la 2 dice cosas nuevas, pero no parte de un tema nuevo: «esa feria» retoma la feria que nombró la 1.']] },
    { o: ['El colegio tiene una biblioteca nueva.', 'Esa biblioteca abre en las tardes.', '[p:Los ganadores] recibirán una medalla.'], pregunta: '¿Qué oración corta el hilo?', ok: 'La 3', datos: D_IDEA4,
      por: '«Los ganadores» no se presentaron: no se sabe de qué concurso.',
      m: [['La 2', 'RVK10', 'Bien visto que la 2 repite «biblioteca», pero retomar lo dicho no corta el hilo: lo mantiene.'],
        ['La 1', 'RV28', 'La 1 trae algo nuevo, sí, pero es la que presenta el tema: no tiene que partir de nada anterior.'],
        ['Ninguna: todas son del colegio', 'RVK3', 'Es cierto que todas hablan del colegio, pero eso no basta: nadie presentó a los ganadores ni su concurso.']] },
    { o: ['Mi abuela teje chompas de alpaca.', 'Esas chompas las vende en [n:la feria de Lampa].'], pregunta: '¿Qué oración sigue el hilo después de la 2?', ok: 'En esa feria, cada chompa cuesta ochenta soles.', datos: D_IDEA4,
      por: '«En esa feria» retoma lo nuevo de la 2: la feria de Lampa.',
      m: [['Esos turistas pagan en dólares.', 'RV28', '«Esos turistas» parece retomar algo, es cierto, pero nadie presentó antes a ningún turista.'],
        ['El mercado de Juliaca cierra temprano los domingos.', 'RVK3', 'El mercado de Juliaca también es un lugar de ventas, sí, pero no es la feria de Lampa: cambia de tema.'],
        ['Esas chompas las vende en Lampa.', 'RVK12', 'Es cierto que retoma las chompas, pero repite lo que dice la 2 sin agregar nada nuevo.']] },
    { o: ['El lago Titicaca está en el altiplano.', 'En el lago viven peces como [n:el carachi].', '[p:El carachi] es un pez pequeño.'], pregunta: '¿De qué parte la oración 3?', ok: 'Del carachi, lo nuevo de la 2', datos: D_IDEA4,
      por: 'La 3 empieza por «el carachi», que trajo la 2 como nuevo.',
      m: [['Del lago Titicaca, el tema del inicio', 'RVK10', 'El lago es el tema del inicio, es cierto, pero la 3 no empieza por él.'],
        ['De un pez que no se nombró', 'RV28', 'Bien visto «un pez pequeño», pero eso es lo que dice la 3, y lo dice del carachi, que ya se nombró.'],
        ['Del altiplano', 'RVK7', 'El altiplano está en la 1, sí, pero la 3 no habla de él.']] },
    { o: ['[p:La papa nativa] tiene muchos colores.', '[q:Se cultiva] en las alturas de Puno.', '[r:Se come] sancochada o en chuño.'], pregunta: '¿Se corta el hilo en este texto?', ok: 'No: todas parten de la papa nativa', datos: D_IDEA4,
      por: 'La 2 y la 3 callan el nombre, pero siguen hablando de la papa nativa.',
      m: [['Sí: la 2 no parte de lo nuevo de la 1', 'RVK9', 'Es cierto que partir de lo nuevo de la anterior sigue el hilo, pero volver al tema del inicio también lo sigue.'],
        ['Sí: la 2 y la 3 no dicen «papa»', 'RVK8', 'No dicen «papa», es cierto, pero callar el nombre no corta el hilo si se entiende de qué se habla.'],
        ['No: las tres tienen su punto', 'RVK1', 'Acertaste el «no», pero el punto final no decide nada: decide de qué parte cada oración.']] },
    { o: ['El Colca es un cañón de Arequipa.', 'Desde sus miradores se ven [n:cóndores].', '[q:Esos cóndores] planean sobre el cañón cada mañana.', '[p:Los turistas de la tarde] pagan menos en el hotel.'], pregunta: '¿Qué oración corta el hilo?', ok: 'La 4', datos: D_IDEA4,
      por: 'Nadie presentó a «los turistas de la tarde» ni el hotel: la 4 no tiene de dónde partir.',
      m: [['La 2', 'RVK8', 'Bien visto que la 2 no repite «Colca», pero no le hace falta: «sus miradores» son los del cañón.'],
        ['La 3', 'RVK10', 'La 3 nombra el cañón, sí, pero parte de los cóndores que presentó la 2: sigue el hilo.'],
        ['Ninguna', 'RVK3', 'Es cierto que todas podrían ser de un viaje al Colca, pero el texto no presentó a esos turistas ni el hotel.']] },
  ];

  // Ejemplos resueltos de la idea 4. Nivel 1: un paso (de qué parte una oración, qué trae, por qué se corta). Nivel 2:
  // tres de una lista. Nivel 3: la hoja de simulacro; las correctas son A, B, C, D y E. Revisado aparte (scratchpad
  // e9-verbal/rev/revisa.js): una tabla de qué presenta y de qué parte cada oración decide el hilo.
  const EJEMPLOS_4 = [
    { nivel: 1, titulo: 'La iglesia de Lampa',
      enunciado: '¿De qué parte la oración 2?',
      datos: [D_TOPICO, D_COMENTO],
      figura: fig(papel('folleto', 'Folleto turístico de Lampa', 'Lampa, la ciudad rosada', 'la municipalidad', 'los visitantes', ors('k', ['En Lampa hay una iglesia muy antigua.', '[p:Esa iglesia] guarda una copia de La Piedad.']))),
      solucion: [{ texto: [cubre('«Esa iglesia»'), ' retoma la iglesia que presentó la 1.'] }],
      respuesta: [justo('De la iglesia'), ', dicha en la 1'] },
    { nivel: 1, titulo: 'La tienda del tío',
      enunciado: '¿Qué es lo nuevo que dice la oración 2?',
      datos: [D_TOPICO, D_COMENTO],
      figura: fig(papel('mensaje', 'Primos Mamani', null, 'Brayan', 'los primos', ors('k', ['Mi tío abrió una tienda.', 'En la tienda [n:vende abarrotes].']))),
      solucion: [{ texto: ['La tienda ya se dijo; lo que agrega la 2 es ', cubre('qué vende'), '.'] }],
      respuesta: [justo('Que vende abarrotes')] },
    { nivel: 1, titulo: 'El perro de Ana',
      enunciado: '¿La oración 2 parte de lo nuevo de la 1 o del tema del inicio?',
      datos: [D_TOPICO, D_DE_DONDE],
      figura: fig(papel('mensaje', 'Promoción 2026', null, 'Ana', 'la promoción', ors('k', ['Compré [n:un perro].', '[p:Ese perro] se llama Toby.']))),
      solucion: [{ texto: [cubre('«Ese perro»'), ' es lo nuevo de la 1: lo que Ana compró.'] }],
      respuesta: [justo('De lo nuevo de la 1')] },
    { nivel: 1, titulo: 'El ceviche',
      enunciado: '¿De qué parte la oración 3?',
      datos: [D_TOPICO, D_DE_DONDE],
      figura: fig(papel('cartel', 'Cartel de una cevichería de Puno', 'Nuestro plato', 'la cevichería', 'los clientes', ors('k', ['[p:El ceviche] es un plato del Perú.', 'Se prepara con pescado crudo.', 'Se sirve con camote.']))),
      solucion: [{ texto: ['La 3 calla el nombre, pero lo que se sirve es ', cubre('el ceviche'), ', el tema del inicio.'] }],
      respuesta: [justo('Del ceviche'), ', el tema del inicio'] },
    { nivel: 1, titulo: 'La rifa sin presentar',
      enunciado: '¿Por qué la oración 2 corta el hilo?',
      datos: [D_TOPICO, D_NADIE],
      figura: fig(papel('mural', 'Mural del colegio', 'Noticias', 'el club de periodismo', 'todo el colegio', ors('k', ['El colegio pintó todas sus aulas.', '[p:Los ganadores de la rifa] viajarán al Cusco.']))),
      solucion: [{ texto: [prop('«Los ganadores de la rifa»'), ' no se presentaron: nadie habló de una rifa.'] }],
      respuesta: [justo('Parte de algo que nadie presentó')] },

    { nivel: 2, titulo: 'La tienda nueva',
      enunciado: '¿Qué oración sigue el hilo: «Esa tienda abre a las seis», «Los buses del barrio salen tarde» o «Las frutas son caras»?',
      datos: D_IDEA4,
      figura: fig(papel('mensaje', 'Vecinos de Bellavista', null, 'la presidenta de la junta', 'los vecinos', ors('k', ['En el barrio abrieron [n:una tienda nueva].']))),
      solucion: [
        { texto: [cubre('«Esa tienda»'), ' retoma lo nuevo del mensaje.'] },
        { texto: [prop('Los buses'), ' y ', prop('las frutas'), ' no se presentaron.'] }],
      respuesta: [justo('«Esa tienda abre a las seis»')] },
    { nivel: 2, titulo: 'El puente de Lampa',
      enunciado: '¿De qué parte la oración 3: «del río», «de los vecinos» o «del puente»?',
      datos: D_IDEA4,
      figura: fig(papel('folleto', 'Folleto turístico de Lampa', 'Paseos', 'la municipalidad', 'los visitantes', ors('k', ['En Lampa hay un río.', 'Sobre el río hay [n:un puente viejo].', '[p:Ese puente] lo cruzan los vecinos a pie.']))),
      solucion: [
        { texto: [cubre('«Ese puente»'), ' es lo nuevo de la 2.'] },
        { texto: [prop('El río'), ' es de lo que parte la 2; ', prop('los vecinos'), ' son lo nuevo de la 3.'] }],
      respuesta: [justo('«Del puente»')] },
    { nivel: 2, titulo: 'El tarwi',
      enunciado: '¿Qué oración corta el hilo: «la 2», «la 4» o «la 3»?',
      datos: D_IDEA4,
      figura: fig(papel('folleto', 'Folleto del comedor escolar', 'Comer bien', 'la nutricionista', 'las familias', ors('k', ['El tarwi es una legumbre de los Andes.', 'Tiene mucha proteína.', 'Se come en ensalada o en guiso.', '[p:Los perros] duermen en la puerta.']))),
      solucion: [
        { texto: ['La 2 y la 3 callan el nombre, pero hablan del ', cubre('tarwi'), '.'] },
        { texto: [prop('«Los perros»'), ' no se presentaron: la 4 corta el hilo.'] }],
      respuesta: [justo('«La 4»')] },
    { nivel: 2, titulo: 'La llama de carga',
      enunciado: '¿Qué hilo sigue el texto: «se corta en la 3», «todas vuelven al tema del inicio» o «cada una parte de lo nuevo de la anterior»?',
      datos: D_IDEA4,
      figura: fig(papel('folleto', 'Folleto de la feria ganadera', 'La llama', 'la asociación de criadores', 'los visitantes', ors('k', ['[p:La llama] es un animal de carga.', 'Lleva unos treinta kilos en el lomo.', 'Vive en grupos.']))),
      solucion: [
        { texto: ['La 2 y la 3 callan el nombre: hablan de ', cubre('la llama'), '.'] },
        { texto: ['Ninguna parte de la carga ni de los kilos, así que ', prop('no es una cadena'), '; tampoco se corta, porque todas hablan de la llama.'] }],
      respuesta: [justo('«Todas vuelven al tema del inicio»')] },
    { nivel: 2, titulo: 'La banda del colegio',
      enunciado: '¿Qué oración puede ir como 3: «El bus sale a las seis», «Esos ensayos son los sábados» o «Los premios del concurso son medallas»?',
      datos: D_IDEA4,
      figura: fig(papel('mensaje', 'Familia Choque', null, 'la mamá', 'la familia', ors('k', ['Tu hermano entró a la banda del colegio.', 'La banda tiene [n:ensayos] en el patio.']))),
      solucion: [
        { texto: [cubre('«Esos ensayos»'), ' retoma lo nuevo de la 2.'] },
        { texto: [prop('El bus'), ' y ', prop('los premios'), ' no se presentaron.'] }],
      respuesta: [justo('«Esos ensayos son los sábados»')] },

    { nivel: 3, titulo: 'La totora del lago',
      enunciado: 'Pregunta 21 del simulacro. ¿Qué oración corta el hilo del texto?',
      datos: D_IDEA4,
      figura: fig(sim(21, ors('h', ['La totora crece en las orillas del Titicaca.', 'Con la totora se hacen balsas.', 'Esas balsas llevan a los turistas a las islas.', 'Las computadoras del colegio son nuevas.']),
        '¿Qué oración corta el hilo del texto?', ['La 4', 'La 2', 'La 3', 'La 1', 'Ninguna'])),
      solucion: [
        { texto: ['La 2 vuelve a ', cubre('la totora'), '; la 3 parte de ', cubre('las balsas'), ', lo nuevo de la 2.'] },
        { texto: [mala('B'), ' y ', mala('C'), ' parten de algo dicho; ', mala('D'), ' presenta el tema. ', mala('E'), ': sí hay un corte.'] },
        { texto: [buena('A'), ': ', prop('las computadoras'), ' no se presentaron.'] }],
      respuesta: [buena('A'), ': la 4'] },
    { nivel: 3, titulo: 'Los cuyes de la casa',
      enunciado: 'Pregunta 22 del simulacro. ¿De qué parte la oración 3?',
      datos: D_IDEA4,
      figura: fig(sim(22, ors('h', ['Mi familia cría cuyes en la casa.', 'Los cuyes comen alfalfa.', 'Esa alfalfa la compramos en el mercado.']),
        '¿De qué parte la oración 3?', ['De los cuyes, el tema del inicio', 'De la alfalfa, lo nuevo de la 2', 'De mi familia, la que cría', 'De algo que nadie presentó', 'Del mercado']),
        ),
      solucion: [
        { texto: [cubre('«Esa alfalfa»'), ' retoma lo que trajo la 2.'] },
        { texto: [mala('A'), ' es de lo que parte la 2. ', mala('C'), ' no se retoma en la 3. ', mala('D'), ': la alfalfa ya se dijo. ', mala('E'), ' es lo nuevo de la 3.'] },
        { texto: [buena('B'), ': ', justo('la alfalfa'), ', lo nuevo de la 2.'] }],
      respuesta: [buena('B'), ': de la alfalfa, lo nuevo de la 2'] },
    { nivel: 3, titulo: 'El mototaxi de papá',
      enunciado: 'Pregunta 23 del simulacro. ¿Qué oración puede ir como 3 sin cortar el hilo?',
      datos: D_IDEA4,
      figura: fig(sim(23, ors('h', ['Mi papá maneja un mototaxi en Juliaca.', 'Ese mototaxi es rojo.', '[w:¿…?]']),
        '¿Qué oración puede ir como 3 sin cortar el hilo?', ['Los pasajeros del bus pagan tres soles.', 'Las combis salen del terminal.', 'Lo lava cada domingo en la mañana.', 'Los premios del concurso son caros.', 'La carretera a Puno tiene huecos.'])),
      solucion: [
        { texto: [mala('A'), ' y ', mala('B'), ' hablan de otros vehículos que nadie presentó.'] },
        { texto: [mala('D'), ' y ', mala('E'), ' parten de premios y de una carretera que no se dijeron.'] },
        { texto: [buena('C'), ': calla a ', cubre('papá'), ' y retoma ', cubre('el mototaxi'), ' con «lo».'] }],
      respuesta: [buena('C'), ': lo lava cada domingo en la mañana'] },
    { nivel: 3, titulo: 'El Inti Raymi',
      enunciado: 'Pregunta 24 del simulacro. ¿Qué hilo siguen las oraciones 2 y 3?',
      datos: D_IDEA4,
      figura: fig(sim(24, ors('h', ['El Inti Raymi se celebra en el Cusco.', 'La fiesta termina en Sacsayhuamán.', 'Esa fortaleza tiene muros enormes.']),
        '¿Qué hilo siguen las oraciones 2 y 3?', ['Las dos parten de lo nuevo de la anterior', 'Las dos vuelven al tema del inicio', 'La 2 corta el hilo', 'La 2 vuelve al tema y la 3 parte de lo nuevo', 'La 3 corta el hilo, porque nadie presentó la fortaleza antes'])),
      solucion: [
        { texto: [cubre('«La fiesta»'), ' es el Inti Raymi: la 2 vuelve al tema. ', cubre('«Esa fortaleza»'), ' es Sacsayhuamán, lo nuevo de la 2.'] },
        { texto: [mala('A'), ' y ', mala('B'), ' dicen que las dos siguen la misma forma, y no es así. ', mala('C'), ' y ', mala('E'), ' fallan: las dos parten de algo dicho.'] },
        { texto: [buena('D'), ': ', 'el texto usa ', justo('las dos formas de seguir el hilo'), '.'] }],
      respuesta: [buena('D'), ': la 2 vuelve al tema y la 3 parte de lo nuevo'] },
    { nivel: 3, titulo: 'La bicicleta de Juan',
      enunciado: 'Pregunta 25 del simulacro. ¿Qué oración parte de algo que nadie presentó?',
      datos: D_IDEA4,
      figura: fig(sim(25, ors('h', ['Juan compró una bicicleta.', 'La bicicleta es azul.', 'Con ella va al colegio.', 'Ese colegio queda lejos.', 'El entrenador lo felicitó.']),
        '¿Qué oración parte de algo que nadie presentó?', ['La 2', 'La 3', 'La 4', 'La 1', 'La 5'])),
      solucion: [
        { texto: ['La 2 y la 3 parten de ', cubre('la bicicleta'), '; la 4, del ', cubre('colegio'), ' que trajo la 3.'] },
        { texto: [mala('A'), ', ', mala('B'), ' y ', mala('C'), ' parten de algo dicho. ', mala('D'), ' presenta el tema.'] },
        { texto: [buena('E'), ': ', prop('el entrenador'), ' no se presentó.'] }],
      respuesta: [buena('E'), ': la 5'] },
  ];

  const progresion = {
    id: 'conocido-y-nuevo',
    titulo: 'Lo conocido trae lo nuevo',
    pregunta: '¿Por qué una oración solo se entiende después de otra?',
    temas: ['Progresión temática: tópico y comento'],
    pieza: 'rv-soporte',
    lee: {
      tarjetas: [
        { titulo: 'El periódico mural', texto: 'El equipo de Historia de 5.º A escribe en el periódico mural sobre el Qhapaq Ñan, los caminos de los incas. Cada oración tiene que apoyarse en lo que el lector ya leyó.',
          pieza: 'rv-soporte', dibujo: { datos: mural4(INI4), estado: {} } },
        { titulo: 'Tópico y comento', texto: 'Una oración parte de algo que el lector ya conoce, su tópico, y dice algo nuevo de eso, su comento. En «Mi perro es negro», el perro es el tópico; «es negro», el comento.' },
        { titulo: 'El hilo', texto: 'Cuando cada oración parte de algo ya dicho, el lector sigue el hilo del texto. Si una oración parte de algo que nadie presentó, el lector se pregunta: ¿de qué me hablan?' },
        { titulo: 'Qué mirar al jugar', texto: 'Toca las oraciones 2, 3 y 4 para cambiar cómo siguen. Mira de qué parte cada una: ¿de algo dicho en la anterior, de algo del inicio o de algo nuevo?' },
      ],
    },
    actividad: 'Elegir cómo sigue cada oración del mural para que retome lo dicho.',
    aprendizaje: 'Cada oración parte de algo ya dicho y agrega algo nuevo; si parte de algo que nadie presentó, el hilo se corta.',
    ejemplos: EJEMPLOS_4,
    juega: {
      consigna: 'El equipo de Historia escribe sobre los caminos de los incas. Las oraciones 2, 3 y 4 pueden seguir de tres maneras.',
      mision: {
        texto: 'Arma una cadena: que cada oración parta de lo nuevo de la anterior.',
        logrado: listo4,
        bien: 'Una cadena: caminos, chasquis, mensajes; lo nuevo de una es lo conocido de la siguiente.',
      },
      voz: '¿De dónde sale lo que nombra el comienzo de cada oración?',
      leyenda: [
        { s: cubre('turquesa'), t: 'de qué parte, ya dicho antes' },
        { s: prop('naranja'), t: 'de qué parte, sin presentar' },
        { s: justo('violeta'), t: 'el hilo que pide la misión' },
      ],
      controles: SLOTS4.map((s, k) => ({ id: s, etiqueta: `Oración ${k + 2}`, opciones: VERS4[s].map((v, i) => ({ valor: i, texto: v.b })) })),
      dibujo: val => ({ datos: Object.assign({ toques: { o2: 'o2', o3: 'o3', o4: 'o4' } }, mural4(val)), estado: est4(val) }),
      lectura: lectura4,
      minimo: 3,
    },
    predice: {
      pregunta: 'En un folleto de la feria de Cabana, ¿se corta el hilo del texto?',
      voz: 'Elige antes de ver: después lo comprobamos.',
      opciones: opciones('No: las tres parten de la quinua', [
        ['Sí: la 2 no retoma lo nuevo de la 1', 'RVK9', 'En el juego el hilo seguía así, es cierto, pero una oración que vuelve al tema del inicio también sigue el hilo.'],
        ['Sí: la 2 no nombra la quinua', 'RVK8', 'La 2 no dice «quinua», sí, pero callar el nombre no corta el hilo si se entiende de qué se habla.'],
        ['No: las tres oraciones están bien escritas', 'RVK1', 'Acertaste el «no», pero estar bien escritas no basta: lo que decide es de qué parte cada oración.'],
      ]),
      dibujo: QUINUA4(),
      revelar: QUINUA4({ f1p: 'i', f2q: 'f', f3r: 'f' }),
      coincide: 'Coincide: las tres vuelven a la quinua, el tema del inicio; el hilo sigue.',
    },
    mira: {
      datos: QUINUA4().datos,
      voz: 'Miremos de qué parte cada oración del folleto.',
      pasos: [
        { estado: { marcas: { f1p: 'i' }, nuevo: ['f1p'] }, texto: 'La 1 presenta la quinua y dice dónde crece.',
          ecuacion: [cubre('la quinua'), ' + ', { negrita: 'crece en el altiplano' }] },
        { estado: { marcas: { f1p: 'i', f2q: 'i' }, nuevo: ['f2q'] }, texto: 'La 2 calla el nombre, pero sigue hablando de la quinua.',
          ecuacion: [cubre('[ la quinua ]'), ' + ', { negrita: 'aguanta heladas' }] },
        { estado: { marcas: { f1p: 'i', f2q: 'i', f3r: 'i' }, nuevo: ['f3r'] }, texto: '«Sus granos» son de la quinua: la 3 también parte de ella.',
          ecuacion: [cubre('sus granos'), ' + ', { negrita: 'se comen en sopa' }] },
        { estado: { marcas: { f1p: 'i', f2q: 'f', f3r: 'f' }, nuevo: ['f2q', 'f3r'] }, texto: 'Volver al tema del inicio también sigue el hilo.',
          ecuacion: [justo('el hilo sigue')] },
      ],
    },
    regla: {
      texto: 'Cada oración parte de algo dicho y agrega algo nuevo: lo nuevo de la anterior o el tema del inicio. Si parte de algo sin presentar, el hilo se corta.',
      ecuacion: [cubre('tópico: lo conocido'), ' + ', { negrita: 'comento: lo nuevo' }],
      voz: 'Pregunta a cada oración: ¿de dónde sacas lo que nombras primero?',
      condicion: 'lo que una oración toma como conocido ya se dijo antes en el texto.',
    },
    resuelve: {
      pieza: 'rv-soporte',
      generar(s) { return resuelveDe(RESUELVE_4[s % RESUELVE_4.length], REGLA4); },
    },
    ahoraTu: {
      pieza: 'rv-soporte',
      voz: 'Otro texto. Mira de qué parte cada oración.',
      generar(s) { return ahoraDe(AHORA_4, 13, s, D_IDEA4); },
    },
  };

  // ---------- Idea 5: la oración que falta (nueva; etapa 9) ----------
  // Cambia: la oración que se prueba en el espacio 2 del borrador. Permanece: las oraciones 1, 3 y 4. Progresa: de
  // oraciones que encajan de un solo lado a la que encaja con la de antes y con la de después. Se reserva: la siguiente
  // anuncia con «sin embargo» que algo esperado no pasó, y lo esperado es una creencia, no un hecho (predicción). Debe
  // verse: que «esa revisión» de la oración 3 necesita que alguien la presente antes.
  // Objeto de la primera pantalla: el cuaderno de Elena con el borrador para el periódico escolar.
  // Colores: lo que retoma o lo que se presenta, i; el lado que falla, o; la oración que encaja, f.
  // Códigos: RV9 (choca sin decir «no»), RVK3, RVK11 (un solo enlace), RVK12 (repite sin preparar) y RVK13 (creencia
  // dicha como hecho).

  // El juego: cada candidata dice si retoma algo de la 1 (los libros donados) y si presenta la revisión que nombra la 3.
  const CAND5 = [
    { t: 'Primero, el equipo abrió las cajas y revisó libro por libro.', b: 'Primero, el equipo…', antes: true, despues: true },
    { t: 'El equipo de la biblioteca es de 5.º A.', b: 'El equipo de la biblioteca…', antes: true, despues: false },
    { t: 'Las cajas llegaron el lunes en un camión de la municipalidad.', b: 'Las cajas llegaron…', antes: true, despues: false },
    { t: 'Los alumnos de 4.º revisaron sus cuadernos de Matemática.', b: 'Los alumnos de 4.º…', antes: false, despues: false },
  ];
  const LECT5 = [null, 'no presenta la revisión que nombra la 3', 'retoma las cajas, pero no presenta la revisión', 'habla de cuadernos, no de los libros'];
  const listo5 = val => val.c > 0 && CAND5[val.c - 1].antes && CAND5[val.c - 1].despues;
  const borrador5 = val => papel('cuaderno', 'Cuaderno de Elena', 'Borrador para el periódico escolar', 'Elena', 'el periódico escolar', [
    oracion('b1', 'La biblioteca del colegio recibió [a:tres cajas de libros donados].'),
    oracion('b2', '[w:¿…?]', { w: val.c ? CAND5[val.c - 1].t : HUECO }, { w: CAND5[2].t }),
    oracion('b3', 'Después de [r:esa revisión], los libros buenos fueron a los estantes.'),
    { id: 'b4', t: 'Los que tenían páginas sueltas se mandaron a encuadernar.' },
  ]);
  const INI5 = { c: 0 };
  const est5 = val => {
    if (!val.c) return { marcas: {} };
    const k = CAND5[val.c - 1], ok = listo5(val);
    return { marcas: { b2w: ok ? 'f' : 'o', b1a: k.antes ? 'i' : 'o', b3r: k.despues ? 'i' : 'o' } };
  };
  const lectura5 = val => {
    if (!val.c) return ['Toca el espacio y prueba una oración'];
    if (listo5(val)) return [justo('Retoma las cajas y presenta la revisión')];
    return [prop('Esta oración'), ` ${LECT5[val.c - 1]}`];
  };

  // La predicción: la siguiente anuncia con «sin embargo» que algo esperado no pasó.
  const PL_DONA5 = '[w:¿…?]';
  const DONA5 = (w, marcas) => ({ datos: papel('mural', 'Periódico escolar', 'La donación', 'el equipo de prensa', 'todo el colegio', [
    { id: 'd1', t: 'El colegio recibió libros donados para su biblioteca.' },
    oracion('d2', PL_DONA5, w ? { w } : null),
    oracion('d3', '[p:Sin embargo], al revisarlos, se vio que [q:solo una parte] necesitaba arreglo.'),
    { id: 'd4', t: 'Los demás fueron directo a los estantes.' },
  ]), estado: marcas ? { marcas } : {} });
  const BUENA5 = 'Al recibirlos, la bibliotecaria pensó que todos estaban rotos.';

  // Los Datos de la idea: las tres pruebas de la oración que falta (contrato, punto 13).
  const D_ANTES = 'Encaja antes: la oración retoma algo de la oración anterior.';
  const D_DESPUES = 'Encaja después: presenta lo que la siguiente nombra o lo que anuncia su conector.';
  const D_TEXTO = 'Encaja en el texto: no lo contradice ni cambia de tema.';
  const D_CREE = 'Lo que alguien cree o piensa no es un hecho del texto.';
  const D_IDEA5 = [D_ANTES, D_DESPUES, D_TEXTO, D_CREE];

  // «Así se resuelve»: la buena es B, E, C y D (cada letra cuatro veces en las 20 hojas de la unidad).
  const REGLA5 = 'La oración que falta retoma lo de antes, prepara lo que la siguiente nombra o anuncia, y no contradice el texto.';
  const RESUELVE_5 = [
    { sop: sim(9, ors('h', ['[a:El ichu] es una planta de la puna.', 'Crece en matas duras y altas.', '[w:¿…?]', '[p:Por eso], en las comunidades se cuida que no se queme.']),
      '¿Qué oración completa el texto?', ['El ichu crece en la puna.', 'Sirve de alimento a las llamas y alpacas.', 'Las llamas duermen en corrales de piedra.', 'El ichu no sirve para nada.', 'En la costa crecen otras plantas.']), buena: 'B',
      pide: 'Piden la oración 3: la que encaja con la 2 y con la 4.', datos: D_IDEA5,
      tengo: [cubre('«Por eso»'), ' pide una razón para cuidar ', cubre('el ichu'), '.'],
      malas: [mala('A'), ' repite la 1. ', mala('C'), ' no da una razón para cuidar el ichu. ', mala('D'), ' choca con cuidarlo. ', mala('E'), ' cambia de tema.'],
      bien: [buena('B'), ': ', justo('sirve de alimento'), ', y por eso se cuida.'],
      sentido: 'Relee: el ichu alimenta a las llamas y alpacas; por eso se cuida que no se queme.' },
    { sop: sim(10, ors('h', ['La profesora dejó una tarea larga para el lunes.', '[w:¿…?]', '[p:Sin embargo], todos la entregaron a tiempo.']),
      '¿Qué oración completa el texto?', ['Nadie entregó la tarea el lunes.', 'La tarea era de Historia del Perú.', 'Los alumnos de quinto también tienen examen de Física el martes.', 'La profesora revisó las tareas el martes.', 'Muchos pensaron que no les alcanzaría el tiempo.']), buena: 'E',
      pide: 'Piden la oración 2: la que encaja con la 1 y con la 3.', datos: D_IDEA5,
      tengo: [cubre('«Sin embargo»'), ' anuncia que algo esperado no pasó: la 2 tiene que decir qué se esperaba.'],
      malas: [mala('A'), ' choca con la 3. ', mala('B'), ' y ', mala('D'), ' no dicen qué se esperaba. ', mala('C'), ' cambia de tema.'],
      bien: [buena('E'), ': ', justo('pensaron que no les alcanzaría'), ', y sí les alcanzó.'],
      sentido: 'Relee: muchos pensaron que no les alcanzaría el tiempo; sin embargo, todos la entregaron.' },
    { sop: sim(11, ors('h', ['En Chucuito hay [a:un templo antiguo].', '[w:¿…?]', '[p:Esas piedras talladas] atraen a muchos visitantes.']),
      '¿Qué oración completa el texto?', ['El templo queda cerca del lago.', 'Muchas piedras del lugar se usan para construir casas.', 'Junto al templo hay un patio con piedras talladas.', 'Chucuito queda en Puno.', 'El templo no tiene ninguna piedra.']), buena: 'C',
      pide: 'Piden la oración 2: la que encaja con la 1 y con la 3.', datos: D_IDEA5,
      tengo: [cubre('«Esas piedras talladas»'), ' piden que alguien las presente antes, junto a ', cubre('un templo antiguo'), '.'],
      malas: [mala('A'), ' y ', mala('D'), ' no presentan las piedras. ', mala('B'), ' habla de otras piedras. ', mala('E'), ' choca con la 3.'],
      bien: [buena('C'), ': retoma ', justo('el templo'), ' y presenta ', justo('las piedras talladas'), '.'],
      sentido: 'Relee: hay un templo antiguo, junto a él hay piedras talladas, y esas piedras atraen a muchos visitantes.' },
    { sop: sim(12, ors('h', ['Ana quería aprender a tocar charango.', 'Su abuelo le regaló uno por su cumpleaños.', '[w:¿…?]', '[p:Gracias a esas clases], ya toca tres huainos.']),
      '¿Qué oración completa el texto?', ['El charango tiene diez cuerdas.', 'Ana cumplió quince años en marzo.', 'Ana nunca tocó el charango.', 'Desde entonces, va a clases en la casa de cultura.', 'La casa de cultura queda en la plaza principal de Juli.']), buena: 'D',
      pide: 'Piden la oración 3: la que encaja con la 2 y con la 4.', datos: D_IDEA5,
      tengo: [cubre('«Esas clases»'), ' piden que la 3 presente unas clases.'],
      malas: [mala('A'), ' y ', mala('B'), ' no presentan clases. ', mala('C'), ' choca con la 4. ', mala('E'), ' nombra el lugar, no las clases.'],
      bien: [buena('D'), ': presenta ', justo('las clases'), ' después del regalo.'],
      sentido: 'Relee: le regaló un charango; desde entonces va a clases; gracias a esas clases toca tres huainos.' },
  ];

  // «Ahora tú»: seis casos de cuatro opciones; cada prueba de la regla (antes, después, el conector, la creencia, la
  // contradicción, un texto de cuatro oraciones).
  const AHORA_5 = [
    { o: ['El viento rompió el techo del aula de 3.º.', '[w:¿…?]', '[p:Por eso], los alumnos de 3.º estudian en la biblioteca.'], pregunta: '¿Qué oración va en el espacio?', ok: 'Mientras lo arreglan, esa aula no se puede usar.', datos: D_IDEA5,
      por: 'Retoma el techo roto y da la razón que pide «por eso».',
      m: [['El aula de 3.º tiene ventanas grandes que dan al patio.', 'RVK12', 'Es cierto que retoma el aula, pero sus ventanas no explican por qué los alumnos estudian en la biblioteca.'],
        ['La biblioteca abre en las tardes.', 'RVK11', 'Nombra la biblioteca, es cierto, pero no retoma el techo roto ni da la razón que pide «por eso».'],
        ['Todas las aulas quedaron sin daño.', 'RV9', 'Habla de las aulas, pero choca con la 1: el viento sí rompió el techo del aula de 3.º.']] },
    { o: ['Doña Julia tiene un puesto en el mercado de Puno.', '[w:¿…?]', '[p:Esas truchas] llegan a su puesto cada mañana desde el lago.'], pregunta: '¿Qué oración va en el espacio?', ok: 'En su puesto vende truchas del lago.', datos: D_IDEA5,
      por: 'Retoma el puesto y presenta las truchas que nombra la siguiente.',
      m: [['Su puesto abre a las cinco de la mañana.', 'RVK12', 'Retoma el puesto, sí, pero no presenta las truchas que la siguiente nombra con «esas truchas».'],
        ['Las truchas se crían en jaulas del lago.', 'RVK11', 'Es cierto que presenta truchas, pero no retoma el puesto de doña Julia: el texto salta de ella al lago.'],
        ['En su puesto no hay ningún pescado.', 'RV9', 'Retoma el puesto, es cierto, pero choca con la siguiente: si las truchas llegan a su puesto cada mañana, ahí sí hay pescado.']] },
    { o: ['La familia Mamani sembró papa en octubre.', '[w:¿…?]', '[p:Sin embargo], la helada de enero dañó media chacra.'], pregunta: '¿Qué oración va en el espacio?', ok: 'Esperaban una cosecha muy grande en mayo.', datos: D_IDEA5,
      por: '«Sin embargo» anuncia que algo esperado no pasó, y lo esperado es una cosecha grande.',
      m: [['La helada de ese año fue más fuerte que la de otros años.', 'RVK11', 'Prepara la helada, sí, pero no dice qué se esperaba antes del «sin embargo».'],
        ['Ese año, la papa no se dañó nada.', 'RV9', 'Es cierto que habla de la papa, pero choca con la siguiente, que cuenta que la helada dañó media chacra.'],
        ['La familia Mamani vive en Lampa.', 'RVK3', 'Retoma a la familia, es cierto, pero dónde vive no dice qué esperaban, y el «sin embargo» queda sin preparar.']] },
    { o: ['El club de ciencias preparó un cohete de agua.', '[w:¿…?]', '[p:Sin embargo], el cohete subió más de diez metros.'], pregunta: '¿Qué oración va en el espacio?', ok: 'Los chicos creían que no despegaría.', datos: D_IDEA5,
      por: 'Lo que creían los chicos es lo esperado que «sin embargo» rompe.',
      m: [['El cohete no llegó a despegar.', 'RVK13', 'Dice lo que se esperaba, pero como un hecho: así contradice la siguiente, donde el cohete sí sube.'],
        ['El cohete era de una botella de plástico.', 'RVK12', 'Retoma el cohete, sí, pero de qué está hecho no dice qué se esperaba antes del «sin embargo».'],
        ['Ese club también tiene un microscopio.', 'RVK3', 'Es cierto que habla del club, pero el microscopio cambia de tema y no prepara el «sin embargo».']] },
    { o: ['En Puno se celebra la Candelaria.', '[w:¿…?]', '[p:Esas comparsas] ensayan desde noviembre.'], pregunta: '¿Qué oración va en el espacio?', ok: 'En la fiesta desfilan cientos de comparsas.', datos: D_IDEA5,
      por: 'Retoma la fiesta y presenta las comparsas que nombra la siguiente.',
      m: [['La fiesta se celebra en febrero.', 'RVK11', 'Retoma la fiesta, es cierto, pero no presenta las comparsas que nombra la siguiente.'],
        ['La Candelaria no tiene comparsas.', 'RV9', 'Nombra las comparsas, sí, pero niega que existan, y la siguiente dice que ensayan.'],
        ['Los turistas llenan los hoteles de la ciudad en esos días.', 'RVK3', 'Es cierto que habla de la fiesta, pero los hoteles cambian de tema y no presentan las comparsas.']] },
    { o: ['El colegio de Macusani tiene un huerto.', 'En el huerto, los alumnos siembran habas y papas.', '[w:¿…?]', '[p:Con ese dinero] compraron semillas nuevas.'], pregunta: '¿Qué oración va en el espacio?', ok: 'El año pasado vendieron la cosecha en la feria.', datos: D_IDEA5,
      por: 'Retoma lo sembrado y presenta el dinero que nombra la siguiente.',
      m: [['Las habas necesitan mucha agua.', 'RVK12', 'Retoma las habas, es cierto, pero no presenta el dinero que nombra la siguiente.'],
        ['En la feria de Macusani se venden muchos productos.', 'RVK11', 'Habla de vender, sí, pero no dice que los alumnos vendieran algo ni que ganaran dinero.'],
        ['El huerto nunca dio cosecha.', 'RV9', 'Es cierto que retoma el huerto, pero choca con la 2: si nunca dio cosecha, no hay nada que vender.']] },
  ];

  // Ejemplos resueltos de la idea 5. Nivel 1: una prueba de un lado (¿encaja antes?, ¿después?, ¿choca?). Nivel 2: tres
  // de una lista. Nivel 3: la hoja de simulacro (formato UNI, hipótesis); las correctas son A, B, C, D y E. Revisado
  // aparte (scratchpad e9-verbal/rev/revisa.js): una tabla de qué retoma, qué presenta y con qué choca cada candidata.
  const EJEMPLOS_5 = [
    { nivel: 1, titulo: 'La feria de libros',
      enunciado: '¿La oración «Cada sección trajo libros usados» encaja en el espacio?',
      datos: D_IDEA5,
      figura: fig(papel('mural', 'Periódico mural de 5.º B', 'Noticias', 'el equipo de prensa', 'todo el colegio', ors('k', ['El colegio organizó una feria de libros.', '[w:¿…?]', 'Esos libros se vendieron a mitad de precio.']))),
      solucion: [{ texto: ['Retoma ', cubre('la feria'), ' y presenta ', cubre('los libros usados'), ' que nombra la 3.'] }],
      respuesta: [justo('Sí'), ': encaja antes y después'] },
    { nivel: 1, titulo: 'El paradero de la combi',
      enunciado: '¿La oración «Las combis son de color blanco» encaja con la oración 3?',
      datos: D_IDEA5,
      figura: fig(papel('cartel', 'Cartel del paradero', 'Aviso', 'la empresa de combis', 'los pasajeros', ors('k', ['El paradero de la combi está frente al mercado.', '[w:¿…?]', '[p:Esa espera] molesta a los pasajeros.']))),
      solucion: [{ texto: [cubre('«Esa espera»'), ' pide que alguien la presente; el color de las combis no la presenta.'] }],
      respuesta: [justo('No'), ': no presenta ninguna espera'] },
    { nivel: 1, titulo: 'El partido con lluvia',
      enunciado: '¿Por qué «Todos pensaban que el partido se suspendería» encaja antes de la oración 3?',
      datos: D_IDEA5,
      figura: fig(papel('mensaje', 'Club de fútbol', null, 'el entrenador', 'el equipo', ors('k', ['Ayer llovió toda la tarde en Juliaca.', '[w:¿…?]', '[p:Sin embargo], el partido se jugó igual.']))),
      solucion: [{ texto: [cubre('«Sin embargo»'), ' rompe algo esperado; la oración dice qué se esperaba: la suspensión.'] }],
      respuesta: [justo('Prepara lo que «sin embargo» rompe')] },
    { nivel: 1, titulo: 'Nadie reprobó',
      enunciado: '¿Puede ir «Tres alumnos reprobaron Matemática este año» en el espacio?',
      datos: D_IDEA5,
      figura: fig(papel('mural', 'Mural del colegio', 'Buenas noticias', 'la Dirección', 'las familias', ors('k', ['[p:Este año, nadie de la promoción reprobó] Matemática.', '[w:¿…?]', 'Todos pasaron a quinto con buenas notas.']))),
      solucion: [{ texto: ['Choca con ', cubre('«nadie reprobó»'), ', del mismo año y la misma promoción.'] }],
      respuesta: [justo('No'), ': contradice la oración 1'] },
    { nivel: 1, titulo: 'El club de ajedrez',
      enunciado: '¿Puede ir «La cancha de fútbol tiene césped nuevo» en el espacio?',
      datos: D_IDEA5,
      figura: fig(papel('mural', 'Mural del colegio', 'Clubes', 'el club de ajedrez', 'los estudiantes', ors('k', ['El club de ajedrez se reúne los martes.', '[w:¿…?]', '[p:En esas partidas], los mayores enseñan a los nuevos.']))),
      solucion: [{ texto: ['No retoma el club ni presenta ', cubre('las partidas'), ': cambia de tema.'] }],
      respuesta: [justo('No'), ': no encaja de ningún lado'] },

    { nivel: 2, titulo: 'El mercado de madrugada',
      enunciado: '¿Qué oración va en el espacio: «A las cuatro ya entran los camiones de carga», «El mercado tiene muchos pasillos y muchas puertas» o «Los buses de Lima son nuevos»?',
      datos: D_IDEA5,
      figura: fig(papel('folleto', 'Folleto de la municipalidad de Juliaca', 'Nuestro mercado', 'la municipalidad', 'los visitantes', ors('k', ['El mercado de Juliaca abre muy temprano.', '[w:¿…?]', '[p:Esos camiones] llegan de la costa con fruta.']))),
      solucion: [
        { texto: ['Retoma ', cubre('lo temprano'), ' y presenta ', cubre('los camiones'), ' que nombra la 3.'] },
        { texto: [prop('Los pasillos'), ' no presentan camiones; ', prop('los buses de Lima'), ' tampoco.'] }],
      respuesta: [justo('«A las cuatro ya entran los camiones de carga»')] },
    { nivel: 2, titulo: 'Las vacunas de la posta',
      enunciado: '¿Qué oración va en el espacio: «Los niños jugaron en el patio», «Algunos niños se enfermaron de sarampión» o «La vacuna protege contra el sarampión»?',
      datos: D_IDEA5,
      figura: fig(papel('puerta', 'Puerta de la posta de Lampa', 'Aviso', 'la posta', 'las familias', ors('k', ['La posta de Lampa vacunó a todos los niños.', '[w:¿…?]', '[p:Por eso], ningún niño se enfermó de sarampión.']))),
      solucion: [
        { texto: [cubre('«Por eso»'), ' pide la razón de que nadie se enfermara: la vacuna protege.'] },
        { texto: [prop('El patio'), ' no es una razón; ', prop('«algunos se enfermaron»'), ' choca con la 3.'] }],
      respuesta: [justo('«La vacuna protege contra el sarampión»')] },
    { nivel: 2, titulo: 'El concurso de dibujo',
      enunciado: '¿Qué oración va en el espacio: «El concurso fue en el patio», «Muchos esperaban que ganara uno de quinto» o «Un alumno de primero ganó el premio del concurso»?',
      datos: D_IDEA5,
      figura: fig(papel('mural', 'Mural del colegio', 'Arte', 'el club de arte', 'todo el colegio', ors('k', ['El colegio hizo un concurso de dibujo.', '[w:¿…?]', '[p:Sin embargo], el premio fue para un alumno de primero.']))),
      solucion: [
        { texto: [cubre('«Sin embargo»'), ' rompe algo esperado: que ganara uno de quinto.'] },
        { texto: [prop('«El concurso fue en el patio»'), ' no dice qué se esperaba; ', prop('«Un alumno de primero ganó el premio del concurso»'), ' repite la 3.'] }],
      respuesta: [justo('«Muchos esperaban que ganara uno de quinto»')] },
    { nivel: 2, titulo: 'El pozo de la comunidad',
      enunciado: '¿Qué oración va en el espacio: «El pozo da agua limpia todo el año», «El pozo quedó seco desde el primer día» o «La comunidad tiene una escuela»?',
      datos: D_IDEA5,
      figura: fig(papel('cartel', 'Cartel de la comunidad de Jayllihuaya', 'Obra terminada', 'la junta comunal', 'los comuneros', ors('k', ['La comunidad abrió un pozo nuevo.', '[w:¿…?]', '[p:Esa agua] sirve para regar las chacras.']))),
      solucion: [
        { texto: ['Retoma ', cubre('el pozo'), ' y presenta ', cubre('el agua'), ' que nombra la 3.'] },
        { texto: [prop('«Quedó seco»'), ' choca con la 3; ', prop('la escuela'), ' cambia de tema.'] }],
      respuesta: [justo('«El pozo da agua limpia todo el año»')] },
    { nivel: 2, titulo: 'La biblioteca de aula',
      enunciado: '¿Qué oración va en el espacio: «La biblioteca tiene un estante azul», «Las novelas que leemos son de autores peruanos» o «Cada alumno puso una cuota de dos soles»?',
      datos: D_IDEA5,
      figura: fig(papel('mural', 'Periódico mural de 5.º B', 'Nuestra biblioteca', 'el equipo de prensa', 'todo el colegio', ors('k', ['En 5.º B armamos una biblioteca de aula.', '[w:¿…?]', '[p:Con esa cuota] compramos diez novelas.']))),
      solucion: [
        { texto: [cubre('«Esa cuota»'), ' pide que alguien presente una cuota antes.'] },
        { texto: [prop('El estante'), ' y ', prop('las novelas'), ' no presentan ninguna cuota.'] }],
      respuesta: [justo('«Cada alumno puso una cuota de dos soles»')] },

    { nivel: 3, titulo: 'La fibra de alpaca',
      enunciado: 'Pregunta 21 del simulacro. ¿Qué oración completa el texto?',
      datos: D_IDEA5,
      figura: fig(sim(21, ors('h', ['La alpaca da una fibra muy fina.', '[w:¿…?]', 'Con esas prendas, muchas familias de Puno ganan su sustento.']),
        '¿Qué oración completa el texto?', ['Con esa fibra se tejen chompas, chalinas y mantas.', 'La alpaca vive en la puna.', 'Las prendas de algodón son baratas.', 'La fibra de alpaca no sirve para tejer ninguna prenda.', 'Muchas familias de Puno viajan a Lima.'])),
      solucion: [
        { texto: [cubre('«Esas prendas»'), ' piden que alguien las presente; la 2 debe retomar ', cubre('la fibra'), '.'] },
        { texto: [mala('B'), ' no presenta prendas. ', mala('C'), ' habla de otras prendas. ', mala('D'), ' choca con la 3. ', mala('E'), ' cambia de tema.'] },
        { texto: [buena('A'), ': retoma ', justo('la fibra'), ' y presenta ', justo('las prendas'), '.'] }],
      respuesta: [buena('A'), ': con esa fibra se tejen chompas, chalinas y mantas'] },
    { nivel: 3, titulo: 'El simulacro de sismo',
      enunciado: 'Pregunta 22 del simulacro. ¿Qué oración completa el texto?',
      datos: D_IDEA5,
      figura: fig(sim(22, ors('h', ['El lunes hubo simulacro de sismo en el colegio.', '[w:¿…?]', 'Sin embargo, todos salieron al patio en menos de dos minutos.']),
        '¿Qué oración completa el texto?', ['Todos salieron al patio muy rápido.', 'La directora temía que los de primero se demoraran.', 'Nadie salió del aula durante todo el simulacro de sismo.', 'El simulacro de sismo es obligatorio.', 'Los bomberos tienen una sirena nueva.'])),
      solucion: [
        { texto: [cubre('«Sin embargo»'), ' rompe algo esperado: la 2 tiene que decir qué se esperaba.'] },
        { texto: [mala('A'), ' repite la 3. ', mala('C'), ' choca con la 3. ', mala('D'), ' no dice qué se esperaba. ', mala('E'), ' cambia de tema.'] },
        { texto: [buena('B'), ': lo que ', justo('temía la directora'), ' es lo que no pasó.'] }],
      respuesta: [buena('B'), ': la directora temía que los de primero se demoraran'] },
    { nivel: 3, titulo: 'Los tejidos de Taquile',
      enunciado: 'Pregunta 23 del simulacro. ¿Qué oración completa el texto?',
      datos: D_IDEA5,
      figura: fig(sim(23, ors('h', ['Cerca de Puno está la isla de Taquile.', '[w:¿…?]', 'Ese arte textil es conocido en todo el mundo.']),
        '¿Qué oración completa el texto?', ['La isla queda en el lago Titicaca.', 'Los turistas llegan en lancha desde el muelle de Puno.', 'Allí, hombres y mujeres tejen chullos y fajas.', 'En Taquile nadie sabe tejer.', 'El arte del Cusco es muy antiguo.'])),
      solucion: [
        { texto: [cubre('«Ese arte textil»'), ' pide que antes se hable de tejer en ', cubre('la isla'), '.'] },
        { texto: [mala('A'), ' y ', mala('B'), ' no hablan de tejidos. ', mala('D'), ' choca con la 3. ', mala('E'), ' habla de otro lugar.'] },
        { texto: [buena('C'), ': ', justo('tejen chullos y fajas'), ' en Taquile.'] }],
      respuesta: [buena('C'), ': allí, hombres y mujeres tejen chullos y fajas'],
      fuente: 'UNESCO, «Arte textil de Taquile» (Lista Representativa del Patrimonio Cultural Inmaterial, 2008)' },
    { nivel: 3, titulo: 'Raúl y la UNI',
      enunciado: 'Pregunta 24 del simulacro. ¿Qué oración completa el texto?',
      datos: D_IDEA5,
      figura: fig(sim(24, ors('h', ['Raúl quería estudiar Ingeniería en la UNI.', 'Durante un año se preparó en una academia.', '[w:¿…?]', 'Esa nota le alcanzó para ingresar.', 'Hoy estudia en Lima.']),
        '¿Qué oración completa el texto?', ['La academia quedaba en Juliaca.', 'Raúl nunca dio el examen.', 'La UNI queda en el distrito del Rímac, en Lima.', 'En el examen de admisión sacó una nota alta.', 'Sus amigos también se prepararon en una academia.'])),
      solucion: [
        { texto: [cubre('«Esa nota»'), ' pide que la 3 presente una nota.'] },
        { texto: [mala('A'), ', ', mala('C'), ' y ', mala('E'), ' no presentan ninguna nota. ', mala('B'), ' choca con ingresar.'] },
        { texto: [buena('D'), ': el examen es aquello para lo que Raúl se preparó, y la oración presenta ', justo('la nota'), '.'] }],
      respuesta: [buena('D'), ': en el examen de admisión sacó una nota alta'] },
    { nivel: 3, titulo: 'Los cuyes de los Quispe',
      enunciado: 'Pregunta 25 del simulacro. ¿Qué oración completa el texto?',
      datos: D_IDEA5,
      figura: fig(sim(25, ors('h', ['La familia Quispe crio cuyes por primera vez.', '[w:¿…?]', 'Sin embargo, en un año ya tenían más de cien.']),
        '¿Qué oración completa el texto?', ['Los cuyes comen alfalfa.', 'Al año, la familia tenía solo cinco cuyes.', 'Los vecinos crían gallinas.', 'Los cuyes se venden bien en la feria del domingo.', 'Al empezar, pensaban que no lograrían criarlos.'])),
      solucion: [
        { texto: [cubre('«Sin embargo»'), ' rompe algo esperado: la 2 dice qué se esperaba.'] },
        { texto: [mala('A'), ' y ', mala('D'), ' no dicen qué se esperaba. ', mala('B'), ' choca con la 3. ', mala('C'), ' cambia de tema.'] },
        { texto: [buena('E'), ': ', justo('pensaban que no lograrían'), ', y lo lograron.'] }],
      respuesta: [buena('E'), ': al empezar, pensaban que no lograrían criarlos'] },
  ];

  const incluir = {
    id: 'incluir',
    titulo: 'La oración que falta',
    pregunta: '¿Cómo se sabe qué oración falta en un texto?',
    temas: ['Inclusión de enunciado'],
    pieza: 'rv-soporte',
    lee: {
      tarjetas: [
        { titulo: 'El borrador de Elena', texto: 'Elena escribe para el periódico escolar sobre unos libros donados. Al copiar su borrador, se le borró la oración 2. Tiene cuatro oraciones para probar en ese espacio.',
          pieza: 'rv-soporte', dibujo: { datos: borrador5(INI5), estado: {} } },
        { titulo: 'Una pregunta de examen', texto: 'En el examen, una pregunta de inclusión da un texto al que le falta una oración, y varias oraciones para elegir. La que va tiene que encajar en su lugar.' },
        { titulo: 'Qué mirar al jugar', texto: 'Prueba cada oración en el espacio y lee el borrador entero. Mira la oración 1 y la oración 3: ¿la nueva se apoya en una y prepara la otra?' },
      ],
    },
    actividad: 'Probar cuatro oraciones en el espacio del borrador y ver cuál encaja.',
    aprendizaje: 'La oración que falta retoma lo de antes, prepara lo que la siguiente nombra o anuncia, y no contradice el texto.',
    ejemplos: EJEMPLOS_5,
    juega: {
      consigna: 'Al borrador de Elena le falta la oración 2, justo antes de la oración 3, que habla de «esa revisión».',
      mision: {
        texto: 'Pon en el espacio la oración que encaja con la 1 y con la 3.',
        logrado: listo5,
        bien: 'Retoma las cajas de la 1 y presenta la revisión que nombra la 3.',
      },
      voz: '¿La nueva oración se apoya en la 1 y prepara la 3?',
      leyenda: [
        { s: 'negrita', t: 'la oración que se prueba' },
        { s: cubre('turquesa'), t: 'el lado que encaja' },
        { s: prop('naranja'), t: 'el lado que no encaja' },
        { s: justo('violeta'), t: 'la oración que encaja' },
      ],
      controles: [{ id: 'c', etiqueta: 'Oración 2', opciones: [{ valor: 0, texto: HUECO }].concat(CAND5.map((k, v) => ({ valor: v + 1, texto: k.b }))) }],
      dibujo: val => ({ datos: Object.assign({ toques: { b2: 'c' } }, borrador5(val)), estado: est5(val) }),
      lectura: lectura5,
      minimo: 3,
    },
    predice: {
      pregunta: 'En el periódico escolar falta la oración 2. ¿Cuál completa el texto?',
      voz: 'Elige antes de ver: después lo comprobamos.',
      opciones: opciones(BUENA5, [
        ['Todos los libros donados necesitaban arreglo.', 'RVK13', 'Prepara lo que rompe «sin embargo», es cierto, pero dicho como un hecho choca con «solo una parte necesitaba arreglo».'],
        ['El colegio también organizó ese mes un campeonato de ajedrez entre secciones.', 'RVK3', 'Habla del colegio, sí, pero cambia de tema y no dice qué se esperaba antes del «sin embargo».'],
        ['Los libros donados eran para la biblioteca.', 'RVK12', 'Es cierto que retoma los libros, pero repite lo que dice la 1 y no dice qué se esperaba antes del «sin embargo».'],
      ]),
      dibujo: DONA5(),
      revelar: DONA5(BUENA5, { d2w: 'f', d3p: 'i', d3q: 'i' }),
      coincide: 'Coincide: «sin embargo» pide algo esperado, y una creencia lo da sin chocar.',
    },
    mira: {
      datos: DONA5(BUENA5).datos,
      voz: 'Leamos lo que pide la oración 3.',
      pasos: [
        { estado: { marcas: { d3p: 'i' }, nuevo: ['d3p'] }, texto: '«Sin embargo» anuncia que algo esperado no pasó.',
          ecuacion: [cubre('sin embargo'), ': algo se esperaba'] },
        { estado: { marcas: { d3p: 'i', d3q: 'i' }, nuevo: ['d3q'] }, texto: 'Lo que pasó es que solo una parte necesitaba arreglo; entonces, se esperaba que fueran más.',
          ecuacion: [cubre('solo una parte'), ' ← se esperaba más'] },
        { estado: { marcas: { d3p: 'i', d3q: 'i', d2w: 'o' }, nuevo: ['d2w'] }, texto: 'Dicho como hecho, «todos estaban rotos» chocaría con «solo una parte».',
          ecuacion: [prop('todos'), ' + ', cubre('solo una parte'), ' → ', { negrita: 'choque' }] },
        { estado: { marcas: { d3p: 'i', d3q: 'i', d2w: 'f' }, nuevo: ['d2w'] }, texto: 'Con «la bibliotecaria pensó», lo esperado es una creencia y no un hecho: encaja antes y después.',
          ecuacion: [justo('pensó que…'), ' → ', cubre('sin embargo')] },
      ],
    },
    regla: {
      texto: 'La oración que falta retoma lo de antes, prepara lo que la siguiente nombra o anuncia, y no contradice el texto. Se prueban las tres cosas en cada alternativa.',
      ecuacion: [cubre('retoma lo de antes'), ' + ', cubre('prepara lo que sigue'), ' + ', 'sin choque'],
      voz: 'Una sola prueba no basta: pasa las tres.',
      condicion: 'la oración se lee bien con la de antes, con la de después y con el texto entero.',
    },
    resuelve: {
      pieza: 'rv-soporte',
      generar(s) { return resuelveDe(RESUELVE_5[s % RESUELVE_5.length], REGLA5); },
    },
    ahoraTu: {
      pieza: 'rv-soporte',
      voz: 'Otro texto. Lee la oración de antes y la de después.',
      generar(s) { return ahoraDe(AHORA_5, 13, s, D_IDEA5); },
    },
  };


  // ---------- Glosario: cada idea estrena de 2 a 4 términos, con `simple` y tres ejemplos ----------
  // Idea 1: cohesión, coherencia, contradicción (se muda desde Eliminación de oraciones: en la rama, esta unidad va
  // antes) y pronombre; idea 2: referente, concordancia, anáfora y catáfora; idea 3: repetición, sustitución y elipsis;
  // idea 4: tópico y comento; idea 5: inclusión y creencia. Los ejemplos no traen la respuesta de ninguna predicción ni
  // una oración de los juegos, los resueltos o los ejercicios (lo prueba cohesion-y-coherencia.test.js).
  const GLOSARIO = [
    { termino: 'cohesión', def: 'Unión visible entre las oraciones de un texto, hecha con conectores, pronombres o palabras que se repiten.',
      simple: 'Las palabras que amarran una oración con la siguiente.',
      ejemplos: ['En «Llegó Ana. Ella traía pan», «ella» amarra las dos oraciones.', 'Un «por eso» entre dos oraciones también da cohesión.', 'Un texto puede tener cohesión y, aun así, no tener sentido.'],
      formas: ['cohesión'], ver: ['coherencia', 'conector'] },
    { termino: 'coherencia', def: 'Cualidad de un texto cuyas oraciones forman un sentido y se pueden creer juntas.',
      simple: 'Que todo el texto tenga sentido de principio a fin.',
      ejemplos: ['Una receta que dice «sin sal» y luego «échale sal» no tiene coherencia.', 'Un cuento de animales que hablan puede ser coherente.', 'La coherencia se juzga leyendo el texto entero, no una oración.'],
      formas: ['coherencia', 'coherente', 'coherentes'], ver: ['cohesión', 'contradicción'] },
    { termino: 'contradicción', def: 'Choque entre dos afirmaciones que no pueden ser verdaderas al mismo tiempo.',
      simple: 'Decir algo y también lo contrario de lo mismo.',
      ejemplos: ['«Nadie vino» y «vino Pedro», del mismo día, se contradicen.', '«La olla está llena» y «la olla está vacía», en el mismo momento.', 'Una contradicción no se arregla con un conector.'],
      formas: ['contradicción', 'contradicciones', 'contradice', 'contradicen', 'contradiga', 'contradecirse'], ver: ['coherencia'] },
    { termino: 'pronombre', def: 'Palabra que ocupa el lugar de un nombre para no repetirlo, como él, ella, lo, las o esto.',
      simple: 'Una palabra corta que reemplaza a un nombre.',
      ejemplos: ['En «Compré pan y lo comí», «lo» reemplaza a «pan».', '«Ellas», «les» y «eso» también son pronombres.', 'Un pronombre evita decir el mismo nombre muchas veces.'],
      formas: ['pronombre', 'pronombres'], ver: ['referente'] },
    { termino: 'referente', def: 'Aquello que nombra un pronombre u otra palabra que remite a algo del texto.',
      simple: 'La persona, cosa o idea de la que se está hablando.',
      ejemplos: ['En «Vi a Luis y lo saludé», el referente de «lo» es Luis.', 'El referente de «eso» puede ser un hecho entero.', 'Cada pronombre de un texto tiene su referente.'],
      formas: ['referente', 'referentes'], ver: ['pronombre', 'anáfora'] },
    { termino: 'concordancia', def: 'Coincidencia de género y número entre palabras que se refieren a lo mismo.',
      simple: 'Que dos palabras vayan juntas en masculino o femenino, singular o plural.',
      ejemplos: ['«Las» concuerda con «semillas»: femenino y plural.', '«Él» no concuerda con «la mesa».', 'La concordancia descarta candidatos, pero no elige sola.'],
      formas: ['concordancia', 'concuerda', 'concuerdan', 'concordar'], ver: ['pronombre'] },
    { termino: 'anáfora', def: 'Palabra que retoma algo dicho antes en el texto.',
      simple: 'Una palabra que mira hacia atrás en el texto.',
      ejemplos: ['«Vi a Luis. Él me saludó»: «él» mira atrás.', '«Llegó la carta y la leí»: «la» retoma la carta.', 'La mayoría de los pronombres de un texto son anáforas.'],
      formas: ['anáfora', 'anáforas'], ver: ['catáfora', 'referente'] },
    { termino: 'catáfora', def: 'Palabra que anuncia algo que se dice después en el texto.',
      simple: 'Una palabra que mira hacia adelante en el texto.',
      ejemplos: ['«Te advierto algo: no toques el cable.»', '«Compramos lo siguiente: cinta y papel.»', 'Los dos puntos suelen venir después de una catáfora.'],
      formas: ['catáfora', 'catáforas'], ver: ['anáfora'] },
    { termino: 'repetición', def: 'Recurso de volver a nombrar algo con la misma palabra para mantener el hilo del texto.',
      simple: 'Decir otra vez la misma palabra.',
      ejemplos: ['«El agua es vital. El agua limpia previene males.»', 'Repetir un nombre evita confundir a dos personas.', 'Repetir demasiado cansa al lector.'],
      formas: ['repetición', 'repeticiones'], ver: ['sustitución', 'elipsis'] },
    { termino: 'sustitución', def: 'Recurso de volver a nombrar algo con un pronombre, con otro nombre o con uno más general.',
      simple: 'Nombrar lo mismo con otras palabras.',
      ejemplos: ['«El cóndor… Esta ave…»', '«La trucha… Este pez…»', 'Un sustituto tiene que corresponder a lo que reemplaza.'],
      formas: ['sustitución', 'sustituciones'], ver: ['repetición', 'pronombre'] },
    { termino: 'elipsis', def: 'Recurso de callar algo ya dicho porque el lector lo recupera de lo dicho justo antes.',
      simple: 'No decir algo que ya se entiende.',
      ejemplos: ['«Llegué tarde y pedí disculpas»: no se repite «yo».', '«Rosa come pan; Ana, galletas»: se calla «come».', 'Callar no es una falta si se entiende qué se calló.'],
      formas: ['elipsis'], ver: ['repetición', 'sustitución'] },
    { termino: 'tópico', def: 'Lo ya conocido de lo que parte una oración para decir algo más.',
      simple: 'Lo que ya sabes cuando empieza la oración.',
      ejemplos: ['En «Ese perro ladra mucho», el tópico es «ese perro».', 'El tópico suele ir al comienzo de la oración.', 'Sin tópico conocido, el lector se pregunta de qué le hablan.'],
      formas: ['tópico', 'tópicos'], ver: ['comento'] },
    { termino: 'comento', def: 'Lo nuevo que una oración dice sobre su tópico.',
      simple: 'Lo nuevo que te cuenta la oración.',
      ejemplos: ['En «Ese perro ladra mucho», el comento es «ladra mucho».', 'El comento hace avanzar el texto.', 'El comento de una oración puede ser el tópico de la siguiente.'],
      formas: ['comento', 'comentos'], ver: ['tópico'] },
    { termino: 'inclusión', def: 'Tipo de pregunta de examen en que se elige la oración que falta en un texto.',
      simple: 'Poner en el texto la oración que le falta.',
      ejemplos: ['Una pregunta de inclusión trae un texto con un espacio.', 'En la inclusión se prueba cada alternativa en el espacio.', 'En una pregunta de inclusión, solo una alternativa encaja en el espacio.'],
      formas: ['inclusión'], ver: ['alternativa'] },
    { termino: 'creencia', def: 'Lo que una persona piensa que es cierto, sin que el texto lo afirme por su cuenta.',
      simple: 'Lo que alguien piensa, aunque no sea así.',
      ejemplos: ['«Luis cree que lloverá»: el texto no dice que lloverá.', 'Una creencia puede resultar falsa.', '«Pensó», «creía» y «supuso» marcan una creencia.'],
      formas: ['creencia', 'creencias'], ver: ['contradicción'] },
  ];
  const HISTORIA = {
    texto: 'En 1976, Halliday y Hasan describieron cómo se enlazan las oraciones de un texto en inglés. En 1981, Beaugrande y Dressler separaron la cohesión, que se ve en las palabras, de la coherencia, que está en el sentido. Por eso un texto lleno de enlaces puede no tener sentido.',
    pregunta: '¿Basta un «por eso» para que un texto tenga sentido?',
    // Antes el título decía «Matriz de teoría…» y el enlace iba al CVC: ahora el título dice qué es el enlace.
    fuente: { titulo: 'Instituto Cervantes, Diccionario de términos clave de ELE: cohesión', url: 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/diccio_ele/diccionario/cohesion.htm' },
  };

  // ---------- Laboratorio: una mesa por idea, con el juego sin la misión y sus retos ----------
  // Los retos los comprueban las mismas funciones que deciden el juego (choca1, PRON2, de3, hilo4, CAND5).
  const mesaHorario = Object.assign({ id: 'horario', titulo: 'El horario de la biblioteca', pieza: 'rv-soporte' }, sinMision(noContradiccion.juega), {
    invitaciones: [
      { texto: 'Guarda dos horarios con «todos los días» y días cerrados distintos.',
        logrado: (val, guardados) => val.a === 0 && guardados.some(g => g.a === 0 && g.c !== val.c),
        bien: 'Los dos chocan: «todos los días» no deja ningún día para cerrar.' },
      { texto: 'Arma un horario que no choque y en el que el sábado esté cerrado.',
        logrado: val => !choca1(val) && !ABRE1[val.a].dias.includes(6),
        bien: 'De lunes a viernes deja libre el fin de semana: ningún día choca.' },
      { texto: 'Guarda un horario que choque y otro que no.',
        logrado: (val, guardados) => guardados.some(g => choca1(g)) && guardados.some(g => !choca1(g)),
        bien: 'Compáralos: el choque está siempre en un día que abre y no atiende.' },
    ] });
  const mesaReferente = Object.assign({ id: 'referente', titulo: 'El mensaje de la mamá', pieza: 'rv-soporte' }, sinMision(referencia.juega), {
    invitaciones: [
      { texto: 'Une «lo» con un nombre que concuerde, pero no tenga sentido.',
        logrado: val => { const p = PRON2[0], k = elegido2(val, p); return !!k && k !== p.bien && concuerda2(p, k); },
        bien: 'El horno concuerda con «lo», pero no va en la canasta.' },
      { texto: 'Une «ella» con alguien que concuerde y no sea la abuela.',
        logrado: val => { const p = PRON2[2], k = elegido2(val, p); return !!k && k !== p.bien && concuerda2(p, k); },
        bien: 'Concordar no basta: hay que leer quién espera a quién.' },
      { texto: 'Guarda el mensaje con los tres pronombres bien unidos.',
        logrado: (val, guardados) => guardados.concat([val]).some(listo2),
        bien: 'El pan, la canasta y la abuela: el encargo se entiende.' },
    ] });
  const mesaRecursos = Object.assign({ id: 'recursos', titulo: 'El folleto de la vicuña', pieza: 'rv-soporte' }, sinMision(recursos.juega), {
    invitaciones: [
      { texto: 'Calla el nombre en la oración 4 y mira a quién se recupera.',
        logrado: val => val.s2 === 2,
        bien: 'Justo antes hizo algo el guardaparque: la 4 habla de él.' },
      { texto: 'Calla el nombre en la oración 2 y mira a quién se recupera.',
        logrado: val => val.s1 === 2,
        bien: 'Justo antes se habló de la vicuña: la 2 sigue con ella.' },
      { texto: 'Guarda dos folletos que hablen siempre de la vicuña, con formas distintas.',
        logrado: (val, guardados) => de3(val, 's2') === 'v' && guardados.some(g => de3(g, 's2') === 'v' && (g.s1 !== val.s1 || g.s2 !== val.s2)),
        bien: 'Hay varias maneras de nombrarla sin perder el hilo.' },
    ] });
  const mesaHilo = Object.assign({ id: 'hilo', titulo: 'El hilo de los caminos', pieza: 'rv-soporte' }, sinMision(progresion.juega), {
    invitaciones: [
      { texto: 'Arma un texto en que alguna oración corte el hilo.',
        logrado: val => hilo4(val).some(r => !r.sigue),
        bien: 'Esa oración parte de algo que nadie presentó.' },
      { texto: 'Que la 2 y la 3 partan de lo nuevo, y la 4 de los incas.',
        logrado: val => { const h = hilo4(val); return h[0].lineal && h[1].lineal && h[2].parte === 'incas'; },
        bien: 'Volver al tema del inicio también sigue el hilo.' },
      { texto: 'Guarda un texto que corte el hilo y otro que no.',
        logrado: (val, guardados) => guardados.concat([val]).some(g => hilo4(g).every(r => r.sigue)) && guardados.concat([val]).some(g => hilo4(g).some(r => !r.sigue)),
        bien: 'Compáralos: el corte está donde algo aparece sin presentarse.' },
    ] });
  const mesaIncluir = Object.assign({ id: 'incluir', titulo: 'El borrador de Elena', pieza: 'rv-soporte' }, sinMision(incluir.juega), {
    invitaciones: [
      { texto: 'Pon una oración que encaje con la 1, pero no con la 3.',
        logrado: val => val.c > 0 && CAND5[val.c - 1].antes && !CAND5[val.c - 1].despues,
        bien: 'Retoma lo de antes, pero «esa revisión» queda sin presentar.' },
      { texto: 'Pon una oración que no encaje con ninguna de las dos.',
        logrado: val => val.c > 0 && !CAND5[val.c - 1].antes && !CAND5[val.c - 1].despues,
        bien: 'Los cuadernos de 4.º no tienen que ver con los libros donados.' },
      { texto: 'Guarda la oración que encaja y otra que no.',
        logrado: (val, guardados) => guardados.concat([val]).some(listo5) && guardados.concat([val]).some(g => g.c > 0 && !listo5(g)),
        bien: 'Una sola prueba no basta: la buena pasa las dos.' },
    ] });

  const IDEAS_U = [noContradiccion, referencia, recursos, progresion, incluir];

  return {
    unidad: 'razonamiento-verbal.cohesion-y-coherencia',
    version: '0.3.0',
    calidad: 2,
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rv-soporte.js'],
    // La unidad no usa letras de fórmula: lo que hay que leer en la figura va en la leyenda de cada juego.
    letras: {},
    historia: HISTORIA,
    glosario: GLOSARIO,
    laboratorio: [mesaHorario, mesaReferente, mesaRecursos, mesaHilo, mesaIncluir],
    // A qué idea pertenece cada mesa (Gerson, 16 nov: el laboratorio se agrupa por idea). «referente» e «hilo» conservan
    // su id con el dibujo del juego nuevo de su idea (etapa 9). «concordar-no-basta» (pieza rv-texto) salió: el tope es de
    // cinco mesas, y su juego de concordar y sentido es ahora el de la idea 2.
    laboratorioIdeas: {
      horario: ['no-contradiccion'],
      referente: ['referente'],
      recursos: ['repetir-sustituir-callar'],
      hilo: ['conocido-y-nuevo'],
      incluir: ['incluir'],
    },
    ideas: IDEAS_U,
  };
});
