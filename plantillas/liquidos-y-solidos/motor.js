/*
 * Motor de Líquidos y sólidos: presión de vapor, ebullición, fuerzas intermoleculares y diagramas de fases.
 *
 * Aquí vive toda la química de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el navegador
 * (window.MotorLiquidos) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * Unidades: temperatura en °C (K = °C + 273,15); presión en mmHg (1 atm = 760 mmHg = 101 325 Pa; 1 mmHg = 133,322 Pa,
 * el mismo factor del motor de calorimetría), salvo en los diagramas de fases, que van en atm; volumen en L.
 * R = 62,36 mmHg·L/(mol·K) (0,082 atm·L/(mol·K) por 760) en PV = nRT; R = 8,314 J/(mol·K) en Clausius–Clapeyron.
 *
 * Funciones (liq es 'agua', 'etanol' o 'acetona'; s es una sustancia de SUSTANCIAS, como 'H2O', 'NH3' o 'butano'):
 *  - presionVapor(liq, T): { mmHg, atm, kPa, tramo, extrapolado }. Ecuación de Antoine log10(P/mmHg) = A − B/(C + T).
 *  - ebullicion(liq, P): { T, extrapolado }: la temperatura a la que la presión de vapor iguala P (mmHg).
 *  - presionAltitud(h): presión del aire en Pa a h metros (atmósfera estándar ISA, la misma de calorimetría).
 *  - ebullicionAltitud(liq, h): { Pa, mmHg, T }.
 *  - hierve(liq, T, Pext): { Pv, Pext, Teb, hierve (Pv ≥ Pext), Tliquido (un líquido abierto no pasa de Teb) }.
 *  - ebullicionLugar(h, Tnormal?): { T, comparada ('menor' | 'igual' | 'mayor' que a 1 atm), errores }: el agua en un
 *    lugar a h metros. errores: 'siempre-a-100' (100), 'pv-igual-hierve-igual' (100: «su presión de vapor es la misma en
 *    todas partes, así que hierve igual»), 'frio-hierve-mas' ('mayor').
 *  - ollaPresion(Pabs): { T, errores: { 'olla-sigue-en-100': 100, 'doble-presion-doble-T': 100 × Pabs/760,
 *    'presion-ayuda-a-escapar': 'menor' } }.
 *  - SUSTANCIAS[s]: { texto, nombre, M (g/mol), Teb (°C, normal), nC, atomos [{ el, x, y }], enlaces [[i, j]] }.
 *  - puentesH(s): { forma (entre sus propias moléculas), donador (un H unido a F, O o N), aceptor (un F, O o N con par
 *    libre), errores: { 'tiene-oxigeno', 'tiene-F-o-N', 'H-y-electronegativo' } } (lo que diría cada regla errónea).
 *  - puenteHEntre(a, b): { hay, desde ('a' | 'b'), h (índice del H donador), aceptor (índice del átomo que recibe) }.
 *  - quienesFormanPuentes(lista): { forman [s...], errores: { 'tiene-oxigeno', 'tiene-F-o-N', 'H-y-electronegativo' } }.
 *  - ordenEbullicion(lista): { orden (de mayor a menor Teb), Teb [...], errores: { 'por-masa', 'por-carbonos' } }.
 *  - razonEbullicion(a, b): { mayor, razon ('puentes-de-hidrogeno' | 'superficie-de-contacto' | 'tamano-de-la-nube'),
 *    puentesA, puentesB, errores: { 'por-masa', 'por-carbonos', 'enlace-interno', 'ramificada-mas-unida' } }: quién hierve
 *    más alto y por qué; cada error dice a quién elegiría ('iguales' si no distingue).
 *  - gasSobreAgua(Ptotal, T, V?): { Pv, Pgas = Ptotal − Pv, n (mol, si hay V), errores: { 'no-resta': Ptotal,
 *    'suma-el-vapor': Ptotal + Pv, 'reparte-a-medias': Ptotal/2, 'n-sin-restar' } }.
 *  - humedadRelativa(p, T, Ptotal?): { Pv, HR (%), rocio (°C), errores: { 'fraccion-del-aire': 100·p/Ptotal,
 *    'invierte': 100·Pv/p } }. vaporDesdeHR(HR, T): { p, rocio }.
 *  - equilibrioCerrado(liq, T, V, nLiquido?): { P, nVapor, quedaLiquido }: frasco cerrado sin aire. Mientras quede líquido,
 *    P es la presión de vapor; si todo se evapora, P = nRT/V.
 *  - compararFrascos(liq, T, [V1, V2], nLiquido?): { P [P1, P2], nVapor [...], iguales, errores: {
 *    'mas-volumen-mas-presion' [P, P·V2/V1], 'se-reparte-como-gas' [P, P·V1/V2], 'cerrado-no-evapora' [0, 0] } } (GQ18).
 *  - Caja de partículas (2D, determinística con semilla): crearCaja({ liq, T, W, H, escala, rapidez, semilla, llena }),
 *    pasoCaja(caja, dt), cambiarT(caja, T), lecturaCaja(caja) → { vapor, densidad, densidadEq, presion, presionMedia
 *    (promedio móvil de 1,5 s), presionEq, evaporan, condensan (por segundo, ventana de 2 s), t }; ritmoEquilibrio(caja). Cada figura es una molécula entera.
 *  - rejillaLiquido(W, prof, d, t, semilla): moléculas del líquido [{ x, y, ang }] (y < 0, bajo la superficie);
 *    vecinosRejilla(pos, dmax): pares de vecinas. burbuja(R, n, semilla): moléculas dentro de una burbuja.
 *  - condensacion(n, W, H, d, semilla): { gas [...], liquido [...], radio } para el gas que se enfría (GQ16).
 *  - FASES[s] ('agua' | 'co2'): triple, critico (T en °C, P en atm) y datos de las curvas. presionCurva(s, curva, T) con
 *    curva 'vaporizacion' | 'sublimacion' | 'fusion' (atm). fase(s, P, T): 'sólido' | 'líquido' | 'gas' | 'supercrítico'.
 *    calentarAPresion(s, P, T1, T2): { cambios [{ de, a, T }], errores: { 'se-derrite-como-el-agua' } }.
 *
 * Datos de tabla (por verificar con la tabla que use el colegio):
 *  - Antoine (mmHg, °C), constantes de uso común (Dortmund Data Bank, como las reproducen muchas tablas): agua 8,07131;
 *    1730,63; 233,426 (de 1 a 100 °C, las mismas del motor de calorimetría) y 8,14019; 1810,94; 244,485 (de 99 a
 *    374 °C; el motor la usa sobre 100 °C; las dos difieren 0,6 % a 100 °C, así que entre 760,1 y 764,3 mmHg el agua
 *    hierve a 100,0 °C); etanol 8,20417; 1642,89; 230,300 (de −57 a 80 °C); acetona 7,11714; 1210,595; 229,664
 *    (de −13 a 55 °C). Fuera del rango, el motor extrapola y lo avisa (extrapolado: true).
 *  - Atmósfera estándar (ISA, troposfera): P = 101 325 · (1 − 2,25577·10⁻⁵ · h)^5,25588 Pa.
 *  - Puntos de ebullición normales (°C, CRC Handbook): CH₄ −161,5; NH₃ −33,3; H₂O 100,0; HF 19,5; H₂S −60,3;
 *    H₂Se −41,3; CH₃F −78,4; CH₃OCH₃ −24,8; CH₃OH 64,7; CH₃NH₂ −6,3; C₂H₅OH 78,3; acetona 56,1; n-butano −0,5;
 *    isobutano −11,7; n-pentano 36,1; neopentano 9,5. Masas molares con las masas atómicas de la IUPAC.
 *  - Agua: punto triple 0,01 °C y 611,657 Pa (0,0060365 atm); punto crítico 373,946 °C y 22,064 MPa (217,75 atm);
 *    sublimación por Clausius–Clapeyron desde el punto triple con ΔH_sub = 51,06 kJ/mol; fusión por Clapeyron, recta
 *    desde el punto triple con pendiente −13,46 MPa/K (ΔH_fus 6,01 kJ/mol y ΔV −1,63 cm³/mol); vaporización por Antoine.
 *  - CO₂ (presiones de tabla en Pa, que el motor pasa a atm dividiendo entre 101 325): punto triple −56,558 °C y
 *    517,95 kPa (5,1118 atm); punto crítico 30,978 °C y 7,3773 MPa (72,808 atm);
 *    sublimación normal −78,464 °C a 1 atm. Sublimación: Clausius–Clapeyron por el punto triple y por la sublimación
 *    normal; vaporización: Clausius–Clapeyron por el punto triple y el crítico; fusión: recta desde el punto triple con
 *    la pendiente inicial de la curva de fusión de Span y Wagner (1996), 4,676 MPa/K. Son curvas de modelo: dan la forma
 *    del diagrama y los puntos de tabla, no la presión exacta en cada temperatura.
 *
 * Convenciones:
 *  - Puente de hidrógeno (EN15): un H unido directamente a F, O o N de una molécula y un F, O o N con par libre en la
 *    otra. Todos los F, O y N de las sustancias del catálogo tienen pares libres. Entre moléculas iguales, hace falta que
 *    la sustancia tenga las dos cosas.
 *  - Orden de ebullición: el que da la tabla. razonEbullicion explica la diferencia: primero los puentes de hidrógeno;
 *    entre moléculas sin ellos y de igual fórmula, la superficie de contacto (la cadena recta toca más que la ramificada);
 *    si no, el tamaño de la nube de electrones (más masa molar, más dispersión).
 *  - Caja: 2D; las moléculas de vapor van con rapidez fija (proporcional a √T), rebotan en las paredes y la tapa y se
 *    quedan en el líquido cuando tocan la superficie. Del líquido salen moléculas a un ritmo fijo por unidad de largo,
 *    con dirección según la ley del coseno. En equilibrio, la densidad del vapor es π·e/v (e, ritmo de evaporación;
 *    v, rapidez): no depende del alto de la caja ni del largo de la superficie. La escala fija esa densidad en
 *    escala · Pv/T(K) moléculas por unidad de área, y la presión que marca la caja es densidad · T(K)/escala.
 *  - Los enlaces dentro de las moléculas nunca se rompen: al evaporar, hervir o condensar, las moléculas salen enteras.
 *
 * Errores típicos (campo 'errores'), para armar las alternativas: GQ18 (la presión de vapor depende del recipiente),
 * GQ19 y Q9 (el agua siempre hierve a 100 °C), EN14 (la fuerza entre moléculas es la del enlace de adentro), EN15 (puente
 * de hidrógeno = tener oxígeno, o tener F o N), EN16 (el punto de ebullición lo decide el número de carbonos), GQ16 (las
 * partículas cambian de tamaño al condensar) y los de cálculo sin respaldo: no restar la presión de vapor al gas recogido
 * sobre agua y la humedad relativa como fracción del aire.
 * CABECERA: líneas 1 a 89 (funciones, unidades, datos y convenciones).
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorLiquidos = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const K0 = 273.15, ATM = 760, MMHG_PA = 133.322, PA_ATM = 101325;
  const R_MMHG = 62.36, R_J = 8.314;

  // ---------------- Presión de vapor (Antoine) ----------------
  const LIQUIDOS = {
    agua: { nombre: 'agua', formula: 'H₂O', sustancia: 'H2O', antoine: [
      { A: 8.07131, B: 1730.63, C: 233.426, Tmin: 1, Tmax: 100 },
      { A: 8.14019, B: 1810.94, C: 244.485, Tmin: 99, Tmax: 374 }] },
    etanol: { nombre: 'etanol', formula: 'C₂H₅OH', sustancia: 'C2H5OH', antoine: [{ A: 8.20417, B: 1642.89, C: 230.300, Tmin: -57, Tmax: 80 }] },
    acetona: { nombre: 'acetona', formula: 'CH₃COCH₃', sustancia: 'acetona', antoine: [{ A: 7.11714, B: 1210.595, C: 229.664, Tmin: -13, Tmax: 55 }] },
  };
  function liquido(liq) {
    const L = LIQUIDOS[liq];
    if (!L) throw new Error(`líquido desconocido: ${liq}`);
    return L;
  }
  const num = (x, que) => {
    const v = Number(x);
    if (!Number.isFinite(v)) throw new Error(`${que} no es un número`);
    return v;
  };
  const antoineP = (k, T) => Math.pow(10, k.A - k.B / (k.C + T));
  const antoineT = (k, P) => k.B / (k.A - Math.log10(P)) - k.C;
  function tramoT(L, T) { return L.antoine.length > 1 && T > 100 ? 1 : 0; }
  function presionVapor(liq, T) {
    const L = liquido(liq); T = num(T, 'T');
    if (T <= -K0) throw new Error('T bajo el cero absoluto');
    const i = tramoT(L, T), k = L.antoine[i];
    const lo = L.antoine[0].Tmin, hi = L.antoine[L.antoine.length - 1].Tmax;
    const mmHg = antoineP(k, T);
    return { mmHg, atm: mmHg / ATM, kPa: mmHg * MMHG_PA / 1000, tramo: i, extrapolado: T < lo || T > hi };
  }
  const pv = (liq, T) => presionVapor(liq, T).mmHg;
  function ebullicion(liq, P) {
    const L = liquido(liq); P = num(P, 'P');
    if (!(P > 0)) throw new Error('la presión tiene que ser positiva');
    let T;
    if (L.antoine.length > 1) {
      const P0 = antoineP(L.antoine[0], 100), P1 = antoineP(L.antoine[1], 100);
      T = P <= P0 ? antoineT(L.antoine[0], P) : P >= P1 ? antoineT(L.antoine[1], P) : 100;
    } else T = antoineT(L.antoine[0], P);
    const lo = L.antoine[0].Tmin, hi = L.antoine[L.antoine.length - 1].Tmax;
    return { T, extrapolado: T < lo || T > hi };
  }

  // ---------------- Altitud (ISA, la misma de calorimetría) ----------------
  function presionAltitud(h) {
    h = num(h, 'h');
    if (h < -500 || h > 11000) throw new Error('altitud fuera de la troposfera del modelo');
    return PA_ATM * Math.pow(1 - 2.25577e-5 * h, 5.25588);
  }
  function ebullicionAltitud(liq, h) {
    const Pa = presionAltitud(h), mmHg = Pa / MMHG_PA;
    return { Pa, mmHg, T: ebullicion(liq, mmHg).T };
  }
  function hierve(liq, T, Pext) {
    T = num(T, 'T'); Pext = num(Pext, 'Pext');
    const Pv = pv(liq, T), Teb = ebullicion(liq, Pext).T;
    return { Pv, Pext, Teb, hierve: Pv >= Pext, Tliquido: Math.min(T, Teb) };
  }
  const comparar = (a, b, tol) => (a < b - tol ? 'menor' : a > b + tol ? 'mayor' : 'igual');
  function ebullicionLugar(h) {
    const e = ebullicionAltitud('agua', h), T1 = ebullicion('agua', ATM).T;
    return { T: e.T, mmHg: e.mmHg, comparada: comparar(e.T, T1, 0.5),
      errores: { 'siempre-a-100': 100, 'pv-igual-hierve-igual': 100, 'frio-hierve-mas': 'mayor' } };
  }
  function ollaPresion(Pabs) {
    Pabs = num(Pabs, 'Pabs');
    const T = ebullicion('agua', Pabs).T, T1 = ebullicion('agua', ATM).T;
    return { T, comparada: comparar(T, T1, 0.5),
      errores: { 'olla-sigue-en-100': 100, 'doble-presion-doble-T': Math.round(T1) * Pabs / ATM, 'presion-ayuda-a-escapar': 'menor' } };
  }

  // ---------------- Sustancias y fuerzas entre moléculas ----------------
  // Coordenadas 2D del dibujo (unidades de un enlace ≈ 1). Las alcanos van con un átomo por grupo CH₃, CH₂ o CH
  // (modelo de átomo unido: 'CH3', 'CH2', 'CH', 'C').
  const SUSTANCIAS = {
    CH4: { texto: 'CH₄', nombre: 'metano', M: 16.04, Teb: -161.5, nC: 1,
      atomos: [['C', 0, 0], ['H', 0, -1], ['H', 0.95, 0.35], ['H', -0.95, 0.35], ['H', 0, 1]], enlaces: [[0, 1], [0, 2], [0, 3], [0, 4]] },
    NH3: { texto: 'NH₃', nombre: 'amoniaco', M: 17.03, Teb: -33.3, nC: 0,
      atomos: [['N', 0, 0], ['H', -0.95, 0.45], ['H', 0.95, 0.45], ['H', 0, 1.05]], enlaces: [[0, 1], [0, 2], [0, 3]] },
    H2O: { texto: 'H₂O', nombre: 'agua', M: 18.02, Teb: 100.0, nC: 0,
      atomos: [['O', 0, 0], ['H', -0.8, 0.6], ['H', 0.8, 0.6]], enlaces: [[0, 1], [0, 2]] },
    HF: { texto: 'HF', nombre: 'fluoruro de hidrógeno', M: 20.01, Teb: 19.5, nC: 0,
      atomos: [['F', 0, 0], ['H', 1, 0]], enlaces: [[0, 1]] },
    H2S: { texto: 'H₂S', nombre: 'sulfuro de hidrógeno', M: 34.08, Teb: -60.3, nC: 0,
      atomos: [['S', 0, 0], ['H', -0.95, 0.75], ['H', 0.95, 0.75]], enlaces: [[0, 1], [0, 2]] },
    H2Se: { texto: 'H₂Se', nombre: 'seleniuro de hidrógeno', M: 80.98, Teb: -41.3, nC: 0,
      atomos: [['Se', 0, 0], ['H', -1.05, 0.8], ['H', 1.05, 0.8]], enlaces: [[0, 1], [0, 2]] },
    CH3F: { texto: 'CH₃F', nombre: 'fluorometano', M: 34.03, Teb: -78.4, nC: 1,
      atomos: [['C', 0, 0], ['F', 1.2, 0], ['H', -0.5, -0.95], ['H', -0.95, 0.3], ['H', -0.3, 1]], enlaces: [[0, 1], [0, 2], [0, 3], [0, 4]] },
    CH3OCH3: { texto: 'CH₃OCH₃', nombre: 'dimetil éter', M: 46.07, Teb: -24.8, nC: 2,
      atomos: [['O', 0, 0], ['C', -1.1, 0.6], ['C', 1.1, 0.6], ['H', -0.62, 1.48], ['H', -1.98, 1.08], ['H', -1.58, -0.28], ['H', 0.62, 1.48], ['H', 1.98, 1.08], ['H', 1.58, -0.28]],
      enlaces: [[0, 1], [0, 2], [1, 3], [1, 4], [1, 5], [2, 6], [2, 7], [2, 8]] },
    CH3OH: { texto: 'CH₃OH', nombre: 'metanol', M: 32.04, Teb: 64.7, nC: 1,
      atomos: [['C', 0, 0], ['O', 1.2, 0], ['H', 1.7, 0.85], ['H', -0.45, -0.95], ['H', -0.95, 0.3], ['H', -0.3, 1]], enlaces: [[0, 1], [1, 2], [0, 3], [0, 4], [0, 5]] },
    CH3NH2: { texto: 'CH₃NH₂', nombre: 'metilamina', M: 31.06, Teb: -6.3, nC: 1,
      atomos: [['C', 0, 0], ['N', 1.2, 0], ['H', 1.7, 0.85], ['H', 1.7, -0.85], ['H', -0.45, -0.95], ['H', -0.95, 0.3], ['H', -0.3, 1]], enlaces: [[0, 1], [1, 2], [1, 3], [0, 4], [0, 5], [0, 6]] },
    C2H5OH: { texto: 'C₂H₅OH', nombre: 'etanol', M: 46.07, Teb: 78.3, nC: 2,
      atomos: [['CH3', -1.2, 0.4], ['CH2', 0, -0.3], ['O', 1.2, 0.4], ['H', 2.1, -0.05]], enlaces: [[0, 1], [1, 2], [2, 3]] },
    acetona: { texto: 'CH₃COCH₃', nombre: 'acetona', M: 58.08, Teb: 56.1, nC: 3,
      atomos: [['CH3', -1.2, 0.5], ['C', 0, -0.2], ['CH3', 1.2, 0.5], ['O', 0, -1.4]], enlaces: [[0, 1], [1, 2], [1, 3]] },
    butano: { texto: 'CH₃CH₂CH₂CH₃', nombre: 'n-butano', M: 58.12, Teb: -0.5, nC: 4,
      atomos: [['CH3', -1.8, 0.35], ['CH2', -0.6, -0.35], ['CH2', 0.6, 0.35], ['CH3', 1.8, -0.35]], enlaces: [[0, 1], [1, 2], [2, 3]] },
    isobutano: { texto: '(CH₃)₃CH', nombre: 'isobutano (2-metilpropano)', M: 58.12, Teb: -11.7, nC: 4,
      atomos: [['CH', 0, 0], ['CH3', 0, -1.2], ['CH3', 1.05, 0.6], ['CH3', -1.05, 0.6]], enlaces: [[0, 1], [0, 2], [0, 3]] },
    pentano: { texto: 'CH₃(CH₂)₃CH₃', nombre: 'n-pentano', M: 72.15, Teb: 36.1, nC: 5,
      atomos: [['CH3', -2.4, 0.35], ['CH2', -1.2, -0.35], ['CH2', 0, 0.35], ['CH2', 1.2, -0.35], ['CH3', 2.4, 0.35]], enlaces: [[0, 1], [1, 2], [2, 3], [3, 4]] },
    neopentano: { texto: 'C(CH₃)₄', nombre: 'neopentano (2,2-dimetilpropano)', M: 72.15, Teb: 9.5, nC: 5,
      atomos: [['C', 0, 0], ['CH3', 0, -1.2], ['CH3', 1.2, 0], ['CH3', 0, 1.2], ['CH3', -1.2, 0]], enlaces: [[0, 1], [0, 2], [0, 3], [0, 4]] },
  };
  for (const [k, s] of Object.entries(SUSTANCIAS)) {
    s.id = k;
    s.atomos = s.atomos.map(([el, x, y]) => ({ el, x, y }));
    s.ramificada = ['isobutano', 'neopentano'].includes(k);
  }
  function sustancia(s) {
    const x = SUSTANCIAS[s];
    if (!x) throw new Error(`sustancia desconocida: ${s}`);
    return x;
  }
  const FON = ['F', 'O', 'N'];
  const unidosA = (x, i) => x.enlaces.filter(e => e[0] === i || e[1] === i).map(e => (e[0] === i ? e[1] : e[0]));
  // Átomos de H unidos directamente a F, O o N (índices).
  const hDonadores = x => x.atomos.map((a, i) => i).filter(i => x.atomos[i].el === 'H' && unidosA(x, i).some(j => FON.includes(x.atomos[j].el)));
  const aceptores = x => x.atomos.map((a, i) => i).filter(i => FON.includes(x.atomos[i].el));
  const tieneH = x => x.atomos.some(a => a.el === 'H' || /^CH/.test(a.el));
  function puentesH(s) {
    const x = sustancia(s), donador = hDonadores(x).length > 0, aceptor = aceptores(x).length > 0;
    const els = x.atomos.map(a => a.el);
    return { forma: donador && aceptor, donador, aceptor,
      errores: {
        'tiene-oxigeno': els.includes('O') && tieneH(x),
        'tiene-F-o-N': (els.includes('F') || els.includes('N')) && tieneH(x),
        'H-y-electronegativo': els.some(e => FON.includes(e)) && tieneH(x),
      } };
  }
  function puenteHEntre(a, b) {
    const A = sustancia(a), B = sustancia(b);
    const dA = hDonadores(A), aB = aceptores(B), dB = hDonadores(B), aA = aceptores(A);
    if (dA.length && aB.length) return { hay: true, desde: 'a', h: dA[0], aceptor: aB[0] };
    if (dB.length && aA.length) return { hay: true, desde: 'b', h: dB[0], aceptor: aA[0] };
    return { hay: false, desde: null, h: null, aceptor: null };
  }
  function quienesFormanPuentes(lista) {
    const ps = lista.map(s => [s, puentesH(s)]);
    const filtro = f => ps.filter(([, p]) => f(p)).map(([s]) => s);
    return { forman: filtro(p => p.forma),
      errores: { 'tiene-oxigeno': filtro(p => p.errores['tiene-oxigeno']), 'tiene-F-o-N': filtro(p => p.errores['tiene-F-o-N']),
        'H-y-electronegativo': filtro(p => p.errores['H-y-electronegativo']) } };
  }
  const porClave = (lista, f) => [...lista].sort((p, q) => f(q) - f(p) || lista.indexOf(p) - lista.indexOf(q));
  function ordenEbullicion(lista) {
    lista.forEach(sustancia);
    const orden = porClave(lista, s => SUSTANCIAS[s].Teb);
    return { orden, Teb: orden.map(s => SUSTANCIAS[s].Teb),
      errores: { 'por-masa': porClave(lista, s => SUSTANCIAS[s].M), 'por-carbonos': porClave(lista, s => SUSTANCIAS[s].nC) } };
  }
  const gana = (a, b, va, vb, tol) => (Math.abs(va - vb) <= (tol || 0) ? 'iguales' : va > vb ? a : b);
  function razonEbullicion(a, b) {
    const A = sustancia(a), B = sustancia(b), pa = puentesH(a).forma, pb = puentesH(b).forma;
    const mayor = gana(a, b, A.Teb, B.Teb);
    let razon;
    if (pa !== pb) razon = 'puentes-de-hidrogeno';
    else if (Math.abs(A.M - B.M) < 0.05 && A.ramificada !== B.ramificada) razon = 'superficie-de-contacto';
    else razon = 'tamano-de-la-nube';
    // 'enlace-interno': el que tiene el enlace X–H más fuerte (el del átomo más pequeño del período más alto); aquí se
    // representa por el átomo central: O > S > Se, F > O > N > C. Solo para pares con H unido a un átomo central.
    const FUERZA = { F: 5, O: 4, N: 3, C: 2, S: 1.5, Se: 1 };
    const central = x => x.atomos[0].el;
    const fa = FUERZA[central(A)] || 0, fb = FUERZA[central(B)] || 0;
    return { mayor, razon, puentesA: pa, puentesB: pb,
      errores: {
        'por-masa': gana(a, b, A.M, B.M, 0.05),
        'por-carbonos': gana(a, b, A.nC, B.nC),
        'enlace-interno': gana(a, b, fa, fb),
        'ramificada-mas-unida': A.ramificada === B.ramificada ? 'iguales' : (A.ramificada ? a : b),
      } };
  }

  // ---------------- Gas recogido sobre agua y humedad ----------------
  function gasSobreAgua(Ptotal, T, V) {
    Ptotal = num(Ptotal, 'Ptotal'); T = num(T, 'T');
    const Pv = pv('agua', T), Pgas = Ptotal - Pv;
    if (Pgas <= 0) throw new Error('la presión total no alcanza la presión de vapor');
    const r = { Pv, Pgas, errores: { 'no-resta': Ptotal, 'suma-el-vapor': Ptotal + Pv, 'reparte-a-medias': Ptotal / 2 } };
    if (V !== undefined) {
      V = num(V, 'V');
      r.n = Pgas * V / (R_MMHG * (T + K0));
      r.errores['n-sin-restar'] = Ptotal * V / (R_MMHG * (T + K0));
    }
    return r;
  }
  function humedadRelativa(p, T, Ptotal) {
    p = num(p, 'p'); T = num(T, 'T');
    const Pv = pv('agua', T);
    const r = { Pv, HR: 100 * p / Pv, rocio: ebullicion('agua', p).T, errores: { invierte: 100 * Pv / p } };
    if (Ptotal !== undefined) r.errores['fraccion-del-aire'] = 100 * p / num(Ptotal, 'Ptotal');
    return r;
  }
  function vaporDesdeHR(HR, T) {
    HR = num(HR, 'HR'); T = num(T, 'T');
    if (HR <= 0 || HR > 100) throw new Error('la humedad relativa va de 0 a 100 %');
    const p = HR / 100 * pv('agua', T);
    return { p, rocio: ebullicion('agua', p).T };
  }

  // ---------------- Frasco cerrado (GQ18) ----------------
  function equilibrioCerrado(liq, T, V, nLiquido) {
    T = num(T, 'T'); V = num(V, 'V');
    if (!(V > 0)) throw new Error('el volumen tiene que ser positivo');
    const P = pv(liq, T), nEq = P * V / (R_MMHG * (T + K0));
    if (nLiquido === undefined || nLiquido > nEq) return { P, nVapor: nEq, quedaLiquido: true };
    nLiquido = num(nLiquido, 'nLiquido');
    return { P: nLiquido * R_MMHG * (T + K0) / V, nVapor: nLiquido, quedaLiquido: false };
  }
  function compararFrascos(liq, T, Vs, nLiquido) {
    if (!Array.isArray(Vs) || Vs.length !== 2) throw new Error('hacen falta dos volúmenes');
    const r = Vs.map(V => equilibrioCerrado(liq, T, V, nLiquido));
    const P = r.map(x => x.P), p0 = P[0];
    return { P, nVapor: r.map(x => x.nVapor), quedaLiquido: r.map(x => x.quedaLiquido), iguales: Math.abs(P[0] - P[1]) < 1e-9 * Math.max(1, p0),
      errores: { 'mas-volumen-mas-presion': [p0, p0 * Vs[1] / Vs[0]], 'se-reparte-como-gas': [p0, p0 * Vs[0] / Vs[1]], 'cerrado-no-evapora': [0, 0] } };
  }

  // ---------------- Azar con semilla (mulberry32) ----------------
  function azar(semilla) {
    let a = (semilla >>> 0) || 1;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // ---------------- Caja de partículas: evaporación y condensación ----------------
  const VENTANA = 2, TAU = 1.5;
  function densidadEq(c) { return c.escala * pv(c.liq, c.T) / (c.T + K0); }
  function rapidezDe(c) { return c.rapidez * Math.sqrt((c.T + K0) / 298.15); }
  function crearCaja(o) {
    o = o || {};
    const c = { liq: o.liq || 'agua', T: num(o.T === undefined ? 25 : o.T, 'T'), W: num(o.W || 1, 'W'), H: num(o.H || 0.6, 'H'),
      escala: num(o.escala || 300, 'escala'), rapidez: num(o.rapidez || 0.8, 'rapidez'), rnd: azar(o.semilla || 1),
      vapor: [], acc: 0, t: 0, ev: [], cn: [], id: 0, dm: 0 };
    liquido(c.liq);
    if (o.llena) {
      // Ya en equilibrio: tantas moléculas como da la densidad de equilibrio, repartidas y con dirección al azar.
      const N = Math.round(densidadEq(c) * c.W * c.H), v = rapidezDe(c);
      for (let i = 0; i < N; i++) {
        const a = c.rnd() * 2 * Math.PI;
        c.vapor.push({ id: c.id++, x: c.rnd() * c.W, y: c.rnd() * c.H, vx: v * Math.cos(a), vy: v * Math.sin(a) });
      }
      c.dm = N / (c.W * c.H);
    }
    return c;
  }
  function cambiarT(c, T) {
    T = num(T, 'T');
    const f = Math.sqrt((T + K0) / (c.T + K0));
    c.T = T;
    for (const p of c.vapor) { p.vx *= f; p.vy *= f; }
    return c;
  }
  function pasoCaja(c, dt) {
    dt = num(dt, 'dt');
    let resta = dt;
    while (resta > 1e-12) {
      const h = Math.min(resta, 1 / 60); resta -= h; c.t += h;
      const v = rapidezDe(c), e = densidadEq(c) * v / Math.PI;
      const quedan = [];
      for (const p of c.vapor) {
        p.x += p.vx * h; p.y += p.vy * h;
        if (p.x < 0) { p.x = -p.x; p.vx = -p.vx; }
        if (p.x > c.W) { p.x = 2 * c.W - p.x; p.vx = -p.vx; }
        if (p.y > c.H) { p.y = 2 * c.H - p.y; p.vy = -p.vy; }
        if (p.y <= 0) { c.cn.push(c.t); continue; } // tocó el líquido: se queda ahí
        quedan.push(p);
      }
      c.vapor = quedan;
      c.acc += e * c.W * h;
      while (c.acc >= 1) {
        c.acc -= 1;
        const phi = Math.asin(2 * c.rnd() - 1); // ley del coseno, medido desde la vertical
        const y0 = 1e-6 + c.rnd() * v * h * Math.cos(phi);
        c.vapor.push({ id: c.id++, x: c.rnd() * c.W, y: y0, vx: v * Math.sin(phi), vy: v * Math.cos(phi) });
        c.ev.push(c.t);
      }
      c.dm += (c.vapor.length / (c.W * c.H) - c.dm) * Math.min(1, h / TAU);
      const t0 = c.t - VENTANA;
      while (c.ev.length && c.ev[0] < t0) c.ev.shift();
      while (c.cn.length && c.cn[0] < t0) c.cn.shift();
    }
    return c;
  }
  // Ritmo de evaporación de la caja (moléculas por segundo): en equilibrio, también el de condensación.
  function ritmoEquilibrio(c) { return densidadEq(c) * rapidezDe(c) / Math.PI * c.W; }
  function lecturaCaja(c) {
    const A = c.W * c.H, d = c.vapor.length / A, ventana = Math.min(VENTANA, c.t) || 1;
    return { vapor: c.vapor.length, densidad: d, densidadEq: densidadEq(c), presion: d * (c.T + K0) / c.escala,
      presionMedia: c.dm * (c.T + K0) / c.escala,
      presionEq: pv(c.liq, c.T), evaporan: c.ev.length / ventana, condensan: c.cn.length / ventana, t: c.t };
  }

  // ---------------- Posiciones para dibujar: líquido, burbuja y condensación ----------------
  function rejillaLiquido(W, prof, d, t, semilla) {
    const rnd = azar(semilla || 7), pos = [], filas = Math.max(1, Math.floor(prof / (d * 0.87))), cols = Math.max(1, Math.floor(W / d));
    t = t || 0;
    for (let f = 0; f < filas; f++) for (let k = 0; k < cols; k++) {
      const desf = f % 2 ? d / 2 : 0, x0 = (k + 0.5) * d + desf;
      if (x0 > W - d * 0.3) continue;
      const fase = rnd() * 6.283, w = 2 + rnd() * 2, amp = d * 0.12;
      pos.push({ x: x0 + amp * Math.sin(w * t + fase), y: -(f + 0.55) * d * 0.87 + amp * Math.cos(1.3 * w * t + fase), ang: rnd() * 6.283 + 0.4 * Math.sin(t + fase) });
    }
    return pos;
  }
  function vecinosRejilla(pos, dmax) {
    const pares = [];
    for (let i = 0; i < pos.length; i++) for (let j = i + 1; j < pos.length; j++) {
      if (Math.hypot(pos[i].x - pos[j].x, pos[i].y - pos[j].y) <= dmax) pares.push([i, j]);
    }
    return pares;
  }
  function repartir(n, dentro, sep, rnd, intentos) {
    const pos = [];
    for (let k = 0; k < (intentos || 4000) && pos.length < n; k++) {
      const p = dentro(rnd);
      if (p && pos.every(q => Math.hypot(q.x - p.x, q.y - p.y) >= sep)) pos.push(p);
    }
    return pos;
  }
  function burbuja(R, n, semilla) {
    const rnd = azar(semilla || 11), r = R * 0.8;
    return repartir(n, g => { const a = g() * 6.283, s = Math.sqrt(g()) * r; return { x: s * Math.cos(a), y: s * Math.sin(a), ang: g() * 6.283 }; }, R * 0.55 / Math.sqrt(Math.max(1, n)) * 1.4, rnd);
  }
  function condensacion(n, W, H, d, semilla) {
    const rnd = azar(semilla || 5);
    const gas = repartir(n, g => ({ x: d + g() * (W - 2 * d), y: d + g() * (H - 2 * d), ang: g() * 6.283 }), d * 2.2, rnd);
    while (gas.length < n) gas.push({ x: d + rnd() * (W - 2 * d), y: d + rnd() * (H - 2 * d), ang: rnd() * 6.283 });
    const liquido = [], cols = Math.max(1, Math.floor(W / d) - 1);
    for (let i = 0; i < n; i++) {
      const f = Math.floor(i / cols), k = i % cols;
      liquido.push({ x: (k + 0.5) * d + (f % 2 ? d / 2 : 0) + d * 0.25, y: H - (f + 0.55) * d * 0.87, ang: gas[i].ang + 0.8 });
    }
    return { gas, liquido, radio: d / 2 };
  }

  // ---------------- Diagramas de fases ----------------
  const FASES = {
    agua: { nombre: 'agua', texto: 'H₂O', triple: { T: 0.01, P: 611.657 / PA_ATM }, critico: { T: 373.946, P: 22.064e6 / PA_ATM },
      dHsub: 51060, pendienteFusion: -13.46e6 / PA_ATM, fusionNormal: 0, ebullicionNormal: 100 },
    co2: { nombre: 'dióxido de carbono', texto: 'CO₂', triple: { T: -56.558, P: 517.95e3 / PA_ATM }, critico: { T: 30.978, P: 7.3773e6 / PA_ATM },
      sublimacionNormal: -78.464, pendienteFusion: 4.676e6 / PA_ATM },
  };
  function datosFase(s) {
    const F = FASES[s];
    if (!F) throw new Error(`diagrama desconocido: ${s}`);
    return F;
  }
  // Clausius–Clapeyron por dos puntos: ln P = a − b/T(K).
  function ccDosPuntos(T1, P1, T2, P2) {
    const b = Math.log(P2 / P1) / (1 / (T1 + K0) - 1 / (T2 + K0));
    return { b, a: Math.log(P1) + b / (T1 + K0) };
  }
  function curvas(F) {
    if (F._c) return F._c;
    const t = F.triple, c = {};
    if (F.dHsub) { const b = F.dHsub / R_J; c.sub = { b, a: Math.log(t.P) + b / (t.T + K0) }; }
    else c.sub = ccDosPuntos(t.T, t.P, F.sublimacionNormal, 1);
    if (F === FASES.agua) c.vap = null; // Antoine
    else c.vap = ccDosPuntos(t.T, t.P, F.critico.T, F.critico.P);
    F._c = c;
    return c;
  }
  function presionCurva(s, curva, T) {
    const F = datosFase(s), c = curvas(F); T = num(T, 'T');
    if (curva === 'sublimacion') return Math.exp(c.sub.a - c.sub.b / (T + K0));
    if (curva === 'vaporizacion') return c.vap ? Math.exp(c.vap.a - c.vap.b / (T + K0)) : pv('agua', T) / ATM;
    if (curva === 'fusion') return F.triple.P + F.pendienteFusion * (T - F.triple.T);
    throw new Error(`curva desconocida: ${curva}`);
  }
  function temperaturaCurva(s, curva, P) {
    const F = datosFase(s), c = curvas(F); P = num(P, 'P');
    if (curva === 'sublimacion') return c.sub.b / (c.sub.a - Math.log(P)) - K0;
    if (curva === 'vaporizacion') return c.vap ? c.vap.b / (c.vap.a - Math.log(P)) - K0 : ebullicion('agua', P * ATM).T;
    if (curva === 'fusion') return F.triple.T + (P - F.triple.P) / F.pendienteFusion;
    throw new Error(`curva desconocida: ${curva}`);
  }
  function fase(s, P, T) {
    const F = datosFase(s); P = num(P, 'P'); T = num(T, 'T');
    if (!(P > 0)) throw new Error('la presión tiene que ser positiva');
    const t = F.triple, cr = F.critico;
    if (T >= cr.T && P >= cr.P) return 'supercrítico';
    if (T < t.T) {
      if (P < presionCurva(s, 'sublimacion', T)) return 'gas';
      // Bajo el punto triple, sobre la curva de fusión (solo en el agua, que tiene pendiente negativa) hay líquido.
      if (F.pendienteFusion < 0 && P > presionCurva(s, 'fusion', T)) return 'líquido';
      return 'sólido';
    }
    if (T >= cr.T) return 'gas';
    if (P < presionCurva(s, 'vaporizacion', T)) return 'gas';
    if (F.pendienteFusion > 0 && P > presionCurva(s, 'fusion', T)) return 'sólido';
    return 'líquido';
  }
  function calentarAPresion(s, P, T1, T2) {
    const F = datosFase(s); P = num(P, 'P'); T1 = num(T1, 'T1'); T2 = num(T2, 'T2');
    const t = F.triple, cambios = [];
    if (P < t.P) cambios.push({ de: 'sólido', a: 'gas', T: temperaturaCurva(s, 'sublimacion', P) });
    else if (P < F.critico.P) {
      cambios.push({ de: 'sólido', a: 'líquido', T: temperaturaCurva(s, 'fusion', P) });
      cambios.push({ de: 'líquido', a: 'gas', T: temperaturaCurva(s, 'vaporizacion', P) });
    }
    const dentro = cambios.filter(c => c.T > Math.min(T1, T2) && c.T < Math.max(T1, T2));
    return { inicial: fase(s, P, T1), final: fase(s, P, T2), cambios: dentro,
      errores: { 'se-derrite-como-el-agua': [{ de: 'sólido', a: 'líquido' }, { de: 'líquido', a: 'gas' }] } };
  }

  return { K0, ATM, MMHG_PA, R_MMHG, LIQUIDOS, SUSTANCIAS, FASES,
    presionVapor, ebullicion, presionAltitud, ebullicionAltitud, hierve, ebullicionLugar, ollaPresion,
    sustancia, puentesH, puenteHEntre, quienesFormanPuentes, ordenEbullicion, razonEbullicion,
    gasSobreAgua, humedadRelativa, vaporDesdeHR, equilibrioCerrado, compararFrascos,
    azar, crearCaja, pasoCaja, cambiarT, lecturaCaja, ritmoEquilibrio, rejillaLiquido, vecinosRejilla, burbuja, condensacion,
    presionCurva, temperaturaCurva, fase, calentarAPresion };
});
