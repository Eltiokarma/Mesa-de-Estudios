/*
 * Generador «Cohesión y coherencia»: práctica de las cinco ideas de razonamiento-verbal.cohesion-y-coherencia
 * (contenido/teoria/razonamiento-verbal/cohesion-y-coherencia.js; propuesta en docs/etapa9/propuesta-verbal.md). Formato
 * "predicciones" (docs/arquitectura.md). Funciona en el navegador (window.Generadores['cohesion-coherencia']) y en Node.
 *
 * Regla 1 en verbal: la respuesta no la decide un texto escrito a mano, la calcula el código con un mundo chico. Cada
 * ítem del banco trae su texto y los rasgos de lo que dice (de qué habla cada oración, cuándo y quién lo dice; género,
 * número y sentido de cada nombre; qué se calló; de qué parte cada oración; qué retoma y qué presenta cada candidata). El
 * generador decide con esos rasgos cuál alternativa cumple y arma el código y la explicación de cada incorrecta. Si un
 * ítem no cuadra (ninguna o dos que cumplen, dos incorrectas con el mismo código), lanza un error: generador.test.js
 * recorre el banco entero. Textos propios; ninguno copia un examen.
 *
 * Tipos por idea (TIPOS_POR_IDEA; nivel 2 con cuatro alternativas, nivel 3 con cinco, como en un simulacro; el formato
 * de la UNI va como hipótesis). generar(semilla, { idea }) da solo los de esa idea; sin idea, las cinco con el mismo peso.
 *   no-contradiccion          contradice (2) · contradice-examen (3)
 *   referente                 referente (2) · referente-examen (3)
 *   repetir-sustituir-callar  recursos (2) · recursos-examen (3)
 *   conocido-y-nuevo          hilo (2) · hilo-examen (3)
 *   incluir                   incluir (2) · incluir-examen (3)
 * Errores (docs/investigacion/razonamiento-verbal-ideas-erroneas.md): RV9, RV27, RV28 y, hipótesis de la unidad,
 * RVK1 a RVK18.
 * Datos (contrato, punto 13): los criterios de la idea (las mismas líneas que la teoría); nunca cuál cumple.
 * _datos: { idea, tipo, nivel, item, codigos }.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar, nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'cohesion-coherencia';
  const FUENTE = 'docs/investigacion/razonamiento-verbal-ideas-erroneas.md';
  const RESPALDO = { RV9: 'parcial', RV27: 'parcial', RV28: 'parcial' };
  const err = (id, explicacion) => ({ id, explicacion, respaldo: RESPALDO[id] || 'hipotesis', fuente: FUENTE });
  const falla = m => { throw new Error(`${ID}: ${m}`); };

  // ---------------- Datos: las mismas líneas que la teoría ----------------
  const D = {
    CONTRA: 'Contradicción: dos afirmaciones que no pueden ser verdad a la vez.',
    TRES: 'Hay contradicción si se afirma y se niega lo mismo, de lo mismo y en el mismo momento.',
    QUIEN: 'Lo que una persona cree o dice se le atribuye a ella, no al texto.',
    REFERENTE: 'Referente: aquello que nombra un pronombre como «lo», «ella» o «esto».',
    CONCUERDA: 'Concordancia: el pronombre y su referente tienen el mismo género y el mismo número.',
    SENTIDO: 'Con el referente puesto en lugar del pronombre, la oración tiene que tener sentido.',
    ANA_CATA: 'Anáfora: retoma algo dicho antes. Catáfora: anuncia algo que se dice después.',
    REPITE: 'Repetición: se vuelve a nombrar algo con la misma palabra.',
    SUSTITUYE: 'Sustitución: se nombra con un pronombre, con otro nombre o con uno más general.',
    CALLA: 'Elipsis: se calla algo ya dicho; el lector lo recupera de lo dicho justo antes.',
    TOPICO: 'Tópico: lo ya conocido de lo que parte una oración.',
    COMENTO: 'Comento: lo nuevo que la oración dice sobre su tópico.',
    DE_DONDE: 'El tópico puede ser lo nuevo de la oración anterior o el tema del inicio.',
    NADIE: 'Si el tópico no se presentó antes, el lector no sabe de qué se habla.',
    ANTES: 'Encaja antes: la oración retoma algo de la oración anterior.',
    DESPUES: 'Encaja después: presenta lo que la siguiente nombra o lo que anuncia su conector.',
    TEXTO: 'Encaja en el texto: no lo contradice ni cambia de tema.',
    TODOS: '«Todos» y «ninguno» hablan de cada uno del grupo, sin excepción.',
    CREE: 'Lo que alguien cree o piensa no es un hecho del texto.',
  };
  const DATOS = {
    contradice: [D.CONTRA, D.TRES, D.QUIEN, D.TODOS], referente: [D.REFERENTE, D.CONCUERDA, D.SENTIDO, D.ANA_CATA],
    recursos: [D.REPITE, D.SUSTITUYE, D.CALLA], hilo: [D.TOPICO, D.COMENTO, D.DE_DONDE, D.NADIE], incluir: [D.ANTES, D.DESPUES, D.TEXTO, D.CREE],
  };

  // ---------------- Idea 1: ¿se contradicen? ----------------
  // Cada oración: { de, cuando, quien, parte, dice, si } (si: true afirma, false niega). Chocan si hablan de lo mismo
  // (de y parte), del mismo momento, en boca del mismo (quien; null es el texto) y una afirma lo que la otra niega.
  const CONTRA = [
    { id: 'tienda', o: ['La tienda de la esquina abre todos los días.', 'Los lunes, la tienda no abre.'],
      a: [{ de: 'tienda', cuando: 'siempre', dice: 'abre-lunes', si: true }, { de: 'tienda', cuando: 'siempre', dice: 'abre-lunes', si: false }] },
    { id: 'ninguno', o: ['Ningún socio faltó a la asamblea de enero.', 'Tres socios no fueron a la asamblea de enero.'],
      a: [{ de: 'socios', cuando: 'enero', dice: 'todos-fueron', si: true }, { de: 'socios', cuando: 'enero', dice: 'todos-fueron', si: false }] },
    { id: 'lago', o: ['Esa noche, el lago estuvo en calma.', 'Esa noche, olas enormes golpearon los botes del lago.'],
      a: [{ de: 'lago', cuando: 'esa noche', dice: 'calma', si: true }, { de: 'lago', cuando: 'esa noche', dice: 'calma', si: false }] },
    { id: 'pasaje', o: ['En 2022, el pasaje a Puno costaba tres soles.', 'Hoy cuesta cuatro soles.'],
      a: [{ de: 'pasaje', cuando: '2022', dice: 'precio-3', si: true }, { de: 'pasaje', cuando: 'hoy', dice: 'precio-3', si: false }] },
    { id: 'tio', o: ['De niño, mi tío vivía en Ayaviri.', 'Ahora vive en Arequipa con su familia.'],
      a: [{ de: 'tío', cuando: 'antes', dice: 'en-ayaviri', si: true }, { de: 'tío', cuando: 'ahora', dice: 'en-ayaviri', si: false }] },
    { id: 'pelicula', o: ['Para Mario, la película fue aburrida.', 'Para Sonia, fue muy entretenida.'],
      a: [{ de: 'película', quien: 'Mario', dice: 'aburrida', si: true }, { de: 'película', quien: 'Sonia', dice: 'aburrida', si: false }] },
    { id: 'lluvia', o: ['El abuelo cree que lloverá en la tarde.', 'La radio dice que no lloverá.'],
      a: [{ de: 'tarde', quien: 'abuelo', dice: 'llueve', si: true }, { de: 'tarde', quien: 'radio', dice: 'llueve', si: false }] },
    { id: 'chompa', o: ['El cuerpo de la chompa de mi hermana es gris.', 'Sus mangas son de color rojo.'],
      a: [{ de: 'chompa', parte: 'cuerpo', dice: 'gris', si: true }, { de: 'chompa', parte: 'mangas', dice: 'gris', si: false }] },
    { id: 'casa', o: ['Las paredes de la casa de mi tía son de adobe.', 'Su techo es de calamina.'],
      a: [{ de: 'casa', parte: 'paredes', dice: 'adobe', si: true }, { de: 'casa', parte: 'techo', dice: 'adobe', si: false }] },
    { id: 'tanque', o: ['El martes, el tanque del colegio estuvo vacío.', 'Por eso, ese martes, los alumnos tomaron agua del tanque.'],
      a: [{ de: 'tanque', cuando: 'martes', dice: 'vacío', si: true }, { de: 'tanque', cuando: 'martes', dice: 'vacío', si: false }], conector: true },
  ];
  const igualDe = (x, y, k) => (x[k] || null) === (y[k] || null);
  function porQueContra(it) {
    const [x, y] = it.a;
    if (x.de !== y.de || x.dice !== y.dice || x.si === y.si) falla(`${it.id}: las dos oraciones no hablan de lo mismo`);
    if (!igualDe(x, y, 'cuando')) return 'tiempo';
    if (!igualDe(x, y, 'quien')) return 'persona';
    if (!igualDe(x, y, 'parte')) return 'parte';
    return 'choque';
  }
  const RAZON = {
    choque: 'Sí: afirman y niegan lo mismo a la vez', tiempo: 'No: cada una habla de un tiempo distinto',
    persona: 'No: cada una dice lo que cree otra persona', parte: 'No: cada una habla de una parte distinta',
  };
  const SOL_CONTRA = {
    choque: 'Aquí sí chocan: hablan de lo mismo y del mismo momento, y una niega lo que afirma la otra.',
    tiempo: 'Aquí no chocan, porque cada oración habla de un tiempo distinto.',
    persona: 'Aquí no chocan, porque cada oración cuenta lo que cree o dice una persona distinta.',
    parte: 'Aquí no chocan, porque cada oración habla de una parte distinta.',
  };
  function tContradice(rng, examen) {
    const it = rng.elegir(CONTRA), por = porQueContra(it);
    const malas = [];
    if (por === 'choque') {
      malas.push({ t: 'No: la segunda solo cuenta una excepción', cod: 'RV9', ex: 'Leíste bien las dos, pero no hay excepción: hablan de lo mismo y del mismo momento, y una niega lo que afirma la otra.' });
      malas.push({ t: 'Sí: las dos oraciones hablan de la misma cosa', cod: 'RVK3', ex: 'Acertaste el «sí», pero hablar de lo mismo no basta: chocan porque, en el mismo momento, una niega lo que afirma la otra.' });
      malas.push({ t: it.conector ? 'No: el conector une bien las dos oraciones' : 'Sí: les falta un conector que las una', cod: 'RVK1', ex: it.conector ? 'El conector une bien las oraciones, sí, pero no arregla lo que dicen: no se puede creer a la vez.' : 'Acertaste el «sí», pero no por esa razón: un conector no pone ni quita un choque; chocan porque una niega lo que afirma la otra.' });
      malas.push({ t: 'No: son de dos momentos', cod: 'RVK18', ex: 'Hiciste bien en buscar un cambio de tiempo, pero el texto no lo dice: las dos hablan del mismo momento.' });
    } else {
      malas.push({ t: 'Sí: dicen cosas opuestas', cod: 'RVK2', ex: `Viste bien que se oponen, pero ${por === 'tiempo' ? 'son de dos tiempos distintos' : por === 'persona' ? 'cada una dice lo que cree otra persona' : 'hablan de dos partes distintas'}, y así no chocan.` });
      malas.push({ t: 'Sí: les falta un conector que las una', cod: 'RVK1', ex: 'Es cierto que un conector las uniría, pero no pone ni quita un choque: eso depende de lo que dicen.' });
      malas.push({ t: 'No: las dos hablan de lo mismo, sin pelear', cod: 'RVK3', ex: 'Acertaste el «no», pero no por esa razón: mira de cuándo habla cada oración, de qué parte y quién lo dice.' });
      const otra = ['tiempo', 'persona', 'parte'].find(r => r !== por);
      malas.push({ t: RAZON[otra], cod: 'RVK18', ex: 'Acertaste el «no», pero el texto no dice eso: no chocan por otro motivo.' });
    }
    return armar(rng, it, examen, RAZON[por], malas, 'contradice',
      [examen ? 'Pregunta del simulacro.' : 'Coherencia.'], [`«${it.o.join(' ')}» ¿Se contradicen las dos oraciones?`],
      [['Primero se mira si las dos oraciones hablan de lo mismo y de la misma parte, del mismo momento y en boca de la misma persona.'], [SOL_CONTRA[por]]]);
  }

  // ---------------- Idea 2: ¿a qué se refiere? ----------------
  // El pronombre: { p, g, n } (g y n nulos en «esto», «eso»: recogen una idea entera). Cada candidato: { t, g, n,
  // sentido, cerca (el nombre más cercano antes), tipo: 'nombre' | 'hecho' | 'antes' (algo dicho en otro lado) |
  // 'despues' (lo que viene, cuando el pronombre retoma) }.
  const REF = [
    { id: 'cuaderno', o: 'Rosa dejó el cuaderno sobre el escritorio y lo forró con plástico.', pr: { p: 'lo', g: 'm', n: 's' },
      c: [{ t: 'Al cuaderno', g: 'm', n: 's', sentido: true }, { t: 'Al escritorio', g: 'm', n: 's', cerca: true }, { t: 'A Rosa', g: 'f', n: 's' }, { t: 'Al plástico, que viene después', tipo: 'despues' }] },
    { id: 'gallinas', o: 'Mi abuela cría gallinas cerca de las chacras. Las alimenta con maíz.', pr: { p: 'Las', g: 'f', n: 'p' },
      c: [{ t: 'A las gallinas', g: 'f', n: 'p', sentido: true }, { t: 'A las chacras', g: 'f', n: 'p', cerca: true }, { t: 'A mi abuela', g: 'f', n: 's' }, { t: 'Al maíz, que viene después', tipo: 'despues' }] },
    { id: 'pelota', o: 'Luis guardó la pelota en la mochila y la cerró.', pr: { p: 'la', g: 'f', n: 's' },
      c: [{ t: 'A la mochila', g: 'f', n: 's', sentido: true, cerca: true }, { t: 'A la pelota', g: 'f', n: 's' }, { t: 'A Luis', g: 'm', n: 's' }, { t: 'A algo que viene después', tipo: 'despues' }] },
    { id: 'directora', o: 'La directora felicitó a la profesora porque ella ganó el concurso de canto.', pr: { p: 'ella', g: 'f', n: 's' },
      c: [{ t: 'A la profesora', g: 'f', n: 's', sentido: true, cerca: true }, { t: 'A la directora', g: 'f', n: 's' }, { t: 'Al concurso de canto', g: 'm', n: 's' }, { t: 'A nadie: debió repetir el nombre', tipo: 'falta' }] },
    { id: 'aviso', o: 'El alcalde avisó esto: el agua se cortará el lunes en la mañana.', pr: { p: 'esto', hecho: true, mira: 'adelante' },
      c: [{ t: 'Al corte de agua del lunes en la mañana', tipo: 'hecho', sentido: true }, { t: 'Al alcalde, que lo dice', g: 'm', n: 's' }, { t: 'Al lunes, una palabra que viene', tipo: 'nombre' }, { t: 'A algo que el alcalde dijo antes, en otro aviso', tipo: 'antes' }, { t: 'Al agua de la ciudad', tipo: 'nombre2' }] },
    { id: 'robo', o: 'Alguien rompió el candado del quiosco. Eso asustó a los vecinos.', pr: { p: 'Eso', hecho: true, mira: 'atras' },
      c: [{ t: 'A que rompieran el candado', tipo: 'hecho', sentido: true }, { t: 'Al candado', tipo: 'nombre' }, { t: 'Al quiosco, el último nombre', tipo: 'nombre', cerca: true }, { t: 'A lo que viene después', tipo: 'despues' }, { t: 'A los vecinos', g: 'm', n: 'p' }] },
    { id: 'tios', o: 'Mis tíos llegaron de Juliaca con dos costales. Ellos saludaron a toda la familia.', pr: { p: 'Ellos', g: 'm', n: 'p' },
      c: [{ t: 'A mis tíos', g: 'm', n: 'p', sentido: true }, { t: 'A los dos costales', g: 'm', n: 'p', cerca: true, cosa: true }, { t: 'A Juliaca', g: 'f', n: 's' }, { t: 'A la familia, que viene después', tipo: 'despues' }] },
    { id: 'perro', o: 'Carmen llevó a su perro al veterinario. Él le puso una vacuna.', pr: { p: 'Él', g: 'm', n: 's' },
      c: [{ t: 'Al veterinario', g: 'm', n: 's', sentido: true, cerca: true }, { t: 'A su perro', g: 'm', n: 's' }, { t: 'A Carmen', g: 'f', n: 's' }, { t: 'A la vacuna, que viene después', tipo: 'despues' }] },
  ];
  // El referente cumple si concuerda (o, con «esto» y «eso», si es la idea entera) y tiene sentido.
  const cumpleRef = (pr, c) => !!c.sentido && (pr.hecho ? c.tipo === 'hecho' : c.g === pr.g && c.n === pr.n);
  function codigoRef(pr, c) {
    if (c.tipo === 'despues') return 'RVK15';
    if (c.tipo === 'antes') return 'RVK4';
    if (c.tipo === 'falta') return 'RVK8';
    if (pr.hecho) return c.tipo === 'nombre' && c.cerca ? 'RV27' : c.tipo === 'nombre' || c.tipo === 'nombre2' ? (c.tipo === 'nombre2' ? 'RVK7' : 'RVK5') : 'RVK6';
    if (c.g !== pr.g || c.n !== pr.n) return 'RVK14';
    return c.cerca ? 'RV27' : 'RVK6';
  }
  function explicaRef(pr, c) {
    const cod = codigoRef(pr, c);
    return {
      RVK15: 'Miraste bien hacia adelante, pero lo que viene después no es el referente: aquí el pronombre retoma algo ya dicho.',
      RVK4: 'Buscar atrás suele ir bien, pero aquí no hay nada antes: lo que se nombra viene después.',
      RVK8: 'Sí, repetir el nombre ayudaría, pero no hace falta: el sentido ya dice a quién se refiere.',
      RVK5: 'Ese nombre está en el texto, es cierto, pero el pronombre no recoge un solo nombre: recoge el hecho entero.',
      RVK7: 'Eso es parte del texto, es cierto, pero el pronombre recoge el hecho entero, no una parte.',
      RVK14: `Ese nombre está en el texto, sí, pero no concuerda con «${pr.p}» en género o número.`,
      RV27: 'Bien visto que es el nombre más cercano, pero puesto en lugar del pronombre, la oración no tiene sentido.',
      RVK6: 'Es cierto que concuerda, pero puesto en lugar del pronombre, la oración no tiene sentido.',
    }[cod];
  }
  function tReferente(rng, examen) {
    const it = rng.elegir(REF.filter(x => !examen || x.c.length >= 5)), pr = it.pr;
    const buenas = it.c.filter(c => cumpleRef(pr, c));
    if (buenas.length !== 1) falla(`${it.id}: ${buenas.length} referentes cumplen`);
    const malas = it.c.filter(c => c !== buenas[0]).map(c => ({ t: c.t, cod: codigoRef(pr, c), ex: explicaRef(pr, c) }));
    return armar(rng, it, examen, buenas[0].t, malas, 'referente',
      [examen ? 'Pregunta del simulacro.' : 'Referentes.'], [`En «${it.o}», ¿a qué se refiere «${pr.p}»?`],
      [[pr.hecho ? `«${pr.p}» pide una idea entera, y con esa idea en su lugar la oración tiene que tener sentido.` : `«${pr.p}» pide un referente del mismo género y número, y con ese referente en su lugar la oración tiene que tener sentido.`],
       [pr.hecho ? `Cumple «${buenas[0].t}»: recoge la idea entera, y la oración tiene sentido.` : `Cumple «${buenas[0].t}»: concuerda con «${pr.p}» y, puesto en su lugar, da sentido a la oración.`]]);
  }

  // ---------------- Idea 3: repetir, sustituir o callar ----------------
  // Dos formas. «callar»: { o, pide } y candidatos { t, rol }: 'ok' (lo callado: lo dicho justo antes, con su persona),
  // 'palabra' (otra palabra de la oración), 'persona' (otra persona), 'falta' (no se calló nada: «está incompleta»).
  // «sustituir»: la expresión que va en el espacio; { t, rol }: 'ok', 'noCorresponde' (otra clase de cosa), 'noConcuerda',
  // 'otro' (otro nombre del texto: cambia de qué se habla).
  const REC = [
    { id: 'feria', forma: 'callar', o: 'Mi papá vende queso; mi tío, mantequilla.', pide: '¿Qué se calló después de «mi tío»?',
      c: [{ t: 'vende', rol: 'ok' }, { t: 'queso', rol: 'palabra' }, { t: 'mi papá', rol: 'persona' }, { t: 'nada: la oración está incompleta', rol: 'falta' }] },
    { id: 'danza', forma: 'callar', o: 'Los de cuarto presentaron caporales; los de quinto, tinkus.', pide: '¿Qué se calló después de «los de quinto»?',
      c: [{ t: 'presentaron', rol: 'ok' }, { t: 'caporales', rol: 'palabra' }, { t: 'los de cuarto', rol: 'persona' }, { t: 'nada: la oración está incompleta', rol: 'falta' }] },
    { id: 'yo', forma: 'callar', o: 'Yo llevo las sillas; tú, las mesas.', pide: '¿Qué se calló después de «tú»?',
      c: [{ t: 'llevas', rol: 'ok' }, { t: 'llevo', rol: 'persona' }, { t: 'las sillas', rol: 'palabra' }, { t: 'nada: la oración está incompleta', rol: 'falta' }] },
    { id: 'medico', forma: 'callar', o: 'La enfermera tomó la presión de don Julio. Después, le dio una pastilla.', pide: '¿Quién le dio la pastilla?',
      c: [{ t: 'La enfermera', rol: 'ok' }, { t: 'Don Julio', rol: 'persona' }, { t: 'La presión', rol: 'palabra' }, { t: 'Nadie: falta quién se la dio', rol: 'falta' }] },
    { id: 'llama', forma: 'sustituir', o: 'La llama vive en las alturas. ¿…? carga hasta unos treinta kilos.', pide: '¿Qué expresión puede ir en el espacio?',
      c: [{ t: 'Este animal', rol: 'ok' }, { t: 'Este cerro', rol: 'noCorresponde' }, { t: 'Ellos', rol: 'noConcuerda' }, { t: 'Las alturas', rol: 'otro' }, { t: 'Esta planta', rol: 'noCorresponde2' }] },
    { id: 'trucha', forma: 'sustituir', o: 'La trucha se cría en el lago Titicaca. ¿…? se vende en el mercado de Puno.', pide: '¿Qué expresión puede ir en el espacio?',
      c: [{ t: 'Este pescado', rol: 'ok' }, { t: 'Este animal de carga', rol: 'noCorresponde' }, { t: 'Ellas', rol: 'noConcuerda' }, { t: 'El lago', rol: 'otro' }, { t: 'Esta fruta', rol: 'noCorresponde2' }] },
    { id: 'quena', forma: 'sustituir', o: 'Mi primo toca la quena en la banda. ¿…? se hace de caña.', pide: '¿Qué expresión puede ir en el espacio?',
      c: [{ t: 'Este instrumento', rol: 'ok' }, { t: 'Este pueblo', rol: 'noCorresponde' }, { t: 'Él', rol: 'noConcuerda' }, { t: 'La banda del colegio de mi primo', rol: 'otro' }, { t: 'Esta comida', rol: 'noCorresponde2' }] },
    { id: 'colca', forma: 'sustituir', o: 'El cañón del Colca está en Arequipa. ¿…? es uno de los más hondos del país.', pide: '¿Qué expresión puede ir en el espacio?',
      c: [{ t: 'Este cañón', rol: 'ok' }, { t: 'Esta laguna', rol: 'noCorresponde' }, { t: 'Ellas', rol: 'noConcuerda' }, { t: 'Arequipa', rol: 'otro' }, { t: 'Este animal', rol: 'noCorresponde2' }] },
  ];
  const COD_REC = { palabra: 'RVK7', persona: 'RVK16', falta: 'RVK8', noCorresponde: 'RVK17', noConcuerda: 'RVK14', otro: 'RVK7', noCorresponde2: 'RVK6' };
  const EX_REC = {
    palabra: 'Miraste bien lo dicho antes, pero esa palabra no es lo que se calló: en ese lugar, la oración no tendría sentido.',
    persona: 'Buscaste bien antes, pero eso va con otra persona: lo callado concuerda con quien hace la acción en esa parte.',
    falta: 'Sí falta una palabra, pero la oración no está incompleta: se calla porque ya se dijo.',
    noCorresponde: 'Sí, sustituir sirve aquí, pero esa expresión nombra otra clase de cosa.',
    noConcuerda: 'Es cierto que un pronombre evita repetir, pero ese no concuerda en género o número con lo que se nombra.',
    otro: 'Ese nombre está en el texto, es cierto, pero con él la oración habla de otra cosa.',
    noCorresponde2: 'Esa expresión concuerda en género y número, es cierto, pero no tiene sentido: nombra otra clase de cosa.',
  };
  function tRecursos(rng, examen) {
    const it = rng.elegir(REC.filter(x => !examen || x.c.length >= 5));
    const buenas = it.c.filter(c => c.rol === 'ok');
    if (buenas.length !== 1) falla(`${it.id}: ${buenas.length} cumplen`);
    const malas = it.c.filter(c => c.rol !== 'ok').map(c => ({ t: c.t, cod: COD_REC[c.rol], ex: EX_REC[c.rol] }));
    return armar(rng, it, examen, buenas[0].t, malas, 'recursos',
      [examen ? 'Pregunta del simulacro.' : 'Cohesión.'], [`«${it.o}» ${it.pide}`],
      [[it.forma === 'callar' ? 'Lo callado se recupera de lo dicho justo antes, y el verbo va en la persona y el número de quien hace la acción.' : 'El sustituto tiene que nombrar lo mismo que la oración anterior y concordar con eso en género y número.'],
       [it.forma === 'callar' ? `Lo que se recupera es «${buenas[0].t}».` : `En el espacio va «${buenas[0].t}», que nombra lo mismo y concuerda.`]]);
  }

  // ---------------- Idea 4: el hilo ----------------
  // Cada oración: { t, parte, trae } (de qué parte, qué presenta). La 1 presenta el tema. Corta el hilo la que parte de
  // algo que nadie presentó. Las incorrectas: una que vuelve al tema del inicio (RVK9), una que parte de lo nuevo de la
  // anterior (RVK10), la 1 (RV28) y «Ninguna» (RVK3).
  const HILO = [
    { id: 'charango', o: [{ t: 'Mi hermano compró un charango.', parte: 'hermano', trae: ['charango'] }, { t: 'El charango tiene diez cuerdas.', parte: 'charango', trae: ['cuerdas'] },
      { t: 'Esas cuerdas son de nailon.', parte: 'cuerdas', trae: [] }, { t: 'Mi hermano lo toca en las fiestas.', parte: 'hermano', trae: ['fiestas'] }, { t: 'Los premios eran de plata.', parte: 'premios', trae: [] }] },
    { id: 'mercado', o: [{ t: 'El mercado de Lampa abre los domingos.', parte: 'mercado', trae: ['domingos'] }, { t: 'Ese día llegan vendedores de las comunidades.', parte: 'domingos', trae: ['vendedores'] },
      { t: 'Los vendedores traen papa, queso y lana.', parte: 'vendedores', trae: ['papa'] }, { t: 'El mercado cierra a las tres de la tarde.', parte: 'mercado', trae: [] }, { t: 'La profesora llegó tarde al salón.', parte: 'profesora', trae: [] }] },
    { id: 'huerto', o: [{ t: 'La escuela de Acora tiene un biohuerto.', parte: 'escuela', trae: ['biohuerto'] }, { t: 'En el biohuerto crecen habas y lechugas.', parte: 'biohuerto', trae: ['habas'] },
      { t: 'La escuela vende la cosecha en la feria.', parte: 'escuela', trae: ['cosecha'] }, { t: 'Esa cosecha paga los cuadernos del año.', parte: 'cosecha', trae: [] }, { t: 'El entrenador pidió más balones.', parte: 'entrenador', trae: [] }] },
    { id: 'bici', o: [{ t: 'Ana arregló su bicicleta vieja.', parte: 'Ana', trae: ['bicicleta'] }, { t: 'La bicicleta tenía la cadena rota.', parte: 'bicicleta', trae: ['cadena'] },
      { t: 'Ana compró una cadena nueva en Juliaca.', parte: 'Ana', trae: ['Juliaca'] }, { t: 'Los jueces anunciaron a los ganadores.', parte: 'jueces', trae: [] }, { t: 'Ahora Ana va en bicicleta al colegio.', parte: 'Ana', trae: [] }] },
    { id: 'ciencias', o: [{ t: 'El colegio organizó una feria de ciencias.', parte: 'colegio', trae: ['feria'] }, { t: 'En la feria hubo veinte proyectos.', parte: 'feria', trae: ['proyectos'] },
      { t: 'Esos proyectos los hicieron alumnos de todos los grados.', parte: 'proyectos', trae: ['alumnos'] }, { t: 'El colegio entregó diplomas a cada grupo.', parte: 'colegio', trae: ['diplomas'] }, { t: 'Las ovejas del tío se escaparon del corral.', parte: 'ovejas', trae: [] }] },
  ];
  function hiloDe(it) {
    const sabe = new Set([it.o[0].parte, ...it.o[0].trae]), out = [{ k: 1, sigue: true, lineal: false, inicio: true }];
    let antes = it.o[0].trae;
    it.o.slice(1).forEach((x, i) => { out.push({ k: i + 2, sigue: sabe.has(x.parte), lineal: antes.includes(x.parte), tema: x.parte === it.o[0].parte }); x.trae.forEach(t => sabe.add(t)); sabe.add(x.parte); antes = x.trae; });
    return out;
  }
  function tHilo(rng, examen) {
    const it = rng.elegir(HILO), h = hiloDe(it);
    const corta = h.filter(r => !r.sigue);
    if (corta.length !== 1) falla(`${it.id}: ${corta.length} oraciones cortan el hilo`);
    const tema = h.find(r => r.k > 1 && r.sigue && r.tema && !r.lineal), lineal = h.find(r => r.k > 1 && r.sigue && r.lineal);
    if (!tema || !lineal) falla(`${it.id}: falta una oración que vuelva al tema o una que parta de lo nuevo`);
    const malas = [
      { t: `La ${tema.k}`, cod: 'RVK9', ex: `Bien visto que la ${tema.k} no parte de lo nuevo de la anterior, pero vuelve al tema del inicio, y eso también sigue el hilo.` },
      { t: `La ${lineal.k}`, cod: 'RVK10', ex: `Bien visto que la ${lineal.k} retoma algo de la anterior, pero retomar lo dicho no corta el hilo: lo mantiene.` },
      { t: 'Ninguna', cod: 'RVK3', ex: 'Es cierto que todas parecen del mismo asunto, pero una parte de algo que nadie presentó.' },
      { t: 'La 1', cod: 'RV28', ex: 'La 1 trae algo nuevo, es cierto, pero es la que presenta el tema: no tiene que partir de nada anterior.' },
    ];
    const lista = it.o.map((x, i) => `${i + 1}. ${x.t}`).join(' ');
    return armar(rng, it, examen, `La ${corta[0].k}`, malas, 'hilo',
      [examen ? 'Pregunta del simulacro.' : 'El hilo del texto.'], [`${lista} ¿Qué oración corta el hilo del texto?`],
      [['Cada oración parte de algo ya dicho: de lo nuevo de la anterior o del tema del inicio.'], [`La ${corta[0].k} corta el hilo, porque parte de algo que nadie presentó antes.`]]);
  }

  // ---------------- Idea 5: la oración que falta ----------------
  // Cada candidata: { t, antes, despues, choca }. Cumple la que retoma lo de antes, prepara lo de después y no choca.
  const INC = [
    { id: 'cancha', o: ['El colegio techó su cancha deportiva.', '¿…?', 'Por eso, ahora los partidos se juegan aunque llueva.'],
      c: [{ t: 'Antes, si llovía, no había partido.', antes: true, despues: true }, { t: 'La cancha mide treinta metros de largo.', antes: true },
        { t: 'Los partidos de vóley son los viernes.', despues: true }, { t: 'La cancha sigue sin techo hasta hoy.', antes: true, despues: true, choca: true }, { t: 'La biblioteca tiene libros nuevos.' }] },
    { id: 'tejedoras', o: ['En Taquile, muchas familias tejen.', '¿…?', 'Esas prendas se venden a los visitantes de la isla.'],
      c: [{ t: 'Con la lana hacen chullos, fajas y chalecos.', antes: true, despues: true }, { t: 'Las familias de la isla son numerosas.', antes: true },
        { t: 'Las prendas de algodón se lavan fácil y se secan rápido.', despues: true }, { t: 'Nadie en la isla sabe tejer prendas.', antes: true, despues: true, choca: true }, { t: 'El bus a Juliaca sale a las seis.' }] },
    { id: 'pozo', o: ['La comunidad cavó un pozo nuevo en junio.', '¿…?', 'Con esa agua riegan las chacras en la época seca.'],
      c: [{ t: 'El pozo da agua limpia todo el año.', antes: true, despues: true }, { t: 'El pozo tiene un brocal de piedra.', antes: true },
        { t: 'El agua de lluvia se junta en baldes.', despues: true }, { t: 'El pozo se secó a la semana de abrirlo.', antes: true, despues: true, choca: true }, { t: 'Los niños juegan fútbol en la plaza.' }] },
    { id: 'radio', o: ['El colegio tiene una radio escolar.', '¿…?', 'En esos programas, los alumnos leen noticias del barrio.'],
      c: [{ t: 'Cada viernes, la radio emite dos programas.', antes: true, despues: true }, { t: 'La radio funciona en la sala de cómputo.', antes: true },
        { t: 'Los programas de televisión son largos y aburridos.', despues: true }, { t: 'La radio nunca ha emitido un programa.', antes: true, despues: true, choca: true }, { t: 'El quiosco de la esquina vende emoliente.' }] },
    { id: 'vicuñas', o: ['La comunidad cuida un rebaño de vicuñas.', '¿…?', 'Esa fibra se vende a buen precio.'],
      c: [{ t: 'Cada dos años, las esquilan en un chaccu.', antes: true, despues: true }, { t: 'Las vicuñas viven en la puna.', antes: true },
        { t: 'La fibra de oveja es más gruesa y se vende en Juliaca.', despues: true }, { t: 'A esas vicuñas nunca se les saca fibra.', antes: true, despues: true, choca: true }, { t: 'La plaza del pueblo tiene bancas nuevas.' }] },
  ];
  function codigoInc(c) {
    if (c.choca) return 'RV9';
    if (c.antes && !c.despues) return 'RVK12';
    if (!c.antes && c.despues) return 'RVK11';
    return 'RVK3';
  }
  const EX_INC = {
    RV9: 'Es cierto que se apoya en las dos, pero choca con lo que dice el texto.',
    RVK12: 'Retoma bien lo de antes, pero no prepara lo que nombra la siguiente.',
    RVK11: 'Prepara bien lo que sigue, pero no retoma lo de antes.',
    RVK3: 'Puede parecer del mismo lugar, es cierto, pero cambia de tema.',
  };
  function tIncluir(rng, examen) {
    const it = rng.elegir(INC);
    const buenas = it.c.filter(c => c.antes && c.despues && !c.choca);
    if (buenas.length !== 1) falla(`${it.id}: ${buenas.length} cumplen`);
    const malas = it.c.filter(c => c !== buenas[0]).map(c => ({ t: c.t, cod: codigoInc(c), ex: EX_INC[codigoInc(c)] }));
    const lista = it.o.map((x, i) => `${i + 1}. ${x}`).join(' ');
    return armar(rng, it, examen, buenas[0].t, malas, 'incluir',
      [examen ? 'Pregunta del simulacro.' : 'Inclusión.'], [`${lista} ¿Qué oración va en el espacio?`],
      [['La oración que falta retoma lo de antes, prepara lo de después y no choca con el texto.'], [`La única que pasa las tres pruebas es «${buenas[0].t}»`]]);
  }

  // ---------------- Armado común ----------------
  // Las incorrectas que se muestran: k al azar (3 en el nivel 2, 4 en el examen), con códigos distintos, de modo que la
  // correcta no sea la más larga ni la más corta (un empate no delata) ni la única que empieza distinto cuando todas las
  // incorrectas empiezan igual («Sí» contra tres «No»), ni la única con más o menos palabras. Si ninguna mezcla sirve, el ítem no cuadra.
  const pal = t => t.split(/\s+/).length;
  // Única con más o menos palabras que todas las demás (si no todas tienen las mismas).
  const extremaEn = (ns, c) => new Set(ns.concat(c)).size > 1 && (c > Math.max(...ns) || c < Math.min(...ns));
  function elegir(rng, malas, k, correcta) {
    const sirve = xs => {
      const l = xs.map(x => x.t.length).concat(correcta.length), c = correcta.length, mx = Math.max(...l), mn = Math.min(...l);
      const pri = t => ({ al: 'a', del: 'de' }[t.split(/[\s:,]/)[0].toLowerCase()] || t.split(/[\s:,]/)[0].toLowerCase()), sola = new Set(xs.map(x => pri(x.t))).size === 1 && pri(xs[0].t) !== pri(correcta);
      return new Set(xs.map(x => x.cod)).size === xs.length && !(c === mx && l.filter(x => x === mx).length === 1) && !(c === mn && l.filter(x => x === mn).length === 1) && !sola && !extremaEn(xs.map(x => pal(x.t)), pal(correcta));
    };
    for (let n = 0; n < 120; n++) { const xs = rng.barajar(malas).slice(0, k); if (sirve(xs)) return xs; }
    return falla(`con «${correcta}» ninguna mezcla de ${k} incorrectas sirve`);
  }
  function armar(rng, it, examen, correcta, malas, base, enunciado, pregunta, solucion) {
    const errores = elegir(rng, malas, examen ? 4 : 3, correcta).map(m => Object.assign({ clave: `alt:${m.t}`, texto: m.t }, err(m.cod, m.ex)));
    return { enunciado, pregunta, datos: DATOS[base], correcta, errores, solucion, _datos: { item: it.id } };
  }

  // ---------------- Tipos por idea ----------------
  const CONSTRUIR = {
    contradice: rng => tContradice(rng, false), 'contradice-examen': rng => tContradice(rng, true),
    referente: rng => tReferente(rng, false), 'referente-examen': rng => tReferente(rng, true),
    recursos: rng => tRecursos(rng, false), 'recursos-examen': rng => tRecursos(rng, true),
    hilo: rng => tHilo(rng, false), 'hilo-examen': rng => tHilo(rng, true),
    incluir: rng => tIncluir(rng, false), 'incluir-examen': rng => tIncluir(rng, true),
  };
  const TIPOS_POR_IDEA = {
    'no-contradiccion': ['contradice', 'contradice-examen'],
    'referente': ['referente', 'referente-examen'],
    'repetir-sustituir-callar': ['recursos', 'recursos-examen'],
    'conocido-y-nuevo': ['hilo', 'hilo-examen'],
    'incluir': ['incluir', 'incluir-examen'],
  };
  const IDEAS = Object.keys(TIPOS_POR_IDEA);
  const IDEA_DE = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map(t => [t, i])));
  const NIVEL = Object.fromEntries(Object.keys(CONSTRUIR).map(t => [t, /examen/.test(t) ? 3 : 2]));
  // Papel (regla 6; herramientas/papel-generador.js toma «papel-1» a «papel-8»): las cinco ideas, de menos a más.
  const PAPEL = { 'papel-1': 'contradice', 'papel-2': 'referente', 'papel-3': 'recursos', 'papel-4': 'hilo', 'papel-5': 'incluir',
    'papel-6': 'referente-examen', 'papel-7': 'hilo-examen', 'papel-8': 'incluir-examen' };

  function generar(semilla, opciones) {
    const o = typeof opciones === 'string' ? { unidad: opciones } : opciones || {};
    const rng = Azar.crear(`${ID}|${semilla}`);
    const tipo = (!o.idea && PAPEL[String(semilla)]) || rng.elegir(TIPOS_POR_IDEA[TIPOS_POR_IDEA[o.idea] ? o.idea : rng.elegir(IDEAS)]);
    const pr = CONSTRUIR[tipo](rng);
    const alternativas = P.armarTexto({ correcta: { clave: `ok:${pr.correcta}`, texto: pr.correcta }, errores: pr.errores, rng });
    return {
      id: `${ID}#${semilla}`, variables: {}, enunciado: pr.enunciado, pregunta: pr.pregunta, datos: pr.datos, alternativas,
      solucion: pr.solucion, respuesta: { valor: `ok:${pr.correcta}`, texto: pr.correcta, unidad: '' },
      _datos: Object.assign({ idea: IDEA_DE[tipo], tipo, nivel: NIVEL[tipo], codigos: alternativas.filter(a => a.error).map(a => a.error.id) }, pr._datos),
    };
  }

  return { id: ID, titulo: 'Cohesión y coherencia', generar, TIPOS_POR_IDEA, NIVEL, TIPOS: Object.keys(CONSTRUIR), CONTRA, REF, REC, HILO, INC };
});
