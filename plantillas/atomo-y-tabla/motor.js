/*
 * Motor de El átomo y la tabla periódica.
 *
 * Aquí vive toda la química de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el
 * navegador (window.MotorAtomo) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * Qué calcula: las partículas de un átomo o ion (Z, A y carga → protones, neutrones, electrones); la
 * configuración electrónica, completa y abreviada con el gas noble; el diagrama de cajas (Hund y Pauli), los
 * electrones desapareados y el paramagnetismo; cationes, aniones y especies isoelectrónicas; los números
 * cuánticos del último electrón y del electrón que sale al ionizar; la ubicación en la tabla (período, grupo
 * IUPAC 1 a 18, grupo con A y B como en las academias peruanas, bloque); las tendencias con datos de tabla para
 * Z = 1 a 36; ordenar una lista por una propiedad; radios de iones y series isoelectrónicas; y las energías de
 * ionización sucesivas del Na, el Mg y el Al.
 *
 * Convenciones (docs/investigacion/atomo-enlace-ideas-erroneas.md, "Casos de prueba propuestos"):
 *  - Llenado por la regla de Möller: por n + l y, a igual n + l, por n (1s 2s 2p 3s 3p 4s 3d 4p 5s 4d 5p 6s 4f…).
 *  - Excepciones: solo Cr (4s¹ 3d⁵) y Cu (4s¹ 3d¹⁰) en el período 4, las que pide el CEPRE; Mo, Ag y Au siguen el
 *    mismo patrón (un electrón del s pasa al d) y también se declaran. Ninguna otra: el motor no generaliza la
 *    "excepción" (el Ni es 4s² 3d⁸: su configuración 3d⁹ 4s¹ está a solo 0,03 eV, pero NIST da 3d⁸ 4s² como estado
 *    fundamental). Para Z > 36 es la regla de academia; varios elementos reales de los
 *    períodos 5 y 6 (Nb, Ru, Rh, Pd, Pt, La…) tienen otras configuraciones que el motor no modela.
 *  - La configuración se escribe en el orden de llenado (Möller), también en los iones: "[Ar] 4s2 3d6".
 *    La abreviada usa el gas noble más grande con MENOS electrones que la especie (Ar: [Ne] 3s2 3p6; Br⁻:
 *    [Ar] 4s2 3d10 4p6, y 'igualA' dice "Kr").
 *  - Cationes: salen primero los electrones de mayor n y, a igual n, los de mayor l (los 4s antes que los 3d,
 *    aunque se llenen antes). Aniones: los electrones se agregan siguiendo el orden de Möller.
 *  - Cajas: los orbitales de una subcapa van de mₗ = −l (izquierda) a mₗ = +l (derecha); primero se pone una
 *    flecha hacia arriba (mₛ = +1/2) en cada caja, de izquierda a derecha, y luego las flechas hacia abajo
 *    (mₛ = −1/2) en el mismo orden (Hund y Pauli). El último electrón es el último de la última subcapa escrita.
 *    Ejemplos: O (2p⁴) → n = 2, l = 1, mₗ = −1, mₛ = −1/2; Fe (3d⁶) → 3, 2, −2, −1/2. Otras academias llenan de
 *    +l a −l o empiezan por −1/2: entonces mₗ y mₛ cambian de signo.
 *  - Al ionizar, sale el último electrón que entró en la subcapa de afuera (el inverso de Hund): en el S (3p⁴)
 *    es el que estaba apareado; en el P (3p³), uno solo en su caja.
 *
 * Datos de tabla (solo Z = 1 a 36):
 *  - Primera energía de ionización, en kJ/mol: las energías de NIST (Atomic Spectra Database, "Ground levels
 *    and ionization energies", en eV) por 96,485 kJ/mol por eV, redondeadas a entero.
 *  - Energías de ionización sucesivas del Na, el Mg y el Al, en kJ/mol redondeadas a entero, de las mismas
 *    energías de NIST (como las reproduce la tabla "Molar ionization energies of the elements").
 *  - Radio atómico, en pm, una sola escala: los radios calculados de Clementi, Raimondi y Reinhardt, "Atomic
 *    screening constants from SCF functions. II", J. Chem. Phys. 47, 1300 (1967), tal como los reproduce la tabla de
 *    radios atómicos de los elementos (columna "calculado"). Los libros de academia usan radios medidos. Es la escala que
 *    baja sin saltos en cada período, también en los gases nobles. Otras tablas (covalente, metálico) dan otros
 *    números con el mismo orden en los grupos principales.
 *  - Radio iónico, en pm: Shannon (1976), número de coordinación 6, solo para algunos iones. No se compara
 *    con el radio atómico: son escalas distintas; un átomo contra su ion se compara con la regla.
 *  - Electronegatividad de Pauling (valores revisados de Allred, 1961, como en la tabla del CRC). He, Ne, Ar y
 *    Kr quedan sin valor (algunas tablas dan 3,00 al Kr).
 *  Verificar contra la tabla del libro que se use: los libros de academia redondean distinto, pero el orden
 *  de los casos de prueba es el mismo.
 *
 * Errores típicos que devuelven las funciones (campo 'errores'), para armar las alternativas: restar la carga a
 * los neutrones, sumar la carga a los electrones, quitar los últimos electrones en llenarse (Fe³⁺ = [Ar] 4s2
 * 3d3), no aplicar o generalizar la excepción del Cr y el Cu, ordenar una serie isoelectrónica al revés o como
 * átomos neutros, y la "atracción repartida" (TP4) en la segunda ionización.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorAtomo = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const SIMBOLOS = Object.freeze(['', 'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S',
    'Cl', 'Ar', 'K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr',
    'Rb', 'Sr', 'Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn', 'Sb', 'Te', 'I', 'Xe', 'Cs', 'Ba',
    'La', 'Ce', 'Pr', 'Nd', 'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu', 'Hf', 'Ta', 'W', 'Re', 'Os',
    'Ir', 'Pt', 'Au', 'Hg', 'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn']);
  const ZMAX = SIMBOLOS.length - 1, ZTABLA = 36;
  const NOMBRES = Object.freeze(['', 'hidrógeno', 'helio', 'litio', 'berilio', 'boro', 'carbono', 'nitrógeno', 'oxígeno', 'flúor',
    'neón', 'sodio', 'magnesio', 'aluminio', 'silicio', 'fósforo', 'azufre', 'cloro', 'argón', 'potasio', 'calcio', 'escandio',
    'titanio', 'vanadio', 'cromo', 'manganeso', 'hierro', 'cobalto', 'níquel', 'cobre', 'zinc', 'galio', 'germanio',
    'arsénico', 'selenio', 'bromo', 'kriptón']);
  // Índice = Z. Fuentes en la cabecera.
  const EI = Object.freeze([null, 1312, 2372, 520, 900, 801, 1086, 1402, 1314, 1681, 2081, 496, 738, 578, 787, 1012, 1000, 1251,
    1521, 419, 590, 633, 659, 651, 653, 717, 762, 760, 737, 745, 906, 579, 762, 944, 941, 1140, 1351]);
  const RADIO = Object.freeze([null, 53, 31, 167, 112, 87, 67, 56, 48, 42, 38, 190, 145, 118, 111, 98, 88, 79, 71, 243, 194,
    184, 176, 171, 166, 161, 156, 152, 149, 145, 142, 136, 125, 114, 103, 94, 88]);
  const EN = Object.freeze([null, 2.20, null, 0.98, 1.57, 2.04, 2.55, 3.04, 3.44, 3.98, null, 0.93, 1.31, 1.61, 1.90, 2.19, 2.58,
    3.16, null, 0.82, 1.00, 1.36, 1.54, 1.63, 1.66, 1.55, 1.83, 1.88, 1.91, 1.90, 1.65, 1.81, 2.01, 2.18, 2.55, 2.96, null]);
  const SUCESIVAS = Object.freeze({ Na: [496, 4562, 6910, 9543], Mg: [738, 1451, 7733, 10543], Al: [578, 1817, 2745, 11577] });
  const RADIO_IONICO = Object.freeze({ 'Li+': 76, 'Na+': 102, 'K+': 138, 'Mg2+': 72, 'Ca2+': 100, 'Al3+': 53.5,
    'F-': 133, 'Cl-': 181, 'Br-': 196, 'O2-': 140, 'S2-': 184 });
  const PROPIEDADES = Object.freeze({ ei: EI, radio: RADIO, en: EN });
  const GASES_NOBLES = [2, 10, 18, 36, 54, 86];
  // Excepciones declaradas: un electrón del s de afuera pasa al d de la capa anterior.
  const EXCEPCIONES = Object.freeze({ 24: 4, 29: 4, 42: 5, 47: 5, 79: 6 });
  const LETRA = 'spdf';

  // ---------- Elementos y especies ----------
  function zDe(x) {
    if (typeof x === 'number') {
      if (!Number.isInteger(x) || x < 1 || x > ZMAX) throw new Error(`Z fuera de rango (1 a ${ZMAX}): ${x}`);
      return x;
    }
    const z = SIMBOLOS.indexOf(String(x));
    if (z < 1) throw new Error(`elemento desconocido: ${x}`);
    return z;
  }
  function elemento(x) {
    const Z = zDe(x);
    return { Z, simbolo: SIMBOLOS[Z], nombre: NOMBRES[Z] || null };
  }
  // "Fe3+" → { Z: 26, carga: 3 }; "Cl-" → carga −1; "S2-" → −2; "Na" → 0.
  function especie(x) {
    if (typeof x === 'object' && x) return { Z: zDe(x.Z !== undefined ? x.Z : x.simbolo), carga: Number(x.carga) || 0 };
    const m = String(x).trim().match(/^([A-Z][a-z]?)(\d*)([+-]?)$/);
    if (!m || (m[2] && !m[3])) throw new Error(`no entiendo la especie: ${x}`);
    const Z = zDe(m[1]), q = m[3] ? (m[2] ? Number(m[2]) : 1) * (m[3] === '+' ? 1 : -1) : 0;
    return { Z, carga: q };
  }
  const nombreEspecie = (Z, q) => SIMBOLOS[Z] + (q === 0 ? '' : (Math.abs(q) === 1 ? '' : Math.abs(q)) + (q > 0 ? '+' : '-'));

  // ---------- Partículas ----------
  // Z protones; A − Z neutrones; Z − carga electrones (un catión perdió electrones, un anión los ganó).
  function particulas(o) {
    const Z = zDe(o.Z !== undefined ? o.Z : o.simbolo), A = Number(o.A), q = Number(o.carga) || 0;
    if (!Number.isInteger(A) || A < Z) throw new Error(`número de masa inválido: ${o.A}`);
    if (!Number.isInteger(q) || Z - q < 0) throw new Error(`carga inválida: ${o.carga}`);
    return { protones: Z, neutrones: A - Z, electrones: Z - q, A, carga: q,
      errores: { 'resta-carga-a-neutrones': A - Z - q, 'suma-carga-a-electrones': Z + q, 'ignora-la-carga': Z } };
  }

  // ---------- Configuración electrónica ----------
  const ORDEN = (() => {
    const r = [];
    for (let n = 1; n <= 7; n++) for (let l = 0; l < Math.min(n, 4); l++) r.push({ n, l });
    return r.sort((a, b) => (a.n + a.l) - (b.n + b.l) || a.n - b.n);
  })();
  const capacidad = l => 2 * (2 * l + 1);
  const nombreSub = s => `${s.n}${LETRA[s.l]}`;
  const clonar = c => c.map(s => ({ n: s.n, l: s.l, e: s.e }));
  const indiceMoller = s => ORDEN.findIndex(o => o.n === s.n && o.l === s.l);
  const ordenarMoller = c => c.filter(s => s.e > 0).sort((a, b) => indiceMoller(a) - indiceMoller(b));

  // Llenado de Möller puro, sin excepciones.
  function moller(e) {
    const r = []; let resto = e;
    for (const o of ORDEN) { if (resto <= 0) break; const k = Math.min(capacidad(o.l), resto); r.push({ n: o.n, l: o.l, e: k }); resto -= k; }
    if (resto > 0) throw new Error('demasiados electrones');
    return r;
  }
  function neutro(Z, sinExcepcion) {
    const c = moller(Z), n = EXCEPCIONES[Z];
    if (n && !sinExcepcion) {
      const s = c.find(x => x.n === n && x.l === 0), d = c.find(x => x.n === n - 1 && x.l === 2);
      s.e -= 1; d.e += 1;
    }
    return ordenarMoller(c);
  }
  // Quitar k electrones: primero los de mayor n y, a igual n, los de mayor l.
  function quitarDeAfuera(c, k) {
    const r = clonar(c);
    for (let i = 0; i < k; i++) {
      const vivos = r.filter(s => s.e > 0);
      if (!vivos.length) throw new Error('no quedan electrones que quitar');
      vivos.sort((a, b) => b.n - a.n || b.l - a.l)[0].e -= 1;
    }
    return ordenarMoller(r);
  }
  // Error: quitar los últimos en llenarse (al revés del orden de Möller).
  function quitarUltimos(c, k) {
    const r = ordenarMoller(clonar(c));
    for (let i = 0; i < k; i++) { const s = r.filter(x => x.e > 0).pop(); s.e -= 1; }
    return ordenarMoller(r);
  }
  // Agregar k electrones siguiendo el orden de Möller (aniones).
  function agregar(c, k) {
    const r = clonar(c);
    for (let i = 0; i < k; i++) {
      const o = ORDEN.find(x => { const s = r.find(y => y.n === x.n && y.l === x.l); return !s || s.e < capacidad(x.l); });
      const s = r.find(y => y.n === o.n && y.l === o.l);
      if (s) s.e += 1; else r.push({ n: o.n, l: o.l, e: 1 });
    }
    return ordenarMoller(r);
  }
  const texto = c => c.map(s => nombreSub(s) + s.e).join(' ');
  function abreviar(c) {
    const e = c.reduce((t, s) => t + s.e, 0);
    for (const g of GASES_NOBLES.filter(z => z < e).reverse()) {
      const nucleo = moller(g);
      const tiene = nucleo.every(x => c.some(s => s.n === x.n && s.l === x.l && s.e === x.e));
      if (!tiene) continue;
      const resto = c.filter(s => !nucleo.some(x => x.n === s.n && x.l === s.l));
      return { nucleo: SIMBOLOS[g], texto: `[${SIMBOLOS[g]}] ${texto(resto)}`, resto: resto.map(s => ({ ...s, nombre: nombreSub(s) })) };
    }
    return { nucleo: null, texto: texto(c), resto: c.map(s => ({ ...s, nombre: nombreSub(s) })) };
  }
  function desapareadosDe(c) {
    return c.reduce((t, s) => { const k = 2 * s.l + 1; return t + (s.e <= k ? s.e : 2 * k - s.e); }, 0);
  }
  function igualA(c) {
    const e = c.reduce((t, s) => t + s.e, 0);
    if (!GASES_NOBLES.includes(e)) return null;
    return texto(c) === texto(moller(e)) ? SIMBOLOS[e] : null;
  }
  function describir(c) {
    const ab = abreviar(c), d = desapareadosDe(c);
    return { texto: texto(c), abreviada: ab.texto, nucleo: ab.nucleo, desapareados: d, paramagnetico: d > 0, igualA: igualA(c) };
  }
  function configDe(Z, q) {
    const base = neutro(Z);
    if (q > 0) return quitarDeAfuera(base, q);
    if (q < 0) return agregar(base, -q);
    return base;
  }

  // Configuración de un átomo (carga 0) o de un ion. 'subcapas' en el orden en que se escriben.
  function configuracion(x, carga) {
    const sp = typeof x === 'string' && /[+-]$/.test(x) ? especie(x) : { Z: zDe(x), carga: Number(carga) || 0 };
    const { Z } = sp, q = sp.carga;
    if (!Number.isInteger(q) || Z - q < 0) throw new Error(`carga inválida: ${carga}`);
    if (Z - q > ZMAX + 4) throw new Error('demasiados electrones');
    const c = configDe(Z, q);
    const r = { Z, carga: q, especie: nombreEspecie(Z, q), electrones: Z - q, excepcion: !!EXCEPCIONES[Z],
      subcapas: c.map(s => ({ n: s.n, l: s.l, e: s.e, nombre: nombreSub(s) })), ...describir(c), errores: {} };
    const base = neutro(Z);
    if (q > 0) {
      r.errores['quita-los-ultimos-en-llenarse'] = abreviar(quitarUltimos(base, q)).texto;
      r.errores['no-resta-electrones'] = abreviar(base).texto;
      // El primero de la capa de afuera y el resto desde los últimos en llenarse (Fe³⁺ → [Ar] 4s1 3d4).
      r.errores['quita-uno-de-s'] = abreviar(quitarUltimos(quitarDeAfuera(base, 1), q - 1)).texto;
      // Quitar un solo electrón, aunque la carga pida más (Fe³⁺ → [Ar] 4s1 3d6).
      if (q > 1) r.errores['quita-solo-uno'] = abreviar(quitarDeAfuera(base, 1)).texto;
    }
    if (q === 0) {
      if (EXCEPCIONES[Z]) {
        const sin = neutro(Z, true);
        r.errores['sin-excepcion'] = abreviar(sin).texto;
        r.errores['sin-excepcion-desapareados'] = desapareadosDe(sin);
      } else {
        // Generalizar la "excepción" (TP5/TP6 de memoria): en un elemento d con ns², pasar un s al d (Ni → 4s1 3d9).
        const d = c.filter(s => s.l === 2).pop(), s = d && c.find(y => y.n === d.n + 1 && y.l === 0);
        if (d && s && s.e === 2 && d === c[c.length - 1] && d.e < 10) {
          const g = clonar(c); g.find(y => y.n === s.n && y.l === 0).e -= 1; g.find(y => y.n === d.n && y.l === 2).e += 1;
          r.errores['excepcion-generalizada'] = abreviar(g).texto;
          r.errores['excepcion-generalizada-desapareados'] = desapareadosDe(g);
        }
      }
    }
    return r;
  }

  // ---------- Cajas, números cuánticos ----------
  function cajasDe(s) {
    const k = 2 * s.l + 1, orb = [];
    for (let i = 0; i < k; i++) orb.push({ ml: -s.l + i, arriba: s.e > i, abajo: s.e > k + i });
    return orb;
  }
  // Diagrama de cajas de cada subcapa (solo las que tienen electrones; con 'abreviada', sin las del núcleo de gas noble).
  function cajas(x, carga, abreviada) {
    const r = configuracion(x, carga);
    const lista = abreviada ? abreviar(r.subcapas).resto : r.subcapas;
    return { nucleo: abreviada ? r.nucleo : null, subcapas: lista.map(s => ({ nombre: s.nombre, n: s.n, l: s.l, e: s.e, orbitales: cajasDe(s) })),
      desapareados: r.desapareados };
  }
  // Números cuánticos del i-ésimo electrón (desde 1) de una subcapa con la convención de la cabecera.
  function cuanticos(s, i) {
    const k = 2 * s.l + 1;
    return i <= k ? { n: s.n, l: s.l, ml: -s.l + i - 1, ms: 0.5 } : { n: s.n, l: s.l, ml: -s.l + i - k - 1, ms: -0.5 };
  }
  // El último electrón: el último de la última subcapa escrita.
  function ultimoElectron(x, carga) {
    const r = configuracion(x, carga), s = r.subcapas[r.subcapas.length - 1];
    return { subcapa: s.nombre, ...cuanticos(s, s.e) };
  }
  // El electrón que sale al quitar uno: de la subcapa de mayor n (y mayor l), el último que entró en ella.
  function electronQueSale(x, carga) {
    const r = configuracion(x, carga);
    if (!r.electrones) throw new Error('no quedan electrones');
    const s = [...r.subcapas].sort((a, b) => b.n - a.n || b.l - a.l)[0], k = 2 * s.l + 1;
    return { subcapa: s.nombre, ...cuanticos(s, s.e), apareado: s.e > k, electronesEnSubcapa: s.e };
  }
  // El electrón que entra al agregar uno a la especie con esta carga (de carga a carga − 1): el siguiente de Möller.
  function electronQueEntra(x, carga) {
    const Z = zDe(x), q = Number(carga) || 0, antes = configDe(Z, q), despues = configDe(Z, q - 1);
    const s = despues.find(d => { const a = antes.find(y => y.n === d.n && y.l === d.l); return !a || a.e < d.e; });
    return { subcapa: nombreSub(s), ...cuanticos(s, s.e), apareado: s.e > 2 * s.l + 1 };
  }
  // Los electrones que salen (o entran) al pasar de la carga 'desde' a la carga 'hasta', en orden.
  function secuencia(x, desde, hasta) {
    const Z = zDe(x), r = [];
    if (hasta > desde) for (let q = desde; q < hasta; q++) r.push({ tipo: 'sale', ...electronQueSale(Z, q) });
    else for (let q = desde; q > hasta; q--) r.push({ tipo: 'entra', ...electronQueEntra(Z, q) });
    return r;
  }
  // Tamaños para dibujar varias especies juntas (1 = la más grande). Con una sola tabla (radios atómicos de átomos
  // neutros, o radios iónicos de Shannon si todas están en ella) el dibujo va a escala ('aEscala'); si no, solo
  // respeta el orden que dan las reglas de compararRadio (cada una 0,8 de la anterior) y no es a escala.
  function escalasDibujo(lista) {
    const sp = lista.map(x => especie(x)), nom = sp.map(s => nombreEspecie(s.Z, s.carga));
    let v = null, fuente = null;
    if (sp.every(s => s.carga === 0 && s.Z <= ZTABLA)) { v = sp.map(s => RADIO[s.Z]); fuente = 'atomico'; }
    else if (nom.every(n => RADIO_IONICO[n] !== undefined)) { v = nom.map(n => RADIO_IONICO[n]); fuente = 'ionico'; }
    if (v) { const m = Math.max(...v); return { escalas: v.map(x => x / m), aEscala: true, fuente, pm: v }; }
    const orden = [...nom].sort((a, b) => { const c = compararRadio(a, b).mayor; return c === a ? -1 : c === b ? 1 : 0; });
    return { escalas: nom.map(n => Math.pow(0.8, orden.indexOf(n))), aEscala: false, fuente: 'reglas', pm: null };
  }
  // Electrones por nivel n (para dibujar las bandas): [2, 8, 13] para el Fe³⁺.
  function niveles(x, carga) {
    const r = configuracion(x, carga), max = Math.max(...r.subcapas.map(s => s.n), 0), out = [];
    for (let n = 1; n <= max; n++) out.push(r.subcapas.filter(s => s.n === n).reduce((t, s) => t + s.e, 0));
    return out;
  }

  // ---------- Ubicación en la tabla ----------
  const ROMANOS = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
  function ubicacion(x) {
    const Z = zDe(x), c = neutro(Z), periodo = Math.max(...c.map(s => s.n));
    const ultima = c[c.length - 1], bloque = LETRA[ultima.l];
    const e = (n, l) => (c.find(s => s.n === n && s.l === l) || { e: 0 }).e;
    let grupo;
    if (Z === 2) grupo = 18;
    else if (bloque === 's') grupo = e(periodo, 0);
    else if (bloque === 'p') grupo = 10 + e(periodo, 0) + e(periodo, 1);
    else if (bloque === 'd') grupo = e(periodo, 0) + e(periodo - 1, 2);
    else grupo = 3;
    let grupoAB;
    if (bloque === 'f') grupoAB = 'IIIB';
    else if (grupo <= 2) grupoAB = ROMANOS[grupo] + 'A';
    else if (grupo >= 13) grupoAB = ROMANOS[grupo - 10] + 'A';
    else if (grupo <= 7) grupoAB = ROMANOS[grupo] + 'B';
    else if (grupo <= 10) grupoAB = 'VIIIB';
    else grupoAB = ROMANOS[grupo - 10] + 'B';
    return { Z, simbolo: SIMBOLOS[Z], periodo, grupo, grupoAB, bloque };
  }
  // Al revés: un elemento desde su período y su grupo IUPAC (solo Z = 1 a 36).
  function enCasilla(periodo, grupo) {
    for (let Z = 1; Z <= ZTABLA; Z++) { const u = ubicacion(Z); if (u.periodo === periodo && u.grupo === grupo) return u; }
    return null;
  }

  // ---------- Propiedades periódicas ----------
  function propiedad(x, prop) {
    const t = PROPIEDADES[prop]; if (!t) throw new Error(`propiedad desconocida: ${prop} (ei, radio o en)`);
    const Z = zDe(x); if (Z > ZTABLA) throw new Error(`sin datos de tabla para Z > ${ZTABLA}`);
    return t[Z];
  }
  // Ordena una lista de símbolos por una propiedad, de mayor a menor (o de menor a mayor con 'menor').
  function ordenar(lista, prop, sentido) {
    const v = lista.map(x => { const p = propiedad(x, prop); if (p === null) throw new Error(`${x} no tiene valor de ${prop}`); return [String(SIMBOLOS[zDe(x)]), p]; });
    v.sort((a, b) => (sentido === 'menor' ? a[1] - b[1] : b[1] - a[1]));
    return { orden: v.map(a => a[0]), valores: v.map(a => a[1]) };
  }
  // El mapa de una propiedad para Z = 1 a 36: valor y 't' de 0 (el menor) a 1 (el mayor); null sin valor.
  function mapa(prop) {
    const t = PROPIEDADES[prop]; if (!t) throw new Error(`propiedad desconocida: ${prop}`);
    const vs = t.filter(v => v !== null), min = Math.min(...vs), max = Math.max(...vs), r = [];
    for (let Z = 1; Z <= ZTABLA; Z++) { const u = ubicacion(Z); r.push({ ...u, valor: t[Z], t: t[Z] === null ? null : (t[Z] - min) / (max - min) }); }
    return r;
  }

  // Primera energía de ionización de dos átomos de los bloques s y p: cuál es mayor y por qué.
  // razon: 'mas-protones' (sube Z en la misma subcapa), 'subcapa-nueva' (el electrón del de mayor Z inaugura una
  // subcapa de más energía: 2→13), 'apareado' (el que sale del de mayor Z comparte orbital: 15→16), 'capa-mas-lejana'.
  // errores: qué átomo daría como mayor cada razonamiento de un solo factor.
  function compararEI(a, b) {
    const A = zDe(a), B = zDe(b), [lo, hi] = A < B ? [A, B] : [B, A];
    if (ubicacion(A).bloque === 'd' || ubicacion(B).bloque === 'd') throw new Error('en los metales de transición la energía de ionización no sigue una regla simple');
    const eiA = propiedad(A, 'ei'), eiB = propiedad(B, 'ei');
    const mayor = SIMBOLOS[eiA > eiB ? A : B];
    const sLo = electronQueSale(lo), sHi = electronQueSale(hi), pLo = ubicacion(lo).periodo, pHi = ubicacion(hi).periodo;
    let razon;
    if (pLo !== pHi) razon = 'capa-mas-lejana';
    else if (sHi.l > sLo.l) razon = 'subcapa-nueva';
    // El primer electrón apareado de una subcapa p (3p⁴ contra 3p³). En una s, el protón extra pesa más (Na → Mg).
    else if (sHi.subcapa === sLo.subcapa && sHi.l > 0 && sHi.electronesEnSubcapa === 2 * sHi.l + 2) razon = 'apareado';
    else razon = 'mas-protones';
    const config = Z => configuracion(Z).subcapas;
    const semillena = Z => config(Z).some(s => s.l > 0 && s.e === 2 * s.l + 1);
    const llena = Z => { const s = config(Z); const u = s[s.length - 1]; return u.e === capacidad(u.l); };
    const quien = f => (f(A) && !f(B) ? SIMBOLOS[A] : f(B) && !f(A) ? SIMBOLOS[B] : null);
    return { mayor, valores: { [SIMBOLOS[A]]: eiA, [SIMBOLOS[B]]: eiB }, razon, saleDe: { [SIMBOLOS[A]]: electronQueSale(A), [SIMBOLOS[B]]: electronQueSale(B) },
      errores: { 'solo-carga-nuclear': pLo === pHi ? SIMBOLOS[hi] : SIMBOLOS[lo], 'reparte-entre-mas-electrones': SIMBOLOS[lo],
        'semillena-estable': quien(semillena), 'subcapa-llena-estable': quien(llena) } };
  }
  // Energías de ionización sucesivas (Na, Mg o Al). 'salto': cuántos electrones salen antes del gran salto (los
  // de la capa de afuera). errores['reparte-atraccion']: lo que daría la segunda si los Z protones "repartieran"
  // su atracción entre los electrones que quedan (TP4): EI₁ · Z/(Z − 1).
  function ionizacionesSucesivas(x) {
    const Z = zDe(x), v = SUCESIVAS[SIMBOLOS[Z]];
    if (!v) throw new Error(`sin datos de ionizaciones sucesivas para ${x} (Na, Mg o Al)`);
    const razones = v.slice(1).map((y, i) => y / v[i]);
    const salto = razones.indexOf(Math.max(...razones)) + 1;
    const ult = niveles(Z), valencia = ult[ult.length - 1];
    const quedan = configuracion(Z, salto);
    return { valores: v.slice(), razones, salto, valencia, capaTrasSalto: Math.max(...quedan.subcapas.map(s => s.n)),
      errores: { 'reparte-atraccion': v[0] * Z / (Z - 1) } };
  }

  // ---------- Radios de iones ----------
  // Compara dos especies: del mismo elemento (más electrones, más grande), isoelectrónicas (más protones, más
  // pequeña) o dos átomos neutros (con la tabla). Devuelve la mayor y la regla usada.
  function compararRadio(a, b) {
    const A = especie(a), B = especie(b), eA = A.Z - A.carga, eB = B.Z - B.carga, na = nombreEspecie(A.Z, A.carga), nb = nombreEspecie(B.Z, B.carga);
    if (A.Z === B.Z) { if (eA === eB) return { mayor: null, regla: 'igual' }; return { mayor: eA > eB ? na : nb, regla: 'mismo-elemento' }; }
    if (eA === eB) return { mayor: A.Z < B.Z ? na : nb, regla: 'isoelectronicos' };
    if (A.carga === 0 && B.carga === 0) return { mayor: propiedad(A.Z, 'radio') > propiedad(B.Z, 'radio') ? na : nb, regla: 'tabla-atomica' };
    if (RADIO_IONICO[na] && RADIO_IONICO[nb]) return { mayor: RADIO_IONICO[na] > RADIO_IONICO[nb] ? na : nb, regla: 'tabla-ionica' };
    throw new Error(`no hay una regla simple para comparar ${na} y ${nb}`);
  }
  function isoelectronicos(lista) {
    const e = lista.map(x => { const s = especie(x); return s.Z - s.carga; });
    return { electrones: e, todos: e.every(v => v === e[0]), igualA: e.every(v => v === e[0]) && GASES_NOBLES.includes(e[0]) ? SIMBOLOS[e[0]] : null };
  }
  // Ordena especies de mayor a menor radio. Serie isoelectrónica: por Z (más protones, más pequeña).
  // errores: el orden al revés, "todos iguales" y el orden de los átomos neutros.
  function ordenarRadios(lista) {
    const sp = lista.map(x => ({ x: String(x), ...especie(x) }));
    const iso = isoelectronicos(lista).todos;
    let orden;
    if (iso) orden = [...sp].sort((a, b) => a.Z - b.Z);
    else if (sp.every(s => s.carga === 0)) orden = [...sp].sort((a, b) => propiedad(b.Z, 'radio') - propiedad(a.Z, 'radio'));
    else if (sp.every(s => RADIO_IONICO[s.x])) orden = [...sp].sort((a, b) => RADIO_IONICO[b.x] - RADIO_IONICO[a.x]);
    else throw new Error('mezcla de especies sin una regla simple');
    const r = { orden: orden.map(s => s.x), isoelectronicos: iso, regla: iso ? 'isoelectronicos' : sp.every(s => s.carga === 0) ? 'tabla-atomica' : 'tabla-ionica',
      ionicos: orden.map(s => RADIO_IONICO[s.x] === undefined ? null : RADIO_IONICO[s.x]), errores: {} };
    if (iso) {
      r.errores['mas-protones-mas-grande'] = [...r.orden].reverse();
      r.errores['mismos-electrones-mismo-tamano'] = 'iguales';
      r.errores['ordena-como-atomos'] = [...sp].sort((a, b) => propiedad(b.Z, 'radio') - propiedad(a.Z, 'radio')).map(s => s.x);
    }
    return r;
  }

  // ---------- Orbitales del átomo de hidrógeno (15 nov 2026, mesa 3D «La nube del orbital») ----------
  // Solo el hidrógeno (un electrón, Z = 1), con distancias en radios de Bohr a₀ (52,9 pm). Funciones radiales R_nl de
  // n = 1 a 3 escritas a mano (OpenStax Chemistry 2e §6.3; cualquier texto de cuántica) y partes angulares reales
  // normalizadas (orbitales px, py, pz, dz², dxz, dyz, dxy, dx²−y²). Verificadas aparte con la fórmula general de
  // Laguerre (r90, nodos y valores; ver casos.json). La nube es una muestra de puntos con densidad |ψ|²: dice dónde es
  // probable hallar al electrón, no un camino. El signo de ψ se informa como «+» o «−»: no es una carga.
  const S3 = Math.sqrt(3), S6 = Math.sqrt(6), S30 = Math.sqrt(30), PI4 = 4 * Math.PI;
  const RADIAL = {
    '1,0': r => 2 * Math.exp(-r),
    '2,0': r => (2 - r) * Math.exp(-r / 2) / (2 * Math.SQRT2),
    '2,1': r => r * Math.exp(-r / 2) / (2 * S6),
    '3,0': r => 2 * (27 - 18 * r + 2 * r * r) * Math.exp(-r / 3) / (81 * S3),
    '3,1': r => 4 * (6 * r - r * r) * Math.exp(-r / 3) / (81 * S6),
    '3,2': r => 4 * r * r * Math.exp(-r / 3) / (81 * S30),
  };
  // Parte angular real (x, y, z con r = 1), su máximo de |Y|², el nombre, los planos nodales (normal) y los conos.
  const C54 = Math.acos(1 / S3) * 180 / Math.PI;
  const ANG = {
    s: { l: 0, Y: () => 1 / Math.sqrt(PI4), max: 1 / PI4, planos: [], conos: [], corte: 'y', eje: null },
    px: { l: 1, Y: (x) => Math.sqrt(3 / PI4) * x, max: 3 / PI4, planos: [[1, 0, 0]], conos: [], corte: 'y', eje: 'x' },
    py: { l: 1, Y: (x, y) => Math.sqrt(3 / PI4) * y, max: 3 / PI4, planos: [[0, 1, 0]], conos: [], corte: 'x', eje: 'y' },
    pz: { l: 1, Y: (x, y, z) => Math.sqrt(3 / PI4) * z, max: 3 / PI4, planos: [[0, 0, 1]], conos: [], corte: 'y', eje: 'z' },
    dz2: { l: 2, Y: (x, y, z) => Math.sqrt(5 / (16 * Math.PI)) * (3 * z * z - 1), max: 5 / (4 * Math.PI), planos: [], conos: [C54], corte: 'y', eje: 'z' },
    dxz: { l: 2, Y: (x, y, z) => Math.sqrt(15 / PI4) * x * z, max: 15 / (16 * Math.PI), planos: [[1, 0, 0], [0, 0, 1]], conos: [], corte: 'y', eje: null },
    dyz: { l: 2, Y: (x, y, z) => Math.sqrt(15 / PI4) * y * z, max: 15 / (16 * Math.PI), planos: [[0, 1, 0], [0, 0, 1]], conos: [], corte: 'x', eje: null },
    dxy: { l: 2, Y: (x, y) => Math.sqrt(15 / PI4) * x * y, max: 15 / (16 * Math.PI), planos: [[1, 0, 0], [0, 1, 0]], conos: [], corte: 'z', eje: null },
    'dx2-y2': { l: 2, Y: (x, y) => Math.sqrt(15 / (16 * Math.PI)) * (x * x - y * y), max: 15 / (16 * Math.PI),
      planos: [[Math.SQRT1_2, Math.SQRT1_2, 0], [Math.SQRT1_2, -Math.SQRT1_2, 0]], conos: [], corte: 'z', eje: null },
  };
  const ORBITALES = ['1s', '2s', '2px', '2py', '2pz', '3s', '3px', '3py', '3pz', '3dz2', '3dxz', '3dyz', '3dxy', '3dx2-y2'];
  const NOMBRE_ORB = { dz2: 'dz²', 'dx2-y2': 'dx²−y²' };
  // Integral de R²r² de 0 a r (regla de Simpson fina): la probabilidad de hallar al electrón dentro de una esfera de radio r.
  function dentroDe(n, l, r, pasos) {
    const R = RADIAL[`${n},${l}`], N = pasos || 4000, h = r / N;
    let s = 0;
    for (let i = 0; i <= N; i++) { const x = i * h, v = R(x) * R(x) * x * x; s += (i === 0 || i === N ? 1 : i % 2 ? 4 : 2) * v; }
    return s * h / 3;
  }
  const cache90 = new Map();
  function radio90(n, l) {             // radio de la esfera que encierra el 90 % (bisección sobre dentroDe)
    const k = `${n},${l}`;
    if (cache90.has(k)) return cache90.get(k);
    let a = 0, b = 60;
    for (let i = 0; i < 50; i++) { const m = (a + b) / 2; if (dentroDe(n, l, m) < 0.9) a = m; else b = m; }
    cache90.set(k, (a + b) / 2);
    return (a + b) / 2;
  }
  // Nodos radiales: ceros de R_nl con r > 0 (fórmulas cerradas de los polinomios de arriba).
  const NODOS_R = { '1,0': [], '2,0': [2], '2,1': [], '3,0': [(9 - 3 * S3) / 2, (9 + 3 * S3) / 2], '3,1': [6], '3,2': [] };
  function orbital(id) {
    const m = /^([1-3])(s|p|d)(.*)$/.exec(String(id));
    if (!m || !ORBITALES.includes(id)) throw new Error(`orbital: no conozco «${id}» (hay ${ORBITALES.join(', ')})`);
    const n = +m[1], l = 'spd'.indexOf(m[2]), clave = l === 0 ? 's' : m[2] + m[3], a = ANG[clave];
    const radiales = NODOS_R[`${n},${l}`];
    return {
      id, n, l, nombre: `${n}${m[2]}${NOMBRE_ORB[clave] ? NOMBRE_ORB[clave].slice(1) : m[3]}`, subnivel: `${n}${m[2]}`,
      eje: a.eje, corte: a.corte, radiales: radiales.slice(), planos: a.planos.map(p => p.slice()), conos: a.conos.slice(),
      nodosRadiales: radiales.length, nodosAngulares: l, nodos: n - 1,
      r90: radio90(n, l),
    };
  }
  function psi(id, x, y, z) {
    const o = orbital(id), r = Math.hypot(x, y, z), a = ANG[o.l === 0 ? 's' : id.slice(1)];
    const R = RADIAL[`${o.n},${o.l}`](r);
    return r === 0 ? (o.l === 0 ? R * a.Y() : 0) : R * a.Y(x / r, y / r, z / r);
  }
  // Nube de puntos con densidad |ψ|²: r por la inversa de la distribución radial (tabla), dirección por rechazo con |Y|².
  // corte: true deja solo la lámina |coordenada de o.corte| < 6 % del r90 (para ver los nodos de adentro).
  // Determinística: la misma semilla da los mismos puntos. Cada punto es [x, y, z, signo de ψ].
  const nubes = new Map();
  function nube(id, op) {
    op = op || {};
    const N = op.n || 1600, corte = !!op.corte, semilla = op.semilla === undefined ? 7 : op.semilla;
    const k = `${id}|${N}|${corte}|${semilla}`;
    if (nubes.has(k)) return nubes.get(k);
    const o = orbital(id), R = RADIAL[`${o.n},${o.l}`], a = ANG[o.l === 0 ? 's' : id.slice(1)];
    const RMAX = 3.2 * o.r90, M = 3000, rs = [0], cdf = [0];
    for (let i = 1; i <= M; i++) { const r = RMAX * i / M, rm = RMAX * (i - 0.5) / M; rs.push(r); cdf.push(cdf[i - 1] + R(rm) * R(rm) * rm * rm * RMAX / M); }
    const tot = cdf[M];
    let q = (semilla * 2654435761 + 97) >>> 0;
    const azar = () => { q = (q + 0x6D2B79F5) >>> 0; let t = q; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const eje = 'xyz'.indexOf(o.corte), delta = 0.06 * o.r90, puntos = [];
    let intentos = 0;
    while (puntos.length < N && intentos < 400000) {
      intentos++;
      const u = azar() * tot;
      let lo = 0, hi = M;
      while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (cdf[mid] < u) lo = mid; else hi = mid; }
      const r = rs[lo] + (rs[hi] - rs[lo]) * (u - cdf[lo]) / ((cdf[hi] - cdf[lo]) || 1);
      let d;
      for (;;) {                                    // dirección uniforme en la esfera, aceptada con |Y|²/max
        const cz = 2 * azar() - 1, ph = 2 * Math.PI * azar(), s = Math.sqrt(1 - cz * cz);
        d = [s * Math.cos(ph), s * Math.sin(ph), cz];
        const Y = a.Y(d[0], d[1], d[2]);
        if (azar() * a.max <= Y * Y) break;
      }
      const p = [d[0] * r, d[1] * r, d[2] * r];
      if (corte && Math.abs(p[eje]) > delta) continue;
      const v = R(r) * a.Y(d[0], d[1], d[2]);
      puntos.push([p[0], p[1], p[2], v >= 0 ? 1 : -1]);
    }
    const r = { id, puntos, corte: corte ? o.corte : null, grosor: corte ? 2 * delta : null, r90: o.r90 };
    nubes.set(k, r);
    return r;
  }
  // Dónde poner el rótulo de cada signo: el punto más probable de ese signo (máximo de ψ²r², que es la densidad por
  // capa en esa dirección) entre 26 direcciones (ejes, diagonales de cara y de cubo) y radios de 0 a 3·r90.
  const DIRS = (() => {
    const d = [];
    for (const x of [1, 0, -1]) for (const y of [1, 0, -1]) for (const z of [1, 0, -1]) if (x || y || z) { const m = Math.hypot(x, y, z); d.push([x / m, y / m, z / m]); }
    return d;
  })();
  function lobulos(id) {
    const o = orbital(id), R = RADIAL[`${o.n},${o.l}`], a = ANG[o.l === 0 ? 's' : id.slice(1)], mejor = {};
    for (const d of DIRS) {
      const Y = a.Y(d[0], d[1], d[2]);
      if (Math.abs(Y) < 1e-12) continue;
      for (let i = 1; i <= 600; i++) {
        const r = 3 * o.r90 * i / 600, v = R(r) * Y, s = v > 0 ? 1 : v < 0 ? -1 : 0, q = v * v * r * r;
        if (s && (!mejor[s] || q > mejor[s].q + 1e-15)) mejor[s] = { q, pos: [d[0] * r, d[1] * r, d[2] * r] };
      }
    }
    return [1, -1].filter(s => mejor[s]).map(s => ({ signo: s, pos: mejor[s].pos }));
  }

  // El orbital más grande de la lista (por r90), para los retos de extremo.
  const mayorOrbital = () => ORBITALES.reduce((m, id) => (orbital(id).r90 > orbital(m).r90 ? id : m));

  return { ORBITALES, orbital, psi, nube, radio90, dentroDe, mayorOrbital, lobulos,
    SIMBOLOS, NOMBRES, ZTABLA, EI, RADIO, EN, SUCESIVAS, RADIO_IONICO, EXCEPCIONES, elemento, especie, particulas,
    configuracion, cajas, ultimoElectron, electronQueSale, electronQueEntra, secuencia, escalasDibujo, niveles, ubicacion, enCasilla, propiedad, ordenar, mapa, compararEI,
    ionizacionesSucesivas, compararRadio, isoelectronicos, ordenarRadios };
});
