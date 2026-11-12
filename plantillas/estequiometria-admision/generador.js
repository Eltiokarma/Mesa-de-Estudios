/*
 * Generador: estequiometría de examen de admisión (minerales, calor de reacción, redox en solución,
 * hidróxidos y grasas). Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['estequiometria-admision']) y en Node (require). No usa ningún motor.
 *
 * Masas atómicas de academia: H 1, C 12, O 16, Li 7, Na 23, Mg 24, S 32, K 39, Ca 40, Cr 52, Fe 56, Cu 63,5,
 * Zn 65, Ag 108, Ba 137, Pb 207. Condiciones normales (CN): 22,4 L/mol = 22,4 m³/kmol. 1 t = 1000 kg.
 * Densidad del glicerol: 1,26 g/mL. Las respuestas no se redondean por dentro; el alumno las ve con 1 o 2
 * decimales (coma decimal).
 *
 * Funciones de cálculo (exportadas; las usa el generador y las verifica papel.json):
 *  - flotacion({ mena, conc, leyConc, leyMena?, relave?, M }) → { metalTotal, metalConc, metalRelave, leyMena,
 *    recuperacion, kmolRelave }. mena y conc en t; leyes en %; relave = t de metal que quedan en el relave (se usa
 *    si no se da leyMena). metalTotal = mena·leyMena/100 (o metalConc + relave); metalConc = conc·leyConc/100;
 *    leyMena en %; recuperacion = metalConc/metalTotal·100; kmolRelave = metalRelave·1000/M.
 *  - metalDeMineral({ mena, pct, mineral, rendimiento = 100 }) → { mineral, metal }: mena en t; pct = % del mineral
 *    en la mena; metal en kg = mena·1000·pct/100 · (átomos de metal · M metal / M mineral) · rendimiento/100.
 *  - gasPorAtomos({ masa, pureza = 100, fuente }) → { n, nGas, volumen }: masa de muestra (g o kg), n = mol (o kmol)
 *    del mineral puro, nGas = n · (átomos de S o C en la fórmula), volumen = nGas · 22,4 (L o m³).
 *  - calorReaccion({ reaccion, producto, masaProducto }) o calorReaccion({ reaccion, mA, mB, rendimiento = 100 })
 *    → { veces, limitante, Q }: veces = cuántas veces ocurre la ecuación tal como está escrita; Q = veces · |ΔH|
 *    en kJ, positivo si se libera (todas las reacciones del generador son exotérmicas). Con dos masas, veces sale
 *    del limitante (el menor n/coeficiente) por el rendimiento.
 *  - alcoholPorCromo({ reaccion, c, V }) → { nCr, nAlcohol, masa }: c = [Cr³⁺] final en mol/L; V en mL;
 *    nAlcohol = nCr · (coef. del alcohol / coef. del Cr³⁺ en la ecuación iónica); masa en g.
 *  - hidroxido({ oxido, masa }) → { nOxido, nHidroxido, masaAgua, molesIones }: óxido básico + H₂O → hidróxido
 *    (M₂O + H₂O → 2 MOH; MO + H₂O → M(OH)₂); agua en g (1 mol por mol de óxido); iones totales (cationes +
 *    OH⁻) en mol, con disociación completa.
 *  - trigliceridoPorGlicerol({ grasa, V, rendimiento = 100 }) → { masaGlicerol, nGlicerol, masaGrasa }: V mL de
 *    glicerol (C₃H₈O₃, 92 g/mol, 1,26 g/mL); 1 triglicérido da 1 glicerol; masaGrasa en g = nGlicerol · M / (η/100).
 *
 * Tipos de problema y _datos (lo que el verificador necesita para recalcular):
 *   flotacion  sub 'ley' { mena, conc, leyConc, relave, metal } → ley de la mena en %;
 *              sub 'relave' { mena, leyMena, conc, leyConc, metal } → kmol de metal en el relave;
 *              sub 'recuperacion' { mena, leyMena, conc, leyConc, metal } → recuperación en %.
 *   mineral    { mineral, mena (t), pct, rendimiento } → kg de metal.
 *   atomos     { fuente, masa, pureza, kilo } → volumen del gas en CN: m³ si kilo (masa en kg), L si no (masa en g).
 *   termo      sub 'producto' { reaccion, producto, masaProducto (g) } → kJ liberados;
 *              sub 'limitante' { reaccion, mA, mB (g), rendimiento } → kJ liberados.
 *   redox      { reaccion, c (mol/L de Cr³⁺), V (mL) } → g de alcohol oxidado.
 *   hidroxido  sub 'moles' | 'agua' | 'iones' { oxido, masa (g) } → mol de hidróxido | g de agua | mol de iones.
 *   grasa      { grasa, V (mL de glicerol), rendimiento } → g de triglicérido.
 * Ids de las tablas:
 *   metal (flotación): Cu 63,5 · Zn 65 · Pb 207 (g/mol = kg/kmol).
 *   (con argentita el enunciado habla de un concentrado, no de una mena; el cálculo es el mismo.)
 *   mineral: calcosina Cu₂S · calcopirita CuFeS₂ · galena PbS · esfalerita ZnS · hematita Fe₂O₃ · magnetita Fe₃O₄ ·
 *     argentita Ag₂S (masa molar con las masas atómicas de arriba).
 *   fuente (átomos → gas): pirita FeS₂ → SO₂ · calcopirita CuFeS₂ → SO₂ · dolomita CaMg(CO₃)₂ → CO₂ · esfalerita ZnS → SO₂ ·
 *     caliza CaCO₃ → CO₂ (todo el S o el C pasa al gas, un átomo por molécula de gas).
 *   reaccion (termo; mA es la masa del primer reactivo y mB la del segundo):
 *     agua 2 H₂ + O₂ → 2 H₂O, −572 kJ · metano CH₄ + 2 O₂ → CO₂ + 2 H₂O, −890 kJ · propano C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O,
 *     −2220 kJ · monoxido 2 CO + O₂ → 2 CO₂, −566 kJ · amoniaco N₂ + 3 H₂ → 2 NH₃, −92 kJ · etanol C₂H₅OH + 3 O₂ →
 *     2 CO₂ + 3 H₂O, −1367 kJ. En termo:producto, 'producto' es la fórmula del producto cuya masa se da.
 *   reaccion (redox, con dicromato en medio ácido; mol de alcohol : mol de Cr³⁺ en la ecuación iónica):
 *     etanol-acido C₂H₅OH → CH₃COOH, 3 : 4 · etanol-aldehido C₂H₅OH → CH₃CHO, 3 : 2 · metanol CH₃OH → HCHO, 3 : 2 ·
 *     isopropanol CH₃CHOHCH₃ → CH₃COCH₃, 3 : 2. Masas molares: etanol 46, metanol 32, 2-propanol 60.
 *   oxido: Na2O (→ 2 NaOH) · K2O (→ 2 KOH) · Li2O (→ 2 LiOH) · CaO (→ Ca(OH)₂) · BaO (→ Ba(OH)₂); en hidroxido:iones
 *     solo salen Na2O, K2O y Li2O.
 *   grasa: triestearina C₅₇H₁₁₀O₆ 890 · tripalmitina C₅₁H₉₈O₆ 806 · trioleina (trioleína) C₅₇H₁₀₄O₆ 884 (g/mol).
 * Errores: ES6, ES19, ES20 y ES21 del informe de estequiometría (todos 'parcial'); los AQ-* son hipótesis nuestras.
 * Cuando dos errores dan el mismo número, la alternativa lleva la etiqueta del que va primero en la lista; en
 * termo:limitante el orden es ES20, ES21 y luego el cálculo con el reactivo en exceso (AQ-calcula-con-exceso).
 * FIN DE LA CABECERA: con esto basta para recalcular cada caso de casos.json sin leer el código.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'estequiometria-admision';
  const FES = 'docs/investigacion/estequiometria-ideas-erroneas.md';
  const FQA = 'docs/clasificacion/trampas-admision-unmsm/quimica.md';
  const h = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente: FQA });
  const es = (id, valor, explicacion, respaldo) => ({ id, valor, explicacion, respaldo, fuente: FES });
  const v = P.v;
  const f = (x, d = 2) => P.formatear(x, d);
  const limpio = (x, d = 2) => Number.isFinite(x) && x > 0 && Math.abs(x * 10 ** d - Math.round(x * 10 ** d)) < 1e-7;
  const VN = 22.4;

  // ---------- Tablas ----------
  const METALES = {
    Cu: { s: 'Cu', nombre: 'cobre', del: 'del cobre', M: 63.5 }, Zn: { s: 'Zn', nombre: 'zinc', del: 'del zinc', M: 65 },
    Pb: { s: 'Pb', nombre: 'plomo', del: 'del plomo', M: 207 }, Fe: { s: 'Fe', nombre: 'hierro', del: 'del hierro', M: 56 }, Ag: { s: 'Ag', nombre: 'plata', del: 'de la plata', M: 108 },
  };
  // n: átomos del metal en la fórmula.
  const MINERALES = [
    { id: 'calcosina', f: 'Cu₂S', M: 159, metal: 'Cu', n: 2 },
    { id: 'calcopirita', f: 'CuFeS₂', M: 183.5, metal: 'Cu', n: 1 },
    { id: 'galena', f: 'PbS', M: 239, metal: 'Pb', n: 1 },
    { id: 'esfalerita', f: 'ZnS', M: 97, metal: 'Zn', n: 1 },
    { id: 'hematita', f: 'Fe₂O₃', M: 160, metal: 'Fe', n: 2 },
    { id: 'magnetita', f: 'Fe₃O₄', M: 232, metal: 'Fe', n: 3 },
    { id: 'argentita', f: 'Ag₂S', M: 248, metal: 'Ag', n: 2 },
  ];
  // n: átomos de S (o C) en la fórmula, que terminan en el gas.
  const FUENTES = [
    { id: 'pirita', f: 'FeS₂', M: 120, X: 'azufre', gas: 'SO₂', Mg: 64, n: 2, proceso: 'tuestan', sale: 'sale como', nombre: 'pirita', de: 'del sulfuro' },
    { id: 'calcopirita', f: 'CuFeS₂', M: 183.5, X: 'azufre', gas: 'SO₂', Mg: 64, n: 2, proceso: 'tuestan', sale: 'sale como', nombre: 'calcopirita', de: 'del sulfuro' },
    { id: 'dolomita', f: 'CaMg(CO₃)₂', M: 184, X: 'carbono', gas: 'CO₂', Mg: 44, n: 2, proceso: 'calcinan', sale: 'sale como', nombre: 'dolomita', de: 'del carbonato' },
    { id: 'esfalerita', f: 'ZnS', M: 97, X: 'azufre', gas: 'SO₂', Mg: 64, n: 1, proceso: 'tuestan', sale: 'sale como', nombre: 'esfalerita', de: 'del sulfuro' },
    { id: 'caliza', f: 'CaCO₃', M: 100, X: 'carbono', gas: 'CO₂', Mg: 44, n: 1, proceso: 'calcinan', sale: 'sale como', nombre: 'caliza', de: 'del carbonato' },
  ];
  // A + B → productos; c: coeficiente; dH en kJ por la ecuación tal como está escrita.
  const TERMO = [
    { id: 'agua', A: { f: 'H₂', M: 2, c: 2 }, B: { f: 'O₂', M: 32, c: 1 }, prods: [{ f: 'H₂O', M: 18, c: 2 }], dH: -572, contexto: 'En una celda de combustible' },
    { id: 'metano', A: { f: 'CH₄', M: 16, c: 1 }, B: { f: 'O₂', M: 32, c: 2 }, prods: [{ f: 'CO₂', M: 44, c: 1 }, { f: 'H₂O', M: 18, c: 2 }], dH: -890, contexto: 'En una cocina a gas natural' },
    { id: 'propano', A: { f: 'C₃H₈', M: 44, c: 1 }, B: { f: 'O₂', M: 32, c: 5 }, prods: [{ f: 'CO₂', M: 44, c: 3 }, { f: 'H₂O', M: 18, c: 4 }], dH: -2220, contexto: 'En la hornilla de una cocina a GLP' },
    { id: 'monoxido', A: { f: 'CO', M: 28, c: 2 }, B: { f: 'O₂', M: 32, c: 1 }, prods: [{ f: 'CO₂', M: 44, c: 2 }], dH: -566, contexto: 'En el convertidor catalítico de un auto' },
    { id: 'amoniaco', A: { f: 'N₂', M: 28, c: 1 }, B: { f: 'H₂', M: 2, c: 3 }, prods: [{ f: 'NH₃', M: 17, c: 2 }], dH: -92, contexto: 'En un reactor de amoniaco' },
    { id: 'etanol', A: { f: 'C₂H₅OH', M: 46, c: 1 }, B: { f: 'O₂', M: 32, c: 3 }, prods: [{ f: 'CO₂', M: 44, c: 2 }, { f: 'H₂O', M: 18, c: 3 }], dH: -1367, contexto: 'En un mechero de alcohol' },
  ];
  // Oxidación de un alcohol con dicromato en medio ácido. ion: ecuación iónica [coef, fórmula, carga];
  // sal: la misma reacción con las sales. alc y cr: coeficientes del alcohol y del Cr³⁺ en la iónica;
  // sal: coeficiente del Cr₂(SO₄)₃ en la molecular.
  const REDOX = [
    { id: 'etanol-acido', alcohol: 'C₂H₅OH', nombre: 'etanol', M: 46, prod: 'CH₃COOH', nombreProd: 'ácido acético', Mp: 60, alc: 3, cr: 4, sal: 2,
      ion: [[2, 'Cr₂O₇', -2], [3, 'C₂H₆O', 0], [16, 'H', 1], [-4, 'Cr', 3], [-3, 'C₂H₄O₂', 0], [-11, 'H₂O', 0]],
      molecular: [[2, 'K₂Cr₂O₇'], [3, 'C₂H₆O'], [8, 'H₂SO₄'], [-2, 'Cr₂(SO₄)₃'], [-3, 'C₂H₄O₂'], [-2, 'K₂SO₄'], [-11, 'H₂O']],
      texto: '2 K₂Cr₂O₇ + 3 C₂H₅OH + 8 H₂SO₄ → 2 Cr₂(SO₄)₃ + 3 CH₃COOH + 2 K₂SO₄ + 11 H₂O' },
    { id: 'etanol-aldehido', alcohol: 'C₂H₅OH', nombre: 'etanol', M: 46, prod: 'CH₃CHO', nombreProd: 'etanal', Mp: 44, alc: 3, cr: 2, sal: 1,
      ion: [[1, 'Cr₂O₇', -2], [3, 'C₂H₆O', 0], [8, 'H', 1], [-2, 'Cr', 3], [-3, 'C₂H₄O', 0], [-7, 'H₂O', 0]],
      molecular: [[1, 'K₂Cr₂O₇'], [3, 'C₂H₆O'], [4, 'H₂SO₄'], [-1, 'Cr₂(SO₄)₃'], [-3, 'C₂H₄O'], [-1, 'K₂SO₄'], [-7, 'H₂O']],
      texto: 'K₂Cr₂O₇ + 3 C₂H₅OH + 4 H₂SO₄ → Cr₂(SO₄)₃ + 3 CH₃CHO + K₂SO₄ + 7 H₂O' },
    { id: 'metanol', alcohol: 'CH₃OH', nombre: 'metanol', M: 32, prod: 'HCHO', nombreProd: 'metanal', Mp: 30, alc: 3, cr: 2, sal: 1,
      ion: [[1, 'Cr₂O₇', -2], [3, 'CH₄O', 0], [8, 'H', 1], [-2, 'Cr', 3], [-3, 'CH₂O', 0], [-7, 'H₂O', 0]],
      molecular: [[1, 'K₂Cr₂O₇'], [3, 'CH₄O'], [4, 'H₂SO₄'], [-1, 'Cr₂(SO₄)₃'], [-3, 'CH₂O'], [-1, 'K₂SO₄'], [-7, 'H₂O']],
      texto: 'K₂Cr₂O₇ + 3 CH₃OH + 4 H₂SO₄ → Cr₂(SO₄)₃ + 3 HCHO + K₂SO₄ + 7 H₂O' },
    { id: 'isopropanol', alcohol: 'CH₃CHOHCH₃', nombre: '2-propanol', M: 60, prod: 'CH₃COCH₃', nombreProd: 'propanona', Mp: 58, alc: 3, cr: 2, sal: 1,
      ion: [[1, 'Cr₂O₇', -2], [3, 'C₃H₈O', 0], [8, 'H', 1], [-2, 'Cr', 3], [-3, 'C₃H₆O', 0], [-7, 'H₂O', 0]],
      molecular: [[1, 'K₂Cr₂O₇'], [3, 'C₃H₈O'], [4, 'H₂SO₄'], [-1, 'Cr₂(SO₄)₃'], [-3, 'C₃H₆O'], [-1, 'K₂SO₄'], [-7, 'H₂O']],
      texto: 'K₂Cr₂O₇ + 3 CH₃CHOHCH₃ + 4 H₂SO₄ → Cr₂(SO₄)₃ + 3 CH₃COCH₃ + K₂SO₄ + 7 H₂O' },
  ];
  // nh: hidróxidos por óxido; oh: OH⁻ por hidróxido.
  const OXIDOS = [
    { id: 'Na2O', f: 'Na₂O', M: 62, hid: 'NaOH', Mh: 40, nh: 2, oh: 1, cat: 'Na⁺' },
    { id: 'K2O', f: 'K₂O', M: 94, hid: 'KOH', Mh: 56, nh: 2, oh: 1, cat: 'K⁺' },
    { id: 'Li2O', f: 'Li₂O', M: 30, hid: 'LiOH', Mh: 24, nh: 2, oh: 1, cat: 'Li⁺' },
    { id: 'CaO', f: 'CaO', M: 56, hid: 'Ca(OH)₂', Mh: 74, nh: 1, oh: 2, cat: 'Ca²⁺' },
    { id: 'BaO', f: 'BaO', M: 153, hid: 'Ba(OH)₂', Mh: 171, nh: 1, oh: 2, cat: 'Ba²⁺' },
  ];
  const GRASAS = [
    { id: 'triestearina', nombre: 'triestearina', f: 'C₅₇H₁₁₀O₆', M: 890, acido: 'ácido esteárico' },
    { id: 'tripalmitina', nombre: 'tripalmitina', f: 'C₅₁H₉₈O₆', M: 806, acido: 'ácido palmítico' },
    { id: 'trioleina', nombre: 'trioleína', f: 'C₅₇H₁₀₄O₆', M: 884, acido: 'ácido oleico' },
  ];
  const D_GLI = 1.26, M_GLI = 92;
  const buscar = (tabla, id) => { const x = tabla.find(t => t.id === id); if (!x) throw new Error(`${id}: no está en la tabla`); return x; };

  // ---------- Cálculos ----------
  function flotacion({ mena, conc, leyConc, leyMena, relave, M }) {
    const metalConc = conc * leyConc / 100;
    const metalTotal = leyMena != null ? mena * leyMena / 100 : metalConc + relave;
    const metalRelave = metalTotal - metalConc;
    return { metalTotal, metalConc, metalRelave, leyMena: metalTotal / mena * 100,
      recuperacion: metalConc / metalTotal * 100, kmolRelave: metalRelave * 1000 / M };
  }
  function metalDeMineral({ mena, pct, mineral, rendimiento = 100 }) {
    const m = typeof mineral === 'string' ? buscar(MINERALES, mineral) : mineral;
    const kgMineral = mena * 1000 * pct / 100;
    return { mineral: kgMineral, metal: kgMineral * m.n * METALES[m.metal].M / m.M * rendimiento / 100 };
  }
  function gasPorAtomos({ masa, pureza = 100, fuente }) {
    const x = typeof fuente === 'string' ? buscar(FUENTES, fuente) : fuente;
    const n = masa * pureza / 100 / x.M;
    return { n, nGas: n * x.n, volumen: n * x.n * VN };
  }
  function calorReaccion({ reaccion, producto, masaProducto, mA, mB, rendimiento = 100 }) {
    const r = typeof reaccion === 'string' ? buscar(TERMO, reaccion) : reaccion;
    if (masaProducto != null) {
      const p = r.prods.find(x => x.f === producto) || r.prods[0];
      const veces = masaProducto / p.M / p.c;
      return { veces, limitante: null, Q: veces * Math.abs(r.dH) };
    }
    const kA = mA / r.A.M / r.A.c, kB = mB / r.B.M / r.B.c;
    const veces = Math.min(kA, kB) * rendimiento / 100;
    return { veces, limitante: kA <= kB ? r.A.f : r.B.f, Q: veces * Math.abs(r.dH) };
  }
  function alcoholPorCromo({ reaccion, c, V }) {
    const r = typeof reaccion === 'string' ? buscar(REDOX, reaccion) : reaccion;
    const nCr = c * V / 1000, nAlcohol = nCr * r.alc / r.cr;
    return { nCr, nAlcohol, masa: nAlcohol * r.M };
  }
  function hidroxido({ oxido, masa }) {
    const o = typeof oxido === 'string' ? buscar(OXIDOS, oxido) : oxido;
    const nOxido = masa / o.M, nHidroxido = nOxido * o.nh;
    return { nOxido, nHidroxido, masaAgua: nOxido * 18, molesIones: nHidroxido * (1 + o.oh) };
  }
  function trigliceridoPorGlicerol({ grasa, V, rendimiento = 100 }) {
    const g = typeof grasa === 'string' ? buscar(GRASAS, grasa) : grasa;
    const masaGlicerol = V * D_GLI, nGlicerol = masaGlicerol / M_GLI;
    return { masaGlicerol, nGlicerol, masaGrasa: nGlicerol * g.M / (rendimiento / 100) };
  }

  // ---------- Armado ----------
  function generar(semilla) {
    const rng = Azar.crear(ID + '|' + semilla);
    const tipo = rng.elegir(['flotacion', 'flotacion', 'mineral', 'atomos', 'termo', 'termo', 'redox', 'hidroxido', 'grasa']);
    for (let intento = 0; intento < 3000; intento++) {
      const pr = ({ flotacion: tFlotacion, mineral: tMineral, atomos: tAtomos, termo: tTermo, redox: tRedox, hidroxido: tHidroxido, grasa: tGrasa })[tipo](rng, semilla);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  function cerrar(rng, semilla, o) {
    const dec = o.decimales ?? 2;
    const minimo = 10 ** -dec;
    const errores = o.errores.filter(e => Number.isFinite(e.valor) && (o.negativos ? Math.abs(e.valor) >= minimo : e.valor >= minimo) && Math.abs(e.valor) < 1e8);
    const alternativas = P.armar({ correcta: o.correcta, errores, rng, unidad: o.unidad, decimales: dec, texto: o.texto || null, negativos: !!o.negativos });
    return { id: `${ID}#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: o.datos || '',
      alternativas, solucion: o.solucion, respuesta: { valor: o.correcta, unidad: o.unidad }, _datos: o._datos };
  }

  // 1. Flotación: ley de la mena, metal en el relave y recuperación.
  function tFlotacion(rng, semilla) {
    const sub = rng.elegir(['ley', 'relave', 'relave', 'recuperacion']);
    const met = METALES[rng.elegir(['Cu', 'Zn', 'Pb'])];
    const mena = rng.elegir([100, 200, 250, 400, 500, 800, 1000]);
    const leyMena = rng.elegir([1.5, 2, 2.5, 3, 4, 5, 6]);
    const rec = rng.elegir([80, 85, 90, 92, 95]);
    const leyConc = rng.elegir([20, 24, 25, 28, 30, 32, 40, 50]);
    const metalTotal = mena * leyMena / 100, metalConc = metalTotal * rec / 100;
    const conc = metalConc / (leyConc / 100), relave = metalTotal - metalConc;
    if (!limpio(conc) || !limpio(relave, 3) || conc >= mena / 4) return null;
    const variables = { mena: { nombre: 'masa de mena', color: 'o' }, conc: { nombre: 'concentrado', color: 'i' },
      rel: { nombre: 'relave', color: 'h' }, ley: { nombre: 'ley', color: 'd' } };
    if (sub === 'recuperacion') { delete variables.ley; variables.rec = { nombre: 'recuperación', color: 'd' }; }
    const enConc = [v('conc', `${f(conc)} t de concentrado con ${f(leyConc)} % de ${met.s}`)];
    if (sub === 'ley') {
      const r = flotacion({ mena, conc, leyConc, relave, M: met.M });
      const correcta = r.leyMena;
      const enunciado = [`En una planta concentradora de ${met.nombre} se procesan `, v('mena', `${f(mena)} t de mena`),
        '. La flotación separa ', ...enConc, ', y en el ', v('rel', `relave quedan ${f(relave, 3)} t de ${met.s}`), '.'];
      const pregunta = ['¿Cuál es la ', v('ley', `ley de ${met.nombre} de la mena`), ' (porcentaje en masa)?'];
      const errores = [
        h('AQ-ley-sobre-concentrado', leyConc, `Diste la ley del concentrado (${f(leyConc)} %). La ley que se pide es la de la mena: el metal total dividido entre las ${f(mena)} t que entraron a la planta.`),
        h('AQ-olvida-relave', r.metalConc / mena * 100, `Contaste solo el ${met.s} del concentrado. El metal de la mena se reparte entre el concentrado y el relave: hay que sumar las ${f(relave, 3)} t que se quedaron en el relave.`),
        h('AQ-divide-entre-concentrado', r.metalTotal / conc * 100, `Dividiste el metal total entre la masa del concentrado. La ley de la mena se calcula sobre la mena: ${f(r.metalTotal, 3)} t ÷ ${f(mena)} t.`),
        h('AQ-razon-de-masas', conc / mena * 100, `Calculaste qué parte de la mena se volvió concentrado (${f(conc)} ÷ ${f(mena)}). Eso es una razón de masas, no la ley: falta el metal que hay dentro.`),
      ];
      const solucion = [
        [`${met.s} en el concentrado: `, ...enConc, ` → ${f(conc)} × ${f(leyConc / 100)} = ${f(r.metalConc, 3)} t.`],
        [`${met.s} total que traía la mena: ${f(r.metalConc, 3)} t + `, v('rel', `${f(relave, 3)} t`), ` del relave = ${f(r.metalTotal, 3)} t.`],
        [v('ley', 'Ley'), ` = ${f(r.metalTotal, 3)} t ÷ `, v('mena', `${f(mena)} t`), ' × 100 = ', v('ley', `${f(correcta)} %`), '.'],
      ];
      return cerrar(rng, semilla, { correcta, errores, unidad: '%', decimales: 2, variables, enunciado, pregunta, solucion,
        _datos: { tipo: 'flotacion', sub, mena, conc, leyConc, relave, metal: met.s } });
    }
    const r = flotacion({ mena, conc, leyConc, leyMena, M: met.M });
    const enunciado = [`Una planta procesa `, v('mena', `${f(mena)} t de mena con una ley de ${f(leyMena)} % de ${met.s}`),
      '. Por flotación se obtienen ', ...enConc, '; lo demás sale como ', v('rel', 'relave'), '.'];
    const datos = `Masa molar (g/mol = kg/kmol): ${met.s} = ${f(met.M, 1)}. 1 t = 1000 kg.`;
    if (sub === 'relave') {
      const correcta = r.kmolRelave;
      const pregunta = ['¿Cuántos kilomoles de ', met.nombre, ' quedan en el ', v('rel', 'relave'), '?'];
      const errores = [
        h('AQ-no-pasa-a-kmol', r.metalRelave * 1000, `Ese número son los kilogramos de ${met.s} del relave (${f(r.metalRelave * 1000, 1)} kg). Falta dividir entre ${f(met.M, 1)} kg/kmol para pasar a kilomoles.`),
        h('AQ-metal-del-concentrado', r.metalConc * 1000 / met.M, `Calculaste el ${met.s} que se fue con el concentrado. Lo que queda en el relave es la diferencia entre el metal de la mena y el del concentrado.`),
        h('AQ-metal-total', r.metalTotal * 1000 / met.M, `Ese es todo el ${met.s} de la mena. Una parte salió en el concentrado; hay que restarla.`),
        h('AQ-relave-con-ley-de-mena', (mena - conc) * leyMena / 100 * 1000 / met.M, `Tomaste la masa del relave (${f(mena - conc)} t) con la ley de la mena. El relave no tiene la ley de la mena: la flotación le quitó casi todo el metal.`),
        h('AQ-potencia-diez-x1000', r.metalRelave / met.M * 1000 * 1000, 'Pasaste dos veces de toneladas a kilogramos (× 1000 × 1000). 1 t son 1000 kg, y 1 kmol de metal pesa su masa molar en kilogramos.'),
      ];
      const solucion = [
        [`${met.s} en la mena: `, v('mena', `${f(mena)} t × ${f(leyMena / 100, 3)}`), ` = ${f(r.metalTotal, 3)} t.`],
        [`${met.s} en el concentrado: `, v('conc', `${f(conc)} t × ${f(leyConc / 100)}`), ` = ${f(r.metalConc, 3)} t.`],
        [v('rel', `En el relave: ${f(r.metalTotal, 3)} − ${f(r.metalConc, 3)} = ${f(r.metalRelave, 3)} t`), ` = ${f(r.metalRelave * 1000, 1)} kg.`],
        [`${f(r.metalRelave * 1000, 1)} kg ÷ ${f(met.M, 1)} kg/kmol = `, v('rel', `${f(correcta)} kmol`), '.'],
      ];
      return cerrar(rng, semilla, { correcta, errores, unidad: 'kmol', decimales: 2, variables, enunciado, pregunta, solucion, datos,
        _datos: { tipo: 'flotacion', sub, mena, leyMena, conc, leyConc, metal: met.s } });
    }
    const correcta = r.recuperacion;
    const pregunta = ['¿Qué ', v('rec', `porcentaje ${met.del}`), ' de la mena se recupera en el concentrado?'];
    const errores = [
      h('AQ-razon-de-masas', conc / mena * 100, `Dividiste la masa del concentrado entre la de la mena. La recuperación compara metal con metal: el ${met.s} del concentrado entre el ${met.s} de la mena.`),
      h('AQ-olvida-ley-mena', conc * leyConc / mena, `Dividiste el ${met.s} del concentrado entre toda la mena, sin su ley. La mena no es metal puro: solo ${f(leyMena)} % es ${met.s}.`),
      h('AQ-razon-de-leyes', leyMena / leyConc * 100, 'Comparaste las dos leyes. La recuperación compara las masas de metal, y para eso hacen falta las toneladas de cada corriente.'),
      h('AQ-da-lo-perdido', 100 - correcta, `Ese es el porcentaje del ${met.s} que se pierde en el relave. Se pide el que se recupera.`),
    ];
    const solucion = [
      [`${met.s} en la mena: `, v('mena', `${f(mena)} t × ${f(leyMena / 100, 3)}`), ` = ${f(r.metalTotal, 3)} t.`],
      [`${met.s} en el concentrado: `, v('conc', `${f(conc)} t × ${f(leyConc / 100)}`), ` = ${f(r.metalConc, 3)} t.`],
      [v('rec', 'Recuperación'), ` = ${f(r.metalConc, 3)} ÷ ${f(r.metalTotal, 3)} × 100 = `, v('rec', `${f(correcta, 1)} %`), '. El resto se va en el ', v('rel', 'relave'), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, unidad: '%', decimales: 1, variables, enunciado, pregunta, solucion, datos,
      _datos: { tipo: 'flotacion', sub, mena, leyMena, conc, leyConc, metal: met.s } });
  }

  // 2. Masa de metal desde un mineral con ley dada, con o sin rendimiento.
  function tMineral(rng, semilla) {
    const m = rng.elegir(MINERALES), met = METALES[m.metal];
    const mena = rng.elegir([10, 20, 25, 40, 50, 80, 100]);
    const pct = rng.elegir([5, 8, 10, 12, 15, 20, 25, 30, 40]);
    const rendimiento = rng.elegir([100, 100, 75, 80, 85, 90, 95]);
    const r = metalDeMineral({ mena, pct, mineral: m, rendimiento });
    const correcta = r.metal, eta = rendimiento / 100;
    const frac = m.n * met.M / m.M;
    const variables = { mena: { nombre: m.id === 'argentita' ? 'masa de concentrado' : 'masa de mena', color: 'o' }, pct: { nombre: 'porcentaje del mineral', color: 'i' },
      eta: { nombre: 'rendimiento', color: 'h' }, met: { nombre: 'masa de metal', color: 'd' } };
    const queEs = m.id === 'argentita' ? 'de un concentrado' : 'de mena';
    const enunciado = ['Se procesan ', v('mena', `${f(mena)} t ${queEs}`), ' que contiene ', v('pct', `${f(pct)} % de ${m.id} (${m.f})`),
      ...(rendimiento < 100 ? ['. El proceso recupera ', v('eta', `el ${f(rendimiento)} % ${met.del}`), '.'] : [`. Todo ${met.del.slice(3)} del mineral se recupera.`])];
    const pregunta = ['¿Cuántos kilogramos de ', v('met', met.nombre), ' se obtienen?'];
    const errores = [
      h('AQ-ley-como-metal', r.mineral * eta, `Tomaste el ${f(pct)} % como si fuera de ${met.nombre}. Es de ${m.f}: dentro del mineral, el ${met.s} es solo una parte de la masa.`),
      h('AQ-olvida-ley', mena * 1000 * frac * eta, `Usaste todo el material como si fuera ${m.f}. Solo el ${f(pct)} % es ese mineral; el resto es ganga.`),
      h('AQ-fraccion-invertida', r.mineral * m.M / (m.n * met.M) * eta, `Invertiste la fracción del metal: es ${m.n > 1 ? m.n + ' × ' : ''}${f(met.M, 1)} ÷ ${f(m.M, 1)}, menor que 1, porque el metal pesa menos que el mineral que lo contiene.`),
    ];
    if (m.n > 1) errores.unshift(es('ES6', correcta / m.n, `Contaste un solo átomo de ${met.s} por fórmula. En ${m.f} hay ${m.n}: cada mol del mineral trae ${m.n} mol de ${met.s}.`, 'parcial'));
    if (rendimiento < 100) {
      errores.push(h('AQ-olvida-rendimiento', correcta / eta, `Te olvidaste del rendimiento: el proceso solo recupera el ${f(rendimiento)} % ${met.del}.`));
      errores.push(h('AQ-rendimiento-al-reves', correcta / eta / eta, `Dividiste entre el rendimiento. Si solo se recupera el ${f(rendimiento)} %, se obtiene menos, no más: se multiplica por ${f(eta)}.`));
    }
    const solucion = [
      ['Masa de mineral: ', v('mena', `${f(mena)} t = ${f(mena * 1000)} kg`), ' × ', v('pct', f(pct / 100)), ` = ${f(r.mineral, 1)} kg de ${m.f}.`],
      [`Fracción de ${met.s} en ${m.f}: ${m.n > 1 ? m.n + ' × ' : ''}${f(met.M, 1)} ÷ ${f(m.M, 1)}. Masa de ${met.s}: ${f(r.mineral, 1)} × ${m.n > 1 ? m.n + ' × ' : ''}${f(met.M, 1)} ÷ ${f(m.M, 1)} = ${f(r.mineral * frac, 1)} kg.`],
      rendimiento < 100 ? ['Con el rendimiento: ', `${f(r.mineral * frac, 1)} × `, v('eta', f(eta)), ' = ', v('met', `${f(correcta, 1)} kg de ${met.s}`), '.']
        : ['Como todo se recupera: ', v('met', `${f(correcta, 1)} kg de ${met.s}`), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, unidad: 'kg', decimales: 1, variables, enunciado, pregunta, solucion,
      datos: `Masas molares (g/mol): ${m.f} = ${f(m.M, 1)}; ${met.s} = ${f(met.M, 1)}.`,
      _datos: { tipo: 'mineral', mineral: m.id, mena, pct, rendimiento } });
  }

  // 3. Conservación de átomos sin ecuación: todo el S (o C) del mineral termina en el gas.
  function tAtomos(rng, semilla) {
    const x = rng.elegir([...FUENTES.filter(t => t.n > 1), ...FUENTES.filter(t => t.n > 1), ...FUENTES.filter(t => t.n === 1)]);
    const kilo = rng.moneda();
    const n = rng.elegir([0.25, 0.5, 1, 1.5, 2, 2.5, 4, 5]) * (kilo ? 10 : 1);
    const pureza = rng.elegir([100, 90, 80, 75, 60, 50]);
    const masa = n * x.M / (pureza / 100);
    if (!limpio(masa, 1)) return null;
    const r = gasPorAtomos({ masa, pureza, fuente: x });
    const correcta = r.volumen;
    const um = kilo ? 'kg' : 'g', uv = kilo ? 'm³' : 'L', umol = kilo ? 'kmol' : 'mol';
    const variables = { m: { nombre: 'masa de la muestra', color: 'o' }, p: { nombre: 'pureza', color: 'i' },
      at: { nombre: `átomos de ${x.X === 'azufre' ? 'S' : 'C'} por fórmula`, color: 'h' }, V: { nombre: `volumen de ${x.gas}`, color: 'd' } };
    const s = x.X === 'azufre' ? 'S' : 'C';
    const enunciado = pureza < 100
      ? ['Se ', x.proceso, ' ', v('m', `${f(masa, 1)} ${um} de un mineral`), ' con ', v('p', `${f(pureza)} % de ${x.nombre} (${x.f})`), `. Todo el ${x.X} ${x.de} ${x.sale} ${x.gas}.`]
      : ['Se ', x.proceso, ' ', v('m', `${f(masa, 1)} ${um} de ${x.nombre}`), ' ', v('p', `pura (${x.f})`), `. Todo el ${x.X} ${x.de} ${x.sale} ${x.gas}.`];
    const pregunta = ['¿Qué ', v('V', `volumen de ${x.gas}`), ` se obtiene, medido en condiciones normales, en ${uv}?`];
    const errores = [
      h('AQ-olvida-pureza', correcta / (pureza / 100), `Usaste toda la muestra como si fuera ${x.f}. Solo el ${f(pureza)} % lo es.`),
      es('ES19', masa * pureza / 100 / x.Mg * VN, `Dividiste la masa del mineral entre la masa molar del ${x.gas}. Primero se cuentan los moles del mineral con su propia masa molar (${f(x.M, 1)}); luego, los átomos de ${s} que pasan al gas.`, 'parcial'),
      h('AQ-masa-como-volumen', r.nGas * x.Mg, `Calculaste la masa del ${x.gas} (en ${um}), no su volumen. En condiciones normales, cada ${umol} de gas ocupa 22,4 ${uv}.`),
    ];
    if (pureza === 100) errores[0] = h('AQ-divide-entre-22-4', r.nGas / VN, `Dividiste entre 22,4. El volumen molar multiplica: cada ${umol} de gas ocupa 22,4 ${uv}.`);
    if (x.n > 1) errores.unshift(es('ES6', correcta / x.n, `Contaste un solo átomo de ${s} por fórmula. En ${x.f} hay ${x.n}: cada ${umol} de mineral da ${x.n} ${umol} de ${x.gas}.`, 'parcial'));
    if (kilo) errores.push(h('AQ-potencia-diez-x1000', correcta * 1000, `Ese número son litros: los ${f(r.nGas)} kmol son ${f(r.nGas * 1000)} mol, y por 22,4 L dan litros. En m³, 1 kmol ocupa 22,4 m³.`));
    else errores.push(h('AQ-potencia-diez-entre1000', correcta / 1000, 'Pasaste a m³ un volumen que ya estaba en litros. Con gramos y mol, el volumen molar es 22,4 L/mol.'));
    const solucion = [
      [pureza < 100 ? [v('m', `${f(masa, 1)} ${um}`), ' × ', v('p', f(pureza / 100)), ` = ${f(masa * pureza / 100, 1)} ${um} de ${x.f}; `] : [v('m', `${f(masa, 1)} ${um}`), ` de ${x.f}; `],
        `÷ ${f(x.M, 1)} = ${f(r.n)} ${umol} de ${x.f}.`].flat(),
      [`Cada ${x.f} tiene `, v('at', `${x.n} ${x.n > 1 ? 'átomos' : 'átomo'} de ${s}`), `, y cada ${x.gas} lleva uno: ${f(r.n)} × `, v('at', String(x.n)), ` = ${f(r.nGas)} ${umol} de ${x.gas}.`],
      [`${f(r.nGas)} ${umol} × 22,4 ${uv}/${umol} = `, v('V', `${f(correcta)} ${uv}`), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, unidad: uv, decimales: 2, variables, enunciado, pregunta, solucion,
      datos: `Masas molares (g/mol): ${x.f} = ${f(x.M, 1)}; ${x.gas} = ${x.Mg}. En CN, 1 mol de gas ocupa 22,4 L (1 kmol, 22,4 m³).`,
      _datos: { tipo: 'atomos', fuente: x.id, masa, pureza, kilo } });
  }

  // 4. Termoquímica: calor según la cantidad de producto, o con limitante y rendimiento.
  const textoCalor = x => (x > 0 ? 'Se liberan ' : 'Se absorben ') + f(Math.abs(x), 1) + ' kJ';
  const ecuacionTermo = r => {
    const t = s => (s.c > 1 ? s.c + ' ' : '') + s.f;
    return `${t(r.A)} + ${t(r.B)} → ${r.prods.map(x => t(x) + (x.f === 'H₂O' ? '(l)' : '')).join(' + ')}   ΔH = −${f(Math.abs(r.dH))} kJ`;
  };
  function tTermo(rng, semilla) {
    const r = rng.elegir(TERMO), dH = Math.abs(r.dH);
    const sub = rng.elegir(['producto', 'limitante', 'limitante']);
    const variables = { mA: { nombre: `masa de ${r.A.f}`, color: 'o' }, mB: { nombre: `masa de ${r.B.f}`, color: 'i' },
      mP: { nombre: 'masa de producto', color: 'h' }, Q: { nombre: 'calor', color: 'd' } };
    const pregunta = ['¿Cuánta ', v('Q', 'energía'), ' se intercambia, y se libera o se absorbe?'];
    if (sub === 'producto') {
      const p = rng.elegir(r.prods.filter(x => x.c > 1));
      const k = rng.elegir([0.25, 0.5, 1.5, 2, 2.5, 3, 4]);
      const masaProducto = k * p.c * p.M;
      const c = calorReaccion({ reaccion: r, producto: p.f, masaProducto });
      const correcta = c.Q, nP = masaProducto / p.M;
      const enunciado = [`${r.contexto} ocurre la reacción `, { t: ecuacionTermo(r), formula: true }, '. Se forman ', v('mP', `${f(masaProducto, 1)} g de ${p.f}`), '.'];
      const errores = [
        h('AQ-dh-negativo-absorbe', -correcta, 'El valor está bien, pero el sentido no: ΔH negativo quiere decir que los productos tienen menos energía que los reactivos. La diferencia sale al ambiente: se libera.'),
        h('AQ-calor-sin-coeficiente', nP * dH, `Multiplicaste los ${f(nP)} mol de ${p.f} por ${f(dH)} kJ. Esos ${f(dH)} kJ corresponden a la ecuación completa, que forma ${p.c} mol de ${p.f}: hay que dividir entre ${p.c}.`),
        h('AQ-calor-de-la-ecuacion', dH, `Diste el ΔH de la ecuación tal cual. Ese valor es para ${p.c} mol de ${p.f}; aquí se forman ${f(nP)} mol.`),
        h('AQ-dh-negativo-absorbe-sin-coeficiente', -nP * dH, `Dos errores juntos: no dividiste entre el coeficiente ${p.c} y leíste el ΔH negativo como energía absorbida.`),
        h('AQ-dh-entre-moles', dH / nP, `Dividiste ${f(dH)} kJ entre los moles. El calor es proporcional a lo que reacciona: más producto, más calor.`),
      ];
      const solucion = [
        [v('mP', `${f(masaProducto, 1)} g de ${p.f}`), ` ÷ ${p.M} g/mol = ${f(nP)} mol.`],
        [`La ecuación forma ${p.c} mol de ${p.f}: ocurre ${f(nP)} ÷ ${p.c} = ${f(c.veces)} veces.`],
        [`Calor: ${f(c.veces)} × ${f(dH)} kJ = ${f(correcta, 1)} kJ. Como ΔH < 0, `, v('Q', `se liberan ${f(correcta, 1)} kJ`), '.'],
      ];
      return cerrar(rng, semilla, { correcta, errores, unidad: 'kJ', decimales: 1, texto: textoCalor, negativos: true, variables, enunciado, pregunta, solucion,
        datos: `Masa molar: ${p.f} = ${p.M} g/mol.`, _datos: { tipo: 'termo', sub, reaccion: r.id, producto: p.f, masaProducto } });
    }
    // Con limitante y rendimiento. La mitad de las veces, el que tiene menos moles NO es el limitante.
    const trampa = rng.moneda();
    const VECES = [0.5, 1, 1.5, 2, 2.5, 3, 4, 5];
    let kA, kB, ok = false;
    for (let i = 0; i < 200 && !ok; i++) {
      const a = rng.elegir(VECES), b = rng.elegir(VECES);
      if (a === b) continue;
      const nA = a * r.A.c, nB = b * r.B.c;
      if (nA === nB) continue;
      if (((nA < nB) !== (a < b)) !== trampa) continue;
      [kA, kB, ok] = [a, b, true];
    }
    if (!ok) return null;
    const mA = kA * r.A.c * r.A.M, mB = kB * r.B.c * r.B.M;
    const rendimiento = rng.elegir([100, 75, 80, 90]), eta = rendimiento / 100;
    const c = calorReaccion({ reaccion: r, mA, mB, rendimiento });
    const correcta = c.Q;
    const lim = kA < kB ? 'A' : 'B', exc = lim === 'A' ? 'B' : 'A';
    const nA = mA / r.A.M, nB = mB / r.B.M;
    const menosMoles = nA < nB ? 'A' : 'B';
    const menorCoef = r.A.c < r.B.c ? 'A' : r.B.c < r.A.c ? 'B' : null;
    const kDe = x => (x === 'A' ? kA : kB);
    const enunciado = [`${r.contexto} ocurre la reacción `, { t: ecuacionTermo(r), formula: true }, '. Se mezclan ',
      v('mA', `${f(mA, 1)} g de ${r.A.f}`), ' con ', v('mB', `${f(mB, 1)} g de ${r.B.f}`),
      rendimiento < 100 ? `, y la reacción tiene un rendimiento de ${rendimiento} %.` : ', y la reacción es completa.'];
    const errores = [
      h('AQ-dh-negativo-absorbe', -correcta, 'El valor está bien, pero ΔH negativo significa que la reacción libera energía al ambiente; no la absorbe.'),
      h('AQ-calcula-con-exceso', kDe(exc) * eta * dH, `Calculaste con el ${r[exc].f}, que está en exceso. La reacción se detiene cuando se acaba el ${r[lim].f}.`),
    ];
    if (menorCoef && menorCoef !== lim && menorCoef !== menosMoles) errores.splice(1, 0, es('ES21', kDe(menorCoef) * eta * dH, `Tomaste como limitante al ${r[menorCoef].f} porque su coeficiente es el menor. El coeficiente es la receta; hay que compararla con lo que de verdad hay.`, 'parcial'));
    if (menosMoles !== lim) errores.unshift(es('ES20', kDe(menosMoles) * eta * dH, `Tomaste como limitante al ${r[menosMoles].f} porque hay menos moles (${f(menosMoles === 'A' ? nA : nB)} contra ${f(menosMoles === 'A' ? nB : nA)}). Antes de comparar hay que dividir cada cantidad entre su coeficiente.`, 'parcial'));
    if (rendimiento < 100) {
      errores.push(h('AQ-olvida-rendimiento', correcta / eta, `Te olvidaste del rendimiento: solo reacciona el ${rendimiento} % de lo que permite el limitante.`));
      errores.push(h('AQ-rendimiento-al-reves', correcta / eta / eta, `Dividiste entre el rendimiento. Con un rendimiento de ${rendimiento} % reacciona menos y sale menos calor: se multiplica por ${f(eta)}.`));
    }
    errores.push(h('AQ-calor-sin-coeficiente', (lim === 'A' ? nA : nB) * eta * dH, `Multiplicaste los moles del ${r[lim].f} por ${f(dH)} kJ, sin dividir entre su coeficiente ${r[lim].c}. El ΔH es para la ecuación completa.`));
    const solucion = [
      ['Moles: ', v('mA', `${f(mA, 1)} g`), ` ÷ ${r.A.M} = ${f(nA)} mol de ${r.A.f}; `, v('mB', `${f(mB, 1)} g`), ` ÷ ${r.B.M} = ${f(nB)} mol de ${r.B.f}.`],
      [`Entre los coeficientes: ${f(nA)} ÷ ${r.A.c} = ${f(kA)} y ${f(nB)} ÷ ${r.B.c} = ${f(kB)}. El limitante es el ${r[lim].f}${menosMoles !== lim ? ', aunque tenga más moles' : ''}.`],
      [`La ecuación ocurre ${f(Math.min(kA, kB))}${rendimiento < 100 ? ` × ${f(eta)} = ${f(c.veces, 3)}` : ''} veces: ${f(c.veces, 3)} × ${f(dH)} kJ = `, v('Q', `se liberan ${f(correcta, 1)} kJ`), ' (ΔH < 0).'],
    ];
    return cerrar(rng, semilla, { correcta, errores, unidad: 'kJ', decimales: 1, texto: textoCalor, negativos: true, variables, enunciado, pregunta, solucion,
      datos: `Masas molares (g/mol): ${r.A.f} = ${r.A.M}; ${r.B.f} = ${r.B.M}.`, _datos: { tipo: 'termo', sub, reaccion: r.id, mA, mB, rendimiento } });
  }

  // 5. Redox en solución: masa de alcohol desde la concentración final de Cr³⁺.
  function tRedox(rng, semilla) {
    const r = rng.elegir(REDOX);
    const c = rng.elegir([0.05, 0.08, 0.1, 0.12, 0.15, 0.2, 0.25, 0.3, 0.4]);
    const V = rng.elegir([100, 150, 200, 250, 300, 400, 500]);
    const x = alcoholPorCromo({ reaccion: r, c, V });
    const correcta = x.masa;
    const variables = { c: { nombre: 'concentración de Cr³⁺', color: 'o' }, V: { nombre: 'volumen de solución', color: 'i' },
      k: { nombre: 'coeficientes', color: 'h' }, m: { nombre: `masa de ${r.nombre}`, color: 'd' } };
    const enunciado = [`Un poco de ${r.nombre} se oxida con dicromato de potasio en exceso, en medio ácido: `, { t: r.texto, formula: true },
      '. Al terminar, los ', v('V', `${V} mL de solución`), ' tienen ', v('c', `[Cr³⁺] = ${f(c)} mol/L`), '.'];
    const pregunta = ['¿Qué ', v('m', `masa de ${r.nombre}`), ' se oxidó?'];
    const errores = [
      h('AQ-coeficiente-de-la-sal', c * V / 1000 * r.alc / r.sal * r.M, `Usaste el coeficiente del Cr₂(SO₄)₃ (${r.sal}) como si fuera el del Cr³⁺. Cada Cr₂(SO₄)₃ da 2 iones Cr³⁺: por ${r.alc} mol de ${r.nombre} se forman ${r.cr} mol de Cr³⁺.`),
      h('AQ-sin-coeficientes', c * V / 1000 * r.M, `Tomaste un mol de ${r.nombre} por cada mol de Cr³⁺. La ecuación dice ${r.alc} a ${r.cr}.`),
      h('AQ-razon-invertida', c * V / 1000 * r.cr / r.alc * r.M, `Invertiste la proporción: son ${r.alc} mol de ${r.nombre} por cada ${r.cr} mol de Cr³⁺, no al revés.`),
      h('AQ-ml-sin-pasar', correcta * 1000, `Multiplicaste la concentración por ${V} sin pasar los mL a litros. La molaridad es mol por litro: ${V} mL = ${f(V / 1000, 3)} L.`),
      h('AQ-masa-del-producto-molar', x.nAlcohol * r.Mp, `Los moles están bien, pero los pasaste a gramos con la masa molar del ${r.nombreProd} (${r.Mp}). Se pide la masa del ${r.nombre} (${r.M} g/mol).`),
    ];
    const solucion = [
      ['Moles de Cr³⁺: ', v('c', `${f(c)} mol/L`), ' × ', v('V', `${f(V / 1000, 3)} L`), ` = ${f(x.nCr, 4)} mol.`],
      [`Cada Cr₂(SO₄)₃ tiene 2 Cr³⁺: por `, v('k', `${r.alc} ${r.alcohol}`), ' se forman ', v('k', `${r.cr} Cr³⁺`), '.'],
      [`${r.nombre[0].toUpperCase() + r.nombre.slice(1)}: ${f(x.nCr, 4)} × `, v('k', `${r.alc}/${r.cr}`), ` = ${f(x.nAlcohol, 4)} mol × ${r.M} g/mol = `, v('m', `${f(correcta)} g`), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, unidad: 'g', decimales: 2, variables, enunciado, pregunta, solucion,
      datos: `Masas molares (g/mol): ${r.alcohol} = ${r.M}; ${r.prod} = ${r.Mp}.`, _datos: { tipo: 'redox', reaccion: r.id, c, V } });
  }

  // 6. Hidróxido desde la masa del óxido: moles, agua e iones.
  function tHidroxido(rng, semilla) {
    const sub = rng.elegir(['moles', 'agua', 'iones']);
    const o = rng.elegir(sub === 'iones' ? OXIDOS.filter(x => x.nh === 2) : OXIDOS);
    const n = rng.elegir([0.2, 0.25, 0.4, 0.5, 1, 1.5, 2, 2.5, 3]);
    const masa = n * o.M;
    const x = hidroxido({ oxido: o, masa });
    const variables = { m: { nombre: `masa de ${o.f}`, color: 'o' }, k: { nombre: 'coeficientes', color: 'h' },
      w: { nombre: 'agua', color: 'i' }, r: { nombre: 'lo que se pide', color: 'd' } };
    const ec = o.nh === 2 ? `${o.f} + H₂O → 2 ${o.hid}` : `${o.f} + H₂O → ${o.hid}`;
    const dis = o.oh === 1 ? `${o.hid} → ${o.cat} + OH⁻` : `${o.hid} → ${o.cat} + 2 OH⁻`;
    const enunciado = ['Se agregan ', v('m', `${f(masa, 2)} g de ${o.f}`), ` a agua suficiente. El óxido reacciona con el `, v('w', 'agua'), ` y forma ${o.hid}`,
      sub === 'iones' ? ', que se disocia por completo.' : '.'];
    const paso1 = [v('m', `${f(masa, 2)} g`), ` ÷ ${o.M} g/mol = ${f(x.nOxido)} mol de ${o.f}. Ecuación: `, v('k', ec), '.'];
    let correcta, unidad, pregunta, errores, solucion;
    if (sub === 'moles') {
      correcta = x.nHidroxido; unidad = 'mol';
      pregunta = ['¿Cuántos ', v('r', `mol de ${o.hid}`), ' se forman?'];
      errores = [
        o.nh === 2 ? es('ES19', masa / o.Mh, `Dividiste la masa del ${o.f} entre la masa molar del ${o.hid}. Primero se cuentan los moles del óxido con su propia masa molar (${o.M}).`, 'parcial')
          : h('AQ-masa-molar-ajena-y-cuenta-oh', masa / o.Mh * 2, `Dos errores: dividiste la masa del ${o.f} entre la masa molar del ${o.hid} y además contaste los OH⁻. Los moles del óxido salen con su propia masa molar (${o.M}), y cada ${o.f} da un solo ${o.hid}.`),
        h('AQ-masa-del-producto-en-vez-de-moles', x.nHidroxido * o.Mh, `Esa es la masa del ${o.hid} en gramos. Se piden los moles.`),
      ];
      if (o.nh === 2) {
        errores.push(h('AQ-sin-balancear', x.nOxido, `Tomaste un ${o.hid} por cada ${o.f}. Balancea: el ${o.f} tiene 2 átomos de ${o.hid.slice(0, -2)}, así que da 2 ${o.hid}.`));
        errores.push(h('AQ-razon-invertida', x.nOxido / 2, `Invertiste el coeficiente: 1 mol de ${o.f} da 2 mol de ${o.hid}, no medio mol.`));
      } else {
        errores.push(h('AQ-cuenta-oh', x.nOxido * 2, `Contaste los moles de OH⁻ (dos por fórmula), no los de ${o.hid}. Cada ${o.f} da un solo ${o.hid}.`));
        errores.push(h('AQ-masa-entre-agua', masa / 18, 'Dividiste la masa del óxido entre la masa molar del agua. Cada sustancia se pasa a moles con su propia masa molar.'));
      }
      solucion = [paso1, ['Por cada ', v('k', `${o.f}`), ' se forma', o.nh === 2 ? 'n ' : ' ', v('k', `${o.nh} ${o.hid}`), `: ${f(x.nOxido)} × ${o.nh} = `, v('r', `${f(correcta)} mol`), '.']];
    } else if (sub === 'agua') {
      correcta = x.masaAgua; unidad = 'g';
      pregunta = ['¿Qué masa de ', v('w', 'agua'), ' reacciona?'];
      errores = [
        h('AQ-agua-por-oh', x.nOxido * 2 * 18, `Pusiste un H₂O por cada OH⁻. Basta uno por ${o.f}: el H₂O aporta un O y dos H, y con el O del óxido se forman los dos OH⁻.`),
        h('AQ-moles-como-masa', x.nOxido, 'Diste los moles de agua. Se pide la masa: se multiplica por 18 g/mol.'),
        h('AQ-masa-del-producto-en-vez-de-agua', x.nHidroxido * o.Mh, `Esa es la masa del ${o.hid} que se forma, no la del agua que reacciona.`),
        h('AQ-misma-masa', masa, `Pusiste la misma masa de agua que de óxido. Los coeficientes son de moles, no de gramos: 1 mol de ${o.f} (${o.M} g) con 1 mol de agua (18 g).`),
      ];
      solucion = [paso1, ['Por cada mol de óxido reacciona ', v('w', '1 mol de agua'), `: ${f(x.nOxido)} mol × 18 g/mol = `, v('w', `${f(correcta, 1)} g de agua`), '.'],
        [`Control: masa de ${o.hid} − masa de ${o.f} = ${f(x.nHidroxido * o.Mh, 1)} − ${f(masa, 2)} = ${f(correcta, 1)} g.`]];
    } else {
      correcta = x.molesIones; unidad = 'mol de iones';
      pregunta = ['¿Cuántos ', v('r', 'moles de iones'), ` en total (${o.cat} y OH⁻) quedan en la solución?`];
      errores = [
        h('AQ-solo-aniones', x.nHidroxido, 'Contaste solo los OH⁻. Al disociarse, cada fórmula suelta también su catión, y se piden todos los iones.'),
        h('AQ-oxido-disociado', x.nOxido * 3, `Disociaste el óxido como si diera 2 ${o.cat} y un O²⁻. En agua se forma ${o.hid}, y lo que se disocia es el hidróxido: ${dis}.`),
        h('AQ-cuenta-oxido', x.nOxido, `Contaste los moles de ${o.f}, no los iones. Cada ${o.f} da 2 ${o.hid}, y cada ${o.hid} da 2 iones.`),
        h('AQ-cuenta-atomos', x.nHidroxido * 3, `Contaste átomos (${o.cat.replace('⁺', '')}, O y H). El OH⁻ es un solo ion: cada ${o.hid} da 2 iones.`),
      ];
      solucion = [paso1, [`Se forman ${f(x.nHidroxido)} mol de ${o.hid}. Disociación: `, v('k', dis), `: ${1 + o.oh} iones por fórmula.`],
        [`${f(x.nHidroxido)} × ${1 + o.oh} = `, v('r', `${f(correcta)} mol de iones`), '.']];
    }
    return cerrar(rng, semilla, { correcta, errores, unidad, decimales: 2, variables, enunciado, pregunta, solucion,
      datos: `Masas molares (g/mol): ${o.f} = ${o.M}; ${o.hid} = ${o.Mh}; H₂O = 18.`, _datos: { tipo: 'hidroxido', sub, oxido: o.id, masa } });
  }

  // 7. Hidrólisis de un triglicérido: masa de grasa para un volumen de glicerol.
  function tGrasa(rng, semilla) {
    const g = rng.elegir(GRASAS);
    const V = rng.elegir([20, 25, 40, 50, 60, 75, 80, 100, 120, 150, 200]);
    const rendimiento = rng.elegir([100, 100, 80, 90]);
    const x = trigliceridoPorGlicerol({ grasa: g, V, rendimiento });
    const correcta = x.masaGrasa, eta = rendimiento / 100;
    const variables = { V: { nombre: 'volumen de glicerol', color: 'o' }, d: { nombre: 'densidad', color: 'i' },
      eta: { nombre: 'rendimiento', color: 'h' }, m: { nombre: 'masa de grasa', color: 'd' } };
    const enunciado = [`La hidrólisis de la ${g.nombre} (${g.f}) da glicerol (C₃H₈O₃) y ${g.acido}. Se quiere obtener `, v('V', `${V} mL de glicerol`),
      ' (', v('d', 'densidad 1,26 g/mL'), ')', rendimiento < 100 ? [' y la hidrólisis rinde ', v('eta', `${rendimiento} %`), '.'] : '.'].flat();
    const pregunta = ['¿Qué ', v('m', `masa de ${g.nombre}`), ' se necesita?'];
    const errores = [
      h('AQ-volumen-como-masa', V / M_GLI * g.M / eta, `Usaste los ${V} mL como si fueran gramos. Primero se pasa a masa con la densidad: ${V} mL × 1,26 g/mL.`),
      h('AQ-divide-densidad', V / D_GLI / M_GLI * g.M / eta, 'Dividiste entre la densidad. La masa es volumen por densidad: m = V × d.'),
      h('AQ-tres-gliceroles', correcta / 3, `Tomaste tres gliceroles por triglicérido. Son tres ácidos grasos y un solo glicerol: el glicerol es el esqueleto que une las tres cadenas.`),
      h('AQ-tres-trigliceridos', correcta * 3, 'Pusiste tres triglicéridos por cada glicerol. Cada triglicérido tiene un glicerol; el 3 de la ecuación es del agua y de los ácidos grasos.'),
      h('AQ-masa-de-glicerol', x.masaGlicerol, 'Esa es la masa del glicerol. Se pide la de la grasa que hay que hidrolizar.'),
    ];
    if (rendimiento < 100) errores.splice(2, 0, h('AQ-rendimiento-al-reves', correcta * eta * eta, `Multiplicaste por el rendimiento. Si solo rinde el ${rendimiento} %, hace falta más grasa: se divide entre ${f(eta)}.`));
    const solucion = [
      ['Masa de glicerol: ', v('V', `${V} mL`), ' × ', v('d', '1,26 g/mL'), ` = ${f(x.masaGlicerol, 1)} g; ÷ 92 g/mol = ${f(x.nGlicerol, 3)} mol.`],
      [`Un triglicérido da un glicerol: hacen falta ${f(x.nGlicerol, 3)} mol de ${g.nombre} × ${g.M} g/mol = ${f(x.nGlicerol * g.M, 1)} g.`],
      rendimiento < 100 ? ['Con el rendimiento: ', `${f(x.nGlicerol * g.M, 1)} ÷ `, v('eta', f(eta)), ' = ', v('m', `${f(correcta, 1)} g`), '.'] : ['Respuesta: ', v('m', `${f(correcta, 1)} g`), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, unidad: 'g', decimales: 1, variables, enunciado, pregunta, solucion,
      datos: `Masas molares (g/mol): ${g.f} = ${g.M}; C₃H₈O₃ = 92.`, _datos: { tipo: 'grasa', grasa: g.id, V, rendimiento } });
  }

  return { id: ID, titulo: 'Estequiometría de examen: minerales, calor y átomos', generar,
    flotacion, metalDeMineral, gasPorAtomos, calorReaccion, alcoholPorCromo, hidroxido, trigliceridoPorGlicerol,
    METALES, MINERALES, FUENTES, TERMO, REDOX, OXIDOS, GRASAS };
});
