/*
 * Teoría de «Eliminación de oraciones» (razonamiento-verbal.eliminacion-de-oraciones). Molde: docs/teoria.md.
 * Contenido: matriz de verbal (unidad 5), historia (revisión de textos: Bereiter y Scardamalia 1987; Hayes 1996) y
 * códigos RV30–RV32 y RV38. Textos propios (regla 5).
 * Ruta A · Argumentar: se tapa una oración, se relee el texto y se ve qué se pierde.
 *
 * Ficha de tarea:
 *   Promesa: eliminar la oración que no aporta, justificándolo con lo que el texto conserva.
 *   Persona y condiciones: postulante de 3.º a 5.º, celular, sin audio; eliminación de oraciones (UNI, semana 6).
 *   Resultado observable: dice qué se pierde al tapar cada oración y elige la que no deja pérdida.
 *   Orden de atención: 1.º el tema (título) · 2.º la oración tapada · 3.º qué se pierde (lectura) · acción: tapar otra.
 *   Estados: tapada sin pérdida (se puede eliminar) · tapada con pérdida (se necesita).
 *   Duda que resuelve: ¿por qué no se elimina la oración que dice el dato nuevo, aunque parezca de más?
 *
 * Colores (regla 4): lo que el texto conserva i (turquesa, continuo), la oración que se prueba quitar o (naranja,
 * discontinuo), el tema d (verde, punteado), lo que sobra o choca h (rojo).
 * Códigos: RV30 (dato nuevo pertinente eliminado), RV31 (incompatible que coincide con lo que se cree), RV32
 * (redundancia por paráfrasis no vista), RV38 (se saca la que presenta el tema); RVE1 (contraste tomado por
 * contradicción) es hipótesis nueva.
 */
