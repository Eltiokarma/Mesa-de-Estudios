/*
 * Motor de Rendimiento y pureza: el producto que no se forma y la parte de la muestra que no reacciona.
 *
 * Aquí vive toda la química de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el navegador
 * (window.MotorRendimiento) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * Unidades: masa en g; cantidad en mol; volumen de gas en L en condiciones normales (CN: 0 °C y 1 atm, 22,4 L/mol);
 * pureza y rendimiento en % (de 0 a 100); masa equivalente en g/eq.
 * Masas atómicas de academia: H 1, C 12, N 14, O 16, Na 23, Mg 24, Al 27, P 31, S 32, Cl 35,5, K 39, Ca 40, Fe 56, Cu 63,5, Zn 65.
 *
 * Funciones:
 *  - atomos(f): { elemento: cuántos } ("Ca(OH)2" → { Ca 1, O 2, H 2 }). masaMolar(f): número (g/mol).
 *  - moles(masa, f), masa(n, f).
 *  - REACCIONES[id]: { nombre, texto, reactivos [[coef, f]], productos [[coef, f]], reactivo (el que se pesa y puede
 *    venir impuro), producto (el que se pide), exceso (el otro reactivo, si lo hay), gases [f...] }. Ids: 'hierro'
 *    (Fe₂O₃ + 3CO → 2Fe + 3CO₂), 'caliza' (CaCO₃ → CaO + CO₂), 'clorato' (2KClO₃ → 2KCl + 3O₂) y 'zinc'
 *    (Zn + 2HCl → ZnCl₂ + H₂). balance(id): { balanceada, izquierda, derecha } (átomos de cada lado).
 *  - masaAMasa(id, masa, de, a): masa de 'a' que corresponde a 'masa' de 'de' según la ecuación (masa → mol → mol → masa).
 *  - pureza(muestra, p): { pura = muestra · p/100, impureza = muestra − pura }.
 *  - producir({ reaccion, muestra, pureza, rendimiento, producto }): { pura, impureza, n (mol de reactivo puro),
 *    teorico, real = teorico · η, noFormado = teorico − real, nProducto (mol reales), V y Vteorico (L en CN, si el
 *    producto es gas), errores }. errores (lo que daría cada error típico, en g del producto):
 *      'muestra-pura'          usa la muestra como si fuera pura (sí aplica el rendimiento);
 *      'olvida-rendimiento'    se queda con el teórico;
 *      'suma-porcentajes'      junta pureza y rendimiento en un solo porcentaje p + η − 100 (80 + 90 − 100 = 70 %);
 *      'divide-rendimiento'    divide el teórico entre el rendimiento en vez de multiplicar;
 *      'rendimiento-dos-veces' aplica el rendimiento al reactivo y otra vez al producto;
 *      'olvida-coeficiente'    pasa 1 mol de reactivo a 1 mol de producto, sin los coeficientes;
 *      'masa-se-conserva'      cree que toda la masa del reactivo puro pasa al producto pedido (ES15);
 *    y si el producto es gas: 'masa-como-volumen' (los gramos leídos como litros) y 'coeficiente-como-moles'
 *    (22,4 L por cada unidad del coeficiente, sin mirar la masa).
 *  - rendimientoPorcentual({ reaccion, masa, real, pureza, producto }): { pura, teorico, porcentaje, noFormado,
 *    errores: { 'sobre-reactivo' (real ÷ masa del reactivo), 'lo-que-falta' (no formado ÷ teórico),
 *    'invierte' (teórico ÷ real), 'otro-producto' (real ÷ teórico del otro producto) } }, todos en %.
 *  - muestraNecesaria({ reaccion, real, pureza, rendimiento, producto }): el problema inverso. { teorico = real/η,
 *    pura, muestra = pura/p, impureza, errores (g de muestra): 'olvida-pureza', 'olvida-rendimiento',
 *    'multiplica-pureza' (pura · p), 'multiplica-rendimiento' (teórico = real · η), 'multiplica-ambos' }.
 *  - rendimientoCadena([η1, η2, …]): { total (los rendimientos se multiplican), acumulado [...], errores:
 *    { 'suma-porcentajes' (Σ − 100·(n − 1)), 'promedio', 'el-menor' } }.
 *  - compararMejoras({ reaccion, muestra, pureza, rendimiento, producto }): { real, conPureza (pureza al 100 %),
 *    conRendimiento (rendimiento al 100 %), mejor ('pureza' | 'rendimiento' | 'igual'), factorPureza, factorRendimiento,
 *    errores: { 'rendimiento-pesa-mas': 'rendimiento', 'dan-lo-mismo': 'igual', 'depende-de-la-masa': 'depende' } }. La mejor no depende de la masa de la muestra.
 *  - balanceMasa({ reaccion, masa, rendimiento }): reacción de un solo reactivo en recipiente cerrado; el producto que
 *    falta se queda como reactivo sin reaccionar. { inicial, reacciona, quedan { f: g }, formados { f: g }, total,
 *    errores: { 'se-pierde' (lo que falta desaparece; el gas sale como si todo hubiera reaccionado),
 *    'sale-como-gas' (la masa que falta del sólido sale como gas), 'falta-igual-sobra' (sobra tanto reactivo como
 *    producto falta) }, cada error con { quedan, formados, total } }.
 *  - combustionIncompleta(masaC, fraccionCO2): el producto que falta sale como producto secundario.
 *    C + O₂ → CO₂ (principal) y 2C + O₂ → 2CO (secundario). { CO2, CO, O2, teoricoCO2, rendimientoCO2, total }.
 *  - THETA: θ declarado por sustancia (ácidos: H ácidos; bases: OH; sales: carga total del catión).
 *    masaEquivalente(f): { M, theta, tipo, Meq = M/θ, errores: { 'theta-1': M, 'theta-multiplica': M·θ } }.
 *    equivalentes(masa, f): { eq, Meq, errores: { 'theta-1': masa/M } }.
 *  - neutralizar(acido, masaAcido, base): ley de equivalentes (eq de ácido = eq de base). { eq, masaBase,
 *    errores (g de base): { 'theta-1' (todo con θ = 1: mol a mol), 'masas-iguales', 'theta-multiplica' (Meq = M·θ) } }.
 *  - reparto(e, f): la animación de la escena, calculada aquí. e = { impureza, pura, teorico, real, reacciona (fracción
 *    del puro que reacciona; 1 si no se dice) }; f de 0 a 1. Hasta f = 0,35 se separa la impureza (separa de 0 a 1);
 *    después avanza la reacción (avance de 0 a 1, suave). { separa, avance, impureza, puroQueda, formado, teoricoVisible }.
 *
 * Convenciones:
 *  - Pureza p: parte de la muestra que es la sustancia que reacciona. La impureza no reacciona.
 *  - Rendimiento η: real ÷ teórico × 100. El teórico sale de la ecuación con el reactivo puro y el otro en exceso.
 *  - Pureza y rendimiento se multiplican: real = muestra · p · η · (masa de producto por gramo de reactivo).
 *  - Equivalentes: Meq = M/θ; en una neutralización, eq de ácido = eq de base (ley de equivalentes).
 *
 * Errores típicos (campo 'errores'): todos son hipótesis nuestras (informe de estequiometría, «Lo que no tiene respaldo»),
 * salvo 'masa-se-conserva' (cercano a ES15) y 'sale-como-gas' (cercano a ES14), descritos sin cifra propia.
 * CABECERA: líneas 1 a 68 (funciones, unidades, datos y convenciones).
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorRendimiento = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const MASAS = Object.freeze({ H: 1, C: 12, N: 14, O: 16, Na: 23, Mg: 24, Al: 27, P: 31, S: 32, Cl: 35.5, K: 39, Ca: 40,
    Fe: 56, Cu: 63.5, Zn: 65 });
  const VM = 22.4;
  const num = (x, que) => { const n = Number(x); if (!Number.isFinite(n)) throw new Error(`${que} no es un número`); return n; };
  const positivo = (x, que) => { const n = num(x, que); if (!(n > 0)) throw new Error(`${que} debe ser mayor que cero`); return n; };
  const pct = (x, que) => { const n = num(x, que); if (!(n > 0 && n <= 100)) throw new Error(`${que} va de 0 a 100 %`); return n; };

  // ---------- Fórmulas ----------
  function atomos(formula) {
    const f = String(formula).replace(/\s/g, '');
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
        const d = f.slice(i).match(/^\d+/), k = d ? Number(d[0]) : 1; if (d) i += d[0].length;
        for (const [el, n] of Object.entries(sub)) r[el] = (r[el] || 0) + n * k;
      }
      return r;
    }
    const g = grupo();
    if (i !== f.length) throw new Error(`sobra ")" en ${formula}`);
    if (!Object.keys(g).length) throw new Error(`fórmula vacía: ${formula}`);
    return g;
  }
  const masaMolar = f => Object.entries(atomos(f)).reduce((s, [e, n]) => s + MASAS[e] * n, 0);
  const moles = (m, f) => num(m, 'masa') / masaMolar(f);
  const masa = (n, f) => num(n, 'moles') * masaMolar(f);

  // ---------- Reacciones del examen ----------
  const REACCIONES = Object.freeze({
    hierro: { nombre: 'hierro de la hematita', texto: 'Fe₂O₃ + 3CO → 2Fe + 3CO₂', reactivos: [[1, 'Fe2O3'], [3, 'CO']],
      productos: [[2, 'Fe'], [3, 'CO2']], reactivo: 'Fe2O3', producto: 'Fe', exceso: 'CO', gases: ['CO', 'CO2'],
      muestra: 'mineral (hematita)' },
    caliza: { nombre: 'cal viva de la caliza', texto: 'CaCO₃ → CaO + CO₂', reactivos: [[1, 'CaCO3']],
      productos: [[1, 'CaO'], [1, 'CO2']], reactivo: 'CaCO3', producto: 'CaO', exceso: null, gases: ['CO2'], muestra: 'caliza' },
    clorato: { nombre: 'oxígeno del clorato de potasio', texto: '2KClO₃ → 2KCl + 3O₂', reactivos: [[2, 'KClO3']],
      productos: [[2, 'KCl'], [3, 'O2']], reactivo: 'KClO3', producto: 'O2', exceso: null, gases: ['O2'], muestra: 'muestra de clorato' },
    zinc: { nombre: 'hidrógeno del zinc', texto: 'Zn + 2HCl → ZnCl₂ + H₂', reactivos: [[1, 'Zn'], [2, 'HCl']],
      productos: [[1, 'ZnCl2'], [1, 'H2']], reactivo: 'Zn', producto: 'H2', exceso: 'HCl', gases: ['H2'], muestra: 'zinc impuro' },
  });
  function reaccion(id) {
    const r = REACCIONES[id];
    if (!r) throw new Error(`reacción desconocida: ${id}`);
    return r;
  }
  function balance(id) {
    const r = reaccion(id), lado = l => {
      const t = {};
      for (const [c, f] of l) for (const [e, n] of Object.entries(atomos(f))) t[e] = (t[e] || 0) + c * n;
      return t;
    };
    const izquierda = lado(r.reactivos), derecha = lado(r.productos);
    const els = new Set([...Object.keys(izquierda), ...Object.keys(derecha)]);
    return { balanceada: [...els].every(e => izquierda[e] === derecha[e]), izquierda, derecha };
  }
  function coef(r, f) {
    const x = [...r.reactivos, ...r.productos].find(p => p[1] === f);
    if (!x) throw new Error(`${f} no está en la reacción`);
    return x[0];
  }
  function masaAMasa(id, m, de, a) {
    const r = reaccion(id);
    return moles(m, de) * coef(r, a) / coef(r, de) * masaMolar(a);
  }
  const esGas = (r, f) => r.gases.includes(f);

  // ---------- Pureza y rendimiento ----------
  function pureza(muestra, p) {
    muestra = positivo(muestra, 'la masa de la muestra'); p = pct(p, 'la pureza');
    const pura = muestra * p / 100;
    return { pura, impureza: muestra - pura };
  }
  function producir(o) {
    const r = reaccion(o.reaccion), prod = o.producto || r.producto;
    const muestra = positivo(o.muestra, 'la masa de la muestra');
    const p = pct(o.pureza === undefined ? 100 : o.pureza, 'la pureza');
    const eta = pct(o.rendimiento === undefined ? 100 : o.rendimiento, 'el rendimiento');
    const { pura, impureza } = pureza(muestra, p);
    const porGramo = masaAMasa(o.reaccion, 1, r.reactivo, prod);
    const teorico = pura * porGramo, real = teorico * eta / 100;
    const res = { pura, impureza, n: moles(pura, r.reactivo), teorico, real, noFormado: teorico - real,
      nTeorico: moles(teorico, prod), nProducto: moles(real, prod), producto: prod, reactivo: r.reactivo };
    const errores = {
      'muestra-pura': muestra * porGramo * eta / 100,
      'olvida-rendimiento': teorico,
      'suma-porcentajes': muestra * Math.max(0, p + eta - 100) / 100 * porGramo,
      'divide-rendimiento': teorico / (eta / 100),
      'rendimiento-dos-veces': teorico * (eta / 100) * (eta / 100),
      'olvida-coeficiente': moles(pura, r.reactivo) * masaMolar(prod) * eta / 100,
      'masa-se-conserva': pura,
    };
    if (esGas(r, prod)) {
      res.V = res.nProducto * VM; res.Vteorico = res.nTeorico * VM;
      errores['masa-como-volumen'] = real;
      errores['coeficiente-como-moles'] = coef(r, prod) * VM;
    }
    res.errores = errores;
    return res;
  }
  function rendimientoPorcentual(o) {
    const r = reaccion(o.reaccion), prod = o.producto || r.producto;
    const m = positivo(o.masa, 'la masa del reactivo'), real = positivo(o.real, 'el producto real');
    const p = pct(o.pureza === undefined ? 100 : o.pureza, 'la pureza');
    const pura = m * p / 100, teorico = masaAMasa(o.reaccion, pura, r.reactivo, prod);
    if (real > teorico * (1 + 1e-12)) throw new Error('el producto real no puede pasar del teórico');
    const otro = r.productos.map(x => x[1]).find(f => f !== prod);
    const errores = { 'sobre-reactivo': real / m * 100, 'lo-que-falta': (teorico - real) / teorico * 100, 'invierte': teorico / real * 100 };
    if (otro) errores['otro-producto'] = real / masaAMasa(o.reaccion, pura, r.reactivo, otro) * 100;
    return { pura, teorico, porcentaje: real / teorico * 100, noFormado: teorico - real, otro: otro || null, errores };
  }
  function muestraNecesaria(o) {
    const r = reaccion(o.reaccion), prod = o.producto || r.producto;
    const real = positivo(o.real, 'el producto real');
    const p = pct(o.pureza === undefined ? 100 : o.pureza, 'la pureza') / 100;
    const eta = pct(o.rendimiento === undefined ? 100 : o.rendimiento, 'el rendimiento') / 100;
    const aPuro = t => masaAMasa(o.reaccion, t, prod, r.reactivo);
    const teorico = real / eta, pura = aPuro(teorico), muestra = pura / p;
    return { teorico, pura, muestra, impureza: muestra - pura, errores: {
      'olvida-pureza': pura,
      'olvida-rendimiento': aPuro(real) / p,
      'multiplica-pureza': pura * p,
      'multiplica-rendimiento': aPuro(real * eta) / p,
      'multiplica-ambos': aPuro(real * eta) * p } };
  }
  function rendimientoCadena(lista) {
    if (!Array.isArray(lista) || lista.length < 2) throw new Error('la cadena necesita dos pasos o más');
    const e = lista.map((x, i) => pct(x, `el rendimiento del paso ${i + 1}`));
    const acumulado = []; let t = 100;
    for (const x of e) { t = t * x / 100; acumulado.push(t); }
    return { total: t, acumulado, errores: {
      'suma-porcentajes': Math.max(0, e.reduce((s, x) => s + x, 0) - 100 * (e.length - 1)),
      'promedio': e.reduce((s, x) => s + x, 0) / e.length,
      'el-menor': Math.min(...e) } };
  }
  function compararMejoras(o) {
    const base = producir(o), conPureza = producir({ ...o, pureza: 100 }).real, conRendimiento = producir({ ...o, rendimiento: 100 }).real;
    const d = conPureza - conRendimiento;
    return { real: base.real, conPureza, conRendimiento, factorPureza: conPureza / base.real, factorRendimiento: conRendimiento / base.real,
      mejor: Math.abs(d) < 1e-9 ? 'igual' : d > 0 ? 'pureza' : 'rendimiento',
      errores: { 'rendimiento-pesa-mas': 'rendimiento', 'dan-lo-mismo': 'igual', 'depende-de-la-masa': 'depende' } };
  }

  // ---------- La masa no desaparece ----------
  function balanceMasa(o) {
    const r = reaccion(o.reaccion);
    if (r.reactivos.length !== 1) throw new Error('balanceMasa es para reacciones de un solo reactivo');
    const m = positivo(o.masa, 'la masa del reactivo'), eta = pct(o.rendimiento === undefined ? 100 : o.rendimiento, 'el rendimiento') / 100;
    const reac = r.reactivo, prods = r.productos.map(x => x[1]), sol = r.producto;
    const gas = prods.find(f => esGas(r, f) && f !== sol) || prods.find(f => f !== sol);
    const formados = {}; for (const f of prods) formados[f] = masaAMasa(o.reaccion, m * eta, reac, f);
    const teo = masaAMasa(o.reaccion, m, reac, sol), falta = teo - formados[sol];
    const sumar = (q, fo) => Object.values(q).reduce((s, x) => s + x, 0) + Object.values(fo).reduce((s, x) => s + x, 0);
    const err = (quedan, fo) => ({ quedan, formados: fo, total: sumar(quedan, fo) });
    const quedan = { [reac]: m - m * eta };
    return { inicial: m, reacciona: m * eta, quedan, formados, teorico: teo, falta, total: sumar(quedan, formados), errores: {
      'se-pierde': err({}, { [sol]: formados[sol], [gas]: masaAMasa(o.reaccion, m, reac, gas) }),
      'sale-como-gas': err({}, { [sol]: formados[sol], [gas]: m - formados[sol] }),
      'falta-igual-sobra': err({ [reac]: falta }, { ...formados }) } };
  }
  function combustionIncompleta(mC, frac) {
    mC = positivo(mC, 'la masa de carbono');
    const fr = num(frac, 'la fracción'); if (!(fr >= 0 && fr <= 1)) throw new Error('la fracción va de 0 a 1');
    const n = mC / MASAS.C, nCO2 = n * fr, nCO = n - nCO2;
    const CO2 = masa(nCO2, 'CO2'), CO = masa(nCO, 'CO'), O2 = masa(nCO2 + nCO / 2, 'O2');
    return { CO2, CO, O2, teoricoCO2: masa(n, 'CO2'), rendimientoCO2: fr * 100, total: CO2 + CO, reactivos: mC + O2 };
  }

  // ---------- Equivalentes ----------
  const THETA = Object.freeze({
    HCl: { theta: 1, tipo: 'ácido' }, HNO3: { theta: 1, tipo: 'ácido' }, H2SO4: { theta: 2, tipo: 'ácido' }, H3PO4: { theta: 3, tipo: 'ácido' },
    NaOH: { theta: 1, tipo: 'base' }, KOH: { theta: 1, tipo: 'base' }, 'Ca(OH)2': { theta: 2, tipo: 'base' }, 'Al(OH)3': { theta: 3, tipo: 'base' },
    NaCl: { theta: 1, tipo: 'sal' }, CaCl2: { theta: 2, tipo: 'sal' }, CaCO3: { theta: 2, tipo: 'sal' }, 'Al2(SO4)3': { theta: 6, tipo: 'sal' },
  });
  function masaEquivalente(f) {
    const t = THETA[f];
    if (!t) throw new Error(`sustancia sin θ declarado: ${f}`);
    const M = masaMolar(f);
    return { M, theta: t.theta, tipo: t.tipo, Meq: M / t.theta, errores: { 'theta-1': M, 'theta-multiplica': M * t.theta } };
  }
  function equivalentes(m, f) {
    m = positivo(m, 'la masa'); const q = masaEquivalente(f);
    return { eq: m / q.Meq, Meq: q.Meq, errores: { 'theta-1': m / q.M } };
  }
  function neutralizar(acido, mA, base) {
    const a = masaEquivalente(acido), b = masaEquivalente(base);
    if (a.tipo !== 'ácido') throw new Error(`${acido} no es un ácido`);
    if (b.tipo !== 'base') throw new Error(`${base} no es una base`);
    mA = positivo(mA, 'la masa del ácido');
    const eq = mA / a.Meq;
    return { eq, MeqAcido: a.Meq, MeqBase: b.Meq, masaBase: eq * b.Meq, molesAcido: mA / a.M, molesBase: eq * b.Meq / b.M,
      errores: { 'theta-1': mA / a.M * b.M, 'masas-iguales': mA, 'theta-multiplica': mA / (a.M * a.theta) * (b.M * b.theta) } };
  }

  // ---------- Animación ----------
  const suave = x => x * x * (3 - 2 * x);
  function reparto(e, f) {
    f = Math.max(0, Math.min(1, num(f, 'f')));
    const separa = suave(Math.min(1, f / 0.35)), avance = f <= 0.35 ? 0 : suave((f - 0.35) / 0.65);
    const k = e.reacciona === undefined ? 1 : e.reacciona;
    return { separa, avance, impureza: e.impureza || 0, puroQueda: e.pura - e.pura * k * avance, formado: e.real * avance,
      teoricoVisible: Math.min(1, avance * 3) };
  }

  return { MASAS, VM, REACCIONES, THETA, atomos, masaMolar, moles, masa, balance, masaAMasa, pureza, producir,
    rendimientoPorcentual, muestraNecesaria, rendimientoCadena, compararMejoras, balanceMasa, combustionIncompleta,
    masaEquivalente, equivalentes, neutralizar, reparto };
});
