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
 *   { tipo: 'prueba', fase, modulo, unidad, problema, aciertos, total, respuestas: '215', ms }  (posiciones en el banco)
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
    'respuestas'];

  function aCSV(eventos) {
    const celda = x => { if (x === undefined || x === null) return ''; const s = String(x); return /[",\n;]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
    return [COLUMNAS.join(','), ...eventos.map(e => COLUMNAS.map(k => celda(e[k])).join(','))].join('\n') + '\n';
  }

  // Resumen por módulo: prueba de entrada y salida (promedio de aciertos por alumno),
  // predicciones hechas, porcentaje de acierto y qué errores se eligieron cuántas veces.
  function resumir(eventos) {
    const por = {};
    const m = id => (por[id] = por[id] || { modulo: id, alumnos: new Set(), entrada: {}, salida: {}, predicciones: 0, aciertos: 0, errores: {} });
    for (const e of eventos) {
      if (!e.modulo) continue;
      const r = m(e.modulo); r.alumnos.add(e.alumno);
      if (e.tipo === 'prediccion') {
        r.predicciones++;
        if (e.correcta) r.aciertos++;
        else if (e.error) r.errores[e.error] = (r.errores[e.error] || 0) + 1;
      } else if (e.tipo === 'prueba' && (e.fase === 'entrada' || e.fase === 'salida') && e.total) {
        r[e.fase][e.alumno] = e.aciertos / e.total; // si repite, vale la última
      }
    }
    const prom = o => { const v = Object.values(o); return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null; };
    return Object.values(por).map(r => {
      const ambos = Object.keys(r.entrada).filter(a => a in r.salida);
      return {
        modulo: r.modulo, alumnos: r.alumnos.size,
        entrada: prom(r.entrada), salida: prom(r.salida),
        // Ganancia solo con quienes hicieron las dos pruebas (si no, se comparan grupos distintos).
        pareados: ambos.length,
        ganancia: ambos.length ? ambos.reduce((s, a) => s + r.salida[a] - r.entrada[a], 0) / ambos.length : null,
        predicciones: r.predicciones,
        acierto: r.predicciones ? r.aciertos / r.predicciones : null,
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
    const por = {};
    const c = id => (por[id] = por[id] || { curso: id, entrada: {}, salida: {}, forma: { entrada: {}, salida: {} }, errores: { entrada: {}, salida: {} },
      plantillas: {}, previas: {} });
    for (const e of eventos) {
      if (!e.curso || (e.fase !== 'entrada' && e.fase !== 'salida')) continue;
      const r = c(e.curso);
      if (e.tipo === 'prueba' && e.total) {
        r[e.fase][e.alumno] = e.aciertos / e.total;
        r.forma[e.fase][e.alumno] = e.forma;
        if (e.fase === 'entrada') r.previas[e.alumno] = Number(e.previas) || 0;
      } else if (e.tipo === 'item') {
        if (!e.correcta && e.error) ((r.errores[e.fase][e.error] = r.errores[e.fase][e.error] || new Set())).add(e.alumno);
        if (e.plantilla) {
          const p = (r.plantillas[e.plantilla] = r.plantillas[e.plantilla] || { entrada: [0, 0], salida: [0, 0] });
          p[e.fase][0] += e.correcta ? 1 : 0; p[e.fase][1]++;
        }
      }
    }
    const prom = l => (l.length ? l.reduce((a, b) => a + b, 0) / l.length : null);
    return Object.values(por).sort((a, b) => a.curso.localeCompare(b.curso)).map(r => {
      const pareados = Object.keys(r.entrada).filter(a => a in r.salida);
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
        alumnosEntrada: Object.keys(r.entrada).length, alumnosSalida: Object.keys(r.salida).length, pareados: pareados.length,
        entrada: prom(Object.values(r.entrada)), salida: prom(Object.values(r.salida)),
        entradaPareados: pre, salidaPareados: post,
        hake: pre === null ? null : pre >= 1 ? null : (post - pre) / (1 - pre),
        hakeIndividual: prom(gi),
        entradaConPrevias: Object.values(r.previas).filter(n => n > 0).length,
        porForma: formas,
        errores: [...ids].map(id => ({ id, antes: cuenta('entrada', id), despues: cuenta('salida', id),
          antesTodos: (r.errores.entrada[id] || new Set()).size, despuesTodos: (r.errores.salida[id] || new Set()).size }))
          .sort((a, b) => b.antes - a.antes || b.despues - a.despues || a.id.localeCompare(b.id)),
        plantillas: Object.entries(r.plantillas).map(([id, p]) => ({ id, entrada: p.entrada[1] ? p.entrada[0] / p.entrada[1] : null, salida: p.salida[1] ? p.salida[0] / p.salida[1] : null }))
          .sort((a, b) => a.id.localeCompare(b.id)),
      };
    });
  }

  // Formato lectura: el paso previo (sin alternativas a la vista) y la respuesta (con alternativas), por
  // módulo, por unidad y por código de error. Comparar las dos columnas de un código dice si el error
  // aparece por sí solo o porque la alternativa lo sugiere. Un error sin código cuenta en "sinCodigo".
  // Solo entran los módulos con eventos 'previo' o 'lectura' (los de lectura).
  function resumirLectura(eventos) {
    const por = {};
    const nuevo = () => ({ previos: 0, previosBien: 0, respuestas: 0, respuestasBien: 0 });
    const m = id => (por[id] = por[id] || { modulo: id, alumnos: new Set(), lecturas: [], ...nuevo(), unidades: {}, codigos: {}, sinCodigo: { previo: 0, respuesta: 0 } });
    const deLectura = new Set(eventos.filter(e => e.modulo && (e.tipo === 'previo' || e.tipo === 'lectura')).map(e => e.modulo));
    for (const e of eventos) {
      if (!deLectura.has(e.modulo)) continue;
      const r = m(e.modulo);
      if (e.tipo === 'lectura') { r.alumnos.add(e.alumno); if (!e.fase && Number.isFinite(Number(e.ms))) r.lecturas.push(Number(e.ms)); continue; }
      if (e.tipo !== 'previo' && e.tipo !== 'prediccion') continue;
      r.alumnos.add(e.alumno);
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
      l.push({ t: new Date().toISOString(), alumno: perfil.alumno, grado: perfil.grado || '', colegio: perfil.colegio || '', version, ...ev });
      almacen.setItem(CLAVE_EVENTOS, JSON.stringify(l.slice(-MAX_EVENTOS)));
      return true;
    } catch { return false; } // sin almacenamiento o sin espacio: se pierde este evento, la app sigue
  }

  return { COLUMNAS, aCSV, resumir, resumirCursos, resumirLectura, guardar, eventosGuardados };
});
