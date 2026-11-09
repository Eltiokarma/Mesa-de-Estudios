/* Prototipo determinista sin DOM. Polinomios dispersos en x,y; enteros exactos. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.MotorPolinomios = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const MAX_EXP = 1000;
  function entero(v, nombre) {
    if (!Number.isSafeInteger(v)) throw new TypeError(`${nombre}: se necesita un entero seguro.`);
    return v;
  }
  function seguro(v) {
    if (!Number.isSafeInteger(v)) throw new RangeError('El cálculo excede el rango entero exacto.');
    return v;
  }
  function exponente(v) {
    entero(v, 'Exponente');
    if (v < 0 || v > MAX_EXP) throw new RangeError(`Exponente fuera de 0..${MAX_EXP}.`);
    return v;
  }
  function analizar(terminos) {
    if (!Array.isArray(terminos) || terminos.length > 64) throw new TypeError('Se admite una lista de hasta 64 términos.');
    const grupos = new Map();
    for (const t of terminos) {
      if (!t || typeof t !== 'object') throw new TypeError('Término inválido.');
      const c = entero(t.c, 'Coeficiente'), x = exponente(t.x), y = exponente(t.y);
      const key = `${x},${y}`;
      grupos.set(key, { c: seguro((grupos.get(key)?.c || 0) + c), x, y });
    }
    const reducidos = [...grupos.values()].filter(t => t.c !== 0)
      .sort((a, b) => b.x - a.x || b.y - a.y);
    if (!reducidos.length) return { terminos: [], esCero: true, grado: null,
      gradosRelativos: { x: null, y: null }, homogeneo: null, completo: { x: false, y: false }, gradosTerminos: [] };
    const gradosTerminos = reducidos.map(t => t.x + t.y);
    const relativos = { x: Math.max(...reducidos.map(t => t.x)), y: Math.max(...reducidos.map(t => t.y)) };
    const completo = variable => new Set(reducidos.map(t => t[variable])).size === relativos[variable] + 1;
    return { terminos: reducidos, esCero: false, grado: Math.max(...gradosTerminos),
      gradosRelativos: relativos, homogeneo: new Set(gradosTerminos).size === 1,
      completo: { x: completo('x'), y: completo('y') }, gradosTerminos };
  }
  // Exponente (a*n+b)/d. Coeficientes positivos: ninguna cancelación puede ocultar
  // un exponente inválido. No es un simplificador de expresiones racionales generales.
  function explorar(familia, desde, hasta) {
    entero(desde, 'Desde'); entero(hasta, 'Hasta');
    if (hasta < desde || hasta - desde > 500) throw new RangeError('Intervalo inválido o mayor de 501 valores.');
    if (!Array.isArray(familia) || !familia.length || familia.length > 64) throw new TypeError('Familia inválida.');
    for (const t of familia) {
      if (!t || entero(t.c, 'Coeficiente') <= 0) throw new RangeError('La familia requiere coeficientes positivos.');
      for (const v of ['x', 'y']) {
        const e = t[v];
        if (!e) throw new TypeError('Falta un exponente.');
        entero(e.a, 'a'); entero(e.b, 'b'); entero(e.d, 'd');
        if (e.d <= 0) throw new RangeError('Denominador no positivo.');
      }
    }
    const filas = [];
    for (let offset = 0; offset <= hasta - desde; offset++) {
      const n = desde + offset, motivos = [], terminos = [];
      for (const [i, t] of familia.entries()) {
        const nuevo = { c: t.c };
        for (const v of ['x', 'y']) {
          const e = t[v], num = seguro(seguro(e.a * n) + e.b);
          if (num % e.d !== 0) motivos.push(`Término ${i + 1}, ${v}: ${num}/${e.d} no es entero.`);
          else if (num < 0) motivos.push(`Término ${i + 1}, ${v}: ${num / e.d} es negativo.`);
          else if (num / e.d > MAX_EXP) throw new RangeError('Exponente fuera del alcance del prototipo.');
          nuevo[v] = num / e.d;
        }
        terminos.push(nuevo);
      }
      filas.push({ n, admisible: motivos.length === 0, motivos,
        analisis: motivos.length ? null : analizar(terminos) });
    }
    return { desde, hasta, filas, valores: filas.filter(f => f.admisible).map(f => f.n) };
  }
  return { analizar, explorar };
});
