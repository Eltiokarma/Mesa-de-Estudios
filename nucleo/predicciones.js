/*
 * Núcleo del formato "predicciones": arma las alternativas de un problema generado.
 * Regla 1: los valores los calcula el generador de cada módulo, nunca un modelo de lenguaje.
 * Regla 3: cada alternativa incorrecta sale de un error con nombre, explicación y respaldo
 * ("documentado", con fuente; "parcial", con un estudio indirecto o una sola fuente; o "hipotesis", que los datos del colegio confirmarán o no).
 * Funciona en el navegador (window.Predicciones) y en Node (require).
 */
(function (root, fabrica) {
  const api = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Predicciones = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const LETRAS = ['A', 'B', 'C', 'D', 'E'];

  // Número con coma decimal, como en los exámenes peruanos. Quita ceros sobrantes.
  function formatear(n, decimales = 2) {
    if (!Number.isFinite(n)) return String(n);
    const r = Math.round(n * 10 ** decimales) / 10 ** decimales;
    const [ent, dec] = Math.abs(r).toFixed(decimales).replace(/0+$/, '').replace(/\.$/, '').split('.');
    const miles = ent.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return (r < 0 ? '−' : '') + miles + (dec ? ',' + dec : '');
  }

  // Un segmento de texto amarrado a una variable (regla 4: un color por variable).
  const v = (clave, texto) => ({ v: clave, t: String(texto) });

  // Raíz simplificada cuando x² es entero (o entero/4): 5√3, √26/2, −2√2. Si no, decimales.
  function radical(x, decimales = 2) {
    if (!Number.isFinite(x)) return String(x);
    const signo = x < 0 ? '−' : '', y = Math.abs(x);
    for (const d of [1, 2]) {
      const N = Math.round((y * d) ** 2);
      if (N > 0 && Math.abs((y * d) ** 2 - N) < 1e-6 * Math.max(1, N) && N < 1e7) {
        let a = 1, b = N;
        for (let k = 2; k * k <= b; k++) while (b % (k * k) === 0) { b /= k * k; a *= k; }
        if (d === 2 && a % 2 === 0) continue; // ya salió con d = 1
        const raiz = b === 1 ? String(a) : (a === 1 ? '' : a) + '√' + b;
        if (d === 2 && b === 1) continue;     // a/2 entero o decimal: mejor con coma
        return signo + raiz + (d === 2 ? '/2' : '');
      }
      if (y === 0) return '0';
    }
    return signo + formatear(y, decimales);
  }

  /*
   * armar({ correcta, errores, rng, unidad, decimales, total, negativos, texto })
   *   correcta: número
   *   errores: [{ id, valor, explicacion, respaldo: 'documentado'|'parcial'|'hipotesis', fuente }]
   *   negativos: si es true, acepta errores con valor cero o negativo (por defecto se descartan)
   *   texto: función opcional valor → texto (por ejemplo, radical); si falta, formatear + unidad
   * Devuelve [{ letra, valor, texto, correcta, error }], sin valores repetidos (comparados
   * ya redondeados, como los ve el alumno) y en un orden que depende solo de la semilla.
   */
  function armar({ correcta, errores, rng, unidad = '', decimales = 2, total = 5, negativos = false, texto = null }) {
    const txt = texto || (x => formatear(x, decimales) + (unidad ? ' ' + unidad : ''));
    const vistos = new Set([txt(correcta)]);
    const elegidas = [{ valor: correcta, texto: txt(correcta), correcta: true, error: null }];
    for (const e of errores) {
      if (elegidas.length >= total) break;
      if (!Number.isFinite(e.valor) || (!negativos && e.valor <= 0)) continue;
      const t = txt(e.valor);
      if (vistos.has(t)) continue; // el error coincide con otra alternativa: no distingue nada
      vistos.add(t);
      elegidas.push({ valor: e.valor, texto: t, correcta: false,
        error: { id: e.id, explicacion: e.explicacion, respaldo: e.respaldo, fuente: e.fuente || null } });
    }
    return rng.barajar(elegidas).map((a, i) => ({ letra: LETRAS[i], ...a }));
  }

  return { formatear, radical, v, armar, LETRAS };
});
