/*
 * Teoría de «Propiedades periódicas» (quimica.propiedades-periodicas). Molde: docs/teoria.md y docs/molde-unidad.md;
 * unidad modelo: contenido/teoria/quimica/estructura-atomica.js. Compañera: Bruna (castora), voz resolutiva y cálida.
 *
 * Unidad nueva (19 nov 2026, etapa 5 del plan de calidad): nace al partir «Tabla periódica» en dos
 * (docs/etapa5/propuesta-quimica.md §3 y §12; Gerson delegó el criterio y revisa después). Aquí va lo que se compara.
 * Cuatro ideas, en este orden y con estos id (el avance se guarda con ellos): 1 «Radio atómico» (`radio-atomico-ionico`,
 * conserva su id), 2 «Radio de iones e isoelectrónicos» (`radio-ionico`, nueva), 3 «Energía de ionización y afinidad
 * electrónica» (`energia-ionizacion`) y 4 «Electronegatividad y carácter metálico» (`electronegatividad`). El avance de
 * las tres ideas que vienen de Tabla periódica y de las dos mesas se migra con la partición `partidoTP` (nucleo/avance.js).
 * Fase 3 del método (19 nov): las cuatro ideas están rehechas contra el contrato, con sus 15 ejemplos cada una. No
 * declara calidad: 2 (la sesión la marca después del lector en frío y el auditor); su prueba simula la marca.
 *
 * Mapa de colores (propuesta §8B, un color fijo por magnitud): Z y los protones naranja (c-o), radio turquesa (c-i),
 * energía (de ionización y afinidad) carmín (c-h), electronegatividad violeta (c-f); la carga del ion y los electrones en
 * tinta; sin verde. Cada ficha lleva su magnitud (m) y la prueba de la unidad revisa que su color sea el del mapa.
 * Objetos de la primera pantalla (quim-tira, de prueba): el grano de sal de Maras bajo la lupa (1), el salero (2), la
 * romana del mercado (3, analogía que «Lee» presenta con su límite) y dos que jalan una soga (4, analogía).
 *
 * Datos (con su fuente; los mismos de plantillas/atomo-y-tabla/motor.js donde coinciden):
 *   radio atómico: calculado de Clementi, Raimondi y Reinhardt (1967), en pm, una sola escala;
 *   radio iónico: Shannon (1976), radios efectivos con número de coordinación 6, en pm; los átomos y los iones vienen
 *     de tablas distintas: la unidad compara ion con ion por sus números y el átomo con su ion solo por cuál es mayor;
 *   energía de ionización (y las sucesivas): NIST Atomic Spectra Database, redondeadas a kJ/mol;
 *   afinidad electrónica: OpenStax, Chemistry 2e, §6.5 (figura de afinidades), en kJ/mol, negativa si se libera;
 *   electronegatividad: Pauling revisada por Allred (1961), tabla del CRC; los gases nobles, sin valor.
 * Errores: docs/investigacion/atomo-enlace-ideas-erroneas.md (TP4, TP6, TP7, TP8); los QM- son hipótesis nuevas.
 * Cuentas rehechas aparte en scratchpad (e5-quimica/cuentas-b.py), por otro camino que el de este archivo.
 * Fuentes (no van al alumno): OpenStax Chemistry 2e §6.5; tabla periódica IUPAC; Shannon (1976), Acta Cryst. A32.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = l => l[Math.floor(r() * l.length)];
    r.baraja = l => { const a = l.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    return r;
  }
  // ---------- Colores, fichas y letras ----------
  const COLORES = { z: 'o', radio: 'i', energia: 'h', en: 'f' };
  const ficha = m => t => ({ v: `c-${COLORES[m]}`, t: String(t), m });
  const Pz = ficha('z'), Rr = ficha('radio'), Ei = ficha('energia'), Ne = ficha('en');
  const Zf = Pz('Z'), EIf = Ei('EI'), ENf = Ne('EN');
  const letra = L => ({ negrita: [L] });
  const SEP = '   ·   ';
  const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const sup = x => String(x).split('').map(c => SUP[c] || c).join('');
  // Opciones de una pregunta: la primera es la correcta; las demás, [texto, error, siFuera]. Sin repetidas.
  function ops(correcta, ...malas) {
    const vistos = new Set([correcta]), out = [{ id: 'c', texto: correcta, correcta: true }];
    malas.forEach(([texto, error, siFuera], k) => { if (texto && !vistos.has(texto)) { vistos.add(texto); out.push({ id: `e${k}`, texto, error, siFuera }); } });
    return out.slice(0, 4);
  }

  // ---------- Datos (índice = Z) ----------
  const SIMB = ['', 'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca', 'Sc', 'Ti', 'V', 'Cr',
    'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr', 'Rb', 'Sr'];
  const NOMBRE = ['', 'hidrógeno', 'helio', 'litio', 'berilio', 'boro', 'carbono', 'nitrógeno', 'oxígeno', 'flúor', 'neón', 'sodio', 'magnesio', 'aluminio',
    'silicio', 'fósforo', 'azufre', 'cloro', 'argón', 'potasio', 'calcio', 'escandio', 'titanio', 'vanadio', 'cromo', 'manganeso', 'hierro', 'cobalto',
    'níquel', 'cobre', 'cinc', 'galio', 'germanio', 'arsénico', 'selenio', 'bromo', 'kriptón', 'rubidio', 'estroncio'];
  const EI = [null, 1312, 2372, 520, 900, 801, 1086, 1402, 1314, 1681, 2081, 496, 738, 578, 787, 1012, 1000, 1251, 1521, 419, 590, 633, 659, 651, 653,
    717, 762, 760, 737, 745, 906, 579, 762, 944, 941, 1140, 1351];
  const RADIO = [null, 53, 31, 167, 112, 87, 67, 56, 48, 42, 38, 190, 145, 118, 111, 98, 88, 79, 71, 243, 194, 184, 176, 171, 166, 161, 156, 152, 149,
    145, 142, 136, 125, 114, 103, 94, 88];
  const EN = [null, 2.20, null, 0.98, 1.57, 2.04, 2.55, 3.04, 3.44, 3.98, null, 0.93, 1.31, 1.61, 1.90, 2.19, 2.58, 3.16, null, 0.82, 1.00, 1.36, 1.54,
    1.63, 1.66, 1.55, 1.83, 1.88, 1.91, 1.90, 1.65, 1.81, 2.01, 2.18, 2.55, 2.96, null];
  // Radios iónicos de Shannon (1976), NC 6, en pm: «símbolo del ion» → [Z, carga, radio].
  const ION = { 'Li⁺': [3, 1, 76], 'Na⁺': [11, 1, 102], 'K⁺': [19, 1, 138], 'Rb⁺': [37, 1, 152], 'Be²⁺': [4, 2, 45], 'Mg²⁺': [12, 2, 72], 'Ca²⁺': [20, 2, 100],
    'Sr²⁺': [38, 2, 118], 'Al³⁺': [13, 3, 53.5], 'F⁻': [9, -1, 133], 'Cl⁻': [17, -1, 181], 'Br⁻': [35, -1, 196], 'O²⁻': [8, -2, 140], 'S²⁻': [16, -2, 184], 'Se²⁻': [34, -2, 198] };
  // Energías de ionización sucesivas (NIST), en kJ/mol, hasta el primer salto grande.
  const SUCESIVAS = { 3: [520, 7298, 11815], 4: [900, 1757, 14849], 5: [801, 2427, 3660, 25026], 6: [1086, 2353, 4621, 6223, 37831], 11: [496, 4562, 6910],
    12: [738, 1451, 7733], 13: [578, 1817, 2745, 11577], 14: [787, 1577, 3232, 4356, 16091], 19: [419, 3052, 4420], 20: [590, 1145, 4912] };
  // Afinidad electrónica (kJ/mol; negativa: el átomo libera energía al ganar el electrón).
  const AE = { 1: -73, 3: -60, 6: -122, 8: -141, 9: -328, 11: -53, 14: -134, 15: -72, 16: -200, 17: -349, 19: -48, 35: -325 };
  const SIMBOLOS = Object.fromEntries(SIMB.slice(0, 37).map((s, z) => [z, s]).filter(([z]) => +z > 0));
  const valores = (t, zs) => Object.fromEntries(zs.filter(z => t[z] !== undefined).map(z => [z, t[z] === null ? NaN : t[z]]));
  const TODOS = Array.from({ length: 36 }, (_, i) => i + 1);
  const zr = v => Object.assign({}, v, { z: Math.round(v.z) });
  // Lugar en la tabla, deducido de Z (orden 1s 2s 2p 3s 3p 4s 3d 4p).
  function lugar(z) {
    const periodo = z <= 2 ? 1 : z <= 10 ? 2 : z <= 18 ? 3 : z <= 36 ? 4 : 5;
    const ini = [0, 1, 3, 11, 19, 37][periodo], k = z - ini;
    let grupo;
    if (periodo === 1) grupo = z === 1 ? 1 : 18;
    else if (periodo < 4) grupo = k < 2 ? k + 1 : k + 11;
    else grupo = k + 1;
    return { periodo, grupo };
  }
  const ROM = { 1: 'IA', 2: 'IIA', 13: 'IIIA', 14: 'IVA', 15: 'VA', 16: 'VIA', 17: 'VIIA', 18: 'VIIIA' };
  const grupoAB = g => `${g} (${ROM[g]})`;
  const Nom = z => NOMBRE[z].charAt(0).toUpperCase() + NOMBRE[z].slice(1);
  const lugarTxt = z => `${Nom(z)} (${SIMB[z]}): periodo ${lugar(z).periodo}, grupo ${grupoAB(lugar(z).grupo)}`;
  const tabla = extra => ({ pieza: 'quim-tabla', datos: Object.assign({ periodos: 4, simbolos: SIMBOLOS }, extra), estado: {} });
  const OBJ = (objetos, o) => ({ pieza: 'quim-tira', datos: Object.assign({ vista: 'objetos', simbolos: SIMBOLOS, marcas: {}, objetos }, o), estado: {} });
  const ESF = (esferas, o) => ({ pieza: 'quim-tira', datos: Object.assign({ vista: 'esferas', simbolos: SIMBOLOS, marcas: {}, max: 250, esferas }, o), estado: {} });
  const atomoE = (z, o) => Object.assign({ s: SIMB[z], r: RADIO[z], p: z }, o);
  // Gesto directo del laboratorio (docs/teoria.md §4b), con la geometría de quim-tabla.
  const QT = () => Kit.piezas['quim-tabla'];
  const enCasilla = z => { const c = QT().casilla(z); return { x: c.cx, y: c.cy }; };
  const zBajo = (pt, z) => {
    const c = QT().celda(pt, 4); if (!c) return z;
    if (c.col === 2) return c.per === 4 ? (z >= 21 && z <= 30 ? z : 21) : z;
    return QT().zDe(c.col, c.per) || z;
  };
  // Las líneas de Datos que se repiten.
  const D = {
    gases: 'Gases nobles: Z = 2, 10, 18 y 36',
    grupos: 'Grupos A: columnas 1, 2 y 13 a 18',
    carga: 'Carga de un ion = protones − electrones',
    ae: 'AE negativa: el átomo libera energía al ganar el electrón',
    delta: 'ΔEN = EN del mayor − EN del menor',
  };
  const vf = l => l.map(x => (x ? 'V' : 'F')).join('');
  const ROMANO = ['I', 'II', 'III'];
  // V/F de tres afirmaciones de un banco [[texto, verdad, por qué]…], con un distractor por afirmación invertida.
  function vfDe(r, banco, datos) {
    const tres = r.baraja(banco.map((_, i) => i)).slice(0, 3).sort((a, b) => a - b).map(i => banco[i]), bien = tres.map(x => x[1]);
    const o = [{ id: 'c', texto: vf(bien), correcta: true }];
    tres.forEach((x, i) => { const otra = bien.slice(); otra[i] = !otra[i]; o.push({ id: `vf${i}`, texto: vf(otra), error: x[1] ? 'QM-VF-NIEGA' : 'QM-VF-ACEPTA', siFuera: `Las otras dos están bien. La ${ROMANO[i]} es ${x[1] ? 'verdadera' : 'falsa'}: ${x[2]}.` }); });
    const clave = tres.find(x => !x[1]) || tres[0], ic = tres.indexOf(clave);
    return { pregunta: ['Indica verdadero (V) o falso (F). ', ...tres.map((x, i) => `${ROMANO[i]}. ${x[0]} `)], datos, opciones: o,
      solucion: { texto: `${tres.map((x, i) => `${ROMANO[i]} ${x[1] ? 'V' : 'F'}`).join(', ')}. La ${ROMANO[ic]} es ${clave[1] ? 'verdadera' : 'falsa'}: ${clave[2]}.` } };
  }

  // ---------- Idea 1 (rehecha, 19 nov): radio atómico ----------
  // Propuesta B1. Objeto de la primera pantalla: un grano de sal de Maras bajo la lupa (quim-tira, de prueba).
  // Cambia: la columna que se mira · Permanece: los átomos a escala, con sus protones · Progresa: de una columna (crece
  // hacia abajo) a una fila (baja hacia la derecha) · Se reserva: la fila del periodo 3 junta (Predice) · Debe verse: el
  // tamaño de cada círculo frente al de arriba.
  // Errores: TP4 (más electrones, más grande; 50 % en Tan y otros 2005, ítem 2), QM-RADIO-NIVEL (mismos niveles, mismo
  // tamaño), QM-RADIO-MITAD (sube y baja), QM-RADIO-GRUPO (el de arriba es mayor), QM-RADIO-INVERSO (invierte las dos),
  // QM-SIN-LEY (no se puede saber sin medir), QM-RADIO-DIST (el radio es la distancia entera).
  const COL = { 1: [1, 3, 11, 19], 2: [4, 12, 20], 13: [5, 13, 31], 14: [6, 14, 32], 15: [7, 15, 33], 16: [8, 16, 34], 17: [9, 17, 35], 18: [2, 10, 18, 36] };
  const DR = { def: 'Radio atómico, r: la mitad de la distancia entre los núcleos de dos átomos iguales unidos', pm: '1 pm = 10⁻¹² m (un picómetro)' };
  const radios = zs => `r (pm): ${zs.map(z => `${SIMB[z]} ${RADIO[z]}`).join('; ')}`;
  // Tríos «pivote, el de abajo (mayor), el de la derecha (menor)» o «pivote, el de la izquierda (mayor), el de arriba
  // (menor)»: la regla los ordena sin mirar la tabla. Unos para «Así se resuelve», otros para «Ahora tú».
  const TRIOS_R = [[11, 19, 12], [3, 11, 9], [6, 14, 7], [20, 19, 12], [8, 16, 9], [13, 31, 14], [3, 11, 4], [12, 20, 13]];
  const TRIOS_A = [[5, 13, 6], [16, 34, 17], [15, 33, 16], [4, 12, 5], [14, 32, 15], [7, 15, 8]];
  const PARES_GRUPO = [[3, 11], [11, 19], [9, 17], [17, 35], [4, 20], [5, 13], [6, 14], [8, 16], [15, 33], [12, 20]];
  const PARES_PERIODO = [[11, 17], [12, 16], [3, 9], [13, 15], [19, 35], [6, 8], [20, 31], [4, 7], [14, 16], [11, 13]];
  const mayorR = zs => zs.slice().sort((a, b) => RADIO[b] - RADIO[a]);
  function casoParRadio(r, grupo) {
    const [a, b] = r.baraja(r.de(grupo ? PARES_GRUPO : PARES_PERIODO)), [m, o] = mayorR([a, b]);
    return {
      pregunta: `¿Qué átomo tiene mayor radio: el de ${NOMBRE[a]} o el de ${NOMBRE[b]}?`,
      datos: [lugarTxt(a), lugarTxt(b)],
      dibujo: tabla({ marcadas: [{ Z: a, color: 'i' }, { Z: b, color: 'i' }] }),
      opciones: ops(`El de ${NOMBRE[m]}`,
        [`El de ${NOMBRE[o]}`, grupo ? 'QM-RADIO-GRUPO' : 'TP4', grupo ? 'Sería así si el de arriba tuviera más niveles. En una columna, el de abajo tiene un nivel más de electrones, que queda más lejos del núcleo, así que es el mayor.' : 'Sería así si sus electrones de más abrieran un nivel nuevo. Entran al mismo nivel que los del otro, y su núcleo, con más protones, los jala más cerca: es el menor.'],
        ['Miden lo mismo', 'QM-RADIO-NIVEL', grupo ? 'Serían iguales si tuvieran los mismos niveles. Ser de la misma familia no los iguala: el de abajo tiene un nivel más de electrones, así que es más grande.' : 'Serían iguales si sus núcleos tuvieran la misma carga. Tienen los mismos niveles, pero el de la derecha tiene más protones, jala más fuerte y queda más pequeño.'],
        ['No se puede saber sin medirlos', 'QM-SIN-LEY', 'Sería así si estuvieran lejos, en diagonal. Comparten fila o columna, y ahí el radio sigue una tendencia: el lugar de cada átomo basta para compararlos.']),
      solucion: { texto: grupo ? `Están en la misma columna, y el ${NOMBRE[m]}, más abajo, tiene un nivel más de electrones, más lejos del núcleo, así que es el mayor.` : `Están en el mismo periodo, con el electrón de afuera en el mismo nivel, pero el ${NOMBRE[o]}, a la derecha, tiene más protones que lo jalan más cerca: es el menor.`,
        ecuacion: [`${SIMB[m]} `, Rr(`${RADIO[m]} pm`), ' > ', `${SIMB[o]} `, Rr(`${RADIO[o]} pm`)] },
    };
  }
  // Las cuatro maneras de ordenar un trío [pivote, mayor, menor]: la correcta y la de cada error.
  function ordenesTrio([p, gr, ch], s) {
    const t = l => l.map(z => s(z)).join(' > ');
    return { bien: t([gr, p, ch]), inversa: t([ch, p, gr]), grupo: t([p, gr, ch]), periodo: t([gr, ch, p]) };
  }
  function casoTrioRadio(r, conZ) {
    const trio = r.de(TRIOS_A), [p, gr, ch] = trio, L = conZ ? Object.fromEntries(r.baraja(['X', 'Q', 'R']).map((x, i) => [trio[i], x])) : null;
    const s = z => (conZ ? L[z] : SIMB[z]), o = ordenesTrio(trio, s), lista = r.baraja(trio);
    return {
      pregunta: conZ ? `Los elementos ${lista.slice(0, 2).map(z => `${L[z]} (Z = ${z})`).join(', ')} y ${L[lista[2]]} (Z = ${lista[2]}) son de los grupos A. ¿Cuál es el orden de sus radios atómicos, de mayor a menor?`
        : `Ordena de mayor a menor radio atómico: ${lista.map(z => NOMBRE[z]).join(', ')}.`,
      datos: conZ ? [D.gases, D.grupos] : lista.map(lugarTxt),
      opciones: ops(o.bien, [o.inversa, 'QM-RADIO-INVERSO', 'Ese orden sería cierto si el radio creciera hacia arriba y hacia la derecha. Crece hacia abajo y hacia la izquierda, así que el orden va al revés.'],
        [o.grupo, 'QM-RADIO-GRUPO', 'Sería así si en una columna el de arriba fuera el mayor. El de abajo tiene un nivel más de electrones, más lejos del núcleo, así que es el mayor de los tres.'],
        [o.periodo, 'TP4', 'Sería así si más protones agrandaran el átomo. En una fila, los electrones nuevos van al mismo nivel y el de la derecha los jala más, así que es el menor.']),
      solucion: { texto: conZ ? `Son ${trio.map(z => `${s(z)} = ${SIMB[z]}`).join(', ')}. En la columna, el de abajo es mayor porque tiene un nivel más; en la fila, el de la derecha es menor porque tiene más protones.` : 'En una columna, el de abajo es el mayor porque tiene un nivel más; en una fila, el de la derecha es el menor porque tiene más protones para el mismo nivel.',
        ecuacion: [Rr(o.bien.replace(/ > /g, ' > '))] },
    };
  }
  function casoDistancia(r) {
    const d = 2 * r.ent(30, 140);
    return {
      pregunta: `Dos átomos iguales de un elemento X están unidos y sus núcleos quedan a ${d} pm. ¿Cuál es el radio atómico de X?`,
      datos: [DR.def],
      opciones: ops(`${d / 2} pm`, [`${d} pm`, 'QM-RADIO-DIST', 'Sería así si el radio midiera de núcleo a núcleo. El radio es de un solo átomo, así que es la mitad de esa distancia.'],
        [`${2 * d} pm`, 'QM-RADIO-DOBLE', 'Duplicar la distancia daría el ancho de los dos átomos juntos. Entre los dos núcleos caben dos radios, así que se divide entre 2.'],
        [`${d / 4} pm`, 'QM-RADIO-CUARTO', 'Dividir entre 4 serviría si entre los núcleos cupieran cuatro radios. Caben solo dos, uno de cada átomo, así que se divide entre 2.']),
      solucion: { texto: 'Entre los dos núcleos caben dos radios, uno de cada átomo, así que el radio es la mitad de la distancia.', ecuacion: [Rr('r'), ` = ${d} ÷ 2 = `, Rr(`${d / 2} pm`)] },
    };
  }

  // Ejemplos de la idea 1. Cuentas rehechas aparte (scratchpad, e5-quimica/cuentas-b.py): 142 ÷ 2 = 71 · 10⁻⁹ ÷ 10⁻¹² =
  // 1000 · Li 167 < Na 190 · C 67 > F 42 · 194 − 145 = 49 · Br 94 > Cl 79 > F 42 · 190 ÷ 79 ≈ 2,4 · Z 12 (Mg) 145 > Z 16 (S)
  // 88 · 17 − 11 = 6 · K 243 > Na 190 · K 243 > Na 190 > Mg 145 > Cl 79 · Z 9, 17, 19 → F, Cl, K: R > Q > X · Ca 194 > Mg
  // 145 y > Br 94, < K 243 · K 243 > Ca 194 > Br 94.
  const EJEMPLOS_RADIO = [
    { nivel: 1, titulo: 'La mitad de la distancia',
      enunciado: 'Dos átomos iguales de un elemento X están unidos y sus núcleos quedan a 142 pm. ¿Cuál es el radio atómico de X?',
      datos: [DR.def],
      figura: ESF([{ s: 'X', oculto: true }, { s: 'X', oculto: true }], { rotulo: 'Entre los dos núcleos: 142 pm' }),
      solucion: [{ texto: 'Entre los dos núcleos caben dos radios, uno de cada átomo, así que el radio es la mitad de esa distancia.', ecuacion: [Rr('r'), ' = 142 ÷ 2 = ', Rr('71 pm')] }],
      respuesta: [Rr('r = 71 pm')] },
    { nivel: 1, titulo: 'Picómetros en un nanómetro',
      enunciado: '¿Cuántos picómetros (pm) hay en un nanómetro (nm)?',
      datos: [DR.pm, '1 nm = 10⁻⁹ m (un nanómetro)'],
      solucion: [{ texto: 'Divido las dos medidas, escritas en metros; al dividir potencias de 10, los exponentes se restan.', ecuacion: ['10⁻⁹ ÷ 10⁻¹² = 10³ = ', Rr('1000')] }],
      respuesta: ['1 nm = ', Rr('1000 pm')] },
    { nivel: 1, titulo: 'Bajando por el grupo 1',
      enunciado: '¿Qué átomo es más grande: el de litio o el de sodio?',
      datos: [lugarTxt(3), lugarTxt(11)],
      solucion: [{ texto: 'Están en la misma columna, y el sodio, una fila más abajo, tiene un nivel más de electrones, así que es el más grande.', ecuacion: ['Li ', Rr('167 pm'), ' < Na ', Rr('190 pm')] }],
      respuesta: ['El de ', Rr('sodio')] },
    { nivel: 1, titulo: 'A lo largo del periodo 2',
      enunciado: '¿Qué átomo es más grande: el de carbono o el de flúor?',
      datos: [lugarTxt(6), lugarTxt(9)],
      solucion: [{ texto: 'Están en la misma fila: el flúor tiene 3 protones más jalando el mismo nivel 2, así que es el más pequeño.', ecuacion: ['C ', Rr('67 pm'), ' > F ', Rr('42 pm')] }],
      respuesta: ['El de ', Rr('carbono')] },
    { nivel: 1, titulo: 'Cuánto más mide el calcio',
      enunciado: 'En la tabla de radios, el magnesio mide 145 pm y el calcio, 194 pm. ¿Cuántos picómetros más mide el calcio?',
      datos: ['r (Mg) = 145 pm; r (Ca) = 194 pm'],
      solucion: [{ texto: 'La diferencia entre los dos radios dice cuánto más mide el calcio.', ecuacion: [Rr('194 pm'), ' − ', Rr('145 pm'), ' = ', Rr('49 pm')] }],
      respuesta: [Rr('49 pm'), ' más'] },
    { nivel: 2, titulo: 'Tres halógenos',
      enunciado: 'Ordena de mayor a menor radio atómico: cloro, flúor y bromo.',
      datos: [lugarTxt(9), lugarTxt(17), lugarTxt(35)],
      solucion: [
        { texto: 'Los tres están en el grupo 17: hacia abajo, cada fila suma un nivel, así que el de más abajo es el mayor.', ecuacion: ['Br (periodo 4) > Cl (3) > F (2)'] },
        { texto: 'Los valores de la tabla de radios confirman ese orden.', ecuacion: ['Br ', Rr('94'), ' > Cl ', Rr('79'), ' > F ', Rr('42 pm')] },
      ],
      respuesta: [Rr('Br > Cl > F')] },
    { nivel: 2, titulo: 'Cuántas veces más ancho',
      enunciado: 'El átomo de sodio mide 190 pm de radio y el de cloro, 79 pm. ¿Cuántas veces más ancho es el de sodio? Redondea a décimos.',
      datos: ['r (Na) = 190 pm; r (Cl) = 79 pm', 'Ancho de un átomo = 2 × r'],
      solucion: [
        { texto: 'Divido los dos anchos: el 2 de arriba y el de abajo se cancelan.', ecuacion: ['(2 × 190) ÷ (2 × 79) = 190 ÷ 79 ≈ ', Rr('2,4')] },
        { texto: 'El resultado tiene sentido: los dos son del periodo 3, y el sodio, a la izquierda, tiene menos protones jalando el mismo nivel.' },
      ],
      respuesta: ['Unas ', Rr('2,4 veces')] },
    { nivel: 2, titulo: 'Del número atómico al tamaño',
      enunciado: 'Dos elementos tienen Z = 12 y Z = 16. ¿Cuál tiene mayor radio atómico?',
      datos: [D.gases, D.grupos],
      solucion: [
        { texto: 'Cuento desde los gases nobles: 12 es el segundo después del neón; 16 está dos antes del argón.', ecuacion: [Pz('Z = 12'), ': periodo 3, grupo 2', SEP, Pz('Z = 16'), ': periodo 3, grupo 16'] },
        { texto: 'En el mismo periodo, el de la izquierda es el mayor, porque tiene menos protones jalando el mismo nivel.', ecuacion: ['Mg ', Rr('145 pm'), ' > S ', Rr('88 pm')] },
      ],
      respuesta: ['El de ', Pz('Z = 12'), ', el magnesio'] },
    { nivel: 2, titulo: 'Los protones de más',
      enunciado: 'El sodio (Z = 11) y el cloro (Z = 17) tienen electrones en 3 niveles. ¿Cuántos protones más tiene el núcleo del cloro y cuál de los dos átomos es menor?',
      datos: ['Z: número de protones del núcleo'],
      solucion: [
        { texto: 'Resto los dos números atómicos, porque Z cuenta los protones de cada núcleo.', ecuacion: ['17 − 11 = ', Pz('6 protones')] },
        { texto: 'El cloro tiene los mismos 3 niveles, pero jalados por 6 protones más, así que es el menor.', ecuacion: ['Cl ', Rr('79 pm'), ' < Na ', Rr('190 pm')] },
      ],
      respuesta: [Pz('6 protones'), ' más; menor, el ', Rr('cloro')] },
    { nivel: 2, titulo: 'Un nivel más',
      enunciado: 'El sodio tiene la configuración [Ne] 3s¹ y el potasio, [Ar] 4s¹. ¿Cuántos niveles con electrones tiene cada uno y cuál es más grande?',
      datos: ['[Ne]: 1s² 2s² 2p⁶', '[Ar]: 1s² 2s² 2p⁶ 3s² 3p⁶'],
      solucion: [
        { texto: 'El número delante de la s dice el nivel de afuera: el sodio llega al nivel 3 y el potasio, al nivel 4.', ecuacion: ['Na: 3 niveles', SEP, 'K: 4 niveles'] },
        { texto: 'Con un nivel más, el electrón de afuera del potasio queda más lejos del núcleo, así que el potasio es el mayor.', ecuacion: ['K ', Rr('243 pm'), ' > Na ', Rr('190 pm')] },
      ],
      respuesta: ['3 y 4 niveles; mayor, el ', Rr('potasio')] },
    { nivel: 3, titulo: 'Cuatro elementos para ordenar',
      enunciado: 'Ordena de mayor a menor radio atómico: Mg, Na, K y Cl.',
      alternativas: ['K > Na > Mg > Cl', 'Cl > Mg > Na > K', 'Na > K > Mg > Cl', 'K > Mg > Na > Cl', 'Mg > Na > K > Cl'],
      datos: ['Na, Mg y Cl: periodo 3 (grupos 1, 2 y 17)', 'K: periodo 4, grupo 1'],
      solucion: [
        { texto: 'Na, Mg y Cl están en el periodo 3, donde el radio baja de izquierda a derecha. El K está debajo del Na, con un nivel más: es el mayor.', ecuacion: [Rr('K > Na > Mg > Cl')] },
        { texto: ['La ', letra('B'), ' invierte las dos tendencias y pone primero al más pequeño. La ', letra('C'), ' pone al Na antes que el K, como si el de arriba fuera mayor, pero el K tiene un nivel más.'] },
        { texto: ['La ', letra('D'), ' pone al Mg antes que el Na por su electrón de más, pero ese electrón entra al mismo nivel y su protón de más lo jala. La ', letra('E'), ' deja al K detrás del Na y del Mg, aunque es el único con cuatro niveles.'] },
      ],
      respuesta: [letra('A'), ', ', Rr('K > Na > Mg > Cl')] },
    { nivel: 3, titulo: 'Así cambia el periodo 3',
      enunciado: 'Del sodio al cloro, en el periodo 3, ¿qué afirmación sobre el radio atómico es correcta?',
      alternativas: ['Crece, porque cada átomo tiene un electrón más.', 'Disminuye, porque la carga nuclear aumenta y el nivel es el mismo.', 'No cambia, porque todos tienen tres niveles.',
        'Crece, porque aumenta el número atómico.', 'Disminuye, porque cada átomo tiene un nivel menos.'],
      datos: ['Sodio: Z = 11; cloro: Z = 17', 'Del sodio al cloro, los electrones llegan al nivel 3'],
      solucion: [
        { texto: 'Los electrones nuevos van al nivel 3 y los protones nuevos jalan a todos: el radio baja.', ecuacion: ['Na ', Rr('190 pm'), ' → Cl ', Rr('79 pm')] },
        { texto: ['La ', letra('A'), ' y la ', letra('D'), ' dicen que crece, pero ni el electrón de más ni el Z mayor agrandan el átomo: el electrón entra al mismo nivel y el protón nuevo lo jala.'] },
        { texto: ['La ', letra('C'), ' mira solo los niveles y olvida que la carga nuclear crece en cada paso. La ', letra('E'), ' acierta en que el radio baja, pero no en la causa: todos tienen 3 niveles.'] },
      ],
      respuesta: [letra('B'), ', disminuye por la ', Pz('carga nuclear')] },
    { nivel: 3, titulo: 'Tres elementos sin nombre',
      enunciado: 'Los elementos X, Q y R tienen Z = 9, Z = 17 y Z = 19. ¿Cuál es el orden de sus radios atómicos, de mayor a menor?',
      alternativas: ['X > Q > R', 'Q > R > X', 'R > Q > X', 'R > X > Q', 'Q > X > R'],
      datos: [D.gases, D.grupos],
      solucion: [
        { texto: 'Ubico cada uno en la tabla contando desde los gases nobles.', ecuacion: [Pz('9'), ': periodo 2, grupo 17', SEP, Pz('17'), ': periodo 3, grupo 17', SEP, Pz('19'), ': periodo 4, grupo 1'] },
        { texto: 'X y Q son de la misma columna: Q, más abajo, es mayor. R está más abajo y a la izquierda: es el mayor.', ecuacion: [Rr('R > Q > X')] },
        { texto: ['La ', letra('A'), ' invierte el orden y pone primero al más pequeño. La ', letra('B'), ' pone a Q antes que R, aunque R está una fila más abajo y tiene un nivel más.'] },
        { texto: ['La ', letra('D'), ' pone a X antes que Q, aunque Q, debajo de X, tiene un nivel más. La ', letra('E'), ' deja a R al final, aunque está más abajo y más a la izquierda que los otros dos.'] },
      ],
      respuesta: [letra('C'), ', ', Rr('R > Q > X')] },
    { nivel: 3, titulo: 'Un elemento del grupo 2',
      enunciado: 'El elemento X está en el periodo 4 y en el grupo 2 (IIA). ¿Qué afirmación sobre su radio atómico es correcta?',
      alternativas: ['Es menor que el del magnesio, que está arriba.', 'Es menor que el del bromo, de su mismo periodo.', 'Es igual al del magnesio: son del mismo grupo.',
        'Es mayor que el del magnesio y que el del bromo.', 'Es menor que el del potasio y que el del bromo.'],
      datos: [lugarTxt(12), lugarTxt(35), lugarTxt(19)],
      solucion: [
        { texto: 'X está debajo del magnesio, con un nivel más, y en el periodo 4 está a la izquierda del bromo, con menos protones.', ecuacion: [Rr('r'), ' (X) > ', Rr('r'), ' (Mg)', SEP, Rr('r'), ' (X) > ', Rr('r'), ' (Br)'] },
        { texto: ['La ', letra('A'), ' y la ', letra('C'), ' olvidan que X, debajo del magnesio, tiene un nivel más de electrones. La ', letra('B'), ' invierte el periodo: el bromo, a la derecha, tiene más protones y es menor.'] },
        { texto: ['La ', letra('E'), ' acierta con el potasio, que está a la izquierda de X y es mayor, pero falla con el bromo, que es menor que X.'] },
      ],
      respuesta: [letra('D'), ', mayor que el ', Rr('Mg'), ' y que el ', Rr('Br')] },
    { nivel: 3, titulo: 'El periodo 4, entero',
      enunciado: 'En el periodo 4, del potasio (Z = 19) al bromo (Z = 35), ¿qué afirmación sobre el radio atómico es correcta?',
      alternativas: ['El bromo es el mayor, porque tiene más electrones.', 'El calcio es mayor que el potasio.', 'Todos miden lo mismo: tienen 4 niveles.',
        'El potasio es menor que el sodio, que está arriba.', 'El potasio es el mayor, y el radio baja hacia el bromo.'],
      datos: ['K: grupo 1; Ca: grupo 2; Br: grupo 17 (los tres, del periodo 4)', lugarTxt(11)],
      solucion: [
        { texto: 'En el periodo 4, de izquierda a derecha la carga nuclear crece y el nivel es el mismo: el radio baja.', ecuacion: ['K ', Rr('243'), ' > Ca ', Rr('194'), ' > Br ', Rr('94 pm')] },
        { texto: ['La ', letra('A'), ' cree que más electrones agrandan el átomo, pero todos van al mismo nivel 4. La ', letra('B'), ' invierte el periodo: el calcio tiene un protón más que el potasio y es menor.'] },
        { texto: ['La ', letra('C'), ' olvida que la carga nuclear crece a lo largo del periodo. La ', letra('D'), ' invierte el grupo: el K, debajo del Na, tiene un nivel más y es mayor.'] },
      ],
      respuesta: [letra('E'), ', el ', Rr('potasio'), ' es el mayor'] },
  ];

  // «En el mundo» de la idea 1 (28 nov; docs/teoria.md, 4k): los alcalinos y el agua, el caso de Gerson. Un nivel más
  // por fila agranda el átomo, el electrón de afuera queda más lejos y se suelta antes: la reacción es más rápida.
  // Fuentes: RSC (lección «How do alkali metals react with water?») y LibreTexts («Reactions of Group 1 Elements with
  // Water»): el litio flota y burbujea, el sodio se funde en una bolita que corre, el potasio enciende el hidrógeno con
  // llama lila y el rubidio reacciona de inmediato y con violencia. No usa números del juego ni de Predice.
  const MUNDO_RADIO = {
    hecho: 'El litio burbujea en el agua; el potasio arde',
    parrafos: [
      'Cuando se echa un trocito de litio al agua, el metal flota y suelta burbujas de hidrógeno sin apuro. El sodio, una fila más abajo en el grupo 1, se derrite en una bolita que corre sobre el agua. El potasio, una fila más abajo todavía, reacciona tan rápido que el hidrógeno se enciende con una llama lila.',
      ['Los tres reaccionan de la misma forma: cada átomo le entrega al agua el único electrón de su último nivel. Cada fila hacia abajo suma un nivel, así que el átomo crece:',
        { linea: [Rr('r'), ' (Li) < ', Rr('r'), ' (Na) < ', Rr('r'), ' (K)'] },
        'En el potasio, ese electrón queda más lejos del núcleo que en el litio y está menos sujeto: se suelta antes y el calor sale de golpe.'],
    ],
    figura: ESF([3, 11, 19].map(z => atomoE(z)), { rotulo: 'Li, Na y K: cada fila, un nivel más' }),
    pregunta: {
      texto: '¿Qué esperas del rubidio, que está justo debajo del potasio en el grupo 1?',
      opciones: [
        { id: 'c', texto: 'Reacciona con el agua todavía más rápido que el potasio', correcta: true },
        { id: 'igual', texto: 'Igual que el potasio: los dos tienen un solo electrón afuera', error: 'QM-MISMO-GRUPO',
          siFuera: 'Es cierto que los dos tienen un solo electrón en su último nivel, y por eso reaccionan de la misma forma. Pero el rubidio tiene un nivel más, así que ese electrón queda más lejos y se suelta antes.' },
        { id: 'protones', texto: 'Más lento: sus 37 protones retienen mejor el electrón', error: 'QM-EI-PROTONES',
          siFuera: 'Es cierto que el rubidio tiene más protones que el potasio. Pero su electrón de afuera está un nivel más lejos, y los niveles de adentro tapan buena parte de esa carga: el núcleo lo sujeta con menos fuerza.' },
      ],
      porque: 'El rubidio tiene un nivel más que el potasio, así que es más grande y su electrón de afuera queda más lejos del núcleo: se suelta antes y la reacción es más violenta.',
    },
    fuente: 'Alcalinos en agua: Royal Society of Chemistry y LibreTexts; radios calculados de Clementi, Raimondi y Reinhardt (1967).',
  };
  const radio = {
    id: 'radio-atomico-ionico',
    titulo: 'Radio atómico',
    pregunta: '¿De qué depende el tamaño de un átomo?',
    temas: ['Radio atómico e iónico'],
    pieza: 'quim-tira',
    aprendizaje: 'El radio crece al bajar por un grupo (un nivel más) y baja hacia la derecha en un periodo (más protones, mismo nivel).',
    actividad: 'Recorrer las columnas de la tabla y comparar el tamaño de sus átomos.',
    lee: {
      tarjetas: [
        { titulo: 'Sal de Maras bajo la lupa', texto: 'Un grano de sal de Maras parece liso, pero es un cristal: sus partículas están en filas, con los núcleos vecinos a una distancia fija. Esa distancia fija sirve para medir el tamaño de los átomos.',
          pieza: 'quim-tira', dibujo: OBJ([{ que: 'cristal', nombre: 'sal de Maras' }]) },
        { titulo: 'Un borde que no existe', texto: 'La nube de electrones no tiene un borde nítido: se va haciendo tenue, como la neblina. Por eso el radio atómico, r, se define con dos átomos iguales unidos: es la mitad de la distancia entre sus núcleos, porque entre ellos caben dos radios. También se puede calcular desde la nube.',
          ecuacion: [Rr('r'), ' = distancia entre núcleos ÷ 2'] },
        { titulo: 'Muy, muy pequeño', texto: 'Los radios se miden en picómetros (pm), la billonésima parte de un metro. Los de esta unidad se calcularon desde la nube del átomo aislado. Otros libros usan radios medidos en enlaces, algo mayores (el flúor, unos 64 pm): las tendencias son las mismas, pero los números no, así que no mezcles valores de dos tablas.' },
        { titulo: 'Qué mirar', texto: 'En el juego eliges una columna de la tabla y ves sus átomos a escala, en fila: de izquierda a derecha, del de arriba de la columna al de abajo. Compara cada círculo con el de su izquierda, que en la tabla está una fila más arriba.' },
      ],
    },
    ejemplos: EJEMPLOS_RADIO,
    juega: {
      pieza: 'quim-tira',
      consigna: 'Elige un grupo: cada círculo es un átomo de esa columna, dibujado a escala con su radio r.',
      mision: {
        texto: 'Busca la columna donde está el átomo más grande de toda la tabla.',
        logrado: v => v.g === '1',
        bien: 'Es el potasio, de 243 pm: tiene cuatro niveles de electrones.',
      },
      voz: 'Compara cada círculo con el de su izquierda: está una fila más abajo.',
      leyenda: [
        { s: Rr('r'), t: 'radio del átomo, calculado desde su nube' },
        { s: 'pm', t: 'picómetro: billonésima parte del metro' },
        { s: Pz('p⁺'), t: 'protones del núcleo' },
      ],
      controles: [{ id: 'g', etiqueta: 'Grupo', opciones: Object.keys(COL).map(g => ({ valor: g, texto: `Grupo ${g}` })), inicio: '17' }],
      dibujo: v => ESF(COL[v.g].map(z => atomoE(z)), { rotulo: `Grupo ${grupoAB(+v.g)}` }),
      lectura: v => { const c = COL[v.g], a = c[0], b = c[c.length - 1]; return [`${SIMB[a]} `, Rr(`${RADIO[a]} pm`), ` → ${SIMB[b]} `, Rr(`${RADIO[b]} pm`), ': cada fila suma un nivel.']; },
      minimo: 4,
    },
    predice: {
      pieza: 'quim-tira',
      pregunta: 'Del sodio al cloro, en el periodo 3, cada átomo tiene un protón y un electrón más que el anterior. ¿Qué pasa con el radio?',
      datos: ['Sodio: Z = 11; cloro: Z = 17', 'Del sodio al cloro, los electrones ocupan los niveles 1, 2 y 3'],
      voz: 'Piensa en el núcleo y en el nivel que se llena.',
      opciones: [
        { id: 'c', texto: 'Baja: el núcleo, con más protones, jala más fuerte el mismo nivel', correcta: true },
        { id: 'sube', texto: 'Sube: cada uno tiene un electrón más que ocupa lugar', error: 'TP4', siFuera: 'Sería así si cada electrón nuevo abriera un nivel más afuera. Del sodio al cloro todos van al nivel 3, y los protones que se suman al núcleo jalan ese nivel más fuerte: el átomo se achica.' },
        { id: 'igual', texto: 'No cambia: todos tienen tres niveles', error: 'QM-RADIO-NIVEL', siFuera: 'Sería así si el tamaño dependiera solo de cuántos niveles hay. Los tres niveles se repiten, pero cada núcleo tiene un protón más que el anterior y jala con más fuerza, así que el radio no queda igual: baja.' },
        { id: 'mitad', texto: 'Sube hasta la mitad del periodo y después baja', error: 'QM-RADIO-MITAD', siFuera: 'Sería así si a mitad del periodo empezara un nivel nuevo, más lejos del núcleo. Del Na al Cl todos llenan el nivel 3, y como ningún nivel nuevo agranda el átomo, el radio baja en cada paso.' },
      ],
      dibujo: ESF([atomoE(11, { oculto: true }), atomoE(17, { oculto: true })], { rotulo: 'Periodo 3' }),
      revelar: ESF([11, 13, 15, 17].map(z => atomoE(z)), { rotulo: 'Na 190 pm → Cl 79 pm' }),
      coincide: 'Coincide: el radio baja de 190 pm (Na) a 79 pm (Cl), porque más protones jalan el mismo nivel.',
      noCoincide: 'El radio baja de 190 pm (Na) a 79 pm (Cl): más protones jalan el mismo nivel.',
    },
    mira: {
      pieza: 'quim-tabla',
      datos: tabla({ propiedad: { valores: valores(RADIO, TODOS), max: 245, forma: 'circulo', color: 'i', nombre: 'radio (pm)' }, marcadas: [{ Z: 19, color: 'i', desde: 2 }, { Z: 9, color: 'i', desde: 3 }], rotulo: 'r: radio calculado (pm)' }).datos,
      voz: 'Miremos toda la tabla: dos tendencias a la vez.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Hacia abajo en un grupo, el radio crece: cada fila suma un nivel de electrones, y ese nivel nuevo queda más lejos del núcleo que los de adentro.', ecuacion: ['Li ', Rr('167'), ' → Na ', Rr('190'), ' → K ', Rr('243 pm')] },
        { estado: { corte: 1 }, texto: 'Hacia la derecha en un periodo, el radio baja, aunque cada átomo tenga un electrón más que el anterior.', ecuacion: ['Na ', Rr('190 pm'), ' → Cl ', Rr('79 pm')] },
        { estado: { corte: 1 }, texto: 'La razón es que los electrones nuevos entran al mismo nivel, mientras la carga nuclear, que es el número de protones, crece y jala a todos con más fuerza.', ecuacion: [Pz('11 p⁺'), ' → ', Pz('17 p⁺'), ': más carga nuclear'] },
        { estado: { corte: 2 }, texto: 'Por eso el átomo más grande de esta tabla es el potasio: está abajo, con cuatro niveles, y es el primero de su fila, el de menos protones.', ecuacion: ['K: ', Rr('243 pm')] },
        { estado: { corte: 3 }, texto: 'Arriba a la derecha están los más pequeños: el flúor mide 42 pm, y el helio y el neón, todavía menos.', ecuacion: ['F: ', Rr('42 pm')] },
      ],
    },
    regla: {
      texto: 'El radio atómico crece hacia abajo en un grupo, porque cada fila suma un nivel más lejos del núcleo. Baja hacia la derecha en un periodo, porque los electrones nuevos van al mismo nivel y los protones nuevos los jalan con más fuerza. El sodio es mayor que el litio, de arriba, y que el cloro, de su derecha.',
      ecuacion: [Rr('r'), ' crece hacia abajo (↓) en un grupo', SEP, Rr('r'), ' baja hacia la derecha (→) en un periodo'],
      condicion: 'los radios salen de una misma tabla y los átomos están en los grupos A (columnas 1, 2 y 13 a 18); si mezclas tablas o miras metales de transición, el orden puede no cumplirse.',
      voz: 'Niveles hacia abajo, protones hacia la derecha.',
      dibujo: tabla({ propiedad: { valores: valores(RADIO, TODOS), max: 245, forma: 'circulo', color: 'i', nombre: 'radio (pm)' }, rotulo: 'r: radio calculado (pm)' }),
    },
    mundo: MUNDO_RADIO,
    resuelve: {
      pieza: 'quim-tabla',
      generar(s) {
        const r = azar(s + 900), trio = TRIOS_R[s % TRIOS_R.length], [p, gr, ch] = trio, lista = r.baraja(trio);
        const abajo = lugar(gr).grupo === lugar(p).grupo;
        return {
          enunciado: `Ordena de mayor a menor radio atómico: ${lista.map(z => NOMBRE[z]).join(', ')}.`,
          datos: lista.map(lugarTxt),
          dibujo: tabla({ marcadas: trio.map(Z => ({ Z, color: 'i' })) }),
          pasos: [
            { tipo: 'pide', texto: ['Piden ordenar tres átomos por su radio ', Rr('r'), ', del mayor al menor.'] },
            { tipo: 'datos', texto: abajo ? `El ${NOMBRE[gr]} está debajo del ${NOMBRE[p]}, en su columna; el ${NOMBRE[ch]}, a la derecha del ${NOMBRE[p]}, en su fila.`
              : `El ${NOMBRE[gr]} está a la izquierda del ${NOMBRE[p]}, en su fila; el ${NOMBRE[ch]}, encima del ${NOMBRE[p]}, en su columna.` },
            { tipo: 'regla', texto: 'Uso las dos tendencias del radio. En un grupo, el de abajo tiene un nivel más de electrones, más lejos del núcleo, así que es mayor. En un periodo, el de la derecha tiene más protones jalando el mismo nivel, así que es menor.' },
            { tipo: 'cuentas', texto: `Comparo los otros dos con el ${NOMBRE[p]}, que comparte columna con uno y fila con el otro: el ${NOMBRE[gr]} es mayor que él y el ${NOMBRE[ch]} es menor, así que el ${NOMBRE[p]} queda en el medio.`,
              ecuacion: [`${SIMB[gr]} `, Rr(`${RADIO[gr]}`), ` > ${SIMB[p]} `, Rr(`${RADIO[p]}`), ` > ${SIMB[ch]} `, Rr(`${RADIO[ch]} pm`)],
              dibujo: tabla({ propiedad: { valores: valores(RADIO, trio), max: 245, forma: 'circulo', color: 'i' }, marcadas: trio.map(Z => ({ Z, color: 'i' })) }) },
            { tipo: 'sentido', texto: 'Los valores de la tabla confirman el orden. La regla bastó porque cada átomo se comparó con otro de su misma fila o de su misma columna; con dos átomos en diagonal, uno arriba a la izquierda y otro abajo a la derecha, habría que mirar los datos.' },
          ],
          respuesta: [Rr(`${SIMB[gr]} > ${SIMB[p]} > ${SIMB[ch]}`)],
        };
      },
    },
    ahoraTu: {
      pieza: 'quim-tabla',
      voz: 'Ubica cada átomo: ¿más abajo o más a la derecha?',
      generar(sem) {
        const r = azar(sem * 97 + 11), tipo = sem % 5;
        if (tipo === 0) return casoParRadio(r, true);
        if (tipo === 1) return casoParRadio(r, false);
        if (tipo === 2) return casoTrioRadio(r, false);
        if (tipo === 3) return casoDistancia(r);
        return casoTrioRadio(r, true);
      },
    },
  };

  // ---------- Idea 2 (nueva, 19 nov): radio de iones e isoelectrónicos ----------
  // Propuesta B2 (aquí llega la comparación de radios de los isoelectrónicos que salió de Estructura atómica). Objeto de
  // la primera pantalla: el salero (quim-tira, de prueba). Cambia: el elemento · Permanece: su átomo y su ion lado a lado,
  // con protones y electrones · Progresa: del catión que se achica al anión que crece · Se reserva: la serie de 10
  // electrones (O²⁻, F⁻, Na⁺, Mg²⁺), que no sale entera en el juego · Debe verse: que el núcleo no cambia y los electrones sí.
  // Errores: QM-ION-RADIO (el catión es mayor o el anión menor; San Marcos 2026-II), QM-ISO-ORDEN (más protones, mayor),
  // QM-ISO-RADIO (mismos electrones, mismo tamaño), QM-ION-IGUAL, QM-ION-SIGNO (suma la carga al revés), QM-ION-PROTONES
  // (cuenta los protones), QM-ION-CARGA (decide la carga), QM-ISO-ATOMO.
  const JUEGO_IONES = [['Li', 3, 1], ['Na', 11, 1], ['Mg', 12, 2], ['K', 19, 1], ['Ca', 20, 2], ['S', 16, -2], ['Cl', 17, -1], ['Br', 35, -1]];
  const cargaTxt = q => `${Math.abs(q) === 1 ? '' : sup(Math.abs(q))}${q > 0 ? '⁺' : '⁻'}`;
  const ionDe = (x, q) => `${x}${cargaTxt(q)}`;
  const esfIon = (k, o) => { const [z, q, r] = ION[k]; return Object.assign({ s: k, r, p: z, e: z - q }, o); };
  const SERIES = { 10: ['O²⁻', 'F⁻', 'Na⁺', 'Mg²⁺', 'Al³⁺'], 18: ['S²⁻', 'Cl⁻', 'K⁺', 'Ca²⁺'], 36: ['Se²⁻', 'Br⁻', 'Rb⁺', 'Sr²⁺'] };
  const elec = k => ION[k][0] - ION[k][1];
  const protTxt = ks => `Protones: ${ks.map(k => `${NOMBRE[ION[k][0]]} ${ION[k][0]}`).join(', ')}`;
  const porRadio = ks => ks.slice().sort((a, b) => ION[b][2] - ION[a][2]);
  const pmI = x => `${f(x, 1).replace(/,0$/, '')}`;
  function casoAtomoIon(r) {
    const k = r.de(['Li⁺', 'Na⁺', 'K⁺', 'Mg²⁺', 'Ca²⁺', 'Al³⁺', 'F⁻', 'Cl⁻', 'Br⁻', 'O²⁻', 'S²⁻']), [z, q] = ION[k], an = q < 0, at = `el átomo de ${NOMBRE[z]}`;
    return {
      pregunta: `¿Qué es más grande: ${at} o el ion ${k}?`,
      datos: [`${Nom(z)}: ${z} protones`, `El ion ${k} tiene ${z - q} electrones`],
      opciones: ops(an ? `El ion ${k}` : `El átomo de ${NOMBRE[z]}`,
        [an ? `El átomo de ${NOMBRE[z]}` : `El ion ${k}`, 'QM-ION-RADIO', an ? 'Sería así si el anión hubiera perdido electrones. Los ganó, así que sus electrones se repelen más y la nube crece.' : 'Sería así si el catión hubiera ganado electrones. Los perdió, y el mismo núcleo jala más fuerte a los que quedan.'],
        ['Miden lo mismo: tienen el mismo núcleo', 'QM-ION-IGUAL', 'Serían iguales si también tuvieran los mismos electrones. El núcleo es el mismo, pero el ion tiene otro número de electrones.'],
        ['No se puede saber sin la tabla de radios', 'QM-SIN-LEY', 'No hace falta la tabla: el núcleo es el mismo, así que basta ver si el ion ganó o perdió electrones.']),
      solucion: { texto: an ? `Ganó ${-q === 1 ? 'un electrón' : `${-q} electrones`}: con los mismos ${z} protones, sus electrones se repelen más y la nube crece.` : `Perdió ${q === 1 ? 'un electrón' : `${q} electrones`}: los mismos ${z} protones jalan a menos electrones, así que el ion es menor.`,
        ecuacion: an ? [Rr(`r (${k})`), ' > ', Rr(`r (${SIMB[z]})`)] : [Rr(`r (${k})`), ' < ', Rr(`r (${SIMB[z]})`)] },
    };
  }
  function casoParIso(r) {
    const n = r.de(['18', '36', '10']), [a, b] = r.baraja(SERIES[n].slice(0, 4)).slice(0, 2), [m, o] = porRadio([a, b]);
    return {
      pregunta: `El ${a} y el ${b} tienen ${n} electrones cada uno. ¿Cuál es más grande?`,
      datos: [protTxt([a, b])],
      opciones: ops(`El ${m}`, [`El ${o}`, 'QM-ISO-ORDEN', `Sería así si más protones agrandaran la nube. Con los mismos ${n} electrones, más protones jalan más fuerte y achican la especie.`],
        ['Miden lo mismo: tienen los mismos electrones', 'QM-ISO-RADIO', 'Serían iguales si también tuvieran los mismos protones. Tienen los mismos electrones, pero sus núcleos no los jalan igual.'],
        ['No se puede saber sin la tabla de radios', 'QM-SIN-LEY', 'No hace falta la tabla: como los electrones son los mismos, basta comparar sus protones.']),
      solucion: { texto: `Los dos tienen ${n} electrones, pero el ${m} tiene menos protones (${ION[m][0]} contra ${ION[o][0]}): los jala menos y es más grande.`,
        ecuacion: [`${m} `, Rr(`${pmI(ION[m][2])} pm`), ' > ', `${o} `, Rr(`${pmI(ION[o][2])} pm`)] },
    };
  }
  function casoElectrones(r) {
    const k = r.de(Object.keys(ION)), [z, q] = ION[k], e = z - q;
    return {
      pregunta: `¿Cuántos electrones tiene el ion ${k}?`,
      datos: [`${Nom(z)}: Z = ${z}`, D.carga],
      opciones: ops(`${e}`, [`${z + q}`, 'QM-ION-SIGNO', q > 0 ? 'Se suma solo en un anión, que ganó electrones. Este es un catión: perdió electrones, así que la carga se resta de los protones.' : 'Se resta solo en un catión, que perdió electrones. Este es un anión: ganó electrones, así que la carga se suma a los protones.'],
        [`${z}`, 'QM-ION-PROTONES', 'Ese es el número de protones, que no cambia al formarse el ion. Los electrones sí cambian: tantos como dice la carga.'],
        Math.abs(q) === 1 ? [`${z - 2 * q}`, 'QM-ION-DOBLE', 'Sería así si la carga fuera 2. Sumar o restar va bien, pero la carga 1 dice que cambió un solo electrón, así que se cambia uno y no dos.']
          : [`${z - Math.sign(q)}`, 'QM-ION-UNO', 'Sería así si la carga fuera 1. Sumar o restar va bien, pero el número de la carga dice cuántos electrones cambiaron, y aquí son más de uno.']),
      solucion: { texto: q > 0 ? `Perdió ${q} ${q === 1 ? 'electrón, que se resta' : 'electrones, que se restan'} de los ${z} que tenía el átomo.` : `Ganó ${-q} ${q === -1 ? 'electrón, que se suma' : 'electrones, que se suman'} a los ${z} que tenía el átomo.`, ecuacion: [`${z} ${q > 0 ? '−' : '+'} ${Math.abs(q)} = ${e} e⁻`] },
    };
  }
  function casoTrioIso(r) {
    const n = r.de(['18', '36', '10']), tres = r.baraja(SERIES[n].slice(0, 4)).slice(0, 3), orden = porRadio(tres), menor = orden[2];
    return {
      pregunta: `El ${tres[0]}, el ${tres[1]} y el ${tres[2]} tienen ${n} electrones cada uno. ¿Cuál es el más pequeño?`,
      datos: [protTxt(tres)],
      opciones: ops(`El ${menor}`, [`El ${orden[0]}`, 'QM-ISO-ORDEN', 'Sería así si menos protones achicaran la especie. Ese tiene menos protones que los otros dos para los mismos electrones, así que los jala menos y es el mayor.'],
        [`El ${orden[1]}`, 'QM-ISO-MEDIO', 'Sería así si fuera el de más protones. Queda en el medio: otra especie tiene más protones todavía, jala más fuerte los mismos electrones y es la más pequeña.'],
        ['Los tres miden igual', 'QM-ISO-RADIO', 'Serían iguales si también tuvieran los mismos protones. Tienen los mismos electrones, pero sus núcleos no los jalan igual.']),
      solucion: { texto: `Los tres tienen ${n} electrones, así que decide el núcleo: el de más protones los jala más fuerte y es el menor.`, ecuacion: [Rr(orden.join(' > '))] },
    };
  }
  const AFIRMA_I = [
    ['El Na⁺ es menor que el átomo de Na.', true, 'perdió su único electrón del nivel 3 y le quedan dos niveles'],
    ['El Cl⁻ es menor que el átomo de Cl.', false, 'ganó un electrón, así que es mayor'],
    ['El K⁺ es mayor que el Cl⁻.', false, 'tienen 18 electrones y el K⁺ tiene más protones, así que es menor'],
    ['El S²⁻ es mayor que el Cl⁻.', true, 'tienen 18 electrones y el S²⁻ tiene menos protones, así que es mayor'],
    ['El Ca²⁺ y el Ar tienen el mismo número de electrones.', true, 'el Ca²⁺ tiene 20 − 2 = 18, como el argón'],
    ['El Br⁻ es menor que el Cl⁻.', false, 'el Br⁻ tiene un nivel más, así que es mayor'],
    ['Un catión tiene más protones que electrones.', true, 'perdió electrones, y sus protones no cambian al formarse el ion'],
  ];

  // Ejemplos de la idea 2. Radios iónicos de Shannon (NC 6). Cuentas rehechas aparte (cuentas-b.py): Na⁺ 11 − 1 = 10 ·
  // F⁻ 9 + 1 = 10 y Na⁺ 10 · 196 − 181 = 15 · S²⁻, K⁺, Ca²⁺ (16, 19, 20): Ca²⁺ 100 el menor · O²⁻ 10: Mg²⁺ 10, S²⁻ 18, Cl⁻ 18
  // · Na⁺ 102 > Mg²⁺ 72 > Al³⁺ 53,5 · Na⁺ 10, Cl⁻ 18; 181 > 102 · Ca²⁺ 18 = Ar · S²⁻ > Cl⁻ > K⁺ > Ca²⁺ · Li⁺ 76 < Na⁺ 102 <
  // K⁺ 138 · X = 34, Q = 37, R = 38 · Br⁻ 36 e⁻ = Kr; 196 > 181 · Mg²⁺ 72 < Ca²⁺ 100 < K⁺ 138 < Cl⁻ 181 < S²⁻ 184.
  const EJEMPLOS_IONES = [
    { nivel: 1, titulo: 'Los electrones del Na⁺',
      enunciado: '¿Cuántos electrones tiene el ion Na⁺?',
      datos: ['Sodio: Z = 11', D.carga],
      solucion: [{ texto: 'Tiene 11 protones y carga 1+, así que perdió un electrón: se resta de los 11 que tenía el átomo.', ecuacion: ['11 − 1 = 10 e⁻'] }],
      respuesta: ['10 electrones'] },
    { nivel: 1, titulo: 'El átomo o su catión',
      enunciado: '¿Qué es más grande: el átomo de potasio o el ion K⁺?',
      datos: ['Potasio: 19 protones; el ion K⁺ tiene 18 electrones'],
      figura: ESF([atomoE(19, { oculto: true, e: 19 }), esfIon('K⁺', { oculto: true })]),
      solucion: [{ texto: 'El K⁺ perdió su electrón del nivel 4: los mismos 19 protones jalan 18 electrones en 3 niveles.', ecuacion: [Rr('r (K)'), ' > ', Rr('r (K⁺)')] }],
      respuesta: ['El ', Rr('átomo de potasio')] },
    { nivel: 1, titulo: 'El átomo o su anión',
      enunciado: '¿Qué es más grande: el átomo de azufre o el ion S²⁻?',
      datos: ['Azufre: 16 protones; el ion S²⁻ tiene 18 electrones'],
      solucion: [{ texto: 'Ganó dos electrones: con los mismos 16 protones, los 18 electrones se repelen más y la nube crece.', ecuacion: [Rr('r (S²⁻)'), ' > ', Rr('r (S)')] }],
      respuesta: ['El ', Rr('ion S²⁻')] },
    { nivel: 1, titulo: '¿Son isoelectrónicos?',
      enunciado: '¿Tienen el mismo número de electrones el ion F⁻ y el ion Na⁺?',
      datos: ['Flúor: Z = 9; sodio: Z = 11', D.carga],
      solucion: [{ texto: 'Cuento los electrones de cada uno: al anión se le suma su carga y al catión se le resta.', ecuacion: ['F⁻: 9 + 1 = 10', SEP, 'Na⁺: 11 − 1 = 10'] }],
      respuesta: ['Sí: 10 electrones cada uno'] },
    { nivel: 1, titulo: 'Leer la tabla de iones',
      enunciado: 'En la tabla de radios iónicos, el Cl⁻ mide 181 pm y el Br⁻, 196 pm. ¿Cuántos picómetros más mide el Br⁻?',
      datos: ['r (Cl⁻) = 181 pm; r (Br⁻) = 196 pm'],
      solucion: [{ texto: 'La diferencia entre los dos radios dice cuánto más mide el Br⁻.', ecuacion: [Rr('196 pm'), ' − ', Rr('181 pm'), ' = ', Rr('15 pm')] }],
      respuesta: [Rr('15 pm'), ' más'] },
    { nivel: 2, titulo: 'El más pequeño de tres',
      enunciado: 'El S²⁻, el K⁺ y el Ca²⁺ tienen 18 electrones cada uno. ¿Cuál es el más pequeño?',
      datos: [protTxt(['S²⁻', 'K⁺', 'Ca²⁺'])],
      figura: ESF(['S²⁻', 'K⁺', 'Ca²⁺'].map(k => esfIon(k, { oculto: true }))),
      solucion: [
        { texto: 'Como los tres tienen los mismos electrones, el tamaño lo decide cuánto jala cada núcleo, es decir, cuántos protones tiene.', ecuacion: ['S²⁻: ', Pz('16 p⁺'), SEP, 'K⁺: ', Pz('19 p⁺'), SEP, 'Ca²⁺: ', Pz('20 p⁺')] },
        { texto: 'El Ca²⁺, con 20 protones, jala más fuerte a sus 18 electrones: es el más pequeño.', ecuacion: ['Ca²⁺ ', Rr('100'), ' < K⁺ ', Rr('138'), ' < S²⁻ ', Rr('184 pm')] },
      ],
      respuesta: ['El ', Rr('Ca²⁺')] },
    { nivel: 2, titulo: 'Busca al compañero',
      enunciado: '¿Cuál de estas especies tiene los mismos electrones que el O²⁻: Mg²⁺, S²⁻ o Cl⁻?',
      datos: ['Protones: oxígeno 8, magnesio 12, azufre 16, cloro 17', D.carga],
      solucion: [
        { texto: 'Cuento los electrones de cada una.', ecuacion: ['O²⁻: 8 + 2 = 10', SEP, 'Mg²⁺: 12 − 2 = 10', SEP, 'S²⁻: 18', SEP, 'Cl⁻: 18'] },
        { texto: 'Solo el Mg²⁺ tiene 10. El S²⁻ es de la familia del oxígeno, pero tiene 18 electrones, porque el azufre tiene un nivel más.' },
      ],
      respuesta: ['El Mg²⁺: 10 electrones'] },
    { nivel: 2, titulo: 'Tres cationes con 10 electrones',
      enunciado: 'El Na⁺, el Mg²⁺ y el Al³⁺ tienen 10 electrones cada uno. Ordénalos de mayor a menor radio.',
      datos: [protTxt(['Na⁺', 'Mg²⁺', 'Al³⁺'])],
      solucion: [
        { texto: 'Los tres tienen 10 electrones, así que el de más protones es el menor.', ecuacion: ['Na⁺ (', Pz('11'), ') > Mg²⁺ (', Pz('12'), ') > Al³⁺ (', Pz('13'), ')'] },
        { texto: 'La tabla de radios iónicos, en pm, lo confirma.', ecuacion: ['Na⁺ ', Rr('102'), ' > Mg²⁺ ', Rr('72'), ' > Al³⁺ ', Rr('53,5')] },
      ],
      respuesta: [Rr('Na⁺ > Mg²⁺ > Al³⁺')] },
    { nivel: 2, titulo: 'Los dos iones de la sal',
      enunciado: 'En la sal de mesa hay iones Na⁺ y Cl⁻. ¿Cuántos electrones tiene cada uno y cuál es más grande?',
      datos: ['Sodio: Z = 11; cloro: Z = 17', D.carga],
      figura: OBJ([{ que: 'salero', nombre: 'Na⁺ y Cl⁻' }]),
      solucion: [
        { texto: 'El Na⁺ perdió un electrón y el Cl⁻ ganó uno.', ecuacion: ['Na⁺: 10 e⁻, en 2 niveles', SEP, 'Cl⁻: 18 e⁻, en 3 niveles'] },
        { texto: 'El Cl⁻ tiene un nivel más lleno de electrones: es el mayor.', ecuacion: ['Cl⁻ ', Rr('181 pm'), ' > Na⁺ ', Rr('102 pm')] },
      ],
      respuesta: ['10 y 18; mayor, el ', Rr('Cl⁻')] },
    { nivel: 2, titulo: 'El ion del calcio',
      enunciado: 'El calcio forma el ion Ca²⁺. ¿Con qué gas noble es isoelectrónico y cuántos niveles con electrones le quedan?',
      datos: ['Calcio: Z = 20, configuración [Ar] 4s²', D.gases],
      solucion: [
        { texto: 'Pierde sus dos electrones 4s, los de más afuera, y le quedan 18, como al argón.', ecuacion: ['20 − 2 = 18 e⁻: [Ar]'] },
        { texto: 'Como el nivel 4 se vació, le quedan los niveles 1, 2 y 3, igual que al argón.' },
      ],
      respuesta: ['Con el argón; le quedan 3 niveles'] },
    { nivel: 3, titulo: 'La serie del argón',
      enunciado: '¿Cuál es el orden correcto de los radios del S²⁻, el Cl⁻, el K⁺ y el Ca²⁺, especies con 18 electrones, de mayor a menor?',
      alternativas: ['Ca²⁺ > K⁺ > Cl⁻ > S²⁻', 'S²⁻ > Cl⁻ > K⁺ > Ca²⁺', 'Todas miden igual', 'K⁺ > Ca²⁺ > S²⁻ > Cl⁻', 'Cl⁻ > S²⁻ > K⁺ > Ca²⁺'],
      datos: [protTxt(['S²⁻', 'Cl⁻', 'K⁺', 'Ca²⁺'])],
      solucion: [
        { texto: 'Con 18 electrones cada una, el radio baja cuando suben los protones.', ecuacion: [Pz('16'), ' < ', Pz('17'), ' < ', Pz('19'), ' < ', Pz('20'), ' → ', Rr('S²⁻ > Cl⁻ > K⁺ > Ca²⁺')] },
        { texto: ['La ', letra('A'), ' invierte la serie, como si más protones agrandaran la especie. La ', letra('C'), ' olvida que, con los mismos electrones, núcleos distintos los jalan distinto.'] },
        { texto: ['La ', letra('D'), ' cree que los cationes son mayores, pero tienen más protones para los mismos 18 electrones. La ', letra('E'), ' pone al S²⁻ detrás del Cl⁻, aunque tiene un protón menos y jala menos.'] },
      ],
      respuesta: [letra('B'), ', ', Rr('S²⁻ > Cl⁻ > K⁺ > Ca²⁺')] },
    { nivel: 3, titulo: 'Tres cationes del grupo 1',
      enunciado: 'El Li⁺, el Na⁺ y el K⁺ son iones de elementos del grupo 1. ¿Qué afirmación es correcta?',
      alternativas: ['Los tres tienen 10 electrones.', 'El Li⁺ es el mayor: tiene menos electrones.', 'El K⁺ es el mayor: tiene más niveles con electrones.', 'Miden igual: tienen la misma carga.', 'El Na⁺ es mayor que el átomo de Na.'],
      datos: ['Protones: litio 3, sodio 11, potasio 19', 'Cada ion tiene carga 1+'],
      solucion: [
        { texto: 'Cuento electrones y niveles de cada uno.', ecuacion: ['Li⁺: 2 e⁻ (1 nivel)', SEP, 'Na⁺: 10 (2)', SEP, 'K⁺: 18 (3)'] },
        { texto: 'Como en los átomos, cada fila suma un nivel: el K⁺ es el mayor.', ecuacion: ['Li⁺ ', Rr('76'), ' < Na⁺ ', Rr('102'), ' < K⁺ ', Rr('138 pm')] },
        { texto: ['La ', letra('A'), ' los toma por isoelectrónicos, pero tienen 2, 10 y 18 electrones. La ', letra('B'), ' invierte el orden. La ', letra('D'), ' mira solo la carga, que es igual, y olvida los niveles.'] },
        { texto: ['La ', letra('E'), ' olvida que un catión es menor que su átomo, porque perdió electrones y el mismo núcleo jala a los que quedan.'] },
      ],
      respuesta: [letra('C'), ', el ', Rr('K⁺'), ' es el mayor'] },
    { nivel: 3, titulo: 'Tres especies sin nombre',
      enunciado: 'Las especies X²⁻, Q⁺ y R²⁺ tienen 36 electrones cada una. ¿Cuál es el orden de sus radios, de mayor a menor?',
      alternativas: ['R²⁺ > Q⁺ > X²⁻', 'Q⁺ > X²⁻ > R²⁺', 'Las tres miden igual', 'X²⁻ > Q⁺ > R²⁺', 'X²⁻ > R²⁺ > Q⁺'],
      datos: [D.carga],
      solucion: [
        { texto: 'Saco los protones de cada una: los electrones más la carga.', ecuacion: ['X: 36 − 2 = ', Pz('34'), SEP, 'Q: 36 + 1 = ', Pz('37'), SEP, 'R: 36 + 2 = ', Pz('38')] },
        { texto: 'Con los mismos electrones, la de más protones tiene el menor radio.', ecuacion: [Rr('X²⁻ > Q⁺ > R²⁺')] },
        { texto: ['La ', letra('A'), ' invierte la serie. La ', letra('B'), ' pone al Q⁺ delante del X²⁻, aunque Q tiene más protones. La ', letra('C'), ' olvida que los tres núcleos son distintos.'] },
        { texto: ['La ', letra('E'), ' pone al R²⁺ delante del Q⁺, aunque el R tiene un protón más y jala más fuerte los mismos electrones.'] },
      ],
      respuesta: [letra('D'), ', ', Rr('X²⁻ > Q⁺ > R²⁺')] },
    { nivel: 3, titulo: 'El anión de un halógeno',
      enunciado: 'El bromo forma el ion Br⁻. ¿Qué afirmación es correcta?',
      alternativas: ['El Br⁻ es menor que el átomo de Br, porque tiene carga.', 'El Br⁻ tiene 34 electrones.', 'El Br⁻ y el Kr tienen distinto número de electrones.', 'El Br⁻ es menor que el Cl⁻, que está arriba.', 'El Br⁻ es mayor que el átomo de Br.'],
      datos: ['Bromo: Z = 35; cloro: Z = 17; kriptón: Z = 36', D.carga],
      solucion: [
        { texto: 'El bromo ganó un electrón y quedó con 36, como el kriptón. Los mismos 35 protones jalan un electrón más: la nube crece.', ecuacion: ['Br⁻: 35 + 1 = 36 e⁻'] },
        { texto: ['La ', letra('A'), ' cree que el anión se achica, pero ganó un electrón y la nube crece. La ', letra('B'), ' resta el electrón en vez de sumarlo.'] },
        { texto: ['La ', letra('C'), ' cuenta mal: los dos tienen 36. La ', letra('D'), ' invierte el grupo: el Br⁻, con un nivel más, mide 196 pm y el Cl⁻, 181.'] },
      ],
      respuesta: [letra('E'), ', el ', Rr('Br⁻'), ' es mayor que su átomo'] },
    { nivel: 3, titulo: 'El más pequeño de la lista',
      enunciado: '¿Cuál de estas especies es la más pequeña: Mg²⁺, Ca²⁺, S²⁻, K⁺ o Cl⁻?',
      alternativas: ['Mg²⁺', 'Ca²⁺', 'S²⁻', 'K⁺', 'Cl⁻'],
      datos: ['Protones: magnesio 12, azufre 16, cloro 17, potasio 19, calcio 20', D.carga],
      solucion: [
        { texto: 'Cuento electrones: el K⁺, el Ca²⁺, el Cl⁻ y el S²⁻ tienen 18, y el Mg²⁺, solo 10, así que tiene un nivel menos.', ecuacion: ['Mg²⁺ ', Rr('72 pm'), ' < Ca²⁺ ', Rr('100 pm')] },
        { texto: ['La ', letra('B'), ' es la menor de las que tienen 18 electrones, pero el Mg²⁺ tiene un nivel menos.'] },
        { texto: ['La ', letra('C'), ' y la ', letra('E'), ' son aniones, que tienen menos protones que electrones y son de los más grandes. El K⁺ de la ', letra('D'), ' tiene menos protones que el Ca²⁺, así que es mayor.'] },
      ],
      respuesta: [letra('A'), ', el ', Rr('Mg²⁺')] },
  ];

  // «En el mundo» de la idea 2 (28 nov; docs/teoria.md, 4k): el oxígeno es cerca del 47 % de la masa de la corteza y
  // más del 90 % de su volumen (Mason y Moore, Principles of Geochemistry, 4.ª ed., 1982: la corteza es «un empaque de
  // aniones de oxígeno» con los cationes en los huecos). Lo explica la regla: el silicio y el aluminio pierden electrones
  // y se achican; el oxígeno gana y crece. Si⁴⁺: Shannon (1976), NC 6, 40 pm. La pregunta va a otro ion (Al³⁺), que no
  // está en el juego; los números de Predice (la serie de 10 electrones) no se escriben.
  // Revisión del Escribidor Escribano (28 nov): «lugar» pasa a «espacio» (una sola palabra para el volumen). El tercer
  // párrafo abría con «Por eso», pero la regla solo da el sentido de cada cambio, no que la razón pase de 3: ahora
  // dice que las dos cosas juntas llevan a esa razón (Shannon: O²⁻ 140 pm, Si⁴⁺ 40 pm con NC 6).
  const SI4 = { s: 'Si⁴⁺', r: 40, p: 14, e: 10 };
  const MUNDO_IONES = {
    hecho: 'En una roca, casi todo el espacio es oxígeno',
    parrafos: [
      'Las piedras de un cerro y la arcilla de un adobe están hechas sobre todo de oxígeno y silicio, con algo de aluminio y de otros metales. El oxígeno aporta cerca del 47 % de la masa de la corteza terrestre, pero si se mide el espacio que ocupa cada elemento, llena más del 90 % de su volumen.',
      ['En las rocas, el silicio y el aluminio no están como átomos sino como cationes, y el oxígeno está como anión. Cada silicio perdió los cuatro electrones de su nivel 3, y cada oxígeno ganó dos que se repelen con los suyos:',
        { linea: [Rr('r'), ' (Si⁴⁺) < ', Rr('r'), ' (Si)', SEP, Rr('r'), ' (O²⁻) > ', Rr('r'), ' (O)'] }],
      [`Como uno se achica y el otro crece, el radio del ion de oxígeno llega a más de ${Math.floor(ION['O²⁻'][2] / SI4.r)} veces el del ion de silicio, y una roca es, por dentro, un apilado de oxígenos con los cationes metidos en los huecos.`],
    ],
    figura: ESF([atomoE(14, { e: 14 }), SI4, atomoE(8, { e: 8 }), esfIon('O²⁻')], { rotulo: 'Cada átomo junto a su ion' }),
    pregunta: {
      texto: 'La arcilla del adobe también tiene iones de aluminio, Al³⁺. ¿Cómo es el Al³⁺ comparado con el átomo de aluminio?',
      opciones: [
        { id: 'c', texto: 'Menor: perdió los tres electrones de su nivel 3', correcta: true },
        { id: 'carga', texto: 'Mayor: ahora tiene tres cargas positivas de más', error: 'QM-ION-RADIO',
          siFuera: 'Es cierto que el Al³⁺ tiene tres cargas positivas, porque perdió tres electrones. Pero esas cargas no ocupan lugar: con un nivel menos, sus 13 protones jalan más cerca a los 10 electrones que le quedan.' },
        { id: 'igual', texto: 'Igual: el núcleo del aluminio no cambió', error: 'QM-ION-IGUAL',
          siFuera: 'Es cierto que el núcleo sigue con sus 13 protones. Pero el tamaño lo dan los electrones, y el aluminio perdió los tres de su nivel 3: su nube termina en el nivel 2, más cerca del núcleo.' },
        { id: 'crece', texto: 'Mayor, como el oxígeno: los átomos crecen al volverse iones', error: 'QM-ION-CRECE',
          siFuera: 'Es cierto que el oxígeno crece al volverse ion, porque gana electrones. El aluminio, en cambio, los pierde, y un catión siempre es menor que su propio átomo.' },
      ],
      porque: 'El aluminio pierde sus tres electrones del nivel 3, así que el Al³⁺ se queda con dos niveles y sus 13 protones jalan más cerca a los 10 electrones que le quedan.',
    },
    fuente: 'Oxígeno en la corteza: Mason y Moore, Principles of Geochemistry (1982); radios iónicos de Shannon (1976).',
  };
  const radioIonico = {
    id: 'radio-ionico',
    titulo: 'Radio de iones e isoelectrónicos',
    pregunta: '¿Un ion es más grande o más pequeño que su átomo?',
    temas: ['Radio atómico e iónico'],
    pieza: 'quim-tira',
    aprendizaje: 'Un catión es menor que su átomo y un anión, mayor. Con los mismos electrones, es más pequeña la especie con más protones.',
    actividad: 'Poner cada átomo junto a su ion y contar sus protones y electrones.',
    lee: {
      tarjetas: [
        { titulo: 'El salero', texto: 'En la sal del salero no hay átomos de sodio ni de cloro: hay iones. Cada sodio perdió un electrón (Na⁺) y cada cloro ganó uno (Cl⁻). El núcleo de cada uno no cambió.',
          pieza: 'quim-tira', dibujo: OBJ([{ que: 'salero', nombre: 'Na⁺ y Cl⁻' }]) },
        { titulo: 'Dos tablas', texto: 'El radio iónico, el de un ion, se mide en cristales y viene de una tabla distinta a la de los radios atómicos. Como se midieron de maneras distintas, restar uno de otro no tendría sentido. Los números se comparan solo entre iones; de un átomo y su ion, solo se dice cuál es mayor.' },
        { titulo: 'Mismos electrones', texto: 'Como viste en Estructura atómica, dos especies son isoelectrónicas si tienen el mismo número de electrones: el Na⁺ y el neón tienen 10 cada uno, aunque el núcleo del Na⁺ tiene 11 protones y el del neón, 10.', ecuacion: ['Na⁺: 11 − 1 = 10 e⁻', SEP, 'Ne: 10 e⁻'] },
        { titulo: 'Qué mirar', texto: 'En el juego, cada elemento aparece junto a su ion. Cuenta los protones y los electrones de los dos, y mira cuál círculo es mayor.' },
      ],
    },
    ejemplos: EJEMPLOS_IONES,
    juega: {
      pieza: 'quim-tira',
      consigna: 'Elige un elemento: a la izquierda, su átomo; a la derecha, su ion. Mira qué cambia en los electrones y en el tamaño.',
      mision: {
        texto: 'Busca el ion más grande de la lista.',
        logrado: v => v.x === 'Br',
        bien: 'Es el Br⁻, de 196 pm: ganó un electrón y tiene cuatro niveles.',
      },
      voz: 'El núcleo no cambia: mira los electrones.',
      leyenda: [
        { s: Pz('p⁺'), t: 'protones: no cambian al formarse el ion' },
        { s: 'e⁻', t: 'electrones' },
        { s: Rr('pm'), t: 'radio, en picómetros' },
        { s: 'átomo e ion', t: 'dos tablas: compara solo cuál es mayor' },
      ],
      controles: [{ id: 'x', etiqueta: 'Elemento', opciones: JUEGO_IONES.map(([x]) => ({ valor: x, texto: x })), inicio: 'Na' }],
      dibujo: v => { const [x, z, q] = JUEGO_IONES.find(e => e[0] === v.x), k = ionDe(x, q); return ESF([atomoE(z, { e: z }), esfIon(k)], { rotulo: `Átomo de ${NOMBRE[z]} e ion ${k}` }); },
      lectura: v => {
        const [x, z, q] = JUEGO_IONES.find(e => e[0] === v.x), k = ionDe(x, q), n = Math.abs(q);
        return q > 0 ? [`${k}: perdió ${n} e⁻ y `, Pz(`${z} p⁺`), ` jalan ${z - q} e⁻: es menor.`] : [`${k}: ganó ${n} e⁻ y `, Pz(`${z} p⁺`), ` jalan ${z - q} e⁻: es mayor.`];
      },
      minimo: 4,
    },
    predice: {
      pieza: 'quim-tira',
      pregunta: 'El O²⁻, el F⁻, el Na⁺ y el Mg²⁺ tienen los mismos 10 electrones. ¿Cuál es el más grande?',
      datos: ['Protones: oxígeno 8, flúor 9, sodio 11, magnesio 12'],
      voz: 'Los electrones son los mismos: mira los núcleos.',
      opciones: [
        { id: 'c', texto: 'El O²⁻: tiene menos protones para los mismos electrones', correcta: true },
        { id: 'orden', texto: 'El Mg²⁺: tiene más protones', error: 'QM-ISO-ORDEN', siFuera: 'Sería así si los protones agrandaran la nube. Con los mismos 10 electrones, el núcleo del Mg²⁺ es el que más jala, así que es el más pequeño.' },
        { id: 'igual', texto: 'Los cuatro miden igual: tienen los mismos electrones', error: 'QM-ISO-RADIO', siFuera: 'Serían iguales si también tuvieran los mismos protones. Tienen 10 electrones cada uno, pero sus núcleos tienen de 8 a 12 protones y no los jalan igual.' },
        { id: 'cation', texto: 'El Na⁺: los cationes son más grandes que los aniones', error: 'QM-ION-RADIO', siFuera: 'Sería así si el signo de la carga decidiera el tamaño. Un catión es menor que su propio átomo, y aquí los cuatro tienen 10 electrones: decide cuántos protones los jalan, no el signo.' },
      ],
      dibujo: ESF(SERIES[10].slice(0, 4).map(k => esfIon(k, { oculto: true })), { rotulo: 'Los cuatro, con 10 electrones' }),
      revelar: ESF(SERIES[10].slice(0, 4).map(k => esfIon(k)), { rotulo: 'O²⁻ > F⁻ > Na⁺ > Mg²⁺' }),
      coincide: 'Coincide: con 8 protones, el O²⁻ es el que menos jala a sus 10 electrones.',
      noCoincide: 'El más grande es el O²⁻: 8 protones para 10 electrones. El Mg²⁺, con 12, es el menor.',
    },
    mira: {
      pieza: 'quim-tira',
      // Cada escena trae su vista: sin ella, quim-tira dibujaba la tira de tarjetas del He al Ca (auditoría, 19 nov).
      datos: { vista: 'esferas', simbolos: SIMBOLOS, marcas: {}, max: 250,
        escenas: [{ desde: 0, esferas: [atomoE(11, { e: 11 }), esfIon('Na⁺')] }, { desde: 2, esferas: [atomoE(17, { e: 17 }), esfIon('Cl⁻')] }, { desde: 3, esferas: SERIES[10].slice(0, 4).map(k => esfIon(k)) },
          { desde: 4, esferas: SERIES[18].map(k => esfIon(k)) }].map(e => Object.assign({ vista: 'esferas', max: 250 }, e)) },
      voz: 'Primero un catión, después un anión y al final las series.',
      pasos: [
        { estado: { corte: 0 }, texto: 'El Na⁺ perdió su único electrón del nivel 3, así que le quedan dos niveles y su nube termina más cerca del núcleo.', ecuacion: ['Na: ', Pz('11 p⁺'), ', 11 e⁻', SEP, 'Na⁺: ', Pz('11 p⁺'), ', 10 e⁻'] },
        { estado: { corte: 1 }, texto: 'Los mismos 11 protones jalan ahora 10 electrones: el catión es menor.', ecuacion: [Rr('r (Na⁺)'), ' < ', Rr('r (Na)')] },
        { estado: { corte: 2 }, texto: 'El Cl⁻ ganó un electrón: con los mismos 17 protones, sus electrones se repelen más y la nube crece.', ecuacion: [Rr('r (Cl⁻)'), ' > ', Rr('r (Cl)')] },
        { estado: { corte: 3 }, texto: 'Cuando hay los mismos 10 electrones, decide el núcleo: la especie con más protones es la más pequeña.', ecuacion: ['O²⁻ ', Rr('140'), ' > F⁻ ', Rr('133'), ' > Na⁺ ', Rr('102'), ' > Mg²⁺ ', Rr('72 pm')] },
        { estado: { corte: 4 }, texto: 'Pasa lo mismo con las especies de 18 electrones, que tienen tantos como el argón.', ecuacion: ['S²⁻ ', Rr('184'), ' > Cl⁻ ', Rr('181'), ' > K⁺ ', Rr('138'), ' > Ca²⁺ ', Rr('100 pm')] },
      ],
    },
    regla: {
      texto: 'Un catión es menor que su átomo: perdió electrones, y el mismo núcleo jala más cerca a los que quedan. Un anión es mayor que el suyo: ganó electrones, que se repelen y agrandan la nube. Con los mismos electrones, es más pequeña la especie con más protones, porque su núcleo los jala más.',
      ecuacion: [{ llave: [Rr('r'), ' (catión) < ', Rr('r'), ' (átomo) < ', Rr('r'), ' (anión)'], nota: 'de un mismo elemento' }, SEP, { llave: ['más ', Zf, ' → menor ', Rr('r')], nota: 'mismos electrones' }],
      condicion: 'los números se comparan solo entre iones, porque átomos e iones tienen tablas distintas, y la regla de los protones se usa con los mismos electrones: si no, decide primero cuántos niveles hay.',
      voz: 'Mismos electrones: decide el núcleo.',
      dibujo: ESF(SERIES[18].map(k => esfIon(k)), { rotulo: '18 electrones: más protones, menor' }),
    },
    mundo: MUNDO_IONES,
    resuelve: {
      pieza: 'quim-tira',
      generar(s) {
        const r = azar(s + 900), n = ['18', '36'][s % 2], serie = SERIES[n], lista = r.baraja(serie), orden = porRadio(serie).reverse();
        return {
          enunciado: `Ordena de menor a mayor radio: ${lista.join(', ')}.`,
          datos: [protTxt(lista), D.carga],
          dibujo: ESF(lista.map(k => esfIon(k, { oculto: true }))),
          pasos: [
            { tipo: 'pide', texto: ['Piden ordenar cuatro especies por su radio ', Rr('r'), ', de la menor a la mayor.'] },
            { tipo: 'datos', texto: 'Cuento los electrones de cada una: protones menos la carga.', ecuacion: [lista.map(k => `${k}: ${elec(k)}`).join(SEP)] },
            { tipo: 'regla', texto: `Las cuatro tienen ${n} electrones: son isoelectrónicas. Con los mismos electrones, la de más protones es la más pequeña, porque su núcleo los jala más fuerte.` },
            { tipo: 'cuentas', texto: 'Ordeno por protones, de más a menos: como más protones achican la especie, ese es el orden de menor a mayor radio.',
              ecuacion: [orden.map(k => `${k} (${ION[k][0]})`).join(' < ')], dibujo: ESF(orden.map(k => esfIon(k))) },
            { tipo: 'sentido', texto: 'Los cationes quedan primero porque tienen más protones que electrones; los aniones, al final, porque tienen menos. El orden cuadra con la tabla de radios iónicos.' },
          ],
          respuesta: [Rr(orden.join(' < '))],
        };
      },
    },
    ahoraTu: {
      pieza: 'quim-tira',
      voz: 'Cuenta protones y electrones de cada uno.',
      generar(sem) {
        const r = azar(sem * 89 + 7), tipo = sem % 5;
        if (tipo === 4) {
          // Los datos traen los protones de cada elemento que nombran las tres afirmaciones (antes faltaban el S, el Br y el Na).
          const v = vfDe(r, AFIRMA_I, []), P_ = { Na: 11, S: 16, Cl: 17, Ar: 18, K: 19, Ca: 20, Br: 35 }, nombra = new Set((JSON.stringify(v.pregunta).match(/\b(Na|S|Cl|Ar|K|Ca|Br)(?=[⁺⁻²\s.])/g) || []));
          v.datos = [`Protones: ${Object.keys(P_).filter(s => nombra.has(s)).map(s => `${NOMBRE[P_[s]]} ${P_[s]}`).join(', ')}`, D.carga];
          return v;
        }
        return [casoAtomoIon, casoParIso, casoElectrones, casoTrioIso][tipo](r);
      },
    },
  };

  // ---------- Idea 3 (rehecha, 19 nov): energía de ionización y afinidad electrónica ----------
  // Propuesta B3. Objeto de la primera pantalla: la romana del mercado (balanza de resorte; analogía con su límite en
  // «Lee»). Cambia: el elemento del periodo 2 · Permanece: las barras a la misma escala · Progresa: de la subida general a
  // sus dos bajadas · Se reserva: el par fósforo–azufre del periodo 3 (Predice; Tan y otros 2005, ítem 9, el único con dato)
  // · Debe verse: que la barra del B es más baja que la del Be y la del O, más baja que la del N.
  // Errores: QM-FLECHA (la flecha como ley; el error objetivo de la matriz), QM-EI-PROTONES (un solo factor, 10 % en el ítem
  // 9), TP7 (mismo periodo, igual), QM-EI-GRUPO, QM-EI-INVERSA, QM-SIN-LEY, QM-SALTO-*, QM-AE-*, QM-EI-AFINIDAD, QM-EI-GAS,
  // QM-EI-SEGUNDA. La razón de academia «el 3p semilleno es estable» (TP6) da el orden correcto: va en «Mira» sin castigarla.
  const P2 = [3, 4, 5, 6, 7, 8, 9, 10];
  const barrasEI = (zs, extra = {}) => tabla(Object.assign({ propiedad: { valores: valores(EI, zs), max: 2400, forma: 'barra', color: 'h', nombre: 'EI (kJ/mol)' }, rotulo: 'EI: energía de ionización (kJ/mol)' }, extra));
  // Barras grandes (quim-tira, vista barras), todas a la misma escala: la del juego, la de Predice y la de los ejemplos.
  const BARR = (zs, marca = [], o = {}) => ({ pieza: 'quim-tira', datos: Object.assign({ vista: 'barras', simbolos: SIMBOLOS, marcas: {}, color: 'h', max: 2200, nombre: 'la energía de ionización (kJ/mol)',
    barras: zs.map(z => ({ s: SIMB[z], v: EI[z], marca: marca.includes(z) })) }, o), estado: {} });
  const PARES_EI_GRUPO = [[3, 11], [11, 19], [9, 17], [17, 35], [4, 12], [12, 20], [8, 16], [7, 15]];
  const PARES_EI_PERIODO = [[11, 17], [3, 9], [6, 7], [14, 16], [6, 8], [13, 15], [19, 35], [11, 12]];
  const PARES_BAJADA = [[4, 5], [7, 8], [12, 13], [15, 16], [33, 34], [30, 31]];
  const SUC_RES = [11, 13, 20, 4, 5], SUC_AHORA = [3, 12, 14, 19, 6];
  const DI = { ei: 'EI: energía para quitarle un electrón a un átomo gaseoso', kj: 'kJ/mol: kilojulios por cada mol de átomos' };
  function casoParEI(r, clase) {
    const lista = clase === 'grupo' ? PARES_EI_GRUPO : clase === 'periodo' ? PARES_EI_PERIODO : PARES_BAJADA;
    const par = r.de(lista), [a, b] = r.baraja(par), m = EI[a] > EI[b] ? a : b, o = m === a ? b : a;
    const err = { grupo: ['QM-EI-GRUPO', 'Sería así si el de abajo retuviera mejor su electrón. Tiene un nivel más, así que su electrón de afuera está más lejos del núcleo y sale más fácil.'],
      periodo: ['QM-EI-INVERSA', 'Sería así si la EI bajara hacia la derecha. En un periodo, el de la derecha tiene más protones, que retienen su electrón con más fuerza.'],
      bajada: ['QM-FLECHA', 'Eso diría la tendencia, pero aquí se rompe: el de la derecha pierde su primer electrón p o uno apareado, y en los dos casos ese electrón sale más fácil.'] }[clase];
    const por = { grupo: `, que tiene su último electrón más cerca del núcleo`, periodo: `, que tiene más protones jalando el mismo nivel`,
      bajada: o === 5 || o === 13 || o === 31 ? `: el ${NOMBRE[o]} pierde su único electrón p, que está algo más lejos del núcleo` : `: en el ${NOMBRE[o]} sale un electrón apareado, que su pareja repele` }[clase];
    return {
      pregunta: `¿A cuál le cuesta más perder un electrón: al ${NOMBRE[a]} o al ${NOMBRE[b]}?`,
      datos: clase === 'bajada' ? [`${Nom(a)}: ${conf(a)}; ${NOMBRE[b]}: ${conf(b)}`, `Los dos, del periodo ${lugar(a).periodo}`] : [lugarTxt(a), lugarTxt(b)],
      dibujo: tabla({ marcadas: [{ Z: a, color: 'h' }, { Z: b, color: 'h' }] }),
      opciones: ops(`Al ${NOMBRE[m]}`, [`Al ${NOMBRE[o]}`, err[0], err[1]], ['A los dos por igual', 'TP7', 'Sería así si tuvieran el mismo núcleo y el mismo último electrón. Comparten fila o columna, pero su carga nuclear y su electrón de afuera son distintos.'],
        ['No se puede saber sin medirlo', 'QM-SIN-LEY', 'Sería así si no hubiera nada que comparar. Su lugar en la tabla y su configuración ya dicen cuál retiene más su electrón, y el dato lo confirma.']),
      solucion: { texto: `Le cuesta más al ${NOMBRE[m]}${por}.`, ecuacion: [`${SIMB[m]} `, Ei(`${EI[m]}`), ` > ${SIMB[o]} `, Ei(`${EI[o]} kJ/mol`)],
        dibujo: barrasEI([a, b], { marcadas: [{ Z: a, color: 'h' }, { Z: b, color: 'h' }], rotulo: `${SIMB[a]} ${EI[a]} · ${SIMB[b]} ${EI[b]} kJ/mol` }) },
    };
  }
  // Configuraciones cortas de los pares con bajada.
  const CONF = { 4: '1s² 2s²', 5: '1s² 2s² 2p¹', 7: '1s² 2s² 2p³', 8: '1s² 2s² 2p⁴', 12: '[Ne] 3s²', 13: '[Ne] 3s² 3p¹', 15: '[Ne] 3s² 3p³', 16: '[Ne] 3s² 3p⁴',
    30: '[Ar] 4s² 3d¹⁰', 31: '[Ar] 4s² 3d¹⁰ 4p¹', 33: '[Ar] 4s² 3d¹⁰ 4p³', 34: '[Ar] 4s² 3d¹⁰ 4p⁴' };
  const conf = z => CONF[z];
  // El grupo que dan las sucesivas: cuántos electrones salen antes del salto mayor (el mayor cociente).
  function grupoSucesivas(z) {
    const e = SUCESIVAS[z], c = e.slice(1).map((x, i) => x / e[i]), k = c.indexOf(Math.max(...c)) + 1;
    return { k, grupo: k <= 2 ? k : k + 10, cocientes: c };
  }
  const miles = x => (x >= 10000 ? `${String(x).slice(0, -3)} ${String(x).slice(-3)}` : `${x}`);
  const listaEI = z => SUCESIVAS[z].map(miles).join(', ');
  function casoSucesivas(r) {
    const z = r.de(SUC_AHORA), { k, grupo } = grupoSucesivas(z), g = n => (n <= 2 ? n : n + 10);
    return {
      pregunta: `Las energías de ionización sucesivas de un elemento X de los grupos A son, en kJ/mol: ${listaEI(z)}. ¿En qué grupo está X?`,
      datos: ['Cada EI sucesiva arranca un electrón más', D.grupos],
      opciones: ops(`Grupo ${grupoAB(grupo)}`, [`Grupo ${grupoAB(g(k + 1))}`, 'QM-SALTO-DESPUES', 'Sería así si el electrón del salto fuera de valencia. Ese electrón ya sale de un nivel de adentro, lleno y cerca del núcleo, por eso cuesta tanto, y no se cuenta.'],
        k > 1 ? [`Grupo ${grupoAB(g(k - 1))}`, 'QM-SALTO-ANTES', 'Sería así si el salto llegara una EI antes. Hay que contar todos los electrones que salen antes del salto, y el último de ellos también es de valencia.'] : ['', '', ''],
        [`Grupo ${grupoAB(g(SUCESIVAS[z].length) > 18 ? 18 : g(SUCESIVAS[z].length))}`, 'QM-SALTO-TOTAL', 'Ese número cuenta todos los datos de la lista. El grupo no sale de ahí, sino de cuántos electrones salen antes del salto.'],
        ['Grupo 18 (VIIIA)', 'QM-SALTO-NOBLE', 'Sería así si el primer electrón costara muchísimo. Un gas noble casi no suelta electrones, y aquí los primeros salen con poca energía.']),
      solucion: { texto: `El salto grande llega en la EI número ${k + 1}, porque ese electrón ya sale de un nivel de adentro, así que antes ${k === 1 ? 'sale 1 electrón: ese es el' : `salen ${k} electrones: esos son los`} de valencia.`,
        ecuacion: [`${miles(SUCESIVAS[z][k])} ÷ ${miles(SUCESIVAS[z][k - 1])} ≈ ${f(SUCESIVAS[z][k] / SUCESIVAS[z][k - 1], 1)}`, ' → ', Ei(`grupo ${grupoAB(grupo)}`)] },
    };
  }
  const PARES_AE = [[17, 11], [9, 3], [16, 11], [35, 19], [8, 3], [17, 9], [6, 3], [16, 15]];
  function casoAfinidad(r) {
    const [a, b] = r.baraja(r.de(PARES_AE)), m = AE[a] < AE[b] ? a : b, o = m === a ? b : a;
    return {
      pregunta: `¿Cuál libera más energía al ganar un electrón: un átomo de ${NOMBRE[a]} o uno de ${NOMBRE[b]}?`,
      datos: [`AE: ${NOMBRE[a]} ${AE[a]} kJ/mol; ${NOMBRE[b]} ${AE[b]} kJ/mol`.replace(/-/g, '−'), D.ae],
      opciones: ops(`El de ${NOMBRE[m]}`, [`El de ${NOMBRE[o]}`, 'QM-AE-ORDEN', 'Sería así si la AE más cercana a cero liberara más. El signo negativo solo dice que se libera energía; cuánto se libera lo dice el número sin el signo.'],
        ['Ninguno: ganar un electrón siempre cuesta energía', 'QM-AE-COSTO', 'Lo que siempre cuesta energía es perder un electrón. Aquí las dos AE son negativas, así que los dos átomos liberan energía al ganarlo.'],
        ['Los dos liberan lo mismo', 'QM-AE-IGUAL', 'Serían iguales si sus AE tuvieran el mismo valor. Los dos liberan energía, porque las dos AE son negativas, pero sus números son distintos.']),
      solucion: { texto: `Las dos AE son negativas, así que los dos liberan energía; libera más el ${NOMBRE[m]}, cuyo valor sin el signo es mayor.`, ecuacion: [`|${AE[m]}| > |${AE[o]}|`.replace(/-/g, '−')] },
    };
  }
  function casoEcuacionEI(r) {
    const x = SIMB[r.de([3, 11, 19, 12, 20, 13, 17, 9, 7, 16])];
    return {
      pregunta: `¿Qué ecuación representa la primera energía de ionización del ${NOMBRE[SIMB.indexOf(x)]}?`,
      datos: ['(g): en estado gaseoso; (s): sólido', DI.ei],
      opciones: ops(`${x}(g) → ${x}⁺(g) + e⁻`, [`${x}(g) + e⁻ → ${x}⁻(g)`, 'QM-EI-AFINIDAD', 'Esa ecuación es la de la afinidad electrónica, en la que el átomo gana un electrón. En la ionización, el átomo lo pierde.'],
        [`${x}(s) → ${x}⁺(s) + e⁻`, 'QM-EI-GAS', 'Quitar el electrón está bien, pero la EI se mide con el átomo aislado, en estado gaseoso, y no en el sólido.'],
        [`${x}⁺(g) → ${x}²⁺(g) + e⁻`, 'QM-EI-SEGUNDA', 'Esa es la segunda EI, porque parte de un ion que ya perdió un electrón. La primera parte del átomo neutro.']),
      solucion: { texto: 'En la primera EI, el átomo neutro y gaseoso pierde un electrón y queda como catión.', ecuacion: [`${x}(g) + `, EIf, ` → ${x}⁺(g) + e⁻`] },
    };
  }

  // Ejemplos de la idea 3. Cuentas rehechas aparte (cuentas-b.py): Li 520 > K 419 · Cl 1251 > Na 496 · AE Cl −349 · 2081 −
  // 520 = 1561 · Be 900 > B 801 · Mg 738 > Na 496 > K 419 · 4562 ÷ 496 ≈ 9,2 y 6910 ÷ 4562 ≈ 1,5 · Au 890 > Fe 762 · Li 520,
  // el menor del periodo 2 · N 1402 > O 1314 · Si: 1577 ÷ 787 ≈ 2,0; 3232 ÷ 1577 ≈ 2,0; 4356 ÷ 3232 ≈ 1,3; 16 091 ÷ 4356 ≈
  // 3,7 → 4, grupo 14 · AE Cl −349, F −328, Na −53 · periodo 3: bajadas Mg → Al y P → S · Z 12 (periodo 3) y 20 (periodo 4),
  // grupo 2, 738 > 590.
  const EJEMPLOS_EI = [
    { nivel: 1, titulo: 'Lo que pide el sodio',
      enunciado: 'Arrancarle el electrón de afuera a un átomo de sodio gaseoso cuesta 496 kJ/mol. ¿Cómo se escribe ese proceso?',
      datos: ['(g): en estado gaseoso', 'e⁻: un electrón'],
      solucion: [{ texto: 'El átomo gaseoso pierde un electrón y queda como catión.', ecuacion: ['Na(g) + ', Ei('496 kJ/mol'), ' → Na⁺(g) + e⁻'] }],
      respuesta: ['Na(g) → Na⁺(g) + e⁻'] },
    { nivel: 1, titulo: 'Arriba o abajo',
      enunciado: '¿A cuál le cuesta más perder un electrón: al litio o al potasio?',
      datos: [lugarTxt(3), lugarTxt(19)],
      solucion: [{ texto: 'El litio tiene su electrón de afuera en el nivel 2, más cerca del núcleo que el del potasio, en el nivel 4, así que lo retiene más.', ecuacion: ['Li ', Ei('520'), ' > K ', Ei('419 kJ/mol')] }],
      respuesta: ['Al ', Ei('litio')] },
    { nivel: 1, titulo: 'Izquierda o derecha',
      enunciado: '¿A cuál le cuesta más perder un electrón: al sodio o al cloro?',
      datos: [lugarTxt(11), lugarTxt(17)],
      solucion: [{ texto: 'En el mismo periodo, el cloro tiene 6 protones más jalando el mismo nivel, así que retiene más su electrón.', ecuacion: ['Cl ', Ei('1251'), ' > Na ', Ei('496 kJ/mol')] }],
      respuesta: ['Al ', Ei('cloro')] },
    { nivel: 1, titulo: 'La afinidad del cloro',
      enunciado: 'Al ganar un electrón, un átomo de cloro gaseoso libera 349 kJ/mol. ¿Cuánto vale su afinidad electrónica, con su signo?',
      datos: [D.ae],
      solucion: [{ texto: 'Como el átomo libera energía, la afinidad se escribe con signo negativo.', ecuacion: ['Cl(g) + e⁻ → Cl⁻(g)', SEP, 'AE = ', Ei('−349 kJ/mol')] }],
      respuesta: ['AE = ', Ei('−349 kJ/mol')] },
    { nivel: 1, titulo: 'Cuánto más pide el neón',
      enunciado: 'El neón pide 2081 kJ/mol para perder un electrón y el litio, 520 kJ/mol. ¿Cuántos kJ/mol más pide el neón?',
      datos: ['EI (Ne) = 2081 kJ/mol; EI (Li) = 520 kJ/mol'],
      solucion: [{ texto: 'La diferencia entre las dos energías dice cuánto más pide el neón.', ecuacion: [Ei('2081'), ' − ', Ei('520'), ' = ', Ei('1561 kJ/mol')] }],
      respuesta: [Ei('1561 kJ/mol'), ' más'] },
    { nivel: 2, titulo: 'La bajada del boro',
      enunciado: '¿Por qué al boro le cuesta menos perder un electrón que al berilio, si está a su derecha?',
      datos: ['Berilio: 1s² 2s²; boro: 1s² 2s² 2p¹', 'EI: Be 900 kJ/mol; B 801 kJ/mol'],
      solucion: [
        { texto: 'El boro es el primero con un electrón en el 2p: ese electrón está algo más lejos que los 2s y sale más fácil.', ecuacion: ['Be ', Ei('900'), ' > B ', Ei('801 kJ/mol')] },
        { texto: 'Es la primera bajada del periodo 2; la otra es la del oxígeno.' },
      ],
      respuesta: ['Su electrón 2p sale más fácil que un 2s'] },
    { nivel: 2, titulo: 'Ordenar tres',
      enunciado: 'Ordena de mayor a menor energía de ionización: sodio, magnesio y potasio.',
      datos: [lugarTxt(11), lugarTxt(12), lugarTxt(19)],
      solucion: [
        { texto: 'El Mg está a la derecha del Na, con un protón más: pide más. El K está debajo del Na, con su electrón más lejos: pide menos.', ecuacion: ['Mg > Na > K'] },
        { texto: 'Los datos de la tabla confirman ese orden.', ecuacion: ['Mg ', Ei('738'), ' > Na ', Ei('496'), ' > K ', Ei('419 kJ/mol')] },
      ],
      respuesta: [Ei('Mg > Na > K')] },
    { nivel: 2, titulo: 'El salto del sodio',
      enunciado: 'Las energías de ionización sucesivas del sodio son 496, 4562 y 6910 kJ/mol. ¿Entre cuáles está el salto grande y por qué?',
      datos: ['Sodio: 1s² 2s² 2p⁶ 3s¹'],
      solucion: [
        { texto: 'Divido cada energía entre la anterior para ver dónde está el salto.', ecuacion: ['4562 ÷ 496 ≈ 9,2', SEP, '6910 ÷ 4562 ≈ 1,5'] },
        { texto: 'El salto está entre la primera y la segunda: el segundo electrón ya sale del nivel 2, que está lleno y más cerca del núcleo.' },
      ],
      respuesta: ['Entre la 1.ª y la 2.ª: 1 electrón de valencia'] },
    // Apertura (28 nov, docs/etapa9/aperturas-para-la-teoria.md): el oro retiene su electrón más que el hierro aunque esté
    // dos periodos más abajo. Primeras EI (NIST, Atomic Spectra Database): Fe 7,9025 eV = 762,5 kJ/mol; Au 9,2256 eV =
    // 890,1 kJ/mol; 890 − 762 = 128. Reemplaza al de «Quién libera más»: la afinidad sigue en los de nivel 1 y 3.
    { nivel: 2, titulo: 'El oro y el hierro',
      enunciado: 'El hierro está en el periodo 4 y el oro, dos periodos más abajo. Si la EI baja hacia abajo en la tabla, ¿por qué al oro le cuesta más perder un electrón?',
      datos: ['Primera EI: hierro 762 kJ/mol; oro 890 kJ/mol', 'Hierro: Z = 26, grupo 8; oro: Z = 79, grupo 11 (los dos, metales de transición)'],
      solucion: [
        { texto: 'Los datos mandan: el oro pide unos 128 kJ/mol más, así que retiene su electrón de afuera con más fuerza, aunque ese electrón esté en el nivel 6.', ecuacion: ['Au ', Ei('890'), ' > Fe ', Ei('762 kJ/mol')] },
        { texto: 'Del hierro al oro hay 53 protones más. Los electrones d y f de los niveles de adentro tapan mal esa carga, así que el núcleo del oro jala fuerte su electrón 6s.' },
        { texto: 'Por eso, en los metales de transición la flecha general no basta: hay que mirar el dato. Retener sus electrones es una de las razones por las que el oro casi no se oxida.' },
      ],
      respuesta: ['Su núcleo jala más: en transición, la tendencia no basta'] },
    { nivel: 2, titulo: 'El menor del periodo 2',
      enunciado: '¿Qué elemento del periodo 2 tiene la menor energía de ionización y en qué grupo está?',
      datos: ['EI (kJ/mol): Li 520, Be 900, B 801, C 1086, N 1402, O 1314, F 1681, Ne 2081'],
      figura: BARR(P2),
      solucion: [
        { texto: 'Busco el menor valor: es el primero del periodo.', ecuacion: ['Li: ', Ei('520 kJ/mol')] },
        { texto: 'El litio está en el grupo 1 (IA): tiene un solo electrón en el nivel 2, con el menor número de protones del periodo para retenerlo.' },
      ],
      respuesta: ['El ', Ei('litio'), ', del grupo 1 (IA)'] },
    { nivel: 3, titulo: 'El nitrógeno y el oxígeno',
      enunciado: 'Para el nitrógeno (2s² 2p³) y el oxígeno (2s² 2p⁴), ¿qué afirmación sobre la energía de ionización es correcta?',
      alternativas: ['El oxígeno tiene la mayor, porque está más a la derecha.', 'Los dos tienen la misma: son del periodo 2.', 'El nitrógeno tiene la mayor: el oxígeno pierde un electrón apareado.',
        'El oxígeno tiene la mayor, porque tiene más protones.', 'No se pueden comparar: son de grupos distintos.'],
      datos: ['Nitrógeno: Z = 7; oxígeno: Z = 8', 'EI: N 1402 kJ/mol; O 1314 kJ/mol'],
      solucion: [
        { texto: 'El cuarto electrón 2p del oxígeno comparte orbital con otro: se repelen y sale más fácil.', ecuacion: ['N ', Ei('1402'), ' > O ', Ei('1314 kJ/mol')] },
        { texto: ['La ', letra('A'), ' y la ', letra('D'), ' toman la tendencia como una ley sin excepciones, y del N al O se rompe. La ', letra('B'), ' olvida que sus núcleos y sus electrones 2p son distintos.'] },
        { texto: ['La ', letra('E'), ' se equivoca: dos elementos de un mismo periodo sí se comparan, y aquí hasta se dan sus valores.'] },
      ],
      respuesta: [letra('C'), ', el ', Ei('nitrógeno')] },
    { nivel: 3, titulo: 'Energías sucesivas',
      enunciado: 'Un elemento del periodo 3 tiene estas energías de ionización sucesivas, en kJ/mol: 787, 1577, 3232, 4356 y 16 091. ¿Qué elemento es?',
      alternativas: ['Aluminio, grupo 13', 'Magnesio, grupo 2', 'Azufre, grupo 16', 'Silicio, grupo 14', 'Fósforo, grupo 15'],
      datos: ['Periodo 3: Na, Mg, Al, Si, P, S, Cl y Ar (grupos 1, 2 y 13 a 18)'],
      solucion: [
        { texto: 'Divido cada una entre la anterior: el salto está en la quinta.', ecuacion: ['2,0', SEP, '2,0', SEP, '1,3', SEP, '16 091 ÷ 4356 ≈ ', Ei('3,7')] },
        { texto: 'Antes del salto salen 4 electrones de valencia: grupo 14 (IVA). En el periodo 3, es el silicio.' },
        { texto: ['La ', letra('A'), ' cuenta 3 electrones de valencia y la ', letra('E'), ', 5, pero el salto llega después del cuarto.'] },
        { texto: ['La ', letra('B'), ' ve un salto en el primer 2,0, pero el cociente mayor es el de 3,7. La ', letra('C'), ' supone 6 de valencia, que darían el grupo 16.'] },
      ],
      respuesta: [letra('D'), ', el ', Ei('silicio')] },
    { nivel: 3, titulo: 'Afinidad del flúor y del cloro',
      enunciado: '¿Qué afirmación sobre la afinidad electrónica es correcta?',
      alternativas: ['Ganar un electrón siempre cuesta energía.', 'Es lo mismo que la energía de ionización.', 'El flúor libera más energía que el cloro.',
        'El sodio libera más energía que el cloro.', 'El cloro libera más energía que el flúor.'],
      datos: ['AE (kJ/mol): flúor −328, cloro −349, sodio −53', D.ae],
      solucion: [
        { texto: 'Las tres son negativas: las tres liberan. Libera más el cloro; el flúor, muy pequeño, repele algo al electrón que llega.', ecuacion: ['|−349| > |−328| > |−53|'] },
        { texto: ['La ', letra('A'), ' contradice los signos: las tres AE son negativas, así que las tres liberan. La ', letra('B'), ' confunde ganar un electrón con perderlo.'] },
        { texto: ['La ', letra('C'), ' sigue la tendencia hacia el flúor sin mirar los datos. La ', letra('D'), ' invierte los valores: el sodio libera 53 kJ/mol y el cloro, 349.'] },
      ],
      respuesta: [letra('E'), ', el ', Ei('cloro')] },
    { nivel: 3, titulo: 'El periodo 3 entero',
      enunciado: 'En el periodo 3, del sodio al argón, ¿qué afirmación sobre la energía de ionización es correcta?',
      alternativas: ['Tiende a subir, pero el aluminio pide menos que el magnesio.', 'Sube en cada paso, sin excepciones.', 'Baja, porque el radio disminuye.',
        'El sodio tiene la mayor del periodo.', 'Es la misma en todo el periodo: el nivel es el mismo.'],
      datos: ['Periodo 3, de izquierda a derecha: Na, Mg, Al, Si, P, S, Cl y Ar', 'El 3s se llena en el Na y el Mg; el 3p, del Al al Ar'],
      solucion: [
        { texto: 'Hacia la derecha hay más protones, así que tiende a subir. Baja dos veces: en el Al sale el primer electrón 3p y en el S, un 3p apareado.', ecuacion: ['Mg ', Ei('738'), ' > Al ', Ei('578'), SEP, 'P ', Ei('1012'), ' > S ', Ei('1000 kJ/mol')] },
        { texto: ['La ', letra('B'), ' olvida las dos bajadas. La ', letra('C'), ' invierte la tendencia: un átomo menor retiene más su electrón.'] },
        { texto: ['La ', letra('D'), ' se equivoca: el sodio, primero del periodo, tiene la menor. La ', letra('E'), ' olvida que la carga nuclear crece hacia la derecha.'] },
      ],
      respuesta: [letra('A'), ', sube con dos bajadas'] },
    { nivel: 3, titulo: 'Dos elementos del grupo 2',
      enunciado: 'X tiene Z = 12 y Q, Z = 20. Sus energías de ionización sucesivas dan un salto grande después de la segunda. ¿Qué afirmación es correcta?',
      alternativas: ['X y Q están en el mismo periodo.', 'Los dos son del grupo 2, y la primera EI de X es mayor.', 'Q tiene la mayor primera EI, porque tiene más protones.',
        'Los dos son del grupo 12.', 'Tienen la misma primera EI, porque son de una misma familia.'],
      datos: [D.gases, 'Primera EI: X 738 kJ/mol; Q 590 kJ/mol'],
      solucion: [
        { texto: 'X está en el periodo 3 y Q en el 4. Como el salto llega después de la segunda EI, los dos tienen 2 electrones de valencia: grupo 2.', ecuacion: [Pz('Z = 12'), ': periodo 3', SEP, Pz('Z = 20'), ': periodo 4'] },
        { texto: 'X está arriba de Q: su electrón de afuera está más cerca del núcleo y pide más energía.', ecuacion: ['X ', Ei('738'), ' > Q ', Ei('590 kJ/mol')] },
        { texto: ['La ', letra('A'), ' confunde grupo con periodo: X está en el 3 y Q, en el 4. La ', letra('C'), ' olvida que Q tiene un nivel más y su electrón de afuera queda más lejos.'] },
        { texto: ['La ', letra('D'), ' le suma 10 a los 2 electrones, pero eso se hace solo desde el grupo 13. La ', letra('E'), ' cree que una familia tiene una sola EI.'] },
      ],
      respuesta: [letra('B'), ', grupo 2; la mayor, la de ', Ei('X')] },
  ];

  // «En el mundo» de la idea 3 (28 nov; docs/teoria.md, 4k): el argón de la soldadura TIG. Fronius y otros fabricantes:
  // el argón es el gas de protección más usado en TIG (también el helio o mezclas), porque es inerte y evita que el baño
  // de soldadura reaccione con el oxígeno del aire. Lo explica la regla: el argón cierra el periodo 3, con la EI más alta
  // de su fila (NIST: Ar 1521, Fe 762 kJ/mol; la línea dice «≈ 2 ×», 1521 ÷ 762 = 2,0), y no libera energía al ganar un
  // electrón. La pregunta va al helio: arriba en el grupo, la EI sube. Sin el fósforo ni el azufre (Predice).
  // Revisión del Escribidor Escribano (28 nov): que el argón no libera energía al ganar un electrón estaba de memoria;
  // es cierto (no hay anión de argón estable: Mayer y otros, PNAS, 2019, hablan de su afinidad electrónica negativa,
  // es decir, desfavorable) y ahora va en la fuente. El texto no cambia.
  const MUNDO_EI = {
    hecho: 'El argón protege la soldadura del aire',
    parrafos: [
      'En la soldadura TIG, con la que se unen piezas de acero inoxidable y de aluminio, la boquilla sopla un chorro de argón sobre el metal fundido. Sin ese gas, el oxígeno del aire reaccionaría con el metal caliente y lo llenaría de óxidos que debilitan la unión.',
      ['Para reaccionar, el metal tiene que soltar electrones y otro átomo tiene que recibirlos, como hace el oxígeno, que libera energía al ganar uno. El argón cierra el periodo 3, y su energía de ionización, EI, es la más alta de esa fila, muy por encima de la del hierro:',
        { linea: [EIf, ' (Ar) ≈ 2 × ', EIf, ' (Fe)'] }],
      ['El argón tampoco libera energía al ganar un electrón, porque su último nivel está lleno, así que ni le quita electrones al metal ni le entrega los suyos.'],
    ],
    figura: BARR([26, 18], [18], { rotulo: 'Energía de ionización (kJ/mol)' }),
    pregunta: {
      texto: 'En la soldadura TIG también se usa helio, que está en la cima de la columna del argón. ¿Qué esperas de la EI del helio?',
      opciones: [
        { id: 'c', texto: 'Es mayor que la del argón: sus electrones están en el nivel 1', correcta: true },
        { id: 'protones', texto: 'Es menor: tiene 2 protones, y el argón tiene 18', error: 'QM-EI-PROTONES',
          siFuera: 'Es cierto que el núcleo del helio tiene muchos menos protones. Pero sus dos electrones están en el nivel 1, pegados al núcleo y sin niveles de adentro que tapen su carga, así que arrancar uno cuesta más.' },
        { id: 'grupo', texto: 'Es igual: los dos son gases nobles', error: 'QM-EI-GRUPO',
          siFuera: 'Es cierto que los dos son gases nobles y casi no reaccionan. Pero estar en la misma columna no iguala la EI: hacia arriba, el electrón de afuera está más cerca del núcleo y cuesta más arrancarlo.' },
      ],
      porque: 'La EI sube hacia arriba en un grupo, porque el electrón de afuera está más cerca del núcleo. En el helio está en el nivel 1, así que arrancarlo cuesta más que en el argón.',
    },
    fuente: 'Soldadura TIG: Fronius; energías de ionización: NIST; el argón no forma un anión estable: Mayer y otros, PNAS (2019).',
  };
  const ionizacion = {
    id: 'energia-ionizacion',
    titulo: 'Energía de ionización y afinidad electrónica',
    pregunta: '¿Cuánto cuesta arrancarle un electrón a un átomo?',
    temas: ['Energía de ionización y afinidad electrónica'],
    pieza: 'quim-tabla',
    aprendizaje: 'Arrancar un electrón cuesta más a la derecha y arriba, con bajadas como Be–B y N–O. La afinidad es la energía al ganarlo.',
    actividad: 'Recorrer el periodo 2 y comparar lo que cuesta arrancar cada electrón.',
    lee: {
      tarjetas: [
        { titulo: 'La romana del mercado', texto: 'En el mercado, la romana cuelga de un gancho y marca cuánto jala su resorte. Imagina una que jala el electrón de más afuera de un átomo: cuanto más marca, más cuesta arrancarlo.',
          pieza: 'quim-tira', dibujo: OBJ([{ que: 'romana', nombre: 'romana' }]) },
        { titulo: 'Lo que mide', texto: 'Esa energía es la energía de ionización, EI: la que se necesita para quitarle un electrón a un átomo aislado, en estado gaseoso. Al perderlo, el átomo queda como catión.',
          ecuacion: ['X(g) + ', EIf, ' → X⁺(g) + e⁻'] },
        { titulo: 'El límite de la romana', texto: 'La romana es solo una comparación, porque el electrón no cuelga de nada. La EI se da en kilojulios por cada mol de átomos (kJ/mol); un mol son 6,02 × 10²³ átomos, y se estudia más adelante.' },
        { titulo: 'Qué mirar', texto: 'En el juego recorres el periodo 2, del litio al neón. Compara cada barra con la de su vecino de la izquierda: ¿siempre sube?' },
      ],
    },
    ejemplos: EJEMPLOS_EI,
    juega: {
      pieza: 'quim-tira',
      consigna: 'Mueve el elemento por el periodo 2. Cada barra es lo que marcaría la romana al arrancarle su electrón de más afuera.',
      mision: {
        texto: 'En el periodo 2, encuentra uno que cueste menos que su vecino de la izquierda.',
        logrado: v => v.z > 3 && EI[v.z] < EI[v.z - 1],
        bien: 'Ahí la subida se corta: compara la configuración de los dos vecinos.',
      },
      voz: 'Busca las barras que no siguen la subida.',
      leyenda: [
        { s: EIf, t: 'energía de ionización' },
        { s: 'kJ/mol', t: 'kilojulios por cada mol de átomos' },
        { s: 'barra', t: 'más alta: cuesta más arrancar el electrón' },
      ],
      controles: [{ id: 'z', etiqueta: 'Elemento (Z)', color: 'c-o', min: 3, max: 10, paso: 1, inicio: 3, decimales: 0 }],
      dibujo: v => BARR(P2, [v.z], { rotulo: `EI en kJ/mol · ${NOMBRE[v.z]} marcado` }),
      lectura: v => (v.z === 3 ? ['Li: ', EIf, ' = ', Ei('520 kJ/mol'), ', la más baja del periodo 2.']
        : [`${SIMB[v.z]}: `, EIf, ' = ', Ei(`${EI[v.z]} kJ/mol`), `; ${SIMB[v.z - 1]}: `, Ei(`${EI[v.z - 1]}`), `. ${EI[v.z] > EI[v.z - 1] ? 'Aquí sube' : 'Aquí baja'}.`]),
      minimo: 4,
    },
    predice: {
      pieza: 'quim-tira',
      pregunta: '¿Cuál necesita más energía para perder un electrón: el fósforo o el azufre?',
      datos: ['Fósforo: [Ne] 3s² 3p³; azufre: [Ne] 3s² 3p⁴', 'Los dos están en el periodo 3'],
      voz: 'La flecha general no lo decide todo.',
      opciones: [
        { id: 'c', texto: 'El fósforo: en el azufre sale un electrón apareado, que se repele', correcta: true },
        { id: 'protones', texto: 'El azufre: tiene un protón más', error: 'QM-EI-PROTONES', siFuera: 'Sería así si solo contaran los protones. El azufre tiene uno más, pero su cuarto electrón 3p comparte orbital con otro, se repelen y sale más fácil.' },
        { id: 'flecha', texto: 'El azufre: está más a la derecha y la EI siempre sube', error: 'QM-FLECHA', siFuera: 'Sería así si la tendencia no tuviera excepciones. La EI suele subir hacia la derecha, pero del fósforo al azufre se rompe: el electrón que sale del azufre comparte orbital con otro, y por eso sale más fácil.' },
        { id: 'igual', texto: 'Los dos igual: están en el mismo periodo', error: 'TP7', siFuera: 'Sería así si estar en el mismo periodo bastara. Comparten periodo, pero sus núcleos y su último electrón son distintos, y su EI también.' },
      ],
      dibujo: (b => { b.datos.barras.forEach(x => { if (x.s === 'P' || x.s === 'S') x.oculto = true; }); return b; })(BARR([11, 12, 13, 14, 15, 16, 17, 18], [15, 16], { rotulo: 'Periodo 3: ¿P o S?' })),
      revelar: BARR([11, 12, 13, 14, 15, 16, 17, 18], [15, 16], { rotulo: 'P 1012 · S 1000 kJ/mol' }),
      coincide: 'Coincide: el fósforo pide 1012 kJ/mol y el azufre, 1000.',
      noCoincide: 'El fósforo pide 1012 kJ/mol y el azufre, 1000: el electrón apareado sale más fácil.',
    },
    mira: {
      pieza: 'quim-tabla',
      datos: barrasEI(TODOS, { marcadas: [{ Z: 13, color: 'h', desde: 1 }, { Z: 16, color: 'h', desde: 2 }, { Z: 19, color: 'h', desde: 4 }, { Z: 12, color: 'h', desde: 5 }] }).datos,
      voz: 'Recorramos el periodo 3 y bajemos por un grupo.',
      pasos: [
        { estado: { corte: 0 }, texto: 'En cada periodo, la EI sube de izquierda a derecha, porque el núcleo, con más protones, jala más el mismo nivel.', ecuacion: ['Na ', Ei('496'), ' → Ar ', Ei('1521 kJ/mol')] },
        { estado: { corte: 1 }, texto: 'Primera bajada: el único electrón 3p del aluminio está más lejos del núcleo que los 3s, y sale más fácil.', ecuacion: ['Mg ', Ei('738'), ' > Al ', Ei('578')] },
        { estado: { corte: 2 }, texto: 'Segunda bajada: en el azufre, un electrón 3p comparte orbital con otro; los dos se repelen y uno sale más fácil.', ecuacion: ['P ', Ei('1012'), ' > S ', Ei('1000')] },
        { estado: { corte: 3 }, texto: 'En la academia lo dicen así: el 3p³ del fósforo, semilleno, es estable. Es lo mismo dicho de otro modo: en el fósforo, ningún electrón 3p comparte orbital.', ecuacion: ['P: 3s² 3p³'] },
        { estado: { corte: 4 }, texto: 'Hacia abajo en un grupo, la EI baja: con un nivel más, el electrón de afuera está más lejos del núcleo.', ecuacion: ['Li ', Ei('520'), ' > Na ', Ei('496'), ' > K ', Ei('419')] },
        { estado: { corte: 5 }, texto: 'Las EI sucesivas del magnesio saltan después de la segunda: el tercer electrón ya sale del nivel 2, lleno y más cerca del núcleo, así que tiene dos de valencia.', ecuacion: ['738 → 1451 → ', Ei('7733 kJ/mol')] },
        { estado: { corte: 5 }, texto: 'La afinidad electrónica, AE, es otro proceso: la energía en juego cuando un átomo gaseoso gana un electrón; si el átomo la libera, la AE es negativa.', ecuacion: ['Cl(g) + e⁻ → Cl⁻(g)', SEP, 'AE = ', Ei('−349 kJ/mol')] },
      ],
    },
    regla: {
      texto: 'La EI sube hacia la derecha, porque más protones retienen el mismo nivel, y hacia arriba, porque el electrón está más cerca del núcleo. Baja cuando sale el primer electrón p (de Be a B) o uno que comparte orbital (de N a O). En las EI sucesivas, los electrones antes del salto grande dan el grupo.',
      ecuacion: [{ llave: ['X(g) → X⁺(g) + e⁻'], nota: 'EI: siempre cuesta' }, SEP, { llave: ['Cl(g) + e⁻ → Cl⁻(g)'], nota: 'AE = −349 kJ/mol: libera' }],
      condicion: 'se miden átomos aislados y gaseosos, y las flechas se leen como tendencias: entre vecinos de fila, la configuración puede romperlas. Una AE negativa indica que el átomo libera energía.',
      voz: 'Ante la duda, mira el dato.',
      dibujo: barrasEI(TODOS),
    },
    mundo: MUNDO_EI,
    resuelve: {
      pieza: 'quim-tabla',
      generar(s) {
        const z = SUC_RES[s % SUC_RES.length], e = SUCESIVAS[z], { k, grupo, cocientes } = grupoSucesivas(z), p = lugar(z).periodo;
        return {
          enunciado: `Un elemento del periodo ${p} tiene estas energías de ionización sucesivas, en kJ/mol: ${listaEI(z)}. ¿A qué grupo pertenece y qué elemento es?`,
          datos: ['Cada EI sucesiva arranca un electrón más', D.grupos, `Periodo ${p}: ${TODOS.filter(x => lugar(x).periodo === p && (lugar(x).grupo <= 2 || lugar(x).grupo >= 13)).map(x => SIMB[x]).join(', ')}`],
          dibujo: tabla({ periodos: Math.max(2, p) }),
          pasos: [
            { tipo: 'pide', texto: 'Piden el grupo y el elemento, a partir de lo que cuesta arrancar cada electrón.' },
            { tipo: 'datos', texto: `Hay ${e.length} energías: cada una arranca un electrón más del mismo átomo.` },
            { tipo: 'regla', texto: 'Mientras salen electrones del último nivel, cada EI sube poco; al llegar a un nivel lleno de adentro, sube de golpe. Los electrones que salen antes del salto son los de valencia.' },
            { tipo: 'cuentas', texto: 'Divido cada EI entre la anterior, porque el cociente dice cuántas veces más cuesta el electrón siguiente, y busco el cociente mayor.',
              ecuacion: [cocientes.map((c, i) => `${miles(e[i + 1])} ÷ ${miles(e[i])} ≈ ${f(c, 1)}`).join(SEP)] },
            { tipo: 'sentido', texto: `El salto llega en la EI número ${k + 1}, así que hay ${k} ${k === 1 ? 'electrón' : 'electrones'} de valencia y el elemento es del grupo ${grupoAB(grupo)}; en el periodo ${p}, es el ${NOMBRE[z]}.`,
              dibujo: tabla({ periodos: Math.max(2, p), marcadas: [{ Z: z, color: 'h' }] }) },
          ],
          respuesta: [Ei(`Grupo ${grupoAB(grupo)}`), `: el ${NOMBRE[z]}`],
        };
      },
    },
    ahoraTu: {
      pieza: 'quim-tabla',
      voz: 'Ubica los dos; si son vecinos de fila, mira su configuración.',
      generar(sem) {
        const r = azar(sem * 83 + 5), tipo = sem % 6;
        if (tipo === 0) return casoParEI(r, 'grupo');
        if (tipo === 1) return casoParEI(r, 'periodo');
        if (tipo === 2) return casoParEI(r, 'bajada');
        return [casoSucesivas, casoAfinidad, casoEcuacionEI][tipo - 3](r);
      },
    },
  };

  // ---------- Idea 4 (rehecha, 19 nov): electronegatividad y carácter metálico ----------
  // Propuesta B4. Objeto de la primera pantalla: dos personas que jalan una soga (analogía con su límite en «Lee»).
  // Cambia: los dos átomos del enlace · Permanece: las barras de electronegatividad de toda la tabla · Progresa: de quién
  // jala más a la diferencia y a todas las tendencias juntas · Se reserva: el flúor solo, sin enlace (Predice) · Debe
  // verse: hacia qué átomo se corre el par.
  // Errores: TP8 (electronegativo es negativo; 25 % de 88 universitarios), TP8-E (más electrones que protones; parte el
  // código), QM-EN-AFINIDAD, QM-EN-ORDEN, QM-EN-MEDIO, QM-EN-RADIO, QM-EN-SUMA, QM-EN-SOLO, QM-EN-MITAD, QM-EN-INVERSA,
  // QM-EN-GRUPO, QM-EN-PERIODO, QM-METAL-INVERSO, QM-METAL-IGUAL, QM-SIN-LEY.
  const f2 = x => (Math.round(x * 100) / 100).toFixed(2).replace('.', ',');   // la EN, siempre con dos decimales
  const enTxt = z => f2(EN[z]);
  const barrasEN = (zs, extra = {}) => tabla(Object.assign({ propiedad: { valores: valores(EN, zs), max: 4, forma: 'barra', color: 'f', nombre: 'EN (Pauling)' }, rotulo: 'EN: electronegatividad (Pauling)' }, extra));
  const JUEGO_A = [1, 3, 11, 19, 6], JUEGO_B = [9, 17, 8, 7, 16];
  const MAXD = Math.max(...JUEGO_A.flatMap(a => JUEGO_B.map(b => Math.abs(EN[a] - EN[b]))));
  const PARES_EN = [[1, 8], [6, 7], [1, 9], [11, 8], [6, 16], [14, 8], [1, 16], [19, 35], [15, 9], [12, 17], [5, 7], [13, 9], [6, 9], [1, 6]];
  const PARES_EN_R = [[[1, 17], [1, 9]], [[6, 8], [6, 7]], [[11, 17], [12, 17]], [[1, 8], [1, 7]], [[6, 1], [6, 9]]];
  const TRIOS_EN = [[6, 7, 14], [8, 9, 16], [12, 13, 20], [16, 17, 34], [3, 4, 11], [5, 6, 13], [11, 12, 19]];
  // Sin el par Ca–Ga: la EI del Ga (579) es menor que la del Ca (590) y la definición dice «qué tan fácil pierde electrones».
  const PARES_METAL = [[3, 11], [11, 19], [11, 17], [12, 16], [4, 20], [13, 15], [19, 35], [20, 35], [14, 32], [3, 9]];
  const DE = { en: 'EN: cuánto jala un átomo el par que comparte en un enlace (escala de Pauling)', metal: 'Carácter metálico: qué tan fácil pierde electrones un elemento' };
  const delta = (a, b) => Math.abs(EN[a] - EN[b]);
  function casoHacia(r) {
    const [a, b] = r.baraja(r.de(PARES_EN)), m = EN[a] > EN[b] ? a : b, o = m === a ? b : a;
    return {
      pregunta: `En el enlace ${SIMB[a]}–${SIMB[b]}, ¿hacia qué átomo se corre el par de electrones compartido?`,
      datos: [`EN: ${SIMB[a]} ${enTxt(a)}; ${SIMB[b]} ${enTxt(b)}`],
      dibujo: tabla({ marcadas: [{ Z: a, color: 'f' }, { Z: b, color: 'f' }] }),
      opciones: ops(`Hacia el ${SIMB[m]}`, [`Hacia el ${SIMB[o]}`, 'QM-EN-ORDEN', `Sería así si el ${SIMB[o]} tuviera mayor electronegatividad. Compara los dos valores: el ${SIMB[m]} jala más, y el par se corre hacia él.`],
        ['Queda justo en el medio', 'QM-EN-MEDIO', 'El par queda en el medio solo si los dos átomos tienen la misma electronegatividad, y aquí sus valores son distintos.'],
        ['Hacia el átomo más grande', 'QM-EN-RADIO', 'Sería así si decidiera el tamaño. Lo que decide es cuál de los dos jala más el par, y eso lo dice su electronegatividad.']),
      solucion: { texto: `El par se corre hacia el ${SIMB[m]}, que jala más: su electronegatividad es ${enTxt(m)}, contra ${enTxt(o)}.`, ecuacion: [Ne(`EN (${SIMB[m]})`), ' > ', Ne(`EN (${SIMB[o]})`)],
        dibujo: barrasEN([a, b], { marcadas: [{ Z: a, color: 'f' }, { Z: b, color: 'f' }] }) },
    };
  }
  function casoDelta(r) {
    const [a, b] = r.baraja(r.de(PARES_EN)), m = EN[a] > EN[b] ? a : b, o = m === a ? b : a, d = delta(a, b);
    return {
      pregunta: ['¿Cuánto vale ΔEN en el enlace ', `${SIMB[a]}–${SIMB[b]}?`],
      datos: [`EN: ${SIMB[a]} ${enTxt(a)}; ${SIMB[b]} ${enTxt(b)}`, D.delta],
      opciones: ops(f2(d), [f2(EN[a] + EN[b]), 'QM-EN-SUMA', 'Ese valor es la suma de las dos. ΔEN es una diferencia: a la mayor se le resta la menor.'],
        [f2(EN[m]), 'QM-EN-SOLO', 'Sería así si el otro átomo no jalara nada. Ese es solo el valor del que jala más; ΔEN compara a los dos, así que falta restarle el valor del otro.'],
        [f2(d / 2), 'QM-EN-MITAD', 'Sería así si ΔEN fuera la mitad de la resta. La resta está bien, pero ΔEN es la diferencia entera, así que no se divide entre 2.']),
      solucion: { texto: 'A la electronegatividad mayor se le resta la menor, porque ΔEN dice cuánto más jala un átomo que el otro.', ecuacion: ['ΔEN = ', Ne(enTxt(m)), ' − ', Ne(enTxt(o)), ' = ', Ne(f2(d))] },
    };
  }
  function casoTrioEN(r) {
    const [p, de, ab] = r.de(TRIOS_EN), s = z => SIMB[z], t = l => l.map(s).join(' > '), lista = r.baraja([p, de, ab]);
    return {
      pregunta: `Ordena de mayor a menor electronegatividad: ${lista.map(z => NOMBRE[z]).join(', ')}.`,
      datos: [...lista.map(lugarTxt), DE.en],
      opciones: ops(t([de, p, ab]), [t([ab, p, de]), 'QM-EN-INVERSA', 'Ese orden sería cierto si la electronegatividad creciera hacia abajo y a la izquierda. Crece hacia arriba y a la derecha, así que va al revés.'],
        [t([p, de, ab]), 'QM-EN-PERIODO', 'Sería así si en una fila jalara más el de la izquierda. El de la derecha tiene más protones para el mismo nivel, así que jala más el par y va antes.'],
        [t([de, ab, p]), 'QM-EN-GRUPO', 'Sería así si en una columna jalara más el de abajo. El de arriba tiene el par más cerca del núcleo, así que lo jala más y va antes.']),
      solucion: { texto: 'En la fila, el de la derecha jala más porque tiene más protones; en la columna, el de abajo jala menos porque el par le queda más lejos.', ecuacion: [Ne(t([de, p, ab]))] },
    };
  }
  function casoMetal(r) {
    const [a, b] = r.baraja(r.de(PARES_METAL)), la = lugar(a), lb = lugar(b);
    const m = la.periodo === lb.periodo ? (la.grupo < lb.grupo ? a : b) : (la.periodo > lb.periodo ? a : b), o = m === a ? b : a;
    return {
      pregunta: `¿Cuál tiene mayor carácter metálico: el ${NOMBRE[a]} o el ${NOMBRE[b]}?`,
      datos: [lugarTxt(a), lugarTxt(b), DE.metal],
      opciones: ops(`El ${NOMBRE[m]}`, [`El ${NOMBRE[o]}`, 'QM-METAL-INVERSO', 'Sería así si el carácter metálico creciera hacia arriba y a la derecha. Crece al revés: hacia abajo y hacia la izquierda.'],
        ['Los dos tienen el mismo', 'QM-METAL-IGUAL', 'Serían iguales si perdieran electrones con la misma facilidad. Comparten fila o columna, pero uno suelta su electrón de afuera más fácil que el otro.'],
        ['No se puede saber sin probarlos', 'QM-SIN-LEY', 'No hace falta probarlos: el carácter metálico sigue una tendencia, y el lugar de cada uno en la tabla basta para compararlos.']),
      solucion: { texto: `El ${NOMBRE[m]} está más ${la.periodo === lb.periodo ? 'a la izquierda' : 'abajo'}, así que pierde electrones con más facilidad y es más metálico.` },
    };
  }
  const AFIRMA_E = [
    ['Del sodio al cloro, el radio atómico baja.', true, 'más protones jalan el mismo nivel'],
    ['En el grupo 1, la EI crece hacia abajo.', false, 'baja, porque el electrón de afuera está más lejos del núcleo'],
    ['El flúor es el elemento más electronegativo.', true, 'su valor, 3,98, es el mayor de la escala de Pauling'],
    ['El potasio es menos metálico que el bromo.', false, 'el potasio, a la izquierda del bromo, suelta su electrón más fácil y es más metálico'],
    ['La electronegatividad crece hacia abajo en un grupo.', false, 'baja, porque hacia abajo el par queda más lejos del núcleo'],
    ['El carácter metálico crece hacia abajo en un grupo.', true, 'hacia abajo, el electrón de afuera sale más fácil'],
    ['El potasio es más metálico que el sodio.', true, 'el potasio está debajo del sodio en el grupo 1, con su electrón de afuera más lejos'],
  ];

  // Ejemplos de la idea 4. Cuentas rehechas aparte (cuentas-b.py): O–H 3,44 − 2,20 = 1,24 · Cl 3,16 > H 2,20 · F > O > N ·
  // K > Na · Na–Cl 3,16 − 0,93 = 2,23 · H–F 1,78 > H–Cl 0,96 · Cl > S > Se · C 2,55 > H 2,20 (C–H casi sin correrse, 0,35) ·
  // K–F 3,16 · periodo 4: K el más metálico, Br el más electronegativo · grupo 17: F 3,98 > Cl 3,16 > Br 2,96 · 2,58 y 1,31:
  // S y Mg, 1,27 · Cs más metálico, F más electronegativo · las cuatro tendencias.
  const EJEMPLOS_EN = [
    { nivel: 1, titulo: 'La diferencia en el agua',
      enunciado: 'En el enlace O–H del agua, ¿cuánto vale ΔEN?',
      datos: ['EN: O 3,44; H 2,20', D.delta],
      solucion: [{ texto: 'A la electronegatividad mayor le resto la menor, porque ΔEN dice cuánto más jala el par un átomo que el otro.', ecuacion: ['ΔEN = ', Ne('3,44'), ' − ', Ne('2,20'), ' = ', Ne('1,24')] }],
      respuesta: ['ΔEN = ', Ne('1,24')] },
    { nivel: 1, titulo: 'Hacia dónde va el par',
      enunciado: 'En el enlace H–Cl, ¿hacia qué átomo se corre el par de electrones compartido?',
      datos: ['EN: H 2,20; Cl 3,16'],
      solucion: [{ texto: 'El par se corre hacia el que jala más: el de mayor electronegatividad.', ecuacion: [Ne('EN (Cl)'), ' > ', Ne('EN (H)')] }],
      respuesta: ['Hacia el ', Ne('cloro')] },
    { nivel: 1, titulo: 'Tres del periodo 2',
      enunciado: 'Ordena de mayor a menor electronegatividad: nitrógeno, flúor y oxígeno.',
      datos: [lugarTxt(7), lugarTxt(8), lugarTxt(9)],
      solucion: [{ texto: 'Los tres están en el periodo 2: hacia la derecha hay más protones para el mismo nivel, así que la electronegatividad crece.', ecuacion: ['F ', Ne('3,98'), ' > O ', Ne('3,44'), ' > N ', Ne('3,04')] }],
      respuesta: [Ne('F > O > N')] },
    { nivel: 1, titulo: 'Más metálico',
      enunciado: '¿Cuál tiene mayor carácter metálico: el sodio o el potasio?',
      datos: [lugarTxt(11), lugarTxt(19), DE.metal],
      solucion: [{ texto: 'El potasio está más abajo en el grupo 1: su electrón de afuera está más lejos y sale más fácil.' }],
      respuesta: ['El potasio'] },
    { nivel: 1, titulo: 'La diferencia en la sal',
      enunciado: 'Entre el sodio y el cloro de la sal, ¿cuánto vale ΔEN?',
      datos: ['EN: Na 0,93; Cl 3,16', D.delta],
      solucion: [{ texto: 'A la electronegatividad mayor le resto la menor.', ecuacion: ['ΔEN = ', Ne('3,16'), ' − ', Ne('0,93'), ' = ', Ne('2,23')] }],
      respuesta: ['ΔEN = ', Ne('2,23')] },
    { nivel: 2, titulo: 'Dos enlaces del hidrógeno',
      enunciado: '¿En cuál enlace se corre más el par compartido: en H–F o en H–Cl?',
      datos: ['EN: H 2,20; F 3,98; Cl 3,16', D.delta],
      solucion: [
        { texto: 'Calculo las dos diferencias.', ecuacion: ['H–F: 3,98 − 2,20 = ', Ne('1,78'), SEP, 'H–Cl: 3,16 − 2,20 = ', Ne('0,96')] },
        { texto: 'Cuanto mayor es la diferencia, más se corre el par hacia el que jala más: en H–F, hacia el flúor.' },
      ],
      respuesta: ['En ', Ne('H–F'), ': ΔEN = 1,78'] },
    { nivel: 2, titulo: 'Dos anfígenos y un halógeno',
      enunciado: 'Ordena de mayor a menor electronegatividad: azufre, selenio y cloro.',
      datos: [lugarTxt(16), lugarTxt(34), lugarTxt(17)],
      solucion: [
        { texto: 'El cloro está a la derecha del azufre, con un protón más: jala más. El selenio está debajo del azufre, con el par más lejos: jala menos.' },
        { texto: 'Los valores de la escala confirman ese orden.', ecuacion: ['Cl ', Ne('3,16'), ' > S ', Ne('2,58'), ' > Se ', Ne('2,55')] },
      ],
      respuesta: [Ne('Cl > S > Se')] },
    { nivel: 2, titulo: 'El enlace C–H',
      enunciado: 'En el enlace C–H del metano, ¿hacia qué átomo se corre el par y cuánto vale ΔEN?',
      datos: ['EN: C 2,55; H 2,20', D.delta],
      solucion: [
        { texto: 'El carbono jala un poco más que el hidrógeno.', ecuacion: ['ΔEN = ', Ne('2,55'), ' − ', Ne('2,20'), ' = ', Ne('0,35')] },
        { texto: 'Con una diferencia tan chica, el par casi queda en el medio: los dos átomos lo jalan casi igual.' },
      ],
      respuesta: ['ΔEN = ', Ne('0,35'), ', hacia el carbono'] },
    { nivel: 2, titulo: 'El enlace de mayor diferencia',
      enunciado: 'De los átomos H, Na, K, F y Cl, ¿qué par da la mayor ΔEN y cuánto vale?',
      datos: ['EN: H 2,20; Na 0,93; K 0,82; F 3,98; Cl 3,16', D.delta],
      solucion: [
        { texto: 'La mayor diferencia sale de juntar al que más jala con el que menos jala.', ecuacion: ['F: ', Ne('3,98'), SEP, 'K: ', Ne('0,82')] },
        { texto: 'A la electronegatividad mayor le resto la menor.', ecuacion: ['ΔEN = 3,98 − 0,82 = ', Ne('3,16')] },
      ],
      respuesta: ['K y F: ΔEN = ', Ne('3,16')] },
    { nivel: 2, titulo: 'Los dos extremos del periodo 4',
      enunciado: 'Del potasio (grupo 1) al bromo (grupo 17), en el periodo 4, ¿cuál es el más metálico y cuál el más electronegativo?',
      datos: [lugarTxt(19), lugarTxt(35), DE.metal],
      solucion: [
        { texto: 'El carácter metálico crece hacia la izquierda: el más metálico es el potasio.' },
        { texto: 'La electronegatividad crece hacia la derecha: la mayor es la del bromo.', ecuacion: ['K ', Ne('0,82'), SEP, 'Br ', Ne('2,96')] },
      ],
      respuesta: ['Más metálico, el potasio; más electronegativo, el ', Ne('bromo')] },
    { nivel: 3, titulo: 'Flúor, cloro y bromo',
      enunciado: 'Para el flúor, el cloro y el bromo, del grupo 17, ¿qué afirmación es correcta?',
      alternativas: ['El bromo es el más electronegativo: tiene más protones.', 'Los tres jalan igual: son de la misma familia.', 'El cloro es el más electronegativo del grupo.',
        'El flúor es el más electronegativo y el bromo, el menos.', 'El flúor tiene carga negativa por ser el más electronegativo.'],
      datos: ['EN: F 3,98; Cl 3,16; Br 2,96'],
      solucion: [
        { texto: 'Hacia abajo en el grupo, el par compartido queda más lejos del núcleo, así que el átomo lo jala menos.', ecuacion: ['F ', Ne('3,98'), ' > Cl ', Ne('3,16'), ' > Br ', Ne('2,96')] },
        { texto: ['La ', letra('A'), ' invierte el grupo: más protones no bastan si el par queda más lejos. La ', letra('B'), ' olvida que tienen distinto número de niveles. La ', letra('C'), ' elige al del medio.'] },
        { texto: ['La ', letra('E'), ' confunde electronegativo con negativo: el átomo de F es neutro.'] },
      ],
      respuesta: [letra('D'), ', el ', Ne('flúor'), ' jala más'] },
    { nivel: 3, titulo: 'Dos elementos sin nombre',
      enunciado: 'X tiene EN = 2,58 y Q, EN = 1,31. Están en el periodo 3. ¿Qué afirmación es correcta?',
      alternativas: ['Q está a la derecha de X.', 'ΔEN entre X y Q vale 3,89.', 'Q es menos metálico que X.', 'En un enlace X–Q, el par va hacia Q.', 'X está a la derecha de Q y jala el par hacia sí.'],
      datos: [DE.en, DE.metal, D.delta],
      solucion: [
        { texto: 'X jala más: en el periodo 3 está más a la derecha (es el azufre; Q, el magnesio).', ecuacion: ['ΔEN = ', Ne('2,58'), ' − ', Ne('1,31'), ' = ', Ne('1,27')] },
        { texto: ['La ', letra('A'), ' invierte el lugar: el que jala más, X, está a la derecha. La ', letra('B'), ' suma en vez de restar.'] },
        { texto: ['La ', letra('C'), ' invierte el carácter metálico: Q, a la izquierda, es más metálico. La ', letra('D'), ' manda el par al que jala menos.'] },
      ],
      respuesta: [letra('E'), ', el par va hacia ', Ne('X')] },
    { nivel: 3, titulo: 'El cesio y el flúor',
      enunciado: 'El cesio está en el periodo 6, grupo 1, y el flúor en el periodo 2, grupo 17. ¿Qué afirmación es correcta?',
      alternativas: ['El cesio es más metálico y el flúor, más electronegativo.', 'El flúor es más metálico: tiene más electrones de valencia.', 'Los dos tienen el mismo carácter metálico.',
        'El cesio es más electronegativo: tiene más protones.', 'Al unirse, el par queda en el medio.'],
      datos: ['EN: Cs 0,79; F 3,98', DE.metal],
      solucion: [
        { texto: 'El cesio está abajo a la izquierda, así que es el más metálico; el flúor está arriba a la derecha y es el que más jala.' },
        { texto: ['La ', letra('B'), ' invierte el carácter metálico: tener más electrones de valencia no ayuda a soltarlos. La ', letra('C'), ' olvida que están en extremos opuestos.'] },
        { texto: ['La ', letra('D'), ' cree que más protones jalan más, aunque el par queda lejos. La ', letra('E'), ' olvida que la diferencia es grande: 3,19.'] },
      ],
      respuesta: [letra('A'), ', cesio metálico y ', Ne('flúor'), ' electronegativo'] },
    { nivel: 3, titulo: 'Las cuatro tendencias del periodo 4',
      enunciado: 'En el periodo 4, del potasio al bromo, ¿qué afirmación es correcta?',
      alternativas: ['El radio crece hacia el bromo.', 'La electronegatividad crece y el carácter metálico baja hacia el bromo.', 'El potasio es el más electronegativo.',
        'El carácter metálico crece hacia el bromo.', 'La energía de ionización baja hacia el bromo.'],
      datos: ['K: grupo 1; Br: grupo 17 (los dos, del periodo 4)', DE.metal],
      solucion: [
        { texto: 'Hacia la derecha en el periodo: radio y carácter metálico bajan; energía de ionización y electronegatividad suben.', ecuacion: ['EN: K ', Ne('0,82'), ' → Br ', Ne('2,96')] },
        { texto: ['La ', letra('A'), ' invierte el radio y la ', letra('D'), ', el carácter metálico: los dos bajan. La ', letra('C'), ' le da la mayor electronegatividad al de la izquierda.'] },
        { texto: ['La ', letra('E'), ' invierte la energía de ionización: el bromo retiene más su electrón.'] },
      ],
      respuesta: [letra('B'), ', crece la ', Ne('EN'), ' y baja lo metálico'] },
    { nivel: 3, titulo: 'Verdadero o falso',
      enunciado: 'Indica verdadero (V) o falso (F). I. El flúor aislado tiene carga negativa. II. En un grupo, la electronegatividad baja hacia abajo. III. En un enlace Na–Cl, el par se corre hacia el Na.',
      alternativas: ['VVV', 'VFF', 'FVF', 'FFV', 'FVV'],
      datos: ['EN: Na 0,93; Cl 3,16', DE.en],
      solucion: [
        { texto: 'I es falsa: el átomo aislado es neutro. II es verdadera. III es falsa: el par va al Cl, que jala más.', ecuacion: ['FVF'] },
        { texto: ['La ', letra('A'), ' y la ', letra('B'), ' toman electronegativo por negativo, pero el flúor aislado tiene 9 protones y 9 electrones. La ', letra('D'), ' invierte las tres.'] },
        { texto: ['La ', letra('E'), ' acierta en I y II, pero manda el par al que jala menos.'] },
      ],
      respuesta: [letra('C'), ', FVF'] },
  ];

  // «En el mundo» de la idea 4 (28 nov; docs/teoria.md, 4k): el grupo 14, del diamante que no conduce al plomo que sí.
  // LibreTexts («Group 14: General Properties»): el carbono es no metal, el silicio y el germanio son semiconductores
  // (la base de diodos y transistores) y el estaño y el plomo, metales. La mina San Rafael (Minsur) está en Antauta,
  // Melgar, Puno, y saca cerca del 10 % del estaño del mundo (Gestión, Energiminas). El plomo de las baterías de auto,
  // de memoria (batería de plomo y ácido). La pregunta va al grupo 15 (N gas, Bi metal). Sin el flúor aislado (Predice).
  // Revisión del Escribidor Escribano (28 nov): el diamante como aislante (brecha de unos 5,5 eV) y las placas de plomo
  // de la batería de auto son datos de manual, ciertos, que siguen sin fuente abierta en esta sesión: por confirmar en
  // LibreTexts antes de publicar. «Como lo piden los chips» era vago: ahora dice que los chips se hacen de silicio (el
  // germanio solo va en algunos chips de radio, y no se nombra). El grupo 14 tiene cuatro electrones de afuera, así que
  // «su electrón de afuera» pasa a plural. El bismuto no es «el último elemento» del grupo 15 (debajo está el
  // moscovio, sintético): ahora está «cuatro filas más abajo».
  const G14 = [['C', 'diamante: no conduce'], ['Si', 'semiconductor: chips'], ['Ge', 'semiconductor'], ['Sn', 'metal: conduce'], ['Pb', 'metal: conduce']];
  const SVG_G14 = `<svg viewBox="0 0 400 330" width="400" height="330" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <text x="200" y="24" text-anchor="middle" font-size="19" font-weight="800" fill="currentColor">Grupo 14, de arriba abajo</text>
    ${G14.map(([s, t], i) => `<rect x="70" y="${42 + i * 56}" width="64" height="46" rx="8" fill="currentColor" fill-opacity="${(0.06 + i * 0.07).toFixed(2)}" stroke="currentColor" stroke-width="2"/>
    <text x="102" y="${72 + i * 56}" text-anchor="middle" font-size="22" font-weight="800" fill="currentColor">${s}</text>
    <text x="150" y="${71 + i * 56}" font-size="17" style="fill:var(--muted)">${t}</text>`).join('')}
    <path d="M40 48V306" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M31 292l9 16l9 -16" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
    <text x="26" y="180" text-anchor="middle" font-size="15" fill="currentColor" transform="rotate(-90 26 180)">más metálico</text>
  </svg>`;
  const MUNDO_EN = {
    hecho: 'De arriba abajo, el grupo 14 se vuelve metal',
    parrafos: [
      'El grupo 14 empieza en el carbono, que como diamante no conduce la electricidad. Le siguen el silicio y el germanio, que conducen a medias, y por eso los chips del celular son de silicio. Abajo están el estaño de la mina San Rafael, en Antauta (Puno), y el plomo de las baterías de auto, dos metales que sí conducen.',
      ['En un metal, cada átomo suelta con facilidad sus electrones de afuera, y esos electrones sueltos son los que llevan la corriente. Hacia abajo en el grupo, cada átomo tiene un nivel más y sus electrones de afuera quedan más lejos del núcleo, así que el carácter metálico crece:',
        { linea: ['carácter metálico: C < Si < Ge < Sn < Pb'] }],
      ['Por eso la misma columna que empieza con un aislante termina con dos metales que se usan en la soldadura de los circuitos y en las baterías.'],
    ],
    figura: { svg: SVG_G14, alt: 'La columna del grupo 14 de arriba abajo: el carbono como diamante no conduce, el silicio y el germanio son semiconductores y el estaño y el plomo son metales que conducen. Una flecha hacia abajo dice «más metálico».' },
    pregunta: {
      texto: 'En la cima del grupo 15 está el nitrógeno, un gas que no conduce la electricidad. ¿Qué esperas del bismuto, cuatro filas más abajo en esa columna?',
      opciones: [
        { id: 'c', texto: 'Es un metal y conduce la electricidad', correcta: true },
        { id: 'igual', texto: 'Es un gas, como el nitrógeno de su columna', error: 'QM-MISMO-GRUPO',
          siFuera: 'Es cierto que los elementos de una columna se parecen, porque tienen el mismo número de electrones en su último nivel. Pero hacia abajo crece el carácter metálico, y el bismuto está cuatro filas más abajo que el nitrógeno.' },
        { id: 'protones', texto: 'Es un no metal: sus 83 protones retienen sus electrones', error: 'QM-EI-PROTONES',
          siFuera: 'Es cierto que el bismuto tiene muchos más protones que el nitrógeno. Pero sus electrones de afuera están cuatro niveles más lejos, y los electrones de adentro tapan buena parte de esa carga, así que se sueltan con facilidad.' },
      ],
      porque: 'El carácter metálico crece hacia abajo en un grupo: el bismuto tiene cuatro niveles más que el nitrógeno, sus electrones de afuera se sueltan con facilidad y por eso es un metal.',
    },
    fuente: 'Propiedades del grupo 14: LibreTexts; mina de estaño San Rafael (Antauta, Puno): Minsur, en Gestión y Energiminas.',
  };
  const electroneg = {
    id: 'electronegatividad',
    titulo: 'Electronegatividad y carácter metálico',
    pregunta: '¿Quién se queda con el par que comparten dos átomos?',
    temas: ['Electronegatividad'],
    pieza: 'quim-tabla',
    aprendizaje: 'La electronegatividad dice quién jala más el par compartido de un enlace; crece hacia el flúor. El carácter metálico crece al revés.',
    actividad: 'Armar enlaces de dos átomos y ver hacia cuál se corre el par.',
    lee: {
      tarjetas: [
        { titulo: 'Dos que jalan una soga', texto: 'Dos personas jalan una soga que tiene un nudo al medio, y si una jala más fuerte, el nudo se acerca a ella. Algo parecido pasa entre dos átomos unidos.',
          pieza: 'quim-tira', dibujo: OBJ([{ que: 'soga', nombre: 'el nudo, al medio' }]) },
        { titulo: 'El par compartido', texto: 'Cuando dos átomos se unen compartiendo electrones, queda un par de electrones entre los dos: es el nudo de la soga. En cada molécula de agua, cada hidrógeno comparte un par con el oxígeno.' },
        { titulo: 'Una escala de números', texto: 'La electronegatividad, EN, dice cuánto jala cada átomo ese par. Linus Pauling la puso en una escala de números en 1932, sin unidades. La soga es solo una comparación, porque los átomos no tienen manos.' },
        { titulo: 'Qué mirar', texto: 'En el juego eliges dos átomos. La barra más alta es la del que jala más, y la diferencia entre las dos, ΔEN, dice cuánto se corre el par.', ecuacion: ['ΔEN = mayor − menor'] },
      ],
    },
    ejemplos: EJEMPLOS_EN,
    juega: {
      pieza: 'quim-tabla',
      consigna: 'Elige los dos átomos de un enlace. Las barras son su electronegatividad; la lectura dice hacia quién se corre el par de electrones que comparten.',
      mision: {
        texto: 'Arma el enlace con la mayor diferencia de electronegatividad que puedas.',
        logrado: v => Math.abs(delta(+v.a, +v.b) - MAXD) < 1e-9,
        bien: 'En el enlace K–F, el par se corre casi del todo hacia el flúor.',
      },
      voz: 'Mira cuál de los dos tiene la barra más alta.',
      leyenda: [
        { s: ENf, t: 'electronegatividad, en la escala de Pauling' },
        { s: 'ΔEN', t: 'diferencia: el mayor menos el menor' },
        { s: 'barra', t: 'más alta: jala más el par' },
        { s: 'par', t: 'los dos electrones que comparten los átomos' },
        { s: 'sin barra', t: 'gas noble: no tiene valor en la escala' },
      ],
      controles: [
        { id: 'a', etiqueta: 'Primer átomo', opciones: JUEGO_A.map(z => ({ valor: String(z), texto: SIMB[z] })), inicio: '1' },
        { id: 'b', etiqueta: 'Segundo átomo', opciones: JUEGO_B.map(z => ({ valor: String(z), texto: SIMB[z] })), inicio: '17' },
      ],
      dibujo: v => barrasEN(TODOS, { marcadas: [{ Z: +v.a, color: 'f' }, { Z: +v.b, color: 'f' }], rotulo: `${SIMB[+v.a]}–${SIMB[+v.b]}: ΔEN = ${f2(delta(+v.a, +v.b))}` }),
      lectura: v => { const a = +v.a, b = +v.b, m = EN[a] > EN[b] ? a : b, o = m === a ? b : a; return ['ΔEN = ', Ne(enTxt(m)), ' − ', Ne(enTxt(o)), ' = ', Ne(f2(delta(a, b))), `: el par de electrones va hacia el ${SIMB[m]}.`]; },
      minimo: 4,
    },
    predice: {
      pieza: 'quim-tabla',
      pregunta: 'El flúor es el elemento más electronegativo. ¿Qué dice eso de un átomo de flúor aislado, sin enlaces?',
      datos: ['Flúor: EN = 3,98, la mayor de la escala de Pauling'],
      voz: 'Piensa dónde se mide la electronegatividad.',
      opciones: [
        { id: 'c', texto: 'Nada por sí solo: solo cuenta cuando forma un enlace', correcta: true },
        { id: 'carga', texto: 'Que tiene carga negativa', error: 'TP8', siFuera: 'Sería cierto si fuera el ion F⁻. El átomo aislado es neutro, con 9 protones y 9 electrones: «electronegativo» no quiere decir «negativo», sino que jala mucho el par de un enlace.' },
        { id: 'mas-e', texto: 'Que tiene más electrones que protones', error: 'TP8-E', siFuera: 'Sería cierto si fuera un anión, como el F⁻. La electronegatividad no cuenta electrones de más: habla del par que se comparte en un enlace.' },
        { id: 'afinidad', texto: 'Que libera mucha energía al ganar un electrón', error: 'QM-EN-AFINIDAD', siFuera: 'Eso describe la afinidad electrónica, que se mide en kJ/mol con el átomo solo. La electronegatividad no tiene unidades y habla de un enlace.' },
      ],
      dibujo: tabla({ marcadas: [{ Z: 9, color: 'f' }] }),
      revelar: barrasEN(TODOS, { marcadas: [{ Z: 9, color: 'f' }], rotulo: 'F: 3,98, el mayor; sin dato en He, Ne, Ar, Kr' }),
      coincide: 'Coincide: la electronegatividad describe un enlace, no una carga.',
      noCoincide: 'La electronegatividad se mide dentro de un enlace; el átomo de F aislado es neutro.',
    },
    mira: {
      pieza: 'quim-molecula',
      datos: {
        atomos: [{ id: 'h', t: 'H', x: -1, y: 0, desde: 1 }, { id: 'cl', t: 'Cl', x: 1, y: 0, color: 'f', desde: 1 }],
        enlaces: [{ a: 'h', b: 'cl', desde: 1 }],
        pares: [{ en: 'cl', ang: 0, desde: 1 }, { en: 'cl', ang: -90, desde: 1 }, { en: 'cl', ang: 90, desde: 1 }],
        cargas: [{ en: 'h', t: 'δ+', ang: -90, desde: 2 }, { en: 'cl', t: 'δ−', ang: -150, color: 'f', desde: 2 }],
        escala: 75, alto: 150,
        alt: 'Molécula de HCl: el par del enlace se corre hacia el cloro, que queda con carga parcial negativa; el hidrógeno, con carga parcial positiva.',
      },
      voz: 'Veamos qué hace la diferencia dentro de un enlace.',
      pasos: [
        { estado: { corte: 1 }, texto: 'El H y el Cl comparten un par de electrones, como las dos personas que jalan la soga.', ecuacion: [Ne('EN (H) = 2,20'), SEP, Ne('EN (Cl) = 3,16')] },
        { estado: { corte: 2 }, texto: 'El Cl jala más, así que el par se le acerca y el cloro queda con una carga parcial negativa, δ−.', ecuacion: ['ΔEN = 3,16 − 2,20 = ', Ne('0,96')] },
        { estado: { corte: 2 }, texto: 'El cloro suelto no tiene carga: la δ− aparece solo dentro del enlace.', ecuacion: ['Cl aislado: 17 p⁺, 17 e⁻'] },
        { estado: { corte: 2 }, texto: 'La electronegatividad crece hacia arriba, porque el par queda más cerca del núcleo, y hacia la derecha, porque hay más protones: el máximo es el flúor.', ecuacion: ['F: ', Ne('3,98'), ', la mayor'] },
        { estado: { corte: 2 }, texto: 'El carácter metálico, qué tan fácil pierde electrones un elemento, crece al revés: hacia abajo y a la izquierda, donde el electrón de afuera está más lejos o menos jalado.', ecuacion: ['K más metálico que Na; Na más que Cl'] },
        { estado: { corte: 2 }, texto: 'Juntas, las tendencias periódicas quedan así: el radio y el carácter metálico crecen hacia abajo y a la izquierda.', ecuacion: ['EI y ', ENf, ': hacia arriba a la derecha'] },
      ],
    },
    regla: {
      texto: 'La electronegatividad, EN, dice cuánto jala un átomo el par de un enlace: crece hacia arriba y a la derecha, hasta el flúor. El par se corre hacia el de mayor EN, y más cuanto mayor es la diferencia, ΔEN. El carácter metálico, qué tan fácil pierde electrones un elemento, crece al revés: el potasio supera al cloro.',
      ecuacion: ['ΔEN = ', ENf, ' (mayor) − ', ENf, ' (menor)', SEP, 'el par va al de mayor ', ENf, SEP, 'carácter metálico: crece hacia abajo y a la izquierda'],
      condicion: 'se usa una sola escala, la de Pauling, que no tiene unidades, y se habla de átomos unidos: un átomo solo no tiene par que jalar, y los gases nobles, que casi no se unen, no tienen valor.',
      voz: 'Electronegativo no es negativo: es quien jala más.',
      dibujo: barrasEN(TODOS),
    },
    mundo: MUNDO_EN,
    resuelve: {
      pieza: 'quim-tabla',
      generar(s) {
        const [[a, b], [c, d]] = PARES_EN_R[s % PARES_EN_R.length], d1 = delta(a, b), d2 = delta(c, d), gana = d1 > d2 ? [a, b] : [c, d];
        const tx = (x, y) => `${SIMB[x]}–${SIMB[y]}`, ms = (x, y) => (EN[x] > EN[y] ? [x, y] : [y, x]);
        const cuenta = (x, y) => { const [m, o] = ms(x, y); return [`${tx(x, y)}: ${enTxt(m)} − ${enTxt(o)} = `, Ne(f2(delta(x, y)))]; };
        const zs = [...new Set([a, b, c, d])];
        return {
          enunciado: `¿En cuál enlace se corre más el par compartido: en ${tx(a, b)} o en ${tx(c, d)}? ¿Hacia qué átomo?`,
          datos: [`EN: ${zs.map(z => `${SIMB[z]} ${enTxt(z)}`).join('; ')}`, D.delta],
          dibujo: barrasEN(zs, { marcadas: zs.map(Z => ({ Z, color: 'f' })) }),
          pasos: [
            { tipo: 'pide', texto: 'Piden comparar dos enlaces: en cuál se corre más el par y hacia qué átomo.' },
            { tipo: 'datos', texto: 'Tengo la electronegatividad de cada átomo, en la escala de Pauling.' },
            { tipo: 'regla', texto: 'El par se corre hacia el de mayor electronegatividad; cuanto mayor es ΔEN, más se corre.' },
            { tipo: 'cuentas', texto: 'Calculo la diferencia de cada enlace: el valor mayor menos el menor.', ecuacion: [...cuenta(a, b), SEP, ...cuenta(c, d)] },
            { tipo: 'sentido', texto: `Se corre más el par del enlace ${tx(...gana)}, que tiene ΔEN = ${f2(Math.max(d1, d2))}, y se corre hacia el ${SIMB[ms(...gana)[0]]}, el de la barra más alta.` },
          ],
          respuesta: ['En ', Ne(tx(...gana)), `, hacia el ${SIMB[ms(...gana)[0]]}`],
        };
      },
    },
    ahoraTu: {
      pieza: 'quim-tabla',
      voz: 'Compara: ¿quién jala más?',
      generar(sem) {
        const r = azar(sem * 79 + 3), tipo = sem % 5;
        if (tipo === 4) return vfDe(r, AFIRMA_E, [DE.en, DE.metal]);
        return [casoHacia, casoDelta, casoTrioEN, casoMetal][tipo](r);
      },
    },
  };

  // ---------- Laboratorio ----------
  // Las tres propiedades de la unidad, con su escala y el color del mapa, sobre los 36 elementos.
  const PROPS = {
    r: { tabla: RADIO, max: 245, forma: 'circulo', color: 'i', nombre: 'radio (pm)', unidad: 'pm', dec: 0, v: Rr('r') },
    ei: { tabla: EI, max: 2400, forma: 'barra', color: 'h', nombre: 'EI (kJ/mol)', unidad: 'kJ/mol', dec: 0, v: EIf },
    en: { tabla: EN, max: 4, forma: 'barra', color: 'f', nombre: 'EN (Pauling)', unidad: '', dec: 2, v: ENf },
  };
  const OP_PROPS = [{ valor: 'r', texto: 'Radio' }, { valor: 'ei', texto: 'Ionización' }, { valor: 'en', texto: 'Electronegatividad' }];
  const valorDe = (k, z) => { const P = PROPS[k], x = P.tabla[z]; return x === null ? 'sin dato' : `${P.dec ? f(x, P.dec) : x}${P.unidad ? ` ${P.unidad}` : ''}`; };
  const tablaProp = (k, marcadas) => { const P = PROPS[k]; return tabla({ propiedad: { valores: valores(P.tabla, TODOS), max: P.max, forma: P.forma, color: P.color, nombre: P.nombre }, marcadas }); };
  const conDato = t => TODOS.map(z => t[z]).filter(x => x !== null);
  const MAYOR = { r: Math.max(...conDato(RADIO)), ei: Math.max(...conDato(EI)), dif: Math.max(...conDato(EN)) - Math.min(...conDato(EN)) };
  const MENOR4 = Math.min(...TODOS.filter(z => lugar(z).periodo === 4).map(z => RADIO[z]));
  const SIMBV = z => (z >= 21 && z <= 30 ? `${SIMB[z]} (d)` : SIMB[z]);

  return {
    unidad: 'quimica.propiedades-periodicas',
    version: '0.3.0',
    // Pasó el lector en frío y el auditor (19 nov): calidad 2, y el validador común lo exige.
    calidad: 2,
    colores: COLORES,
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/quim-tabla.js', '/nucleo/kit/piezas/quim-tira.js', '/nucleo/kit/piezas/quim-molecula.js'],
    // Tabla de letras (propuesta §7; regla letras-datos).
    letras: { Z: 'número atómico', r: 'radio (atómico o iónico)', X: 'un elemento sin nombre', Q: 'un elemento sin nombre', R: 'un elemento sin nombre', e: 'electrón', g: 'en estado gaseoso' },
    historia: {
      texto: 'En 1932, Linus Pauling propuso una escala de números para comparar cuánto atrae cada átomo los electrones de un enlace. Para entonces ya se medían el tamaño de los átomos y la energía para arrancarles un electrón. Puestos sobre la tabla, esos valores dibujan tendencias, con excepciones que los datos dejan a la vista.',
      pregunta: '¿Por qué un átomo con más protones puede ser más pequeño?',
      fuente: { titulo: 'OpenStax, Chemistry 2e, §6.5', url: 'https://openstax.org/books/chemistry-2e/pages/6-5-periodic-variations-in-element-properties' },
    },
    // Glosario (docs/teoria.md §4d): las palabras que la unidad estrena en el curso. Cada idea estrena de 2 a 3 con
    // `simple` y 3 ejemplos. Ninguna dice cómo cambia el radio en un periodo (idea 1), cuál es el mayor de la serie del
    // neón (idea 2), el orden del fósforo y el azufre (idea 3) ni qué dice la electronegatividad de un átomo solo (idea 4).
    glosario: [
      { termino: 'radio atómico', formas: ['radio atómico', 'radios atómicos'], medida: 'pm',
        def: 'Tamaño de un átomo: la mitad de la distancia entre dos núcleos iguales unidos, o el valor calculado.',
        simple: 'Cuánto mide un átomo desde su centro, como el radio de una pelota.',
        ejemplos: ['El potasio: 243 pm.', 'El litio (167 pm) es menor que el potasio.', 'El helio: 31 pm, el menor de todos.'], ver: ['carga nuclear', 'picómetro'] },
      { termino: 'picómetro', simbolo: 'pm', formas: ['picómetro', 'picómetros'], def: 'Unidad de longitud para medir átomos: la billonésima parte de un metro.',
        simple: 'Una medida tan chica que en un milímetro caben mil millones.',
        ejemplos: ['1 pm = 0,000 000 000 001 m.', '1 nm = 1000 pm.', 'El flúor mide 42 pm.'], ver: ['radio atómico'] },
      { termino: 'carga nuclear', formas: ['carga nuclear'], def: 'Carga positiva del núcleo, igual a su número de protones: es la que atrae a los electrones.',
        simple: 'La carga positiva del núcleo, que suma una unidad por cada protón.',
        ejemplos: ['El sodio tiene carga nuclear +11.', 'El cloro, +17.', 'El potasio tiene más que el sodio y es mayor: tiene un nivel más.'], ver: ['protón', 'radio atómico'] },
      { termino: 'radio iónico', formas: ['radio iónico', 'radios iónicos'], medida: 'pm', def: 'Tamaño de un ion, medido en cristales; sus valores vienen de una tabla distinta a la de los radios atómicos.',
        simple: 'Cuánto mide un ion, un átomo que ganó o perdió electrones.',
        ejemplos: ['Na⁺: 102 pm.', 'Cl⁻: 181 pm.', 'K⁺: 138 pm.'], ver: ['radio atómico', 'catión', 'anión'] },
      { termino: 'serie isoelectrónica', formas: ['serie isoelectrónica', 'series isoelectrónicas', 'serie del argón', 'serie del neón'],
        def: 'Grupo de átomos e iones que tienen el mismo número de electrones.',
        simple: 'Átomos e iones con la misma cantidad de electrones, aunque sus núcleos sean distintos.',
        ejemplos: ['S²⁻, Cl⁻, Ar, K⁺ y Ca²⁺: 18 electrones cada uno.', 'Se²⁻, Br⁻, Kr y Rb⁺: 36 cada uno.', 'Na⁺ y Ne: 10 cada uno.'], ver: ['isoelectrónico'] },
      { termino: 'energía de ionización', simbolo: 'EI', medida: 'kJ/mol', formas: ['energía de ionización', 'energías de ionización', 'ionización'],
        def: 'Energía para arrancar el electrón más externo de un átomo aislado, en estado gaseoso.',
        simple: 'Lo que cuesta quitarle un electrón a un átomo: cuanto más, mejor lo retiene.',
        ejemplos: ['Sodio: 496 kJ/mol.', 'Cloro: 1251 kJ/mol.', 'Helio: 2372 kJ/mol, la mayor.'], ver: ['afinidad electrónica'] },
      { termino: 'afinidad electrónica', simbolo: 'AE', medida: 'kJ/mol', formas: ['afinidad electrónica', 'afinidades electrónicas', 'afinidad'],
        def: 'Energía en juego cuando un átomo aislado, en estado gaseoso, gana un electrón. Es negativa si se libera.',
        simple: 'La energía que se libera o se gasta cuando un átomo gana un electrón.',
        ejemplos: ['Cloro: −349 kJ/mol.', 'Flúor: −328 kJ/mol.', 'Sodio: −53 kJ/mol.'], ver: ['energía de ionización', 'electronegatividad'] },
      { termino: 'energías de ionización sucesivas', formas: ['energías de ionización sucesivas', 'energías sucesivas', 'EI sucesivas'],
        def: 'Las energías para arrancar, uno tras otro, el primer electrón, el segundo, el tercero… de un mismo átomo.',
        simple: 'Lo que cuesta cada electrón al sacarlos uno por uno; cada uno cuesta más.',
        ejemplos: ['Litio: 520, 7298 y 11 815 kJ/mol.', 'Calcio: 590, 1145 y 4912 kJ/mol.', 'Cada una es mayor que la anterior.'], ver: ['energía de ionización'] },
      { termino: 'electronegatividad', simbolo: 'EN', formas: ['electronegatividad', 'electronegatividades', 'electronegativo', 'electronegativos'],
        def: 'Cuánto atrae un átomo los electrones que comparte con otro. Sin unidades; la escala más usada es la de Pauling.',
        simple: 'Cuánto jala un átomo los electrones que comparte, como quien jala una soga.',
        ejemplos: ['Oxígeno: 3,44.', 'Potasio: 0,82.', 'Carbono: 2,55 e hidrógeno: 2,20.'], ver: ['afinidad electrónica', 'par compartido'] },
      { termino: 'par compartido', formas: ['par compartido', 'pares compartidos', 'par de electrones compartido'],
        def: 'Los dos electrones que comparten dos átomos unidos: los atraen los dos núcleos.',
        simple: 'Dos electrones que quedan entre dos átomos unidos y los mantienen juntos.',
        ejemplos: ['Cada enlace O–H del agua tiene uno.', 'El H–Cl tiene uno.', 'El metano tiene cuatro, uno por cada C–H.'], ver: ['electronegatividad'] },
      { termino: 'tendencia periódica', formas: ['tendencia periódica', 'tendencias periódicas'],
        def: 'Cómo cambia una propiedad al recorrer la tabla por un grupo o un periodo. Tiene excepciones.',
        simple: 'Hacia dónde crece una propiedad en la tabla, aunque tenga excepciones.',
        ejemplos: ['El radio crece hacia abajo en un grupo.', 'La energía de ionización crece hacia arriba en un grupo.', 'El carácter metálico crece hacia abajo.'], ver: ['periodo', 'grupo'] },
    ],
    // Laboratorio (docs/teoria.md §4b): mesas sin preguntas. La primera da las tres propiedades de un elemento a la
    // vez, del H al Kr; la segunda pone dos elementos lado a lado, cada uno con su casilla arrastrable.
    laboratorio: [
      {
        id: 'tres-propiedades', titulo: 'Un elemento, tres propiedades', pieza: 'quim-tabla',
        consigna: 'La casilla recorre la tabla sola, también los de transición. Cambia la propiedad del fondo; pausa o arrastra la casilla para comparar vecinos.',
        controles: [
          { id: 'z', etiqueta: 'Z', color: 'c-o', min: 1, max: 36, paso: 1, inicio: 11, decimales: 0, auto: { velocidad: 1.5 } },
          { id: 'p', etiqueta: 'Propiedad', opciones: OP_PROPS },
        ],
        dibujo: v => tablaProp(v.p, [{ Z: zr(v).z, color: PROPS[v.p].color }]),
        lectura: v => { v = zr(v); return [`${SIMBV(v.z)}: `, Rr('r'), ` ${valorDe('r', v.z)} · `, EIf, ` ${valorDe('ei', v.z)} · `, ENf, ` ${valorDe('en', v.z)}`]; },
        arrastres: [{ id: 'casilla', etiqueta: 'casilla marcada: llévala a otro elemento', color: 'c-o',
          donde: v => enCasilla(zr(v).z),
          mover: (pt, v) => ({ z: zBajo(pt, zr(v).z) }) }],
        invitaciones: [
          { texto: 'Busca el átomo más grande de toda la tabla.', logrado: v => RADIO[v.z] === MAYOR.r, bien: 'Abajo y a la izquierda: tiene más niveles, y su electrón de afuera queda lejos.' },
          { texto: 'Con la ionización de fondo, ve al elemento al que más cuesta arrancarle un electrón.', logrado: v => v.p === 'ei' && EI[v.z] === MAYOR.ei, bien: 'Arriba a la derecha: el helio guarda sus dos electrones muy cerca del núcleo.' },
          { texto: 'Busca el átomo más pequeño del periodo 4.', logrado: v => lugar(v.z).periodo === 4 && RADIO[v.z] === MENOR4, bien: 'Está al final del periodo: el mismo nivel, jalado por más protones.' },
          { texto: 'Guarda dos elementos del mismo grupo, en periodos distintos.',
            logrado: (v, guardados) => guardados.some(a => guardados.some(b => lugar(a.z).grupo === lugar(b.z).grupo && lugar(a.z).periodo !== lugar(b.z).periodo)),
            bien: 'Compara sus radios: ¿el de abajo siempre es más grande?' },
        ],
      },
      {
        id: 'dos-elementos', titulo: 'Dos elementos lado a lado', pieza: 'quim-tabla',
        consigna: 'Arrastra las dos casillas a dos elementos y elige la propiedad. Busca un par que rompa la tendencia.',
        controles: [
          { id: 'a', etiqueta: 'Primero', color: 'c-o', min: 1, max: 36, paso: 1, inicio: 7, decimales: 0 },
          { id: 'b', etiqueta: 'Segundo', color: 'c-o', min: 1, max: 36, paso: 1, inicio: 8, decimales: 0 },
          { id: 'p', etiqueta: 'Propiedad', opciones: OP_PROPS, inicio: 'ei' },
        ],
        dibujo: v => tablaProp(v.p, [{ Z: v.a, color: PROPS[v.p].color }, { Z: v.b, color: PROPS[v.p].color }]),
        lectura: v => [PROPS[v.p].v, `: ${SIMBV(v.a)} ${valorDe(v.p, v.a)} · ${SIMBV(v.b)} ${valorDe(v.p, v.b)}`],
        arrastres: [
          { id: 'primero', etiqueta: 'casilla del primer elemento', color: 'c-o', donde: v => enCasilla(v.a), mover: (pt, v) => ({ a: zBajo(pt, v.a) }) },
          { id: 'segundo', etiqueta: 'casilla del segundo elemento', color: 'c-o', donde: v => enCasilla(v.b), mover: (pt, v) => ({ b: zBajo(pt, v.b) }) },
        ],
        invitaciones: [
          { texto: 'En el periodo 3, busca dos vecinos donde la ionización baje hacia la derecha.',
            logrado: v => v.p === 'ei' && v.b === v.a + 1 && lugar(v.a).periodo === 3 && lugar(v.b).periodo === 3 && EI[v.b] < EI[v.a],
            bien: 'Aquí la tendencia falla: mira si el segundo pierde su primer electrón p o uno apareado.' },
          { texto: 'Con el radio de fondo, pon el segundo justo debajo del primero, en su grupo.',
            logrado: v => v.p === 'r' && lugar(v.a).grupo === lugar(v.b).grupo && lugar(v.b).periodo === lugar(v.a).periodo + 1,
            bien: 'Un nivel más abajo, un átomo más grande. ¿Pasa en todos los grupos?' },
          { texto: 'Busca el par con la mayor diferencia de electronegatividad.',
            logrado: v => v.p === 'en' && EN[v.a] !== null && EN[v.b] !== null && Math.abs(EN[v.a] - EN[v.b]) === MAYOR.dif,
            bien: 'Tan distintos que uno se quedaría con los electrones del otro.' },
          { texto: 'Encuentra dos elementos distintos con la misma electronegatividad.',
            logrado: v => v.p === 'en' && v.a !== v.b && EN[v.a] !== null && EN[v.a] === EN[v.b],
            bien: 'Jalan los electrones igual, aunque estén lejos en la tabla.' },
        ],
      },
    ],
    laboratorioIdeas: {
      'tres-propiedades': ['radio-atomico-ionico', 'energia-ionizacion', 'electronegatividad'],
      'dos-elementos': ['radio-atomico-ionico', 'energia-ionizacion', 'electronegatividad'],
    },
    ideas: [radio, radioIonico, ionizacion, electroneg],
  };
});
