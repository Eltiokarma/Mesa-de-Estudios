/*
 * Generador «Moles, masa molar y composición» (mol-practica), formato "predicciones" (docs/arquitectura.md). Práctica por
 * idea de quimica.mol-y-composicion (docs/etapa8/propuesta-quimica.md §9). Funciona en el navegador
 * (window.Generadores['mol-practica']) y en Node (require). No usa la teoría ni el motor de la escena: trae sus propias
 * tablas (masas atómicas redondeadas, como en el examen; Nₐ = 6,02 × 10²³) y su propio lector de fórmulas.
 *
 * Tipos por idea (TIPOS_POR_IDEA; nivel 1 un paso, 2 dos pasos, 3 de examen). generar(semilla, { idea }) da solo los de
 * esa idea; sin idea, las seis con el mismo peso.
 *   masa-atomica-promedio         promedio-dos (1) · promedio-tres (2) · abundancia (3)
 *   mol-masa-molar                gramos-moles (1) · moles-moleculas (1) · gramos-moleculas (2) · dosis (3)
 *   relaciones-en-formula         moles-elemento (1) · gramos-elemento (2) · moles-iones (2) · atomos-dosis (3)
 *   composicion-formula-empirica  porcentaje (1) · masa-elemento (2) · agua-hidrato (3)
 *   formula-empirica-molecular    empirica-entera (1) · molecular (2) · empirica-medio (3)
 *   leyes-ponderales              lavoisier (1) · abierto (2) · proust (2) · dalton (3)
 * Colores (los de la unidad): m naranja, M turquesa, n violeta, N y porcentajes carmín.
 * Errores: ES3 a ES19 de docs/investigacion/estequiometria-ideas-erroneas.md (ES3, ES4, ES7, ES16, ES17 y ES18 con datos;
 * ES6, ES13, ES15 y ES19 parciales) y los QM- de la teoría (hipótesis). Cada explicación empieza por lo que el alumno
 * hizo bien y da el valor de su error.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar, nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'mol-practica', UNIDAD = 'quimica.mol-y-composicion', FUENTE = 'docs/investigacion/estequiometria-ideas-erroneas.md';
  const VARS = { m: { nombre: 'masa', color: 'o' }, M: { nombre: 'masa molar', color: 'i' }, n: { nombre: 'moles', color: 'f' }, N: { nombre: 'número de entidades', color: 'h' }, pct: { nombre: 'porcentaje', color: 'h' } };
  const v = P.v, F = P.formatear;
  const NA = 6.02e23, NA_TXT = '6,02 × 10²³';
  const MASA = { H: 1, C: 12, N: 14, O: 16, Na: 23, Mg: 24, Al: 27, P: 31, S: 32, Cl: 35.5, K: 39, Ca: 40, Cr: 52, Mn: 55, Fe: 56, Cu: 63.5, Zn: 65, Ba: 137 };
  const NOMBRE = { H: 'hidrógeno', C: 'carbono', N: 'nitrógeno', O: 'oxígeno', Na: 'sodio', Mg: 'magnesio', Al: 'aluminio', P: 'fósforo', S: 'azufre', K: 'potasio', Ca: 'calcio', Cr: 'cromo', Mn: 'manganeso', Fe: 'hierro', Cu: 'cobre', Zn: 'zinc', Ba: 'bario' };
  const SUBS = '₀₁₂₃₄₅₆₇₈₉', SUPS = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  const bonita = f => String(f).split('·').map((p, i) => (i ? p.replace(/^(\d+)/, '$1\u0000') : p).replace(/([A-Za-z)])(\d+)/g, (x, a, d) => a + d.split('').map(c => SUBS[+c]).join('')).replace('\u0000', '')).join('·');
  // «Ca(OH)2» → { Ca: 1, O: 2, H: 2 }; «CuSO4·5H2O» suma el agua.
  function atomos(f) {
    const c = {};
    const parse = (t, k) => { let i = 0; while (i < t.length) {
      if (t[i] === '(') { let d = 1, j = i + 1; while (d) { if (t[j] === '(') d++; if (t[j] === ')') d--; j++; } const m = t.slice(j).match(/^\d*/)[0]; parse(t.slice(i + 1, j - 1), k * (+m || 1)); i = j + m.length; continue; }
      const m = t.slice(i).match(/^([A-Z][a-z]?)(\d*)/); c[m[1]] = (c[m[1]] || 0) + k * (+m[2] || 1); i += m[0].length; } };
    String(f).split('·').forEach((p, i) => { const m = i ? p.match(/^(\d*)(.*)$/) : [null, '', p]; parse(m[2], +m[1] || 1); });
    return c;
  }
  const masaMolar = f => Object.entries(atomos(f)).reduce((s, [e, k]) => s + MASA[e] * k, 0);
  const sinSub = f => Object.keys(atomos(f)).reduce((s, e) => s + MASA[e], 0);
  const total = f => Object.values(atomos(f)).reduce((a, b) => a + b, 0);
  // Sin «=» (cierre, 20 nov): «N = 14» y «N = n · Nₐ» se leían como la misma N en un mismo recuadro.
  const masasTxt = els => `Masas atómicas redondeadas: ${els.map(e => `${e}\u00a0${F(MASA[e], 1)}`).join('; ')}`;
  const masasDe = (...fs) => masasTxt([...new Set(fs.flatMap(f => Object.keys(atomos(f))))]);
  function cien(x, d = 3) {
    let e = Math.floor(Math.log10(Math.abs(x))), man = x / 10 ** e;
    if (Math.abs(+man.toFixed(d)) >= 10) { e += 1; man /= 10; }
    return `${F(man, d)} × 10${String(e).replace('-', '⁻').split('').map(c => (c === '⁻' ? c : SUPS[+c])).join('')}`;
  }
  // «=» si la cuenta da justo lo que se escribe; «≈» si se redondeó (cierre, 20 nov).
  const SUPV = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  const leido = t => { const m = String(t).match(/(-?[\d\s]*\d(?:,\d+)?)(?: × 10([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+))?/); if (!m) return NaN;
    const x = +m[1].replace(/\s/g, '').replace(',', '.'); return m[2] ? x * 10 ** +m[2].replace('⁻', '-').replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, c => SUPV.indexOf(c)) : x; };
  const ig = (exacto, txt) => (Math.abs(exacto - leido(txt)) <= 1e-9 * Math.max(1, Math.abs(exacto)) ? ' = ' : ' ≈ ');
  const molT = x => `${F(x, 3)} mol`, gT = x => `${F(x, 2)} g`, uT = x => `${F(x, 2)} u`, pT = x => `${F(x, 1)} %`;
  const D = {
    nm: 'n = m / M (M: la masa molar, en g/mol)', M: 'M: suma de las masas atómicas de la fórmula, cada una por su subíndice',
    NN: 'N = n · Nₐ (N: número de entidades); Nₐ = 6,02 × 10²³ por mol', mg: '1 g = 1000 mg', prom: 'masa atómica = masa₁ × %₁ / 100 + masa₂ × %₂ / 100 (+ … con más isótopos)',
    casi: 'La masa de un isótopo, en u, es casi su número de masa', rel: 'n(elemento) = n(compuesto) × átomos del elemento por unidad',
    par: 'Un subíndice fuera del paréntesis multiplica todo lo de adentro', pct: '% del elemento = 100 · (átomos × masa atómica) / M',
    muestra: 'masa del elemento en una muestra = % × masa de la muestra / 100', cien: 'En 100 g del compuesto, el % de cada elemento es su masa en gramos',
    emp1: 'n(elemento) = masa del elemento / masa atómica', emp2: 'Empírica: se dividen los moles entre el menor',
    emp3: 'Si un cociente termina en ,5, todo por 2; en ,33 o ,67, por 3; en ,25 o ,75, por 4',
    k: 'molecular = k × empírica, con k = M / M(empírica), un entero', lav: 'Sistema cerrado: masa de lo de antes = masa de lo que se forma',
    proust: 'Un compuesto tiene siempre la misma razón entre las masas de sus elementos',
    dalton: 'Si dos elementos forman dos compuestos, las masas de uno unidas a la misma masa del otro van como enteros pequeños',
  };

  // ---- Tipos ----
  const TIPOS_POR_IDEA = {
    'masa-atomica-promedio': ['promedio-dos', 'promedio-tres', 'abundancia'],
    'mol-masa-molar': ['gramos-moles', 'moles-moleculas', 'gramos-moleculas', 'dosis'],
    'relaciones-en-formula': ['moles-elemento', 'gramos-elemento', 'moles-iones', 'atomos-dosis'],
    'composicion-formula-empirica': ['porcentaje', 'masa-elemento', 'agua-hidrato'],
    'formula-empirica-molecular': ['empirica-entera', 'molecular', 'empirica-medio'],
    'leyes-ponderales': ['lavoisier', 'abierto', 'proust', 'dalton'],
  };
  const IDEAS = Object.keys(TIPOS_POR_IDEA);
  const IDEA_DE = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map(t => [t, i])));
  const NIVEL = { 'promedio-dos': 1, 'promedio-tres': 2, abundancia: 3, 'gramos-moles': 1, 'moles-moleculas': 1, 'gramos-moleculas': 2, dosis: 3,
    'moles-elemento': 1, 'gramos-elemento': 2, 'moles-iones': 2, 'atomos-dosis': 3, porcentaje: 1, 'masa-elemento': 2, 'agua-hidrato': 3,
    'empirica-entera': 1, molecular: 2, 'empirica-medio': 3, lavoisier: 1, abierto: 2, proust: 2, dalton: 3 };
  const DOCUMENTADOS = { ES3: 'documentado', ES4: 'documentado', ES7: 'documentado', ES16: 'documentado', ES17: 'documentado', ES18: 'documentado', ES6: 'parcial', ES13: 'documentado', ES15: 'parcial', ES19: 'parcial', ES14: 'parcial' };
  const err = (id, texto, explicacion) => ({ id, clave: texto, texto, explicacion, respaldo: DOCUMENTADOS[id] || 'hipotesis', fuente: FUENTE });
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
    for (const e of rng.barajar(o.errores)) if (e && e.texto && !/NaN|Infinity/.test(e.texto) && !vistos.has(e.texto)) { vistos.add(e.texto); pool.push(e); }
    if (pool.length < 3) return null;
    const sub = elegirSinFuga(o.correcta, pool);
    if (!sub) return null;
    const alternativas = P.armarTexto({ correcta: { clave: o.correcta, texto: o.correcta }, errores: sub, rng });
    if (o.datos.some(d => d === o.correcta || d.includes(`= ${o.correcta}`))) return null;
    const usadas = new Set();
    for (const linea of [o.enunciado, o.pregunta, ...o.solucion]) for (const x of linea) if (x && typeof x === 'object' && x.v) usadas.add(x.v);
    return { id: `${ID}#${semilla}`, unidadCatalogo: UNIDAD, variables: Object.fromEntries([...usadas].map(k => [k, Object.assign({}, VARS[k])])),
      enunciado: o.enunciado, pregunta: o.pregunta, datos: o.datos, alternativas, solucion: o.solucion, respuesta: { valor: o.correcta, unidad: '' },
      _datos: Object.assign({ idea: IDEA_DE[tipo], tipo, nivel: NIVEL[tipo] }, o._datos) };
  }

  // ---- Idea 1: masa atómica promedio (un elemento X, con números de masa como en el examen) ----
  function promedioDos(rng) {
    let a, d, p;
    do { a = rng.entero(6, 90); d = rng.elegir([1, 2]); p = 5 * rng.entero(3, 17); } while (p === 50);
    const b = a + d, bien = (p * a + (100 - p) * b) / 100, mas = p > 50 ? a : b;
    return { correcta: uT(bien), _datos: { masas: [a, b], abund: [p, 100 - p] },
      enunciado: [`Un elemento X tiene dos isótopos: ${p} % con número de masa ${a} y ${100 - p} % con número de masa ${b}.`], pregunta: ['¿Cuál es su masa atómica?'],
      datos: [D.casi, D.prom],
      errores: [err('QM-PROMEDIO-SIMPLE', uT((a + b) / 2), `Bien promediar. Pero ${uT((a + b) / 2)} sería con los dos igual de abundantes.`),
        err('QM-PROMEDIO-CRUZADO', uT(((100 - p) * a + p * b) / 100), `Bien la cuenta pesada, pero cruzada: el ${p} % va con ${a} u.`),
        err('AT4', uT(mas), `Bien ver cuál abunda más. Pero el otro también aporta: no es ${mas} u.`),
        err('QM-PROMEDIO-SIMPLE', uT(a + b), 'Bien juntar las masas. Pero sumarlas no promedia: faltan las abundancias.')],
      solucion: [['Cada masa por su abundancia entre 100, y se suman.'], [`${F(p / 100, 2)} × ${a} + ${F((100 - p) / 100, 2)} × ${b}${ig(bien, uT(bien))}`, v('M', uT(bien))]] };
  }
  function promedioTres(rng) {
    let a, ps;
    do { a = rng.entero(10, 80); const p1 = 5 * rng.entero(10, 17), p2 = 5 * rng.entero(1, (100 - p1) / 5 - 1); ps = rng.barajar([p1, p2, 100 - p1 - p2]); } while (new Set(ps).size < 3);
    const ms = [a, a + 1, a + 2], bien = ms.reduce((t, m, i) => t + m * ps[i] / 100, 0), kmax = ps.indexOf(Math.max(...ps));
    return { correcta: uT(bien), _datos: { masas: ms, abund: ps },
      enunciado: [`Un elemento X tiene tres isótopos, de números de masa ${ms[0]}, ${ms[1]} y ${ms[2]}, con ${ps[0]} %, ${ps[1]} % y ${ps[2]} %.`], pregunta: ['¿Cuál es su masa atómica?'],
      datos: [D.casi, D.prom],
      errores: [err('QM-PROMEDIO-SIMPLE', uT(a + 1), `Bien promediar. Pero ${uT(a + 1)} sería con los tres igual de abundantes.`),
        err('AT4', uT(ms[kmax]), `Bien ver cuál abunda más. Pero los otros también aportan: no es ${ms[kmax]} u.`),
        err('QM-PROMEDIO-CRUZADO', uT(ms.reduce((t, m, i) => t + m * ps[2 - i] / 100, 0)), `Bien pesar, pero con las abundancias al revés: el ${ps[0]} % va con ${a} u.`),
        err('QM-PROMEDIO-SIMPLE', uT(3 * a + 3), 'Bien juntar las tres masas. Pero sumarlas no promedia.')],
      solucion: [['Cada masa por su abundancia entre 100, y se suman las tres.'], [`${ms.map((m, i) => `${F(ps[i] / 100, 2)} × ${m}`).join(' + ')}${ig(bien, uT(bien))}`, v('M', uT(bien))]] };
  }
  function abundancia(rng) {
    const a = rng.entero(10, 90), p = 5 * rng.entero(11, 19), b = a + 2, x = a + 2 * (100 - p) / 100;
    return { correcta: `${p} %`, _datos: { masas: [a, b], media: x },
      enunciado: [`Un elemento X tiene isótopos de números de masa ${a} y ${b}, y su masa atómica es ${F(x, 2)} u.`], pregunta: [`¿Qué porcentaje de sus átomos tiene número de masa ${a}?`],
      datos: [D.casi, D.prom],
      errores: [err('QM-PROMEDIO-CRUZADO', `${100 - p} %`, `Bien plantear el promedio. Pero ${100 - p} % es el del isótopo de ${b} u.`),
        err('QM-PROMEDIO-SIMPLE', '50 %', `Con 50 % de cada uno, la masa atómica sería ${a + 1} u, no ${F(x, 2)} u.`),
        err('QM-ABUND-DIFERENCIA', `${2 * (100 - p)} %`, `Bien restar ${F(x, 2)} − ${a}. Falta dividir entre 2, la diferencia de masas.`),
        err('QM-ABUND-DIFERENCIA', `${F(p / 100, 2)} %`, 'Bien la fracción, pero falta pasarla a porcentaje: por 100.')],
      solucion: [[`Con p el porcentaje del isótopo de ${a}: ${a} · p + ${b} · (100 − p) = ${100 * a + 2 * (100 - p)}.`], ['p = ', v('pct', `${p} %`)]] };
  }

  // ---- Idea 2: mol y masa molar ----
  // Las de «moléculas» son sustancias moleculares (un compuesto iónico tiene unidades fórmula, no moléculas).
  const MOLEC2 = ['HNO3', 'H3PO4', 'SO2', 'CO', 'N2', 'C3H8', 'NH3', 'CH4', 'O2', 'H2SO4', 'CO2', 'C6H12O6', 'H2O'];
  const SUST2 = ['HNO3', 'H3PO4', 'KOH', 'MgO', 'Na2CO3', 'SO2', 'NaOH', 'Ca(OH)2', 'CO', 'N2', 'Fe2O3', 'C3H8', 'K2SO4', 'NH3', 'CH4', 'O2', 'H2SO4', 'CO2', 'C6H12O6', 'H2O'];
  function gramosMoles(rng) {
    const f = rng.elegir(SUST2), M = masaMolar(f), n = rng.elegir([0.25, 0.5, 1.5, 2, 2.5, 3, 4, 5]), m = n * M;
    return { correcta: molT(n), _datos: { f, m },
      enunciado: [`Una muestra de ${gT(m)} de ${bonita(f)}.`], pregunta: ['¿Cuántos ', v('n', 'moles'), ' son?'], datos: [masasDe(f), D.M, D.nm],
      errores: [err('ES7', molT(M / m), `Bien la masa molar, ${F(M, 1)} g/mol. Pero va abajo: más gramos dan más moles.`),
        err('ES18', molT(m / sinSub(f)), `Bien dividir. Pero cada masa atómica va por su subíndice: M no es ${F(sinSub(f), 1)}.`),
        err('ES3', molT(m), 'Esos son los gramos. Un mol no es un gramo: falta dividir entre M.'),
        err('ES7', molT(m * M), 'Bien usar la masa molar. Pero se divide entre ella, no se multiplica.')],
      solucion: [[`M(${bonita(f)}) = ${F(M, 1)} g/mol.`], ['n = ', `${F(m, 2)} / ${F(M, 1)} = `, v('n', molT(n))]] };
  }
  function molesMoleculas(rng) {
    const f = rng.elegir(MOLEC2), n = rng.elegir([0.25, 0.5, 1.5, 2, 2.5, 3, 4]), at = total(f);
    return { correcta: cien(n * NA), _datos: { f, n },
      enunciado: [`Una muestra de ${F(n, 2)} mol de ${bonita(f)}.`], pregunta: ['¿Cuántas ', v('N', 'moléculas'), ' tiene?'], datos: [D.NN],
      errores: [err('QM-NA', cien(NA / n), `Bien usar Nₐ. Pero cada mol trae Nₐ moléculas: se multiplica por ${F(n, 2)}.`),
        err('ES6', cien(NA), `Esas son las moléculas de un solo mol. Aquí hay ${F(n, 2)} mol.`),
        err('ES6', cien(n * NA * at), `Eso cuenta átomos: cada ${bonita(f)} trae ${at}. Se piden moléculas.`),
        err('QM-NA', cien(n / NA, 3), 'Bien los moles. Pero se multiplica por Nₐ, no se divide.')],
      solucion: [['Cada mol trae Nₐ moléculas.'], ['N = ', `${F(n, 2)} · ${NA_TXT}${ig(n * NA, cien(n * NA))}`, v('N', cien(n * NA))]] };
  }
  function gramosMoleculas(rng) {
    const f = rng.elegir(MOLEC2), M = masaMolar(f), n = rng.elegir([0.25, 0.5, 1.5, 2, 2.5, 3]), m = n * M;
    return { correcta: cien(n * NA), _datos: { f, m },
      enunciado: [`Una muestra de ${gT(m)} de ${bonita(f)}.`], pregunta: ['¿Cuántas ', v('N', 'moléculas'), ' tiene?'], datos: [masasDe(f), D.M, D.nm, D.NN],
      errores: [err('ES7', cien(M / m * NA), `Bien multiplicar por Nₐ. Pero n = m/M: la masa molar, ${F(M, 1)}, va abajo.`),
        err('ES3', cien(m * NA), 'Bien usar Nₐ. Pero los gramos no son moles: falta dividir entre M.'),
        err('ES18', cien(m / sinSub(f) * NA), `Bien el camino. Pero cada masa atómica va por su subíndice: M no es ${F(sinSub(f), 1)}.`),
        err('ES6', cien(n * NA * total(f)), `Eso cuenta átomos: cada ${bonita(f)} trae ${total(f)}.`)],
      solucion: [[`M = ${F(M, 1)} g/mol: n = ${F(m, 2)} / ${F(M, 1)} = ${F(n, 3)} mol.`], ['N = ', `${F(n, 3)} · ${NA_TXT}${ig(n * NA, cien(n * NA))}`, v('N', cien(n * NA))]] };
  }
  const DOSIS = [['paracetamol', 'C8H9NO2', 500, 'una tableta'], ['ibuprofeno', 'C13H18O2', 400, 'una tableta'], ['ácido acetilsalicílico', 'C9H8O4', 500, 'una tableta'],
    ['vitamina C', 'C6H8O6', 500, 'una tableta'], ['ibuprofeno', 'C13H18O2', 200, 'una cápsula'], ['paracetamol', 'C8H9NO2', 1000, 'un sobre']];
  function dosis(rng) {
    const [nom, f, mg, que] = rng.elegir(DOSIS), M = masaMolar(f), n = mg / 1000 / M;
    return { correcta: cien(n * NA), _datos: { f, mg },
      enunciado: [`${que[0].toUpperCase() + que.slice(1)} de ${nom}, ${bonita(f)}, tiene ${mg} mg.`], pregunta: ['¿Cuántas ', v('N', 'moléculas'), ` de ${nom} tiene?`],
      datos: [masasDe(f), D.M, D.mg, D.nm, D.NN],
      errores: [err('QU', cien(mg / M * NA), `Bien el camino. Pero ${mg} mg son ${F(mg / 1000, 2)} g: se pasa a gramos antes.`),
        err('ES7', cien(M / (mg / 1000) * NA), 'Bien pasar a gramos. Pero n = m/M: la masa molar va abajo.'),
        err('QM-NA', cien(n / NA), 'Bien los moles. Pero cada mol trae Nₐ moléculas: se multiplica.'),
        err('ES18', cien(mg / 1000 / sinSub(f) * NA), `Bien el camino. Pero cada masa atómica va por su subíndice: M no es ${F(sinSub(f), 1)}.`)],
      solucion: [[`M = ${F(M, 1)} g/mol y ${mg} mg = ${F(mg / 1000, 2)} g.`], ['N = ', `${F(mg / 1000, 2)} / ${F(M, 1)} · ${NA_TXT}${ig(n * NA, cien(n * NA))}`, v('N', cien(n * NA))]] };
  }

  // ---- Idea 3: moles de átomos en una fórmula ----
  const FORM3 = ['Mg(NO3)2', 'Fe2(SO4)3', '(NH4)3PO4', 'Mg3(PO4)2', 'MgSO4·7H2O', 'Na2CO3·10H2O', 'C3H8', 'Ba(OH)2', 'K2Cr2O7', 'Al(OH)3', 'C12H22O11', 'Zn(NO3)2', 'Ca(NO3)2', 'CuSO4·5H2O', 'Al2(SO4)3'];
  const sinPar = (f, e) => atomos(f.replace(/\)\d+/g, ')').replace(/·\d+/, '·'))[e] || 0;
  const datosF = f => [D.rel, ...(/\(/.test(f) ? [D.par] : []), ...(/·/.test(f) ? [`En un hidrato, ·${f.match(/·(\d+)/)[1]}H₂O son ${f.match(/·(\d+)/)[1]} moléculas de agua por unidad`] : [])];
  const elDe = (rng, f) => { const a = atomos(f), con = Object.keys(a).filter(e => sinPar(f, e) !== a[e]); return rng.elegir(con.length && rng.sig() < 0.7 ? con : Object.keys(a)); };
  function molesElemento(rng) {
    const f = rng.elegir(FORM3), e = elDe(rng, f), c = atomos(f)[e], n = rng.elegir([0.5, 2, 3, 0.25, 1.5, 4]);
    return { correcta: molT(n * c), _datos: { f, e, n },
      enunciado: [`Una muestra de ${F(n, 2)} mol de ${bonita(f)}.`], pregunta: ['¿Cuántos ', v('n', 'moles'), ` de átomos de ${NOMBRE[e]} tiene?`], datos: datosF(f),
      errores: [sinPar(f, e) !== c ? err('ES18', molT(n * sinPar(f, e)), `Bien multiplicar por ${F(n, 2)}. Pero hay ${c} de ${e} por unidad, no ${sinPar(f, e)}.`) : null,
        err('QM-POR-N', molT(c), `${c} de ${e} hay en una sola unidad. Aquí hay ${F(n, 2)} mol.`),
        err('ES14', molT(n), `Esos son los moles de ${bonita(f)}. Cada unidad trae ${c} de ${e}.`),
        err('QM-POR-N', molT(2 * n * c), `Bien los ${c} de ${e} y los ${F(n, 2)} mol. Sobra multiplicar otra vez por 2.`)],
      solucion: [[`Cada unidad de ${bonita(f)} trae ${c} de ${e}.`], [`n(${e}) = ${F(n, 2)} · ${c} = `, v('n', molT(n * c))]] };
  }
  function gramosElemento(rng) {
    const f = rng.elegir(FORM3.filter(x => !/·/.test(x))), e = elDe(rng, f), c = atomos(f)[e], M = masaMolar(f), n = rng.elegir([0.1, 0.2, 0.25, 0.5, 2]), m = n * M;
    return { correcta: molT(n * c), _datos: { f, e, m },
      enunciado: [`Una muestra de ${gT(m)} de ${bonita(f)}.`], pregunta: ['¿Cuántos ', v('n', 'moles'), ` de átomos de ${NOMBRE[e]} tiene?`], datos: [masasDe(f), D.M, D.nm, ...datosF(f)],
      errores: [err('ES14', molT(n), `Bien los moles de ${bonita(f)}. Falta multiplicar por los ${c} de ${e} de cada unidad.`),
        sinPar(f, e) !== c ? err('ES18', molT(n * sinPar(f, e)), `Bien el camino. Pero el subíndice de afuera multiplica: ${c} de ${e} por unidad.`) : null,
        err('QM-MASA-ATOMICA', molT(m / MASA[e]), `Eso divide toda la masa entre la del ${e}: como si la muestra fuera solo ${e}.`),
        err('ES7', molT(M / m * c), 'Bien multiplicar por el subíndice. Pero n = m/M: la masa molar va abajo.')],
      solucion: [[`M = ${F(M, 1)} g/mol: hay ${F(n, 3)} mol de ${bonita(f)}.`], [`n(${e}) = ${F(n, 3)} · ${c} = `, v('n', molT(n * c))]] };
  }
  const IONES = [['Na2SO4', 2, 1, 'Na⁺', 'SO₄²⁻'], ['K3PO4', 3, 1, 'K⁺', 'PO₄³⁻'], ['Mg(NO3)2', 1, 2, 'Mg²⁺', 'NO₃⁻'], ['(NH4)2CO3', 2, 1, 'NH₄⁺', 'CO₃²⁻'],
    ['Mg3(PO4)2', 3, 2, 'Mg²⁺', 'PO₄³⁻'], ['Al(NO3)3', 1, 3, 'Al³⁺', 'NO₃⁻'], ['Ba(OH)2', 1, 2, 'Ba²⁺', 'OH⁻'], ['Na3PO4', 3, 1, 'Na⁺', 'PO₄³⁻'], ['Fe2(SO4)3', 2, 3, 'Fe³⁺', 'SO₄²⁻'], ['K2SO4', 2, 1, 'K⁺', 'SO₄²⁻']];
  function molesIones(rng) {
    const [f, a, b, ca, an] = rng.elegir(IONES), n = rng.elegir([0.5, 2, 3, 1.5, 0.25]);
    return { correcta: molT(n * (a + b)), _datos: { f, n, iones: [a, b] },
      enunciado: [`En agua, el ${bonita(f)} se separa en ${ca} y ${an}.`], pregunta: ['¿Cuántos ', v('n', 'moles'), ` de iones en total da ${F(n, 2)} mol de ${bonita(f)}?`],
      datos: ['Un ion poliatómico cuenta como un solo ion', 'La sal es neutra: las cargas de sus iones suman 0', D.rel],
      errores: [err('QM-IONES-UNO', molT(n * b), `Esos son solo los ${an}. Los ${ca} también son iones.`), err('QM-IONES-UNO', molT(n * a), `Esos son solo los ${ca}. Los ${an} también son iones.`),
        err('QM-IONES-ATOMOS', molT(n * total(f)), `Eso cuenta los ${total(f)} átomos de la fórmula. Un ion poliatómico cuenta como uno.`),
        err('QM-POR-N', molT(a + b), `${a + b} iones da una sola unidad. Aquí hay ${F(n, 2)} mol.`)],
      solucion: [[`Cada unidad da ${a} ${ca} y ${b} ${an}: ${a + b} iones.`], [`n(iones) = ${F(n, 2)} · ${a + b} = `, v('n', molT(n * (a + b)))]] };
  }
  // Átomos de un elemento en una dosis: mg → g → mol → mol del elemento → átomos (la trampa 2 de San Marcos).
  const DOSIS3 = [['amoxicilina', 'C16H19N3O5S', 500, 'O'], ['paracetamol', 'C8H9NO2', 500, 'H'], ['ácido acetilsalicílico', 'C9H8O4', 500, 'O'], ['ibuprofeno', 'C13H18O2', 400, 'C'], ['vitamina C', 'C6H8O6', 500, 'O']];
  function atomosDosis(rng) {
    const [nom, f, mg, e] = rng.elegir(DOSIS3), k = rng.elegir([1, 2, 3]), M = masaMolar(f), c = atomos(f)[e], n = k * mg / 1000 / M, bien = n * c * NA;
    return { correcta: cien(bien), _datos: { f, mg, k, e },
      enunciado: [`En un día, un paciente toma ${k === 1 ? 'una tableta' : `${k} tabletas`} de ${mg} mg de ${nom}, ${bonita(f)}.`], pregunta: ['¿Cuántos ', v('N', 'átomos'), ` de ${NOMBRE[e]} recibe?`],
      datos: [masasDe(f), D.M, D.mg, D.nm, D.rel, D.NN],
      errores: [err('ES6', cien(n * NA), `Bien las moléculas: ${cien(n * NA)}. Cada una trae ${c} de ${e}.`),
        k > 1 ? err('QM-POR-N', cien(bien / k), `Eso es una sola tableta. Son ${k}.`) : err('QU', cien(bien * 1000), `Bien el camino. Pero ${mg} mg son ${F(mg / 1000, 2)} g.`),
        err('QM-NA', cien(n * c), 'Bien los moles de átomos. Pero falta multiplicar por Nₐ para contarlos.'),
        err('ES6', cien(n * total(f) * NA), `Eso cuenta los ${total(f)} átomos de cada molécula; se piden solo los de ${e}.`)],
      solucion: [[`M = ${F(M, 1)} g/mol; ${k} · ${mg} mg = ${F(k * mg / 1000, 2)} g; n = ${F(n, 5)} mol.`], [`N(${e === 'N' ? 'nitrógeno' : e}) ≈ ${F(n, 5)} · ${c} · ${NA_TXT} ≈ `, v('N', cien(bien))]] };
  }

  // ---- Idea 4: composición centesimal ----
  const FORM4 = ['HNO3', 'KOH', 'Na2CO3', 'C3H8', 'Al2O3', 'NaOH', 'K2SO4', 'C12H22O11', 'MgSO4', 'NaHCO3', 'NH4NO3', 'Fe2O3', 'CaCO3', 'CO(NH2)2', '(NH4)2SO4', 'C2H6O'];
  const pctDe = (f, e) => 100 * atomos(f)[e] * MASA[e] / masaMolar(f);
  function porcentaje(rng) {
    const f = rng.elegir(FORM4), a = atomos(f), e = rng.elegir(Object.keys(a)), p = pctDe(f, e), tot = total(f), M = masaMolar(f);
    return { correcta: pT(p), _datos: { f, e },
      enunciado: [`El compuesto ${bonita(f)}.`], pregunta: ['¿Qué ', v('pct', 'porcentaje'), ` de su masa es ${NOMBRE[e]}?`], datos: [masasDe(f), D.M, D.pct],
      errores: [err('ES19', pT(100 * a[e] / tot), `Ese es el porcentaje de átomos, ${a[e]} de ${tot}. En masa cuenta lo que pesa cada uno.`),
        a[e] > 1 ? err('ES18', pT(100 * MASA[e] / M), `Bien dividir entre ${F(M, 1)}. Pero hay ${a[e]} de ${e}: su masa va por ${a[e]}.`) : null,
        err('QM-PORCENTAJE', pT(100 - p), `Ese es el resto: lo que pesan los otros elementos.`),
        err('ES18', pT(100 * MASA[e] / sinSub(f)), 'Bien el camino. Pero en la masa molar cada masa atómica va por su subíndice.')],
      solucion: [[`M = ${F(M, 1)} g/mol; el ${e} aporta ${F(a[e] * MASA[e], 1)} g.`], [`% ${e} = 100 · ${F(a[e] * MASA[e], 1)} / ${F(M, 1)}${ig(p, pT(p))}`, v('pct', pT(p))]] };
  }
  function masaElemento(rng) {
    const f = rng.elegir(FORM4), a = atomos(f), e = rng.elegir(Object.keys(a)), M = masaMolar(f), m = M * rng.elegir([0.5, 2, 1.5, 0.25, 3]), bien = m * a[e] * MASA[e] / M, tot = total(f);
    return { correcta: gT(bien), _datos: { f, e, m },
      enunciado: [`Una muestra de ${gT(m)} de ${bonita(f)}.`], pregunta: ['¿Cuántos gramos de ', NOMBRE[e], ' tiene?'], datos: [masasDe(f), D.M, D.pct, D.muestra],
      errores: [a[e] > 1 ? err('ES18', gT(m * MASA[e] / M), `Bien la proporción. Pero hay ${a[e]} de ${e} por unidad.`) : null,
        err('ES19', gT(m * a[e] / tot), `Eso reparte la masa por átomos, ${a[e]} de ${tot}. Cada átomo pesa distinto.`),
        err('QM-PCT-GRAMOS', gT(a[e] * MASA[e]), `Esos gramos de ${e} hay en un mol, ${F(M, 1)} g. Aquí hay ${gT(m)}.`),
        err('QM-PORCENTAJE', gT(m - bien), `Eso es lo que pesan los otros elementos.`)],
      solucion: [[`El ${e} es ${F(pctDe(f, e), 2)} % de la masa.`], [`${F(a[e] * MASA[e], 1)} · ${F(m, 2)} / ${F(M, 1)}${ig(bien, gT(bien))}`, v('m', gT(bien))]] };
  }
  const HIDR = ['MgSO4·7H2O', 'Na2CO3·10H2O', 'FeSO4·7H2O', 'Na2SO4·10H2O', 'ZnSO4·7H2O', 'CuSO4·5H2O', 'CaSO4·2H2O'];
  function aguaHidrato(rng) {
    const f = rng.elegir(HIDR), x = +f.match(/·(\d+)/)[1], s = f.split('·')[0], M = masaMolar(f), agua = 18 * x, p = 100 * agua / M;
    return { correcta: pT(p), _datos: { f },
      enunciado: [`La sal hidratada ${bonita(f)}.`], pregunta: ['¿Qué ', v('pct', 'porcentaje'), ' de su masa es agua?'], datos: [masasDe(f), `En un hidrato, ·${x}H₂O son ${x} moléculas de agua por unidad`, '% de agua = 100 · masa del agua / M'],
      errores: [err('QM-HIDRATO-ANHIDRA', pT(100 * agua / masaMolar(s)), `Bien la masa del agua, ${agua} g. Pero se divide entre todo el hidrato, ${F(M, 1)} g.`),
        err('ES18', pT(100 * 18 / M), `Eso cuenta una sola agua. Hay ${x}.`), err('QM-PORCENTAJE', pT(100 - p), 'Ese es el porcentaje de la sal sin agua.'),
        err('ES19', pT(100 * 3 * x / total(f)), 'Eso cuenta átomos, no masa.')],
      solucion: [[`M = ${F(M, 1)} g/mol; el agua pesa ${x} · 18 = ${agua} g.`], [`% agua = 100 · ${agua} / ${F(M, 1)}${ig(p, pT(p))}`, v('pct', pT(p))]] };
  }

  // ---- Idea 5: fórmula empírica y molecular ----
  const escribir = sb => Object.keys(sb).map(e => e + (sb[e] === 1 ? '' : sb[e])).join('');
  const simplificar = sb => { const g = Object.values(sb).reduce((a, b) => { while (b) [a, b] = [b, a % b]; return a; }); return Object.fromEntries(Object.entries(sb).map(([e, k]) => [e, k / g])); };
  // La empírica desde los porcentajes, por el camino del libro: moles, entre el menor, por 1 a 6 hasta que salgan enteros.
  function empiricaDe(d) {
    const n = Object.fromEntries(Object.entries(d).map(([e, x]) => [e, x / MASA[e]])), min = Math.min(...Object.values(n));
    for (let k = 1; k <= 6; k++) { const r = Object.fromEntries(Object.entries(n).map(([e, x]) => [e, x / min * k])); if (Object.values(r).every(x => Math.abs(x - Math.round(x)) < 0.03)) return { sb: Object.fromEntries(Object.entries(r).map(([e, x]) => [e, Math.round(x)])), k, n, min }; }
    return null;
  }
  const pcts = f => { const a = atomos(f); return Object.fromEntries(Object.keys(a).map(e => [e, Math.round(pctDe(f, e) * 10) / 10])); };
  const pctTxt = d => { const l = Object.keys(d).map(e => `${F(d[e], 1)} % de ${e}`); return l.length < 2 ? l[0] : `${l.slice(0, -1).join(', ')} y ${l[l.length - 1]}`; };
  function erroresEmp(d, e, bien) {
    const els = Object.keys(d), sb = e.sb, out = [], prim = els[0];
    const con = (sbx, id, texto) => { const f = escribir(sbx); if (f !== bien && Object.values(sbx).every(x => x >= 1 && Number.isInteger(x))) out.push(err(id, bonita(f), `${texto} Con ${bonita(f)}, ${prim} sería ${pT(pctDe(f, prim))}.`)); };
    const minM = Math.min(...els.map(x => d[x]));
    con(simplificar(Object.fromEntries(els.map(x => [x, Math.max(1, Math.round(d[x] / minM))]))), 'ES16', 'Bien buscar enteros, pero compara masas, no moles.');
    if (e.k > 1) con(Object.fromEntries(els.map(x => [x, Math.max(1, Math.round(e.n[x] / e.min))])), 'QM-REDONDEO', `Bien los moles; pero redondea en vez de multiplicar por ${e.k}.`);
    if (els.length === 2) con({ [els[0]]: sb[els[1]], [els[1]]: sb[els[0]] }, 'QM-EMP-INVERTIDA', 'Bien la razón, pero al revés.');
    con(Object.fromEntries(els.map(x => [x, 2 * sb[x]])), 'ES17', 'Bien la razón de átomos. Pero la empírica es la más simple.');
    con(Object.fromEntries(els.map((x, i) => [x, i ? sb[x] + 1 : sb[x]])), 'QM-REDONDEO', 'Bien empezar por los moles. Pero la razón no es esa.');
    return out;
  }
  function empiricaCaso(rng, lista) {
    for (let t = 0; t < 50; t++) {
      const f = rng.elegir(lista), d = pcts(f), e = empiricaDe(d), bien = escribir(simplificar(atomos(f)));
      if (!e || escribir(e.sb) !== bien) continue;
      const els = Object.keys(d);
      return { correcta: bonita(bien), _datos: { pct: d },
        enunciado: [`Un compuesto tiene ${pctTxt(d)} en masa.`], pregunta: ['¿Cuál es su fórmula empírica?'], datos: [masasTxt(els), D.cien, D.emp1, D.emp2, D.emp3],
        errores: erroresEmp(d, e, bien),
        solucion: [[`Moles en 100 g: ${els.map(x => `${x} ${F(e.n[x], 3)}`).join('; ')}.`], [`Entre el menor${e.k > 1 ? ` y por ${e.k}` : ''}: ${els.map(x => e.sb[x]).join(' : ')} → `, bonita(bien)]] };
    }
    throw new Error('sin empírica');
  }
  const ENTERA = ['MgO', 'Na2O', 'CaS', 'N2O', 'K2O', 'FeS', 'CS2', 'NO', 'MgS', 'CaO', 'SO3', 'NO2', 'CH2', 'CO2', 'ZnO'];
  const MEDIO = ['Fe2O3', 'N2O5', 'Cr2O3', 'Mn2O7', 'C3H4', 'Mn3O4', 'C3H5', 'P2O3', 'Al2O3', 'N2O3', 'C2H5', 'Fe3O4', 'P2O5'];
  // Empíricas con los factores k de moléculas que existen (C₂H₂, C₆H₆, los alquenos, los azúcares, N₂O₄, P₄O₁₀, C₄H₁₀…).
  const EMP = [['CH', [2, 4, 6, 8]], ['CH2', [2, 3, 4, 5, 6]], ['CH2O', [2, 3, 4, 5, 6]], ['NO2', [2]], ['C2H5', [2]], ['CH3', [2]], ['P2O5', [2]], ['C3H4', [3]], ['CHO', [4]], ['C2H3', [2, 4]], ['CH3O', [2]]];
  function molecular(rng) {
    const [emp, ks] = rng.elegir(EMP), k = rng.elegir(ks), Me = masaMolar(emp), M = Me * k, at = atomos(emp), els = Object.keys(at), bien = escribir(Object.fromEntries(els.map(x => [x, at[x] * k])));
    const otro = (sb, id, texto) => { const f = escribir(sb); return f === bien ? null : err(id, bonita(f), `${texto} ${bonita(f)} pesaría ${F(masaMolar(f), 1)} g/mol.`); };
    return { correcta: bonita(bien), _datos: { emp, M },
      enunciado: [`Un compuesto tiene fórmula empírica ${bonita(emp)} y masa molar ${F(M, 1)} g/mol.`], pregunta: ['¿Cuál es su fórmula molecular?'], datos: [masasTxt(els), D.k],
      errores: [err('ES17', bonita(emp), `Esa es la empírica, de ${F(Me, 1)} g/mol. La molecular pesa ${F(M, 1)}.`),
        otro(Object.fromEntries(els.map((x, i) => [x, i ? at[x] : at[x] * k])), 'QM-FACTOR', `Bien el factor ${k}, pero multiplica todos los subíndices.`),
        otro(Object.fromEntries(els.map(x => [x, at[x] * (k + 1)])), 'QM-FACTOR', `El factor es ${F(M, 1)} / ${F(Me, 1)} = ${k}.`),
        otro(Object.fromEntries(els.map(x => [x, at[x] + k])), 'QM-FACTOR', `Bien el factor ${k}, pero se multiplica, no se suma.`)],
      solucion: [[`M(${bonita(emp)}) = ${F(Me, 1)} g/mol: k = ${F(M, 1)} / ${F(Me, 1)} = ${k}.`], [`${bonita(emp)} × ${k} = `, bonita(bien)]] };
  }

  // ---- Idea 6: leyes ponderales (sin balance ni reactivo limitante: todo reacciona) ----
  function lavoisier(rng) {
    const [que, r1, r2] = rng.elegir([['carbón', 3, 8], ['azufre', 1, 1], ['magnesio', 3, 2], ['hidrógeno', 1, 8], ['hierro', 7, 4]]), k = rng.entero(1, 8), a = r1 * k, b = r2 * k;
    return { correcta: gT(a + b), _datos: { a, b },
      enunciado: [`En un frasco cerrado, ${a} g de ${que} se combinan con ${b} g de ${que === 'hierro' ? 'azufre' : 'oxígeno'}, y todo reacciona.`], pregunta: ['¿Cuántos gramos de compuesto se forman?'], datos: [D.lav],
      errores: [err('ES15', gT(b), `Esos son solo los ${b} g del segundo. El ${que} también queda en el compuesto.`), err('ES13', gT(Math.abs(b - a)), 'En un frasco cerrado no se pierde masa: se suma.'),
        err('ES15', gT(a), `Esos son solo los ${a} g de ${que}.`), err('ES13', gT(2 * (a + b)), 'Bien sumar. Pero la masa no se duplica: es la misma.')],
      solucion: [['Frasco cerrado y todo reacciona: masa antes = masa después.'], [`${a} + ${b} = `, v('m', gT(a + b))]] };
  }
  function abierto(rng) {
    const vin = rng.entero(4, 12) * 10, b = rng.entero(4, 10) / 2, gas = Math.round(b * 0.52 * 10) / 10, fin = vin + b - gas;
    return { correcta: `${F(gas, 1)} g`, _datos: { vin, b, fin },
      enunciado: [`En un vaso abierto se juntan ${vin} g de vinagre y ${F(b, 1)} g de bicarbonato. Sale gas y al final la balanza marca ${F(fin, 1)} g.`], pregunta: ['¿Cuántos gramos de gas escaparon?'], datos: [D.lav],
      errores: [err('QM-ABIERTO', `${F(fin, 1)} g`, 'Eso es lo que quedó en el vaso.'), err('ES15', `${F(b, 1)} g`, 'Ese es el bicarbonato. El gas es lo que falta.'),
        err('ES13', `${F(vin + b, 1)} g`, 'Eso es todo lo de antes. Se resta lo que quedó.'), err('QM-ABIERTO', '0 g', 'Sería cierto en un frasco cerrado. En un vaso abierto el gas sale.')],
      solucion: [['Lo que falta en la balanza es el gas que escapó.'], [`${vin} + ${F(b, 1)} − ${F(fin, 1)} = `, v('m', `${F(gas, 1)} g`)]] };
  }
  const PROUST = [['óxido de zinc', 16.2, 13, 'zinc'], ['óxido de aluminio', 51, 27, 'aluminio'], ['amoníaco', 34, 28, 'nitrógeno'], ['dióxido de azufre', 16, 8, 'azufre'],
    ['sulfuro de zinc', 19.4, 13, 'zinc'], ['óxido de sodio', 31, 23, 'sodio'], ['óxido de magnesio', 10, 6, 'magnesio'], ['óxido de calcio', 14, 10, 'calcio']];
  function proust(rng) {
    const [nom, m1, x1, el] = rng.elegir(PROUST), k = rng.elegir([2, 3, 0.5, 1.5, 2.5]), m = +(m1 * k).toFixed(2), bien = x1 * k;
    return { correcta: gT(bien), _datos: { m1, x1, m },
      enunciado: [`Una muestra de ${F(m1, 1)} g de ${nom} tiene ${F(x1, 1)} g de ${el}.`], pregunta: [`¿Cuánto ${el} hay en ${gT(m)} del mismo compuesto?`], datos: [D.proust],
      errores: [err('QM-PROPORCION', gT(m * m1 / x1), `Bien usar la razón, pero al revés: el ${el} es ${F(x1, 1)} de cada ${F(m1, 1)} g.`),
        err('QM-PROUST-SUMA', gT(x1 + (m - m1)), `Eso suma la diferencia de masas. La razón se multiplica, no se suma.`),
        err('QM-PROPORCION', gT(x1), `Esos son los de la primera muestra; esta es ${m > m1 ? 'más grande' : 'más chica'}.`), err('QM-PROPORCION', gT(m - bien), `Eso es lo que pesa lo que no es ${el}.`)],
      solucion: [[`La razón ${el} : compuesto no cambia (Proust).`], [`${F(x1, 1)} · ${gT(m).replace(' g', '')} / ${F(m1, 1)}${ig(bien, gT(bien))}`, v('m', gT(bien))]] };
  }
  const DALTON = [['N₂O', 'NO', 28, 16, 32, 'nitrógeno'], ['NO', 'NO₂', 14, 16, 32, 'nitrógeno'], ['N₂O₃', 'N₂O₅', 28, 48, 80, 'nitrógeno'], ['Cu₂O', 'CuO', 127, 16, 32, 'cobre'],
    ['H₂O', 'H₂O₂', 2, 16, 32, 'hidrógeno'], ['PbO', 'PbO₂', 207, 16, 32, 'plomo'], ['SnO', 'SnO₂', 119, 16, 32, 'estaño'], ['SO₂', 'SO₃', 32, 32, 48, 'azufre'], ['FeO', 'Fe₂O₃', 56, 16, 24, 'hierro'], ['N₂O', 'NO₂', 28, 16, 64, 'nitrógeno']];
  const mcd = (a, b) => (b ? mcd(b, a % b) : a), razon = (a, b) => { const g = mcd(a, b); return `${a / g} : ${b / g}`; };
  function dalton(rng) {
    const [a, b, base, o1, o2, el] = rng.elegir(DALTON), bien = razon(o1, o2);
    return { correcta: bien, _datos: { a, b, o1, o2 },
      enunciado: [`Con ${base} g de ${el}, el ${a} lleva ${o1} g de oxígeno.`], pregunta: [`Con la misma masa de ${el}, ¿en qué razón están las masas de oxígeno del ${a} y del ${b}?`],
      datos: [masasTxt(['O']), D.dalton],
      errores: [err('QM-PROPORCION', '1 : 1', 'Serían iguales si fuera el mismo compuesto.'), err('QM-PROPORCION', razon(o2, o1), 'Bien la razón, pero al revés.'),
        err('QM-PROPORCION', razon(o1, o1 + o2), `Bien empezar con ${o1} g. Pero el ${b} lleva ${o2} g, no ${o1 + o2} g.`), err('QM-PROPORCION', razon(o1, 2 * o2), 'Bien comparar con la misma masa del otro elemento; pero esa razón duplica el oxígeno del segundo.')],
      solucion: [[`Con ${base} g de ${el}, el ${b} lleva ${o2} g de O.`], [`${o1} : ${o2} = `, bien]] };
  }

  const CONSTRUIR = {
    'promedio-dos': promedioDos, 'promedio-tres': promedioTres, abundancia, 'gramos-moles': gramosMoles, 'moles-moleculas': molesMoleculas, 'gramos-moleculas': gramosMoleculas, dosis,
    'moles-elemento': molesElemento, 'gramos-elemento': gramosElemento, 'moles-iones': molesIones, 'atomos-dosis': atomosDosis,
    porcentaje, 'masa-elemento': masaElemento, 'agua-hidrato': aguaHidrato,
    'empirica-entera': r => empiricaCaso(r, ENTERA), molecular, 'empirica-medio': r => empiricaCaso(r, MEDIO),
    lavoisier, abierto, proust, dalton,
  };
  // Papel (regla 6; herramientas/papel-generador.js toma «papel-1» a «papel-8» y rotula 3 básicos, 3 intermedios y 2
  // avanzados): las seis ideas, con el nivel de cada tipo igual a su rótulo.
  const PAPEL = { 'papel-1': 'promedio-dos', 'papel-2': 'gramos-moles', 'papel-3': 'moles-elemento', 'papel-4': 'masa-elemento',
    'papel-5': 'molecular', 'papel-6': 'proust', 'papel-7': 'dosis', 'papel-8': 'empirica-medio' };
  function generar(semilla, opciones = {}) {
    const rng = Azar.crear(`${ID}|${semilla}`);
    const fijo = PAPEL[semilla] && !opciones.idea ? PAPEL[semilla] : null;
    const idea = fijo ? IDEA_DE[fijo] : TIPOS_POR_IDEA[opciones.idea] ? opciones.idea : rng.elegir(IDEAS), tipo = fijo || rng.elegir(TIPOS_POR_IDEA[idea]);
    for (let intento = 0; intento < 500; intento++) {
      const o = CONSTRUIR[tipo](rng);
      o.errores = o.errores.filter(Boolean);
      const p = cerrar(rng, semilla, tipo, o);
      if (p) return p;
    }
    throw new Error(`${ID}: no se pudo generar un problema de ${tipo}`);
  }
  return { id: ID, titulo: 'Moles, masa molar y composición', generar, TIPOS_POR_IDEA, NIVEL, TIPOS: Object.keys(CONSTRUIR) };
});
