/*
 * Núcleo del formato "lectura" (razonamiento verbal; diseño en docs/formato-lectura.md).
 * Funciones puras, sin DOM: sirven en el navegador (window.Lectura) y en Node (require).
 *
 * Regla 1: la correcta, el código de cada distractor y la calificación del paso previo
 * salen del banco (contenido/razonamiento-verbal/), escrito y revisado a mano. Aquí solo
 * se buscan en sus tablas; nada se adivina.
 * Regla 3: el paso previo se califica aparte y se registra como evento propio ('previo').
 *
 * Un "ítem" es un texto (textos/t001.json, con párrafos y de 3 a 5 preguntas) o un ejercicio
 * suelto (ejercicios/e001.json: una sola pregunta con su "cuerpo"). normalizar() deja los dos
 * con la misma forma: { id, version, ejercicio, titulo, parrafos, cuerpo, preguntas }.
 */
(function (root, fabrica) {
  const api = fabrica(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Lectura = api;
})(typeof self !== 'undefined' ? self : this, function (root) {
  'use strict';
  const Azar = (typeof module === 'object' && module.exports) ? require('./azar.js') : root.Azar;
  const LETRAS = ['A', 'B', 'C', 'D', 'E'];

  // ---------- Opciones de cada tipo de paso previo (lo que ve el alumno) ----------
  const CLASES = [
    { id: 'lo-dice', t: 'Lo dice el texto' },
    { id: 'se-deduce', t: 'Se deduce del texto' },
    { id: 'no-se-sabe', t: 'El texto no lo dice ni se deduce' },
    { id: 'lo-contradice', t: 'Lo contradice' },
  ];
  const RELACIONES = [
    { id: 'suma', t: 'Suma', d: 'y, además' },
    { id: 'oposicion', t: 'Oposición', d: 'pero, aunque, sin embargo' },
    { id: 'causa', t: 'Causa o consecuencia', d: 'porque, por eso' },
  ];
  const PROPOSITOS = [
    { id: 'explicar', t: 'Explicar o informar' },
    { id: 'convencer', t: 'Convencer' },
    { id: 'narrar', t: 'Narrar' },
  ];
  // Analogías: {a} y {b} se reemplazan por las palabras de la pareja base. Las que tienen dirección van en pares.
  const ANALOGIAS = [
    { id: 'a-produce-b', t: 'De {a} se obtiene {b}', inversa: 'b-produce-a' }, // material: de la vaca se obtiene leche; «causa» es causa y efecto (el virus no «se obtiene» fiebre)
    { id: 'b-produce-a', t: 'De {b} se obtiene {a}', inversa: 'a-produce-b' },
    { id: 'a-parte-de-b', t: '{a} es parte de {b}', inversa: 'b-parte-de-a' },
    { id: 'b-parte-de-a', t: '{b} es parte de {a}', inversa: 'a-parte-de-b' },
    { id: 'a-usa-b', t: '{a} usa {b}', inversa: 'b-usa-a' },
    { id: 'b-usa-a', t: '{b} usa {a}', inversa: 'a-usa-b' },
    { id: 'a-tipo-de-b', t: '{a} es un tipo de {b}', inversa: 'b-tipo-de-a' },
    { id: 'b-tipo-de-a', t: '{b} es un tipo de {a}', inversa: 'a-tipo-de-b' },
    { id: 'a-causa-b', t: '{a} causa {b}', inversa: 'b-causa-a' },
    { id: 'b-causa-a', t: '{b} causa {a}', inversa: 'a-causa-b' },
    { id: 'sinonimos', t: 'Son sinónimos' },
    { id: 'contrarios', t: 'Son contrarios' },
  ];
  const CONCLUSION = /^\s*(así|por eso|por ello|por esas?\b|por lo tanto|en conclusión|en suma|en resumen)/i;
  const TIPOS_PREVIO = ['marcar-oracion', 'clasificar', 'relacion', 'relacion-analogia', 'proposito', 'ordenar'];
  const ROL_CODIGO = { detalle: 'RV1', ejemplo: 'RV1', cita: 'RV1', general: 'RV2', apoyo: 'RV3', contraste: 'RV3' };
  const NOMBRE_EJERCICIO = { analogia: 'Analogía', 'termino-excluido': 'Término excluido', 'oracion-incompleta': 'Oración incompleta',
    conector: 'Conectores', 'plan-de-redaccion': 'Plan de redacción', eliminacion: 'Eliminación de oraciones' };

  // ---------- Forma común de textos y ejercicios ----------
  function normalizar(item) {
    if (!item || !item.id) throw new Error('Ítem sin id');
    if (item.preguntas && 'ejercicio' in item) return item; // ya normalizado
    if (item.preguntas) return { ...item, ejercicio: false, cuerpo: item.cuerpo || null };
    const { id, version, cuerpo, titulo } = item;
    const q = { ...item, id: null };
    for (const k of ['version', 'cuerpo', 'titulo', 'revision', 'hechos', 'origen', 'fecha', 'grado', 'dificultad']) delete q[k];
    return { id, version, titulo: titulo || NOMBRE_EJERCICIO[item.tipo] || 'Ejercicio', ejercicio: true, cuerpo: cuerpo || {}, parrafos: [], preguntas: [q] };
  }

  // Oraciones con su número seguido en todo el texto (o1 es la oración 1) y su párrafo.
  // En los ejercicios de eliminación, las oraciones del cuerpo; su id es "id" o, si no tiene, su numeral "n".
  function oraciones(item) {
    if (item.parrafos && item.parrafos.length) {
      let n = 0;
      return item.parrafos.flatMap((p, k) => p.map(o => ({ ...o, n: ++n, parrafo: k + 1 })));
    }
    const l = (item.cuerpo && item.cuerpo.oraciones) || [];
    return l.map((o, k) => ({ ...o, id: o.id || o.n, n: k + 1, parrafo: 1 }));
  }
  const numero = (item, id) => { const o = oraciones(item).find(x => x.id === id); return o ? o.n : null; };

  // ---------- Figuras de los textos discontinuos (tabla, gráfico de barras, recuadros de una infografía) ----------
  // item.figuras: [{ id, tipo, despues, titulo, nota, … }]. "despues" es cuántos párrafos van antes (0: arriba de todo).
  //   tabla:     columnas: ['Año', 'Toneladas'], filas: [{ id, celdas: ['2019', '150'] }]
  //   barras:    unidad: 'mm', barras: [{ id, etiqueta: 'Ene', valor: 120 }]   (barras horizontales desde 0)
  //   recuadros: recuadros: [{ id, titulo, t }]
  // Cada fila, barra o recuadro (y la figura entera) tiene id propio, y "evidencia" u "origen" pueden apuntar a él.
  const TIPOS_FIGURA = { tabla: 'filas', barras: 'barras', recuadros: 'recuadros' };
  const NOMBRE_FIGURA = { tabla: 'la tabla', barras: 'el gráfico', recuadros: 'la infografía' };
  const figuras = item => (item && Array.isArray(item.figuras)) ? item.figuras : [];
  const textoParte = (f, x) => f.tipo === 'tabla' ? (x.celdas || []).map((c, k) => `${(f.columnas || [])[k] || ''}: ${c}`).join(' · ')
    : f.tipo === 'barras' ? `${x.etiqueta}: ${x.valor}${f.unidad ? ' ' + f.unidad : ''}`
    : `${x.titulo ? x.titulo + ': ' : ''}${x.t || ''}`;
  // Partes citables de las figuras: la figura entera y cada fila, barra o recuadro, con un texto para citarlas.
  function elementos(item) {
    const out = [];
    for (const f of figuras(item)) {
      out.push({ id: f.id, figura: f.id, tipo: f.tipo, parte: false, t: f.titulo || '' });
      for (const x of f[TIPOS_FIGURA[f.tipo]] || []) out.push({ id: x.id, figura: f.id, tipo: f.tipo, parte: true, t: textoParte(f, x), nombre: f.tipo === 'tabla' ? (x.celdas || [])[0] : f.tipo === 'barras' ? x.etiqueta : x.titulo });
    }
    return out;
  }
  // Ids a los que pueden apuntar "evidencia", "origen" y "aceptadas": oraciones y partes de figuras.
  const referencias = item => new Set([...oraciones(item).map(o => o.id), ...elementos(item).map(e => e.id)]);
  // Cómo se nombra en una explicación: «la oración 3», «la fila «2019» de la tabla», «el gráfico».
  function etiquetaRef(item, id) {
    const n = numero(item, id);
    if (n !== null) return `la oración ${n}`;
    const e = elementos(item).find(x => x.id === id);
    if (!e) return String(id);
    if (!e.parte) return NOMBRE_FIGURA[e.tipo];
    const parte = { tabla: 'la fila', barras: 'la barra', recuadros: 'el recuadro' }[e.tipo];
    return `${parte}${e.nombre ? ` «${e.nombre}»` : ''} ${NOMBRE_FIGURA[e.tipo].replace(/^el /, 'del ').replace(/^la /, 'de la ')}`;
  }
  // Lo que se cita debajo de una explicación, en el orden del texto: { id, marca (número u otra etiqueta corta), t }.
  function citas(item, ids) {
    const ors = oraciones(item).filter(o => ids.includes(o.id)).map(o => ({ id: o.id, marca: String(item.ejercicio ? o.id : o.n), t: o.t }));
    const els = elementos(item).filter(e => ids.includes(e.id)).map(e => ({ id: e.id, marca: { tabla: 'Tabla', barras: 'Gráfico', recuadros: 'Infografía' }[e.tipo], t: e.t }));
    return [...ors, ...els];
  }
  function validarFiguras(it, mal) {
    const fs = it.figuras;
    if (fs === undefined) return;
    if (!Array.isArray(fs)) { mal('"figuras" debe ser una lista'); return; }
    const npar = (it.parrafos || []).length;
    for (const f of fs) {
      const d = `figura ${f && f.id}`;
      if (!f || !f.id || !TIPOS_FIGURA[f.tipo]) { mal(`${d}: necesita id y un tipo (${Object.keys(TIPOS_FIGURA).join(', ')})`); continue; }
      if (!f.titulo) mal(`${d}: falta el título`);
      if (!Number.isInteger(f.despues) || f.despues < 0 || f.despues > npar) mal(`${d}: "despues" debe ser un entero de 0 a ${npar}`);
      const partes = f[TIPOS_FIGURA[f.tipo]];
      if (!Array.isArray(partes) || partes.length < 2) { mal(`${d}: necesita al menos 2 elementos en "${TIPOS_FIGURA[f.tipo]}"`); continue; }
      for (const x of partes) {
        if (!x || !x.id) { mal(`${d}: un elemento no tiene id`); continue; }
        if (f.tipo === 'tabla' && (!Array.isArray(x.celdas) || !Array.isArray(f.columnas) || x.celdas.length !== f.columnas.length)) mal(`${d}.${x.id}: la fila debe tener una celda por columna`);
        if (f.tipo === 'barras' && (!x.etiqueta || typeof x.valor !== 'number' || !Number.isFinite(x.valor) || x.valor < 0)) mal(`${d}.${x.id}: la barra necesita etiqueta y un valor no negativo`);
        if (f.tipo === 'recuadros' && !x.t) mal(`${d}.${x.id}: el recuadro necesita texto`);
      }
    }
  }
  const problemaTexto = item => `${item.id}v${item.version}`;
  const problema = (item, q) => q && q.id ? `${problemaTexto(item)}.${q.id}` : problemaTexto(item);

  // ---------- Código de cada respuesta incorrecta del paso previo (sección 5.3) ----------
  function codigoOracion(previo, item, id) {
    if (previo.codigos && Object.prototype.hasOwnProperty.call(previo.codigos, id)) return previo.codigos[id];
    if (item.ejercicio) return null; // en eliminación, "codigos" es obligatorio; la regla de RV4 no se aplica
    const ors = oraciones(item), o = ors.find(x => x.id === id);
    if (!o) return null;
    if (o.id === ors[0].id) return 'RV4';
    return ROL_CODIGO[o.rol] || null;
  }

  // Opciones posibles de un paso previo (para la pantalla y para validar que cada una tenga código).
  function opcionesPrevio(previo, item) {
    switch (previo.tipo) {
      case 'marcar-oracion': return [...oraciones(item).map(o => o.id), ...(previo.ninguna ? ['ninguna'] : [])];
      case 'clasificar': return CLASES.map(c => c.id);
      case 'relacion': return RELACIONES.map(c => c.id);
      case 'proposito': return PROPOSITOS.map(c => c.id);
      case 'relacion-analogia': return ANALOGIAS.map(c => c.id);
      default: return [];
    }
  }

  /*
   * calificarPrevio(previo, respuesta, item) → { correcta, error, opcion }
   *   respuesta: id de oración o 'ninguna' (marcar-oracion), una clase, una relación, un propósito,
   *   una relación de analogía, o la lista de numerales en orden (ordenar).
   *   error: el código RV, o null si el banco no tiene código para esa respuesta (se registra sin código).
   *   opcion: lo que va en la columna "opcion" del evento (el orden se escribe III-I-IV-II-V).
   */
  function calificarPrevio(previo, respuesta, item) {
    item = normalizar(item);
    const t = previo.tipo;
    if (t === 'ordenar') {
      const orden = Array.isArray(respuesta) ? respuesta.map(String) : String(respuesta).split('-');
      const opcion = orden.join('-');
      if (opcion === previo.aceptada.join('-')) return { correcta: true, error: null, opcion };
      const pos = Object.fromEntries(orden.map((n, k) => [n, k]));
      const ors = (item.cuerpo && item.cuerpo.oraciones) || [];
      // RV37: empieza por la conclusión (una oración sin retoma que abre con «así», «por eso», «por ello»…).
      const primera = ors.find(o => o.n === orden[0]);
      if (primera && !primera.retoma && primera.n !== previo.aceptada[0] && CONCLUSION.test(primera.t || '')) return { correcta: false, error: 'RV37', opcion };
      const rompeRetoma = ors.some(o => o.retoma && o.n in pos && o.retoma in pos && pos[o.n] < pos[o.retoma]);
      return { correcta: false, error: rompeRetoma ? 'RV28' : 'RV29', opcion };
    }
    const opcion = String(respuesta);
    if (t === 'marcar-oracion') {
      if (opcion === 'ninguna') {
        if (!previo.ninguna) throw new Error('Este paso previo no tiene la opción "ninguna"');
        return previo.ninguna === 'correcta' ? { correcta: true, error: null, opcion } : { correcta: false, error: previo.ninguna, opcion };
      }
      if (!oraciones(item).some(o => o.id === opcion)) throw new Error(`La oración ${opcion} no existe`);
      if (previo.aceptadas.includes(opcion)) return { correcta: true, error: null, opcion };
      return { correcta: false, error: codigoOracion(previo, item, opcion), opcion };
    }
    if (t === 'relacion-analogia') {
      const a = ANALOGIAS.find(x => x.id === opcion);
      if (!a) throw new Error(`Relación de analogía desconocida: ${opcion}`);
      if (opcion === previo.aceptada) return { correcta: true, error: null, opcion };
      return { correcta: false, error: a.inversa === previo.aceptada ? 'RV16' : 'RV17', opcion };
    }
    if (t === 'clasificar' || t === 'relacion' || t === 'proposito') {
      const aceptada = t === 'clasificar' ? previo.clase : previo.aceptada;
      if (!opcionesPrevio(previo, item).includes(opcion)) throw new Error(`Respuesta "${opcion}" no válida para ${t}`);
      if (opcion === aceptada) return { correcta: true, error: null, opcion };
      const c = (previo.codigos || {})[opcion];
      return { correcta: false, error: c === undefined ? null : c, opcion };
    }
    throw new Error(`Tipo de paso previo desconocido: ${t}`);
  }

  // ---------- Barajar alternativas: la posición en el banco viaja con cada una ----------
  /*
   * preparar(item, semilla) → copia del ítem con, en cada pregunta, "alternativas" barajadas.
   * Cada alternativa lleva su letra (A–E, lo que ve el alumno) y "pos" (1 a 5, su lugar en el banco:
   * lo que se registra). La semilla de cada pregunta es `${semilla}|${problema}|${intento}`: en la práctica,
   * el id del alumno y el número de intento (al repetir un texto cambia el orden); en las pruebas,
   * una semilla fija por forma, igual para todos, y sin intento (`${semilla}|${problema}`).
   */
  function preparar(item, semilla, intento) {
    const it = normalizar(item);
    return {
      ...it,
      problema: problemaTexto(it),
      oraciones: oraciones(it),
      preguntas: it.preguntas.map(q => {
        const prob = problema(it, q);
        const rng = Azar.crear(intento === undefined ? `${semilla}|${prob}` : `${semilla}|${prob}|${intento}`);
        const alts = rng.barajar(q.alternativas.map((a, k) => ({ ...a, pos: k + 1, correcta: a.correcta === true })));
        return { ...q, problema: prob, alternativas: alts.map((a, k) => ({ ...a, letra: LETRAS[k] })) };
      }),
    };
  }

  // Calificar una alternativa elegida (por su letra o por su posición en el banco).
  function calificar(pregunta, eleccion) {
    const a = pregunta.alternativas.find(x => (typeof eleccion === 'number' ? x.pos === eleccion : x.letra === eleccion));
    if (!a) throw new Error(`Alternativa ${eleccion} no existe`);
    const correcta = pregunta.alternativas.find(x => x.correcta);
    return { alternativa: a, correcta: a.correcta, error: a.correcta ? null : a.codigo, pos: a.pos, letra: a.letra, clave: correcta };
  }

  // «No sé» en las pruebas de entrada y salida: no elige ninguna alternativa, no es acierto ni error de un código.
  // En la cadena de respuestas de la prueba va como 0 (las posiciones del banco van de 1 a 5).
  function noSe(pregunta) {
    return { alternativa: null, correcta: false, error: null, pos: 0, letra: '', nose: true, clave: pregunta.alternativas.find(x => x.correcta) };
  }

  // Respaldo de un código (codigos.json, generado del informe por herramientas/codigos-verbal.js).
  const respaldo = (codigo, codigos) => (codigo && codigos && codigos[codigo] ? codigos[codigo].respaldo : '');

  // ---------- Explicación y pintura (sección 4) ----------
  // Qué oraciones se pintan con cada rol. Una oración puede ser evidencia y origen del distractor a la vez.
  function pintura(pregunta, eleccion) {
    const correcta = pregunta.alternativas.find(a => a.correcta);
    const elegida = eleccion && pregunta.alternativas.find(a => a.letra === eleccion || a.pos === eleccion);
    return {
      evidencia: [...(correcta.evidencia || [])],
      distractor: elegida && !elegida.correcta && elegida.origen ? [elegida.origen] : [],
    };
  }

  // Texto que ve el alumno para una respuesta del paso previo.
  function etiquetaPrevio(previo, opcion, item) {
    const it = item ? normalizar(item) : null;
    switch (previo.tipo) {
      case 'marcar-oracion': return opcion === 'ninguna' ? 'Ninguna la dice completa'
        : `la oración ${(it && it.ejercicio) ? opcion : (it ? numero(it, opcion) : opcion)}`;
      case 'clasificar': return (CLASES.find(c => c.id === opcion) || {}).t || opcion;
      case 'relacion': return (RELACIONES.find(c => c.id === opcion) || {}).t || opcion;
      case 'proposito': return (PROPOSITOS.find(c => c.id === opcion) || {}).t || opcion;
      case 'relacion-analogia': return textoAnalogia(opcion, it && it.cuerpo && it.cuerpo.base);
      case 'ordenar': return (Array.isArray(opcion) ? opcion : String(opcion).split('-')).join(' – ');
      default: return String(opcion);
    }
  }
  function textoAnalogia(id, base) {
    const a = ANALOGIAS.find(x => x.id === id); if (!a) return id;
    const [pa, pb] = base || ['A', 'B'];
    return a.t.replace('{a}', pa).replace('{b}', pb);
  }
  const respuestaAceptada = previo => previo.tipo === 'marcar-oracion' ? previo.aceptadas : previo.tipo === 'clasificar' ? [previo.clase] : [previo.aceptada];

  /*
   * correccionPrevio(previo, resultado, item, frases) → { correcta, eligio, aceptada, explicacion, porQue, idea }
   *   explicacion: por qué la respuesta aceptada es la buena (siempre).
   *   porQue: si falló, la explicación de lo que eligió (previo.explicaciones) o la frase de su código,
   *     salvo cuando la frase no describe esa respuesta (FRASE_NO_APLICA): entonces queda vacía y
   *     neutra es true (la pantalla dice "La respuesta aceptada es …" con la explicación del previo).
   *   idea: oraciones que se pintan con el color "idea" (la aceptada, solo en marcar-oracion).
   */
  function correccionPrevio(previo, resultado, item, frases) {
    const it = normalizar(item);
    const acept = respuestaAceptada(previo);
    let porQue = '', neutra = false;
    if (!resultado.correcta) {
      const exp = previo.explicaciones && previo.explicaciones[resultado.opcion];
      porQue = exp || (fraseAplica(previo, resultado.opcion) && resultado.error && frases ? frases[resultado.error] || '' : '');
      neutra = !porQue;
    }
    return {
      neutra,
      correcta: resultado.correcta,
      eligio: etiquetaPrevio(previo, resultado.opcion, it),
      aceptada: previo.tipo === 'ordenar' ? etiquetaPrevio(previo, previo.aceptada, it)
        : acept.map(x => etiquetaPrevio(previo, x, it)).join(' o '),
      explicacion: previo.explicacion,
      porQue,
      idea: previo.tipo === 'marcar-oracion' ? acept.filter(x => x !== 'ninguna') : [],
    };
  }

  // Respuestas del paso previo para las que la frase del código (escrita para las alternativas) dice otra cosa:
  // "Ninguna la dice completa" no es "una parte del texto" (RV3). Antes también "Lo dice el texto" en clasificar,
  // porque se registraba RV6, cuya frase dice lo contrario; desde la rutina verbal C ese caso es RV58, con su frase.
  const FRASE_NO_APLICA = { 'marcar-oracion': ['ninguna'] };
  const fraseAplica = (previo, opcion) => !(FRASE_NO_APLICA[previo.tipo] || []).includes(String(opcion));

  // Avisos (no errores) para quien escribe el banco: respuestas incorrectas de un paso previo sin explicación
  // propia en previo.explicaciones. neutra: la corrección quedará en la frase neutra (sin explicación ni frase que aplique).
  function avisos(item, frases) {
    const it = normalizar(item), out = [];
    for (const q of it.preguntas) {
      const p = q.previo;
      if (!p || p.tipo === 'ordenar') continue;
      const acept = respuestaAceptada(p);
      for (const o of opcionesPrevio(p, it)) {
        if (acept.includes(o) || (p.explicaciones && p.explicaciones[o])) continue;
        const r = calificarPrevio(p, o, it);
        if (r.correcta) continue;
        const neutra = !(fraseAplica(p, o) && r.error && frases && frases[r.error]);
        out.push({ item: it.id, pregunta: q.id, opcion: o, error: r.error, neutra });
      }
    }
    return out;
  }

  // ---------- Pruebas de entrada y salida del módulo ----------
  // Con entrada y salida en el índice, la mitad de los alumnos lee la entrada de entrada y la salida de salida
  // (orden AB) y la otra mitad al revés (BA), con nucleo/pruebas.js (la misma regla que las pruebas por curso).
  // Forma A = indice.entrada, forma B = indice.salida. Sin las dos, cada fase usa su texto (orden AB).
  function formaPrueba(indice, alumno, fase, curso) {
    const Pr = (typeof module === 'object' && module.exports) ? require('./pruebas.js') : root.Pruebas;
    const ambas = !!(indice.entrada && indice.salida);
    const orden = ambas && Pr ? Pr.orden(alumno, curso) : 'AB';
    const forma = fase === 'entrada' ? orden[0] : orden[1];
    return { orden, forma, id: forma === 'A' ? indice.entrada : indice.salida };
  }

  // ---------- Orden de la práctica ----------
  // Ítems (textos y ejercicios) que tocan la unidad, en el orden del índice. Sin unidad, todos.
  function lista(indice, items, unidad) {
    const ids = [...(indice.textos || []), ...(indice.ejercicios || [])];
    return ids.map(id => items[id]).filter(Boolean).map(normalizar)
      .filter(it => !unidad || it.preguntas.some(q => q.unidad === unidad));
  }
  // El siguiente: el que menos veces se hizo; a igual cantidad, el primero del índice.
  // Así un texto hecho no se repite hasta que se acaben los demás.
  function siguiente(l, hechos) {
    hechos = hechos || {};
    let mejor = null;
    for (const it of l) if (!mejor || (hechos[it.id] || 0) < (hechos[mejor.id] || 0)) mejor = it;
    return mejor;
  }

  // ---------- Eventos de medición (sección 6; se guardan con nucleo/medicion.js) ----------
  const ev = {
    // intento: 1 la primera vez que el alumno hace ese texto, 2 al repetirlo… (el análisis cuenta solo el primero).
    lectura: ({ modulo, unidad, item, ms, fase, intento }) => ({ tipo: 'lectura', ...(fase ? { fase } : {}), modulo, unidad, problema: problemaTexto(item), ms, ...(intento ? { intento } : {}) }),
    previo: ({ modulo, pregunta, resultado, codigos, ms, intento }) => ({ tipo: 'previo', modulo, unidad: pregunta.unidad, problema: pregunta.problema,
      opcion: resultado.opcion, correcta: resultado.correcta, error: resultado.error || '', respaldo: respaldo(resultado.error, codigos), ms, ...(intento ? { intento } : {}) }),
    respuesta: ({ modulo, pregunta, resultado, codigos, ms, intento }) => ({ tipo: 'prediccion', modulo, unidad: pregunta.unidad, problema: pregunta.problema,
      opcion: String(resultado.pos), correcta: resultado.correcta, error: resultado.error || '', respaldo: respaldo(resultado.error, codigos), ms, ...(intento ? { intento } : {}) }),
    // Pruebas de entrada y salida: un 'item' por pregunta y una 'prueba' al final, con los campos de las pruebas
    // por curso (nucleo/medicion.js), para que resumirCursos dé la ganancia de Hake y los errores RV antes y después.
    item: ({ fase, curso, modulo, forma, orden, pregunta, resultado, codigos, ms }) => ({ tipo: 'item', fase, curso, forma, orden, banco: 'lectura',
      item: pregunta.problema, par: pregunta.id, plantilla: modulo, unidad: pregunta.unidad, opcion: resultado.nose ? '' : String(resultado.pos), correcta: resultado.correcta,
      error: resultado.error || '', respaldo: respaldo(resultado.error, codigos), ...(resultado.nose ? { nose: true } : {}), ms }),
    // En "respuestas", la posición en el banco de cada respuesta, una por pregunta ("215"); «No sé» es 0 ("205").
    prueba: ({ fase, curso, forma, orden, modulo, unidad, item, resultados, ms }) => ({ tipo: 'prueba', fase, ...(curso ? { curso, forma, orden, banco: 'lectura' } : {}),
      modulo, unidad, problema: problemaTexto(item),
      aciertos: resultados.filter(r => r.correcta).length, total: resultados.length, respuestas: resultados.map(r => (r.nose ? 0 : r.pos)).join(''),
      nose: resultados.filter(r => r.nose).length, ms }),
  };

  // ---------- Validación (lo que la app necesita para mostrar un ítem) ----------
  // Devuelve la lista de problemas encontrados (vacía si está bien). banco.test.js aplica además las reglas editoriales.
  function validar(item, { codigos, unidades } = {}) {
    const errores = [];
    const mal = m => errores.push(`${item && item.id}: ${m}`);
    let it;
    try { it = normalizar(item); } catch (e) { return [String(e.message)]; }
    if (!Number.isInteger(it.version) || it.version < 1) mal('versión inválida');
    const ors = oraciones(it), ids = referencias(it);
    if (!it.ejercicio && !ors.length) mal('el texto no tiene oraciones');
    if (ids.size !== ors.length + elementos(it).length) mal('hay ids de oración o de figura repetidos');
    validarFiguras(it, mal);
    const codigoOk = c => !codigos || Object.prototype.hasOwnProperty.call(codigos, c);
    for (const q of it.preguntas) {
      const d = q.id || 'ítem';
      if (unidades && !unidades.has(q.unidad)) mal(`${d}: la unidad ${q.unidad} no está en el catálogo`);
      if (!q.enunciado) mal(`${d}: falta el enunciado`);
      const alts = q.alternativas || [];
      if (alts.length < 2 || alts.length > LETRAS.length) mal(`${d}: de 2 a ${LETRAS.length} alternativas`);
      if (alts.filter(a => a.correcta === true).length !== 1) mal(`${d}: debe haber una sola correcta`);
      for (const a of alts) {
        if (!a.t || !a.explicacion) mal(`${d}: alternativa sin texto o sin explicación`);
        if (!a.correcta && !codigoOk(a.codigo)) mal(`${d}: código ${a.codigo} desconocido`);
        for (const o of [...(a.evidencia || []), ...(a.origen ? [a.origen] : [])]) if (!it.ejercicio && !ids.has(o)) mal(`${d}: apunta a ${o}, que no existe`);
      }
      const p = q.previo;
      if (!p) continue;
      if (!TIPOS_PREVIO.includes(p.tipo)) { mal(`${d}: tipo de paso previo "${p.tipo}" desconocido`); continue; }
      if (!p.pide || !p.explicacion) mal(`${d}: el paso previo necesita "pide" y "explicacion"`);
      if (p.tipo === 'ordenar') {
        const ns = ((it.cuerpo && it.cuerpo.oraciones) || []).map(o => o.n);
        if (!Array.isArray(p.aceptada) || [...p.aceptada].sort().join() !== [...ns].sort().join()) mal(`${d}: "aceptada" debe ordenar todas las oraciones del cuerpo`);
        // Las tarjetas salen en el orden del cuerpo: si ya fuera el aceptado, bastaría confirmar sin mover nada.
        else if (p.aceptada.join() === ns.join()) mal(`${d}: el orden aceptado no puede ser el mismo en que se presentan las oraciones`);
        continue;
      }
      if (p.tipo === 'clasificar' && !p.sonda) mal(`${d}: clasificar necesita "sonda"`);
      if (p.tipo === 'relacion-analogia' && !(it.cuerpo && Array.isArray(it.cuerpo.base) && it.cuerpo.base.length === 2)) mal(`${d}: la analogía necesita cuerpo.base con dos palabras`);
      const acept = respuestaAceptada(p);
      const opciones = opcionesPrevio(p, it);
      for (const a of acept) if (!opciones.includes(a)) mal(`${d}: la respuesta aceptada ${a} no es una opción`);
      for (const o of opciones) {
        if (acept.includes(o)) continue;
        let r;
        try { r = calificarPrevio(p, o, it); } catch (e) { mal(`${d}: ${e.message}`); continue; }
        if (r.correcta) continue;
        const sinTabla = p.tipo === 'relacion-analogia';
        const conClave = p.tipo === 'marcar-oracion' ? (r.error !== null) : (sinTabla || Object.prototype.hasOwnProperty.call(p.codigos || {}, o));
        if (!conClave) mal(`${d}: falta el código de la respuesta "${o}"`);
        else if (r.error !== null && !codigoOk(r.error)) mal(`${d}: código ${r.error} desconocido`);
      }
    }
    return errores;
  }

  return { LETRAS, noSe, CLASES, RELACIONES, PROPOSITOS, ANALOGIAS, TIPOS_PREVIO, NOMBRE_EJERCICIO,
    TIPOS_FIGURA, figuras, elementos, referencias, etiquetaRef, citas,
    normalizar, oraciones, numero, problema, problemaTexto, codigoOracion, opcionesPrevio, calificarPrevio,
    preparar, calificar, respaldo, pintura, etiquetaPrevio, textoAnalogia, correccionPrevio, FRASE_NO_APLICA, avisos, formaPrueba, lista, siguiente, ev, validar };
});
