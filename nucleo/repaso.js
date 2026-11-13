/*
 * Cola de repaso (versión R de docs/pogil-v2-rive.md, sección 9; diseño aprobado por Gerson el 13 nov 2026).
 * Funciones puras sobre est.repaso: qué unidades entran, cuáles tocan hoy, en qué orden y cómo avanza cada una.
 * No dibuja ni genera preguntas: las preguntas salen de los generadores de cada unidad (app/repaso.js).
 * Funciona en el navegador (window.Repaso) y en Node (require).
 *
 * est.repaso[unidad] = { desde, paso, toca, hechos, aciertos, ultimo }
 *   desde   fecha (AAAA-MM-DD, local) del primer ejercicio terminado de la unidad: su «día 0»
 *   paso    índice en INTERVALOS del próximo repaso (0 = el primero)
 *   toca    fecha desde la que se le pregunta
 *   hechos, aciertos   preguntas de repaso respondidas y acertadas («No sé» cuenta como respondida y no acertada)
 *   ultimo  fecha de la última respuesta, o null
 * est.repasoDia = { dia, n }   cuántas preguntas de repaso respondió hoy (tope diario)
 *
 * HIPÓTESIS (no tienen estudio detrás; se ajustan con los datos del piloto): los intervalos 2, 7, 21 y 45 días,
 * volver a 2 días después de un fallo o un «No sé», y 4 preguntas por día. Lo que sí tiene respaldo es espaciar
 * y mezclar (docs/pogil-v2-rive.md, 5.4 y 5.7).
 */
