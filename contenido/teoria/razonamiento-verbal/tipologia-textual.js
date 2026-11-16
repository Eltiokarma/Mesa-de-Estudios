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
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  // Gesto directo (docs/teoria.md §4b): un marcador que se arrastra por el texto y se suelta en un trozo; la manija va
  // sobre ese trozo (rv-texto.ancla) y salta al más cercano al dedo (rv-texto.cercana). Los trozos se eligen por
  // posición (p0, p1…), porque cada versión del texto tiene sus propios ids; el control con botones es la alternativa.
  const RV = () => Kit.piezas['rv-texto'];
  const posiciones = n => Array.from({ length: n }, (_, k) => ({ valor: `p${k}`, texto: `${k + 1}` }));
  const idEn = (d, p) => (d.secciones[0].fragmentos[+p.slice(1)] || d.secciones[0].fragmentos[0]).id;
  const marcador = (datosDe, etiqueta) => ({
    id: 'frase', etiqueta, color: 'c-i',
    donde: val => RV().ancla(datosDe(val), idEn(datosDe(val), val.p)),
    mover: (pt, val) => {
      const d = datosDe(val), id = RV().cercana(d, pt, d.secciones[0].fragmentos.map(f => f.id));
      return { p: `p${d.secciones[0].fragmentos.findIndex(f => f.id === id)}` };
    },
  });
  // Cita corta de un trozo para la lectura en vivo (cabe en 12 palabras con lo demás).
  const cita = t => { const ps = t.replace(/[.,:;]+$/, '').split(' '); return `«${ps.slice(0, 3).join(' ')}${ps.length > 3 ? '…' : ''}»`; };
  const corto = (fn, t) => {
    // El trozo de color no se parte: con 14 letras o menos cabe en la miniatura de un caso guardado del laboratorio.
    if (t.length <= 14) return fn(t);
    const k = [t.indexOf(': '), t.indexOf(', ')].filter(i => i > 0).sort((a, b) => a - b)[0];
    if (k && k <= 14) return [fn(t.slice(0, k)), t.slice(k)];
    const ps = t.split(' '); let n = 1;
    while (n < ps.length && ps.slice(0, n + 1).join(' ').length <= 14) n++;
    return [fn(ps.slice(0, n).join(' ')), ' ' + ps.slice(n).join(' ')];
  };
  const ev = t => ({ v: 'c-i', t }), op = t => ({ v: 'c-o', t }), prop = t => ({ v: 'c-d', t }), mal = t => ({ v: 'c-h', t });
  const opciones = (c, malas) => [{ id: 'c', texto: c, correcta: true }, ...malas.map(([texto, error, siFuera], k) => ({ id: `e${k}`, texto, error, siFuera }))];
  const voltear = (arr, s) => (s % 2 ? arr.slice().reverse() : arr.slice());
  // Texto con trozos marcables: [['texto'], ['evidencia', 'e'], …]; los trozos con 'e' reciben ids e0, e1…
  function texto(titulo, partes) {
    let k = 0, n = 0;
    return { esquinaLibre: true, secciones: [{ id: 'o', titulo, modo: 'tarjeta', fragmentos: partes.map(([t, e]) => (e ? { id: `e${k++}`, t } : { id: `t${n++}`, t })) }] };
  }
  const evid = d => Object.fromEntries(d.secciones[0].fragmentos.filter(f => /^e/.test(f.id)).map(f => [f.id, 'i']));

  // Bancos de «Ahora tú» (sin cambios); «Así se resuelve» toma de aquí otro caso que el de la misma semilla.
  const BANCO_TIPO = [
    { o: 'El cóndor andino tiene alas de más de tres metros, plumas negras y un collar blanco en el cuello.', ok: 'Descriptivo', m: [['Narrativo', 'RV41', 'No cuenta sucesos: muestra rasgos del ave.'], ['Expositivo', 'RV41', 'Da datos, pero no explica causas ni procesos: describe.'], ['Argumentativo', 'RV13', 'No defiende ninguna postura.']] },
    { o: 'Cuando la luna pasa entre el sol y la Tierra, tapa la luz del sol: por eso se produce un eclipse solar.', ok: 'Expositivo', m: [['Narrativo', 'RV41', 'No cuenta lo que le pasó a alguien: explica un fenómeno.'], ['Descriptivo', 'RV13', 'No muestra cómo se ve: explica por qué ocurre.'], ['Argumentativo', 'RV14', 'No propone nada: explica.']] },
    { o: 'El colegio debería tener un huerto: los alumnos aprenderían ciencias y comerían mejor.', ok: 'Argumentativo', m: [['Expositivo', 'RV33', 'Da razones, pero para defender una propuesta: «debería».'], ['Descriptivo', 'RV13', 'No muestra cómo es un huerto: propone tenerlo.'], ['Narrativo', 'RV41', 'No cuenta sucesos.']] },
    { o: 'El lunes, Mateo perdió el bus; corrió tres cuadras y llegó justo cuando cerraban la puerta.', ok: 'Narrativo', m: [['Descriptivo', 'RV41', 'No muestra cómo es Mateo: cuenta lo que hizo.'], ['Expositivo', 'RV13', 'No explica un fenómeno: cuenta sucesos en orden.'], ['Argumentativo', 'RV14', 'No defiende ninguna postura.']] },
    { o: 'En 2023, el 40 % de los jóvenes leyó menos de un libro. Hay que llevar bibliotecas a los barrios.', ok: 'Argumentativo', m: [['Expositivo', 'RV41', 'Trae una cifra, pero para sostener «hay que llevar».'], ['Narrativo', 'RV41', 'Tiene un año, pero no cuenta una historia.'], ['Descriptivo', 'RV13', 'No muestra cómo es algo.']] },
    { o: 'La quinua se lava para quitarle la saponina, una sustancia amarga; luego se cocina como el arroz.', ok: 'Expositivo', m: [['Narrativo', 'RV41', 'Tiene pasos en orden, pero no cuenta lo que le pasó a alguien: explica un proceso.'], ['Descriptivo', 'RV13', 'No se detiene en cómo es la quinua: explica qué se hace y por qué.'], ['Argumentativo', 'RV14', 'No defiende ninguna postura.']] },
  ];
  const BANCO_TEXTO = [
    { o: 'Mi perro es marrón. El Misti es un volcán. Ayer comí ceviche.', ok: 'No: las oraciones no forman un todo con sentido', m: [['Sí: cada oración está bien escrita', 'RVT1', 'La corrección de cada una no basta: no tratan un mismo asunto.'], ['Sí: tiene tres oraciones', 'RVT1', 'El número de oraciones no decide si hay un texto.'], ['No: le falta un título', 'RVT1', 'Con título seguiría sin sentido de conjunto.']] },
    { o: 'Silencio, por favor. Sala de lectura.', ok: 'Sí: en su lugar, comunica un pedido completo', m: [['No: es demasiado corto', 'RVT1', 'El largo no decide: cumple su propósito.'], ['No: no tiene verbo', 'RVC3', 'Se entiende igual: el lugar completa el sentido.'], ['No: no tiene conectores', 'RVC3', 'Un texto breve puede no necesitarlos.']] },
    { o: 'Lleven sus libros. Mañana a las nueve.', ok: 'Solo con su situación: falta saber quién y a quién', m: [['Sí: siempre es un texto completo', 'RV49', 'Sin saber quién lo dice ni a quién, no se sabe qué libros ni dónde.'], ['No: le falta un título', 'RVT1', 'El título no es lo que falta: falta la situación.'], ['No: tiene dos oraciones', 'RVT1', 'El número de oraciones no decide.']] },
    { o: 'Se vende bicicleta en buen estado. Llamar al 951 000 000. Puno.', ok: 'Sí: tiene sentido, propósito y destinatario', m: [['No: no tiene conectores', 'RVC3', 'Un aviso breve no los necesita para tener sentido.'], ['No: tiene un número', 'RV41', 'Los números son parte del aviso: dicen cómo responder.'], ['No: no cuenta una historia', 'RV13', 'Un texto no tiene que narrar: este anuncia.']] },
    { o: 'Feliz cumpleaños, abuela. Te queremos mucho. Tus nietos.', ok: 'Sí: tiene emisor, destinatario y propósito', m: [['No: es muy corto', 'RVT1', 'El largo no decide.'], ['No: no da información nueva', 'RVT1', 'Su propósito es saludar, no informar: lo cumple.'], ['No: no tiene argumentos', 'RV13', 'No todo texto argumenta.']] },
  ];
  const BANCO_NIVEL = [
    { p: '¿En qué año empezó la feria?', ok: 'Literal', m: [['Inferencial', 'RVT2', 'No hay que unir nada: el año está escrito.'], ['Crítico', 'RVT2', 'No pide juzgar: pide un dato.'], ['No se puede responder', 'RV34', 'Sí se puede: dice 1990.']] },
    { p: '¿El crecimiento de la feria fue bueno para el pueblo?', ok: 'Crítico', m: [['Literal', 'RVT2', 'El texto no lo dice escrito: pide evaluar.'], ['Inferencial', 'RVT2', 'Deducir no basta: hay que juzgar con razones.'], ['No se puede responder', 'RV34', 'Se puede, dando razones con lo que dice el texto.']] },
    { p: '¿Qué temen algunos vecinos?', ok: 'Literal', m: [['Inferencial', 'RVT2', 'Está escrito: que suban los precios.'], ['Crítico', 'RVT2', 'No pide juzgar el temor: pide cuál es.'], ['No se puede responder', 'RV34', 'Sí: el texto lo dice.']] },
    { p: '¿Por qué podrían subir los precios, según el texto?', ok: 'Inferencial', m: [['Literal', 'RVT2', 'La causa no está escrita: se deduce de que llegan más compradores.'], ['Crítico', 'RVT2', 'No pide juzgar: pide deducir una causa.'], ['No se puede responder', 'RV34', 'Se puede unir el crecimiento con la llegada de compradores.']] },
    { p: '¿Es justo que los productores pequeños compitan con los grandes?', ok: 'Crítico', m: [['Literal', 'RVT2', 'No está escrito: pide una valoración.'], ['Inferencial', 'RVT2', 'No basta deducir: pide juzgar si es justo.'], ['No se puede responder', 'RV34', 'Se puede, con razones.']] },
    { p: '¿Qué tienen en común Juliaca y Puno en el texto?', ok: 'Inferencial', m: [['Literal', 'RVT2', 'El texto no lo dice: se deduce que de allí vienen compradores.'], ['Crítico', 'RVT2', 'No pide juzgar nada.'], ['No se puede responder', 'RV34', 'Se puede: de ambos llegan compradores.']] },
  ];
  // Así se resuelve (fase 2): azar con semilla, el índice del caso (nunca el de «Ahora tú» en la misma semilla), las
  // opciones barajadas y la figura: el texto y debajo la lista de opciones; en «Lo aplico» la correcta se marca (i)
  // y las demás se tachan. Todo sale del mismo banco que «Ahora tú» (regla 1).
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    return () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
  }
  const otroIndice = (s, n) => (s % n + 1 + Math.floor(azar(s + 900)() * (n - 1))) % n;
  const barajar = (b, s) => {
    const r = azar(s + 900), malas = b.m.slice(); r(); if (r() < 0.5) malas.reverse();
    const ops = opciones(b.ok, malas), c = ops.shift(), k = Math.floor(r() * (ops.length + 1));
    ops.splice(k, 0, c); return ops;
  };
  const minus = t => t.charAt(0).toLowerCase() + t.slice(1);
  // Las primeras palabras de un texto, para nombrarlo en el enunciado (el texto entero va en la figura).
  const empieza = t => { const ps = t.split(' '); return ps.length > 4 ? `${ps.slice(0, 4).join(' ').replace(/[.,:;]$/, '')}…` : t.replace(/[.]$/, ''); };
  const figResuelve = (secciones, ops, resuelto, marcas = {}) => {
    const datos = { secciones: [...secciones, { id: 'ops', titulo: 'Opciones', modo: 'lista', fragmentos: ops.map((o, k) => ({ id: `a${k}`, t: o.texto })) }] };
    if (!resuelto) return { datos, estado: { marcas } };
    const k = ops.findIndex(o => o.correcta);
    return { datos, estado: { marcas: Object.assign({}, marcas, { [`a${k}`]: 'i' }), tachar: ops.map((o, j) => `a${j}`).filter(id => id !== `a${k}`), nuevo: [`a${k}`] } };
  };

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
  const trozoVer = val => { const d = figVer(val.v), id = idEn(d, val.p); return { id, ev: /^e/.test(id), evs: d.secciones[0].fragmentos.filter(f => /^e/.test(f.id)).map(f => f.id) }; };
  const estVer = (k, extra = {}) => Object.assign({ marcas: evid(figVer(k)), sellos: { o: { t: VERS[k].tipo.split(':')[0], c: 'd' } } }, extra);
  const proposito = {
    id: 'proposito',
    titulo: 'El propósito decide el tipo',
    temas: ['Textos expositivos', 'Textos narrativos y descriptivos', 'Textos argumentativos'],
    pieza: 'rv-texto',
    // Lee (fase 2): los cuatro propósitos y el tema de la helada, sin decir para qué sirven las cifras (Predice).
    lee: {
      tarjetas: [
        { titulo: 'Cuatro maneras de escribir', texto: 'Un texto puede contar lo que pasó, mostrar cómo es algo, explicar por qué ocurre o defender lo que debería hacerse. Cada manera es un tipo de texto.' },
        { titulo: 'Un mismo tema', texto: 'La helada llega a la puna de Puno en junio y julio. Sobre ella se puede escribir un cuento, una nota que la describa, un informe o una carta al alcalde.' },
        { titulo: 'Qué mirar', texto: 'En el juego, el tema es siempre la helada. Cambia la versión y busca la palabra que delata qué busca cada texto.' },
      ],
    },
    juega: {
      consigna: 'El tema es siempre la helada. Cambia la versión y arrastra el marcador a las palabras que delatan lo que busca.',
      voz: 'Busca la palabra que delata el propósito.',
      controles: [
        { id: 'v', etiqueta: 'Versión', opciones: [{ valor: 'narra', texto: 'A' }, { valor: 'describe', texto: 'B' }, { valor: 'explica', texto: 'C' }, { valor: 'argumenta', texto: 'D' }] },
        { id: 'p', etiqueta: 'Trozo', opciones: posiciones(7) },
      ],
      dibujo: val => {
        const d = figVer(val.v), id = idEn(d, val.p);
        // Si el trozo es evidencia del propósito, se marca y aparece el sello del tipo; si no, queda punteado.
        return { datos: d, estado: /^e/.test(id) ? estVer(val.v, { marcas: { [id]: 'i' }, nuevo: ['o'] }) : { marcas: { [id]: 'd' } } };
      },
      lectura: val => {
        const d = figVer(val.v), f = d.secciones[0].fragmentos.find(x => x.id === idEn(d, val.p));
        return /^e/.test(f.id) ? [ev(cita(f.t)), ' delata: ', prop(VERS[val.v].tipo.split(':')[0].toLowerCase())] : [prop(cita(f.t)), ' no delata el tipo'];
      },
      minimo: 4,
      arrastres: [marcador(val => figVer(val.v), 'marcador de las palabras')],
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
      ecuacion: [{ llave: [prop('propósito dominante')], nota: 'lo que organiza', color: 'c-d' }, ' → tipo', '   ·   ', mal('tema'), ' no decide el tipo'],
      condicion: 'se mira qué organiza todo el texto; un texto puede mezclar tipos y uno domina.',
    },
    // Así se resuelve (fase 2): otro texto del banco de «Ahora tú», resuelto por el propósito que lo organiza.
    resuelve: {
      pieza: 'rv-texto',
      voz: 'No mires el tema: pregunta para qué está escrito.',
      generar(s) {
        const b = BANCO_TIPO[otroIndice(s, BANCO_TIPO.length)], ops = barajar(b, s), sec = texto('Texto', [[b.o]]).secciones;
        const busca = { Narrativo: 'cuenta sucesos en orden', Descriptivo: 'muestra cómo es algo, rasgo por rasgo', Expositivo: 'explica por qué ocurre algo o cómo se hace', Argumentativo: 'defiende lo que debería hacerse' }[b.ok];
        const trampa = b.m.find(m => m[1] === 'RV41') || b.m[0];
        return {
          enunciado: `En el texto que empieza «${empieza(b.o)}», ¿qué tipo de texto domina, según su propósito?`,
          dibujo: figResuelve(sec, ops, false),
          pasos: [
            { tipo: 'pide', texto: 'Piden el tipo de texto. No importa de qué trata, sino para qué se escribió todo el texto.' },
            { tipo: 'regla', texto: 'El propósito decide el tipo: contar sucesos, mostrar cómo es algo, explicar por qué ocurre o defender una postura.', ecuacion: [prop('propósito'), ' → tipo'] },
            { tipo: 'aplica', texto: ['Leo el texto entero: ', corto(ev, busca), '. Ese propósito organiza todo el texto.'], dibujo: figResuelve(sec, ops, true, { t0: 'i' }) },
            { tipo: 'sentido', texto: `Descarto «${trampa[0]}». ${trampa[2]}` },
          ],
          respuesta: b.ok,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const B = BANCO_TIPO;
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
  // aporta: qué norma cumple (o qué le falta) cada trozo, en el orden de sus partes.
  const AVISO = {
    completo: { partes: [['Vecinos de la calle Lima:', 'e'], ['el sábado cortarán el agua de 8 a 14 h'], ['por arreglo de tuberías.', 'e'], ['Llenen sus baldes el viernes.', 'e']], dice: 'Es un texto: tiene sentido y propósito', ok: true, falla: null,
      aporta: ['Situación: a quién va', 'Información nueva: qué y cuándo', 'Sentido: dice por qué', 'Propósito: qué hacer'] },
    sueltas: { partes: [['El sábado es un día.'], ['Las tuberías son de plástico.'], ['Los baldes tienen asa.'], ['La calle Lima es larga.']], dice: 'Falla la coherencia: no forman un todo', ok: false, falla: 'coherencia',
      aporta: ['Bien escrita, pero suelta', 'No se une con las otras', 'No se une con las otras', 'No dice para qué'] },
    sinquien: { partes: [['Cortarán el agua.'], ['Llenen sus baldes.']], dice: 'Falla la situación: ¿cuándo?, ¿a quién?', ok: false, falla: 'situación',
      aporta: ['Falta: ¿cuándo?, ¿dónde?', 'Falta: ¿quién lo pide?'] },
  };
  const figAv = k => texto('Aviso', AVISO[k].partes);
  const aportaAv = val => { const d = figAv(val.k); return AVISO[val.k].aporta[d.secciones[0].fragmentos.findIndex(f => f.id === idEn(d, val.p))]; };
  const textualidad = {
    id: 'normas-textualidad',
    titulo: 'Qué hace que algo sea texto',
    temas: ['Texto y normas de textualidad'],
    pieza: 'rv-texto',
    // Lee (fase 2): oración contra conjunto y la palabra «textualidad», sin decir si un texto breve cuenta (Predice).
    lee: {
      tarjetas: [
        { titulo: 'Oraciones y conjunto', texto: 'Una oración puede estar bien escrita y, aun así, no decir nada junto a las otras. Aquí no se mira cada oración por separado: se mira el conjunto.' },
        { titulo: 'Una palabra nueva', texto: 'Textualidad es lo que hace que unas palabras funcionen como texto. Se estudia con normas: por ejemplo, la coherencia, el propósito y la situación en que se lee.' },
        { titulo: 'Qué mirar', texto: 'En el juego hay tres versiones de un aviso sobre un corte de agua. Pasa el marcador por cada trozo y mira qué aporta o qué le falta.' },
      ],
    },
    juega: {
      consigna: 'Compara tres versiones del aviso del agua. Arrastra el marcador por cada trozo: mira qué aporta o qué le falta.',
      voz: 'Que cada oración esté bien escrita no basta.',
      controles: [
        { id: 'k', etiqueta: 'Versión', opciones: [{ valor: 'completo', texto: 'A' }, { valor: 'sueltas', texto: 'B' }, { valor: 'sinquien', texto: 'C' }] },
        { id: 'p', etiqueta: 'Trozo', opciones: posiciones(4) },
      ],
      dibujo: val => {
        const d = figAv(val.k), id = idEn(d, val.p), a = AVISO[val.k];
        return { datos: d, estado: { marcas: { [id]: a.ok ? 'i' : 'h' }, sellos: { o: a.ok ? { t: 'Texto', c: 'i' } : { t: 'No funciona', c: 'h' } } } };
      },
      lectura: val => {
        const d = figAv(val.k), k = d.secciones[0].fragmentos.findIndex(f => f.id === idEn(d, val.p)), a = AVISO[val.k];
        return [corto(a.ok ? ev : mal, a.aporta[k])];
      },
      minimo: 3,
      arrastres: [marcador(val => figAv(val.k), 'marcador del trozo')],
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
      ecuacion: [ev('sentido'), ' + ', prop('propósito'), ' + ', { llave: [op('situación')], nota: 'quién y dónde', color: 'c-o' }, ' → texto'],
      condicion: 'se juzga la textualidad del conjunto en su situación; el largo o la corrección de cada oración no deciden.',
    },
    // Así se resuelve (fase 2): otro caso del banco de «Ahora tú», juzgado por el conjunto (sentido, propósito, situación).
    resuelve: {
      pieza: 'rv-texto',
      voz: 'Juzga el conjunto, no cada oración.',
      generar(s) {
        const b = BANCO_TEXTO[otroIndice(s, BANCO_TEXTO.length)], ops = barajar(b, s), sec = texto('¿Texto?', [[b.o]]).secciones;
        const porque = b.ok.slice(b.ok.indexOf(': ') + 2);
        return {
          enunciado: `¿Funciona como un texto el escrito que empieza «${empieza(b.o)}»?`,
          dibujo: figResuelve(sec, ops, false),
          pasos: [
            { tipo: 'pide', texto: 'Piden decidir si estas palabras funcionan como un texto, y por qué.' },
            { tipo: 'regla', texto: 'Miro el conjunto: ¿tiene sentido, un propósito y una situación clara? El largo, el título o los conectores no deciden.', ecuacion: [ev('sentido'), ' + ', prop('propósito'), ' + ', op('situación')] },
            { tipo: 'aplica', texto: ['Reviso las tres cosas en el conjunto: ', corto(ev, porque), '.'], dibujo: figResuelve(sec, ops, true, { t0: 'd' }) },
            { tipo: 'sentido', texto: `Descarto «${b.m[0][0]}». ${b.m[0][2]}` },
          ],
          respuesta: b.ok,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const B = BANCO_TEXTO;
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
    // Lee (fase 2): los tres niveles por su nombre y el contexto de las ferias, sin clasificar la pregunta de Predice.
    lee: {
      tarjetas: [
        { titulo: 'Tres niveles', texto: 'Una lectura se puede hacer en tres niveles: literal, inferencial y crítico. En el examen te preguntan de los tres, muchas veces sobre el mismo texto.' },
        { titulo: 'Ferias de la región', texto: 'En Puno y Juliaca hay ferias semanales donde se vende papa, chuño, ropa y animales. El texto del juego cuenta cómo creció la feria de un pueblo.' },
        { titulo: 'Qué mirar', texto: 'En el juego, elige cada pregunta y mira qué frases del texto se marcan para responderla: una sola, varias o todas.' },
      ],
    },
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
      ecuacion: [{ llave: [prop('literal')], nota: 'está escrito', color: 'c-d' }, ' → ', { llave: [prop('inferencial')], nota: 'se une', color: 'c-d' }, ' → ', { llave: [prop('crítico')], nota: 'se juzga', color: 'c-d' }],
      condicion: 'el nivel lo fija dónde está la respuesta, no qué tan difícil parece la pregunta.',
    },
    // Así se resuelve (fase 2): otra pregunta del banco de «Ahora tú», clasificada por dónde está su respuesta.
    resuelve: {
      pieza: 'rv-texto',
      voz: 'Busca dónde está la respuesta, no qué tan difícil suena.',
      generar(s) {
        const b = BANCO_NIVEL[otroIndice(s, BANCO_NIVEL.length)], ops = barajar(b, s), sec = FERIA.secciones;
        const donde = { Literal: 'está escrita en una frase del texto', Inferencial: 'no está escrita: se deduce uniendo frases', 'Crítico': 'hay que juzgar con razones si algo es bueno o justo' }[b.ok];
        return {
          enunciado: `Sobre el texto de la feria: «${b.p}». ¿De qué nivel es esta pregunta?`,
          dibujo: figResuelve(sec, ops, false),
          pasos: [
            { tipo: 'pide', texto: `Piden el nivel de la pregunta «${b.p}», no su respuesta.` },
            { tipo: 'regla', texto: 'Me fijo dónde está la respuesta: escrita en una frase, deducida uniendo frases o juzgada con razones.', ecuacion: [prop('literal'), ' → ', prop('inferencial'), ' → ', prop('crítico')] },
            { tipo: 'aplica', texto: ['Busco la respuesta en el texto: ', corto(ev, donde), '.'], dibujo: figResuelve(sec, ops, true) },
            { tipo: 'sentido', texto: `Descarto «${b.m[0][0]}». ${b.m[0][2]}` },
          ],
          respuesta: b.ok,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const B = BANCO_NIVEL;
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

  // ---------- Laboratorio: arma un texto con tres oraciones y mira qué tipo domina ----------
  // Cada oración se elige entre cuatro secuencias sobre la helada. El tipo dominante lo calcula el código con la
  // jerarquía de secuencias que engloban a otras (Adam): una postura organiza a las demás como apoyo; una explicación
  // usa sucesos y rasgos como ejemplos; un relato incluye descripciones. Las demás quedan como apoyo.
  // Sin arrastre: lo que cambia es qué hace cada oración (un botón por secuencia), no un lugar de la figura.
  const SEC = {
    narra: { n: 'Narrativo', f: ['Aquella noche, Rosa despertó por el frío.', 'Salió con una linterna a la chacra.', 'Encontró las hojas cubiertas de escarcha.'] },
    describe: { n: 'Descriptivo', f: ['La chacra amaneció blanca y dura.', 'Las hojas lucen rígidas y quemadas.', 'El suelo cruje bajo los pies.'] },
    explica: { n: 'Expositivo', f: ['La helada ocurre en noches sin nubes.', 'Sin nubes, el suelo pierde calor rápido.', 'El agua de las hojas se congela y rompe sus células.'] },
    argumenta: { n: 'Argumentativo', f: ['Las comunidades deberían recibir alertas por radio.', 'Con aviso, cubrirían sus cultivos a tiempo.', 'Es injusto enterarse cuando ya se perdió todo.'] },
  };
  const JERARQUIA = ['argumenta', 'explica', 'narra', 'describe'];
  const OPS_SEC = [{ valor: 'narra', texto: 'Narra' }, { valor: 'describe', texto: 'Describe' }, { valor: 'explica', texto: 'Explica' }, { valor: 'argumenta', texto: 'Argumenta' }];
  const dominante = val => JERARQUIA.find(t => [val.s1, val.s2, val.s3].includes(t));
  const mesaMezcla = {
    id: 'mezcla', titulo: 'Arma el texto de la helada', pieza: 'rv-texto',
    consigna: 'Elige qué hace cada una de las tres oraciones. Mira qué tipo domina y cuáles quedan de apoyo.',
    voz: 'Un texto mezcla secuencias; una organiza a las demás.',
    controles: ['s1', 's2', 's3'].map((id, k) => ({ id, etiqueta: `Oración ${k + 1}`, opciones: OPS_SEC, inicio: ['narra', 'describe', 'argumenta'][k] })),
    dibujo: val => {
      const dom = dominante(val), ts = [val.s1, val.s2, val.s3];
      return {
        datos: { esquinaLibre: true, secciones: [{ id: 'o', titulo: 'Tema: la helada', modo: 'lista', fragmentos: ts.map((t, k) => ({ id: `o${k + 1}`, t: SEC[t].f[k] })) }] },
        estado: { marcas: Object.fromEntries(ts.map((t, k) => [`o${k + 1}`, t === dom ? 'i' : 'd'])), sellos: { o: { t: SEC[dom].n, c: 'i' } } },
      };
    },
    lectura: val => {
      const dom = dominante(val), sec = [...new Set([val.s1, val.s2, val.s3].filter(t => t !== dom))].map(t => SEC[t].n.toLowerCase());
      // Solo el nombre va de color: así se parte por palabras y cabe en la miniatura del caso guardado.
      return [ev(SEC[dom].n), ' domina', sec.length ? ` · apoyo: ${sec.join(', ')}` : ' · sin apoyo de otro tipo'];
    },
    // Retos: el tipo que domina lo calcula dominante(), la misma jerarquía que pinta el sello.
    invitaciones: [
      { texto: 'Logra que domine el expositivo con una sola oración que explique.',
        logrado: val => dominante(val) === 'explica' && [val.s1, val.s2, val.s3].filter(t => t === 'explica').length === 1,
        bien: 'Una explicación basta para organizar los sucesos y los rasgos como ejemplos.' },
      { texto: 'Arma un relato que domine, con una descripción de apoyo.',
        logrado: val => dominante(val) === 'narra' && [val.s1, val.s2, val.s3].includes('describe'),
        bien: 'El relato avanza; la descripción lo detiene para mostrar cómo era.' },
      { texto: 'Usa tres tipos distintos sin que domine el argumentativo.',
        logrado: val => new Set([val.s1, val.s2, val.s3]).size === 3 && dominante(val) !== 'argumenta',
        bien: 'Sin una postura, ¿qué secuencia organiza a las otras dos?' },
      { texto: 'Guarda dos textos con la misma primera oración y distinto tipo dominante.',
        logrado: (val, guardados) => guardados.some(g => g.s1 === val.s1 && dominante(g) !== dominante(val)),
        bien: 'La misma oración cambia de papel según lo que organiza el conjunto.' },
    ],
  };

  return {
    unidad: 'razonamiento-verbal.tipologia-textual',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rv-texto.js'],
    historia: {
      texto: 'En 1981, Beaugrande y Dressler propusieron siete normas que hacen que algo funcione como texto. Antes, Werlich (1975) y después Adam ordenaron los tipos de texto; Adam mostró que un mismo texto mezcla secuencias. Son marcos discutibles, no casilleros fijos: el propósito dominante es lo que se busca.',
      pregunta: '¿Un texto sobre vacunas tiene que ser científico?',
      fuente: { titulo: 'Matriz de teoría de razonamiento verbal (tipología textual)', url: 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/diccio_ele/diccionario/tipologia.htm' },
    },
    glosario: [
      { termino: 'tipología textual', def: 'Clasificación de los textos según lo que buscan: narrar, describir, explicar o defender una postura.',
        formas: ['tipología textual', 'tipología'], ver: ['propósito', 'secuencia'] },
      { termino: 'propósito', def: 'Para qué se escribe un texto: lo que busca lograr en quien lo lee.',
        ejemplo: 'Un aviso de corte de agua busca que llenen sus baldes.', ver: ['intención', 'tipología textual'] },
      { termino: 'intención', def: 'Lo que el autor quiere lograr al escribir; se deduce de cómo arma el texto.',
        ejemplo: 'Nombrar Juliaca y Puno muestra que la feria atrae gente de lejos.', ver: ['propósito'] },
      { termino: 'narrativo', def: 'Texto que cuenta sucesos ordenados en el tiempo, con personajes que hacen algo.',
        formas: ['narrativo', 'narrativa', 'narrativos'], ejemplo: '«Rosa despertó, salió y encontró la escarcha.»', ver: ['descriptivo'] },
      { termino: 'descriptivo', def: 'Texto que muestra cómo es algo: sus partes, rasgos y estado.',
        formas: ['descriptivo', 'descriptiva', 'descriptivos'], ejemplo: '«La chacra amaneció blanca y dura.»', ver: ['narrativo'] },
      { termino: 'expositivo', def: 'Texto que informa o explica cómo es o por qué ocurre algo, sin defender una postura.',
        formas: ['expositivo', 'expositiva', 'expositivos'], ejemplo: '«La helada ocurre porque el suelo pierde calor.»', ver: ['argumentativo'] },
      { termino: 'argumentativo', def: 'Texto que defiende una postura y da razones para convencer al lector.',
        formas: ['argumentativo', 'argumentativa', 'argumentativos'], ejemplo: '«Deberían dar alertas por radio; así cubrirían sus cultivos.»', ver: ['tesis', 'expositivo'] },
      { termino: 'secuencia', def: 'Orden en que van las partes; en tipología, un trozo de texto que narra, describe, explica o argumenta.',
        ejemplo: 'Un relato puede incluir una descripción del lugar.', ver: ['tipología textual'] },
      { termino: 'textualidad', def: 'Lo que hace que un conjunto de palabras funcione como texto: sentido, propósito y situación.',
        formas: ['textualidad', 'normas de textualidad'], ejemplo: '«PARE» en un cruce la cumple; cuatro oraciones sueltas, no.', ver: ['coherencia', 'propósito'] },
      { termino: 'nivel literal', def: 'Lectura que encuentra la respuesta escrita en una frase del texto.',
        formas: ['nivel literal'], ejemplo: '«¿Cuántos puestos tenía?» Diez: está escrito.', ver: ['nivel inferencial'] },
      { termino: 'nivel inferencial', def: 'Lectura que deduce la respuesta uniendo partes del texto; no está escrita en una sola frase.',
        formas: ['nivel inferencial', 'inferencial'], ejemplo: 'De diez a doscientos puestos: la feria creció.', ver: ['nivel literal', 'nivel crítico'] },
      { termino: 'nivel crítico', def: 'Lectura que juzga el texto con razones: si tiene razón, si convence, si le falta algo.',
        formas: ['nivel crítico', 'crítico'], ejemplo: '¿Tienen razón los vecinos que temen?', ver: ['nivel inferencial'] },
    ],
    laboratorio: [
      mesaMezcla,
      Object.assign({ id: 'proposito', titulo: 'Las cuatro versiones', pieza: 'rv-texto',
        // Retos: trozoVer dice, con figVer e idEn, si el marcador está sobre una evidencia del propósito.
        invitaciones: [
          { texto: 'En la versión que argumenta, pon el marcador en la palabra que propone algo.',
            logrado: val => val.v === 'argumenta' && trozoVer(val).id === trozoVer(val).evs[0],
            bien: '«Deberían» delata una postura: el texto quiere convencer.' },
          { texto: 'En la versión que narra, marca el último suceso que cuenta.',
            logrado: val => val.v === 'narra' && trozoVer(val).id === trozoVer(val).evs[trozoVer(val).evs.length - 1],
            bien: 'Despertó, salió, encontró: los sucesos en orden arman el relato.' },
          { texto: 'Guarda dos versiones distintas con el marcador sobre una evidencia.',
            logrado: (val, guardados) => trozoVer(val).ev && guardados.some(g => g.v !== val.v && trozoVer(g).ev),
            bien: 'Mismo tema, distinta evidencia: el propósito cambió, no la helada.' },
        ] }, proposito.juega),
      Object.assign({ id: 'aviso', titulo: 'El aviso del agua', pieza: 'rv-texto',
        // Retos: aportaAv lee lo que aporta el trozo bajo el marcador; AVISO dice qué norma falla en cada versión.
        invitaciones: [
          { texto: 'En el aviso que funciona, marca el trozo que dice para qué se escribió.',
            logrado: val => AVISO[val.k].ok && aportaAv(val).startsWith('Propósito'),
            bien: '«Llenen sus baldes» es la razón de todo el aviso.' },
          { texto: 'Busca la versión de oraciones bien escritas que no forma un texto.',
            logrado: val => AVISO[val.k].falla === 'coherencia',
            bien: 'Cada oración es correcta; juntas no dicen nada a nadie.' },
          { texto: 'En la versión corta, marca el trozo al que le falta quién lo pide.',
            logrado: val => AVISO[val.k].falla === 'situación' && aportaAv(val).includes('quién'),
            bien: '«Llenen sus baldes», pero ¿quién lo pide y a quiénes?' },
          { texto: 'Guarda dos versiones que fallen por razones distintas.',
            logrado: (val, guardados) => !AVISO[val.k].ok && guardados.some(g => !AVISO[g.k].ok && AVISO[g.k].falla !== AVISO[val.k].falla),
            bien: 'Una falla en el sentido; otra, en la situación. Las dos dejan de ser texto.' },
        ] }, textualidad.juega),
    ],
    ideas: [proposito, textualidad, niveles],
  };
});
