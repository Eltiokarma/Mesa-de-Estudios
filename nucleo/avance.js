/*
 * Avance honesto por unidad (P0-A del recorrido, 14 nov 2026): abrir no es estudiar.
 * Cuatro niveles, cada uno con su evidencia (docs/pogil-v2-rive.md §0, «Medición»; docs/recorrido.md):
 *   0 · Visitada      la abrió, tocó un ejercicio o jugó en el laboratorio (est.vistas[unidad]: solo fecha de visita)
 *   1 · La estudié    terminó todas las ideas de su teoría, o la marcó él mismo («Ya la estudié»: est.marcadas)
 *   2 · Con ayuda     acertó 3 o más preguntas con retroalimentación (predicciones, práctica, «Ahora tú», previos)
 *   3 · Sin ayuda     sacó 4 de 5 o más en un simulacro de la unidad (sin pistas)
 *   4 · La recuerdo   acertó su repaso otro día (est.repaso[unidad]: aciertos en un día distinto al de entrada)
 * El nivel es el más alto alcanzado; cada nivel dice qué falta para el siguiente. Funciones puras: sirven en el
 * navegador (window.Avance) y en Node (pruebas). Nada de esto toca las respuestas ni los eventos guardados.
 */
(function (root, fabrica) {
  const api = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Avance = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const NIVELES = ['Visitada', 'La estudié', 'Con ayuda', 'Sin ayuda', 'La recuerdo'];
  const MIN_AYUDA = 3;          // aciertos con retroalimentación para «con ayuda»
  const MIN_SOLO = 0.8;         // proporción del simulacro para «sin ayuda» (4 de 5)
  const CON_AYUDA = new Set(['prediccion', 'previo', 'repaso-item']);

  // Índice por unidad de los eventos del alumno: aciertos con ayuda y mejor simulacro. Se arma una vez por pantalla.
  function indice(eventos, alumno) {
    const ix = {};
    const de = u => ix[u] || (ix[u] = { ayuda: 0, mejor: 0, toques: 0 });
    for (const e of eventos || []) {
      if (!e || !e.unidad || (alumno && e.alumno && e.alumno !== alumno)) continue;
      const f = de(e.unidad);
      f.toques++;
      if ((CON_AYUDA.has(e.tipo) || (e.tipo === 'teoria' && e.momento === 'ahora-tu')) && e.correcta) f.ayuda++;
      if (e.tipo === 'examen' && e.total) f.mejor = Math.max(f.mejor, e.aciertos / e.total);
    }
    return ix;
  }

  // Teoría completa: todas sus ideas terminadas (est.teoria[u].ideas[*].hecha), según cuántas ideas tiene la unidad.
  function teoriaCompleta(est, u) {
    const n = u && u.teoria && u.teoria.ideas;
    if (!n) return false;
    const st = ((est.teoria || {})[u.id] || {}).ideas || {};
    return Object.values(st).filter(i => i && i.hecha).length >= n;
  }

  // nivel(est, unidad, ix) → { nivel: -1..4, nombre, visita, estudio, ayuda, solo, recuerdo, falta }
  function nivel(est, u, ix) {
    const id = u.id, f = (ix || {})[id] || { ayuda: 0, mejor: 0, toques: 0 };
    const ex = (est.examenes || {})[id] || {};
    const mejorEx = Math.max(f.mejor, ex.mejor || 0, ex.ultimo && ex.ultimo.total ? ex.ultimo.aciertos / ex.ultimo.total : 0);
    const rp = (est.repaso || {})[id];
    const r = {
      visita: !!((est.vistas || {})[id] || f.toques || (est.teoria || {})[id] || ex.ultimo || rp || (est.marcadas || {})[id]),
      estudio: teoriaCompleta(est, u) || !!(est.marcadas || {})[id],
      ayuda: f.ayuda >= MIN_AYUDA,
      solo: mejorEx >= MIN_SOLO - 1e-9,
      recuerdo: !!(rp && rp.aciertos > 0 && rp.ultimo && rp.desde && rp.ultimo !== rp.desde),
    };
    r.nivel = r.recuerdo ? 4 : r.solo ? 3 : r.ayuda ? 2 : r.estudio ? 1 : r.visita ? 0 : -1;
    r.nombre = r.nivel >= 0 ? NIVELES[r.nivel] : 'Sin empezar';
    r.falta = r.nivel < 1 ? 'Termina su teoría o márcala como estudiada.'
      : r.nivel < 2 ? `Acierta ${MIN_AYUDA - Math.min(MIN_AYUDA, f.ayuda)} preguntas más en sus ejercicios.`
      : r.nivel < 3 ? 'Saca 4 de 5 en un simulacro de la unidad.'
      : r.nivel < 4 ? 'Acierta su repaso otro día.' : '';
    return r;
  }

  // Unidades estudiadas (nivel 1 o más) de una lista: lo que mide el porcentaje del temario.
  const estudiadas = (est, unidades, ix) => unidades.filter(u => nivel(est, u, ix).nivel >= 1).length;

  /*
   * Migración (una vez): hasta el 14 nov, est.vistas mezclaba «abrí algo» con «la marqué como estudiada». No se puede
   * separar después, así que todo queda como visita y el alumno vuelve a marcar lo que de verdad estudió. Las fechas,
   * las respuestas y los eventos no cambian. est.avanceV marca que ya se migró.
   */
  function migrar(est) {
    let cambio = false;
    if (!(est.avanceV >= 1)) {
      est.vistas = est.vistas && typeof est.vistas === 'object' ? est.vistas : {};
      est.marcadas = est.marcadas && typeof est.marcadas === 'object' ? est.marcadas : {};
      est.avanceV = 1;
      cambio = true;
    }
    for (const pt of PARTICIONES) {
      // Antes de mudar (la idea que se va todavía está en la unidad vieja), o después para quien ya mudó.
      if (pt.estudiada && conservaEstudio(est, pt)) cambio = true;
      if (partir(est, pt)) cambio = true;
      if (pt.sinHuella && sinHuella(est, pt.sinHuella.en || pt.de, pt.sinHuella)) cambio = true;
    }
    // 18 nov (auditoría de MRUV, A1): pendiente-aceleracion conservó su id con otra Predice en la unidad nueva; después de
    // la partición, una predicción suya sin huella es de la pregunta vieja (también la «c») y se vuelve a preguntar.
    if (sinHuella(est, 'fisica.mruv-y-caida-libre', { marca: 'reinicioVT', ideas: ['pendiente-aceleracion'] })) cambio = true;
    // 19 nov (etapa 5, fase 3): en Propiedades periódicas, `energia-ionizacion` conservó su id con otra Predice (fósforo y
    // azufre en vez de nitrógeno y oxígeno). Después de la partición partidoTP, una predicción suya sin huella es de la
    // pregunta vieja y se vuelve a preguntar, una vez. Las otras dos ideas que vinieron conservan su pregunta y sus ids.
    if (sinHuella(est, 'quimica.propiedades-periodicas', { marca: 'prediccionTP2', ideas: ['energia-ionizacion'] })) cambio = true;
    // 19 nov (etapa 6): en Geometría molecular, `forma-polaridad` conservó su id con otra Predice (el CH₂Cl₂ en vez del CO₂).
    // Después de la partición partidoEN, una predicción suya sin huella es de la pregunta vieja y se vuelve a preguntar, una vez.
    if (sinHuella(est, 'quimica.geometria-molecular', { marca: 'prediccionEN2', ideas: ['forma-polaridad'] })) cambio = true;
    // 19 nov (etapa 6, «Estática»): la unidad se rehizo con seis ideas. Cinco conservan su id con otra Predice: una
    // predicción suya sin huella es de la pregunta vieja y se vuelve a preguntar, una vez (prediccionES). La idea vieja
    // `polea-movil` se fue (su contenido pasó a las ideas 2 y 4) y entró `cuerpo-rigido`: quien había terminado las seis
    // de antes conserva «Ya la estudié» (estudiadaES), y la idea nueva le queda por hacer.
    if (sinHuella(est, 'fisica.estatica', { marca: 'prediccionES', ideas: ['diagrama-y-parejas', 'nudo-en-equilibrio', 'rozamiento-se-ajusta', 'resorte-proporcional', 'torque-y-brazo'] })) cambio = true;
    if (conservaEstudio(est, { de: 'fisica.estatica', a: 'fisica.estatica', estudiada: { marca: 'estudiadaES', fecha: '2026-11-19',
      ideas: ['diagrama-y-parejas', 'nudo-en-equilibrio', 'rozamiento-se-ajusta', 'resorte-proporcional', 'torque-y-brazo', 'polea-movil'] } })) cambio = true;
    // 19 nov (etapa 6): seis unidades más se rehicieron conservando los ids de sus ideas, con otra Predice. Una predicción
    // suya sin huella es de la pregunta vieja y se vuelve a preguntar, una vez (cada unidad con su marca). Las que sumaron
    // ideas (División, Polígonos, Verdades y mentiras, Analogías) le dejan «Ya la estudié» a quien había terminado todas
    // las de antes; las nuevas le quedan por hacer. Polígonos perdió `trapezoides` (pasó a la idea del trapecio).
    for (const r of REHECHAS_E6) {
      if (sinHuella(est, r.u, { marca: r.p, ideas: r.cambian })) cambio = true;
      if (r.e && conservaEstudio(est, { de: r.u, a: r.u, estudiada: { marca: r.e, fecha: '2026-11-19', ideas: r.antes } })) cambio = true;
    }
    return cambio;
  }
  const REHECHAS_E6 = [
    { u: 'aritmetica.numeros-primos-y-divisores', p: 'prediccionPD',
      cambian: ['rectangulos', 'criba', 'factorizacion', 'divisores', 'euler', 'fermat-wilson'] },
    { u: 'algebra.division-de-polinomios', p: 'prediccionDP', e: 'estudiadaDP',
      cambian: ['algoritmo', 'ruffini', 'divisor-k', 'teorema-resto', 'cocientes-notables'],
      antes: ['algoritmo', 'ruffini', 'divisor-k', 'teorema-resto', 'cocientes-notables'] },
    { u: 'geometria.poligonos-y-cuadrilateros', p: 'prediccionPC2', e: 'estudiadaPC2',
      cambian: ['suma-de-angulos', 'diagonales', 'paralelogramos', 'trapecios'],
      antes: ['suma-de-angulos', 'diagonales', 'paralelogramos', 'trapecios', 'trapezoides'] },
    { u: 'trigonometria.longitud-de-arco-y-sector', p: 'prediccionLA',
      cambian: ['arco', 'sector', 'trapecio-circular', 'faja-y-eje'] },
    { u: 'razonamiento-matematico.verdades-y-mentiras', p: 'prediccionVM', e: 'estudiadaVM',
      cambian: ['suposicion', 'negar-bien', 'contradictorias'], antes: ['suposicion', 'contradictorias', 'negar-bien'] },
    { u: 'razonamiento-verbal.analogias', p: 'prediccionAN', e: 'estudiadaAN',
      cambian: ['relacion-no-tema', 'clase-y-causa', 'sinonimo-antonimo'], antes: ['relacion-no-tema', 'clase-y-causa', 'sinonimo-antonimo'] },
    // Etapa 7 (19 nov): Sentido contextual conservó sus cuatro ids con otra Predice y sumó `sentido-figurado`.
    { u: 'razonamiento-verbal.sentido-contextual', p: 'prediccionSC', e: 'estudiadaSC',
      cambian: ['acepcion', 'denota-connota', 'palabra-precisa', 'inferir-significado'], antes: ['acepcion', 'denota-connota', 'palabra-precisa', 'inferir-significado'] },
    // Nomenclatura inorgánica (19 nov, etapa 7): tres ideas con otra Predice y una idea nueva (peroxidos-hidruros).
    { u: 'quimica.nomenclatura-inorganica', p: 'prediccionNI', e: 'estudiadaNI',
      cambian: ['estados-oxidacion', 'arbol-funciones', 'sales'],
      antes: ['estados-oxidacion', 'tres-nombres', 'arbol-funciones', 'sales', 'sales-acidas-basicas-hidratadas'] },
  ];
  // Borra, una sola vez (su marca), las predicciones guardadas sin huella de las ideas que se rehicieron con otra
  // predicción y conservaron su id. Las que traen huella (prediccionDe) las revisa la app al abrir la idea.
  function sinHuella(est, de, { marca, ideas }) {
    if (est[marca] >= 1) return false;
    est[marca] = 1;
    const t = est.teoria && est.teoria[de];
    if (t && t.ideas) for (const id of ideas) {
      const i = t.ideas[id];
      if (i && i.prediccion !== undefined && !i.prediccionDe) delete i.prediccion;
    }
    return true;
  }
  // «La estudié» de una unidad que se queda con ideas nuevas (una mudanza que además agregó ideas): quien había terminado
  // todas las ideas de antes (estudiada.ideas) la tenía estudiada, y con las nuevas por hacer ya no la tendría completa.
  // Se le guarda como «Ya la estudié» (est.marcadas, con la fecha de su visita), una sola vez (estudiada.marca), para que
  // no pierda el nivel ni se le cierren las unidades que la piden; las ideas nuevas le quedan por hacer. Cuenta una idea
  // vieja como hecha si está hecha en la unidad, o en la de destino con su nombre nuevo (quien ya mudó, o quien la hizo
  // allá). Nada de esto toca la teoría ni las respuestas.
  function conservaEstudio(est, { de, a, renombrar, estudiada: { marca, ideas, fecha } }) {
    if (est[marca] >= 1) return false;
    est[marca] = 1;
    const t = ((est.teoria || {})[de] || {}).ideas || {}, n = ((est.teoria || {})[a] || {}).ideas || {};
    const hecha = id => !!((t[id] && t[id].hecha) || (renombrar && renombrar[id] && n[renombrar[id]] && n[renombrar[id]].hecha));
    if (ideas.every(hecha) && !(est.marcadas || {})[de]) {
      est.marcadas = est.marcadas && typeof est.marcadas === 'object' ? est.marcadas : {};
      const v = (est.vistas || {})[de];
      est.marcadas[de] = typeof v === 'string' && v ? v : fecha;
    }
    return true;
  }
  // Unidades que se partieron en dos (Gerson): las ideas que se fueron, sus mesas del laboratorio, las marcas del glosario
  // de sus palabras y la visita pasan a la unidad nueva; quien ya había empezado no pierde nada ni encuentra la unidad
  // nueva cerrada. Cada partición tiene su marca en est (una sola vez cada una). Una mudanza (mudanza: true) lleva ideas
  // a una unidad que ya existía: pueden cambiar de nombre (renombrar) y no copian la visita ni «Ya la estudié».
  const PARTICIONES = [
    // 16 nov: «Magnitudes y vectores» → «Magnitudes y unidades» (conserva el id) + fisica.vectores.
    { marca: 'partidoV', de: 'fisica.magnitudes-y-vectores', a: 'fisica.vectores',
      ideas: ['componentes', 'resultante', 'productos'], mesas: ['flechas-espacio', 'suma-libre', 'componentes', 'productos-libre'] },
    // 17 nov: «Exponentes, radicales y productos notables» → «Exponentes y radicales» (conserva el id) +
    // algebra.productos-notables (docs/etapa3/decisiones.md, «Segunda ronda»).
    { marca: 'partidoExp', de: 'algebra.exponentes-y-productos-notables', a: 'algebra.productos-notables',
      ideas: ['cuadrado-suma', 'radicales-dobles', 'racionalizar'], mesas: ['cubo-se-abre', 'rectangulo-x-p-q'],
      glosario: ['producto notable', 'diferencia de cuadrados', 'arista', 'volumen', 'identidad', 'distributiva', 'radical doble',
        'denominador', 'racionalizar', 'conjugado'] },
    // 18 nov: «MRU, MRUV y caída libre» → «Movimiento rectilíneo uniforme» (conserva el id) + fisica.mruv-y-caida-libre
    // (docs/etapa4/decisiones.md). Las mesas ida-vuelta (área bajo v–t) y recta-vt son de la gráfica v–t; la pista con
    // acelerador, de la aceleración. Las palabras van con su clave del glosario (sin tildes: Glosario.clave).
    { marca: 'partidoMRU', de: 'fisica.movimiento-rectilineo', a: 'fisica.mruv-y-caida-libre',
      ideas: ['pendiente-aceleracion', 'caida-libre'], mesas: ['pista-libre', 'ida-vuelta', 'recta-vt'],
      glosario: ['aceleracion', 'caida libre', 'gravedad'],
      // Las ideas que se quedaron (mru, desplazamiento-distancia y encuentro) conservan su id pero se rehicieron con
      // otra predicción (auditoría de MRU, 18 nov, A1). La app ya vuelve a preguntar si la opción no existe o si la
      // pregunta cambió desde que se respondió (huella prediccionDe). Una predicción guardada sin huella es de antes de
      // la huella, y pudo responder la pregunta vieja: se borra una vez, con su propia marca (partidoMRU ya corrió para
      // quien entró). Lo demás de la idea (hecha, momento, casos) se queda.
      sinHuella: { marca: 'prediccionMRU', ideas: ['mru', 'desplazamiento-distancia', 'encuentro'] } },
    // 19 nov: «Movimiento parabólico y circular» → «Movimiento parabólico» (conserva el id) + fisica.movimiento-circular
    // (docs/etapa5/propuesta-fisica.md §9, decisión 1). Se van las tres ideas del giro, sus dos mesas (la rueda y el giro)
    // y sus once palabras (con su clave del glosario, sin tildes). La idea que se queda, `un-reloj-dos-ejes`, conserva su
    // predicción (la soltada contra la lanzada) con los mismos ids de opción: lo guardado sigue valiendo y no se borra.
    // Quien había terminado las cuatro ideas de antes conserva «Ya la estudié» en las dos unidades (estudiada): con las
    // ideas nuevas por hacer perdería el nivel y se le cerrarían Gravitación, Oscilaciones y Magnetismo.
    { marca: 'partidoPC', de: 'fisica.movimiento-parabolico-y-circular', a: 'fisica.movimiento-circular',
      ideas: ['arco-y-radian', 'rapidez-constante-acelera', 'dos-aceleraciones'], mesas: ['rueda', 'giro'],
      // Las cuatro últimas son palabras nuevas de Movimiento circular (fase 3): la unidad vieja no las tenía, pero si
      // alguna quedó marcada con el id viejo (un glosario armado antes de la partición), también se va.
      glosario: ['radian', 'desplazamiento angular', 'velocidad angular', 'aceleracion angular', 'velocidad tangencial', 'periodo', 'frecuencia',
        'mcu', 'mcuv', 'aceleracion centripeta', 'aceleracion tangencial', 'arco', 'transmision', 'cambio de velocidad', 'aceleracion total'],
      estudiada: { marca: 'estudiadaPC', fecha: '2026-11-19',
        ideas: ['un-reloj-dos-ejes', 'arco-y-radian', 'rapidez-constante-acelera', 'dos-aceleraciones'] },
      // Fase 3 (19 nov): `arco-y-radian` y `dos-aceleraciones` conservan su id con otra Predice (la vuelta de la cabina y
      // el carrusel que ya gira parejo). Una predicción suya guardada sin huella es de la pregunta vieja y se borra una vez
      // (prediccionPC), en la unidad nueva (en: después de partir, las ideas ya están allá). `rapidez-constante-acelera`
      // conserva su pregunta con los mismos ids de opción: no se toca.
      sinHuella: { marca: 'prediccionPC', en: 'fisica.movimiento-circular', ideas: ['arco-y-radian', 'dos-aceleraciones'] } },
    // 18 nov: las sumatorias de «Las cuatro operaciones» se mudan a «Sucesiones y series», que ya existía y tenía la misma
    // idea con otro nombre (docs/etapa4/decisiones.md). Es una mudanza, no una partición:
    //   - la idea `sumatorias` pasa a ser `suma-rectangulo` (renombrar); si el alumno ya la tenía allá, se queda la suya;
    //   - su predicción no viaja (era otra pregunta, con otras opciones): se conserva lo demás (hecha, momento, casos);
    //   - la idea en curso de Sucesiones no se toca si ya tenía una;
    //   - «Ya la estudié» y la visita de Las cuatro operaciones no valen para Sucesiones (mudanza: true);
    //   - las ideas que se quedan y se rehicieron con otra predicción (mismo id, otras opciones) pierden la predicción
    //     guardada si era una opción que ya no existe (reiniciaPrediccion: idea → ids viejos): el lector la buscaría;
    //   - quien había terminado las 6 ideas de antes conserva «La estudié» (estudiada, con su propia marca, porque
    //     mudadoSum ya corrió para quien entró entre el 18 nov y esta corrección): con las 2 ideas nuevas (prestamo y
    //     cifras-ocultas) quedaba con 5 de 7, perdía el nivel y se le cerraban Divisibilidad, Combinatoria, Razonamiento
    //     numérico y Polinomios si no los había abierto (auditoría de Las cuatro operaciones, B9). Las nuevas quedan por hacer.
    { marca: 'mudadoSum', de: 'aritmetica.cuatro-operaciones', a: 'aritmetica.sucesiones-y-series',
      ideas: ['sumatorias'], renombrar: { sumatorias: 'suma-rectangulo' }, sinPrediccion: true, mudanza: true,
      reiniciaPrediccion: { complemento: ['nueves', 'cada10'], 'multiplicar-partes': ['tres', 'diez', 'triple'],
        'defecto-exceso': ['mismo', 'divisor'], 'cifras-producto': ['suma', 'menos'] },
      mesas: ['escaleras-a-z'], glosario: ['sumatoria'],
      estudiada: { marca: 'estudiadaSum', fecha: '2026-11-18',
        ideas: ['otras-bases', 'sumatorias', 'complemento', 'multiplicar-partes', 'defecto-exceso', 'cifras-producto'] } },
    // 19 nov: «Tabla periódica» → «Tabla periódica» (conserva el id: periodos, grupos, bloques y metales) +
    // quimica.propiedades-periodicas (radio, ionización y electronegatividad; docs/etapa5/propuesta-quimica.md §3 y §12).
    // Las dos mesas del laboratorio comparan propiedades: van con la unidad nueva. La idea `periodos-grupos-bloques`
    // conserva su id con otra Predice (el rubidio): una predicción suya guardada sin huella es de la pregunta vieja y se
    // borra una vez (prediccionTP). Quien había terminado las cinco ideas de antes conserva «Ya la estudié» en Tabla
    // periódica (estudiadaTP), que ahora tiene dos ideas nuevas (`bloques-transicion` y `metales-no-metales`).
    { marca: 'partidoTP', de: 'quimica.tabla-periodica', a: 'quimica.propiedades-periodicas',
      ideas: ['radio-atomico-ionico', 'energia-ionizacion', 'electronegatividad'], mesas: ['tres-propiedades', 'dos-elementos'],
      glosario: ['radio atomico', 'picometro', 'carga nuclear', 'energia de ionizacion', 'afinidad electronica', 'electronegatividad', 'tendencia periodica'],
      sinHuella: { marca: 'prediccionTP', ideas: ['periodos-grupos-bloques'] },
      estudiada: { marca: 'estudiadaTP', fecha: '2026-11-19',
        ideas: ['periodos-grupos-bloques', 'ubicacion-lewis', 'radio-atomico-ionico', 'energia-ionizacion', 'electronegatividad'] } },
    // 19 nov (etapa 6): «Enlace químico y fuerzas intermoleculares» → «Enlace químico» (conserva el id) +
    // quimica.geometria-molecular (forma, hibridación, polaridad de la molécula y fuerzas entre moléculas;
    // docs/etapa6/propuesta-quimica.md §3 y §12). Se van las ideas `forma-polaridad` y `fuerzas-intermoleculares`, las mesas
    // de la molécula en 3D y de los dos dipolos, y sus palabras (clave del glosario, sin tildes). `tres-enlaces` y
    // `lewis-octeto` conservan su id con otra Predice (el probador y el N₂): una predicción suya sin huella se borra una vez
    // (prediccionEN). Quien había terminado las cinco ideas de antes conserva «Ya la estudié» en las dos (estudiadaEN).
    { marca: 'partidoEN', de: 'quimica.enlace-quimico', a: 'quimica.geometria-molecular',
      ideas: ['forma-polaridad', 'fuerzas-intermoleculares'], mesas: ['molecula-gira', 'dos-dipolos'],
      glosario: ['dipolo', 'molecula polar', 'forma molecular', 'region de electrones', 'fuerzas intermoleculares', 'puente de hidrogeno', 'fuerzas de london', 'dipolo-dipolo'],
      sinHuella: { marca: 'prediccionEN', ideas: ['tres-enlaces', 'lewis-octeto'] },
      estudiada: { marca: 'estudiadaEN', fecha: '2026-11-19',
        ideas: ['tres-enlaces', 'lewis-octeto', 'resonancia', 'forma-polaridad', 'fuerzas-intermoleculares'] } },
  ];
  function partir(est, { marca, de, a, ideas, mesas, glosario, renombrar, sinPrediccion, mudanza, reiniciaPrediccion }) {
    if (est[marca] >= 1) return false;
    est[marca] = 1;
    const t = est.teoria && est.teoria[de];
    if (t && t.ideas) for (const [id, viejas] of Object.entries(reiniciaPrediccion || {})) if (t.ideas[id] && viejas.includes(t.ideas[id].prediccion)) delete t.ideas[id].prediccion;
    if (t && t.ideas) for (const id of ideas) if (t.ideas[id]) {
      const n = est.teoria[a] = est.teoria[a] || { ideas: {} };
      n.ideas = n.ideas || {};
      const destino = (renombrar && renombrar[id]) || id;
      const lleva = Object.assign({}, t.ideas[id]);
      if (sinPrediccion) delete lleva.prediccion;
      if (!n.ideas[destino]) n.ideas[destino] = sinPrediccion ? lleva : t.ideas[id];
      delete t.ideas[id];
      if (t.idea === id) { t.idea = undefined; if (!mudanza || !n.idea) n.idea = destino; }
    }
    for (const c of Array.isArray(est.coleccion) ? est.coleccion : []) {
      if (c && c.unidad === de && mesas.includes(c.mesa)) c.unidad = a;
    }
    // «Ya me la sé» de una palabra que ahora se define en la unidad nueva (est.glosario[unidad][término]).
    const g = est.glosario && est.glosario[de];
    if (g && glosario) for (const k of Object.keys(g)) if (glosario.includes(k)) {
      const n = est.glosario[a] = est.glosario[a] || {};
      if (n[k] === undefined) n[k] = g[k];
      delete g[k];
    }
    // «Ya la estudié» en la unidad vieja incluía lo que se fue: la marca y la visita también valen para la nueva.
    if (!mudanza) for (const k of ['vistas', 'marcadas']) if (est[k] && est[k][de] && !est[k][a]) est[k][a] = est[k][de];
    return true;
  }

  return { NIVELES, MIN_AYUDA, MIN_SOLO, indice, nivel, estudiadas, teoriaCompleta, migrar };
});
