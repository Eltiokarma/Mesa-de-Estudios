/*
 * Generador «Radio, ionización y electronegatividad en la tabla» (propiedades-tabla), formato "predicciones"
 * (docs/arquitectura.md). Práctica por idea de quimica.propiedades-periodicas (docs/etapa5/propuesta-quimica.md §9):
 * reemplaza, para esta unidad, a los problemas de papel p6 a p9 de la escena atomo-y-tabla (que va a «Más mesas del tema»).
 * Funciona en el navegador (window.Generadores['propiedades-tabla']) y en Node (require). No usa la teoría: trae sus
 * propias tablas, las mismas de la unidad y con la misma fuente.
 *
 * Tipos por idea (TIPOS_POR_IDEA; nivel 1 un paso, 2 dos pasos, 3 de examen). generar(semilla, { idea }) da solo los de
 * esa idea; sin idea, las cuatro con el mismo peso.
 *   radio-atomico-ionico  radio-par (1; sub grupo o periodo) el mayor de dos · radio-orden (2) ordenar tres por su lugar ·
 *                         radio-z (3) X, Q y R dados por su Z, ordenar
 *   radio-ionico          ion-electrones (1) electrones de un ion · ion-atomo (1) el átomo o su ion · iso-par (2) el mayor de
 *                         dos isoelectrónicos · iso-orden (3) cuatro isoelectrónicos de mayor a menor
 *   energia-ionizacion    ei-par (1; sub grupo o periodo) · ei-bajada (2) los pares que rompen la tendencia (Be–B, N–O,
 *                         Mg–Al, P–S, As–Se, Zn–Ga) · afinidad (2) quién libera más · sucesivas (3) el grupo por el salto
 *   electronegatividad    delta-en (1) ΔEN de un enlace · hacia-par (1) hacia quién se corre el par · en-orden (2) ordenar
 *                         tres · metalico (2) el más metálico de dos · tendencias (3; sub periodo o grupo) qué afirmación vale
 * Datos (con su fuente): radio calculado de Clementi y otros (1967), pm; radios iónicos de Shannon (1976), NC 6, pm;
 * energías de ionización del NIST, kJ/mol; afinidad electrónica de OpenStax Chemistry 2e §6.5, kJ/mol, negativa si se
 * libera; electronegatividad de Pauling (Allred, 1961). Colores (los de la unidad): Z naranja, radio turquesa, energía
 * carmín, electronegatividad violeta.
 * Errores: los de la teoría (TP4, TP7, TP8 y los QM-, hipótesis; docs/investigacion/atomo-enlace-ideas-erroneas.md). Cada
 * explicación empieza por lo que el alumno hizo bien. Respuesta: p.respuesta.valor es el texto de la alternativa correcta.
 * Cuentas comprobadas con un script aparte (casos.json, «verificacion») y con el recálculo de generador.test.js.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar, nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'propiedades-tabla', UNIDAD = 'quimica.propiedades-periodicas', FUENTE = 'docs/investigacion/atomo-enlace-ideas-erroneas.md';
  const VARS = { Z: { nombre: 'número atómico', color: 'o' }, r: { nombre: 'radio', color: 'i' }, EI: { nombre: 'energía', color: 'h' }, EN: { nombre: 'electronegatividad', color: 'f' } };
  const v = P.v;
  // ---- Datos (índice: símbolo) ----
  const EL = {};
  [['H', 'hidrógeno', 1, 1, 1, 53, 1312, 2.20], ['Li', 'litio', 3, 2, 1, 167, 520, 0.98], ['Be', 'berilio', 4, 2, 2, 112, 900, 1.57], ['B', 'boro', 5, 2, 13, 87, 801, 2.04],
    ['C', 'carbono', 6, 2, 14, 67, 1086, 2.55], ['N', 'nitrógeno', 7, 2, 15, 56, 1402, 3.04], ['O', 'oxígeno', 8, 2, 16, 48, 1314, 3.44], ['F', 'flúor', 9, 2, 17, 42, 1681, 3.98],
    ['Na', 'sodio', 11, 3, 1, 190, 496, 0.93], ['Mg', 'magnesio', 12, 3, 2, 145, 738, 1.31], ['Al', 'aluminio', 13, 3, 13, 118, 578, 1.61], ['Si', 'silicio', 14, 3, 14, 111, 787, 1.90],
    ['P', 'fósforo', 15, 3, 15, 98, 1012, 2.19], ['S', 'azufre', 16, 3, 16, 88, 1000, 2.58], ['Cl', 'cloro', 17, 3, 17, 79, 1251, 3.16], ['K', 'potasio', 19, 4, 1, 243, 419, 0.82],
    ['Ca', 'calcio', 20, 4, 2, 194, 590, 1.00], ['Zn', 'cinc', 30, 4, 12, 142, 906, 1.65], ['Ga', 'galio', 31, 4, 13, 136, 579, 1.81], ['Ge', 'germanio', 32, 4, 14, 125, 762, 2.01],
    ['As', 'arsénico', 33, 4, 15, 114, 944, 2.18], ['Se', 'selenio', 34, 4, 16, 103, 941, 2.55], ['Br', 'bromo', 35, 4, 17, 94, 1140, 2.96]]
    .forEach(([s, nombre, z, p, g, r, ei, en]) => { EL[s] = { s, nombre, z, p, g, r, ei, en }; });
  const ION = { 'Li⁺': [3, 1, 76], 'Na⁺': [11, 1, 102], 'K⁺': [19, 1, 138], 'Rb⁺': [37, 1, 152], 'Be²⁺': [4, 2, 45], 'Mg²⁺': [12, 2, 72], 'Ca²⁺': [20, 2, 100],
    'Sr²⁺': [38, 2, 118], 'Al³⁺': [13, 3, 53.5], 'F⁻': [9, -1, 133], 'Cl⁻': [17, -1, 181], 'Br⁻': [35, -1, 196], 'O²⁻': [8, -2, 140], 'S²⁻': [16, -2, 184], 'Se²⁻': [34, -2, 198] };
  const NOMBRE_Z = { 3: 'litio', 4: 'berilio', 8: 'oxígeno', 9: 'flúor', 11: 'sodio', 12: 'magnesio', 13: 'aluminio', 16: 'azufre', 17: 'cloro', 19: 'potasio', 20: 'calcio', 34: 'selenio', 35: 'bromo', 37: 'rubidio', 38: 'estroncio' };
  const SIMB_Z = { 3: 'Li', 4: 'Be', 8: 'O', 9: 'F', 11: 'Na', 12: 'Mg', 13: 'Al', 16: 'S', 17: 'Cl', 19: 'K', 20: 'Ca', 34: 'Se', 35: 'Br', 37: 'Rb', 38: 'Sr' };
  const SERIES = { 10: ['O²⁻', 'F⁻', 'Na⁺', 'Mg²⁺', 'Al³⁺'], 18: ['S²⁻', 'Cl⁻', 'K⁺', 'Ca²⁺'], 36: ['Se²⁻', 'Br⁻', 'Rb⁺', 'Sr²⁺'] };
  const AE = { H: -73, Li: -60, C: -122, O: -141, F: -328, Na: -53, P: -72, S: -200, Cl: -349, K: -48, Br: -325 };
  const SUCESIVAS = { Li: [520, 7298, 11815], Be: [900, 1757, 14849], B: [801, 2427, 3660, 25026], C: [1086, 2353, 4621, 6223, 37831], Na: [496, 4562, 6910],
    Mg: [738, 1451, 7733], Al: [578, 1817, 2745, 11577], Si: [787, 1577, 3232, 4356, 16091], K: [419, 3052, 4420], Ca: [590, 1145, 4912] };
  const ROM = { 1: 'IA', 2: 'IIA', 13: 'IIIA', 14: 'IVA', 15: 'VA', 16: 'VIA', 17: 'VIIA', 18: 'VIIIA' };
  const gTxt = g => `${g} (${ROM[g]})`;
  const lugarTxt = s => `${EL[s].nombre.replace(/^./, c => c.toUpperCase())} (${s}): periodo ${EL[s].p}, grupo ${gTxt(EL[s].g)}`;
  const elec = k => ION[k][0] - ION[k][1];
  const protTxt = ks => `Protones: ${ks.map(k => `${NOMBRE_Z[ION[k][0]]} ${ION[k][0]}`).join(', ')}`;
  const f2 = x => (Math.round(x * 100) / 100).toFixed(2).replace('.', ',');
  const neg = x => String(x).replace('-', '−');
  const D = {
    gases: 'Gases nobles: Z = 2, 10, 18 y 36', grupos: 'Grupos A: columnas 1, 2 y 13 a 18', carga: 'Carga de un ion = protones − electrones',
    ae: 'AE negativa: el átomo libera energía al ganar el electrón', delta: 'ΔEN = EN del mayor − EN del menor',
    sucesivas: 'Cada energía de ionización sucesiva arranca un electrón más', metal: 'Carácter metálico: qué tan fácil pierde electrones un elemento',
    en: 'EN: cuánto jala un átomo el par que comparte en un enlace',
  };
  // ---- Tipos ----
  const TIPOS_POR_IDEA = {
    'radio-atomico-ionico': ['radio-par', 'radio-orden', 'radio-z'],
    'radio-ionico': ['ion-electrones', 'ion-atomo', 'iso-par', 'iso-orden'],
    'energia-ionizacion': ['ei-par', 'ei-bajada', 'afinidad', 'sucesivas'],
    electronegatividad: ['delta-en', 'hacia-par', 'en-orden', 'metalico', 'tendencias'],
  };
  const IDEAS = Object.keys(TIPOS_POR_IDEA);
  const IDEA_DE = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map(t => [t, i])));
  const NIVEL = { 'radio-par': 1, 'radio-orden': 2, 'radio-z': 3, 'ion-electrones': 1, 'ion-atomo': 1, 'iso-par': 2, 'iso-orden': 3, 'ei-par': 1, 'ei-bajada': 2,
    afinidad: 2, sucesivas: 3, 'delta-en': 1, 'hacia-par': 1, 'en-orden': 2, metalico: 2, tendencias: 3 };
  const DOCUMENTADOS = { TP4: 'parcial', TP7: 'parcial', TP8: 'documentado' };
  const err = (id, texto, explicacion) => ({ id, clave: texto, texto, explicacion, respaldo: DOCUMENTADOS[id] || 'hipotesis', fuente: FUENTE });

  // Elige 3 o 4 errores con los que la correcta no queda como la alternativa «central» (se adivinaría sin resolver).
  const trozos = t => String(t).replace(/[()]/g, ' ').split(/[\s;,]+|(?=[+−\-·/>])|(?<=[+−\-·/>])/).filter(Boolean);
  const dist = (a, b) => { const A = trozos(a), B = trozos(b); let d = 0; for (let i = 0; i < Math.max(A.length, B.length); i++) if (A[i] !== B[i]) d++; return d; };
  function* combinaciones(l, k, i = 0, acc = []) { if (acc.length === k) { yield acc; return; } for (let j = i; j < l.length; j++) yield* combinaciones(l, k, j + 1, [...acc, l[j]]); }
  function elegir(rng, correcta, errores) {
    const vistos = new Set([correcta]), pool = [];
    for (const e of rng.barajar(errores)) if (!vistos.has(e.texto)) { vistos.add(e.texto); pool.push(e); }
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
  const mayorPor = (ss, k) => ss.slice().sort((a, b) => EL[b][k] - EL[a][k]);

  // ---- Idea 1: radio atómico ----
  const PARES_RG = [['Li', 'Na'], ['Na', 'K'], ['F', 'Cl'], ['Cl', 'Br'], ['Be', 'Ca'], ['B', 'Al'], ['C', 'Si'], ['O', 'S'], ['P', 'As'], ['Mg', 'Ca'], ['Al', 'Ga'], ['S', 'Se']];
  const PARES_RP = [['Na', 'Cl'], ['Mg', 'S'], ['Li', 'F'], ['Al', 'P'], ['K', 'Br'], ['C', 'O'], ['Ca', 'Ga'], ['Be', 'N'], ['Si', 'S'], ['Na', 'Al'], ['Ga', 'Se'], ['B', 'F']];
  // Tríos [pivote, el de abajo o el de la izquierda (mayor), el de la derecha o el de arriba (menor)]: la regla los ordena.
  const TRIOS = [['Na', 'K', 'Mg'], ['Li', 'Na', 'F'], ['C', 'Si', 'N'], ['Ca', 'K', 'Mg'], ['O', 'S', 'F'], ['Al', 'Ga', 'Si'], ['B', 'Al', 'C'], ['S', 'Se', 'Cl'],
    ['P', 'As', 'S'], ['Be', 'Mg', 'B'], ['Si', 'Ge', 'P'], ['N', 'P', 'O'], ['Mg', 'Ca', 'Al']];
  function radioPar(rng) {
    const sub = rng.elegir(['grupo', 'periodo']), [a, b] = rng.barajar(rng.elegir(sub === 'grupo' ? PARES_RG : PARES_RP)), [m, o] = mayorPor([a, b], 'r');
    const N = s => EL[s].nombre;
    return { correcta: `El de ${N(m)}`, _datos: { sub, a, b },
      enunciado: ['Compara dos átomos por su ', v('r', 'radio atómico'), '.'], pregunta: [`¿Cuál tiene mayor radio: el de ${N(a)} o el de ${N(b)}?`],
      datos: [lugarTxt(a), lugarTxt(b)],
      errores: [
        err(sub === 'grupo' ? 'QM-RADIO-GRUPO' : 'TP4', `El de ${N(o)}`, sub === 'grupo' ? `Mirar su columna está bien, pero el ${N(m)}, más abajo, tiene un nivel más de electrones, así que es el mayor.` : `El ${N(o)} tiene más electrones, pero van al mismo nivel, y su núcleo, con más protones, los jala más cerca.`),
        err('QM-RADIO-NIVEL', 'Miden lo mismo', sub === 'grupo' ? 'Ver la familia está bien, pero no los iguala: el de abajo tiene un nivel más de electrones, más lejos del núcleo, así que es mayor.' : 'Ver los niveles está bien, pero el de la derecha tiene más protones, que jalan esos niveles más cerca, así que es menor.'),
        err('QM-SIN-LEY', 'No se puede saber sin medirlos', 'Dudar de una regla está bien, pero el radio sigue una tendencia, y su lugar en la tabla ya dice cuál es mayor.'),
        err('QM-RADIO-Z', 'El de mayor número atómico', 'Mirar el núcleo está bien, pero en un periodo el mayor es el de menos protones, porque los dos tienen los mismos niveles.'),
      ].filter(e => !(sub === 'grupo' && e.id === 'QM-RADIO-Z')),
      solucion: [[sub === 'grupo' ? `Están en la misma columna, y el ${N(m)}, más abajo, tiene un nivel más de electrones: es el mayor.` : `Están en el mismo periodo, y el ${N(o)}, a la derecha, tiene más protones que jalan el mismo nivel: es el menor.`],
        [`${m}: `, v('r', `${EL[m].r} pm`), `; ${o}: `, v('r', `${EL[o].r} pm`), '.']] };
  }
  const ordenes = ([p, gr, ch], s = x => x) => { const t = l => l.map(s).join(' > '); return { bien: t([gr, p, ch]), inversa: t([ch, p, gr]), grupo: t([p, gr, ch]), periodo: t([gr, ch, p]), medio: t([p, ch, gr]) }; };
  // Lo que acierta y lo que falla cada orden equivocado del radio. En casi todos los tríos, el mayor está debajo del pivote
  // y el menor, a su derecha; en [Ca, K, Mg], el mayor (K) está a su izquierda y el menor (Mg), encima: ahí el paso que
  // cada orden acierta es el otro, y la explicación se dice al revés (verificador, 27 nov).
  const pasosRadio = ([p, gr]) => (EL[gr].g === EL[p].g ? {
    grupo: 'El paso del periodo está bien, pero en un grupo el de abajo tiene un nivel más de electrones, así que es el mayor.',
    periodo: 'El paso del grupo está bien, pero en un periodo más protones jalan el mismo nivel, así que el de la derecha es menor.',
    medio: 'Dejar al de la derecha detrás del otro de su fila está bien, pero el de abajo, con un nivel más, es el mayor de los tres y va primero.',
  } : {
    grupo: 'El paso del grupo está bien, pero en un periodo el de la izquierda tiene menos protones para el mismo nivel, así que es mayor.',
    periodo: 'El paso del periodo está bien, pero en un grupo el de abajo tiene un nivel más de electrones, así que es mayor que el de arriba.',
    medio: 'Dejar al de arriba detrás del otro de su columna está bien, pero el de la izquierda, con menos protones, es el mayor de los tres y va primero.',
  });
  function radioOrden(rng) {
    const trio = rng.elegir(TRIOS), o = ordenes(trio), lista = rng.barajar(trio), pr = pasosRadio(trio);
    return { correcta: o.bien, _datos: { trio },
      enunciado: ['Los tres átomos son de los grupos A.'], pregunta: ['Ordénalos de mayor a menor ', v('r', 'radio atómico'), `: ${lista.join(', ')}.`],
      datos: lista.map(lugarTxt),
      errores: [err('QM-RADIO-INVERSO', o.inversa, 'Ordenarlos por su lugar está bien, pero el radio crece hacia abajo y hacia la izquierda, así que el orden va al revés.'),
        err('QM-RADIO-GRUPO', o.grupo, pr.grupo),
        err('TP4', o.periodo, pr.periodo),
        err('QM-RADIO-MITAD', o.medio, pr.medio)],
      solucion: [['En una columna, el de abajo es el mayor porque tiene un nivel más; en una fila, el de la derecha es el menor porque tiene más protones.'], [v('r', o.bien), ` (${trio.map(s => `${s} ${EL[s].r}`).join(', ')} pm).`]] };
  }
  function radioZ(rng) {
    const trio = rng.elegir(TRIOS), L = Object.fromEntries(rng.barajar(['X', 'Q', 'R']).map((x, i) => [trio[i], x])), s = x => L[x], o = ordenes(trio, s), lista = rng.barajar(trio), pr = pasosRadio(trio);
    return { correcta: o.bien, _datos: { trio, letras: trio.map(s) },
      enunciado: ['Los elementos ',
        ...lista.flatMap((x, i) => [i ? (i === 2 ? ' y ' : ', ') : '', `${L[x]} (`, v('Z', `Z = ${EL[x].z}`), ')']), ' son de los grupos A.'],
      pregunta: ['¿Cuál es el orden de sus ', v('r', 'radios atómicos'), ', de mayor a menor?'],
      datos: [D.gases, D.grupos],
      errores: [err('QM-RADIO-INVERSO', o.inversa, 'Ubicarlos está bien, pero el radio crece hacia abajo y hacia la izquierda, así que el orden va al revés.'),
        err('QM-RADIO-GRUPO', o.grupo, pr.grupo),
        err('TP4', o.periodo, pr.periodo),
        err('QM-RADIO-Z', [...trio].sort((a, b) => EL[b].z - EL[a].z).map(s).join(' > '), 'Ubicarlos está bien, pero el radio no crece con Z: en un periodo baja, porque más protones jalan el mismo nivel.'),
        err('QM-RADIO-MITAD', o.medio, pr.medio)],
      solucion: [['Los ubico contando desde los gases nobles: ', trio.map(x => `${L[x]} = ${x} (periodo ${EL[x].p}, grupo ${EL[x].g})`).join('; '), '.'],
        ['En una columna, el de abajo es mayor; en una fila, el de la derecha es menor: ', v('r', o.bien), '.']] };
  }

  // ---- Idea 2: radio de iones e isoelectrónicos ----
  const IONES_SUELTOS = Object.keys(ION).filter(k => NOMBRE_Z[ION[k][0]]);
  function ionElectrones(rng) {
    const k = rng.elegir(IONES_SUELTOS), [z, q] = ION[k], e = z - q;
    const errores = [err('QM-ION-SIGNO', `${z + q}`, q > 0 ? 'Partir de los protones está bien, pero un catión perdió electrones, así que la carga se resta.' : 'Partir de los protones está bien, pero un anión ganó electrones, así que la carga se suma.'),
      err('QM-ION-PROTONES', `${z}`, 'Ese es su número de protones, bien contado, pero el ion ya no tiene la misma cantidad de electrones que protones.'),
      err('QM-ION-UNO', `${q > 0 ? z - 1 : z + 1}`, 'El sentido de la carga está bien, pero la carga dice cuántos electrones cambiaron, y aquí son más de uno.'),
      err('QM-ION-DOBLE', `${q > 0 ? z - 2 * q : z - 2 * q}`, 'Cambiar los electrones está bien, pero cambian solo tantos como dice la carga, una sola vez.')];
    return { correcta: `${e}`, _datos: { ion: k },
      enunciado: [`El ${NOMBRE_Z[z]} tiene `, v('Z', `Z = ${z}`), `. Forma el ion ${k}.`], pregunta: [`¿Cuántos electrones tiene el ion ${k}?`],
      datos: [D.carga, `${NOMBRE_Z[z].replace(/^./, c => c.toUpperCase())}: ${z} protones`],
      errores: errores.filter(x => +x.texto >= 0),
      solucion: [[q > 0 ? `El ion perdió ${q} ${q === 1 ? 'electrón' : 'electrones'}: ${z} − ${q} = ${e} electrones.` : `El ion ganó ${-q} ${q === -1 ? 'electrón' : 'electrones'}: ${z} + ${-q} = ${e} electrones.`]] };
  }
  function ionAtomo(rng) {
    const k = rng.elegir(IONES_SUELTOS), [z, q] = ION[k], an = q < 0, N = NOMBRE_Z[z];
    return { correcta: an ? `El ion ${k}` : `El átomo de ${N}`, _datos: { ion: k },
      enunciado: [`El ${N} (`, v('Z', `Z = ${z}`), `) forma el ion ${k}.`], pregunta: ['¿Qué es más grande: el átomo de ', N, ` o el ion ${k}?`],
      datos: [D.carga, `El ion ${k} tiene ${z - q} electrones`],
      errores: [err('QM-ION-RADIO', an ? `El átomo de ${N}` : `El ion ${k}`, an ? 'Pensar en los electrones está bien, pero el anión los ganó: se repelen más y la nube crece.' : 'Pensar en los electrones está bien, pero el catión los perdió, y el mismo núcleo jala más fuerte a los que quedan.'),
        err('QM-ION-IGUAL', 'Miden lo mismo: tienen el mismo núcleo', 'El núcleo es el mismo, pero el ion tiene otro número de electrones, y eso cambia su tamaño.'),
        err('QM-SIN-LEY', 'No se puede saber sin la tabla de radios', 'Dudar está bien, pero no hace falta la tabla: el núcleo es el mismo, así que basta contar los electrones.'),
        err('QM-ION-CARGA', 'El que tiene carga, siempre', 'Notar la carga está bien, pero un catión se achica y un anión crece: depende del signo de la carga.')],
      solucion: [[an ? `Ganó ${-q === 1 ? 'un electrón' : `${-q} electrones`}: los mismos ${z} protones tienen más electrones, que se repelen, y la nube crece.` : `Perdió ${q === 1 ? 'un electrón' : `${q} electrones`}: los mismos ${z} protones jalan a menos electrones, y el ion se achica.`]] };
  }
  const porRadioIon = ks => ks.slice().sort((a, b) => ION[b][2] - ION[a][2]);
  function isoPar(rng) {
    const n = rng.elegir(['10', '18', '36']), [a, b] = rng.barajar(SERIES[n].slice(0, 4)).slice(0, 2), [m, o] = porRadioIon([a, b]);
    return { correcta: `El ${m}`, _datos: { n: +n, a, b },
      enunciado: [`El ${a} y el ${b} tienen ${n} electrones cada uno.`], pregunta: ['¿Cuál tiene mayor ', v('r', 'radio'), '?'],
      datos: [protTxt([a, b])],
      errores: [err('QM-ISO-ORDEN', `El ${o}`, `Tiene más protones, pero justamente por eso jala más fuerte a los mismos ${n} electrones y es menor.`),
        err('QM-ISO-RADIO', 'Miden lo mismo: tienen los mismos electrones', 'Tienen los mismos electrones, pero no los mismos protones, así que sus núcleos no los jalan igual.'),
        err('QM-SIN-LEY', 'No se puede saber sin la tabla de radios', 'Dudar está bien, pero no hace falta la tabla: como los electrones son los mismos, basta comparar sus protones.')],
      solucion: [[`Los dos tienen ${n} electrones, pero el ${m} tiene menos protones (${ION[m][0]} contra ${ION[o][0]}): los jala menos y es más grande.`],
        [`${m} `, v('r', `${P.formatear(ION[m][2], 1)} pm`), ` > ${o} `, v('r', `${P.formatear(ION[o][2], 1)} pm`), '.']] };
  }
  function isoOrden(rng) {
    const n = rng.elegir(['10', '18', '36']), cuatro = SERIES[n].slice(0, 4), lista = rng.barajar(cuatro), bien = porRadioIon(cuatro), t = l => l.join(' > ');
        return { correcta: t(bien), _datos: { n: +n, lista },
      enunciado: [`El ${lista.slice(0, 3).join(', el ')} y el ${lista[3]} tienen ${n} electrones cada uno.`], pregunta: ['Ordénalos de mayor a menor ', v('r', 'radio'), '.'],
      datos: [protTxt(lista), D.carga],
      errores: [err('QM-ISO-ORDEN', t(bien.slice().reverse()), 'Ordenar por los protones está bien, pero más protones jalan más fuerte, así que el de más protones es el menor.'),
        err('QM-ION-RADIO', t([bien[2], bien[3], bien[0], bien[1]]), 'Cada pareja está bien ordenada, pero los cationes, que tienen más protones para los mismos electrones, son los menores.'),
        err('QM-ISO-PARES', t([bien[1], bien[0], bien[3], bien[2]]), 'Los aniones van antes que los cationes, bien, pero dentro de cada pareja, el de más protones tiene el menor radio.'),
        err('QM-ISO-MEDIO', t([bien[1], bien[0], bien[2], bien[3]]), 'Los dos menores están bien, pero entre los aniones, el de menos protones jala menos los mismos electrones, así que es el mayor.'),
        err('QM-ISO-CATION', t([bien[0], bien[1], bien[3], bien[2]]), 'Los dos mayores están bien, pero entre los cationes, el de más protones jala más los mismos electrones, así que es el menor.')],
      solucion: [['Como los cuatro tienen los mismos electrones, el radio baja cuando suben los protones.'], [cuatro.map(k => `${k}: ${ION[k][0]} p⁺`).join('; '), '.'], [v('r', t(bien)), '.']] };
  }

  // ---- Idea 3: energía de ionización y afinidad ----
  const PARES_EG = [['Li', 'Na'], ['Na', 'K'], ['F', 'Cl'], ['Cl', 'Br'], ['Be', 'Mg'], ['Mg', 'Ca'], ['O', 'S'], ['N', 'P'], ['C', 'Si'], ['S', 'Se']];
  const PARES_EP = [['Na', 'Cl'], ['Li', 'F'], ['C', 'N'], ['Si', 'S'], ['C', 'O'], ['Al', 'P'], ['K', 'Br'], ['Na', 'Mg'], ['Ca', 'Ge'], ['B', 'C']];
  const PARES_BAJ = [['Be', 'B'], ['N', 'O'], ['Mg', 'Al'], ['P', 'S'], ['As', 'Se'], ['Zn', 'Ga']];
  const CONF = { Be: '1s² 2s²', B: '1s² 2s² 2p¹', N: '1s² 2s² 2p³', O: '1s² 2s² 2p⁴', Mg: '[Ne] 3s²', Al: '[Ne] 3s² 3p¹', P: '[Ne] 3s² 3p³', S: '[Ne] 3s² 3p⁴',
    As: '[Ar] 4s² 3d¹⁰ 4p³', Se: '[Ar] 4s² 3d¹⁰ 4p⁴', Zn: '[Ar] 4s² 3d¹⁰', Ga: '[Ar] 4s² 3d¹⁰ 4p¹' };
  function eiPar(rng) {
    const sub = rng.elegir(['grupo', 'periodo']), [a, b] = rng.barajar(rng.elegir(sub === 'grupo' ? PARES_EG : PARES_EP)), [m, o] = mayorPor([a, b], 'ei'), N = s => EL[s].nombre;
    return { correcta: `Al ${N(m)}`, _datos: { sub, a, b },
      enunciado: ['Compara lo que cuesta quitarle un electrón a cada átomo: su ', v('EI', 'energía de ionización'), '.'], pregunta: [`¿A cuál le cuesta más: al ${N(a)} o al ${N(b)}?`],
      datos: [lugarTxt(a), lugarTxt(b)],
      errores: [err(sub === 'grupo' ? 'QM-EI-GRUPO' : 'QM-EI-INVERSA', `Al ${N(o)}`, sub === 'grupo' ? 'Mirar su columna está bien, pero el de abajo tiene su electrón de afuera más lejos del núcleo, y sale más fácil.' : 'Mirar su fila está bien, pero hacia la derecha hay más protones, que retienen el electrón con más fuerza.'),
        err('TP7', 'A los dos por igual', 'Ver que son vecinos está bien, pero no tienen la misma carga nuclear ni el electrón de afuera a la misma distancia, así que su EI es distinta.'),
        err('QM-SIN-LEY', 'No se puede saber sin medirlo', 'Dudar está bien, pero la EI sigue una tendencia, y su lugar en la tabla ya dice a cuál le cuesta más.'),
        err('QM-EI-ELECTRONES', 'Al que tiene más electrones, sea cual sea su lugar', 'Pensar en los electrones está bien, pero lo que decide es qué tan cerca del núcleo y qué tan jalado está el de afuera.')],
      solucion: [[sub === 'grupo' ? `El ${N(m)} está más arriba, así que su último electrón está más cerca del núcleo y cuesta más.` : `El ${N(m)} está más a la derecha, así que más protones jalan el mismo nivel y cuesta más.`],
        [`${m}: `, v('EI', `${EL[m].ei} kJ/mol`), `; ${o}: `, v('EI', `${EL[o].ei} kJ/mol`), '.']] };
  }
  function eiBajada(rng) {
    const [a, b] = rng.elegir(PARES_BAJ), estrena = ['B', 'Al', 'Ga'].includes(b), N = s => EL[s].nombre;
    return { correcta: `Al ${N(a)}`, _datos: { a, b },
      enunciado: [`El ${N(b)} está a la derecha del ${N(a)}, en el periodo ${EL[a].p}.`], pregunta: ['¿A cuál le cuesta más perder un electrón? Es decir, ¿cuál tiene mayor ', v('EI', 'energía de ionización'), '?'],
      datos: [`${EL[a].nombre.replace(/^./, c => c.toUpperCase())}: ${CONF[a]}; ${N(b)}: ${CONF[b]}`],
      errores: [err('QM-FLECHA', `Al ${N(b)}, porque está más a la derecha`, 'Usar la tendencia está bien, pero aquí se rompe: el de la derecha pierde un electrón p nuevo o uno que comparte orbital, y ese sale más fácil.'),
        err('QM-EI-PROTONES', `Al ${N(b)}, porque tiene un protón más`, 'Contar protones está bien, pero aquí pesa más otra cosa: su último electrón está algo más lejos o comparte orbital, y sale más fácil.'),
        err('TP7', 'A los dos por igual: son del mismo periodo', 'Ver que comparten periodo está bien, pero su último electrón no está en la misma situación, así que su EI no puede ser la misma.'),
        err('QM-SIN-LEY', 'No se puede saber sin medirlo', 'Dudar de la tendencia está bien, pero la configuración ya dice qué electrón sale y cuál cuesta más.')],
      solucion: [[estrena ? `El ${N(b)} pierde su único electrón p, que está algo más lejos del núcleo y sale más fácil.` : `En el ${N(b)} sale un electrón p que comparte orbital con otro: se repelen y sale más fácil.`],
        [`${a}: `, v('EI', `${EL[a].ei} kJ/mol`), `; ${b}: `, v('EI', `${EL[b].ei} kJ/mol`), '.']] };
  }
  const PARES_AE = [['Cl', 'Na'], ['F', 'Li'], ['S', 'Na'], ['Br', 'K'], ['O', 'Li'], ['Cl', 'F'], ['C', 'Li'], ['S', 'P'], ['O', 'H'], ['Br', 'S']];
  function afinidad(rng) {
    const [a, b] = rng.barajar(rng.elegir(PARES_AE)), m = AE[a] < AE[b] ? a : b, o = m === a ? b : a, N = s => EL[s].nombre;
    return { correcta: `El de ${N(m)}`, _datos: { a, b },
      enunciado: ['Al ganar un electrón, un átomo gaseoso libera o gasta energía: su ', v('EI', 'afinidad electrónica'), ', AE.'],
      pregunta: [`¿Cuál libera más energía al ganar un electrón: un átomo de ${N(a)} o uno de ${N(b)}?`],
      datos: [`AE: ${N(a)} ${neg(AE[a])} kJ/mol; ${N(b)} ${neg(AE[b])} kJ/mol`, D.ae],
      errores: [err('QM-AE-ORDEN', `El de ${N(o)}`, 'Leíste bien las dos, pero libera más el átomo cuya AE tiene el mayor valor sin el signo.'),
        err('QM-AE-COSTO', 'Ninguno: ganar un electrón siempre cuesta energía', 'Lo que siempre cuesta es perder un electrón. Aquí las dos AE son negativas, así que los dos liberan energía.'),
        err('QM-AE-IGUAL', 'Los dos liberan lo mismo', 'Ver que los dos liberan energía está bien, pero no liberan lo mismo: el de mayor valor sin el signo libera más.'),
        err('QM-EI-AFINIDAD', 'El que tenga mayor energía de ionización', 'Buscar al que retiene más está bien, pero la ionización es otro proceso: aquí el átomo gana un electrón.')],
      solucion: [['Las dos AE son negativas, así que los dos átomos liberan energía.'], [`Libera más el ${N(m)}: |${neg(AE[m])}| > |${neg(AE[o])}|.`]] };
  }
  const salto = e => { const c = e.slice(1).map((x, i) => x / e[i]); return c.indexOf(Math.max(...c)) + 1; };
  const gdeK = k => (k <= 2 ? k : k + 10);
  const miles = x => P.formatear(x, 0);
  function sucesivas(rng) {
    const s = rng.elegir(Object.keys(SUCESIVAS)), e = SUCESIVAS[s], k = salto(e), g = gdeK(k);
    const malos = [[k + 1, 'QM-SALTO-DESPUES', 'El salto está bien ubicado, pero el electrón del salto ya sale de un nivel de adentro y no es de valencia.'],
      [k - 1, 'QM-SALTO-ANTES', 'Buscar el salto está bien, pero hay que contar todos los electrones que salen antes de él: el último también es de valencia.'],
      [e.length, 'QM-SALTO-TOTAL', 'Ese número cuenta los datos de la lista. El grupo no sale de ahí, sino de cuántos electrones salen antes del salto.']].filter(([x]) => x >= 1 && x <= 8 && gdeK(x) !== g);
    return { correcta: `Grupo ${gTxt(g)}`, _datos: { elemento: s },
      enunciado: [`Un elemento X de los grupos A, del periodo ${EL[s].p}, tiene estas `, v('EI', 'energías de ionización sucesivas'), `, en kJ/mol: ${e.map(miles).join('; ')}.`],
      pregunta: ['¿En qué grupo está X?'], datos: [D.sucesivas, D.grupos],
      errores: [...malos.map(([x, id, ex]) => err(id, `Grupo ${gTxt(gdeK(x))}`, ex)),
        err('QM-SALTO-NOBLE', 'Grupo 18 (VIIIA)', 'Pensar en quién retiene sus electrones está bien, pero un gas noble pide mucho desde el primero, y aquí los primeros salen con poca energía.'),
        ...(k <= 2 ? [err('QM-SALTO-B', `Grupo ${k + 10} (${k === 1 ? 'IB' : 'IIB'})`, 'Contar los electrones antes del salto está bien, pero en los grupos A, a los grupos 1 y 2 no se les suma 10.')] : [])]
        .filter(x => x.texto !== `Grupo ${gTxt(g)}`),
      solucion: [[`Divido cada energía entre la anterior: el cociente mayor está entre la ${k}.ª y la ${k + 1}.ª.`],
        [`Antes del salto salen ${k} ${k === 1 ? 'electrón' : 'electrones'} de valencia: `, v('EI', `grupo ${gTxt(g)}`), `. Es el ${EL[s].nombre}.`]] };
  }

  // ---- Idea 4: electronegatividad y carácter metálico ----
  const PARES_EN = [['H', 'O'], ['C', 'N'], ['H', 'F'], ['Na', 'O'], ['C', 'S'], ['Si', 'O'], ['H', 'S'], ['K', 'Br'], ['P', 'F'], ['Mg', 'Cl'], ['B', 'N'], ['Al', 'F'], ['C', 'F'], ['H', 'C'], ['Na', 'Cl'], ['Li', 'F']];
  function deltaEN(rng) {
    const [a, b] = rng.barajar(rng.elegir(PARES_EN)), [m, o] = mayorPor([a, b], 'en'), d = EL[m].en - EL[o].en;
    return { correcta: f2(d), _datos: { a, b },
      enunciado: [`En el enlace ${a}–${b}, cada átomo jala el par compartido según su `, v('EN', 'electronegatividad'), '.'], pregunta: ['¿Cuánto vale ', v('EN', 'ΔEN'), '?'],
      datos: [`EN: ${a} ${f2(EL[a].en)}; ${b} ${f2(EL[b].en)}`, D.delta],
      errores: [err('QM-EN-SUMA', f2(EL[a].en + EL[b].en), 'Usar los dos valores está bien, pero ΔEN es una diferencia: al mayor se le resta el menor.'),
        err('QM-EN-SOLO', f2(EL[m].en), 'Elegir al que jala más está bien, pero ΔEN compara a los dos átomos: falta restarle el valor del otro.'),
        err('QM-EN-MITAD', f2(d / 2), 'La resta está bien, pero después no se divide entre 2: ΔEN es la diferencia entera.'),
        err('QM-EN-PROMEDIO', f2((EL[a].en + EL[b].en) / 2), 'Usar los dos valores está bien, pero ΔEN es la diferencia entre ellos, no su promedio.')],
      solucion: [['ΔEN = ', v('EN', f2(EL[m].en)), ' − ', v('EN', f2(EL[o].en)), ' = ', v('EN', f2(d)), '.']] };
  }
  function haciaPar(rng) {
    const [a, b] = rng.barajar(rng.elegir(PARES_EN)), [m, o] = mayorPor([a, b], 'en');
    return { correcta: `Hacia el ${m}`, _datos: { a, b },
      enunciado: [`En el enlace ${a}–${b} hay un par de electrones compartido.`], pregunta: ['¿Hacia qué átomo se corre el par?'],
      datos: [`EN: ${a} ${f2(EL[a].en)}; ${b} ${f2(EL[b].en)}`, D.en],
      errores: [err('QM-EN-ORDEN', `Hacia el ${o}`, 'Mirar los dos valores está bien, pero el par va hacia el que jala más, que es el de mayor EN.'),
        err('QM-EN-MEDIO', 'Queda justo en el medio', 'Pensar en el par compartido está bien, pero solo queda en el medio si los dos átomos jalan igual.'),
        err('QM-EN-RADIO', 'Hacia el átomo más grande', 'Pensar en los átomos está bien, pero el tamaño no decide: decide cuál tiene mayor electronegatividad.'),
        err('TP8', 'Hacia el que ya tiene carga negativa', 'Pensar en cargas está bien, pero los dos átomos son neutros: la carga parcial δ− aparece por el enlace.')],
      solucion: [[`El ${m} jala más: su electronegatividad es `, v('EN', f2(EL[m].en)), ', contra ', v('EN', f2(EL[o].en)), '. Por eso el par se corre hacia él.']] };
  }
  // Tríos [pivote, el de la derecha o el de arriba (mayor EN), el de abajo o el de la izquierda (menor)].
  const TRIOS_EN = [['C', 'N', 'Si'], ['O', 'F', 'S'], ['Mg', 'Al', 'Ca'], ['S', 'Cl', 'Se'], ['Li', 'Be', 'Na'], ['B', 'C', 'Al'], ['Na', 'Mg', 'K'], ['N', 'O', 'P']];
  function enOrden(rng) {
    const trio = rng.elegir(TRIOS_EN), o = ordenes(trio), lista = rng.barajar(trio), N = s => EL[s].nombre;
    return { correcta: o.bien, _datos: { trio },
      enunciado: ['Los tres elementos son de los grupos A.'], pregunta: ['Ordénalos de mayor a menor ', v('EN', 'electronegatividad'), `: ${lista.map(N).join(', ')}.`],
      datos: [...lista.map(lugarTxt), D.en],
      errores: [err('QM-EN-INVERSA', o.inversa, 'Ordenarlos por su lugar está bien, pero la electronegatividad crece hacia arriba y a la derecha, así que va al revés.'),
        err('QM-EN-PERIODO', o.grupo, 'El paso del grupo está bien, pero en un periodo el átomo de la derecha jala más el par, porque tiene más protones para el mismo nivel.'),
        err('QM-EN-GRUPO', o.periodo, 'El paso del periodo está bien, pero en un grupo el átomo de arriba jala más el par, porque lo tiene más cerca del núcleo.'),
        err('QM-EN-MITAD', o.medio, 'Dejar al de abajo detrás del otro de su columna está bien, pero el de la derecha, con más protones, jala más el par y va primero.')],
      solucion: [['En una fila, el de la derecha jala más porque tiene más protones; en una columna, el de abajo jala menos porque el par le queda más lejos.'], [v('EN', o.bien), ` (${trio.map(s => `${s} ${f2(EL[s].en)}`).join('; ')}).`]] };
  }
  // Sin el par Ca–Ga: el Ga tiene menor EI (579) que el Ca (590), y la definición de los datos es «qué tan fácil pierde electrones».
  const PARES_M = [['Li', 'Na'], ['Na', 'K'], ['Na', 'Cl'], ['Mg', 'S'], ['Be', 'Ca'], ['Al', 'P'], ['K', 'Br'], ['Ca', 'Br'], ['Si', 'Ge'], ['Li', 'F'], ['B', 'Al'], ['C', 'Si']];
  function metalico(rng) {
    const [a, b] = rng.barajar(rng.elegir(PARES_M)), A = EL[a], B = EL[b], m = A.p === B.p ? (A.g < B.g ? a : b) : (A.p > B.p ? a : b), o = m === a ? b : a, N = s => EL[s].nombre;
    return { correcta: `El ${N(m)}`, _datos: { a, b },
      enunciado: ['Compara el carácter metálico de dos elementos.'], pregunta: [`¿Cuál es más metálico: el ${N(a)} o el ${N(b)}?`],
      datos: [lugarTxt(a), lugarTxt(b), D.metal],
      errores: [err('QM-METAL-INVERSO', `El ${N(o)}`, 'Mirar su lugar está bien, pero el carácter metálico crece hacia abajo y a la izquierda, donde el electrón de afuera está más lejos o menos jalado.'),
        err('QM-METAL-IGUAL', 'Los dos por igual', 'Ver que son vecinos está bien, pero uno suelta su electrón de afuera más fácil que el otro, así que no son igual de metálicos.'),
        err('QM-SIN-LEY', 'No se puede saber sin probarlos', 'Dudar está bien, pero el carácter metálico sigue una tendencia, y su lugar en la tabla ya lo dice.'),
        err('QM-METAL-EN', 'El de mayor electronegatividad', 'Relacionar las dos está bien, pero van al revés: el que jala más los electrones es el menos metálico.')],
      solucion: [[`El ${N(m)} está más ${A.p === B.p ? 'a la izquierda' : 'abajo'}, así que pierde electrones con más facilidad y es más metálico.`]] };
  }
  function tendencias(rng) {
    const sub = rng.elegir(['periodo', 'grupo']);
    if (sub === 'periodo') {
      const [a, b] = rng.elegir([['Na', 'Cl'], ['Li', 'F'], ['K', 'Br']]), N = s => EL[s].nombre;
      return { correcta: 'El radio baja y la electronegatividad sube', _datos: { sub, a, b },
        enunciado: [`Recorre el periodo ${EL[a].p} de izquierda a derecha, del ${N(a)} (grupo 1) al ${N(b)} (grupo 17).`], pregunta: ['¿Qué afirmación es correcta?'],
        datos: [lugarTxt(a), lugarTxt(b)],
        errores: [err('QM-RADIO-INVERSO', 'El radio sube y la electronegatividad sube', 'La electronegatividad está bien, pero el radio baja, porque más protones jalan el mismo nivel.'),
          err('QM-EN-INVERSA', 'El radio baja y la electronegatividad baja', 'El radio está bien, pero la electronegatividad sube hacia la derecha, porque más protones jalan más el par.'),
          err('QM-METAL-INVERSO', 'El carácter metálico sube', 'Mirar la fila está bien, pero los más metálicos están a la izquierda, así que hacia la derecha el carácter metálico baja.'),
          err('QM-EI-INVERSA', 'La energía de ionización baja', 'Mirar la fila está bien, pero hacia la derecha cuesta más arrancar un electrón, así que la EI sube.')],
        solucion: [['Hacia la derecha, más protones jalan el mismo nivel, así que el radio y el carácter metálico bajan, mientras la EI y la EN suben.'],
          [`${a} `, v('r', `${EL[a].r} pm`), ` → ${b} `, v('r', `${EL[b].r} pm`), SEP, `${a} `, v('EN', f2(EL[a].en)), ` → ${b} `, v('EN', f2(EL[b].en))]] };
    }
    const [a, b] = rng.elegir([['Li', 'K'], ['F', 'Br'], ['Be', 'Ca'], ['O', 'Se']]), N = s => EL[s].nombre;
    return { correcta: 'El radio sube y la energía de ionización baja', _datos: { sub, a, b },
      enunciado: [`Baja por el grupo ${gTxt(EL[a].g)}, del ${N(a)} (periodo ${EL[a].p}) al ${N(b)} (periodo ${EL[b].p}).`], pregunta: ['¿Qué afirmación es correcta?'],
      datos: [lugarTxt(a), lugarTxt(b)],
      errores: [err('QM-RADIO-GRUPO', 'El radio baja y la energía de ionización baja', 'La energía de ionización está bien, pero el radio crece, porque cada fila suma un nivel.'),
        err('QM-EI-GRUPO', 'El radio sube y la energía de ionización sube', 'El radio está bien, pero el electrón de afuera queda más lejos del núcleo, así que arrancarlo cuesta menos.'),
        err('QM-EN-GRUPO', 'La electronegatividad sube', 'Mirar la columna está bien, pero hacia abajo el par queda más lejos del núcleo, así que el átomo lo jala menos.'),
        err('QM-METAL-INVERSO', 'El carácter metálico baja', 'Mirar la columna está bien, pero hacia abajo los átomos pierden electrones más fácil, así que el carácter metálico sube.')],
      solucion: [['Hacia abajo, cada fila suma un nivel, así que el radio y el carácter metálico suben, mientras la EI y la EN bajan.'],
        [`${a} `, v('r', `${EL[a].r} pm`), ` → ${b} `, v('r', `${EL[b].r} pm`), SEP, `${a} `, v('EI', `${EL[a].ei} kJ/mol`), ` → ${b} `, v('EI', `${EL[b].ei} kJ/mol`)]] };
  }
  const SEP = '   ·   ';

  const CONSTRUIR = { 'radio-par': radioPar, 'radio-orden': radioOrden, 'radio-z': radioZ, 'ion-electrones': ionElectrones, 'ion-atomo': ionAtomo, 'iso-par': isoPar,
    'iso-orden': isoOrden, 'ei-par': eiPar, 'ei-bajada': eiBajada, afinidad, sucesivas, 'delta-en': deltaEN, 'hacia-par': haciaPar, 'en-orden': enOrden, metalico, tendencias };
  function generar(semilla, opciones = {}) {
    const rng = Azar.crear(`${ID}|${semilla}`);
    const idea = TIPOS_POR_IDEA[opciones.idea] ? opciones.idea : rng.elegir(IDEAS), tipo = rng.elegir(TIPOS_POR_IDEA[idea]);
    for (let intento = 0; intento < 500; intento++) {
      const p = cerrar(rng, semilla, tipo, CONSTRUIR[tipo](rng));
      if (p) return p;
    }
    throw new Error(`${ID}: no se pudo generar un problema de ${tipo}`);
  }
  return { id: ID, titulo: 'Radio, ionización y electronegatividad en la tabla', generar, TIPOS_POR_IDEA, NIVEL, TIPOS: Object.keys(CONSTRUIR), DATOS: { EL, ION, AE, SUCESIVAS } };
});
