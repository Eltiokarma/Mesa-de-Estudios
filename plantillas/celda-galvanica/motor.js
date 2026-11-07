/*
 * Motor de Redox y celda galvánica: potenciales, pilas, electrólisis y Faraday.
 *
 * Aquí vive toda la química de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el
 * navegador (window.MotorCelda) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * Potenciales estándar de reducción a 25 °C, en V, redondeados a dos decimales como en los problemas de
 * admisión. Fuente: Vanýsek, "Electrochemical Series", CRC Handbook of Chemistry and Physics (tabla 1:
 * Mg −2,372; Al −1,662; Zn −0,7618; Fe²⁺/Fe −0,447; Ni −0,257; Sn −0,1375; Pb −0,1262; Cu +0,3419;
 * Ag +0,7996). Las academias usan Fe −0,44 y Ni −0,25: se dejan así para que coincidan con sus tablas.
 * El electrodo de hidrógeno vale 0 por convención: es la referencia (EC10).
 * Masas molares de academia: Mg 24, Al 27, Fe 56, Ni 58,7, Zn 65, Cu 63,5, Ag 108, Sn 119, Pb 207, H₂ 2.
 * F = 96 500 C/mol.
 *
 *   celda({ anodo:'Zn', catodo:'Cu' })   E° = E°(cátodo) − E°(ánodo), si es espontánea, reacción global, polos y sentidos
 *   pila('Cu', 'Zn')                     arma la pila espontánea con el Cu a la izquierda y el Zn a la derecha
 *   electrolisis('Zn', 'Cu')             la misma celda forzada por una fuente externa: se invierte la reacción
 *   voltimetro(celda, { puente:'sal' })  lo que marca el voltímetro: la fem con puente salino, 0 sin puente, null con un alambre
 *   faraday({ especie:'Cu', I:5, s:1930 })  Q = I·t, moles de e⁻, moles y gramos depositados
 *   tiempoFaraday({ especie:'Al', g:2.7, I:10 })  el problema al revés
 *   serie(9650, ['Cu', 'Ag'])            segunda ley: la misma carga por celdas en serie
 *   crearParticulas(...) y pasoParticulas(estado, dt)  modelo de partículas de la animación (con semilla)
 *
 * Electrólisis con agua y con sal (hueco llenado el 7 nov 2026). Masas molares de academia: H₂ 2, O₂ 32,
 * Na 23, Cl₂ 71. Volumen molar en condiciones normales: VM = 22,4 L/mol. Sistemas (SISTEMAS):
 *   'agua-acida'    agua con un poco de H₂SO₄: cátodo (−) 2 H⁺ + 2 e⁻ → H₂; ánodo (+) 2 H₂O → O₂ + 4 H⁺ + 4 e⁻
 *   'agua-sulfato'  agua con Na₂SO₄ (no se gasta): cátodo 2 H₂O + 2 e⁻ → H₂ + 2 OH⁻; ánodo igual que arriba
 *                   en los dos: global 2 H₂O → 2 H₂ + O₂; 2 F por mol de H₂ y 4 F por mol de O₂; volúmenes 2 : 1
 *   'nacl-acuoso'   salmuera concentrada: cátodo 2 H₂O + 2 e⁻ → H₂ + 2 OH⁻ (no sale sodio); ánodo 2 Cl⁻ → Cl₂ + 2 e⁻;
 *                   global 2 NaCl + 2 H₂O → 2 NaOH + H₂ + Cl₂; queda NaOH en la disolución
 *   'nacl-fundido'  sin agua: cátodo Na⁺ + e⁻ → Na (1 F por mol); ánodo 2 Cl⁻ → Cl₂ + 2 e⁻; global 2 NaCl → 2 Na + Cl₂
 *   electrolizar('agua-sulfato', { Q:19300 } | { I, s | min | h } | nada)
 *       { sistema, nombre, global, queda, Q, molE (null sin carga), razonVolumen (L cátodo / L ánodo, null si
 *         un producto no es gas), catodo y anodo: { producto, id (símbolo del elemento), polo ('−' o '+'),
 *         tipo ('reducción' u 'oxidación'), semirreaccion, z (e⁻ por unidad de producto), gas, M, mol, g, L
 *         (null si no es gas o no hay carga) }, errores }
 *       errores (agua): unoAUno (L de O₂ si los gases salieran 1 : 1, igual a los de H₂), razonUnoAUno (1),
 *         catodoAlReves ('O₂' en el cátodo), anodoAlReves ('H₂'), oxigenoConDos (L de O₂ dividiendo entre 2
 *         en vez de 4); (NaCl acuoso): saleSodio ('Na' en el cátodo), comoDisociacion ('Na⁺ y Cl⁻': cree que
 *         la corriente solo separa los iones, EC7); (NaCl fundido): saleHidrogeno ('H₂'); en todos:
 *         sinDividir.catodo y sinDividir.anodo (L, o g si no es gas, sin dividir los moles de e⁻ entre z)
 *   productos('agua-sulfato', 24)  cuántas unidades se forman con un número entero de electrones (para el dibujo):
 *       { catodo: { producto, unidades, sobran }, anodo: { producto, unidades, sobran } }
 *
 * Cada resultado trae un campo 'errores' con los valores que dan los errores típicos de
 * docs/investigacion/equilibrio-acidos-electroquimica-ideas-erroneas.md (sección "Lo que no tiene respaldo"):
 * son las opciones incorrectas de las predicciones.
 *
 * CABECERA: líneas 1 a 50 (qué calcula, datos, funciones y la electrólisis con agua y con sal del 7 nov 2026).
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorCelda = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const F = 96500;
  const EPS = 1e-9;

  // ---------- Tabla de potenciales ----------
  // aOx Ox^q+ + n e⁻ → bRed Red.  q = carga del ion; n = electrones de la semirreacción tal como se escribe.
  const TABLA = [
    { id:'Mg', nombre:'magnesio', ox:'Mg²⁺', red:'Mg', q:2, aOx:1, n:2, bRed:1, E:-2.37, M:24 },
    { id:'Al', nombre:'aluminio', ox:'Al³⁺', red:'Al', q:3, aOx:1, n:3, bRed:1, E:-1.66, M:27 },
    { id:'Zn', nombre:'zinc', ox:'Zn²⁺', red:'Zn', q:2, aOx:1, n:2, bRed:1, E:-0.76, M:65 },
    { id:'Fe', nombre:'hierro', ox:'Fe²⁺', red:'Fe', q:2, aOx:1, n:2, bRed:1, E:-0.44, M:56 },
    { id:'Ni', nombre:'níquel', ox:'Ni²⁺', red:'Ni', q:2, aOx:1, n:2, bRed:1, E:-0.25, M:58.7 },
    { id:'Sn', nombre:'estaño', ox:'Sn²⁺', red:'Sn', q:2, aOx:1, n:2, bRed:1, E:-0.14, M:119 },
    { id:'Pb', nombre:'plomo', ox:'Pb²⁺', red:'Pb', q:2, aOx:1, n:2, bRed:1, E:-0.13, M:207 },
    { id:'H2', nombre:'hidrógeno', ox:'H⁺', red:'H₂', q:1, aOx:2, n:2, bRed:1, E:0, M:2, gas:true, soporte:'Pt' },
    { id:'Cu', nombre:'cobre', ox:'Cu²⁺', red:'Cu', q:2, aOx:1, n:2, bRed:1, E:0.34, M:63.5 },
    { id:'Ag', nombre:'plata', ox:'Ag⁺', red:'Ag', q:1, aOx:1, n:1, bRed:1, E:0.80, M:108 },
  ].map(o => Object.freeze(o));
  const POTENCIALES = Object.freeze(TABLA);
  const FUENTE_POTENCIALES = 'Vanýsek, "Electrochemical Series", CRC Handbook of Chemistry and Physics; redondeados a dos decimales como en las tablas de academia (Fe −0,44 y Ni −0,25).';

  function par(id) {
    const p = TABLA.find(x => x.id === id);
    if (!p) throw new Error(`no está en la tabla de potenciales: ${id}`);
    return p;
  }
  // Potenciales con dos decimales: el redondeo evita el 1,1000000000000001 del flotante.
  const r2 = x => Math.round(x * 100) / 100 + 0;
  const mcd = (a, b) => (b ? mcd(b, a % b) : a);
  const mcm = (a, b) => a / mcd(a, b) * b;

  // ---------- Semirreacciones ----------
  const coef = k => (k === 1 ? '' : k + ' ');
  function semirreaccion(id, sentido) {
    const p = par(id);
    const izqRed = `${coef(p.aOx)}${p.ox} + ${coef(p.n)}e⁻`, derRed = `${coef(p.bRed)}${p.red}`;
    if (sentido === 'oxidacion') return { id, tipo:'oxidación', electrones:p.n, texto:`${derRed} → ${coef(p.aOx)}${p.ox} + ${coef(p.n)}e⁻`, E:p.E };
    if (sentido === 'reduccion' || sentido === undefined) return { id, tipo:'reducción', electrones:p.n, texto:`${izqRed} → ${derRed}`, E:p.E };
    throw new Error(`sentido desconocido: ${sentido} (usa 'reduccion' u 'oxidacion')`);
  }

  // ---------- Una celda ----------
  // o = { anodo, catodo }: el ánodo es donde ocurre la oxidación y el cátodo donde ocurre la reducción,
  // estén donde estén dibujados (EC4). E° = E°(cátodo) − E°(ánodo); la reacción es espontánea si E° > 0.
  function celda(o) {
    o = o || {};
    if (!o.anodo || !o.catodo) throw new Error('falta el ánodo o el cátodo');
    const a = par(o.anodo), c = par(o.catodo);
    if (a.id === c.id) throw new Error('los dos electrodos son del mismo par: E° = 0 y no hay pila (haría falta una pila de concentración)');
    const E = r2(c.E - a.E);
    // Igualar electrones: cada semirreacción se multiplica hasta que los electrones cedidos sean los ganados.
    // Los potenciales NO se multiplican: E° es intensivo (no depende de cuánto reacciona).
    const L = mcm(a.n, c.n), ka = L / a.n, kc = L / c.n;
    const reactivos = [[ka * a.bRed, a.red, 0], [kc * c.aOx, c.ox, c.q]];
    const productos = [[ka * a.aOx, a.ox, a.q], [kc * c.bRed, c.red, 0]];
    const lado = l => l.map(([k, s]) => `${coef(k)}${s}`).join(' + ');
    const r = {
      anodo: a.id, catodo: c.id, Eanodo: a.E, Ecatodo: c.E, E,
      espontanea: E > EPS,
      electrones: L, factores: { anodo: ka, catodo: kc },
      oxidacion: semirreaccion(a.id, 'oxidacion'), reduccion: semirreaccion(c.id, 'reduccion'),
      reaccion: { reactivos, productos, texto: `${lado(reactivos)} → ${lado(productos)}` },
      notacion: `${a.gas ? 'Pt │ H₂ │ H⁺' : `${a.red} │ ${a.ox}`} ║ ${c.gas ? 'H⁺ │ H₂ │ Pt' : `${c.ox} │ ${c.red}`}`,
      // En una pila (reacción espontánea) el ánodo es el polo negativo. En la electrólisis, la fuente lo
      // vuelve positivo. "Cátodo = reducción" no cambia nunca (EC3).
      polos: E > EPS ? { anodo: '−', catodo: '+' } : { anodo: '+', catodo: '−' },
      sentido: {
        electrones: { de: a.id, a: c.id, por: 'alambre' },     // solo por metales y cables (EC2)
        aniones: { hacia: a.id, por: 'puente' },               // compensan la carga positiva que aparece en el ánodo
        cationes: { hacia: c.id, por: 'puente' },              // compensan la carga que se pierde en el cátodo
      },
      errores: {
        multiplicaCoeficientes: r2(c.E * kc - a.E * ka),       // multiplica E° por los coeficientes (Cu–Ag: 1,26 V)
        sumaSinCambiarSigno: r2(c.E + a.E),                    // suma los dos potenciales de reducción (Cu–Ag: 1,14 V)
        restaAlReves: r2(a.E - c.E),                           // E°(ánodo) − E°(cátodo)
        duplicada: r2(2 * E),                                  // cree que duplicar la reacción duplica E°
      },
    };
    return r;
  }

  // Pila: con los dos metales en su lugar del dibujo (izq, der), el motor decide cuál es el ánodo:
  // el de menor potencial de reducción se oxida. Devuelve la celda espontánea y de qué lado está cada cosa.
  function pila(izq, der) {
    const pi = par(izq), pd = par(der);
    if (pi.id === pd.id) throw new Error('los dos electrodos son del mismo par: E° = 0 y no hay pila (haría falta una pila de concentración)');
    const anodo = pi.E < pd.E ? pi.id : pd.id, catodo = anodo === pi.id ? pd.id : pi.id;
    return conLados(celda({ anodo, catodo }), izq, der, 'pila');
  }
  // Electrólisis: una fuente externa de más de |E°| voltios fuerza la reacción al revés. Ahora se oxida el
  // de mayor potencial (ánodo, polo +) y se reduce el de menor (cátodo, polo −). Los electrones siguen yendo
  // del ánodo al cátodo por el cable (pasando por la fuente) y los iones siguen la misma regla (EC3, EC8).
  function electrolisis(izq, der) {
    const pi = par(izq), pd = par(der);
    if (pi.id === pd.id) throw new Error('los dos electrodos son del mismo par');
    const anodo = pi.E > pd.E ? pi.id : pd.id, catodo = anodo === pi.id ? pd.id : pi.id;
    const r = conLados(celda({ anodo, catodo }), izq, der, 'electrolisis');
    r.voltajeMinimo = -r.E;                                    // la fuente debe dar más que esto
    r.fuente = Math.ceil((r.voltajeMinimo + 0.3) * 2) / 2;      // una fuente de dibujo, en medios voltios, que alcanza
    return r;
  }
  function conLados(r, izq, der, tipo) {
    r.tipo = tipo;
    r.izq = izq; r.der = der;
    r.lados = { anodo: r.anodo === izq ? 'izq' : 'der', catodo: r.catodo === izq ? 'izq' : 'der' };
    r.sentido.electrones.lado = r.lados.anodo === 'izq' ? 'izq→der' : 'der→izq';
    r.sentido.aniones.lado = r.lados.anodo;     // los aniones del puente van hacia el vaso del ánodo
    r.sentido.cationes.lado = r.lados.catodo;   // los cationes, hacia el del cátodo
    r.errores.izquierdaADerecha = 'izq→der';    // "el ánodo siempre está a la izquierda" (EC4)
    return r;
  }

  // Lo que marca el voltímetro entre los dos electrodos de una pila: la fem si el circuito de iones está
  // cerrado por el puente salino y 0 si no hay puente (circuito abierto). Con un alambre en lugar del puente
  // devuelve null: las puntas del alambre forman electrodos nuevos, con otras reacciones, y ya no es esta
  // pila; lo que marque depende de esos electrodos, no de la tabla (EC1).
  function voltimetro(c, o) {
    if (!c || typeof c.E !== 'number') throw new Error('falta la celda');
    const puente = o && o.puente !== undefined ? o.puente : 'sal';
    if (!['sal', 'ninguno', 'alambre'].includes(puente)) throw new Error(`puente desconocido: ${puente}`);
    return puente === 'sal' ? Math.abs(c.E) : puente === 'ninguno' ? 0 : null;
  }

  // ---------- Faraday ----------
  function numero(x, que, o) {
    o = o || {};
    const v = Number(x);
    if (x === null || x === undefined || x === '' || !Number.isFinite(v)) throw new Error(`${que}: falta un número`);
    if (o.positivo && !(v > 0)) throw new Error(`${que} debe ser mayor que cero`);
    if (!o.positivo && v < 0) throw new Error(`${que} no puede ser negativo`);
    return v;
  }
  // Electrones por cada unidad de lo que se deposita (Cu: 2; Ag: 1; Al: 3; H₂: 2).
  const ePorUnidad = p => p.n / p.bRed;
  // o = { especie, I (A), s | min | h (tiempo), Q (C) }. Q = I·t; moles de e⁻ = Q/F; moles = moles de e⁻ / z.
  function faraday(o) {
    o = o || {};
    const p = par(o.especie);
    let Q, s, I;
    if (o.Q !== undefined) Q = numero(o.Q, 'la carga', { positivo: true });
    else {
      I = numero(o.I, 'la corriente', { positivo: true });
      if (o.s !== undefined) s = numero(o.s, 'el tiempo', { positivo: true });
      else if (o.min !== undefined) s = 60 * numero(o.min, 'el tiempo', { positivo: true });
      else if (o.h !== undefined) s = 3600 * numero(o.h, 'el tiempo', { positivo: true });
      else throw new Error('falta el tiempo (s, min o h) o la carga Q');
      Q = I * s;
    }
    const molE = Q / F, z = ePorUnidad(p), mol = molE / z, g = mol * p.M;
    const r = { especie: p.id, producto: p.red, z, masaMolar: p.M, I, s, Q, molE, mol, g, gas: !!p.gas, errores: {} };
    r.errores.sinCarga = molE * p.M;                    // no divide entre la carga del ion (Cu: 6,35 g en vez de 3,175 g)
    r.errores.multiplicaCarga = molE * z * p.M;         // multiplica por la carga en vez de dividir
    r.errores.molesComoMasa = mol;                      // da los moles como si fueran gramos
    if (o.min !== undefined) r.errores.sinPasarASegundos = g / 60;  // usa los minutos como si fueran segundos
    if (o.h !== undefined) r.errores.sinPasarASegundos = g / 3600;
    return r;
  }
  // El problema al revés: cuánto tiempo (o carga) hace falta para depositar g gramos con I amperios.
  function tiempoFaraday(o) {
    o = o || {};
    const p = par(o.especie);
    const g = numero(o.g, 'la masa', { positivo: true }), I = numero(o.I, 'la corriente', { positivo: true });
    const mol = g / p.M, z = ePorUnidad(p), molE = mol * z, Q = molE * F, s = Q / I;
    return { especie: p.id, g, I, mol, molE, Q, s, min: s / 60, errores: { sinCarga: mol * F / I } };
  }
  // Segunda ley de Faraday: la misma carga atraviesa varias celdas en serie.
  function serie(Q, especies) {
    Q = numero(Q, 'la carga', { positivo: true });
    if (!Array.isArray(especies) || !especies.length) throw new Error('faltan las celdas en serie');
    return especies.map(e => { const r = faraday({ especie: e, Q }); return { especie: r.especie, molE: r.molE, mol: r.mol, g: r.g }; });
  }
  // Cuántas unidades se depositan con un número entero de electrones (para contar en el dibujo).
  function deposito(especie, electrones) {
    const p = par(especie), e = numero(electrones, 'los electrones');
    if (!Number.isInteger(e)) throw new Error('los electrones se cuentan con enteros');
    const z = ePorUnidad(p), k = Math.floor(e / z);
    return { especie: p.id, depositados: k, sobran: e - k * z, z };
  }

  // ---------- Modelo de partículas de la animación ----------
  // Cada partícula representa muchísimas: es una forma de contar, no un tamaño real.
  // Zonas: 'vasoA' (disolución del ánodo), 'vasoC' (del cátodo), 'puente' y 'alambre'. Los electrones solo
  // existen en el alambre o dentro de los electrodos (contadores eA y eC); nunca en una disolución (EC2).
  // Coordenadas: en cada vaso (u, v) entre 0 y 1, con u = 1 del lado del otro vaso y v = 0 arriba; el
  // electrodo es la franja u ≈ 0,5. En el puente, s va de 0 (boca del vaso del ánodo) a 1 (boca del cátodo).
  // En el alambre, s va de 0 (ánodo) a 1 (cátodo). El dibujo refleja las u si el ánodo queda a la derecha.
  // Disoluciones de nitratos y puente de KNO₃ (con plata no se usa KCl: precipitaría AgCl), así que hay un
  // solo anión, NO₃⁻, y un solo catión del puente, K⁺.
  function azar(sem) { let s = (sem >>> 0) || 1; return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296; }
  const ELECTRODO = { u: 0.5, medio: 0.07, vMax: 0.78 };
  // Generador con estado guardado en est.s: el mismo resultado con la misma semilla.
  function rndDe(est) { return () => { est.s = (Math.imul(est.s, 1664525) + 1013904223) >>> 0; return est.s / 4294967296; }; }
  // o = { anodo, catodo, semilla, puente (true: hay puente salino), ionesAnodo, ionesCatodo, ionesPuente, atomos }
  function crearParticulas(o) {
    o = o || {};
    const a = par(o.anodo), c = par(o.catodo);
    if (a.id === c.id) throw new Error('los dos electrodos son del mismo par');
    const entero = (x, d, que) => { const v = x === undefined ? d : x; if (!Number.isInteger(v) || v < 0) throw new Error(`${que} se cuentan con enteros`); return v; };
    // por omisión, el cátodo tiene iones para al menos 4 átomos disueltos en el ánodo
    const nA = entero(o.ionesAnodo, 5, 'los iones del ánodo'), nC = entero(o.ionesCatodo, Math.max(8, Math.ceil(4 * a.n / c.n) * c.bRed), 'los iones del cátodo');
    const nP = entero(o.ionesPuente, 16, 'los iones del puente'), atomos = entero(o.atomos, 10, 'los átomos del electrodo');
    const est = {
      anodo: a.id, catodo: c.id, qa: a.q, na: a.n, aOxA: a.aOx, oxA: a.ox, gasA: !!a.gas,
      qc: c.q, nc: c.n, aOxC: c.aOx, bRedC: c.bRed, oxC: c.ox, gasC: !!c.gas,
      puente: o.puente !== false, semilla: o.semilla || 1, s: ((o.semilla || 1) >>> 0) || 1,
      t: 0, reloj: 0, liberar: 0, id: 0,
      eA: 0, eC: 0,                                   // electrones dentro de cada electrodo, esperando
      atomosA: atomos, atomosA0: atomos, depositados: 0, disueltos: 0, emitidos: 0, llegados: 0,
      limite: o.limite === undefined ? 2 * a.n : o.limite,
      periodo: o.periodo || 1.8, vel: o.velocidad || 0.32, deriva: o.deriva || 0.22,
      parts: [], frenada: false, agotada: false, abierto: !!o.abierto,
    };
    const rnd = rndDe(est);
    const nuevo = (tipo, especie, carga, zona, extra) => Object.assign({ id: est.id++, tipo, especie, carga, zona, u: 0, v: 0, sp: 0, w: 0, ang: rnd() * Math.PI * 2, estado: 'libre' }, extra);
    const enVaso = () => { let u; do u = 0.06 + 0.88 * rnd(); while (Math.abs(u - ELECTRODO.u) < ELECTRODO.medio + 0.05); return { u, v: 0.08 + 0.84 * rnd() }; };
    for (let k = 0; k < nA * a.aOx; k++) est.parts.push(nuevo('ion', a.ox, a.q, 'vasoA', enVaso()));
    for (let k = 0; k < nA * a.aOx * a.q; k++) est.parts.push(nuevo('an', 'NO₃⁻', -1, 'vasoA', enVaso()));
    for (let k = 0; k < nC * c.aOx; k++) est.parts.push(nuevo('ion', c.ox, c.q, 'vasoC', enVaso()));
    for (let k = 0; k < nC * c.aOx * c.q; k++) est.parts.push(nuevo('an', 'NO₃⁻', -1, 'vasoC', enVaso()));
    if (est.puente) for (let k = 0; k < nP; k++) {
      est.parts.push(nuevo('cat', 'K⁺', 1, 'puente', { sp: 0.04 + 0.92 * rnd(), w: 2 * rnd() - 1 }));
      est.parts.push(nuevo('an', 'NO₃⁻', -1, 'puente', { sp: 0.04 + 0.92 * rnd(), w: 2 * rnd() - 1 }));
    }
    return est;
  }
  function cargas(est) {
    const q = { vasoA: 0, vasoC: 0, puente: 0, alambre: 0, electrodoA: 0 - est.eA || 0, electrodoC: 0 - est.eC || 0 };
    for (const p of est.parts) q[p.zona] += p.carga;
    q.total = q.vasoA + q.vasoC + q.puente + q.alambre + q.electrodoA + q.electrodoC;
    return q;
  }
  // Un paso de dt segundos de animación (como máximo 0,25 s). Cambia est y lo devuelve.
  function pasoParticulas(est, dt) {
    dt = Math.min(0.25, numero(dt, 'el paso de tiempo'));
    const rnd = rndDe(est);
    est.t += dt;
    let q = cargas(est);
    // 1. Iones: se mueven al azar. En el puente, además, los empuja la carga de los vasos: los aniones van
    //    hacia el vaso del ánodo si este tiene carga positiva, y los cationes hacia el del cátodo si este
    //    tiene carga negativa. Así el puente mantiene neutra cada disolución.
    for (const p of est.parts) {
      if (p.zona === 'alambre') continue;
      p.ang += (rnd() - 0.5) * dt * 5;
      if (p.zona === 'puente') {
        const hacia = p.carga < 0 ? (q.vasoA > 0 ? -1 : 0) : (q.vasoC < 0 ? 1 : 0);
        p.sp += (Math.cos(p.ang) * 0.07 + hacia * est.deriva) * dt;
        p.w += Math.sin(p.ang) * 0.6 * dt;
        if (p.w > 1) { p.w = 1; p.ang = -p.ang; } else if (p.w < -1) { p.w = -1; p.ang = -p.ang; }
        if (p.sp < 0) {
          if (p.carga < 0 && q.vasoA > 0) { Object.assign(p, { zona: 'vasoA', u: 0.94, v: 0.1 + 0.12 * rnd(), ang: Math.PI + (rnd() - 0.5) }); q = cargas(est); }
          else { p.sp = 0.01; p.ang = Math.PI - p.ang; }
        } else if (p.sp > 1) {
          if (p.carga > 0 && q.vasoC < 0) { Object.assign(p, { zona: 'vasoC', u: 0.94, v: 0.1 + 0.12 * rnd(), ang: Math.PI + (rnd() - 0.5) }); q = cargas(est); }
          else { p.sp = 0.99; p.ang = Math.PI - p.ang; }
        }
        continue;
      }
      if (p.estado === 'depositando') {           // va hacia la superficie del cátodo
        const du = p.meta.u - p.u, dv = p.meta.v - p.v, d = Math.hypot(du, dv), k = Math.min(1, 0.45 * dt / Math.max(d, 1e-9));
        p.u += du * k; p.v += dv * k;
        continue;
      }
      const paso = 0.09 * dt;
      p.u += Math.cos(p.ang) * paso; p.v += Math.sin(p.ang) * paso;
      if (p.u < 0.05) { p.u = 0.05; p.ang = Math.PI - p.ang; } else if (p.u > 0.95) { p.u = 0.95; p.ang = Math.PI - p.ang; }
      if (p.v < 0.06) { p.v = 0.06; p.ang = -p.ang; } else if (p.v > 0.95) { p.v = 0.95; p.ang = -p.ang; }
      const borde = ELECTRODO.medio + 0.03;
      if (Math.abs(p.u - ELECTRODO.u) < borde && p.v < ELECTRODO.vMax) { p.u = ELECTRODO.u + (p.u >= ELECTRODO.u ? 1 : -1) * borde; p.ang = Math.PI - p.ang; }
    }
    if (est.abierto) return est;                  // circuito abierto: los iones se mueven, pero no hay corriente
    // 2. Electrones: salen del ánodo de a uno y avanzan por el alambre; al llegar entran al cátodo.
    est.liberar -= dt;
    if (est.eA > 0 && est.liberar <= 0) {
      est.eA--; est.liberar = 0.16;
      est.parts.push({ id: est.id++, tipo: 'e', especie: 'e⁻', carga: -1, zona: 'alambre', sp: 0, u: 0, v: 0, w: 0, ang: 0, estado: 'libre' });
    }
    for (const p of est.parts) if (p.zona === 'alambre') p.sp = Math.min(1, p.sp + est.vel * dt);
    const llegan = est.parts.filter(p => p.zona === 'alambre' && p.sp >= 1);
    if (llegan.length) { est.parts = est.parts.filter(p => !llegan.includes(p)); est.eC += llegan.length; est.llegados += llegan.length; }
    // 3. Cátodo: con nc electrones y aOx iones junto al electrodo, se forma un átomo (o una molécula de H₂).
    const yendo = est.parts.filter(p => p.zona === 'vasoC' && p.estado === 'depositando');
    const faltan = Math.floor(est.eC / est.nc) * est.aOxC - yendo.length;
    if (faltan > 0) {
      const libres = est.parts.filter(p => p.zona === 'vasoC' && p.tipo === 'ion' && p.estado === 'libre')
        .sort((x, y) => Math.abs(x.u - ELECTRODO.u) - Math.abs(y.u - ELECTRODO.u) || x.id - y.id);
      for (const p of libres.slice(0, faltan)) {
        p.estado = 'depositando';
        p.meta = { u: ELECTRODO.u + (p.u >= ELECTRODO.u ? 1 : -1) * (ELECTRODO.medio + 0.02), v: Math.min(ELECTRODO.vMax - 0.05, Math.max(0.1, p.v)) };
      }
    }
    const listos = yendo.filter(p => Math.hypot(p.u - p.meta.u, p.v - p.meta.v) < 0.01);
    if (listos.length >= est.aOxC && est.eC >= est.nc) {
      const van = listos.slice(0, est.aOxC);
      est.parts = est.parts.filter(p => !van.includes(p));
      est.eC -= est.nc; est.depositados += est.bRedC;
      est.ultimoDeposito = { u: van[0].meta.u, v: van[0].meta.v, t: est.t };
    }
    // 4. Ánodo: cada 'periodo' segundos se disuelve un átomo (o se oxida una molécula de H₂), si se puede.
    est.reloj += dt;
    q = cargas(est);
    const enCamino = est.eA + est.eC - q.alambre;              // electrones que ya salieron y aún no se usan
    const cationesC = est.parts.filter(p => p.zona === 'vasoC' && p.tipo === 'ion').length;
    // Sin iones que compensen, cada vaso se carga y la reacción se frena enseguida (EC1, EC11).
    const cargado = q.vasoA + est.na > est.limite || q.vasoC - enCamino - est.na < -est.limite;
    const alcanza = Math.floor(cationesC / est.aOxC) * est.nc >= enCamino + est.na;
    est.frenada = cargado;
    est.agotada = !(est.gasA || est.atomosA > 0) || !alcanza;
    if (est.reloj >= est.periodo && !est.frenada && !est.agotada) {
      est.reloj = 0;
      if (!est.gasA) est.atomosA--;
      est.disueltos++;
      const v = 0.12 + 0.6 * rnd(), lado = rnd() < 0.5 ? -1 : 1;
      for (let k = 0; k < est.aOxA; k++)
        est.parts.push({ id: est.id++, tipo: 'ion', especie: est.oxA, carga: est.qa, zona: 'vasoA',
          u: ELECTRODO.u + lado * (ELECTRODO.medio + 0.035), v: v + 0.05 * k, sp: 0, w: 0, ang: lado > 0 ? 0 : Math.PI, estado: 'libre', nace: est.t });
      est.eA += est.na; est.emitidos += est.na;
    }
    return est;
  }

  // ---------- Electrólisis con agua y con sal ----------
  // La fuente decide los polos: cátodo (−) donde entran los electrones y ocurre la reducción; ánodo (+) donde
  // salen y ocurre la oxidación. Los electrones van solo por el cable; en el líquido se mueven iones (EC2).
  const VM = 22.4;
  const H2 = { producto:'H₂', id:'H', z:2, gas:true, M:2 }, O2 = { producto:'O₂', id:'O', z:4, gas:true, M:32 };
  const CL2 = { producto:'Cl₂', id:'Cl', z:2, gas:true, M:71, semirreaccion:'2 Cl⁻ → Cl₂ + 2 e⁻' };
  const AGUA_ANODO = Object.assign({ semirreaccion:'2 H₂O → O₂ + 4 H⁺ + 4 e⁻' }, O2);
  const SISTEMAS = Object.freeze({
    'agua-acida': { nombre:'agua acidulada (un poco de H₂SO₄)', global:'2 H₂O → 2 H₂ + O₂', queda:'H₂SO₄ (no se gasta)',
      catodo:Object.assign({ semirreaccion:'2 H⁺ + 2 e⁻ → H₂' }, H2), anodo:AGUA_ANODO },
    'agua-sulfato': { nombre:'agua con Na₂SO₄', global:'2 H₂O → 2 H₂ + O₂', queda:'Na₂SO₄ (no se gasta)',
      catodo:Object.assign({ semirreaccion:'2 H₂O + 2 e⁻ → H₂ + 2 OH⁻' }, H2), anodo:AGUA_ANODO },
    'nacl-acuoso': { nombre:'NaCl acuoso concentrado (salmuera)', global:'2 NaCl + 2 H₂O → 2 NaOH + H₂ + Cl₂', queda:'NaOH',
      catodo:Object.assign({ semirreaccion:'2 H₂O + 2 e⁻ → H₂ + 2 OH⁻' }, H2), anodo:CL2 },
    'nacl-fundido': { nombre:'NaCl fundido (sin agua)', global:'2 NaCl → 2 Na + Cl₂', queda:'nada: no hay agua',
      catodo:{ producto:'Na', id:'Na', z:1, gas:false, M:23, semirreaccion:'Na⁺ + e⁻ → Na' }, anodo:CL2 },
  });
  function sistemaDe(id) {
    const s = SISTEMAS[id];
    if (!s) throw new Error(`sistema de electrólisis desconocido: ${id} (usa ${Object.keys(SISTEMAS).join(', ')})`);
    return s;
  }
  // Carga que pasa: Q directo, o I por el tiempo (s, min o h). Sin nada, null.
  function cargaQ(o) {
    if (!o || (o.Q === undefined && o.I === undefined)) return null;
    if (o.Q !== undefined) return numero(o.Q, 'la carga', { positivo: true });
    const I = numero(o.I, 'la corriente', { positivo: true });
    if (o.s !== undefined) return I * numero(o.s, 'el tiempo', { positivo: true });
    if (o.min !== undefined) return I * 60 * numero(o.min, 'el tiempo', { positivo: true });
    if (o.h !== undefined) return I * 3600 * numero(o.h, 'el tiempo', { positivo: true });
    throw new Error('falta el tiempo (s, min o h) o la carga Q');
  }
  function electrolizar(id, o) {
    const S = sistemaDe(id), Q = cargaQ(o), molE = Q === null ? null : Q / F;
    const lado = (p, polo, tipo) => {
      const mol = molE === null ? null : molE / p.z;
      return { producto:p.producto, id:p.id, polo, tipo, semirreaccion:p.semirreaccion, z:p.z, gas:p.gas, M:p.M,
        mol, g: mol === null ? null : mol * p.M, L: mol === null || !p.gas ? null : mol * VM };
    };
    const catodo = lado(S.catodo, '−', 'reducción'), anodo = lado(S.anodo, '+', 'oxidación');
    // sin dividir entre z: volumen (o masa) como si cada unidad tomara un solo electrón
    const sinZ = p => (molE === null ? null : molE * (p.gas ? VM : p.M));
    const errores = { sinDividir: { catodo: sinZ(S.catodo), anodo: sinZ(S.anodo) } };
    if (id === 'agua-acida' || id === 'agua-sulfato') Object.assign(errores, {
      unoAUno: catodo.L, razonUnoAUno: 1,                        // "salen iguales": tantos litros de O₂ como de H₂
      catodoAlReves: 'O₂', anodoAlReves: 'H₂',                  // el oxígeno en el cátodo (polos al revés, EC3)
      oxigenoConDos: molE === null ? null : molE / 2 * VM,      // usa 2 F por mol de O₂, como para el H₂
    });
    if (id === 'nacl-acuoso') Object.assign(errores, { saleSodio: 'Na', comoDisociacion: 'Na⁺ y Cl⁻' });
    if (id === 'nacl-fundido') errores.saleHidrogeno = 'H₂';
    return { sistema:id, nombre:S.nombre, global:S.global, queda:S.queda, Q, molE, catodo, anodo,
      razonVolumen: S.catodo.gas && S.anodo.gas ? S.anodo.z / S.catodo.z : null, errores };
  }
  // Cuántas unidades de cada producto se forman con 'electrones' electrones (los mismos en los dos electrodos).
  function productos(id, electrones) {
    const S = sistemaDe(id), e = numero(electrones, 'los electrones');
    if (!Number.isInteger(e)) throw new Error('los electrones se cuentan con enteros');
    const uno = p => { const k = Math.floor(e / p.z); return { producto:p.producto, id:p.id, unidades:k, sobran:e - k * p.z }; };
    return { sistema:id, electrones:e, catodo:uno(S.catodo), anodo:uno(S.anodo) };
  }

  // Corre la animación 'segundos' segundos con pasos de dt y resume lo que pasó (para las pruebas y casos.json).
  function simular(o, segundos, dt) {
    const est = crearParticulas(o), h = dt || 1 / 30, pasos = Math.round(numero(segundos, 'el tiempo', { positivo: true }) / h);
    for (let k = 0; k < pasos; k++) pasoParticulas(est, h);
    const q = cargas(est);
    return { disueltos: est.disueltos, depositados: est.depositados, emitidos: est.emitidos, llegados: est.llegados,
      frenada: est.frenada, agotada: est.agotada, cargas: q, atomosA: est.atomosA };
  }

  return { F, POTENCIALES, FUENTE_POTENCIALES, ELECTRODO, par, semirreaccion, celda, pila, electrolisis, voltimetro,
    faraday, tiempoFaraday, serie, deposito, crearParticulas, pasoParticulas, cargas, simular, azar,
    VM, SISTEMAS, electrolizar, productos };
});
