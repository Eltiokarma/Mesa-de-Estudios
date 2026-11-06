/*
 * Pruebas de entrada y salida por curso (tarea la1 de la hoja de ruta).
 * El banco vive en catalogo/pruebas/<curso>.json (formato en docs/arquitectura.md) y la app lo
 * lee ya armado de app/datos/pruebas.json. Cada curso tiene dos formas paralelas, A y B: mismos
 * pares de ítems, misma plantilla, mismo número de opciones y los mismos códigos de error.
 * Contrabalanceo: la mitad de los alumnos hace A de entrada y B de salida; la otra mitad, al revés.
 * El orden sale del id anónimo del alumno, así que es siempre el mismo en ese dispositivo.
 * Funciona en el navegador (window.Pruebas) y en Node (require).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('./azar.js') : root.Azar);
  if (nodo) module.exports = api;
  else root.Pruebas = api;
})(typeof self !== 'undefined' ? self : this, function (Azar) {
  'use strict';
  const FORMAS = ['A', 'B'];
  const FASES = ['entrada', 'salida'];
  const LETRAS = ['A', 'B', 'C', 'D', 'E'];
  const RESPALDOS = ['documentado', 'parcial', 'hipotesis'];

  // 'AB' (A de entrada, B de salida) o 'BA', al azar con semilla anónima y por curso:
  // un mismo alumno puede hacer AB en física y BA en química, lo que también equilibra.
  function orden(alumno, curso) {
    return Azar.crear(`orden|${alumno}|${curso}`).moneda() ? 'AB' : 'BA';
  }
  function formaDe(ord, fase) {
    if (ord !== 'AB' && ord !== 'BA') throw new Error(`orden inválido: ${ord}`);
    if (!FASES.includes(fase)) throw new Error(`fase inválida: ${fase}`);
    return fase === 'entrada' ? ord[0] : ord[1];
  }

  // Ítems de una forma, en el orden del banco. id = par + forma (por ejemplo, "fis-03B").
  function items(banco, forma) {
    if (!FORMAS.includes(forma)) throw new Error(`forma inválida: ${forma}`);
    return banco.pares.map(p => ({ id: p.par + forma, par: p.par, forma, plantilla: p.plantilla, unidad: p.unidad, mide: p.mide,
      enunciado: p[forma].enunciado, opciones: p[forma].opciones }));
  }

  // Las opciones en el orden en que las ve el alumno: barajadas con una semilla fija por alumno e ítem,
  // para que la posición de la correcta no se aprenda y para que al volver se vean igual.
  function presentar(item, alumno) {
    const rng = Azar.crear(`opciones|${alumno}|${item.id}`);
    return rng.barajar(item.opciones.map((o, i) => ({ ...o, indice: i }))).map((o, k) => ({ ...o, letra: LETRAS[k] }));
  }

  // Lo que se registra de una respuesta (sin el texto: el banco lo tiene).
  function corregir(opcion) {
    return { opcion: opcion.letra, correcta: !!opcion.correcta, error: opcion.correcta ? '' : (opcion.error || '') };
  }

  // Revisa el formato del banco y la equivalencia de las formas. Devuelve una lista de problemas (vacía si está bien).
  // No comprueba las respuestas: eso lo hace catalogo/pruebas/pruebas.test.js con los motores.
  function validar(banco) {
    const mal = [];
    const m = t => mal.push(`${banco && banco.curso || '?'}: ${t}`);
    if (!banco || typeof banco !== 'object') return ['el banco no es un objeto'];
    if (!/^[a-z0-9-]+$/.test(banco.curso || '')) m('curso inválido');
    if (!/^\d+\.\d+\.\d+$/.test(banco.version || '')) m('version debe ser MAYOR.MENOR.PARCHE');
    if (!(banco.minutos > 0)) m('falta minutos (duración estimada)');
    if (!banco.errores || typeof banco.errores !== 'object') m('falta el diccionario de errores');
    if (!Array.isArray(banco.pares) || banco.pares.length < 8 || banco.pares.length > 10) m('cada forma debe tener de 8 a 10 ítems');
    const vistos = new Set(), usados = new Set();
    for (const p of banco.pares || []) {
      const q = t => m(`${p.par}: ${t}`);
      if (!p.par || vistos.has(p.par)) q('par vacío o repetido');
      vistos.add(p.par);
      for (const k of ['plantilla', 'unidad', 'mide']) if (!p[k]) q(`falta ${k}`);
      const firma = {};
      for (const f of FORMAS) {
        const it = p[f];
        if (!it) { q(`falta la forma ${f}`); continue; }
        if (!it.enunciado || it.enunciado.length < 15) q(`${f}: enunciado vacío o muy corto`);
        const op = it.opciones || [];
        if (op.length < 3 || op.length > 5) q(`${f}: debe tener de 3 a 5 opciones`);
        if (op.filter(o => o.correcta).length !== 1) q(`${f}: debe tener exactamente una opción correcta`);
        const textos = op.map(o => String(o.texto || '').trim());
        if (textos.some(t => !t)) q(`${f}: hay una opción sin texto`);
        if (new Set(textos).size !== textos.length) q(`${f}: hay opciones repetidas`);
        for (const o of op) {
          if (o.correcta && o.error) q(`${f}: la correcta no lleva código de error`);
          if (!o.correcta) {
            if (!o.error) q(`${f}: la opción «${o.texto}» no tiene código de error`);
            else if (!banco.errores || !banco.errores[o.error]) q(`${f}: el error ${o.error} no está en el diccionario`);
            usados.add(o.error);
          }
        }
        firma[f] = op.filter(o => !o.correcta).map(o => o.error).sort().join(',') + `|${op.length}`;
      }
      // Formas paralelas: los mismos errores y el mismo número de opciones, para comparar antes y después.
      if (firma.A && firma.B && firma.A !== firma.B) q(`las formas A y B no miden los mismos errores (${firma.A} contra ${firma.B})`);
    }
    for (const [k, e] of Object.entries(banco.errores || {})) {
      if (!RESPALDOS.includes(e.respaldo)) m(`error ${k}: respaldo debe ser ${RESPALDOS.join(', ')}`);
      if (!e.describe) m(`error ${k}: falta describe`);
      if (!usados.has(k)) m(`error ${k}: está en el diccionario pero ningún ítem lo usa`);
    }
    return mal;
  }

  return { FORMAS, FASES, LETRAS, orden, formaDe, items, presentar, corregir, validar };
});
