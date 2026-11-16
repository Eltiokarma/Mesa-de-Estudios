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
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  // Gesto directo (docs/teoria.md §4b): un marcador que se arrastra por el texto y se suelta en una frase; la manija va
  // sobre ella (rv-texto.ancla) y salta a la más cercana al dedo (rv-texto.cercana). El control con botones es la
  // alternativa sin arrastre.
  const RV = () => Kit.piezas['rv-texto'];
  const marcador = (datosDe, ids, control, etiqueta) => ({
    id: 'frase', etiqueta, color: 'c-i',
    donde: val => RV().ancla(datosDe(val), val[control]),
    mover: (pt, val) => ({ [control]: RV().cercana(datosDe(val), pt, ids) }),
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
  const sigue = t => ({ v: 'c-i', t }), cond = t => ({ v: 'c-o', t }), duda = t => ({ v: 'c-d', t }), cae = t => ({ v: 'c-h', t });
  const opciones = (c, malas) => [{ id: 'c', texto: c, correcta: true }, ...malas.map(([texto, error, siFuera], k) => ({ id: `e${k}`, texto, error, siFuera }))];
  const voltear = (arr, s) => (s % 2 ? arr.slice().reverse() : arr.slice());
  const tarjeta = (id, titulo, frs, modo = 'tarjeta') => ({ id, titulo, modo, fragmentos: frs.map(([fid, t]) => ({ id: fid, t })) });
  // Semillas de «Así se resuelve» (azar(s + 900)), el mismo generador de aritmetica/razones-y-proporciones.js.
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.de = xs => xs[Math.floor(r() * xs.length)];
    return r;
  }
  // Banco propio de cada «Así se resuelve»: recorre los ítems con la semilla, mezclados por azar(s + 900).
  const elige = (RES, s) => RES[(s + Math.floor(azar(s + 900)() * RES.length)) % RES.length];
  // El paso «sentido» descarta la opción más tentadora del ítem (la primera mala) con su porqué.
  const descarta = m => `Descarto «${m[0][0]}». ${m[0][2]}`;

  // ---------- Idea 1: llevar la relación a un caso nuevo ----------
  // Cambia: el caso al que se lleva la relación. Permanece: el texto de la totora y sus dos condiciones.
  // Progresa: cuántas condiciones cumple el caso nuevo. Se reserva: llevar un estudio a otra población (predicción).
  // Debe verse: las dos condiciones del texto marcadas y cuál falla en cada caso.
  const TOT = tarjeta('o', 'Texto', [['a', 'En el lago, la totora crece donde el agua es'], ['p', 'poco profunda'], ['b', 'y'], ['q', 'tranquila.']]);
  const CASOS = {
    laguna: { t: 'una laguna tranquila y poco profunda', p: true, q: true, dp: 'poco profunda', dq: 'tranquila' },
    rio: { t: 'un río poco profundo y correntoso', p: true, q: false, dp: 'poco profundo', dq: 'correntoso' },
    hondo: { t: 'una laguna tranquila y muy honda', p: false, q: true, dp: 'muy honda', dq: 'tranquila' },
  };
  const NOMBRE_COND = { p: 'Poco profunda', q: 'Tranquila' };
  const figCaso = k => ({ secciones: [TOT, tarjeta('n', 'Caso nuevo', [['c', CASOS[k].t]])] });
  const estCaso = (k, extra = {}) => { const c = CASOS[k], ok = c.p && c.q; return Object.assign({ marcas: { p: c.p ? 'i' : 'h', q: c.q ? 'i' : 'h', c: 'o' }, sellos: { n: ok ? { t: 'Se puede esperar', c: 'i' } : { t: 'No se puede llevar', c: 'h' } } }, extra); };
  const llevar = {
    id: 'caso-nuevo',
    titulo: 'Llevar la relación a otro caso',
    temas: ['Extrapolación cognitiva y referencial'],
    pieza: 'rv-texto',
    // Lee (fase 2): contexto y vocabulario, sin decir qué pasa al llevar un estudio a otro grupo (eso es Predice).
    lee: {
      tarjetas: [
        { titulo: 'Llevar una idea a otro lado', texto: 'Tu tía lee que en Arequipa subió la venta de paltas y se pregunta si en Juliaca pasará lo mismo. Llevar lo que dice un texto a un caso del que no habla se llama extrapolar.' },
        { titulo: 'Caso nuevo y condiciones', texto: 'El lugar, el tiempo o el grupo al que llevas la idea es el caso nuevo. Lo que el texto pide para que algo ocurra son sus condiciones; palabras como «donde», «cuando» o «porque» suelen anunciarlas.' },
        { titulo: 'Qué mirar al jugar', texto: 'El texto del juego habla de la totora del lago. Elige un caso nuevo, lleva el círculo turquesa a cada condición y mira cuál se marca en turquesa y cuál en rojo.' },
      ],
    },
    juega: {
      consigna: 'Lleva lo que dice el texto a otros lugares. Arrastra el círculo turquesa a cada condición y mira si el caso la cumple.',
      voz: 'Una relación viaja con sus condiciones.',
      controles: [
        { id: 'k', etiqueta: 'Caso', opciones: [{ valor: 'laguna', texto: 'otra laguna' }, { valor: 'rio', texto: 'un río' }, { valor: 'hondo', texto: 'una laguna honda' }] },
        { id: 'f', etiqueta: 'Condición', opciones: [{ valor: 'p', texto: 'poco profunda' }, { valor: 'q', texto: 'tranquila' }] },
      ],
      dibujo: val => ({ datos: figCaso(val.k), estado: estCaso(val.k, { nuevo: [val.f] }) }),
      lectura: val => {
        const c = CASOS[val.k], ok = c[val.f];
        return [(ok ? sigue : cae)(NOMBRE_COND[val.f]), `: el caso es ${c[`d${val.f}`]}`, ok ? ' · cumple' : ' · falla'];
      },
      minimo: 3,
      arrastres: [marcador(() => figCaso('laguna'), ['p', 'q'], 'f', 'círculo de la condición')],
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
      ecuacion: [{ llave: [sigue('relación')], nota: 'lo que dice', color: 'c-i' }, ' + ', { llave: [cond('caso nuevo')], nota: 'sus condiciones', color: 'c-o' }, ' → extrapolación'],
      condicion: 'se nombran las condiciones y el alcance que el texto declara (a quiénes, dónde, cuándo).',
    },
    // Así se resuelve (fase 2): el mismo tipo de «Ahora tú» (llevar el texto a un caso nuevo), con un banco propio.
    resuelve: {
      generar(s) {
        const RES = [
          { o: [['a', 'La chalona se conserva meses porque la carne'], ['p', 'se sala'], ['b', 'y'], ['q', 'se seca al sol y al frío de la puna.']], n: 'carne salada guardada en un cuarto húmedo y sin sol',
            ok: 'No se puede esperar que dure meses: falta el secado', m: [['Duraría meses igual, porque está salada', 'RVX1', 'La sal sola no basta; el texto pide también el secado.'], ['Se volvería chalona en un día', 'RV7', 'El texto no habla del tiempo de preparación.'], ['No se puede decir nada', 'RV34', 'Sí se puede: una condición del texto no se cumple.']],
            datos: 'El texto pide dos cosas: que la carne se sale y que se seque al sol y al frío. El caso nuevo tiene sal, pero ni sol ni secado.',
            marcas: { p: 'i', q: 'h' }, sello: ['No se puede llevar', 'h'], eq: [sigue('se sala'), '   ·   ', cae('no se seca')],
            aplica: 'La sal se cumple; el secado falla. Basta que falle una condición para que la conservación ya no esté garantizada.' },
          { o: [['a', 'En el mercado del barrio, el queso se vende más los sábados porque'], ['p', 'ese día llegan compradores de las comunidades.']], n: 'un martes de fiesta en que también llegan compradores de las comunidades',
            ok: 'Se puede esperar que el queso se venda más', m: [['No: el texto solo habla de los sábados', 'RV12', 'El sábado importa por los compradores, y el martes de fiesta también llegan.'], ['Se vendería todo el queso del mercado', 'RV7', 'El texto dice «más», no cuánto.'], ['No se puede decir nada', 'RV34', 'Sí: la causa que da el texto está presente.']],
            datos: 'El texto da una causa: ese día llegan compradores de las comunidades. El caso nuevo cambia el día, pero los compradores llegan igual.',
            marcas: { p: 'i' }, sello: ['Se puede esperar', 'i'], eq: [sigue('llegan compradores'), ' en ', cond('el martes de fiesta')],
            aplica: 'Lo que explica la venta no es el nombre del día, sino los compradores. En el caso nuevo esa condición se cumple.' },
          { o: [['a', 'En una comunidad de Cabana,'], ['b', 'sembrar quinua con abono de corral duplicó la cosecha en dos años.']], n: 'una comunidad vecina que también usará abono de corral',
            ok: 'Podría mejorar, pero no está garantizado', m: [['Duplicará su cosecha, como Cabana', 'RVX1', 'Un solo caso no asegura otro; el suelo y el clima pueden ser distintos.'], ['No mejorará: es otra comunidad', 'RV36', 'Ser otra comunidad no prueba lo contrario.'], ['La cosecha bajará con el abono', 'RV7', 'Nada en el texto lo permite.']],
            datos: 'El texto cuenta un resultado en un solo lugar, Cabana, y no dice por qué funcionó allí. El caso nuevo es otra comunidad.',
            marcas: { a: 'd' }, sello: ['Fuera del alcance', 'd'], eq: [duda('Cabana'), ' ≠ ', cond('comunidad vecina')],
            aplica: 'El texto no da condiciones para revisar: solo dice lo que pasó en Cabana. En la vecina podría repetirse, pero nada lo asegura.' },
          { o: [['a', 'La ropa se seca rápido en el altiplano porque'], ['p', 'el aire es seco'], ['b', 'y'], ['q', 'el sol es fuerte.']], n: 'una tarde nublada y de lluvia en el altiplano',
            ok: 'No se puede esperar que se seque rápido', m: [['Se secaría rápido igual: es el altiplano', 'RVX1', 'El texto lo explica por el sol y el aire seco, no por el lugar.'], ['La ropa no se secaría nunca', 'RV7', 'El texto solo explica por qué se seca rápido.'], ['No se puede decir nada', 'RV34', 'Sí: faltan las dos condiciones del texto.']],
            datos: 'El texto da dos razones: el aire seco y el sol fuerte. El caso nuevo es el mismo lugar, pero con nubes y lluvia.',
            marcas: { p: 'h', q: 'h' }, sello: ['No se puede llevar', 'h'], eq: [cae('aire húmedo'), '   ·   ', cae('sin sol')],
            aplica: 'Con lluvia, el aire no está seco; con nubes, el sol no es fuerte. Fallan las dos condiciones, aunque el lugar sea el mismo.' },
        ];
        const b = elige(RES, s);
        const fig = (estado) => ({ datos: { secciones: [tarjeta('o', 'Texto', b.o), tarjeta('n', 'Caso nuevo', [['c', b.n]])] }, estado });
        return {
          enunciado: `Lleva lo que dice el texto a este caso nuevo: ${b.n}. ¿Qué se puede esperar?`,
          dibujo: fig({ marcas: { c: 'o' } }),
          pasos: [
            { tipo: 'pide', texto: 'Piden decidir si lo que dice el texto vale también en el caso nuevo, que el texto no menciona.' },
            { tipo: 'datos', texto: b.datos },
            { tipo: 'regla', texto: 'Una relación del texto viaja a otro caso solo con sus condiciones. Si el caso las cumple, se puede esperar; si falla una, ya no está garantizada.',
              ecuacion: [sigue('relación'), ' + ', cond('caso nuevo'), ' → ¿cumple las condiciones?'] },
            { tipo: 'aplica', texto: b.aplica, ecuacion: b.eq,
              dibujo: fig({ marcas: Object.assign({ c: 'o' }, b.marcas), sellos: { n: { t: b.sello[0], c: b.sello[1] } }, nuevo: [...Object.keys(b.marcas), 'n'] }) },
            { tipo: 'sentido', texto: descarta(b.m) },
          ],
          respuesta: b.ok,
        };
      },
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
    crece: { t: 'El río creció anoche.', concl: 'Seguro: cierran el puente', c: 'i', marcas: { a: 'i', b: 'i' } },
    nocrece: { t: 'El río no creció.', concl: 'No se sabe: ¿cierran el puente?', c: 'd', marcas: { a: 'h', b: 'd' } },
    cerrado: { t: 'El puente está cerrado.', concl: 'No se sabe: ¿creció el río?', c: 'd', marcas: { a: 'd', b: 'i' } },
    // El caso que la idea no mostraba: negar el resultado sí decide (contrarrecíproco).
    abierto: { t: 'El puente está abierto.', concl: 'Seguro: el río no creció', c: 'i', marcas: { a: 'h', b: 'h' } },
  };
  const SUPUESTO = { a: { si: 'crece', no: 'nocrece' }, b: { si: 'cerrado', no: 'abierto' } };
  const figSup = k => ({ secciones: [REGLA, tarjeta('n', 'Supón que', [['c', SUP[k].t]])] });
  const condicional = {
    id: 'condicional',
    titulo: 'Si A, entonces B',
    temas: ['Condicional subjuntivo'],
    pieza: 'rv-texto',
    // Lee (fase 2): las dos partes del «si» y el subjuntivo, sin decir qué pasa al negar una parte (eso es Predice).
    lee: {
      tarjetas: [
        { titulo: 'Reglas con «si»', texto: 'En casa se oyen reglas como «si terminas la tarea, sales a jugar» o «si llueve, no hay feria». Cada una une dos partes: una condición, después del «si», y un resultado.',
          ecuacion: [cond('si condición'), ' → ', sigue('resultado')] },
        { titulo: 'Suponer lo que no pasó', texto: 'Cuando dices «si hubiera llovido» o «si no hubiera puente», imaginas algo que no ocurrió. Esa forma del verbo se llama subjuntivo y sirve para pensar qué pasaría en ese caso.' },
        { titulo: 'Qué mirar al jugar', texto: 'La regla del juego une un río y un puente. Lleva el círculo turquesa a la parte que supones, elige si ocurre o no, y mira cuándo el sello dice «Seguro».' },
      ],
    },
    juega: {
      consigna: 'La regla dice: si el río crece, cierran el puente. Arrastra el círculo turquesa a la parte que supones y elige si ocurre o no.',
      voz: 'El puente podría cerrarse por otra razón.',
      controles: [
        { id: 'parte', etiqueta: 'Supón sobre', opciones: [{ valor: 'a', texto: 'el río' }, { valor: 'b', texto: 'el puente' }] },
        { id: 'ocurre', etiqueta: '¿Ocurre?', opciones: [{ valor: 'si', texto: 'sí' }, { valor: 'no', texto: 'no' }] },
      ],
      dibujo: val => { const k = SUPUESTO[val.parte][val.ocurre]; return { datos: figSup(k), estado: { marcas: Object.assign({ c: 'o' }, SUP[k].marcas), sellos: { n: { t: SUP[k].c === 'i' ? 'Seguro' : 'No se sabe', c: SUP[k].c } } } }; },
      lectura: val => { const k = SUPUESTO[val.parte][val.ocurre]; return [corto(SUP[k].c === 'i' ? sigue : duda, SUP[k].concl)]; },
      minimo: 3,
      arrastres: [marcador(() => figSup('crece'), ['a', 'b'], 'parte', 'círculo de la parte de la regla')],
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
        { estado: { marcas: { a: 'h', b: 'd', c: 'o' }, sellos: { n: { t: 'No se sabe', c: 'd' } }, nuevo: ['b', 'n'] }, texto: 'Eso no obliga a abrir: podrían cerrarlo por obras. No se sabe.', ecuacion: [cae('no A'), ' no asegura ', cae('no B')] },
      ],
    },
    regla: {
      texto: 'De «si A, entonces B» se concluye B cuando ocurre A; si A no ocurre, B queda sin decidir. El condicional en subjuntivo cambia una condición y sigue su cadena.',
      ecuacion: [{ llave: [cond('A')], nota: 'condición', color: 'c-o' }, ' → ', { llave: [sigue('B')], nota: 'resultado', color: 'c-i' }, '   ·   ', cae('no A'), ' no asegura ', cae('no B')],
      condicion: 'el texto no dice que A sea la única causa de B; si dijera «solo si», sí se daría vuelta.',
    },
    // Así se resuelve (fase 2): el mismo tipo de «Ahora tú» (regla con «si» y un dato supuesto), con un banco propio.
    // k dice sobre qué parte habla el dato, como SUP: crece (ocurre A) · nocrece (no A) · cerrado (ocurre B) · abierto (no B).
    resuelve: {
      generar(s) {
        const RES = [
          { a: 'la combi se llena,', b: 'sale del paradero sin esperar la hora.', sup: 'La combi salió antes de la hora.', k: 'cerrado',
            ok: 'No se sabe si la combi se llenó', m: [['La combi se llenó', 'RVX2', 'Pudo salir antes por otra razón: la regla no dice que llenarse sea la única.'], ['La combi salió vacía', 'RV7', 'Nada lo dice.'], ['El chofer llegó tarde', 'RV7', 'Nada lo dice.']],
            aplica: 'El dato confirma el resultado, no la condición. Salir antes no dice por qué salió: pudo haber otra razón.' },
          { a: 'el profesor llega antes de las ocho,', b: 'abre el laboratorio.', sup: 'Hoy el profesor llegó a las nueve.', k: 'nocrece',
            ok: 'No se sabe si se abrió el laboratorio', m: [['El laboratorio quedó cerrado', 'RVX2', 'Llegar tarde no lo impide: la regla no dice qué pasa en ese caso.'], ['Lo abrió a las ocho', 'RV63', 'Sin la condición, la regla no asegura el resultado.'], ['El laboratorio está malogrado', 'RV7', 'Nada lo dice.']],
            aplica: 'El dato niega la condición. La regla solo habla de lo que pasa si llega temprano; para las nueve no dice nada.' },
          { a: 'la temperatura baja de cero,', b: 'el agua del tubo se congela.', sup: 'Anoche la temperatura bajó a cinco bajo cero.', k: 'crece',
            ok: 'El agua del tubo se congeló', m: [['No se sabe si se congeló', 'RV34', 'La condición sí ocurrió: con ella, el resultado es seguro.'], ['El tubo se rompió', 'RV7', 'La regla no habla de eso.'], ['El agua siguió líquida', 'RV63', 'Contradice la regla.']],
            aplica: 'El dato afirma la condición: cinco bajo cero es menos que cero. Entonces el resultado de la regla ocurre, seguro.' },
          { a: 'falta el profesor,', b: 'se cancela la clase.', sup: 'Hoy sí hubo clase.', k: 'abierto',
            ok: 'El profesor no faltó', m: [['No se sabe si faltó', 'RV34', 'Negar el resultado sí decide: si hubiera faltado, no habría clase.'], ['El profesor faltó', 'RV63', 'Contradice la regla: con su falta, no habría clase.'], ['Hubo un profesor de reemplazo', 'RV7', 'La regla no lo dice.']],
            aplica: 'El dato niega el resultado: la clase no se canceló. Si el profesor hubiera faltado, se habría cancelado; luego no faltó.' },
        ];
        const b = elige(RES, s), c = SUP[b.k];
        const sobre = b.k === 'crece' || b.k === 'nocrece' ? 'de la condición' : 'del resultado', dice = b.k === 'crece' || b.k === 'cerrado' ? 'que ocurre' : 'que no ocurre';
        const fig = (estado) => ({ datos: { secciones: [tarjeta('o', 'Texto', [['si', 'Si'], ['a', b.a], ['b', b.b]]), tarjeta('n', 'Supón que', [['c', b.sup]])] }, estado });
        return {
          enunciado: `Con la regla del texto y el dato «${b.sup.replace(/\.$/, '')}», ¿qué se puede concluir con seguridad?`,
          dibujo: fig({ marcas: { c: 'o' } }),
          pasos: [
            { tipo: 'pide', texto: 'Piden qué se concluye con seguridad uniendo la regla y el dato. Puede que la respuesta sea «no se sabe».' },
            { tipo: 'datos', texto: `La condición es «${b.a.replace(/,$/, '')}»; el resultado, «${b.b.replace(/\.$/, '')}». El dato habla ${sobre} y dice ${dice}.`,
              ecuacion: [cond('condición'), ' → ', sigue('resultado')] },
            { tipo: 'regla', texto: 'Si ocurre la condición, el resultado es seguro; si no ocurre el resultado, la condición tampoco. Los otros dos casos quedan sin decidir.',
              ecuacion: [cond('A'), ' → ', sigue('B'), '   ·   ', cae('no B'), ' → ', cae('no A')] },
            { tipo: 'aplica', texto: b.aplica,
              dibujo: fig({ marcas: Object.assign({ c: 'o' }, c.marcas), sellos: { n: { t: c.c === 'i' ? 'Seguro' : 'No se sabe', c: c.c } }, nuevo: ['a', 'b', 'n'] }) },
            { tipo: 'sentido', texto: descarta(b.m) },
          ],
          respuesta: b.ok,
        };
      },
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
  const ESTADO_TXT = { i: 'sigue en pie', d: 'queda en duda', h: 'se cae' };
  const CORTO_TXT = { i: 'sigue', d: 'en duda', h: 'se cae' };   // para el sello, que comparte renglón con el título
  const FN_ESTADO = { i: sigue, d: duda, h: cae };
  // Por qué cada oración queda como queda (lo lee la lectura en vivo al soltar el marcador).
  const POR = { i: 'no depende del cambio', d: 'su causa se fue', h: 'el cambio la niega' };
  const figMundo = k => ({ secciones: [{ id: 'o', titulo: 'Texto', modo: 'lista', fragmentos: ESC.map((t, j) => ({ id: `o${j + 1}`, t })) }, tarjeta('n', 'Mundo posible: si…', [['c', MUNDO[k].t]])] });
  const mundos = {
    id: 'mundos-posibles',
    titulo: 'Qué queda en otro mundo',
    temas: ['Mundos posibles'],
    pieza: 'rv-texto',
    // Lee (fase 2): qué es un mundo posible y qué colores mirar, sin decir cómo queda una oración sin su causa (Predice).
    lee: {
      tarjetas: [
        { titulo: 'Imaginar un cambio', texto: '¿Cómo sería Puno si el lago no existiera? Una pregunta así pide imaginar un mundo posible: una situación en la que cambia una sola cosa y lo demás se deja como está.' },
        { titulo: 'Oración por oración', texto: 'Después del cambio, no se juzga el texto entero de golpe. Se revisa cada oración por separado, porque cada una se apoya en cosas distintas.' },
        { titulo: 'Qué mirar al jugar', texto: 'El texto del juego habla de una escuela lejana. Elige un mundo, pasa el círculo turquesa por cada oración y fíjate en su subrayado: turquesa, verde o rojo.' },
      ],
    },
    juega: {
      consigna: 'Imagina un mundo donde cambia una sola cosa. Pasa el círculo turquesa por cada oración: ¿sigue, queda en duda o se cae?',
      voz: 'Cambia una cosa y revisa cada oración.',
      controles: [
        { id: 'k', etiqueta: 'Mundo', opciones: [{ valor: 'real', texto: 'el de hoy' }, { valor: 'bus', texto: 'con bus' }, { valor: 'cerca', texto: 'escuela cerca' }] },
        { id: 'f', etiqueta: 'Oración', opciones: ['o1', 'o2', 'o3', 'o4'].map((v, j) => ({ valor: v, texto: `${j + 1}` })), inicio: 'o2' },
      ],
      dibujo: val => ({ datos: figMundo(val.k), estado: { marcas: Object.assign({ c: 'o' }, MUNDO[val.k].marcas), nuevo: [val.f] } }),
      lectura: val => { const e = MUNDO[val.k].marcas[val.f]; return [FN_ESTADO[e](`La ${val.f.slice(1)} ${ESTADO_TXT[e]}`), `: ${POR[e]}`]; },
      minimo: 3,
      arrastres: [marcador(val => figMundo(val.k), ['o1', 'o2', 'o3', 'o4'], 'f', 'círculo de la oración')],
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
        { estado: { marcas: { c: 'o', o1: 'i', o4: 'i' } }, texto: 'Con bus, la distancia y el desayuno no cambian: siguen.', ecuacion: [sigue('5 km'), '   ·   ', sigue('desayuno')] },
        { estado: { marcas: { c: 'o', o1: 'i', o4: 'i', o2: 'h' }, nuevo: ['o2'] }, texto: 'La caminata de una hora se cae: irían en bus.', ecuacion: [cae('caminan una hora')] },
        { estado: { marcas: MUNDO.bus.marcas, nuevo: ['o3'] }, texto: 'El cansancio queda en duda: su causa se fue, pero podría haber otra.', ecuacion: [duda('llegan cansados'), ' = no se sabe'] },
      ],
    },
    regla: {
      texto: 'En un mundo posible se cambia una condición y se revisa cada afirmación: unas siguen en pie, otras se caen y otras quedan sin respaldo, sin volverse falsas.',
      ecuacion: [{ llave: [cond('cambio')], nota: 'una sola cosa', color: 'c-o' }, ' → ', sigue('sigue'), ' | ', duda('en duda'), ' | ', cae('se cae')],
      condicion: 'se cambia solo lo que dice el supuesto; lo que no depende de él queda igual.',
    },
    // Así se resuelve (fase 2): el mismo tipo de «Ahora tú» (cómo queda una oración en un mundo posible), con un banco
    // propio. marcas: cómo queda cada oración (i sigue · d en duda · h se cae), con los colores y nombres de la idea.
    resuelve: {
      generar(s) {
        const RES = [
          { o: ['La carretera a Moho se asfaltó el año pasado.', 'Por eso, el viaje desde Juliaca dura menos.', 'En Moho se cultivan muchas flores.'], sup: 'la carretera no se hubiera asfaltado', pide: 2,
            marcas: { o1: 'h', o2: 'd', o3: 'i' }, ok: 'Quedaría sin su causa: no se sabe', m: [['Sería falsa: el viaje duraría más seguro', 'RVX2', 'Sin esa causa, no se garantiza lo contrario: podría haber otra.'], ['Seguiría igual de cierta', 'RV63', 'El texto da como causa el asfaltado.'], ['Ya no habría flores en Moho', 'RV12', 'Las flores no dependen de la carretera.']],
            aplica: 'La 2 empieza con «por eso»: se apoya en la 1, que el cambio niega. Pierde su causa, pero no se vuelve falsa.' },
          { o: ['El colegio compró una impresora nueva.', 'Ahora los exámenes se imprimen allí mismo.', 'La directora llega a las siete.'], sup: 'el colegio no hubiera comprado la impresora', pide: 3,
            marcas: { o1: 'h', o2: 'd', o3: 'i' }, ok: 'Seguiría en pie: no depende de la impresora', m: [['Quedaría en duda, como la 2', 'RV12', 'La hora de la directora no depende de la impresora.'], ['Se caería', 'RV12', 'El cambio no dice nada de su horario.'], ['No se puede decir nada', 'RV34', 'Sí: esa oración no depende del cambio.']],
            aplica: 'El cambio niega la 1 y deja a la 2 sin su causa. La 3, la hora de llegada de la directora, no se apoya en ninguna de ellas.' },
          { o: ['El club de lectura se reúne en la biblioteca municipal.', 'La biblioteca cierra los lunes.', 'Por eso, el club no se reúne los lunes.'], sup: 'la biblioteca abriera también los lunes', pide: 2,
            marcas: { o1: 'i', o2: 'h', o3: 'd' }, ok: 'Se caería: el cambio dice lo contrario', m: [['Solo quedaría en duda', 'RV34', 'No hay duda: el cambio dice justo lo contrario de la 2.'], ['Seguiría en pie', 'RV63', 'Si abre los lunes, ya no es cierto que cierre.'], ['Se caería la oración 1', 'RV12', 'El lugar de reunión no depende del horario.']],
            aplica: 'La 2 dice «cierra los lunes» y el cambio dice «abre los lunes». No pueden ser ciertas a la vez: la 2 se cae.' },
          { o: ['Rosa vende api en la plaza cada mañana.', 'Este invierno hizo mucho frío.', 'Por eso, vendió más api que en verano.'], sup: 'este invierno no hubiera hecho frío', pide: 1,
            marcas: { o1: 'i', o2: 'h', o3: 'd' }, ok: 'Seguiría en pie: no depende del frío', m: [['Se caería: sin frío no vendería', 'RVX2', 'El texto no ata su venta de cada mañana al frío.'], ['Quedaría en duda, como la 3', 'RV12', 'Vender cada mañana no depende del invierno.'], ['No se puede decir nada', 'RV34', 'Sí: esa oración no depende del cambio.']],
            aplica: 'La 1 dice que Rosa vende cada mañana, haga frío o no. El cambio toca la 2 y, por ella, la 3; la 1 queda igual.' },
        ];
        const b = elige(RES, s), e = b.marcas[`o${b.pide}`];
        const fig = (estado) => ({ datos: { secciones: [{ id: 'o', titulo: 'Texto', modo: 'lista', fragmentos: b.o.map((t, j) => ({ id: `o${j + 1}`, t })) }] }, estado });
        return {
          enunciado: `Si ${b.sup}, ¿qué pasaría con la oración ${b.pide}?`,
          dibujo: fig({ marcas: { [`o${b.pide}`]: 'o' } }),
          pasos: [
            { tipo: 'pide', texto: `Piden cómo queda la oración ${b.pide} en ese mundo posible: si sigue en pie, queda en duda o se cae.` },
            { tipo: 'datos', texto: `Lo único que se supone distinto: «si ${b.sup}». Todo lo demás del texto se deja como está.`, ecuacion: [cond('cambio'), ': una sola cosa'] },
            { tipo: 'regla', texto: 'Pregunto de qué depende la oración. Si el cambio la contradice, se cae; si le quita su causa, queda en duda; si no la toca, sigue.',
              ecuacion: [sigue('sigue'), ' | ', duda('en duda'), ' | ', cae('se cae')] },
            { tipo: 'aplica', texto: b.aplica, ecuacion: [FN_ESTADO[e](`oración ${b.pide}`), ` ${ESTADO_TXT[e]}`],
              dibujo: fig({ marcas: b.marcas, nuevo: Object.keys(b.marcas) }) },
            { tipo: 'sentido', texto: descarta(b.m) },
          ],
          respuesta: b.ok,
        };
      },
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

  // ---------- Laboratorio: varios cambios a la vez sobre el texto de la escuela ----------
  // Lo que la idea 3 no deja: juntar cambios. Cada oración depende de algo; el código decide su casilla:
  //   se cae si un cambio la niega; queda en duda si se cae la oración que era su causa; si no, sigue en pie.
  const ESC2 = [
    { t: 'La escuela queda a cinco kilómetros.', niega: v => v.cerca === 'si' },
    { t: 'Los alumnos caminan una hora para llegar.', niega: v => v.cerca === 'si' || v.bus === 'si' },
    { t: 'Por eso, llegan cansados a la primera clase.', causa: 1 },
    { t: 'El comedor les da desayuno.', niega: v => v.comedor === 'no' },
  ];
  const casillaEsc = v => {
    const out = [];
    ESC2.forEach((o, j) => { out[j] = o.niega && o.niega(v) ? 'h' : o.causa !== undefined && out[o.causa] === 'h' ? 'd' : 'i'; });
    return out;
  };
  const cambiosEsc = v => [v.bus === 'si' && 'con bus', v.cerca === 'si' && 'escuela cerca', v.comedor === 'no' && 'sin comedor'].filter(Boolean);
  const figEsc = v => ({ secciones: [
    { id: 'o', titulo: 'Texto', modo: 'lista', fragmentos: ESC2.map((o, j) => ({ id: `o${j + 1}`, t: o.t })) },
    tarjeta('n', 'Mundo posible: si…', [['c', cambiosEsc(v).length ? cambiosEsc(v).join(', ') : 'nada cambiara']]),
  ] });
  const SINO = [{ valor: 'no', texto: 'no' }, { valor: 'si', texto: 'sí' }];
  const mesaMundos = {
    id: 'varios-cambios', titulo: 'Varios cambios a la vez', pieza: 'rv-texto',
    consigna: 'Junta cambios: bus, escuela cerca, sin comedor. Pasa el círculo turquesa por cada oración y mira qué queda en pie.',
    voz: 'Cada oración depende de algo distinto.',
    controles: [
      { id: 'bus', etiqueta: 'Bus escolar', opciones: SINO },
      { id: 'cerca', etiqueta: 'Escuela cerca', opciones: SINO },
      { id: 'comedor', etiqueta: 'Comedor', opciones: SINO, inicio: 'si' },
      { id: 'f', etiqueta: 'Oración', opciones: ['o1', 'o2', 'o3', 'o4'].map((v, j) => ({ valor: v, texto: `${j + 1}` })) },
    ],
    // El sello del mundo dice qué pasa con la oración marcada: así el caso guardado se entiende solo.
    dibujo: val => {
      const c = casillaEsc(val), e = c[+val.f.slice(1) - 1];
      return { datos: figEsc(val), estado: { marcas: Object.assign({ c: 'o' }, Object.fromEntries(c.map((x, j) => [`o${j + 1}`, x]))), sellos: { n: { t: `La ${val.f.slice(1)} ${CORTO_TXT[e]}`, c: e } }, nuevo: [val.f] } };
    },
    lectura: val => {
      const c = casillaEsc(val), n = e => c.filter(x => x === e).length, pl = (k, uno, varios) => `${k} ${k === 1 ? uno : varios}`;
      return [sigue(pl(n('i'), 'sigue', 'siguen')), '   ·   ', duda(`${n('d')} en duda`), '   ·   ', cae(pl(n('h'), 'se cae', 'se caen'))];
    },
    arrastres: [marcador(val => figEsc(val), ['o1', 'o2', 'o3', 'o4'], 'f', 'círculo de la oración')],
    // Retos: logrado usa casillaEsc y cambiosEsc, las mismas funciones que marcan cada oración y el mundo.
    invitaciones: [
      { texto: 'Arma un mundo en el que se caigan tres oraciones a la vez.',
        logrado: val => casillaEsc(val).filter(x => x === 'h').length === 3,
        bien: 'Tres caen, pero la 3 solo queda en duda. ¿Por qué no cae?' },
      { texto: 'Deja en duda la oración 3 cambiando una sola cosa.',
        logrado: val => casillaEsc(val)[2] === 'd' && cambiosEsc(val).length === 1,
        bien: 'Se fue su causa, no su verdad: podría haber otra razón del cansancio.' },
      { texto: 'Cambia algo sin que ninguna oración quede en duda.',
        logrado: val => cambiosEsc(val).length >= 1 && !casillaEsc(val).includes('d'),
        bien: 'Ese cambio toca una oración de la que no depende ninguna otra.' },
      { texto: 'Guarda dos mundos distintos que dejen igual cada oración.',
        logrado: (val, guardados) => guardados.some(g => cambiosEsc(g).join() !== cambiosEsc(val).join()
          && casillaEsc(g).join() === casillaEsc(val).join()),
        bien: 'Dos supuestos distintos, el mismo resultado. Revisa cuál de los cambios decide.' },
    ],
  };

  return {
    unidad: 'razonamiento-verbal.extrapolacion',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rv-texto.js'],
    historia: {
      texto: 'En 1748, Hume se preguntó qué nos permite pasar de lo que ya vimos a lo que todavía no vemos. Que algo haya pasado muchas veces no prueba que deba volver a pasar. Por eso, al llevar una conclusión a otro caso, hay que decir qué supuestos se mantienen y qué cambia.',
      pregunta: '¿Lo que pasó cien veces pasará la vez ciento uno?',
      fuente: { titulo: 'Matriz de teoría de razonamiento verbal (Hume, 1748)', url: 'https://openstax.org/books/contemporary-mathematics/pages/2-7-logical-arguments' },
    },
    glosario: [
      { termino: 'extrapolación', def: 'Llevar lo que dice un texto a un caso que no trata: otro lugar, tiempo o grupo.',
        formas: ['extrapolación', 'extrapolaciones', 'extrapolar'], ejemplo: 'Si la totora crece en agua tranquila, ¿crecerá en un río correntoso?', ver: ['caso nuevo', 'condición'] },
      { termino: 'caso nuevo', def: 'Situación de la que el texto no habla y a la que se quiere aplicar lo que dice.',
        formas: ['caso nuevo', 'casos nuevos'], ver: ['extrapolación'] },
      { termino: 'condición', def: 'Lo que tiene que cumplirse para que algo ocurra o para que una relación valga.',
        formas: ['condición', 'condiciones'], ejemplo: 'La totora pide dos: agua poco profunda y tranquila.', ver: ['condicional'] },
      { termino: 'condicional', def: 'Oración de la forma «si A, entonces B»: une un requisito con un resultado.',
        formas: ['condicional', 'condicionales'], ejemplo: 'Si el río crece, cierran el puente; sin crecida, no se sabe.', ver: ['condición', 'solo si'] },
      { termino: 'solo si', def: 'Marca que el requisito es la única vía: sin él, el resultado no ocurre.',
        ejemplo: '«Cierran el puente solo si el río crece»: sin crecida, no cierran.', ver: ['condicional'] },
      { termino: 'subjuntivo', def: 'Forma del verbo para lo supuesto o deseado, como «hubiera» o «quedara».',
        ejemplo: 'Si hubiera un bus escolar, no caminarían una hora.', ver: ['mundo posible'] },
      { termino: 'mundo posible', def: 'Situación imaginada en la que cambia algo y se revisa qué afirmaciones siguen en pie.',
        formas: ['mundo posible', 'mundos posibles'], ejemplo: 'Con la escuela a una cuadra, la caminata de una hora se cae.', ver: ['subjuntivo'] },
    ],
    laboratorio: [
      mesaMundos,
      Object.assign({
        id: 'condicional', titulo: 'Si el río crece', pieza: 'rv-texto',
        // Retos: logrado lee SUP y SUPUESTO, lo mismo que pone el sello «Seguro» o «No se sabe».
        invitaciones: [
          { texto: 'Niega la condición de la regla: supón que el río no crece.',
            logrado: val => SUPUESTO[val.parte][val.ocurre] === 'nocrece',
            bien: 'Sin crecida, el puente queda sin decidir. Podrían cerrarlo por obras.' },
          { texto: 'Busca otro supuesto, además de la crecida, que sí dé algo seguro.',
            logrado: val => SUPUESTO[val.parte][val.ocurre] !== 'crece' && SUP[SUPUESTO[val.parte][val.ocurre]].c === 'i',
            bien: 'Puente abierto: el río no creció. Negar el resultado sí decide.' },
          { texto: 'Guarda dos supuestos sobre el puente: uno seguro y otro que no se sabe.',
            logrado: (val, guardados) => val.parte === 'b' && guardados.some(g => g.parte === 'b'
              && SUP[SUPUESTO.b[g.ocurre]].c !== SUP[SUPUESTO.b[val.ocurre]].c),
            bien: 'Cerrado no dice por qué; abierto sí descarta la crecida.' },
        ],
      }, condicional.juega),
      Object.assign({
        id: 'caso-nuevo', titulo: 'Totora en otro lugar', pieza: 'rv-texto',
        // Retos: logrado lee CASOS, lo mismo que marca si cada condición se cumple en el caso nuevo.
        invitaciones: [
          { texto: 'Busca un caso nuevo al que no se pueda llevar lo que dice el texto.',
            logrado: val => !(CASOS[val.k].p && CASOS[val.k].q),
            bien: 'Basta que falle una condición para que la relación no viaje.' },
          { texto: 'En el río, deja el círculo en la condición que falla.',
            logrado: val => val.k === 'rio' && !CASOS[val.k][val.f],
            bien: 'Es poco profundo, pero correntoso: la otra condición no alcanza.' },
          { texto: 'Guarda dos casos que fallen por condiciones distintas.',
            logrado: (val, guardados) => !CASOS[val.k][val.f]
              && guardados.some(g => g.k !== val.k && g.f !== val.f && !CASOS[g.k][g.f]),
            bien: 'Las dos condiciones pesan: cada una, sola, puede cerrar el paso.' },
        ],
      }, llevar.juega),
    ],
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea). Una lista vacía:
    // la mesa no practica ninguna idea de la unidad y va en «Más mesas del tema».
    laboratorioIdeas: {
      'varios-cambios': ['mundos-posibles'],
      'condicional': ['condicional'],
      'caso-nuevo': ['caso-nuevo'],
    },
    ideas: [llevar, condicional, mundos],
  };
});
