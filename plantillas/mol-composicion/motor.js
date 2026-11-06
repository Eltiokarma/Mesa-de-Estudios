/*
 * Motor de Mol, masa molar y composición.
 *
 * Aquí vive toda la química de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en
 * el navegador (window.MotorMol) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * Datos de academia: masas atómicas redondeadas (H = 1, C = 12, O = 16, Cl = 35,5…), Nₐ = 6,02 × 10²³ y
 * 22,4 L/mol para un gas en condiciones normales (1 atm y 0 °C).
 *
 * Qué calcula: los átomos de una fórmula (con paréntesis y agua de hidratación, "CuSO4·5H2O"), la masa
 * molar, moles, moléculas y átomos desde gramos (o al revés), la masa de una partícula, la masa atómica
 * promedio de los isótopos, la composición centesimal, las masas de cada elemento en una muestra (Proust),
 * la fórmula empírica desde porcentajes o masas, la molecular desde la masa molar y el agua de un hidrato.
 * Varias funciones devuelven además el resultado de un error típico, para armar alternativas:
 * sumar sin subíndices (ES18), invertir n = m/M (ES7), comparar masas como si fueran átomos (ES16).
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorMol = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const NA = 6.02e23, VM = 22.4;
  const MASAS = Object.freeze({ H: 1, He: 4, C: 12, N: 14, O: 16, F: 19, Na: 23, Mg: 24, Al: 27, Si: 28, P: 31, S: 32, Cl: 35.5,
    K: 39, Ca: 40, Cr: 52, Mn: 55, Fe: 56, Cu: 63.5, Zn: 65, Br: 80, Ag: 108, I: 127, Ba: 137 });
  const num = (x, que) => { const n = Number(x); if (!Number.isFinite(n)) throw new Error(`${que} inválido: ${x}`); return n; };
  const positivo = (x, que) => { const n = num(x, que); if (!(n > 0)) throw new Error(`${que} debe ser mayor que cero`); return n; };

  // ---------- Fórmulas ----------
  // "Ca(OH)2" → { Ca: 1, O: 2, H: 2 }; "CuSO4·5H2O" (o con "." o "*") suma el agua de hidratación.
  function atomos(formula) {
    const partes = String(formula).replace(/\s/g, '').split(/[·.*]/);
    const total = {};
    for (const parte of partes) {
      const m = parte.match(/^(\d+)(.*)$/), veces = m ? Number(m[1]) : 1, f = m ? m[2] : parte;
      let i = 0;
      function grupo() {
        const r = {};
        while (i < f.length && f[i] !== ')') {
          let sub;
          if (f[i] === '(') { i++; sub = grupo(); if (f[i] !== ')') throw new Error(`falta ")" en ${formula}`); i++; }
          else {
            const e = f.slice(i).match(/^[A-Z][a-z]?/);
            if (!e) throw new Error(`no entiendo la fórmula ${formula}`);
            if (!(e[0] in MASAS)) throw new Error(`elemento sin masa atómica: ${e[0]}`);
            i += e[0].length; sub = { [e[0]]: 1 };
          }
          const d = f.slice(i).match(/^\d+/); const k = d ? Number(d[0]) : 1; if (d) i += d[0].length;
          for (const [el, n] of Object.entries(sub)) r[el] = (r[el] || 0) + n * k;
        }
        return r;
      }
      const g = grupo();
      if (i !== f.length) throw new Error(`sobra ")" en ${formula}`);
      for (const [el, n] of Object.entries(g)) total[el] = (total[el] || 0) + n * veces;
    }
    if (!Object.keys(total).length) throw new Error(`fórmula vacía: ${formula}`);
    return total;
  }
  const totalAtomos = f => Object.values(atomos(f)).reduce((s, n) => s + n, 0);

  // Masa molar (g/mol) y el error de sumar cada elemento una sola vez, sin su subíndice (ES18).
  function masaMolar(formula) {
    const a = atomos(formula);
    return { valor: Object.entries(a).reduce((s, [e, n]) => s + MASAS[e] * n, 0),
      sinSubindices: Object.keys(a).reduce((s, e) => s + MASAS[e], 0), atomos: a };
  }
  const M = f => (typeof f === 'number' ? positivo(f, 'masa molar') : masaMolar(f).valor);

  // Moles desde gramos (o desde moléculas, o desde litros de gas en condiciones normales). Devuelve moles,
  // moléculas, átomos y gramos, y el error de invertir la fórmula (M/m en vez de m/M, ES7).
  function moles(formula, o) {
    const Mm = M(formula);
    let n;
    if (o.gramos !== undefined) n = positivo(o.gramos, 'masa') / Mm;
    else if (o.moleculas !== undefined) n = positivo(o.moleculas, 'número de moléculas') / NA;
    else if (o.litrosCN !== undefined) n = positivo(o.litrosCN, 'volumen') / VM;
    else if (o.moles !== undefined) n = positivo(o.moles, 'moles');
    else throw new Error('da gramos, moléculas, litrosCN o moles');
    const at = typeof formula === 'number' ? null : totalAtomos(formula);
    return { n, gramos: n * Mm, moleculas: n * NA, atomos: at === null ? null : n * NA * at, atomosPorMolecula: at,
      invertido: o.gramos !== undefined ? Mm / o.gramos : null, M: Mm };
  }
  // Volumen de una muestra. Gas en condiciones normales: n·22,4 L. Líquido o sólido: masa/densidad (g/mL), que no
  // tiene nada que ver con 22,4 L. Devuelve también el error de usar 22,4 L/mol para todo (ES5).
  function volumen(formula, o) {
    const n = positivo(o.gramos, 'masa') / M(formula);
    const conCN = n * VM;
    if (o.estado === 'g') return { litros: conCN, mililitros: conCN * 1000, con224: conCN };
    const ml = o.gramos / positivo(o.densidad, 'densidad');
    return { litros: ml / 1000, mililitros: ml, con224: conCN };
  }
  // Masa de una sola partícula, en gramos: M/Nₐ. En u, es el mismo número que M.
  const masaParticula = formula => M(formula) / NA;

  // ¿Cuántas partículas de B igualan la masa de nA partículas de A? nB = nA·M(A)/M(B).
  // Errores: "la misma cantidad" (ES4) y la razón invertida.
  function igualarMasa(A, nA, B) {
    const ma = M(A), mb = M(B), n = positivo(nA, 'cantidad');
    return { valor: n * ma / mb, misma: n, invertida: n * mb / ma };
  }

  // Masa atómica promedio: Σ masa·abundancia/100. Error: promedio simple de las masas, sin abundancias.
  function promedio(isotopos) {
    if (!Array.isArray(isotopos) || !isotopos.length) throw new Error('hace falta al menos un isótopo');
    const suma = isotopos.reduce((s, x) => s + positivo(x.abundancia, 'abundancia'), 0);
    if (Math.abs(suma - 100) > 1e-9) throw new Error(`las abundancias suman ${suma} %, no 100 %`);
    return { valor: isotopos.reduce((s, x) => s + positivo(x.masa, 'masa') * x.abundancia / 100, 0),
      simple: isotopos.reduce((s, x) => s + x.masa, 0) / isotopos.length };
  }

  // Composición centesimal: % de cada elemento = masa del elemento en la fórmula / M · 100.
  // Error: porcentajes con las masas atómicas sin subíndices (ES18).
  function composicion(formula) {
    const r = masaMolar(formula), pct = {}, sinSub = {};
    for (const [e, n] of Object.entries(r.atomos)) { pct[e] = MASAS[e] * n / r.valor * 100; sinSub[e] = MASAS[e] / r.sinSubindices * 100; }
    return { M: r.valor, porcentajes: pct, sinSubindices: sinSub };
  }
  // Ley de Proust: en m gramos del compuesto, cuántos gramos hay de cada elemento (siempre en la misma proporción).
  function masasElementos(formula, gramos) {
    const c = composicion(formula), g = positivo(gramos, 'masa'), r = {};
    for (const [e, p] of Object.entries(c.porcentajes)) r[e] = g * p / 100;
    return r;
  }

  // ---------- Fórmula empírica y molecular ----------
  // datos = { C: 75, H: 25 } en gramos o en porcentaje (es lo mismo: se toma una muestra de 100 g).
  // Pasos: moles de cada elemento, división entre el menor y, si no salen enteros, multiplicar por 2, 3, 4, 5 o 6.
  // Errores: comparar las masas en vez de los moles (ES16), y redondear la razón sin multiplicar (con 1,5 → 2).
  function empirica(datos) {
    const els = Object.keys(datos);
    if (!els.length) throw new Error('faltan elementos');
    const n = {};
    for (const e of els) { if (!(e in MASAS)) throw new Error(`elemento sin masa atómica: ${e}`); n[e] = positivo(datos[e], `masa de ${e}`) / MASAS[e]; }
    const min = Math.min(...Object.values(n)), razon = {};
    for (const e of els) razon[e] = n[e] / min;
    let mult = 0;
    for (let k = 1; k <= 6 && !mult; k++) if (els.every(e => Math.abs(razon[e] * k - Math.round(razon[e] * k)) < 0.03)) mult = k;
    if (!mult) throw new Error('la razón de moles no da enteros pequeños; revisa los datos');
    const sub = {}; for (const e of els) sub[e] = Math.round(razon[e] * mult);
    const mmin = Math.min(...els.map(e => datos[e])), porMasas = {}, redondeo = {};
    // Razón de masas (ES16): si las masas son enteras, se simplifican tal cual (70 y 30 → 7 a 3); si no, se dividen entre la menor y se redondean.
    const enteras = els.every(e => Number.isInteger(datos[e]));
    for (const e of els) { porMasas[e] = enteras ? datos[e] : Math.max(1, Math.round(datos[e] / mmin)); redondeo[e] = Math.max(1, Math.round(razon[e])); }
    return { moles: n, razon, multiplicador: mult, subindices: sub, formula: escribir(sub), M: masaMolar(escribir(sub)).valor,
      porMasas: escribir(simplificar(porMasas)), redondeando: escribir(redondeo) };
  }
  // Molecular = empírica × k, con k = M(molecular)/M(empírica). Error: dividir M entre el número de átomos de la empírica.
  function molecular(formulaEmpirica, Mmolecular) {
    const a = atomos(formulaEmpirica), Me = masaMolar(formulaEmpirica).valor, Mm = positivo(Mmolecular, 'masa molar');
    const k = Mm / Me;
    if (Math.abs(k - Math.round(k)) > 1e-6) throw new Error(`la masa molar ${Mm} no es múltiplo de la empírica (${Me})`);
    const sub = {}; for (const [e, n] of Object.entries(a)) sub[e] = n * Math.round(k);
    return { k: Math.round(k), Mempirica: Me, subindices: sub, formula: escribir(sub), porAtomos: Mm / totalAtomos(formulaEmpirica) };
  }
  // Hidrato: sal·x H2O. Con la masa de sal anhidra y la del agua que se fue al calentar, x = n(agua)/n(sal).
  // Error: x como razón de masas (ES16 en hidratos).
  function hidrato(sal, gramosSal, gramosAgua) {
    const ns = positivo(gramosSal, 'masa de sal') / M(sal), na = positivo(gramosAgua, 'masa de agua') / 18;
    return { x: na / ns, nSal: ns, nAgua: na, porMasas: gramosAgua / gramosSal };
  }

  const mcd = (a, b) => (b ? mcd(b, a % b) : a);
  function simplificar(sub) { const g = Object.values(sub).reduce(mcd); const r = {}; for (const [e, n] of Object.entries(sub)) r[e] = n / g; return r; }
  // { C: 1, H: 4 } → "CH4". Si hay C y H (compuesto orgánico), van primero C y H; si no, el orden en que vienen.
  function escribir(sub) {
    const organico = 'C' in sub && 'H' in sub;
    const orden = Object.keys(sub).sort((a, b) => (!organico ? 0 : a === 'C' ? -1 : b === 'C' ? 1 : a === 'H' ? -1 : b === 'H' ? 1 : 0));
    return orden.map(e => e + (sub[e] === 1 ? '' : sub[e])).join('');
  }

  return { NA, VM, MASAS, atomos, totalAtomos, masaMolar, moles, volumen, masaParticula, igualarMasa, promedio, composicion,
    masasElementos, empirica, molecular, hidrato, escribir };
});
