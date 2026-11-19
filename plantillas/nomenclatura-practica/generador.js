/*
 * Generador «Estados de oxidación, nombres y fórmulas» (nomenclatura-practica), formato "predicciones"
 * (docs/arquitectura.md). Práctica por idea de quimica.nomenclatura-inorganica (docs/etapa7/propuesta-quimica.md §9).
 * Funciona en el navegador (window.Generadores['nomenclatura-practica']) y en Node (require). No usa la teoría ni el motor
 * de la escena: trae sus propias tablas. Los nombres de las tablas se comprobaron aparte con OPSIN 2.8.0 y con una cuenta
 * de cargas propia (scratchpad e7-quimica/verif/nombres.py); los EO salen de una cuenta propia (valores fijos y la suma).
 *
 * Tipos por idea (TIPOS_POR_IDEA; nivel 1 un paso, 2 dos pasos, 3 de examen). generar(semilla, { idea }) da solo los de
 * esa idea; sin idea, las seis con el mismo peso.
 *   estados-oxidacion   eo-neutro (1) · eo-ion (2) · eo-dos (2) · cual-eo (3)
 *   tres-nombres        stock-oxido (1) · trad-oxido (2) · formula-oxido (2)
 *   peroxidos-hidruros  formula-peroxido (1) · hidracido (1) · eo-raro (2)
 *   arbol-funciones     formula-hidroxido (1) · formula-oxacido (2) · nombre-oxacido (3)
 *   sales               anion (1) · formula-sal (2) · nombre-sal (3)
 *   sales-acidas-basicas-hidratadas  clase-sal (1) · oxigenos-hidrato (3)
 * Colores (los de la unidad): catión naranja, anión turquesa, EO violeta, carga carmín.
 * Errores: NO1 a NO4 de docs/investigacion/quimica-materia-nomenclatura-organica-ideas-erroneas.md y los QM- de la teoría
 * (hipótesis). Cada explicación empieza por lo que el alumno hizo bien y da el valor de su error.
 * La tarjeta «Convención del examen» nomenclatura-examen (nucleo/convencion.js) acompaña los tipos de nombres.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar, nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'nomenclatura-practica', UNIDAD = 'quimica.nomenclatura-inorganica', FUENTE = 'docs/investigacion/quimica-materia-nomenclatura-organica-ideas-erroneas.md';
  const VARS = { EO: { nombre: 'estado de oxidación', color: 'f' }, q: { nombre: 'carga', color: 'h' } };
  const v = P.v;
  const SUBS = '₀₁₂₃₄₅₆₇₈₉', SUPS = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  // Fórmula escrita («Al2(SO4)3», «SO4^2-», «CuSO4·5H2O») como en el libro.
  function bonita(f) {
    let [c, q] = String(f).split('^');
    c = c.replace(/([A-Za-z)])1(?!\d)/g, '$1');
    c = c.split('·').map((p, i) => (i ? p.replace(/^(\d+)/, '$1\u0000') : p).replace(/([A-Za-z)])(\d+)/g, (m, a, d) => a + d.split('').map(x => SUBS[+x]).join('')).replace('\u0000', '')).join('·');
    if (!q) return c;
    const m = q.match(/^(\d*)([+-])$/);
    return c + (m[1] && m[1] !== '1' ? m[1].split('').map(x => SUPS[+x]).join('') : '') + (m[2] === '+' ? '⁺' : '⁻');
  }
  const sg = x => (x > 0 ? `+${x}` : x < 0 ? `−${-x}` : '0');
  function atomos(f) {
    const c = {};
    const parse = (t, k) => { let i = 0; while (i < t.length) {
      if (t[i] === '(') { let d = 1, j = i + 1; while (d) { if (t[j] === '(') d++; if (t[j] === ')') d--; j++; } const m = t.slice(j).match(/^\d*/)[0]; parse(t.slice(i + 1, j - 1), k * (+m || 1)); i = j + m.length; continue; }
      const m = t.slice(i).match(/^([A-Z][a-z]?)(\d*)/); c[m[1]] = (c[m[1]] || 0) + k * (+m[2] || 1); i += m[0].length; } };
    parse(f, 1); return c;
  }
  const cargaDe = f => (f.includes('^') ? (+(f.match(/\^(\d*)/)[1] || 1)) * (f.endsWith('+') ? 1 : -1) : 0);
  // EO que casi no cambian (los de la regla de la idea 1).
  const FIJO = { O: -2, H: 1, Li: 1, Na: 1, K: 1, Ca: 2, Mg: 2, Ba: 2, Al: 3, F: -1 };
  const FIJO_TXT = { O: 'EO del O: −2', H: 'EO del H: +1 (junto a un no metal)', K: 'EO del K: +1 (grupo 1)', Na: 'EO del Na: +1 (grupo 1)', Ca: 'EO del Ca: +2 (grupo 2)',
    Ba: 'EO del Ba: +2 (grupo 2)', Mg: 'EO del Mg: +2 (grupo 2)', Al: 'EO del Al: +3', Li: 'EO del Li: +1 (grupo 1)' };
  const FORMULA_EO = 'Σ n · EO = carga de la especie (0 si es neutra); n: número de átomos de cada elemento';
  const conocidos = (f, x) => { const at = atomos(f.split('^')[0]); return Object.keys(at).filter(s => s !== x).reduce((a, s) => a + FIJO[s] * at[s], 0); };
  const eoDe = (f, x) => (cargaDe(f) - conocidos(f, x)) / atomos(f.split('^')[0])[x];
  const datosEO = (f, x) => [...Object.keys(atomos(f.split('^')[0])).filter(s => s !== x && FIJO_TXT[s]).map(s => FIJO_TXT[s]), FORMULA_EO];

  // ---- Tipos ----
  const TIPOS_POR_IDEA = {
    'estados-oxidacion': ['eo-neutro', 'eo-ion', 'eo-dos', 'cual-eo'],
    'tres-nombres': ['stock-oxido', 'trad-oxido', 'formula-oxido'],
    'peroxidos-hidruros': ['formula-peroxido', 'hidracido', 'eo-raro'],
    'arbol-funciones': ['formula-hidroxido', 'formula-oxacido', 'nombre-oxacido'],
    sales: ['anion', 'formula-sal', 'nombre-sal'],
    'sales-acidas-basicas-hidratadas': ['clase-sal', 'oxigenos-hidrato'],
  };
  const IDEAS = Object.keys(TIPOS_POR_IDEA);
  const IDEA_DE = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map(t => [t, i])));
  const NIVEL = { 'eo-neutro': 1, 'eo-ion': 2, 'eo-dos': 2, 'cual-eo': 3, 'stock-oxido': 1, 'trad-oxido': 2, 'formula-oxido': 2, 'formula-peroxido': 1, hidracido: 1, 'eo-raro': 2,
    'formula-hidroxido': 1, 'formula-oxacido': 2, 'nombre-oxacido': 3, anion: 1, 'formula-sal': 2, 'nombre-sal': 3, 'clase-sal': 1, 'oxigenos-hidrato': 3 };
  const DOCUMENTADOS = { NO1: 'documentado', NO2: 'parcial', NO3: 'parcial', NO4: 'parcial' };
  const err = (id, texto, explicacion) => ({ id, clave: texto, texto, explicacion, respaldo: DOCUMENTADOS[id] || 'hipotesis', fuente: FUENTE });
  const CONV = ['stock-oxido', 'trad-oxido', 'formula-oxido', 'nombre-oxacido', 'nombre-sal'];
  // Elige 3 o 4 errores con los que la correcta no queda como la alternativa «central» (se adivinaría sin resolver): la
  // misma medida que nucleo/probar-generador.js (trozos que difieren).
  const trozos = t => String(t).replace(/[()]/g, ' ').split(/[\s;,]+|(?=[+−\-·/])|(?<=[+−\-·/])/).filter(Boolean);
  const dist = (a, b) => { const A = trozos(a), B = trozos(b); let d = 0; for (let i = 0; i < Math.max(A.length, B.length); i++) if (A[i] !== B[i]) d++; return d; };
  function* combinaciones(l, k, i = 0, acc = []) { if (acc.length === k) { yield acc; return; } for (let j = i; j < l.length; j++) yield* combinaciones(l, k, j + 1, [...acc, l[j]]); }
  function elegirSinFuga(correcta, pool) {
    for (const k of [4, 3]) for (const sub of combinaciones(pool, Math.min(k, pool.length))) {
      if (sub.length < 3) continue;
      const al = [correcta, ...sub.map(e => e.texto)], sc = al.map(a => al.reduce((t, b) => t + dist(a, b), 0)), min = Math.min(...sc);
      if (!(sc[0] === min && sc.filter(x => x === min).length === 1)) return sub;
    }
    return null;
  }
  function cerrar(rng, semilla, tipo, o) {
    const vistos = new Set([o.correcta]), pool = [];
    for (const e of rng.barajar(o.errores)) if (e && e.texto && !vistos.has(e.texto)) { vistos.add(e.texto); pool.push(e); }
    if (pool.length < 3) return null;
    const sub = elegirSinFuga(o.correcta, pool);
    if (!sub) return null;
    const alternativas = P.armarTexto({ correcta: { clave: o.correcta, texto: o.correcta }, errores: sub, rng });
    if (o.datos.some(d => d === o.correcta || d.includes(`= ${o.correcta}`))) return null;
    const usadas = new Set();
    for (const linea of [o.enunciado, o.pregunta, ...o.solucion]) for (const x of linea) if (x && typeof x === 'object' && x.v) usadas.add(x.v);
    const p = { id: `${ID}#${semilla}`, unidadCatalogo: UNIDAD, variables: Object.fromEntries([...usadas].map(k => [k, Object.assign({}, VARS[k])])),
      enunciado: o.enunciado, pregunta: o.pregunta, datos: o.datos, alternativas, solucion: o.solucion, respuesta: { valor: o.correcta, unidad: '' },
      _datos: Object.assign({ idea: IDEA_DE[tipo], tipo, nivel: NIVEL[tipo] }, o._datos) };
    if (CONV.includes(tipo)) p.convenciones = ['nomenclatura-examen'];
    return p;
  }

  // ---- Idea 1: estados de oxidación ----
  const NEUTROS = [['H2SO3', 'S'], ['HClO3', 'Cl'], ['HBrO4', 'Br'], ['KNO2', 'N'], ['H3BO3', 'B'], ['K2MnO4', 'Mn'], ['CaSO3', 'S'], ['H3PO3', 'P'], ['KClO', 'Cl'], ['BaCO3', 'C']];
  const IONES = [['SO3^2-', 'S'], ['PO4^3-', 'P'], ['ClO2^-', 'Cl'], ['BrO3^-', 'Br'], ['IO4^-', 'I'], ['CrO4^2-', 'Cr'], ['HSO4^-', 'S'], ['H2PO4^-', 'P'], ['NH4^+', 'N'], ['HCO3^-', 'C']];
  const DOS = [['N2O3', 'N'], ['Cl2O7', 'Cl'], ['Mn2O7', 'Mn'], ['Cr2O3', 'Cr'], ['P2O7^4-', 'P'], ['H4P2O7', 'P'], ['B4O7^2-', 'B'], ['C2O4^2-', 'C'], ['K2Cr2O7', 'Cr'], ['N2O5', 'N']];
  function erroresEO(f, x) {
    const n = atomos(f.split('^')[0])[x], z = cargaDe(f), s0 = conocidos(f, x), bien = eoDe(f, x), suma = val => s0 + n * val, out = [];
    if (n > 1) out.push(err('QM-OX-TOTAL', sg(n * bien), `Bien la cuenta del total: los ${n} ${x} juntos aportan ${sg(n * bien)}. Cada uno, la parte ${n === 2 ? 'mitad' : `${n}.ª`}.`));
    if (n > 1 && n !== bien) out.push(err('QM-OX-SUBINDICE', sg(n), `El ${n} es el subíndice: cuenta átomos. Con ${sg(n)} la suma daría ${sg(suma(n))}.`));
    if (z !== 0 && Number.isInteger(-s0 / n)) out.push(err('NO4', sg(-s0 / n), `Con ${sg(-s0 / n)} la suma da 0: valdría si fuera neutra. La carga es ${sg(z)}.`));
    out.push(err('QM-OX-SIGNO', sg(-bien), `Bien el tamaño. Con el signo cambiado la suma daría ${sg(suma(-bien))}, no ${sg(z)}.`));
    for (const d of [2, -2, 1]) out.push(err('QM-OX-SUMA', sg(bien + d), `Con ${sg(bien + d)} la suma daría ${sg(suma(bien + d))}, no ${sg(z)}.`));
    return out.filter(e => e.texto !== sg(bien) && Math.abs(+e.texto.replace('−', '-')) <= 8);
  }
  function casoEO(rng, lista) {
    const [f, x] = rng.elegir(lista), bien = eoDe(f, x), n = atomos(f.split('^')[0])[x];
    return { correcta: sg(bien), _datos: { f, x },
      enunciado: [`La especie ${bonita(f)}${n > 1 ? `, con ${n} átomos de ${x}` : ''}.`], pregunta: ['¿Qué ', v('EO', 'estado de oxidación (EO)'), ` tiene ${n > 1 ? 'cada' : 'el'} ${x}?`],
      datos: datosEO(f, x), errores: erroresEO(f, x),
      solucion: [[`Los demás átomos suman ${sg(conocidos(f, x))}; la carga es ${sg(cargaDe(f))}.`], [`${n > 1 ? `${n} · ` : ''}`, v('EO', 'EO'), ` ${sg(conocidos(f, x))} = ${sg(cargaDe(f))} → `, v('EO', 'EO'), ` = ${sg(bien)}`]] };
  }
  const CUAL = { S: ['CaSO3', 'K2SO4', 'H2S', 'S8'], Cl: ['HClO3', 'KClO4', 'KCl', 'Cl2O3'], N: ['KNO2', 'N2O5', 'NH3', 'N2O'], C: ['H2CO3', 'C2O4^2-', 'CH4', 'CO'] };
  const eoCual = (f, x) => (Object.keys(atomos(f.split('^')[0])).length === 1 ? 0 : x === 'Cl' && f === 'KCl' ? -1 : eoDe(f, x));
  function cualEO(rng) {
    const x = rng.elegir(Object.keys(CUAL)), lista = CUAL[x], meta = rng.elegir(lista), vm = eoCual(meta, x);
    return { correcta: bonita(meta), _datos: { x, meta, lista },
      enunciado: [`Las especies ${lista.map(bonita).join(', ')}.`], pregunta: ['¿En cuál el ', x, ' tiene ', v('EO', 'EO'), ` ${sg(vm)}?`],
      datos: [...new Set(lista.flatMap(f => Object.keys(atomos(f.split('^')[0])).filter(s => s !== x && FIJO_TXT[s]).map(s => FIJO_TXT[s])))].concat([FORMULA_EO, 'En un elemento solo, el EO es 0']),
      errores: lista.filter(f => f !== meta).map(f => err('QM-OX-CUAL', bonita(f), `Bien hacer la cuenta. En el ${bonita(f)} el ${x} tiene EO ${sg(eoCual(f, x))}.`)),
      solucion: [[lista.map(f => `${bonita(f)}: ${sg(eoCual(f, x))}`).join('; ')]] };
  }

  // ---- Idea 2: óxidos y sus tres nombres ----
  // [fórmula, elemento, EO, EO del elemento, stock, tradicional] (comprobados con OPSIN y la cuenta de cargas).
  const OXIDOS = [['CoO', 'cobalto', 2, [2, 3], 'óxido de cobalto(II)', 'óxido cobaltoso'], ['Co2O3', 'cobalto', 3, [2, 3], 'óxido de cobalto(III)', 'óxido cobáltico'],
    ['NiO', 'níquel', 2, [2, 3], 'óxido de níquel(II)', 'óxido niqueloso'], ['Ni2O3', 'níquel', 3, [2, 3], 'óxido de níquel(III)', 'óxido niquélico'],
    ['Hg2O', 'mercurio', 1, [1, 2], 'óxido de mercurio(I)', 'óxido mercurioso'], ['HgO', 'mercurio', 2, [1, 2], 'óxido de mercurio(II)', 'óxido mercúrico'],
    ['FeO', 'hierro', 2, [2, 3], 'óxido de hierro(II)', 'óxido ferroso'], ['Fe2O3', 'hierro', 3, [2, 3], 'óxido de hierro(III)', 'óxido férrico'],
    ['SnO2', 'estaño', 4, [2, 4], 'óxido de estaño(IV)', 'óxido estánnico'], ['PbO', 'plomo', 2, [2, 4], 'óxido de plomo(II)', 'óxido plumboso'],
    ['Cu2O', 'cobre', 1, [1, 2], 'óxido de cobre(I)', 'óxido cuproso'], ['Au2O3', 'oro', 3, [1, 3], 'óxido de oro(III)', 'óxido áurico']];
  const ROM = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  const otro = (o, e) => OXIDOS.find(x => x[1] === o[1] && x[2] !== o[2]);
  function stockOxido(rng) {
    const o = rng.elegir(OXIDOS), [f, el, w, ws, st, tr] = o, at = atomos(f), sim = Object.keys(at).find(s => s !== 'O'), ne = at[sim], no = at.O, ot = otro(o);
    return { correcta: st, _datos: { f },
      enunciado: [`El óxido ${bonita(f)}. El ${el} tiene EO ${ws.map(sg).join(' y ')}.`], pregunta: ['¿Cuál es su nombre Stock?'],
      datos: ['EO del O: −2', 'Stock: «óxido de» + elemento + su EO en romanos entre paréntesis', 'Romanos: I 1, II 2, III 3, IV 4'],
      errores: [ne > 1 && ne !== w ? err('QM-ROMANO', `óxido de ${el}(${ROM[ne]})`, `Bien usar el romano. Pero el ${ROM[ne]} contaría los ${ne} átomos; el EO es ${sg(w)}.`) : null,
        no > 1 && no !== w ? err('QM-ROMANO-O', `óxido de ${el}(${ROM[no]})`, `El ${ROM[no]} contaría los ${no} oxígenos. El EO del ${el} es ${sg(w)}.`) : null,
        ot ? err('QM-OX-SUMA', ot[4], `Ese es el otro óxido del ${el}, el ${bonita(ot[0])}, con EO ${sg(ot[2])}.`) : null,
        err('QM-ROMANO-UNO', `óxido de ${el}`, `Sin romano sirve con un solo EO. El ${el} tiene dos.`),
        err('QM-SISTEMA', tr, 'Ese es el nombre tradicional: la misma sustancia, otro sistema.')],
      solucion: [[`${no} O aportan ${sg(-2 * no)}: el ${el} tiene ${sg(w)}.`], [`${bonita(f)}: ${st}`]] };
  }
  function tradOxido(rng) {
    const o = rng.elegir(OXIDOS), [f, el, w, ws, st, tr] = o, ot = otro(o);
    return { correcta: tr, _datos: { f },
      enunciado: [`El óxido ${bonita(f)}. El ${el} tiene EO ${ws.map(sg).join(' y ')}.`], pregunta: ['¿Cuál es su nombre tradicional?'],
      datos: ['EO del O: −2', 'Tradicional, elemento con dos EO: -oso para el menor e -ico para el mayor'],
      errores: [ot ? err('QM-OSO-ICO', ot[5], `Bien la raíz. Pero ${w === Math.max(...ws) ? '-oso es del EO menor' : '-ico es del EO mayor'}; aquí el ${el} tiene ${sg(w)}.`) : null,
        err('QM-SISTEMA', st, 'Ese es el nombre Stock: la misma sustancia, otro sistema.'),
        err('QM-ROMANO-UNO', `óxido de ${el}`, 'Sin terminación ni romano no se sabe cuál de los dos óxidos es.')],
      solucion: [[`El ${el} tiene ${sg(w)}, el ${w === Math.max(...ws) ? 'mayor' : 'menor'} de sus dos EO.`], [`${bonita(f)}: ${tr}`]] };
  }
  function formulaOxido(rng) {
    const o = rng.elegir(OXIDOS), [f, el, w, , st] = o, at = atomos(f), sim = Object.keys(at).find(s => s !== 'O'), g = (a, b) => (b ? g(b, a % b) : a);
    const sin = bonita(`${sim}2O${w}`), uno = bonita(w === 1 ? `${sim}O` : `${sim}O${w}`), inv = w === 2 ? null : bonita(`${sim}${w / g(w, 2) === 1 ? '' : w / g(w, 2)}O${2 / g(w, 2) === 1 ? '' : 2 / g(w, 2)}`);
    const carga = (a, b) => sg(a * w - 2 * b);
    return { correcta: bonita(f), _datos: { f },
      enunciado: [`El ${st}.`], pregunta: ['¿Cuál es su fórmula?'], datos: ['EO del O: −2', 'La fórmula junta los átomos hasta carga 0, con los números más chicos', 'Romanos: I 1, II 2, III 3, IV 4'],
      errores: [err('QM-SIMPLIFICA', sin, `Bien juntar las cargas: ${sin} es neutra, pero se simplifica.`),
        inv ? err('QM-FORM-CRUCE', inv, `Con esa fórmula la carga queda en ${carga(w / g(w, 2), 2 / g(w, 2))}: los números van al revés.`) : null,
        err('QM-FORM-UNO', uno, `Un ${sim} con ${w === 1 ? 1 : w} O deja carga ${carga(1, w === 1 ? 1 : w)}, no 0.`),
        err('NO2', bonita(`${sim}O2`), `Un ${sim} con dos O deja carga ${carga(1, 2)}, no 0.`)],
      solucion: [[`${at[sim]} ${sim} con ${sg(w)} y ${at.O} O con −2 dan carga 0.`], [bonita(f)]] };
  }

  // ---- Idea 3: peróxidos, hidruros e hidrácidos ----
  const PEROX = [['Li', 'litio', 1], ['K', 'potasio', 1], ['Na', 'sodio', 1], ['Ca', 'calcio', 2], ['Mg', 'magnesio', 2], ['Ba', 'bario', 2]];
  function formulaPeroxido(rng) {
    const [s, n, q] = rng.elegir(PEROX), bien = bonita(q === 1 ? `${s}2O2` : `${s}O2`);
    return { correcta: bien, _datos: { s, q },
      enunciado: [`El peróxido de ${n}. El ${s} tiene EO ${sg(q)}.`], pregunta: ['¿Cuál es su fórmula?'],
      datos: ['Peróxido: tiene el ion O₂²⁻, dos O unidos, cada uno con EO −1', 'Un ion de varios átomos no se parte: el O₂²⁻ va entero'],
      errores: q === 1 ? [err('QM-PEROX-SIMPL', bonita(`${s}O`), 'Bien el uno a uno. Pero el ion O₂²⁻ no se parte: no se simplifica.'), err('QM-FUNCION', bonita(`${s}2O`), `Ese es el óxido, con el O a −2.`),
        err('NO2', bonita(`${s}2O4`), 'Dos iones O₂²⁻ con dos cationes de +1 dejan carga −2.')]
        : [err('QM-FUNCION', bonita(`${s}O`), 'Ese es el óxido, con el O a −2.'), err('NO2', bonita(`${s}2O2`), 'Dos cationes de +2 con un O₂²⁻ dejan carga +2.'), err('NO2', bonita(`${s}O4`), 'Dos iones O₂²⁻ con un catión de +2 dejan carga −2.')],
      solucion: [[`${q === 1 ? 'Dos' : 'Un'} ${s} y un O₂²⁻ dejan carga 0.`], [bien]] };
  }
  const HIDRA = [['HCl', 'clor', 'cloruro'], ['HBr', 'brom', 'bromuro'], ['HI', 'yod', 'yoduro'], ['HF', 'fluor', 'fluoruro'], ['H2S', 'sulf', 'sulfuro'], ['H2Se', 'selen', 'seleniuro']];
  const TILDE = { clor: 'clór', brom: 'bróm', yod: 'yód', fluor: 'fluór', sulf: 'sulfúr', selen: 'selén' };
  function hidracido(rng) {
    const [f, raiz, uro] = rng.elegir(HIDRA), bien = `ácido ${raiz}hídrico`;
    return { correcta: bien, _datos: { f },
      enunciado: [`El ${bonita(f)} disuelto en agua, ${bonita(f)}(ac).`], pregunta: ['¿Cómo se llama?'],
      datos: ['Hidrácido: ácido + raíz del no metal + -hídrico', `Raíz: ${raiz}-`, 'Sin agua, el gas: el no metal con -uro + «de hidrógeno»'],
      errores: [err('QM-HIDRACIDO-GAS', `${uro} de hidrógeno`, 'Ese es el nombre del gas, sin agua. Disuelto es un ácido.'),
        err('QM-HIDR-ICO', `ácido ${TILDE[raiz]}ico`, '-ico es de un ácido con oxígeno. Este no tiene oxígeno.'), err('QM-HIDR-ICO', `ácido ${raiz === 'sulf' ? 'sulfur' : raiz}oso`, '-oso es de un ácido con oxígeno. Este no tiene oxígeno.')],
      solucion: [['Ácido sin oxígeno: ácido + raíz + -hídrico.'], [`${bonita(f)}(ac): ${bien}`]] };
  }
  const RAROS = [['LiH', 'H', -1], ['KH', 'H', -1], ['AlH3', 'H', -1], ['BaH2', 'H', -1], ['K2O2', 'O', -1], ['CaO2', 'O', -1], ['Li2O2', 'O', -1], ['MgO2', 'O', -1]];
  function eoRaro(rng) {
    const [f, x, bien] = rng.elegir(RAROS), at = atomos(f), otroEl = Object.keys(at).find(s => s !== x), aporta = FIJO[otroEl] * at[otroEl], nx = at[x];
    return { correcta: sg(bien), _datos: { f, x },
      enunciado: [`El compuesto ${bonita(f)}.`], pregunta: ['¿Qué ', v('EO', 'EO'), ` tiene cada ${x}?`], datos: [FIJO_TXT[otroEl], FORMULA_EO],
      errores: [err(x === 'H' ? 'QM-OX-H' : 'QM-OX-O', x === 'H' ? '+1' : '−2', `Ese es el valor de siempre. Con él la suma daría ${sg(aporta + nx * (x === 'H' ? 1 : -2))}, no 0.`),
        err('QM-OX-CERO', '0', `0 es de un elemento solo. Aquí la suma daría ${sg(aporta)}.`), err('QM-OX-SIGNO', x === 'H' ? '−2' : '+1', `Con ese valor la suma daría ${sg(aporta + nx * (x === 'H' ? -2 : 1))}, no 0.`),
        ...[-3, 2, 3].map(w => err('QM-OX-SUMA', sg(w), `Con ${sg(w)} la suma daría ${sg(aporta + nx * w)}, no 0.`))],
      solucion: [[`El ${otroEl} aporta ${sg(aporta)}; ${nx > 1 ? `los ${nx} ${x}` : `el ${x}`} deben aportar ${sg(-aporta)}.`], [v('EO', 'EO'), ` = ${sg(bien)}`]] };
  }

  // ---- Idea 4: hidróxidos y oxácidos ----
  const HIDROX = [['Co', 'cobalto', 2], ['Co', 'cobalto', 3], ['Ni', 'níquel', 2], ['Ba', 'bario', 2], ['Li', 'litio', 1], ['Fe', 'hierro', 3], ['Al', 'aluminio', 3], ['Zn', 'zinc', 2]];
  function formulaHidroxido(rng) {
    const [s, n, q] = rng.elegir(HIDROX), bien = bonita(q === 1 ? `${s}OH` : `${s}(OH)${q}`);
    return { correcta: bien, _datos: { s, q },
      enunciado: [`El ${n} con EO ${sg(q)}.`], pregunta: ['¿Cuál es la fórmula de su hidróxido?'],
      datos: ['Hidróxido: un OH⁻ (carga −1) por cada unidad de EO del metal, entre paréntesis si se repite'],
      errores: [q > 1 ? err('NO1', bonita(`${s}OH${q}`), `Bien los ${q} OH. Sin paréntesis el ${q} toca solo al H.`) : err('NO2', bonita(`${s}(OH)2`), 'Dos OH⁻ con +1 dejan carga −1.'),
        q > 1 ? err('NO2', bonita(`${s}OH`), `Un solo OH⁻ deja carga ${sg(q - 1)}, no 0.`) : null,
        err('QM-FUNCION', bonita(q === 1 ? `${s}2O` : q === 2 ? `${s}O` : `${s}2O${q}`), 'Ese es el óxido. El hidróxido lleva OH⁻.'),
        err('QM-FUNCION', bonita(q === 1 ? `${s}H` : `${s}H${q}`), 'Ese sería el hidruro, sin oxígeno.')],
      solucion: [[`Hacen falta ${q} OH⁻ para compensar ${sg(q)}.`], [bien]] };
  }
  // [elemento, EO, fórmula del oxácido, nombre, óxido, fórmula sin simplificar]
  const OXAC = [['Br', 5, 'HBrO3', 'ácido brómico', 'Br2O5', 'H2Br2O6'], ['I', 7, 'HIO4', 'ácido peryódico', 'I2O7', 'H2I2O8'], ['Se', 6, 'H2SeO4', 'ácido selénico', 'SeO3', null],
    ['Br', 1, 'HBrO', 'ácido hipobromoso', 'Br2O', 'H2Br2O2'], ['I', 1, 'HIO', 'ácido hipoyodoso', 'I2O', 'H2I2O2'], ['Se', 4, 'H2SeO3', 'ácido selenioso', 'SeO2', null],
    ['Br', 7, 'HBrO4', 'ácido perbrómico', 'Br2O7', 'H2Br2O8'], ['Br', 3, 'HBrO2', 'ácido bromoso', 'Br2O3', 'H2Br2O4'], ['I', 5, 'HIO3', 'ácido yódico', 'I2O5', 'H2I2O6'],
    ['S', 4, 'H2SO3', 'ácido sulfuroso', 'SO2', null], ['N', 3, 'HNO2', 'ácido nitroso', 'N2O3', 'H2N2O4'], ['Cl', 1, 'HClO', 'ácido hipocloroso', 'Cl2O', 'H2Cl2O2']];
  const sumaEO = (h, w, o) => h + w - 2 * o;
  function formulaOxacido(rng) {
    const [e, w, f, nom, ox, sin] = rng.elegir(OXAC), at = atomos(f);
    const dosH = at.H === 1 ? bonita(`H2${e}O${at.O}`) : null, unH = at.H === 2 ? bonita(`H${e}O${at.O}`) : null;
    return { correcta: bonita(f), _datos: { f, w, e },
      enunciado: [`El ${nom}, con el ${e} a EO ${sg(w)}.`], pregunta: ['¿Cuál es su fórmula?'],
      datos: ['Oxácido: óxido ácido + H₂O; se suman los átomos y se simplifica si se puede', `Su óxido: ${bonita(ox)}`, 'EO del O: −2; del H: +1'],
      errores: [sin ? err('QM-SIMPLIFICA', bonita(sin), 'Bien sumar el óxido y el agua. Falta simplificar entre 2.') : null,
        dosH ? err('QM-OXACIDO-H', dosH, `No todo oxácido lleva 2 H: la suma de los EO daría ${sg(sumaEO(2, w, at.O))}.`) : null,
        unH ? err('QM-OXACIDO-H', unH, `Con un solo H la suma de los EO daría ${sg(sumaEO(1, w, at.O))}.`) : null,
        err('QM-FUNCION', bonita(ox), 'Ese es el óxido ácido. Falta sumarle el agua.'),
        err('QM-OXACIDO-O', bonita(`H${at.H > 1 ? at.H : ''}${e}O${at.O + 1}`), `Con un O de más la suma de los EO daría ${sg(sumaEO(at.H, w, at.O + 1))}.`)],
      solucion: [[`${bonita(ox)} + H₂O → ${bonita(sin || f)}${sin ? `, que se simplifica a ${bonita(f)}` : ''}.`]] };
  }
  const ESTADOS_NM = { Br: [1, 3, 5, 7], I: [1, 3, 5, 7], Cl: [1, 3, 5, 7], Se: [4, 6], S: [4, 6], N: [3, 5] };
  const nombreDe = (e, w) => (OXAC.find(x => x[0] === e && x[1] === w) || [])[3] || ({ 'Cl3': 'ácido cloroso', 'Cl5': 'ácido clórico', 'Cl7': 'ácido perclórico', 'I3': 'ácido yodoso', 'S6': 'ácido sulfúrico', 'N5': 'ácido nítrico' })[`${e}${w}`];
  function nombreOxacido(rng) {
    const [e, w, f, nom] = rng.elegir(OXAC), otros = ESTADOS_NM[e].filter(x => x !== w);
    return { correcta: nom, _datos: { f, w, e },
      enunciado: [`El oxácido ${bonita(f)}.`], pregunta: ['¿Cómo se llama?'],
      datos: [`EO del ${e} en sus oxácidos: ${ESTADOS_NM[e].map(sg).join(', ')}`, ESTADOS_NM[e].length === 4 ? 'Con cuatro EO: hipo-…-oso, -oso, -ico, per-…-ico' : 'Con dos EO: -oso el menor e -ico el mayor', 'EO del O: −2; del H: +1'],
      errores: otros.map(x => err('QM-OSO-ICO', nombreDe(e, x), `Ese es el oxácido con EO ${sg(x)}. Aquí el ${e} tiene ${sg(w)}.`)),
      solucion: [[`El ${e} tiene ${sg(w)}: la suma de los EO da 0.`], [`${bonita(f)}: ${nom}`]] };
  }

  // ---- Idea 5: sales ----
  // Aniones: [fórmula, nombre, ácido, nombre del ácido, nombre con la terminación al revés]
  const ANIONES = [['BrO3^-', 'bromato', 'HBrO3', 'ácido brómico', 'bromito'], ['SO3^2-', 'sulfito', 'H2SO3', 'ácido sulfuroso', 'sulfato'], ['IO^-', 'hipoyodito', 'HIO', 'ácido hipoyodoso', 'hipoyodato'],
    ['ClO4^-', 'perclorato', 'HClO4', 'ácido perclórico', 'perclorito'], ['NO2^-', 'nitrito', 'HNO2', 'ácido nitroso', 'nitrato'], ['SeO4^2-', 'selenato', 'H2SeO4', 'ácido selénico', 'selenito'],
    ['PO4^3-', 'fosfato', 'H3PO4', 'ácido fosfórico', 'fosfito'], ['ClO2^-', 'clorito', 'HClO2', 'ácido cloroso', 'clorato']];
  function anion(rng) {
    const [a, n, ac, nac, rev] = rng.elegir(ANIONES), raiz = nac.replace('ácido ', '');
    return { correcta: n, _datos: { a },
      enunciado: [`El ${nac}, ${bonita(ac)}, suelta sus H⁺ y deja el anión ${bonita(a)}.`], pregunta: ['¿Cómo se llama ese anión?'],
      datos: ['Anión de un ácido: -hídrico → -uro; -oso → -ito; -ico → -ato (hipo- y per- se quedan)'],
      errores: [err('QM-ITO-ATO', rev, 'Bien cambiar la terminación, pero va al revés: -oso → -ito y -ico → -ato.'),
        err('QM-URO', n.replace(/(ito|ato)$/, 'uro'), '-uro es de los aniones sin oxígeno. Este tiene oxígeno.'), err('QM-SIN-CAMBIO', raiz, 'Ese es el adjetivo del ácido: el anión cambia su terminación.')],
      solucion: [[`${nac}: ${raiz.endsWith('oso') ? '-oso → -ito' : '-ico → -ato'}.`], [`${bonita(a)}: ${n}`]] };
  }
  // Cationes: [fórmula, nombre Stock del catión, carga]
  const CATIONES = [['Mg', 'magnesio', 2], ['Ba', 'bario', 2], ['Zn', 'zinc', 2], ['Cu', 'cobre(II)', 2], ['Fe', 'hierro(II)', 2], ['K', 'potasio', 1], ['Al', 'aluminio', 3]];
  const mcd = (a, b) => (b ? mcd(b, a % b) : a);
  function sal(c, a) {
    const A = ANIONES.find(x => x[0] === a), qa = -cargaDe(a), cuerpo = a.split('^')[0], poli = Object.keys(atomos(cuerpo)).length > 1 || atomos(cuerpo)[Object.keys(atomos(cuerpo))[0]] > 1;
    const g = mcd(c[2], qa), nc = qa / g, na = c[2] / g;
    const f = `${c[0]}${nc > 1 ? nc : ''}${poli && na > 1 ? `(${cuerpo})${na}` : `${cuerpo}${na > 1 ? na : ''}`}`;
    return { f, nombre: `${A[1]} de ${c[1]}`, nc, na, cuerpo, qa, A };
  }
  function formulaSal(rng) {
    const c = rng.elegir(CATIONES), a = rng.elegir(ANIONES)[0], s = sal(c, a), bien = bonita(s.f);
    const romp = s.na > 1 ? bonita(`${c[0]}${s.nc > 1 ? s.nc : ''}${s.cuerpo}${s.na}`) : null, uno = bonita(`${c[0]}${s.cuerpo}`);
    const inv = s.nc !== s.na ? bonita(`${c[0]}${s.na > 1 ? s.na : ''}${s.nc > 1 ? `(${s.cuerpo})${s.nc}` : s.cuerpo}`) : null;
    return { correcta: bien, _datos: { c: c[0], a },
      enunciado: [`El ${s.nombre}.`], pregunta: ['¿Cuál es su fórmula?'],
      datos: ['La sal junta fichas enteras de catión y anión hasta carga 0, con los números más chicos', 'Un ion de varios átomos va entre paréntesis si se repite', `Iones: ${c[0]}${c[2] > 1 ? SUPS[c[2]] : ''}⁺ y ${bonita(a)}`],
      errores: [romp && romp !== bien ? err('QM-POLI', romp, `Bien las cantidades. Sin paréntesis el ${s.na} toca solo al último átomo.`) : null,
        uno !== bien ? err('NO2', uno, `Uno de cada deja carga ${sg(c[2] - s.qa)}, no 0.`) : null,
        inv ? err('NO1', inv, `Al revés: la carga queda en ${sg(s.na * c[2] - s.nc * s.qa)}.`) : null,
        err('QM-SIMPLIFICA', bonita(`${c[0]}${2 * s.nc}(${s.cuerpo})${2 * s.na}`), 'Es neutra, pero no es la proporción más chica.')],
      solucion: [[`${s.nc} ${c[0]} y ${s.na} ${bonita(a)} dejan carga 0.`], [bien]] };
  }
  function nombreSal(rng) {
    const c = rng.elegir(CATIONES), A = rng.elegir(ANIONES), s = sal(c, A[0]);
    return { correcta: s.nombre, _datos: { c: c[0], a: A[0] },
      enunciado: [`La sal ${bonita(s.f)}. Su anión, ${bonita(A[0])}, viene del ${A[3]}.`], pregunta: ['¿Cuál es su nombre Stock?'],
      datos: ['Anión de un ácido: -hídrico → -uro; -oso → -ito; -ico → -ato (hipo- y per- se quedan)', 'Nombre de la sal: el anión + «de» + el catión (con su EO en romanos si tiene dos)'],
      errores: [err('QM-ITO-ATO', `${A[4]} de ${c[1]}`, 'Bien la raíz. Pero la terminación va al revés: -oso → -ito y -ico → -ato.'),
        err('QM-URO', `${A[1].replace(/(ito|ato)$/, 'uro')} de ${c[1]}`, '-uro es de los aniones sin oxígeno.'),
        err('QM-SIN-CAMBIO', `${A[3].replace('ácido ', '')} de ${c[1]}`, 'Ese es el adjetivo del ácido: en la sal, el anión cambia su terminación.')],
      solucion: [[`El anión es ${A[1]}; el catión, ${c[1]}.`], [`${bonita(s.f)}: ${s.nombre}`]] };
  }

  // ---- Idea 6: sales ácidas, básicas e hidratadas ----
  const SALES6 = [['KHCO3', 'ácida'], ['NaHSO4', 'ácida'], ['CaHPO4', 'ácida'], ['Ba(OH)Cl', 'básica'], ['Al(OH)SO4', 'básica'], ['Ca(OH)Cl', 'básica'],
    ['FeSO4·7H2O', 'hidratada'], ['BaCl2·2H2O', 'hidratada'], ['Na2SO4·10H2O', 'hidratada'], ['K2SO4', 'neutra'], ['CaCO3', 'neutra'], ['MgCl2', 'neutra']];
  const SI_CLASE = { ácida: 'Sería ácida si su anión conservara un H, como el HCO₃⁻.', básica: 'Sería básica si llevara OH⁻ además del anión.',
    hidratada: 'Sería hidratada si tuviera agua tras el punto (·nH₂O).', neutra: 'Sería neutra si solo tuviera catión y anión.' };
  function claseSal(rng) {
    const [f, cl] = rng.elegir(SALES6);
    return { correcta: `Sal ${cl}`, _datos: { f },
      enunciado: [`La sal ${bonita(f)}.`], pregunta: ['¿Qué clase de sal es?'],
      datos: ['Sal ácida: su anión conserva H. Sal básica: lleva OH⁻ además del anión. Sal hidratada: agua tras un punto (·nH₂O)', 'Sal neutra: solo un catión y un anión'],
      errores: ['ácida', 'básica', 'hidratada', 'neutra'].filter(k => k !== cl).map(k => err('QM-CLASE-SAL', `Sal ${k}`, SI_CLASE[k])),
      solucion: [[{ ácida: 'Su anión conserva un H.', básica: 'Lleva OH⁻ además del anión.', hidratada: 'Tiene agua tras el punto.', neutra: 'Solo catión y anión.' }[cl]]] };
  }
  const HIDRATOS = ['FeSO4·7H2O', 'BaCl2·2H2O', 'CoCl2·6H2O', 'Na2SO4·10H2O', 'MgSO4·7H2O', 'Na2CO3·10H2O', 'CuSO4·5H2O'];
  function oxigenosHidrato(rng) {
    const f = rng.elegir(HIDRATOS), [s, ag] = f.split('·'), n = +ag.match(/^\d+/)[0], os = atomos(s).O || 0, bien = os + n;
    return { correcta: String(bien), _datos: { f },
      enunciado: [`Una unidad de ${bonita(f)}.`], pregunta: ['¿Cuántos átomos de oxígeno tiene?'],
      datos: ['El ·nH₂O son n moléculas de agua enteras por cada unidad de la sal', 'El número delante del H₂O multiplica sus dos H y su O'],
      errores: [os ? err('QM-HIDRATO-CUENTA', String(os), `Esos son los O de la sal. Falta el O de cada una de las ${n} aguas.`) : null,
        err('QM-HIDRATO-CUENTA', String(n), os ? `Esos son los O del agua. Faltan los ${os} de la sal.` : 'Esos son los O del agua, bien; la sal no tiene O.'),
        err('QM-HIDRATO-CUENTA', String(os + 1), `Contaste una sola agua. El ${n} multiplica su O.`), err('QM-HIDRATO-CUENTA', String(os + 3 * n), 'Contaste los tres átomos de cada agua; cada una tiene un solo O.')],
      solucion: [[`La sal tiene ${os} O y cada una de las ${n} aguas, uno.`], [`${os} + ${n} = ${bien}`]] };
  }

  const CONSTRUIR = {
    'eo-neutro': r => casoEO(r, NEUTROS), 'eo-ion': r => casoEO(r, IONES), 'eo-dos': r => casoEO(r, DOS), 'cual-eo': cualEO,
    'stock-oxido': stockOxido, 'trad-oxido': tradOxido, 'formula-oxido': formulaOxido,
    'formula-peroxido': formulaPeroxido, hidracido, 'eo-raro': eoRaro,
    'formula-hidroxido': formulaHidroxido, 'formula-oxacido': formulaOxacido, 'nombre-oxacido': nombreOxacido,
    anion, 'formula-sal': formulaSal, 'nombre-sal': nombreSal, 'clase-sal': claseSal, 'oxigenos-hidrato': oxigenosHidrato,
  };
  function generar(semilla, opciones = {}) {
    const rng = Azar.crear(`${ID}|${semilla}`);
    const idea = TIPOS_POR_IDEA[opciones.idea] ? opciones.idea : rng.elegir(IDEAS), tipo = rng.elegir(TIPOS_POR_IDEA[idea]);
    for (let intento = 0; intento < 500; intento++) {
      const o = CONSTRUIR[tipo](rng);
      o.errores = o.errores.filter(Boolean);
      const p = cerrar(rng, semilla, tipo, o);
      if (p) return p;
    }
    throw new Error(`${ID}: no se pudo generar un problema de ${tipo}`);
  }
  return { id: ID, titulo: 'Estados de oxidación, nombres y fórmulas', generar, TIPOS_POR_IDEA, NIVEL, TIPOS: Object.keys(CONSTRUIR) };
});
