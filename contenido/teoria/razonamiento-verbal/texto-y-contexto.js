/*
 * Teoría de «Texto y contexto» (razonamiento-verbal.texto-y-contexto). Molde: docs/teoria.md. Contenido: matriz de
 * verbal (unidad 16), historia (Boas, Sapir, Firth; actos de habla) y códigos RV49–RV51. Mensajes propios (regla 5).
 * Ruta A · Argumentar: se cambia la tarjeta de contexto y se ve qué cambia en el sentido del mismo mensaje.
 * Regla 1: las fechas que resuelve «mañana» se calculan aquí a partir de la fecha del mensaje.
 *
 * Ficha de tarea:
 *   Promesa: resolver un mensaje con su situación (quién, a quién, cuándo, dónde, para qué) sin inventarla.
 *   Persona y condiciones: postulante de 3.º a 5.º, celular, sin audio; texto y contexto (UNI 16, UNMSM 18).
 *   Resultado observable: explica qué cambia al modificar emisor o destinatario y qué contenido permanece.
 *   Orden de atención: 1.º el mensaje · 2.º la tarjeta de contexto · 3.º lo que resuelve (lectura) · acción: cambiarla.
 *   Estados: resuelto con el contexto · indeterminado (sin dato) · lectura inventada.
 *   Duda que resuelve: si leo hoy un mensaje que dice «mañana», ¿mañana es el día siguiente a hoy?
 *
 * Colores (regla 4): el dato del contexto i (turquesa, continuo), la palabra que depende del contexto o (naranja,
 * discontinuo), lo que se resuelve d (verde, punteado), lo inventado o indeterminado h (rojo).
 * Códigos: RV49 (sin la situación), RV50 (emisor o destinatario confundido con alguien mencionado), RV51
 * (destinatario por el tema); RVK1 (momento de lectura tomado por momento del enunciado) es hipótesis nueva.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  // Gesto directo (docs/teoria.md §4b): el alumno arrastra el marcador por las palabras del mensaje y lo suelta en la
  // que quiere resolver (rv-texto.ancla pone la manija; rv-texto.cercana elige la palabra más cercana al dedo).
  const RV = () => Kit.piezas['rv-texto'];
  const marcador = (datosDe, ids, ctrl, etiqueta) => ({
    id: 'palabra', etiqueta, color: 'c-o',
    donde: val => RV().ancla(datosDe(val), val[ctrl]),
    mover: (pt, val) => ({ [ctrl]: RV().cercana(datosDe(val), pt, ids) }),
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
  const ctx = t => ({ v: 'c-i', t }), deic = t => ({ v: 'c-o', t }), res = t => ({ v: 'c-d', t }), inv = t => ({ v: 'c-h', t });
  const opciones = (c, malas) => [{ id: 'c', texto: c, correcta: true }, ...malas.map(([texto, error, siFuera], k) => ({ id: `e${k}`, texto, error, siFuera }))];
  const voltear = (arr, s) => (s % 2 ? arr.slice().reverse() : arr.slice());
  // Azar con semilla (el mismo de aritmetica/razones-y-proporciones.js): «Así se resuelve» elige con azar(s + 900).
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    return r;
  }
  // Se descarta la primera salida de azar: con semillas vecinas varía poco y repetiría casi siempre el mismo ítem.
  const elegir = (xs, s) => { const r = azar(s + 900); r(); return xs[Math.floor(r() * xs.length)]; };
  const minus = t => t.charAt(0).toLowerCase() + t.slice(1);
  const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'setiembre', 'octubre', 'noviembre', 'diciembre'];
  const DIAS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  // El día siguiente a (d, m), calculado (año no bisiesto).
  const siguiente = (d, m) => (d < DIAS[m] ? [d + 1, m] : [1, (m + 1) % 12]);
  const fecha = (d, m) => `${d} de ${MESES[m]}`;
  // Los sellos van en la sección de abajo (c): arriba a la derecha los taparía el botón de la lupa.
  const figura = (msg, contexto, tituloC = 'Contexto') => ({ secciones: [
    { id: 'm', titulo: 'Mensaje', modo: 'tarjeta', fragmentos: msg.map(([id, t]) => ({ id, t })) },
    { id: 'c', titulo: tituloC, modo: 'lista', fragmentos: contexto.map(([id, t]) => ({ id, t })) },
  ] });

  // ---------- Idea 1: aquí, mañana y nosotros dependen de la situación ----------
  // Cambia: la tarjeta de contexto (quién escribe, cuándo y dónde). Permanece: el mensaje. Progresa: qué resuelve
  // cada dato. Se reserva: leer el mensaje días después (predicción). Debe verse: «mañana» resuelto con la fecha
  // del mensaje, no con la del lector.
  const MSG = [['n', 'Nosotros'], ['a', 'entregamos el trabajo'], ['m', 'mañana'], ['b', 'en'], ['q', 'esta oficina.']];
  const CTX = {
    a: { quien: 'El grupo 3 de 5.° B', d: 14, mes: 4, donde: 'La dirección del colegio' },
    b: { quien: 'La brigada de limpieza', d: 30, mes: 5, donde: 'El municipio' },
    c: { quien: 'no se sabe', d: null, mes: null, donde: 'no se sabe' },
  };
  const filas = k => { const c = CTX[k]; return [['q1', `Escribe: ${c.quien}`], ['q2', c.d ? `Fecha del mensaje: ${fecha(c.d, c.mes)}` : 'Fecha: no se sabe'], ['q3', `Lugar: ${c.donde}`]]; };
  const manana = k => { const c = CTX[k]; if (!c.d) return null; const [d, m] = siguiente(c.d, c.mes); return fecha(d, m); };
  const estDeic = k => ({ marcas: { n: 'o', m: 'o', q: 'o', q1: CTX[k].d ? 'i' : 'h', q2: CTX[k].d ? 'i' : 'h', q3: CTX[k].d ? 'i' : 'h' }, sellos: { c: CTX[k].d ? { t: `mañana = ${manana(k)}`, c: 'd' } : { t: 'Sin contexto', c: 'h' } } });
  // La palabra que el alumno señala (n, m o q) y el dato del contexto que la resuelve (q1, q2 o q3).
  // `de` da el referente completo (lectura); `breve`, el que cabe en el sello de la tarjeta.
  const BREVE = { a: { n: 'el grupo 3', q: 'la dirección' }, b: { n: 'la brigada', q: 'el municipio' } };
  const PALABRA = { n: { t: 'nosotros', fila: 'q1', de: k => CTX[k].quien, breve: k => BREVE[k].n }, m: { t: 'mañana', fila: 'q2', de: k => manana(k), breve: k => manana(k) }, q: { t: 'esta oficina', fila: 'q3', de: k => CTX[k].donde, breve: k => BREVE[k].q } };
  const resuelta = (k, w) => (CTX[k].d ? PALABRA[w].de(k) : null);
  function estPalabra(k, w) {
    const P = PALABRA[w], r = resuelta(k, w);
    return { marcas: { [w]: 'o', [P.fila]: r ? 'i' : 'h' }, sellos: { c: { t: r ? `${P.t} = ${P.breve(k)}` : 'Sin contexto', c: r ? 'd' : 'h' } }, nuevo: ['c'] };
  }
  const deicticos = {
    id: 'deicticos',
    titulo: 'Aquí, mañana y nosotros',
    temas: ['Situación comunicativa'],
    pieza: 'rv-texto',
    // Lee (fase 2): qué es un deíctico y qué mirar; no dice desde qué día se cuenta «mañana» (eso es la predicción).
    lee: {
      tarjetas: [
        { titulo: 'La misma palabra, dos lugares', texto: ['Tu amiga te escribe «estoy ', deic('aquí'), '» desde la plaza de Juliaca, y tu primo te escribe lo mismo desde Lima. La palabra es igual, pero cada «aquí» nombra un lugar distinto.'] },
        { titulo: 'Se llaman deícticos', texto: ['Palabras como ', deic('yo'), ', ', deic('nosotros'), ', ', deic('aquí'), ', ', deic('este'), ' u ', deic('hoy'), ' se llaman deícticos. Solas no dicen de quién, de dónde ni de cuándo hablan: necesitan los datos de la situación.'] },
        { titulo: 'Qué mirar al jugar', texto: ['El mensaje de arriba no cambia. Abajo cambia el ', ctx('contexto'), ': quién escribe, la fecha y el lugar. Elige una palabra y mira qué dato la llena. Prueba también «sin datos».'] },
      ],
    },
    juega: {
      consigna: 'El mensaje no cambia. Cambia el contexto de abajo y mira qué significan «nosotros», «mañana» y «esta oficina».',
      voz: 'Estas palabras se llenan con la situación.',
      controles: [
        { id: 'k', etiqueta: 'Contexto', opciones: [{ valor: 'a', texto: 'A' }, { valor: 'b', texto: 'B' }, { valor: 'c', texto: 'sin datos' }] },
        { id: 'w', etiqueta: 'Palabra', opciones: [{ valor: 'n', texto: 'nosotros' }, { valor: 'm', texto: 'mañana' }, { valor: 'q', texto: 'esta oficina' }], inicio: 'm' },
      ],
      dibujo: val => ({ datos: figura(MSG, filas(val.k)), estado: estPalabra(val.k, val.w) }),
      lectura: val => { const r = resuelta(val.k, val.w); return r ? [deic(PALABRA[val.w].t), ' = ', corto(res, r)] : [inv('Sin contexto'), ': no se sabe']; },
      minimo: 3,
      // Arrastra el marcador por el mensaje: cada palabra señala el dato del contexto que la resuelve.
      arrastres: [marcador(val => figura(MSG, filas(val.k)), ['n', 'm', 'q'], 'w', 'palabra del mensaje')],
    },
    predice: {
      pregunta: 'Lees hoy, 20 de mayo, este aviso. ¿Qué día no hubo clases?',
      voz: '¿Desde qué día se cuenta «mañana»?',
      opciones: opciones(`El ${fecha(...siguiente(14, 4))}`, [
        [`El ${fecha(...siguiente(20, 4))}`, 'RVK1', 'Sería así si el aviso se hubiera escrito hoy; «mañana» se cuenta desde el día del aviso.'],
        ['El 20 de mayo', 'RVK1', 'Es el día en que lo lees, no el día siguiente al aviso.'],
        ['No se puede saber', 'RV34', 'Se puede: el aviso trae su fecha.'],
      ]),
      dibujo: { datos: figura([['a', 'Aviso:'], ['m', 'mañana'], ['b', 'no hay clases.']], [['q2', 'Fecha del aviso: 14 de mayo'], ['q3', 'Lo lees el 20 de mayo']]), estado: { marcas: { m: 'o' } } },
      revelar: { datos: figura([['a', 'Aviso:'], ['m', 'mañana'], ['b', 'no hay clases.']], [['q2', 'Fecha del aviso: 14 de mayo'], ['q3', 'Lo lees el 20 de mayo']]), estado: { marcas: { m: 'o', q2: 'i', q3: 'h' }, sellos: { c: { t: `mañana = ${fecha(...siguiente(14, 4))}`, c: 'd' } } } },
      coincide: `Coincide: «mañana» se cuenta desde el aviso: el ${fecha(...siguiente(14, 4))}.`,
    },
    mira: {
      datos: figura(MSG, filas('a')),
      pasos: [
        { estado: { marcas: { n: 'o', m: 'o', q: 'o' } }, texto: 'Tres palabras dependen de quién, cuándo y dónde se escribió.', ecuacion: [deic('nosotros'), '   ·   ', deic('mañana'), '   ·   ', deic('esta oficina')] },
        { estado: { marcas: { n: 'o', q1: 'i' }, nuevo: ['q1'] }, texto: '«Nosotros» es quien escribe: el grupo 3.', ecuacion: [deic('nosotros'), ' = ', res('grupo 3')] },
        { estado: estDeic('a'), texto: `La fecha del mensaje fija «mañana»: ${manana('a')}.`, ecuacion: [ctx(fecha(14, 4)), ' + 1 día = ', res(manana('a'))] },
      ],
    },
    regla: {
      texto: 'Palabras como aquí, hoy, mañana, este o nosotros se resuelven con la situación en que se escribió el mensaje: quién, a quién, cuándo y dónde. Sin esos datos, quedan indeterminadas.',
      ecuacion: [{ llave: [deic('deíctico'), ' + ', ctx('situación')], nota: 'dan el referente', color: 'c-d' }],
      condicion: 'se usa el momento y el lugar en que se emitió el mensaje, no el momento en que se lee.',
    },
    ahoraTu: {
      generar(s) {
        const B = [
          { m: 'Te espero aquí mañana a las nueve.', c: ['Lo escribe Ana el 3 de junio', 'Lo pega en la puerta de la biblioteca'], d: 3, mes: 5, pide: 'mañana' },
          { m: 'Mañana cerramos por inventario.', c: ['Cartel de la librería Sol', 'Fecha del cartel: 31 de julio'], d: 31, mes: 6, pide: 'mañana' },
          { m: 'Nos vemos mañana en la feria.', c: ['Mensaje de Luis a su primo', 'Enviado el 28 de febrero'], d: 28, mes: 1, pide: 'mañana' },
          { m: 'Mañana empieza la campaña de vacunación.', c: ['Aviso del centro de salud', 'Fecha del aviso: 30 de abril'], d: 30, mes: 3, pide: 'mañana' },
          { m: 'Mañana hay reunión de padres.', c: ['Nota del colegio', 'Fecha de la nota: 15 de setiembre'], d: 15, mes: 8, pide: 'mañana' },
          { m: 'El examen es mañana.', c: ['Mensaje de la profesora', 'Enviado el 30 de noviembre'], d: 30, mes: 10, pide: 'mañana' },
        ];
        const b = B[s % B.length], [d1, m1] = siguiente(b.d, b.mes), lectura = (b.d + 5) % 28 + 1;
        return {
          pregunta: `Lees este mensaje el ${fecha(lectura, (b.mes + 1) % 12)}. ¿Qué día es el «mañana» del mensaje?`,
          dibujo: { datos: figura([['a', b.m]], b.c.map((t, k) => [`q${k + 1}`, t])), estado: {} },
          opciones: opciones(`El ${fecha(d1, m1)}`, [
            [`El ${fecha(...siguiente(lectura, (b.mes + 1) % 12))}`, 'RVK1', 'Cuenta desde el día en que lo lees; «mañana» se cuenta desde el mensaje.'],
            [`El ${fecha(b.d, b.mes)}`, 'RV49', 'Ese es el día en que se escribió, no el siguiente.'],
            ['No se puede saber', 'RV34', 'Se puede: el contexto trae la fecha.'],
          ]),
          solucion: { texto: 'Se cuenta un día desde la fecha en que se escribió.', ecuacion: [ctx(fecha(b.d, b.mes)), ' + 1 día = ', res(fecha(d1, m1))] },
        };
      },
    },
  };
  // Así se resuelve (fase 2): el mismo problema de «Ahora tú» con mensajes propios; las fechas las calcula siguiente().
  const RES_DEIC = [
    { m: 'Mañana sale la combi a Puno a las seis.', c: ['Lo escribe tu tío por WhatsApp', 'Enviado el 31 de agosto'], d: 31, mes: 7 },
    { m: 'Mañana traigan su chompa para el desfile.', c: ['Nota de la tutora de 4.° A', 'Fecha de la nota: 23 de junio'], d: 23, mes: 5 },
    { m: 'Mañana abrimos el puesto desde temprano.', c: ['Cartel de un puesto del mercado', 'Fecha del cartel: 9 de octubre'], d: 9, mes: 9 },
    { m: 'Mañana es la final del campeonato interescolar.', c: ['Publicación del colegio', 'Fecha: 30 de setiembre'], d: 30, mes: 8 },
  ];
  deicticos.resuelve = {
    pieza: 'rv-texto',
    generar(s) {
      const b = elegir(RES_DEIC, s), [d1, m1] = siguiente(b.d, b.mes);
      const lec = [(b.d + 3) % 28 + 1, (b.mes + 1) % 12], trampa = siguiente(...lec);
      const fig = estado => ({ datos: figura([['a', b.m]], b.c.map((t, k) => [`q${k + 1}`, t])), estado });
      const cambiaMes = m1 !== b.mes;
      return {
        enunciado: `Lees este mensaje el ${fecha(...lec)}. ¿Qué día es el «mañana» del mensaje?`,
        dibujo: fig({}),
        pasos: [
          { tipo: 'pide', texto: ['Piden la fecha a la que apunta «', deic('mañana'), '» dentro del mensaje.'] },
          { tipo: 'datos', texto: ['El mensaje se escribió el ', ctx(fecha(b.d, b.mes)), `. Tú lo lees el ${fecha(...lec)}.`], dibujo: fig({ marcas: { q2: 'i' } }) },
          { tipo: 'regla', texto: ['«Mañana» es un deíctico: el día siguiente al momento en que alguien escribió, no al momento en que yo leo.'] },
          { tipo: 'aplica', texto: cambiaMes ? [`El ${b.d} es el último día de ${MESES[b.mes]}, así que un día después ya es el `, res(fecha(d1, m1)), '.'] : ['Un día después del ', ctx(fecha(b.d, b.mes)), ' es el ', res(fecha(d1, m1)), '.'],
            ecuacion: [ctx(fecha(b.d, b.mes)), ' + 1 día = ', res(fecha(d1, m1))],
            dibujo: fig({ marcas: { a: 'o', q2: 'i' }, sellos: { c: { t: `mañana = ${fecha(d1, m1)}`, c: 'd' } }, nuevo: ['c'] }) },
          { tipo: 'sentido', texto: [`No es el ${fecha(...trampa)}: ese sería «mañana» si el mensaje se hubiera escrito el día en que lo lees.`] },
        ],
        respuesta: ['El ', res(fecha(d1, m1))],
      };
    },
  };

  // ---------- Idea 2: emisor y destinatario ----------
  // Cambia: el destinatario. Permanece: el pedido (cambiar la fecha de una exposición). Progresa: las marcas del
  // trato (usted o tú, saludo, registro). Se reserva: identificar al destinatario de otro mensaje (predicción).
  // Debe verse: las marcas que dicen a quién se habla, separadas de las personas que solo se mencionan.
  const VERS = {
    directora: { frs: [['s', 'Estimada directora:'], ['p', 'le pido, por favor,'], ['x', 'cambiar la fecha de nuestra exposición.'], ['f', 'Atentamente, Lucía.']], marcas: { s: 'i', p: 'i', f: 'i' }, rel: 'Formal: trato de usted' },
    amiga: { frs: [['s', '¡Hola, Caro!'], ['p', '¿Me ayudas a pedir que'], ['x', 'cambien la fecha de nuestra exposición?'], ['f', 'Lu.']], marcas: { s: 'i', p: 'i', f: 'i' }, rel: 'Informal: trato de tú, cercano' },
    grupo: { frs: [['s', 'Chicos del grupo:'], ['p', 'propongo que pidamos'], ['x', 'cambiar la fecha de nuestra exposición.'], ['f', 'Lucía']], marcas: { s: 'i', p: 'i' }, rel: 'Entre iguales: «pidamos», nosotros' },
  };
  // Lo que dice cada parte del mensaje que el alumno señala (s saludo, p pedido, x contenido, f despedida).
  const PARTE = {
    directora: { s: ['Saludo', ': distancia formal'], p: ['«Le pido»', ': trato de usted'], f: ['Despedida', ' formal'] },
    amiga: { s: ['Saludo', ' cercano, con su nombre'], p: ['«¿Me ayudas?»', ': trato de tú'], f: ['Firma', ' con apodo'] },
    grupo: { s: ['Saludo', ' a varios'], p: ['«Pidamos»', ': nosotros'], f: ['Firma', ' solo con el nombre'] },
  };
  const figDest = k => ({ secciones: [{ id: 'm', titulo: 'Mensaje', modo: 'tarjeta', fragmentos: VERS[k].frs.map(([id, t]) => ({ id, t })) }, { id: 'c', titulo: 'Trato', modo: 'tarjeta', fragmentos: [] }] });
  const emisorDest = {
    id: 'emisor-destinatario',
    titulo: 'Quién habla y a quién',
    temas: ['Relación entre emisor y destinatario'],
    pieza: 'rv-texto',
    // Lee (fase 2): emisor, destinatario, trato y registro; no dice cómo separar a quien se habla de quien se nombra.
    lee: {
      tarjetas: [
        { titulo: 'Quién y a quién', texto: 'Todo mensaje tiene un emisor, quien lo escribe, y un destinatario, la persona o el grupo al que se dirige. Una nota en la puerta del aula, un audio de tu mamá o un oficio del municipio tienen los dos.' },
        { titulo: 'Usted o tú', texto: ['No le escribes igual a la directora que a tu mejor amiga. A una la tratas de ', ctx('usted'), ' y la saludas con «estimada»; a la otra, de ', ctx('tú'), ' y con su apodo. Ese grado de formalidad es el registro.'] },
        { titulo: 'Qué mirar al jugar', texto: ['Lucía pide siempre lo mismo. Cambia a quién le escribe y pasa el círculo naranja por el saludo, el pedido, el ', res('contenido'), ' y la firma. Fíjate qué cambia y qué se queda igual.'] },
      ],
    },
    juega: {
      consigna: 'Lucía pide lo mismo a tres personas distintas. Cambia el destinatario y mira qué marcas cambian en el mensaje.',
      voz: 'Lo que pide es igual; cambia cómo se dirige.',
      controles: [
        { id: 'k', etiqueta: 'Destinatario', opciones: [{ valor: 'directora', texto: 'directora' }, { valor: 'amiga', texto: 'amiga' }, { valor: 'grupo', texto: 'su grupo' }] },
        { id: 'p', etiqueta: 'Parte', opciones: [{ valor: 's', texto: 'saludo' }, { valor: 'p', texto: 'pedido' }, { valor: 'x', texto: 'contenido' }, { valor: 'f', texto: 'firma' }] },
      ],
      dibujo: val => ({ datos: figDest(val.k), estado: { marcas: { [val.p]: val.p === 'x' ? 'd' : 'i' }, sellos: { c: { t: val.k === 'directora' ? 'Formal' : val.k === 'amiga' ? 'Cercano' : 'Entre iguales', c: 'o' } } } }),
      lectura: val => (val.p === 'x' ? [res('El pedido'), ': igual en las tres'] : [ctx(PARTE[val.k][val.p][0]), PARTE[val.k][val.p][1]]),
      minimo: 3,
      // Pasa el marcador por el mensaje: cada parte dice algo del trato, menos el pedido, que no cambia.
      arrastres: [marcador(val => figDest(val.k), ['s', 'p', 'x', 'f'], 'p', 'parte del mensaje')],
    },
    predice: {
      pregunta: '¿A quién va dirigido este mensaje?',
      voz: 'Busca las marcas del trato, no los nombres.',
      opciones: opciones('A la señora Rosa, la vecina', [
        ['Al alcalde, porque habla de la pista', 'RV51', 'El tema es municipal, pero el saludo y el «usted» van a la vecina.'],
        ['A los niños que juegan', 'RV50', 'Se menciona a los niños, pero no se les habla a ellos.'],
        ['A todo el barrio', 'RV51', 'El saludo nombra a una persona y la trata de usted.'],
      ]),
      dibujo: { datos: { secciones: [{ id: 'm', titulo: 'Mensaje', modo: 'tarjeta', fragmentos: [{ id: 's', t: 'Señora Rosa:' }, { id: 'p', t: 'usted que conoce al alcalde,' }, { id: 'x', t: '¿podría contarle que los niños juegan en la pista sin luz?' }] }, { id: 'c', titulo: 'Para', modo: 'tarjeta', fragmentos: [] }] }, estado: {} },
      revelar: { datos: { secciones: [{ id: 'm', titulo: 'Mensaje', modo: 'tarjeta', fragmentos: [{ id: 's', t: 'Señora Rosa:' }, { id: 'p', t: 'usted que conoce al alcalde,' }, { id: 'x', t: '¿podría contarle que los niños juegan en la pista sin luz?' }] }, { id: 'c', titulo: 'Para', modo: 'tarjeta', fragmentos: [] }] }, estado: { marcas: { s: 'i', p: 'i', x: 'h' }, sellos: { c: { t: 'La vecina', c: 'i' } } } },
      coincide: 'Coincide: el saludo y el «usted» señalan a la vecina; alcalde y niños solo se mencionan.',
    },
    mira: {
      datos: figDest('directora'),
      pasos: [
        { estado: { marcas: { x: 'd' } }, texto: 'El contenido es el pedido: cambiar la fecha. No depende de a quién.', ecuacion: [res('pedido')] },
        { estado: { marcas: { x: 'd', s: 'i' }, nuevo: ['s'] }, texto: '«Estimada directora» dice a quién se habla y con qué distancia.', ecuacion: [ctx('saludo'), ' → destinatario'] },
        { estado: { marcas: { x: 'd', s: 'i', p: 'i', f: 'i' }, sellos: { c: { t: 'Formal', c: 'o' } }, nuevo: ['p', 'f'] }, texto: '«Le pido» y «atentamente» confirman el trato formal.', ecuacion: [ctx('usted'), ' + ', ctx('atentamente'), ' → formal'] },
      ],
    },
    regla: {
      texto: 'La relación entre emisor y destinatario se lee en las marcas del mensaje: saludo, trato de usted o de tú, registro y despedida. No basta el tema.',
      ecuacion: [{ llave: [ctx('trato')], nota: 'usted o tú', color: 'c-i' }, ' → ', res('a quién')],
      condicion: 'se distingue a quien se le habla de a quien solo se nombra; el contenido puede ser el mismo.',
    },
    ahoraTu: {
      generar(s) {
        const B = [
          { m: 'Querido abuelo: mamá dice que vendrás el domingo. ¡Te esperamos con picarones!', ok: 'Al abuelo', m2: [['A mamá', 'RV50', 'Mamá se menciona, pero el saludo va al abuelo.'], ['A los vecinos', 'RV51', 'No hay marca que los nombre.'], ['A la familia entera', 'RV51', 'El saludo nombra a una persona: el abuelo.']] },
          { m: 'Señor profesor: ¿podría revisar mi nota? Mi compañero Juan tuvo la misma respuesta.', ok: 'Al profesor', m2: [['A Juan', 'RV50', 'Juan solo se menciona como ejemplo.'], ['A la directora', 'RV51', 'El saludo es «señor profesor».'], ['A sus compañeros', 'RV51', 'Trata de usted a una persona: el profesor.']] },
          { m: 'Amigos del club: el sábado jugamos contra el equipo de Puno. ¡No falten!', ok: 'A los miembros del club', m2: [['Al equipo de Puno', 'RV50', 'Se menciona como rival, no se le habla.'], ['Al entrenador', 'RV51', 'Nada lo nombra.'], ['A un solo amigo', 'RV51', '«Amigos» y «no falten» van a varios.']] },
          { m: 'Estimados vecinos: la municipalidad cortará el agua el lunes. Llenen sus baldes.', ok: 'A los vecinos', m2: [['A la municipalidad', 'RV50', 'Se menciona como quien corta el agua.'], ['Al alcalde', 'RV51', 'No se le nombra.'], ['A una sola familia', 'RV51', '«Estimados vecinos» va a muchos.']] },
          { m: 'Rosa: tu hermano dejó su casaca en mi casa. ¿Se la llevas?', ok: 'A Rosa', m2: [['Al hermano de Rosa', 'RV50', 'Se menciona, pero se le habla a Rosa: «tu hermano».'], ['A la mamá de Rosa', 'RV51', 'No se la nombra.'], ['A quien encuentre la casaca', 'RV51', 'El saludo nombra a Rosa.']] },
        ];
        const b = B[s % B.length];
        return {
          pregunta: '¿A quién va dirigido el mensaje?',
          dibujo: { datos: { secciones: [{ id: 'm', titulo: 'Mensaje', modo: 'tarjeta', fragmentos: [{ id: 'a', t: b.m }] }] }, estado: {} },
          opciones: opciones(b.ok, voltear(b.m2, s)),
          solucion: { texto: 'El saludo y el trato dicen a quién se habla; los demás solo se mencionan.', ecuacion: [ctx('saludo + trato'), ' → ', res(b.ok.toLowerCase())] },
        };
      },
    },
  };
  // Así se resuelve (fase 2): mensajes propios con el saludo (s) aparte del resto (x), para marcarlo en «Lo aplico».
  const RES_DEST = [
    { quien: 'Una alumna de 5.° B', s: 'Señora bibliotecaria:', x: 'mi profesor de Historia nos pidió un libro sobre los uros. ¿Podría prestármelo hasta el viernes?', ok: 'A la bibliotecaria', marcas: '«Señora bibliotecaria» y «podría prestármelo»', trato: 'de usted, a una persona', menc: 'al profesor de Historia y a los uros',
      m2: [['Al profesor de Historia', 'RV50', 'Se menciona como quien pidió el libro; no se le habla.'], ['A los uros', 'RV51', 'Son el tema del libro, no el destinatario.'], ['A toda la clase', 'RV51', 'El saludo nombra a una persona y la trata de usted.']] },
    { quien: 'El presidente de la junta vecinal', s: 'Vecinos del jirón Lima:', x: 'el municipio vendrá el martes a arreglar el desagüe. Dejen libre la vereda, por favor.', ok: 'A los vecinos del jirón Lima', marcas: '«Vecinos del jirón Lima» y «dejen»', trato: 'a varias personas a la vez', menc: 'al municipio',
      m2: [['Al municipio', 'RV50', 'Se menciona como quien hará el arreglo; no se le habla.'], ['Al alcalde', 'RV51', 'Nadie lo nombra; el tema es municipal, nada más.'], ['A un solo vecino', 'RV51', '«Dejen» habla a varios.']] },
    { quien: 'Ximena', s: 'Tía Elsa:', x: 'dice mi papá que el sábado llega a Juliaca. ¿Le guardas un plato de chairo?', ok: 'A la tía Elsa', marcas: '«Tía Elsa» y «¿le guardas?»', trato: 'de tú, con cercanía', menc: 'a su papá y el chairo',
      m2: [['Al papá de Ximena', 'RV50', 'Se menciona porque él llega; no se le habla.'], ['A toda la familia', 'RV51', 'El saludo nombra a una sola persona.'], ['A una cocinera', 'RV51', 'Nada la nombra; el chairo es el tema.']] },
    { quien: 'El delegado de 4.° C', s: 'Profesora Carmen:', x: 'los compañeros le pedimos mover la práctica de Química al jueves, porque el miércoles es el desfile.', ok: 'A la profesora Carmen', marcas: '«Profesora Carmen» y «le pedimos»', trato: 'de usted, a una persona', menc: 'a los compañeros y el desfile',
      m2: [['A los compañeros de 4.° C', 'RV50', 'Piden junto al delegado; no se les habla.'], ['A quien organiza el desfile', 'RV51', 'El desfile es el motivo, no el destinatario.'], ['A todos los profesores', 'RV51', 'El saludo nombra a una sola profesora.']] },
  ];
  emisorDest.resuelve = {
    pieza: 'rv-texto',
    generar(s) {
      const b = elegir(RES_DEST, s), [trampa, , porque] = b.m2[0];
      const fig = estado => ({ datos: { secciones: [{ id: 'm', titulo: 'Mensaje', modo: 'tarjeta', fragmentos: [{ id: 's', t: b.s }, { id: 'x', t: b.x }] }, { id: 'c', titulo: 'Para', modo: 'tarjeta', fragmentos: [] }] }, estado });
      return {
        enunciado: `${b.quien} escribe este mensaje. ¿A quién va dirigido?`,
        dibujo: fig({}),
        pasos: [
          { tipo: 'pide', texto: ['Piden el ', res('destinatario'), ': a quién le habla el mensaje, no de quién habla.'] },
          { tipo: 'datos', texto: [`Escribe ${b.quien.replace(/^(Una|El) /, x => x.toLowerCase())}. Además, el mensaje menciona ${b.menc}.`] },
          { tipo: 'regla', texto: ['Para hallar el destinatario miro las marcas del ', ctx('trato'), ': a quién saluda, si usa usted o tú y a quién le pide algo.'] },
          { tipo: 'aplica', texto: [ctx(b.marcas), ` hablan ${b.trato}: el mensaje va ${minus(b.ok)}.`],
            ecuacion: [ctx('saludo + trato'), ' → ', res(minus(b.ok))],
            dibujo: fig({ marcas: { s: 'i' }, sellos: { c: { t: b.ok, c: 'i' } }, nuevo: ['s', 'c'] }) },
          { tipo: 'sentido', texto: [`Descarto «${trampa}»: ${minus(porque)}`] },
        ],
        respuesta: [res(b.ok)],
      };
    },
  };

  // ---------- Idea 3: la misma frase, distinta acción ----------
  // Cambia: la situación. Permanece: la frase «Hace frío aquí». Progresa: lo que hace la frase (pedir, informar,
  // advertir). Se reserva: otra frase en otra situación (predicción). Debe verse: el dato del contexto que decide.
  const FRIO = {
    clase: { c: [['q1', 'Lo dice la profesora'], ['q2', 'mirando la ventana abierta']], accion: 'Pide que cierren la ventana' },
    llamada: { c: [['q1', 'Lo dice tu primo por teléfono'], ['q2', 'desde Juliaca, en julio']], accion: 'Informa cómo está el clima' },
    viaje: { c: [['q1', 'Lo dice tu mamá'], ['q2', 'antes de que salgas a la puna']], accion: 'Te advierte que te abrigues' },
  };
  const figFrio = k => figura([['f', 'Hace frío aquí.']], FRIO[k].c, 'Situación');
  const accion = {
    id: 'misma-frase',
    titulo: 'La misma frase, otra acción',
    temas: ['Contexto y situación'],
    pieza: 'rv-texto',
    // Lee (fase 2): hablar también es hacer; no dice que una pregunta pueda ser un pedido (eso es la predicción).
    lee: {
      tarjetas: [
        { titulo: 'Hablar es hacer', texto: 'Cuando dices «te prometo llegar temprano», no describes nada: prometes. Con palabras también se saluda, se avisa, se agradece o se advierte. A esas acciones que se hacen al hablar se les llama actos de habla.' },
        { titulo: 'Alrededor de la frase', texto: ['En la feria del domingo oyes muchas frases cortas. Para entender qué hace cada una, conviene mirar la ', ctx('situación'), ': quién la dice, a quién, dónde y qué está pasando en ese momento.'] },
        { titulo: 'Qué mirar al jugar', texto: ['La frase «Hace frío aquí» no cambia. Cambia la ', ctx('situación'), ' de abajo y lee el sello ', res('verde'), ': dice qué acción cumple la frase en cada caso.'] },
      ],
    },
    juega: {
      consigna: 'La frase es siempre «Hace frío aquí». Cambia la situación y mira qué hace la frase en cada una.',
      voz: 'Una frase también es una acción: pedir, avisar, informar.',
      controles: [{ id: 'k', etiqueta: 'Situación', opciones: [{ valor: 'clase', texto: 'en clase' }, { valor: 'llamada', texto: 'por teléfono' }, { valor: 'viaje', texto: 'antes de salir' }] }],
      dibujo: val => ({ datos: figFrio(val.k), estado: { marcas: { f: 'o', q1: 'i', q2: 'i' }, sellos: { c: { t: FRIO[val.k].accion.split(' ')[0], c: 'd' } } } }),
      lectura: val => [corto(res, FRIO[val.k].accion)],
      minimo: 3,
    },
    predice: {
      pregunta: 'Un cliente le dice al mozo: «¿Tiene sal?». ¿Qué está haciendo con esa frase?',
      opciones: opciones('Pide que le traigan sal', [
        ['Pregunta si en el local existe sal', 'RV49', 'Literalmente es una pregunta, pero en esa situación es un pedido.'],
        ['Critica la comida por sosa', 'RV33', 'Podría pensarlo, pero la frase no lo dice ni lo muestra.'],
        ['Informa que le gusta la sal', 'RV49', 'No informa nada: pide.'],
      ]),
      dibujo: { datos: figura([['f', '¿Tiene sal?']], [['q1', 'Lo dice un cliente al mozo'], ['q2', 'en un restaurante, con su plato servido']], 'Situación'), estado: { marcas: { f: 'o' } } },
      revelar: { datos: figura([['f', '¿Tiene sal?']], [['q1', 'Lo dice un cliente al mozo'], ['q2', 'en un restaurante, con su plato servido']], 'Situación'), estado: { marcas: { f: 'o', q1: 'i', q2: 'i' }, sellos: { c: { t: 'Pedido', c: 'd' } } } },
      coincide: 'Coincide: con el plato servido y el mozo enfrente, la pregunta funciona como pedido.',
    },
    mira: {
      datos: figFrio('clase'),
      pasos: [
        { estado: { marcas: { f: 'o' } }, texto: 'Literalmente, la frase solo describe el clima.', ecuacion: [deic('hace frío'), ' = describe'] },
        { estado: { marcas: { f: 'o', q1: 'i', q2: 'i' }, nuevo: ['q1', 'q2'] }, texto: 'La profesora, ante la ventana abierta: la frase apunta a la ventana.', ecuacion: [ctx('quién'), ' + ', ctx('qué mira')] },
        { estado: { marcas: { f: 'o', q1: 'i', q2: 'i' }, sellos: { c: { t: 'Pide', c: 'd' } }, nuevo: ['c'] }, texto: 'En esa situación, la frase pide cerrar la ventana.', ecuacion: [deic('frase'), ' + ', ctx('situación'), ' → ', res('pedido')] },
      ],
    },
    regla: {
      texto: 'Una misma frase puede cumplir acciones distintas (pedir, informar, advertir) según la situación. Para saber qué hace, se mira quién la dice, a quién, dónde y ante qué.',
      ecuacion: [{ llave: [deic('frase'), ' + ', ctx('situación')], nota: 'dan la acción', color: 'c-d' }],
      condicion: 'la acción se apoya en datos de la situación dada; sin ellos, no se le atribuye una intención.',
    },
    ahoraTu: {
      generar(s) {
        const B = [
          { f: 'Ya son las once.', c: 'Lo dice la mamá a su hijo que juega en la computadora un día de colegio.', ok: 'Le pide que vaya a dormir', m: [['Le informa la hora', 'RV49', 'Literalmente informa, pero en esa situación pide algo.'], ['Le pregunta qué hora es', 'RV49', 'No es una pregunta.'], ['Lo felicita por jugar', 'RV33', 'Nada en la situación lo indica.']] },
          { f: 'El piso está mojado.', c: 'Cartel en la puerta del baño del mercado.', ok: 'Advierte que tengan cuidado al pisar', m: [['Describe el piso', 'RV49', 'Describe, pero un cartel así advierte.'], ['Pide que trapeen', 'RV33', 'Ya está mojado: avisa, no pide trapear.'], ['Se queja de la limpieza', 'RV33', 'Nada lo indica.']] },
          { f: '¿Me pasas el pan?', c: 'Lo dice un niño a su hermana en el desayuno.', ok: 'Le pide el pan', m: [['Le pregunta si puede', 'RV49', 'Es una pregunta en la forma, pero es un pedido.'], ['Le informa que hay pan', 'RV49', 'No informa.'], ['Le reclama por el pan', 'RV33', 'Nada lo indica.']] },
          { f: 'Mañana hay examen.', c: 'Lo dice el profesor al final de la clase, mirando al grupo.', ok: 'Les avisa para que estudien', m: [['Pregunta si hay examen', 'RV49', 'No es una pregunta.'], ['Critica al grupo', 'RV33', 'Nada lo indica.'], ['Les cuenta lo que hizo', 'RV13', 'No narra: avisa algo que viene.']] },
          { f: 'Se acabó el gas.', c: 'Lo dice el papá desde la cocina a su hijo mayor, con la olla en el fuego.', ok: 'Le pide que vaya por un balón de gas', m: [['Le informa sobre el gas', 'RV49', 'Informa, pero en esa situación es un pedido.'], ['Se queja del precio del gas', 'RV33', 'Nada lo indica.'], ['Le pregunta por el gas', 'RV49', 'No es una pregunta.']] },
        ];
        const b = B[s % B.length];
        return {
          pregunta: 'En esta situación, ¿qué hace la frase?',
          dibujo: { datos: figura([['f', b.f]], [['q1', b.c]], 'Situación'), estado: { marcas: { f: 'o' } } },
          opciones: opciones(b.ok, voltear(b.m, s)),
          solucion: { texto: 'Se lee la frase con quién la dice, a quién y ante qué.', ecuacion: [deic('frase'), ' + ', ctx('situación'), ' → ', res('acción')] },
        };
      },
    },
  };
  // Así se resuelve (fase 2): frases y situaciones propias; `pista` es el dato de la situación que decide la acción.
  const RES_ACCION = [
    { f: 'La puerta está abierta.', c: 'Lo dice la abuela a su nieto que acaba de entrar, mientras sopla un viento helado.', pista: 'el viento helado y el nieto que acaba de entrar', ok: 'Le pide que cierre la puerta', sello: 'Pedido',
      m: [['Le informa cómo está la puerta', 'RV49', 'Literalmente describe, pero ante el viento pide algo.'], ['Le pregunta por la puerta', 'RV49', 'No es una pregunta.'], ['Lo felicita por llegar', 'RV33', 'Nada en la situación lo indica.']] },
    { f: 'Hay perro bravo.', c: 'Letrero colgado en la reja de una chacra, a la entrada del camino.', pista: 'el letrero en la reja de la entrada', ok: 'Advierte que no entren sin cuidado', sello: 'Advertencia',
      m: [['Describe cómo es el perro', 'RV49', 'Describe, pero un letrero en la reja advierte.'], ['Invita a conocer al perro', 'RV33', 'Nada en la situación lo indica.'], ['Pide comida para el perro', 'RV33', 'Nada en la situación lo indica.']] },
    { f: '¿Puedes bajar el volumen?', c: 'Lo dice una vecina a un joven, con la música muy alta a las once de la noche.', pista: 'la música muy alta a las once de la noche', ok: 'Le pide que baje la música', sello: 'Pedido',
      m: [['Le pregunta si es capaz de bajarlo', 'RV49', 'Tiene forma de pregunta, pero a esa hora es un pedido.'], ['Le informa la hora', 'RV49', 'La frase no informa nada.'], ['Lo felicita por su música', 'RV33', 'Nada en la situación lo indica.']] },
    { f: 'El bus sale en cinco minutos.', c: 'Lo dice la profesora a los alumnos que siguen comprando recuerdos en la plaza de Puno.', pista: 'los alumnos que siguen comprando', ok: 'Les avisa que se apuren a subir', sello: 'Aviso',
      m: [['Les informa el horario del bus', 'RV49', 'Informa, pero con los alumnos aún comprando, los apura.'], ['Les pregunta por el bus', 'RV49', 'No es una pregunta.'], ['Critica los recuerdos', 'RV33', 'Nada en la situación lo indica.']] },
  ];
  accion.resuelve = {
    pieza: 'rv-texto',
    generar(s) {
      const b = elegir(RES_ACCION, s), [trampa, , porque] = b.m[0];
      const fig = estado => ({ datos: figura([['f', b.f]], [['q1', b.c]], 'Situación'), estado });
      return {
        enunciado: `En esta situación, ¿qué hace la frase «${b.f.replace(/\.$/, '')}»?`,
        dibujo: fig({ marcas: { f: 'o' } }),
        pasos: [
          { tipo: 'pide', texto: ['Piden la acción que cumple la ', deic('frase'), ' en esa situación: pedir, avisar, advertir o informar.'] },
          { tipo: 'datos', texto: [`La frase es «${b.f.replace(/\.$/, '')}». En la situación pesa `, ctx(b.pista), '.'] },
          { tipo: 'regla', texto: ['Lo que hace una frase no está solo en sus palabras: se lee juntándola con quién la dice, a quién y ante qué.'] },
          { tipo: 'aplica', texto: ['Con ', ctx(b.pista), ', la frase no se queda en describir: ', res(minus(b.ok)), '.'],
            ecuacion: [deic('frase'), ' + ', ctx('situación'), ' → ', res(b.sello.toLowerCase())],
            dibujo: fig({ marcas: { f: 'o', q1: 'i' }, sellos: { c: { t: b.sello, c: 'd' } }, nuevo: ['q1', 'c'] }) },
          { tipo: 'sentido', texto: [`Descarto «${trampa}»: ${minus(porque)}`] },
        ],
        respuesta: [res(b.ok)],
      };
    },
  };

  // ---------- Laboratorio: el calendario del mensaje ----------
  // Más rica que la idea 1: cuatro palabras de tiempo (ayer, hoy, mañana, pasado mañana) y la fecha del mensaje libre,
  // con los fines de mes y de año que la idea no deja probar. Cada fecha la calcula el código (año no bisiesto).
  const antes = (d, m) => (d > 1 ? [d - 1, m] : [DIAS[(m + 11) % 12], (m + 11) % 12]);
  const MESES_LAB = [1, 3, 6, 11];   // febrero, abril, julio y diciembre: fines de mes de 28, 30 y 31 días y fin de año
  const TIEMPO = { ay: { t: 'Ayer', mover: (d, m) => antes(d, m) }, hoy: { t: 'hoy', mover: (d, m) => [d, m] }, man: { t: 'mañana', mover: (d, m) => siguiente(d, m) }, pas: { t: 'pasado mañana', mover: (d, m) => siguiente(...siguiente(d, m)) } };
  const MSG_LAB = [['ay', 'Ayer'], ['a1', 'llegó el pedido;'], ['hoy', 'hoy'], ['a2', 'lo revisamos y'], ['man', 'mañana'], ['a3', 'lo entregamos. Cerramos'], ['pas', 'pasado mañana.']];
  const diaReal = (d, m) => Math.min(d, DIAS[m]);
  const figLab = (d, m) => figura(MSG_LAB, [['q2', `Fecha del mensaje: ${fecha(diaReal(d, m), m)}`]]);
  const mesaCalendario = {
    id: 'calendario', titulo: 'El calendario del mensaje', pieza: 'rv-texto',
    consigna: 'Elige la fecha del mensaje y arrastra el círculo naranja a una palabra de tiempo. Prueba fines de mes y de año.',
    voz: 'Se cuenta desde el día en que se escribió.',
    controles: [
      { id: 'd', etiqueta: 'Día', color: 'c-i', min: 1, max: 31, paso: 1, inicio: 28, decimales: 0 },
      { id: 'mes', etiqueta: 'Mes', opciones: MESES_LAB.map(m => ({ valor: m, texto: MESES[m] })) },
      { id: 'w', etiqueta: 'Palabra', opciones: Object.entries(TIEMPO).map(([valor, x]) => ({ valor, texto: x.t.toLowerCase() })), inicio: 'man' },
    ],
    dibujo: val => {
      const r = TIEMPO[val.w].mover(diaReal(val.d, val.mes), val.mes);
      return { datos: figLab(val.d, val.mes), estado: { marcas: { [val.w]: 'o', q2: 'i' }, sellos: { c: { t: `${TIEMPO[val.w].t.toLowerCase()} = ${fecha(...r)}`, c: 'd' } } } };
    },
    lectura: val => {
      const d = diaReal(val.d, val.mes), r = TIEMPO[val.w].mover(d, val.mes);
      return [ctx(fecha(d, val.mes)), ' → ', deic(TIEMPO[val.w].t.toLowerCase()), ' = ', res(fecha(...r))];
    },
    arrastres: [marcador(val => figLab(val.d, val.mes), Object.keys(TIEMPO), 'w', 'palabra de tiempo')],
    // Invitaciones: cada logrado resuelve la fecha con TIEMPO[w].mover, la misma función que pone el sello.
    invitaciones: [
      { texto: 'Haz que la palabra de tiempo caiga en el año siguiente.',
        logrado: val => { const r = fechaLab(val); return val.mes === 11 && r[1] === 0; },
        bien: 'Diciembre se acaba y la fecha salta a enero. El mensaje fija el punto de partida.' },
      { texto: 'Consigue que «ayer» caiga en el mes anterior al del mensaje.',
        logrado: val => val.w === 'ay' && fechaLab(val)[1] !== val.mes,
        bien: 'El día uno mira hacia atrás y cambia de mes. ¿Cuántos días tenía ese mes?' },
      { texto: 'Busca el día más tardío de abril con «pasado mañana» todavía en abril.',
        logrado: val => val.w === 'pas' && val.mes === 3 && fechaLab(val)[1] === 3
          && TIEMPO.pas.mover(...siguiente(diaReal(val.d, 3), 3))[1] !== 3,
        bien: 'Abril tiene 30 días: desde el 28, dos días más todavía son abril.' },
      { texto: 'Guarda dos mensajes con palabras distintas que señalen el mismo día.',
        logrado: (val, guardados) => guardados.some(g => g.w !== val.w && fecha(...fechaLab(g)) === fecha(...fechaLab(val))),
        bien: 'Dos palabras distintas, un mismo día: lo decide la fecha de cada mensaje.' },
    ],
  };
  // La fecha que resuelve la palabra elegida, desde la fecha del mensaje (la misma cuenta que el sello).
  function fechaLab(val) { return TIEMPO[val.w].mover(diaReal(val.d, val.mes), val.mes); }

  return {
    unidad: 'razonamiento-verbal.texto-y-contexto',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rv-texto.js'],
    historia: {
      texto: 'A comienzos del siglo XX, Boas y Sapir mostraron que conocer una lengua no basta para entender cómo se usa. Después, Firth estudió la situación en que se habla, y otros autores, los actos de habla. El contexto importa, pero tiene que poder justificarse con lo que se sabe: inventarlo no es comprender.',
      pregunta: '¿Qué día es «mañana» en un mensaje viejo?',
      fuente: { titulo: 'Matriz de teoría de razonamiento verbal (contexto discursivo)', url: 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/diccio_ele/diccionario/contextodiscursivo.htm' },
    },
    glosario: [
      { termino: 'emisor', def: 'Quien produce el mensaje: la persona o institución que habla o escribe.',
        ejemplo: 'En «Nosotros entregamos el trabajo», quien escribe es el grupo 3.', ver: ['destinatario', 'mensaje'] },
      { termino: 'destinatario', def: 'La persona o el grupo a quien se dirige el mensaje. No siempre es quien aparece nombrado.',
        formas: ['destinatario', 'destinatarios', 'destinataria'], ejemplo: '«Señora Rosa: usted que conoce al alcalde…» va a la vecina, no al alcalde.', ver: ['emisor', 'trato'] },
      { termino: 'mensaje', def: 'Lo que el que habla comunica a otro con palabras, en una situación concreta.', ver: ['emisor', 'destinatario'] },
      { termino: 'deíctico', def: 'Palabra cuyo significado depende de quién habla, cuándo y dónde: aquí, hoy, mañana, nosotros, este.',
        ejemplo: '«Mañana», en un aviso del 14 de mayo, es el 15 de mayo.', ver: ['situación comunicativa', 'contexto'] },
      { termino: 'situación comunicativa', def: 'Las circunstancias de un mensaje: quién lo emite, a quién, cuándo, dónde y para qué.',
        formas: ['situación comunicativa', 'situación', 'situaciones'], ver: ['deíctico', 'contexto'] },
      { termino: 'indeterminado', def: 'Que no se puede fijar con los datos disponibles: falta información para saber a qué se refiere.',
        formas: ['indeterminado', 'indeterminada', 'indeterminados', 'indeterminadas'], ejemplo: '«Mañana» sin la fecha del mensaje: no se sabe qué día es.', ver: ['deíctico'] },
      { termino: 'trato', def: 'Forma de dirigirse a alguien: de usted, con distancia, o de tú, con cercanía.',
        ejemplo: '«Le pido» trata de usted; «¿me ayudas?», de tú.', ver: ['registro', 'destinatario'] },
      { termino: 'registro', def: 'Grado de formalidad con que se habla o escribe según la situación: formal, informal o entre iguales.',
        ejemplo: '«Estimada directora… Atentamente» es formal; «¡Hola, Caro!», informal.', ver: ['trato'] },
      { termino: 'acto de habla', def: 'Lo que se hace al decir algo: pedir, informar, advertir, prometer o preguntar.',
        formas: ['acto de habla', 'actos de habla'], ejemplo: '«¿Tiene sal?», dicho al mozo, es un pedido.', ver: ['situación comunicativa'] },
    ],
    laboratorio: [
      mesaCalendario,
      // Invitaciones de las mesas que reusan un juego: resuelven con resuelta() y PARTE, lo mismo que dibuja la lectura.
      Object.assign({ id: 'deicticos', titulo: 'Aquí, mañana y nosotros', pieza: 'rv-texto', invitaciones: [
        { texto: 'Deja una palabra del mensaje sin poder resolverse.',
          logrado: val => resuelta(val.k, val.w) === null,
          bien: 'Sin quién, cuándo ni dónde, no podemos saberlo con este texto.' },
        { texto: 'Haz que «mañana» caiga en otro mes.',
          logrado: val => val.w === 'm' && !!CTX[val.k].d && siguiente(CTX[val.k].d, CTX[val.k].mes)[1] !== CTX[val.k].mes,
          bien: 'El 30 de junio, «mañana» ya es julio. La fecha del mensaje lo decide.' },
        { texto: 'Guarda dos casos donde la misma palabra signifique cosas distintas.',
          logrado: (val, guardados) => { const r = resuelta(val.k, val.w); return !!r && guardados.some(g => g.w === val.w && g.k !== val.k && resuelta(g.k, g.w) && resuelta(g.k, g.w) !== r); },
          bien: 'La palabra no cambió; cambió la situación. Ahí está su referente.' },
      ] }, deicticos.juega),
      Object.assign({ id: 'emisor-destinatario', titulo: 'Quién habla y a quién', pieza: 'rv-texto', invitaciones: [
        { texto: 'Señala la parte del mensaje que no cambia con el destinatario.',
          logrado: val => !PARTE[val.k][val.p],
          bien: 'El pedido es el mismo en las tres. Lo que cambia es el trato.' },
        { texto: 'Encuentra la versión y la parte que tratan de tú.',
          logrado: val => !!PARTE[val.k][val.p] && PARTE[val.k][val.p].join('').includes('trato de tú'),
          bien: '«¿Me ayudas?» habla a alguien cercano. ¿Qué marca lo muestra en la firma?' },
        { texto: 'Busca el saludo que se dirige a varias personas.',
          logrado: val => val.p === 's' && PARTE[val.k].s.join('').includes('a varios'),
          bien: '«Chicos del grupo» habla a muchos, y «pidamos» incluye a quien escribe.' },
        { texto: 'Guarda la misma parte con dos destinatarios distintos.',
          logrado: (val, guardados) => !!PARTE[val.k][val.p] && guardados.some(g => g.p === val.p && g.k !== val.k),
          bien: 'Misma parte, otra relación. Compara cuál marca más distancia.' },
      ] }, emisorDest.juega),
    ],
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea). Una lista vacía:
    // la mesa no practica ninguna idea de la unidad y va en «Más mesas del tema».
    laboratorioIdeas: {
      'calendario': ['deicticos'],
      'deicticos': ['deicticos'],
      'emisor-destinatario': ['emisor-destinatario'],
    },
    ideas: [deicticos, emisorDest, accion],
  };
});
