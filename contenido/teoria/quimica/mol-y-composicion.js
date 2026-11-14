/*
 * Teoría de «Mol y composición» (quimica.mol-y-composicion). Molde: docs/teoria.md; forma de química:
 * contenido/teoria/quimica/materia-y-energia.js. Compañera: Bruna (castora), voz resolutiva y cálida.
 * Fuente del contenido: docs/teoria/matriz/quimica.json (unidad 6), docs/teoria/fuentes/historia-ecuaciones-1.pdf
 * (p. 30). Errores: docs/investigacion/estequiometria-ideas-erroneas.md (ES1–ES19), atomo-enlace (AT4); los QM- son
 * hipótesis nuevas.
 *
 * Ficha de tarea (diseno-y-animacion)
 *   Promesa: pasar de gramos a moles y a partículas, y leer una fórmula como una receta de masas.
 *   Persona y condiciones: postulante de 4.º–5.º, celular de gama baja a 360 px, sin audio, a veces sin conexión.
 *   Resultado observable: calcula una masa atómica promedio, n = m/M, N = n·NA, moles de un elemento en una fórmula,
 *     un porcentaje en masa, una fórmula empírica y molecular, y aplica conservación y proporciones definidas.
 *   Orden de atención: 1.º la figura (balanza, lupa o barra) · 2.º la lectura en vivo · acción: probar casos.
 *   Estados: juego sin tocar · casos probados · predicción abierta · revelado · paso a paso · caso nuevo · acierto · «No sé».
 *   Duda que resuelve: ¿un mol es una masa?, ¿más masa es más partículas?, ¿la fórmula empírica es la razón de masas?
 *
 * Colores (regla 4): n cantidad de sustancia (mol) naranja c-o, m masa turquesa c-i, M masa molar verde c-d,
 * N número de entidades rojo c-h. En las barras de composición y en la lupa, cada elemento lleva un color propio
 * (C tinta, H turquesa, O rojo, N naranja, S verde): esas ideas no escriben m, n, M ni N con color.
 * Datos: masas isotópicas y abundancias del cloro (NIST / IUPAC): ³⁵Cl 34,969 u, 75,76 %; ³⁷Cl 36,966 u, 24,24 %.
 * Masas atómicas redondeadas, como en el examen: H 1, C 12, N 14, O 16, Na 23, Al 27, S 32, Cl 35,5, Ca 40.
 * NA = 6,022 × 10²³ mol⁻¹ (exacto: 6,02214076 × 10²³, BIPM). La lupa no es a escala ni cuenta 10²³: el alt lo dice.
 * Fuentes (no van al alumno): BIPM, el mol; OpenStax Chemistry 2e §3.1 y §3.2; Proust, Dalton y Lavoisier.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const n_ = { v: 'c-o', t: 'n' }, m_ = { v: 'c-i', t: 'm' }, M_ = { v: 'c-d', t: 'M' }, N_ = { v: 'c-h', t: 'N' };
  const NA = { sub: ['N', 'A'] };
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
    return ops.slice(0, 4);
  }
  const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  function cien(x, d = 2) {
    if (x === 0) return '0';
    let e = Math.floor(Math.log10(Math.abs(x))), mant = x / 10 ** e;
    if (Math.abs(+mant.toFixed(d)) >= 10) { e += 1; mant /= 10; }
    return `${f(mant, d)} × 10${String(e).split('').map(c => SUP[c]).join('')}`;
  }
  const SUB = { 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉' };
  const sub = k => (k === 1 ? '' : String(k).split('').map(c => SUB[c]).join(''));
  const NAV = 6.022e23;

  // ---------- Masas atómicas (redondeadas) y fórmulas ----------
  const MA = { H: 1, C: 12, N: 14, O: 16, Na: 23, Al: 27, S: 32, Cl: 35.5, Ca: 40, Mg: 24, K: 39 };
  // Fórmula como lista de [elemento, átomos por unidad].
  const FORM = {
    'H₂O': [['H', 2], ['O', 1]], 'CO₂': [['C', 1], ['O', 2]], 'NH₃': [['N', 1], ['H', 3]], 'CH₄': [['C', 1], ['H', 4]],
    'H₂SO₄': [['H', 2], ['S', 1], ['O', 4]], 'NaCl': [['Na', 1], ['Cl', 1]], 'CaCO₃': [['Ca', 1], ['C', 1], ['O', 3]],
    'C₆H₁₂O₆': [['C', 6], ['H', 12], ['O', 6]], 'C₁₂H₂₂O₁₁': [['C', 12], ['H', 22], ['O', 11]], 'Al₂(SO₄)₃': [['Al', 2], ['S', 3], ['O', 12]],
    'C₂H₆O': [['C', 2], ['H', 6], ['O', 1]], 'Ca(OH)₂': [['Ca', 1], ['O', 2], ['H', 2]]
  };
  const masaMolar = k => FORM[k].reduce((a, [el, c]) => a + MA[el] * c, 0);

  // ---------- Idea 1: la masa atómica es un promedio ----------
  // Cambia: la abundancia del cloro-35 · Permanece: 25 átomos en la lupa y las dos masas isotópicas · Progresa: de
  // todo ³⁷Cl a todo ³⁵Cl · Se reserva: que ningún átomo pesa 35,45 u · Debe verse: cuántos átomos hay de cada uno.
  const M35 = 34.969, M37 = 36.966;
  const ISO = { atomos: { a: { color: 'h', estilo: 'lleno', r: 6 }, b: { color: 'i', estilo: 'hueco', r: 7.5 } }, especies: { 'cloro-35': [['a', 0, 0]], 'cloro-37': [['b', 0, 0]] } };
  const lupaCl = (n35, extra = {}) => ({ datos: Object.assign({}, ISO, { separacion: 26, alto: 150,
    cajas: [{ titulo: '25 átomos de cloro', forma: 'caja', particulas: [{ e: 'cloro-35', n: n35 }, { e: 'cloro-37', n: 25 - n35 }], cuenta: [{ e: 'cloro-35', texto: `³⁵Cl: ${n35}` }, { e: 'cloro-37', texto: `³⁷Cl: ${25 - n35}` }] }],
    alt: `Lupa (modelo, no a escala) con 25 átomos de cloro: ${n35} de cloro-35 y ${25 - n35} de cloro-37.` }, extra), estado: {} });
  const promedio = p => (p * M35 + (100 - p) * M37) / 100;
  const masaProm = {
    id: 'masa-atomica-promedio',
    titulo: 'Masa atómica: un promedio',
    temas: ['Unidad de masa atómica y masa atómica promedio'],
    pieza: 'quim-particulas',
    juega: {
      consigna: 'El cloro tiene dos isótopos: cloro-35 (34,969 u) y cloro-37 (36,966 u). Cambia cuántos hay de cada uno y lee la masa promedio.',
      voz: 'Mira hacia qué masa se acerca el promedio.',
      controles: [{ id: 'p', etiqueta: '% de cloro-35', min: 0, max: 100, paso: 4, inicio: 52, unidad: '%', decimales: 0 }],
      dibujo: v => lupaCl(v.p / 4),
      lectura: v => [`masa promedio: ${f(promedio(v.p), 3)} u`],
      minimo: 3,
    },
    predice: {
      pregunta: 'En la naturaleza hay 76 % de cloro-35 y 24 % de cloro-37; la tabla dice 35,45 u. ¿Hay átomos de cloro que pesen 35,45 u?',
      voz: 'Piensa qué átomos hay de verdad en la lupa.',
      opciones: [
        { id: 'c', texto: 'Ninguno: cada átomo pesa cerca de 35 o de 37 u', correcta: true },
        { id: 'todos', texto: 'Todos: es la masa de un átomo de cloro', error: 'AT4', siFuera: 'Sería cierto si el cloro tuviera un solo isótopo. Tiene dos, y 35,45 es su promedio.' },
        { id: 'algunos', texto: 'Algunos: los que tienen neutrones fraccionarios', error: 'QM-PROMEDIO', siFuera: 'Los neutrones son enteros: 18 o 20. El decimal sale de promediar.' },
      ],
      dibujo: { datos: Object.assign({}, ISO, { separacion: 26, cajas: [{ titulo: '25 átomos de cloro', forma: 'caja', particulas: [] }], alt: 'Lupa vacía, antes de mirar los átomos.' }), estado: {} },
      revelar: lupaCl(19),
      coincide: 'Coincide: hay átomos de dos masas; 35,45 u es su promedio.',
      noCoincide: 'Solo hay átomos de unos 35 u y de unos 37 u; 35,45 es el promedio.',
    },
    mira: {
      datos: Object.assign(lupaCl(19).datos, { cajas: [Object.assign({}, lupaCl(19).datos.cajas[0], { particulas: [{ e: 'cloro-35', n: 19, desde: 1 }, { e: 'cloro-37', n: 6, desde: 2 }], cuenta: [{ e: 'cloro-35', texto: '³⁵Cl: 19', desde: 1 }, { e: 'cloro-37', texto: '³⁷Cl: 6', desde: 2 }] })] }),
      voz: 'Sumemos lo que aporta cada isótopo.',
      pasos: [
        { estado: { corte: 1 }, texto: 'De cada 100 átomos, 76 son de cloro-35.', ecuacion: [`0,7576 × 34,969 = ${f(0.7576 * M35, 3)} u`] },
        { estado: { corte: 2 }, texto: 'Los otros 24 son de cloro-37.', ecuacion: [`0,2424 × 36,966 = ${f(0.2424 * M37, 3)} u`] },
        { estado: { corte: 2 }, texto: 'La suma es la masa atómica promedio de la tabla.', ecuacion: [`${f(0.7576 * M35, 3)} + ${f(0.2424 * M37, 3)} = ${f(0.7576 * M35 + 0.2424 * M37, 2)} u`] },
        { estado: { corte: 2 }, texto: 'La unidad u es la doceava parte de la masa de un carbono-12.', ecuacion: ['1 u = ¹⁄₁₂ m(¹²C)'] },
      ],
    },
    regla: {
      texto: 'La masa atómica de la tabla es el promedio de las masas de los isótopos, cada una multiplicada por su abundancia. Se mide en u.',
      ecuacion: ['masa promedio = Σ (masa del isótopo × fracción)'],
      condicion: 'las abundancias son las naturales y suman 100 %; ningún átomo concreto pesa el promedio.',
      voz: 'Promedio pesado: cuenta más el isótopo más abundante.',
    },
    ahoraTu: {
      voz: 'Multiplica cada masa por su fracción y suma.',
      generar(s) {
        const r = azar(s), a = r.ent(20, 80), b = a + 2, p = 5 * r.ent(3, 17), prom = (p * a + (100 - p) * b) / 100;
        return {
          pregunta: `Un elemento tiene dos isótopos: ${p} % de masa ${a} u y ${100 - p} % de masa ${b} u. ¿Cuál es su masa atómica promedio?`,
          opciones: opciones(prom, [
            { id: 'simple', valor: (a + b) / 2, error: 'QM-PROMEDIO-SIMPLE', siFuera: 'Eso es el punto medio. Sería cierto si los dos fueran igual de abundantes.' },
            { id: 'cruzado', valor: ((100 - p) * a + p * b) / 100, error: 'QM-PROMEDIO-SIMPLE', siFuera: 'Eso cruza las abundancias: a cada masa le toca su propio porcentaje.' },
            { id: 'comun', valor: p >= 50 ? a : b, error: 'AT4', siFuera: 'Esa es la masa del isótopo más común; el otro también aporta.' },
          ], x => `${f(x, 2)} u`),
          solucion: { texto: 'Se multiplica cada masa por su fracción y se suman.', ecuacion: [`${f(p / 100)} · ${a} + ${f((100 - p) / 100)} · ${b} = ${f(prom, 2)} u`] },
        };
      },
    },
  };

  // ---------- Idea 2: el mol cuenta; la masa molar pesa ----------
  // Cambia: la sustancia y los moles · Permanece: la balanza en equilibrio con su pesa · Progresa: de 0,5 a 3 mol;
  // de una sustancia liviana a una pesada · Se reserva: que 1 mol de cada una tiene el mismo número de moléculas ·
  // Debe verse: que la masa cambia con la sustancia y el número no.
  const SUST = { 'H₂O': 'agua', 'CO₂': 'dióxido de carbono', 'NaCl': 'sal', 'C₁₂H₂₂O₁₁': 'azúcar' };
  const pesar = (k, n) => ({ datos: { unidad: 'g', balanzas: [{ izq: { saco: n * masaMolar(k) }, der: { pesa: n * masaMolar(k) }, estado: 'equilibrio' }], alt: `Balanza en equilibrio: ${f(n, 1)} mol de ${k} pesan ${f(n * masaMolar(k), 1)} g.` }, estado: { rastros: { 0: [`${f(n, 1)} mol de ${k}`] } } });
  const mol = {
    id: 'mol-masa-molar',
    titulo: 'Un mol cuenta, no pesa',
    temas: ['Número de Avogadro y mol', 'Masa molar'],
    pieza: 'balanza',
    juega: {
      consigna: 'Elige una sustancia y cuántos moles pones en la balanza. Lee cuántos gramos pesa esa cantidad.',
      voz: 'Compara 1 mol de una sustancia con 1 mol de otra.',
      controles: [
        { id: 'k', etiqueta: 'Sustancia', opciones: Object.keys(SUST).map(k => ({ valor: k, texto: k })) },
        { id: 'n', etiqueta: 'n', color: 'c-o', min: 0.5, max: 3, paso: 0.5, inicio: 1, unidad: 'mol', decimales: 1 },
      ],
      dibujo: v => pesar(v.k, v.n),
      lectura: v => [n_, ` = ${f(v.n, 1)} mol de ${v.k} → `, m_, ` = ${f(v.n * masaMolar(v.k), 1)} g`],
      minimo: 4,
    },
    predice: {
      pregunta: ['Tienes 1 mol de agua (18 g) y 1 mol de azúcar (342 g). ¿Dónde hay más moléculas, ', N_, '?'],
      voz: 'Anota tu predicción; la balanza no cuenta moléculas.',
      opciones: [
        { id: 'c', texto: 'Hay el mismo número en los dos', correcta: true },
        { id: 'azucar', texto: 'En el azúcar, porque pesa más', error: 'ES4', siFuera: 'Pesa más, cierto. Pero cada molécula de azúcar pesa 19 veces más que una de agua.' },
        { id: 'agua', texto: 'En el agua, porque sus moléculas son pequeñas', error: 'ES4', siFuera: 'Son pequeñas, bien visto. Eso explicaría más moléculas a igual masa, no a igual número de moles.' },
        { id: 'masa', texto: 'No se puede saber: un mol es una masa', error: 'ES3', siFuera: 'Un mol no es una masa: es una cantidad de entidades, 6,022 × 10²³.' },
      ],
      dibujo: { datos: { unidad: 'g', balanzas: [{ izq: { saco: 18 }, der: { saco: 342 }, estado: 'der-baja' }], alt: 'Balanza con 18 g de agua a la izquierda y 342 g de azúcar a la derecha: baja la derecha.' }, estado: { rastros: { 0: ['1 mol de agua · 1 mol de azúcar'] } } },
      revelar: { datos: { unidad: 'g', balanzas: [{ izq: { saco: 18 }, der: { saco: 342 }, estado: 'der-baja' }], alt: 'La balanza baja hacia el azúcar, pero los dos platillos tienen 6,022 × 10²³ moléculas.' }, estado: { rastros: { 0: ['los dos: 6,022 × 10²³ moléculas'] } } },
      coincide: 'Coincide: un mol de cualquier cosa tiene 6,022 × 10²³ entidades.',
      noCoincide: 'Un mol de cada uno tiene 6,022 × 10²³ moléculas; solo cambia cuánto pesa cada una.',
    },
    mira: {
      datos: { unidad: 'g', balanzas: [{ izq: { saco: 18 }, der: { saco: 44 }, estado: 'der-baja' }], alt: 'Balanza con 1 mol de agua (18 g) y 1 mol de dióxido de carbono (44 g).' },
      voz: 'Separemos contar de pesar.',
      pasos: [
        { estado: { rastros: { 0: ['1 mol = 6,022 × 10²³ entidades'] } }, texto: 'Un mol es un número de entidades, como una docena pero enorme.', ecuacion: [NA, ' = 6,022 × 10²³ mol⁻¹'] },
        { estado: { rastros: { 0: ['izquierda: 1 mol de H₂O = 18 g'] } }, texto: 'Un mol de agua pesa 2 · 1 + 16 = 18 g.', ecuacion: [M_, '(H₂O) = 18 g/mol'] },
        { estado: { rastros: { 0: ['derecha: 1 mol de CO₂ = 44 g'] } }, texto: 'Un mol de CO₂ pesa 12 + 2 · 16 = 44 g: mismo número, otra masa.', ecuacion: [M_, '(CO₂) = 44 g/mol'] },
        { estado: { rastros: { 0: ['88 g de CO₂ = 2 mol'] } }, texto: 'Para pasar de gramos a moles se divide entre la masa molar.', ecuacion: [n_, ' = ', { frac: [m_, M_] }, ' = ', { frac: ['88', '44'] }, ' = 2 mol'] },
      ],
    },
    regla: {
      texto: 'Un mol tiene 6,022 × 10²³ entidades (átomos, moléculas o iones). La masa molar M dice cuántos gramos pesa un mol de esa sustancia.',
      ecuacion: [N_, ' = ', n_, ' · ', NA, '   ·   ', m_, ' = ', n_, ' · ', M_],
      condicion: 'se dice qué entidad se cuenta; M sale de sumar las masas atómicas de la fórmula, en g/mol.',
      voz: 'Contar y pesar son dos cosas: el mol las une.',
    },
    ahoraTu: {
      voz: 'Escribe primero la masa molar.',
      generar(s) {
        const r = azar(s), k = r.de(['H₂O', 'CO₂', 'NaCl', 'CH₄', 'NH₃', 'CaCO₃', 'H₂SO₄']), M = masaMolar(k);
        if (s % 2) {
          const n = r.de([0.5, 1.5, 2, 2.5, 3, 4]), m = n * M;
          return {
            pregunta: ['¿Cuántos moles hay en ', m_, ` = ${f(m, 1)} g de ${k}? (`, M_, ` = ${f(M, 1)} g/mol)`],
            opciones: opciones(n, [
              { id: 'inv', valor: M / m, error: 'ES7', siFuera: 'Eso divide M entre m. Los moles son la masa entre la masa molar.' },
              { id: 'por', valor: m * M, error: 'ES7', siFuera: 'Eso multiplica; para pasar de gramos a moles se divide.' },
              { id: 'masa', valor: m, error: 'ES3', siFuera: 'Esos son los gramos. Un mol no es un gramo.' },
            ], x => `${f(x, 3)} mol`),
            solucion: { texto: 'Gramos entre gramos por mol da moles.', ecuacion: [n_, ' = ', { frac: [m_, M_] }, ` = ${f(m, 1)} / ${f(M, 1)} = ${f(n, 3)} mol`] },
          };
        }
        const n = r.de([0.5, 2, 3, 0.25, 1.5]), N = n * NAV;
        return {
          pregunta: ['¿Cuántas moléculas hay en ', n_, ` = ${f(n, 2)} mol de ${k}?`],
          opciones: opciones(N, [
            { id: 'div', valor: NAV / n, error: 'QM-NA', siFuera: 'Eso divide; cada mol aporta 6,022 × 10²³, así que se multiplica.' },
            { id: 'masa', valor: n * M, error: 'ES6', siFuera: 'Eso es la masa en gramos, no el número de moléculas.' },
            { id: 'na', valor: NAV, error: 'ES6', siFuera: 'Ese es el número de un solo mol; aquí hay otra cantidad.' },
          ], x => (x > 1e6 ? cien(x, 3) : `${f(x, 1)}`)),
          solucion: { texto: 'Cada mol tiene 6,022 × 10²³ moléculas.', ecuacion: [N_, ' = ', n_, ' · ', NA, ` = ${f(n, 2)} · 6,022 × 10²³ = ${cien(N, 3)}`] },
        };
      },
    },
  };

  // ---------- Idea 3: los subíndices son razones de moles ----------
  // Cambia: la fórmula y cuántas unidades hay · Permanece: la lupa y la cuenta de átomos por elemento · Progresa: de
  // 1 a 4 unidades · Se reserva: el paréntesis que multiplica todo lo de adentro · Debe verse: que los átomos de
  // cada elemento son unidades × subíndice.
  const LUPA_AT = { H: { color: 'i', estilo: 'hueco', r: 4 }, O: { color: 'h', estilo: 'lleno', r: 5.5 }, C: { estilo: 'lleno', r: 5 }, N: { color: 'o', estilo: 'hueco', r: 5.5 }, S: { color: 'd', estilo: 'lleno', r: 6 } };
  const MOLEC = {
    'H₂O': [['O', 0, 0], ['H', -7, 6], ['H', 7, 6]], 'CO₂': [['C', 0, 0], ['O', -10, 0], ['O', 10, 0]], 'NH₃': [['N', 0, -2], ['H', -8, 5], ['H', 8, 5], ['H', 0, 9]],
    'CH₄': [['C', 0, 0], ['H', -8, -6], ['H', 8, -6], ['H', -8, 6], ['H', 8, 6]], 'H₂SO₄': [['S', 0, 0], ['O', -9, -7], ['O', 9, -7], ['O', -9, 7], ['O', 9, 7], ['H', -17, -7], ['H', 17, 7]],
  };
  const NOMBRE_EL = { H: 'H', O: 'O', C: 'C', N: 'N', S: 'S' };
  function lupaFormula(k, u, desde = 0) {
    const cuenta = FORM[k].map(([el, c]) => ({ e: el, texto: `${el} ${u * c}`, desde }));
    const especies = Object.assign({ [k]: MOLEC[k] }, Object.fromEntries(Object.keys(LUPA_AT).map(el => [el, [[el, 0, 0]]])));
    return { atomos: LUPA_AT, especies, separacion: 44, alto: 130, cajas: [{ titulo: `${u} ${k}`, forma: 'caja', particulas: [{ e: k, n: u }], cuenta }],
      alt: `Lupa (modelo) con ${u} unidades de ${k}: ${FORM[k].map(([el, c]) => `${u * c} átomos de ${NOMBRE_EL[el]}`).join(', ')}.` };
  }
  const relaciones = {
    id: 'relaciones-en-formula',
    titulo: 'Los subíndices son una receta',
    temas: ['Relaciones molares en una fórmula'],
    pieza: 'quim-particulas',
    juega: {
      consigna: 'Elige una fórmula y cuántas moléculas pones en la lupa. Debajo se cuentan los átomos de cada elemento.',
      voz: 'Compara la cuenta con los subíndices de la fórmula.',
      controles: [
        { id: 'k', etiqueta: 'Fórmula', opciones: Object.keys(MOLEC).map(k => ({ valor: k, texto: k })) },
        { id: 'u', etiqueta: 'Moléculas', min: 1, max: 4, paso: 1, inicio: 2, decimales: 0 },
      ],
      dibujo: v => ({ datos: lupaFormula(v.k, v.u), estado: {} }),
      lectura: v => [`${v.u} ${v.k}: ${FORM[v.k].map(([el, c]) => `${v.u * c} ${el}`).join(', ')}`],
      minimo: 4,
    },
    predice: {
      pieza: 'quim-fichas',
      pregunta: '¿Cuántos moles de átomos de oxígeno hay en 2 mol de Al₂(SO₄)₃?',
      voz: 'Mira bien qué abarca el paréntesis.',
      opciones: [
        { id: 'c', texto: '24 mol', correcta: true },
        { id: 'parentesis', texto: '8 mol', error: 'ES18', siFuera: 'Contaste 4 O por unidad. El 3 de afuera multiplica el SO₄ entero: son 12.' },
        { id: 'uno', texto: '12 mol', error: 'QM-POR-N', siFuera: 'Doce O hay en una unidad. Aquí hay 2 mol de unidades.' },
        { id: 'formula', texto: '7 mol', error: 'ES11', siFuera: 'Eso suma subíndices sueltos (4 + 3). Cada O se cuenta en cada SO₄.' },
      ],
      dibujo: { datos: { fichas: [{ t: 'Al₂(SO₄)₃', carga: 0, n: 2, color: 'o' }], cuenta: false, alt: 'Dos unidades de sulfato de aluminio.' }, estado: {} },
      revelar: { datos: { fichas: [{ t: 'Al³⁺', carga: 3, n: 2, color: 'o' }, { t: 'SO₄²⁻', carga: -2, n: 3, color: 'i' }], cuenta: false, alt: 'Una unidad de Al₂(SO₄)₃ tiene 2 Al³⁺ y 3 SO₄²⁻: 12 átomos de O. Dos unidades tienen 24.' }, estado: {} },
      coincide: 'Coincide: 3 × 4 = 12 O por unidad, y 2 mol de unidades.',
      noCoincide: 'Cada unidad tiene 3 SO₄: 12 O. En 2 mol, 24 mol de O.',
    },
    mira: {
      datos: Object.assign(lupaFormula('H₂SO₄', 2), { cajas: [Object.assign(lupaFormula('H₂SO₄', 2).cajas[0], { particulas: [{ e: 'H₂SO₄', n: 2, desde: 1 }],
        cuenta: [{ e: 'H', texto: 'H 4', desde: 2 }, { e: 'S', texto: 'S 2', desde: 2 }, { e: 'O', texto: 'O 8', desde: 3 }] })] }),
      voz: 'Contemos los átomos de dos moléculas de ácido sulfúrico.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Una molécula de H₂SO₄ tiene 2 H, 1 S y 4 O.', ecuacion: ['H₂SO₄ → 2 : 1 : 4'] },
        { estado: { corte: 2 }, texto: 'Dos moléculas tienen el doble de H y de S.', ecuacion: ['H: 2 · 2 = 4   ·   S: 2 · 1 = 2'] },
        { estado: { corte: 3 }, texto: 'Y el doble de O.', ecuacion: ['O: 2 · 4 = 8'] },
        { estado: { corte: 3 }, texto: 'Con moles pasa lo mismo: 2 mol de H₂SO₄ tienen 8 mol de O.', ecuacion: [n_, '(O) = 2 · 4 = 8 mol'] },
      ],
    },
    regla: {
      texto: 'Los subíndices dicen cuántos átomos de cada elemento hay en una unidad, y también la razón entre sus moles. Un subíndice fuera del paréntesis multiplica todo lo de adentro.',
      ecuacion: [n_, '(elemento) = ', n_, '(compuesto) × átomos por unidad'],
      condicion: 'se cuenta la entidad pedida; en un compuesto iónico no hay moléculas, hay unidades fórmula.',
      voz: 'Primero los átomos de una unidad, después por los moles.',
    },
    ahoraTu: {
      voz: 'Cuenta los átomos de una unidad y multiplica.',
      generar(s) {
        const r = azar(s), k = r.de(['H₂SO₄', 'CaCO₃', 'Al₂(SO₄)₃', 'C₆H₁₂O₆', 'Ca(OH)₂', 'NH₃', 'C₂H₆O']), fo = FORM[k];
        const [el, c] = r.de(fo), n = r.de([0.5, 2, 3, 4, 1.5]);
        const sinPar = k.includes('(') ? (k === 'Al₂(SO₄)₃' ? { O: 4, S: 1 }[el] : { O: 1, H: 1 }[el]) : null;
        return {
          pregunta: ['¿Cuántos moles de átomos de ', el, ' hay en ', n_, ` = ${f(n, 1)} mol de ${k}?`],
          opciones: opciones(n * c, [
            { id: 'parentesis', valor: sinPar ? n * sinPar : null, error: 'ES18', siFuera: 'El subíndice de afuera multiplica todo lo que está dentro del paréntesis.' },
            { id: 'uno', valor: c, error: 'QM-POR-N', siFuera: 'Esos átomos hay en una sola unidad; faltan los moles de compuesto.' },
            { id: 'n', valor: n, error: 'ES14', siFuera: 'Esos son los moles del compuesto; cada unidad trae varios átomos de este elemento.' },
            { id: 'masa', valor: n * c * MA[el], error: 'ES3', siFuera: 'Eso ya es la masa en gramos, no los moles.' },
          ], x => `${f(x, 1)} mol`),
          solucion: { texto: `Cada unidad de ${k} tiene ${c} átomos de ${el}.`, ecuacion: [n_, `(${el}) = ${f(n, 1)} · ${c} = ${f(n * c, 1)} mol`] },
        };
      },
    },
  };

  // ---------- Idea 4: composición centesimal y fórmula empírica ----------
  // Cambia: el compuesto · Permanece: una barra de 100 % partida por elemento · Progresa: de gramos a moles y a la
  // razón entera · Se reserva: el CH₄, donde el % de átomos no es el % de masa · Debe verse: el largo de cada tramo.
  const COLOR_EL = { C: undefined, H: 'i', O: 'h', N: 'o', S: 'd', Na: 'o', Cl: 'd', Ca: 'd' };
  const pct = k => FORM[k].map(([el, c]) => [el, 100 * MA[el] * c / masaMolar(k)]);
  const barra = (k, titulo) => ({ titulo: titulo || `${k}: ${f(masaMolar(k), 1)} g/mol`, tramos: pct(k).map(([el, p]) => ({ valor: p, texto: `${el} ${f(p, 1)} %`, color: COLOR_EL[el] })) });
  const COMP = ['H₂O', 'CO₂', 'NH₃', 'NaCl', 'C₆H₁₂O₆', 'H₂SO₄'];
  const composicion = {
    id: 'composicion-formula-empirica',
    titulo: 'De porcentajes a fórmula',
    temas: ['Composición centesimal', 'Fórmula empírica y molecular'],
    pieza: 'quim-composicion',
    juega: {
      consigna: 'Elige un compuesto. La barra es su masa molar entera y cada tramo es lo que pesa un elemento: su porcentaje en masa.',
      voz: 'Compara el largo de cada tramo con cuántos átomos hay.',
      controles: [{ id: 'k', etiqueta: 'Compuesto', opciones: COMP.map(k => ({ valor: k, texto: k })) }],
      dibujo: v => ({ datos: { filas: [barra(v.k)] }, estado: {} }),
      lectura: v => [pct(v.k).map(([el, p]) => `${el} ${f(p, 1)} %`).join(' · ')],
      minimo: 3,
    },
    predice: {
      pregunta: 'En el metano, CH₄, hay 4 átomos de hidrógeno por cada átomo de carbono. ¿Qué porcentaje de su masa es hidrógeno?',
      voz: 'Piensa en lo que pesa cada átomo, no solo en cuántos hay.',
      opciones: [
        { id: 'c', texto: '25 %', correcta: true },
        { id: 'atomos', texto: '80 %', error: 'ES19', siFuera: 'El 80 % de los átomos son H, cierto. Pero un C pesa 12 veces más que un H.' },
        { id: 'carbono', texto: '75 %', error: 'QM-PORCENTAJE', siFuera: 'Ese 75 % es del carbono: 12 de los 16 g.' },
        { id: 'cuatro', texto: '4 %', error: 'QM-PORCENTAJE', siFuera: 'Eso toma 4 de 100. Hay que comparar 4 g con la masa molar, 16 g.' },
      ],
      dibujo: { datos: { filas: [{ titulo: 'CH₄: 16 g/mol', tramos: [{ valor: 100, texto: '¿?' }] }] }, estado: {} },
      revelar: { datos: { filas: [barra('CH₄'), { titulo: 'átomos de CH₄ (no es masa)', tramos: [{ valor: 1, texto: '1 C' }, { valor: 4, texto: '4 H: 80 % de los átomos', color: 'i' }] }] }, estado: {} },
      coincide: 'Coincide: 4 g de H en 16 g de metano.',
      noCoincide: 'El H aporta 4 g de los 16 g: el 25 % de la masa.',
    },
    mira: {
      datos: { filas: [
        { titulo: '100 g de un azúcar', tramos: [{ valor: 40, texto: 'C 40 g', color: undefined }, { valor: 6.7, texto: 'H 6,7 g', color: 'i' }, { valor: 53.3, texto: 'O 53,3 g', color: 'h' }], desde: 1 },
        { titulo: 'en moles', tramos: [{ valor: 40 / 12, texto: `C ${f(40 / 12)}` }, { valor: 6.7 / 1, texto: `H ${f(6.7)}`, color: 'i' }, { valor: 53.3 / 16, texto: `O ${f(53.3 / 16)}`, color: 'h' }], desde: 2 },
        { titulo: 'entre el menor', tramos: [{ valor: 1, texto: 'C 1' }, { valor: 2, texto: 'H 2', color: 'i' }, { valor: 1, texto: 'O 1', color: 'h' }], desde: 3 },
      ] },
      voz: 'Sigamos la receta con un azúcar de 180 g/mol.',
      pasos: [
        { estado: { corte: 1 }, texto: 'En 100 g, los porcentajes se leen como gramos.', ecuacion: ['C 40 g · H 6,7 g · O 53,3 g'] },
        { estado: { corte: 2 }, texto: 'Cada masa se divide entre su masa atómica: moles.', ecuacion: [`40/12 = ${f(40 / 12)} · 6,7/1 = 6,7 · 53,3/16 = ${f(53.3 / 16)}`] },
        { estado: { corte: 3 }, texto: 'Se divide entre el menor: la razón entera es 1 : 2 : 1.', ecuacion: ['fórmula empírica: CH₂O (30 g/mol)'] },
        { estado: { corte: 3 }, texto: 'Con 180 g/mol, la fórmula molecular es 6 veces la empírica.', ecuacion: ['180 / 30 = 6 → C₆H₁₂O₆'] },
      ],
    },
    regla: {
      texto: 'El porcentaje de un elemento es su masa en la fórmula entre la masa molar. La fórmula empírica sale de pasar gramos a moles y dividir entre el menor.',
      ecuacion: ['% = 100 · (átomos × masa atómica) / masa molar   ·   molecular = k × empírica'],
      condicion: 'para hallar la molecular hace falta la masa molar; k es un entero.',
      voz: 'Gramos, luego moles, luego la razón entera.',
    },
    ahoraTu: {
      pieza: 'quim-composicion',
      voz: 'Usa la masa de cada átomo, no solo cuántos hay.',
      generar(s) {
        const r = azar(s);
        if (s % 3 === 2) {
          const [emp, Me, k, mol] = r.de([['CH₂O', 30, 6, 'C₆H₁₂O₆'], ['CH', 13, 6, 'C₆H₆'], ['CH₂', 14, 4, 'C₄H₈'], ['NO₂', 46, 2, 'N₂O₄'], ['CH₂O', 30, 2, 'C₂H₄O₂'], ['P₂O₅', 142, 2, 'P₄O₁₀']]);
          return {
            pregunta: `Un compuesto tiene fórmula empírica ${emp} (${Me} g/mol) y masa molar ${Me * k} g/mol. ¿Cuál es su fórmula molecular?`,
            opciones: [
              { id: 'c', texto: mol, correcta: true },
              { id: 'emp', texto: emp, error: 'ES17', siFuera: 'Esa es la empírica; sería la molecular si las dos masas molares coincidieran.' },
              { id: 'doble', texto: `${emp} × ${k * 2}`, error: 'QM-FACTOR', siFuera: `El factor es masa molar entre masa empírica: ${Me * k} / ${Me} = ${k}.` },
            ],
            solucion: { texto: `${Me * k} / ${Me} = ${k}: se multiplican por ${k} todos los subíndices.`, ecuacion: [`${emp} × ${k} = ${mol}`] },
          };
        }
        const k = r.de(['H₂O', 'CO₂', 'NH₃', 'CH₄', 'CaCO₃', 'NaCl', 'H₂SO₄', 'C₂H₆O']), fo = FORM[k], [el, c] = r.de(fo);
        const M = masaMolar(k), p = 100 * MA[el] * c / M, atomos = 100 * c / fo.reduce((a, x) => a + x[1], 0);
        return {
          pregunta: `¿Qué porcentaje de la masa del ${k} (${f(M, 1)} g/mol) corresponde al ${el}? (${el} = ${f(MA[el], 1)})`,
          opciones: opciones(p, [
            { id: 'atomos', valor: atomos, error: 'ES19', siFuera: 'Ese es el porcentaje de átomos. En masa pesa cuánto pesa cada uno.' },
            { id: 'sin-sub', valor: 100 * MA[el] / M, error: 'ES18', siFuera: 'Eso cuenta un solo átomo; la fórmula tiene más.' },
            { id: 'resto', valor: 100 - p, error: 'QM-PORCENTAJE', siFuera: 'Ese es el resto: lo que pesan los otros elementos.' },
          ], x => `${f(x, 1)} %`),
          solucion: { texto: `${c} × ${f(MA[el], 1)} g de ${el} en ${f(M, 1)} g.`, ecuacion: [`100 · ${f(c * MA[el], 1)} / ${f(M, 1)} = ${f(p, 1)} %`], dibujo: { datos: { filas: [barra(k)] }, estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 5: leyes ponderales ----------
  // Cambia: la masa de agua que se forma · Permanece: la barra de masas a una sola escala · Progresa: de 9 g a 36 g,
  // con la razón O/H fija · Se reserva: CO y CO₂, dos compuestos de los mismos elementos · Debe verse: que la masa
  // de antes es la de después y que la razón no cambia.
  const agua = g => ({ titulo: `${g} g de agua`, tramos: [{ valor: g / 9, texto: `H ${f(g / 9, 0)} g`, color: 'i' }, { valor: 8 * g / 9, texto: `O ${f(8 * g / 9, 0)} g`, color: 'h' }] });
  const leyes = {
    id: 'leyes-ponderales',
    titulo: 'Lo que la balanza siempre cumple',
    temas: ['Leyes ponderales'],
    pieza: 'quim-composicion',
    juega: {
      consigna: 'Elige cuánta agua se forma. Las barras están a la misma escala. Compara el hidrógeno y el oxígeno de cada muestra.',
      voz: 'Divide el oxígeno entre el hidrógeno en cada caso.',
      controles: [{ id: 'g', etiqueta: 'Agua', min: 9, max: 36, paso: 9, inicio: 9, unidad: 'g', decimales: 0 }],
      dibujo: v => ({ datos: { escala: 'comun', filas: [agua(36), agua(v.g)].map((x, i) => Object.assign(x, { titulo: i ? x.titulo : '36 g de agua (para comparar)' })) }, estado: {} }),
      lectura: v => [`O : H = ${f(8 * v.g / 9, 0)} : ${f(v.g / 9, 0)} = 8 : 1`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Con 12 g de carbono, el CO lleva 16 g de oxígeno. En el CO₂, ¿cuánto oxígeno se une a los mismos 12 g de carbono?',
      voz: 'Son dos sustancias distintas hechas de lo mismo.',
      opciones: [
        { id: 'c', texto: '32 g', correcta: true },
        { id: 'igual', texto: '16 g, porque son los mismos elementos', error: 'QM-PROPORCION', siFuera: 'Sería así si fuera el mismo compuesto. CO₂ es otra sustancia, con otra razón.' },
        { id: 'molar', texto: '44 g', error: 'QM-PROPORCION', siFuera: 'Ese es todo el CO₂: carbono y oxígeno juntos.' },
        { id: 'medio', texto: '24 g', error: 'QM-PROPORCION', siFuera: 'Las masas de O guardan una razón de enteros pequeños con las del CO: 1 a 2.' },
      ],
      dibujo: { datos: { escala: 'comun', filas: [{ titulo: 'CO', tramos: [{ valor: 12, texto: 'C 12 g' }, { valor: 16, texto: 'O 16 g', color: 'h' }] }, { titulo: 'CO₂', tramos: [{ valor: 12, texto: 'C 12 g' }, { valor: 32, texto: '¿?' }] }] }, estado: {} },
      revelar: { datos: { escala: 'comun', filas: [{ titulo: 'CO', tramos: [{ valor: 12, texto: 'C 12 g' }, { valor: 16, texto: 'O 16 g', color: 'h' }] }, { titulo: 'CO₂', tramos: [{ valor: 12, texto: 'C 12 g' }, { valor: 32, texto: 'O 32 g', color: 'h' }] }] }, estado: {} },
      coincide: 'Coincide: 16 g y 32 g, razón 1 : 2. Ley de las proporciones múltiples.',
      noCoincide: 'En el CO₂ se unen 32 g: el doble que en el CO, razón 1 : 2.',
    },
    mira: {
      datos: { escala: 'comun', filas: [
        { titulo: 'antes: hidrógeno y oxígeno', tramos: [{ valor: 4, texto: 'H₂ 4 g', color: 'i' }, { valor: 32, texto: 'O₂ 32 g', color: 'h' }], desde: 1 },
        { titulo: 'después: agua', tramos: [{ valor: 36, texto: 'H₂O 36 g', color: 'o' }], desde: 2 },
        Object.assign(agua(36), { titulo: 'dentro del agua', desde: 3 }),
      ] },
      voz: 'Comparemos antes y después con la misma escala.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Antes: 4 g de hidrógeno y 32 g de oxígeno.', ecuacion: ['4 + 32 = 36 g'] },
        { estado: { corte: 2 }, texto: 'Después: 36 g de agua. La masa se conserva (Lavoisier).', ecuacion: ['36 g = 36 g'] },
        { estado: { corte: 3 }, texto: 'Dentro del agua, el O pesa siempre 8 veces el H (Proust).', ecuacion: ['32 : 4 = 8 : 1'] },
        { estado: { corte: 3 }, texto: 'En CO y CO₂, las masas de O van 1 : 2 (Dalton).' },
      ],
    },
    regla: {
      texto: 'En una reacción la masa total se conserva. Un compuesto tiene siempre la misma razón de masas. Si dos elementos forman varios compuestos, esas masas guardan razones de enteros pequeños.',
      ecuacion: ['masa antes = masa después   ·   agua: O : H = 8 : 1'],
      condicion: 'en un sistema cerrado y para sustancias puras; una mezcla puede tener cualquier proporción.',
      voz: 'Antes de calcular, revisa que la masa cuadre.',
    },
    ahoraTu: {
      pieza: 'quim-composicion',
      voz: 'Busca qué razón no cambia.',
      generar(s) {
        const r = azar(s), tipo = s % 3;
        if (tipo === 0) {
          const g = 9 * r.ent(2, 9), o = 8 * g / 9;
          return {
            pregunta: `El agua tiene siempre 8 g de oxígeno por cada 1 g de hidrógeno. ¿Cuántos gramos de oxígeno hay en ${g} g de agua?`,
            opciones: opciones(o, [
              { id: 'ocho', valor: 8 * g, error: 'QM-PROPORCION', siFuera: 'Eso multiplica toda el agua por 8; el 8 compara el O con el H, no con el agua.' },
              { id: 'mitad', valor: g / 2, error: 'QM-PROPORCION', siFuera: 'Eso reparte en partes iguales; la razón es 8 a 1.' },
              { id: 'h', valor: g / 9, error: 'QM-PROPORCION', siFuera: 'Eso es el hidrógeno: 1 de cada 9 partes.' },
            ], x => `${f(x, 1)} g`),
            solucion: { texto: 'De cada 9 g de agua, 8 g son de oxígeno.', ecuacion: [`${g} · 8/9 = ${f(o, 1)} g`], dibujo: { datos: { filas: [agua(g)] }, estado: {} } },
          };
        }
        if (tipo === 1) {
          const c = 3 * r.ent(1, 6), o2 = 8 * c / 3, co2 = c + o2;
          return {
            pregunta: `En un frasco cerrado se queman ${c} g de carbono con ${f(o2, 0)} g de oxígeno y no sobra nada. ¿Cuánto CO₂ se forma?`,
            opciones: opciones(co2, [
              { id: 'gas', valor: c, error: 'ES13', siFuera: 'El CO₂ también pesa: lleva el carbono y el oxígeno.' },
              { id: 'resta', valor: o2 - c, error: 'ES15', siFuera: 'En un frasco cerrado no se pierde masa; se suma.' },
              { id: 'o', valor: o2, error: 'ES15', siFuera: 'Ese es solo el oxígeno; el carbono también queda en el CO₂.' },
            ], x => `${f(x, 0)} g`),
            solucion: { texto: 'Sistema cerrado y sin sobrantes: masa antes = masa después.', ecuacion: [`${c} + ${f(o2, 0)} = ${f(co2, 0)} g`], dibujo: { datos: { escala: 'comun', filas: [{ titulo: 'antes', tramos: [{ valor: c, texto: `C ${c} g` }, { valor: o2, texto: `O₂ ${f(o2, 0)} g`, color: 'h' }] }, { titulo: 'después', tramos: [{ valor: co2, texto: `CO₂ ${f(co2, 0)} g`, color: 'o' }] }] }, estado: {} } },
          };
        }
        const [a, b, x1, x2, k] = r.de([['N₂O', 'NO', 28, 16, 2], ['NO', 'NO₂', 14, 16, 2], ['FeO', 'Fe₂O₃', 56, 16, 1.5], ['SO₂', 'SO₃', 32, 32, 1.5], ['CO', 'CO₂', 12, 16, 2]]);
        return {
          pregunta: `Para la misma masa del primer elemento, ¿en qué razón están las masas de oxígeno en ${a} y ${b}?`,
          opciones: opciones(k === 2 ? '1 : 2' : '2 : 3', [
            { id: 'igual', valor: '1 : 1', error: 'QM-PROPORCION', siFuera: 'Serían iguales si fueran el mismo compuesto.' },
            { id: 'otro', valor: k === 2 ? '2 : 3' : '1 : 2', error: 'QM-PROPORCION', siFuera: 'Cuenta los O por cada átomo del otro elemento en las dos fórmulas.' },
            { id: 'masas', valor: `${x1} : ${x2}`, error: 'QM-PROPORCION', siFuera: 'Esas son masas atómicas sueltas; compara el O unido a una masa fija.' },
          ], x => x),
          solucion: { texto: 'Se igualan los átomos del primer elemento y se comparan los O.', ecuacion: [`O en ${a} : O en ${b} = ${k === 2 ? '1 : 2' : '2 : 3'}`] },
        };
      },
    },
  };

  return {
    unidad: 'quimica.mol-y-composicion',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/quim-particulas.js', '/nucleo/kit/piezas/balanza.js', '/nucleo/kit/piezas/quim-fichas.js', '/nucleo/kit/piezas/quim-composicion.js'],
    historia: {
      texto: 'Contar partículas pesando exigió separar masa, número de entidades y cantidad de sustancia. En 1811, Avogadro propuso que volúmenes iguales de gases, en iguales condiciones, tienen el mismo número de moléculas; no midió el número que hoy lleva su nombre. Desde 2019, el mol se define fijando ese número: 6,02214076 × 10²³ entidades.',
      pregunta: '¿Cómo cuentas granos de arroz sin contarlos uno por uno?',
      fuente: { titulo: 'BIPM, unidad base mol', url: 'https://www.bipm.org/en/si-base-units/mole' },
    },
    ideas: [masaProm, mol, relaciones, composicion, leyes],
  };
});
