/*
 * Medición del lanzamiento en el colegio: funciones puras sobre una lista de eventos.
 * La app guarda los eventos en el celular; este archivo los resume y los exporta.
 * No guarda nombres: solo un identificador anónimo del dispositivo, el grado y el colegio.
 * Funciona en el navegador (window.Medicion) y en Node (require).
 *
 * Tipos de evento:
 *   { tipo: 'prediccion', modulo, unidad, problema, opcion, correcta, error, respaldo, ms }
 *   { tipo: 'prueba', fase: 'entrada'|'salida', modulo, unidad, aciertos, total, respuestas, ms }
 * Todos llevan además: t (fecha ISO), alumno (id anónimo), grado, colegio, version.
 */
(function (root, fabrica) {
  const api = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Medicion = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const COLUMNAS = ['t', 'alumno', 'grado', 'colegio', 'version', 'tipo', 'fase', 'modulo', 'unidad', 'problema',
    'opcion', 'correcta', 'error', 'respaldo', 'aciertos', 'total', 'ms'];

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

  return { COLUMNAS, aCSV, resumir, guardar, eventosGuardados };
});
