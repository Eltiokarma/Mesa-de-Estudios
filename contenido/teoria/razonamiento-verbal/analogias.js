/*
 * Teoría de «Analogías» (razonamiento-verbal.analogias). Molde: docs/teoria.md y docs/molde-unidad.md. Se rehace por el
 * contrato «se entiende sin profesor» (etapa 6, docs/plan-calidad.md §7), con la propuesta de docs/etapa6/propuesta-verbal.md
 * como guion (Gerson delegó el criterio y revisa después):
 *   1. relacion-no-tema   «La relación, no el tema»             rehecha el 19 nov (conserva su id y el avance)
 *   2. parte-o-clase      «Clase o parte»                       nueva
 *   3. clase-y-causa      «El orden de la relación»             rehecha (conserva su id; el género y especie se mudó a la 2)
 *   4. sinonimo-antonimo  «Sinónimos y antónimos en un rasgo»   rehecha (conserva su id)
 *   5. puente-justa       «La oración puente justa»             nueva (la pregunta de examen entera)
 * Usa lo que dejó Definiciones (clase, rasgo, muy amplia): la oración puente es la definición de la relación del par
 * base, con su clase («trabaja con») y su rasgo («como herramienta»). No adelanta Sentido contextual: las palabras van
 * sueltas, con su sentido más común, y no se nombran acepción, connotación ni precisión.
 * Objeto de la primera pantalla en verbal: el texto en su soporte, con quién lo escribe y para quién (rv-soporte; la
 * ficha de la oración puente de la idea 5 es rv-definicion). Pares, hojas y avisos propios (regla 5): ninguno copia un
 * examen ni un manual. La hoja de simulacro sigue el formato de las analogías de la UNI como HIPÓTESIS DE FORMATO (en el
 * repo no hay examen de verbal de la UNI; decisión 3 de la propuesta).
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: elegir el par que cumple la misma oración puente que el par base, sin dejarse llevar por el tema.
 *   Persona y condiciones: postulante de 5.º o preuniversitario, celular de gama baja, sin audio, sin profesor.
 *   Resultado observable: arma la oración puente del par base, la prueba en cada par y dice por qué falla cada uno.
 *   Orden de atención: 1.º el par base · 2.º la oración puente · 3.º cada par de la hoja · acción: tocar un par.
 *   Estados: par que cumple · par tachado con su motivo · el único que queda, en violeta.
 *   Duda que resuelve: ¿por qué «carpintero : madera» no sirve si habla de lo mismo que «carpintero : serrucho»?
 *
 * Colores (regla 4; paleta de lectura con papel fijo en todo verbal, como en Definiciones y en Tema e idea principal):
 * el par base, su oración puente y lo que la cumple, i (turquesa, continuo: la evidencia); el par que se prueba o se
 * descarta, con su motivo, o (naranja, a trazos: el distractor); el par que guarda la relación y la respuesta, f
 * (violeta, punteado); lo tachado, gris con raya de tinta. Sin verde ni carmín. Las letras de las alternativas que nombra
 * un resuelto van en negrita (mala, buena). Lo comprueba analogias.test.js.
 * Códigos (docs/investigacion/razonamiento-verbal-ideas-erroneas.md y contenido/razonamiento-verbal/codigos.json): RV15
 * (mismo tema, sin la relación), RV16 (al revés), RV17 (otra relación del mismo campo), RV21 (otro rasgo) y, como
 * hipótesis de esta unidad, RVA1 (sucesión tomada por causa), RVA2 (se lee «es un tipo de» donde es parte o grupo), RVA3
 * (un grado tomado por el opuesto), RVA4 (otra categoría gramatical), RVA5 (oración puente muy amplia: «usa»), RVA6 (se
 * lee «es una pieza de» donde es clase o grupo), RVA7 (se lee «es uno del grupo» donde es clase o parte) y RVA8 (el par
 * tiene la herramienta, pero no a la persona que la usa).
 * Lo que se cumple, se descarta o pasa en los juegos, la predicción y «Mira» lo calcula el código con un mundo chico de
 * pares con sus rasgos (regla 1). Los ejemplos, los «Así se resuelve», los «Ahora tú» y las predicciones se revisaron con
 * un script aparte que no usa el código de la unidad (scratchpad e6-rv/revisa.js): un léxico propio da a cada par su
 * relación, su sentido y la categoría de sus palabras, y comprueba que solo una alternativa cumple la del par base, que
 * cada distractor falla por lo que dice su explicación, y que la correcta no es la más larga, ni la más corta, ni la
 * única escrita dentro de otra, ni la única que no repite una palabra del par base.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  // ---------- Ayudantes (los de Definiciones) ----------
  // Un trozo de color largo puede partirse en renglones (largo: true); si no, en el celular se sale a lo ancho.
  const pinto = v => t => (String(t).length > 14 ? { v, t, largo: true } : { v, t });
  const cubre = pinto('c-i'), prop = pinto('c-o'), justo = pinto('c-f');
  // La letra de una alternativa, en negrita (Gerson, mesa del 17 nov): la descartada en naranja y la correcta en violeta.
  // El U+2060 (invisible) evita que la letra sola salga en cursiva, como una variable (nucleo/ecuacion.js, LETRA).
  const mala = L => ({ v: 'c-o', t: `${L}⁠` }), buena = L => ({ v: 'c-f', t: `${L}⁠` });
  const ora = (pre, lista) => lista.map((t, k) => (typeof t === 'string' ? { id: `${pre}${k + 1}`, t } : Object.assign({ id: `${pre}${k + 1}` }, t)));
  const opciones = (c, malas) => [{ id: 'c', texto: c, correcta: true }, ...malas.map(([texto, error, siFuera], k) => ({ id: `e${k}`, texto, error, siFuera }))];
  const voltear = (arr, s) => (s % 2 ? arr.slice().reverse() : arr.slice());
  const sinMision = j => Object.fromEntries(Object.entries(j).filter(([k]) => k !== 'mision'));
  const LETRAS = 'ABCDE';
  const fig = sop => ({ pieza: 'rv-soporte', datos: sop, estado: {} });
  // La hoja de simulacro de analogías: el par base en mayúsculas, con «::», y las alternativas A–E (o ninguna, cuando
  // las alternativas son los botones de «Ahora tú»). HIPÓTESIS DE FORMATO: el de la UNI, sin citar ningún examen.
  const P_ELIJA = 'Elija el par que guarda la misma relación que el par base.';
  const baseT = b => `${b[0].toUpperCase()} : ${b[1].toUpperCase()} ::`;
  const hoja = (numero, b, alts, extra) => Object.assign({ soporte: 'simulacro', numero, hojas: [{ id: 'h', titulo: 'Analogías', oraciones: [{ id: 'h1', t: baseT(b) }] }],
    pregunta: alts && alts.length ? P_ELIJA : null, alternativas: (alts || []).map((t, k) => ({ id: LETRAS[k], t })) }, extra || {});
  const sinPie = sop => Object.fromEntries(Object.entries(sop).filter(([k]) => k !== 'pregunta' && k !== 'alternativas'));
  // El estado de una hoja resuelta: el par base en turquesa, la buena en violeta y las demás tachadas.
  const estHoja = (sop, buena) => ({ marcas: { [buena]: 'f' }, tachar: sop.alternativas.map(a => a.id).filter(id => id !== buena) });

  // ---------- Idea 1: la relación, no el tema (etapa 6; docs/etapa6/propuesta-verbal.md) ----------
  // Cambia: qué pares de la hoja están tachados. Permanece: el par base, sus cinco pares y su oración puente. Progresa:
  // de cinco pares a uno. Se reserva: la oración puente que el alumno arma solo, y la oración vaga («usa»), que deja
  // pasar a quien usa algo sin que sea la herramienta de su trabajo (predicción). Debe verse: que los pares del mismo
  // tema fallan, cada uno por otra razón, y que pasa el par de otro tema que se une igual.
  // Objeto de la primera pantalla: la hoja de simulacro (quién escribe: la academia; para quién: el postulante), con la
  // tarjeta de la oración puente del par base debajo. La relación del par base se dice como una definición (Definiciones):
  // su clase, «trabaja con», y su rasgo, «como herramienta».
  // Colores: el par base y su oración puente, i; el par tachado y su motivo, o; el que queda, f; lo tachado, gris.
  // Códigos: RV15 (mismo tema, sin la relación), RV17 (otra relación: la persona con su lugar, su obra o su material),
  // RVA5 (oración muy amplia: «usa») y RVA8 (la herramienta sin la persona que la usa).
  const D_PUENTE = 'Oración puente: frase corta que dice cómo se une el par base; vale también para el otro par.';
  const D_AGENTE = 'Agente e instrumento: una persona y la herramienta con que hace su trabajo.';
  const D_TEMA = 'Mismo tema: dos pares que hablan de lo mismo pueden unirse de otra manera.';
  const D_OTRA = 'Otra relación: la persona con su lugar, su obra o su material, y no con su herramienta.';
  const D_VAGA = 'Oración muy amplia: «usa» o «tiene que ver con» valen para casi cualquier par.';
  const D_SINPER = 'Sin persona: el par tiene una herramienta, pero no a quien trabaja con ella.';

  // El juego: el mundo chico de los cinco pares. persona: el primero es alguien que trabaja; herr: el segundo es su
  // herramienta. La oración puente se cumple si las dos cosas son verdad (regla 1: la lectura y la misión salen de aquí).
  const ALT_CARP = [
    { id: 'A', a: 'carpintero', b: 'taller', persona: true, herr: false, por: [prop('«Taller»'), ': es el lugar donde trabaja, no su herramienta'] },
    { id: 'B', a: 'cirujano', b: 'bisturí', persona: true, herr: true },
    { id: 'C', a: 'carpintero', b: 'mesa', persona: true, herr: false, por: [prop('«Mesa»'), ': es lo que hace, no su herramienta'] },
    { id: 'D', a: 'árbol', b: 'madera', persona: false, herr: false, por: [prop('«Árbol»'), ': no es nadie que trabaje con algo'] },
    { id: 'E', a: 'carpintero', b: 'madera', persona: true, herr: false, por: [prop('«Madera»'), ': es el material, no su herramienta'] },
  ];
  const cumpleCarp = x => x.persona && x.herr;
  const PUENTE_CARP = 'El carpintero trabaja con el serrucho como herramienta.';
  const HOJA_CARP = hoja(7, ['carpintero', 'serrucho'], ALT_CARP.map(x => `${x.a} : ${x.b}`), { frase: { etiqueta: 'Oración puente', t: PUENTE_CARP } });
  const ctl = x => x.id.toLowerCase();
  const tachadasCarp = val => ALT_CARP.filter(x => val[ctl(x)] === 1);
  const listoCarp = val => ALT_CARP.every(x => (val[ctl(x)] === 1) === !cumpleCarp(x));
  const estCarp = val => ({ marcas: Object.assign({ frase: 'i' }, listoCarp(val) ? { B: 'f' } : {}), tachar: tachadasCarp(val).map(x => x.id) });
  const lecturaCarp = val => {
    const t = tachadasCarp(val);
    if (t.some(cumpleCarp)) return [prop('Cuidado'), ': el bisturí sí es la herramienta del cirujano'];
    if (listoCarp(val)) return [justo('Queda cirujano : bisturí'), ': cumple ', cubre('la oración puente')];
    if (!t.length) return ['Cinco pares: prueba cada uno en la oración puente'];
    return t[t.length - 1].por;
  };

  // La predicción: el alumno arma solo la oración puente de «pescador : red». Letras en la hoja: orden fijo.
  const HOJA_PESCA = hoja(8, ['pescador', 'red'], ['costurera : vestido', 'trucha : lago', 'tejedora : telar', 'cliente : mesa']);

  // «Así se resuelve»: cuatro hojas con cinco pares; ningún par repite una palabra del par base. Cada incorrecta cae por
  // una sola razón: el tema (RV15), otra relación (RV17), una oración muy amplia (RVA5) o la falta de persona (RVA8). La
  // buena cambia de lugar: D, A, E y B. Ningún caso es de «Ahora tú».
  const RESUELVE_1 = [
    { sop: hoja(9, ['barbero', 'navaja'], ['peine : cabello', 'espuma : espejo', 'pasajero : asiento', 'leñador : hacha', 'sastre : terno']), buena: 'D',
      datos: [D_PUENTE, D_AGENTE], tengo: 'El barbero es una persona y la navaja, la herramienta con que corta el pelo y la barba.',
      puente: 'El barbero trabaja con la navaja como herramienta.',
      malas: [mala('A'), ' tiene la herramienta, ', prop('sin persona'), '. ', mala('B'), ' es del ', prop('mismo tema'), '. ', mala('C'), ': el pasajero usa el asiento, no trabaja con él. ', mala('E'), ': el terno es lo que hace, ', prop('otra relación'), '.'],
      bien: [buena('D'), ': el leñador ', cubre('trabaja con el hacha como herramienta'), '.'],
      sentido: 'El leñador corta leña y el barbero corta pelo: otro tema, la misma oración puente.' },
    { sop: hoja(10, ['fotógrafo', 'cámara'], ['pintor : brocha', 'foto : álbum', 'turista : mochila', 'tijera : papel', 'escultor : estatua']), buena: 'A',
      datos: [D_PUENTE, D_AGENTE], tengo: 'El fotógrafo es una persona y la cámara, la herramienta con que hace su trabajo.',
      puente: 'El fotógrafo trabaja con la cámara como herramienta.',
      malas: [mala('B'), ' es del ', prop('mismo tema'), '. ', mala('C'), ': el turista usa la mochila, no trabaja con ella. ', mala('D'), ' tiene la herramienta, ', prop('sin persona'), '. ', mala('E'), ': la estatua es su obra, ', prop('otra relación'), '.'],
      bien: [buena('A'), ': el pintor ', cubre('trabaja con la brocha como herramienta'), '.'],
      sentido: 'Si «usa» bastara, también pasaría el turista: la oración tiene que decir «trabaja con».' },
    { sop: hoja(11, ['costurera', 'aguja'], ['hilo : tela', 'panadero : pan', 'lector : lentes', 'martillo : clavo', 'cocinero : olla']), buena: 'E',
      datos: [D_PUENTE, D_AGENTE], tengo: 'La costurera es una persona y la aguja, la herramienta con que cose.',
      puente: 'La costurera trabaja con la aguja como herramienta.',
      malas: [mala('A'), ' es del ', prop('mismo tema'), '. ', mala('B'), ': el pan es lo que hace, ', prop('otra relación'), '. ', mala('C'), ': leer no es su oficio. ', mala('D'), ' tiene la herramienta, ', prop('sin persona'), '.'],
      bien: [buena('E'), ': el cocinero ', cubre('trabaja con la olla como herramienta'), '.'],
      sentido: 'Hilo y tela son de la costura, como la aguja, y aun así no cumplen la oración.' },
    { sop: hoja(12, ['agricultor', 'arado'], ['semilla : surco', 'herrero : yunque', 'bañista : sombrilla', 'hacha : leña', 'albañil : pared']), buena: 'B',
      datos: [D_PUENTE, D_AGENTE, 'Yunque: bloque de hierro sobre el que se golpea el metal caliente.'], tengo: 'El agricultor es una persona y el arado, la herramienta con que abre la tierra.',
      puente: 'El agricultor trabaja con el arado como herramienta.',
      malas: [mala('A'), ' es del ', prop('mismo tema'), '. ', mala('C'), ': el bañista usa la sombrilla, no trabaja con ella. ', mala('D'), ' tiene la herramienta, ', prop('sin persona'), '. ', mala('E'), ': la pared es su obra, ', prop('otra relación'), '.'],
      bien: [buena('B'), ': el herrero ', cubre('trabaja con el yunque como herramienta'), '.'],
      sentido: 'El herrero no siembra nada, y por eso mismo sirve: lo que se repite es la relación.' },
  ];

  // «Ahora tú»: la hoja trae solo el par base; los pares son los botones. Cuatro casos con cuatro opciones y dos de examen
  // con cinco. Cada incorrecta, un código: RV15, RV17, RVA5, RVA8.
  const AHORA_1 = [
    { b: ['pintor', 'pincel'], ok: 'cocinera : sartén', puente: 'La cocinera trabaja con la sartén como herramienta.',
      m: [['cuadro : museo', 'RV15', 'Son del mismo tema que el pintor, pero ninguno trabaja con el otro.'],
        ['escultora : estatua', 'RV17', 'Hay una persona, bien; pero la estatua es lo que hace, no su herramienta.'],
        ['turista : cámara', 'RVA5', 'El turista usa la cámara, pero no es su trabajo: «usa» es muy amplia.']] },
    { b: ['escultor', 'cincel'], ok: 'vendedora : balanza', puente: 'La vendedora trabaja con la balanza como herramienta.',
      m: [['piedra : estatua', 'RV15', 'Son del mismo tema que el escultor, pero ninguna trabaja con la otra.'],
        ['arquitecta : edificio', 'RV17', 'Hay una persona, bien; pero el edificio es su obra, no su herramienta.'],
        ['martillo : clavo', 'RVA8', 'El martillo es una herramienta, pero falta la persona que trabaja con él.']] },
    { b: ['músico', 'charango'], ok: 'fotógrafa : cámara', puente: 'La fotógrafa trabaja con la cámara como herramienta.',
      m: [['canción : fiesta', 'RV15', 'Son del mismo tema que el músico, pero ninguna trabaja con la otra.'],
        ['compositor : canción', 'RV17', 'Hay una persona, bien; pero la canción es su obra, no su instrumento.'],
        ['oyente : radio', 'RVA5', 'El oyente usa la radio, pero no trabaja con ella: «usa» es muy amplia.']] },
    { b: ['pastor', 'cayado'], ok: 'minero : pico', puente: 'El minero trabaja con el pico como herramienta.', datos: ['Cayado: bastón con la punta curva, para guiar a los animales.'],
      m: [['oveja : lana', 'RV15', 'Son del mismo tema que el pastor, pero ninguna trabaja con la otra.'],
        ['ganadero : establo', 'RV17', 'Hay una persona, bien; pero el establo es el lugar, no su herramienta.'],
        ['hacha : leña', 'RVA8', 'El hacha es una herramienta, pero falta la persona que trabaja con ella.']] },
    { b: ['peluquero', 'secadora'], ok: 'plomero : llave', puente: 'El plomero trabaja con la llave como herramienta.',
      m: [['cabello : champú', 'RV15', 'Son del mismo tema que el peluquero, pero ninguno trabaja con el otro.'],
        ['arquitecto : plano', 'RV17', 'Hay una persona, bien; pero el plano es lo que hace, no su herramienta.'],
        ['cliente : espejo', 'RVA5', 'El cliente usa el espejo, pero no trabaja con él: «usa» es muy amplia.'],
        ['pinza : cable', 'RVA8', 'La pinza es una herramienta, pero falta la persona que trabaja con ella.']] },
    { b: ['escritor', 'lapicero'], ok: 'cirujana : pinza', puente: 'La cirujana trabaja con la pinza como herramienta.',
      m: [['libro : biblioteca', 'RV15', 'Son del mismo tema que el escritor, pero ninguno trabaja con el otro.'],
        ['poeta : poema', 'RV17', 'Hay una persona, bien; pero el poema es su obra, no su herramienta.'],
        ['lector : lámpara', 'RVA5', 'El lector usa la lámpara, pero leer no es su oficio: «usa» es muy amplia.'],
        ['borrador : mancha', 'RVA8', 'El borrador es una herramienta, pero falta la persona que trabaja con él.']] },
  ];

  // Ejemplos resueltos de la idea 1. La figura es el texto en su soporte, sin marcas. Nivel 1: un paso (la oración puente
  // de un par, o si un par la cumple). Nivel 2: tres pares de una lista, con dos fallas distintas. Nivel 3: la hoja con
  // cinco pares; las correctas son A, B, C, D y E. Ninguno tiene un par al revés (idea 3) ni compara clases o partes
  // (idea 2). Revisado aparte (scratchpad e6-rv/revisa.js): solo un par cumple la relación del par base, cada distractor
  // falla por lo que dice el resuelto y la correcta no es la más larga ni la más corta.
  const cuaderno = (lugar, titulo, de, para, oraciones) => ({ soporte: 'cuaderno', lugar, hojas: [{ id: 'k', titulo, de, para, oraciones: ora('k', oraciones) }] });
  const papel = (soporte, lugar, titulo, de, para, oraciones) => ({ soporte, lugar, hojas: [Object.assign({ id: 'k' }, titulo ? { titulo } : {}, { de, para, oraciones: ora('k', oraciones) })] });
  const EJEMPLOS_1 = [
    { nivel: 1, titulo: 'El cartel del taller',
      enunciado: 'El cartel junta a un mecánico con una llave. ¿Qué oración puente une el par «mecánico : llave»?',
      datos: [D_PUENTE, D_AGENTE],
      figura: fig(papel('cartel', 'Cartel en un taller de Juliaca', 'Se busca ayudante', 'el taller Ramos', 'mecánicos con experiencia', ['Buscamos ayudante de mecánico.', 'Debe traer su propia llave de ruedas.'])),
      solucion: [
        { texto: ['El mecánico es una persona que trabaja, y la llave es aquello con que trabaja: ', cubre('su herramienta'), '.'] },
        { texto: ['La oración dice la unión, ', cubre('«trabaja con»'), ', y el rasgo, ', cubre('«como herramienta»'), '.'] }],
      respuesta: [justo('El mecánico trabaja con la llave'), ' como herramienta'] },
    { nivel: 1, titulo: 'La visita a la panadería',
      enunciado: '¿El par «panadero : panadería» cumple la oración «el panadero trabaja con la panadería como herramienta»?',
      datos: [D_PUENTE, D_AGENTE],
      figura: fig(papel('mensaje', 'Familias de 3.º B', null, 'la tutora', 'familias de 3.º B', ['Mañana visitamos la panadería de don Lucho.', 'El panadero nos mostrará cómo amasa.'])),
      solucion: [
        { texto: ['La panadería no es una herramienta: es el ', prop('lugar'), ' donde trabaja. Es ', prop('otra relación'), '.'] },
        { texto: ['Con la panadería, la oración puente ', prop('es falsa'), '.'] }],
      respuesta: [justo('No'), ': la panadería es el lugar, no la herramienta'] },
    { nivel: 1, titulo: 'Los dos pares de Diego',
      enunciado: 'Diego anotó dos pares en su cuaderno. ¿Cuál de los dos es de agente e instrumento: el 1 o el 2?',
      datos: [D_AGENTE],
      figura: fig(cuaderno('Cuaderno de Diego', 'Pares de la práctica', 'Diego', 'la clase de Comunicación', ['barrendero : escoba', 'escoba : basura'])),
      solucion: [
        { texto: ['El 1 une a una persona, el barrendero, con ', cubre('su herramienta'), ', la escoba.'] },
        { texto: ['El 2 tiene la herramienta, pero ', prop('sin persona'), ': la basura es lo que se barre.'] }],
      respuesta: [justo('El 1'), ': barrendero : escoba'] },
    { nivel: 1, titulo: 'Dos palabras del mercado',
      enunciado: 'En el cartel están el carnicero, la carne y el mercado. ¿El par «carne : mercado» guarda la relación de «carnicero : cuchillo»?',
      datos: [D_PUENTE, D_AGENTE],
      figura: fig(papel('cartel', 'Cartel en un mercado de Juliaca', 'Puesto 14', 'don Mario', 'los clientes', ['Carnes frescas todos los días.', 'El carnicero afila su cuchillo cada mañana.'])),
      solucion: [
        { texto: ['Carne y mercado son del ', prop('mismo tema'), ' que el carnicero, pero ninguna es una persona que trabaje con la otra.'] },
        { texto: ['«El carnicero trabaja con el cuchillo como herramienta» ', prop('no vale'), ' para ese par.'] }],
      respuesta: [justo('No'), ': hablan del mercado, pero no se unen igual'] },
    { nivel: 1, titulo: 'La camilla del puesto de salud',
      enunciado: '¿El par «paciente : camilla» cumple la oración «el primero trabaja con el segundo como herramienta»?',
      datos: [D_PUENTE, D_AGENTE],
      figura: fig(papel('mural', 'Mural del puesto de salud', 'Cómo es la consulta', 'el puesto de salud', 'los pacientes', ['El paciente se recuesta en la camilla.', 'La enfermera lo atiende con su termómetro.'])),
      solucion: [
        { texto: ['El paciente ', prop('usa'), ' la camilla, pero no trabaja con ella: ser paciente no es un oficio.'] },
        { texto: ['Una oración con solo «usa» sería ', prop('muy amplia'), '. La enfermera sí trabaja con ', cubre('su termómetro'), '.'] }],
      respuesta: [justo('No'), ': lo usa, pero no trabaja con él'] },

    { nivel: 2, titulo: 'La herramienta del jardinero',
      enunciado: 'Par base: «jardinero : rastrillo». ¿Qué par guarda su relación: «enfermera : jeringa», «escoba : hojas secas» o «jardinero : parque»?',
      datos: [D_PUENTE, D_AGENTE],
      figura: fig(cuaderno('Cuaderno de Rosa', 'Analogías de la semana', 'Rosa', 'la práctica de Comunicación', ['jardinero : rastrillo'])),
      solucion: [
        { texto: ['«Jardinero : parque» es ', prop('otra relación'), ': el lugar. «Escoba : hojas secas» tiene la herramienta, pero ', prop('sin persona'), '.'] },
        { texto: ['La enfermera ', cubre('trabaja con la jeringa como herramienta'), ', como el jardinero con el rastrillo.'] }],
      respuesta: [justo('«Enfermera : jeringa»')] },
    { nivel: 2, titulo: 'La lista del albañil',
      enunciado: 'Par base: «albañil : badilejo». ¿Qué par guarda su relación: «albañil : ladrillo», «sastre : tijera» o «cal : arena»?',
      datos: [D_PUENTE, D_AGENTE, 'Badilejo: herramienta plana con mango, para poner la mezcla.'],
      figura: fig(papel('mensaje', 'Obra de la calle Lima', null, 'el maestro de obra', 'los ayudantes', ['Mañana traigan su badilejo.', 'El ladrillo y la cal ya están en la obra.'])),
      solucion: [
        { texto: ['El ladrillo es el material del albañil: ', prop('otra relación'), '. Cal y arena son del ', prop('mismo tema'), ', y ninguna trabaja con la otra.'] },
        { texto: ['El sastre ', cubre('trabaja con la tijera como herramienta'), '.'] }],
      respuesta: [justo('«Sastre : tijera»')] },
    { nivel: 2, titulo: 'Usar no es trabajar con',
      enunciado: 'Par base: «dibujante : lápiz». ¿Qué par guarda su relación: «turista : mochila de viaje», «papel : borrador» o «peluquera : peine»?',
      datos: [D_PUENTE, D_AGENTE],
      figura: fig(cuaderno('Cuaderno de Mateo', 'Analogías', 'Mateo', 'el simulacro del sábado', ['dibujante : lápiz'])),
      solucion: [
        { texto: ['El turista usa la mochila, pero no trabaja con ella: «usa» es ', prop('muy amplia'), '. Papel y borrador son del ', prop('mismo tema'), '.'] },
        { texto: ['La peluquera ', cubre('trabaja con el peine como herramienta'), '.'] }],
      respuesta: [justo('«Peluquera : peine»')] },
    { nivel: 2, titulo: 'Tres pares de la chacra',
      enunciado: 'Par base: «agricultor : hoz». ¿Qué par guarda su relación: «cocinera : cucharón», «agricultor : cosecha» o «trigo : cebada»?',
      datos: [D_PUENTE, D_AGENTE, 'Hoz: herramienta curva con filo, para cortar trigo o cebada.'],
      figura: fig(papel('cartel', 'Cartel de la feria de Ayaviri', 'Concurso de cosecha', 'la comunidad', 'los agricultores', ['Traiga su mejor trigo.', 'Se premia la cosecha más grande.'])),
      solucion: [
        { texto: ['La cosecha es lo que obtiene el agricultor: ', prop('otra relación'), '. Trigo y cebada son del ', prop('mismo tema'), '.'] },
        { texto: ['La cocinera ', cubre('trabaja con el cucharón como herramienta'), '.'] }],
      respuesta: [justo('«Cocinera : cucharón»')] },
    { nivel: 2, titulo: 'El taller de zapatos',
      enunciado: 'Par base: «zapatero : martillo». ¿Qué par guarda su relación: «cliente : silla», «sastre : dedal» o «cuero : suela»?',
      datos: [D_PUENTE, D_AGENTE, 'Dedal: capucha de metal que protege el dedo al coser.'],
      figura: fig(papel('cartel', 'Cartel de una zapatería', 'Arreglo de calzado', 'don Julio', 'los vecinos', ['Cambio de suela en el día.', 'Siéntese en la silla mientras espera.'])),
      solucion: [
        { texto: ['El cliente usa la silla, pero no trabaja con ella: ', prop('muy amplia'), '. Cuero y suela son del ', prop('mismo tema'), '.'] },
        { texto: ['El sastre ', cubre('trabaja con el dedal como herramienta'), '.'] }],
      respuesta: [justo('«Sastre : dedal»')] },

    { nivel: 3, titulo: 'La manguera',
      enunciado: 'Pregunta 31 del simulacro, de analogías. ¿Qué par guarda la misma relación que el par base?',
      datos: [D_PUENTE, D_AGENTE],
      figura: fig(hoja(31, ['bombero', 'manguera'], ['relojero : lupa', 'agua : fuego', 'arquitecto : plano', 'vecino : extintor', 'serrucho : tabla'])),
      solucion: [
        { texto: [mala('B'), ' es del ', prop('mismo tema'), '. ', mala('C'), ': el plano es su obra, ', prop('otra relación'), '.'] },
        { texto: [mala('D'), ': el vecino usa el extintor, pero no trabaja con él. ', mala('E'), ' tiene la herramienta, ', prop('sin persona'), '.'] },
        { texto: [buena('A'), ': el relojero ', cubre('trabaja con la lupa como herramienta'), '.'] }],
      respuesta: [buena('A'), ': relojero : lupa'] },
    { nivel: 3, titulo: 'El torno del alfarero',
      enunciado: 'Pregunta 32 del simulacro, de analogías. ¿Qué par guarda la misma relación que el par base?',
      datos: [D_PUENTE, D_AGENTE, 'Torno: rueda que gira, sobre la que se da forma al barro.'],
      figura: fig(hoja(32, ['alfarero', 'torno'], ['barro : horno', 'panadero : rodillo', 'comensal : cuchara', 'escultor : estatua de bronce', 'aguja : tela'])),
      solucion: [
        { texto: [mala('A'), ' es del ', prop('mismo tema'), '. ', mala('C'), ': el comensal usa la cuchara, no trabaja con ella.'] },
        { texto: [mala('D'), ': la estatua es su obra, ', prop('otra relación'), '. ', mala('E'), ' tiene la herramienta, ', prop('sin persona'), '.'] },
        { texto: [buena('B'), ': el panadero ', cubre('trabaja con el rodillo como herramienta'), '.'] }],
      respuesta: [buena('B'), ': panadero : rodillo'] },
    { nivel: 3, titulo: 'El alicate',
      enunciado: 'Pregunta 33 del simulacro, de analogías. ¿Qué par guarda la misma relación que el par base?',
      datos: [D_PUENTE, D_AGENTE, 'Alicate: herramienta de dos brazos para sujetar o cortar alambre.'],
      figura: fig(hoja(33, ['electricista', 'alicate'], ['foco : luz', 'arquitecto : edificio', 'jardinero : tijera', 'pasajero : boleto', 'destornillador : tornillo'])),
      solucion: [
        { texto: [mala('A'), ' es del ', prop('mismo tema'), '. ', mala('B'), ': el edificio es su obra, ', prop('otra relación'), '.'] },
        { texto: [mala('D'), ': el pasajero usa el boleto, no trabaja con él. ', mala('E'), ' tiene la herramienta, ', prop('sin persona'), '.'] },
        { texto: [buena('C'), ': el jardinero ', cubre('trabaja con la tijera como herramienta'), '.'] }],
      respuesta: [buena('C'), ': jardinero : tijera'] },
    { nivel: 3, titulo: 'La tijera del peluquero',
      enunciado: 'Pregunta 34 del simulacro, de analogías. ¿Qué par guarda la misma relación que el par base?',
      datos: [D_PUENTE, D_AGENTE],
      figura: fig(hoja(34, ['peluquero', 'tijera'], ['toalla : champú', 'cliente : sillón', 'costurera : vestido', 'remero : remo', 'peine : pelo'])),
      solucion: [
        { texto: [mala('A'), ' es del ', prop('mismo tema'), '. ', mala('B'), ': el cliente usa el sillón, no trabaja con él.'] },
        { texto: [mala('C'), ': el vestido es su obra, ', prop('otra relación'), '. ', mala('E'), ' tiene la herramienta, ', prop('sin persona'), '.'] },
        { texto: [buena('D'), ': el remero ', cubre('trabaja con el remo como herramienta'), '.'] }],
      respuesta: [buena('D'), ': remero : remo'] },
    { nivel: 3, titulo: 'El timón',
      enunciado: 'Pregunta 35 del simulacro, de analogías. ¿Qué par guarda la misma relación que el par base?',
      datos: [D_PUENTE, D_AGENTE, 'Timón: el volante con que se guía un vehículo.'],
      figura: fig(hoja(35, ['chofer', 'timón'], ['combi : pista', 'pasajero : cinturón', 'mecánico : taller', 'martillo : clavo', 'herrero : martillo'])),
      solucion: [
        { texto: [mala('A'), ' es del ', prop('mismo tema'), '. ', mala('B'), ': el pasajero usa el cinturón, no trabaja con él.'] },
        { texto: [mala('C'), ': el taller es el lugar, ', prop('otra relación'), '. ', mala('D'), ' tiene la herramienta, ', prop('sin persona'), '.'] },
        { texto: [buena('E'), ': el herrero ', cubre('trabaja con el martillo como herramienta'), '.'] }],
      respuesta: [buena('E'), ': herrero : martillo'] },
  ];

  const relacionNoTema = {
    id: 'relacion-no-tema',
    titulo: 'La relación, no el tema',
    pregunta: '¿Basta que dos pares hablen de lo mismo?',
    temas: ['Agente e instrumento'],
    pieza: 'rv-soporte',
    lee: {
      tarjetas: [
        { titulo: 'Una pregunta de analogías', texto: 'En el simulacro, una analogía empieza con un par base en mayúsculas: CARPINTERO : SERRUCHO. Los dos puntos se leen «se relaciona con». Debajo hay cinco pares, y uno solo se une igual que el par base.',
          pieza: 'rv-soporte', dibujo: { datos: HOJA_CARP, estado: { marcas: { frase: 'i' } } } },
        { titulo: 'La oración puente', texto: 'Cómo se unen dos palabras se dice en una oración corta: la oración puente. Se arma con dos pedazos: la unión dice cómo se juntan las dos palabras («trabaja con») y el rasgo, de qué manera («como herramienta»).' },
        { titulo: 'Agente e instrumento', texto: 'El carpintero y el serrucho se unen así: el agente es la persona que hace un trabajo, y el instrumento, la herramienta con que lo hace. Es una relación entre muchas: hay otras maneras de unir dos palabras.' },
        { titulo: 'Qué mirar al jugar', texto: 'Debajo de la hoja está la oración puente del par base. Pon cada par en ella, en tu cabeza. Si la oración deja de ser verdadera, toca ese par en la hoja para tacharlo. Tócalo otra vez para dejarlo.' },
      ],
    },
    actividad: 'Tachar en una hoja de simulacro los pares que no cumplen la oración puente.',
    aprendizaje: 'Un par es análogo si cumple la misma oración puente que el par base; hablar del mismo tema no basta.',
    ejemplos: EJEMPLOS_1,
    juega: {
      consigna: 'Así llega una analogía en un simulacro: un par base y cinco pares. Debajo de la hoja, la oración puente del par base.',
      mision: {
        texto: 'Toca en la hoja los pares que no cumplen la oración puente, hasta dejar uno.',
        logrado: listoCarp,
        bien: 'Queda el único par que cumple la oración, y es de otro tema.',
      },
      voz: 'Pon cada par en la oración, en tu cabeza: ¿sigue siendo verdadera?',
      leyenda: [
        { s: ':', t: 'se relaciona con' },
        { s: '::', t: 'así como: une el par base con otro' },
        { s: 'tachado', t: 'par que descartaste' },
        { s: cubre('turquesa'), t: 'la oración puente del par base' },
        { s: justo('violeta'), t: 'el par que guarda la relación' },
      ],
      controles: ALT_CARP.map(x => ({ id: ctl(x), etiqueta: `Par ${x.id}`, opciones: [{ valor: 0, texto: 'dejar' }, { valor: 1, texto: 'tachar' }] })),
      dibujo: val => ({ datos: Object.assign({ toques: Object.fromEntries(ALT_CARP.map(x => [x.id, ctl(x)])) }, HOJA_CARP), estado: estCarp(val) }),
      lectura: lecturaCarp,
      minimo: 3,
    },
    predice: {
      pregunta: 'Otra hoja del simulacro, ahora sin la oración puente escrita. ¿Qué par guarda la misma relación que «pescador : red»? Las letras son las de la hoja.',
      voz: 'Elige antes de ver: después lo comprobamos con la oración puente.',
      datos: ['Telar: armazón de palos y cuerdas en el que se teje.'],
      orden: 'fijo',
      opciones: [
        { id: 'A', texto: 'costurera : vestido', error: 'RV17', siFuera: 'Hay una persona, bien visto; pero el vestido es lo que hace, no su herramienta.' },
        { id: 'B', texto: 'trucha : lago', error: 'RV15', siFuera: 'Son de la pesca, como el par base, pero ninguno trabaja con el otro.' },
        { id: 'c', texto: 'tejedora : telar', correcta: true },
        { id: 'D', texto: 'cliente : mesa', error: 'RVA5', siFuera: 'El cliente sí usa la mesa; pero no trabaja con ella. «Usa» queda muy amplia.' },
      ],
      dibujo: { datos: HOJA_PESCA, estado: {} },
      revelar: { datos: HOJA_PESCA, estado: estHoja(HOJA_PESCA, 'C') },
      coincide: 'Coincide: la tejedora trabaja con el telar como herramienta, como el pescador con la red.',
    },
    mira: {
      datos: HOJA_PESCA,
      voz: 'Volvamos a la hoja, par por par.',
      pasos: [
        { estado: { senal: ['h1'], nuevo: ['h1'] }, texto: 'Primero, la oración puente del par base: el pescador trabaja con la red.',
          ecuacion: [cubre('trabaja con'), ' + ', cubre('como herramienta')] },
        { estado: { tachar: ['B'], nuevo: ['B'] }, texto: 'Trucha y lago son de la pesca, pero ninguno trabaja con el otro.',
          ecuacion: [mala('B'), ': ', prop('mismo tema')] },
        { estado: { tachar: ['B', 'A'], nuevo: ['A'] }, texto: 'El vestido no es la herramienta de la costurera: es lo que hace.',
          ecuacion: [mala('A'), ': ', prop('otra relación')] },
        { estado: { tachar: ['B', 'A', 'D'], nuevo: ['D'] }, texto: 'El cliente usa la mesa, pero no trabaja con ella.',
          ecuacion: [mala('D'), ': ', prop('«usa» es muy amplia')] },
        { estado: Object.assign(estHoja(HOJA_PESCA, 'C'), { nuevo: ['C'] }), texto: 'La tejedora trabaja con el telar como herramienta: la misma oración.',
          ecuacion: [buena('C'), ': ', cubre('cumple la oración puente')] },
      ],
    },
    regla: {
      texto: 'Un par es análogo si cumple la misma oración puente que el par base. Esa oración dice cómo se unen y su rasgo; el mismo tema no basta.',
      ecuacion: ['puente = ', { llave: [{ negrita: 'unión' }], nota: 'trabaja con' }, ' + ', { llave: [{ negrita: 'rasgo' }], nota: 'como herramienta' }],
      voz: 'Vuelve a esta regla cuando dudes con un par.',
      condicion: 'la oración es verdadera con el par base y con el otro par, y dice más que «usa» o «tiene que ver».',
    },
    resuelve: {
      pieza: 'rv-soporte',
      generar(s) {
        const R = RESUELVE_1[s % RESUELVE_1.length];
        return {
          enunciado: `Pregunta ${R.sop.numero} del simulacro, de analogías. ¿Qué par de la hoja guarda la misma relación que el par base?`,
          datos: R.datos, dibujo: { datos: R.sop, estado: {} },
          pasos: [
            { tipo: 'pide', texto: 'Piden el par que cumple la misma oración puente que el par base.' },
            { tipo: 'datos', texto: [R.tengo, ' Oración puente: ', cubre(`«${R.puente}»`)] },
            { tipo: 'regla', texto: 'Cada par se pone en la oración puente. El que habla del mismo tema, o solo usa algo, no la cumple.' },
            { tipo: 'aplica', texto: R.malas },
            { tipo: 'aplica', texto: R.bien, dibujo: { datos: R.sop, estado: estHoja(R.sop, R.buena) } },
            { tipo: 'sentido', texto: R.sentido },
          ],
          respuesta: [buena(R.buena), ': ', R.sop.alternativas.find(a => a.id === R.buena).t],
        };
      },
    },
    ahoraTu: {
      pieza: 'rv-soporte',
      voz: 'Otra hoja. Arma primero la oración puente del par base.',
      generar(s) {
        const A = AHORA_1[s % AHORA_1.length], sop = hoja(13 + (s % AHORA_1.length), A.b);
        return {
          pregunta: 'La hoja trae el par base. ¿Qué par guarda la misma relación?',
          datos: [D_PUENTE, D_AGENTE, ...(A.datos || [])], dibujo: { datos: sinPie(sop), estado: {} },
          opciones: opciones(A.ok, voltear(A.m, s)),
          solucion: { texto: 'Cumple la misma oración puente que el par base: una persona y la herramienta de su trabajo.', ecuacion: [justo(A.ok)],
            dibujo: { datos: Object.assign(sinPie(sop), { frase: { etiqueta: 'Oración puente', t: A.puente } }), estado: { marcas: { frase: 'f' } } } },
        };
      },
    },
  };

  // ---------- Laboratorio de la idea 1: el taller de la oración puente (de la versión 0.2.0, pasado a la paleta de lectura) ----------
  // Más rico que el juego: seis relaciones a la vez y ocho fichas, entre ellas una al revés (flor : pétalo) y una
  // sucesión sin causa (lunes : martes). Si se cumple lo decide el código (regla 1) con la relación y el orden de cada
  // ficha. Colores: la ficha que se prueba, o; la oración que se cumple, i; la que no, o con su sello en palabras.
  const RV = () => Kit.piezas['rv-texto'];
  const RELS = {
    herramienta: { texto: 'Herramienta', partes: ['', 'trabaja con', ''] },
    parte: { texto: 'Parte', partes: ['', 'es una parte de', ''] },
    especie: { texto: 'Clase', partes: ['', 'es un tipo de', ''] },
    causa: { texto: 'Causa', partes: ['', 'produce', ''] },
    sinonimo: { texto: 'Sinónimos', partes: ['', 'significa casi lo mismo que', ''] },
    antonimo: { texto: 'Antónimos', partes: ['', 'es lo contrario de', ''] },
  };
  const FICHAS = {
    cirujano: { a: 'cirujano', b: 'bisturí', rel: 'herramienta' },
    petalo: { a: 'pétalo', b: 'flor', rel: 'parte' },
    flor: { a: 'flor', b: 'pétalo', rel: 'parte', alReves: true },
    condor: { a: 'cóndor', b: 'ave', rel: 'especie' },
    chispa: { a: 'chispa', b: 'incendio', rel: 'causa' },
    lunes: { a: 'lunes', b: 'martes', rel: null },
    alegre: { a: 'alegre', b: 'contento', rel: 'sinonimo' },
    frio: { a: 'frío', b: 'caliente', rel: 'antonimo' },
  };
  const veredicto = (r, k) => { const f = FICHAS[k]; return f.rel !== r ? 'no' : f.alReves ? 'reves' : 'si'; };
  const figTaller = r => ({ esquinaLibre: true, secciones: [
    { id: 'bandeja', titulo: 'Fichas', modo: 'lista', fragmentos: Object.entries(FICHAS).map(([id, f]) => ({ id, t: `${f.a} : ${f.b}` })) },
    { id: 'puente', titulo: 'Oración puente', modo: 'tarjeta', fragmentos: [
      { id: 'a', hueco: true, reserva: 'cirujano' }, { id: 'p1', t: RELS[r].partes[1] }, { id: 'b', hueco: true, reserva: 'incendio' }] },
  ] });
  const SELLO = { si: { t: 'Se cumple', c: 'i' }, reves: { t: 'Solo al revés', c: 'o' }, no: { t: 'No se cumple', c: 'o' } };
  const mesaTaller = {
    id: 'taller', titulo: 'El taller de la oración puente', pieza: 'rv-texto',
    consigna: 'Elige una relación y arrastra la ficha por la bandeja. Mira con qué pares la oración queda verdadera.',
    voz: 'Una ficha puede cumplir otra relación, o la misma al revés.',
    controles: [
      { id: 'r', etiqueta: 'Relación', opciones: Object.entries(RELS).map(([valor, x]) => ({ valor, texto: x.texto })) },
      { id: 'p', etiqueta: 'Ficha', opciones: Object.entries(FICHAS).map(([valor, f]) => ({ valor, texto: `${f.a} : ${f.b}` })) },
    ],
    dibujo: val => {
      const f = FICHAS[val.p], v = veredicto(val.r, val.p), ok = v === 'si';
      return { datos: figTaller(val.r), estado: { huecos: { a: f.a, b: f.b }, marcas: { a: ok ? 'i' : 'o', b: ok ? 'i' : 'o', [val.p]: 'o' }, sellos: { puente: SELLO[v] } } };
    },
    lectura: val => {
      const v = veredicto(val.r, val.p), n = Object.keys(FICHAS).filter(k => veredicto(val.r, k) === 'si').length;
      return [`${RELS[val.r].texto}: `, v === 'si' ? cubre(SELLO[v].t) : prop(SELLO[v].t), ` · cumplen ${n} de 8`];
    },
    arrastres: [{
      id: 'ficha', etiqueta: 'ficha que entra en la oración', color: 'c-o',
      donde: val => RV().ancla(figTaller(val.r), val.p),
      mover: (pt, val) => ({ p: RV().cercana(figTaller(val.r), pt, Object.keys(FICHAS)) }),
    }],
    invitaciones: [
      { texto: 'Haz que la oración puente se cumpla con la relación de causa.',
        logrado: val => val.r === 'causa' && veredicto(val.r, val.p) === 'si',
        bien: 'La chispa produce el incendio.' },
      { texto: 'Encuentra una ficha que cumpla «parte», pero solo al revés.',
        logrado: val => veredicto(val.r, val.p) === 'reves',
        bien: 'Las mismas palabras, en otro orden: la dirección también cuenta.' },
      { texto: 'Busca la ficha que no cumple ninguna de las seis relaciones.',
        logrado: val => Object.keys(RELS).every(r => veredicto(r, val.p) === 'no'),
        bien: 'El martes viene después del lunes, pero el lunes no lo produce.' },
      { texto: 'Guarda dos fichas que cumplan relaciones distintas, cada una con su oración.',
        logrado: (val, guardados) => veredicto(val.r, val.p) === 'si' && guardados.some(g => g.r !== val.r && veredicto(g.r, g.p) === 'si'),
        bien: 'Cada par pidió su propia oración: decide la relación, no el tema.' },
    ],
  };

  // ---------- Idea 2: clase o parte (nueva, etapa 6) ----------
  // Cambia: la oración puente que el alumno le pone a cada par del cuaderno. Permanece: los cinco pares de Mateo.
  // Progresa: de cinco pares sin oración a cinco pares con la oración que los hace verdaderos. Se reserva: el grupo de
  // iguales (árbol : bosque), que no es clase ni parte (predicción). Debe verse: que «todo… es un…» y «… es una pieza
  // de…» no valen para los mismos pares.
  // Objeto de la primera pantalla: el cuaderno de Mateo, con la tarea que copió de la práctica de Comunicación.
  // Colores: la oración que queda verdadera, i; la que queda falsa, o; la respuesta de la predicción, f. Usa la clase de
  // Definiciones (género próximo): «todo cóndor es un ave».
  // Códigos: RVA2 (se lee «es un tipo de» donde es parte o grupo), RVA6 (se lee «es una pieza de» donde es clase o grupo),
  // RVA7 (se lee «es uno del grupo» donde es clase o parte), RV15 (mismo tema) y RV17 (otra relación).
  const D_CLASE = 'Clase (género y especie): todo lo que nombra la primera palabra es lo que nombra la segunda (todo gato es un animal).';
  const D_PARTE = 'Parte (parte y todo): la primera es una pieza que, con piezas de otro tipo, forma la segunda.';
  const D_GRUPO = 'Grupo (elemento y conjunto): la segunda nombra un conjunto hecho solo de muchos iguales a la primera.';
  const D_OTRAREL = 'Otra relación: el par se une de otra manera, como una persona y su herramienta.';
  const ETQ2 = ['¿…?', 'es un tipo de', 'es una parte de'];
  const PARES2 = [
    { id: 'k1', a: 'cóndor', b: 'ave', rel: 1, no: [prop('cóndor : ave'), ': el cóndor no es una pieza del ave'] },
    { id: 'k2', a: 'pétalo', b: 'flor', rel: 2, no: [prop('pétalo : flor'), ': el pétalo no es una flor'] },
    { id: 'k3', a: 'mesa', b: 'mueble', rel: 1, no: [prop('mesa : mueble'), ': la mesa no es una pieza del mueble'] },
    { id: 'k4', a: 'dedo', b: 'mano', rel: 2, no: [prop('dedo : mano'), ': el dedo no es una mano'] },
    { id: 'k5', a: 'trucha', b: 'pez', rel: 1, no: [prop('trucha : pez'), ': la trucha no es una pieza del pez'] },
  ];
  const c2 = p => p.id.replace('k', 'c');
  const cuad2 = val => ({ soporte: 'cuaderno', lugar: 'Cuaderno de Mateo', hojas: [{ id: 'k', titulo: 'Tarea: ¿tipo o parte?', de: 'Mateo', para: 'la práctica de Comunicación',
    oraciones: PARES2.map(p => ({ id: p.id, t: `${p.a} : ${p.b} → ${ETQ2[val[c2(p)] || 0]}` })) }] });
  const INI2 = Object.fromEntries(PARES2.map(p => [c2(p), 0]));
  const listo2 = val => PARES2.every(p => val[c2(p)] === p.rel);
  const est2 = val => ({ marcas: Object.fromEntries(PARES2.filter(p => val[c2(p)]).map(p => [p.id, val[c2(p)] === p.rel ? 'i' : 'o'])) });
  const lectura2 = val => {
    if (listo2(val)) return [justo('Justo'), ': tres tipos y dos partes'];
    const mal2 = PARES2.find(p => val[c2(p)] && val[c2(p)] !== p.rel);
    if (mal2) return mal2.no;
    const n = PARES2.filter(p => val[c2(p)] === p.rel).length;
    return n ? [cubre(`${n} de 5 bien`), '; faltan pares por probar'] : ['Lee cada par con las dos oraciones'];
  };
  const HOJA_BOSQUE = hoja(36, ['árbol', 'bosque'], ['eucalipto : planta', 'abeja : enjambre', 'hoja : rama', 'leña : fogata']);

  // «Así se resuelve»: cuatro hojas; ningún par repite una palabra del par base. Cada incorrecta cae por una razón: otra
  // relación de «estar dentro» (clase, parte o grupo), el mismo tema u otra relación. La buena va en E, B, D y A.
  const RESUELVE_2 = [
    { sop: hoja(37, ['tapa', 'libro'], ['soldado : regimiento', 'rosa : flor', 'sastre : tijera', 'tinta : papel', 'hélice : ventilador']), buena: 'E',
      datos: [D_CLASE, D_PARTE, D_GRUPO], tengo: 'La tapa es una pieza del libro, distinta de las páginas y del lomo: es de parte.',
      malas: [mala('A'), ': muchos soldados iguales forman el regimiento, es de ', prop('grupo'), '. ', mala('B'), ': toda rosa es una flor, es de ', prop('clase'), '. ', mala('C'), ' es ', prop('otra relación'), '. ', mala('D'), ' es del ', prop('mismo tema'), '.'],
      bien: [buena('E'), ': la hélice ', cubre('es una pieza del ventilador'), ', como la tapa del libro.'],
      sentido: 'Un ventilador sin hélice está incompleto, como un libro sin tapa.' },
    { sop: hoja(38, ['trucha', 'pez'], ['soldado : batallón', 'papa : tubérculo', 'aleta : tiburón', 'red : lago', 'panadera : harina']), buena: 'B',
      datos: [D_CLASE, D_PARTE, D_GRUPO, 'Tubérculo: tallo grueso bajo tierra que guarda alimento.'], tengo: 'Toda trucha es un pez: «pez» es su clase.',
      malas: [mala('A'), ': muchos soldados forman el batallón, es de ', prop('grupo'), '. ', mala('C'), ': la aleta es una pieza del tiburón, es de ', prop('parte'), '. ', mala('D'), ' es del ', prop('mismo tema'), '. ', mala('E'), ' es ', prop('otra relación'), '.'],
      bien: [buena('B'), ': ', cubre('toda papa es un tubérculo'), ', como toda trucha es un pez.'],
      sentido: 'Al revés no vale: no todo pez es una trucha, ni todo tubérculo una papa.' },
    { sop: hoja(39, ['lobo', 'manada'], ['cuy : roedor', 'motor : auto', 'aullido : luna', 'soldado : ejército', 'entrenador : silbato']), buena: 'D',
      datos: [D_CLASE, D_PARTE, D_GRUPO], tengo: 'Muchos lobos iguales, juntos, forman la manada: es de grupo.',
      malas: [mala('A'), ': todo cuy es un roedor, es de ', prop('clase'), '. ', mala('B'), ': el motor es una pieza del auto, es de ', prop('parte'), '. ', mala('C'), ' es del ', prop('mismo tema'), '. ', mala('E'), ' es ', prop('otra relación'), '.'],
      bien: [buena('D'), ': muchos soldados iguales ', cubre('forman el ejército'), ', como los lobos la manada.'],
      sentido: 'Un lobo no es un tipo de manada ni una pieza distinta: es uno de muchos iguales.' },
    { sop: hoja(40, ['mango', 'fruta'], ['quena : instrumento', 'cuerda : guitarra', 'barco : flota', 'cáscara : pepa', 'agricultor : cosecha']), buena: 'A',
      datos: [D_CLASE, D_PARTE, D_GRUPO], tengo: 'Todo mango es una fruta: «fruta» es su clase.',
      malas: [mala('B'), ': la cuerda es una pieza de la guitarra, es de ', prop('parte'), '. ', mala('C'), ': muchos barcos forman la flota, es de ', prop('grupo'), '. ', mala('D'), ' es del ', prop('mismo tema'), '. ', mala('E'), ' es ', prop('otra relación'), '.'],
      bien: [buena('A'), ': ', cubre('toda quena es un instrumento'), ', como todo mango es una fruta.'],
      sentido: 'La quena no es del tema de la fruta, y sirve igual: lo que se repite es la relación.' },
  ];
  // «Ahora tú»: cuatro con cuatro opciones y dos de examen con cinco. Códigos: RVA2, RVA6, RVA7, RV15, RV17.
  const AHORA_2 = [
    { b: ['pata', 'mesa'], ok: 'aleta : tiburón', puente: 'La aleta es una pieza del tiburón.',
      m: [['silla : mueble', 'RVA2', 'Toda silla es un mueble, bien; pero la pata no es un tipo de mesa.'],
        ['pez : cardumen', 'RVA7', 'Muchos peces forman el cardumen; la mesa no se forma con muchas patas iguales.'],
        ['mantel : servilleta', 'RV15', 'Son del mismo tema que la mesa, pero ninguno es pieza del otro.']] },
    { b: ['perro', 'mamífero'], ok: 'gaviota : ave', puente: 'Toda gaviota es un ave.',
      m: [['cola : gato', 'RVA6', 'La cola es una pieza del gato; pero el perro no es una pieza del mamífero.'],
        ['oveja : rebaño', 'RVA7', 'Muchas ovejas forman el rebaño; pero el mamífero no es un grupo de perros.'],
        ['hueso : collar', 'RV15', 'Son del mismo tema que el perro, pero no se unen como tipo y clase.']] },
    { b: ['pez', 'cardumen'], ok: 'lobo : manada', puente: 'Muchos lobos iguales, juntos, forman la manada.',
      m: [['colibrí : ave', 'RVA2', 'Todo colibrí es un ave, bien; pero ningún pez es un cardumen.'],
        ['escama : tiburón', 'RVA6', 'La escama es una pieza del tiburón; el cardumen no se arma con piezas distintas.'],
        ['red : río', 'RV15', 'Son del mismo tema que el pez, pero no forman un grupo de iguales.']] },
    { b: ['rueda', 'bicicleta'], ok: 'ventana : casa', puente: 'La ventana es una pieza de la casa.',
      m: [['triciclo : vehículo', 'RVA2', 'Todo triciclo es un vehículo, bien; pero la rueda no es un tipo de bicicleta.'],
        ['uva : racimo', 'RVA7', 'Muchas uvas forman el racimo; la bicicleta no son muchas ruedas iguales.'],
        ['casco : ciclista', 'RV15', 'Son del mismo tema que la bicicleta, pero el casco no es una pieza del ciclista.']] },
    { b: ['barco', 'flota'], ok: 'grulla : bandada', puente: 'Muchas grullas iguales, juntas, forman la bandada.',
      m: [['lancha : vehículo', 'RVA2', 'Toda lancha es un vehículo, bien; pero ningún barco es una flota.'],
        ['mástil : velero', 'RVA6', 'El mástil es una pieza del velero; la flota no se arma con piezas distintas.'],
        ['puerto : muelle', 'RV15', 'Son del mismo tema que el barco, pero no forman un grupo de iguales.'],
        ['marinero : timón', 'RV17', 'Es una persona y su herramienta: otra relación, no la de un grupo.']] },
    { b: ['zapatilla', 'calzado'], ok: 'tenedor : cubierto', puente: 'Todo tenedor es un cubierto.',
      m: [['pasador : zapato', 'RVA6', 'El pasador es una pieza del zapato; pero la zapatilla no es una pieza del calzado.'],
        ['oveja : rebaño', 'RVA7', 'Muchas ovejas forman el rebaño; el calzado no es un grupo de zapatillas iguales.'],
        ['pie : media', 'RV15', 'Son del mismo tema que la zapatilla, pero no son tipo y clase.'],
        ['zapatero : martillo', 'RV17', 'Es una persona y su herramienta: otra relación, no la de tipo y clase.']] },
  ];
  // Ejemplos de la idea 2. Nivel 1: una prueba («todo… es un…», «… es una pieza de…»). Nivel 2: tres pares de una lista.
  // Nivel 3: la hoja con cinco pares; las correctas son A, B, C, D y E. Ninguno tiene un par al revés (idea 3).
  const EJEMPLOS_2 = [
    { nivel: 1, titulo: 'La prueba del «todo»',
      enunciado: 'Mateo anotó el par «loro : ave». ¿Es de clase? Haz la prueba con la oración «todo loro es un ave».',
      datos: [D_CLASE],
      figura: fig(cuaderno('Cuaderno de Mateo', 'Pares de la práctica', 'Mateo', 'la clase de Comunicación', ['loro : ave'])),
      solucion: [{ texto: ['La oración es verdadera: ', cubre('todo loro es un ave'), '. El ave es la clase del loro.'] }],
      respuesta: [justo('Sí'), ': es de clase'] },
    { nivel: 1, titulo: 'La pieza de la casa',
      enunciado: '¿El par «techo : casa» es de clase o de parte?',
      datos: [D_CLASE, D_PARTE],
      figura: fig(papel('cartel', 'Cartel de una ferretería', 'Todo para su casa', 'la ferretería Quispe', 'los vecinos', ['Calaminas para el techo.', 'Cerraduras para la puerta.'])),
      solucion: [{ texto: ['«Todo techo es una casa» es falsa. El techo ', cubre('es una pieza de la casa'), ', distinta de la puerta y las paredes.'] }],
      respuesta: [justo('De parte'), ': el techo es una pieza de la casa'] },
    { nivel: 1, titulo: '¿Un tipo de dedo?',
      enunciado: '¿Es verdadera la oración «toda uña es un dedo»?',
      datos: [D_CLASE, D_PARTE],
      figura: fig(papel('mural', 'Mural del puesto de salud', 'Cuide sus manos', 'el puesto de salud', 'los vecinos', ['Lávese las manos y las uñas antes de comer.'])),
      solucion: [{ texto: ['Es falsa: la uña no es un tipo de dedo. La uña ', cubre('es una pieza del dedo'), ': es de parte.'] }],
      respuesta: [justo('No'), ': la uña es una parte del dedo'] },
    { nivel: 1, titulo: 'Muchos iguales',
      enunciado: '¿El par «pato : bandada» es de parte?',
      datos: [D_PARTE, D_GRUPO],
      figura: fig(papel('mensaje', 'Club de Ciencias', null, 'el profesor de Ciencia', 'el club', ['Mañana vamos al lago a ver la bandada de patos.'])),
      solucion: [{ texto: ['No: la bandada no se arma con piezas distintas. ', cubre('Muchos patos iguales'), ', juntos, forman la bandada: es de ', prop('grupo'), '.'] }],
      respuesta: [justo('No'), ': es de grupo'] },
    { nivel: 1, titulo: 'Las tres pruebas',
      enunciado: '¿Qué relación hay en «pino : árbol»: de clase, de parte o de grupo?',
      datos: [D_CLASE, D_PARTE, D_GRUPO],
      figura: fig(cuaderno('Cuaderno de Rosa', 'Analogías de la semana', 'Rosa', 'la práctica de Comunicación', ['pino : árbol'])),
      solucion: [{ texto: ['Es verdadera ', cubre('«todo pino es un árbol»'), '. El pino no es una pieza del árbol, ni el árbol un grupo de pinos.'] }],
      respuesta: [justo('De clase'), ': todo pino es un árbol'] },

    { nivel: 2, titulo: 'La pantalla del celular',
      enunciado: 'Par base: «pantalla : celular». ¿Qué par guarda su relación: «uva : racimo», «cuerda : arpa» o «cuaderno : útil escolar»?',
      datos: [D_CLASE, D_PARTE, D_GRUPO],
      figura: fig(cuaderno('Cuaderno de Diego', 'Analogías', 'Diego', 'el simulacro del sábado', ['pantalla : celular'])),
      solucion: [
        { texto: ['Muchas uvas forman el racimo: es de ', prop('grupo'), '. Todo cuaderno es un útil escolar: es de ', prop('clase'), '.'] },
        { texto: ['La cuerda ', cubre('es una pieza del arpa'), ', como la pantalla del celular.'] }],
      respuesta: [justo('«Cuerda : arpa»')] },
    { nivel: 2, titulo: 'El gato y su clase',
      enunciado: 'Par base: «gato : felino». ¿Qué par guarda su relación: «cebra : manada», «bigote : león marino» o «alpaca : camélido»?',
      datos: [D_CLASE, D_PARTE, D_GRUPO, 'Camélido: animal andino de cuello largo, como la llama.'],
      figura: fig(papel('mural', 'Mural de la feria de ciencias', 'Animales y sus grupos', '2.º A', 'los visitantes', ['Todo gato es un felino, como el puma.'])),
      solucion: [
        { texto: ['Muchas cebras forman la manada: es de ', prop('grupo'), '. El bigote es una pieza del león marino: es de ', prop('parte'), '.'] },
        { texto: [cubre('Toda alpaca es un camélido'), ', como todo gato es un felino.'] }],
      respuesta: [justo('«Alpaca : camélido»')] },
    { nivel: 2, titulo: 'Las uvas del racimo',
      enunciado: 'Par base: «uva : racimo». ¿Qué par guarda su relación: «soldado : tropa», «asa : taza» o «trucha arcoíris : pez»?',
      datos: [D_CLASE, D_PARTE, D_GRUPO],
      figura: fig(papel('cartel', 'Cartel de un puesto del mercado', 'Uvas de Ica', 'doña Carmen', 'los clientes', ['Se vende el racimo entero.'])),
      solucion: [
        { texto: ['El asa es una pieza de la taza: es de ', prop('parte'), '. Toda trucha arcoíris es un pez: es de ', prop('clase'), '.'] },
        { texto: [cubre('Muchos soldados iguales forman la tropa'), ', como muchas uvas el racimo.'] }],
      respuesta: [justo('«Soldado : tropa»')] },
    { nivel: 2, titulo: 'El motor y el auto',
      enunciado: 'Par base: «motor : auto». ¿Qué par guarda su relación: «barco : flota», «hélice : avión» o «combi : vehículo»?',
      datos: [D_CLASE, D_PARTE, D_GRUPO],
      figura: fig(papel('cartel', 'Cartel de un taller', 'Revisión de autos', 'el taller Ramos', 'los choferes', ['Revisamos el motor y los frenos.'])),
      solucion: [
        { texto: ['Muchos barcos forman la flota: es de ', prop('grupo'), '. Toda combi es un vehículo: es de ', prop('clase'), '.'] },
        { texto: ['La hélice ', cubre('es una pieza del avión'), ', como el motor del auto.'] }],
      respuesta: [justo('«Hélice : avión»')] },
    { nivel: 2, titulo: 'La tortuga y su clase',
      enunciado: 'Par base: «tortuga : reptil». ¿Qué par guarda su relación: «pata : silla», «hormiga : colonia» o «quinua : grano»?',
      datos: [D_CLASE, D_PARTE, D_GRUPO],
      figura: fig(cuaderno('Cuaderno de Rosa', 'Analogías', 'Rosa', 'el simulacro del domingo', ['tortuga : reptil'])),
      solucion: [
        { texto: ['La pata es una pieza de la silla: es de ', prop('parte'), '. Muchas hormigas forman la colonia: es de ', prop('grupo'), '.'] },
        { texto: [cubre('Toda quinua es un grano'), ', como toda tortuga es un reptil.'] }],
      respuesta: [justo('«Quinua : grano»')] },

    { nivel: 3, titulo: 'El botón de la camisa',
      enunciado: 'Pregunta 41 del simulacro, de analogías. ¿Qué par guarda la misma relación que el par base?',
      datos: [D_CLASE, D_PARTE, D_GRUPO],
      figura: fig(hoja(41, ['botón', 'camisa'], ['llanta : bicicleta', 'chompa de lana : prenda', 'oveja : rebaño', 'aguja : hilo', 'sastre : tijera'])),
      solucion: [
        { texto: [mala('B'), ': toda chompa de lana es una prenda, es de ', prop('clase'), '. ', mala('C'), ': muchas ovejas forman el rebaño, es de ', prop('grupo'), '.'] },
        { texto: [mala('D'), ' es del ', prop('mismo tema'), '. ', mala('E'), ' es ', prop('otra relación'), '.'] },
        { texto: [buena('A'), ': la llanta ', cubre('es una pieza de la bicicleta'), ', como el botón de la camisa.'] }],
      respuesta: [buena('A'), ': llanta : bicicleta'] },
    { nivel: 3, titulo: 'El gorrión',
      enunciado: 'Pregunta 42 del simulacro, de analogías. ¿Qué par guarda la misma relación que el par base?',
      datos: [D_CLASE, D_PARTE, D_GRUPO],
      figura: fig(hoja(42, ['gorrión', 'ave'], ['pluma : paloma', 'puma : felino', 'paloma : bandada', 'nido : rama', 'cazador : escopeta'])),
      solucion: [
        { texto: [mala('A'), ': la pluma es una pieza de la paloma, es de ', prop('parte'), '. ', mala('C'), ': muchas palomas forman la bandada, es de ', prop('grupo'), '.'] },
        { texto: [mala('D'), ' es del ', prop('mismo tema'), '. ', mala('E'), ' es ', prop('otra relación'), '.'] },
        { texto: [buena('B'), ': ', cubre('todo puma es un felino'), ', como todo gorrión es un ave.'] }],
      respuesta: [buena('B'), ': puma : felino'] },
    { nivel: 3, titulo: 'El batallón',
      enunciado: 'Pregunta 43 del simulacro, de analogías. ¿Qué par guarda la misma relación que el par base?',
      datos: [D_CLASE, D_PARTE, D_GRUPO],
      figura: fig(hoja(43, ['soldado', 'batallón'], ['cañón : tanque', 'coronel : militar', 'oveja : rebaño', 'trinchera : guerra', 'piloto : nave'])),
      solucion: [
        { texto: [mala('A'), ': el cañón es una pieza del tanque, es de ', prop('parte'), '. ', mala('B'), ': todo coronel es un militar, es de ', prop('clase'), '.'] },
        { texto: [mala('D'), ' es del ', prop('mismo tema'), '. ', mala('E'), ' es ', prop('otra relación'), '.'] },
        { texto: [buena('C'), ': ', cubre('muchas ovejas iguales forman el rebaño'), ', como los soldados el batallón.'] }],
      respuesta: [buena('C'), ': oveja : rebaño'] },
    { nivel: 3, titulo: 'El pedal',
      enunciado: 'Pregunta 44 del simulacro, de analogías. ¿Qué par guarda la misma relación que el par base?',
      datos: [D_CLASE, D_PARTE, D_GRUPO],
      figura: fig(hoja(44, ['pedal', 'bicicleta'], ['triciclo : vehículo', 'ciclista : pelotón', 'pista : carrera', 'cuerda : guitarra', 'chofer : timón'])),
      solucion: [
        { texto: [mala('A'), ': todo triciclo es un vehículo, es de ', prop('clase'), '. ', mala('B'), ': muchos ciclistas forman el pelotón, es de ', prop('grupo'), '.'] },
        { texto: [mala('C'), ' es del ', prop('mismo tema'), '. ', mala('E'), ' es ', prop('otra relación'), '.'] },
        { texto: [buena('D'), ': la cuerda ', cubre('es una pieza de la guitarra'), ', como el pedal de la bicicleta.'] }],
      respuesta: [buena('D'), ': cuerda : guitarra'] },
    { nivel: 3, titulo: 'El durazno',
      enunciado: 'Pregunta 45 del simulacro, de analogías. ¿Qué par guarda la misma relación que el par base?',
      datos: [D_CLASE, D_PARTE, D_GRUPO, 'Olluco: planta andina que se come, como la papa.'],
      figura: fig(hoja(45, ['durazno', 'fruta'], ['pepa : palta', 'uva : racimo', 'cocinero : olla', 'mermelada : desayuno', 'olluco : tubérculo'])),
      solucion: [
        { texto: [mala('A'), ': la pepa es una pieza de la palta, es de ', prop('parte'), '. ', mala('B'), ': muchas uvas forman el racimo, es de ', prop('grupo'), '.'] },
        { texto: [mala('C'), ' es ', prop('otra relación'), '. ', mala('D'), ' es del ', prop('mismo tema'), '.'] },
        { texto: [buena('E'), ': ', cubre('todo olluco es un tubérculo'), ', como todo durazno es una fruta.'] }],
      respuesta: [buena('E'), ': olluco : tubérculo'] },
  ];

  const parteClase = {
    id: 'parte-o-clase',
    titulo: 'Clase o parte',
    pregunta: '¿El dedo es un tipo de mano o una parte de ella?',
    temas: ['Género y especie', 'Parte y todo', 'Elemento y conjunto'],
    pieza: 'rv-soporte',
    lee: {
      tarjetas: [
        { titulo: 'El cuaderno de Mateo', texto: 'Mateo copió cinco pares de su práctica de Comunicación. A cada uno le tiene que poner la oración puente que lo hace verdadero: si la primera palabra es un tipo de la segunda o una parte de ella.',
          pieza: 'rv-soporte', dibujo: { datos: cuad2(INI2), estado: {} } },
        { titulo: 'Un tipo de: la clase', texto: 'Todo gato es un animal: «animal» es la clase del gato, como el género próximo de una definición. Si la oración «todo… es un…» es verdadera, el par es de clase (género y especie).' },
        { titulo: 'Una parte de: la pieza', texto: 'La rueda no es una bicicleta: es una pieza de ella. La bicicleta tiene piezas distintas, como el timón, el asiento y las ruedas, que juntas la forman.' },
        { titulo: 'Qué mirar al jugar', texto: 'Toca un par en el cuaderno para cambiar su oración puente: «es un tipo de» o «es una parte de». Lee la oración entera y mira si es verdadera.' },
      ],
    },
    actividad: 'Ponerle a cada par del cuaderno de Mateo su oración puente: tipo o parte.',
    aprendizaje: 'Si todo cóndor es un ave, el ave es su clase; el pétalo no es una flor, es una pieza suya. Muchos iguales forman grupo.',
    ejemplos: EJEMPLOS_2,
    juega: {
      consigna: 'Mateo copió cinco pares en su cuaderno y les tiene que poner su oración puente: «es un tipo de» o «es una parte de».',
      mision: {
        texto: 'Ponle a cada par la oración puente que lo hace verdadero.',
        logrado: listo2,
        bien: 'Listo: tres son de clase y dos son de parte.',
      },
      voz: 'Toca un par y lee su oración entera: ¿es verdad?',
      leyenda: [
        { s: ':', t: 'se relaciona con' },
        { s: '¿…?', t: 'par sin oración puente todavía' },
        { s: cubre('turquesa'), t: 'oración verdadera' },
        { s: prop('naranja'), t: 'oración falsa' },
      ],
      controles: PARES2.map((p, k) => ({ id: c2(p), etiqueta: `Par ${k + 1}`, opciones: ETQ2.map((t, v) => ({ valor: v, texto: v ? t : 'sin elegir' })) })),
      dibujo: val => ({ datos: Object.assign({ toques: Object.fromEntries(PARES2.map(p => [p.id, c2(p)])) }, cuad2(val)), estado: est2(val) }),
      lectura: lectura2,
      minimo: 3,
    },
    predice: {
      pregunta: 'Par base: «ÁRBOL : BOSQUE». ¿Qué par guarda la misma relación? Las letras son las de la hoja.',
      voz: 'Elige antes de ver: después lo comprobamos con la oración puente.',
      datos: [D_CLASE, D_PARTE],
      orden: 'fijo',
      opciones: [
        { id: 'A', texto: 'eucalipto : planta', error: 'RVA2', siFuera: 'Todo eucalipto es una planta, bien; pero ningún árbol es un bosque: no es de clase.' },
        { id: 'b', texto: 'abeja : enjambre', correcta: true },
        { id: 'C', texto: 'hoja : rama', error: 'RVA6', siFuera: 'La hoja es una pieza de la rama; pero el bosque no tiene piezas de otro tipo: son puros árboles.' },
        { id: 'D', texto: 'leña : fogata', error: 'RV15', siFuera: 'Leña y fogata tienen que ver con el bosque, pero no se unen como árbol y bosque.' },
      ],
      dibujo: { datos: HOJA_BOSQUE, estado: {} },
      revelar: { datos: HOJA_BOSQUE, estado: estHoja(HOJA_BOSQUE, 'B') },
      coincide: 'Coincide: muchas abejas iguales forman el enjambre, como muchos árboles forman el bosque.',
    },
    mira: {
      datos: HOJA_BOSQUE,
      voz: 'Volvamos a la hoja, par por par.',
      pasos: [
        { estado: { senal: ['h1'], tachar: ['A'], nuevo: ['A'] }, texto: 'Todo eucalipto es una planta, pero ningún árbol es un bosque.',
          ecuacion: [mala('A'), ': ', prop('es de clase')] },
        { estado: { tachar: ['A', 'C'], nuevo: ['C'] }, texto: 'La hoja es una pieza de la rama; el bosque son puros árboles.',
          ecuacion: [mala('C'), ': ', prop('es de parte')] },
        { estado: { tachar: ['A', 'C', 'D'], nuevo: ['D'] }, texto: 'Leña y fogata son del tema del bosque, pero no se unen así.',
          ecuacion: [mala('D'), ': ', prop('mismo tema')] },
        { estado: Object.assign(estHoja(HOJA_BOSQUE, 'B'), { nuevo: ['B'] }), texto: 'Muchos árboles iguales forman el bosque; muchas abejas, el enjambre.',
          ecuacion: [buena('B'), ': ', cubre('uno de muchos iguales')] },
      ],
    },
    regla: {
      texto: 'Clase: todo cóndor es un ave. Parte: el pétalo es una pieza de la flor, que también tiene tallo y hojas. Grupo: el bosque está hecho solo de muchos árboles.',
      ecuacion: ['clase: ', { negrita: 'todo … es un …' }, '   ·   ', 'parte: ', { negrita: '… es una pieza de …' }, '   ·   ', 'grupo: ', { negrita: 'muchos … forman …' }],
      voz: 'Vuelve a esta regla cuando dudes con un par.',
      condicion: 'la oración puente se lee entera y es verdadera: «todo pétalo es una flor» es falsa.',
    },
    resuelve: {
      pieza: 'rv-soporte',
      generar(s) {
        const R = RESUELVE_2[s % RESUELVE_2.length];
        return {
          enunciado: `Pregunta ${R.sop.numero} del simulacro, de analogías. ¿Qué par de la hoja guarda la misma relación que el par base?`,
          datos: R.datos, dibujo: { datos: R.sop, estado: {} },
          pasos: [
            { tipo: 'pide', texto: 'Piden el par que se une como el par base: por clase, por parte o por grupo.' },
            { tipo: 'datos', texto: R.tengo },
            { tipo: 'regla', texto: 'Se prueban las tres oraciones: «todo… es un…», «… es una pieza de…» y «muchos… forman…». Solo una es verdadera con el par base.' },
            { tipo: 'aplica', texto: R.malas },
            { tipo: 'aplica', texto: R.bien, dibujo: { datos: R.sop, estado: estHoja(R.sop, R.buena) } },
            { tipo: 'sentido', texto: R.sentido },
          ],
          respuesta: [buena(R.buena), ': ', R.sop.alternativas.find(a => a.id === R.buena).t],
        };
      },
    },
    ahoraTu: {
      pieza: 'rv-soporte',
      voz: 'Otra hoja. Prueba las tres oraciones con el par base.',
      generar(s) {
        const A = AHORA_2[s % AHORA_2.length], sop = hoja(46 + (s % AHORA_2.length), A.b);
        return {
          pregunta: 'La hoja trae el par base. ¿Qué par guarda la misma relación?',
          datos: [D_CLASE, D_PARTE, D_GRUPO, ...(A.m.length > 3 ? [D_OTRAREL] : [])], dibujo: { datos: sinPie(sop), estado: {} },
          opciones: opciones(A.ok, voltear(A.m, s)),
          solucion: { texto: 'Cumple la misma oración puente que el par base.', ecuacion: [justo(A.ok)],
            dibujo: { datos: Object.assign(sinPie(sop), { frase: { etiqueta: 'Oración puente', t: A.puente } }), estado: { marcas: { frase: 'f' } } } },
        };
      },
    },
  };
  const mesaCuaderno = Object.assign({ id: 'cuaderno-mateo', titulo: 'El cuaderno de Mateo', pieza: 'rv-soporte' }, sinMision(parteClase.juega), {
    invitaciones: [
      { texto: 'Ponle «es un tipo de» a todos los pares y mira cuáles fallan.',
        logrado: val => PARES2.every(p => val[c2(p)] === 1),
        bien: 'El pétalo no es una flor ni el dedo una mano: son de parte.' },
      { texto: 'Deja bien solo las dos oraciones de parte; las demás, sin elegir.',
        logrado: val => PARES2.every(p => val[c2(p)] === (p.rel === 2 ? 2 : 0)),
        bien: 'El pétalo y el dedo son piezas distintas de un todo.' },
      { texto: 'Haz que todas las oraciones queden falsas.',
        logrado: val => PARES2.every(p => val[c2(p)] && val[c2(p)] !== p.rel),
        bien: 'Cada par cambia de oración: la clase no es la parte.' },
    ] });

  // ---------- Idea 3: el orden de la relación (conserva el id clase-y-causa; etapa 6) ----------
  // Cambia: si cada ficha del mural va así, al revés o tachada. Permanece: la ficha base «sismo : derrumbe» y su oración
  // puente. Progresa: de fichas desordenadas a cuatro en el orden del par base y la que no es de causa, tachada. Se
  // reserva: el par base que pone el efecto primero (humo : fuego), donde manda su orden y no «la causa primero»
  // (predicción). Debe verse: que la oración puente se lee en un solo sentido, y que venir antes no es producir.
  // Objeto de la primera pantalla: el mural de la feria de ciencias de 3.º B, con las fichas que el viento desordenó.
  // Colores: la ficha que cumple la oración en el orden del par base, i; la que no, o; lo tachado, gris; la respuesta, f.
  // Códigos: RV16 (al revés), RVA1 (sucesión tomada por causa), RV15 (mismo tema) y RV17 (otra relación).
  const D_CAUSA = 'Causa y efecto: una cosa produce la otra; la que produce es la causa.';
  const D_ORDEN = 'Mismo orden: lo que va primero en el par base va primero en el otro par.';
  const D_SUCESION = 'Sucesión: una cosa viene después de otra sin que la primera la produzca.';
  const FICHAS3 = [
    { id: 'f1', a: 'chispa', b: 'incendio', causa: 'a', rev: 'La chispa produce el incendio: así ya estaba bien', tacha: 'La chispa sí produce el incendio: no la taches' },
    { id: 'f2', a: 'moretón', b: 'golpe', causa: 'b', rev: 'El moretón no produce el golpe: está al revés', tacha: 'El golpe sí produce el moretón: dale la vuelta' },
    { id: 'f3', a: 'lunes', b: 'martes', causa: null, rev: 'El lunes no produce el martes: solo viene antes', tacha: '' },
    { id: 'f4', a: 'virus', b: 'fiebre', causa: 'a', rev: 'El virus produce la fiebre: así ya estaba bien', tacha: 'El virus sí produce la fiebre: no lo taches' },
    { id: 'f5', a: 'llanto', b: 'pena', causa: 'b', rev: 'El llanto no produce la pena: está al revés', tacha: 'La pena sí produce el llanto: dale la vuelta' },
  ];
  const BIEN3 = x => (x.causa === 'a' ? 0 : x.causa === 'b' ? 1 : 2);
  const PUENTE_SISMO = 'El sismo produce el derrumbe: el primero produce el segundo.';
  const mural3 = val => ({ soporte: 'mural', lugar: 'Mural de la feria de ciencias', frase: { etiqueta: 'Oración puente', t: PUENTE_SISMO }, hojas: [{ id: 'k', titulo: 'Causas y efectos', de: '3.º B', para: 'los visitantes',
    oraciones: [{ id: 'f0', t: 'SISMO : DERRUMBE ::' }, ...FICHAS3.map(x => ({ id: x.id, t: val[x.id] === 1 ? `${x.b} : ${x.a}` : `${x.a} : ${x.b}` }))] }] });
  const INI3 = Object.fromEntries(FICHAS3.map(x => [x.id, 0]));
  const cumple3 = (x, v) => (v === 0 && x.causa === 'a') || (v === 1 && x.causa === 'b');
  const listo3 = val => FICHAS3.every(x => val[x.id] === BIEN3(x));
  // Solo se marca la ficha que el alumno ya tocó (o todas, con la misión cumplida): al abrir, el color no delata cuáles
  // están al revés.
  const est3 = val => ({ marcas: Object.assign({ frase: 'i' }, Object.fromEntries(FICHAS3.filter(x => val[x.id] === 1 || (listo3(val) && val[x.id] !== 2)).map(x => [x.id, cumple3(x, val[x.id]) ? 'i' : 'o']))),
    tachar: FICHAS3.filter(x => val[x.id] === 2).map(x => x.id) });
  const lectura3 = val => {
    if (listo3(val)) return [justo('Justo'), ': cuatro fichas en el orden del par base'];
    // Solo habla de una ficha que el alumno ya tocó y quedó mal; si no, no adelanta cuál falta.
    const m = FICHAS3.find(x => val[x.id] !== 0 && val[x.id] !== BIEN3(x) && !(BIEN3(x) !== 2 && val[x.id] !== 2 && cumple3(x, val[x.id])));
    if (!m) return ['Prueba cada ficha en la oración puente'];
    return [prop(`${m.a} : ${m.b}`), ': ', val[m.id] === 2 ? m.tacha : m.rev];
  };
  const HOJA_HUMO = hoja(51, ['humo', 'fuego'], ['lluvia : barro', 'barro : lluvia', 'noche : día', 'leña : chimenea']);
  const RESUELVE_3 = [
    { sop: hoja(52, ['incendio', 'ceniza'], ['tos : resfrío', 'martes : miércoles', 'golpe : chichón', 'bombero : manguera', 'fósforo : leña']), buena: 'C',
      datos: [D_CAUSA, D_ORDEN, D_SUCESION, 'Chichón: bulto que se forma en la cabeza.'], tengo: 'El incendio produce la ceniza: el par base pone primero la causa.',
      malas: [mala('A'), ': el resfrío produce la tos, ', prop('al revés'), '. ', mala('B'), ': el martes no produce el miércoles, es ', prop('sucesión'), '. ', mala('D'), ' es ', prop('otra relación'), '. ', mala('E'), ' es del ', prop('mismo tema'), '.'],
      bien: [buena('C'), ': el golpe ', cubre('produce el chichón'), ': causa primero, como el par base.'],
      sentido: 'La oración «el primero produce el segundo» se lee igual con el par base y con el golpe.' },
    { sop: hoja(53, ['fiebre', 'infección'], ['otoño : invierno', 'ruido : silencio', 'pastilla : jarabe', 'calor : sudor', 'mareo : altura']), buena: 'E',
      datos: [D_CAUSA, D_ORDEN, D_SUCESION], tengo: 'La infección produce la fiebre: el par base pone primero el efecto.',
      malas: [mala('A'), ': el otoño no produce el invierno, es ', prop('sucesión'), '. ', mala('B'), ' es ', prop('otra relación'), '. ', mala('C'), ' es del ', prop('mismo tema'), '. ', mala('D'), ': el calor produce el sudor, causa primero, ', prop('al revés'), '.'],
      bien: [buena('E'), ': la altura ', cubre('produce el mareo'), ': efecto primero, como el par base.'],
      sentido: 'Con el efecto primero, la oración es «el segundo produce el primero», y vale para los dos pares.' },
    { sop: hoja(54, ['viento', 'ola'], ['frío : escalofrío', 'arena : playa', 'grieta : terremoto', 'enero : febrero', 'surfista : tabla']), buena: 'A',
      datos: [D_CAUSA, D_ORDEN, D_SUCESION], tengo: 'El viento produce la ola: el par base pone primero la causa.',
      malas: [mala('B'), ' es del ', prop('mismo tema'), '. ', mala('C'), ': el terremoto produce la grieta, ', prop('al revés'), '. ', mala('D'), ': enero no produce febrero, es ', prop('sucesión'), '. ', mala('E'), ' es ', prop('otra relación'), '.'],
      bien: [buena('A'), ': el frío ', cubre('produce el escalofrío'), ': causa primero, como el par base.'],
      sentido: 'El frío y el viento son de temas distintos; la relación y el orden son los mismos.' },
    { sop: hoja(55, ['quemadura', 'sol'], ['bloqueador : playa', 'rayo : trueno', 'mañana : tarde', 'caries : azúcar', 'pantalla : celular']), buena: 'D',
      datos: [D_CAUSA, D_ORDEN, D_SUCESION], tengo: 'El sol produce la quemadura: el par base pone primero el efecto.',
      malas: [mala('A'), ' es del ', prop('mismo tema'), '. ', mala('B'), ': el rayo produce el trueno, causa primero, ', prop('al revés'), '. ', mala('C'), ': la mañana no produce la tarde, es ', prop('sucesión'), '. ', mala('E'), ' es ', prop('otra relación'), '.'],
      bien: [buena('D'), ': el azúcar ', cubre('produce la caries'), ': efecto primero, como el par base.'],
      sentido: 'No importa qué va primero en el mundo: importa que vaya como en el par base.' },
  ];
  const AHORA_3 = [
    { b: ['estudio', 'aprobación'], ok: 'ejercicio : fuerza', puente: 'El ejercicio produce la fuerza: el primero produce el segundo.',
      m: [['cosecha : siembra', 'RV16', 'La siembra produce la cosecha, bien; pero aquí el efecto va primero: está al revés.'],
        ['jueves : viernes', 'RVA1', 'El viernes viene después del jueves, pero el jueves no lo produce.'],
        ['cuaderno : examen final', 'RV15', 'Son del mismo tema que el estudio, pero ninguno produce al otro.']] },
    { b: ['hambre', 'ayuno'], ok: 'sueño : desvelo', puente: 'El desvelo produce el sueño: el segundo produce el primero.',
      m: [['lluvia : inundación', 'RV16', 'La lluvia produce la inundación, bien; pero va la causa primero: al revés del par base.'],
        ['cena : desayuno', 'RVA1', 'El desayuno viene después de la cena, pero la cena no lo produce.'],
        ['plato : mesa', 'RV15', 'Son del mismo tema que el hambre, pero ninguno produce al otro.']] },
    { b: ['descuido', 'accidente'], ok: 'tormenta : apagón', puente: 'La tormenta produce el apagón: el primero produce el segundo.',
      m: [['cansancio : trabajo', 'RV16', 'El trabajo produce el cansancio, bien; pero aquí el efecto va primero: al revés.'],
        ['noche : madrugada', 'RVA1', 'La madrugada viene después de la noche, pero la noche no la produce.'],
        ['cinturón : auto', 'RV15', 'Son del mismo tema que el accidente, pero ninguno produce al otro.']] },
    { b: ['risa', 'chiste'], ok: 'humedad : lluvia', puente: 'La lluvia produce la humedad: el segundo produce el primero.',
      m: [['lluvia : charco', 'RV16', 'La lluvia produce el charco, bien; pero va la causa primero: al revés del par base.'],
        ['primavera : verano', 'RVA1', 'El verano viene después de la primavera, pero la primavera no lo produce.'],
        ['payaso : circo', 'RV15', 'Son del mismo tema que el chiste, pero ninguno produce al otro.']] },
    { b: ['viento', 'polvareda'], ok: 'helada : escarcha', puente: 'La helada produce la escarcha: el primero produce el segundo.', datos: ['Escarcha: hielo fino que cubre el pasto en las mañanas frías.'],
      m: [['mojadura : aguacero', 'RV16', 'El aguacero produce la mojadura, bien; pero aquí el efecto va primero: al revés.'],
        ['domingo : lunes', 'RVA1', 'El lunes viene después del domingo, pero el domingo no lo produce.'],
        ['cometa : cielo', 'RV15', 'Son del mismo tema que el viento, pero ninguno produce al otro.'],
        ['molino : aspa', 'RV17', 'El aspa es una pieza del molino: otra relación, no la de causa.']] },
    { b: ['tristeza', 'despedida'], ok: 'alegría : visita', puente: 'La visita produce la alegría: el segundo produce el primero.',
      m: [['fracaso : desánimo', 'RV16', 'El fracaso produce el desánimo, bien; pero va la causa primero: al revés del par base.'],
        ['ida : vuelta', 'RVA1', 'La vuelta viene después de la ida, pero la ida no la produce.'],
        ['pañuelo : lágrima', 'RV15', 'Son del mismo tema que la tristeza, pero ninguno produce al otro.'],
        ['cartero : carta', 'RV17', 'El cartero lleva la carta: otra relación, no la de causa.']] },
  ];
  const EJEMPLOS_3 = [
    { nivel: 1, titulo: '¿Quién produce a quién?',
      enunciado: 'En el par «trueno : rayo», ¿cuál es la causa y cuál el efecto?',
      datos: [D_CAUSA],
      figura: fig(papel('mensaje', 'Familias de 4.º A', null, 'el tutor', 'familias de 4.º A', ['Si hay rayos y truenos, los chicos esperan en el aula.'])),
      solucion: [{ texto: ['El rayo ', cubre('produce el trueno'), ': el rayo es la causa y el trueno, el efecto. El par pone primero el efecto.'] }],
      respuesta: [justo('El rayo es la causa'), '; el trueno, el efecto'] },
    { nivel: 1, titulo: 'Venir antes no basta',
      enunciado: '¿El par «amanecer : mediodía» es de causa y efecto?',
      datos: [D_CAUSA, D_SUCESION],
      figura: fig(cuaderno('Cuaderno de Diego', 'Pares de la práctica', 'Diego', 'la clase de Comunicación', ['amanecer : mediodía'])),
      solucion: [{ texto: ['El mediodía viene después del amanecer, pero el amanecer no lo produce: es ', prop('sucesión'), '.'] }],
      respuesta: [justo('No'), ': solo viene antes'] },
    { nivel: 1, titulo: 'La fogata',
      enunciado: '¿El par «humo : fogata» cumple la oración «el primero produce el segundo»?',
      datos: [D_CAUSA, D_ORDEN],
      figura: fig(papel('cartel', 'Cartel del campamento', 'Normas del campamento', 'los guías', 'los campistas', ['Apaguen la fogata antes de dormir.'])),
      solucion: [{ texto: ['No: la fogata produce el humo. La oración se cumple ', prop('al revés'), ': «el segundo produce el primero».'] }],
      respuesta: [justo('No'), ': está al revés'] },
    { nivel: 1, titulo: 'El orden del par base',
      enunciado: 'Par base: «grieta : sismo». ¿Qué va primero en este par, la causa o el efecto?',
      datos: [D_CAUSA, D_ORDEN],
      figura: fig(papel('mural', 'Mural del colegio', 'Simulacro de sismo', 'Defensa Civil del colegio', 'estudiantes y docentes', ['El viernes hay simulacro de sismo a las 10.'])),
      solucion: [{ texto: ['El sismo produce la grieta: la grieta es el efecto, y ', cubre('va primero'), '. El par análogo también pondrá primero el efecto.'] }],
      respuesta: [justo('El efecto va primero')] },
    { nivel: 1, titulo: 'El apagón',
      enunciado: '¿Qué oración puente une el par «apagón : oscuridad»?',
      datos: [D_CAUSA],
      figura: fig(papel('mensaje', 'Vecinos de la cuadra 5', null, 'la junta vecinal', 'los vecinos', ['Hoy habrá apagón de 8 a 10 de la noche.'])),
      solucion: [{ texto: ['El apagón ', cubre('produce la oscuridad'), ': el primero es la causa y el segundo, el efecto.'] }],
      respuesta: [justo('El apagón produce la oscuridad')] },

    { nivel: 2, titulo: 'El terremoto',
      enunciado: 'Par base: «terremoto : grieta». ¿Qué par guarda su relación: «sed : calor», «víspera : fiesta patronal» o «choque : abolladura»?',
      datos: [D_CAUSA, D_ORDEN, D_SUCESION],
      figura: fig(cuaderno('Cuaderno de Rosa', 'Analogías', 'Rosa', 'la práctica de Comunicación', ['terremoto : grieta'])),
      solucion: [
        { texto: ['El calor produce la sed: «sed : calor» está ', prop('al revés'), '. La víspera no produce la fiesta: es ', prop('sucesión'), '.'] },
        { texto: ['El choque ', cubre('produce la abolladura'), ': causa primero, como el par base.'] }],
      respuesta: [justo('«Choque : abolladura»')] },
    { nivel: 2, titulo: 'El fuego quema',
      enunciado: 'Par base: «moho : humedad». ¿Qué par guarda su relación: «quemadura : fuego», «calor : sudor» o «toalla : ropa mojada»?',
      datos: [D_CAUSA, D_ORDEN],
      figura: fig(papel('cartel', 'Cartel de la cocina del comedor', 'Cuidado en la cocina', 'el comedor escolar', 'las cocineras', ['Seque bien las paredes: la humedad trae moho.'])),
      solucion: [
        { texto: ['El calor produce el sudor: causa primero, ', prop('al revés'), ' del par base. Toalla y ropa mojada son del ', prop('mismo tema'), '.'] },
        { texto: ['El fuego ', cubre('produce la quemadura'), ': efecto primero, como el moho y la humedad.'] }],
      respuesta: [justo('«Quemadura : fuego»')] },
    { nivel: 2, titulo: 'La caminata',
      enunciado: 'Par base: «esfuerzo : cansancio». ¿Qué par guarda su relación: «mañana : tarde», «caminata : ampolla» o «ampolla : zapato apretado»?',
      datos: [D_CAUSA, D_ORDEN, D_SUCESION],
      figura: fig(papel('mensaje', 'Promoción 2027', null, 'el delegado', 'la promoción', ['El sábado subimos al mirador: traigan zapatillas cómodas.'])),
      solucion: [
        { texto: ['La mañana no produce la tarde: es ', prop('sucesión'), '. El zapato apretado produce la ampolla: efecto primero, ', prop('al revés'), '.'] },
        { texto: ['La caminata ', cubre('produce la ampolla'), ': causa primero, como el par base.'] }],
      respuesta: [justo('«Caminata : ampolla»')] },
    { nivel: 2, titulo: 'La picadura',
      enunciado: 'Par base: «virus : resfrío». ¿Qué par guarda su relación: «ola : viento», «termómetro : sala de espera» o «zancudo : picadura»?',
      datos: [D_CAUSA, D_ORDEN],
      figura: fig(papel('mural', 'Mural del puesto de salud', 'Cuide su salud', 'el puesto de salud', 'los vecinos', ['El resfrío lo causa un virus.'])),
      solucion: [
        { texto: ['El viento produce la ola: efecto primero, ', prop('al revés'), '. Termómetro y sala de espera son del ', prop('mismo tema'), '.'] },
        { texto: ['El zancudo ', cubre('produce la picadura'), ': causa primero, como el par base.'] }],
      respuesta: [justo('«Zancudo : picadura»')] },
    { nivel: 2, titulo: 'La cicatriz',
      enunciado: 'Par base: «cicatriz : herida». ¿Qué par guarda su relación: «charco : lluvia», «sol : sombra» o «noche : amanecer»?',
      datos: [D_CAUSA, D_ORDEN, D_SUCESION],
      figura: fig(cuaderno('Cuaderno de Mateo', 'Analogías', 'Mateo', 'el simulacro del sábado', ['cicatriz : herida'])),
      solucion: [
        { texto: ['El sol produce la sombra: causa primero, ', prop('al revés'), '. La noche no produce el amanecer: es ', prop('sucesión'), '.'] },
        { texto: ['La lluvia ', cubre('produce el charco'), ': efecto primero, como la cicatriz y la herida.'] }],
      respuesta: [justo('«Charco : lluvia»')] },

    { nivel: 3, titulo: 'La mentira',
      enunciado: 'Pregunta 56 del simulacro, de analogías. ¿Qué par guarda la misma relación que el par base?',
      datos: [D_CAUSA, D_ORDEN, D_SUCESION],
      figura: fig(hoja(56, ['mentira', 'desconfianza'], ['ayuda : gratitud', 'castigo : travesura', 'ayer : hoy', 'amigo : secreto', 'juez : martillo'])),
      solucion: [
        { texto: [mala('B'), ': la travesura produce el castigo, ', prop('al revés'), '. ', mala('C'), ': ayer no produce hoy, es ', prop('sucesión'), '.'] },
        { texto: [mala('D'), ' es del ', prop('mismo tema'), '. ', mala('E'), ' es ', prop('otra relación'), '.'] },
        { texto: [buena('A'), ': la ayuda ', cubre('produce la gratitud'), ': causa primero, como el par base.'] }],
      respuesta: [buena('A'), ': ayuda : gratitud'] },
    { nivel: 3, titulo: 'La inundación',
      enunciado: 'Pregunta 57 del simulacro, de analogías. ¿Qué par guarda la misma relación que el par base?',
      datos: [D_CAUSA, D_ORDEN, D_SUCESION],
      figura: fig(hoja(57, ['inundación', 'lluvia'], ['sol : sequía', 'incendio : chispa', 'enero : febrero', 'paraguas : botas de jebe', 'gota : nube'])),
      solucion: [
        { texto: [mala('A'), ': el sol produce la sequía, causa primero, ', prop('al revés'), '. ', mala('C'), ': enero no produce febrero, es ', prop('sucesión'), '.'] },
        { texto: [mala('D'), ' es del ', prop('mismo tema'), '. ', mala('E'), ' es ', prop('otra relación'), '.'] },
        { texto: [buena('B'), ': la chispa ', cubre('produce el incendio'), ': efecto primero, como el par base.'] }],
      respuesta: [buena('B'), ': incendio : chispa'] },
    { nivel: 3, titulo: 'La polilla',
      enunciado: 'Pregunta 58 del simulacro, de analogías. ¿Qué par guarda la misma relación que el par base?',
      datos: [D_CAUSA, D_ORDEN, D_SUCESION, 'Polilla: insecto pequeño que come la lana y la ropa guardada.'],
      figura: fig(hoja(58, ['humedad', 'moho'], ['óxido : lluvia', 'tarde : noche', 'polilla : agujero', 'pared : baño', 'albañil : badilejo'])),
      solucion: [
        { texto: [mala('A'), ': la lluvia produce el óxido, efecto primero, ', prop('al revés'), '. ', mala('B'), ': la tarde no produce la noche, es ', prop('sucesión'), '.'] },
        { texto: [mala('D'), ' es del ', prop('mismo tema'), '. ', mala('E'), ' es ', prop('otra relación'), '.'] },
        { texto: [buena('C'), ': la polilla ', cubre('produce el agujero'), ': causa primero, como el par base.'] }],
      respuesta: [buena('C'), ': polilla : agujero'] },
    { nivel: 3, titulo: 'La victoria',
      enunciado: 'Pregunta 59 del simulacro, de analogías. ¿Qué par guarda la misma relación que el par base?',
      datos: [D_CAUSA, D_ORDEN, D_SUCESION],
      figura: fig(hoja(59, ['alegría', 'victoria'], ['derrota : tristeza', 'gol : arco', 'hoy : mañana', 'miedo : trueno', 'jugador : equipo'])),
      solucion: [
        { texto: [mala('A'), ': la derrota produce la tristeza, causa primero, ', prop('al revés'), '. ', mala('C'), ': hoy no produce mañana, es ', prop('sucesión'), '.'] },
        { texto: [mala('B'), ' es del ', prop('mismo tema'), '. ', mala('E'), ' es ', prop('otra relación'), '.'] },
        { texto: [buena('D'), ': el trueno ', cubre('produce el miedo'), ': efecto primero, como el par base.'] }],
      respuesta: [buena('D'), ': miedo : trueno'] },
    { nivel: 3, titulo: 'El rayo',
      enunciado: 'Pregunta 60 del simulacro, de analogías. ¿Qué par guarda la misma relación que el par base?',
      datos: [D_CAUSA, D_ORDEN, D_SUCESION],
      figura: fig(hoja(60, ['rayo', 'incendio'], ['cenizas : fogata', 'tarde : anochecer', 'bombero : extintor', 'nube : cielo', 'roce : ampolla'])),
      solucion: [
        { texto: [mala('A'), ': la fogata produce las cenizas, efecto primero, ', prop('al revés'), '. ', mala('B'), ': la tarde no produce el anochecer, es ', prop('sucesión'), '.'] },
        { texto: [mala('C'), ' es ', prop('otra relación'), '. ', mala('D'), ' es del ', prop('mismo tema'), '.'] },
        { texto: [buena('E'), ': el roce ', cubre('produce la ampolla'), ': causa primero, como el par base.'] }],
      respuesta: [buena('E'), ': roce : ampolla'] },
  ];

  const claseCausa = {
    id: 'clase-y-causa',
    titulo: 'El orden de la relación',
    pregunta: '¿Da lo mismo «humo : fuego» que «fuego : humo»?',
    temas: ['Causa y efecto'],
    pieza: 'rv-soporte',
    lee: {
      tarjetas: [
        { titulo: 'Las fichas de la feria', texto: 'Para la feria de ciencias, 3.º B pegó en el mural fichas de causa y efecto, junto a la ficha base. El viento desordenó algunas: unas quedaron al revés y otra no debía estar.',
          pieza: 'rv-soporte', dibujo: { datos: mural3(INI3), estado: { marcas: { frase: 'i' } } } },
        { titulo: 'Causa y efecto', texto: 'En «sismo : derrumbe», el sismo produce el derrumbe: el primero es la causa y el segundo, el efecto. Al revés, la oración es falsa: el derrumbe no produce el sismo.' },
        { titulo: 'El orden se copia', texto: 'La oración puente se arma con el par base, en su orden. Al probar otro par, su primera palabra va donde iba la primera del par base, y la segunda, donde iba la segunda.' },
        { titulo: 'Qué mirar al jugar', texto: 'Toca una ficha para darle la vuelta. Tócala otra vez para tacharla, y una vez más para dejarla como estaba. Lee la oración puente con cada ficha.' },
      ],
    },
    actividad: 'Dar vuelta las fichas que quedaron al revés y tachar la que no es de causa.',
    aprendizaje: 'La relación tiene dirección: el par análogo va en el orden del par base, aunque ponga el efecto primero. Venir después no es ser efecto.',
    ejemplos: EJEMPLOS_3,
    juega: {
      consigna: 'El viento desordenó las fichas de causa y efecto del mural de 3.º B. Hay que dejarlas como la ficha base.',
      mision: {
        texto: 'Pon cada ficha en el orden del par base; tacha la que no es de causa.',
        logrado: listo3,
        bien: 'Listo: cuatro fichas en el orden del par base y el lunes, tachado.',
      },
      voz: 'Lee cada ficha en la oración puente: ¿el primero produce el segundo?',
      leyenda: [
        { s: ':', t: 'se relaciona con' },
        { s: cubre('turquesa'), t: 'ficha que cumple la oración puente' },
        { s: prop('naranja'), t: 'ficha que no la cumple así' },
        { s: 'tachado', t: 'ficha que descartaste' },
      ],
      controles: FICHAS3.map((x, k) => ({ id: x.id, etiqueta: `Ficha ${k + 2}`, opciones: [{ valor: 0, texto: 'así' }, { valor: 1, texto: 'al revés' }, { valor: 2, texto: 'tachar' }] })),
      dibujo: val => ({ datos: Object.assign({ toques: Object.fromEntries(FICHAS3.map(x => [x.id, x.id])) }, mural3(val)), estado: est3(val) }),
      lectura: lectura3,
      minimo: 3,
    },
    predice: {
      pregunta: 'Par base: «HUMO : FUEGO». ¿Qué par guarda la misma relación, en el mismo orden? Las letras son las de la hoja.',
      voz: 'Elige antes de ver: después lo comprobamos con la oración puente.',
      orden: 'fijo',
      opciones: [
        { id: 'A', texto: 'lluvia : barro', error: 'RV16', siFuera: 'La lluvia produce el barro, bien visto; pero el par base pone el efecto primero.' },
        { id: 'b', texto: 'barro : lluvia', correcta: true },
        { id: 'C', texto: 'noche : día', error: 'RVA1', siFuera: 'El día viene después de la noche, pero la noche no lo produce.' },
        { id: 'D', texto: 'leña : chimenea', error: 'RV15', siFuera: 'Leña y chimenea van con el fuego, pero ninguna produce a la otra.' },
      ],
      dibujo: { datos: HOJA_HUMO, estado: {} },
      revelar: { datos: HOJA_HUMO, estado: estHoja(HOJA_HUMO, 'B') },
      coincide: 'Coincide: el barro es efecto de la lluvia, como el humo es efecto del fuego: primero el efecto.',
    },
    mira: {
      datos: HOJA_HUMO,
      voz: 'Volvamos a la hoja, par por par.',
      pasos: [
        { estado: { senal: ['h1'], nuevo: ['h1'] }, texto: 'El par base pone primero el efecto: el fuego produce el humo.',
          ecuacion: [cubre('efecto'), ' : ', cubre('causa')] },
        { estado: { tachar: ['C'], nuevo: ['C'] }, texto: 'La noche no produce el día: solo viene antes.',
          ecuacion: [mala('C'), ': ', prop('sucesión')] },
        { estado: { tachar: ['C', 'D'], nuevo: ['D'] }, texto: 'Leña y chimenea van con el fuego, pero ninguna produce a la otra.',
          ecuacion: [mala('D'), ': ', prop('mismo tema')] },
        { estado: { tachar: ['C', 'D', 'A'], nuevo: ['A'] }, texto: 'La lluvia produce el barro, pero aquí va la causa primero.',
          ecuacion: [mala('A'), ': ', prop('al revés')] },
        { estado: Object.assign(estHoja(HOJA_HUMO, 'B'), { nuevo: ['B'] }), texto: 'La lluvia produce el barro: efecto primero, como el par base.',
          ecuacion: [buena('B'), ': ', cubre('mismo orden')] },
      ],
    },
    regla: {
      texto: 'La relación tiene dirección: el par análogo va en el orden del par base, aunque ponga el efecto primero. Venir después no es ser efecto.',
      ecuacion: [{ llave: [{ negrita: 'mismo orden' }], nota: 'el del par base' }, '   ·   ', { llave: [{ negrita: 'venir después' }], nota: 'no es ser efecto' }],
      voz: 'Vuelve a esta regla cuando dudes con un par.',
      condicion: 'la oración puente se arma con el par base en su orden, y con el otro par se lee igual.',
    },
    resuelve: {
      pieza: 'rv-soporte',
      generar(s) {
        const R = RESUELVE_3[s % RESUELVE_3.length];
        return {
          enunciado: `Pregunta ${R.sop.numero} del simulacro, de analogías. ¿Qué par de la hoja guarda la misma relación que el par base?`,
          datos: R.datos, dibujo: { datos: R.sop, estado: {} },
          pasos: [
            { tipo: 'pide', texto: 'Piden el par con la misma relación que el par base, y en el mismo orden.' },
            { tipo: 'datos', texto: R.tengo },
            { tipo: 'regla', texto: 'La oración puente se arma con el par base en su orden. El par al revés no la cumple, y venir antes no es producir.' },
            { tipo: 'aplica', texto: R.malas },
            { tipo: 'aplica', texto: R.bien, dibujo: { datos: R.sop, estado: estHoja(R.sop, R.buena) } },
            { tipo: 'sentido', texto: R.sentido },
          ],
          respuesta: [buena(R.buena), ': ', R.sop.alternativas.find(a => a.id === R.buena).t],
        };
      },
    },
    ahoraTu: {
      pieza: 'rv-soporte',
      voz: 'Otra hoja. Mira qué produce a qué, y en qué orden.',
      generar(s) {
        const A = AHORA_3[s % AHORA_3.length], sop = hoja(61 + (s % AHORA_3.length), A.b);
        return {
          pregunta: 'La hoja trae el par base. ¿Qué par guarda la misma relación, en el mismo orden?',
          datos: [D_CAUSA, D_ORDEN, D_SUCESION, ...(A.datos || []), ...(A.m.length > 3 ? [D_OTRAREL] : [])], dibujo: { datos: sinPie(sop), estado: {} },
          opciones: opciones(A.ok, voltear(A.m, s)),
          solucion: { texto: 'Cumple la misma oración puente que el par base, en el mismo orden.', ecuacion: [justo(A.ok)],
            dibujo: { datos: Object.assign(sinPie(sop), { frase: { etiqueta: 'Oración puente', t: A.puente } }), estado: { marcas: { frase: 'f' } } } },
        };
      },
    },
  };
  const mesaFichas = Object.assign({ id: 'fichas-feria', titulo: 'Las fichas de la feria', pieza: 'rv-soporte' }, sinMision(claseCausa.juega), {
    invitaciones: [
      { texto: 'Dale la vuelta a todas las fichas y mira cuáles quedan bien.',
        logrado: val => FICHAS3.every(x => val[x.id] === 1),
        bien: 'Al revés quedan bien solo las que estaban con el efecto primero.' },
      { texto: 'Tacha solo la ficha que no es de causa; deja las demás así.',
        logrado: val => FICHAS3.every(x => val[x.id] === (x.causa ? 0 : 2)),
        bien: 'El lunes no produce el martes; las otras sí son de causa.' },
      { texto: 'Haz que ninguna ficha cumpla la oración puente, sin tachar ninguna.',
        logrado: val => FICHAS3.every(x => val[x.id] !== 2 && !cumple3(x, val[x.id])),
        bien: 'Cada ficha de causa, al revés, deja de cumplirla.' },
    ] });

  // ---------- Idea 4: sinónimos y antónimos en un rasgo (conserva su id; etapa 6) ----------
  // Cambia: la relación que el alumno le pone a cada par del cuaderno de Rosa. Permanece: «alegre» y sus cuatro palabras.
  // Progresa: de cuatro pares sin relación a cuatro con la suya. Se reserva: la intensidad (tibio : caliente), dos
  // palabras del mismo rasgo y del mismo lado, una más fuerte (predicción). Debe verse: que «cansado» es distinto de
  // «alegre» y no es su contrario: habla de otro rasgo.
  // Colores: la relación bien puesta, i; la mal puesta, o; la respuesta de la predicción, f.
  // Códigos: RV17 (sinónimo por antónimo o al revés), RV21 (otro rasgo), RVA3 (un grado tomado por opuesto o por
  // sinónimo), RV16 (el grado al revés) y RV15 (mismo tema).
  const D_SIN = 'Sinónimos: dicen casi lo mismo del mismo rasgo.';
  const D_ANT = 'Antónimos: dicen lo opuesto del mismo rasgo.';
  const D_OTRO = 'Otro rasgo: dos palabras que hablan de cosas distintas no son sinónimos ni antónimos.';
  const D_GRADO = 'Intensidad: las dos dicen lo mismo de un rasgo, pero una en mayor grado (más fuerte, más grande).';
  const ETQ4 = ['¿…?', 'sinónimos', 'antónimos', 'otro rasgo'];
  const W4 = [
    { id: 'w1', w: 'contento', rel: 1, por: { 2: '«contento» dice lo mismo del ánimo, no lo contrario', 3: '«contento» habla del ánimo, como «alegre»' } },
    { id: 'w2', w: 'triste', rel: 2, por: { 1: '«triste» dice lo contrario del ánimo', 3: '«triste» habla del ánimo, como «alegre»' } },
    { id: 'w3', w: 'cansado', rel: 3, por: { 1: '«cansado» habla de la energía, no del ánimo', 2: '«cansado» habla de la energía, no del ánimo' } },
    { id: 'w4', w: 'risueño', rel: 1, por: { 2: '«risueño» dice lo mismo del ánimo, no lo contrario', 3: '«risueño» habla del ánimo, como «alegre»' } },
  ];
  const c4 = x => x.id.replace('w', 'r');
  const cuad4 = val => ({ soporte: 'cuaderno', lugar: 'Cuaderno de Rosa', hojas: [{ id: 'k', titulo: 'Palabras para «alegre»', de: 'Rosa', para: 'la práctica de Comunicación',
    oraciones: W4.map(x => ({ id: x.id, t: `alegre : ${x.w} → ${ETQ4[val[c4(x)] || 0]}` })) }] });
  const INI4 = Object.fromEntries(W4.map(x => [c4(x), 0]));
  const listo4 = val => W4.every(x => val[c4(x)] === x.rel);
  const est4 = val => ({ marcas: Object.fromEntries(W4.filter(x => val[c4(x)]).map(x => [x.id, val[c4(x)] === x.rel ? 'i' : 'o'])) });
  const lectura4 = val => {
    if (listo4(val)) return [justo('Justo'), ': dos sinónimos, un antónimo y otro rasgo'];
    const m = W4.find(x => val[c4(x)] && val[c4(x)] !== x.rel);
    if (m) return [prop(`alegre : ${m.w}`), ': ', m.por[val[c4(m)]]];
    return ['Piensa de qué rasgo habla cada palabra'];
  };
  const HOJA_TIBIO = hoja(71, ['tibio', 'caliente'], ['pobre : rico', 'aguacero : llovizna', 'termómetro : enfermera', 'llovizna : aguacero']);
  const RESUELVE_4 = [
    { sop: hoja(72, ['valiente', 'cobarde'], ['veloz : rápido', 'generoso : tacaño', 'fuerte : callado', 'temor : pánico', 'héroe : batalla final']), buena: 'B',
      datos: [D_SIN, D_ANT, D_OTRO, D_GRADO], tengo: 'Valiente y cobarde hablan del mismo rasgo, el valor, y dicen lo opuesto: son antónimos.',
      malas: [mala('A'), ' son ', prop('sinónimos'), '. ', mala('C'), ' hablan de ', prop('otro rasgo'), '. ', mala('D'), ': pánico dice más que temor, es ', prop('intensidad'), '. ', mala('E'), ' es del ', prop('mismo tema'), '.'],
      bien: [buena('B'), ': generoso y tacaño ', cubre('dicen lo opuesto del mismo rasgo'), '.'],
      sentido: 'Valor y generosidad son rasgos distintos, pero en los dos pares hay opuestos.' },
    { sop: hoja(73, ['lento', 'pausado'], ['ágil : torpe', 'bajo : pesado', 'caracol : tortuga terrestre', 'callado : silencioso', 'grande : gigante']), buena: 'D',
      datos: [D_SIN, D_ANT, D_OTRO, D_GRADO], tengo: 'Lento y pausado dicen casi lo mismo de la rapidez: son sinónimos.',
      malas: [mala('A'), ' son ', prop('antónimos'), '. ', mala('B'), ' hablan de ', prop('otro rasgo'), '. ', mala('C'), ' es del ', prop('mismo tema'), '. ', mala('E'), ': gigante dice más que grande, es ', prop('intensidad'), '.'],
      bien: [buena('D'), ': callado y silencioso ', cubre('dicen casi lo mismo'), ' de un rasgo.'],
      sentido: 'Si gigante y grande fueran sinónimos, «un perro gigante» sería solo «un perro grande».' },
    { sop: hoja(74, ['brisa', 'ventarrón'], ['charco : laguna', 'calma : tormenta', 'laguna : charco', 'cometa : cielo', 'risa : sueño']), buena: 'A',
      datos: [D_SIN, D_ANT, D_OTRO, D_GRADO, D_ORDEN], tengo: 'Brisa y ventarrón hablan del viento; el ventarrón es mucho más fuerte: es intensidad, de menos a más.',
      malas: [mala('B'), ' son ', prop('antónimos'), '. ', mala('C'), ' va de más a menos: ', prop('al revés'), '. ', mala('D'), ' es del ', prop('mismo tema'), '. ', mala('E'), ' hablan de ', prop('otro rasgo'), '.'],
      bien: [buena('A'), ': la laguna ', cubre('es mucho más grande que el charco'), ': de menos a más.'],
      sentido: 'La brisa y el ventarrón no son opuestos: los dos son viento, uno con más fuerza.' },
    { sop: hoja(75, ['ardiente', 'caliente'], ['tibio : hirviendo', 'seco : mojado', 'fogón : cocina de leña', 'alto : pesado', 'furioso : enojado']), buena: 'E',
      datos: [D_SIN, D_ANT, D_OTRO, D_GRADO, D_ORDEN], tengo: 'Ardiente dice más que caliente: es intensidad, de más a menos.',
      malas: [mala('A'), ' va de menos a más: ', prop('al revés'), '. ', mala('B'), ' son ', prop('antónimos'), '. ', mala('C'), ' es del ', prop('mismo tema'), '. ', mala('D'), ' hablan de ', prop('otro rasgo'), '.'],
      bien: [buena('E'), ': furioso ', cubre('dice más que enojado'), ': de más a menos, como el par base.'],
      sentido: 'También en la intensidad manda el orden: primero el más fuerte, como en el par base.' },
  ];
  const AHORA_4 = [
    { b: ['ancho', 'angosto'], ok: 'dulce : amargo', puente: 'Dulce y amargo dicen lo opuesto del sabor.',
      m: [['amplio : extenso', 'RV17', 'Hablan del mismo rasgo, bien; pero dicen casi lo mismo: serían sinónimos.'],
        ['largo : rojo', 'RV21', 'Son distintas, pero hablan de rasgos distintos: no son opuestas.'],
        ['calle : avenida', 'RV15', 'Son del mismo tema que el ancho de una vía, pero no son opuestas.']] },
    { b: ['feliz', 'dichoso'], ok: 'bello : hermoso', puente: 'Bello y hermoso dicen casi lo mismo de la belleza.',
      m: [['fuerte : débil', 'RV17', 'Hablan del mismo rasgo, bien; pero dicen lo opuesto: serían antónimos.'],
        ['hambriento : rico', 'RV21', 'Son distintas y hablan de rasgos distintos: no son sinónimos.'],
        ['fiesta : regalo', 'RV15', 'Son del mismo tema que la alegría, pero no dicen lo mismo de un rasgo.']] },
    { b: ['garúa', 'diluvio'], ok: 'susurro : grito', puente: 'El grito dice mucho más fuerte lo que dice el susurro: de menos a más.', datos: ['Garúa: lluvia muy fina. Diluvio: lluvia muy fuerte y larga.'],
      m: [['mojado : seco', 'RVA3', 'Hablan del mismo rasgo, bien; pero son opuestos, no un grado de menos a más.'],
        ['grito : murmullo', 'RV16', 'Es intensidad, bien; pero va de más a menos: al revés del par base.'],
        ['nube : paraguas', 'RV15', 'Son del mismo tema que la lluvia, pero no son un grado.']] },
    { b: ['enorme', 'grande'], ok: 'agotado : cansado', puente: 'Agotado dice más que cansado: de más a menos.',
      m: [['tibio : ardiente', 'RV16', 'Es intensidad, bien; pero va de menos a más: al revés del par base.'],
        ['gigante : enano', 'RVA3', 'Hablan del tamaño, bien; pero son opuestos, no un grado.'],
        ['elefante : sabana africana', 'RV15', 'Son del mismo tema que el tamaño, pero no son un grado.']] },
    { b: ['honesto', 'sincero'], ok: 'astuto : sagaz', puente: 'Astuto y sagaz dicen casi lo mismo de la viveza.',
      m: [['leal : traidor', 'RV17', 'Hablan del mismo rasgo, bien; pero dicen lo opuesto: serían antónimos.'],
        ['veloz : amable', 'RV21', 'Son distintas y hablan de rasgos distintos: no son sinónimos.'],
        ['bueno : excelente', 'RVA3', 'Hablan del mismo rasgo, bien; pero «excelente» dice más: es intensidad.'],
        ['juez : verdad', 'RV15', 'Son del mismo tema que la honestidad, pero no dicen lo mismo de un rasgo.']] },
    { b: ['despierto', 'dormido'], ok: 'vivo : muerto', puente: 'Vivo y muerto dicen lo opuesto del mismo rasgo.',
      m: [['feliz : contento', 'RV17', 'Hablan del mismo rasgo, bien; pero dicen casi lo mismo: serían sinónimos.'],
        ['rico : flaco', 'RV21', 'Son distintas, pero hablan de rasgos distintos: no son opuestas.'],
        ['triste : desolado', 'RVA3', 'Hablan del mismo rasgo, bien; pero «desolado» dice más: es intensidad.'],
        ['cama : almohada', 'RV15', 'Son del mismo tema que el sueño, pero no son opuestas.']] },
  ];
  const EJEMPLOS_4 = [
    { nivel: 1, titulo: 'De qué habla',
      enunciado: '¿De qué rasgo hablan «grueso» y «delgado», y cómo se unen?',
      datos: [D_SIN, D_ANT],
      figura: fig(cuaderno('Cuaderno de Rosa', 'Palabras de la semana', 'Rosa', 'la práctica de Comunicación', ['grueso : delgado'])),
      solucion: [{ texto: ['Las dos hablan del grosor y dicen lo opuesto: son ', cubre('antónimos'), '.'] }],
      respuesta: [justo('Del grosor'), ': son antónimos'] },
    { nivel: 1, titulo: 'Casi lo mismo',
      enunciado: '¿«Delgado» y «flaco» son sinónimos o antónimos?',
      datos: [D_SIN, D_ANT],
      figura: fig(cuaderno('Cuaderno de Diego', 'Pares de la práctica', 'Diego', 'la clase de Comunicación', ['delgado : flaco'])),
      solucion: [{ texto: ['Las dos dicen casi lo mismo del cuerpo: son ', cubre('sinónimos'), '.'] }],
      respuesta: [justo('Sinónimos')] },
    { nivel: 1, titulo: 'Distintas no es opuestas',
      enunciado: '¿«Rico» es un antónimo de «alto»?',
      datos: [D_ANT, D_OTRO],
      figura: fig(cuaderno('Cuaderno de Mateo', 'Antónimos', 'Mateo', 'la práctica de Comunicación', ['rico : alto'])),
      solucion: [{ texto: ['«Rico» habla del dinero y «alto», de la estatura: hablan de ', prop('otro rasgo'), '. Distintas no es opuestas.'] }],
      respuesta: [justo('No'), ': hablan de rasgos distintos'] },
    { nivel: 1, titulo: 'Más fuerza',
      enunciado: '¿«Cansado» y «exhausto» son sinónimos, o una dice más que la otra?',
      datos: [D_SIN, D_GRADO],
      figura: fig(papel('mensaje', 'Promoción 2027', null, 'la delegada', 'la promoción', ['Después del ensayo de la danza quedamos exhaustos.'])),
      solucion: [{ texto: ['Las dos hablan del cansancio, pero «exhausto» ', cubre('dice más'), ': es muy cansado. Es ', prop('intensidad'), '.'] }],
      respuesta: [justo('Una dice más'), ': es intensidad'] },
    { nivel: 1, titulo: 'Hacia qué lado',
      enunciado: 'En el par «tibio : hirviendo», ¿la segunda palabra dice más o menos que la primera?',
      datos: [D_GRADO],
      figura: fig(papel('cartel', 'Cartel del comedor escolar', 'Cuidado con la olla', 'el comedor', 'los estudiantes', ['El agua del té sale hirviendo.'])),
      solucion: [{ texto: ['«Hirviendo» es mucho más caliente que «tibio»: el par va ', cubre('de menos a más'), '.'] }],
      respuesta: [justo('Más'), ': va de menos a más'] },

    { nivel: 2, titulo: 'Limpio y sucio',
      enunciado: 'Par base: «limpio : sucio». ¿Qué par guarda su relación: «claro : oscuro», «aseado : pulcro» o «gris : tibio»?',
      datos: [D_SIN, D_ANT, D_OTRO],
      figura: fig(papel('cartel', 'Cartel del baño del colegio', 'Baño limpio', 'el municipio escolar', 'los estudiantes', ['Deja el baño limpio para el que viene.'])),
      solucion: [
        { texto: ['«Aseado : pulcro» son ', prop('sinónimos'), '. «Gris : tibio» hablan de ', prop('otro rasgo'), ': color y temperatura.'] },
        { texto: ['«Claro : oscuro» ', cubre('dicen lo opuesto del mismo rasgo'), ', como limpio y sucio.'] }],
      respuesta: [justo('«Claro : oscuro»')] },
    { nivel: 2, titulo: 'Asustado y temeroso',
      enunciado: 'Par base: «asustado : temeroso». ¿Qué par guarda su relación: «bravo : rabioso», «tranquilo : sereno» o «calmado : enfurecido»?',
      datos: [D_SIN, D_ANT, D_GRADO],
      figura: fig(cuaderno('Cuaderno de Rosa', 'Sinónimos', 'Rosa', 'el simulacro del domingo', ['asustado : temeroso'])),
      solucion: [
        { texto: ['«Rabioso» dice más que «bravo»: es ', prop('intensidad'), '. «Calmado : enfurecido» son ', prop('antónimos'), '.'] },
        { texto: ['«Tranquilo : sereno» ', cubre('dicen casi lo mismo'), ', como asustado y temeroso.'] }],
      respuesta: [justo('«Tranquilo : sereno»')] },
    { nivel: 2, titulo: 'La colina',
      enunciado: 'Par base: «charco : lago». ¿Qué par guarda su relación: «río : riachuelo», «sequía : inundación» o «colina : montaña»?',
      datos: [D_ANT, D_GRADO, D_ORDEN],
      figura: fig(papel('mural', 'Mural de la feria de ciencias', 'El agua del altiplano', '5.º B', 'los visitantes', ['Del charco al lago Titicaca, el agua se junta.'])),
      solucion: [
        { texto: ['«Río : riachuelo» va de más a menos: ', prop('al revés'), '. «Sequía : inundación» son ', prop('antónimos'), '.'] },
        { texto: ['La montaña ', cubre('es mucho más grande que la colina'), ': de menos a más, como charco y lago.'] }],
      respuesta: [justo('«Colina : montaña»')] },
    { nivel: 2, titulo: 'Mucha hambre',
      enunciado: 'Par base: «hambriento : famélico». ¿Qué par guarda su relación: «gordo : obeso», «sed : agua» o «sediento : saciado»?',
      datos: [D_ANT, D_GRADO, 'Famélico: que tiene muchísima hambre.'],
      figura: fig(cuaderno('Cuaderno de Mateo', 'Analogías', 'Mateo', 'el simulacro del sábado', ['hambriento : famélico'])),
      solucion: [
        { texto: ['«Sed : agua» es del ', prop('mismo tema'), '. «Sediento : saciado» son ', prop('antónimos'), '.'] },
        { texto: ['«Obeso» ', cubre('dice más que «gordo»'), ': de menos a más, como hambriento y famélico.'] }],
      respuesta: [justo('«Gordo : obeso»')] },
    { nivel: 2, titulo: 'Abierto y cerrado',
      enunciado: 'Par base: «abierto : cerrado». ¿Qué par guarda su relación: «grande : bonito», «encendido : apagado» o «ventana : cortina de tela»?',
      datos: [D_ANT, D_OTRO],
      figura: fig(papel('cartel', 'Cartel de la biblioteca', 'Horario de la biblioteca', 'la biblioteca', 'los estudiantes', ['Abierto de 8 a 1. Cerrado los sábados.'])),
      solucion: [
        { texto: ['«Grande : bonito» hablan de ', prop('otro rasgo'), '. «Ventana : cortina de tela» es del ', prop('mismo tema'), '.'] },
        { texto: ['«Encendido : apagado» ', cubre('dicen lo opuesto del mismo rasgo'), ', como abierto y cerrado.'] }],
      respuesta: [justo('«Encendido : apagado»')] },

    { nivel: 3, titulo: 'Alto y bajo',
      enunciado: 'Pregunta 76 del simulacro, de analogías. ¿Qué par guarda la misma relación que el par base?',
      datos: [D_SIN, D_ANT, D_OTRO, D_GRADO],
      figura: fig(hoja(76, ['alto', 'bajo'], ['gordo : delgado', 'largo : extenso', 'mediano : grande', 'rica : tímida', 'escalera : techo'])),
      solucion: [
        { texto: [mala('B'), ' son ', prop('sinónimos'), '. ', mala('C'), ': grande dice más que mediano, es ', prop('intensidad'), '.'] },
        { texto: [mala('D'), ' hablan de ', prop('otro rasgo'), '. ', mala('E'), ' es del ', prop('mismo tema'), '.'] },
        { texto: [buena('A'), ': gordo y delgado ', cubre('dicen lo opuesto del mismo rasgo'), ', como alto y bajo.'] }],
      respuesta: [buena('A'), ': gordo : delgado'] },
    { nivel: 3, titulo: 'El peligro',
      enunciado: 'Pregunta 77 del simulacro, de analogías. ¿Qué par guarda la misma relación que el par base?',
      datos: [D_SIN, D_ANT, D_OTRO, D_GRADO],
      figura: fig(hoja(77, ['peligroso', 'riesgoso'], ['sano : enfermo', 'cuidadoso : prudente', 'malo : pésimo', 'puente colgante : río', 'veloz : morado'])),
      solucion: [
        { texto: [mala('A'), ' son ', prop('antónimos'), '. ', mala('C'), ': pésimo dice más que malo, es ', prop('intensidad'), '.'] },
        { texto: [mala('D'), ' es del ', prop('mismo tema'), '. ', mala('E'), ' hablan de ', prop('otro rasgo'), '.'] },
        { texto: [buena('B'), ': cuidadoso y prudente ', cubre('dicen casi lo mismo'), ', como peligroso y riesgoso.'] }],
      respuesta: [buena('B'), ': cuidadoso : prudente'] },
    { nivel: 3, titulo: 'Diminuto',
      enunciado: 'Pregunta 78 del simulacro, de analogías. ¿Qué par guarda la misma relación que el par base?',
      datos: [D_ANT, D_OTRO, D_GRADO, D_ORDEN, 'Diminuto: muy pequeño.'],
      figura: fig(hoja(78, ['pequeño', 'diminuto'], ['grande : chico', 'inmenso : grande', 'tibio : ardiente', 'hormiga : lupa grande', 'lento : verde'])),
      solucion: [
        { texto: [mala('A'), ' son ', prop('antónimos'), '. ', mala('B'), ' va de más a menos: ', prop('al revés'), '.'] },
        { texto: [mala('D'), ' es del ', prop('mismo tema'), '. ', mala('E'), ' hablan de ', prop('otro rasgo'), '.'] },
        { texto: [buena('C'), ': ardiente ', cubre('dice más que tibio'), ': de menos a más, como pequeño y diminuto.'] }],
      respuesta: [buena('C'), ': tibio : ardiente'] },
    { nivel: 3, titulo: 'Hablar y gritar',
      enunciado: 'Pregunta 79 del simulacro, de analogías. ¿Qué par guarda la misma relación que el par base?',
      datos: [D_ANT, D_OTRO, D_GRADO, D_ORDEN],
      figura: fig(hoja(79, ['hablar', 'gritar'], ['reír : llorar', 'correr : caminar', 'oír : comer', 'tocar : golpear', 'altavoz : discurso largo'])),
      solucion: [
        { texto: [mala('A'), ' son ', prop('antónimos'), '. ', mala('B'), ' va de más a menos: ', prop('al revés'), '.'] },
        { texto: [mala('C'), ' hablan de ', prop('otro rasgo'), '. ', mala('E'), ' es del ', prop('mismo tema'), '.'] },
        { texto: [buena('D'), ': golpear ', cubre('es tocar con mucha más fuerza'), ': de menos a más, como hablar y gritar.'] }],
      respuesta: [buena('D'), ': tocar : golpear'] },
    { nivel: 3, titulo: 'Escaso',
      enunciado: 'Pregunta 80 del simulacro, de analogías. ¿Qué par guarda la misma relación que el par base?',
      datos: [D_SIN, D_ANT, D_OTRO, D_GRADO],
      figura: fig(hoja(80, ['escaso', 'abundante'], ['mucho : demasiado', 'raro : extraño', 'mercado : venta', 'veloz : salado', 'fácil : difícil'])),
      solucion: [
        { texto: [mala('A'), ': demasiado dice más que mucho, es ', prop('intensidad'), '. ', mala('B'), ' son ', prop('sinónimos'), '.'] },
        { texto: [mala('C'), ' es del ', prop('mismo tema'), '. ', mala('D'), ' hablan de ', prop('otro rasgo'), '.'] },
        { texto: [buena('E'), ': fácil y difícil ', cubre('dicen lo opuesto del mismo rasgo'), ', como escaso y abundante.'] }],
      respuesta: [buena('E'), ': fácil : difícil'] },
  ];

  const sinAnt = {
    id: 'sinonimo-antonimo',
    titulo: 'Sinónimos y antónimos en un rasgo',
    pregunta: '¿«Cansado» es lo contrario de «alegre»?',
    temas: ['Sinonimia y antonimia', 'Intensidad'],
    pieza: 'rv-soporte',
    lee: {
      tarjetas: [
        { titulo: 'El cuaderno de Rosa', texto: 'Rosa anotó cuatro palabras que suelen ir con «alegre», para su práctica de Comunicación. Quiere saber cómo se une cada una con «alegre».',
          pieza: 'rv-soporte', dibujo: { datos: cuad4(INI4), estado: {} } },
        { titulo: 'De qué habla una palabra', texto: 'Una palabra que dice cómo es alguien habla de un rasgo: «alegre» habla del ánimo; «alto», de la estatura. Dos palabras se comparan siempre sobre el mismo rasgo.' },
        { titulo: 'Sinónimos y antónimos', texto: 'Si dos palabras dicen casi lo mismo de un rasgo, son sinónimos. Si dicen lo opuesto del mismo rasgo, son antónimos, como «alto» y «bajo». Si hablan de rasgos distintos, no son ninguna de las dos.' },
        { titulo: 'Qué mirar al jugar', texto: 'Toca un par en el cuaderno para cambiar su relación. Antes, piensa de qué rasgo habla cada palabra.' },
      ],
    },
    actividad: 'Ponerle a cada par del cuaderno de Rosa su relación con «alegre».',
    aprendizaje: 'Los sinónimos dicen casi lo mismo de un rasgo y los antónimos lo opuesto del mismo rasgo; si una dice más, es intensidad.',
    ejemplos: EJEMPLOS_4,
    juega: {
      consigna: 'Rosa anotó cuatro palabras junto a «alegre». A cada par le falta su relación: sinónimos, antónimos u otro rasgo.',
      mision: {
        texto: 'Ponle a cada par su relación: sinónimos, antónimos u otro rasgo.',
        logrado: listo4,
        bien: 'Listo: «cansado» es distinto de «alegre», pero habla de otro rasgo.',
      },
      voz: 'Antes de tocar, piensa: ¿de qué rasgo habla cada palabra?',
      leyenda: [
        { s: ':', t: 'se relaciona con' },
        { s: '¿…?', t: 'par sin relación todavía' },
        { s: cubre('turquesa'), t: 'relación bien puesta' },
        { s: prop('naranja'), t: 'relación mal puesta' },
      ],
      controles: W4.map((x, k) => ({ id: c4(x), etiqueta: `Par ${k + 1}`, opciones: ETQ4.map((t, v) => ({ valor: v, texto: v ? t : 'sin elegir' })) })),
      dibujo: val => ({ datos: Object.assign({ toques: Object.fromEntries(W4.map(x => [x.id, c4(x)])) }, cuad4(val)), estado: est4(val) }),
      lectura: lectura4,
      minimo: 3,
    },
    predice: {
      pregunta: 'Par base: «TIBIO : CALIENTE». ¿Qué par guarda la misma relación? Las letras son las de la hoja.',
      voz: 'Elige antes de ver: después lo comprobamos con la oración puente.',
      datos: ['Llovizna: lluvia muy fina.', 'Aguacero: lluvia fuerte.'],
      orden: 'fijo',
      opciones: [
        { id: 'A', texto: 'pobre : rico', error: 'RVA3', siFuera: 'Tibio y caliente hablan de la temperatura, bien; pero no son opuestos: caliente dice más.' },
        { id: 'B', texto: 'aguacero : llovizna', error: 'RV16', siFuera: 'Es un grado del mismo rasgo, bien; pero va de más a menos: al revés.' },
        { id: 'C', texto: 'termómetro : enfermera', error: 'RV15', siFuera: 'Van con la temperatura, como el par base, pero no dicen más o menos de nada.' },
        { id: 'd', texto: 'llovizna : aguacero', correcta: true },
      ],
      dibujo: { datos: HOJA_TIBIO, estado: {} },
      revelar: { datos: HOJA_TIBIO, estado: estHoja(HOJA_TIBIO, 'D') },
      coincide: 'Coincide: la llovizna y el aguacero son lluvia, una con más fuerza, como tibio y caliente.',
    },
    mira: {
      datos: HOJA_TIBIO,
      voz: 'Volvamos a la hoja, par por par.',
      pasos: [
        { estado: { senal: ['h1'], nuevo: ['h1'] }, texto: 'Tibio y caliente hablan del mismo rasgo: la temperatura.',
          ecuacion: [cubre('mismo rasgo'), ', ', cubre('distinto grado')] },
        { estado: { tachar: ['A'], nuevo: ['A'] }, texto: 'No son opuestos: los dos dicen calor, y caliente dice más que tibio.',
          ecuacion: [mala('A'), ': ', prop('antónimos')] },
        { estado: { tachar: ['A', 'C'], nuevo: ['C'] }, texto: 'Termómetro y enfermera van con la temperatura, pero no son un grado.',
          ecuacion: [mala('C'), ': ', prop('mismo tema')] },
        { estado: { tachar: ['A', 'C', 'B'], nuevo: ['B'] }, texto: 'Aguacero y llovizna van de más a menos: al revés.',
          ecuacion: [mala('B'), ': ', prop('al revés')] },
        { estado: Object.assign(estHoja(HOJA_TIBIO, 'D'), { nuevo: ['D'] }), texto: 'Llovizna y aguacero: el mismo rasgo, de menos a más.',
          ecuacion: [buena('D'), ': ', cubre('intensidad')] },
      ],
    },
    regla: {
      texto: 'Los sinónimos dicen casi lo mismo de un rasgo; los antónimos, lo opuesto del mismo rasgo. Si una dice lo mismo en mayor grado, la relación es de intensidad.',
      ecuacion: ['sinónimos: ', { negrita: 'mismo lado' }, '   ·   ', 'antónimos: ', { negrita: 'lados opuestos' }, '   ·   ', 'intensidad: ', { negrita: 'mayor grado' }],
      voz: 'Vuelve a esta regla cuando dudes con un par.',
      condicion: 'las dos palabras hablan del mismo rasgo (ánimo, temperatura, tamaño); si hablan de rasgos distintos, no son antónimos.',
    },
    resuelve: {
      pieza: 'rv-soporte',
      generar(s) {
        const R = RESUELVE_4[s % RESUELVE_4.length];
        return {
          enunciado: `Pregunta ${R.sop.numero} del simulacro, de analogías. ¿Qué par de la hoja guarda la misma relación que el par base?`,
          datos: R.datos, dibujo: { datos: R.sop, estado: {} },
          pasos: [
            { tipo: 'pide', texto: 'Piden el par que se une como el par base: sinónimos, antónimos o intensidad.' },
            { tipo: 'datos', texto: R.tengo },
            { tipo: 'regla', texto: 'Primero, de qué rasgo habla cada palabra. Después, si dicen lo mismo, lo opuesto o lo mismo en mayor grado.' },
            { tipo: 'aplica', texto: R.malas },
            { tipo: 'aplica', texto: R.bien, dibujo: { datos: R.sop, estado: estHoja(R.sop, R.buena) } },
            { tipo: 'sentido', texto: R.sentido },
          ],
          respuesta: [buena(R.buena), ': ', R.sop.alternativas.find(a => a.id === R.buena).t],
        };
      },
    },
    ahoraTu: {
      pieza: 'rv-soporte',
      voz: 'Otra hoja. Primero, de qué rasgo habla el par base.',
      generar(s) {
        const A = AHORA_4[s % AHORA_4.length], sop = hoja(81 + (s % AHORA_4.length), A.b);
        return {
          pregunta: 'La hoja trae el par base. ¿Qué par guarda la misma relación?',
          datos: [D_SIN, D_ANT, D_OTRO, D_GRADO, ...(A.datos || [])], dibujo: { datos: sinPie(sop), estado: {} },
          opciones: opciones(A.ok, voltear(A.m, s)),
          solucion: { texto: 'Habla del mismo rasgo y se une como el par base.', ecuacion: [justo(A.ok)],
            dibujo: { datos: Object.assign(sinPie(sop), { frase: { etiqueta: 'Oración puente', t: A.puente } }), estado: { marcas: { frase: 'f' } } } },
        };
      },
    },
  };
  const mesaPalabras = Object.assign({ id: 'palabras-rosa', titulo: 'Las palabras de Rosa', pieza: 'rv-soporte' }, sinMision(sinAnt.juega), {
    invitaciones: [
      { texto: 'Ponle «antónimos» a todos los pares y mira cuál queda bien.',
        logrado: val => W4.every(x => val[c4(x)] === 2),
        bien: 'Solo «triste» dice lo opuesto del ánimo.' },
      { texto: 'Deja bien puestos solo los dos sinónimos; los demás, sin elegir.',
        logrado: val => W4.every(x => val[c4(x)] === (x.rel === 1 ? 1 : 0)),
        bien: '«Contento» y «risueño» dicen casi lo mismo que «alegre».' },
      { texto: 'Pon mal todas las relaciones, sin dejar ninguna sin elegir.',
        logrado: val => W4.every(x => val[c4(x)] && val[c4(x)] !== x.rel),
        bien: 'Cada par tiene una sola relación que vale.' },
    ] });

  // ---------- Idea 5: la oración puente justa (nueva, etapa 6) ----------
  // Cambia: la clase y el rasgo de la oración puente de «minero : mina». Permanece: la hoja y los cinco pares, con lo que
  // se sabe de cada uno. Progresa: cuántos pares pasan (5, 2, 2, 1). Se reserva: la categoría gramatical (el bailarín
  // hace el baile, pero «baile» no es una acción), que la predicción estrena. Debe verse: que la oración puente es la
  // definición de la relación: con una clase lejana o sin el rasgo, se cuelan pares (Definiciones: muy amplia).
  // Objeto de la primera pantalla: la hoja de simulacro con el par base; debajo, la ficha de la oración (rv-definicion).
  // Colores: el par que pasa y es el análogo, i; el que se cuela y la oración que se prueba, o; la oración justa, f; lo
  // que no pasa, gris. Todo lo que pasa lo calcula `medir5` con lo que se sabe de cada par (regla 1).
  // Códigos: RVA5 (oración muy amplia: pasa un par que no se une igual), RVA4 (otra categoría gramatical), RV16 (al
  // revés), RV17 (otra relación) y RV15 (mismo tema).
  const D_JUSTA = 'Oración puente justa: vale para el par base y para un solo par de las alternativas.';
  const D_AMPLIA5 = 'Muy amplia: la oración puente deja pasar a más de un par.';
  const D_CAT = 'Categoría gramatical: sustantivo (nombra algo), verbo (dice una acción) o adjetivo (dice cómo es algo).';
  const HOJA_MINA = hoja(91, ['minero', 'mina'], []);
  const PARES5 = [
    { id: 'p1', t: 'profesor : colegio', es: 'un lugar', trabaja: true, lugar: true, ok: true, corto: 'profesor : colegio' },
    { id: 'p2', t: 'enfermo : hospital', es: 'un lugar', trabaja: false, lugar: true, corto: 'enfermo : hospital' },
    { id: 'p3', t: 'chofer : combi', es: 'un vehículo', trabaja: true, lugar: false, corto: 'chofer : combi' },
    { id: 'p4', t: 'cocinero : cocinar', es: 'una acción', trabaja: false, lugar: false, corto: 'cocinero : cocinar' },
    { id: 'p5', t: 'hospital : médico', es: 'una persona', trabaja: false, lugar: false, corto: 'hospital : médico' },
  ];
  const CLASES5 = { tiene: { t: 'tiene que ver con', cond: {} }, trabaja: { t: 'trabaja en', cond: { trabaja: true } } };
  const R_LUGAR = 'que es un lugar';
  const cond5 = val => Object.assign({}, CLASES5[val.g].cond, val.r ? { lugar: true } : {});
  const pasa5 = (p, c) => Object.entries(c).every(([k, v]) => p[k] === v);
  const medir5 = val => { const c = cond5(val), dentro = PARES5.filter(p => pasa5(p, c)); return { dentro, cuelan: dentro.filter(p => !p.ok) }; };
  const TABLA5 = { titulo: 'Los pares de la hoja', cols: ['Par', 'El segundo', 'Trabaja'], anchos: [142, 104, 48],
    filas: PARES5.map(p => ({ id: p.id, celdas: [p.t, p.es, p.trabaja ? 'sí' : 'no'] })) };
  const FIG5 = { soporte: HOJA_MINA, toques: { g: 'g', r: 'r' }, casos: TABLA5,
    entrada: { termino: 'minero : mina', rotulo: 'Oración puente', partes: [{ id: 'g', papel: 'Unión' }, { id: 'r', papel: 'Rasgo', casilla: true, hueco: R_LUGAR }] } };
  const est5 = val => {
    const m = medir5(val), justa = m.dentro.length === 1 && !m.cuelan.length;
    return { partes: { g: CLASES5[val.g].t, r: val.r ? R_LUGAR : '' }, color: justa ? 'f' : 'o',
      filas: Object.fromEntries(m.dentro.map(p => [p.id, p.ok ? 'i' : 'o'])), tenue: PARES5.filter(p => !m.dentro.includes(p)).map(p => p.id),
      sello: justa ? { t: 'Justa: pasa un solo par', c: 'f' } : { t: `Muy amplia: pasan ${m.dentro.length} pares`, c: 'o' } };
  };
  const lectura5 = val => {
    const m = medir5(val);
    if (m.dentro.length === 1 && !m.cuelan.length) return [justo('Justa'), ': pasa solo ', cubre('profesor : colegio')];
    if (m.cuelan.length === 1) return [prop('Muy amplia'), ': pasa también ', prop(m.cuelan[0].corto)];
    return ['Se cuelan ', prop(`${m.cuelan.length} pares`), ' junto a ', cubre('profesor : colegio')];
  };
  const INI5 = { g: 'tiene', r: 0 };
  const HOJA_CANTA = hoja(92, ['cantante', 'cantar'], ['correr : corredor', 'guitarrista : guitarra', 'pescador : pescar', 'bailarín : baile']);
  const RESUELVE_5 = [
    { sop: hoja(93, ['panadero', 'pan'], ['chompa : tejedora', 'sastre : coser', 'comprador : tienda', 'harina : trigo', 'zapatero : zapato']), buena: 'E',
      datos: [D_JUSTA, D_AMPLIA5, D_CAT], tengo: 'El panadero hace el pan: una persona y la cosa que hace, nombrada con un sustantivo.',
      puente: 'El primero hace el segundo, que es una cosa.',
      malas: [mala('A'), ' va ', prop('al revés'), '. ', mala('B'), ': «coser» es una acción, ', prop('otra categoría'), '. ', mala('C'), ' es ', prop('otra relación'), '. ', mala('D'), ' es del ', prop('mismo tema'), '.'],
      bien: [buena('E'), ': el zapatero ', cubre('hace el zapato, que es una cosa'), '.'],
      sentido: 'Con «el primero tiene que ver con el segundo» pasaban casi todos: esa oración es muy amplia.' },
    { sop: hoja(94, ['piloto', 'avión'], ['pasajero : bus', 'camión : camionero', 'maquinista : tren', 'aeropuerto : pista', 'mecánico : motor']), buena: 'C',
      datos: [D_JUSTA, D_AMPLIA5, D_CAT], tengo: 'El piloto conduce el avión: una persona y el vehículo que conduce.',
      puente: 'El primero conduce el segundo.',
      malas: [mala('A'), ': el pasajero va en el bus, no lo conduce: ', prop('muy amplia'), '. ', mala('B'), ' va ', prop('al revés'), '. ', mala('D'), ' es del ', prop('mismo tema'), '. ', mala('E'), ': el mecánico no conduce el motor.'],
      bien: [buena('C'), ': el maquinista ', cubre('conduce el tren'), '.'],
      sentido: '«Trabaja con» dejaba pasar al mecánico: hizo falta el rasgo «lo conduce».' },
    { sop: hoja(95, ['cuchillo', 'cortar'], ['escoba : barrer', 'serrucho : corte', 'coser : aguja', 'mesa : mantel', 'lápiz : papel']), buena: 'A',
      datos: [D_JUSTA, D_AMPLIA5, D_CAT], tengo: 'El cuchillo sirve para cortar: una herramienta y su acción, dicha con un verbo.',
      puente: 'El primero sirve para el segundo, que es una acción.',
      malas: [mala('B'), ': «corte» es un sustantivo, ', prop('otra categoría'), '. ', mala('C'), ' va ', prop('al revés'), '. ', mala('D'), ' es del ', prop('mismo tema'), '. ', mala('E'), ': el papel no es una acción, ', prop('otra relación'), '.'],
      bien: [buena('A'), ': la escoba ', cubre('sirve para barrer'), ', que es una acción.'],
      sentido: 'El serrucho también corta: lo deja fuera la categoría de «corte», no la relación.' },
    { sop: hoja(96, ['termómetro', 'temperatura'], ['regla : medir', 'peso : balanza', 'fiebre : pastilla', 'balanza : peso', 'brújula : viaje']), buena: 'D',
      datos: [D_JUSTA, D_AMPLIA5, D_CAT], tengo: 'El termómetro mide la temperatura: un instrumento y lo que mide, con un sustantivo.',
      puente: 'El primero mide el segundo.',
      malas: [mala('A'), ': «medir» es una acción, ', prop('otra categoría'), '. ', mala('B'), ' va ', prop('al revés'), '. ', mala('C'), ' es del ', prop('mismo tema'), '. ', mala('E'), ': la brújula sirve en un viaje, pero no lo mide: ', prop('muy amplia'), '.'],
      bien: [buena('D'), ': la balanza ', cubre('mide el peso'), '.'],
      sentido: 'Con «sirve para» pasaban la regla y la brújula: el rasgo «mide» deja una.' },
  ];
  const AHORA_5 = [
    { b: ['mecánico', 'taller'], ok: 'enfermero : posta', puente: 'El enfermero trabaja en la posta, que es un lugar.',
      m: [['turista : museo', 'RVA5', 'El turista está en el museo, pero no trabaja ahí: «está en» es muy amplia.'],
        ['oficina : secretaria', 'RV16', 'Es un lugar y quien trabaja ahí, bien; pero al revés.'],
        ['jardinero : podar', 'RVA4', 'El jardinero sí poda; pero «podar» es una acción, no un lugar.']] },
    { b: ['pintar', 'pincel'], ok: 'barrer : escoba', puente: 'Barrer se hace con la escoba: la acción y su herramienta.',
      m: [['hacha : cortar', 'RV16', 'Es una herramienta y su acción, bien; pero al revés.'],
        ['dibujo : lápiz de color', 'RVA4', 'El dibujo se hace con el lápiz, bien; pero «dibujo» nombra una cosa, no una acción.'],
        ['leer : libro', 'RVA5', 'Se lee un libro, pero el libro no es la herramienta: «se hace con» queda amplia.']] },
    { b: ['agricultor', 'sembrar'], ok: 'nadador : nadar', puente: 'El nadador es el que nada: una persona y su acción.',
      m: [['cocinero : comida', 'RVA4', 'El cocinero hace la comida, bien; pero «comida» nombra una cosa, no una acción.'],
        ['enseñar : profesor', 'RV16', 'Es una persona y su acción, pero al revés.'],
        ['chacra : surco', 'RV15', 'Son del mismo tema que el agricultor, pero no son una persona y su acción.']] },
    { b: ['horno', 'hornear'], ok: 'licuadora : licuar', puente: 'La licuadora sirve para licuar: un aparato y su acción.',
      m: [['refrigeradora : frío', 'RVA4', 'La refrigeradora da frío, bien; pero «frío» no es una acción.'],
        ['calentar : estufa', 'RV16', 'Es un aparato y su acción, pero al revés.'],
        ['cocina : comida', 'RVA5', 'En la cocina se hace la comida, pero no es un aparato y su acción.']] },
    { b: ['conductor', 'bus'], ok: 'capitán : barco', puente: 'El capitán conduce el barco.',
      m: [['pasajero : tren', 'RVA5', 'El pasajero va en el tren, pero no lo conduce: «va en» es muy amplia.'],
        ['combi : chofer', 'RV16', 'Es un vehículo y quien lo conduce, pero al revés.'],
        ['manejar : timón', 'RVA4', '«Manejar» es una acción: otra categoría, y no conduce nada.'],
        ['pista : semáforo', 'RV15', 'Son del mismo tema que el bus, pero ninguno conduce al otro.']] },
    { b: ['pala', 'cavar'], ok: 'tijera : cortar', puente: 'La tijera sirve para cortar, que es una acción.',
      m: [['aguja : costura', 'RVA4', 'La aguja sirve para coser, bien; pero «costura» nombra una cosa, no una acción.'],
        ['barrer : escoba', 'RV16', 'Es una herramienta y su acción, pero al revés.'],
        ['jardín : semilla', 'RV15', 'Son del mismo tema que la pala, pero no son una herramienta y su acción.'],
        ['minero : casco', 'RV17', 'Es una persona y lo que lleva puesto: otra relación.']] },
  ];
  const EJEMPLOS_5 = [
    { nivel: 1, titulo: 'La categoría de cada palabra',
      enunciado: '¿Qué categoría gramatical tiene cada palabra del par «nadar : nadador»?',
      datos: [D_CAT],
      figura: fig(papel('cartel', 'Cartel de la piscina municipal', 'Clases de natación', 'la municipalidad', 'los vecinos', ['Aprende a nadar con un nadador del club.'])),
      solucion: [{ texto: ['«Nadar» dice una acción: es un ', cubre('verbo'), '. «Nadador» nombra a una persona: es un ', cubre('sustantivo'), '.'] }],
      respuesta: [justo('Verbo y sustantivo')] },
    { nivel: 1, titulo: 'Una oración muy amplia',
      enunciado: '«El primero tiene que ver con el segundo» vale para «minero : mina». ¿Vale también para «turista : playa»?',
      datos: [D_JUSTA, D_AMPLIA5],
      figura: fig(cuaderno('Cuaderno de Diego', 'Oraciones puente', 'Diego', 'el simulacro del sábado', ['minero : mina', 'turista : playa'])),
      solucion: [{ texto: ['Sí: el turista tiene que ver con la playa. La oración deja pasar a los dos: es ', prop('muy amplia'), '.'] }],
      respuesta: [justo('Sí'), ': por eso es muy amplia'] },
    { nivel: 1, titulo: 'El rasgo que falta',
      enunciado: '«El primero está en el segundo» vale para «minero : mina» y para «turista : playa». ¿Qué le falta decir a la oración para dejar fuera al turista?',
      datos: [D_JUSTA, D_AMPLIA5],
      figura: fig(cuaderno('Cuaderno de Rosa', 'Oraciones puente', 'Rosa', 'la práctica de Comunicación', ['minero : mina', 'turista : playa'])),
      solucion: [{ texto: ['El minero está en la mina ', cubre('porque trabaja ahí'), '; el turista está en la playa, pero no trabaja ahí.'] }],
      respuesta: [justo('«Porque trabaja ahí»')] },
    { nivel: 1, titulo: 'Dos que pasan',
      enunciado: '«El primero va en el segundo» vale para «piloto : avión» y «pasajero : avión». ¿Cuál cumple también «el primero conduce el segundo»?',
      datos: [D_JUSTA, D_AMPLIA5],
      figura: fig(papel('mensaje', 'Viaje de promoción', null, 'la tutora', 'la promoción', ['El vuelo sale a las 6. El piloto nos saludará al subir.'])),
      solucion: [{ texto: ['El pasajero va en el avión, pero no lo conduce. El piloto ', cubre('conduce el avión'), '.'] }],
      respuesta: [justo('«Piloto : avión»')] },
    { nivel: 1, titulo: 'Sustantivo o verbo',
      enunciado: '«Baile» y «bailar» hablan de lo mismo. ¿Son de la misma categoría gramatical?',
      datos: [D_CAT],
      figura: fig(papel('cartel', 'Cartel de la fiesta patronal', 'Concurso de danzas', 'la comisión de la fiesta', 'los vecinos', ['El domingo es el gran baile de la Candelaria.'])),
      solucion: [{ texto: ['No: «baile» nombra una cosa, es un ', prop('sustantivo'), '; «bailar» dice una acción, es un ', cubre('verbo'), '.'] }],
      respuesta: [justo('No'), ': sustantivo y verbo'] },

    { nivel: 2, titulo: 'El guía del museo',
      enunciado: 'Par base: «guía : museo». ¿Qué par guarda su relación: «oficina : jefe», «portero : colegio» o «visitante : parque»?',
      datos: [D_JUSTA, D_AMPLIA5, D_ORDEN],
      figura: fig(papel('cartel', 'Cartel del museo de Lampa', 'Visitas guiadas', 'el museo', 'los visitantes', ['El guía lo espera en la entrada.'])),
      solucion: [
        { texto: ['«Oficina : jefe» va ', prop('al revés'), '. El visitante está en el parque, pero no trabaja ahí: «está en» es ', prop('muy amplia'), '.'] },
        { texto: ['El portero ', cubre('trabaja en el colegio'), ', como el guía en el museo.'] }],
      respuesta: [justo('«Portero : colegio»')] },
    { nivel: 2, titulo: 'Lavar con jabón',
      enunciado: 'Par base: «lavar : jabón». ¿Qué par guarda su relación: «escoba : barrer», «limpieza : trapo viejo» o «cortar : cuchillo»?',
      datos: [D_JUSTA, D_CAT, D_ORDEN],
      figura: fig(cuaderno('Cuaderno de Mateo', 'Analogías', 'Mateo', 'la práctica de Comunicación', ['lavar : jabón'])),
      solucion: [
        { texto: ['«Escoba : barrer» va ', prop('al revés'), '. «Limpieza» nombra una cosa, no una acción: ', prop('otra categoría'), '.'] },
        { texto: ['Cortar ', cubre('se hace con el cuchillo'), ': la acción y su herramienta, como lavar y jabón.'] }],
      respuesta: [justo('«Cortar : cuchillo»')] },
    { nivel: 2, titulo: 'El lector',
      enunciado: 'Par base: «lector : leer». ¿Qué par guarda su relación: «viajero : viajar», «correr : atleta» o «escritor : novela»?',
      datos: [D_JUSTA, D_CAT, D_ORDEN],
      figura: fig(papel('cartel', 'Cartel de la biblioteca', 'Club de lectura', 'la biblioteca', 'los estudiantes', ['Cada lector elige un libro al mes.'])),
      solucion: [
        { texto: ['«Correr : atleta» va ', prop('al revés'), '. «Novela» nombra una cosa, no una acción: ', prop('otra categoría'), '.'] },
        { texto: ['El viajero ', cubre('es el que viaja'), ': persona y acción, como el lector y leer.'] }],
      respuesta: [justo('«Viajero : viajar»')] },
    { nivel: 2, titulo: 'La balanza',
      enunciado: 'Par base: «balanza : pesar». ¿Qué par guarda su relación: «reloj : hora exacta», «lupa : ampliar» o «medir : regla»?',
      datos: [D_JUSTA, D_CAT, D_ORDEN],
      figura: fig(papel('cartel', 'Cartel de un puesto del mercado', 'Peso justo', 'doña Carmen', 'los clientes', ['Aquí pesamos con balanza electrónica.'])),
      solucion: [
        { texto: ['«Hora exacta» nombra una cosa, no una acción: ', prop('otra categoría'), '. «Medir : regla» va ', prop('al revés'), '.'] },
        { texto: ['La lupa ', cubre('sirve para ampliar'), ': un instrumento y su acción, como la balanza y pesar.'] }],
      respuesta: [justo('«Lupa : ampliar»')] },
    { nivel: 2, titulo: 'El vigilante',
      enunciado: 'Par base: «vigilante : fábrica». ¿Qué par guarda su relación: «cliente : tienda», «colegio : directora» o «mozo : restaurante»?',
      datos: [D_JUSTA, D_AMPLIA5, D_ORDEN],
      figura: fig(papel('cartel', 'Cartel de la entrada de una fábrica', 'Ingreso del personal', 'la gerencia', 'los trabajadores', ['El vigilante pide el fotocheck en la puerta.'])),
      solucion: [
        { texto: ['El cliente está en la tienda, pero no trabaja ahí: ', prop('muy amplia'), '. «Colegio : directora» va ', prop('al revés'), '.'] },
        { texto: ['El mozo ', cubre('trabaja en el restaurante'), ', como el vigilante en la fábrica.'] }],
      respuesta: [justo('«Mozo : restaurante»')] },

    { nivel: 3, titulo: 'El atleta',
      enunciado: 'Pregunta 97 del simulacro, de analogías. ¿Qué par guarda la misma relación que el par base?',
      datos: [D_JUSTA, D_AMPLIA5, D_CAT],
      figura: fig(hoja(97, ['atleta', 'correr'], ['escalador : escalar', 'saltar : saltador', 'nadador : natación', 'zapatilla : pista de tierra', 'ciclista : casco'])),
      solucion: [
        { texto: [mala('B'), ' va ', prop('al revés'), '. ', mala('C'), ': «natación» nombra una cosa, ', prop('otra categoría'), '.'] },
        { texto: [mala('D'), ' es del ', prop('mismo tema'), '. ', mala('E'), ' es ', prop('otra relación'), '.'] },
        { texto: [buena('A'), ': el escalador ', cubre('es el que escala'), ', como el atleta es el que corre.'] }],
      respuesta: [buena('A'), ': escalador : escalar'] },
    { nivel: 3, titulo: 'La cocina',
      enunciado: 'Pregunta 98 del simulacro, de analogías. ¿Qué par guarda la misma relación que el par base?',
      datos: [D_JUSTA, D_AMPLIA5, D_CAT],
      figura: fig(hoja(98, ['cocina', 'cocinero'], ['mesero : comedor', 'aula : profesor', 'parque : turista', 'cocinar : olla', 'plato : cuchara'])),
      solucion: [
        { texto: [mala('A'), ' va ', prop('al revés'), '. ', mala('C'), ': el turista está en el parque, pero no trabaja ahí: ', prop('muy amplia'), '.'] },
        { texto: [mala('D'), ' es ', prop('otra relación'), '. ', mala('E'), ' es del ', prop('mismo tema'), '.'] },
        { texto: [buena('B'), ': en el aula ', cubre('trabaja el profesor'), ', como en la cocina el cocinero.'] }],
      respuesta: [buena('B'), ': aula : profesor'] },
    { nivel: 3, titulo: 'La brújula',
      enunciado: 'Pregunta 99 del simulacro, de analogías. ¿Qué par guarda la misma relación que el par base?',
      datos: [D_JUSTA, D_AMPLIA5, D_CAT],
      figura: fig(hoja(99, ['brújula', 'orientar'], ['reloj : hora', 'medir : regla', 'linterna : alumbrar', 'mapa : viajero', 'montaña : camino de herradura'])),
      solucion: [
        { texto: [mala('A'), ': «hora» nombra una cosa, ', prop('otra categoría'), '. ', mala('B'), ' va ', prop('al revés'), '.'] },
        { texto: [mala('D'), ' es ', prop('otra relación'), '. ', mala('E'), ' es del ', prop('mismo tema'), '.'] },
        { texto: [buena('C'), ': la linterna ', cubre('sirve para alumbrar'), ', como la brújula para orientar.'] }],
      respuesta: [buena('C'), ': linterna : alumbrar'] },
    { nivel: 3, titulo: 'El juez',
      enunciado: 'Pregunta 100 del simulacro, de analogías. ¿Qué par guarda la misma relación que el par base?',
      datos: [D_JUSTA, D_AMPLIA5, D_CAT],
      figura: fig(hoja(100, ['juez', 'juzgar'], ['abogado : juicio', 'curar : médico', 'acusado : tribunal', 'vendedor : vender', 'toga : mazo'])),
      solucion: [
        { texto: [mala('A'), ': «juicio» nombra una cosa, ', prop('otra categoría'), '. ', mala('B'), ' va ', prop('al revés'), '.'] },
        { texto: [mala('C'), ' es ', prop('otra relación'), '. ', mala('E'), ' es del ', prop('mismo tema'), '.'] },
        { texto: [buena('D'), ': el vendedor ', cubre('es el que vende'), ', como el juez es el que juzga.'] }],
      respuesta: [buena('D'), ': vendedor : vender'] },
    { nivel: 3, titulo: 'El pastor',
      enunciado: 'Pregunta 101 del simulacro, de analogías. ¿Qué par guarda la misma relación que el par base?',
      datos: [D_JUSTA, D_AMPLIA5, D_ORDEN],
      figura: fig(hoja(101, ['pastor', 'rebaño'], ['oveja : lana', 'plantas : jardinero', 'lana : chompa', 'turista : grupo', 'niñera : niños'])),
      solucion: [
        { texto: [mala('A'), ' es del ', prop('mismo tema'), '. ', mala('B'), ' va ', prop('al revés'), '. ', mala('C'), ' es ', prop('otra relación'), '.'] },
        { texto: [mala('D'), ': el turista va en un grupo, pero no lo cuida: ', prop('muy amplia'), '.'] },
        { texto: [buena('E'), ': la niñera ', cubre('cuida a los niños'), ', como el pastor al rebaño.'] }],
      respuesta: [buena('E'), ': niñera : niños'] },
  ];

  const puenteJusta = {
    id: 'puente-justa',
    titulo: 'La oración puente justa',
    pregunta: '¿Qué hago si dos pares cumplen mi oración puente?',
    temas: ['Rasgos de la relación'],
    pieza: 'rv-definicion',
    lee: {
      tarjetas: [
        { titulo: 'Una oración por armar', texto: 'En esta pregunta del simulacro, la oración puente no viene escrita: hay que armarla. Debajo de la hoja van la ficha de la oración, con su unión y su rasgo, y la tabla de los cinco pares.',
          pieza: 'rv-soporte', dibujo: { datos: HOJA_MINA, estado: {} } },
        { titulo: 'Como una definición', texto: 'La oración puente se parece a una definición: dice cómo se unen las dos palabras y un rasgo que deja fuera a los otros pares. Si deja pasar a dos pares, es muy amplia, como una definición en la que se cuela un vecino.' },
        { titulo: 'Qué mirar al jugar', texto: 'Toca la unión de la ficha para cambiarla, y la casilla del rasgo para ponerlo o quitarlo. En la tabla, mira qué pares pasan con cada oración.' },
      ],
    },
    actividad: 'Armar la oración puente de un par base hasta que deje pasar un solo par.',
    aprendizaje: 'Si dos pares cumplen la oración puente, es muy amplia: se le agrega un rasgo del par base, como el lugar o la categoría gramatical.',
    ejemplos: EJEMPLOS_5,
    juega: {
      consigna: 'La oración puente de «minero : mina» está por armar. La tabla dice qué es el segundo de cada par y si el primero trabaja ahí.',
      mision: {
        texto: 'Arma la oración puente que deje pasar a un solo par de la hoja.',
        logrado: val => { const m = medir5(val); return m.dentro.length === 1 && !m.cuelan.length; },
        bien: 'Listo: con «trabaja en» y «que es un lugar» pasa un solo par.',
      },
      voz: 'Toca la unión o la casilla del rasgo, y mira la tabla.',
      leyenda: [
        { s: 'Unión', t: 'cómo se juntan las dos palabras' },
        { s: 'Rasgo', t: 'lo que deja fuera a otros pares' },
        { s: cubre('turquesa'), t: 'par que pasa y se une igual' },
        { s: prop('naranja'), t: 'par que se cuela, o la oración amplia' },
        { s: justo('violeta'), t: 'la oración puente justa' },
      ],
      controles: [
        { id: 'g', etiqueta: 'Unión', opciones: Object.entries(CLASES5).map(([valor, c]) => ({ valor, texto: c.t })) },
        { id: 'r', etiqueta: 'Rasgo', opciones: [{ valor: 0, texto: 'sin él' }, { valor: 1, texto: R_LUGAR }] },
      ],
      dibujo: val => ({ datos: FIG5, estado: est5(val) }),
      lectura: lectura5,
      minimo: 3,
    },
    predice: {
      pregunta: 'Par base: «CANTANTE : CANTAR». ¿Qué par guarda la misma relación? Las letras son las de la hoja.',
      voz: 'Elige antes de ver: después lo comprobamos con la oración puente.',
      orden: 'fijo',
      opciones: [
        { id: 'A', texto: 'correr : corredor', error: 'RV16', siFuera: 'Es una persona y su acción, bien; pero al revés: la acción va primero.' },
        { id: 'B', texto: 'guitarrista : guitarra', error: 'RV17', siFuera: 'Es una persona y algo de su oficio, pero la guitarra es su instrumento: otra relación.' },
        { id: 'c', texto: 'pescador : pescar', correcta: true },
        { id: 'D', texto: 'bailarín : baile', error: 'RVA4', siFuera: 'El bailarín hace el baile, bien; pero «baile» nombra una cosa, y «cantar» es una acción.' },
      ],
      dibujo: { datos: { soporte: HOJA_CANTA }, estado: {} },
      revelar: { datos: { soporte: HOJA_CANTA }, estado: { soporte: estHoja(HOJA_CANTA, 'C') } },
      coincide: 'Coincide: el pescador es el que pesca, como el cantante es el que canta: persona y acción.',
    },
    mira: {
      datos: { soporte: HOJA_CANTA },
      voz: 'Volvamos a la hoja, par por par.',
      pasos: [
        { estado: { soporte: { senal: ['h1'], nuevo: ['h1'] } }, texto: 'Oración puente: el cantante es el que canta.',
          ecuacion: [cubre('persona'), ' : ', cubre('su acción')] },
        { estado: { soporte: { tachar: ['A'], nuevo: ['A'] } }, texto: '«Correr : corredor» pone la acción primero.',
          ecuacion: [mala('A'), ': ', prop('al revés')] },
        { estado: { soporte: { tachar: ['A', 'B'], nuevo: ['B'] } }, texto: 'La guitarra es el instrumento del guitarrista, no lo que hace.',
          ecuacion: [mala('B'), ': ', prop('otra relación')] },
        { estado: { soporte: { tachar: ['A', 'B', 'D'], nuevo: ['D'] } }, texto: 'El bailarín hace el baile, pero «baile» nombra una cosa.',
          ecuacion: [mala('D'), ': ', prop('otra categoría')] },
        { estado: { soporte: Object.assign(estHoja(HOJA_CANTA, 'C'), { nuevo: ['C'] }) }, texto: 'El pescador es el que pesca: persona y acción, como el par base.',
          ecuacion: [buena('C'), ': ', cubre('justa')] },
      ],
    },
    regla: {
      texto: 'Si dos pares cumplen la oración puente, es muy amplia: se le agrega un rasgo del par base, como qué nombra la segunda palabra o de qué categoría gramatical es.',
      ecuacion: [{ llave: [{ negrita: 'unión' }], nota: 'es el que' }, ' + ', { llave: [{ negrita: 'rasgo' }], nota: 'es un verbo' }, '   ·   ', { llave: [{ negrita: 'justa' }], nota: 'pasa un solo par' }],
      voz: 'Vuelve a esta regla cuando dudes con un par.',
      condicion: 'la oración vale para el par base y para un solo par; si vale para dos, le falta un rasgo.',
    },
    resuelve: {
      pieza: 'rv-soporte',
      generar(s) {
        const R = RESUELVE_5[s % RESUELVE_5.length];
        return {
          enunciado: `Pregunta ${R.sop.numero} del simulacro, de analogías. ¿Qué par de la hoja guarda la misma relación que el par base?`,
          datos: R.datos, dibujo: { datos: R.sop, estado: {} },
          pasos: [
            { tipo: 'pide', texto: 'Piden el par que cumple una oración puente justa del par base.' },
            { tipo: 'datos', texto: [R.tengo, ' Oración puente: ', cubre(`«${R.puente}»`)] },
            { tipo: 'regla', texto: 'Si pasan dos pares, la oración es muy amplia: se le agrega un rasgo del par base, como qué es la segunda palabra o su categoría.' },
            { tipo: 'aplica', texto: R.malas },
            { tipo: 'aplica', texto: R.bien, dibujo: { datos: R.sop, estado: estHoja(R.sop, R.buena) } },
            { tipo: 'sentido', texto: R.sentido },
          ],
          respuesta: [buena(R.buena), ': ', R.sop.alternativas.find(a => a.id === R.buena).t],
        };
      },
    },
    ahoraTu: {
      pieza: 'rv-soporte',
      voz: 'Otra hoja. Arma una oración puente que deje pasar uno.',
      generar(s) {
        const A = AHORA_5[s % AHORA_5.length], sop = hoja(102 + (s % AHORA_5.length), A.b);
        return {
          pregunta: 'La hoja trae el par base. ¿Qué par guarda la misma relación?',
          datos: [D_JUSTA, D_AMPLIA5, D_CAT, D_ORDEN], dibujo: { datos: sinPie(sop), estado: {} },
          opciones: opciones(A.ok, voltear(A.m, s)),
          solucion: { texto: 'Cumple una oración puente justa del par base: no pasa ningún otro par.', ecuacion: [justo(A.ok)],
            dibujo: { datos: Object.assign(sinPie(sop), { frase: { etiqueta: 'Oración puente', t: A.puente } }), estado: { marcas: { frase: 'f' } } } },
        };
      },
    },
  };
  const mesaFicha = Object.assign({ id: 'ficha-puente', titulo: 'La ficha de la oración puente', pieza: 'rv-definicion' }, sinMision(puenteJusta.juega), {
    invitaciones: [
      { texto: 'Arma una oración con un rasgo por la que pasen dos pares.',
        logrado: val => val.r === 1 && medir5(val).dentro.length === 2,
        bien: '«Que es un lugar» deja fuera al chofer, pero no al enfermo.' },
      { texto: 'Haz que el chofer sea el único que se cuela.',
        logrado: val => { const m = medir5(val); return m.cuelan.length === 1 && m.cuelan[0].id === 'p3'; },
        bien: 'El chofer trabaja en la combi, pero la combi no es un lugar.' },
      { texto: 'Haz que el enfermo sea el único que se cuela.',
        logrado: val => { const m = medir5(val); return m.cuelan.length === 1 && m.cuelan[0].id === 'p2'; },
        bien: 'El hospital es un lugar, pero el enfermo no trabaja ahí.' },
    ] });

  // Cada falla que un resuelto nombra está dicha en sus Datos (lección M8 de la auditoría de Definiciones). Se completa al
  // armar la unidad, en los ejemplos y en «Así se resuelve»; si no caben en 6 líneas, falla aquí.
  const NOMBRES = [
    [/mismo tema/i, D_TEMA], [/sin persona/i, D_SINPER], [/muy amplia/i, null], [/al revés/i, D_ORDEN], [/sucesión/i, D_SUCESION],
    [/otro rasgo/i, D_OTRO], [/intensidad/i, D_GRADO], [/otra categoría|sustantivo|verbo/i, D_CAT], [/sinónimos/i, D_SIN], [/antónimos/i, D_ANT],
    [/de clase/i, D_CLASE], [/de parte/i, D_PARTE], [/de grupo/i, D_GRUPO]];
  const planoT = x => (Array.isArray(x) ? x.map(planoT).join('') : x == null ? '' : typeof x === 'object' ? planoT(x.t !== undefined ? x.t : x.negrita !== undefined ? x.negrita : '') : String(x));
  const completar = (idea, datos, texto, donde) => {
    const t = planoT(texto), out = datos.slice();
    // «Otra relación» y «muy amplia» se dicen de otra forma en la idea 1 (con su persona y su herramienta).
    const extra = idea === relacionNoTema ? [[/otra relación/i, D_OTRA], [/muy amplia/i, D_VAGA]] : [[/otra relación/i, D_OTRAREL], [/muy amplia/i, idea === puenteJusta ? D_AMPLIA5 : D_VAGA]];
    for (const [re, linea] of [...extra, ...NOMBRES]) if (linea && re.test(t) && !out.includes(linea)) out.push(linea);
    if (out.length > 6) throw new Error(`analogias: ${donde} necesita ${out.length} líneas de datos`);
    return out;
  };
  const IDEAS_U = [relacionNoTema, parteClase, claseCausa, sinAnt, puenteJusta];
  for (const idea of IDEAS_U) {
    for (const e of idea.ejemplos) e.datos = completar(idea, e.datos, e.solucion.map(x => x.texto), `${idea.id} «${e.titulo}»`);
    const gen = idea.resuelve.generar;
    idea.resuelve.generar = s => { const r = gen(s); r.datos = completar(idea, r.datos, r.pasos.filter(p => p.tipo === 'aplica').map(p => p.texto), `${idea.id} resuelve ${s}`); return r; };
  }


  return {
    unidad: 'razonamiento-verbal.analogias',
    version: '0.3.2',
    calidad: 2,
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rv-texto.js', '/nucleo/kit/piezas/rv-soporte.js', '/nucleo/kit/piezas/rv-definicion.js'],
    historia: {
      texto: 'En la Poética, Aristóteles explicó una clase de metáfora con cuatro términos: la vejez es a la vida lo que la tarde es al día, y por eso se dice «la tarde de la vida». No buscaba armar exámenes, sino entender las metáforas. Su idea obliga a mirar la relación y su orden, no el parecido entre las palabras.',
      pregunta: '¿En qué se parecen la vejez y la tarde?',
      // La fuente es la que cita la matriz de la unidad (antes el título decía «Matriz de teoría…» y el enlace iba al CVC).
      fuente: { titulo: 'Aristóteles, Poética, capítulo XXI (Internet Classics Archive, MIT)', url: 'https://classics.mit.edu/Aristotle/poetics.3.3.html' },
    },
    // Glosario: las palabras con que el curso habla de analogías y de relaciones entre palabras. Cada idea estrena de 2 a 4
    // con `simple` y tres ejemplos: idea 1, analogía, par base, oración puente y agente e instrumento; idea 2, género y
    // especie y parte y todo; idea 3, causa y efecto y sucesión; idea 4, sinónimo y antónimo; idea 5, categoría
    // gramatical y sustantivo. «Elemento y conjunto» e «intensidad» van sin `simple`: son lo nuevo de la predicción de su
    // idea y no salen en «Palabras de esta idea» antes de jugar (como «definición negativa» en Definiciones). Los ejemplos
    // no usan pares ni palabras del juego, la predicción, «Ahora tú» ni los ejemplos de su idea (lo prueba analogias.test.js).
    glosario: [
      { termino: 'analogía', def: 'Parecido entre dos pares de palabras que se unen de la misma manera.',
        simple: 'Dos pares de palabras unidos de la misma forma.',
        ejemplos: ['«Ojo : ver» y «oído : oír»: cada órgano y lo que hace.', '«Lima : Perú» y «Quito : Ecuador»: cada capital y su país.', '«Lana : chompa» y «barro : olla»: el material y lo que se hace con él.'],
        ver: ['par base', 'oración puente'], formas: ['analogía', 'analogías'] },
      { termino: 'par base', def: 'Las dos palabras de la pregunta cuya relación hay que hallar repetida en otro par.',
        simple: 'El par de la pregunta, el que manda.',
        ejemplos: ['En «OJO : VER ::», el par base es «ojo : ver».', 'En el examen va primero y en mayúsculas.', 'Su relación se dice antes de mirar las alternativas.'],
        formas: ['par base', 'pares base'], ver: ['analogía'] },
      { termino: 'oración puente', def: 'Frase corta que dice cómo se une el par base; debe ser verdadera también con el otro par.',
        simple: 'Una frase que dice cómo se unen las dos palabras.',
        ejemplos: ['«El ojo sirve para ver».', '«Lima es la capital del Perú».', '«La lana es el material de la chompa».'],
        formas: ['oración puente', 'oraciones puente'], ver: ['relación'] },
      { termino: 'agente e instrumento', def: 'Relación entre quien hace un trabajo y la herramienta con que lo hace.',
        simple: 'Una persona y la herramienta de su trabajo.',
        ejemplos: ['«Mozo : bandeja»: el mozo trabaja con la bandeja.', '«Profesora : tiza»: la tiza es una herramienta de su trabajo.', 'El agente es quien trabaja; el instrumento, aquello con que trabaja.'],
        ver: ['relación'] },
      { termino: 'relación', def: 'Cómo se une el significado de dos palabras: herramienta, parte, tipo, causa u opuesto.',
        ejemplos: ['Entre «ojo» y «ver», la del órgano y lo que hace.', 'Entre «Lima» y «Perú», la de la capital y su país.', 'Dos palabras del mismo tema pueden tener relaciones distintas.'],
        ver: ['analogía'] },
      { termino: 'oración', def: 'Grupo de palabras con sentido completo, que dice algo sobre alguien o algo.',
        ejemplos: ['«El ojo sirve para ver».', '«Mañana llueve en Juliaca».', '«Rosa estudia».'], formas: ['oración', 'oraciones'] },
      { termino: 'género y especie', def: 'Relación entre una clase y uno de sus tipos: todo miembro del tipo está en la clase, no al revés.',
        simple: 'Un grupo grande y uno de sus tipos.',
        ejemplos: ['Toda lagartija es un reptil: «reptil» es su género.', 'Todo clavel es una planta, pero no toda planta es un clavel.', 'Todo martes es un día de la semana.'],
        ver: ['género próximo', 'especie'] },
      { termino: 'parte y todo', def: 'Relación entre una cosa entera y una de sus piezas, que la forma junto con piezas de otro tipo.',
        simple: 'Una pieza y la cosa entera que ayuda a formar.',
        ejemplos: ['«Tecla : teclado»: la tecla es una pieza del teclado.', '«Rueda : carretilla».', 'La pieza no es un tipo de la cosa: la tecla no es un teclado.'],
        ver: ['relación'] },
      { termino: 'elemento y conjunto', def: 'Relación entre uno de muchos iguales y el grupo hecho solo de ellos.',
        ejemplos: ['«Músico : orquesta».', '«Estrella : constelación».', '«Isla : archipiélago».'],
        ver: ['parte y todo'] },
      { termino: 'causa y efecto', def: 'Relación en que una cosa produce la otra; que venga antes no basta.',
        simple: 'Lo que produce algo y lo que sale de ello.',
        ejemplos: ['La sequía produce la hambruna.', 'La lluvia fuerte produce el desborde del río.', 'Comer mucho dulce produce dolor de barriga.'],
        ver: ['sucesión'] },
      { termino: 'sucesión', def: 'Orden en que una cosa viene después de otra, sin que la primera la produzca.',
        simple: 'Que algo venga después de otra cosa.',
        ejemplos: ['Diciembre viene antes que enero, pero no lo produce.', 'Después del segundo grado viene el tercero.', 'El número 7 viene después del 6.'],
        ver: ['causa y efecto'] },
      { termino: 'sinónimo', def: 'Palabra que dice casi lo mismo que otra sobre el mismo rasgo.',
        simple: 'Una palabra que significa casi lo mismo que otra.',
        ejemplos: ['«Rápido» y «veloz».', '«Comenzar» y «empezar».', '«Angosto» y «estrecho».'], formas: ['sinónimo', 'sinónimos'], ver: ['antónimo'] },
      { termino: 'antónimo', def: 'Palabra que dice lo opuesto de otra sobre el mismo rasgo.',
        simple: 'Una palabra que dice lo contrario de otra.',
        ejemplos: ['«Lleno» y «vacío».', '«Subir» y «bajar».', '«Pesado» y «liviano», en el peso.'], formas: ['antónimo', 'antónimos'], ver: ['sinónimo'] },
      { termino: 'intensidad', def: 'Relación entre dos palabras del mismo rasgo en que una lo dice con más fuerza.',
        ejemplos: ['«Grande» y «enorme».', '«Miedo» y «terror».', '«Sonreír» y «reír a carcajadas».'], ver: ['sinónimo'] },
      { termino: 'categoría gramatical', def: 'Tipo de palabra según lo que hace: sustantivo, verbo o adjetivo, entre otros.',
        simple: 'El tipo de palabra: nombra algo, dice una acción o dice cómo es.',
        ejemplos: ['«Viaje» es un sustantivo; «viajar», un verbo.', '«Lento» es un adjetivo: dice cómo es algo.', '«Lluvia» y «llover» hablan de lo mismo con distinta categoría.'],
        ver: ['sustantivo'] },
      { termino: 'sustantivo', def: 'Palabra que nombra una persona, un animal, una cosa, un lugar o una idea.',
        simple: 'Una palabra que nombra algo o a alguien.',
        ejemplos: ['«Mesa», «Juliaca» y «alegría» son sustantivos.', '«Viaje» es un sustantivo; «viajar», no.', 'Un sustantivo puede ir después de «el» o «la».'],
        formas: ['sustantivo', 'sustantivos'], ver: ['categoría gramatical'] },
    ],
    laboratorio: [mesaTaller, mesaCuaderno, mesaFichas, mesaPalabras, mesaFicha],
    // A qué idea pertenece cada mesa (Gerson, 16 nov: el laboratorio se agrupa por idea). El taller junta seis relaciones
    // (va con la idea 1: repetido en cada idea, saturaba la lista); las mesas viejas «En los dos sentidos» y «Sinónimos y antónimos» salieron en la
    // etapa 6 (repetían los juegos de la versión 0.2.0 con verde y carmín).
    laboratorioIdeas: {
      'taller': ['relacion-no-tema'],
      'cuaderno-mateo': ['parte-o-clase'],
      'fichas-feria': ['clase-y-causa'],
      'palabras-rosa': ['sinonimo-antonimo'],
      'ficha-puente': ['puente-justa'],
    },
    ideas: IDEAS_U,
  };
});
