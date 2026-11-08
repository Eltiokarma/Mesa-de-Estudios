/*
 * Generador: miliequivalentes de iones, ppm, porcentaje en volumen, jarabes y ácido para un carbonato.
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['soluciones-meq-ppm']) y en Node (require). No usa ningún motor: la química
 * está aquí, en JS determinístico (regla 1).
 *
 * MASAS MOLARES DE ACADEMIA (g/mol): H 1, C 12, O 16, Na 23, Mg 24, S 32, Cl 35,5, K 39, Ca 40, Ag 108.
 *   Sales: NaCl 58,5 · KCl 74,5 · CaCl₂ 111 · MgCl₂ 95 · Na₂SO₄ 142 · K₂SO₄ 174 · MgSO₄ 120 · NaHCO₃ 84.
 *   Iones: Na⁺ 23 · K⁺ 39 · Ca²⁺ 40 · Mg²⁺ 24 · Cl⁻ 35,5 · SO₄²⁻ 96 · HCO₃⁻ 61.
 *   Otros: AgCl 143,5 · AgNO₃ 170 · CaCO₃ 100 · Na₂CO₃ 106 · MgCO₃ 84 · K₂CO₃ 138 · HCl 36,5 · H₂SO₄ 98 ·
 *   disacáridos C₁₂H₂₂O₁₁ (sacarosa, maltosa, lactosa) 342 · glucosa C₆H₁₂O₆ 180 ·
 *   gases CO 28 · SO₂ 64 · NO₂ 46 · O₃ 48.
 * CONVENCIONES:
 *   - Volúmenes en mL salvo que se diga otra cosa. M (mol/L) = mmol/mL.
 *   - mEq de un ion = mmol del ion × |carga|; mmol del ion = mmol de la sal × subíndice del ion.
 *     1 Eq = 1000 mEq. mEq/L = mEq ÷ litros de solución.
 *   - % m/v = gramos de soluto por 100 mL de solución (p % m/v son 10·p g/L).
 *   - ppm en agua diluida: 1 ppm = 1 mg/L = 1 g/m³. 1 m³ = 1000 L.
 *   - ppm de un gas en el aire: por volumen (= fracción molar × 10⁶). n/V del aire = P/(R·T), con
 *     R = 0,082 atm·L/(mol·K) y T = t(°C) + 273.
 *   - Mezclas: los volúmenes se suman (se dice en el enunciado).
 *   - % v/v = mL de soluto por 100 mL de solución; en el tipo 'volumen', la solución es alcohol + agua.
 *   - Redondeo: las alternativas se muestran con 4 cifras significativas (coma decimal, sin ceros
 *     sobrantes). respuesta.valor es el número sin redondear.
 *
 * TIPOS (campo _datos.tipo; los demás campos de _datos son las entradas):
 *   meq          { sal, ion:'cat'|'an', dado:'M'|'pct', M | pct, V }  → mEq del ion en V mL
 *   volumen      { sal, ion, M, N }                                    → mL de solución con N mEq del ion
 *   mezcla       { sub:'porL'|'total', s1, M1, V1, s2, M2, V2, ion }    → mEq/L (porL) o mEq (total) del
 *                ion común ion ('cat' o 'an', el mismo en las dos sales) en la mezcla
 *   preparar     { sub:'A'|'B', sA, MA, sB, MB, Vf, y, w }              → mL de la madre A (sal de catión +1
 *                y Cl⁻) o B (cloruro de catión +2) para Vf mL con y mEq/L del catión +2 y w mEq/L de Cl⁻;
 *                el resto es agua
 *   masa         { sal, X, V, otra, Xotra }                             → mg de la sal (catión +2) para V mL
 *                con X mEq/L de su catión (la otra sal y su Xotra son solo contexto)
 *   igualar      { sal, ion:'cat', p, X, Vs }                           → mL de suero de p % m/v de la sal con
 *                los mismos mEq del catión que Vs mL de un fluido con X mEq/L
 *   precipitacion{ sub:'precipitado'|'cloruro', Vm, c, Vt }            → Vm mL de muestra valorados con Vt mL
 *                de AgNO₃ c M (Ag⁺ + Cl⁻ → AgCl). precipitado: mg de AgCl; cloruro: mg/L de Cl⁻ en la muestra
 *   ppmMasa      { sub:'masa'|'ppm', ppm | m, V, unidad:'g'|'kg' }      → V en m³. masa: masa del
 *                contaminante en la unidad pedida; ppm: ppm con m en gramos
 *   ppmGas       { lugar, gas, X, t, P, unidad:'mol/m³'|'mmol/m³'|'µmol/m³' } → X ppm en volumen a t °C y
 *                P atm: cantidad del gas por m³ de aire (lugar: 'avenida', 'ciudad' o 'chimenea'; solo contexto)
 *   volumen-pct  { sub:'agua'|'mezcla', V, a } | { V1, a1, V2, a2 }     → agua: mL de agua en V mL de alcohol
 *                de a % v/v; mezcla: % v/v de alcohol al mezclar
 *   jarabe       { azucar, p }                                          → mol/L de un jarabe de p % m/v
 *   carbonato    { carb, acido, n, p }                                  → mL de ácido de p % m/v que reaccionan
 *                con n·M(carbonato) g del carbonato (CO₃²⁻ + 2 H⁺: 2 HCl o 1 H₂SO₄ por carbonato)
 * También exporta CALC (las mismas cuentas como funciones puras, para papel.json) y SALES.
 * FIN DE LA CABECERA (lo que sigue es código; el verificador recalcula solo con lo de arriba).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'soluciones-meq-ppm';
  const FS = 'docs/investigacion/gases-soluciones-ideas-erroneas.md';
  const FE = 'docs/investigacion/estequiometria-ideas-erroneas.md';
  const FB = 'docs/investigacion/biomoleculas-ideas-erroneas.md';
  const e = (id, respaldo, fuente, valor, explicacion) => ({ id, respaldo, fuente, valor, explicacion });
  const hip = (id, valor, explicacion, fuente = FS) => e(id, 'hipotesis', fuente, valor, explicacion);
  const v = P.v;
  // 4 cifras significativas, coma decimal, sin ceros sobrantes.
  const F = x => (x === 0 ? '0' : P.formatear(x, Math.max(0, 3 - Math.floor(Math.log10(Math.abs(x) * (1 + 1e-12))))));
  const N = x => P.formatear(x, 3); // datos del enunciado

  // ---------- Sustancias ----------
  const ION = {
    Na: { f: 'Na⁺', z: 1, M: 23 }, K: { f: 'K⁺', z: 1, M: 39 }, Ca: { f: 'Ca²⁺', z: 2, M: 40 }, Mg: { f: 'Mg²⁺', z: 2, M: 24 },
    Cl: { f: 'Cl⁻', z: 1, M: 35.5 }, SO4: { f: 'SO₄²⁻', z: 2, M: 96 }, HCO3: { f: 'HCO₃⁻', z: 1, M: 61 },
  };
  // cat/an: clave del ion y subíndice (nu). M de la sal en g/mol.
  const SALES = {
    NaCl: { f: 'NaCl', M: 58.5, cat: ['Na', 1], an: ['Cl', 1] },
    KCl: { f: 'KCl', M: 74.5, cat: ['K', 1], an: ['Cl', 1] },
    CaCl2: { f: 'CaCl₂', M: 111, cat: ['Ca', 1], an: ['Cl', 2] },
    MgCl2: { f: 'MgCl₂', M: 95, cat: ['Mg', 1], an: ['Cl', 2] },
    Na2SO4: { f: 'Na₂SO₄', M: 142, cat: ['Na', 2], an: ['SO4', 1] },
    K2SO4: { f: 'K₂SO₄', M: 174, cat: ['K', 2], an: ['SO4', 1] },
    MgSO4: { f: 'MgSO₄', M: 120, cat: ['Mg', 1], an: ['SO4', 1] },
    NaHCO3: { f: 'NaHCO₃', M: 84, cat: ['Na', 1], an: ['HCO3', 1] },
  };
  const ionDe = (s, cual) => { const [k, nu] = SALES[s][cual]; return { ...ION[k], clave: k, nu }; };
  // mEq del ion por mmol de sal (subíndice × carga). Es el mismo para el catión y el anión.
  const kDe = (s, cual) => { const i = ionDe(s, cual); return i.nu * i.z; };
  const CARB = { CaCO3: { f: 'CaCO₃', M: 100 }, Na2CO3: { f: 'Na₂CO₃', M: 106 }, MgCO3: { f: 'MgCO₃', M: 84 }, K2CO3: { f: 'K₂CO₃', M: 138 } };
  const ACIDO = { HCl: { f: 'HCl', M: 36.5, r: 2 }, H2SO4: { f: 'H₂SO₄', M: 98, r: 1 } };
  const AZUCAR = {
    sacarosa: { f: 'C₁₂H₂₂O₁₁', M: 342, disacarido: true }, maltosa: { f: 'C₁₂H₂₂O₁₁', M: 342, disacarido: true },
    lactosa: { f: 'C₁₂H₂₂O₁₁', M: 342, disacarido: true }, glucosa: { f: 'C₆H₁₂O₆', M: 180, disacarido: false },
  };
  const GAS = { CO: { f: 'CO', M: 28, nombre: 'monóxido de carbono' }, SO2: { f: 'SO₂', M: 64, nombre: 'dióxido de azufre' },
    NO2: { f: 'NO₂', M: 46, nombre: 'dióxido de nitrógeno' }, O3: { f: 'O₃', M: 48, nombre: 'ozono' } };
  const R = 0.082, M_AGCL = 143.5, M_AGNO3 = 170, M_CL = 35.5;

  // ---------- Cuentas (también para papel.json) ----------
  const CALC = {
    meq: (sal, ion, mmolSal) => mmolSal * kDe(sal, ion),
    mmolDePct: (sal, pct, V) => pct * 10 * V / SALES[sal].M,           // g/L × L ÷ g/mol × 1000
    volumenConMeq: (sal, ion, M, Nmeq) => Nmeq / (M * kDe(sal, ion)),
    mezcla: (s1, M1, V1, s2, M2, V2, ion) => {
      const meq = M1 * V1 * kDe(s1, ion) + M2 * V2 * kDe(s2, ion);
      return { meq, meqL: meq * 1000 / (V1 + V2) };
    },
    preparar: (sA, MA, sB, MB, Vf, y, w) => {
      const VB = y * Vf / 1000 / (kDe(sB, 'cat') * MB);
      const VA = (w - y) * Vf / 1000 / (kDe(sA, 'an') * MA);
      return { VA, VB, agua: Vf - VA - VB };
    },
    masaSal: (sal, X, V) => X * V / 1000 / kDe(sal, 'cat') * SALES[sal].M,   // mg
    igualar: (sal, p, X, Vs) => (X * Vs / 1000) / (10 * p * kDe(sal, 'cat') / SALES[sal].M),
    precipitacion: (Vm, c, Vt) => ({ mmol: c * Vt, mgAgCl: c * Vt * M_AGCL, mgL: c * Vt * M_CL * 1000 / Vm, meqL: c * Vt * 1000 / Vm }),
    ppmMasa: (ppm, Vm3) => ({ g: ppm * Vm3, kg: ppm * Vm3 / 1000, mg: ppm * Vm3 * 1000 }),
    ppmGas: (X, t, P) => { const molm3 = X * 1e-6 * P / (R * (t + 273)) * 1000; return { molm3, mmolm3: molm3 * 1000 }; },
    aguaEnAlcohol: (V, a) => V * (100 - a) / 100,
    mezclaVv: (V1, a1, V2, a2) => (V1 * a1 + V2 * a2) / (V1 + V2),
    jarabe: (M, p) => 10 * p / M,
    carbonato: (Mc, acido, n, p) => ACIDO[acido].r * n * ACIDO[acido].M * 100 / p,
  };

  const TIPOS = ['meq', 'meq', 'volumen', 'mezcla', 'mezcla', 'preparar', 'masa', 'igualar', 'precipitacion',
    'ppmMasa', 'ppmGas', 'volumen-pct', 'jarabe', 'carbonato'];

  function generar(semilla) {
    const rng = Azar.crear(ID + '|' + semilla);
    const tipo = rng.elegir(TIPOS);
    for (let intento = 0; intento < 500; intento++) {
      const pr = CONSTRUIR[tipo](rng);
      if (!pr) continue;
      const alternativas = P.armar({ correcta: pr.correcta, errores: pr.errores, rng, texto: x => `${F(x)} ${pr.unidad}` });
      if (alternativas.length < 4) continue;
      return {
        id: `${ID}#${semilla}`, variables: pr.variables, enunciado: pr.enunciado, pregunta: pr.pregunta, datos: pr.datos || '',
        alternativas, solucion: pr.solucion, respuesta: { valor: pr.correcta, unidad: pr.unidad }, _datos: pr.d,
      };
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  const masasDe = lista => 'Masas molares (g/mol): ' + lista.join('; ') + '.';
  const mSal = s => `${SALES[s].f} = ${N(SALES[s].M)}`;

  // ---------- 1. mEq de un ion ----------
  function meq(rng) {
    const sal = rng.elegir(Object.keys(SALES)), ion = rng.elegir(['cat', 'an']);
    const dado = rng.elegir(['M', 'pct']);
    const V = rng.elegir([50, 100, 200, 250, 500, 1000]);
    const M = rng.elegir([0.01, 0.02, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.5]);
    const pct = rng.elegir([0.2, 0.45, 0.5, 0.9, 1, 1.5, 2, 3, 5]);
    const S = SALES[sal], I = ionDe(sal, ion), k = kDe(sal, ion);
    const n = dado === 'M' ? M * V : CALC.mmolDePct(sal, pct, V);
    const correcta = CALC.meq(sal, ion, n);
    const ctxs = ['En el laboratorio se tienen'];
    if (['NaCl', 'KCl', 'NaHCO3', 'MgSO4'].includes(sal) && (dado === 'M' ? M <= 0.2 : pct <= 1)) ctxs.push('Una bolsa de suero contiene');
    if (['NaCl', 'KCl'].includes(sal) && (dado === 'M' ? M <= 0.1 : pct <= 0.5)) ctxs.push('Una bebida rehidratante de prueba contiene');
    const ctx = rng.elegir(ctxs);
    const errores = [
      ...(I.z > 1 ? [e('SO15', 'parcial', FS, n * I.nu, `Contaste los milimoles de ${I.f} pero no multiplicaste por su carga. Cada mmol de ${I.f} son ${I.z} mEq, porque el equivalente cuenta cargas.`),
        hip('QA-carga-al-reves', n * I.nu / I.z, `Dividiste entre la carga de ${I.f} en vez de multiplicar. Un ion con carga ${I.z} aporta ${I.z} mEq por cada mmol: más equivalentes que milimoles, no menos.`)] : []),
      ...(I.nu > 1 ? [hip('QA-sin-subindice', n * I.z, `Tomaste un ${I.f} por cada ${S.f}, pero la fórmula tiene ${I.nu}. Primero multiplica los mmol de sal por el subíndice del ion.`)] : []),
      hip('QA-eq-por-meq', correcta / 1000, `Ese número son equivalentes (Eq), no miliequivalentes. Si trabajas con mL y mol/L, los mmol salen solos; 1 Eq = 1000 mEq.`),
      hip('QA-mili-dos-veces', correcta * 1000, `Multiplicaste por 1000 de más. M × V(mL) ya da milimoles; volver a multiplicar por 1000 es pasar a mili dos veces.`),
      hip('QA-ambos-iones', 2 * correcta, `Sumaste los mEq del catión y los del anión. Se piden solo los de ${I.f}. En una sal, los dos iones tienen los mismos mEq, pero no se suman.`),
      ...(dado === 'pct' ? [e('SO14', 'parcial', FS, pct * V * k, `Tomaste ${N(pct)} % m/v como si fuera ${N(pct)} mol/L. El % m/v son gramos en 100 mL: hay que pasar a g/L y dividir entre la masa molar.`)] : []),
    ];
    const variables = { c: { nombre: 'concentración', color: 'o' }, V: { nombre: 'volumen', color: 'i' }, n: { nombre: 'milimoles del ion', color: 'h' }, x: { nombre: 'miliequivalentes', color: 'd' } };
    const conc = dado === 'M' ? `${N(M)} mol/L` : `al ${N(pct)} % m/v`;
    const sol = [];
    if (dado === 'M') sol.push(['Milimoles de sal: ', v('c', `${N(M)} mol/L`), ' × ', v('V', `${N(V)} mL`), ` = ${F(n)} mmol de ${S.f}.`]);
    else sol.push([v('c', `${N(pct)} % m/v`), ` son ${N(pct)} g en 100 mL, es decir ${N(pct * 10)} g/L. En `, v('V', `${N(V)} mL`), ` hay ${F(pct * V / 100)} g; ÷ ${N(S.M)} g/mol = ${F(n)} mmol de ${S.f}.`]);
    sol.push([`Cada ${S.f} trae ${I.nu} ${I.f}: `, v('n', `${F(n * I.nu)} mmol de ${I.f}`), '.']);
    sol.push(['mEq = mmol × carga: ', v('n', `${F(n * I.nu)}`), ` × ${I.z} = `, v('x', `${F(correcta)} mEq de ${I.f}`), '.']);
    return {
      variables, correcta, errores, unidad: 'mEq',
      enunciado: [`${ctx} `, v('V', `${N(V)} mL`), ` de una solución de ${S.f} `, v('c', conc), '.'],
      pregunta: ['¿Cuántos ', v('x', 'miliequivalentes'), ` de ${I.f} hay en ese volumen?`],
      datos: dado === 'pct' ? masasDe([mSal(sal)]) : '',
      solucion: sol,
      d: dado === 'M' ? { tipo: 'meq', sal, ion, dado, M, V } : { tipo: 'meq', sal, ion, dado, pct, V },
    };
  }

  // ---------- 2. Volumen que contiene N mEq ----------
  function volumen(rng) {
    const sal = rng.elegir(Object.keys(SALES)), ion = rng.elegir(['cat', 'an']);
    const M = rng.elegir([0.05, 0.1, 0.2, 0.25, 0.5, 1]);
    const Vobj = rng.elegir([20, 40, 50, 80, 100, 150, 200, 250, 400, 500]);
    const S = SALES[sal], I = ionDe(sal, ion), k = kDe(sal, ion);
    const Nmeq = M * Vobj * k;
    if (Math.abs(Nmeq * 10 - Math.round(Nmeq * 10)) > 1e-9) return null;
    const correcta = CALC.volumenConMeq(sal, ion, M, Nmeq);
    const errores = [
      ...(I.z > 1 ? [e('SO15', 'parcial', FS, Nmeq / (M * I.nu), `Despejaste como si cada mmol de ${I.f} fuera 1 mEq. Su carga es ${I.z}: cada mL de la solución trae ${I.z} veces más mEq que mmol, así que basta menos volumen.`),
        hip('QA-carga-al-reves', Nmeq * I.z / (M * I.nu), `Multiplicaste por la carga en vez de dividir: mmol del ion = mEq ÷ carga.`)] : []),
      ...(I.nu > 1 ? [hip('QA-sin-subindice', Nmeq / (M * I.z), `Olvidaste que cada ${S.f} trae ${I.nu} ${I.f}. Por eso cada mL tiene el doble de ${I.f} del que contaste.`)] : []),
      hip('QA-eq-por-meq', correcta * 1000, `Tomaste los ${N(Nmeq)} mEq como si fueran ${N(Nmeq)} Eq: te salió mil veces más volumen. Con mol/L y mEq, el volumen sale directo en mL.`),
      hip('QA-litros-como-mL', correcta / 1000, `Ese número son litros, no mililitros, o dividiste entre 1000 de más. M = mmol/mL: mEq ÷ (mEq por mL) da mL.`),
      hip('QA-ambos-iones', correcta / 2, `Contaste los mEq del catión y del anión juntos, como si los dos sumaran para ${I.f}. Solo cuenta ${I.f}.`),
    ];
    const variables = { c: { nombre: 'concentración', color: 'o' }, q: { nombre: 'miliequivalentes pedidos', color: 'i' }, k: { nombre: 'mEq por mL', color: 'h' }, x: { nombre: 'volumen', color: 'd' } };
    const ctx = rng.elegir(['Una enfermera necesita', 'Para un ensayo de laboratorio se necesitan', 'Un técnico debe medir']);
    return {
      variables, correcta, errores, unidad: 'mL',
      enunciado: [`${ctx} `, v('q', `${N(Nmeq)} mEq de ${I.f}`), ` y se tiene una solución de ${S.f} `, v('c', `${N(M)} mol/L`), '.'],
      pregunta: ['¿Qué ', v('x', 'volumen'), ' de esa solución, en mL, contiene esa cantidad?'],
      solucion: [
        [v('c', `${N(M)} mol/L`), ` son ${N(M)} mmol de ${S.f} por mL; con ${I.nu} ${I.f} de carga ${I.z} por fórmula, son `, v('k', `${F(M * k)} mEq de ${I.f} por mL`), '.'],
        ['Volumen = ', v('q', `${N(Nmeq)} mEq`), ' ÷ ', v('k', `${F(M * k)} mEq/mL`), ' = ', v('x', `${F(correcta)} mL`), '.'],
      ],
      d: { tipo: 'volumen', sal, ion, M, N: Nmeq },
    };
  }

  // ---------- 3. Mezcla de dos sales con ion común ----------
  const PARES = [['NaCl', 'CaCl2', 'an'], ['KCl', 'MgCl2', 'an'], ['NaCl', 'MgCl2', 'an'], ['NaCl', 'KCl', 'an'],
    ['NaCl', 'Na2SO4', 'cat'], ['KCl', 'K2SO4', 'cat'], ['Na2SO4', 'MgSO4', 'an'], ['NaHCO3', 'Na2SO4', 'cat']];
  function mezcla(rng) {
    const [s1, s2, ion] = rng.elegir(PARES);
    const sub = rng.elegir(['porL', 'porL', 'total']);
    const M1 = rng.elegir([0.05, 0.1, 0.15, 0.2, 0.3]), M2 = rng.elegir([0.02, 0.05, 0.1, 0.2, 0.25]);
    const V1 = rng.elegir([100, 200, 250, 300, 400, 500]), V2 = rng.elegir([100, 150, 200, 250, 500]);
    const I = ionDe(s1, ion), k1 = kDe(s1, ion), k2 = kDe(s2, ion);
    const m1 = M1 * V1 * k1, m2 = M2 * V2 * k2, Vt = V1 + V2;
    const r = CALC.mezcla(s1, M1, V1, s2, M2, V2, ion);
    const porL = sub === 'porL';
    const correcta = porL ? r.meqL : r.meq;
    const f = x => (porL ? x * 1000 / Vt : x);
    const [A, B] = [SALES[s1].f, SALES[s2].f];
    const unaK = (k1 > 1 || k2 > 1) && I.z === 1 ? 'QA-sin-subindice' : 'SO15';
    const errores = [
      hip('QA-ion-comun-una-sal', f(m1), `Contaste solo el ${I.f} que trae el ${A}. El ${B} también tiene ${I.f}: en la mezcla se suman los mEq de las dos sales.`),
      hip('QA-ion-comun-una-sal', f(m2), `Contaste solo el ${I.f} que trae el ${B}. El ${A} también tiene ${I.f}: en la mezcla se suman los mEq de las dos sales.`),
      ...((k1 > 1 || k2 > 1) ? [unaK === 'SO15'
        ? e('SO15', 'parcial', FS, f(M1 * V1 * ionDe(s1, ion).nu + M2 * V2 * ionDe(s2, ion).nu), `Sumaste milimoles de ${I.f}, no miliequivalentes: falta multiplicar por su carga, ${I.z}.`)
        : hip('QA-sin-subindice', f(M1 * V1 * I.z + M2 * V2 * I.z), `Tomaste un ${I.f} por fórmula en las dos sales. ${k1 > 1 ? A : B} trae ${Math.max(ionDe(s1, ion).nu, ionDe(s2, ion).nu)}: hay que multiplicar por el subíndice.`)] : []),
      ...(porL ? [
        e('SO7', 'parcial', FS, (M1 * k1 + M2 * k2) * 1000 / 2, `Promediaste las dos concentraciones sin mirar los volúmenes. Un promedio simple solo vale si los volúmenes son iguales; lo seguro es sumar mEq y dividir entre el volumen total.`),
        hip('QA-sin-diluir', (M1 * k1 + M2 * k2) * 1000, `Sumaste las concentraciones como si fueran cantidades. Al mezclar, cada solución se reparte en el volumen total: se suman mEq, no mEq/L.`),
        hip('QA-eq-por-meq', correcta / 1000, `Te salieron Eq/L, no mEq/L. Con mL y mol/L, M × V(mL) ya da milimoles.`),
      ] : [hip('QA-eq-por-meq', correcta / 1000, `Te salieron Eq, no mEq. Con mL y mol/L, M × V(mL) ya da milimoles.`),
        hip('QA-ambos-iones', 2 * correcta, `Sumaste también los mEq del otro ion de cada sal. Solo se piden los de ${I.f}.`)]),
    ];
    const variables = { a: { nombre: `solución de ${A}`, color: 'o' }, b: { nombre: `solución de ${B}`, color: 'i' }, t: { nombre: 'volumen total', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
    const sol = [
      ['De la primera: ', v('a', `${N(M1)} mol/L × ${N(V1)} mL`), ` = ${F(M1 * V1)} mmol de ${A}; × ${k1} = ${F(m1)} mEq de ${I.f}.`],
      ['De la segunda: ', v('b', `${N(M2)} mol/L × ${N(V2)} mL`), ` = ${F(M2 * V2)} mmol de ${B}; × ${k2} = ${F(m2)} mEq de ${I.f}.`],
      [`Se suman: ${F(m1)} + ${F(m2)} = ${F(r.meq)} mEq de ${I.f}.`],
    ];
    if (porL) sol.push(['Volumen total: ', v('t', `${N(Vt)} mL`), ` = ${N(Vt / 1000)} L. Concentración: ${F(r.meq)} ÷ ${N(Vt / 1000)} = `, v('x', `${F(correcta)} mEq/L`), '.']);
    else sol[2] = [`Se suman: ${F(m1)} + ${F(m2)} = `, v('x', `${F(correcta)} mEq de ${I.f}`), '. El volumen total no hace falta para la cantidad.'];
    return {
      variables, correcta, errores, unidad: porL ? 'mEq/L' : 'mEq',
      enunciado: ['En el laboratorio se mezclan ', v('a', `${N(V1)} mL de ${A} ${N(M1)} mol/L`), ' con ', v('b', `${N(V2)} mL de ${B} ${N(M2)} mol/L`), '. Los volúmenes se suman.'],
      pregunta: porL ? ['¿Cuál es la ', v('x', 'concentración'), ` de ${I.f} en la mezcla, en mEq/L?`] : ['¿Cuántos ', v('x', 'miliequivalentes'), ` de ${I.f} hay en la mezcla?`],
      solucion: sol,
      d: { tipo: 'mezcla', sub, s1, M1, V1, s2, M2, V2, ion },
    };
  }

  // ---------- 4. Preparar una mezcla con dos soluciones madre ----------
  function preparar(rng) {
    const sA = rng.elegir(['NaCl', 'KCl']), sB = rng.elegir(['CaCl2', 'MgCl2']);
    const sub = rng.elegir(['A', 'B']);
    const MA = rng.elegir([0.5, 1, 2]), MB = rng.elegir([0.1, 0.25, 0.5, 1]);
    const Vf = rng.elegir([250, 500, 1000, 2000]);
    const VA = rng.elegir([10, 20, 25, 40, 50, 60, 75, 100]), VB = rng.elegir([4, 5, 8, 10, 20, 25, 40]);
    if (VA + VB >= Vf / 2) return null;
    const y = VB * 2 * MB * 1000 / Vf, w = y + VA * MA * 1000 / Vf;
    if ([y, w].some(x => Math.abs(x * 10 - Math.round(x * 10)) > 1e-9)) return null;
    const r = CALC.preparar(sA, MA, sB, MB, Vf, y, w);
    const A = SALES[sA].f, B = SALES[sB].f, C = ionDe(sB, 'cat');
    const correcta = sub === 'A' ? r.VA : r.VB;
    const errores = sub === 'A' ? [
      hip('QA-ion-comun-una-sal', w * Vf / 1000 / MA, `Pusiste todo el Cl⁻ con la madre de ${A}. Pero el ${B} también trae Cl⁻: la parte que falta es ${N(w)} − ${N(y)} mEq/L.`),
      hip('QA-sin-subindice', (w - y / 2) * Vf / 1000 / MA, `Contaste un Cl⁻ por cada ${B}, pero trae dos. Los mEq de Cl⁻ que aporta el ${B} son los mismos que los de ${C.f}: ${N(y)} mEq/L.`),
      hip('QA-volumen-final', Vf - r.VB, `Supusiste que las dos madres llenan el volumen final. No: se miden los milimoles que hacen falta y el resto se completa con agua.`),
      hip('QA-eq-por-meq', r.VA * 1000, `Tomaste mEq como si fueran Eq: te salió mil veces más volumen.`),
    ] : [
      e('SO15', 'parcial', FS, 2 * r.VB, `Pasaste mEq de ${C.f} a mmol sin dividir entre su carga (2). Cada mmol de ${B} aporta 2 mEq de ${C.f}: basta la mitad de volumen.`),
      hip('QA-carga-dos-veces', r.VB / 2, `Usaste la carga dos veces: dividiste entre 2 al pasar a mmol y otra vez después. Un ${C.f} por fórmula, con carga 2.`),
      hip('QA-volumen-final', Vf - r.VA, `Supusiste que las dos madres llenan el volumen final. No: se miden los milimoles que hacen falta y el resto se completa con agua.`),
      hip('QA-otro-ion', w * Vf / 1000 / (2 * MB), `Usaste los mEq/L de Cl⁻ para calcular el ${B}. El ${B} se calcula con su catión, ${C.f}, que solo sale de esa madre.`),
      hip('QA-eq-por-meq', r.VB * 1000, `Tomaste mEq como si fueran Eq: te salió mil veces más volumen.`),
    ];
    const variables = { f: { nombre: 'volumen final', color: 'o' }, y: { nombre: `mEq/L de ${C.f}`, color: 'i' }, w: { nombre: 'mEq/L de Cl⁻', color: 'h' }, x: { nombre: 'volumen pedido', color: 'd' } };
    const sol = [
      ['mEq que debe haber al final: ', v('y', `${N(y)} mEq/L`), ' × ', v('f', `${N(Vf / 1000)} L`), ` = ${F(y * Vf / 1000)} mEq de ${C.f} y `, v('w', `${N(w)} mEq/L`), ' × ', v('f', `${N(Vf / 1000)} L`), ` = ${F(w * Vf / 1000)} mEq de Cl⁻.`],
      [`El ${C.f} solo sale del ${B}: ${F(y * Vf / 1000)} mEq ÷ 2 = ${F(y * Vf / 2000)} mmol de ${B}; ÷ ${N(MB)} mmol/mL = `, sub === 'B' ? v('x', `${F(r.VB)} mL`) : `${F(r.VB)} mL`, '.'],
    ];
    if (sub === 'A') sol.push([`Ese ${B} trae también ${F(y * Vf / 1000)} mEq de Cl⁻. Al ${A} le toca el resto: ${F(w * Vf / 1000)} − ${F(y * Vf / 1000)} = ${F((w - y) * Vf / 1000)} mEq = ${F((w - y) * Vf / 1000)} mmol; ÷ ${N(MA)} mmol/mL = `, v('x', `${F(r.VA)} mL`), '.']);
    sol.push([`Se completa con agua hasta `, v('f', `${N(Vf)} mL`), ` (${F(r.agua)} mL de agua). El volumen final decide cuántos mEq hacen falta, no cuánto se mide de cada madre.`]);
    return {
      variables, correcta, errores, unidad: 'mL',
      enunciado: [`Se tienen dos soluciones madre: ${A} ${N(MA)} mol/L y ${B} ${N(MB)} mol/L. Con ellas y agua se quiere preparar `,
        v('f', `${N(Vf)} mL`), ' de una solución con ', v('y', `${N(y)} mEq/L de ${C.f}`), ' y ', v('w', `${N(w)} mEq/L de Cl⁻`), ` (el ${C.f} viene solo de su cloruro, el ${B}).`],
      pregunta: ['¿Qué ', v('x', 'volumen'), ` de la madre de ${sub === 'A' ? A : B} hay que medir, en mL?`],
      solucion: sol,
      d: { tipo: 'preparar', sub, sA, MA, sB, MB, Vf, y, w },
    };
  }

  // ---------- 5. Masa de sal de un catión divalente ----------
  function masa(rng) {
    const sal = rng.elegir(['CaCl2', 'MgCl2', 'MgSO4']), otra = rng.elegir(['KCl', 'NaCl']);
    const X = rng.elegir([2, 3, 4, 5, 6, 8, 10]), Xotra = rng.elegir([10, 15, 20, 25, 30]);
    const V = rng.elegir([250, 500, 1000, 2000]);
    const S = SALES[sal], C = ionDe(sal, 'cat'), O = ionDe(otra, 'cat');
    const correcta = CALC.masaSal(sal, X, V);
    const errores = [
      e('SO15', 'parcial', FS, X * V / 1000 * S.M, `Tomaste los mEq de ${C.f} como milimoles. Su carga es 2: cada mmol de ${S.f} da 2 mEq, así que hace falta la mitad de sal.`),
      hip('QA-carga-al-reves', X * V / 1000 * 2 * S.M, `Multiplicaste por la carga al pasar de mEq a mmol; había que dividir. mmol = mEq ÷ carga.`),
      hip('QA-masa-del-ion', X * V / 1000 / 2 * C.M, `Calculaste la masa del ${C.f} solo, no de la sal. Lo que se pesa en la balanza es ${S.f}: hay que usar ${N(S.M)} g/mol.`),
      hip('QA-g-como-mg', correcta / 1000, `Te salieron gramos y los escribiste como miligramos. mEq × (mg/mmol) da mg directamente.`),
      hip('QA-otro-ion', Xotra * V / 1000 / 2 * S.M, `Usaste los ${N(Xotra)} mEq/L del ${O.f}, que es el catión de la otra sal. El ${S.f} se calcula con su propio catión, ${C.f}.`),
    ];
    const variables = { X: { nombre: `mEq/L de ${C.f}`, color: 'o' }, V: { nombre: 'volumen', color: 'i' }, n: { nombre: 'milimoles de sal', color: 'h' }, x: { nombre: 'masa de sal', color: 'd' } };
    const ctx = rng.elegir(['Para preparar una bebida rehidratante de prueba', 'Para preparar una solución de laboratorio', 'Para preparar un suero de prueba']);
    return {
      variables, correcta, errores, unidad: 'mg',
      enunciado: [`${ctx} se quiere tener `, v('V', `${N(V)} mL`), ` con ${N(Xotra)} mEq/L de ${O.f} y `, v('X', `${N(X)} mEq/L de ${C.f}`), `. El ${O.f} sale del ${SALES[otra].f} y el ${C.f}, del ${S.f}.`],
      pregunta: ['¿Qué ', v('x', 'masa'), ` de ${S.f} hay que disolver, en mg?`],
      datos: masasDe([mSal(sal), `${C.f} = ${C.M}`]),
      solucion: [
        ['mEq de ', C.f, ': ', v('X', `${N(X)} mEq/L`), ' × ', v('V', `${N(V / 1000)} L`), ` = ${F(X * V / 1000)} mEq.`],
        [`${C.f} tiene carga 2: ${F(X * V / 1000)} ÷ 2 = `, v('n', `${F(X * V / 2000)} mmol`), ` de ${C.f}, que son los mmol de ${S.f}.`],
        ['Masa: ', v('n', `${F(X * V / 2000)} mmol`), ` × ${N(S.M)} mg/mmol = `, v('x', `${F(correcta)} mg de ${S.f}`), '.'],
      ],
      d: { tipo: 'masa', sal, X, V, otra, Xotra },
    };
  }

  // ---------- 6. Igualar mEq con un suero de % m/v ----------
  const SUEROS = [
    { sal: 'NaCl', X: [135, 140, 145, 150], p: [0.9, 0.45, 1.17, 2.34, 3] },
    { sal: 'KCl', X: [3.5, 4, 4.5, 5], p: [0.745, 1.49, 7.45, 0.3] },
    { sal: 'KCl', X: [20, 40], p: [0.745, 1.49, 7.45], mantenimiento: true },
    { sal: 'CaCl2', X: [4, 4.5, 5], p: [1.11, 0.555, 2.22, 10] },
  ];
  function igualar(rng) {
    const s = rng.elegir(SUEROS), sal = s.sal, X = rng.elegir(s.X), p = rng.elegir(s.p);
    const Vs = rng.elegir([100, 200, 250, 500, 1000]);
    const S = SALES[sal], C = ionDe(sal, 'cat'), k = kDe(sal, 'cat');
    const q = X * Vs / 1000, porMl = 10 * p * k / S.M;  // mEq necesarios; mEq por mL del suero
    const correcta = CALC.igualar(sal, p, X, Vs);
    const errores = [
      e('SO14', 'parcial', FS, q / (p * k), `Tomaste ${N(p)} % m/v como si fuera ${N(p)} mol/L. El % m/v son gramos por 100 mL: ${N(p)} % son ${N(10 * p)} g/L, y luego hay que dividir entre ${N(S.M)} g/mol.`),
      hip('QA-pct-g-L', correcta * 10, `Leíste ${N(p)} % m/v como ${N(p)} g por litro. Son ${N(p)} g por cada 100 mL, es decir ${N(10 * p)} g/L.`),
      hip('QA-masa-del-ion', q / (10 * p * k / C.M), `Dividiste los gramos de sal entre la masa del ${C.f} (${C.M}). Los gramos del suero son de ${S.f}: hay que usar ${N(S.M)} g/mol.`),
      ...(C.z > 1 ? [e('SO15', 'parcial', FS, correcta * 2, `No multiplicaste por la carga del ${C.f}. Cada mmol de ${C.f} son 2 mEq.`)] : []),
      hip('QA-eq-por-meq', correcta / 1000, `Mezclaste Eq con mEq en algún paso: te salió mil veces menos volumen.`),
    ];
    const fluido = s.mantenimiento ? 'Una solución de mantenimiento con KCl' : rng.elegir(['Un modelo de plasma', 'Un modelo de suero sanguíneo']);
    const variables = { X: { nombre: `mEq/L de ${C.f} del fluido`, color: 'o' }, V: { nombre: 'volumen del fluido', color: 'i' }, p: { nombre: 'concentración del suero', color: 'h' }, x: { nombre: 'volumen de suero', color: 'd' } };
    return {
      variables, correcta, errores, unidad: 'mL',
      enunciado: [fluido, ' tiene ', v('X', `${N(X)} mEq/L de ${C.f}`), '. Se quiere un volumen de suero de ', v('p', `${S.f} al ${N(p)} % m/v`),
        ' que tenga los mismos miliequivalentes de ', C.f, ' que ', v('V', `${N(Vs)} mL`), s.mantenimiento ? ' de esa solución.' : ' de ese fluido.'],
      pregunta: ['¿Qué ', v('x', 'volumen de suero'), ' hace falta, en mL?'],
      datos: masasDe([mSal(sal)]),
      solucion: [
        ['mEq que hay que igualar: ', v('X', `${N(X)} mEq/L`), ' × ', v('V', `${N(Vs / 1000)} L`), ` = ${F(q)} mEq de ${C.f}.`],
        [v('p', `${N(p)} % m/v`), ` = ${N(10 * p)} g/L; ÷ ${N(S.M)} g/mol = ${F(10 * p / S.M)} mol/L de ${S.f}; × ${k} = ${F(porMl * 1000)} mEq/L, o sea ${F(porMl)} mEq por mL.`],
        ['Volumen: ', `${F(q)} mEq ÷ ${F(porMl)} mEq/mL = `, v('x', `${F(correcta)} mL de suero`), '.'],
      ],
      d: { tipo: 'igualar', sal, ion: 'cat', p, X, Vs },
    };
  }

  // ---------- 7. Valoración de cloruros con Ag⁺ ----------
  function precipitacion(rng) {
    const sub = rng.elegir(['precipitado', 'cloruro']);
    // Rangos realistas por muestra: agua de mesa o de pozo con poco cloruro; suero con unos 100 a 150 mEq/L.
    const muestra = rng.elegir(['del agua de un pozo', 'de un suero', 'de un agua de mesa', 'de una salmuera diluida']);
    const [lVm, lc, lVt] = muestra === 'de un suero' ? [[10], [0.1], [10, 11, 12, 13, 14, 15]]
      : muestra === 'de una salmuera diluida' ? [[10, 20, 25, 50, 100], [0.01, 0.02, 0.05, 0.1], [4, 5, 8, 10, 12, 15, 20, 25]]
      : [[50, 100], [0.01, 0.02], [4, 5, 6, 8, 10, 12, 15, 20]];
    const Vm = rng.elegir(lVm), c = rng.elegir(lc), Vt = rng.elegir(lVt);
    const r = CALC.precipitacion(Vm, c, Vt), n = r.mmol;
    let correcta, errores, unidad;
    if (sub === 'precipitado') {
      correcta = r.mgAgCl; unidad = 'mg';
      errores = [
        hip('QA-cl2-molecular', n * (108 + 71), `Escribiste el cloro como Cl₂ (y el precipitado como «AgCl₂»). En la solución hay iones cloruro, Cl⁻: Ag⁺ + Cl⁻ → AgCl, con 143,5 g/mol.`),
        hip('QA-masa-reactivo', n * M_AGNO3, `Calculaste la masa de AgNO₃ gastado, no la del precipitado. Lo que cae al fondo es AgCl.`),
        hip('QA-solo-plata', n * 108, `Contaste solo la plata del precipitado. El AgCl lleva también el cloruro: 108 + 35,5 = 143,5 g/mol.`),
        hip('QA-g-como-mg', correcta / 1000, `Te salieron gramos y los escribiste como miligramos. mmol × (mg/mmol) da mg.`),
      ];
    } else {
      correcta = r.mgL; unidad = 'mg/L';
      errores = [
        hip('QA-cl2-molecular', n * 71 * 1000 / Vm, `Usaste la masa del Cl₂ (71). En el agua no hay cloro molecular: hay iones Cl⁻, de 35,5 g/mol, uno por cada Ag⁺.`),
        hip('QA-sin-volumen-muestra', n * M_CL, `Esos son los mg de Cl⁻ de la muestra, no mg por litro. Falta dividir entre ${N(Vm / 1000)} L de muestra.`),
        hip('QA-volumen-total', n * M_CL * 1000 / (Vm + Vt), `Dividiste entre la muestra más el AgNO₃ gastado. La concentración que se pide es la de la muestra original, de ${N(Vm)} mL.`),
        hip('QA-masa-precipitado', n * M_AGCL * 1000 / Vm, `Usaste la masa molar del AgCl. Se pide el cloruro de la muestra: 35,5 mg por mmol de Cl⁻.`),
      ];
    }
    const variables = { m: { nombre: 'muestra', color: 'o' }, t: { nombre: 'AgNO₃ gastado', color: 'i' }, n: { nombre: 'mEq de Cl⁻', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
    const sol = [
      ['Ecuación iónica: ', { t: 'Ag⁺(ac) + Cl⁻(ac) → AgCl(s)', formula: true }, '. Ag⁺ y Cl⁻ tienen carga 1: mEq = mmol, y al final mEq de Ag⁺ = mEq de Cl⁻.'],
      ['mEq de Ag⁺: ', v('t', `${N(c)} mol/L × ${N(Vt)} mL`), ' = ', v('n', `${F(n)} mEq de Cl⁻`), ' en la muestra.'],
    ];
    if (sub === 'precipitado') sol.push(['Se forman ', v('n', `${F(n)} mmol`), ' de AgCl × 143,5 mg/mmol = ', v('x', `${F(correcta)} mg de AgCl`), '.']);
    else sol.push(['Masa de Cl⁻: ', v('n', `${F(n)} mmol`), ` × 35,5 = ${F(n * M_CL)} mg en `, v('m', `${N(Vm)} mL`), ` (${N(Vm / 1000)} L): `, v('x', `${F(correcta)} mg/L`), '.']);
    return {
      variables, correcta, errores, unidad,
      enunciado: [`Para medir los cloruros ${muestra} se valoran `, v('m', `${N(Vm)} mL`), ' de muestra con AgNO₃ ', v('t', `${N(c)} mol/L`), ' y se gastan ', v('t', `${N(Vt)} mL`), ' hasta que precipita todo el cloruro.'],
      pregunta: sub === 'precipitado' ? ['¿Qué ', v('x', 'masa de precipitado'), ' se forma, en mg?'] : ['¿Cuál es la ', v('x', 'concentración de cloruro'), ' de la muestra, en mg/L?'],
      datos: 'Masas molares (g/mol): Ag = 108; Cl = 35,5; AgCl = 143,5; AgNO₃ = 170.',
      solucion: sol,
      d: { tipo: 'precipitacion', sub, Vm, c, Vt },
    };
  }

  // ---------- 8. ppm en masa en agua ----------
  const CONTAM = [['plomo', [0.01, 0.02, 0.05, 0.1]], ['arsénico', [0.01, 0.02, 0.05]], ['nitrato', [10, 20, 45, 50]], ['flúor', [0.5, 1, 1.5, 2]], ['cloro libre', [0.5, 1, 2, 3]]];
  function ppmMasa(rng) {
    const sub = rng.elegir(['masa', 'masa', 'ppm']);
    const [cont, lista] = rng.elegir(CONTAM);
    const ppm = rng.elegir(lista), V = rng.elegir([50, 200, 500, 1000, 2500, 5000, 20000]);
    const lugar = rng.elegir(cont === 'cloro libre' ? ['un reservorio', 'un tanque elevado', 'una piscina'] : ['un reservorio', 'un tanque elevado', 'un pozo', 'una laguna']);
    const r = CALC.ppmMasa(ppm, V);
    const variables = { c: { nombre: 'concentración en ppm', color: 'o' }, V: { nombre: 'volumen de agua', color: 'i' }, L: { nombre: 'volumen en litros', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
    if (sub === 'masa') {
      const unidad = r.g >= 1000 ? rng.elegir(['g', 'kg']) : 'g';
      const correcta = unidad === 'g' ? r.g : r.kg;
      const errores = [
        hip('QA-m3-litros', correcta / 1000, `Tomaste los m³ como si fueran litros. 1 m³ = 1000 L: hay mil veces más agua.`),
        hip('QA-mg-g', correcta * 1000, unidad === 'g' ? `Te quedaste en miligramos: ppm × litros da mg. Para pasar a gramos se divide entre 1000.` : `Te quedaste en gramos. Para pasar a kilogramos se divide entre 1000.`),
        ...(unidad === 'kg' ? [hip('QA-mg-kg', correcta * 1e6, `Te quedaste en miligramos: ppm × litros da mg. Hasta kg hay que dividir entre un millón.`)] : []),
        hip('QA-ppm-porcentaje', correcta * 1e4, `Usaste las ppm como si fueran un porcentaje (partes por cien). Las ppm son partes por millón: 1 ppm = 1 mg por kg de agua, o 1 mg/L.`),
      ];
      return {
        variables, correcta, errores, unidad,
        enunciado: [`El agua de ${lugar} tiene `, v('c', `${N(ppm)} ppm de ${cont}`), '. El volumen de agua es ', v('V', `${N(V)} m³`), '.'],
        pregunta: ['¿Qué ', v('x', `masa de ${cont}`), ` hay disuelta, en ${unidad}?`],
        solucion: [
          ['En agua diluida, ', v('c', `${N(ppm)} ppm`), ` = ${N(ppm)} mg/L.`],
          [v('V', `${N(V)} m³`), ' × 1000 L/m³ = ', v('L', `${N(V * 1000)} L`), '.'],
          ['Masa: ', v('c', `${N(ppm)} mg/L`), ' × ', v('L', `${N(V * 1000)} L`), ` = ${F(r.mg)} mg = `, v('x', `${F(correcta)} ${unidad}`), '.'],
        ],
        d: { tipo: 'ppmMasa', sub, ppm, V, unidad },
      };
    }
    const m = r.g, correcta = ppm;
    variables.c.nombre = 'masa del contaminante';
    const errores = [
      hip('QA-m3-litros', correcta * 1000, `Tomaste los m³ como si fueran litros. 1 m³ = 1000 L: el soluto está repartido en mil veces más agua.`),
      hip('QA-mg-g', correcta / 1000, `Dejaste la masa en gramos. Las ppm en agua son mg por litro: primero pasa los gramos a miligramos.`),
      hip('QA-ppm-porcentaje', correcta / 1e4, `Calculaste un porcentaje (partes por cien), no partes por millón. Para ppm se multiplica la fracción por un millón.`),
    ];
    return {
      variables, correcta, errores, unidad: 'ppm',
      enunciado: [`En ${lugar} con `, v('V', `${N(V)} m³`), ` de agua hay `, v('c', `${N(m)} g de ${cont}`), ' disueltos.'],
      pregunta: ['¿Cuál es la ', v('x', 'concentración'), ` de ${cont}, en ppm?`],
      solucion: [
        [v('c', `${N(m)} g`), ` = ${N(m * 1000)} mg; `, v('V', `${N(V)} m³`), ' = ', v('L', `${N(V * 1000)} L`), '.'],
        [`ppm = mg/L = ${N(m * 1000)} ÷ ${N(V * 1000)} = `, v('x', `${F(correcta)} ppm`), '.'],
      ],
      d: { tipo: 'ppmMasa', sub, m, V, unidad: 'ppm' },
    };
  }

  // ---------- 9. ppm de un gas en el aire → cantidad por m³ ----------
  const CIUDADES = [['Lima', 1, [15, 20, 25, 30]], ['Arequipa', 0.75, [12, 17, 22, 27]], ['Cusco', 0.68, [7, 12, 17, 22]], ['Puno', 0.64, [2, 7, 12, 17]]];
  const FACTOR = { 'mol/m³': 1, 'mmol/m³': 1e3, 'µmol/m³': 1e6 };
  function ppmGas(rng) {
    // Concentraciones realistas: CO de tránsito en una avenida; NO₂, SO₂ y O₃ en el aire de la ciudad
    // (décimas de ppm, en µmol/m³); SO₂ a la salida de la chimenea de una fundición (mmol/m³).
    const lugar = rng.elegir(['avenida', 'avenida', 'ciudad', 'chimenea']);
    const gas = lugar === 'avenida' ? 'CO' : lugar === 'chimenea' ? 'SO2' : rng.elegir(['NO2', 'SO2', 'O3']), G = GAS[gas];
    const X = rng.elegir(lugar === 'avenida' ? [5, 10, 15, 20, 35, 50] : lugar === 'chimenea' ? [5, 10, 20, 25, 40, 50]
      : gas === 'O3' ? [0.04, 0.06, 0.08, 0.12] : [0.05, 0.1, 0.2, 0.5]);
    const [ciudad, Pr, temps] = rng.elegir(CIUDADES);
    const t = rng.elegir(temps);
    const unidad = lugar === 'avenida' ? rng.elegir(['mol/m³', 'mmol/m³']) : lugar === 'chimenea' ? 'mmol/m³' : 'µmol/m³';
    const r = CALC.ppmGas(X, t, Pr), T = t + 273;
    const correcta = r.molm3 * FACTOR[unidad];
    const menor = { 'mol/m³': 'mmol', 'mmol/m³': 'µmol', 'µmol/m³': 'nmol' }[unidad];
    const errores = [
      hip('QA-celsius', correcta * T / t, `Usaste la temperatura en °C. En PV = nRT la temperatura va en kelvin: ${t} + 273 = ${T} K.`),
      hip('QA-m3-litros', correcta / 1000, `Te salió la cantidad por litro, no por m³. 1 m³ = 1000 L: hay que multiplicar por 1000.`),
      hip('QA-mili-dos-veces', correcta * 1000, `Multiplicaste por 1000 de más al pasar de litros a m³, o te quedaste en ${menor}.`),
      hip('QA-ppm-masa-gas', (X / G.M) * 1e-3 * FACTOR[unidad], `Tomaste las ppm como masa (${N(X)} mg por m³) y dividiste entre la masa molar. En un gas, las ppm son por volumen: ${N(X)} L de ${G.f} por cada millón de litros de aire, y eso se cuenta con PV = nRT.`),
      hip('QA-R-julios', correcta * R / 8.314, `Usaste R = 8,314, que va con pascales y m³. Con la presión en atm y el volumen en litros, R = 0,082 atm·L/(mol·K).`),
    ];
    const variables = { X: { nombre: 'ppm del gas', color: 'o' }, T: { nombre: 'temperatura', color: 'i' }, P: { nombre: 'presión', color: 'h' }, x: { nombre: 'cantidad por m³', color: 'd' } };
    const naire = Pr / (R * T);
    const donde = lugar === 'avenida' ? `En una avenida de ${ciudad}, el aire tiene ` : lugar === 'chimenea' ? `Cerca de ${ciudad}, a la salida de la chimenea de una fundición, el aire tiene ` : `Un día de mucho tránsito, el aire de ${ciudad} tiene `;
    return {
      variables, correcta, errores, unidad,
      enunciado: [donde, v('X', `${N(X)} ppm (en volumen) de ${G.nombre}`), ` (${G.f}). La temperatura es `, v('T', `${N(t)} °C`), ' y la presión, ', v('P', `${N(Pr)} atm`), '.'],
      pregunta: ['¿Cuánto ', G.f, ' hay por metro cúbico de aire, en ', v('x', unidad), '?'],
      datos: `R = 0,082 atm·L/(mol·K). ${G.f} = ${G.M} g/mol.`,
      solucion: [
        ['T = ', v('T', `${N(t)} + 273 = ${T} K`), '. Moles de aire por litro: n/V = P/(RT) = ', v('P', `${N(Pr)}`), ` ÷ (0,082 × ${T}) = ${F(naire)} mol/L.`],
        [v('X', `${N(X)} ppm`), ` en volumen es una fracción molar de ${N(X)} × 10⁻⁶: ${F(naire)} × ${N(X)} × 10⁻⁶ = ${F(naire * X * 1e-6)} mol de ${G.f} por litro.`],
        [`Por m³ (1000 L): ${F(r.molm3)} mol/m³`, unidad !== 'mol/m³' ? ` = ${F(correcta)} ${unidad}` : '', '. Respuesta: ', v('x', `${F(correcta)} ${unidad}`), '.'],
      ],
      d: { tipo: 'ppmGas', lugar, gas, X, t, P: Pr, unidad },
    };
  }

  // ---------- 10. Porcentaje en volumen ----------
  const ALCOHOLES = [['un alcohol medicinal', 70], ['un pisco', 40], ['un vino', 12], ['un desinfectante', 60], ['un alcohol de farmacia', 96], ['un licor', 30]];
  function volumenPct(rng) {
    const sub = rng.elegir(['agua', 'mezcla']);
    const variables = { a: { nombre: 'primera solución', color: 'o' }, b: { nombre: 'segunda solución', color: 'i' }, s: { nombre: 'alcohol puro', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
    if (sub === 'agua') {
      const [nombre, a] = rng.elegir(ALCOHOLES), V = rng.elegir([200, 250, 500, 750, 1000]);
      const correcta = CALC.aguaEnAlcohol(V, a);
      const errores = [
        hip('QA-soluto-solvente', V * a / 100, `Calculaste el alcohol, no el agua. El ${a} % v/v es del soluto (el alcohol); el agua es el ${100 - a} % restante.`),
        hip('QA-pct-sobre-solvente', V / (1 + a / 100), `Leíste el ${a} % como «mL de alcohol por cada 100 mL de agua». El porcentaje en volumen se toma sobre 100 mL de solución.`),
        hip('QA-pct-como-mL', 100 - a, `Diste el porcentaje del agua como si fueran mL. ${100 - a} % es de ${N(V)} mL, no de 100 mL.`),
      ];
      return {
        variables, correcta, errores, unidad: 'mL',
        enunciado: ['Una botella contiene ', v('a', `${N(V)} mL de ${nombre} al ${a} % v/v`), ' (alcohol etílico y agua; toma los volúmenes como aditivos).'],
        pregunta: ['¿Cuántos mL de ', v('x', 'agua'), ' contiene?'],
        solucion: [
          [`El ${a} % v/v dice que en 100 mL de solución hay ${a} mL de alcohol. En `, v('a', `${N(V)} mL`), ': ', v('s', `${F(V * a / 100)} mL de alcohol`), '.'],
          ['El resto es agua: ', `${N(V)} − ${F(V * a / 100)} = `, v('x', `${F(correcta)} mL`), ` (el ${100 - a} %).`],
        ],
        d: { tipo: 'volumen-pct', sub, V, a },
      };
    }
    const a1 = rng.elegir([96, 70, 60, 50, 40]), a2 = rng.elegir([0, 0, 10, 12, 20]);
    const V1 = rng.elegir([100, 200, 250, 300, 500]), V2 = rng.elegir([100, 150, 200, 300, 500]);
    const correcta = CALC.mezclaVv(V1, a1, V2, a2), s = V1 * a1 / 100 + V2 * a2 / 100;
    const errores = [
      e('SO7', 'parcial', FS, (a1 + a2) / 2, `Promediaste los dos porcentajes sin mirar los volúmenes. Hay que sumar los mL de alcohol puro y dividir entre el volumen total.`),
      hip('QA-soluto-solvente', 100 - correcta, `Ese es el porcentaje de agua, no el de alcohol. El % v/v se refiere al soluto.`),
      hip('QA-un-solo-volumen', 100 * s / V1, `Dividiste el alcohol puro entre el volumen de la primera solución. Al mezclar, el alcohol queda repartido en ${N(V1)} + ${N(V2)} mL.`),
      hip('QA-suma-porcentajes', a1 + a2, `Sumaste los porcentajes. Un porcentaje no es una cantidad: al mezclar se suman mL de alcohol, no porcentajes.`),
    ].filter(x => x.valor < 100); // un % v/v de alcohol mayor que 100 no engaña a nadie
    const segunda = a2 === 0 ? `${N(V2)} mL de agua` : `${N(V2)} mL de alcohol al ${a2} % v/v`;
    return {
      variables, correcta, errores, unidad: '% v/v',
      enunciado: ['Se mezclan ', v('a', `${N(V1)} mL de alcohol al ${a1} % v/v`), ' con ', v('b', segunda), ' (toma los volúmenes como aditivos).'],
      pregunta: ['¿Cuál es el ', v('x', 'porcentaje en volumen de alcohol'), ' de la mezcla?'],
      solucion: [
        ['Alcohol puro: ', v('a', `${N(V1)} × ${a1}/100`), ...(a2 ? [' + ', v('b', `${N(V2)} × ${a2}/100`)] : [' (el agua no aporta alcohol)']), ' = ', v('s', `${F(s)} mL`), '.'],
        [`Volumen total: ${N(V1)} + ${N(V2)} = ${N(V1 + V2)} mL. % v/v = 100 × `, v('s', `${F(s)}`), ` ÷ ${N(V1 + V2)} = `, v('x', `${F(correcta)} %`), '.'],
      ],
      d: { tipo: 'volumen-pct', sub, V1, a1, V2, a2 },
    };
  }

  // ---------- 11. Jarabe: de % m/v a mol/L ----------
  function jarabe(rng) {
    const azucar = rng.elegir(['sacarosa', 'sacarosa', 'maltosa', 'lactosa', 'glucosa']), A = AZUCAR[azucar];
    const Mobj = rng.elegir(azucar === 'lactosa' ? [0.1, 0.2, 0.25, 0.5] : [0.1, 0.2, 0.25, 0.5, 0.75, 1, 1.5, 2]);
    const p = Math.round(Mobj * A.M / 10 * 1000) / 1000;
    if (A.disacarido && p > 70) return null;
    const correcta = CALC.jarabe(A.M, p);
    const errores = [
      hip('QA-pct-g-L', p / A.M, `Leíste ${N(p)} % m/v como ${N(p)} g por litro. Son ${N(p)} g por 100 mL: ${N(10 * p)} g/L.`),
      hip('QA-cien-mL-mal', 100 * p / A.M, `Pasaste 100 mL a 0,01 L. 100 mL son 0,1 L: ${N(p)} g ÷ 0,1 L = ${N(10 * p)} g/L.`),
      e('SO14', 'parcial', FS, p, `Tomaste el ${N(p)} % m/v como si fuera ${N(p)} mol/L. El porcentaje da gramos; para molaridad hay que dividir entre la masa molar.`),
      ...(A.disacarido ? [hip('BMH5', 10 * p / 360, `Sumaste dos monosacáridos (180 + 180 = 360). Al unirse sueltan una molécula de agua: ${A.f} pesa 360 − 18 = 342 g/mol.`, FB)] : []),
      e('ES18', 'parcial', FE, 10 * p / 29, `Sumaste C + H + O una sola vez (12 + 1 + 16 = 29). Cada masa atómica se multiplica por su subíndice en ${A.f}.`),
    ];
    const variables = { p: { nombre: 'porcentaje masa-volumen', color: 'o' }, g: { nombre: 'gramos por litro', color: 'i' }, M: { nombre: 'masa molar', color: 'h' }, x: { nombre: 'molaridad', color: 'd' } };
    const ctx = rng.elegir(azucar === 'lactosa' ? ['Una solución que imita el azúcar de la leche', 'Una solución de laboratorio']
      : ['Un jarabe de farmacia', 'Un jarabe para preparar refrescos', 'Un jarabe de laboratorio', ...(p <= 20 ? ['Una solución para un cultivo de levaduras'] : [])]);
    return {
      variables, correcta, errores, unidad: 'mol/L',
      enunciado: [`${ctx} tiene `, v('p', `${N(p)} % m/v de ${azucar}`), ` (${A.f}).`],
      pregunta: ['¿Cuál es su ', v('x', 'molaridad'), '?'],
      datos: 'Masas atómicas: H = 1; C = 12; O = 16.',
      solucion: [
        [v('p', `${N(p)} % m/v`), ` son ${N(p)} g en 100 mL = `, v('g', `${N(10 * p)} g/L`), '.'],
        [`Masa molar de ${A.f}: `, v('M', A.disacarido ? '12·12 + 22·1 + 11·16 = 342 g/mol' : '6·12 + 12·1 + 6·16 = 180 g/mol'), A.disacarido ? ' (dos monosacáridos de 180 menos un agua de 18).' : '.'],
        ['Molaridad: ', v('g', `${N(10 * p)} g/L`), ' ÷ ', v('M', `${A.M} g/mol`), ' = ', v('x', `${F(correcta)} mol/L`), '.'],
      ],
      d: { tipo: 'jarabe', azucar, p },
    };
  }

  // ---------- 12. Ácido de % m/v para un carbonato ----------
  const SAL_CARB = { CaCO3: { HCl: 'CaCl₂' }, Na2CO3: { HCl: '2 NaCl', H2SO4: 'Na₂SO₄' }, MgCO3: { HCl: 'MgCl₂', H2SO4: 'MgSO₄' }, K2CO3: { HCl: '2 KCl', H2SO4: 'K₂SO₄' } };
  const P_ACIDO = { HCl: [3.65, 7.3, 10, 14.6, 20], H2SO4: [4.9, 9.8, 10, 19.6, 20] };
  function carbonato(rng) {
    const carb = rng.elegir(Object.keys(CARB)), acido = carb === 'CaCO3' ? 'HCl' : rng.elegir(['HCl', 'HCl', 'H2SO4']);
    const Cb = CARB[carb], Ac = ACIDO[acido];
    const ctx = Cb.f === 'CaCO₃' ? rng.elegir(['Para quitar el sarro (CaCO₃) de una tetera', 'Para disolver un trozo de mármol (CaCO₃)']) : `En el laboratorio, para disolver una muestra de ${Cb.f}`;
    const tetera = ctx.includes('tetera');
    const n = rng.elegir([0.02, 0.05, 0.1, 0.2, 0.25]), p = rng.elegir(tetera ? [3.65, 7.3] : P_ACIDO[acido]);
    const mC = n * Cb.M;
    const correcta = CALC.carbonato(Cb.M, acido, n, p);
    const mAc = Ac.r * n * Ac.M;
    const ec = `${Cb.f} + ${acido === 'HCl' ? '2 HCl' : 'H₂SO₄'} → ${SAL_CARB[carb][acido]} + H₂O + CO₂`;
    const errores = [
      acido === 'HCl'
        ? e('ES12', 'parcial', FE, correcta / 2, `Usaste la ecuación sin balancear, 1 a 1. El carbonato necesita dos H⁺ y el HCl da uno: van 2 HCl por cada ${Cb.f}.`)
        : hip('QA-diprotico-doble', correcta * 2, `Pusiste 2 de ácido por carbonato, como con el HCl. El H₂SO₄ da dos H⁺ por molécula: basta uno por cada ${Cb.f}.`, FE),
      e('SO14', 'parcial', FS, Ac.r * n * 1000 / p, `Tomaste ${N(p)} % m/v como si fuera ${N(p)} mol/L. El % m/v son gramos de ácido en 100 mL.`),
      hip('QA-pct-g-L', correcta * 10, `Leíste ${N(p)} % m/v como ${N(p)} g por litro. Son ${N(p)} g por cada 100 mL.`),
      e('ES19', 'parcial', FE, Ac.r * mC * 100 / p, `Aplicaste los coeficientes a los gramos: tomaste ${Ac.r === 2 ? 'el doble de ' : ''}la masa del carbonato como masa de ácido. Los coeficientes cuentan moles; hay que pasar por la masa molar.`),
      ...(acido === 'H2SO4' ? [hip('QA-eq-por-mol', correcta / 2, `Dividiste entre 2 porque el H₂SO₄ es diprótico, pero eso ya está en la ecuación 1 a 1. Contar dos veces los H⁺ deja la mitad del ácido.`)] : []),
    ];
    const variables = { m: { nombre: `masa de ${Cb.f}`, color: 'o' }, p: { nombre: 'concentración del ácido', color: 'i' }, a: { nombre: 'masa de ácido', color: 'h' }, x: { nombre: 'volumen de ácido', color: 'd' } };
    return {
      variables, correcta, errores, unidad: 'mL',
      enunciado: [`${ctx} se usa ${Ac.f} al `, v('p', `${N(p)} % m/v`), '. Se quiere que reaccionen por completo ', v('m', `${N(mC)} g de ${Cb.f}`), '.'],
      pregunta: ['¿Qué ', v('x', 'volumen de ácido'), ' hace falta, en mL?'],
      datos: masasDe([`${Cb.f} = ${Cb.M}`, `${Ac.f} = ${N(Ac.M)}`]),
      solucion: [
        ['Ecuación balanceada: ', { t: ec, formula: true }, `: ${Ac.r} mol de ${Ac.f} por mol de ${Cb.f}.`],
        [v('m', `${N(mC)} g`), ` ÷ ${Cb.M} g/mol = ${N(n)} mol de ${Cb.f} → ${F(Ac.r * n)} mol de ${Ac.f} × ${N(Ac.M)} g/mol = `, v('a', `${F(mAc)} g de ${Ac.f}`), '.'],
        [v('p', `${N(p)} % m/v`), ` son ${N(p)} g en 100 mL: `, v('a', `${F(mAc)} g`), ` × 100 ÷ ${N(p)} = `, v('x', `${F(correcta)} mL`), '.'],
      ],
      d: { tipo: 'carbonato', carb, acido, n, p },
    };
  }

  const CONSTRUIR = { meq, volumen, mezcla, preparar, masa, igualar, precipitacion, ppmMasa, ppmGas, 'volumen-pct': volumenPct, jarabe, carbonato };

  return { id: ID, titulo: 'Miliequivalentes, ppm y porcentajes', generar, CALC, SALES, ION, CARB, ACIDO, AZUCAR, GAS, F };
});
