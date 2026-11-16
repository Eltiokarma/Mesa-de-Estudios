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
    if (partirVectores(est)) cambio = true;
    return cambio;
  }
  // 16 nov: «Magnitudes y vectores» se partió (Gerson). Las ideas de vectores, sus casos del laboratorio y la visita
  // pasan a fisica.vectores; quien ya había empezado no pierde nada ni encuentra la unidad nueva cerrada.
  const MAG = 'fisica.magnitudes-y-vectores', VEC = 'fisica.vectores';
  const IDEAS_VEC = ['componentes', 'resultante', 'productos'];
  const MESAS_VEC = ['flechas-espacio', 'suma-libre', 'componentes', 'productos-libre'];
  function partirVectores(est) {
    if (est.partidoV >= 1) return false;
    est.partidoV = 1;
    let cambio = true;
    const t = est.teoria && est.teoria[MAG];
    if (t && t.ideas) for (const id of IDEAS_VEC) if (t.ideas[id]) {
      const n = est.teoria[VEC] = est.teoria[VEC] || { ideas: {} };
      n.ideas = n.ideas || {};
      if (!n.ideas[id]) n.ideas[id] = t.ideas[id];
      delete t.ideas[id];
      if (t.idea === id) { t.idea = undefined; n.idea = id; }
    }
    for (const c of Array.isArray(est.coleccion) ? est.coleccion : []) {
      if (c && c.unidad === MAG && MESAS_VEC.includes(c.mesa)) c.unidad = VEC;
    }
    // «Ya la estudié» en la unidad vieja incluía los vectores: la marca y la visita también valen para la nueva.
    for (const k of ['vistas', 'marcadas']) if (est[k] && est[k][MAG] && !est[k][VEC]) est[k][VEC] = est[k][MAG];
    return cambio;
  }

  return { NIVELES, MIN_AYUDA, MIN_SOLO, indice, nivel, estudiadas, teoriaCompleta, migrar };
});
