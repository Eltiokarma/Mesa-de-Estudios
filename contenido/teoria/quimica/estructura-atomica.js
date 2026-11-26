/*
 * Teoría de «Estructura atómica» (quimica.estructura-atomica). Molde: docs/teoria.md y la unidad de referencia
 * contenido/teoria/fisica/movimiento-rectilineo.js; forma de química: contenido/teoria/quimica/materia-y-energia.js.
 * Compañera: Bruna (castora), voz resolutiva y cálida.
 * Fuente del contenido: docs/teoria/matriz/quimica.json (unidad 2), docs/teoria/fuentes/historia-ecuaciones-1.pdf
 * (p. 26) y las precisiones de Química del expediente. Errores: docs/investigacion/atomo-enlace-ideas-erroneas.md
 * (AT, TP4); los QM- son hipótesis nuevas (ninguno medido).
 *
 * Etapa 4 del plan de calidad (18 nov 2026). Propuesta aprobada por Gerson con todas sus recomendaciones:
 * docs/etapa4/propuesta-quimica.md (decisiones en docs/etapa4/decisiones.md). Seis ideas, en este orden y con estos id
 * (el avance se guarda con ellos): 1 «Partículas, isótopos e iones» (`nucleo-identidad`), 2 «Modelos atómicos»
 * (`modelos-atomicos`), 3 «Niveles, subniveles y orbitales» (`numeros-cuanticos`), 4 «Configuración electrónica»
 * (`configuracion-electronica`), 5 «Configuración de los iones» (`configuracion-iones`, nueva) y 6 «Hund y el último
 * electrón» (`desapareados-isoelectronicos`).
 * Fase 2 del método (docs/metodo/unidad/LEEME.md): la idea 1, con el visto bueno de Gerson (18 nov). Fase 3 (18 nov):
 * las ideas 2 a 6 rehechas contra el contrato con el mismo molde; la unidad declara calidad: 2 (estructura-atomica.test.js).
 * Objetos de prueba: hueso (quim-objeto), retablo y lámina de oro (quim-lamina), hotel del electrón (quim-hotel), salero de
 * Maras, frasco de sulfato ferroso y combi (quim-objeto, con las cajas de quim-cajas debajo).
 *
 * Ficha de tarea (diseno-y-animacion), idea 1
 *   Promesa: contar las partículas de un átomo o ion y decir qué número decide el elemento.
 *   Persona y condiciones: 5.º de secundaria o preuniversitario, celular de gama baja a 360 px, sin audio, a veces sin
 *     conexión.
 *   Resultado observable: da Z, A, N y electrones de un núclido con carga; distingue isótopo, isóbaro, isótono, ion e
 *     isoelectrónico; resuelve «X³⁻ es isoelectrónico con el Ca²⁺».
 *   Orden de atención: 1.º el núcleo (qué elemento es) · 2.º A = Z + N · 3.º los electrones (qué carga tiene).
 *   Estados: juego sin tocar · misión cumplida · predicción abierta · revelado · paso a paso · caso nuevo · acierto · «No sé».
 *   Duda que resuelve: ¿quitar un electrón cambia el elemento?
 *
 * Colores (molde §5b; propuesta §8): Z y los protones naranja c-o, N y los neutrones turquesa c-i, los electrones
 * violeta c-f, la carga carmín c-h; A y los números cuánticos en tinta; sin verde (def.colores; lo comprueba la prueba).
 * Las piezas quim-atomo y quim-cajas los usan con su opción 'zne' (la vieja paleta queda para quien no la pide);
 * quim-hotel, quim-lamina y los objetos nuevos de quim-objeto, siempre. Cuántos orbitales (2ℓ + 1, n²) va en turquesa,
 * como factor de los electrones; nunca en la misma idea que N (lo comprueba la prueba).
 * Letras (propuesta §7): N son los neutrones, como en los libros (A = Z + N); «Lee» lo avisa y el nitrógeno va siempre
 * por su nombre o con su número de masa (¹⁴N). A, el número de masa, nunca va en negrita; la letra de una alternativa sí,
 * en tinta ({ negrita }), porque el violeta es de los electrones.
 * Datos del mundo: el protón tiene unas 1836 veces la masa del electrón (valor de libro, con «unas»); el cobre de Cuajone tiene
 * Z = 29 (hecho sin cifra del mundo). La imagen del arándano en el estadio (OpenStax §2.3) no se usa: la página no se
 * pudo abrir para comprobarla (18 nov). El ejemplo de escala usa solo «unas 100 000 veces» (valor de libro).
 * Historia, una fecha por hecho (correcciones del 18 nov, A1; lo revisa estructura-atomica.test.js): Thomson halló el
 * electrón en 1897 (rayos catódicos) y propuso su modelo en 1904; Dalton 1808, Rutherford 1911, Bohr 1913.
 * Datos (ideas 4 a 6): configuraciones por n + ℓ (Madelung) en estado fundamental, con el Cr y el Cu como excepción, hasta
 * Z = 54; los casos generados no usan Nb, Mo, Ru, Rh, Pd ni Ag. La comparación de radios de los isoelectrónicos salió de
 * esta unidad (va a «Radio atómico e iónico» de Tabla periódica; decisiones del 18 nov).
 * Fuentes (no van al alumno): OpenStax Chemistry 2e §2.3 y §6.4; Dalton (1808), Rutherford (1911), Bohr (1913).
 * Ronda 2 del lector en frío (0.3.2, 18 nov, noche; rutinas/frio/quimica.estructura-atomica.md, «Correcciones de la ronda
 * 2»): ejemplos en la regla de la idea 1, el control y la regla de la idea 2, la f y el espín en la idea 3, el Cr y el Cu
 * en la regla de la idea 4, los juegos de las ideas 5 y 6 sin un arranque que confunde, «Mira» de Hund con los tres
 * primeros y después el cuarto, y cada alternativa con número de los ejemplos rehecha en estructura-atomica.test.js
 * (la E de «Tres pisos juntos» decía «cuenta dos veces el 3» con 36, que da 46). Cuentas aparte: scratchpad,
 * cor2-qui/scripts/cuentas2.py.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  // El motor de plantillas/atomo-y-tabla calcula la nube, los nodos y el r90 de la mesa 3D «La nube del orbital».
  const def = nodo ? fabrica(require('../../../nucleo/kit/kit.js'), require('../../../plantillas/atomo-y-tabla/motor.js'))
    : fabrica(root.Kit, root.MotorAtomo);
  if (nodo) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit, MA) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  // Un color fijo por magnitud en toda la unidad (molde §5b; propuesta §8, aprobada el 18 nov): Z y los protones naranja,
  // N y los neutrones turquesa, los electrones violeta, la carga carmín; A y los números cuánticos en tinta; sin verde.
  // La letra de una alternativa va en negrita y en tinta ({ negrita }): aquí el violeta es de los electrones (coordinación,
  // 18 nov). Lo comprueba estructura-atomica.test.js (cada ficha dice su magnitud en m; ninguna letra A–E lleva color).
  const COLORES = { protones: 'o', neutrones: 'i', electrones: 'f', carga: 'h', orbitales: 'i' };
  const ficha = m => t => ({ v: `c-${COLORES[m]}`, t: String(t), m });
  const Pz = ficha('protones'), Nn = ficha('neutrones'), Ee = ficha('electrones'), Qc = ficha('carga'), Oo = ficha('orbitales');
  const Z = Pz('Z'), N = Nn('N'), e = Ee('e⁻'), A = 'A';
  const letra = L => ({ negrita: [L] });
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = l => l[Math.floor(r() * l.length)];
    return r;
  }
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      if (d.valor === undefined || d.valor === null || (typeof d.valor === 'number' && !Number.isFinite(d.valor))) continue;
      const txt = fmt(d.valor);
      if (vistos.has(txt)) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    // Con una respuesta numérica y menos de cuatro opciones (los errores coincidieron), se completa con cuentas vecinas.
    for (const dx of [2, 3, -2, 4, 5]) {
      if (ops.length >= 4 || typeof correcta !== 'number' || correcta + dx < 0) continue;
      const txt = fmt(correcta + dx);
      if (vistos.has(txt)) continue;
      vistos.add(txt);
      ops.push({ id: `cuenta${dx}`, texto: txt, error: 'QM-CUENTA', siFuera: 'El camino puede estar bien, pero la cuenta no da ese número: revísala paso por paso.' });
    }
    return ops.slice(0, 4);
  }
  const SUP = { '-': '⁻', '+': '⁺', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const sup = x => String(x).split('').map(c => SUP[c] || c).join('');
  const carga = q => (q === 0 ? '' : sup(`${Math.abs(q) === 1 ? '' : Math.abs(q)}${q > 0 ? '+' : '-'}`));
  const signo = q => (q > 0 ? `+${q}` : q < 0 ? `−${-q}` : '0');

  const SIMB = ['', 'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca',
    'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr',
    'Rb', 'Sr', 'Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn', 'Sb', 'Te', 'I', 'Xe'];
  const NOMBRE = ['', 'hidrógeno', 'helio', 'litio', 'berilio', 'boro', 'carbono', 'nitrógeno', 'oxígeno', 'flúor', 'neón', 'sodio', 'magnesio',
    'aluminio', 'silicio', 'fósforo', 'azufre', 'cloro', 'argón', 'potasio', 'calcio', 'escandio', 'titanio', 'vanadio', 'cromo', 'manganeso',
    'hierro', 'cobalto', 'níquel', 'cobre', 'cinc', 'galio', 'germanio', 'arsénico', 'selenio', 'bromo', 'kriptón',
    'rubidio', 'estroncio', 'itrio', 'circonio', 'niobio', 'molibdeno', 'tecnecio', 'rutenio', 'rodio', 'paladio', 'plata', 'cadmio', 'indio',
    'estaño', 'antimonio', 'telurio', 'yodo', 'xenón'];
  const Nombre = z => NOMBRE[z].charAt(0).toUpperCase() + NOMBRE[z].slice(1);

  // ---------- Configuración electrónica (ideas 4 a 6, fase 3, 18 nov) ----------
  // Orden de llenado por n + ℓ y, a igual n + ℓ, menor n (Madelung), hasta el 5p (Z = 54: el «Ahora tú» de examen llega
  // al xenón). Excepciones que enseña la unidad: el cromo y el cobre pasan un electrón del 4s al 3d (las de la quinta fila,
  // Nb, Mo, Ru, Rh, Pd y Ag, no salen en ningún caso generado). Cationes: salen primero los del mayor n y, a igual n, los
  // del mayor ℓ. Aniones: suman en el orden de llenado. Convención de mₗ y mₛ (tarjeta «ultimo-electron» de
  // nucleo/convencion.js): cajas de −ℓ a +ℓ, primero una ↑ (+½) en cada una, después las ↓ (−½). Las configuraciones se
  // comprobaron contra una tabla escrita aparte (scratchpad, f3/cuentas.py).
  const LETRA = 'spdf';
  const ORDEN = [[1, 0], [2, 0], [2, 1], [3, 0], [3, 1], [4, 0], [3, 2], [4, 1], [5, 0], [4, 2], [5, 1]]
    .map(([n, l]) => ({ n, l, nom: `${n}${LETRA[l]}`, cap: 2 * (2 * l + 1), precio: n + l }));
  const SUB = {}; ORDEN.forEach((o, i) => { SUB[o.nom] = Object.assign({ i }, o); });
  const ANOMALOS = { 24: { '4s': 1, '3d': 5 }, 29: { '4s': 1, '3d': 10 } };
  const GASES = [[36, 'Kr', 8], [18, 'Ar', 5], [10, 'Ne', 3], [2, 'He', 1]];   // [electrones, símbolo, subniveles del núcleo]
  const GAS_NOMBRE = { 2: 'helio', 10: 'neón', 18: 'argón', 36: 'kriptón', 54: 'xenón' };
  // config(e): e electrones por el orden de llenado, sin excepciones → [{ nom, n, l, e }] (solo los que tienen electrones).
  function config(e) {
    const out = [];
    let resto = e;
    for (const o of ORDEN) { if (resto <= 0) break; const k = Math.min(o.cap, resto); out.push({ nom: o.nom, n: o.n, l: o.l, e: k }); resto -= k; }
    return out;
  }
  const ordenar = c => c.filter(x => x.e > 0).sort((a, b) => SUB[a.nom].i - SUB[b.nom].i);
  function configNeutro(z) {
    const c = config(z), an = ANOMALOS[z];
    if (!an) return c;
    for (const [nom, k] of Object.entries(an)) { const x = c.find(y => y.nom === nom); if (x) x.e = k; else c.push({ nom, n: SUB[nom].n, l: SUB[nom].l, e: k }); }
    return ordenar(c);
  }
  // La configuración de una especie: el átomo neutro y, después, los electrones que salen (catión) o llegan (anión).
  function configEspecie(z, q = 0) {
    const c = configNeutro(z).map(x => Object.assign({}, x));
    for (let k = 0; k < q; k++) {
      const vivos = c.filter(x => x.e > 0);
      if (!vivos.length) break;
      vivos.sort((a, b) => b.n - a.n || b.l - a.l)[0].e -= 1;
    }
    for (let k = 0; k < -q; k++) {
      const o = ORDEN.find(y => { const x = c.find(w => w.nom === y.nom); return !x || x.e < y.cap; });
      if (!o) break;
      const x = c.find(w => w.nom === o.nom);
      if (x) x.e += 1; else c.push({ nom: o.nom, n: o.n, l: o.l, e: 1 });
    }
    return ordenar(c);
  }
  const totalE = c => c.reduce((a, x) => a + x.e, 0);
  const textoConfig = c => c.map(x => `${x.nom}${sup(x.e)}`).join(' ');
  // Abreviada: el gas noble más grande con MENOS electrones que la especie, si sus subniveles están llenos (la misma regla
  // del generador configuracion-ubicacion: Cl⁻ es [Ne] 3s² 3p⁶ y Br⁻, [Ar] 4s² 3d¹⁰ 4p⁶; correcciones del 18 nov, M5).
  function abreviada(c) {
    const e = totalE(c);
    for (const [ne, g, k] of GASES) {
      if (ne >= e) continue;
      const nucleo = ORDEN.slice(0, k);
      if (nucleo.every(o => (c.find(x => x.nom === o.nom) || {}).e === o.cap)) return `[${g}] ${textoConfig(c.filter(x => !nucleo.some(o => o.nom === x.nom)))}`;
    }
    return textoConfig(c);
  }
  // Electrones solos (Hund) y números cuánticos del último electrón (el último en el orden de llenado), con la convención.
  const solosDe = (e, cajas) => (e <= cajas ? e : 2 * cajas - e);
  const solos = c => c.reduce((a, x) => a + solosDe(x.e, 2 * x.l + 1), 0);
  function ultimo(c) {
    const x = c[c.length - 1], b = 2 * x.l + 1;
    return x.e <= b ? { n: x.n, l: x.l, ml: -x.l + x.e - 1, ms: 1 } : { n: x.n, l: x.l, ml: -x.l + (x.e - b) - 1, ms: -1 };
  }
  const MS = m => (m > 0 ? '+½' : '−½');
  const ML = m => (m > 0 ? `+${m}` : m < 0 ? `−${-m}` : '0');
  const qnTxt = q => `(${q.n}; ${q.l}; ${ML(q.ml)}; ${MS(q.ms)})`;
  const filasDe = c => c.map(x => ({ nombre: x.nom, e: x.e, cajas: 2 * x.l + 1 }));
  const ultimoNivel = c => Math.max(...c.map(x => x.n));
  const valencia = c => { const n = ultimoNivel(c); return c.filter(x => x.n === n).reduce((a, x) => a + x.e, 0); };
  // Niveles completamente llenos: todos los subniveles de ℓ = 0 a n − 1 llenos (el 4 pide también 4d y 4f).
  const nivelesLlenos = c => [1, 2, 3, 4].filter(n => Array.from({ length: n }, (_, l) => l).every(l => (c.find(x => x.nom === `${n}${LETRA[l]}`) || {}).e === 2 * (2 * l + 1))).length;
  // El nitrógeno va con su número de masa (¹⁴N): N son los neutrones en esta unidad (decisiones del 18 nov, pregunta 7).
  const SIMB_Q = (z, q) => `${z === 7 ? '¹⁴N' : SIMB[z]}${carga(q)}`;
  // Los datos que se repiten (contrato, punto 13: herramientas, no el paso hecho).
  const DC = {
    orden: 'Orden de llenado: 1s 2s 2p 3s 3p 4s 3d 4p 5s 4d 5p',
    orden36: 'Orden de llenado: 1s 2s 2p 3s 3p 4s 3d 4p',
    capacidad: 'Caben: 2 en un s, 6 en un p, 10 en un d',
    letras: 'ℓ: s es 0, p es 1, d es 2, f es 3',
    lDe: 'ℓ va de 0 a n − 1',
    mlDe: 'mₗ va de −ℓ a +ℓ: un orbital por cada valor',
    orbitales: ['Orbitales de un subnivel: 2', 'ℓ', ' + 1'],
    dos: 'En un orbital caben 2 electrones, de espín opuesto',
    ms: 'mₛ = +½ o −½',
    anomalia: 'Cromo y cobre: un electrón del 4s pasa al 3d',
    he: '[He]: los 2 electrones del helio',
    ne: '[Ne]: los 10 electrones del neón',
    ar: '[Ar]: los 18 electrones del argón',
    kr: '[Kr]: los 36 electrones del kriptón',
    // Herramientas de las ideas 5 y 6 (correcciones del 18 nov, A2): la salida del catión y Hund, como el orden de llenado
    // en la idea 4. Las mismas palabras en el generador configuracion-ubicacion (DEA).
    cation: 'Catión: salen primero los de mayor n; a igual n, los de mayor ℓ',
    hund: 'Hund: una flecha en cada caja vacía antes de aparear',
    magnetico: 'Paramagnética: con electrones desapareados; un imán la atrae. Diamagnética: sin ellos',
    valencia: 'Último nivel (capa de valencia): el de mayor n',
    carga: ['carga = ', Z, ' − ', e],
    conv1: 'Convención: las cajas van de mₗ = −ℓ (izquierda) a +ℓ (derecha)',
    conv2: 'Convención: primero una ↑ (mₛ = +½) en cada caja; después las ↓ (mₛ = −½)',
    cajasSub: 'Orbitales: 1 en un s, 3 en un p, 5 en un d',
  };
  // Lo que se lee de un ejercicio, en texto plano (para saber qué símbolos usa).
  const txt = x => (Array.isArray(x) ? x.map(txt).join(' ') : x && typeof x === 'object' ? (x.t !== undefined ? String(x.t) : Object.values(x).map(txt).join(' '))
    : x === undefined || x === null || typeof x === 'function' ? '' : String(x));
  // Un gas abreviado ([He], [Ne], [Ar], [Kr]) en el enunciado, las alternativas, el resuelto o la figura lleva su línea en
  // «Datos» (correcciones del 18 nov, A3 y nota c). Se agrega al final si falta.
  const LINEA_GAS = { He: DC.he, Ne: DC.ne, Ar: DC.ar, Kr: DC.kr };
  function conGases(caso) {
    if (!caso) return caso;
    const leido = txt(Object.entries(caso).filter(([k]) => k !== 'datos').map(([, v]) => v));
    const datos = (caso.datos || []).slice();
    for (const g of Object.keys(LINEA_GAS)) {
      if (!leido.includes(`[${g}]`)) continue;
      if (!datos.some(d => txt(d).startsWith(`[${g}]:`))) datos.push(LINEA_GAS[g]);
    }
    return Object.assign({}, caso, { datos });
  }
  // Ideas 5 y 6 (A2): si el ejercicio pide quitar electrones a un catión con nombre cuya configuración no está en los
  // datos, va la regla de salida; si pide electrones solos o el imán, va Hund (y, si nombra el imán o para/diamagnético,
  // qué es cada uno).
  const CATION_RE = /(?:^|[^A-Za-z])((?!X)[A-Z][a-z]?)([²³⁴]?⁺)/g;
  function conReglas(caso) {
    if (!caso) return caso;
    const q = txt([caso.pregunta || caso.enunciado, caso.alternativas, (caso.opciones || []).map(o => o.texto)]), datos = (caso.datos || []).slice(), dt = () => datos.map(txt);
    const cationes = [...q.matchAll(CATION_RE)].map(m => m[1] + m[2]);
    if (cationes.some(c => !dt().some(d => d.startsWith(`${c}:`))) && !dt().includes(DC.cation)) datos.push(DC.cation);
    const todo = txt([caso.pregunta, caso.enunciado, caso.solucion, caso.pasos, caso.respuesta]);
    if (/desapareados|diamagn|paramagn|imán|solos/i.test(q) && !dt().some(d => /^Hund:/.test(d))) datos.push(DC.hund);
    if (/diamagn|paramagn|imán/i.test(todo) && !/es decir/.test(q) && !dt().some(d => /^(Para|Dia)magn/.test(d))) datos.push(DC.magnetico);
    return Object.assign({}, caso, { datos });
  }

  // Gesto directo (docs/teoria.md §4b) de la mesa «arma-ion»: la manija de la carga va a la derecha del átomo, a la altura
  // del núcleo. A la derecha salen electrones (carga +), a la izquierda llegan (carga −); 18 px por electrón, con la
  // geometría de quim-atomo (cx del átomo k). Es una función de la carga sola, así que mover es su inversa exacta.
  const GA = () => Kit.piezas['quim-atomo'];
  const PASO_Q = 18;
  const manijaCarga = (dib, q, k = 0) => { const a = GA().geometria(dib.datos).atomo(k); return { x: a.cx + 90 + PASO_Q * q, y: a.cy }; };
  const cargaEn = (dib, pt, k = 0) => (pt.x - GA().geometria(dib.datos).atomo(k).cx - 90) / PASO_Q;
  // Animación (docs/3d.md §6): un control con auto avanza sin ajustarse al paso; los conteos se leen enteros.
  const ent = (v, ...ids) => { const w = Object.assign({}, v); for (const k of ids) w[k] = Math.round(w[k]); return w; };

  // ---------- Idea 1 (rehecha, 18 nov): partículas, isótopos e iones ----------
  // Propuesta aprobada: docs/etapa4/propuesta-quimica.md (§3 a §8, idea 1), con todas sus recomendaciones
  // (docs/etapa4/decisiones.md). Objeto de la primera pantalla: el hueso de la llama del museo (el de la idea 6 de Materia
  // y energía) y, por una lupa, dos átomos de su carbono (pieza quim-objeto, dibujo de prueba; los átomos con la paleta
  // 'zne' de quim-atomo).
  // Cambia: protones (Z) y neutrones (N) del átomo que arma el alumno · Permanece: el carbono-12 del hueso, a la
  // izquierda, para comparar · Progresa: de nombrar el elemento por Z a contar A = Z + N · Se reserva: los electrones
  // (el control de la carga sale del juego: es lo que se predice; vuelve en la mesa «arma-ion») · Debe verse: con otro
  // N sigue siendo el mismo elemento; con otro Z, es otro.
  // Errores (hipótesis, docs/investigacion/atomo-enlace-ideas-erroneas.md; los QM- nuevos sin medir): QM-ION-ELEMENTO-E
  // (el elemento por los electrones), QM-ION-ELEMENTO-Q (suma la carga a Z), QM-ION-ISOTOPO (ion por isótopo), AT4
  // (tantos neutrones como protones), QM-CARGA-N (resta la carga en el núcleo), QM-NEUTRONES (da A por N), QM-CARGA-E (el
  // ion con los electrones del neutro), QM-CARGA-SIGNO (la carga al revés), QM-ISOTOPO-N, -A, -ELEMENTO, -REACCIONA, -UNO,
  // QM-NUCLIDO-ISOTOPO, -ISOBARO, -ISOTONO, -NADA, QM-ISO-Z, QM-ISO-NEUTRO, QM-CARGA-A y QM-SUMA-TODO.
  // N son los neutrones (A = Z + N, la notación de los libros): el nitrógeno va siempre por su nombre o con su número de
  // masa (¹⁴N), nunca como «N» suelto (decisiones del 18 nov, pregunta 7; estructura-atomica.test.js lo revisa).
  const ATOMO = o => ({ pieza: 'quim-atomo', datos: Object.assign({ paleta: 'zne' }, o), estado: {} });
  const HUESO = (o, estado) => ({ pieza: 'quim-objeto', datos: Object.assign({ objeto: 'hueso' }, o), estado: estado || {} });
  const nuclido = (z, a, q = 0) => `${sup(a)}${SIMB[z]}${carga(q)}`;
  const DF1 = {
    masa: ['A = ', Z, ' + ', N],
    carga: ['carga = ', Z, ' − ', e],
    nota: 'Número de arriba a la izquierda: A; arriba a la derecha: la carga',
    neutro: 'En un átomo neutro, electrones = protones',
    familias: 'Isótopos: mismo Z. Isóbaros: mismo A. Isótonos: mismo N',
    iso: 'Isoelectrónicos: la misma cantidad de electrones',
  };
  // El carbono-12 del hueso, a la izquierda del juego: para comparar.
  const REF12 = { Z: 6, N: 6, titulo: 'carbono-12', rotulo: 'A = 12' };
  const juegoHueso = v => HUESO({ atomos: [REF12, { Z: v.z, N: v.n, titulo: 'Tu átomo', rotulo: `A = ${v.z + v.n}` }] });

  // Ahora tú (seis tipos, del más simple al de examen). Cada uno da sus datos (contrato, punto 13).
  // Núclidos reales (auditoría, B5; cabos de la Etapa 4, 19 nov): todos están en plantillas/particulas-nucleo/nuclidos.js
  // y lo comprueba estructura-atomica.test.js. El bromo iba con A = 80, que no es de los naturales (79 y 81): ahora ⁷⁹Br.
  const IONES1 = [[8, 16, -2], [11, 23, 1], [12, 24, 2], [13, 27, 3], [16, 32, -2], [17, 35, -1], [17, 37, -1], [19, 39, 1], [20, 40, 2],
    [26, 56, 3], [26, 56, 2], [9, 19, -1], [7, 14, -3], [29, 63, 2], [30, 65, 2], [35, 79, -1]];
  function casoNeutrones(r) {
    const [z, a, q] = r.de(IONES1);
    return {
      pregunta: ['El ion ', nuclido(z, a, q), ' tiene ', Z, ` = ${z}. ¿Cuántos neutrones tiene su núcleo?`],
      datos: [DF1.masa, DF1.nota],
      opciones: opciones(a - z, [
        { id: 'carga', valor: a - z - q, error: 'QM-CARGA-N', siFuera: 'Restar A − Z está bien. Pero la carga depende de los electrones, así que no se resta al contar el núcleo.' },
        { id: 'a', valor: a, error: 'QM-NEUTRONES', siFuera: 'Ese es A, bien leído del símbolo. Pero A junta protones y neutrones, así que falta quitarle Z.' },
        { id: 'z', valor: z, error: 'AT4', siFuera: 'Ese es Z, bien leído. Pero no siempre hay tantos neutrones como protones: los neutrones salen de A.' },
        { id: 'suma', valor: a + z, error: 'QM-NEUTRONES', siFuera: 'Usar A y Z está bien. Pero los neutrones son lo que queda al quitarle Z a A, no al sumarlo.' },
      ], x => `${x}`),
      solucion: { texto: 'Los neutrones son A − Z. La carga depende de los electrones, así que no cambia nada en el núcleo.', ecuacion: [N, ` = ${a} − ${z} = `, Nn(a - z)] },
    };
  }
  function casoElectrones(r) {
    const [z, a, q] = r.de(IONES1);
    return {
      pregunta: ['El ion ', nuclido(z, a, q), ' tiene ', Z, ` = ${z}. ¿Cuántos electrones tiene?`],
      datos: [DF1.carga, DF1.nota],
      opciones: opciones(z - q, [
        { id: 'signo', valor: z + q, error: 'QM-CARGA-SIGNO', siFuera: 'Usar la carga está bien. Pero con carga positiva faltan electrones, y con carga negativa sobran.' },
        { id: 'neutro', valor: z, error: 'QM-CARGA-E', siFuera: 'Así sería el átomo neutro. Pero el ion tiene carga, y eso dice que ganó o perdió electrones.' },
        { id: 'neutrones', valor: a - z, error: 'QM-NEUTRONES', siFuera: 'A − Z está bien restado, pero esa resta cuenta los neutrones del núcleo, no los electrones.' },
        { id: 'a', valor: a - q, error: 'QM-CARGA-A', siFuera: 'Usar la carga con su signo está bien. Pero la carga se aplica a Z, los protones, y no a A.' },
      ], x => `${x}`),
      solucion: { texto: `La carga es ${signo(q)}: el ion ${q > 0 ? 'perdió' : 'ganó'} ${Math.abs(q)} respecto de los ${z} electrones del átomo neutro.`, ecuacion: [e, ` = ${z} − (${signo(q)}) = `, Ee(z - q)] },
    };
  }
  const PARES_ISOTOPOS = [[6, 12, 14], [17, 35, 37], [8, 16, 18], [1, 1, 2], [19, 39, 41], [12, 24, 26]];
  function casoIsotopos(r) {
    const [z, a1, a2] = r.de(PARES_ISOTOPOS), x1 = nuclido(z, a1), x2 = nuclido(z, a2), nom = NOMBRE[z];
    if (r() < 0.5) return {
      pregunta: ['El ', x1, ' y el ', x2, ` son isótopos del ${nom}. ¿Qué tienen igual estos dos átomos neutros?`],
      datos: [`Z del ${nom} = ${z}`, DF1.masa, DF1.neutro],
      opciones: [
        { id: 'c', texto: 'Protones y electrones', correcta: true },
        { id: 'n', texto: 'Neutrones', error: 'QM-ISOTOPO-N', siFuera: `Bien buscar lo que comparten. Pero los neutrones son justo lo que cambia: ${a1 - z} y ${a2 - z}.` },
        { id: 'a', texto: 'Número de masa', error: 'QM-ISOTOPO-A', siFuera: `Sería cierto en dos isóbaros. Aquí los números de masa son ${a1} y ${a2}.` },
        { id: 'nada', texto: 'Nada: son elementos distintos', error: 'QM-ISOTOPO-ELEMENTO', siFuera: `Sería así si cambiara Z. Los dos tienen Z = ${z}: son ${nom}.` },
      ],
      solucion: { texto: `Los dos tienen ${z} ${z === 1 ? 'protón' : 'protones'} y, como son neutros, ${z} ${z === 1 ? 'electrón' : 'electrones'}; solo cambian los neutrones.`, ecuacion: [Z, ` = ${z} y `, e, ` = ${z} en los dos   ·   `, N, ` = ${a1 - z} y ${a2 - z}`] },
    };
    return {
      pregunta: ['El ', x1, ' y el ', x2, ` son átomos neutros del ${nom}. ¿Cómo son sus reacciones químicas, comparadas?`],
      datos: [`Z del ${nom} = ${z}`, 'Una reacción química depende de los electrones', DF1.neutro],
      opciones: [
        { id: 'c', texto: 'Iguales: tienen los mismos electrones', correcta: true },
        { id: 'n', texto: 'Distintas: tienen distintos neutrones', error: 'QM-ISOTOPO-REACCIONA', siFuera: 'Es cierto que sus neutrones son distintos. Pero las reacciones las deciden los electrones, y los dos tienen los mismos.' },
        { id: 'uno', texto: 'Solo reacciona el más liviano', error: 'QM-ISOTOPO-UNO', siFuera: 'Bien notar que uno tiene más masa. Pero los dos tienen los mismos electrones, así que los dos reaccionan.' },
        { id: 'nada', texto: 'Distintas: son elementos distintos', error: 'QM-ISOTOPO-ELEMENTO', siFuera: `Sería así si cambiara Z. Los dos tienen Z = ${z}: son ${nom}.` },
      ],
      solucion: { texto: `Tienen el mismo Z y, como son neutros, los mismos ${z} electrones: por eso reaccionan igual.`, ecuacion: [e, ` = ${z} en los dos`] },
    };
  }
  // Pares de núclidos neutros y qué son: isótopos (mismo Z), isóbaros (mismo A) o isótonos (mismo N).
  const PARES_NUCLIDOS = [[[6, 14], [7, 14]], [[6, 13], [7, 14]], [[18, 40], [20, 40]], [[19, 39], [20, 40]], [[17, 35], [17, 37]],
    [[11, 23], [12, 24]], [[8, 16], [8, 18]], [[15, 32], [16, 32]], [[1, 3], [2, 3]], [[5, 11], [6, 12]]];
  function casoNuclidos(r) {
    const [[z1, a1], [z2, a2]] = r.de(PARES_NUCLIDOS), n1 = a1 - z1, n2 = a2 - z2;
    const es = z1 === z2 ? 'isotopos' : a1 === a2 ? 'isobaros' : 'isotonos';
    const TXT = { isotopos: 'Isótopos', isobaros: 'Isóbaros', isotonos: 'Isótonos' };
    const zDatos = z1 === z2 ? `Z del ${NOMBRE[z1]} = ${z1}` : `Z del ${NOMBRE[z1]} = ${z1}; Z del ${NOMBRE[z2]} = ${z2}`;
    const NO = {
      isotopos: { error: 'QM-NUCLIDO-ISOTOPO', siFuera: `Bien comparar los núcleos. Pero isótopos tendrían el mismo Z, y aquí Z es ${z1} y ${z2}.` },
      isobaros: { error: 'QM-NUCLIDO-ISOBARO', siFuera: `Bien comparar los núcleos. Pero isóbaros tendrían el mismo A, y aquí A es ${a1} y ${a2}.` },
      isotonos: { error: 'QM-NUCLIDO-ISOTONO', siFuera: `Bien comparar los núcleos. Pero isótonos tendrían el mismo N, y aquí N es ${n1} y ${n2}.` },
    };
    const comun = es === 'isotopos' ? [Z, ` = ${z1} en los dos`] : es === 'isobaros' ? [A, ` = ${a1} en los dos`] : [N, ' = ', Nn(n1), ' en los dos'];
    return {
      pregunta: ['¿Qué son entre sí el ', nuclido(z1, a1), ' y el ', nuclido(z2, a2), '?'],
      datos: [zDatos, DF1.familias, DF1.masa],
      opciones: Object.keys(TXT).map(k => (k === es ? { id: 'c', texto: TXT[k], correcta: true } : Object.assign({ id: k, texto: TXT[k] }, NO[k])))
        .concat([{ id: 'nada', texto: 'Nada: no comparten ningún número', error: 'QM-NUCLIDO-NADA', siFuera: 'Sería así si Z, A y N fueran distintos. Compara los tres números: uno de ellos coincide.' }]),
      solucion: { texto: `Los Z son ${z1} y ${z2}; los A, ${a1} y ${a2}, y los N, ${n1} y ${n2}. El que coincide es ${es === 'isotopos' ? 'Z' : es === 'isobaros' ? 'A' : 'N'}.`, ecuacion: comun },
    };
  }
  // Especies con su carga para el caso «isoelectrónico»: [Z, carga].
  const ISO_Y = [[20, 2], [19, 1], [17, -1], [16, -2], [11, 1], [12, 2], [9, -1], [8, -2], [13, 3]];
  function casoIsoelectronico(r) {
    for (let i = 0; ; i++) {
      const [zy, qy] = r.de(ISO_Y), qx = r.de([-3, -2, -1, 1, 2, 3]), ey = zy - qy, zx = ey + qx;
      if (zx === zy || zx < 1 || (i < 50 && Math.abs(qx) === Math.abs(qy) && Math.sign(qx) === Math.sign(qy))) continue;
      const y = `${SIMB[zy]}${carga(qy)}`;
      const ops = opciones(zx, [
        { id: 'z-igual', valor: ey, error: 'QM-ISO-Z', siFuera: `Es cierto que X también tiene ${ey} electrones. Pero X tiene carga, así que su Z no es igual a sus electrones.` },
        { id: 'signo', valor: ey - qx, error: 'QM-CARGA-SIGNO', siFuera: `Partir de ${ey} electrones está bien. Revisa el signo: la carga es Z menos los electrones.` },
        { id: 'neutro', valor: zy + qx, error: 'QM-ISO-NEUTRO', siFuera: `Usar la carga de X está bien. Pero el ${y} ya no tiene ${zy} electrones: tiene ${ey}.` },
        { id: 'suma', valor: zy - qx, error: 'QM-ISO-NEUTRO', siFuera: `Igualar los electrones está bien. Pero el ${y} no tiene ${zy} electrones: tiene ${ey}.` },
      ], x => `${x}`);
      if (ops.length < 4) continue;
      return {
        pregunta: ['El ion X', carga(qx), ' es isoelectrónico con el ', y, '. ¿Cuál es el número atómico de X?'],
        datos: [`Z del ${NOMBRE[zy]} = ${zy}`, DF1.carga, DF1.iso],
        opciones: ops,
        solucion: { texto: `El ${y} tiene ${ey} electrones, y X tiene esos mismos ${ey} con carga ${signo(qx)}.`, ecuacion: [Z, ` = ${ey} + (${signo(qx)}) = `, Pz(zx)] },
      };
    }
  }
  function casoMasaIon(r) {
    for (;;) {
      const z = r.ent(8, 30), q = r.de([-3, -2, -1, 1, 2, 3]), el = z - q, nN = z + r.ent(0, 6), a = z + nN;
      const ops = opciones(a, [
        { id: 'e', valor: el + nN, error: 'QM-CARGA-E', siFuera: `Sumar los ${nN} neutrones está bien. Pero el ion tiene carga, así que sus protones no son ${el}.` },
        { id: 'signo', valor: el - q + nN, error: 'QM-CARGA-SIGNO', siFuera: 'Usar la carga está bien. Revisa el signo: la carga es Z menos los electrones.' },
        { id: 'z', valor: z, error: 'QM-NEUTRONES', siFuera: `Ese es Z, bien calculado. Falta sumarle los ${nN} neutrones, porque A = Z + N.` },
        { id: 'todo', valor: a + el, error: 'QM-SUMA-TODO', siFuera: `Z y N están bien. Pero A cuenta solo lo que hay en el núcleo, así que los ${el} electrones no se suman.` },
      ], x => `${x}`);
      if (ops.length < 4) continue;
      return {
        pregunta: ['Un ion X', carga(q), ` tiene ${el} electrones y ${nN} neutrones. ¿Cuál es su número de masa?`],
        datos: [DF1.carga, DF1.masa],
        opciones: ops,
        solucion: { texto: `Primero se hallan los protones con la carga; después, A sale de sumarles los neutrones.`, ecuacion: [Z, ` = ${el} + (${signo(q)}) = `, Pz(z), '   ·   ', A, ` = ${z} + ${nN} = ${a}`] },
      };
    }
  }
  // Así se resuelve: las tres partículas de un núclido con carga (Ahora tú nunca pide las tres juntas).
  const IONES_R = [[17, 37, -1], [12, 26, 2], [16, 34, -2], [19, 41, 1], [20, 44, 2], [13, 27, 3], [8, 17, -2], [11, 23, 1], [26, 54, 2], [9, 19, -1]];

  // Ejemplos resueltos (pestaña «Ejemplos», docs/teoria.md 4h; molde §3 con las reglas del 18 nov: el dibujo muestra lo
  // que cada dato marca por sí solo, nunca lo que sale de juntarlos). Cuentas rehechas aparte, sin el código de la unidad
  // (scratchpad, e4-qui/cuentas-idea1.py): ⁶³Cu A = 29 + 34 = 63 · ¹⁸O N = 18 − 8 = 10 · Ca²⁺ e = 20 − 2 = 18 · 17 p →
  // cloro · ¹H y ²H: Z = 1 los dos · ³⁵Cl⁻: 17, 18, 18 · Al: 13 − 10 = +3 · ³⁵Cl y ³⁷Cl: N 18 y 20, e 17 y 17 · agua
  // pesada: 2 · (2 − 1) + (16 − 8) = 10 · con el neón: Na⁺ 10, Mg 12, F⁻ 10, O²⁻ 10, Cl⁻ 18 → 3 · X³⁻ con Ca²⁺: 18 − 3 =
  // 15 (errores 18, 21, 17, 23) · X²⁺ con 24 e y 30 n: 26 + 30 = 56 (errores 54, 52, 26, 58) · ⁴⁰Ar, ⁴⁰Ca, ³⁹K: N 22, 20,
  // 20 → isóbaros Ar y Ca, isótonos K y Ca · isótopos: protones y propiedades químicas · A = 52, N = 28: 24 + 28 + 24 = 76
  // (errores 52, 80, 104, 48).
  const EJEMPLOS_NUCLEO = [
    { nivel: 1, titulo: 'El cobre de Cuajone',
      enunciado: 'Un átomo del cobre que sale de la mina de Cuajone tiene 29 protones y 34 neutrones. ¿Cuál es su número de masa?',
      datos: [DF1.masa],
      figura: ATOMO({ atomos: [{ Z: 29, N: 34, e: null, titulo: 'cobre', rotulo: 'A = ?' }] }),
      solucion: [{ texto: 'El número de masa cuenta todo lo que hay en el núcleo: protones más neutrones.', ecuacion: [A, ' = ', Pz(29), ' + ', Nn(34), ' = 63'] }],
      respuesta: [A, ' = 63'] },
    { nivel: 1, titulo: 'Los neutrones del oxígeno-18',
      enunciado: 'Un átomo de oxígeno-18 tiene 8 protones. ¿Cuántos neutrones tiene?',
      datos: [DF1.masa, 'En «oxígeno-18», 18 es el número de masa A'],
      figura: ATOMO({ atomos: [{ Z: 8, N: 10, e: null, titulo: 'oxígeno-18', oculto: ['N'], rotulo: 'A = 18' }] }),
      solucion: [{ texto: 'Al número de masa le quito los protones, y lo que queda son los neutrones.', ecuacion: [N, ' = 18 − ', Pz(8), ' = ', Nn(10)] }],
      respuesta: [Nn(10), ' neutrones'] },
    { nivel: 1, titulo: 'Los electrones del Ca²⁺',
      enunciado: '¿Cuántos electrones tiene el ion Ca²⁺?',
      datos: ['Z del calcio = 20', DF1.carga],
      figura: ATOMO({ atomos: [{ Z: 20, N: null, e: 18, titulo: 'Ca', carga: 2, oculto: ['e'] }] }),
      solucion: [{ texto: 'Despejo los electrones: son los protones menos la carga. Como la carga es +2, el átomo perdió dos.', ecuacion: [e, ' = ', Pz(20), ' − ', Qc('(+2)'), ' = ', Ee(18)] }],
      respuesta: [Ee(18), ' electrones'] },
    { nivel: 1, titulo: '¿Qué elemento es?',
      enunciado: 'Un átomo tiene 17 protones, 18 neutrones y 17 electrones. ¿De qué elemento es?',
      datos: ['Z del azufre = 16', 'Z del cloro = 17', 'Z del argón = 18'],
      figura: ATOMO({ atomos: [{ Z: 17, N: 18, titulo: '?' }] }),
      solucion: [{ texto: 'El elemento lo decide Z, los protones, y Z = 17 es el cloro. Los 18 neutrones no cambian el nombre, así que no es argón.', ecuacion: [Z, ' = ', Pz(17), ': cloro'] }],
      respuesta: ['Cloro: ', Z, ' = ', Pz(17)] },
    { nivel: 1, titulo: 'Hidrógeno y deuterio',
      enunciado: 'Un átomo de hidrógeno común tiene 1 protón, ningún neutrón y 1 electrón. Uno de deuterio tiene 1 protón, 1 neutrón y 1 electrón. ¿Son el mismo elemento?',
      datos: ['Z del hidrógeno = 1', DF1.familias],
      figura: ATOMO({ atomos: [{ Z: 1, N: 0, titulo: 'hidrógeno' }, { Z: 1, N: 1, titulo: 'deuterio' }] }),
      solucion: [{ texto: 'Los dos tienen 1 protón, así que tienen el mismo Z y son el mismo elemento. Como solo cambia N, son isótopos.', ecuacion: [Z, ' = ', Pz(1), ' en los dos   ·   ', N, ' = ', Nn(0), ' y ', Nn(1)] }],
      respuesta: ['Sí: los dos tienen ', Z, ' = ', Pz(1), '; son isótopos'] },
    { nivel: 2, titulo: 'Las tres partículas',
      enunciado: '¿Cuántos protones, neutrones y electrones tiene el ion ³⁵Cl⁻?',
      datos: ['Z del cloro = 17', DF1.masa, DF1.carga, DF1.nota],
      figura: ATOMO({ atomos: [{ Z: 17, N: 18, e: 18, titulo: '³⁵Cl', carga: -1, oculto: ['N', 'e'], rotulo: 'A = 35' }] }),
      solucion: [
        { texto: 'Los protones son Z. Los neutrones son lo que queda del número de masa al quitarle Z.', ecuacion: [Pz(17), ' protones   ·   ', N, ' = 35 − 17 = ', Nn(18)] },
        { texto: 'La carga es −1, así que el átomo ganó un electrón.', ecuacion: [e, ' = 17 − ', Qc('(−1)'), ' = ', Ee(18)] },
      ],
      respuesta: [Pz(17), ' protones, ', Nn(18), ' neutrones y ', Ee(18), ' electrones'] },
    { nivel: 2, titulo: 'El ion del aluminio',
      enunciado: 'Un ion de aluminio tiene 13 protones y 10 electrones. ¿Cuál es su carga y cómo se escribe?',
      datos: [DF1.carga],
      figura: ATOMO({ atomos: [{ Z: 13, N: null, e: 10, titulo: 'Al ?' }] }),
      solucion: [
        { texto: 'La carga es la cuenta de los protones menos la de los electrones.', ecuacion: ['carga = ', Pz(13), ' − ', Ee(10), ' = ', Qc('+3')] },
        { texto: 'La carga va arriba a la derecha del símbolo, con su signo.', ecuacion: ['Al', Qc('³⁺')] },
      ],
      respuesta: ['Carga ', Qc('+3'), ': Al', Qc('³⁺')] },
    { nivel: 2, titulo: 'Dos átomos de cloro',
      enunciado: 'El cloro-35 y el cloro-37 son átomos neutros. ¿En qué se diferencian sus partículas?',
      datos: ['Z del cloro = 17', DF1.masa, DF1.neutro],
      figura: ATOMO({ atomos: [{ Z: 17, N: 18, titulo: 'cloro-35', oculto: ['N', 'e'], rotulo: 'A = 35' }, { Z: 17, N: 20, titulo: 'cloro-37', oculto: ['N', 'e'], rotulo: 'A = 37' }] }),
      solucion: [
        { texto: 'Los neutrones de cada uno salen de restarle Z a su número de masa.', ecuacion: [N, ' = 35 − 17 = ', Nn(18), '   ·   ', N, ' = 37 − 17 = ', Nn(20)] },
        { texto: 'Como son neutros, los dos tienen tantos electrones como protones: 17. Solo cambian los neutrones.', ecuacion: [e, ' = ', Ee(17), ' en los dos'] },
        { texto: 'Resto para ver cuántos neutrones más tiene el cloro-37.', ecuacion: [Nn(20), ' − ', Nn(18), ' = ', Nn(2)] },
      ],
      respuesta: ['El cloro-37 tiene ', Nn(2), ' neutrones más; los electrones son iguales'] },
    { nivel: 2, titulo: 'El agua pesada',
      enunciado: 'En el agua pesada, cada molécula tiene 2 átomos de deuterio (hidrógeno-2) y 1 de oxígeno-16. ¿Cuántos neutrones tiene una molécula?',
      datos: ['Z del hidrógeno = 1', 'Z del oxígeno = 8', DF1.masa],
      solucion: [
        { texto: 'Cada deuterio tiene 2 − 1 = 1 neutrón, y hay dos átomos de deuterio. El oxígeno-16 tiene 16 − 8 = 8.', ecuacion: [N, ' = 2 · ', Nn(1), ' + ', Nn(8)] },
        { texto: 'Se suman los neutrones de los tres átomos.', ecuacion: ['2 + 8 = ', Nn(10)] },
      ],
      respuesta: [Nn(10), ' neutrones'] },
    { nivel: 2, titulo: 'Los que se parecen al neón',
      enunciado: '¿Cuántas de estas especies son isoelectrónicas con el átomo de neón: Na⁺, Mg, F⁻, O²⁻ y Cl⁻?',
      datos: ['Z: oxígeno 8, flúor 9, neón 10, sodio 11, magnesio 12, cloro 17', DF1.carga, DF1.iso],
      solucion: [
        { texto: 'El neón es neutro, así que tiene 10 electrones. Cuento los de cada especie con su carga.', ecuacion: ['Na⁺: ', Ee(10), '   ·   Mg: ', Ee(12), '   ·   F⁻: ', Ee(10), '   ·   O²⁻: ', Ee(10), '   ·   Cl⁻: ', Ee(18)] },
        { texto: 'Tienen 10 electrones el Na⁺, el F⁻ y el O²⁻.' },
      ],
      respuesta: 'Tres: Na⁺, F⁻ y O²⁻' },
    { nivel: 3, titulo: 'X³⁻ y el calcio',
      enunciado: 'El ion X³⁻ es isoelectrónico con el Ca²⁺. ¿Cuál es el número atómico de X?',
      alternativas: ['15', '18', '21', '17', '23'],
      datos: ['Z del calcio = 20', DF1.carga, DF1.iso],
      solucion: [
        { texto: 'El Ca²⁺ perdió 2 de sus 20 electrones y le quedan 18. El ion X³⁻ tiene esos mismos 18.', ecuacion: [e, ' = 20 − (+2) = ', Ee(18)] },
        { texto: 'La carga de X es −3, así que Z − 18 = −3 y Z es 3 menos que 18.', ecuacion: [Z, ' = 18 + (−3) = ', Pz(15)] },
        { texto: ['La ', letra('B'), ' toma Z igual a los electrones, y la ', letra('C'), ' suma el 3 en vez de restarlo: 18 + 3.'] },
        { texto: ['La ', letra('D'), ' parte de los 20 electrones del calcio neutro: 20 − 3. La ', letra('E'), ' hace 20 + 3.'] },
      ],
      respuesta: [letra('A'), ', ', Z, ' = ', Pz(15)] },
    { nivel: 3, titulo: 'Número de masa de un ion',
      enunciado: 'Un ion X²⁺ tiene 24 electrones y 30 neutrones. ¿Cuál es su número de masa?',
      alternativas: ['54', '56', '52', '26', '58'],
      datos: [DF1.carga, DF1.masa],
      solucion: [
        { texto: 'La carga es +2 porque perdió dos electrones: tiene 2 protones más que electrones.', ecuacion: [Z, ' = 24 + 2 = ', Pz(26)] },
        { texto: 'El número de masa junta los protones y los neutrones del núcleo.', ecuacion: [A, ' = ', Pz(26), ' + ', Nn(30), ' = 56'] },
        { texto: ['La ', letra('A'), ' suma electrones y neutrones: 24 + 30. La ', letra('C'), ' resta la carga en vez de sumarla: 22 + 30.'] },
        { texto: ['La ', letra('D'), ' se queda en Z, sin los neutrones. La ', letra('E'), ' suma la carga dos veces: 26 + 30 + 2.'] },
      ],
      respuesta: [letra('B'), ', ', A, ' = 56'] },
    { nivel: 3, titulo: 'Isóbaros e isótonos',
      enunciado: 'Del ⁴⁰Ar, el ⁴⁰Ca y el ³⁹K, ¿qué par es de isóbaros y qué par es de isótonos?',
      alternativas: ['Isóbaros: Ar y K; isótonos: K y Ca', 'Isóbaros: Ar y Ca; isótonos: Ar y K', 'Isóbaros: Ar y Ca; isótonos: K y Ca', 'Isótopos: Ar y Ca; isótonos: K y Ca', 'Isóbaros: K y Ca; isótonos: Ar y Ca'],
      datos: ['Z del argón = 18; Z del potasio = 19; Z del calcio = 20', DF1.familias, DF1.masa],
      solucion: [
        { texto: 'Los isóbaros tienen el mismo A, y el ⁴⁰Ar y el ⁴⁰Ca tienen A = 40.' },
        { texto: 'Los isótonos tienen el mismo N, así que calculo los neutrones de cada uno.', ecuacion: ['Ar: ', N, ' = 40 − 18 = ', Nn(22), '   ·   Ca: ', N, ' = 40 − 20 = ', Nn(20), '   ·   K: ', N, ' = 39 − 19 = ', Nn(20)] },
        { texto: ['El K y el Ca tienen 20 neutrones: son los isótonos. La ', letra('D'), ' llama isótopos al Ar y al Ca, que tienen distinto Z.'] },
        { texto: ['La ', letra('A'), ' y la ', letra('B'), ' juntan al Ar con el K, que no comparten A ni N. La ', letra('E'), ' cruza los pares, y el K y el Ca tienen distinto A.'] },
      ],
      respuesta: [letra('C'), ', isóbaros: Ar y Ca; isótonos: K y Ca'] },
    // Nivel 3 que cruza isótopo e ion (auditoría B4): ³⁵Cl⁻ (17 p, 18 n, 18 e) y ³⁷Cl (17 p, 20 n, 17 e): solo Z es igual.
    { nivel: 3, titulo: 'Un isótopo y un ion',
      enunciado: '¿Qué tienen igual el ion ³⁵Cl⁻ y el átomo neutro ³⁷Cl?',
      alternativas: ['Protones y electrones', 'Neutrones', 'Solo los protones', 'Número de masa', 'Nada: son elementos distintos'],
      datos: ['Z del cloro = 17', DF1.masa, DF1.carga, DF1.nota],
      solucion: [
        { texto: 'Los dos son cloro, así que los dos tienen 17 protones.', ecuacion: [Z, ' = ', Pz(17), ' en los dos'] },
        { texto: 'Los neutrones son 35 − 17 y 37 − 17. En los electrones, el ³⁵Cl⁻ ganó uno y el ³⁷Cl es neutro.', ecuacion: [N, ' = ', Nn(18), ' y ', Nn(20), '   ·   ', e, ' = ', Ee(18), ' y ', Ee(17)] },
        { texto: ['La ', letra('A'), ' olvida la carga del ³⁵Cl⁻. La ', letra('B'), ' y la ', letra('D'), ' dan justo lo que cambia: N y A.'] },
        { texto: ['La ', letra('E'), ' olvida que, si Z es el mismo, el elemento es el mismo.'] },
      ],
      respuesta: [letra('C'), ', solo los protones'] },
    { nivel: 3, titulo: 'Todas las partículas',
      enunciado: 'Un átomo neutro tiene número de masa 52 y 28 neutrones. ¿Cuántas partículas tiene en total, entre protones, neutrones y electrones?',
      alternativas: ['76', '52', '80', '104', '48'],
      datos: [DF1.masa, DF1.neutro],
      solucion: [
        { texto: 'Los protones salen de A − N. Como el átomo es neutro, tiene tantos electrones como protones.', ecuacion: [Z, ' = 52 − 28 = ', Pz(24), '   ·   ', e, ' = ', Ee(24)] },
        { texto: 'Sumo las tres clases de partículas para tener el total.', ecuacion: [Pz(24), ' + ', Nn(28), ' + ', Ee(24), ' = 76'] },
        { texto: ['La ', letra('B'), ' cuenta solo el núcleo: 52. La ', letra('C'), ' suma A con N, y cuenta dos veces los neutrones: 52 + 28.'] },
        { texto: ['La ', letra('D'), ' suma A dos veces: 104. La ', letra('E'), ' cuenta protones y electrones, pero no los neutrones.'] },
      ],
      respuesta: [letra('A'), ', 76 partículas'] },
  ];

  const nucleo = {
    id: 'nucleo-identidad',
    titulo: 'Partículas, isótopos e iones',
    pregunta: '¿Qué cambia en un átomo si cambian sus protones, sus neutrones o sus electrones?',
    temas: ['Partículas subatómicas', 'Número atómico y de masa', 'Isótopos'],
    pieza: 'quim-objeto',
    aprendizaje: 'Los protones (Z) deciden el elemento y A = Z + N. Con otros neutrones es un isótopo; con otros electrones, un ion: carga = Z − e⁻.',
    actividad: 'Armar un átomo con protones y neutrones y buscar el carbono-14 del hueso.',
    // Lee: el hueso, las tres partículas y los tres números. No dice qué le pasa a un átomo que pierde un electrón.
    lee: {
      tarjetas: [
        { titulo: 'El hueso del museo', texto: 'En un museo hay un hueso de llama muy antiguo. Su carbono es de dos clases: casi todo es carbono-12, y hay un poco de carbono-14. Si las dos clases son carbono, ¿en qué se diferencian sus átomos?',
          pieza: 'quim-objeto', dibujo: HUESO({ atomos: [{ Z: 6, N: 6, titulo: 'carbono-12', oculto: ['Z', 'N', 'e'] }, { Z: 6, N: 8, titulo: 'carbono-14', oculto: ['Z', 'N', 'e'] }] }) },
        { titulo: 'Tres partículas', texto: 'En el centro del átomo está el núcleo, con protones de carga positiva y neutrones sin carga. Alrededor se mueven los electrones, de carga negativa, atraídos por el núcleo. Un protón tiene unas 1836 veces la masa de un electrón.',
          pieza: 'quim-atomo', dibujo: ATOMO({ atomos: [{ Z: 2, N: 2, titulo: 'un átomo de helio' }] }) },
        { titulo: 'Tres números', texto: 'El número atómico, Z, cuenta los protones; N cuenta los neutrones, y el número de masa, A, suma los dos. En ¹⁴₆C, A = 14 va arriba y Z = 6, abajo. Como N son los neutrones, al nitrógeno lo llamamos por su nombre o ¹⁴N.' },
        { titulo: 'Qué mirar', texto: 'En el juego armas un átomo con protones y neutrones, al lado de un carbono-12 del hueso. Mira con cuál de los dos números cambia el nombre del elemento.' },
      ],
    },
    ejemplos: EJEMPLOS_NUCLEO,
    juega: {
      pieza: 'quim-objeto',
      consigna: 'El hueso guarda carbono-12 y un poco de carbono-14: los dos son carbono. A la derecha armas tu átomo, que siempre queda neutro.',
      mision: {
        texto: 'Arma un átomo de carbono-14.',
        logrado: v => v.z === 6 && v.z + v.n === 14,
        bien: 'Son 6 protones y 8 neutrones. Con 6 neutrones también sería carbono, porque lo decide Z.',
      },
      voz: 'Mueve una cosa a la vez y lee el nombre.',
      leyenda: [
        { s: Z, t: 'número atómico: los protones del núcleo' },
        { s: N, t: 'los neutrones del núcleo' },
        { s: 'A', t: 'número de masa: protones más neutrones' },
        { s: Pz('p⁺'), t: 'protón: va en el núcleo, con carga +' },
        { s: Nn('n⁰'), t: 'neutrón: va en el núcleo, sin carga' },
        { s: Ee('e⁻'), t: 'electrón: va afuera, con carga −' },
      ],
      controles: [
        { id: 'z', etiqueta: 'Protones (Z)', color: 'c-o', min: 1, max: 12, paso: 1, inicio: 5, decimales: 0 },
        { id: 'n', etiqueta: 'Neutrones (N)', color: 'c-i', min: 0, max: 14, paso: 1, inicio: 6, decimales: 0 },
      ],
      dibujo: v => juegoHueso(v),
      // La relación: Z nombra el elemento; A = Z + N.
      lectura: v => {
        const a = v.z + v.n, nom = NOMBRE[v.z];
        if (v.z === 6) return [Z, ' = 6: carbono. ', A, ` = 6 + ${v.n} = ${a}: carbono-${a}.`];
        if (a === 14) return [Z, ` = ${v.z}: ${nom}. `, A, ' = 14, como el carbono-14: otro elemento.'];
        return [Z, ` = ${v.z}: ${nom}. `, A, ` = ${v.z} + ${v.n} = ${a}.`];
      },
      minimo: 3,
    },
    predice: {
      pieza: 'quim-atomo',
      pregunta: 'Un átomo de sodio tiene 11 protones, 12 neutrones y 11 electrones. Si pierde un electrón, ¿qué es ahora?',
      datos: ['Z del neón = 10', 'Z del magnesio = 12'],
      voz: 'Piensa qué cambió y qué se quedó igual.',
      opciones: [
        { id: 'c', texto: 'Un ion Na⁺: sigue siendo sodio', correcta: true },
        { id: 'neon', texto: 'Neón, porque ahora tiene 10 electrones', error: 'QM-ION-ELEMENTO-E', siFuera: 'Es cierto que el neón tiene 10 electrones. Pero el elemento lo deciden los protones, y aquí siguen siendo 11.' },
        { id: 'magnesio', texto: 'Magnesio, porque queda con carga +1', error: 'QM-ION-ELEMENTO-Q', siFuera: 'Bien visto que la carga cambió a +1. Pero el magnesio tiene 12 protones, y este núcleo sigue con 11.' },
        { id: 'isotopo', texto: 'Un isótopo del sodio', error: 'QM-ION-ISOTOPO', siFuera: 'Es cierto que sigue siendo sodio. Pero un isótopo tiene otro número de neutrones, y aquí lo que cambió fue un electrón.' },
      ],
      dibujo: ATOMO({ atomos: [{ Z: 11, N: 12, titulo: 'Antes: sodio' }, { Z: 11, N: 12, e: 10, oculto: ['Z', 'N'], titulo: 'Después: ?', sale: { n: 1 } }] }),
      revelar: ATOMO({ atomos: [{ Z: 11, N: 12, titulo: 'Antes: sodio' }, { Z: 11, N: 12, e: 10, titulo: 'Na', carga: 1, sale: { n: 1 }, rotulo: 'carga: 11 − 10 = +1', rotuloColor: 'h' }] }),
      coincide: 'Coincide: el núcleo no cambió, solo salió un electrón. Es el ion Na⁺.',
      noCoincide: 'Mira el núcleo: siguen 11 protones. Es sodio con carga +1, el Na⁺.',
    },
    // Mira cierra el hueso de Materia y energía: del carbono-14 al nitrógeno-14 cambia un neutrón por un protón (sin
    // nombrar la radiactividad beta: decisiones del 18 nov, pregunta 13).
    mira: {
      pieza: 'quim-objeto',
      datos: { objeto: 'hueso', lugares: 2, flecha: { desde: 3 }, atomos: [
        { Z: 6, N: 6, titulo: 'carbono-12', rotulo: 'A = 12', lugar: 0, desde: 1, hasta: 2 },
        { Z: 6, N: 8, titulo: 'carbono-14', rotulo: 'A = 14', lugar: 1, desde: 1, hasta: 2 },
        { Z: 6, N: 8, titulo: 'carbono-14', rotulo: 'A = 14', lugar: 0, desde: 3 },
        { Z: 7, N: 7, titulo: 'nitrógeno-14', rotulo: 'A = 14', lugar: 1, desde: 3 },
      ] },
      voz: 'Miremos los átomos del hueso hoy y miles de años después.',
      pasos: [
        { estado: { corte: 1 }, texto: 'En el hueso hay carbono-12 y un poco de carbono-14.', ecuacion: [Z, ' = ', Pz(6), ' en los dos: los dos son carbono'] },
        { estado: { corte: 2 }, texto: 'Tienen el mismo Z y distinto N, así que son isótopos; neutros, los dos tienen 6 electrones.', ecuacion: [A, ' = ', Pz(6), ' + ', Nn(6), ' = 12   ·   ', A, ' = ', Pz(6), ' + ', Nn(8), ' = 14'] },
        { estado: { corte: 3 }, texto: 'Con los años, en el núcleo de un carbono-14, un neutrón se convierte en protón.', ecuacion: [Nn(8), ' − 1 = ', Nn(7), '   ·   ', Pz(6), ' + 1 = ', Pz(7)] },
        { estado: { corte: 3 }, texto: 'Ahora el núcleo tiene 7 protones, y Z = 7 es el nitrógeno: el átomo pasó a ser ¹⁴N.', ecuacion: [Z, ' = ', Pz(7), ': nitrógeno'] },
        { estado: { corte: 3 }, texto: 'A sigue siendo 14, así que el ¹⁴C y el ¹⁴N son isóbaros; como cambió Z, ya es otro elemento.', ecuacion: [A, ' = ', Pz(7), ' + ', Nn(7), ' = 14'] },
      ],
    },
    regla: {
      // Ronda 2 del lector en frío: cada familia con su ejemplo (los del glosario y de «Mira»).
      texto: 'Z decide el elemento, y A suma protones y neutrones. Los isótopos tienen el mismo Z y reaccionan igual (¹²C y ¹⁴C); los isóbaros, el mismo A (¹⁴C y ¹⁴N); los isótonos, el mismo N (¹³C y ¹⁴N), y los isoelectrónicos, los mismos electrones.',
      ecuacion: [A, ' = ', { llave: [Z], nota: 'protones', color: 'c-o' }, ' + ', { llave: [N], nota: 'neutrones', color: 'c-i' }, '   ·   ',
        { llave: ['carga'], nota: 'con signo', color: 'c-h' }, ' = ', Z, ' − ', { llave: [e], nota: 'electrones', color: 'c-f' }],
      condicion: 'el cambio es una reacción química, en la que el átomo solo gana o pierde electrones; el núcleo cambia únicamente en procesos nucleares, como el del ¹⁴C que pasa a ¹⁴N.',
      voz: 'Primero el núcleo; después, los electrones.',
      // Dibujo propio (correcciones del 18 nov, lector en frío): el Na⁺ de la predicción, ya revelada. Antes la regla
      // mostraba el carbono-14 que pasa a nitrógeno-14 junto a «el núcleo no cambia».
      dibujo: ATOMO({ atomos: [{ Z: 11, N: 12, titulo: 'sodio' }, { Z: 11, N: 12, e: 10, titulo: 'Na', carga: 1, sale: { n: 1 }, rotulo: 'carga: 11 − 10 = +1', rotuloColor: 'h' }] }),
    },
    resuelve: {
      pieza: 'quim-atomo',
      generar(s) {
        const [z, a, q] = azar(s + 900).de(IONES_R), n = a - z, el = z - q, x = nuclido(z, a, q);
        const fig = ocultos => ATOMO({ atomos: [{ Z: z, N: n, e: el, titulo: `${sup(a)}${SIMB[z]}`, carga: q, oculto: ocultos, rotulo: `A = ${a}` }] });
        return {
          enunciado: ['¿Cuántos protones, neutrones y electrones tiene el ion ', x, '?'],
          datos: [`Z del ${NOMBRE[z]} = ${z}`, DF1.masa, DF1.carga, DF1.nota],
          dibujo: fig(['N', 'e']),
          pasos: [
            { tipo: 'pide', texto: 'Piden las tres partículas: protones y neutrones del núcleo, y electrones de afuera.' },
            { tipo: 'datos', texto: ['El símbolo da ', A, ` = ${a} y la carga ${signo(q)}; los datos dan `, Z, ` = ${z}.`] },
            { tipo: 'regla', texto: 'Los protones son Z. Los neutrones son lo que queda del número de masa al quitarle Z, y los electrones salen de la carga.', ecuacion: [N, ' = ', A, ' − ', Z, '   ·   ', e, ' = ', Z, ' − carga'] },
            { tipo: 'cuentas', texto: `La carga es ${signo(q)}, así que el átomo ${q > 0 ? 'perdió' : 'ganó'} ${Math.abs(q)} ${Math.abs(q) === 1 ? 'electrón' : 'electrones'} al formar el ion.`,
              ecuacion: [N, ` = ${a} − ${z} = `, Nn(n), '   ·   ', e, ` = ${z} − (${signo(q)}) = `, Ee(el)], dibujo: fig([]) },
            { tipo: 'sentido', texto: `Para comprobar: ${z} + ${n} = ${a} es el A del símbolo, y ${z} − ${el} = ${signo(z - el)} es su carga.` },
          ],
          respuesta: `${z} protones, ${n} neutrones y ${el} electrones`,
        };
      },
    },
    ahoraTu: {
      pieza: 'quim-atomo',
      voz: 'Separa lo que está en el núcleo de lo que está afuera.',
      generar(sem) {
        const r = azar(sem + 31), tipo = sem % 6;
        return [casoNeutrones, casoElectrones, casoIsotopos, casoNuclidos, casoIsoelectronico, casoMasaIon][tipo](r);
      },
    },
  };

  // ---------- Idea 2 (fase 3, 18 nov): modelos atómicos ----------
  // Propuesta aprobada: docs/etapa4/propuesta-quimica.md (§3 a §6, idea 2). Objeto de la primera pantalla: un retablo con
  // pan de oro y la hojita de oro de Rutherford (pieza quim-lamina, dibujo de prueba). Bohr solo como idea: niveles
  // permitidos y luz de un color fijo al bajar (sus números van a fisica.fisica-moderna; decisiones del 18 nov).
  // Cambia: el modelo (Thomson o Dalton) y dónde apunta la alfa · Permanece: el átomo grande al centro y la fuente de alfas
  // · Progresa: de «casi no se desvía» (Thomson) a «choca y rebota» (Dalton) · Se reserva: el núcleo (es lo que se
  // predice) · Debe verse: ninguno de los dos modelos da «casi todas pasan y unas pocas rebotan».
  // Errores (hipótesis salvo AT5 y AT6, docs/investigacion/atomo-enlace-ideas-erroneas.md): AT5 (le da a Rutherford lo de
  // Bohr), AT6 (orbital = órbita), AT2 (escala del átomo), QM-MODELO-DALTON, QM-MODELO-THOMSON, QM-BOHR-SUBE,
  // QM-BOHR-CONTINUO, QM-BOHR-ENTRE, QM-ESCALA-UNIDAD, QM-ESCALA-POCO y QM-VF-* (una afirmación juzgada al revés).
  const LAM = (o, estado) => ({ pieza: 'quim-lamina', datos: o, estado: estado || {} });
  // Desvío de una alfa en grados (lo dibuja quim-lamina; regla 1). No es a escala ni una medida: la lectura dice «casi
  // nada», «choca», «rebota». Thomson: la carga repartida casi no la desvía (menos de 1°). Dalton: rebota en una esfera
  // maciza como una bolita en una pared curva, 180° − 2·asin|b|. Nuclear: tan(θ/2) = k/|b| con k = 0,02 radios del átomo.
  function desvio(modelo, b) {
    const a = Math.abs(b);
    if (modelo === 'dalton') return a < 1 - 1e-9 ? 180 - 2 * Math.asin(a) * 180 / Math.PI : 0;
    if (modelo === 'nuclear') return a < 1e-9 ? 180 : 2 * Math.atan(0.02 / a) * 180 / Math.PI;
    return a < 1 ? 0.6 * a * Math.sqrt(1 - a * a) : 0;
  }
  const alfasNucleo = [0, 0.1, 0.45, -0.3, -0.75].map(b => ({ b, desvio: desvio('nuclear', b) }));
  const ANIOS = 'Dalton 1808; Thomson 1904; Rutherford 1911; Bohr 1913; modelo actual 1926';
  const NOM_MOD = { thomson: 'Átomo de Thomson', dalton: 'Átomo de Dalton' };
  const juegoLamina = v => LAM({ vista: 'zoom', banda: 'retablo', modelo: v.k, titulo: NOM_MOD[v.k], alfas: [{ b: v.b, desvio: desvio(v.k, v.b) }] });

  // Afirmaciones para el verdadero o falso (nivel examen: San Marcos 2023-II con Dalton, 2027-I con la lámina de oro).
  // [texto (≤ 11 palabras), es verdad, por qué (≤ 12)]
  const AFIRMA = [
    ['Dalton: los átomos de un elemento son iguales entre sí.', true, 'es uno de sus postulados'],
    ['Dalton puso electrones dentro del átomo.', false, 'el electrón se descubrió en 1897, después de Dalton'],
    ['Thomson: electrones dentro de una esfera de carga positiva.', true, 'es su modelo de 1904'],
    ['Thomson descubrió el núcleo del átomo.', false, 'el núcleo es de Rutherford, en 1911'],
    ['Casi todas las alfas atravesaron la lámina de oro.', true, 'el átomo es casi vacío'],
    ['Las partículas alfa tienen carga negativa.', false, 'tienen carga positiva'],
    ['Rutherford: casi toda la masa está en un núcleo diminuto.', true, 'por eso unas pocas alfas rebotaron'],
    ['Rutherford propuso los niveles de energía del electrón.', false, 'los niveles son de Bohr, en 1913'],
    ['Bohr: el electrón solo ocupa ciertos niveles de energía.', true, 'es su idea central'],
    ['Según Bohr, al bajar de nivel el electrón absorbe luz.', false, 'al bajar de nivel, el electrón suelta luz de un color fijo'],
    ['En el modelo actual, el electrón sigue una órbita fija.', false, 'hoy se habla de orbitales, regiones de probabilidad'],
    ['Un orbital es una región donde es probable hallar al electrón.', true, 'es la idea del modelo actual'],
  ];
  const ROMANO = ['I', 'II', 'III'];
  const vf = l => l.map(x => (x ? 'V' : 'F')).join('');
  function casoVF(r) {
    // Tres afirmaciones de modelos distintos (una de cada pareja), en orden de la historia.
    const parejas = [0, 1, 2, 3, 4, 5].map(k => AFIRMA.slice(2 * k, 2 * k + 2));
    const idx = [0, 1, 2, 3, 4, 5];
    for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
    const tres = idx.slice(0, 3).sort((a, b) => a - b).map(k => r.de(parejas[k]));
    const bien = tres.map(x => x[1]);
    const ops = [{ id: 'c', texto: vf(bien), correcta: true }];
    tres.forEach((x, i) => {
      const otra = bien.slice(); otra[i] = !otra[i];
      ops.push({ id: `vf${i}`, texto: vf(otra), error: x[1] ? 'QM-VF-NIEGA' : 'QM-VF-ACEPTA',
        siFuera: `Las otras dos están bien juzgadas. Pero la ${ROMANO[i]} es ${x[1] ? 'verdadera' : 'falsa'}: ${x[2]}.` });
    });
    return {
      pregunta: ['Indica verdadero (V) o falso (F). ', ...tres.flatMap((x, i) => [`${ROMANO[i]}. ${x[0]} `])],
      datos: [ANIOS, 'Partícula alfa: partícula con carga, lanzada contra la lámina de oro'],
      opciones: ops,
      solucion: { texto: `En orden queda ${vf(bien)}. ${(() => { const k = Math.max(0, tres.findIndex(x => !x[1])); return `La ${ROMANO[k]} es ${tres[k][1] ? 'verdadera' : 'falsa'}: ${tres[k][2]}`; })()}.` },
      razones: tres.map((x, i) => `La ${ROMANO[i]} es ${x[1] ? 'verdadera' : 'falsa'}: ${x[2]}.`).join(' '),
    };
  }
  // Evidencia → modelo (nivel base).
  const EVIDENCIAS = [
    ['Las sustancias se combinan siempre en proporciones fijas de masa.', 'dalton'],
    ['Los rayos catódicos llevan partículas negativas, sea cual sea el metal.', 'thomson'],
    ['Unas pocas alfas rebotan al chocar con una lámina de oro.', 'rutherford'],
    ['El hidrógeno caliente solo suelta luz de unos pocos colores fijos.', 'bohr'],
    ['Del electrón solo se puede saber dónde es probable hallarlo.', 'actual'],
  ];
  const MOD_TXT = { dalton: 'Dalton', thomson: 'Thomson', rutherford: 'Rutherford', bohr: 'Bohr', actual: 'El modelo actual' };
  const MOD_QUE = { dalton: 'átomos macizos, con masa propia', thomson: 'electrones dentro de una esfera positiva', rutherford: 'un núcleo diminuto y positivo',
    bohr: 'niveles de energía permitidos', actual: 'orbitales, que son regiones de probabilidad' };
  function casoEvidencia(r, k) {
    const [ev, mod] = EVIDENCIAS[k % EVIDENCIAS.length];
    return {
      pregunta: `«${ev}» ¿Qué modelo se propuso para explicar esta evidencia?`,
      // Las proporciones fijas (Dalton) y los rayos catódicos (Thomson) se enseñan en «Mira» (correcciones A4).
      datos: [ANIOS, 'Electrón: descubierto en 1897'],
      opciones: Object.keys(MOD_TXT).filter(x => x !== mod).slice(0, 3).concat([mod]).map(x => (x === mod ? { id: 'c', texto: MOD_TXT[x], correcta: true }
        : { id: x, texto: MOD_TXT[x], error: x === 'bohr' && mod === 'rutherford' ? 'AT5' : x === 'thomson' && mod === 'rutherford' ? 'QM-MODELO-THOMSON' : 'QM-MODELO',
          siFuera: `${MOD_TXT[x]} propuso ${MOD_QUE[x]}. Esa idea respondía a otra evidencia, no a esta.` })),
      solucion: { texto: `Para explicar esta evidencia, ${MOD_TXT[mod].replace('El modelo', 'el modelo')} propuso ${MOD_QUE[mod]}.` },
    };
  }
  // Escala (AT2, el error mejor medido de la unidad): si el núcleo midiera tanto, ¿cuánto mediría el átomo?
  const ESCALAS = [[1, 'mm', 100, 'm'], [2, 'mm', 200, 'm'], [5, 'mm', 500, 'm'], [1, 'cm', 1, 'km'], [3, 'mm', 300, 'm'], [4, 'cm', 4, 'km']];
  function casoEscala(r) {
    const [x, u, y, v] = r.de(ESCALAS), mm = u === 'mm';
    return {
      pregunta: `El átomo es mucho más ancho que su núcleo. Si un núcleo midiera ${x} ${u}, ¿cuánto mediría su átomo?`,
      datos: ['El átomo es unas 100 000 veces más ancho que su núcleo', '1 m = 100 cm = 1000 mm', '1 km = 1000 m'],
      opciones: [
        { id: 'c', texto: `Unos ${y} ${v}`, correcta: true },
        { id: 'poco', texto: mm ? `Unos ${x} m` : `Unos ${x * 10} m`, error: 'QM-ESCALA-POCO', siFuera: 'Multiplicar es el camino. Pero el átomo es unas 100 000 veces más ancho que su núcleo, no 1000 veces.' },
        { id: 'unidad', texto: mm ? `Unos ${y} km` : `Unos ${x * 100} km`, error: 'QM-ESCALA-UNIDAD', siFuera: `Multiplicar por 100 000 está bien. Pero ${f(x * 100000, 0)} ${u} son ${y} ${v}, no ${mm ? y : x * 100} km.` },
        { id: 'igual', texto: `Unos ${2 * x} ${u}`, error: 'AT2', siFuera: 'Es cierto que el átomo es mayor, pero no por poco: es unas 100 000 veces más ancho que su núcleo.' },
      ],
      solucion: { texto: `El átomo mide unas 100 000 veces lo que su núcleo: ${x} ${u} × 100 000 = ${mm ? `${f(x * 100000, 0)} mm = ${y} m` : `${f(x * 100000, 0)} cm = ${y} km`}.` },
    };
  }
  // Bohr solo como idea: subir de nivel cuesta energía; bajar la suelta como luz de un color fijo.
  function casoBohr(r) {
    const [a, b] = r.de([[3, 2], [2, 1], [4, 2], [1, 3], [2, 4], [4, 1], [1, 2], [5, 2]]), baja = a > b;
    const ops = baja ? [
      { id: 'c', texto: 'Suelta energía: luz de un color fijo', correcta: true },
      { id: 'sube', texto: 'Absorbe energía', error: 'QM-BOHR-SUBE', siFuera: 'Es cierto que la energía cambia. Pero al bajar de nivel el electrón la suelta, y solo la absorbe al subir.' },
      { id: 'continuo', texto: 'Suelta luz de cualquier color', error: 'QM-BOHR-CONTINUO', siFuera: 'Es cierto que suelta luz. Pero el salto entre dos niveles fijos da siempre luz del mismo color.' },
      { id: 'entre', texto: 'Se queda entre los dos niveles', error: 'QM-BOHR-ENTRE', siFuera: 'Para Bohr no hay lugares intermedios: el electrón está en un nivel o en otro.' },
    ] : [
      { id: 'c', texto: 'Absorbe energía', correcta: true },
      { id: 'sube', texto: 'Suelta luz de un color fijo', error: 'QM-BOHR-SUBE', siFuera: 'Es cierto que la energía cambia. Pero soltar luz pasa al bajar; para subir, el electrón tiene que absorber energía.' },
      { id: 'continuo', texto: 'Sube sin ganar ni perder energía', error: 'QM-BOHR-CONTINUO', siFuera: 'Para Bohr, cada nivel tiene su propia energía, así que cambiar de nivel siempre cambia la energía del electrón.' },
      { id: 'entre', texto: 'Se queda entre los dos niveles', error: 'QM-BOHR-ENTRE', siFuera: 'Para Bohr no hay lugares intermedios: el electrón está en un nivel o en otro.' },
    ];
    return {
      pregunta: `Según Bohr, un electrón del hidrógeno pasa del nivel ${a} al nivel ${b}. ¿Qué pasa con la energía?`,
      datos: ['Para Bohr, un nivel más alto tiene más energía', 'La luz lleva energía'],
      opciones: ops,
      solucion: { texto: baja ? `Al pasar del nivel ${a} al ${b}, el electrón baja y suelta la diferencia de energía como luz de un color fijo.` : `Al pasar del nivel ${a} al ${b}, el electrón sube, así que necesita absorber energía.` },
    };
  }
  // Relacionar científico y aporte (San Marcos 2026-II, propio).
  const APORTE = { Dalton: 'átomos macizos', Thomson: 'el electrón dentro del átomo', Rutherford: 'el núcleo positivo', Bohr: 'niveles de energía' };
  function casoRelaciona(r) {
    const quien = r.de([['Thomson', 'Rutherford', 'Bohr'], ['Dalton', 'Thomson', 'Rutherford'], ['Dalton', 'Rutherford', 'Bohr']]);
    const letras = ['a', 'b', 'c'], perm = [0, 1, 2];
    for (let i = 2; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [perm[i], perm[j]] = [perm[j], perm[i]]; }
    // perm[i]: la letra del aporte del científico i.
    const aportes = []; quien.forEach((q, i) => { aportes[perm[i]] = APORTE[q]; });
    const txt = p => quien.map((_, i) => `${ROMANO[i]}${letras[p[i]]}`).join(', ');
    const cambia = (i, j) => { const p = perm.slice(); [p[i], p[j]] = [p[j], p[i]]; return p; };
    const nom = i => quien[i];
    return {
      pregunta: [`Relaciona cada científico con su aporte. I. ${quien[0]}  II. ${quien[1]}  III. ${quien[2]}. `, `a) ${aportes[0]}  b) ${aportes[1]}  c) ${aportes[2]}`],
      datos: [ANIOS],
      opciones: [{ id: 'c', texto: txt(perm), correcta: true },
        ...[[0, 1], [1, 2], [0, 2]].map(([i, j]) => ({ id: `x${i}${j}`, texto: txt(cambia(i, j)),
          error: (nom(i) === 'Thomson' && nom(j) === 'Rutherford') ? 'QM-MODELO-THOMSON' : (nom(i) === 'Rutherford' && nom(j) === 'Bohr') ? 'AT5' : 'QM-MODELO',
          siFuera: `El ${ROMANO[3 - i - j]} está bien. Pero intercambiaste a ${nom(i)} y ${nom(j)}: ${nom(i)} propuso ${APORTE[nom(i)]}.` }))],
      solucion: { texto: `${quien[0]} propuso ${APORTE[quien[0]]}; ${quien[1]}, ${APORTE[quien[1]]}, y ${quien[2]}, ${APORTE[quien[2]]}.` },
    };
  }

  // Ejemplos resueltos (docs/teoria.md 4h; molde §3 con las reglas del 18 nov). La figura muestra el planteamiento (la
  // alfa que llega, con «?»), nunca lo que le pasa. Cuentas rehechas aparte (scratchpad, f3/cuentas.py): 1 cm · 100 000 =
  // 1 km · 100 m / 100 000 = 1 mm · orden 1808 < 1904 < 1911 < 1913 · V/F: Dalton VFV, lámina VFF · relaciona Ic, IIa, IIIb.
  const EJEMPLOS_MODELOS = [
    { nivel: 1, titulo: 'Una alfa contra Thomson',
      enunciado: 'Si el átomo fuera como lo pensó Thomson, ¿una alfa lanzada al centro rebotaría hacia atrás?',
      datos: ['Thomson: la carga positiva repartida en todo el átomo, con los electrones adentro', 'Las alfas tienen carga positiva y mucha masa'],
      figura: LAM({ vista: 'zoom', modelo: 'thomson', titulo: 'Átomo de Thomson', alfas: [{ b: 0, llega: true }] }),
      solucion: [{ texto: 'Con la carga repartida, ninguna parte del átomo empuja fuerte a la alfa: la atraviesa casi sin desviarse.' }],
      respuesta: 'No: pasa casi derecho' },
    { nivel: 1, titulo: '¿Quién propuso el núcleo?',
      enunciado: '«Unas pocas alfas rebotan contra una lámina de oro.» ¿Qué científico explicó esto con un núcleo?',
      datos: [ANIOS],
      figura: LAM({ vista: 'lamina', resultado: true, titulo: 'Lámina de oro' }),
      solucion: [{ texto: 'El rebote pide una carga positiva concentrada en un punto diminuto. Lo propuso Rutherford, en 1911.' }],
      respuesta: 'Rutherford, en 1911' },
    // Ronda 2 del lector en frío: antes preguntaba dónde estaba la carga positiva, que no salía de los datos (pedía
    // memoria). Ahora el modelo está en el enunciado y se razona con la neutralidad.
    { nivel: 1, titulo: 'La carga positiva de Thomson',
      enunciado: 'Thomson halló que todo átomo tiene electrones, con carga negativa. ¿Por qué su modelo tenía que llevar, además, carga positiva?',
      datos: ['Thomson halló el electrón en 1897; su modelo es de 1904', 'Un átomo es neutro: sus cargas se compensan'],
      figura: LAM({ vista: 'zoom', modelo: 'thomson', titulo: 'Átomo de Thomson', fuente: false }),
      solucion: [{ texto: 'Si el átomo solo tuviera electrones, sería negativo. Para ser neutro necesita una carga positiva igual: Thomson la repartió en una esfera.' }],
      respuesta: 'Para compensar la carga de los electrones: el átomo es neutro' },
    { nivel: 1, titulo: 'Un salto hacia abajo',
      enunciado: 'Según Bohr, un electrón del hidrógeno baja del nivel 2 al nivel 1. ¿Suelta energía o la absorbe?',
      datos: ['Para Bohr, un nivel más alto tiene más energía', 'La luz lleva energía'],
      solucion: [{ texto: 'Baja a un nivel de menos energía: le sobra la diferencia y la suelta como luz de un color fijo.' }],
      respuesta: 'Suelta energía, como luz de un color fijo' },
    { nivel: 1, titulo: 'Órbita u orbital',
      enunciado: 'En el modelo actual, ¿el electrón sigue un camino fijo alrededor del núcleo?',
      datos: ['Órbita: un camino, como el de un planeta', 'Orbital: una región alrededor del núcleo'],
      solucion: [{ texto: 'Del electrón solo se sabe dónde es probable hallarlo, y un orbital es esa región, no un camino que recorre.' }],
      respuesta: 'No: está en un orbital, una región probable' },
    { nivel: 2, titulo: 'Un núcleo de un centímetro',
      enunciado: 'Si el núcleo de un átomo midiera 1 cm, ¿cuánto mediría el átomo?',
      datos: ['El átomo es unas 100 000 veces más ancho que su núcleo', '1 m = 100 cm', '1 km = 1000 m'],
      solucion: [
        { texto: 'Multiplico el ancho del núcleo por las veces que cabe en el átomo.', ecuacion: ['1 cm × 100 000 = 100 000 cm'] },
        { texto: 'Paso esos centímetros a metros y después a kilómetros.', ecuacion: ['100 000 cm = 1000 m = 1 km'] },
      ],
      respuesta: 'Un kilómetro (1 km)' },
    { nivel: 2, titulo: 'Pasan casi todas',
      enunciado: 'En la lámina de oro, casi todas las alfas pasan derecho y unas pocas rebotan. ¿Qué dice cada hecho del átomo?',
      datos: ['Las alfas tienen carga positiva', 'Cargas del mismo signo se repelen'],
      figura: LAM({ vista: 'lamina', resultado: true, titulo: 'Lámina de oro' }),
      solucion: [
        { texto: 'Si casi todas pasan sin tocar nada, el átomo es casi todo vacío.' },
        { texto: 'Si unas pocas rebotan, hay algo positivo, pesado y diminuto: solo lo golpean las que pasan muy cerca.' },
      ],
      respuesta: 'Casi vacío, con un núcleo diminuto y positivo' },
    { nivel: 2, titulo: 'Si el oro fuera de Dalton',
      enunciado: 'Si los átomos de oro fueran esferas macizas pegadas, como pensaba Dalton, ¿qué pasaría con las alfas?',
      datos: ['Dalton: átomos macizos que no se pueden partir', 'La lámina tiene miles de átomos de grosor', 'En el experimento, casi todas las alfas atravesaron la lámina'],
      figura: LAM({ vista: 'zoom', modelo: 'dalton', titulo: 'Uno de sus átomos, según Dalton', alfas: [{ b: 0.3, llega: true }] }),
      solucion: [
        { texto: 'Una alfa chocaría con la primera esfera y rebotaría: no encuentra huecos para cruzar.' },
        { texto: 'Así casi ninguna pasaría, pero en el experimento pasaron casi todas: el modelo de Dalton no explica lo que se vio.' },
      ],
      respuesta: 'Casi ninguna pasaría: no coincide con lo que se vio' },
    { nivel: 2, titulo: 'Dos saltos de Bohr',
      enunciado: 'Según Bohr, un electrón baja del nivel 4 al 2 y después del 2 al 1. ¿Cuántas veces suelta luz?',
      datos: ['Para Bohr, un nivel más alto tiene más energía', 'Cada salto hacia abajo suelta luz de un color fijo'],
      solucion: [
        { texto: 'Del 4 al 2 baja: suelta luz de un color. Del 2 al 1 vuelve a bajar: suelta luz de otro color.' },
        { texto: 'Son dos saltos distintos, con energías distintas: dos colores fijos.' },
      ],
      respuesta: 'Dos veces, cada una de un color fijo' },
    { nivel: 2, titulo: 'Los modelos en orden',
      enunciado: 'Ordena del más antiguo al más nuevo los modelos de Bohr, Dalton, Rutherford y Thomson.',
      datos: [ANIOS],
      solucion: [
        { texto: 'Comparo los años: 1808 (Dalton), 1904 (Thomson), 1911 (Rutherford) y 1913 (Bohr).' },
        { texto: 'Cada uno corrigió al anterior con una evidencia nueva.' },
      ],
      respuesta: 'Dalton, Thomson, Rutherford y Bohr' },
    { nivel: 3, titulo: 'Verdadero o falso: Dalton',
      enunciado: 'Sobre el modelo de Dalton: I. Los átomos de un elemento son iguales. II. Tenía electrones adentro. III. Hoy se sabe que el átomo sí se divide.',
      alternativas: ['VVV', 'VFV', 'FFV', 'VFF', 'FVF'],
      datos: [ANIOS, 'Hoy se conocen protones, neutrones y electrones dentro del átomo'],
      solucion: [
        { texto: 'I es V: es un postulado de Dalton. II es F: el electrón se descubrió en 1897, después de Dalton.' },
        { texto: 'III es V: el átomo tiene partes, así que no es indivisible.' },
        { texto: ['La ', letra('A'), ' le da electrones a Dalton, y la ', letra('D'), ' cree que el átomo sigue siendo indivisible. La ', letra('C'), ' y la ', letra('E'), ' marcan falsa la I, que es un postulado de Dalton.'] },
      ],
      respuesta: [letra('B'), ', VFV'] },
    { nivel: 3, titulo: 'Verdadero o falso: la lámina',
      enunciado: 'Sobre la lámina de oro: I. La mayoría de alfas atravesó la hoja. II. Las alfas tienen carga negativa. III. Rutherford propuso orbitales.',
      alternativas: ['VVF', 'FFV', 'VFV', 'VVV', 'VFF'],
      datos: [ANIOS, 'Las alfas fueron rechazadas por el núcleo positivo', 'Orbital: idea del modelo actual'],
      solucion: [
        { texto: 'I es V: el átomo es casi vacío. II es F: si el núcleo positivo las rechaza, son positivas.' },
        { texto: 'III es F: los orbitales son del modelo actual, de 1926; Rutherford propuso el núcleo.' },
        { texto: ['La ', letra('A'), ' y la ', letra('D'), ' dan carga negativa a las alfas, y la ', letra('C'), ' le da orbitales a Rutherford. La ', letra('B'), ' niega que la mayoría atravesara la hoja.'] },
      ],
      respuesta: [letra('E'), ', VFF'] },
    { nivel: 3, titulo: 'Cada científico con su aporte',
      enunciado: 'Relaciona. I. Thomson  II. Rutherford  III. Bohr  con  a) núcleo positivo  b) niveles de energía  c) el electrón dentro del átomo.',
      alternativas: ['Ia, IIc, IIIb', 'Ic, IIb, IIIa', 'Ic, IIa, IIIb', 'Ib, IIa, IIIc', 'Ia, IIb, IIIc'],
      datos: [ANIOS],
      solucion: [
        { texto: 'Thomson halló el electrón (c); Rutherford, con la lámina de oro, halló el núcleo (a), y Bohr propuso los niveles (b).' },
        { texto: ['La ', letra('A'), ' cambia a Thomson con Rutherford, y la ', letra('B'), ' le da los niveles a Rutherford. La ', letra('D'), ' y la ', letra('E'), ' le dan a Thomson los niveles o el núcleo.'] },
      ],
      respuesta: [letra('C'), ', Ic, IIa, IIIb'] },
    { nivel: 3, titulo: 'El núcleo de una cancha',
      enunciado: 'Si un átomo fuera tan ancho como una cancha de 100 m, ¿cuánto mediría su núcleo?',
      alternativas: ['1 cm', '10 cm', '1 m', '1 mm', '0,1 mm'],
      datos: ['El átomo es unas 100 000 veces más ancho que su núcleo', '1 m = 1000 mm'],
      solucion: [
        { texto: 'Como el núcleo es 100 000 veces más angosto que el átomo, divido el ancho de la cancha.', ecuacion: ['100 m ÷ 100 000 = 0,001 m'] },
        { texto: 'Paso ese resultado de metros a milímetros.', ecuacion: ['0,001 m × 1000 = 1 mm'] },
        { texto: ['La ', letra('C'), ' divide entre 100; la ', letra('B'), ', entre 1000; la ', letra('A'), ', entre 10 000; la ', letra('E'), ', entre 1 000 000.'] },
      ],
      respuesta: [letra('D'), ', 1 mm'] },
    { nivel: 3, titulo: 'Lo que no explicaba Rutherford',
      enunciado: '¿Qué observación no podía explicar el modelo de Rutherford y llevó al de Bohr?',
      alternativas: ['Que casi todas las alfas pasen', 'Que el átomo sea neutro', 'Que unas alfas reboten', 'Que el hidrógeno dé pocos colores', 'Que haya electrones'],
      datos: [ANIOS, 'Cada modelo nuevo explicó algo que el anterior no podía'],
      solucion: [
        { texto: 'Rutherford ya explicaba la lámina: el vacío y el rebote. No explicaba por qué el hidrógeno caliente da solo unos colores.' },
        { texto: 'Bohr lo explicó con niveles fijos: cada salto suelta un color fijo.' },
        { texto: ['La ', letra('A'), ' y la ', letra('C'), ' son lo que Rutherford sí explicó, y la ', letra('E'), ' es de Thomson. La ', letra('B'), ' no era un problema: su átomo ya era neutro.'] },
      ],
      respuesta: [letra('D'), ', que el hidrógeno dé pocos colores'] },
  ];

  const modelos = {
    id: 'modelos-atomicos',
    titulo: 'Modelos atómicos',
    pregunta: '¿Qué hay dentro del átomo, si casi todas las alfas lo atraviesan?',
    temas: ['Modelos atómicos de Dalton a Bohr', 'Modelo actual'],
    pieza: 'quim-lamina',
    aprendizaje: 'Cada modelo explicó una evidencia que el anterior no podía. La lámina de oro mostró un átomo casi vacío, con un núcleo diminuto y positivo.',
    actividad: 'Lanzar alfas contra un átomo de Thomson y uno de Dalton, apuntando donde quieras.',
    // Lee: el retablo, qué es una alfa y qué es un modelo. No dice qué concluyó Rutherford (eso se predice).
    lee: {
      tarjetas: [
        { titulo: 'Un retablo dorado', texto: 'Muchos retablos de las iglesias del sur del Perú están cubiertos de pan de oro: hojitas de oro tan finas que casi dejan pasar la luz. Con una hoja así, en 1909, se lanzaron partículas contra el oro para ver qué hay dentro del átomo.',
          pieza: 'quim-lamina', dibujo: LAM({ vista: 'zoom', banda: 'retablo', modelo: 'incognita', titulo: 'Un átomo de oro' }) },
        { titulo: 'Partículas alfa', texto: 'Las balas del experimento fueron partículas alfa, muy pequeñas, con carga positiva y con unas 7300 veces la masa de un electrón. Las cargas del mismo signo se repelen, y las opuestas se atraen.' },
        { titulo: 'Qué es un modelo', texto: 'Como nadie puede ver un átomo, un modelo es una explicación simplificada que se pone a prueba. Para Dalton, los átomos eran esferas macizas, iguales dentro de cada elemento, que en una reacción solo se reordenan. Thomson metió electrones en una esfera positiva.',
          pieza: 'quim-lamina', dibujo: LAM({ vista: 'modelos' }, { corte: 2 }) },
        { titulo: 'Qué mirar', texto: 'En el juego lanzas una alfa contra un átomo de Thomson o de Dalton. Mira cuánto se desvía en cada modelo según dónde apuntas.' },
      ],
    },
    ejemplos: EJEMPLOS_MODELOS,
    juega: {
      pieza: 'quim-lamina',
      consigna: 'El pan de oro de los retablos es como la hoja de oro del experimento. Aquí lanzas una alfa contra un solo átomo.',
      mision: {
        texto: 'Apunta una alfa justo al centro de un átomo de Thomson.',
        logrado: v => v.k === 'thomson' && Math.abs(v.b) < 1e-9,
        bien: 'Ni apuntando al centro rebota, porque con la carga repartida ninguna alfa vuelve.',
      },
      voz: 'Cambia una cosa a la vez: el modelo o dónde apuntas.',
      leyenda: [
        { s: '→', t: 'el camino de una partícula alfa' },
        { s: 'fuente de alfas', t: 'de ahí salen las alfas, con carga positiva' },
        { s: Qc('+'), t: 'carga positiva del átomo de Thomson' },
        { s: Ee('●'), t: 'un electrón' },
      ],
      controles: [
        { id: 'k', etiqueta: 'Modelo', opciones: [{ valor: 'thomson', texto: 'Thomson' }, { valor: 'dalton', texto: 'Dalton' }] },
        // Ronda 2 del lector en frío: «radios del centro» no se entendía; se dice qué es 0 y qué es 1.
        { id: 'b', etiqueta: 'Dónde apunta (0: al centro; 1 o −1: al borde)', min: -1, max: 1, paso: 0.1, inicio: 0.5, decimales: 1 },
      ],
      dibujo: v => juegoLamina(v),
      // La relación: cómo se desvía la alfa según el modelo.
      lectura: v => {
        if (Math.abs(v.b) > 1 - 1e-9) return ['Por el borde del átomo, la alfa pasa sin desviarse.'];
        if (v.k === 'thomson') return ['Thomson: la alfa cruza el átomo y se desvía casi nada.'];
        return [`Dalton: la alfa choca con la esfera maciza y se desvía ${f(desvio('dalton', v.b), 0)}°.`];
      },
      minimo: 3,
    },
    predice: {
      pieza: 'quim-lamina',
      pregunta: 'En el experimento de verdad, casi todas las alfas atravesaron la lámina de oro, pero unas pocas rebotaron hacia atrás. ¿Qué tiene que haber dentro del átomo?',
      datos: ['Las alfas tienen carga positiva', 'Cargas del mismo signo se repelen'],
      voz: 'Ninguno de los dos átomos del juego da justo eso.',
      opciones: [
        { id: 'c', texto: 'Un núcleo diminuto y positivo; lo demás, casi vacío', correcta: true },
        { id: 'orbitas', texto: 'Electrones en órbitas fijas', error: 'AT5', siFuera: 'Las órbitas fijas son de Bohr, dos años después, y tratan de los electrones, así que no explican por qué unas alfas rebotan.' },
        { id: 'dalton', texto: 'Una esfera maciza que no se puede partir', error: 'QM-MODELO-DALTON', siFuera: 'Así pensaba Dalton. Pero si el oro fuera macizo, casi ninguna alfa lo atravesaría, y pasaron casi todas.' },
        { id: 'thomson', texto: 'Carga positiva repartida en todo el átomo', error: 'QM-MODELO-THOMSON', siFuera: 'Es el átomo de Thomson del juego: explica que las alfas pasen, pero con la carga repartida ninguna rebota.' },
      ],
      dibujo: LAM({ vista: 'lamina', resultado: true, titulo: 'Lo que se vio' }),
      revelar: LAM({ vista: 'zoom', modelo: 'nuclear', titulo: 'Núcleo diminuto y positivo', alfas: alfasNucleo }),
      coincide: 'Coincide: solo una carga positiva concentrada hace rebotar a las pocas que pasan muy cerca.',
      noCoincide: 'Si casi todas pasan, el átomo es casi vacío; si unas pocas rebotan, hay un núcleo diminuto y positivo.',
    },
    mira: {
      pieza: 'quim-lamina',
      datos: { vista: 'modelos' },
      voz: 'Sigamos los modelos: cada evidencia nueva cambió el anterior.',
      pasos: [
        // Correcciones del 18 nov (A1 y A4): el electrón es de 1897 (el modelo, de 1904) y lo que piden los ejercicios
        // (las proporciones fijas de Dalton y los rayos catódicos de Thomson) se ve aquí.
        { estado: { corte: 1 }, texto: 'En 1808, Dalton propuso que los átomos son esferas macizas que no se parten.' },
        { estado: { corte: 1 }, texto: 'Así explicó las proporciones fijas: los átomos se unen en números enteros sencillos.' },
        { estado: { corte: 2 }, texto: 'En 1897, Thomson halló en los rayos catódicos el electrón, una partícula con carga negativa.' },
        { estado: { corte: 2 }, texto: 'En 1904 propuso su modelo: electrones metidos dentro de una esfera de carga positiva.' },
        { estado: { corte: 3 }, texto: 'En 1911, Rutherford explicó la lámina de oro con un núcleo diminuto y positivo en el centro del átomo.' },
        { estado: { corte: 4 }, texto: 'En 1913, Bohr propuso que el electrón solo ocupa ciertos niveles, y que al bajar de uno a otro suelta luz de un color.' },
        { estado: { corte: 5 }, texto: 'Hoy se habla de orbitales: regiones donde es probable hallar al electrón, no caminos que recorre.' },
      ],
    },
    regla: {
      // Ronda 2 del lector en frío: Dalton y Thomson también en la regla (Ahora tú pide las proporciones fijas), y por qué
      // Bohr solo explicó el hidrógeno.
      texto: 'Cada modelo explicó una evidencia nueva. Dalton explicó las proporciones fijas con átomos macizos; Thomson halló el electrón; Rutherford halló un núcleo diminuto y positivo; en Bohr, el electrón que baja de nivel suelta luz de un color, y hoy se usan orbitales.',
      condicion: 'cada modelo se juzga con lo que se sabía en su época; el de Bohr, por ejemplo, solo explicaba bien el hidrógeno, que tiene un solo electrón.',
      voz: 'Un modelo vale por lo que explica, no por lo bonito del dibujo.',
    },
    // Así se resuelve: el verdadero o falso de «Ahora tú» (tipo examen), con otra semilla.
    resuelve: {
      pieza: 'quim-lamina',
      generar(s) {
        const c = casoVF(azar(s + 900)), bien = c.opciones.find(o => o.correcta).texto;
        return {
          enunciado: c.pregunta,
          datos: c.datos,
          pasos: [
            { tipo: 'pide', texto: 'Piden juzgar cada afirmación por separado: verdadera (V) o falsa (F).' },
            { tipo: 'regla', texto: 'Cada modelo propuso una idea nueva para explicar su evidencia, así que comparo cada afirmación con lo que propuso ese científico.' },
            { tipo: 'aplica', texto: c.razones },
            { tipo: 'sentido', texto: `Junto las tres respuestas en orden y queda ${bien}; con una sola letra cambiada, ya sería otra alternativa.` },
          ],
          respuesta: bien,
        };
      },
    },
    ahoraTu: {
      pieza: 'quim-lamina',
      voz: 'Relaciona cada idea con la evidencia que la pidió.',
      generar(s) {
        const r = azar(s + 7), tipo = s % 5;
        return [k => casoEvidencia(r, k), () => casoVF(r), () => casoEscala(r), () => casoBohr(r), () => casoRelaciona(r)][tipo](Math.floor(s / 5));
      },
    },
  };

  // ---------- Idea 3 (fase 3, 18 nov): niveles, subniveles y orbitales ----------
  // Objeto de la primera pantalla: el hotel del electrón (pieza quim-hotel, dibujo de prueba), una analogía que «Lee»
  // presenta con su dibujo antes del juego: piso = nivel n, pasillo = subnivel (ℓ), cuarto doble = orbital, huésped =
  // electrón. Sus límites se dicen en «Lee» y en la condición de la regla.
  // Cambia: el piso n (1 a 3) y el pasillo ℓ marcado · Permanece: los pisos de abajo, llenos · Progresa: de 1 cuarto y 2
  // huéspedes a 9 cuartos y 18 · Se reserva: el piso 4 con su pasillo f (se predice) · Debe verse: cada piso suma un
  // pasillo con dos cuartos más que el anterior.
  // Errores (hipótesis): QM-ORBITAL-ELECTRON (cuenta cuartos y no huéspedes), QM-SIN-F, QM-OCHO-POR-NIVEL, QM-2N,
  // QM-N-L (usa n donde va ℓ), QM-L-DESDE-UNO (s = 1, p = 2…), QM-SOLO-ULTIMO, QM-L-IGUAL-N, QM-ML-FUERA, QM-MS-ENTERO,
  // QM-ML-POSITIVO, QM-L-CERO y QM-L-MENOR.
  const HOTEL = (filas, o, estado) => ({ pieza: 'quim-hotel', datos: Object.assign({ filas }, o || {}), estado: estado || {} });
  const pisoFilas = (n, o = {}) => Array.from({ length: n }, (_, l) => Object.assign({ nombre: `${n}${LETRA[l]}`, e: 2 * (2 * l + 1) }, o));
  const hastaPiso = (n, o) => Array.from({ length: n }, (_, k) => pisoFilas(k + 1, o)).flat();
  const CAJAS = (filas, o, estado) => ({ pieza: 'quim-cajas', datos: Object.assign({ paleta: 'zne', filas }, o || {}), estado: estado || {} });
  const sumaOrb = n => Array.from({ length: n }, (_, l) => 2 * l + 1);
  const juegoHotel = v => HOTEL(hastaPiso(v.n).map(f => Object.assign(f, { marca: v.l < v.n && f.nombre === `${v.n}${LETRA[v.l]}` })), { cuenta: true, piso: v.n });

  // Ahora tú: seis tipos, del más simple al de examen. Cada uno da sus datos (herramientas, no el paso hecho).
  // Ronda 2 del lector en frío: casoOrbSub y casoESub ya no piden un subnivel f; Predice muestra sus 7 cuartos (y su
  // revelado, los 14 huéspedes), así que la respuesta estaba a la vista. El f se practica en casoSubnivel y en los ejemplos.
  // r.ent se llama igual que antes: las demás semillas no cambian.
  function casoOrbSub(r) {
    const n = r.ent(2, 5), l = r.ent(0, Math.min(2, n - 1)), sub = `${n}${LETRA[l]}`, o = 2 * l + 1;
    return {
      pregunta: `¿Cuántos orbitales tiene el subnivel ${sub}?`,
      datos: [DC.letras, DC.orbitales],
      opciones: opciones(o, [
        { id: 'e', valor: 2 * o, error: 'QM-ORBITAL-ELECTRON', siFuera: 'Multiplicar las cajas por dos da los electrones. Pero aquí piden los orbitales, que son las cajas.' },
        { id: 'n', valor: n, error: 'QM-N-L', siFuera: `Leíste bien el ${n}, pero el ${n} es el nivel: los orbitales dependen de ℓ, que da la letra.` },
        { id: 'l1', valor: 2 * (l + 1) + 1, error: 'QM-L-DESDE-UNO', siFuera: `Usar 2ℓ + 1 está bien. Pero ${LETRA[l]} es ℓ = ${l}, porque la cuenta empieza con s = 0, no con 1.` },
        { id: 'l', valor: l === 0 ? 3 : l, error: 'QM-N-L', siFuera: 'Leíste bien ℓ. Pero cada valor de mₗ, de −ℓ a +ℓ, es un orbital, así que son 2ℓ + 1.' },
      ], x => `${x}`),
      solucion: { texto: `La ${LETRA[l]} es ℓ = ${l}, así que mₗ va de −${l} a +${l}, con un orbital por cada valor.`, ecuacion: ['2 · ', `${l}`, ' + 1 = ', Oo(o)] },
    };
  }
  function casoESub(r) {
    const n = r.ent(2, 5), l = r.ent(0, Math.min(2, n - 1)), sub = `${n}${LETRA[l]}`, o = 2 * l + 1;
    return {
      pregunta: `¿Cuántos electrones caben, como máximo, en el subnivel ${sub}?`,
      datos: [DC.letras, DC.orbitales, DC.dos],
      opciones: opciones(2 * o, [
        { id: 'o', valor: o, error: 'QM-ORBITAL-ELECTRON', siFuera: 'Contaste bien los orbitales. Pero en cada uno caben dos electrones.' },
        { id: 'nivel', valor: 2 * n * n, error: 'QM-N-L', siFuera: `Eso cabe en todo el nivel ${n}, bien calculado. Pero aquí piden un solo subnivel.` },
        { id: 'l1', valor: 2 * (2 * (l + 1) + 1), error: 'QM-L-DESDE-UNO', siFuera: `Doblar los orbitales está bien. Pero ${LETRA[l]} es ℓ = ${l}, porque la cuenta empieza con s = 0.` },
        { id: 'ocho', valor: 8, error: 'QM-OCHO-POR-NIVEL', siFuera: 'Ocho no es un tope de los subniveles: cada uno tiene 2ℓ + 1 orbitales con dos electrones.' },
      ], x => `${x}`),
      solucion: { texto: `La ${LETRA[l]} es ℓ = ${l}: tiene ${o} ${o === 1 ? 'orbital' : 'orbitales'}, y en cada uno caben dos electrones.`, ecuacion: ['2 · ', Oo(o), ' = ', Ee(2 * o)] },
    };
  }
  function casoENivel(r) {
    const n = r.ent(2, 4), o = sumaOrb(n), t = o.reduce((a, b) => a + b, 0);
    return {
      pregunta: `¿Cuántos electrones caben, como máximo, en todo el nivel n = ${n}?`,
      datos: [DC.lDe, DC.orbitales, DC.dos],
      opciones: opciones(2 * t, [
        { id: 'o', valor: t, error: 'QM-ORBITAL-ELECTRON', siFuera: `Sumaste bien los orbitales: ${t}. Pero en cada uno caben dos electrones.` },
        { id: 'ocho', valor: 8, error: 'QM-OCHO-POR-NIVEL', siFuera: 'No todos los niveles se llenan con 8, porque cada nivel suma un subnivel más que el anterior.' },
        { id: 'menos', valor: 2 * (t - o[n - 1]), error: 'QM-SIN-F', siFuera: `Sumar subniveles es el camino. Pero ℓ llega hasta n − 1 = ${n - 1}, así que falta contar el ${n}${LETRA[n - 1]}.` },
        { id: '2n', valor: 2 * n, error: 'QM-2N', siFuera: 'Multiplicar por dos está bien. Pero antes hay que contar los orbitales de todos los subniveles.' },
        { id: 'ln', valor: 2 * (t + 2 * n + 1), error: 'QM-L-IGUAL-N', siFuera: `Sumar subniveles es el camino. Pero ℓ llega hasta n − 1 = ${n - 1}, así que el ${n}${LETRA[n] || ''} no existe.` },
      ], x => `${x}`),
      solucion: { texto: `ℓ va de 0 a ${n - 1}, así que hay ${o.join(' + ')} = ${t} orbitales, con dos electrones en cada uno.`, ecuacion: ['2 · ', Oo(t), ' = ', Ee(2 * t)] },
    };
  }
  function casoOrbNivel(r) {
    const n = r.ent(2, 4), o = sumaOrb(n), t = o.reduce((a, b) => a + b, 0);
    return {
      pregunta: `¿Cuántos orbitales tiene en total el nivel n = ${n}?`,
      datos: [DC.lDe, DC.orbitales],
      opciones: opciones(t, [
        { id: 'e', valor: 2 * t, error: 'QM-ORBITAL-ELECTRON', siFuera: 'La suma está bien hecha, pero da los electrones, porque cada orbital lleva dos.' },
        { id: 'n', valor: n, error: 'QM-N-L', siFuera: `Ese es el número de subniveles del nivel ${n}, y cada subnivel tiene sus propios orbitales.` },
        { id: 'ultimo', valor: o[n - 1], error: 'QM-SOLO-ULTIMO', siFuera: `Contaste bien el ${n}${LETRA[n - 1]}. Pero el nivel también tiene los subniveles de abajo.` },
        { id: 'menos', valor: t - o[n - 1], error: 'QM-SIN-F', siFuera: `Sumar es el camino. Pero ℓ llega hasta n − 1 = ${n - 1}, así que falta contar el ${n}${LETRA[n - 1]}.` },
      ], x => `${x}`),
      solucion: { texto: `Los subniveles de ℓ = 0 a ${n - 1} tienen ${o.slice(0, -1).join(', ')} y ${o[o.length - 1]} orbitales, y se suman.`, ecuacion: [o.join(' + '), ' = ', Oo(t)] },
    };
  }
  // Juego imposible de números cuánticos (nivel examen): tres posibles y uno que rompe una regla.
  function casoImposible(r) {
    const malo = r.de(['l', 'ml', 'ms']);
    const n = r.ent(2, 4);
    const imposible = malo === 'l' ? [n, n, 0, 1] : malo === 'ml' ? [n, 1, -2, 1] : [n, 1, 0, 2];
    const txt = ([a, b, c, d]) => `(${a}; ${b}; ${ML(c)}; ${d === 2 ? '+1' : MS(d)})`;
    const posibles = [
      { q: [r.ent(2, 4), 1, -1, -1], error: 'QM-ML-POSITIVO', siFuera: 'Ese sí existe: mₗ puede ser negativo, porque va de −ℓ a +ℓ.' },
      { q: [r.ent(1, 4), 0, 0, 1], error: 'QM-L-CERO', siFuera: 'Ese sí existe: ℓ = 0 es el subnivel s, con mₗ = 0.' },
      { q: [3, 2, 2, -1], error: 'QM-L-MENOR', siFuera: 'Ese sí existe: con n = 3, ℓ llega hasta 2, y mₗ = +2 cabe en el 3d.' },
    ];
    const POR = { l: `ℓ = ${n} no puede ser igual a n = ${n}: llega hasta ${n - 1}.`, ml: 'con ℓ = 1, mₗ va de −1 a +1: −2 no existe.', ms: 'mₛ solo vale +½ o −½.' };
    return {
      pregunta: '¿Cuál de estos juegos de números cuánticos (n; ℓ; mₗ; mₛ) no puede existir?',
      datos: [DC.lDe, 'mₗ va de −ℓ a +ℓ', DC.ms],
      opciones: [{ id: 'c', texto: txt(imposible), correcta: true }].concat(posibles.map((p, i) => ({ id: `p${i}`, texto: txt(p.q), error: p.error, siFuera: p.siFuera }))),
      solucion: { texto: `En ${txt(imposible)}, ${POR[malo]}` },
    };
  }
  function casoSubnivel(r) {
    const n = r.ent(3, 5), l = r.ent(1, Math.min(3, n - 1)), sub = `${n}${LETRA[l]}`, o = 2 * l + 1;
    const t = (s, k) => `${s}, con ${k} electrones`;
    return {
      pregunta: `Un electrón tiene n = ${n} y ℓ = ${l}. ¿En qué subnivel está y cuántos electrones caben ahí?`,
      datos: [DC.letras, DC.orbitales, DC.dos],
      opciones: [
        { id: 'c', texto: t(sub, 2 * o), correcta: true },
        { id: 'l1', texto: t(`${n}${LETRA[l - 1]}`, 2 * (2 * l - 1)), error: 'QM-L-DESDE-UNO', siFuera: `El nivel ${n} está bien. Pero ℓ = ${l} es la letra ${LETRA[l]}, porque s es 0, p es 1 y d es 2.` },
        { id: 'o', texto: t(sub, o), error: 'QM-ORBITAL-ELECTRON', siFuera: `El ${sub} está bien. Pero ${o} son sus orbitales, y en cada uno caben dos electrones.` },
        { id: 'nivel', texto: t(sub, 2 * n * n), error: 'QM-N-L', siFuera: `El ${sub} está bien. Pero ${2 * n * n} electrones caben en todo el nivel ${n}, no en un solo subnivel.` },
      ],
      solucion: { texto: `ℓ = ${l} es la letra ${LETRA[l]}, así que es el ${sub}: tiene ${o} orbitales con dos electrones cada uno.`, ecuacion: ['2 · ', Oo(o), ' = ', Ee(2 * o)] },
    };
  }

  // Ejemplos resueltos. La figura es el hotel o las cajas vacías, con «?» en lo que se pide. Cuentas rehechas aparte
  // (scratchpad, f3/cuentas.py): 3d 5 · 2p 6 · 4p · ℓ 0 y 1 · mₗ −1, 0, +1 · nivel 3: 1 + 3 + 5 = 9, 18 · nivel 4: 16 ·
  // 2d no · 3d 10 · 4f 7 y 14 · (2; 2; 0; +½) imposible · (3; 2; +1; −½) posible · nivel 3 con mₗ = 0: 3 orbitales, 6 ·
  // niveles 1 a 3: 2 + 8 + 18 = 28 · orbitales d hasta n = 4: 3d y 4d, 10.
  const vacios = (filas, o) => HOTEL(filas.map(x => Object.assign({ e: 0, vacia: true, oculto: true }, x)), Object.assign({ cuenta: true }, o || {}));
  const EJEMPLOS_NIVELES = [
    { nivel: 1, titulo: 'Los cuartos del 3d',
      enunciado: '¿Cuántos orbitales tiene el subnivel 3d?',
      datos: [DC.letras, DC.orbitales],
      solucion: [{ texto: 'La letra d es ℓ = 2, y hay un orbital por cada valor de mₗ, de −2 a +2.', ecuacion: ['2 · 2 + 1 = ', Oo(5)] }],
      respuesta: [Oo(5), ' orbitales'] },
    { nivel: 1, titulo: 'Los huéspedes del 2p',
      enunciado: 'El pasillo 2p tiene 3 cuartos dobles. ¿Cuántos electrones caben, como máximo, en el 2p?',
      datos: [DC.dos],
      figura: vacios([{ nombre: '2p' }]),
      solucion: [{ texto: 'Cada cuarto, un orbital, recibe dos huéspedes de espín opuesto.', ecuacion: ['2 · ', Oo(3), ' = ', Ee(6)] }],
      respuesta: [Ee(6), ' electrones'] },
    { nivel: 1, titulo: 'La letra del subnivel',
      enunciado: 'Un electrón tiene n = 4 y ℓ = 1. ¿En qué subnivel está?',
      datos: [DC.letras],
      solucion: [{ texto: 'n = 4 es el piso, y ℓ = 1 es la letra p. Se escribe primero el número del nivel y después la letra.' }],
      respuesta: 'En el 4p' },
    { nivel: 1, titulo: 'Los pasillos del piso 2',
      enunciado: '¿Qué valores puede tomar ℓ en el nivel n = 2?',
      datos: [DC.lDe, DC.letras],
      solucion: [{ texto: 'ℓ va de 0 a 2 − 1 = 1, así que el nivel 2 tiene el 2s (ℓ = 0) y el 2p (ℓ = 1), pero no un 2d.' }],
      respuesta: 'ℓ = 0 y ℓ = 1: el 2s y el 2p' },
    { nivel: 1, titulo: 'Los números de las cajas p',
      enunciado: '¿Qué valores puede tomar mₗ en un subnivel p?',
      datos: [DC.letras, 'mₗ va de −ℓ a +ℓ'],
      figura: CAJAS([{ nombre: '2p', e: 0, cajas: 3 }], { cuenta: false }),
      solucion: [{ texto: 'La p es ℓ = 1, así que mₗ va de −1 a +1 pasando por 0, con una caja por cada valor.' }],
      respuesta: 'mₗ = −1, 0 y +1' },
    { nivel: 2, titulo: 'Los huéspedes del piso 3',
      enunciado: '¿Cuántos electrones caben, como máximo, en el nivel n = 3?',
      datos: [DC.lDe, DC.orbitales, DC.dos],
      figura: vacios(pisoFilas(3)),
      solucion: [
        { texto: 'ℓ va de 0 a 2: los subniveles 3s, 3p y 3d, con 1, 3 y 5 orbitales.', ecuacion: ['1 + 3 + 5 = ', Oo(9)] },
        { texto: 'Pongo dos electrones en cada orbital y multiplico.', ecuacion: ['2 · ', Oo(9), ' = ', Ee(18)] },
      ],
      respuesta: [Ee(18), ' electrones'] },
    { nivel: 2, titulo: 'Los cuartos del piso 4',
      enunciado: '¿Cuántos orbitales tiene en total el nivel n = 4?',
      datos: [DC.lDe, DC.orbitales],
      figura: vacios(pisoFilas(4)),
      solucion: [
        { texto: 'ℓ va de 0 a 3, así que el nivel 4 tiene los subniveles 4s, 4p, 4d y 4f.' },
        { texto: 'Sumo los 2ℓ + 1 orbitales de cada subnivel.', ecuacion: ['1 + 3 + 5 + 7 = ', Oo(16)] },
      ],
      respuesta: [Oo(16), ' orbitales'] },
    { nivel: 2, titulo: '¿Existe el 2d?',
      enunciado: '¿Puede existir un subnivel 2d?',
      datos: [DC.lDe, DC.letras],
      solucion: [
        { texto: 'La letra d corresponde a ℓ = 2.' },
        { texto: 'Con n = 2, ℓ llega solo hasta 2 − 1 = 1, así que ℓ = 2 no cabe en el piso 2.' },
      ],
      respuesta: 'No: en el nivel 2, ℓ llega hasta 1' },
    { nivel: 2, titulo: 'Los del 3d',
      enunciado: '¿Cuántos electrones del nivel 3 pueden tener ℓ = 2?',
      datos: [DC.letras, DC.orbitales, DC.dos],
      solucion: [
        { texto: 'ℓ = 2 con n = 3 es el 3d: tiene 2 · 2 + 1 = 5 orbitales.' },
        { texto: 'En cada orbital caben dos electrones, así que multiplico por dos.', ecuacion: ['2 · ', Oo(5), ' = ', Ee(10)] },
      ],
      respuesta: [Ee(10), ' electrones'] },
    { nivel: 2, titulo: 'El pasillo f',
      enunciado: '¿Cuántos orbitales tiene el subnivel 4f y cuántos electrones caben en él?',
      datos: [DC.letras, DC.orbitales, DC.dos],
      figura: vacios([{ nombre: '4f' }]),
      solucion: [
        { texto: 'La letra f es ℓ = 3, y los orbitales salen de 2ℓ + 1.', ecuacion: ['2 · 3 + 1 = ', Oo(7)] },
        { texto: 'En cada orbital caben dos electrones.', ecuacion: ['2 · ', Oo(7), ' = ', Ee(14)] },
      ],
      respuesta: [Oo(7), ' orbitales y ', Ee(14), ' electrones'] },
    { nivel: 3, titulo: 'El juego imposible',
      enunciado: '¿Cuál de estos juegos de números cuánticos (n; ℓ; mₗ; mₛ) no puede existir?',
      alternativas: ['(2; 1; −1; +½)', '(3; 0; 0; −½)', '(2; 2; 0; +½)', '(4; 3; −3; −½)', '(3; 2; +2; +½)'],
      datos: [DC.lDe, 'mₗ va de −ℓ a +ℓ', DC.ms],
      solucion: [
        { texto: 'Reviso las tres reglas en cada juego: ℓ menor que n, mₗ entre −ℓ y +ℓ, y mₛ igual a +½ o −½.' },
        { texto: 'En (2; 2; 0; +½), ℓ = 2 es igual a n = 2: con n = 2, ℓ llega hasta 1.' },
        { texto: ['La ', letra('D'), ' sí existe: con n = 4, ℓ = 3 es el 4f, y −3 está entre −3 y +3.'] },
      ],
      respuesta: [letra('C'), ', (2; 2; 0; +½)'] },
    { nivel: 3, titulo: 'Un electrón del 3d',
      enunciado: '¿Cuál de estos juegos (n; ℓ; mₗ; mₛ) puede tener un electrón del subnivel 3d?',
      alternativas: ['(3; 1; 0; +½)', '(3; 2; −3; −½)', '(3; 2; +1; −½)', '(2; 2; 0; +½)', '(3; 3; 0; +½)'],
      datos: [DC.letras, 'mₗ va de −ℓ a +ℓ', DC.ms],
      solucion: [
        { texto: 'El 3d pide n = 3 y ℓ = 2, con mₗ entre −2 y +2.' },
        { texto: ['La ', letra('A'), ' es un 3p y la ', letra('E'), ', ℓ = 3. La ', letra('B'), ' tiene mₗ = −3, fuera de −2 a +2. La ', letra('D'), ' tiene n = 2.'] },
      ],
      respuesta: [letra('C'), ', (3; 2; +1; −½)'] },
    { nivel: 3, titulo: 'Los que tienen mₗ = 0',
      enunciado: '¿Cuántos electrones del nivel 3 pueden tener mₗ = 0?',
      alternativas: ['2', '3', '6', '9', '18'],
      datos: [DC.lDe, 'mₗ va de −ℓ a +ℓ', DC.dos],
      solucion: [
        { texto: 'El nivel 3 tiene 3s, 3p y 3d. Cada uno tiene una sola caja con mₗ = 0: son 3 orbitales.' },
        { texto: 'Cada orbital lleva dos electrones, así que multiplico por dos.', ecuacion: ['2 · ', Oo(3), ' = ', Ee(6)] },
        { texto: ['La ', letra('A'), ' cuenta solo el 3s. La ', letra('B'), ' cuenta orbitales y no electrones.'] },
        { texto: ['La ', letra('D'), ' da los orbitales de todo el nivel. La ', letra('E'), ', sus electrones.'] },
      ],
      respuesta: [letra('C'), ', ', Ee(6), ' electrones'] },
    { nivel: 3, titulo: 'Tres pisos juntos',
      enunciado: '¿Cuántos electrones caben, como máximo, entre los niveles 1, 2 y 3 juntos?',
      // Ronda 2 del lector en frío: la E era 36 con «cuenta dos veces el 3» (eso da 2 + 8 + 18 + 18 = 46). Ahora es un
      // error que sí da su número: 2n en vez de 2n² (QM-2N). Cada alternativa, rehecha en estructura-atomica.test.js.
      alternativas: ['18', '24', '14', '28', '12'],
      datos: [DC.lDe, DC.orbitales, DC.dos],
      solucion: [
        { texto: 'Los niveles tienen 1, 1 + 3 = 4 y 1 + 3 + 5 = 9 orbitales; con dos electrones en cada uno, caben 2, 8 y 18.' },
        { texto: 'Sumo lo que cabe en los tres niveles.', ecuacion: ['2 + 8 + 18 = ', Ee(28)] },
        { texto: ['La ', letra('A'), ' toma solo el nivel 3. La ', letra('B'), ' pone 8 en cada nivel. La ', letra('C'), ' suma orbitales.'] },
        { texto: ['La ', letra('E'), ' usa 2n en vez de 2n²: 2 + 4 + 6 = 12.'] },
      ],
      respuesta: [letra('D'), ', ', Ee(28), ' electrones'] },
    { nivel: 3, titulo: 'Los orbitales d',
      enunciado: '¿Cuántos orbitales d hay, en total, entre los niveles 1 y 4?',
      alternativas: ['5', '10', '20', '15', '2'],
      datos: [DC.lDe, DC.letras, DC.orbitales],
      solucion: [
        { texto: 'La d pide ℓ = 2, y ℓ llega hasta n − 1: solo existen 3d y 4d.' },
        { texto: 'Cada uno tiene 2 · 2 + 1 = 5 orbitales.', ecuacion: ['5 + 5 = ', Oo(10)] },
        { texto: ['La ', letra('A'), ' cuenta un solo nivel. La ', letra('C'), ' da electrones. La ', letra('D'), ' agrega un 2d que no existe.'] },
        { texto: ['La ', letra('E'), ' cuenta subniveles, el 3d y el 4d, y no sus orbitales.'] },
      ],
      respuesta: [letra('B'), ', ', Oo(10), ' orbitales'] },
  ];

  const cuanticos = {
    id: 'numeros-cuanticos',
    titulo: 'Niveles, subniveles y orbitales',
    pregunta: '¿Cuántos electrones caben en cada nivel de un átomo?',
    temas: ['Números cuánticos y orbitales'],
    pieza: 'quim-hotel',
    aprendizaje: 'El nivel n tiene n subniveles (ℓ de 0 a n − 1); cada subnivel, 2ℓ + 1 orbitales; cada orbital, dos electrones.',
    actividad: 'Abrir pisos del hotel del electrón y contar pasillos, cuartos y huéspedes.',
    // Lee: el hotel como analogía (punto 6 del contrato), las letras y la dirección del electrón. No dice cuánto cabe en
    // un piso (eso se cuenta en el juego) ni nada del piso 4 (se predice).
    lee: {
      tarjetas: [
        { titulo: 'El hotel del electrón', texto: 'Imagina el átomo como un hotel: cada piso es un nivel de energía, n; cada piso tiene pasillos, que son los subniveles, y cada pasillo, cuartos dobles, que son los orbitales. Los huéspedes son los electrones, aunque un electrón no es una bolita quieta.',
          pieza: 'quim-hotel', dibujo: HOTEL(hastaPiso(2), { cuenta: false }) },
        { titulo: 'Las letras de los pasillos', texto: 'Cada pasillo lleva su piso y una letra: s, p, d o f. El número ℓ dice la letra: ℓ = 0 es s; ℓ = 1, p; ℓ = 2, d; ℓ = 3, f. En 2p, el 2 es el piso y la p, el pasillo.' },
        { titulo: 'Una dirección de cuatro números', texto: 'Cada electrón tiene cuatro números cuánticos, como una dirección: n (el piso), ℓ (el pasillo), mₗ (el cuarto) y mₛ, su espín: la flecha ↑ o ↓. En un mismo cuarto, los dos huéspedes tienen espín opuesto.' },
        { titulo: 'Qué mirar', texto: 'En el juego abres pisos del hotel. Cuenta cuántos pasillos, cuartos y huéspedes tiene cada piso, y mira cómo crecen al subir.' },
      ],
    },
    ejemplos: EJEMPLOS_NIVELES,
    juega: {
      pieza: 'quim-hotel',
      consigna: 'En el hotel del electrón, cada piso tiene un pasillo más que el de abajo. Sube de piso y cuenta.',
      mision: {
        texto: 'Abre un piso donde quepan justo 18 huéspedes.',
        logrado: v => v.n === 3,
        bien: 'El piso 3 tiene 9 cuartos y 18 huéspedes. Cada pasillo nuevo trae dos cuartos más.',
      },
      voz: 'Cuenta cuartos y después huéspedes.',
      leyenda: [
        { s: 'n', t: 'el piso: el nivel de energía' },
        { s: 'ℓ', t: 'el pasillo (0: s, 1: p, 2: d)' },
        { s: 'f', t: 'pasillo ℓ = 3: aparece en el piso 4' },
        { s: '□', t: 'un cuarto doble: un orbital' },
        { s: Ee('↑↓'), t: 'dos huéspedes de espín opuesto: uno ↑ y otro ↓' },
        { s: Ee('e⁻'), t: 'huéspedes que caben en el pasillo' },
      ],
      controles: [
        { id: 'n', etiqueta: 'Piso (n)', min: 1, max: 3, paso: 1, inicio: 2, decimales: 0 },
        { id: 'l', etiqueta: 'Pasillo marcado (ℓ)', min: 0, max: 2, paso: 1, inicio: 1, decimales: 0 },
      ],
      dibujo: v => juegoHotel(v),
      // La relación: cuartos y huéspedes del piso n, y el pasillo ℓ que se mira.
      lectura: v => (v.l >= v.n ? [`El piso ${v.n} no tiene pasillo ${LETRA[v.l]}: ℓ llega hasta n − 1.`]
        : [`Piso ${v.n}: `, Oo(`${v.n * v.n} ${v.n === 1 ? 'cuarto' : 'cuartos'}`), ' y ', Ee(`${2 * v.n * v.n} huéspedes`), `; el ${v.n}${LETRA[v.l]} tiene ${2 * v.l + 1}.`]),
      minimo: 3,
    },
    predice: {
      pieza: 'quim-hotel',
      pregunta: 'En el piso 4 del hotel aparece un pasillo nuevo, el 4f. ¿Cuántos huéspedes caben, como máximo, en todo el piso 4?',
      datos: ['El piso 4 tiene los pasillos 4s, 4p, 4d y 4f', 'El pasillo f tiene 7 cuartos dobles'],
      voz: 'Piensa qué pasillos hay y cuántos cuartos tiene cada uno.',
      opciones: [
        { id: 'c', texto: '32', correcta: true },
        { id: 'cuartos', texto: '16', error: 'QM-ORBITAL-ELECTRON', siFuera: 'Dieciséis son los cuartos del piso 4, bien contados. Pero en cada cuarto caben dos huéspedes.' },
        { id: 'sinf', texto: '18', error: 'QM-SIN-F', siFuera: 'Dieciocho huéspedes caben en el piso 3. El piso 4 suma además el pasillo 4f, que tiene 7 cuartos.' },
        { id: 'ocho', texto: '8', error: 'QM-OCHO-POR-NIVEL', siFuera: 'No todos los pisos se llenan con 8, porque cada piso suma un pasillo más que el de abajo.' },
      ],
      dibujo: vacios(pisoFilas(4), { rotulo: 'Piso 4: ¿cuántos huéspedes caben?' }),
      revelar: HOTEL(pisoFilas(4), { cuenta: true, rotulo: 'Piso 4: 2 + 6 + 10 + 14 = 32 huéspedes', rotuloColor: 'f' }),
      coincide: 'Coincide: 1 + 3 + 5 + 7 = 16 cuartos, con dos huéspedes cada uno.',
      noCoincide: 'El piso 4 tiene 16 cuartos dobles: caben 32 huéspedes.',
    },
    mira: {
      pieza: 'quim-cajas',
      datos: { paleta: 'zne', ml: true, filas: [{ nombre: '3s', e: 2, cajas: 1, desde: 1 }, { nombre: '3p', e: 6, cajas: 3, desde: 2 }, { nombre: '3d', e: 10, cajas: 5, desde: 3 }] },
      voz: 'Armemos el piso 3, pasillo por pasillo.',
      pasos: [
        { estado: { corte: 1 }, texto: 'En el piso 3, el pasillo s (ℓ = 0) tiene un solo cuarto, con el número mₗ = 0.', ecuacion: ['ℓ = 0:  2 · 0 + 1 = ', Oo(1)] },
        { estado: { corte: 2 }, texto: 'El pasillo p tiene ℓ = 1 y tres cuartos, con mₗ de −1 a +1.', ecuacion: ['ℓ = 1:  2 · 1 + 1 = ', Oo(3)] },
        { estado: { corte: 3 }, texto: 'El pasillo d tiene ℓ = 2 y cinco cuartos, con mₗ de −2 a +2.', ecuacion: ['ℓ = 2:  2 · 2 + 1 = ', Oo(5)] },
        { estado: { corte: 3 }, texto: 'En cada cuarto van dos electrones de espín opuesto: uno con mₛ = +½ y otro con −½.' },
        { estado: { corte: 3 }, texto: 'En total, el piso 3 tiene 9 orbitales, y en ellos caben 18 electrones.', ecuacion: ['1 + 3 + 5 = ', Oo(9), '   ·   2 · ', Oo(9), ' = ', Ee(18)] },
        { estado: { corte: 3 }, texto: 'Como ℓ llega solo hasta n − 1 = 2, el piso 3 no tiene pasillo f.' },
      ],
    },
    regla: {
      // Ronda 2 del lector en frío: mₛ con su nombre (el espín) y su flecha.
      texto: 'n es el nivel; ℓ es el subnivel (s, p, d, f) y va de 0 a n − 1; mₗ va de −ℓ a +ℓ, con un orbital por cada valor, y mₛ, el espín, vale +½ (↑) o −½ (↓).',
      ecuacion: [Oo('orbitales'), ' = 2', { llave: ['ℓ'], nota: 'subnivel' }, ' + 1', '   ·   ', Ee('electrones del nivel'), ' = 2', { llave: [{ sup: ['n', '2'] }], nota: 'nivel' }],
      condicion: 'en cada orbital caben dos electrones, de espín opuesto.',
      voz: 'Cuenta cajas y después flechas. El hotel es solo una analogía.',
      dibujo: { pieza: 'quim-hotel', datos: { filas: hastaPiso(3), cuenta: true } },
    },
    // Así se resuelve: los tres primeros tipos de «Ahora tú» (orbitales de un subnivel, electrones de un subnivel y de
    // un nivel), con otras semillas y las mismas cuentas (2ℓ + 1 y dos por orbital).
    resuelve: {
      pieza: 'quim-hotel',
      generar(s) {
        const r = azar(s + 900), tipo = s % 3;
        if (tipo === 2) {
          const n = r.ent(2, 4), o = sumaOrb(n), t = o.reduce((a, b) => a + b, 0), subs = o.map((_, l) => `${n}${LETRA[l]}`);
          return {
            enunciado: `¿Cuántos electrones caben, como máximo, en el nivel n = ${n}?`,
            datos: [DC.lDe, DC.orbitales, DC.dos],
            dibujo: vacios(pisoFilas(n)),
            pasos: [
              { tipo: 'pide', texto: `Piden cuántos huéspedes caben en todo el piso ${n}, con todos sus pasillos llenos.` },
              { tipo: 'datos', texto: `Con n = ${n}, ℓ va de 0 a ${n - 1}: los subniveles ${subs.join(', ')}.` },
              { tipo: 'regla', texto: 'Sumo los orbitales de cada subnivel (2ℓ + 1) y pongo dos electrones de espín opuesto en cada orbital.' },
              { tipo: 'cuentas', texto: 'Cuento los cuartos de cada pasillo y después los huéspedes, dos por cuarto.', ecuacion: [o.join(' + '), ' = ', Oo(t), '   ·   2 · ', Oo(t), ' = ', Ee(2 * t)],
                dibujo: HOTEL(pisoFilas(n), { cuenta: true }) },
              { tipo: 'sentido', texto: `Para comprobar: el piso ${n} tiene ${n} pasillos, uno más que el piso ${n - 1}, así que le caben más huéspedes.` },
            ],
            respuesta: `${2 * t} electrones`,
          };
        }
        const n = r.ent(2, 5), l = r.ent(0, Math.min(3, n - 1)), sub = `${n}${LETRA[l]}`, o = 2 * l + 1;
        const ml = Array.from({ length: o }, (_, k) => ML(k - l)).join(', ');
        const lleno = CAJAS([{ nombre: sub, e: 2 * o, cajas: o }], { ml: true });
        const datos = { tipo: 'datos', texto: `En ${sub}, el ${n} es el nivel y la letra ${LETRA[l]} dice el subnivel: ℓ = ${l}.` };
        if (tipo === 0) return {
          enunciado: `¿Cuántos orbitales tiene el subnivel ${sub}?`,
          datos: [DC.letras, DC.orbitales],
          pasos: [
            { tipo: 'pide', texto: `Piden cuántos orbitales, es decir, cuántas cajas, tiene el subnivel ${sub}.` },
            datos,
            { tipo: 'regla', texto: 'Hay un orbital por cada valor de mₗ, que va de −ℓ a +ℓ pasando por 0.', ecuacion: [Oo('orbitales'), ' = 2ℓ + 1'] },
            { tipo: 'cuentas', texto: `Con ℓ = ${l}, mₗ toma ${o === 1 ? 'un solo valor' : `${o} valores`}: ${ml}.`, ecuacion: [`2 · ${l} + 1 = `, Oo(o)],
              dibujo: CAJAS([{ nombre: sub, e: 0, cajas: o }], { ml: true, cuenta: false }) },
            { tipo: 'sentido', texto: `Para comprobar, la figura tiene ${o} ${o === 1 ? 'caja' : 'cajas'}. El nivel no cambia la cuenta: todo subnivel ${LETRA[l]} tiene ${o}.` },
          ],
          respuesta: `${o} ${o === 1 ? 'orbital' : 'orbitales'}`,
        };
        return {
          enunciado: `¿Cuántos electrones caben, como máximo, en el subnivel ${sub}?`,
          datos: [DC.letras, DC.orbitales, DC.dos],
          pasos: [
            { tipo: 'pide', texto: `Piden cuántos electrones caben en el subnivel ${sub} cuando está lleno.` },
            datos,
            { tipo: 'regla', texto: 'Primero cuento los orbitales, uno por cada valor de mₗ; en cada orbital caben dos electrones de espín opuesto.' },
            { tipo: 'cuentas', texto: `Con ℓ = ${l} hay ${o} ${o === 1 ? 'orbital' : 'orbitales'}, y cada orbital lleva dos flechas.`, ecuacion: [`2 · ${l} + 1 = `, Oo(o), '   ·   2 · ', Oo(o), ' = ', Ee(2 * o)], dibujo: lleno },
            { tipo: 'sentido', texto: `Para comprobar: ${o} ${o === 1 ? 'caja' : 'cajas'} con dos flechas son ${2 * o}, menos que los ${2 * n * n} que caben en todo el nivel ${n}.` },
          ],
          respuesta: `${2 * o} electrones`,
        };
      },
    },
    ahoraTu: {
      pieza: 'quim-hotel',
      voz: 'Primero el subnivel, después las cajas.',
      generar(s) {
        const r = azar(s + 13), tipo = s % 6;
        return [casoOrbSub, casoESub, casoENivel, casoOrbNivel, casoImposible, casoSubnivel][tipo](r);
      },
    },
  };

  // ---------- Idea 4 (fase 3, 18 nov): configuración electrónica de los átomos neutros ----------
  // Objeto: el mismo hotel con el precio en la puerta de cada pasillo, n + ℓ en soles (quim-hotel con `precios`). Juego
  // hasta Z = 36, con el cromo y el cobre (decisiones del 18 nov); «Ahora tú» de nivel examen hasta Z = 54, con el orden de
  // llenado en `datos`. Como el juego ya muestra el electrón 19 del potasio, la predicción de la propuesta (¿adónde va el
  // electrón 19?) se pasa al mismo caso un piso más arriba: el electrón 37 del rubidio, 5s contra 4d (regla 3: se
  // predice lo que el juego no mostró). Es una decisión de esta fase, avisada a Gerson.
  // Cambia: Z, de uno en uno · Permanece: el hotel entero hasta el 4p, con sus precios · Progresa: del 1s al 4p, con el
  // 4s antes que el 3d · Se reserva: el piso 5 · Debe verse: el pasillo más barato con sitio se llena primero.
  // Errores (hipótesis): QM-PISO-ANTES (llena por pisos y no por precio; antes QM-3D-ANTES), QM-PASILLO-NUEVO,
  // QM-LLENO-NO-ENTRA, QM-TOPE (pasa el tope de un subnivel), QM-ANOMALIA (ignora la del Cr o el Cu), QM-TODO-3D,
  // QM-VALENCIA-D (cuenta el 3d en el último nivel), QM-VALENCIA-SUB (solo el último subnivel), QM-NIVEL-OCUPADO (cuenta
  // como lleno un nivel con electrones), QM-NIVEL-8 (el nivel 3 lleno con 8), QM-5P-ANTES y QM-CUENTA.
  const PASILLOS36 = ORDEN.slice(0, 8);
  // El hotel de un átomo neutro: los pasillos hasta el 4p, con sus electrones; los vacíos, apagados.
  const hotelDe = (z, o) => { const c = configNeutro(z); return HOTEL(PASILLOS36.map(p => { const x = c.find(y => y.nom === p.nom); return { nombre: p.nom, e: x ? x.e : 0, tenue: !x }; }), Object.assign({ precios: true }, o || {})); };
  const hotelVacio = (noms, o) => HOTEL(noms.map(nom => ({ nombre: nom, e: 0, vacia: true })), Object.assign({ precios: true }, o || {}));
  const NEUTROS20 = [5, 7, 8, 9, 11, 13, 14, 15, 16, 17, 19, 20, 12, 6];
  const NEUTROS36 = [21, 22, 23, 25, 26, 27, 28, 30, 31, 32, 33, 34, 35];
  const NEUTROS54 = [37, 38, 39, 40, 43, 48, 49, 50, 51, 52, 53];
  const ultimoSub = c => c[c.length - 1];
  // Errores de una configuración, con su valor (lo que produce el error).
  const porPisos = e => { const o = []; let r = e; for (const p of [1, 2, 3, 4, 5]) for (let l = 0; l < p && l < 4; l++) { if (r <= 0) break; const k = Math.min(2 * (2 * l + 1), r); o.push({ nom: `${p}${LETRA[l]}`, n: p, l, e: k }); r -= k; } return o; };
  function casoConfig20(r) {
    const z = r.de(NEUTROS20), c = configNeutro(z);
    return {
      pregunta: ['¿Cuál es la configuración electrónica del ', NOMBRE[z], ' (', Z, ` = ${z})?`],
      datos: [DC.orden36, DC.capacidad],
      opciones: opciones(textoConfig(c), [
        { id: 'pisos', valor: z >= 19 ? textoConfig(porPisos(z)) : null, error: 'QM-PISO-ANTES', siFuera: 'Llenar hasta el 3p está bien. Pero el 4s cuesta menos que el 3d, así que se llena antes.' },
        { id: 'tope', valor: c.length > 2 ? textoConfig(c.slice(0, -2).concat([{ nom: c[c.length - 2].nom, e: c[c.length - 2].e + c[c.length - 1].e }])) : null, error: 'QM-TOPE', siFuera: 'La cuenta total está bien. Pero ningún subnivel pasa su tope: 2 en un s y 6 en un p.' },
        { id: 'menos', valor: textoConfig(config(z - 1)), error: 'QM-CUENTA', siFuera: `El orden está bien. Pero esa configuración tiene ${z - 1} electrones, y el átomo neutro tiene ${z}.` },
        { id: 'mas', valor: textoConfig(config(z + 1)), error: 'QM-CUENTA', siFuera: `El orden está bien. Pero esa configuración tiene ${z + 1} electrones, y el átomo neutro tiene ${z}.` },
      ], x => x),
      solucion: { texto: `El átomo neutro tiene ${z} electrones, repartidos en orden y sin pasar los topes.`, ecuacion: [textoConfig(c)] },
    };
  }
  function casoUltimoSub(r) {
    const z = r.de(NEUTROS36.concat(NEUTROS54)), c = configNeutro(z), u = ultimoSub(c), pp = porPisos(z), up = pp[pp.length - 1];
    const siguiente = ORDEN[SUB[u.nom].i + 1], anterior = ORDEN[SUB[u.nom].i - 1];
    return {
      pregunta: ['¿En qué subnivel entra el último electrón del ', NOMBRE[z], ' (', Z, ` = ${z})?`],
      datos: [DC.orden, DC.capacidad],
      opciones: opciones(u.nom, [
        { id: 'pisos', valor: up.nom, error: 'QM-PISO-ANTES', siFuera: 'Llenar pasillo por pasillo está bien. Pero se sigue el orden de llenado, no el de los pisos.' },
        { id: 'sig', valor: siguiente ? siguiente.nom : null, error: 'QM-CUENTA', siFuera: `El orden está bien. Pero con ${z} electrones el ${u.nom} todavía tiene sitio, así que no se pasa al siguiente.` },
        { id: 'ant', valor: anterior ? anterior.nom : null, error: 'QM-TOPE', siFuera: `El orden está bien. Pero el ${anterior && anterior.nom} ya está lleno, así que el electrón ${z} va al subnivel que sigue.` },
        { id: 'ns', valor: `${u.n}s`, error: 'QM-VALENCIA-SUB', siFuera: `El nivel ${u.n} está bien. Pero el último electrón va al último subnivel que se llenó.` },
        { id: 'np', valor: `${u.n}p`, error: 'QM-PASILLO-NUEVO', siFuera: `El nivel ${u.n} está bien. Pero el ${u.n}p cuesta más, y antes se llena el ${u.nom}.` },
        { id: 'f', valor: '4f', error: 'QM-PASILLO-NUEVO', siFuera: 'El 4f cuesta S/ 7, así que se llena mucho después.' },
      ], x => x),
      solucion: { texto: `Reparto ${z} electrones en orden: el último cae en el ${u.nom}.`, ecuacion: [abreviada(c)] },
    };
  }
  function casoValencia(r) {
    const z = r.de([11, 12, 13, 15, 16, 17, 19, 20, 31, 32, 33, 34, 35, 49, 50, 51, 52, 53]), c = configNeutro(z), n = ultimoNivel(c), v = valencia(c);
    const conD = v + c.filter(x => x.n === n - 1 && x.l === 2).reduce((a, x) => a + x.e, 0), ult = ultimoSub(c).e;
    return {
      pregunta: ['¿Cuántos electrones tiene en su último nivel el ', NOMBRE[z], ' (', Z, ` = ${z})?`],
      datos: [DC.orden, DC.capacidad, DC.valencia],
      opciones: opciones(v, [
        { id: 'd', valor: conD !== v ? conD : null, error: 'QM-VALENCIA-D', siFuera: `La configuración está bien. Pero el ${n - 1}d es del nivel ${n - 1}, así que no es parte del último nivel.` },
        { id: 'sub', valor: ult !== v ? ult : null, error: 'QM-VALENCIA-SUB', siFuera: `Mirar el final está bien. Pero el nivel ${n} también tiene su ${n}s, y los dos se suman.` },
        { id: 'n', valor: n, error: 'QM-VALENCIA-N', siFuera: `Es cierto que ${n} es el número del último nivel. Pero piden cuántos electrones tiene.` },
        { id: 'ocho', valor: v === 8 ? 2 : 8, error: 'QM-OCHO-POR-NIVEL', siFuera: 'Buscar el último nivel está bien. Pero no siempre tiene 8 electrones: hay que contarlos.' },
        { id: 'todo', valor: totalE(c), error: 'QM-VALENCIA-TODO', siFuera: 'Esos son todos los electrones del átomo, y piden solo los del último nivel.' },
        { id: 'mas', valor: v + 1, error: 'QM-CUENTA', siFuera: 'El último nivel está bien elegido. Revisa la suma de sus superíndices.' },
      ], x => `${x}`),
      solucion: { texto: `El último nivel es el ${n}, así que se suman los electrones de sus subniveles.`, ecuacion: [abreviada(c), '   ·   ', Ee(v)] },
    };
  }
  function casoAnomala(r) {
    const z = r.de([24, 29]), c = configNeutro(z), normal = config(z);
    const quita = (lista, nom, k) => lista.map(x => (x.nom === nom ? Object.assign({}, x, { e: x.e + k }) : x)).filter(x => x.e > 0);
    return {
      pregunta: ['¿Cuál es la configuración abreviada del ', NOMBRE[z], ' (', Z, ` = ${z})?`],
      datos: [DC.orden36, DC.capacidad, DC.ar, DC.anomalia],
      opciones: opciones(abreviada(c), [
        { id: 'normal', valor: abreviada(normal), error: 'QM-ANOMALIA', siFuera: 'El orden de llenado está bien. Pero el cromo y el cobre son una excepción: un electrón del 4s pasa al 3d.' },
        { id: 'todo', valor: abreviada(quita(quita(c, '4s', -1), '3d', 1)), error: 'QM-TODO-3D', siFuera: 'Mover un electrón al 3d está bien. Pero pasa uno solo, y el 4s se queda con uno.' },
        { id: 'menos', valor: abreviada(quita(c, '3d', -1)), error: 'QM-CUENTA', siFuera: `La excepción está bien. Pero esa configuración tiene ${z - 1} electrones: cuenta de nuevo.` },
        { id: 'mas', valor: abreviada(quita(c, '4s', 1)), error: 'QM-CUENTA', siFuera: `El 3d está bien. Pero esa configuración tiene ${z + 1} electrones, porque el 4s se queda con uno.` },
      ], x => x),
      solucion: { texto: `Por el orden de llenado sería ${abreviada(normal)}, pero un electrón del 4s pasa al 3d.`, ecuacion: [abreviada(c)] },
    };
  }
  function casoNiveles(r) {
    const z = r.de([20, 25, 26, 30, 33, 35, 36, 19, 38, 48, 50, 53]), c = configNeutro(z), ll = nivelesLlenos(c);
    const ocupados = ultimoNivel(c), con8 = [1, 2, 3, 4].filter(n => n <= 2 ? n <= ll : c.filter(x => x.n === n && x.l < 2).reduce((a, x) => a + x.e, 0) === 8).length;
    return {
      pregunta: ['¿Cuántos niveles completamente llenos tiene el átomo de ', NOMBRE[z], ' (', Z, ` = ${z})?`],
      datos: [DC.orden, DC.capacidad, DC.lDe],
      opciones: opciones(ll, [
        { id: 'ocupados', valor: ocupados, error: 'QM-NIVEL-OCUPADO', siFuera: `Contar los niveles está bien. Pero el nivel ${ocupados} tiene electrones sin estar lleno.` },
        { id: 'ocho', valor: con8 !== ll ? con8 : null, error: 'QM-NIVEL-8', siFuera: 'Mirar el s y el p está bien. Pero el nivel 3 incluye el 3d, y el nivel 4, el 4d y el 4f.' },
        { id: 'menos', valor: ll - 1 >= 0 ? ll - 1 : null, error: 'QM-CUENTA', siFuera: 'Buscar los niveles llenos está bien. Revisa los de abajo: todos sus subniveles están completos.' },
        { id: 'mas', valor: ll + 2, error: 'QM-CUENTA', siFuera: 'Un nivel lleno tiene llenos todos sus subniveles, de ℓ = 0 a n − 1.' },
      ], x => `${x}`),
      solucion: { texto: `Un nivel está lleno si todos sus subniveles lo están: ${abreviada(c)}.`, ecuacion: [`${ll} ${ll === 1 ? 'nivel' : 'niveles'}`] },
    };
  }
  function casoConfig54(r) {
    const z = r.de(NEUTROS54), c = configNeutro(z), kr = c.filter(x => SUB[x.nom].i >= 8), resto = z - 36;
    const pisos = porPisos(z).filter(x => !ORDEN.slice(0, 8).some(o => o.nom === x.nom && x.e === o.cap));
    // Orden con el 5p antes que el 4d: escribe por letras dentro del piso 5.
    const p5 = []; let k = resto; for (const nom of ['5s', '5p', '4d']) { if (k <= 0) break; const cap = SUB[nom].cap, q = Math.min(cap, k); p5.push({ nom, n: SUB[nom].n, l: SUB[nom].l, e: q }); k -= q; }
    const tope = kr.length >= 2 && kr.some(x => x.nom === '4d') ? kr.map(x => (x.nom === '4d' ? Object.assign({}, x, { e: x.e + (kr.find(y => y.nom === '5p') || { e: 0 }).e }) : x)).filter(x => x.nom !== '5p') : null;
    return {
      pregunta: ['¿Cuál es la configuración abreviada del ', NOMBRE[z], ' (', Z, ` = ${z})?`],
      datos: [DC.orden, DC.capacidad, DC.kr],
      opciones: opciones(abreviada(c), [
        { id: 'pisos', valor: `[Kr] ${textoConfig(pisos.length ? pisos : [{ nom: '4d', e: resto }])}`, error: 'QM-PISO-ANTES', siFuera: 'Partir del kriptón está bien. Pero el 5s (S/ 5) cuesta menos que el 4d y el 4f, y se llena antes.' },
        { id: '5p', valor: `[Kr] ${textoConfig(p5)}`, error: 'QM-5P-ANTES', siFuera: 'Poner primero el 5s está bien. Pero el 4d y el 5p cuestan 6, y a igual precio va primero el de menor n.' },
        { id: 'tope', valor: tope && tope.find(x => x.nom === '4d').e > 10 ? `[Kr] ${textoConfig(tope)}` : null, error: 'QM-TOPE', siFuera: 'El orden está bien. Pero el 4d no pasa de 10 electrones.' },
        { id: 'mas', valor: abreviada(configNeutro(z + 1)), error: 'QM-CUENTA', siFuera: `El orden está bien. Pero esa configuración tiene ${z + 1} electrones, y el átomo tiene ${z}.` },
        { id: 'menos', valor: abreviada(configNeutro(z - 1)), error: 'QM-CUENTA', siFuera: `El orden está bien. Pero esa configuración tiene ${z - 1} electrones, y el átomo tiene ${z}.` },
      ], x => x),
      solucion: { texto: `Después de los 36 del kriptón ${resto === 1 ? 'queda 1 electrón' : `quedan ${resto} electrones`}, y se llenan el 5s, el 4d y el 5p, en ese orden.`, ecuacion: [abreviada(c)] },
    };
  }

  // Ejemplos resueltos. La figura es el hotel vacío, con sus precios: el planteamiento, sin ningún huésped puesto.
  // Cuentas rehechas aparte (scratchpad, f3/cuentas.py), contra una tabla de configuraciones escrita aparte.
  const EJEMPLOS_CONFIG = [
    { nivel: 1, titulo: 'El nitrógeno',
      enunciado: 'Escribe la configuración electrónica del nitrógeno, con 7 electrones.',
      datos: [DC.orden36, DC.capacidad],
      figura: hotelVacio(['1s', '2s', '2p']),
      solucion: [{ texto: 'Lleno en orden y sin pasar los topes: 2 en el 1s, 2 en el 2s y los 3 que quedan en el 2p.', ecuacion: ['1s² 2s² 2p³'] }],
      respuesta: ['1s² 2s² 2p³: ', Ee(7), ' electrones'] },
    { nivel: 1, titulo: '¿El 3d o el 4s?',
      enunciado: '¿Cuánto vale n + ℓ para el 3d y para el 4s? ¿Cuál se llena primero?',
      datos: [DC.letras, 'Se llena primero el subnivel de menor n + ℓ'],
      figura: hotelVacio(['3d', '4s'], { filas: [{ nombre: '3d', vacia: true, precio: '?' }, { nombre: '4s', vacia: true, precio: '?' }] }),
      solucion: [{ texto: 'El 3d tiene n = 3 y ℓ = 2, y el 4s tiene n = 4 y ℓ = 0.', ecuacion: ['3d: 3 + 2 = 5   ·   4s: 4 + 0 = 4'] }],
      respuesta: 'El 4s: cuesta 4; el 3d, 5' },
    { nivel: 1, titulo: 'El último nivel del sodio',
      enunciado: 'El sodio tiene 11 electrones. ¿Cuántos tiene en su último nivel?',
      datos: [DC.orden36, DC.capacidad, DC.valencia],
      solucion: [{ texto: 'En orden van 2 + 2 + 6 = 10 hasta el 2p, y el electrón 11 va al 3s. Queda 1s² 2s² 2p⁶ 3s¹, cuyo último nivel es el 3.', ecuacion: ['3s¹: ', Ee(1)] }],
      respuesta: [Ee(1), ' electrón'] },
    { nivel: 1, titulo: 'Qué abrevia [Ar]',
      enunciado: 'En una configuración, ¿qué reemplaza el símbolo [Ar]?',
      datos: ['Z del argón = 18', DC.orden36],
      solucion: [{ texto: 'Los 18 electrones del argón, en sus subniveles llenos: 1s² 2s² 2p⁶ 3s² 3p⁶.' }],
      respuesta: ['Los ', Ee(18), ' electrones del argón'] },
    { nivel: 1, titulo: 'El último del calcio',
      enunciado: 'El calcio tiene 20 electrones. ¿En qué subnivel entra el último?',
      datos: [DC.orden36, DC.capacidad],
      figura: hotelVacio(['3p', '4s', '3d']),
      solucion: [{ texto: 'Hasta el 3p van 18 electrones. El 19 y el 20 van al 4s, que cuesta 4, antes que el 3d, que cuesta 5.' }],
      respuesta: 'En el 4s' },
    { nivel: 2, titulo: 'El hierro',
      enunciado: 'Escribe la configuración electrónica del hierro (Z = 26).',
      datos: [DC.orden36, DC.capacidad],
      figura: hotelVacio(PASILLOS36.map(p => p.nom)),
      solucion: [
        { texto: 'Como es neutro, tiene 26 electrones. Hasta el 4s van 2 + 2 + 6 + 2 + 6 + 2 = 20.' },
        { texto: 'Los 6 que quedan van al 3d, que admite hasta 10.', ecuacion: ['1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁶'] },
      ],
      respuesta: ['1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁶: ', Ee(26), ' electrones'] },
    { nivel: 2, titulo: 'El bromo, abreviado',
      enunciado: 'Escribe la configuración abreviada del bromo (Z = 35).',
      datos: [DC.orden36, DC.capacidad, DC.ar],
      solucion: [
        { texto: 'Los primeros 18 electrones son los del argón, y quedan 35 − 18 = 17.' },
        { texto: 'De esos 17, van 2 al 4s, 10 al 3d y los 5 últimos al 4p.', ecuacion: ['[Ar] 4s² 3d¹⁰ 4p⁵'] },
      ],
      respuesta: ['[Ar] 4s² 3d¹⁰ 4p⁵: ', Ee(35), ' electrones'] },
    { nivel: 2, titulo: 'El último nivel del bromo',
      enunciado: '¿Cuántos electrones tiene el bromo (Z = 35) en su último nivel?',
      datos: [DC.orden36, DC.capacidad, DC.valencia],
      solucion: [
        { texto: 'Su configuración es [Ar] 4s² 3d¹⁰ 4p⁵, y su último nivel es el 4.' },
        { texto: 'El 3d es del nivel 3, así que no cuenta. Sumo el 4s y el 4p.', ecuacion: ['2 + 5 = ', Ee(7)] },
      ],
      respuesta: [Ee(7), ' electrones'] },
    { nivel: 2, titulo: 'El cromo',
      enunciado: 'Escribe la configuración abreviada del cromo (Z = 24).',
      datos: [DC.orden36, DC.ar, DC.anomalia],
      solucion: [
        { texto: 'Por el orden de llenado sería [Ar] 4s² 3d⁴.' },
        { texto: 'Pero el cromo es una excepción: un electrón del 4s pasa al 3d.', ecuacion: ['[Ar] 4s¹ 3d⁵'] },
      ],
      respuesta: ['[Ar] 4s¹ 3d⁵: ', Ee(24), ' electrones'] },
    { nivel: 2, titulo: 'Niveles llenos del cinc',
      enunciado: '¿Cuántos niveles completamente llenos tiene el cinc (Z = 30)?',
      datos: [DC.orden36, DC.capacidad, DC.lDe],
      solucion: [
        { texto: 'Su configuración es 1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d¹⁰.' },
        { texto: 'Los niveles 1, 2 y 3 tienen todos sus subniveles llenos, con el 3d. El nivel 4 tiene solo el 4s, así que no está lleno.' },
      ],
      respuesta: '3 niveles llenos' },
    { nivel: 3, titulo: 'El estaño',
      enunciado: '¿Cuál es la configuración abreviada del estaño (Z = 50)?',
      alternativas: ['[Kr] 4d¹⁰ 4f⁴', '[Kr] 5s² 4d¹⁰ 5p²', '[Kr] 5s² 5p⁶ 4d⁶', '[Kr] 5s² 4d¹²', '[Kr] 4d¹⁰ 5p⁴'],
      datos: [DC.orden, DC.capacidad, DC.kr],
      solucion: [
        { texto: 'Después del kriptón quedan 50 − 36 = 14: 2 al 5s, 10 al 4d y 2 al 5p.', ecuacion: ['[Kr] 5s² 4d¹⁰ 5p²'] },
        { texto: ['La ', letra('A'), ' llena el piso 4 antes que el 5s, y la ', letra('C'), ' pone el 5p antes que el 4d.'] },
        { texto: ['La ', letra('D'), ' pasa el tope del 4d, y la ', letra('E'), ' se salta el 5s.'] },
      ],
      respuesta: [letra('B'), ', [Kr] 5s² 4d¹⁰ 5p²'] },
    { nivel: 3, titulo: 'El último nivel del cobre',
      enunciado: '¿Cuántos electrones tiene el cobre (Z = 29) en su último nivel?',
      alternativas: ['2', '11', '1', '18', '10'],
      datos: [DC.orden36, DC.capacidad, DC.valencia, DC.anomalia],
      solucion: [
        { texto: 'El cobre es una excepción, [Ar] 4s¹ 3d¹⁰, y su último nivel es el 4, que solo tiene el 4s¹.' },
        { texto: ['La ', letra('A'), ' olvida la excepción (4s²), y la ', letra('B'), ' cuenta el 3d, que es del nivel 3.'] },
        { texto: ['La ', letra('D'), ' cuenta todo el nivel 3, y la ', letra('E'), ' cuenta solo el 3d.'] },
      ],
      respuesta: [letra('C'), ', ', Ee(1), ' electrón'] },
    { nivel: 3, titulo: 'Niveles llenos del bromo',
      enunciado: '¿Cuántos niveles completamente llenos tiene el bromo (Z = 35)?',
      // Ronda 2: la B decía «el nivel 3 se llena con 8», que también da 3; cada alternativa, rehecha en la prueba.
      alternativas: ['4', '2', '7', '3', '0'],
      datos: [DC.orden36, DC.capacidad, DC.lDe],
      solucion: [
        { texto: 'La configuración es [Ar] 4s² 3d¹⁰ 4p⁵, y los niveles 1, 2 y 3 están completos, con el 3d¹⁰.' },
        { texto: 'El nivel 4 no lo está: le falta un electrón al 4p y tiene vacíos el 4d y el 4f.' },
        { texto: ['La ', letra('A'), ' cuenta los niveles con electrones, y la ', letra('B'), ' deja fuera el nivel 3 porque su 3d se llenó después del 4s.'] },
        { texto: ['La ', letra('C'), ' da los electrones del último nivel, 2 + 5. La ', letra('E'), ' deja llegar ℓ hasta n, y así ningún nivel quedaría lleno.'] },
      ],
      respuesta: [letra('D'), ', 3 niveles'] },
    { nivel: 3, titulo: 'El último subnivel del yodo',
      enunciado: '¿En qué subnivel entra el último electrón del yodo (Z = 53) y cuántos hay ahí?',
      alternativas: ['4d¹⁰', '5p⁵', '5s²', '4f⁵', '5p⁷'],
      datos: [DC.orden, DC.capacidad, DC.kr],
      solucion: [
        { texto: 'Después del kriptón quedan 53 − 36 = 17: 2 al 5s, 10 al 4d y 5 al 5p.', ecuacion: ['[Kr] 5s² 4d¹⁰ 5p⁵'] },
        { texto: ['La ', letra('D'), ' llena el 4f antes que el 5p, y la ', letra('E'), ' pasa el tope del 5p, que es 6.'] },
        { texto: ['La ', letra('A'), ' y la ', letra('C'), ' se quedan en el 4d o en el 5s, que se llenan antes del 5p.'] },
      ],
      respuesta: [letra('B'), ', 5p⁵'] },
    { nivel: 3, titulo: 'Termina en 4p³',
      enunciado: 'La configuración de un átomo neutro termina en 4p³. ¿Cuál es su número atómico?',
      alternativas: ['23', '15', '21', '31', '33'],
      datos: [DC.orden36, DC.capacidad, DC.ar],
      solucion: [
        { texto: 'Antes del 4p están llenos todos los subniveles hasta el 3d: [Ar] 4s² 3d¹⁰ 4p³.' },
        { texto: 'Como el átomo es neutro, Z es la suma de sus electrones.', ecuacion: [Z, ' = 18 + 2 + 10 + 3 = ', Pz(33)] },
        { texto: ['La ', letra('A'), ' se olvida del 3d, la ', letra('B'), ' confunde el 4p con el 3p y la ', letra('C'), ' se olvida del 4s y del 3d.'] },
        { texto: ['La ', letra('D'), ' se olvida de los dos electrones del 4s.'] },
      ],
      respuesta: [letra('E'), ', ', Z, ' = ', Pz(33)] },
  ];

  const configuracion = {
    id: 'configuracion-electronica',
    titulo: 'Configuración electrónica',
    pregunta: '¿En qué orden se llenan los subniveles de un átomo?',
    temas: ['Configuración electrónica de átomos e iones'],
    pieza: 'quim-hotel',
    aprendizaje: 'Primero el subnivel de menor n + ℓ; a igual n + ℓ, el de menor n: el 4s antes que el 3d. Cr y Cu, excepción.',
    actividad: 'Llenar el hotel del electrón de uno en uno, del hidrógeno al kriptón.',
    // Lee: los precios (qué es n + ℓ, sin decir que se llena por precio), cómo se escribe y cómo se abrevia. No dice nada
    // del piso 5 (se predice).
    lee: {
      tarjetas: [
        // Ronda 2 del lector en frío: sin el empate 2p/3s (cuál va primero lo dice «Mira», paso 3, y la regla).
        { titulo: 'El precio en la puerta', texto: 'En el hotel del electrón, la puerta de cada pasillo dice su precio: n + ℓ, en soles. El 2s cuesta 2 + 0 = 2 soles, y el 2p, 2 + 1 = 3. Los huéspedes llegan al hotel de uno en uno.',
          pieza: 'quim-hotel', dibujo: hotelVacio(['1s', '2s', '2p']) },
        { titulo: 'Cómo se escribe', texto: 'La configuración electrónica dice cuántos electrones hay en cada subnivel: 1s² 2s² 2p³ es el nitrógeno, con 2 + 2 + 3 = 7. Aquí el número chico de arriba cuenta electrones, mientras que en ¹⁴C era el número de masa.' },
        { titulo: 'Abreviar y el último nivel', texto: '[Ne] reemplaza los 10 electrones del neón, 1s² 2s² 2p⁶, así que el sodio, con 11, se escribe [Ne] 3s¹. El último nivel, o capa de valencia, es el de mayor n.' },
        { titulo: 'Qué mirar', texto: 'En el juego agregas electrones de uno en uno, hasta el kriptón. Mira qué pasillo estrena cada átomo y cuánto cuesta.' },
      ],
    },
    ejemplos: EJEMPLOS_CONFIG,
    juega: {
      pieza: 'quim-hotel',
      consigna: 'Los electrones llegan al hotel de uno en uno. Cambia Z y mira qué pasillo toma cada electrón nuevo.',
      mision: {
        texto: 'Encuentra el primer átomo que estrena el pasillo 3d.',
        logrado: v => v.z === 21,
        bien: 'Es el escandio, Z = 21: el 3d (S/ 5) se abre después del 4s (S/ 4).',
      },
      voz: 'Mira el precio del pasillo que se llena.',
      leyenda: [
        { s: Z, t: 'protones; neutro, tantos electrones como protones' },
        { s: 'S/', t: 'precio del pasillo: n + ℓ' },
        { s: Ee('↑'), t: 'un electrón, un huésped' },
        { s: '□', t: 'un orbital, un cuarto doble' },
      ],
      controles: [{ id: 'z', etiqueta: 'Protones (Z)', color: 'c-o', min: 1, max: 36, paso: 1, inicio: 6, decimales: 0 }],
      dibujo: v => hotelDe(v.z, { rotulo: textoConfig(configNeutro(v.z)) }),
      // La relación: el pasillo que estrena (o completa) el último electrón y su precio; el Cr y el Cu, como excepción.
      lectura: v => {
        if (ANOMALOS[v.z]) return [`${Nombre(v.z)}, `, Z, ` = ${v.z}: excepción, un 4s pasa al 3d: 4s¹ 3d${sup(ANOMALOS[v.z]['3d'])}.`];
        const u = ultimoSub(configNeutro(v.z));
        return [`${Nombre(v.z)}, `, Z, ` = ${v.z}: su último electrón entra al ${u.nom} (S/ ${SUB[u.nom].precio}).`];
      },
      minimo: 4,
    },
    predice: {
      pieza: 'quim-hotel',
      pregunta: 'El kriptón llenó el hotel hasta el 4p. El rubidio tiene un electrón más. ¿Adónde va el electrón 37?',
      datos: ['Kriptón (Z = 36): 1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d¹⁰ 4p⁶', 'Rubidio: Z = 37', 'Al piso 4 le quedan el 4d y el 4f; el piso 5 empieza con el 5s'],
      voz: 'Calcula el precio de cada pasillo con sitio.',
      opciones: [
        { id: 'c', texto: 'Al 5s', correcta: true },
        { id: '4d', texto: 'Al 4d: el piso 4 todavía tiene sitio', error: 'QM-PISO-ANTES', siFuera: 'Es cierto que el piso 4 tiene sitio en el 4d. Pero el 4d cuesta S/ 6, y el 5s, solo S/ 5.' },
        { id: '4f', texto: 'Al 4f', error: 'QM-PASILLO-NUEVO', siFuera: 'Buscar un pasillo con sitio está bien. Pero el 4f cuesta S/ 7, y hay pasillos con sitio más baratos.' },
        { id: 'lleno', texto: 'A ninguno: el kriptón ya está lleno', error: 'QM-LLENO-NO-ENTRA', siFuera: 'Es cierto que lo que ocupa el kriptón está lleno. Pero más arriba hay pasillos con sitio para el electrón 37.' },
      ],
      dibujo: HOTEL([{ nombre: '4s', e: 2 }, { nombre: '4p', e: 6 }, { nombre: '4d', e: 0, vacia: true, precio: '?' }, { nombre: '4f', e: 0, vacia: true, precio: '?' }, { nombre: '5s', e: 0, vacia: true, precio: '?' }],
        { precios: true, rotulo: 'Rb: ¿adónde va el electrón 37?' }),
      revelar: HOTEL([{ nombre: '4s', e: 2 }, { nombre: '4p', e: 6 }, { nombre: '4d', e: 0, vacia: true }, { nombre: '4f', e: 0, vacia: true }, { nombre: '5s', e: 1 }],
        { precios: true, rotulo: 'Rb: [Kr] 5s¹. El 5s cuesta menos.' }),
      coincide: 'Coincide: el 5s cuesta 5 + 0 = 5, y el 4d, 4 + 2 = 6.',
      noCoincide: 'El 5s cuesta 5 + 0 = 5 soles y el 4d, 4 + 2 = 6: va al 5s.',
    },
    mira: {
      pieza: 'quim-hotel',
      datos: { precios: true, filas: [['1s', 1], ['2s', 2], ['2p', 3], ['3s', 3], ['3p', 4], ['4s', 4], ['3d', 5], ['4p', 5]].map(([nombre, desde]) => ({ nombre, e: SUB[nombre].cap, desde })) },
      voz: 'Llenemos el hotel del más barato al más caro.',
      pasos: [
        { estado: { corte: 1 }, texto: 'El 1s cuesta 1 + 0 = 1: es el más barato y se llena primero.' },
        { estado: { corte: 2 }, texto: 'El 2s cuesta 2 + 0 = 2, así que es el segundo en llenarse.' },
        { estado: { corte: 3 }, texto: 'El 2p y el 3s cuestan 3; a igual precio, se llena primero el de menor n, que es el 2p.', ecuacion: ['2p: 2 + 1 = 3   ·   3s: 3 + 0 = 3'] },
        { estado: { corte: 4 }, texto: 'El 3p y el 4s cuestan 4, y el 3d cuesta 5: por eso el 4s se llena antes que el 3d.', ecuacion: ['4s: 4 + 0 = 4   ·   3d: 3 + 2 = 5'] },
        { estado: { corte: 5 }, texto: 'El 3d y el 4p cuestan 5, y se llena primero el 3d, que tiene menor n.' },
        { estado: { corte: 5 }, texto: '[Ar] abrevia los 18 electrones del argón, y el último nivel es el de mayor n.', ecuacion: ['[Ar] = 1s² 2s² 2p⁶ 3s² 3p⁶'] },
        { estado: { corte: 5 }, texto: 'En el cromo y el cobre, un electrón del 4s pasa al 3d, que queda con 5 o con 10.', ecuacion: ['Cr: [Ar] 4s¹ 3d⁵   ·   Cu: [Ar] 4s¹ 3d¹⁰'] },
      ],
    },
    regla: {
      // Ronda 2 del lector en frío: cómo quedan el Cr y el Cu (en el texto) y por qué (en la voz de Bruna).
      texto: 'Se llena primero el subnivel de menor n + ℓ y, a igual n + ℓ, el de menor n. El cromo y el cobre pasan un electrón del 4s al 3d, y quedan 3d⁵ (medio lleno) y 3d¹⁰ (lleno).',
      ecuacion: ['1s → 2s → 2p → 3s → 3p → 4s → 3d → 4p → 5s → 4d → 5p'],
      condicion: 'el átomo es neutro y está en su estado de menor energía.',
      voz: 'Un 3d medio lleno o lleno es más estable: por eso cambian Cr y Cu.',
      dibujo: { pieza: 'quim-hotel', datos: { precios: true, filas: PASILLOS36.map(p => ({ nombre: p.nom, e: p.cap })) } },
    },
    // Así se resuelve: la configuración completa de un átomo neutro del cuarto piso (Z de 21 a 36), del mismo tipo que
    // el primer «Ahora tú», con otras semillas; las cuentas, del mismo configNeutro.
    resuelve: {
      pieza: 'quim-hotel',
      generar(s) {
        const z = azar(s + 900).de(NEUTROS36), c = configNeutro(z), hasta = c.filter(x => x.nom !== ultimoSub(c).nom);
        return {
          enunciado: ['¿Cuál es la configuración electrónica del ', NOMBRE[z], ' (', Z, ` = ${z})?`],
          datos: [DC.orden36, DC.capacidad],
          dibujo: hotelVacio(PASILLOS36.map(p => p.nom)),
          pasos: [
            { tipo: 'pide', texto: `Piden cómo se reparten los electrones del ${NOMBRE[z]} neutro entre los subniveles.` },
            { tipo: 'datos', texto: ['Como el átomo es neutro, tiene tantos electrones como protones: ', Z, ` = ${z}.`], ecuacion: [e, ' = ', Ee(z)] },
            { tipo: 'regla', texto: 'Lleno en el orden de llenado, sin pasar los topes: 2 en un s, 6 en un p, 10 en un d.' },
            { tipo: 'cuentas', texto: `Hasta el ${hasta[hasta.length - 1].nom} van ${totalE(hasta)} electrones, y ${z - totalE(hasta) === 1 ? 'el que queda entra' : `los ${z - totalE(hasta)} que quedan entran`} al ${ultimoSub(c).nom}.`, ecuacion: [textoConfig(c)], dibujo: hotelDe(z) },
            { tipo: 'sentido', texto: `Para comprobar: ${c.map(x => x.e).join(' + ')} = ${totalE(c)}, que son los electrones del átomo neutro.` },
          ],
          respuesta: textoConfig(c),
        };
      },
    },
    ahoraTu: {
      pieza: 'quim-hotel',
      voz: 'Cuenta primero los electrones del átomo.',
      generar(s) {
        const r = azar(s + 17), tipo = s % 6;
        return [casoConfig20, casoUltimoSub, casoValencia, casoAnomala, casoNiveles, casoConfig54][tipo](r);
      },
    },
  };

  // ---------- Idea 5 (fase 3, 18 nov): configuración de los iones ----------
  // Objeto: el salero con sal de Maras (Na⁺ y Cl⁻) y sus cajas; en la predicción, el frasco de sulfato ferroso (Fe²⁺), un
  // suplemento de hierro (quim-objeto, dibujos de prueba). No se dice quién lo da: la norma del MINSA no se pudo
  // confirmar en esta sesión (propuesta §10).
  // Cambia: el elemento (Z ≤ 20) y su carga · Permanece: las cajas del átomo neutro, con lo que sale punteado y lo que
  // llega sombreado · Progresa: de contar electrones a ver de qué subnivel salen · Se reserva: los cationes con d (el
  // Fe²⁺ se predice) · Debe verse: el anión suma en el orden de llenado; el catión pierde los del nivel más alto.
  // Errores (hipótesis): QM-ULTIMO (el último en entrar sale primero: la trampa de San Marcos 2024-II y 2027-I),
  // QM-REPARTE, QM-CARGA-E, QM-CARGA-SIGNO, QM-S-PRIMERO (saca el s aunque haya un p del mismo nivel), QM-ISO-Z y QM-CUENTA.
  const OBJ_CAJAS = (objeto, cajas, o) => ({ pieza: 'quim-objeto', datos: Object.assign({ objeto, cajas: Object.assign({ paleta: 'zne' }, cajas) }, o || {}), estado: {} });
  // Las cajas de una especie junto a las del átomo neutro: lo que sale, punteado; lo que llega, sombreado.
  function filasIon(z, q) {
    const neutro = configNeutro(z), ion = configEspecie(z, q), noms = ordenar(neutro.concat(ion.filter(x => !neutro.some(y => y.nom === x.nom))).map(x => Object.assign({}, x)));
    return noms.map(x => {
      const a = (neutro.find(y => y.nom === x.nom) || { e: 0 }).e, b = (ion.find(y => y.nom === x.nom) || { e: 0 }).e;
      return { nombre: x.nom, cajas: 2 * x.l + 1, e: Math.max(a, b), sale: Math.max(0, a - b), llega: Math.max(0, b - a) };
    });
  }
  const textoIon = c => (totalE(c) > 10 ? abreviada(c) : textoConfig(c));
  const gasDe = n => GAS_NOMBRE[n];
  const juegoSal = v => {
    const el = v.z - v.q;
    if (el < 0) return OBJ_CAJAS('salero', { filas: filasDe(configNeutro(v.z)).map(f => Object.assign(f, { sale: f.e })), rotulo: `${SIMB[v.z]} no tiene tantos electrones` });
    return OBJ_CAJAS('salero', { filas: filasIon(v.z, v.q), rotulo: el ? `${SIMB_Q(v.z, v.q)}: ${textoIon(configEspecie(v.z, v.q))}` : `${SIMB_Q(v.z, v.q)}: sin electrones` });
  };
  const ANIONES20 = [[8, -2], [9, -1], [16, -2], [17, -1], [7, -3], [15, -3]];
  const CATIONES20 = [[11, 1], [12, 2], [13, 3], [19, 1], [20, 2], [3, 1], [4, 2]];
  const CATIONES_D = [[26, 2], [26, 3], [27, 2], [27, 3], [28, 2], [25, 2], [29, 1], [29, 2], [30, 2], [24, 3], [22, 2], [23, 3]];
  const IONES54 = [[50, 2], [50, 4], [48, 2], [38, 2], [39, 3], [49, 3], [51, 3], [52, -2], [35, -1]];
  // Distractores de la configuración de un catión con d: el último en entrar sale primero, se reparte, el neutro.
  function quitarUltimo(z, q) { const c = configNeutro(z).map(x => Object.assign({}, x)); for (let k = 0; k < q; k++) { const u = ordenar(c.filter(x => x.e > 0)); u[u.length - 1].e -= 1; } return ordenar(c.filter(x => x.e > 0)); }
  function quitarS(z, q) { const c = configNeutro(z).map(x => Object.assign({}, x)); for (let k = 0; k < q; k++) { const v = c.filter(x => x.e > 0).sort((a, b) => b.n - a.n || a.l - b.l)[0]; v.e -= 1; } return ordenar(c.filter(x => x.e > 0)); }
  function casoIon20(r, lista, anion) {
    const [z, q] = r.de(lista), c = configEspecie(z, q), sim = SIMB_Q(z, q);
    return {
      pregunta: ['¿Cuál es la configuración electrónica del ion ', sim, '?'],
      datos: [`Z del ${NOMBRE[z]} = ${z}`, DC.carga, DC.orden36, DC.capacidad],
      opciones: opciones(textoConfig(c), [
        { id: 'neutro', valor: textoConfig(configNeutro(z)), error: 'QM-CARGA-E', siFuera: `Esa es la configuración del átomo neutro, bien escrita. Pero el ion ${anion ? 'ganó' : 'perdió'} ${Math.abs(q)} ${Math.abs(q) === 1 ? 'electrón' : 'electrones'}.` },
        { id: 'signo', valor: z + q > 0 ? textoConfig(configEspecie(z, -q)) : null, error: 'QM-CARGA-SIGNO', siFuera: 'Usar la carga está bien, pero la aplicaste al revés: con carga positiva faltan electrones, y con carga negativa sobran.' },
        { id: 'menos', valor: c.length ? textoConfig(config(totalE(c) - 1)) : null, error: 'QM-CUENTA', siFuera: `El orden está bien. Pero esa configuración tiene ${totalE(c) - 1} ${totalE(c) - 1 === 1 ? 'electrón' : 'electrones'}, y el ${sim} tiene ${totalE(c)}.` },
        { id: 'mas', valor: textoConfig(config(totalE(c) + 1)), error: 'QM-CUENTA', siFuera: `El orden está bien. Pero esa configuración tiene ${totalE(c) + 1} electrones, y el ${sim} tiene ${totalE(c)}.` },
      ], x => x),
      solucion: { texto: `El ${sim} tiene ${z} − (${signo(q)}) = ${totalE(c)} electrones, repartidos en el orden de llenado.`, ecuacion: [textoConfig(c)] },
    };
  }
  function casoCationD(r) {
    const [z, q] = r.de(CATIONES_D), c = configEspecie(z, q), sim = SIMB_Q(z, q), n = configNeutro(z);
    return {
      pregunta: ['¿Cuál es la configuración abreviada del ion ', sim, '?'],
      datos: [`${Nombre(z)} (Z = ${z}): ${abreviada(n)}`, DC.ar, DC.carga],
      opciones: opciones(abreviada(c), [
        { id: 'ultimo', valor: abreviada(quitarUltimo(z, q)), error: 'QM-ULTIMO', siFuera: 'Quitar electrones está bien. Pero no sale el último en entrar: salen primero los del 4s, el nivel más alto.' },
        { id: 'neutro', valor: abreviada(n), error: 'QM-CARGA-E', siFuera: `Esa es la configuración del átomo neutro, y con carga ${signo(q)} ${q === 1 ? 'salió 1 electrón' : `salieron ${q} electrones`}.` },
        { id: 'menos', valor: abreviada(configEspecie(z, q + 1)), error: 'QM-CUENTA', siFuera: `El orden de salida está bien. Pero quitaste ${q + 1}, y la carga ${signo(q)} dice ${q}.` },
        { id: 'mas', valor: q > 1 ? abreviada(configEspecie(z, q - 1)) : null, error: 'QM-CUENTA', siFuera: `El orden de salida está bien. Pero quitaste ${q - 1}, y la carga ${signo(q)} dice ${q}.` },
        { id: 'reparte', valor: abreviada(configEspecie(z, q - 1).map(x => (x.nom === '3d' ? Object.assign({}, x, { e: x.e - 1 }) : x)).filter(x => x.e > 0)), error: 'QM-REPARTE', siFuera: 'Sacar del 4s está bien. Pero salen todos los electrones del 4s antes de tocar el 3d.' },
      ], x => x),
      solucion: { texto: `${q === 1 ? 'Sale 1 electrón' : `Salen ${q} electrones`}: primero los del 4s, el nivel más alto, y después, si faltan, los del 3d.`, ecuacion: [`${sim}: ${abreviada(c)}`] },
    };
  }
  function casoIsoZ(r) {
    const [z, q] = r.de(CATIONES_D.filter(([, qq]) => qq >= 2)), c = configEspecie(z, q), el = totalE(c);
    return {
      pregunta: [`El ion X${carga(q)} tiene la configuración ${abreviada(c)}. ¿Cuál es el número atómico de X?`],
      datos: [DC.ar, DC.carga],
      opciones: opciones(z, [
        { id: 'e', valor: el, error: 'QM-ISO-Z', siFuera: `Contar ${el} electrones está bien. Pero X tiene carga ${signo(q)}, así que tiene más protones que electrones.` },
        { id: 'signo', valor: el - q, error: 'QM-CARGA-SIGNO', siFuera: `Partir de ${el} electrones está bien. Revisa el signo: la carga es Z menos los electrones.` },
        { id: 'cuatro', valor: el + q + 2, error: 'QM-ULTIMO', siFuera: 'La carga está bien usada. Pero los electrones se cuentan en la configuración dada, sin agregarle un 4s.' },
        { id: 'ar', valor: el - 18, error: 'QM-CUENTA', siFuera: 'Esos son los electrones que siguen al argón. Pero [Ar] también cuenta, y son 18 electrones más.' },
      ], x => `${x}`),
      solucion: { texto: `${abreviada(c)} tiene 18 + ${el - 18} = ${el} electrones, y X tiene ${q} protones más que electrones.`, ecuacion: [Z, ` = ${el} + ${q} = `, Pz(z)] },
    };
  }
  function casoElectronesD(r) {
    const [z, q] = r.de(CATIONES_D), c = configEspecie(z, q), d = (c.find(x => x.nom === '3d') || { e: 0 }).e, n = configNeutro(z), dn = (n.find(x => x.nom === '3d') || { e: 0 }).e;
    const ul = (quitarUltimo(z, q).find(x => x.nom === '3d') || { e: 0 }).e;
    return {
      pregunta: ['¿Cuántos electrones tiene en su subnivel 3d el ion ', SIMB_Q(z, q), '?'],
      datos: [`Z del ${NOMBRE[z]} = ${z}`, DC.orden36, DC.capacidad, DC.anomalia],
      opciones: opciones(d, [
        { id: 'ultimo', valor: ul, error: 'QM-ULTIMO', siFuera: 'Quitar los electrones que pide la carga está bien. Pero salen primero los del 4s, no los del 3d.' },
        { id: 'neutro', valor: dn, error: 'QM-CARGA-E', siFuera: `Esos son los electrones 3d del átomo neutro. Con carga ${signo(q)}, ${dn !== d ? 'después del 4s también sale alguno del 3d' : 'cambia el 4s, no el 3d'}.` },
        { id: 'mas', valor: d + 1, error: 'QM-CUENTA', siFuera: 'El orden de salida está bien. Revisa cuántos electrones salen: lo dice la carga.' },
        { id: 'menos', valor: d - 1 >= 0 ? d - 1 : null, error: 'QM-CUENTA', siFuera: 'El orden de salida está bien. Revisa cuántos electrones salen: lo dice la carga.' },
      ], x => `${x}`),
      solucion: { texto: `El ${NOMBRE[z]} neutro es ${abreviada(n)}, y con carga ${signo(q)} salen primero los electrones del 4s.`, ecuacion: [`${SIMB_Q(z, q)}: ${abreviada(c)}   ·   3d: `, Ee(d)] },
    };
  }
  function casoIon54(r) {
    const [z, q] = r.de(IONES54), c = configEspecie(z, q), sim = SIMB_Q(z, q);
    const dis = q > 0 ? [
      { id: 'ultimo', valor: abreviada(quitarUltimo(z, q)), error: 'QM-ULTIMO', siFuera: 'Quitar electrones está bien. Pero salen primero los de mayor n, no los últimos en entrar.' },
      { id: 's', valor: abreviada(quitarS(z, q)), error: 'QM-S-PRIMERO', siFuera: 'Sacar del nivel 5 está bien. Pero a igual n sale primero el de mayor ℓ: el 5p antes que el 5s.' },
    ] : [{ id: 'signo', valor: abreviada(configEspecie(z, -q)), error: 'QM-CARGA-SIGNO', siFuera: 'Usar la carga está bien, pero la aplicaste al revés: con carga negativa sobran electrones.' }];
    return {
      pregunta: ['¿Cuál es la configuración abreviada del ion ', sim, ' (', Z, ` = ${z})?`],
      datos: [DC.orden, DC.capacidad, DC.kr, DC.carga],
      opciones: opciones(abreviada(c), dis.concat([
        { id: 'neutro', valor: abreviada(configNeutro(z)), error: 'QM-CARGA-E', siFuera: `Esa es la configuración del átomo neutro, y con carga ${signo(q)} ${Math.abs(q) === 1 ? (q > 0 ? 'salió 1 electrón' : 'llegó 1 electrón') : `${q > 0 ? 'salieron' : 'llegaron'} ${Math.abs(q)} electrones`}.` },
        { id: 'mas', valor: z - q + 1 <= 54 ? abreviada(configEspecie(z, q - 1)) : null, error: 'QM-CUENTA', siFuera: `El orden está bien. Pero esa configuración tiene un electrón más que el ${sim}.` },
        { id: 'menos', valor: abreviada(configEspecie(z, q + 1)), error: 'QM-CUENTA', siFuera: `El orden está bien. Pero esa configuración tiene un electrón menos que el ${sim}.` },
      ]), x => x),
      solucion: { texto: q > 0 ? `Salen ${q} electrones: primero los de mayor n y, a igual n, los de mayor ℓ.` : `${-q === 1 ? 'Llega 1 electrón, que entra' : `Llegan ${-q} electrones, que entran`} en el orden de llenado.`, ecuacion: [`${sim}: ${abreviada(c)}`] },
    };
  }

  // Ejemplos resueltos. La figura muestra el objeto y las cajas del átomo neutro (el planteamiento); lo que sale o llega
  // no se dibuja. Cuentas rehechas aparte (scratchpad, f3/cuentas.py).
  const EJEMPLOS_IONES = [
    { nivel: 1, titulo: 'El Mg²⁺',
      enunciado: 'Escribe la configuración electrónica del ion Mg²⁺.',
      datos: ['Z del magnesio = 12', DC.carga, DC.orden36, DC.capacidad],
      solucion: [{ texto: 'El ion tiene 12 − 2 = 10 electrones, que se reparten en el orden de llenado.', ecuacion: ['Mg²⁺: 1s² 2s² 2p⁶'] }],
      respuesta: ['1s² 2s² 2p⁶: ', Ee(10), ' electrones'] },
    { nivel: 1, titulo: 'El cloruro de la sal',
      enunciado: 'En la sal de Maras, el cloro está como Cl⁻. Escribe la configuración del Cl⁻.',
      datos: ['Z del cloro = 17', DC.carga, DC.orden36, DC.capacidad],
      figura: OBJ_CAJAS('salero', { filas: filasDe(configNeutro(17)), rotulo: 'Cl: 1s² 2s² 2p⁶ 3s² 3p⁵' }),
      solucion: [{ texto: 'El ion tiene 17 − (−1) = 18 electrones, y el que llega completa el 3p.', ecuacion: ['Cl⁻: 1s² 2s² 2p⁶ 3s² 3p⁶'] }],
      respuesta: ['1s² 2s² 2p⁶ 3s² 3p⁶: ', Ee(18), ' electrones'] },
    { nivel: 1, titulo: '¿Catión o anión?',
      enunciado: 'El ion S²⁻, ¿es un catión o un anión? ¿Ganó o perdió electrones?',
      datos: [DC.carga, 'Catión: ion positivo. Anión: ion negativo'],
      solucion: [{ texto: 'Como la carga, Z − e⁻, es −2, el ion tiene 2 electrones más que protones: es un anión que ganó 2.' }],
      respuesta: ['Anión: ganó ', Ee(2), ' electrones'] },
    { nivel: 1, titulo: 'De dónde sale el del K⁺',
      enunciado: 'El potasio es [Ar] 4s¹. Al formar K⁺, ¿de qué subnivel sale su electrón?',
      datos: [DC.ar, DC.carga],
      figura: CAJAS([{ nombre: '3p', e: 6, cajas: 3 }, { nombre: '4s', e: 1, cajas: 1 }], { rotulo: 'K: [Ar] 4s¹' }),
      solucion: [{ texto: 'Sale del nivel más alto, el 4, es decir, del 4s. Quedan 18 electrones, 1s² 2s² 2p⁶ 3s² 3p⁶, como en el argón.' }],
      respuesta: 'Del 4s: queda como el argón' },
    { nivel: 1, titulo: 'Na⁺ y el neón',
      enunciado: '¿Tienen la misma configuración el ion Na⁺ y el átomo de neón?',
      datos: ['Z del sodio = 11; Z del neón = 10', DC.carga, DC.orden36],
      solucion: [{ texto: 'El Na⁺ tiene 11 − 1 = 10 electrones, igual que el neón. Los dos son 1s² 2s² 2p⁶: son isoelectrónicos.' }],
      respuesta: ['Sí: los dos tienen ', Ee(10), ' electrones, 1s² 2s² 2p⁶'] },
    { nivel: 2, titulo: 'El Fe³⁺',
      enunciado: 'Escribe la configuración abreviada del ion Fe³⁺.',
      datos: ['Z del hierro = 26', DC.orden36, DC.ar, DC.carga],
      figura: OBJ_CAJAS('frasco', { filas: filasDe(configNeutro(26)).slice(-2), rotulo: 'Fe: [Ar] 4s² 3d⁶' }),
      solucion: [
        { texto: 'El hierro neutro es [Ar] 4s² 3d⁶, y la carga +3 dice que salen 3 electrones.' },
        { texto: 'Salen primero los dos del 4s, y el tercero sale del 3d.', ecuacion: ['Fe³⁺: [Ar] 3d⁵'] },
      ],
      respuesta: ['[Ar] 3d⁵: ', Ee(23), ' electrones'] },
    { nivel: 2, titulo: 'El Zn²⁺',
      enunciado: 'Escribe la configuración abreviada del ion Zn²⁺.',
      datos: ['Z del cinc = 30', DC.orden36, DC.ar, DC.carga],
      solucion: [
        { texto: 'El cinc neutro tiene 30 electrones: [Ar] 4s² 3d¹⁰.' },
        { texto: 'Con carga +2 salen los dos electrones del 4s, el nivel más alto.', ecuacion: ['Zn²⁺: [Ar] 3d¹⁰'] },
      ],
      respuesta: ['[Ar] 3d¹⁰: ', Ee(28), ' electrones'] },
    { nivel: 2, titulo: 'El Cu⁺',
      enunciado: 'Escribe la configuración abreviada del ion Cu⁺.',
      datos: ['Z del cobre = 29', DC.orden36, DC.ar, DC.anomalia, DC.carga],
      solucion: [
        { texto: 'El cobre es una excepción: [Ar] 4s¹ 3d¹⁰, con 18 + 1 + 10 = 29.' },
        { texto: 'Con carga +1 sale el único electrón del 4s, que es el nivel más alto.', ecuacion: ['Cu⁺: [Ar] 3d¹⁰'] },
      ],
      respuesta: ['[Ar] 3d¹⁰: ', Ee(28), ' electrones'] },
    { nivel: 2, titulo: 'Con la configuración del argón',
      enunciado: '¿Cuántos de estos iones tienen la configuración del argón: K⁺, Ca²⁺, Na⁺, Cl⁻ y S²⁻?',
      datos: ['Z: sodio 11, azufre 16, cloro 17, argón 18, potasio 19, calcio 20', DC.carga],
      solucion: [
        { texto: 'El argón tiene 18 electrones. Cuento los de cada ion con su carga.', ecuacion: ['K⁺: ', Ee(18), '   ·   Ca²⁺: ', Ee(18), '   ·   Na⁺: ', Ee(10), '   ·   Cl⁻: ', Ee(18), '   ·   S²⁻: ', Ee(18)] },
        { texto: 'Los que tienen 18 electrones, llenados en el mismo orden, tienen la configuración del argón; el Na⁺, con 10, no la tiene.' },
      ],
      respuesta: 'Cuatro: K⁺, Ca²⁺, Cl⁻ y S²⁻' },
    { nivel: 2, titulo: 'El Mn²⁺',
      enunciado: 'Escribe la configuración abreviada del ion Mn²⁺.',
      datos: ['Z del manganeso = 25', DC.orden36, DC.ar, DC.carga],
      solucion: [
        { texto: 'El manganeso neutro tiene 25 electrones: [Ar] 4s² 3d⁵.' },
        { texto: 'Con carga +2 salen los dos electrones del 4s.', ecuacion: ['Mn²⁺: [Ar] 3d⁵'] },
      ],
      respuesta: ['[Ar] 3d⁵: ', Ee(23), ' electrones'] },
    { nivel: 3, titulo: 'El catión del cromo',
      enunciado: '¿Cuál es la configuración del ion Cr³⁺?',
      alternativas: ['[Ar] 4s² 3d¹', '[Ar] 3d³', '[Ar] 4s¹ 3d²', '[Ar] 4s² 3d⁴', '[Ar] 3d⁶'],
      datos: ['Z del cromo = 24', DC.orden36, DC.ar, DC.anomalia],
      solucion: [
        { texto: 'El cromo es una excepción, [Ar] 4s¹ 3d⁵, y con carga +3 salen 3 electrones.' },
        { texto: 'Sale primero el único 4s, y después salen dos del 3d.', ecuacion: ['Cr³⁺: [Ar] 3d³'] },
        { texto: ['La ', letra('A'), ' olvida la excepción y saca tres del 3d, y la ', letra('D'), ' es el cromo neutro sin ella. La ', letra('C'), ' deja el 4s y saca tres del 3d, y la ', letra('E'), ' no quita ninguno: pasa el 4s al 3d.'] },
      ],
      respuesta: [letra('B'), ', [Ar] 3d³'] },
    { nivel: 3, titulo: 'El ion del cobalto',
      enunciado: '¿Cuál es la configuración del ion Co²⁺?',
      alternativas: ['[Ar] 3d⁷', '[Ar] 4s² 3d⁵', '[Ar] 4s¹ 3d⁶', '[Ar] 4s² 3d⁷', '[Ar] 3d⁹'],
      datos: ['Z del cobalto = 27', DC.orden36, DC.ar, DC.carga],
      solucion: [
        { texto: 'El cobalto neutro es [Ar] 4s² 3d⁷, y con carga +2 salen los dos electrones del 4s.', ecuacion: ['Co²⁺: [Ar] 3d⁷'] },
        { texto: ['La ', letra('B'), ' saca del 3d, el último en entrar, y la ', letra('C'), ' saca uno de cada uno. La ', letra('D'), ' es el átomo neutro, y la ', letra('E'), ' pasa los 4s al 3d sin quitar ninguno.'] },
      ],
      respuesta: [letra('A'), ', [Ar] 3d⁷'] },
    { nivel: 3, titulo: 'El X²⁺ con 3d⁸',
      enunciado: 'El ion X²⁺ tiene la configuración [Ar] 3d⁸. ¿Cuál es el número atómico de X?',
      alternativas: ['26', '24', '28', '30', '18'],
      datos: [DC.ar, DC.carga],
      solucion: [
        { texto: 'El ion tiene 18 + 8 = 26 electrones.' },
        { texto: 'Con carga +2, tiene 2 protones más que electrones.', ecuacion: [Z, ' = 26 + 2 = ', Pz(28)] },
        { texto: ['La ', letra('A'), ' toma Z igual a los electrones, la ', letra('B'), ' resta la carga y la ', letra('E'), ' cuenta solo el argón.'] },
        { texto: ['La ', letra('D'), ' cuenta dos veces los que salieron: suma los dos 4s y, además, la carga.'] },
      ],
      respuesta: [letra('C'), ', ', Z, ' = ', Pz(28)] },
    { nivel: 3, titulo: 'Los 3d del Fe²⁺ y Fe³⁺',
      enunciado: '¿Cuántos electrones 3d tienen el Fe²⁺ y el Fe³⁺, en ese orden?',
      alternativas: ['4 y 3', '6 y 6', '8 y 9', '6 y 5', '5 y 4'],
      datos: ['Z del hierro = 26', DC.orden36, DC.carga],
      solucion: [
        { texto: 'Hierro: [Ar] 4s² 3d⁶. El Fe²⁺ pierde los dos 4s: le quedan 6 en el 3d.' },
        { texto: 'El Fe³⁺ pierde uno más, ya del 3d: le quedan 5.' },
        { texto: ['La ', letra('A'), ' saca primero del 3d: 6 − 2 y 6 − 3. La ', letra('B'), ' no toca el 3d en el Fe³⁺, como si el 4s tuviera tres.'] },
        { texto: ['La ', letra('C'), ' suma la carga en vez de quitarla: 6 + 2 y 6 + 3. La ', letra('E'), ' saca un solo 4s y el resto del 3d: 6 − 1 y 6 − 2.'] },
      ],
      respuesta: [letra('D'), ', ', Ee(6), ' y ', Ee(5)] },
    { nivel: 3, titulo: 'El ion del estaño',
      enunciado: '¿Cuál es la configuración del ion Sn²⁺? El estaño tiene Z = 50.',
      alternativas: ['[Kr] 4d¹⁰ 5p²', '[Kr] 5s² 4d⁸', '[Kr] 5s² 4d¹⁰', '[Kr] 5s² 4d¹⁰ 5p²', '[Kr] 4d¹⁰'],
      datos: [DC.orden, DC.capacidad, DC.kr, DC.carga],
      solucion: [
        { texto: 'El estaño neutro es [Kr] 5s² 4d¹⁰ 5p², y su nivel más alto es el 5, con el 5s y el 5p.' },
        { texto: 'A igual n sale primero el de mayor ℓ, así que salen los dos 5p.', ecuacion: ['Sn²⁺: [Kr] 5s² 4d¹⁰'] },
        { texto: ['La ', letra('A'), ' saca el 5s, y la ', letra('B'), ' saca del 4d. La ', letra('D'), ' es el átomo neutro, y la ', letra('E'), ' saca cuatro: los dos 5p y los dos 5s.'] },
      ],
      respuesta: [letra('C'), ', [Kr] 5s² 4d¹⁰'] },
  ];

  const configIones = {
    id: 'configuracion-iones',
    titulo: 'Configuración de los iones',
    pregunta: '¿De qué subnivel salen los electrones cuando un átomo se vuelve un ion positivo?',
    temas: ['Configuración electrónica de átomos e iones', 'Paramagnetismo y especies isoelectrónicas'],
    pieza: 'quim-objeto',
    aprendizaje: 'Un anión suma electrones en el orden de llenado. Un catión pierde primero los del nivel más alto: el Fe²⁺ pierde sus 4s.',
    actividad: 'Cambiar la carga del sodio, del cloro y de otros, y mirar sus cajas.',
    // Lee: la sal de Maras, los nombres catión y anión y contar primero. No dice nada de los iones con d (se predice).
    lee: {
      tarjetas: [
        { titulo: 'La sal de Maras', texto: 'En las salineras de Maras, en el Cusco, se saca sal: cloruro de sodio. En esa sal, el sodio está como ion Na⁺ y el cloro como ion Cl⁻. Un ion positivo se llama catión, y uno negativo, anión.',
          pieza: 'quim-objeto', dibujo: OBJ_CAJAS('salero', { filas: filasDe(configNeutro(11)), rotulo: 'Na: 1s² 2s² 2p⁶ 3s¹' }) },
        { titulo: 'Primero, contar', texto: 'Antes de escribir la configuración de un ion, cuenta sus electrones con la carga: e⁻ = Z − carga. El Cl⁻ tiene 17 − (−1) = 18, y después esos electrones se reparten en los subniveles.' },
        { titulo: 'Qué mirar', texto: 'En el juego eliges el elemento y su carga. Mira de qué subnivel salen los electrones cuando la carga es positiva, y adónde llegan cuando es negativa.' },
      ],
    },
    ejemplos: EJEMPLOS_IONES,
    juega: {
      pieza: 'quim-objeto',
      consigna: 'En la sal de Maras, el sodio está como Na⁺ y el cloro como Cl⁻. Cambia el elemento y su carga.',
      mision: {
        texto: 'Deja al sodio con la misma configuración que el neón.',
        logrado: v => v.z === 11 && v.q === 1,
        bien: 'El Na⁺ y el neón tienen 10 electrones y las mismas cajas: son isoelectrónicos.',
      },
      voz: 'Cambia la carga y mira qué caja cambia.',
      leyenda: [
        { s: Z, t: 'protones del núcleo: el elemento' },
        { s: Qc('carga'), t: 'protones menos electrones' },
        { s: Ee('↑'), t: 'un electrón' },
        { s: 'punteada', t: 'flecha punteada: el electrón se fue' },
        { s: Ee('sombra'), t: 'fondo violeta: el electrón llegó' },
        { s: '[Ne]', t: 'los 10 electrones del neón' },
        { s: '[Ar]', t: 'los 18 electrones del argón' },
      ],
      controles: [
        // Ronda 2 del lector en frío: arranca en el sodio neutro, el de la misión (antes, en el cloro).
        { id: 'z', etiqueta: 'Protones (Z)', color: 'c-o', min: 1, max: 20, paso: 1, inicio: 11, decimales: 0 },
        { id: 'q', etiqueta: 'Carga', color: 'c-h', min: -3, max: 3, paso: 1, inicio: 0, decimales: 0 },
      ],
      dibujo: v => juegoSal(v),
      // La relación: protones y electrones de la especie, su configuración y, si coincide, el gas noble que imita.
      lectura: v => {
        const el = v.z - v.q, sim = SIMB_Q(v.z, v.q);
        if (el < 0) return [`El ${NOMBRE[v.z]} no tiene ${v.q} electrones que perder.`];
        if (el === 0) return [sim, ': ', Pz(`${v.z} p⁺`), ' y ', Ee('0 e⁻'), ': sin electrones.'];
        const gas = gasDe(el) && v.z !== el ? `, como el ${gasDe(el)}` : '';
        return [sim, ': ', Pz(`${v.z} p⁺`), ' y ', Ee(`${el} e⁻`), ` → ${textoIon(configEspecie(v.z, v.q))}${gas}`];
      },
      minimo: 3,
    },
    predice: {
      pieza: 'quim-objeto',
      pregunta: 'Las gotas de sulfato ferroso llevan el hierro como Fe²⁺. Al formar el Fe²⁺, el hierro pierde dos electrones. ¿De qué subnivel salen?',
      datos: ['Hierro (Z = 26): [Ar] 4s² 3d⁶', DC.ar],
      voz: 'Al llenar, el 4s entró antes. ¿Y al quitar?',
      opciones: [
        { id: 'c', texto: 'Del 4s: queda [Ar] 3d⁶', correcta: true },
        { id: 'ultimo', texto: 'Del 3d, el último en llenarse: [Ar] 4s² 3d⁴', error: 'QM-ULTIMO', siFuera: 'Es cierto que el 3d se llenó después. Pero al quitar electrones salen primero los del nivel 4, el más alto.' },
        { id: 'reparte', texto: 'Uno de cada uno: [Ar] 4s¹ 3d⁵', error: 'QM-REPARTE', siFuera: 'Sería así si salieran parejos. Pero salen primero los dos del nivel más alto, el 4s.' },
        { id: 'neutro', texto: 'De ninguno: es [Ar] 4s² 3d⁶ con carga 2+', error: 'QM-CARGA-E', siFuera: 'La carga 2+ está bien. Pero esa es la configuración del átomo neutro, y para formar el ion tienen que salir dos electrones.' },
      ],
      dibujo: OBJ_CAJAS('frasco', { filas: [{ nombre: '4s', e: 2, cajas: 1 }, { nombre: '3d', e: 6, cajas: 5 }], rotulo: 'Fe: [Ar] y estos; ¿cuáles salen?' }),
      revelar: OBJ_CAJAS('frasco', { filas: [{ nombre: '4s', e: 2, cajas: 1, sale: 2 }, { nombre: '3d', e: 6, cajas: 5 }], rotulo: 'Fe²⁺: [Ar] 3d⁶', rotuloColor: 'f' }),
      coincide: 'Coincide: salen primero los del nivel más alto, el 4s.',
      noCoincide: 'Los dos electrones salen del 4s, el nivel más alto: queda [Ar] 3d⁶.',
    },
    mira: {
      pieza: 'quim-cajas',
      datos: { paleta: 'zne', filas: [{ nombre: '4s', e: 2, cajas: 1, sale: 2, saleDesde: 2 }, { nombre: '3d', e: 6, cajas: 5, sale: 1, saleDesde: 3 }], rotulo: 'Después de los 18 del argón' },
      voz: 'Del hierro al Fe²⁺, y después al Fe³⁺.',
      pasos: [
        { estado: { corte: 1 }, texto: 'El hierro, Z = 26, es [Ar] 4s² 3d⁶; al llenarse, el 4s entró antes que el 3d.', ecuacion: ['Fe: [Ar] 4s² 3d⁶'] },
        { estado: { corte: 2 }, texto: 'Para formar el Fe²⁺ salen los dos electrones del 4s, el nivel más alto.', ecuacion: ['Fe²⁺: [Ar] 3d⁶'] },
        { estado: { corte: 3 }, texto: 'Para el Fe³⁺ sale uno más, y como el 4s ya está vacío, sale del 3d.', ecuacion: ['Fe³⁺: [Ar] 3d⁵'] },
        { estado: { corte: 3 }, texto: 'Al poner electrones se sigue el orden de llenado; al quitarlos, salen primero los de mayor n.' },
      ],
    },
    regla: {
      // La regla de «a igual n» estaba en la condición y se leía «Vale si…» (auditoría M4): va al texto.
      // Ronda 2 del lector en frío: «a igual n, los de mayor ℓ» con su ejemplo (el Sn²⁺ de los ejemplos).
      texto: 'Un anión suma electrones en el orden de llenado. Un catión pierde primero los de mayor n (4s antes que 3d) y, a igual n, los de mayor ℓ (5p antes que 5s).',
      ecuacion: [e, ' = ', Z, ' − ', { llave: ['carga'], nota: 'con signo', color: 'c-h' }],
      condicion: 'la especie está aislada y en su estado de menor energía.',
      voz: 'Cuenta los electrones antes de escribir la configuración.',
      // Dibujo propio que dice qué ion es (lector en frío): el Fe³⁺ del último paso de «Mira».
      dibujo: CAJAS([{ nombre: '4s', e: 2, cajas: 1, sale: 2 }, { nombre: '3d', e: 6, cajas: 5, sale: 1 }], { rotulo: 'Fe³⁺: [Ar] 3d⁵' }),
    },
    // Así se resuelve: la configuración de un catión con d, del mismo tipo que el tercer «Ahora tú», con otras semillas.
    resuelve: {
      pieza: 'quim-objeto',
      generar(s) {
        const [z, q] = azar(s + 900).de(CATIONES_D), n = configNeutro(z), c = configEspecie(z, q), sim = SIMB_Q(z, q);
        const s4 = (n.find(x => x.nom === '4s') || { e: 0 }).e, del3d = Math.max(0, q - s4);
        // El frasco de sulfato ferroso solo para el hierro; con otro metal, las cajas solas (lector en frío, 18 nov).
        const fig = filas => (z === 26 ? OBJ_CAJAS('frasco', { filas, titulo: `Ion ${sim}` }) : CAJAS(filas, { rotulo: `Ion ${sim}` }));
        return {
          enunciado: ['¿Cuál es la configuración abreviada del ion ', sim, '?'],
          datos: [`${Nombre(z)} (Z = ${z}): ${abreviada(n)}`, DC.ar, DC.carga],
          dibujo: fig(filasDe(n).slice(-2)),
          pasos: [
            { tipo: 'pide', texto: `Piden cómo quedan los electrones del ${sim}: cuáles salen del átomo de ${NOMBRE[z]}.` },
            { tipo: 'datos', texto: [`La carga es ${signo(q)}, así que ${q === 1 ? 'sale 1 electrón' : `salen ${q} electrones`}: el átomo neutro tiene `, Ee(`${z} e⁻`), ' y el ion, ', Ee(`${z - q} e⁻`), '.'] },
            { tipo: 'regla', texto: 'Al formar un catión salen primero los electrones del nivel más alto, el 4s; recién después, los del 3d.' },
            { tipo: 'cuentas', texto: del3d ? `${s4 === 1 ? 'Sale el único electrón' : `Salen los ${s4} electrones`} del 4s, y después ${del3d === 1 ? 'sale 1' : `salen ${del3d}`} del 3d.` : `${q === 1 ? 'Sale 1 electrón' : `Salen ${q} electrones`} del 4s, y el 3d no cambia.`, ecuacion: [`${sim}: ${abreviada(c)}`],
              dibujo: fig(filasIon(z, q).slice(-2)) },
            { tipo: 'sentido', texto: `Para comprobar: 18 + ${totalE(c) - 18} = ${totalE(c)} electrones, que son ${z} − ${q}, como dice la carga.` },
          ],
          respuesta: `${sim}: ${abreviada(c)}`,
        };
      },
    },
    ahoraTu: {
      pieza: 'quim-objeto',
      voz: 'Cuenta primero los electrones de la especie.',
      generar(s) {
        const r = azar(s + 19), tipo = s % 6;
        return [x => casoIon20(x, ANIONES20, true), x => casoIon20(x, CATIONES20, false), casoCationD, casoIsoZ, casoElectronesD, casoIon54][tipo](r);
      },
    },
  };

  // ---------- Idea 6 (fase 3, 18 nov): Hund y el último electrón ----------
  // Objeto: una combi que se va llenando (quim-objeto 'combi', dibujo de prueba): cada fila de dos asientos es un
  // orbital, cada pasajero un electrón; nadie comparte fila mientras haya una vacía. La comparación de radios de los
  // isoelectrónicos salió de esta idea: va a «Radio atómico e iónico» de Tabla periódica (decisiones del 18 nov).
  // Convención de mₗ y mₛ: tarjeta «ultimo-electron» de nucleo/convencion.js, en `datos` de todo ejercicio que pide el
  // último electrón y en «Lee». No hay un libro en fuentes/ con que confirmarla (la carpeta está vacía, 18 nov): es la del
  // motor de plantillas/atomo-y-tabla y del generador configuracion-ubicacion.
  // Cambia: cuántos electrones hay en cada caja del 2p · Permanece: las tres cajas con su mₗ y la combi alineada encima ·
  // Progresa: de un reparto cualquiera al de Hund · Se reserva: el subnivel d (el Fe²⁺ se predice) · Debe verse: los
  // electrones solos, marcados con la caja punteada.
  // Errores (hipótesis): QM-HUND (aparea antes de llenar las vacías), QM-HUND-TODOS (cuenta todos como solos),
  // QM-DESAP-RESTA (resta electrones menos cajas), QM-ULTIMO, QM-ML-CERO (numera las cajas desde 0), QM-MS-AL-REVES,
  // QM-SIN-HUND (llena cada caja con dos antes de pasar a la siguiente), QM-L-DESDE-UNO, QM-ULTIMO-4S (toma el 4s del
  // átomo neutro como último electrón del catión) y QM-PARA-DIA (confunde paramagnético con diamagnético). Equivalen a
  // los AQ-cuanticos-* del generador configuracion-ubicacion.
  const fl3 = v => [v.c1, v.c2, v.c3].map(k => (k === 2 ? [1, 1] : k === 1 ? [1, 0] : [0, 0]));
  const COMBI = (filas, o) => ({ pieza: 'quim-objeto', datos: Object.assign({ objeto: 'combi', cajas: Object.assign({ ml: true, desapareados: true, filas }, o || {}) }), estado: {} });
  const hundOk = v => [v.c1, v.c2, v.c3].every(k => k >= 1);
  const qnOps = (bien, malos) => [{ id: 'c', texto: qnTxt(bien), correcta: true }].concat(malos);
  // Errores con números cuánticos: cada uno con lo que produce.
  function malosQN(x, q) {
    const b = 2 * x.l + 1, k = x.e, out = [];
    out.push({ id: 'cero', q: Object.assign({}, q, { ml: q.ml + x.l }), error: 'QM-ML-CERO', siFuera: `n y ℓ están bien. Pero las cajas no empiezan en 0: van de mₗ = −${x.l} a +${x.l}.` });
    out.push({ id: 'ms', q: Object.assign({}, q, { ms: -q.ms }), error: 'QM-MS-AL-REVES', siFuera: `La caja está bien. Pero ese electrón ${q.ms > 0 ? 'está solo, con flecha ↑ y mₛ = +½' : 'se aparea, con flecha ↓ y mₛ = −½'}.` });
    const sh = { n: x.n, l: x.l, ml: -x.l + Math.floor((k - 1) / 2), ms: k % 2 ? 1 : -1 };
    if (b > 1) out.push({ id: 'sinhund', q: sh, error: 'QM-SIN-HUND', siFuera: 'Llenaste cada caja con dos antes de pasar a la otra. Hund pide primero una ↑ en cada caja.' });
    out.push({ id: 'l1', q: Object.assign({}, q, { l: q.l + 1 }), error: 'QM-L-DESDE-UNO', siFuera: `La caja está bien. Pero en un ${LETRA[x.l]}, ℓ vale ${x.l}, porque s es 0, p es 1 y d es 2.` });
    out.push({ id: 'n', q: Object.assign({}, q, { n: q.n - 1 }), error: 'QM-N-MENOS', siFuera: `ℓ, mₗ y mₛ están bien. Pero el último electrón está en el ${x.nom}, así que n = ${x.n}.` });
    out.push({ id: 'reves', q: Object.assign({}, q, { ml: -q.ml }), error: 'QM-ML-AL-REVES', siFuera: `Numeraste las cajas de +${x.l} a −${x.l}. En el examen van de −${x.l}, a la izquierda, a +${x.l}.` });
    return out.filter(m => qnTxt(m.q) !== qnTxt(q)).map(m => ({ id: m.id, texto: qnTxt(m.q), error: m.error, siFuera: m.siFuera }))
      .filter((m, i, l) => l.findIndex(y => y.texto === m.texto) === i);
  }
  const DESAP36 = [5, 6, 7, 8, 9, 14, 15, 16, 17, 21, 22, 23, 25, 26, 27, 28, 24, 29, 33, 34];
  const DIAMAG = [[30, 0], [12, 0], [20, 0], [10, 0], [18, 0], [30, 2], [4, 0], [36, 0], [29, 1], [11, 1]];
  const PARAMAG = [[26, 2], [29, 2], [25, 2], [28, 2], [7, 0], [8, 0], [26, 0], [24, 3], [27, 2], [17, 0], [13, 0], [22, 2]];
  const especieTxt = (z, q) => (q ? SIMB_Q(z, q) : NOMBRE[z]);
  function casoDesap(r) {
    const z = r.de(DESAP36), c = configNeutro(z), d = solos(c), u = ultimoSub(c), b = 2 * u.l + 1;
    return {
      pregunta: ['¿Cuántos electrones desapareados tiene el átomo de ', NOMBRE[z], ' (', Z, ` = ${z})?`],
      datos: [DC.orden36, DC.capacidad, DC.cajasSub, DC.anomalia],
      opciones: opciones(d, [
        { id: 'hund', valor: c.reduce((a, x) => a + (x.e % 2), 0), error: 'QM-HUND', siFuera: 'La configuración está bien. Pero ahí se aparean antes de llenar las cajas vacías, y Hund pide primero una por caja.' },
        { id: 'todos', valor: u.e !== d ? u.e : null, error: 'QM-HUND-TODOS', siFuera: `Mirar el ${u.nom} está bien. Pero con ${u.e} electrones en ${b} cajas, algunos ya van en pareja.` },
        { id: 'resta', valor: u.e > b ? u.e - b : null, error: 'QM-DESAP-RESTA', siFuera: `Es cierto que ${u.e - b === 1 ? 'sobra 1' : `sobran ${u.e - b}`} después de poner uno por caja. Pero ${u.e - b === 1 ? 'ese se aparea' : 'esos se aparean'}, y los solos son los otros.` },
        { id: 'mas', valor: d + 1, error: 'QM-CUENTA', siFuera: 'Usar Hund está bien. Ahora cuenta solo las cajas que tienen una sola flecha.' },
        { id: 'menos', valor: d > 0 ? d - 1 : null, error: 'QM-CUENTA', siFuera: 'Usar Hund está bien. Ahora cuenta solo las cajas que tienen una sola flecha.' },
      ], x => `${x}`),
      solucion: { texto: `En ${abreviada(c)}, por Hund, va una flecha por caja antes de aparear.`, ecuacion: [Ee(d), ` ${d === 1 ? 'desapareado' : 'desapareados'}`] },
    };
  }
  function casoMagnetico(r) {
    const dia = r.de(DIAMAG), para = [];
    const lista = PARAMAG.slice();
    while (para.length < 3) { const k = Math.floor(r() * lista.length); para.push(lista.splice(k, 1)[0]); }
    // Configuraciones completas: así los datos no necesitan las líneas de los gases (tope de 6 líneas; correcciones del 18 nov).
    const todos = [dia].concat(para), cfg = ([z, q]) => textoConfig(configEspecie(z, q));
    return {
      pregunta: '¿Cuál de estas especies es diamagnética, es decir, no la atrae un imán?',
      datos: todos.map(([z, q]) => `${especieTxt(z, q)}: ${cfg([z, q])}`).concat([DC.cajasSub]),
      opciones: todos.map(([z, q], i) => (i === 0 ? { id: 'c', texto: especieTxt(z, q), correcta: true }
        : { id: `p${i}`, texto: especieTxt(z, q), error: 'QM-PARA-DIA', siFuera: `Mirar su configuración está bien. Pero tiene ${solos(configEspecie(z, q))} ${solos(configEspecie(z, q)) === 1 ? 'electrón solo' : 'electrones solos'}, así que un imán la atrae.` })),
      solucion: { texto: `El ${especieTxt(...dia)} tiene todas sus cajas con pareja: 0 electrones solos.`, ecuacion: [`${especieTxt(...dia)}: ${cfg(dia)}`] },
    };
  }
  const QN36 = [3, 5, 6, 7, 8, 9, 11, 13, 14, 15, 16, 17, 21, 22, 23, 25, 26, 27, 28, 31, 33, 34, 35];
  function casoUltimoQN(r) {
    const z = r.de(QN36), c = configNeutro(z), u = ultimoSub(c), q = ultimo(c);
    return {
      pregunta: ['¿Cuáles son los números cuánticos (n; ℓ; mₗ; mₛ) del último electrón del ', NOMBRE[z], ' (', Z, ` = ${z})?`],
      datos: [DC.orden36, DC.capacidad, DC.conv1, DC.conv2],
      opciones: qnOps(q, malosQN(u, q)).slice(0, 4),
      solucion: { texto: `Su último subnivel es ${u.nom}${sup(u.e)}, y por Hund el electrón número ${u.e} de ese subnivel cae en la caja de mₗ = ${ML(q.ml)}.`, ecuacion: [qnTxt(q)] },
    };
  }
  const QN_CAT = [[26, 2], [27, 2], [28, 2], [25, 2], [29, 2], [26, 3], [27, 3], [24, 3], [22, 2], [23, 3]];
  function casoUltimoCat(r) {
    const [z, q] = r.de(QN_CAT), c = configEspecie(z, q), u = ultimoSub(c), qn = ultimo(c), n = configNeutro(z), un = ultimo(n);
    const malos = malosQN(u, qn);
    if (qnTxt(un) !== qnTxt(qn)) malos.unshift({ id: 'neutro', texto: qnTxt(un), error: 'QM-ULTIMO-4S', siFuera: 'La convención está bien. Pero ese es el último electrón del átomo neutro, y el ion ya perdió electrones.' });
    return {
      pregunta: ['¿Cuáles son los números cuánticos (n; ℓ; mₗ; mₛ) del último electrón del ion ', SIMB_Q(z, q), '?'],
      datos: [`${Nombre(z)} (Z = ${z}): ${abreviada(n)}`, DC.carga, DC.conv1, DC.conv2],
      opciones: qnOps(qn, malos.filter((m, i, l) => l.findIndex(y => y.texto === m.texto) === i && m.texto !== qnTxt(qn))).slice(0, 4),
      solucion: { texto: `El ${SIMB_Q(z, q)} es ${abreviada(c)}, y su último electrón va en la caja de mₗ = ${ML(qn.ml)}.`, ecuacion: [qnTxt(qn)] },
    };
  }
  const DESAP_CAT = [[26, 3], [27, 2], [28, 2], [29, 2], [25, 2], [30, 2], [24, 3], [27, 3], [29, 1], [26, 2], [23, 3], [22, 2]];
  function casoDesapCat(r) {
    const [z, q] = r.de(DESAP_CAT), c = configEspecie(z, q), d = solos(c), ul = solos(quitarUltimo(z, q)), n = solos(configNeutro(z));
    return {
      pregunta: ['¿Cuántos electrones desapareados tiene el ion ', SIMB_Q(z, q), '?'],
      // El átomo neutro ya escrito (como en casoUltimoCat): se practica la salida del catión y Hund (tope de 6 líneas).
      datos: [`${Nombre(z)} (Z = ${z}): ${abreviada(configNeutro(z))}`, DC.cajasSub],
      opciones: opciones(d, [
        { id: 'ultimo', valor: ul, error: 'QM-ULTIMO', siFuera: 'Usar Hund está bien. Pero salieron primero los electrones del 4s, no los del 3d, así que el 3d quedó con más.' },
        { id: 'neutro', valor: n, error: 'QM-CARGA-E', siFuera: 'Esos son los electrones solos del átomo neutro. Primero hay que sacar los electrones que pide la carga.' },
        { id: 'hund', valor: totalE(c) % 2, error: 'QM-HUND', siFuera: 'La configuración está bien. Pero Hund llena las cajas vacías antes de aparear.' },
        { id: 'mas', valor: d + 1, error: 'QM-CUENTA', siFuera: 'Usar Hund está bien. Ahora cuenta solo las cajas que tienen una sola flecha.' },
        { id: 'menos', valor: d > 0 ? d - 1 : null, error: 'QM-CUENTA', siFuera: 'Usar Hund está bien. Ahora cuenta solo las cajas que tienen una sola flecha.' },
      ], x => `${x}`),
      solucion: { texto: `El ${SIMB_Q(z, q)} es ${abreviada(c)}, y por Hund quedan ${d} ${d === 1 ? 'electrón solo' : 'electrones solos'}.`, ecuacion: [Ee(d), ` ${d === 1 ? 'desapareado' : 'desapareados'}`] },
    };
  }
  const QN54 = [37, 38, 39, 40, 43, 48, 49, 50, 51, 52, 53];
  function casoQN54(r) {
    const z = r.de(QN54), c = configNeutro(z), u = ultimoSub(c), q = ultimo(c);
    return {
      pregunta: ['¿Cuáles son los números cuánticos (n; ℓ; mₗ; mₛ) del último electrón del ', NOMBRE[z], ' (', Z, ` = ${z})?`],
      datos: [DC.orden, DC.capacidad, DC.kr, DC.conv1, DC.conv2],
      opciones: qnOps(q, malosQN(u, q)).slice(0, 4),
      solucion: { texto: `En ${abreviada(c)}, el último electrón entra al ${u.nom}, en la caja de mₗ = ${ML(q.ml)}.`, ecuacion: [qnTxt(q)] },
    };
  }

  // Ejemplos resueltos. La figura es la combi o las cajas sin flechas (vacías): dónde van los electrones es lo que se
  // pide. Cuentas rehechas aparte (scratchpad, f3/cuentas.py), con la convención de la tarjeta «ultimo-electron».
  const VACIA = (nombre, cajas, o) => CAJAS([{ nombre, e: 0, cajas, vacia: true, oculto: true }], Object.assign({ ml: true }, o || {}));
  const EJEMPLOS_HUND = [
    { nivel: 1, titulo: 'Hund en el nitrógeno',
      enunciado: 'El nitrógeno tiene 2p³. ¿Cuántos electrones desapareados tiene?',
      datos: ['Un subnivel p tiene 3 orbitales', DC.hund],
      figura: COMBI([{ nombre: '2p', e: 0, cajas: 3, vacia: true, oculto: true }]),
      solucion: [{ texto: 'Tres electrones y tres cajas: uno en cada una, los tres solos.' }],
      respuesta: [Ee(3), ' desapareados'] },
    { nivel: 1, titulo: '¿Lo atrae un imán?',
      enunciado: 'El neón es 1s² 2s² 2p⁶. ¿Es paramagnético o diamagnético?',
      datos: ['Paramagnético: con electrones solos; un imán lo atrae un poco', 'Diamagnético: todos en pareja'],
      solucion: [{ texto: 'Todas sus cajas están llenas, con dos flechas: no queda ningún electrón solo.' }],
      respuesta: ['Diamagnético: ', Ee(0), ' electrones solos'] },
    // Auditoría B3: los datos ya no traen el valor de la ↓; se da el de la ↑ y que la pareja tiene espín opuesto.
    { nivel: 1, titulo: 'Una flecha hacia abajo',
      enunciado: 'En el orbital 2s del berilio hay una pareja: ↑↓. ¿Qué valor de mₛ tiene el electrón de la flecha ↓?',
      datos: [DC.ms, 'Convención del examen: la ↑ tiene mₛ = +½', DC.dos],
      figura: CAJAS([{ nombre: '2s', e: 2, cajas: 1 }], { ml: true }),
      solucion: [{ texto: 'Los dos electrones de un orbital tienen espín opuesto: si la ↑ vale +½, la ↓ vale −½.' }],
      respuesta: 'mₛ = −½' },
    { nivel: 1, titulo: 'El último electrón del litio',
      enunciado: 'El litio es 1s² 2s¹. ¿Cuáles son los números cuánticos de su último electrón?',
      datos: [DC.letras, DC.conv1, DC.conv2],
      figura: VACIA('2s', 1),
      solucion: [{ texto: 'Está en el 2s, con n = 2 y ℓ = 0, en una sola caja con mₗ = 0, y va solo, con ↑.' }],
      respuesta: '(2; 0; 0; +½)' },
    { nivel: 1, titulo: 'El carbono',
      enunciado: 'El carbono tiene 2p². ¿Cuántos electrones desapareados tiene?',
      datos: ['Un subnivel p tiene 3 orbitales', DC.hund],
      figura: VACIA('2p', 3),
      solucion: [{ texto: 'Dos electrones en tres cajas: cada uno en una caja distinta.' }],
      respuesta: [Ee(2), ' desapareados'] },
    { nivel: 2, titulo: 'El último electrón del flúor',
      enunciado: 'El flúor es 1s² 2s² 2p⁵. ¿Cuáles son los números cuánticos de su último electrón?',
      datos: [DC.letras, DC.conv1, DC.conv2],
      figura: VACIA('2p', 3),
      solucion: [
        { texto: 'El último subnivel es el 2p, con n = 2 y ℓ = 1, y sus cajas son mₗ = −1, 0 y +1.' },
        { texto: 'Tres ↑ ocupan una caja cada una; el cuarto va como ↓ en −1, y el quinto, como ↓ en 0.', ecuacion: ['(2; 1; 0; −½)'] },
      ],
      respuesta: '(2; 1; 0; −½)' },
    { nivel: 2, titulo: 'El fósforo',
      enunciado: '¿Cuántos electrones desapareados tiene el fósforo (Z = 15)? ¿Lo atrae un imán?',
      datos: [DC.orden36, DC.capacidad, DC.cajasSub],
      solucion: [
        { texto: 'Su configuración es 1s² 2s² 2p⁶ 3s² 3p³, y solo el 3p tiene cajas a medio llenar.' },
        { texto: 'Hay tres electrones en tres cajas, así que los tres van solos y el fósforo es paramagnético.' },
      ],
      respuesta: [Ee(3), ' desapareados: paramagnético'] },
    // Ronda 2 del lector en frío: los datos ya no traen la configuración del Mn (la regalaban y dejaban sobrando el Z):
    // se arma con el orden de llenado. Sin «paramagnético» en la respuesta, los datos caben en 6 líneas.
    { nivel: 2, titulo: 'Los solos del Mn²⁺',
      enunciado: '¿Cuántos electrones desapareados tiene el ion Mn²⁺? El manganeso tiene Z = 25.',
      datos: [DC.orden36, DC.capacidad, DC.cajasSub],
      figura: VACIA('3d', 5, { rotulo: 'Mn²⁺: ¿cuántos solos?' }),
      solucion: [
        { texto: 'Manganeso neutro, 25 electrones: [Ar] 4s² 3d⁵, porque 18 + 2 + 5 = 25. El Mn²⁺ pierde los dos 4s: [Ar] 3d⁵.' },
        { texto: 'Hay cinco electrones en cinco cajas, así que los cinco van solos.' },
      ],
      respuesta: [Ee(5), ' desapareados'] },
    { nivel: 2, titulo: 'El último del escandio',
      enunciado: 'El escandio es [Ar] 4s² 3d¹. ¿Cuáles son los números cuánticos de su último electrón?',
      datos: [DC.letras, DC.orden36, DC.conv1, DC.conv2],
      figura: VACIA('3d', 5),
      solucion: [
        { texto: 'El último entró al 3d: n = 3 y ℓ = 2. Las cajas van de mₗ = −2 a +2.' },
        { texto: 'Es el primer electrón del 3d, así que va como ↑ en la caja de la izquierda.', ecuacion: ['(3; 2; −2; +½)'] },
      ],
      respuesta: '(3; 2; −2; +½)' },
    { nivel: 2, titulo: 'El cinc',
      enunciado: 'El cinc es [Ar] 4s² 3d¹⁰. ¿Es paramagnético o diamagnético?',
      datos: [DC.cajasSub, DC.magnetico],
      solucion: [
        { texto: 'El 4s² tiene su caja llena, y el 3d¹⁰ llena sus cinco cajas con dos.' },
        { texto: 'No queda ningún electrón solo, así que el cinc es diamagnético.' },
      ],
      respuesta: ['Diamagnético: ', Ee(0), ' electrones solos'] },
    { nivel: 3, titulo: 'El último del Co²⁺',
      enunciado: '¿Cuáles son los números cuánticos del último electrón del ion Co²⁺? El cobalto tiene Z = 27.',
      // Auditoría M1: la D salía de ningún error nombrado; ahora es la de las cajas numeradas desde 0.
      alternativas: ['(4; 0; 0; −½)', '(3; 2; −1; −½)', '(3; 2; +1; +½)', '(3; 2; +1; −½)', '(3; 1; −1; −½)'],
      datos: [DC.orden36, DC.carga, DC.conv1, DC.conv2],
      solucion: [
        { texto: 'El cobalto es [Ar] 4s² 3d⁷, y el Co²⁺ pierde los dos 4s: queda [Ar] 3d⁷.' },
        { texto: 'Van cinco ↑, una por caja; el sexto va como ↓ en −2, y el séptimo, como ↓ en −1.', ecuacion: ['(3; 2; −1; −½)'] },
        { texto: ['La ', letra('A'), ' es el 4s del átomo neutro, y la ', letra('C'), ' llena cada caja con dos antes de pasar.'] },
        { texto: ['La ', letra('D'), ' numera las cajas desde 0, no desde −2, y la ', letra('E'), ' usa ℓ = 1, el de un p.'] },
      ],
      respuesta: [letra('B'), ', (3; 2; −1; −½)'] },
    { nivel: 3, titulo: 'Los solos del Fe³⁺',
      enunciado: '¿Cuántos electrones desapareados tiene el ion Fe³⁺? El hierro tiene Z = 26.',
      alternativas: ['3', '4', '1', '5', '6'],
      datos: [DC.orden36, DC.carga, DC.cajasSub],
      solucion: [
        { texto: 'El hierro es [Ar] 4s² 3d⁶, y el Fe³⁺ pierde los dos 4s y uno del 3d: queda [Ar] 3d⁵.' },
        { texto: 'Hay cinco electrones en cinco cajas, así que los cinco van solos.' },
        { texto: ['La ', letra('A'), ' saca los tres del 3d, y la ', letra('B'), ' cuenta los del Fe²⁺.'] },
        { texto: ['La ', letra('C'), ' aparea antes de llenar las cajas vacías. La ', letra('E'), ' cuenta solos los seis 3d del átomo neutro.'] },
      ],
      respuesta: [letra('D'), ', ', Ee(5), ' desapareados'] },
    { nivel: 3, titulo: 'Los solos del cromo',
      enunciado: '¿Cuántos electrones desapareados tiene el átomo de cromo (Z = 24)?',
      alternativas: ['4', '5', '2', '1', '6'],
      datos: [DC.orden36, DC.anomalia, DC.cajasSub],
      solucion: [
        { texto: 'El cromo es una excepción: su configuración es [Ar] 4s¹ 3d⁵.' },
        { texto: 'El 4s¹ tiene uno solo y el 3d⁵, cinco, uno por caja.', ecuacion: ['1 + 5 = ', Ee(6)] },
        { texto: ['La ', letra('A'), ' olvida la excepción (4s² 3d⁴), y la ', letra('B'), ' cuenta solo el 3d.'] },
        { texto: ['La ', letra('C'), ' aparea antes de llenar: 1 en el 4s y 1 en el 3d. La ', letra('D'), ' mira solo el último nivel, el 4s¹.'] },
      ],
      respuesta: [letra('E'), ', ', Ee(6), ' desapareados'] },
    { nivel: 3, titulo: 'Un ion sin electrones solos',
      enunciado: '¿Cuál de estos iones es diamagnético? El hierro tiene Z = 26; el cobre, 29; el cinc, 30; el manganeso, 25; el níquel, 28.',
      alternativas: ['Fe²⁺', 'Cu²⁺', 'Zn²⁺', 'Mn²⁺', 'Ni²⁺'],
      // Ronda 2 del lector en frío: los datos en el orden del enunciado y de las alternativas.
      datos: ['Neutros, después del [Ar]: Fe 4s² 3d⁶; Cu 4s¹ 3d¹⁰; Zn 4s² 3d¹⁰; Mn 4s² 3d⁵; Ni 4s² 3d⁸', DC.cajasSub],
      solucion: [
        { texto: 'Cada uno pierde primero sus 4s. El cobre, [Ar] 4s¹ 3d¹⁰, pierde su único 4s y uno del 3d: 3d⁹.' },
        { texto: 'Quedan Fe²⁺ 3d⁶, Cu²⁺ 3d⁹, Zn²⁺ 3d¹⁰, Mn²⁺ 3d⁵ y Ni²⁺ 3d⁸. Solo el 3d¹⁰ llena sus cinco cajas con pareja.' },
        { texto: ['La ', letra('A'), ' tiene cuatro solos; la ', letra('B'), ', uno; la ', letra('D'), ', cinco; la ', letra('E'), ', dos.'] },
      ],
      respuesta: [letra('C'), ', Zn²⁺'] },
    { nivel: 3, titulo: 'El último del yodo',
      enunciado: '¿Cuáles son los números cuánticos del último electrón del yodo (Z = 53)?',
      alternativas: ['(5; 1; 0; −½)', '(5; 1; +1; +½)', '(4; 2; +2; −½)', '(5; 0; 0; −½)', '(5; 1; −1; −½)'],
      datos: [DC.orden, DC.capacidad, DC.kr, DC.conv1, DC.conv2],
      solucion: [
        { texto: 'El yodo es [Kr] 5s² 4d¹⁰ 5p⁵, y su último electrón entró al 5p, con n = 5 y ℓ = 1.' },
        { texto: 'Van tres ↑ en −1, 0 y +1; el cuarto va como ↓ en −1, y el quinto, como ↓ en 0.', ecuacion: ['(5; 1; 0; −½)'] },
        { texto: ['La ', letra('E'), ' es el cuarto electrón, y la ', letra('B'), ', el tercero. La ', letra('C'), ' toma el 4d como último, y la ', letra('D'), ', el 5s.'] },
      ],
      respuesta: [letra('A'), ', (5; 1; 0; −½)'] },
  ];

  const desapareados = {
    id: 'desapareados-isoelectronicos',
    titulo: 'Hund y el último electrón',
    pregunta: '¿Cuántos electrones quedan solos en un subnivel, y dónde va el último?',
    temas: ['Paramagnetismo y especies isoelectrónicas', 'Números cuánticos y orbitales'],
    pieza: 'quim-objeto',
    aprendizaje: 'Cada electrón ocupa una caja vacía antes de aparearse; si quedan solos, un imán atrae a la especie. El último tiene n, ℓ, mₗ, mₛ.',
    actividad: 'Repartir los cuatro electrones 2p del oxígeno en sus tres cajas, como en una combi.',
    // Lee: la combi (la analogía de Hund, aprobada en la propuesta), los electrones como imanes y la convención del examen.
    // No dice cuántos solos quedan en un subnivel d (eso se predice).
    lee: {
      tarjetas: [
        // Ronda 2 del lector en frío: «cada fila tiene dos asientos» no calzaba con lo que se ve (dos hileras de tres). Se
        // dice hacia dónde va la combi y qué es una fila; el dibujo enmarca los dos asientos de cada fila.
        { titulo: 'La combi', texto: 'La combi, vista desde arriba, va hacia la derecha; el círculo es el timón. Cada fila, de ventana a ventana, tiene dos asientos. Cada pasajero se sienta solo en una fila vacía y, cuando ya no quedan, junto a otro: así se llenan los orbitales.',
          pieza: 'quim-objeto', dibujo: COMBI([{ nombre: '2p', e: 2, cajas: 3 }]) },
        { titulo: 'Imanes diminutos', texto: 'Cada electrón se porta como un imán muy pequeño. Dos electrones en un mismo orbital tienen espín opuesto y sus efectos se anulan. Un electrón solo, en cambio, hace que un imán fuerte atraiga un poco a la sustancia.' },
        { titulo: 'Convención del examen', texto: 'Las cajas de un subnivel se numeran de mₗ = −ℓ, a la izquierda, a +ℓ, a la derecha. Primero va una flecha ↑ en cada caja, de izquierda a derecha, con mₛ = +½; después las ↓, con mₛ = −½. Otros libros usan los signos al revés.' },
        { titulo: 'Qué mirar', texto: 'En el juego repartes los cuatro electrones 2p del oxígeno en sus tres cajas. Cuenta cuántos quedan solos en cada reparto.' },
      ],
    },
    ejemplos: EJEMPLOS_HUND,
    juega: {
      pieza: 'quim-objeto',
      consigna: 'En la combi, cada pasajero se sienta solo en una fila vacía antes de compartir. Las cajas del 2p son tres filas.',
      mision: {
        texto: 'Reparte los cuatro electrones 2p del oxígeno como en la combi.',
        logrado: v => v.c1 + v.c2 + v.c3 === 4 && hundOk(v),
        bien: 'En 2p⁴ hay una caja con pareja y dos con un electrón solo: 2 desapareados.',
      },
      voz: 'Primero llena las filas vacías.',
      leyenda: [
        { s: Ee('●'), t: 'pasajero: un electrón' },
        { s: Ee('↑'), t: 'electrón solo en su caja' },
        { s: Ee('↑↓'), t: 'pareja con espín opuesto' },
        { s: 'mₗ', t: 'número de cada caja, de −ℓ a +ℓ' },
        { s: '⬚', t: 'caja punteada: un electrón desapareado' },
      ],
      controles: [
        // Ronda 2 del lector en frío: antes arrancaba en 2, 1, 0, justo un reparto que Hund no permite; ahora en el del
        // carbono, 1, 1, 0 (el de «Lee»).
        { id: 'c1', etiqueta: 'Caja mₗ = −1', min: 0, max: 2, paso: 1, inicio: 1, decimales: 0 },
        { id: 'c2', etiqueta: 'Caja mₗ = 0', min: 0, max: 2, paso: 1, inicio: 1, decimales: 0 },
        { id: 'c3', etiqueta: 'Caja mₗ = +1', min: 0, max: 2, paso: 1, inicio: 0, decimales: 0 },
      ],
      dibujo: v => COMBI([{ nombre: '2p', cajas: 3, flechas: fl3(v) }]),
      // La relación: cuántos electrones y cuántos solos; si hay pareja con una caja vacía, Hund no lo permite.
      lectura: v => {
        const k = [v.c1, v.c2, v.c3], t = k.reduce((a, b) => a + b, 0), d = k.filter(x => x === 1).length;
        if (t === 4 && hundOk(v)) return ['En 2p⁴ quedan una pareja y dos solos: ', Ee('2 desapareados'), '.'];
        if (k.includes(2) && k.includes(0)) return [`${t} en 3 cajas dan ${d} ${d === 1 ? 'solo' : 'solos'}: Hund llena antes la vacía.`];
        return [`${t} ${t === 1 ? 'electrón' : 'electrones'} en 3 cajas: `, Ee(`${d} ${d === 1 ? 'solo' : 'solos'}`), '.'];
      },
      minimo: 3,
    },
    predice: {
      pieza: 'quim-objeto',
      pregunta: 'En el Fe²⁺ de las gotas de sulfato ferroso quedan seis electrones en el 3d. ¿Cuántos quedan solos?',
      datos: ['Fe²⁺: [Ar] 3d⁶', DC.ar, 'Un subnivel d tiene 5 orbitales'],
      voz: 'Piensa en la combi con cinco filas.',
      opciones: [
        { id: 'c', texto: '4', correcta: true },
        { id: 'hund', texto: '0', error: 'QM-HUND', siFuera: 'Es cierto que seis es par. Pero antes de aparearse, cada electrón ocupa una caja vacía.' },
        { id: 'todos', texto: '6', error: 'QM-HUND-TODOS', siFuera: 'Poner uno por caja está bien. Pero hay solo 5 cajas, así que el sexto tiene que aparearse.' },
        { id: 'resta', texto: '1', error: 'QM-DESAP-RESTA', siFuera: 'Es cierto que sobra uno después de llenar las cinco cajas. Pero ese se aparea, y los solos son los otros.' },
      ],
      dibujo: OBJ_CAJAS('frasco', { ml: true, filas: [{ nombre: '3d', e: 0, cajas: 5, vacia: true, oculto: true }], rotulo: 'Fe²⁺, 3d⁶: ¿cuántos solos?' }),
      revelar: OBJ_CAJAS('frasco', { ml: true, desapareados: true, filas: [{ nombre: '3d', e: 6, cajas: 5 }], rotulo: 'Fe²⁺: 4 electrones solos', rotuloColor: 'f' }),
      coincide: 'Coincide: cinco van solos, uno por caja, y el sexto se aparea, así que quedan 4 solos.',
      noCoincide: 'Va uno por caja en las cinco, y el sexto se aparea: quedan 4 solos.',
    },
    mira: {
      pieza: 'quim-cajas',
      // Ronda 2 del lector en frío (otra vez): el paso 1 decía «los tres primeros» con los cuatro dibujados. Ahora el cuarto
      // entra recién en el paso 2 (quim-cajas, fila.entran).
      datos: { paleta: 'zne', ml: true, desapareados: true, filas: [{ nombre: '2p', e: 4, cajas: 3, desde: 1, entran: { k: 1, desde: 2 } }, { nombre: '3d', e: 6, cajas: 5, desde: 4 }],
        ultimos: [{ fila: 0, caja: 0, j: 1, desde: 3 }, { fila: 1, caja: 0, j: 1, desde: 5 }] },
      voz: 'Sigamos al último electrón del oxígeno y del Fe²⁺.',
      pasos: [
        { estado: { corte: 1 }, texto: 'El oxígeno tiene cuatro electrones en el 2p: los tres primeros ponen una ↑ en cada caja.' },
        { estado: { corte: 2 }, texto: 'El cuarto se aparea en la primera caja, la de mₗ = −1, con una ↓.' },
        { estado: { corte: 3 }, texto: 'Su último electrón tiene n = 2, ℓ = 1, mₗ = −1 y mₛ = −½.', ecuacion: ['(2; 1; −1; −½)'] },
        { estado: { corte: 4 }, texto: 'En el Fe²⁺, 3d⁶, van cinco ↑, una por caja, y el sexto va como ↓ en mₗ = −2.' },
        { estado: { corte: 5 }, texto: 'Ese sexto electrón es el último del Fe²⁺, y quedan 4 electrones solos.', ecuacion: ['(3; 2; −2; −½)'] },
        { estado: { corte: 5 }, texto: 'Con electrones solos, un imán atrae un poco a la especie: es paramagnética.' },
      ],
    },
    regla: {
      texto: 'Por la regla de Hund, cada electrón ocupa una caja vacía antes de aparearse. Si quedan electrones solos, la especie es paramagnética (un imán la atrae); si no, es diamagnética. El último electrón se describe con (n; ℓ; mₗ; mₛ).',
      condicion: 'se usa la convención del examen: las cajas van de mₗ = −ℓ a +ℓ, y primero se ponen las ↑ (+½) y después las ↓ (−½).',
      voz: 'Cajas con una flecha sola: ahí está el paramagnetismo.',
      dibujo: { pieza: 'quim-cajas', datos: { paleta: 'zne', ml: true, desapareados: true, filas: [{ nombre: '3d', e: 6, cajas: 5 }], ultimos: [{ fila: 0, caja: 0, j: 1 }], rotulo: 'Fe²⁺: (3; 2; −2; −½)' } },
    },
    // Así se resuelve: los desapareados de un ion con d, del mismo tipo que el quinto «Ahora tú», con otras semillas.
    resuelve: {
      pieza: 'quim-cajas',
      generar(s) {
        const [z, q] = azar(s + 900).de(DESAP_CAT), c = configEspecie(z, q), d = solos(c), sim = SIMB_Q(z, q), x3 = c.find(y => y.nom === '3d') || { e: 0 };
        const fig = marca => CAJAS([{ nombre: '3d', e: marca ? x3.e : 0, cajas: 5, vacia: !marca, oculto: !marca }], { ml: true, desapareados: marca });
        return {
          enunciado: ['¿Cuántos electrones desapareados tiene el ion ', sim, '? ¿Lo atrae un imán?'],
          datos: [`${Nombre(z)} (Z = ${z}): ${abreviada(configNeutro(z))}`, DC.cajasSub],
          dibujo: fig(false),
          pasos: [
            { tipo: 'pide', texto: `Piden los electrones solos del ${sim} y si un imán lo atrae.` },
            { tipo: 'datos', texto: `El ${NOMBRE[z]} neutro es ${abreviada(configNeutro(z))}. Con carga ${signo(q)} salen primero los electrones del 4s, el de mayor n, y queda ${abreviada(c)}.` },
            { tipo: 'regla', texto: 'Por Hund, pongo una flecha en cada caja vacía antes de aparear. Si queda alguna sola, es paramagnético.' },
            { tipo: 'cuentas', texto: `Hay ${x3.e} ${x3.e === 1 ? 'electrón' : 'electrones'} en 5 cajas: ${x3.e <= 5 ? (x3.e === 1 ? 'va solo' : 'todos van solos, uno por caja') : `primero cinco ↑, una por caja, y ${x3.e - 5 === 1 ? 'el que sigue se aparea' : `los ${x3.e - 5} que siguen se aparean`}`}.`, ecuacion: [Ee(d), ` ${d === 1 ? 'desapareado' : 'desapareados'}`], dibujo: fig(true) },
            { tipo: 'sentido', texto: `Para comprobar: ${x3.e - d} en pareja y ${d} ${d === 1 ? 'solo' : 'solos'} suman ${x3.e}, que son los electrones del 3d.` },
          ],
          respuesta: `${d} ${d === 1 ? 'desapareado' : 'desapareados'}: ${d ? 'paramagnético' : 'diamagnético'}`,
        };
      },
    },
    ahoraTu: {
      pieza: 'quim-objeto',
      voz: 'Cuenta las cajas con una sola flecha.',
      generar(s) {
        const r = azar(s + 23), tipo = s % 6;
        return [casoDesap, casoMagnetico, casoUltimoQN, casoUltimoCat, casoDesapCat, casoQN54][tipo](r);
      },
    },
  };

  // ---------- Laboratorio ----------
  // Mesa «arma-ion» (de la idea 1): el átomo con la paleta 'zne'; los electrones que salen van afuera y los que llegan,
  // con su aro.
  const mesaIon = v => ATOMO({ atomos: [{ Z: v.z, N: v.n, e: Math.max(0, v.z - v.q), carga: v.q, titulo: v.q > v.z ? SIMB[v.z] : nuclido(v.z, v.z + v.n),
    sale: v.q > 0 ? { n: Math.min(v.q, v.z) } : undefined, llega: v.q < 0 ? { n: -v.q } : undefined, rotulo: `A = ${v.z + v.n}` }] });
  // Mesa «cajas-ion» (ideas 5 y 6): el ion y sus cajas a la vez, con la paleta 'zne'; se marcan los electrones solos.
  // Gesto directo: se agarra la última flecha y se la lleva a otra caja. Cada flecha posible (1s↑, 1s↓, 2s↑…) tiene un
  // sitio fijo en quim-cajas (fila del subnivel, caja por Hund, ↑ o ↓); mover elige el sitio más cercano y su número de
  // orden es la cantidad de electrones. Hasta el calcio, la configuración del ion es la del orden de llenado (config).
  const GC = () => Kit.piezas['quim-cajas'];
  function sitioFlecha(n) {
    const c = config(n), i = c.length - 1, x = c[i], cajas = 2 * x.l + 1, m = x.e - 1;
    return GC().geometria({ filas: [{ cajas: 1 }] }).flecha(i, m < cajas ? m : m - cajas, m < cajas ? 0 : 1);
  }
  const masCercana = (pt, max) => { let mejor = 1, dm = Infinity; for (let k = 1; k <= max; k++) { const s = sitioFlecha(k), d = (s.x - pt.x) ** 2 + (s.y - pt.y) ** 2; if (d < dm) { dm = d; mejor = k; } } return mejor; };
  // El máximo de electrones solos que alcanza la mesa (hasta 23 electrones), calculado con las mismas cajas.
  const MAX_SOLOS = Math.max(...Array.from({ length: 23 }, (_, k) => solos(config(k + 1))));
  const dibIon = v => {
    const el = v.z - v.q, c = el > 0 ? configEspecie(v.z, v.q) : [];
    return { datos: { paleta: 'zne', filas: filasDe(c), desapareados: true, rotulo: el > 0 ? `${SIMB_Q(v.z, v.q)}: ${solos(c)} ${solos(c) === 1 ? 'desapareado' : 'desapareados'}` : el === 0 ? `${SIMB_Q(v.z, v.q)}: sin electrones` : `${SIMB[v.z]} no tiene tantos electrones` }, estado: {} };
  };

  // Mesa 3D «La nube del orbital»: los datos de la pieza quim-orbital-3d, todos del motor (regla 1).
  const ESC_COMUN = 2.4 / MA.orbital(MA.mayorOrbital()).r90;
  const nubeDe = v => {
    const o = MA.orbital(v.orb), nb = MA.nube(v.orb, { corte: v.cor === 1 });
    return { datos: { puntos: nb.puntos, escala: v.esc === 1 ? 2.2 / o.r90 : ESC_COMUN, nombre: o.nombre, corte: nb.corte, lobulos: MA.lobulos(v.orb),
      vista: o.corte === 'z' ? { giro: 30, inclinacion: 55 } : { giro: 30, inclinacion: 20 },   // dxy y dx²−y²: mejor desde arriba
      nodos: v.nod === 1 ? { radiales: o.radiales, planos: o.planos, conos: o.conos } : null, medidas: medidasDe(v, nb) }, estado: {} };
  };
  // Animación (ronda 5): la nube se arma sola, medida a medida (los puntos del motor salen en orden de azar), en 8 s.
  // Sin t (casos guardados de antes), la nube entera.
  const medidasDe = (v, nb) => (Number.isFinite(v.t) ? Math.round(nb.puntos.length * (0.04 + 0.96 * Math.min(1, v.t / 8))) : nb.puntos.length);

  // Correcciones del 18 nov (A2, A3, nota c): todo ejercicio que usa [He], [Ne], [Ar] o [Kr] trae su línea en «Datos»; en
  // las ideas 5 y 6, además, la salida del catión, Hund y qué es para/diamagnético cuando el ejercicio los usa.
  for (const i of [nucleo, modelos, cuanticos, configuracion, configIones, desapareados]) {
    const reglas = i === configIones || i === desapareados;
    const arreglar = c => (reglas ? conReglas(conGases(c)) : conGases(c));
    // «Qué abrevia [Ar]» pregunta justo por esa línea: no se le agrega.
    i.ejemplos = i.ejemplos.map(x => (x.titulo === 'Qué abrevia [Ar]' ? x : arreglar(x)));
    const ga = i.ahoraTu.generar, gr = i.resuelve.generar;
    i.ahoraTu.generar = s => arreglar(ga.call(i.ahoraTu, s));
    i.resuelve.generar = s => arreglar(gr.call(i.resuelve, s));
  }

  const def = {
    unidad: 'quimica.estructura-atomica',
    version: '0.3.3',
    calidad: 2,
    colores: COLORES,
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/quim-atomo.js', '/nucleo/kit/piezas/quim-cajas.js', '/nucleo/kit/piezas/quim-objeto.js', '/nucleo/kit/piezas/quim-hotel.js',
      '/nucleo/kit/piezas/quim-lamina.js', '/plantillas/atomo-y-tabla/motor.js', '/nucleo/kit/piezas/quim-orbital-3d.js'],
    historia: {
      texto: 'En 1808, John Dalton explicó las proporciones de combinación con átomos de masa propia, aunque algunas de sus fórmulas estaban equivocadas. En 1911, la dispersión de partículas alfa llevó a Rutherford al núcleo, y en 1913 Bohr propuso niveles de energía. El modelo actual no es una foto: es la descripción que mejor explica las evidencias que tenemos.',
      pregunta: '¿Cómo sabes qué hay dentro de algo que no puedes ver?',
      fuente: { titulo: 'OpenStax, Chemistry 2e, §2.3', url: 'https://openstax.org/books/chemistry-2e/pages/2-3-atomic-structure-and-symbolism' },
    },
    // Glosario (docs/teoria.md §4d): las palabras que la unidad estrena en el curso de química.
    glosario: [
      // Idea 1 (rehecha, 18 nov): cada término con 3 ejemplos o más; los tres que el Resumen muestra llevan `simple`. Ningún
      // `simple` dice qué le pasa a un átomo que pierde un electrón (es la predicción de la idea).
      { termino: 'átomo', formas: ['átomo', 'átomos'], def: 'Partícula más pequeña de un elemento: un núcleo con protones y neutrones, rodeado de electrones.',
        ejemplos: ['Un átomo de helio: 2 protones y 2 neutrones en el núcleo, 2 electrones afuera.', 'En un hueso hay muchísimos átomos de carbono.', 'Un átomo de carbono-12 tiene 6 protones, 6 neutrones y 6 electrones.'],
        ver: ['protón', 'electrón', 'elemento'] },
      { termino: 'protón', formas: ['protón', 'protones'], def: 'Partícula del núcleo con carga positiva. La cantidad que tiene un átomo es su número atómico.',
        ejemplos: ['El carbono tiene 6 protones en su núcleo.', 'Un protón tiene unas 1836 veces la masa de un electrón.', 'En el dibujo, «6p⁺» son 6 protones.'],
        ver: ['número atómico'] },
      { termino: 'neutrón', formas: ['neutrón', 'neutrones'], def: 'Partícula del núcleo sin carga, con masa casi igual a la del protón.',
        ejemplos: ['El carbono-14 tiene 8 neutrones; el carbono-12, 6.', 'El hidrógeno común no tiene neutrones.', 'En el dibujo, «8n⁰» son 8 neutrones.'],
        ver: ['isótopo', 'número de masa'] },
      { termino: 'electrón', formas: ['electrón', 'electrones'], def: 'Partícula muy liviana con carga negativa que se mueve alrededor del núcleo.',
        ejemplos: ['Un átomo de helio neutro tiene 2 electrones.', 'Se escribe e⁻: carga negativa.', 'Los electrones y los protones se atraen: sus cargas son opuestas.'],
        ver: ['orbital', 'ion'] },
      { termino: 'número atómico', formas: ['número atómico', 'números atómicos'], simbolo: 'Z', def: 'Cantidad de protones del núcleo. Cada elemento tiene el suyo.',
        simple: 'Cuántos protones hay en el núcleo del átomo.',
        ejemplos: ['El carbono tiene Z = 6: seis protones.', 'El cobre de Cuajone tiene Z = 29.', 'El calcio tiene Z = 20.'], ver: ['protón'] },
      { termino: 'número de masa', formas: ['número de masa', 'números de masa'], simbolo: 'A', def: 'Protones más neutrones de un núcleo: A = Z + N.',
        simple: 'Cuántas partículas hay en el núcleo: protones y neutrones juntos.',
        ejemplos: ['Carbono con 6 protones y 8 neutrones: A = 6 + 8 = 14.', 'En «cloro-37», 37 es el número de masa.', 'En ²³Na, el 23 de arriba es A.'],
        ver: ['número atómico', 'neutrón'] },
      { termino: 'isótopo', formas: ['isótopo', 'isótopos'], def: 'Átomos del mismo elemento con distinto número de neutrones, y por eso distinto número de masa.',
        simple: 'Otro átomo del mismo elemento, con más o menos neutrones.',
        ejemplos: ['Carbono-12 y carbono-14: 6 protones los dos; 6 y 8 neutrones.', 'Cloro-35 y cloro-37: 17 protones; 18 y 20 neutrones.', 'Hidrógeno común y deuterio: 1 protón; 0 y 1 neutrón.'],
        ver: ['número de masa'] },
      { termino: 'isóbaro', formas: ['isóbaro', 'isóbaros'], def: 'Dicho de dos átomos de elementos distintos con el mismo número de masa.',
        ejemplos: ['¹⁴C y ¹⁴N: los dos con A = 14.', '⁴⁰Ar y ⁴⁰Ca: los dos con A = 40.', '³²P y ³²S: los dos con A = 32.'],
        ver: ['número de masa', 'isótopo'] },
      { termino: 'isótono', formas: ['isótono', 'isótonos'], def: 'Dicho de dos átomos con el mismo número de neutrones.',
        ejemplos: ['³⁹K y ⁴⁰Ca: 20 neutrones cada uno.', '¹³C y ¹⁴N: 7 neutrones cada uno.', '²³Na y ²⁴Mg: 12 neutrones cada uno.'],
        ver: ['neutrón', 'isóbaro'] },
      { termino: 'ion', formas: ['ion', 'iones'], def: 'Átomo o grupo de átomos con carga eléctrica: sus protones y sus electrones no son la misma cantidad.',
        ejemplos: ['Cl⁻: 17 protones y 18 electrones, carga 17 − 18 = −1.', 'Ca²⁺: 20 protones y 18 electrones, carga +2.', 'Al³⁺: 13 protones y 10 electrones, carga +3.'],
        ver: ['catión', 'anión'] },
      { termino: 'isoelectrónico', formas: ['isoelectrónico', 'isoelectrónicos', 'isoelectrónica', 'isoelectrónicas'],
        def: 'Dicho de dos especies distintas que tienen la misma cantidad de electrones.',
        ejemplos: ['Na⁺, Ne y F⁻: los tres con 10 electrones.', 'Cl⁻ y Ca²⁺: los dos con 18 electrones.', 'O²⁻ y Mg²⁺: los dos con 10 electrones.'], ver: ['ion'] },
      // Ideas 2 a 6 (fase 3, 18 nov): cada idea estrena de 2 a 4 palabras con `simple` y 3 ejemplos o más. Ningún `simple` ni
      // ejemplo dice lo que se predice (el núcleo de Rutherford, el piso 4, el 5s, el 4s del Fe²⁺, los 4 solos del Fe²⁺).
      { termino: 'modelo atómico', formas: ['modelo atómico', 'modelos atómicos'], def: 'Explicación simplificada de cómo es el átomo por dentro, puesta a prueba con experimentos.',
        simple: 'Una idea de cómo es por dentro algo que no se ve.',
        ejemplos: ['El de Dalton: el átomo como una bolita maciza.', 'El de Thomson: electrones dentro de una esfera positiva.', 'El actual: el electrón en orbitales, regiones de probabilidad.'],
        ver: ['partícula alfa', 'orbital'] },
      { termino: 'partícula alfa', formas: ['partícula alfa', 'partículas alfa', 'alfas', 'alfa'], def: 'Partícula diminuta con carga positiva y con unas 7300 veces la masa de un electrón.',
        simple: 'Una bala muy pequeña con carga positiva, para explorar el átomo.',
        ejemplos: ['En 1909 se lanzaron alfas contra una lámina de oro.', 'Una alfa tiene unas 7300 veces la masa de un electrón.', 'Dos cargas positivas, como dos alfas, se repelen.'],
        ver: ['modelo atómico'] },
      { termino: 'nivel de energía', formas: ['nivel de energía', 'niveles de energía'], def: 'Cada una de las energías permitidas para un electrón del átomo; se numeran con n.',
        simple: 'Un escalón de energía donde puede estar el electrón.',
        ejemplos: ['Bohr propuso que el electrón solo ocupa ciertos niveles de energía.', 'Al bajar de nivel, el electrón suelta luz de un color fijo.', 'En el hotel del electrón, cada piso es un nivel.'],
        ver: ['subnivel', 'orbital'] },
      { termino: 'orbital', formas: ['orbital', 'orbitales'], def: 'Región alrededor del núcleo donde es probable hallar un electrón. Caben dos, con espín opuesto.',
        simple: 'La zona donde es más probable encontrar a un electrón.',
        ejemplos: ['El 1s es un orbital con forma de esfera.', 'Un subnivel p tiene 3 orbitales.', 'En el hotel del electrón, cada orbital es un cuarto doble.'],
        ver: ['números cuánticos', 'subnivel'] },
      { termino: 'subnivel', formas: ['subnivel', 'subniveles'], def: 'Parte de un nivel con orbitales del mismo tipo; se nombra con una letra: s, p, d o f.',
        simple: 'Un grupo de orbitales del mismo tipo: s, p, d o f.',
        ejemplos: ['El 3p es parte del nivel 3 y tiene 3 orbitales.', 'El nivel 2 tiene dos: el 2s y el 2p.', 'En el hotel del electrón, cada pasillo es un subnivel.'],
        ver: ['orbital', 'números cuánticos'] },
      { termino: 'números cuánticos', formas: ['números cuánticos', 'número cuántico'], simbolo: 'n, ℓ, mₗ, mₛ',
        def: 'Cuatro valores que describen a un electrón: nivel, subnivel, orbital y espín.',
        simple: 'Cuatro números que dan la dirección de un electrón en el átomo.',
        ejemplos: ['n = 3 y ℓ = 1 es el subnivel 3p.', '(2; 1; −1; −½) es un juego posible.', 'mₛ = +½ es una flecha ↑.'], ver: ['orbital', 'espín'] },
      { termino: 'espín', simbolo: 'mₛ', def: 'Propiedad del electrón que se dibuja como una flecha hacia arriba o hacia abajo: vale +½ o −½.',
        simple: 'Una propiedad del electrón que se dibuja como flecha ↑ o ↓.',
        ejemplos: ['Una flecha ↑ tiene mₛ = +½.', 'En un orbital, los dos electrones tienen espín opuesto.', 'mₛ solo puede valer +½ o −½.'],
        ver: ['orbital', 'electrón desapareado'] },
      { termino: 'configuración electrónica', formas: ['configuración electrónica', 'configuraciones electrónicas', 'configuración', 'configuraciones'],
        def: 'Cómo se reparten los electrones de una especie en sus subniveles, del de menor energía al de mayor.',
        simple: 'La lista de cuántos electrones hay en cada subnivel.',
        ejemplos: ['Nitrógeno, con 7 electrones: 1s² 2s² 2p³.', 'Hierro: [Ar] 4s² 3d⁶.', 'Cromo, una excepción: [Ar] 4s¹ 3d⁵.'], ver: ['subnivel', 'capa de valencia'] },
      { termino: 'capa de valencia', formas: ['capa de valencia', 'capas de valencia', 'último nivel'], def: 'El nivel de mayor n que tiene electrones en un átomo o ion.',
        simple: 'El nivel más alto que tiene electrones.',
        ejemplos: ['Sodio, [Ne] 3s¹: el nivel 3, con 1 electrón.', 'Bromo, [Ar] 4s² 3d¹⁰ 4p⁵: el nivel 4, con 7.', 'Cobre, [Ar] 4s¹ 3d¹⁰: el nivel 4, con 1.'],
        ver: ['configuración electrónica'] },
      { termino: 'catión', formas: ['catión', 'cationes'], def: 'Ion positivo: tiene menos electrones que protones.',
        simple: 'Un ion positivo: le faltan electrones.',
        ejemplos: ['Na⁺ perdió 1 electrón.', 'Ca²⁺ perdió 2 electrones.', 'Al³⁺ perdió 3 electrones: le quedan 10.'], ver: ['anión', 'ion'] },
      { termino: 'anión', formas: ['anión', 'aniones'], def: 'Ion negativo: tiene más electrones que protones.',
        simple: 'Un ion negativo: tiene electrones de más.',
        ejemplos: ['Cl⁻ ganó 1 electrón: 18 en total.', 'O²⁻ ganó 2 electrones.', 'S²⁻ tiene los 18 electrones del argón.'], ver: ['catión', 'ion'] },
      { termino: 'regla de Hund', formas: ['regla de Hund', 'Hund'], def: 'En un subnivel, los electrones ocupan primero orbitales vacíos, uno en cada uno, y después se aparean.',
        simple: 'Primero uno en cada caja vacía; después, en pareja.',
        ejemplos: ['Nitrógeno, 2p³: una flecha en cada una de las tres cajas.', 'Oxígeno, 2p⁴: una caja con pareja y dos con uno solo.', 'Como en la combi: nadie comparte fila si hay una vacía.'],
        ver: ['electrón desapareado'] },
      { termino: 'electrón desapareado', formas: ['electrón desapareado', 'electrones desapareados', 'desapareados', 'desapareado'],
        def: 'Electrón solo en su orbital, sin otro de espín opuesto a su lado.',
        simple: 'Un electrón que va solo en su caja, sin pareja.',
        ejemplos: ['El nitrógeno tiene 3 en el 2p.', 'El Mn²⁺ tiene 5 en el 3d.', 'El neón no tiene ninguno.'], ver: ['regla de Hund', 'paramagnético'] },
      { termino: 'paramagnético', formas: ['paramagnético', 'paramagnética', 'paramagnéticos', 'paramagnéticas', 'paramagnetismo'],
        def: 'Dicho de una especie con electrones desapareados: un imán la atrae un poco.',
        simple: 'Que un imán atrae un poco, por sus electrones solos.',
        ejemplos: ['El oxígeno, con 2 electrones solos.', 'El Mn²⁺, con 5 electrones solos.', 'El nitrógeno, con 3 electrones solos.'], ver: ['diamagnético', 'electrón desapareado'] },
      { termino: 'diamagnético', formas: ['diamagnético', 'diamagnética', 'diamagnéticos', 'diamagnéticas'],
        def: 'Dicho de una especie con todos sus electrones en pareja: un imán no la atrae (apenas la empuja, muy débilmente).',
        simple: 'Que un imán no atrae: todos sus electrones van en pareja.',
        ejemplos: ['El neón: 1s² 2s² 2p⁶.', 'El cinc: [Ar] 4s² 3d¹⁰.', 'El ion Zn²⁺: [Ar] 3d¹⁰.'], ver: ['paramagnético'] },
      // De la mesa 3D «La nube del orbital» (ninguna idea los estrena).
      { termino: 'nodo', formas: ['nodo', 'nodos', 'nodo esférico', 'nodos esféricos'],
        def: 'Lugar de un orbital donde la probabilidad de hallar al electrón es cero.',
        ejemplos: ['El 2s del hidrógeno tiene un nodo esférico a 2 a₀ del núcleo.', 'El 1s no tiene nodos.', 'El 3s tiene dos nodos esféricos.'], ver: ['orbital', 'plano nodal'] },
      { termino: 'plano nodal', formas: ['plano nodal', 'planos nodales'],
        def: 'Plano que pasa por el núcleo y en el que un orbital no tiene ningún punto.',
        ejemplos: ['El 2pz tiene uno: el plano xy.', 'Un orbital s no tiene ninguno.', 'El 3dxy tiene dos.'], ver: ['nodo'] },
      { termino: 'radio de Bohr', formas: ['radio de Bohr', 'radios de Bohr'], simbolo: 'a₀', medida: 'pm',
        def: 'Unidad de distancia dentro del átomo de hidrógeno: 52,9 pm. En un milímetro caben unos 19 millones.',
        ejemplos: ['1 a₀ = 52,9 pm.', 'El 1s del hidrógeno es más probable a 1 a₀ del núcleo.', 'El nodo del 2s está a 2 a₀.'], ver: ['orbital'] },
    ],
    // Laboratorio (docs/teoria.md §4b): mesas sin preguntas. La 3D (la nube del orbital) va primera. La segunda abre los rangos de la idea 1 (hasta Z = 20 y
    // cargas de ±3); la tercera junta la configuración de un ion con sus desapareados. La lectura dice la especie y
    // lo que resulta, para que un caso guardado se lea solo.
    laboratorio: [
      {
        // Exploración libre en 3D (decisión de Gerson, 15 nov: sin predicciones; los retos son invitaciones).
        // La nube, los nodos y el r90 salen del motor de plantillas/atomo-y-tabla (orbital, nube): solo el hidrógeno.
        id: 'nube-orbital', titulo: 'La nube del orbital', pieza: 'quim-orbital-3d',
        consigna: 'La nube se arma sola, medida a medida: cada punto es un lugar probable del electrón. Gírala, córtala y compara tamaños en radios de Bohr.',
        controles: [
          { id: 'orb', etiqueta: 'Orbital', opciones: MA.ORBITALES.map(k => ({ valor: k, texto: MA.orbital(k).nombre })) },
          { id: 'cor', etiqueta: 'Nube', opciones: [{ valor: 0, texto: 'Entera' }, { valor: 1, texto: 'Cortada' }] },
          { id: 'nod', etiqueta: 'Nodos', opciones: [{ valor: 0, texto: 'Ocultos' }, { valor: 1, texto: 'A la vista' }] },
          { id: 'esc', etiqueta: 'Tamaño', opciones: [{ valor: 1, texto: 'Ampliado' }, { valor: 0, texto: 'Misma escala' }] },
          { id: 't', etiqueta: 't', min: 0, max: 8, paso: 0.5, inicio: 8, unidad: 's', decimales: 1, auto: { velocidad: 1 } },
        ],
        dibujo: v => nubeDe(v),
        lectura: v => { const o = MA.orbital(v.orb); return [`${nubeDe(v).datos.medidas} puntos · ${o.nombre}: ${o.nodos} ${o.nodos === 1 ? 'nodo' : 'nodos'} · 90 % dentro de ${f(o.r90, 1)} a₀`]; },
        // Retos comprobados con el mismo motor que arma la nube (docs/teoria.md §4d).
        invitaciones: [
          { texto: 'Corta la nube y encuentra un orbital con un hueco esférico por dentro.',
            logrado: v => v.cor === 1 && MA.orbital(v.orb).nodosRadiales >= 1,
            bien: 'Ese hueco es un nodo: ahí el electrón no aparece nunca.',
            pista: 'Prueba los orbitales s de n = 2 o 3, con la nube cortada.' },
          { texto: 'Busca un orbital con dos planos nodales: planos sin un solo punto.',
            logrado: v => MA.orbital(v.orb).planos.length === 2,
            bien: 'Dos planos nodales y cuatro lóbulos, como un trébol: es un orbital d.',
            pista: 'Enciende los nodos y recorre los orbitales 3d.' },
          { texto: 'Pon un orbital p con sus dos lóbulos sobre el eje z.',
            logrado: v => MA.orbital(v.orb).l === 1 && MA.orbital(v.orb).eje === 'z',
            bien: 'ψ es la onda del electrón: cada lóbulo lleva su signo, + o −, y no una carga.',
            pista: 'Mira los rótulos x, y, z y elige el p que va por z.' },
          { texto: 'A la misma escala, encuentra el orbital más grande de la lista.',
            logrado: v => v.esc === 0 && v.orb === MA.mayorOrbital(),
            bien: 'Con n crece la nube. Córtalo: ¿cuántos nodos esconde?',
            pista: 'Deja «Misma escala» y compara los orbitales de n = 3.' },
          { texto: 'Guarda un 2p y un 3p del mismo eje, a la misma escala.',
            logrado: (v, guardados) => guardados.some(a => guardados.some(b => {
              const x = MA.orbital(a.orb), y = MA.orbital(b.orb);
              return a.esc === 0 && b.esc === 0 && x.l === 1 && y.l === 1 && x.eje === y.eje && x.n === 2 && y.n === 3;
            })),
            bien: 'Tiene la misma forma, pero es más grande, y el 3p esconde un nodo esférico.',
            pista: 'Guarda el 2pz, cambia al 3pz y guárdalo también.' },
        ],
      },
      {
        id: 'arma-ion', titulo: 'Arma cualquier átomo o ion', pieza: 'quim-atomo',
        consigna: 'Elige protones, neutrones y carga hasta el calcio. Saca o trae electrones con la manija y mira qué no cambia.',
        controles: [
          { id: 'z', etiqueta: 'Protones (Z)', color: 'c-o', min: 1, max: 20, paso: 1, inicio: 11, decimales: 0 },
          { id: 'n', etiqueta: 'Neutrones (N)', color: 'c-i', min: 0, max: 24, paso: 1, inicio: 12, decimales: 0 },
          { id: 'q', etiqueta: 'Carga', color: 'c-h', min: -3, max: 3, paso: 1, inicio: 0, decimales: 0 },
        ],
        dibujo: v => mesaIon(v),
        // Con su número de masa (²³Na): así el nitrógeno nunca sale como «N» suelto junto a los neutrones.
        lectura: v => (v.q > v.z ? [`${NOMBRE[v.z]}: no tiene ${v.q} electrones que perder`]
          : [Pz(`${v.z} p⁺`), ', ', Nn(`${v.n} n⁰`), ' y ', Ee(`${v.z - v.q} e⁻`), ` → ${nuclido(v.z, v.z + v.n, v.q)}, `, A, ` = ${v.z + v.n}`]),
        arrastres: [{ id: 'carga', etiqueta: 'carga: a la derecha salen electrones', color: 'c-f',
          donde: v => manijaCarga(mesaIon(v), v.q),
          mover: (pt, v) => ({ q: cargaEn(mesaIon(v), pt) }) }],
        // Retos comprobados (docs/teoria.md §4d): miden protones, neutrones y carga, lo mismo que arma el dibujo.
        invitaciones: [
          { texto: 'Arma otro isótopo del sodio: mismo número atómico, número de masa 25.',
            logrado: v => v.z === 11 && v.z + v.n === 25 && v.q <= v.z,
            bien: 'Tiene más neutrones y sigue siendo sodio, porque el elemento lo deciden los protones.' },
          { texto: 'Arma un anión con tantos electrones como el argón.',
            logrado: v => v.q < 0 && v.z - v.q === 18,
            bien: 'Tiene los mismos electrones que el argón y otro núcleo: son isoelectrónicos.' },
          { texto: 'Deja un catión sin un solo electrón.',
            logrado: v => v.q > 0 && v.z - v.q === 0,
            bien: 'Solo queda el núcleo, así que la carga es igual al número de protones.' },
          { texto: 'Guarda dos núcleos de elementos distintos con el mismo número de masa.',
            logrado: (v, guardados) => guardados.some(a => guardados.some(b => a.z !== b.z && a.z + a.n === b.z + b.n)),
            bien: 'Mismo A, distinto Z: son isóbaros, núcleos de elementos diferentes.' },
        ],
      },
      {
        id: 'cajas-ion', titulo: 'Las cajas de un ion', pieza: 'quim-cajas',
        consigna: 'Elige el elemento y su carga: sale su configuración electrónica. Lleva la última flecha a otra caja y mira los electrones solos.',
        controles: [
          { id: 'z', etiqueta: 'Z', color: 'c-o', min: 1, max: 20, paso: 1, inicio: 17, decimales: 0 },
          { id: 'q', etiqueta: 'Carga', color: 'c-h', min: -3, max: 3, paso: 1, inicio: 0, decimales: 0 },
        ],
        dibujo: v => dibIon(v),
        lectura: v => (v.z - v.q < 0 ? [`${NOMBRE[v.z]}: no tiene ${v.q} electrones que perder`] : v.z === v.q ? [`${SIMB_Q(v.z, v.q)}: sin electrones, no hay cajas que llenar`]
          : [`${SIMB_Q(v.z, v.q)}: ${v.z - v.q} `, e, ` → ${textoConfig(configEspecie(v.z, v.q))}`]),
        arrastres: [{ id: 'ultimo', etiqueta: 'último electrón: llévalo a otra caja', color: 'c-f',
          donde: v => sitioFlecha(Math.max(1, v.z - v.q)),
          mover: (pt, v) => ({ q: v.z - masCercana(pt, 23) }) }],
        // Retos: los electrones solos y el último subnivel salen de config() y solos(), lo mismo que pinta las cajas.
        invitaciones: [
          { texto: 'Encuentra un catión con todos sus electrones apareados.',
            logrado: v => v.q > 0 && v.z - v.q > 0 && solos(configEspecie(v.z, v.q)) === 0,
            bien: 'Ninguna flecha sola: a ese catión no lo atrae un imán. ¿Le pasa a todo catión?' },
          { texto: 'Busca la especie con más electrones desapareados que puedas armar.',
            logrado: v => v.z - v.q > 0 && solos(configEspecie(v.z, v.q)) === MAX_SOLOS,
            bien: 'Una flecha por caja antes de aparear: así reparte Hund.' },
          { texto: 'Haz que el último electrón caiga en una caja 4s.',
            logrado: v => { const c = v.z - v.q > 0 ? configEspecie(v.z, v.q) : []; return c.length > 0 && c[c.length - 1].nom === '4s'; },
            bien: 'El 4s se llena antes que el 3d: tiene menos energía.' },
          { texto: 'Guarda dos especies distintas con la misma configuración del neón.',
            logrado: (v, guardados) => guardados.some(a => guardados.some(b => a.z !== b.z && a.z - a.q === 10 && b.z - b.q === 10)),
            bien: 'Son isoelectrónicas: tienen las mismas cajas y distinto núcleo.' },
        ],
      },
    ],
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea). Una lista vacía:
    // la mesa no practica ninguna idea de la unidad y va en «Más mesas del tema».
    laboratorioIdeas: {
      'nube-orbital': ['numeros-cuanticos'],
      'arma-ion': ['nucleo-identidad'],
      'cajas-ion': ['configuracion-iones', 'desapareados-isoelectronicos'],
    },
    ideas: [nucleo, modelos, cuanticos, configuracion, configIones, desapareados],
  };
  // Para las pruebas (no se enumera): la abreviada y la configuración de la teoría, para compararlas con el generador.
  Object.defineProperty(def, '_quim', { value: { abreviada, configEspecie, textoConfig } });
  return def;
});
