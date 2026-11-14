/*
 * Alternativas para los problemas de lápiz y papel (plantillas/<id>/papel.json), paso 4 de la cola de repaso
 * (orden de Gerson, 14 nov 2026: una pregunta por magnitud).
 *
 * Un problema de papel puede traer "preguntas": una por cada magnitud que pide.
 *   {
 *     "id": "p1a",                        único en el archivo
 *     "pregunta": "¿Qué presión tiene el gas?",
 *     "enunciado": "...",                 opcional: el enunciado sin las otras preguntas (si el problema pide varias)
 *     "unidad": "atm", "decimales": 2,    cómo se escribe el número (Predicciones.formatear)
 *     "correcta": { "fn": "estado", "args": [{ "V": 41, "n": 10, "T": 300 }], "campo": "P", "valor": 6 },
 *     "errores": [ { "id": "GQ13-masa-atomica", "respaldo": "parcial", "explicacion": "…",
 *                    "fn": "estado", "args": [{ "V": 41, "n": 20, "T": 300 }], "campo": "P", "valor": 12 } ]
 *   }
 * Regla 1: cada valor es una llamada al motor de la plantilla (fn, args, campo); "valor" es el resultado ya
 * calculado, para que el repaso no cargue el motor, y herramientas/papel-opciones.test.js lo recalcula siempre.
 * Un error es un argumento cambiado por la equivocación típica que ya cuentan los pasos (16 g/mol en lugar de 32,
 * °C en lugar de K). Un valor puede ser texto si el motor devuelve texto («tautología»).
 * Con "preguntas", el problema se repasa con alternativas (acierto medido); sin ellas, como autoevaluación.
 * Funciona en el navegador (window.PapelOpciones) y en Node (require).
 */
(function (root, fabrica) {
  const api = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.PapelOpciones = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const RESPALDOS = ['documentado', 'parcial', 'hipotesis'];
  const MAX_PALABRAS_ERROR = 30; // docs/escena-viva.md pide 20 en el ejercicio vivo; aquí la explicación es lo único que ve

  // campo: "P", "gases.He.P" o "valor": el resultado mismo si es un número o un texto, o su campo «valor» si el motor
  // devuelve un objeto como { valor, simple } (cinética, mol y composición).
  const campo = (r, k) => (!k || k === 'valor'
    ? (r && typeof r === 'object' && 'valor' in r ? r.valor : r)
    : String(k).split('.').reduce((o, p) => (o == null ? o : o[p]), r));
  function calcular(motor, c) {
    if (!motor || typeof motor[c.fn] !== 'function') throw new Error(`el motor no tiene ${c.fn}`);
    return campo(motor[c.fn](...JSON.parse(JSON.stringify(c.args || []))), c.campo);
  }
  const igual = (a, b) => (typeof a === 'number' && typeof b === 'number'
    ? Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b)) : a === b);

  // Texto de un valor como lo ve el alumno.
  const texto = (P, pq, v) => (typeof v === 'number' ? P.formatear(v, pq.decimales === undefined ? 2 : pq.decimales) + (pq.unidad ? ' ' + pq.unidad : '') : String(v));

  /*
   * alternativas(pq, rng, P) → [{ letra, texto, correcta, error }], con el formato de Predicciones.armar.
   * Los errores que dan el mismo texto que la correcta u otro error se descartan (no distinguen nada).
   */
  function alternativas(pq, rng, P) {
    const errores = pq.errores.map(e => ({ id: e.id, valor: e.valor, explicacion: e.explicacion, respaldo: e.respaldo, fuente: e.fuente || null }));
    if (typeof pq.correcta.valor === 'number') {
      return P.armar({ correcta: pq.correcta.valor, errores, rng, unidad: pq.unidad || '', decimales: pq.decimales === undefined ? 2 : pq.decimales, negativos: true, total: 5 });
    }
    const t = v => ({ clave: 'txt:' + String(v), texto: String(v) });
    return P.armarTexto({ correcta: t(pq.correcta.valor), errores: errores.map(e => ({ ...e, ...t(e.valor) })), rng, total: 5 });
  }

  /*
   * validar(problema, motor, P) → lista de problemas (vacía si está bien). Comprueba, para cada pregunta, que los
   * valores sean los del motor, que haya al menos dos errores que se vean distintos de la correcta y entre sí, que
   * estén en escala (Predicciones.enEscala) y que cada error tenga código, respaldo y explicación.
   */
  // ¿El problema trae preguntas con alternativas? (Los papel.json de lectura usan «preguntas» para otra cosa.)
  const tienePreguntas = p => !!(p && Array.isArray(p.preguntas) && p.preguntas.length && p.preguntas.every(q => q && q.correcta && Array.isArray(q.errores)));
  function validar(problema, motor, P) {
    const mal = [];
    const ids = new Set();
    for (const pq of (tienePreguntas(problema) ? problema.preguntas : [])) {
      const q = `${problema.id}/${pq.id}`;
      if (!pq.id || ids.has(pq.id)) mal.push(`${q}: id vacío o repetido`); ids.add(pq.id);
      if (!pq.pregunta || /<[a-z]/i.test(pq.pregunta + (pq.enunciado || ''))) mal.push(`${q}: falta la pregunta o trae HTML`);
      // Sin enunciado propio se ve el del problema entero, con la pregunta repetida (aviso de la tanda A).
      if (!pq.enunciado) mal.push(`${q}: falta el enunciado sin las preguntas`);
      if (!pq.correcta || !Array.isArray(pq.errores)) { mal.push(`${q}: falta correcta o errores`); continue; }
      const todos = [{ ...pq.correcta, id: 'correcta' }, ...pq.errores];
      for (const c of todos) {
        let v;
        try { v = calcular(motor, c); } catch (e) { mal.push(`${q} ${c.id}: ${e.message}`); continue; }
        if (v === undefined || v === null || (typeof v === 'number' && !Number.isFinite(v))) mal.push(`${q} ${c.id}: el motor no da ${c.campo}`);
        else if (!igual(v, c.valor)) mal.push(`${q} ${c.id}: el motor da ${v}, el archivo dice ${c.valor}`);
      }
      const vistos = new Set([texto(P, pq, pq.correcta.valor)]);
      let distintos = 0;
      for (const e of pq.errores) {
        if (!e.id || !RESPALDOS.includes(e.respaldo) || !e.explicacion) mal.push(`${q} ${e.id}: falta código, respaldo o explicación`);
        if (e.explicacion && e.explicacion.split(/\s+/).length > MAX_PALABRAS_ERROR) mal.push(`${q} ${e.id}: la explicación pasa de ${MAX_PALABRAS_ERROR} palabras`);
        // Solo los números pasan por la escala. Un texto de cifras («7131113») puede ser justo el error (escribir todo
        // sin llevar): ahí la distancia a la correcta no dice si engaña. Quien use texto para un número, que lo piense.
        if (typeof e.valor === 'number' && typeof pq.correcta.valor === 'number' && !P.enEscala(e.valor, pq.correcta.valor, e.id)) mal.push(`${q} ${e.id}: fuera de escala`);
        const t = texto(P, pq, e.valor);
        if (!vistos.has(t)) { vistos.add(t); distintos++; } else mal.push(`${q} ${e.id}: se ve igual que otra alternativa (${t})`);
      }
      if (distintos < 2) mal.push(`${q}: hacen falta al menos dos errores distintos`);
    }
    return mal;
  }

  return { calcular, alternativas, validar, texto, tienePreguntas, RESPALDOS };
});
