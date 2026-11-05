/*
 * Azar con semilla: la misma semilla da siempre el mismo problema.
 * Así la prueba de entrada y la de salida son reproducibles y se pueden medir.
 * Funciona en el navegador (window.Azar) y en Node (require).
 */
(function (root, fabrica) {
  const api = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Azar = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  // FNV-1a de 32 bits: convierte un texto en un número.
  function hash(texto) {
    let h = 0x811c9dc5;
    for (const ch of String(texto)) { h ^= ch.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; }
    return h >>> 0;
  }
  // mulberry32: generador pequeño, rápido y suficiente para elegir números de problemas.
  function crear(semilla) {
    let a = typeof semilla === 'number' ? semilla >>> 0 : hash(semilla);
    const sig = () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    return {
      sig,
      entero: (min, max) => min + Math.floor(sig() * (max - min + 1)),
      elegir: lista => lista[Math.floor(sig() * lista.length)],
      barajar: lista => { const l = lista.slice(); for (let i = l.length - 1; i > 0; i--) { const j = Math.floor(sig() * (i + 1)); [l[i], l[j]] = [l[j], l[i]]; } return l; },
      moneda: () => sig() < 0.5,
    };
  }
  return { hash, crear };
});
