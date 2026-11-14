/*
 * Teoría de «Extrapolación y lectura crítica» (razonamiento-verbal.extrapolacion). Molde: docs/teoria.md. Contenido:
 * matriz de verbal (unidad 14), historia (Hume, Investigación sobre el entendimiento humano, 1748, sección IV) y
 * códigos RV12 y RV63. Textos propios (regla 5).
 * Ruta A · Argumentar: se cambia una condición y se ve qué conclusión sigue en pie, cuál queda en duda y cuál cae.
 *
 * Ficha de tarea:
 *   Promesa: llevar una relación del texto a un caso nuevo diciendo qué se conserva y qué deja de estar garantizado.
 *   Persona y condiciones: postulante de 3.º a 5.º, celular, sin audio; extrapolación (UNI 19, UNMSM 13).
 *   Resultado observable: explica qué conclusión sigue tras el cambio y cuál ya no está garantizada.
 *   Orden de atención: 1.º la condición que cambia (o) · 2.º las conclusiones (i, d o h) · 3.º el sello.
 *   Estados: se mantiene · ya no está garantizada · se contradice.
 *   Duda que resuelve: si «si llueve, se suspende», ¿sin lluvia se hace seguro?
 *
 * Colores (regla 4): lo que se mantiene i (turquesa, continuo), la condición que se cambia o (naranja, discontinuo),
 * lo que queda en duda d (verde, punteado), lo que se contradice h (rojo).
 * Códigos: RV12 (extrapolación literal), RV63 (condicional contrario que reconfirma); RVX1 (llevar la relación fuera
 * de su alcance) y RVX2 (negar el antecedente) son hipótesis nuevas.
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
  const sigue = t => ({ v: 'c-i', t }), cond = t => ({ v: 'c-o', t }), duda = t => ({ v: 'c-d', t }), cae = t => ({ v: 'c-h', t });
  const opciones = (c, malas) => [{ id: 'c', texto: c, correcta: true }, ...malas.map(([texto, error, siFuera], k) => ({ id: `e${k}`, texto, error, siFuera }))];
  const voltear = (arr, s) => (s % 2 ? arr.slice().reverse() : arr.slice());
  const tarjeta = (id, titulo, frs, modo = 'tarjeta') => ({ id, titulo, modo, fragmentos: frs.map(([fid, t]) => ({ id: fid, t })) });

  // ---------- Idea 1: llevar la relación a un caso nuevo ----------
  // Cambia: el caso al que se lleva la relación. Permanece: el texto de la totora y sus dos condiciones.
  // Progresa: cuántas condiciones cumple el caso nuevo. Se reserva: llevar un estudio a otra población (predicción).
  // Debe verse: las dos condiciones del texto marcadas y cuál falla en cada caso.
  const TOT = tarjeta('o', 'Texto', [['a', 'En el lago, la totora crece donde el agua es'], ['p', 'poco profunda'], ['b', 'y'], ['q', 'tranquila.']]);
  const CASOS = {
    laguna: { t: 'una laguna tranquila y poco profunda', p: true, q: true },
    rio: { t: 'un río poco profundo y correntoso', p: true, q: false },
    hondo: { t: 'una laguna tranquila y muy honda', p: false, q: true },
  };
  const figCaso = k => ({ secciones: [TOT, tarjeta('n', 'Caso nuevo', [['c', CASOS[k].t]])] });
  const estCaso = (k, extra = {}) => { const c = CASOS[k], ok = c.p && c.q; return Object.assign({ marcas: { p: c.p ? 'i' : 'h', q: c.q ? 'i' : 'h', c: 'o' }, sellos: { n: ok ? { t: 'Se puede esperar', c: 'i' } : { t: 'No se puede llevar', c: 'h' } } }, extra); };
  const llevar = {
    id: 'caso-nuevo',
    titulo: 'Llevar la relación a otro caso',
    temas: ['Extrapolación cognitiva y referencial'],
    pieza: 'rv-texto',
    juega: {
      consigna: 'Lleva lo que dice el texto a otros lugares. Mira si el caso nuevo cumple las dos condiciones que el texto pone.',
      voz: 'Una relación viaja con sus condiciones.',
      controles: [{ id: 'k', etiqueta: 'Caso', opciones: [{ valor: 'laguna', texto: 'otra laguna' }, { valor: 'rio', texto: 'un río' }, { valor: 'hondo', texto: 'una laguna honda' }] }],
      dibujo: val => ({ datos: figCaso(val.k), estado: estCaso(val.k) }),
      lectura: val => { const c = CASOS[val.k]; return c.p && c.q ? [sigue('Cumple las dos condiciones')] : [cae('Falla'), `: ${c.p ? 'no es tranquila' : 'no es poco profunda'}`]; },
      minimo: 3,
    },
    predice: {
      pregunta: 'Un estudio con escolares de Puno dice que leer veinte minutos diarios mejoró su comprensión. ¿Qué se puede decir de los adultos de Lima?',
      voz: '¿El estudio habló de ellos?',
      opciones: opciones('Podría pasar, pero el estudio no lo garantiza', [
        ['También mejorarían: leer siempre ayuda', 'RVX1', 'Es una idea razonable, pero el estudio solo midió a escolares de Puno.'],
        ['No mejorarían: el estudio no habla de ellos', 'RV36', 'Que no hable de ellos no prueba lo contrario.'],
        ['Mejorarían el doble, por ser adultos', 'RV7', 'Nada en el estudio permite decir cuánto.'],
      ]),
      dibujo: { datos: { secciones: [tarjeta('o', 'Estudio', [['a', 'En escolares de Puno,'], ['b', 'leer veinte minutos diarios mejoró la comprensión.']]), tarjeta('n', 'Caso nuevo', [['c', 'adultos de Lima']])] }, estado: { marcas: { c: 'o' } } },
      revelar: { datos: { secciones: [tarjeta('o', 'Estudio', [['a', 'En escolares de Puno,'], ['b', 'leer veinte minutos diarios mejoró la comprensión.']]), tarjeta('n', 'Caso nuevo', [['c', 'adultos de Lima']])] }, estado: { marcas: { a: 'd', c: 'o' }, sellos: { n: { t: 'Fuera del alcance', c: 'd' } } } },
      coincide: 'Coincide: el estudio declara a quiénes midió; llevarlo más allá exige nuevos datos.',
    },
    mira: {
      datos: figCaso('rio'),
      pasos: [
        { estado: { marcas: { p: 'i', q: 'i' } }, texto: 'El texto pone dos condiciones: poco profunda y tranquila.', ecuacion: [sigue('poco profunda'), ' + ', sigue('tranquila')] },
        { estado: { marcas: { p: 'i', q: 'i', c: 'o' }, nuevo: ['c'] }, texto: 'El caso nuevo es un río poco profundo, pero correntoso.', ecuacion: [cond('río'), ': ', sigue('poco profundo'), ', ', cae('correntoso')] },
        { estado: estCaso('rio', { nuevo: ['n'] }), texto: 'Falla una condición: no se puede esperar totora allí.', ecuacion: [cae('falta tranquila'), ' → no se lleva'] },
      ],
    },
    regla: {
      texto: 'Extrapolar es llevar una relación del texto a un caso nuevo (otro lugar, tiempo o grupo). Vale si el caso cumple las condiciones del texto; si no, no está garantizada.',
      ecuacion: [sigue('relación'), ' + ', cond('caso nuevo'), ' con sus condiciones → extrapolación'],
      condicion: 'se nombran las condiciones y el alcance que el texto declara (a quiénes, dónde, cuándo).',
    },
    ahoraTu: {
      generar(s) {
        const B = [
          { t: 'En la costa, el maíz se siembra en primavera porque necesita calor para germinar.', n: 'una zona de la sierra que es fría en primavera', ok: 'No se puede esperar lo mismo: falta el calor', m: [['Se siembra igual en primavera', 'RVX1', 'Lleva la fecha sin la condición: el calor.'], ['El maíz no crece nunca en la sierra', 'RV7', 'El texto no dice eso: habla del calor que necesita.'], ['No se puede decir nada', 'RV34', 'Sí: la condición del calor no se cumple.']] },
          { t: 'En el colegio A, el huerto mejoró la asistencia porque los alumnos querían ver crecer sus plantas.', n: 'otro colegio que también hará un huerto', ok: 'Podría mejorar, pero no está garantizado', m: [['Mejorará seguro, como en A', 'RVX1', 'Un caso no garantiza otro: depende de si los alumnos se interesan.'], ['No mejorará: es otro colegio', 'RV36', 'Ser otro colegio no prueba lo contrario.'], ['Empeorará la asistencia', 'RV7', 'Nada en el texto lo permite.']] },
          { t: 'El hielo flota en el agua porque es menos denso que ella.', n: 'un trozo de hielo en un vaso de aceite, que es menos denso que el hielo', ok: 'No flotaría: no se cumple la condición', m: [['Flotaría, porque el hielo siempre flota', 'RVX1', 'El texto da una razón: ser menos denso que el líquido.'], ['Se derretiría al instante', 'RV7', 'El texto no habla de eso.'], ['No se puede decir nada', 'RV34', 'Se puede: la condición de densidad no se cumple.']] },
          { t: 'En invierno, el lago se congela en sus orillas porque las noches bajan de cero grados.', n: 'una noche de invierno en que la temperatura no baja de cinco grados', ok: 'No se esperaría hielo esa noche', m: [['Se congelaría igual por ser invierno', 'RVX1', 'El texto pone la causa en el frío bajo cero, no en la estación.'], ['El lago se secaría', 'RV7', 'Nada en el texto lo dice.'], ['No se puede decir nada', 'RV34', 'Sí: la causa no se presenta.']] },
          { t: 'El pan de la panadería se vende rápido en la mañana porque sale caliente a las seis.', n: 'un día en que el pan sale recién a las diez', ok: 'Ya no se puede esperar la venta rápida de la mañana', m: [['Se vendería rápido igual', 'RVX1', 'Lleva el resultado sin su causa: el pan caliente temprano.'], ['La panadería cerraría', 'RV7', 'Nada lo permite.'], ['No se puede decir nada', 'RV34', 'Sí: falta la condición.']] },
        ];
        const b = B[s % B.length];
        return {
          pregunta: '¿Qué se puede esperar si se lleva lo que dice el texto al caso nuevo?',
          dibujo: { datos: { secciones: [tarjeta('o', 'Texto', [['a', b.t]]), tarjeta('n', 'Caso nuevo', [['c', b.n]])] }, estado: { marcas: { c: 'o' } } },
          opciones: opciones(b.ok, voltear(b.m, s)),
          solucion: { texto: 'Se revisa si el caso cumple la condición que da el texto.', ecuacion: [sigue('condición'), ' ¿se cumple en ', cond('el caso'), '?'] },
        };
      },
    },
  };

  // ---------- Idea 2: el condicional no se da vuelta ----------
  // Cambia: lo que se supone (que el río crece, que no crece, que el puente está cerrado). Permanece: la regla «si el
  // río crece, se cierra el puente». Progresa: qué conclusión es segura y cuál queda abierta. Se reserva: el
  // condicional en subjuntivo de un texto (predicción). Debe verse: que negar la condición no niega el resultado.
  const REGLA = tarjeta('o', 'Texto', [['si', 'Si'], ['a', 'el río crece,'], ['b', 'cierran el puente.']]);
  const SUP = {
    crece: { t: 'El río creció anoche.', concl: 'Cierran el puente: es seguro', c: 'i', marcas: { a: 'i', b: 'i' } },
    nocrece: { t: 'El río no creció.', concl: 'No se sabe si cierran el puente', c: 'd', marcas: { a: 'h', b: 'd' } },
    cerrado: { t: 'El puente está cerrado.', concl: 'No se sabe si el río creció', c: 'd', marcas: { a: 'd', b: 'i' } },
  };
  const figSup = k => ({ secciones: [REGLA, tarjeta('n', 'Supón que', [['c', SUP[k].t]])] });
  const condicional = {
    id: 'condicional',
    titulo: 'Si A, entonces B',
    temas: ['Condicional subjuntivo'],
    pieza: 'rv-texto',
    juega: {
      consigna: 'La regla dice: si el río crece, cierran el puente. Supón distintas cosas y mira qué se puede concluir con seguridad.',
      voz: 'El puente podría cerrarse por otra razón.',
      controles: [{ id: 'k', etiqueta: 'Supón', opciones: [{ valor: 'crece', texto: 'creció' }, { valor: 'nocrece', texto: 'no creció' }, { valor: 'cerrado', texto: 'puente cerrado' }] }],
      dibujo: val => ({ datos: figSup(val.k), estado: { marcas: Object.assign({ c: 'o' }, SUP[val.k].marcas), sellos: { n: { t: SUP[val.k].c === 'i' ? 'Seguro' : 'No se sabe', c: SUP[val.k].c } } } }),
      lectura: val => [corto(SUP[val.k].c === 'i' ? sigue : duda, SUP[val.k].concl)],
      minimo: 3,
    },
    predice: {
      pregunta: 'Según el texto, si los incas no hubieran tenido chasquis, ¿qué habría pasado con los mensajes?',
      voz: 'Sigue la cadena que el texto propone.',
      opciones: opciones('Habrían tardado mucho más en llegar', [
        ['Habrían llegado igual de rápido', 'RV63', 'Eso reconfirma lo que el cambio niega: el texto dice que la rapidez dependía de los chasquis.'],
        ['Los incas no habrían construido caminos', 'RV12', 'El texto no hace depender los caminos de los chasquis.'],
        ['El imperio habría desaparecido', 'RVX1', 'Va mucho más allá de lo que el texto permite decir.'],
      ]),
      dibujo: { datos: { secciones: [tarjeta('o', 'Texto', [['a', 'Gracias a los chasquis, que corrían por relevos,'], ['b', 'un mensaje cruzaba el imperio en pocos días.']]), tarjeta('n', 'Supón que', [['c', 'no hubiera chasquis']])] }, estado: { marcas: { c: 'o' } } },
      revelar: { datos: { secciones: [tarjeta('o', 'Texto', [['a', 'Gracias a los chasquis, que corrían por relevos,'], ['b', 'un mensaje cruzaba el imperio en pocos días.']]), tarjeta('n', 'Supón que', [['c', 'no hubiera chasquis']])] }, estado: { marcas: { a: 'h', b: 'h', c: 'o' }, sellos: { n: { t: 'Cae «pocos días»', c: 'h' } } } },
      coincide: 'Coincide: el texto ata la rapidez a los chasquis; sin ellos, esa rapidez cae.',
    },
    mira: {
      datos: figSup('nocrece'),
      pasos: [
        { estado: { marcas: { a: 'i', b: 'i' } }, texto: 'La regla une una condición (crece) con un resultado (cierran).', ecuacion: [cond('si crece'), ' → ', sigue('cierran')] },
        { estado: { marcas: { a: 'h', c: 'o' }, nuevo: ['c'] }, texto: 'Ahora el río no creció: la condición no se cumple.', ecuacion: [cae('no crece')] },
        { estado: { marcas: { a: 'h', b: 'd', c: 'o' }, sellos: { n: { t: 'No se sabe', c: 'd' } }, nuevo: ['b', 'n'] }, texto: 'Eso no obliga a abrir: podrían cerrarlo por obras. No se sabe.', ecuacion: [cae('no A'), ' ↛ ', cae('no B')] },
      ],
    },
    regla: {
      texto: 'De «si A, entonces B» se concluye B cuando ocurre A; si A no ocurre, B queda sin decidir. El condicional en subjuntivo cambia una condición y sigue su cadena.',
      ecuacion: [cond('A'), ' → ', sigue('B'), '   pero   ', cae('no A'), ' ↛ ', cae('no B')],
      condicion: 'el texto no dice que A sea la única causa de B; si dijera «solo si», sí se daría vuelta.',
    },
    ahoraTu: {
      generar(s) {
        const B = [
          { t: 'Si llueve, se suspende el partido.', sup: 'Hoy no llovió.', ok: 'No se sabe si el partido se juega', m: [['El partido se juega seguro', 'RVX2', 'Podría suspenderse por otra razón: la regla no lo impide.'], ['El partido se suspende', 'RV63', 'Sin lluvia, la regla no obliga a suspender.'], ['Va a llover mañana', 'RV7', 'Nada lo dice.']] },
          { t: 'Si un alumno falta tres veces, avisan a sus padres.', sup: 'Avisaron a los padres de Luis.', ok: 'No se sabe si Luis faltó tres veces', m: [['Luis faltó tres veces', 'RVX2', 'Pudieron avisar por otra razón.'], ['Luis nunca faltó', 'RV7', 'Nada lo dice.'], ['Luis faltó una vez', 'RV7', 'Nada lo dice.']] },
          { t: 'Si se corta la luz, la bomba no sube agua al tanque.', sup: 'Anoche se cortó la luz.', ok: 'La bomba no subió agua anoche', m: [['No se sabe si subió agua', 'RV34', 'Aquí la condición sí ocurrió: el resultado es seguro.'], ['La bomba se malogró', 'RV7', 'Nada lo dice.'], ['El tanque se llenó igual', 'RV63', 'Contradice la regla.']] },
          { t: 'Si el pan sale antes de las seis, se vende todo en la mañana.', sup: 'El pan salió a las ocho.', ok: 'No se sabe si se vende todo', m: [['No se vende nada', 'RVX2', 'La regla no dice qué pasa si sale tarde.'], ['Se vende todo igual', 'RV63', 'Sin la condición, no está garantizado.'], ['La panadería cierra temprano', 'RV7', 'Nada lo dice.']] },
          { t: 'Si alguien toca la puerta, el perro ladra.', sup: 'El perro está ladrando.', ok: 'No se sabe si tocaron la puerta', m: [['Alguien tocó la puerta', 'RVX2', 'El perro podría ladrar por otra causa.'], ['Nadie tocó la puerta', 'RV7', 'Tampoco se sabe eso.'], ['El perro tiene hambre', 'RV7', 'Nada lo dice.']] },
        ];
        const b = B[s % B.length];
        return {
          pregunta: 'Con la regla del texto y lo que se supone, ¿qué se puede concluir?',
          dibujo: { datos: { secciones: [tarjeta('o', 'Texto', [['a', b.t]]), tarjeta('n', 'Supón que', [['c', b.sup]])] }, estado: { marcas: { c: 'o' } } },
          opciones: opciones(b.ok, voltear(b.m, s)),
          solucion: { texto: 'Solo si ocurre la condición se concluye el resultado; al revés, no.', ecuacion: [cond('A'), ' → ', sigue('B')] },
        };
      },
    },
  };

  // ---------- Idea 3: mundos posibles ----------
  // Cambia: la condición del mundo imaginado. Permanece: el texto de la escuela y sus tres conclusiones.
  // Progresa: cada conclusión queda en pie, en duda o se cae. Se reserva: otro texto (predicción).
  // Debe verse: las tres casillas a la vez sobre la misma lista.
  const ESC = ['La escuela queda a cinco kilómetros.', 'Los alumnos caminan una hora para llegar.', 'Por eso, llegan cansados a la primera clase.', 'El comedor les da desayuno.'];
  const MUNDO = {
    real: { t: 'nada cambiara.', marcas: { o1: 'i', o2: 'i', o3: 'i', o4: 'i' }, dice: 'Todo se sostiene' },
    bus: { t: 'Hubiera un bus escolar.', marcas: { o1: 'i', o2: 'h', o3: 'd', o4: 'i' }, dice: 'Cae la caminata; el cansancio queda en duda' },
    cerca: { t: 'La escuela quedara a una cuadra.', marcas: { o1: 'h', o2: 'h', o3: 'd', o4: 'i' }, dice: 'Caen la distancia y la caminata' },
  };
  const figMundo = k => ({ secciones: [{ id: 'o', titulo: 'Texto', modo: 'lista', fragmentos: ESC.map((t, j) => ({ id: `o${j + 1}`, t })) }, tarjeta('n', 'Mundo posible: si…', [['c', MUNDO[k].t]])] });
  const mundos = {
    id: 'mundos-posibles',
    titulo: 'Qué queda en otro mundo',
    temas: ['Mundos posibles'],
    pieza: 'rv-texto',
    juega: {
      consigna: 'Imagina un mundo donde cambia una sola cosa. Mira qué oraciones siguen en pie, cuáles quedan en duda y cuáles se caen.',
      voz: 'Cambia una cosa y revisa cada oración.',
      controles: [{ id: 'k', etiqueta: 'Mundo', opciones: [{ valor: 'real', texto: 'el de hoy' }, { valor: 'bus', texto: 'con bus' }, { valor: 'cerca', texto: 'escuela cerca' }] }],
      dibujo: val => ({ datos: figMundo(val.k), estado: { marcas: Object.assign({ c: 'o' }, MUNDO[val.k].marcas) } }),
      lectura: val => [corto(val.k === 'real' ? sigue : duda, MUNDO[val.k].dice)],
      minimo: 3,
    },
    predice: {
      pregunta: 'En el texto de la feria, si no hubiera subido el precio del pasaje, ¿qué pasaría con la última oración?',
      opciones: opciones('Quedaría en duda: su causa desaparece', [
        ['Seguiría igual de cierta', 'RV63', 'Su única razón en el texto es el pasaje caro.'],
        ['Sería falsa: vendrían más compradores seguro', 'RVX2', 'Sin esa causa, no se garantiza lo contrario: podría haber otras.'],
        ['Se caería la primera oración', 'RV12', 'La feria sigue siendo los domingos: eso no depende del pasaje.'],
      ]),
      dibujo: { datos: { secciones: [{ id: 'o', titulo: 'Texto', modo: 'lista', fragmentos: [{ id: 'o1', t: 'La feria es los domingos.' }, { id: 'o2', t: 'Este año subió el pasaje a la feria.' }, { id: 'o3', t: 'Por eso, llegaron menos compradores.' }] }, tarjeta('n', 'Mundo posible: si…', [['c', 'no hubiera subido el pasaje']])] }, estado: { marcas: { c: 'o' } } },
      revelar: { datos: { secciones: [{ id: 'o', titulo: 'Texto', modo: 'lista', fragmentos: [{ id: 'o1', t: 'La feria es los domingos.' }, { id: 'o2', t: 'Este año subió el pasaje a la feria.' }, { id: 'o3', t: 'Por eso, llegaron menos compradores.' }] }, tarjeta('n', 'Mundo posible: si…', [['c', 'no hubiera subido el pasaje']])] }, estado: { marcas: { c: 'o', o1: 'i', o2: 'h', o3: 'd' } } },
      coincide: 'Coincide: sin su causa, la 3 queda sin respaldo, pero no se vuelve falsa.',
    },
    mira: {
      datos: figMundo('bus'),
      pasos: [
        { estado: { marcas: { c: 'o', o1: 'i', o4: 'i' } }, texto: 'Con bus, la distancia y el desayuno no cambian: siguen.', ecuacion: [sigue('5 km'), ' · ', sigue('desayuno')] },
        { estado: { marcas: { c: 'o', o1: 'i', o4: 'i', o2: 'h' }, nuevo: ['o2'] }, texto: 'La caminata de una hora se cae: irían en bus.', ecuacion: [cae('caminan una hora')] },
        { estado: { marcas: MUNDO.bus.marcas, nuevo: ['o3'] }, texto: 'El cansancio queda en duda: su causa se fue, pero podría haber otra.', ecuacion: [duda('llegan cansados'), ' = no se sabe'] },
      ],
    },
    regla: {
      texto: 'En un mundo posible se cambia una condición y se revisa cada afirmación: unas siguen en pie, otras se caen y otras quedan sin respaldo, sin volverse falsas.',
      ecuacion: [cond('cambio'), ' → ', sigue('sigue'), ' | ', duda('en duda'), ' | ', cae('se cae')],
      condicion: 'se cambia solo lo que dice el supuesto; lo que no depende de él queda igual.',
    },
    ahoraTu: {
      generar(s) {
        const B = [
          { o: ['El puente se cayó en marzo.', 'Por eso, los niños cruzan el río en bote.', 'La escuela está al otro lado.'], sup: 'el puente no se hubiera caído', pide: 2, ok: 'Quedaría sin su causa: no se sabe', m: [['Seguiría igual', 'RV63', 'Su causa en el texto es la caída del puente.'], ['Sería falsa con seguridad', 'RVX2', 'Sin esa causa, no se garantiza lo contrario.'], ['Se caería la oración 3', 'RV12', 'La escuela sigue al otro lado.']] },
          { o: ['La helada dañó la papa.', 'Por eso, este año subió su precio.', 'La quinua no sufrió daños.'], sup: 'no hubiera habido helada', pide: 2, ok: 'Quedaría sin su causa: no se sabe', m: [['Seguiría igual', 'RV63', 'El texto ata la subida a la helada.'], ['El precio bajaría seguro', 'RVX2', 'No se garantiza: podría haber otras causas.'], ['La quinua se dañaría', 'RV12', 'Nada lo dice.']] },
          { o: ['La biblioteca abre hasta las ocho.', 'Rosa estudia allí después del colegio.', 'Su casa no tiene luz eléctrica.'], sup: 'la biblioteca cerrara a las dos', pide: 2, ok: 'Ya no podría estudiar allí después del colegio', m: [['Seguiría igual', 'RV63', 'Si cierra a las dos, no está abierta después del colegio.'], ['Su casa tendría luz', 'RV12', 'Eso no depende del horario.'], ['No se puede decir nada', 'RV34', 'Se puede: el horario ya no lo permite.']] },
          { o: ['El mercado nuevo tiene techo.', 'Por eso, los vendedores trabajan aunque llueva.', 'Está a dos cuadras de la plaza.'], sup: 'el mercado no tuviera techo', pide: 2, ok: 'Quedaría sin su causa: no se sabe', m: [['Seguiría igual', 'RV63', 'El texto ata el trabajar con lluvia al techo.'], ['No trabajarían nunca', 'RVX2', 'Exagera: solo pierde su causa.'], ['Se movería de lugar', 'RV12', 'La ubicación no depende del techo.']] },
          { o: ['El río trae agua todo el año.', 'Gracias a eso, el valle tiene dos cosechas.', 'Los agricultores venden en Arequipa.'], sup: 'el río se secara en invierno', pide: 2, ok: 'Las dos cosechas quedarían en duda', m: [['Seguiría habiendo dos cosechas seguro', 'RV63', 'El texto las ata al agua de todo el año.'], ['No habría ninguna cosecha', 'RVX2', 'Exagera: en verano sí habría agua.'], ['Venderían en otra ciudad', 'RV12', 'Nada lo dice.']] },
        ];
        const b = B[s % B.length];
        return {
          pregunta: `Si ${b.sup}, ¿qué pasaría con la oración ${b.pide}?`,
          dibujo: { datos: { secciones: [{ id: 'o', titulo: 'Texto', modo: 'lista', fragmentos: b.o.map((t, j) => ({ id: `o${j + 1}`, t })) }] }, estado: { marcas: { [`o${b.pide}`]: 'o' } } },
          opciones: opciones(b.ok, voltear(b.m, s)),
          solucion: { texto: 'Se mira si la oración depende de lo que cambió.', ecuacion: [cond('cambio'), ' → ', duda(`oración ${b.pide}`)] },
        };
      },
    },
  };

  return {
    unidad: 'razonamiento-verbal.extrapolacion',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rv-texto.js'],
    historia: {
      texto: 'En 1748, Hume se preguntó qué nos permite pasar de lo que ya vimos a lo que todavía no vemos. Que algo haya pasado muchas veces no prueba que deba volver a pasar. Por eso, al llevar una conclusión a otro caso, hay que decir qué supuestos se mantienen y qué cambia.',
      pregunta: '¿Lo que pasó cien veces pasará la vez ciento uno?',
      fuente: { titulo: 'Matriz de teoría de razonamiento verbal (Hume, 1748)', url: 'https://openstax.org/books/contemporary-mathematics/pages/2-7-logical-arguments' },
    },
    ideas: [llevar, condicional, mundos],
  };
});
