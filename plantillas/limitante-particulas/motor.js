/*
 * Motor de Reactivo limitante con partículas.
 *
 * Aquí vive toda la química de la plantilla (regla 1 de CLAUDE.md). No toca el
 * DOM: funciona igual en el navegador (window.MotorReaccion) y en Node
 * (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * Masas atómicas de academia: H = 1, C = 12, N = 14, O = 16, Na = 23, Mg = 24,
 * Al = 27, S = 32, Cl = 35,5, Ca = 40, Fe = 56.
 *
 * Una reacción se escribe con coeficientes y fórmulas:
 *   reaccion({ reactivos: [[1, 'N2'], [3, 'H2']], productos: [[2, 'NH3']] })
 * El motor revisa que esté balanceada (mismos átomos de cada elemento a los dos lados).
 *
 * Dos maneras de hacerla ocurrir:
 *   porParticulas(r, { N2: 4, H2: 9 })  con moléculas contadas: la reacción ocurre un número
 *                                       entero de veces ("vueltas de la receta").
 *   porMasas(r, { H2: 10, O2: 64 })     con gramos: el avance ξ (en moles de "receta") es continuo.
 * En los dos casos, el limitante es el reactivo que permite menos vueltas: cantidad / coeficiente.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorReaccion = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const MASAS = Object.freeze({ H: 1, C: 12, N: 14, O: 16, Na: 23, Mg: 24, Al: 27, S: 32, Cl: 35.5, Ca: 40, Fe: 56 });
  const EPS = 1e-9;

  // Átomos de una fórmula: 'Ca(OH)2' → { Ca: 1, O: 2, H: 2 }. Acepta subíndices normales o Unicode (H₂O).
  function atomos(formula) {
    const f = String(formula).replace(/[₀-₉]/g, d => String('₀₁₂₃₄₅₆₇₈₉'.indexOf(d)));
    let i = 0;
    function grupo() {
      const r = {};
      while (i < f.length && f[i] !== ')') {
        let parte;
        if (f[i] === '(') { i++; parte = grupo(); if (f[i] !== ')') throw new Error(`fórmula mal cerrada: ${formula}`); i++; }
        else {
          const m = /^[A-Z][a-z]?/.exec(f.slice(i));
          if (!m) throw new Error(`fórmula inválida: ${formula}`);
          if (!(m[0] in MASAS)) throw new Error(`elemento sin masa atómica: ${m[0]}`);
          parte = { [m[0]]: 1 }; i += m[0].length;
        }
        const n = /^\d+/.exec(f.slice(i)); const k = n ? Number(n[0]) : 1; if (n) i += n[0].length;
        for (const [e, c] of Object.entries(parte)) r[e] = (r[e] || 0) + c * k;
      }
      return r;
    }
    const r = grupo();
    if (i !== f.length) throw new Error(`fórmula inválida: ${formula}`);
    return r;
  }
  function masaMolar(formula) {
    return Object.entries(atomos(formula)).reduce((s, [e, n]) => s + MASAS[e] * n, 0);
  }

  // Cuenta los átomos de cada elemento a cada lado: { N: [2, 2], H: [6, 6] }.
  function contar(lado) {
    const r = {};
    for (const [c, f] of lado) for (const [e, n] of Object.entries(atomos(f))) r[e] = (r[e] || 0) + c * n;
    return r;
  }
  function balance(r) {
    const izq = contar(r.reactivos), der = contar(r.productos), out = {};
    for (const e of new Set([...Object.keys(izq), ...Object.keys(der)])) out[e] = [izq[e] || 0, der[e] || 0];
    return { atomos: out, ok: Object.values(out).every(([a, b]) => Math.abs(a - b) < EPS) };
  }

  function reaccion(o) {
    const lado = (l, que) => {
      if (!Array.isArray(l) || !l.length) throw new Error(`faltan ${que}`);
      return l.map(([c, f]) => {
        const k = Number(c);
        if (!(k > 0) || !Number.isInteger(k)) throw new Error(`coeficiente inválido para ${f}: ${c}`);
        atomos(f); return [k, f];
      });
    };
    const r = { reactivos: lado(o.reactivos, 'reactivos'), productos: lado(o.productos, 'productos') };
    const nombres = [...r.reactivos, ...r.productos].map(x => x[1]);
    if (new Set(nombres).size !== nombres.length) throw new Error('una sustancia aparece dos veces');
    if (!balance(r).ok) throw new Error('la ecuación no está balanceada');
    r.M = Object.fromEntries(nombres.map(f => [f, masaMolar(f)]));
    return r;
  }

  // Cantidades después de un avance ξ (vueltas de la receta) desde unas cantidades iniciales.
  function avance(r, iniciales, xi) {
    const out = {};
    for (const [c, f] of r.reactivos) out[f] = (iniciales[f] || 0) - c * xi;
    for (const [c, f] of r.productos) out[f] = (iniciales[f] || 0) + c * xi;
    return out;
  }
  // Máximo avance y limitantes (todos los que se acaban a la vez).
  function maximo(r, cantidades) {
    const vueltas = r.reactivos.map(([c, f]) => {
      const n = Number(cantidades[f] || 0);
      if (!(n >= 0)) throw new Error(`cantidad inválida de ${f}`);
      return [f, n / c];
    });
    const xi = Math.min(...vueltas.map(v => v[1]));
    return { xi, limitantes: vueltas.filter(v => Math.abs(v[1] - xi) < EPS).map(v => v[0]), vueltas: Object.fromEntries(vueltas) };
  }

  // Con moléculas contadas: la receta se repite un número entero de veces.
  function porParticulas(r, moleculas) {
    for (const [, f] of r.reactivos) if (!Number.isInteger(Number(moleculas[f] || 0))) throw new Error(`las moléculas de ${f} se cuentan con enteros`);
    const m = maximo(r, moleculas), veces = Math.floor(m.xi + EPS);
    const finales = avance(r, moleculas, veces);
    // El limitante es el que permite menos vueltas en proporción (cantidad / coeficiente), igual que con
    // gramos. Con 1 N₂ y 4 H₂, al final ninguno alcanza para otra vuelta, pero el que limita es el N₂.
    return { veces, limitantes: m.limitantes, finales, sobran: Object.fromEntries(r.reactivos.map(([, f]) => [f, finales[f]])) };
  }

  // Con gramos: moles de cada reactivo, avance continuo, gramos que sobran y que se forman.
  function porMasas(r, gramos) {
    const moles = {};
    for (const [, f] of r.reactivos) moles[f] = Number(gramos[f] || 0) / r.M[f];
    const m = maximo(r, moles), fin = avance(r, moles, m.xi);
    const g = f => fin[f] * r.M[f];
    const sobran = Object.fromEntries(r.reactivos.map(([, f]) => [f, Math.max(0, g(f))]));
    const forman = Object.fromEntries(r.productos.map(([, f]) => [f, g(f)]));
    const antes = r.reactivos.reduce((s, [, f]) => s + Number(gramos[f] || 0), 0);
    const despues = Object.values(sobran).reduce((s, x) => s + x, 0) + Object.values(forman).reduce((s, x) => s + x, 0);
    return { moles, xi: m.xi, limitantes: m.limitantes, sobran, forman, molesFinales: fin, antes, despues };
  }

  // Gramos de B que reaccionan exactamente con 'gramosA' de A, según la ecuación.
  function gramosQueReaccionan(r, A, gramosA, B) {
    const c = f => [...r.reactivos, ...r.productos].find(x => x[1] === f);
    const a = c(A), b = c(B);
    if (!a || !b) throw new Error('sustancia que no está en la reacción');
    return gramosA / r.M[A] / a[0] * b[0] * r.M[B];
  }

  // Producto formado contra la cantidad de un reactivo (los demás fijos): sube en recta y se aplana.
  // Devuelve el punto de quiebre (la cantidad del reactivo en que deja de ser limitante).
  function quiebre(r, cantidades, reactivo, producto) {
    const cR = r.reactivos.find(x => x[1] === reactivo)[0], cP = r.productos.find(x => x[1] === producto)[0];
    const otros = r.reactivos.filter(x => x[1] !== reactivo).map(([c, f]) => (cantidades[f] || 0) / c);
    const xiMax = Math.min(...otros);
    return { cantidad: xiMax * cR, producto: xiMax * cP };
  }

  return { MASAS, atomos, masaMolar, balance, reaccion, avance, maximo, porParticulas, porMasas, gramosQueReaccionan, quiebre };
});
