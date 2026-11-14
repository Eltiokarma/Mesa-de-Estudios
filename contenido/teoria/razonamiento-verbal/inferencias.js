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
    if (t.length <= 26) return fn(t);
    const k = [t.indexOf(': '), t.indexOf(', ')].filter(i => i > 0).sort((a, b) => a - b)[0];
    if (k && k <= 24) return [fn(t.slice(0, k)), t.slice(k)];
    const ps = t.split(' '); let n = 1;
    while (n < ps.length && ps.slice(0, n + 1).join(' ').length <= 18) n++;
    return [fn(ps.slice(0, n).join(' ')), ' ' + ps.slice(n).join(' ')];
  };
  const ev = t => ({ v: 'c-i', t }), concl = t => ({ v: 'c-o', t }), impl = t => ({ v: 'c-d', t }), sin = t => ({ v: 'c-h', t });
  const opciones = (c, malas) => [{ id: 'c', texto: c, correcta: true }, ...malas.map(([texto, error, siFuera], k) => ({ id: `e${k}`, texto, error, siFuera }))];
  const voltear = (arr, s) => (s % 2 ? arr.slice().reverse() : arr.slice());
  const texto = (frs, extra = []) => ({ secciones: [{ id: 'o', titulo: 'Texto', modo: 'tarjeta', fragmentos: frs.map(([id, t]) => ({ id, t })) }, ...extra] });
  const conclusion = t => ({ id: 'c', titulo: 'Conclusión', modo: 'tarjeta', fragmentos: [{ id: 'c1', t }] });

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
  const deduccion = {
    id: 'necesaria-probable',
    titulo: 'Necesaria, probable o sin respaldo',
    temas: ['Inferencia deductiva e inductiva'],
    pieza: 'rv-texto',
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
  const implicito = {
    id: 'implicito',
    titulo: 'Lo que se dice sin decir',
    temas: ['Información implícita'],
    pieza: 'rv-texto',
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
  const intencion = {
    id: 'intencion-global',
    titulo: 'La intención sale del todo',
    temas: ['Inferencia de la intención', 'Inferencia holística'],
    pieza: 'rv-texto',
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
  // Más que el juego de la idea 1: una cinta tapa una frase del texto y se recalcula la fuerza de cada conclusión. El
  // caso que la idea no deja ver: a una deducción le basta perder una premisa para quedarse sin respaldo. La fuerza
  // sale de qué frases necesita cada conclusión (CON[k].marcas): si falta alguna, queda sin respaldo.
  const figTapa = k => texto(INS, [conclusion(CON[k].t), { id: 'bandeja', titulo: 'Cinta', modo: 'parrafo', fragmentos: [{ id: 'cinta', t: 'sin usar' }] }]);
  const fuerza = (k, t) => (Object.keys(CON[k].marcas).length && !Object.keys(CON[k].marcas).includes(t) ? CON[k].sello : ['Sin respaldo', 'h']);
  const mesaTapa = {
    id: 'tapa-premisa', titulo: 'Tapa una premisa', pieza: 'rv-texto',
    consigna: 'Elige una conclusión y arrastra la cinta para tapar una frase del texto. Mira qué conclusión resiste sin ella.',
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
    arrastres: [marcador('t', val => figTapa(val.k), ['a', 'b', 'd', 'cinta'], 'cinta que tapa una frase', 'c-h', v => (v === 'no' ? 'cinta' : v), id => (id === 'cinta' ? 'no' : id))],
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
    laboratorio: [
      mesaTapa,
      Object.assign({ id: 'implicito', titulo: 'Lo que se dice sin decir', pieza: 'rv-texto' }, implicito.juega),
      Object.assign({ id: 'intencion', titulo: 'La intención del aviso', pieza: 'rv-texto' }, intencion.juega),
    ],
    ideas: [deduccion, implicito, intencion],
  };
});
