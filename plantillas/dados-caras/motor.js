/*
 * Motor del dado común (razonamiento matemático, juegos recreativos; 15 nov 2026, ronda 4 del 3D).
 *
 * Aquí vive la cuenta de la pila de dados que dibuja la pieza viva rm-cubitos-3d (regla 1 de CLAUDE.md): qué número
 * queda en cada cara de cada dado y cuáles quedan tapadas. No toca el DOM: sirve en el navegador (window.MotorDados) y
 * en Node (require('./motor.js')), donde lo prueban motor.test.js y casos.json.
 *
 * CARAS de un dado, en este orden: arriba, abajo, frente, atrás, izquierda, derecha (el mismo del generador).
 * Dado común: las caras opuestas suman 7, y con el 1 arriba y el 2 al frente, el 4 queda a la derecha (el dado de
 * partida del generador, [1, 6, 2, 5, 3, 4]). Las 24 orientaciones salen de ese dado girando sobre dos ejes.
 *
 * FUNCIONES
 *   orientaciones()            las 24 orientaciones, cada una una lista de 6 números en el orden de CARAS.
 *   orientar(arriba, frente)   la orientación con esos dos números, o null si no puede (frente igual a arriba o a su
 *                              opuesta).
 *   frentes(arriba)            los cuatro números que pueden ir al frente, en el orden en que pasan al girar el dado
 *                              un cuarto de vuelta a la izquierda sobre su eje vertical, empezando por el menor.
 *   girarVertical(o, n)        la orientación o girada n cuartos de vuelta sobre su eje vertical (la cara de arriba no
 *                              cambia; el frente pasa a la izquierda).
 *   pila(k, arriba, giro = 0)  k dados (1 a 6) apilados sobre una mesa; el de arriba muestra «arriba». El dado 1 es el
 *                              de arriba; los de abajo tienen orientaciones fijas de partida (ABAJO) giradas «giro»
 *                              cuartos de vuelta. Da { dados: [{ caras, z }] (z = 0 el que toca la mesa),
 *                              tapadas: [{ dado, cara, valor, toca }] (toca: 'mesa' o 'dado'), ocultas (suma de las
 *                              tapadas), visibles (suma de lo que se ve caminando alrededor: los cuatro costados de
 *                              cada dado y la cara de arriba del dado 1), total (21 · k) }.
 *                              Las sumas se hacen cara por cara, sin la fórmula 7k − arriba (esa va en las pruebas).
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorDados = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const ARR = 0, ABA = 1, FRE = 2, ATR = 3, IZQ = 4, DER = 5;
  const CARAS = ['arriba', 'abajo', 'frente', 'atrás', 'izquierda', 'derecha'];
  const girar = (d, perm) => perm.map(i => d[i]);
  const ROT_VERTICAL = [ARR, ABA, DER, IZQ, FRE, ATR];   // cuarto de vuelta: lo de la derecha pasa al frente
  const ROT_ADELANTE = [ATR, FRE, ARR, ABA, IZQ, DER];   // vuelca hacia adelante
  const PARTIDA = [1, 6, 2, 5, 3, 4];

  let cache = null;
  function orientaciones() {
    if (cache) return cache.map(o => o.slice());
    const vistos = new Map(), cola = [PARTIDA];
    while (cola.length) {
      const d = cola.pop(), k = d.join('');
      if (vistos.has(k)) continue;
      vistos.set(k, d);
      cola.push(girar(d, ROT_VERTICAL), girar(d, ROT_ADELANTE));
    }
    cache = [...vistos.values()];
    return cache.map(o => o.slice());
  }
  function entero(n, lo, hi, que) {
    if (!Number.isInteger(n) || n < lo || n > hi) throw new Error(`${que} debe ser un entero de ${lo} a ${hi}`);
  }
  function orientar(arriba, frente) {
    entero(arriba, 1, 6, 'arriba'); entero(frente, 1, 6, 'frente');
    return orientaciones().find(o => o[ARR] === arriba && o[FRE] === frente) || null;
  }
  // Un cuarto de vuelta a la izquierda: el frente pasa a la izquierda y la derecha al frente.
  const girarVertical = (o, n) => { let d = o.slice(); for (let i = 0; i < (((n % 4) + 4) % 4); i++) d = girar(d, ROT_VERTICAL); return d; };
  function frentes(arriba) {
    entero(arriba, 1, 6, 'arriba');
    const menor = [1, 2, 3, 4, 5, 6].find(x => x !== arriba && x !== 7 - arriba);
    const o = orientar(arriba, menor);
    return [0, 1, 2, 3].map(n => girarVertical(o, n)[FRE]);
  }
  // Orientaciones de partida de los dados de abajo (dado 2, 3, …): arriba y frente, elegidos para que se vean distintos.
  const ABAJO = [[3, 1], [2, 4], [6, 3], [4, 5], [5, 1]];
  function pila(k, arriba, giro = 0) {
    entero(k, 1, 6, 'k'); entero(arriba, 1, 6, 'arriba'); entero(giro, 0, 3, 'giro');
    const dados = [];
    for (let i = 0; i < k; i++) {
      const o = i === 0 ? orientar(arriba, frentes(arriba)[0]) : girarVertical(orientar(...ABAJO[i - 1]), giro);
      dados.push({ caras: o, z: k - 1 - i });
    }
    const tapadas = [];
    dados.forEach((d, i) => {
      if (i > 0) tapadas.push({ dado: i + 1, cara: 'arriba', valor: d.caras[ARR], toca: 'dado' });
      tapadas.push({ dado: i + 1, cara: 'abajo', valor: d.caras[ABA], toca: i === k - 1 ? 'mesa' : 'dado' });
    });
    let visibles = dados[0].caras[ARR];
    for (const d of dados) for (const c of [FRE, ATR, IZQ, DER]) visibles += d.caras[c];
    const ocultas = tapadas.reduce((s, t) => s + t.valor, 0);
    return { dados, tapadas, ocultas, visibles, total: 21 * k };
  }

  return { CARAS, orientaciones, orientar, frentes, girarVertical, pila };
});