(function (root, fabrica) {
  const api = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Repaso = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const INTERVALOS = [2, 7, 21, 45];
  const MAX_DIA = 4;
  // Entra a la cola quien terminó un ejercicio de la unidad: una predicción (escena o práctica) o una pregunta
  // del simulacro. Abrirla o marcarla como estudiada no basta (decisión de Gerson, 13 nov 2026).
  const TIPOS_EJERCICIO = new Set(['prediccion', 'examen-item']);

  // ---------- Fechas AAAA-MM-DD (se cuentan en UTC para que no las mueva el horario de verano) ----------
  const esFecha = s => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s);
  const aMs = s => Date.UTC(+s.slice(0, 4), +s.slice(5, 7) - 1, +s.slice(8, 10));
  const sumarDias = (s, n) => new Date(aMs(s) + n * 864e5).toISOString().slice(0, 10);
  const entre = (a, b) => Math.round((aMs(b) - aMs(a)) / 864e5); // días de a a b
  // Fecha local de un instante (la del celular del alumno).
  const fechaLocal = d => { const x = new Date(d); return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`; };

  const nueva = desde => ({ desde, paso: 0, toca: sumarDias(desde, INTERVALOS[0]), hechos: 0, aciertos: 0, ultimo: null });

  /*
   * sembrar(est, eventos, tieneGenerador, fechaDe = fechaLocal) → unidades nuevas en la cola.
   * Recorre los eventos del alumno (est.alumno) y mete en est.repaso cada unidad con generador que tenga un ejercicio
   * terminado, con desde = el día del primero. Las que ya están no se tocan.
   */
  function sembrar(est, eventos, tieneGenerador, fechaDe = fechaLocal) {
    est.repaso = est.repaso && typeof est.repaso === 'object' ? est.repaso : {};
    const primera = {};
    for (const e of eventos || []) {
      if (!e || !TIPOS_EJERCICIO.has(e.tipo) || !e.unidad || (est.alumno && e.alumno && e.alumno !== est.alumno)) continue;
      if (e.fase) continue; // las pruebas de entrada y salida no cuentan como ejercicio
      if (est.repaso[e.unidad] || !tieneGenerador(e.unidad)) continue;
      const f = fechaDe(e.t);
      if (!esFecha(f)) continue;
      if (!primera[e.unidad] || f < primera[e.unidad]) primera[e.unidad] = f;
    }
    const nuevas = Object.keys(primera).sort();
    for (const u of nuevas) est.repaso[u] = nueva(primera[u]);
    return nuevas;
  }

  // Lo que queda hoy del tope diario.
  function quedanHoy(est, hoy, max = MAX_DIA) {
    const d = est.repasoDia;
    return Math.max(0, max - (d && d.dia === hoy ? Number(d.n) || 0 : 0));
  }

  // Unidades que tocan hoy, de la más atrasada a la menos (empate: la de menos hechos, después por id).
  function pendientes(est, hoy) {
    const r = est.repaso || {};
    return Object.keys(r).filter(u => r[u] && esFecha(r[u].toca) && r[u].toca <= hoy)
      .sort((a, b) => (r[a].toca < r[b].toca ? -1 : r[a].toca > r[b].toca ? 1 : 0) || (r[a].hechos - r[b].hechos) || (a < b ? -1 : 1));
  }

  // Próxima fecha de repaso después de hoy (para «Tu próximo repaso: …»), o null.
  function proxima(est, hoy) {
    const r = est.repaso || {};
    const f = Object.values(r).map(x => x && x.toca).filter(t => esFecha(t) && t > hoy).sort();
    return f[0] || null;
  }

  /*
   * elegir(est, hoy, cursoDe, max) → unidades para la tanda de hoy, mezcladas.
   * Toma las más atrasadas hasta el tope (una pregunta por unidad: nunca dos de la misma) y las ordena alternando
   * cursos: cada vez va la primera de la lista cuyo curso no sea el de la anterior; si no hay, la primera.
   */
  function elegir(est, hoy, cursoDe, max = quedanHoy(est, hoy)) {
    const lista = pendientes(est, hoy).slice(0, Math.max(0, max));
    const orden = [];
    while (lista.length) {
      const prev = orden.length ? cursoDe(orden[orden.length - 1]) : null;
      let k = lista.findIndex(u => cursoDe(u) !== prev);
      if (k < 0) k = 0;
      orden.push(lista.splice(k, 1)[0]);
    }
    return orden;
  }

  /*
   * opcionesTipo(unidad, { cursoDe, estudiadas, delCurso, rng, n }) → n ids de unidad, barajados, con la correcta.
   * «¿Qué tipo de problema es?»: los distractores son unidades que el alumno ya estudió (primero del mismo curso,
   * que es donde se confunde de verdad), y si faltan, otras unidades del mismo curso del catálogo.
   */
  function opcionesTipo(unidad, { cursoDe, estudiadas = [], delCurso = () => [], rng, n = 3 }) {
    const c = cursoDe(unidad);
    const vistas = new Set([unidad]);
    const otras = [];
    const tomar = l => { for (const u of l) { if (otras.length >= n - 1) return; if (!vistas.has(u)) { vistas.add(u); otras.push(u); } } };
    const est = [...estudiadas].sort();
    tomar(rng.barajar(est.filter(u => cursoDe(u) === c)));
    tomar(rng.barajar(est.filter(u => cursoDe(u) !== c)));
    tomar(rng.barajar([...delCurso(c)].sort()));
    return rng.barajar([unidad, ...otras]);
  }

  /*
   * anotar(est, unidad, { correcta, nose }, hoy) → la ficha actualizada.
   * Acierto: pasa al intervalo siguiente (el último se repite). Fallo o «No sé»: vuelve al primero.
   */
  function anotar(est, unidad, { correcta = false, nose = false } = {}, hoy) {
    est.repaso = est.repaso || {};
    const f = est.repaso[unidad] = Object.assign(nueva(hoy), est.repaso[unidad] || {});
    const bien = !!correcta && !nose;
    f.hechos = (Number(f.hechos) || 0) + 1;
    if (bien) f.aciertos = (Number(f.aciertos) || 0) + 1;
    f.paso = bien ? Math.min((Number(f.paso) || 0) + 1, INTERVALOS.length - 1) : 0;
    // El intervalo es el del paso que acaba de pasar: tras acertar el primero (2 días), el siguiente es a 7.
    f.toca = sumarDias(hoy, INTERVALOS[bien ? f.paso : 0]);
    f.ultimo = hoy;
    const d = est.repasoDia && est.repasoDia.dia === hoy ? est.repasoDia : { dia: hoy, n: 0 };
    d.n = (Number(d.n) || 0) + 1;
    est.repasoDia = d;
    return f;
  }

  // Semilla de la pregunta: cambia con cada repaso de la unidad, así nunca repite números (ni los de la práctica).
  const semilla = (alumno, unidad, ficha, k = 0) => `repaso-${alumno}-${unidad}-${(ficha && ficha.hechos) || 0}-${k}`;

  /*
   * unir(servidor, cliente) → est.repaso unido (la misma regla está en servidor/app/union.py).
   * Por unidad: gana la ficha con más hechos; si empatan, la de ultimo más reciente; si también, la del cliente.
   * desde se queda con la fecha más antigua de las dos.
   */
  function unir(s, c) {
    const obj = x => (x && typeof x === 'object' && !Array.isArray(x) ? x : {});
    s = obj(s); c = obj(c);
    const out = {};
    for (const u of new Set([...Object.keys(s), ...Object.keys(c)])) {
      const a = obj(s[u]), b = obj(c[u]);
      if (!Object.keys(a).length || !Object.keys(b).length) { out[u] = JSON.parse(JSON.stringify(Object.keys(b).length ? b : a)); continue; }
      const ha = Number(a.hechos) || 0, hb = Number(b.hechos) || 0;
      const ua = a.ultimo || '', ub = b.ultimo || '';
      const gana = ha > hb || (ha === hb && ua > ub) ? a : b;
      const f = JSON.parse(JSON.stringify(gana));
      const ds = [a.desde, b.desde].filter(esFecha).sort();
      if (ds.length) f.desde = ds[0];
      out[u] = f;
    }
    return out;
  }

  return { INTERVALOS, MAX_DIA, TIPOS_EJERCICIO, sumarDias, entre, fechaLocal, nueva, sembrar, quedanHoy, pendientes, proxima, elegir, opcionesTipo, anotar, semilla, unir };
});
