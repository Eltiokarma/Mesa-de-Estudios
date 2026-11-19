/*
 * Tabla de núclidos reales hasta Z = 54 (xenón), para «Estructura atómica» (quimica.estructura-atomica): la leen las
 * pruebas de la teoría (contenido/teoria/quimica/estructura-atomica.test.js) y de la práctica (particulas-nucleo y
 * niveles-orbitales). Pendiente B5 de la auditoría (rutinas/auditoria/quimica.estructura-atomica.md): todo núclido que
 * un ejercicio o un ejemplo nombra con su elemento (¹⁴C, «carbono-14», ²³Na⁺) tiene que estar aquí. Si un ejercicio
 * necesita uno que falta, primero se comprueba que existe y se agrega a esta tabla con su motivo; no se inventa.
 *
 * Dos listas por elemento, por número de masa A:
 *   - NATURALES: los isótopos de la composición isotópica natural del elemento (la tabla de abundancias de la IUPAC:
 *     los estables y los radiactivos de vida tan larga que siguen en la Tierra desde que se formó, como el potasio-40,
 *     el calcio-48 o el rubidio-87). Tecnecio (Z = 43) no tiene ninguno.
 *   - RADIACTIVOS: radiactivos conocidos por su uso o por su papel en la naturaleza (datación, medicina, trazadores,
 *     reactores), con una palabra que dice por qué se conocen. No es la lista de todos los que se han fabricado: es la
 *     de los que un libro o un examen nombran.
 * Fuentes para contrastar (no se copia nada de ellas): IUPAC, «Isotopic compositions of the elements» (CIAAW), y la
 * carta de núclidos del OIEA (Live Chart of Nuclides). La tabla se escribió a mano el 19 nov 2026 y la prueba
 * nuclidos.test.js comprueba su forma (cuántos naturales tiene cada elemento, sin repetidos, A > Z, rangos).
 *
 * Funciona en Node (require) y en el navegador (window.Nuclidos); hoy solo la usan las pruebas.
 */
