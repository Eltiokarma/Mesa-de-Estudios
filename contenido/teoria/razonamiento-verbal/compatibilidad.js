/*
 * Teoría de «Compatibilidad e incompatibilidad» (razonamiento-verbal.compatibilidad). Molde: docs/teoria.md.
 * Contenido: matriz de verbal (unidad 13), historia (Aristóteles, Sobre la interpretación) y códigos RV8–RV11, RV34,
 * RV36. Textos propios (regla 5). Ruta C · Comparar: cada afirmación se pone junto a las frases que la deciden.
 *
 * Ficha de tarea:
 *   Promesa: clasificar una afirmación como dicha, deducida, contradicha o indeterminada, con su evidencia.
 *   Persona y condiciones: postulante de 3.º a 5.º, celular, sin audio; compatibilidad (UNI 18, UNMSM 8).
 *   Resultado observable: clasifica afirmaciones y da evidencia o un contraejemplo para el caso que no se sabe.
 *   Orden de atención: 1.º la afirmación · 2.º las frases que la deciden (i o h) · 3.º el sello de su casilla.
 *   Estados: lo dice · se deduce · lo contradice · lo contradice por deducción · no se puede saber.
 *   Duda que resuelve: ¿lo que el texto no menciona es incompatible?
 *
 * Colores (regla 4): la frase que respalda i (turquesa, continuo), la afirmación que se evalúa o (naranja,
 * discontinuo), lo que no se puede saber d (verde, punteado), la frase que contradice h (rojo).
 * Códigos: RV8, RV9 (incompatibilidad implícita no vista), RV10 (negación o cuantificador), RV11, RV34, RV36 (no
 * mencionado tomado como incompatible). Sin códigos nuevos.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  // Gesto directo (docs/teoria.md §4b): el alumno arrastra el marcador por el texto y lo suelta en la frase que quiere
  // revisar. La manija se pone sobre el número de esa frase (rv-texto.ancla) y salta a la más cercana al dedo
  // (rv-texto.cercana): el control «Frase» con sus botones es la alternativa sin arrastre.
  const RV = () => Kit.piezas['rv-texto'];
  const frases = n => Array.from({ length: n }, (_, k) => ({ valor: `o${k + 1}`, texto: `${k + 1}` }));
  const marcador = (datosDe, ids, etiqueta = 'marcador de la frase') => ({
    id: 'frase', etiqueta, color: 'c-i',
    donde: val => RV().ancla(datosDe(val), val.f),
    mover: (pt, val) => ({ f: RV().cercana(datosDe(val), pt, ids) }),
  });
  const corto = (fn, t) => {
    // El trozo de color no se parte: con 14 letras o menos cabe en la miniatura de un caso guardado del laboratorio.
    if (t.length <= 14) return fn(t);
    const k = [t.indexOf(': '), t.indexOf(', ')].filter(i => i > 0).sort((a, b) => a - b)[0];
    if (k && k <= 14) return [fn(t.slice(0, k)), t.slice(k)];
    const ps = t.split(' '); let n = 1;
    while (n < ps.length && ps.slice(0, n + 1).join(' ').length <= 14) n++;
    return [fn(ps.slice(0, n).join(' ')), ' ' + ps.slice(n).join(' ')];
  };
  const resp = t => ({ v: 'c-i', t }), afir = t => ({ v: 'c-o', t }), nose = t => ({ v: 'c-d', t }), contra = t => ({ v: 'c-h', t });
  const opciones = (c, malas) => [{ id: 'c', texto: c, correcta: true }, ...malas.map(([texto, error, siFuera], k) => ({ id: `e${k}`, texto, error, siFuera }))];
  const voltear = (arr, s) => (s % 2 ? arr.slice().reverse() : arr.slice());
  const figura = (frs, af) => ({ secciones: [
    { id: 'o', titulo: 'Texto', modo: 'lista', fragmentos: frs.map((t, k) => ({ id: `o${k + 1}`, t })) },
    { id: 'a', titulo: 'Afirmación', modo: 'tarjeta', fragmentos: [{ id: 'a1', t: af }] },
  ] });
  // Azar con semilla (el mismo de aritmetica/razones-y-proporciones.js): «Así se resuelve» elige con azar(s + 900).
  // El primer valor de semillas seguidas cae casi siempre en el mismo tramo: se descarta para que salgan todos los ítems.
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    return r;
  }
  const elegir = (banco, s) => { const r = azar(s + 900); r(); return { b: banco[Math.floor(r() * banco.length)], r }; };
  const COLOR = { Compatible: resp, Incompatible: contra, 'No se puede saber': nose };
  const CASILLA = { dice: ['Lo dice', 'i'], deduce: ['Se deduce', 'i'], contradice: ['Lo contradice', 'h'], contraImpl: ['Lo contradice (deduciendo)', 'h'], nose: ['No se puede saber', 'd'] };

  // ---------- Idea 1: cuatro casillas para cada afirmación ----------
  // Cambia: la afirmación. Permanece: el texto de Ccota. Progresa: de lo explícito a lo implícito, y la casilla del
  // «no se sabe». Se reserva: el cuantificador «al menos uno» (predicción). Debe verse: qué frase decide cada caso.
  const CCOTA = ['En Ccota, todas las casas tienen luz desde 2020.', 'En 2015, ninguna casa tenía luz.', 'La escuela de la comunidad abrió en 2018.'];
  const AF = {
    dice: { t: 'Las casas de Ccota tienen luz.', marcas: { o1: 'i' }, c: 'dice', por: 'Lo dice la oración 1' },
    deduce: { t: 'La luz llegó a Ccota entre 2015 y 2020.', marcas: { o1: 'i', o2: 'i' }, c: 'deduce', por: 'Se deduce uniendo la 1 y la 2' },
    contradice: { t: 'Algunas casas de Ccota no tienen luz.', marcas: { o1: 'h' }, c: 'contradice', por: '«Todas» choca con «algunas no»' },
    impl: { t: 'Ccota tiene luz desde 2012.', marcas: { o2: 'h' }, c: 'contraImpl', por: 'Choca con la 2: en 2015 no había' },
    nose: { t: 'La escuela tiene computadoras.', marcas: { o3: 'd' }, c: 'nose', por: 'El texto no lo dice ni lo niega' },
  };
  const estAf = (k, extra = {}) => Object.assign({ marcas: Object.assign({ a1: CASILLA[AF[k].c][1] === 'h' ? 'h' : 'o' }, AF[k].marcas), sellos: { a: { t: CASILLA[AF[k].c][0], c: CASILLA[AF[k].c][1] } } }, extra);
  // La frase que el alumno revisa: si es de las que deciden, se marca con su color y aparece la casilla; si no, queda
  // con trazo punteado (no habla de lo mismo) y la afirmación espera su sello.
  const decide = (k, f) => Object.prototype.hasOwnProperty.call(AF[k].marcas, f) && AF[k].c !== 'nose';
  function revisaFrase(k, f) {
    if (decide(k, f)) return estAf(k, { nuevo: ['a'] });
    return { marcas: { a1: 'o', [f]: 'd' } };
  }
  function leeFrase(k, f) {
    const n = f.slice(1), c = CASILLA[AF[k].c];
    if (AF[k].c === 'nose') return [nose(`La ${n} no lo decide`), ' · ninguna lo decide'];
    if (!decide(k, f)) return [nose(`La ${n} no habla de esto`), ' · busca otra'];
    return [corto(c[1] === 'h' ? contra : resp, AF[k].por)];
  }
  // Banco de «Así se resuelve» (propio, distinto del de «Ahora tú»): texto, afirmación, casilla, frases que deciden
  // y el razonamiento de cada paso.
  const RES_CASILLA = [
    { o: ['Todas las combis de la línea 12 pasan por el puente.', 'La combi de Iván es de la línea 12.'], a: 'La combi de Iván no pasa por el puente.',
      ok: 'Incompatible', marcas: { o1: 'h', o2: 'h' }, por: 'las dos frases juntas la descartan.',
      datos: 'Dos frases: una regla para todas las combis de la línea 12 y el dato de que la de Iván es una de ellas.',
      aplica: 'Si todas pasan por el puente y la de Iván es de esa línea, la suya pasa. La afirmación dice lo contrario: choca.',
      sentido: '¿Y si no se pudiera saber? Sí se puede: ninguna frase sola lo decide, pero las dos juntas no dejan otra salida.' },
    { o: ['El concurso de danzas fue en febrero.', 'Llovió toda la mañana del concurso.'], a: 'Ese día hubo más público que el año pasado.',
      ok: 'No se puede saber', marcas: { o1: 'd', o2: 'd' }, por: 'el texto no habla del público.',
      datos: 'Dos frases: cuándo fue el concurso y qué tiempo hizo. Ninguna menciona al público ni al año pasado.',
      aplica: 'Busco una frase sobre el público y no la hay. La lluvia hace pensar en poca gente, pero eso no lo dice ni lo niega.',
      sentido: '¿Y si fuera incompatible? Para eso, el texto tendría que decir que hubo menos gente. Que no lo mencione no lo contradice.' },
    { o: ['Algunas alumnas del taller tocan zampoña.'], a: 'Ninguna alumna del taller toca zampoña.',
      ok: 'Incompatible', marcas: { o1: 'h' }, por: '«algunas sí» y «ninguna» no pueden ser verdad juntas.',
      datos: 'Una frase con un cuantificador: «algunas». La afirmación habla de las mismas alumnas, pero con «ninguna».',
      aplica: 'Si al menos una toca zampoña, es falso que ninguna la toque. La frase y la afirmación no pueden ser verdad a la vez: choca.',
      sentido: '¿Y si no se pudiera saber? «Algunas» deja abierto si son todas, pero no si es ninguna: eso sí lo decide.' },
    { o: ['La carrera de la feria empezó a las 8.', 'Ana llegó a la meta dos horas después de la partida.'], a: 'Ana llegó a la meta a las 10.',
      ok: 'Compatible', marcas: { o1: 'i', o2: 'i' }, por: 'se deduce sumando las horas de las dos frases.',
      datos: 'Dos frases: la hora de partida, las 8, y cuánto tardó Ana, dos horas. La afirmación da una hora de llegada.',
      aplica: 'Uno las dos frases: 8 más 2 son 10. La afirmación sale del texto, aunque ninguna frase la diga así.',
      sentido: '¿Y si no se pudiera saber? El texto no escribe «a las 10», pero lo obliga. Deducir también cuenta como compatible.' },
  ];
  const casillas = {
    id: 'cuatro-casillas',
    titulo: 'Dice, deduce, contradice o no sabe',
    temas: ['Compatibilidad explícita e implícita', 'Incompatibilidad explícita e implícita'],
    pieza: 'rv-texto',
    // Lee (fase 2): compatible e incompatible, las casillas y qué mirar. No dice qué pasa con «al menos uno» frente a
    // «todas» (eso lo descubre en Predice, con las aves).
    lee: {
      tarjetas: [
        { titulo: 'Pueden ir juntas', texto: 'Dos afirmaciones son compatibles si pueden ser verdad a la vez, como «hoy hay feria» y «hoy es domingo». Son incompatibles si una descarta a la otra: «Juan está ahora en Juliaca» y «Juan está ahora en Lima».' },
        { titulo: 'Las casillas', texto: 'Frente a un texto, una afirmación puede estar dicha con sus palabras, salir uniendo frases, chocar con lo que dice o quedar sin decidir. En el juego, cada una de esas casillas tiene su sello.' },
        { titulo: 'Qué mirar', texto: 'El texto del juego habla de la luz en Ccota. Lleva el círculo turquesa a cada frase y busca la que decide la afirmación. Fíjate en los años que menciona cada frase.' },
      ],
    },
    juega: {
      consigna: 'Pon cada afirmación junto al texto de Ccota. Mira qué frase la decide y en qué casilla cae.',
      voz: 'No mencionar algo no es contradecirlo.',
      controles: [
        { id: 'k', etiqueta: 'Afirmación', opciones: [{ valor: 'dice', texto: '1' }, { valor: 'deduce', texto: '2' }, { valor: 'contradice', texto: '3' }, { valor: 'impl', texto: '4' }, { valor: 'nose', texto: '5' }] },
        { id: 'f', etiqueta: 'Frase', opciones: frases(3), inicio: 'o3' },
      ],
      dibujo: val => ({ datos: figura(CCOTA, AF[val.k].t), estado: revisaFrase(val.k, val.f) }),
      lectura: val => leeFrase(val.k, val.f),
      minimo: 4,
      // Arrastra el marcador por el texto: la casilla aparece cuando lo sueltas en una frase que decide.
      arrastres: [marcador(val => figura(CCOTA, AF[val.k].t), ['o1', 'o2', 'o3'])],
    },
    predice: {
      pregunta: 'El texto dice que al menos un ave de la reserva migra. ¿Qué pasa con la afirmación de la tarjeta?',
      voz: 'Fíjate en «al menos uno» y en «todas».',
      opciones: opciones('No se puede saber con este texto', [
        ['Es compatible: lo dice el texto', 'RV11', '«Al menos una» deja abierto si son todas; no lo afirma.'],
        ['Es incompatible: lo contradice', 'RV36', 'Lo contradiría «ninguna migra»; «al menos una» no lo niega.'],
        ['Es compatible: se deduce', 'RV7', 'De una no se deduce todas: podría haber aves que no migran.'],
      ]),
      dibujo: { datos: figura(['Al menos un ave de la reserva migra en invierno.'], 'Todas las aves de la reserva migran.'), estado: { marcas: { a1: 'o' } } },
      revelar: { datos: figura(['Al menos un ave de la reserva migra en invierno.'], 'Todas las aves de la reserva migran.'), estado: { marcas: { o1: 'd', a1: 'o' }, sellos: { a: { t: 'No se puede saber', c: 'd' } } } },
      coincide: 'Coincide: el texto no decide si son todas; contradiría a «ninguna migra».',
    },
    mira: {
      datos: figura(CCOTA, AF.impl.t),
      pasos: [
        { estado: { marcas: { a1: 'o' } }, texto: 'Primero: ¿qué frase habla de lo mismo? Aquí, del año de la luz.', ecuacion: [afir('desde 2012')] },
        { estado: { marcas: { a1: 'o', o2: 'h' }, nuevo: ['o2'] }, texto: 'La 2 dice que en 2015 ninguna casa tenía luz.', ecuacion: [contra('2015: sin luz')] },
        { estado: estAf('impl', { nuevo: ['a'] }), texto: 'Si en 2015 no había, no pudo haber desde 2012: choca sin decirlo igual.', ecuacion: [afir('desde 2012'), ' + ', contra('2015 sin luz'), ' = imposible'] },
      ],
    },
    regla: {
      texto: 'Una afirmación es compatible si el texto la dice o se deduce de él; incompatible si la contradice, con sus palabras o deduciendo. Si no, no se sabe.',
      ecuacion: [{ llave: [resp('dice | deduce')], nota: 'compatible', color: 'c-i' }, '   ·   ', { llave: [contra('contradice')], nota: 'incompatible', color: 'c-h' }, '   ·   ', nose('no se sabe')],
      condicion: 'se compara sujeto, tiempo y cuantificador (todos, algunos, ninguno); lo no mencionado no es incompatible.',
    },
    // Así se resuelve (fase 2): el mismo tipo de «Ahora tú» (compatible, incompatible o no se sabe), con un banco propio
    // para no regalar sus casos. Los pasos se arman con los campos de cada ítem.
    resuelve: {
      pieza: 'rv-texto',
      generar(s) {
        const { b } = elegir(RES_CASILLA, s), col = COLOR[b.ok];
        const a1 = { Compatible: 'o', Incompatible: 'h', 'No se puede saber': 'o' }[b.ok], sello = { Compatible: 'i', Incompatible: 'h', 'No se puede saber': 'd' }[b.ok];
        return {
          enunciado: `¿La afirmación «${b.a.replace(/\.$/, '')}» es compatible con el texto, incompatible o no se puede saber?`,
          dibujo: { datos: figura(b.o, b.a), estado: { marcas: { a1: 'o' } } },
          pasos: [
            { tipo: 'pide', texto: ['Piden la casilla de la afirmación: ', resp('compatible'), ', ', contra('incompatible'), ' o ', nose('no se puede saber'), '.'] },
            { tipo: 'datos', texto: b.datos },
            { tipo: 'regla', texto: 'Busco la frase que habla de lo mismo. Si la afirmación sale del texto, es compatible; si choca con él, incompatible; si nada la decide, no se sabe.' },
            { tipo: 'aplica', texto: b.aplica, ecuacion: [afir('afirmación'), ' frente al ', resp('texto'), ' → ', col(b.ok.toLowerCase())],
              dibujo: { datos: figura(b.o, b.a), estado: { marcas: Object.assign({ a1 }, b.marcas), sellos: { a: { t: b.ok, c: sello } }, nuevo: ['a'] } } },
            { tipo: 'sentido', texto: b.sentido },
          ],
          respuesta: [col(b.ok), `: ${b.por}`],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const B = [
          { o: ['Todos los alumnos del 5.° B aprobaron física.', 'Rosa está en el 5.° B.'], a: 'Rosa desaprobó física.', ok: 'Incompatible', m: [['Compatible', 'RV9', 'Si todos aprobaron y Rosa es del salón, no pudo desaprobar.'], ['No se puede saber', 'RV34', 'Se puede: las dos frases juntas lo deciden.'], ['Compatible: lo dice', 'RV5', 'El texto nombra a Rosa, pero dice lo contrario.']] },
          { o: ['La feria abre los sábados.', 'Este sábado llovió todo el día.'], a: 'Este sábado la feria tuvo pocos visitantes.', ok: 'No se puede saber', m: [['Compatible', 'RV8', 'Es razonable, pero el texto no dice cuántos fueron.'], ['Incompatible', 'RV36', 'Nada en el texto lo niega.'], ['Compatible: lo dice', 'RV5', 'El texto no habla de visitantes.']] },
          { o: ['Ninguno de los pozos del barrio tiene agua potable.'], a: 'Algunos pozos del barrio tienen agua potable.', ok: 'Incompatible', m: [['Compatible', 'RV10', '«Ninguno» y «algunos sí» no pueden ser verdad a la vez.'], ['No se puede saber', 'RV34', 'Sí se puede: «ninguno» lo decide.'], ['Compatible: se deduce', 'RV10', 'Al contrario: lo niega.']] },
          { o: ['El museo cierra los lunes.', 'Visitamos el museo un día abierto.'], a: 'No visitamos el museo un lunes.', ok: 'Compatible', m: [['Incompatible', 'RV10', 'Tiene un «no», pero dice lo mismo que el texto.'], ['No se puede saber', 'RV34', 'Se deduce: si estaba abierto, no era lunes.'], ['Incompatible: lo niega', 'RV10', 'No lo niega: lo confirma.']] },
          { o: ['Algunos peces del lago son nativos.'], a: 'Todos los peces del lago son nativos.', ok: 'No se puede saber', m: [['Compatible', 'RV11', '«Algunos» no asegura «todos».'], ['Incompatible', 'RV36', '«Algunos» tampoco niega que sean todos.'], ['Compatible: se deduce', 'RV7', 'De algunos no se deduce todos.']] },
          { o: ['El tren a Cusco sale a las 7 y tarda diez horas.'], a: 'El tren llega a Cusco a las 17 horas.', ok: 'Compatible', m: [['Incompatible', 'RV9', 'Si sale a las 7 y tarda diez horas, llega a las 17.'], ['No se puede saber', 'RV34', 'Se deduce sumando las horas.'], ['Incompatible: no lo dice', 'RV36', 'No lo dice con esas palabras, pero se deduce.']] },
        ];
        const b = B[s % B.length];
        return {
          pregunta: '¿La afirmación es compatible con el texto, incompatible o no se puede saber?',
          dibujo: { datos: figura(b.o, b.a), estado: { marcas: { a1: 'o' } } },
          opciones: opciones(b.ok, voltear(b.m, s)),
          solucion: { texto: 'Se busca la frase que habla de lo mismo y se compara cantidad y tiempo.', ecuacion: [afir('afirmación'), ' frente a ', resp('el texto')] },
        };
      },
    },
  };

  // ---------- Idea 2: incompatible con la idea principal ----------
  // Cambia: la afirmación. Permanece: el texto de la bicicleta. Progresa: de chocar con una frase a chocar con el
  // sentido de todo el texto. Se reserva: la versión de un texto nuevo (predicción). Debe verse: que la afirmación
  // global choca con las tres oraciones a la vez.
  const BICI = ['La bicicleta no contamina el aire.', 'Además, pedalear todos los días mejora la salud.', 'Por eso, conviene usarla en la ciudad.'];
  const AF2 = {
    global: { t: 'Usar la bicicleta en la ciudad no trae ningún beneficio.', marcas: { o1: 'h', o2: 'h', o3: 'h' }, sello: ['Choca con la idea principal', 'h'], dice: 'Choca con todo el texto: su idea' },
    frase: { t: 'La bicicleta contamina el aire.', marcas: { o1: 'h' }, sello: ['Choca con la 1', 'h'], dice: 'Choca con una frase, no con todo' },
    nose: { t: 'Las bicicletas son caras en Juliaca.', marcas: {}, sello: ['No se puede saber', 'd'], dice: 'No habla de lo que dice el texto' },
  };
  // Banco de «Así se resuelve» (propio, distinto del de «Ahora tú»): texto, idea principal y tres afirmaciones (la que
  // la niega, una compatible y una de otro asunto).
  const RES_IDEA = [
    { tema: 'caminar', o: ['Caminar media hora al día fortalece el corazón.', 'También ayuda a dormir mejor.', 'Caminar a diario, entonces, cuida la salud.'],
      idea: 'caminar a diario cuida la salud', corto: 'no aporta nada', ok: 'Caminar a diario no aporta nada a la salud', comp: 'Caminar ayuda a dormir mejor', nose: 'Muchos prefieren caminar de mañana',
      datos: 'La 3 trae la idea principal: caminar a diario cuida la salud. La 1 y la 2 dan las razones.' },
    { tema: 'la totora', o: ['La totora sirve para hacer balsas y casas.', 'También alimenta al ganado de la orilla.', 'Por eso, la totora es valiosa para los pueblos del lago.'],
      idea: 'la totora es valiosa', corto: 'no tiene valor', ok: 'La totora no tiene valor para los pueblos del lago', comp: 'La totora alimenta al ganado', nose: 'La totora crece más en verano',
      datos: 'La 3 trae la idea principal: la totora es valiosa para los pueblos del lago. La 1 y la 2 dicen por qué.' },
    { tema: 'el ahorro', o: ['Ahorrar parte de la propina ayuda a cumplir metas.', 'Además, prepara para gastos inesperados.', 'Ahorrar, por tanto, beneficia a los jóvenes.'],
      idea: 'ahorrar beneficia a los jóvenes', corto: 'ningún beneficio', ok: 'Ahorrar no trae ningún beneficio a los jóvenes', comp: 'Ahorrar prepara para gastos inesperados', nose: 'Algunos jóvenes ahorran en una alcancía',
      datos: 'La 3 trae la idea principal: ahorrar beneficia a los jóvenes. La 1 y la 2 son las razones.' },
  ];
  const ideaPrincipal = {
    id: 'idea-principal',
    titulo: 'Chocar con la idea principal',
    temas: ['Incompatibilidad con la idea principal'],
    pieza: 'rv-texto',
    // Lee (fase 2): qué es la idea principal, cómo aparece en el examen y qué mirar. No dice qué distingue chocar con
    // la idea principal de chocar con un detalle (eso lo descubre en Predice, con el texto de la lectura).
    lee: {
      tarjetas: [
        { titulo: 'Lo que sostiene el texto', texto: 'La idea principal es lo que el texto defiende de principio a fin. Las demás oraciones la apoyan con razones o ejemplos. A veces está escrita en una frase; otras veces hay que armarla.' },
        { titulo: 'En el examen', texto: 'En la admisión aparece seguido esta pregunta: «Es incompatible con la idea principal…». Antes de mirar las opciones, conviene decir con tus palabras, en una línea, qué sostiene el texto.' },
        { titulo: 'Qué mirar', texto: 'En el juego hay tres afirmaciones y un texto sobre la bicicleta. Lleva el círculo turquesa por cada oración y cuenta con cuántas choca cada afirmación.' },
      ],
    },
    juega: {
      consigna: 'Prueba tres afirmaciones con el texto de la bicicleta. Mira si chocan con una frase o con la idea de todo el texto.',
      voz: 'La idea principal se lee en el conjunto.',
      controles: [
        { id: 'k', etiqueta: 'Afirmación', opciones: [{ valor: 'global', texto: 'A' }, { valor: 'frase', texto: 'B' }, { valor: 'nose', texto: 'C' }] },
        { id: 'f', etiqueta: 'Oración', opciones: frases(3) },
      ],
      dibujo: val => {
        const a = AF2[val.k], choca = a.marcas[val.f] === 'h';
        return { datos: figura(BICI, a.t), estado: { marcas: { a1: a.sello[1] === 'h' ? 'h' : 'o', [val.f]: choca ? 'h' : 'd' }, sellos: { a: { t: a.sello[0], c: a.sello[1] } } } };
      },
      lectura: val => {
        const a = AF2[val.k], n = val.f.slice(1), chocan = Object.keys(a.marcas).length;
        if (a.marcas[val.f] !== 'h') return [nose(`No choca con la ${n}`), ` · choca con ${chocan} de 3`];
        return [contra(`Choca con la ${n}`), ` · choca con ${chocan} de 3`];
      },
      minimo: 3,
      // Pasa el marcador por las tres oraciones: la afirmación global choca con todas; la de un detalle, con una.
      arrastres: [marcador(val => figura(BICI, AF2[val.k].t), ['o1', 'o2', 'o3'], 'marcador de la oración')],
    },
    predice: {
      pregunta: '¿Qué afirmación es incompatible con la idea principal del texto sobre la lectura?',
      opciones: opciones('Leer en casa no influye en cómo se aprende', [
        ['Algunos niños leen en la escuela', 'RV36', 'El texto no lo dice ni lo niega: no se puede saber.'],
        ['Los padres a veces están cansados', 'RV36', 'No habla de lo que el texto sostiene.'],
        ['Leer en casa ayuda a aprender', 'RV10', 'Es compatible: dice lo mismo que el texto.'],
      ]),
      dibujo: { datos: figura(['Los niños que leen en casa aprenden más palabras.', 'También entienden mejor lo que leen en clase.', 'Leer en familia, entonces, ayuda a aprender.'], '¿Cuál choca con la idea principal?'), estado: {} },
      revelar: { datos: figura(['Los niños que leen en casa aprenden más palabras.', 'También entienden mejor lo que leen en clase.', 'Leer en familia, entonces, ayuda a aprender.'], 'Leer en casa no influye en cómo se aprende.'), estado: { marcas: { o1: 'h', o2: 'h', o3: 'h', a1: 'h' }, sellos: { a: { t: 'Choca con la idea principal', c: 'h' } } } },
      coincide: 'Coincide: niega lo que sostienen las tres oraciones juntas.',
    },
    mira: {
      datos: figura(BICI, AF2.global.t),
      pasos: [
        { estado: { marcas: { o3: 'd' } }, texto: 'La idea principal: conviene usar la bicicleta en la ciudad.', ecuacion: [resp('idea principal')] },
        { estado: { marcas: { o1: 'i', o2: 'i', o3: 'd' }, nuevo: ['o1', 'o2'] }, texto: 'La 1 y la 2 la sostienen: no contamina y mejora la salud.', ecuacion: [resp('razones'), ' → ', resp('idea')] },
        { estado: { marcas: { o1: 'h', o2: 'h', o3: 'h', a1: 'h' }, sellos: { a: { t: 'Choca con la idea principal', c: 'h' } }, nuevo: ['a'] }, texto: '«Ningún beneficio» niega la idea y sus dos razones a la vez.', ecuacion: [contra('ningún beneficio'), ' ≠ ', resp('conviene usarla')] },
      ],
    },
    regla: {
      texto: 'Una afirmación es incompatible con la idea principal si niega lo que sostiene el texto completo, no solo un detalle. Para verlo, primero se reconstruye la idea principal.',
      ecuacion: [{ llave: [contra('afirmación')], nota: 'niega todo', color: 'c-h' }, ' ≠ ', { llave: [resp('idea principal')], nota: 'lo que sostiene', color: 'c-i' }],
      condicion: 'la afirmación habla del mismo asunto que la idea principal; si habla de otra cosa, no se puede saber.',
    },
    // Así se resuelve (fase 2): el mismo tipo de «Ahora tú» (qué afirmación choca con la idea principal), con un banco
    // propio. Las tres afirmaciones van en la figura, en un orden que cambia con la semilla.
    resuelve: {
      pieza: 'rv-texto',
      generar(s) {
        const { b, r } = elegir(RES_IDEA, s), orden = [['ok', b.ok], ['comp', b.comp], ['nose', b.nose]];
        for (let i = orden.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [orden[i], orden[j]] = [orden[j], orden[i]]; }
        const x = k => `x${orden.findIndex(([c]) => c === k) + 1}`;
        const fig = estado => ({ datos: { secciones: [
          { id: 'o', titulo: 'Texto', modo: 'lista', fragmentos: b.o.map((t, k) => ({ id: `o${k + 1}`, t })) },
          { id: 'x', titulo: 'Afirmaciones', modo: 'lista', fragmentos: orden.map(([, t], k) => ({ id: `x${k + 1}`, t: `${t}.` })) },
        ] }, estado });
        return {
          enunciado: `Lee el texto sobre ${b.tema}. ¿Cuál de las tres afirmaciones es incompatible con su idea principal?`,
          dibujo: fig({}),
          pasos: [
            { tipo: 'pide', texto: ['Piden una de las tres afirmaciones: la que ', contra('choca'), ' con la ', resp('idea principal'), ` del texto sobre ${b.tema}.`] },
            { tipo: 'datos', texto: b.datos, ecuacion: [resp('idea principal'), `: ${b.idea}`], dibujo: fig({ marcas: { o1: 'i', o2: 'i', o3: 'i' } }) },
            { tipo: 'regla', texto: 'Primero armo la idea principal. Choca con ella la afirmación que la niega entera; repetir un detalle o hablar de otra cosa no la contradice.' },
            { tipo: 'aplica', texto: `«${b.ok}» niega la idea principal y sus razones a la vez: choca con todo el texto.`,
              ecuacion: [contra(b.corto), ' ≠ ', resp(b.idea)],
              dibujo: fig({ marcas: { o1: 'h', o2: 'h', o3: 'h', [x('ok')]: 'h', [x('comp')]: 'd', [x('nose')]: 'd' }, sellos: { x: { t: 'Choca con la idea principal', c: 'h' } }, nuevo: ['x'] }) },
            { tipo: 'sentido', texto: `¿Y las otras? «${b.comp}» repite el texto: es compatible. «${b.nose}» trata otro asunto: no se sabe.` },
          ],
          respuesta: [contra(b.ok)],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const B = [
          { o: ['El agua del lago se usa para regar.', 'Si se contamina, las cosechas se dañan.', 'Cuidar el lago es cuidar la comida.'], ok: 'Lo que pase con el lago no afecta la comida', m: [['El agua del lago se usa para regar', 'RV10', 'Es compatible: lo dice la oración 1.'], ['Algunos peces del lago son grandes', 'RV36', 'No se puede saber: el texto no habla de peces.'], ['El lago está lejos de la ciudad', 'RV36', 'No se puede saber.']] },
          { o: ['Dormir poco baja la atención.', 'También dificulta recordar lo estudiado.', 'Dormir bien, por tanto, ayuda a aprender.'], ok: 'Dormir no tiene relación con aprender', m: [['Dormir poco baja la atención', 'RV10', 'Es compatible: lo dice.'], ['Algunos estudiantes duermen la siesta', 'RV36', 'No se puede saber.'], ['La atención baja después del almuerzo', 'RV36', 'No se puede saber: el texto no lo trata.']] },
          { o: ['Reciclar reduce la basura.', 'Además, ahorra materia prima.', 'Reciclar, entonces, beneficia a la ciudad.'], ok: 'Reciclar perjudica a la ciudad', m: [['Reciclar ahorra materia prima', 'RV10', 'Es compatible: lo dice.'], ['El vidrio pesa más que el papel', 'RV36', 'No se puede saber.'], ['Algunas ciudades no reciclan', 'RV36', 'No se puede saber.']] },
          { o: ['La quena se toca en muchas fiestas andinas.', 'Su sonido acompaña danzas y cantos.', 'Es un instrumento central en la música andina.'], ok: 'La quena casi no tiene lugar en la música andina', m: [['La quena se toca en fiestas', 'RV10', 'Es compatible: lo dice.'], ['La quena es difícil de aprender', 'RV36', 'No se puede saber.'], ['Algunas quenas son de hueso', 'RV36', 'No se puede saber: el texto no lo dice.']] },
          { o: ['Las vacunas preparan al cuerpo contra microbios.', 'Gracias a ellas, algunas enfermedades casi desaparecieron.', 'Vacunarse protege la salud.'], ok: 'Las vacunas no protegen la salud', m: [['Algunas enfermedades casi desaparecieron', 'RV10', 'Es compatible: lo dice.'], ['Las vacunas se guardan en frío', 'RV36', 'No se puede saber.'], ['Algunos niños temen las agujas', 'RV36', 'No se puede saber.']] },
        ];
        const b = B[s % B.length];
        return {
          pregunta: '¿Qué afirmación es incompatible con la idea principal del texto?',
          dibujo: { datos: { secciones: [{ id: 'o', titulo: 'Texto', modo: 'lista', fragmentos: b.o.map((t, k) => ({ id: `o${k + 1}`, t })) }] }, estado: {} },
          opciones: opciones(b.ok, voltear(b.m, s)),
          solucion: { texto: 'Se reconstruye la idea principal y se busca la que la niega.', ecuacion: [contra('niega'), ' → ', resp('idea principal')] },
        };
      },
    },
  };

  // ---------- Laboratorio: la mesa de los cuantificadores ----------
  // Lo que la idea 1 reserva para la predicción: «todas», «al menos una», «alguna no» y «ninguna», todas contra todas.
  // La casilla la calcula el código (regla 1): se recorren los tres mundos posibles (migran todas, migran solo algunas,
  // no migra ninguna) y se ve si la afirmación es verdadera en todos los mundos donde el texto lo es, en ninguno o en
  // unos sí y otros no. Se supone que la reserva tiene aves (si no, «todas» y «ninguna» serían verdad a la vez).
  const CUANT = [
    { valor: 'todas', texto: 'Todas', frase: 'Todas las aves de la reserva migran.', mundos: ['todas'] },
    { valor: 'alguna', texto: 'Al menos una', frase: 'Al menos un ave de la reserva migra.', mundos: ['todas', 'parte'] },
    { valor: 'algunaNo', texto: 'Alguna no', frase: 'Al menos un ave de la reserva no migra.', mundos: ['parte', 'ninguna'] },
    { valor: 'ninguna', texto: 'Ninguna', frase: 'Ninguna ave de la reserva migra.', mundos: ['ninguna'] },
  ];
  const MUNDOS = ['todas', 'parte', 'ninguna'];
  function casillaCuant(tv, av) {
    const T = CUANT.find(q => q.valor === tv), A = CUANT.find(q => q.valor === av);
    const posibles = MUNDOS.filter(m => T.mundos.includes(m));
    const si = posibles.filter(m => A.mundos.includes(m)).length;
    if (tv === av) return 'dice';
    if (si === posibles.length) return 'deduce';
    if (si === 0) return 'contradice';
    return 'nose';
  }
  const figCuant = () => ({ secciones: [
    { id: 't', titulo: 'El texto dice una de estas', modo: 'lista', fragmentos: CUANT.map(q => ({ id: q.valor, t: q.frase })) },
  ] });
  const figCuantAf = av => ({ secciones: figCuant().secciones.concat([{ id: 'a', titulo: 'Afirmación', modo: 'tarjeta', fragmentos: [{ id: 'a1', t: CUANT.find(q => q.valor === av).frase }] }]) });
  const mesaCuant = {
    id: 'cuantificadores', titulo: 'Todas, alguna, ninguna', pieza: 'rv-texto',
    consigna: 'Arrastra el círculo turquesa a lo que dice el texto y elige la afirmación. Mira en qué casilla cae cada par.',
    voz: '«Al menos una» deja abierto si son todas.',
    controles: [
      { id: 't', etiqueta: 'Texto', opciones: CUANT.map(q => ({ valor: q.valor, texto: q.texto })) },
      { id: 'a', etiqueta: 'Afirmación', opciones: CUANT.map(q => ({ valor: q.valor, texto: q.texto })) },
    ],
    dibujo: val => {
      const c = CASILLA[casillaCuant(val.t, val.a)];
      return { datos: figCuantAf(val.a), estado: { marcas: { [val.t]: 'i', a1: c[1] === 'h' ? 'h' : c[1] === 'd' ? 'd' : 'o' }, sellos: { a: { t: c[0], c: c[1] } } } };
    },
    lectura: val => {
      const c = casillaCuant(val.t, val.a), fn = c === 'contradice' ? contra : c === 'nose' ? nose : resp;
      const T = CUANT.find(q => q.valor === val.t), A = CUANT.find(q => q.valor === val.a);
      return [resp(T.texto), ' → ', afir(A.texto), ': ', fn(CASILLA[c][0])];
    },
    arrastres: [{
      id: 'texto', etiqueta: 'lo que dice el texto', color: 'c-i',
      donde: val => RV().ancla(figCuantAf(val.a), val.t),
      mover: (pt, val) => ({ t: RV().cercana(figCuantAf(val.a), pt, CUANT.map(q => q.valor)) }),
    }],
    // Retos: logrado usa casillaCuant, la misma función que pone el sello de la mesa.
    invitaciones: [
      { texto: 'Busca un par en el que el texto contradiga la afirmación.',
        logrado: val => casillaCuant(val.t, val.a) === 'contradice',
        bien: 'Ahí no hay mundo en que los dos sean verdad. ¿Pasa con otro par?' },
      { texto: 'Encuentra un par distinto en el que la afirmación se deduzca del texto.',
        logrado: val => casillaCuant(val.t, val.a) === 'deduce',
        bien: 'Si el texto es verdad, la afirmación también: no queda salida.' },
      { texto: 'Con el texto «al menos una», busca la afirmación que no se puede saber.',
        logrado: val => val.t === 'alguna' && casillaCuant(val.t, val.a) === 'nose',
        bien: '«Al menos una» deja abierto si son todas o solo algunas.' },
      { texto: 'Guarda dos pares con el mismo texto: uno que se deduce y otro que se contradice.',
        logrado: (val, guardados) => {
          const c = casillaCuant(val.t, val.a), otra = { deduce: 'contradice', contradice: 'deduce' }[c];
          return !!otra && guardados.some(g => g.t === val.t && g.a !== val.a && casillaCuant(g.t, g.a) === otra);
        },
        bien: 'Un mismo texto obliga a una afirmación y descarta otra. Compáralas.' },
    ],
  };

  return {
    unidad: 'razonamiento-verbal.compatibilidad',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rv-texto.js'],
    historia: {
      texto: 'En Sobre la interpretación, Aristóteles examinó afirmaciones y negaciones: qué se dice, de quién y con qué alcance. Distinguió las universales («todos») de las particulares («alguno») y advirtió que dos enunciados que parecen opuestos no siempre se niegan. Hoy se suma otra distinción: que el texto no niegue algo no significa que lo afirme.',
      pregunta: '¿«Alguno no» es lo contrario de «todos»?',
      fuente: { titulo: 'Matriz de teoría de razonamiento verbal (Aristóteles, Sobre la interpretación)', url: 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/diccio_ele/diccionario/inferencia.htm' },
    },
    glosario: [
      { termino: 'afirmación', def: 'Oración que dice que algo es o no es así; puede ser verdadera o falsa.',
        formas: ['afirmación', 'afirmaciones'], ejemplo: '«Todas las casas tienen luz» es verdadera o falsa según el texto.', ver: ['oración', 'negación'] },
      { termino: 'cuantificador', def: 'Palabra que dice cuántos casos de un grupo abarca lo dicho: todos, algunos, ninguno.',
        formas: ['cuantificador', 'cuantificadores'], ejemplo: 'En «ningún pozo tiene agua», el que manda es «ningún».', ver: ['universal', 'afirmación particular'] },
      { termino: 'universal', def: 'Que habla de todos los casos de un grupo, sin excepción: «todas las aves migran».',
        formas: ['universal', 'universales'], ver: ['afirmación particular', 'cuantificador'] },
      { termino: 'afirmación particular', def: 'Que habla de al menos un caso de un grupo, sin decir qué pasa con los demás.',
        formas: ['afirmación particular', 'afirmaciones particulares', 'particulares'], ejemplo: '«Algunos peces son nativos» no dice si lo son todos.', ver: ['universal', 'al menos uno'] },
      { termino: 'al menos uno', def: 'Indica un caso o más: asegura que existe, sin descartar que sean todos.',
        formas: ['al menos uno', 'al menos una', 'al menos un'], ejemplo: 'Si al menos un ave migra, quizá migren todas.', ver: ['cuantificador', 'afirmación particular'] },
      { termino: 'negación', def: 'Forma de decir que algo no es así, con palabras como «no», «ninguno» o «nunca».',
        formas: ['negación', 'negaciones'], ejemplo: 'Negar «todas migran» es decir «alguna no migra», no «ninguna migra».', ver: ['afirmación', 'contradicción'] },
      { termino: 'no se puede saber', def: 'Caso de una afirmación que el texto ni dice, ni deduce, ni contradice.',
        formas: ['no se puede saber', 'no se sabe'], ejemplo: '«La escuela tiene computadoras»: el texto de Ccota no habla de eso.', ver: ['compatible'] },
      { termino: 'sujeto', def: 'De quién o de qué se dice algo en una oración.',
        formas: ['sujeto', 'sujetos'], ejemplo: 'En «la escuela abrió en 2018», es «la escuela».', ver: ['oración'] },
    ],
    laboratorio: [
      mesaCuant,
      Object.assign({
        id: 'casillas', titulo: 'Las cuatro casillas', pieza: 'rv-texto',
        // Retos: logrado usa decide() y AF, lo mismo que dibuja la casilla de la mesa.
        invitaciones: [
          { texto: 'Lleva la afirmación 4 a la frase que la contradice sin decirlo igual.',
            logrado: val => val.k === 'impl' && decide(val.k, val.f),
            bien: 'Choca deduciendo: si en 2015 no había luz, no la hubo desde 2012.' },
          { texto: 'Encuentra la afirmación que ninguna frase del texto decide.',
            logrado: val => AF[val.k].c === 'nose',
            bien: 'El texto calla sobre eso. Callar no es contradecir.' },
          { texto: 'Busca una afirmación que solo se decide uniendo dos frases.',
            logrado: val => Object.keys(AF[val.k].marcas).length === 2 && decide(val.k, val.f),
            bien: 'Ninguna frase sola bastaba; juntas, sostienen la afirmación.' },
          { texto: 'Guarda dos afirmaciones decididas por la misma frase: una compatible y otra incompatible.',
            logrado: (val, guardados) => decide(val.k, val.f) && guardados.some(g => g.f === val.f && g.k !== val.k
              && decide(g.k, g.f) && CASILLA[AF[g.k].c][1] !== CASILLA[AF[val.k].c][1]),
            bien: 'La misma frase confirma una y descarta la otra.' },
        ],
      }, casillas.juega),
      Object.assign({
        id: 'idea-principal', titulo: 'Contra la idea principal', pieza: 'rv-texto',
        // Retos: logrado lee AF2, lo mismo que marca qué oraciones chocan con la afirmación.
        invitaciones: [
          { texto: 'Guarda dos oraciones distintas con las que choque la misma afirmación.',
            logrado: (val, guardados) => AF2[val.k].marcas[val.f] === 'h'
              && guardados.some(g => g.k === val.k && g.f !== val.f && AF2[g.k].marcas[g.f] === 'h'),
            bien: 'Solo la que niega la idea principal choca en más de un lugar.' },
          { texto: 'Busca la afirmación que choca con un detalle, no con la idea principal.',
            logrado: val => Object.keys(AF2[val.k].marcas).length === 1 && AF2[val.k].marcas[val.f] === 'h',
            bien: 'Choca con la oración 1 y deja en pie lo demás del texto.' },
          { texto: 'Encuentra la afirmación que no choca con ninguna oración.',
            logrado: val => Object.keys(AF2[val.k].marcas).length === 0,
            bien: 'Habla de otra cosa: con este texto no se puede saber.' },
          { texto: 'Con la afirmación B, deja el marcador en una oración con la que no choca.',
            logrado: val => val.k === 'frase' && AF2[val.k].marcas[val.f] !== 'h',
            bien: 'Esa oración no la decide. Un detalle se juega en una sola frase.' },
        ],
      }, ideaPrincipal.juega),
    ],
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea). Una lista vacía:
    // la mesa no practica ninguna idea de la unidad y va en «Más mesas del tema».
    laboratorioIdeas: {
      'cuantificadores': ['cuatro-casillas'],
      'casillas': ['cuatro-casillas'],
      'idea-principal': ['idea-principal'],
    },
    ideas: [casillas, ideaPrincipal],
  };
});
