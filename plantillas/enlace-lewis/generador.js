/*
 * Generador «Tipos de enlace, iones y estructuras de Lewis» (enlace-lewis), formato "predicciones" (docs/arquitectura.md).
 * Práctica por idea de quimica.enlace-quimico (docs/etapa6/propuesta-quimica.md §9). Funciona en el navegador
 * (window.Generadores['enlace-lewis']) y en Node (require). No usa la teoría ni el motor de la escena: trae sus propias
 * tablas (electrones de valencia por grupo, electronegatividad de Pauling revisada por Allred, 1961).
 *
 * Tipos por idea (TIPOS_POR_IDEA; nivel 1 un paso, 2 dos pasos, 3 de examen). generar(semilla, { idea }) da solo los de
 * esa idea; sin idea, las cinco con el mismo peso.
 *   tres-enlaces         tipo-elementos (1) iónico, covalente o metálico · delta-signo (1) quién queda con δ− ·
 *                        tipo-den (2) por la ΔEN · tipo-propiedades (2) por fusión y conducción
 *   enlace-ionico        carga-ion (1) · formula-ionica (2) · electrones-transferidos (3)
 *   lewis-octeto         electrones-repartir (1, con la carga del ion) · libres-central (2) · orden-enlace (2)
 *   dativo-excepciones   quien-pone (1) quién pone el par del dativo · electrones-central (2) · radical (3)
 *   resonancia           cuantas-estructuras (1) · orden-promedio (2) · carga-formal (3)
 * Colores (los de la unidad): Z naranja, electronegatividad turquesa, electrones violeta, carga carmín.
 * Errores: EN1 a EN7 de docs/investigacion/atomo-enlace-ideas-erroneas.md y los QM- de la teoría (hipótesis). Cada
 * explicación empieza por lo que el alumno hizo bien. Respuesta: p.respuesta.valor es el texto de la alternativa correcta.
 * Nada de nombres de compuestos (Nomenclatura inorgánica viene después): se dicen por su fórmula.
 * Cuentas comprobadas con un script aparte (casos.json, «verificacion») y con el recálculo de generador.test.js.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar, nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'enlace-lewis', UNIDAD = 'quimica.enlace-quimico', FUENTE = 'docs/investigacion/atomo-enlace-ideas-erroneas.md';
  const VARS = { Z: { nombre: 'número atómico', color: 'o' }, EN: { nombre: 'electronegatividad', color: 'i' }, e: { nombre: 'electrones', color: 'f' }, q: { nombre: 'carga', color: 'h' } };
  const v = P.v;
  // ---- Datos: símbolo → [nombre, grupo, electrones de valencia, EN, metal] ----
  const EL = {};
  [['H', 'hidrógeno', 1, 1, 2.20, 0], ['Li', 'litio', 1, 1, 0.98, 1], ['Be', 'berilio', 2, 2, 1.57, 1], ['B', 'boro', 13, 3, 2.04, 0], ['C', 'carbono', 14, 4, 2.55, 0],
    ['N', 'nitrógeno', 15, 5, 3.04, 0], ['O', 'oxígeno', 16, 6, 3.44, 0], ['F', 'flúor', 17, 7, 3.98, 0], ['Na', 'sodio', 1, 1, 0.93, 1], ['Mg', 'magnesio', 2, 2, 1.31, 1],
    ['Al', 'aluminio', 13, 3, 1.61, 1], ['P', 'fósforo', 15, 5, 2.19, 0], ['S', 'azufre', 16, 6, 2.58, 0], ['Cl', 'cloro', 17, 7, 3.16, 0], ['K', 'potasio', 1, 1, 0.82, 1],
    ['Ca', 'calcio', 2, 2, 1.00, 1], ['Br', 'bromo', 17, 7, 2.96, 0], ['I', 'yodo', 17, 7, 2.66, 0], ['Xe', 'xenón', 18, 8, 2.60, 0], ['Fe', 'hierro', 8, 2, 1.83, 1],
    ['Cu', 'cobre', 11, 1, 1.90, 1], ['Zn', 'cinc', 12, 2, 1.65, 1], ['Ag', 'plata', 11, 1, 1.93, 1]]
    .forEach(([s, nombre, g, val, en, met]) => { EL[s] = { s, nombre, g, val, en, metal: !!met }; });
  const SUB = { 1: '', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆' }, SUP = { 1: '', 2: '²', 3: '³' };
  const f2 = x => (Math.round(x * 100) / 100).toFixed(2).replace('.', ',');
  // El grupo con su número, como en la teoría, y «electrones» sin tilde (auditoría, 19 nov).
  const eTxt = k => (k === 1 ? '1 electrón' : `${k} electrones`);
  const lugarTxt = s => `${EL[s].nombre.replace(/^./, c => c.toUpperCase())} (${s}): grupo ${EL[s].g}, ${eTxt(EL[s].val)} de valencia`;
  const valTxt = ss => `Electrones de valencia: ${[...new Set(ss)].map(s => `${s} ${EL[s].val}`).join('; ')}`;
  const enTxt = ss => `EN: ${[...new Set(ss)].map(s => `${s} ${f2(EL[s].en)}`).join('; ')}`;
  const D = {
    metales: 'Metales: a la izquierda de la escalera de la tabla (litio, sodio, potasio, magnesio, calcio, aluminio, hierro, cobre, cinc, plata)',
    noMetales: 'No metales: a la derecha de la escalera (hidrógeno, carbono, nitrógeno, oxígeno, flúor, fósforo, azufre, cloro, bromo, yodo)',
    delta: 'ΔEN = EN del mayor − EN del menor', guia: 'Guía de ΔEN: 1,7 o más suele ser iónico; menos de 1,7, covalente polar; 0, covalente apolar',
    props: 'Iónico: alto punto de fusión, conduce fundido o disuelto; metálico: conduce sólido; molecular: funde bajo, no conduce',
    octeto: 'Gas noble: 8 electrones en su último nivel (el helio, 2)', cero: 'Carga total de un compuesto iónico = 0',
    carga: 'Electrones a repartir = suma de valencias − carga del ion (un anión 2− suma 2; un catión 1+ resta 1)', enlace: 'Cada raya: un par compartido (2 electrones)', meta: 'Octeto: 8 electrones alrededor de cada átomo (el H, 2)',
    cuenta: 'Alrededor del central: 2 por cada enlace + 2 por cada par libre suyo', dativo: 'Enlace dativo: un solo átomo pone los dos electrones del par',
    radical: 'Radical libre: especie con un electrón sin pareja', orden: 'Orden de enlace: 1 en un simple, 2 en un doble, 3 en un triple',
    promedio: 'Orden promedio = pares compartidos en esos enlaces ÷ número de esos enlaces', cf: 'Carga formal = valencia − electrones de sus pares libres − enlaces que forma',
  };
  // ---- Tipos ----
  const TIPOS_POR_IDEA = {
    'tres-enlaces': ['tipo-elementos', 'delta-signo', 'tipo-den', 'tipo-propiedades'],
    'enlace-ionico': ['carga-ion', 'formula-ionica', 'electrones-transferidos'],
    'lewis-octeto': ['electrones-repartir', 'libres-central', 'orden-enlace'],
    'dativo-excepciones': ['quien-pone', 'electrones-central', 'radical'],
    resonancia: ['cuantas-estructuras', 'orden-promedio', 'carga-formal'],
  };
  const IDEAS = Object.keys(TIPOS_POR_IDEA);
  const IDEA_DE = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map(t => [t, i])));
  const NIVEL = { 'tipo-elementos': 1, 'delta-signo': 1, 'tipo-den': 2, 'tipo-propiedades': 2, 'carga-ion': 1, 'formula-ionica': 2, 'electrones-transferidos': 3,
    'electrones-repartir': 1, 'libres-central': 2, 'orden-enlace': 2, 'quien-pone': 1, 'electrones-central': 2, radical: 3, 'cuantas-estructuras': 1, 'orden-promedio': 2, 'carga-formal': 3 };
  const DOCUMENTADOS = { EN1: 'documentado', EN3: 'documentado', EN4: 'documentado', EN5: 'documentado', EN6: 'documentado', EN7: 'documentado' };
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
    if (alternativas.length < 4 || o.datos.some(d => d === o.correcta || d.includes(`= ${o.correcta}`))) return null;
    const usadas = new Set();
    for (const linea of [o.enunciado, o.pregunta, ...o.solucion]) for (const x of linea) if (x && typeof x === 'object' && x.v) usadas.add(x.v);
    return { id: `${ID}#${semilla}`, unidadCatalogo: UNIDAD, variables: Object.fromEntries([...usadas].map(k => [k, Object.assign({}, VARS[k])])),
      enunciado: o.enunciado, pregunta: o.pregunta, datos: o.datos, alternativas, solucion: o.solucion, respuesta: { valor: o.correcta, unidad: '' },
      _datos: Object.assign({ idea: IDEA_DE[tipo], tipo, nivel: NIVEL[tipo] }, o._datos) };
  }

  // ---- Idea 1: iónico, covalente y metálico ----
  const TIPO = { ionico: 'Iónico', covalente: 'Covalente', metalico: 'Metálico' };
  const tipoDe = els => { const m = els.filter(s => EL[s].metal), n = els.filter(s => !EL[s].metal); return m.length && n.length ? 'ionico' : m.length ? 'metalico' : 'covalente'; };
  const SUSTANCIAS = [['KBr', ['K', 'Br']], ['Fe', ['Fe']], ['CO₂', ['C', 'O']], ['MgO', ['Mg', 'O']], ['Al', ['Al']], ['NH₃', ['N', 'H']], ['CaF₂', ['Ca', 'F']], ['Cl₂', ['Cl']],
    ['Cu', ['Cu']], ['CH₄', ['C', 'H']], ['Li₂O', ['Li', 'O']], ['H₂S', ['H', 'S']], ['Zn', ['Zn']], ['NaI', ['Na', 'I']], ['KCl', ['K', 'Cl']], ['Ag', ['Ag']], ['PCl₃', ['P', 'Cl']], ['CaO', ['Ca', 'O']]];
  function tipoElementos(rng) {
    const [fo, els] = rng.elegir(SUSTANCIAS), t = tipoDe(els), quien = els.length === 1 && fo === els[0] ? `del ${EL[fo].nombre} (${fo})` : `del ${fo}`;
    const SI = { ionico: ['QM-IONICO-MAL', 'Sería iónico si se uniera un metal con un no metal.'], covalente: ['EN5', 'Sería covalente si solo hubiera no metales.'], metalico: ['QM-TIPO-METAL', 'Sería metálico si fuera un metal solo.'] };
    return { correcta: TIPO[t], _datos: { fo, els },
      enunciado: [`Las partículas ${quien}.`], pregunta: ['¿Qué tipo de enlace las une?'], datos: [D.metales, D.noMetales],
      errores: [...Object.keys(TIPO).filter(k => k !== t).map(k => err(SI[k][0], TIPO[k], `Bien mirar los elementos. ${SI[k][1]}`)),
        err('QM-SIN-ENLACE', 'Ninguno: sus átomos están sueltos', 'Es una sustancia estable: sus partículas están unidas.')],
      solucion: [[{ ionico: 'Un metal con un no metal: iones que se atraen.', covalente: 'Solo no metales: comparten pares de electrones.', metalico: 'Un metal solo: un mar de electrones.' }[t]],
        [`${fo}: ${els.map(s => `${s} ${EL[s].metal ? 'metal' : 'no metal'}`).join(', ')}.`]] };
  }
  const PARES_DELTA = [['H', 'Cl'], ['H', 'O'], ['N', 'H'], ['C', 'O'], ['P', 'Cl'], ['C', 'Cl'], ['S', 'O'], ['H', 'Br'], ['C', 'N'], ['H', 'S'], ['O', 'F'], ['N', 'Cl'], ['C', 'H'], ['B', 'F'], ['P', 'O'], ['C', 'F']];
  function deltaSigno(rng) {
    const [a, b] = rng.barajar(rng.elegir(PARES_DELTA)), m = EL[a].en > EL[b].en ? a : b, o = m === a ? b : a;
    return { correcta: `El ${EL[m].nombre}`, _datos: { a, b },
      enunciado: [`El enlace ${a}–${b}.`], pregunta: ['¿Qué átomo queda con ', v('q', 'carga parcial negativa (δ−)'), '?'], datos: [enTxt([a, b])],
      errores: [err('QM-DELTA-SIGNO', `El ${EL[o].nombre}`, `Bien buscar quién jala. Pero el par va hacia el de mayor EN: el ${m}.`),
        err('QM-DELTA-CERO', 'Ninguno: comparten el par por igual', 'Comparten el par, cierto. Pero no por igual: jalan distinto.'),
        err('QM-DELTA-LOS-DOS', 'Los dos: el par está entre ellos', 'El par está entre ellos, cierto. Pero se corre hacia uno solo.')],
      solucion: [[`El par se corre hacia el ${m}, que jala más.`], [v('EN', `EN (${m}) = ${f2(EL[m].en)}`), ' > ', v('EN', `EN (${o}) = ${f2(EL[o].en)}`)]] };
  }
  const PARES_DEN = [['Na', 'Cl'], ['K', 'F'], ['Mg', 'O'], ['Ca', 'O'], ['Li', 'F'], ['K', 'Cl'], ['K', 'Br'], ['Na', 'F'], ['H', 'Cl'], ['H', 'O'], ['N', 'H'], ['C', 'O'], ['P', 'Cl'], ['C', 'Cl'], ['S', 'O'],
    ['Cl', 'Cl'], ['O', 'O'], ['N', 'N'], ['H', 'H'], ['F', 'F'], ['Br', 'Br']];
  const DEN = { ionico: 'Iónico', polar: 'Covalente polar', apolar: 'Covalente apolar' };
  function tipoDen(rng) {
    const [a, b] = rng.barajar(rng.elegir(PARES_DEN)), d = Math.round(Math.abs(EL[a].en - EL[b].en) * 100) / 100, t = a === b ? 'apolar' : d >= 1.7 ? 'ionico' : 'polar';
    const SI = { ionico: ['QM-DEN-IONICO', 'Sería iónico con 1,7 o más, entre un metal y un no metal.'], polar: ['QM-POL-IGUALES', 'Sería polar si los dos jalaran distinto.'], apolar: ['QM-APOLAR-DIST', 'Sería apolar si jalaran igual: ΔEN = 0.'] };
    return { correcta: DEN[t], _datos: { a, b },
      enunciado: [a === b ? `Los dos átomos de la molécula ${a}₂.` : `El enlace entre ${EL[a].nombre} y ${EL[b].nombre} (${a}–${b}).`], pregunta: ['¿Qué tipo de enlace es?'],
      datos: [enTxt([a, b]), D.delta, D.guia],
      errores: [...Object.keys(DEN).filter(k => k !== t).map(k => err(SI[k][0], DEN[k], `Bien calcular ΔEN. ${SI[k][1]}`)), err('QM-TIPO-METAL', 'Metálico', 'Sería metálico si los dos fueran metales.')],
      solucion: [[a === b ? 'Dos átomos iguales jalan igual el par.' : `Resto: ${f2(Math.max(EL[a].en, EL[b].en))} − ${f2(Math.min(EL[a].en, EL[b].en))}.`], ['ΔEN = ', v('EN', f2(d)), `: ${DEN[t].toLowerCase()}.`]] };
  }
  const PROPS = [['ionico', 'Un sólido blanco y duro funde a unos 770 °C. Sólido no conduce la corriente; disuelto en agua, sí.'],
    ['ionico', 'Un sólido funde a unos 2800 °C, se quiebra al golpearlo y conduce la corriente solo cuando está fundido.'],
    ['metalico', 'Un sólido brillante funde a unos 1085 °C, se deja estirar en alambres y conduce la corriente en estado sólido.'],
    ['metalico', 'Un sólido gris funde a unos 660 °C, se lamina en hojas delgadas y conduce la corriente y el calor.'],
    ['covalente', 'Un sólido blanco y blando funde a unos 60 °C y no conduce la corriente, ni sólido ni fundido.'],
    ['covalente', 'Un líquido hierve a unos 77 °C, no conduce la corriente y no se mezcla con el agua.']];
  function tipoPropiedades(rng) {
    const i = rng.entero(0, PROPS.length - 1), [t, txt] = PROPS[i];
    const SI = { ionico: ['QM-CONDUCE-IONICO', 'Un iónico conduce fundido o disuelto, nunca sólido.'], covalente: ['QM-PF-ALTO', 'Un covalente molecular funde bajo y no conduce.'], metalico: ['QM-CONDUCE-METAL', 'Un metal conduce también sólido.'] };
    return { correcta: TIPO[t], _datos: { i },
      enunciado: [txt], pregunta: ['¿Qué tipo de enlace tiene?'], datos: [D.props],
      errores: [...Object.keys(TIPO).filter(k => k !== t).map(k => err(SI[k][0], TIPO[k], `Bien mirar la conducción. ${SI[k][1]}`)), err('QM-SIN-LEY', 'No se puede saber sin su fórmula', 'Las propiedades ya lo dicen: la conducción y la fusión.')],
      solucion: [[{ ionico: 'Conduce solo fundido o disuelto: sus iones se mueven recién ahí.', metalico: 'Conduce sólido: tiene electrones que se mueven.', covalente: 'Funde bajo y no conduce: son moléculas sin carga.' }[t]]] };
  }

  // ---- Idea 2: enlace iónico ----
  const qIon = s => (EL[s].metal ? EL[s].val : EL[s].val - 8);
  const cargaSup = q => `${Math.abs(q) === 1 ? '' : SUP[Math.abs(q)] || Math.abs(q)}${q > 0 ? '⁺' : '⁻'}`;
  const ionTxt = s => `${s}${cargaSup(qIon(s))}`;
  const mcd = (a, b) => (b ? mcd(b, a % b) : a);
  const formula = (m, x) => { const qm = qIon(m), qx = -qIon(x), g = mcd(qm, qx), a = qx / g, b = qm / g; return { a, b, qm, qx, texto: `${m}${SUB[a]}${x}${SUB[b]}`, transfiere: a * qm }; };
  const MET = ['Li', 'Na', 'K', 'Mg', 'Ca', 'Al'], NOM = ['F', 'Cl', 'Br', 'I', 'O', 'S', 'N'];
  const PARES_I = MET.flatMap(m => NOM.map(x => [m, x])).filter(([m, x]) => !(x === 'N' && (m === 'Na' || m === 'K')));
  function cargaIon(rng) {
    const s = rng.elegir([...MET, 'F', 'Cl', 'Br', 'O', 'S', 'N']), q = qIon(s), val = EL[s].val, met = EL[s].metal, t = q2 => `${s}${cargaSup(q2)}`;
    return { correcta: t(q), _datos: { s },
      enunciado: [`El ${EL[s].nombre} se une con ${met ? 'un no metal' : 'un metal'}.`], pregunta: ['¿Qué ', v('q', 'ion'), ' forma?'], datos: [lugarTxt(s), D.octeto],
      errores: [err('QM-ION-SIGNO', t(-q), met ? 'Bien la cantidad. Pero un metal entrega electrones: queda positivo.' : 'Bien la cantidad. Pero un no metal recibe electrones: queda negativo.'),
        err('QM-ION-OCTETO', met ? t(val - 8) : t(val), met ? `Bien buscar el 8. Pero entregar ${val} es más fácil que recibir ${8 - val}.` : `Bien mirar sus ${val}. Pero recibir ${8 - val} es más fácil.`),
        err('QM-ION-UNO', Math.abs(q) === 1 ? t(2 * q) : t(Math.sign(q)), `Bien el signo. Pero ${Math.abs(q) === 1 ? 'cambia' : 'cambian'} ${eTxt(Math.abs(q))}.`)],
      solucion: [[met ? `Entrega sus ${val} de valencia.` : `Recibe ${8 - val} y completa 8.`], [v('q', t(q))]] };
  }
  function formulaIonica(rng) {
    const [m, x] = rng.elegir(PARES_I), F = formula(m, x), uno = `${m}${x}`, inv = `${m}${SUB[F.qm] || F.qm}${x}${SUB[F.qx] || F.qx}`, sinS = `${m}${SUB[F.qx] || F.qx}${x}${SUB[F.qm] || F.qm}`;
    return { correcta: F.texto, _datos: { m, x },
      enunciado: [`El ${EL[m].nombre} y el ${EL[x].nombre} forman un compuesto iónico.`], pregunta: ['¿Cuál es su fórmula?'], datos: [`Iones: ${ionTxt(m)} y ${ionTxt(x)}`, D.cero],
      errores: [err('QM-FORM-UNO', uno, 'Bien juntar los dos. Pero las cargas no se anulan uno a uno.'), err('QM-FORM-INVERSA', inv, 'Bien usar las cargas. Pero cada ion lleva la cantidad del otro.'),
        err('QM-FORM-SIN-SIMPLIFICAR', sinS, 'Bien la proporción. Pero se escribe con los números más chicos.'),
        err('QM-FORM-DOBLE', `${m}${SUB[2 * F.a] || 2 * F.a}${x}${SUB[F.b] || F.b}`, 'Así la carga total no da cero.')],
      solucion: [[`${F.a} · (+${F.qm}) + ${F.b} · (−${F.qx}) = 0.`], [v('q', ionTxt(m)), ' y ', v('q', ionTxt(x)), ` → ${F.texto}`]] };
  }
  function electronesTransferidos(rng) {
    const [m, x] = rng.elegir(PARES_I.filter(([a, b]) => formula(a, b).transfiere > 1)), F = formula(m, x);
    return { correcta: String(F.transfiere), _datos: { m, x },
      enunciado: [`El compuesto ${F.texto}.`], pregunta: [`¿Cuántos `, v('e', 'electrones'), ` pasan en total del ${EL[m].nombre} al ${EL[x].nombre} por cada unidad de la fórmula?`],
      datos: [`Iones: ${ionTxt(m)} y ${ionTxt(x)}`],
      errores: [err('QM-TRANSF-UNO', String(F.qm), `Bien la carga del ${ionTxt(m)}. Pero hay ${F.a} átomo${F.a > 1 ? 's' : ''} de ${m}.`), err('QM-TRANSF-ATOMOS', String(F.a + F.b), 'Eso cuenta átomos; se cuentan electrones.'),
        err('QM-TRANSF-SUMA', String(F.qm + F.qx), 'Eso suma las dos cargas.'), err('QM-TRANSF-DOBLE', String(2 * F.transfiere), 'Eso cuenta dos veces: lo que entrega uno lo recibe el otro.')],
      solucion: [[`Cada ${m} entrega ${F.qm}; hay ${F.a}.`], [`${F.a} · ${F.qm} = `, v('e', `${F.transfiere} e⁻`)]] };
  }

  // ---- Idea 3: Lewis y octeto ----
  const ESPECIES = [['NH₄⁺', ['N', 'H', 'H', 'H', 'H'], 1], ['H₃O⁺', ['O', 'H', 'H', 'H'], 1], ['OH⁻', ['O', 'H'], -1], ['CN⁻', ['C', 'N'], -1], ['NO₃⁻', ['N', 'O', 'O', 'O'], -1],
    ['PO₄³⁻', ['P', 'O', 'O', 'O', 'O'], -3], ['ClO₄⁻', ['Cl', 'O', 'O', 'O', 'O'], -1], ['CCl₄', ['C', 'Cl', 'Cl', 'Cl', 'Cl'], 0], ['NF₃', ['N', 'F', 'F', 'F'], 0], ['H₂S', ['H', 'H', 'S'], 0],
    ['SO₃²⁻', ['S', 'O', 'O', 'O'], -2], ['NO₂⁻', ['N', 'O', 'O'], -1], ['CO₃²⁻', ['C', 'O', 'O', 'O'], -2], ['SO₄²⁻', ['S', 'O', 'O', 'O', 'O'], -2], ['BH₄⁻', ['B', 'H', 'H', 'H', 'H'], -1]];
  const suma = ats => ats.reduce((a, s) => a + EL[s].val, 0);
  function electronesRepartir(rng) {
    const [t, ats, q] = rng.elegir(ESPECIES), n = suma(ats) - q;
    return { correcta: String(n), _datos: { t, ats, q },
      enunciado: [`La estructura de Lewis del ${t}.`], pregunta: ['¿Cuántos ', v('e', 'electrones'), ' hay que repartir?'], datos: [valTxt(ats), D.carga],
      errores: [q ? err('EN4', String(suma(ats)), 'Bien sumar los de valencia. Pero falta la carga.') : err('EN4', String(ats.length - 1), 'Eso cuenta enlaces.'),
        q ? err('QM-NVAL-SIGNO', String(suma(ats) + q), 'Bien usar la carga. Pero va con el signo al revés.') : err('QM-NVAL-OCTETOS', String(8 * ats.filter(s => s !== 'H').length + 2 * ats.filter(s => s === 'H').length), 'Eso suma los octetos.'),
        err('EN4', String(ats.length), 'Eso cuenta átomos.'), err('QM-LIBRES-ELECTRONES', String(n / 2), 'Eso cuenta pares, no electrones.')],
      solucion: [[q ? `Sumo los de valencia y ${q > 0 ? 'resto' : 'sumo'} la carga.` : 'Sumo los de valencia.'], [`${suma(ats)}${q ? ` ${q > 0 ? '−' : '+'} ${Math.abs(q)}` : ''} = `, v('e', `${n} e⁻`)]] };
  }
  // Centrales con enlaces simples a H o halógenos, con su octeto: [fórmula, central, n.º de ligandos, ligando].
  const CENTRALES = [['H₂O', 'O', 2, 'H'], ['H₂S', 'S', 2, 'H'], ['PCl₃', 'P', 3, 'Cl'], ['NF₃', 'N', 3, 'F'], ['SCl₂', 'S', 2, 'Cl'], ['CCl₄', 'C', 4, 'Cl'], ['NH₃', 'N', 3, 'H'],
    ['CH₄', 'C', 4, 'H'], ['PH₃', 'P', 3, 'H'], ['OF₂', 'O', 2, 'F'], ['SiH₄', 'Si', 4, 'H']];
  EL.Si = { s: 'Si', nombre: 'silicio', g: 14, val: 4, en: 1.90, metal: false };
  function libresCentral(rng) {
    const [fo, c, n, l] = rng.elegir(CENTRALES), lib = (EL[c].val - n) / 2;
    return { correcta: String(lib), _datos: { fo, c, n },
      enunciado: [`La estructura de Lewis del ${fo}, con el ${EL[c].nombre} al centro.`], pregunta: ['¿Cuántos ', v('e', 'pares libres'), ' tiene el átomo central?'], datos: [valTxt([c, l]), D.enlace, D.meta],
      errores: [err('QM-LIBRES-TODOS', '4', `Bien la meta de 8. Pero ${n} de sus 4 pares se comparten.`), err('QM-LIBRES-ELECTRONES', String(EL[c].val - n), 'Eso cuenta electrones sueltos, no pares.'),
        err('QM-LIBRES-UNO', String(lib + 1), 'Sobra uno: cuenta de nuevo los 8.'), err('QM-LIBRES-ENLACES', String(n), 'Eso cuenta los enlaces del central, no sus pares libres.'),
        err('QM-LIBRES-UNO', String(lib + 2), 'Sobran dos: cuenta de nuevo los 8.')],
      solucion: [[`El ${c} usa ${n} electrones en enlaces; le quedan ${EL[c].val - n}.`], [`(${EL[c].val} − ${n}) ÷ 2 = `, v('e', `${lib}`)]] };
  }
  const ORDENES = [['O₂', 'los dos oxígenos', 2, ['O']], ['CO₂', 'el carbono y un oxígeno', 2, ['C', 'O']], ['HCN', 'el carbono y el nitrógeno', 3, ['H', 'C', 'N']],
    ['CH₂O', 'el carbono y el oxígeno', 2, ['C', 'H', 'O']], ['Cl₂', 'los dos cloros', 1, ['Cl']], ['N₂', 'los dos nitrógenos', 3, ['N']], ['HCl', 'el hidrógeno y el cloro', 1, ['H', 'Cl']], ['CN⁻', 'el carbono y el nitrógeno', 3, ['C', 'N']]];
  const OTX = { 1: 'Simple: un par compartido', 2: 'Doble: dos pares compartidos', 3: 'Triple: tres pares compartidos' };
  function ordenEnlace(rng) {
    const [fo, quien, o, ats] = rng.elegir(ORDENES);
    return { correcta: OTX[o], _datos: { fo, o },
      enunciado: [`En el ${fo}, todos los átomos cumplen su octeto (el H, 2).`], pregunta: [`¿Cómo es el enlace entre ${quien}?`], datos: [valTxt(ats), D.meta],
      errores: [...[1, 2, 3].filter(x => x !== o).map(x => err(x < o ? 'QM-OCTETO-FALTA' : 'QM-OCTETO-SOBRA', OTX[x], x < o ? 'Bien unirlos. Pero así a alguno le faltan electrones.' : 'Bien buscar el octeto. Pero así alguno pasa de 8.')),
        err('EN5', 'Iónico: uno le entrega electrones al otro', 'Entregar sería con un metal; aquí solo hay no metales.')],
      solucion: [[`Con ${o === 1 ? 'un enlace simple' : o === 2 ? 'un doble' : 'un triple'}, cada átomo llega a su meta.`]] };
  }

  // ---- Idea 4: dativo y excepciones ----
  const DATIVOS = [['NH₄⁺', 'N', 'el NH₃ recibe un H⁺', 'H'], ['H₃O⁺', 'O', 'el H₂O recibe un H⁺', 'H'], ['BF₄⁻', 'F', 'el BF₃ recibe un F⁻', 'B'], ['H₃N–BF₃', 'N', 'el NH₃ se une al BF₃', 'B'], ['AlCl₄⁻', 'Cl', 'el AlCl₃ recibe un Cl⁻', 'Al']];
  function quienPone(rng) {
    const [fo, pone, como, otro] = rng.elegir(DATIVOS);
    return { correcta: `El ${EL[pone].nombre}`, _datos: { fo, pone },
      enunciado: [`El ${fo} se forma cuando ${como}.`], pregunta: ['¿Qué átomo pone los dos ', v('e', 'electrones'), ' del enlace dativo?'], datos: [D.dativo, D.meta],
      errores: [err('QM-DATIVO-ACEPTA', `El ${EL[otro].nombre}`, `El ${EL[otro].nombre} recibe el par; lo pone el que tiene un par libre.`), err('QM-DATIVO-UNO', 'Cada uno pone un electrón', 'Así es un enlace común; en el dativo, uno solo.'),
        err('EN5', 'Ninguno: es un enlace iónico', 'Comparten un par: es covalente.')],
      solucion: [[`El ${EL[pone].nombre} tiene un par libre y lo comparte entero.`]] };
  }
  // Electrones alrededor del central: [fórmula, central, enlaces simples, pares libres del central].
  const ALREDEDOR = [['BeCl₂', 'Be', 2, 0], ['BF₃', 'B', 3, 0], ['BCl₃', 'B', 3, 0], ['AlCl₃', 'Al', 3, 0], ['PCl₅', 'P', 5, 0], ['SF₆', 'S', 6, 0], ['SF₄', 'S', 4, 1], ['ClF₃', 'Cl', 3, 2],
    ['XeF₂', 'Xe', 2, 3], ['XeF₄', 'Xe', 4, 2], ['BrF₅', 'Br', 5, 1], ['PCl₃', 'P', 3, 1]];
  function electronesCentral(rng) {
    const [fo, c, n, l] = rng.elegir(ALREDEDOR), e = 2 * n + 2 * l;
    return { correcta: String(e), _datos: { fo, n, l },
      enunciado: [`En la estructura de Lewis del ${fo}, el ${EL[c].nombre} forma ${n} enlaces simples y ${l === 0 ? 'no tiene pares libres' : `tiene ${l} par${l > 1 ? 'es' : ''} libre${l > 1 ? 's' : ''}`}.`],
      pregunta: ['¿Cuántos ', v('e', 'electrones'), ' lo rodean?'], datos: [D.cuenta],
      errores: [err('QM-CENTRAL-OCHO', '8', 'Bien la idea del octeto. Pero aquí no se cumple: cuenta.'), err('QM-CENTRAL-ENLACES', String(n), 'Eso cuenta enlaces; cada uno son 2 electrones.'),
        err('QM-CENTRAL-SIN-LIBRES', String(2 * n), l ? 'Bien los enlaces. Pero faltan sus pares libres.' : 'Bien los enlaces; revisa si sobran.'), err('QM-CENTRAL-UNO', String(e + 2), 'Sobran dos.')],
      solucion: [[`${n} enlaces${l ? ` y ${l} par${l > 1 ? 'es' : ''} libre${l > 1 ? 's' : ''}` : ''}.`], [`2 · ${n}${l ? ` + 2 · ${l}` : ''} = `, v('e', `${e} e⁻`)]] };
  }
  const RAD = [['NO', ['N', 'O'], 0], ['NO₂', ['N', 'O', 'O'], 0], ['OH', ['O', 'H'], 0], ['ClO₂', ['Cl', 'O', 'O'], 0], ['OH⁻', ['O', 'H'], -1], ['H₂O₂', ['H', 'H', 'O', 'O'], 0], ['O₂²⁻', ['O', 'O'], -2],
    ['HO₂⁻', ['H', 'O', 'O'], -1], ['NO₂⁻', ['N', 'O', 'O'], -1], ['NO⁺', ['N', 'O'], 1], ['CN⁻', ['C', 'N'], -1], ['H₂O', ['H', 'H', 'O'], 0]];
  const nE = x => suma(x[1]) - x[2];
  function radical(rng) {
    const rad = rng.elegir(RAD.filter(x => nE(x) % 2)), no = rng.barajar(RAD.filter(x => nE(x) % 2 === 0)).slice(0, 3);
    return { correcta: rad[0], _datos: { rad: rad[0], no: no.map(x => x[0]) },
      enunciado: [`Las especies ${rng.barajar([rad, ...no]).map(x => x[0]).join(', ')}.`], pregunta: ['¿Cuál es un radical libre?'], datos: [valTxt([...rad[1], ...no.flatMap(x => x[1])]), D.carga, D.radical],
      errores: no.map(x => err(x[2] ? 'QM-RADICAL-ION' : 'QM-RADICAL-PAR', x[0], `${x[0]}: ${nE(x)} electrones, número par.${x[2] ? ' La carga no la hace radical.' : ''}`)),
      solucion: [[`${rad[0]}: ${rad[1].map(s => EL[s].val).join(' + ')} = ${nE(rad)}, impar.`]] };
  }

  // ---- Idea 5: resonancia ----
  const RES = [['O₃', 'O–O', 3, 2], ['NO₃⁻', 'N–O', 4, 3], ['CO₃²⁻', 'C–O', 4, 3], ['NO₂⁻', 'N–O', 3, 2], ['SO₃', 'S–O', 4, 3], ['HCOO⁻', 'C–O', 3, 2], ['CH₃COO⁻', 'C–O', 3, 2]];
  const fr = (a, b) => (a === 4 && b === 3 ? '4/3' : '3/2');
  function cuantasEstructuras(rng) {
    const [fo, enl, , pos] = rng.elegir(RES);
    return { correcta: String(pos), _datos: { fo, pos },
      enunciado: [`En el ${fo}, el doble enlace puede ir en cualquiera de sus ${pos} enlaces ${enl} iguales.`], pregunta: ['¿Cuántas estructuras de resonancia tiene?'],
      datos: [`${fo}: un ${enl} doble en cada dibujo`],
      errores: [err('QM-RES-UNO', '1', 'Bien dibujar una. Pero el doble puede ir en otro lugar.'), err('QM-RES-POSICIONES', String(pos + 1), 'Eso cuenta también el híbrido, que no es una estructura más.'),
        err('QM-RES-POSICIONES', String(2 * pos), 'Eso cuenta dos veces cada lugar.')],
      solucion: [['Un dibujo por cada enlace donde puede ir el doble.']] };
  }
  function ordenPromedio(rng) {
    const [fo, enl, tot, pos] = rng.elegir(RES);
    return { correcta: fr(tot, pos), _datos: { fo, tot, pos },
      enunciado: [`El ${fo} tiene ${pos} estructuras de resonancia; en cada una, un ${enl} es doble.`], pregunta: [`¿Qué orden tiene cada ${enl} en la especie real?`], datos: [D.orden, D.promedio],
      errores: [err('QM-RES-UNO', '2', 'Sería 2 si el doble estuviera fijo.'), err('QM-RES-UNO', '1', 'Sería 1 sin ningún doble.'), err('QM-RES-CUENTA', tot === 4 ? '3/2' : '4/3', `Esa fracción es de otro número de enlaces: aquí son ${pos}.`),
        err('QM-RES-TODOS', String(tot), 'Eso cuenta todos los pares juntos; se reparten entre los enlaces.')],
      solucion: [[`${tot} pares en ${pos} enlaces.`], [`${tot} ÷ ${pos} = ${fr(tot, pos)}`]] };
  }
  const CF = [['un oxígeno con enlace simple y tres pares libres', 6, 6, 1, 'NO₃⁻'], ['el oxígeno del doble enlace, con dos pares libres', 6, 4, 2, 'CO₃²⁻'],
    ['el nitrógeno central, con cuatro enlaces y sin pares libres', 5, 0, 4, 'NO₃⁻'], ['el oxígeno central, con tres enlaces y un par libre', 6, 2, 3, 'O₃'],
    ['el carbono central, con cuatro enlaces y sin pares libres', 4, 0, 4, 'CO₃²⁻'], ['el nitrógeno del NH₄⁺, con cuatro enlaces y sin pares libres', 5, 0, 4, 'NH₄⁺']];
  const cfT = x => (x === 0 ? '0' : `${x > 0 ? '+' : '−'}${Math.abs(x)}`);
  function cargaFormal(rng) {
    const [quien, va, li, en, sp] = rng.elegir(CF), cf = va - li - en;
    const ion = { 'NO₃⁻': '−1', 'CO₃²⁻': '−2', 'O₃': '+2', 'NH₄⁺': '+2' }[sp];
    return { correcta: cfT(cf), _datos: { va, li, en },
      enunciado: [`Una estructura de Lewis del ${sp}.`], pregunta: [`¿Qué `, v('q', 'carga formal'), ` tiene ${quien}?`], datos: [D.cf],
      errores: [err(cf ? 'QM-CF-SIGNO' : 'QM-CF-CARGA', cfT(-cf || 1), cf ? 'Bien la cuenta. Pero el signo va al revés.' : 'Ese átomo tiene justo sus electrones: 0.'),
        err('QM-CF-PARES', cfT(va - li / 2 - en), 'Se restan electrones libres, no pares.'), err('QM-CF-ENLACES', cfT(va - li - 2 * en), 'De cada enlace le toca un electrón, no dos.'),
        err('EN7', ion, 'Esa es otra cuenta: la carga formal es átomo por átomo.')],
      solucion: [['Valencia menos electrones libres menos enlaces.'], [`${va} − ${li} − ${en} = `, v('q', cfT(cf))]] };
  }

  const CONSTRUIR = { 'tipo-elementos': tipoElementos, 'delta-signo': deltaSigno, 'tipo-den': tipoDen, 'tipo-propiedades': tipoPropiedades, 'carga-ion': cargaIon, 'formula-ionica': formulaIonica,
    'electrones-transferidos': electronesTransferidos, 'electrones-repartir': electronesRepartir, 'libres-central': libresCentral, 'orden-enlace': ordenEnlace, 'quien-pone': quienPone,
    'electrones-central': electronesCentral, radical, 'cuantas-estructuras': cuantasEstructuras, 'orden-promedio': ordenPromedio, 'carga-formal': cargaFormal };
  function generar(semilla, opciones = {}) {
    const rng = Azar.crear(`${ID}|${semilla}`);
    const idea = TIPOS_POR_IDEA[opciones.idea] ? opciones.idea : rng.elegir(IDEAS), tipo = rng.elegir(TIPOS_POR_IDEA[idea]);
    for (let intento = 0; intento < 500; intento++) {
      const p = cerrar(rng, semilla, tipo, CONSTRUIR[tipo](rng));
      if (p) return p;
    }
    throw new Error(`${ID}: no se pudo generar un problema de ${tipo}`);
  }
  return { id: ID, titulo: 'Tipos de enlace, iones y estructuras de Lewis', generar, TIPOS_POR_IDEA, NIVEL, TIPOS: Object.keys(CONSTRUIR), DATOS: { EL } };
});
