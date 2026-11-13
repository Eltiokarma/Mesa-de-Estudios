/*
 * Medición del lanzamiento en el colegio: funciones puras sobre una lista de eventos.
 * La app guarda los eventos en el celular; este archivo los resume y los exporta.
 * No guarda nombres: solo un identificador anónimo del dispositivo, el grado y el colegio.
 * Funciona en el navegador (window.Medicion) y en Node (require).
 *
 * Tipos de evento:
 *   { tipo: 'prediccion', modulo, unidad, problema, opcion, correcta, error, respaldo, ms }
 *   { tipo: 'prueba', fase: 'entrada'|'salida', modulo, unidad, aciertos, total, respuestas, ms }
 * Pruebas de entrada y salida por curso (nucleo/pruebas.js, banco en catalogo/pruebas/):
 *   { tipo: 'item', fase, curso, forma: 'A'|'B', orden: 'AB'|'BA', banco, item, par, plantilla, unidad,
 *     opcion (letra que vio), correcta, error, ms }                       una por respuesta
 *   { tipo: 'prueba', fase, curso, forma, orden, banco, aciertos, total, respuestas, ms,
 *     origen: 'primera-vez'|'alumno'|'profesor', previas, dias }        una al terminar
 *   previas: unidades del curso que ya había abierto antes de la entrada (si es más de 0, la
 *   entrada no fue "en frío"); dias: días entre la entrada y la salida. La salida solo existe si el profesor
 *   la abrió (origen 'profesor').
 *   { tipo: 'habilitacion', que: 'salida'|'soluciones'|'soluciones-vistas', curso, origen: 'profesor' }
 *     cuando el enlace del profesor abre algo en ese navegador (y cuando el alumno ve las soluciones)
 *   { tipo: 'sesion', accion: 'otro-alumno' }   el alumno de esta PC cede el lugar a otro (id nuevo)
 * Formato lectura (razonamiento verbal; nucleo/lectura.js y docs/formato-lectura.md, sección 6):
 *   { tipo: 'lectura', modulo, unidad, problema: 't001v1', ms }          al tocar "Ya lo leí"
 *   { tipo: 'previo', modulo, unidad, problema: 't001v1.p1', opcion, correcta, error, respaldo, ms }
 *     el paso previo, antes de ver las alternativas (opcion: la oración, 'ninguna', la clase, la relación o el orden)
 *   { tipo: 'prediccion', …, opcion: '2' }   la alternativa elegida, por su posición en el banco (1 a 5), no por la letra
 *   Los tres llevan intento (1 la primera vez que hace ese texto; resumirLectura cuenta solo la primera respuesta).
 *   Pruebas de entrada y salida del módulo: como las de curso (curso: 'razonamiento-verbal', banco: 'lectura',
 *   forma A = indice.entrada, B = indice.salida, orden AB o BA), un 'item' por pregunta (item: 't000av1.p1',
 *   par: 'p1', plantilla: el módulo, opcion: posición en el banco) y una 'prueba' al final con respuestas en posiciones.
 * «No sé» (pruebas de entrada y salida, y práctica con generadores): el 'item' o la 'prediccion' llevan nose: true,
 *   opcion '' y error '' (nunca es acierto ni error de un código); la 'prueba' lleva nose (cuántas marcó) y, en
 *   respuestas, un 0 en su lugar. Los eventos sin el campo (datos de antes) se leen como sin «No sé».
 *   Para la ganancia de Hake, «No sé» cuenta como no acierto. La «confianza calibrada» es la tasa de aciertos
 *   sobre lo intentado: aciertos / (respondidas − «No sé»).
 * Cola de repaso (nucleo/repaso.js y app/repaso.js; versión R de docs/pogil-v2-rive.md):
 *   { tipo: 'repaso-item', curso, unidad, plantilla, problema, opcion, correcta, error, respaldo, nose, ms,
 *     paso, dias, atraso, desde, tipoOpcion, tipoBien }      una por pregunta
 *   paso: el intervalo en que estaba la unidad (0 = primer repaso); dias: días desde su «día 0» (desde, el primer
 *   ejercicio terminado); atraso: días después de la fecha que le tocaba; tipoOpcion y tipoBien: la unidad que eligió
 *   en «¿Qué tipo de problema es?» y si acertó.
 *   fuente: 'generador', 'papel', 'ejercicio' (verbal suelto) o 'lectura'. En 'papel' no hay alternativas: el alumno
 *   marca autoevaluacion 'si' (me salió), 'no' o 'nose', y el evento NO lleva correcta. No es acierto medido y
 *   resumirRepaso lo cuenta aparte.
 *   { tipo: 'repaso', aciertos, total, nose, tipoBien, ms }   una al terminar la tanda
 * Todos llevan además: t (fecha ISO), alumno (id anónimo), grado, colegio, version.
 */
