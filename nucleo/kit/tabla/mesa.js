/*
 * La mesa de la tabla viva (decisión 20: primero se juega con la información). Lógica pura, sin DOM.
 *
 * La mesa es una cuadrícula de `columnas` columnas; cada celda tiene una carta (su Z) o está vacía. El alumno pone las
 * cartas donde quiere:
 *   - soltar en una celda vacía la deja ahí;
 *   - soltar sobre otra carta la mete en ese lugar y corre las de después, en orden de lectura, hasta el primer hueco
 *     (el hueco que deja la carta al salir cuenta). Así se ordena una fila con el dedo, como en una lista.
 * Siempre quedan al menos FILAS_LIBRES filas vacías al final, para tener dónde armar.
 *
 *   crear(zs, { columnas, semilla })  → mesa con las cartas mezcladas al principio
 *   mover(mesa, z, celda)             → mesa nueva (no cambia la de entrada)
 *   donde(mesa, z)                    → índice de la celda de z, o −1
 *   lugar(mesa, celda)                → { x, y } en celdas
 */
(function (root, fabrica) {
  const api = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else (root.Kit = root.Kit || {}).tablaMesa = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const FILAS_LIBRES = 2;

  // Azar con semilla (mulberry32): la misma semilla da la misma mezcla (las pruebas lo usan).
  function azar(semilla) {
    let a = semilla >>> 0;
    return () => {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function conHolgura(celdas, columnas) {
    let ultima = -1;
    for (let i = celdas.length - 1; i >= 0; i--) if (celdas[i] !== null) { ultima = i; break; }
    const filas = Math.floor((ultima + 1 + columnas - 1) / columnas) + FILAS_LIBRES;
    const r = celdas.slice(0, filas * columnas);
    while (r.length < filas * columnas) r.push(null);
    return r;
  }

  function crear(zs, { columnas = 8, semilla = 1 } = {}) {
    if (!Number.isInteger(columnas) || columnas < 2) throw new Error(`mesa: columnas debe ser un entero de 2 o más (${columnas})`);
    const orden = zs.slice();
    const r = azar(semilla);
    for (let i = orden.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [orden[i], orden[j]] = [orden[j], orden[i]]; }
    return { columnas, celdas: conHolgura(orden, columnas) };
  }

  const donde = (mesa, z) => mesa.celdas.indexOf(z);
  const lugar = (mesa, celda) => ({ x: celda % mesa.columnas, y: Math.floor(celda / mesa.columnas) });
  const filas = mesa => mesa.celdas.length / mesa.columnas;

  function mover(mesa, z, destino) {
    const desde = donde(mesa, z);
    if (desde < 0) throw new Error(`mesa: la carta ${z} no está en la mesa`);
    if (!Number.isInteger(destino) || destino < 0) throw new Error(`mesa: celda inválida (${destino})`);
    const c = mesa.celdas.slice();
    while (c.length <= destino) c.push(null);
    c[desde] = null;
    if (c[destino] !== null) {
      // Correr hacia adelante desde el destino hasta el primer hueco.
      let hueco = destino;
      while (hueco < c.length && c[hueco] !== null) hueco++;
      if (hueco === c.length) c.push(null);
      for (let i = hueco; i > destino; i--) c[i] = c[i - 1];
    }
    c[destino] = z;
    return { columnas: mesa.columnas, celdas: conHolgura(c, mesa.columnas) };
  }

  // Cambiar el ancho conserva el orden de lectura (en un celular que se echa, la mesa se reacomoda sin perder nada).
  function reancho(mesa, columnas) {
    if (columnas === mesa.columnas) return mesa;
    return { columnas, celdas: conHolgura(mesa.celdas.slice(), columnas) };
  }

  return { crear, mover, donde, lugar, filas, reancho, azar, FILAS_LIBRES };
});
