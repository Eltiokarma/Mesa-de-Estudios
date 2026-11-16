/*
 * Teoría de «Inferencias» (razonamiento-verbal.inferencias). Molde: docs/teoria.md. Contenido: matriz de verbal
 * (unidad 12), historia (Grice 1967/1975; Sperber y Wilson), precisión del expediente («parafrasear no es inferir») y
 * códigos RV6, RV7, RV8, RV13, RV14, RV33, RV34 y RV58. Textos propios (regla 5).
 * Ruta A · Argumentar: se marcan las evidencias y se ve qué conclusión sostienen y con qué fuerza.
 *
 * Ficha de tarea:
 *   Promesa: decidir si una conclusión es necesaria, probable o sin respaldo, señalando la evidencia.
 *   Persona y condiciones: postulante de 3.º a 5.º, celular, sin audio; inferencias (UNI 17, UNMSM 10–11).
 *   Resultado observable: señala evidencias y el paso inferencial; rechaza una conclusión compatible pero sin respaldo.
 *   Orden de atención: 1.º las evidencias (i) · 2.º la conclusión (o) · 3.º el sello de su fuerza.
 *   Estados: necesaria · probable · sin respaldo; implícito presente o ausente.
 *   Duda que resuelve: ¿si algo podría ser cierto, ya es una inferencia válida?
 *
 * Colores (regla 4): la evidencia del texto i (turquesa, continuo), la conclusión que se prueba o (naranja,
 * discontinuo), lo implícito o la intención d (verde, punteado), lo que no tiene respaldo h (rojo).
 * Códigos: RV6, RV7 (inferencia no autorizada), RV8 (saber del mundo), RV13, RV14, RV33, RV34 (quedarse en lo
 * literal), RV58; RVI1 (probable tomado por necesario) es hipótesis nueva.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  // Gesto directo (docs/teoria.md §4b): un marcador que se arrastra por el texto y cae en la frase más cercana al dedo
  // (rv-texto.ancla y rv-texto.cercana). Mueve un control de opciones, que también tiene sus botones.
  const RV = () => Kit.piezas['rv-texto'];
  const marcador = (id, datosDe, ids, etiqueta, color = 'c-i', ida = v => v, vuelta = v => v) => ({
    id: 'marcador', etiqueta, color,
    donde: val => RV().ancla(datosDe(val), ida(val[id])),
    mover: (pt, val) => ({ [id]: vuelta(RV().cercana(datosDe(val), pt, ids)) }),
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
  const ev = t => ({ v: 'c-i', t }), concl = t => ({ v: 'c-o', t }), impl = t => ({ v: 'c-d', t }), sin = t => ({ v: 'c-h', t });
  const opciones = (c, malas) => [{ id: 'c', texto: c, correcta: true }, ...malas.map(([texto, error, siFuera], k) => ({ id: `e${k}`, texto, error, siFuera }))];
  const voltear = (arr, s) => (s % 2 ? arr.slice().reverse() : arr.slice());
  const texto = (frs, extra = []) => ({ esquinaLibre: true, secciones: [{ id: 'o', titulo: 'Texto', modo: 'tarjeta', fragmentos: frs.map(([id, t]) => ({ id, t })) }, ...extra] });
  const conclusion = t => ({ id: 'c', titulo: 'Conclusión', modo: 'tarjeta', fragmentos: [{ id: 'c1', t }] });
  // Azar con semilla (el mismo de aritmetica/razones-y-proporciones.js): «Así se resuelve» elige con azar(s + 900).
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    return r;
  }
  // El primer valor de semillas seguidas cae casi siempre en el mismo tramo: se descarta para que salgan todos los ítems.
  const elegir = (banco, s) => { const r = azar(s + 900); r(); return banco[Math.floor(r() * banco.length)]; };

  // ---------- Idea 1: necesaria o probable ----------
  // Cambia: la conclusión que se prueba. Permanece: el texto de la inscripción. Progresa: la fuerza del respaldo
  // (necesaria, probable, sin respaldo). Se reserva: una inducción de la naturaleza (predicción).
  // Debe verse: qué evidencias usa cada conclusión.
  const INS = [['a', 'Todos los inscritos recibieron un código.'], ['b', 'Ana está inscrita.'], ['d', 'Los últimos tres años, el examen fue de mañana.']];
  const CON = {
    nec: { t: 'Ana recibió un código.', marcas: { a: 'i', b: 'i' }, sello: ['Necesaria', 'i'], dice: 'Necesaria: no puede ser falsa' },
    prob: { t: 'Este año, el examen será de mañana.', marcas: { d: 'i' }, sello: ['Probable', 'd'], dice: 'Probable: el patrón podría cambiar' },
    sin: { t: 'Ana aprobará el examen.', marcas: {}, sello: ['Sin respaldo', 'h'], dice: 'Sin respaldo: nada habla de aprobar' },
  };
  // La frase que el alumno revisa: si sostiene la conclusión, se marcan todas las que la sostienen y aparece el sello;
  // si no, queda punteada. Una conclusión sin respaldo muestra su sello con cualquier frase: ninguna la sostiene.
  const usa = (k, f) => Object.prototype.hasOwnProperty.call(CON[k].marcas, f);
  const conSello = k => ({ marcas: Object.assign({ c1: CON[k].sello[1] === 'h' ? 'h' : 'o' }, CON[k].marcas), sellos: { c: { t: CON[k].sello[0], c: CON[k].sello[1] } }, nuevo: ['c'] });
  function sostiene(k, f) {
    if (usa(k, f)) return conSello(k);
    const e = { marcas: { c1: 'o', [f]: 'd' } };
    return k === 'sin' ? Object.assign(conSello(k), { marcas: { c1: 'h', [f]: 'd' } }) : e;
  }
  function leeSostiene(k, f) {
    const n = { a: 1, b: 2, d: 3 }[f], otras = Object.keys(CON[k].marcas).filter(x => x !== f).map(x => ({ a: 1, b: 2, d: 3 }[x]));
    if (k === 'sin') return [sin(`La ${n} no la sostiene`), ' · ninguna la sostiene'];
    if (!usa(k, f)) return [impl(`La ${n} no la sostiene`), ' · busca otra'];
    return [corto(CON[k].sello[1] === 'd' ? impl : ev, CON[k].dice), otras.length ? ` · con la ${otras.join(' y la ')}` : ''];
  }
  // Banco de «Así se resuelve» (propio, distinto del de «Ahora tú»): frases, conclusión, fuerza, frases que la sostienen
  // y el razonamiento de cada paso.
  const RES_FUERZA = [
    { frs: [['a', 'Todas las tiendas del jirón Lima cierran a las nueve.'], ['b', 'La librería Puno es una tienda del jirón Lima.']],
      c: 'La librería Puno cierra a las nueve.', ok: 'Necesaria', marcas: { a: 'i', b: 'i' }, por: 'las dos frases juntas la obligan.',
      datos: 'Dos frases: una regla para todas las tiendas del jirón y el dato de que la librería es una de ellas.',
      aplica: 'Si todas cierran a las nueve y la librería es una de esas tiendas, no hay forma de que cierre a otra hora.',
      sentido: '¿Y si fuera solo probable? No: «todas» no deja excepciones. Ningún patrón puede cambiar aquí; la conclusión no puede fallar.' },
    { frs: [['a', 'Los últimos seis años, el río Coata se desbordó en marzo.']],
      c: 'El próximo marzo, el río Coata se desbordará.', ok: 'Probable', marcas: { a: 'i' }, por: 'seis marzos seguidos la hacen esperable, no segura.',
      datos: 'Una sola frase: lo que pasó con el río en seis marzos seguidos. Nada dice qué pasará después.',
      aplica: 'Seis casos iguales forman un patrón, y el patrón hace esperable el séptimo. Pero un año con menos lluvia lo rompería.',
      sentido: '¿Y si fuera necesaria? No: el texto habla del pasado. Un patrón da buenas razones, pero no garantiza el próximo año.' },
    { frs: [['a', 'Todos los socios de la cooperativa venden quinua.'], ['b', 'Marta vende quinua.']],
      c: 'Marta es socia de la cooperativa.', ok: 'Sin respaldo', marcas: { a: 'd', b: 'd' }, por: 'vender quinua no prueba ser socia.',
      datos: 'Dos frases: los socios venden quinua, y Marta vende quinua. La conclusión va en sentido contrario.',
      aplica: 'La 1 dice que los socios venden quinua, no que solo ellos la venden. Marta puede venderla sin ser socia.',
      sentido: 'Parece necesaria porque usa las dos frases, pero las usa al revés. Muchas personas venden quinua fuera de la cooperativa.' },
    { frs: [['a', 'Jorge entrena fútbol tres veces por semana.']],
      c: 'Jorge jugará en la selección de Puno.', ok: 'Sin respaldo', marcas: { a: 'd' }, por: 'el texto no habla de ninguna selección.',
      datos: 'Una frase: cuántas veces entrena Jorge. No dice qué tan bien juega ni si alguien lo eligió.',
      aplica: 'Entrenar seguido no lleva a la selección: el texto no trae ningún patrón ni regla que conecte las dos cosas.',
      sentido: '¿Y si fuera probable? Para eso haría falta un patrón en el texto, como otros que entrenaron así y entraron. No lo hay.' },
  ];
  const deduccion = {
    id: 'necesaria-probable',
    titulo: 'Necesaria, probable o sin respaldo',
    temas: ['Inferencia deductiva e inductiva'],
    pieza: 'rv-texto',
    // Lee (fase 2): qué es inferir, premisa y conclusión, y qué mirar. No dice qué hace probable a una conclusión
    // (eso lo descubre en Predice, con la laguna).
    lee: {
      tarjetas: [
        { titulo: 'Sacar lo que no se dice', texto: 'Subes a la combi en Juliaca y todos traen el paraguas mojado. Nadie te dice nada, pero piensas: «afuera llueve». Eso es inferir: sacar una idea nueva a partir de lo que sí ves o lees.' },
        { titulo: 'Premisas y conclusión', texto: 'Las frases de las que partes se llaman premisas. Lo que sacas de ellas es la conclusión. En el examen, el texto trae las premisas y te preguntan qué conclusión aguantan y cuánto.' },
        { titulo: 'Qué mirar', texto: 'En el juego hay tres conclusiones y un texto de tres frases. Lleva el círculo turquesa por cada frase y mira cuáles se marcan con cada conclusión y qué sello recibe.' },
      ],
    },
    juega: {
      consigna: 'Prueba tres conclusiones con el texto. Mira qué frases usa cada una y qué tan segura es.',
      voz: 'Señala qué frase permite sostenerla.',
      controles: [
        { id: 'k', etiqueta: 'Conclusión', opciones: [{ valor: 'nec', texto: 'el código' }, { valor: 'prob', texto: 'la hora' }, { valor: 'sin', texto: 'aprobar' }] },
        { id: 'f', etiqueta: 'Frase', opciones: [{ valor: 'a', texto: '1' }, { valor: 'b', texto: '2' }, { valor: 'd', texto: '3' }], inicio: 'd' },
      ],
      dibujo: val => ({ datos: texto(INS, [conclusion(CON[val.k].t)]), estado: sostiene(val.k, val.f) }),
      lectura: val => leeSostiene(val.k, val.f),
      minimo: 3,
      // Arrastra el marcador por el texto: el sello de la conclusión aparece cuando lo sueltas en una frase que la sostiene.
      arrastres: [marcador('f', val => texto(INS, [conclusion(CON[val.k].t)]), ['a', 'b', 'd'], 'marcador de la evidencia')],
    },
    predice: {
      pregunta: 'Según el texto de la laguna, ¿qué conclusión se puede sacar?',
      voz: 'Piensa si podría fallar aunque el texto sea verdad.',
      opciones: opciones('Es probable que se llene en febrero del próximo año', [
        ['Se llenará con seguridad el próximo febrero', 'RVI1', 'Es lo esperable, pero cuatro años no garantizan el quinto.'],
        ['La laguna nunca se seca', 'RV7', 'El texto habla de febrero; no dice nada del resto del año.'],
        ['No se puede concluir nada', 'RV34', 'Sí se puede: un patrón repetido hace probable que siga.'],
      ]),
      dibujo: { datos: texto([['a', 'Una comunidad observó su laguna durante cuatro años.'], ['b', 'Cada año, la laguna se llenó en febrero.']]), estado: {} },
      revelar: { datos: texto([['a', 'Una comunidad observó su laguna durante cuatro años.'], ['b', 'Cada año, la laguna se llenó en febrero.']], [conclusion('Es probable que se llene el próximo febrero.')]), estado: { marcas: { a: 'i', b: 'i', c1: 'o' }, sellos: { c: { t: 'Probable', c: 'd' } } } },
      coincide: 'Coincide: es una inferencia inductiva: el patrón la hace probable, no segura.',
    },
    mira: {
      datos: texto(INS, [conclusion(CON.nec.t)]),
      pasos: [
        { estado: { marcas: { a: 'i' } }, texto: 'Primera evidencia: todos los inscritos recibieron código.', ecuacion: [ev('todos los inscritos'), ' → código'] },
        { estado: { marcas: { a: 'i', b: 'i' }, nuevo: ['b'] }, texto: 'Segunda: Ana está inscrita. Ana es uno de esos «todos».', ecuacion: [ev('Ana'), ' ∈ ', ev('inscritos')] },
        { estado: { marcas: { a: 'i', b: 'i', c1: 'o' }, sellos: { c: { t: 'Necesaria', c: 'i' } }, nuevo: ['c1', 'c'] }, texto: 'Si las dos son verdad, la conclusión no puede ser falsa.', ecuacion: [ev('A'), ' + ', ev('B'), ' ⇒ ', concl('Ana recibió código')] },
      ],
    },
    regla: {
      texto: 'Una inferencia deductiva es necesaria: si las premisas son verdad, la conclusión también. Una inductiva generaliza un patrón: es probable, no segura. Sin evidencia, no hay inferencia.',
      ecuacion: [{ llave: [ev('premisas'), ' ⇒ ', concl('necesaria')], nota: 'deducción', color: 'c-o' }, '   ·   ', { llave: [ev('casos'), ' → ', impl('probable')], nota: 'inducción', color: 'c-d' }],
      condicion: 'se señala qué frase la sostiene; que algo pudiera ser cierto no basta.',
    },
    // Así se resuelve (fase 2): el mismo tipo de «Ahora tú» (qué tan respaldada está una conclusión), con un banco
    // propio para no regalar sus casos. Los pasos se arman con los campos de cada ítem.
    resuelve: {
      pieza: 'rv-texto',
      generar(s) {
        const b = elegir(RES_FUERZA, s), fig = estado => ({ datos: texto(b.frs, [conclusion(b.c)]), estado });
        const color = { Necesaria: ev, Probable: impl, 'Sin respaldo': sin }[b.ok], sello = { Necesaria: 'i', Probable: 'd', 'Sin respaldo': 'h' }[b.ok];
        return {
          enunciado: `¿Qué tan respaldada está por el texto la conclusión «${b.c.replace(/\.$/, '')}»?`,
          dibujo: fig({ marcas: { c1: 'o' } }),
          pasos: [
            { tipo: 'pide', texto: ['Piden la fuerza de la conclusión: ', ev('necesaria'), ', ', impl('probable'), ' o ', sin('sin respaldo'), '.'] },
            { tipo: 'datos', texto: b.datos },
            { tipo: 'regla', texto: 'Me pregunto si podría fallar con el texto verdadero. Si no puede, es necesaria; si un patrón la vuelve esperable, probable; si ninguna frase la sostiene, no tiene respaldo.' },
            { tipo: 'aplica', texto: b.aplica, ecuacion: [ev('texto'), ' → ', color(b.ok.toLowerCase())],
              dibujo: fig({ marcas: Object.assign({ c1: sello === 'h' ? 'h' : 'o' }, b.marcas), sellos: { c: { t: b.ok, c: sello } }, nuevo: ['c'] }) },
            { tipo: 'sentido', texto: b.sentido },
          ],
          respuesta: [color(b.ok), `: ${b.por}`],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const B = [
          { t: 'Todos los buses de la ruta 5 pasan por la plaza. El bus de Rosa es de la ruta 5.', c: 'El bus de Rosa pasa por la plaza.', ok: 'Necesaria', m: [['Probable', 'RVI1', 'No hay patrón que pueda fallar: si las dos frases son verdad, esta también.'], ['Sin respaldo', 'RV34', 'Sí tiene: las dos frases juntas la obligan.'], ['Contradice el texto', 'RV9', 'Nada en el texto la niega.']] },
          { t: 'Durante cinco años, la feria fue el primer domingo de mayo.', c: 'Este año la feria será el primer domingo de mayo.', ok: 'Probable', m: [['Necesaria', 'RVI1', 'El patrón la hace esperable, pero podría cambiar.'], ['Sin respaldo', 'RV34', 'Tiene respaldo: cinco años seguidos.'], ['Contradice el texto', 'RV9', 'Nada la niega.']] },
          { t: 'Ningún alumno del taller faltó en junio. Luis es alumno del taller.', c: 'Luis no faltó en junio.', ok: 'Necesaria', m: [['Probable', 'RVI1', '«Ningún» no deja excepciones: no puede fallar.'], ['Sin respaldo', 'RV34', 'Las dos frases la obligan.'], ['Contradice el texto', 'RV9', 'No la contradice: la confirma.']] },
          { t: 'Carla estudia mucho y saca buenas notas en matemática.', c: 'Carla será ingeniera.', ok: 'Sin respaldo', m: [['Probable', 'RV7', 'El texto no habla de su futuro ni de lo que quiere estudiar.'], ['Necesaria', 'RV7', 'Nada la obliga.'], ['Contradice el texto', 'RV9', 'No la niega: solo no la sostiene.']] },
          { t: 'En las últimas diez heladas, las papas tapadas con paja no se dañaron.', c: 'En la próxima helada, tapar con paja protegerá las papas.', ok: 'Probable', m: [['Necesaria', 'RVI1', 'Diez casos la hacen esperable, no segura.'], ['Sin respaldo', 'RV34', 'Tiene respaldo: diez casos.'], ['Contradice el texto', 'RV9', 'Nada la niega.']] },
          { t: 'Todos los que viven en la isla saben nadar. Pedro sabe nadar.', c: 'Pedro vive en la isla.', ok: 'Sin respaldo', m: [['Necesaria', 'RV7', 'Saber nadar no prueba vivir en la isla: otros también saben.'], ['Probable', 'RV7', 'El texto no da ningún dato que lo haga probable.'], ['Contradice el texto', 'RV9', 'No la niega.']] },
        ];
        const b = B[s % B.length];
        return {
          pregunta: '¿Qué tan respaldada está la conclusión por el texto?',
          dibujo: { datos: texto([['a', b.t]], [conclusion(b.c)]), estado: { marcas: { c1: 'o' } } },
          opciones: opciones(b.ok, voltear(b.m, s)),
          solucion: { texto: 'Se pregunta si podría ser falsa aunque el texto sea verdad.', ecuacion: [ev('texto'), ' → ', concl(b.ok.toLowerCase())] },
        };
      },
    },
  };

  // ---------- Idea 2: lo que se dice sin decir ----------
  // Cambia: una palabra de la oración (sin nada, «volvió a», «ya no»). Permanece: el hecho de llegar tarde.
  // Progresa: lo que la palabra da por supuesto. Se reserva: «ya no vende» en otra oración (predicción).
  // Debe verse: la palabra que carga lo implícito.
  const VARI = {
    nada: { frs: [['a', 'Hoy, Juan'], ['w', 'llegó tarde.']], marcas: { w: 'o' }, dice: 'Solo dice lo de hoy', implicito: 'nada más' },
    volvio: { frs: [['a', 'Hoy, Juan'], ['w', 'volvió a'], ['b', 'llegar tarde.']], marcas: { w: 'd' }, dice: 'Implícito: ya llegó tarde antes', implicito: 'ya llegó tarde antes' },
    siempre: { frs: [['a', 'Hoy, Juan llegó tarde,'], ['w', 'como siempre.']], marcas: { w: 'd' }, dice: 'Implícito: suele llegar tarde', implicito: 'suele llegar tarde' },
  };
  // El juego y «Mira» usan la misma figura: la oración y, debajo, el banco de palabras (hallazgo 9).
  const BANCO = [['nada', 'sin palabra'], ['volvio', 'volvió a'], ['siempre', 'como siempre']];
  const figVari = k => texto(VARI[k].frs, [{ id: 'banco', titulo: 'Prueba con', modo: 'parrafo', fragmentos: BANCO.map(([v, t]) => ({ id: `p-${v}`, t })) }]);
  // Banco de «Así se resuelve» (propio, distinto del de «Ahora tú»): oración, palabra que carga lo supuesto y pasos.
  const RES_IMPL = [
    { o: 'Mi prima sigue trabajando en el mercado Túpac Amaru.', w: 'sigue', ok: 'Que ya trabajaba allí desde antes',
      datos: 'Lo explícito: hoy mi prima trabaja en el mercado. La palabra que carga algo más es «sigue».',
      aplica: '«Sigue» solo tiene sentido si ya trabajaba allí antes. Eso es lo que la oración da por cierto.',
      sentido: '¿Y «que le gusta su trabajo»? Podría ser, pero ninguna palabra lo supone: la oración tiene sentido sin eso.' },
    { o: 'Otra vez se fue la luz en el barrio.', w: 'Otra vez', ok: 'Que la luz ya se había ido antes',
      datos: 'Lo explícito: hoy se fue la luz en el barrio. La palabra que carga algo más es «otra vez».',
      aplica: '«Otra vez» necesita al menos una vez anterior. La oración da por cierto que la luz ya se había ido antes.',
      sentido: '¿Y «que se va todos los días»? Es agregar de más: «otra vez» pide una vez antes, no una costumbre diaria.' },
    { o: 'Mi hermano ya sabe manejar.', w: 'ya', ok: 'Que antes no sabía manejar',
      datos: 'Lo explícito: hoy mi hermano sabe manejar. La palabra que carga algo más es «ya».',
      aplica: '«Ya» marca un cambio: ahora sabe, y antes no. La oración da por cierto que hubo un tiempo en que no sabía.',
      sentido: '¿Y «que tiene carro propio»? Saber manejar no supone tener carro. Ninguna palabra de la oración lo carga.' },
    { o: 'Rosa tampoco fue a la reunión de padres.', w: 'tampoco', ok: 'Que alguien más no fue a la reunión',
      datos: 'Lo explícito: Rosa no fue a la reunión de padres. La palabra que carga algo más es «tampoco».',
      aplica: '«Tampoco» suma a Rosa a otros que ya faltaron. La oración da por cierto que alguien más no fue.',
      sentido: '¿Y «que la reunión se canceló»? Si se hubiera cancelado, nadie habría ido; la oración no lo supone. Solo cuenta quién faltó.' },
  ];
  const implicito = {
    id: 'implicito',
    titulo: 'Lo que se dice sin decir',
    temas: ['Información implícita'],
    pieza: 'rv-texto',
    // Lee (fase 2): explícito e implícito, dónde se esconde lo implícito y qué mirar. No dice qué supone «ya no»
    // (eso lo descubre en Predice, con doña Elena).
    lee: {
      tarjetas: [
        { titulo: 'Dicho y no dicho', texto: 'Cuando alguien habla, no lo escribe todo. Una parte de lo que comunica va en sus palabras: es lo explícito. Otra parte se da por cierta sin decirla: es lo implícito.' },
        { titulo: 'Palabras chiquitas', texto: 'En el examen, lo implícito suele estar en palabras cortas que se leen de corrido, sin pensar. Por eso conviene leer despacio cada palabra de la oración, no solo los nombres y los verbos.' },
        { titulo: 'Qué mirar', texto: 'En el juego, una oración sobre Juan cambia según la palabra que entra. Lleva el círculo naranja a cada palabra de «Prueba con» y mira si cambia el sello, aunque el hecho de hoy sea el mismo.' },
      ],
    },
    juega: {
      consigna: 'Cambia una palabra de la oración. Mira qué da por supuesto el texto aunque no lo diga.',
      voz: 'Una sola palabra puede cargar información.',
      controles: [{ id: 'k', etiqueta: 'Oración', opciones: [{ valor: 'nada', texto: 'llegó tarde' }, { valor: 'volvio', texto: 'volvió a llegar' }, { valor: 'siempre', texto: 'como siempre' }] }],
      dibujo: val => ({ datos: figVari(val.k), estado: { marcas: Object.assign({ [`p-${val.k}`]: 'o' }, VARI[val.k].marcas), sellos: { o: { t: val.k === 'nada' ? 'Nada implícito' : 'Hay algo implícito', c: val.k === 'nada' ? 'o' : 'd' } } } }),
      lectura: val => [corto(impl, VARI[val.k].dice)],
      minimo: 3,
      // Arrastra el marcador por el banco: la palabra que sueltas entra en la oración.
      arrastres: [marcador('k', val => figVari(val.k), BANCO.map(([v]) => `p-${v}`), 'palabra que entra en la oración', 'c-o', v => `p-${v}`, id => id.slice(2))],
    },
    predice: {
      pregunta: '¿Qué da por supuesto la oración de doña Elena?',
      opciones: opciones('Que antes vendía papas en la feria', [
        ['Que ahora vende otra cosa', 'RV7', 'Podría ser, pero la oración no lo dice ni lo supone.'],
        ['Que la feria cerró', 'RV7', 'La feria puede seguir abierta; solo cambió lo que hace ella.'],
        ['Nada: solo dice que no vende', 'RV34', '«Ya no» supone que antes sí lo hacía.'],
      ]),
      dibujo: { datos: texto([['a', 'Doña Elena'], ['w', 'ya no'], ['b', 'vende papas en la feria.']]), estado: {} },
      revelar: { datos: texto([['a', 'Doña Elena'], ['w', 'ya no'], ['b', 'vende papas en la feria.']]), estado: { marcas: { w: 'd' }, sellos: { o: { t: 'Antes vendía', c: 'd' } } } },
      coincide: 'Coincide: «ya no» supone un antes distinto; eso es información implícita.',
    },
    mira: {
      datos: figVari('volvio'),
      pasos: [
        { estado: { marcas: { b: 'i' } }, texto: 'Lo explícito: hoy Juan llegó tarde.', ecuacion: [ev('explícito'), ': hoy, tarde'] },
        { estado: { marcas: { b: 'i', w: 'd' }, nuevo: ['w'] }, texto: '«Volvió a» supone que ya había pasado antes.', ecuacion: [impl('volvió a'), ' → antes también'] },
        { estado: { marcas: { b: 'i', w: 'd' }, sellos: { o: { t: 'No dice cuántas veces', c: 'h' } } }, texto: 'Pero no dice cuántas veces ni por qué: eso no está.', ecuacion: [sin('cuántas veces'), ' = no se sabe'] },
      ],
    },
    regla: {
      texto: 'La información implícita no está escrita, pero el texto la da por supuesta: palabras como «volvió a», «ya no» o «también» la cargan. Se infiere sin agregar más.',
      ecuacion: [ev('lo escrito'), ' + ', { llave: [impl('lo supuesto')], nota: 'no está escrito', color: 'c-d' }, ' = lo que comunica'],
      condicion: 'lo implícito sale de una palabra o frase concreta del texto; si no hay de dónde sacarlo, no está.',
    },
    // Así se resuelve (fase 2): el mismo tipo de «Ahora tú» (qué da por supuesto una oración), con un banco propio.
    resuelve: {
      pieza: 'rv-texto',
      generar(s) {
        const b = elegir(RES_IMPL, s), [antes, despues] = b.o.split(b.w);
        const fig = estado => ({ datos: texto([...(antes.trim() ? [['a', antes.trim()]] : []), ['w', b.w], ['b', despues.trim()]]), estado });
        return {
          enunciado: `¿Qué da por supuesto la oración «${b.o.replace(/\.$/, '')}», aunque no lo diga?`,
          dibujo: fig({}),
          pasos: [
            { tipo: 'pide', texto: ['Piden lo ', impl('implícito'), ': lo que la oración da por cierto sin escribirlo.'] },
            { tipo: 'datos', texto: b.datos, dibujo: fig({ marcas: { b: 'i' } }) },
            { tipo: 'regla', texto: 'Busco la palabra que carga algo más que el hecho. Lo supuesto sale de esa palabra; no le agrego nada que la oración no necesite.' },
            { tipo: 'aplica', texto: b.aplica, ecuacion: [impl(b.w), ' → ', ev('lo supuesto')],
              dibujo: fig({ marcas: { b: 'i', w: 'd' }, sellos: { o: { t: 'Hay algo implícito', c: 'd' } }, nuevo: ['w', 'o'] }) },
            { tipo: 'sentido', texto: b.sentido },
          ],
          respuesta: [impl(b.ok)],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const B = [
          { o: 'Mi hermano también aprobó el examen de admisión.', w: 'también', ok: 'Que alguien más lo aprobó', m: [['Que aprobó con la nota más alta', 'RV7', 'Nada habla de su nota.'], ['Que el examen fue fácil', 'RV7', 'No se dice ni se supone.'], ['Nada: solo dice que aprobó', 'RV34', '«También» supone que otro aprobó antes.']] },
          { o: 'Por fin terminaron la carretera a Ayaviri.', w: 'Por fin', ok: 'Que la obra se demoró o se esperaba hace tiempo', m: [['Que la carretera es buena', 'RV7', 'No se dice ni se supone su calidad.'], ['Que costó mucho dinero', 'RV7', 'Nada habla del costo.'], ['Nada: solo que terminaron', 'RV34', '«Por fin» supone una espera larga.']] },
          { o: 'Esta vez, Lucía llegó temprano.', w: 'Esta vez', ok: 'Que otras veces no llegó temprano', m: [['Que Lucía es puntual', 'RV7', 'Supone lo contrario: otras veces no lo fue.'], ['Que nadie más llegó', 'RV7', 'No se habla de los demás.'], ['Nada: solo que llegó temprano', 'RV34', '«Esta vez» supone otras veces distintas.']] },
          { o: 'Todavía vivimos en la casa de mis abuelos.', w: 'Todavía', ok: 'Que ya vivían allí desde antes', m: [['Que se van a mudar pronto', 'RV7', 'Podría ser, pero no se dice ni se supone.'], ['Que la casa es antigua', 'RV7', 'Nada habla de su edad.'], ['Nada: solo dónde viven', 'RV34', '«Todavía» supone que viven allí desde antes.']] },
          { o: 'Dejé de tomar gaseosa en el almuerzo.', w: 'Dejé de', ok: 'Que antes tomaba gaseosa en el almuerzo', m: [['Que ahora toma agua', 'RV7', 'Podría ser, pero no se supone.'], ['Que la gaseosa le hacía daño', 'RV7', 'No se dice la razón.'], ['Nada: solo que no toma', 'RV34', '«Dejé de» supone que antes sí tomaba.']] },
        ];
        const b = B[s % B.length];
        const [antes, despues] = b.o.split(b.w);
        return {
          pregunta: '¿Qué da por supuesto la oración, aunque no lo diga?',
          dibujo: { datos: texto([...(antes.trim() ? [['a', antes.trim()]] : []), ['w', b.w], ['b', despues.trim()]]), estado: { marcas: { w: 'd' } } },
          opciones: opciones(b.ok, voltear(b.m, s)),
          solucion: { texto: `«${b.w}» carga lo supuesto; lo demás no está.`, ecuacion: [impl(b.w), ' → ', ev('lo supuesto')] },
        };
      },
    },
  };

  // ---------- Idea 3: la intención y el sentido global ----------
  // Cambia: la parte del texto que se marca. Permanece: el aviso de los vecinos. Progresa: cada parte suma al
  // propósito; el sentido global sale de todas. Se reserva: la intención de otro texto (predicción).
  // Debe verse: que la intención (convocar) solo se ve uniendo las partes.
  const AVI = [['p1', 'Vecinos: el parque se llenó de basura después de la fiesta.'], ['p2', 'Los niños ya no pueden jugar allí.'], ['p3', 'Los esperamos el sábado a las 8 con escobas y bolsas.']];
  const PARTE = { p1: 'Presenta el problema', p2: 'Muestra por qué importa', p3: 'Pide una acción: ahí está la intención' };
  // Banco de «Así se resuelve» (propio, distinto del de «Ahora tú»): tres partes, la intención y los pasos.
  const RES_INTENCION = [
    { tema: 'las vacunas', partes: ['Este mes, la posta vacuna gratis contra el sarampión.', 'Muchos niños del barrio aún no tienen su dosis.', 'Lleve a sus hijos antes del 30.'],
      ok: 'Que los padres lleven a vacunar a sus hijos', corto: 'vacunar', sello: 'Pide vacunar',
      datos: 'Tres partes: la 1 da una oferta, la 2 un problema y la 3 se dirige a los padres con un pedido.',
      aplica: 'La oferta y el problema preparan el cierre: «lleve a sus hijos». Unidas, las tres piden vacunarlos.',
      sentido: '¿Y «informar que la vacuna es gratis»? Eso hace la parte 1 sola. El texto completo no se queda en informar: pide llevarlos.' },
    { tema: 'el equipo de vóley', partes: ['El equipo de vóley del colegio ganó el torneo regional.', 'Entrenó cada tarde durante seis meses.', 'Este viernes lo recibimos en el patio: ¡no faltes!'],
      ok: 'Invitar a recibir al equipo el viernes', corto: 'invitar', sello: 'Convoca',
      datos: 'Tres partes: la 1 cuenta un triunfo, la 2 el esfuerzo detrás y la 3 habla directo al lector: «¡no faltes!».',
      aplica: 'El triunfo y el esfuerzo dan motivos para ir. El cierre los convierte en una invitación al patio el viernes.',
      sentido: '¿Y «contar cómo ganó el torneo»? Las partes 1 y 2 cuentan, pero el texto termina llamando a ir. Ese llamado le da el sentido.' },
    { tema: 'las botellas', partes: ['Una botella de plástico tarda siglos en desaparecer.', 'En el lago, muchas quedan atrapadas entre la totora.', 'Lleva tu tomatodo y deja la botella descartable.'],
      ok: 'Convencer de dejar las botellas descartables', corto: 'convencer', sello: 'Busca convencer',
      datos: 'Tres partes: la 1 da un dato, la 2 un daño cercano y la 3 le dice al lector qué hacer.',
      aplica: 'El dato y el daño son razones; el cierre pide un cambio de costumbre. Unidas, buscan convencer de dejar la botella.',
      sentido: '¿Y «informar cuánto dura el plástico»? Solo es la parte 1. Leído entero, el texto usa ese dato para convencer.' },
    { tema: 'la helada', partes: ['En junio llegan las heladas al altiplano.', 'Este año se esperan noches de diez grados bajo cero.', 'Abrigue a niños y ancianos, y cubra a sus animales.'],
      ok: 'Pedir que se protejan de la helada', corto: 'protegerse', sello: 'Pide protegerse',
      datos: 'Tres partes: la 1 dice qué llega, la 2 qué tan fuerte será y la 3 da órdenes: «abrigue», «cubra».',
      aplica: 'Las dos primeras avisan del peligro; la tercera dice qué hacer. Unidas, piden protegerse de la helada.',
      sentido: '¿Y «informar la temperatura de junio»? Es solo la parte 2. Los verbos del cierre muestran que el texto pide actuar.' },
  ];
  const intencion = {
    id: 'intencion-global',
    titulo: 'La intención sale del todo',
    temas: ['Inferencia de la intención', 'Inferencia holística'],
    pieza: 'rv-texto',
    // Lee (fase 2): para qué se escribe un texto, el sentido global y qué mirar. No dice dónde se lee la intención
    // (eso lo descubre en Predice, con el texto de la vecina).
    lee: {
      tarjetas: [
        { titulo: 'Para qué se escribe', texto: 'Todo texto se escribe para algo. El afiche de la feria de la Candelaria quiere que vayas; una receta, que cocines; una noticia, que te enteres. Ese para qué es la intención del texto.' },
        { titulo: 'El sentido global', texto: 'El sentido global es lo que comunica el texto entero, leído de principio a fin. Es como decir en una línea qué quiso lograr quien lo escribió con la gente que lo lee.' },
        { titulo: 'Qué mirar', texto: 'En el juego hay un aviso de vecinos con tres partes. Lleva el círculo turquesa a cada una y lee qué aporta. Recién después decide qué busca el aviso completo.' },
      ],
    },
    juega: {
      consigna: 'Marca cada parte del aviso. Mira qué aporta cada una y qué busca el texto completo.',
      voz: 'Ninguna parte sola dice todo lo que busca.',
      controles: [{ id: 'k', etiqueta: 'Marca', opciones: [{ valor: 'p1', texto: '1' }, { valor: 'p2', texto: '2' }, { valor: 'p3', texto: '3' }] }],
      dibujo: val => ({ datos: texto(AVI), estado: { marcas: { [val.k]: val.k === 'p3' ? 'd' : 'i' } } }),
      lectura: val => [corto(val.k === 'p3' ? impl : ev, PARTE[val.k])],
      minimo: 3,
      arrastres: [marcador('k', () => texto(AVI), ['p1', 'p2', 'p3'], 'marcador de la parte del aviso')],
    },
    predice: {
      pregunta: 'Este texto de una vecina, leído completo, ¿qué busca?',
      opciones: opciones('Que el municipio ponga luz en la calle', [
        ['Contar lo que le pasó una noche', 'RV13', 'Cuenta un hecho, pero lo usa para pedir algo.'],
        ['Informar cómo es la calle', 'RV14', 'Describe la calle, pero no se queda ahí: pide.'],
        ['Acusar a los vecinos de robos', 'RV33', 'El texto no acusa a nadie; pide luz.'],
      ]),
      dibujo: { datos: texto([['a', 'Anoche volví caminando por la calle Arequipa.'], ['b', 'No hay ni un poste encendido en tres cuadras.'], ['c', 'Señor alcalde: ¿cuántas caídas más esperaremos?']]), estado: {} },
      revelar: { datos: texto([['a', 'Anoche volví caminando por la calle Arequipa.'], ['b', 'No hay ni un poste encendido en tres cuadras.'], ['c', 'Señor alcalde: ¿cuántas caídas más esperaremos?']]), estado: { marcas: { a: 'i', b: 'i', c: 'd' }, sellos: { o: { t: 'Pide luz', c: 'd' } } } },
      coincide: 'Coincide: el relato y el dato sostienen la pregunta al alcalde, que es el pedido.',
    },
    mira: {
      datos: texto(AVI),
      pasos: [
        { estado: { marcas: { p1: 'i' } }, texto: 'La primera parte presenta un problema: la basura.', ecuacion: [ev('problema')] },
        { estado: { marcas: { p1: 'i', p2: 'i' }, nuevo: ['p2'] }, texto: 'La segunda dice a quién afecta: a los niños.', ecuacion: [ev('problema'), ' + ', ev('a quién afecta')] },
        { estado: { marcas: { p1: 'i', p2: 'i', p3: 'd' }, sellos: { o: { t: 'Convoca a limpiar', c: 'd' } }, nuevo: ['p3', 'o'] }, texto: 'La tercera pide ir: unidas, las tres convocan a limpiar.', ecuacion: [ev('1'), ' + ', ev('2'), ' + ', impl('3'), ' → ', concl('convocar')] },
      ],
    },
    regla: {
      texto: 'La intención de un texto es lo que busca lograr en quien lo lee (informar, convencer, pedir, convocar). Se infiere integrando todas sus partes, no de una frase suelta.',
      ecuacion: [ev('partes'), ' integradas → ', { llave: [impl('intención')], nota: 'lo que busca', color: 'c-d' }],
      condicion: 'se apoya en señales del texto (a quién habla, qué pide, cómo cierra); sin ellas, es una suposición.',
    },
    // Así se resuelve (fase 2): el mismo tipo de «Ahora tú» (qué busca un texto leído completo), con un banco propio.
    // El texto va partido en sus tres partes para marcar qué aporta cada una.
    resuelve: {
      pieza: 'rv-texto',
      generar(s) {
        const b = elegir(RES_INTENCION, s), fig = estado => ({ datos: texto(b.partes.map((t, k) => [`p${k + 1}`, t])), estado });
        return {
          enunciado: `Leído completo, ¿qué busca el texto sobre ${b.tema}?`,
          dibujo: fig({}),
          pasos: [
            { tipo: 'pide', texto: ['Piden la ', impl('intención'), `: lo que el texto sobre ${b.tema} busca lograr en quien lo lee.`] },
            { tipo: 'datos', texto: b.datos, dibujo: fig({ marcas: { p1: 'i', p2: 'i' } }) },
            { tipo: 'regla', texto: 'Una frase sola no basta. Junto todas las partes y miro a quién le habla el texto, qué pide o propone y cómo cierra.' },
            { tipo: 'aplica', texto: b.aplica, ecuacion: [ev('1'), ' + ', ev('2'), ' + ', impl('3'), ' → ', concl(b.corto)],
              dibujo: fig({ marcas: { p1: 'i', p2: 'i', p3: 'd' }, sellos: { o: { t: b.sello, c: 'd' } }, nuevo: ['p3', 'o'] }) },
            { tipo: 'sentido', texto: b.sentido },
          ],
          respuesta: [impl(b.ok)],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const B = [
          { t: 'El cuy tiene más proteína que el pollo. Se cría con restos de verduras. ¡Prepara cuy esta semana!', ok: 'Animar a comer cuy', m: [['Informar cómo se cría el cuy', 'RV14', 'Informa, pero para animar: cierra con «¡Prepara cuy!».'], ['Contar una receta familiar', 'RV13', 'No hay receta ni historia.'], ['Criticar a quien come pollo', 'RV33', 'Compara, pero no critica a nadie.']] },
          { t: 'El año pasado se perdieron diez libros. Este año hay cámaras en la biblioteca.', ok: 'Advertir que ahora se vigila', m: [['Pedir que donen libros', 'RV7', 'No pide libros.'], ['Contar una historia de robos', 'RV13', 'Menciona la pérdida para advertir.'], ['Informar cuántos libros hay', 'RV14', 'No da el total de libros.']] },
          { t: 'Querida abuela: tu ají de gallina es el mejor. ¿Me enseñas a prepararlo el domingo?', ok: 'Pedirle a la abuela que le enseñe', m: [['Describir el ají de gallina', 'RV14', 'Lo elogia para pedir algo.'], ['Contar un almuerzo', 'RV13', 'No narra un almuerzo.'], ['Criticar otras recetas', 'RV33', 'No critica ninguna.']] },
          { t: 'Desde que hay ciclovía, voy al colegio en diez minutos. Antes tardaba media hora en combi.', ok: 'Mostrar una ventaja de la ciclovía', m: [['Quejarse de las combis', 'RV33', 'Las menciona para comparar, no para quejarse.'], ['Pedir una ciclovía', 'RV7', 'Ya existe: no la pide.'], ['Informar el horario del colegio', 'RV14', 'No da horarios.']] },
          { t: 'Tres alumnos se desmayaron en la formación de ayer. Todos venían sin desayunar.', ok: 'Llamar la atención sobre desayunar', m: [['Contar una anécdota', 'RV13', 'El dato final da sentido: une desmayo y desayuno.'], ['Culpar a los profesores', 'RV33', 'No culpa a nadie.'], ['Describir la formación', 'RV14', 'No describe la formación.']] },
        ];
        const b = B[s % B.length];
        return {
          pregunta: 'Leído completo, ¿qué busca este texto?',
          dibujo: { datos: texto([['a', b.t]]), estado: {} },
          opciones: opciones(b.ok, voltear(b.m, s)),
          solucion: { texto: 'Se unen las partes y se mira cómo cierra: qué pide o propone.', ecuacion: [ev('todo el texto'), ' → ', impl('intención')] },
        };
      },
    },
  };

  // ---------- Laboratorio: tapa una premisa ----------
  // Más que el juego de la idea 1: el círculo rojo tapa una frase del texto con una banda gris y se recalcula la fuerza de cada conclusión. El
  // caso que la idea no deja ver: a una deducción le basta perder una premisa para quedarse sin respaldo. La fuerza
  // sale de qué frases necesita cada conclusión (CON[k].marcas): si falta alguna, queda sin respaldo.
  const figTapa = k => texto(INS, [conclusion(CON[k].t), { id: 'bandeja', titulo: 'Tapar', modo: 'parrafo', fragmentos: [{ id: 'cinta', t: 'nada' }] }]);
  const fuerza = (k, t) => (Object.keys(CON[k].marcas).length && !Object.keys(CON[k].marcas).includes(t) ? CON[k].sello : ['Sin respaldo', 'h']);
  const mesaTapa = {
    id: 'tapa-premisa', titulo: 'Tapa una premisa', pieza: 'rv-texto',
    consigna: 'Elige una conclusión y arrastra el círculo rojo a una frase del texto: una banda gris la tapa. Mira qué conclusión resiste sin ella.',
    voz: 'Una deducción necesita todas sus premisas.',
    controles: [
      { id: 'k', etiqueta: 'Conclusión', opciones: [{ valor: 'nec', texto: 'el código' }, { valor: 'prob', texto: 'la hora' }, { valor: 'sin', texto: 'aprobar' }] },
      { id: 't', etiqueta: 'Tapar', opciones: [{ valor: 'no', texto: 'nada' }, { valor: 'a', texto: '1' }, { valor: 'b', texto: '2' }, { valor: 'd', texto: '3' }] },
    ],
    dibujo: val => {
      const s = fuerza(val.k, val.t), marcas = { c1: s[1] === 'h' ? 'h' : 'o' };
      for (const f of Object.keys(CON[val.k].marcas)) if (f !== val.t) marcas[f] = s[1] === 'h' ? 'd' : 'i';
      return { datos: figTapa(val.k), estado: { tapar: val.t === 'no' ? [] : [val.t, 'cinta'], marcas, sellos: { c: { t: s[0], c: s[1] } } } };
    },
    lectura: val => {
      const s = fuerza(val.k, val.t), quita = val.t === 'no' ? 'Sin tapar' : `Sin la ${{ a: 1, b: 2, d: 3 }[val.t]}`;
      return [quita, ': ', (s[1] === 'h' ? sin : s[1] === 'd' ? impl : ev)(s[0].toLowerCase())];
    },
    arrastres: [marcador('t', val => figTapa(val.k), ['a', 'b', 'd', 'cinta'], 'círculo que tapa una frase', 'c-h', v => (v === 'no' ? 'cinta' : v), id => (id === 'cinta' ? 'no' : id))],
    // Retos: cada logrado usa fuerza, la misma cuenta que pone el sello de la conclusión.
    invitaciones: [
      { texto: 'Tapa una sola frase y deja sin respaldo la conclusión del código.',
        logrado: val => val.k === 'nec' && val.t !== 'no' && fuerza(val.k, val.t)[1] === 'h',
        bien: 'A una deducción le basta perder una premisa para quedarse sin apoyo.' },
      { texto: 'Tapa una frase sin que la conclusión del código pierda fuerza.',
        logrado: val => val.k === 'nec' && val.t !== 'no' && fuerza(val.k, val.t)[0] === fuerza(val.k, 'no')[0],
        bien: 'Esa frase no era premisa de esta conclusión: taparla no cambia nada.' },
      { texto: 'Busca la conclusión que queda sin respaldo aunque no tapes nada.',
        logrado: val => val.t === 'no' && fuerza(val.k, val.t)[1] === 'h',
        bien: 'Nada habla de aprobar. Que pueda pasar no basta para inferirlo.' },
      { texto: 'Guarda la conclusión de la hora con su frase tapada y sin tapar.',
        logrado: (val, guardados) => guardados.some(g => g.k === 'prob' && fuerza(g.k, g.t)[1] === 'h') && guardados.some(g => g.k === 'prob' && fuerza(g.k, g.t)[1] !== 'h'),
        bien: 'Sin el patrón de los tres años, la hora del examen ya no tiene apoyo.' },
    ],
  };

  return {
    unidad: 'razonamiento-verbal.inferencias',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rv-texto.js'],
    historia: {
      texto: 'La lógica estudió qué conclusiones se siguen de unas premisas. En una conferencia de 1967, publicada en 1975, Grice mostró que en una conversación también comunicamos lo que no decimos. Después, Sperber y Wilson estudiaron el papel del contexto. Una deducción y una intención supuesta no tienen la misma garantía.',
      pregunta: '¿Qué te permite decir el texto, aunque no lo escriba?',
      fuente: { titulo: 'Matriz de teoría de razonamiento verbal (Grice; Sperber y Wilson)', url: 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/diccio_ele/diccionario/inferencia.htm' },
    },
    glosario: [
      { termino: 'inferencia', def: 'Conclusión que se saca de lo que dice un texto, aunque no esté escrita en él.',
        ejemplo: '«Ana está inscrita» y «todos los inscritos recibieron código» llevan a «Ana recibió código».',
        formas: ['inferencia', 'inferencias', 'inferir', 'infiere'], ver: ['premisa', 'conclusión'] },
      { termino: 'inferencia deductiva', def: 'Razonamiento en que, si las premisas son verdad, la conclusión también tiene que serlo.',
        formas: ['inferencia deductiva', 'deductiva', 'deducción'], ver: ['inferencia inductiva'] },
      { termino: 'inferencia inductiva', def: 'Razonamiento que generaliza un patrón repetido; su conclusión es probable, no segura.',
        ejemplo: 'La laguna se llenó en febrero cuatro años: es probable que vuelva a llenarse.',
        formas: ['inferencia inductiva', 'inductiva', 'inducción'], ver: ['inferencia deductiva', 'probable'] },
      { termino: 'premisa', def: 'Afirmación de la que se parte para sacar una conclusión.',
        ejemplo: '«Ana está inscrita» es una premisa.', ver: ['conclusión'] },
      { termino: 'conclusión', def: 'Lo que se afirma a partir de las premisas; vale tanto como el apoyo que recibe.',
        formas: ['conclusión', 'conclusiones'], ver: ['premisa'] },
      { termino: 'probable', def: 'Que tiene buenas razones para ser cierto, pero podría fallar.',
        ejemplo: 'Tres años con examen de mañana lo hacen probable este año, no seguro.' },
      { termino: 'explícito', def: 'Lo que el texto dice con sus propias palabras, escrito tal cual.',
        ejemplo: '«Hoy, Juan llegó tarde» lo dice escrito.', formas: ['explícito', 'explícita', 'explícitos'], ver: ['implícito'] },
      { termino: 'implícito', def: 'Lo que el texto no escribe pero da por cierto; lo cargan palabras como «ya no» o «también».',
        formas: ['implícito', 'implícita', 'implícitos'], ver: ['explícito', 'supuesto'] },
      { termino: 'sentido global', def: 'Lo que comunica un texto leído entero, de principio a fin, y no una frase suelta.',
        ejemplo: 'Un aviso que cuenta un problema y cierra pidiendo ayuda, en conjunto, convoca.', ver: ['implícito'] },
      { termino: 'supuesto', def: 'Lo que hay que dar por cierto para que una frase tenga sentido, aunque no se diga.',
        ejemplo: '«Volvió a llegar tarde» supone que antes ya llegó tarde.', formas: ['supuesto', 'supuestos', 'supuesta'], ver: ['implícito'] },
    ],
    laboratorio: [
      mesaTapa,
      Object.assign({ id: 'implicito', titulo: 'Lo que se dice sin decir', pieza: 'rv-texto',
        // Retos: se comprueban con VARI, la tabla que dice qué da por supuesto cada oración.
        invitaciones: [
          { texto: 'Elige la palabra que supone que Juan ya llegó tarde antes.',
            logrado: val => VARI[val.k].implicito.includes('antes'),
            bien: '«Volvió a» carga un antes. Pero no dice cuántas veces.' },
          { texto: 'Busca la oración que deja suponer una costumbre de Juan.',
            logrado: val => VARI[val.k].implicito.startsWith('suele'),
            bien: '«Como siempre» supone un hábito, aunque el texto solo cuenta lo de hoy.' },
          { texto: 'Guarda una oración con algo implícito y otra sin nada implícito.',
            logrado: (val, guardados) => guardados.some(g => g.k === 'nada') && guardados.some(g => g.k !== 'nada' && VARI[g.k].implicito !== VARI.nada.implicito),
            bien: 'Lo explícito es igual en las dos; cambia lo que se da por supuesto.' },
        ] }, implicito.juega),
      Object.assign({ id: 'intencion', titulo: 'La intención del aviso', pieza: 'rv-texto',
        // Retos: se comprueban con PARTE, lo que la lectura dice que aporta cada parte del aviso.
        invitaciones: [
          { texto: 'Marca la parte del aviso donde se ve lo que pide.',
            logrado: val => PARTE[val.k].includes('intención'),
            bien: 'Ahí está el pedido, pero se entiende gracias a las otras dos partes.' },
          { texto: 'Marca la parte que dice por qué importa el problema.',
            logrado: val => PARTE[val.k].startsWith('Muestra'),
            bien: 'Los niños sin parque: eso le da peso al pedido del sábado.' },
          { texto: 'Guarda una parte que informa y la parte que pide algo.',
            logrado: (val, guardados) => guardados.some(g => PARTE[g.k].includes('intención')) && guardados.some(g => !PARTE[g.k].includes('intención')),
            bien: 'Una informa y la otra pide. Unidas, dicen qué busca el aviso.' },
        ] }, intencion.juega),
    ],
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea). Una lista vacía:
    // la mesa no practica ninguna idea de la unidad y va en «Más mesas del tema».
    laboratorioIdeas: {
      'tapa-premisa': ['necesaria-probable'],
      'implicito': ['implicito'],
      'intencion': ['intencion-global'],
    },
    ideas: [deduccion, implicito, intencion],
  };
});
