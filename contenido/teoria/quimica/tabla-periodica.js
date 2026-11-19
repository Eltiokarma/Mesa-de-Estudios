/*
 * Teoría de «Tabla periódica» (quimica.tabla-periodica). Molde: docs/teoria.md y docs/molde-unidad.md; unidad modelo:
 * contenido/teoria/quimica/estructura-atomica.js. Compañera: Bruna (castora), voz resolutiva y cálida.
 * Fuente del contenido: docs/teoria/matriz/quimica.json (unidad 3). Errores: docs/investigacion/atomo-enlace-ideas-erroneas.md
 * (TP4, TP7, TP8 y la sección «Tabla periódica (19 nov)»); los QM- son hipótesis nuevas (ninguno medido).
 *
 * Etapa 5 del plan de calidad (19 nov 2026). Propuesta: docs/etapa5/propuesta-quimica.md (Gerson delegó el criterio y
 * revisa después; las decisiones están en su §12). La unidad se partió en dos, como Magnitudes/Vectores y MRU/MRUV:
 *   - «Tabla periódica» (esta, conserva el id): lo que se ubica. Cuatro ideas, en este orden y con estos id (el avance se
 *     guarda con ellos): 1 «Ley periódica: periodos y grupos» (`periodos-grupos-bloques`), 2 «Ubicación y notación de
 *     Lewis» (`ubicacion-lewis`), 3 «Bloques y metales de transición» (`bloques-transicion`, nueva) y 4 «Metales, no
 *     metales y semimetales» (`metales-no-metales`, nueva).
 *   - «Propiedades periódicas» (quimica.propiedades-periodicas, nueva): lo que se compara (radio, ionización, afinidad y
 *     electronegatividad), con las dos mesas del laboratorio. El avance se migra con la partición `partidoTP`
 *     (nucleo/avance.js).
 * Fases 2 y 3 del método (docs/metodo/unidad/LEEME.md): las cuatro ideas están rehechas contra el contrato, con sus 15
 * ejemplos cada una. La práctica por idea es plantillas/tabla-ubicacion (TIPOS_POR_IDEA). No declara calidad: 2 (la
 * sesión la marca después del lector en frío y el auditor); su prueba simula la marca.
 *
 * Ficha de tarea (diseno-y-animacion), idea 1
 *   Promesa: decir en qué periodo y en qué familia está un elemento contando desde su gas noble, y predecir cómo se
 *     porta por sus compañeros de columna.
 *   Persona y condiciones: 5.º de secundaria o preuniversitario, celular de gama baja a 360 px, sin audio, a veces sin
 *     conexión.
 *   Resultado observable: da el periodo de un Z, el elemento de abajo, la familia (alcalinos, alcalinotérreos, anfígenos,
 *     halógenos, gases nobles), cuántos elementos tiene un periodo y qué par es de una misma familia.
 *   Orden de atención: 1.º la tarjeta bajo el litio · 2.º las tres columnas que se arman con filas de 8 · 3.º el periodo
 *     de 18.
 *   Estados: juego sin tocar · misión cumplida · predicción abierta · revelado · paso a paso · caso nuevo · acierto · «No sé».
 *   Duda que resuelve: ¿por qué la tabla tiene esa forma?, ¿los parecidos van en la fila o en la columna?
 *
 * Datos del mundo (idea 1): globos con helio, letreros de neón y focos de filamento con argón (hechos de todos los días,
 * sin cifra); Mendeléiev, 1869; galio, 1875; germanio, 1886; orden por número atómico desde 1913 (Moseley); 118
 * elementos, el oganesón cierra el periodo 7 (IUPAC). Una fecha por hecho (lo revisa tabla-periodica.test.js).
 * Fuentes (no van al alumno): OpenStax Chemistry 2e §2.5 y §6.5; tabla periódica IUPAC; NIST, «Henry Moseley and the
 * Periodic Table»; Mendeléiev (1869).
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = l => l[Math.floor(r() * l.length)];
    return r;
  }
  const NOMBRE = ['', 'hidrógeno', 'helio', 'litio', 'berilio', 'boro', 'carbono', 'nitrógeno', 'oxígeno', 'flúor', 'neón', 'sodio', 'magnesio', 'aluminio',
    'silicio', 'fósforo', 'azufre', 'cloro', 'argón', 'potasio', 'calcio', 'escandio', 'titanio', 'vanadio', 'cromo', 'manganeso', 'hierro', 'cobalto',
    'níquel', 'cobre', 'cinc', 'galio', 'germanio', 'arsénico', 'selenio', 'bromo', 'kriptón'];

  // ---------- Idea 1 (rehecha, 19 nov): ley periódica, periodos y grupos ----------
  // Propuesta: docs/etapa5/propuesta-quimica.md (§3 a §8, idea A1). Objeto de la primera pantalla: un globo con helio, un
  // letrero de neón y un foco con argón, cada uno con la tarjeta de su elemento (pieza quim-tira, dibujo de prueba).
  // Cambia: de cuántas tarjetas es cada fila de la tira · Permanece: las 20 tarjetas en orden de Z, con el hidrógeno y el
  // helio en una primera fila corta · Progresa: de «bajo el litio cae cualquier cosa» a «con filas de 8, los parecidos
  // quedan en columna» · Se reserva: el periodo de 18 y el rubidio (es lo que se predice) · Debe verse: qué tarjeta queda
  // bajo el litio con cada corte.
  // Esta idea no usa la configuración electrónica (la causa llega en la idea 2): enseña a contar desde el gas noble.
  // Errores (todos hipótesis; la trampa fila/columna la anotan los solucionarios de San Marcos 2019-I y 2019-II):
  // QM-FILA-COLUMNA (le da a la fila lo que es de la columna), QM-PROPIEDAD-Z (cree que cuántos protones hay decide cómo se
  // porta), QM-SIN-LEY (no cree que la tabla sirva para predecir), QM-FAMILIA-LADO (cuenta desde el otro lado del gas
  // noble), QM-CUENTA-GRUPO (se corre un lugar), QM-SIEMPRE-OCHO (todos los periodos de 8), QM-LARGO-PERIODO (usa el largo
  // de otro periodo), QM-PERIODO-GAS (da el periodo del gas noble anterior), QM-PERIODO-CUENTA (cuenta un gas noble de
  // más), QM-LARGO-TOTAL (da el Z del gas noble por el largo), QM-CUENTA-EXTREMOS (suma 1 de más), QM-VF-NIEGA y
  // QM-VF-ACEPTA (una afirmación juzgada al revés) y QM-CUENTA (se equivoca en la cuenta).
  // Colores (molde §5b; propuesta §8): Z naranja c-o, el periodo turquesa c-i, el grupo carmín c-h, los electrones de
  // valencia violeta c-f (ideas 2 y 3); símbolos, familias y marcas ●▲■ en tinta; sin verde. Las ideas 2 a 4 todavía
  // llevan los colores viejos (se rehacen en la fase 3). La letra de una alternativa, en negrita y en tinta.
  const COLORES = { z: 'o', periodo: 'i', grupo: 'h', valencia: 'f' };
  const ficha = m => t => ({ v: `c-${COLORES[m]}`, t: String(t), m });
  const Pz = ficha('z'), Pe = ficha('periodo'), Gr = ficha('grupo');
  const Z = Pz('Z');
  const letra = L => ({ negrita: [L] });
  const SEP = '   ·   ';
  const S118 = ('H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe '
    + 'Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr Rf Db Sg Bh Hs Mt Ds Rg Cn '
    + 'Nh Fl Mc Lv Ts Og').split(' ');
  const SIMBOLOS118 = Object.fromEntries(S118.map((s, i) => [i + 1, s]));
  const NOMBRE2 = Object.assign({ 37: 'rubidio', 38: 'estroncio', 49: 'indio', 50: 'estaño', 51: 'antimonio', 52: 'telurio', 53: 'yodo', 54: 'xenón', 55: 'cesio', 56: 'bario',
    81: 'talio', 82: 'plomo', 83: 'bismuto', 84: 'polonio', 85: 'astato', 86: 'radón', 87: 'francio', 88: 'radio' }, Object.fromEntries(NOMBRE.map((x, z) => [z, x]).filter(([z]) => z > 0)));
  const nom = z => NOMBRE2[z];
  // La tabla contada desde los gases nobles (sin configuración): cada periodo termina en uno.
  const NOBLES = [0, 2, 10, 18, 36, 54, 86, 118];
  const periodoDe = z => NOBLES.findIndex(g => z <= g);
  // Grupo de un elemento de los grupos 1, 2 y 13 a 18 (null en los grupos 3 a 12).
  const grupoDe = z => { const p = periodoDe(z), d = z - NOBLES[p - 1], b = NOBLES[p] - z; return z === 1 ? 1 : b <= 5 ? 18 - b : d <= 2 ? d : null; };
  const abajo = z => { const p = periodoDe(z), g = grupoDe(z); return p >= 7 || g === null ? null : g <= 2 ? NOBLES[p] + g : NOBLES[p + 1] - (18 - g); };
  const arriba = z => { for (let x = 1; x < z; x++) if (abajo(x) === z) return x; return null; };
  const ROM = { 1: 'IA', 2: 'IIA', 13: 'IIIA', 14: 'IVA', 15: 'VA', 16: 'VIA', 17: 'VIIA', 18: 'VIIIA' };
  const grupoTxt = g => `${g} (${ROM[g]})`;
  const FAMILIAS = { 1: 'Alcalinos', 2: 'Alcalinotérreos', 16: 'Anfígenos', 17: 'Halógenos', 18: 'Gases nobles' };
  const FAMILIA_UN = { 1: 'un metal alcalino', 2: 'un alcalinotérreo', 16: 'un anfígeno', 17: 'un halógeno', 18: 'un gas noble' };
  // Marcas de las tarjetas (hasta el radón): ● gas que casi no reacciona, ▲ metal blando que reacciona con el agua,
  // ■ no metal que forma sales con los metales. Salen del lugar: el gas noble, el que le sigue y el que va antes.
  const MARCAS = {};
  for (const g of NOBLES.slice(1, 7)) { MARCAS[g] = 'inerte'; if (g + 1 < 86) MARCAS[g + 1] = 'blando'; if (g > 2) MARCAS[g - 1] = 'sal'; }
  const TIRA = (o, estado) => ({ pieza: 'quim-tira', datos: Object.assign({ vista: 'tira', simbolos: SIMBOLOS118, marcas: MARCAS }, o), estado: estado || {} });
  const TABLA = (o, estado) => ({ pieza: 'quim-tira', datos: Object.assign({ vista: 'tabla', simbolos: SIMBOLOS118, marcas: MARCAS }, o), estado: estado || {} });
  // Los datos que se repiten (contrato, punto 13: herramientas, no el paso hecho).
  const DT = {
    nobles: ['Gases nobles (cada uno cierra un periodo): ', Z, ' = 2, 10, 18, 36, 54, 86 y 118'],
    filas: 'Periodo: una fila de la tabla. Grupo: una columna',
    largos: 'Elementos por periodo: 2, 8, 8, 18, 18, 32, 32',
    familias: 'Familias: alcalinos, grupo 1 (IA); alcalinotérreos, 2 (IIA); anfígenos, 16 (VIA); halógenos, 17 (VIIA); gases nobles, 18 (VIIIA)',
    despues: ['Después de un gas noble (grupos 1 y 2): grupo = ', Z, ' − ', Z, ' del gas noble'],
    antes: ['Antes de un gas noble (grupos 13 a 17): grupo = 18 − (', Z, ' del gas noble − ', Z, ')'],
    periodo: 'periodo = cantidad de gases nobles con Z menor + 1',
    debajo: 'Justo debajo: mismo grupo, en el periodo siguiente',
    orden: 'Desde 1913, los elementos se ordenan por su número atómico',
  };
  // Con respuesta numérica: la correcta y los errores que dan otro número; si coinciden, se completa con cuentas vecinas.
  function opcionesN(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]), ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      if (!Number.isFinite(d.valor) || d.valor < 1) continue;
      const t = fmt(d.valor); if (vistos.has(t)) continue;
      vistos.add(t); ops.push({ id: d.id, texto: t, error: d.error, siFuera: d.siFuera });
    }
    for (const dx of [2, 3, -2, 4]) {
      if (ops.length >= 4 || correcta + dx < 1) continue;
      const t = fmt(correcta + dx); if (vistos.has(t)) continue;
      vistos.add(t); ops.push({ id: `cuenta${dx}`, texto: t, error: 'QM-CUENTA', siFuera: 'Bien el camino. Revisa la cuenta paso por paso: ese número no sale.' });
    }
    return ops.slice(0, 4);
  }
  const lug = k => (k === 1 ? '1 lugar' : `${k} lugares`);
  // Cómo se llega al grupo de z contando desde su gas noble: { g, d (lugares después), b (lugares antes), gas (Z del gas noble) }.
  function cuenta(z) {
    const p = periodoDe(z), g = grupoDe(z), despues = g <= 2;
    return { p, g, despues, k: despues ? z - NOBLES[p - 1] : NOBLES[p] - z, gas: despues ? NOBLES[p - 1] : NOBLES[p],
      ecuacion: despues ? ['grupo = ', Pz(z), ' − ', Pz(NOBLES[p - 1]), ' = ', Gr(g)] : ['grupo = 18 − (', Pz(NOBLES[p]), ' − ', Pz(z), ') = ', Gr(g)] };
  }

  // Ahora tú (seis tipos, del más simple al de examen). Cada uno da sus datos.
  const Z_FAMILIA = [3, 4, 11, 12, 19, 20, 37, 38, 8, 9, 16, 17, 34, 35];
  const ESPEJO = { 1: 17, 2: 16, 16: 2, 17: 1 }, VECINA = { 1: 2, 2: 1, 16: 17, 17: 16 };
  function casoFamilia(r) {
    const z = r.de(Z_FAMILIA), c = cuenta(z), g = c.g;
    return {
      pregunta: ['¿A qué familia pertenece el elemento de ', Z, ` = ${z}?`],
      datos: [DT.nobles, DT.despues, DT.antes, DT.familias],
      opciones: [
        { id: 'c', texto: FAMILIAS[g], correcta: true },
        { id: 'lado', texto: FAMILIAS[ESPEJO[g]], error: 'QM-FAMILIA-LADO', siFuera: `Bien contar ${lug(c.k)} desde un gas noble. Pero va ${c.despues ? 'después' : 'antes'} de él, no ${c.despues ? 'antes' : 'después'}.` },
        { id: 'vecina', texto: FAMILIAS[VECINA[g]], error: 'QM-CUENTA-GRUPO', siFuera: `Bien el lado. Pero está a ${lug(c.k)} de su gas noble, no a ${lug(3 - c.k)}.` },
        { id: 'noble', texto: FAMILIAS[18], error: 'QM-FILA-COLUMNA', siFuera: 'Está cerca de un gas noble, cierto. Pero la familia es la columna, no el vecino de número.' },
      ],
      solucion: { texto: `Está ${lug(c.k)} ${c.despues ? 'después' : 'antes'} del ${nom(c.gas)} (Z = ${c.gas}): grupo ${grupoTxt(g)}.`, ecuacion: c.ecuacion },
    };
  }
  const Z_ABAJO = [3, 4, 11, 12, 19, 20, 37, 38, 8, 9, 10, 16, 17, 18, 34, 35, 36, 5, 13, 31];
  function casoAbajo(r) {
    const z = r.de(Z_ABAJO), c = cuenta(z), zb = abajo(z), salto = zb - z, gas2 = c.despues ? NOBLES[c.p] : NOBLES[c.p + 1];
    const otros = [8, 18, 32].filter(j => j !== salto);
    const SALTO = { 8: ['QM-SIEMPRE-OCHO', 'Bien bajar un periodo. Pero sumar 8 solo sirve en los primeros periodos: cuenta desde el gas noble.'],
      18: ['QM-LARGO-PERIODO', 'Bien bajar un periodo. Pero 18 es el largo de otro periodo: cuenta desde el gas noble.'],
      32: ['QM-LARGO-32', 'Bien bajar un periodo. Pero 32 es el largo de los periodos 6 y 7: cuenta desde el gas noble.'] };
    return {
      pregunta: ['El elemento X está justo debajo del ', nom(z), ' (', Z, ` = ${z}) en la tabla periódica. ¿Cuál es el número atómico de X?`],
      datos: [DT.nobles, DT.despues, DT.antes, DT.debajo],
      opciones: opcionesN(zb, [
        { id: 'fila', valor: z + 1, error: 'QM-FILA-COLUMNA', siFuera: 'Ese es el que le sigue en número. Debajo va el que ocupa su mismo lugar en el periodo siguiente.' },
        ...otros.map(j => ({ id: `mas${j}`, valor: z + j, error: SALTO[j][0], siFuera: SALTO[j][1] })),
      ], x => `${x}`),
      solucion: c.k === 0 ? { texto: `El ${nom(z)} es un gas noble. Debajo está el gas noble siguiente.`, ecuacion: [Z, ' = ', Pz(zb)] }
        : { texto: `El ${nom(z)} está ${c.k} ${c.despues ? 'después' : 'antes'} del ${nom(c.gas)} (${c.gas}). X, ${c.k} ${c.despues ? 'después' : 'antes'} del gas noble siguiente (${gas2}).`,
          ecuacion: [Pz(gas2), ` ${c.despues ? '+' : '−'} ${c.k} = `, Pz(zb)] },
    };
  }
  const Z_PERIODO = [5, 7, 13, 15, 21, 26, 29, 33, 40, 47, 50, 51, 49, 79, 82, 12, 20, 38];
  function casoPeriodo(r) {
    const z = r.de(Z_PERIODO), p = periodoDe(z), menores = NOBLES.slice(1).filter(g => g < z);
    return {
      pregunta: ['¿En qué periodo está el elemento de ', Z, ` = ${z}?`],
      datos: [DT.nobles, DT.periodo],
      opciones: opcionesN(p, [
        { id: 'gas', valor: p - 1, error: 'QM-PERIODO-GAS', siFuera: 'Ese es el periodo que cierra el gas noble anterior. El elemento ya está en el siguiente.' },
        { id: 'mas', valor: p + 1, error: 'QM-PERIODO-CUENTA', siFuera: 'Bien contar gases nobles. Pero solo los de Z menor: el que viene después no cuenta.' },
        { id: 'lista', valor: p >= 4 ? p - 2 : p + 2, error: 'QM-CUENTA', siFuera: 'Bien contar gases nobles. Revisa la lista uno por uno: ese número no sale.' },
      ], x => `Periodo ${x}`),
      solucion: { texto: `Gases nobles con Z menor que ${z}: los de Z = ${menores.join(', ')}. ${menores.length === 1 ? 'Es uno' : `Son ${menores.length}`}.`, ecuacion: ['periodo = ', `${menores.length} + 1 = `, Pe(p)] },
    };
  }
  function casoLargo(r) {
    const p = r.de([2, 3, 4, 5, 6]), a = NOBLES[p - 1], b = NOBLES[p], largo = b - a;
    return {
      pregunta: `¿Cuántos elementos tiene el periodo ${p} de la tabla periódica?`,
      datos: [DT.nobles, 'Un periodo empieza en el elemento que sigue a un gas noble y termina en el gas noble siguiente'],
      opciones: opcionesN(largo, [
        { id: 'total', valor: b, error: 'QM-LARGO-TOTAL', siFuera: `Ese es el Z del gas noble que lo cierra: cuenta todos los elementos desde el hidrógeno.` },
        { id: 'extremos', valor: largo + 1, error: 'QM-CUENTA-EXTREMOS', siFuera: 'Bien restar los dos gases nobles. Pero el de antes no es de este periodo: no se suma 1.' },
        { id: 'otro', valor: largo === 8 ? 18 : 8, error: largo === 8 ? 'QM-LARGO-PERIODO' : 'QM-SIEMPRE-OCHO', siFuera: 'Así es en otros periodos. En este, cuenta desde un gas noble hasta el siguiente.' },
        { id: 'anterior', valor: a, error: 'QM-LARGO-ANTERIOR', siFuera: 'Ese es el Z del gas noble anterior. El periodo empieza recién después de él.' },
      ], x => `${x}`),
      solucion: { texto: `Va del Z = ${a + 1} al Z = ${b}: los que hay después del Z = ${a} hasta el ${b}.`, ecuacion: [Pz(b), ' − ', Pz(a), ' = ', Pe(largo)] },
    };
  }
  const Z_PAR = [3, 4, 9, 11, 12, 16, 17, 19, 20, 35, 37, 8];
  function casoPar(r) {
    const a = r.de(Z_PAR), b = abajo(a), c = cuenta(a), fila = r.de([5, 13, 14, 31, 32]), ocho = r.de([19, 20, 31, 33]), dieciocho = r.de([5, 6, 7]);
    const par = (x, y) => `Z = ${x} y Z = ${y}`;
    return {
      pregunta: '¿Cuál de estos pares de elementos pertenece a una misma familia?',
      datos: [DT.nobles, DT.despues, DT.antes],
      opciones: [
        { id: 'c', texto: par(a, b), correcta: true },
        { id: 'fila', texto: par(fila, fila + 1), error: 'QM-FILA-COLUMNA', siFuera: 'Son vecinos de fila, cierto. Pero una familia es una columna: el mismo lugar contando desde el gas noble.' },
        { id: 'ocho', texto: par(ocho, ocho + 8), error: 'QM-SIEMPRE-OCHO', siFuera: 'Sumar 8 sirve en los periodos 2 y 3. Desde el periodo 4, cada fila tiene 18 o más.' },
        { id: 'dieciocho', texto: par(dieciocho, dieciocho + 18), error: 'QM-LARGO-PERIODO', siFuera: 'Sumar 18 sirve desde el periodo 4. En los periodos 2 y 3, la fila tiene 8.' },
      ],
      solucion: { texto: `Los dos están a ${lug(c.k)} ${c.despues ? 'después' : 'antes'} de su gas noble: grupo ${grupoTxt(c.g)}.`,
        ecuacion: c.despues ? [Pz(a), ` − ${c.gas} = ${c.k}`, SEP, Pz(b), ` − ${NOBLES[c.p]} = ${c.k}`] : [`${c.gas} − `, Pz(a), ` = ${c.k}`, SEP, `${NOBLES[c.p + 1]} − `, Pz(b), ` = ${c.k}`] },
    };
  }
  // Afirmaciones para el verdadero o falso (nivel examen: San Marcos 2019-I pregunta qué comparten los de un grupo).
  // [texto (≤ 9 palabras), es verdad, por qué (≤ 10)], en parejas del mismo asunto.
  const AFIRMA = [
    ['La tabla actual ordena los elementos por número atómico.', true, 'así se ordenan desde 1913'],
    ['La tabla actual ordena los elementos por masa atómica.', false, 'el orden es por número atómico, no por masa'],
    ['Los elementos de un mismo grupo tienen propiedades parecidas.', true, 'es lo que dice la ley periódica'],
    ['Los elementos de un mismo periodo tienen propiedades parecidas.', false, 'los parecidos van en un grupo, no en un periodo'],
    ['La tabla periódica tiene 7 periodos y 18 grupos.', true, 'son 7 filas y 18 columnas'],
    ['Todos los periodos tienen la misma cantidad de elementos.', false, 'tienen 2, 8, 8, 18, 18, 32 y 32'],
    ['Cada periodo termina en un gas noble.', true, 'el helio, el neón, el argón y los demás'],
    ['Cada periodo empieza en un gas noble.', false, 'empieza en el grupo 1 y termina en un gas noble'],
    ['Los halógenos están en el grupo 17 (VIIA).', true, 'lo dice la lista de familias'],
    ['Los gases nobles están en el grupo 17 (VIIA).', false, 'están en el grupo 18 (VIIIA)'],
  ];
  const ROMANO = ['I', 'II', 'III'];
  const vf = l => l.map(x => (x ? 'V' : 'F')).join('');
  function casoVF(r) {
    const idx = [0, 1, 2, 3, 4];
    for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
    const tres = idx.slice(0, 3).sort((a, b) => a - b).map(k => AFIRMA[2 * k + (r() < 0.5 ? 0 : 1)]), bien = tres.map(x => x[1]);
    const ops = [{ id: 'c', texto: vf(bien), correcta: true }];
    tres.forEach((x, i) => {
      const otra = bien.slice(); otra[i] = !otra[i];
      ops.push({ id: `vf${i}`, texto: vf(otra), error: x[1] ? 'QM-VF-NIEGA' : 'QM-VF-ACEPTA', siFuera: `Bien las otras dos. La ${ROMANO[i]} es ${x[1] ? 'verdadera' : 'falsa'}: ${x[2]}.` });
    });
    const clave = tres.find(x => !x[1]) || tres[0];
    return {
      pregunta: ['Indica verdadero (V) o falso (F). ', ...tres.map((x, i) => `${ROMANO[i]}. ${x[0]} `)],
      datos: [DT.nobles, DT.filas],
      opciones: ops,
      solucion: { texto: `${tres.map((x, i) => `${ROMANO[i]} ${x[1] ? 'V' : 'F'}`).join(', ')}. ${clave[2].replace(/^./, m => m.toUpperCase())}.` },
    };
  }
  // Así se resuelve: periodo, grupo y familia de un elemento (Ahora tú nunca pide las tres cosas juntas).
  // Ningún Z de esta lista sale en «Ahora tú» (lector en frío, 19 nov: el mismo caso en los dos momentos).
  const Z_RESUELVE = [52, 53, 55, 56, 84, 85, 87, 88];

  // Ejemplos resueltos (pestaña «Ejemplos», docs/teoria.md 4h; molde §3: el dibujo muestra el planteamiento, nunca la
  // respuesta). Cuentas rehechas aparte, sin el código de la unidad (scratchpad, e5-quimica/cuentas-idea1.py): 10 + 1 = 11 ·
  // 18 − 11 + 1 = 8 · grupo 17 = halógenos · tras el argón, periodo 4 · halógeno del periodo 3: 18 − 1 = 17 · calcio:
  // 3 gases nobles antes → periodo 4; 20 − 18 = 2 · 4, 12 y 20: 2 después de 2, 10 y 18 · 2 + 8 + 8 + 18 + 18 = 54 ·
  // bajo el aluminio: 18 − 13 = 5; 36 − 5 = 31 · pares: 17 y 35 a 1 de 18 y 36 (errores: 10–11 vecinos; 19 + 8 = 27, debajo
  // va el 37; 12 + 18 = 30, debajo va el 20; 16 a 2 de 18 y 33 a 3 de 36) · FVF · 35, 36, 37: halógeno, gas noble, alcalino
  // del periodo 5 · 119: periodo 8, grupo 1 · anfígeno del periodo 5: 54 − 2 = 52 (errores 34, 56, 38, 70).
  const EJEMPLOS_LEY = [
    { nivel: 1, titulo: 'El que sigue al neón',
      enunciado: 'El neón de los letreros (Z = 10) cierra el periodo 2. ¿Qué número atómico tiene el elemento que abre el periodo 3?',
      datos: ['En la tabla, los elementos van en orden de número atómico, uno tras otro'],
      figura: TIRA({ desde: 3, hasta: 11, porFila: 8, cabeza: true, incognitas: [11], columnas: false, resaltar: [{ Z: 11 }], marcas: {} }),
      solucion: [{ texto: 'Después del neón viene el número atómico siguiente, y con él empieza una fila nueva.', ecuacion: [Pz(10), ' + 1 = ', Pz(11)] }],
      respuesta: [Z, ' = ', Pz(11), ': el sodio'] },
    { nivel: 1, titulo: '¿Fila o columna?',
      enunciado: 'El sodio y el potasio reaccionan con el agua casi igual. En la tabla periódica, ¿están en el mismo periodo o en el mismo grupo?',
      datos: ['Periodo: una fila de la tabla. Grupo: una columna', 'Ley periódica: los elementos de propiedades parecidas quedan en una misma columna'],
      solucion: [{ texto: 'Se portan parecido: por la ley periódica, están uno debajo del otro, en una columna. Y una columna es un grupo.' }],
      respuesta: ['En el mismo ', Gr('grupo'), ', el ', Gr('1 (IA)')] },
    { nivel: 1, titulo: 'Los elementos del periodo 3',
      enunciado: 'El periodo 3 empieza en el sodio (Z = 11) y termina en el argón (Z = 18). ¿Cuántos elementos tiene?',
      datos: ['Del primero al último, contando los dos: último − primero + 1'],
      figura: TIRA({ desde: 11, hasta: 18, porFila: 8, columnas: false, marcas: {} }),
      solucion: [{ texto: 'Cuento del 11 al 18, con los dos incluidos.', ecuacion: [Pz(18), ' − ', Pz(11), ' + 1 = ', Pe(8)] }],
      respuesta: [Pe('8 elementos')] },
    { nivel: 1, titulo: 'La familia del cloro',
      enunciado: 'El cloro de la lejía está en el grupo 17 de la tabla periódica. ¿Cómo se llama su familia?',
      datos: [DT.familias],
      solucion: [{ texto: 'En la lista de familias, el grupo 17, que el examen escribe VIIA, es el de los halógenos.' }],
      respuesta: ['Halógenos: ', Gr('grupo 17 (VIIA)')] },
    { nivel: 1, titulo: 'El periodo del potasio',
      enunciado: 'El argón (Z = 18) es el gas noble que cierra el periodo 3. ¿En qué periodo está el potasio (Z = 19)?',
      datos: ['Cada periodo termina en un gas noble; el elemento siguiente abre el periodo que sigue'],
      solucion: [{ texto: 'El potasio es el elemento que sigue al argón: con él empieza una fila nueva.', ecuacion: ['3 + 1 = ', Pe(4)] }],
      respuesta: [Pe('Periodo 4')] },
    { nivel: 2, titulo: 'El halógeno del periodo 3',
      enunciado: 'El flúor (Z = 9) es un halógeno: está justo antes del neón (Z = 10). ¿Qué número atómico tiene el halógeno del periodo 3?',
      datos: [DT.nobles, DT.antes, DT.familias],
      figura: TABLA({ periodos: 3, incognitas: [17], resaltar: [{ Z: 9 }, { Z: 17 }], marcas: {} }),
      solucion: [
        { texto: 'El periodo 3 termina en el tercer gas noble: el argón.', ecuacion: [Z, ' = ', Pz(18)] },
        { texto: 'Halógeno es grupo 17: un lugar antes de su gas noble.', ecuacion: ['18 − 17 = 1', SEP, Pz(18), ' − 1 = ', Pz(17)] },
      ],
      respuesta: [Z, ' = ', Pz(17), ': el cloro'] },
    { nivel: 2, titulo: 'Dónde está el calcio',
      enunciado: 'El calcio de los huesos tiene Z = 20. ¿En qué periodo y en qué grupo de la tabla periódica está?',
      datos: [DT.nobles, DT.periodo, DT.despues],
      solucion: [
        { texto: 'Antes del 20 hay tres gases nobles: 2, 10 y 18.', ecuacion: ['periodo = 3 + 1 = ', Pe(4)] },
        { texto: 'El calcio está dos lugares después del argón.', ecuacion: ['grupo = ', Pz(20), ' − ', Pz(18), ' = ', Gr(2)] },
      ],
      respuesta: [Pe('Periodo 4'), ', ', Gr('grupo 2 (IIA)')] },
    { nivel: 2, titulo: '¿Son de la misma familia?',
      enunciado: 'Tres elementos tienen Z = 4, 12 y 20. ¿Pertenecen a una misma familia?',
      datos: [DT.nobles, DT.despues, DT.familias],
      solucion: [
        { texto: 'Busco el gas noble anterior a cada uno y cuento los lugares.', ecuacion: [Pz(4), ' − ', Pz(2), ' = ', Gr(2), SEP, Pz(12), ' − ', Pz(10), ' = ', Gr(2), SEP, Pz(20), ' − ', Pz(18), ' = ', Gr(2)] },
        { texto: 'Los tres caen en el grupo 2 (IIA): una misma columna, una misma familia.' },
      ],
      respuesta: ['Sí: ', Gr('grupo 2 (IIA)'), ', alcalinotérreos'] },
    { nivel: 2, titulo: 'Hasta el xenón',
      enunciado: 'El xenón es el gas noble que cierra el periodo 5. ¿Cuál es su número atómico?',
      datos: [DT.largos],
      solucion: [
        { texto: 'Su Z cuenta todos los elementos desde el hidrógeno: sumo los de los cinco periodos.', ecuacion: ['2 + 8 + 8 + 18 + 18 = ', Pz(54)] },
        { texto: 'De vuelta: el periodo 5 tiene 18, y antes de él cierra el kriptón.', ecuacion: [Pz(54), ' − 18 = ', Pz(36)] },
      ],
      respuesta: [Z, ' = ', Pz(54)] },
    { nivel: 2, titulo: 'El hueco bajo el aluminio',
      enunciado: 'En 1869, Mendeléiev dejó un hueco debajo del aluminio (Z = 13). En la tabla de hoy, ¿qué número atómico tiene el elemento que lo llenó?',
      datos: [DT.nobles, DT.antes, DT.debajo],
      figura: TABLA({ periodos: 4, incognitas: [31], resaltar: [{ Z: 13 }, { Z: 31 }], marcas: {} }),
      solucion: [
        { texto: 'El aluminio está 5 lugares antes de su gas noble, el argón.', ecuacion: [Pz(18), ' − ', Pz(13), ' = 5'] },
        { texto: 'El de abajo está 5 lugares antes del gas noble siguiente, el kriptón.', ecuacion: [Pz(36), ' − 5 = ', Pz(31)] },
      ],
      respuesta: [Z, ' = ', Pz(31), ': el galio'],
      fuente: 'OpenStax, Chemistry 2e, §2.5 (Mendeléiev, 1869; el galio se halló en 1875)' },
    { nivel: 3, titulo: 'El par de la misma familia',
      enunciado: '¿Cuál de estos pares de elementos pertenece a una misma familia?',
      alternativas: ['Z = 10 y Z = 11', 'Z = 17 y Z = 35', 'Z = 19 y Z = 27', 'Z = 12 y Z = 30', 'Z = 16 y Z = 33'],
      datos: [DT.nobles, DT.despues, DT.antes],
      solucion: [
        { texto: 'Cuento desde el gas noble más cercano. El 17 está justo antes del argón y el 35, justo antes del kriptón.', ecuacion: [Pz(18), ' − ', Pz(17), ' = 1', SEP, Pz(36), ' − ', Pz(35), ' = 1'] },
        { texto: 'Los dos están en el grupo 17 (VIIA): son halógenos.', ecuacion: ['grupo = 18 − 1 = ', Gr(17)] },
        { texto: ['La ', letra('A'), ' junta dos vecinos de número: uno cierra un periodo y el otro abre el siguiente. La ', letra('C'), ' suma 8 al potasio: debajo va el 37.'] },
        { texto: ['La ', letra('D'), ' suma 18 al magnesio: debajo va el 20. En la ', letra('E'), ', el 16 queda a 2 del argón y el 33, a 3 del kriptón.'] },
      ],
      respuesta: [letra('B'), ', Z = 17 y Z = 35: ', Gr('grupo 17 (VIIA)')] },
    { nivel: 3, titulo: 'Verdadero o falso',
      enunciado: 'Indica verdadero (V) o falso (F). I. La tabla actual ordena los elementos por su masa atómica. II. Los elementos de un grupo tienen propiedades químicas parecidas. III. Todos los periodos tienen igual cantidad de elementos.',
      alternativas: ['FVF', 'VVF', 'FFV', 'VFV', 'FVV'],
      datos: [DT.nobles, DT.filas],
      solucion: [
        { texto: 'I es falsa: el orden es por número atómico. II es verdadera: es la ley periódica.' },
        { texto: 'III es falsa: el periodo 1 va del 1 al 2 (2 elementos) y el periodo 2, del 3 al 10 (8).', ecuacion: ['2 − 0 = 2', SEP, '10 − 2 = 8'] },
        { texto: ['La ', letra('B'), ' acepta el orden por masa. La ', letra('C'), ' y la ', letra('D'), ' niegan la ley periódica. La ', letra('E'), ' cree que todos los periodos son iguales.'] },
      ],
      respuesta: [letra('A'), ', FVF'] },
    { nivel: 3, titulo: 'Tres vecinos',
      enunciado: 'Los elementos X, Q y R tienen números atómicos 35, 36 y 37, en ese orden. ¿Qué afirmación es correcta?',
      alternativas: ['Los tres están en el mismo periodo.', 'X y R se parecen, por ser vecinos del mismo gas noble.', 'R abre un periodo nuevo y es un metal alcalino.', 'X es un metal alcalino y R, un halógeno.', 'Q es un halógeno, porque está entre X y R.'],
      datos: [DT.nobles, DT.despues, DT.antes, DT.familias],
      solucion: [
        { texto: 'Q, el 36, es un gas noble: cierra el periodo 4. X, el 35, va justo antes: es un halógeno.', ecuacion: ['grupo = 18 − (', Pz(36), ' − ', Pz(35), ') = ', Gr(17)] },
        { texto: 'R, el 37, va justo después: abre el periodo 5, en el grupo 1.', ecuacion: ['grupo = ', Pz(37), ' − ', Pz(36), ' = ', Gr(1)] },
        { texto: ['La ', letra('A'), ' olvida que el periodo termina en el 36. La ', letra('B'), ' confunde estar junto al mismo gas noble con ser familia.'] },
        { texto: ['La ', letra('D'), ' los cambia de lado. La ', letra('E'), ' olvida que el 36 es el gas noble.'] },
      ],
      respuesta: [letra('C'), ', R abre el ', Pe('periodo 5'), ': ', Gr('grupo 1 (IA)')] },
    { nivel: 3, titulo: 'El elemento 119',
      enunciado: 'El oganesón (Z = 118) es el último elemento conocido y cierra el periodo 7, en el grupo 18. Si algún día se obtiene el elemento 119, ¿dónde iría?',
      alternativas: ['Periodo 7, grupo 1', 'Periodo 8, grupo 18', 'Periodo 7, grupo 18', 'Periodo 8, grupo 1', 'Periodo 8, grupo 2'],
      datos: [DT.despues, 'El elemento que sigue al último de un periodo abre el periodo siguiente'],
      solucion: [
        { texto: 'El 119 sigue al último del periodo 7: abre un periodo nuevo.', ecuacion: ['7 + 1 = ', Pe(8)] },
        { texto: 'Va un lugar después del oganesón, que es del grupo 18: abre la fila en el grupo 1.', ecuacion: ['grupo = ', Pz(119), ' − ', Pz(118), ' = ', Gr(1)] },
        { texto: ['La ', letra('A'), ' y la ', letra('C'), ' no cambian de periodo. La ', letra('B'), ' lo deja en el grupo 18, el del oganesón.'] },
        { texto: ['La ', letra('E'), ' cuenta dos lugares después del 118, no uno.'] },
      ],
      respuesta: [letra('D'), ', ', Pe('periodo 8'), ', ', Gr('grupo 1')],
      fuente: 'IUPAC, tabla periódica de los elementos: 118 elementos; el oganesón (Z = 118) es el último' },
    { nivel: 3, titulo: 'El anfígeno del periodo 5',
      enunciado: 'Un elemento está en el periodo 5 y es un anfígeno. ¿Cuál es su número atómico?',
      alternativas: ['34', '56', '38', '70', '52'],
      datos: [DT.nobles, DT.antes, DT.familias],
      solucion: [
        { texto: 'El periodo 5 termina en el quinto gas noble: el xenón.', ecuacion: [Z, ' = ', Pz(54)] },
        { texto: 'Anfígeno es grupo 16: dos lugares antes de su gas noble.', ecuacion: ['18 − 16 = 2', SEP, Pz(54), ' − 2 = ', Pz(52)] },
        { texto: ['La ', letra('A'), ' usa el kriptón (36), que cierra el periodo 4. La ', letra('B'), ' suma los 2 lugares en vez de restarlos.'] },
        { texto: ['La ', letra('C'), ' cuenta 2 después del kriptón, como en el grupo 2. La ', letra('D'), ' suma el número del grupo: 54 + 16.'] },
      ],
      respuesta: [letra('E'), ', ', Z, ' = ', Pz(52), ': el telurio'] },
  ];

  // «Mira»: la tira ya cortada en filas de 8 y, después, la tabla hasta el periodo 5 (una sola figura con escenas).
  const TIRA8 = { vista: 'tira', desde: 3, hasta: 20, porFila: 8, cabeza: true };
  const ley = {
    id: 'periodos-grupos-bloques',
    titulo: 'Ley periódica: periodos y grupos',
    pregunta: '¿Por qué la tabla periódica tiene filas y columnas justo de ese largo?',
    temas: ['Ley periódica', 'Periodos, grupos y bloques'],
    pieza: 'quim-tira',
    aprendizaje: 'Ordenados por Z, los elementos repiten sus propiedades cada cierto número: cada fila es un periodo y cada columna, un grupo de elementos parecidos.',
    actividad: 'Cortar una tira de tarjetas de elementos en filas y mirar qué queda en cada columna.',
    // Lee: los tres gases, la tarjeta y el orden por Z. No dice que los de una columna se parecen ni nombra al rubidio.
    lee: {
      tarjetas: [
        { titulo: 'Tres gases tranquilos', texto: 'El helio de los globos, el neón de los letreros luminosos y el argón de los focos de filamento son gases que casi no reaccionan con nada. Sus números atómicos son 2, 10 y 18. ¿Será casualidad?',
          pieza: 'quim-tira', dibujo: { datos: { vista: 'objetos', simbolos: SIMBOLOS118, marcas: MARCAS, objetos: [{ que: 'globo', Z: 2, nombre: 'helio' }, { que: 'letrero', Z: 10, nombre: 'neón' }, { que: 'foco', Z: 18, nombre: 'argón' }] }, estado: {} } },
        { titulo: 'Una tarjeta por elemento', texto: ['Cada elemento tiene su tarjeta: arriba su número atómico ', Z, ' (sus protones), al centro su símbolo y abajo una marca con su manera de portarse. ● es un gas que casi no reacciona; ▲, un metal blando que reacciona con el agua.'],
          pieza: 'quim-tira', dibujo: TIRA({ desde: 2, hasta: 4, porFila: 3, columnas: false }) },
        { titulo: 'En orden de Z', texto: 'Desde 1913 los elementos se ordenan por su número atómico, de menor a mayor: hidrógeno 1, helio 2, litio 3… Puestos en una sola tira, las marcas ●, ▲ y ■ aparecen salteadas. ■ es un no metal que forma sales con los metales.',
          pieza: 'quim-tira', dibujo: TIRA({ desde: 1, hasta: 12, porFila: 6, columnas: false }) },
        { titulo: 'Qué mirar', texto: 'Cortas la tira del litio al calcio en filas iguales. El hidrógeno y el helio van aparte, arriba: el helio, siempre en la punta derecha, sobre la última columna. En cada corte, mira qué tarjeta queda debajo del litio.' },
      ],
    },
    ejemplos: EJEMPLOS_LEY,
    juega: {
      pieza: 'quim-tira',
      consigna: 'Los primeros 20 elementos, en orden de Z. La tira del litio al calcio se corta en filas iguales; tú eliges de cuántas tarjetas.',
      mision: {
        texto: 'Corta la tira para que el litio, el sodio y el potasio queden en una columna.',
        logrado: v => abajo(3) === 3 + v.k && abajo(11) === 11 + v.k,
        bien: 'Con ese corte, también el helio, el neón y el argón quedan en columna.',
      },
      voz: 'Prueba un corte y mira qué cae bajo el litio.',
      leyenda: [
        { s: Z, t: 'número atómico: los protones del núcleo' },
        { s: '▲', t: 'metal blando que reacciona con el agua' },
        { s: '●', t: 'gas que casi no reacciona' },
        { s: '■', t: 'no metal que forma sales con metales' },
        { s: 'Li, Na, K', t: 'litio, sodio y potasio' },
        { s: 'He, Ne, Ar', t: 'helio, neón y argón' },
        { s: 'F, Cl', t: 'flúor y cloro' },
      ],
      controles: [{ id: 'k', etiqueta: 'Tarjetas por fila', min: 5, max: 10, paso: 1, inicio: 10, decimales: 0 }],
      dibujo: v => TIRA(Object.assign({}, TIRA8, { porFila: v.k, resaltar: abajo(3) === 3 + v.k ? [] : [{ Z: 3 }, { Z: 3 + v.k }] })),
      // La relación: qué queda bajo el litio con ese corte, y si se le parece.
      lectura: v => {
        const z = 3 + v.k, m = { inerte: ' ●', blando: ' ▲', sal: ' ■' }[MARCAS[z]];
        if (abajo(3) === z) return [`Filas de ${v.k}: Li, Na y K, metales blandos, en una columna.`];
        return [`Filas de ${v.k}: bajo el litio ▲ queda el ${nom(z)}${m ? `${m}.` : ', sin marca.'}`];
      },
      minimo: 3,
    },
    predice: {
      pieza: 'quim-tira',
      pregunta: ['Bajo el potasio, en su misma columna, está el rubidio (', Z, ' = 37). Casi nadie lo ha tenido en la mano. ¿Cómo esperas que sea?'],
      datos: ['Potasio (Z = 19): un metal blando que reacciona con el agua', 'Kriptón (Z = 36): un gas que casi no reacciona', 'Hierro (Z = 26): un metal duro'],
      voz: 'Mira dónde está su tarjeta antes de decidir.',
      opciones: [
        { id: 'c', texto: 'Como el potasio, que está encima: blando y muy reactivo', correcta: true },
        { id: 'fila', texto: 'Como el kriptón, su vecino de número: un gas poco reactivo', error: 'QM-FILA-COLUMNA', siFuera: 'El kriptón va justo antes en número, cierto. Pero con él se cierra una fila; los parecidos van en columna.' },
        { id: 'protones', texto: 'Como el hierro, que también tiene muchos protones: duro', error: 'QM-PROPIEDAD-Z', siFuera: 'Los dos tienen muchos protones, cierto. Pero el parecido lo da la columna, no cuántos protones hay.' },
        { id: 'nada', texto: 'No se puede saber sin tenerlo en la mano', error: 'QM-SIN-LEY', siFuera: 'Verlo ayuda, cierto. Pero su columna ya dice cómo se portan sus compañeros de arriba.' },
      ],
      dibujo: TABLA({ periodos: 5, hasta: 38, ocultos: [37], resaltar: [{ Z: 37 }] }),
      revelar: TABLA({ periodos: 5, hasta: 38, columna: { grupo: 1, color: 'h' } }),
      coincide: 'Coincide: el rubidio es un metal blando que reacciona con el agua, como el potasio.',
      noCoincide: 'El rubidio está bajo el potasio, en su columna: es otro metal blando que reacciona con el agua.',
    },
    mira: {
      pieza: 'quim-tira',
      datos: { simbolos: SIMBOLOS118, marcas: MARCAS, escenas: [
        Object.assign({ desde: 0, columnas: false, resaltar: [...[2, 10, 18].map(x => ({ Z: x, desde: 1 })), ...[3, 11, 19].map(x => ({ Z: x, desde: 2 }))] }, TIRA8),
        Object.assign({ desde: 3 }, TIRA8),
        { desde: 4, vista: 'tabla', periodos: 5, hasta: 38, fila: { periodo: 4, color: 'i', desde: 4 }, columna: { grupo: 1, color: 'h', desde: 5 },
          resaltar: [{ Z: 31, desde: 6 }, { Z: 32, desde: 6 }] },
      ] },
      voz: 'Miremos primero la tira; después, la tabla más abajo.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Los gases que casi no reaccionan tienen Z = 2, 10 y 18.', ecuacion: [Pz(2), ' + 8 = ', Pz(10), SEP, Pz(10), ' + 8 = ', Pz(18)] },
        { estado: { corte: 2 }, texto: 'Después de cada uno viene un metal blando: 3, 11 y 19.', ecuacion: [Pz(2), ' + 1 = ', Pz(3), SEP, Pz(10), ' + 1 = ', Pz(11), SEP, Pz(18), ' + 1 = ', Pz(19)] },
        { estado: { corte: 3 }, texto: 'Por eso se corta ahí: cada fila es un periodo; cada columna, un grupo.', ecuacion: [Pe('periodo'), ': fila', SEP, Gr('grupo'), ': columna'] },
        { estado: { corte: 4 }, texto: 'El periodo 4 es más largo: tiene 18 elementos, hasta el kriptón.', ecuacion: [Pz(36), ' − ', Pz(18), ' = ', Pe(18)] },
        { estado: { corte: 5 }, texto: 'Por eso el rubidio, Z = 37, cae bajo el potasio: grupo 1.', ecuacion: [Pz(36), ' + 1 = ', Pz(37), SEP, Gr('grupo 1 (IA)')] },
        { estado: { corte: 6 }, texto: 'En 1869, Mendeléiev dejó huecos; después, el galio y el germanio los llenaron.', ecuacion: ['galio: 1875', SEP, 'germanio: 1886'] },
      ],
    },
    regla: {
      texto: 'Ley periódica: ordenados por Z, los elementos repiten sus propiedades. Cada fila es un periodo (hay 7) y cada columna, un grupo o familia (hay 18) de elementos parecidos.',
      ecuacion: [{ llave: ['2, 8, 8, 18, 18, 32, 32'], nota: 'elementos por periodo', color: 'c-i' }, SEP, Z, ' = ', { llave: ['2, 10, 18, 36, 54, 86, 118'], nota: 'gases nobles', color: 'c-o' }, SEP,
        Gr('grupo 1 (IA)'), ': alcalinos', SEP, Gr('grupo 2 (IIA)'), ': alcalinotérreos', SEP, Gr('grupo 16 (VIA)'), ': anfígenos', SEP, Gr('grupo 17 (VIIA)'), ': halógenos', SEP,
        Gr('grupo 18 (VIIIA)'), ': gases nobles'],
      condicion: 'los elementos se ordenan por número atómico, no por masa.',
      voz: 'Busca primero el gas noble más cercano.',
      // Dibujo propio: la tabla entera (7 periodos), con las tres familias marcadas hasta el radón.
      dibujo: TABLA({ periodos: 7 }),
    },
    resuelve: {
      pieza: 'quim-tira',
      generar(s) {
        const z = azar(s + 900).de(Z_RESUELVE), c = cuenta(z), menores = NOBLES.slice(1).filter(g => g < z), P = Math.max(4, c.p), up = arriba(z);
        const junto = up ? `justo encima, está el ${nom(up)}` : `justo debajo, está el ${nom(abajo(z))}`;
        return {
          enunciado: ['¿En qué periodo y en qué grupo está el elemento de ', Z, ` = ${z}? ¿Cómo se llama su familia?`],
          datos: [DT.nobles, DT.periodo, DT.despues, DT.antes, DT.familias],
          dibujo: TABLA({ periodos: P, marcas: {} }),
          pasos: [
            { tipo: 'pide', texto: 'Piden la fila (el periodo), la columna (el grupo) y el nombre de la familia.' },
            { tipo: 'datos', texto: `Con Z = ${z}, tiene antes ${menores.length === 1 ? 'un gas noble' : `${menores.length} gases nobles`} (Z = ${menores.join(', ')}). El más cercano es el ${nom(c.gas)}, Z = ${c.gas}.` },
            { tipo: 'regla', texto: 'El periodo sale de contar los gases nobles de Z menor. El grupo, de los lugares que lo separan de su gas noble más cercano.' },
            { tipo: 'cuentas', texto: `Está ${lug(c.k)} ${c.despues ? 'después' : 'antes'} del ${nom(c.gas)}.`,
              ecuacion: ['periodo = ', `${menores.length} + 1 = `, Pe(c.p), SEP, ...c.ecuacion],
              dibujo: TABLA({ periodos: P, marcas: {}, resaltar: [{ Z: z }], fila: { periodo: c.p, color: 'i' }, columna: { grupo: c.g, color: 'h' } }) },
            { tipo: 'sentido', texto: `En la lista de familias, el grupo ${grupoTxt(c.g)} es el de los ${FAMILIAS[c.g].toLowerCase()}. En su columna, ${junto}.` },
          ],
          respuesta: [Pe(`Periodo ${c.p}`), ', ', Gr(`grupo ${grupoTxt(c.g)}`), `: ${FAMILIA_UN[c.g]}`],
        };
      },
    },
    ahoraTu: {
      pieza: 'quim-tira',
      voz: 'Ubica primero el gas noble más cercano.',
      generar(sem) {
        const r = azar(sem * 101 + 17), tipo = sem % 6;
        return [casoFamilia, casoAbajo, casoPeriodo, casoLargo, casoPar, casoVF][tipo](r);
      },
    },
  };

  // ---------- Configuraciones para ubicar (ideas 2 y 3, fase 3, 19 nov) ----------
  // La configuración abreviada de un elemento, escrita como en Estructura atómica ([Ar] 4s² 3d⁶): el gas noble anterior y,
  // en orden de llenado, ns, (n − 2)f, (n − 1)d y np. Vale para los grupos 1, 2 y 13 a 18 hasta el radón y para los grupos
  // 3 a 12 de los periodos 4 y 5 (y del 72 al 80 en el periodo 6). Excepciones que la unidad nombra: Cr, Cu, Ag y Au (un
  // electrón del s pasa al d); las otras de la quinta fila (Nb, Mo, Ru, Rh, Pd) solo se dibujan, no se preguntan.
  const Ee = ficha('valencia');
  const SUPS = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const su = x => String(x).split('').map(c => SUPS[c]).join('');
  const ANOMALOS = { 24: [1, 5], 29: [1, 10], 41: [1, 4], 42: [1, 5], 44: [1, 7], 45: [1, 8], 46: [0, 10], 47: [1, 10], 78: [1, 9], 79: [1, 10] };
  Object.assign(NOMBRE2, { 39: 'itrio', 40: 'circonio', 41: 'niobio', 42: 'molibdeno', 43: 'tecnecio', 44: 'rutenio', 45: 'rodio', 46: 'paladio', 47: 'plata', 48: 'cadmio',
    74: 'wolframio', 78: 'platino', 79: 'oro', 80: 'mercurio' });
  // partes(z) → [[subnivel, electrones]…] después del gas noble.
  function partes(z) {
    const p = periodoDe(z), k = z - NOBLES[p - 1];
    if (p === 1) return [['1s', z]];
    if (p <= 3) return [[`${p}s`, Math.min(k, 2)], [`${p}p`, Math.max(k - 2, 0)]].filter(x => x[1] > 0);
    const f = p >= 6 ? 14 : 0, kk = k > 2 ? k - f : k;                     // en el periodo 6, tras el 6s² van los 14 del 4f
    let s = Math.min(kk, 2), d = Math.min(Math.max(kk - 2, 0), 10);
    if (ANOMALOS[z]) [s, d] = ANOMALOS[z];
    return [[`${p}s`, s], ...(k > 2 && f ? [[`${p - 2}f`, 14]] : []), [`${p - 1}d`, d], [`${p}p`, Math.max(kk - 12, 0)]].filter(x => x[1] > 0);
  }
  const gasDe = z => (periodoDe(z) > 1 ? S118[NOBLES[periodoDe(z) - 1] - 1] : '');
  const confTxt = z => `${gasDe(z) ? `[${gasDe(z)}] ` : ''}${partes(z).map(([n, e]) => `${n}${su(e)}`).join(' ')}`;
  // Lo que queda en el nivel más alto (los electrones de valencia de un representativo).
  const ultimoNivelTxt = z => partes(z).filter(([n]) => +n[0] === periodoDe(z)).map(([n, e]) => `${n}${su(e)}`).join(' ');
  const valenciaDe = z => partes(z).filter(([n]) => +n[0] === periodoDe(z)).reduce((a, [, e]) => a + e, 0);
  // El grupo de 1 a 18 con su romano: grupos A (1, 2, 13 a 18) y B (3 a 12).
  const ROMB = { 3: 'IIIB', 4: 'IVB', 5: 'VB', 6: 'VIB', 7: 'VIIB', 8: 'VIIIB', 9: 'VIIIB', 10: 'VIIIB', 11: 'IB', 12: 'IIB' };
  const grupoAB = g => `${g} (${ROM[g] || ROMB[g]})`;
  const grupoA = v => grupoAB(v <= 2 ? v : v + 10);                            // de los electrones de valencia al grupo A
  const ubTxt = (p, g) => `Periodo ${p}, grupo ${g}`;
  const LLENADO = 'Orden de llenado: 1s 2s 2p 3s 3p 4s 3d 4p 5s 4d 5p 6s 4f 5d 6p';
  const DU = {
    llenado: LLENADO,
    caben: 'Caben: 2 en un s, 6 en un p, 10 en un d, 14 en un f',
    periodo: 'periodo = el nivel más alto (el mayor n) que tiene electrones',
    grupoA: ['Grupos A: los electrones del nivel más alto dan el número romano (IA a VIIIA)'],
    numeros: 'Del romano al número: IA y IIA son 1 y 2; de IIIA a VIIIA, 10 más (13 a 18)',
    lewis: 'Símbolo de Lewis: un punto por cada electrón del nivel más alto',
    neutro: 'Átomo neutro: Z = número de electrones',
    gas: z => `[${gasDe(z)}]: los ${NOBLES[periodoDe(z) - 1]} electrones del ${nom(NOBLES[periodoDe(z) - 1])}`,
  };
  // Símbolo de Lewis de un átomo (quim-molecula): un punto por electrón de valencia, en violeta; primero uno por lado.
  function lewis(z, sim) {
    const v = z === 2 ? 2 : valenciaDe(z), c = [0, 0, 0, 0];
    if (z === 2) c[0] = 2; else for (let k = 0; k < v; k++) c[k % 4]++;
    const LADOS = [-90, 0, 90, 180];
    const cargas = c.map((n, i) => (n ? { en: 'a', t: n === 1 ? '•' : i % 2 ? ':' : '••', ang: LADOS[i], color: 'f' } : null)).filter(Boolean);
    return { pieza: 'quim-molecula', datos: { atomos: [{ id: 'a', t: sim || S118[z - 1], x: 0, y: 0 }], cargas, escala: 40, alto: 120,
      alt: `Símbolo de Lewis: ${sim || S118[z - 1]} rodeado de ${v} ${v === 1 ? 'punto' : 'puntos'}.` }, estado: {} };
  }
  const OBJ = (objetos, o) => ({ pieza: 'quim-tira', datos: Object.assign({ vista: 'objetos', simbolos: SIMBOLOS118, marcas: {}, objetos }, o), estado: {} });
  const TABLA0 = (o, estado) => TABLA(Object.assign({ marcas: {} }, o), estado);    // la tabla sin las marcas ●▲■ de la idea 1

  // ---------- Idea 2 (rehecha, 19 nov): ubicación de un representativo y notación de Lewis ----------
  // Propuesta §3 a §6, idea A2. Objeto de la primera pantalla: la bolsa de sal yodada de la cocina (quim-tira, de prueba).
  // Cambia: el elemento (Z de 1 a 20) · Permanece: la tabla y, abajo, su configuración · Progresa: del nivel más alto al
  // periodo y de sus electrones al grupo · Se reserva: un elemento con electrones d por dentro (el yodo) · Debe verse: la
  // fila (turquesa) y la columna (carmín) que salen de la configuración.
  // Errores (hipótesis; los AQ- equivalentes están en configuracion-ubicacion): QM-PERIODO-ANTERIOR (toma el periodo del
  // gas noble o del d de adentro), QM-SOLO-P (cuenta solo los p), QM-PERIODO-GRUPO (los intercambia; trampa de San Marcos
  // 2026-I), QM-GRUPO-B (suma 10 a un grupo que termina en s), QM-LEWIS-NIVEL, QM-LEWIS-GRUPO, QM-LEWIS-TODOS (puntos por
  // el nivel, por el número del grupo o por todos los electrones), QM-D-VALENCIA (cuenta los d de adentro), QM-CUENTA-GRUPO,
  // QM-FILA-COLUMNA y QM-HELIO (le da al helio el grupo 2).
  const REP20 = [3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 19, 20];
  const REP36 = [...REP20, 31, 32, 33, 34, 35];
  const REP86 = [37, 38, 49, 50, 51, 52, 53, 55, 56, 81, 82, 83, 84, 85];
  // Los de «Así se resuelve» no salen en «Ahora tú» (lector en frío, 19 nov: el silicio en los dos momentos).
  const RES_UBICA = [5, 6, 8, 14, 16, 32, 34], REP_AT = REP36.filter(z => !RES_UBICA.includes(z));
  // Las opciones de «periodo y grupo» de un representativo, con el error de cada una.
  function opcionesUbicar(z) {
    const p = periodoDe(z), g = grupoDe(z), v = valenciaDe(z), ops = [{ id: 'c', texto: ubTxt(p, grupoAB(g)), correcta: true }], vistos = new Set([ops[0].texto]);
    const mas = (id, texto, error, siFuera) => { if (ops.length < 4 && !vistos.has(texto)) { vistos.add(texto); ops.push({ id, texto, error, siFuera }); } };
    if (v !== p && v <= 7) mas('cambio', ubTxt(v, grupoA(p)), 'QM-PERIODO-GRUPO', `Bien los números ${p} y ${v}. Pero van al revés: el nivel más alto es el periodo.`);
    if (g >= 13) mas('solo-p', ubTxt(p, grupoA(v - 2)), 'QM-SOLO-P', `Bien el periodo. Pero el nivel ${p} tiene también sus dos electrones s: son ${v}, no ${v - 2}.`);
    else mas('grupo-b', ubTxt(p, `${g + 10} (${g === 1 ? 'IB' : 'IIB'})`), 'QM-GRUPO-B', 'Bien el periodo. Pero el 10 se suma solo cuando termina en p: aquí termina en s.');
    mas('anterior', ubTxt(p - 1, grupoAB(g)), 'QM-PERIODO-ANTERIOR', `Bien el grupo. Pero el periodo es el nivel más alto con electrones, el ${p}, no el del gas noble.`);
    mas('siguiente', ubTxt(p + 1, grupoAB(g)), 'QM-PERIODO-CUENTA', `Bien el grupo. Pero ningún electrón llega al nivel ${p + 1}: el más alto es el ${p}.`);
    return ops;
  }
  const cuentaValencia = z => { const u = partes(z).filter(([n]) => +n[0] === periodoDe(z)); return u.length > 1 ? [`${u.map(x => x[1]).join(' + ')} = `, Ee(valenciaDe(z))] : [Ee(valenciaDe(z))]; };
  const ecuacionUbicar = z => { const p = periodoDe(z), g = grupoDe(z), v = valenciaDe(z);
    return [Pe(`periodo ${p}`), SEP, ...(g >= 13 ? ['grupo = 10 + ', Ee(v), ' = ', Gr(grupoAB(g))] : ['grupo = ', Ee(v), ' → ', Gr(grupoAB(g))])]; };
  function casoUbicar(r) {
    const z = r.de(REP_AT);
    return {
      pregunta: ['El ', nom(z), ' (', Z, ` = ${z}) tiene la configuración ${confTxt(z)}. ¿En qué periodo y en qué grupo está?`],
      datos: [DU.periodo, DU.grupoA, DU.numeros, DU.gas(z)],
      opciones: opcionesUbicar(z),
      solucion: { texto: `El nivel más alto es el ${periodoDe(z)}; ahí hay ${valenciaDe(z)} ${valenciaDe(z) === 1 ? 'electrón' : 'electrones'} (${ultimoNivelTxt(z)}).`, ecuacion: ecuacionUbicar(z) },
    };
  }
  function casoLewis(r) {
    const z = r.de(REP_AT.filter(x => grupoDe(x) >= 13)), p = periodoDe(z), g = grupoDe(z), v = valenciaDe(z);
    return {
      pregunta: `La configuración de un elemento termina en ${ultimoNivelTxt(z)}. ¿Cuántos puntos lleva su símbolo de Lewis?`,
      datos: [DU.lewis],
      opciones: opcionesN(v, [
        { id: 'solo-p', valor: v - 2, error: 'QM-SOLO-P', siFuera: `Bien contar los ${v - 2} electrones p. Pero el nivel ${p} tiene también sus dos electrones s.` },
        { id: 'grupo', valor: g, error: 'QM-LEWIS-GRUPO', siFuera: `Ese es su grupo, bien hallado. Pero los puntos son los electrones del nivel ${p}: 10 menos.` },
        { id: 'nivel', valor: p === v ? NaN : p, error: 'QM-LEWIS-NIVEL', siFuera: 'Bien mirar el nivel más alto. Pero se cuentan sus electrones, no su número.' },
      ], x => `${x}`),
      solucion: { texto: `Un punto por cada electrón del nivel ${p}: los s y los p.`, ecuacion: cuentaValencia(z), dibujo: lewis(z, 'X') },
    };
  }
  function casoZ(r) {
    const z = r.de(REP_AT), p = periodoDe(z), g = grupoDe(z), v = valenciaDe(z);
    return {
      pregunta: ['Un elemento está en el periodo ', `${p} y en el grupo ${ROM[g]} de la tabla periódica. ¿Cuál es su número atómico?`],
      datos: [DU.llenado, DU.caben, DU.periodo, DU.grupoA, DU.neutro],
      opciones: opcionesN(z, [
        { id: 'arriba', valor: arriba(z) || z - 8, error: 'QM-PERIODO-ANTERIOR', siFuera: `Bien el grupo. Pero ese llega solo hasta el nivel ${p - 1}: falta llenar un nivel más.` },
        { id: 'abajo', valor: abajo(z), error: 'QM-PERIODO-CUENTA', siFuera: `Bien el grupo. Pero ese ya tiene electrones en el nivel ${p + 1}: se pasó de periodo.` },
        { id: 'vecino', valor: g >= 13 && v > 3 ? z + 2 : z + 1, error: g >= 13 && v > 3 ? 'QM-SOLO-P' : 'QM-CUENTA-GRUPO', siFuera: g >= 13 && v > 3 ? `Bien el periodo. Pero ${ROM[g]} no son ${v} electrones p: son ${v} entre los s y los p.` : 'Bien el periodo. Pero cuenta de nuevo los electrones del nivel más alto: sobra uno.' },
      ], x => `${x}`),
      solucion: { texto: `Su nivel más alto es el ${p}, con ${v} ${v === 1 ? 'electrón' : 'electrones'}: ${confTxt(z)}.`, ecuacion: [`${NOBLES[p - 1]} + ${z - NOBLES[p - 1]} = `, Pz(z)] },
    };
  }
  function casoPesado(r) {
    const z = r.de(REP86), p = periodoDe(z);
    return {
      pregunta: ['¿En qué periodo y en qué grupo de la tabla periódica está el elemento de ', Z, ` = ${z}?`],
      datos: [DU.llenado, DU.caben, DU.periodo, DU.grupoA, DU.numeros],
      opciones: opcionesUbicar(z),
      solucion: { texto: `${confTxt(z)}: el nivel más alto es el ${p}, con ${valenciaDe(z)} ${valenciaDe(z) === 1 ? 'electrón' : 'electrones'}.`, ecuacion: ecuacionUbicar(z) },
    };
  }
  function casoFamilia2(r) {
    // Del aluminio al cloro: el de abajo está en el periodo 4, donde hay metales de transición con los mismos electrones tras el argón.
    const z = r.de([13, 15, 17]), b = abajo(z), g = grupoDe(z), otro = g >= 17 ? b - 2 : b + 1, fila = g >= 17 ? z - 1 : z + 1;
    return {
      pregunta: `¿Cuál de estas configuraciones es de un elemento de la misma familia que el ${nom(z)} (${confTxt(z)})?`,
      datos: [DU.grupoA, DU.gas(b), DU.gas(z)].filter((x, i, l) => l.indexOf(x) === i),
      opciones: [
        { id: 'c', texto: confTxt(b), correcta: true },
        { id: 'fila', texto: confTxt(fila), error: 'QM-FILA-COLUMNA', siFuera: `Ese está en su mismo periodo, cierto. Pero una familia tiene los mismos electrones en el último nivel.` },
        { id: 'cuenta', texto: confTxt(otro), error: 'QM-CUENTA-GRUPO', siFuera: `Bien buscar en el periodo siguiente. Pero su último nivel tiene ${valenciaDe(otro)} electrones, no ${valenciaDe(z)}.` },
        { id: 'd', texto: confTxt(NOBLES[periodoDe(b) - 1] + 2 + valenciaDe(z)), error: 'QM-D-VALENCIA', siFuera: `Tiene ${valenciaDe(z)} electrones d, como los de valencia del ${nom(z)}, cierto. Pero termina en d: no es un grupo A.` },
      ],
      solucion: { texto: `El ${nom(z)} tiene ${valenciaDe(z)} electrones en su último nivel (${ultimoNivelTxt(z)}); el de abajo, también: ${ultimoNivelTxt(b)}.`, ecuacion: [Gr(`grupo ${grupoAB(g)}`)] },
    };
  }

  // Ejemplos de la idea 2. Cuentas rehechas aparte (scratchpad, e5-quimica/cuentas-a.py): Na 3s¹ → periodo 3 · Cl 3s² 3p⁵
  // → 2 + 5 = 7 · Mg [Ne] 3s² → grupo 2 (IIA) · N 2s² 2p³ → 5 puntos · VIA → 16 · P (15): 1s² 2s² 2p⁶ 3s² 3p³ → periodo 3,
  // grupo 15 (VA) · 4s² 4p⁵ → periodo 4, grupo 17, Z = 18 + 2 + 10 + 5 = 35 · periodo 3, IIIA → 10 + 3 = 13 · He: 2 e⁻,
  // grupo 18 · 6 puntos en el periodo 3 → azufre, 16 · At (85): [Xe] 6s² 4f¹⁴ 5d¹⁰ 6p⁵ → periodo 6, grupo 17 · 3 niveles y 5
  // de valencia → 2 + 8 + 5 = 15 (errores 13, 33, 7, 23) · Se (34): [Ar] 4s² 3d¹⁰ 4p⁴ → periodo 4, grupo 16, 6 puntos ·
  // 3s² 3p⁴ y 4s² 3d¹⁰ 4p⁴: misma familia (VIA), periodos 3 y 4 · Sr (38): [Kr] 5s² → periodo 5, grupo 2.
  const EJEMPLOS_UBICACION = [
    { nivel: 1, titulo: 'El periodo del sodio',
      enunciado: 'El sodio de la sal tiene la configuración 1s² 2s² 2p⁶ 3s¹. ¿En qué periodo de la tabla periódica está?',
      datos: [DU.periodo],
      solucion: [{ texto: 'El nivel más alto con electrones es el 3 (el 3s¹): ese número es su periodo.', ecuacion: [Pe('periodo 3')] }],
      respuesta: [Pe('Periodo 3')] },
    { nivel: 1, titulo: 'Los de valencia del cloro',
      enunciado: 'La configuración del cloro termina en 3s² 3p⁵. ¿Cuántos electrones tiene en su nivel más alto?',
      datos: ['Electrones de valencia: los del nivel más alto'],
      solucion: [{ texto: 'En el nivel 3 hay electrones s y electrones p: se suman los dos.', ecuacion: ['2 + 5 = ', Ee(7)] }],
      respuesta: [Ee('7 electrones'), ' de valencia'] },
    { nivel: 1, titulo: 'El grupo del magnesio',
      enunciado: 'El magnesio tiene la configuración [Ne] 3s². ¿En qué grupo de la tabla periódica está?',
      datos: [DU.grupoA, '[Ne]: los 10 electrones del neón'],
      solucion: [{ texto: 'En su nivel más alto, el 3, hay 2 electrones: el romano es II y la letra, A.', ecuacion: [Ee(2), ' → ', Gr('grupo 2 (IIA)')] }],
      respuesta: [Gr('Grupo 2 (IIA)')] },
    { nivel: 1, titulo: 'Los puntos del nitrógeno',
      enunciado: 'La configuración del nitrógeno termina en 2s² 2p³. ¿Cuántos puntos lleva su símbolo de Lewis?',
      datos: [DU.lewis],
      figura: lewis(7, 'N').datos.cargas && { pieza: 'quim-molecula', datos: { atomos: [{ id: 'a', t: 'N', x: 0, y: 0 }], escala: 40, alto: 120, alt: 'El símbolo del nitrógeno, todavía sin puntos.' }, estado: {} },
      solucion: [{ texto: 'Un punto por cada electrón del nivel 2: los dos s y los tres p.', ecuacion: ['2 + 3 = ', Ee(5)] }],
      respuesta: [Ee('5 puntos')] },
    { nivel: 1, titulo: 'Del romano al número',
      enunciado: 'Un examen dice que el oxígeno está en el grupo VIA. ¿Qué número de grupo, del 1 al 18, es ese?',
      datos: [DU.numeros],
      solucion: [{ texto: 'De IIIA a VIIIA se suma 10 al número romano. VI es 6.', ecuacion: ['6 + 10 = ', Gr(16)] }],
      respuesta: [Gr('Grupo 16')] },
    { nivel: 2, titulo: 'Dónde está el fósforo',
      enunciado: 'El fósforo de las cerillas tiene Z = 15. ¿En qué periodo y en qué grupo está?',
      datos: [DU.llenado, DU.caben, DU.periodo, DU.grupoA, DU.numeros],
      solucion: [
        { texto: 'Reparto sus 15 electrones en el orden de llenado.', ecuacion: ['1s² 2s² 2p⁶ 3s² 3p³'] },
        { texto: 'El nivel más alto es el 3, con 2 + 3 = 5 electrones: VA, que es 10 + 5.', ecuacion: [Pe('periodo 3'), SEP, 'grupo = 10 + ', Ee(5), ' = ', Gr('15 (VA)')] },
      ],
      respuesta: [Pe('Periodo 3'), ', ', Gr('grupo 15 (VA)')] },
    { nivel: 2, titulo: 'De la terminación al elemento',
      enunciado: 'La configuración de un elemento es [Ar] 4s² 3d¹⁰ 4p⁵. ¿Cuál es su número atómico y en qué grupo está?',
      datos: [DU.grupoA, DU.numeros, '[Ar]: los 18 electrones del argón'],
      solucion: [
        { texto: 'Sumo todos sus electrones: los del argón y los que siguen.', ecuacion: ['18 + 2 + 10 + 5 = ', Pz(35)] },
        { texto: 'En el nivel 4 hay 2 + 5 = 7: los 3d¹⁰ son del nivel 3 y no cuentan.', ecuacion: ['grupo = 10 + ', Ee(7), ' = ', Gr('17 (VIIA)')] },
      ],
      respuesta: [Z, ' = ', Pz(35), ', ', Gr('grupo 17 (VIIA)'), ': el bromo'] },
    { nivel: 2, titulo: 'Del lugar al número atómico',
      enunciado: 'Un elemento está en el periodo 3 y en el grupo IIIA. ¿Cuál es su número atómico?',
      datos: [DU.llenado, DU.caben, DU.periodo, DU.grupoA, DU.neutro],
      solucion: [
        { texto: 'Periodo 3 y IIIA: tres electrones en el nivel 3. Los niveles 1 y 2 van llenos.', ecuacion: ['1s² 2s² 2p⁶ 3s² 3p¹'] },
        { texto: 'En el átomo neutro, Z es el total de electrones: sumo los exponentes.', ecuacion: ['2 + 2 + 6 + 2 + 1 = ', Pz(13)] },
      ],
      respuesta: [Z, ' = ', Pz(13), ': el aluminio'] },
    { nivel: 2, titulo: 'El helio, la excepción',
      enunciado: 'El helio de los globos tiene la configuración 1s². ¿Cuántos puntos lleva su símbolo de Lewis y por qué no está en el grupo IIA?',
      datos: [DU.lewis, 'Con 2 electrones, el nivel 1 ya está lleno', 'Gases nobles: grupo 18 (VIIIA); casi no reaccionan'],
      solucion: [
        { texto: 'Tiene 2 electrones en su nivel más alto: dos puntos.', ecuacion: [Ee('2 puntos')] },
        { texto: 'Pero su nivel está lleno y casi no reacciona: se porta como un gas noble y va con ellos.', ecuacion: [Gr('grupo 18 (VIIIA)')] },
      ],
      respuesta: [Ee('2 puntos'), '; va en el ', Gr('grupo 18'), ' por su nivel lleno'] },
    { nivel: 2, titulo: 'Seis puntos en el periodo 3',
      enunciado: 'El símbolo de Lewis de un elemento del periodo 3 lleva 6 puntos. ¿En qué grupo está y cuál es su número atómico?',
      datos: [DU.lewis, DU.grupoA, DU.numeros, DU.llenado, DU.caben],
      figura: lewis(16, 'X'),
      solucion: [
        { texto: 'Seis puntos son 6 electrones en el nivel 3: VIA, que es 10 + 6.', ecuacion: ['grupo = 10 + ', Ee(6), ' = ', Gr('16 (VIA)')] },
        { texto: 'Su configuración llena los niveles 1 y 2 y pone 6 en el 3.', ecuacion: ['1s² 2s² 2p⁶ 3s² 3p⁴', SEP, '2 + 8 + 6 = ', Pz(16)] },
      ],
      respuesta: [Gr('Grupo 16 (VIA)'), ', ', Z, ' = ', Pz(16), ': el azufre'] },
    { nivel: 3, titulo: 'Un halógeno pesado',
      enunciado: 'El astato tiene Z = 85 y su configuración es [Xe] 6s² 4f¹⁴ 5d¹⁰ 6p⁵. ¿En qué periodo y en qué grupo está?',
      alternativas: ['Periodo 5, grupo 17 (VIIA)', 'Periodo 6, grupo 15 (VA)', 'Periodo 6, grupo 17 (VIIA)', 'Periodo 7, grupo 6 (VIB)', 'Periodo 4, grupo 17 (VIIA)'],
      datos: [DU.periodo, DU.grupoA, DU.numeros, '[Xe]: los 54 electrones del xenón'],
      solucion: [
        { texto: 'El nivel más alto con electrones es el 6: el 4f y el 5d son de niveles de adentro.', ecuacion: [Pe('periodo 6')] },
        { texto: 'En el nivel 6 hay 2 + 5 = 7 electrones: VIIA.', ecuacion: ['grupo = 10 + ', Ee(7), ' = ', Gr(17)] },
        { texto: ['La ', letra('A'), ' toma el periodo del 5d y la ', letra('E'), ', el del 4f. La ', letra('B'), ' cuenta solo los 6p.'] },
        { texto: ['La ', letra('D'), ' intercambia los dos números: 7 de valencia y nivel 6.'] },
      ],
      respuesta: [letra('C'), ', ', Pe('periodo 6'), ', ', Gr('grupo 17 (VIIA)')] },
    { nivel: 3, titulo: 'Tres niveles y cinco de valencia',
      enunciado: 'Un átomo neutro tiene electrones en tres niveles y 5 electrones de valencia. ¿Cuál es su número atómico?',
      alternativas: ['13', '33', '7', '23', '15'],
      datos: [DU.llenado, DU.caben, 'Electrones de valencia: los del nivel más alto'],
      solucion: [
        { texto: 'Tres niveles: el más alto es el 3. Con 5 electrones ahí, termina en 3s² 3p³.', ecuacion: ['1s² 2s² 2p⁶ 3s² 3p³'] },
        { texto: 'Sumo los electrones de los tres niveles.', ecuacion: ['2 + 8 + 5 = ', Pz(15)] },
        { texto: ['La ', letra('A'), ' pone 3 electrones en el nivel 3: 2 + 8 + 3. La ', letra('C'), ' usa solo dos niveles: 2 + 5.'] },
        { texto: ['La ', letra('B'), ' llega al nivel 4: es el de abajo, 15 + 18. La ', letra('D'), ' suma 5 electrones d: 18 + 5.'] },
      ],
      respuesta: [letra('E'), ', ', Z, ' = ', Pz(15), ': el fósforo'] },
    { nivel: 3, titulo: 'El selenio, completo',
      enunciado: 'Para el selenio (Z = 34), ¿qué afirmación es correcta?',
      alternativas: ['Está en el periodo 4 y su símbolo de Lewis lleva 6 puntos.', 'Está en el periodo 3, porque termina en 3d¹⁰.', 'Está en el grupo IVA, porque termina en 4p⁴.', 'Su símbolo de Lewis lleva 16 puntos.', 'Tiene 4 electrones de valencia.'],
      datos: [DU.llenado, DU.caben, DU.periodo, DU.grupoA, DU.lewis],
      solucion: [
        { texto: 'Reparto sus 34 electrones.', ecuacion: ['[Ar] 4s² 3d¹⁰ 4p⁴'] },
        { texto: 'El nivel más alto es el 4, con 2 + 4 = 6 electrones: VIA y 6 puntos.', ecuacion: [Pe('periodo 4'), SEP, Ee(6), ' → ', Gr('grupo 16 (VIA)')] },
        { texto: ['La ', letra('B'), ' toma el periodo del 3d. La ', letra('C'), ' y la ', letra('E'), ' cuentan solo los 4p.'] },
        { texto: ['La ', letra('D'), ' pone un punto por cada número del grupo: son 6, los de valencia.'] },
      ],
      respuesta: [letra('A'), ', ', Pe('periodo 4'), ' y ', Ee('6 puntos')] },
    { nivel: 3, titulo: 'Dos terminaciones',
      enunciado: 'El elemento X termina su configuración en 3s² 3p⁴ y el elemento Q, en 4s² 3d¹⁰ 4p⁴. ¿Qué afirmación es correcta?',
      alternativas: ['Están en el mismo periodo.', 'Q tiene 16 electrones de valencia.', 'X está en el grupo IVA.', 'Están en el mismo grupo, en periodos seguidos.', 'Q está en el grupo VIB, porque tiene electrones d.'],
      datos: [DU.periodo, DU.grupoA, DU.numeros, 'Electrones de valencia: los del nivel más alto'],
      solucion: [
        { texto: 'X: nivel más alto 3, con 2 + 4 = 6 electrones. Q: nivel más alto 4, con 2 + 4 = 6.', ecuacion: [Pe('periodos 3 y 4'), SEP, Ee(6), ' en los dos → ', Gr('grupo 16 (VIA)')] },
        { texto: ['La ', letra('A'), ' los pone en una misma fila: sus niveles más altos son el 3 y el 4. La ', letra('B'), ' suma los 3d¹⁰, que son del nivel 3.'] },
        { texto: ['La ', letra('C'), ' cuenta solo los 3p. La ', letra('E'), ' olvida que Q termina en p: es un grupo A.'] },
      ],
      respuesta: [letra('D'), ', los dos en el ', Gr('grupo 16 (VIA)')] },
    { nivel: 3, titulo: 'El estroncio de los fuegos',
      enunciado: 'El estroncio da el rojo de los fuegos artificiales. Tiene Z = 38. ¿En qué periodo y en qué grupo está?',
      alternativas: ['Periodo 4, grupo 2 (IIA)', 'Periodo 5, grupo 2 (IIA)', 'Periodo 5, grupo 12 (IIB)', 'Periodo 2, grupo 15 (VA)', 'Periodo 5, grupo 1 (IA)'],
      datos: [DU.llenado, DU.caben, DU.periodo, DU.grupoA],
      solucion: [
        { texto: 'Reparto sus 38 electrones: después del 4p viene el 5s.', ecuacion: ['[Kr] 5s²', SEP, '36 + 2 = ', Pz(38)] },
        { texto: 'El nivel más alto es el 5, con 2 electrones: IIA.', ecuacion: [Pe('periodo 5'), SEP, Ee(2), ' → ', Gr('grupo 2 (IIA)')] },
        { texto: ['La ', letra('A'), ' toma el periodo del kriptón. La ', letra('C'), ' suma 10 aunque termina en s.'] },
        { texto: ['La ', letra('D'), ' intercambia los números. La ', letra('E'), ' cuenta un solo electrón en el 5s.'] },
      ],
      respuesta: [letra('B'), ', ', Pe('periodo 5'), ', ', Gr('grupo 2 (IIA)')] },
  ];

  const yodo = 53;
  const ubicacion = {
    id: 'ubicacion-lewis',
    titulo: 'Ubicación y notación de Lewis',
    pregunta: '¿Cómo se sabe dónde va un elemento con solo su configuración?',
    temas: ['Ubicación de un elemento', 'Notación de Lewis'],
    pieza: 'quim-tira',
    aprendizaje: 'El periodo es el nivel más alto con electrones. En los grupos A, sus electrones dan el grupo y los puntos de Lewis.',
    actividad: 'Recorrer los primeros 20 elementos y comparar su configuración con su fila y su columna.',
    lee: {
      tarjetas: [
        { titulo: 'La sal yodada', texto: 'La sal de la cocina lleva un poco de yodo, el elemento de Z = 53. ¿En qué fila y en qué columna de la tabla está? No hace falta buscarlo: su configuración electrónica lo dice.',
          pieza: 'quim-tira', dibujo: OBJ([{ que: 'sal', Z: yodo, nombre: 'yodo' }]) },
        { titulo: 'Lo que ya sabes', texto: 'De Estructura atómica: los electrones llenan los subniveles en orden (1s, 2s, 2p, 3s…) y el nivel de mayor n con electrones es la capa de valencia. Sus electrones se llaman electrones de valencia.',
          ecuacion: ['S: 1s² 2s² 2p⁶ 3s² 3p⁴ = [Ne] 3s² 3p⁴'] },
        { titulo: 'Dos maneras de nombrar un grupo', texto: 'La tabla numera las columnas del 1 al 18. El examen usa además romanos con letra: IA y IIA son las columnas 1 y 2; de IIIA a VIIIA, las columnas 13 a 18. Esos son los grupos A o elementos representativos.' },
        { titulo: 'Qué mirar', texto: 'En el juego eliges un elemento y abajo sale su configuración. Compara el nivel más alto con la fila marcada, y los electrones de ese nivel con la columna.' },
      ],
    },
    ejemplos: EJEMPLOS_UBICACION,
    juega: {
      pieza: 'quim-tira',
      consigna: 'Cada elemento, con su configuración abajo. La fila marcada es su periodo; la columna, su grupo.',
      mision: {
        texto: 'Encuentra el elemento del periodo 3 que tiene 6 electrones en su nivel más alto.',
        logrado: v => periodoDe(v.z) === 3 && valenciaDe(v.z) === 6,
        bien: 'El azufre: nivel más alto 3, con 2 + 4 electrones. Mira su fila y su columna.',
      },
      voz: 'Compara el último nivel con la fila marcada.',
      leyenda: [
        { s: Z, t: 'número atómico: los electrones del átomo neutro' },
        { s: Ee('e⁻'), t: 'electrones del nivel más alto (de valencia)' },
        { s: '[He], [Ne], [Ar]', t: 'los electrones del helio, del neón, del argón' },
        { s: 'IA … VIIIA', t: 'el grupo, como lo escribe el examen' },
      ],
      controles: [{ id: 'z', etiqueta: 'Elemento (Z)', color: 'c-o', min: 1, max: 20, paso: 1, inicio: 11, decimales: 0 }],
      dibujo: v => TABLA0({ periodos: 4, hasta: 20, resaltar: [{ Z: v.z }], fila: { periodo: periodoDe(v.z), color: 'i' }, columna: { grupo: grupoDe(v.z), color: 'h' }, rotulo: `${S118[v.z - 1]}: ${confTxt(v.z)}` }),
      lectura: v => {
        const p = periodoDe(v.z), g = grupoDe(v.z), val = valenciaDe(v.z);
        if (v.z === 2) return ['Helio: ', Ee('2 e⁻'), ', pero va con los gases nobles: ', Gr('grupo 18 (VIIIA)'), '.'];
        return [`Nivel más alto: ${p}, con `, Ee(`${val} e⁻`), ': ', Pe(`periodo ${p}`), ', ', Gr(`grupo ${grupoAB(g)}`), '.'];
      },
      minimo: 4,
    },
    predice: {
      pieza: 'quim-tira',
      pregunta: ['El yodo de la sal yodada tiene ', Z, ' = 53 y su configuración es [Kr] 5s² 4d¹⁰ 5p⁵. ¿En qué periodo está y cuántos electrones de valencia tiene?'],
      datos: ['[Kr]: los 36 electrones del kriptón', 'Kriptón: periodo 4'],
      voz: 'Mira qué electrones están en el nivel más alto.',
      opciones: [
        { id: 'c', texto: 'Periodo 5, con 7 electrones de valencia', correcta: true },
        { id: 'anterior', texto: 'Periodo 4, con 7 electrones de valencia', error: 'QM-PERIODO-ANTERIOR', siFuera: 'Bien los 7 de valencia. Pero el yodo ya tiene electrones en el nivel 5: ese es su periodo.' },
        { id: 'solo-p', texto: 'Periodo 5, con 5 electrones de valencia', error: 'QM-SOLO-P', siFuera: 'Contaste los cinco 5p, bien. Pero el nivel 5 tiene también los dos 5s.' },
        { id: 'con-d', texto: 'Periodo 5, con 17 electrones de valencia', error: 'QM-D-VALENCIA', siFuera: 'Bien el periodo. Pero los 4d¹⁰ son del nivel 4, que quedó adentro: no son de valencia.' },
      ],
      dibujo: OBJ([{ que: 'sal', Z: yodo, nombre: 'yodo' }], { rotulo: '[Kr] 5s² 4d¹⁰ 5p⁵' }),
      revelar: TABLA0({ periodos: 5, resaltar: [{ Z: yodo }], fila: { periodo: 5, color: 'i' }, columna: { grupo: 17, color: 'h' }, rotulo: 'I: [Kr] 5s² 4d¹⁰ 5p⁵' }),
      coincide: 'Coincide: el nivel más alto es el 5, y en él hay 2 + 5 = 7 electrones. Los 4d¹⁰ son del nivel 4.',
      noCoincide: 'El nivel más alto es el 5: periodo 5. En él hay 2 + 5 = 7 electrones; los 4d¹⁰ son del nivel 4 y no cuentan.',
    },
    mira: {
      pieza: 'quim-tira',
      datos: { simbolos: SIMBOLOS118, marcas: {}, vista: 'tabla', periodos: 5, resaltar: [{ Z: yodo, desde: 1 }, { Z: 2, desde: 6 }], fila: { periodo: 5, color: 'i', desde: 1 }, columna: { grupo: 17, color: 'h', desde: 3 },
        rotulo: 'I: [Kr] 5s² 4d¹⁰ 5p⁵' },
      voz: 'Sigamos al yodo, del nivel más alto a su lugar.',
      pasos: [
        { estado: { corte: 1 }, texto: 'El nivel más alto del yodo es el 5: ese es su periodo.', ecuacion: ['5s² … 5p⁵', SEP, Pe('periodo 5')] },
        { estado: { corte: 2 }, texto: 'En el nivel 5 hay 2 + 5 electrones: los de valencia.', ecuacion: ['2 + 5 = ', Ee(7)] },
        { estado: { corte: 3 }, texto: 'Siete es VII. Termina en p: es VIIA, la columna 10 + 7.', ecuacion: ['grupo = 10 + ', Ee(7), ' = ', Gr('17 (VIIA)')] },
        { estado: { corte: 4 }, texto: 'Los 4d¹⁰ no cuentan: son del nivel 4, que quedó adentro.', ecuacion: ['4d¹⁰: nivel 4'] },
        { estado: { corte: 5 }, texto: 'Su símbolo de Lewis lleva un punto por electrón de valencia.', ecuacion: [Ee('7 puntos'), ' alrededor de I'] },
        { estado: { corte: 6 }, texto: 'El helio es la excepción: 2 electrones, pero va en el grupo 18.', ecuacion: ['He: 1s²', SEP, Gr('grupo 18 (VIIIA)')] },
      ],
    },
    regla: {
      texto: 'El periodo es el nivel más alto con electrones. En los grupos A, sus electrones, los de valencia, dan el romano del grupo y los puntos de Lewis.',
      ecuacion: [Pe('periodo'), ' = mayor n', SEP, { llave: [Gr('grupo'), ' = ', Ee('e⁻ de valencia')], nota: 'termina en s: IA, IIA' }, SEP, { llave: [Gr('grupo'), ' = 10 + ', Ee('e⁻ de valencia')], nota: 'termina en p: IIIA a VIIIA' }],
      condicion: 'el elemento es representativo: su configuración termina en s o en p (el helio va en el grupo 18).',
      voz: 'Primero el nivel más alto; después, cuenta.',
      dibujo: lewis(16),
    },
    resuelve: {
      pieza: 'quim-tira',
      generar(s) {
        const z = azar(s + 900).de(RES_UBICA), p = periodoDe(z), g = grupoDe(z), v = valenciaDe(z);
        return {
          enunciado: ['Un elemento tiene ', Z, ` = ${z}. ¿En qué periodo y grupo está, y cuántos puntos lleva su símbolo de Lewis?`],
          datos: [DU.llenado, DU.caben, DU.periodo, DU.grupoA, DU.numeros, DU.lewis],
          dibujo: TABLA0({ periodos: 4 }),
          pasos: [
            { tipo: 'pide', texto: 'Piden tres cosas: el periodo, el grupo y los puntos del símbolo de Lewis.' },
            { tipo: 'datos', texto: `El átomo neutro tiene ${z} electrones. Los reparto en el orden de llenado.`, ecuacion: [confTxt(z).replace(/^\[\w+\] /, z > 18 ? '1s² 2s² 2p⁶ 3s² 3p⁶ ' : z > 10 ? '1s² 2s² 2p⁶ ' : '1s² ')] },
            { tipo: 'regla', texto: 'El nivel más alto es el periodo. Sus electrones dan el romano del grupo A y los puntos de Lewis.' },
            { tipo: 'cuentas', texto: `El nivel más alto es el ${p}, con ${ultimoNivelTxt(z)}. Termina en p: el grupo es 10 más.`,
              ecuacion: [...cuentaValencia(z), SEP, ...ecuacionUbicar(z)],
              dibujo: TABLA0({ periodos: 4, resaltar: [{ Z: z }], fila: { periodo: p, color: 'i' }, columna: { grupo: g, color: 'h' } }) },
            { tipo: 'sentido', texto: `Es el ${nom(z)}. Los exponentes suman ${z}, su Z, y sus ${v} puntos son los electrones del nivel ${p}.` },
          ],
          respuesta: [Pe(`Periodo ${p}`), ', ', Gr(`grupo ${grupoAB(g)}`), '; ', Ee(`${v} puntos`)],
        };
      },
    },
    ahoraTu: {
      pieza: 'quim-tira',
      voz: 'Busca el nivel más alto y cuenta sus electrones.',
      generar(sem) {
        const r = azar(sem * 101 + 23), tipo = sem % 5;
        return [casoUbicar, casoLewis, casoZ, casoPesado, casoFamilia2][tipo](r);
      },
    },
  };

  // ---------- Idea 3 (nueva, 19 nov): bloques y metales de transición ----------
  // Propuesta §3 a §6, idea A3. Objeto de la primera pantalla: un clavo de hierro, un cable de cobre y un anillo de plata
  // (quim-tira, de prueba). No se afirma de qué es ninguna moneda (no hay fuente).
  // Cambia: el metal del periodo 4 (del escandio al cinc) · Permanece: los grupos 3 a 12 abiertos, con su romano · Progresa:
  // de la configuración al grupo, sumando los ns y los (n − 1)d · Se reserva: el periodo 5 (la plata es lo que se predice)
  // · Debe verse: que el periodo es el nivel de afuera, aunque el d se llene después.
  // Errores (hipótesis; el primero es la trampa que anota San Marcos 2024-I): QM-PERIODO-D (toma el periodo del d),
  // QM-GRUPO-SOLO-D, QM-GRUPO-SOLO-S (cuenta solo los d o solo los s), QM-GRUPO-A-B (suma 10 o le pone la letra A),
  // QM-BLOQUE-AFUERA (el bloque por el nivel de afuera), QM-BLOQUE-P, QM-BLOQUE-F, QM-TRANSICION-INTERNA (llama transición
  // interna a un metal del bloque d; San Marcos 2025-I), QM-PERIODO-CUENTA y QM-VF-*.
  const TRANS = (o, estado) => ({ pieza: 'quim-tira', datos: Object.assign({ vista: 'transicion', simbolos: SIMBOLOS118, marcas: {} }, o), estado: estado || {} });
  const sd = z => { const p = periodoDe(z), x = partes(z); return { p, s: (x.find(([n]) => n === `${p}s`) || [0, 0])[1], d: (x.find(([n]) => n === `${p - 1}d`) || [0, 0])[1] }; };
  const grupoD = z => { const { s, d } = sd(z); return s + d; };
  const losDel = (k, sub) => (k === 1 ? `el electrón del ${sub}` : `los ${k} del ${sub}`);
  const EXCEPCION = [24, 29, 47, 79];
  const excepcionTxt = z => { const p = periodoDe(z); return `es una excepción: un electrón del ${p}s pasó al ${p - 1}d`; };
  const DB = {
    bloque: 'Bloque: el subnivel (s, p, d o f) donde cae el último electrón',
    grupoB: ['Bloque d: grupo = electrones ns + electrones (n − 1)d'],
    romanos: 'Grupos B: 3 a 7 son IIIB a VIIB; 8, 9 y 10, VIIIB; 11, IB; 12, IIB',
    interna: 'Transición interna: los elementos del bloque f',
  };
  function opcionesD(z) {
    const { p, s, d } = sd(z), g = s + d, ops = [{ id: 'c', texto: ubTxt(p, grupoAB(g)), correcta: true }], vistos = new Set([ops[0].texto]);
    const mas = (id, texto, error, siFuera) => { if (ops.length < 4 && !vistos.has(texto)) { vistos.add(texto); ops.push({ id, texto, error, siFuera }); } };
    mas('periodo-d', ubTxt(p - 1, grupoAB(g)), 'QM-PERIODO-D', `Bien el grupo. Pero el periodo es el nivel más alto, el ${p}: el d es del nivel ${p - 1}.`);
    mas('solo-d', ubTxt(p, grupoAB(d)), 'QM-GRUPO-SOLO-D', `Contaste ${d === 1 ? 'el electrón d' : `los ${d} electrones d`}, bien. Pero en el bloque d también cuentan los ${s === 1 ? 'del s' : 'dos del s'} de afuera.`);
    mas('solo-s', ubTxt(p, grupoAB(s)), 'QM-GRUPO-SOLO-S', 'Así sería si terminara en s. Pero termina en d: sus electrones d también cuentan.');
    if (g <= 8 || g >= 11) mas('a-b', ubTxt(p, g <= 8 ? `${g + 10} (${ROM[g + 10]})` : `${g - 10} (${ROM[g - 10]})`), 'QM-GRUPO-A-B', 'Bien el periodo. Pero termina en d: es un grupo B, y su número es justo la suma.');
    return ops;
  }
  const ecuacionD = z => { const { p, s, d } = sd(z); return [Pe(`periodo ${p}`), SEP, 'grupo = ', Ee(s), ' + ', Ee(d), ' = ', Gr(grupoAB(s + d))]; };
  // Sin los de «Así se resuelve» (21, 24, 29, 39 y 47): el oro queda como la excepción de «Ahora tú».
  const Z_D = [22, 23, 25, 26, 27, 28, 30, 40, 48, 79, 80];
  function casoUbicarD(r) {
    const z = r.de(Z_D), { p, s, d } = sd(z);
    return {
      pregunta: ['El ', nom(z), ' (', Z, ` = ${z}) tiene la configuración ${EXCEPCION.includes(z) ? `real ${confTxt(z)} (${excepcionTxt(z)})` : confTxt(z)}. ¿En qué periodo y en qué grupo está?`],
      datos: [DU.periodo, DB.grupoB, DB.romanos, DU.gas(z)],
      opciones: opcionesD(z),
      solucion: { texto: `El nivel más alto es el ${p}. Termina en d: suman ${losDel(s, `${p}s`)} y ${losDel(d, `${p - 1}d`)}.`, ecuacion: ecuacionD(z) },
    };
  }
  // [Z, bloque]: la terminación dice el bloque.
  const Z_BLOQUE = [[11, 's'], [20, 's'], [38, 's'], [13, 'p'], [16, 'p'], [35, 'p'], [53, 'p'], [22, 'd'], [26, 'd'], [28, 'd'], [30, 'd'], [40, 'd']];
  function casoBloque(r) {
    const [z, b] = r.de(Z_BLOQUE), p = periodoDe(z), ult = partes(z).slice(-1)[0][0];
    const NO = {
      s: ['QM-BLOQUE-AFUERA', b === 'd' ? `El ${p}s es su nivel de afuera, cierto. Pero el último electrón cayó en el ${ult}.` : `Tiene electrones s, cierto. Pero el último cayó en el ${ult}.`],
      p: ['QM-BLOQUE-P', `Así sería si terminara en p. Su último electrón cayó en el ${ult}.`],
      d: ['QM-BLOQUE-D', b === 'p' && p >= 4 ? `Tiene electrones d por dentro, cierto. Pero después de ellos se llenó el ${ult}.` : `Así sería si terminara en d. Su último electrón cayó en el ${ult}.`],
      f: ['QM-BLOQUE-F', `Así sería si terminara en f. Su último electrón cayó en el ${ult}.`],
    };
    return {
      pregunta: `La configuración de un elemento es ${confTxt(z)}. ¿A qué bloque de la tabla periódica pertenece?`,
      datos: [DB.bloque, DU.llenado, DU.gas(z)],
      opciones: ['s', 'p', 'd', 'f'].map(k => (k === b ? { id: 'c', texto: `Bloque ${k}`, correcta: true } : { id: k, texto: `Bloque ${k}`, error: NO[k][0], siFuera: NO[k][1] })),
      solucion: { texto: `En el orden de llenado, el último subnivel con electrones es el ${ult}: bloque ${b}.` },
    };
  }
  function casoZD(r) {
    const z = r.de([21, 22, 23, 25, 26, 27, 28, 30]), g = grupoD(z);
    return {
      pregunta: `Un metal de transición está en el periodo 4 y en el grupo ${g} (${ROMB[g]}). ¿Cuál es su número atómico?`,
      datos: [DU.llenado, DU.caben, DB.grupoB, 'Argón: Z = 18, el gas noble que cierra el periodo 3'],
      opciones: opcionesN(z, [
        { id: 'solo-d', valor: z + 2, error: 'QM-GRUPO-SOLO-D', siFuera: `Bien partir del argón. Pero el grupo ya cuenta los dos 4s: no se suman ${g} electrones d.` },
        { id: 'a-b', valor: g <= 8 ? 18 + 10 + g : null, error: 'QM-GRUPO-A-B', siFuera: 'Bien el periodo. Pero ese es el del grupo A con el mismo romano: termina en p, no en d.' },
        { id: 'periodo', valor: z + 18, error: 'QM-PERIODO-CUENTA', siFuera: 'Bien el grupo. Pero ese ya tiene electrones en el nivel 5: está un periodo más abajo.' },
      ], x => `${x}`),
      solucion: { texto: `Grupo ${g}: ${g} electrones entre el 4s y el 3d, después del argón. Es el ${nom(z)}: ${confTxt(z)}.`, ecuacion: ['18 + ', Ee(g), ' = ', Pz(z)] },
    };
  }
  function casoSoloZ(r) {
    const z = r.de([22, 23, 25, 26, 27, 28, 30, 40, 48]), { p, s, d } = sd(z);
    return {
      pregunta: ['¿En qué periodo y en qué grupo de la tabla periódica está el elemento de ', Z, ` = ${z}?`],
      datos: [DU.llenado, DU.caben, DU.periodo, DB.grupoB, DB.romanos],
      opciones: opcionesD(z),
      solucion: { texto: `${confTxt(z)}: nivel más alto ${p}; suman ${losDel(s, `${p}s`)} y ${losDel(d, `${p - 1}d`)}.`, ecuacion: ecuacionD(z) },
    };
  }
  // Verdadero o falso de bloques (San Marcos 2025-I anota «llamar transición interna a un metal del bloque d»).
  const AFIRMA_B = [
    ['El bloque d tiene diez columnas.', true, 'en un subnivel d caben 10 electrones'],
    ['El bloque d tiene ocho columnas.', false, 'tiene diez: en un subnivel d caben 10 electrones'],
    ['Los representativos son los de los bloques s y p.', true, 'son los grupos A'],
    ['Los representativos son los del bloque d.', false, 'los representativos son los de los bloques s y p'],
    ['El grupo VIIIB ocupa tres columnas.', true, 'la 8, la 9 y la 10'],
    ['El grupo VIIIB ocupa una sola columna.', false, 'ocupa tres: la 8, la 9 y la 10'],
    ['Los elementos de transición interna terminan en f.', true, 'son los del bloque f'],
    ['Los elementos de transición interna terminan en d.', false, 'los de transición interna terminan en f'],
    ['El cinc, [Ar] 4s² 3d¹⁰, está en el grupo IIB.', true, 'suma 2 + 10 = 12, que es IIB'],
    ['El cinc, [Ar] 4s² 3d¹⁰, está en el grupo IIA.', false, 'termina en d: suma 2 + 10 = 12, que es IIB'],
  ];
  // Un verdadero o falso de tres afirmaciones de un banco de parejas (la misma forma del de la idea 1).
  function vfDe(r, banco, datos) {
    const idx = banco.map((_, i) => i).filter(i => i % 2 === 0).map(i => i / 2);
    for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
    const tres = idx.slice(0, 3).sort((a, b) => a - b).map(k => banco[2 * k + (r() < 0.5 ? 0 : 1)]), bien = tres.map(x => x[1]);
    const ops = [{ id: 'c', texto: vf(bien), correcta: true }];
    tres.forEach((x, i) => {
      const otra = bien.slice(); otra[i] = !otra[i];
      ops.push({ id: `vf${i}`, texto: vf(otra), error: x[1] ? 'QM-VF-NIEGA' : 'QM-VF-ACEPTA', siFuera: `Bien las otras dos. La ${ROMANO[i]} es ${x[1] ? 'verdadera' : 'falsa'}: ${x[2]}.` });
    });
    const clave = tres.find(x => !x[1]) || tres[0];
    return { pregunta: ['Indica verdadero (V) o falso (F). ', ...tres.map((x, i) => `${ROMANO[i]}. ${x[0]} `)], datos, opciones: ops,
      solucion: { texto: `${tres.map((x, i) => `${ROMANO[i]} ${x[1] ? 'V' : 'F'}`).join(', ')}. ${clave[2].replace(/^./, m => m.toUpperCase())}.` } };
  }

  // Ejemplos de la idea 3. Cuentas rehechas aparte (scratchpad, e5-quimica/cuentas-a.py): Fe 4s² 3d⁶ → bloque d, periodo 4
  // · Ti 2 + 2 = 4 (IVB) · d: 10 columnas · Ca 4s² → bloque s · Mn (25): [Ar] 4s² 3d⁵ → periodo 4, 2 + 5 = 7 (VIIB) · Cu
  // 4s¹ 3d¹⁰ → 1 + 10 = 11 (IB) · Fe, Co, Ni: 8, 9, 10 → VIIIB · Mg (2, IIA) y Zn (2 + 10 = 12, IIB) · periodo 4, VB:
  // 18 + 5 = 23 · Ag y Au: 1 + 10 = 11, periodos 5 y 6 · Co (27): 2 + 7 = 9, periodo 4 · FVF · Cr 4s¹ 3d⁵: 1 + 5 = 6 (VIB)
  // · Ga (IIIA, 13), Sc (IIIB, 3) y Al (IIIA, 13).
  const EJEMPLOS_BLOQUES = [
    { nivel: 1, titulo: 'El bloque del hierro',
      enunciado: 'El hierro de un clavo tiene la configuración [Ar] 4s² 3d⁶. ¿A qué bloque de la tabla periódica pertenece?',
      datos: [DB.bloque, DU.llenado, '[Ar]: los 18 electrones del argón'],
      solucion: [{ texto: 'En el orden de llenado, después del 4s viene el 3d: ahí cayó su último electrón.' }],
      respuesta: 'Al bloque d' },
    { nivel: 1, titulo: 'El periodo del hierro',
      enunciado: 'El hierro tiene la configuración [Ar] 4s² 3d⁶. ¿En qué periodo está?',
      datos: [DU.periodo, '[Ar]: los 18 electrones del argón'],
      solucion: [{ texto: 'El nivel más alto con electrones es el 4, por el 4s². El 3d es del nivel 3.', ecuacion: [Pe('periodo 4')] }],
      respuesta: [Pe('Periodo 4')] },
    { nivel: 1, titulo: 'El grupo del titanio',
      enunciado: 'El titanio tiene la configuración [Ar] 4s² 3d². ¿En qué grupo está?',
      datos: [DB.grupoB, DB.romanos, '[Ar]: los 18 electrones del argón'],
      solucion: [{ texto: 'Termina en d: sumo los electrones del 4s y los del 3d.', ecuacion: ['grupo = ', Ee(2), ' + ', Ee(2), ' = ', Gr('4 (IVB)')] }],
      respuesta: [Gr('Grupo 4 (IVB)')] },
    { nivel: 1, titulo: 'Las columnas del bloque d',
      enunciado: 'En cada periodo, el bloque d tiene una columna por cada electrón que cabe en un subnivel d. ¿Cuántas columnas tiene?',
      datos: [DU.caben],
      solucion: [{ texto: 'En un subnivel d caben 10 electrones: diez columnas, los grupos 3 a 12.', ecuacion: ['12 − 3 + 1 = ', Gr(10)] }],
      respuesta: ['10 columnas: los ', Gr('grupos 3 a 12')] },
    { nivel: 1, titulo: 'El bloque del calcio',
      enunciado: 'El calcio de los huesos tiene la configuración [Ar] 4s². ¿A qué bloque pertenece?',
      datos: [DB.bloque, '[Ar]: los 18 electrones del argón'],
      solucion: [{ texto: 'Su último electrón cayó en el 4s: es del bloque s, como todos los de los grupos 1 y 2.' }],
      respuesta: 'Al bloque s' },
    { nivel: 2, titulo: 'Dónde está el manganeso',
      enunciado: 'El manganeso de las pilas tiene Z = 25. ¿En qué periodo y en qué grupo está?',
      datos: [DU.llenado, DU.caben, DU.periodo, DB.grupoB, DB.romanos],
      solucion: [
        { texto: 'Reparto sus 25 electrones: tras el argón, 2 van al 4s y 5 al 3d.', ecuacion: ['[Ar] 4s² 3d⁵'] },
        { texto: 'El nivel más alto es el 4. Termina en d: sumo los s y los d.', ecuacion: [Pe('periodo 4'), SEP, 'grupo = ', Ee(2), ' + ', Ee(5), ' = ', Gr('7 (VIIB)')] },
      ],
      respuesta: [Pe('Periodo 4'), ', ', Gr('grupo 7 (VIIB)')] },
    { nivel: 2, titulo: 'El cobre de los cables',
      enunciado: 'El cobre es una excepción al orden de llenado: un electrón del 4s pasa al 3d, y su configuración real es [Ar] 4s¹ 3d¹⁰ (no 4s² 3d⁹). ¿En qué periodo y en qué grupo está?',
      datos: [DU.periodo, DB.grupoB, DB.romanos, '[Ar]: los 18 electrones del argón'],
      figura: OBJ([{ que: 'cable', Z: 29, nombre: 'cobre' }]),
      solucion: [
        { texto: 'El nivel más alto es el 4, por el 4s¹.', ecuacion: [Pe('periodo 4')] },
        { texto: 'La suma se hace con la configuración real: un s y diez d.', ecuacion: ['grupo = ', Ee(1), ' + ', Ee(10), ' = ', Gr('11 (IB)')] },
      ],
      respuesta: [Pe('Periodo 4'), ', ', Gr('grupo 11 (IB)')] },
    { nivel: 2, titulo: 'Hierro, cobalto y níquel',
      enunciado: 'El hierro, el cobalto y el níquel terminan en 4s² 3d⁶, 4s² 3d⁷ y 4s² 3d⁸. ¿En qué grupos están y qué romano llevan?',
      datos: [DB.grupoB, DB.romanos],
      solucion: [
        { texto: 'Sumo los s y los d de cada uno.', ecuacion: [Ee(2), ' + ', Ee(6), ' = ', Gr(8), SEP, Ee(2), ' + ', Ee(7), ' = ', Gr(9), SEP, Ee(2), ' + ', Ee(8), ' = ', Gr(10)] },
        { texto: 'Las columnas 8, 9 y 10 llevan el mismo romano: VIIIB.' },
      ],
      respuesta: [Gr('Grupos 8, 9 y 10'), ': los tres son ', Gr('VIIIB')] },
    { nivel: 2, titulo: 'Magnesio y cinc',
      enunciado: 'El magnesio es [Ne] 3s² y el cinc, [Ar] 4s² 3d¹⁰. Los dos llevan el romano II. ¿Son de la misma familia?',
      datos: [DU.grupoA, DB.grupoB, DB.romanos],
      solucion: [
        { texto: 'El magnesio termina en s: grupo A, con 2 electrones en su nivel más alto.', ecuacion: [Ee(2), ' → ', Gr('2 (IIA)')] },
        { texto: 'El cinc termina en d: grupo B, y suman los s y los d.', ecuacion: [Ee(2), ' + ', Ee(10), ' = ', Gr('12 (IIB)')] },
      ],
      respuesta: ['No: ', Gr('grupo 2 (IIA)'), ' y ', Gr('grupo 12 (IIB)')] },
    { nivel: 2, titulo: 'Del lugar al número atómico',
      enunciado: 'Un metal de transición está en el periodo 4 y en el grupo VB. ¿Cuál es su número atómico?',
      datos: [DU.llenado, DU.caben, DB.grupoB, DB.romanos, 'Argón: Z = 18, el gas noble que cierra el periodo 3'],
      solucion: [
        { texto: 'VB es el grupo 5: cinco electrones entre el 4s y el 3d, después del argón.', ecuacion: ['[Ar] 4s² 3d³'] },
        { texto: 'Sumo sus electrones.', ecuacion: ['18 + ', Ee(5), ' = ', Pz(23)] },
      ],
      respuesta: [Z, ' = ', Pz(23), ': el vanadio'] },
    { nivel: 3, titulo: 'La plata y el oro',
      enunciado: 'La plata y el oro son excepciones al orden de llenado (un electrón del s pasa al d): la plata es [Kr] 5s¹ 4d¹⁰ y el oro, [Xe] 6s¹ 4f¹⁴ 5d¹⁰. ¿Qué afirmación es correcta?',
      alternativas: ['Son de transición interna, porque el oro tiene electrones f.', 'La plata está en el periodo 4 y el oro, en el 5.', 'Están en el grupo IA, porque terminan en s¹.', 'Están en el grupo 11 (IB), en los periodos 5 y 6.', 'Están en el grupo 10 (VIIIB): tienen diez electrones d.'],
      datos: [DU.periodo, DB.bloque, DB.grupoB, DB.romanos, DB.interna, DU.llenado],
      solucion: [
        { texto: 'El último electrón de los dos cayó en un d: bloque d. Sumo s y d.', ecuacion: ['grupo = ', Ee(1), ' + ', Ee(10), ' = ', Gr('11 (IB)')] },
        { texto: 'El nivel más alto es el 5 en la plata y el 6 en el oro.', ecuacion: [Pe('periodos 5 y 6')] },
        { texto: ['La ', letra('A'), ' olvida que el 4f del oro ya está lleno: su último electrón es d. La ', letra('B'), ' toma el periodo del d.'] },
        { texto: ['La ', letra('C'), ' cuenta solo el s, como en un grupo A. La ', letra('E'), ' cuenta solo los d.'] },
      ],
      respuesta: [letra('D'), ', ', Gr('grupo 11 (IB)'), ', ', Pe('periodos 5 y 6')] },
    { nivel: 3, titulo: 'Un metal de Z = 27',
      enunciado: 'El cobalto da el azul de algunos vidrios. Tiene Z = 27. ¿En qué periodo y en qué grupo está?',
      alternativas: ['Periodo 3, grupo 9 (VIIIB)', 'Periodo 4, grupo 9 (VIIIB)', 'Periodo 4, grupo 7 (VIIB)', 'Periodo 4, grupo 2 (IIA)', 'Periodo 4, grupo 17 (VIIA)'],
      datos: [DU.llenado, DU.caben, DU.periodo, DB.grupoB, DB.romanos],
      solucion: [
        { texto: 'Reparto sus 27 electrones: tras el argón, 2 al 4s y 7 al 3d.', ecuacion: ['[Ar] 4s² 3d⁷'] },
        { texto: 'Nivel más alto, el 4. Termina en d: sumo.', ecuacion: [Pe('periodo 4'), SEP, 'grupo = ', Ee(2), ' + ', Ee(7), ' = ', Gr('9 (VIIIB)')] },
        { texto: ['La ', letra('A'), ' toma el periodo del 3d. La ', letra('C'), ' cuenta solo los siete d. La ', letra('D'), ', solo los dos s.'] },
        { texto: ['La ', letra('E'), ' suma 10 a los siete d, como si terminara en p.'] },
      ],
      respuesta: [letra('B'), ', ', Pe('periodo 4'), ', ', Gr('grupo 9 (VIIIB)')] },
    { nivel: 3, titulo: 'Verdadero o falso de bloques',
      enunciado: 'Indica verdadero (V) o falso (F). I. El escandio, [Ar] 4s² 3d¹, es del bloque s. II. El grupo VIIIB ocupa tres columnas. III. Los elementos de transición interna son del bloque d.',
      alternativas: ['VVF', 'FVV', 'VFV', 'FFF', 'FVF'],
      datos: [DB.bloque, DU.llenado, DU.caben],
      solucion: [
        { texto: 'I es falsa: el último electrón del escandio cayó en el 3d. II es verdadera: son las columnas 8, 9 y 10.' },
        { texto: 'III es falsa: los de transición interna son los del bloque f.' },
        { texto: ['La ', letra('A'), ' toma el bloque del nivel de afuera. La ', letra('B'), ' confunde transición con transición interna.'] },
        { texto: ['La ', letra('C'), ' y la ', letra('D'), ' niegan que VIIIB tenga tres columnas.'] },
      ],
      respuesta: [letra('E'), ', FVF'] },
    { nivel: 3, titulo: 'El cromo, una excepción',
      enunciado: 'El cromo tiene Z = 24. El orden de llenado daría [Ar] 4s² 3d⁴, pero es una excepción: un 4s pasa al 3d y queda [Ar] 4s¹ 3d⁵. ¿En qué periodo y en qué grupo está?',
      alternativas: ['Periodo 4, grupo 6 (VIB)', 'Periodo 4, grupo 5 (VB)', 'Periodo 3, grupo 6 (VIB)', 'Periodo 4, grupo 1 (IA)', 'Periodo 4, grupo 16 (VIA)'],
      datos: [DU.periodo, DB.grupoB, DB.romanos, '[Ar]: los 18 electrones del argón'],
      solucion: [
        { texto: 'El nivel más alto es el 4, por el 4s¹.', ecuacion: [Pe('periodo 4')] },
        { texto: 'Sumo con su configuración real: un s y cinco d. Da lo mismo que con 4s² 3d⁴.', ecuacion: ['grupo = ', Ee(1), ' + ', Ee(5), ' = ', Gr('6 (VIB)')] },
        { texto: ['La ', letra('B'), ' cuenta solo los cinco d. La ', letra('C'), ' toma el periodo del 3d. La ', letra('D'), ' cuenta solo el s.'] },
        { texto: ['La ', letra('E'), ' le pone la letra A, como si terminara en p.'] },
      ],
      respuesta: [letra('A'), ', ', Pe('periodo 4'), ', ', Gr('grupo 6 (VIB)')] },
    { nivel: 3, titulo: 'Tres configuraciones',
      enunciado: 'X es [Ar] 4s² 3d¹⁰ 4p¹; Q es [Ar] 4s² 3d¹; R es [Ne] 3s² 3p¹. ¿Cuáles están en el mismo grupo?',
      alternativas: ['X y Q', 'Q y R', 'X y R', 'Los tres', 'Ninguno'],
      datos: [DU.grupoA, DU.numeros, DB.grupoB, DB.romanos],
      solucion: [
        { texto: 'X y R terminan en p: grupo A, con 2 + 1 = 3 electrones en su nivel más alto.', ecuacion: ['grupo = 10 + ', Ee(3), ' = ', Gr('13 (IIIA)')] },
        { texto: 'Q termina en d: grupo B, y suman los s y los d.', ecuacion: ['grupo = ', Ee(2), ' + ', Ee(1), ' = ', Gr('3 (IIIB)')] },
        { texto: ['La ', letra('A'), ' y la ', letra('B'), ' juntan un IIIA con un IIIB: mismo romano, otra letra. La ', letra('D'), ' también.'] },
        { texto: ['La ', letra('E'), ' cuenta los 3d¹⁰ de X como de valencia.'] },
      ],
      respuesta: [letra('C'), ', X y R: ', Gr('grupo 13 (IIIA)')] },
  ];

  const bloquesT = {
    id: 'bloques-transicion',
    titulo: 'Bloques y metales de transición',
    pregunta: '¿Cómo se ubica un metal cuya configuración termina en d?',
    temas: ['Periodos, grupos y bloques', 'Ubicación de un elemento'],
    pieza: 'quim-tira',
    aprendizaje: 'El bloque es el subnivel donde cae el último electrón. En el bloque d, el grupo suma los electrones ns y (n − 1)d.',
    actividad: 'Recorrer los metales del escandio al cinc y comparar su configuración con su columna.',
    lee: {
      tarjetas: [
        { titulo: 'Tres metales de todos los días', texto: 'El hierro de un clavo, el cobre de un cable y la plata de un anillo están en el centro de la tabla, en las columnas 3 a 12. Se llaman metales de transición.',
          pieza: 'quim-tira', dibujo: OBJ([{ que: 'clavo', Z: 26, nombre: 'hierro' }, { que: 'cable', Z: 29, nombre: 'cobre' }, { que: 'anillo', Z: 47, nombre: 'plata' }]) },
        { titulo: 'Cuatro bloques', texto: 'La tabla se divide en bloques, según el subnivel donde cae el último electrón: s (columnas 1 y 2), p (13 a 18), d (3 a 12) y f (las dos filas que van aparte, abajo).' },
        { titulo: 'Los grupos B', texto: 'Las columnas del bloque d llevan romanos con la letra B: IIIB, IVB, VB, VIB, VIIB, VIIIB (que ocupa tres columnas), IB y IIB. En la figura van debajo del número de cada columna.' },
        { titulo: 'Qué mirar', texto: 'En el juego recorres los metales del periodo 4, del escandio al cinc. Abajo sale la configuración de cada uno: compárala con el número de su columna.' },
      ],
    },
    ejemplos: EJEMPLOS_BLOQUES,
    juega: {
      pieza: 'quim-tira',
      consigna: 'Los grupos 3 a 12, abiertos. Recorre los metales del periodo 4: abajo sale la configuración de cada uno.',
      mision: {
        texto: 'Encuentra el metal cuya configuración termina en 4s² 3d⁸.',
        logrado: v => sd(v.z).s === 2 && sd(v.z).d === 8,
        bien: 'El níquel: sus electrones s y d suman justo el número de su columna.',
      },
      voz: 'Suma los s y los d, y mira la columna.',
      leyenda: [
        { s: Z, t: 'número atómico' },
        { s: Ee('e⁻'), t: 'electrones que suman: los s y los d' },
        { s: '[Ar]', t: 'los 18 electrones del argón' },
        { s: 'IIIB … IIB', t: 'grupos 3 a 12, como en el examen' },
      ],
      controles: [{ id: 'z', etiqueta: 'Metal (Z)', color: 'c-o', min: 21, max: 30, paso: 1, inicio: 21, decimales: 0 }],
      dibujo: v => TRANS({ resaltar: [{ Z: v.z, color: 'h' }], rotulo: `${S118[v.z - 1]}: ${confTxt(v.z)}` }),
      lectura: v => { const { s, d } = sd(v.z); return [...(EXCEPCION.includes(v.z) ? ['Excepción: un 4s pasó al 3d. '] : []), Pe('Periodo 4'), '. Grupo: ', Ee(`${s} e⁻`), ' + ', Ee(`${d} e⁻`), ' = ', Gr(grupoAB(s + d)), '.']; },
      minimo: 4,
    },
    predice: {
      pieza: 'quim-tira',
      pregunta: ['La plata de un anillo tiene ', Z, ' = 47. Es una excepción al orden de llenado: un electrón del 5s pasa al 4d, y su configuración real es [Kr] 5s¹ 4d¹⁰. ¿En qué periodo y en qué grupo está?'],
      datos: ['[Kr]: los 36 electrones del kriptón', 'Kriptón: periodo 4'],
      voz: 'Mira cuál es el nivel de afuera y qué electrones suman.',
      opciones: [
        { id: 'c', texto: 'Periodo 5, grupo 11 (IB)', correcta: true },
        { id: 'periodo-d', texto: 'Periodo 4, grupo 11 (IB)', error: 'QM-PERIODO-D', siFuera: 'El 4d fue el último en llenarse, cierto. Pero el periodo es el nivel más alto con electrones: el 5.' },
        { id: 'solo-d', texto: 'Periodo 5, grupo 10 (VIIIB)', error: 'QM-GRUPO-SOLO-D', siFuera: 'Contaste los diez 4d, bien. Pero en el bloque d también cuenta el electrón del 5s.' },
        { id: 'solo-s', texto: 'Periodo 5, grupo 1 (IA)', error: 'QM-GRUPO-SOLO-S', siFuera: 'Así sería si terminara en 5s¹. Pero termina en d: sus diez electrones d también cuentan.' },
      ],
      dibujo: OBJ([{ que: 'anillo', Z: 47, nombre: 'plata' }], { rotulo: '[Kr] 5s¹ 4d¹⁰' }),
      revelar: TRANS({ resaltar: [{ Z: 47, color: 'h' }], rotulo: 'Ag: [Kr] 5s¹ 4d¹⁰' }),
      coincide: 'Coincide: el nivel de afuera es el 5, y suman el electrón s y los diez d.',
      noCoincide: 'El nivel más alto es el 5: periodo 5. Suman el electrón 5s y los diez 4d: grupo 11 (IB).',
    },
    mira: {
      pieza: 'quim-tira',
      datos: { simbolos: SIMBOLOS118, marcas: {}, vista: 'transicion', resaltar: [{ Z: 47, color: 'h', desde: 1 }, { Z: 29, color: 'h', desde: 5 }], rotulo: 'Ag: [Kr] 5s¹ 4d¹⁰' },
      voz: 'Sigamos a la plata hasta su columna.',
      pasos: [
        { estado: { corte: 1 }, texto: 'La plata es una excepción; su último electrón está en un d: bloque d.', ecuacion: ['[Kr] 5s¹ 4d¹⁰'] },
        { estado: { corte: 2 }, texto: 'El nivel más alto es el 5, aunque el 4d se llenó después.', ecuacion: [Pe('periodo 5')] },
        { estado: { corte: 3 }, texto: 'En el bloque d suman los s de afuera y los d.', ecuacion: ['grupo = ', Ee(1), ' + ', Ee(10), ' = ', Gr(11)] },
        { estado: { corte: 4 }, texto: 'La columna 11 se escribe IB en el examen.', ecuacion: [Gr('grupo 11 (IB)')] },
        { estado: { corte: 5 }, texto: 'El cobre, justo arriba, también suma 11: son de la misma familia.', ecuacion: ['Cu: [Ar] 4s¹ 3d¹⁰'] },
        { estado: { corte: 6 }, texto: 'Los que terminan en f van aparte: son de transición interna.', ecuacion: ['bloque f: transición interna'] },
      ],
    },
    regla: {
      texto: 'Bloque: el subnivel del último electrón (s, p, d o f). En el bloque d, el periodo es el mayor n; el grupo suma ns y (n − 1)d.',
      ecuacion: ['bloque s: columnas 1 y 2', SEP, 'p: 13 a 18', SEP, 'd: 3 a 12', SEP, 'f: las dos filas de abajo', SEP, Pe('periodo'), ' = mayor n', SEP, Gr('grupo'), ' = ', Ee('e⁻ ns'), ' + ', Ee('e⁻ (n − 1)d'), SEP, Gr('3 a 7'), ': IIIB a VIIB', SEP, Gr('8, 9 y 10'), ': VIIIB', SEP, Gr('11 y 12'), ': IB y IIB'],
      condicion: 'el elemento termina en d. Con el Cr, el Cu, la Ag y el Au (excepciones), se suma su configuración real.',
      voz: 'El periodo, por el nivel de afuera; el grupo, sumando.',
      dibujo: TRANS({}),
    },
    resuelve: {
      pieza: 'quim-tira',
      generar(s) {
        const z = azar(s + 900).de([21, 24, 29, 39, 47]), { p, s: es, d } = sd(z), g = es + d;
        return {
          enunciado: ['El ', nom(z), ' tiene ', Z, ` = ${z} y su configuración es ${confTxt(z)}. ¿A qué bloque pertenece y dónde está?`],
          datos: [DB.bloque, DU.llenado, DU.periodo, DB.grupoB, DB.romanos, DU.gas(z)],
          dibujo: TRANS({}),
          pasos: [
            { tipo: 'pide', texto: 'Piden tres cosas: el bloque, el periodo y el grupo.' },
            { tipo: 'datos', texto: `Después del gas noble tiene ${es} ${es === 1 ? 'electrón' : 'electrones'} en el ${p}s y ${d} en el ${p - 1}d.${EXCEPCION.includes(z) ? ` El ${nom(z)} ${excepcionTxt(z)}.` : ''}` },
            { tipo: 'regla', texto: 'El bloque lo da el último subnivel en llenarse. El periodo, el nivel más alto. En el bloque d, el grupo suma los s y los d.' },
            { tipo: 'cuentas', texto: `En el orden de llenado, el ${p - 1}d va después del ${p}s: bloque d. El nivel más alto es el ${p}.`, ecuacion: ecuacionD(z),
              dibujo: TRANS({ resaltar: [{ Z: z, color: 'h' }], rotulo: `${S118[z - 1]}: ${confTxt(z)}` }) },
            { tipo: 'sentido', texto: `En la figura, el ${nom(z)} está en la columna ${g}, que lleva el romano ${ROMB[g]}, y en la fila del periodo ${p}.` },
          ],
          respuesta: ['Bloque d; ', Pe(`periodo ${p}`), ', ', Gr(`grupo ${grupoAB(g)}`)],
        };
      },
    },
    ahoraTu: {
      pieza: 'quim-tira',
      voz: 'Nivel de afuera para el periodo; s más d para el grupo.',
      generar(sem) {
        const r = azar(sem * 101 + 29), tipo = sem % 5;
        return tipo === 4 ? vfDe(r, AFIRMA_B, [DB.bloque, DU.llenado, DU.caben]) : [casoUbicarD, casoBloque, casoZD, casoSoloZ][tipo](r);
      },
    },
  };

  // ---------- Idea 4 (nueva, 19 nov): metales, no metales y semimetales ----------
  // Propuesta §3 a §6, idea A4. Objeto de la primera pantalla: un probador casero (pila, foquito y dos cables; quim-tira,
  // de prueba). En el juego se prueban elementos de los grupos A, que tienen su casilla en la tabla de la figura.
  // Cambia: el material que cierra el probador · Permanece: la tabla con la escalera · Progresa: de «prende o no prende»
  // a «de qué lado de la escalera está» · Se reserva: el silicio, pegado a la escalera (es lo que se predice) · Debe verse:
  // la casilla del elemento respecto de la línea gruesa.
  // Clases (convención de las academias): semimetales B, Si, Ge, As, Sb y Te; no metales H, C, N, O, P, S, Se, los
  // halógenos y los gases nobles; el resto, metales. El grafito es un no metal que conduce (se dice como excepción).
  // Errores (hipótesis; la inversión de la tendencia la anota San Marcos 2027-I): QM-METAL-BRILLO, QM-DOS-CLASES, QM-CHIP,
  // QM-CARACTER-INVERTIDO, QM-CARACTER-IGUAL, QM-CARACTER-MEDIO, QM-CLASE-METAL, QM-CLASE-NO-METAL, QM-CLASE-SEMIMETAL,
  // QM-CLASE-TRANSICION, QM-METAL-GANA, QM-ION-PROTONES, QM-METAL-COMPARTE y QM-VF-*.
  const SEMIMETALES = [5, 14, 32, 33, 51, 52], NO_METALES = [1, 6, 7, 8, 15, 16, 34, 9, 17, 35, 53, 85, 2, 10, 18, 36, 54, 86];
  const claseDe = z => (SEMIMETALES.includes(z) ? 'semimetal' : NO_METALES.includes(z) ? 'no metal' : 'metal');
  // Carácter metálico de un representativo: más a la izquierda (grupo menor) y más abajo (periodo mayor), más metálico.
  // Solo se comparan elementos de una misma fila o de una misma columna.
  const masMetalico = (a, b) => (periodoDe(a) === periodoDe(b) ? (grupoDe(a) < grupoDe(b) ? a : b) : (periodoDe(a) > periodoDe(b) ? a : b));
  // Lo que se prueba en el juego: [id, texto del control, Z, cómo prende (0, 1 o 2)].
  const MATERIALES = [['aluminio', 'Papel de aluminio', 13, 2], ['estano', 'Soldadura de estaño', 50, 2], ['plomo', 'Plomada de plomo', 82, 2], ['azufre', 'Barra de azufre', 16, 0],
    ['yodo', 'Cristales de yodo', 53, 0], ['grafito', 'Mina de lápiz (grafito)', 6, 2]];
  const material = id => MATERIALES.find(m => m[0] === id);
  const DM = {
    lados: 'Escalera: a su izquierda, los metales; a su derecha, los no metales',
    semi: 'Semimetales (pegados a la escalera): B, Si, Ge, As, Sb y Te',
    caracter: 'Carácter metálico: crece hacia la izquierda en un periodo y hacia abajo en un grupo',
    iones: 'Catión: ion positivo (perdió electrones). Anión: ion negativo (los ganó)',
    maleable: 'Maleable: se deja laminar. Dúctil: se deja hilar',
    toca: 'Semimetal: su casilla está a la derecha de la escalera y la toca',
    semiProp: 'Semimetal: brilla, pero conduce poco la corriente y se quiebra al golpearlo',
    clases: 'Metal: brilla, conduce bien y se deja laminar. No metal: no brilla y casi no conduce',
  };
  const lugarTxt = z => `periodo ${periodoDe(z)}, grupo ${grupoDe(z)}`;
  const Nom = z => nom(z).charAt(0).toUpperCase() + nom(z).slice(1);
  // Tríos de una misma fila o una misma columna, para comparar el carácter metálico.
  // Sin tríos donde la EI del NIST contradiga el orden (Al–Ga, As–Se): la unidad siguiente trae esas EI.
  const TRIOS = [[11, 13, 16], [12, 14, 17], [19, 31, 35], [3, 11, 19], [4, 12, 20], [9, 17, 35], [12, 20, 38], [37, 50, 53], [7, 15, 33], [6, 14, 50]];
  function casoCaracter(r) {
    const trio = r.de(TRIOS), fila = periodoDe(trio[0]) === periodoDe(trio[1]), mas = trio.reduce(masMetalico), menos = trio.find(z => trio.every(w => w === z || masMetalico(z, w) === w)), medio = trio.find(z => z !== mas && z !== menos);
    return {
      pregunta: `¿Cuál de estos elementos tiene mayor carácter metálico: ${trio.map(z => `${nom(z)} (${lugarTxt(z)})`).join(', ')}?`,
      datos: [DM.caracter],
      opciones: [
        { id: 'c', texto: `El ${nom(mas)}`, correcta: true },
        { id: 'invertido', texto: `El ${nom(menos)}`, error: 'QM-CARACTER-INVERTIDO', siFuera: `Bien mirar ${fila ? 'la fila' : 'la columna'}. Pero el carácter metálico crece hacia ${fila ? 'la izquierda' : 'abajo'}, no al revés.` },
        { id: 'medio', texto: `El ${nom(medio)}`, error: 'QM-CARACTER-MEDIO', siFuera: `Bien descartar un extremo. Pero la tendencia sigue hasta el otro: el de más ${fila ? 'a la izquierda' : 'abajo'}.` },
        { id: 'igual', texto: 'Los tres por igual', error: 'QM-CARACTER-IGUAL', siFuera: `Comparten ${fila ? 'el periodo' : 'el grupo'}, cierto. Pero el carácter metálico cambia al recorrer ${fila ? 'la fila' : 'la columna'}.` },
      ],
      solucion: { texto: fila ? `Los tres están en el periodo ${periodoDe(mas)}: el más metálico es el de más a la izquierda.` : `Los tres están en el grupo ${grupoDe(mas)}: el más metálico es el de más abajo.`,
        ecuacion: [fila ? Gr(`grupo ${grupoDe(mas)}`) : Pe(`periodo ${periodoDe(mas)}`), `: ${nom(mas)}`] },
    };
  }
  // Propiedades y la clase que describen.
  const PERFILES = [
    ['brilla, conduce bien la corriente y se deja laminar sin romperse', 'metal'], ['es opaco, no conduce la corriente y se quiebra al golpearlo', 'no metal'],
    ['brilla, conduce poco la corriente y se quiebra al golpearlo', 'semimetal'], ['conduce bien el calor, se deja hilar en alambres y pierde electrones con facilidad', 'metal'],
    ['es un gas a temperatura ambiente y gana electrones al reaccionar con el sodio', 'no metal'], ['conduce poco, pero conduce mejor al calentarse, y se usa en los chips', 'semimetal'],
  ];
  const SI_CLASE = { metal: ['QM-CLASE-METAL', 'Así sería si condujera bien y se dejara laminar. Compara todas sus propiedades.'], 'no metal': ['QM-CLASE-NO-METAL', 'Así sería si no condujera nada y no brillara. Compara todas sus propiedades.'],
    semimetal: ['QM-CLASE-SEMIMETAL', 'Así sería si condujera poco y fuera quebradizo. Compara todas sus propiedades.'], 'metal de transición': ['QM-CLASE-TRANSICION', 'Ese sería un metal de los grupos 3 a 12. Mira primero si es metal.'] };
  const opcionesClase = (c, extra) => ['metal', 'no metal', 'semimetal', extra].map(k => (k === c ? { id: 'c', texto: `Un ${k}`, correcta: true } : { id: k.replace(/ /g, '-'), texto: `Un ${k}`, error: SI_CLASE[k][0], siFuera: SI_CLASE[k][1] }));
  function casoPerfil(r) {
    const [txt, c] = r.de(PERFILES);
    return { pregunta: `Un elemento ${txt}. ¿Qué clase de elemento es?`, datos: [DM.maleable, DM.iones],
      opciones: opcionesClase(c, 'metal de transición').map(o => (o.id === 'metal-de-transición' ? Object.assign(o, { texto: 'Un gas noble', error: 'QM-CLASE-NOBLE', siFuera: 'Un gas noble casi no reacciona ni conduce. Compara todas sus propiedades.' }) : o)),
      solucion: { texto: c === 'metal' ? 'Conducir bien y dejarse trabajar sin romperse son propiedades de metal.' : c === 'no metal' ? 'No conducir y ganar electrones son propiedades de no metal.' : 'Conducir poco, a medio camino entre metal y no metal, es de semimetal.' } };
  }
  const Z_LUGAR = [3, 12, 13, 20, 31, 50, 82, 5, 14, 32, 33, 51, 6, 15, 16, 34, 17, 53];
  function casoLugar(r) {
    const z = r.de(Z_LUGAR), c = claseDe(z);
    return {
      pregunta: 'En la tabla hay una casilla marcada con «?». El elemento de esa casilla, ¿es un metal, un no metal o un semimetal?',
      datos: [DM.lados, DM.semi],
      dibujo: TABLA0({ periodos: 6, escalera: true, ocultos: [z], resaltar: [{ Z: z }] }),
      opciones: opcionesClase(c, 'metal de transición'),
      solucion: { texto: `Es el ${nom(z)} (${lugarTxt(z)}): ${c === 'metal' ? 'queda a la izquierda de la escalera' : c === 'no metal' ? 'queda a la derecha de la escalera, sin tocarla' : 'está pegado a la escalera, en la lista de semimetales'}.`,
        dibujo: TABLA0({ periodos: 6, escalera: true, resaltar: [{ Z: z }] }) },
    };
  }
  function casoIon(r) {
    const z = r.de([11, 12, 19, 20, 13, 9, 17, 16, 8, 35]), metal = claseDe(z) === 'metal';
    return {
      pregunta: `El ${nom(z)} es un ${claseDe(z)}. Cuando reacciona con un ${metal ? 'no metal' : 'metal'}, ¿qué le pasa a cada uno de sus átomos?`,
      datos: [DM.iones],
      opciones: [
        { id: 'c', texto: metal ? 'Pierde electrones y queda como catión' : 'Gana electrones y queda como anión', correcta: true },
        { id: 'gana', texto: metal ? 'Gana electrones y queda como anión' : 'Pierde electrones y queda como catión', error: 'QM-METAL-GANA', siFuera: `Bien: se forma un ion. Pero ${metal ? 'un metal suelta electrones; el que los recibe es el no metal' : 'un no metal recibe electrones; el que los suelta es el metal'}.` },
        { id: 'protones', texto: metal ? 'Pierde protones y queda como catión' : 'Gana protones y queda como anión', error: 'QM-ION-PROTONES', siFuera: 'Bien el nombre del ion. Pero en una reacción química el núcleo no cambia: se mueven electrones.' },
        { id: 'nada', texto: 'Nada: solo se mezcla con el otro', error: 'QM-METAL-COMPARTE', siFuera: 'Se juntan, cierto. Pero al reaccionar pasan electrones del metal al no metal.' },
      ],
      solucion: { texto: metal ? 'Un metal pierde electrones: le quedan más protones que electrones y es un catión.' : 'Un no metal gana electrones: le quedan más electrones que protones y es un anión.' },
    };
  }
  const AFIRMA_M = [
    ['La mayoría de los elementos son metales.', true, 'están a la izquierda de la escalera y en todo el centro'],
    ['La mayoría de los elementos son no metales.', false, 'los no metales son pocos: los de la derecha de la escalera'],
    ['El mercurio es un metal líquido a temperatura ambiente.', true, 'es el único metal líquido'],
    ['Todos los metales son sólidos a temperatura ambiente.', false, 'el mercurio es líquido'],
    ['Los no metales tienden a ganar electrones.', true, 'quedan como aniones'],
    ['Los metales tienden a ganar electrones.', false, 'los pierden y quedan como cationes'],
    ['El silicio y el germanio son semimetales.', true, 'están pegados a la escalera'],
    ['El aluminio y el estaño son semimetales.', false, 'son metales: quedan a la izquierda de la escalera'],
    ['En un grupo, el carácter metálico crece hacia abajo.', true, 'el cesio es más metálico que el sodio'],
    ['En un periodo, el carácter metálico crece hacia la derecha.', false, 'crece hacia la izquierda'],
  ];

  // Ejemplos de la idea 4. Comprobado aparte (scratchpad, e5-quimica/cuentas-a.py), con la tabla escrita a mano: Cu metal ·
  // S a la derecha → no metal · Si pegado → semimetal · Na → Na⁺ · Hg metal, Br no metal · Na (grupo 1) más metálico que Al
  // (13) · K (periodo 4) más que Li (2) · Mg, Si, S: metal, semimetal, no metal · grafito: no metal · B, Si, Ge: 3 de 6 ·
  // K > Ca > Ge > Br en carácter metálico · VFV · Mg < Na < K < Cs · Si: semimetal del periodo 3 · X (grupo 1), R (14), Q (17).
  const EJEMPLOS_METALES = [
    { nivel: 1, titulo: 'El cobre de un cable',
      enunciado: 'El cobre brilla, conduce la corriente y se deja estirar en alambres. ¿Es un metal, un no metal o un semimetal?',
      datos: [DM.maleable],
      figura: OBJ([{ que: 'cable', Z: 29, nombre: 'cobre' }]),
      solucion: [{ texto: 'Brillar, conducir y dejarse hilar sin romperse son las propiedades de un metal.' }],
      respuesta: 'Un metal' },
    { nivel: 1, titulo: 'De qué lado está el azufre',
      enunciado: 'El azufre (periodo 3, grupo 16) queda a la derecha de la escalera de la tabla, sin tocarla. ¿Qué clase de elemento es?',
      datos: [DM.lados, DM.semi],
      figura: TABLA0({ periodos: 4, escalera: true, resaltar: [{ Z: 16 }] }),
      solucion: [{ texto: 'A la derecha de la escalera, y fuera de la lista de semimetales, están los no metales.' }],
      respuesta: 'Un no metal' },
    { nivel: 1, titulo: 'El germanio',
      enunciado: 'Un trozo de germanio brilla como un metal, pero conduce poco la corriente y se quiebra al golpearlo. ¿Qué clase de elemento es?',
      datos: [DM.semiProp, DM.clases],
      solucion: [{ texto: 'Brilla como un metal, pero conduce poco y se quiebra: tiene propiedades de los dos lados. Es un semimetal.' }],
      respuesta: 'Un semimetal' },
    { nivel: 1, titulo: 'El sodio pierde un electrón',
      enunciado: 'El sodio es un metal. Al reaccionar con el cloro, cada átomo de sodio pierde un electrón. ¿Qué clase de ion queda?',
      datos: [DM.iones],
      solucion: [{ texto: 'Perdió un electrón: le queda un protón de más. Es un ion positivo, un catión.', ecuacion: ['Na → Na⁺ + e⁻'] }],
      respuesta: ['Un catión: Na⁺'] },
    { nivel: 1, titulo: 'Dos líquidos',
      enunciado: 'A temperatura ambiente solo dos elementos son líquidos: el mercurio, que brilla y conduce, y el bromo, que no conduce. ¿Cuál de los dos es un metal?',
      datos: [DM.lados],
      solucion: [{ texto: 'Brillar y conducir la corriente son propiedades de metal: el mercurio. El bromo es un no metal.' }],
      respuesta: ['El mercurio'] },
    { nivel: 2, titulo: 'Sodio o aluminio',
      enunciado: 'El sodio (grupo 1) y el aluminio (grupo 13) están en el periodo 3. ¿Cuál tiene mayor carácter metálico?',
      datos: [DM.caracter],
      solucion: [
        { texto: 'Están en la misma fila: manda la columna.', ecuacion: [Pe('periodo 3'), ' los dos'] },
        { texto: 'En un periodo, el carácter metálico crece hacia la izquierda: el del grupo menor.', ecuacion: [Gr('grupo 1'), ' antes que ', Gr('grupo 13')] },
      ],
      respuesta: ['El sodio: ', Gr('grupo 1')] },
    { nivel: 2, titulo: 'Litio o potasio',
      enunciado: 'El litio (periodo 2) y el potasio (periodo 4) están en el grupo 1. ¿Cuál pierde electrones con más facilidad?',
      datos: [DM.caracter, 'Mayor carácter metálico: pierde electrones con más facilidad'],
      solucion: [
        { texto: 'Están en la misma columna: manda la fila.', ecuacion: [Gr('grupo 1'), ' los dos'] },
        { texto: 'En un grupo, el carácter metálico crece hacia abajo: el del periodo mayor.', ecuacion: [Pe('periodo 4'), ' después de ', Pe('periodo 2')] },
      ],
      respuesta: ['El potasio: ', Pe('periodo 4')] },
    { nivel: 2, titulo: 'Tres del periodo 3',
      enunciado: 'El magnesio (grupo 2), el silicio (grupo 14) y el azufre (grupo 16) están en el periodo 3. ¿Qué clase de elemento es cada uno?',
      datos: [DM.lados, DM.toca],
      figura: TABLA0({ periodos: 3, escalera: true, resaltar: [{ Z: 12 }, { Z: 14 }, { Z: 16 }] }),
      solucion: [
        { texto: 'El silicio está a la derecha de la escalera y la toca: es un semimetal.' },
        { texto: 'El magnesio queda a la izquierda de la escalera: metal. El azufre, a la derecha y sin tocarla: no metal.' },
      ],
      respuesta: 'Metal, semimetal y no metal, en ese orden' },
    { nivel: 2, titulo: 'La mina del lápiz',
      enunciado: 'El grafito de un lápiz es carbono (periodo 2, grupo 14). Conduce la corriente, pero es opaco y se quiebra. ¿Es un metal?',
      datos: [DM.lados, DM.semi, DM.maleable],
      solucion: [
        { texto: 'El carbono queda a la derecha de la escalera y no está entre los semimetales: es un no metal.' },
        { texto: 'Que el grafito conduzca es una excepción: un metal, además, brilla y se deja laminar.' },
      ],
      respuesta: 'No: es un no metal que conduce' },
    { nivel: 2, titulo: 'Cuántos semimetales',
      enunciado: 'De esta lista, ¿cuántos son semimetales: litio, boro, silicio, fósforo, germanio y bromo?',
      datos: [DM.semi, 'Símbolos: litio Li, boro B, silicio Si, fósforo P, germanio Ge, bromo Br'],
      solucion: [
        { texto: 'Busco cada símbolo en la lista de semimetales: están B, Si y Ge.' },
        { texto: 'El litio es un metal; el fósforo y el bromo, no metales.', ecuacion: ['6 − 3 = 3'] },
      ],
      respuesta: 'Tres: boro, silicio y germanio' },
    { nivel: 3, titulo: 'Cinco del periodo 4',
      enunciado: 'El potasio (grupo 1), el calcio (2), el germanio (14), el bromo (17) y el kriptón (18) están en el periodo 4. ¿Qué afirmación es correcta?',
      alternativas: ['El bromo es el de mayor carácter metálico.', 'El germanio es un metal alcalino.', 'El potasio es un no metal, porque está en el grupo 1.', 'El kriptón es un metal líquido.', 'El carácter metálico baja del potasio al bromo.'],
      datos: [DM.caracter, DM.lados, DM.semi, 'Alcalinos: grupo 1. Gases nobles: grupo 18'],
      solucion: [
        { texto: 'En un periodo, el carácter metálico crece hacia la izquierda: es máximo en el potasio y baja hacia el bromo.', ecuacion: [Gr('grupo 1'), ' → ', Gr('grupo 17')] },
        { texto: ['La ', letra('A'), ' invierte la tendencia. La ', letra('B'), ' olvida que los alcalinos son del grupo 1: el germanio es un semimetal.'] },
        { texto: ['La ', letra('C'), ' olvida que el grupo 1 queda a la izquierda de la escalera. La ', letra('D'), ' olvida que el kriptón es un gas noble.'] },
      ],
      respuesta: [letra('E'), ', baja del ', Gr('grupo 1'), ' al ', Gr('grupo 17')] },
    { nivel: 3, titulo: 'Verdadero o falso de metales',
      enunciado: 'Indica verdadero (V) o falso (F). I. La mayoría de los elementos son metales. II. Todos los metales son sólidos a temperatura ambiente. III. Los no metales tienden a ganar electrones.',
      alternativas: ['VVV', 'FFV', 'VFV', 'VVF', 'FFF'],
      datos: [DM.lados, DM.iones],
      solucion: [
        { texto: 'I es verdadera: a la izquierda de la escalera queda casi toda la tabla. II es falsa: el mercurio es líquido.' },
        { texto: 'III es verdadera: al ganar electrones quedan como aniones.' },
        { texto: ['La ', letra('A'), ' y la ', letra('D'), ' olvidan el mercurio. La ', letra('B'), ' y la ', letra('E'), ' creen que hay más no metales que metales.'] },
      ],
      respuesta: [letra('C'), ', VFV'] },
    { nivel: 3, titulo: 'Cuatro metales en orden',
      enunciado: 'El sodio, el potasio y el cesio están en el grupo 1 (periodos 3, 4 y 6); el magnesio, en el grupo 2 del periodo 3. Ordénalos de menor a mayor carácter metálico.',
      alternativas: ['Cs < K < Na < Mg', 'Mg < Na < K < Cs', 'Na < Mg < K < Cs', 'Mg < Cs < K < Na', 'Na < K < Cs < Mg'],
      datos: [DM.caracter, 'Símbolos: sodio Na, potasio K, cesio Cs, magnesio Mg'],
      solucion: [
        { texto: 'En el periodo 3, el magnesio está a la derecha del sodio: es menos metálico.', ecuacion: ['Mg < Na'] },
        { texto: 'En el grupo 1, el carácter metálico crece hacia abajo.', ecuacion: ['Na < K < Cs'] },
        { texto: ['La ', letra('A'), ' da el orden al revés. La ', letra('C'), ' y la ', letra('E'), ' ponen al magnesio como más metálico que el sodio.'] },
        { texto: ['La ', letra('D'), ' invierte el grupo 1: pone al sodio como el más metálico.'] },
      ],
      respuesta: [letra('B'), ', Mg < Na < K < Cs'] },
    { nivel: 3, titulo: 'Un elemento del periodo 3',
      enunciado: 'Un elemento del periodo 3 brilla, conduce poco la corriente y se quiebra al golpearlo. ¿Cuál es?',
      alternativas: ['Silicio (grupo 14)', 'Sodio (grupo 1)', 'Azufre (grupo 16)', 'Aluminio (grupo 13)', 'Argón (grupo 18)'],
      datos: [DM.semiProp, DM.clases, DM.semi],
      solucion: [
        { texto: 'Brilla como un metal pero conduce poco y es quebradizo: propiedades intermedias, de semimetal.' },
        { texto: 'En el periodo 3, el semimetal de la lista es el silicio, Si.' },
        { texto: ['La ', letra('B'), ' y la ', letra('D'), ' son metales: conducen bien y se dejan laminar. La ', letra('C'), ' no brilla ni conduce.'] },
        { texto: ['La ', letra('E'), ' es un gas noble.'] },
      ],
      respuesta: [letra('A'), ', el silicio: un semimetal'] },
    { nivel: 3, titulo: 'Tres casillas del periodo 4',
      enunciado: 'En el periodo 4, X está en el grupo 1, Q en el grupo 17 y R en el grupo 14, pegado a la escalera. ¿Qué afirmación es correcta?',
      alternativas: ['X gana electrones con facilidad.', 'Q es un metal.', 'R es un gas.', 'X es el de mayor carácter metálico de los tres.', 'Q conduce la corriente mejor que X.'],
      datos: [DM.caracter, DM.lados, DM.iones],
      solucion: [
        { texto: 'X es el de más a la izquierda de la fila: el más metálico. Pierde electrones y conduce bien.', ecuacion: [Gr('grupo 1'), ' antes que ', Gr('14'), ' y ', Gr('17')] },
        { texto: ['La ', letra('A'), ' le da a un metal lo que hace un no metal. La ', letra('B'), ' y la ', letra('E'), ' olvidan que Q queda a la derecha de la escalera.'] },
        { texto: ['La ', letra('C'), ' olvida que R, pegado a la escalera, es un semimetal sólido.'] },
      ],
      respuesta: [letra('D'), ', X: ', Gr('grupo 1')] },
  ];

  const metales = {
    id: 'metales-no-metales',
    titulo: 'Metales, no metales y semimetales',
    pregunta: '¿Qué dice el lugar de un elemento sobre cómo conduce la corriente?',
    temas: ['Metales, no metales y semimetales'],
    pieza: 'quim-tira',
    aprendizaje: 'Los metales, a la izquierda de la escalera, conducen y pierden electrones; los no metales, a la derecha, los ganan; los semimetales la bordean.',
    actividad: 'Cerrar un probador de foquito con distintos elementos y ubicarlos en la tabla.',
    lee: {
      tarjetas: [
        { titulo: 'Un probador casero', texto: 'Con una pila, un foquito y dos cables se arma un probador. Si lo que pones entre los dos cables deja pasar la corriente, el foquito prende.',
          pieza: 'quim-tira', dibujo: OBJ([{ que: 'probador', prende: 0, nombre: 'apagado' }, { que: 'probador', prende: 2, nombre: 'prendido' }]) },
        { titulo: 'Dos maneras de portarse', texto: 'Un metal brilla, conduce la corriente y el calor, y se deja laminar sin romperse. Un no metal no brilla, casi nunca conduce y, si es sólido, se quiebra.' },
        { titulo: 'La escalera', texto: 'En la tabla hay una línea gruesa en forma de escalera. Se dibuja para separar dos zonas. En el juego, cada elemento que pruebes queda marcado en la tabla: mira de qué lado de la línea cae.' },
      ],
    },
    ejemplos: EJEMPLOS_METALES,
    juega: {
      pieza: 'quim-tira',
      consigna: 'Cierra el probador con un trozo de cada elemento. Su casilla queda marcada en la tabla, junto a la escalera.',
      mision: {
        texto: 'Prende el foquito con un elemento que esté a la derecha de la escalera.',
        logrado: v => material(v.m)[3] > 0 && claseDe(material(v.m)[2]) !== 'metal',
        bien: 'El grafito es carbono, un no metal: que conduzca es una excepción.',
      },
      voz: 'Mira de qué lado cae cada casilla.',
      leyenda: [
        { s: 'línea gruesa', t: 'la escalera de la tabla' },
        { s: 'Al, Sn, Pb', t: 'aluminio, estaño y plomo' },
        { s: 'C, S, I', t: 'carbono (grafito), azufre y yodo' },
      ],
      controles: [{ id: 'm', etiqueta: 'Material', opciones: MATERIALES.map(m => ({ valor: m[0], texto: m[1] })) }],
      dibujo: v => { const [, , z, p] = material(v.m); return TABLA0({ periodos: 6, escalera: true, probador: { prende: p }, resaltar: [{ Z: z, color: 'h' }], rotulo: `${S118[z - 1]}: el foquito ${p ? 'prende' : 'no prende'}` }); },
      lectura: v => { const [, , z, p] = material(v.m), izq = claseDe(z) === 'metal'; return [`${Nom(z)}: a la ${izq ? 'izquierda' : 'derecha'} de la escalera. El foquito ${p ? 'prende' : 'no prende'}.`]; },
      minimo: 4,
    },
    predice: {
      pieza: 'quim-tira',
      pregunta: 'El silicio de los chips está pegado a la escalera de la tabla. Si cierras el probador con un trozo de silicio, ¿qué hace el foquito?',
      datos: ['Con aluminio, el foquito prende fuerte', 'Con azufre, el foquito no prende'],
      voz: 'Piensa entre qué dos zonas está su casilla.',
      opciones: [
        { id: 'c', texto: 'Prende muy poco: más que con azufre, menos que con aluminio', correcta: true },
        { id: 'brillo', texto: 'Prende fuerte, como con aluminio: el silicio brilla', error: 'QM-METAL-BRILLO', siFuera: 'El silicio brilla, cierto. Pero el brillo solo no lo hace metal: conduce mucho menos.' },
        { id: 'dos', texto: 'No prende, como con azufre: no es un metal', error: 'QM-DOS-CLASES', siFuera: 'No es un metal, cierto. Pero junto a la escalera hay una tercera clase, que conduce un poco.' },
        { id: 'chip', texto: 'Prende más que con aluminio: por eso va en los chips', error: 'QM-CHIP', siFuera: 'Se usa en los chips, cierto. Pero ahí sirve justo porque conduce poco y se puede controlar.' },
      ],
      dibujo: TABLA0({ periodos: 4, escalera: true, resaltar: [{ Z: 14, color: 'h' }] }),
      revelar: OBJ([{ que: 'probador', prende: 1, Z: 14, nombre: 'silicio' }]),
      coincide: 'Coincide: el silicio es un semimetal y conduce poco.',
      noCoincide: 'El silicio es un semimetal: conduce poco, más que un no metal y mucho menos que un metal.',
    },
    mira: {
      pieza: 'quim-tira',
      datos: { simbolos: SIMBOLOS118, marcas: {}, vista: 'tabla', periodos: 6, escalera: true,
        resaltar: [...[11, 13, 50, 82].map(x => ({ Z: x, color: 'h', desde: 1, hasta: 1 })), ...[6, 16, 53, 10].map(x => ({ Z: x, color: 'i', desde: 2, hasta: 2 })), ...SEMIMETALES.map(x => ({ Z: x, desde: 3 }))] },
      voz: 'Miremos un lado de la escalera, el otro y su borde.',
      pasos: [
        { estado: { corte: 1 }, texto: 'A la izquierda de la escalera están los metales: casi toda la tabla.', ecuacion: ['Na, Al, Sn, Pb y todos los de transición'] },
        { estado: { corte: 2 }, texto: 'A la derecha, los no metales: son pocos, y varios son gases.', ecuacion: ['C, S, I, Ne… y el hidrógeno'] },
        { estado: { corte: 3 }, texto: 'Pegados a la escalera, los semimetales: conducen poco.', ecuacion: ['B, Si, Ge, As, Sb y Te'] },
        { estado: { corte: 4 }, texto: 'Un metal pierde electrones y queda como catión; un no metal los gana.', ecuacion: ['Na → Na⁺ + e⁻', SEP, 'Cl + e⁻ → Cl⁻'] },
        { estado: { corte: 5 }, texto: 'El carácter metálico crece hacia la izquierda y hacia abajo.', ecuacion: [Gr('grupo'), ' menor', SEP, Pe('periodo'), ' mayor'] },
        { estado: { corte: 6 }, texto: 'A temperatura ambiente, solo el mercurio y el bromo son líquidos.', ecuacion: ['Hg: metal', SEP, 'Br: no metal'] },
      ],
    },
    regla: {
      texto: 'Metales: a la izquierda de la escalera; brillan, conducen y pierden electrones. No metales: a la derecha; no conducen y ganan electrones. Semimetales: junto a la escalera; conducen poco.',
      ecuacion: ['semimetales: B, Si, Ge, As, Sb, Te', SEP, 'carácter metálico: crece hacia la izquierda y hacia abajo', SEP, 'líquidos: Hg (metal) y Br (no metal)', SEP, 'excepciones: el hidrógeno es no metal; el grafito conduce'],
      condicion: 'las propiedades se comparan a temperatura ambiente.',
      voz: 'Ubica la casilla respecto de la escalera.',
      dibujo: TABLA0({ periodos: 6, escalera: true, resaltar: SEMIMETALES.map(x => ({ Z: x })) }),
    },
    resuelve: {
      pieza: 'quim-tira',
      generar(s) {
        // Tres elementos en L: dos de una fila y uno más abajo, en la columna del más metálico de la fila.
        const [a, b] = azar(s + 900).de([[11, 13], [12, 15], [3, 6], [19, 33], [20, 34], [11, 16]]), c = abajo(a);
        return {
          enunciado: `Ordena de menor a mayor carácter metálico: ${nom(b)} (${lugarTxt(b)}), ${nom(a)} (${lugarTxt(a)}) y ${nom(c)} (${lugarTxt(c)}).`,
          datos: [DM.caracter, `Símbolos: ${[b, a, c].map(z => `${nom(z)} ${S118[z - 1]}`).join(', ')}`],
          dibujo: TABLA0({ periodos: 6, escalera: true, resaltar: [{ Z: a }, { Z: b }, { Z: c }] }),
          pasos: [
            { tipo: 'pide', texto: 'Piden ordenar tres elementos por su carácter metálico, del menor al mayor.' },
            { tipo: 'datos', texto: `El ${nom(a)} y el ${nom(b)} están en el periodo ${periodoDe(a)}. El ${nom(a)} y el ${nom(c)}, en el grupo ${grupoDe(a)}.` },
            { tipo: 'regla', texto: 'El carácter metálico crece hacia la izquierda en un periodo y hacia abajo en un grupo. Comparo de dos en dos.' },
            { tipo: 'cuentas', texto: `En la fila, el ${nom(a)} está más a la izquierda que el ${nom(b)}. En la columna, el ${nom(c)} está más abajo que el ${nom(a)}.`,
              ecuacion: [`${S118[b - 1]} < ${S118[a - 1]}`, SEP, `${S118[a - 1]} < ${S118[c - 1]}`] },
            { tipo: 'sentido', texto: `El ${nom(c)} queda abajo y a la izquierda, donde están los metales que más fácil pierden electrones.` },
          ],
          respuesta: `${S118[b - 1]} < ${S118[a - 1]} < ${S118[c - 1]}`,
        };
      },
    },
    ahoraTu: {
      pieza: 'quim-tira',
      voz: 'Ubica cada casilla: su lado de la escalera, su fila y su columna.',
      generar(sem) {
        const r = azar(sem * 101 + 31), tipo = sem % 5;
        return tipo === 4 ? vfDe(r, AFIRMA_M, [DM.lados, DM.iones]) : [casoCaracter, casoPerfil, casoLugar, casoIon][tipo](r);
      },
    },
  };

  return {
    unidad: 'quimica.tabla-periodica',
    version: '0.4.0',
    // Pasó el lector en frío y el auditor (19 nov): calidad 2, y el validador común lo exige.
    calidad: 2,
    colores: COLORES,
    // «en orden de Z» no es el «orden de reacción» de Cinética: aquí no se marca.
    glosarioSin: ['orden de reacción'],
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/quim-tira.js', '/nucleo/kit/piezas/quim-molecula.js'],
    // Tabla de letras (propuesta §7; regla letras-datos): lo que significa cada letra de los Datos.
    letras: { Z: 'número atómico', n: 'número del nivel', X: 'un elemento sin nombre', Q: 'un elemento sin nombre', R: 'un elemento sin nombre' },
    historia: {
      texto: 'En 1869, Mendeléiev ordenó los elementos conocidos buscando regularidades y dejó casillas vacías para elementos que aún no se conocían; Lothar Meyer trabajaba en clasificaciones parecidas. El orden por masa tenía anomalías que se resolvieron después, al ordenar por número atómico. La tabla de hoy resume configuraciones y propiedades, con sus excepciones.',
      pregunta: '¿Cómo predices algo que todavía nadie ha visto?',
      fuente: { titulo: 'OpenStax, Chemistry 2e, §2.5', url: 'https://openstax.org/books/chemistry-2e/pages/2-5-the-periodic-table' },
    },
    // Glosario (docs/teoria.md §4d): las palabras que la unidad estrena en el curso de química.
    glosario: [
      // Idea 1 (rehecha, 19 nov): cada término con 3 ejemplos; los cuatro que el Resumen muestra llevan `simple`. Ningún
      // `simple`, definición ni ejemplo dice cómo es el rubidio ni que los de una columna se parecen (es la predicción).
      { termino: 'ley periódica', formas: ['ley periódica'], def: 'Regularidad que ordena a los elementos en la tabla, según su número atómico y sus propiedades.',
        simple: 'La regla que explica por qué la tabla tiene esa forma.',
        ejemplos: ['Por ella la tabla tiene 7 filas y 18 columnas.', 'Mendeléiev la usó en 1869 para dejar huecos en su tabla.', 'Desde 1913 se enuncia con el número atómico.'], ver: ['periodo', 'grupo'] },
      { termino: 'periodo', formas: ['periodo', 'periodos'], def: 'Fila de la tabla periódica. Hay siete, y cada una termina en un gas noble.',
        simple: 'Una fila de la tabla periódica.',
        ejemplos: ['El periodo 2 va del litio al neón: 8 elementos.', 'El sodio y el cloro están en el periodo 3.', 'El periodo 1 tiene solo dos: hidrógeno y helio.'], ver: ['grupo', 'gas noble'] },
      { termino: 'grupo', formas: ['grupo', 'grupos'], def: 'Columna de la tabla periódica, también llamada familia. Hay 18; el examen las escribe además con números romanos.',
        simple: 'Una columna de la tabla periódica.',
        ejemplos: ['El litio, el sodio y el potasio están en el grupo 1 (IA).', 'El grupo 18 (VIIIA) es el de los gases nobles.', 'El flúor y el cloro están en el grupo 17 (VIIA).'], ver: ['periodo'] },
      { termino: 'gas noble', formas: ['gas noble', 'gases nobles'], def: 'Elemento del grupo 18 (VIIIA): un gas que casi no reacciona. Con cada uno termina un periodo.',
        simple: 'Un gas que casi no reacciona con nada, como el helio.',
        ejemplos: ['El helio de los globos (Z = 2).', 'El neón de los letreros luminosos (Z = 10).', 'El argón de los focos de filamento (Z = 18).'], ver: ['grupo', 'periodo'] },
      { termino: 'metal alcalino', formas: ['metal alcalino', 'metales alcalinos', 'alcalino', 'alcalinos'], def: 'Elemento de la familia del litio, el sodio y el potasio: el grupo 1 (IA), sin el hidrógeno.',
        ejemplos: ['El litio (Z = 3), el de las baterías.', 'El sodio (Z = 11): está, como ion, en la sal.', 'El potasio (Z = 19).'], ver: ['grupo', 'gas noble'] },
      { termino: 'alcalinotérreo', formas: ['alcalinotérreo', 'alcalinotérreos'], def: 'Elemento de la familia del berilio, el magnesio y el calcio: el grupo 2 (IIA).',
        ejemplos: ['El magnesio (Z = 12).', 'El calcio de los huesos (Z = 20).', 'El berilio (Z = 4).'], ver: ['grupo', 'metal alcalino'] },
      { termino: 'anfígeno', formas: ['anfígeno', 'anfígenos', 'calcógeno', 'calcógenos'], def: 'Elemento de la familia del oxígeno y el azufre: el grupo 16 (VIA).',
        ejemplos: ['El oxígeno del aire (Z = 8).', 'El azufre (Z = 16).', 'El selenio (Z = 34): en otros libros, un calcógeno.'], ver: ['grupo', 'halógeno'] },
      { termino: 'halógeno', formas: ['halógeno', 'halógenos'], def: 'Elemento de la familia del flúor y el cloro: el grupo 17 (VIIA).',
        ejemplos: ['El flúor (Z = 9), el de la pasta dental.', 'El cloro (Z = 17), el de la lejía.', 'El bromo (Z = 35), un líquido rojizo.'], ver: ['grupo', 'gas noble'] },
      { termino: 'metal', formas: ['metal', 'metales'], def: 'Elemento brillante que conduce la corriente y el calor y tiende a perder electrones. Está a la izquierda.',
        ejemplos: ['El cobre de los cables.', 'El hierro de un clavo.', 'El sodio, un metal blando.'], ver: ['no metal', 'semimetal'] },
      { termino: 'no metal', formas: ['no metal', 'no metales'], def: 'Elemento que no conduce bien la corriente y tiende a ganar o compartir electrones. Está a la derecha.',
        ejemplos: ['El azufre.', 'El cloro, un gas.', 'El oxígeno del aire.'], ver: ['metal'] },
      // Ideas 2 a 4 (fase 3, 19 nov): cada idea estrena tres palabras con `simple` y 3 ejemplos. Ningún ejemplo trae el lugar
      // del yodo ni el de la plata (lo que se predice en las ideas 2 y 3) ni dice cómo conduce el silicio (idea 4).
      { termino: 'electrones de valencia', formas: ['electrones de valencia', 'electrón de valencia', 'de valencia'],
        def: 'Los electrones del nivel más alto de un átomo: los que participan cuando se une con otros.',
        simple: 'Los electrones de más afuera del átomo.',
        ejemplos: ['El azufre, 3s² 3p⁴, tiene 2 + 4 = 6.', 'El sodio, 3s¹, tiene 1.', 'El carbono, 2s² 2p², tiene 4.'], ver: ['grupo', 'símbolo de Lewis'] },
      { termino: 'símbolo de Lewis', formas: ['símbolo de Lewis', 'símbolos de Lewis', 'puntos de Lewis'],
        def: 'El símbolo del elemento rodeado de un punto por cada electrón de su nivel más alto.',
        simple: 'El símbolo del elemento con sus electrones de afuera dibujados como puntos.',
        ejemplos: ['El nitrógeno lleva 5 puntos.', 'El sodio lleva 1 punto.', 'El helio lleva 2 puntos.'], ver: ['electrones de valencia'] },
      { termino: 'elemento representativo', formas: ['elemento representativo', 'elementos representativos', 'representativo', 'representativos'],
        def: 'Elemento de los grupos A (columnas 1, 2 y 13 a 18): su configuración termina en s o en p.',
        simple: 'Un elemento de las columnas de los extremos de la tabla.',
        ejemplos: ['El sodio, que termina en 3s¹.', 'El azufre, que termina en 3s² 3p⁴.', 'El hierro no lo es: termina en 3d⁶.'], ver: ['grupo', 'bloque'] },
      { termino: 'bloque', formas: ['bloque', 'bloques'], def: 'Zona de la tabla según el subnivel donde cae el último electrón: s, p, d o f.',
        simple: 'Una zona de la tabla, según el último subnivel que se llena.',
        ejemplos: ['El calcio, [Ar] 4s², es del bloque s.', 'El cloro, que termina en 3p⁵, es del bloque p.', 'El hierro, [Ar] 4s² 3d⁶, es del bloque d.'], ver: ['metal de transición'] },
      { termino: 'metal de transición', formas: ['metal de transición', 'metales de transición', 'de transición'],
        def: 'Elemento del bloque d (grupos B, columnas 3 a 12): su configuración termina en d.',
        simple: 'Un metal del centro de la tabla, como el hierro o el cobre.',
        ejemplos: ['El hierro de un clavo.', 'El titanio, [Ar] 4s² 3d².', 'El cinc, [Ar] 4s² 3d¹⁰.'], ver: ['bloque', 'transición interna'] },
      { termino: 'transición interna', formas: ['transición interna'], def: 'Nombre de los elementos del bloque f: los que van en las dos filas de abajo de la tabla.',
        simple: 'Los elementos de las dos filas que van aparte, abajo.',
        ejemplos: ['Los lantánidos, que siguen al lantano.', 'El uranio, del bloque f.', 'El hierro no lo es: termina en d.'], ver: ['bloque'] },
      { termino: 'semimetal', formas: ['semimetal', 'semimetales'], def: 'Elemento cuya casilla está a la derecha de la escalera y la toca: boro, silicio, germanio, arsénico, antimonio, telurio.',
        simple: 'Un elemento de la orilla de la escalera de la tabla.',
        ejemplos: ['El boro (B).', 'El germanio (Ge).', 'El arsénico (As).'], ver: ['metal', 'no metal'] },
      { termino: 'carácter metálico', formas: ['carácter metálico'], def: 'Qué tan fácil pierde electrones un elemento. Crece hacia la izquierda y hacia abajo en la tabla.',
        simple: 'Qué tan metal es un elemento.',
        ejemplos: ['El potasio tiene más que el litio: está más abajo.', 'El sodio tiene más que el aluminio: está más a la izquierda.', 'El cesio tiene más que el sodio.'], ver: ['metal'] },
      { termino: 'maleable', formas: ['maleable', 'maleables'], def: 'Dicho de un material que se deja laminar, es decir, aplastar en láminas, sin romperse.',
        simple: 'Que se puede aplastar en láminas sin que se rompa.',
        ejemplos: ['El papel de aluminio.', 'Una lámina de cobre.', 'El pan de oro de un retablo.'], ver: ['metal'] },
    ],
    ideas: [ley, ubicacion, bloquesT, metales],
  };
});
