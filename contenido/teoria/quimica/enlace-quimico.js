/*
 * Teoría de «Enlace químico y fuerzas intermoleculares» (quimica.enlace-quimico). Molde: docs/teoria.md y
 * contenido/teoria/quimica/materia-y-energia.js. Compañera: Bruna (castora), voz resolutiva y cálida.
 * Fuente del contenido: docs/teoria/matriz/quimica.json (unidad 4) y docs/teoria/fuentes/historia-ecuaciones-1.pdf.
 * Errores: docs/investigacion/atomo-enlace-ideas-erroneas.md (EN1–EN17) y quimica-materia-nomenclatura-organica
 * (FO2); los QM- son hipótesis nuevas de esta unidad.
 *
 * Ficha de tarea (diseno-y-animacion)
 *   Promesa: reconocer el tipo de enlace, contar los electrones de una estructura de Lewis y decidir forma y
 *     polaridad de una molécula pequeña.
 *   Persona y condiciones: postulante de 3.º–5.º, celular de gama baja a 360 px, sin audio, a veces sin conexión.
 *   Resultado observable: dice si una sustancia es iónica, covalente o metálica; cuenta N_val; dice la forma, la
 *     hibridación y si es polar; compara puntos de ebullición por las fuerzas entre moléculas.
 *   Orden de atención: 1.º la estructura dibujada · 2.º la lectura en vivo · acción: cambiar de sustancia · fondo: Bruna.
 *   Estados: juego sin tocar · casos probados · predicción abierta · revelado · paso a paso · caso nuevo · acierto · «No sé».
 *   Duda que resuelve: ¿la sal tiene moléculas?, ¿enlaces polares = molécula polar?, ¿al hervir se rompen enlaces?
 *
 * Colores (regla 4): electrones de valencia N_val turquesa c-i, carga (del ion, formal, parcial δ) rojo c-h, ángulo
 * verde c-d, dipolo μ naranja c-o (la pieza quim-molecula dibuja los dipolos en naranja). Los átomos van en tinta.
 * En la lupa de la idea 1 (sin ecuaciones): catión naranja con punto, anión turquesa hueco, metal verde.
 * Datos (no van al alumno): ángulos y forma por VSEPR, OpenStax Chemistry 2e §7.6 (H₂O 104,5°, NH₃ 107°,
 * CH₄ 109,5°, BF₃ 120°, CO₂ 180°); momentos dipolares de CRC Handbook (H₂O 1,85 D, NH₃ 1,47 D); puntos de
 * ebullición a 1 atm, CRC/NIST WebBook (H₂O 100, H₂S −60, H₂Se −41, H₂Te −2, NH₃ −33, PH₃ −88, HF 20, HCl −85,
 * CH₃OH 65, CH₄ −162, etanol 78, éter dimetílico −24, Cl₂ −34, Br₂ 59, n-pentano 36, neopentano 10 °C).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  // El motor de plantillas/enlace da la forma 3D, los pares libres y los dipolos de la mesa «La molécula que gira».
  const def = nodo ? fabrica(require('../../../nucleo/kit/kit.js'), require('../../../plantillas/enlace/motor.js'))
    : fabrica(root.Kit, root.MotorEnlace);
  if (nodo) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit, M) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const Nv = { sub: [{ v: 'c-i', t: 'N' }, 'val'] }, z = { v: 'c-h', t: 'z' }, mu = { v: 'c-o', t: 'μ' };
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let x = q; x = Math.imul(x ^ (x >>> 15), x | 1); x ^= x + Math.imul(x ^ (x >>> 7), x | 61); return ((x ^ (x >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = l => l[Math.floor(r() * l.length)];
    return r;
  }
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      const txt = fmt(d.valor);
      if (vistos.has(txt) || !Number.isFinite(d.valor)) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }
  // Opciones de texto: la correcta y los distractores que no repiten texto.
  const elegir = (bien, malas) => [{ id: 'c', texto: bien, correcta: true }, ...malas.filter(x => x.texto !== bien)].slice(0, 4);

  // ---------- Idea 1: tres maneras de unirse (iónico, metálico, covalente) ----------
  // Cambia: la sustancia · Permanece: la lupa del mismo tamaño · Progresa: de una red de iones a un mar de
  // electrones y a moléculas sueltas · Se reserva: que en la sal no hay «moléculas de NaCl» · Debe verse: qué
  // partícula se repite en cada sólido.
  const ATOMOS = { Na: { color: 'o', estilo: 'punto', r: 6 }, Cl: { color: 'i', estilo: 'hueco', r: 8 }, Cu: { color: 'd', estilo: 'punto', r: 7 },
    e: { color: 'i', estilo: 'lleno', r: 2.5 }, O: { estilo: 'lleno', r: 6 }, H: { estilo: 'hueco', r: 4 } };
  const ESPECIES = { H2O: [['O', 0, -1], ['H', -6, 4], ['H', 6, 4]] };
  const lupa = (cajas, extra = {}) => ({ datos: Object.assign({ atomos: ATOMOS, especies: ESPECIES, alto: 150, separacion: 22, cajas }, extra), estado: {} });
  function red(a, b, cols, filas, x0 = 0.1, x1 = 0.9, y0 = 0.1, y1 = 0.9, extra = {}) {
    const out = [];
    for (let i = 0; i < filas; i++) for (let j = 0; j < cols; j++) {
      const e = b && (i + j) % 2 ? b : a;
      out.push(Object.assign({ e, n: 1, x: x0 + (x1 - x0) * j / (cols - 1), y: y0 + (y1 - y0) * i / (filas - 1) }, extra));
    }
    return out;
  }
  const SOLIDOS = {
    sal: { titulo: 'Sal (NaCl)', caja: { forma: 'caja', particulas: red('Na', 'Cl', 7, 5) }, lee: 'Red de iones Na⁺ y Cl⁻ alternados: enlace iónico.' },
    cobre: { titulo: 'Cobre', caja: { forma: 'caja', particulas: [...red('Cu', null, 6, 5), { e: 'e', n: 14 }] }, lee: 'Cationes de cobre en un mar de electrones: metálico.' },
    hielo: { titulo: 'Hielo (H₂O)', caja: { forma: 'caja', particulas: red('H2O', null, 5, 4, 0.12, 0.88, 0.12, 0.88) }, lee: 'Moléculas de agua: átomos que comparten electrones. Covalente.' },
  };
  const solido = k => lupa([Object.assign({ titulo: SOLIDOS[k].titulo }, SOLIDOS[k].caja)]);
  const TIPOS = {
    ionico: { nombre: 'Iónico', si: 'Sería iónico si se unieran un metal y un no metal en una red de iones.', porque: 'Metal con no metal: red de cationes y aniones.' },
    covalente: { nombre: 'Covalente', si: 'Sería covalente si solo hubiera no metales compartiendo pares de electrones.', porque: 'Solo no metales: comparten pares de electrones.' },
    metalico: { nombre: 'Metálico', si: 'Sería metálico si fuera un metal solo: cationes en un mar de electrones.', porque: 'Un metal solo: cationes en un mar de electrones móviles.' },
  };
  // Sin arrastre: el control elige entre tres sólidos distintos; no hay una magnitud que agarrar en la lupa.
  const tres = {
    id: 'tres-enlaces',
    titulo: 'Tres maneras de unirse',
    temas: ['Enlace iónico', 'Enlace metálico'],
    pieza: 'quim-particulas',
    juega: {
      consigna: 'Elige un sólido y míralo con la lupa. Fíjate qué partícula se repite y si hay grupos sueltos o una red continua.',
      voz: 'Primero el inventario: qué partícula se repite en cada sólido.',
      controles: [{ id: 'k', etiqueta: 'Sólido', opciones: Object.keys(SOLIDOS).map(k => ({ valor: k, texto: SOLIDOS[k].titulo })) }],
      dibujo: val => solido(val.k),
      lectura: val => [SOLIDOS[val.k].lee],
      minimo: 3,
    },
    predice: {
      pregunta: 'Una fórmula como NaCl parece describir una molécula. Con la lupa, ¿qué hay dentro de un grano de sal?',
      voz: 'Anota tu predicción; después abrimos la lupa.',
      opciones: [
        { id: 'c', texto: 'Una red de iones Na⁺ y Cl⁻ alternados', correcta: true },
        { id: 'pares', texto: 'Moléculas de NaCl sueltas, de a pares', error: 'EN1', siFuera: 'La fórmula dice 1 a 1, cierto. Pero cada ion está rodeado de varios del otro tipo, sin pares.' },
        { id: 'comparten', texto: 'Átomos de Na y Cl que comparten electrones', error: 'EN5', siFuera: 'Compartir sería covalente, entre no metales. El sodio cede su electrón y quedan iones.' },
        { id: 'neutros', texto: 'Átomos neutros de sodio y cloro', error: 'EN2', siFuera: 'Antes de unirse eran neutros. En la sal, cada sodio quedó +1 y cada cloro −1.' },
      ],
      dibujo: lupa([{ titulo: 'Grano de sal', forma: 'caja', particulas: [] }]),
      revelar: lupa([{ titulo: 'Grano de sal', forma: 'caja', particulas: red('Na', 'Cl', 7, 5) }]),
      coincide: 'Coincide: una red continua de iones, sin moléculas sueltas.',
      noCoincide: 'Con la lupa se ve una red continua de iones alternados.',
    },
    mira: {
      datos: lupa([
        { titulo: 'Iónico', forma: 'caja', particulas: red('Na', 'Cl', 4, 5, 0.12, 0.88, 0.1, 0.9, { desde: 1 }) },
        { titulo: 'Metálico', forma: 'caja', particulas: [...red('Cu', null, 3, 4, 0.18, 0.82, 0.12, 0.88, { desde: 2 }), { e: 'e', n: 8, desde: 2 }] },
        { titulo: 'Covalente', forma: 'caja', particulas: red('H2O', null, 2, 3, 0.25, 0.75, 0.15, 0.85, { desde: 3 }) },
      ], { separacion: 24 }).datos,
      voz: 'Comparemos qué se repite en cada caja.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Iónico: el metal cede electrones al no metal; los iones se atraen en red.', ecuacion: ['Na⁺ Cl⁻ Na⁺ Cl⁻ …'] },
        { estado: { corte: 2 }, texto: 'Metálico: cationes ordenados y electrones que se mueven entre todos.', ecuacion: ['Cu²⁺ + e⁻ móviles'] },
        { estado: { corte: 3 }, texto: 'Covalente: no metales que comparten pares; aquí, moléculas sueltas.', ecuacion: ['H–O–H'] },
        { estado: { corte: 3 }, texto: 'Por eso el cobre conduce sólido y la sal solo fundida o disuelta.' },
      ],
    },
    regla: {
      texto: 'Iónico: red de cationes y aniones que se atraen. Metálico: cationes en un mar de electrones móviles. Covalente: átomos que comparten pares de electrones.',
      ecuacion: ['metal + no metal: iónico', '   ·   ', 'solo no metales: covalente'],
      condicion: 'metal con no metal es una guía, no una ley: hay casos intermedios, y no todo sólido está hecho de moléculas.',
      voz: 'Mira qué elementos hay antes de decidir.',
    },
    ahoraTu: {
      voz: 'Decide por los elementos que se unen.',
      generar(s) {
        const CASOS = [['KBr', 'ionico', 'bromuro de potasio'], ['Fe', 'metalico', 'hierro'], ['CO₂', 'covalente', 'dióxido de carbono'], ['MgO', 'ionico', 'óxido de magnesio'],
          ['Al', 'metalico', 'aluminio'], ['NH₃', 'covalente', 'amoniaco'], ['CaF₂', 'ionico', 'fluoruro de calcio'], ['Cl₂', 'covalente', 'cloro'], ['Cu', 'metalico', 'cobre'], ['CH₄', 'covalente', 'metano']];
        const [fo, tipo, nom] = CASOS[s % CASOS.length];
        return {
          pregunta: `¿Qué tipo de enlace une las partículas del ${nom} (${fo})?`,
          opciones: Object.keys(TIPOS).map(k => (k === tipo ? { id: 'c', texto: TIPOS[k].nombre, correcta: true } : { id: k, texto: TIPOS[k].nombre, error: 'EN5', siFuera: TIPOS[k].si })),
          solucion: { texto: TIPOS[tipo].porque, ecuacion: [`${fo}: enlace ${TIPOS[tipo].nombre.toLowerCase()}`] },
        };
      },
    },
  };

  // ---------- Idea 2: Lewis es contar electrones antes de dibujar ----------
  // Cambia: la molécula · Permanece: N_val = suma − carga y la meta de 8 (H, 2) · Progresa: de contar a enlazar y a
  // completar octetos · Se reserva: el BF₃, que se queda con 6 · Debe verse: que enlaces y pares suman N_val.
  const VAL = { H: 1, B: 3, C: 4, N: 5, O: 6, F: 7, S: 6, Cl: 7, P: 5 };
  // Una estructura: átomos (t es el símbolo), enlaces y pares libres. Se comprueba que los electrones dibujados sean N_val.
  function lewis(atomos, enlaces, pares, carga = 0, extra = {}) {
    const nval = atomos.reduce((a, x) => a + VAL[x.t], 0) - carga;
    const dib = 2 * enlaces.filter(e => !e.hasta && !e.desde).reduce((a, e) => a + (e.orden || 1), 0) + 2 * pares.filter(p => !p.hasta && !p.desde).length;
    if (!extra.paso && dib !== nval) throw new Error(`Lewis: dibuja ${dib} electrones y N_val es ${nval}`);
    const datos = Object.assign({ atomos, enlaces, pares, escala: 62, alto: 210 }, extra.datos || {});
    if (carga) datos.textos = (datos.textos || []).concat([{ x: 0, y: Math.max(...atomos.map(a => a.y)) + 0.85, t: `carga del ion: ${carga > 0 ? '+' : '−'}${Math.abs(carga)}`, color: 'h', peso: 700 }]);
    return { datos, nval, estado: {} };
  }
  const A = (id, t, x, y, o = {}) => Object.assign({ id, t, x, y }, o);
  const B = (a, b, orden = 1, o = {}) => Object.assign({ a, b, orden }, o);
  const P = (en, ...angs) => angs.map(ang => ({ en, ang }));
  const MOLS = {
    H2O: { t: 'H₂O', l: () => lewis([A('o', 'O', 0, 0), A('h1', 'H', -0.95, 0.7), A('h2', 'H', 0.95, 0.7)], [B('o', 'h1'), B('o', 'h2')], P('o', -135, -45)) },
    NH3: { t: 'NH₃', l: () => lewis([A('n', 'N', 0, 0), A('h1', 'H', -1, 0.6), A('h2', 'H', 1, 0.6), A('h3', 'H', 0, 1.15)], [B('n', 'h1'), B('n', 'h2'), B('n', 'h3')], P('n', -90)) },
    CH4: { t: 'CH₄', l: () => lewis([A('c', 'C', 0, 0), A('h1', 'H', 0, -1.1), A('h2', 'H', 0, 1.1), A('h3', 'H', -1.1, 0), A('h4', 'H', 1.1, 0)], [B('c', 'h1'), B('c', 'h2'), B('c', 'h3'), B('c', 'h4')], []) },
    CO2: { t: 'CO₂', l: () => lewis([A('o1', 'O', -1.25, 0), A('c', 'C', 0, 0), A('o2', 'O', 1.25, 0)], [B('o1', 'c', 2), B('c', 'o2', 2)], [...P('o1', 135, -135), ...P('o2', 45, -45)]) },
    N2: { t: 'N₂', l: () => lewis([A('n1', 'N', -0.65, 0), A('n2', 'N', 0.65, 0)], [B('n1', 'n2', 3)], [...P('n1', 180), ...P('n2', 0)]) },
    BF3: { t: 'BF₃', l: () => lewis([A('b', 'B', 0, 0), A('f1', 'F', 0, -1.2), A('f2', 'F', -1.04, 0.6), A('f3', 'F', 1.04, 0.6)], [B('b', 'f1'), B('b', 'f2'), B('b', 'f3')], [...P('f1', -90, 180, 0), ...P('f2', 150, 60, 240), ...P('f3', 30, 120, -60)]) },
  };
  const LEE = { H2O: 'O con 8 y cada H con 2.', NH3: 'N con 8: tres enlaces y un par.', CH4: 'C con 8: cuatro enlaces.', CO2: 'Dos dobles enlaces: todos con 8.', N2: 'Triple enlace: cada N con 8.', BF3: 'El boro se queda con 6: excepción.' };
  // Sin arrastre: el control elige entre moléculas distintas; los enlaces y pares son la respuesta, no una perilla.
  const lewisSolo = {
    id: 'lewis-octeto',
    titulo: 'Primero contar, después dibujar',
    temas: ['Regla del octeto', 'Enlace covalente y estructuras de Lewis'],
    pieza: 'quim-molecula',
    juega: {
      consigna: 'Elige una molécula. Cuenta los electrones de valencia y comprueba que enlaces y pares libres los usan todos.',
      voz: 'Cada línea son dos electrones; cada par de puntos, también.',
      controles: [{ id: 'k', etiqueta: 'Molécula', opciones: Object.keys(MOLS).map(k => ({ valor: k, texto: MOLS[k].t })) }],
      dibujo: val => MOLS[val.k].l(),
      lectura: val => [MOLS[val.k].t, ': ', Nv, ` = ${f(MOLS[val.k].l().nval, 0)} e⁻. ${LEE[val.k]}`],
      minimo: 3,
    },
    predice: {
      pregunta: ['El ion amonio, NH₄⁺, tiene carga ', z, ' = +1. ¿Cuántos electrones de valencia ', Nv, ' hay que repartir en su estructura?'],
      voz: 'Piensa qué hace la carga con la cuenta.',
      opciones: [
        { id: 'c', texto: '8', correcta: true },
        { id: 'sin-carga', texto: '9', error: 'EN4', siFuera: '5 + 4 = 9 es la suma de los átomos. Sería cierto si el ion fuera neutro.' },
        { id: 'suma-carga', texto: '10', error: 'QM-NVAL-SIGNO', siFuera: 'Sumar la carga sería cierto en un anión. Un catión perdió un electrón.' },
        { id: 'enlaces', texto: '4', error: 'EN4', siFuera: '4 son los enlaces N–H. Cada enlace usa dos electrones.' },
      ],
      dibujo: lewis([A('n', 'N', 0, 0), A('h1', 'H', 0, -1.1), A('h2', 'H', 0, 1.1), A('h3', 'H', -1.1, 0), A('h4', 'H', 1.1, 0)], [], [], 1, { paso: true }),
      revelar: lewis([A('n', 'N', 0, 0), A('h1', 'H', 0, -1.1), A('h2', 'H', 0, 1.1), A('h3', 'H', -1.1, 0), A('h4', 'H', 1.1, 0)], [B('n', 'h1'), B('n', 'h2'), B('n', 'h3'), B('n', 'h4')], [], 1),
      coincide: 'Coincide: 5 + 4 − 1 = 8, justo cuatro enlaces.',
      noCoincide: 'Se suma la valencia y se resta la carga: 5 + 4 − 1 = 8.',
    },
    mira: {
      datos: lewis([A('o1', 'O', -1.25, 0), A('c', 'C', 0, 0), A('o2', 'O', 1.25, 0)],
        [B('o1', 'c', 1, { desde: 2, hasta: 3 }), B('c', 'o2', 1, { desde: 2, hasta: 3 }), B('o1', 'c', 2, { desde: 4 }), B('c', 'o2', 2, { desde: 4 })],
        [...P('o1', 90, 180, -90).map(p => Object.assign(p, { desde: 3, hasta: 3 })), ...P('o2', 90, 0, -90).map(p => Object.assign(p, { desde: 3, hasta: 3 })),
         ...P('o1', 135, -135).map(p => Object.assign(p, { desde: 4 })), ...P('o2', 45, -45).map(p => Object.assign(p, { desde: 4 }))], 0, { paso: true }).datos,
      voz: 'Llevemos la cuenta de electrones en cada paso.',
      pasos: [
        { estado: { corte: 1 }, texto: 'CO₂: el carbono aporta 4 y cada oxígeno 6.', ecuacion: [Nv, ' = 4 + 6 + 6 = 16'] },
        { estado: { corte: 2 }, texto: 'Un enlace simple con cada O usa 4 electrones.', ecuacion: ['16 − 4 = 12 por repartir'] },
        { estado: { corte: 3 }, texto: 'Los 12 van como pares en los O; el C queda con 4.', ecuacion: ['O: 8', '   ·   ', 'C: 4'] },
        { estado: { corte: 4 }, texto: 'Cada O comparte un par más: dos dobles enlaces, todos con 8.', ecuacion: ['O=C=O: 4 · 2 + 4 · 2 = 16'] },
      ],
    },
    regla: {
      texto: 'Suma los electrones de valencia y resta la carga del ion. Repártelos en enlaces y pares libres buscando 8 alrededor de cada átomo (2 en el hidrógeno).',
      ecuacion: [{ llave: [Nv], nota: 'a repartir', color: 'c-i' }, ' = Σ valencias − ', { llave: [z], nota: 'carga', color: 'c-h' }],
      condicion: 'el octeto es una regularidad útil, no una ley: el boro del BF₃ queda con 6; el azufre del SF₆, con 12.',
      voz: 'Cuenta, reparte y revisa cada átomo.',
    },
    ahoraTu: {
      voz: 'Primero la suma; después la carga.',
      generar(s) {
        const CASOS = [['CO₃²⁻', [4, 6, 6, 6], -2], ['NO₃⁻', [5, 6, 6, 6], -1], ['SO₄²⁻', [6, 6, 6, 6, 6], -2], ['H₃O⁺', [6, 1, 1, 1], 1], ['CN⁻', [4, 5], -1],
          ['PO₄³⁻', [5, 6, 6, 6, 6], -3], ['OH⁻', [6, 1], -1], ['HCN', [1, 4, 5], 0], ['ClO⁻', [7, 6], -1], ['NH₄⁺', [5, 1, 1, 1, 1], 1]];
        const [fo, vs, q] = CASOS[s % CASOS.length], suma = vs.reduce((a, b) => a + b, 0), nv = suma - q;
        return {
          pregunta: ['¿Cuántos electrones de valencia ', Nv, ` hay que repartir en ${fo}?`],
          opciones: opciones(nv, [
            { id: 'sin-carga', valor: suma, error: 'EN4', siFuera: `${f(suma, 0)} es la suma de los átomos. Faltó la carga del ion.` },
            { id: 'signo', valor: suma + q, error: 'QM-NVAL-SIGNO', siFuera: 'Eso aplica la carga al revés. Un anión ganó electrones; un catión los perdió.' },
            { id: 'atomos', valor: vs.length, error: 'EN4', siFuera: 'Eso cuenta átomos. Se cuentan electrones de valencia.' },
          ], n => `${f(n, 0)}`),
          solucion: { texto: `Suma de valencias ${f(suma, 0)}, menos la carga (${q > 0 ? '+' : '−'}${f(Math.abs(q), 0)}).`, ecuacion: [Nv, ` = ${f(suma, 0)} − (${q > 0 ? '+' : '−'}${f(Math.abs(q), 0)}) = ${f(nv, 0)}`] },
        };
      },
    },
  };

  // ---------- Idea 3: resonancia, un dibujo no alcanza ----------
  // Cambia: dónde va el doble enlace · Permanece: los átomos en su lugar y 24 electrones · Progresa: tres dibujos
  // válidos y después su promedio · Se reserva: el híbrido, con los tres enlaces iguales · Debe verse: que los
  // átomos no se mueven entre dibujos; solo cambia el par.
  const PUNTAS = [[0, -1.25, -90], [-1.08, 0.62, 150], [1.08, 0.62, 30]];
  function triangular(central, dobleEn, carga, o = {}) {
    const at = [A('x', central, 0, 0), ...PUNTAS.map(([x, y], k) => A(`o${k}`, 'O', x, y))];
    if (dobleEn === null) {
      const en = PUNTAS.map((_, k) => B('x', `o${k}`));
      const textos = PUNTAS.map(([x, y, a]) => { const r = a * Math.PI / 180; return { x: x / 2 + 0.36 * Math.cos(r + Math.PI / 2), y: y / 2 + 0.36 * Math.sin(r + Math.PI / 2), t: '1⅓', color: 'd', peso: 700 }; });
      return lewis(at, en, [], carga, { paso: true, datos: { textos } });
    }
    const en = PUNTAS.map((_, k) => B('x', `o${k}`, k === dobleEn ? 2 : 1));
    const pares = PUNTAS.flatMap(([, , a], k) => (k === dobleEn ? P(`o${k}`, a - 55, a + 55) : P(`o${k}`, a, a - 90, a + 90)));
    const cargas = PUNTAS.flatMap(([, , a], k) => (k === dobleEn ? [] : [{ en: `o${k}`, t: '−', ang: a + 50, color: 'h' }]));
    if (central === 'N') cargas.push({ en: 'x', t: '+', ang: -150, color: 'h' });
    const l = lewis(at, en, pares, carga, o);
    l.datos.cargas = cargas;
    return l;
  }
  // Gesto directo: se agarra el doble enlace (la manija va a la mitad del enlace X=O) y se lo lleva a otro oxígeno.
  // Con quim-molecula.encuadre de los datos del dibujo actual; al soltar, gana el enlace más cercano. Con la opción
  // «híbrido» (solo en el laboratorio) la manija va al centro, sobre el átomo central.
  const QM = () => Kit.piezas['quim-molecula'];
  const mitad = (dib, k) => { const g = QM().encuadre(dib.datos); return k === 3 ? { x: g.X(0), y: g.Y(0) } : { x: g.X(PUNTAS[k][0] / 2), y: g.Y(PUNTAS[k][1] / 2) }; };
  const dobleCerca = (dib, pt, conHibrido) => [0, 1, 2, ...(conHibrido ? [3] : [])].reduce((a, b) => {
    const pa = mitad(dib, a), pb = mitad(dib, b);
    return (pb.x - pt.x) ** 2 + (pb.y - pt.y) ** 2 < (pa.x - pt.x) ** 2 + (pa.y - pt.y) ** 2 ? b : a;
  });
  const res = {
    id: 'resonancia',
    titulo: 'Un dibujo no alcanza',
    temas: ['Resonancia'],
    pieza: 'quim-molecula',
    juega: {
      consigna: 'Ion nitrato, NO₃⁻. Elige a qué oxígeno va el doble enlace. Cuenta los electrones en cada dibujo.',
      voz: 'Mira qué se mueve entre un dibujo y otro.',
      controles: [{ id: 'k', etiqueta: 'Doble enlace', opciones: [{ valor: 0, texto: 'Arriba' }, { valor: 1, texto: 'Izquierda' }, { valor: 2, texto: 'Derecha' }] }],
      dibujo: val => triangular('N', val.k, -1),
      lectura: val => [`Doble enlace ${['arriba', 'a la izquierda', 'a la derecha'][val.k]}: `, Nv, ' = 24 e⁻ igual'],
      minimo: 3,
      // Se agarra el doble enlace y se lo lleva a otro O: los átomos no se mueven y la cuenta de 24 no cambia.
      arrastres: [{ id: 'doble', etiqueta: 'doble enlace: llévalo a otro oxígeno', color: 'c-i',
        donde: val => mitad(triangular('N', val.k, -1), val.k),
        mover: (pt, val) => ({ k: dobleCerca(triangular('N', val.k, -1), pt, false) }) }],
    },
    predice: {
      pregunta: 'Los tres dibujos del nitrato son válidos. En el ion real se miden los tres enlaces N–O. ¿Cómo son?',
      voz: 'Piensa qué describe la molécula real, no el dibujo.',
      opciones: [
        { id: 'c', texto: 'Los tres iguales, de largo intermedio', correcta: true },
        { id: 'uno', texto: 'Uno corto (doble) y dos largos (simples)', error: 'QM-RES-UNO', siFuera: 'Sería así si un solo dibujo fuera el real. Los tres valen a la vez.' },
        { id: 'salta', texto: 'Cambian: el doble salta de un O a otro', error: 'EN6', siFuera: 'Los dibujos se alternan en el papel, no en la molécula. El ion no oscila.' },
      ],
      dibujo: triangular('N', 0, -1),
      revelar: triangular('N', null, -1),
      coincide: 'Coincide: el par se reparte y cada enlace vale 1⅓.',
      noCoincide: 'El ion real es un promedio: los tres enlaces son iguales, de orden 1⅓.',
    },
    mira: {
      datos: (() => {
        const ls = [0, 1, 2].map(k => triangular('C', k, -2));
        const h = triangular('C', null, -2).datos;
        const d = ls[0].datos;
        d.enlaces = [...ls.flatMap((l, k) => l.datos.enlaces.map(e => Object.assign({}, e, { desde: k + 1, hasta: k + 1 }))), ...h.enlaces.map(e => Object.assign({}, e, { desde: 4 }))];
        d.pares = ls.flatMap((l, k) => l.datos.pares.map(p => Object.assign({}, p, { desde: k + 1, hasta: k + 1 })));
        d.cargas = ls.flatMap((l, k) => l.datos.cargas.map(c => Object.assign({}, c, { desde: k + 1, hasta: k + 1 })));
        d.textos = [...d.textos, ...h.textos.filter(t => t.t === '1⅓').map(t => Object.assign({}, t, { desde: 4 }))];
        return d;
      })(),
      voz: 'Sigamos el par que cambia de lugar.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Carbonato, CO₃²⁻: un dibujo con el doble enlace arriba.', ecuacion: [Nv, ' = 4 + 3 · 6 + 2 = 24'] },
        { estado: { corte: 2 }, texto: 'Otro dibujo igual de válido: el doble, a la izquierda.' },
        { estado: { corte: 3 }, texto: 'Y un tercero. Los átomos nunca se movieron; solo el par.' },
        { estado: { corte: 4 }, texto: 'El ion real es el promedio: tres enlaces iguales.', ecuacion: ['orden = ', { frac: ['4 enlaces', '3 lados'] }, ' = 1⅓'] },
      ],
    },
    regla: {
      texto: 'Si varias estructuras de Lewis válidas solo difieren en dónde va un par, la especie real es un híbrido: los electrones se reparten y esos enlaces son iguales.',
      ecuacion: ['orden promedio = ', { frac: ['enlaces totales', 'posiciones equivalentes'] }],
      condicion: 'las estructuras de resonancia mueven electrones, nunca átomos; la molécula no alterna entre dibujos.',
      voz: 'Varios dibujos, una sola especie.',
    },
    ahoraTu: {
      voz: 'Cuenta los enlaces y repártelos.',
      generar(s) {
        const CASOS = [['NO₃⁻', 'N–O', 4, 3], ['CO₃²⁻', 'C–O', 4, 3], ['O₃', 'O–O', 3, 2], ['NO₂⁻', 'N–O', 3, 2], ['SO₃', 'S–O', 4, 3], ['HCOO⁻', 'C–O', 3, 2]];
        const [fo, enl, tot, pos] = CASOS[s % CASOS.length];
        const fr = (a, b) => (a === 4 && b === 3 ? '1⅓' : a === 3 && b === 2 ? '1½' : `${a}/${b}`);
        return {
          pregunta: `${fo} tiene ${f(pos, 0)} estructuras de resonancia equivalentes. ¿Qué orden tiene cada enlace ${enl} en la especie real?`,
          opciones: elegir(fr(tot, pos), [
            { id: 'doble', texto: '2', error: 'QM-RES-UNO', siFuera: 'Sería 2 si el doble enlace estuviera fijo en uno. En el híbrido se reparte.' },
            { id: 'simple', texto: '1', error: 'QM-RES-UNO', siFuera: 'Sería 1 si no hubiera ningún doble enlace. Hay uno repartido entre todos.' },
            { id: 'otro', texto: tot === 4 ? '1½' : '1⅓', error: 'QM-RES-CUENTA', siFuera: 'Esa fracción corresponde a otro número de posiciones. Cuenta las de esta especie.' },
          ]),
          solucion: { texto: `${f(tot, 0)} enlaces repartidos en ${f(pos, 0)} posiciones iguales.`, ecuacion: ['orden = ', { frac: [String(tot), String(pos)] }, ` = ${fr(tot, pos)}`] },
        };
      },
    },
  };

  // ---------- Idea 4: la forma decide la polaridad ----------
  // Cambia: la molécula · Permanece: las flechas de dipolo hacia el átomo más electronegativo · Progresa: de
  // contar regiones de electrones a la forma y de la forma a la suma de dipolos · Se reserva: el CO₂, con enlaces
  // muy polares y suma cero · Debe verse: si las flechas se anulan o dejan una flecha total.
  const rad = g => g * Math.PI / 180;
  const brazo = (ang, L = 1.15) => [L * Math.cos(rad(ang)), L * Math.sin(rad(ang))];
  // ángulos en pantalla (y hacia abajo): 90 es abajo. Los pares rotulados se dibujan con su ángulo real.
  function forma(k) {
    const g = GEOM[k];
    const at = [A('x', g.c, 0, 0)], en = [], pares = [];
    g.brazos.forEach((b, i) => {
      const [x, y] = brazo(b.ang, b.L || 1.15);
      at.push(A(`y${i}`, g.y, x, y));
      en.push(B('x', `y${i}`, g.orden || 1, g.dip ? { dipolo: 'b' } : {}));
    });
    (g.libres || []).forEach(a => pares.push({ en: 'x', ang: a }));
    const datos = { atomos: at, enlaces: en, pares, escala: 66, alto: 230, angulos: g.rot ? [{ en: 'x', de: `y${g.rot[0]}`, a: `y${g.rot[1]}`, texto: `${f(g.ang, 1)}°`, color: 'd' }] : [] };
    if (g.mu) datos.flechas = [{ de: [0, -g.dirMu * 2.1], a: [0, -g.dirMu * 1.45], dipolo: true, color: 'o' }];
    else datos.textos = [{ x: 0, y: 1.9, t: 'dipolos que se anulan', color: 'o' }];
    return { datos, estado: {} };
  }
  const GEOM = {
    CO2: { t: 'CO₂', c: 'C', y: 'O', orden: 2, dip: true, brazos: [{ ang: 180 }, { ang: 0 }], forma: 'lineal', hib: 'sp', ang: 180, regiones: 2, mu: 0 },
    H2O: { t: 'H₂O', c: 'O', y: 'H', dip: false, brazos: [{ ang: 90 + 52.25 }, { ang: 90 - 52.25 }], libres: [-125, -55], rot: [0, 1], forma: 'angular', hib: 'sp³', ang: 104.5, regiones: 4, mu: 1.85, dirMu: -1 },
    BF3: { t: 'BF₃', c: 'B', y: 'F', dip: true, brazos: [{ ang: -90 }, { ang: 150 }, { ang: 30 }], rot: [1, 2], forma: 'trigonal plana', hib: 'sp²', ang: 120, regiones: 3, mu: 0 },
    NH3: { t: 'NH₃', c: 'N', y: 'H', dip: false, brazos: [{ ang: 90 + 53.5 }, { ang: 90 - 53.5 }, { ang: 90, L: 0.75 }], libres: [-90], forma: 'piramidal', hib: 'sp³', ang: 107, regiones: 4, mu: 1.47, dirMu: -1 },
    CH4: { t: 'CH₄', c: 'C', y: 'H', dip: false, brazos: [{ ang: 90 + 54.75 }, { ang: 90 - 54.75 }, { ang: -90 }, { ang: 90, L: 0.75 }], forma: 'tetraédrica', hib: 'sp³', ang: 109.5, regiones: 4, mu: 0 },
  };
  // En H₂O y NH₃ los dipolos de enlace apuntan al átomo central (O, N): la pieza los pinta hacia «a».
  for (const k of ['H2O', 'NH3']) GEOM[k].dipA = true;
  function formaDib(k) {
    const d = forma(k);
    if (GEOM[k].dipA) d.datos.enlaces = d.datos.enlaces.map(e => Object.assign(e, { dipolo: 'a' }));
    return d;
  }
  // Sin arrastre en el juego: el control elige entre moléculas distintas. El ángulo que se agarra está en el
  // laboratorio («Dos dipolos que giran»), donde se ve cómo la suma de dipolos depende de la forma.
  const geo = {
    id: 'forma-polaridad',
    titulo: 'La forma decide la polaridad',
    temas: ['Hibridación y geometría molecular', 'Polaridad'],
    pieza: 'quim-molecula',
    juega: {
      consigna: 'Elige una molécula. Mira su forma, los dipolos de cada enlace (flechas naranjas) y si queda una flecha total.',
      voz: 'Cuenta las regiones de electrones alrededor del átomo central.',
      controles: [{ id: 'k', etiqueta: 'Molécula', opciones: Object.keys(GEOM).map(k => ({ valor: k, texto: GEOM[k].t })) }],
      dibujo: val => formaDib(val.k),
      lectura: val => { const g = GEOM[val.k]; return [`${g.t}: ${g.forma}, ${g.hib}, ${f(g.ang, 1)}° · `, mu, g.mu ? ` = ${f(g.mu)} D` : ' = 0']; },
      minimo: 3,
    },
    predice: {
      pregunta: 'El CO₂ tiene dos enlaces C=O muy polares y su forma es lineal. ¿La molécula de CO₂ es polar?',
      voz: 'Piensa en las dos flechas a la vez.',
      opciones: [
        { id: 'c', texto: 'No: los dos dipolos se anulan', correcta: true },
        { id: 'enlaces', texto: 'Sí: tiene enlaces polares', error: 'EN11', siFuera: 'Los enlaces sí son polares. Sería polar si sus dipolos no se anularan, como en una forma angular.' },
        { id: 'oxigeno', texto: 'Sí: el oxígeno es muy electronegativo', error: 'EN11', siFuera: 'El O atrae los electrones, cierto. Pero hay dos O en lados opuestos.' },
        { id: 'apolar', texto: 'No: el enlace C=O no es polar', error: 'QM-POL-ENLACE', siFuera: 'La molécula no es polar, bien. Pero cada enlace C=O sí lo es.' },
      ],
      dibujo: (() => { const d = formaDib('CO2'); d.datos.enlaces = d.datos.enlaces.map(e => Object.assign({}, e, { dipolo: undefined })); d.datos.textos = []; return d; })(),
      revelar: formaDib('CO2'),
      coincide: 'Coincide: dos flechas iguales y opuestas suman cero.',
      noCoincide: 'Las dos flechas son iguales y opuestas: la suma es cero.',
    },
    mira: {
      datos: (() => {
        const co2 = formaDib('CO2').datos, h2o = formaDib('H2O').datos;
        const mueve = (d, dx, desde, pre) => ({
          atomos: d.atomos.map(a => Object.assign({}, a, { id: pre + a.id, x: a.x + dx, desde })),
          enlaces: d.enlaces.map(e => Object.assign({}, e, { a: pre + e.a, b: pre + e.b, desde })),
          pares: d.pares.map(p => Object.assign({}, p, { en: pre + p.en, desde: desde + 1 })),
          angulos: (d.angulos || []).map(a => Object.assign({}, a, { en: pre + a.en, de: pre + a.de, a: pre + a.a, desde: desde + 1 })),
        });
        const a = mueve(co2, -1.6, 1, 'a'), b = mueve(h2o, 1.9, 3, 'b');
        a.angulos = [];
        return {
          atomos: [...a.atomos, ...b.atomos], enlaces: [...a.enlaces, ...b.enlaces], pares: [...a.pares, ...b.pares], angulos: b.angulos,
          flechas: [{ de: [1.9, 2.3], a: [1.9, 1.55], dipolo: true, color: 'o', desde: 4 }],
          textos: [{ x: -1.6, y: 1, t: 'suma: 0', color: 'o', desde: 2 }, { x: 1.9, y: 2.65, t: `μ = ${f(1.85)} D`, color: 'o', desde: 4 }],
          escala: 44, alto: 230,
        };
      })(),
      voz: 'Comparemos dos moléculas con enlaces polares.',
      pasos: [
        { estado: { corte: 1 }, texto: 'CO₂: el C tiene 2 regiones de electrones; quedan opuestas: lineal, sp.', ecuacion: ['2 regiones → 180°'] },
        { estado: { corte: 2 }, texto: 'Sus dos dipolos son iguales y opuestos: se anulan.', ecuacion: [mu, ' = 0'] },
        { estado: { corte: 3 }, texto: 'H₂O: el O tiene 4 regiones, dos de ellas pares libres.', ecuacion: ['4 regiones → sp³'] },
        { estado: { corte: 4 }, texto: 'Los pares empujan: forma angular de 104,5°. Los dipolos no se anulan.', ecuacion: [mu, ` = ${f(1.85)} D`] },
      ],
    },
    regla: {
      texto: 'La forma sale de las regiones de electrones del átomo central, pares libres incluidos. Una molécula es polar si los dipolos de sus enlaces no se anulan.',
      ecuacion: ['2 regiones: lineal, sp', '   ·   ', '3: trigonal, sp²', '   ·   ', '4: tetraédrica, sp³'],
      condicion: 'los pares libres cuentan para la forma electrónica, pero la forma molecular se nombra solo por los átomos: el agua es angular.',
      voz: 'Primero la forma, después la suma de flechas.',
    },
    ahoraTu: {
      voz: 'Regiones, forma y después dipolos.',
      generar(s) {
        const T = [['CO₂', 'lineal', 0], ['BeCl₂', 'lineal', 0], ['BF₃', 'trigonal plana', 0], ['SO₃', 'trigonal plana', 0], ['SO₂', 'angular', 1], ['CH₄', 'tetraédrica', 0],
          ['CCl₄', 'tetraédrica', 0], ['CHCl₃', 'tetraédrica', 1], ['NH₃', 'piramidal', 1], ['PCl₃', 'piramidal', 1], ['H₂O', 'angular', 1], ['H₂S', 'angular', 1]];
        const [fo, fm, pol] = T[s % T.length];
        if (s % 2 === 0) {
          const FORMAS = ['lineal', 'angular', 'trigonal plana', 'piramidal', 'tetraédrica'];
          return {
            pregunta: `¿Qué forma molecular tiene ${fo}? Cuenta las regiones de electrones del átomo central.`,
            opciones: [{ id: 'c', texto: fm, correcta: true }, ...FORMAS.filter(x => x !== fm).slice(0, 3).map((x, i) => ({ id: `f${i}`, texto: x, error: 'EN8', siFuera: `Sería ${x} con otro número de regiones o de pares libres en el átomo central.` }))],
            solucion: { texto: `Las regiones del átomo central, con sus pares libres, dan forma ${fm}.`, ecuacion: [`${fo}: ${fm}`] },
          };
        }
        const P1 = 'Polar: sus dipolos no se anulan', A1 = 'Apolar: sus dipolos se anulan por simetría';
        return {
          pregunta: `${fo} tiene forma ${fm} y enlaces polares. ¿Es polar la molécula?`,
          opciones: pol
            ? [{ id: 'c', texto: P1, correcta: true }, { id: 'ap', texto: A1, error: 'EN10', siFuera: 'Se anularían si la forma fuera simétrica y los enlaces iguales. Aquí no.' }, { id: 'sin', texto: 'Apolar: sus enlaces no son polares', error: 'QM-POL-ENLACE', siFuera: 'Sus enlaces sí son polares; eso dice el enunciado.' }]
            : [{ id: 'c', texto: A1, correcta: true }, { id: 'pol', texto: 'Polar: tiene enlaces polares', error: 'EN11', siFuera: 'Sería polar si la forma no repartiera los dipolos de modo simétrico.' }, { id: 'sin', texto: 'Apolar: sus enlaces no son polares', error: 'QM-POL-ENLACE', siFuera: 'Es apolar, bien. Pero no por los enlaces: estos sí son polares.' }],
          solucion: { texto: pol ? 'La forma no reparte los dipolos de modo simétrico: queda una flecha total.' : 'La forma es simétrica y los dipolos iguales: suman cero.', ecuacion: [mu, pol ? ' ≠ 0' : ' = 0'] },
        };
      },
    },
  };

  // ---------- Idea 5: fuerzas entre moléculas y punto de ebullición ----------
  // Cambia: la sustancia · Permanece: los ejes de ebullición contra el periodo · Progresa: H₂Te, H₂Se, H₂S bajan
  // con el tamaño · Se reserva: el agua, muy por encima de la tendencia · Debe verse: el salto del agua.
  const HIDRUROS = [[2, 100, 'H₂O'], [3, -60, 'H₂S'], [4, -41, 'H₂Se'], [5, -2, 'H₂Te']];
  const ejesEb = (extra = {}) => Object.assign({
    x: { min: 1.5, max: 5.5, paso: 1, nombre: 'periodo', decimales: 0 },
    y: { min: -100, max: 120, paso: 20, nombre: 'Tₑ', unidad: '°C', decimales: 0, color: 'h' },
    alt: 'Punto de ebullición de los hidruros del grupo 16: H₂Te −2 °C, H₂Se −41 °C, H₂S −60 °C y H₂O 100 °C, muy por encima de la tendencia.',
  }, extra);
  const PARES = {
    agua: { t: 'H₂O', eb: 100, f: 'puente de hidrógeno', d: () => dos('O', 'H', true) },
    hcl: { t: 'HCl', eb: -85, f: 'dipolo-dipolo', d: () => dos('Cl', 'H', false, 'dipolo') },
    metano: { t: 'CH₄', eb: -162, f: 'solo dispersión', d: () => dos('CH₄', null, false, 'nada') },
  };
  // Dos moléculas vecinas y la atracción entre ellas (línea punteada): no es un enlace.
  function dos(x, h, puente, tipo) {
    const at = [], en = [], textos = [];
    if (!h) { at.push(A('a', x, -1.3, 0), A('b', x, 1.3, 0)); textos.push({ x: 0, y: 0.9, t: 'dispersión', color: 'o' }); }
    else {
      at.push(A('x1', x, -2, 0), A('h1', h, -1, 0), A('x2', x, 0.6, 0), A('h2', h, 1.6, 0));
      en.push(B('x1', 'h1'), B('x2', 'h2'), B('h1', 'x2', 1, { discontinuo: true, color: puente ? 'o' : undefined }));
      textos.push({ x: -0.2, y: 0.9, t: puente ? 'puente de H' : 'dipolo-dipolo', color: 'o' });
      if (!puente) en[2].discontinuo = true;
    }
    void tipo;
    return { datos: { atomos: at, enlaces: en, textos, escala: 48, alto: 130 }, estado: {} };
  }
  // Sin arrastre: el control elige entre tres sustancias; la atracción entre vecinas no tiene una perilla natural.
  // Hallazgo 9 de la auditoría: son dos representaciones a propósito. El juego muestra la atracción entre dos
  // moléculas vecinas; «Mira» pasa a los ejes de ebullición, donde el agua se sale de la tendencia de su grupo.
  const fuerzas = {
    id: 'fuerzas-intermoleculares',
    titulo: 'Lo que une a las moléculas',
    temas: ['Fuerzas intermoleculares'],
    pieza: 'quim-molecula',
    juega: {
      consigna: 'Elige una sustancia y mira las fuerzas intermoleculares entre dos moléculas vecinas (línea punteada). Compara su temperatura de ebullición.',
      voz: 'La línea punteada no es un enlace: es una atracción entre moléculas.',
      controles: [{ id: 'k', etiqueta: 'Sustancia', opciones: Object.keys(PARES).map(k => ({ valor: k, texto: PARES[k].t })) }],
      dibujo: val => PARES[val.k].d(),
      lectura: val => [`${PARES[val.k].t}: ${PARES[val.k].f} · hierve a ${f(PARES[val.k].eb, 0)} °C`],
      minimo: 3,
    },
    predice: {
      pieza: 'ejes',
      pregunta: 'El H₂S es más pesado que el H₂O y está debajo en la tabla. ¿Cuál hierve a mayor temperatura?',
      voz: 'Piensa en lo que une a las moléculas, no en su masa.',
      opciones: [
        { id: 'c', texto: 'El H₂O, por sus puentes de hidrógeno', correcta: true },
        { id: 'masa', texto: 'El H₂S, porque es más pesado', error: 'EN16', siFuera: 'Más masa suele dar más fuerzas de London, cierto. Aquí el puente de hidrógeno del agua pesa más.' },
        { id: 'igual', texto: 'Igual: los dos son del grupo 16', error: 'QM-GRUPO-EB', siFuera: 'Comparten grupo, sí. Pero solo el agua forma puentes de hidrógeno.' },
        { id: 'enlace', texto: 'El H₂O, porque su enlace O–H es más fuerte', error: 'EN14', siFuera: 'El O–H es fuerte, bien visto. Pero al hervir no se rompe: se separan moléculas.' },
      ],
      dibujo: { datos: ejesEb({ puntos: HIDRUROS.slice(1).map(([x, y, t]) => ({ x, y, color: 'h', rotulo: x === 4 ? undefined : t })), curvas: [{ puntos: HIDRUROS.slice(1).map(([x, y]) => [x, y]), color: 'h' }] }), estado: {} },
      revelar: { datos: ejesEb({ puntos: HIDRUROS.map(([x, y, t]) => ({ x, y, color: 'h', rotulo: x === 4 ? undefined : `${t} ${f(y, 0)} °C` })), curvas: [{ puntos: HIDRUROS.slice(1).map(([x, y]) => [x, y]), color: 'h' }] }), estado: {} },
      coincide: 'Coincide: el agua hierve 160 °C por encima del H₂S.',
      noCoincide: 'El agua hierve a 100 °C y el H₂S a −60 °C: los puentes de H pesan más.',
    },
    mira: {
      pieza: 'ejes',
      datos: ejesEb({
        curvas: [{ puntos: HIDRUROS.slice(1).map(([x, y]) => [x, y]), color: 'h', desde: 1 }, { puntos: [[3, -60], [2, -80]], color: 'h', discontinua: true, desde: 2 }],
        puntos: [...HIDRUROS.slice(1).map(([x, y, t]) => ({ x, y, color: 'h', rotulo: x === 4 ? undefined : t, desde: 1 })), { x: 2, y: 100, color: 'o', rotulo: 'H₂O 100 °C', guias: true, desde: 3 }],
      }),
      voz: 'Sigamos la tendencia y veamos quién se sale.',
      pasos: [
        { estado: { corte: 1 }, texto: 'De H₂S a H₂Te las moléculas crecen: más dispersión, hierven más alto.' },
        { estado: { corte: 2 }, texto: 'Siguiendo esa tendencia, el agua herviría por debajo de −60 °C.' },
        { estado: { corte: 3 }, texto: 'Pero hierve a 100 °C: sus moléculas forman puentes de hidrógeno.', ecuacion: ['O–H ··· O'] },
        { estado: { corte: 3 }, texto: 'Al hervir se separan moléculas; los enlaces O–H siguen enteros.' },
      ],
    },
    regla: {
      texto: 'Entre moléculas hay dispersión (siempre), dipolo-dipolo (si son polares) y puente de hidrógeno (H unido a N, O o F). Más atracción, mayor punto de ebullición.',
      ecuacion: ['ion-dipolo > puente de H > dipolo-dipolo > dispersión'],
      condicion: 'vale para moléculas de tamaño parecido; el puente de hidrógeno es una atracción, mucho más débil que el enlace O–H.',
      voz: 'Compara la atracción entre moléculas, no los enlaces de adentro.',
    },
    ahoraTu: {
      pieza: 'quim-molecula',
      voz: 'Busca qué atracción tiene cada una.',
      generar(s) {
        const C = [
          ['H₂O', 100, 'H₂S', -60, 'forma puentes de hidrógeno'], ['NH₃', -33, 'PH₃', -88, 'forma puentes de hidrógeno'],
          ['HF', 20, 'HCl', -85, 'forma puentes de hidrógeno'], ['CH₃OH', 65, 'CH₄', -162, 'forma puentes de hidrógeno'],
          ['etanol (C₂H₅OH)', 78, 'éter dimetílico (CH₃OCH₃)', -24, 'forma puentes de hidrógeno; el éter no'],
          ['Br₂', 59, 'Cl₂', -34, 'es más grande: más dispersión'], ['n-pentano', 36, 'neopentano', 10, 'es alargado: más contacto y dispersión'],
        ];
        const [a, ea, b, eb, razon] = C[s % C.length];
        const [x, y] = s % 2 ? [b, a] : [a, b];
        return {
          pregunta: `¿Cuál hierve a mayor temperatura: ${x} o ${y}?`,
          opciones: [
            { id: 'c', texto: `${a}, porque ${razon}`, correcta: true },
            { id: 'otro', texto: `${b}, porque sus moléculas son iguales de fuertes`, error: 'EN16', siFuera: `Sería cierto si ${b} tuviera una atracción mayor entre sus moléculas. No la tiene.` },
            { id: 'enlace', texto: `${a}, porque sus enlaces internos son más fuertes`, error: 'EN14', siFuera: 'Al hervir no se rompen enlaces internos: se separan moléculas.' },
          ],
          solucion: { texto: `${a} hierve a ${f(ea, 0)} °C y ${b} a ${f(eb, 0)} °C.`, ecuacion: [`${a}: ${f(ea, 0)} °C > ${b}: ${f(eb, 0)} °C`] },
        };
      },
    },
  };

  // ---------- Laboratorio ----------
  // Mesa 1: dos enlaces iguales unidos a un átomo central (como el O del agua). El dipolo total es la suma de las dos
  // flechas: μ = 2 · μ_enlace · cos(θ/2). Los textos fijos arriba y abajo dejan el encuadre quieto al cambiar θ.
  const ESC_MU = 0.45;                             // unidades de dibujo por debye de la flecha total
  // ---------- La molécula que gira (laboratorio 3D) ----------
  // Todo lo calcula el motor de plantillas/enlace (regla 1): posiciones VSEPR, órdenes de enlace de Lewis, pares libres
  // del central y dipolos por ΔEN. La pieza quim-molecula-3d solo dibuja. Un enlace lleva flecha si el motor no lo
  // llama «covalente apolar»; la flecha apunta al átomo que atrae más.
  const GIRA = ['CH4', 'NH3', 'H2O', 'CO2', 'SO2', 'BF3', 'CCl4', 'CHCl3', 'PCl5', 'SF6', 'XeF4'];
  const enlacesPolares = k => { const x = M.molecula(k); return x.ligandos.some(l => M.tipoEnlace(x.central, l).tipo !== 'covalente apolar'); };
  function mol3d(k) {
    const x = M.molecula(k);
    const atomos = [{ id: 'c', t: x.central, pos: [0, 0, 0] }, ...x.ligandos.map((t, i) => ({ id: `l${i}`, t, pos: x.posiciones.ligandos[i] }))];
    const enlaces = x.ligandos.map((t, i) => {
      const te = M.tipoEnlace(x.central, t);
      return { a: 'c', b: `l${i}`, orden: (x.lewis.ligandos[i] || {}).orden || 1, dipolo: te.tipo === 'covalente apolar' ? undefined : te.mas === t ? 'b' : 'a' };
    });
    const pares = x.posiciones.pares.map(dir => ({ en: 'c', dir }));
    return { atomos, enlaces, pares, total: x.polaridad.polar ? x.polaridad.total : null,
      alt: `${x.formula} en 3D: forma ${x.vsepr.geometria}, ${x.ligandos.length} enlaces y ${pares.length} pares libres en el átomo central; ${x.polaridad.polar ? 'polar' : 'apolar'}.` };
  }

  const TH_MIN = 60, MB_MAX = 2;                  // rango de la mesa: el ángulo más cerrado y el enlace más polar
  const muTotal = val => 2 * val.mb * Math.cos(val.th / 2 * Math.PI / 180);
  const dosDipolos = val => {
    const h = val.th / 2 * Math.PI / 180, L = 1.15, mt = muTotal(val);
    const datos = {
      atomos: [A('o', 'O', 0, 0), A('h1', 'H', -L * Math.sin(h), L * Math.cos(h)), A('h2', 'H', L * Math.sin(h), L * Math.cos(h))],
      enlaces: [B('o', 'h1', 1, { dipolo: 'a' }), B('o', 'h2', 1, { dipolo: 'a' })],
      angulos: [{ en: 'o', de: 'h1', a: 'h2', texto: `${f(val.th, 0)}°`, color: 'd' }],
      textos: [{ x: 0, y: -2.25, t: mt > 0.005 ? `μ total = ${f(mt)} D` : 'μ total = 0: se anulan', color: 'o', peso: 700 }, { x: 0, y: 1.65, t: `cada enlace: ${f(val.mb, 1)} D`, color: 'o' }],
      escala: 60, alto: 260,
      alt: `Dos enlaces de ${f(val.mb, 1)} D separados ${f(val.th, 0)}°; su suma da un dipolo total de ${f(mt)} D, hacia arriba.`,
    };
    if (mt > 0.005) datos.flechas = [{ de: [0, -0.5], a: [0, -0.5 - ESC_MU * mt], dipolo: true, color: 'o' }];
    return { datos, estado: {} };
  };
  // Manija en el H de la derecha: el ángulo entre los enlaces es el doble de su ángulo con la vertical.
  const manijaH = val => { const g = QM().encuadre(dosDipolos(val).datos), h = val.th / 2 * Math.PI / 180; return { x: g.X(1.15 * Math.sin(h)), y: g.Y(1.15 * Math.cos(h)) }; };
  const anguloEn = (pt, val) => { const g = QM().encuadre(dosDipolos(val).datos); return 2 * Math.atan2(pt.x - g.X(0), pt.y - g.Y(0)) * 180 / Math.PI; };
  // Mesa 2: resonancia con dos iones y el híbrido como cuarta posición (la idea 3 solo deja los tres dibujos).
  const IONES = { NO3: { t: 'NO₃⁻', c: 'N', q: -1 }, CO3: { t: 'CO₃²⁻', c: 'C', q: -2 } };
  const resDib = val => triangular(IONES[val.ion].c, val.k === 3 ? null : val.k, IONES[val.ion].q);

  return {
    unidad: 'quimica.enlace-quimico',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/quim-particulas.js', '/nucleo/kit/piezas/quim-molecula.js', '/nucleo/kit/piezas/ejes.js',
      '/plantillas/enlace/motor.js', '/nucleo/elementos.js', '/nucleo/kit/piezas/quim-molecula-3d.js'],
    historia: {
      texto: 'Conocer la masa de los átomos no explicaba por qué se combinan en proporciones fijas. En 1916, Gilbert N. Lewis propuso representar el enlace con electrones compartidos. Era una contabilidad útil, no una descripción completa: la forma, la deslocalización y las propiedades necesitaron después otros modelos. Un par de puntos no son dos bolitas inmóviles.',
      pregunta: '¿Por qué el agua es H₂O y no H₃O?',
      fuente: { titulo: 'OpenStax, Chemistry 2e, §7.6', url: 'https://openstax.org/books/chemistry-2e/pages/7-6-molecular-structure-and-polarity' },
    },
    // Glosario (docs/teoria.md §4d): las palabras que la unidad estrena en el curso de química.
    glosario: [
      { termino: 'enlace químico', formas: ['enlace químico', 'enlaces químicos', 'enlace', 'enlaces'],
        def: 'Unión que mantiene juntos a dos átomos o iones, según cómo se reparten sus electrones.',
        ver: ['enlace iónico', 'enlace covalente', 'enlace metálico'] },
      { termino: 'enlace iónico', formas: ['enlace iónico', 'enlaces iónicos', 'iónico'],
        def: 'Atracción entre cationes y aniones: un metal cede electrones a un no metal y forman una red.',
        ejemplo: 'NaCl: cada Na⁺ rodeado de seis Cl⁻.', ver: ['catión', 'anión'] },
      { termino: 'enlace covalente', formas: ['enlace covalente', 'enlaces covalentes', 'covalente', 'covalentes'],
        def: 'Unión de dos átomos, casi siempre no metales, que comparten uno o más pares de electrones.',
        ejemplo: 'H–O–H: dos pares compartidos en el agua.', ver: ['estructura de Lewis'] },
      { termino: 'enlace metálico', formas: ['enlace metálico', 'metálico'],
        def: 'Cationes de un metal ordenados en un mar de electrones que se mueven entre todos.',
        ver: ['metal'] },
      { termino: 'regla del octeto', formas: ['regla del octeto', 'octeto'],
        def: 'Tendencia de los átomos a quedar con ocho electrones en su último nivel al unirse. Tiene excepciones.',
        ejemplo: 'En el BF₃ el boro queda con 6.', ver: ['estructura de Lewis'] },
      { termino: 'estructura de Lewis', formas: ['estructura de Lewis', 'estructuras de Lewis'],
        def: 'Dibujo de una molécula o ion con sus enlaces como rayas y sus pares sin compartir como puntos.',
        ejemplo: 'CO₂: O=C=O con dos pares libres en cada O, 16 electrones.', ver: ['par libre', 'símbolo de Lewis'] },
      { termino: 'par libre', formas: ['par libre', 'pares libres'],
        def: 'Par de electrones de valencia que no forma parte de ningún enlace. También empuja y cambia la forma.',
        ejemplo: 'El O del agua tiene dos.', ver: ['forma molecular'] },
      { termino: 'resonancia', def: 'Caso en que varias estructuras de Lewis válidas solo difieren en dónde va un par de electrones.',
        ver: ['híbrido'] },
      { termino: 'híbrido', formas: ['híbrido de resonancia', 'híbrido'],
        def: 'La especie real cuando hay resonancia: los electrones repartidos entre todas las estructuras, con enlaces iguales.',
        ejemplo: 'NO₃⁻: tres enlaces N–O de orden 4/3.', ver: ['resonancia'] },
      { termino: 'dipolo', formas: ['dipolo', 'dipolos'], simbolo: 'μ', medida: 'D',
        def: 'Separación de carga: un extremo algo positivo y otro algo negativo. Se dibuja como flecha.',
        ver: ['electronegatividad', 'molécula polar'] },
      { termino: 'molécula polar', formas: ['molécula polar', 'moléculas polares', 'polar', 'polares'],
        def: 'Molécula cuyos dipolos de enlace no se anulan: le queda una flecha total.',
        ejemplo: 'H₂O, angular: 1,85 D; el CO₂, lineal, no lo es.', ver: ['dipolo'] },
      { termino: 'forma molecular', formas: ['forma molecular', 'formas moleculares'],
        def: 'Figura que dibujan los átomos alrededor del átomo central; se nombra sin contar los pares libres.',
        ejemplo: 'El NH₃ tiene 4 regiones y forma piramidal.', ver: ['par libre'] },
      { termino: 'fuerzas intermoleculares', formas: ['fuerzas intermoleculares', 'fuerza intermolecular'],
        def: 'Atracciones entre moléculas vecinas, mucho más débiles que los enlaces de dentro de cada una.',
        ver: ['puente de hidrógeno', 'fuerzas de London'] },
      { termino: 'puente de hidrógeno', formas: ['puente de hidrógeno', 'puentes de hidrógeno'],
        def: 'Atracción fuerte entre un H unido a N, O o F y un par libre de otra molécula.',
        ejemplo: 'Por ellos el agua hierve a 100 °C y el H₂S, a −60 °C.', ver: ['fuerzas intermoleculares'] },
      { termino: 'fuerzas de London', formas: ['fuerzas de London', 'fuerza de London'],
        def: 'Atracción débil entre dipolos pasajeros; la tienen todas las moléculas y crece con su tamaño.',
        ver: ['fuerzas intermoleculares'] },
    ],
    // Laboratorio (docs/teoria.md §4b): mesas sin preguntas. La primera deja girar los dos enlaces de una molécula
    // angular y cambiar su polaridad, de 60° a 180° (el caso lineal, que anula todo). La segunda junta dos iones y el
    // híbrido. Las lecturas dicen ángulo, dipolo de enlace y resultado, o el ion y dónde quedó el par.
    laboratorio: [
      {
        // Exploración libre en 3D (decisión de Gerson, 15 nov: sin predicciones; los retos son invitaciones).
        id: 'molecula-gira', titulo: 'La molécula que gira', pieza: 'quim-molecula-3d',
        consigna: 'Gira la molécula con el dedo y toca un átomo para saber cuál es. Cambia de molécula y enciende los dipolos.',
        controles: [
          { id: 'mol', etiqueta: 'Molécula', opciones: GIRA.map(k => ({ valor: k, texto: M.molecula(k).formula })) },
          { id: 'dip', etiqueta: 'Dipolos', opciones: [{ valor: 0, texto: 'Ocultos' }, { valor: 1, texto: 'A la vista' }] },
          { id: 'par', etiqueta: 'Pares libres', opciones: [{ valor: 1, texto: 'A la vista' }, { valor: 0, texto: 'Ocultos' }] },
        ],
        dibujo: val => ({ datos: mol3d(val.mol), estado: { dipolos: val.dip === 1, pares: val.par === 1 } }),
        lectura: val => { const x = M.molecula(val.mol); return [`${x.formula}: ${x.vsepr.geometria}, ${x.vsepr.hibridacion}, ${x.polaridad.polar ? 'polar' : 'apolar'}`]; },
        // Retos comprobados con el mismo motor que arma la figura (docs/teoria.md §4d).
        invitaciones: [
          { texto: 'Encuentra una molécula con enlaces polares que, en total, sea apolar.',
            logrado: val => enlacesPolares(val.mol) && !M.molecula(val.mol).polaridad.polar,
            bien: 'Sus dipolos de enlace se anulan por la forma. Míralo con los dipolos a la vista.' },
          { texto: 'Busca una molécula cuyo átomo central tenga dos pares libres.',
            logrado: val => M.molecula(val.mol).posiciones.pares.length === 2,
            bien: 'Los pares libres también ocupan lugar: empujan a los enlaces.' },
          { texto: 'Enciende los dipolos y busca la molécula con forma de pirámide.',
            logrado: val => val.dip === 1 && M.molecula(val.mol).vsepr.geometria === 'piramidal trigonal',
            bien: 'Tres enlaces y un par libre arriba: las flechas no se anulan.' },
          { texto: 'Encuentra la molécula que tiene ángulos de 90° y de 120° a la vez.',
            logrado: val => { const a = M.molecula(val.mol).vsepr.angulos.map(Math.round); return a.includes(90) && a.includes(120); },
            bien: 'La bipirámide: tres átomos en el ecuador y dos en los polos.' },
          { texto: 'Guarda dos moléculas con la misma forma: una polar y otra apolar.',
            logrado: (val, guardados) => guardados.some(a => guardados.some(b => {
              const x = M.molecula(a.mol), y = M.molecula(b.mol);
              return x.vsepr.geometria === y.vsepr.geometria && x.polaridad.polar && !y.polaridad.polar;
            })),
            bien: 'La forma no basta: también importa qué átomos rodean al central.' },
        ],
      },
      {
        id: 'dos-dipolos', titulo: 'Dos dipolos que giran', pieza: 'quim-molecula',
        consigna: 'Agarra el hidrógeno de la derecha y abre o cierra el ángulo. Cambia también la polaridad de cada enlace. ¿Cuándo se anulan?',
        controles: [
          { id: 'th', etiqueta: 'θ', color: 'c-d', min: TH_MIN, max: 180, paso: 5, inicio: 105, unidad: '°', decimales: 0 },
          { id: 'mb', etiqueta: 'Dipolo de enlace', color: 'c-o', min: 0.5, max: MB_MAX, paso: 0.1, inicio: 1.5, unidad: 'D', decimales: 1 },
        ],
        dibujo: val => dosDipolos(val),
        lectura: val => [`θ = ${f(val.th, 0)}° · enlace ${f(val.mb, 1)} D → `, mu, ` = ${f(muTotal(val))} D`],
        arrastres: [{ id: 'hidrogeno', etiqueta: 'hidrógeno: abre o cierra el ángulo', color: 'c-d',
          donde: val => manijaH(val),
          mover: (pt, val) => ({ th: anguloEn(pt, val) }) }],
        // Retos comprobados (docs/teoria.md §4d): miden el dipolo total con muTotal, la misma suma que dibuja la flecha.
        invitaciones: [
          { texto: 'Haz que los dos dipolos se anulen por completo.',
            logrado: val => muTotal(val) < 0.005,
            bien: 'Lineal: enlaces polares y molécula apolar. Así queda el CO₂.' },
          { texto: 'Consigue un dipolo total igual al de un solo enlace.',
            logrado: val => Math.abs(muTotal(val) - val.mb) < 0.005,
            bien: 'A 120°, dos flechas suman lo mismo que una. ¿Y a 90°?' },
          { texto: 'Busca el dipolo total más grande que permite la mesa.',
            logrado: val => Math.abs(muTotal(val) - muTotal({ th: TH_MIN, mb: MB_MAX })) < 1e-9,
            bien: 'Ángulo cerrado y enlaces muy polares: las flechas casi se suman enteras.' },
          { texto: 'Guarda dos casos con el mismo ángulo: uno con el doble de dipolo total.',
            logrado: (val, guardados) => guardados.some(a => guardados.some(b => a.th === b.th && muTotal(b) > 0.005
              && Math.abs(muTotal(a) - 2 * muTotal(b)) < 1e-6)),
            bien: 'Con el ángulo fijo, el total sigue a la polaridad de cada enlace.' },
        ],
      },
      {
        id: 'resonancia-libre', titulo: 'El par que se reparte', pieza: 'quim-molecula',
        consigna: 'Elige el ion. Lleva el doble enlace a cada oxígeno y después al centro: ahí está el híbrido, el ion real.',
        controles: [
          { id: 'ion', etiqueta: 'Ion', opciones: Object.keys(IONES).map(k => ({ valor: k, texto: IONES[k].t })) },
          { id: 'k', etiqueta: 'Doble enlace', opciones: [{ valor: 0, texto: 'Arriba' }, { valor: 1, texto: 'Izquierda' }, { valor: 2, texto: 'Derecha' }, { valor: 3, texto: 'Híbrido' }] },
        ],
        dibujo: val => resDib(val),
        lectura: val => (val.k === 3 ? [`${IONES[val.ion].t}, híbrido: tres enlaces de orden 1⅓`]
          : [`${IONES[val.ion].t}, doble ${['arriba', 'a la izquierda', 'a la derecha'][val.k]}: `, Nv, ` = ${f(resDib(val).nval, 0)} e⁻`]),
        arrastres: [{ id: 'doble', etiqueta: 'doble enlace: llévalo a un oxígeno o al centro', color: 'c-i',
          donde: val => mitad(resDib(val), val.k),
          mover: (pt, val) => ({ k: dobleCerca(resDib(val), pt, true) }) }],
        // Retos: cuentan los electrones con resDib, el mismo armado que dibuja la estructura.
        invitaciones: [
          { texto: 'Lleva el carbonato a su híbrido: el ion real.',
            logrado: val => val.ion === 'CO3' && val.k === 3,
            bien: 'Tres enlaces iguales: el par doble está repartido entre los tres oxígenos.' },
          { texto: 'Guarda dos estructuras del mismo ion que solo cambien dónde va el doble enlace.',
            logrado: (val, guardados) => guardados.some(a => guardados.some(b => a.ion === b.ion && a.k !== b.k && a.k < 3 && b.k < 3)),
            bien: 'Mismos átomos; solo se mueve un par. Eso es resonancia.' },
          { texto: 'Guarda una estructura de cada ion con los mismos electrones de valencia.',
            logrado: (val, guardados) => guardados.some(a => guardados.some(b => a.ion !== b.ion && a.k < 3 && b.k < 3
              && resDib(a).nval === resDib(b).nval)),
            bien: 'Igual cuenta de electrones, igual triángulo. ¿Por qué el carbonato tiene más carga?' },
        ],
      },
    ],
    ideas: [tres, lewisSolo, res, geo, fuerzas],
  };
});
