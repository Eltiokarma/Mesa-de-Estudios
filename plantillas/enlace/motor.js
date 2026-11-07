/*
 * Motor de La molécula en 3D (enlace químico).
 *
 * Aquí vive toda la química de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el
 * navegador (window.MotorEnlace) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * Funciones (x es una fórmula del catálogo, como 'NH3', 'CO3^2-' o 'I3^-', o un objeto
 * { central:'N', ligandos:['H','H','H'], carga:0, paresLibres? }):
 *  - elemento(s): { simbolo, nombre, Z, periodo, grupo, valencia (e⁻ de valencia), en (Pauling), metal }.
 *  - lewis(x): estructura de Lewis de átomo central único. Campos: electrones (de valencia, con la carga del ion),
 *    paresEnlazantes (del central: suma de los órdenes de enlace), sigma, pi, paresLibres (del central), ligandos
 *    [{ simbolo, orden, paresLibres, cf }], cfCentral, sumaCF, electronesCentral, octeto ('incompleto' | 'completo' |
 *    'expandido'), resonancia (cuántas estructuras equivalentes) y errores.
 *  - vsepr(x) o vsepr({ n, m }): n ligandos y m pares libres del central → dominios, AXE ('AX3E'),
 *    geometriaDominios, geometria (molecular), hibridacion ('sp', 'sp2', 'sp3', 'sp3d', 'sp3d2'), angulos (los ángulos
 *    ideales distintos entre ligandos, en grados, de menor a mayor), anguloMenor y errores.
 *  - posiciones(n, m): vectores unitarios 3D de los ligandos y de los pares libres en las posiciones VSEPR.
 *  - posicionesPlano(x): las mismas direcciones en el dibujo de Lewis en el papel (z = 0).
 *  - polaridad(x): dipolos de enlace, dipolo total (vector y módulo), polar (true/false) y errores.
 *  - molecula(x): todo junto (lewis, vsepr, posiciones, polaridad, tipo de cada enlace) y lewisCoincide.
 *  - tipoEnlace(a, b): ΔEN, tipo por el corte, tipo por la clase de átomos y si coinciden.
 *  - resonancia(x): las estructuras equivalentes (órdenes y cargas formales de cada una) y el orden promedio.
 *  - redNaCl(lado, esquina): un trozo de lado × lado × lado iones de la red del NaCl → iones, Na, Cl, moleculas,
 *    coordinacion, errores; vecinos(lado, [i, j, k]).
 *  - girar(v, giro, inclinacion) y dibujo(x, { f, giro, inclinacion }): para dibujar (mezcla del plano al 3D).
 *
 * Convenciones (docs/investigacion/atomo-enlace-ideas-erroneas.md, "Casos de prueba propuestos"):
 *  - Lewis: se une cada ligando al central con un enlace simple; los terminales completan su octeto (el H, su dueto);
 *    lo que sobra va al central como pares libres. Si el central no llega al octeto y no es del grupo 2 o 13 (Be, Mg,
 *    B, Al: octeto incompleto, como BeCl₂ y BF₃), un terminal O, S, N o C le presta un par (enlace múltiple). Si el
 *    central es del período 3 o más y su carga formal es positiva, cada O o S terminal con carga formal negativa forma
 *    un enlace doble hasta que la carga formal del central llega a 0 (octeto expandido: SO₂, SO₃, SO₄²⁻, ClO₄⁻). Con
 *    esto, el O y el S terminales quedan unidos por enlace doble cuando hace falta, como en el informe. Los halógenos
 *    terminales siempre van con enlace simple. Con un número impar de electrones (NO₂, NO) el motor no dibuja Lewis.
 *    Otros libros dibujan el SO₂ y el SO₄²⁻ con octeto y cargas formales: la geometría y la hibridación no cambian.
 *  - Carga formal = electrones de valencia − electrones de los pares libres − pares enlazantes; la suma da la carga
 *    del ion. Resonancia: cuántas maneras hay de poner los enlaces múltiples entre ligandos iguales que pueden tenerlos.
 *  - VSEPR: conteo AXₙEₘ; hibridación por número de dominios (2 sp, 3 sp², 4 sp³, 5 sp³d, 6 sp³d²). Pares libres en
 *    las posiciones ecuatoriales de la bipirámide (sp³d) y opuestos en el octaedro (AX₄E₂). Los ángulos son los ideales
 *    del modelo; los pares libres los cierran un poco en la molécula real (NH₃ cerca de 107°, H₂O cerca de 104,5°).
 *  - Ejes: y hacia arriba, x a la derecha, z hacia quien mira. Tetraedro sin pares libres con dos vértices arriba y dos
 *    abajo (los dos primeros ligandos arriba); con un par libre (AX₃E), el par arriba en (0, 1, 0); con dos (AX₂E₂), los
 *    dos pares en los dos vértices de arriba del tetraedro y los dos ligandos en los de abajo, así que el dipolo del H₂O
 *    apunta entero hacia +y. Trigonal en el plano xy con el
 *    primer dominio arriba. Bipirámide con ejes axiales en y. Octaedro en los ejes.
 *  - Polaridad: cada enlace aporta un vector (EN del ligando − EN del central) × la dirección del ligando: la flecha
 *    apunta al átomo más electronegativo, el extremo δ−, como en las academias. Su tamaño es la diferencia de
 *    electronegatividad, sin unidades: es un modelo de academia, no el momento dipolar medido en debye. Los pares
 *    libres no tienen dipolo propio en el modelo (simplificación de academia; en la molécula real sí aportan). Polar si
 *    el módulo del dipolo total pasa de 1e-9.
 *  - Electronegatividad de Pauling, valores revisados de Allred (1961) como en la tabla del CRC (los mismos del motor
 *    del átomo y la tabla); Xe 2,60 y I 2,66.
 *  - Tipo de enlace por ΔEN (redondeada a centésimas), con los cortes de muchas academias peruanas: ΔEN ≥ 1,7 iónico;
 *    0,4 ≤ ΔEN < 1,7 covalente polar; ΔEN < 0,4 covalente apolar. Es un continuo: los cortes son una guía. Por eso
 *    también se da el tipo por la clase de átomos (metal con no metal, iónico; dos no metales, covalente) y si los dos
 *    coinciden (el HF tiene ΔEN 1,78 y es covalente polar).
 *  - Red del NaCl: iones en una cuadrícula cúbica; el de la esquina (0, 0, 0) es el que se pide (Na por omisión) y los
 *    tipos se alternan. Cada ion del interior tiene 6 vecinos del otro tipo (6:6). No hay moléculas: moleculas = 0.
 *  - girar: primero gira en torno al eje y (giro, radianes), después en torno al eje x (inclinacion).
 *
 * Errores típicos (campo 'errores'), para armar las alternativas: en lewis, no contar la carga del ion o contarla al
 * revés, usar la "valencia" (los enlaces que forma: H 1, O 2, N 3, C 4) como electrones de valencia, contar el O con 2
 * electrones (EN4), y para los pares libres del central: contar electrones como pares o todos los pares como libres;
 * en vsepr, la forma del dibujo plano (EN8), contar solo los ligandos, la geometría de dominios en vez de la molecular,
 * "el par libre la dobla" (EN9) y la hibridación por ligandos, por electrones de valencia o por subcapas (EN12); en
 * polaridad, el dibujo plano (EN10), "simétrica, apolar", "átomos distintos, polar" y "enlaces polares, polar" (EN11);
 * en la red, contar pares Na–Cl, una sola molécula gigante o una molécula por ion (EN1).
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorEnlace = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // simbolo: [Z, periodo, grupo IUPAC, e⁻ de valencia, EN de Pauling, metal, "valencia" de academia (enlaces), nombre]
  const DATOS = {
    H: [1, 1, 1, 1, 2.20, false, 1, 'hidrógeno'], Li: [3, 2, 1, 1, 0.98, true, 1, 'litio'],
    Be: [4, 2, 2, 2, 1.57, true, 2, 'berilio'], B: [5, 2, 13, 3, 2.04, false, 3, 'boro'],
    C: [6, 2, 14, 4, 2.55, false, 4, 'carbono'], N: [7, 2, 15, 5, 3.04, false, 3, 'nitrógeno'],
    O: [8, 2, 16, 6, 3.44, false, 2, 'oxígeno'], F: [9, 2, 17, 7, 3.98, false, 1, 'flúor'],
    Na: [11, 3, 1, 1, 0.93, true, 1, 'sodio'], Mg: [12, 3, 2, 2, 1.31, true, 2, 'magnesio'],
    Al: [13, 3, 13, 3, 1.61, true, 3, 'aluminio'], Si: [14, 3, 14, 4, 1.90, false, 4, 'silicio'],
    P: [15, 3, 15, 5, 2.19, false, 3, 'fósforo'], S: [16, 3, 16, 6, 2.58, false, 2, 'azufre'],
    Cl: [17, 3, 17, 7, 3.16, false, 1, 'cloro'], K: [19, 4, 1, 1, 0.82, true, 1, 'potasio'],
    Ca: [20, 4, 2, 2, 1.00, true, 2, 'calcio'], Br: [35, 4, 17, 7, 2.96, false, 1, 'bromo'],
    I: [53, 5, 17, 7, 2.66, false, 1, 'yodo'], Xe: [54, 5, 18, 8, 2.60, false, null, 'xenón'],
  };
  const elemento = s => {
    const d = DATOS[s];
    if (!d) throw new Error(`elemento desconocido: ${s}`);
    return { simbolo: s, Z: d[0], periodo: d[1], grupo: d[2], valencia: d[3], en: d[4], metal: d[5], valenciaComb: d[6], nombre: d[7] };
  };

  // Catálogo de moléculas e iones del examen. El orden de los ligandos fija dónde va cada uno en 3D.
  const MOLECULAS = {
    'CO2': { central: 'C', ligandos: ['O', 'O'], texto: 'CO₂', nombre: 'dióxido de carbono' },
    'CS2': { central: 'C', ligandos: ['S', 'S'], texto: 'CS₂', nombre: 'disulfuro de carbono' },
    'SO2': { central: 'S', ligandos: ['O', 'O'], texto: 'SO₂', nombre: 'dióxido de azufre' },
    'SO3': { central: 'S', ligandos: ['O', 'O', 'O'], texto: 'SO₃', nombre: 'trióxido de azufre' },
    'H2O': { central: 'O', ligandos: ['H', 'H'], texto: 'H₂O', nombre: 'agua' },
    'H2S': { central: 'S', ligandos: ['H', 'H'], texto: 'H₂S', nombre: 'sulfuro de hidrógeno' },
    'SCl2': { central: 'S', ligandos: ['Cl', 'Cl'], texto: 'SCl₂', nombre: 'dicloruro de azufre' },
    'NH3': { central: 'N', ligandos: ['H', 'H', 'H'], texto: 'NH₃', nombre: 'amoniaco' },
    'NF3': { central: 'N', ligandos: ['F', 'F', 'F'], texto: 'NF₃', nombre: 'trifluoruro de nitrógeno' },
    'PCl3': { central: 'P', ligandos: ['Cl', 'Cl', 'Cl'], texto: 'PCl₃', nombre: 'tricloruro de fósforo' },
    'CH4': { central: 'C', ligandos: ['H', 'H', 'H', 'H'], texto: 'CH₄', nombre: 'metano' },
    'CH3Cl': { central: 'C', ligandos: ['H', 'H', 'H', 'Cl'], texto: 'CH₃Cl', nombre: 'clorometano' },
    'CH2Cl2': { central: 'C', ligandos: ['H', 'H', 'Cl', 'Cl'], texto: 'CH₂Cl₂', nombre: 'diclorometano' },
    'CHCl3': { central: 'C', ligandos: ['H', 'Cl', 'Cl', 'Cl'], texto: 'CHCl₃', nombre: 'cloroformo' },
    'CCl4': { central: 'C', ligandos: ['Cl', 'Cl', 'Cl', 'Cl'], texto: 'CCl₄', nombre: 'tetracloruro de carbono' },
    'CH2O': { central: 'C', ligandos: ['O', 'H', 'H'], texto: 'CH₂O', nombre: 'formaldehído' },
    'COCl2': { central: 'C', ligandos: ['O', 'Cl', 'Cl'], texto: 'COCl₂', nombre: 'fosgeno' },
    'HCN': { central: 'C', ligandos: ['H', 'N'], texto: 'HCN', nombre: 'cianuro de hidrógeno' },
    'BF3': { central: 'B', ligandos: ['F', 'F', 'F'], texto: 'BF₃', nombre: 'trifluoruro de boro' },
    'BCl3': { central: 'B', ligandos: ['Cl', 'Cl', 'Cl'], texto: 'BCl₃', nombre: 'tricloruro de boro' },
    'AlCl3': { central: 'Al', ligandos: ['Cl', 'Cl', 'Cl'], texto: 'AlCl₃', nombre: 'cloruro de aluminio (molécula aislada)' },
    'BeCl2': { central: 'Be', ligandos: ['Cl', 'Cl'], texto: 'BeCl₂', nombre: 'cloruro de berilio (molécula aislada)' },
    'PCl5': { central: 'P', ligandos: ['Cl', 'Cl', 'Cl', 'Cl', 'Cl'], texto: 'PCl₅', nombre: 'pentacloruro de fósforo' },
    'SF4': { central: 'S', ligandos: ['F', 'F', 'F', 'F'], texto: 'SF₄', nombre: 'tetrafluoruro de azufre' },
    'ClF3': { central: 'Cl', ligandos: ['F', 'F', 'F'], texto: 'ClF₃', nombre: 'trifluoruro de cloro' },
    'SF6': { central: 'S', ligandos: ['F', 'F', 'F', 'F', 'F', 'F'], texto: 'SF₆', nombre: 'hexafluoruro de azufre' },
    'BrF5': { central: 'Br', ligandos: ['F', 'F', 'F', 'F', 'F'], texto: 'BrF₅', nombre: 'pentafluoruro de bromo' },
    'XeF2': { central: 'Xe', ligandos: ['F', 'F'], texto: 'XeF₂', nombre: 'difluoruro de xenón' },
    'XeF4': { central: 'Xe', ligandos: ['F', 'F', 'F', 'F'], texto: 'XeF₄', nombre: 'tetrafluoruro de xenón' },
    'I3^-': { central: 'I', ligandos: ['I', 'I'], carga: -1, texto: 'I₃⁻', nombre: 'ion triyoduro' },
    'ICl4^-': { central: 'I', ligandos: ['Cl', 'Cl', 'Cl', 'Cl'], carga: -1, texto: 'ICl₄⁻', nombre: 'ion tetracloroyodato' },
    'NH4^+': { central: 'N', ligandos: ['H', 'H', 'H', 'H'], carga: 1, texto: 'NH₄⁺', nombre: 'ion amonio' },
    'H3O^+': { central: 'O', ligandos: ['H', 'H', 'H'], carga: 1, texto: 'H₃O⁺', nombre: 'ion hidronio' },
    'NO2^-': { central: 'N', ligandos: ['O', 'O'], carga: -1, texto: 'NO₂⁻', nombre: 'ion nitrito' },
    'NO3^-': { central: 'N', ligandos: ['O', 'O', 'O'], carga: -1, texto: 'NO₃⁻', nombre: 'ion nitrato' },
    'CO3^2-': { central: 'C', ligandos: ['O', 'O', 'O'], carga: -2, texto: 'CO₃²⁻', nombre: 'ion carbonato' },
    'SO3^2-': { central: 'S', ligandos: ['O', 'O', 'O'], carga: -2, texto: 'SO₃²⁻', nombre: 'ion sulfito' },
    'SO4^2-': { central: 'S', ligandos: ['O', 'O', 'O', 'O'], carga: -2, texto: 'SO₄²⁻', nombre: 'ion sulfato' },
    'PO4^3-': { central: 'P', ligandos: ['O', 'O', 'O', 'O'], carga: -3, texto: 'PO₄³⁻', nombre: 'ion fosfato' },
    'ClO4^-': { central: 'Cl', ligandos: ['O', 'O', 'O', 'O'], carga: -1, texto: 'ClO₄⁻', nombre: 'ion perclorato' },
  };

  const SUB = { 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆' }, SUP = { 1: '', 2: '²', 3: '³' };
  // Fórmula en texto a partir del central y los ligandos (orden: central y luego los ligandos por orden de aparición).
  function textoDe(central, ligandos, carga) {
    const cuenta = new Map();
    for (const l of ligandos) cuenta.set(l, (cuenta.get(l) || 0) + 1);
    let t = central;
    for (const [l, k] of cuenta) t += l + (k > 1 ? SUB[k] : '');
    if (carga) t += SUP[Math.abs(carga)] + (carga > 0 ? '⁺' : '⁻');
    return t;
  }
  function spec(x) {
    let o;
    if (typeof x === 'string') {
      const m = MOLECULAS[x];
      if (!m) throw new Error(`molécula desconocida: ${x}`);
      o = { ...m, clave: x };
    } else if (x && typeof x === 'object' && x.central) o = { ...x };
    else throw new Error('no entiendo la molécula: usa una clave del catálogo o { central, ligandos }');
    elemento(o.central);
    if (!Array.isArray(o.ligandos) || o.ligandos.length < 2 || o.ligandos.length > 6) throw new Error('hacen falta de 2 a 6 ligandos');
    for (const l of o.ligandos) elemento(l);
    o.carga = o.carga || 0;
    if (!Number.isInteger(o.carga) || Math.abs(o.carga) > 3) throw new Error('carga fuera de rango');
    if (o.paresLibres !== undefined && (!Number.isInteger(o.paresLibres) || o.paresLibres < 0 || o.ligandos.length + o.paresLibres > 6))
      throw new Error('pares libres fuera de rango: a lo más 6 dominios');
    if (!o.texto) o.texto = textoDe(o.central, o.ligandos, o.carga);
    return o;
  }

  const HALOGENO = s => elemento(s).grupo === 17;
  const PRESTA = s => ['O', 'S', 'N', 'C'].includes(s); // terminales que pueden formar enlace múltiple
  const INCOMPLETO = s => [2, 13].includes(elemento(s).grupo); // Be, Mg, B, Al: no completan el octeto

  // ----- Lewis -----
  function lewisDe(o) {
    const c = elemento(o.central), n = o.ligandos.length;
    const V = c.valencia + o.ligandos.reduce((t, l) => t + elemento(l).valencia, 0) - o.carga;
    if (V % 2) throw new Error(`número impar de electrones (${V}): el motor no dibuja radicales como el NO₂`);
    const orden = o.ligandos.map(() => 1);
    const libresL = o.ligandos.map(l => (l === 'H' ? 0 : 3));
    const resto = V - 2 * n - 2 * libresL.reduce((a, b) => a + b, 0);
    if (resto < 0) throw new Error('faltan electrones para unir los ligandos');
    let libresC = resto / 2;
    const cfL = i => elemento(o.ligandos[i]).valencia - 2 * libresL[i] - orden[i];
    const enl = () => orden.reduce((a, b) => a + b, 0);
    const cfC = () => c.valencia - 2 * libresC - enl();
    // Octeto del central: un terminal le presta un par (al de menor orden, y entre iguales al primero).
    if (!INCOMPLETO(o.central)) {
      while (2 * enl() + 2 * libresC < 8) {
        let k = -1;
        for (let i = 0; i < n; i++) if (PRESTA(o.ligandos[i]) && libresL[i] > 0 && orden[i] < 3 && (k < 0 || orden[i] < orden[k])) k = i;
        if (k < 0) break;
        orden[k]++; libresL[k]--;
      }
    }
    // Período 3 o más: O y S terminales con carga formal negativa forman doble enlace mientras el central sea positivo.
    if (c.periodo >= 3) {
      while (cfC() > 0) {
        let k = -1;
        for (let i = 0; i < n; i++) if ((o.ligandos[i] === 'O' || o.ligandos[i] === 'S') && cfL(i) < 0 && libresL[i] > 0) { k = i; break; }
        if (k < 0) break;
        orden[k]++; libresL[k]--;
      }
    }
    const eC = 2 * enl() + 2 * libresC;
    const ligandos = o.ligandos.map((s, i) => ({ simbolo: s, orden: orden[i], paresLibres: libresL[i], cf: cfL(i) }));
    const sumaCF = cfC() + ligandos.reduce((t, l) => t + l.cf, 0);
    // Resonancia: maneras de repartir los enlaces múltiples entre ligandos iguales que pueden tenerlos.
    let resonancia = 1;
    const grupos = new Map();
    o.ligandos.forEach((s, i) => { if (PRESTA(s)) { const g = grupos.get(s) || []; g.push(i); grupos.set(s, g); } });
    for (const g of grupos.values()) {
      const dobles = g.filter(i => orden[i] === 2).length, triples = g.filter(i => orden[i] === 3).length;
      if (triples === 0) resonancia *= comb(g.length, dobles);
    }
    const r = {
      formula: o.texto, central: o.central, carga: o.carga, electrones: V, sigma: n, pi: enl() - n,
      paresEnlazantes: enl(), paresLibres: libresC, ligandos, cfCentral: cfC(), sumaCF,
      electronesCentral: eC, octeto: eC < 8 ? 'incompleto' : eC === 8 ? 'completo' : 'expandido', resonancia, errores: {},
    };
    // Errores típicos.
    if (o.carga !== 0) { r.errores['ignora-la-carga'] = V + o.carga; r.errores['carga-al-reves'] = V + 2 * o.carga; }
    const comb1 = [o.central, ...o.ligandos].map(s => elemento(s).valenciaComb);
    if (comb1.every(v => v !== null)) {
      const Vc = comb1.reduce((a, b) => a + b, 0) - o.carga;
      r.errores['valencia-como-enlaces'] = Vc;
      r.errores['libres-valencia-como-enlaces'] = Math.max(0, Math.floor((Vc - 2 * n - 2 * o.ligandos.reduce((t, l) => t + (l === 'H' ? 0 : 3), 0)) / 2));
    }
    const nO = [o.central, ...o.ligandos].filter(s => s === 'O').length;
    if (nO) r.errores['valencia-del-O'] = V - 4 * nO;
    r.errores['libres-electrones-como-pares'] = 2 * libresC;
    r.errores['libres-octeto-todo-libre'] = eC / 2;
    return r;
  }
  function comb(a, b) { let r = 1; for (let i = 0; i < b; i++) r = r * (a - i) / (i + 1); return Math.round(r); }
  const lewis = x => lewisDe(spec(x));

  // ----- VSEPR -----
  const GEO_DOM = { 2: 'lineal', 3: 'trigonal plana', 4: 'tetraédrica', 5: 'bipirámide trigonal', 6: 'octaédrica' };
  const GEO = { '2,0': 'lineal', '3,0': 'trigonal plana', '2,1': 'angular', '4,0': 'tetraédrica', '3,1': 'piramidal trigonal',
    '2,2': 'angular', '5,0': 'bipirámide trigonal', '4,1': 'balancín', '3,2': 'forma de T', '2,3': 'lineal',
    '6,0': 'octaédrica', '5,1': 'pirámide cuadrada', '4,2': 'cuadrada plana' };
  const HIB = { 2: 'sp', 3: 'sp2', 4: 'sp3', 5: 'sp3d', 6: 'sp3d2' };
  const PLANO = { 2: 'lineal', 3: 'trigonal plana', 4: 'cuadrada plana', 5: 'pentagonal plana', 6: 'hexagonal plana' };

  const S3 = Math.sqrt(3), R89 = Math.sqrt(8 / 9);
  const norm = v => { const l = Math.hypot(v[0], v[1], v[2]); return l ? v.map(x => x / l) : [0, 0, 0]; };
  // Dominios en orden de llenado; los pares libres toman sus lugares primero (ver idx).
  function posiciones(n, m) {
    if (!Number.isInteger(n) || !Number.isInteger(m) || n < 2 || m < 0 || n + m > 6 || n + m < 2) throw new Error('dominios fuera de rango (2 a 6, con 2 ligandos o más)');
    const d = n + m;
    if (!GEO[n + ',' + m]) throw new Error(`AX${n}E${m}: combinación sin geometría en el modelo`);
    let lig, par;
    if (d === 2) { lig = [[-1, 0, 0], [1, 0, 0]]; par = []; }
    else if (d === 3) {
      const t = [[0, 1, 0], [-S3 / 2, -0.5, 0], [S3 / 2, -0.5, 0]];
      par = t.slice(0, m); lig = t.slice(m);
    } else if (d === 4) {
      if (m === 0) lig = [[1, 1, 1], [-1, 1, -1], [-1, -1, 1], [1, -1, -1]].map(norm);
      else if (m === 1) {
        par = [[0, 1, 0]];
        lig = [-90, 30, 150].map(a => [R89 * Math.cos(a * Math.PI / 180), -1 / 3, -R89 * Math.sin(a * Math.PI / 180)]);
      } else { par = [[-1, 1, -1], [1, 1, 1]].map(norm); lig = [[-1, -1, 1], [1, -1, -1]].map(norm); }
    } else if (d === 5) {
      const ax = [[0, 1, 0], [0, -1, 0]], eq = [[0, 0, 1], [S3 / 2, 0, -0.5], [-S3 / 2, 0, -0.5]];
      par = eq.slice(0, m); lig = [...ax, ...eq.slice(m)];
    } else {
      if (m === 0) lig = [[0, 1, 0], [0, -1, 0], [1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1]];
      else if (m === 1) { par = [[0, 1, 0]]; lig = [[0, -1, 0], [1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1]]; }
      else { par = [[0, 1, 0], [0, -1, 0]]; lig = [[1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1]]; }
    }
    return { ligandos: lig.map(v => v.slice()), pares: (par || []).map(v => v.slice()) };
  }
  const grados = (a, b) => Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]))) * 180 / Math.PI;
  function angulosDe(lig) {
    const vs = [];
    for (let i = 0; i < lig.length; i++) for (let j = i + 1; j < lig.length; j++) {
      const g = grados(lig[i], lig[j]);
      if (!vs.some(v => Math.abs(v - g) < 1e-6)) vs.push(g);
    }
    return vs.sort((a, b) => a - b);
  }
  function nm(x) {
    if (x && typeof x === 'object' && !x.central && Number.isInteger(x.n)) return { n: x.n, m: x.m || 0, o: null };
    const o = spec(x);
    const m = o.paresLibres !== undefined ? o.paresLibres : lewisDe(o).paresLibres;
    return { n: o.ligandos.length, m, o };
  }
  function vsepr(x) {
    const { n, m, o } = nm(x);
    const p = posiciones(n, m), d = n + m, ang = angulosDe(p.ligandos);
    const r = { n, m, dominios: d, AXE: 'AX' + n + (m ? 'E' + (m > 1 ? m : '') : ''), geometriaDominios: GEO_DOM[d],
      geometria: GEO[n + ',' + m], hibridacion: HIB[d], angulos: ang, anguloMenor: ang[0], errores: {} };
    r.errores['dibujo-plano'] = PLANO[n];
    r.errores['cuenta-solo-los-ligandos'] = GEO[n + ',0'];
    r.errores['geometria-de-dominios'] = GEO_DOM[d];
    r.errores['par-libre-dobla'] = m > 0 ? 'angular' : GEO[n + ',0'];
    r.errores['hibridacion-solo-ligandos'] = HIB[Math.max(2, n)];
    if (o) {
      const v = Math.min(6, Math.max(2, elemento(o.central).valencia));
      r.errores['hibridacion-por-electrones'] = HIB[v];
      r.errores['hibridacion-por-subcapas'] = 'sp'; // "tiene electrones en s y en p" (EN12)
    }
    return r;
  }

  // ----- El dibujo de Lewis en el papel (z = 0) -----
  // Hasta 4 dominios: arriba, abajo, izquierda, derecha. Los ligandos van primero a izquierda y derecha (y los iguales,
  // opuestos), después abajo y arriba; los pares libres llenan lo que queda, primero arriba. Con 5 o 6 dominios, los
  // ligandos se reparten en ángulos iguales desde la izquierda y cada par libre va al hueco más amplio (cada 15°).
  function posicionesPlano(x) {
    const { n, m, o } = nm(x);
    const ligs = o ? o.ligandos : Array(n).fill('X');
    const dir = g => [Math.cos(g * Math.PI / 180), Math.sin(g * Math.PI / 180), 0];
    const L = [], P = [];
    if (n + m <= 4) {
      const slotsL = n === 2 ? [180, 0] : n === 3 ? [180, 0, 270] : [180, 0, 90, 270];
      // Emparejar los iguales: el par (180, 0) y el par (90, 270).
      const orden = [], usados = new Set();
      const porEl = new Map(); ligs.forEach((s, i) => { const g = porEl.get(s) || []; g.push(i); porEl.set(s, g); });
      const pares = [];
      for (const g of porEl.values()) for (let k = 0; k + 1 < g.length; k += 2) pares.push([g[k], g[k + 1]]);
      const posPar = n === 4 ? [[0, 1], [2, 3]] : [[0, 1]];
      const asign = Array(n).fill(null);
      pares.slice(0, posPar.length).forEach(([a, b], k) => { asign[posPar[k][0]] = a; asign[posPar[k][1]] = b; usados.add(a); usados.add(b); });
      const resto = ligs.map((_, i) => i).filter(i => !usados.has(i));
      for (let s = 0; s < n; s++) if (asign[s] === null) asign[s] = resto.shift();
      for (let s = 0; s < n; s++) orden[asign[s]] = slotsL[s];
      orden.forEach((g, i) => { L[i] = dir(g); });
      const libres = [90, 270, 180, 0].filter(g => !slotsL.includes(g));
      for (let k = 0; k < m; k++) P.push(dir(libres[k]));
    } else {
      const angL = ligs.map((_, i) => 180 - 360 * i / n);
      angL.forEach((g, i) => { L[i] = dir(g); });
      const ocup = angL.slice();
      const dist = (a, b) => { const d = Math.abs(((a - b) % 360 + 360) % 360); return Math.min(d, 360 - d); };
      const angP = [];
      for (let k = 0; k < m; k++) {
        let mejor = null, md = -1, mp = -1;
        for (let g = 90; g < 450; g += 15) {
          const dd = Math.min(...ocup.map(a => dist(a, g))), dp = angP.length ? Math.min(...angP.map(a => dist(a, g))) : 0;
          if (dd > md + 1e-9 || (Math.abs(dd - md) < 1e-9 && dp > mp + 1e-9)) { md = dd; mp = dp; mejor = g % 360; }
        }
        ocup.push(mejor); angP.push(mejor); P.push(dir(mejor));
      }
    }
    return { ligandos: L.map(v => v.map(c => (Math.abs(c) < 1e-12 ? 0 : c))), pares: P.map(v => v.map(c => (Math.abs(c) < 1e-12 ? 0 : c))) };
  }

  // ----- Polaridad -----
  const suma = vs => vs.reduce((t, v) => [t[0] + v[0], t[1] + v[1], t[2] + v[2]], [0, 0, 0]);
  const TOL = 1e-9;
  function dipolos(o, dirs) {
    const enC = elemento(o.central).en;
    const enlaces = o.ligandos.map((s, i) => { const d = elemento(s).en - enC; return { simbolo: s, dEN: d, vector: dirs[i].map(c => c * d) }; });
    const total = suma(enlaces.map(e => e.vector)).map(c => (Math.abs(c) < 1e-12 ? 0 : c));
    const modulo = Math.hypot(...total);
    return { enlaces, total, modulo, polar: modulo > TOL };
  }
  const SIMETRICAS = ['lineal', 'trigonal plana', 'tetraédrica', 'bipirámide trigonal', 'octaédrica', 'cuadrada plana'];
  function polaridad(x) {
    const { n, m, o } = nm(x);
    if (!o) throw new Error('para la polaridad hacen falta los átomos');
    const p = posiciones(n, m), r = dipolos(o, p.ligandos);
    const plano = dipolos(o, posicionesPlano({ ...o, paresLibres: m }).ligandos);
    const distintos = new Set([o.central, ...o.ligandos]).size > 1;
    r.errores = {
      'dibujo-plano': plano.polar,
      'simetrica-apolar': SIMETRICAS.includes(GEO[n + ',' + m]) ? false : r.polar,
      'atomos-distintos': distintos,
      'enlaces-polares': r.enlaces.some(e => tipoPorCorte(Math.abs(e.dEN)) !== 'covalente apolar'),
    };
    r.moduloPlano = plano.modulo;
    return r;
  }

  // ----- Tipo de enlace por ΔEN -----
  const r2 = v => Math.round(v * 100) / 100;
  const tipoPorCorte = d => (r2(d) >= 1.7 ? 'iónico' : r2(d) >= 0.4 ? 'covalente polar' : 'covalente apolar');
  function tipoEnlace(a, b) {
    const A = elemento(a), B = elemento(b), d = r2(Math.abs(A.en - B.en));
    const corte = tipoPorCorte(d);
    const porAtomos = A.metal !== B.metal ? 'iónico' : A.metal ? 'metálico' : 'covalente';
    const coincide = porAtomos === 'iónico' ? corte === 'iónico' : porAtomos === 'covalente' ? corte !== 'iónico' : false;
    const r = { dEN: d, tipo: corte, porAtomos, coincide, mas: A.en === B.en ? null : (A.en > B.en ? a : b), errores: {} };
    if (a === 'H' || b === 'H') {
      const otro = a === 'H' ? B : A;
      r.errores['H-como-metal'] = otro.metal ? 'metálico' : 'iónico';
    }
    return r;
  }

  // ----- Todo junto -----
  function molecula(x) {
    const o = spec(x);
    let lw = null, error = null;
    try { lw = lewisDe(o); } catch (e) { error = e.message; }
    const m = o.paresLibres !== undefined ? o.paresLibres : (lw ? lw.paresLibres : null);
    if (m === null) throw new Error(error);
    const o2 = { ...o, paresLibres: m };
    const v = vsepr(o2), pos = posiciones(o.ligandos.length, m), pol = polaridad(o2);
    return { formula: o.texto, nombre: o.nombre || '', clave: o.clave || null, central: o.central, ligandos: o.ligandos.slice(), carga: o.carga,
      lewis: lw, lewisError: error, lewisCoincide: !!lw && lw.paresLibres === m, paresLibres: m,
      vsepr: v, posiciones: pos, plano: posicionesPlano(o2), polaridad: pol,
      enlaces: o.ligandos.map(l => tipoEnlace(o.central, l)) };
  }

  // ----- Resonancia -----
  function resonancia(x) {
    const o = spec(x), lw = lewisDe(o), n = o.ligandos.length;
    const base = lw.ligandos.map(l => l.orden);
    // Ligandos equivalentes con enlace múltiple posible: los del mismo elemento que en la estructura tienen orden 1 o 2.
    const grupos = new Map();
    o.ligandos.forEach((s, i) => { if (PRESTA(s) && base[i] < 3) { const g = grupos.get(s) || []; g.push(i); grupos.set(s, g); } });
    let estructuras = [base.slice()];
    for (const g of grupos.values()) {
      const dobles = g.filter(i => base[i] === 2).length, nuevas = [];
      for (const est of estructuras) for (const sel of combinaciones(g, dobles)) {
        const e = est.slice(); g.forEach(i => { e[i] = sel.includes(i) ? 2 : 1; }); nuevas.push(e);
      }
      estructuras = nuevas;
    }
    const enC = elemento(o.central).valencia;
    const salida = estructuras.map(ord => ({
      ordenes: ord,
      cf: ord.map((k, i) => elemento(o.ligandos[i]).valencia - 2 * (lw.ligandos[i].paresLibres + base[i] - k) - k),
      cfCentral: enC - 2 * lw.paresLibres - ord.reduce((a, b) => a + b, 0),
    }));
    const promedio = Array.from({ length: n }, (_, i) => salida.reduce((t, s) => t + s.ordenes[i], 0) / salida.length);
    return { formula: o.texto, cuantas: salida.length, estructuras: salida, ordenPromedio: promedio, mismasPosiciones: true,
      errores: { 'atomos-se-mueven': 'cambian las posiciones', 'alterna-entre-estructuras': salida.length } };
  }
  function combinaciones(arr, k) {
    if (k === 0) return [[]];
    if (arr.length < k) return [];
    const [a, ...r] = arr;
    return [...combinaciones(r, k - 1).map(c => [a, ...c]), ...combinaciones(r, k)];
  }

  // ----- Red del NaCl -----
  function redNaCl(lado, esquina) {
    if (!Number.isInteger(lado) || lado < 1 || lado > 8) throw new Error('lado fuera de rango (1 a 8)');
    const e = esquina || 'Na';
    if (e !== 'Na' && e !== 'Cl') throw new Error('la esquina es Na o Cl');
    const otro = e === 'Na' ? 'Cl' : 'Na', iones = [];
    for (let i = 0; i < lado; i++) for (let j = 0; j < lado; j++) for (let k = 0; k < lado; k++) iones.push({ i, j, k, ion: (i + j + k) % 2 === 0 ? e : otro });
    const Na = iones.filter(q => q.ion === 'Na').length, Cl = iones.length - Na;
    return { lado, iones, Na, Cl, total: iones.length, moleculas: 0, coordinacion: 6, razon: Na === Cl ? '1:1' : `${Na}:${Cl}`,
      errores: { 'pares-como-moleculas': Math.min(Na, Cl), 'una-molecula-gigante': 1, 'cada-ion-una-molecula': iones.length } };
  }
  function vecinos(lado, p) {
    const [i, j, k] = p, v = [];
    if (![i, j, k].every(c => Number.isInteger(c) && c >= 0 && c < lado)) throw new Error('ion fuera del trozo');
    for (const [a, b, c] of [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]) {
      const q = [i + a, j + b, k + c];
      if (q.every(t => t >= 0 && t < lado)) v.push(q);
    }
    return v;
  }

  // ----- Para dibujar -----
  function girar(v, giro, inc) {
    const cg = Math.cos(giro || 0), sg = Math.sin(giro || 0), ci = Math.cos(inc || 0), si = Math.sin(inc || 0);
    const x = v[0] * cg + v[2] * sg, z1 = -v[0] * sg + v[2] * cg;
    return [x, v[1] * ci - z1 * si, v[1] * si + z1 * ci];
  }
  // f = 0: el dibujo de Lewis en el papel; f = 1: la molécula en 3D girada. El dipolo total es la suma de las flechas
  // que se ven en ese momento (en el papel, la del dibujo plano).
  function dibujo(x, op) {
    const mo = x && x.vsepr ? x : molecula(x), o = op || {};
    const f = o.f === undefined ? 1 : Math.max(0, Math.min(1, o.f));
    const mez = (a, b) => [0, 1, 2].map(i => a[i] * (1 - f) + b[i] * f);
    const g = v => girar(v, o.giro, o.inclinacion);
    const L = mo.posiciones.ligandos.map((v, i) => mez(mo.plano.ligandos[i], g(v)));
    const P = mo.posiciones.pares.map((v, i) => mez(mo.plano.pares[i], g(v)));
    const enC = elemento(mo.central).en;
    const ligandos = L.map((p, i) => {
      const d = elemento(mo.ligandos[i]).en - enC, u = norm(p);
      return { simbolo: mo.ligandos[i], pos: p, dir: u, dEN: d, dip: u.map(c => c * d) };
    });
    const total = suma(ligandos.map(l => l.dip));
    return { ligandos, pares: P.map(p => ({ pos: p, dir: norm(p) })), total, modulo: Math.hypot(...total) };
  }

  return { DATOS, MOLECULAS, elemento, spec, lewis, vsepr, posiciones, posicionesPlano, polaridad, molecula, tipoEnlace,
    resonancia, redNaCl, vecinos, girar, dibujo, tipoPorCorte, TOL };
});
