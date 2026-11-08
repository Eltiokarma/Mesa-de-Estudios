/*
 * Generador: configuración electrónica, lugar en la tabla, iones y vida media, hasta Z = 86.
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['configuracion-ubicacion']) y en Node (require). No usa ningún motor: el de
 * plantillas/atomo-y-tabla/ (Z = 1 a 36) no se toca; aquí se siguen sus mismas convenciones.
 *
 * Tipos de pregunta (campo _datos.tipo):
 *   ubicar        Z de 37 a 86 (bloques p y d, sin lantánidos): periodo y grupo (1 a 18 y A/B).
 *   familia       cuatro o cinco pares de números atómicos: ¿cuál par es de la misma familia (grupo)?
 *   cation        configuración abreviada de un catión (de transición o del bloque p).
 *   anion         configuración abreviada de un anión (Br⁻, I⁻, Se²⁻, Te²⁻, At⁻).
 *   desapareados  electrones desapareados de un ion o de un átomo (con Hund).
 *   anomala       configuración abreviada de Cr, Cu, Mo, Ag o Au.
 *   cuanticos     (n; ℓ; mₗ; mₛ) del último electrón de un átomo neutro con Z de 37 a 86.
 *   contar        cuántos electrones de un átomo neutro tienen ℓ = 0, 1 o 2.
 *   particulas    neutrones y electrones de un ion con su número de masa A.
 *   atomo-ion     electrones y configuración de un ion del cuerpo (Na⁺, K⁺, Mg²⁺, Ca²⁺, Li⁺, Cl⁻) frente al átomo.
 *   vida-media    subtipo 'queda' (masa que queda tras t = n vidas medias), 'tiempo' (tiempo para que quede
 *                 m₀/2ⁿ, o para que se desintegre el 75 %, 87,5 % o 93,75 %) y 'lectura' (vida media a partir
 *                 de tres mediciones de la actividad: al inicio, a t₁ y a t₂).
 *
 * Convenciones (las mismas que plantillas/atomo-y-tabla/motor.js):
 *  - Llenado por la regla de Möller: 1s 2s 2p 3s 3p 4s 3d 4p 5s 4d 5p 6s 4f 5d 6p 7s (n + ℓ y, a igual n + ℓ, n).
 *  - Configuraciones anómalas declaradas: solo Cr, Cu, Mo, Ag y Au (un electrón del s de afuera pasa al d:
 *    Cr [Ar] 4s1 3d5, Cu [Ar] 4s1 3d10, Mo [Kr] 5s1 4d5, Ag [Kr] 5s1 4d10, Au [Xe] 6s1 4f14 5d10). El Pd NO
 *    se usa. Tampoco se usan, en preguntas de configuración, Nb, Ru, Rh, Pd y Pt (su configuración real no es la
 *    de Möller ni la de la tabla de anómalas) ni los lantánidos (Z = 57 a 71). En 'ubicar' sí entran Nb, Ru, Rh,
 *    Pd y Pt: su grupo sale igual con la regla.
 *  - Se escribe en el orden de llenado, también en los iones: "[Ar] 4s2 3d6", "[Xe] 6s1 4f14 5d10". La abreviada
 *    usa el gas noble más grande con MENOS electrones que la especie (I⁻: [Kr] 5s2 4d10 5p6, igual al Xe).
 *  - Cationes: salen primero los electrones de mayor n y, a igual n, los de mayor ℓ (5p antes que 5s; 4s antes
 *    que 3d). Aniones: los electrones entran siguiendo el orden de Möller.
 *  - Periodo = mayor n de la configuración. Grupo (1 a 18): bloque s, electrones ns; bloque p, 10 + ns + np;
 *    bloque d, ns + (n − 1)d. Notación A/B de academia: 1, 2 → IA, IIA; 3 a 7 → IIIB a VIIB; 8, 9, 10 → VIIIB;
 *    11, 12 → IB, IIB; 13 a 18 → IIIA a VIIIA. El texto es «periodo 5, grupo 17 (VIIA)».
 *  - Desapareados: en cada subnivel con k = 2ℓ + 1 orbitales y e electrones, min(e, 2k − e) (Hund).
 *  - Números cuánticos del último electrón: el último de la última subcapa escrita (orden de Möller). Las cajas se
 *    llenan de mₗ = −ℓ a +ℓ, primero con mₛ = +1/2 en cada caja y luego con mₛ = −1/2 (se dice en "datos").
 *    Texto «(5; 1; 0; −1/2)».
 *  - Partículas: protones Z, neutrones A − Z, electrones Z − carga. Los A son de isótopos naturales reales.
 *  - Vida media: queda m = m₀/2^(t/T). No hay masas molares en este generador.
 *  - Números con coma decimal y a lo más dos decimales (P.formatear); un distractor que no se escribe exacto con
 *    dos decimales se descarta.
 *  - Respuesta: p.respuesta.valor es un número (desapareados, contar, vida-media) o una clave de texto:
 *    'ub:P:G', 'fam:Za-Zb' (Za < Zb), 'conf:<configuración en texto plano>', 'qn:n:l:ml:+|-',
 *    'part:<neutrones>:<electrones>', 'ion:<electrones>|<configuración completa en texto plano>'.
 *  - Funciones exportadas (las usa papel.json): configuracion(Z, carga) → { texto, abreviada, desapareados };
 *    ubicacion(Z) → { periodo, grupo, grupoAB, bloque }; ultimoElectron(Z, carga) → { n, l, ml, ms };
 *    particulas(Z, A, carga) → { protones, neutrones, electrones }; contarL(Z, l); vidaQueda(m0, T, t) = m0/2^(t/T);
 *    vidaTiempo(T, fracción que queda) = T·log2(1/fracción).
 * FIN DE LA CABECERA: con lo de arriba se recalcula cada caso de casos.json sin leer el código.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const FUENTE = 'docs/investigacion/atomo-enlace-ideas-erroneas.md';
  const h = (id, extra, explicacion) => ({ id, ...extra, explicacion, respaldo: 'hipotesis', fuente: FUENTE });
  const v = P.v;
  const f = x => P.formatear(x, 2);

  // ---------- Elementos ----------
  const SIMBOLOS = ['', 'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S',
    'Cl', 'Ar', 'K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr',
    'Rb', 'Sr', 'Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn', 'Sb', 'Te', 'I', 'Xe', 'Cs', 'Ba',
    'La', 'Ce', 'Pr', 'Nd', 'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu', 'Hf', 'Ta', 'W', 'Re', 'Os',
    'Ir', 'Pt', 'Au', 'Hg', 'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn'];
  const NOMBRES = { 3: 'litio', 11: 'sodio', 12: 'magnesio', 17: 'cloro', 19: 'potasio', 20: 'calcio',
    22: 'titanio', 23: 'vanadio', 24: 'cromo', 25: 'manganeso', 26: 'hierro', 27: 'cobalto', 28: 'níquel', 29: 'cobre',
    30: 'zinc', 34: 'selenio', 35: 'bromo', 37: 'rubidio', 38: 'estroncio', 39: 'itrio', 40: 'circonio', 42: 'molibdeno',
    43: 'tecnecio', 47: 'plata', 48: 'cadmio', 49: 'indio', 50: 'estaño', 51: 'antimonio', 52: 'telurio', 53: 'yodo', 54: 'xenón',
    55: 'cesio', 56: 'bario', 72: 'hafnio', 73: 'tantalio', 74: 'wolframio', 75: 'renio', 76: 'osmio', 77: 'iridio',
    79: 'oro', 80: 'mercurio', 81: 'talio', 82: 'plomo', 83: 'bismuto', 84: 'polonio', 85: 'astato', 86: 'radón' };
  const zDe = s => SIMBOLOS.indexOf(s);
  const ZMAX = 86;
  const GASES_NOBLES = [2, 10, 18, 36, 54, 86];
  const EXCEPCIONES = { 24: 4, 29: 4, 42: 5, 47: 5, 79: 6 };
  const LANTANIDO = Z => Z >= 57 && Z <= 71;
  const SIN_CONFIG = [41, 44, 45, 46, 78];             // su configuración real no es la de la regla
  const conConfig = Z => !LANTANIDO(Z) && !SIN_CONFIG.includes(Z);
  const LETRA = 'spdf';

  // ---------- Configuración ----------
  const ORDEN = (() => {
    const r = [];
    for (let n = 1; n <= 7; n++) for (let l = 0; l < Math.min(n, 4); l++) r.push({ n, l });
    return r.sort((a, b) => (a.n + a.l) - (b.n + b.l) || a.n - b.n);
  })();
  const cap = l => 2 * (2 * l + 1);
  const idx = s => ORDEN.findIndex(o => o.n === s.n && o.l === s.l);
  const ordenar = c => c.filter(s => s.e > 0).sort((a, b) => idx(a) - idx(b));
  const clonar = c => c.map(s => ({ n: s.n, l: s.l, e: s.e }));
  const nom = s => `${s.n}${LETRA[s.l]}`;
  const plano = c => c.map(s => nom(s) + s.e).join(' ');
  const totalE = c => c.reduce((t, s) => t + s.e, 0);

  function moller(e) {
    const r = []; let resto = e;
    for (const o of ORDEN) { if (resto <= 0) break; const k = Math.min(cap(o.l), resto); r.push({ n: o.n, l: o.l, e: k }); resto -= k; }
    if (resto > 0) throw new Error('demasiados electrones');
    return r;
  }
  function neutro(Z, sinExcepcion = false) {
    const c = moller(Z), n = EXCEPCIONES[Z];
    if (n && !sinExcepcion) { c.find(x => x.n === n && x.l === 0).e -= 1; c.find(x => x.n === n - 1 && x.l === 2).e += 1; }
    return ordenar(c);
  }
  function quitarDeAfuera(c, k) {
    const r = clonar(c);
    for (let i = 0; i < k; i++) r.filter(s => s.e > 0).sort((a, b) => b.n - a.n || b.l - a.l)[0].e -= 1;
    return ordenar(r);
  }
  function quitarUltimos(c, k) {
    const r = ordenar(clonar(c));
    for (let i = 0; i < k; i++) r.filter(x => x.e > 0).pop().e -= 1;
    return ordenar(r);
  }
  function agregar(c, k) {
    const r = clonar(c);
    for (let i = 0; i < k; i++) {
      const o = ORDEN.find(x => { const s = r.find(y => y.n === x.n && y.l === x.l); return !s || s.e < cap(x.l); });
      const s = r.find(y => y.n === o.n && y.l === o.l);
      if (s) s.e += 1; else r.push({ n: o.n, l: o.l, e: 1 });
    }
    return ordenar(r);
  }
  function abreviar(c) {
    const e = totalE(c);
    for (const g of GASES_NOBLES.filter(z => z < e).reverse()) {
      const nucleo = moller(g);
      if (!nucleo.every(x => c.some(s => s.n === x.n && s.l === x.l && s.e === x.e))) continue;
      const resto = c.filter(s => !nucleo.some(x => x.n === s.n && x.l === s.l));
      return `[${SIMBOLOS[g]}] ${plano(resto)}`;
    }
    return plano(c);
  }
  const desap = c => c.reduce((t, s) => { const k = 2 * s.l + 1; return t + (s.e <= k ? s.e : 2 * k - s.e); }, 0);
  const desapSinHund = c => c.reduce((t, s) => t + (s.e % 2), 0);
  function configDe(Z, q) {
    const base = neutro(Z);
    return q > 0 ? quitarDeAfuera(base, q) : q < 0 ? agregar(base, -q) : base;
  }
  // configuracion(Z, carga) → { texto (completa), abreviada, desapareados, subcapas }
  function configuracion(Z, carga = 0) {
    const c = configDe(Z, carga);
    return { texto: plano(c), abreviada: abreviar(c), desapareados: desap(c), subcapas: c.map(s => ({ ...s, nombre: nom(s) })) };
  }

  // ---------- Ubicación ----------
  const ROM = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
  function grupoAB(G) {
    if (G <= 2) return ROM[G] + 'A';
    if (G <= 7) return ROM[G] + 'B';
    if (G <= 10) return 'VIIIB';
    if (G <= 12) return ROM[G - 10] + 'B';
    return ROM[G - 10] + 'A';
  }
  // De la notación A/B (número romano y letra) al grupo 1 a 18. VIIIB se toma como 8.
  function deAB(r, letra) {
    if (letra === 'A') return r <= 2 ? r : r + 10;
    return r === 1 ? 11 : r === 2 ? 12 : r;
  }
  const romanoDe = G => G <= 2 ? G : G <= 7 ? G : G <= 10 ? 8 : G - 10;
  function ubicacion(Z) {
    const c = neutro(Z), periodo = Math.max(...c.map(s => s.n)), ultima = c[c.length - 1], bloque = LETRA[ultima.l];
    const e = (n, l) => (c.find(s => s.n === n && s.l === l) || { e: 0 }).e;
    let grupo;
    if (Z === 2) grupo = 18;
    else if (bloque === 's') grupo = e(periodo, 0);
    else if (bloque === 'p') grupo = 10 + e(periodo, 0) + e(periodo, 1);
    else if (bloque === 'd') grupo = e(periodo, 0) + e(periodo - 1, 2);
    else grupo = 3;
    return { periodo, grupo, grupoAB: grupoAB(grupo), bloque };
  }
  const ELEMENTOS = [];
  for (let Z = 1; Z <= ZMAX; Z++) if (!LANTANIDO(Z)) ELEMENTOS.push({ Z, ...ubicacion(Z) });
  const elem = Z => ELEMENTOS.find(x => x.Z === Z);

  // ---------- Números cuánticos ----------
  function cuanticos(s, i) {
    const k = 2 * s.l + 1;
    return i <= k ? { n: s.n, l: s.l, ml: -s.l + i - 1, ms: 0.5 } : { n: s.n, l: s.l, ml: -s.l + i - k - 1, ms: -0.5 };
  }
  function ultimoElectron(Z, carga = 0) {
    const c = configDe(Z, carga), s = c[c.length - 1];
    return { subcapa: nom(s), e: s.e, ...cuanticos(s, s.e) };
  }

  // ---------- Partículas, conteo, vida media ----------
  const particulas = (Z, A, q) => ({ protones: Z, neutrones: A - Z, electrones: Z - q });
  const contarL = (Z, l) => neutro(Z).filter(s => s.l === l).reduce((t, s) => t + s.e, 0);
  const vidaQueda = (m0, T, t) => m0 / 2 ** (t / T);
  const vidaTiempo = (T, fraccionQueda) => T * Math.log2(1 / fraccionQueda);

  // ---------- Textos ----------
  const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  const sup = n => String(n).split('').map(d => SUP[+d]).join('');
  const bonito = t => t.replace(/([spdf])(\d+)/g, (m, l, d) => l + sup(d));
  const esp = (Z, q) => SIMBOLOS[Z] + (q === 0 ? '' : (Math.abs(q) === 1 ? '' : sup(Math.abs(q))) + (q > 0 ? '⁺' : '⁻'));
  const conf = t => ({ clave: 'conf:' + t, texto: bonito(t) });
  const ubTxt = (Pe, G) => ({ clave: `ub:${Pe}:${G}`, texto: `periodo ${Pe}, grupo ${G} (${grupoAB(G)})` });
  const famTxt = (a, b) => { const [x, y] = a < b ? [a, b] : [b, a]; return { clave: `fam:${x}-${y}`, texto: `Z = ${x} y Z = ${y}` }; };
  const msT = ms => (ms > 0 ? '+1/2' : '−1/2');
  const qnTxt = q => ({ clave: `qn:${q.n}:${q.l}:${q.ml}:${q.ms > 0 ? '+' : '-'}`,
    texto: `(${q.n}; ${q.l}; ${q.ml < 0 ? '−' + -q.ml : q.ml > 0 ? '+' + q.ml : 0}; ${msT(q.ms)})` });
  const partTxt = (n, e) => ({ clave: `part:${n}:${e}`, texto: `${n} neutrones y ${e} electrones` });
  const ionTxt = (e, c) => ({ clave: `ion:${e}|${c}`, texto: `${e} electrones; ${bonito(c)}` });
  const corto = x => Number.isFinite(x) && x > 0 && Math.abs(x * 100 - Math.round(x * 100)) < 1e-7;
  const nombreDe = Z => NOMBRES[Z] ? `del ${NOMBRES[Z]}` : `del elemento de Z = ${Z}`;
  const DATOS_MOLLER = 'Configuraciones en el orden de llenado (regla de Möller), abreviadas con el gas noble anterior.';

  // ---------- Armado ----------
  function generar(semilla) {
    const rng = Azar.crear('configuracion-ubicacion|' + semilla);
    const tipo = rng.elegir(['ubicar', 'ubicar', 'ubicar', 'familia', 'familia', 'cation', 'cation', 'cation', 'anion',
      'desapareados', 'desapareados', 'anomala', 'anomala', 'cuanticos', 'cuanticos', 'contar', 'particulas', 'particulas',
      'atomo-ion', 'vida-media', 'vida-media', 'vida-media']);
    for (let intento = 0; intento < 500; intento++) {
      const p = CONSTRUIR[tipo](rng, semilla);
      if (p && p.alternativas.length >= 4) return p;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }
  function cerrar(rng, semilla, o) {
    let alternativas;
    if (o.numero) {
      const errores = o.errores.filter(e => o.ceroVale ? Number.isInteger(e.valor) && e.valor >= 0 : corto(e.valor));
      alternativas = P.armar({ correcta: o.correcta, errores, rng, negativos: !!o.ceroVale, texto: o.texto, unidad: o.unidad || '' });
    } else {
      alternativas = P.armarTexto({ correcta: o.correcta, errores: o.errores, rng });
    }
    return { id: `configuracion-ubicacion#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta,
      datos: o.datos || '', alternativas, solucion: o.solucion,
      respuesta: { valor: o.numero ? o.correcta : o.correcta.clave, unidad: o.unidad || '' }, _datos: o._datos };
  }

  // ---- ubicar ----
  function ubicar(rng, semilla) {
    const cand = ELEMENTOS.filter(x => x.Z > 36 && (x.bloque === 'p' || x.bloque === 'd') && x.grupo !== 18);
    const el = rng.elegir(cand), Z = el.Z, c = neutro(Z), ab = abreviar(c), ult = c[c.length - 1];
    const Pe = el.periodo, G = el.grupo, r = romanoDe(G), letra = grupoAB(G).slice(-1);
    const e = (n, l) => (c.find(s => s.n === n && s.l === l) || { e: 0 }).e;
    const errores = [];
    if (r <= 7) {
      const sw = ubTxt(r, deAB(Pe, letra));
      errores.push(h('QA-grupo-periodo-intercambiados', sw, `Intercambiaste grupo y periodo. El periodo es el mayor nivel n (${Pe}); el número del grupo sale de los electrones de valencia (${grupoAB(G)}).`));
    }
    if (el.bloque === 'd') {
      errores.push(h('QA-periodo-del-ultimo-subnivel', ubTxt(ult.n, G), `Tomaste como periodo el n del último subnivel que se llena (${nom(ult)}). El periodo es el mayor nivel que tiene electrones: ${Pe}s, así que es el periodo ${Pe}.`));
      errores.push(h('QA-grupo-solo-ultimo-subnivel', ubTxt(Pe, ult.e), `Contaste solo los ${ult.e} electrones del ${nom(ult)}. En el bloque d el grupo es ns + (n − 1)d: ${e(Pe, 0)} + ${ult.e} = ${G}.`));
      errores.push(h('QA-grupo-solo-s', ubTxt(Pe, e(Pe, 0)), `Contaste solo los electrones del ${Pe}s, como si fuera del bloque s. Termina en d: es un metal de transición y su grupo suma también los electrones d.`));
    } else {
      const sp = e(Pe, 0) + e(Pe, 1);
      errores.push(h('QA-grupo-solo-ultimo-subnivel', ubTxt(Pe, deAB(ult.e, 'A')), `Contaste solo los ${ult.e} electrones del ${nom(ult)}. Los electrones de valencia del bloque p son los de ${Pe}s más los de ${Pe}p: ${e(Pe, 0)} + ${e(Pe, 1)} = ${sp}.`));
      errores.push(h('QA-grupo-a-sin-diez', ubTxt(Pe, sp), `Contaste bien ${sp} electrones de valencia, pero «${sp}» en la numeración de 1 a 18 es un grupo B (de transición). Termina en p: es el grupo ${ROM[sp]}A, que es el ${10 + sp}.`));
    }
    const variables = { Z: { nombre: 'número atómico', color: 'o' }, per: { nombre: 'periodo', color: 'i' }, gr: { nombre: 'grupo', color: 'h' } };
    const solucion = [
      ['Configuración: ', v('Z', `Z = ${Z}`), ` → ${bonito(ab)}.`],
      ['El mayor nivel con electrones es n = ', v('per', String(Pe)), ': periodo ', v('per', String(Pe)), '.'],
      el.bloque === 'd'
        ? [`Termina en ${bonito(nom(ult) + ult.e)}: bloque d. Grupo = ${Pe}s + ${Pe - 1}d = ${e(Pe, 0)} + ${ult.e} = `, v('gr', `${G} (${grupoAB(G)})`), '.']
        : [`Termina en ${bonito(nom(ult) + ult.e)}: bloque p. Electrones de valencia ${e(Pe, 0)} + ${e(Pe, 1)} = ${e(Pe, 0) + e(Pe, 1)}: grupo `, v('gr', `${grupoAB(G)} (${G})`), '.'],
    ];
    return cerrar(rng, semilla, { correcta: ubTxt(Pe, G), errores, variables, solucion,
      enunciado: ['Un elemento tiene ', v('Z', `número atómico ${Z}`), '.'],
      pregunta: ['¿En qué ', v('per', 'periodo'), ' y en qué ', v('gr', 'grupo'), ' de la tabla periódica está?'],
      datos: DATOS_MOLLER, _datos: { tipo: 'ubicar', Z } });
  }

  // ---- familia ----
  const companero = G => G >= 13 ? G - 10 : G <= 2 ? G + 10 : G <= 7 ? G + 10 : G >= 11 ? G - 10 : null;
  function familia(rng, semilla) {
    const G = rng.elegir([1, 2, 13, 14, 15, 16, 17, 4, 5, 6, 7, 11, 12]);
    const enG = ELEMENTOS.filter(x => x.grupo === G && x.Z > 2);
    const bajos = enG.filter(x => x.periodo <= 4), altos = enG.filter(x => x.Z > 36);
    if (!bajos.length || !altos.length) return null;
    const a = rng.elegir(bajos), b = rng.elegir(altos);
    const errores = [];
    const vecinos = ELEMENTOS.filter(x => x.periodo === b.periodo && x.grupo !== G && Math.abs(x.Z - b.Z) <= 2);
    if (vecinos.length) { const x = rng.elegir(vecinos);
      errores.push(h('QA-familia-mismo-periodo', famTxt(b.Z, x.Z), `Z = ${Math.min(b.Z, x.Z)} y Z = ${Math.max(b.Z, x.Z)} están en el mismo periodo (${b.periodo}), es decir, en la misma fila. Una familia es una columna: mismo grupo.`)); }
    const G2 = companero(G), otro = G2 && ELEMENTOS.find(x => x.periodo === b.periodo && x.grupo === G2);
    if (otro) errores.push(h('QA-familia-A-con-B', famTxt(a.Z, otro.Z), `Z = ${a.Z} es del grupo ${grupoAB(G)} y Z = ${otro.Z} del ${grupoAB(G2)}: tienen el mismo número romano, pero uno es A y el otro B. Son familias distintas.`));
    const ocho = elem(a.Z + 8);
    if (ocho && ocho.grupo !== G) errores.push(h('QA-familia-sumar-ocho', famTxt(a.Z, a.Z + 8), `Sumaste 8 a Z = ${a.Z}, como si todos los periodos tuvieran 8 elementos. Desde el cuarto periodo hay 18 por fila: Z = ${a.Z + 8} es del grupo ${grupoAB(ocho.grupo)}.`));
    const sA = neutro(a.Z).filter(s => s.l === 0).pop().e;
    const mismaS = a.bloque === 'p' ? [] : ELEMENTOS.filter(x => x.Z > 36 && x.grupo !== G && conConfig(x.Z) && x.bloque !== 's' &&
      neutro(x.Z).filter(s => s.l === 0).pop().e === sA);
    if (mismaS.length) { const x = rng.elegir(mismaS);
      errores.push(h('QA-familia-mismo-ns', famTxt(a.Z, x.Z), `Los dos tienen s${sup(sA)} en su nivel de afuera, pero Z = ${x.Z} tiene además electrones ${x.bloque} que cuentan: es del grupo ${grupoAB(x.grupo)}, no del ${grupoAB(G)}.`)); }
    const correcta = famTxt(a.Z, b.Z);
    const p = cerrar(rng, semilla, { correcta, errores: rng.barajar(errores), variables: { Z: { nombre: 'números atómicos', color: 'o' }, gr: { nombre: 'grupo', color: 'h' } },
      enunciado: ['Se dan varios pares de elementos por su ', v('Z', 'número atómico'), '.'],
      pregunta: ['¿Cuál par pertenece a la misma familia (el mismo ', v('gr', 'grupo'), ')?'],
      datos: DATOS_MOLLER,
      solucion: [
        [v('Z', `Z = ${a.Z}`), ` → ${bonito(abreviar(neutro(a.Z)))}: periodo ${a.periodo}, grupo `, v('gr', grupoAB(G)), '.'],
        [v('Z', `Z = ${b.Z}`), ` → ${bonito(abreviar(neutro(b.Z)))}: periodo ${b.periodo}, grupo `, v('gr', grupoAB(G)), '.'],
        ['Mismo grupo y distinto periodo: son de la misma familia. Una familia es una columna de la tabla, no una fila.'],
      ], _datos: { tipo: 'familia', pares: [] } });
    p._datos.pares = p.alternativas.map(x => x.valor.slice(4).split('-').map(Number));
    return p;
  }

  // ---- cation ----
  const CATIONES = [['Ti', 2], ['V', 3], ['Cr', 3], ['Cr', 2], ['Mn', 2], ['Fe', 2], ['Fe', 3], ['Co', 2], ['Co', 3], ['Ni', 2],
    ['Cu', 1], ['Cu', 2], ['Zn', 2], ['Mo', 3], ['Ag', 1], ['Cd', 2], ['Sn', 2], ['Sn', 4], ['Sb', 3], ['Au', 1], ['Au', 3],
    ['Hg', 2], ['Tl', 1], ['Pb', 2], ['Pb', 4], ['Bi', 3]];
  function erroresCation(Z, q) {
    const base = neutro(Z), out = [];
    out.push(h('QA-ion-quita-ultimos-llenados', conf(abreviar(quitarUltimos(base, q))), `Quitaste los electrones que entraron al final (los del ${nom(base[base.length - 1])}). Al formar un catión salen primero los de mayor n: los del nivel de afuera, aunque se hayan llenado antes.`));
    out.push(h('QA-ion-config-del-atomo', conf(abreviar(base)), `Esa es la configuración del átomo neutro. El ion ${esp(Z, q)} tiene ${q} ${q > 1 ? 'electrones' : 'electrón'} menos.`));
    if (q > 1) out.push(h('QA-ion-quita-uno-de-s', conf(abreviar(quitarUltimos(quitarDeAfuera(base, 1), q - 1))), 'Quitaste un electrón del nivel de afuera y los demás de los últimos en llenarse. Todos salen primero del nivel de mayor n, hasta vaciarlo.'));
    if (EXCEPCIONES[Z]) out.push(h('QA-ignora-anomalia', conf(abreviar(quitarDeAfuera(neutro(Z, true), q))), `Partiste de la configuración sin la anomalía. El ${NOMBRES[Z]} tiene un solo electrón en el s de afuera (${bonito(abreviar(base))}); de ahí se quitan los electrones.`));
    out.push(h('QA-ion-suma-carga', conf(abreviar(agregar(base, q))), `Agregaste ${q} ${q > 1 ? 'electrones' : 'electrón'}. La carga positiva quiere decir que el ion PERDIÓ electrones.`));
    if (q > 1) out.push(h('QA-ion-quita-solo-uno', conf(abreviar(quitarDeAfuera(base, 1))), `Quitaste un solo electrón. La carga ${q}+ dice que salen ${q}.`));
    return out;
  }
  function cation(rng, semilla) {
    const [s, q] = rng.elegir(CATIONES), Z = zDe(s), c = configDe(Z, q), base = neutro(Z);
    const variables = { Z: { nombre: 'número atómico', color: 'o' }, q: { nombre: 'carga', color: 'h' }, c: { nombre: 'configuración', color: 'd' } };
    const afuera = Math.max(...base.map(x => x.n));
    return cerrar(rng, semilla, { correcta: conf(abreviar(c)), errores: erroresCation(Z, q), variables,
      enunciado: [`El ion ${esp(Z, q)} viene ${nombreDe(Z)} (`, v('Z', `Z = ${Z}`), ') y tiene carga ', v('q', `${q}+`), '.'],
      pregunta: ['¿Cuál es su ', v('c', 'configuración electrónica'), '?'], datos: DATOS_MOLLER,
      solucion: [
        ['Átomo neutro: ', v('Z', `Z = ${Z}`), ` → ${bonito(abreviar(base))}${EXCEPCIONES[Z] ? ' (configuración anómala: un electrón del s pasó al d)' : ''}.`],
        ['Carga ', v('q', `${q}+`), `: salen ${q} ${q > 1 ? 'electrones' : 'electrón'}, primero del nivel de mayor n (n = ${afuera}) y, dentro de él, del subnivel de mayor ℓ.`],
        [`${esp(Z, q)}: `, v('c', bonito(abreviar(c))), '.'],
      ], _datos: { tipo: 'cation', Z, carga: q } });
  }

  // ---- anion ----
  const ANIONES = [['Br', -1], ['I', -1], ['Se', -2], ['Te', -2], ['At', -1]];
  function anion(rng, semilla) {
    const [s, q] = rng.elegir(ANIONES), Z = zDe(s), k = -q, base = neutro(Z), c = configDe(Z, q);
    const ult = base[base.length - 1];
    const nueva = clonar(base); nueva.push({ n: ult.n + 1, l: 0, e: k });
    const errores = [
      h('QA-ion-config-del-atomo', conf(abreviar(base)), `Esa es la configuración del átomo neutro. El ion ${esp(Z, q)} ganó ${k} ${k > 1 ? 'electrones' : 'electrón'}.`),
      h('QA-anion-quita', conf(abreviar(quitarDeAfuera(base, k))), `Quitaste electrones. La carga negativa quiere decir que el ion GANÓ electrones.`),
      h('QA-anion-capa-nueva', conf(abreviar(ordenar(nueva))), `Pusiste los electrones nuevos en el ${ult.n + 1}s. Todavía hay lugar en el ${nom(ult)}: los electrones entran ahí hasta completarlo.`),
    ];
    if (k > 1) errores.push(h('QA-ion-quita-solo-uno', conf(abreviar(agregar(base, 1))), `Agregaste un solo electrón. La carga ${k}− dice que entran ${k}.`));
    const variables = { Z: { nombre: 'número atómico', color: 'o' }, q: { nombre: 'carga', color: 'h' }, c: { nombre: 'configuración', color: 'd' } };
    const gas = SIMBOLOS[Z + k];
    return cerrar(rng, semilla, { correcta: conf(abreviar(c)), errores, variables,
      enunciado: [`El ion ${esp(Z, q)} viene ${nombreDe(Z)} (`, v('Z', `Z = ${Z}`), ') y tiene carga ', v('q', `${k}−`), '.'],
      pregunta: ['¿Cuál es su ', v('c', 'configuración electrónica'), '?'], datos: DATOS_MOLLER,
      solucion: [
        ['Átomo neutro: ', v('Z', `Z = ${Z}`), ` → ${bonito(abreviar(base))}.`],
        ['Carga ', v('q', `${k}−`), `: entran ${k} ${k > 1 ? 'electrones' : 'electrón'} al ${nom(ult)}, que queda lleno.`],
        [`${esp(Z, q)}: `, v('c', bonito(abreviar(c))), `, con ${Z + k} electrones, igual que el ${gas}.`],
      ], _datos: { tipo: 'anion', Z, carga: q } });
  }

  // ---- desapareados ----
  const ESPECIES_D = [...CATIONES, ['Cr', 0], ['Cu', 0], ['Mo', 0], ['Ag', 0], ['Au', 0], ['Fe', 0], ['Co', 0], ['Mn', 0],
    ['Tc', 0], ['W', 0], ['Os', 0], ['Ir', 0], ['Re', 0], ['Te', 0], ['I', 0], ['Sb', 0], ['Se', -2], ['I', -1]];
  function desapareados(rng, semilla) {
    const [s, q] = rng.elegir(ESPECIES_D), Z = zDe(s), base = neutro(Z), c = configDe(Z, q), correcta = desap(c);
    const errores = [
      h('QA-desap-sin-hund', { valor: desapSinHund(c) }, 'Apareaste los electrones antes de ocupar todas las cajas. Por la regla de Hund, cada orbital del subnivel recibe primero un electrón; recién después se aparean.'),
    ];
    if (q > 0) {
      errores.push(h('QA-ion-quita-ultimos-llenados', { valor: desap(quitarUltimos(base, q)) }, 'Quitaste los electrones que entraron al final. En un catión salen primero los del nivel de mayor n; con la configuración bien hecha cambian los desapareados.'));
      errores.push(h('QA-ion-config-del-atomo', { valor: desap(base) }, `Contaste los desapareados del átomo neutro. El ion ${esp(Z, q)} perdió ${q} ${q > 1 ? 'electrones' : 'electrón'}.`));
    }
    if (q < 0) errores.push(h('QA-ion-config-del-atomo', { valor: desap(base) }, `Contaste los desapareados del átomo neutro. El ion ${esp(Z, q)} ganó ${-q} ${q < -1 ? 'electrones' : 'electrón'}.`));
    if (EXCEPCIONES[Z]) errores.push(h('QA-ignora-anomalia', { valor: desap(quitarDeAfuera(neutro(Z, true), Math.max(q, 0))) }, `No aplicaste la anomalía del ${NOMBRES[Z]}: un electrón del s pasa al d (${bonito(abreviar(base))}).`));
    const ab = abreviar(c);
    const abiertos = c.filter(x => x.e < cap(x.l));
    errores.push(h('QA-desap-cuenta-electrones', { valor: abiertos.length ? abiertos[abiertos.length - 1].e : 0 }, 'Contaste todos los electrones del último subnivel incompleto. Desapareados son solo los que están solos en su caja.'));
    errores.push(h('QA-desap-cuenta-orbitales', { valor: abiertos.length ? 2 * abiertos[abiertos.length - 1].l + 1 : 1 }, 'Contaste los orbitales (las cajas) del subnivel, no los electrones que están solos en ellas.'));
    const variables = { Z: { nombre: 'número atómico', color: 'o' }, q: { nombre: 'carga', color: 'h' }, d: { nombre: 'desapareados', color: 'd' } };
    const detalle = c.filter(x => x.e < cap(x.l)).map(x => `${bonito(nom(x) + x.e)} en ${2 * x.l + 1} caja${x.l ? 's' : ''} → ${desap([x])}`).join('; ');
    return cerrar(rng, semilla, { numero: true, ceroVale: true, correcta, errores, texto: x => String(x), variables,
      enunciado: q === 0 ? [`Un átomo de ${NOMBRES[Z]} (`, v('Z', `Z = ${Z}`), ') está en su estado fundamental.']
        : [`El ion ${esp(Z, q)} (`, v('Z', `Z = ${Z}`), ', carga ', v('q', q > 0 ? `${q}+` : `${-q}−`), ') está en su estado fundamental.'],
      pregunta: ['¿Cuántos ', v('d', 'electrones desapareados'), ' tiene?'], datos: DATOS_MOLLER,
      solucion: [
        [`Configuración: ${bonito(ab)}.`],
        [detalle ? `Subniveles incompletos (Hund, una flecha por caja antes de aparear): ${detalle}.` : 'Todos los subniveles están llenos.'],
        ['Total: ', v('d', `${correcta} desapareado${correcta === 1 ? '' : 's'}`), correcta === 0 ? ' (diamagnético).' : '.'],
      ], _datos: { tipo: 'desapareados', Z, carga: q } });
  }

  // ---- anomala ----
  function anomala(rng, semilla) {
    const Z = rng.elegir([24, 29, 42, 47, 79]), c = neutro(Z), sin = neutro(Z, true), n = EXCEPCIONES[Z];
    const mismoN = x => abreviar(x).replace(new RegExp(`${n - 1}d`), `${n}d`);
    const errores = [
      h('QA-ignora-anomalia', conf(abreviar(sin)), `Seguiste la regla de llenado sin la anomalía. En el ${NOMBRES[Z]} un electrón del ${n}s pasa al ${n - 1}d: así el d queda ${c.find(x => x.l === 2 && x.n === n - 1).e === 5 ? 'semilleno' : 'lleno'}.`),
      h('QA-d-mismo-n', conf(mismoN(c)), `Escribiste el subnivel d con el mismo n que el s. El d que se llena junto al ${n}s es el ${n - 1}d (n − 1).`),
      h('QA-d-mismo-n', conf(mismoN(sin)), `Escribiste el subnivel d con el mismo n que el s y sin la anomalía. El d que va con el ${n}s es el ${n - 1}d, y en el ${NOMBRES[Z]} un electrón del s pasa al d.`),
    ];
    const d = c.find(x => x.l === 2 && x.n === n - 1);
    if (d.e === 5) { const dos = clonar(c); dos.find(x => x.l === 0 && x.n === n).e -= 1; dos.find(x => x.l === 2 && x.n === n - 1).e += 1;
      errores.push(h('QA-anomalia-dos-electrones', conf(abreviar(ordenar(dos))), `Pasaste los dos electrones del ${n}s al d. Pasa uno solo: con él, el d queda semilleno (cinco cajas con una flecha cada una).`)); }
    const variables = { Z: { nombre: 'número atómico', color: 'o' }, c: { nombre: 'configuración', color: 'd' } };
    return cerrar(rng, semilla, { correcta: conf(abreviar(c)), errores, variables,
      enunciado: [`Se estudia el ${NOMBRES[Z]} (`, v('Z', `Z = ${Z}`), ') en su estado fundamental.'],
      pregunta: ['¿Cuál es su ', v('c', 'configuración electrónica'), '?'],
      datos: 'Configuraciones en el orden de llenado, abreviadas con el gas noble anterior.',
      solucion: [
        [`Por la regla de llenado saldría ${bonito(abreviar(sin))}.`],
        [`El ${NOMBRES[Z]} es una de las configuraciones anómalas que se piden: un electrón del ${n}s pasa al ${n - 1}d, que queda ${d.e === 5 ? 'semilleno (d⁵)' : 'lleno (d¹⁰)'}.`],
        ['Configuración: ', v('c', bonito(abreviar(c))), `, con ${desap(c)} ${desap(c) === 1 ? 'electrón' : 'electrones'} desapareado${desap(c) === 1 ? '' : 's'}.`],
      ], _datos: { tipo: 'anomala', Z } });
  }

  // ---- cuanticos ----
  function cuanticosSinHund(s) { const i = s.e; return { n: s.n, l: s.l, ml: -s.l + Math.floor((i - 1) / 2), ms: i % 2 ? 0.5 : -0.5 }; }
  function cuanticosP(rng, semilla) {
    const el = rng.elegir(ELEMENTOS.filter(x => x.Z > 36 && conConfig(x.Z) && x.bloque !== 's'));
    const Z = el.Z, c = neutro(Z), s = c[c.length - 1], q = cuanticos(s, s.e);
    const errores = [];
    if (s.n !== el.periodo) errores.push(h('QA-cuanticos-n-del-periodo', qnTxt({ ...q, n: el.periodo }), `Pusiste n = ${el.periodo}, el periodo. El último electrón está en el ${nom(s)}: su n es ${s.n}.`));
    errores.push(h('QA-cuanticos-ml-desde-cero', qnTxt({ ...q, ml: q.ml + s.l }), `Numeraste las cajas desde mₗ = 0. Las cajas de un subnivel ${LETRA[s.l]} van de mₗ = −${s.l} a +${s.l}.`));
    errores.push(h('QA-cuanticos-ms-al-reves', qnTxt({ ...q, ms: -q.ms }), `Con la convención dada, ${q.ms > 0 ? 'ese electrón entra solo en su caja: flecha hacia arriba, mₛ = +1/2' : 'ese electrón se aparea con otro que ya estaba: flecha hacia abajo, mₛ = −1/2'}.`));
    const sh = cuanticosSinHund(s);
    errores.push(h('QA-cuanticos-sin-hund', qnTxt(sh), 'Llenaste cada caja con dos flechas antes de pasar a la siguiente. Por la regla de Hund, primero va una flecha en cada caja.'));
    errores.push(h('QA-cuanticos-l-desde-uno', qnTxt({ ...q, l: q.l + 1 }), `Le diste a ℓ el valor ${q.l + 1}, contando s = 1, p = 2, d = 3. Es s = 0, p = 1, d = 2, f = 3: para el ${nom(s)}, ℓ = ${s.l}.`));
    const variables = { Z: { nombre: 'número atómico', color: 'o' }, s: { nombre: 'último subnivel', color: 'i' }, q: { nombre: 'números cuánticos', color: 'd' } };
    const k = 2 * s.l + 1;
    return cerrar(rng, semilla, { correcta: qnTxt(q), errores: rng.barajar(errores), variables,
      enunciado: ['Un átomo neutro tiene ', v('Z', `Z = ${Z}`), '.'],
      pregunta: ['¿Cuáles son los ', v('q', 'números cuánticos (n; ℓ; mₗ; mₛ)'), ' de su último electrón?'],
      datos: 'Orden de llenado de Möller. En cada subnivel, las cajas se llenan de mₗ = −ℓ a mₗ = +ℓ: primero una flecha hacia arriba (mₛ = +1/2) en cada caja y luego las flechas hacia abajo (mₛ = −1/2).',
      solucion: [
        ['Configuración: ', v('Z', `Z = ${Z}`), ` → ${bonito(abreviar(c))}. El último subnivel escrito es el `, v('s', bonito(nom(s) + s.e)), '.'],
        [`n = ${s.n} y ℓ = ${s.l} (${LETRA[s.l]}). Hay ${k} caja${k > 1 ? 's' : ''}, de mₗ = −${s.l} a +${s.l}; el electrón número ${s.e} ${s.e <= k ? `es una flecha hacia arriba en la caja ${s.e}` : `es una flecha hacia abajo en la caja ${s.e - k}`}.`],
        ['Último electrón: ', v('q', qnTxt(q).texto), '.'],
      ], _datos: { tipo: 'cuanticos', Z } });
  }

  // ---- contar ----
  function contar(rng, semilla) {
    const el = rng.elegir(ELEMENTOS.filter(x => x.Z > 36 && conConfig(x.Z)));
    const Z = el.Z, l = rng.elegir([0, 1, 2]), c = neutro(Z), correcta = contarL(Z, l);
    const conL = c.filter(s => s.l === l);
    const errores = [
      h('QA-contar-subniveles', { valor: conL.length }, `Contaste cuántos subniveles ${LETRA[l]} hay, no cuántos electrones tienen.`),
      h('QA-contar-solo-ultimo-nivel', { valor: conL.length ? conL[conL.length - 1].e : 0 }, `Contaste solo los electrones del último subnivel ${LETRA[l]}. La pregunta pide todos los electrones con ℓ = ${l}, de todos los niveles.`),
      h('QA-contar-orbitales', { valor: conL.length * (2 * l + 1) }, `Contaste orbitales (cajas), no electrones. Cada orbital lleno tiene dos electrones.`),
    ];
    if (l >= 1) errores.push(h('QA-l-confunde-subnivel', { valor: contarL(Z, l - 1) }, `Contaste los electrones ${LETRA[l - 1]}, como si ℓ = ${l} fuera el subnivel ${LETRA[l - 1]}. ℓ = 0 es s, ℓ = 1 es p, ℓ = 2 es d.`));
    if (l <= 1) errores.push(h('QA-l-confunde-subnivel', { valor: contarL(Z, l + 1) }, `Contaste los electrones ${LETRA[l + 1]}. ℓ = 0 es s, ℓ = 1 es p, ℓ = 2 es d.`));
    if (EXCEPCIONES[Z]) errores.push(h('QA-ignora-anomalia', { valor: neutro(Z, true).filter(s => s.l === l).reduce((t, s) => t + s.e, 0) }, `No aplicaste la anomalía del ${NOMBRES[Z]}: un electrón del s pasa al d.`));
    const variables = { Z: { nombre: 'número atómico', color: 'o' }, l: { nombre: 'número cuántico ℓ', color: 'i' }, k: { nombre: 'electrones', color: 'd' } };
    return cerrar(rng, semilla, { numero: true, ceroVale: true, correcta, errores, texto: x => String(x), variables,
      enunciado: [`Un átomo neutro de ${NOMBRES[Z] || 'un elemento'} tiene `, v('Z', `Z = ${Z}`), '.'],
      pregunta: ['¿Cuántos ', v('k', 'electrones'), ' tienen número cuántico secundario ', v('l', `ℓ = ${l}`), '?'],
      datos: DATOS_MOLLER,
      solucion: [
        ['Configuración completa: ', `${bonito(plano(c))}.`],
        [v('l', `ℓ = ${l}`), ` son los subniveles ${LETRA[l]}: ${conL.map(s => bonito(nom(s) + s.e)).join(' + ') || 'ninguno'}.`],
        ['Suma: ', v('k', `${correcta} electrones`), '.'],
      ], _datos: { tipo: 'contar', Z, l } });
  }

  // ---- particulas ----
  const NUCLIDOS = [[35, 79, -1], [35, 81, -1], [37, 85, 1], [38, 88, 2], [47, 107, 1], [47, 109, 1], [48, 114, 2], [50, 120, 2],
    [50, 118, 4], [52, 128, -2], [52, 130, -2], [53, 127, -1], [55, 133, 1], [56, 138, 2], [56, 137, 2], [79, 197, 1], [79, 197, 3],
    [80, 202, 2], [82, 208, 2], [82, 206, 4], [34, 80, -2], [34, 78, -2]];
  function particulasP(rng, semilla) {
    const [Z, A, q] = rng.elegir(NUCLIDOS), pt = particulas(Z, A, q), n = pt.neutrones, e = pt.electrones;
    const errores = [
      h('QA-neutrones-resta-carga', partTxt(A - Z - q, e), `Restaste la carga a los neutrones. La carga solo cambia los electrones; los neutrones son A − Z = ${A} − ${Z}.`),
      h('QA-electrones-signo', partTxt(n, Z + q), q > 0 ? `Sumaste la carga a los electrones. Un catión ${q}+ perdió ${q} ${q > 1 ? 'electrones' : 'electrón'}: tiene ${Z} − ${q}.` : `Restaste electrones. Un anión ${-q}− ganó ${-q} ${q < -1 ? 'electrones' : 'electrón'}: tiene ${Z} + ${-q}.`),
      h('QA-electrones-ignora-carga', partTxt(n, Z), `Diste los electrones del átomo neutro (Z = ${Z}). El ion tiene carga: ${q > 0 ? 'perdió' : 'ganó'} electrones.`),
      h('QA-neutrones-menos-electrones', partTxt(A - e, e), `Para los neutrones restaste los electrones (A − e). Los neutrones son A menos los PROTONES: A − Z.`),
    ];
    const variables = { A: { nombre: 'número de masa', color: 'i' }, Z: { nombre: 'número atómico', color: 'o' }, q: { nombre: 'carga', color: 'h' }, r: { nombre: 'partículas', color: 'd' } };
    const qt = q > 0 ? `${q}+` : `${-q}−`;
    return cerrar(rng, semilla, { correcta: partTxt(n, e), errores, variables,
      enunciado: [`El ion ${sup(A)}${esp(Z, q)} tiene `, v('A', `A = ${A}`), ', ', v('Z', `Z = ${Z}`), ' y carga ', v('q', qt), '.'],
      pregunta: ['¿Cuántos ', v('r', 'neutrones y electrones'), ' tiene?'],
      solucion: [
        ['Neutrones: ', v('A', String(A)), ' − ', v('Z', String(Z)), ' = ', v('r', String(n)), '. La carga no cambia el núcleo.'],
        ['Electrones: ', v('Z', String(Z)), q > 0 ? ' − ' : ' + ', v('q', String(Math.abs(q))), ' = ', v('r', String(e)), q > 0 ? ' (un catión perdió electrones).' : ' (un anión ganó electrones).'],
      ], _datos: { tipo: 'particulas', Z, A, carga: q } });
  }

  // ---- atomo-ion ----
  const IONES_CUERPO = [
    [11, 1, 'El suero de rehidratación oral repone iones sodio'], [19, 1, 'El plátano aporta iones potasio'],
    [12, 2, 'Algunas aguas minerales traen iones magnesio'], [20, 2, 'La leche aporta iones calcio'],
    [3, 1, 'Algunos medicamentos contienen iones litio'], [17, -1, 'La sal de mesa aporta iones cloruro']];
  function atomoIon(rng, semilla) {
    const [Z, q, ctx] = rng.elegir(IONES_CUERPO), e = Z - q;
    const cIon = plano(configDe(Z, q)), cAt = plano(neutro(Z)), cRev = plano(neutro(Z + q));
    const errores = [
      h('QA-ion-como-atomo', ionTxt(Z, cAt), `Describiste el átomo neutro de ${NOMBRES[Z]}, no su ion. El ion ${esp(Z, q)} ${q > 0 ? 'perdió' : 'ganó'} ${Math.abs(q)} ${Math.abs(q) > 1 ? 'electrones' : 'electrón'}.`),
      h('QA-electrones-signo', ionTxt(Z + q, cRev), q > 0 ? `Sumaste la carga. Un ion con carga ${q}+ tiene ${q} ${q > 1 ? 'electrones' : 'electrón'} MENOS que el átomo.` : `Restaste la carga. Un ion con carga ${-q}− tiene ${-q} ${q < -1 ? 'electrones' : 'electrón'} MÁS que el átomo.`),
      h('QA-ion-config-sin-actualizar', ionTxt(e, cAt), `Contaste bien ${e} electrones, pero dejaste la configuración del átomo, que tiene ${Z}. La configuración debe sumar ${e}.`),
      h('QA-ion-electrones-sin-actualizar', ionTxt(Z, cIon), `La configuración es la del ion, pero suma ${e}, no ${Z}: el número de electrones tiene que coincidir con ella.`),
    ];
    const variables = { Z: { nombre: 'número atómico', color: 'o' }, q: { nombre: 'carga', color: 'h' }, e: { nombre: 'electrones del ion', color: 'd' } };
    const qt = `${Math.abs(q)}${q > 0 ? '+' : '−'}`;
    return cerrar(rng, semilla, { correcta: ionTxt(e, cIon), errores, variables,
      enunciado: [`${ctx}, ${esp(Z, q)}. El ${NOMBRES[Z]} tiene `, v('Z', `Z = ${Z}`), ' y el ion tiene carga ', v('q', qt), '.'],
      pregunta: ['¿Cuántos ', v('e', 'electrones'), ' tiene el ion y cuál es su configuración?'],
      datos: 'Configuración completa, en el orden de llenado.',
      solucion: [
        [`Átomo de ${NOMBRES[Z]}: `, v('Z', `${Z} electrones`), `, ${bonito(cAt)}.`],
        ['El ion tiene carga ', v('q', qt), `: ${q > 0 ? 'perdió' : 'ganó'} ${Math.abs(q)} ${Math.abs(q) > 1 ? 'electrones' : 'electrón'} ${q > 0 ? 'del' : 'en el'} nivel de afuera.`],
        [`${esp(Z, q)}: `, v('e', `${e} electrones`), `, ${bonito(cIon)}. El ion y el átomo tienen los mismos ${Z} protones, pero no son lo mismo.`],
      ], _datos: { tipo: 'atomo-ion', Z, carga: q } });
  }

  // ---- vida media ----
  const UNIDADES_T = ['horas', 'días', 'años'];
  function vidaMediaP(rng, semilla) {
    const sub = rng.elegir(['queda', 'tiempo', 'lectura']);
    const u = rng.elegir(UNIDADES_T), T = rng.elegir([2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30]);
    const variables = { m0: { nombre: 'masa inicial', color: 'o' }, T: { nombre: 'vida media', color: 'i' }, t: { nombre: 'tiempo', color: 'h' }, m: { nombre: 'lo que queda', color: 'd' } };
    const ctx = rng.elegir(['Un laboratorio guarda una muestra de un isótopo radiactivo', 'Un hospital recibe una muestra de un radioisótopo', 'Una fuente radiactiva de un equipo de medición contiene un isótopo']);
    if (sub === 'queda') {
      const m0 = rng.elegir([40, 48, 64, 80, 96, 120, 160, 200, 240, 320, 400, 480, 640]), n = rng.entero(2, 5), t = n * T, m = m0 / 2 ** n;
      if (!corto(m)) return null;
      const errores = [
        h('QA-vm-divide-entre-2n', { valor: m0 / (2 * n) }, `Dividiste entre 2 × ${n}. Cada vida media la masa se divide entre 2 otra vez: después de ${n} vidas medias se divide entre 2^${n} = ${2 ** n}.`),
        h('QA-vm-desintegrada', { valor: m0 - m }, `Esa es la masa que se desintegró. Lo que queda es ${f(m0)} − ${f(m0 - m)}.`),
        h('QA-vm-una-vida-de-mas', { valor: m0 / 2 ** (n + 1) }, `Contaste una vida media de más. En ${f(t)} ${u} caben ${f(t)} ÷ ${T} = ${n} vidas medias.`),
        h('QA-vm-una-vida-de-menos', { valor: m0 / 2 ** (n - 1) }, `Contaste una vida media de menos. En ${f(t)} ${u} caben ${f(t)} ÷ ${T} = ${n} vidas medias.`),
      ];
      return cerrar(rng, semilla, { numero: true, correcta: m, errores, unidad: 'g', variables,
        enunciado: [`${ctx}: hay `, v('m0', `${f(m0)} g`), ' y su vida media es de ', v('T', `${T} ${u}`), '.'],
        pregunta: ['¿Qué masa del isótopo ', v('m', 'queda sin desintegrar'), ' después de ', v('t', `${f(t)} ${u}`), '?'],
        solucion: [
          ['Vidas medias que pasan: ', v('t', f(t)), ' ÷ ', v('T', String(T)), ` = ${n}.`],
          [`Cada vida media queda la mitad: `, v('m0', f(m0)), ` → ${Array.from({ length: n }, (x, i) => f(m0 / 2 ** (i + 1))).join(' → ')} g.`],
          ['Queda ', v('m', `${f(m)} g`), ` (${f(m0)} ÷ ${2 ** n}).`],
        ], _datos: { tipo: 'vida-media', sub, m0, T, t, unidad: u } });
    }
    if (sub === 'tiempo') {
      const porcentaje = rng.moneda(), n = porcentaje ? rng.entero(2, 4) : rng.entero(2, 5);
      const m0 = rng.elegir([64, 80, 96, 160, 320, 480, 640]), m = m0 / 2 ** n, correcta = n * T;
      if (!corto(m)) return null;
      const pct = 100 * (1 - 1 / 2 ** n);
      const errores = [
        h('QA-vm-lineal', { valor: 2 * T * (1 - 1 / 2 ** n) }, `Supusiste que en cada vida media se desintegra la mitad de la masa INICIAL, siempre la misma cantidad. Se desintegra la mitad de lo que QUEDA: cada vez menos.`),
        h('QA-vm-multiplica-fraccion', { valor: T * 2 ** n }, `Multiplicaste la vida media por ${2 ** n}. Que quede 1/${2 ** n} quiere decir que la masa se partió por la mitad ${n} veces: ${n} vidas medias.`),
        h('QA-vm-una-vida-de-mas', { valor: (n + 1) * T }, `Contaste una vida media de más: de ${f(m0)} a ${f(m)} hay ${n} mitades.`),
        h('QA-vm-una-vida-de-menos', { valor: (n - 1) * T }, `Contaste una vida media de menos: de ${f(m0)} a ${f(m)} hay ${n} mitades.`),
      ];
      const pregunta = porcentaje
        ? ['¿Cuánto ', v('t', 'tiempo'), ' debe pasar para que se haya desintegrado el ', v('m', `${f(pct)} %`), ' de la muestra?']
        : ['¿Cuánto ', v('t', 'tiempo'), ' debe pasar para que queden ', v('m', `${f(m)} g`), '?'];
      return cerrar(rng, semilla, { numero: true, correcta, errores, unidad: u, variables,
        enunciado: [`${ctx}: hay `, v('m0', `${f(m0)} g`), ' y su vida media es de ', v('T', `${T} ${u}`), '.'],
        pregunta,
        solucion: [
          porcentaje ? ['Si se desintegró el ', v('m', `${f(pct)} %`), ` queda el ${f(100 - pct)} %: 1/${2 ** n} de la muestra (${f(m)} g).`]
            : ['Queda ', v('m', `${f(m)} g`), ' de ', v('m0', `${f(m0)} g`), `: 1/${2 ** n} de la muestra.`],
          [`1/${2 ** n} = (1/2)^${n}: la masa se partió por la mitad ${n} veces.`],
          ['Tiempo: ', `${n} × `, v('T', String(T)), ' = ', v('t', `${f(correcta)} ${u}`), '.'],
        ], _datos: { tipo: 'vida-media', sub, m0, T, n, porcentaje, unidad: u } });
    }
    // lectura: tres mediciones de la actividad
    const k1 = rng.entero(2, 3), k2 = rng.entero(1, 3), base = rng.elegir([5, 10, 15, 20, 25, 40]);
    const A0 = base * 2 ** (k1 + k2), A1 = base * 2 ** k2, A2 = base, t1 = k1 * T, t2 = (k1 + k2) * T;
    const errores = [
      h('QA-vm-lee-tiempo-sin-mitad', { valor: t1 }, `Tomaste como vida media los ${f(t1)} ${u} de la primera medición. Pero en ese tiempo la actividad no bajó a la mitad: bajó de ${A0} a ${A1}, a la ${A0 / A1 === 4 ? 'cuarta' : 'octava'} parte.`),
      h('QA-vm-divide-entre-fraccion', { valor: t1 / 2 ** k1 }, `Dividiste ${f(t1)} entre ${2 ** k1} porque quedó 1/${2 ** k1}. La actividad se partió por la mitad ${k1} veces: hay que dividir entre ${k1}.`),
      h('QA-vm-intervalo', { valor: t2 - t1 }, `Tomaste el tiempo entre las dos mediciones (${f(t2)} − ${f(t1)}). En ese tramo la actividad bajó de ${A1} a ${A2}, a 1/${2 ** k2}: son ${k2} mitades, no una.`),
      h('QA-vm-mitad-del-tiempo', { valor: t2 / 2 }, `Tomaste la mitad del tiempo total. La vida media es el tiempo en que la actividad baja a la mitad, no la mitad del tiempo.`),
    ];
    return cerrar(rng, semilla, { numero: true, correcta: T, errores, unidad: u, variables,
      enunciado: [`${ctx}. Un detector mide su actividad: al empezar, `, v('m0', `${A0} desintegraciones por minuto`), '; a los ', v('t', `${f(t1)} ${u}`), ', ', v('m', String(A1)), '; y a los ', v('t', `${f(t2)} ${u}`), ', ', v('m', String(A2)), '.'],
      pregunta: ['¿Cuál es la ', v('T', 'vida media'), ' del isótopo?'],
      solucion: [
        ['De ', v('m0', String(A0)), ' a ', v('m', String(A1)), ` la actividad se dividió entre ${2 ** k1} = 2^${k1}: pasaron ${k1} vidas medias.`],
        [v('T', 'Vida media'), ' = ', v('t', f(t1)), ` ÷ ${k1} = `, v('T', `${f(T)} ${u}`), '.'],
        ['Comprobación: de ', v('m', String(A1)), ' a ', v('m', String(A2)), ` hay ${k2} mitad${k2 > 1 ? 'es' : ''} en ${f(t2 - t1)} ${u} = ${k2} × ${f(T)}.`],
      ], _datos: { tipo: 'vida-media', sub, A0, A1, A2, t1, t2, unidad: u } });
  }

  const CONSTRUIR = { ubicar, familia, cation, anion, desapareados, anomala, cuanticos: cuanticosP, contar,
    particulas: particulasP, 'atomo-ion': atomoIon, 'vida-media': vidaMediaP };

  return { id: 'configuracion-ubicacion', titulo: 'Configuración y lugar en la tabla, hasta Z = 86', generar,
    configuracion, ubicacion, ultimoElectron, particulas, contarL, vidaQueda, vidaTiempo, SIMBOLOS, EXCEPCIONES, conConfig };
});
