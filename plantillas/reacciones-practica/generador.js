/*
 * Generador «Reacciones y balance» (reacciones-practica), formato "predicciones" (docs/arquitectura.md). Práctica por idea de
 * quimica.reacciones-y-balance (docs/etapa9/propuesta-quimica.md §9). Funciona en el navegador
 * (window.Generadores['reacciones-practica']) y en Node (require). No usa la teoría ni el motor de la escena: trae su banco
 * de ecuaciones ya balanceadas, con los EO y los electrones escritos; la prueba (generador.test.js) rehace cada número con
 * el motor de plantillas/balance-reacciones y con un conteo propio de átomos y cargas.
 *
 * Tipos por idea (TIPOS_POR_IDEA; nivel 1 un paso, 2 dos pasos, 3 de examen). generar(semilla, { idea }) da solo los de
 * esa idea; sin idea, las seis con el mismo peso.
 *   indicios        hubo (1) · indicio (2) · estados-vf (3)
 *   clasificar      forma (1) · calor (2) · dos-etiquetas (3)
 *   tanteo          coeficiente (1) · suma (2) · fraccion (3)
 *   oxida-reduce    agente (1) · salto (2) · es-redox (3)
 *   cambio-eo       e-unidad (1) · coef-agente (2) · suma-redox (3)
 *   ion-electron    agua (1) · electrones (2) · global (3)
 * Colores (los de la unidad): coeficiente violeta, EO naranja, electrones turquesa, carga carmín.
 * Errores: ES11, ES12 y ES14 (estequiometria-ideas-erroneas.md), EC9 y EC11 (equilibrio-acidos-electroquimica), MA1 a MA8
 * (quimica-materia-nomenclatura-organica), S-SUM, S-IGN, N-CAR y W-CAR (investigación de la etapa 9, por verificar) y los
 * QM- y H- de la teoría (hipótesis). Cada explicación empieza por lo que el alumno hizo bien y da el valor de su error.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar, nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'reacciones-practica', UNIDAD = 'quimica.reacciones-y-balance';
  const VARS = { f: { nombre: 'coeficiente', color: 'f' }, o: { nombre: 'estado de oxidación', color: 'o' }, i: { nombre: 'electrones', color: 'i' }, h: { nombre: 'carga', color: 'h' } };
  const v = P.v;
  const SUBS = '₀₁₂₃₄₅₆₇₈₉', SUPS = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  // «MnO4^-» → «MnO₄⁻»; «Ca(OH)2(s)» → «Ca(OH)₂(s)».
  function bonita(t) {
    const m = String(t).match(/^(.*?)(?:\^(\d*)([+-]))?(\((?:s|l|g|ac)\))?$/);
    const cuerpo = m[1].replace(/([A-Za-z)])(\d+)/g, (x, a, d) => a + d.split('').map(c => SUBS[+c]).join(''));
    const carga = m[3] ? (m[2] && m[2] !== '1' ? m[2].split('').map(c => SUPS[+c]).join('') : '') + (m[3] === '+' ? '⁺' : '⁻') : '';
    return cuerpo + carga + (m[4] || '');
  }
  // «2 Al + 3 Cl2 -> 2 AlCl3» → texto del libro; con coefs, se reemplazan los coeficientes (1 no se escribe).
  const especies = ec => ec.split(/\s*->\s*/).map(l => l.split(/\s+\+\s+/).map(x => x.replace(/^\d+\s+/, '')));
  function ecTxt(ec, coefs) {
    const [R, Pr] = especies(ec); let k = 0;
    const t = l => l.map(f => { const c = coefs ? coefs[k++] : null; return (c && c !== 1 ? `${c} ` : '') + bonita(f); }).join(' + ');
    if (!coefs) return ec.split(/\s*->\s*/).map(l => l.split(/\s+\+\s+/).map(x => { const m = x.match(/^(\d+)\s+(.*)$/); return m ? `${m[1]} ${bonita(m[2])}` : bonita(x); }).join(' + ')).join(' → ');
    return `${t(R)} → ${t(Pr)}`;
  }
  const sg = n => (n > 0 ? `+${n}` : n < 0 ? `−${-n}` : '0');
  const suma = l => l.reduce((a, b) => a + b, 0);
  const D = {
    est: '(s) sólido; (l) líquido; (g) gas; (ac) disuelto en agua',
    reac: 'Reacción química: se forman sustancias nuevas, con otras propiedades',
    ind: 'Indicios: un gas que sale, un sólido que aparece (precipitado), un cambio de color o de temperatura',
    forma1: 'Adición: varias sustancias forman una. Descomposición: una forma varias',
    forma2: 'Desplazamiento simple: un elemento toma el lugar de otro. Doble: dos compuestos intercambian parejas',
    calor: 'Exotérmica: libera calor; endotérmica: absorbe calor',
    lado: 'El calor que se absorbe va con los reactivos; el que se libera, con los productos',
    tanteo: 'Átomos de un elemento = coeficiente × subíndice, iguales a los dos lados',
    min: 'Se escriben los enteros más pequeños; el coeficiente 1 no se escribe, pero cuenta',
    frac: 'Si sale una fracción, todos los coeficientes se multiplican por su denominador',
    eo: 'EO: elemento suelto 0; hidrógeno +1; oxígeno −2; la suma de los EO de una especie es su carga',
    oxred: 'Se oxida: el EO sube (pierde electrones). Se reduce: el EO baja (gana electrones)',
    agente: 'Agente oxidante: el reactivo que se reduce. Agente reductor: el que se oxida',
    redox: 'Redox: reacción en que algún EO cambia',
    salto: 'Electrones de una fórmula = átomos que cambian × salto del EO de cada uno',
    igual: 'Los electrones que pierde el reductor son los que gana el oxidante',
    acido: 'Medio ácido: el O se iguala con H₂O, el H con H⁺ y la carga con electrones',
    carga: 'Carga de un lado: suma de coeficiente × carga de cada especie',
    sumar: 'Las semirreacciones se multiplican hasta tener los mismos electrones y se suman',
  };

  // ---- Bancos (la prueba rehace cada número con el motor de balance-reacciones y con un conteo propio) ----
  // Indicios: ecuación con estados, el producto que se ve y si es gas o sólido.
  const INDICIO = [['Mg(s) + 2 HCl(ac) -> MgCl2(ac) + H2(g)', 'H2', 'gas'], ['2 Na(s) + 2 H2O(l) -> 2 NaOH(ac) + H2(g)', 'H2', 'gas'],
    ['CaCl2(ac) + Na2CO3(ac) -> CaCO3(s) + 2 NaCl(ac)', 'CaCO3', 'solido'], ['AgNO3(ac) + KBr(ac) -> AgBr(s) + KNO3(ac)', 'AgBr', 'solido'],
    ['Na2CO3(ac) + 2 HCl(ac) -> 2 NaCl(ac) + H2O(l) + CO2(g)', 'CO2', 'gas'], ['MgCl2(ac) + 2 KOH(ac) -> Mg(OH)2(s) + 2 KCl(ac)', 'Mg(OH)2', 'solido'],
    ['Zn(s) + H2SO4(ac) -> ZnSO4(ac) + H2(g)', 'H2', 'gas'], ['BaCl2(ac) + K2SO4(ac) -> BaSO4(s) + 2 KCl(ac)', 'BaSO4', 'solido']];
  const HUBO = [['Una tableta antiácida burbujea en agua: suelta CO₂, que no traía', true, 'CO₂'], ['Un cubo de hielo se derrite en un vaso', false, 'agua'],
    ['Un fósforo arde: queda ceniza y salen CO₂ y vapor de agua', true, 'CO₂ y ceniza'], ['Se disuelve azúcar en el té: el sólido desaparece', false, 'azúcar'],
    ['Un pan se tuesta y se pone negro: aparece carbón', true, 'carbón'], ['El alcohol de un frasco abierto se evapora', false, 'alcohol'],
    ['Una cuchara de plata se pone negra: se forma sulfuro de plata', true, 'sulfuro de plata'], ['Un vidrio frío se empaña: el vapor de agua se vuelve líquido', false, 'agua']];
  // Clases: ecuación, clase por su forma y calor ('exo' o 'endo', según el signo de ΔH de tablas).
  const CLASE = [['N2 + 3 H2 -> 2 NH3', 'adición', 'exo'], ['2 Ag2O -> 4 Ag + O2', 'descomposición', 'endo'], ['Mg + 2 HCl -> MgCl2 + H2', 'desplazamiento simple', 'exo'],
    ['KOH + HNO3 -> KNO3 + H2O', 'doble desplazamiento', 'exo'], ['Cu(OH)2 -> CuO + H2O', 'descomposición', 'endo'], ['2 Mg + O2 -> 2 MgO', 'adición', 'exo'],
    ['Cl2 + 2 KBr -> 2 KCl + Br2', 'desplazamiento simple', 'exo'], ['H2 + I2 -> 2 HI', 'adición', 'endo'], ['NH4Cl -> NH3 + HCl', 'descomposición', 'endo'],
    ['BaCl2 + K2SO4 -> BaSO4 + 2 KCl', 'doble desplazamiento', 'exo'], ['CaO + CO2 -> CaCO3', 'adición', 'exo'], ['2 HgO -> 2 Hg + O2', 'descomposición', 'endo']];
  const CLASES = ['adición', 'descomposición', 'desplazamiento simple', 'doble desplazamiento'];
  const POR_QUE = { 'adición': 'varias sustancias forman una', 'descomposición': 'una sustancia forma varias', 'desplazamiento simple': 'un elemento toma el lugar de otro', 'doble desplazamiento': 'dos compuestos intercambian parejas' };
  // Tanteo: ecuación sin coeficientes y sus coeficientes mínimos.
  const BAL = [['Al + Cl2 -> AlCl3', [2, 3, 2]], ['KClO3 -> KCl + O2', [2, 2, 3]], ['SO2 + O2 -> SO3', [2, 1, 2]], ['P4 + O2 -> P4O10', [1, 5, 1]],
    ['Fe + Cl2 -> FeCl3', [2, 3, 2]], ['C3H8 + O2 -> CO2 + H2O', [1, 5, 3, 4]], ['NH3 + O2 -> NO + H2O', [4, 5, 4, 6]], ['Al + H2SO4 -> Al2(SO4)3 + H2', [2, 3, 1, 3]],
    ['Ca(OH)2 + H3PO4 -> Ca3(PO4)2 + H2O', [3, 2, 1, 6]], ['Fe2O3 + C -> Fe + CO2', [2, 3, 4, 3]], ['C2H5OH + O2 -> CO2 + H2O', [1, 3, 2, 3]], ['Na + H2O -> NaOH + H2', [2, 2, 2, 1]]];
  // Combustiones con fracción: combustible y sus coeficientes mínimos.
  const COMB = [['C2H6', [2, 7, 4, 6]], ['C4H10', [2, 13, 8, 10]], ['C6H6', [2, 15, 12, 6]], ['C3H6', [2, 9, 6, 6]], ['C8H18', [2, 25, 16, 18]], ['C2H2', [2, 5, 4, 2]]];
  // Redox: ecuación balanceada, elemento que se oxida (con EO antes y después), el que se reduce, y los agentes.
  const REDOX = [['Zn + 2 HCl -> ZnCl2 + H2', ['Zn', 0, 2], ['H', 1, 0], 'HCl', 'Zn'], ['2 Al + 3 Cl2 -> 2 AlCl3', ['Al', 0, 3], ['Cl', 0, -1], 'Cl2', 'Al'],
    ['Fe + CuSO4 -> FeSO4 + Cu', ['Fe', 0, 2], ['Cu', 2, 0], 'CuSO4', 'Fe'], ['Cl2 + 2 KI -> 2 KCl + I2', ['I', -1, 0], ['Cl', 0, -1], 'Cl2', 'KI'],
    ['PbO + CO -> Pb + CO2', ['C', 2, 4], ['Pb', 2, 0], 'PbO', 'CO'], ['CuO + H2 -> Cu + H2O', ['H', 0, 1], ['Cu', 2, 0], 'CuO', 'H2'],
    ['2 FeCl2 + Cl2 -> 2 FeCl3', ['Fe', 2, 3], ['Cl', 0, -1], 'Cl2', 'FeCl2'], ['Mg + CuSO4 -> MgSO4 + Cu', ['Mg', 0, 2], ['Cu', 2, 0], 'CuSO4', 'Mg']];
  const NO_REDOX = ['CaCO3 -> CaO + CO2', 'KOH + HCl -> KCl + H2O', 'SO3 + H2O -> H2SO4', 'Na2O + H2O -> 2 NaOH', 'BaCl2 + K2SO4 -> BaSO4 + 2 KCl', 'MgCO3 -> MgO + CO2'];
  // Electrones por unidad: especie, a qué pasa, elemento, átomos que cambian, EO antes y después, carga de la especie.
  const UNIDAD_E = [['K2Cr2O7', 'CrCl3', 'Cr', 2, 6, 3, 0], ['Cu2O', 'Cu', 'Cu', 2, 1, 0, 0], ['N2H4', 'N2', 'N', 2, -2, 0, 0], ['P4', 'H3PO4', 'P', 4, 0, 5, 0],
    ['C2O4^2-', 'CO2', 'C', 2, 3, 4, -2], ['MnO4^-', 'Mn^2+', 'Mn', 1, 7, 2, -1], ['Cr2O7^2-', 'Cr^3+', 'Cr', 2, 6, 3, -2], ['ClO3^-', 'Cl^-', 'Cl', 1, 5, -1, -1]];
  // Redox molecular: ecuación sin coeficientes, coeficientes mínimos, agente que se pide (o: oxidante, r: reductor; actúa
  // entero), su posición, la del otro agente y los electrones transferidos en total.
  const MOLEC = [['NH3 + O2 -> NO + H2O', [4, 5, 4, 6], 'r', 0, 1, 20], ['H2S + HNO3 -> S + NO + H2O', [3, 2, 3, 2, 4], 'o', 1, 0, 6], ['K2Cr2O7 + HCl -> KCl + CrCl3 + Cl2 + H2O', [1, 14, 2, 2, 3, 7], 'o', 0, 1, 6],
    ['Al + S -> Al2S3', [2, 3, 1], 'r', 0, 1, 6], ['PbO + NH3 -> Pb + N2 + H2O', [3, 2, 3, 1, 3], 'o', 0, 1, 6], ['C + HNO3 -> CO2 + NO2 + H2O', [1, 4, 1, 4, 2], 'o', 1, 0, 4],
    ['Cu + HNO3 -> Cu(NO3)2 + NO + H2O', [3, 8, 3, 2, 4], 'r', 0, 1, 6], ['Zn + HNO3 -> Zn(NO3)2 + NH4NO3 + H2O', [4, 10, 4, 1, 3], 'r', 0, 1, 8]];
  // Semirreacciones en medio ácido: A, B, coeficientes por especie y lado (izq / der), y electrones.
  const SEMI = [['SO4^2-', 'SO2', { 'H^+': [4, 'izq'], H2O: [2, 'der'] }, [2, 'izq']], ['ClO3^-', 'Cl^-', { 'H^+': [6, 'izq'], H2O: [3, 'der'] }, [6, 'izq']],
    ['NO3^-', 'NO2', { 'H^+': [2, 'izq'], H2O: [1, 'der'] }, [1, 'izq']], ['Cr2O7^2-', 'Cr^3+', { 'H^+': [14, 'izq'], H2O: [7, 'der'] }, [6, 'izq'], 2],
    ['NO3^-', 'NH4^+', { 'H^+': [10, 'izq'], H2O: [3, 'der'] }, [8, 'izq']], ['SO2', 'SO4^2-', { 'H^+': [4, 'der'], H2O: [2, 'izq'] }, [2, 'der']],
    ['NO2^-', 'NO3^-', { 'H^+': [2, 'der'], H2O: [1, 'izq'] }, [2, 'der']], ['MnO2', 'Mn^2+', { 'H^+': [4, 'izq'], H2O: [2, 'der'] }, [2, 'izq']]];
  // Ecuaciones globales en medio ácido: oxidación, reducción, la global y su suma; la suma sin igualar electrones.
  const GLOBAL = [[['Fe^2+', 'Fe^3+'], ['MnO4^-', 'Mn^2+'], 'MnO4^- + 5 Fe^2+ + 8 H^+ -> Mn^2+ + 5 Fe^3+ + 4 H2O', 24, 16],
    [['Fe^2+', 'Fe^3+'], ['Cr2O7^2-', 'Cr^3+'], 'Cr2O7^2- + 6 Fe^2+ + 14 H^+ -> 2 Cr^3+ + 6 Fe^3+ + 7 H2O', 36, 26],
    [['Cu', 'Cu^2+'], ['NO3^-', 'NO2'], '2 NO3^- + Cu + 4 H^+ -> 2 NO2 + Cu^2+ + 2 H2O', 12, 7],
    [['Zn', 'Zn^2+'], ['NO3^-', 'NH4^+'], 'NO3^- + 4 Zn + 10 H^+ -> NH4^+ + 4 Zn^2+ + 3 H2O', 23, 17],
    [['SO2', 'SO4^2-'], ['Cr2O7^2-', 'Cr^3+'], 'Cr2O7^2- + 3 SO2 + 2 H^+ -> 2 Cr^3+ + 3 SO4^2- + H2O', 12, 20],
    [['Cl^-', 'Cl2'], ['MnO4^-', 'Mn^2+'], '2 MnO4^- + 10 Cl^- + 16 H^+ -> 2 Mn^2+ + 5 Cl2 + 8 H2O', 43, 17]];

  // ---- Armado ----
  const TIPOS_POR_IDEA = {
    indicios: ['hubo', 'indicio', 'estados-vf'], clasificar: ['forma', 'calor', 'dos-etiquetas'], tanteo: ['coeficiente', 'suma', 'fraccion'],
    'oxida-reduce': ['agente', 'salto', 'es-redox'], 'cambio-eo': ['e-unidad', 'coef-agente', 'suma-redox'], 'ion-electron': ['agua', 'electrones', 'global'],
  };
  const IDEAS = Object.keys(TIPOS_POR_IDEA);
  const IDEA_DE = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map(t => [t, i])));
  const NIVEL = { hubo: 1, indicio: 2, 'estados-vf': 3, forma: 1, calor: 2, 'dos-etiquetas': 3, coeficiente: 1, suma: 2, fraccion: 3,
    agente: 1, salto: 2, 'es-redox': 3, 'e-unidad': 1, 'coef-agente': 2, 'suma-redox': 3, agua: 1, electrones: 2, global: 3 };
  const DOC = { ES11: 'documentado', ES12: 'documentado', ES14: 'parcial', EC9: 'documentado', EC11: 'parcial', MA1: 'documentado', MA2: 'documentado', MA3: 'documentado', MA8: 'documentado',
    'S-SUM': 'documentado', 'S-IGN': 'documentado', 'N-CAR': 'documentado', 'W-CAR': 'documentado' };
  const FUENTE = { E: 'docs/investigacion/estequiometria-ideas-erroneas.md', C: 'docs/investigacion/equilibrio-acidos-electroquimica-ideas-erroneas.md',
    M: 'docs/investigacion/quimica-materia-nomenclatura-organica-ideas-erroneas.md', N: 'docs/investigacion/etapa9/quimica.reacciones-y-balance.md' };
  const fuenteDe = id => (/^ES/.test(id) ? FUENTE.E : /^EC/.test(id) ? FUENTE.C : /^MA/.test(id) ? FUENTE.M : FUENTE.N);
  const err = (id, texto, explicacion) => ({ id, clave: texto, texto, explicacion, respaldo: DOC[id] || 'hipotesis', fuente: fuenteDe(id) });
  // Elige 3 o 4 errores con los que la correcta no queda como la alternativa «central» (se adivinaría sin resolver): la
  // misma medida que nucleo/probar-generador.js (trozos que difieren). Modelo: mol-practica.
  const trozos = t => String(t).replace(/[()]/g, ' ').split(/[\s;,]+|(?=[+−\-·/])|(?<=[+−\-·/])/).filter(Boolean);
  const dist = (a, b) => { const A = trozos(a), Bt = trozos(b); let d = 0; for (let i = 0; i < Math.max(A.length, Bt.length); i++) if (A[i] !== Bt[i]) d++; return d; };
  function* combinaciones(l, k, i = 0, acc = []) { if (acc.length === k) { yield acc; return; } for (let j = i; j < l.length; j++) yield* combinaciones(l, k, j + 1, [...acc, l[j]]); }
  function elegirSinFuga(correcta, pool) {
    for (const k of [4, 3]) for (const sub of combinaciones(pool, Math.min(k, pool.length))) {
      if (sub.length < 3) continue;
      const al = [correcta, ...sub.map(e => e.texto)], sc = al.map(a => al.reduce((t, x) => t + dist(a, x), 0)), min = Math.min(...sc);
      if (!(sc[0] === min && sc.filter(x => x === min).length === 1)) return sub;
    }
    return null;
  }
  function cerrar(rng, semilla, tipo, o) {
    const vistos = new Set([o.correcta]), pool = [];
    for (const e of rng.barajar(o.errores)) if (e && e.texto && !/NaN|Infinity|undefined/.test(e.texto) && !vistos.has(e.texto)) { vistos.add(e.texto); pool.push(e); }
    if (pool.length < 3) return null;
    const sub = elegirSinFuga(o.correcta, pool);
    if (!sub) return null;
    const alternativas = P.armarTexto({ correcta: { clave: o.correcta, texto: o.correcta }, errores: sub, rng });
    const usadas = new Set();
    for (const linea of [o.enunciado, o.pregunta, ...o.solucion]) for (const x of linea) if (x && typeof x === 'object' && x.v) usadas.add(x.v);
    return { id: `${ID}#${semilla}`, unidadCatalogo: UNIDAD, variables: Object.fromEntries([...usadas].map(k => [k, Object.assign({}, VARS[k])])),
      enunciado: o.enunciado, pregunta: o.pregunta, datos: o.datos, alternativas, solucion: o.solucion, respuesta: { valor: o.correcta, unidad: '' },
      _datos: Object.assign({ idea: IDEA_DE[tipo], tipo, nivel: NIVEL[tipo] }, o._datos) };
  }
  const terminos = ec => ec.split(/\s*->\s*/).flatMap((l, i) => l.split(/\s+\+\s+/).map(x => { const f = x.replace(/^\d+\s+/, ''); return { f, lado: i ? 'p' : 'r', estado: (f.match(/\((s|l|g|ac)\)$/) || [])[1] }; }));
  const sinE = f => bonita(f.replace(/\((s|l|g|ac)\)$/, ''));

  // ---- Idea 1 ----
  function hubo(rng) {
    const [caso, si, que] = rng.elegir(HUBO);
    const errores = si ? [err('MA2', 'No: solo cambió de estado', 'Un cambio de estado no sería reacción, pero aquí aparece una sustancia que antes no estaba.'),
      err('MA3', 'No: solo se mezclaron dos cosas', 'En una mezcla cada sustancia sigue igual; aquí, en cambio, aparece una sustancia nueva.'),
      err('MA8', 'No: sin cambio de color no hay reacción', 'El color es solo un indicio: hay reacción cuando aparece una sustancia nueva, cambie o no el color.')]
      : [err('MA8', 'Sí: hay un indicio, y eso prueba la reacción', 'Es cierto que hay un indicio, pero no basta: antes y después está la misma sustancia.'),
        err('MA1', 'Sí: al cambiar de estado es otra sustancia', 'Sí cambia de estado, pero eso no forma otra sustancia: las moléculas siguen siendo las mismas.'),
        err('MA3', 'Sí: se mezcló con otra cosa', 'Es cierto que se mezcla, pero mezclar o disolver no forma sustancias nuevas.')];
    return { correcta: si ? `Sí: aparece ${que}, una sustancia nueva` : `No: sigue siendo ${que}`, _datos: { caso, si },
      enunciado: [`${caso}.`], pregunta: ['¿Hubo reacción química?'], datos: [D.reac, D.ind], errores,
      solucion: [[si ? `Hay reacción, porque aparece ${que}, que antes no estaba.` : `No hay reacción: antes y después hay ${que}, y no se forma nada nuevo.`]] };
  }
  const verTxt = (tipo, f) => (tipo === 'gas' ? `Burbujas de ${sinE(f)}` : `Aparece un sólido: ${sinE(f)}`);
  function indicio(rng) {
    const [ec, visto, tipo] = rng.elegir(INDICIO), ts = terminos(ec), dis = ts.find(x => x.lado === 'p' && x.estado === 'ac'), liq = ts.find(x => x.lado === 'p' && x.estado === 'l');
    const errores = [err('MA8', 'Nada: todo queda disuelto', `Lo que lleva (ac) no se ve, es cierto, pero el ${bonita(visto)} lleva (${tipo === 'gas' ? 'g' : 's'}) y sí se ve.`),
      dis && err('QM-PRECIP', `Aparece un sólido: ${sinE(dis.f)}`, `Hiciste bien en mirar los productos, pero el ${sinE(dis.f)} lleva (ac): queda disuelto.`),
      tipo === 'solido' ? err('QM-INDICIO-GAS', 'Salen burbujas de un gas', 'Saldría un gas si algún producto llevara (g), y aquí ninguno lo lleva.')
        : err('QM-ESTADO', 'Aparece un sólido que cae al fondo', 'Aparecería un sólido si algún producto llevara (s), y aquí ninguno lo lleva.'),
      liq && err('QM-ESTADO', `Burbujas de ${sinE(liq.f)}`, `Haría burbujas si llevara (g), pero el ${sinE(liq.f)} lleva (l) y queda líquido.`)];
    return { correcta: verTxt(tipo, visto), _datos: { ec, visto, clase: tipo }, enunciado: [`Se mezclan los reactivos de esta reacción: ${ecTxt(ec)}.`], pregunta: ['¿Qué indicio se ve?'], datos: [D.est, D.ind], errores,
      solucion: [[`El ${bonita(visto)} lleva (${tipo === 'gas' ? 'g' : 's'}), así que ${tipo === 'gas' ? 'sale como gas' : 'aparece como sólido'}.`], ['Lo que lleva (ac) queda disuelto y no se ve.']] };
  }
  function estadosVF(rng) {
    const [ec, visto, tipo] = rng.elegir(INDICIO), ts = terminos(ec), r = ts.filter(x => x.lado === 'r'), p = ts.filter(x => x.lado === 'p');
    const otra = rng.elegir([...r, ...p]), nDice = rng.elegir([p.length, p.length + 1]), dice = rng.entero(0, 1) ? tipo : tipo === 'gas' ? 'solido' : 'gas';
    const af = [[dice === 'gas' ? 'Salen burbujas' : 'Aparece un precipitado', dice === tipo, dice === tipo ? `el ${bonita(visto)} lleva (${tipo === 'gas' ? 'g' : 's'})` : `ningún producto lleva (${dice === 'gas' ? 'g' : 's'})`],
      [`El ${sinE(otra.f)} es un reactivo`, otra.lado === 'r', otra.lado === 'r' ? `el ${sinE(otra.f)} está a la izquierda` : `el ${sinE(otra.f)} está a la derecha: es un producto`],
      [`Hay ${nDice} productos`, nDice === p.length, `a la derecha hay ${p.length}`]];
    const clave = af.map(a => (a[1] ? 'V' : 'F')).join(''), ROM = ['I', 'II', 'III'];
    const errores = rng.barajar(['VVV', 'VVF', 'VFV', 'FVV', 'VFF', 'FVF', 'FFV', 'FFF'].filter(k => k !== clave)).slice(0, 4).map(k => { const j = [0, 1, 2].find(q => k[q] !== clave[q]);
      return err(j === 1 ? 'QM-LADO' : 'QM-ESTADO', k, `La ${ROM[j]} es ${clave[j] === 'V' ? 'verdadera' : 'falsa'}, porque ${af[j][2]}.`); });
    return { correcta: clave, _datos: { ec, visto, clase: tipo, dice, otra: otra.f, nDice },
      enunciado: [`Sobre ${ecTxt(ec)}: I. ${af[0][0]}. II. ${af[1][0]}. III. ${af[2][0]}.`], pregunta: ['¿Qué es verdadero (V) y qué falso (F)?'], datos: [D.est], errores,
      solucion: [[`I: ${af[0][2]}. II: ${af[1][2]}. III: ${af[2][2]}.`]] };
  }
  // ---- Idea 2 ----
  const cap = t => t[0].toUpperCase() + t.slice(1);
  const conCalor = (ec, c) => { const [a, b] = ec.split(' -> '); return c === 'endo' ? `${ecTxt(a)} + calor → ${ecTxt(b)}` : `${ecTxt(a)} → ${ecTxt(b)} + calor`; };
  const NOM_C = { exo: 'exotérmica', endo: 'endotérmica' };
  function forma(rng) {
    const [ec, k] = rng.elegir(CLASE);
    return { correcta: cap(k), _datos: { ec, clase: k }, enunciado: [`${ecTxt(ec)}.`], pregunta: ['¿Qué clase de reacción es, por su forma?'], datos: [D.forma1, D.forma2],
      errores: CLASES.filter(x => x !== k).map(x => err('QM-CLASIF', cap(x), `En una reacción de ${x}, ${POR_QUE[x]}; aquí, en cambio, ${POR_QUE[k]}.`)),
      solucion: [[`En esta reacción ${POR_QUE[k]}, así que es de ${k}.`]] };
  }
  function calor(rng) {
    const [ec, , c] = rng.elegir(CLASE), lado = c === 'exo' ? 'los productos' : 'los reactivos';
    return { correcta: c === 'exo' ? 'Libera calor: exotérmica' : 'Absorbe calor: endotérmica', _datos: { ec, calor: c },
      enunciado: [`${conCalor(ec, c)}.`], pregunta: ['¿La reacción libera o absorbe calor?'], datos: [D.calor, D.lado],
      errores: [err('QM-CALOR-LADO', c === 'exo' ? 'Absorbe calor: endotérmica' : 'Libera calor: exotérmica', `El calor está escrito con ${lado}, y eso hace que la reacción sea ${NOM_C[c]}.`),
        err('QM-CALOR-LADO', 'Ni libera ni absorbe', 'Sería así si la ecuación no escribiera calor, pero lo escribe: entra o sale según su lado.'),
        err('QM-CLASIF', 'Depende de si es adición o descomposición', `La forma no dice nada del calor: aquí está con ${lado}, así que es ${NOM_C[c]}.`)],
      solucion: [[`El calor está con ${lado}: la reacción es ${NOM_C[c]}.`]] };
  }
  function dosEtiquetas(rng) {
    const [ec, k, c] = rng.elegir(CLASE), oc = c === 'exo' ? 'endo' : 'exo', ok = rng.elegir(CLASES.filter(x => x !== k));
    return { correcta: `${cap(k)} y ${NOM_C[c]}`, _datos: { ec, clase: k, calor: c },
      enunciado: [`${conCalor(ec, c)}.`], pregunta: ['¿Cómo se clasifica, por su forma y por el calor?'], datos: [D.forma1, D.forma2, D.calor, D.lado],
      errores: [err('QM-CALOR-LADO', `${cap(k)} y ${NOM_C[oc]}`, `La forma está bien, ${k}, pero el lado donde está escrito el calor la hace ${NOM_C[c]}.`),
        err('QM-CLASIF', `${cap(ok)} y ${NOM_C[c]}`, `El calor está bien, pero ${POR_QUE[k]}, así que es de ${k}.`), err('QM-CLASIF', `${cap(ok)} y ${NOM_C[oc]}`, `Cambian las dos etiquetas: por su forma es de ${k}, y por el calor es ${NOM_C[c]}.`)],
      solucion: [[`Por su forma es de ${k}, porque ${POR_QUE[k]}.`], [`Por el calor es ${NOM_C[c]}.`]] };
  }
  // ---- Idea 3 ----
  function coeficiente(rng) {
    const [ec, cs] = rng.elegir(BAL), fs = especies(ec).flat(), k = rng.entero(0, fs.length - 1), bien = cs[k];
    const nR = especies(ec)[0].length, t = fs.map((f, i) => (i === k ? '__ ' : cs[i] === 1 ? '' : `${cs[i]} `) + bonita(f));
    return { correcta: String(bien), _datos: { ec, coefs: cs, k }, enunciado: [`${t.slice(0, nR).join(' + ')} → ${t.slice(nR).join(' + ')}`], pregunta: ['¿Qué coeficiente va en el espacio?'], datos: [D.tanteo],
      errores: [err('ES12', String(bien + 1), `Un entero está bien, pero con ${bien + 1} sobrarían átomos en ese lado de la flecha.`), err('ES12', String(bien > 1 ? bien - 1 : bien + 2), 'Con ese número, algún elemento no quedaría con los mismos átomos a los dos lados.'),
        err('H-MIN', String(2 * bien), `La proporción se mantendría, pero ${2 * bien} sirve solo si también se duplican los demás coeficientes.`)],
      solucion: [[`Con ${bien}, cada elemento queda con los mismos átomos a los dos lados:`], [ecTxt(ec, cs)]] };
  }
  function sumaT(rng) {
    const [ec, cs] = rng.elegir(BAL), s = suma(cs), unos = cs.filter(x => x === 1).length;
    return { correcta: String(s), _datos: { ec, coefs: cs }, enunciado: [`${ecTxt(ec)}.`], pregunta: ['Con los enteros más pequeños, ¿cuánto suman los coeficientes?'], datos: [D.tanteo, D.min],
      errores: [err('QM-SUMA-SIN-BALANCE', String(cs.length), 'Esa es la suma sin balancear, cuando todos valen 1; primero se balancea y después se suma.'),
        err('H-MIN', String(2 * s), `Con una suma de ${2 * s} cuadra, pero no con los enteros más pequeños: es el doble.`), unos ? err('ES12', String(s - unos), 'Los coeficientes escritos están bien, pero el 1 que no se escribe también se suma.') : null,
        err('ES12', String(s + 2), 'Con esa suma, algún elemento no queda con los mismos átomos a los dos lados.')],
      solucion: [['Con los enteros más pequeños, la ecuación balanceada queda así:'], [ecTxt(ec, cs)], [`${cs.join(' + ')} = `, v('f', s)]] };
  }
  function fraccion(rng) {
    const [c, cs] = rng.elegir(COMB), ec = `${c} + O2 -> CO2 + H2O`, o2 = cs[1];
    return { correcta: String(o2), _datos: { comb: c, coefs: cs }, enunciado: [`La combustión ${ecTxt(ec)}.`], pregunta: ['Con los enteros más pequeños, ¿cuál es el coeficiente del O₂?'], datos: [D.tanteo, D.min, D.frac],
      errores: [err('H-MIN', `${o2}/2`, `La cuenta del oxígeno con un ${bonita(c)} está bien, pero ${o2}/2 no es entero: todo se multiplica por 2.`),
        err('ES12', String(cs[2]), 'Eso alcanza para el oxígeno del CO₂, pero el oxígeno del agua también sale del O₂.'), err('H-MIN', String(2 * o2), `Con ${2 * o2} cuadra, pero no con los enteros más pequeños: es el doble.`),
        err('ES12', String(o2 + 1), `Con ${o2 + 1} O₂ sobrarían 2 átomos de oxígeno a la izquierda.`), err('ES12', String(cs[3]), 'Eso alcanza para el oxígeno del agua, pero el oxígeno del CO₂ también sale del O₂.')],
      solucion: [['Se igualan primero el C y el H, al final el O, y todo se multiplica por 2 para quitar la fracción:'], [ecTxt(ec, cs)]] };
  }
  // ---- Idea 4 ----
  function agente(rng) {
    const [ec, ox, red, AO, AR] = rng.elegir(REDOX), pideOx = rng.entero(0, 1) === 1, bien = pideOx ? AO : AR, otro = pideOx ? AR : AO;
    const prods = especies(ec)[1].filter(f => f !== bien);
    return { correcta: bonita(bien), _datos: { ec, pideOx, AO, AR }, enunciado: [`${ecTxt(ec)}.`], pregunta: [`¿Cuál es el agente ${pideOx ? 'oxidante' : 'reductor'}?`], datos: [D.eo, D.oxred, D.agente],
      errores: [err('QM-AGENTE', bonita(otro), `En el ${bonita(otro)} también cambia un EO, pero ${pideOx ? 'se oxida, así que es el reductor' : 'se reduce, así que es el oxidante'}.`),
        ...prods.map(f => err('QM-AGENTE', bonita(f), `El ${bonita(f)} está a la derecha de la flecha: es un producto, y los agentes siempre son reactivos.`))],
      solucion: [[`El ${ox[0]} va de `, v('o', sg(ox[1])), ' a ', v('o', sg(ox[2])), ', así que se oxida.'], [`El ${red[0]} va de `, v('o', sg(red[1])), ' a ', v('o', sg(red[2])), ', así que se reduce.']] };
  }
  function salto(rng) {
    const [ec, ox, red] = rng.elegir(REDOX), [el, a, b] = rng.entero(0, 1) ? ox : red, sube = b > a;
    return { correcta: `Se ${sube ? 'oxida' : 'reduce'}: su EO va de ${sg(a)} a ${sg(b)}`, _datos: { ec, el, a, b }, enunciado: [`${ecTxt(ec)}.`], pregunta: [`¿Qué le pasa al ${el}?`], datos: [D.eo, D.oxred],
      errores: [err('EC9', `Se ${sube ? 'reduce' : 'oxida'}: su EO va de ${sg(a)} a ${sg(b)}`, `Los valores del EO están bien, pero ${sube ? 'subir es perder electrones, y eso es oxidarse' : 'bajar es ganarlos, y eso es reducirse'}.`),
        err('QM-CLASIF-REVES', `Se ${sube ? 'reduce' : 'oxida'}: su EO va de ${sg(b)} a ${sg(a)}`, `Los dos valores están bien, pero se leen de reactivo a producto: de ${sg(a)} a ${sg(b)}.`),
        err('N-CAR', 'No cambia: es el mismo elemento', `Es el mismo elemento, es cierto, pero su EO pasa de ${sg(a)} a ${sg(b)}.`)],
      solucion: [[`El ${el} va de `, v('o', sg(a)), ' a ', v('o', sg(b)), `, así que ${sube ? 'pierde' : 'gana'} electrones.`]] };
  }
  function esRedox(rng) {
    const una = rng.elegir(REDOX), otras = rng.barajar(NO_REDOX).slice(0, 4);
    return { correcta: ecTxt(una[0]), _datos: { ec: una[0] }, enunciado: ['Las alternativas son cinco reacciones químicas.'], pregunta: ['¿Cuál de ellas es redox?'], datos: [D.eo, D.redox],
      errores: otras.map(e => err('EC9', ecTxt(e), 'Que haya oxígeno no basta: en esta reacción ningún EO cambia, así que no es redox.')),
      solucion: [[`Solo en ${ecTxt(una[0])} cambian EO: el ${una[1][0]} va de `, v('o', sg(una[1][1])), ' a ', v('o', sg(una[1][2])), '.']] };
  }
  // ---- Idea 5 ----
  function eUnidad(rng) {
    const [A, B, el, n, a, b, q] = rng.elegir(UNIDAD_E), s = Math.abs(a - b), e = n * s, gana = b < a;
    return { correcta: String(e), _datos: { A, B, el, n, a, b }, enunciado: [`Una unidad de ${bonita(A)} pasa a ${bonita(B)}.`], pregunta: [`¿Cuántos electrones ${gana ? 'gana' : 'pierde'}?`],
      datos: [D.salto, `EO del ${el}: ${sg(a)} en ${bonita(A)} y ${sg(b)} en ${bonita(B)}`],
      errores: [err('S-IGN', String(s), `El salto de un ${el} sí es ${s}, pero en el ${bonita(A)} cambian ${n} átomos de ${el}.`), err('S-SUM', String(n + s), `Hay que usar los átomos y el salto, pero se multiplican y no se suman: ${n} × ${s}.`),
        err('N-CAR', String(Math.abs(q)), 'La carga de la especie no cuenta los electrones que pasan: los da el salto del EO.'), err('S-IGN', String(n), `Contaste bien los átomos de ${el}, pero cada uno ${gana ? 'gana' : 'pierde'} ${s} electrones.`)],
      solucion: [[n === 1 ? `Cambia un solo átomo de ${el}, que ${gana ? 'gana' : 'pierde'} ${s}: ` : `Cambian ${n} átomos de ${el}, y cada uno ${gana ? 'gana' : 'pierde'} ${s}: `, `${n} × ${s} = `, v('i', e)]] };
  }
  function coefAgente(rng) {
    const [ec, cs, quien, k, kOtro, eT] = rng.elegir(MOLEC), fs = especies(ec).flat(), bien = cs[k];
    return { correcta: String(bien), _datos: { ec, coefs: cs, quien, k }, enunciado: [`${ecTxt(ec)}.`], pregunta: [`Balanceada con los electrones, ¿cuál es el coeficiente del agente ${quien === 'o' ? 'oxidante' : 'reductor'}?`],
      datos: [D.salto, D.igual, D.eo],
      errores: [err('QM-AGENTE', String(cs[kOtro]), `Ese es el coeficiente del ${bonita(fs[kOtro])}, que es el otro agente.`), err('QM-SIN-IGUALAR', String(eT), `Esos ${eT} son los electrones transferidos en total, pero no son un coeficiente.`),
        err('H-MIN', String(2 * bien), `Con ${2 * bien} cuadra, pero no con los enteros más pequeños: es el doble.`), err('QM-SIN-IGUALAR', '1', 'Con 1 sobran electrones sin igualar: hay que multiplicar hasta que los perdidos sean los ganados.')],
      solucion: [[`Se transfieren `, v('i', eT), ' electrones, y el agente que se pide es el ', bonita(fs[k]), '.'], [ecTxt(ec, cs)]] };
  }
  function sumaRedox(rng) {
    const [ec, cs] = rng.elegir(MOLEC), s = suma(cs), nR = especies(ec)[0].length;
    return { correcta: String(s), _datos: { ec, coefs: cs }, enunciado: [`${ecTxt(ec)}.`], pregunta: ['Con los enteros más pequeños, ¿cuánto suman los coeficientes?'], datos: [D.salto, D.igual, D.min, D.eo],
      errores: [err('QM-SUMA-SIN-BALANCE', String(cs.length), 'Esa es la suma sin balancear, cuando todos valen 1; primero se igualan los electrones.'), err('H-MIN', String(2 * s), `Con una suma de ${2 * s} cuadra, pero es el doble de la suma mínima.`),
        err('ES12', String(suma(cs.slice(0, nR))), 'Los coeficientes están bien, pero esa es solo la suma de los reactivos: faltan los productos.'), err('ES12', String(s + 1), 'Con esa suma, algún elemento no queda igual a los dos lados.')],
      solucion: [['Se igualan los electrones, y lo demás se balancea por tanteo:'], [ecTxt(ec, cs)], [`${cs.join(' + ')} = `, v('f', s)]] };
  }
  // ---- Idea 6 ----
  const lado = l => (l === 'izq' ? 'la izquierda' : 'la derecha');
  function semiTxt([A, B, x, [e, le], nB]) {
    const izq = [bonita(A)], der = [(nB ? `${nB} ` : '') + bonita(B)];
    for (const [f, [c, l]] of Object.entries(x)) (l === 'izq' ? izq : der).push(`${c === 1 ? '' : `${c} `}${bonita(f)}`);
    (le === 'izq' ? izq : der).push(`${e === 1 ? '' : `${e} `}e⁻`);
    return `${izq.join(' + ')} → ${der.join(' + ')}`;
  }
  function agua(rng) {
    const s = rng.elegir(SEMI), [A, B, x] = s, [n, l] = x.H2O, otro = l === 'izq' ? 'der' : 'izq', oA = (A.match(/O(\d*)/) || [])[1];
    const nA = oA === undefined ? 0 : +oA || 1, t = (k, ld) => `${k} H₂O a ${lado(ld)}`;
    return { correcta: t(n, l), _datos: { A, B, n, l }, enunciado: [`En medio ácido, ${bonita(A)} → ${s[4] ? `${s[4]} ` : ''}${bonita(B)}.`], pregunta: ['¿Cuántas moléculas de agua se escriben y de qué lado?'], datos: [D.acido],
      errores: [err('QM-AGUA-LADO', t(n, otro), `El número, ${n}, está bien, pero el agua se escribe en el lado donde faltan O.`), nA !== n ? err('QM-AGUA-TODO', t(nA, l), `El lado está bien, pero el ${bonita(B)} también tiene O, así que ${n === 1 ? 'falta 1' : `faltan ${n}`}.`) : null,
        err('W-CAR', 'Ninguna: se arregla con electrones', 'Los electrones solo igualan la carga; los O que faltan se igualan con agua.'), err('QM-AGUA-TODO', t(n + 1, l), `Con ${n + 1} H₂O sobraría un O en ese lado.`),
        err('W-HID', `${2 * n} H₂O a ${lado(otro)}`, `Es cierto que hace falta agua, pero ${2 * n} son los H⁺, no las aguas.`), n > 1 ? err('QM-AGUA-LADO', t(n - 1, otro), `Con ${n - 1} H₂O en ese lado no cuadra el oxígeno.`) : null],
      solucion: [['Se iguala primero el elemento central, y los O que faltan se escriben como agua:'], [semiTxt(s)]] };
  }
  function electrones(rng) {
    const s = rng.elegir(SEMI), [A, B, x, [e, le]] = s, otro = le === 'izq' ? 'der' : 'izq', t = (k, ld) => `${k} e⁻ a ${lado(ld)}`;
    const conH = { izq: [bonita(A)], der: [(s[4] ? `${s[4]} ` : '') + bonita(B)] };
    for (const [f, [c, l]] of Object.entries(x)) conH[l].push(`${c === 1 ? '' : `${c} `}${bonita(f)}`);
    return { correcta: t(e, le), _datos: { A, B, e, le }, enunciado: [`En medio ácido: ${conH.izq.join(' + ')} → ${conH.der.join(' + ')}.`], pregunta: ['¿Cuántos electrones faltan y de qué lado?'], datos: [D.acido, D.carga],
      errores: [err('QM-ION-E', t(e, otro), `El número, ${e}, está bien, pero los electrones van del lado de carga más alta.`), err('EC11', t(e + 1, le), `Con ${e + 1} electrones, los dos lados no quedan con la misma carga.`),
        e > 1 ? err('EC11', t(e - 1, le), `Con ${e - 1 === 1 ? 'un electrón' : `${e - 1} electrones`}, los dos lados no quedan con la misma carga.`) : err('EC11', t(e + 2, le), `Con ${e + 2} electrones, los dos lados no quedan con la misma carga.`),
        err('QM-ION-E', `${x['H^+'][0]} e⁻ a ${lado(otro)}`, `Hay que igualar la carga, pero ${x['H^+'][0]} son los H⁺, y los electrones van del otro lado.`),
        err('EC11', 'Ninguno: los átomos ya cuadran', 'Los átomos sí cuadran, pero la carga de los dos lados todavía no es igual.')],
      solucion: [['La diferencia de carga entre los dos lados se iguala con electrones:'], [semiTxt(s)]] };
  }
  function global(rng) {
    const [o, r, ec, s, sinIg] = rng.elegir(GLOBAL), unos = (ec.match(/(^|[>+]\s)(?!\d)\S/g) || []).length;
    return { correcta: String(s), _datos: { o, r, ec, suma: s }, enunciado: [`En medio ácido, ${bonita(o[0])} + ${bonita(r[0])} → ${bonita(o[1])} + ${bonita(r[1])}.`],
      pregunta: ['Con los enteros más pequeños, ¿cuánto suman los coeficientes?'], datos: [D.acido, D.carga, D.sumar],
      errores: [err('QM-SIN-IGUALAR', String(sinIg), `Cada mitad está bien, pero si se suman sin igualar los electrones, la suma da ${sinIg}.`), err('H-MIN', String(2 * s), `Con una suma de ${2 * s} cuadra, pero es el doble de la suma mínima.`),
        err('QM-SUMA-SIN-BALANCE', String(s - unos), 'Los coeficientes escritos están bien, pero el 1 que no se escribe también se suma.'), err('EC11', String(s + 1), 'Con esa suma, algún átomo o la carga no queda igual a los dos lados.')],
      solucion: [['Cada mitad se balancea por separado; después se igualan los electrones y se suman:'], [ecTxt(ec)]] };
  }

  const CONSTRUIR = { hubo, indicio, 'estados-vf': estadosVF, forma, calor, 'dos-etiquetas': dosEtiquetas, coeficiente, suma: sumaT, fraccion,
    agente, salto, 'es-redox': esRedox, 'e-unidad': eUnidad, 'coef-agente': coefAgente, 'suma-redox': sumaRedox, agua, electrones, global };
  // Papel (regla 6; herramientas/papel-generador.js toma «papel-1» a «papel-8» y rotula 3 básicos, 3 intermedios y 2
  // avanzados): las seis ideas, con el nivel de cada tipo igual a su rótulo.
  const PAPEL = { 'papel-1': 'hubo', 'papel-2': 'forma', 'papel-3': 'coeficiente', 'papel-4': 'salto', 'papel-5': 'coef-agente', 'papel-6': 'electrones',
    'papel-7': 'fraccion', 'papel-8': 'global' };
  function generar(semilla, opciones = {}) {
    const rng = Azar.crear(`${ID}|${semilla}`);
    const fijo = PAPEL[semilla] && !opciones.idea ? PAPEL[semilla] : null;
    const idea = fijo ? IDEA_DE[fijo] : TIPOS_POR_IDEA[opciones.idea] ? opciones.idea : rng.elegir(IDEAS), tipo = fijo || rng.elegir(TIPOS_POR_IDEA[idea]);
    for (let intento = 0; intento < 200; intento++) {
      const o = CONSTRUIR[tipo](rng);
      o.errores = o.errores.filter(Boolean);
      const p = cerrar(rng, semilla, tipo, o);
      if (p) return p;
    }
    throw new Error(`${ID}: no se pudo generar un problema de ${tipo}`);
  }
  return { id: ID, titulo: 'Reacciones y balance', generar, TIPOS_POR_IDEA, NIVEL, TIPOS: Object.keys(CONSTRUIR),
    BANCO: { INDICIO, HUBO, CLASE, BAL, COMB, REDOX, NO_REDOX, UNIDAD_E, MOLEC, SEMI, GLOBAL } };
});
