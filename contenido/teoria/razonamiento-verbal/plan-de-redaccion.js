/*
 * Teoría de «Plan de redacción» (razonamiento-verbal.plan-de-redaccion). Molde: docs/teoria.md. Contenido: matriz de
 * verbal (unidad 6), historia (Retórica de Aristóteles, libro III; Flower y Hayes 1980–1981) y códigos RV28, RV29 y
 * RV37. Textos propios (regla 5).
 * Ruta A · Argumentar: se elige un orden y se ve qué oración queda sin lo que necesita antes.
 *
 * Ficha de tarea:
 *   Promesa: ordenar oraciones por lo que cada una necesita antes (referente, tiempo, causa), no por costumbre.
 *   Persona y condiciones: postulante de 3.º a 5.º, celular, sin audio; plan de redacción (UNI, semana 7).
 *   Resultado observable: ordena y explica al menos dos vínculos obligatorios entre oraciones.
 *   Orden de atención: 1.º la oración que abre · 2.º las marcas que piden algo antes (ellas, por eso, luego) · 3.º el sello.
 *   Estados: orden sin enlaces rotos (i) · con enlaces rotos (h, en la oración que queda huérfana).
 *   Duda que resuelve: ¿por qué no se empieza por la oración con «por eso», si parece la más general?
 *
 * Colores (regla 4): oración en su lugar i (turquesa, continuo), la palabra que pide algo antes o (naranja,
 * discontinuo), el tema o el marcador de orden d (verde, punteado), enlace roto h (rojo).
 * Códigos: RV28 (se rompe información vieja y nueva), RV29 (cronología de superficie), RV37 (se empieza por la
 * conclusión); RVP1 (se fuerza «de lo general a lo particular» en un texto cronológico) es hipótesis nueva.
 *
 * Todo orden que se ve en una opción se calcula aquí a partir del orden correcto y de la vista (regla 1).
 */
