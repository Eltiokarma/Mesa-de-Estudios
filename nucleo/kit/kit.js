/*
 * Kit de escenas vivas (docs/escena-viva.md, sección 5): el núcleo común.
 *   - Kit.piezas[id] = { id, dibujar(datos, estado) → SVG, alt(datos) → texto, controles?(datos) }
 *     Una pieza es una función pura: el mismo estado da el mismo SVG (así la línea de tiempo va y vuelve).
 *   - Kit.registrar(pieza): la agrega al catálogo (comprueba que tenga dibujar y alt).
 *   - Kit.respuesta: ajustar un valor arrastrado a su paso y decidir a qué alternativa equivale.
 *   - Kit.formatear: el mismo formato de números que nucleo/predicciones.js (coma decimal, miles con espacio).
 *   - Kit.palabras: cuenta palabras como las cuenta el presupuesto de texto (letras o cifras seguidas).
 * Sin dependencias. Funciona en el navegador (window.Kit) y en Node (require).
 */
(function (root, fabrica) {
  const api = fabrica(root && root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Kit = api;
})(typeof self !== 'undefined' ? self : this, function (previo) {
  'use strict';
  const Kit = previo || {};
  Kit.piezas = Kit.piezas || {};

  function registrar(pieza) {
    if (!pieza || !/^[a-z0-9-]+$/.test(pieza.id || '')) throw new Error('Kit.registrar: la pieza necesita un id en minúsculas');
    if (typeof pieza.dibujar !== 'function' || typeof pieza.alt !== 'function') throw new Error(`Kit.registrar: ${pieza.id} necesita dibujar y alt`);
    Kit.piezas[pieza.id] = pieza;
    return pieza;
  }

  // Igual que Predicciones.formatear (nucleo/kit/kit.test.js lo comprueba): «1 234,5», «−3», «0,25».
  function formatear(n, decimales = 2) {
    if (!Number.isFinite(n)) return String(n);
    const x = Math.abs(n) * 10 ** decimales;
    const r = Math.sign(n) * Math.round(x * (1 + 1e-12)) / 10 ** decimales;
    const fijo = Math.abs(r).toFixed(decimales);
    const [ent, dec] = (decimales > 0 ? fijo.replace(/0+$/, '').replace(/\.$/, '') : fijo).split('.');
    const miles = ent.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return (r < 0 ? '−' : '') + miles + (dec ? ',' + dec : '');
  }

  // Paso «bonito» para un arrastre: el mayor de la lista que no pase de `tope`.
  const BONITOS = [0.01, 0.02, 0.05, 0.1, 0.2, 0.25, 0.5, 1, 2, 5, 10, 20, 25, 50, 100];
  function pasoBonito(tope) {
    let p = BONITOS[0];
    for (const b of BONITOS) if (b <= tope + 1e-12) p = b;
    return p;
  }

  // Lleva v al múltiplo de paso más cercano, dentro de [min, max]. Sin errores de coma flotante a la vista.
  function ajustar(v, paso, min = -Infinity, max = Infinity) {
    if (!Number.isFinite(v)) return min;
    let r = paso > 0 ? Math.round(v / paso) * paso : v;
    r = Math.min(max, Math.max(min, r));
    return Math.round(r * 1e6) / 1e6;
  }

  /*
   * clasificar(valor, alternativas, tolerancia) → la alternativa a la que equivale una marca arrastrada, o null.
   * Gana la alternativa de valor más cercano, siempre que quede a `tolerancia` o menos. Si dos están a la misma
   * distancia, gana la que aparece primero. Así la medición registra la misma opción que si se hubiera tocado.
   */
  function clasificar(valor, alternativas, tolerancia) {
    let mejor = null, d = Infinity;
    for (const a of alternativas || []) {
      if (typeof a.valor !== 'number') continue;
      const e = Math.abs(a.valor - valor);
      if (e < d - 1e-9) { d = e; mejor = a; }
    }
    return mejor && d <= tolerancia + 1e-9 ? mejor : null;
  }

  // Palabras de un texto (o de partes como las del formato predicciones): letras o cifras seguidas.
  // «S/ 178,50» cuenta 2 (S y 178,50); «−15 %» cuenta 1.
  function plano(x) {
    if (Array.isArray(x)) return x.map(plano).join('');
    if (x && typeof x === 'object') return String(x.t);
    return x === undefined || x === null ? '' : String(x);
  }
  const palabras = x => (plano(x).match(/[\p{L}\p{N}]+(?:[.,]\p{N}+)*/gu) || []).length;

  Kit.registrar = registrar;
  Kit.formatear = formatear;
  Kit.plano = plano;
  Kit.palabras = palabras;
  Kit.respuesta = { pasoBonito, ajustar, clasificar };
  return Kit;
});
