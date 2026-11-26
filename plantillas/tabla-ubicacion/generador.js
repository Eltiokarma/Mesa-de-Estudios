/*
 * Generador «Dónde va cada elemento» (tabla-ubicacion), formato "predicciones" (docs/arquitectura.md). Práctica por
 * idea de quimica.tabla-periodica (docs/etapa5/propuesta-quimica.md §9): para esta unidad reemplaza a los tipos `ubicar`
 * y `familia` de configuracion-ubicacion (que queda para Estructura atómica) y a la escena atomo-y-tabla (que va a «Más
 * mesas del tema»). Funciona en el navegador (window.Generadores['tabla-ubicacion']) y en Node (require). No usa la
 * teoría: trae su propia tabla.
 *
 * Tipos por idea (TIPOS_POR_IDEA; nivel 1 un paso, 2 dos pasos, 3 de examen). generar(semilla, { idea }) da solo los de
 * esa idea; sin idea, las cuatro con el mismo peso.
 *   periodos-grupos-bloques  familia-z (1) la familia de un Z, contando desde su gas noble · periodo-z (1) · debajo (2)
 *                            el Z del elemento de abajo · largo-periodo (2) cuántos elementos tiene un periodo
 *   ubicacion-lewis          ubicar-rep (2) periodo y grupo de un representativo desde su Z (hasta 86) · z-lugar (2) el Z
 *                            desde el periodo y el grupo A · lewis (1) los puntos desde la terminación · par-familia (3)
 *                            qué par de configuraciones es de una misma familia
 *   bloques-transicion       ubicar-d (2) periodo y grupo de un metal de transición · bloque (1) · anomalo (3) el grupo del
 *                            Cr, el Cu, la Ag o el Au, con su configuración real · a-b (3) ¿son de la misma familia el Mg y el Zn?
 *   metales-no-metales       clase (1) metal, no metal o semimetal por su lugar · mas-metalico (2) el más metálico de tres ·
 *                            propiedades (2) qué es un material por cómo se porta
 * Convenciones: llenado 1s 2s 2p 3s 3p 4s 3d 4p 5s 4d 5p 6s 4f 5d 6p; anómalos Cr, Cu, Ag y Au (un electrón del s pasa al
 * d). Grupo con su número y su romano: «grupo 17 (VIIA)», «grupo 8 (VIIIB)». Semimetales: B, Si, Ge, As, Sb y Te.
 * Colores (los de la unidad): Z naranja, periodo turquesa, grupo carmín, electrones de valencia violeta.
 * Errores: los de la teoría (QM-, hipótesis; docs/investigacion/atomo-enlace-ideas-erroneas.md). Respuesta:
 * p.respuesta.valor es el texto de la alternativa correcta.
 * Cuentas comprobadas con un script aparte (casos.json, «verificacion») y con el recálculo de generador.test.js.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar, nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'tabla-ubicacion', UNIDAD = 'quimica.tabla-periodica', FUENTE = 'docs/investigacion/atomo-enlace-ideas-erroneas.md';
  const VARS = { Z: { nombre: 'número atómico', color: 'o' }, per: { nombre: 'periodo', color: 'i' }, gr: { nombre: 'grupo', color: 'h' }, e: { nombre: 'electrones de valencia', color: 'f' } };
  const v = P.v;
  const S = ('H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe '
    + 'Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn').split(' ');
  const NOM = { 1: 'hidrógeno', 3: 'litio', 4: 'berilio', 5: 'boro', 6: 'carbono', 7: 'nitrógeno', 8: 'oxígeno', 9: 'flúor', 11: 'sodio', 12: 'magnesio', 13: 'aluminio',
    14: 'silicio', 15: 'fósforo', 16: 'azufre', 17: 'cloro', 19: 'potasio', 20: 'calcio', 21: 'escandio', 22: 'titanio', 23: 'vanadio', 24: 'cromo', 25: 'manganeso',
    26: 'hierro', 27: 'cobalto', 28: 'níquel', 29: 'cobre', 30: 'cinc', 31: 'galio', 32: 'germanio', 33: 'arsénico', 34: 'selenio', 35: 'bromo', 37: 'rubidio',
    38: 'estroncio', 39: 'itrio', 40: 'circonio', 47: 'plata', 48: 'cadmio', 49: 'indio', 50: 'estaño', 51: 'antimonio', 52: 'telurio', 53: 'yodo', 55: 'cesio', 56: 'bario', 79: 'oro', 80: 'mercurio',
    81: 'talio', 82: 'plomo', 83: 'bismuto', 84: 'polonio', 85: 'astato' };
  const NOBLES = [0, 2, 10, 18, 36, 54, 86];
  const el = z => `${z === 47 ? 'la' : 'el'} ${NOM[z]}`, El = z => el(z).replace(/^./, c => c.toUpperCase());
  const GAS = { 2: 'He', 10: 'Ne', 18: 'Ar', 36: 'Kr', 54: 'Xe', 86: 'Rn' };
  const periodoDe = z => NOBLES.findIndex(g => z <= g);
  // Grupo de 1 a 18 (null en el bloque f). Por la forma de la tabla: dos al inicio, seis al final; en los periodos 4 y 5
  // las diez del medio son los grupos 3 a 12; en el 6, tras el La van los 14 del 4f.
  function grupoDe(z) {
    const p = periodoDe(z), d = z - NOBLES[p - 1], b = NOBLES[p] - z;
    if (z === 1) return 1; if (z === 2) return 18;
    if (d <= 2) return d; if (b <= 5) return 18 - b;
    if (p <= 5) return d; if (z >= 72) return z - 68; return null;
  }
  const ROM = { 1: 'IA', 2: 'IIA', 3: 'IIIB', 4: 'IVB', 5: 'VB', 6: 'VIB', 7: 'VIIB', 8: 'VIIIB', 9: 'VIIIB', 10: 'VIIIB', 11: 'IB', 12: 'IIB', 13: 'IIIA', 14: 'IVA', 15: 'VA', 16: 'VIA', 17: 'VIIA', 18: 'VIIIA' };
  const gTxt = g => `${g} (${ROM[g]})`;
  const SUPS = '⁰¹²³⁴⁵⁶⁷⁸⁹', su = x => String(x).split('').map(c => SUPS[c]).join('');
  const ORDEN = '1s 2s 2p 3s 3p 4s 3d 4p 5s 4d 5p 6s 4f 5d 6p'.split(' '), CAP = { s: 2, p: 6, d: 10, f: 14 };
  const ANOMALOS = { 24: { '4s': 1, '3d': 5 }, 29: { '4s': 1, '3d': 10 }, 47: { '5s': 1, '4d': 10 }, 79: { '6s': 1, '5d': 10 } };
  function config(z) { const c = {}; let r = z; for (const s of ORDEN) { if (r <= 0) break; c[s] = Math.min(CAP[s[1]], r); r -= c[s]; } return Object.assign(c, ANOMALOS[z] || {}); }
  // Abreviada: [gas noble anterior] y lo que sigue, en el orden de llenado.
  function confTxt(z) {
    const p = periodoDe(z), g = NOBLES[p - 1], c = config(z), base = g ? config(g) : {};
    return (g ? `[${GAS[g]}] ` : '') + ORDEN.filter(s => c[s] && !(s in base)).map(s => `${s}${su(c[s])}`).join(' ');
  }
  const valencia = z => { const p = periodoDe(z), c = config(z); return (c[`${p}s`] || 0) + (c[`${p}p`] || 0); };
  const ultimoNivel = z => { const p = periodoDe(z), c = config(z); return [`${p}s`, `${p}p`].filter(s => c[s]).map(s => `${s}${su(c[s])}`).join(' '); };
  const FAMILIAS = { 1: 'Alcalinos', 2: 'Alcalinotérreos', 16: 'Anfígenos', 17: 'Halógenos', 18: 'Gases nobles' };
  const SEMI = [5, 14, 32, 33, 51, 52], NO_METAL = [1, 2, 6, 7, 8, 9, 10, 15, 16, 17, 18, 34, 35, 36, 53, 54, 85, 86];
  const clase = z => (SEMI.includes(z) ? 'semimetal' : NO_METAL.includes(z) ? 'no metal' : 'metal');
  const ubTxt = (p, g) => `Periodo ${p}, grupo ${gTxt(g)}`;
  const Nom = z => (NOM[z] || S[z - 1]).replace(/^./, c => c.toUpperCase());
  const D = {
    gases: 'Gases nobles: Z = 2, 10, 18, 36, 54 y 86', llenado: 'Orden de llenado: 1s 2s 2p 3s 3p 4s 3d 4p 5s 4d 5p 6s 4f 5d 6p',
    caben: 'Caben: 2 en un s, 6 en un p, 10 en un d, 14 en un f', periodo: 'Periodo: el nivel más alto (el mayor n) con electrones',
    grupoA: 'Grupos A: los electrones del nivel más alto dan el romano; IIIA a VIIIA son las columnas 13 a 18',
    grupoB: 'Grupos B (bloque d): el grupo suma los ns y los (n − 1)d', lewis: 'Símbolo de Lewis: un punto por cada electrón del nivel más alto',
    familias: 'Familias: alcalinos (1), alcalinotérreos (2), anfígenos (16), halógenos (17), gases nobles (18)',
    bloque: 'Bloque: el subnivel donde cae el último electrón (s, p, d o f)', escalera: 'Semimetales: B, Si, Ge, As, Sb y Te, junto a la escalera',
    metal: 'Metal: brilla, conduce la corriente y se deja laminar; tiende a perder electrones',
  };
  const TIPOS_POR_IDEA = {
    'periodos-grupos-bloques': ['familia-z', 'periodo-z', 'debajo', 'largo-periodo'],
    'ubicacion-lewis': ['ubicar-rep', 'z-lugar', 'lewis', 'par-familia'],
    'bloques-transicion': ['ubicar-d', 'bloque', 'anomalo', 'a-b'],
    'metales-no-metales': ['clase', 'mas-metalico', 'propiedades'],
  };
  const IDEAS = Object.keys(TIPOS_POR_IDEA);
  const IDEA_DE = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map(t => [t, i])));
  const NIVEL = { 'familia-z': 1, 'periodo-z': 1, debajo: 2, 'largo-periodo': 2, 'ubicar-rep': 2, 'z-lugar': 2, lewis: 1, 'par-familia': 3, 'ubicar-d': 2, bloque: 1, anomalo: 3, 'a-b': 3,
    clase: 1, 'mas-metalico': 2, propiedades: 2 };
  const err = (id, texto, explicacion) => ({ id, clave: texto, texto, explicacion, respaldo: 'hipotesis', fuente: FUENTE });
  const trozos = t => String(t).replace(/[()]/g, ' ').split(/[\s;,]+|(?=[+−\-·/>])|(?<=[+−\-·/>])/).filter(Boolean);
  const dist = (a, b) => { const A = trozos(a), B = trozos(b); let d = 0; for (let i = 0; i < Math.max(A.length, B.length); i++) if (A[i] !== B[i]) d++; return d; };
  function* combinaciones(l, k, i = 0, acc = []) { if (acc.length === k) { yield acc; return; } for (let j = i; j < l.length; j++) yield* combinaciones(l, k, j + 1, [...acc, l[j]]); }
  function elegir(rng, correcta, errores) {
    const vistos = new Set([correcta]), pool = [];
    for (const e of rng.barajar(errores)) if (e && e.texto && !vistos.has(e.texto)) { vistos.add(e.texto); pool.push(e); }
    for (const k of [4, 3]) for (const sub of combinaciones(pool, Math.min(k, pool.length))) {
      if (sub.length < 3) continue;
      const al = [correcta, ...sub.map(e => e.texto)], sc = al.map(a => al.reduce((t, b) => t + dist(a, b), 0)), min = Math.min(...sc);
      if (!(sc[0] === min && sc.filter(x => x === min).length === 1)) return sub;
    }
    return null;
  }
  function cerrar(rng, semilla, tipo, o) {
    const elegidos = elegir(rng, o.correcta, o.errores);
    if (!elegidos) return null;
    const alternativas = P.armarTexto({ correcta: { clave: o.correcta, texto: o.correcta }, errores: elegidos, rng });
    if (alternativas.length < 4 || o.datos.some(d => d.includes(o.correcta))) return null;
    const usadas = new Set();
    for (const linea of [o.enunciado, o.pregunta, ...o.solucion]) for (const x of linea) if (x && typeof x === 'object' && x.v) usadas.add(x.v);
    return { id: `${ID}#${semilla}`, unidadCatalogo: UNIDAD, variables: Object.fromEntries([...usadas].map(k => [k, Object.assign({}, VARS[k])])),
      enunciado: o.enunciado, pregunta: o.pregunta, datos: o.datos, alternativas, solucion: o.solucion, respuesta: { valor: o.correcta, unidad: '' },
      _datos: Object.assign({ idea: IDEA_DE[tipo], tipo, nivel: NIVEL[tipo] }, o._datos) };
  }
  const abajo = z => { const p = periodoDe(z), g = grupoDe(z); return p >= 6 ? null : g <= 2 ? NOBLES[p] + g : NOBLES[p + 1] - (18 - g); };
  // ---- Idea 1: ley periódica, periodos y grupos ----
  const Z_FAM = [3, 4, 11, 12, 19, 20, 37, 38, 55, 56, 8, 9, 16, 17, 34, 35, 52, 53, 10, 18, 36, 54];
  function familiaZ(rng) {
    const z = rng.elegir(Z_FAM), g = grupoDe(z), p = periodoDe(z), orden = [1, 2, 16, 17, 18];
    const VEC = { 1: 2, 2: 1, 16: 17, 17: 16, 18: 17 }, ESP = { 1: 17, 2: 16, 16: 2, 17: 1, 18: 1 };
    return { correcta: FAMILIAS[g], _datos: { z },
      enunciado: ['Un elemento tiene ', v('Z', `Z = ${z}`), '.'], pregunta: ['¿A qué familia pertenece?'], datos: [D.gases, D.familias],
      errores: [err('QM-CUENTA-GRUPO', FAMILIAS[VEC[g]], 'Bien partir de un gas noble. Pero cuenta de nuevo los lugares: te pasaste o te faltó uno.'),
        err('QM-CUENTA-LADO', FAMILIAS[ESP[g]], 'Bien contar los lugares. Pero desde el gas noble anterior se cuenta hacia adelante, no hacia atrás.'),
        err('QM-FILA-COLUMNA', `Periodo ${p}`, 'Ese es su periodo, bien hallado. Pero la familia es su columna.'),
        ...orden.filter(x => x !== g && x !== VEC[g] && x !== ESP[g]).slice(0, 1).map(x => err('QM-FAMILIA', FAMILIAS[x], 'Bien ubicar el periodo. Pero esa familia está en otra columna.'))],
      solucion: [[`Los gases nobles más cercanos tienen Z = ${NOBLES[p - 1]} y Z = ${NOBLES[p]}. `, z === NOBLES[p] ? `El ${z} es uno de ellos: es un gas noble.` : z - NOBLES[p - 1] <= 2 ? `El ${z} está ${z - NOBLES[p - 1] === 1 ? '1 lugar' : `${z - NOBLES[p - 1]} lugares`} después del ${NOBLES[p - 1]}.` : `El ${z} está ${NOBLES[p] - z === 1 ? '1 lugar' : `${NOBLES[p] - z} lugares`} antes del ${NOBLES[p]}.`],
        ['Grupo ', v('gr', gTxt(g)), `: ${FAMILIAS[g].toLowerCase()}.`]] };
  }
  function periodoZ(rng) {
    const z = rng.ent ? 0 : 0, zz = rng.elegir([5, 7, 13, 15, 21, 26, 29, 33, 40, 47, 50, 53, 56, 79, 82, 12, 20, 38]), p = periodoDe(zz);
    return { correcta: `Periodo ${p}`, _datos: { z: zz },
      enunciado: ['Un elemento tiene ', v('Z', `Z = ${zz}`), '.'], pregunta: ['¿En qué ', v('per', 'periodo'), ' está?'], datos: [D.gases, 'Cada periodo termina en un gas noble'],
      errores: [err('QM-PERIODO-ANTERIOR', `Periodo ${p - 1}`, 'Buscar los gases nobles es el camino. Pero el periodo es el del gas noble que lo cierra, no el del anterior.'),
        err('QM-PERIODO-CUENTA', `Periodo ${p + 1}`, 'Contar filas es el camino. Pero ese periodo empieza recién después del gas noble siguiente.'),
        err('QM-FILA-COLUMNA', `Periodo ${Math.min(grupoDe(zz) || 7, 7) === p ? (p > 1 ? p - 2 || 7 : 7) : Math.min(grupoDe(zz) || 7, 7)}`, 'Bien la idea de fila y columna. Pero ese número sale de la columna, no de la fila.'),
        err('QM-PERIODO-Z', `Periodo ${Math.min(7, Math.floor(zz / 10) + 1) === p ? (p < 7 ? p + 2 : p - 2) : Math.min(7, Math.floor(zz / 10) + 1)}`, 'Bien ordenar por Z. Pero los periodos no tienen diez elementos cada uno.')].filter(e => !/Periodo (0|[8-9]|-)/.test(e.texto)),
      solucion: [[`${zz} está entre ${NOBLES[p - 1]} y ${NOBLES[p]}: el periodo ${p} termina en el ${NOBLES[p]}.`], [v('per', `Periodo ${p}`), '.']] };
  }
  const Z_ABAJO = [3, 4, 11, 12, 19, 20, 37, 38, 8, 9, 10, 16, 17, 18, 34, 35, 36, 5, 13, 31, 6, 14, 7, 15, 32, 33];
  function debajo(rng) {
    const z = rng.elegir(Z_ABAJO), b = abajo(z), p = periodoDe(z);
    return { correcta: `${b}`, _datos: { z },
      enunciado: [`El ${NOM[z]} tiene `, v('Z', `Z = ${z}`), '.'], pregunta: ['¿Cuál es el número atómico del elemento que está justo debajo de él, en su misma columna?'],
      datos: [D.gases, 'Elementos por periodo: 2, 8, 8, 18, 18, 32, 32'],
      errores: [err('QM-LARGO-8', `${z + 8}`, `Bien sumar un periodo. Pero ${p >= 3 ? 'desde el periodo 4 caben 18' : 'ese periodo tiene otro largo'}: cuenta sus elementos.`),
        err('QM-LARGO-18', `${z + 18}`, `Bien sumar un periodo. Pero ${p <= 2 ? 'el siguiente tiene solo 8' : 'mira cuántos elementos tiene el que sigue'}.`),
        err('QM-FILA-COLUMNA', `${z + 1}`, 'Ese es su vecino de la derecha, en la misma fila. Se pide el de abajo, en la columna.'),
        err('QM-LARGO-32', `${z + 32}`, 'Bien sumar un periodo entero. Pero 32 tienen solo los periodos 6 y 7.')].filter(e => e.texto !== `${b}`),
      solucion: [[`Del ${z} al de abajo hay un periodo entero: el que va del ${z} hasta el mismo lugar en la fila siguiente.`], [`${z} + ${b - z} = `, v('Z', `${b}`), '.']] };
  }
  function largoPeriodo(rng) {
    const p = rng.elegir([1, 2, 3, 4, 5, 6]), n = NOBLES[p] - NOBLES[p - 1];
    return { correcta: `${n} elementos`, _datos: { p },
      enunciado: [`El ${v('per', `periodo ${p}`).t} empieza después de un gas noble y termina en otro.`].map(x => x), pregunta: ['¿Cuántos elementos tiene el ', v('per', `periodo ${p}`), '?'],
      datos: [D.gases],
      errores: [err('QM-LARGO-8', `${p <= 3 ? 18 : 8} elementos`, 'Bien restar gases nobles. Pero revisa cuáles cierran ese periodo.'),
        err('QM-LARGO-RESTA', `${n + 1} elementos`, 'Bien restar los dos gases nobles. Pero el resultado ya cuenta los elementos: no se suma uno.'),
        err('QM-LARGO-18', `${p === 6 ? 18 : 32} elementos`, 'Bien la idea de restar. Pero mira de qué gas noble a cuál va.'),
        err('QM-LARGO-COLUMNAS', '18 elementos', 'La tabla tiene 18 columnas, cierto. Pero no todos los periodos las llenan.')].filter(e => e.texto !== `${n} elementos`),
      solucion: [[`El periodo ${p} va del ${NOBLES[p - 1] + 1} al ${NOBLES[p]}.`], [`${NOBLES[p]} − ${NOBLES[p - 1]} = ${n} elementos.`]] };
  }
  // ---- Idea 2: ubicación de un representativo y Lewis ----
  const REP = [3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 19, 20, 31, 32, 33, 34, 35, 37, 38, 49, 50, 51, 52, 53, 55, 56, 81, 82, 83, 84, 85];
  function opcionesLugar(z, conD) {
    const p = periodoDe(z), g = grupoDe(z), val = valencia(z), out = [];
    if (g >= 13) out.push(err('QM-SOLO-P', ubTxt(p, val - 2 <= 2 ? val - 2 || 18 : val - 2 + 10), `Bien el periodo. Pero el nivel ${p} tiene también sus dos electrones s, así que sus electrones son ${val}.`));
    else out.push(err('QM-GRUPO-B', `Periodo ${p}, grupo ${g + 10} (${g === 1 ? 'IB' : 'IIB'})`, 'Bien el periodo. Pero el 10 se suma solo cuando la configuración termina en p, y esta termina en s.'));
    out.push(err('QM-PERIODO-ANTERIOR', ubTxt(p - 1, g), `Bien el grupo. Pero el periodo es el nivel más alto que tiene electrones, que es el ${p}.`));
    if (p < 7) out.push(err('QM-PERIODO-CUENTA', ubTxt(p + 1, g), `Bien el grupo. Pero ningún electrón llega al nivel ${p + 1}: el más alto es el ${p}.`));
    if (val !== p && val <= 7 && p <= 2) out.push(err('QM-PERIODO-GRUPO', ubTxt(val, p), 'Bien hallados los dos números. Pero van al revés: el número del nivel más alto es el periodo.'));
    if (conD && p >= 4) out.push(err('QM-D-VALENCIA', ubTxt(p, Math.min(18, g + (g >= 13 ? 0 : 10))), 'Bien el periodo. Pero los electrones d de los niveles de adentro no cuentan en un grupo A.'));
    return out.filter(e => !/grupo (0|1[89]|[2-9]\d)\b/.test(e.texto) && !/Periodo 0/.test(e.texto));
  }
  function ubicarRep(rng) {
    const z = rng.elegir(REP), p = periodoDe(z), g = grupoDe(z), val = valencia(z);
    return { correcta: ubTxt(p, g), _datos: { z },
      enunciado: ['Un elemento tiene ', v('Z', `Z = ${z}`), '.'], pregunta: ['¿En qué ', v('per', 'periodo'), ' y en qué ', v('gr', 'grupo'), ' está?'],
      datos: [D.llenado, D.caben, D.periodo, D.grupoA],
      errores: opcionesLugar(z, true),
      solucion: [[`Su configuración es ${confTxt(z)}.`], ['El nivel más alto es el ', v('per', `${p}`), ', con ', v('e', `${val} ${val === 1 ? 'electrón' : 'electrones'}`), ` (${ultimoNivel(z)}), así que está en el `, v('gr', `grupo ${gTxt(g)}`), '.']] };
  }
  const REP36 = [3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 19, 20, 31, 32, 33, 34, 35];
  function zLugar(rng) {
    const z = rng.elegir(REP36), p = periodoDe(z), g = grupoDe(z), a = abajo(z), arriba = REP36.find(x => abajo(x) === z);
    return { correcta: `${z}`, _datos: { z },
      enunciado: ['Un elemento está en el ', v('per', `periodo ${p}`), ' y en el ', v('gr', `grupo ${ROM[g]}`), '.'], pregunta: ['¿Cuál es su ', v('Z', 'número atómico'), '?'],
      datos: [D.llenado, D.caben, D.periodo, D.grupoA, 'Átomo neutro: Z = número de electrones'],
      errores: [arriba && err('QM-PERIODO-ANTERIOR', `${arriba}`, `Bien el grupo. Pero ese elemento llega solo al nivel ${p - 1}, y falta llenar un nivel más.`),
        a && err('QM-PERIODO-CUENTA', `${a}`, `Bien el grupo. Pero ese elemento ya tiene electrones en el nivel ${p + 1}, así que está un periodo más abajo.`),
        err('QM-CUENTA-GRUPO', `${z + 1}`, 'Bien el periodo. Pero cuenta de nuevo los electrones del nivel más alto: sobra uno.'),
        g >= 13 && valencia(z) > 3 && err('QM-SOLO-P', `${z + 2}`, `Bien el periodo. Pero ${ROM[g]} no quiere decir ${valencia(z)} electrones p: son ${valencia(z)} entre los s y los p.`),
        err('QM-CUENTA-MENOS', `${z - 1}`, 'Bien el periodo. Pero falta un electrón en el nivel más alto.')].filter(e => e && +e.texto > 0),
      solucion: [[`Su nivel más alto es el ${p}, con ${valencia(z)} ${valencia(z) === 1 ? 'electrón' : 'electrones'}: ${confTxt(z)}.`], [`${NOBLES[p - 1]} + ${z - NOBLES[p - 1]} = `, v('Z', `${z}`), '.']] };
  }
  function lewis(rng) {
    const z = rng.elegir(REP.filter(x => grupoDe(x) >= 13)), p = periodoDe(z), val = valencia(z), g = grupoDe(z);
    return { correcta: `${val} puntos`, _datos: { z },
      enunciado: ['La configuración de un elemento termina en ', ultimoNivel(z), '.'], pregunta: ['¿Cuántos puntos lleva su símbolo de Lewis?'], datos: [D.lewis],
      errores: [err('QM-SOLO-P', `${val - 2} puntos`, `Bien contar los electrones p. Pero el nivel ${p} tiene también sus dos s.`),
        err('QM-LEWIS-GRUPO', `${g} puntos`, 'Ese es su grupo, bien hallado. Pero los puntos son los electrones del nivel más alto, que son 10 menos que el número del grupo.'),
        p !== val && err('QM-LEWIS-NIVEL', `${p} puntos`, 'Mirar el nivel más alto es el camino. Pero los puntos cuentan los electrones de ese nivel, no su número.'),
        err('QM-LEWIS-PAR', `${2 * val > 8 ? 8 : 2 * val} puntos`, 'Bien contar los de valencia. Pero cada electrón es un punto, no un par.')].filter(e => e && e.texto !== `${val} puntos` && !/^-?0 puntos/.test(e.texto)),
      solucion: [[`Un punto por cada electrón del nivel ${p}: los de ${ultimoNivel(z)}.`], [v('e', `${val} puntos`), '.']] };
  }
  const FAM_PARES = [13, 14, 15, 16, 17, 31, 32, 33, 34, 35, 11, 12, 19, 20];
  function parFamilia(rng) {
    const z = rng.elegir(FAM_PARES), b = abajo(z), g = grupoDe(z);
    const fila = g >= 17 ? z - 1 : z + 1, otro = g >= 17 ? b - 2 : b + 1;
    const candidatos = [[b, 'c'], [fila, 'QM-FILA-COLUMNA'], [otro, 'QM-CUENTA-GRUPO']];
    // El metal de transición con tantos electrones d como los de valencia de z (sin las excepciones, que tienen otro número de d).
    if (periodoDe(b) >= 4 && g >= 13 && !ANOMALOS[NOBLES[periodoDe(b) - 1] + 2 + valencia(z)]) candidatos.push([NOBLES[periodoDe(b) - 1] + 2 + valencia(z), 'QM-D-VALENCIA']);
    if (g <= 2) candidatos.push([NOBLES[periodoDe(b)] - (8 - g) < b ? NOBLES[periodoDe(b)] - (18 - g - 10) : b + 10, 'QM-GRUPO-B']);
    const txt = x => confTxt(x);
    return { correcta: txt(b), _datos: { z },
      enunciado: [`El ${NOM[z]} tiene la configuración ${confTxt(z)}.`], pregunta: ['¿Cuál de estas configuraciones es de un elemento de su misma familia?'],
      datos: [D.grupoA, 'Los de una familia tienen los mismos electrones en su nivel más alto'],
      errores: candidatos.filter(([x, id]) => id !== 'c' && x !== b && x > 0 && x <= 86).map(([x, id]) => err(id, txt(x),
        id === 'QM-FILA-COLUMNA' ? 'Ese está en su mismo periodo, cierto. Pero una familia es una columna, no una fila.'
          : id === 'QM-CUENTA-GRUPO' ? `Bien buscar en el periodo siguiente. Pero su nivel más alto tiene ${valencia(x)} electrones, no ${valencia(z)}.`
            : id === 'QM-D-VALENCIA' ? `Tiene ${valencia(z)} electrones d, como los de valencia ${el(z).replace(/^el /, 'del ')}, cierto. Pero termina en d: no es un grupo A.`
              : 'Bien el número de electrones de afuera. Pero ese termina en d: es un grupo B.')),
      solucion: [[`El ${NOM[z]} tiene ${valencia(z)} electrones en su nivel más alto (${ultimoNivel(z)}).`], ['El elemento de su familia también los tiene: ', ultimoNivel(b), ` (Z = ${b}, `, v('gr', `grupo ${gTxt(g)}`), ').']] };
  }
  // ---- Idea 3: bloques y metales de transición ----
  const Z_D = [21, 22, 23, 25, 26, 27, 28, 30, 39, 40, 41, 43, 45, 48, 80].filter(z => z !== 41 && z !== 45 && z !== 43);
  const sd = z => { const p = periodoDe(z), c = config(z); return { p, s: c[`${p}s`] || 0, d: c[`${p - 1}d`] || 0 }; };
  function ubicarD(rng) {
    const z = rng.elegir(Z_D), { p, s, d } = sd(z), g = s + d;
    return { correcta: ubTxt(p, g), _datos: { z },
      enunciado: [`${El(z)} (`, v('Z', `Z = ${z}`), `) tiene la configuración ${confTxt(z)}.`], pregunta: ['¿En qué ', v('per', 'periodo'), ' y en qué ', v('gr', 'grupo'), ' está?'],
      datos: [D.periodo, D.grupoB],
      errores: [err('QM-PERIODO-D', ubTxt(p - 1, g), `Bien el grupo. Pero el periodo es el mayor n, el ${p}, que es el del ${p}s.`),
        d !== g && d >= 1 && err('QM-GRUPO-SOLO-D', ubTxt(p, d), `Contaste bien ${d === 1 ? 'el electrón d' : `los ${d} electrones d`}. Pero también cuentan los ${s} del ${p}s.`),
        err('QM-GRUPO-SOLO-S', ubTxt(p, s), 'Así sería en un representativo. Pero este termina en d, y entonces sus electrones d también cuentan.'),
        g + 10 <= 18 && err('QM-GRUPO-A', ubTxt(p, g + 10), 'Bien sumar los electrones. Pero el 10 se suma solo en los grupos A, que terminan en p.')].filter(Boolean),
      solucion: [['El mayor n es ', v('per', `${p}`), ', y ese es el periodo. El grupo suma los s y los d: ', v('e', `${s}`), ' + ', v('e', `${d}`), ' = ', v('gr', gTxt(g)), '.']] };
  }
  const Z_BLOQUE = [11, 20, 38, 56, 13, 16, 35, 53, 82, 22, 26, 28, 30, 40, 47, 79];
  function bloque(rng) {
    const z = rng.elegir(Z_BLOQUE), g = grupoDe(z), b = g <= 2 ? 's' : g <= 12 ? 'd' : 'p', p = periodoDe(z);
    const otros = { s: ['p', 'd', 'f'], p: ['s', 'd', 'f'], d: ['s', 'p', 'f'] }[b];
    const EX = { s: 'El último electrón no cae en un s: mira el último subnivel de la configuración.', p: 'El último electrón no cae en un p: mira el último subnivel.',
      d: 'El último electrón no cae en un d: mira el último subnivel de la configuración.', f: 'El bloque f son las dos filas de abajo, y esta configuración no termina en f.' };
    return { correcta: `Bloque ${b}`, _datos: { z },
      enunciado: [`${El(z)} tiene la configuración ${confTxt(z)}.`], pregunta: ['¿De qué bloque es?'], datos: [D.bloque],
      errores: [...otros.map(x => err(x === 'f' ? 'QM-BLOQUE-F' : 'QM-BLOQUE', `Bloque ${x}`, EX[x])), err('QM-BLOQUE-PERIODO', `Bloque ${p}`, 'Bien mirar la configuración. Pero el bloque es una letra (s, p, d o f), no el nivel.')],
      solucion: [[`El último subnivel que se llena es un ${b}${b === 'd' ? ` (${p - 1}d)` : ''}.`], [`Por eso es del bloque ${b}.`]] };
  }
  const Z_ANOM = [24, 29, 47, 79];
  function anomalo(rng) {
    const z = rng.elegir(Z_ANOM), { p, s, d } = sd(z), g = s + d;
    return { correcta: ubTxt(p, g), _datos: { z },
      enunciado: [`${El(z)} (`, v('Z', `Z = ${z}`), `) tiene la configuración real ${confTxt(z)}: un electrón del ${p}s pasó al ${p - 1}d.`],
      pregunta: ['¿En qué ', v('per', 'periodo'), ' y en qué ', v('gr', 'grupo'), ' está?'], datos: [D.periodo, D.grupoB],
      errores: [err('QM-ANOMALO-GRUPO', ubTxt(p, g === 6 ? 7 : 12), 'Bien la configuración. Pero el grupo suma los electrones que tiene, no los que tendría.'),
        err('QM-PERIODO-D', ubTxt(p - 1, g), `Bien el grupo. Pero el periodo es el mayor n, que es el ${p}.`),
        err('QM-GRUPO-SOLO-D', ubTxt(p, d === 10 ? 10 : d), `Contaste bien los ${d} electrones d. Pero también cuenta el electrón del ${p}s.`),
        err('QM-GRUPO-SOLO-S', ubTxt(p, 1), 'Así sería en un alcalino. Pero este termina en d, y entonces sus electrones d también cuentan.')],
      solucion: [['El mayor n es ', v('per', `${p}`), ', y ese es el periodo. El grupo suma los s y los d: ', v('e', `${s}`), ' + ', v('e', `${d}`), ' = ', v('gr', gTxt(g)), ', lo mismo que daría la suma sin el cambio.']] };
  }
  function aB(rng) {
    const [a, b] = rng.elegir([[12, 30], [20, 48], [19, 29], [11, 29], [4, 30], [37, 47]]), ga = grupoDe(a), gb = grupoDe(b);
    return { correcta: `No: ${el(a)} es del grupo ${gTxt(ga)} y ${el(b)}, del ${gTxt(gb)}`, _datos: { a, b },
      enunciado: [`${El(a)} termina en ${ultimoNivel(a)} y ${el(b)}, en ${confTxt(b).split(' ').slice(1).join(' ')}.`],
      pregunta: ['¿Son de la misma familia?'], datos: [D.grupoA, D.grupoB],
      errores: [err('QM-AB-IGUAL', `Sí: los dos tienen ${ga === 1 ? 'un electrón' : `${ga} electrones`} en su s de afuera`, `Bien contar el s de afuera. Pero ${el(b)} termina en d: es un grupo B.`),
        err('QM-AB-ROMANO', `Sí: los dos son del grupo ${ROM[ga].replace(/A$/, '')}`, 'Bien el número romano. Pero la letra cambia: A y B son columnas distintas.'),
        err('QM-AB-PERIODO', `No: están en periodos distintos`, 'Están en periodos distintos, cierto. Pero eso no decide la familia: decide la columna.'),
        err('QM-AB-SUMA', `Sí: los dos suman ${ga + 10}`, 'Sumar los d del segundo está bien. Pero el primero no tiene electrones d, así que queda en la columna ' + ga + '.')],
      solucion: [[`${El(a)} termina en s: grupo ${gTxt(ga)}. ${El(b)} termina en d: ${sd(b).s} + ${sd(b).d} = ${gb}, grupo ${gTxt(gb)}.`]] };
  }
  // ---- Idea 4: metales, no metales y semimetales ----
  const Z_CLASE = [3, 12, 13, 20, 31, 50, 82, 26, 29, 5, 14, 32, 33, 51, 52, 6, 15, 16, 34, 17, 53, 7, 8, 35];
  function claseP(rng) {
    const z = rng.elegir(Z_CLASE), c = clase(z), p = periodoDe(z), g = grupoDe(z);
    const SI = { metal: ['QM-CLASE-METAL', 'Bien mirar su lugar. Pero los metales están a la izquierda de la escalera.'], 'no metal': ['QM-CLASE-NO-METAL', 'Bien mirar su lugar. Pero los no metales están a la derecha y arriba.'],
      semimetal: ['QM-DOS-CLASES', 'Bien mirar la escalera. Pero solo B, Si, Ge, As, Sb y Te son semimetales.'], gas: ['QM-CLASE-GAS', 'Bien pensar en cómo se porta. Pero los gases nobles son solo los del grupo 18.'] };
    return { correcta: `Un ${c}`, _datos: { z },
      enunciado: [`El ${NOM[z]} está en el `, v('per', `periodo ${p}`), ', ', v('gr', `grupo ${gTxt(g)}`), '.'], pregunta: ['¿Qué es: un metal, un no metal o un semimetal?'],
      datos: ['La escalera va del boro al polonio, entre los grupos 13 y 16', D.escalera],
      errores: ['metal', 'no metal', 'semimetal', 'gas'].filter(x => x !== c).map(x => err(SI[x][0], x === 'gas' ? 'Un gas noble' : `Un ${x}`, SI[x][1])),
      solucion: [[c === 'semimetal' ? 'Está pegado a la escalera, en la lista de los seis semimetales.' : c === 'metal' ? 'Está a la izquierda de la escalera, así que es un metal.' : 'Está a la derecha de la escalera y no es de los seis semimetales, así que es un no metal.']] };
  }
  // Tríos donde la EI del NIST sigue el orden (sin Mg–Al, Al–Ga, Ca–Ga ni P–S): «qué tan fácil pierde electrones» no se contradice.
  const TRIOS_M = [[11, 12, 14], [3, 11, 19], [12, 20, 38], [15, 33, 51], [19, 20, 32], [37, 50, 53], [6, 14, 50], [14, 15, 17], [55, 56, 81]];
  const masMetal = (a, b) => (periodoDe(a) === periodoDe(b) ? (grupoDe(a) < grupoDe(b) ? a : b) : (periodoDe(a) > periodoDe(b) ? a : b));
  function masMetalico(rng) {
    const trio = rng.barajar(rng.elegir(TRIOS_M)), m = trio.reduce(masMetal), menos = trio.find(z => trio.every(x => x === z || masMetal(x, z) === x));
    return { correcta: `El ${NOM[m]}`, _datos: { trio },
      enunciado: [`Tres elementos: ${trio.map(z => `${NOM[z]} (periodo ${periodoDe(z)}, grupo ${grupoDe(z)})`).join(', ')}.`], pregunta: ['¿Cuál tiene mayor carácter metálico?'],
      datos: ['Carácter metálico: qué tan fácil pierde electrones un elemento', D.escalera],
      errores: [err('QM-METAL-INVERSO', `El ${NOM[menos]}`, 'Comparar los tres es el camino. Pero el carácter metálico crece hacia abajo y a la izquierda, y ese es el menos metálico.'),
        ...trio.filter(z => z !== m && z !== menos).map(z => err('QM-METAL-MEDIO', `El ${NOM[z]}`, 'Bien descartar al menos metálico. Pero hay otro más abajo o más a la izquierda.')),
        err('QM-METAL-IGUAL', 'Los tres por igual', 'Son vecinos, cierto. Pero no pierden electrones con la misma facilidad.'),
        err('QM-SIN-LEY', 'No se puede saber sin probarlos', 'Dudar está bien. Pero su lugar en la tabla ya dice cuál pierde electrones con más facilidad.')],
      solucion: [[`El ${NOM[m]} está más abajo o más a la izquierda que los otros dos: pierde electrones con más facilidad.`]] };
  }
  const PERFILES = [['Brilla, conduce bien la corriente y se deja laminar.', 'Un metal'], ['No brilla, no conduce y se rompe en polvo al golpearlo.', 'Un no metal'],
    ['Brilla como un metal, pero conduce poco y se rompe al golpearlo.', 'Un semimetal'], ['Es un gas que casi no reacciona con nada.', 'Un gas noble']];
  function propiedades(rng) {
    const [desc, c] = rng.elegir(PERFILES);
    const EX = { 'Un metal': ['QM-CLASE-METAL', 'Bien fijarse en una propiedad. Pero un metal brilla, conduce y se lamina, todo a la vez.'], 'Un no metal': ['QM-CLASE-NO-METAL', 'Bien fijarse en una propiedad. Pero un no metal no brilla ni conduce.'],
      'Un semimetal': ['QM-DOS-CLASES', 'Bien ver que no es del todo metal. Pero un semimetal brilla y conduce un poco.'], 'Un gas noble': ['QM-CLASE-GAS', 'Bien pensar en cómo reacciona. Pero un gas noble es un gas que casi no reacciona.'],
      'Un metal de transición': ['QM-METAL-BRILLO', 'Bien ver que brilla. Pero brillar solo no basta: hay que mirar cómo conduce.'] };
    return { correcta: c, _datos: { perfil: c },
      enunciado: [`Un material puro, hecho de un solo elemento, se porta así: ${desc.charAt(0).toLowerCase()}${desc.slice(1)}`], pregunta: ['¿Qué clase de elemento es, lo más probable?'],
      datos: [D.metal, 'No metal: no brilla ni conduce; tiende a ganar electrones', 'Semimetal: propiedades intermedias entre metal y no metal'],
      errores: Object.keys(EX).filter(x => x !== c).map(x => err(EX[x][0], x, EX[x][1])),
      solucion: [[{ 'Un metal': 'Brillar, conducir y dejarse laminar, todo a la vez, es propio de un metal.', 'Un no metal': 'No brilla, no conduce y es quebradizo: es un no metal.', 'Un semimetal': 'Brilla, pero conduce poco y es quebradizo: tiene propiedades intermedias, las de un semimetal.', 'Un gas noble': 'Un gas que casi no reacciona es un gas noble.' }[c]]] };
  }
  const CONSTRUIR = { 'familia-z': familiaZ, 'periodo-z': periodoZ, debajo, 'largo-periodo': largoPeriodo, 'ubicar-rep': ubicarRep, 'z-lugar': zLugar, lewis, 'par-familia': parFamilia,
    'ubicar-d': ubicarD, bloque, anomalo, 'a-b': aB, clase: claseP, 'mas-metalico': masMetalico, propiedades };
  function generar(semilla, opciones = {}) {
    const rng = Azar.crear(`${ID}|${semilla}`);
    const idea = TIPOS_POR_IDEA[opciones.idea] ? opciones.idea : rng.elegir(IDEAS), tipo = rng.elegir(TIPOS_POR_IDEA[idea]);
    for (let intento = 0; intento < 500; intento++) {
      const p = cerrar(rng, semilla, tipo, CONSTRUIR[tipo](rng));
      if (p) return p;
    }
    throw new Error(`${ID}: no se pudo generar un problema de ${tipo}`);
  }
  return { id: ID, titulo: 'Dónde va cada elemento', generar, TIPOS_POR_IDEA, NIVEL, TIPOS: Object.keys(CONSTRUIR), confTxt, periodoDe, grupoDe };
});
