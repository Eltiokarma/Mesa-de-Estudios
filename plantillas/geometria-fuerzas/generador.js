/*
 * Generador «Forma, hibridación, polaridad y fuerzas entre moléculas» (geometria-fuerzas), formato "predicciones"
 * (docs/arquitectura.md). Práctica por idea de quimica.geometria-molecular (docs/etapa6/propuesta-quimica.md §9).
 * Funciona en el navegador (window.Generadores['geometria-fuerzas']) y en Node (require). No usa la teoría ni el motor de
 * la escena: trae su propia tabla de moléculas (enlaces y pares libres del átomo central, forma, hibridación y polaridad,
 * por repulsión de pares, como en OpenStax Chemistry 2e §7.6) y las temperaturas de ebullición a 1 atm (CRC/NIST).
 *
 * Tipos por idea (TIPOS_POR_IDEA; nivel 1 un paso, 2 dos pasos, 3 de examen). generar(semilla, { idea }) da solo los de
 * esa idea; sin idea, las cuatro con el mismo peso.
 *   forma-repulsion           regiones (1) · angulo (1) · forma (2) · forma-expandida (3)
 *   hibridacion               hib-central (1) · sigma-pi (2) · electrones-pi (2) · hib-carbono (3)
 *   forma-polaridad           polar (2) · cual-polar (3)
 *   fuerzas-intermoleculares  que-fuerza (1) · cual-hierve (2) · puente (2)
 * Colores (los de la unidad): dipolo naranja, ángulo turquesa, electrones y pares libres violeta, carga y temperatura carmín.
 * Errores: EN8 a EN16 de docs/investigacion/atomo-enlace-ideas-erroneas.md y los QM- de la teoría (hipótesis).
 * Cuentas comprobadas con un script aparte (casos.json, «verificacion») y con el recálculo de generador.test.js.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar, nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'geometria-fuerzas', UNIDAD = 'quimica.geometria-molecular', FUENTE = 'docs/investigacion/atomo-enlace-ideas-erroneas.md';
  const VARS = { mu: { nombre: 'dipolo', color: 'o' }, ang: { nombre: 'ángulo', color: 'i' }, e: { nombre: 'electrones', color: 'f' }, T: { nombre: 'temperatura', color: 'h' } };
  const v = P.v;
  // Moléculas: fórmula → [central, enlaces del central, pares libres del central, regiones extra por dobles (no cambian), polar].
  const MOL = {};
  [['BeCl₂', 'Be', 2, 0, 0], ['CO₂', 'C', 2, 0, 0], ['HCN', 'C', 2, 0, 1], ['BF₃', 'B', 3, 0, 0], ['BCl₃', 'B', 3, 0, 0], ['SO₃', 'S', 3, 0, 0], ['CH₂O', 'C', 3, 0, 1], ['SO₂', 'S', 2, 1, 1],
    ['CH₄', 'C', 4, 0, 0], ['CCl₄', 'C', 4, 0, 0], ['CHCl₃', 'C', 4, 0, 1], ['CH₃Cl', 'C', 4, 0, 1], ['NH₃', 'N', 3, 1, 1], ['PCl₃', 'P', 3, 1, 1], ['NF₃', 'N', 3, 1, 1], ['H₂O', 'O', 2, 2, 1],
    ['H₂S', 'S', 2, 2, 1], ['SCl₂', 'S', 2, 2, 1], ['PCl₅', 'P', 5, 0, 0], ['SF₄', 'S', 4, 1, 1], ['ClF₃', 'Cl', 3, 2, 1], ['XeF₂', 'Xe', 2, 3, 0], ['SF₆', 'S', 6, 0, 0], ['BrF₅', 'Br', 5, 1, 1], ['XeF₄', 'Xe', 4, 2, 0]]
    .forEach(([fo, c, n, m, pol]) => { MOL[fo] = { fo, c, n, m, polar: !!pol }; });
  const FORMA = { '2,0': 'lineal', '3,0': 'trigonal plana', '2,1': 'angular', '4,0': 'tetraédrica', '3,1': 'piramidal trigonal', '2,2': 'angular', '5,0': 'bipirámide trigonal',
    '4,1': 'balancín', '3,2': 'forma de T', '2,3': 'lineal', '6,0': 'octaédrica', '5,1': 'pirámide cuadrada', '4,2': 'cuadrada plana' };
  const DOM = { 2: 'lineal', 3: 'trigonal plana', 4: 'tetraédrica', 5: 'bipirámide trigonal', 6: 'octaédrica' };
  const HIB = { 2: 'sp', 3: 'sp²', 4: 'sp³', 5: 'sp³d', 6: 'sp³d²' };
  const ANG = { 2: '180°', 3: '120°', 4: '109,5°', 6: '90°' };
  const forma = k => FORMA[`${MOL[k].n},${MOL[k].m}`];
  const D = {
    region: 'Región de electrones: cada enlace (simple, doble o triple) o par libre del átomo central',
    formas: 'Con 2 regiones, lineal; con 3, trigonal plana; con 4, tetraédrica (las regiones; la forma se nombra por los átomos)',
    exp: 'Con 5 regiones, bipirámide trigonal (pares al ecuador); con 6, octaédrica (dos pares, opuestos)',
    angs: 'Ángulos: lineal 180°; trigonal plana 120°; tetraédrica 109,5°; octaédrica 90°',
    hib: 'Hibridación por regiones del átomo: 2, sp; 3, sp²; 4, sp³; 5, sp³d; 6, sp³d²', sp: 'Enlace simple: 1 sigma (σ); doble: 1 σ y 1 pi (π); triple: 1 σ y 2 π',
    epi: 'Cada enlace pi tiene 2 electrones', rayas: 'Cada raya es un enlace; cada H escrito junto a un C (CH₃, H₂C) es un enlace C–H más', dip: 'Dipolo de enlace: flecha hacia el átomo de mayor electronegatividad',
    suma: 'Molécula polar: sus dipolos de enlace, sumados en 3D, no dan cero', atr: 'Atracciones entre moléculas: puente de hidrógeno > dipolo-dipolo > London',
    puente: 'Puente de hidrógeno: un H unido a N, O o F atrae un par libre de N, O o F vecino', london: 'London: la tienen todas; crece con el tamaño y con la superficie de contacto',
  };
  const TIPOS_POR_IDEA = {
    'forma-repulsion': ['regiones', 'angulo', 'forma', 'forma-expandida'],
    hibridacion: ['hib-central', 'sigma-pi', 'electrones-pi', 'hib-carbono'],
    'forma-polaridad': ['polar', 'cual-polar'],
    'fuerzas-intermoleculares': ['que-fuerza', 'cual-hierve', 'puente'],
  };
  const IDEAS = Object.keys(TIPOS_POR_IDEA);
  const IDEA_DE = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map(t => [t, i])));
  const NIVEL = { regiones: 1, angulo: 1, forma: 2, 'forma-expandida': 3, 'hib-central': 1, 'sigma-pi': 2, 'electrones-pi': 2, 'hib-carbono': 3, polar: 2, 'cual-polar': 3,
    'que-fuerza': 1, 'cual-hierve': 2, puente: 2 };
  const DOCUMENTADOS = { EN8: 'documentado', EN9: 'parcial', EN10: 'documentado', EN11: 'documentado', EN12: 'documentado', EN14: 'documentado', EN15: 'documentado', EN16: 'documentado' };
  const err = (id, texto, explicacion) => ({ id, clave: texto, texto, explicacion, respaldo: DOCUMENTADOS[id] || 'hipotesis', fuente: FUENTE });
  // Elige 3 o 4 errores con los que la correcta no queda como la alternativa «central» (se adivinaría sin resolver).
  const trozos = t => String(t).replace(/[()]/g, ' ').split(/[\s;,:]+|(?=[+−\-·/>])|(?<=[+−\-·/>])/).filter(Boolean);
  const dist = (a, b) => { const A = trozos(a), B = trozos(b); let d = 0; for (let i = 0; i < Math.max(A.length, B.length); i++) if (A[i] !== B[i]) d++; return d; };
  function* combinaciones(l, k, i = 0, acc = []) { if (acc.length === k) { yield acc; return; } for (let j = i; j < l.length; j++) yield* combinaciones(l, k, j + 1, [...acc, l[j]]); }
  function elegir(correcta, pool) {
    for (const k of [4, 3]) for (const sub of combinaciones(pool, Math.min(k, pool.length))) {
      if (sub.length < 3) continue;
      const al = [correcta, ...sub.map(e => e.texto)], sc = al.map(a => al.reduce((t, b) => t + dist(a, b), 0)), min = Math.min(...sc);
      if (!(sc[0] === min && sc.filter(x => x === min).length === 1)) return sub;
    }
    return null;
  }
  function cerrar(rng, semilla, tipo, o) {
    const vistos = new Set([o.correcta]), pool0 = [];
    for (const e of rng.barajar(o.errores)) if (!vistos.has(e.texto)) { vistos.add(e.texto); pool0.push(e); }
    if (pool0.length < 3) return null;
    const pool = elegir(o.correcta, pool0);
    if (!pool) return null;
    const alternativas = P.armarTexto({ correcta: { clave: o.correcta, texto: o.correcta }, errores: pool.slice(0, 4), rng });
    if (alternativas.length < 4 || o.datos.some(d => d === o.correcta)) return null;
    const usadas = new Set();
    for (const linea of [o.enunciado, o.pregunta, ...o.solucion]) for (const x of linea) if (x && typeof x === 'object' && x.v) usadas.add(x.v);
    return { id: `${ID}#${semilla}`, unidadCatalogo: UNIDAD, variables: Object.fromEntries([...usadas].map(k => [k, Object.assign({}, VARS[k])])),
      enunciado: o.enunciado, pregunta: o.pregunta, datos: o.datos, alternativas, solucion: o.solucion, respuesta: { valor: o.correcta, unidad: '' },
      _datos: Object.assign({ idea: IDEA_DE[tipo], tipo, nivel: NIVEL[tipo] }, o._datos) };
  }
  const pTxt = m => (m === 0 ? 'ningún par libre' : `${m} par${m > 1 ? 'es' : ''} libre${m > 1 ? 's' : ''}`);
  const desc = k => `el ${MOL[k].c} forma ${MOL[k].n} enlaces y tiene ${pTxt(MOL[k].m)}`;

  // ---- Idea 1 ----
  const BASICAS = ['BeCl₂', 'CO₂', 'HCN', 'BF₃', 'BCl₃', 'SO₃', 'CH₂O', 'SO₂', 'CH₄', 'CCl₄', 'CHCl₃', 'PCl₃', 'NF₃', 'H₂O', 'H₂S', 'SCl₂'];
  const EXPANDIDAS = ['PCl₅', 'SF₄', 'ClF₃', 'XeF₂', 'SF₆', 'BrF₅', 'XeF₄'];
  // Pares compartidos de más en los enlaces múltiples del central (los cuenta quien toma cada par como una región).
  const EXTRA = { 'CO₂': 2, HCN: 2, 'SO₃': 3, 'CH₂O': 1, 'SO₂': 2 };
  function regiones(rng) {
    const k = rng.elegir([...BASICAS, ...EXPANDIDAS]), { n, m } = MOL[k], dobles = !!EXTRA[k];
    return { correcta: String(n + m), _datos: { k },
      enunciado: [`En el ${k}, ${desc(k)}.`], pregunta: ['¿Cuántas regiones de electrones tiene el átomo central?'], datos: [D.region],
      errores: [err('QM-FORMA-LIGANDOS', String(n), 'Bien los enlaces. Pero cada par libre también es una región.'),
        dobles ? err('QM-REGION-DOBLE', String(n + m + EXTRA[k]), 'Eso cuenta cada par compartido. Un enlace doble o triple cuenta como una sola región.')
          : m ? err('QM-REGION-PARES', String(n + 2 * m), 'Un par libre es una región, no dos.') : err('QM-REGION-CENTRAL', String(n + 1), 'Sobra una: el átomo central no es una región; se cuentan sus enlaces y pares.'),
        err('QM-REGION-OCTETO', n + m === 4 ? '8' : '4', 'Bien pensar en el octeto. Pero se cuentan enlaces y pares, no electrones.'), err('QM-REGION-UNO', String(n + m + 2), 'Sobran: revisa los pares libres.')],
      solucion: [[`${n} enlaces y ${pTxt(m)}.`], [`${n} + ${m} = ${n + m} regiones`]] };
  }
  function angulo(rng) {
    const k = rng.elegir(['BeCl₂', 'CO₂', 'BF₃', 'BCl₃', 'SO₃', 'CH₄', 'CCl₄', 'SF₆']), r = MOL[k].n;
    return { correcta: ANG[r], _datos: { k },
      enunciado: [`En el ${k}, ${desc(k)}.`], pregunta: ['¿Cuánto mide el ', v('ang', 'ángulo'), ' más chico entre dos enlaces, según la repulsión de pares?'], datos: [D.region, D.angs],
      errores: Object.values(ANG).filter(a => a !== ANG[r]).map(a => err(a === '90°' ? 'QM-ANGULO-PLANO' : 'QM-ANGULO-OTRA', a, a === '90°' ? 'Así se ve en el papel, en cruz.' : `Ese es el de otro número de regiones; aquí son ${r}.`)),
      solucion: [[`${r} regiones, todas enlaces.`], [v('ang', ANG[r])]] };
  }
  function formaT(rng, lista) {
    const k = rng.elegir(lista), { n, m } = MOL[k], fm = forma(k), plano = { 2: 'lineal', 3: 'trigonal plana', 4: 'cuadrada plana', 5: 'bipirámide trigonal', 6: 'octaédrica' }[n];
    const otras = Object.values(FORMA).filter(x => x !== fm && x !== DOM[n + m] && x !== plano && x !== DOM[n]);
    return { correcta: fm, _datos: { k },
      enunciado: [`En el ${k}, ${desc(k)}.`], pregunta: ['¿Qué forma tiene la molécula?'], datos: lista === EXPANDIDAS ? [D.region, D.exp] : [D.region, D.formas],
      errores: [err('QM-FORMA-DOMINIOS', DOM[n + m], 'Esa es la forma de las regiones; la molécula se nombra por los átomos.'), err('EN8', plano, 'Así se ve en el papel; en 3D las regiones se alejan más.'),
        err('QM-FORMA-LIGANDOS', DOM[n], 'Bien contar los átomos. Pero los pares libres también ocupan lugar.'), err('EN9', rng.elegir(otras), 'Sería así con otro número de regiones o de pares.')],
      solucion: [[`${n + m} regiones: ${n} enlaces y ${pTxt(m)}.`], [fm]] };
  }
  // ---- Idea 2 ----
  const SP = [['H₂C=CH₂', 5, 1, 4], ['H₂C=CH–CH₃', 8, 1, 6], ['O=C=O', 2, 2, 0], ['H–C≡N', 2, 2, 1], ['H₂C=O', 3, 1, 2], ['CH₃–CH₃', 7, 0, 6], ['N≡N', 1, 2, 0], ['H₂C=C=CH₂', 6, 2, 4],
    ['H₂C=CH–CH=CH₂', 9, 2, 6], ['HC≡C–CH₃', 6, 2, 4], ['CH₃–C≡N', 5, 2, 3], ['HC≡CH', 3, 2, 2]];
  function hibCentral(rng) {
    const k = rng.elegir([...BASICAS, ...EXPANDIDAS]), { n, m } = MOL[k], h = HIB[n + m];
    const malas = Object.values(HIB).filter(x => x !== h);
    return { correcta: h, _datos: { k },
      enunciado: [`En el ${k}, ${desc(k)}.`], pregunta: ['¿Qué hibridación tiene el átomo central?'], datos: [D.hib, D.region],
      errores: [m ? err('QM-FORMA-LIGANDOS', HIB[n], 'Bien contar los enlaces. Pero los pares libres también son regiones.') : err('QM-HIB-SIEMPRE-SP3', h === 'sp³' ? 'sp²' : 'sp³', 'Bien pensar en el carbono. Pero cuenta las regiones de este átomo.'),
        ...malas.filter(x => x !== HIB[n]).slice(0, 3).map(x => err('QM-HIB-CUENTA', x, `Sería ${x} con otro número de regiones.`))],
      solucion: [[`${n} + ${m} = ${n + m} regiones.`], [h]] };
  }
  function sigmaPi(rng) {
    const [fo, s, p, nH] = rng.elegir(SP), tx = (a, b) => `${a} σ y ${b} π`;
    return { correcta: tx(s, p), _datos: { fo },
      enunciado: [`La molécula ${fo}.`], pregunta: ['¿Cuántos enlaces sigma (σ) y pi (π) tiene?'], datos: [D.sp, D.rayas],
      errores: [err('QM-PI-SIGMA', tx(s + p, 0), 'El segundo y el tercero de un múltiple son pi, no sigma.'), err('QM-PI-ELECTRONES', tx(s, 2 * p), 'Eso cuenta electrones pi; se piden enlaces.'),
        nH ? err('QM-SIGMA-SOLO-CC', tx(s - nH, p), 'Faltan los enlaces con los H: también son sigma.') : err('QM-PI-CUENTA', tx(s, p + 1), 'Sobra un pi.'), err('QM-PI-SIGMA', tx(s + 1, p), 'Sobra un sigma: un múltiple tiene uno solo.'),
        err('QM-PI-DOBLE-SIGMA', tx(s + p, p), 'Bien los pi. Pero cada pi no suma además un sigma.'), err('QM-SIGMA-CORTO', tx(s - 1, p), 'Falta un sigma: cuenta todas las rayas.')],
      solucion: [['Un sigma en cada enlace; los pi, en los dobles y triples.'], [`${s} σ y ${p} π`]] };
  }
  function electronesPi(rng) {
    const [fo, , p] = rng.elegir(SP.filter(x => x[2] > 0));
    return { correcta: String(2 * p), _datos: { fo },
      enunciado: [`La molécula ${fo}.`], pregunta: ['¿Cuántos ', v('e', 'electrones pi'), ' tiene?'], datos: [D.sp, D.epi],
      errores: [err('QM-PI-ELECTRONES', String(p), 'Eso cuenta enlaces pi; cada uno tiene 2 electrones.'), err('QM-PI-DOBLE', String(4 * p), 'Eso cuenta los electrones del enlace entero.'),
        err('QM-PI-SIGMA', String(2 * p + 2), 'Sobran 2: el sigma no es pi.')],
      solucion: [[`${p} enlace${p > 1 ? 's' : ''} pi.`], [`${p} · 2 = `, v('e', `${2 * p}`)]] };
  }
  const CARB = [['H₂C=CH–CH₃', 'el carbono del CH₃', 4], ['H₂C=CH–CH₃', 'el carbono del medio', 3], ['HC≡C–CH₃', 'el carbono del medio', 2], ['H₂C=C=CH₂', 'el carbono del medio', 2],
    ['H₂C=C=CH₂', 'un carbono de la punta', 3], ['CH₃–C≡N', 'el carbono unido al N', 2], ['CH₃–C≡N', 'el carbono del CH₃', 4], ['H₂C=O', 'el carbono', 3], ['CH₃–CH₃', 'un carbono', 4],
    ['HC≡CH', 'un carbono', 2], ['H₂C=CH–CH=CH₂', 'un carbono del medio', 3]];
  function hibCarbono(rng) {
    const [fo, cual, r] = rng.elegir(CARB), h = HIB[r];
    const MALA = { 2: err('QM-HIB-TRIPLE-SP2', 'sp²', 'Sería sp² con tres regiones; un triple o dos dobles dejan dos.'), 3: err('QM-HIB-ENLACES', 'sp³', 'El doble es una sola región: son tres.'),
      4: err('QM-HIB-CUENTA', 'sp²', 'Sería sp² con un doble; aquí todos son simples.') };
    return { correcta: h, _datos: { fo, cual },
      enunciado: [`La molécula ${fo}.`], pregunta: [`¿Qué hibridación tiene ${cual}?`], datos: [D.hib, D.region],
      errores: [MALA[r], ...['sp', 'sp²', 'sp³'].filter(x => x !== h && x !== MALA[r].texto).map(x => err('QM-HIB-CUENTA', x, `Sería ${x} con otro número de regiones.`)), err('QM-HIB-CUENTA', 'sp³d', 'Un carbono no pasa de 4 regiones.')],
      solucion: [[`Ese carbono tiene ${r} regiones.`], [`${r} regiones → ${h}`]] };
  }
  // ---- Idea 3 ----
  const POL = { si: 'Polar: sus dipolos no se anulan', no: 'Apolar: sus dipolos se anulan' };
  const DISTINTOS = new Set(['HCN', 'CH₂O', 'CHCl₃', 'CH₃Cl']); // átomos de alrededor que no son todos iguales
  function polar(rng) {
    const k = rng.elegir([...BASICAS, ...EXPANDIDAS].filter(x => x !== 'CH₄')), p = MOL[k].polar;
    return { correcta: POL[p ? 'si' : 'no'], _datos: { k },
      enunciado: [`El ${k} tiene forma ${forma(k)} y enlaces ${k === 'H₂S' ? 'algo ' : ''}polares.`], pregunta: ['¿La molécula es polar?'], datos: [D.dip, D.suma],
      errores: [p ? err('EN10', POL.no, 'Se anularían en una forma simétrica con átomos iguales; no es el caso.') : err('EN11', POL.si, 'Sus enlaces son polares, pero la forma reparte las flechas.'),
        err('QM-POL-ENLACE', 'Apolar: sus enlaces no son polares', 'El enunciado dice que sí lo son.'),
        p ? (DISTINTOS.has(k) ? err('EN11', 'Apolar: su forma es simétrica', 'La forma es simétrica, cierto. Pero sus átomos de alrededor no son iguales.')
          : err('EN11', 'Apolar: sus átomos de alrededor son iguales', 'Son iguales, cierto. Pero los pares libres del central dejan una flecha total.')) : err('EN11', 'Polar: tiene átomos distintos', 'Tener átomos distintos no basta.')],
      solucion: [[p ? 'La forma no reparte las flechas por igual.' : 'Forma simétrica con átomos iguales alrededor.'], [v('mu', 'μ'), p ? ' ≠ 0' : ' = 0']] };
  }
  function cualPolar(rng) {
    const si = rng.elegir(['H₂O', 'NH₃', 'SO₂', 'PCl₃', 'CHCl₃', 'H₂S', 'HCN', 'NF₃', 'CH₃Cl']), no = rng.barajar(['CO₂', 'BF₃', 'CCl₄', 'BeCl₂', 'SF₆', 'SO₃', 'XeF₄', 'PCl₅']).slice(0, 3);
    const lista = rng.barajar([si, ...no]);
    return { correcta: si, _datos: { si, no },
      enunciado: [`Las moléculas ${lista.join(', ')}.`], pregunta: ['¿Cuál es polar?'],
      datos: [D.suma, `Formas: ${lista.map(k => `${k} ${forma(k)}`).join('; ')}`],
      errores: no.map(k => err('EN11', k, `${k}: enlaces polares, pero su forma ${forma(k)} los anula.`)),
      solucion: [[`El ${si}, de forma ${forma(si)}: sus flechas no se anulan.`]] };
  }
  // ---- Idea 4 ----
  const FZ = [['CH₄', 'Solo London', 'apolar; sus H están unidos a C'], ['HCl', 'Dipolo-dipolo y London', 'polar; sin H unido a N, O o F'], ['NH₃', 'Puente de hidrógeno, dipolo-dipolo y London', 'polar; tiene H unido a N'],
    ['CO₂', 'Solo London', 'apolar; no tiene H'], ['HF', 'Puente de hidrógeno, dipolo-dipolo y London', 'polar; tiene H unido a F'], ['CH₃OCH₃', 'Dipolo-dipolo y London', 'polar; sus H están unidos a C'],
    ['Cl₂', 'Solo London', 'apolar; no tiene H'], ['CH₃OH', 'Puente de hidrógeno, dipolo-dipolo y London', 'polar; tiene un H unido a O'], ['H₂S', 'Dipolo-dipolo y London', 'polar; sus H están unidos a S'],
    ['CCl₄', 'Solo London', 'apolar; no tiene H'], ['H₂O', 'Puente de hidrógeno, dipolo-dipolo y London', 'polar; tiene H unido a O']];
  const TODAS = ['Solo London', 'Dipolo-dipolo y London', 'Puente de hidrógeno, dipolo-dipolo y London', 'Puente de hidrógeno y nada más'];
  function queFuerza(rng) {
    const [fo, bien, como] = rng.elegir(FZ);
    const SI = { 'Solo London': ['QM-FUERZA-POLAR', 'Sería solo London si fuera apolar.'], 'Dipolo-dipolo y London': ['EN15', 'Sería así si fuera polar sin H unido a N, O o F.'],
      'Puente de hidrógeno, dipolo-dipolo y London': ['EN15', 'Sería así con un H unido a N, O o F.'], 'Puente de hidrógeno y nada más': ['QM-FUERZA-SOLO', 'Toda molécula tiene además London.'] };
    return { correcta: bien, _datos: { fo },
      enunciado: [`El ${fo}: molécula ${como}.`], pregunta: ['¿Qué atracciones hay entre sus moléculas?'], datos: [D.puente, D.london],
      errores: TODAS.filter(x => x !== bien).map(x => err(SI[x][0], x, SI[x][1])),
      solucion: [[`${fo}: ${como}.`], [bien]] };
  }
  const EB = [['H₂O', 100, 'H₂S', -60, 'forma puentes de hidrógeno'], ['NH₃', -33, 'PH₃', -88, 'forma puentes de hidrógeno'], ['HF', 20, 'HCl', -85, 'forma puentes de hidrógeno'],
    ['CH₃OH', 65, 'CH₄', -162, 'forma puentes de hidrógeno'], ['Br₂', 59, 'Cl₂', -34, 'es más grande: más London'], ['n-pentano', 36, 'neopentano', 10, 'es alargado: más contacto y más London'],
    ['etanol (C₂H₅OH)', 78, 'CH₃OCH₃', -24, 'forma puentes de hidrógeno'], ['HCl', -85, 'F₂', -188, 'es polar: tiene dipolo-dipolo']];
  // Masas molares (g/mol): la opción «es más pesado» (EN16) solo sale cuando el otro lo es de verdad.
  const MASA = { 'H₂O': 18, 'H₂S': 34, 'NH₃': 17, 'PH₃': 34, HF: 20, HCl: 36.5, 'CH₃OH': 32, 'CH₄': 16, 'Br₂': 160, 'Cl₂': 71, 'n-pentano': 72, neopentano: 72,
    'etanol (C₂H₅OH)': 46, 'CH₃OCH₃': 46, 'F₂': 38 };
  const tC = x => `${x < 0 ? '−' : ''}${Math.abs(x)} °C`;
  function cualHierve(rng) {
    const [a, ea, b, eb, razon] = rng.elegir(EB), [x, y] = rng.barajar([a, b]);
    return { correcta: `El ${a}: ${razon}`, _datos: { a, b },
      enunciado: [`El ${x} y el ${y}, a 1 atm.`], pregunta: ['¿Cuál hierve a mayor temperatura?'], datos: [D.atr, D.puente, D.london],
      errores: [MASA[b] > MASA[a] ? err('EN16', `El ${b}: es más pesado`, 'Más masa suele dar más London; aquí pesa más la otra atracción.')
        : MASA[b] === MASA[a] ? err('EN16', 'Los dos igual: tienen la misma masa', 'La masa es la misma; pero la forma cambia cuánto se atraen.')
          : err('QM-ENLACE-INTERNO', `El ${b}: sus enlaces internos son más fuertes`, `Al hervir no se rompen enlaces internos; y el ${a} ${razon}.`), err('EN14', `El ${a}: sus enlaces internos son más fuertes`, 'Al hervir no se rompen enlaces internos.'),
        err('QM-GRUPO-EB', 'Los dos igual: son parecidos', 'Se parecen, pero sus moléculas se atraen distinto.'), err('QM-FUERZA-ORDEN', `El ${b}: sus moléculas se atraen más`, `Al revés: el ${a} ${razon}.`)],
      solucion: [[`El ${a} ${razon}.`], [`${a}: `, v('T', tC(ea)), `; ${b}: `, v('T', tC(eb))]] };
  }
  function puente(rng) {
    const si = rng.elegir(['NH₃', 'HF', 'CH₃OH', 'H₂O₂', 'CH₃NH₂', 'H₂O']), no = rng.barajar(['CH₃OCH₃', 'CH₃F', 'HCl', 'H₂S', 'CH₄', 'CH₂O']).slice(0, 3);
    return { correcta: si, _datos: { si, no },
      enunciado: [`Las sustancias ${rng.barajar([si, ...no]).join(', ')}.`], pregunta: ['¿Cuál forma puentes de hidrógeno entre sus moléculas?'],
      datos: [D.puente, 'En las fórmulas, el H escrito junto a O o N (OH, NH) está unido a ese átomo; en CH, al carbono'],
      errores: no.map(x => err(/O|F/.test(x) ? 'EN15' : 'QM-PUENTE-POLAR', x, /O|F/.test(x) ? 'Tiene O o F, pero sus H no están unidos a ellos.' : 'Su H no está unido a N, O ni F.')),
      solucion: [[`El ${si} tiene un H unido a ${/F/.test(si) ? 'F' : /N/.test(si) ? 'N' : 'O'}.`]] };
  }

  const CONSTRUIR = { regiones, angulo, forma: rng => formaT(rng, BASICAS), 'forma-expandida': rng => formaT(rng, EXPANDIDAS), 'hib-central': hibCentral, 'sigma-pi': sigmaPi,
    'electrones-pi': electronesPi, 'hib-carbono': hibCarbono, polar, 'cual-polar': cualPolar, 'que-fuerza': queFuerza, 'cual-hierve': cualHierve, puente };
  function generar(semilla, opciones = {}) {
    const rng = Azar.crear(`${ID}|${semilla}`);
    const idea = TIPOS_POR_IDEA[opciones.idea] ? opciones.idea : rng.elegir(IDEAS), tipo = rng.elegir(TIPOS_POR_IDEA[idea]);
    for (let intento = 0; intento < 500; intento++) {
      const p = cerrar(rng, semilla, tipo, CONSTRUIR[tipo](rng));
      if (p) return p;
    }
    throw new Error(`${ID}: no se pudo generar un problema de ${tipo}`);
  }
  return { id: ID, titulo: 'Forma, hibridación, polaridad y fuerzas entre moléculas', generar, TIPOS_POR_IDEA, NIVEL, TIPOS: Object.keys(CONSTRUIR), DATOS: { MOL, SP, EB } };
});
