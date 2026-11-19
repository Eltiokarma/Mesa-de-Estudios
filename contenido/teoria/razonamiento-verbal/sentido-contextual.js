/*
 * Teoría de «Precisión léxica y sentido contextual» (razonamiento-verbal.sentido-contextual). Molde: docs/teoria.md y
 * docs/molde-unidad.md. Se rehace por el contrato «se entiende sin profesor» (etapa 7, docs/plan-calidad.md §7), con la
 * propuesta de docs/etapa7/propuesta-verbal.md como guion (Gerson delegó el criterio y revisa después):
 *   1. acepcion             «La oración elige la acepción»          rehecha el 19 nov (conserva su id y el avance)
 *   2. denota-connota       «Lo que dice y cómo lo valora»          rehecha (conserva su id)
 *   3. palabra-precisa      «La palabra precisa»                    rehecha (conserva su id)
 *   4. sentido-figurado     «Literal o figurado»                    nueva
 *   5. inferir-significado  «El significado sale de las pistas»     rehecha (conserva su id)
 * Usa lo que dejaron Definiciones (rasgo, sentido figurado) y Analogías (sinónimo, antónimo): aquí las palabras van
 * dentro de una oración, y la oración elige. No adelanta Conectores (el hueco del conector) ni Inferencias («inferencia»):
 * en la idea 5 se dice «deducir».
 * Objeto de la primera pantalla en verbal: el texto en su soporte, con quién lo escribe y para quién (rv-soporte, con sus
 * oraciones en trozos para marcar una palabra dentro de su renglón: bloque de la etapa 7 en la pieza). Textos, avisos y
 * mensajes propios (regla 5): ninguno copia un examen ni un manual. El nivel 3 sigue la forma de las preguntas de San
 * Marcos (un texto de dos o tres oraciones y «el término X puede reemplazarse por»; docs/datos/admision-unmsm.csv, 82
 * preguntas), sin copiar ninguna.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: elegir el reemplazo de una palabra que deja al texto diciendo lo mismo, por sus pistas y no por la memoria.
 *   Persona y condiciones: postulante de 5.º o preuniversitario, celular de gama baja, sin audio, sin profesor.
 *   Resultado observable: pone un reemplazo en la oración, marca la pista que lo decide y dice por qué falla otro.
 *   Orden de atención: 1.º la palabra en negrita · 2.º la pista · 3.º el reemplazo · acción: tocar la oración.
 *   Estados: reemplazo que dice lo mismo (violeta) · que cambia lo que dice (naranja) · pista (turquesa) · tachado.
 *   Duda que resuelve: ¿por qué «despejada» no sirve para «clara» en «la explicación fue clara»?
 *
 * Colores (regla 4; paleta de lectura con papel fijo en todo verbal, como en Definiciones y Analogías): la pista del
 * texto, i (turquesa, continuo: la evidencia); el reemplazo o la lectura que se prueba y falla, con su motivo, o (naranja,
 * a trazos: el distractor); el que dice lo mismo y la respuesta, f (violeta, punteado); lo descartado, gris con raya de
 * tinta. La palabra por la que se pregunta va en negrita y en tinta. Sin verde ni carmín. Las letras de las alternativas
 * que nombra un resuelto van en negrita (mala, buena). Lo comprueba sentido-contextual.test.js.
 * Códigos (docs/investigacion/razonamiento-verbal-ideas-erroneas.md y contenido/razonamiento-verbal/codigos.json): RV18
 * (sentido más frecuente), RV19 (mismo campo), RV20 (parecido de forma), RV21 (otro rasgo), RV23 (choca con otra parte)
 * y, como hipótesis de esta unidad, RVS1 (sinónimo por antónimo), RVS2 (otra valoración), RVS3 (otro grado), RVS4
 * (comodín), RVS5 (literal por figurado), RVS6 (figurado por literal), RVS7 (idea propia) y RVS8 (contraste al revés).
 * Lo que dice lo mismo, se lee literal o es pista en los juegos lo calcula el código con un mundo chico (regla 1). Los
 * ejemplos, los «Así se resuelve», los «Ahora tú» y las predicciones se revisaron con un script aparte que no usa el
 * código de la unidad (scratchpad e7-rv/revisa.js): un léxico propio da a cada palabra sus acepciones y a cada
 * alternativa su etiqueta, y comprueba que solo una cumple lo que pide la pregunta en la acepción del texto, que cada
 * distractor falla por lo que dice su explicación, y que la correcta no es la más larga, ni la más corta, ni la única
 * escrita dentro de otra.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  // ---------- Ayudantes (los de Analogías) ----------
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
  const may = t => t.charAt(0).toUpperCase() + t.slice(1);

  // Una oración en trozos (rv-soporte, etapa 7): «[w:palabra]» es la palabra por la que se pregunta (en negrita),
  // «[p:…]» y «[q:…]» son sus pistas; el resto va en trozos sueltos. Con `w`, la palabra se cambia por otra; con
  // `reserva`, su lugar guarda el ancho de la más larga (el juego cambia la palabra sin mover el texto).
  //   oracion('n1', 'El cielo amaneció [w:claro], [p:sin una sola nube].')
  function oracion(id, plantilla, w, reserva) {
    const frags = [];
    let k = 0;
    for (const m of plantilla.split(/(\[[wpq]:[^\]]+\])/)) {
      const e = m.match(/^\[([wpq]):([^\]]+)\]$/);
      if (e) frags.push(Object.assign({ id: `${id}${e[1]}`, t: e[1] === 'w' && w !== undefined ? w : e[2] }, e[1] === 'w' ? { negrita: true } : {}, e[1] === 'w' && reserva ? { reserva } : {}));
      else if (m.trim()) frags.push({ id: `${id}t${k++}`, t: m.trim() });
    }
    const t = plantilla.replace(/\[w:([^\]]+)\]/, (_, x) => (w !== undefined ? w : x)).replace(/\[[pq]:([^\]]+)\]/g, '$1');
    return { id, t, frags };
  }
  const ors = (pre, lista) => lista.map((t, k) => (typeof t === 'string' ? oracion(`${pre}${k + 1}`, t) : t));
  // Ids de las pistas de una oración en trozos.
  const pistasDe = o => o.frags.filter(f => /[pq]$/.test(f.id) && f.id.length === o.id.length + 1).map(f => f.id);
  const papel = (soporte, lugar, titulo, de, para, oraciones, extra) => Object.assign({ soporte, lugar, hojas: [Object.assign({ id: 'k' }, titulo ? { titulo } : {}, { de, para, oraciones })] }, extra || {});
  // La hoja de simulacro: un texto (de dos o tres oraciones, como en San Marcos), la pregunta y las alternativas A–E; sin
  // alternativas, cuando son los botones de «Ahora tú».
  const P_ELIJA = 'En el texto, la palabra en negrita puede reemplazarse por';
  const sim = (numero, oraciones, pregunta, alts) => ({ soporte: 'simulacro', numero, hojas: [{ id: 'h', titulo: 'Texto', oraciones }],
    pregunta: alts && alts.length ? pregunta || P_ELIJA : null, alternativas: (alts || []).map((t, k) => ({ id: LETRAS[k], t })) });
  const sinPie = sop => Object.fromEntries(Object.entries(sop).filter(([k]) => k !== 'pregunta' && k !== 'alternativas'));
  // El estado de una hoja resuelta: las pistas del texto en turquesa, la buena en violeta y las demás tachadas.
  const pistasHoja = sop => sop.hojas.flatMap(h => (h.oraciones || []).filter(o => o.frags).flatMap(pistasDe));
  const estHoja = (sop, L) => ({ marcas: Object.assign(Object.fromEntries(pistasHoja(sop).map(id => [id, 'i'])), L ? { [L]: 'f' } : {}),
    tachar: L ? sop.alternativas.map(a => a.id).filter(id => id !== L) : [] });
  // Un cuaderno con la oración y, debajo, las palabras que se prueban (una por renglón): la figura de «Mira».
  const probador = (lugar, titulo, de, plantilla, candidatos) => papel('cuaderno', lugar, titulo, de, 'la práctica de Comunicación',
    [oracion('c0', plantilla)].concat(candidatos.map((t, k) => ({ id: `c${k + 1}`, t }))));

  // ---------- Idea 1: la oración elige la acepción (conserva su id; etapa 7) ----------
  // Cambia: la palabra que entra en lugar de «claro» en cada nota. Permanece: las tres notas y sus pistas. Progresa: de
  // tres «claro» a tres reemplazos que dicen lo mismo. Se reserva: el antónimo en contexto (predicción): el juego solo
  // tiene sinónimos. Debe verse: que la misma palabra pide un reemplazo distinto en cada nota, y que lo decide la pista.
  // Objeto de la primera pantalla: el mural del colegio (quién escribe: 5.º B; para quién: todo el colegio).
  // Colores: la pista, i; el reemplazo que cambia lo que dice la nota, o; el que dice lo mismo, f.
  // Códigos: RV18 (sentido más frecuente u otra acepción), RV19 (mismo campo), RV20 (parecido de forma), RV21 (otro
  // rasgo, en antónimos) y RVS1 (sinónimo por antónimo, o al revés).
  const D_ACEP = 'Acepción: cada uno de los significados que puede tener una palabra.';
  const D_PISTA = 'Pista: la parte del texto que decide qué acepción usa la palabra.';
  const D_REEMP = 'Prueba del reemplazo: se pone otra palabra en su lugar y se relee el texto.';
  const D_SINC = 'Sinónimo en contexto: dice lo mismo que la palabra, en la acepción que usa el texto.';
  const D_ANTC = 'Antónimo en contexto: dice lo contrario de la palabra, en la acepción que usa el texto.';
  const D_OTRAAC = 'Otra acepción: el reemplazo sirve para otro uso de la palabra, no para el de este texto.';
  const D_CAMPO = 'Mismo campo: una palabra del mismo tema que no dice lo mismo.';
  const D_FORMA = 'Parecido de forma: una palabra que se escribe parecido, pero significa otra cosa.';
  const D_OTRORASGO = 'Otro rasgo: una palabra distinta que habla de otra cosa; por eso no es su contrario.';
  const D_SINANT = 'Sinónimo por antónimo: se pide lo contrario y la palabra dice lo mismo, o al revés.';

  // El juego: el mundo chico de las tres notas. Cada nota usa «claro» en una acepción; cada reemplazo es de una sola.
  const ACEP1 = { despejado: 'del cielo', comprensible: 'de entender', pálido: 'de un color' };
  const NOTAS1 = [
    { id: 'n1', pl: 'El cielo de Puno amaneció [w:claro], [p:sin una sola nube].', ops: ['claro', 'despejado', 'comprensible', 'pálido'], ok: 1, acep: 'del cielo' },
    { id: 'n2', pl: 'La explicación de la profesora fue [w:clara]: [p:todos entendieron a la primera].', ops: ['clara', 'despejada', 'comprensible', 'pálida'], ok: 2, acep: 'de entender' },
    { id: 'n3', pl: 'Pintaron la sala de un verde [w:claro], [p:casi blanco].', ops: ['claro', 'despejado', 'comprensible', 'pálido'], ok: 3, acep: 'de un color' },
  ];
  const RES1 = 'comprensible';
  const mural1 = val => papel('mural', 'Mural del colegio', 'Tres notas de la semana', '5.º B', 'todo el colegio',
    NOTAS1.map(n => oracion(n.id, n.pl, n.ops[val[n.id] || 0], RES1)));
  const INI1 = Object.fromEntries(NOTAS1.map(n => [n.id, 0]));
  const listo1 = val => NOTAS1.every(n => val[n.id] === n.ok);
  const acepDe = (n, v) => ACEP1[NOTAS1[0].ops[v]];
  const est1 = val => ({ marcas: Object.assign(Object.fromEntries(NOTAS1.map(n => [`${n.id}p`, 'i'])),
    Object.fromEntries(NOTAS1.filter(n => val[n.id]).map(n => [`${n.id}w`, val[n.id] === n.ok ? 'f' : 'o']))) });
  const lectura1 = val => {
    if (listo1(val)) return [justo('Las tres dicen lo mismo'), ': cada pista eligió su acepción'];
    const k = NOTAS1.findIndex(n => val[n.id] && val[n.id] !== n.ok);
    if (k >= 0) { const n = NOTAS1[k]; return [prop(`«${may(n.ops[val[n.id]])}»`), `: habla ${acepDe(n, val[n.id])}; la nota ${k + 1} habla ${n.acep}`]; }
    const b = NOTAS1.filter(n => val[n.id] === n.ok).length;
    return b ? [justo(`${b} de 3 dicen lo mismo`), '; falta probar en las otras'] : ['Toca una nota y prueba otra palabra en lugar de «claro»'];
  };

  // La predicción: el antónimo en la nota 2. Sin letras en la figura: la app baraja las opciones.
  const NOTA2 = NOTAS1[1].pl;
  const mural1Predice = (w, reserva) => papel('mural', 'Mural del colegio', 'Tres notas de la semana', '5.º B', 'todo el colegio',
    NOTAS1.map(n => (n.id === 'n2' ? oracion('n2', NOTA2, w, reserva) : oracion(n.id, n.pl))));
  const PROB1 = probador('Cuaderno de Lucía', '¿Lo contrario de «clara»?', 'Lucía', NOTA2, ['nublada', 'sencilla', 'corta', 'confusa']);

  // «Así se resuelve»: cuatro hojas con un texto y cinco alternativas. Cada incorrecta cae por una razón: otra acepción
  // (RV18), el mismo campo (RV19), el parecido de forma (RV20), otro rasgo (RV21) o lo contrario de lo que se pide (RVS1).
  // La buena cambia de lugar: D, A, E y B. Ningún caso es de «Ahora tú» ni de los ejemplos.
  const RESUELVE_1 = [
    { sop: sim(9, ors('h', ['En marzo, los transportistas de Juliaca pararon tres días por el alza del combustible.', 'Para [w:levantar] la huelga, pidieron una mesa de diálogo con el alcalde.', 'Tras la reunión, [p:las combis volvieron a salir].']), null,
      ['alzar', 'organizar', 'relevar', 'terminar', 'prolongar']), buena: 'D', pide: 'sinónimo', w: 'levantar',
      datos: [D_ACEP, D_PISTA, D_SINC], tengo: ['La pista: ', cubre('«las combis volvieron a salir»'), '. La huelga acabó: «levantar» habla de ponerle fin.'],
      malas: [mala('A'), ': alzar es subir algo, ', prop('otra acepción'), '. ', mala('B'), ' es del ', prop('mismo campo'), ': la huelga ya estaba organizada. ', mala('C'), ' tiene ', prop('parecido de forma'), '. ', mala('E'), ' dice lo contrario: ', prop('sinónimo por antónimo'), '.'],
      bien: [buena('D'), ': «para ', justo('terminar'), ' la huelga» dice lo mismo que el texto.'],
      sentido: 'Relee con la palabra puesta: si las combis volvieron a salir, la huelga terminó.' },
    { sop: sim(10, ors('h', ['La tierra de esa chacra es [w:pobre]: [p:casi nada crece en ella], aunque la rieguen cada semana.', 'Por eso la familia siembra en otra parcela.']), 'En el texto, ¿qué palabra dice lo contrario de «pobre»?',
      ['fértil', 'millonaria', 'humilde', 'estéril', 'seca']), buena: 'A', pide: 'antónimo', w: 'pobre',
      datos: [D_ACEP, D_PISTA, D_ANTC], tengo: ['La pista: ', cubre('«casi nada crece en ella»'), '. «Pobre» habla de lo que da la tierra, no de dinero.'],
      malas: [mala('B'), ': el contrario en dinero, ', prop('otra acepción'), '. ', mala('C'), ': un sinónimo en dinero. ', mala('D'), ' dice lo mismo: ', prop('sinónimo por antónimo'), '. ', mala('E'), ' habla del agua: ', prop('otro rasgo'), '.'],
      bien: [buena('A'), ': en una tierra ', justo('fértil'), ' crece de todo; es lo contrario de esta.'],
      sentido: 'Relee: «la tierra es fértil: casi nada crece» se contradice. Por eso es su contrario.' },
    { sop: sim(11, ors('h', ['La noticia del cambio de horario [w:corrió] por todo el colegio: [p:en una hora, todos la sabían].', 'Al día siguiente, nadie llegó tarde.']), null,
      ['trotó', 'aceleró', 'ocurrió', 'se detuvo', 'circuló']), buena: 'E', pide: 'sinónimo', w: 'corrió',
      datos: [D_ACEP, D_PISTA, D_SINC], tengo: ['La pista: ', cubre('«en una hora, todos la sabían»'), '. Una noticia no tiene piernas: pasó de uno a otro.'],
      malas: [mala('A'), ': trotar es correr con las piernas, ', prop('otra acepción'), '. ', mala('B'), ' es del ', prop('mismo campo'), ', la rapidez. ', mala('C'), ' tiene ', prop('parecido de forma'), '. ', mala('D'), ' dice lo contrario: ', prop('sinónimo por antónimo'), '.'],
      bien: [buena('E'), ': la noticia ', justo('circuló'), ' por todo el colegio: pasó de uno a otro.'],
      sentido: 'Relee con la palabra puesta: en una hora todos la sabían, así que circuló.' },
    { sop: sim(12, ors('h', ['El pan que sobró de ayer está [w:duro]: [p:no se puede morder sin mojarlo en el té].', 'Mañana compraremos pan del día.']), 'En el texto, ¿qué palabra dice lo contrario de «duro»?',
      ['fácil', 'blando', 'endurecido', 'amable', 'grande']), buena: 'B', pide: 'antónimo', w: 'duro',
      datos: [D_ACEP, D_PISTA, D_ANTC], tengo: ['La pista: ', cubre('«no se puede morder»'), '. «Duro» habla de cómo se siente el pan al morderlo.'],
      malas: [mala('A'), ': el contrario de un examen duro, ', prop('otra acepción'), '. ', mala('C'), ' dice lo mismo: ', prop('sinónimo por antónimo'), '. ', mala('D'), ': el contrario en el trato. ', mala('E'), ' habla del tamaño: ', prop('otro rasgo'), '.'],
      bien: [buena('B'), ': un pan ', justo('blando'), ' se muerde sin esfuerzo; es lo contrario de este.'],
      sentido: 'El pan del día es blando: por eso lo comprarán mañana.' },
  ];

  // «Ahora tú»: la hoja trae el texto; las palabras son los botones. Cuatro casos con cuatro opciones y dos de examen con
  // cinco. En cada caso, cada incorrecta tiene un código distinto.
  const AHORA_1 = [
    { o: ['La profesora [w:aprobó] el plan del paseo: [p:dijo que sí y firmó la autorización].'], pide: 'sinónimo', ok: 'aceptó',
      m: [['pasó', 'RV18', 'Es un sinónimo de «aprobó», bien; pero cuando se aprueba un examen.'],
        ['rechazó', 'RVS1', 'Habla del plan, bien; pero dice lo contrario: la profesora dijo que sí.'],
        ['revisó', 'RV19', 'Es del mismo campo, bien; pero revisar no es decir que sí.']] },
    { o: ['Mi abuelo tiene el sueño [w:ligero]: [p:se despierta con cualquier ruido].'], pide: 'antónimo', ok: 'profundo',
      m: [['lento', 'RV18', 'Es lo contrario de «ligero», bien; pero cuando ligero es rápido.'],
        ['liviano', 'RVS1', 'Habla del sueño, bien; pero dice lo mismo que «ligero»: es un sinónimo.'],
        ['larguísimo', 'RV21', 'Es distinto de «ligero», bien; pero habla de cuánto dura el sueño.']] },
    { o: ['El seguro escolar [w:cubre] los gastos de la clínica: [p:la familia no paga nada].'], pide: 'sinónimo', ok: 'asume',
      m: [['tapa', 'RV18', 'Es un sinónimo de «cubre», bien; pero cuando se pone algo encima.'],
        ['revisa', 'RV19', 'Es del mismo campo de los gastos, bien; pero revisar no es pagar.'],
        ['cobra', 'RV20', 'Se escribe parecido a «cubre», bien visto; pero cobrar es pedir el pago.']] },
    { o: ['Ana y su prima tienen una amistad muy [w:estrecha]: [p:se cuentan todo y se ven cada día].'], pide: 'antónimo', ok: 'distante',
      m: [['ancha', 'RV18', 'Es lo contrario de «estrecha», bien; pero cuando se habla de medidas.'],
        ['cercana', 'RVS1', 'Habla de la amistad, bien; pero dice lo mismo que «estrecha».'],
        ['interminable', 'RV21', 'Es distinto de «estrecha», bien; pero habla de cuánto dura.']] },
    { o: ['El nuevo reglamento [w:sembró] dudas entre los padres de familia.', '[p:Nadie entendía qué cambiaba] y todos llamaron al colegio.'], pide: 'sinónimo', ok: 'provocó',
      m: [['plantó', 'RV18', 'Es un sinónimo de «sembró», bien; pero cuando se siembran plantas.'],
        ['cosechó', 'RV19', 'Es del mismo campo, el de la chacra; pero no dice lo mismo.'],
        ['resolvió', 'RVS1', 'Habla de las dudas, bien; pero dice lo contrario: las dudas quedaron.'],
        ['asombró', 'RV20', 'Se escribe parecido a «sembró», bien visto; pero significa otra cosa.']] },
    { o: ['La ministra dio una respuesta [w:vaga] sobre la nueva carretera.', '[p:No dijo cuándo ni cómo se haría la obra].'], pide: 'antónimo', ok: 'precisa',
      m: [['trabajadora', 'RV18', 'Es lo contrario de «vaga», bien; pero cuando vago es flojo.'],
        ['confusa', 'RVS1', 'Habla de la respuesta, bien; pero dice lo mismo que «vaga».'],
        ['corta', 'RV21', 'Es distinta de «vaga», bien; pero habla del largo, no de lo que dice.'],
        ['vasta', 'RV20', 'Se escribe parecido a «vaga», bien visto; pero vasta es extensa.']] },
  ];

  // Ejemplos resueltos de la idea 1. La figura es el texto en su soporte, sin marcas (la palabra en negrita). Nivel 1: un
  // paso (qué acepción usa la palabra, si un reemplazo sirve, cuál es la pista). Nivel 2: tres palabras de una lista, con
  // dos fallas distintas. Nivel 3: la hoja de simulacro con un texto y cinco alternativas; las correctas son B, D, C, A y
  // E. Revisado aparte (scratchpad e7-rv/revisa.js): solo una cumple en la acepción del texto, cada distractor falla por
  // lo que dice el resuelto y la correcta no es la más larga ni la más corta.
  const EJEMPLOS_1 = [
    { nivel: 1, titulo: 'El bus lleno',
      enunciado: '«Lleno» puede decir «sin espacio libre» o «satisfecho de comida». ¿Qué acepción usa Iván en su mensaje?',
      datos: [D_ACEP, D_PISTA],
      figura: fig(papel('mensaje', 'Familia Quispe', null, 'Iván', 'su mamá', ors('k', ['Mamá, el bus va [w:lleno]: [p:no queda ni un asiento libre].', 'Llego en el siguiente.']))),
      solucion: [{ texto: ['La pista es ', cubre('«no queda ni un asiento libre»'), ': habla del espacio del bus, no de comida.'] }],
      respuesta: [justo('Sin espacio libre'), ': no queda sitio en el bus'] },
    { nivel: 1, titulo: 'El trabajo fino',
      enunciado: '¿La palabra «delgado» puede reemplazar a «fino» en el cartel de doña Elsa?',
      datos: [D_ACEP, D_PISTA, D_REEMP],
      figura: fig(papel('cartel', 'Cartel de una sastrería de Puno', 'Arreglos de ropa', 'doña Elsa', 'los vecinos', ors('k', ['Hacemos un trabajo [w:fino]: [p:las costuras casi no se ven].', 'Entrega en dos días.']))),
      solucion: [
        { texto: ['Delgado es fino de grosor, como un hilo: es ', prop('otra acepción'), '.'] },
        { texto: ['La pista, ', cubre('«las costuras casi no se ven»'), ', dice que «fino» habla de lo bien hecho.'] }],
      respuesta: [justo('No'), ': aquí «fino» es bien hecho, no de poco grosor'] },
    { nivel: 1, titulo: 'La señal en la chacra',
      enunciado: '¿Qué parte del mensaje de Rosa dice qué acepción usa la palabra «débil»?',
      datos: [D_ACEP, D_PISTA],
      figura: fig(papel('mensaje', 'Promoción 2026', null, 'Rosa', 'el grupo de la promoción', ors('k', ['La señal del celular es [w:débil] en la chacra de mi tío: [p:las llamadas se cortan a cada rato].']))),
      solucion: [
        { texto: [cubre('«Las llamadas se cortan»'), ' dice que la señal llega con poca fuerza: es la pista.'] },
        { texto: ['«En la chacra de mi tío» dice dónde pasa, pero no qué significa «débil».'] }],
      respuesta: [justo('«Las llamadas se cortan a cada rato»')] },
    { nivel: 1, titulo: 'El aviso de la posta',
      enunciado: '«Grave» puede hablar de un sonido (una voz grave) o de un peligro. ¿Qué acepción usa la posta en su aviso?',
      datos: [D_ACEP, D_PISTA],
      figura: fig(papel('puerta', 'Puerta de la posta de Ilave', 'Aviso', 'la posta', 'los pacientes', ors('k', ['Si su resfrío no es [w:grave], [p:con reposo y líquidos se pasa en pocos días].']))),
      solucion: [{ texto: ['La pista, ', cubre('«con reposo y líquidos se pasa»'), ', habla de la salud: «grave» es de cuidado.'] }],
      respuesta: [justo('La del peligro'), ': un resfrío de cuidado'] },
    { nivel: 1, titulo: 'El lago calmado',
      enunciado: '¿La palabra «nervioso» dice lo contrario de «calmado» en el cartel del muelle?',
      datos: [D_ACEP, D_PISTA, D_ANTC],
      figura: fig(papel('cartel', 'Cartel del muelle de Puno', 'Paseos en bote', 'los boteros', 'los turistas', ors('k', ['Hoy el lago amaneció [w:calmado]: [p:no se mueve ni una ola].', 'Salimos a las nueve.']))),
      solucion: [
        { texto: ['Nervioso es lo contrario de calmado en una persona: es ', prop('otra acepción'), '.'] },
        { texto: ['La pista, ', cubre('«no se mueve ni una ola»'), ', habla del agua: su contrario es «agitado».'] }],
      respuesta: [justo('No'), ': para el lago, lo contrario es «agitado»'] },

    { nivel: 2, titulo: 'El concurso de dibujo',
      enunciado: '¿Qué palabra puede reemplazar a «abrió» en el mensaje: «quitó la tapa», «convocó» o «cerró»?',
      datos: [D_ACEP, D_PISTA, D_SINC],
      figura: fig(papel('mensaje', 'Familias de 4.º A', null, 'la tutora', 'las familias', ors('k', ['La municipalidad [w:abrió] un concurso de dibujo para los colegios: [p:las inscripciones empiezan el lunes].']))),
      solucion: [
        { texto: ['«Quitó la tapa» es abrir un frasco: ', prop('otra acepción'), '. «Cerró» dice lo contrario: ', prop('sinónimo por antónimo'), '.'] },
        { texto: ['La pista, ', cubre('«las inscripciones empiezan»'), ', dice que la municipalidad llamó a participar.'] }],
      respuesta: [justo('«Convocó»')] },
    { nivel: 2, titulo: 'La fiesta fría',
      enunciado: '¿Qué palabra dice lo contrario de «fría» en el mensaje de Mateo: «animada», «veraniega» o «sosa»?',
      datos: [D_ACEP, D_PISTA, D_ANTC],
      figura: fig(papel('mensaje', 'Promoción 2026', null, 'Mateo', 'la promoción', ors('k', ['La fiesta de anoche estuvo [w:fría]: [p:nadie bailaba ni conversaba].']))),
      solucion: [
        { texto: ['«Veraniega» es lo contrario de un día frío: ', prop('otra acepción'), '. «Sosa» dice lo mismo: ', prop('sinónimo por antónimo'), '.'] },
        { texto: ['La pista, ', cubre('«nadie bailaba»'), ', habla del ánimo de la fiesta.'] }],
      respuesta: [justo('«Animada»')] },
    { nivel: 2, titulo: 'El trámite de la beca',
      enunciado: '¿Qué palabra puede reemplazar a «pesado» en el cartel: «de mucho peso», «sencillo» o «complicado»?',
      datos: [D_ACEP, D_PISTA, D_SINC],
      figura: fig(papel('cartel', 'Cartel de la oficina de becas', 'Requisitos', 'la oficina de becas', 'los postulantes', ors('k', ['El trámite de la beca es [w:pesado]: [p:piden doce papeles y tres firmas].']))),
      solucion: [
        { texto: ['«De mucho peso» habla de una cosa: ', prop('otra acepción'), '. «Sencillo» dice lo contrario: ', prop('sinónimo por antónimo'), '.'] },
        { texto: ['Con ', cubre('«doce papeles y tres firmas»'), ', el trámite cuesta mucho trabajo.'] }],
      respuesta: [justo('«Complicado»')] },
    { nivel: 2, titulo: 'Las paltas verdes',
      enunciado: '¿Qué palabra dice lo contrario de «verdes» en el mensaje de la abuela: «maduras», «rojas» o «muy pequeñas»?',
      datos: [D_ACEP, D_PISTA, D_ANTC],
      figura: fig(papel('mensaje', 'Familia Quispe', null, 'la abuela', 'la familia', ors('k', ['No compren esas paltas: todavía están [w:verdes], [p:duras y sin sabor].']))),
      solucion: [
        { texto: ['«Rojas» es otro color: ', prop('otra acepción'), ' de verde. «Muy pequeñas» habla del tamaño: ', prop('otro rasgo'), '.'] },
        { texto: ['La pista, ', cubre('«duras y sin sabor»'), ', dice que a las paltas les falta tiempo.'] }],
      respuesta: [justo('«Maduras»')] },
    { nivel: 2, titulo: 'El debate del uniforme',
      enunciado: '¿Qué palabra puede reemplazar a «sostuvo» en el mural: «cargó», «afirmó» o «discutió»?',
      datos: [D_ACEP, D_PISTA, D_SINC],
      figura: fig(papel('mural', 'Mural del colegio', 'Resultados del debate', 'el comité de debate', 'los estudiantes', ors('k', ['En el debate, Lucía [w:sostuvo] que el uniforme debe ser libre: [p:dio tres razones y no cambió de idea].']))),
      solucion: [
        { texto: ['«Cargó» es sostener algo con las manos: ', prop('otra acepción'), '. «Discutió» es del ', prop('mismo campo'), ', pero no dice lo mismo.'] },
        { texto: ['La pista, ', cubre('«dio tres razones»'), ', dice que Lucía defendió su idea.'] }],
      respuesta: [justo('«Afirmó»')] },

    { nivel: 3, titulo: 'La carga de los profesores',
      enunciado: 'Pregunta 21 del simulacro. En el texto, la palabra en negrita puede reemplazarse por',
      datos: [D_ACEP, D_PISTA, D_SINC],
      figura: fig(sim(21, ors('h', ['Con el nuevo horario aumentó la [w:carga] de los profesores: [p:ahora tienen dos cursos más y menos tiempo para corregir].', 'Varios pidieron una reunión con la dirección.']), null,
        ['peso', 'trabajo', 'cargo', 'descanso', 'sueldo'])),
      solucion: [
        { texto: [mala('A'), ': el peso es la carga que se lleva encima, ', prop('otra acepción'), '. ', mala('C'), ' tiene ', prop('parecido de forma'), '.'] },
        { texto: [mala('D'), ' dice lo contrario: ', prop('sinónimo por antónimo'), '. ', mala('E'), ' es del ', prop('mismo campo'), ', el del empleo.'] },
        { texto: [buena('B'), ': la pista, ', cubre('«dos cursos más»'), ', habla de más trabajo.'] }],
      respuesta: [buena('B'), ': trabajo'] },
    { nivel: 3, titulo: 'La fuente del periodista',
      enunciado: 'Pregunta 22 del simulacro. En el texto, la palabra en negrita puede reemplazarse por',
      datos: [D_ACEP, D_PISTA, D_SINC],
      figura: fig(sim(22, ors('h', ['El periodista no quiso revelar su [w:fuente]: [p:solo dijo que la información venía de alguien de la municipalidad].', 'La nota salió al día siguiente.']), null,
        ['pileta', 'publicación', 'frente', 'informante', 'lector'])),
      solucion: [
        { texto: [mala('A'), ': una pileta es una fuente de agua, ', prop('otra acepción'), '. ', mala('B'), ' es del ', prop('mismo campo'), ', el de las noticias.'] },
        { texto: [mala('C'), ' tiene ', prop('parecido de forma'), '. ', mala('E'), ' es quien lee la nota, no quien da la información.'] },
        { texto: [buena('D'), ': la pista, ', cubre('«alguien de la municipalidad»'), ', es quien le dio la información.'] }],
      respuesta: [buena('D'), ': informante'] },
    { nivel: 3, titulo: 'El tráfico de la tarde',
      enunciado: 'Pregunta 23 del simulacro. En el texto, ¿qué palabra dice lo contrario de la palabra en negrita?',
      datos: [D_ACEP, D_PISTA, D_ANTC],
      figura: fig(sim(23, ors('h', ['A las seis de la tarde, el tráfico de la avenida está [w:denso]: [p:los carros avanzan muy despacio].', 'Por eso muchos salen antes del trabajo.']), 'En el texto, ¿qué palabra dice lo contrario de «denso»?',
        ['ralo', 'pesado', 'fluido', 'tenso', 'ruidoso'])),
      solucion: [
        { texto: [mala('A'), ': ralo es lo contrario de un pelo denso, ', prop('otra acepción'), '. ', mala('B'), ' dice lo mismo: ', prop('sinónimo por antónimo'), '.'] },
        { texto: [mala('D'), ' tiene ', prop('parecido de forma'), '. ', mala('E'), ' habla del ruido: ', prop('otro rasgo'), '.'] },
        { texto: [buena('C'), ': la pista, ', cubre('«avanzan muy despacio»'), '; en un tráfico fluido no se detienen.'] }],
      respuesta: [buena('C'), ': fluido'] },
    { nivel: 3, titulo: 'El puente sobre el río',
      enunciado: 'Pregunta 24 del simulacro. En el texto, la palabra en negrita puede reemplazarse por',
      datos: [D_ACEP, D_PISTA, D_SINC],
      figura: fig(sim(24, ors('h', ['El puente nuevo sobre el río es [w:seguro]: [p:por él pasan sin peligro los camiones más pesados].', 'Antes, los camiones daban una vuelta de dos horas.']), null,
        ['resistente', 'indiscutible', 'vigilado', 'peligroso', 'segundo'])),
      solucion: [
        { texto: [mala('B'), ': «es seguro que…» es indiscutible, ', prop('otra acepción'), '. ', mala('C'), ' es del ', prop('mismo campo'), ', el de la seguridad.'] },
        { texto: [mala('D'), ' dice lo contrario: ', prop('sinónimo por antónimo'), '. ', mala('E'), ' tiene ', prop('parecido de forma'), '.'] },
        { texto: [buena('A'), ': la pista, ', cubre('«pasan sin peligro los camiones»'), ', habla de un puente que aguanta.'] }],
      respuesta: [buena('A'), ': resistente'] },
    { nivel: 3, titulo: 'El clima del valle',
      enunciado: 'Pregunta 25 del simulacro. En el texto, la palabra en negrita puede reemplazarse por',
      datos: [D_ACEP, D_PISTA, D_SINC],
      figura: fig(sim(25, ors('h', ['En el valle donde vive mi tía, el clima es [w:templado] casi todo el año: [p:ni hace mucho calor ni mucho frío].', 'Por eso allí se cultivan frutas.']), null,
        ['afinado', 'caluroso', 'temporal', 'extremoso', 'moderado'])),
      solucion: [
        { texto: [mala('A'), ': una guitarra templada está afinada, ', prop('otra acepción'), '. ', mala('B'), ' es del ', prop('mismo campo'), ', el del clima.'] },
        { texto: [mala('C'), ' tiene ', prop('parecido de forma'), '. ', mala('D'), ' dice lo contrario: ', prop('sinónimo por antónimo'), '.'] },
        { texto: [buena('E'), ': la pista, ', cubre('«ni mucho calor ni mucho frío»'), ', habla de un clima sin extremos.'] }],
      respuesta: [buena('E'), ': moderado'] },
  ];

  // Las preguntas de «Ahora tú» y de «Así se resuelve» de una idea, armadas igual en las cinco.
  const PIDE = { 'sinónimo': w => `¿Qué palabra puede reemplazar a «${w}» sin cambiar lo que dice el texto?`, 'antónimo': w => `¿Qué palabra dice lo contrario de «${w}» en el texto?` };
  const palabraDe = os => { for (const o of os) { const m = o.match(/\[w:([^\]]+)\]/); if (m) return m[1]; } return null; };
  const resuelveDe = (R, extra) => Object.assign({
    enunciado: `Pregunta ${R.sop.numero} del simulacro. ${R.sop.pregunta === P_ELIJA ? `En el texto, «${R.w}» puede reemplazarse por` : R.sop.pregunta}`,
    datos: R.datos, dibujo: { datos: R.sop, estado: {} },
    respuesta: [buena(R.buena), ': ', R.sop.alternativas.find(a => a.id === R.buena).t],
  }, extra);

  const acepcion = {
    id: 'acepcion',
    titulo: 'La oración elige la acepción',
    pregunta: '¿«Claro» quiere decir lo mismo en cualquier oración?',
    temas: ['Sinónimos en contexto', 'Antónimos en contexto'],
    pieza: 'rv-soporte',
    lee: {
      tarjetas: [
        { titulo: 'Tres notas del mural', texto: 'En el mural del colegio, 5.º B dejó tres notas para todos. Las tres usan la palabra «claro»: es la misma palabra, escrita igual, pero no dice lo mismo en las tres.',
          pieza: 'rv-soporte', dibujo: { datos: mural1(INI1), estado: {} } },
        { titulo: 'Acepción', texto: 'Cada significado que el diccionario da de una palabra es una acepción. «Fuerte» tiene varias: una mesa fuerte resiste, un café fuerte tiene mucho sabor y una voz fuerte se oye de lejos.' },
        { titulo: 'La pista', texto: 'Lo que rodea a una palabra en su oración es su contexto. La parte del contexto que decide qué acepción usa la palabra es la pista: una palabra o una frase cercana.' },
        { titulo: 'Qué mirar al jugar', texto: 'Toca una nota para cambiar «claro» por otra palabra y relee la nota entera. Si dice lo mismo que antes, el reemplazo sirve: es la prueba del reemplazo.' },
      ],
    },
    actividad: 'Cambiar «claro» en tres notas del mural por la palabra que dice lo mismo.',
    aprendizaje: 'Una palabra con varias acepciones toma la que piden las pistas de su oración; su sinónimo o su antónimo es de esa acepción.',
    ejemplos: EJEMPLOS_1,
    juega: {
      consigna: 'Tres notas del mural de 5.º B usan «claro». La pista de cada nota está marcada en turquesa.',
      mision: {
        texto: 'Toca cada nota hasta que el reemplazo de «claro» diga lo mismo que la nota.',
        logrado: listo1,
        bien: 'Una misma palabra, tres reemplazos: cada pista eligió su acepción.',
      },
      voz: 'Relee la nota entera con el reemplazo: ¿dice lo mismo?',
      leyenda: [
        { s: 'negrita', t: 'la palabra que se cambia' },
        { s: cubre('turquesa'), t: 'la pista que decide la acepción' },
        { s: prop('naranja'), t: 'reemplazo que cambia lo que dice' },
        { s: justo('violeta'), t: 'reemplazo que dice lo mismo' },
      ],
      controles: NOTAS1.map((n, k) => ({ id: n.id, etiqueta: `Nota ${k + 1}`, opciones: n.ops.map((t, v) => ({ valor: v, texto: t })) })),
      dibujo: val => ({ datos: Object.assign({ toques: Object.fromEntries(NOTAS1.map(n => [n.id, n.id])) }, mural1(val)), estado: est1(val) }),
      lectura: lectura1,
      minimo: 3,
    },
    predice: {
      pregunta: 'En la nota 2, «La explicación de la profesora fue clara: todos entendieron a la primera». ¿Qué palabra dice lo contrario de «clara» en esa nota?',
      voz: 'Elige antes de ver: después lo comprobamos con la pista.',
      opciones: opciones('confusa', [
        ['nublada', 'RV18', 'Es un contrario de «claro», bien; pero del cielo. Aquí «clara» habla de entender.'],
        ['sencilla', 'RVS1', 'Habla de entender, bien; pero va en el mismo sentido que «clara»: es un sinónimo.'],
        ['corta', 'RV21', 'Es distinta de «clara», bien; pero habla del largo, no de entender.'],
      ]),
      dibujo: { datos: mural1Predice(), estado: { senal: ['n2'] } },
      revelar: { datos: mural1Predice('confusa', RES1), estado: { senal: ['n2'], marcas: { n2w: 'f', n2p: 'i' } } },
      coincide: 'Coincide: una explicación confusa no se entiende; es lo contrario de «clara» al hablar de entender.',
    },
    mira: {
      datos: PROB1,
      voz: 'Volvamos a la nota, palabra por palabra.',
      pasos: [
        { estado: { senal: ['c0'], marcas: { c0p: 'i' }, nuevo: ['c0p'] }, texto: 'La pista, «todos entendieron», dice que «clara» habla de entender.',
          ecuacion: [cubre('todos entendieron'), ' → ', { negrita: 'acepción: entender' }] },
        { estado: { marcas: { c0p: 'i' }, tachar: ['c1'], nuevo: ['c1'] }, texto: 'Nublada es lo contrario de claro en el cielo: otra acepción.',
          ecuacion: [prop('nublada'), ': otra acepción'] },
        { estado: { marcas: { c0p: 'i' }, tachar: ['c1', 'c2'], nuevo: ['c2'] }, texto: 'Sencilla va en el mismo sentido que clara: sería un sinónimo.',
          ecuacion: [prop('sencilla'), ': sinónimo, no antónimo'] },
        { estado: { marcas: { c0p: 'i' }, tachar: ['c1', 'c2', 'c3'], nuevo: ['c3'] }, texto: 'Corta habla del largo de la explicación: es otro rasgo.',
          ecuacion: [prop('corta'), ': otro rasgo'] },
        { estado: { marcas: { c0p: 'i', c4: 'f' }, tachar: ['c1', 'c2', 'c3'], nuevo: ['c4'] }, texto: 'Confusa: que no se entiende. Es lo contrario, en esa acepción.',
          ecuacion: [justo('confusa'), ' ↔ ', { negrita: 'clara' }, ' (al entender)'] },
      ],
    },
    regla: {
      texto: 'Una palabra con varias acepciones toma la que piden las pistas de su oración. Su sinónimo o su antónimo en contexto es de esa acepción, no de la más frecuente.',
      ecuacion: [cubre('pista'), ' → ', { negrita: 'acepción' }, ' → ', justo('reemplazo')],
      voz: 'Vuelve a esta regla cuando dudes con una palabra.',
      condicion: 'el reemplazo, puesto en lugar de la palabra, deja la oración diciendo lo mismo (sinónimo) o lo contrario (antónimo).',
    },
    resuelve: {
      pieza: 'rv-soporte',
      generar(s) {
        const R = RESUELVE_1[s % RESUELVE_1.length];
        return resuelveDe(R, {
          pasos: [
            { tipo: 'pide', texto: `Piden un ${R.pide} de «${R.w}» en la acepción que usa el texto.` },
            { tipo: 'datos', texto: R.tengo },
            { tipo: 'regla', texto: 'Cada alternativa se pone en lugar de la palabra y se relee: sirve la que deja el texto diciendo lo que pide la pregunta.' },
            { tipo: 'aplica', texto: R.malas },
            { tipo: 'aplica', texto: R.bien, dibujo: { datos: R.sop, estado: estHoja(R.sop, R.buena) } },
            { tipo: 'sentido', texto: R.sentido },
          ],
        });
      },
    },
    ahoraTu: {
      pieza: 'rv-soporte',
      voz: 'Otro texto corto. Busca primero la pista de la palabra en negrita.',
      generar(s) {
        const A = AHORA_1[s % AHORA_1.length], sop = sim(13 + (s % AHORA_1.length), ors('h', A.o)), w = palabraDe(A.o);
        return {
          pregunta: PIDE[A.pide](w),
          datos: [D_ACEP, D_PISTA, A.pide === 'sinónimo' ? D_SINC : D_ANTC],
          dibujo: { datos: sop, estado: {} },
          opciones: opciones(A.ok, voltear(A.m, s)),
          solucion: { texto: `Con la pista, «${A.ok}» deja el texto diciendo ${A.pide === 'sinónimo' ? 'lo mismo' : 'lo contrario'}.`, ecuacion: [{ negrita: w }, A.pide === 'sinónimo' ? ' ≈ ' : ' ↔ ', justo(A.ok)],
            dibujo: { datos: sop, estado: estHoja(sop) } },
        };
      },
    },
  };

  // Mesa de la idea 1: el mural sin la misión, con sus retos.
  const mesaMural = Object.assign({ id: 'mural-claro', titulo: 'Las tres notas del mural', pieza: 'rv-soporte' }, sinMision(acepcion.juega), {
    invitaciones: [
      { texto: 'Pon «comprensible» en las tres notas y mira en cuál dice lo mismo.',
        logrado: val => NOTAS1.every(n => n.ops[val[n.id]] === 'comprensible'),
        bien: 'Solo en la nota 2: las otras dos hablan del cielo y de un color.' },
      { texto: 'Deja bien solo la nota del color; las otras, con «claro».',
        logrado: val => NOTAS1.every(n => val[n.id] === (n.id === 'n3' ? n.ok : 0)),
        bien: '«Casi blanco» pide un verde pálido.' },
      { texto: 'Haz que ninguna nota diga lo mismo que antes.',
        logrado: val => NOTAS1.every(n => val[n.id] && val[n.id] !== n.ok),
        bien: 'Cada reemplazo es de otra acepción: la pista no lo deja pasar.' },
    ] });

  // ---------- Idea 2: lo que dice y cómo lo valora (conserva su id; etapa 7) ----------
  // Cambia: la palabra que entra en cada mensaje. Permanece: los dos mensajes del grupo de la familia, quién los escribe
  // y lo que describen (gastar poco). Progresa: de dos huecos a dos palabras que valoran como quiere quien escribe. Se
  // reserva: la palabra neutra (predicción): el juego solo tiene elogio y crítica. Debe verse: que la denotación es la
  // misma en los dos mensajes, y que el soporte (quién escribe y para qué) decide la connotación.
  // Objeto de la primera pantalla: el celular, grupo «Familia Quispe» (la abuela y el tío escriben a la familia).
  // Colores: la pista de lo que quiere quien escribe, i; la palabra que no va con el mensaje, o; la que va, f.
  // Códigos: RVS2 (otra valoración), RVS3 (otro grado), RV19 (otra cosa: la palabra describe algo distinto) y RV20.
  const D_DEN = 'Denotación: lo que la palabra describe, sin ningún juicio.';
  const D_CON = 'Connotación: la valoración que la palabra suma a lo que describe: elogio, crítica o ninguna.';
  const D_QUIEN = 'Quien escribe: el soporte dice quién escribe, para quién y para qué; de ahí sale la valoración del texto.';
  const D_OTRAVAL = 'Otra valoración: la palabra describe lo mismo, pero elogia donde el texto critica, o al revés.';
  const D_GRADO = 'Otro grado: la palabra valora igual, pero con más o con menos fuerza que la del texto.';
  const D_OTRACOSA = 'Otra cosa: la palabra describe algo distinto de lo que dice el texto.';

  // El juego: el mundo chico de los dos mensajes. val: elogia (+1), critica (−1); den: lo que describe.
  const PAL2 = [{ t: '¿…?' }, { t: 'ahorrativo', val: 1, den: 'gasta poco' }, { t: 'tacaño', val: -1, den: 'gasta poco' }, { t: 'derrochador', val: -1, den: 'gasta mucho' }];
  const MSJ2 = [
    { id: 'm1', de: 'la abuela Rosa', pl: 'Mi nieto Iván es [w:¿…?]: guarda sus propinas y [p:no las gasta en tonterías].', quiere: 1, quien: 'la abuela está orgullosa' },
    { id: 'm2', de: 'el tío Luis', pl: 'Don Julio, el vecino, fue [w:¿…?]: [p:no puso ni un sol para la fiesta del barrio].', quiere: -1, quien: 'el tío se queja' },
  ];
  const RES2 = 'derrochador';
  const va2 = (m, v) => !!v && PAL2[v].den === 'gasta poco' && PAL2[v].val === m.quiere;
  const celu2 = val => ({ soporte: 'mensaje', lugar: 'Familia Quispe',
    hojas: MSJ2.map(m => ({ id: `h${m.id}`, de: m.de, para: 'la familia', oraciones: [oracion(m.id, m.pl, PAL2[val[m.id] || 0].t, RES2)] })) });
  const INI2 = { m1: 0, m2: 0 };
  const listo2 = val => MSJ2.every(m => va2(m, val[m.id]));
  const est2 = val => ({ marcas: Object.assign(Object.fromEntries(MSJ2.map(m => [`${m.id}p`, 'i'])),
    Object.fromEntries(MSJ2.filter(m => val[m.id]).map(m => [`${m.id}w`, va2(m, val[m.id]) ? 'f' : 'o']))) });
  const lectura2 = val => {
    if (listo2(val)) return [justo('Los dos gastan poco'), ': cambia cómo lo valora quien escribe'];
    const m = MSJ2.find(x => val[x.id] && !va2(x, val[x.id]));
    if (m) {
      const p = PAL2[val[m.id]];
      if (p.den !== 'gasta poco') return [prop(`«${may(p.t)}»`), ': cambia lo que dice; ese gasta mucho'];
      return [prop(`«${may(p.t)}»`), `: ${p.val > 0 ? 'elogia' : 'critica'}, y ${m.quien}`];
    }
    return MSJ2.some(x => val[x.id]) ? [justo('Uno va con su mensaje'), '; falta el otro'] : ['Toca un mensaje y prueba una palabra en el hueco'];
  };

  // La predicción: la palabra neutra, en el mensaje de la posta. Sin letras en la figura.
  const PL_POSTA = 'Su hijo está [w:¿…?] para su edad: [p:pesa menos de lo esperado].';
  const posta2 = (w, reserva) => ({ soporte: 'mensaje', lugar: 'Posta Las Lomas', hojas: [{ id: 'hp', de: 'la enfermera', para: 'la mamá de Iván',
    oraciones: [oracion('q1', PL_POSTA, w, reserva), oracion('q2', 'Lo esperamos el lunes para su control.')] }] });
  const PROB2 = probador('Cuaderno de Iván', '¿Qué palabra va en el mensaje de la posta?', 'Iván', PL_POSTA, ['esbelto', 'esquelético', 'débil', 'delgado']);

  // «Así se resuelve»: cuatro hojas. Cada incorrecta: otra valoración, otro grado u otra cosa. La buena: D, A, E y B.
  const PIDE2 = w => `En el texto, ¿qué palabra describe lo mismo que «${w}» y conserva su valoración?`;
  const RESUELVE_2 = [
    { sop: sim(41, ors('h', ['Los vecinos agradecieron a doña Carmen, una mujer [w:perseverante].', '[p:Pidió durante dos años la pista para el barrio, hasta que la hicieron].']), PIDE2('perseverante'),
      ['terca', 'desinteresada', 'heroica', 'constante', 'obstinada']), buena: 'D', w: 'perseverante',
      datos: [D_DEN, D_CON], tengo: ['Describe a quien insiste. La pista, ', cubre('«hasta que la hicieron»'), ', y el agradecimiento dicen que la elogia.'],
      malas: [mala('A'), ' y ', mala('E'), ' describen lo mismo, pero critican: ', prop('otra valoración'), '. ', mala('B'), ' es ', prop('otra cosa'), '. ', mala('C'), ' elogia con más fuerza: ', prop('otro grado'), '.'],
      bien: [buena('D'), ': una mujer ', justo('constante'), ' insiste, y la palabra la elogia igual.'],
      sentido: 'Relee: «los vecinos agradecieron a una mujer terca» suena a reproche; «constante», no.' },
    { sop: sim(42, ors('h', ['En su informe, el inspector anotó que el local es [w:pequeño]: mide cuatro metros por cinco.', '[p:No dio su opinión sobre el lugar].']), PIDE2('pequeño'),
      ['reducido', 'acogedor', 'diminuto', 'oscuro', 'miserable']), buena: 'A', w: 'pequeño',
      datos: [D_DEN, D_CON, D_QUIEN], tengo: ['Es un informe, y la pista, ', cubre('«no dio su opinión»'), ', dice que «pequeño» solo describe.'],
      malas: [mala('B'), ' elogia el lugar: ', prop('otra valoración'), '. ', mala('C'), ' exagera el tamaño: ', prop('otro grado'), '. ', mala('D'), ' es ', prop('otra cosa'), '. ', mala('E'), ' lo critica: ', prop('otra valoración'), '.'],
      bien: [buena('A'), ': un local ', justo('reducido'), ' es pequeño, y la palabra no lo juzga.'],
      sentido: 'Un inspector informa: no elogia ni critica, y tampoco exagera.' },
    { sop: sim(43, ors('h', ['En el chat de la promoción, Mateo se quejó de Diego: «Es un [w:entrometido]».', '[p:Lee los mensajes de todos sin que nadie se lo pida].']), PIDE2('entrometido'),
      ['curioso', 'criminal', 'tímido', 'atento', 'metiche']), buena: 'E', w: 'entrometido',
      datos: [D_DEN, D_CON], tengo: ['Mateo «se quejó»: la pista, ', cubre('«sin que nadie se lo pida»'), ', dice que «entrometido» critica.'],
      malas: [mala('A'), ' casi no critica: ', prop('otra valoración'), '. ', mala('B'), ' critica con mucha más fuerza: ', prop('otro grado'), '. ', mala('C'), ' es ', prop('otra cosa'), '. ', mala('D'), ' elogia: ', prop('otra valoración'), '.'],
      bien: [buena('E'), ': un ', justo('metiche'), ' se mete donde no lo llaman, y la palabra critica igual.'],
      sentido: 'Leer mensajes ajenos no es un delito: «criminal» exagera.' },
    { sop: sim(44, ors('h', ['El folleto turístico dice que el pueblo es [w:tranquilo]: [p:ideal para descansar lejos del ruido de la ciudad].']), PIDE2('tranquilo'),
      ['aburrido', 'apacible', 'paradisíaco', 'ruidoso', 'abandonado']), buena: 'B', w: 'tranquilo',
      datos: [D_DEN, D_CON, D_QUIEN], tengo: ['Un folleto turístico invita a ir. La pista, ', cubre('«ideal para descansar»'), ', dice que «tranquilo» elogia.'],
      malas: [mala('A'), ' y ', mala('E'), ' critican: ', prop('otra valoración'), '. ', mala('C'), ' elogia con mucha más fuerza: ', prop('otro grado'), '. ', mala('D'), ' es ', prop('otra cosa'), '.'],
      bien: [buena('B'), ': un pueblo ', justo('apacible'), ' es tranquilo, y la palabra lo elogia igual.'],
      sentido: 'Nadie escribe «aburrido» en un folleto que invita a visitar el pueblo.' },
  ];

  // «Ahora tú»: cuatro casos con cuatro opciones y dos con cinco. Códigos: RVS2, RVS3, RV19 y RV20.
  const AHORA_2 = [
    { o: ['En el informe de conducta, la auxiliar anotó que Pedro es [w:terco]: [p:no hace caso aunque se le explique varias veces].'], ok: 'obstinado',
      m: [['perseverante', 'RVS2', 'Describe a quien insiste, bien; pero elogia, y el informe critica.'],
        ['imposible', 'RVS3', 'Critica, bien; pero con mucha más fuerza que «terco».'],
        ['lento', 'RV19', 'Es otra cosa: describe la rapidez, no el no hacer caso.']] },
    { o: ['La directora felicitó a la brigada: sus integrantes fueron [w:valientes].', '[p:Sacaron a los niños del aula antes de que llegara el humo].'], ok: 'valerosos',
      m: [['imprudentes', 'RVS2', 'Describe a quien se arriesga, bien; pero critica, y la directora felicita.'],
        ['heroicos', 'RVS3', 'Elogia, bien; pero con más fuerza que «valientes».'],
        ['veloces', 'RV19', 'Es otra cosa: describe la rapidez, no el valor.']] },
    { o: ['En la carta de recomendación, el jefe escribió que Rosa es [w:ordenada]: [p:tiene cada documento en su lugar].'], ok: 'organizada',
      m: [['obsesionada', 'RVS2', 'Describe el orden, bien; pero critica, y una recomendación elogia.'],
        ['perfecta', 'RVS3', 'Elogia, bien; pero con mucha más fuerza que «ordenada».'],
        ['puntual', 'RV19', 'Es otra cosa: describe la hora a la que llega, no el orden.']] },
    { o: ['En el cuento de la abuela, el zorro es [w:mentiroso]: [p:engaña a todos los animales del cerro].'], ok: 'tramposo',
      m: [['ingenioso', 'RVS2', 'Describe a quien inventa algo, bien; pero elogia, y el cuento critica.'],
        ['diabólico', 'RVS3', 'Critica, bien; pero con mucha más fuerza que «mentiroso».'],
        ['veloz', 'RV19', 'Es otra cosa: describe la rapidez, no el engaño.']] },
    { o: ['En su discurso, el alcalde agradeció a los vecinos [w:generosos].', '[p:Donaron frazadas a las familias que perdieron sus casas].'], ok: 'bondadosos',
      m: [['ingenuos', 'RVS2', 'Describe a quien da sin pensarlo, bien; pero critica, y el alcalde agradece.'],
        ['santos', 'RVS3', 'Elogia, bien; pero con mucha más fuerza que «generosos».'],
        ['madrugadores', 'RV19', 'Es otra cosa: describe a qué hora se levantan.'],
        ['generales', 'RV20', 'Se escribe parecido a «generosos», bien visto; pero significa otra cosa.']] },
    { o: ['En la reunión, un padre se quejó del nuevo profesor: «Es [w:autoritario]».', '[p:No deja opinar a nadie y castiga por todo].'], ok: 'mandón',
      m: [['firme', 'RVS2', 'Describe a quien no cede, bien; pero casi elogia, y el padre se queja.'],
        ['tirano', 'RVS3', 'Critica, bien; pero con mucha más fuerza que «autoritario».'],
        ['puntual', 'RV19', 'Es otra cosa: describe la hora, no el trato.'],
        ['autorizado', 'RV20', 'Se escribe parecido a «autoritario», bien visto; pero significa otra cosa.']] },
  ];

  // Ejemplos resueltos de la idea 2. Nivel 1: qué valora una palabra, qué describe, si un reemplazo conserva la
  // valoración o el grado. Nivel 2: tres palabras, con dos fallas distintas. Nivel 3: la hoja con cinco alternativas;
  // las correctas son B, D, C, A y E. Revisado aparte (scratchpad e7-rv/revisa.js).
  const EJEMPLOS_2 = [
    { nivel: 1, titulo: 'La casa de la tía',
      enunciado: 'Según el mensaje de la tía Elena, ¿la palabra «antigua» elogia, critica o solo describe la casa?',
      datos: [D_DEN, D_CON],
      figura: fig(papel('mensaje', 'Familia Quispe', null, 'la tía Elena', 'la familia', ors('k', ['Compramos una casa [w:antigua] en el centro de Puno: [p:tiene unos balcones preciosos].']))),
      solucion: [{ texto: ['La pista, ', cubre('«unos balcones preciosos»'), ', dice que a la tía le gusta: la palabra elogia.'] }],
      respuesta: [justo('La elogia')] },
    { nivel: 1, titulo: 'El perro de la plaza',
      enunciado: 'En el cartel de la veterinaria, ¿qué describe la palabra «flaco», sin contar su valoración?',
      datos: [D_DEN, D_CON],
      figura: fig(papel('cartel', 'Cartel de la veterinaria', 'Se busca dueño', 'la veterinaria', 'los vecinos', ors('k', ['Se busca dueño para un perro [w:flaco], de pelo negro.', '[p:Lo encontramos en la plaza el domingo].']))),
      solucion: [{ texto: ['Lo que describe, su ', cubre('denotación'), ', es el cuerpo del perro: tiene poco peso.'] }],
      respuesta: [justo('Que el perro tiene poco peso')] },
    { nivel: 1, titulo: 'La mudanza',
      enunciado: '¿La palabra «perezoso» puede reemplazar a «flojo» sin cambiar la valoración del mensaje?',
      datos: [D_DEN, D_CON, D_REEMP],
      figura: fig(papel('mensaje', 'Familia Quispe', null, 'el tío Luis', 'la familia', ors('k', ['Mi sobrino es un [w:flojo]: [p:no ayudó en nada con la mudanza].']))),
      solucion: [{ texto: ['Las dos describen a quien no quiere trabajar, y las dos lo critican, como la pista ', cubre('«no ayudó en nada»'), '.'] }],
      respuesta: [justo('Sí'), ': describen lo mismo y critican igual'] },
    { nivel: 1, titulo: 'El aviso de la posta',
      enunciado: '¿La palabra «revoltoso» conserva la valoración de «inquieto» en el aviso de la posta?',
      datos: [D_DEN, D_CON, D_QUIEN],
      figura: fig(papel('puerta', 'Puerta de la posta de Ilave', 'Aviso para la guardia', 'la enfermera de turno', 'la enfermera de la noche', ors('k', ['El paciente de la cama 3 está [w:inquieto]: [p:se mueve mucho y no logra dormir].']))),
      solucion: [
        { texto: ['«Revoltoso» critica a quien hace desorden: ', prop('otra valoración'), '.'] },
        { texto: ['El aviso solo informa: ', cubre('«se mueve mucho»'), ' no juzga al paciente.'] }],
      respuesta: [justo('No'), ': «revoltoso» critica y el aviso solo describe'] },
    { nivel: 1, titulo: 'El examen de ayer',
      enunciado: 'En el mensaje de Ana, ¿la palabra «imposible» conserva el grado de «difícil»?',
      datos: [D_DEN, D_CON, D_GRADO],
      figura: fig(papel('mensaje', 'Promoción 2026', null, 'Ana', 'la promoción', ors('k', ['El examen de ayer estuvo [w:difícil]: [p:varios no terminaron a tiempo, pero casi todos aprobaron].']))),
      solucion: [
        { texto: ['«Imposible» dice que nadie podía resolverlo: es ', prop('otro grado'), ', más fuerte.'] },
        { texto: ['La pista, ', cubre('«casi todos aprobaron»'), ', no deja exagerar.'] }],
      respuesta: [justo('No'), ': «imposible» exagera'] },

    { nivel: 2, titulo: 'El vecino que ayuda',
      enunciado: '¿Qué palabra conserva lo que describe «servicial» y su elogio: «sumiso», «siempre ocupado» o «colaborador»?',
      datos: [D_DEN, D_CON],
      figura: fig(papel('mural', 'Mural de la junta vecinal', 'Gracias, don Pedro', 'la junta vecinal', 'los vecinos', ors('k', ['Don Pedro es un vecino [w:servicial]: [p:siempre ayuda a cargar las compras de los mayores].']))),
      solucion: [
        { texto: ['«Sumiso» describe a quien obedece sin opinar, y critica: ', prop('otra valoración'), '. «Siempre ocupado» es ', prop('otra cosa'), '.'] },
        { texto: ['La pista, ', cubre('«siempre ayuda»'), ', y la palabra que elogia igual: colaborador.'] }],
      respuesta: [justo('«Colaborador»')] },
    { nivel: 2, titulo: 'La sopa del tío',
      enunciado: '«Salada» critica la sopa. ¿Qué conserva lo que dice y su crítica: «sabrosa y bien sazonada», «pasada de sal» o «sosa»?',
      datos: [D_DEN, D_CON],
      figura: fig(papel('mensaje', 'Familia Quispe', null, 'la abuela Rosa', 'la familia', ors('k', ['El tío Luis cocinó una sopa muy [w:salada]: [p:nadie pudo terminar su plato].']))),
      solucion: [
        { texto: ['«Sabrosa y bien sazonada» elogia: ', prop('otra valoración'), '. «Sosa» dice que le falta sal: ', prop('otra cosa'), '.'] },
        { texto: ['La pista, ', cubre('«nadie pudo terminar»'), ', pide una crítica a la sal.'] }],
      respuesta: [justo('«Pasada de sal»')] },
    { nivel: 2, titulo: 'El celular del primo',
      enunciado: '¿Qué palabra conserva lo que dice «viejo» y su crítica: «gastado», «de colección» o «caro»?',
      datos: [D_DEN, D_CON],
      figura: fig(papel('mensaje', 'Promoción 2026', null, 'Mateo', 'la promoción', ors('k', ['Mi primo tiene un celular [w:viejo]: [p:se apaga solo y la pantalla está rota].']))),
      solucion: [
        { texto: ['«De colección» se dice con aprecio: ', prop('otra valoración'), '. «Caro» es ', prop('otra cosa'), ': el precio.'] },
        { texto: ['La pista, ', cubre('«se apaga solo»'), ', critica el uso que tiene encima.'] }],
      respuesta: [justo('«Gastado»')] },
    { nivel: 2, titulo: 'La amiga de Lucía',
      enunciado: '¿Qué palabra conserva el elogio de «conversadora»: «charlatana», «muda» o «amena»?',
      datos: [D_DEN, D_CON],
      figura: fig(papel('mensaje', 'Promoción 2026', null, 'Lucía', 'la promoción', ors('k', ['Mi amiga Rosa es muy [w:conversadora]: [p:con ella las horas pasan volando].']))),
      solucion: [
        { texto: ['«Charlatana» describe a quien habla mucho, pero critica: ', prop('otra valoración'), '. «Muda» es ', prop('otra cosa'), '.'] },
        { texto: ['La pista, ', cubre('«las horas pasan volando»'), ', elogia su charla.'] }],
      respuesta: [justo('«Amena»')] },
    { nivel: 2, titulo: 'El niño perdido',
      enunciado: '¿Qué palabra describe lo mismo que «pequeño» sin agregar valoración: «menudo», «enano» o «travieso»?',
      datos: [D_DEN, D_CON, D_QUIEN],
      figura: fig(papel('cartel', 'Cartel en la plaza de Chucuito', 'Niño perdido', 'la comisaría', 'los vecinos', ors('k', ['Se perdió un niño [w:pequeño], de cinco años.', '[p:Lleva polo rojo y zapatillas azules].']))),
      solucion: [
        { texto: ['«Enano» ofende: ', prop('otra valoración'), '. «Travieso» es ', prop('otra cosa'), ': no habla del tamaño.'] },
        { texto: ['El cartel solo informa, como la pista ', cubre('«lleva polo rojo»'), '.'] }],
      respuesta: [justo('«Menudo»')] },

    { nivel: 3, titulo: 'La obra de teatro',
      enunciado: 'Pregunta 51 del simulacro. En el texto, la palabra «larga» connota',
      datos: [D_DEN, D_CON],
      figura: fig(sim(51, ors('h', ['En la reseña del festival, la crítica calificó la obra de teatro de [w:larga]: [p:duró tres horas y la sala se fue vaciando].']), 'En el texto, la palabra «larga» connota',
        ['un elogio por su duración', 'una crítica por lo que duró', 'solo cuánto tiempo duró', 'admiración por los actores', 'una queja contra los actores'])),
      solucion: [
        { texto: [mala('A'), ' es ', prop('otra valoración'), '. ', mala('C'), ' le quita la valoración: la sala se vaciaba.'] },
        { texto: [mala('D'), ' y ', mala('E'), ' hablan de los actores: ', prop('otra cosa'), '.'] },
        { texto: [buena('B'), ': la pista, ', cubre('«la sala se fue vaciando»'), ', dice que la reseña critica.'] }],
      respuesta: [buena('B'), ': una crítica por lo que duró'] },
    { nivel: 3, titulo: 'Los tejedores de la feria',
      enunciado: 'Pregunta 52 del simulacro. ¿Qué palabra describe lo mismo que «hábiles» y conserva su valoración?',
      datos: [D_DEN, D_CON, D_GRADO],
      figura: fig(sim(52, ors('h', ['Los organizadores de la feria presentaron a los tejedores de Chucuito como [w:hábiles]: [p:tejen en un día una chompa entera con dibujos].']), PIDE2('hábiles'),
        ['lentos', 'geniales', 'pacientes', 'diestros', 'tramposos'])),
      solucion: [
        { texto: [mala('A'), ' y ', mala('C'), ' son ', prop('otra cosa'), '. ', mala('B'), ' elogia con mucha más fuerza: ', prop('otro grado'), '.'] },
        { texto: [mala('E'), ' critica: ', prop('otra valoración'), '.'] },
        { texto: [buena('D'), ': la pista, ', cubre('«una chompa entera en un día»'), ', elogia la mano de los tejedores.'] }],
      respuesta: [buena('D'), ': diestros'] },
    { nivel: 3, titulo: 'El agua del río',
      enunciado: 'Pregunta 53 del simulacro. ¿Qué palabra describe lo mismo que «turbia» sin agregar valoración?',
      datos: [D_DEN, D_CON, D_QUIEN],
      figura: fig(sim(53, ors('h', ['El informe del municipio dice que el río del pueblo baja con agua [w:turbia]: [p:lleva tierra y no deja ver el fondo].']), 'En el texto, ¿qué palabra describe lo mismo que «turbia» sin agregar valoración?',
        ['asquerosa', 'cristalina', 'revuelta', 'contaminada', 'fría'])),
      solucion: [
        { texto: [mala('A'), ' critica con fuerza: ', prop('otra valoración'), '. ', mala('B'), ' dice lo contrario: ', prop('otra cosa'), '.'] },
        { texto: [mala('D'), ' dice que hay basura o veneno, ', prop('otra cosa'), '. ', mala('E'), ' habla de la temperatura.'] },
        { texto: [buena('C'), ': un agua revuelta lleva tierra, como dice la pista ', cubre('«lleva tierra»'), '.'] }],
      respuesta: [buena('C'), ': revuelta'] },
    { nivel: 3, titulo: 'La carta para la beca',
      enunciado: 'Pregunta 54 del simulacro. ¿Qué palabra describe lo mismo que «responsable» y conserva su valoración?',
      datos: [D_DEN, D_CON, D_QUIEN],
      figura: fig(sim(54, ors('h', ['En su carta para la beca, la directora escribe que Iván es [w:responsable]: [p:entrega sus trabajos a tiempo y cuida lo que le prestan].']), PIDE2('responsable'),
        ['cumplido', 'cuadriculado', 'impecable', 'callado', 'obediente'])),
      solucion: [
        { texto: [mala('B'), ' critica a quien no cambia nada: ', prop('otra valoración'), '. ', mala('C'), ' elogia con más fuerza: ', prop('otro grado'), '.'] },
        { texto: [mala('D'), ' y ', mala('E'), ' son ', prop('otra cosa'), ': no hablan de cumplir.'] },
        { texto: [buena('A'), ': la pista, ', cubre('«entrega sus trabajos a tiempo»'), ', es lo que hace alguien cumplido.'] }],
      respuesta: [buena('A'), ': cumplido'] },
    { nivel: 3, titulo: 'El uniforme nuevo',
      enunciado: 'Pregunta 55 del simulacro. En el texto, la palabra «caro» connota',
      datos: [D_DEN, D_CON],
      figura: fig(sim(55, ors('h', ['En el periódico mural, el comité de estudiantes criticó el nuevo uniforme por ser [w:caro]: [p:cuesta el doble que el del año pasado].']), 'En el texto, la palabra «caro» connota',
        ['que el uniforme es de calidad', 'que es más bonito', 'que cuesta poco', 'un dato sin juicio', 'una queja por el precio'])),
      solucion: [
        { texto: [mala('A'), ' lo elogia: ', prop('otra valoración'), '. ', mala('D'), ' le quita la crítica.'] },
        { texto: [mala('B'), ' es ', prop('otra cosa'), ', y ', mala('C'), ' dice lo contrario.'] },
        { texto: [buena('E'), ': el comité «criticó», y la pista, ', cubre('«cuesta el doble»'), ', habla del precio.'] }],
      respuesta: [buena('E'), ': una queja por el precio'] },
  ];

  const denotaConnota = {
    id: 'denota-connota',
    titulo: 'Lo que dice y cómo valora',
    pregunta: '¿«Ahorrativo» y «tacaño» dicen lo mismo de una persona?',
    temas: ['Denotación y connotación'],
    pieza: 'rv-soporte',
    lee: {
      tarjetas: [
        { titulo: 'Dos mensajes de la familia', texto: 'En el grupo de la familia Quispe, la abuela cuenta algo de su nieto y el tío cuenta algo del vecino. Los dos hablan de gastar poco, pero cada uno escribe con otra intención.',
          pieza: 'rv-soporte', dibujo: { datos: celu2(INI2), estado: {} } },
        { titulo: 'Lo que describe', texto: 'Lo que una palabra describe, sin ningún juicio, es su denotación. «Morir» y «fallecer» tienen la misma denotación: el fin de una vida.' },
        { titulo: 'Cómo lo valora', texto: 'Muchas palabras suman un juicio: elogian, critican o se burlan. Eso es su connotación. «Mansión» y «choza» denotan una vivienda; la primera suma lujo y la segunda, pobreza.' },
        { titulo: 'Qué mirar al jugar', texto: 'Toca un mensaje para poner una palabra en el hueco. Fíjate en quién escribe y para qué: así sabes si quiere elogiar o criticar.' },
      ],
    },
    actividad: 'Poner en cada mensaje del celular la palabra que valora como quiere quien escribe.',
    aprendizaje: 'La denotación es lo que la palabra describe; la connotación, cómo lo valora. Un reemplazo conserva las dos, y quien escribe dice cuál.',
    ejemplos: EJEMPLOS_2,
    juega: {
      consigna: 'En el grupo de la familia, la abuela y el tío escriben de dos personas que gastan poco. Falta una palabra en cada mensaje.',
      mision: {
        texto: 'Pon en cada mensaje la palabra que elogia o critica, como quiere quien escribe.',
        logrado: listo2,
        bien: 'Las dos palabras dicen lo mismo, gastar poco; cambia cómo lo valoran.',
      },
      voz: '¿Quién escribe cada mensaje y qué quiere decir de esa persona?',
      leyenda: [
        { s: 'negrita', t: 'la palabra que se cambia' },
        { s: cubre('turquesa'), t: 'la pista de lo que quiere quien escribe' },
        { s: prop('naranja'), t: 'palabra que no va con el mensaje' },
        { s: justo('violeta'), t: 'palabra que va con el mensaje' },
      ],
      controles: MSJ2.map((m, k) => ({ id: m.id, etiqueta: `Mensaje ${k + 1}`, opciones: PAL2.map((p, v) => ({ valor: v, texto: v ? p.t : 'vacío' })) })),
      dibujo: val => ({ datos: Object.assign({ toques: { m1: 'm1', m2: 'm2' } }, celu2(val)), estado: est2(val) }),
      lectura: lectura2,
      minimo: 3,
    },
    predice: {
      pregunta: 'La enfermera de la posta escribe a la mamá de Iván: «Su hijo está ___ para su edad: pesa menos de lo esperado». ¿Qué palabra describe lo mismo sin elogiar ni criticar?',
      voz: 'Elige antes de ver: después lo comprobamos con quien escribe.',
      opciones: opciones('delgado', [
        ['esbelto', 'RVS2', 'Describe poco peso, bien; pero lo elogia, y la enfermera solo informa.'],
        ['esquelético', 'RVS3', 'Describe poco peso, bien; pero critica, y con mucha fuerza.'],
        ['débil', 'RV19', 'Habla del cuerpo, bien; pero describe la fuerza, no el peso.'],
      ]),
      dibujo: { datos: posta2(), estado: {} },
      revelar: { datos: posta2('delgado', 'esquelético'), estado: { marcas: { q1w: 'f', q1p: 'i' } } },
      coincide: 'Coincide: «delgado» describe el poco peso sin juzgarlo, como escribe una enfermera.',
    },
    mira: {
      datos: PROB2,
      voz: 'Volvamos al mensaje, palabra por palabra.',
      pasos: [
        { estado: { senal: ['c0'], marcas: { c0p: 'i' } }, texto: 'La pista dice lo que describe la palabra: poco peso para su edad.',
          ecuacion: [cubre('pesa menos'), ' → ', { negrita: 'denotación: poco peso' }] },
        { estado: { marcas: { c0p: 'i' }, tachar: ['c1'], nuevo: ['c1'] }, texto: 'Esbelto elogia, y la enfermera no elogia: solo informa.',
          ecuacion: [prop('esbelto'), ': otra valoración'] },
        { estado: { marcas: { c0p: 'i' }, tachar: ['c1', 'c2'], nuevo: ['c2'] }, texto: 'Esquelético critica, y con mucha fuerza.',
          ecuacion: [prop('esquelético'), ': otro grado'] },
        { estado: { marcas: { c0p: 'i' }, tachar: ['c1', 'c2', 'c3'], nuevo: ['c3'] }, texto: 'Débil describe la fuerza, no el peso: es otra cosa.',
          ecuacion: [prop('débil'), ': otra cosa'] },
        { estado: { marcas: { c0p: 'i', c4: 'f' }, tachar: ['c1', 'c2', 'c3'], nuevo: ['c4'] }, texto: 'Delgado describe el poco peso y no lo juzga: es neutra.',
          ecuacion: [justo('delgado'), ' = poco peso + ', { negrita: 'sin juicio' }] },
      ],
    },
    regla: {
      texto: 'La denotación es lo que la palabra describe; la connotación, cómo lo valora: elogio, crítica o ninguno. Un reemplazo en contexto conserva las dos, y quien escribe dice cuál.',
      ecuacion: [{ llave: [cubre('denotación')], nota: 'qué describe' }, ' + ', { llave: [{ negrita: 'connotación' }], nota: 'cómo valora' }],
      voz: 'Vuelve a esta regla cuando dudes con una palabra.',
      condicion: 'el reemplazo describe lo mismo y valora igual, con la misma fuerza: «esquelético» no reemplaza a «flaco».',
    },
    resuelve: {
      pieza: 'rv-soporte',
      generar(s) {
        const R = RESUELVE_2[s % RESUELVE_2.length];
        return resuelveDe(R, {
          pasos: [
            { tipo: 'pide', texto: `Piden una palabra que describa lo mismo que «${R.w}» y valore igual.` },
            { tipo: 'datos', texto: R.tengo },
            { tipo: 'regla', texto: 'Cada alternativa se prueba dos veces: ¿describe lo mismo? ¿Valora igual, con la misma fuerza?' },
            { tipo: 'aplica', texto: R.malas },
            { tipo: 'aplica', texto: R.bien, dibujo: { datos: R.sop, estado: estHoja(R.sop, R.buena) } },
            { tipo: 'sentido', texto: R.sentido },
          ],
        });
      },
    },
    ahoraTu: {
      pieza: 'rv-soporte',
      voz: 'Otro texto corto. Mira quién escribe y qué quiere decir.',
      generar(s) {
        const A = AHORA_2[s % AHORA_2.length], sop = sim(45 + (s % AHORA_2.length), ors('h', A.o)), w = palabraDe(A.o);
        return {
          pregunta: `¿Qué palabra puede reemplazar a «${w}» sin cambiar lo que describe ni cómo lo valora?`,
          datos: [D_DEN, D_CON, D_OTRAVAL, D_GRADO],
          dibujo: { datos: sop, estado: {} },
          opciones: opciones(A.ok, voltear(A.m, s)),
          solucion: { texto: `«${A.ok}» describe lo mismo que «${w}» y lo valora igual, con la misma fuerza.`, ecuacion: [{ negrita: w }, ' ≈ ', justo(A.ok)],
            dibujo: { datos: sop, estado: estHoja(sop) } },
        };
      },
    },
  };
  const mesaCelular = Object.assign({ id: 'dos-mensajes', titulo: 'Los dos mensajes de la familia', pieza: 'rv-soporte' }, sinMision(denotaConnota.juega), {
    invitaciones: [
      { texto: 'Pon «tacaño» en los dos mensajes y mira cuál cambia.',
        logrado: val => MSJ2.every(m => PAL2[val[m.id]].t === 'tacaño'),
        bien: 'La abuela no critica a su nieto: con «tacaño», su mensaje dice otra cosa.' },
      { texto: 'Pon en un mensaje una palabra que cambie lo que describe.',
        logrado: val => MSJ2.some(m => val[m.id] && PAL2[val[m.id]].den !== 'gasta poco'),
        bien: 'El derrochador gasta mucho: ya no es la misma denotación.' },
      { texto: 'Haz que los dos mensajes digan lo mismo y valoren al revés.',
        logrado: val => MSJ2.every(m => val[m.id] && PAL2[val[m.id]].den === 'gasta poco' && !va2(m, val[m.id])),
        bien: 'La abuela critica y el tío elogia: la denotación no cambió.' },
    ] });

  // ---------- Idea 3: la palabra precisa (conserva su id; etapa 7) ----------
  // Cambia: el verbo que entra en lugar de cada «hizo». Permanece: el acta de la junta y sus tres oraciones. Progresa:
  // de tres «hizo» a tres verbos que nombran justo su acción. Se reserva: el verbo que choca con otra parte de la oración
  // (predicción): en el juego, cada verbo solo se prueba con su objeto. Debe verse: que «hizo» encaja en las tres, y que
  // por eso dice poco.
  // Objeto de la primera pantalla: la puerta del local comunal con el acta (la secretaria, para los vecinos).
  // Colores: el objeto de cada acción (la pista), i; el verbo que no va con su objeto, o; el que lo nombra justo, f.
  // Códigos: RVS4 (comodín), RV23 (choca con otra parte de la oración), RV19 (mismo campo u otra acción) y RV20.
  const D_PREC = 'Palabra precisa: nombra justo lo que dice la oración y no choca con ninguna de sus partes.';
  const D_COMOD = 'Comodín: palabra tan general (hacer, dar, tener, cosa) que encaja en casi todo y dice poco.';
  const D_CHOCA = 'Choca: la palabra va con una parte de la oración, pero contradice otra.';
  const D_OTRAAC3 = 'Otra acción: la palabra nombra lo que se hace con otra cosa, no con la de la oración.';

  // El juego: el mundo chico del acta. Cada objeto tiene un solo verbo que lo nombra; «hizo» encaja con todos.
  const VERBOS3 = ['hizo', 'construyó', 'formuló', 'abrió'];
  const ACTA3 = [
    { id: 'a1', pl: 'El albañil [w:hizo] [p:el muro] del local comunal.', ok: 1, obj: 'el muro' },
    { id: 'a2', pl: 'Doña Carmen [w:hizo] [p:una pregunta] en voz alta sobre las cuotas.', ok: 2, obj: 'una pregunta' },
    { id: 'a3', pl: 'Don Pedro [w:hizo] [p:un hueco] en la pared para la nueva ventana.', ok: 3, obj: 'un hueco' },
  ];
  const acta3 = val => papel('puerta', 'Puerta del local comunal', 'Acta de la reunión del sábado', 'la secretaria de la junta', 'los vecinos de la calle Lima',
    ACTA3.map(a => oracion(a.id, a.pl, VERBOS3[val[a.id] || 0], 'construyó')));
  const INI3 = { a1: 0, a2: 0, a3: 0 };
  const listo3 = val => ACTA3.every(a => val[a.id] === a.ok);
  const est3 = val => ({ marcas: Object.assign(Object.fromEntries(ACTA3.map(a => [`${a.id}p`, 'i'])),
    Object.fromEntries(ACTA3.filter(a => val[a.id]).map(a => [`${a.id}w`, val[a.id] === a.ok ? 'f' : 'o']))) });
  const lectura3 = val => {
    if (listo3(val)) return [justo('Cada verbo va con su objeto'), ': dice más que «hizo»'];
    const a = ACTA3.find(x => val[x.id] && val[x.id] !== x.ok);
    if (a) return [prop(`«${may(VERBOS3[val[a.id]])}»`), ` no va con «${a.obj}»: es otra acción`];
    return ACTA3.some(x => val[x.id]) ? [justo('Ese verbo dice más que «hizo»'), '; faltan dos'] : ['«Hizo» encaja en las tres oraciones: por eso dice poco'];
  };

  // La predicción: el verbo que choca con «antes de aprobarlo». Sin letras en la figura.
  const PL_APAFA = 'La comisión [w:¿…?] el reglamento con cuidado [p:antes de aprobarlo].';
  const apafa3 = (w, reserva) => ({ soporte: 'mensaje', lugar: 'APAFA del colegio', hojas: [{ id: 'ha', de: 'el presidente de la APAFA', para: 'las familias',
    oraciones: [oracion('r1', PL_APAFA, w, reserva), oracion('r2', 'La asamblea para votarlo será el viernes.')] }] });
  const PROB3 = probador('Cuaderno de Rosa', '¿Qué verbo va en el mensaje de la APAFA?', 'Rosa', PL_APAFA, ['vio', 'aprobó', 'imprimió', 'examinó']);

  // «Así se resuelve»: cuatro hojas. Cada incorrecta: comodín, choca, otra acción, mismo campo o parecido de forma. La
  // buena: D, A, E y B.
  const PIDE3 = w => `En el texto, ¿qué palabra reemplaza a «${w}» con más precisión?`;
  const P_HUECO = 'En el texto, ¿qué palabra completa la oración con más precisión?';
  const RESUELVE_3 = [
    { sop: sim(61, ors('h', ['La municipalidad [w:hizo] un puente peatonal sobre el río.', '[p:Ahora los niños cruzan sin mojarse] para llegar al colegio.']), PIDE3('hizo'),
      ['tuvo', 'destruyó', 'pintó', 'levantó', 'diseñó']), buena: 'D', w: 'hizo',
      datos: [D_PREC, D_COMOD], tengo: ['«Hizo» es un comodín. La pista, ', cubre('«ahora los niños cruzan»'), ', dice que el puente ya está en pie.'],
      malas: [mala('A'), ' es otro ', prop('comodín'), '. ', mala('B'), ' ', prop('choca'), ' con la pista. ', mala('C'), ' es ', prop('otra acción'), '. ', mala('E'), ' es del ', prop('mismo campo'), ', pero un puente diseñado no se cruza.'],
      bien: [buena('D'), ': la municipalidad ', justo('levantó'), ' el puente: lo construyó.'],
      sentido: 'Relee con la palabra puesta: el puente existe y los niños lo cruzan.' },
    { sop: sim(62, ors('h', ['En la reunión, el director [w:dio] una noticia: [p:el colegio tendrá internet desde mayo].']), PIDE3('dio'),
      ['anunció', 'regaló', 'tuvo', 'ocultó', 'escribió']), buena: 'A', w: 'dio',
      datos: [D_PREC, D_COMOD], tengo: ['«Dio» es un comodín. La pista, ', cubre('«en la reunión»'), ', dice que la contó a todos de viva voz.'],
      malas: [mala('B'), ' es ', prop('otra acción'), ': se regalan cosas. ', mala('C'), ' es otro ', prop('comodín'), '. ', mala('D'), ' ', prop('choca'), ': la noticia se contó. ', mala('E'), ' es del ', prop('mismo campo'), '.'],
      bien: [buena('A'), ': el director ', justo('anunció'), ' la noticia a todos.'],
      sentido: 'Una noticia se anuncia en una reunión; escribirla es otra cosa.' },
    { sop: sim(63, ors('h', ['El médico le [w:______] una dieta sin sal a su paciente:', '[p:se la anotó en la receta junto con las pastillas].']), P_HUECO,
      ['dio', 'cocinó', 'prohibió', 'retó', 'recetó']), buena: 'E', w: '______',
      datos: [D_PREC, D_COMOD], tengo: ['La pista, ', cubre('«se la anotó en la receta»'), ', dice que fue una indicación del médico.'],
      malas: [mala('A'), ' es un ', prop('comodín'), '. ', mala('B'), ' es del ', prop('mismo campo'), ', la comida. ', mala('C'), ' ', prop('choca'), ': lo prohibido es la sal. ', mala('D'), ' tiene ', prop('parecido de forma'), '.'],
      bien: [buena('E'), ': el médico le ', justo('recetó'), ' la dieta, y la anotó en la receta.'],
      sentido: 'Un médico receta: es justo lo que hace con una dieta para su paciente.' },
    { sop: sim(64, ors('h', ['Los vecinos [w:hicieron] una colecta [p:para arreglar el techo de la posta].', 'En una semana juntaron lo necesario.']), PIDE3('hicieron'),
      ['tuvieron', 'organizaron', 'gastaron', 'contabilizaron', 'colgaron']), buena: 'B', w: 'hicieron',
      datos: [D_PREC, D_COMOD], tengo: ['«Hicieron» es un comodín. La pista, ', cubre('«para arreglar el techo»'), ', dice para qué juntaron el dinero.'],
      malas: [mala('A'), ' es otro ', prop('comodín'), '. ', mala('C'), ' ', prop('choca'), ': el dinero se juntó. ', mala('D'), ' es del ', prop('mismo campo'), ', el del dinero. ', mala('E'), ' es ', prop('otra acción'), '.'],
      bien: [buena('B'), ': los vecinos ', justo('organizaron'), ' la colecta y juntaron lo necesario.'],
      sentido: 'Contar el dinero viene después; primero hay que organizar la colecta.' },
  ];

  // «Ahora tú»: la oración trae un hueco. Cuatro casos con cuatro opciones y dos con cinco. Códigos: RVS4, RV23, RV19 y
  // RV20.
  const AHORA_3 = [
    { o: ['El jurado [w:______] al ganador del concurso de cuentos.', '[p:Leyó los cuarenta cuentos antes de decidir].'], ok: 'eligió',
      m: [['tuvo', 'RVS4', 'Encaja, bien; pero es un comodín: no dice qué hizo el jurado.'],
        ['descalificó', 'RV23', 'Es algo que hace un jurado, bien; pero choca con «ganador».'],
        ['escribió', 'RV19', 'Es del mismo campo, el de los cuentos; pero el jurado no los escribe.']] },
    { o: ['La profesora [w:______] las dudas de los alumnos una por una:', '[p:al final de la clase, nadie tenía preguntas].'], ok: 'resolvió',
      m: [['vio', 'RVS4', 'Encaja, bien; pero es un comodín: no dice que las aclarara.'],
        ['multiplicó', 'RV23', 'Va con «dudas», bien; pero choca con «nadie tenía preguntas».'],
        ['dictó', 'RV19', 'Es del mismo campo, el de la clase; pero no se dictan dudas.']] },
    { o: ['La alcaldesa [w:______] la nueva plaza en la ceremonia del domingo:', '[p:cortó la cinta y la abrió al público].'], ok: 'inauguró',
      m: [['hizo', 'RVS4', 'Encaja, bien; pero es un comodín: no dice qué pasó en la ceremonia.'],
        ['cerró para siempre', 'RV23', 'Es algo que se hace con una plaza, bien; pero choca con «la abrió al público».'],
        ['barrió', 'RV19', 'Es del mismo campo, la plaza, bien; pero no se hace en una ceremonia.']] },
    { o: ['Los bomberos [w:______] el incendio del mercado en dos horas:', '[p:cuando se fueron, ya no quedaba fuego].'], ok: 'apagaron',
      m: [['vieron', 'RVS4', 'Encaja, bien; pero es un comodín: no dice qué hicieron con el fuego.'],
        ['provocaron', 'RV23', 'Va con «incendio», bien; pero choca con lo que hacen los bomberos.'],
        ['mojaron', 'RV19', 'Es del mismo campo, el del agua; pero no dice que el fuego acabó.']] },
    { o: ['El río [w:______] los campos de la parte baja:', '[p:después de tres días de lluvia, el agua tapó las chacras].'], ok: 'inundó',
      m: [['afectó', 'RVS4', 'Encaja, bien; pero es casi un comodín: no dice qué les pasó.'],
        ['secó', 'RV23', 'Es algo que pasa en un campo, bien; pero choca con «el agua tapó».'],
        ['fertilizó', 'RV19', 'Es del mismo campo, la chacra; pero no dice que el agua los tapó.'],
        ['hundió', 'RV20', 'Se escribe parecido a la palabra que va, bien visto; pero significa otra cosa.']] },
    { o: ['El ministro [w:______] el nuevo reglamento en el diario oficial:', '[p:desde ese día, todos pueden leerlo].'], ok: 'publicó',
      m: [['puso', 'RVS4', 'Encaja, bien; pero es un comodín: no dice cómo llegó a todos.'],
        ['escondió', 'RV23', 'Va con «reglamento», bien; pero choca con «todos pueden leerlo».'],
        ['imprimió', 'RV19', 'Es del mismo campo, el del diario; pero imprimir no es darlo a conocer.'],
        ['duplicó', 'RV20', 'Se escribe parecido a la palabra que va, bien visto; pero significa otra cosa.']] },
  ];

  // Ejemplos resueltos de la idea 3. Nivel 1: si una palabra es un comodín, si otra es más precisa, qué parte choca.
  // Nivel 2: tres palabras, con dos fallas distintas. Nivel 3: la hoja con cinco alternativas; las correctas son B, D, C,
  // A y E. Revisado aparte (scratchpad e7-rv/revisa.js).
  const EJEMPLOS_3 = [
    { nivel: 1, titulo: 'Lo que pidió el tutor',
      enunciado: '¿Por qué la palabra «cosas» dice poco en el mensaje del tutor?',
      datos: [D_PREC, D_COMOD],
      figura: fig(papel('mensaje', 'Familias de 5.º B', null, 'el tutor', 'las familias', ors('k', ['Para la feria del sábado traigan [w:cosas]: [p:mesas, toldos y bolsas].']))),
      solucion: [{ texto: ['«Cosas» sirve para cualquier objeto: es un ', prop('comodín'), '. Lo preciso lo dice la lista, ', cubre('«mesas, toldos y bolsas»'), '.'] }],
      respuesta: [justo('Es un comodín'), ': sirve para cualquier objeto'] },
    { nivel: 1, titulo: 'El informe del tesorero',
      enunciado: '¿«Redactó» es más preciso que «hizo» en el acta de la junta?',
      datos: [D_PREC, D_COMOD],
      figura: fig(papel('puerta', 'Puerta del local comunal', 'Acta de la reunión', 'la secretaria', 'los vecinos', ors('k', ['El tesorero [w:hizo] [p:un informe] de los gastos del mes.']))),
      solucion: [{ texto: ['«Hizo» es un ', prop('comodín'), '. Con ', cubre('«un informe»'), ', «redactó» nombra justo lo que se hace: escribirlo.'] }],
      respuesta: [justo('Sí'), ': nombra lo que se hace con un informe'] },
    { nivel: 1, titulo: 'La tienda de mamá',
      enunciado: '¿Qué parte del mensaje choca con la palabra «abrió»?',
      datos: [D_PREC, D_CHOCA],
      figura: fig(papel('mensaje', 'Familia Quispe', null, 'Iván', 'la familia', ors('k', ['Mamá [w:abrió] la tienda [p:a las nueve de la noche, al terminar el día].', 'Mañana atiende desde temprano.']))),
      solucion: [{ texto: ['Al terminar el día, una tienda se cierra: ', cubre('«al terminar el día»'), ' ', prop('choca'), ' con «abrió».'] }],
      respuesta: [justo('«Al terminar el día»')] },
    { nivel: 1, titulo: 'El caldo del almuerzo',
      enunciado: '¿Qué verbo dice con más precisión lo que hizo la cocinera: «preparó» o «construyó»?',
      datos: [D_PREC, D_OTRAAC3],
      figura: fig(papel('cartel', 'Cartel del comedor popular', 'Menú de hoy', 'el comedor popular', 'los vecinos', ors('k', ['Doña Juana [w:hizo] [p:un caldo de cordero] para el almuerzo.']))),
      solucion: [{ texto: ['«Construyó» es ', prop('otra acción'), ': se construyen casas. Con ', cubre('«un caldo»'), ', lo que se hace es prepararlo.'] }],
      respuesta: [justo('«Preparó»')] },
    { nivel: 1, titulo: 'El discurso en la plaza',
      enunciado: '¿Qué verbo es más preciso que «dio» en el mensaje: «pronunció» o «regaló»?',
      datos: [D_PREC, D_COMOD, D_OTRAAC3],
      figura: fig(papel('mensaje', 'Vecinos de la calle Lima', null, 'doña Carmen', 'los vecinos', ors('k', ['El alcalde [w:dio] [p:un discurso] en la plaza por el aniversario.']))),
      solucion: [{ texto: ['«Dio» es un ', prop('comodín'), ', y «regaló» es ', prop('otra acción'), '. Un ', cubre('discurso'), ' se pronuncia.'] }],
      respuesta: [justo('«Pronunció»')] },

    { nivel: 2, titulo: 'La herida del niño',
      enunciado: '¿Qué palabra completa la oración con más precisión: «limpió», «vio» o «planchó»?',
      datos: [D_PREC, D_COMOD, D_OTRAAC3],
      figura: fig(papel('puerta', 'Puerta de la posta de Ilave', 'Atenciones del día', 'la enfermera', 'el médico de turno', ors('k', ['La enfermera [w:______] la herida del niño [p:con alcohol y una gasa].']))),
      solucion: [
        { texto: ['«Vio» es un ', prop('comodín'), '. «Planchó» es ', prop('otra acción'), ': no se hace con una herida.'] },
        { texto: ['Con ', cubre('«alcohol y una gasa»'), ', lo que se hace con la herida es limpiarla.'] }],
      respuesta: [justo('«Limpió»')] },
    { nivel: 2, titulo: 'La reunión del aula',
      enunciado: '¿Qué palabra completa la oración con más precisión: «tuvo», «despidió» o «convocó»?',
      datos: [D_PREC, D_COMOD, D_CHOCA],
      figura: fig(papel('mensaje', 'Delegados de 5.º', null, 'el delegado', 'los compañeros', ors('k', ['El delegado [w:______] a sus compañeros a la reunión [p:con un mensaje al grupo].']))),
      solucion: [
        { texto: ['«Tuvo» es un ', prop('comodín'), '. «Despidió» ', prop('choca'), ' con «a la reunión».'] },
        { texto: ['Con ', cubre('«un mensaje al grupo»'), ', el delegado los llamó a reunirse.'] }],
      respuesta: [justo('«Convocó»')] },
    { nivel: 2, titulo: 'Las rosas del jardín',
      enunciado: '¿Qué palabra completa la oración con más precisión: «vendió», «podó» o «vio»?',
      datos: [D_PREC, D_COMOD, D_CHOCA],
      figura: fig(papel('cuaderno', 'Cuaderno de Mateo', 'Mi barrio', 'Mateo', 'la clase de Comunicación', ors('k', ['El jardinero del parque [w:______] las rosas [p:para que crezcan con más fuerza].']))),
      solucion: [
        { texto: ['«Vio» es un ', prop('comodín'), '. «Vendió» ', prop('choca'), ' con «para que crezcan».'] },
        { texto: ['La pista, ', cubre('«para que crezcan»'), ', pide cortarles las ramas: podarlas.'] }],
      respuesta: [justo('«Podó»')] },
    { nivel: 2, titulo: 'La fecha del paseo',
      enunciado: '¿Qué palabra completa la oración con más precisión: «hizo», «postergó» o «adelantó una semana»?',
      datos: [D_PREC, D_COMOD, D_CHOCA],
      figura: fig(papel('mural', 'Mural del colegio', 'Paseo de fin de año', 'el comité de aula', 'los estudiantes', ors('k', ['El comité [w:______] la fecha del paseo [p:porque iba a llover]: ahora será dos semanas después.']))),
      solucion: [
        { texto: ['«Hizo» es un ', prop('comodín'), '. «Adelantó una semana» ', prop('choca'), ' con «dos semanas después».'] },
        { texto: ['La pista, ', cubre('«dos semanas después»'), ', dice que la fecha se pasó para más adelante.'] }],
      respuesta: [justo('«Postergó»')] },
    { nivel: 2, titulo: 'El estante nuevo',
      enunciado: '¿Qué palabra completa la oración con más precisión: «leyó en voz alta», «tuvo» o «clasificó»?',
      datos: [D_PREC, D_COMOD, D_CAMPO],
      figura: fig(papel('cartel', 'Cartel de la biblioteca', 'Novedades', 'la bibliotecaria', 'los lectores', ors('k', ['La bibliotecaria [w:______] los libros [p:por tema y por autor], en el estante nuevo.']))),
      solucion: [
        { texto: ['«Leyó en voz alta» es del ', prop('mismo campo'), ', pero no dice qué hizo en el estante. «Tuvo» es un ', prop('comodín'), '.'] },
        { texto: ['La pista, ', cubre('«por tema y por autor»'), ', dice que los puso en grupos.'] }],
      respuesta: [justo('«Clasificó»')] },

    { nivel: 3, titulo: 'Los caños del colegio',
      enunciado: 'Pregunta 71 del simulacro. En el texto, ¿qué palabra reemplaza a «hizo» con más precisión?',
      datos: [D_PREC, D_COMOD],
      figura: fig(sim(71, ors('h', ['En su informe, la ingeniera [w:hizo] una propuesta para gastar menos agua en el colegio: [p:instalar caños que se cierran solos].']), PIDE3('hizo'),
        ['tuvo', 'planteó', 'desaprobó', 'gastó', 'plantó'])),
      solucion: [
        { texto: [mala('A'), ' es otro ', prop('comodín'), '. ', mala('C'), ' ', prop('choca'), ': la propuesta es suya.'] },
        { texto: [mala('D'), ' es del ', prop('mismo campo'), ', el del agua. ', mala('E'), ' tiene ', prop('parecido de forma'), '.'] },
        { texto: [buena('B'), ': la ingeniera planteó la propuesta, la que dice la pista ', cubre('«instalar caños»'), '.'] }],
      respuesta: [buena('B'), ': planteó'] },
    { nivel: 3, titulo: 'El aviso del diario',
      enunciado: 'Pregunta 72 del simulacro. En el texto, ¿qué palabra reemplaza a «puso» con más precisión?',
      datos: [D_PREC, D_COMOD],
      figura: fig(sim(72, ors('h', ['La empresa de transporte [w:puso] un aviso en el diario: [p:busca diez choferes con licencia].']), PIDE3('puso'),
        ['tuvo', 'borró', 'fotocopió', 'publicó', 'expuso'])),
      solucion: [
        { texto: [mala('A'), ' es otro ', prop('comodín'), '. ', mala('B'), ' ', prop('choca'), ': el aviso salió.'] },
        { texto: [mala('C'), ' es del ', prop('mismo campo'), ', el del papel. ', mala('E'), ' tiene ', prop('parecido de forma'), '.'] },
        { texto: [buena('D'), ': la empresa publicó el aviso, y en él ', cubre('busca choferes'), '.'] }],
      respuesta: [buena('D'), ': publicó'] },
    { nivel: 3, titulo: 'Los buses de la promoción',
      enunciado: 'Pregunta 73 del simulacro. ¿Qué palabra completa la oración con más precisión?',
      datos: [D_PREC, D_COMOD],
      figura: fig(sim(73, ors('h', ['Para el viaje de promoción, el comité [w:______] tres presupuestos de buses:', '[p:comparó los precios y eligió el más seguro].']), P_HUECO,
        ['hizo', 'perdió', 'pidió', 'manejó', 'midió'])),
      solucion: [
        { texto: [mala('A'), ' es un ', prop('comodín'), '. ', mala('B'), ' ', prop('choca'), ': los comparó.'] },
        { texto: [mala('D'), ' es del ', prop('mismo campo'), ', el de los buses. ', mala('E'), ' tiene ', prop('parecido de forma'), '.'] },
        { texto: [buena('C'), ': para ', cubre('comparar los precios'), ', el comité primero los pidió a las empresas.'] }],
      respuesta: [buena('C'), ': pidió'] },
    { nivel: 3, titulo: 'Las bolsas de plástico',
      enunciado: 'Pregunta 74 del simulacro. ¿Qué palabra completa la oración con más precisión?',
      datos: [D_PREC, D_COMOD],
      figura: fig(sim(74, ors('h', ['La municipalidad del distrito [w:______] el uso de bolsas de plástico en los mercados:', '[p:desde enero, quien las entregue pagará una multa].']), P_HUECO,
        ['prohibió', 'recomendó', 'vio', 'vendió', 'exhibió'])),
      solucion: [
        { texto: [mala('B'), ' ', prop('choca'), ' con la multa. ', mala('C'), ' es un ', prop('comodín'), '.'] },
        { texto: [mala('D'), ' es del ', prop('mismo campo'), ', el del mercado. ', mala('E'), ' tiene ', prop('parecido de forma'), '.'] },
        { texto: [buena('A'), ': la pista, ', cubre('«pagará una multa»'), ', dice que ya no se puede.'] }],
      respuesta: [buena('A'), ': prohibió'] },
    { nivel: 3, titulo: 'La pensión del colegio',
      enunciado: 'Pregunta 75 del simulacro. En el texto, ¿qué palabra reemplaza a «dijeron» con más precisión?',
      datos: [D_PREC, D_COMOD],
      figura: fig(sim(75, ors('h', ['En la asamblea, los padres [w:dijeron] su rechazo a la subida de la pensión: [p:votaron en contra, uno por uno].']), PIDE3('dijeron'),
        ['tuvieron', 'ocultaron', 'exprimieron', 'cobraron', 'expresaron'])),
      solucion: [
        { texto: [mala('A'), ' es un ', prop('comodín'), '. ', mala('B'), ' ', prop('choca'), ': lo mostraron al votar.'] },
        { texto: [mala('C'), ' tiene ', prop('parecido de forma'), '. ', mala('D'), ' es del ', prop('mismo campo'), ', el de la pensión.'] },
        { texto: [buena('E'), ': los padres expresaron su rechazo, y la pista ', cubre('«votaron en contra»'), ' lo muestra.'] }],
      respuesta: [buena('E'), ': expresaron'] },
  ];

  const precision = {
    id: 'palabra-precisa',
    titulo: 'La palabra precisa',
    pregunta: '¿Por qué «hizo un muro» dice menos que «construyó un muro»?',
    temas: ['Precisión léxica'],
    pieza: 'rv-soporte',
    lee: {
      tarjetas: [
        { titulo: 'El acta de la junta', texto: 'Después de cada reunión, la secretaria de la junta escribe un acta y la pega en la puerta del local. Esta vez usó la misma palabra en tres oraciones.',
          pieza: 'rv-soporte', dibujo: { datos: acta3(INI3), estado: {} } },
        { titulo: 'Un comodín', texto: 'Hay palabras tan generales que encajan en casi cualquier oración: hacer, dar, tener, cosa. Se llaman comodines. Como sirven para todo, dicen poco de cada caso.' },
        { titulo: 'La palabra precisa', texto: 'Una palabra precisa nombra justo lo que pasa. Para encontrarla, mira con qué va el verbo: no se hace lo mismo con una sopa que con una carta.' },
        { titulo: 'Qué mirar al jugar', texto: 'Toca una oración del acta para cambiar «hizo» por otro verbo. El objeto de cada oración está en turquesa: el verbo tiene que ir con él.' },
      ],
    },
    actividad: 'Cambiar cada «hizo» del acta de la junta por el verbo que nombra esa acción.',
    aprendizaje: 'La palabra precisa nombra justo lo que dice la oración y no choca con ninguna parte; un comodín encaja en todo y dice poco.',
    ejemplos: EJEMPLOS_3,
    juega: {
      consigna: 'El acta de la reunión del sábado usa «hizo» en tres oraciones. El objeto de cada acción está en turquesa.',
      mision: {
        texto: 'Cambia cada «hizo» del acta por el verbo que nombra justo esa acción.',
        logrado: listo3,
        bien: 'Cada verbo va con un solo objeto: por eso dice más que «hizo».',
      },
      voz: '¿Qué se hace con un muro? ¿Y con una pregunta?',
      leyenda: [
        { s: 'negrita', t: 'el verbo que se cambia' },
        { s: cubre('turquesa'), t: 'el objeto de la acción' },
        { s: prop('naranja'), t: 'verbo que no va con su objeto' },
        { s: justo('violeta'), t: 'verbo que nombra justo esa acción' },
      ],
      controles: ACTA3.map((a, k) => ({ id: a.id, etiqueta: `Oración ${k + 1}`, opciones: VERBOS3.map((t, v) => ({ valor: v, texto: t })) })),
      dibujo: val => ({ datos: Object.assign({ toques: { a1: 'a1', a2: 'a2', a3: 'a3' } }, acta3(val)), estado: est3(val) }),
      lectura: lectura3,
      minimo: 3,
    },
    predice: {
      pregunta: 'El presidente de la APAFA escribe: «La comisión ___ el reglamento con cuidado antes de aprobarlo». ¿Qué verbo es el más preciso?',
      voz: 'Elige antes de ver: después lo comprobamos con toda la oración.',
      opciones: opciones('examinó', [
        ['aprobó', 'RV23', 'Va con «reglamento», bien; pero choca con «antes de aprobarlo».'],
        ['vio', 'RVS4', 'Encaja, bien; pero es un comodín: no dice que lo revisaran con cuidado.'],
        ['imprimió', 'RV19', 'Es del mismo campo, bien; pero imprimir no es revisar con cuidado.'],
      ]),
      dibujo: { datos: apafa3(undefined, 'imprimió'), estado: {} },
      revelar: { datos: apafa3('examinó', 'imprimió'), estado: { marcas: { r1w: 'f', r1p: 'i' } } },
      coincide: 'Coincide: «con cuidado antes de aprobarlo» pide revisar a fondo: examinar.',
    },
    mira: {
      datos: PROB3,
      voz: 'Volvamos al mensaje: cada verbo, con toda la oración.',
      pasos: [
        { estado: { senal: ['c0'], marcas: { c0p: 'i' } }, texto: 'El verbo va con «el reglamento», y también con «antes de aprobarlo».',
          ecuacion: [{ negrita: 'verbo' }, ' + el reglamento + ', cubre('antes de aprobarlo')] },
        { estado: { marcas: { c0p: 'i' }, tachar: ['c1'], nuevo: ['c1'] }, texto: '«Vio» encaja, pero es un comodín: no dice cómo lo revisaron.',
          ecuacion: [prop('vio'), ': comodín'] },
        { estado: { marcas: { c0p: 'i' }, tachar: ['c1', 'c2'], nuevo: ['c2'] }, texto: '«Aprobó» va con el reglamento, pero choca con «antes de aprobarlo».',
          ecuacion: [prop('aprobó'), ': choca'] },
        { estado: { marcas: { c0p: 'i' }, tachar: ['c1', 'c2', 'c3'], nuevo: ['c3'] }, texto: '«Imprimió» es del mismo campo, pero no es revisar con cuidado.',
          ecuacion: [prop('imprimió'), ': mismo campo'] },
        { estado: { marcas: { c0p: 'i', c4: 'f' }, tachar: ['c1', 'c2', 'c3'], nuevo: ['c4'] }, texto: '«Examinó» nombra justo eso, y no choca con nada.',
          ecuacion: [justo('examinó'), ' = revisó con cuidado'] },
      ],
    },
    regla: {
      texto: 'La palabra precisa nombra justo lo que dice la oración y no choca con ninguna de sus partes. Un comodín, como hacer o cosa, encaja en todo y dice poco.',
      ecuacion: [justo('precisa'), ': ', cubre('encaja con todo'), ' + dice más'],
      voz: 'Vuelve a esta regla cuando dudes con una palabra.',
      condicion: 'la palabra va con el objeto, el tiempo y el resto de la oración, y dice más que un comodín.',
    },
    resuelve: {
      pieza: 'rv-soporte',
      generar(s) {
        const R = RESUELVE_3[s % RESUELVE_3.length];
        return resuelveDe(R, {
          pasos: [
            { tipo: 'pide', texto: R.w === '______' ? 'Piden la palabra que completa la oración con más precisión.' : `Piden la palabra que reemplaza a «${R.w}» y dice más.` },
            { tipo: 'datos', texto: R.tengo },
            { tipo: 'regla', texto: 'Cada alternativa se pone en la oración: no debe chocar con ninguna parte, y debe nombrar justo la acción.' },
            { tipo: 'aplica', texto: R.malas },
            { tipo: 'aplica', texto: R.bien, dibujo: { datos: R.sop, estado: estHoja(R.sop, R.buena) } },
            { tipo: 'sentido', texto: R.sentido },
          ],
        });
      },
    },
    ahoraTu: {
      pieza: 'rv-soporte',
      voz: 'Otro texto corto. Prueba cada palabra con toda la oración.',
      generar(s) {
        const A = AHORA_3[s % AHORA_3.length], sop = sim(65 + (s % AHORA_3.length), ors('h', A.o));
        return {
          pregunta: '¿Qué palabra completa la oración con más precisión?',
          datos: [D_PREC, D_COMOD, D_CHOCA],
          dibujo: { datos: sop, estado: {} },
          opciones: opciones(A.ok, voltear(A.m, s)),
          solucion: { texto: `«${A.ok}» nombra justo la acción y no choca con ninguna parte de la oración.`, ecuacion: [justo(A.ok)],
            dibujo: { datos: sop, estado: estHoja(sop) } },
        };
      },
    },
  };
  const mesaActa = Object.assign({ id: 'acta-junta', titulo: 'El acta de la junta', pieza: 'rv-soporte' }, sinMision(precision.juega), {
    invitaciones: [
      { texto: 'Pon «construyó» en las tres oraciones y mira dónde choca.',
        logrado: val => ACTA3.every(a => VERBOS3[val[a.id]] === 'construyó'),
        bien: 'Solo un muro se construye: una pregunta y un hueco piden otro verbo.' },
      { texto: 'Deja bien solo la oración del hueco; las otras, con «hizo».',
        logrado: val => ACTA3.every(a => val[a.id] === (a.id === 'a3' ? a.ok : 0)),
        bien: 'Un hueco en la pared se abre.' },
      { texto: 'Haz que ningún verbo vaya con su objeto.',
        logrado: val => ACTA3.every(a => val[a.id] && val[a.id] !== a.ok),
        bien: 'Un verbo preciso va con un solo objeto: con otro, no encaja.' },
    ] });

  // ---------- Idea 4: literal o figurado (nueva, etapa 7) ----------
  // Cambia: la lectura que el alumno le da a cada expresión del periódico mural. Permanece: las cuatro oraciones y sus
  // pistas. Progresa: de cuatro expresiones sin leer a cuatro bien leídas. Se reserva: la frase hecha (predicción): en el
  // juego, cada expresión es una palabra o dos. Debe verse: que el mismo «golpeó» va en sentido literal en una oración y
  // en sentido figurado en otra, y que lo decide de qué habla el texto (la pista).
  // Objeto de la primera pantalla: el periódico mural (el equipo de prensa de 5.º B, para todo el colegio).
  // Colores: la pista (de qué se habla), i; la lectura equivocada, o; la bien hecha, f.
  // Códigos: RVS5 (lectura literal), RVS6 (lectura figurada), RVS7 (idea propia), RVS2 (otra valoración) y RV19.
  const D_LIT = 'Sentido literal: lo que las palabras nombran tal cual.';
  const D_FIG = 'Sentido figurado: la palabra nombra otra cosa que se le parece.';
  const D_FRASE = 'Frase hecha: grupo de palabras con un sentido fijo, que no es la suma de sus palabras.';
  const D_LECLIT = 'Lectura literal: se toma en sentido literal una expresión que va en sentido figurado.';
  const D_LECFIG = 'Lectura figurada: se busca un sentido figurado donde el literal ya encaja.';
  const D_IDEA = 'Idea propia: lo que la expresión le recuerda al lector, sin apoyo en el texto.';

  // El juego: el mundo chico del periódico mural. lee: 1 literal, 2 figurado.
  const LEC4 = ['¿…?', 'literal', 'figurado'];
  const EXPR4 = [
    { id: 'e1', pl: 'La helada de junio [w:golpeó] [p:a los productores de papa] de Ilave.', lee: 2, t: 'Golpeó', no: 'una helada no tiene manos; va figurado' },
    { id: 'e2', pl: 'Esa noche, el granizo [w:golpeó] [p:los techos de calamina] del barrio.', lee: 1, t: 'Golpeó', no: 'el granizo sí pega en los techos; va literal' },
    { id: 'e3', pl: 'Después, [p:el precio de la papa] [w:se disparó] en el mercado.', lee: 2, t: 'Se disparó', no: 'un precio no es un arma; va figurado' },
    { id: 'e4', pl: '[p:La municipalidad] [w:tendió una mano] a las familias afectadas.', lee: 2, t: 'Tendió una mano', no: 'una municipalidad no tiene manos; va figurado' },
  ];
  const mural4 = () => papel('mural', 'Periódico mural de 5.º B', 'La helada de junio', 'el equipo de prensa', 'todo el colegio', EXPR4.map(e => oracion(e.id, e.pl)));
  const INI4 = Object.fromEntries(EXPR4.map(e => [e.id, 0]));
  const listo4 = val => EXPR4.every(e => val[e.id] === e.lee);
  const est4 = val => ({ marcas: Object.fromEntries(EXPR4.filter(e => val[e.id]).flatMap(e => (val[e.id] === e.lee ? [[`${e.id}w`, 'f'], [`${e.id}p`, 'i']] : [[`${e.id}w`, 'o']]))) });
  const lectura4 = val => {
    if (listo4(val)) return [justo('Un «golpeó» literal y otro figurado'), ': decide de qué se habla'];
    const e = EXPR4.find(x => val[x.id] && val[x.id] !== x.lee);
    if (e) return [prop(`«${e.t}»`), `: ${e.no}`];
    const n = EXPR4.filter(x => val[x.id] === x.lee).length;
    return n ? [justo(`${n} de 4 bien leídas`), '; sigue con las otras'] : ['Toca una expresión en negrita: ¿literal o figurada?'];
  };

  // La predicción: la frase hecha. Sin letras en la figura.
  const PL_BALDE = '[p:La subida del pasaje] fue [w:un balde de agua fría] para los estudiantes que viajan desde Ilave.';
  const mural4Predice = papel('mural', 'Periódico mural de 5.º B', 'Lo que dicen los estudiantes', 'el equipo de prensa', 'todo el colegio', [oracion('b1', PL_BALDE)]);
  const PROB4 = probador('Cuaderno de Lucía', '¿Qué quiere decir la frase en negrita?', 'Lucía', PL_BALDE, ['un baño con agua muy helada', 'una broma de mal gusto', 'una sorpresa muy agradable', 'una noticia que desanima']);

  // «Así se resuelve»: cuatro hojas, como en San Marcos («la expresión X significa / connota»). Una de ellas va en
  // sentido literal. La buena: D, A, E y B.
  const RESUELVE_4 = [
    { sop: sim(81, ors('h', ['Con la nueva carretera, el pueblo se volvió [w:la puerta] [p:por donde pasa todo el comercio] hacia la costa.']), 'En el texto, la expresión «la puerta» significa',
      ['una entrada con marco de madera', 'el sitio más bonito', 'un pueblo cerrado', 'el paso obligado', 'el final']), buena: 'D', w: 'la puerta',
      datos: [D_LIT, D_FIG], tengo: ['Un pueblo no tiene una puerta de madera. La pista, ', cubre('«por donde pasa todo el comercio»'), ', dice qué se parece.'],
      malas: [mala('A'), ' es una ', prop('lectura literal'), '. ', mala('B'), ' es una ', prop('idea propia'), '. ', mala('C'), ' y ', mala('E'), ' son ', prop('otra cosa'), ': por una puerta se pasa.'],
      bien: [buena('D'), ': como una puerta, el pueblo es ', justo('el paso obligado'), ' del comercio.'],
      sentido: 'Lo que se parece a una puerta es que todo tiene que pasar por ahí.' },
    { sop: sim(82, ors('h', ['Para los padres, la beca de su hija fue [w:una luz] [p:en medio de tantos problemas de dinero].']), 'En el texto, la expresión «una luz» significa',
      ['una esperanza', 'una lámpara', 'una carga más', 'una idea genial', 'un premio de dinero']), buena: 'A', w: 'una luz',
      datos: [D_LIT, D_FIG], tengo: ['Una beca no alumbra. La pista, ', cubre('«en medio de tantos problemas»'), ', dice que trajo algo bueno.'],
      malas: [mala('B'), ' es una ', prop('lectura literal'), '. ', mala('C'), ' dice lo contrario: ', prop('otra valoración'), '. ', mala('D'), ' es una ', prop('idea propia'), '. ', mala('E'), ' es ', prop('otra cosa'), ': lo que es la beca.'],
      bien: [buena('A'), ': como una luz en lo oscuro, la beca fue ', justo('una esperanza'), '.'],
      sentido: 'La pregunta no es qué es una beca, sino qué fue para los padres.' },
    { sop: sim(83, ors('h', ['Durante la tormenta, un rayo [w:partió en dos] [p:el eucalipto de la plaza].', 'Los bomberos retiraron las ramas al día siguiente.']), 'En el texto, la expresión «partió en dos» significa',
      ['asustó a todos los vecinos del barrio', 'lo dejó en pie', 'lo hizo famoso', 'lo quemó un poco', 'lo rompió en dos partes']), buena: 'E', w: 'partió en dos',
      datos: [D_LIT, D_FIG], tengo: ['La pista, ', cubre('«el eucalipto»'), ': un rayo sí puede romper un árbol. La lectura literal encaja.'],
      malas: [mala('A'), ' es una ', prop('idea propia'), '. ', mala('B'), ' y ', mala('D'), ' son ', prop('otra cosa'), '. ', mala('C'), ' es una ', prop('lectura figurada'), ' que el texto no pide.'],
      bien: [buena('E'), ': el rayo ', justo('lo rompió en dos partes'), ', y por eso hubo ramas que retirar.'],
      sentido: 'No toda expresión va en sentido figurado: si la literal encaja, se queda.' },
    { sop: sim(84, ors('h', ['El dirigente dijo que el nuevo impuesto es [w:una soga al cuello] [p:para los pequeños comerciantes del mercado].']), 'En el texto, la expresión «una soga al cuello» connota',
      ['una cuerda en el cuello', 'una carga que ahoga', 'una ayuda para crecer', 'un castigo por robar', 'un tema de moda']), buena: 'B', w: 'una soga al cuello',
      datos: [D_LIT, D_FRASE], tengo: ['Un impuesto no es una cuerda. La pista, ', cubre('«para los pequeños comerciantes»'), ', dice a quiénes aprieta.'],
      malas: [mala('A'), ' es una ', prop('lectura literal'), '. ', mala('C'), ' dice lo contrario: ', prop('otra valoración'), '. ', mala('D'), ' es una ', prop('idea propia'), '. ', mala('E'), ' es ', prop('otra cosa'), '.'],
      bien: [buena('B'), ': como una soga, el impuesto es ', justo('una carga que ahoga'), ' a los comerciantes.'],
      sentido: 'El dirigente critica el impuesto: la frase lo dice con una imagen.' },
  ];

  // «Ahora tú»: cuatro casos con cuatro opciones y dos con cinco; uno va en sentido literal. Códigos: RVS5, RVS6, RVS7,
  // RVS2 y RV19.
  const AHORA_4 = [
    { o: ['En la reunión, la directora [w:rompió el hielo] [p:con una broma, y todos empezaron a conversar].'], w: 'rompió el hielo', ok: 'quitó la tensión',
      m: [['partió un bloque de hielo', 'RVS5', 'Es lo que dicen las palabras tal cual, bien; pero en la reunión no había hielo.'],
        ['enfrió el ambiente', 'RVS2', 'Habla del ambiente, bien; pero lo valora al revés: todos empezaron a conversar.'],
        ['se fue antes', 'RV19', 'Es otra cosa: la directora se quedó y contó una broma.']] },
    { o: ['Antes del partido, el entrenador [w:infló] [p:las pelotas con un inflador].'], w: 'infló', ok: 'les metió aire',
      m: [['exageró su valor', 'RVS6', 'Es un sentido figurado de «inflar», bien; pero aquí la lectura literal encaja.'],
        ['se puso nervioso', 'RVS7', 'Antes de un partido pasa, bien; pero el texto no habla de nervios.'],
        ['las lavó', 'RV19', 'Es otra cosa: con un inflador se mete aire.']] },
    { o: ['Después de perder la final, el equipo [w:tiró la toalla]: [p:no se presentó al partido siguiente].'], w: 'tiró la toalla', ok: 'se rindió',
      m: [['lanzó una toalla', 'RVS5', 'Es lo que dicen las palabras tal cual, bien; pero es una frase hecha.'],
        ['se secó el sudor', 'RVS7', 'Con una toalla se hace, bien; pero el texto no habla de eso.'],
        ['ganó', 'RV19', 'Es otra cosa: el equipo ni se presentó.']] },
    { o: ['Mi abuela tiene [w:un corazón de oro]: [p:ayuda a todos los vecinos sin pedir nada].'], w: 'un corazón de oro', ok: 'es muy bondadosa',
      m: [['tiene un corazón de metal', 'RVS5', 'Es lo que dicen las palabras tal cual, bien; pero nadie tiene el corazón de oro.'],
        ['tiene muchas joyas', 'RVS7', 'El oro hace pensar en joyas, bien; pero el texto habla de cómo ayuda.'],
        ['es muy dura', 'RVS2', 'Habla de cómo es, bien; pero critica, y el texto elogia.']] },
    { o: ['El alcalde dijo que la feria será [w:el motor] [p:de la economía del distrito] este año.'], w: 'el motor', ok: 'lo que la impulsa',
      m: [['una máquina con gasolina', 'RVS5', 'Es lo que dice la palabra tal cual, bien; pero una feria no es una máquina.'],
        ['un gasto inútil', 'RVS2', 'Habla de la economía, bien; pero critica, y el alcalde elogia la feria.'],
        ['una carrera de autos', 'RVS7', 'Un motor hace pensar en autos, bien; pero el texto no habla de carreras.'],
        ['el final', 'RV19', 'Es otra cosa: un motor pone en marcha, no termina.']] },
    { o: ['El consejo del profesor fue [w:una brújula] [p:para Iván cuando no sabía qué carrera elegir].'], w: 'una brújula', ok: 'una guía para decidir',
      m: [['un aparato con aguja que marca el norte', 'RVS5', 'Es lo que dice la palabra tal cual, bien; pero un consejo no es un aparato.'],
        ['un regalo', 'RVS7', 'Puede sentirse así, bien; pero el texto habla de elegir el camino.'],
        ['un error', 'RVS2', 'Habla del consejo, bien; pero critica, y el texto dice que le sirvió.'],
        ['una carrera', 'RV19', 'Es otra cosa: la carrera es lo que Iván tenía que elegir.']] },
  ];

  // Ejemplos resueltos de la idea 4. Nivel 1: si una expresión va en sentido literal o figurado, cuál es su pista, qué
  // dice una frase hecha. Nivel 2: tres lecturas, con dos fallas distintas. Nivel 3: la hoja con cinco alternativas; las
  // correctas son B, D, C, A y E. Revisado aparte (scratchpad e7-rv/revisa.js).
  const EJEMPLOS_4 = [
    { nivel: 1, titulo: 'El pasaje a Arequipa',
      enunciado: 'En el mensaje de Rosa, ¿la expresión «por las nubes» va en sentido literal o en sentido figurado?',
      datos: [D_LIT, D_FIG],
      figura: fig(papel('mensaje', 'Promoción 2026', null, 'Rosa', 'la promoción', ors('k', ['El pasaje a Arequipa está [w:por las nubes]: [p:cuesta el doble que en enero].']))),
      solucion: [{ texto: ['Un pasaje no vuela. La pista, ', cubre('«cuesta el doble»'), ', dice que el precio subió muchísimo.'] }],
      respuesta: [justo('Figurado'), ': el pasaje está carísimo'] },
    { nivel: 1, titulo: 'El rayo en la chacra',
      enunciado: 'En el mensaje del tío Luis, ¿la palabra «quemó» va en sentido literal o en sentido figurado?',
      datos: [D_LIT, D_FIG],
      figura: fig(papel('mensaje', 'Familia Quispe', null, 'el tío Luis', 'la familia', ors('k', ['Anoche un rayo [w:quemó] [p:el árbol grande] de la chacra.', 'Mañana sacamos el tronco.']))),
      solucion: [{ texto: ['Un rayo sí puede quemar ', cubre('un árbol'), ': la lectura literal encaja con el texto.'] }],
      respuesta: [justo('Literal'), ': el rayo quemó el árbol de verdad'] },
    { nivel: 1, titulo: 'El corazón del barrio',
      enunciado: '¿Qué pista del cartel dice que «el corazón» va en sentido figurado?',
      datos: [D_LIT, D_FIG, D_PISTA],
      figura: fig(papel('cartel', 'Cartel de la junta vecinal', 'Feria del domingo', 'la junta vecinal', 'los vecinos', ors('k', ['El mercado es [w:el corazón] [p:del barrio]: ahí se encuentran todos los vecinos.']))),
      solucion: [{ texto: ['Un barrio no tiene órganos: la pista es ', cubre('«del barrio»'), '. El mercado es su centro.'] }],
      respuesta: [justo('«Del barrio»')] },
    { nivel: 1, titulo: 'En la luna',
      enunciado: 'En el mensaje de la mamá, ¿qué quiere decir «se quedó en la luna»?',
      datos: [D_LIT, D_FIG, D_FRASE],
      figura: fig(papel('mensaje', 'Familias de 4.º A', null, 'la mamá de Diego', 'la tutora', ors('k', ['Disculpe, profesora: Diego [w:se quedó en la luna] y [p:no escuchó lo que pidió para mañana].']))),
      solucion: [{ texto: ['Es una frase hecha. La pista, ', cubre('«no escuchó»'), ', dice que estaba pensando en otra cosa.'] }],
      respuesta: [justo('Que se distrajo')] },
    { nivel: 1, titulo: 'La caja de libros',
      enunciado: 'En el mensaje de Mateo, ¿la palabra «pesada» va en sentido literal o en sentido figurado?',
      datos: [D_LIT, D_FIG],
      figura: fig(papel('mensaje', 'Promoción 2026', null, 'Mateo', 'la promoción', ors('k', ['La caja con los libros estaba [w:pesada]: [p:entre dos la subimos al camión].']))),
      solucion: [{ texto: ['Una caja de libros pesa de verdad: la pista, ', cubre('«entre dos la subimos»'), ', lo confirma.'] }],
      respuesta: [justo('Literal'), ': la caja tenía mucho peso'] },

    { nivel: 2, titulo: 'Los brazos del pueblo',
      enunciado: '¿Qué quiere decir «abrió sus brazos»: «estiró los brazos», «los recibió con cariño» o «les cerró el paso en la entrada»?',
      datos: [D_LIT, D_FIG],
      figura: fig(papel('cartel', 'Cartel en la plaza de Ayaviri', 'Bienvenidos', 'la municipalidad', 'los deportistas', ors('k', ['[p:El pueblo] [w:abrió sus brazos] a los deportistas que llegaron para el torneo.']))),
      solucion: [
        { texto: ['«Estiró los brazos» es una ', prop('lectura literal'), ': ', cubre('un pueblo'), ' no tiene brazos. «Les cerró el paso en la entrada» es ', prop('otra cosa'), '.'] },
        { texto: ['Abrir los brazos es recibir a alguien: el pueblo los acogió.'] }],
      respuesta: [justo('«Los recibió con cariño»')] },
    { nivel: 2, titulo: 'La noticia del premio',
      enunciado: '¿Qué quiere decir «voló» en el mural: «subió al cielo», «se perdió entre los papeles del mural» o «se supo muy rápido»?',
      datos: [D_LIT, D_FIG],
      figura: fig(papel('mural', 'Mural del colegio', 'Ganamos el concurso', 'el equipo de prensa', 'todo el colegio', ors('k', ['[p:La noticia del premio] [w:voló] por todo el colegio: en un rato todos la sabían.']))),
      solucion: [
        { texto: ['«Subió al cielo» es una ', prop('lectura literal'), ': ', cubre('una noticia'), ' no tiene alas. «Se perdió entre los papeles del mural» es ', prop('otra cosa'), '.'] },
        { texto: ['«En un rato todos la sabían» dice que corrió rápido.'] }],
      respuesta: [justo('«Se supo muy rápido»')] },
    { nivel: 2, titulo: 'Hecho polvo',
      enunciado: '¿Qué quiere decir «hecho polvo» en el mensaje: «muy cansado», «muy sucio» o «muy feliz con su nota»?',
      datos: [D_LIT, D_FIG, D_FRASE],
      figura: fig(papel('mensaje', 'Promoción 2026', null, 'Iván', 'la promoción', ors('k', ['Después del examen estoy [w:hecho polvo]: [p:no he dormido en dos noches].']))),
      solucion: [
        { texto: ['«Muy sucio» es una ', prop('lectura literal'), ' del polvo. «Muy feliz con su nota» es ', prop('otra valoración'), '.'] },
        { texto: ['La pista, ', cubre('«no he dormido en dos noches»'), ', dice que está agotado.'] }],
      respuesta: [justo('«Muy cansado»')] },
    { nivel: 2, titulo: 'Las tablas del piso',
      enunciado: '¿Cómo se lee «clavó»: «las sujetó con clavos», «las miró fijamente un buen rato» o «las vendió»?',
      datos: [D_LIT, D_FIG],
      figura: fig(papel('cuaderno', 'Cuaderno de Rosa', 'Mi casa nueva', 'Rosa', 'la clase de Comunicación', ors('k', ['Mi papá [w:clavó] [p:las tablas del piso] con un martillo.']))),
      solucion: [
        { texto: ['«Las miró fijamente un buen rato» es una ', prop('lectura figurada'), ': con ', cubre('un martillo'), ' se clava de verdad. «Las vendió» es ', prop('otra cosa'), '.'] },
        { texto: ['La lectura literal encaja: se queda.'] }],
      respuesta: [justo('«Las sujetó con clavos»')] },
    { nivel: 2, titulo: 'Las promesas del alcalde',
      enunciado: '¿Qué quiere decir «puro humo»: «un incendio en la municipalidad», «promesas sin nada detrás» o «palabras muy bonitas»?',
      datos: [D_LIT, D_FIG],
      figura: fig(papel('mensaje', 'Vecinos de la calle Lima', null, 'don Pedro', 'los vecinos', ors('k', ['Las palabras del alcalde fueron [w:puro humo]: [p:prometió una obra que nunca empezó].']))),
      solucion: [
        { texto: ['«Un incendio en la municipalidad» es una ', prop('lectura literal'), '. «Palabras muy bonitas» las elogia: ', prop('otra valoración'), '.'] },
        { texto: ['La pista, ', cubre('«nunca empezó»'), ', dice que no había nada detrás, como el humo.'] }],
      respuesta: [justo('«Promesas sin nada detrás»')] },

    { nivel: 3, titulo: 'La herida del altiplano',
      enunciado: 'Pregunta 91 del simulacro. En el texto, la expresión «la herida abierta» significa',
      datos: [D_LIT, D_FIG],
      figura: fig(sim(91, ors('h', ['El informe dice que la falta de agua es [w:la herida abierta] de muchas comunidades del altiplano:', '[p:la esperan resolver desde hace años].']), 'En el texto, la expresión «la herida abierta» significa',
        ['un corte en la piel que sangra', 'un problema sin resolver', 'una pelea entre pueblos', 'una fiesta pendiente', 'un río que se secó'])),
      solucion: [
        { texto: [mala('A'), ' es una ', prop('lectura literal'), '. ', mala('C'), ' es una ', prop('idea propia'), '.'] },
        { texto: [mala('D'), ' y ', mala('E'), ' son ', prop('otra cosa'), ': el texto habla de la falta de agua.'] },
        { texto: [buena('B'), ': como una herida que no cierra, la pista ', cubre('«desde hace años»'), ' dice que el problema sigue.'] }],
      respuesta: [buena('B'), ': un problema sin resolver'] },
    { nivel: 3, titulo: 'El agua con sal',
      enunciado: 'Pregunta 92 del simulacro. En el texto, la palabra «mezcló» significa',
      datos: [D_LIT, D_FIG],
      figura: fig(sim(92, ors('h', ['En el laboratorio, la profesora [w:mezcló] [p:el agua con la sal] hasta que no se vio ningún grano.']), 'En el texto, la palabra «mezcló» significa',
        ['confundió dos ideas', 'separó el agua', 'tiró la sal', 'juntó el agua y la sal', 'unió a dos grupos de alumnos'])),
      solucion: [
        { texto: [mala('A'), ' es una ', prop('lectura figurada'), ' que el texto no pide. ', mala('E'), ' es una ', prop('idea propia'), '.'] },
        { texto: [mala('B'), ' y ', mala('C'), ' son ', prop('otra cosa'), '.'] },
        { texto: [buena('D'), ': con ', cubre('«el agua con la sal»'), ', la lectura literal encaja y se queda.'] }],
      respuesta: [buena('D'), ': juntó el agua y la sal'] },
    { nivel: 3, titulo: 'El anuncio del delegado',
      enunciado: 'Pregunta 93 del simulacro. En el texto, la expresión «metió la pata» significa',
      datos: [D_LIT, D_FRASE],
      figura: fig(sim(93, ors('h', ['El delegado [w:metió la pata] [p:al anunciar una fecha equivocada para el paseo]:', 'tuvo que pedir disculpas a todo el salón.']), 'En el texto, la expresión «metió la pata» significa',
        ['se lastimó un pie', 'tuvo una gran idea', 'se equivocó', 'bailó en la fiesta', 'se fue'])),
      solucion: [
        { texto: [mala('A'), ' es una ', prop('lectura literal'), '. ', mala('B'), ' es ', prop('otra valoración'), ': pidió disculpas.'] },
        { texto: [mala('D'), ' es una ', prop('idea propia'), '. ', mala('E'), ' es ', prop('otra cosa'), '.'] },
        { texto: [buena('C'), ': es una frase hecha, y la pista, ', cubre('«una fecha equivocada»'), ', dice qué pasó.'] }],
      respuesta: [buena('C'), ': se equivocó'] },
    { nivel: 3, titulo: 'La posta nueva',
      enunciado: 'Pregunta 94 del simulacro. En el texto, la expresión «un salvavidas» connota',
      datos: [D_LIT, D_FIG],
      figura: fig(sim(94, ors('h', ['Para los vecinos, la nueva posta es [w:un salvavidas]:', '[p:antes había que viajar dos horas para ver a un médico].']), 'En el texto, la expresión «un salvavidas» connota',
        ['una ayuda que llegó a tiempo', 'un aro que flota para no ahogarse', 'un gasto que sobra', 'un lugar en la playa', 'un hospital de lujo'])),
      solucion: [
        { texto: [mala('B'), ' es una ', prop('lectura literal'), '. ', mala('C'), ' la critica: ', prop('otra valoración'), '.'] },
        { texto: [mala('D'), ' es una ', prop('idea propia'), '. ', mala('E'), ' es ', prop('otra cosa'), ': una posta no es un hospital de lujo.'] },
        { texto: [buena('A'), ': la pista, ', cubre('«antes había que viajar dos horas»'), ', dice que la posta llegó a salvar.'] }],
      respuesta: [buena('A'), ': una ayuda que llegó a tiempo'] },
    { nivel: 3, titulo: 'El viento en la escuela',
      enunciado: 'Pregunta 95 del simulacro. En el texto, la palabra «arrancó» significa',
      datos: [D_LIT, D_FIG],
      figura: fig(sim(95, ors('h', ['Durante la tormenta, el viento [w:arrancó] [p:las calaminas del techo de la escuela].', 'Las clases se suspendieron dos días.']), 'En el texto, la palabra «arrancó» significa',
        ['empezó a funcionar', 'quitó la alegría', 'hizo mucho ruido', 'pegó con fuerza', 'sacó de su lugar'])),
      solucion: [
        { texto: [mala('A'), ' es ', prop('otra cosa'), ': así se dice de un motor. ', mala('B'), ' es una ', prop('lectura figurada'), '.'] },
        { texto: [mala('C'), ' es una ', prop('idea propia'), '. ', mala('D'), ' es ', prop('otra cosa'), ': no dice que las calaminas salieran.'] },
        { texto: [buena('E'), ': con ', cubre('«las calaminas del techo»'), ', la lectura literal encaja: el viento las sacó.'] }],
      respuesta: [buena('E'), ': sacó de su lugar'] },
  ];

  const figurado = {
    id: 'sentido-figurado',
    titulo: 'Literal o figurado',
    pregunta: '¿Una helada puede «golpear» a alguien?',
    temas: ['Sentido literal y figurado'],
    pieza: 'rv-soporte',
    lee: {
      tarjetas: [
        { titulo: 'El periódico mural', texto: 'El equipo de prensa de 5.º B escribió en el periódico mural lo que pasó con la helada de junio. Algunas de sus expresiones no dicen lo que dicen sus palabras tal cual.',
          pieza: 'rv-soporte', dibujo: { datos: mural4(), estado: {} } },
        { titulo: 'Sentido literal', texto: 'Lo que las palabras nombran tal cual es su sentido literal. «Lavó los platos» se lee en sentido literal: hubo platos, agua y alguien que los lavó.' },
        { titulo: 'Sentido figurado', texto: 'A veces una palabra nombra otra cosa que se le parece: es el sentido figurado. «Mi hermano es un león» no dice que tenga melena: lo compara.' },
        { titulo: 'Qué mirar al jugar', texto: 'Toca una expresión en negrita para decir cómo se lee. Pregúntate de qué habla la oración: si la lectura literal no encaja, va en sentido figurado.' },
      ],
    },
    actividad: 'Decidir, en el periódico mural, qué expresiones van en sentido literal y cuáles no.',
    aprendizaje: 'Una expresión va en sentido figurado si, leída en sentido literal, no encaja con lo que habla el texto; se lee por su parecido.',
    ejemplos: EJEMPLOS_4,
    juega: {
      consigna: 'El periódico mural de 5.º B cuenta lo que pasó con la helada de junio. Cuatro expresiones van en negrita.',
      mision: {
        texto: 'Marca cada expresión en negrita como literal o figurada, tocándola en el mural.',
        logrado: listo4,
        bien: 'El mismo «golpeó» va literal con el granizo y figurado con la helada.',
      },
      voz: '¿De qué habla cada oración? ¿Encaja leerla tal cual?',
      leyenda: [
        { s: 'negrita', t: 'la expresión que se lee' },
        { s: cubre('turquesa'), t: 'la pista: de qué se habla' },
        { s: prop('naranja'), t: 'lectura equivocada' },
        { s: justo('violeta'), t: 'lectura que encaja con el texto' },
      ],
      controles: EXPR4.map((e, k) => ({ id: e.id, etiqueta: `Oración ${k + 1}`, opciones: LEC4.map((t, v) => ({ valor: v, texto: v ? t : 'sin leer' })) })),
      dibujo: val => ({ datos: Object.assign({ toques: Object.fromEntries(EXPR4.map(e => [e.id, e.id])) }, mural4()), estado: est4(val) }),
      lectura: lectura4,
      minimo: 3,
    },
    predice: {
      pregunta: 'En el mismo periódico mural: «La subida del pasaje fue un balde de agua fría para los estudiantes». ¿Qué quiere decir «un balde de agua fría»?',
      voz: 'Elige antes de ver: después lo comprobamos con la pista.',
      opciones: opciones('una noticia que desanima', [
        ['un baño con agua muy helada', 'RVS5', 'Es lo que dicen las palabras tal cual, bien; pero nadie echó agua: es una frase hecha.'],
        ['una broma de mal gusto', 'RVS7', 'Una broma también puede caer mal, bien; pero el texto no habla de bromas.'],
        ['una sorpresa muy agradable', 'RVS2', 'Tiene algo de sorpresa, bien; pero la valora al revés: una subida del pasaje no alegra.'],
      ]),
      dibujo: { datos: mural4Predice, estado: {} },
      revelar: { datos: mural4Predice, estado: { marcas: { b1w: 'f', b1p: 'i' } } },
      coincide: 'Coincide: «un balde de agua fría» es una frase hecha para una noticia que desanima de golpe.',
    },
    mira: {
      datos: PROB4,
      voz: 'Volvamos a la frase: primero, de qué habla.',
      pasos: [
        { estado: { senal: ['c0'], marcas: { c0p: 'i' } }, texto: 'La oración habla de la subida del pasaje: nadie echó agua.',
          ecuacion: [cubre('la subida del pasaje'), ' → ', { negrita: 'no es literal' }] },
        { estado: { marcas: { c0p: 'i' }, tachar: ['c1'], nuevo: ['c1'] }, texto: 'Un baño con agua helada es la lectura literal.',
          ecuacion: [prop('baño'), ': lectura literal'] },
        { estado: { marcas: { c0p: 'i' }, tachar: ['c1', 'c2'], nuevo: ['c2'] }, texto: 'La broma es una idea propia: el texto no la nombra.',
          ecuacion: [prop('broma'), ': idea propia'] },
        { estado: { marcas: { c0p: 'i' }, tachar: ['c1', 'c2', 'c3'], nuevo: ['c3'] }, texto: 'Una subida del pasaje no es agradable: otra valoración.',
          ecuacion: [prop('sorpresa agradable'), ': otra valoración'] },
        { estado: { marcas: { c0p: 'i', c4: 'f' }, tachar: ['c1', 'c2', 'c3'], nuevo: ['c4'] }, texto: 'Es una frase hecha: una noticia que desanima de golpe.',
          ecuacion: [justo('noticia que desanima'), ': frase hecha'] },
      ],
    },
    regla: {
      texto: 'Una expresión va en sentido figurado cuando, leída en sentido literal, no encaja con lo que habla el texto. Entonces se busca qué se parece: el golpe es el daño.',
      ecuacion: [{ negrita: 'literal' }, ' no encaja → ', justo('figurado')],
      voz: 'Vuelve a esta regla cuando dudes con una expresión.',
      condicion: 'la lectura figurada encaja con todo el texto y con su tono; si la literal ya encaja, se queda la literal.',
    },
    resuelve: {
      pieza: 'rv-soporte',
      generar(s) {
        const R = RESUELVE_4[s % RESUELVE_4.length];
        return resuelveDe(R, {
          pasos: [
            { tipo: 'pide', texto: `Piden qué quiere decir «${R.w}» en el texto.` },
            { tipo: 'datos', texto: R.tengo },
            { tipo: 'regla', texto: 'Primero se prueba la lectura literal; si no encaja con lo que habla el texto, se busca el parecido. Luego se mira el tono.' },
            { tipo: 'aplica', texto: R.malas },
            { tipo: 'aplica', texto: R.bien, dibujo: { datos: R.sop, estado: estHoja(R.sop, R.buena) } },
            { tipo: 'sentido', texto: R.sentido },
          ],
        });
      },
    },
    ahoraTu: {
      pieza: 'rv-soporte',
      voz: 'Otro texto corto. ¿Encaja leer la expresión tal cual?',
      generar(s) {
        const A = AHORA_4[s % AHORA_4.length], sop = sim(85 + (s % AHORA_4.length), ors('h', A.o));
        return {
          pregunta: `En el texto, ¿qué quiere decir «${A.w}»?`,
          datos: [D_LIT, D_FIG, D_FRASE],
          dibujo: { datos: sop, estado: {} },
          opciones: opciones(A.ok, voltear(A.m, s)),
          solucion: { texto: `Con la pista, «${A.ok}» es la lectura que encaja con todo el texto.`, ecuacion: [{ negrita: A.w }, ' → ', justo(A.ok)],
            dibujo: { datos: sop, estado: estHoja(sop) } },
        };
      },
    },
  };
  const mesaPeriodico = Object.assign({ id: 'periodico-helada', titulo: 'El periódico mural de la helada', pieza: 'rv-soporte' }, sinMision(figurado.juega), {
    invitaciones: [
      { texto: 'Marca las cuatro expresiones como literales y mira cuáles fallan.',
        logrado: val => EXPR4.every(e => val[e.id] === 1),
        bien: 'Solo el granizo pega de verdad: las otras tres van en sentido figurado.' },
      { texto: 'Lee bien solo los dos «golpeó»; las otras, sin leer.',
        logrado: val => EXPR4.every(e => val[e.id] === (e.t === 'Golpeó' ? e.lee : 0)),
        bien: 'La misma palabra: una vez literal y otra figurada.' },
      { texto: 'Haz que todas las lecturas queden equivocadas.',
        logrado: val => EXPR4.every(e => val[e.id] && val[e.id] !== e.lee),
        bien: 'Cada expresión pide su lectura: la decide de qué habla el texto.' },
    ] });

  // ---------- Idea 5: el significado sale de las pistas (conserva su id; etapa 7) ----------
  // Cambia: qué oración del aviso se marca como pista y cuáles se tachan. Permanece: el aviso de la posta y su palabra
  // nueva («inocuo»). Progresa: de cuatro oraciones a la única que dice qué significa. Se reserva: la pista de contraste
  // (predicción): en el juego, la pista explica. Debe verse: que la oración que dice qué pasa si se toma el jarabe es la
  // pista, y que el frasco y el día de entrega, aunque estén cerca, no hablan de la palabra.
  // Objeto de la primera pantalla: la puerta de la posta con su aviso (la posta, para las mamás y los papás).
  // Colores: la oración pista, i; la marcada como pista que no lo es, o; la palabra ya entendida, f; lo que no ayuda,
  // tachado.
  // Códigos: RVS7 (idea propia o detalle cercano), RVS8 (contraste al revés), RVS1 (lo contrario), RV20 y RV19.
  const D_PISTA5 = 'Pista: una explicación, un ejemplo, un contraste o una consecuencia que habla de la palabra.';
  const D_DEDUC = 'Deducir: sacar del texto algo que no está dicho con esas mismas palabras.';
  const D_DETALLE = 'Detalle cercano: algo que el texto cuenta junto a la palabra, pero que no dice qué significa.';
  const D_CONTRAREV = 'Contraste al revés: se le da a la palabra el sentido de lo que se le opone.';
  const D_CONTRARIO = 'Lo contrario: el significado que dice lo opuesto de lo que dicen las pistas.';

  // El juego: el mundo chico del aviso. Cada oración dice algo de «inocuo» (la 2) o no (la 3 y la 4).
  const MARCA5 = ['¿…?', 'pista', 'no ayuda'];
  const AVISO5 = [
    { id: 'o2', ctl: 'p2', t: 'Aunque un niño lo tome por error, no le hará ningún daño.', ok: 1, no: [prop('Cuidado'), ': la oración 2 dice qué pasa si se toma'] },
    { id: 'o3', ctl: 'p3', t: 'Viene en un frasco azul con tapa blanca.', ok: 2, no: [prop('El frasco azul'), ' no dice nada de «inocuo»'] },
    { id: 'o4', ctl: 'p4', t: 'Se entrega los lunes por la mañana.', ok: 2, no: [prop('El día de entrega'), ' no dice nada de «inocuo»'] },
  ];
  const aviso5 = () => papel('puerta', 'Puerta de la posta de Chucuito', 'Aviso', 'la posta', 'las mamás y los papás',
    [oracion('o1', 'El jarabe para la tos que entrega la posta es [w:inocuo].')].concat(AVISO5.map(o => ({ id: o.id, t: o.t }))));
  const INI5 = { p2: 0, p3: 0, p4: 0 };
  const listo5 = val => AVISO5.every(o => val[o.ctl] === o.ok);
  const est5 = val => ({ marcas: Object.assign(Object.fromEntries(AVISO5.filter(o => val[o.ctl] === 1).map(o => [o.id, o.ok === 1 ? 'i' : 'o'])), listo5(val) ? { o1w: 'f' } : {}),
    tachar: AVISO5.filter(o => val[o.ctl] === 2).map(o => o.id) });
  const lectura5 = val => {
    if (listo5(val)) return [justo('Inocuo: que no hace daño'), '; lo dice la oración 2'];
    const o = AVISO5.find(x => val[x.ctl] && val[x.ctl] !== x.ok);
    if (o) return o.no;
    return val.p2 === 1 ? [cubre('La 2 dice qué es'), '; ¿y las otras?'] : ['Toca una oración: ¿dice qué significa «inocuo»?'];
  };

  // La predicción: la pista de contraste. Sin letras en la figura.
  const PL_LOCUAZ = 'Mi primo Teo es [w:locuaz]; [p:en cambio, su hermano casi no habla].';
  const msj5 = papel('mensaje', 'Promoción 2026', null, 'Rosa', 'el grupo de la promoción', [oracion('l1', PL_LOCUAZ), oracion('l2', 'Los dos vienen a la fiesta del sábado.')]);
  const PROB5 = probador('Cuaderno de Mateo', '¿Qué significa «locuaz»?', 'Mateo', PL_LOCUAZ, ['que casi no habla', 'que está medio loco', 'que es muy amable', 'que conversa mucho']);

  // «Así se resuelve»: cuatro hojas, una por clase de pista (consecuencia, explicación, ejemplo y contraste). La buena:
  // D, A, E y B.
  const PIDE5 = w => `Según el texto, ¿qué significa «${w}»?`;
  const RESUELVE_5 = [
    { sop: sim(101, ors('h', ['La sequía dejó [w:yermos] los campos de la comunidad:', '[p:no crece ni una planta y los animales se fueron a otro lado].']), PIDE5('yermos'),
      ['llenos de agua', 'cercados con piedras', 'lejanos', 'sin plantas', 'hermosos']), buena: 'D', w: 'yermos',
      datos: [D_PISTA5, D_DEDUC], tengo: ['La pista es una consecuencia: ', cubre('«no crece ni una planta»'), '.'],
      malas: [mala('A'), ' es ', prop('lo contrario'), '. ', mala('B'), ' es una ', prop('idea propia'), '. ', mala('C'), ' es ', prop('otra cosa'), '. ', mala('E'), ' tiene ', prop('parecido de forma'), '.'],
      bien: [buena('D'), ': si no crece ni una planta, los campos quedaron ', justo('sin plantas'), '.'],
      sentido: 'Relee con la palabra puesta: «dejó sin plantas los campos» encaja con la sequía.' },
    { sop: sim(102, ors('h', ['La abuela Rosa es [w:longeva]: [p:tiene noventa y ocho años] y todavía teje sus chompas.']), PIDE5('longeva'),
      ['que vive muchos años', 'que es muy alta', 'que teje chompas de lana muy finas', 'que está enferma', 'que es muy joven']), buena: 'A', w: 'longeva',
      datos: [D_PISTA5, D_DEDUC, D_DETALLE], tengo: ['Tras los dos puntos viene una explicación: ', cubre('«tiene noventa y ocho años»'), '.'],
      malas: [mala('B'), ' tiene ', prop('parecido de forma'), ' con «longitud». ', mala('C'), ' es un ', prop('detalle cercano'), '. ', mala('D'), ' es una ', prop('idea propia'), '. ', mala('E'), ' es ', prop('lo contrario'), '.'],
      bien: [buena('A'), ': con noventa y ocho años, la abuela es una mujer ', justo('que vive muchos años'), '.'],
      sentido: 'Que teja chompas es cierto, pero no dice qué significa «longeva».' },
    { sop: sim(103, ors('h', ['En la feria de Chucuito hubo comida [w:autóctona]:', '[p:chairo, papa con queso y trucha del lago, todo de la zona].']), PIDE5('autóctona'),
      ['traída de otros países', 'del lago', 'automática', 'picante', 'propia del lugar']), buena: 'E', w: 'autóctona',
      datos: [D_PISTA5, D_DEDUC, D_DETALLE], tengo: ['La pista son ejemplos: ', cubre('«chairo, papa con queso y trucha»'), ', y luego «todo de la zona».'],
      malas: [mala('A'), ' es ', prop('lo contrario'), '. ', mala('B'), ' es un ', prop('detalle cercano'), ': solo la trucha es del lago. ', mala('C'), ' tiene ', prop('parecido de forma'), '. ', mala('D'), ' es una ', prop('idea propia'), '.'],
      bien: [buena('E'), ': los ejemplos son platos ', justo('propios del lugar'), ', «todo de la zona».'],
      sentido: 'Los tres ejemplos tienen algo en común: son de la zona. Eso significa la palabra.' },
    { sop: sim(104, ors('h', ['Pedro es [w:parco] al hablar;', '[p:en cambio, su hermana cuenta cada detalle de su día].']), PIDE5('parco'),
      ['que habla mucho', 'de pocas palabras', 'que habla en parques', 'que es tímido', 'que es muy alto']), buena: 'B', w: 'parco',
      datos: [D_PISTA5, D_DEDUC], tengo: ['La pista es un contraste: ', cubre('«en cambio, su hermana cuenta cada detalle»'), '.'],
      malas: [mala('A'), ' es el ', prop('contraste al revés'), ': describe a la hermana. ', mala('C'), ' tiene ', prop('parecido de forma'), '. ', mala('D'), ' es una ', prop('idea propia'), '. ', mala('E'), ' es ', prop('otra cosa'), '.'],
      bien: [buena('B'), ': si la hermana cuenta todo, Pedro es lo opuesto: ', justo('de pocas palabras'), '.'],
      sentido: '«En cambio» opone a los dos hermanos: la palabra dice lo contrario de lo otro.' },
  ];

  // «Ahora tú»: cuatro casos con cuatro opciones y dos con cinco. Códigos: RVS7, RVS8, RVS1, RV20 y RV19.
  const AHORA_5 = [
    { o: ['El camino al cerro es [w:sinuoso]: [p:da tantas curvas que el bus avanza muy despacio].'], w: 'sinuoso', ok: 'con muchas curvas',
      m: [['lleno de piedras sueltas', 'RVS7', 'Puede pasar en un camino, bien; pero la pista habla de curvas.'],
        ['recto', 'RVS1', 'Habla de la forma del camino, bien; pero dice lo contrario de la pista.'],
        ['muy silencioso', 'RV20', 'Se escribe parecido a «sinuoso», bien visto; pero significa otra cosa.']] },
    { o: ['Mi primo es [w:frugal] en las comidas;', '[p:en cambio, mi tío siempre pide dos platos].'], w: 'frugal', ok: 'que se sirve poco',
      m: [['que se sirve mucho', 'RVS8', 'Hay un contraste, bien visto; pero eso describe al tío, no al primo.'],
        ['que come pura fruta', 'RV20', 'Se escribe parecido a «fruta», bien visto; pero la pista habla de cuánto come.'],
        ['que cocina bien', 'RVS7', 'Es una idea sobre comidas, bien; pero el texto no habla de cocinar.']] },
    { o: ['En la reunión se habló de [w:hortalizas]: [p:lechuga, zanahoria, cebolla y zapallo].'], w: 'hortalizas', ok: 'verduras de la huerta',
      m: [['frutas dulces', 'RV19', 'Son de la chacra, bien; pero es otra cosa: los ejemplos no son frutas.'],
        ['horas extras de trabajo en la chacra', 'RV20', 'Se escribe parecido a «horas», bien visto; pero los ejemplos son verduras.'],
        ['platos de la feria', 'RVS7', 'Con eso se cocina, bien; pero el texto no habla de platos.']] },
    { o: ['La falda nueva le quedó [w:holgada] a Lucía:', '[p:se le caía a cada rato y tuvo que ponerse un cinturón].'], w: 'holgada', ok: 'más ancha de lo debido',
      m: [['muy apretada', 'RVS1', 'Habla de cómo le queda, bien; pero dice lo contrario: se le caía.'],
        ['hecha a mano con hilo de lana', 'RVS7', 'Puede ser cierto, bien; pero el texto no habla de cómo se hizo.'],
        ['holgazana', 'RV20', 'Se escribe parecido a «holgada», bien visto; pero significa otra cosa.']] },
    { o: ['La planta del patio es [w:perenne]: [p:conserva sus hojas verdes durante todo el año].'], w: 'perenne', ok: 'que dura todo el año',
      m: [['que da flores de muchos colores', 'RVS7', 'Puede pasar con una planta, bien; pero la pista habla de hojas todo el año.'],
        ['que pierde sus hojas', 'RVS1', 'Habla de las hojas, bien; pero dice lo contrario de la pista.'],
        ['que es pequeña', 'RV19', 'Habla de la planta, bien; pero es otra cosa: su tamaño, no sus hojas.'],
        ['que es peruana', 'RV20', 'Se escribe parecido a «perenne», bien visto; pero significa otra cosa.']] },
    { o: ['Unos vecinos son [w:reacios] a la nueva feria;', '[p:otros, en cambio, ya separaron su puesto].'], w: 'reacios', ok: 'que no la quieren',
      m: [['que la apoyan', 'RVS8', 'Hay un contraste, bien visto; pero eso describe a los otros vecinos.'],
        ['que la critican en la radio', 'RVS7', 'Podría pasar, bien; pero el texto no habla de la radio.'],
        ['que viven lejos', 'RV19', 'Habla de los vecinos, bien; pero es otra cosa: dónde viven, no qué piensan.'],
        ['que son recios', 'RV20', 'Se escribe parecido a «reacios», bien visto; pero significa otra cosa.']] },
  ];

  // Ejemplos resueltos de la idea 5. Nivel 1: cuál es la pista, qué dice, si un detalle ayuda, qué clase de pista es.
  // Nivel 2: tres significados, con dos fallas distintas. Nivel 3: la hoja con cinco alternativas; las correctas son B,
  // D, C, A y E. Revisado aparte (scratchpad e7-rv/revisa.js).
  const EJEMPLOS_5 = [
    { nivel: 1, titulo: 'La fama del cantante',
      enunciado: '¿Qué parte del texto es la pista de la palabra «efímera»?',
      datos: [D_PISTA5],
      figura: fig(papel('mural', 'Periódico mural de 5.º B', 'Música', 'el equipo de prensa', 'todo el colegio', ors('k', ['La fama del cantante fue [w:efímera]: [p:en un mes, ya nadie recordaba su nombre].']))),
      solucion: [{ texto: ['Tras los dos puntos viene una consecuencia: ', cubre('«en un mes, ya nadie recordaba su nombre»'), '.'] }],
      respuesta: [justo('«En un mes, ya nadie recordaba su nombre»')] },
    { nivel: 1, titulo: 'El agua del pozo',
      enunciado: 'Según la pista del mensaje, ¿qué significa «potable»?',
      datos: [D_PISTA5, D_DEDUC],
      figura: fig(papel('mensaje', 'Familia Quispe', null, 'la abuela Rosa', 'la familia', ors('k', ['El agua del pozo es [w:potable]: [p:la tomamos sin hervirla y nadie se enferma].']))),
      solucion: [{ texto: ['La pista, ', cubre('«la tomamos sin hervirla»'), ', dice que se puede tomar sin peligro.'] }],
      respuesta: [justo('Que se puede beber')] },
    { nivel: 1, titulo: 'El puente pintado',
      enunciado: '¿La oración «Lo pintaron de verde» ayuda a saber qué significa «colosal»?',
      datos: [D_PISTA5, D_DETALLE],
      figura: fig(papel('cartel', 'Cartel de la municipalidad', 'Obra terminada', 'la municipalidad', 'los vecinos', ors('k', ['El nuevo puente es [w:colosal]: [p:es tan largo como diez casas juntas].', 'Lo pintaron de verde.']))),
      solucion: [
        { texto: ['El color es un ', prop('detalle cercano'), ': está junto a la palabra, pero no dice qué significa.'] },
        { texto: ['La pista es ', cubre('«tan largo como diez casas juntas»'), ': colosal es enorme.'] }],
      respuesta: [justo('No'), ': es un detalle cercano'] },
    { nivel: 1, titulo: 'Mi hermana diligente',
      enunciado: 'Por el contraste del cuaderno, ¿«diligente» describe a alguien que deja las tareas para el final?',
      datos: [D_PISTA5, D_CONTRAREV],
      figura: fig(papel('cuaderno', 'Cuaderno de Iván', 'Mi familia', 'Iván', 'la clase de Comunicación', ors('k', ['Mi hermana es [w:diligente];', '[p:en cambio, yo siempre dejo las tareas para el final].']))),
      solucion: [{ texto: ['«En cambio» opone a los dos: eso me describe a mí. Leerlo así es el ', prop('contraste al revés'), '.'] }],
      respuesta: [justo('No'), ': describe a quien hace las cosas a tiempo'] },
    { nivel: 1, titulo: 'Los tubérculos del mercado',
      enunciado: '¿Qué clase de pista trae el cartel para «tubérculos»: una explicación, un ejemplo o un contraste?',
      datos: [D_PISTA5],
      figura: fig(papel('cartel', 'Cartel del mercado Unión', 'Puesto 8', 'doña Juana', 'los clientes', ors('k', ['Vendemos [w:tubérculos] de la zona: [p:papa, olluco, oca y camote].']))),
      solucion: [{ texto: [cubre('«Papa, olluco, oca y camote»'), ' son ejemplos: se busca qué tienen en común.'] }],
      respuesta: [justo('Ejemplos')] },

    { nivel: 2, titulo: 'El clima de la puna',
      enunciado: '¿Qué significa «inclemente» en el folleto: «suave», «que da miedo» o «muy duro»?',
      datos: [D_PISTA5, D_DEDUC],
      figura: fig(papel('folleto', 'Folleto para turistas', 'Viaje a la puna', 'la agencia', 'los turistas', ors('k', ['El clima de la puna es [w:inclemente]: [p:hiela de noche y el viento corta la piel].', 'Lleve ropa abrigadora.']))),
      solucion: [
        { texto: ['«Suave» es ', prop('lo contrario'), '. «Que da miedo» es una ', prop('idea propia'), '.'] },
        { texto: ['La pista, ', cubre('«hiela de noche y el viento corta»'), ', dice que el clima es muy duro.'] }],
      respuesta: [justo('«Muy duro»')] },
    { nivel: 2, titulo: 'La respuesta tajante',
      enunciado: '¿Qué significa «tajante»: «sin dar lugar a dudas», «cortado con un cuchillo de cocina» o «muy amable»?',
      datos: [D_PISTA5, D_DEDUC],
      figura: fig(papel('mensaje', 'Promoción 2026', null, 'Mateo', 'la promoción', ors('k', ['La respuesta del director fue [w:tajante]: [p:dijo que no, y no quiso escuchar nada más].']))),
      solucion: [
        { texto: ['«Cortado con un cuchillo de cocina» toma «tajante» por su ', prop('parecido de forma'), ' con «tajada». «Muy amable» es ', prop('otra cosa'), '.'] },
        { texto: ['La pista, ', cubre('«no quiso escuchar nada más»'), ', dice que fue un no firme.'] }],
      respuesta: [justo('«Sin dar lugar a dudas»')] },
    { nivel: 2, titulo: 'Los dos hermanos',
      enunciado: '¿Qué significa «retraída»: «que conversa con todos», «que habla poco con los demás» o «que se ríe mucho con sus amigas del colegio»?',
      datos: [D_PISTA5, D_DEDUC],
      figura: fig(papel('cuaderno', 'Cuaderno de Rosa', 'Mis vecinos', 'Rosa', 'la clase de Comunicación', ors('k', ['La niña del tercer piso es [w:retraída];', '[p:en cambio, su hermano conversa con todos].']))),
      solucion: [
        { texto: ['«Que conversa con todos» es el ', prop('contraste al revés'), ': es el hermano. «Que se ríe mucho con sus amigas del colegio» es una ', prop('idea propia'), '.'] },
        { texto: [cubre('«En cambio»'), ' dice que ella es lo opuesto del hermano.'] }],
      respuesta: [justo('«Que habla poco con los demás»')] },
    { nivel: 2, titulo: 'El vecino avaro',
      enunciado: '¿Qué significa «avaro»: «que gasta en sus nietos», «que es muy viejo y vive solo en su casa» o «que no quiere soltar su dinero»?',
      datos: [D_PISTA5, D_DEDUC],
      figura: fig(papel('mensaje', 'Vecinos de la calle Lima', null, 'doña Carmen', 'los vecinos', ors('k', ['Don Julio es [w:avaro]: [p:tiene mucho dinero y no presta ni un sol].']))),
      solucion: [
        { texto: ['«Que gasta en sus nietos» es ', prop('lo contrario'), '. «Que es muy viejo y vive solo en su casa» es una ', prop('idea propia'), '.'] },
        { texto: ['La pista, ', cubre('«no presta ni un sol»'), ', dice que guarda su dinero.'] }],
      respuesta: [justo('«Que no quiere soltar su dinero»')] },
    { nivel: 2, titulo: 'Los cerros del pueblo',
      enunciado: '¿Qué significa «circundan» en el folleto: «rodean», «protegen» o «tapan»?',
      datos: [D_PISTA5, D_DEDUC],
      figura: fig(papel('folleto', 'Folleto del pueblo', 'Cómo llegar', 'la municipalidad', 'los visitantes', ors('k', ['Los cerros [w:circundan] el pueblo: [p:lo tienen en medio, por los cuatro lados].']))),
      solucion: [
        { texto: ['«Protegen» es una ', prop('idea propia'), '. «Tapan» es ', prop('otra cosa'), '.'] },
        { texto: ['La pista, ', cubre('«por los cuatro lados»'), ', dice que el pueblo queda en medio.'] }],
      respuesta: [justo('«Rodean»')] },

    { nivel: 3, titulo: 'El discurso del delegado',
      enunciado: 'Pregunta 111 del simulacro. Según el texto, ¿qué significa «conciso»?',
      datos: [D_PISTA5, D_DEDUC],
      figura: fig(sim(111, ors('h', ['El delegado dio un discurso [w:conciso]: [p:en dos minutos dijo todo lo importante y se sentó].']), PIDE5('conciso'),
        ['larguísimo y lleno de vueltas', 'breve y claro', 'muy aburrido', 'con cifras', 'conciliador'])),
      solucion: [
        { texto: [mala('A'), ' es ', prop('lo contrario'), '. ', mala('C'), ' y ', mala('D'), ' son ', prop('idea propia'), '.'] },
        { texto: [mala('E'), ' tiene ', prop('parecido de forma'), '.'] },
        { texto: [buena('B'), ': la pista, ', cubre('«en dos minutos dijo todo lo importante»'), ', dice que fue breve y claro.'] }],
      respuesta: [buena('B'), ': breve y claro'] },
    { nivel: 3, titulo: 'El agua del caño',
      enunciado: 'Pregunta 112 del simulacro. Según el texto, ¿qué significa «salubre»?',
      datos: [D_PISTA5, D_DEDUC, D_DETALLE],
      figura: fig(sim(112, ors('h', ['Las pruebas de la posta mostraron que el agua del caño es [w:salubre]:', '[p:no tiene microbios y se puede tomar sin miedo].']), PIDE5('salubre'),
        ['muy salada', 'llena de tierra y de basura', 'cara', 'buena para la salud', 'de la posta'])),
      solucion: [
        { texto: [mala('A'), ' tiene ', prop('parecido de forma'), '. ', mala('B'), ' es ', prop('lo contrario'), '. ', mala('C'), ' es una ', prop('idea propia'), '.'] },
        { texto: [mala('E'), ' es un ', prop('detalle cercano'), ': las pruebas son de la posta, el agua no.'] },
        { texto: [buena('D'), ': la pista, ', cubre('«no tiene microbios»'), ', dice que no hace mal.'] }],
      respuesta: [buena('D'), ': buena para la salud'] },
    { nivel: 3, titulo: 'Los costales de papa',
      enunciado: 'Pregunta 113 del simulacro. Según el texto, ¿qué significa «exigua»?',
      datos: [D_PISTA5, D_DEDUC],
      figura: fig(sim(113, ors('h', ['El año pasado la cosecha fue [w:exigua];', '[p:este año, en cambio, los costales no alcanzaron para guardar tanta papa].']), PIDE5('exigua'),
        ['muy abundante', 'exitosa', 'muy pequeña', 'muy cara', 'de papa amarga'])),
      solucion: [
        { texto: [mala('A'), ' es el ', prop('contraste al revés'), ': describe este año. ', mala('B'), ' tiene ', prop('parecido de forma'), '.'] },
        { texto: [mala('D'), ' es una ', prop('idea propia'), '. ', mala('E'), ' es ', prop('otra cosa'), '.'] },
        { texto: [buena('C'), ': ', cubre('«en cambio»'), ' opone los dos años; si este año sobró, el pasado faltó.'] }],
      respuesta: [buena('C'), ': muy pequeña'] },
    { nivel: 3, titulo: 'Las vasijas del museo',
      enunciado: 'Pregunta 114 del simulacro. Según el texto, ¿qué significa «vasijas»?',
      datos: [D_PISTA5, D_DEDUC],
      figura: fig(sim(114, ors('h', ['En el museo de la ciudad se exhiben [w:vasijas] de la cultura Pucará:', '[p:cántaros, ollas y platos de barro].']), PIDE5('vasijas'),
        ['recipientes de barro', 'vacas de la puna', 'cuadros pintados', 'telas tejidas', 'ruinas de un templo antiguo'])),
      solucion: [
        { texto: [mala('B'), ' tiene ', prop('parecido de forma'), '. ', mala('C'), ' es una ', prop('idea propia'), '.'] },
        { texto: [mala('D'), ' y ', mala('E'), ' son ', prop('otra cosa'), ': los ejemplos no son telas ni ruinas.'] },
        { texto: [buena('A'), ': los ejemplos, ', cubre('«cántaros, ollas y platos»'), ', son recipientes de barro.'] }],
      respuesta: [buena('A'), ': recipientes de barro'] },
    { nivel: 3, titulo: 'Los sembríos tras la helada',
      enunciado: 'Pregunta 115 del simulacro. Según el texto, ¿qué significa «marchitos»?',
      datos: [D_PISTA5, D_DEDUC],
      figura: fig(sim(115, ors('h', ['Tras la helada, los sembríos quedaron [w:marchitos]:', '[p:las hojas se pusieron negras y secas, y se cayeron].']), PIDE5('marchitos'),
        ['llenos de flores', 'en marcha', 'regados', 'cubiertos de nieve', 'secos y sin vida'])),
      solucion: [
        { texto: [mala('A'), ' es ', prop('lo contrario'), '. ', mala('B'), ' tiene ', prop('parecido de forma'), '.'] },
        { texto: [mala('C'), ' y ', mala('D'), ' son ', prop('idea propia'), ': el texto no habla de riego ni de nieve.'] },
        { texto: [buena('E'), ': la pista es una consecuencia, ', cubre('«las hojas se pusieron negras y secas»'), '.'] }],
      respuesta: [buena('E'), ': secos y sin vida'] },
  ];

  const inferencia = {
    id: 'inferir-significado',
    titulo: 'El significado sale de las pistas',
    pregunta: '¿Cómo sé qué significa una palabra que nunca vi?',
    temas: ['Inferencias léxicas'],
    pieza: 'rv-soporte',
    lee: {
      tarjetas: [
        { titulo: 'El aviso de la posta', texto: 'En la puerta de la posta de Chucuito hay un aviso para las mamás y los papás. Usa una palabra que muchos no conocen: «inocuo».',
          pieza: 'rv-soporte', dibujo: { datos: aviso5(), estado: {} } },
        { titulo: 'Una palabra nueva', texto: 'Una palabra nueva no se salta. Su significado se puede deducir del texto: sacarlo de lo que el texto sí dice, aunque no lo diga con esas palabras.' },
        { titulo: 'Clases de pista', texto: 'La pista puede ser una explicación (después de dos puntos), unos ejemplos, una consecuencia o un contraste con otra cosa. Lo que solo está cerca no siempre ayuda.' },
        { titulo: 'Qué mirar al jugar', texto: 'Toca una oración del aviso para marcarla como pista o tacharla. Pregúntate de cada una: ¿dice algo de la palabra, o solo está cerca?' },
      ],
    },
    actividad: 'Marcar en un aviso de la posta la oración que dice qué significa «inocuo».',
    aprendizaje: 'El significado de una palabra nueva sale de las pistas de su texto: una explicación, un ejemplo, un contraste o una consecuencia.',
    ejemplos: EJEMPLOS_5,
    juega: {
      consigna: 'El aviso de la posta usa «inocuo», una palabra que quizá no conoces. Solo una oración dice qué significa.',
      mision: {
        texto: 'Marca la oración que dice qué significa «inocuo» y tacha las que no ayudan.',
        logrado: listo5,
        bien: 'La oración 2 lo explica: inocuo es lo que no hace daño.',
      },
      voz: 'De cada oración: ¿dice algo de la palabra, o solo está cerca?',
      leyenda: [
        { s: 'negrita', t: 'la palabra nueva' },
        { s: cubre('turquesa'), t: 'la pista: dice qué significa' },
        { s: prop('naranja'), t: 'oración marcada que no es pista' },
        { s: 'tachado', t: 'oración que no ayuda' },
        { s: justo('violeta'), t: 'la palabra, ya entendida' },
      ],
      controles: AVISO5.map((o, k) => ({ id: o.ctl, etiqueta: `Oración ${k + 2}`, opciones: MARCA5.map((t, v) => ({ valor: v, texto: v ? t : 'sin marcar' })) })),
      dibujo: val => ({ datos: Object.assign({ toques: Object.fromEntries(AVISO5.map(o => [o.id, o.ctl])) }, aviso5()), estado: est5(val) }),
      lectura: lectura5,
      minimo: 3,
    },
    predice: {
      pregunta: 'Rosa escribe en el grupo: «Mi primo Teo es locuaz; en cambio, su hermano casi no habla». ¿Qué significa «locuaz»?',
      voz: 'Elige antes de ver: después lo comprobamos con la pista.',
      opciones: opciones('que conversa mucho', [
        ['que casi no habla', 'RVS8', 'Viste el contraste, bien; pero eso describe al hermano, no a Teo.'],
        ['que está medio loco', 'RV20', 'Se escribe parecido a «loco», bien visto; pero la pista habla de hablar.'],
        ['que es muy amable', 'RVS7', 'Puede serlo, bien; pero el texto no dice nada de su trato.'],
      ]),
      dibujo: { datos: msj5, estado: {} },
      revelar: { datos: msj5, estado: { marcas: { l1w: 'f', l1p: 'i' } } },
      coincide: 'Coincide: «en cambio» opone a los dos hermanos; si uno casi no habla, Teo conversa mucho.',
    },
    mira: {
      datos: PROB5,
      voz: 'Volvamos al mensaje: primero, la pista.',
      pasos: [
        { estado: { senal: ['c0'], marcas: { c0p: 'i' } }, texto: 'La pista es un contraste: «en cambio» opone a los dos hermanos.',
          ecuacion: [cubre('en cambio'), ' → ', { negrita: 'lo opuesto del hermano' }] },
        { estado: { marcas: { c0p: 'i' }, tachar: ['c1'], nuevo: ['c1'] }, texto: '«Casi no habla» describe al hermano: es el contraste al revés.',
          ecuacion: [prop('casi no habla'), ': contraste al revés'] },
        { estado: { marcas: { c0p: 'i' }, tachar: ['c1', 'c2'], nuevo: ['c2'] }, texto: '«Loco» solo se parece por la forma.',
          ecuacion: [prop('medio loco'), ': parecido de forma'] },
        { estado: { marcas: { c0p: 'i' }, tachar: ['c1', 'c2', 'c3'], nuevo: ['c3'] }, texto: 'Nada habla del trato: «amable» es una idea propia.',
          ecuacion: [prop('muy amable'), ': idea propia'] },
        { estado: { marcas: { c0p: 'i', c4: 'f' }, tachar: ['c1', 'c2', 'c3'], nuevo: ['c4'] }, texto: 'Lo opuesto de casi no hablar: conversar mucho.',
          ecuacion: [{ negrita: 'locuaz' }, ' ≈ ', justo('que conversa mucho')] },
      ],
    },
    regla: {
      texto: 'El significado de una palabra nueva sale de las pistas de su texto: una explicación, un ejemplo, un contraste o una consecuencia. El significado deducido encaja en su lugar.',
      ecuacion: [cubre('pista'), ' + ', { negrita: 'su lugar' }, ' → ', justo('significado')],
      voz: 'Vuelve a esta regla cuando te encuentres una palabra nueva.',
      condicion: 'la pista está en el texto y habla de la palabra; una idea propia o un detalle cercano no bastan.',
    },
    resuelve: {
      pieza: 'rv-soporte',
      generar(s) {
        const R = RESUELVE_5[s % RESUELVE_5.length];
        return resuelveDe(R, {
          pasos: [
            { tipo: 'pide', texto: `Piden qué significa «${R.w}», una palabra que quizá no conoces.` },
            { tipo: 'datos', texto: R.tengo },
            { tipo: 'regla', texto: 'Se busca la pista y se deduce el significado; después se pone cada alternativa en lugar de la palabra.' },
            { tipo: 'aplica', texto: R.malas },
            { tipo: 'aplica', texto: R.bien, dibujo: { datos: R.sop, estado: estHoja(R.sop, R.buena) } },
            { tipo: 'sentido', texto: R.sentido },
          ],
        });
      },
    },
    ahoraTu: {
      pieza: 'rv-soporte',
      voz: 'Otro texto corto. Busca la pista antes de mirar las opciones.',
      generar(s) {
        const A = AHORA_5[s % AHORA_5.length], sop = sim(105 + (s % AHORA_5.length), ors('h', A.o));
        return {
          pregunta: PIDE5(A.w),
          datos: [D_PISTA5, D_DEDUC, D_DETALLE],
          dibujo: { datos: sop, estado: {} },
          opciones: opciones(A.ok, voltear(A.m, s)),
          solucion: { texto: `La pista del texto lleva a «${A.ok}», y encaja en el lugar de la palabra.`, ecuacion: [{ negrita: A.w }, ' ≈ ', justo(A.ok)],
            dibujo: { datos: sop, estado: estHoja(sop) } },
        };
      },
    },
  };
  const mesaAviso = Object.assign({ id: 'pistas', titulo: 'El aviso de la posta', pieza: 'rv-soporte' }, sinMision(inferencia.juega), {
    invitaciones: [
      { texto: 'Marca las tres oraciones como pista y mira cuáles no lo son.',
        logrado: val => AVISO5.every(o => val[o.ctl] === 1),
        bien: 'El frasco y el día están cerca de la palabra, pero no hablan de ella.' },
      { texto: 'Tacha solo los detalles cercanos.',
        logrado: val => AVISO5.every(o => val[o.ctl] === (o.ok === 2 ? 2 : 0)),
        bien: 'Lo que queda sin tachar es la pista: la oración 2.' },
      { texto: 'Tacha la oración que sí era la pista.',
        logrado: val => val.p2 === 2,
        bien: 'Sin la oración 2, «inocuo» queda sin explicar.' },
    ] });

  // Cada falla que un resuelto nombra (lo que va en naranja) está dicha en sus Datos (lección M8 de la auditoría de
  // Definiciones, como en Analogías). Se completa al armar la unidad, en los ejemplos y en «Así se resuelve». Si no caben
  // en 6 líneas, salen primero las que el resuelto no necesita (la pista, el reemplazo, quien escribe, deducir); si aún
  // no caben, falla aquí.
  const NOMBRES = {
    'otra acepción': D_OTRAAC, 'mismo campo': D_CAMPO, 'parecido de forma': D_FORMA, 'otro rasgo': D_OTRORASGO,
    'sinónimo por antónimo': D_SINANT, 'otra valoración': D_OTRAVAL, 'otro grado': D_GRADO, 'otra cosa': D_OTRACOSA,
    'comodín': D_COMOD, 'choca': D_CHOCA, 'otra acción': D_OTRAAC3, 'lectura literal': D_LECLIT, 'lectura figurada': D_LECFIG,
    'idea propia': D_IDEA, 'detalle cercano': D_DETALLE, 'contraste al revés': D_CONTRAREV, 'lo contrario': D_CONTRARIO,
  };
  const SOBRAN = [D_PISTA, D_REEMP, D_QUIEN, D_DEDUC];
  const naranjas = x => (Array.isArray(x) ? x.flatMap(naranjas) : x && typeof x === 'object' ? (x.v === 'c-o' && typeof x.t === 'string' ? [x.t] : x.texto ? naranjas(x.texto) : []) : []);
  const completar = (datos, texto, donde) => {
    let out = datos.slice();
    for (const n of naranjas(texto)) {
      const linea = NOMBRES[n.replace(/[«»]/g, '').trim()];
      if (linea && !out.includes(linea)) out.push(linea);
    }
    for (const s of SOBRAN) if (out.length > 6 && out.includes(s)) out = out.filter(l => l !== s);
    if (out.length > 6) throw new Error(`sentido-contextual: ${donde} necesita ${out.length} líneas de datos`);
    return out;
  };
  const IDEAS_U = [acepcion, denotaConnota, precision, figurado, inferencia];
  for (const idea of IDEAS_U) {
    for (const e of idea.ejemplos) e.datos = completar(e.datos, e.solucion, `${idea.id} «${e.titulo}»`);
    const gen = idea.resuelve.generar;
    idea.resuelve.generar = s => { const r = gen(s); r.datos = completar(r.datos, r.pasos.filter(p => p.tipo === 'aplica'), `${idea.id} resuelve ${s}`); return r; };
  }

  return {
    unidad: 'razonamiento-verbal.sentido-contextual',
    version: '0.3.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rv-soporte.js'],
    // La unidad no usa letras de fórmula: lo que hay que leer en la figura va en la leyenda de cada juego.
    letras: {},
    historia: {
      texto: 'El Diccionario de autoridades, publicado entre 1726 y 1739, acompañaba cada definición con citas de autores que mostraban cómo se usaba la palabra. Un diccionario reúne las acepciones posibles; elegir la que corresponde a un texto exige mirar la oración donde aparece.',
      pregunta: '¿Por qué un diccionario no basta para entender una oración?',
      // La fuente es la que cita la matriz de la unidad (antes el título decía «Matriz de teoría…» y el enlace iba al CVC).
      fuente: { titulo: 'ASALE, Diccionario de la lengua española: historia del Diccionario de autoridades', url: 'https://www.asale.org/obras-academicas/diccionarios/diccionario-de-la-lengua-espanola' },
    },
    // Glosario: las palabras con que el curso habla del sentido de una palabra en su texto. Cada idea estrena de 2 a 4,
    // con `simple` y tres ejemplos: idea 1, acepción, contexto, pista y prueba del reemplazo; idea 2, denotación y
    // connotación; idea 3, precisión léxica y comodín; idea 4, sentido literal y frase hecha («sentido figurado» ya lo
    // define Definiciones); idea 5, deducir y palabra nueva («inferencia» la estrena Inferencias). Los ejemplos no usan
    // palabras ni frases del juego, la predicción, «Así se resuelve», «Ahora tú» ni los ejemplos de su idea (lo prueba
    // sentido-contextual.test.js).
    glosario: [
      { termino: 'acepción', def: 'Cada uno de los significados que puede tener una misma palabra.',
        simple: 'Cada significado que tiene una palabra.',
        ejemplos: ['«Banco» tiene una acepción de asiento y otra de lugar donde se guarda dinero.', '«Hoja» puede ser la de un árbol o la de un cuaderno.', 'El diccionario numera las acepciones de cada palabra: 1, 2, 3…'],
        formas: ['acepción', 'acepciones'], ver: ['contexto', 'pista'] },
      { termino: 'contexto', def: 'Lo que rodea a una palabra en su texto: las otras palabras, la oración y quién la escribe.',
        simple: 'Lo que rodea a una palabra cuando se lee.',
        ejemplos: ['En «me senté en el banco del parque», el parque es parte del contexto.', '«La cola del perro» y «la cola para pagar»: el contexto cambia la palabra.', 'Sin contexto, «sierra» puede ser una herramienta o una región.'],
        ver: ['pista'] },
      { termino: 'pista', def: 'Parte del contexto que decide qué acepción usa una palabra, o qué significa una palabra nueva.',
        simple: 'Lo que, cerca de la palabra, dice qué significa ahí.',
        ejemplos: ['En «me duele la planta del pie», la pista es «del pie».', 'En «hice cola para pagar», «para pagar» dice que es una fila.', 'Una pista puede ser una palabra o una frase entera.'],
        formas: ['pista', 'pistas'], ver: ['contexto'] },
      { termino: 'prueba del reemplazo', def: 'Poner otra palabra en lugar de la que se estudia y releer, para ver si el texto dice lo mismo.',
        simple: 'Cambiar una palabra por otra y releer.',
        ejemplos: ['«Me senté en el banco» y «me senté en el asiento» dicen lo mismo.', '«Fui al banco a cobrar» y «fui al asiento a cobrar» no dicen lo mismo.', 'Sirve para los sinónimos y para los antónimos en contexto.'],
        formas: ['prueba del reemplazo', 'reemplazo', 'reemplazos'], ver: ['acepción'] },
      { termino: 'denotación', def: 'Lo que una palabra describe o nombra, sin ningún juicio.',
        simple: 'Lo que una palabra describe, sin opinar.',
        ejemplos: ['«Morir» y «fallecer» denotan lo mismo: el fin de una vida.', '«Choza» y «mansión» denotan una vivienda.', 'La denotación es lo que queda si se quita la opinión.'],
        formas: ['denotación', 'denotan', 'denota'], ver: ['connotación'] },
      { termino: 'connotación', def: 'Valoración que una palabra suma a lo que describe: elogio, crítica o ninguna.',
        simple: 'El juicio que una palabra suma a lo que dice.',
        ejemplos: ['«Mansión» suma la idea de lujo a «casa».', '«Choza» suma la idea de pobreza.', '«Fallecer» suena respetuoso; «estirar la pata», burlón.'],
        formas: ['connotación', 'connotaciones', 'connota'], ver: ['denotación'] },
      { termino: 'precisión léxica', def: 'Elegir la palabra que nombra justo lo que se quiere decir y no choca con el resto de la oración.',
        simple: 'Usar la palabra justa, la que dice más.',
        ejemplos: ['«Escaló el cerro» dice más que «subió el cerro».', '«Hirvió el agua» dice más que «calentó el agua».', 'Una palabra precisa no choca con el resto de la oración.'],
        formas: ['precisión léxica', 'palabra precisa', 'palabras precisas'], ver: ['comodín'] },
      { termino: 'comodín', def: 'Palabra tan general que encaja en casi cualquier oración y por eso dice poco.',
        simple: 'Una palabra que sirve para todo y dice poco.',
        ejemplos: ['«Cosa» y «asunto» son comodines: sirven para casi todo.', '«Presentó una queja» dice más que «metió una queja».', 'Un comodín encaja en casi cualquier oración.'],
        formas: ['comodín', 'comodines'], ver: ['precisión léxica'] },
      { termino: 'sentido literal', def: 'Lo que las palabras de una expresión nombran tal cual, sin comparar con nada.',
        simple: 'Lo que las palabras nombran, tal cual.',
        ejemplos: ['«Lavó los platos» se lee en sentido literal.', 'En sentido literal, «una lluvia de ideas» sería agua que cae del cielo.', 'Si la lectura literal encaja con el texto, se queda.'],
        formas: ['sentido literal'], ver: ['sentido figurado'] },
      { termino: 'frase hecha', def: 'Grupo de palabras que va siempre junto y tiene un sentido fijo, que no es la suma de sus palabras.',
        simple: 'Palabras que van siempre juntas y dicen otra cosa.',
        ejemplos: ['«Costar un ojo de la cara»: costar muchísimo.', '«Estar entre la espada y la pared»: no tener salida.', '«Ser pan comido»: ser muy fácil.'],
        formas: ['frase hecha', 'frases hechas'], ver: ['sentido literal'] },
      { termino: 'deducir', def: 'Sacar del texto algo que no está dicho con esas mismas palabras.',
        simple: 'Darse cuenta de algo con lo que el texto sí dice.',
        ejemplos: ['«Llegó empapado» deja deducir que llovía.', 'Si alguien bosteza en toda la clase, se deduce que tiene sueño.', 'Lo deducido tiene que apoyarse en el texto.'],
        formas: ['deducir', 'deduce', 'deducido', 'deducida', 'deducirse'], ver: ['pista'] },
      { termino: 'palabra nueva', def: 'Palabra que el lector todavía no conoce y cuyo significado busca en las pistas de su texto.',
        simple: 'Una palabra que todavía no conoces.',
        ejemplos: ['Para muchos, «ubérrimo» es una palabra nueva.', 'Una palabra nueva no se salta: se buscan sus pistas.', 'Después, el diccionario confirma lo que dijeron las pistas.'],
        formas: ['palabra nueva', 'palabras nuevas'], ver: ['pista'] },
    ],
    laboratorio: [mesaMural, mesaCelular, mesaActa, mesaPeriodico, mesaAviso],
    // A qué idea pertenece cada mesa (Gerson, 16 nov: el laboratorio se agrupa por idea). Las mesas viejas «Fría y dura» y
    // «Del elogio a la crítica» salieron en la etapa 7 (verde y carmín, sin soporte); «pistas» conserva su id con el aviso
    // de la posta nuevo.
    laboratorioIdeas: {
      'mural-claro': ['acepcion'],
      'dos-mensajes': ['denota-connota'],
      'acta-junta': ['palabra-precisa'],
      'periodico-helada': ['sentido-figurado'],
      'pistas': ['inferir-significado'],
    },
    ideas: IDEAS_U,
  };
});