(function (root, fabrica) {
  const api = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Medicion = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const COLUMNAS = ['t', 'alumno', 'grado', 'colegio', 'version', 'tipo', 'fase', 'modulo', 'unidad', 'problema',
    'opcion', 'correcta', 'error', 'respaldo', 'aciertos', 'total', 'ms',
    // Pruebas por curso (al final, para no mover las columnas de los archivos ya exportados).
    'curso', 'forma', 'orden', 'banco', 'item', 'par', 'plantilla', 'origen', 'previas', 'dias', 'que', 'accion',
    // Respuestas de cada prueba (letras en predicciones, posiciones en el banco en lectura).
    'respuestas',
    // «No sé»: true en un item o una predicción; en una prueba, cuántas marcó.
    'nose',
    // «Dejar una pregunta» (13 nov 2026): la duda del alumno sobre una unidad; valor del arrastre en la práctica viva.
    'texto', 'valor', 'via',
    // Cola de repaso (13 nov 2026).
    'paso', 'atraso', 'desde', 'tipoOpcion', 'tipoBien',
    // De dónde salió la pregunta del repaso y, en los problemas de papel, lo que marcó el alumno (14 nov 2026).
    'fuente', 'autoevaluacion'];

  // «No sé» de un evento: true o un número en los nuevos; nada en los de antes (cuenta como 0).
  const noseDe = e => (e.nose === true || e.nose === 'true' ? 1 : Number(e.nose) || 0);
  const tasa = (a, n) => (n ? a / n : null);

  function aCSV(eventos) {
    const celda = x => { if (x === undefined || x === null) return ''; const s = String(x); return /[",\n;]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
    return [COLUMNAS.join(','), ...eventos.map(e => COLUMNAS.map(k => celda(e[k])).join(','))].join('\n') + '\n';
  }

  // Resumen por módulo: prueba de entrada y salida (promedio de aciertos por alumno),
  // predicciones hechas, porcentaje de acierto y qué errores se eligieron cuántas veces.
  function resumir(eventos) {
    const por = {};
    const m = id => (por[id] = por[id] || { modulo: id, alumnos: new Set(), entrada: {}, salida: {}, crudo: { entrada: {}, salida: {} }, predicciones: 0, aciertos: 0, nose: 0, errores: {} });
    for (const e of eventos) {
      if (!e.modulo) continue;
      const r = m(e.modulo); r.alumnos.add(e.alumno);
      if (e.tipo === 'prediccion') {
        r.predicciones++;
        if (noseDe(e)) r.nose++;
        else if (e.correcta) r.aciertos++;
        else if (e.error) r.errores[e.error] = (r.errores[e.error] || 0) + 1;
      } else if (e.tipo === 'prueba' && (e.fase === 'entrada' || e.fase === 'salida') && e.total) {
        r[e.fase][e.alumno] = e.aciertos / e.total; // si repite, vale la última
        r.crudo[e.fase][e.alumno] = { aciertos: Number(e.aciertos) || 0, total: Number(e.total), nose: noseDe(e) };
      }
    }
    const prom = o => { const v = Object.values(o); return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null; };
    return Object.values(por).map(r => {
      const ambos = Object.keys(r.entrada).filter(a => a in r.salida);
      // «No sé» y confianza calibrada por fase, con la última prueba de cada alumno.
      const suma = f => Object.values(r.crudo[f]).reduce((t, x) => ({ a: t.a + x.aciertos, n: t.n + x.total, ns: t.ns + x.nose }), { a: 0, n: 0, ns: 0 });
      const se = suma('entrada'), ss = suma('salida');
      return {
        modulo: r.modulo, alumnos: r.alumnos.size,
        entrada: prom(r.entrada), salida: prom(r.salida),
        // Ganancia solo con quienes hicieron las dos pruebas (si no, se comparan grupos distintos).
        pareados: ambos.length,
        ganancia: ambos.length ? ambos.reduce((s, a) => s + r.salida[a] - r.entrada[a], 0) / ambos.length : null,
        predicciones: r.predicciones,
        acierto: r.predicciones ? r.aciertos / r.predicciones : null,
        // Proporción de «No sé» y confianza calibrada (aciertos sobre lo intentado) en la entrada, la salida y la práctica.
        nose: { entrada: tasa(se.ns, se.n), salida: tasa(ss.ns, ss.n), practica: tasa(r.nose, r.predicciones) },
        confianza: { entrada: tasa(se.a, se.n - se.ns), salida: tasa(ss.a, ss.n - ss.ns), practica: tasa(r.aciertos, r.predicciones - r.nose) },
        errores: Object.entries(r.errores).sort((a, b) => b[1] - a[1]).map(([id, n]) => ({ id, n })),
      };
    });
  }

  // Resumen por curso de las pruebas de entrada y salida.
  // Puntaje de cada alumno = aciertos / total de su prueba (si repite, vale la última).
  // Ganancia normalizada de Hake (1998): <g> = (salida − entrada) / (1 − entrada), con los promedios
  // de los alumnos pareados (los que hicieron las dos). También se da el promedio de las g individuales
  // (sin los que sacaron todo en la entrada, para quienes g no existe).
  // Por error: cuántos alumnos pareados lo eligieron al menos una vez en la entrada y en la salida.
  // Las formas son paralelas (mismos códigos de error), así que la comparación es justa.
  // porForma compara A con B en la entrada: si las formas fueran equivalentes, se parecen.
  function resumirCursos(eventos) {
    // Preguntas sueltas ('item'): una por alumno, curso, fase y pregunta (vale la última, por si recargó a media
    // prueba y la repitió), y solo de pruebas terminadas (las abandonadas no entran a «No sé» ni a los errores).
    const terminadas = new Set(eventos.filter(e => e.tipo === 'prueba' && e.curso && e.total).map(e => `${e.alumno}|${e.curso}|${e.fase}`));
    const clave = e => (e.item ? `${e.alumno}|${e.curso}|${e.fase}|${e.item}` : e);
    const ultimo = new Map();
    for (const e of eventos) if (e.tipo === 'item' && e.curso) ultimo.set(clave(e), e);
    eventos = eventos.filter(e => e.tipo !== 'item' || (ultimo.get(clave(e)) === e && terminadas.has(`${e.alumno}|${e.curso}|${e.fase}`)));
    const por = {};
    const c = id => (por[id] = por[id] || { curso: id, entrada: {}, salida: {}, forma: { entrada: {}, salida: {} }, errores: { entrada: {}, salida: {} },
      plantillas: {}, previas: {}, items: { entrada: { n: 0, bien: 0, nose: 0 }, salida: { n: 0, bien: 0, nose: 0 } } });
    for (const e of eventos) {
      if (!e.curso || (e.fase !== 'entrada' && e.fase !== 'salida')) continue;
      const r = c(e.curso);
      if (e.tipo === 'prueba' && e.total) {
        r[e.fase][e.alumno] = e.aciertos / e.total;
        r.forma[e.fase][e.alumno] = e.forma;
        if (e.fase === 'salida') (r.dias = r.dias || {})[e.alumno] = e.dias;
        if (e.fase === 'entrada') r.previas[e.alumno] = Number(e.previas) || 0;
      } else if (e.tipo === 'item') {
        const ns = noseDe(e), bien = !ns && e.correcta ? 1 : 0;
        if (!ns && !e.correcta && e.error) ((r.errores[e.fase][e.error] = r.errores[e.fase][e.error] || new Set())).add(e.alumno);
        const it = r.items[e.fase]; it.n++; it.bien += bien; it.nose += ns;
        if (e.plantilla) {
          const p = (r.plantillas[e.plantilla] = r.plantillas[e.plantilla] || { entrada: [0, 0, 0], salida: [0, 0, 0] });
          p[e.fase][0] += bien; p[e.fase][1]++; p[e.fase][2] = (p[e.fase][2] || 0) + ns;
        }
      }
    }
    const prom = l => (l.length ? l.reduce((a, b) => a + b, 0) / l.length : null);
    return Object.values(por).sort((a, b) => a.curso.localeCompare(b.curso)).map(r => {
      // Pareados: hicieron las dos pruebas en días distintos. Una salida el mismo día de la entrada (dias = 0) no
      // mide aprendizaje y empuja la ganancia hacia 0: se cuenta aparte. Los datos viejos sin «dias» entran.
      const ambos = Object.keys(r.entrada).filter(a => a in r.salida);
      const mismoDia = ambos.filter(a => (r.dias || {})[a] === 0);
      const pareados = ambos.filter(a => (r.dias || {})[a] !== 0);
      const pre = prom(pareados.map(a => r.entrada[a])), post = prom(pareados.map(a => r.salida[a]));
      const gi = pareados.filter(a => r.entrada[a] < 1).map(a => (r.salida[a] - r.entrada[a]) / (1 - r.entrada[a]));
      const enPar = new Set(pareados);
      const ids = new Set([...Object.keys(r.errores.entrada), ...Object.keys(r.errores.salida)]);
      const cuenta = (fase, id) => [...(r.errores[fase][id] || [])].filter(a => enPar.has(a)).length;
      const formas = {};
      for (const f of ['A', 'B']) {
        const al = Object.keys(r.entrada).filter(a => r.forma.entrada[a] === f);
        formas[f] = { alumnos: al.length, entrada: prom(al.map(a => r.entrada[a])) };
      }
      return {
        curso: r.curso,
        alumnosEntrada: Object.keys(r.entrada).length, alumnosSalida: Object.keys(r.salida).length, pareados: pareados.length, pareadosMismoDia: mismoDia.length,
        entrada: prom(Object.values(r.entrada)), salida: prom(Object.values(r.salida)),
        entradaPareados: pre, salidaPareados: post,
        hake: pre === null ? null : pre >= 1 ? null : (post - pre) / (1 - pre),
        hakeIndividual: prom(gi),
        entradaConPrevias: Object.values(r.previas).filter(n => n > 0).length,
        // «No sé» y confianza calibrada, por pregunta respondida (eventos 'item').
        nose: { entrada: tasa(r.items.entrada.nose, r.items.entrada.n), salida: tasa(r.items.salida.nose, r.items.salida.n) },
        confianza: { entrada: tasa(r.items.entrada.bien, r.items.entrada.n - r.items.entrada.nose), salida: tasa(r.items.salida.bien, r.items.salida.n - r.items.salida.nose) },
        porForma: formas,
        errores: [...ids].map(id => ({ id, antes: cuenta('entrada', id), despues: cuenta('salida', id),
          antesTodos: (r.errores.entrada[id] || new Set()).size, despuesTodos: (r.errores.salida[id] || new Set()).size }))
          .sort((a, b) => b.antes - a.antes || b.despues - a.despues || a.id.localeCompare(b.id)),
        plantillas: Object.entries(r.plantillas).map(([id, p]) => ({ id, entrada: p.entrada[1] ? p.entrada[0] / p.entrada[1] : null, salida: p.salida[1] ? p.salida[0] / p.salida[1] : null,
          noseEntrada: tasa(p.entrada[2] || 0, p.entrada[1]), noseSalida: tasa(p.salida[2] || 0, p.salida[1]),
          confianzaEntrada: tasa(p.entrada[0], p.entrada[1] - (p.entrada[2] || 0)), confianzaSalida: tasa(p.salida[0], p.salida[1] - (p.salida[2] || 0)) }))
          .sort((a, b) => a.id.localeCompare(b.id)),
      };
    });
  }

  // Formato lectura: el paso previo (sin alternativas a la vista) y la respuesta (con alternativas), por
  // módulo, por unidad y por código de error. Comparar las dos columnas de un código dice si el error
  // aparece por sí solo o porque la alternativa lo sugiere. Un error sin código cuenta en "sinCodigo".
  // Solo entran los módulos con eventos 'previo' o 'lectura' (los de lectura). Si un alumno repite un texto
  // (campo intento), cuenta solo la primera vez que respondió cada paso previo y cada pregunta.
  function resumirLectura(eventos) {
    const visto = new Set();
    const por = {};
    const nuevo = () => ({ previos: 0, previosBien: 0, respuestas: 0, respuestasBien: 0 });
    const m = id => (por[id] = por[id] || { modulo: id, alumnos: new Set(), lecturas: [], ...nuevo(), unidades: {}, codigos: {}, sinCodigo: { previo: 0, respuesta: 0 } });
    const deLectura = new Set(eventos.filter(e => e.modulo && (e.tipo === 'previo' || e.tipo === 'lectura')).map(e => e.modulo));
    for (const e of eventos) {
      if (!deLectura.has(e.modulo)) continue;
      const r = m(e.modulo);
      if (e.tipo === 'lectura') {
        r.alumnos.add(e.alumno);
        const k = ['lectura', e.modulo, e.alumno, e.problema].join('|');
        if (!e.fase && !visto.has(k) && Number.isFinite(Number(e.ms))) { visto.add(k); r.lecturas.push(Number(e.ms)); }
        continue;
      }
      if (e.tipo !== 'previo' && e.tipo !== 'prediccion') continue;
      r.alumnos.add(e.alumno);
      const clave = [e.modulo, e.tipo, e.alumno, e.problema].join('|');
      if (visto.has(clave)) continue;
      visto.add(clave);
      const cual = e.tipo === 'previo' ? 'previo' : 'respuesta';
      const u = (r.unidades[e.unidad || '?'] = r.unidades[e.unidad || '?'] || nuevo());
      for (const x of [r, u]) { x[cual + 's']++; if (e.correcta) x[cual + 'sBien']++; }
      if (e.correcta) continue;
      if (!e.error) { r.sinCodigo[cual]++; continue; }
      const c = (r.codigos[e.error] = r.codigos[e.error] || { id: e.error, previo: 0, respuesta: 0, respaldo: e.respaldo || '' });
      c[cual]++;
    }
    const tasa = (a, n) => (n ? a / n : null);
    const mediana = l => { if (!l.length) return null; const s = [...l].sort((a, b) => a - b), k = s.length >> 1; return s.length % 2 ? s[k] : (s[k - 1] + s[k]) / 2; };
    const num = id => Number(String(id).replace(/\D/g, '')) || 0;
    return Object.values(por).sort((a, b) => a.modulo.localeCompare(b.modulo)).map(r => ({
      modulo: r.modulo, alumnos: r.alumnos.size, textosLeidos: r.lecturas.length, msLecturaMediana: mediana(r.lecturas),
      previos: r.previos, aciertoPrevio: tasa(r.previosBien, r.previos),
      respuestas: r.respuestas, aciertoRespuesta: tasa(r.respuestasBien, r.respuestas),
      unidades: Object.entries(r.unidades).sort((a, b) => a[0].localeCompare(b[0])).map(([id, x]) => ({ id, previos: x.previos, aciertoPrevio: tasa(x.previosBien, x.previos),
        respuestas: x.respuestas, aciertoRespuesta: tasa(x.respuestasBien, x.respuestas) })),
      codigos: Object.values(r.codigos).sort((a, b) => (b.previo + b.respuesta) - (a.previo + a.respuesta) || num(a.id) - num(b.id)),
      sinCodigo: r.sinCodigo,
    }));
  }

  /*
   * Cola de repaso: acierto del «día 0» contra el del repaso días después (la medida de la versión R).
   * Por alumno y unidad: el día 0 es el primer día con un ejercicio terminado de la unidad ('prediccion' o
   * 'examen-item', fuera de las pruebas de entrada y salida), contado en la hora del Perú (UTC−5, sin horario de
   * verano); el acierto del día es la tasa de esos ejercicios ese día («No sé» cuenta como no acierto). Cada
   * 'repaso-item' cae en un tramo según los días desde ese día 0. Solo entran los pares que tienen las dos cosas.
   * Ojo: el día 0 junta predicciones de escenas y de prácticas; el repaso es siempre de generador.
   */
  const TRAMOS = [['1-3', 1, 3], ['4-10', 4, 10], ['11-30', 11, 30], ['31+', 31, Infinity]];
  const diaPeru = t => { const ms = Date.parse(t); return Number.isFinite(ms) ? new Date(ms - 5 * 3600e3).toISOString().slice(0, 10) : null; };
  const diasEntre = (a, b) => Math.round((Date.parse(b + 'T00:00:00Z') - Date.parse(a + 'T00:00:00Z')) / 864e5);
  function resumirRepaso(eventos) {
    const dia0 = {}, delDia = {}, rep = {};
    const k = e => `${e.alumno}|${e.unidad}`;
    const ejercicio = e => (e.tipo === 'prediccion' || e.tipo === 'examen-item') && e.unidad && !e.fase;
    for (const e of eventos) {
      if (!ejercicio(e)) continue;
      const d = diaPeru(e.t); if (!d) continue;
      if (!dia0[k(e)] || d < dia0[k(e)]) dia0[k(e)] = d;
    }
    const todos = eventos.filter(e => e.tipo === 'repaso-item' && e.unidad);
    const autoeval = todos.filter(e => e.autoevaluacion);
    const items = todos.filter(e => !e.autoevaluacion);
    for (const e of eventos) {
      if (!ejercicio(e) || diaPeru(e.t) !== dia0[k(e)]) continue;
      const x = (delDia[k(e)] = delDia[k(e)] || [0, 0]); x[1]++; if (e.correcta && !noseDe(e)) x[0]++;
    }
    let tipoN = 0, tipoBien = 0, total = 0, bien = 0, nose = 0;
    const porPaso = {};
    for (const e of items) {
      total++; if (noseDe(e)) nose++; else if (e.correcta === true || e.correcta === 'true') bien++;
      if (e.tipoBien !== undefined && e.tipoBien !== '') { tipoN++; if (e.tipoBien === true || e.tipoBien === 'true') tipoBien++; }
      const p = (porPaso[e.paso] = porPaso[e.paso] || [0, 0]); p[1]++; if (!noseDe(e) && (e.correcta === true || e.correcta === 'true')) p[0]++;
      const d0 = dia0[k(e)], d = diaPeru(e.t);
      if (!d0 || !d || !delDia[k(e)]) continue;
      const n = diasEntre(d0, d), tr = TRAMOS.find(([, a, b]) => n >= a && n <= b);
      if (!tr) continue;
      const r = ((rep[tr[0]] = rep[tr[0]] || {})[k(e)] = rep[tr[0]][k(e)] || [0, 0]);
      r[1]++; if (!noseDe(e) && (e.correcta === true || e.correcta === 'true')) r[0]++;
    }
    const prom = l => (l.length ? l.reduce((a, b) => a + b, 0) / l.length : null);
    // Autoevaluación (papel): cuántas marcó «me salió», «no me salió» y «no sé», en total y por tramo de días.
    const au = { preguntas: autoeval.length, si: 0, no: 0, nose: 0, tramos: TRAMOS.map(([id]) => ({ tramo: id, n: 0, si: 0 })) };
    for (const e of autoeval) {
      const v = e.autoevaluacion === 'si' || e.autoevaluacion === 'no' ? e.autoevaluacion : 'nose';
      au[v]++;
      const d0 = dia0[k(e)], d = diaPeru(e.t);
      if (!d0 || !d) continue;
      const n = diasEntre(d0, d), i = TRAMOS.findIndex(([, a, b]) => n >= a && n <= b);
      if (i >= 0) { au.tramos[i].n++; if (v === 'si') au.tramos[i].si++; }
    }
    return {
      autoevaluacion: au,
      preguntas: total, acierto: tasa(bien, total), nose: tasa(nose, total),
      tipo: { preguntas: tipoN, acierto: tasa(tipoBien, tipoN) },
      porPaso: Object.keys(porPaso).sort().map(p => ({ paso: Number(p), preguntas: porPaso[p][1], acierto: tasa(porPaso[p][0], porPaso[p][1]) })),
      tramos: TRAMOS.map(([id]) => {
        const pares = Object.keys(rep[id] || {});
        return { tramo: id, pares: pares.length,
          delDia: prom(pares.map(p => delDia[p][0] / delDia[p][1])),
          repaso: prom(pares.map(p => rep[id][p][0] / rep[id][p][1])) };
      }),
    };
  }

  // Guardar un evento en el dispositivo (solo navegador). Lo usan la app y las escenas, que
  // comparten el mismo origen y por eso el mismo almacenamiento. perfil: { alumno, grado, colegio };
  // si no se pasa, se lee el de la app. Sin perfil (escena abierta sin pasar por la app) no se guarda:
  // un evento sin alumno no sirve para comparar entrada y salida.
  const CLAVE_PERFIL = 'lab-v1', CLAVE_EVENTOS = 'lab-medicion-v1', MAX_EVENTOS = 5000;
  function eventosGuardados(almacen) {
    try { return JSON.parse((almacen || localStorage).getItem(CLAVE_EVENTOS)) || []; } catch { return []; }
  }
  function guardar(ev, version, perfil, almacen) {
    try {
      almacen = almacen || localStorage;
      perfil = perfil || JSON.parse(almacen.getItem(CLAVE_PERFIL)) || {};
      if (!perfil.alumno) return false;
      const l = eventosGuardados(almacen);
      // t es único y creciente en el dispositivo (con cuenta, el servidor no duplica por alumno + t, y la sesión
      // sube desde el último t): si dos eventos caen en el mismo milisegundo, el segundo va 1 ms después.
      let t = Date.now();
      const ultimo = l.length ? Date.parse(l[l.length - 1].t) : NaN;
      if (ultimo >= t) t = ultimo + 1;
      l.push({ t: new Date(t).toISOString(), alumno: perfil.alumno, grado: perfil.grado || '', colegio: perfil.colegio || '', version, ...ev });
      almacen.setItem(CLAVE_EVENTOS, JSON.stringify(l.slice(-MAX_EVENTOS)));
      return true;
    } catch { return false; } // sin almacenamiento o sin espacio: se pierde este evento, la app sigue
  }

  return { COLUMNAS, aCSV, resumir, resumirCursos, resumirLectura, resumirRepaso, guardar, eventosGuardados };
});