(function (root, fabrica) {
  const def = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const bien = t => ({ v: 'c-i', t }), pide = t => ({ v: 'c-o', t }), marca = t => ({ v: 'c-d', t }), roto = t => ({ v: 'c-h', t });
  // Oraciones con lo que necesitan antes: { t, necesita: [índices] }. Un orden es una lista de índices.
  const rotos = (ors, orden) => orden.filter((j, k) => (ors[j].necesita || []).some(n => !orden.slice(0, k).includes(n)));
  const figura = (titulo, ors, orden) => ({ secciones: [{ id: 'o', titulo, modo: 'lista', fragmentos: orden.map(j => ({ id: `s${j}`, t: ors[j].t })) }] });
  const estado = (ors, orden, extra = {}) => {
    const r = rotos(ors, orden), marcas = {};
    orden.forEach(j => { marcas[`s${j}`] = r.includes(j) ? 'h' : 'i'; });
    return Object.assign({ marcas, sellos: { o: r.length ? { t: `${r.length} sin lo que necesita`, c: 'h' } : { t: 'Orden coherente', c: 'i' } } }, extra);
  };
  // Ahora tú: las oraciones se muestran en el orden `vista` (numeradas 1..n). La respuesta es una secuencia de
  // números calculada desde el orden correcto; cada distractor es otro orden con su error.
  function caso(b, s, pregunta) {
    const n = b.o.length, num = j => b.vista.indexOf(j) + 1;
    const sec = orden => orden.map(num).join(' – ');
    const correcto = b.o.map((_, j) => j);
    const vistos = new Set([sec(correcto)]);
    const malas = [];
    for (const [orden, error, siFuera] of b.malos(correcto, n)) {
      const t = sec(orden);
      if (vistos.has(t)) continue;
      vistos.add(t); malas.push({ id: `e${malas.length}`, texto: t, error, siFuera });
    }
    if (s % 2) malas.reverse();
    return {
      pregunta,
      dibujo: { datos: figura(`Tema: ${b.tema}`, b.o, b.vista), estado: {} },
      opciones: [{ id: 'c', texto: sec(correcto), correcta: true }, ...malas.slice(0, 3)],
      solucion: { texto: b.porque, ecuacion: [bien(sec(correcto))], dibujo: { datos: figura(`Tema: ${b.tema}`, b.o, correcto), estado: estado(b.o, correcto) } },
    };
  }
  // Distractores comunes, como órdenes: empezar por la conclusión, adelantar la que retoma, invertir dos vecinas.
  const conclusionPrimero = c => [c[c.length - 1], ...c.slice(0, -1)];
  const cambiar = (c, a, b) => { const x = c.slice(); [x[a], x[b]] = [x[b], x[a]]; return x; };

  // ---------- Idea 1: lo que abre y lo que retoma ----------
  // Cambia: la oración que abre (las demás siguen en su orden). Permanece: las cuatro oraciones.
  // Progresa: cuántas quedan sin lo que necesitan. Se reserva: abrir con la conclusión en otro texto (predicción).
  // Debe verse: la oración huérfana en rojo y la palabra que pide algo antes.
  const ABEJAS = [
    { t: 'Las abejas son clave para la agricultura.' },
    { t: 'Ellas llevan el polen de flor en flor.', necesita: [0] },
    { t: 'Sin ese transporte, muchas plantas no darían frutos.', necesita: [1] },
    { t: 'Por eso, proteger a las abejas es proteger la comida.', necesita: [2] },
  ];
  const abrirCon = k => [k, ...[0, 1, 2, 3].filter(j => j !== k)];
  const temaSubtemas = {
    id: 'abre-y-retoma',
    titulo: 'Qué abre y qué retoma',
    temas: ['Tema y subtemas'],
    pieza: 'rv-texto',
    juega: {
      consigna: 'Elige con qué oración empieza el texto; las demás siguen en su orden. Mira qué oraciones quedan sin lo que necesitan.',
      voz: 'Busca palabras como «ellas» o «por eso»: piden algo antes.',
      controles: [{ id: 'k', etiqueta: 'Empieza con', opciones: ABEJAS.map((o, k) => ({ valor: k, texto: o.t.split(' ').slice(0, 2).join(' ') + '…' })) }],
      dibujo: val => ({ datos: figura('Tema: las abejas', ABEJAS, abrirCon(val.k)), estado: estado(ABEJAS, abrirCon(val.k)) }),
      lectura: val => { const r = rotos(ABEJAS, abrirCon(val.k)).length; return r ? [roto(`${r} oración${r > 1 ? 'es' : ''} sin su referente`)] : [bien('Cada oración tiene lo que necesita')]; },
      minimo: 3,
    },
    predice: {
      pregunta: '¿Con qué oración debe empezar este texto sobre el reciclaje?',
      voz: 'Piensa qué oración no necesita nada antes.',
      opciones: [
        { id: 'c', texto: 'La que presenta el tema: «Reciclar es…»', correcta: true },
        { id: 'e1', texto: 'La conclusión: «Por eso, separar…»', error: 'RV37', siFuera: 'Parece general, pero «por eso» necesita una razón antes.' },
        { id: 'e2', texto: 'La que retoma: «Este proceso…»', error: 'RV28', siFuera: '«Este proceso» retoma algo ya dicho; no puede ir primero.' },
        { id: 'e3', texto: 'La del dato: «Una lata…»', error: 'RVP1', siFuera: 'Un dato puede abrir un texto, pero aquí aún no se sabe de qué proceso habla.' },
      ],
      dibujo: { datos: figura('Tema: el reciclaje', [{ t: 'Por eso, separar la basura en casa ayuda mucho.' }, { t: 'Este proceso ahorra materia prima y energía.' }, { t: 'Reciclar es convertir desechos en material nuevo.' }, { t: 'Una lata reciclada vuelve a ser lata en semanas.' }], [0, 1, 2, 3]), estado: {} },
      revelar: { datos: figura('Tema: el reciclaje', [{ t: 'Reciclar es convertir desechos en material nuevo.' }, { t: 'Este proceso ahorra materia prima y energía.' }, { t: 'Una lata reciclada vuelve a ser lata en semanas.' }, { t: 'Por eso, separar la basura en casa ayuda mucho.' }], [0, 1, 2, 3]), estado: { marcas: { s0: 'd', s1: 'i', s2: 'i', s3: 'i' }, sellos: { o: { t: 'Orden coherente', c: 'i' } } } },
      coincide: 'Coincide: la que define el reciclaje no necesita nada antes; las otras la retoman.',
    },
    mira: {
      datos: figura('Tema: las abejas', ABEJAS, [3, 0, 1, 2]),
      voz: 'Cada palabra que retoma apunta hacia atrás.',
      pasos: [
        { estado: estado(ABEJAS, [3, 0, 1, 2]), texto: 'Si abre «Por eso», no hay razón antes: queda huérfana.', ecuacion: [roto('por eso'), ' sin causa'] },
        { estado: { marcas: { s0: 'd' }, nuevo: ['s0'] }, texto: 'La 2 presenta el tema y no necesita nada antes: abre.', ecuacion: [marca('Las abejas'), ' = tema'] },
        { estado: { marcas: { s0: 'd', s1: 'o' }, nuevo: ['s1'] }, texto: '«Ellas» retoma a las abejas: va después.', ecuacion: [pide('Ellas'), ' → ', marca('abejas')] },
        { estado: { marcas: { s0: 'd', s1: 'i', s2: 'o', s3: 'o' }, nuevo: ['s2', 's3'] }, texto: '«Ese transporte» retoma el polen; «por eso» cierra.', ecuacion: ['orden: ', bien('2 – 3 – 4 – 1')] },
      ],
    },
    regla: {
      texto: 'Abre la oración que presenta el tema y no necesita nada antes. Las que retoman algo (ellas, este, por eso) van después de lo que retoman.',
      ecuacion: [marca('tema'), ' → ', bien('subtemas'), ' → ', pide('lo que retoma'), ' → cierre'],
      condicion: 'cada palabra que remite a algo ya dicho encuentra su referente en una oración anterior.',
    },
    ahoraTu: {
      generar(s) {
        const B = [
          { tema: 'la totora', o: [{ t: 'La totora es una planta que crece en el lago Titicaca.' }, { t: 'Con ella, los uros construyen sus islas.', necesita: [0] }, { t: 'También fabrican balsas con sus tallos secos.', necesita: [1] }, { t: 'Por eso, la totora es la base de su vida diaria.', necesita: [2] }], vista: [2, 0, 3, 1], porque: 'Abre la que presenta la totora; «ella» y «también» retoman; «por eso» cierra.', malos: (c) => [[conclusionPrimero(c), 'RV37', '«Por eso» necesita antes la razón.'], [cambiar(c, 0, 1), 'RV28', '«Con ella» no tiene a quién referirse si va primero.'], [cambiar(c, 1, 2), 'RV28', '«También» suma a algo dicho: va después de las islas.']] },
          { tema: 'el sol', o: [{ t: 'El sol es la estrella más cercana a la Tierra.' }, { t: 'Su luz tarda unos ocho minutos en llegarnos.', necesita: [0] }, { t: 'Esa energía permite que las plantas fabriquen su alimento.', necesita: [1] }, { t: 'Sin el sol, por tanto, no habría vida en el planeta.', necesita: [2] }], vista: [1, 3, 0, 2], porque: 'Abre la que presenta el sol; «su luz» y «esa energía» retoman; «por tanto» cierra.', malos: (c) => [[conclusionPrimero(c), 'RV37', '«Por tanto» cierra: necesita sus razones antes.'], [cambiar(c, 1, 2), 'RV28', '«Esa energía» retoma la luz: va después de ella.'], [cambiar(c, 0, 1), 'RV28', '«Su luz» necesita saber de quién es.']] },
          { tema: 'los andenes', o: [{ t: 'Los andenes son terrazas de cultivo en las laderas.' }, { t: 'Estas terrazas evitan que la lluvia arrastre la tierra.', necesita: [0] }, { t: 'Además, guardan el calor del día para la noche.', necesita: [1] }, { t: 'Así, permiten sembrar en zonas muy empinadas.', necesita: [2] }], vista: [3, 1, 0, 2], porque: 'Abre la definición; «estas terrazas» y «además» retoman; «así» concluye.', malos: (c) => [[conclusionPrimero(c), 'RV37', '«Así» concluye: va al final.'], [cambiar(c, 0, 1), 'RV28', '«Estas terrazas» necesita antes saber cuáles.'], [cambiar(c, 2, 3), 'RV37', '«Así» resume lo anterior: no va antes de «además».']] },
          { tema: 'la anemia', o: [{ t: 'La anemia es la falta de glóbulos rojos sanos en la sangre.' }, { t: 'Quien la tiene se cansa con facilidad.', necesita: [0] }, { t: 'Una causa frecuente es comer poco hierro.', necesita: [0] }, { t: 'Por eso, conviene comer hígado, sangrecita o menestras.', necesita: [2] }], vista: [3, 2, 1, 0], porque: 'Abre la definición; «la tiene» retoma; la causa va antes del «por eso».', malos: (c) => [[conclusionPrimero(c), 'RV37', '«Por eso» necesita la causa antes.'], [cambiar(c, 0, 1), 'RV28', '«Quien la tiene» necesita saber qué es «la».'], [[0, 1, 3, 2], 'RV28', '«Por eso» quedaría antes de su causa, el poco hierro.']] },
          { tema: 'el río Amazonas', o: [{ t: 'El Amazonas es el río más caudaloso del mundo.' }, { t: 'Nace en los Andes del sur del Perú.', necesita: [0] }, { t: 'Desde allí, recorre miles de kilómetros hasta el Atlántico.', necesita: [1] }, { t: 'En ese recorrido recibe más de mil afluentes.', necesita: [2] }], vista: [2, 0, 3, 1], porque: 'Abre la presentación; «desde allí» y «ese recorrido» retoman lo anterior.', malos: (c) => [[cambiar(c, 1, 2), 'RV28', '«Desde allí» necesita saber de dónde.'], [cambiar(c, 2, 3), 'RV28', '«Ese recorrido» necesita el recorrido antes.'], [conclusionPrimero(c), 'RV28', '«Ese recorrido» no puede abrir el texto.']] },
        ];
        return caso(B[s % B.length], s, `¿Qué orden es coherente para el texto sobre ${B[s % B.length].tema}?`);
      },
    },
  };

  // ---------- Idea 2: el tiempo y la causa ordenan ----------
  // Cambia: el orden propuesto (tres planes). Permanece: las oraciones del chuño. Progresa: los marcadores de tiempo
  // (primero, luego, finalmente) y la causa antes del efecto. Se reserva: la causa-efecto sin marcador (predicción).
  // Debe verse: los marcadores de tiempo y el «por eso» después de su causa.
  const CHUNO = [
    { t: 'Primero, las papas se dejan afuera en las noches de helada.' },
    { t: 'Luego, se pisan para sacarles el agua.', necesita: [0] },
    { t: 'Finalmente, se secan al sol varios días.', necesita: [1] },
    { t: 'Por eso, el chuño se conserva durante años.', necesita: [2] },
  ];
  const PLANES = { a: [0, 1, 2, 3], b: [3, 0, 1, 2], c: [1, 0, 2, 3] };
  const tiempoCausa = {
    id: 'tiempo-y-causa',
    titulo: 'El tiempo y la causa ordenan',
    temas: ['Secuencia cronológica', 'Secuencia causa-efecto'],
    pieza: 'rv-texto',
    juega: {
      consigna: 'Prueba tres planes para el texto del chuño. Mira los marcadores de tiempo y dónde queda el «por eso».',
      voz: 'Los marcadores de tiempo son pistas de orden.',
      controles: [{ id: 'p', etiqueta: 'Plan', opciones: [{ valor: 'a', texto: 'Plan A' }, { valor: 'b', texto: 'Plan B' }, { valor: 'c', texto: 'Plan C' }] }],
      dibujo: val => ({ datos: figura('Tema: cómo se hace el chuño', CHUNO, PLANES[val.p]), estado: estado(CHUNO, PLANES[val.p]) }),
      lectura: val => { const r = rotos(CHUNO, PLANES[val.p]).length; return r ? [roto(`${r} paso${r > 1 ? 's' : ''} fuera de su tiempo o sin su causa`)] : [bien('Cada paso sigue al anterior')]; },
      minimo: 3,
    },
    predice: {
      pregunta: 'Un texto sobre un huaico, sin palabras como «primero» ni «luego». ¿Qué oración va tercera?',
      opciones: [
        { id: 'c', texto: 'El lodo bajó por la quebrada.', correcta: true },
        { id: 'e1', texto: 'Las familias perdieron sus casas.', error: 'RV29', siFuera: 'Es un efecto, pero del lodo: va después de que baje.' },
        { id: 'e2', texto: 'Llovió tres días seguidos en la sierra.', error: 'RV37', siFuera: 'Es la primera causa de todo: abre el texto.' },
        { id: 'e3', texto: 'El agua saturó la tierra de los cerros.', error: 'RV29', siFuera: 'Va segunda: es lo que produjo la lluvia y lo que soltó el lodo.' },
      ],
      dibujo: { datos: figura('Tema: un huaico', [{ t: 'Las familias perdieron sus casas.' }, { t: 'El lodo bajó por la quebrada.' }, { t: 'Llovió tres días seguidos en la sierra.' }, { t: 'El agua saturó la tierra de los cerros.' }], [0, 1, 2, 3]), estado: {} },
      revelar: { datos: figura('Tema: un huaico', [{ t: 'Llovió tres días seguidos en la sierra.' }, { t: 'El agua saturó la tierra de los cerros.' }, { t: 'El lodo bajó por la quebrada.' }, { t: 'Las familias perdieron sus casas.' }], [0, 1, 2, 3]), estado: { marcas: { s0: 'i', s1: 'i', s2: 'o', s3: 'i' }, sellos: { o: { t: 'Causa antes que efecto', c: 'i' } } } },
      coincide: 'Coincide: cada hecho causa el siguiente; el lodo es el tercer eslabón.',
    },
    mira: {
      datos: figura('Tema: cómo se hace el chuño', CHUNO, PLANES.a),
      pasos: [
        { estado: { marcas: { s0: 'd' } }, texto: '«Primero» abre la serie de pasos.', ecuacion: [marca('primero')] },
        { estado: { marcas: { s0: 'd', s1: 'd', s2: 'd' }, nuevo: ['s1', 's2'] }, texto: '«Luego» y «finalmente» siguen el orden del tiempo.', ecuacion: [marca('primero'), ' → ', marca('luego'), ' → ', marca('finalmente')] },
        { estado: { marcas: { s0: 'd', s1: 'd', s2: 'i', s3: 'o' }, nuevo: ['s3'] }, texto: '«Por eso» va después de su causa: secar el chuño.', ecuacion: [bien('causa'), ' → ', pide('por eso'), ' efecto'] },
      ],
    },
    regla: {
      texto: 'En una secuencia cronológica, el orden lo dan el tiempo y sus marcadores (primero, luego, después). En una de causa y efecto, la causa va antes que lo que produce.',
      ecuacion: [marca('antes'), ' → ', marca('después'), '   ·   ', bien('causa'), ' → ', pide('efecto')],
      condicion: 'las fechas, los marcadores y los conectores del texto mandan sobre la costumbre de ir de lo general a lo particular.',
    },
    ahoraTu: {
      generar(s) {
        const B = [
          { tema: 'un experimento', o: [{ t: 'Primero, llenamos dos vasos con la misma agua.' }, { t: 'Después, pusimos sal solo en uno de ellos.', necesita: [0] }, { t: 'Luego, metimos un huevo en cada vaso.', necesita: [1] }, { t: 'El huevo flotó solo en el agua con sal.', necesita: [2] }], vista: [3, 1, 0, 2], porque: 'Los marcadores ordenan los pasos; el resultado va al final.', malos: c => [[cambiar(c, 1, 2), 'RV29', '«Después» y «luego» quedarían cruzados: la sal va antes del huevo.'], [conclusionPrimero(c), 'RV37', 'El resultado no puede ir antes del experimento.'], [cambiar(c, 0, 1), 'RV29', 'No se pone sal antes de llenar los vasos.']] },
          { tema: 'la deforestación', o: [{ t: 'Se talaron los árboles de la ladera.' }, { t: 'Sin raíces, la tierra quedó suelta.', necesita: [0] }, { t: 'Las lluvias arrastraron esa tierra hacia el río.', necesita: [1] }, { t: 'Por eso, el agua del río bajó turbia.', necesita: [2] }], vista: [2, 0, 3, 1], porque: 'Cada hecho causa el siguiente: tala, tierra suelta, arrastre, agua turbia.', malos: c => [[conclusionPrimero(c), 'RV37', '«Por eso» necesita su causa antes.'], [cambiar(c, 1, 2), 'RV28', '«Esa tierra» necesita antes la tierra suelta.'], [cambiar(c, 0, 1), 'RV29', 'Sin raíces porque se talaron: la tala va primero.']] },
          { tema: 'la vida de Arguedas', o: [{ t: 'José María Arguedas nació en Andahuaylas en 1911.' }, { t: 'De niño, vivió entre familias que hablaban quechua.', necesita: [0] }, { t: 'En 1958 publicó su novela «Los ríos profundos».', necesita: [1] }, { t: 'Murió en Lima en 1969.', necesita: [2] }], vista: [1, 3, 0, 2], porque: 'Las fechas y la vida (niñez, obra, muerte) dan el orden.', malos: c => [[cambiar(c, 1, 2), 'RV29', 'La niñez va antes de 1958.'], [conclusionPrimero(c), 'RV29', '1969 es el último año: no abre.'], [cambiar(c, 2, 3), 'RV29', '1969 va después de 1958.']] },
          { tema: 'la fotosíntesis', o: [{ t: 'La hoja absorbe la luz del sol.' }, { t: 'Con esa energía, transforma agua y dióxido de carbono.', necesita: [0] }, { t: 'Así produce azúcar para la planta.', necesita: [1] }, { t: 'Como resultado, también libera oxígeno al aire.', necesita: [2] }], vista: [3, 0, 2, 1], porque: '«Esa energía», «así» y «como resultado» encadenan causas y efectos.', malos: c => [[cambiar(c, 0, 1), 'RV28', '«Esa energía» necesita antes la luz.'], [conclusionPrimero(c), 'RV37', '«Como resultado» necesita lo anterior.'], [cambiar(c, 1, 2), 'RV28', '«Así» resume la transformación: va después.']] },
          { tema: 'una helada', o: [{ t: 'Anoche la temperatura bajó a diez grados bajo cero.' }, { t: 'El agua de los cultivos se congeló.', necesita: [0] }, { t: 'Las hojas de la papa se quemaron con el hielo.', necesita: [1] }, { t: 'Por eso, la cosecha de este año será menor.', necesita: [2] }], vista: [2, 3, 1, 0], porque: 'La causa va antes que su efecto: frío, hielo, daño, menos cosecha.', malos: c => [[conclusionPrimero(c), 'RV37', '«Por eso» necesita la causa antes.'], [cambiar(c, 1, 2), 'RV29', 'Las hojas se queman por el hielo: el hielo va antes.'], [cambiar(c, 0, 1), 'RV29', 'El agua se congela porque bajó la temperatura.']] },
        ];
        return caso(B[s % B.length], s, `¿Qué orden es coherente para el texto sobre ${B[s % B.length].tema}?`);
      },
    },
  };

  // ---------- Idea 3: analizar y comparar ----------
  // Cambia: el plan (tres órdenes). Permanece: las oraciones de la quena y la zampoña. Progresa: «ambas» y «en
  // cambio» piden que antes estén las dos cosas. Se reserva: el análisis de un todo en partes (predicción).
  // Debe verse: la oración de comparación en su lugar, después de presentar las dos.
  const INSTR = [
    { t: 'La quena y la zampoña son flautas andinas.' },
    { t: 'La quena es un solo tubo con agujeros.', necesita: [0] },
    { t: 'La zampoña, en cambio, une varios tubos de distinto largo.', necesita: [1] },
    { t: 'Ambas se tocan soplando por un extremo.', necesita: [1, 2] },
  ];
  const PLANES3 = { a: [0, 1, 2, 3], b: [0, 3, 1, 2], c: [0, 2, 1, 3] };
  const comparar = {
    id: 'analizar-comparar',
    titulo: 'Presentar antes de comparar',
    temas: ['Secuencias de análisis y comparación'],
    pieza: 'rv-texto',
    juega: {
      consigna: 'Prueba tres planes para comparar la quena y la zampoña. Mira dónde puede ir «ambas» y dónde «en cambio».',
      voz: 'Para comparar, primero deben estar las dos cosas.',
      controles: [{ id: 'p', etiqueta: 'Plan', opciones: [{ valor: 'a', texto: 'Plan A' }, { valor: 'b', texto: 'Plan B' }, { valor: 'c', texto: 'Plan C' }] }],
      dibujo: val => ({ datos: figura('Tema: dos flautas andinas', INSTR, PLANES3[val.p]), estado: estado(INSTR, PLANES3[val.p]) }),
      lectura: val => { const r = rotos(INSTR, PLANES3[val.p]).length; return r ? [roto(`${r} comparación${r > 1 ? 'es' : ''} antes de tiempo`)] : [bien('Se presentan las dos y luego se comparan')]; },
      minimo: 3,
    },
    predice: {
      pregunta: 'Un texto analiza la célula en sus partes. ¿Qué oración va después de «La célula tiene tres partes principales»?',
      opciones: [
        { id: 'c', texto: 'La membrana la rodea y la protege.', correcta: true },
        { id: 'e1', texto: 'Las tres trabajan juntas para mantenerla viva.', error: 'RV37', siFuera: 'Es el cierre del análisis: va después de presentar cada parte.' },
        { id: 'e2', texto: 'Esta parte guarda la información genética.', error: 'RV28', siFuera: '«Esta parte» necesita que antes se nombre cuál.' },
        { id: 'e3', texto: 'Por eso, sin núcleo la célula no se divide.', error: 'RV37', siFuera: '«Por eso» necesita antes la función del núcleo.' },
      ],
      dibujo: { datos: figura('Tema: la célula', [{ t: 'La célula tiene tres partes principales.' }], [0]), estado: { marcas: { s0: 'd' } } },
      revelar: { datos: figura('Tema: la célula', [{ t: 'La célula tiene tres partes principales.' }, { t: 'La membrana la rodea y la protege.' }, { t: 'El citoplasma llena su interior.' }, { t: 'El núcleo guarda la información genética.' }], [0, 1, 2, 3]), estado: { marcas: { s0: 'd', s1: 'i', s2: 'i', s3: 'i' }, sellos: { o: { t: 'Todo → partes', c: 'i' } } } },
      coincide: 'Coincide: tras anunciar el todo, se presenta cada parte por su nombre.',
    },
    mira: {
      datos: figura('Tema: dos flautas andinas', INSTR, PLANES3.a),
      pasos: [
        { estado: { marcas: { s0: 'd' } }, texto: 'La primera presenta las dos cosas que se compararán.', ecuacion: [marca('quena + zampoña')] },
        { estado: { marcas: { s0: 'd', s1: 'i', s2: 'o' }, nuevo: ['s1', 's2'] }, texto: 'Una se describe; «en cambio» marca la diferencia con la otra.', ecuacion: [bien('quena'), ' ≠ ', pide('zampoña')] },
        { estado: { marcas: { s0: 'd', s1: 'i', s2: 'i', s3: 'o' }, nuevo: ['s3'] }, texto: '«Ambas» junta las dos: va cuando ya se conocen.', ecuacion: [pide('ambas'), ' = ', bien('quena'), ' + ', bien('zampoña')] },
      ],
    },
    regla: {
      texto: 'Al analizar, se presenta el todo y luego cada parte. Al comparar, se presentan las dos cosas y después sus diferencias (en cambio) o semejanzas (ambas, también).',
      ecuacion: [marca('todo'), ' → ', bien('partes'), '   ·   ', bien('A'), ' + ', bien('B'), ' → ', pide('comparación')],
      condicion: '«ambas», «en cambio» o «esta parte» solo van cuando ya se nombró lo que retoman.',
    },
    ahoraTu: {
      generar(s) {
        const B = [
          { tema: 'la costa y la sierra', o: [{ t: 'La costa y la sierra tienen climas muy distintos.' }, { t: 'En la costa casi no llueve en todo el año.', necesita: [0] }, { t: 'En la sierra, en cambio, llueve mucho de diciembre a marzo.', necesita: [1] }, { t: 'Por eso, cada región siembra en épocas distintas.', necesita: [2] }], vista: [2, 3, 0, 1], porque: 'Se presentan las dos, se contrastan con «en cambio» y se concluye.', malos: c => [[cambiar(c, 1, 2), 'RV28', '«En cambio» necesita antes lo de la costa.'], [conclusionPrimero(c), 'RV37', '«Por eso» necesita antes las diferencias.'], [[0, 2, 3, 1], 'RV28', 'La costa quedaría al final, después de la conclusión.']] },
          { tema: 'la bicicleta', o: [{ t: 'Una bicicleta tiene tres sistemas básicos.' }, { t: 'El cuadro sostiene todas las piezas.', necesita: [0] }, { t: 'Los pedales y la cadena mueven la rueda trasera.', necesita: [0] }, { t: 'Los frenos detienen las dos ruedas.', necesita: [0] }], vista: [3, 1, 0, 2], porque: 'Primero el todo («tres sistemas»), luego cada parte.', malos: c => [[[1, 0, 2, 3], 'RV28', 'El cuadro no puede ir antes de anunciar los sistemas.'], [[3, 2, 1, 0], 'RV37', 'El todo va primero; las partes después.'], [[2, 3, 0, 1], 'RV28', 'Las partes no van antes de presentar el todo.']] },
          { tema: 'el loro y la lechuza', o: [{ t: 'El loro y la lechuza son aves muy distintas.' }, { t: 'El loro está activo de día y come frutas.', necesita: [0] }, { t: 'La lechuza, por el contrario, caza de noche.', necesita: [1] }, { t: 'Las dos, sin embargo, tienen un pico curvo.', necesita: [1, 2] }], vista: [3, 0, 2, 1], porque: 'Se presentan las dos aves, se contrastan y al final se dice en qué se parecen.', malos: c => [[cambiar(c, 1, 2), 'RV28', '«Por el contrario» necesita antes lo del loro.'], [conclusionPrimero(c), 'RV28', '«Las dos» necesita antes a las dos aves.'], [[0, 3, 1, 2], 'RV28', '«Las dos» va cuando ya se presentó a cada una.']] },
          { tema: 'un volcán', o: [{ t: 'Un volcán tiene tres partes visibles.' }, { t: 'El cráter es la abertura de la cima.', necesita: [0] }, { t: 'La chimenea une el cráter con el interior.', necesita: [1] }, { t: 'El cono se forma con la lava que se enfría.', necesita: [0] }], vista: [2, 0, 3, 1], porque: 'Primero el todo; la chimenea va tras el cráter, porque lo menciona.', malos: c => [[cambiar(c, 1, 2), 'RV28', 'La chimenea menciona el cráter: va después de él.'], [[3, 0, 1, 2], 'RV28', 'El cono no puede ir antes de anunciar las partes.'], [[1, 2, 3, 0], 'RV37', 'El todo va primero, no al final.']] },
          { tema: 'dos mercados', o: [{ t: 'El mercado del centro y el de la feria son muy diferentes.' }, { t: 'El del centro abre todos los días y tiene techo.', necesita: [0] }, { t: 'El de la feria, en cambio, se arma solo los domingos al aire libre.', necesita: [1] }, { t: 'Ambos, sin embargo, venden productos de la zona.', necesita: [1, 2] }], vista: [1, 3, 2, 0], porque: 'Presentar los dos, contrastar y luego decir en qué coinciden.', malos: c => [[cambiar(c, 1, 2), 'RV28', '«En cambio» necesita antes el mercado del centro.'], [conclusionPrimero(c), 'RV28', '«Ambos» necesita antes a los dos mercados.'], [[0, 3, 1, 2], 'RV28', '«Ambos» va cuando ya se describió a cada uno.']] },
        ];
        return caso(B[s % B.length], s, `¿Qué orden es coherente para el texto sobre ${B[s % B.length].tema}?`);
      },
    },
  };

  return {
    unidad: 'razonamiento-verbal.plan-de-redaccion',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rv-texto.js'],
    historia: {
      texto: 'Ordenar lo que se va a decir ya era un problema de la retórica clásica: en el libro III de la Retórica, Aristóteles trató la disposición de las partes del discurso. En el siglo XX, Flower y Hayes estudiaron cómo se planifica, se escribe y se revisa, una y otra vez. El orden se justifica por lo que cada idea necesita.',
      pregunta: '¿Qué necesita saber el lector antes de leer «ellas»?',
      fuente: { titulo: 'Matriz de teoría de razonamiento verbal (Retórica; Flower y Hayes)', url: 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/diccio_ele/diccionario/progresiontematica.htm' },
    },
    ideas: [temaSubtemas, tiempoCausa, comparar],
  };
});
