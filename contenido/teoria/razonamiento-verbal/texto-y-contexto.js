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
    if (t.length <= 26) return fn(t);
    const k = [t.indexOf(': '), t.indexOf(', ')].filter(i => i > 0).sort((a, b) => a - b)[0];
    if (k && k <= 24) return [fn(t.slice(0, k)), t.slice(k)];
    const ps = t.split(' '); let n = 1;
    while (n < ps.length && ps.slice(0, n + 1).join(' ').length <= 18) n++;
    return [fn(ps.slice(0, n).join(' ')), ' ' + ps.slice(n).join(' ')];
  };
  const ctx = t => ({ v: 'c-i', t }), deic = t => ({ v: 'c-o', t }), res = t => ({ v: 'c-d', t }), inv = t => ({ v: 'c-h', t });
  const opciones = (c, malas) => [{ id: 'c', texto: c, correcta: true }, ...malas.map(([texto, error, siFuera], k) => ({ id: `e${k}`, texto, error, siFuera }))];
  const voltear = (arr, s) => (s % 2 ? arr.slice().reverse() : arr.slice());
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
    juega: {
      consigna: 'El mensaje no cambia. Cambia la tarjeta de contexto y mira qué significan «nosotros», «mañana» y «esta oficina».',
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
    consigna: 'Elige la fecha del mensaje y arrastra el marcador a una palabra de tiempo. Prueba fines de mes y de año.',
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
  };

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
    laboratorio: [
      mesaCalendario,
      Object.assign({ id: 'deicticos', titulo: 'Aquí, mañana y nosotros', pieza: 'rv-texto' }, deicticos.juega),
      Object.assign({ id: 'emisor-destinatario', titulo: 'Quién habla y a quién', pieza: 'rv-texto' }, emisorDest.juega),
    ],
    ideas: [deicticos, emisorDest, accion],
  };
});
