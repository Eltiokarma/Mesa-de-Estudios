/*
 * Generador «Sentido contextual»: práctica de las cinco ideas de razonamiento-verbal.sentido-contextual
 * (contenido/teoria/razonamiento-verbal/sentido-contextual.js; propuesta en docs/etapa7/propuesta-verbal.md). Formato
 * "predicciones" (docs/arquitectura.md). Funciona en el navegador (window.Generadores['sentido-contextual']) y en Node.
 *
 * Regla 1 en verbal: la respuesta no la decide un texto escrito a mano, la calcula el código con un mundo chico. Cada
 * ítem del banco trae su oración, su palabra y cada alternativa con una etiqueta: lo que esa palabra hace en la oración
 * (la que dice lo que se pide, otra acepción, mismo campo, parecido de forma, otro rasgo, lo contrario de lo que se
 * pide, otra valoración, otro grado, otra cosa, comodín, choca, lectura literal o figurada, idea propia, contraste al
 * revés). El generador elige como correcta la única alternativa con la etiqueta buena, y arma el código y la
 * explicación de cada incorrecta con su etiqueta. Si el banco no cuadra (ninguna o dos buenas, dos incorrectas con el
 * mismo código), lanza un error: generador.test.js lo recorre entero. Oraciones propias; ninguna copia un examen.
 *
 * Tipos por idea (TIPOS_POR_IDEA; nivel 2 con cuatro alternativas, nivel 3 con cinco, como en un simulacro). generar(
 * semilla, { idea }) da solo los de esa idea; sin idea, las cinco con el mismo peso.
 *   acepcion             acepcion (2) · acepcion-examen (3)
 *   denota-connota       valor (2) · valor-examen (3)
 *   palabra-precisa      precisa (2) · precisa-examen (3)
 *   sentido-figurado     figurado (2) · figurado-examen (3)
 *   inferir-significado  pistas (2) · pistas-examen (3)
 * Errores (docs/investigacion/razonamiento-verbal-ideas-erroneas.md): RV18, RV19, RV20, RV21, RV23 y, hipótesis de la
 * unidad, RVS1 a RVS8.
 * Datos (contrato, punto 13): el criterio de la idea (las mismas líneas que la teoría); nunca la respuesta.
 * _datos: { idea, tipo, nivel, item, codigos }.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar, nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'sentido-contextual';
  const FUENTE = 'docs/investigacion/razonamiento-verbal-ideas-erroneas.md';
  const RESPALDO = { RV18: 'parcial', RV19: 'parcial', RV20: 'parcial' };
  const err = (id, explicacion) => ({ id, explicacion, respaldo: RESPALDO[id] || 'hipotesis', fuente: FUENTE });
  // Las incorrectas que se muestran: k al azar, de modo que la correcta no sea la más larga ni la más corta (lección de
  // la auditoría de Definiciones). Si ninguna mezcla sirve, el banco no cuadra y se lanza un error.
  function elegir(rng, malas, k, correcta) {
    const sirve = xs => { const l = xs.map(x => x.t.length), c = correcta.length; return c < Math.max(...l) && c > Math.min(...l); };
    for (let n = 0; n < 80; n++) { const xs = rng.barajar(malas).slice(0, k); if (sirve(xs)) return xs; }
    throw new Error(`${ID}: con «${correcta}» ninguna mezcla deja la correcta entre la más corta y la más larga`);
  }

  // Las líneas de datos, las mismas de la teoría.
  const D = {
    ACEP: 'Acepción: cada uno de los significados que puede tener una palabra.',
    SINC: 'Sinónimo en contexto: dice lo mismo que la palabra, en la acepción que usa el texto.',
    ANTC: 'Antónimo en contexto: dice lo contrario de la palabra, en la acepción que usa el texto.',
    PISTA: 'Pista: la parte del texto que decide qué acepción usa la palabra.',
    DEN: 'Denotación: lo que la palabra describe, sin ningún juicio.',
    CON: 'Connotación: la valoración que la palabra suma a lo que describe: elogio, crítica o ninguna.',
    GRADO: 'Otro grado: la palabra valora igual, pero con más o con menos fuerza que la del texto.',
    PREC: 'Palabra precisa: nombra justo lo que dice la oración y no choca con ninguna de sus partes.',
    COMOD: 'Comodín: palabra tan general (hacer, dar, tener, cosa) que encaja en casi todo y dice poco.',
    CHOCA: 'Choca: la palabra va con una parte de la oración, pero contradice otra.',
    LIT: 'Sentido literal: lo que las palabras nombran tal cual.',
    FIG: 'Sentido figurado: la palabra nombra otra cosa que se le parece.',
    FRASE: 'Frase hecha: grupo de palabras con un sentido fijo, que no es la suma de sus palabras.',
    PISTA5: 'Pista: una explicación, un ejemplo, un contraste o una consecuencia que habla de la palabra.',
    DEDUC: 'Deducir: sacar del texto algo que no está dicho con esas mismas palabras.',
    DETALLE: 'Detalle cercano: algo que el texto cuenta junto a la palabra, pero que no dice qué significa.',
  };

  // ---------------- El banco ----------------
  // Cada ítem: { id, o (la oración; en la idea 3, con «___» en el hueco), w (la palabra o expresión), pide?, alts:
  // [[texto, etiqueta], …] } con una OK y cuatro incorrectas. Etiquetas: OK · ACEP otra acepción · CAMPO mismo campo ·
  // FORMA parecido de forma · RASGO otro rasgo · INV lo contrario de lo que se pide · VAL otra valoración · GRADO otro
  // grado · OTRA otra cosa · COMOD comodín · CHOCA choca · LIT lectura literal · FIG lectura figurada · PROPIA idea
  // propia o detalle cercano · CREV contraste al revés.
  const ACEPCION = [
    { id: 'cerro', w: 'cerró', pide: 'sinónimo', o: 'El alcalde cerró el trato con la empresa: los dos firmaron el contrato.',
      alts: [['acordó', 'OK'], ['clausuró', 'ACEP'], ['discutió', 'CAMPO'], ['cedió', 'FORMA'], ['rompió', 'INV']] },
    { id: 'solida', w: 'sólida', pide: 'sinónimo', o: 'Rosa dio una razón sólida: tenía datos y ejemplos para probarla.',
      alts: [['firme', 'OK'], ['dura', 'ACEP'], ['discutida', 'CAMPO'], ['soldada', 'FORMA'], ['débil', 'INV']] },
    { id: 'corto', w: 'corto', pide: 'antónimo', o: 'Mi primo es corto: le da vergüenza hablar con gente nueva.',
      alts: [['desenvuelto', 'OK'], ['largo', 'ACEP'], ['tímido', 'INV'], ['muy trabajador', 'RASGO'], ['cortés', 'FORMA']] },
    { id: 'subio', w: 'subió', pide: 'sinónimo', o: 'Este año subió el número de postulantes: se inscribieron mil más que el año pasado.',
      alts: [['aumentó', 'OK'], ['trepó', 'ACEP'], ['inscribió', 'CAMPO'], ['sumió', 'FORMA'], ['bajó', 'INV']] },
    { id: 'clave', w: 'clave', pide: 'sinónimo', o: 'El testimonio de la vecina fue clave: gracias a él encontraron al niño perdido.',
      alts: [['decisivo', 'OK'], ['contraseña', 'ACEP'], ['escrito', 'CAMPO'], ['clavado', 'FORMA'], ['inútil', 'INV']] },
    { id: 'seco', w: 'seco', pide: 'antónimo', o: 'El profesor respondió con un tono seco: dijo solo «sí» y siguió escribiendo.',
      alts: [['cordial', 'OK'], ['mojado', 'ACEP'], ['cortante', 'INV'], ['lento', 'RASGO'], ['sexto', 'FORMA']] },
  ];
  const VALOR = [
    { id: 'flojo', w: 'flojo', o: 'El jefe se quejó de que el nuevo ayudante es flojo: no termina nada de lo que empieza.',
      alts: [['perezoso', 'OK'], ['tranquilo', 'VAL'], ['inútil', 'GRADO'], ['nuevo', 'OTRA'], ['flaco', 'FORMA']] },
    { id: 'modesto', w: 'modesto', o: 'En la ceremonia, todos elogiaron al campeón por ser modesto: nunca habla de sus premios.',
      alts: [['humilde', 'OK'], ['acomplejado', 'VAL'], ['santo', 'GRADO'], ['puntual', 'OTRA'], ['molesto', 'FORMA']] },
    { id: 'barato', w: 'barato', o: 'Los vecinos se quejaron de que el municipio usó un cemento barato: la pista se rajó en un mes.',
      alts: [['corriente', 'OK'], ['económico para el bolsillo', 'VAL'], ['basura', 'GRADO'], ['húmedo', 'OTRA'], ['barroso', 'FORMA']] },
    { id: 'gordito', w: 'gordito', o: 'La abuela dice con cariño que su nieto está gordito: come todo lo que ella cocina.',
      alts: [['llenito', 'OK'], ['obeso', 'VAL'], ['gigantesco', 'GRADO'], ['alto', 'OTRA'], ['gorrito', 'FORMA']] },
    { id: 'astuto', w: 'astuto', o: 'En el cuento de la abuela, el cuy es astuto: con una buena idea escapa del zorro.',
      alts: [['avispado', 'OK'], ['tramposo', 'VAL'], ['un genio de la ciencia', 'GRADO'], ['veloz', 'OTRA'], ['asustado', 'FORMA']] },
    { id: 'charlatan', w: 'charlatán', o: 'El vecino se quejó del vendedor: es un charlatán que promete milagros con sus jarabes.',
      alts: [['embaucador', 'OK'], ['buen conversador', 'VAL'], ['criminal', 'GRADO'], ['ambulante', 'OTRA'], ['chalán', 'FORMA']] },
  ];
  const PRECISA = [
    { id: 'juez', w: '___', o: 'El juez ___ al acusado: lo dejó libre porque no había pruebas.',
      alts: [['absolvió', 'OK'], ['vio', 'COMOD'], ['condenó', 'CHOCA'], ['interrogó', 'CAMPO'], ['absorbió', 'FORMA']] },
    { id: 'empresa', w: '___', o: 'La empresa ___ a diez trabajadores nuevos para la cosecha de quinua.',
      alts: [['contrató', 'OK'], ['tuvo', 'COMOD'], ['despidió sin motivo', 'CHOCA'], ['pagó', 'CAMPO'], ['contó', 'FORMA']] },
    { id: 'vacuna', w: '___', o: 'El científico ___ una vacuna contra la gripe después de diez años de trabajo.',
      alts: [['desarrolló', 'OK'], ['hizo', 'COMOD'], ['abandonó para siempre', 'CHOCA'], ['aplicó', 'CAMPO'], ['desarrugó', 'FORMA']] },
    { id: 'nota', w: '___', o: 'El profesor ___ la nota del examen después de revisar otra vez las respuestas.',
      alts: [['corrigió', 'OK'], ['puso', 'COMOD'], ['adivinó', 'CHOCA'], ['fotocopió', 'CAMPO'], ['corrió', 'FORMA']] },
    { id: 'escalar', w: '___', o: 'Los turistas ___ el cerro en tres horas: llegaron a la cima al mediodía.',
      alts: [['escalaron', 'OK'], ['hicieron', 'COMOD'], ['bajaron', 'CHOCA'], ['fotografiaron', 'CAMPO'], ['escarbaron', 'FORMA']] },
    { id: 'libros', w: '___', o: 'La biblioteca ___ cien libros nuevos que le donó una editorial.',
      alts: [['recibió', 'OK'], ['tuvo', 'COMOD'], ['compró', 'CHOCA'], ['prestó a los lectores', 'CAMPO'], ['recicló', 'FORMA']] },
  ];
  const FIGURADO = [
    { id: 'mano', w: 'me echó una mano', o: 'Mi vecino me echó una mano con la mudanza: cargó las cajas toda la tarde.',
      alts: [['me ayudó', 'OK'], ['me tiró su mano', 'LIT'], ['me saludó', 'PROPIA'], ['me estorbó', 'VAL'], ['se mudó', 'OTRA']] },
    { id: 'pan', w: 'es un pan de Dios', o: 'Todos dicen que el panadero es un pan de Dios: siempre regala pan a quienes no tienen.',
      alts: [['es muy bueno', 'OK'], ['es hecho de harina', 'LIT'], ['es muy religioso', 'PROPIA'], ['es muy tacaño', 'VAL'], ['es muy alto', 'OTRA']] },
    { id: 'humos', w: 'se le subieron los humos', o: 'Desde que ganó el concurso, a Pedro se le subieron los humos: ya no saluda a nadie.',
      alts: [['se volvió creído', 'OK'], ['le salió humo de la cabeza', 'LIT'], ['se enfermó', 'PROPIA'], ['se volvió humilde', 'VAL'], ['se mudó de casa', 'OTRA']] },
    { id: 'peluquero', w: 'cortó', o: 'El peluquero cortó el pelo de Iván con una tijera.',
      alts: [['lo hizo más corto', 'OK'], ['lo dejó sin hablar', 'FIG'], ['lo peinó', 'PROPIA'], ['lo arruinó', 'VAL'], ['lo pintó de rojo', 'OTRA']] },
    { id: 'nubes', w: 'está en las nubes', o: 'Lucía está en las nubes: no oyó cuando la profesora la llamó dos veces.',
      alts: [['está distraída', 'OK'], ['está en el cielo', 'LIT'], ['está cansada', 'PROPIA'], ['está muy concentrada', 'VAL'], ['está en el patio', 'OTRA']] },
    { id: 'pulmon', w: 'el pulmón', o: 'El parque es el pulmón del distrito: sus árboles limpian el aire de las calles.',
      alts: [['lo que le da aire limpio', 'OK'], ['un órgano del cuerpo para respirar', 'LIT'], ['el lugar más bonito', 'PROPIA'], ['un estorbo', 'VAL'], ['el centro comercial', 'OTRA']] },
  ];
  const PISTAS = [
    { id: 'avido', w: 'ávido', o: 'Teo es un lector ávido: lee un libro cada semana y siempre pide más.',
      alts: [['deseoso de leer', 'OK'], ['desinteresado', 'INV'], ['que lee muy rápido', 'PROPIA'], ['que es un ave', 'FORMA'], ['que es muy joven', 'OTRA']] },
    { id: 'apacible', w: 'apacible', o: 'Mi perro es apacible; en cambio, el del vecino ladra y muerde a todos.',
      alts: [['tranquilo y manso', 'OK'], ['agresivo con todos', 'CREV'], ['que come mucho', 'PROPIA'], ['apagado', 'FORMA'], ['muy pequeño', 'OTRA']] },
    { id: 'nimio', w: 'nimio', o: 'Fue un detalle nimio: nadie lo notó y no cambió nada en la fiesta.',
      alts: [['sin importancia', 'OK'], ['muy importante', 'INV'], ['hecho con mucho cariño', 'PROPIA'], ['mimado', 'FORMA'], ['de la fiesta', 'OTRA']] },
    { id: 'hacinados', w: 'hacinados', o: 'En el bus iban hacinados: no cabía ni un alfiler y nadie podía moverse.',
      alts: [['muy apretados', 'OK'], ['muy cómodos', 'INV'], ['muertos de cansancio', 'PROPIA'], ['hechizados', 'FORMA'], ['en un bus', 'OTRA']] },
    { id: 'prodigo', w: 'pródigo', o: 'Don Pedro es pródigo con su familia; en cambio, su hermano no regala nada.',
      alts: [['generoso', 'OK'], ['que no regala nada', 'CREV'], ['muy trabajador', 'PROPIA'], ['prolijo', 'FORMA'], ['muy alto', 'OTRA']] },
    { id: 'indeleble', w: 'indeleble', o: 'La tinta del documento es indeleble: no se borra ni con agua ni con alcohol.',
      alts: [['que dura para siempre', 'OK'], ['que se borra fácil', 'INV'], ['que se compra en cualquier librería', 'PROPIA'], ['que es indigna', 'FORMA'], ['que es azul', 'OTRA']] },
  ];

  // El código de cada etiqueta, según la idea (dos incorrectas de un ítem nunca comparten código).
  const CODIGO = {
    acepcion: { ACEP: 'RV18', CAMPO: 'RV19', FORMA: 'RV20', RASGO: 'RV21', INV: 'RVS1' },
    valor: { VAL: 'RVS2', GRADO: 'RVS3', OTRA: 'RV19', FORMA: 'RV20' },
    precisa: { COMOD: 'RVS4', CHOCA: 'RV23', CAMPO: 'RV19', FORMA: 'RV20' },
    figurado: { LIT: 'RVS5', FIG: 'RVS6', PROPIA: 'RVS7', VAL: 'RVS2', OTRA: 'RV19' },
    pistas: { INV: 'RVS1', CREV: 'RVS8', PROPIA: 'RVS7', FORMA: 'RV20', OTRA: 'RV19' },
  };
  // La explicación de una incorrecta empieza por lo que el alumno hizo bien y dice el motivo con las palabras del curso.
  function explicar(base, et, t, it) {
    const w = it.w === '___' ? 'la palabra que va' : `«${it.w}»`;
    if (et === 'FORMA') return `«${t}» se escribe parecido a ${it.w === '___' ? 'la palabra que va' : w}, bien visto; pero significa otra cosa.`;
    if (base === 'acepcion') return {
      ACEP: `«${t}» sirve para otra acepción de ${w}, bien visto; pero no para la que usa esta oración.`,
      CAMPO: `«${t}» es del mismo campo, bien; pero no dice lo mismo que ${w}.`,
      RASGO: `«${t}» es distinta de ${w}, bien; pero habla de otro rasgo: no es su contrario.`,
      INV: it.pide === 'antónimo' ? `«${t}» habla de lo mismo, bien; pero dice lo mismo que ${w}: es un sinónimo.` : `«${t}» habla de lo mismo, bien; pero dice lo contrario de ${w}.`,
    }[et];
    if (base === 'valor') return {
      VAL: `«${t}» describe lo mismo, bien; pero cambia la valoración de quien escribe.`,
      GRADO: `«${t}» valora igual, bien; pero con mucha más fuerza: es otro grado.`,
      OTRA: `«${t}» es otra cosa: no describe lo que dice ${w}.`,
    }[et];
    if (base === 'precisa') return {
      COMOD: `«${t}» encaja, bien; pero es un comodín: no nombra la acción.`,
      CHOCA: `«${t}» va con una parte de la oración, bien; pero choca con otra.`,
      CAMPO: `«${t}» es del mismo campo, bien; pero no nombra esa acción.`,
    }[et];
    if (base === 'figurado') return {
      LIT: `«${t}» es lo que dicen las palabras tal cual, bien; pero aquí van en sentido figurado.`,
      FIG: `«${t}» es un sentido figurado posible, bien; pero aquí la lectura literal encaja.`,
      PROPIA: `«${t}» puede ocurrírsele a uno, bien; pero es una idea propia: el texto no la apoya.`,
      VAL: `«${t}» habla de lo mismo, bien; pero lo valora al revés que el texto.`,
      OTRA: `«${t}» es otra cosa: no es lo que dice el texto.`,
    }[et];
    return {
      INV: `«${t}» habla de lo mismo, bien; pero dice lo contrario de las pistas.`,
      CREV: `Viste el contraste, bien; pero «${t}» describe lo que se opone a la palabra: contraste al revés.`,
      PROPIA: `«${t}» puede ocurrírsele a uno, bien; pero es una idea propia: el texto no la apoya.`,
      OTRA: `«${t}» es otra cosa: no dice qué significa ${w}.`,
    }[et];
  }

  const IDEA_BANCO = { acepcion: ACEPCION, valor: VALOR, precisa: PRECISA, figurado: FIGURADO, pistas: PISTAS };
  const DATOS = {
    acepcion: it => [D.ACEP, D.PISTA, it.pide === 'antónimo' ? D.ANTC : D.SINC],
    valor: () => [D.DEN, D.CON, D.GRADO],
    precisa: () => [D.PREC, D.COMOD, D.CHOCA],
    figurado: () => [D.LIT, D.FIG, D.FRASE],
    pistas: () => [D.PISTA5, D.DEDUC, D.DETALLE],
  };
  const sinPunto = t => t.replace(/[.]$/, '');
  const PREGUNTA = {
    acepcion: it => (it.pide === 'antónimo' ? `En «${sinPunto(it.o)}», ¿qué palabra dice lo contrario de «${it.w}»?` : `En «${sinPunto(it.o)}», ¿qué palabra puede reemplazar a «${it.w}» sin cambiar lo que dice?`),
    valor: it => `En «${sinPunto(it.o)}», ¿qué palabra describe lo mismo que «${it.w}» y lo valora igual?`,
    precisa: it => `¿Qué palabra completa con más precisión la oración «${sinPunto(it.o)}»?`,
    figurado: it => `En «${sinPunto(it.o)}», ¿qué quiere decir «${it.w}»?`,
    pistas: it => `En «${sinPunto(it.o)}», ¿qué significa «${it.w}»?`,
  };
  const SOLUCION = {
    acepcion: (ok, it) => [`La pista de la oración elige la acepción de «${it.w}»; «${ok}» ${it.pide === 'antónimo' ? 'dice lo contrario' : 'dice lo mismo'} en esa acepción.`, 'Las otras son de otra acepción, del mismo campo, de forma parecida, de otro rasgo o dicen lo opuesto.'],
    valor: (ok, it) => [`«${ok}» describe lo mismo que «${it.w}» y lo valora igual, con la misma fuerza.`, 'Las otras cambian la valoración, la exageran, describen otra cosa o solo se parecen por la forma.'],
    precisa: ok => [`«${ok}» nombra justo la acción y no choca con ninguna parte de la oración.`, 'Las otras son un comodín, chocan con la oración, son del mismo campo o solo se parecen por la forma.'],
    figurado: (ok, it) => [`Leída tal cual, «${it.w}» ${it.alts.some(a => a[1] === 'FIG') ? 'encaja: va en sentido literal' : 'no encaja con el texto: va en sentido figurado'}; quiere decir «${ok}».`, 'Las otras la leen mal, son una idea propia, valoran al revés o hablan de otra cosa.'],
    pistas: (ok, it) => [`La pista del texto lleva a «${ok}», y encaja en el lugar de «${it.w}».`, 'Las otras dicen lo contrario, leen el contraste al revés, son una idea propia o se parecen por la forma.'],
  };
  function tItem(rng, base, examen) {
    const it = rng.elegir(IDEA_BANCO[base]);
    const buenas = it.alts.filter(x => x[1] === 'OK');
    if (buenas.length !== 1) throw new Error(`${ID}: en «${it.id}» hay ${buenas.length} buenas`);
    const malas = it.alts.filter(x => x[1] !== 'OK').map(([t, et]) => ({ t, et, cod: CODIGO[base][et] }));
    const cods = malas.map(m => m.cod);
    if (cods.some(c => !c) || new Set(cods).size !== cods.length) throw new Error(`${ID}: en «${it.id}» los códigos no son distintos (${cods})`);
    const ok = buenas[0][0];
    const errores = elegir(rng, malas, examen ? 4 : 3, ok).map(m => Object.assign({ clave: `pal:${m.t}`, texto: m.t }, err(m.cod, explicar(base, m.et, m.t, it))));
    return {
      enunciado: [examen ? 'Pregunta del simulacro.' : 'Sentido contextual.'],
      pregunta: [PREGUNTA[base](it)],
      datos: DATOS[base](it), correcta: ok, errores,
      solucion: SOLUCION[base](ok, it).map(t => [t]),
      _datos: { item: it.id },
    };
  }

  // ---------------- Tipos por idea ----------------
  const CONSTRUIR = {};
  for (const b of Object.keys(IDEA_BANCO)) { CONSTRUIR[b] = rng => tItem(rng, b, false); CONSTRUIR[`${b}-examen`] = rng => tItem(rng, b, true); }
  const TIPOS_POR_IDEA = {
    'acepcion': ['acepcion', 'acepcion-examen'],
    'denota-connota': ['valor', 'valor-examen'],
    'palabra-precisa': ['precisa', 'precisa-examen'],
    'sentido-figurado': ['figurado', 'figurado-examen'],
    'inferir-significado': ['pistas', 'pistas-examen'],
  };
  const IDEAS = Object.keys(TIPOS_POR_IDEA);
  const IDEA_DE = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map(t => [t, i])));
  const NIVEL = Object.fromEntries(Object.keys(CONSTRUIR).map(t => [t, /examen/.test(t) ? 3 : 2]));
  // Papel (regla 6; herramientas/papel-generador.js toma «papel-1» a «papel-8»): las cinco ideas, de menos a más.
  const PAPEL = { 'papel-1': 'acepcion', 'papel-2': 'valor', 'papel-3': 'precisa', 'papel-4': 'figurado', 'papel-5': 'pistas',
    'papel-6': 'acepcion-examen', 'papel-7': 'figurado-examen', 'papel-8': 'pistas-examen' };

  function generar(semilla, opciones) {
    const o = typeof opciones === 'string' ? { unidad: opciones } : opciones || {};
    const rng = Azar.crear(`${ID}|${semilla}`);
    const tipo = (!o.idea && PAPEL[String(semilla)]) || rng.elegir(TIPOS_POR_IDEA[TIPOS_POR_IDEA[o.idea] ? o.idea : rng.elegir(IDEAS)]);
    const pr = CONSTRUIR[tipo](rng);
    const alternativas = P.armarTexto({ correcta: { clave: `ok:${pr.correcta}`, texto: pr.correcta }, errores: pr.errores, rng });
    return {
      id: `${ID}#${semilla}`, variables: {}, enunciado: pr.enunciado, pregunta: pr.pregunta, datos: pr.datos, alternativas,
      solucion: pr.solucion, respuesta: { valor: `ok:${pr.correcta}`, texto: pr.correcta, unidad: '' },
      _datos: Object.assign({ idea: IDEA_DE[tipo], tipo, nivel: NIVEL[tipo], codigos: alternativas.filter(a => a.error).map(a => a.error.id) }, pr._datos),
    };
  }

  return { id: ID, titulo: 'Sentido contextual', generar, TIPOS_POR_IDEA, NIVEL, TIPOS: Object.keys(CONSTRUIR), ACEPCION, VALOR, PRECISA, FIGURADO, PISTAS, CODIGO };
});