(function (root, fabrica) {
  const def = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const queda = t => ({ v: 'c-i', t }), prueba = t => ({ v: 'c-o', t }), tema = t => ({ v: 'c-d', t }), sobra = t => ({ v: 'c-h', t });
  const voltear = (arr, s) => (s % 2 ? arr.slice().reverse() : arr.slice());
  // Texto: el tema como título y las oraciones numeradas, una por renglón.
  const lista = (titulo, oraciones) => ({ secciones: [{ id: 'o', titulo, modo: 'lista', fragmentos: oraciones.map((t, k) => ({ id: `o${k + 1}`, t })) }] });
  // Estado al tapar la oración k: tapada; si se puede eliminar, sello «Sin pérdida»; si no, se marca lo que la necesita.
  const tapar = (k, sinPerdida, marcas = {}, extra = {}) => Object.assign({ tapar: [`o${k}`], marcas, sellos: { o: sinPerdida ? { t: 'Sin pérdida', c: 'i' } : { t: 'Se pierde algo', c: 'h' } } }, extra);
  // Ahora tú: un texto corto y la pregunta «¿qué oración se elimina?»; las opciones son los números.
  function caso(b, s, criterio) {
    const malas = voltear(Object.entries(b.por), s).map(([k, [error, siFuera]]) => ({ id: `e${k}`, texto: `Oración ${k}`, error, siFuera }));
    return {
      pregunta: `En el texto sobre ${b.tema}, ¿qué oración se debe eliminar por ${criterio}?`,
      dibujo: { datos: lista(`Tema: ${b.tema}`, b.o), estado: {} },
      opciones: [{ id: 'c', texto: `Oración ${b.sobra}`, correcta: true }, ...malas],
      solucion: { texto: b.porque, ecuacion: [sobra(`oración ${b.sobra}`), ' → ', queda('el texto no pierde nada')], dibujo: { datos: lista(`Tema: ${b.tema}`, b.o), estado: { marcas: { [`o${b.sobra}`]: 'h' } } } },
    };
  }

  // ---------- Idea 1: repetir con otras palabras ----------
  // Cambia: la oración tapada. Permanece: el texto del cuy. Progresa: qué se pierde con cada una.
  // Se reserva: la redundancia por paráfrasis en otro texto (predicción). Debe verse: que la 4 tapada no deja hueco.
  const CUY = ['El cuy se cría en muchas casas de los Andes.', 'Su carne tiene mucha proteína y poca grasa.', 'Por eso, es un alimento muy nutritivo.', 'La carne de cuy aporta bastante proteína con poco contenido graso.', 'Además, criarlo cuesta poco: come restos de verduras.'];
  const PIERDE_CUY = {
    1: ['Se pierde de qué animal se habla', { o2: 'i' }],
    2: ['Se pierde la razón del «por eso»', { o3: 'i' }],
    3: ['Se pierde la conclusión del texto', {}],
    4: ['No se pierde nada: repite la 2', { o2: 'i' }],
    5: ['Se pierde un dato nuevo: el costo', {}],
  };
  const redundancia = {
    id: 'redundancia',
    titulo: 'Lo que repite sin aportar',
    temas: ['Redundancia'],
    pieza: 'rv-texto',
    juega: {
      consigna: 'Tapa una oración y relee el texto sin ella. Busca la que puedes quitar sin que se pierda nada.',
      voz: 'Relee todo el texto después de tapar.',
      controles: [{ id: 'k', etiqueta: 'Tapar', opciones: [1, 2, 3, 4, 5].map(k => ({ valor: k, texto: `${k}` })) }],
      dibujo: val => ({ datos: lista('Tema: el cuy como alimento', CUY), estado: tapar(val.k, val.k === 4, PIERDE_CUY[val.k][1]) }),
      lectura: val => [val.k === 4 ? queda(PIERDE_CUY[val.k][0]) : sobra(PIERDE_CUY[val.k][0])],
      minimo: 3,
    },
    predice: {
      pregunta: 'En este texto sobre el colibrí, ¿qué oración se elimina por redundante?',
      voz: 'Una oración puede repetir sin usar las mismas palabras.',
      opciones: [
        { id: 'c', texto: 'Oración 3', correcta: true },
        { id: 'e1', texto: 'Oración 1', error: 'RV38', siFuera: 'La 1 presenta al colibrí: sin ella, no se sabe de qué se habla.' },
        { id: 'e2', texto: 'Oración 4', error: 'RV30', siFuera: 'La 4 trae un dato nuevo, el néctar; sin ella se pierde por qué come tanto.' },
        { id: 'e5', texto: 'Oración 2', error: 'RV32', siFuera: 'La 2 dice lo de las alas; la 3 la repite. Una de las dos sobra.' },
      ],
      dibujo: { datos: lista('Tema: el colibrí', ['El colibrí es el ave más pequeña de América.', 'Mueve sus alas hasta ochenta veces por segundo.', 'Sus alas se agitan muchísimas veces en cada segundo.', 'Por eso, necesita comer néctar casi todo el día.']), estado: {} },
      revelar: { datos: lista('Tema: el colibrí', ['El colibrí es el ave más pequeña de América.', 'Mueve sus alas hasta ochenta veces por segundo.', 'Sus alas se agitan muchísimas veces en cada segundo.', 'Por eso, necesita comer néctar casi todo el día.']), estado: tapar(3, true, { o2: 'i' }) },
      coincide: 'Coincide: la 3 dice lo mismo que la 2, con otras palabras y menos precisión.',
    },
    mira: {
      datos: lista('Tema: el cuy como alimento', CUY),
      voz: 'Tapa, relee, decide.',
      pasos: [
        { estado: { marcas: { o2: 'i', o4: 'o' } }, texto: 'La 2 y la 4 hablan de proteína y grasa.', ecuacion: [queda('2'), ' ≈ ', prueba('4')] },
        { estado: tapar(2, false, { o3: 'h', o4: 'o' }, { nuevo: ['o2', 'o3'] }), texto: 'Si se tapa la 2, el «por eso» de la 3 queda sin razón.', ecuacion: [prueba('sin 2'), ' → ', sobra('«por eso» sin razón')] },
        { estado: tapar(4, true, { o2: 'i', o3: 'i' }, { nuevo: ['o4'] }), texto: 'Si se tapa la 4, todo sigue igual: la 2 ya lo dijo.', ecuacion: [prueba('sin 4'), ' → ', queda('nada se pierde')] },
      ],
    },
    regla: {
      texto: 'Una oración es redundante si repite, aunque sea con otras palabras, lo que otra ya dijo. Al quitarla, el texto no pierde información ni enlaces.',
      ecuacion: [prueba('oración'), ' redundante si ', queda('texto sin ella'), ' = ', queda('texto con ella')],
      condicion: 'se quita la que repite, no la que otra necesita (la razón de un «por eso» o la que presenta el tema).',
    },
    ahoraTu: {
      generar(s) {
        const B = [
          { tema: 'la papa', o: ['El Perú tiene más de tres mil variedades de papa.', 'Muchas se cultivan sobre los tres mil metros.', 'Existen más de tres mil tipos distintos de papa en el país.', 'Algunas se convierten en chuño con las heladas.'], sobra: 3, porque: 'La 3 repite con otras palabras lo que dice la 1.', por: { 1: ['RV38', 'La 1 presenta el tema; la 3 la repite. Se quita la que llega después.'], 2: ['RV30', 'La 2 da un dato nuevo: la altura de los cultivos.'], 4: ['RV30', 'La 4 da un dato nuevo: el chuño.'] } },
          { tema: 'el reciclaje', o: ['Reciclar reduce la basura que llega a los botaderos.', 'El plástico tarda siglos en degradarse.', 'Separar los residuos en casa facilita el reciclaje.', 'Los botaderos reciben menos desechos cuando reciclamos.'], sobra: 4, porque: 'La 4 repite la 1 con otras palabras.', por: { 1: ['RV38', 'La 1 abre el tema; la 4 es la que la repite después.'], 2: ['RV30', 'La 2 explica por qué el plástico es un problema: aporta.'], 3: ['RV30', 'La 3 dice cómo ayudar en casa: es nueva.'] } },
          { tema: 'el cóndor', o: ['El cóndor andino puede volar sin aletear durante horas.', 'Aprovecha las corrientes de aire caliente que suben.', 'Sus alas abiertas miden más de tres metros.', 'Es capaz de planear largo rato sin mover las alas.'], sobra: 4, porque: 'La 4 dice lo mismo que la 1.', por: { 1: ['RV38', 'La 1 presenta la idea; la 4 la repite.'], 2: ['RV30', 'La 2 explica cómo lo logra: es nueva.'], 3: ['RV30', 'La 3 da la medida de las alas: es nueva.'] } },
          { tema: 'el agua potable', o: ['Muchas comunidades rurales no tienen agua potable.', 'Sus familias deben hervir el agua antes de tomarla.', 'En numerosos pueblos del campo falta el agua apta para beber.', 'Algunas municipalidades instalan cloradores en los reservorios.'], sobra: 3, porque: 'La 3 repite la 1 con otras palabras.', por: { 1: ['RV38', 'La 1 presenta el problema; la 3 lo repite.'], 2: ['RV30', 'La 2 dice qué hacen las familias: aporta.'], 4: ['RV30', 'La 4 trae una solución: es nueva.'] } },
          { tema: 'la alpaca', o: ['La alpaca se cría por su fibra fina y abrigadora.', 'Con esa fibra se tejen chompas y chalinas.', 'Su lana es delgada y protege muy bien del frío.', 'Puno es la región con más alpacas del país.'], sobra: 3, porque: 'La 3 repite la 1: fina y abrigadora.', por: { 1: ['RV38', 'La 1 abre el tema; la 3 es la repetición.'], 2: ['RV30', 'La 2 dice para qué se usa: aporta.'], 4: ['RV30', 'La 4 da un dato nuevo: dónde hay más.'] } },
        ];
        return caso(B[s % B.length], s, 'redundancia');
      },
    },
  };

  // ---------- Idea 2: fuera del tema, aunque comparta palabras ----------
  // Cambia: la oración tapada. Permanece: el texto de la quena. Progresa: lo que se pierde con cada una.
  // Se reserva: la oración con dato nuevo pertinente (predicción). Debe verse: que la 4 comparte «caña» y no habla de la quena.
  const QUENA = ['La quena es una flauta andina de caña o de hueso.', 'Tiene seis agujeros arriba y uno abajo para el pulgar.', 'El sonido cambia según los agujeros que se tapan.', 'La caña también sirve para hacer techos y canastas.', 'Así, con la quena se tocan melodías de muchas notas.'];
  const PIERDE_QUENA = {
    1: ['Se pierde qué es la quena', {}], 2: ['Se pierde cómo son sus agujeros', { o3: 'i' }], 3: ['Se pierde para qué sirven los agujeros', { o5: 'i' }],
    4: ['No se pierde nada de la quena', { o1: 'i' }], 5: ['Se pierde la conclusión', {}],
  };
  const impertinencia = {
    id: 'impertinencia',
    titulo: 'Lo que habla de otro asunto',
    temas: ['Impertinencia'],
    pieza: 'rv-texto',
    juega: {
      consigna: 'Tapa cada oración del texto sobre la quena. Busca la que no dice nada de la quena.',
      voz: 'Compartir una palabra no es hablar del mismo tema.',
      controles: [{ id: 'k', etiqueta: 'Tapar', opciones: [1, 2, 3, 4, 5].map(k => ({ valor: k, texto: `${k}` })) }],
      dibujo: val => ({ datos: lista('Tema: la quena', QUENA), estado: tapar(val.k, val.k === 4, PIERDE_QUENA[val.k][1]) }),
      lectura: val => [val.k === 4 ? queda(PIERDE_QUENA[val.k][0]) : sobra(PIERDE_QUENA[val.k][0])],
      minimo: 3,
    },
    predice: {
      pregunta: 'En este texto sobre el puente de Q’eswachaka, ¿qué oración se elimina por impertinente?',
      opciones: [
        { id: 'c', texto: 'Oración 4', correcta: true },
        { id: 'e1', texto: 'Oración 3', error: 'RV30', siFuera: 'La 3 trae un dato nuevo, pero del puente: cada año se renueva.' },
        { id: 'e2', texto: 'Oración 1', error: 'RV38', siFuera: 'La 1 presenta el puente: sin ella no se sabe de qué se habla.' },
        { id: 'e3', texto: 'Oración 2', error: 'RV30', siFuera: 'La 2 dice de qué está hecho el puente: es parte del tema.' },
      ],
      dibujo: { datos: lista('Tema: el puente de Q’eswachaka', ['El puente de Q’eswachaka cruza el río Apurímac, en Cusco.', 'Está tejido con fibra de ichu, una paja de la puna.', 'Cada año, las comunidades lo renuevan en cuatro días.', 'El ichu también alimenta a llamas y alpacas.']), estado: {} },
      revelar: { datos: lista('Tema: el puente de Q’eswachaka', ['El puente de Q’eswachaka cruza el río Apurímac, en Cusco.', 'Está tejido con fibra de ichu, una paja de la puna.', 'Cada año, las comunidades lo renuevan en cuatro días.', 'El ichu también alimenta a llamas y alpacas.']), estado: { marcas: { o4: 'h', o2: 'i' }, sellos: { o: { t: 'La 4 habla del ichu', c: 'h' } } } },
      coincide: 'Coincide: la 4 comparte «ichu», pero habla del alimento de animales, no del puente.',
    },
    mira: {
      datos: lista('Tema: la quena', QUENA),
      pasos: [
        { estado: { marcas: { o1: 'd' } }, texto: 'El tema es la quena: qué es, cómo es y cómo suena.', ecuacion: [tema('tema: la quena')] },
        { estado: { marcas: { o1: 'd', o4: 'o' }, nuevo: ['o4'] }, texto: 'La 4 repite «caña», pero habla de techos y canastas.', ecuacion: [prueba('4'), ': caña ≠ ', tema('quena')] },
        { estado: tapar(4, true, { o1: 'i', o2: 'i', o3: 'i', o5: 'i' }, { nuevo: ['o4'] }), texto: 'Sin la 4, el texto habla solo de la quena y no pierde nada.', ecuacion: [sobra('4'), ' fuera → ', queda('texto completo')] },
      ],
    },
    regla: {
      texto: 'Una oración es impertinente si se aparta del tema del texto, aunque repita alguna de sus palabras. Las demás desarrollan el tema; ella habla de otra cosa.',
      ecuacion: [prueba('oración'), ' impertinente si no habla de ', tema('el tema')],
      condicion: 'primero se nombra el tema del conjunto; un dato nuevo que sí habla del tema no es impertinente.',
    },
    ahoraTu: {
      generar(s) {
        const B = [
          { tema: 'el lago Titicaca', o: ['El Titicaca está a más de 3800 metros de altura.', 'Lo comparten el Perú y Bolivia.', 'En sus orillas crece la totora.', 'Bolivia también tiene el salar de Uyuni.'], sobra: 4, porque: 'La 4 nombra a Bolivia, pero habla del salar, no del lago.', por: { 1: ['RV38', 'La 1 presenta el lago con su altura.'], 2: ['RV30', 'La 2 dice qué países lo comparten: es del tema.'], 3: ['RV30', 'La 3 habla de sus orillas: es del tema.'] } },
          { tema: 'la vacuna', o: ['Una vacuna enseña al cuerpo a reconocer un microbio.', 'Así, el cuerpo se defiende más rápido si lo encuentra.', 'Las vacunas se guardan en frío para que no se dañen.', 'El frío de la puna puede causar resfríos.'], sobra: 4, porque: 'La 4 repite «frío», pero habla del clima, no de vacunas.', por: { 1: ['RV38', 'La 1 dice qué es una vacuna: presenta el tema.'], 2: ['RV30', 'La 2 dice para qué sirve: es del tema.'], 3: ['RV30', 'La 3 es un dato nuevo, pero de las vacunas.'] } },
          { tema: 'el sueño', o: ['Dormir bien ayuda a recordar lo estudiado.', 'Durante el sueño, el cerebro ordena lo aprendido.', 'Los murciélagos duermen colgados de cabeza.', 'Por eso, trasnocharse antes de un examen no conviene.'], sobra: 3, porque: 'La 3 habla de murciélagos, no del sueño y el estudio.', por: { 1: ['RV38', 'La 1 presenta la idea del texto.'], 2: ['RV30', 'La 2 explica por qué: es del tema.'], 4: ['RV30', 'La 4 es la conclusión del tema.'] } },
          { tema: 'el maíz morado', o: ['El maíz morado se cultiva en los valles andinos.', 'Con él se prepara la chicha morada.', 'Su color se debe a unos pigmentos llamados antocianinas.', 'La chicha de jora se hace con maíz amarillo germinado.'], sobra: 4, porque: 'La 4 habla de otra chicha y de otro maíz.', por: { 1: ['RV38', 'La 1 presenta el maíz morado.'], 2: ['RV30', 'La 2 dice para qué se usa: es del tema.'], 3: ['RV30', 'La 3 explica su color: es un dato del tema.'] } },
          { tema: 'los terremotos', o: ['El Perú está sobre una zona de muchos terremotos.', 'Allí, una placa del océano se mete bajo el continente.', 'Las casas de adobe sin refuerzo resisten poco.', 'El adobe se hace con barro y paja secados al sol.'], sobra: 4, porque: 'La 4 explica el adobe, no los terremotos.', por: { 1: ['RV38', 'La 1 presenta el tema.'], 2: ['RV30', 'La 2 explica la causa: es del tema.'], 3: ['RV30', 'La 3 habla del daño de los terremotos: es del tema.'] } },
        ];
        return caso(B[s % B.length], s, 'impertinencia');
      },
    },
  };

  // ---------- Idea 3: lo que contradice, no lo que contrasta ----------
  // Cambia: la oración tapada. Permanece: el texto de la laguna. Progresa: la 3 (contraste) se conserva; la 4
  // (contradicción) se elimina. Se reserva: el contraste en otro texto (predicción). Debe verse: la 4 frente a la 1.
  const LAGUNA = ['La laguna de la comunidad se secó en el verano de 2024.', 'Las lluvias de ese año fueron muy escasas.', 'Sin embargo, los pozos cercanos aún tenían algo de agua.', 'Ese verano, la laguna estuvo llena hasta el borde.', 'Por eso, cuidaron más el agua de los pozos.'];
  const PIERDE_LAG = {
    1: ['Se pierde el hecho principal', {}], 2: ['Se pierde la causa', { o1: 'i' }], 3: ['Se pierde la razón de cuidar los pozos', { o5: 'i' }],
    4: ['No se pierde nada: choca con la 1', { o1: 'i' }], 5: ['Se pierde la decisión final', {}],
  };
  const incompatibilidad = {
    id: 'incompatibilidad',
    titulo: 'Contradecir no es contrastar',
    temas: ['Incompatibilidad'],
    pieza: 'rv-texto',
    juega: {
      consigna: 'Tapa cada oración del texto de la laguna. Busca la que choca con lo que el texto ya dio por cierto.',
      voz: 'Un «sin embargo» no siempre es una contradicción.',
      controles: [{ id: 'k', etiqueta: 'Tapar', opciones: [1, 2, 3, 4, 5].map(k => ({ valor: k, texto: `${k}` })) }],
      dibujo: val => ({ datos: lista('Tema: la laguna seca', LAGUNA), estado: tapar(val.k, val.k === 4, PIERDE_LAG[val.k][1]) }),
      lectura: val => [val.k === 4 ? queda(PIERDE_LAG[val.k][0]) : sobra(PIERDE_LAG[val.k][0])],
      minimo: 3,
    },
    predice: {
      pregunta: 'Texto sobre la feria escolar. ¿Qué oración se elimina por incompatible?',
      opciones: [
        { id: 'c', texto: 'Oración 4', correcta: true },
        { id: 'e1', texto: 'Oración 2', error: 'RVE1', siFuera: 'La 2 marca un contraste, pero no niega nada: la feria pudo ser exitosa con lluvia.' },
        { id: 'e2', texto: 'Oración 3', error: 'RV30', siFuera: 'La 3 da un dato nuevo que confirma el éxito: aporta.' },
        { id: 'e3', texto: 'Oración 1', error: 'RV38', siFuera: 'La 1 da el hecho principal; la 4 es la que lo niega.' },
      ],
      dibujo: { datos: lista('Tema: la feria escolar', ['La feria de ciencias del colegio fue un éxito.', 'Aunque llovió, llegaron más de trescientos visitantes.', 'Los grupos vendieron todos sus productos.', 'Casi nadie asistió a la feria de ciencias.']), estado: {} },
      revelar: { datos: lista('Tema: la feria escolar', ['La feria de ciencias del colegio fue un éxito.', 'Aunque llovió, llegaron más de trescientos visitantes.', 'Los grupos vendieron todos sus productos.', 'Casi nadie asistió a la feria de ciencias.']), estado: { marcas: { o4: 'h', o2: 'i', o1: 'i' }, sellos: { o: { t: 'La 4 niega la 2', c: 'h' } } } },
      coincide: 'Coincide: si llegaron trescientos, no es verdad que casi nadie asistió.',
    },
    mira: {
      datos: lista('Tema: la laguna seca', LAGUNA),
      pasos: [
        { estado: { marcas: { o1: 'i' } }, texto: 'La 1 da por cierto un hecho: la laguna se secó.', ecuacion: [queda('se secó')] },
        { estado: { marcas: { o1: 'i', o3: 'o' }, nuevo: ['o3'] }, texto: 'La 3 trae «sin embargo», pero habla de los pozos: no niega la 1.', ecuacion: [prueba('3'), ': contraste, compatible'] },
        { estado: { marcas: { o1: 'i', o4: 'h' }, nuevo: ['o4'] }, texto: 'La 4 dice lo contrario de la 1, en el mismo verano.', ecuacion: [queda('se secó'), ' ≠ ', sobra('estuvo llena')] },
        { estado: tapar(4, true, { o1: 'i', o3: 'i' }, { nuevo: ['o4'] }), texto: 'Sin la 4, el texto ya no se contradice.', ecuacion: [sobra('4'), ' fuera → ', queda('texto coherente')] },
      ],
    },
    regla: {
      texto: 'Una oración es incompatible si contradice lo que el texto ya afirmó, sobre lo mismo y en el mismo momento. Un contraste con «sin embargo» puede ser compatible.',
      ecuacion: [queda('A'), ' y ', sobra('no A'), ' no pueden ser verdaderas a la vez'],
      condicion: 'las dos oraciones hablan de lo mismo, en el mismo tiempo y lugar; si no, quizá solo contrastan.',
    },
    ahoraTu: {
      generar(s) {
        const B = [
          { tema: 'el viaje a Arequipa', o: ['El bus a Arequipa salió puntual a las ocho.', 'Sin embargo, llegó con una hora de retraso.', 'El bus partió casi a mediodía.', 'Los pasajeros descansaron en el camino.'], sobra: 3, porque: 'La 3 contradice la 1: no pudo salir a las ocho y a mediodía.', por: { 1: ['RV38', 'La 1 da el hecho; la 3 es la que lo niega.'], 2: ['RVE1', 'La 2 contrasta, pero es compatible: salir puntual y llegar tarde.'], 4: ['RV30', 'La 4 añade un dato compatible.'] } },
          { tema: 'la biblioteca', o: ['La biblioteca del barrio abre todos los días.', 'Los domingos atiende solo por la mañana.', 'Tiene una sala con computadoras.', 'Los domingos permanece cerrada todo el día.'], sobra: 4, porque: 'La 4 contradice la 1 y la 2: los domingos sí abre en la mañana.', por: { 1: ['RV38', 'La 1 da el hecho principal.'], 2: ['RVE1', 'La 2 precisa el horario; no contradice la 1.'], 3: ['RV30', 'La 3 añade un dato compatible.'] } },
          { tema: 'la cosecha', o: ['Este año la cosecha de papa fue abundante.', 'Las heladas llegaron tarde y no dañaron las plantas.', 'Aun así, el precio en el mercado bajó.', 'Las heladas destruyeron casi toda la cosecha.'], sobra: 4, porque: 'La 4 contradice la 1 y la 2.', por: { 1: ['RV38', 'La 1 da el hecho principal.'], 2: ['RV30', 'La 2 explica la buena cosecha: es compatible.'], 3: ['RVE1', 'La 3 contrasta, pero no niega: hay mucha papa y baja el precio.'] } },
          { tema: 'el equipo de vóley', o: ['El equipo del colegio nunca ha perdido un partido este año.', 'Ganó los seis partidos del campeonato.', 'Su capitana es la más baja del grupo.', 'En marzo, el equipo perdió la final por un punto.'], sobra: 4, porque: 'La 4 contradice la 1: si perdió en marzo, sí perdió este año.', por: { 1: ['RV38', 'La 1 da el hecho principal.'], 2: ['RV30', 'La 2 lo confirma con un dato.'], 3: ['RVE1', 'La 3 sorprende, pero no contradice nada.'] } },
          { tema: 'la tienda de Rosa', o: ['Rosa abrió su tienda en enero.', 'Al comienzo vendía poco, pero luego ganó clientes.', 'Hoy vende frutas y verduras de la zona.', 'Rosa todavía no ha abierto su tienda.'], sobra: 4, porque: 'La 4 contradice la 1: la tienda ya está abierta.', por: { 1: ['RV38', 'La 1 da el hecho principal.'], 2: ['RVE1', 'La 2 contrasta dos momentos; es compatible.'], 3: ['RV30', 'La 3 añade un dato compatible.'] } },
        ];
        return caso(B[s % B.length], s, 'incompatibilidad');
      },
    },
  };

  return {
    unidad: 'razonamiento-verbal.eliminacion-de-oraciones',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rv-texto.js'],
    historia: {
      texto: 'Revisar un texto es decidir qué conservar, cambiar o quitar. Bereiter y Scardamalia, en 1987, describieron la revisión como comparar el texto que hay con el que se quiere, encontrar el desajuste y cambiarlo. Por eso eliminar responde al propósito del texto: una repetición también puede ser útil.',
      pregunta: '¿Cómo sabes que una oración sobra?',
      fuente: { titulo: 'Matriz de teoría de razonamiento verbal (revisión de textos)', url: 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/diccio_ele/diccionario/coherencia.htm' },
    },
    ideas: [redundancia, impertinencia, incompatibilidad],
  };
});
