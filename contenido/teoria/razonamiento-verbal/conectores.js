/*
 * Teoría de «Conectores lógico-textuales» (razonamiento-verbal.conectores). Molde: docs/teoria.md. Contenido: matriz
 * de verbal (unidad 4), historia (marcadores del discurso, Portolés 1998; Martín Zorraquino y Portolés 1999) y
 * códigos RV23–RV26 y RV35. Oraciones propias (regla 5).
 * Ruta A · Argumentar: con las dos ideas a la vista, se cambia el conector y se ve si la expectativa se cumple.
 *
 * Ficha de tarea:
 *   Promesa: elegir el conector por la relación entre las dos ideas, no por cómo suena.
 *   Persona y condiciones: postulante de 3.º a 5.º, celular, sin audio; conectores de la UNI (semana 5).
 *   Resultado observable: nombra la relación (suma, contraste, causa, consecuencia…) y luego elige la forma.
 *   Orden de atención: 1.º las dos ideas · 2.º lo que se espera de la primera · 3.º el conector en el hueco.
 *   Estados: la expectativa se cumple · se rompe; el conector encaja (o) o no (h).
 *   Duda que resuelve: ¿por qué «por eso» no va en «llovió toda la noche; ___, el partido se jugó»?
 *
 * Colores (regla 4): las ideas que se enlazan i (turquesa, continuo), el conector que se prueba o (naranja,
 * discontinuo), la relación o expectativa d (verde, punteado), lo que no encaja h (rojo).
 * Códigos: RV23, RV24 (contracausal como causal), RV25 (concesivos escritos), RV26 (aditivo por contraste), RV35
 * (otra clase por descarte). Sin códigos nuevos.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  // Gesto directo (docs/teoria.md §4b): sobre el texto hay una bandeja con los conectores; el alumno arrastra la ficha
  // al conector que quiere poner en el hueco. En la idea 2 también arrastra la marca de un hueco a otro. La manija va
  // sobre el número de la ficha o al inicio del hueco y salta al más cercano al dedo (rv-texto.cercana). Los botones
  // de cada control son la alternativa sin arrastre.
  const RV = () => Kit.piezas['rv-texto'];
  function anclaP(datos, id) {
    // En un párrafo, al inicio del hueco (al centro taparía su texto); en una lista, sobre el número (rv-texto.ancla).
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
  // La bandeja va arriba: así el sello de la tarjeta del texto no queda bajo el botón de la lupa.
  const conBandeja = (datos, titulo, items) => ({ secciones: [{ id: 'bandeja', titulo, modo: 'lista', fragmentos: items }].concat(datos.secciones) });
  const conFicha = (estado, id) => Object.assign({}, estado, { marcas: Object.assign({}, estado.marcas, { [id]: 'o' }) });
  // Una lectura en vivo no parte línea dentro de un color (.var): si el texto es largo, solo va en color su cabeza.
  const corto = (fn, t) => {
    if (t.length <= 26) return fn(t);
    const k = [t.indexOf(': '), t.indexOf(', ')].filter(i => i > 0).sort((a, b) => a - b)[0];
    if (k && k <= 24) return [fn(t.slice(0, k)), t.slice(k)];
    const ps = t.split(' '); let n = 1;
    while (n < ps.length && ps.slice(0, n + 1).join(' ').length <= 18) n++;
    return [fn(ps.slice(0, n).join(' ')), ' ' + ps.slice(n).join(' ')];
  };
  const idea = t => ({ v: 'c-i', t }), con = t => ({ v: 'c-o', t }), rel = t => ({ v: 'c-d', t }), mal = t => ({ v: 'c-h', t });
  const opciones = (c, malas) => [{ id: 'c', texto: c, correcta: true }, ...malas.map(([texto, error, siFuera], k) => ({ id: `e${k}`, texto, error, siFuera }))];
  const voltear = (arr, s) => (s % 2 ? arr.slice().reverse() : arr.slice());
  // Dos ideas con el hueco del conector en medio, y debajo la tarjeta de la relación.
  const dosIdeas = (a, b, reserva = 'sin embargo,', relTitulo = 'Lo que se espera') => ({ secciones: [
    { id: 'o', titulo: 'Las dos ideas', modo: 'tarjeta', fragmentos: [{ id: 'a', t: a }, { id: 'w', hueco: true, reserva }, { id: 'b', t: b }] },
    { id: 'r', titulo: relTitulo, modo: 'parrafo', fragmentos: [{ id: 'r1', hueco: true, caja: false, reserva: 'que apruebe: no se cumple, se rompe' }] },
  ] });
  const ejercicio = (frase, reserva = 'sin embargo,') => {
    const [a, b] = frase.split('___');
    return { datos: { secciones: [{ id: 'o', titulo: 'Oración', modo: 'tarjeta', fragmentos: [...(a.trim() ? [{ id: 'a', t: a.trim() }] : []), { id: 'w', hueco: true, reserva }, { id: 'b', t: b.trim() }] }] }, estado: { marcas: { a: 'i', b: 'i' } } };
  };

  // ---------- Idea 1: la relación decide el conector ----------
  // Cambia: el resultado (aprobó / desaprobó) y el conector. Permanece: la primera idea y lo que hace esperar.
  // Progresa: la expectativa se cumple o se rompe. Se reserva: el contraste con «aun así» (predicción).
  // Debe verse: que el mismo conector encaja con un resultado y choca con el otro.
  const RES = { aprobo: { t: 'aprobó el examen.', cumple: true }, desaprobo: { t: 'desaprobó el examen.', cumple: false } };
  const CON = { ademas: { t: 'además,', clase: 'adición' }, sinembargo: { t: 'sin embargo,', clase: 'contraste' }, poreso: { t: 'por eso', clase: 'consecuencia' } };
  const encaja = (r, c) => (RES[r].cumple ? c === 'poreso' : c === 'sinembargo');
  const figRel = r => dosIdeas('Estudió toda la semana;', RES[r].t);
  const figRelB = r => conBandeja(figRel(r), 'Conectores', Object.entries(CON).map(([id, c]) => ({ id, t: c.t.replace(',', '') })));
  const estRel = (r, c, extra = {}) => Object.assign({
    huecos: { w: CON[c].t, r1: RES[r].cumple ? 'que apruebe: se cumple' : 'que apruebe: se rompe' },
    marcas: { a: 'i', b: 'i', w: encaja(r, c) ? 'o' : 'h', r1: 'd' },
    sellos: { o: encaja(r, c) ? { t: CON[c].clase, c: 'i' } : { t: 'No encaja', c: 'h' } },
  }, extra);
  const relacion = {
    id: 'relacion-primero',
    titulo: 'Primero la relación, después el conector',
    temas: ['Conectores de adición, contraste y causa'],
    pieza: 'rv-texto',
    juega: {
      consigna: 'Cambia el resultado del examen y prueba conectores. Mira cuál encaja cuando se cumple lo esperado y cuál cuando se rompe.',
      voz: 'Lee primero qué se espera después de estudiar.',
      controles: [
        { id: 'r', etiqueta: 'Resultado', opciones: [{ valor: 'aprobo', texto: 'aprobó' }, { valor: 'desaprobo', texto: 'desaprobó' }] },
        { id: 'c', etiqueta: 'Conector', opciones: Object.entries(CON).map(([valor, c]) => ({ valor, texto: c.t.replace(',', '') })) },
      ],
      dibujo: val => ({ datos: figRelB(val.r), estado: conFicha(estRel(val.r, val.c), val.c) }),
      // Arrastra la ficha a un conector de la bandeja: entra en el hueco entre las dos ideas.
      arrastres: [manija('ficha', 'c', val => figRelB(val.r), Object.keys(CON), 'ficha del conector')],
      lectura: val => (encaja(val.r, val.c) ? [corto(con, CON[val.c].t.replace(',', '')), ' marca ', corto(rel, CON[val.c].clase)] : [corto(mal, CON[val.c].t.replace(',', '')), ' no marca esta relación']),
      minimo: 4,
    },
    predice: {
      pregunta: '«Llovió toda la noche; ___, el partido se jugó a la hora prevista.» ¿Qué conector va en el espacio?',
      voz: '¿Qué se espera después de una noche de lluvia?',
      opciones: opciones('aun así', [
        ['por eso', 'RV24', 'Iría si el partido se hubiera suspendido: eso sí sería lo esperado.'],
        ['además', 'RV26', 'Sumaría otra noticia; aquí el partido va contra lo esperado.'],
        ['es decir', 'RV35', 'Sirve para decir lo mismo con otras palabras; estas son dos ideas distintas.'],
      ]),
      dibujo: { datos: dosIdeas('Llovió toda la noche;', 'el partido se jugó a la hora prevista.'), estado: { marcas: { a: 'i', b: 'i' }, tapar: ['r1'] } },
      revelar: { datos: dosIdeas('Llovió toda la noche;', 'el partido se jugó a la hora prevista.'), estado: { huecos: { w: 'aun así,', r1: 'que se suspenda: se rompe' }, marcas: { a: 'i', b: 'i', w: 'o', r1: 'd' }, sellos: { o: { t: 'contraste', c: 'i' } } } },
      coincide: 'Coincide: tras la lluvia se esperaba la suspensión; el partido la contradice.',
    },
    mira: {
      datos: figRel('desaprobo'),
      voz: 'Antes del conector, la expectativa.',
      pasos: [
        { estado: { marcas: { a: 'i' }, huecos: { r1: 'que apruebe' }, tapar: ['b'] }, texto: 'Después de estudiar toda la semana, se espera aprobar.', ecuacion: [idea('estudió'), ' → ', rel('se espera: aprobar')] },
        { estado: { marcas: { a: 'i', b: 'i', r1: 'd' }, huecos: { r1: 'que apruebe: se rompe' }, nuevo: ['b', 'r1'] }, texto: 'Pero desaprobó: lo esperado no se cumple.', ecuacion: [idea('desaprobó'), ' ≠ ', rel('lo esperado')] },
        { estado: estRel('desaprobo', 'poreso', { nuevo: ['w'] }), texto: '«Por eso» diría que estudiar causó desaprobar: no es la relación.', ecuacion: [mal('por eso'), ' = causa → efecto'] },
        { estado: estRel('desaprobo', 'sinembargo', { nuevo: ['w', 'o'] }), texto: 'Lo esperado se rompe: va un conector de contraste.', ecuacion: [con('sin embargo'), ' = ', rel('contraste')] },
      ],
    },
    regla: {
      texto: 'Antes de elegir el conector, nombra la relación: suma otra idea (adición), contradice lo esperado (contraste), da la razón (causa) o da el resultado (consecuencia).',
      ecuacion: [idea('idea A'), ' + ', { llave: [rel('relación')], nota: 'qué las une', color: 'c-d' }, ' + ', idea('idea B'), ' → ', { llave: [con('conector')], nota: 'su forma', color: 'c-o' }],
      condicion: 'se lee qué hace esperar la primera idea; si la segunda lo cumple o lo rompe, cambia el conector.',
    },
    ahoraTu: {
      voz: 'Nombra la relación antes de mirar las opciones.',
      generar(s) {
        const B = [
          { f: 'El agua estaba helada; ___ nadie quiso bañarse en la laguna.', ok: 'por eso', m: [['sin embargo', 'RV24', 'Iría si se bañaran igual: eso rompería lo esperado.'], ['además', 'RV26', 'Sumaría otra idea; aquí la segunda es el resultado de la primera.'], ['por ejemplo', 'RV35', 'Daría un caso de lo anterior; aquí es una consecuencia.']] },
          { f: 'La tienda bajó sus precios; ___ vendió menos que el mes pasado.', ok: 'sin embargo,', m: [['por eso', 'RV24', 'Al bajar precios se espera vender más; vender menos rompe eso.'], ['además,', 'RV26', 'Sumaría una idea; aquí el resultado contradice lo esperado.'], ['es decir,', 'RV35', 'Diría lo mismo con otras palabras; son dos hechos distintos.']] },
          { f: 'El puente es seguro ___ fue revisado por ingenieros el año pasado.', ok: 'porque', m: [['aunque', 'RV24', 'Iría si la revisión hiciera dudar de la seguridad; aquí la sostiene.'], ['pero', 'RV26', 'Marcaría un choque; la revisión es la razón de que sea seguro.'], ['luego', 'RV35', 'Marcaría orden en el tiempo; aquí se da una razón.']] },
          { f: 'Ana cocina muy bien; ___ toca el charango en las fiestas.', ok: 'además,', m: [['por eso', 'RV24', 'Diría que cocinar bien causa tocar el charango; son cosas que se suman.'], ['sin embargo,', 'RV26', 'Marcaría un choque; las dos ideas no se oponen.'], ['es decir,', 'RV35', 'Diría lo mismo con otras palabras; son dos cosas distintas.']] },
          { f: 'El bus salió temprano; ___ llegamos tarde por el tráfico.', ok: 'pero', m: [['así que', 'RV24', 'Salir temprano hace esperar llegar a tiempo; llegar tarde rompe eso.'], ['también', 'RV26', 'Sumaría una idea; aquí el resultado va contra lo esperado.'], ['o sea', 'RV35', 'Diría lo mismo con otras palabras; son dos hechos distintos.']] },
          { f: 'No hubo luz en todo el barrio ___ un rayo cayó sobre el transformador.', ok: 'porque', m: [['aunque', 'RV24', 'Iría si el rayo hiciera esperar que sí hubiera luz.'], ['además', 'RV26', 'Sumaría otra noticia; el rayo es la razón del apagón.'], ['por ejemplo', 'RV35', 'Daría un caso; aquí se da la razón.']] },
        ];
        const b = B[s % B.length];
        return {
          pregunta: '¿Qué conector expresa la relación entre las dos ideas?',
          dibujo: ejercicio(b.f),
          opciones: opciones(b.ok, voltear(b.m, s)),
          solucion: { texto: 'Se nombra la relación entre las dos ideas y luego se elige la forma.', ecuacion: [con(b.ok.replace(',', ''))] },
        };
      },
    },
  };

  // ---------- Idea 2: las clases de conectores ----------
  // Cambia: el hueco del texto y el conector. Permanece: el texto sobre la quinua. Progresa: cada hueco pide una
  // relación distinta (ejemplo, suma, cierre). Se reserva: la reformulación (es decir), en la predicción.
  // Debe verse: lo que hay a cada lado del hueco elegido.
  const QUINUA = [
    { id: 'a', t: 'La quinua resiste el frío y la sequía;' }, { id: 'h1', hueco: true, reserva: 'en conclusión,' }, { id: 'b', t: 'crece a más de 3800 metros.' },
    { id: 'h2', hueco: true, reserva: 'en conclusión,' }, { id: 'c', t: 'tiene mucha proteína.' }, { id: 'h3', hueco: true, reserva: 'en conclusión,' }, { id: 'd', t: 'es un cultivo valioso para el altiplano.' },
  ];
  const HUECOS = { h1: { ok: 'por ejemplo', clase: 'ejemplo: un caso de lo anterior', lados: ['a', 'b'] }, h2: { ok: 'además', clase: 'adición: suma otra idea', lados: ['b', 'c'] }, h3: { ok: 'en conclusión', clase: 'cierre: resume lo dicho', lados: ['c', 'd'] } };
  const figQ = () => ({ secciones: [{ id: 'o', titulo: 'Texto', modo: 'tarjeta', fragmentos: QUINUA }] });
  const CONQ = ['por ejemplo', 'además', 'en conclusión'], idQ = c => c.replace(/ /g, '-');
  const figQB = () => conBandeja(figQ(), 'Conectores', CONQ.map(c => ({ id: idQ(c), t: c })));
  const estQ = (h, c, extra = {}) => {
    const H = HUECOS[h], ok = H.ok === c;
    return Object.assign({ huecos: { [h]: `${c},` }, marcas: { [H.lados[0]]: 'i', [H.lados[1]]: 'i', [h]: ok ? 'o' : 'h' }, sellos: { o: ok ? { t: H.clase.split(':')[0], c: 'i' } : { t: 'No encaja', c: 'h' } } }, extra);
  };
  const clases = {
    id: 'clases',
    titulo: 'Cada hueco pide una clase',
    temas: ['Clases de conectores'],
    pieza: 'rv-texto',
    juega: {
      consigna: 'Elige un hueco del texto y prueba conectores. Lee lo que hay a cada lado: eso decide la clase.',
      voz: 'Mira las dos partes marcadas junto al hueco.',
      controles: [
        { id: 'h', etiqueta: 'Hueco', opciones: [{ valor: 'h1', texto: '1' }, { valor: 'h2', texto: '2' }, { valor: 'h3', texto: '3' }] },
        { id: 'c', etiqueta: 'Conector', opciones: ['por ejemplo', 'además', 'en conclusión'].map(c => ({ valor: c, texto: c })) },
      ],
      dibujo: val => ({ datos: figQB(), estado: conFicha(estQ(val.h, val.c), idQ(val.c)) }),
      // Dos manijas: la marca del hueco (se arrastra de un hueco a otro) y la ficha del conector en la bandeja.
      arrastres: [
        manija('hueco', 'h', figQB, Object.keys(HUECOS), 'hueco que se mira', 'c-d'),
        { id: 'ficha', etiqueta: 'ficha del conector', color: 'c-o',
          donde: val => anclaP(figQB(), idQ(val.c)),
          mover: (pt, val) => { const id = RV().cercana(figQB(), pt, CONQ.map(idQ)); return { c: CONQ.find(c => idQ(c) === id) }; } },
      ],
      lectura: val => ['Este hueco pide ', corto(rel, HUECOS[val.h].clase.split(':')[0])],
      minimo: 4,
    },
    predice: {
      pregunta: '«El vuelo llegó tarde, ___, a las once de la noche.» ¿Qué clase de conector pide el espacio?',
      opciones: opciones('Reformulación: es decir', [
        ['Contraste: sin embargo', 'RV26', 'Iría si la hora contradijera «tarde»; aquí la precisa.'],
        ['Consecuencia: por eso', 'RV24', 'Iría si lo segundo fuera un resultado; es la misma idea, precisada.'],
        ['Adición: además', 'RV35', 'Sumaría otra idea; las once de la noche explica qué tan tarde.'],
      ]),
      dibujo: ejercicio('El vuelo llegó tarde, ___ a las once de la noche.'),
      revelar: { datos: ejercicio('El vuelo llegó tarde, ___ a las once de la noche.').datos, estado: { huecos: { w: 'es decir,' }, marcas: { a: 'i', b: 'i', w: 'o' }, sellos: { o: { t: 'reformulación', c: 'i' } } } },
      coincide: 'Coincide: lo segundo dice lo mismo que lo primero, con más precisión.',
    },
    mira: {
      datos: figQ(),
      pasos: [
        { estado: estQ('h1', 'por ejemplo', { nuevo: ['h1'] }), texto: 'Crecer a 3800 metros es un caso de resistir el frío: ejemplo.', ecuacion: [con('por ejemplo'), ' = ', rel('ejemplo')] },
        { estado: Object.assign(estQ('h2', 'además', { nuevo: ['h2'] }), { huecos: { h1: 'por ejemplo,', h2: 'además,' } }), texto: 'La proteína es otra virtud, que se suma: adición.', ecuacion: [con('además'), ' = ', rel('adición')] },
        { estado: Object.assign(estQ('h3', 'en conclusión', { nuevo: ['h3'] }), { huecos: { h1: 'por ejemplo,', h2: 'además,', h3: 'en conclusión,' } }), texto: 'La última oración reúne todo lo anterior: cierre.', ecuacion: [con('en conclusión'), ' = ', rel('cierre')] },
      ],
    },
    regla: {
      texto: 'Los conectores se agrupan por la relación que marcan: adición, contraste, causa, consecuencia, ejemplo, reformulación, orden en el tiempo y cierre o conclusión.',
      ecuacion: [rel('clase'), ' = la relación entre ', idea('lo de antes'), ' y ', idea('lo de después')],
      condicion: 'se mira lo que hay a los dos lados del hueco; un conector de la misma clase puede reemplazar a otro.',
    },
    ahoraTu: {
      generar(s) {
        const B = [
          { f: 'Primero se lava la quinua; ___ se hierve durante quince minutos.', ok: 'Orden: luego', m: [['Contraste: pero', 'RV26', 'Nada se opone: son dos pasos seguidos.'], ['Causa: porque', 'RV24', 'Lavarla no es la razón de hervirla; es el paso anterior.'], ['Ejemplo: por ejemplo', 'RV35', 'Hervirla no es un caso de lavarla; es otro paso.']] },
          { f: 'Muchas aves migran en invierno; ___ las golondrinas viajan miles de kilómetros.', ok: 'Ejemplo: por ejemplo', m: [['Contraste: en cambio', 'RV26', 'Las golondrinas no se oponen: son un caso de lo anterior.'], ['Consecuencia: por eso', 'RV24', 'Las golondrinas no son un resultado de que las aves migren.'], ['Orden: después', 'RV35', 'No hay pasos en el tiempo: hay un caso de una idea general.']] },
          { f: 'El cultivo necesita poca agua, ___ se adapta bien a zonas secas.', ok: 'Reformulación: o sea', m: [['Contraste: sin embargo', 'RV26', 'Nada se opone: las dos partes dicen lo mismo.'], ['Adición: además', 'RV35', 'No suma otra idea: repite la anterior con otras palabras.'], ['Causa: porque', 'RV24', 'No da una razón: dice lo mismo de otra forma.']] },
          { f: 'Revisamos los datos tres veces; ___ los resultados son confiables.', ok: 'Consecuencia: por lo tanto', m: [['Contraste: no obstante', 'RV24', 'Revisar tres veces hace esperar confianza; no la contradice.'], ['Ejemplo: por ejemplo', 'RV35', 'La confianza no es un caso de revisar; es su resultado.'], ['Adición: también', 'RV26', 'No suma una idea aparte: es lo que se sigue de la revisión.']] },
          { f: 'La papa nativa tiene muchas variedades; ___ la papa blanca del mercado tiene pocas.', ok: 'Contraste: en cambio', m: [['Adición: además', 'RV26', 'No se suma: se opone una a la otra.'], ['Consecuencia: así que', 'RV24', 'Que la nativa tenga muchas no causa que la blanca tenga pocas.'], ['Reformulación: es decir', 'RV35', 'No dice lo mismo: habla de otra papa.']] },
          { f: 'Leímos tres textos sobre el agua; ___ el agua limpia es un bien escaso.', ok: 'Cierre: en síntesis', m: [['Ejemplo: por ejemplo', 'RV35', 'No es un caso: reúne lo que dicen los tres textos.'], ['Contraste: pero', 'RV26', 'Nada se opone: se cierra con lo que tienen en común.'], ['Orden: primero', 'RV35', 'No inicia una serie: cierra lo leído.']] },
        ];
        const b = B[s % B.length];
        return {
          pregunta: '¿Qué clase de conector pide el espacio, y cuál sirve?',
          dibujo: ejercicio(b.f, 'por lo tanto,'),
          opciones: opciones(b.ok, voltear(b.m, s)),
          solucion: { texto: 'Se compara lo que hay antes y después del espacio.', ecuacion: [rel(b.ok.split(':')[0]), ' → ', con(b.ok.split(': ')[1])] },
        };
      },
    },
  };

  // ---------- Idea 3: locuciones conjuntivas ----------
  // Cambia: la segunda oración y la locución. Permanece: «el pasaje subió». Progresa: cada locución equivale a un
  // conector simple. Se reserva: «aun cuando» (predicción). Debe verse: la equivalencia (si bien = aunque).
  const PASAJE = { siguen: { t: 'los vecinos siguen usando el tren.', ok: 'si bien' }, dejaron: { t: 'muchos vecinos dejaron de usar el tren.', ok: 'dado que' } };
  const LOC = { 'si bien': 'aunque (concesión)', 'dado que': 'porque (causa)', 'de modo que': 'por eso (consecuencia)' };
  const figLoc = k => ({ secciones: [
    { id: 'o', titulo: 'Oración', modo: 'tarjeta', fragmentos: [{ id: 'w', hueco: true, reserva: 'de modo que' }, { id: 'a', t: 'el pasaje subió,' }, { id: 'b', t: PASAJE[k].t }] },
    { id: 'r', titulo: 'Equivale a', modo: 'parrafo', fragmentos: [{ id: 'r1', hueco: true, caja: false, reserva: 'por eso (consecuencia)' }] },
  ] });
  const idL = l => l.replace(/ /g, '-');
  const figLocB = k => conBandeja(figLoc(k), 'Locuciones', Object.keys(LOC).map(l => ({ id: idL(l), t: l })));
  const estLoc = (k, l, extra = {}) => { const ok = PASAJE[k].ok === l; return Object.assign({ huecos: { w: l[0].toUpperCase() + l.slice(1), r1: LOC[l] }, marcas: { a: 'i', b: 'i', w: ok ? 'o' : 'h', r1: 'd' }, sellos: { o: ok ? { t: 'Encaja', c: 'i' } : { t: 'No encaja', c: 'h' } } }, extra); };
  const locuciones = {
    id: 'locuciones',
    titulo: 'Varias palabras, un conector',
    temas: ['Locuciones conjuntivas'],
    pieza: 'rv-texto',
    juega: {
      consigna: 'Prueba locuciones al inicio de la oración y cambia el final. Mira a qué conector simple equivale cada una.',
      voz: 'Una locución funciona como una sola palabra.',
      controles: [
        { id: 'k', etiqueta: 'Final', opciones: [{ valor: 'siguen', texto: 'siguen usándolo' }, { valor: 'dejaron', texto: 'dejaron de usarlo' }] },
        { id: 'l', etiqueta: 'Locución', opciones: Object.keys(LOC).map(l => ({ valor: l, texto: l })) },
      ],
      dibujo: val => ({ datos: figLocB(val.k), estado: conFicha(estLoc(val.k, val.l), idL(val.l)) }),
      // Arrastra la ficha a una locución: entra al inicio de la oración y abajo aparece su equivalente.
      arrastres: [{ id: 'ficha', etiqueta: 'ficha de la locución', color: 'c-o',
        donde: val => anclaP(figLocB(val.k), idL(val.l)),
        mover: (pt, val) => { const id = RV().cercana(figLocB(val.k), pt, Object.keys(LOC).map(idL)); return { l: Object.keys(LOC).find(l => idL(l) === id) }; } }],
      lectura: val => [PASAJE[val.k].ok === val.l ? corto(con, val.l) : corto(mal, val.l), ' = ', corto(rel, LOC[val.l])],
      minimo: 4,
    },
    predice: {
      pregunta: '«___ el camino estaba cerrado, llegamos a tiempo por el desvío.» ¿Qué locución va en el espacio?',
      opciones: opciones('Aun cuando', [
        ['Dado que', 'RV25', '«Dado que» da una razón; el camino cerrado no explica llegar a tiempo.'],
        ['De modo que', 'RV24', 'Marcaría un resultado; llegar a tiempo va contra lo esperado.'],
        ['Además de que', 'RV25', 'Sumaría otra idea; aquí hay un obstáculo que no impidió llegar.'],
      ]),
      dibujo: ejercicio('___ el camino estaba cerrado, llegamos a tiempo por el desvío.', 'De modo que'),
      revelar: { datos: ejercicio('___ el camino estaba cerrado, llegamos a tiempo por el desvío.', 'De modo que').datos, estado: { huecos: { w: 'Aun cuando' }, marcas: { b: 'i', w: 'o' }, sellos: { o: { t: '= aunque', c: 'i' } } } },
      coincide: 'Coincide: «aun cuando» equivale a «aunque»: un obstáculo que no impidió el resultado.',
    },
    mira: {
      datos: figLoc('siguen'),
      pasos: [
        { estado: { marcas: { a: 'i', b: 'i' }, tapar: ['r1'] }, texto: 'Si el pasaje sube, se espera que menos gente use el tren.', ecuacion: [idea('subió el pasaje'), ' → ', rel('se espera: menos uso')] },
        { estado: estLoc('siguen', 'dado que', { nuevo: ['w', 'r1'] }), texto: '«Dado que» da una razón; subir el pasaje no explica seguir.', ecuacion: [mal('dado que'), ' = ', rel('porque')] },
        { estado: estLoc('siguen', 'si bien', { nuevo: ['w', 'r1'] }), texto: '«Si bien» admite el obstáculo y lo deja sin efecto, como «aunque».', ecuacion: [con('si bien'), ' = ', rel('aunque')] },
      ],
    },
    regla: {
      texto: 'Una locución conjuntiva es un grupo de palabras que funciona como un solo conector. Se clasifica igual: por la relación que marca entre las dos ideas.',
      ecuacion: [con('si bien'), ' = ', { llave: [rel('aunque')], nota: 'concesión', color: 'c-d' }, '   ·   ', con('dado que'), ' = ', { llave: [rel('porque')], nota: 'causa', color: 'c-d' }, '   ·   ', con('de modo que'), ' = ', { llave: [rel('por eso')], nota: 'consecuencia', color: 'c-d' }],
      condicion: 'se reemplaza la locución por el conector simple; si la oración conserva el sentido, la relación es esa.',
    },
    ahoraTu: {
      generar(s) {
        const B = [
          { f: '___ el examen era difícil, la mayoría lo aprobó.', ok: 'Si bien', m: [['Puesto que', 'RV25', 'Daría una razón; la dificultad no explica aprobar.'], ['De manera que', 'RV24', 'Marcaría un resultado; aprobar va contra lo esperado.'], ['Así como', 'RV25', 'Compararía o sumaría; aquí hay un obstáculo superado.']] },
          { f: 'Llevaremos casacas ___ en la puna hace mucho frío de noche.', ok: 'puesto que', m: [['si bien', 'RV25', 'Marcaría un obstáculo; el frío es la razón de llevarlas.'], ['de modo que', 'RV24', 'Iría al revés: el frío no es el resultado de llevar casacas.'], ['a pesar de que', 'RV25', 'Marcaría contraste; el frío justifica las casacas.']] },
          { f: 'El río creció mucho, ___ cerraron el puente por seguridad.', ok: 'de manera que', m: [['aun cuando', 'RV25', 'Marcaría un obstáculo; cerrar el puente es lo esperado.'], ['ya que', 'RV24', 'Daría la razón al revés: el cierre no causó la crecida.'], ['así como', 'RV25', 'Sumaría; aquí el cierre es un resultado.']] },
          { f: '___ no tenía experiencia, hizo un buen trabajo en la feria.', ok: 'A pesar de que', m: [['Dado que', 'RV25', 'Daría una razón; la falta de experiencia no explica el buen trabajo.'], ['De modo que', 'RV24', 'Marcaría un resultado; el buen trabajo va contra lo esperado.'], ['Así como', 'RV25', 'Compararía; aquí hay un obstáculo que no impidió el resultado.']] },
          { f: 'Suspendieron la clase ___ el profesor estaba enfermo.', ok: 'dado que', m: [['si bien', 'RV25', 'Marcaría un obstáculo; la enfermedad es la razón.'], ['de modo que', 'RV24', 'Iría al revés: la enfermedad no resulta de suspender.'], ['aun cuando', 'RV25', 'Marcaría contraste; la enfermedad justifica la suspensión.']] },
          { f: 'Ahorró durante un año, ___ pudo comprar su propia computadora.', ok: 'de modo que', m: [['si bien', 'RV25', 'Marcaría un obstáculo; ahorrar ayuda a comprar.'], ['puesto que', 'RV24', 'Daría la razón al revés: comprar no explica ahorrar.'], ['a pesar de que', 'RV25', 'Marcaría contraste; comprar es lo esperado tras ahorrar.']] },
        ];
        const b = B[s % B.length];
        return {
          pregunta: '¿Qué locución expresa la relación entre las dos ideas?',
          dibujo: ejercicio(b.f, 'A pesar de que'),
          opciones: opciones(b.ok, voltear(b.m, s)),
          solucion: { texto: 'Se reemplaza por el conector simple y se ve si conserva el sentido.', ecuacion: [con(b.ok.toLowerCase()), ' = ', rel(/si bien|pesar/i.test(b.ok) ? 'aunque' : /dado|puesto/i.test(b.ok) ? 'porque' : 'por eso')] },
        };
      },
    },
  };

  // ---------- Laboratorio: el tablero de los conectores ----------
  // Más rico que la idea 2: el mismo texto de la quinua con ocho conectores de seis clases (ejemplo, adición,
  // reformulación, contraste, consecuencia, cierre). El código decide si encaja comparando la clase del conector con la que pide el
  // hueco (regla 1) y cuenta cuántos de los ocho encajan en ese hueco: hay más de uno por hueco.
  const CLASE = { ejemplo: 'ejemplo', adicion: 'adición', reformulacion: 'reformulación', contraste: 'contraste', consecuencia: 'consecuencia', cierre: 'cierre' };
  const TABLERO = [
    ['por ejemplo', 'ejemplo'], ['por eso', 'consecuencia'], ['además', 'adicion'], ['también', 'adicion'],
    ['es decir', 'reformulacion'], ['sin embargo', 'contraste'], ['en conclusión', 'cierre'], ['en suma', 'cierre'],
  ].map(([t, clase]) => ({ id: t.replace(/ /g, '-').replace('í', 'i').replace('ó', 'o').replace('á', 'a'), t, clase }));
  const PIDE = { h1: 'ejemplo', h2: 'adicion', h3: 'cierre' };
  const figTab = () => conBandeja(figQ(), 'Conectores', TABLERO.map(x => ({ id: x.id, t: x.t })));
  const conTab = id => TABLERO.find(x => x.id === id);
  const mesaTablero = {
    id: 'tablero', titulo: 'El tablero de los conectores', pieza: 'rv-texto',
    consigna: 'Arrastra la marca a un hueco y la ficha a un conector. Mira cuántos conectores encajan en cada hueco.',
    voz: 'Dos conectores de la misma clase se pueden cambiar.',
    controles: [
      { id: 'h', etiqueta: 'Hueco', opciones: [{ valor: 'h1', texto: '1' }, { valor: 'h2', texto: '2' }, { valor: 'h3', texto: '3' }] },
      { id: 'c', etiqueta: 'Conector', opciones: TABLERO.map(x => ({ valor: x.id, texto: x.t })) },
    ],
    dibujo: val => {
      const x = conTab(val.c), H = HUECOS[val.h], ok = x.clase === PIDE[val.h];
      return { datos: figTab(), estado: { huecos: { [val.h]: `${x.t},` }, marcas: { [H.lados[0]]: 'i', [H.lados[1]]: 'i', [val.h]: ok ? 'o' : 'h', [val.c]: 'o' }, sellos: { o: ok ? { t: CLASE[x.clase], c: 'i' } : { t: 'No encaja', c: 'h' } } } };
    },
    lectura: val => {
      const x = conTab(val.c), ok = x.clase === PIDE[val.h], n = TABLERO.filter(y => y.clase === PIDE[val.h]).length;
      return [`Hueco ${val.h.slice(1)} pide `, rel(CLASE[PIDE[val.h]]), ' · ', ok ? con(x.t) : mal(x.t), ` · encajan ${n} de 8`];
    },
    arrastres: [
      manija('hueco', 'h', figTab, Object.keys(PIDE), 'hueco que se mira', 'c-d'),
      manija('ficha', 'c', figTab, TABLERO.map(x => x.id), 'ficha del conector'),
    ],
  };

  return {
    unidad: 'razonamiento-verbal.conectores',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rv-texto.js'],
    historia: {
      texto: 'Los estudios del discurso se preguntaron no solo cómo se unen las oraciones, sino cómo ciertas palabras guían la lectura. En español, Portolés (1998) y Martín Zorraquino y Portolés (1999) ordenaron los marcadores del discurso. Una misma forma puede cumplir funciones distintas: una lista no resuelve todos los casos.',
      pregunta: '¿Qué te dice «sin embargo» antes de leer lo que sigue?',
      fuente: { titulo: 'Matriz de teoría de razonamiento verbal (marcadores del discurso)', url: 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/diccio_ele/diccionario/marcadoresdiscurso.htm' },
    },
    laboratorio: [
      mesaTablero,
      Object.assign({ id: 'relacion', titulo: 'Se cumple o se rompe', pieza: 'rv-texto' }, relacion.juega),
      Object.assign({ id: 'locuciones', titulo: 'Locuciones', pieza: 'rv-texto' }, locuciones.juega),
    ],
    ideas: [relacion, clases, locuciones],
  };
});
