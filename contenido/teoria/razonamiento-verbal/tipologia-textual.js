/*
 * Teoría de «El texto y sus tipos» (razonamiento-verbal.tipologia-textual). Molde: docs/teoria.md. Contenido: matriz
 * de verbal (unidad 8), historia (Beaugrande y Dressler 1981; Werlich 1975; Adam) y códigos RV13, RV41, RV42 y RV57.
 * Textos propios (regla 5). Ruta C · Comparar: el mismo tema en cuatro versiones; cambia el propósito y su evidencia.
 *
 * Ficha de tarea:
 *   Promesa: reconocer el tipo de texto por el propósito que domina, no por el tema ni el vocabulario.
 *   Persona y condiciones: postulante de 3.º a 5.º, celular, sin audio; tipología y niveles (UNI 10 y 12, UNMSM 1–2).
 *   Resultado observable: clasifica por la organización dominante y señala la evidencia; reconoce una secuencia secundaria.
 *   Orden de atención: 1.º el texto · 2.º las marcas del propósito · 3.º el sello del tipo · acción: cambiar la versión.
 *   Estados: tipo reconocido (i) · rasgo de superficie que engaña (h).
 *   Duda que resuelve: ¿por qué un texto lleno de cifras puede no ser expositivo?
 *
 * Colores (regla 4): la evidencia del propósito i (turquesa, continuo), la pregunta o la afirmación que se evalúa o
 * (naranja, discontinuo), el propósito o el nivel d (verde, punteado), el rasgo que engaña h (rojo).
 * Códigos: RV13, RV14, RV41 (tipo por rasgo de superficie), RV42, RV57; RVT1 (texto = extensión) y RVT2 (nivel por
 * la dificultad y no por dónde está la respuesta) son hipótesis nuevas.
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
  const ev = t => ({ v: 'c-i', t }), op = t => ({ v: 'c-o', t }), prop = t => ({ v: 'c-d', t }), mal = t => ({ v: 'c-h', t });
  const opciones = (c, malas) => [{ id: 'c', texto: c, correcta: true }, ...malas.map(([texto, error, siFuera], k) => ({ id: `e${k}`, texto, error, siFuera }))];
  const voltear = (arr, s) => (s % 2 ? arr.slice().reverse() : arr.slice());
  // Texto con trozos marcables: [['texto'], ['evidencia', 'e'], …]; los trozos con 'e' reciben ids e0, e1…
  function texto(titulo, partes) {
    let k = 0, n = 0;
    return { secciones: [{ id: 'o', titulo, modo: 'tarjeta', fragmentos: partes.map(([t, e]) => (e ? { id: `e${k++}`, t } : { id: `t${n++}`, t })) }] };
  }
  const evid = d => Object.fromEntries(d.secciones[0].fragmentos.filter(f => /^e/.test(f.id)).map(f => [f.id, 'i']));

  // ---------- Idea 1: el propósito decide el tipo ----------
  // Cambia: la versión del texto (narra, describe, explica, argumenta). Permanece: el tema (la helada en la puna).
  // Progresa: la evidencia que marca cada propósito. Se reserva: el texto con cifras que en verdad argumenta
  // (predicción). Debe verse: que el tema no cambia y el tipo sí.
  const VERS = {
    narra: { tipo: 'Narrativo: cuenta sucesos', partes: [['Aquella noche de junio,'], ['Rosa despertó', 'e'], ['por el frío.'], ['Salió con una linterna', 'e'], ['y'], ['encontró', 'e'], ['las hojas de papa cubiertas de escarcha.']] },
    describe: { tipo: 'Descriptivo: muestra cómo es', partes: [['Al amanecer, la chacra está'], ['blanca y dura', 'e'], [':'], ['las hojas de papa', 'e'], ['lucen'], ['rígidas, quemadas en los bordes', 'e'], [', y el suelo cruje bajo los pies.']] },
    explica: { tipo: 'Expositivo: explica por qué', partes: [['La helada ocurre'], ['porque', 'e'], ['el suelo pierde calor en noches sin nubes.'], ['Cuando', 'e'], ['baja de cero grados, el agua de las hojas se congela'], ['y', 'e'], ['rompe sus células.']] },
    argumenta: { tipo: 'Argumentativo: defiende una postura', partes: [['Las comunidades'], ['deberían', 'e'], ['recibir alertas de helada por radio.'], ['Así', 'e'], ['podrían cubrir sus cultivos a tiempo.'], ['Es injusto que', 'e'], ['se enteren cuando ya perdieron la cosecha.']] },
  };
  const figVer = k => texto('Tema: la helada', VERS[k].partes);
  const estVer = (k, extra = {}) => Object.assign({ marcas: evid(figVer(k)), sellos: { o: { t: VERS[k].tipo.split(':')[0], c: 'd' } } }, extra);
  const proposito = {
    id: 'proposito',
    titulo: 'El propósito decide el tipo',
    temas: ['Textos expositivos', 'Textos narrativos y descriptivos', 'Textos argumentativos'],
    pieza: 'rv-texto',
    juega: {
      consigna: 'El tema es siempre la helada. Cambia la versión del texto y mira qué palabras delatan lo que busca.',
      voz: 'Fíjate en lo marcado: es la evidencia del propósito.',
      controles: [{ id: 'v', etiqueta: 'Versión', opciones: [{ valor: 'narra', texto: 'A' }, { valor: 'describe', texto: 'B' }, { valor: 'explica', texto: 'C' }, { valor: 'argumenta', texto: 'D' }] }],
      dibujo: val => ({ datos: figVer(val.v), estado: estVer(val.v) }),
      lectura: val => [corto(prop, VERS[val.v].tipo)],
      minimo: 4,
    },
    predice: {
      pregunta: 'Este texto sobre el agua trae cifras y datos. ¿Qué tipo de texto domina?',
      voz: 'Pregúntate para qué usa las cifras.',
      opciones: opciones('Argumentativo: las cifras apoyan una postura', [
        ['Expositivo: tiene cifras y datos', 'RV41', 'Las cifras suelen aparecer al explicar; aquí sirven para pedir un cambio.'],
        ['Narrativo: habla de lo que pasó', 'RV41', 'Menciona un dato pasado, pero no cuenta una historia.'],
        ['Descriptivo: dice cómo es el agua', 'RV13', 'No muestra cómo es el agua; defiende qué hacer con ella.'],
      ]),
      dibujo: { datos: texto('Texto', [['En Puno, el 30 % de las casas no tiene agua potable.'], ['Cada familia gasta dos horas al día en traerla.'], ['Por eso, el municipio debe priorizar las redes de agua'], ['antes que las obras de ornato.']]), estado: {} },
      revelar: { datos: texto('Texto', [['En Puno, el 30 % de las casas no tiene agua potable.'], ['Cada familia gasta dos horas al día en traerla.'], ['Por eso, el municipio debe priorizar las redes de agua', 'e'], ['antes que las obras de ornato.']]), estado: { marcas: { e0: 'i', t0: 'o', t1: 'o' }, sellos: { o: { t: 'Argumentativo', c: 'd' } } } },
      coincide: 'Coincide: «el municipio debe…» es la tesis; las cifras la sostienen.',
    },
    mira: {
      datos: figVer('argumenta'),
      pasos: [
        { estado: { marcas: {} }, texto: 'Mismo tema que las otras versiones: la helada.', ecuacion: ['tema = helada'] },
        { estado: { marcas: { e0: 'i' }, nuevo: ['e0'] }, texto: '«Deberían» propone algo: hay una postura.', ecuacion: [ev('deberían'), ' → ', prop('tesis')] },
        { estado: { marcas: { e0: 'i', e1: 'i', e2: 'i' }, nuevo: ['e1', 'e2'] }, texto: '«Así…» y «es injusto…» la sostienen: son razones.', ecuacion: [ev('razones'), ' → ', prop('tesis')] },
        { estado: estVer('argumenta'), texto: 'Lo que organiza el texto es defender una postura: argumentativo.', ecuacion: [prop('propósito'), ' = tipo'] },
      ],
    },
    regla: {
      texto: 'El tipo de texto lo decide el propósito que organiza el conjunto: narrar sucesos, describir cómo es algo, explicar por qué ocurre o defender una postura. El tema no decide.',
      ecuacion: [prop('propósito dominante'), ' → tipo · ', mal('tema'), ' ↛ tipo'],
      condicion: 'se mira qué organiza todo el texto; un texto puede mezclar tipos y uno domina.',
    },
    ahoraTu: {
      generar(s) {
        const B = [
          { o: 'El cóndor andino tiene alas de más de tres metros, plumas negras y un collar blanco en el cuello.', ok: 'Descriptivo', m: [['Narrativo', 'RV41', 'No cuenta sucesos: muestra rasgos del ave.'], ['Expositivo', 'RV41', 'Da datos, pero no explica causas ni procesos: describe.'], ['Argumentativo', 'RV13', 'No defiende ninguna postura.']] },
          { o: 'Cuando la luna pasa entre el sol y la Tierra, tapa la luz del sol: por eso se produce un eclipse solar.', ok: 'Expositivo', m: [['Narrativo', 'RV41', 'No cuenta lo que le pasó a alguien: explica un fenómeno.'], ['Descriptivo', 'RV13', 'No muestra cómo se ve: explica por qué ocurre.'], ['Argumentativo', 'RV14', 'No propone nada: explica.']] },
          { o: 'El colegio debería tener un huerto: los alumnos aprenderían ciencias y comerían mejor.', ok: 'Argumentativo', m: [['Expositivo', 'RV33', 'Da razones, pero para defender una propuesta: «debería».'], ['Descriptivo', 'RV13', 'No muestra cómo es un huerto: propone tenerlo.'], ['Narrativo', 'RV41', 'No cuenta sucesos.']] },
          { o: 'El lunes, Mateo perdió el bus; corrió tres cuadras y llegó justo cuando cerraban la puerta.', ok: 'Narrativo', m: [['Descriptivo', 'RV41', 'No muestra cómo es Mateo: cuenta lo que hizo.'], ['Expositivo', 'RV13', 'No explica un fenómeno: cuenta sucesos en orden.'], ['Argumentativo', 'RV14', 'No defiende ninguna postura.']] },
          { o: 'En 2023, el 40 % de los jóvenes leyó menos de un libro. Hay que llevar bibliotecas a los barrios.', ok: 'Argumentativo', m: [['Expositivo', 'RV41', 'Trae una cifra, pero para sostener «hay que llevar».'], ['Narrativo', 'RV41', 'Tiene un año, pero no cuenta una historia.'], ['Descriptivo', 'RV13', 'No muestra cómo es algo.']] },
          { o: 'La quinua se lava para quitarle la saponina, una sustancia amarga; luego se cocina como el arroz.', ok: 'Expositivo', m: [['Narrativo', 'RV41', 'Tiene pasos en orden, pero no cuenta lo que le pasó a alguien: explica un proceso.'], ['Descriptivo', 'RV13', 'No se detiene en cómo es la quinua: explica qué se hace y por qué.'], ['Argumentativo', 'RV14', 'No defiende ninguna postura.']] },
        ];
        const b = B[s % B.length];
        return {
          pregunta: '¿Qué tipo de texto es, según su propósito dominante?',
          dibujo: { datos: texto('Texto', [[b.o]]), estado: {} },
          opciones: opciones(b.ok, voltear(b.m, s)),
          solucion: { texto: 'Se pregunta para qué está escrito todo el texto.', ecuacion: [prop('propósito'), ' → ', ev(b.ok.toLowerCase())] },
        };
      },
    },
  };

  // ---------- Idea 2: qué hace que algo sea un texto ----------
  // Cambia: la versión del aviso (completo, oraciones sueltas, sin destinatario). Permanece: el tema del aviso.
  // Progresa: la norma de textualidad que falla. Se reserva: el texto de una sola palabra (predicción).
  // Debe verse: que una lista de oraciones correctas puede no ser un texto.
  const AVISO = {
    completo: { partes: [['Vecinos de la calle Lima:', 'e'], ['el sábado cortarán el agua de 8 a 14 h'], ['por arreglo de tuberías.', 'e'], ['Llenen sus baldes el viernes.', 'e']], dice: 'Es un texto: tiene sentido y propósito', ok: true },
    sueltas: { partes: [['El sábado es un día.'], ['Las tuberías son de plástico.'], ['Los baldes tienen asa.'], ['La calle Lima es larga.']], dice: 'Falla la coherencia: no forman un todo', ok: false },
    sinquien: { partes: [['Cortarán el agua.'], ['Llenen sus baldes.']], dice: 'Falla la situación: ¿cuándo?, ¿a quién?', ok: false },
  };
  const figAv = k => texto('Aviso', AVISO[k].partes);
  const textualidad = {
    id: 'normas-textualidad',
    titulo: 'Qué hace que algo sea texto',
    temas: ['Texto y normas de textualidad'],
    pieza: 'rv-texto',
    juega: {
      consigna: 'Compara tres versiones del aviso del agua. Mira cuál funciona como texto y qué le falta a las otras.',
      voz: 'Que cada oración esté bien escrita no basta.',
      controles: [{ id: 'k', etiqueta: 'Versión', opciones: [{ valor: 'completo', texto: 'A' }, { valor: 'sueltas', texto: 'B' }, { valor: 'sinquien', texto: 'C' }] }],
      dibujo: val => ({ datos: figAv(val.k), estado: { marcas: AVISO[val.k].ok ? evid(figAv(val.k)) : Object.fromEntries(figAv(val.k).secciones[0].fragmentos.map(f => [f.id, 'h'])), sellos: { o: AVISO[val.k].ok ? { t: 'Texto', c: 'i' } : { t: 'No funciona', c: 'h' } } } }),
      lectura: val => [corto(AVISO[val.k].ok ? ev : mal, AVISO[val.k].dice)],
      minimo: 3,
    },
    predice: {
      pregunta: 'En un cruce de calles hay un letrero que solo dice «PARE». ¿Es un texto?',
      opciones: opciones('Sí: en su lugar comunica algo completo', [
        ['No: tiene una sola palabra', 'RVT1', 'Muchos textos son largos, pero el largo no decide: este cumple su propósito.'],
        ['No: no tiene conectores', 'RVC3', 'Los conectores ayudan en textos largos; uno breve puede no necesitarlos.'],
        ['Solo si tiene un título', 'RVT1', 'El título es común, pero no hace falta para comunicar.'],
      ]),
      dibujo: { datos: texto('Letrero en un cruce', [['PARE']]), estado: {} },
      revelar: { datos: texto('Letrero en un cruce', [['PARE', 'e']]), estado: { marcas: { e0: 'i' }, sellos: { o: { t: 'Texto', c: 'i' } } } },
      coincide: 'Coincide: en esa situación, «PARE» tiene emisor, destinatario y propósito.',
    },
    mira: {
      datos: figAv('completo'),
      pasos: [
        { estado: { marcas: { e0: 'i' }, nuevo: ['e0'] }, texto: 'Dice a quién va: a los vecinos de la calle Lima (situación).', ecuacion: [ev('a quién'), ' + ', ev('dónde')] },
        { estado: { marcas: { e0: 'i', t0: 'o', e1: 'i' }, nuevo: ['t0', 'e1'] }, texto: 'Da información nueva con sentido: qué, cuándo y por qué.', ecuacion: [op('qué'), ' + ', ev('por qué')] },
        { estado: { marcas: evid(figAv('completo')), sellos: { o: { t: 'Texto', c: 'i' } }, nuevo: ['e2'] }, texto: 'Tiene un propósito: que llenen sus baldes a tiempo.', ecuacion: [prop('propósito'), ' → acción'] },
      ],
    },
    regla: {
      texto: 'Un texto es una unidad de sentido con un propósito, en una situación. Se reconoce por sus normas: cohesión, coherencia, intención, aceptabilidad, información, situación y relación con otros textos.',
      ecuacion: [ev('sentido'), ' + ', prop('propósito'), ' + ', op('situación'), ' → texto'],
      condicion: 'se juzga el conjunto en su situación; el largo o la corrección de cada oración no deciden.',
    },
    ahoraTu: {
      generar(s) {
        const B = [
          { o: 'Mi perro es marrón. El Misti es un volcán. Ayer comí ceviche.', ok: 'No: las oraciones no forman un todo con sentido', m: [['Sí: cada oración está bien escrita', 'RVT1', 'La corrección de cada una no basta: no tratan un mismo asunto.'], ['Sí: tiene tres oraciones', 'RVT1', 'El número de oraciones no decide si hay un texto.'], ['No: le falta un título', 'RVT1', 'Con título seguiría sin sentido de conjunto.']] },
          { o: 'Silencio, por favor. Sala de lectura.', ok: 'Sí: en su lugar, comunica un pedido completo', m: [['No: es demasiado corto', 'RVT1', 'El largo no decide: cumple su propósito.'], ['No: no tiene verbo', 'RVC3', 'Se entiende igual: el lugar completa el sentido.'], ['No: no tiene conectores', 'RVC3', 'Un texto breve puede no necesitarlos.']] },
          { o: 'Lleven sus libros. Mañana a las nueve.', ok: 'Solo con su situación: falta saber quién y a quién', m: [['Sí: siempre es un texto completo', 'RV49', 'Sin saber quién lo dice ni a quién, no se sabe qué libros ni dónde.'], ['No: le falta un título', 'RVT1', 'El título no es lo que falta: falta la situación.'], ['No: tiene dos oraciones', 'RVT1', 'El número de oraciones no decide.']] },
          { o: 'Se vende bicicleta en buen estado. Llamar al 951 000 000. Puno.', ok: 'Sí: tiene sentido, propósito y destinatario', m: [['No: no tiene conectores', 'RVC3', 'Un aviso breve no los necesita para tener sentido.'], ['No: tiene un número', 'RV41', 'Los números son parte del aviso: dicen cómo responder.'], ['No: no cuenta una historia', 'RV13', 'Un texto no tiene que narrar: este anuncia.']] },
          { o: 'Feliz cumpleaños, abuela. Te queremos mucho. Tus nietos.', ok: 'Sí: tiene emisor, destinatario y propósito', m: [['No: es muy corto', 'RVT1', 'El largo no decide.'], ['No: no da información nueva', 'RVT1', 'Su propósito es saludar, no informar: lo cumple.'], ['No: no tiene argumentos', 'RV13', 'No todo texto argumenta.']] },
        ];
        const b = B[s % B.length];
        return {
          pregunta: '¿Esto funciona como un texto?',
          dibujo: { datos: texto('¿Texto?', [[b.o]]), estado: {} },
          opciones: opciones(b.ok, voltear(b.m, s)),
          solucion: { texto: 'Se mira el conjunto: sentido, propósito y situación.', ecuacion: [ev('sentido'), ' + ', prop('propósito'), ' + ', op('situación')] },
        };
      },
    },
  };

  // ---------- Idea 3: tres niveles de lectura ----------
  // Cambia: la pregunta. Permanece: el texto de la feria. Progresa: dónde está la respuesta (una frase, dos frases
  // unidas, el texto más un juicio). Se reserva: clasificar una pregunta nueva (predicción). Debe verse: la
  // evidencia que pide cada nivel.
  const FERIA = texto('Texto', [['La feria del pueblo empezó en 1990 con diez puestos.', 'e'], ['Hoy tiene más de doscientos', 'e'], ['y llegan compradores de Juliaca y Puno.', 'e'], ['Algunos vecinos temen que los precios suban', 'e'], ['y que los productores pequeños no puedan competir.', 'e']]);
  const NIVEL = {
    literal: { preg: '¿Cuántos puestos tenía al empezar?', nivel: 'Literal: está escrito', marcas: { e0: 'i' } },
    inferencial: { preg: '¿Qué le pasó a la feria con los años?', nivel: 'Inferencial: se deduce uniendo', marcas: { e0: 'i', e1: 'i' } },
    critico: { preg: '¿Tienen razón los vecinos que temen?', nivel: 'Crítico: se juzga con razones', marcas: { e0: 'i', e1: 'i', e2: 'i', e3: 'o', e4: 'o' } },
  };
  const niveles = {
    id: 'niveles',
    titulo: 'Tres niveles de lectura',
    temas: ['Niveles de comprensión lectora'],
    pieza: 'rv-texto',
    juega: {
      consigna: 'Elige una pregunta sobre el texto de la feria. Mira dónde está su respuesta: en una frase, uniendo frases o juzgando.',
      voz: 'El nivel depende de dónde está la respuesta.',
      controles: [{ id: 'n', etiqueta: 'Pregunta', opciones: [{ valor: 'literal', texto: '¿Cuántos puestos?' }, { valor: 'inferencial', texto: '¿Qué le pasó?' }, { valor: 'critico', texto: '¿Tienen razón?' }] }],
      dibujo: val => ({ datos: FERIA, estado: { marcas: NIVEL[val.n].marcas, sellos: { o: { t: NIVEL[val.n].nivel.split(':')[0], c: 'd' } } } }),
      lectura: val => [corto(prop, NIVEL[val.n].nivel)],
      minimo: 3,
    },
    predice: {
      pregunta: 'Sobre este mismo texto: «¿Por qué el autor menciona Juliaca y Puno?». ¿De qué nivel es la pregunta?',
      opciones: opciones('Inferencial: hay que deducir para qué', [
        ['Literal: los nombres están escritos', 'RVT2', 'Los nombres están, pero el «para qué» no está escrito: se deduce.'],
        ['Crítico: pide una opinión', 'RVT2', 'No pide juzgar si está bien: pide la intención del autor.'],
        ['Ninguno: no se puede responder', 'RV34', 'Se puede: muestra que la feria atrae a gente de lejos.'],
      ]),
      dibujo: { datos: FERIA, estado: { marcas: { e2: 'o' } } },
      revelar: { datos: FERIA, estado: { marcas: { e1: 'i', e2: 'i' }, sellos: { o: { t: 'Inferencial', c: 'd' } } } },
      coincide: 'Coincide: unir «doscientos puestos» con los lugares de origen muestra que la feria creció en alcance.',
    },
    mira: {
      datos: FERIA,
      pasos: [
        { estado: { marcas: NIVEL.literal.marcas, sellos: { o: { t: 'Literal', c: 'd' } } }, texto: 'Literal: «diez puestos» está escrito en una sola frase.', ecuacion: [prop('literal'), ' = ', ev('una frase')] },
        { estado: { marcas: NIVEL.inferencial.marcas, sellos: { o: { t: 'Inferencial', c: 'd' } }, nuevo: ['e1'] }, texto: 'Inferencial: de diez a doscientos se deduce que creció.', ecuacion: [prop('inferencial'), ' = ', ev('frase'), ' + ', ev('frase')] },
        { estado: { marcas: NIVEL.critico.marcas, sellos: { o: { t: 'Crítico', c: 'd' } }, nuevo: ['e3', 'e4'] }, texto: 'Crítico: se evalúa el temor de los vecinos con razones del texto.', ecuacion: [prop('crítico'), ' = ', ev('texto'), ' + ', op('juicio')] },
      ],
    },
    regla: {
      texto: 'En el nivel literal, la respuesta está escrita. En el inferencial, se deduce uniendo partes del texto. En el crítico, se evalúa el texto con razones.',
      ecuacion: [prop('literal'), ' → ', prop('inferencial'), ' → ', prop('crítico')],
      condicion: 'el nivel lo fija dónde está la respuesta, no qué tan difícil parece la pregunta.',
    },
    ahoraTu: {
      generar(s) {
        const B = [
          { p: '¿En qué año empezó la feria?', ok: 'Literal', m: [['Inferencial', 'RVT2', 'No hay que unir nada: el año está escrito.'], ['Crítico', 'RVT2', 'No pide juzgar: pide un dato.'], ['No se puede responder', 'RV34', 'Sí se puede: dice 1990.']] },
          { p: '¿El crecimiento de la feria fue bueno para el pueblo?', ok: 'Crítico', m: [['Literal', 'RVT2', 'El texto no lo dice escrito: pide evaluar.'], ['Inferencial', 'RVT2', 'Deducir no basta: hay que juzgar con razones.'], ['No se puede responder', 'RV34', 'Se puede, dando razones con lo que dice el texto.']] },
          { p: '¿Qué temen algunos vecinos?', ok: 'Literal', m: [['Inferencial', 'RVT2', 'Está escrito: que suban los precios.'], ['Crítico', 'RVT2', 'No pide juzgar el temor: pide cuál es.'], ['No se puede responder', 'RV34', 'Sí: el texto lo dice.']] },
          { p: '¿Por qué podrían subir los precios, según el texto?', ok: 'Inferencial', m: [['Literal', 'RVT2', 'La causa no está escrita: se deduce de que llegan más compradores.'], ['Crítico', 'RVT2', 'No pide juzgar: pide deducir una causa.'], ['No se puede responder', 'RV34', 'Se puede unir el crecimiento con la llegada de compradores.']] },
          { p: '¿Es justo que los productores pequeños compitan con los grandes?', ok: 'Crítico', m: [['Literal', 'RVT2', 'No está escrito: pide una valoración.'], ['Inferencial', 'RVT2', 'No basta deducir: pide juzgar si es justo.'], ['No se puede responder', 'RV34', 'Se puede, con razones.']] },
          { p: '¿Qué tienen en común Juliaca y Puno en el texto?', ok: 'Inferencial', m: [['Literal', 'RVT2', 'El texto no lo dice: se deduce que de allí vienen compradores.'], ['Crítico', 'RVT2', 'No pide juzgar nada.'], ['No se puede responder', 'RV34', 'Se puede: de ambos llegan compradores.']] },
        ];
        const b = B[s % B.length];
        return {
          pregunta: `Sobre el texto de la feria: «${b.p}». ¿De qué nivel es esta pregunta?`,
          dibujo: { datos: FERIA, estado: {} },
          opciones: opciones(b.ok, voltear(b.m, s)),
          solucion: { texto: 'Se busca dónde está la respuesta: escrita, deducida o juzgada.', ecuacion: [prop(b.ok.toLowerCase())] },
        };
      },
    },
  };

  return {
    unidad: 'razonamiento-verbal.tipologia-textual',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rv-texto.js'],
    historia: {
      texto: 'En 1981, Beaugrande y Dressler propusieron siete normas que hacen que algo funcione como texto. Antes, Werlich (1975) y después Adam ordenaron los tipos de texto; Adam mostró que un mismo texto mezcla secuencias. Son marcos discutibles, no casilleros fijos: el propósito dominante es lo que se busca.',
      pregunta: '¿Un texto sobre vacunas tiene que ser científico?',
      fuente: { titulo: 'Matriz de teoría de razonamiento verbal (tipología textual)', url: 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/diccio_ele/diccionario/tipologia.htm' },
    },
    ideas: [proposito, textualidad, niveles],
  };
});
