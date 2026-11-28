/*
 * Teoría de «Nomenclatura inorgánica» (quimica.nomenclatura-inorganica). Molde: docs/teoria.md y docs/molde-unidad.md;
 * unidades modelo: contenido/teoria/quimica/enlace-quimico.js y geometria-molecular.js. Compañera: Bruna (castora).
 *
 * Etapa 7 del plan de calidad (19 nov 2026), con criterio delegado (docs/metodo/unidad/etapa-delegada.md). Propuesta:
 * docs/etapa7/propuesta-quimica.md. Seis ideas, en este orden y con estos id: 1 «Estados de oxidación»
 * (`estados-oxidacion`), 2 «Óxidos y sus tres nombres» (`tres-nombres`), 3 «Peróxidos, hidruros e hidrácidos»
 * (`peroxidos-hidruros`, nueva), 4 «Hidróxidos y oxácidos» (`arbol-funciones`), 5 «Sales haloideas y oxisales»
 * (`sales`) y 6 «Sales ácidas, básicas e hidratadas» (`sales-acidas-basicas-hidratadas`).
 *
 * Regla 1: los estados de oxidación, las fórmulas y los nombres salen del motor de la escena
 * (plantillas/nomenclatura-inorganica/motor.js, con sus casos), no se escriben a mano. Cada nombre que ve el alumno se
 * comprobó aparte con OPSIN 2.8.0 (scratchpad e7-quimica/nombres.js: el nombre traducido palabra por palabra al inglés da
 * la fórmula de la unidad); lo que OPSIN no lee (peróxidos, hidruros de metal) se comparó con la tabla del motor.
 *
 * Mapa de colores (propuesta §8, un color fijo por magnitud): catión o metal naranja (c-o), anión, no metal u oxígeno
 * del óxido turquesa (c-i), estado de oxidación (EO) y su romano violeta (c-f), carga de la especie o del ion carmín
 * (c-h); nombres, fórmulas enteras y agua de hidratación en tinta; sin verde. La prueba de la unidad lo revisa.
 * Objetos de la primera pantalla (quim-nomenclatura, de prueba): el permanganato (1), el clavo con herrumbre (2), el
 * agua oxigenada (3), la leche de magnesia (4), el salero y el saco de abono (5) y la caja de bicarbonato (6).
 * Convenciones de academia (tarjeta «nomenclatura-examen» de nucleo/convencion.js): los tres sistemas en los óxidos;
 * «anhídrido» para el óxido de un no metal; -⁠oso e -⁠ico para un metal con dos EO; los oxácidos y las sales, solo por la
 * tradicional (sin la forma con «oxo»).
 * Errores: docs/investigacion/quimica-materia-nomenclatura-organica-ideas-erroneas.md (NO1 a NO4); los QM- son hipótesis.
 * Cuentas rehechas aparte en scratchpad (e7-quimica/cuentas.js), por otro camino que el de este archivo.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const def = nodo ? fabrica(require('../../../nucleo/kit/kit.js'), require('../../../plantillas/nomenclatura-inorganica/motor.js'))
    : fabrica(root.Kit, root.MotorNomenclatura);
  if (nodo) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit, M) {
  'use strict';
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let x = q; x = Math.imul(x ^ (x >>> 15), x | 1); x ^= x + Math.imul(x ^ (x >>> 7), x | 61); return ((x ^ (x >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = l => l[Math.floor(r() * l.length)];
    r.baraja = l => { const a = l.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    return r;
  }
  // ---------- Colores, fichas y escritura ----------
  const COLORES = { cation: 'o', anion: 'i', eo: 'f', carga: 'h' };
  const ficha = m => t => ({ v: `c-${COLORES[m]}`, t: String(t), m });
  const Ca_ = ficha('cation'), An = ficha('anion'), Eo = ficha('eo'), Cq = ficha('carga');
  const EOf = Eo('EO');
  const letra = L => ({ negrita: [L] });
  const SEP = '   ·   ';
  const SUBS = '₀₁₂₃₄₅₆₇₈₉', SUPS = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  const sub = k => (k === 1 ? '' : String(k).split('').map(c => SUBS[+c]).join(''));
  const sg = k => (k > 0 ? `+${k}` : k < 0 ? `−${-k}` : '0');
  const ROM = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  // Fórmula del motor («Al2(SO4)3», «SO4^2-», «CuSO4·5H2O», «HCl(ac)») escrita como en el libro.
  function bonita(f) {
    let [cuerpo, carga] = String(f).split('^');
    cuerpo = cuerpo.replace(/([A-Za-z)])1(?!\d)/g, '$1');
    const partes = cuerpo.split('·').map((p, i) => (i === 0 ? p : p.replace(/^(\d+)/, '$1\u0000')));
    cuerpo = partes.map(p => p.replace(/([A-Za-z)])(\d+)/g, (m, a, d) => a + d.split('').map(c => SUBS[+c]).join('')).replace('\u0000', '')).join('·');
    if (!carga) return cuerpo;
    const m = carga.match(/^(\d*)([+-])$/);
    return cuerpo + (m[1] && m[1] !== '1' ? m[1].split('').map(c => SUPS[+c]).join('') : '') + (m[2] === '+' ? '⁺' : '⁻');
  }
  const eoDe = (f, e) => M.estado(f, e).numero;
  const nombre = (f, sis) => { const n = M.nombrar(f)[sis]; if (!n) throw new Error(`${f}: sin nombre ${sis}`); return n; };
  // El nombre Stock con su romano en violeta (el romano es el EO).
  const conRomano = t => String(t).split(/(\([IVX]+\))/).filter(Boolean).map(x => (/^\([IVX]+\)$/.test(x) ? Eo(x) : x));
  const fichas = (lista, extra = {}) => ({ pieza: 'quim-fichas', datos: Object.assign({ fichas: lista, serif: true }, extra), estado: {} });
  const OBJ = (objeto, o) => ({ pieza: 'quim-nomenclatura', datos: Object.assign({ vista: 'objeto', objeto }, o), estado: {} });
  const NOMS = (o) => ({ pieza: 'quim-nomenclatura', datos: Object.assign({ vista: 'nombres' }, o), estado: {} });
  // Las líneas de Datos con los EO que casi no cambian (para cada símbolo que aparece en el ejercicio).
  const FIJO_TXT = { O: 'EO del O: −2', H: 'EO del H: +1 (junto a un no metal)', K: 'EO del K: +1 (grupo 1)', Na: 'EO del Na: +1 (grupo 1)',
    Li: 'EO del Li: +1 (grupo 1)', Ca: 'EO del Ca: +2 (grupo 2)', Ba: 'EO del Ba: +2 (grupo 2)', Mg: 'EO del Mg: +2 (grupo 2)', Al: 'EO del Al: +3', F: 'EO del F: −1', Zn: 'EO del Zn: +2' };
  const FORMULA_EO = 'Σ n · EO = carga de la especie (0 si es neutra); n: número de átomos de cada elemento';
  const elementos = f => Object.keys(M.atomos(String(f).split('^')[0]));
  const datosEO = (f, x) => [...elementos(f).filter(s => s !== x && FIJO_TXT[s]).map(s => FIJO_TXT[s]), FORMULA_EO];
  const cargaDe = f => M.especie(f).carga;
  // «a, b y c»: la lista escrita con su «y» final.
  const conY = l => (l.length < 2 ? l.join('') : `${l.slice(0, -1).join(', ')} y ${l[l.length - 1]}`);

  // ---------- Idea 1 (rehecha, 19 nov): estados de oxidación ----------
  // Propuesta §3 idea 1. Objeto de la primera pantalla: el frasco de permanganato de la farmacia (quim-nomenclatura).
  // Cambia: el EO del átomo que falta · Permanece: los EO que casi no cambian, en sus fichas · Progresa: la suma se acerca a
  // la carga de la especie · Se reserva: las especies con dos átomos del elemento que falta (el Fe₂O₃ de Predice) ·
  // Debe verse: cuándo la suma iguala la carga (0 en una sustancia neutra, la carga en un ion).
  // Errores: QM-OX-SUBINDICE (el subíndice como EO; hipótesis del informe, de NO1 y NO3), QM-OX-TOTAL (lo de todos los
  // átomos juntos), QM-OX-SIGNO (el signo al revés), QM-OX-CARGA (la suma igualada a 0 en un ion; NO4), QM-OX-CUAL.
  const ESP1 = {
    H2SO4: { f: 'H2SO4', x: 'S' }, HNO3: { f: 'HNO3', x: 'N' }, KMnO4: { f: 'KMnO4', x: 'Mn' },
    CO3: { f: 'CO3^2-', x: 'C' }, ClO4: { f: 'ClO4^-', x: 'Cl' }, NH4: { f: 'NH4^+', x: 'N' },
  };
  // Los átomos que no son el que falta, en una ficha por elemento («O₄ 4·(−2)»), con su EO del motor.
  function conocidos(f, x) {
    const at = M.atomos(f.split('^')[0]), ox = M.oxidacion(f).valor;
    return Object.keys(at).filter(s => s !== x).map(s => ({ s, n: at[s], eo: ox[s] }));
  }
  const fichaGrupo = c => ({ t: `${c.s}${sub(c.n)} ${c.n > 1 ? `${c.n}·(${sg(c.eo)})` : sg(c.eo)}`, carga: c.n * c.eo, n: 1 });
  const sumaConocidos = (f, x) => conocidos(f, x).reduce((a, c) => a + c.n * c.eo, 0);
  function dib1(k, eo) {
    const e = ESP1[k];
    return fichas([{ t: `${e.x} ${sg(eo)}`, carga: eo, n: 1, color: 'f' }, ...conocidos(e.f, e.x).map(fichaGrupo)], { neta: 'suma de los EO',
      alt: `${bonita(e.f)}: el ${e.x} con EO ${sg(eo)} y los demás átomos con su EO; suma de los EO ${sg(eo + sumaConocidos(e.f, e.x))}.` });
  }
  // Gesto sobre quim-fichas: el átomo que falta va primero, así que sus |EO| cuadritos son los primeros de su fila (arriba
  // si EO > 0, abajo si EO < 0). La manija va en el último; con EO = 0, entre las dos filas (x = 30). Inversa:
  // k = (x − 47)/17 + 1 cuadritos, EO = ±k según la fila (frontera en y = 127).
  const PF = () => Kit.piezas['quim-fichas'];
  const arrastreEO = (dib, id, nAt) => ({ id: 'estado', etiqueta: 'final de los cuadritos del átomo violeta', color: 'c-f',
    donde: v => { const k = Math.round(v[id] * nAt(v)), g = PF().geometria(dib(v).datos); return k === 0 ? { x: 30, y: 127 } : g.cuadrito(Math.abs(k) - 1, k > 0 ? '+' : '−'); },
    mover: (pt, v) => { const k = (pt.x - 47) / 17 + 1; return { [id]: Math.round((pt.y < 127 ? k : -k) / nAt(v)) }; } });
  function lectura1(k, eo) {
    const e = ESP1[k], s = eo + sumaConocidos(e.f, e.x), z = cargaDe(e.f), t = bonita(e.f);
    return s === z ? [`Los EO suman ${sg(s)}, igual que la carga del ${t}: `, Cq(sg(z)), '.']
      : [`Los EO suman ${sg(s)}, pero la carga del ${t} es `, Cq(sg(z)), '.'];
  }

  // Opciones de un «¿qué EO tiene…?»: la correcta y tres errores con su valor de verdad (Etapa 5, regla 2).
  function opcionesEO(f, x) {
    const at = M.atomos(f.split('^')[0]), n = at[x], z = cargaDe(f), s0 = sumaConocidos(f, x), bien = (z - s0) / n;
    const suma = v => s0 + n * v, ops = [{ id: 'c', texto: sg(bien), correcta: true }], vistos = new Set([sg(bien)]);
    const pon = (v, id, error, siFuera) => { if (ops.length < 4 && Number.isInteger(v) && Math.abs(v) <= 8 && !vistos.has(sg(v))) { vistos.add(sg(v)); ops.push({ id, texto: sg(v), error, siFuera }); } };
    const parte = { 2: 'la mitad', 3: 'la tercera parte', 4: 'la cuarta parte' }[n] || `1/${n}`;
    if (n > 1) pon(n * bien, 'total', 'QM-OX-TOTAL', `Sería así si te pidieran el total: los ${n} ${x} juntos aportan ${sg(n * bien)}. La pregunta es por cada átomo, y cada uno aporta ${parte} de ese total.`);
    if (n > 1) pon(n, 'subindice', 'QM-OX-SUBINDICE', `Sería así si el subíndice fuera el EO, pero el ${n} solo cuenta cuántos átomos de ${x} hay. Con ${sg(n)} cada uno, la suma daría ${sg(suma(n))} y no ${sg(z)}, la carga.`);
    if (z !== 0) pon(-s0 / n, 'sin-carga', 'QM-OX-CARGA', `Sería así si la especie fuera neutra: con ${sg(-s0 / n)}, la suma da 0. Pero es un ion con carga ${sg(z)}, y en un ion la suma de los EO tiene que dar su carga, no 0.`);
    pon(-bien, 'signo', 'QM-OX-SIGNO', `Sería así con el signo contrario. Los demás átomos aportan ${sg(s0)}, y para llegar a ${sg(z)} el ${x} tiene que aportar ${bien > 0 ? 'positivo' : 'negativo'}: con ${sg(-bien)}, la suma da ${sg(suma(-bien))}.`);
    for (const d of [2, -2, 1, -1, 3]) pon(bien + d, `mas${d}`, 'QM-OX-SUMA', `Con ${sg(bien + d)}, la suma de los EO da ${sg(suma(bien + d))} y no ${sg(z)}, que es la carga. Revisa cuánto aporta cada elemento: su EO por su número de átomos.`);
    return ops;
  }
  // La cuenta escrita: «3 · (+1) + EO + 3 · (−2) = 0 → EO = +3». Las partes en el orden de la fórmula.
  function cuentaEO(f, x, conResultado = true) {
    const at = M.atomos(f.split('^')[0]), ox = M.oxidacion(f).valor, z = cargaDe(f), n = at[x], bien = (z - sumaConocidos(f, x)) / n;
    const partes = [];
    Object.keys(at).forEach((s, i) => {
      if (i) partes.push(' + ');
      if (s === x) partes.push(n > 1 ? `${n} · ` : '', EOf);
      else partes.push(at[s] > 1 ? `${at[s]} · (${sg(ox[s])})` : `(${sg(ox[s])})`);
    });
    return conResultado ? [...partes, ' = ', Cq(sg(z)), '   →   ', EOf, ` = ${sg(bien)}`] : [...partes, ' = ', Cq(sg(z))];
  }
  // La comprobación con números: «3 + 3 − 6 = 0».
  function compruebaEO(f) {
    const at = M.atomos(f.split('^')[0]), ox = M.oxidacion(f).valor, z = cargaDe(f);
    const terminos = Object.keys(at).map(s => at[s] * ox[s]);
    return [terminos.map((t, i) => (i === 0 ? (t < 0 ? `−${-t}` : `${t}`) : t < 0 ? ` − ${-t}` : ` + ${t}`)).join(''), ' = ', Cq(sg(z))];
  }
  const nAt = (f, x) => M.atomos(f.split('^')[0])[x];
  const pregEO = (f, x) => ['¿Qué estado de oxidación ', EOf, ` tiene el ${x} en el ${bonita(f)}${nAt(f, x) > 1 ? ' (cada átomo)' : ''}?`];
  function fichasPregunta(f, x) {
    return fichas([{ t: `${x} ?`, carga: 0, n: nAt(f, x), color: 'f', oculta: true }, ...conocidos(f, x).map(fichaGrupo)], { cuenta: false,
      alt: `${bonita(f)}: ${nAt(f, x) === 1 ? 'un átomo' : `${nAt(f, x)} átomos`} de ${x} con EO «?» y los demás con su EO.` });
  }
  // Ahora tú y Así se resuelve: listas distintas (resuelve-repite), sin las especies del juego, de Predice, de Mira ni de
  // los ejemplos (Etapa 5, reglas 8 y 15).
  const AT1 = {
    neutro: [['HClO3', 'Cl'], ['HBrO4', 'Br'], ['HIO3', 'I'], ['H2CO3', 'C'], ['KClO4', 'Cl'], ['K2SO4', 'S'], ['KNO2', 'N'], ['H3BO3', 'B'], ['K2MnO4', 'Mn'], ['H2SeO4', 'Se'], ['CaSO3', 'S']],
    ion: [['SO3^2-', 'S'], ['PO4^3-', 'P'], ['ClO3^-', 'Cl'], ['BrO3^-', 'Br'], ['IO4^-', 'I'], ['MnO4^-', 'Mn'], ['CrO4^2-', 'Cr'], ['HSO4^-', 'S'], ['H2PO4^-', 'P'], ['PH4^+', 'P']],
    dos: [['N2O3', 'N'], ['N2O5', 'N'], ['Cl2O7', 'Cl'], ['Mn2O7', 'Mn'], ['Cr2O3', 'Cr'], ['P2O7^4-', 'P'], ['H4P2O7', 'P'], ['B4O7^2-', 'B'], ['C2O4^2-', 'C'], ['H2C2O4', 'C'], ['Cl2O5', 'Cl']],
  };
  const CUAL1 = { S: ['CaSO3', 'K2SO4', 'H2S', 'S8'], Cl: ['HClO3', 'KClO4', 'KCl', 'Cl2O3'], N: ['KNO2', 'N2O5', 'NH3', 'N2O'], C: ['H2CO3', 'C2O4^2-', 'CH4', 'CO'], Mn: ['K2MnO4', 'Mn2O7', 'MnSO4', 'Mn2O3'] };
  const RES1 = [['H3PO3', 'P'], ['HClO2', 'Cl'], ['CaSO4', 'S'], ['ClO2^-', 'Cl'], ['K2C2O4', 'C'], ['BaSO4', 'S'], ['HCO3^-', 'C'], ['IO3^-', 'I']];
  function casoEO(f, x) {
    return { pregunta: pregEO(f, x), dibujo: fichasPregunta(f, x), datos: datosEO(f, x), opciones: opcionesEO(f, x),
      solucion: { texto: `Los demás átomos suman ${sg(sumaConocidos(f, x))} y la carga es ${sg(cargaDe(f))}, así que ${nAt(f, x) > 1 ? `los ${nAt(f, x)} átomos de ${x} aportan juntos` : `el ${x} aporta`} lo que falta, ${sg(cargaDe(f) - sumaConocidos(f, x))}${nAt(f, x) > 1 ? ', y cada uno se lleva una parte igual' : ''}.`, ecuacion: cuentaEO(f, x) } };
  }
  function casoCual1(r) {
    const x = r.de(Object.keys(CUAL1)), lista = r.baraja(CUAL1[x]), meta = r.de(lista), v = eoDe(meta, x);
    return { pregunta: ['¿En cuál de estas especies el ', x, ' tiene ', EOf, ` ${sg(v)}?`],
      datos: [...new Set(lista.flatMap(f => elementos(f).filter(s => s !== x && FIJO_TXT[s]).map(s => FIJO_TXT[s])))].concat([FORMULA_EO]),
      opciones: [{ id: 'c', texto: bonita(meta), correcta: true }, ...lista.filter(f => f !== meta).map((f, i) => ({ id: `e${i}`, texto: bonita(f), error: 'QM-OX-CUAL',
        siFuera: elementos(f).length === 1 ? `Sería así si el ${x} del ${bonita(f)} estuviera combinado. Ahí está solo, sin otro elemento, y un elemento sin combinar tiene EO 0.`
          : `Sería así si el ${x} del ${bonita(f)} tuviera ${sg(v)}, pero con esos vecinos la cuenta da ${sg(eoDe(f, x))}: el EO de un elemento cambia según con quién se une.` }))],
      solucion: { texto: `Haz la cuenta en cada especie, porque el mismo elemento cambia de EO según sus vecinos. El ${x} tiene ${conY(lista.map(f => `${sg(eoDe(f, x))} en el ${bonita(f)}`))}.`, ecuacion: [bonita(meta), ': ', EOf, ` = ${sg(v)}`] } };
  }

  // Ejemplos de la idea 1. Cuentas rehechas aparte (cuentas.js): HClO +1 · SO₄²⁻ +6 · H₃PO₄ +5 · CaCO₃ +4 · NO₂⁻ +3 ·
  // K₂Cr₂O₇ +6 · P₂O₅ +5 · HPO₄²⁻ +5 · Al₂(SO₄)₃ S +6 · NH₄NO₃ −3 y +5 · SO₂ +4 · MnO₂ +4 y K₂CrO₄ +6 (suma 10) ·
  // Na₂S₂O₃ +2 · N₂H₄ −2 · HClO₄ +7, Cl₂ 0, HClO₂ +3, KCl −1.
  const ejEO = (nivel, titulo, enunciado, f, x, extra = {}) => Object.assign({ nivel, titulo, enunciado, datos: datosEO(f, x),
    solucion: [{ texto: `Los demás átomos suman ${sg(sumaConocidos(f, x))} y la carga es ${sg(cargaDe(f))}${nAt(f, x) > 1 ? `; lo que falta se reparte entre los ${nAt(f, x)} átomos de ${x}` : ''}.`, ecuacion: cuentaEO(f, x, false) },
      { texto: `Al despejar, sale el EO del ${x}: es lo que le falta a la suma para llegar a la carga.`, ecuacion: [EOf, ` = ${sg(eoDe(f, x))}`] }],
    respuesta: [`${x}: `, Eo(sg(eoDe(f, x)))] }, extra);
  const EJEMPLOS_EO = [
    ejEO(1, 'El cloro de la lejía', 'La lejía desinfecta gracias al HClO que se forma en el agua. ¿Qué EO tiene el cloro en el HClO?', 'HClO', 'Cl'),
    ejEO(1, 'El azufre del sulfato', '¿Qué EO tiene el azufre en el ion SO₄²⁻?', 'SO4^2-', 'S', { figura: fichasPregunta('SO4^2-', 'S') }),
    ejEO(1, 'El fósforo de la gaseosa', 'Algunas gaseosas de cola llevan H₃PO₄. ¿Qué EO tiene el fósforo?', 'H3PO4', 'P'),
    ejEO(1, 'El carbono de la tiza', 'La tiza es sobre todo CaCO₃. ¿Qué EO tiene el carbono?', 'CaCO3', 'C'),
    ejEO(1, 'Un ion del nitrógeno', '¿Qué EO tiene el nitrógeno en el ion NO₂⁻?', 'NO2^-', 'N'),
    ejEO(2, 'Dos cromos', 'El K₂Cr₂O₇ es un sólido anaranjado del laboratorio. ¿Qué EO tiene cada cromo?', 'K2Cr2O7', 'Cr', { figura: fichasPregunta('K2Cr2O7', 'Cr') }),
    ejEO(2, 'Dos fósforos', 'El P₂O₅ seca el aire de los frascos del laboratorio. ¿Qué EO tiene cada fósforo?', 'P2O5', 'P'),
    ejEO(2, 'Un ion con hidrógeno', '¿Qué EO tiene el fósforo en el ion HPO₄²⁻?', 'HPO4^2-', 'P'),
    { nivel: 2, titulo: 'El azufre entre paréntesis', enunciado: 'El Al₂(SO₄)₃ se usa para aclarar el agua. ¿Qué EO tiene el azufre?',
      datos: datosEO('Al2(SO4)3', 'S'),
      solucion: [{ texto: 'Hay 2 Al, 3 S y 12 O: el subíndice de afuera multiplica todo lo que está dentro del paréntesis.', ecuacion: ['2 · (+3) + 3 · ', EOf, ' + 12 · (−2) = ', Cq('0')] },
        { texto: 'Los 3 azufres suman +18, así que cada uno tiene +6.', ecuacion: ['6 + 3 · ', EOf, ' − 24 = 0   →   ', EOf, ' = +6'] }],
      respuesta: ['S: ', Eo('+6')] },
    { nivel: 2, titulo: 'Dos nitrógenos distintos', enunciado: 'El abono NH₄NO₃ tiene dos iones: NH₄⁺ y NO₃⁻. ¿Qué EO tiene el nitrógeno en cada uno?',
      datos: [FIJO_TXT.H, FIJO_TXT.O, FORMULA_EO],
      solucion: [{ texto: 'En cada ion la suma es su carga.', ecuacion: cuentaEO('NH4^+', 'N', false) }, { texto: 'En el NO₃⁻, la suma tiene que dar −1:', ecuacion: cuentaEO('NO3^-', 'N', false) },
        { texto: 'Un promedio de los dos nitrógenos daría +1, que no es el EO de ninguno de los dos.' }],
      respuesta: [Eo('−3'), ' en el NH₄⁺ y ', Eo('+5'), ' en el NO₃⁻'] },
    { nivel: 3, titulo: 'Cuál tiene el azufre a +4', enunciado: '¿En cuál de estas sustancias el azufre tiene EO +4?',
      alternativas: ['H₂SO₄', 'SO₂', 'H₂S', 'S₈', 'K₂S₂O₃'], datos: [FIJO_TXT.H, FIJO_TXT.O, FIJO_TXT.K, FORMULA_EO, 'En un elemento sin combinar, el EO es 0'],
      solucion: [{ texto: 'Haz la cuenta en cada una: el S tiene +6 en el H₂SO₄, +4 en el SO₂, −2 en el H₂S, 0 en el S₈ y +2 en el K₂S₂O₃.' },
        { texto: ['En la ', letra('A'), ' el S tiene su EO más alto, +6, y en la ', letra('C'), ' tiene −2, junto al H. La ', letra('D'), ' es azufre solo, con 0, y en la ', letra('E'), ' cada azufre tiene +2.'] }],
      respuesta: [letra('B'), ', SO₂'] },
    { nivel: 3, titulo: 'Sumar dos estados', enunciado: 'Halla la suma del EO del manganeso en el MnO₂ y el del cromo en el K₂CrO₄.',
      alternativas: ['+8', '+12', '+10', '+6', '+4'], datos: [FIJO_TXT.O, FIJO_TXT.K, FORMULA_EO],
      solucion: [{ texto: 'En el MnO₂, el Mn compensa los −4 de los dos oxígenos.', ecuacion: cuentaEO('MnO2', 'Mn', false) }, { texto: 'En el K₂CrO₄, el Cr cierra la cuenta de dos K y cuatro O.', ecuacion: cuentaEO('K2CrO4', 'Cr', false) },
        { texto: 'Los dos estados suman 4 + 6 = 10.' },
        { texto: ['La ', letra('A'), ' sale de darle +2 al Mn, y la ', letra('B'), ', de ponerle al Mn el +6 del cromo. La ', letra('D'), ' es solo el EO del cromo, y la ', letra('E'), ', solo el del Mn.'] }],
      respuesta: [letra('C'), ', ', Eo('+10')] },
    { nivel: 3, titulo: 'El fijador de fotos', enunciado: 'El K₂S₂O₃ se usaba para fijar fotos. ¿Qué EO tiene cada azufre?',
      alternativas: ['+4', '+2', '+6', '−2', '−1'], datos: datosEO('K2S2O3', 'S'),
      solucion: [{ texto: 'Dos K suman +2 y tres O, −6: los dos S deben aportar +4.', ecuacion: cuentaEO('K2S2O3', 'S', false) },
        { texto: ['La ', letra('A'), ' es lo que aportan los dos S juntos, y la ', letra('C'), ' copia el EO del S del sulfato. La ', letra('D'), ' cambia el signo, y la ', letra('E'), ' olvida los tres oxígenos.'] }],
      respuesta: [letra('B'), ', ', Eo('+2')] },
    { nivel: 3, titulo: 'El combustible de los cohetes', enunciado: 'La hidracina, N₂H₄, es un combustible de cohetes. ¿Qué EO tiene cada nitrógeno?',
      alternativas: ['−4', '+2', '−2', '+4', '−3'], datos: datosEO('N2H4', 'N'),
      solucion: [{ texto: 'Cuatro H suman +4 y la molécula es neutra: los dos N aportan −4.', ecuacion: cuentaEO('N2H4', 'N', false) },
        { texto: 'Cada N aporta la mitad de −4.', ecuacion: [EOf, ' = −2'] },
        { texto: ['La ', letra('A'), ' es el total de los dos N; la ', letra('B'), ' toma el subíndice 2 como EO.'] },
        { texto: ['La ', letra('D'), ' cambia el signo del total; la ', letra('E'), ' sería un N con tres H, como en el amoníaco, NH₃.'] }],
      respuesta: [letra('C'), ', ', Eo('−2')] },
    { nivel: 3, titulo: 'Cuatro cloros en orden', enunciado: 'Ordena de mayor a menor el EO del cloro en HClO₄, Cl₂, HClO₂ y KCl.',
      alternativas: ['HClO₂ > HClO₄ > Cl₂ > KCl', 'Cl₂ > HClO₄ > HClO₂ > KCl', 'KCl > Cl₂ > HClO₂ > HClO₄', 'HClO₄ > HClO₂ > KCl > Cl₂', 'HClO₄ > HClO₂ > Cl₂ > KCl'],
      datos: [FIJO_TXT.H, FIJO_TXT.O, FIJO_TXT.K, FORMULA_EO, 'En un elemento sin combinar, el EO es 0'],
      solucion: [{ texto: 'HClO₄, +7; HClO₂, +3; Cl₂, 0; KCl, −1.', ecuacion: ['+7 > +3 > 0 > −1'] },
        { texto: ['La ', letra('A'), ' pone al HClO₂ (+3) antes que al HClO₄ (+7); la ', letra('B'), ' pone primero al cloro solo.'] },
        { texto: ['La ', letra('C'), ' da el orden al revés; la ', letra('D'), ' pone el 0 por debajo del −1.'] }],
      respuesta: [letra('E'), ', HClO₄ > HClO₂ > Cl₂ > KCl'] },
  ];

  const oxidacion = {
    id: 'estados-oxidacion',
    titulo: 'Estados de oxidación',
    pregunta: '¿Cuánto aporta cada átomo a la carga de un compuesto o de un ion?',
    temas: ['Estados de oxidación'],
    pieza: 'quim-fichas',
    aprendizaje: 'Los EO de los átomos, cada uno por su número de átomos, suman la carga de la especie; así sale el EO que falta.',
    actividad: 'Ajustar el estado de oxidación de un átomo hasta que la suma cuadre con la carga.',
    lee: {
      tarjetas: [
        { titulo: 'El permanganato', texto: 'En la farmacia venden permanganato de potasio, KMnO₄: cristales oscuros que se disuelven en agua para desinfectar. La fórmula dice qué átomos hay; cada subíndice, cuántos: un K, un Mn y cuatro O.',
          pieza: 'quim-nomenclatura', dibujo: OBJ('permanganato', { etiqueta: 'KMnO₄', nombre: 'Permanganato de potasio' }) },
        { titulo: 'Lo que aporta cada átomo', texto: 'Al unirse, los átomos ceden o ganan electrones, del todo o en parte. El estado de oxidación (EO) lleva esa cuenta como si todos fueran iones: +1 si el átomo cedió un electrón, −2 si ganó dos. Los nombres de esta unidad salen de ese número.' },
        { titulo: 'Los que casi no cambian', texto: 'El oxígeno suele tener −2 porque gana los dos electrones que le faltan, y el hidrógeno, +1 junto a un no metal, que atrae más su electrón. Los metales del grupo 1 ceden un electrón (+1); los del grupo 2, dos (+2), y el flúor gana uno (−1). Un elemento sin combinar, como el O₂, tiene 0.' },
        { titulo: 'Qué mirar', texto: 'En el juego, cada +1 de EO es un cuadrito lleno y cada −1, uno hueco. Cambia el EO del átomo violeta y mira cuándo la suma iguala la carga: 0 en un compuesto y +1 en un ion poliatómico como el NH₄⁺.' },
      ],
    },
    ejemplos: EJEMPLOS_EO,
    juega: {
      consigna: 'Cada átomo aporta cuadritos: llenos si su EO es positivo y huecos si es negativo. Los EO de todos suman la carga de la especie.',
      mision: { texto: 'Elige el ion amonio, NH₄⁺, y encuentra el EO de su nitrógeno.', logrado: v => v.k === 'NH4' && v.eo === eoDe('NH4^+', 'N'),
        bien: 'El N tiene −3: los cuatro H aportan +4 y la suma debe dar +1.' },
      voz: 'Primero los que casi no cambian; el que falta cierra la cuenta.',
      leyenda: [
        { s: EOf, t: 'estado de oxidación de un átomo' },
        { s: 'cuadritos', t: 'lleno +1; hueco −1; punteado: sin pareja' },
        { s: Cq('carga'), t: 'la carga de toda la especie' },
      ],
      controles: [
        { id: 'k', etiqueta: 'Especie', opciones: Object.keys(ESP1).map(k => ({ valor: k, texto: bonita(ESP1[k].f) })) },
        { id: 'eo', etiqueta: 'EO del átomo violeta', color: 'c-f', min: -4, max: 8, paso: 1, inicio: 0, decimales: 0 },
      ],
      dibujo: v => dib1(v.k, v.eo),
      lectura: v => lectura1(v.k, v.eo),
      minimo: 4,
      arrastres: [arrastreEO(v => dib1(v.k, v.eo), 'eo', () => 1)],
    },
    predice: {
      pieza: 'quim-fichas',
      pregunta: ['La herrumbre de un clavo es Fe₂O₃. ¿Qué estado de oxidación ', EOf, ' tiene cada hierro?'],
      datos: ['EO del O: −2', 'El Fe₂O₃ es neutro: su carga es 0'],
      voz: 'Piensa qué tienen que aportar los dos hierros juntos.',
      opciones: [
        { id: 'c', texto: '+3', correcta: true },
        { id: 'subindice', texto: '+2', error: 'QM-OX-SUBINDICE', siFuera: 'Sería así si el subíndice fuera el EO, pero el 2 del Fe₂O₃ solo cuenta cuántos hierros hay. Con +2 cada uno, los hierros aportan +4 y los oxígenos −6: la suma daría −2, no 0.' },
        { id: 'total', texto: '+6', error: 'QM-OX-TOTAL', siFuera: 'Sería así si te pidieran lo que aportan los dos hierros juntos, +6. La pregunta es por cada hierro, y los dos se reparten ese +6 por mitades.' },
        { id: 'signo', texto: '−3', error: 'QM-OX-SIGNO', siFuera: 'Sería así si los oxígenos fueran positivos. Los tres aportan −6, así que los hierros tienen que compensar con +6 en total; con −3, la suma se iría a −12.' },
      ],
      dibujo: fichas([{ t: 'Fe ?', carga: 0, n: 2, color: 'f', oculta: true }, { t: 'O −2', carga: -2, n: 3 }], { cuenta: false, alt: 'Fichas del Fe₂O₃: dos hierros con EO «?» y tres oxígenos con −2.' }),
      revelar: fichas([{ t: 'Fe +3', carga: 3, n: 2, color: 'f' }, { t: 'O −2', carga: -2, n: 3 }], { neta: 'suma de los EO', alt: 'Fichas del Fe₂O₃: dos hierros con +3 y tres oxígenos con −2; la suma de los EO es 0.' }),
      coincide: 'Coincide: 2 · (+3) + 3 · (−2) = 0.',
      noCoincide: 'Los tres O aportan −6, así que los dos Fe deben aportar +6 para que la suma dé 0: +3 cada uno.',
    },
    mira: {
      datos: { serif: true, neta: 'suma de los EO', fichas: [{ t: 'O₇ 7·(−2)', carga: -14, n: 1, desde: 1 }, { t: 'Cr ?', carga: 0, n: 2, color: 'f', desde: 2, hasta: 2, oculta: true }, { t: 'Cr +6', carga: 6, n: 2, color: 'f', desde: 3 }] },
      voz: 'Llevemos la cuenta en un ion con dos átomos iguales.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Empieza por lo que casi no cambia: en el ion Cr₂O₇²⁻ hay siete oxígenos con −2 cada uno, y juntos aportan −14.', ecuacion: ['7 · (−2) = −14'] },
        { estado: { corte: 2 }, texto: 'La suma de todos los EO debe dar −2, la carga del ion. Para pasar de −14 a −2, los dos cromos juntos tienen que aportar +12.', ecuacion: ['2 · ', EOf, ' − 14 = ', Cq('−2')] },
        { estado: { corte: 3 }, texto: 'Los dos cromos son iguales, así que se reparten el +12 por mitades: cada uno tiene EO +6.', ecuacion: [EOf, ' = +6'] },
        { estado: { corte: 3 }, texto: 'Para comprobar, suma lo de todos: 12 − 14 da −2, que es justo la carga del ion.', ecuacion: ['12 − 14 = ', Cq('−2')] },
      ],
    },
    regla: {
      texto: 'Primero pon los EO que casi no cambian: los del O, el H, los grupos 1 y 2 y el F. El que falta cierra la cuenta: los electrones que unos ceden los ganan otros, y lo que no se compensa es la carga. En el KMnO₄, el K y los cuatro O suman −7: el Mn tiene +7.',
      ecuacion: ['Σ n · ', { llave: [EOf], nota: 'de cada átomo', color: 'c-f' }, ' = ', { llave: [Cq('z')], nota: 'carga de la especie', color: 'c-h' }],
      condicion: 'el O tiene −2 y el H, +1, como casi siempre; si no, la suma con esos valores no da la carga (se ve más adelante). La carga z es 0 en una especie neutra, y un elemento sin combinar, como el O₂, tiene 0.',
      voz: 'Los conocidos primero; el que falta cierra la cuenta.',
      dibujo: fichas([{ t: 'Cr +6', carga: 6, n: 2, color: 'f' }, { t: 'O₇ 7·(−2)', carga: -14, n: 1 }], { neta: 'suma de los EO',
        alt: 'Fichas del ion Cr₂O₇²⁻: dos cromos con +6 y siete oxígenos con −2; la suma de los EO es −2, la carga del ion.' }),
    },
    resuelve: {
      pieza: 'quim-fichas',
      generar(s) {
        const [f, x] = RES1[(s % RES1.length + RES1.length) % RES1.length], n = nAt(f, x), z = cargaDe(f), s0 = sumaConocidos(f, x), bien = (z - s0) / n;
        return { enunciado: ['¿Qué estado de oxidación ', EOf, ` tiene el ${x} en el ${bonita(f)}?`], dibujo: fichasPregunta(f, x), datos: datosEO(f, x),
          pasos: [
            { tipo: 'pide', texto: [n > 1 ? `El EO de cada uno de los ${n} átomos de ${x}.` : `El EO del átomo de ${x}.`] },
            { tipo: 'datos', texto: `${datosEO(f, x).slice(0, -1).join('; ')}. ${z === 0 ? 'La sustancia es neutra.' : `La carga del ion es ${sg(z)}.`}` },
            { tipo: 'regla', texto: 'Cada EO se multiplica por su número de átomos, porque cada átomo aporta lo suyo, y la suma de todo es la carga de la especie.', ecuacion: ['Σ n · ', EOf, ' = ', Cq('z')] },
            { tipo: 'cuentas', texto: `Los átomos conocidos aportan ${sg(s0)}. Al ${x} le toca lo que falta para llegar de ${sg(s0)} a ${sg(z)}${n > 1 ? `, repartido en partes iguales entre sus ${n} átomos` : ''}.`, ecuacion: cuentaEO(f, x) },
            { tipo: 'sentido', texto: `Con ${sg(bien)}, la suma da ${sg(z)}, la carga. Un EO de ${sg(bien)} quiere decir que ${n > 1 ? 'cada' : 'el'} ${x} cuenta como si hubiera ${bien > 0 ? 'cedido' : 'ganado'} ${Math.abs(bien) === 1 ? 'un electrón' : `${Math.abs(bien)} electrones`}:`, ecuacion: compruebaEO(f) },
          ],
          respuesta: [`${x}: `, Eo(sg(bien))] };
      },
    },
    ahoraTu: {
      pieza: 'quim-fichas',
      voz: 'Suma los conocidos y compara con la carga.',
      generar(s) {
        const r = azar(s + 11), tipo = ['neutro', 'ion', 'dos', 'cual'][((s % 4) + 4) % 4];
        if (tipo === 'cual') return casoCual1(r);
        const [f, x] = r.de(AT1[tipo]);
        return casoEO(f, x);
      },
    },
  };


  // ---------- Idea 2 (rehecha, 19 nov): óxidos y sus tres nombres ----------
  // Propuesta §3 idea 2. Objeto de la primera pantalla: un clavo con herrumbre (quim-nomenclatura).
  // Cambia: el elemento y su EO · Permanece: la tarjeta con la fórmula arriba y los tres nombres debajo · Progresa: de
  // contar átomos (prefijos) a leer el EO (romano) y a elegir la terminación (-⁠oso, -⁠ico) · Se reserva: el plomo (PbO₂ de
  // Predice) · Debe verse: que los tres nombres son de la misma fórmula.
  // Errores: QM-ROMANO (el romano cuenta átomos), QM-ROMANO-O (cuenta oxígenos), NO3 (sistemas distintos = sustancias
  // distintas), QM-OSO-ICO (-⁠oso al mayor; trampa 42 de San Marcos), QM-SISTEMA (el nombre de otro sistema), QM-ROMANO-UNO
  // (romano con un solo EO), QM-PREFIJO (prefijo en el elemento equivocado), QM-CLASE-OXIDO (básico con un no metal),
  // QM-FORM-CRUCE (la fórmula sin juntar las cargas).
  const NOMBRE_EL = { Na: 'sodio', K: 'potasio', Ca: 'calcio', Mg: 'magnesio', Al: 'aluminio', Fe: 'hierro', Cu: 'cobre', Pb: 'plomo', Sn: 'estaño', Au: 'oro',
    Co: 'cobalto', Ni: 'níquel', Hg: 'mercurio', Cr: 'cromo', C: 'carbono', S: 'azufre', N: 'nitrógeno', Cl: 'cloro', Br: 'bromo', I: 'yodo', B: 'boro', P: 'fósforo', Se: 'selenio', Li: 'litio', Ba: 'bario', Zn: 'zinc', H: 'hidrógeno', O: 'oxígeno', F: 'flúor' };
  const esMetal = e => !!(M.ESTADOS[e] && M.ESTADOS[e].m);
  const estadosMetal = e => M.ESTADOS[e].m || [];
  const oxidoDe = (e, v) => M.formar('oxido', e, v).formula;
  // La fórmula partida en sus dos piezas, con el color de cada una: el elemento en naranja y el oxígeno en turquesa.
  function piezasFormula(f) {
    const t = bonita(f), m = t.match(/^(\(?[A-Z][a-z]?[₀-₉]*\)?[₀-₉]*)(.*)$/);
    return [Ca_(m[1]), An(m[2])];
  }
  const tarjetaOxido = (e, v, o = {}) => {
    const f = oxidoDe(e, v), n = M.nombrar(f);
    return NOMS(Object.assign({ titulo: esMetal(e) ? 'Óxido básico' : 'Óxido ácido', formula: piezasFormula(f),
      filas: [{ sistema: 'Sistemática', nombre: n.sistematica }, { sistema: 'Stock', nombre: conRomano(n.stock) }, { sistema: 'Tradicional', nombre: n.tradicional }] }, o));
  };
  const OX2 = [['Na', 1], ['Ca', 2], ['Al', 3], ['Fe', 2], ['Fe', 3], ['Cu', 1], ['Cu', 2], ['C', 4], ['S', 4], ['S', 6]];
  const kOx = ([e, v]) => `${e}${v}`;
  const OX2K = Object.fromEntries(OX2.map(x => [kOx(x), x]));
  function lectura2(k) {
    const [e, v] = OX2K[k], f = oxidoDe(e, v);
    return [`El ${bonita(f)} es un óxido ${esMetal(e) ? 'básico' : 'ácido'}, con el ${NOMBRE_EL[e]} en `, EOf, ` ${sg(v)}.`];
  }
  // Datos de un ejercicio de óxidos (herramientas, no el nombre hecho).
  const D2 = {
    prefijos: 'Prefijos: mono 1, di 2, tri 3, tetra 4, penta 5, hexa 6, hepta 7; con «óxido»: monóxido, pentóxido, heptóxido',
    romanos: 'Romanos: I 1, II 2, III 3, IV 4, V 5, VI 6, VII 7',
    stock: 'Stock: «óxido de» + elemento + su EO en romanos entre paréntesis; sin romano si el elemento tiene un solo EO',
    trad: 'Tradicional, elemento con dos EO: -⁠oso para el menor e -⁠ico para el mayor',
    clase: 'Metal con oxígeno: óxido básico. No metal con oxígeno: óxido ácido',
    o: 'EO del O: −2',
    cero: 'La fórmula junta los átomos hasta carga 0, con los números más chicos',
  };
  const RAIZ_TRAD = { Fe: 'hierro: ferroso / férrico', Cu: 'cobre: cuproso / cúprico', Pb: 'plomo: plumboso / plúmbico', Sn: 'estaño: estannoso / estánnico',
    Au: 'oro: auroso / áurico', Co: 'cobalto: cobaltoso / cobáltico', Ni: 'níquel: niqueloso / niquélico', Hg: 'mercurio: mercurioso / mercúrico', Cr: 'cromo: cromoso / crómico' };
  const listaY = l => (l.length < 2 ? l.join('') : `${l.slice(0, -1).join(', ')} y ${l[l.length - 1]}`);
  const estadosDe = e => (esMetal(e) ? estadosMetal(e) : M.ESTADOS[e].nm);
  const CUANTOS = ['ninguno', 'uno', 'dos', 'tres', 'cuatro'];
  const estadosTxt = e => `EO del ${NOMBRE_EL[e]}: ${listaY(estadosDe(e).map(sg))}`;
  // Ahora tú: los metales y no metales que no salen en el juego, en Predice, en Mira ni en los ejemplos.
  const AT2 = { metal: [['Co', 2], ['Co', 3], ['Ni', 2], ['Ni', 3], ['Hg', 1], ['Hg', 2]], noMetal: [['N', 3], ['N', 5], ['I', 5], ['Br', 3], ['Se', 6]] };
  const RES2 = [['Co', 3], ['Ni', 2], ['Hg', 2], ['Se', 4], ['N', 3], ['I', 5]];
  const opsTexto = (bien, malas) => { const vistos = new Set([bien]), o = [{ id: 'c', texto: bien, correcta: true }];
    malas.forEach(([t, error, siFuera], i) => { if (t && !vistos.has(t) && o.length < 4) { vistos.add(t); o.push({ id: `e${i}`, texto: t, error, siFuera }); } }); return o; };
  function casoStock(e, v) {
    const f = oxidoDe(e, v), n = M.nombrar(f), er = n.errores, at = M.atomos(f), ne = at[e], no = at.O;
    const romano = ROM[v];
    return { pregunta: `¿Cuál es el nombre Stock del ${bonita(f)}?`, datos: [estadosTxt(e), D2.o, D2.stock, D2.romanos],
      opciones: opsTexto(n.stock, [
        [ne > 1 ? `óxido de ${NOMBRE_EL[e]}(${ROM[ne]})` : null, 'QM-ROMANO', `Sería así si el romano contara átomos: el ${ROM[ne]} contaría los ${ne} átomos de ${NOMBRE_EL[e]}. Pero el romano es el EO de cada uno, ${sg(v)}; los átomos ya se ven en la fórmula.`],
        [no > 1 && no !== v ? `óxido de ${NOMBRE_EL[e]}(${ROM[no]})` : null, 'QM-ROMANO-O', `Sería así si el romano contara los ${no} oxígenos. Los oxígenos los cuenta el prefijo de la sistemática; el romano de la Stock es el EO del ${NOMBRE_EL[e]}, que es ${sg(v)}.`],
        [ne * v <= 7 && ne > 1 ? `óxido de ${NOMBRE_EL[e]}(${ROM[ne * v]})` : null, 'QM-OX-TOTAL', `Sería así si el romano fuera el total: los ${ne} átomos juntos aportan ${sg(ne * v)}. Pero el romano es el EO de cada átomo, ${sg(v)}, ${ne === 2 ? 'la mitad' : 'una parte igual'} de ese total.`],
        [`óxido de ${NOMBRE_EL[e]}`, 'QM-ROMANO-UNO', `Sería así si el ${NOMBRE_EL[e]} tuviera un solo EO. Tiene ${CUANTOS[estadosDe(e).length]}, así que forma más de un óxido, y sin el romano no se sabría de cuál hablas.`],
        [n.tradicional, 'QM-SISTEMA', 'Ese es el nombre tradicional, que dice el EO con una terminación. Nombra la misma sustancia, pero la Stock lo dice con un romano entre paréntesis.'],
        [n.sistematica, 'QM-SISTEMA', 'Ese es el nombre sistemático, que cuenta átomos con prefijos. Nombra la misma sustancia, pero la Stock no cuenta átomos: pone el EO en romanos.'],
      ]),
      solucion: { texto: `${no > 1 ? `Los ${no} O aportan` : 'El O aporta'} ${sg(-2 * no)}, así que ${ne > 1 ? `los ${ne} ${e} aportan ${sg(2 * no)} y cada uno tiene EO ${sg(v)}` : `el ${e} tiene EO ${sg(v)}`}. Ese EO va en romanos, y dice cuál de los óxidos del ${NOMBRE_EL[e]} es.`, ecuacion: [bonita(f), ': ', ...conRomano(n.stock)] } };
  }
  function casoTrad(e, v) {
    const f = oxidoDe(e, v), n = M.nombrar(f), [menor, mayor] = estadosMetal(e), alReves = n.errores.tradicionalAlReves;
    return { pregunta: `¿Cuál es el nombre tradicional del ${bonita(f)}?`, datos: [estadosTxt(e), D2.o, D2.trad, `Raíces: ${RAIZ_TRAD[e]}`],
      opciones: opsTexto(n.tradicional, [
        [alReves, 'QM-OSO-ICO', `Sería así si el ${NOMBRE_EL[e]} tuviera su EO ${v === mayor ? 'menor' : 'mayor'}. La raíz está bien, pero aquí tiene ${sg(v)}, el ${v === mayor ? 'mayor' : 'menor'} de sus dos EO, y ${v === mayor ? 'el mayor lleva -⁠ico' : 'el menor lleva -⁠oso'}: es el óxido con ${v === mayor ? 'más' : 'menos'} oxígeno.`],
        [n.stock, 'QM-SISTEMA', 'Ese es el nombre Stock, con el EO en romanos. Nombra la misma sustancia, pero la tradicional dice el EO con -⁠oso o -⁠ico, sin romano.'],
        [n.sistematica, 'QM-SISTEMA', 'Ese es el nombre sistemático, que cuenta átomos con prefijos. Nombra la misma sustancia, pero la tradicional dice el EO con -⁠oso o -⁠ico.'],
      ]),
      solucion: { texto: `El ${NOMBRE_EL[e]} tiene ${sg(v)}, el ${v === mayor ? 'mayor' : 'menor'} de sus dos EO, así que lleva ${v === mayor ? '-⁠ico, la terminación del óxido con más oxígeno' : '-⁠oso, la terminación del óxido con menos oxígeno'}.`, ecuacion: [bonita(f), `: ${n.tradicional}`] } };
  }
  function casoFormula2(e, v) {
    const f = oxidoDe(e, v), n = M.nombrar(f), at = M.atomos(f), g = (a, b) => (b ? g(b, a % b) : a);
    const sin = bonita(`${e}2O${v}`), cruzada = v === 2 ? null : bonita(`${e}${v / g(v, 2)}O${2 / g(v, 2)}`), uno = bonita(`${e}O${v}`), bien = bonita(f);
    const carga = (a, b) => sg(a * v - 2 * b);
    return { pregunta: `¿Cuál es la fórmula del ${n.stock}?`, datos: [D2.o, D2.cero, D2.romanos],
      opciones: opsTexto(bien, [
        [sin, 'QM-SIMPLIFICA', `Sería así si no se simplificara. El ${sin} es neutro, pero la fórmula de un óxido se escribe con los números más chicos que dan carga 0, así que los dos subíndices se dividen entre 2.`],
        [cruzada, 'QM-FORM-CRUCE', `Sería así si cada número se quedara con su propio átomo. Con esa fórmula, la carga queda en ${carga(v / g(v, 2), 2 / g(v, 2))} y no en 0: el EO de cada átomo pasa a ser el subíndice del otro.`],
        [uno, 'QM-FORM-UNO', `Sería así si el romano contara oxígenos. Un ${e} con ${v === 1 ? 'un oxígeno' : `${v} oxígenos`} deja carga ${carga(1, v)} y no 0, porque cada O aporta −2.`],
        [bonita(`${e}O`), 'NO2', `Sería así si el ${NOMBRE_EL[e]} tuviera +2, que compensa justo un O. Con ${sg(v)}, un átomo de cada uno deja carga ${carga(1, 1)}, y hay que juntar más átomos.`],
      ]),
      solucion: { texto: `Con ${at[e] === 1 ? 'un' : at[e]} ${e} de ${sg(v)} y ${at.O === 1 ? 'un' : at.O} O de −2, la carga da 0.`, ecuacion: [`${at[e]} · (${sg(v)}) + ${at.O} · (−2) = `, Cq('0'), `   →   ${bonita(f)}`] } };
  }
  function casoClase2(e, v) {
    const f = oxidoDe(e, v), m = esMetal(e), bien = m ? 'Óxido básico' : 'Óxido ácido';
    return { pregunta: `¿Qué clase de compuesto es el ${bonita(f)}?`, datos: [D2.clase],
      opciones: opsTexto(bien, [
        [m ? 'Óxido ácido' : 'Óxido básico', 'QM-CLASE-OXIDO', `Sería así si el ${NOMBRE_EL[e]} fuera ${m ? 'un no metal' : 'un metal'}. Es ${m ? 'un metal, y el óxido de un metal es básico porque con agua forma una base' : 'un no metal, y el óxido de un no metal es ácido porque con agua forma un ácido'}.`],
        ['No es un óxido: le falta hidrógeno', 'QM-OXIDO-H', 'Sería así si un óxido necesitara hidrógeno, pero un óxido es solo un elemento unido al oxígeno. El hidrógeno entra cuando el óxido reacciona con agua.'],
      ]),
      solucion: { texto: `El ${NOMBRE_EL[e]} es ${m ? 'un metal' : 'un no metal'} y está unido al oxígeno, así que forma un óxido ${m ? 'básico: con agua daría una base' : 'ácido: con agua daría un ácido'}.`, ecuacion: [`${bonita(f)}: ${bien.toLowerCase()}`] } };
  }

  // Ejemplos de la idea 2. Nombres del motor, comprobados con OPSIN (nombres.js): SnO₂ óxido de estaño(IV) · Cl₂O₅
  // pentóxido de dicloro · PbO óxido plumboso · K₂O · Cr₂O₃ (+3) óxido de cromo(III) · SnO · Cl₂O₃ trióxido de dicloro,
  // óxido de cloro(III) · Fe₃O₄ tetraóxido de trihierro · B₂O₃ trióxido de diboro · Au₂O₃ óxido áurico · Br₂O₇.
  const EJEMPLOS_NOMBRES = [
    { nivel: 1, titulo: 'La piedra del estaño', enunciado: 'La casiterita, de la que se saca el estaño, es SnO₂. ¿Cuál es su nombre Stock?',
      datos: [estadosTxt('Sn'), D2.o, D2.stock, D2.romanos], figura: tarjetaOxido('Sn', 4, { filas: [{ sistema: 'Stock', oculto: true }] }),
      solucion: [{ texto: 'Dos O aportan −4, así que el estaño tiene +4. Como el estaño tiene dos EO, el nombre Stock lleva ese +4 en romanos.', ecuacion: ['Sn: ', EOf, ' = +4'] }],
      respuesta: conRomano(nombre('SnO2', 'stock')) },
    { nivel: 1, titulo: 'Contar con prefijos', enunciado: '¿Cuál es el nombre sistemático del Cl₂O₅?', datos: [D2.prefijos],
      solucion: [{ texto: 'Cada prefijo cuenta los átomos de un elemento, tal como están en la fórmula: cinco O dan «pentóxido» y dos Cl dan «dicloro».', ecuacion: ['Cl₂O₅ → pent-óxido de di-cloro'] }], respuesta: [nombre('Cl2O5', 'sistematica')] },
    { nivel: 1, titulo: 'Un polvo blanco', enunciado: 'El MgO es un polvo blanco que se forma al quemar una cinta de magnesio. ¿Es un óxido básico o ácido?',
      datos: [D2.clase, 'El magnesio es un metal del grupo 2'], solucion: [{ texto: 'El magnesio es un metal del grupo 2, y el óxido de un metal es básico porque con agua forma una base.' }], respuesta: ['Óxido básico'] },
    { nivel: 1, titulo: 'El óxido del plomo menor', enunciado: 'El plomo tiene EO +2 y +4. ¿Cuál es el nombre tradicional del PbO?',
      datos: [D2.o, D2.trad, `Raíces: ${RAIZ_TRAD.Pb}`], solucion: [{ texto: 'Un O aporta −2, así que el plomo tiene +2, el menor de sus dos EO, y lleva -⁠oso.' }],
      respuesta: [nombre('PbO', 'tradicional')] },
    { nivel: 1, titulo: 'Del nombre a la fórmula', enunciado: '¿Cuál es la fórmula del óxido de potasio?', datos: ['EO del K: +1 (grupo 1)', D2.o, D2.cero],
      solucion: [{ texto: 'Cada K aporta +1 y el O, −2: hacen falta dos K.', ecuacion: ['2 · (+1) + 1 · (−2) = ', Cq('0'), '   →   K₂O'] }], respuesta: ['K₂O'] },
    { nivel: 2, titulo: 'El pigmento verde', enunciado: 'El Cr₂O₃ es un pigmento verde para pinturas. ¿Qué EO tiene el cromo y cuál es su nombre Stock?',
      datos: [estadosTxt('Cr'), D2.o, D2.stock, D2.romanos],
      solucion: [{ texto: 'Tres O aportan −6, así que los dos Cr aportan +6 y cada uno tiene +3.', ecuacion: cuentaEO('Cr2O3', 'Cr', false) }, { texto: 'Como el cromo tiene más de un EO, el nombre Stock lleva el romano.' }],
      respuesta: [Eo('+3'), '; ', ...conRomano(nombre('Cr2O3', 'stock'))] },
    { nivel: 2, titulo: 'El otro óxido del estaño', enunciado: '¿Cuál es la fórmula del óxido de estaño(II) y su nombre tradicional?', datos: [D2.o, D2.cero, D2.trad, `Raíces: ${RAIZ_TRAD.Sn}`, estadosTxt('Sn')],
      solucion: [{ texto: 'El (II) es el EO: el Sn tiene +2 y el O, −2, así que va uno de cada uno.', ecuacion: ['(+2) + (−2) = ', Cq('0'), '   →   SnO'] }, { texto: 'Como +2 es el menor de los dos EO del estaño, el nombre lleva -⁠oso.' }],
      respuesta: ['SnO, ', nombre('SnO', 'tradicional')] },
    { nivel: 2, titulo: 'Dos nombres de un óxido ácido', enunciado: 'Escribe el nombre sistemático y el Stock del Cl₂O₃.', datos: [D2.prefijos, D2.o, D2.stock, D2.romanos, 'EO del cloro: +1, +3, +5 y +7'],
      solucion: [{ texto: 'En la sistemática se cuentan tres O y dos Cl.', ecuacion: ['Cl₂O₃ → tri-óxido de di-cloro'] }, { texto: 'En la Stock, los tres O aportan −6, así que cada Cl tiene +3.', ecuacion: cuentaEO('Cl2O3', 'Cl', false) }],
      respuesta: [nombre('Cl2O3', 'sistematica'), ' y ', ...conRomano(nombre('Cl2O3', 'stock'))] },
    // Apertura (28 nov, docs/etapa9/aperturas-para-la-teoria.md): el polvo negro que atrae el imán, Fe₃O₄, nombrado por la
    // sistemática (tetraóxido de trihierro). 3 · x = 8 da x = 8/3: no hay un solo EO entero, porque tiene un Fe con +2 y dos
    // con +3 (FeO · Fe₂O₃). Reemplaza al de «Del tradicional a la fórmula» (Au₂O): el -oso del oro sigue en «El mayor del oro».
    { nivel: 2, titulo: 'El óxido negro del imán', enunciado: 'La magnetita, Fe₃O₄, es el óxido de hierro negro que se pega a un imán. ¿Cuál es su nombre sistemático, y por qué no sirve igual el nombre Stock?',
      datos: [D2.prefijos, D2.o, D2.cero, D2.stock, 'EO del hierro: +2 y +3'],
      solucion: [{ texto: 'La sistemática solo cuenta los átomos de la fórmula: cuatro O dan «tetraóxido» y tres Fe dan «trihierro». No necesita saber ningún EO.', ecuacion: ['Fe₃O₄ → tetra-óxido de tri-hierro'] },
        { texto: 'La Stock pide un solo EO del hierro, pero los cuatro O aportan −8, y tres hierros iguales tendrían que llevar +8/3 cada uno, que no es un EO.', ecuacion: ['3 · ', EOf, ' + 4 · (−2) = ', Cq('0'), SEP, EOf, ' = +8/3'] },
        { texto: 'Es que la magnetita tiene hierros de dos clases, uno con +2 y dos con +3. Un solo romano no lo dice; en la academia la llaman óxido ferroso-férrico.', ecuacion: ['(+2) + 2 · (+3) = +8'] }],
      respuesta: ['Tetraóxido de trihierro: lleva hierros con +2 y con +3'] },
    { nivel: 2, titulo: 'El óxido del boro', enunciado: 'El boro es un no metal con EO +3. ¿Qué clase de óxido forma y cuál es su nombre sistemático?', datos: [D2.clase, D2.o, D2.cero, D2.prefijos],
      solucion: [{ texto: 'Un no metal con oxígeno forma un óxido ácido. Dos B con +3 compensan tres O con −2.', ecuacion: ['2 · (+3) + 3 · (−2) = ', Cq('0'), '   →   B₂O₃'] }, { texto: 'Con tres O y dos B, el nombre sistemático es trióxido de diboro.' }],
      respuesta: ['Óxido ácido, ', nombre('B2O3', 'sistematica')] },
    { nivel: 3, titulo: 'El mayor del oro', enunciado: 'El oro tiene EO +1 y +3. ¿Cuál es el nombre tradicional del óxido del oro con su mayor EO?',
      alternativas: [nombre('Au2O3', 'tradicional'), nombre('Au2O', 'tradicional'), nombre('Au2O3', 'stock'), nombre('Au2O3', 'sistematica'), nombre('Au2O', 'stock')],
      datos: [D2.o, D2.trad, D2.stock],
      solucion: [{ texto: 'El mayor EO es +3: el óxido es Au₂O₃ y en la tradicional lleva -⁠ico.' },
        { texto: ['La ', letra('B'), ' es el óxido del EO menor. La ', letra('C'), ' es el nombre Stock y la ', letra('D'), ', el sistemático: nombran la misma sustancia con otro sistema.'] },
        { texto: ['La ', letra('E'), ' es el Stock del otro óxido, el Au₂O.'] }],
      respuesta: [letra('A'), `, ${nombre('Au2O3', 'tradicional')}`] },
    { nivel: 3, titulo: 'El par mal escrito', enunciado: '¿Cuál de estos pares fórmula y nombre está mal escrito?',
      alternativas: [`Cl₂O₇: ${nombre('Cl2O7', 'sistematica')}`, `PbO: ${nombre('PbO', 'stock')}`, `SnO₂: ${nombre('SnO2', 'tradicional')}`, 'Cr₂O₃: óxido de cromo(II)', `K₂O: ${nombre('K2O', 'stock')}`],
      datos: [D2.o, D2.prefijos, D2.stock, D2.trad, estadosTxt('Cr')],
      solucion: [{ texto: 'En el Cr₂O₃, tres O aportan −6 y cada Cr, +3: es óxido de cromo(III). El (II) contaría los dos cromos.' },
        { texto: ['La ', letra('A'), ', la ', letra('B'), ', la ', letra('C'), ' y la ', letra('E'), ' están bien escritas.'] }],
      respuesta: [letra('D'), ', Cr₂O₃: óxido de cromo(II)'] },
    { nivel: 3, titulo: 'Verdadero o falso', enunciado: 'Indica verdadero (V) o falso (F). I. El SO₃ es un óxido básico. II. En el Cr₂O₃, el cromo tiene EO +3. III. El MgO se llama óxido de magnesio(II).',
      alternativas: ['FVF', 'VVF', 'FVV', 'FFF', 'VFV'], datos: [D2.clase, D2.o, D2.stock, 'EO del Mg: +2 (grupo 2)'],
      solucion: [{ texto: 'La I es falsa: el azufre es un no metal, así que el SO₃ es un óxido ácido. La II es verdadera: los tres O aportan −6 y cada Cr tiene +3.' },
        { texto: 'La III es falsa: el magnesio tiene un solo EO, así que su nombre va sin romano.', ecuacion: ['FVF'] },
        { texto: ['La ', letra('B'), ' y la ', letra('E'), ' llaman básico al SO₃; la ', letra('C'), ' pone romano con un solo EO; la ', letra('D'), ' niega el +3 del cromo.'] }],
      respuesta: [letra('A'), ', FVF'] },
    { nivel: 3, titulo: 'Los oxígenos del óxido estánnico', enunciado: 'El estaño tiene EO +2 y +4. ¿Cuántos oxígenos hay por cada estaño en el óxido estánnico?',
      alternativas: ['1', '4', '3', '2'], datos: [D2.o, D2.trad, D2.cero],
      solucion: [{ texto: 'La terminación -⁠ico marca el EO mayor, así que el estaño tiene +4 y hacen falta dos O de −2.', ecuacion: ['(+4) + 2 · (−2) = ', Cq('0'), '   →   SnO₂'] },
        { texto: ['La ', letra('A'), ' es el óxido estannoso (SnO); la ', letra('B'), ' pone un O por cada unidad de EO; la ', letra('C'), ' no deja la carga en 0.'] }],
      respuesta: [letra('D'), ', 2'] },
    { nivel: 3, titulo: 'Un óxido del bromo', enunciado: '¿Cuál es la fórmula del óxido de bromo(VII)?',
      alternativas: ['BrO₇', 'Br₇O₂', 'BrO₂', 'Br₂O', 'Br₂O₇'], datos: [D2.o, D2.cero, D2.romanos],
      solucion: [{ texto: 'El (VII) es el EO del bromo: +7. Dos Br aportan +14 y siete O, −14.', ecuacion: ['2 · (+7) + 7 · (−2) = ', Cq('0'), '   →   Br₂O₇'] },
        { texto: ['La ', letra('A'), ' deja la carga en −7; la ', letra('B'), ' invierte los números; la ', letra('C'), ' y la ', letra('D'), ' no usan el EO +7.'] }],
      respuesta: [letra('E'), ', Br₂O₇'] },
  ];

  const tipos = {
    id: 'tres-nombres',
    titulo: 'Óxidos y sus tres nombres',
    pregunta: '¿Cómo se nombra un óxido?',
    temas: ['Tipos de nomenclatura', 'Óxidos e hidruros'],
    pieza: 'quim-nomenclatura',
    aprendizaje: 'Metal con oxígeno da óxido básico; no metal, óxido ácido. Se nombran contando átomos, con el EO en romanos o con -⁠oso e -⁠ico.',
    actividad: 'Elegir un elemento con su EO y leer su óxido y sus tres nombres.',
    lee: {
      tarjetas: [
        { titulo: 'La herrumbre', texto: 'La herrumbre de un clavo es un óxido: hierro unido al oxígeno. Un mismo óxido tiene hasta tres nombres, y el examen te puede pedir cualquiera de ellos.',
          pieza: 'quim-nomenclatura', dibujo: OBJ('clavo', { nombre: 'Un clavo con herrumbre' }) },
        { titulo: 'Prefijos y romanos', texto: 'Los prefijos cuentan átomos: mono 1, di 2, tri 3, tetra 4, penta 5, hexa 6 y hepta 7. Los números romanos, en cambio, dicen un EO: I 1, II 2, III 3, IV 4, V 5, VI 6 y VII 7. Cada sistema usa uno de ellos o ninguno.' },
        { titulo: 'Convención del examen', texto: 'En el examen, el óxido de un no metal también se llama anhídrido, «sin agua»: el SO₃ es el anhídrido sulfúrico. Un metal con dos EO lleva -⁠oso en su óxido con menos oxígeno e -⁠ico en el que tiene más. La IUPAC ya no recomienda esos nombres, pero el examen los usa.' },
        { titulo: 'Qué mirar', texto: 'El elemento y el oxígeno se juntan, cada uno con su EO, hasta que la carga da 0. En el juego, compara los tres nombres: cuál cuenta átomos y cuál dice el EO.' },
      ],
    },
    ejemplos: EJEMPLOS_NOMBRES,
    juega: {
      consigna: 'Un elemento con su EO y el oxígeno con −2 forman un óxido de tres nombres. Con un solo EO, el nombre va sin romano.',
      mision: { texto: 'Arma el óxido cuyo nombre tradicional termina en -⁠oso y lleva dos átomos del metal.', logrado: v => v.k === 'Cu1',
        bien: 'Es el Cu₂O, óxido cuproso: dos cobres con +1, el menor de sus dos EO.' },
      voz: 'Mira qué número dice cada nombre.',
      leyenda: [
        { s: Ca_('Cu'), t: 'el elemento unido al oxígeno' },
        { s: An('O'), t: 'el oxígeno, con EO −2' },
        { s: Eo('(II)'), t: 'el EO del elemento, en romanos' },
        { s: 'di-, tri-', t: 'cuántos átomos: 2, 3' },
        { s: '-⁠oso', t: 'el menor de dos EO (-⁠ico, el mayor)' },
      ],
      controles: [{ id: 'k', etiqueta: 'Elemento y su EO', opciones: OX2.map(x => ({ valor: kOx(x), texto: `${NOMBRE_EL[x[0]]} ${sg(x[1])}` })) }],
      dibujo: v => tarjetaOxido(...OX2K[v.k]),
      lectura: v => lectura2(v.k),
      minimo: 3,
    },
    predice: {
      pieza: 'quim-nomenclatura',
      pregunta: '«Óxido de plomo(IV)» y «dióxido de plomo», ¿nombran la misma sustancia?',
      datos: ['Plomo: EO +2 y +4', 'EO del O: −2'],
      voz: 'Lee qué cuenta el número romano y qué cuenta el prefijo.',
      opciones: [
        { id: 'c', texto: 'Sí: los dos son PbO₂', correcta: true },
        { id: 'cuatro', texto: 'No: el (IV) dice que hay cuatro plomos', error: 'QM-ROMANO', siFuera: 'Sería así si el romano contara átomos, pero el IV no cuenta plomos: es el EO +4 de cada plomo. Con cuatro plomos, la sistemática diría «tetraplomo».' },
        { id: 'oxigenos', texto: 'No: el (IV) dice que hay cuatro oxígenos', error: 'QM-ROMANO-O', siFuera: 'Sería así si el romano contara oxígenos, pero los oxígenos los cuenta el prefijo: «dióxido» dice que hay dos. El IV es otra cosa, el EO del plomo.' },
        { id: 'distintos', texto: 'No: dos sistemas distintos nombran sustancias distintas', error: 'NO3', siFuera: 'Son sistemas distintos, sí, pero cada sistema es solo una manera de leer la fórmula. Si dos nombres llevan a la misma fórmula, nombran la misma sustancia, como «Lima» y «la capital del Perú».' },
      ],
      dibujo: NOMS({ oculta: true, filas: [{ sistema: 'Stock', nombre: ['óxido de plomo', Eo('(IV)')] }, { sistema: 'Sistemática', nombre: 'dióxido de plomo' }] }),
      revelar: NOMS({ formula: piezasFormula('PbO2'), filas: [{ sistema: 'Stock', nombre: ['óxido de plomo', Eo('(IV)')] }, { sistema: 'Sistemática', nombre: 'dióxido de plomo' }] }),
      coincide: 'Coincide: Pb con +4 y dos O con −2 es PbO₂.',
      noCoincide: 'El IV es el EO +4 del plomo, y con dos O de −2 la fórmula es PbO₂: lo mismo que dice «dióxido de plomo».',
    },
    mira: {
      datos: tarjetaOxido('Fe', 3, { filas: [{ sistema: 'Sistemática', nombre: nombre('Fe2O3', 'sistematica'), desde: 1 }, { sistema: 'Stock', nombre: conRomano(nombre('Fe2O3', 'stock')), desde: 2 },
        { sistema: 'Tradicional', nombre: nombre('Fe2O3', 'tradicional'), desde: 3 }] }).datos,
      voz: 'Saquemos cada nombre de la fórmula.',
      pasos: [
        { estado: { corte: 1 }, texto: 'La sistemática lee la fórmula tal cual: tres O dan «trióxido» y dos Fe dan «dihierro». Para este nombre no hace falta saber ningún EO.', ecuacion: ['Fe₂O₃ → tri-óxido de di-hierro'] },
        { estado: { corte: 2 }, texto: 'La Stock calcula el EO del hierro, +3, y lo escribe en romanos. Lo necesita porque el hierro forma dos óxidos, y «óxido de hierro» solo no diría cuál.', ecuacion: ['2 · ', EOf, ' + 3 · (−2) = ', Cq('0'), SEP, EOf, ' = +3   →   ', Eo('(III)')] },
        { estado: { corte: 3 }, texto: 'La tradicional dice el EO con la terminación. El hierro tiene +2 y +3: el mayor lleva -⁠ico, «férrico», y el menor llevaría -⁠oso, «ferroso».', ecuacion: ['+3 → férrico', SEP, '+2 → ferroso'] },
      ],
    },
    regla: {
      texto: 'Un metal con oxígeno forma un óxido básico, porque con agua da una base, y un no metal forma un óxido ácido, porque con agua da un ácido. La sistemática cuenta los átomos con prefijos. La Stock escribe el EO en romanos, y la tradicional usa -⁠oso para el EO menor e -⁠ico para el mayor.',
      ecuacion: ['Fe₂O₃', SEP, 'trióxido de dihierro', SEP, 'óxido de hierro', { llave: [Eo('(III)')], nota: 'EO +3', color: 'c-f' }, SEP, 'óxido férrico'],
      condicion: 'el compuesto es un solo elemento unido al oxígeno y, para el romano o la terminación, el elemento tiene más de un EO. Con uno solo no hay dos óxidos que distinguir, y el nombre no lleva ninguno: óxido de sodio.',
      voz: 'Antes de nombrar, mira qué sistema te piden.',
    },
    resuelve: {
      generar(s) {
        const [e, v] = RES2[(s % RES2.length + RES2.length) % RES2.length], f = oxidoDe(e, v), n = M.nombrar(f), at = M.atomos(f);
        return { enunciado: `Escribe los tres nombres del ${bonita(f)}.`, datos: [estadosTxt(e), D2.o, D2.prefijos, D2.romanos, ...(esMetal(e) ? [D2.trad, `Raíces: ${RAIZ_TRAD[e]}`] : [])],
          dibujo: tarjetaOxido(e, v, { filas: [{ sistema: 'Sistemática', oculto: true }, { sistema: 'Stock', oculto: true }, { sistema: 'Tradicional', oculto: true }] }),
          pasos: [
            { tipo: 'pide', texto: 'Se piden los nombres sistemático, Stock y tradicional.' },
            { tipo: 'datos', texto: `La fórmula tiene ${at[e] === 1 ? 'un' : at[e]} ${e} y ${at.O === 1 ? 'un' : at.O} O. ${estadosTxt(e)}.` },
            { tipo: 'regla', texto: 'La sistemática cuenta átomos con prefijos, la Stock pone el EO en romanos y la tradicional lo dice con la terminación. Cada sistema lee algo distinto de la misma fórmula.' },
            { tipo: 'cuentas', texto: `La sistemática no necesita el EO, pero la Stock y la tradicional sí. Con el O en −2 y la carga en 0, el ${NOMBRE_EL[e]} tiene ${sg(v)}.`, ecuacion: cuentaEO(f, e) },
            { tipo: 'aplica', texto: `Los tres nombres son ${conY([n.sistematica, n.stock, n.tradicional])}.` },
            { tipo: 'sentido', texto: `El romano ${ROM[v]} es el EO, no un número de átomos. ${esMetal(e) ? `La terminación -⁠${v === estadosMetal(e)[1] ? 'ico' : 'oso'} dice lo mismo: +${v} es el ${v === estadosMetal(e)[1] ? 'mayor' : 'menor'} de los dos EO del ${NOMBRE_EL[e]}.` : '«Anhídrido» dice que es el óxido de un no metal, el que con agua da un ácido.'}` },
          ],
          respuesta: `${n.sistematica} = ${n.stock} = ${n.tradicional}` };
      },
    },
    ahoraTu: {
      voz: 'Halla el EO y mira qué sistema te piden.',
      generar(s) {
        const r = azar(s + 23), t = ((s % 4) + 4) % 4;
        if (t === 0) return casoStock(...r.de([...AT2.metal, ...AT2.noMetal]));
        if (t === 1) return casoTrad(...r.de(AT2.metal));
        if (t === 2) return casoFormula2(...r.de(AT2.metal));
        return casoClase2(...r.de([...AT2.metal, ...AT2.noMetal]));
      },
    },
  };

  // ---------- Idea 3 (nueva, 19 nov): peróxidos, hidruros e hidrácidos ----------
  // Propuesta §3 idea 3. Objeto de la primera pantalla: el frasco de agua oxigenada (quim-nomenclatura).
  // Cambia: el compuesto del hidrógeno · Permanece: las fichas con el EO de cada átomo · Progresa: del H +1 junto a un no
  // metal al H −1 junto a un metal, y del gas al ácido en agua · Se reserva: los peróxidos (BaO₂ contra PbO₂ en Predice) ·
  // Debe verse: que el EO del H depende de su vecino.
  // Errores: QM-PEROX-DIOXIDO (todo «MO₂» es peróxido; la trampa de San Marcos 2027-I), QM-PEROX-FORMA (lo decide la
  // forma de la fórmula), QM-OX-O (el O siempre −2), QM-PEROX-SIMPL (el peróxido se simplifica), QM-OX-H (el H siempre +1),
  // QM-HIDRACIDO-GAS (el nombre del gas para el ácido), QM-HIDR-ICO (el nombre de un oxácido para el hidrácido).
  const H3 = { NaH: 'NaH', CaH2: 'CaH2', NH3: 'NH3', CH4: 'CH4', H2O: 'H2O', H2S: 'H2S', HCl: 'HCl' };
  // Las fichas de un compuesto con cada átomo y su EO (del motor): el H en violeta, el metal en naranja, el no metal en
  // turquesa.
  function fichasH(f, o = {}) {
    const at = M.atomos(f), ox = M.oxidacion(f).valor;
    return fichas(Object.keys(at).map(s => ({ t: `${s} ${sg(ox[s])}`, carga: ox[s], n: at[s], color: s === 'H' ? 'f' : esMetal(s) ? 'o' : 'i' })),
      Object.assign({ neta: 'suma de los EO', alt: `${bonita(f)}: ${conY(Object.keys(at).map(s => `${at[s] === 1 ? 'un' : at[s]} ${s} con EO ${sg(ox[s])}`))}.` }, o));
  }
  const nombreH = f => (f === 'H2O' ? 'agua' : f === 'NH3' ? 'amoníaco' : M.nombrar(f).tradicional);
  function lectura3(k) {
    const f = H3[k], h = M.oxidacion(f).valor.H, metal = Object.keys(M.atomos(f)).some(esMetal);
    if (k === 'HCl' || k === 'H2S') return [`El ${bonita(f)} es ${nombreH(f)}, y el ${bonita(f)}(ac), ${M.nombrar(`${f}(ac)`).tradicional}.`];
    return [`${bonita(f)}, ${nombreH(f)}: junto al ${metal ? 'metal' : 'no metal'}, el H tiene `, EOf, ` ${sg(h)}.`];
  }
  const D3 = {
    perox: 'Peróxido: tiene el ion O₂²⁻, dos O unidos, cada uno con EO −1',
    simpl: 'Un ion de varios átomos no se parte: el O₂²⁻ va entero',
    hidruro: 'Hidruro de metal: el H tiene EO −1',
    hNoMetal: 'Junto a un no metal, el H tiene EO +1',
    hidracido: 'Hidrácido: HCl, HBr, HI, HF o H₂S disueltos en agua, (ac); su nombre: ácido + raíz del no metal + -⁠hídrico',
    gas: 'Sin agua, el HCl es un gas: cloruro de hidrógeno',
    orden: 'En la fórmula va primero el elemento con EO positivo',
  };
  // Ahora tú: especies que no salen en el juego, en Predice, en Mira ni en los ejemplos.
  const AT3 = { perox: ['K', 'Ca', 'Mg', 'Zn'], dioxidos: ['SnO2', 'SiO2', 'SeO2', 'CO2'], hidruros: ['AlH3', 'KH', 'BaH2', 'LiH'], hidracidos: ['HBr', 'HI', 'H2Se'] };
  const RES3 = ['Li', 'Mg', 'Zn', 'K'];
  const qCat = e => estadosMetal(e)[0] || (e === 'Zn' ? 2 : 0);
  const peroxido = e => (qCat(e) === 1 ? `${e}2O2` : `${e}O2`);
  function casoCualPerox(r) {
    const e = r.de(AT3.perox), bien = peroxido(e), malas = r.baraja(AT3.dioxidos).slice(0, 3);
    return { pregunta: '¿Cuál de estos compuestos es un peróxido?', datos: [D3.perox, `EO del ${e}: ${sg(qCat(e))}`, 'EO del O en un óxido: −2', ...malas.map(estadoTxtDe)],
      opciones: [{ id: 'c', texto: bonita(bien), correcta: true }, ...malas.map((f, i) => ({ id: `e${i}`, texto: bonita(f), error: 'QM-PEROX-DIOXIDO',
        siFuera: `Sería así si el ${elementos(f)[0]} solo llegara a +2. En el ${bonita(f)}, el ${elementos(f)[0]} tiene +4 y cada O, −2, así que es un óxido común: sus dos O no están unidos entre sí.` }))],
      solucion: { texto: `El ${NOMBRE_EL[e]} solo tiene ${sg(qCat(e))}, así que sus O no pueden tener −2: tienen −1 y forman el ion O₂²⁻, dos O unidos entre sí.`, ecuacion: [bonita(bien), `: ${nombre(bien, 'stock')}`] } };
  }
  function estadoTxtDe(f) { const x = elementos(f).find(s => s !== 'O'); return `EO del ${x}: ${listaY((esMetal(x) ? estadosMetal(x) : M.ESTADOS[x].nm).filter(v => v > 0).map(sg))}`; }
  function casoFormulaPerox(e) {
    const q = qCat(e), bien = bonita(peroxido(e)), N = NOMBRE_EL[e];
    const malas = q === 1
      ? [[bonita(`${e}O`), 'QM-PEROX-SIMPL', `Sería así si el peróxido se simplificara. Hay un ${e} por cada O, pero el ion O₂²⁻ va entero: partirlo dejaría un O suelto, que ya no es el ion del peróxido.`],
        [bonita(`${e}2O`), 'QM-FUNCION', `Sería así si pidieran el óxido de ${N}, con un O en −2. El peróxido tiene más oxígeno: lleva dos O unidos, el ion O₂²⁻.`],
        [bonita(`${e}2O4`), 'NO2', `Dos ${e}⁺ con dos iones O₂²⁻ dejan carga −2 y no 0: sobra negativo, porque cada ion necesita dos ${e}⁺.`]]
      : [[bonita(`${e}O`), 'QM-FUNCION', `Sería así si pidieran el óxido de ${N}, con un O en −2. El peróxido tiene más oxígeno: lleva dos O unidos, el ion O₂²⁻.`],
        [bonita(`${e}2O2`), 'NO2', `Dos ${e}²⁺ con un ion O₂²⁻ dejan carga +2 y no 0: sobra positivo, porque un solo ${e}²⁺ ya compensa el ion.`],
        [bonita(`${e}O4`), 'NO2', `Un ${e}²⁺ con dos iones O₂²⁻ deja carga −2 y no 0: sobra negativo, porque el ${e}²⁺ solo compensa un ion.`]];
    return { pregunta: `¿Cuál es la fórmula del peróxido de ${N}?`, datos: [D3.perox, D3.simpl, `EO del ${e}: ${sg(q)}`],
      opciones: opsTexto(bien, malas), solucion: { texto: `${q === 1 ? `Dos ${e}⁺` : `Un ${e}²⁺`} y un O₂²⁻ dejan carga 0, y el ion va entero, sin simplificar.`, ecuacion: [`${q === 1 ? '2 · (+1)' : '(+2)'} + 2 · (−1) = `, Cq('0'), `   →   ${bien}`] } };
  }
  function casoEOH(r) {
    const f = r.de([...AT3.hidruros, ...AT3.perox.map(peroxido)]), x = f.includes('O2') ? 'O' : 'H', v = M.oxidacion(f).valor[x];
    return { pregunta: ['¿Qué estado de oxidación ', EOf, ` tiene el ${x} en el ${bonita(f)}?`], datos: datosEO(f, x).filter(l => !l.startsWith(`EO del ${x}`)),
      opciones: opsTexto(sg(v), [
        [x === 'H' ? '+1' : '−2', x === 'H' ? 'QM-OX-H' : 'QM-OX-O', `Sería así si el ${x} tuviera su EO de siempre, pero con ese valor la suma daría ${sg(sumaConocidos(f, x) + nAt(f, x) * (x === 'H' ? 1 : -2))} y no 0. ${x === 'H' ? 'Junto a un metal, el H gana el electrón que el metal cede.' : 'En un peróxido, los dos O unidos se reparten el −2.'}`],
        ['0', 'QM-OX-CERO', `Sería así si el ${x} estuviera sin combinar, como en el ${x}₂. Aquí está unido a otro elemento, y con 0 la suma daría ${sg(sumaConocidos(f, x))}.`],
        [x === 'H' ? '−2' : '+1', x === 'H' ? 'QM-OX-SUMA' : 'QM-OX-SIGNO', `${x === 'H' ? 'Sería así si el H pudiera ganar dos electrones, pero solo le cabe uno más.' : 'Sería así si el O cediera electrones, pero junto a un metal los gana.'} Con ${x === 'H' ? '−2' : '+1'}, la suma daría ${sg(sumaConocidos(f, x) + nAt(f, x) * (x === 'H' ? -2 : 1))} y no 0.`],
      ]),
      solucion: { texto: `Los demás átomos aportan ${sg(sumaConocidos(f, x))} y el compuesto es neutro, así que ${nAt(f, x) > 1 ? `los ${nAt(f, x)} ${x} compensan` : `el ${x} compensa`} esa suma. ${x === 'H' ? 'Es un hidruro: el metal le cede un electrón a cada H.' : 'Es un peróxido: los dos O unidos se reparten el −2.'}`, ecuacion: cuentaEO(f, x) } };
  }
  function casoHidracido(f) {
    const ac = M.nombrar(`${f}(ac)`).tradicional, gas = M.nombrar(f).sistematica, x = elementos(f).find(s => s !== 'H'), raiz = ac.replace('ácido ', '').replace('hídrico', '');
    return { pregunta: `¿Cómo se llama el ${bonita(f)} disuelto en agua, ${bonita(f)}(ac)?`, datos: [D3.hidracido, D3.gas, `Raíz del ${NOMBRE_EL[x]}: ${raiz}-`],
      opciones: opsTexto(ac, [
        [gas, 'QM-HIDRACIDO-GAS', 'Ese es el nombre del gas, sin agua. Disuelto en agua, el compuesto suelta iones H⁺ y se vuelve un ácido, así que cambia de nombre: «ácido», la raíz y -⁠hídrico.'],
        [`ácido ${({ brom: 'bróm', yod: 'yód', selen: 'selén', clor: 'clór', fluor: 'fluór', sulf: 'sulfúr' })[raiz] || raiz}ico`, 'QM-HIDR-ICO', `Sería así si el ácido tuviera oxígeno, porque -⁠ico es de los ácidos con oxígeno. El ${bonita(f)} no lo tiene, y -⁠hídrico lo dice: es un ácido de hidrógeno y un no metal.`],
        [`ácido ${raiz === 'sulf' ? 'sulfur' : raiz}oso`, 'QM-HIDR-ICO', `Sería así si el ácido tuviera oxígeno, porque -⁠oso es de los ácidos con oxígeno. El ${bonita(f)} no lo tiene, y -⁠hídrico lo dice: es un ácido de hidrógeno y un no metal.`],
      ]),
      solucion: { texto: 'Es un ácido sin oxígeno, así que se nombra con «ácido», la raíz del no metal y -⁠hídrico, que viene de hidrógeno.', ecuacion: [`${bonita(f)}(ac): ${ac}`] } };
  }
  function casoHidruro(f) {
    const at = M.atomos(f), e = elementos(f).find(s => s !== 'H'), q = at.H, N = NOMBRE_EL[e];
    return { pregunta: `¿Cuál es la fórmula del hidruro de ${N}?`, datos: [D3.hidruro, `EO del ${e}: ${sg(q)}`, D2.cero, D3.orden],
      opciones: opsTexto(bonita(f), [
        [bonita(`H${q === 1 ? '' : q}${e}`), 'QM-HIDRURO-ORDEN', 'Sería así si el H fuera la parte positiva, como en el HCl. En un hidruro, el positivo es el metal, y en la fórmula va primero el elemento con EO positivo.'],
        [q > 1 ? bonita(`${e}H`) : bonita(`${e}H2`), 'NO2', q > 1 ? `Un H con −1 no compensa +${q}: la carga queda en ${sg(q - 1)}, y cada H solo aporta −1, así que hacen falta más.` : `Dos H con −1 dejan carga −1 y no 0: el ${e} con +1 solo compensa un H.`],
        [bonita(`${e}OH${q > 1 ? q : ''}`.replace(/OH(\d)/, '(OH)$1')), 'QM-FUNCION', 'Sería así si el compuesto llevara grupos OH, que tienen oxígeno. Un hidruro no tiene oxígeno: es solo el metal y el H, y la terminación -⁠uro dice que el H es la parte negativa.'],
      ]),
      solucion: { texto: `El ${N} aporta ${sg(q)} y cada H, −1, así que hace${q === 1 ? ' falta un H' : `n falta ${q} H`}.`, ecuacion: [`(${sg(q)}) + ${q} · (−1) = `, Cq('0'), `   →   ${bonita(f)}`] } };
  }

  // Ejemplos de la idea 3. EO y nombres del motor, comprobados aparte (cuentas.js y nombres.js): H₂O₂ O −1 · NaH hidruro
  // de sodio · HF(ac) ácido fluorhídrico · CaH₂ H −1 · Li₂O₂ · K₂O₂ −1 y K₂O −2 · MgH₂ · HCl y HCl(ac) · Na₂O₂ · NH₃ +1 y
  // NaH −1 · Na₂O₂ peróxido · H₂O₂, CaH₂, H₂S(ac) · FFV · LiH −1 y H₂S +1 (suma 0) · CaO₂.
  const EJEMPLOS_H = [
    { nivel: 1, titulo: 'El oxígeno del agua oxigenada', enunciado: 'El agua oxigenada es H₂O₂. ¿Qué EO tiene cada oxígeno?', datos: [FIJO_TXT.H, FORMULA_EO],
      figura: OBJ('agua-oxigenada', { etiqueta: 'H₂O₂', nombre: 'Agua oxigenada' }),
      solucion: [{ texto: 'Dos H aportan +2, así que los dos O deben aportar −2: −1 cada uno. Es un peróxido.', ecuacion: cuentaEO('H2O2', 'O', false) }], respuesta: ['O: ', Eo('−1')] },
    { nivel: 1, titulo: 'Sodio con hidrógeno', enunciado: '¿Cómo se llama el NaH?', datos: [D3.hidruro, 'Nombre: hidruro de + el metal'],
      solucion: [{ texto: 'Un metal con hidrógeno forma un hidruro. Como el sodio tiene un solo EO, el nombre va sin romano.' }], respuesta: [nombre('NaH', 'stock')] },
    { nivel: 1, titulo: 'Un ácido que graba vidrio', enunciado: 'El HF disuelto en agua graba el vidrio. ¿Cómo se llama el HF(ac)?', datos: [D3.hidracido, 'Raíz del flúor: fluor-'],
      solucion: [{ texto: 'Es un ácido sin oxígeno, así que se nombra con «ácido», la raíz fluor y -⁠hídrico.' }], respuesta: [M.nombrar('HF(ac)').tradicional] },
    { nivel: 1, titulo: 'El hidrógeno junto al calcio', enunciado: '¿Qué EO tiene el hidrógeno en el CaH₂?', datos: [FIJO_TXT.Ca, FORMULA_EO],
      solucion: [{ texto: 'El calcio aporta +2, así que los dos H deben aportar −2.', ecuacion: cuentaEO('CaH2', 'H', false) }], respuesta: ['H: ', Eo('−1')] },
    { nivel: 1, titulo: 'El peróxido del litio', enunciado: '¿Cuál es la fórmula del peróxido de litio?', datos: [D3.perox, D3.simpl, FIJO_TXT.Li],
      solucion: [{ texto: 'Cada Li aporta +1 y el ion O₂²⁻, −2, así que van dos Li.', ecuacion: ['2 · (+1) + 2 · (−1) = ', Cq('0'), '   →   Li₂O₂'] }], respuesta: ['Li₂O₂'] },
    { nivel: 2, titulo: 'Óxido y peróxido de potasio', enunciado: '¿Qué EO tiene el oxígeno en el K₂O y en el K₂O₂?', datos: [FIJO_TXT.K, FORMULA_EO],
      solucion: [{ texto: 'En el K₂O, dos K aportan +2 y un solo O los compensa.', ecuacion: cuentaEO('K2O', 'O', false) }, { texto: 'En el K₂O₂, los mismos +2 se compensan entre dos O.', ecuacion: cuentaEO('K2O2', 'O', false) }],
      respuesta: [Eo('−2'), ' en el K₂O y ', Eo('−1'), ' en el K₂O₂'] },
    { nivel: 2, titulo: 'El hidruro del magnesio', enunciado: '¿Cuál es la fórmula del hidruro de magnesio y qué EO tiene su hidrógeno?', datos: [D3.hidruro, FIJO_TXT.Mg, D2.cero],
      solucion: [{ texto: 'El Mg aporta +2 y cada H, −1, así que van dos H.', ecuacion: ['(+2) + 2 · (−1) = ', Cq('0'), '   →   MgH₂'] }], respuesta: ['MgH₂; H: ', Eo('−1')] },
    { nivel: 2, titulo: 'El gas y el ácido', enunciado: 'El ácido muriático de la ferretería es HCl disuelto en agua. ¿Cómo se llama el HCl como gas y cómo disuelto?', datos: [D3.hidracido, 'Sin agua: el no metal con -⁠uro + «de hidrógeno»', 'Raíz del cloro: clor-'],
      solucion: [{ texto: 'Como gas, sin agua, se llama cloruro de hidrógeno.' }, { texto: 'Disuelto en agua es un ácido sin oxígeno: el ácido clorhídrico.' }],
      respuesta: [`${M.nombrar('HCl').sistematica}; ${M.nombrar('HCl(ac)').tradicional}`] },
    { nivel: 2, titulo: 'Por qué no se simplifica', enunciado: 'El Na₂O₂ tiene sodio y oxígeno uno a uno. ¿Por qué no se escribe NaO?', datos: [D3.perox, D3.simpl, FIJO_TXT.Na],
      solucion: [{ texto: 'Los dos Na aportan +2 y los dos O, −2, así que cada O tiene −1 y los dos forman el ion O₂²⁻.', ecuacion: cuentaEO('Na2O2', 'O', false) }, { texto: 'Un ion de varios átomos no se parte: NaO tendría medio ion.' }],
      respuesta: ['El ion O₂²⁻ va entero'] },
    { nivel: 2, titulo: 'El hidrógeno con dos vecinos', enunciado: '¿Qué EO tiene el hidrógeno en el NH₃ y en el NaH?', datos: [FIJO_TXT.Na, 'EO del N junto al H: −3', FORMULA_EO],
      solucion: [{ texto: 'En el NH₃, el N aporta −3, así que los tres H aportan +3.', ecuacion: ['(−3) + 3 · ', EOf, ' = ', Cq('0'), '   →   ', EOf, ' = +1'] }, { texto: 'En el NaH, el Na aporta +1, así que el H tiene −1.', ecuacion: cuentaEO('NaH', 'H', false) }],
      respuesta: [Eo('+1'), ' en el NH₃ y ', Eo('−1'), ' en el NaH'] },
    { nivel: 3, titulo: 'Un solo peróxido', enunciado: '¿Cuál de estos compuestos es un peróxido?', alternativas: ['SO₂', 'Na₂O₂', 'SnO₂', 'CO₂', 'MnO₂'],
      datos: [D3.perox, FIJO_TXT.Na, 'EO del O en un óxido: −2', 'EO del S, del Sn, del C y del Mn: pueden tener +4'],
      solucion: [{ texto: 'El sodio solo tiene +1, así que en el Na₂O₂ los O no pueden tener −2: tienen −1, y es un peróxido.' },
        { texto: ['La ', letra('A'), ', la ', letra('C'), ', la ', letra('D'), ' y la ', letra('E'), ' son óxidos: su elemento tiene +4 y cada O, −2.'] }],
      respuesta: [letra('B'), ', Na₂O₂'] },
    { nivel: 3, titulo: 'Tres nombres a la vez', enunciado: '¿Cuáles son los nombres del H₂O₂, del CaH₂ y del H₂S(ac), en ese orden?',
      alternativas: ['dióxido de hidrógeno, hidruro de calcio y sulfuro de hidrógeno', 'peróxido de hidrógeno, hidruro de calcio y ácido sulfúrico', 'peróxido de hidrógeno, hidruro de calcio y ácido sulfhídrico',
        'peróxido de hidrógeno, hidruro de calcio y ácido sulfuroso', 'agua, hidruro de calcio y ácido sulfhídrico'],
      datos: [D3.perox, D3.hidruro, D3.hidracido, 'Raíz del azufre: sulf-'],
      solucion: [{ texto: 'El H₂O₂ tiene dos O unidos: es el peróxido de hidrógeno. El CaH₂ une un metal con H: es el hidruro de calcio.' },
        { texto: 'El H₂S(ac) es un ácido sin oxígeno, así que se llama ácido sulfhídrico.' },
        { texto: ['La ', letra('A'), ' confunde peróxido con dióxido y da el nombre del gas; la ', letra('B'), ' usa el nombre de un ácido con oxígeno, el sulfúrico.'] },
        { texto: ['La ', letra('D'), ' usa otro ácido con oxígeno, el sulfuroso; la ', letra('E'), ' llama agua al H₂O₂.'] }],
      respuesta: [letra('C')] },
    { nivel: 3, titulo: 'Verdadero o falso', enunciado: 'Indica verdadero (V) o falso (F). I. En el NaH, el H tiene EO +1. II. El Na₂O₂ se simplifica a NaO. III. El HBr(ac) es el ácido bromhídrico.',
      alternativas: ['VFV', 'FVV', 'VVF', 'FFF', 'FFV'], datos: [D3.hidruro, D3.perox, D3.simpl, D3.hidracido],
      solucion: [{ texto: 'La I es falsa, porque junto a un metal el H tiene −1. La II es falsa, porque el ion O₂²⁻ no se parte. La III es verdadera.', ecuacion: ['FFV'] },
        { texto: ['La ', letra('A'), ' y la ', letra('C'), ' dan +1 al H del hidruro; la ', letra('B'), ' y la ', letra('C'), ' simplifican el peróxido; la ', letra('D'), ' niega la III.'] }],
      respuesta: [letra('E'), ', FFV'] },
    { nivel: 3, titulo: 'La suma de dos hidrógenos', enunciado: 'Halla la suma del EO del hidrógeno en el LiH y en el H₂S.', alternativas: ['0', '+2', '−2', '+1', '−1'],
      datos: [FIJO_TXT.Li, 'EO del S junto al H: −2', FORMULA_EO],
      solucion: [{ texto: 'En el LiH, el Li aporta +1 y el H tiene −1. En el H₂S, el S aporta −2 y cada H tiene +1.', ecuacion: ['(−1) + (+1) = 0'] },
        { texto: ['La ', letra('B'), ' da +1 a los dos; la ', letra('C'), ', −1 a los dos; la ', letra('D'), ' cuenta solo el H₂S y la ', letra('E'), ', solo el LiH.'] }],
      respuesta: [letra('A'), ', 0'] },
    { nivel: 3, titulo: 'El peróxido del calcio', enunciado: '¿Cuál es la fórmula del peróxido de calcio?', alternativas: ['CaO', 'Ca₂O₂', 'CaO₄', 'CaO₂', 'Ca(OH)₂'],
      datos: [D3.perox, D3.simpl, FIJO_TXT.Ca],
      solucion: [{ texto: 'Un Ca²⁺ con un O₂²⁻ deja carga 0.', ecuacion: ['(+2) + 2 · (−1) = ', Cq('0'), '   →   CaO₂'] },
        { texto: ['La ', letra('A'), ' es el óxido de calcio; la ', letra('B'), ' deja carga +2; la ', letra('C'), ' deja −2; la ', letra('E'), ' lleva grupos OH, no el ion O₂²⁻.'] }],
      respuesta: [letra('D'), ', CaO₂'] },
  ];

  const peroxidos = {
    id: 'peroxidos-hidruros',
    titulo: 'Peróxidos, hidruros e hidrácidos',
    pregunta: '¿Qué compuestos forma el hidrógeno y qué es un peróxido?',
    temas: ['Peróxidos', 'Óxidos e hidruros', 'Ácidos oxácidos e hidrácidos'],
    pieza: 'quim-fichas',
    aprendizaje: 'Un peróxido tiene dos O unidos con −1 y no se simplifica. Con un metal, el H tiene −1. Hidrácido: HCl o H₂S en agua.',
    actividad: 'Comparar el EO del hidrógeno unido a metales y a no metales.',
    lee: {
      tarjetas: [
        { titulo: 'El agua oxigenada', texto: 'En el botiquín hay agua oxigenada para limpiar heridas: es H₂O₂ disuelto en agua. Tiene dos oxígenos unidos entre sí, algo que el agua no tiene.',
          pieza: 'quim-nomenclatura', dibujo: OBJ('agua-oxigenada', { etiqueta: 'H₂O₂', nombre: 'Agua oxigenada' }) },
        { titulo: 'Cuando los valores de siempre fallan', texto: 'El O casi siempre tiene −2 y el H, +1. Pero no siempre: si la suma de los EO no cuadra con esos valores, manda la suma, porque la carga de la especie es un dato y los EO se ajustan a ella.' },
        { titulo: 'El hidrógeno y sus vecinos', texto: 'El H se une a metales, como el sodio, y a no metales, como el cloro o el nitrógeno. Algunos de esos compuestos tienen nombre propio: el NH₃ es el amoníaco y el CH₄, el metano.' },
        { titulo: 'En agua', texto: 'El HCl es un gas que, disuelto en agua, suelta su H como ion H⁺ y se vuelve un ácido: el ácido muriático de las ferreterías. Esa solución se escribe HCl(ac), por «acuoso».' },
      ],
    },
    ejemplos: EJEMPLOS_H,
    juega: {
      consigna: 'El hidrógeno se une a metales y a no metales. Cada ficha dice el EO de su átomo.',
      mision: { texto: 'Busca un compuesto donde el hidrógeno tenga EO −1.', logrado: v => M.oxidacion(H3[v.k]).valor.H < 0,
        bien: 'Junto a un metal, el H gana un electrón y tiene −1: es un hidruro.' },
      voz: 'Mira a quién está unido el hidrógeno.',
      leyenda: [
        { s: Eo('H'), t: 'el hidrógeno, con su EO' },
        { s: Ca_('metal'), t: 'un metal: Na, Ca' },
        { s: An('no metal'), t: 'un no metal: N, C, O, S, Cl' },
        { s: '(ac)', t: 'disuelto en agua' },
      ],
      controles: [{ id: 'k', etiqueta: 'Compuesto', opciones: Object.keys(H3).map(k => ({ valor: k, texto: bonita(H3[k]) })), inicio: 'NH3' }],
      dibujo: v => fichasH(H3[v.k]),
      lectura: v => lectura3(v.k),
      minimo: 3,
    },
    predice: {
      pieza: 'quim-nomenclatura',
      pregunta: 'El BaO₂ y el PbO₂ se escriben parecido: un metal y dos oxígenos. ¿Cuál de los dos es un peróxido?',
      datos: ['Bario: solo EO +2', 'Plomo: EO +2 y +4', 'EO del O en un óxido: −2'],
      voz: 'Haz la cuenta de cada uno con el EO de su metal.',
      opciones: [
        { id: 'c', texto: 'El BaO₂', correcta: true },
        { id: 'pb', texto: 'El PbO₂', error: 'QM-PEROX-DIOXIDO', siFuera: 'Sería así si el plomo solo llegara a +2. Llega a +4, y con +4 sus dos O tienen −2, el valor de siempre: el PbO₂ es un óxido común.' },
        { id: 'los-dos', texto: 'Los dos: los dos tienen dos oxígenos', error: 'QM-PEROX-FORMA', siFuera: 'Sería así si la fórmula sola decidiera, pero dos fórmulas parecidas pueden esconder EO distintos. Hay que hacer la cuenta con el EO que puede tener cada metal.' },
        { id: 'ninguno', texto: 'Ninguno: el oxígeno siempre tiene −2', error: 'QM-OX-O', siFuera: 'Sería así si el O tuviera siempre −2. Con el bario en +2, dos O de −2 dejarían la suma en −2 y no en 0, así que en el BaO₂ el O no puede tener −2.' },
      ],
      dibujo: NOMS({ titulo: 'Dos compuestos distintos', formula: 'BaO₂   y   PbO₂', filas: [{ sistema: 'BaO₂', oculto: true }, { sistema: 'PbO₂', oculto: true }] }),
      revelar: NOMS({ titulo: 'Dos compuestos distintos', formula: 'BaO₂   y   PbO₂', filas: [{ sistema: 'BaO₂', nombre: ['peróxido: Ba +2 y cada O ', Eo('−1')] }, { sistema: 'PbO₂', nombre: ['óxido: Pb +4 y cada O ', Eo('−2')] }] }),
      coincide: 'Coincide: el Ba solo llega a +2, así que cada O tiene −1.',
      noCoincide: 'El Ba solo tiene +2, así que sus dos O suman −2, con −1 cada uno: es un peróxido. El Pb sí llega a +4, y en el PbO₂ cada O tiene −2.',
    },
    mira: {
      datos: { serif: true, neta: 'suma de los EO', fichas: [{ t: 'Na +1', carga: 1, n: 2, color: 'o', desde: 1 }, { t: 'O₂ 2·(−1)', carga: -2, n: 1, color: 'i', desde: 2 }],
        alt: 'Fichas del Na₂O₂: dos sodios con +1 y el ion O₂²⁻, con dos oxígenos a −1.' },
      voz: 'Hagamos la cuenta del peróxido de sodio.',
      pasos: [
        { estado: { corte: 1 }, texto: 'En el Na₂O₂, los dos sodios aportan +2. El sodio es del grupo 1 y solo puede tener +1, así que esa parte no cambia.', ecuacion: ['2 · (+1) = +2'] },
        { estado: { corte: 2 }, texto: 'Para llegar a 0, los dos O deben aportar −2 entre los dos, es decir, −1 cada uno, y no el −2 de siempre.', ecuacion: cuentaEO('Na2O2', 'O') },
        { estado: { corte: 2 }, texto: 'Esos dos O unidos forman el ion O₂²⁻, que va entero: la fórmula no se simplifica a NaO aunque haya un Na por cada O.', ecuacion: ['Na₂O₂: ', nombre('Na2O2', 'stock')] },
        { estado: { corte: 2 }, texto: 'En el NaH, el que cambia es el H: el sodio le cede un electrón, y por eso el H tiene −1 junto al metal.', ecuacion: cuentaEO('NaH', 'H') },
      ],
    },
    regla: {
      texto: 'Un peróxido lleva el ion O₂²⁻, dos O unidos que comparten electrones: cada uno gana solo uno y tiene −1. El ion va entero: Na₂O₂, no NaO. En un hidruro, el metal le cede un electrón al H, que queda con −1. Un hidrácido se nombra con «ácido», la raíz y -⁠hídrico, de hidrógeno: HCl(ac), ácido clorhídrico.',
      ecuacion: ['Na₂O₂: 2 · (+1) + 2 · ', Eo('(−1)'), ' = ', Cq('0'), SEP, 'NaH: (+1) + ', Eo('(−1)'), ' = ', Cq('0')],
      condicion: 'la suma no da la carga con O −2 y H +1. Entonces mira a los vecinos: junto a un metal de EO fijo, el O está en un peróxido, y el H junto a un metal está en un hidruro.',
      voz: 'La suma de los EO manda sobre los valores de siempre.',
    },
    resuelve: {
      pieza: 'quim-fichas',
      generar(s) {
        const e = RES3[((s % RES3.length) + RES3.length) % RES3.length], f = peroxido(e), q = qCat(e);
        return { enunciado: `Escribe la fórmula y el nombre del peróxido de ${NOMBRE_EL[e]}.`, datos: [D3.perox, D3.simpl, `EO del ${e}: ${sg(q)}`],
          dibujo: fichas([{ t: `${e} ${sg(q)}`, carga: q, n: 1, color: 'o' }, { t: 'O₂ 2·(−1)', carga: -2, n: 1, color: 'i' }], { cuenta: false, alt: `Fichas: un ${e} con EO ${sg(q)} y dos O unidos con −1 cada uno.` }),
          pasos: [
            { tipo: 'pide', texto: `Se piden la fórmula y el nombre del compuesto del ${NOMBRE_EL[e]} con el ion O₂²⁻.` },
            { tipo: 'datos', texto: `El ${e} aporta ${sg(q)} y el ion O₂²⁻ aporta −2, sin partirse.` },
            { tipo: 'regla', texto: 'Se juntan iones enteros hasta que la carga sea 0. El O₂²⁻ no se simplifica, porque partirlo dejaría un O suelto, que ya no sería el ion del peróxido.' },
            { tipo: 'cuentas', texto: `Cada ${e} aporta ${sg(q)}, así que ${q === 1 ? `hacen falta dos ${e} para compensar` : `un solo ${e} compensa`} el −2 del ion O₂²⁻.`, ecuacion: [`${q === 1 ? '2 · (+1)' : '(+2)'} + (−2) = `, Cq('0'), `   →   ${bonita(f)}`] },
            { tipo: 'sentido', texto: `Cada O tiene −1 y la suma da 2 − 2 = 0. «Peróxido» dice que hay más oxígeno que en el óxido común, el ${bonita(q === 1 ? `${e}2O` : `${e}O`)}: el doble de O por cada ${e}.` },
          ],
          respuesta: `${bonita(f)}, ${nombre(f, 'stock')}` };
      },
    },
    ahoraTu: {
      pieza: 'quim-fichas',
      voz: 'Haz la cuenta antes de usar los valores de siempre.',
      generar(s) {
        const r = azar(s + 37), t = ((s % 5) + 5) % 5;
        if (t === 0) return casoCualPerox(r);
        if (t === 1) return casoFormulaPerox(r.de(AT3.perox));
        if (t === 2) return casoEOH(r);
        if (t === 3) return casoHidracido(r.de(AT3.hidracidos));
        return casoHidruro(r.de(AT3.hidruros));
      },
    },
  };

  // ---------- Idea 4 (rehecha, 19 nov): hidróxidos y oxácidos ----------
  // Propuesta §3 idea 4. Objeto de la primera pantalla: el frasco de leche de magnesia (quim-nomenclatura).
  // Cambia: el elemento con su EO · Permanece: el camino óxido → + agua → producto · Progresa: del metal (hidróxido) al no
  // metal (oxácido), y del ácido que no se simplifica al que sí · Se reserva: el cloro y sus cuatro oxácidos (Predice) ·
  // Debe verse: que el EO del elemento no cambia al sumar agua.
  // Errores: QM-HIPO-PER (hipo por per; la trampa de San Marcos 2021 n.º 86), QM-OSO-ICO, QM-UN-NOMBRE (un nombre para dos
  // oxácidos), NO1 (sin paréntesis el subíndice toca solo al H), NO2 (un solo OH⁻), QM-FUNCION (el óxido por el producto),
  // QM-SIMPLIFICA (no simplificar), QM-OXACIDO-H (todo oxácido con 2 H), QM-ORTO (el P o el B con una sola agua).
  const oxacido = (e, v) => M.formar('oxacido', e, v);
  const hidroxido = (e, v) => M.formar('hidroxido', e, v).formula;
  const J4 = [['Na', 1], ['Ca', 2], ['Al', 3], ['Fe', 3], ['C', 4], ['S', 4], ['S', 6], ['N', 3], ['N', 5]];
  const J4K = Object.fromEntries(J4.map(x => [kOx(x), x]));
  const sinSimpl = (e, v) => { const o = oxacido(e, v); return o.errores.sinSimplificar || o.formula; };
  function arbol4(e, v, desde = [0, 0, 0]) {
    const met = esMetal(e), ox = oxidoDe(e, v), prod = met ? hidroxido(e, v) : oxacido(e, v).formula, nprod = met ? nombre(prod, 'stock') : nombre(prod, 'tradicional');
    const nodos = [{ texto: `${NOMBRE_EL[e]} (${sg(v)}) + oxígeno`, color: 'o', desde: desde[0] },
      { texto: `${bonita(ox)}: óxido ${met ? 'básico' : 'ácido'}`, desde: desde[1] },
      { texto: `${bonita(prod)}: ${nprod}`, color: met ? 'o' : 'i', desde: desde[2] }];
    return { pieza: 'quim-cadena', datos: { columnas: [{ titulo: met ? 'Un metal' : 'Un no metal', nodos, flechas: [{ de: 0, a: 1, desde: desde[1] }, { de: 1, a: 2, texto: met ? 'con agua' : '+ H₂O', desde: desde[2] }] }],
      alt: `${NOMBRE_EL[e]} con EO ${sg(v)} y oxígeno dan ${bonita(ox)}; con agua, ${bonita(prod)} (${nprod}).` }, estado: {} };
  }
  function lectura4(k) {
    const [e, v] = J4K[k], met = esMetal(e), ox = bonita(oxidoDe(e, v));
    if (met) return [`Con agua, el ${ox} da ${bonita(hidroxido(e, v))}, que lleva ${['', 'un', 'dos', 'tres'][v]} OH⁻.`];
    const o = oxacido(e, v), s = bonita(sinSimpl(e, v));
    return [`Con agua, el ${ox} da ${s === bonita(o.formula) ? '' : `${s}, que se simplifica a `}${bonita(o.formula)}.`];
  }
  const D4 = {
    oh: 'Hidróxido: un OH⁻ (carga −1) por cada unidad de EO del metal, entre paréntesis si se repite',
    suma: 'Oxácido: óxido ácido + H₂O; se suman todos los átomos y se simplifica si se puede',
    orto: 'El P y el B suman tres moléculas de agua a su óxido',
    nombres4: 'Con cuatro EO (+1, +3, +5, +7): hipo-⁠…-⁠oso, -⁠oso, -⁠ico, per-…-⁠ico',
    nombres2: 'Con dos EO: -⁠oso para el menor e -⁠ico para el mayor',
    // Verificación (26 nov): los hidróxidos usaban D2.stock, que dice «óxido de».
    stock: 'Stock: «hidróxido de» + metal + su EO en romanos entre paréntesis; sin romano si el metal tiene un solo EO',
  };
  const RAIZ_ACIDO = { Cl: 'clor', Br: 'brom', I: 'yod', N: 'nitr', S: 'sulfur', Se: 'seleni', C: 'carbón', P: 'fosfor', B: 'bór' };
  const estadosNM = e => M.ESTADOS[e].nm.filter(v => !((e === 'N' || e === 'P') && v === 1) && !(e === 'S' && v === 2) && !(e === 'C' && v === 2));
  const datosNombreAcido = e => [`EO del ${NOMBRE_EL[e]} en sus oxácidos: ${listaY(estadosNM(e).map(sg))}`, estadosNM(e).length === 4 ? D4.nombres4 : D4.nombres2, `Raíz: ${RAIZ_ACIDO[e]}-`];
  // Ahora tú: lo que no sale en el juego, en Predice, en Mira ni en los ejemplos.
  const AT4 = { hidroxidos: [['Co', 2], ['Co', 3], ['Ni', 2], ['Zn', 2], ['Ba', 2], ['Li', 1], ['Cu', 1]], acidos: [['Br', 5], ['I', 7], ['Se', 6], ['Br', 1], ['I', 1], ['Se', 4], ['Br', 7], ['P', 3]] };
  const RES4 = [['Br', 5], ['Se', 6], ['Co', 3], ['I', 7], ['Ni', 2]];
  function casoFormulaHidroxido(e, v) {
    const f = bonita(hidroxido(e, v)), sinP = bonita(`${e}OH${v > 1 ? v : ''}`), N = NOMBRE_EL[e];
    return { pregunta: `El ${N} tiene EO ${sg(v)}. ¿Cuál es la fórmula de su hidróxido?`, datos: [D4.oh, `EO del ${e}: ${sg(v)}`],
      opciones: opsTexto(f, [
        [v > 1 ? sinP : null, 'NO1', `Sería así si el ${v} tocara a todo el OH, pero sin paréntesis toca solo al H: serían un O y ${v} H. El paréntesis hace que el ${v} multiplique al grupo entero.`],
        [v > 1 ? bonita(`${e}OH`) : bonita(`${e}(OH)2`), 'NO2', v > 1 ? `Un solo OH⁻ no compensa ${sg(v)}: la carga queda en ${sg(v - 1)}. Cada OH⁻ aporta −1, así que hacen falta tantos como el EO.` : `Dos OH⁻ con ${sg(v)} dejan carga −1 y no 0: con EO +1 basta un OH⁻.`],
        [bonita(oxidoDe(e, v)), 'QM-FUNCION', 'Sería así si pidieran el óxido, el paso anterior. El hidróxido es lo que sale cuando ese óxido se junta con agua, y lleva grupos OH⁻.'],
        [bonita(`${e}H${v > 1 ? v : ''}`), 'QM-FUNCION', 'Sería así si pidieran el hidruro, el metal solo con H. El hidróxido lleva también oxígeno: grupos OH⁻.'],
      ]),
      solucion: { texto: `${v === 1 ? 'Hace falta un OH⁻' : `Hacen falta ${v} OH⁻`} para compensar ${sg(v)}, porque cada OH⁻ aporta −1.`, ecuacion: [`(${sg(v)}) + ${v} · (−1) = `, Cq('0'), `   →   ${f}`] } };
  }
  function casoFormulaAcido(e, v) {
    const o = oxacido(e, v), er = o.errores, bien = bonita(o.formula), nom = nombre(o.formula, 'tradicional');
    return { pregunta: `¿Cuál es la fórmula del ${nom}?`, datos: [D4.suma, ...(o.agua === 3 ? [D4.orto] : []), `El ${nom.replace('ácido ', '')}: el ${NOMBRE_EL[e]} con EO ${sg(v)}`, D2.o, D2.cero],
      opciones: opsTexto(bien, [
        [er.sinSimplificar && o.agua === 1 ? bonita(er.sinSimplificar) : null, 'QM-SIMPLIFICA', `Sería así sin simplificar. La suma de los átomos del óxido y el agua está bien, pero todos los números son pares, y falta dividirlos entre 2.`],
        [er.dosH ? bonita(er.dosH) : null, 'QM-OXACIDO-H', `Sería así si todo oxácido llevara 2 H, pero con esa fórmula la suma de los EO da ${sg(2 + v - 2 * M.atomos(o.formula).O)} y no 0. El número de H sale de sumar el agua.`],
        [er.unSoloH ? bonita(er.unSoloH) : null, 'QM-OXACIDO-H', `Sería así si todo oxácido llevara un solo H. Con esa fórmula, la suma de los EO da ${sg(1 + v - 2 * M.atomos(o.formula).O)} y no 0: el número de H sale de sumar el agua.`],
        // Sin el ácido del P con +1 (hipofosforoso): la unidad usa solo +3 y +5 para el P (propuesta §12, 5).
        [er.otroEstado && !(e === 'P' && /hipo/.test(nombre(er.otroEstado, 'tradicional'))) ? bonita(er.otroEstado) : null, 'QM-OSO-ICO', `Ese es el oxácido de otro EO del ${NOMBRE_EL[e]}, el ${nombre(er.otroEstado || o.formula, 'tradicional')}. El nombre dice el EO, y cada EO da otra fórmula.`],
        [bonita(o.oxido), 'QM-FUNCION', 'Sería así si el ácido fuera el óxido solo. El oxácido sale de sumarle agua al óxido, así que lleva también hidrógeno.'],
      ]),
      solucion: { texto: `Al ${bonita(o.oxido)} se le ${o.agua === 3 ? 'suman tres moléculas' : 'suma una molécula'} de agua, y el resultado se simplifica si se puede. El ${NOMBRE_EL[e]} conserva su EO, ${sg(v)}, en todo el camino.`, ecuacion: [`${bonita(o.oxido)} + ${o.agua === 3 ? '3 ' : ''}H₂O → ${bonita(sinSimpl(e, v))}${bonita(sinSimpl(e, v)) === bien ? '' : `   →   ${bien}`}`] } };
  }
  // El nombre de un oxácido: los nombres de los otros EO del mismo elemento son los distractores, con su EO.
  function casoNombreAcido(e, v) {
    const f = oxacido(e, v).formula, bien = nombre(f, 'tradicional'), otros = estadosNM(e).filter(x => x !== v);
    const raiz = RAIZ_ACIDO[e], malas = otros.map(x => [nombre(oxacido(e, x).formula, 'tradicional'), 'QM-OSO-ICO', `Ese es el nombre del oxácido con EO ${sg(x)}, y aquí el ${NOMBRE_EL[e]} tiene ${sg(v)}. Cada EO lleva su terminación, así que primero se hace la cuenta.`]);
    if (estadosNM(e).length === 4) malas.push([v === 7 ? `ácido hipo${raiz}ico` : v === 1 ? `ácido per${raiz}oso` : null, 'QM-HIPO-PER', 'Sería así si los prefijos fueran libres, pero hipo- («por debajo») va solo con -⁠oso y per- («al máximo»), solo con -⁠ico. Esa mezcla no nombra ningún ácido.']);
    return { pregunta: ['¿Cómo se llama el ', bonita(f), '?'], datos: [...datosNombreAcido(e), D2.o, FIJO_TXT.H],
      opciones: opsTexto(bien, malas),
      solucion: { texto: `La cuenta da ${sg(v)} para el ${NOMBRE_EL[e]}, y ese EO decide la terminación del nombre.`, ecuacion: [...cuentaEO(f, e), `   →   ${bien}`] } };
  }
  function casoNombreHidroxido(e, v) {
    const f = hidroxido(e, v), n = M.nombrar(f), dos = estadosMetal(e).length > 1;
    return { pregunta: `¿Cuál es el nombre Stock del ${bonita(f)}?`, datos: [estadosTxt(e), 'EO del OH: −1', D4.stock, D2.romanos],
      opciones: opsTexto(n.stock, [
        [n.tradicional !== n.stock ? n.tradicional : null, 'QM-SISTEMA', 'Ese es el nombre tradicional, que dice el EO con -⁠oso o -⁠ico. Nombra la misma sustancia, pero la Stock lo dice con un romano entre paréntesis.'],
        [n.sistematica, 'QM-SISTEMA', 'Ese es el nombre sistemático, que cuenta los OH con prefijos. Nombra la misma sustancia, pero la Stock no cuenta: pone el EO en romanos.'],
        [dos ? `hidróxido de ${NOMBRE_EL[e]}` : `hidróxido de ${NOMBRE_EL[e]}(${ROM[v]})`, 'QM-ROMANO-UNO', dos ? `Sería así si el ${NOMBRE_EL[e]} tuviera un solo EO. Tiene dos, así que forma dos hidróxidos, y sin el romano no se sabría de cuál hablas.` : `Sería así si el ${NOMBRE_EL[e]} tuviera más de un EO. Tiene uno solo, así que no hay otro hidróxido que distinguir y el nombre va sin romano.`],
        [dos ? `hidróxido de ${NOMBRE_EL[e]}(${ROM[estadosMetal(e).find(x => x !== v)]})` : null, 'QM-ROMANO', `Ese romano es el otro EO del ${NOMBRE_EL[e]}, el de su otro hidróxido. Aquí ${v === 1 ? 'un OH⁻ compensa' : `${v} OH⁻ compensan`} ${sg(v)}, así que el romano es ${ROM[v]}.`],
      ]),
      solucion: { texto: `${v === 1 ? 'Un OH⁻ aporta' : `${['', '', 'Dos', 'Tres', 'Cuatro'][v]} OH⁻ aportan`} ${sg(-v)}, así que el ${NOMBRE_EL[e]} tiene ${sg(v)}${dos ? ', y el romano dice cuál de sus dos hidróxidos es' : ''}.`, ecuacion: [bonita(f), ': ', ...conRomano(n.stock)] } };
  }

  // Ejemplos de la idea 4. Fórmulas y nombres del motor, comprobados con OPSIN (nombres.js): Ca(OH)₂ · NaOH hidróxido de
  // sodio · H₂CO₃ · H₂SO₃ ácido sulfuroso · Al(OH)₃ · Fe(OH)₂ hidróxido de hierro(II), ferroso · HNO₃ (H₂N₂O₆ simplificado)
  // · H₃PO₄ · HClO hipocloroso · Cu(OH)₂ cúprico · Pb(OH)₂ hidróxido de plomo(II) · HBrO₂ ácido bromoso · HIO₃ ácido yódico ·
  // VFV · sulfúrico +6 y nitroso +3 (suma 9).
  const EJEMPLOS_ACIDOS = [
    { nivel: 1, titulo: 'La cal apagada', enunciado: 'El calcio tiene EO +2. ¿Cuál es la fórmula de su hidróxido, la cal apagada de las obras?', datos: [D4.oh, FIJO_TXT.Ca],
      solucion: [{ texto: 'Dos OH⁻ compensan el +2, y como el OH se repite, va entre paréntesis.', ecuacion: ['(+2) + 2 · (−1) = ', Cq('0'), '   →   Ca(OH)₂'] }], respuesta: ['Ca(OH)₂'] },
    { nivel: 1, titulo: 'La soda cáustica', enunciado: 'La soda cáustica para destapar cañerías es NaOH. ¿Cuál es su nombre Stock?', datos: [FIJO_TXT.Na, D4.stock],
      solucion: [{ texto: 'Un metal con OH⁻ forma un hidróxido. Como el sodio tiene un solo EO, el nombre va sin romano.' }], respuesta: [nombre('NaOH', 'stock')] },
    { nivel: 1, titulo: 'El ácido de la gaseosa', enunciado: 'El CO₂ de una gaseosa se junta con agua. ¿Qué oxácido forma y cómo se llama?',
      datos: [D4.suma, 'El carbono forma un solo oxácido, con EO +4: su nombre termina en -⁠ico', 'Raíz: carbón-'],
      solucion: [{ texto: 'Se suman los átomos del óxido y del agua.', ecuacion: ['CO₂ + H₂O → H₂CO₃'] }], respuesta: ['H₂CO₃, ', nombre('H2CO3', 'tradicional')] },
    { nivel: 1, titulo: 'El azufre con +4', enunciado: '¿Cómo se llama el H₂SO₃, en el que el azufre tiene EO +4?', datos: [...datosNombreAcido('S')],
      solucion: [{ texto: 'El azufre tiene +4 y +6 en sus oxácidos, y como +4 es el menor, el nombre lleva -⁠oso.' }], respuesta: [nombre('H2SO3', 'tradicional')] },
    { nivel: 1, titulo: 'El hidróxido del aluminio', enunciado: '¿Cuál es la fórmula del hidróxido de aluminio?', datos: [D4.oh, FIJO_TXT.Al],
      solucion: [{ texto: 'Tres OH⁻ compensan el +3.', ecuacion: ['(+3) + 3 · (−1) = ', Cq('0'), '   →   Al(OH)₃'] }], respuesta: ['Al(OH)₃'] },
    { nivel: 2, titulo: 'Dos nombres de un hidróxido', enunciado: 'Escribe el nombre Stock y el tradicional del Fe(OH)₂.', datos: [estadosTxt('Fe'), 'EO del OH: −1', D4.stock, D2.trad, `Raíces: ${RAIZ_TRAD.Fe}`],
      solucion: [{ texto: 'Dos OH⁻ aportan −2: el hierro tiene +2, el menor de sus dos EO.' }, { texto: 'Por eso el nombre Stock lleva (II) y el tradicional lleva -⁠oso.' }],
      respuesta: [...conRomano(nombre('Fe(OH)2', 'stock')), ' y ', nombre('Fe(OH)2', 'tradicional')] },
    { nivel: 2, titulo: 'Sumar y simplificar', enunciado: 'El N₂O₅ se junta con agua. ¿Qué oxácido forma?', datos: [D4.suma],
      solucion: [{ texto: 'Se suman los átomos: 2 H, 2 N y 6 O.', ecuacion: ['N₂O₅ + H₂O → H₂N₂O₆'] }, { texto: 'Todos los números se dividen entre 2.', ecuacion: ['H₂N₂O₆ → HNO₃'] }],
      respuesta: ['HNO₃, ', nombre('HNO3', 'tradicional')] },
    { nivel: 2, titulo: 'El ácido del fósforo', enunciado: 'El fósforo con EO +5 forma el óxido P₂O₅. ¿Cuál es la fórmula de su oxácido?', datos: [D4.suma, D4.orto],
      solucion: [{ texto: 'El P suma tres moléculas de agua: quedan 6 H, 2 P y 8 O.', ecuacion: ['P₂O₅ + 3 H₂O → H₆P₂O₈'] }, { texto: 'Todos los números se dividen entre 2.', ecuacion: ['H₆P₂O₈ → H₃PO₄'] }],
      respuesta: ['H₃PO₄, ', nombre('H3PO4', 'tradicional')] },
    { nivel: 2, titulo: 'El ácido de la lejía', enunciado: 'En la lejía se forma HClO. ¿Qué EO tiene el cloro y cómo se llama el ácido?', datos: datosNombreAcido('Cl').concat([FIJO_TXT.H, D2.o]),
      solucion: [{ texto: 'Con el H en +1 y el O en −2, el cloro tiene +1.', ecuacion: cuentaEO('HClO', 'Cl', false) }, { texto: 'El +1 es el menor de los cuatro EO, así que el nombre lleva hipo-⁠…-⁠oso.' }],
      respuesta: [Eo('+1'), ', ', nombre('HClO', 'tradicional')] },
    { nivel: 2, titulo: 'El hidróxido azul', enunciado: 'El Cu(OH)₂ es un sólido azul. ¿Cuál es su nombre tradicional?', datos: [estadosTxt('Cu'), 'EO del OH: −1', D2.trad, `Raíces: ${RAIZ_TRAD.Cu}`],
      solucion: [{ texto: 'Dos OH⁻ aportan −2, así que el cobre tiene +2, el mayor de sus dos EO, y lleva -⁠ico.' }], respuesta: [nombre('Cu(OH)2', 'tradicional')] },
    { nivel: 3, titulo: 'El nombre Stock pedido', enunciado: '¿Cuál es el nombre Stock del Pb(OH)₂?',
      alternativas: ['hidróxido plumboso', 'dihidróxido de plomo', 'hidróxido de plomo(II)', 'hidróxido de plomo(IV)', 'hidróxido de plomo'],
      datos: [estadosTxt('Pb'), 'EO del OH: −1', D4.stock],
      solucion: [{ texto: 'Dos OH⁻ aportan −2, así que el plomo tiene +2. Como el plomo tiene dos EO, el nombre lleva el romano.' },
        { texto: ['La ', letra('A'), ' es el nombre tradicional y la ', letra('B'), ', el sistemático, que son otros sistemas. La ', letra('D'), ' usa el otro EO, y la ', letra('E'), ' olvida el romano.'] }],
      respuesta: [letra('C'), ', hidróxido de plomo(II)'] },
    { nivel: 3, titulo: 'El ácido bromoso', enunciado: 'El bromo forma oxácidos con EO +1, +3, +5 y +7. ¿Cuál es la fórmula del ácido bromoso?',
      alternativas: ['HBrO', 'HBrO₃', 'HBrO₄', 'H₂BrO₂', 'HBrO₂'], datos: [D4.nombres4, D4.suma, FIJO_TXT.H, D2.o],
      solucion: [{ texto: 'La terminación -⁠oso sin prefijo es el segundo EO, +3. El Br₂O₃ con agua da H₂Br₂O₄, que se simplifica.', ecuacion: ['H₂Br₂O₄ → HBrO₂'] },
        { texto: ['La ', letra('A'), ' es el hipobromoso (+1); la ', letra('B'), ', el brómico (+5); la ', letra('C'), ', el perbrómico (+7); la ', letra('D'), ' pone 2 H y la suma da −1.'] }],
      respuesta: [letra('E'), ', HBrO₂'] },
    { nivel: 3, titulo: 'El yodo con +5', enunciado: 'El yodo con EO +5 forma un oxácido. ¿Cuál es su fórmula y su nombre?',
      alternativas: ['HIO₃, ácido yodoso', 'HIO₃, ácido yódico', 'H₂IO₃, ácido yódico', 'HIO₄, ácido peryódico', 'HI₂O₆, ácido yódico'], datos: [D4.nombres4, D4.suma, 'Raíz: yod-'],
      solucion: [{ texto: 'El I₂O₅ con agua da H₂I₂O₆, que se simplifica a HIO₃. El +5 es el tercero de los cuatro EO, así que lleva -⁠ico.' },
        { texto: ['La ', letra('A'), ' le da -⁠oso; la ', letra('C'), ' pone 2 H; la ', letra('D'), ' es el de +7; la ', letra('E'), ' no simplifica.'] }],
      respuesta: [letra('B'), ', HIO₃, ácido yódico'] },
    { nivel: 3, titulo: 'Verdadero o falso', enunciado: 'Indica verdadero (V) o falso (F). I. El Ca(OH)₂ es un hidróxido. II. El HNO₂ es el ácido nítrico. III. En el ácido hipocloroso, el cloro tiene EO +1.',
      alternativas: ['VVV', 'FFV', 'VFF', 'VFV', 'VVF'], datos: [D4.oh, ...datosNombreAcido('N').slice(0, 2), D4.nombres4, FIJO_TXT.H, D2.o],
      solucion: [{ texto: 'La I es verdadera. La II es falsa: el N del HNO₂ tiene +3, el menor, así que es el ácido nitroso. La III es verdadera: hipo-⁠…-⁠oso es el EO +1.', ecuacion: ['HNO₂: 1 + ', EOf, ' − 4 = 0   →   ', EOf, ' = +3'] },
        { texto: ['La ', letra('A'), ' y la ', letra('E'), ' llaman nítrico al HNO₂; la ', letra('B'), ' niega la I; la ', letra('C'), ' y la ', letra('E'), ' niegan la III.'] }],
      respuesta: [letra('D'), ', VFV'] },
    { nivel: 3, titulo: 'Sulfúrico más nitroso', enunciado: 'Halla la suma del EO del azufre en el ácido sulfúrico y el del nitrógeno en el ácido nitroso.',
      alternativas: ['+9', '+11', '+7', '+6'], datos: [...datosNombreAcido('S').slice(0, 1), ...datosNombreAcido('N').slice(0, 1), D4.nombres2],
      solucion: [{ texto: 'El sulfúrico tiene el EO mayor del azufre, +6, y el nitroso, el menor del nitrógeno, +3.', ecuacion: ['6 + 3 = 9'] },
        { texto: ['La ', letra('B'), ' toma el nitroso por nítrico (+5); la ', letra('C'), ' toma el sulfúrico por sulfuroso (+4); la ', letra('D'), ' es solo el azufre.'] }],
      respuesta: [letra('A'), ', ', Eo('+9')] },
  ];

  const funciones = {
    id: 'arbol-funciones',
    titulo: 'Hidróxidos y oxácidos',
    pregunta: '¿Qué sale cuando un óxido se junta con agua?',
    temas: ['Hidróxidos', 'Ácidos oxácidos e hidrácidos'],
    pieza: 'quim-cadena',
    aprendizaje: 'Óxido básico con agua: hidróxido, un OH⁻ por unidad de EO. Óxido ácido con agua: oxácido, nombrado con hipo-, -⁠oso, -⁠ico o per-.',
    actividad: 'Elegir un elemento con su EO y seguir su óxido hasta el producto con agua.',
    lee: {
      tarjetas: [
        { titulo: 'La leche de magnesia', texto: 'La leche de magnesia, para la acidez del estómago, es Mg(OH)₂ en agua. El grupo OH⁻, un O y un H con carga −1, va entero, y si se repite se escribe entre paréntesis.',
          pieza: 'quim-nomenclatura', dibujo: OBJ('magnesia', { etiqueta: 'Mg(OH)₂', nombre: 'Leche de magnesia' }) },
        { titulo: 'Óxido más agua', texto: 'Si a un óxido se le suma agua, sus átomos se juntan en un solo compuesto: CaO + H₂O da Ca(OH)₂. El EO del elemento no cambia, porque el H del agua sigue con +1 y su O, con −2.' },
        { titulo: 'Ácidos con oxígeno', texto: 'Un no metal da un ácido con oxígeno, un oxácido: la batería del auto lleva ácido sulfúrico, H₂SO₄. En el agua, un ácido suelta iones H⁺.' },
        { titulo: 'Qué mirar', texto: 'En el juego, mira cuántos H y cuántos O quedan en el producto después de simplificar, y qué terminación lleva su nombre.' },
      ],
    },
    ejemplos: EJEMPLOS_ACIDOS,
    juega: {
      consigna: 'Cada óxido, con agua, forma otro compuesto. Elige el elemento con su EO y sigue el camino.',
      mision: { texto: 'Arma un oxácido que tenga un solo hidrógeno.', logrado: v => { const [e, x] = J4K[v.k]; return !esMetal(e) && M.atomos(oxacido(e, x).formula).H === 1; },
        bien: 'El N₂O₅ con agua da H₂N₂O₆: al simplificar queda un solo H.' },
      voz: 'El EO del elemento no cambia en todo el camino.',
      leyenda: [
        { s: Ca_('metal'), t: 'da un hidróxido' },
        { s: An('no metal'), t: 'da un oxácido' },
        { s: '+ H₂O', t: 'se le suma agua' },
        { s: 'OH⁻', t: 'el ion hidróxido, carga −1' },
      ],
      controles: [{ id: 'k', etiqueta: 'Elemento y su EO', opciones: J4.map(x => ({ valor: kOx(x), texto: `${NOMBRE_EL[x[0]]} ${sg(x[1])}` })) }],
      dibujo: v => arbol4(...J4K[v.k]),
      lectura: v => lectura4(v.k),
      minimo: 3,
    },
    predice: {
      pieza: 'quim-cadena',
      pregunta: 'El cloro forma oxácidos con EO +1, +3, +5 y +7. El HClO₃, con +5, es el ácido clórico. ¿Cómo se llama el HClO₄, con +7?',
      datos: ['Cloro en sus oxácidos: EO +1, +3, +5 y +7', 'HClO₃: ácido clórico (cloro con +5)'],
      voz: 'Cuatro EO piden más que dos terminaciones.',
      opciones: [
        { id: 'c', texto: 'Ácido perclórico', correcta: true },
        { id: 'hipo', texto: 'Ácido hipoclórico', error: 'QM-HIPO-PER', siFuera: 'Sí hace falta un prefijo, porque cuatro EO no caben en dos terminaciones. Pero hipo- significa «por debajo»: va con -⁠oso y marca el EO menor, +1.' },
        { id: 'oso', texto: 'Ácido cloroso', error: 'QM-OSO-ICO', siFuera: 'Sería así si el cloro tuviera +3. La terminación -⁠oso marca un EO más bajo que -⁠ico, y aquí el cloro tiene más que en el clórico: +7.' },
        { id: 'igual', texto: 'Ácido clórico, igual que el HClO₃', error: 'QM-UN-NOMBRE', siFuera: 'Sería así si el nombre solo dijera el elemento. Cada EO da un ácido distinto, con su fórmula: el HClO₄ tiene un O más que el HClO₃, y por eso lleva otro nombre.' },
      ],
      dibujo: { pieza: 'quim-cadena', datos: { columnas: [{ titulo: 'Oxácidos del cloro', nodos: [{ texto: 'HClO₃: ácido clórico (+5)' }, { texto: 'HClO₄: ? (+7)', color: 'f' }], flechas: [{ de: 0, a: 1, texto: 'un O más' }] }],
        alt: 'El HClO₃, ácido clórico, con el cloro a +5, y el HClO₄, con el cloro a +7 y el nombre que se pregunta.' }, estado: {} },
      revelar: { pieza: 'quim-cadena', datos: { columnas: [{ titulo: 'Oxácidos del cloro', nodos: [{ texto: 'HClO₃: ácido clórico (+5)' }, { texto: 'HClO₄: ácido perclórico (+7)', color: 'f' }], flechas: [{ de: 0, a: 1, texto: 'un O más' }] }],
        alt: 'El HClO₃, ácido clórico, con +5, y el HClO₄, ácido perclórico, con +7.' }, estado: {} },
      coincide: 'Coincide: per-…-⁠ico es el más alto de los cuatro.',
      noCoincide: 'Con cuatro EO, los nombres son hipo-⁠…-⁠oso, -⁠oso, -⁠ico y per-…-⁠ico, en ese orden. Per- marca el más alto: el +7 es el ácido perclórico.',
    },
    mira: {
      pieza: 'quim-cadena',
      datos: { columnas: [{ titulo: 'Cloro (+7)', nodos: [{ texto: 'Cl₂O₇: óxido ácido', desde: 1 }, { texto: 'H₂Cl₂O₈', desde: 2 }, { texto: 'HClO₄: ácido perclórico', color: 'i', desde: 3 }],
        flechas: [{ de: 0, a: 1, texto: '+ H₂O', desde: 2 }, { de: 1, a: 2, texto: 'entre 2', desde: 3 }] },
        { titulo: 'Hierro (+3)', nodos: [{ texto: 'Fe₂O₃: óxido básico', desde: 5 }, { texto: 'Fe(OH)₃: hidróxido de hierro(III)', color: 'o', desde: 5 }], flechas: [{ de: 0, a: 1, texto: 'con agua', desde: 5 }] }],
        alt: 'El Cl₂O₇ con agua da H₂Cl₂O₈, que se simplifica a HClO₄; el hierro con +3, con agua, da Fe(OH)₃.' },
      voz: 'Sumemos átomos enteros y simplifiquemos.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Primero se arma el óxido: el cloro con +7 y el oxígeno con −2 dan Cl₂O₇, porque dos Cl aportan +14 y siete O, −14.', ecuacion: ['2 · (+7) + 7 · (−2) = ', Cq('0')] },
        { estado: { corte: 2 }, texto: 'Con agua no aparece nada nuevo: se suman los átomos del óxido y de una molécula de H₂O, y quedan 2 H, 2 Cl y 8 O.', ecuacion: ['Cl₂O₇ + H₂O → H₂Cl₂O₈'] },
        { estado: { corte: 3 }, texto: 'Todos los números son pares, así que se dividen entre 2 y queda HClO₄. El cloro sigue con +7, y su nombre es ácido perclórico.', ecuacion: ['H₂Cl₂O₈ → HClO₄'] },
        { estado: { corte: 4 }, texto: 'El cloro tiene cuatro oxácidos. Del EO menor al mayor van hipo- («por debajo») con -⁠oso, -⁠oso, -⁠ico y per- («al máximo») con -⁠ico.', ecuacion: ['+1 hipocloroso', SEP, '+3 cloroso', SEP, '+5 clórico', SEP, '+7 perclórico'] },
        { estado: { corte: 5 }, texto: 'Con un metal, en cambio, sale un hidróxido. Cada OH⁻ aporta −1, así que el hierro con +3 necesita tres OH⁻ para llegar a 0.', ecuacion: ['(+3) + 3 · (−1) = ', Cq('0'), '   →   Fe(OH)₃'] },
      ],
    },
    regla: {
      texto: 'Un óxido básico con agua forma un hidróxido, con un OH⁻ (carga −1) por unidad de EO. Un óxido ácido con agua forma un oxácido: se suman los átomos y se simplifica, sin cambiar el EO. Del EO menor al mayor, los oxácidos llevan hipo-⁠…-⁠oso, -⁠oso, -⁠ico y per-…-⁠ico: hipo es «por debajo» y per, «al máximo».',
      ecuacion: ['Cl₂O₇ + H₂O → H₂Cl₂O₈', SEP, 'H₂Cl₂O₈ → HClO₄', SEP, 'Fe³⁺ + 3 OH⁻ → Fe(OH)₃'],
      condicion: 'el no metal no es el P ni el B, que suman tres moléculas de agua a su óxido: H₃PO₄. Con una sola agua saldría HPO₃, que no es el ácido fosfórico del examen.',
      voz: 'El EO no cambia: solo se suman átomos.',
    },
    resuelve: {
      generar(s) {
        const [e, v] = RES4[((s % RES4.length) + RES4.length) % RES4.length], met = esMetal(e);
        if (met) {
          const f = hidroxido(e, v);
          return { enunciado: `Escribe la fórmula y el nombre Stock del hidróxido del ${NOMBRE_EL[e]} con EO ${sg(v)}.`, datos: [D4.oh, estadosTxt(e), D4.stock],
            pasos: [
              { tipo: 'pide', texto: 'Se piden la fórmula del hidróxido y su nombre Stock.' },
              { tipo: 'datos', texto: `El ${e} aporta ${sg(v)} y cada OH⁻ aporta −1.` },
              { tipo: 'regla', texto: 'Va un OH⁻ por cada unidad de EO, porque cada uno trae −1. Si se repite, va entre paréntesis, para que el subíndice multiplique al O y al H juntos.' },
              { tipo: 'cuentas', texto: `Para compensar ${sg(v)} hacen falta ${v} OH⁻, uno por cada unidad de EO.`, ecuacion: [`(${sg(v)}) + ${v} · (−1) = `, Cq('0'), `   →   ${bonita(f)}`] },
              { tipo: 'sentido', texto: `El ${NOMBRE_EL[e]} tiene dos EO, así que el nombre lleva el romano ${ROM[v]}: sin él, «hidróxido de ${NOMBRE_EL[e]}» podría ser cualquiera de los dos.` },
            ], respuesta: `${bonita(f)}, ${nombre(f, 'stock')}` };
        }
        const o = oxacido(e, v), nom = nombre(o.formula, 'tradicional');
        return { enunciado: `Escribe la fórmula y el nombre del oxácido del ${NOMBRE_EL[e]} con EO ${sg(v)}.`, datos: [D4.suma, ...datosNombreAcido(e), D2.o, D2.cero],
          pasos: [
            { tipo: 'pide', texto: 'Se piden la fórmula del oxácido y su nombre tradicional.' },
            { tipo: 'datos', texto: `Su óxido es el ${bonita(o.oxido)}, y se le suma una molécula de agua.` },
            { tipo: 'regla', texto: 'Se suman los átomos del óxido y del agua, y se simplifica si se puede. El EO del no metal no cambia, porque el H del agua sigue con +1 y el O, con −2.' },
            { tipo: 'cuentas', texto: bonita(sinSimpl(e, v)) === bonita(o.formula) ? 'El óxido con una molécula de agua da:' : 'El óxido con una molécula de agua da un compuesto con todos los números pares, así que se divide entre 2:', ecuacion: [`${bonita(o.oxido)} + H₂O → ${bonita(sinSimpl(e, v))}${bonita(sinSimpl(e, v)) === bonita(o.formula) ? '' : `   →   ${bonita(o.formula)}`}`] },
            { tipo: 'aplica', texto: `El ${sg(v)} es el ${estadosNM(e).length === 2 ? ['menor', 'mayor'][estadosNM(e).indexOf(v)] : ['primero', 'segundo', 'tercero', 'cuarto'][estadosNM(e).indexOf(v)]} de los EO ${listaY(estadosNM(e).map(sg))}, y a ese le toca ${(estadosNM(e).length === 2 ? ['-⁠oso', '-⁠ico'] : ['hipo-⁠…-⁠oso', '-⁠oso', '-⁠ico', 'per-…-⁠ico'])[estadosNM(e).indexOf(v)]}: ${nom}.` },
            { tipo: 'sentido', texto: `Para comprobar, la suma de los EO del ácido da 0, con el ${NOMBRE_EL[e]} en ${sg(v)}:`, ecuacion: compruebaEO(o.formula) },
          ], respuesta: `${bonita(o.formula)}, ${nom}` };
      },
    },
    ahoraTu: {
      voz: 'Primero el EO; después la fórmula o el nombre.',
      generar(s) {
        const r = azar(s + 53), t = ((s % 4) + 4) % 4;
        if (t === 0) return casoFormulaHidroxido(...r.de(AT4.hidroxidos));
        if (t === 1) return casoFormulaAcido(...r.de(AT4.acidos));
        if (t === 2) return casoNombreAcido(...r.de(AT4.acidos));
        return casoNombreHidroxido(...r.de(AT4.hidroxidos.filter(([e]) => estadosMetal(e).length > 1 || e === 'Ba')));
      },
    },
  };

  // ---------- Idea 5 (rehecha, 19 nov): sales haloideas y oxisales ----------
  // Propuesta §3 idea 5. Objeto de la primera pantalla: el salero y el saco de abono (quim-nomenclatura).
  // Cambia: el catión, el anión y cuántas fichas de cada uno · Permanece: la cuenta de cargas bajo las fichas · Progresa:
  // de la carga suelta a la sal neutra y simplificada · Se reserva: los aniones de ácidos -⁠oso (el nitrito de Predice) ·
  // Debe verse: carga 0 con fichas enteras, y el nombre que sale del ácido.
  // Errores: QM-ITO-ATO (ito por ato; trampa 42 de San Marcos), QM-URO (-⁠uro con un anión con oxígeno), QM-SIN-CAMBIO (el
  // adjetivo del ácido sin cambiar), QM-HIPO (hipo- de más), QM-POLI (el ion se rompe o pierde el paréntesis), NO1, NO2.
  // Los iones de la tabla vieja (CAT, AN) siguen siendo los de la mesa «La sal armada a mano»; el NO₃⁻ con el Na⁺ no va
  // en ningún texto (el validador lee «NaN» en NaNO₃).
  const CAT = { Na: ['Na⁺', 'Na', 1, 'sodio'], K: ['K⁺', 'K', 1, 'potasio'], Ca: ['Ca²⁺', 'Ca', 2, 'calcio'], Mg: ['Mg²⁺', 'Mg', 2, 'magnesio'], Al: ['Al³⁺', 'Al', 3, 'aluminio'], Fe: ['Fe³⁺', 'Fe', 3, 'hierro(III)'], NH4: ['NH₄⁺', 'NH₄', 1, 'amonio', true] };
  const AN = { Cl: ['Cl⁻', 'Cl', 1, 'cloruro'], Br: ['Br⁻', 'Br', 1, 'bromuro'], S: ['S²⁻', 'S', 2, 'sulfuro'], NO3: ['NO₃⁻', 'NO₃', 1, 'nitrato', true], SO4: ['SO₄²⁻', 'SO₄', 2, 'sulfato', true], CO3: ['CO₃²⁻', 'CO₃', 2, 'carbonato', true], PO4: ['PO₄³⁻', 'PO₄', 3, 'fosfato', true] };
  const mcd = (a, b) => (b ? mcd(b, a % b) : Math.abs(a));
  const formula = partes => partes.map(([s, k, poli]) => (poli && k > 1 ? `(${s})${sub(k)}` : `${s}${sub(k)}`)).join('');
  function sal(c, a) {
    const C = CAT[c], A = AN[a], m = C[2] * A[2] / mcd(C[2], A[2]), nc = m / C[2], na = m / A[2];
    const fo = formula([[C[1], nc, C[4]], [A[1], na, A[4]]]);
    return { fo, nombre: `${A[3]} de ${C[3]}`, nc, na };
  }
  const ent = (v, ...ids) => { const x = Object.assign({}, v); for (const k of ids) x[k] = Math.round(x[k]); return x; };
  const salFichas = (c, a, nc, na, o = {}) => fichas([{ t: CAT[c][0], carga: CAT[c][2], n: nc, color: 'o' }, { t: AN[a][0], carga: -AN[a][2], n: na, color: 'i' }],
    Object.assign({ alt: `${nc} ${CAT[c][0]} y ${na} ${AN[a][0]}: carga neta ${sg(nc * CAT[c][2] - na * AN[a][2])}.` }, o));
  const cargaSal = v => v.nc * CAT[v.c][2] - v.na * AN[v.a][2];
  // «un Na⁺», «2 Cl⁻»: la cantidad de iones con su concordancia («Un» al empezar la oración).
  const cuantos = (n, t, inicio = false) => { const w = ['', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis'][n] || String(n); return `${inicio ? w[0].toUpperCase() + w.slice(1) : w} ${t}`; };
  function lectura5(v) {
    const q = cargaSal(v), x = sal(v.c, v.a), C = CAT[v.c][0], A = AN[v.a][0];
    if (q !== 0) return [`${cuantos(v.nc, C, true)} y ${cuantos(v.na, A)} dejan carga `, Cq(sg(q)), '.'];
    if (v.nc !== x.nc) return ['La carga es ', Cq('0'), `, pero se simplifica a ${x.fo}.`];
    return [`${x.fo}, ${x.nombre}, tiene carga `, Cq('0'), '.'];
  }
  // La manija va en el lugar siguiente al último cuadrito de su fila, no encima (lector en frío, 19 nov: con una sola ficha
  // el círculo tapaba el único cuadrito y la leyenda «lleno / hueco» no se podía ver). Inversa: n = (x − 47)/17 ÷ carga.
  const filaFin = (q, n, signo) => PF().geometria({ fichas: [] }).cuadrito(q * n, signo);
  const arrastresSal = [
    { id: 'cation', etiqueta: 'final de las cargas del catión', color: 'c-o',
      donde: v => filaFin(CAT[v.c][2], v.nc, '+'), mover: (pt, v) => ({ nc: Math.round((pt.x - 47) / 17 / CAT[v.c][2]) }) },
    { id: 'anion', etiqueta: 'final de las cargas del anión', color: 'c-i',
      donde: v => filaFin(AN[v.a][2], v.na, '−'), mover: (pt, v) => ({ na: Math.round((pt.x - 47) / 17 / AN[v.a][2]) }) },
  ];
  const D5 = {
    aniones: 'Anión de un ácido: -⁠hídrico → -⁠uro; -⁠oso → -⁠ito; -⁠ico → -⁠ato (hipo- y per- se quedan)',
    nombre: 'Nombre de la sal: el anión + «de» + el catión (con su EO en romanos si tiene dos)',
    cero: 'La sal junta fichas enteras de catión y anión hasta carga 0, con los números más chicos',
    paren: 'Un ion de varios átomos va entre paréntesis si se repite',
  };
  const ionMotor = { 'Na⁺': 'Na^+', 'K⁺': 'K^+', 'Ca²⁺': 'Ca^2+', 'Mg²⁺': 'Mg^2+', 'Al³⁺': 'Al^3+', 'Fe³⁺': 'Fe^3+', 'Fe²⁺': 'Fe^2+', 'NH₄⁺': 'NH4^+', 'Ba²⁺': 'Ba^2+', 'Cu²⁺': 'Cu^2+', 'Zn²⁺': 'Zn^2+', 'Co²⁺': 'Co^2+' };
  // Ahora tú: sales que no salen en el juego, en Predice, en Mira ni en los ejemplos.
  const AT5 = { cationes: ['Mg^2+', 'Ba^2+', 'Zn^2+', 'Cu^2+', 'Fe^2+', 'NH4^+'], aniones: ['BrO3^-', 'SO3^2-', 'IO^-', 'ClO4^-', 'I^-', 'PO4^3-', 'SeO4^2-'],
    acidos: [['Br', 5], ['S', 4], ['I', 1], ['Cl', 7], ['Se', 6], ['I', 7]] };
  const RES5 = [['Zn^2+', 'PO4^3-'], ['Mg^2+', 'ClO4^-'], ['NH4^+', 'SO3^2-'], ['Ba^2+', 'BrO3^-'], ['Cu^2+', 'I^-']];
  const salDe = (c, a) => M.formulaDeIones(c, a).formula;
  const ionTxt = i => bonita(i);
  function casoAnion(e, v) {
    const ac = oxacido(e, v).formula, nomAc = nombre(ac, 'tradicional'), h = M.atomos(ac).H, anion = `${ac.replace(/^H\d*/, '')}^${h > 1 ? h : ''}-`;
    const bien = M.nombreIon(anion), er = M.nombrar(M.formulaDeIones('K^+', anion).formula).errores, quita = t => (t ? t.replace(' de potasio', '') : null);
    return { pregunta: `El ${nomAc}, ${bonita(ac)}, suelta sus H⁺ y deja un anión. ¿Cómo se llama ese anión?`, datos: [D5.aniones],
      opciones: opsTexto(bien, [
        [quita(er.terminacionAlReves), 'QM-ITO-ATO', nomAc.endsWith('oso') ? 'Sería así si el ácido terminara en -⁠ico. Este termina en -⁠oso, que pasa a -⁠ito: el ácido con menos oxígeno da el anión -⁠ito, y el que tiene más, el -⁠ato.' : 'Sería así si el ácido terminara en -⁠oso. Este termina en -⁠ico, que pasa a -⁠ato: el ácido con más oxígeno da el anión -⁠ato, y el que tiene menos, el -⁠ito.'],
        [quita(er.terminacionUro), 'QM-URO', 'Sería así si el anión no tuviera oxígeno. La terminación -⁠uro es de los aniones que vienen de un hidrácido, como el cloruro del HCl, y este anión tiene oxígeno.'],
        [quita(er.sinCambiar), 'QM-SIN-CAMBIO', 'Sería así si el anión se llamara igual que su ácido. Al soltar los H⁺, la terminación cambia, y así se sabe que se habla del anión y no del ácido.'],
        [quita(er.hipoEnVezDeOso), 'QM-HIPO', 'Sería así si el ácido llevara hipo-. El prefijo pasa tal cual del ácido al anión, y aquí el ácido no lo lleva.'],
      ]),
      solucion: { texto: `El ${nomAc} termina en ${nomAc.endsWith('oso') ? '-⁠oso, que pasa a -⁠ito' : '-⁠ico, que pasa a -⁠ato'}. La raíz y el prefijo, si lo hay, quedan iguales.`, ecuacion: [`${bonita(ac)} → ${bonita(anion)}, ${bien}`] } };
  }
  function casoFormulaSal(c, a) {
    const f = salDe(c, a), n = M.nombrar(f), d = M.formulaDeIones(c, a), C = M.ion(c), A = M.ion(a);
    // QM-POLI: sin paréntesis, el subíndice del anión multiplica solo a su último átomo (verificación, 26 nov: antes se
    // pegaba detrás del suyo y salía «ZnClO₂₂», que se lee «42»).
    const soloUltimo = (cu, k) => cu.replace(/([A-Z][a-z]?)(\d*)$/, (x, e, q) => `${e}${(+q || 1) * k}`);
    const romp = A.poli && d.nAnion > 1 ? bonita(`${C.cuerpo}${d.nCation > 1 ? d.nCation : ''}${soloUltimo(A.cuerpo, d.nAnion)}`) : null;
    const uno = bonita(`${C.poli ? `(${C.cuerpo})` : C.cuerpo}${A.poli ? `(${A.cuerpo})` : A.cuerpo}`).replace(/\(([^()]+)\)(?![₀-₉])/g, '$1');
    const inv = d.nCation !== d.nAnion ? bonita(`${C.poli && d.nAnion > 1 ? `(${C.cuerpo})` : C.cuerpo}${d.nAnion > 1 ? d.nAnion : ''}${A.poli && d.nCation > 1 ? `(${A.cuerpo})` : A.cuerpo}${d.nCation > 1 ? d.nCation : ''}`) : null;
    return { pregunta: `¿Cuál es la fórmula del ${n.stock}?`, datos: [D5.cero, D5.paren, `Iones: ${ionTxt(c)} y ${ionTxt(a)}`],
      opciones: opsTexto(bonita(f), [
        [romp, 'QM-POLI', `La cantidad de cada ion está bien, pero sin paréntesis el ${d.nAnion} multiplica solo al último átomo del anión, y el resto del ion queda una sola vez.`],
        [uno !== bonita(f) ? uno : null, 'NO2', `Sería así si las dos cargas fueran del mismo tamaño. Un ion de cada uno deja carga ${sg(C.carga + A.carga)} y no 0, así que hay que juntar más del ion de carga menor.`],
        [inv, 'NO1', `Esa proporción está al revés: la carga queda en ${sg(d.nAnion * C.carga + d.nCation * A.carga)}. El ion de carga mayor es el que va menos veces.`],
        [bonita(`${C.poli ? `(${C.cuerpo})` : C.cuerpo}${d.nCation * 2}${A.poli ? `(${A.cuerpo})` : A.cuerpo}${d.nAnion * 2}`), 'QM-SIMPLIFICA', 'Sería así si no se simplificara. Esa fórmula es neutra, pero la de una sal usa la proporción más chica de iones, y aquí los dos números se dividen entre 2.'],
      ]),
      solucion: { texto: `${cuantos(d.nCation, ionTxt(c), true)} y ${cuantos(d.nAnion, ionTxt(a))} dejan carga 0.`, ecuacion: [`${d.nCation} · (${sg(C.carga)}) + ${d.nAnion} · (${sg(A.carga)}) = `, Cq('0'), `   →   ${bonita(f)}`] } };
  }
  function casoNombreSal(c, a) {
    const f = salDe(c, a), n = M.nombrar(f), er = n.errores;
    return { pregunta: `¿Cuál es el nombre Stock del ${bonita(f)}?`, datos: [D5.aniones, D5.nombre, `Iones: ${ionTxt(c)} y ${ionTxt(a)}`, `El ${ionTxt(a)} sale del ${nombre(acidoDe(a), 'tradicional')}`],
      opciones: opsTexto(n.stock, [
        [er.terminacionAlReves, 'QM-ITO-ATO', 'La raíz del anión está bien, pero la terminación va al revés: el ácido -⁠oso, con menos oxígeno, da -⁠ito, y el ácido -⁠ico, con más, da -⁠ato.'],
        [er.terminacionUro, 'QM-URO', 'Sería así si el anión no tuviera oxígeno. La terminación -⁠uro es de los aniones que vienen de un hidrácido, y este anión tiene oxígeno.'],
        [er.conOxigeno, 'QM-URO', 'Ese nombre es de un anión con oxígeno. El de esta sal no tiene oxígeno, viene de un hidrácido, y por eso termina en -⁠uro.'],
        [er.sinCambiar, 'QM-SIN-CAMBIO', 'Sería así si el anión se llamara igual que su ácido. En la sal, el anión cambia la terminación, y así se distingue del ácido.'],
        [er.hipoEnVezDeOso, 'QM-HIPO', 'Sería así si el ácido llevara hipo-. El prefijo pasa tal cual del ácido al anión, y aquí el ácido no lo lleva.'],
        [n.tradicional !== n.stock ? n.tradicional : null, 'QM-SISTEMA', 'Ese es el nombre tradicional, que dice el EO del metal con -⁠oso o -⁠ico. Nombra la misma sal, pero la Stock lo dice con un romano.'],
      ]),
      solucion: { texto: `El anión ${ionTxt(a)} es ${M.nombreIon(a)} y el catión es ${M.nombreIon(c)}. El nombre dice primero el anión y después, con «de», el catión.`, ecuacion: [bonita(f), ': ', ...conRomano(n.stock)] } };
  }
  // El ácido del que sale un anión (para los Datos): el anión con sus H.
  function acidoDe(a) { const A = M.ion(a), h = -A.carga; return `H${h > 1 ? h : ''}${A.cuerpo}${A.poli ? '' : '(ac)'}`; }

  // Ejemplos de la idea 5. Fórmulas del motor y nombres comprobados con OPSIN (nombres.js): NaCl · CO₃²⁻ carbonato · CaCl₂
  // · K₂SO₄ oxisal · KBr · FeCl₃ cloruro de hierro(III), férrico · Ca₃(PO₄)₂ · NaClO hipoclorito · NH₄NO₃ · Al₂(SO₄)₃ 17
  // átomos · CuSO₄, Ca(NO₃)₂, Na₂CO₃ · Fe(NO₃)₂ nitrato ferroso · ClO₂⁻ clorito · FVV · KClO₂ clorito de potasio.
  const EJEMPLOS_SALES = [
    { nivel: 1, titulo: 'La sal de cocina', enunciado: '¿Cómo se llama el NaCl, la sal de cocina?', datos: [D5.aniones, D5.nombre, 'Viene del ácido clorhídrico, HCl'],
      solucion: [{ texto: 'La terminación -⁠hídrico pasa a -⁠uro, así que el anión Cl⁻ es cloruro, y el catión es el sodio.' }], respuesta: [nombre('NaCl', 'stock')] },
    { nivel: 1, titulo: 'El anión de la tiza', enunciado: 'El ácido carbónico, H₂CO₃, suelta sus dos H⁺. ¿Qué anión queda y cómo se llama?', datos: [D5.aniones],
      solucion: [{ texto: 'Se van dos H⁺, así que el anión queda con carga −2. La terminación -⁠ico pasa a -⁠ato.', ecuacion: ['H₂CO₃ → 2 H⁺ + CO₃²⁻'] }], respuesta: ['CO₃²⁻, ', M.nombreIon('CO3^2-')] },
    { nivel: 1, titulo: 'Calcio con cloro', enunciado: '¿Cuál es la fórmula del cloruro de calcio?', datos: [D5.cero, 'Iones: Ca²⁺ y Cl⁻'],
      solucion: [{ texto: 'Un Ca²⁺ necesita dos Cl⁻.', ecuacion: ['(+2) + 2 · (−1) = ', Cq('0'), '   →   CaCl₂'] }], respuesta: ['CaCl₂'] },
    { nivel: 1, titulo: 'Con o sin oxígeno', enunciado: 'El K₂SO₄ se usa como abono. ¿Es una sal haloidea o una oxisal?', datos: ['Sal haloidea: su anión no tiene oxígeno. Oxisal: su anión tiene oxígeno'],
      solucion: [{ texto: 'Su anión es el SO₄²⁻, sulfato, que lleva oxígeno.' }], respuesta: ['Oxisal'] },
    { nivel: 1, titulo: 'Potasio con bromo', enunciado: '¿Cómo se llama el KBr?', datos: [D5.aniones, D5.nombre, 'Viene del ácido bromhídrico, HBr'],
      solucion: [{ texto: 'La terminación -⁠hídrico pasa a -⁠uro, así que el anión es bromuro, y el catión es el potasio.' }], respuesta: [nombre('KBr', 'stock')] },
    { nivel: 2, titulo: 'Un cloruro de hierro', enunciado: 'Escribe el nombre Stock y el tradicional del FeCl₃.', datos: [estadosTxt('Fe'), 'EO del Cl en un cloruro: −1', D5.nombre, D2.trad, `Raíces: ${RAIZ_TRAD.Fe}`],
      solucion: [{ texto: 'Tres Cl⁻ aportan −3, así que el hierro tiene +3, el mayor de sus dos EO.' }, { texto: 'Por eso el nombre Stock lleva (III) y el tradicional lleva -⁠ico.' }],
      respuesta: [...conRomano(nombre('FeCl3', 'stock')), ' y ', nombre('FeCl3', 'tradicional')] },
    { nivel: 2, titulo: 'El fosfato de los huesos', enunciado: 'Los huesos tienen fosfato de calcio. ¿Cuál es su fórmula?', datos: [D5.cero, D5.paren, 'Iones: Ca²⁺ y PO₄³⁻'],
      figura: salFichas('Ca', 'PO4', 1, 1, { cuenta: false }),
      solucion: [{ texto: 'Las cargas +2 y −3 se igualan en 6: tres Ca²⁺ y dos PO₄³⁻.', ecuacion: ['3 · (+2) + 2 · (−3) = ', Cq('0')] }, { texto: 'Como el fosfato se repite, va entre paréntesis.', ecuacion: ['Ca₃(PO₄)₂'] }],
      respuesta: ['Ca₃(PO₄)₂'] },
    { nivel: 2, titulo: 'La sal de la lejía', enunciado: 'La lejía tiene NaClO. El HClO es el ácido hipocloroso. ¿Cómo se llama la sal?', datos: [D5.aniones, D5.nombre],
      solucion: [{ texto: 'La terminación -⁠oso pasa a -⁠ito y el hipo- se queda, así que el anión es hipoclorito.' }], respuesta: [nombre('NaClO', 'stock')] },
    { nivel: 2, titulo: 'El abono del saco', enunciado: '¿Cuál es la fórmula del nitrato de amonio, el abono del saco?', datos: [D5.cero, 'Iones: NH₄⁺ y NO₃⁻'],
      solucion: [{ texto: 'Las dos cargas son de tamaño 1, así que va uno de cada uno. Como ninguno se repite, no hacen falta paréntesis.', ecuacion: ['(+1) + (−1) = ', Cq('0'), '   →   NH₄NO₃'] }], respuesta: ['NH₄NO₃'] },
    { nivel: 2, titulo: 'Contar los átomos', enunciado: '¿Cuántos átomos en total tiene una unidad de Al₂(SO₄)₃?', datos: ['El subíndice de afuera multiplica todo lo que está dentro del paréntesis'],
      solucion: [{ texto: 'Hay 2 Al, 3 · 1 = 3 S y 3 · 4 = 12 O.', ecuacion: ['2 + 3 + 12 = 17'] }], respuesta: ['17 átomos'] },
    { nivel: 3, titulo: 'Tres fórmulas a la vez', enunciado: '¿Cuáles son las fórmulas del sulfato de cobre(II), el nitrato de calcio y el carbonato de sodio?',
      alternativas: ['CuSO₄, CaNO₃, NaCO₃', 'Cu₂SO₄, Ca(NO₃)₂, Na₂CO₃', 'CuSO₄, Ca(NO₃)₂, NaCO₃', 'CuSO₃, Ca(NO₃)₂, Na₂CO₃', 'CuSO₄, Ca(NO₃)₂, Na₂CO₃'],
      datos: [D5.cero, D5.paren, 'Iones: Cu²⁺, Ca²⁺, Na⁺, SO₄²⁻, NO₃⁻ y CO₃²⁻'],
      solucion: [{ texto: 'El cobre(II) y el sulfato van uno a uno. El calcio lleva dos nitratos, entre paréntesis, y el carbonato necesita dos sodios.' },
        { texto: ['La ', letra('A'), ' toma uno de cada en las tres; la ', letra('B'), ' pone dos Cu²⁺; la ', letra('C'), ' olvida el segundo Na⁺; la ', letra('D'), ' usa el sulfito.'] }],
      respuesta: [letra('E'), ', CuSO₄, Ca(NO₃)₂, Na₂CO₃'] },
    { nivel: 3, titulo: 'El nitrato del hierro menor', enunciado: 'El hierro tiene EO +2 y +3. ¿Cuál es el nombre tradicional del Fe(NO₃)₂?',
      alternativas: [nombre('Fe(NO3)2', 'tradicional'), 'nitrato férrico', 'nitrito ferroso', 'nitruro ferroso', nombre('Fe(NO3)2', 'stock')],
      datos: [D5.aniones, D2.trad, `Raíces: ${RAIZ_TRAD.Fe}`, 'Iones: NO₃⁻, del ácido nítrico'],
      solucion: [{ texto: 'Dos NO₃⁻ aportan −2, así que el hierro tiene +2, el menor, y es ferroso. El anión del ácido nítrico es el nitrato.' },
        { texto: ['La ', letra('B'), ' usa el EO mayor; la ', letra('C'), ' cambia -⁠ico a -⁠ito; la ', letra('D'), ' usa -⁠uro con un anión con oxígeno; la ', letra('E'), ' es el nombre Stock.'] }],
      respuesta: [letra('A'), `, ${nombre('Fe(NO3)2', 'tradicional')}`] },
    { nivel: 3, titulo: 'Los aniones del cloro', enunciado: 'El cloro forma los aniones hipoclorito, clorito, clorato y perclorato. ¿Cuál es el clorito?',
      alternativas: ['ClO⁻', 'ClO₃⁻', 'ClO₄⁻', 'ClO₂⁻', 'Cl⁻'], datos: [D5.aniones, D4.nombres4, 'Oxácidos del cloro: HClO, HClO₂, HClO₃ y HClO₄'],
      solucion: [{ texto: 'El clorito viene de un ácido -⁠oso sin prefijo, el ácido cloroso, HClO₂ (+3). Sin su H queda el ClO₂⁻.' },
        { texto: ['La ', letra('A'), ' es el hipoclorito; la ', letra('B'), ', el clorato; la ', letra('C'), ', el perclorato; la ', letra('E'), ', el cloruro.'] }],
      respuesta: [letra('D'), ', ClO₂⁻'] },
    { nivel: 3, titulo: 'Verdadero o falso', enunciado: 'Indica verdadero (V) o falso (F). I. El NaCl es una oxisal. II. El KNO₃ se llama nitrato de potasio. III. En el CaCO₃ hay un ion poliatómico.',
      alternativas: ['VVV', 'FVV', 'FFV', 'VVF', 'FVF'], datos: ['Sal haloidea: su anión no tiene oxígeno. Oxisal: su anión tiene oxígeno', D5.aniones, 'Ion poliatómico: un ion de varios átomos', 'HNO₃: ácido nítrico'],
      solucion: [{ texto: 'La I es falsa: el cloruro no tiene oxígeno, así que el NaCl es una sal haloidea.' },
        { texto: 'La II es verdadera, porque nítrico pasa a nitrato. La III es verdadera: el CO₃²⁻ tiene cuatro átomos.', ecuacion: ['FVV'] },
        { texto: ['La ', letra('A'), ' y la ', letra('D'), ' llaman oxisal al NaCl; la ', letra('C'), ' niega la II; la ', letra('D'), ' y la ', letra('E'), ' niegan la III.'] }],
      respuesta: [letra('B'), ', FVV'] },
    { nivel: 3, titulo: 'Una sal del ácido cloroso', enunciado: 'El HClO₂ es el ácido cloroso. ¿Cómo se llama la sal KClO₂?',
      alternativas: ['hipoclorito de potasio', 'clorato de potasio', 'clorito de potasio', 'cloruro de potasio', 'perclorato de potasio'], datos: [D5.aniones, D5.nombre],
      solucion: [{ texto: 'La terminación -⁠oso pasa a -⁠ito, así que el anión es clorito. No lleva prefijo, porque el ácido no lo tiene.' },
        { texto: ['La ', letra('A'), ' le agrega hipo-; la ', letra('B'), ' cambia -⁠oso a -⁠ato; la ', letra('D'), ' usa -⁠uro, que es de los aniones sin oxígeno; la ', letra('E'), ' es el de +7.'] }],
      respuesta: [letra('C'), ', clorito de potasio'] },
  ];

  const sales = {
    id: 'sales',
    titulo: 'Sales haloideas y oxisales',
    pregunta: '¿Cómo se arma y se nombra una sal?',
    temas: ['Sales oxisales y haloideas'],
    pieza: 'quim-fichas',
    aprendizaje: 'La sal junta catión y anión de un ácido hasta carga cero; el anión pasa de -⁠hídrico a -⁠uro, -⁠oso a -⁠ito, -⁠ico a -⁠ato.',
    actividad: 'Juntar fichas enteras de un catión y un anión hasta que la carga quede en cero.',
    lee: {
      tarjetas: [
        { titulo: 'El salero y el saco', texto: 'La sal de cocina es NaCl, cloruro de sodio. El abono del saco es NH₄NO₃, nitrato de amonio. Las dos son sales: un catión junto al anión que deja un ácido, como si el ácido hubiera cambiado sus H⁺ por otro ion positivo.',
          pieza: 'quim-nomenclatura', dibujo: OBJ('salero', { etiqueta: 'NH₄NO₃', nombre: 'Un salero y un saco de abono' }) },
        { titulo: 'El anión del ácido', texto: 'Un ácido suelta sus H⁺ y deja un anión, con tantas cargas negativas como H soltó: el HCl deja Cl⁻, cloruro; el H₂SO₄, ácido sulfúrico, deja SO₄²⁻, sulfato.' },
        { titulo: 'Los cationes', texto: 'El catión suele ser un metal: Na⁺, Ca²⁺, Al³⁺ o Fe³⁺. Si el metal tiene dos EO, su nombre lleva el romano, que dice cuál de sus dos iones es: hierro(III). El NH₄⁺ se llama amonio.' },
        { titulo: 'Qué mirar', texto: 'Agrega fichas enteras hasta que cada carga positiva tenga una negativa. Un ion de varios átomos no se parte: si se repite, va entre paréntesis.' },
      ],
    },
    ejemplos: EJEMPLOS_SALES,
    juega: {
      consigna: 'La sal junta cationes y aniones enteros. Agrega fichas de cada uno hasta que no quede carga suelta.',
      mision: { texto: 'Arma la sal del aluminio con el sulfato sin carga suelta.', logrado: v => v.c === 'Al' && v.a === 'SO4' && cargaSal(v) === 0 && v.nc === sal('Al', 'SO4').nc,
        bien: 'Dos Al³⁺ y tres SO₄²⁻ dan +6 y −6: es Al₂(SO₄)₃, sulfato de aluminio.' },
      voz: 'Las fichas no se parten: se agregan enteras.',
      leyenda: [
        { s: Ca_('catión'), t: 'el ion positivo, casi siempre un metal' },
        { s: An('anión'), t: 'el ion que deja un ácido' },
        { s: 'cuadritos', t: 'lleno: +1; hueco: −1' },
        { s: Cq('carga'), t: 'lo que queda sin pareja' },
      ],
      controles: [
        { id: 'c', etiqueta: 'Catión', opciones: ['Na', 'Ca', 'Al'].map(k => ({ valor: k, texto: CAT[k][0] })) },
        { id: 'a', etiqueta: 'Anión', opciones: ['Cl', 'S', 'CO3', 'SO4', 'PO4'].map(k => ({ valor: k, texto: AN[k][0] })) },
        { id: 'nc', etiqueta: 'fichas de catión', color: 'c-o', min: 1, max: 4, paso: 1, inicio: 1, decimales: 0 },
        { id: 'na', etiqueta: 'fichas de anión', color: 'c-i', min: 1, max: 4, paso: 1, inicio: 1, decimales: 0 },
      ],
      dibujo: v => salFichas(v.c, v.a, v.nc, v.na),
      lectura: v => lectura5(v),
      minimo: 4,
      arrastres: arrastresSal,
    },
    predice: {
      pieza: 'quim-nomenclatura',
      pregunta: 'Del ácido nitroso, HNO₂, sale el anión NO₂⁻. ¿Cómo se llama la sal KNO₂?',
      datos: ['Ácido nitroso: HNO₂', 'Catión: K⁺, potasio'],
      voz: 'Recuerda cómo el ácido sulfúrico dio el sulfato.',
      opciones: [
        { id: 'c', texto: 'Nitrito de potasio', correcta: true },
        { id: 'ato', texto: 'Nitrato de potasio', error: 'QM-ITO-ATO', siFuera: 'Sería así si la sal viniera del ácido nítrico, HNO₃, que termina en -⁠ico y da nitrato. El ácido nitroso tiene un O menos, y su -⁠oso pasa a -⁠ito.' },
        { id: 'uro', texto: 'Nitruro de potasio', error: 'QM-URO', siFuera: 'Sería así si el anión no tuviera oxígeno: -⁠uro sale de un ácido sin oxígeno, como el cloruro del HCl. El NO₂⁻ tiene dos O.' },
        { id: 'oso', texto: 'Nitroso de potasio', error: 'QM-SIN-CAMBIO', siFuera: 'Sería así si el anión se llamara igual que su ácido. Al soltar los H⁺, el ácido se vuelve un anión, y el anión cambia la terminación para que se note.' },
      ],
      dibujo: NOMS({ formula: [Ca_('K'), An('NO₂')], filas: [{ sistema: 'Sale del ácido', nombre: 'ácido nitroso, HNO₂' }, { sistema: 'Nombre de la sal', oculto: true }] }),
      revelar: NOMS({ formula: [Ca_('K'), An('NO₂')], filas: [{ sistema: 'Sale del ácido', nombre: 'ácido nitroso, HNO₂' }, { sistema: 'Nombre de la sal', nombre: nombre('KNO2', 'stock') }] }),
      coincide: 'Coincide: -⁠oso pasa a -⁠ito, así que nitroso da nitrito.',
      noCoincide: 'Del ácido -⁠oso sale el anión -⁠ito, así que el NO₂⁻ es el nitrito y la sal, nitrito de potasio.',
    },
    mira: {
      datos: { serif: true, fichas: [{ t: 'Fe³⁺', carga: 3, n: 2, color: 'o', desde: 1 }, { t: 'SO₄²⁻', carga: -2, n: 3, color: 'i', desde: 1 }],
        alt: 'Fichas: dos Fe³⁺ y tres SO₄²⁻; carga neta 0.' },
      voz: 'Juntemos un metal de dos EO con un anión del ácido sulfúrico.',
      pasos: [
        { estado: { corte: 1 }, texto: 'El Fe³⁺ trae +3 y el SO₄²⁻, −2. El número más chico que se arma con treses y con doses es 6: dos Fe³⁺ dan +6 y tres SO₄²⁻, −6.', ecuacion: ['2 · (+3) + 3 · (−2) = ', Cq('0')] },
        { estado: { corte: 1 }, texto: 'El sulfato se repite tres veces, así que va entre paréntesis: el 3 multiplica al S y a los cuatro O juntos.', ecuacion: ['Fe₂(SO₄)₃'] },
        { estado: { corte: 1 }, texto: 'El nombre se lee al revés que la fórmula: primero el anión, sulfato, y después «de» y el catión, con el romano III porque el hierro tiene dos EO.', ecuacion: conRomano(nombre('Fe2(SO4)3', 'stock')) },
        { estado: { corte: 1 }, texto: 'En la tradicional, el romano se cambia por una terminación: +3 es el EO mayor del hierro, así que el catión se dice «férrico».', ecuacion: [nombre('Fe2(SO4)3', 'tradicional')] },
      ],
    },
    regla: {
      texto: 'Una sal es un ácido con sus H⁺ cambiados por un catión. El anión cambia la terminación del ácido: -⁠hídrico pasa a -⁠uro, -⁠oso a -⁠ito e -⁠ico a -⁠ato, y hipo- y per- se quedan. Los iones se juntan enteros hasta carga 0, y el nombre dice primero el anión: sulfato de hierro(III).',
      ecuacion: ['H₂SO₄ → SO₄²⁻ (sulfato)', SEP, '2 · (+3) + 3 · (−2) = ', Cq('0'), SEP, 'Fe₂(SO₄)₃'],
      condicion: 'cada ion va entero y el de varios átomos, si se repite, va entre paréntesis; sin ellos, el subíndice tocaría solo a su último átomo. La sal es haloidea si su anión no tiene oxígeno, y oxisal si lo tiene.',
      voz: 'Primero los iones y sus cargas; después la proporción.',
    },
    resuelve: {
      pieza: 'quim-fichas',
      generar(s) {
        const [c, a] = RES5[((s % RES5.length) + RES5.length) % RES5.length], f = salDe(c, a), d = M.formulaDeIones(c, a), C = M.ion(c), A = M.ion(a), n = M.nombrar(f);
        return { enunciado: `Escribe la fórmula y el nombre de la sal de ${ionTxt(c)} con ${ionTxt(a)}.`, datos: [D5.cero, D5.paren, D5.aniones, D5.nombre, `${ionTxt(a)} sale del ${nombre(acidoDe(a), 'tradicional')}`],
          dibujo: fichas([{ t: ionTxt(c), carga: C.carga, n: 1, color: 'o' }, { t: ionTxt(a), carga: A.carga, n: 1, color: 'i' }], { alt: `Fichas: un ${ionTxt(c)} y un ${ionTxt(a)}.` }),
          pasos: [
            { tipo: 'pide', texto: 'Se piden la fórmula de la sal y su nombre.' },
            { tipo: 'datos', texto: `El ${ionTxt(c)} tiene carga ${sg(C.carga)} y el ${ionTxt(a)}, ${sg(A.carga)}.` },
            { tipo: 'regla', texto: 'Se juntan iones enteros hasta carga 0, porque un ion no se parte, y el anión toma el nombre de su ácido con la terminación cambiada.' },
            { tipo: 'cuentas', texto: `Hacen falta ${cuantos(d.nCation, ionTxt(c))} y ${cuantos(d.nAnion, ionTxt(a))}: así lo positivo suma ${sg(d.nCation * C.carga)} y lo negativo, ${sg(-d.nCation * C.carga)}, y se anulan.`, ecuacion: [`${d.nCation} · (${sg(C.carga)}) + ${d.nAnion} · (${sg(A.carga)}) = `, Cq('0'), `   →   ${bonita(f)}`] },
            { tipo: 'aplica', texto: `El anión es ${M.nombreIon(a)}, y el nombre de la sal dice primero el anión y después, con «de», el catión: ${n.stock}.` },
            { tipo: 'sentido', texto: `Ningún ion se partió y la proporción es la más chica que deja carga 0${A.poli && d.nAnion > 1 ? '; el anión repetido va entre paréntesis' : ''}.` },
          ], respuesta: `${bonita(f)}, ${n.stock}` };
      },
    },
    ahoraTu: {
      pieza: 'quim-fichas',
      voz: 'Iones enteros hasta carga cero.',
      generar(s) {
        const r = azar(s + 71), t = ((s % 3) + 3) % 3;
        if (t === 0) return casoAnion(...r.de(AT5.acidos));
        const c = r.de(AT5.cationes), a = r.de(AT5.aniones);
        return t === 1 ? casoFormulaSal(c, a) : casoNombreSal(c, a);
      },
    },
  };

  // ---------- Idea 6 (rehecha, 19 nov): sales ácidas, básicas e hidratadas ----------
  // Propuesta §3 idea 6. Objeto de la primera pantalla: la caja de bicarbonato (quim-nomenclatura).
  // Cambia: la sal · Permanece: la cuenta de cargas · Progresa: H que se queda en el anión, OH⁻ de más · Se reserva: el
  // agua de cristalización (el yeso de Predice) · Debe verse: qué ficha distinta aparece en cada sal.
  // Errores: QM-HIDRATO (el ·nH₂O tomado por OH o por H ácido), QM-CLASE-SAL (la clase equivocada), QM-POLI, QM-ITO-ATO,
  // QM-HIDRATO-CUENTA (los átomos del hidrato sin multiplicar el agua).
  const clase6 = f => ({ 'sal ácida': 'ácida', 'sal básica': 'básica', 'sal hidratada': 'hidratada' }[M.nombrar(f).funcion] || 'neutra');
  const ESP6 = {
    NaHCO3: { f: 'NaHCO3', fichas: [['Na⁺', 1, 'o'], ['HCO₃⁻', -1, 'i']], lee: 'su anión, HCO₃⁻, conserva un H' },
    KHSO4: { f: 'KHSO4', fichas: [['K⁺', 1, 'o'], ['HSO₄⁻', -1, 'i']], lee: 'su anión, HSO₄⁻, conserva un H' },
    MgOHCl: { f: 'Mg(OH)Cl', fichas: [['Mg²⁺', 2, 'o'], ['OH⁻', -1], ['Cl⁻', -1, 'i']], lee: 'lleva un OH⁻ además del Cl⁻' },
    Na2CO3: { f: 'Na2CO3', fichas: [['Na⁺', 1, 'o', 2], ['CO₃²⁻', -2, 'i']], lee: 'solo tiene catión y anión' },
    CaCO3: { f: 'CaCO3', fichas: [['Ca²⁺', 2, 'o'], ['CO₃²⁻', -2, 'i']], lee: 'solo tiene catión y anión' },
  };
  const fichas6 = (k, o = {}) => fichas(ESP6[k].fichas.map(([t, carga, color, n]) => ({ t, carga, n: n || 1, color })), Object.assign({ alt: `Fichas del ${bonita(ESP6[k].f)}: ${conY(ESP6[k].fichas.map(([t, , , n]) => cuantos(n || 1, t)))}.` }, o));
  const lectura6 = k => [`${bonita(ESP6[k].f)}, sal ${clase6(ESP6[k].f)}: ${ESP6[k].lee}.`];
  const D6 = {
    clases: 'Sal ácida: su anión conserva H. Sal básica: lleva OH⁻ además del anión. Sal hidratada: agua tras un punto (·nH₂O)',
    neutra: 'Sal neutra: una clase de catión y una de anión, sin H en el anión, sin OH⁻ ni agua',
    hidrogeno: 'Anión con H: «hidrogeno» + el anión (dihidrogeno si guarda dos); en la cocina, «bi-» si el ácido tenía dos H',
    agua: 'El ·nH₂O son n moléculas de agua enteras, sin carga, por cada unidad de la sal',
    multiplica: 'El número delante del H₂O multiplica sus dos H y su O',
  };
  // Ahora tú: sales que no salen en el juego, en Predice, en Mira ni en los ejemplos.
  const AT6 = { clase: ['KHCO3', 'Ba(OH)Cl', 'FeSO4·7H2O', 'K2SO4', 'CaHPO4', 'BaCl2·2H2O', 'Na2SO4·10H2O', 'KHSO3', 'CoCl2·6H2O'],
    hidratos: ['FeSO4·7H2O', 'BaCl2·2H2O', 'CoCl2·6H2O', 'Na2SO4·10H2O'] };
  // Así se resuelve (cierre, 19 nov): sales ácidas con el ácido de su anión en Datos y un hidrato de un metal de un solo EO
  // con su prefijo; sin la sal básica, que la unidad solo reconoce (Lee 3), y sin las sales de «Ahora tú».
  const RES6 = ['NaHSeO4', 'Ca(HSO4)2', 'LiHSO3', 'ZnSO4·7H2O'];
  const DATO_RES6 = { NaHSeO4: 'El HSeO₄⁻ sale del ácido selénico, H₂SeO₄', 'Ca(HSO4)2': 'El HSO₄⁻ sale del ácido sulfúrico, H₂SO₄',
    LiHSO3: 'El HSO₃⁻ sale del ácido sulfuroso, H₂SO₃', 'ZnSO4·7H2O': 'Hidrato: nombre de la sal + prefijo de las aguas + «hidratado» (hepta 7)' };
  const POR_CLASE = { ácida: 'Su anión conserva un H del ácido, que todavía puede soltar como H⁺', básica: 'Lleva OH⁻ además del anión, como una base', hidratada: 'Tiene moléculas de agua tras el punto, enteras y sin carga', neutra: 'Solo tiene catión y anión, sin H ni OH⁻ de más' };
  const porClase = cl => `${POR_CLASE[cl]}, así que es una sal ${cl}.`;
  const SI_CLASE = { ácida: 'Sería ácida si su anión conservara un H, como el HCO₃⁻, que todavía puede soltar como H⁺.', básica: 'Sería básica si llevara OH⁻ además del anión, como una base.',
    hidratada: 'Sería hidratada si tuviera agua tras el punto (·nH₂O).', neutra: 'Sería neutra si solo tuviera catión y anión.' };
  const EN_CAMBIO = { ácida: 'Aquí el anión conserva un H del ácido.', básica: 'Aquí lo que sobra es un OH⁻, que no es parte del anión.', hidratada: 'Aquí lo que sobra son moléculas de agua, sin carga.', neutra: 'Aquí no sobra nada: solo hay catión y anión.' };
  function casoClase6(f) {
    const cl = clase6(f);
    return { pregunta: `¿Qué clase de sal es el ${bonita(f)}?`, datos: [D6.clases, D6.neutra],
      opciones: ['ácida', 'básica', 'hidratada', 'neutra'].map(k => (k === cl ? { id: 'c', texto: `Sal ${k}`, correcta: true } : { id: k, texto: `Sal ${k}`, error: 'QM-CLASE-SAL', siFuera: `${SI_CLASE[k]} ${EN_CAMBIO[cl]}` })),
      solucion: { texto: porClase(cl), ecuacion: [`${bonita(f)}: sal ${cl}`] } };
  }
  // [ácido, anión con un H menos, anión sin H, el nombre con la terminación al revés]
  const ANION_H = [['H2SO3', 'HSO3^-', 'SO3^2-', 'hidrogenosulfato'], ['H2SeO4', 'HSeO4^-', 'SeO4^2-', 'hidrogenoselenito'], ['H2SO4', 'HSO4^-', 'SO4^2-', 'hidrogenosulfito']];
  function casoAnionAcido(ac, an, sinH, reves) {
    const nomAc = nombre(ac, 'tradicional'), bien = `${bonita(an)}, ${M.nombreIon(an)}`;
    return { pregunta: `El ${nomAc}, ${bonita(ac)}, suelta un solo H⁺. ¿Qué anión queda y cómo se llama?`, datos: [D6.hidrogeno, D5.aniones],
      opciones: opsTexto(bien, [
        [`${bonita(sinH)}, ${M.nombreIon(sinH)}`, 'QM-SAL-TODOS-H', 'Ese anión sale si el ácido suelta todos sus H⁺. Aquí suelta uno solo, así que el otro H se queda dentro del anión.'],
        [`${bonita(an)}, ${reves}`, 'QM-ITO-ATO', `La fórmula del anión está bien, pero el ${nomAc} da ${M.nombreIon(sinH)}, así que la terminación va al revés: el ácido -⁠ico da -⁠ato, y el -⁠oso, -⁠ito.`],
        [`${bonita(an.replace('^-', '^2-'))}, ${M.nombreIon(an)}`, 'QM-CARGA-ANION', 'Sería así si el ácido hubiera soltado dos H⁺. Cada H⁺ que se va deja una carga negativa, y aquí se fue uno solo: el anión queda con −1.'],
      ]),
      solucion: { texto: 'El ácido suelta un H⁺, así que el anión guarda el otro H y queda con una carga negativa.', ecuacion: [`${bonita(ac)} → H⁺ + ${bonita(an)}`] } };
  }
  // Átomos de oxígeno en una unidad del hidrato.
  function casoHidrato(f) {
    const [salF, ag] = f.split('·'), n = +ag.match(/^\d+/)[0], oSal = M.atomos(salF).O || 0, bien = oSal + n;
    return { pregunta: `¿Cuántos átomos de oxígeno hay en una unidad de ${bonita(f)}?`, datos: [D6.agua, D6.multiplica, 'El subíndice de afuera de un paréntesis multiplica todo lo de adentro'],
      opciones: opsTexto(String(bien), [
        [oSal ? String(oSal) : null, 'QM-HIDRATO-CUENTA', `Sería así si el agua no contara. Esos son los O de la sal, pero cada una de las ${n} aguas trae su propio O, y las aguas también son parte de la unidad.`],
        [String(n), 'QM-HIDRATO-CUENTA', oSal ? `Sería así si solo contaras el agua. Esos son los O de las aguas, y faltan los ${oSal} de la sal, que va delante del punto.` : 'Esos son los O del agua, y la sal no tiene oxígeno.'],
        [String(oSal + 1), 'QM-HIDRATO-CUENTA', `Sería así con una sola agua. El ${n} delante del H₂O cuenta moléculas enteras, así que multiplica también su O.`],
        [String(oSal + 3 * n), 'QM-HIDRATO-CUENTA', 'Sería así si contaras los tres átomos de cada agua, pero la pregunta es por los O, y cada H₂O tiene dos H y un solo O.'],
      ]),
      solucion: { texto: `${oSal ? `La sal tiene ${oSal} O,` : 'La sal no tiene O,'} y cada una de las ${n} aguas tiene uno.`, ecuacion: [`${oSal} + ${n} · 1 = ${bonita(String(bien))}`] } };
  }
  // [sal ácida, nombre sin el H, nombre con otra cantidad de H, nombre con la terminación al revés (o null)]
  const NOMBRE_ACIDA = { KHCO3: ['carbonato de potasio', 'dihidrogenocarbonato de potasio', null], CaHPO4: ['fosfato de calcio', 'dihidrogenofosfato de calcio', 'hidrogenofosfito de calcio'],
    KHSO3: ['sulfito de potasio', 'dihidrogenosulfito de potasio', 'hidrogenosulfato de potasio'] };
  function casoNombreAcida(f) {
    const n = M.nombrar(f), [sinH, otraH, reves] = NOMBRE_ACIDA[f], an = M.descomponer(f).anion;
    return { pregunta: `¿Cuál es el nombre del ${bonita(f)}?`, datos: [D6.hidrogeno, D5.aniones, `El anión ${bonita(an)} guarda H de su ácido`],
      opciones: opsTexto(n.stock, [
        [sinH, 'QM-SAL-TODOS-H', 'Sería así si el anión hubiera soltado todos sus H. Aquí conserva uno, y el nombre tiene que decirlo con «hidrogeno».'],
        [otraH, 'QM-HIDROGENO-N', `Sería así si el anión guardara dos H, como el H₂PO₄⁻. El ${bonita(an)} guarda uno solo, así que va «hidrogeno», sin «di».`],
        [reves, 'QM-ITO-ATO', 'El «hidrogeno» está bien, pero la terminación del anión va al revés: el ácido -⁠ico da -⁠ato, y el -⁠oso, -⁠ito.'],
        [`hidróxido de ${n.stock.split(' de ').slice(1).join(' de ')}`, 'QM-FUNCION', 'Sería así si el H formara un OH⁻ suelto. Aquí el H está dentro del anión, unido a él, así que es una sal ácida y no un hidróxido.'],
      ]),
      solucion: { texto: `El anión ${bonita(an)} conserva un H del ácido, así que su nombre lleva «hidrogeno» delante del nombre del anión.`, ecuacion: [`${bonita(f)}: ${n.stock}`] } };
  }
  // Ejemplos de la idea 6. Nombres del motor, comprobados con OPSIN (nombres.js): NaHSO₄ ácida · CuSO₄·5H₂O hidratada ·
  // KHCO₃ hidrogenocarbonato de potasio · MgSO₄·7H₂O 7 aguas · Ca(OH)Cl básica · H₂PO₄⁻ dihidrogenofosfato · Ca(HCO₃)₂ ·
  // CuSO₄·5H₂O 9 O · NaH₂PO₄ · Al(OH)SO₄ básica · NaHSO₃ hidrogenosulfito de sodio · Na₂CO₃·10H₂O 36 átomos · VFV ·
  // CuSO₄·5H₂O.
  const EJEMPLOS_ESPECIALES = [
    { nivel: 1, titulo: 'Un H en el anión', enunciado: '¿Qué clase de sal es el NaHSO₄?', datos: [D6.clases, D6.neutra],
      solucion: [{ texto: 'Su anión, HSO₄⁻, conserva un H del ácido sulfúrico.' }], respuesta: ['Sal ácida'] },
    { nivel: 1, titulo: 'Los cristales azules', enunciado: 'Los cristales azules del CuSO₄·5H₂O, ¿qué clase de sal son?', datos: [D6.clases, D6.neutra],
      solucion: [{ texto: 'Tiene agua tras el punto: cinco moléculas por cada CuSO₄.' }], respuesta: ['Sal hidratada'] },
    { nivel: 1, titulo: 'Otro bicarbonato', enunciado: '¿Cuál es el nombre del KHCO₃?', datos: [D6.hidrogeno, D5.aniones, 'El HCO₃⁻ sale del ácido carbónico, H₂CO₃'],
      solucion: [{ texto: 'Carbónico pasa a carbonato, y como el anión guarda un H, se llama hidrogenocarbonato. El catión es el potasio.' }],
      respuesta: [nombre('KHCO3', 'stock'), ' (en la cocina, bicarbonato de potasio)'] },
    { nivel: 1, titulo: 'La sal de Epsom', enunciado: 'La sal de Epsom es MgSO₄·7H₂O. ¿Cuántas moléculas de agua hay por cada MgSO₄?', datos: [D6.agua],
      solucion: [{ texto: 'El número delante del H₂O cuenta las moléculas de agua.' }], respuesta: ['7'] },
    { nivel: 1, titulo: 'Un OH de más', enunciado: '¿Qué clase de sal es el Ca(OH)Cl?', datos: [D6.clases, D6.neutra],
      solucion: [{ texto: 'Lleva un OH⁻ además del anión Cl⁻.' }], respuesta: ['Sal básica'] },
    { nivel: 2, titulo: 'El ácido fosfórico suelta uno', enunciado: 'El ácido fosfórico, H₃PO₄, suelta un solo H⁺. ¿Qué anión queda y cómo se llama?', datos: [D6.hidrogeno, D5.aniones],
      solucion: [{ texto: 'Se va un H⁺, así que quedan dos H y una carga negativa.', ecuacion: ['H₃PO₄ → H⁺ + H₂PO₄⁻'] }, { texto: 'Como guarda dos H, el anión se llama dihidrogenofosfato.' }],
      respuesta: ['H₂PO₄⁻, ', M.nombreIon('H2PO4^-')] },
    { nivel: 2, titulo: 'El bicarbonato del calcio', enunciado: '¿Cuál es la fórmula del hidrogenocarbonato de calcio?', datos: [D5.cero, D5.paren, 'Iones: Ca²⁺ y HCO₃⁻'],
      solucion: [{ texto: 'Un Ca²⁺ necesita dos HCO₃⁻, y como el anión se repite, va entre paréntesis.', ecuacion: ['(+2) + 2 · (−1) = ', Cq('0'), '   →   Ca(HCO₃)₂'] }], respuesta: ['Ca(HCO₃)₂'] },
    { nivel: 2, titulo: 'Los oxígenos del cristal azul', enunciado: '¿Cuántos átomos de oxígeno hay en una unidad de CuSO₄·5H₂O?', datos: [D6.agua, D6.multiplica],
      solucion: [{ texto: 'La sal tiene 4 O, y cada una de las cinco aguas tiene uno.', ecuacion: ['4 + 5 · 1 = 9'] }], respuesta: ['9'] },
    { nivel: 2, titulo: 'Por qué no es OH', enunciado: 'Un compañero dice que en el CuSO₄·5H₂O hay cinco grupos OH⁻. ¿Por qué no puede ser?', datos: [D6.agua, 'OH⁻: carga −1', 'Iones: Cu²⁺ y SO₄²⁻'],
      solucion: [{ texto: 'El Cu²⁺ y el SO₄²⁻ ya suman carga 0.', ecuacion: ['(+2) + (−2) = ', Cq('0')] }, { texto: 'Cinco OH⁻ dejarían carga −5, así que el agua del cristal no puede tener carga.' }],
      respuesta: ['El agua del cristal no tiene carga'] },
    { nivel: 2, titulo: 'Un fosfato con dos H', enunciado: '¿Cuál es la fórmula del dihidrogenofosfato de sodio?', datos: [D6.hidrogeno, D5.cero, 'Iones: Na⁺ y H₂PO₄⁻'],
      solucion: [{ texto: '«Dihidrogeno» dice que el anión guarda dos H: es el H₂PO₄⁻, con carga −1, y va uno a uno con el Na⁺.', ecuacion: ['(+1) + (−1) = ', Cq('0'), '   →   NaH₂PO₄'] }], respuesta: ['NaH₂PO₄'] },
    { nivel: 3, titulo: 'Una sal básica', enunciado: '¿Cuál de estas sales es una sal básica?', alternativas: ['NaHCO₃', 'K₂SO₄', 'Na₂CO₃·10H₂O', 'Al(OH)SO₄', 'KHSO₄'], datos: [D6.clases, D6.neutra],
      solucion: [{ texto: 'El Al(OH)SO₄ lleva un OH⁻ además del sulfato.' },
        { texto: ['La ', letra('A'), ' y la ', letra('E'), ' son ácidas; la ', letra('B'), ' es neutra; la ', letra('C'), ' es hidratada.'] }],
      respuesta: [letra('D'), ', Al(OH)SO₄'] },
    { nivel: 3, titulo: 'Un nombre con hidrogeno', enunciado: '¿Cuál es el nombre del NaHSO₃?',
      alternativas: ['hidrogenosulfato de sodio', 'hidrogenosulfito de sodio', 'sulfito de sodio', 'hidrogenosulfuro de sodio', 'bisulfato de sodio'],
      datos: [D6.hidrogeno, D5.aniones, 'El anión HSO₃⁻ viene del ácido sulfuroso, H₂SO₃'],
      solucion: [{ texto: 'Del ácido sulfuroso sale el sulfito, y con un H en el anión queda hidrogenosulfito.' },
        { texto: ['La ', letra('A'), ' y la ', letra('E'), ' usan -⁠ato, que es del ácido sulfúrico; la ', letra('C'), ' olvida el H; la ', letra('D'), ' usa -⁠uro, que es de los aniones sin oxígeno.'] }],
      respuesta: [letra('B'), ', hidrogenosulfito de sodio'] },
    { nivel: 3, titulo: 'Todos los átomos del hidrato', enunciado: '¿Cuántos átomos en total hay en una unidad de Na₂CO₃·10H₂O?', alternativas: ['36', '9', '6', '30', '26'],
      datos: [D6.agua, D6.multiplica],
      solucion: [{ texto: 'La sal tiene 2 Na, 1 C y 3 O, y el agua, 10 · 3 = 30 átomos.', ecuacion: ['6 + 30 = 36'] },
        { texto: ['La ', letra('B'), ' cuenta una sola agua; la ', letra('C'), ' olvida el agua; la ', letra('D'), ' cuenta solo el agua; la ', letra('E'), ' le pone un solo H a cada agua.'] }],
      respuesta: [letra('A'), ', 36'] },
    { nivel: 3, titulo: 'Verdadero o falso', enunciado: 'Indica verdadero (V) o falso (F). I. El NaHCO₃ es una sal ácida. II. En el CuSO₄·5H₂O, el agua tiene carga. III. El Mg(OH)Cl es una sal básica.',
      alternativas: ['VVV', 'FFV', 'VVF', 'FVV', 'VFV'], datos: [D6.clases, D6.agua],
      solucion: [{ texto: 'La I es verdadera: el HCO₃⁻ conserva un H. La II es falsa: el agua del cristal es neutra. La III es verdadera, porque lleva OH⁻.', ecuacion: ['VFV'] },
        { texto: ['La ', letra('A'), ', la ', letra('C'), ' y la ', letra('D'), ' le dan carga al agua; la ', letra('B'), ' y la ', letra('D'), ' niegan la I; la ', letra('C'), ' niega la III.'] }],
      respuesta: [letra('E'), ', VFV'] },
    { nivel: 3, titulo: 'Del nombre al hidrato', enunciado: '¿Cuál es la fórmula del sulfato de cobre(II) pentahidratado?',
      alternativas: ['CuSO₄·5OH', 'Cu₅SO₄·H₂O', 'CuSO₄·5H₂O', 'Cu(HSO₄)₅', 'CuSO₄·H₂O₅'], datos: [D6.agua, 'Prefijos: penta 5', 'Iones: Cu²⁺ y SO₄²⁻'],
      solucion: [{ texto: 'El Cu²⁺ y el SO₄²⁻ van uno a uno, y las cinco aguas van enteras tras el punto.' },
        { texto: ['La ', letra('A'), ' pone OH en vez de agua; la ', letra('B'), ' pone el 5 en el cobre; la ', letra('D'), ' es otra sal; la ', letra('E'), ' rompe la molécula de agua.'] }],
      respuesta: [letra('C'), ', CuSO₄·5H₂O'] },
  ];

  const especiales = {
    id: 'sales-acidas-basicas-hidratadas',
    titulo: 'Sales ácidas, básicas e hidratadas',
    pregunta: '¿Qué tienen de más algunas sales?',
    temas: ['Sales ácidas, básicas e hidratadas'],
    pieza: 'quim-fichas',
    aprendizaje: 'Una sal ácida conserva H en su anión, una básica lleva OH⁻ y una hidratada trae moléculas de agua enteras, sin carga, tras el punto.',
    actividad: 'Comparar las fichas de cinco sales y encontrar la que tiene algo de más.',
    lee: {
      tarjetas: [
        { titulo: 'El bicarbonato', texto: 'En la cocina, el bicarbonato hace crecer los queques: es NaHCO₃. Su anión, HCO₃⁻, todavía tiene un H del ácido carbónico.',
          pieza: 'quim-nomenclatura', dibujo: OBJ('bicarbonato', { etiqueta: 'NaHCO₃', nombre: 'Bicarbonato de la cocina' }) },
        { titulo: 'Soltar solo una parte', texto: 'Un ácido con dos o tres H puede soltar solo una parte: del H₂CO₃ sale HCO₃⁻ (hidrogenocarbonato) si suelta uno, y CO₃²⁻ (carbonato) si suelta los dos.' },
        { titulo: 'Convención del examen', texto: 'En el examen valen «bicarbonato de sodio» y «carbonato ácido de sodio»; el nombre de la IUPAC es hidrogenocarbonato de sodio. Las sales con OH⁻ tienen varios nombres: aquí solo se reconocen.' },
        { titulo: 'Qué mirar', texto: 'En el juego, compara cada sal con una sal de solo catión y anión: busca la ficha que sobra.' },
      ],
    },
    ejemplos: EJEMPLOS_ESPECIALES,
    juega: {
      consigna: 'Algunas sales traen algo más que un catión y un anión. Compara las fichas de cada una.',
      mision: { texto: 'Encuentra la sal que lleva un ion hidróxido, OH⁻.', logrado: v => v.k === 'MgOHCl',
        bien: 'Un OH⁻ y un Cl⁻ compensan al Mg²⁺: es una sal básica.' },
      voz: 'Busca la ficha que no está en una sal de solo catión y anión.',
      leyenda: [
        { s: Ca_('catión'), t: 'el ion positivo' },
        { s: An('anión'), t: 'el ion que deja el ácido' },
        { s: 'OH⁻', t: 'ion hidróxido, carga −1' },
        { s: 'HCO₃⁻', t: 'un anión que conserva un H' },
      ],
      controles: [{ id: 'k', etiqueta: 'Sal', opciones: Object.keys(ESP6).map(k => ({ valor: k, texto: bonita(ESP6[k].f) })) }],
      dibujo: v => fichas6(v.k),
      lectura: v => lectura6(v.k),
      minimo: 3,
    },
    predice: {
      pieza: 'quim-fichas',
      pregunta: 'El yeso es CaSO₄·2H₂O. ¿Qué es el «·2H₂O»?',
      datos: ['Iones del yeso: Ca²⁺ y SO₄²⁻'],
      voz: 'Mira la carga de esa parte.',
      opciones: [
        { id: 'c', texto: 'Dos moléculas de agua, sin carga', correcta: true },
        { id: 'oh', texto: 'Dos iones OH⁻: es una sal básica', error: 'QM-HIDRATO', siFuera: 'Sería así si esa parte tuviera carga. Dos OH⁻ sumarían −2 a una sal que ya está en 0 con el Ca²⁺ y el SO₄²⁻, y el yeso quedaría cargado.' },
        { id: 'h', texto: 'Dos H del anión: es una sal ácida', error: 'QM-HIDRATO', siFuera: 'Sería así si el H estuviera dentro del anión, como en el HCO₃⁻. Aquí va tras el punto y junto con su O: forma H₂O, una molécula aparte del sulfato.' },
        { id: 'parte', texto: 'Una parte del ion sulfato, SO₄²⁻', error: 'QM-POLI', siFuera: 'Sería así si el sulfato estuviera incompleto, pero el SO₄²⁻ ya tiene sus cuatro O y compensa al Ca²⁺. Lo que va tras el punto se suma aparte.' },
      ],
      dibujo: fichas([{ t: 'Ca²⁺', carga: 2, color: 'o' }, { t: 'SO₄²⁻', carga: -2, color: 'i' }, { t: '?', carga: 0, n: 2, oculta: true }], { cuenta: false, alt: 'Fichas del yeso: Ca²⁺, SO₄²⁻ y dos fichas «?», lo que se pregunta.' }),
      revelar: fichas([{ t: 'Ca²⁺', carga: 2, color: 'o' }, { t: 'SO₄²⁻', carga: -2, color: 'i' }, { t: 'H₂O', carga: 0, n: 2 }], { alt: 'Fichas del yeso: Ca²⁺, SO₄²⁻ y dos H₂O sin carga; carga neta 0.' }),
      coincide: 'Coincide: son dos H₂O neutras, y la suma de cargas sigue en cero.',
      noCoincide: 'Son dos moléculas de agua neutras, atrapadas en el cristal del yeso: la cuenta de cargas no cambia.',
    },
    mira: {
      datos: { serif: true, fichas: [{ t: 'H⁺', carga: 1, desde: 1, hasta: 1 }, { t: 'Na⁺', carga: 1, color: 'o', desde: 2 }, { t: 'H⁺', carga: 1, desde: 1, hasta: 2 }, { t: 'CO₃²⁻', carga: -2, color: 'i', desde: 1, hasta: 2 }, { t: 'HCO₃⁻', carga: -1, color: 'i', desde: 3 }],
        alt: 'Del ácido carbónico (dos H⁺ y un CO₃²⁻) al bicarbonato: un Na⁺ reemplaza a un H⁺ y el otro H queda en el anión HCO₃⁻.' },
      voz: 'Sigamos qué H se cambia por el sodio.',
      pasos: [
        { estado: { corte: 1 }, texto: 'El ácido carbónico, H₂CO₃, tiene dos H⁺ que puede soltar y un CO₃²⁻ que los compensa.', ecuacion: ['H₂CO₃'] },
        { estado: { corte: 2 }, texto: 'Un Na⁺ ocupa el lugar de uno de los H⁺, y el otro se queda: el ácido soltó solo una parte de sus H.', ecuacion: ['H₂CO₃ → NaHCO₃'] },
        { estado: { corte: 3 }, texto: 'Ese H queda dentro del anión HCO₃⁻, y el nombre lo dice: hidrogenocarbonato. Como todavía puede soltar ese H⁺, la sal es ácida.', ecuacion: ['Na⁺ + HCO₃⁻ → NaHCO₃'] },
      ],
    },
    regla: {
      texto: 'Una sal ácida conserva H en el anión, como el HCO₃⁻ (hidrogenocarbonato), y todavía puede soltarlo como H⁺, igual que un ácido. Una sal básica lleva OH⁻ además del anión, como una base. Una sal hidratada trae moléculas de agua enteras, atrapadas en su cristal, que se escriben tras un punto.',
      ecuacion: [{ llave: ['NaHCO₃'], nota: 'ácida' }, SEP, { llave: ['Mg(OH)Cl'], nota: 'básica' }, SEP, { llave: ['CuSO₄·5H₂O'], nota: 'hidratada' }],
      condicion: 'el agua del hidrato se cuenta sin carga; si la tomaras por OH⁻ o H⁺, la sal dejaría de ser neutra. El hidrato se nombra con prefijo: CuSO₄·5H₂O, sulfato de cobre(II) pentahidratado.',
      voz: 'Una ficha distinta decide la clase.',
    },
    resuelve: {
      pieza: 'quim-fichas',
      generar(s) {
        const f = RES6[((s % RES6.length) + RES6.length) % RES6.length], cl = clase6(f), n = M.nombrar(f);
        return { enunciado: `¿Qué clase de sal es el ${bonita(f)} y cómo se llama?`, datos: [D6.clases, cl === 'hidratada' ? D6.agua : D6.hidrogeno, D5.aniones, DATO_RES6[f]],
          pasos: [
            { tipo: 'pide', texto: 'Se piden la clase de la sal y su nombre.' },
            { tipo: 'datos', texto: `La fórmula es ${bonita(f)}.` },
            { tipo: 'regla', texto: 'Con H en el anión, la sal es ácida, porque aún puede soltar un H⁺; con OH⁻ de más, básica, y con agua tras el punto, hidratada.' },
            { tipo: 'aplica', texto: porClase(cl) },
            { tipo: 'cuentas', texto: cl === 'hidratada' ? `El nombre es el de la sal, más el prefijo que cuenta las aguas y «hidratado»: ${n.stock}.` : `El H que conserva el anión entra en el nombre como «hidrogeno»: ${n.stock}.` },
            { tipo: 'sentido', texto: cl === 'hidratada' ? 'La suma de cargas sigue en 0, porque el agua del cristal no tiene carga.' : 'La suma de cargas sigue en 0: el H del anión ya está contado en la carga del anión.' },
          ], respuesta: `Sal ${cl}, ${n.stock}` };
      },
    },
    ahoraTu: {
      pieza: 'quim-fichas',
      voz: 'Busca el H del anión, el OH o el agua.',
      generar(s) {
        const r = azar(s + 89), t = ((s % 4) + 4) % 4;
        if (t === 0) return casoClase6(r.de(AT6.clase));
        if (t === 1) return casoAnionAcido(...r.de(ANION_H));
        if (t === 2) return casoHidrato(r.de(AT6.hidratos));
        return casoNombreAcida(r.de(['KHCO3', 'CaHPO4', 'KHSO3']));
      },
    },
  };


  // ---------- Laboratorio ----------
  // Mesa 1 (idea 5): la sal armada a mano. El alumno pone cuántas fichas de cada ion; la cuenta dice si quedó neutra. Sin
  // nada que se mueva solo (antes las fichas de anión subían y bajaban solas).
  const CATL = ['Na', 'Ca', 'Al', 'NH4'], ANL = ['Cl', 'S', 'CO3', 'SO4', 'PO4'];
  const MAS_FICHAS = Math.max(...CATL.flatMap(c => ANL.map(a => { const x = sal(c, a); return x.nc + x.na; })));
  // Mesa 2 (idea 3): el EO de un átomo con los casos raros: peróxido (O −1), hidruro (H −1) y dos átomos que comparten.
  const RAROS = { h2o2: ['H2O2', 'O'], nah: ['NaH', 'H'], s2o3: ['S2O3^2-', 'S'], hno3: ['HNO3', 'N'], bao2: ['BaO2', 'O'] };
  const sumaRaro = v => { const [f, x] = RAROS[v.k]; return v.eo * nAt(f, x) + sumaConocidos(f, x); };
  const cuadra = v => sumaRaro(v) === cargaDe(RAROS[v.k][0]);
  const MAX_EO = Math.max(...Object.keys(RAROS).flatMap(k => Array.from({ length: 11 }, (_, i) => i - 3).filter(eo => cuadra({ k, eo }))));
  function raroDib(v) {
    const [f, x] = RAROS[v.k], n = nAt(f, x);
    return fichas([{ t: `${x}${sub(n)} ${n > 1 ? `${n}·(${sg(v.eo)})` : sg(v.eo)}`, carga: v.eo * n, n: 1, color: 'f' }, ...conocidos(f, x).map(fichaGrupo)],
      { neta: 'suma de los EO', alt: `${bonita(f)} con el ${x} a ${sg(v.eo)}: suma ${sg(sumaRaro(v))}, carga ${sg(cargaDe(f))}.` });
  }

  return {
    unidad: 'quimica.nomenclatura-inorganica',
    version: '0.2.1',
    calidad: 2,
    estado: 'completa',
    requiere: ['/plantillas/nomenclatura-inorganica/motor.js', '/nucleo/kit/piezas/quim-fichas.js', '/nucleo/kit/piezas/quim-cadena.js', '/nucleo/kit/piezas/quim-nomenclatura.js'],
    // Tabla de letras (molde §0.4): cada letra con un solo significado en la unidad.
    letras: { z: 'carga de la especie', n: 'número de átomos de un elemento en la fórmula' },
    // «IUPAC» lo define Funciones orgánicas, que viene después: aquí solo se nombra en la tarjeta de la convención.
    glosarioSin: ['IUPAC'],
    historia: {
      texto: 'Los nombres antiguos dependían del origen, del aspecto o del oficio que usaba una sustancia, y eso dificultaba comparar experimentos. En 1787, Guyton de Morveau, Lavoisier, Berthollet y Fourcroy propusieron un método común para nombrar. La nomenclatura siguió cambiando y hoy hay varios sistemas válidos: aprenderla es traducir entre nombre, fórmula y composición.',
      pregunta: '¿Qué tendría que decir un nombre para reconstruir la fórmula?',
      fuente: { titulo: 'IUPAC, Brief Guide to Inorganic Nomenclature', url: 'https://iupac.org/what-we-do/nomenclature/brief-guides/' },
    },

    // Glosario (docs/teoria.md §4d y 4g): las palabras que la unidad estrena en el curso, con su aproximación de todos los
    // días (`simple`) y tres ejemplos. Ningún ejemplo trae la respuesta de una Predice (glosario-predice): ni el Fe₂O₃, ni
    // el PbO₂, ni el BaO₂, ni el HClO₄, ni el KNO₂, ni el yeso. «subíndice» se mudó aquí desde Reacciones y balance (es
    // donde se usa primero); «ácido» es local: en agua suelta H⁺ (la definición de Brønsted es de Ácidos y bases).
    glosario: [
      { termino: 'estado de oxidación', formas: ['estado de oxidación', 'estados de oxidación'], simbolo: 'EO',
        simple: 'Los electrones que un átomo cedió (+) o ganó (−) al unirse.',
        def: 'Carga que tendría un átomo si todos sus enlaces fueran iónicos. Los EO de una especie suman su carga.',
        ejemplos: ['En el HNO₃, el N tiene EO +5: +1 + 5 − 6 = 0.', 'En el O₂ del aire, cada O tiene EO 0.', 'En el NaCl, el Na tiene +1 y el Cl, −1.'],
        ver: ['ion', 'enlace iónico'] },
      { termino: 'ion poliatómico', formas: ['ion poliatómico', 'iones poliatómicos'],
        simple: 'Un grupo de átomos unidos que lleva carga y va siempre junto.',
        def: 'Ion de varios átomos unidos que se comporta como una sola pieza: si se repite, va entre paréntesis.',
        ejemplos: ['NH₄⁺, el amonio: un N y cuatro H con carga +1.', 'CO₃²⁻, el carbonato de la tiza.', 'OH⁻, el hidróxido: un O y un H con carga −1.'], ver: ['ion'] },
      { termino: 'subíndice', formas: ['subíndice', 'subíndices'],
        simple: 'El numerito de abajo que cuenta átomos, como el 2 del H₂O.',
        def: 'Número pequeño abajo de un símbolo: cuántos átomos de ese elemento hay en una unidad. Cambiarlo cambia la sustancia.',
        ejemplos: ['En el H₂O, el 2 dice que hay dos H.', 'H₂O es agua; H₂O₂ es agua oxigenada.', 'En el Ca(OH)₂, el 2 de afuera repite todo el paréntesis.'], ver: ['coeficiente'] },
      { termino: 'óxido básico', formas: ['óxido básico', 'óxidos básicos'],
        simple: 'Un metal unido al oxígeno, como la herrumbre de un clavo.',
        def: 'Compuesto de un metal con oxígeno. Con agua forma un hidróxido.',
        ejemplos: ['CaO, la cal viva de las obras.', 'Na₂O, óxido de sodio.', 'CuO, el polvo negro de un cable de cobre quemado.'], ver: ['óxido ácido', 'hidróxido'] },
      { termino: 'óxido ácido', formas: ['óxido ácido', 'óxidos ácidos'],
        simple: 'Un no metal unido al oxígeno, como el CO₂ que exhalas.',
        def: 'Compuesto de un no metal con oxígeno; en la tradicional se llama anhídrido. Con agua forma un oxácido.',
        ejemplos: ['CO₂, dióxido de carbono.', 'SO₂, dióxido de azufre: sale al quemar azufre.', 'N₂O₅, pentóxido de dinitrógeno.'], ver: ['óxido básico', 'oxácido'] },
      { termino: 'nomenclatura sistemática', formas: ['nomenclatura sistemática', 'sistemática'],
        def: 'Nombra con prefijos que cuentan cada átomo: mono, di, tri, tetra, penta, hexa, hepta.',
        ejemplos: ['CO: monóxido de carbono.', 'Cl₂O₇: heptóxido de dicloro.', 'CuO: monóxido de cobre.'], ver: ['nomenclatura Stock'] },
      { termino: 'nomenclatura Stock', formas: ['nomenclatura Stock', 'Stock'],
        simple: 'El nombre que dice el EO con un número romano: hierro(III).',
        def: 'Nombra con el estado de oxidación del elemento en números romanos, entre paréntesis; se omite si tiene uno solo.',
        ejemplos: ['FeO: óxido de hierro(II).', 'CuO: óxido de cobre(II).', 'CaO: óxido de calcio, sin romano: el calcio solo tiene +2.'], ver: ['estado de oxidación'] },
      { termino: 'nomenclatura tradicional', formas: ['nomenclatura tradicional', 'tradicional'],
        simple: 'El nombre antiguo, que dice el EO con -⁠oso (menor) o -⁠ico (mayor).',
        def: 'Nombra con terminaciones: -⁠oso para el EO menor e -⁠ico para el mayor; con cuatro, también hipo- y per-.',
        ejemplos: ['FeO: óxido ferroso.', 'CuO: óxido cúprico.', 'SO₃: anhídrido sulfúrico.'], ver: ['nomenclatura Stock'] },
      { termino: 'peróxido', formas: ['peróxido', 'peróxidos'],
        simple: 'Un compuesto con dos oxígenos pegados, como el agua oxigenada del botiquín.',
        def: 'Compuesto con el ion O₂²⁻: dos oxígenos unidos, cada uno con EO −1. Su fórmula no se simplifica.',
        ejemplos: ['H₂O₂, el agua oxigenada.', 'Na₂O₂: no se simplifica a NaO.', 'K₂O₂: dos K +1 y dos O −1.'], ver: ['estado de oxidación'] },
      { termino: 'hidruro', formas: ['hidruro', 'hidruros'],
        simple: 'El hidrógeno unido a un metal, donde el H vale −1.',
        def: 'Compuesto del hidrógeno con un metal, donde el hidrógeno tiene EO −1.',
        ejemplos: ['NaH: hidruro de sodio.', 'CaH₂: hidruro de calcio.', 'LiH: +1 − 1 = 0.'], ver: ['estado de oxidación'] },
      { termino: 'hidrácido', formas: ['hidrácido', 'hidrácidos'],
        simple: 'Un ácido sin oxígeno, como el ácido muriático de la ferretería.',
        def: 'Ácido sin oxígeno: hidrógeno con un no metal de los grupos 16 o 17, disuelto en agua. Termina en -⁠hídrico.',
        ejemplos: ['HCl(ac): ácido clorhídrico, el ácido muriático.', 'HBr(ac): ácido bromhídrico.', 'HF(ac): ácido fluorhídrico.'], ver: ['oxácido'] },
      { termino: 'ácido', formas: ['ácido', 'ácidos'], local: true,
        def: 'Sustancia que, en agua, suelta iones H⁺. En esta unidad: los hidrácidos y los oxácidos.',
        ejemplos: ['HCl(ac) suelta H⁺ y Cl⁻.', 'El jugo de limón es ácido.', 'H₂SO₄ suelta dos H⁺.'], ver: ['hidrácido', 'oxácido'] },
      { termino: 'hidróxido', formas: ['hidróxido', 'hidróxidos'],
        simple: 'Un metal con grupos OH⁻, como la leche de magnesia.',
        def: 'Compuesto de un catión metálico con iones OH⁻: uno por cada unidad de su estado de oxidación.',
        ejemplos: ['NaOH: hidróxido de sodio, la soda cáustica.', 'Ca(OH)₂: la cal apagada.', 'Al(OH)₃: hidróxido de aluminio.'], ver: ['óxido básico'] },
      { termino: 'oxácido', formas: ['oxácido', 'oxácidos', 'ácido oxácido', 'ácidos oxácidos'],
        simple: 'Un ácido con oxígeno, como el sulfúrico de la batería del auto.',
        def: 'Ácido de hidrógeno, un no metal y oxígeno. Sale de sumar agua a un óxido ácido.',
        ejemplos: ['SO₃ + H₂O → H₂SO₄, ácido sulfúrico.', 'CO₂ + H₂O → H₂CO₃, ácido carbónico.', 'HNO₂, ácido nitroso.'], ver: ['óxido ácido', 'hidrácido'] },
      { termino: 'sal', formas: ['sal', 'sales'],
        simple: 'Lo que queda si un metal reemplaza los H de un ácido.',
        def: 'Compuesto iónico de un catión con el anión que queda cuando un ácido pierde sus H⁺.',
        ejemplos: ['NaCl, la sal de cocina, del HCl.', 'CaCO₃, la tiza, del H₂CO₃.', 'K₂SO₄, del H₂SO₄.'], ver: ['oxisal', 'sal haloidea'] },
      { termino: 'sal haloidea', formas: ['sal haloidea', 'sales haloideas', 'haloidea', 'haloideas'],
        simple: 'Una sal sin oxígeno, como la sal de cocina.',
        def: 'Sal cuyo anión no tiene oxígeno; viene de un hidrácido y su anión termina en -⁠uro.',
        ejemplos: ['NaCl: cloruro de sodio.', 'CaF₂: fluoruro de calcio.', 'FeS: sulfuro de hierro(II).'], ver: ['sal', 'hidrácido'] },
      { termino: 'oxisal', formas: ['oxisal', 'oxisales'],
        simple: 'Una sal con oxígeno en su anión, como la tiza.',
        def: 'Sal cuyo anión lleva oxígeno; viene de un oxácido y su anión termina en -⁠ito o -⁠ato.',
        ejemplos: ['CaCO₃: carbonato de calcio.', 'K₂SO₄: sulfato de potasio.', 'KClO: hipoclorito de potasio.'], ver: ['oxácido', 'sal'] },
      { termino: 'sal ácida', formas: ['sal ácida', 'sales ácidas'],
        simple: 'Una sal que se quedó con un H del ácido, como el bicarbonato.',
        def: 'Sal cuyo anión conserva algún hidrógeno del ácido; el nombre lleva «hidrogeno».',
        ejemplos: ['NaHCO₃: hidrogenocarbonato de sodio, el bicarbonato.', 'KHSO₄: hidrogenosulfato de potasio.', 'NaH₂PO₄: el anión H₂PO₄⁻ guarda dos H.'], ver: ['sal'] },
      { termino: 'sal básica', formas: ['sal básica', 'sales básicas'],
        simple: 'Una sal que además lleva grupos OH⁻.',
        def: 'Sal que tiene iones OH⁻ además del anión del ácido.',
        ejemplos: ['Mg(OH)Cl: un OH⁻ y un Cl⁻.', 'Cu₂(OH)₂CO₃: la malaquita, un mineral verde.', 'Al(OH)SO₄: un OH⁻ y un sulfato.'], ver: ['sal', 'hidróxido'] },
      { termino: 'sal hidratada', formas: ['sal hidratada', 'sales hidratadas', 'hidrato', 'hidratos'],
        simple: 'Una sal que guarda agua dentro de su cristal.',
        def: 'Sal que guarda agua en su cristal; esa agua se escribe después de un punto: ·nH₂O.',
        ejemplos: ['CuSO₄·5H₂O: cinco aguas por cada CuSO₄.', 'Na₂CO₃·10H₂O: diez aguas.', 'MgSO₄·7H₂O: la sal de Epsom.'], ver: ['sal'] },
    ],

    // Laboratorio (docs/teoria.md §4b y 4g), sin preguntas.
    laboratorio: [
      {
        id: 'sal-a-mano', titulo: 'La sal armada a mano', pieza: 'quim-fichas',
        consigna: 'Elige los dos iones y pon las fichas de cada uno. La cuenta dice si la sal quedó neutra y si se puede simplificar.',
        controles: [
          { id: 'c', etiqueta: 'Catión', opciones: CATL.map(k => ({ valor: k, texto: CAT[k][0] })) },
          { id: 'a', etiqueta: 'Anión', opciones: ANL.map(k => ({ valor: k, texto: AN[k][0] })) },
          { id: 'nc', etiqueta: 'fichas de catión', color: 'c-o', min: 1, max: 4, paso: 1, inicio: 1, decimales: 0 },
          { id: 'na', etiqueta: 'fichas de anión', color: 'c-i', min: 1, max: 4, paso: 1, inicio: 1, decimales: 0 },
        ],
        dibujo: v => salFichas(v.c, v.a, v.nc, v.na),
        lectura: v => lectura5(v),
        arrastres: arrastresSal,
        // Retos comprobados (docs/teoria.md §4d): la carga neta y la fórmula mínima salen de cargaSal y sal(), lo mismo que
        // la lectura.
        invitaciones: [
          { texto: 'Arma la sal de calcio y fosfato sin que quede carga suelta.', logrado: v => v.c === 'Ca' && v.a === 'PO4' && cargaSal(v) === 0,
            bien: 'Tres Ca²⁺ dan +6 y dos PO₄³⁻, −6: se anulan en el Ca₃(PO₄)₂.' },
          { texto: 'Arma una sal neutra que todavía se pueda simplificar.', logrado: v => cargaSal(v) === 0 && v.nc !== sal(v.c, v.a).nc,
            bien: 'Ya es neutra, pero la fórmula usa la proporción más chica: se simplifica.' },
          { texto: 'Busca la sal neutra, ya simplificada, que pide más fichas en total.', logrado: v => cargaSal(v) === 0 && v.nc === sal(v.c, v.a).nc && v.nc + v.na === MAS_FICHAS,
            bien: 'Con cargas como +2 y −3, que no se dividen, hacen falta más fichas.' },
          { texto: 'Guarda dos sales neutras con el mismo anión y distinto número de cationes.',
            logrado: (v, guardados) => guardados.some(x => guardados.some(y => x.a === y.a && x.nc !== y.nc && cargaSal(x) === 0 && cargaSal(y) === 0)),
            bien: 'Otra carga del catión pide otro número de fichas: la proporción depende de ambas.' },
        ],
      },
      {
        id: 'estados-raros', titulo: 'Peróxidos, hidruros y pares', pieza: 'quim-fichas',
        consigna: 'Ajusta el EO del átomo violeta hasta que la suma iguale la carga. Aquí el oxígeno o el hidrógeno no siempre valen lo de siempre.',
        controles: [
          { id: 'k', etiqueta: 'Especie', opciones: Object.keys(RAROS).map(k => ({ valor: k, texto: bonita(RAROS[k][0]) })) },
          { id: 'eo', etiqueta: 'EO del átomo violeta', color: 'c-f', min: -3, max: 7, paso: 1, inicio: 0, decimales: 0 },
        ],
        dibujo: v => raroDib(v),
        lectura: v => { const [f, x] = RAROS[v.k], s = sumaRaro(v), z = cargaDe(f); return [`Con ${x} ${sg(v.eo)}, los EO suman ${sg(s)}${s === z ? ', igual que la carga: ' : ', pero la carga es '}`, Cq(sg(z)), '.']; },
        arrastres: [arrastreEO(v => raroDib(v), 'eo', v => nAt(...RAROS[v.k]))],
        // Retos: «cuadra» cuando sumaRaro, la misma suma de la lectura, iguala la carga de la especie.
        invitaciones: [
          { texto: 'Haz que cuadre el agua oxigenada: ¿cuánto vale cada oxígeno?', logrado: v => v.k === 'h2o2' && cuadra(v), bien: 'Cada O vale −1: unidos entre sí, se reparten el −2 que compensa a los H.' },
          { texto: 'Haz que el hidrógeno valga −1 en un compuesto neutro.', logrado: v => v.k === 'nah' && cuadra(v), bien: 'Junto a un metal, el hidrógeno gana un electrón: es un hidruro.' },
          { texto: 'Busca la especie donde el átomo violeta llega al EO más alto.', logrado: v => cuadra(v) && v.eo === MAX_EO, bien: 'El N del HNO₃ llega a +5: los O dan −6 y el H, +1.' },
          { texto: 'Guarda dos especies distintas, ya cuadradas, con el mismo EO del átomo violeta.',
            logrado: (v, guardados) => guardados.some(x => guardados.some(y => x.k !== y.k && x.eo === y.eo && cuadra(x) && cuadra(y))),
            bien: 'El −1 sale en un peróxido y en un hidruro: el valor depende de los vecinos.' },
        ],
      },
    ],
    // A qué idea pertenece cada mesa (docs/teoria.md 4g). La escena vieja (plantillas/nomenclatura-inorganica) va a «Más
    // mesas del tema» con "rehacer": true en su plantilla.json.
    laboratorioIdeas: {
      'sal-a-mano': ['sales'],
      'estados-raros': ['peroxidos-hidruros'],
    },
    ideas: [oxidacion, tipos, peroxidos, funciones, sales, especiales],
  };
});
