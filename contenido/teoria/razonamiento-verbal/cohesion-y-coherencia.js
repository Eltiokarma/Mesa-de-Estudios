/*
 * Teoría de «Cohesión y coherencia textual» (razonamiento-verbal.cohesion-y-coherencia). Molde: docs/teoria.md.
 * Contenido: matriz de verbal (unidad 7), historia (lingüística textual: Beaugrande y Dressler, van Dijk) y códigos
 * RV27, RV28 y RV9. Textos propios (regla 5).
 * Ruta A · Argumentar: se une una palabra con su referente, o se cambia un enlace, y se ve si el texto sigue teniendo sentido.
 *
 * Ficha de tarea:
 *   Promesa: resolver a qué remite cada palabra y comprobar que el texto no se contradice.
 *   Persona y condiciones: postulante de 3.º a 5.º, celular, sin audio; cohesión y coherencia (UNI 8–9, UNMSM 6–7).
 *   Resultado observable: resuelve referencias y repara un salto de información sin cambiar la idea.
 *   Orden de atención: 1.º la palabra que remite (o) · 2.º el referente candidato (i o h) · 3.º el sello.
 *   Estados: referente coherente · gramatical pero sin sentido · texto que se contradice.
 *   Duda que resuelve: ¿por qué el pronombre no siempre va con el sustantivo más cercano?
 *
 * Colores (regla 4): el referente o lo ya conocido i (turquesa, continuo), la palabra que remite o (naranja,
 * discontinuo), lo nuevo que aporta la oración d (verde, punteado), lo que no tiene sentido o choca h (rojo).
 * Códigos: RV27 (último sustantivo), RV28 (información vieja y nueva), RV9; RVC1–RVC3 son hipótesis nuevas.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  // Gesto directo (docs/teoria.md §4b): la manija va sobre una palabra o una ficha de la figura (rv-texto.ancla) y,
  // al arrastrarla, salta a la más cercana al dedo (rv-texto.cercana). Mueve un control de opciones, que conserva sus
  // botones como alternativa sin arrastre.
  const RV = () => Kit.piezas['rv-texto'];
  // En un párrafo, rv-texto.ancla pone la manija al centro del subrayado y tapa palabras cortas («lo», «ellos»): aquí va
  // al inicio del subrayado, como una viñeta; en una lista se queda sobre el número.
  function anclaP(datos, id) {
    for (const s of RV().disponer(datos).secciones) {
      if (s.sec.modo === 'lista') continue;
      const tr = s.trozos.find(t => !t.num && t.id === id);
      if (tr) return { x: tr.x, y: tr.y + 5 };
    }
    return RV().ancla(datos, id);
  }
  const manija = (id, control, datosDe, ids, etiqueta, color = 'c-o') => ({
    id, etiqueta, color,
    donde: val => anclaP(datosDe(val), val[control]),
    mover: (pt, val) => ({ [control]: RV().cercana(datosDe(val), pt, ids) }),
  });
  // Bandeja de fichas bajo el texto (una por opción del control); la elegida va marcada.
  // Va arriba del texto: así el sello del texto no queda bajo el botón de la lupa (esquina superior derecha).
  const conBandeja = (datos, titulo, items) => ({ esquinaLibre: true, secciones: [{ id: 'bandeja', titulo, modo: 'lista', fragmentos: items }].concat(datos.secciones) });
  const conFicha = (estado, id) => Object.assign({}, estado, { marcas: Object.assign({}, estado.marcas, { [id]: 'o' }) });
  // Una lectura en vivo no parte línea dentro de un color (.var): si el texto es largo, solo va en color su cabeza.
  const corto = (fn, t) => {
    // El trozo de color no se parte: con 14 letras o menos cabe en la miniatura de un caso guardado del laboratorio.
    if (t.length <= 14) return fn(t);
    const k = [t.indexOf(': '), t.indexOf(', ')].filter(i => i > 0).sort((a, b) => a - b)[0];
    if (k && k <= 14) return [fn(t.slice(0, k)), t.slice(k)];
    const ps = t.split(' '); let n = 1;
    while (n < ps.length && ps.slice(0, n + 1).join(' ').length <= 14) n++;
    return [fn(ps.slice(0, n).join(' ')), ' ' + ps.slice(n).join(' ')];
  };
  const ref = t => ({ v: 'c-i', t }), remite = t => ({ v: 'c-o', t }), nuevo = t => ({ v: 'c-d', t }), mal = t => ({ v: 'c-h', t });
  const opciones = (c, malas) => [{ id: 'c', texto: c, correcta: true }, ...malas.map(([texto, error, siFuera], k) => ({ id: `e${k}`, texto, error, siFuera }))];
  const voltear = (arr, s) => (s % 2 ? arr.slice().reverse() : arr.slice());
  const tarjeta = (titulo, frs) => ({ esquinaLibre: true, secciones: [{ id: 'o', titulo, modo: 'tarjeta', fragmentos: frs.map(([id, t]) => ({ id, t })) }] });
  // Texto partido por los trozos marcados: «[[Marta]] le regaló…» → fragmentos; los [[…]] reciben id m0, m1…
  function partir(texto) {
    const frs = []; let k = 0, n = 0;
    for (const p of texto.split(/(\[\[[^\]]+\]\])/)) {
      if (!p.trim()) continue;
      if (p.startsWith('[[')) frs.push({ id: `m${k++}`, t: p.slice(2, -2) });
      else frs.push({ id: `t${n++}`, t: p.trim() });
    }
    return frs;
  }
  const texto = (titulo, t) => ({ esquinaLibre: true, secciones: [{ id: 'o', titulo, modo: 'tarjeta', fragmentos: partir(t) }] });

  // Bancos de «Ahora tú» (sin cambios); «Así se resuelve» toma de aquí otro caso que el de la misma semilla.
  const BANCO_REFERENTE = [
    { t: 'El perro persiguió al gato hasta el techo. Allí, este se quedó quieto, a salvo.', w: 'este', ok: 'El gato', m: [['El perro', 'RVC2', 'El perro perseguía; «a salvo» y «allí, en el techo» apuntan al gato.'], ['El techo', 'RV27', 'Es el último sustantivo, pero un techo no se queda a salvo.'], ['Lo que viene después', 'RVC1', 'Aquí «este» retoma algo dicho antes, no anuncia.']] },
    { t: 'Ana le prestó su casaca a Lucía porque ella tenía frío.', w: 'ella', ok: 'Lucía', m: [['Ana', 'RV27', 'Concuerda, pero si Ana tuviera frío no prestaría su casaca.'], ['La casaca', 'RV27', 'Concuerda, pero una casaca no tiene frío.'], ['Nadie: es ambiguo', 'RVC1', 'Concuerda con dos, pero solo una lectura tiene sentido.']] },
    { t: 'Solo te pido esto: llega temprano mañana.', w: 'esto', ok: 'Lo que sigue: llega temprano', m: [['A ti', 'RV27', '«Te» eres tú; «esto» es lo que se pide.'], ['Mañana', 'RV27', 'Es la palabra más cercana, pero «esto» es el pedido completo.'], ['A algo dicho antes', 'RVC1', 'No hay nada antes: «esto» anuncia lo que viene.']] },
    { t: 'Los vecinos limpiaron la plaza. Después, la llenaron de flores.', w: 'la', ok: 'La plaza', m: [['Los vecinos', 'RV27', 'No concuerda: «la» es femenino singular.'], ['Las flores', 'RV27', 'No concuerda y además se llena con flores, no a las flores.'], ['Lo que viene después', 'RVC1', '«La» retoma lo ya dicho: la plaza.']] },
    { t: 'Carlos visitó a su abuelo en el hospital. Lo encontró mucho mejor.', w: 'Lo', ok: 'El abuelo', m: [['Carlos', 'RVC2', 'Carlos es quien encontró; no se encontró a sí mismo.'], ['El hospital', 'RV27', 'Concuerda, pero un hospital no está mejor de salud.'], ['Lo que viene después', 'RVC1', 'Aquí «lo» retoma a alguien ya nombrado.']] },
    { t: 'Te lo advierto con claridad: no toques ese cable.', w: 'lo', ok: 'Lo que sigue: no toques ese cable', m: [['A ti', 'RV27', '«Te» eres tú; «lo» es la advertencia.'], ['Ese cable', 'RV27', 'Es el último sustantivo, pero lo que se advierte es la orden completa.'], ['Algo dicho antes', 'RVC1', 'No hay nada antes: «lo» anuncia lo que viene.']] },
  ];
  const BANCO_RECURSO = [
    { o: 'Lima es la capital del Perú. La ciudad tiene más de diez millones de habitantes.', w: 'La ciudad', ok: 'Sustitución', m: [['Repetición', 'RVC2', 'Sería repetición si dijera otra vez «Lima».'], ['Elipsis', 'RVC2', 'Sería elipsis si no la nombrara: «Tiene más de diez millones…».'], ['Catáfora', 'RVC1', 'No anuncia algo que viene: retoma a Lima.']] },
    { o: 'Los niños jugaron toda la tarde. Después, cenaron y se durmieron temprano.', w: 'cenaron', ok: 'Elipsis', m: [['Repetición', 'RVC2', 'No se repite «los niños»: se calla y el verbo lo indica.'], ['Sustitución', 'RVC2', 'No hay otra palabra en lugar de «los niños».'], ['Catáfora', 'RVC1', 'No anuncia algo que viene después.']] },
    { o: 'El agua es vital. El agua limpia, además, previene muchas enfermedades.', w: 'El agua', ok: 'Repetición', m: [['Sustitución', 'RVC2', 'Sería sustitución si dijera «este líquido».'], ['Elipsis', 'RVC2', 'Sería elipsis si callara el sujeto.'], ['Anáfora con pronombre', 'RVC2', 'No hay pronombre: se repite la misma palabra.']] },
    { o: 'Mi abuela cocina un ají de gallina delicioso. Ella aprendió la receta de su madre.', w: 'Ella', ok: 'Sustitución', m: [['Repetición', 'RVC2', 'Sería repetición si dijera «mi abuela».'], ['Elipsis', 'RVC2', 'Sería elipsis si dijera solo «Aprendió…».'], ['Catáfora', 'RVC1', '«Ella» retoma a la abuela, no anuncia nada.']] },
    { o: 'Unos llevaron la comida; otros, las bebidas.', w: 'otros, las bebidas', ok: 'Elipsis', m: [['Repetición', 'RVC2', 'El verbo «llevaron» no se repite: se calla.'], ['Sustitución', 'RVC2', 'No hay otra palabra en lugar del verbo.'], ['Catáfora', 'RVC1', 'No anuncia nada: retoma el verbo dicho antes.']] },
  ];
  const BANCO_HILO = [
    { o: ['El cacao crece en la selva del Perú.', null, 'Con esas semillas se fabrica el chocolate.'], ok: 'Sus frutos guardan unas semillas amargas.', m: [['El chocolate es muy dulce.', 'RV28', 'Adelanta el chocolate, pero la 3 necesita antes las semillas.'], ['La selva tiene mucha lluvia.', 'RV28', 'Habla de la selva y deja sin referente «esas semillas».'], ['El café también crece en la selva.', 'RV28', 'Cambia de tema y la 3 queda sin enlace.']] },
    { o: ['El volcán Misti está junto a Arequipa.', null, 'Por eso, la ciudad tiene planes de evacuación.'], ok: 'Todavía está activo y podría hacer erupción.', m: [['Su cima tiene nieve en invierno.', 'RV28', 'Habla del Misti, pero no da la razón del «por eso».'], ['Arequipa es la ciudad blanca.', 'RV28', 'Habla de la ciudad, no de un peligro que exija evacuar.'], ['Los planes se practican cada año.', 'RV28', 'Adelanta los planes antes de su razón.']] },
    { o: ['Las ballenas jorobadas llegan a Piura en invierno.', null, 'En esas aguas cálidas nacen sus crías.'], ok: 'Vienen desde el sur buscando aguas más cálidas.', m: [['Las crías toman leche.', 'RV28', 'Adelanta las crías y deja sin referente «esas aguas».'], ['Piura es famosa por su ceviche.', 'RV28', 'Cambia de tema: la 3 queda sin enlace.'], ['Las ballenas son mamíferos.', 'RV28', 'Es verdad, pero no presenta las aguas que la 3 retoma.']] },
    { o: ['El quechua es una lengua que se habla en los Andes.', null, 'Esas palabras, como «cancha» o «papa», usamos todos los días.'], ok: 'El castellano tomó muchas palabras de ella.', m: [['El quechua tiene varias variedades.', 'RV28', 'Habla del quechua, pero no presenta las palabras que la 3 retoma.'], ['La papa es originaria de los Andes.', 'RV28', 'Adelanta un ejemplo sin presentar el préstamo de palabras.'], ['Muchos peruanos hablan castellano.', 'RV28', 'No dice que el castellano tomara palabras del quechua.']] },
    { o: ['En 1911, Hiram Bingham llegó a Machu Picchu.', null, 'Desde entonces, el lugar se volvió famoso en el mundo.'], ok: 'Publicó fotos que mostraron la ciudadela al mundo.', m: [['Machu Picchu está en Cusco.', 'RV28', 'Es un dato del lugar, pero no explica el «desde entonces».'], ['Hoy llegan miles de turistas.', 'RV28', 'Adelanta el efecto antes de su causa.'], ['Bingham era profesor.', 'RV28', 'Habla de Bingham, pero no de lo que lo hizo famoso.']] },
  ];
  const BANCO_COHERENTE = [
    { o: 'Nunca he salido de Puno. El año pasado conocí el mar en Lima.', ok: 'No: si conoció Lima, sí salió de Puno', m: [['Sí: cuenta dos recuerdos', 'RVC3', 'Tienen relación de tema, pero lo segundo niega lo primero.'], ['Sí: las dos están bien escritas', 'RVC3', 'Cada una es correcta sola; juntas se contradicen.'], ['No: falta un «sin embargo»', 'RVC3', 'Un conector no arregla que una niegue a la otra.']] },
    { o: 'La tienda abre solo los sábados. Por eso, fuimos un martes y estaba abierta.', ok: 'No: si abre solo sábados, el martes estaría cerrada', m: [['Sí: tiene un conector de causa', 'RVC3', 'El conector no da sentido: el martes contradice «solo los sábados».'], ['Sí: dice cuándo fueron', 'RVC3', 'Dar un día no basta: ese día choca con lo anterior.'], ['No: falta decir la hora', 'RVC3', 'La hora no importa: el día ya contradice lo dicho.']] },
    { o: 'Algunos pájaros no vuelan. Por ejemplo, el pingüino nada pero no vuela.', ok: 'Sí: el ejemplo confirma lo dicho', m: [['No: los pájaros vuelan', 'RV8', 'Eso es una idea propia; el texto no lo afirma, y el pingüino lo desmiente.'], ['No: «por ejemplo» está mal usado', 'RVC3', 'Está bien: el pingüino es un caso de pájaro que no vuela.'], ['No: el pingüino no es un pájaro', 'RV8', 'Sí es un ave; y el texto así lo trata.']] },
    { o: 'El examen duró dos horas. Terminé en diez minutos y salí antes que todos.', ok: 'Sí: un alumno puede terminar antes', m: [['No: si duró dos horas, nadie sale antes', 'RVC3', 'Lo que dura es el tiempo dado; alguien puede terminar antes.'], ['No: falta un conector', 'RVC3', 'Sin conector, el sentido se sostiene igual.'], ['No: diez minutos es muy poco', 'RV8', 'Eso es una opinión; no es una contradicción del texto.']] },
    { o: 'Todos los asientos del bus estaban ocupados. Por eso, me senté al lado de la ventana.', ok: 'No: si todos estaban ocupados, no pudo sentarse', m: [['Sí: tiene un conector de consecuencia', 'RVC3', '«Por eso» no arregla que no hubiera asientos libres.'], ['Sí: dice dónde se sentó', 'RVC3', 'Precisar el lugar no quita la contradicción.'], ['No: debía decir «además»', 'RVC3', 'Cambiar el conector no resuelve el choque.']] },
  ];
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    return () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
  }
  // Índice de «Así se resuelve»: sale de azar(s + 900) y nunca coincide con el de «Ahora tú» (s % n).
  const otroIndice = (s, n) => (s % n + 1 + Math.floor(azar(s + 900)() * (n - 1))) % n;
  const minus = t => t.charAt(0).toLowerCase() + t.slice(1);
  // Así se resuelve: la figura de «Ahora tú» con una lista de las opciones debajo (mismo banco, mismo `voltear`);
  // en el paso «Lo aplico» la correcta se marca (i) y las demás se tachan.
  const conOpciones = (datos, ops) => ({ esquinaLibre: true, secciones: datos.secciones.concat([{ id: 'ops', titulo: 'Opciones', modo: 'lista', fragmentos: ops.map((o, k) => ({ id: `p${k}`, t: o.texto })) }]) });
  const marcarOps = (ops, estado = {}) => Object.assign({}, estado, {
    marcas: Object.assign({}, estado.marcas, ...ops.map((o, k) => (o.correcta ? { [`p${k}`]: 'i' } : {}))),
    tachar: ops.map((o, k) => (o.correcta ? null : `p${k}`)).filter(Boolean),
    nuevo: ops.map((o, k) => (o.correcta ? `p${k}` : null)).filter(Boolean),
  });
  // Opciones en el orden de «Ahora tú» para esa semilla, con la correcta en un lugar que da azar(s + 900).
  const ordenar = (b, s) => { const ops = opciones(b.ok, voltear(b.m, s)), c = ops.shift(); ops.splice(Math.floor(azar(s + 900)() * 4), 0, c); return ops; };
  // Texto partido en la palabra marcada, como en «Ahora tú».
  // Texto partido en la palabra marcada. Se toma su última aparición: en «limpiaron la plaza… la llenaron» o «El agua…
  // El agua limpia», la marcada es la que vuelve a nombrar, no el referente.
  const partirEn = (t, w) => {
    const re = new RegExp(`(^|[^\\wáéíóúñ])(${w})(?![\\wáéíóúñ])`, 'g');
    let k = -1, x;
    while ((x = re.exec(t))) k = x.index + x[1].length;
    const antes = t.slice(0, k).trim(), despues = t.slice(k + w.length).trim();
    return [...(antes ? [['a', antes]] : []), ['w', w], ...(despues ? [['b', despues]] : [])];
  };
  // En minúscula solo si empieza con artículo («La plaza» → «la plaza»); los nombres propios quedan igual.
  const minusArt = t => (/^(El|La|Los|Las|Un|Una) /.test(t) ? minus(t) : t);

  // ---------- Idea 1: a quién se refiere (anáfora y catáfora) ----------
  // Cambia: el pronombre que se mira y el referente que se le une. Permanece: el texto de Marta.
  // Progresa: de la unión gramatical a la que tiene sentido. Se reserva: la catáfora, que mira hacia adelante
  // (predicción). Debe verse: que «lo» con «hermano» es gramatical y aun así absurdo.
  const MARTA = texto('Texto', '[[Marta]] le regaló [[un libro]] a [[su hermano]]. [[Él]] [[lo]] leyó en una sola noche.');
  const CAND = { m0: 'Marta', m1: 'un libro', m2: 'su hermano' };
  const OK = { m3: 'm2', m4: 'm1' };
  const POR = {
    'm3-m0': 'No concuerda: «él» es masculino', 'm3-m1': 'Concuerda, pero un libro no lee', 'm3-m2': 'Tiene sentido: el hermano leyó',
    'm4-m0': 'No concuerda: «lo» es masculino', 'm4-m1': 'Tiene sentido: leyó el libro', 'm4-m2': 'Concuerda, pero no se lee a una persona',
  };
  const estMarta = (p, r, extra = {}) => Object.assign({ marcas: { [p]: 'o', [r]: OK[p] === r ? 'i' : 'h' }, sellos: { o: OK[p] === r ? { t: 'Tiene sentido', c: 'i' } : { t: 'No tiene sentido', c: 'h' } } }, extra);
  const referencia = {
    id: 'referente',
    titulo: 'A quién se refiere',
    temas: ['Anáfora y catáfora'],
    pieza: 'rv-texto',
    // Lee (fase 2): qué es un referente y por qué importa, sin decir hacia dónde mira «lo» en la profesora (Predice).
    lee: {
      tarjetas: [
        { titulo: 'Palabras que señalan', texto: 'Palabras como «él», «lo», «ella» o «este» no dicen nada solas: señalan otra parte del texto. A eso que señalan lo llamamos su referente.' },
        { titulo: 'Sin referente claro', texto: 'Si en el grupo de WhatsApp del salón alguien escribe «ya lo traje», todos preguntan: ¿qué cosa? Sin un referente claro, el mensaje no se entiende.' },
        { titulo: 'Qué mirar', texto: 'En el juego unes «él» o «lo» con una palabra del texto de Marta. Mira cuándo la unión, además de sonar bien, tiene sentido.' },
      ],
    },
    juega: {
      consigna: 'Elige un pronombre del texto y únelo con un referente. Mira cuándo el texto sigue teniendo sentido.',
      voz: 'Que concuerde no basta: tiene que tener sentido.',
      controles: [
        { id: 'p', etiqueta: 'Pronombre', opciones: [{ valor: 'm3', texto: 'Él' }, { valor: 'm4', texto: 'lo' }] },
        { id: 'r', etiqueta: 'Referente', opciones: Object.entries(CAND).map(([valor, texto]) => ({ valor, texto })) },
      ],
      dibujo: val => ({ datos: MARTA, estado: estMarta(val.p, val.r) }),
      lectura: val => [OK[val.p] === val.r ? corto(ref, POR[`${val.p}-${val.r}`]) : corto(mal, POR[`${val.p}-${val.r}`])],
      minimo: 4,
      // Arrastra el referente por la primera oración: el pronombre elegido se une a la palabra donde lo sueltas.
      arrastres: [manija('referente', 'r', () => MARTA, Object.keys(CAND), 'referente del pronombre', 'c-i')],
    },
    predice: {
      pregunta: 'En este texto, ¿a qué se refiere «Lo»?',
      voz: 'Una palabra también puede anunciar lo que viene.',
      opciones: opciones('A lo que sigue: el examen será el lunes', [
        ['Al aula', 'RV27', 'Es lo último que se nombró antes, pero un aula no se dice: se dice algo.'],
        ['A la profesora', 'RV27', 'Ella es quien dice; «lo» es lo que dijo.'],
        ['A nada: la oración está mal escrita', 'RVC1', 'Es correcta: «lo» anuncia lo que viene después de los dos puntos.'],
      ]),
      dibujo: { datos: texto('Texto', '[[La profesora]] entró [[al aula]]. [[Lo]] dijo claro: [[el examen será el lunes.]]'), estado: { marcas: { m2: 'o' } } },
      revelar: { datos: texto('Texto', '[[La profesora]] entró [[al aula]]. [[Lo]] dijo claro: [[el examen será el lunes.]]'), estado: { marcas: { m2: 'o', m3: 'i' }, sellos: { o: { t: 'Catáfora: mira adelante', c: 'i' } } } },
      coincide: 'Coincide: «lo» anuncia lo que se dirá después; eso es una catáfora.',
    },
    mira: {
      datos: MARTA,
      pasos: [
        { estado: estMarta('m4', 'm2', { nuevo: ['m2'] }), texto: '«Lo» y «su hermano» concuerdan, pero nadie lee a una persona.', ecuacion: [remite('lo'), ' + ', mal('hermano'), ': sin sentido'] },
        { estado: estMarta('m4', 'm1', { nuevo: ['m1'] }), texto: '«Lo» retoma «un libro»: el texto se lee bien.', ecuacion: [remite('lo'), ' → ', ref('un libro')] },
        { estado: { marcas: { m3: 'o', m2: 'i', m4: 'o', m1: 'i' }, sellos: { o: { t: 'Tiene sentido', c: 'i' } }, nuevo: ['m3', 'm2'] }, texto: '«Él» retoma al hermano, no al libro, aunque el libro esté más cerca.', ecuacion: [remite('él'), ' → ', ref('su hermano')] },
      ],
    },
    regla: {
      texto: 'Una anáfora retoma algo ya dicho; una catáfora anuncia algo que viene después. El referente es el que concuerda y además da sentido, no siempre el más cercano.',
      ecuacion: [ref('referente'), ' ← ', { llave: [remite('anáfora')], nota: 'mira atrás', color: 'c-o' }, '   ·   ', { llave: [remite('catáfora')], nota: 'mira adelante', color: 'c-o' }, ' → ', ref('referente')],
      condicion: 'se reemplaza la palabra por su referente: si la oración se lee bien y tiene sentido, es ese.',
    },
    // Así se resuelve (fase 2): otro texto del banco de «Ahora tú»; se prueba cada candidato en lugar de la palabra.
    resuelve: {
      pieza: 'rv-texto',
      voz: 'Pon cada candidato en lugar de la palabra y lee.',
      generar(s) {
        const b = BANCO_REFERENTE[otroIndice(s, BANCO_REFERENTE.length)], ops = ordenar(b, s);
        const datos = conOpciones(tarjeta('Texto', partirEn(b.t, b.w)), ops);
        const cerca = b.m.find(x => x[1] === 'RV27'), cata = b.ok.startsWith('Lo que sigue'), refe = b.ok.replace('Lo que sigue: ', '');
        return {
          enunciado: `En este texto, ¿a qué se refiere «${b.w}»?`,
          dibujo: { datos, estado: { marcas: { w: 'o' } } },
          pasos: [
            { tipo: 'pide', texto: ['Piden el referente de ', remite(b.w), ': la parte del texto que esa palabra señala.'] },
            { tipo: 'regla', texto: 'Pongo cada candidato en lugar de la palabra. Me quedo con el que concuerda y, además, deja una oración con sentido.' },
            { tipo: 'aplica', texto: `Pruebo «${cerca[0]}»: ${minus(cerca[2])}`, ecuacion: [remite(b.w), ' ≠ ', mal(minusArt(cerca[0]))] },
            { tipo: 'aplica', texto: [`Con «${minusArt(refe)}», la oración se lee bien y tiene sentido.`], ecuacion: [remite(b.w), ' = ', ref(minusArt(refe))],
              dibujo: { datos, estado: marcarOps(ops, { marcas: { w: 'o' } }) } },
            { tipo: 'sentido', texto: cata ? [remite(b.w), ' mira hacia adelante: anuncia lo que viene. Es una catáfora.'] : [remite(b.w), ' mira hacia atrás: retoma algo ya dicho. Es una anáfora.'] },
          ],
          respuesta: `«${b.ok}»`,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const B = BANCO_REFERENTE;
        const b = B[s % B.length];
        const [antes, despues] = b.t.split(new RegExp(`\\b${b.w}\\b`));
        return {
          pregunta: `En este texto, ¿a qué se refiere «${b.w}»?`,
          dibujo: { datos: tarjeta('Texto', [['a', antes.trim()], ['w', b.w], ...(despues.trim() ? [['b', despues.trim()]] : [])]), estado: { marcas: { w: 'o' } } },
          opciones: opciones(b.ok, voltear(b.m, s)),
          solucion: { texto: 'Se reemplaza la palabra por el candidato y se ve si tiene sentido.', ecuacion: [remite(b.w), ' = ', ref(b.ok.replace('Lo que sigue: ', '').toLowerCase())] },
        };
      },
    },
  };

  // ---------- Idea 2: repetir, sustituir o callar ----------
  // Cambia: cómo se vuelve a nombrar a la vicuña. Permanece: el texto. Progresa: de repetir a sustituir y a callar
  // (elipsis). Se reserva: la elipsis de un verbo (predicción). Debe verse: que los tres recursos remiten a lo mismo.
  const RECURSO = {
    rep: { t: 'La vicuña', nombre: 'Repetición: la misma palabra' },
    sus: { t: 'Este animal', nombre: 'Sustitución: otra expresión' },
    eli: { t: '( — )', nombre: 'Elipsis: se calla, se entiende' },
  };
  const VICU = { esquinaLibre: true, secciones: [{ id: 'o', titulo: 'Texto', modo: 'tarjeta', fragmentos: [{ id: 'a', t: 'La vicuña vive en la puna, sobre los cuatro mil metros.' }, { id: 'w', hueco: true, reserva: 'Este animal' }, { id: 'b', t: 'tiene la fibra más fina del mundo.' }] }] };
  const VICU_B = conBandeja(VICU, 'Formas de nombrarla', Object.entries(RECURSO).map(([id, r]) => ({ id, t: r.t })));
  const estVicu = (r, extra = {}) => Object.assign({ huecos: { w: RECURSO[r].t }, marcas: { a: 'i', w: 'o' }, sellos: { o: { t: r === 'rep' ? 'Repetición' : r === 'sus' ? 'Sustitución' : 'Elipsis', c: 'd' } } }, extra);
  const recursos = {
    id: 'repetir-sustituir-callar',
    titulo: 'Repetir, sustituir o callar',
    temas: ['Repetición, sustitución y elipsis'],
    pieza: 'rv-texto',
    // Lee (fase 2): para qué se vuelve a nombrar algo y contexto de la vicuña, sin hablar del verbo que se calla (Predice).
    lee: {
      tarjetas: [
        { titulo: 'Volver a nombrar', texto: 'Cuando un texto habla de algo varias veces, necesita volver a nombrarlo. Si usa siempre la misma palabra, la lectura se vuelve pesada.' },
        { titulo: 'La vicuña', texto: 'La vicuña vive en las punas de Puno y Ayacucho. Es pariente de la llama, pero más pequeña y silvestre, y su fibra se vende muy cara.' },
        { titulo: 'Qué mirar', texto: 'En el juego eliges tres formas de nombrar otra vez a la vicuña en la segunda oración. Mira qué nombre recibe cada forma en la lectura.' },
      ],
    },
    juega: {
      consigna: 'Elige cómo nombrar de nuevo a la vicuña en la segunda oración. Mira qué recurso usa el texto en cada caso.',
      voz: 'Los tres caminos llevan al mismo referente.',
      controles: [{ id: 'r', etiqueta: 'Recurso', opciones: Object.entries(RECURSO).map(([valor, r]) => ({ valor, texto: r.t })) }],
      dibujo: val => ({ datos: VICU_B, estado: conFicha(estVicu(val.r), val.r) }),
      lectura: val => [corto(nuevo, RECURSO[val.r].nombre)],
      minimo: 3,
      // Arrastra la ficha a una forma de nombrar: entra en el hueco de la segunda oración.
      arrastres: [manija('ficha', 'r', () => VICU_B, Object.keys(RECURSO), 'ficha de la forma de nombrar')],
    },
    predice: {
      pregunta: 'En «Pedro compró pan y Ana, queso», ¿qué palabra se calló después de «Ana»?',
      opciones: opciones('compró', [
        ['Pedro', 'RVC2', 'Pedro es otra persona; quien hace la acción ahí es Ana.'],
        ['pan', 'RVC2', 'Ana compró queso, no pan: el pan es de Pedro.'],
        ['Ninguna: no falta nada', 'RVC1', 'La coma marca un hueco: sin verbo, «Ana, queso» no dice qué hizo.'],
      ]),
      dibujo: { datos: tarjeta('Oración', [['a', 'Pedro'], ['v', 'compró'], ['b', 'pan y Ana,'], ['c', 'queso.']]), estado: { marcas: { b: 'o' } } },
      revelar: { datos: { esquinaLibre: true, secciones: [{ id: 'o', titulo: 'Oración', modo: 'tarjeta', fragmentos: [{ id: 'a', t: 'Pedro' }, { id: 'v', t: 'compró' }, { id: 'b', t: 'pan y Ana' }, { id: 'w', hueco: true, reserva: '(compró)' }, { id: 'c', t: 'queso.' }] }] }, estado: { huecos: { w: '(compró)' }, marcas: { v: 'i', w: 'o' }, sellos: { o: { t: 'Elipsis del verbo', c: 'd' } } } },
      coincide: 'Coincide: el verbo ya se dijo; callarlo evita repetirlo.',
    },
    mira: {
      datos: VICU,
      pasos: [
        { estado: estVicu('rep'), texto: 'Repetir «la vicuña» es claro, pero cansa si se hace mucho.', ecuacion: [ref('la vicuña'), ' … ', remite('la vicuña')] },
        { estado: estVicu('sus', { nuevo: ['w'] }), texto: '«Este animal» la nombra con otras palabras: sustitución.', ecuacion: [ref('la vicuña'), ' … ', remite('este animal')] },
        { estado: estVicu('eli', { nuevo: ['w'] }), texto: 'Callarla también funciona: el verbo «tiene» ya dice quién.', ecuacion: [ref('la vicuña'), ' … ', remite('( — ) tiene')] },
      ],
    },
    regla: {
      texto: 'Para volver a nombrar algo, un texto puede repetirlo, sustituirlo por otra expresión o pronombre, o callarlo (elipsis) cuando se entiende. Los tres mantienen el hilo.',
      ecuacion: [ref('referente'), ' → ', remite('repetición'), '   ·   ', remite('sustitución'), '   ·   ', remite('elipsis')],
      condicion: 'el lector puede recuperar el referente sin dudar; si dos candidatos encajan, conviene repetir.',
    },
    // Así se resuelve (fase 2): otro texto del banco de «Ahora tú»; se descartan los recursos que no son.
    resuelve: {
      pieza: 'rv-texto',
      voz: 'Mira cómo vuelve a nombrar: igual, con otras palabras o callando.',
      generar(s) {
        const b = BANCO_RECURSO[otroIndice(s, BANCO_RECURSO.length)], ops = ordenar(b, s);
        const datos = conOpciones(tarjeta('Texto', partirEn(b.o, b.w)), ops), [m1, m2] = b.m;
        return {
          enunciado: `¿Qué recurso usa el texto en la parte marcada («${b.w}») para no perder el hilo?`,
          dibujo: { datos, estado: { marcas: { w: 'o' } } },
          pasos: [
            { tipo: 'pide', texto: ['Piden cómo vuelve a nombrar algo la parte marcada, ', remite(b.w), '.'] },
            { tipo: 'regla', texto: 'Si usa la misma palabra, repite. Si usa otra expresión o un pronombre, sustituye. Si la calla y se entiende, es elipsis.', ecuacion: [remite('repetición'), ' · ', remite('sustitución'), ' · ', remite('elipsis')] },
            { tipo: 'aplica', texto: `No es ${minus(m1[0])}: ${minus(m1[2])}` },
            { tipo: 'aplica', texto: `Tampoco es ${minus(m2[0])}: ${minus(m2[2])}`, dibujo: { datos, estado: marcarOps(ops, { marcas: { w: 'o' } }) } },
            { tipo: 'sentido', texto: ['Queda ', ref(minus(b.ok)), ': el lector recupera sin dudar lo que se vuelve a nombrar.'] },
          ],
          respuesta: b.ok,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const B = BANCO_RECURSO;
        const b = B[s % B.length];
        const [antes, despues] = b.o.split(b.w);
        return {
          pregunta: `¿Qué recurso usa el texto en la parte marcada («${b.w}») para no perder el hilo?`,
          dibujo: { datos: tarjeta('Texto', [['a', antes.trim()], ['w', b.w], ...(despues.trim() ? [['b', despues.trim()]] : [])]), estado: { marcas: { w: 'o' } } },
          opciones: opciones(b.ok, voltear(b.m, s)),
          solucion: { texto: 'Se busca qué retoma y cómo: igual, con otras palabras o callado.', ecuacion: [remite(b.ok.toLowerCase())] },
        };
      },
    },
  };

  // ---------- Idea 3: lo conocido y lo nuevo (progresión e inclusión) ----------
  // Cambia: la oración que se pone en el hueco. Permanece: las oraciones 1, 2 y 4. Progresa: cada oración parte de
  // lo ya dicho (tópico) y agrega algo (comento). Se reserva: la inclusión en otro texto (predicción).
  // Debe verse: que la 4 usa «chasquis», y solo una candidata los presenta antes.
  const CAMINO = ['Los incas construyeron caminos por todo su territorio.', 'Esos caminos unían el Cusco con regiones muy lejanas.', null, 'Gracias a los chasquis, un mensaje recorría cientos de kilómetros en días.'];
  const CANDIDATAS = {
    a: { t: 'Por ellos corrían los chasquis, mensajeros que se relevaban.', ok: true, falla: null, dice: 'Retoma «caminos» y presenta a los chasquis' },
    b: { t: 'Los incas también cultivaban maíz y papa en andenes.', ok: false, falla: 'tema', dice: 'Cambia de tema: la 4 queda sin enlace' },
    c: { t: 'Hoy muchos tramos están bajo la carretera.', ok: false, falla: 'nombre', dice: 'Retoma los caminos, pero la 4 no sabe quiénes son los chasquis' },
  };
  // La oración 3 cambia de texto según la candidata: va en datos (una oración larga no cabe en un hueco).
  const figCam = c => ({ esquinaLibre: true, secciones: [{ id: 'o', titulo: 'Texto', modo: 'lista', fragmentos: CAMINO.map((t, k) => ({ id: `o${k + 1}`, t: t || CANDIDATAS[c].t })) }] });
  // El juego agrega, sobre el texto, las tres candidatas como fichas; «Mira» usa el texto solo, con la candidata A ya
  // puesta (hallazgo 9: es el mismo texto que el alumno armó, sin la bandeja).
  const figCamB = c => conBandeja(figCam(c), 'Candidatas', Object.entries(CANDIDATAS).map(([id, x]) => ({ id, t: x.t })));
  const estCam = (c, extra = {}) => Object.assign({ marcas: { o3: CANDIDATAS[c].ok ? 'o' : 'h', o2: 'i', o4: CANDIDATAS[c].ok ? 'i' : 'h' }, sellos: { o: CANDIDATAS[c].ok ? { t: 'El hilo sigue', c: 'i' } : { t: 'Se corta el hilo', c: 'h' } } }, extra);
  const progresion = {
    id: 'conocido-y-nuevo',
    titulo: 'Lo conocido trae lo nuevo',
    temas: ['Progresión temática: tópico y comento', 'Inclusión de enunciado'],
    pieza: 'rv-texto',
    // Lee (fase 2): contexto de los caminos incas y qué hace una oración que falta, sin tocar el texto del ichu (Predice).
    lee: {
      tarjetas: [
        { titulo: 'Los caminos incas', texto: 'El Qhapaq Ñan fue la red de caminos de los incas. Unía el Cusco con lugares tan lejanos como Quito y el norte de Chile.' },
        { titulo: 'Una oración que falta', texto: 'En el examen aparece un texto con un espacio en blanco y varias oraciones para llenarlo. Solo una deja que el texto se lea de corrido.' },
        { titulo: 'Qué mirar', texto: 'En el juego falta la oración 3. Prueba cada candidata y mira si la oración 4 encuentra a quién nombra.' },
      ],
    },
    juega: {
      consigna: 'Falta la oración 3. Prueba cada candidata y mira si la 4 encuentra lo que necesita.',
      voz: 'Cada oración parte de algo ya dicho y agrega algo.',
      controles: [{ id: 'c', etiqueta: 'Oración 3', opciones: Object.keys(CANDIDATAS).map(c => ({ valor: c, texto: `Candidata ${c.toUpperCase()}` })) }],
      dibujo: val => ({ datos: figCamB(val.c), estado: Object.assign(estCam(val.c), { marcas: Object.assign(estCam(val.c).marcas, { [val.c]: 'o' }) }) }),
      lectura: val => [CANDIDATAS[val.c].ok ? corto(ref, CANDIDATAS[val.c].dice) : corto(mal, CANDIDATAS[val.c].dice)],
      minimo: 3,
      // Arrastra la ficha a una candidata: esa oración pasa al lugar 3 del texto.
      arrastres: [manija('ficha', 'c', val => figCamB(val.c), Object.keys(CANDIDATAS), 'ficha de la oración candidata')],
    },
    predice: {
      pregunta: 'En este texto sobre el ichu falta la oración 2. ¿Cuál mantiene el hilo?',
      opciones: opciones('Es el principal alimento de llamas y alpacas.', [
        ['El ichu se usa para techar casas.', 'RV28', 'Habla del ichu, pero no prepara el «por eso» de los rebaños.'],
        ['Los rebaños comen todo el día.', 'RV28', 'Adelanta los rebaños, pero no dice qué tiene que ver la puna.'],
        ['La puna está sobre los cuatro mil metros.', 'RV28', 'Es un dato de la puna; el «por eso» necesita una razón para llevar rebaños.'],
      ]),
      dibujo: { datos: { esquinaLibre: true, secciones: [{ id: 'o', titulo: 'Texto', modo: 'lista', fragmentos: [{ id: 'o1', t: 'El ichu crece en la puna.' }, { id: 'o2', hueco: true, reserva: '¿?' }, { id: 'o3', t: 'Por eso, los criadores llevan allí a sus rebaños.' }] }] }, estado: {} },
      revelar: { datos: { esquinaLibre: true, secciones: [{ id: 'o', titulo: 'Texto', modo: 'lista', fragmentos: [{ id: 'o1', t: 'El ichu crece en la puna.' }, { id: 'o2', t: 'Es el principal alimento de llamas y alpacas.' }, { id: 'o3', t: 'Por eso, los criadores llevan allí a sus rebaños.' }] }] }, estado: { marcas: { o1: 'i', o2: 'o', o3: 'i' }, sellos: { o: { t: 'El hilo sigue', c: 'i' } } } },
      coincide: 'Coincide: retoma el ichu y da la razón que el «por eso» necesita.',
    },
    mira: {
      datos: figCam('a'),
      pasos: [
        { estado: { marcas: { o1: 'd' } }, texto: 'La 1 presenta algo nuevo: los caminos incas.', ecuacion: [nuevo('caminos'), ' (nuevo)'] },
        { estado: { marcas: { o1: 'i', o2: 'd' }, nuevo: ['o2'] }, texto: 'La 2 parte de «esos caminos» (conocido) y agrega adónde llegaban.', ecuacion: [ref('esos caminos'), ' + ', nuevo('unían regiones')] },
        { estado: { marcas: { o2: 'i', o3: 'd' }, nuevo: ['o3'] }, texto: 'La 3 parte de «ellos» y presenta a los chasquis.', ecuacion: [ref('ellos'), ' + ', nuevo('los chasquis')] },
        { estado: { marcas: { o3: 'i', o4: 'd' }, nuevo: ['o4'] }, texto: 'La 4 parte de los chasquis, ya conocidos, y cierra.', ecuacion: [ref('los chasquis'), ' + ', nuevo('mensajes rápidos')] },
      ],
    },
    regla: {
      texto: 'Cada oración parte de algo conocido (tópico) y agrega algo nuevo (comento); lo nuevo de una pasa a ser lo conocido de la siguiente. Lo incluido sigue ese hilo.',
      ecuacion: [{ llave: [ref('tópico')], nota: 'lo conocido', color: 'c-i' }, ' + ', { llave: [nuevo('comento')], nota: 'lo nuevo', color: 'c-d' }, ' → ', ref('tópico siguiente')],
      condicion: 'la oración que se incluye retoma lo anterior y deja lo que la siguiente necesita (un nombre, una razón).',
    },
    // Así se resuelve (fase 2): otro texto del banco de «Ahora tú»; la oración del espacio se elige mirando la siguiente.
    resuelve: {
      pieza: 'rv-texto',
      voz: 'Mira primero la oración que viene después del espacio.',
      generar(s) {
        const b = BANCO_HILO[otroIndice(s, BANCO_HILO.length)], ops = ordenar(b, s), mala = b.m[0];
        const sec = llena => ({ id: 'o', titulo: 'Texto', modo: 'lista', fragmentos: b.o.map((t, k) => (t ? { id: `o${k + 1}`, t } : llena ? { id: `o${k + 1}`, t: b.ok } : { id: `o${k + 1}`, hueco: true, reserva: '¿?' })) });
        const hueco = b.o.indexOf(null) + 1, sigue = b.o[hueco];
        return {
          enunciado: `El texto empieza: «${b.o[0].replace(/\.$/, '')}». ¿Qué oración debe ir en el espacio para que mantenga su hilo?`,
          dibujo: { datos: conOpciones({ secciones: [sec(false)] }, ops), estado: {} },
          pasos: [
            { tipo: 'pide', texto: `Piden la oración ${hueco}: la que mantiene el hilo entre la oración de antes y la de después.` },
            { tipo: 'datos', texto: `Después del espacio viene «${sigue.replace(/\.$/, '')}». Esa oración necesita algo dicho antes.` },
            { tipo: 'regla', texto: 'La oración que falta parte de lo ya dicho y presenta lo que la siguiente retoma.', ecuacion: [ref('lo dicho'), ' + ', nuevo('lo que viene')] },
            { tipo: 'aplica', texto: `Descarto «${mala[0].replace(/\.$/, '')}»: ${minus(mala[2])}` },
            { tipo: 'aplica', texto: `Queda «${b.ok.replace(/\.$/, '')}». Retoma la ${hueco - 1} y prepara la ${hueco + 1}.`, ecuacion: [ref(`${hueco - 1}`), ' → ', nuevo(`${hueco}`), ' → ', ref(`${hueco + 1}`)],
              dibujo: { datos: conOpciones({ secciones: [sec(true)] }, ops), estado: marcarOps(ops, { marcas: { [`o${hueco}`]: 'o' }, sellos: { o: { t: 'El hilo sigue', c: 'i' } } }) } },
            { tipo: 'sentido', texto: 'Leo las tres oraciones seguidas: cada una parte de lo anterior y el texto no da saltos.' },
          ],
          respuesta: `«${b.ok}»`,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const B = BANCO_HILO;
        const b = B[s % B.length];
        const datos = { esquinaLibre: true, secciones: [{ id: 'o', titulo: 'Texto', modo: 'lista', fragmentos: b.o.map((t, k) => (t ? { id: `o${k + 1}`, t } : { id: `o${k + 1}`, hueco: true, reserva: '¿?' })) }] };
        return {
          pregunta: `¿Qué oración debe ir en el espacio para que el texto mantenga su hilo?`,
          dibujo: { datos, estado: {} },
          opciones: opciones(b.ok, voltear(b.m, s)),
          solucion: { texto: 'Retoma lo anterior y presenta lo que la siguiente necesita.', ecuacion: [ref('lo dicho'), ' + ', nuevo('lo que viene')] },
        };
      },
    },
  };

  // ---------- Idea 4: tener conectores no es tener sentido ----------
  // Cambia: la palabra de cantidad de la primera oración. Permanece: la segunda («Sin embargo, tres desaprobaron»).
  // Progresa: de contradicción a texto coherente. Se reserva: el texto con conectores y sin sentido (predicción).
  // Debe verse: que con «todos» las dos oraciones no pueden ser verdad a la vez.
  const CUANT = { todos: { t: 'Todos los alumnos aprobaron el examen.', ok: false }, mayoria: { t: 'La mayoría de los alumnos aprobaron el examen.', ok: true }, casi: { t: 'Casi todos los alumnos aprobaron el examen.', ok: true } };
  const figExa = k => ({ esquinaLibre: true, secciones: [{ id: 'o', titulo: 'Texto', modo: 'tarjeta', fragmentos: [{ id: 'a', t: CUANT[k].t }, { id: 'b', t: 'Sin embargo, tres alumnos lo desaprobaron.' }] }] });
  const figExaB = k => conBandeja(figExa(k), 'Cantidad', [['todos', 'Todos'], ['mayoria', 'La mayoría'], ['casi', 'Casi todos']].map(([id, t]) => ({ id, t })));
  const estExa = (k, extra = {}) => Object.assign({ marcas: { a: CUANT[k].ok ? 'i' : 'h', b: CUANT[k].ok ? 'i' : 'h' }, sellos: { o: CUANT[k].ok ? { t: 'Coherente', c: 'i' } : { t: 'Se contradice', c: 'h' } } }, extra);
  const noContradiccion = {
    id: 'no-contradiccion',
    titulo: 'Conectores no garantizan sentido',
    temas: ['Principio de no contradicción'],
    pieza: 'rv-texto',
    // Lee (fase 2): las dos palabras del tema y las de cantidad, sin juzgar el texto del río seco (Predice).
    lee: {
      tarjetas: [
        { titulo: 'Dos palabras', texto: 'La cohesión es cómo se unen las oraciones: conectores, pronombres, repeticiones. La coherencia es que el texto entero tenga sentido.' },
        { titulo: 'Palabras de cantidad', texto: 'Palabras como «todos», «la mayoría», «algunos» o «ninguno» dicen cuántos. Son pequeñas, pero cambian por completo lo que afirma una oración.' },
        { titulo: 'Qué mirar', texto: 'En el juego cambias la cantidad de la primera oración; la segunda queda igual. Mira cuándo las dos pueden ser verdad al mismo tiempo.' },
      ],
    },
    juega: {
      consigna: 'Cambia la cantidad en la primera oración. Mira cuándo las dos oraciones pueden ser verdad al mismo tiempo.',
      voz: 'El «sin embargo» está bien puesto; mira lo que dicen.',
      controles: [{ id: 'k', etiqueta: 'Cantidad', opciones: [{ valor: 'todos', texto: 'Todos' }, { valor: 'mayoria', texto: 'La mayoría' }, { valor: 'casi', texto: 'Casi todos' }] }],
      dibujo: val => ({ datos: figExaB(val.k), estado: conFicha(estExa(val.k), val.k) }),
      // Arrastra la ficha a otra cantidad: cambia la primera oración; la segunda queda igual.
      arrastres: [manija('ficha', 'k', val => figExaB(val.k), Object.keys(CUANT), 'ficha de la cantidad')],
      lectura: val => [CUANT[val.k].ok ? corto(ref, 'Pueden ser verdad a la vez') : corto(mal, 'No pueden ser verdad a la vez')],
      minimo: 3,
    },
    predice: {
      pregunta: '«El río estaba completamente seco. Por eso, los niños nadaron en él toda la tarde.» ¿El texto es coherente?',
      opciones: opciones('No: no se puede nadar en un río seco', [
        ['Sí: tiene un conector de causa', 'RVC3', 'El conector está bien elegido para la forma, pero lo que dicen las oraciones choca.'],
        ['Sí: las dos oraciones están bien escritas', 'RVC3', 'Cada oración es correcta sola; juntas dicen algo imposible.'],
        ['No: le falta un conector de adición', 'RVC3', 'Ningún conector arregla que el río esté seco y se nade en él.'],
      ]),
      dibujo: { datos: tarjeta('Texto', [['a', 'El río estaba completamente seco.'], ['c', 'Por eso,'], ['b', 'los niños nadaron en él toda la tarde.']]), estado: { marcas: { c: 'o' } } },
      revelar: { datos: tarjeta('Texto', [['a', 'El río estaba completamente seco.'], ['c', 'Por eso,'], ['b', 'los niños nadaron en él toda la tarde.']]), estado: { marcas: { c: 'o', a: 'h', b: 'h' }, sellos: { o: { t: 'Se contradice', c: 'h' } } } },
      coincide: 'Coincide: hay cohesión (el conector, el pronombre «él»), pero no coherencia.',
    },
    mira: {
      // Las dos versiones, una sobre otra: la línea de tiempo compara sin cambiar de figura.
      datos: { esquinaLibre: true, secciones: [
        { id: 'v1', titulo: 'Con «todos»', modo: 'tarjeta', fragmentos: [{ id: 'a1', t: CUANT.todos.t }, { id: 'c1', t: 'Sin embargo,' }, { id: 'b1', t: 'tres alumnos lo desaprobaron.' }] },
        { id: 'v2', titulo: 'Con «la mayoría»', modo: 'tarjeta', fragmentos: [{ id: 'a2', t: CUANT.mayoria.t }, { id: 'c2', t: 'Sin embargo,' }, { id: 'b2', t: 'tres alumnos lo desaprobaron.' }] },
      ] },
      pasos: [
        { estado: { marcas: { a1: 'h', b1: 'h' }, tapar: ['a2', 'c2', 'b2'], sellos: { v1: { t: 'Se contradice', c: 'h' } } }, texto: 'Si todos aprobaron, nadie desaprobó: la 2 dice lo contrario.', ecuacion: [mal('todos aprobaron'), ' y ', mal('tres no'), ': imposible'] },
        { estado: { marcas: { a1: 'h', b1: 'h', a2: 'i', b2: 'i' }, sellos: { v1: { t: 'Se contradice', c: 'h' }, v2: { t: 'Coherente', c: 'i' } }, nuevo: ['v2', 'a2', 'b2'] }, texto: 'Con «la mayoría», tres pueden haber desaprobado: no hay choque.', ecuacion: [ref('la mayoría'), ' + ', ref('tres no'), ': posible'] },
        { estado: { marcas: { c1: 'o', c2: 'o', a1: 'h', a2: 'i' }, sellos: { v1: { t: 'Se contradice', c: 'h' }, v2: { t: 'Coherente', c: 'i' } }, nuevo: ['c1', 'c2'] }, texto: 'El mismo conector en las dos: el sentido depende de lo que se afirma.', ecuacion: [remite('cohesión'), ' ≠ ', ref('coherencia')] },
      ],
    },
    regla: {
      texto: 'Un texto coherente no afirma y niega lo mismo, sobre lo mismo y al mismo tiempo. La cohesión (conectores, pronombres) une la forma; no garantiza que el sentido se sostenga.',
      ecuacion: [ref('A'), ' y ', { llave: [mal('no A')], nota: 'lo niega', color: 'c-h' }, ' no pueden ser verdad a la vez'],
      condicion: 'se comparan las afirmaciones con su cantidad (todos, algunos), su tiempo y su lugar: si cambian, quizá no chocan.',
    },
    // Así se resuelve (fase 2): otro texto del banco de «Ahora tú»; se comparan las dos afirmaciones.
    resuelve: {
      pieza: 'rv-texto',
      voz: 'Olvida los conectores un momento: compara lo que dicen.',
      generar(s) {
        const b = BANCO_COHERENTE[otroIndice(s, BANCO_COHERENTE.length)], ops = ordenar(b, s);
        const k = b.o.indexOf('. '), a1 = b.o.slice(0, k + 1), a2 = b.o.slice(k + 2), si = b.ok.startsWith('Sí');
        const [veredicto, razon] = b.ok.split(': '), conector = b.m.find(x => x[1] === 'RVC3');
        const datos = conOpciones(tarjeta('Texto', [['a', a1], ['b', a2]]), ops);
        return {
          enunciado: `«${b.o}» ¿Este texto es coherente?`,
          dibujo: { datos, estado: {} },
          pasos: [
            { tipo: 'pide', texto: 'Piden decidir si el texto es coherente: si sus afirmaciones pueden ser verdad al mismo tiempo.' },
            { tipo: 'datos', texto: `Primera afirmación: «${a1}» Segunda: «${a2}»`, ecuacion: [ref('A'), ' · ', ref('B')] },
            { tipo: 'regla', texto: 'Un conector bien puesto no basta. Me pregunto si una oración niega lo que afirma la otra.', ecuacion: [ref('A'), ' y ', ref('B'), ' ¿a la vez?'] },
            { tipo: 'aplica', texto: `${veredicto}: ${razon}.`, ecuacion: [ref('A'), ' y ', (si ? ref : mal)('B'), si ? ': posible a la vez' : ': no a la vez'],
              dibujo: { datos, estado: marcarOps(ops, { marcas: { a: si ? 'i' : 'h', b: si ? 'i' : 'h' }, sellos: { o: si ? { t: 'Coherente', c: 'i' } : { t: 'Se contradice', c: 'h' } } }) } },
            { tipo: 'sentido', texto: `Descarto «${conector[0].replace(/«/g, "“").replace(/»/g, "”")}». ${conector[2]}` },
          ],
          respuesta: b.ok,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const B = BANCO_COHERENTE;
        const b = B[s % B.length];
        return {
          pregunta: '¿Este texto es coherente?',
          dibujo: { datos: tarjeta('Texto', [['a', b.o]]), estado: {} },
          opciones: opciones(b.ok, voltear(b.m, s)),
          solucion: { texto: 'Se pregunta si las dos afirmaciones pueden ser verdad a la vez.', ecuacion: [ref('A'), ' y ', ref('B'), ' ¿a la vez?'] },
        };
      },
    },
  };

  // ---------- Laboratorio: concordar no basta ----------
  // Más rico que la idea 1: tres pronombres y cuatro candidatos, con dos manijas (el pronombre y su referente). El
  // código decide la concordancia con el género y el número de cada palabra (regla 1); el sentido es un dato del texto
  // (qué se puede sembrar o guardar vacío). El sello solo dice «tiene sentido» si se cumplen las dos cosas.
  const PALABRAS = {
    m0: { t: 'Los vecinos', g: 'm', n: 'pl' }, m1: { t: 'unas semillas', g: 'f', n: 'pl' },
    m2: { t: 'un costal', g: 'm', n: 'sg' }, m3: { t: 'un burro', g: 'm', n: 'sg' },
    m4: { t: 'ellos', g: 'm', n: 'pl', sentido: 'm0' }, m5: { t: 'las', g: 'f', n: 'pl', sentido: 'm1' }, m6: { t: 'lo', g: 'm', n: 'sg', sentido: 'm2' },
  };
  const CANDS = ['m0', 'm1', 'm2', 'm3'], PRONS = ['m4', 'm5', 'm6'];
  const RASGO = w => `${w.g === 'm' ? 'masculino' : 'femenino'} ${w.n === 'sg' ? 'singular' : 'plural'}`;
  const VECINOS = texto('Texto', '[[Los vecinos]] compraron [[unas semillas]], [[un costal]] y [[un burro]]. Después, [[ellos]] [[las]] sembraron y [[lo]] guardaron vacío en el corral.');
  const concuerda = (p, r) => PALABRAS[p].g === PALABRAS[r].g && PALABRAS[p].n === PALABRAS[r].n;
  const conSentido = (p, r) => concuerda(p, r) && PALABRAS[p].sentido === r;
  const mesaConcuerda = {
    id: 'concordar-no-basta', titulo: 'Concordar no basta', pieza: 'rv-texto',
    consigna: 'Arrastra un pronombre y su referente. Mira si concuerdan en género y número, y si además tiene sentido.',
    voz: 'Prueba «lo» con el costal y con el burro.',
    controles: [
      { id: 'p', etiqueta: 'Pronombre', opciones: PRONS.map(valor => ({ valor, texto: PALABRAS[valor].t })) },
      { id: 'r', etiqueta: 'Referente', opciones: CANDS.map(valor => ({ valor, texto: PALABRAS[valor].t })) },
    ],
    dibujo: val => {
      const c = concuerda(val.p, val.r), ok = conSentido(val.p, val.r);
      return { datos: VECINOS, estado: { marcas: { [val.p]: 'o', [val.r]: ok ? 'i' : 'h' }, sellos: { o: ok ? { t: 'Tiene sentido', c: 'i' } : c ? { t: 'Concuerda, sin sentido', c: 'h' } : { t: 'No concuerda', c: 'h' } } } };
    },
    lectura: val => {
      const c = concuerda(val.p, val.r), ok = conSentido(val.p, val.r);
      return [remite(PALABRAS[val.p].t), ` (${RASGO(PALABRAS[val.p])}) → `, ok ? ref(PALABRAS[val.r].t) : mal(PALABRAS[val.r].t), c ? (ok ? ' · concuerda y tiene sentido' : ' · concuerda, sin sentido') : ' · no concuerda'];
    },
    arrastres: [
      manija('pronombre', 'p', () => VECINOS, PRONS, 'pronombre que se mira'),
      manija('referente', 'r', () => VECINOS, CANDS, 'referente del pronombre', 'c-i'),
    ],
    // Retos: los comprueban concuerda y conSentido, las mismas que deciden el sello del texto.
    invitaciones: [
      { texto: 'Encuentra el referente con sentido del pronombre «las».',
        logrado: val => val.p === 'm5' && conSentido(val.p, val.r),
        bien: '«Las» retoma las semillas: lo que se siembra. ¿Y «lo»?' },
      { texto: 'Une «lo» con un referente que concuerde, pero no tenga sentido.',
        logrado: val => val.p === 'm6' && concuerda(val.p, val.r) && !conSentido(val.p, val.r),
        bien: 'Burro y costal concuerdan con «lo»; solo el costal se guarda vacío.' },
      { texto: 'Busca un par que no concuerde ni en género ni en número.',
        logrado: val => PALABRAS[val.p].g !== PALABRAS[val.r].g && PALABRAS[val.p].n !== PALABRAS[val.r].n,
        bien: 'Ahí la forma ya descarta el par, antes de pensar en el sentido.' },
      { texto: 'Guarda dos casos con el mismo pronombre: uno con sentido y otro sin él.',
        logrado: (val, guardados) => guardados.some(g => g.p === val.p && g.r !== val.r && conSentido(g.p, g.r) !== conSentido(val.p, val.r)),
        bien: 'El mismo pronombre, dos referentes: el texto decide cuál sostiene.' },
    ],
  };

  return {
    unidad: 'razonamiento-verbal.cohesion-y-coherencia',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rv-texto.js'],
    historia: {
      texto: 'Desde los años setenta, la lingüística del texto estudió lo que no se ve mirando oraciones sueltas: cómo se enlazan y qué sentido forman juntas. Autores como Beaugrande, Dressler y van Dijk separaron los enlaces visibles del sentido global. Por eso, un texto lleno de conectores puede no entenderse.',
      pregunta: '¿Basta un «por eso» para que un texto tenga sentido?',
      fuente: { titulo: 'Matriz de teoría de razonamiento verbal (lingüística textual)', url: 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/diccio_ele/diccionario/cohesion.htm' },
    },
    glosario: [
      { termino: 'cohesión', def: 'Los enlaces visibles que unen las oraciones de un texto: conectores, pronombres, repeticiones.',
        ejemplo: '«Por eso» y «él» enlazan dos oraciones.', ver: ['coherencia', 'conector'] },
      { termino: 'coherencia', def: 'Que el texto tenga un sentido global y no se contradiga, aunque falten enlaces visibles.',
        ejemplo: '«Todos aprobaron. Tres desaprobaron.» no la tiene.', ver: ['cohesión', 'contradicción'] },
      { termino: 'referente', def: 'Aquello a lo que remite una palabra como «él», «lo» o «este animal».',
        ejemplo: 'En «Ana llegó; ella traía pan», el de «ella» es Ana.', ver: ['pronombre', 'anáfora'] },
      { termino: 'pronombre', def: 'Palabra que ocupa el lugar de un nombre para no repetirlo: él, ella, lo, las, esto.',
        ejemplo: '«Compré pan y lo comí»: «lo» está por «pan».', ver: ['referente', 'sustitución'] },
      { termino: 'anáfora', def: 'Palabra o expresión que retoma algo dicho antes en el texto.',
        ejemplo: '«Vi a Luis. Él me saludó.»', ver: ['catáfora', 'referente'] },
      { termino: 'catáfora', def: 'Palabra que anuncia algo que se dirá después en el texto.',
        ejemplo: '«Te lo advierto: no toques el cable.»', ver: ['anáfora'] },
      { termino: 'repetición', def: 'Volver a nombrar algo con la misma palabra para mantener el hilo del texto.',
        ejemplo: '«El agua es vital. El agua limpia previene males.»', ver: ['sustitución', 'elipsis'] },
      { termino: 'sustitución', def: 'Volver a nombrar algo con otra expresión o un pronombre que remite a lo mismo.',
        ejemplo: '«La vicuña… Este animal…»', ver: ['repetición', 'pronombre'] },
      { termino: 'elipsis', def: 'Callar una palabra ya dicha porque el lector la recupera sin esfuerzo.',
        ejemplo: '«Pedro compró pan y Ana, queso» (se calla «compró»).', ver: ['repetición', 'sustitución'] },
      { termino: 'concordancia', def: 'Coincidencia de género y número entre palabras que se refieren a lo mismo.',
        formas: ['concordancia', 'concuerda', 'concuerdan', 'concordar'], ejemplo: '«Las» va con «semillas»: femenino y plural.', ver: ['pronombre'] },
      { termino: 'tópico', def: 'Lo que una oración toma como ya conocido, del cual parte para decir algo más.',
        formas: ['tópico'], ejemplo: 'En «Esos caminos unían regiones», es «esos caminos».', ver: ['comento'] },
      { termino: 'comento', def: 'Lo nuevo que una oración agrega sobre lo ya conocido.',
        ejemplo: 'En «Esos caminos unían regiones», es «unían regiones».', ver: ['tópico'] },
    ],
    laboratorio: [
      mesaConcuerda,
      Object.assign({ id: 'referente', titulo: 'El texto de Marta', pieza: 'rv-texto',
        // Retos: OK dice qué referente da sentido y POR, qué pasa con cada par (lo mismo que muestra la lectura).
        invitaciones: [
          { texto: 'Une «Él» con el referente que da sentido al texto.',
            logrado: val => val.p === 'm3' && OK[val.p] === val.r,
            bien: '«Él» retoma al hermano, aunque el libro esté más cerca.' },
          { texto: 'Une «lo» con un referente que concuerde y aun así no tenga sentido.',
            logrado: val => val.p === 'm4' && OK[val.p] !== val.r && POR[`${val.p}-${val.r}`].startsWith('Concuerda'),
            bien: 'Concordar no basta: a una persona no se la lee.' },
          { texto: 'Guarda los dos pronombres, cada uno con su referente con sentido.',
            logrado: (val, guardados) => ['m3', 'm4'].every(p => guardados.some(g => g.p === p && OK[p] === g.r)),
            bien: 'Cada pronombre tiene su referente: el texto entero se sostiene.' },
        ] }, referencia.juega),
      Object.assign({ id: 'hilo', titulo: 'El hilo de los caminos', pieza: 'rv-texto',
        // Retos: CANDIDATAS dice si la oración mantiene el hilo y, si no, por qué falla (tema o nombre que falta).
        invitaciones: [
          { texto: 'Pon una candidata que cambie de tema y corte el hilo.',
            logrado: val => CANDIDATAS[val.c].falla === 'tema',
            bien: 'Los andenes son de los incas, pero la 4 ya no sabe de qué habla.' },
          { texto: 'Busca la candidata que retoma los caminos y aun así corta el hilo.',
            logrado: val => CANDIDATAS[val.c].falla === 'nombre',
            bien: 'Retomar no basta: la 4 necesita que alguien presente a los chasquis.' },
          { texto: 'Guarda un caso donde el hilo sigue y otro donde se corta.',
            logrado: (val, guardados) => guardados.some(g => CANDIDATAS[g.c].ok) && guardados.some(g => !CANDIDATAS[g.c].ok),
            bien: 'Compáralos: lo nuevo de la 3 es lo conocido de la 4.' },
        ] }, progresion.juega),
    ],
    ideas: [referencia, recursos, progresion, noContradiccion],
  };
});