(function (root, fabrica) {
  const api = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Nuclidos = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const SIMB = ['', 'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca',
    'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr', 'Rb', 'Sr', 'Y', 'Zr',
    'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn', 'Sb', 'Te', 'I', 'Xe'];
  const NOMBRE = ['', 'hidrógeno', 'helio', 'litio', 'berilio', 'boro', 'carbono', 'nitrógeno', 'oxígeno', 'flúor', 'neón', 'sodio',
    'magnesio', 'aluminio', 'silicio', 'fósforo', 'azufre', 'cloro', 'argón', 'potasio', 'calcio', 'escandio', 'titanio', 'vanadio',
    'cromo', 'manganeso', 'hierro', 'cobalto', 'níquel', 'cobre', 'cinc', 'galio', 'germanio', 'arsénico', 'selenio', 'bromo',
    'kriptón', 'rubidio', 'estroncio', 'itrio', 'circonio', 'niobio', 'molibdeno', 'tecnecio', 'rutenio', 'rodio', 'paladio',
    'plata', 'cadmio', 'indio', 'estaño', 'antimonio', 'telurio', 'yodo', 'xenón'];

  // Composición isotópica natural, Z = 1 a 54 (índice = Z).
  const NATURALES = [[],
    /*  1 H  */ [1, 2],
    /*  2 He */ [3, 4],
    /*  3 Li */ [6, 7],
    /*  4 Be */ [9],
    /*  5 B  */ [10, 11],
    /*  6 C  */ [12, 13],
    /*  7 N  */ [14, 15],
    /*  8 O  */ [16, 17, 18],
    /*  9 F  */ [19],
    /* 10 Ne */ [20, 21, 22],
    /* 11 Na */ [23],
    /* 12 Mg */ [24, 25, 26],
    /* 13 Al */ [27],
    /* 14 Si */ [28, 29, 30],
    /* 15 P  */ [31],
    /* 16 S  */ [32, 33, 34, 36],
    /* 17 Cl */ [35, 37],
    /* 18 Ar */ [36, 38, 40],
    /* 19 K  */ [39, 40, 41],
    /* 20 Ca */ [40, 42, 43, 44, 46, 48],
    /* 21 Sc */ [45],
    /* 22 Ti */ [46, 47, 48, 49, 50],
    /* 23 V  */ [50, 51],
    /* 24 Cr */ [50, 52, 53, 54],
    /* 25 Mn */ [55],
    /* 26 Fe */ [54, 56, 57, 58],
    /* 27 Co */ [59],
    /* 28 Ni */ [58, 60, 61, 62, 64],
    /* 29 Cu */ [63, 65],
    /* 30 Zn */ [64, 66, 67, 68, 70],
    /* 31 Ga */ [69, 71],
    /* 32 Ge */ [70, 72, 73, 74, 76],
    /* 33 As */ [75],
    /* 34 Se */ [74, 76, 77, 78, 80, 82],
    /* 35 Br */ [79, 81],
    /* 36 Kr */ [78, 80, 82, 83, 84, 86],
    /* 37 Rb */ [85, 87],
    /* 38 Sr */ [84, 86, 87, 88],
    /* 39 Y  */ [89],
    /* 40 Zr */ [90, 91, 92, 94, 96],
    /* 41 Nb */ [93],
    /* 42 Mo */ [92, 94, 95, 96, 97, 98, 100],
    /* 43 Tc */ [],
    /* 44 Ru */ [96, 98, 99, 100, 101, 102, 104],
    /* 45 Rh */ [103],
    /* 46 Pd */ [102, 104, 105, 106, 108, 110],
    /* 47 Ag */ [107, 109],
    /* 48 Cd */ [106, 108, 110, 111, 112, 113, 114, 116],
    /* 49 In */ [113, 115],
    /* 50 Sn */ [112, 114, 115, 116, 117, 118, 119, 120, 122, 124],
    /* 51 Sb */ [121, 123],
    /* 52 Te */ [120, 122, 123, 124, 125, 126, 128, 130],
    /* 53 I  */ [127],
    /* 54 Xe */ [124, 126, 128, 129, 130, 131, 132, 134, 136],
  ];

  // Radiactivos conocidos: [Z, A, por qué se conoce].
  const RADIACTIVOS = [
    [1, 3, 'tritio'], [4, 7, 'rayos cósmicos'], [4, 10, 'datación'], [6, 11, 'tomografía PET'], [6, 14, 'datación'],
    [7, 13, 'tomografía PET'], [8, 15, 'tomografía PET'], [9, 18, 'tomografía PET'], [11, 22, 'fuente de positrones'],
    [11, 24, 'trazador'], [13, 26, 'datación de meteoritos'], [15, 32, 'trazador en biología'], [15, 33, 'trazador en biología'],
    [16, 35, 'trazador en biología'], [17, 36, 'datación de aguas'], [18, 39, 'datación de aguas y hielo'], [19, 42, 'trazador'],
    [20, 41, 'datación'], [20, 45, 'trazador'], [20, 47, 'trazador'], [21, 46, 'trazador'], [22, 44, 'supernovas'],
    [24, 51, 'medicina nuclear'], [25, 54, 'fuente de calibración'], [26, 55, 'fuente de rayos X'], [26, 59, 'trazador del hierro'],
    [26, 60, 'supernovas'], [27, 57, 'medicina nuclear'], [27, 58, 'trazador'], [27, 60, 'radioterapia'], [28, 59, 'datación'],
    [28, 63, 'detectores'], [29, 64, 'tomografía PET'], [29, 67, 'radioterapia'], [30, 65, 'trazador'], [31, 67, 'gammagrafía'],
    [31, 68, 'tomografía PET'], [32, 68, 'generador de galio-68'], [33, 74, 'trazador'], [34, 75, 'gammagrafía'],
    [34, 79, 'residuo de reactor'], [35, 82, 'trazador'], [36, 81, 'datación de aguas'], [36, 85, 'residuo de reactor'],
    [37, 82, 'tomografía PET'], [37, 86, 'trazador'], [38, 85, 'trazador'], [38, 89, 'medicina nuclear'], [38, 90, 'lluvia radiactiva'],
    [39, 90, 'radioterapia'], [40, 93, 'residuo de reactor'], [40, 95, 'residuo de reactor'], [41, 95, 'residuo de reactor'],
    [42, 99, 'generador de tecnecio'], [43, 97, 'tecnecio'], [43, 98, 'tecnecio'], [43, 99, 'medicina nuclear'],
    [44, 103, 'residuo de reactor'], [44, 106, 'radioterapia'], [46, 103, 'radioterapia'], [46, 107, 'residuo de reactor'],
    [47, 111, 'trazador'], [48, 109, 'fuente de rayos X'], [49, 111, 'gammagrafía'], [50, 113, 'fuente de calibración'],
    [50, 126, 'residuo de reactor'], [51, 124, 'trazador'], [51, 125, 'residuo de reactor'], [52, 132, 'residuo de reactor'],
    [53, 123, 'gammagrafía'], [53, 124, 'tomografía PET'], [53, 125, 'medicina nuclear'], [53, 129, 'datación'],
    [53, 131, 'tiroides'], [54, 133, 'medicina nuclear'], [54, 135, 'reactores'],
  ];

  const Z_MAX = NATURALES.length - 1;
  const clave = (z, a) => `${z}-${a}`;
  const REALES = new Map();
  NATURALES.forEach((as, z) => as.forEach(a => REALES.set(clave(z, a), { z, a, natural: true })));
  RADIACTIVOS.forEach(([z, a, motivo]) => REALES.set(clave(z, a), { z, a, natural: false, motivo }));

  // ¿Existe (Z, A) en la tabla? Fuera de Z = 1 a 54 no se sabe: la tabla no llega.
  const existe = (z, a) => REALES.has(clave(z, a));
  const esNatural = (z, a) => existe(z, a) && REALES.get(clave(z, a)).natural;
  const numeroAtomico = simbolo => { const z = SIMB.indexOf(simbolo); return z > 0 ? z : null; };
  const deNombre = nombre => { const z = NOMBRE.indexOf(String(nombre).toLowerCase()); return z > 0 ? z : null; };
  const masas = z => [...(NATURALES[z] || []), ...RADIACTIVOS.filter(r => r[0] === z).map(r => r[1])].sort((p, q) => p - q);

  // Núclidos que nombra un texto con su elemento: «¹⁴C», «²³Na⁺», «carbono-14». Devuelve [{ z, a, texto }].
  // Una letra que no es símbolo de un elemento hasta Z = 54 (X, E, Q, J…) es genérica y no cuenta; tampoco la «Y» sola
  // con que los ejercicios nombran un segundo átomo desconocido (el itrio no sale en esta unidad).
  const SUPER = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  const GENERICAS = new Set(['X', 'Y']);
  function enTexto(texto) {
    const s = String(texto), hallados = [];
    for (const m of s.matchAll(/([⁰¹²³⁴⁵⁶⁷⁸⁹]+)([A-Z][a-z]?)/g)) {
      // La letra que sigue al símbolo no puede ser otra minúscula (sería una palabra, no un símbolo).
      const resto = s[m.index + m[0].length] || '';
      if (/\p{Ll}/u.test(resto)) continue;
      if (GENERICAS.has(m[2])) continue;
      const z = numeroAtomico(m[2]);
      if (!z) continue;
      hallados.push({ z, a: Number([...m[1]].map(c => SUPER.indexOf(c)).join('')), texto: m[0] });
    }
    const nombres = NOMBRE.slice(1).join('|');
    // Solo con guion («carbono-14»): «argón 18» o «sodio 11» dan el número atómico, no el de masa.
    for (const m of s.matchAll(new RegExp(`(?<!\\p{L})(${nombres})[-\\u2011](\\d{1,3})(?!\\d)`, 'giu'))) {
      hallados.push({ z: deNombre(m[1]), a: Number(m[2]), texto: m[0] });
    }
    return hallados;
  }

  return { SIMB, NOMBRE, NATURALES, RADIACTIVOS, Z_MAX, existe, esNatural, numeroAtomico, deNombre, masas, enTexto };
});
