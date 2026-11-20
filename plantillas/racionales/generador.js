/*
 * Generador «El queque y la calculadora»: práctica de «Números racionales, fracciones y decimales»
 * (aritmetica.numeros-racionales; contenido/teoria/aritmetica/numeros-racionales.js), con tipos separados por idea.
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador (window.Generadores['racionales']) y en Node
 * (require). No usa ningún motor: las cuentas son fracciones de enteros y divisiones largas.
 *
 * Propuesta: docs/etapa8/propuesta-aritmetica.md §5 y §8 (Gerson delegó el criterio y la revisa después). Hilo, como en
 * la teoría: el queque de la promoción, el saco de arroz y la calculadora de doña Juana. Valores de problema, sin
 * fuente. Los tipos de examen que la teoría no tiene (irreductibles con parámetro, stock con cotas, formar fracciones…)
 * siguen en plantillas/fracciones-problemas.
 *
 * Tipos por idea (TIPOS_POR_IDEA; nivel 1 básico, 2 intermedio, 3 examen). generar(semilla, { idea }) da solo los de esa
 * idea; sin idea, las seis con el mismo peso. La unidad es una sola: { unidad } no cambia nada.
 *   equivalentes      falta (1) el término que falta · irreductible (1) · suma-terminos (3, San Marcos 2024-II) la
 *                     equivalente con una suma de términos · tres-cifras (3, San Marcos 2022) cuántas con denominador
 *                     de tres cifras
 *   orden-recta       mayor (1) cuál es mayor · clase (1) cuál es aparente · entre (3, San Marcos 2026-I) irreductibles
 *                     entre dos · precio (3, San Marcos 2027-I) la bolsa más barata por kilo
 *   del-resto         sumar (1) · queda (2) los kilos que quedan · atras (3, San Marcos 2019-I) hacia atrás · grifos (3)
 *   exacto-periodico  exacto (1) cuál termina · cifras (2) cifras de un exacto · factorial (3, San Marcos 2026-I) ·
 *                     lugar (3, San Marcos 2025-II) la cifra de un lugar lejano
 *   generatriz        puro (1) · mixto (2) · suma (2) de dos periódicos · porcentaje (3, San Marcos 2021)
 *   otras-bases       a-fraccion (1) 0,xy en base B · menor-base (2) · bloque (3) un bloque que se repite en base B ·
 *                     cuantas (3) en cuántas bases es exacta
 *
 * Notación (propuesta §6): a/b, la base con subíndice entre paréntesis (0,23₍₆₎), × para multiplicar y nunca «·»; los
 * periódicos con el bloque repetido y «…» (una o dos cifras, tres veces; más, dos), como en la teoría.
 * Colores: un color fijo por magnitud, el de la teoría (def.colores): numerador naranja, denominador turquesa, lo que se
 * busca violeta, el resto carmín. Una cantidad (kilos, horas) va en tinta. Sin verde.
 * Datos (docs/plan-calidad.md §3, punto 13): la definición, la fórmula general o la propiedad de cada tipo; nunca el
 * paso hecho ni la respuesta.
 * Errores: AR12 (documentado) y los códigos AT-* de la teoría (hipótesis de aula; tabla «Números racionales (19 nov)» de
 * docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md).
 * Cuentas comprobadas con un script aparte (casos.json, «verificacion») y con el recálculo de generador.test.js.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'racionales';
  const UNIDAD = 'aritmetica.numeros-racionales';
  const v = P.v;
  const f0 = x => P.formatear(x, 0);
  const mcd = (x, y) => (y ? mcd(y, x % y) : Math.abs(x));
  const mcm = (x, y) => x / mcd(x, y) * y;
  const red = (x, y) => { const g = mcd(x, y); return [x / g, y / g]; };
  const txt = (a, b) => (b === 1 ? String(a) : `${a}/${b}`);
  const fx = ([a, b]) => txt(a, b);
  const sumaF = (a, b, c, d) => red(a * d + b * c, b * d);
  const SUPD = '⁰¹²³⁴⁵⁶⁷⁸⁹', SUBD = '₀₁₂₃₄₅₆₇₈₉';
  const sup = x => [...String(x)].map(c => SUPD[c]).join('');
  const factores = x => { const o = []; for (let k = 2; x > 1; k++) { let e = 0; while (x % k === 0) { x /= k; e++; } if (e) o.push([k, e]); } return o; };
  const canon = N => factores(N).map(([p, e]) => (e > 1 ? `${p}${sup(e)}` : String(p))).join(' × ');
  const enB = (s, B) => `${s}₍${[...String(B)].map(c => SUBD[c]).join('')}₎`;
  // La división larga en base B: parte entera, cifras de antes del bloque y bloque (vacío si termina).
  function division(x, y, B = 10) {
    const ent = Math.floor(x / y); let r = x % y; const cif = [], visto = new Map();
    while (r && !visto.has(r)) { visto.set(r, cif.length); r *= B; cif.push(Math.floor(r / y)); r %= y; }
    if (!r) return { ent, ante: cif.join(''), per: '' };
    const i = visto.get(r); return { ent, ante: cif.slice(0, i).join(''), per: cif.slice(i).join('') };
  }
  const repite = per => per.repeat(per.length <= 2 ? 3 : 2);
  const decimal = (x, y, B = 10) => { const d = division(x, y, B); return d.per ? `${d.ent},${d.ante}${repite(d.per)}…` : d.ante ? `${d.ent},${d.ante}` : String(d.ent); };

  const Pv = x => v('f', typeof x === 'number' ? f0(x) : String(x));
  const VARS = { o: { nombre: 'el numerador: las partes que se toman', color: 'o' }, i: { nombre: 'el denominador: en cuántas partes se corta', color: 'i' },
    f: { nombre: 'lo que se busca', color: 'f' }, h: { nombre: 'el resto de la división', color: 'h' } };
  const h = (id, valor, explicacion, fmt = x => String(x)) =>
    (valor === undefined || valor === null || (typeof valor === 'number' && (!Number.isFinite(valor) || valor < 0)) ? null
      : { id, clave: String(fmt(valor)), texto: String(fmt(valor)), explicacion, respaldo: id === 'AR12' ? 'documentado' : 'hipotesis', fuente: null });

  const D = {
    eq: 'Multiplicar o dividir el numerador y el denominador por el mismo número no cambia la fracción',
    cruz: 'a/b = c/d cuando a × d = b × c (los productos en cruz son iguales)',
    irr: 'Una fracción es irreductible si su numerador y su denominador no tienen un divisor común mayor que 1',
    mcd: 'Dividiendo el numerador y el denominador entre su MCD queda la fracción irreductible',
    k: 'Las fracciones equivalentes a a/b, irreductible, son (a × k)/(b × k), con k = 1, 2, 3…',
    cifras3: 'Los números de tres cifras van del 100 al 999',
    cuantos: 'Del primero, p, al último, u, hay u − p + 1 números',
    comparar: 'a/b < c/d cuando a × d < b × c, con b y d positivos (en cruz)',
    clases: 'Propia: numerador menor que el denominador. Impropia: mayor. Aparente: el numerador es múltiplo del denominador',
    comun: 'Para sumar fracciones, se escriben con un mismo denominador (el MCM) y se suman los numeradores',
    precio: 'Precio por kilo: el precio ÷ los kilos',
    queda: 'Si de un total se vende a/b, queda 1 − a/b del total',
    resto: 'Vender c/d de lo que queda es vender c/d × lo que quedaba',
    deUna: 'a/b de una cantidad N es N × a ÷ b',
    hora: 'Si un grifo llena el tanque en A horas, en una hora llena 1/A del tanque',
    desague: 'Un desagüe que vacía el tanque en C horas saca 1/C del tanque en cada hora',
    exacto: 'Una fracción irreductible da decimal exacto si su denominador solo tiene los primos 2 y 5',
    otro: 'Si el denominador, ya simplificado, tiene otro primo, un bloque de cifras se repite sin fin',
    cifras: 'Si el denominador solo tiene los primos 2 y 5, las cifras decimales son su mayor exponente',
    antes: 'Cifras no periódicas, entre la coma y el bloque: el mayor exponente de 2 o 5 del denominador',
    fact: 'El factorial es el producto de los enteros desde 1: 5! = 1 × 2 × 3 × 4 × 5',
    lugar: 'En un bloque de L cifras, cada lugar repite al del resto de dividirlo entre L; con resto 0, el último',
    puro: 'Sin cifras antes del bloque: x = el bloque ÷ tantos 9 como cifras tiene el bloque',
    mixtoG: 'Con cifras antes del bloque: x = (todo hasta el bloque − lo de antes) ÷ (nueves del bloque y ceros de antes)',
    por: '1 % es 1/100',
    exactaB: 'Una fracción irreductible es exacta en base B si cada primo de su denominador divide a B',
    lugaresB: 'En base B, la primera cifra después de la coma vale cifra/B, y la segunda, cifra/B²',
    bloqueB: 'En base B, un bloque de dos cifras que se repite desde la coma vale (primera × B + segunda)/(B² − 1)',
  };

  const TIPOS_POR_IDEA = {
    equivalentes: ['falta', 'irreductible', 'suma-terminos', 'tres-cifras'],
    'orden-recta': ['mayor', 'clase', 'entre', 'precio'],
    'del-resto': ['sumar', 'queda', 'atras', 'grifos'],
    'exacto-periodico': ['exacto', 'cifras', 'factorial', 'lugar'],
    generatriz: ['puro', 'mixto-g', 'suma-p', 'porcentaje'],
    'otras-bases': ['a-fraccion', 'menor-base', 'bloque', 'cuantas'],
  };
  const IDEAS = Object.keys(TIPOS_POR_IDEA);
  const IDEA_DE = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map(t => [t, i])));
  const TIPOS_POR_UNIDAD = { [UNIDAD]: IDEAS.flatMap(i => TIPOS_POR_IDEA[i]) };
  const NIVEL = { falta: 1, irreductible: 1, 'suma-terminos': 3, 'tres-cifras': 3, mayor: 1, clase: 1, entre: 3, precio: 3,
    sumar: 1, queda: 2, atras: 3, grifos: 3, exacto: 1, cifras: 2, factorial: 3, lugar: 3, puro: 1, 'mixto-g': 2, 'suma-p': 2, porcentaje: 3,
    'a-fraccion': 1, 'menor-base': 2, bloque: 3, cuantas: 3 };
  // Papel (regla 6; herramientas/papel-generador.js usa «papel-1» a «papel-8» y rotula 3 básicos, 3 intermedios y 2
  // avanzados): una pregunta de cada idea, y las dos de examen son de San Marcos (2019-I y 2021).
  const PAPEL = { 'papel-1': 'falta', 'papel-2': 'mayor', 'papel-3': 'exacto', 'papel-4': 'queda',
    'papel-5': 'mixto-g', 'papel-6': 'menor-base', 'papel-7': 'atras', 'papel-8': 'porcentaje' };

  function generar(semilla, opciones) {
    const o = typeof opciones === 'string' ? { unidad: opciones } : opciones || {};
    const rng = Azar.crear(ID + '|' + semilla);
    const forzado = !o.idea && PAPEL[String(semilla)];
    let tipo;
    if (forzado) tipo = forzado;
    else { const idea = TIPOS_POR_IDEA[o.idea] ? o.idea : rng.elegir(IDEAS); tipo = rng.elegir(TIPOS_POR_IDEA[idea]); }
    for (let intento = 0; intento < 2000; intento++) {
      const pr = CONSTRUIR[tipo](rng);
      const p = pr && cerrar(semilla, tipo, pr, rng);
      if (p) return p;
    }
    throw new Error(`No se pudo generar un problema de ${tipo} con 4 alternativas distintas`);
  }
  function cerrar(semilla, tipo, o, rng) {
    const fmt = o.fmt || (x => String(x)), ct = String(fmt(o.correcta));
    const errores = o.errores.filter(e => e && e.clave !== ct);
    let alternativas;
    try { alternativas = P.armarTexto({ correcta: { clave: ct, texto: ct }, errores, rng, total: 4 }); } catch (e) { return null; }
    if (alternativas.length < 4) return null;
    const usadas = new Set();
    for (const linea of [o.enunciado, o.pregunta, ...o.solucion]) for (const x of linea) if (x && typeof x === 'object') usadas.add(x.v);
    return {
      id: `${ID}#${semilla}`, unidadCatalogo: UNIDAD, variables: Object.fromEntries([...usadas].map(k => [k, VARS[k]])),
      enunciado: o.enunciado, pregunta: o.pregunta, datos: o.datos, alternativas, solucion: o.solucion,
      respuesta: { valor: ct, texto: ct, unidad: '' },
      _datos: Object.assign({ idea: IDEA_DE[tipo], tipo, nivel: NIVEL[tipo] }, o._datos),
    };
  }
  const PROPIAS = []; for (let b = 2; b <= 9; b++) for (let a = 1; a < b; a++) if (mcd(a, b) === 1) PROPIAS.push([a, b]);
  const FR6 = PROPIAS.filter(([, b]) => b <= 6);

  // ======================= Idea 1: fracciones equivalentes =======================
  function falta(rng) {
    const [a, b] = rng.elegir(PROPIAS), k = rng.entero(2, 9);
    return {
      enunciado: [`En ${a}/${b} = □/${b * k}, el recuadro es un número entero.`], pregunta: ['¿Qué número va en el recuadro?'],
      datos: [D.eq, D.cruz], correcta: a * k,
      errores: [
        h('AT-SUMA-AMBOS', a + b * k - b, 'Ver que el denominador creció está bien, pero creció por multiplicación: arriba también se multiplica.'),
        h('AT-SOLO-ABAJO', a, `Si abajo se multiplicó por ${k}, arriba también: dejar el ${a} cambia la parte.`),
        h('AT-FACTOR', k, `Bien: se multiplica por ${k}. Pero arriba va ${a} × ${k}.`),
      ],
      solucion: [[`De ${b} a ${b * k} se multiplica por ${k}; arriba también: ${a} × ${k} = `, Pv(a * k), '.']],
      _datos: { a, b, k },
    };
  }
  function irreductible(rng) {
    const [a, b] = rng.elegir(PROPIAS), g = rng.elegir([4, 6, 8, 9, 10, 12, 14, 15, 18]), N = a * g, Dd = b * g;
    if (Dd > 160) return null;
    const s = factores(g)[0][0];
    return {
      enunciado: [`La fracción ${N}/${Dd} se quiere escribir lo más simple posible.`], pregunta: ['¿Cuál es su fracción irreductible?'],
      datos: [D.irr, D.mcd], correcta: txt(a, b),
      errores: [
        h('AT-NO-MCD', txt(N / s, Dd / s), `Dividir entre ${s} está bien, pero todavía se puede simplificar.`),
        h('AT-INVERTIR', txt(b, a), `Simplificar está bien, pero quedó al revés: el ${a} va arriba.`),
        h('AT-SOLO-ARRIBA', txt(a, Dd), `Dividir el ${N} está bien, pero abajo también: si no, cambia la parte.`),
      ],
      solucion: [[`MCD(${N}, ${Dd}) = ${g}: arriba y abajo entre ${g}.`], ['Queda ', Pv(txt(a, b)), '.']],
      _datos: { N, D: Dd },
    };
  }
  function sumaTerminos(rng) {
    const [a, b] = rng.elegir(PROPIAS), k = rng.entero(3, 12), S = (a + b) * k;
    if (S > 200) return null;
    return {
      enunciado: [`Una fracción equivalente a ${a}/${b} tiene numerador y denominador que suman ${S}.`], pregunta: ['¿Cuál es su denominador?'],
      datos: [D.k], correcta: b * k,
      errores: [
        h('AT-RESPONDE-OTRA', a * k, `${a * k} es el numerador; se pide el denominador.`),
        h('AT-FACTOR', k, `Bien: se multiplica por ${k}. Pero el denominador es ${b} × ${k}.`),
        h('AT-RESTA-TERMINO', S - b, `Quitarle ${b} a ${S} no reparte la suma: el numerador también creció.`),
      ],
      solucion: [[`Los términos suman (${a} + ${b}) × k = ${S}, así que k = ${k}.`], [`Denominador: ${b} × ${k} = `, Pv(b * k), '.']],
      _datos: { a, b, S },
    };
  }
  function tresCifras(rng) {
    const [a, b] = rng.elegir(PROPIAS.filter(([, y]) => y >= 3));
    const lo = Math.ceil(100 / b), hi = Math.floor(999 / b), C = hi - lo + 1;
    return {
      enunciado: [`Se escriben todas las fracciones equivalentes a ${a}/${b}.`], pregunta: ['¿Cuántas tienen denominador de tres cifras?'],
      datos: [D.k, D.cifras3, D.cuantos], correcta: C,
      errores: [
        h('AT-CONTEO-SIN-QUITAR', hi, `Bien el último k, ${hi}. Pero con k menor que ${lo} el denominador no tiene tres cifras.`),
        h('AT-SIN-MAS-UNO', C - 1, `k va de ${lo} a ${hi}: son ${hi} − ${lo} + 1, los dos extremos cuentan.`),
        h('AT-RESPONDE-OTRA', Math.floor(999 / a) - Math.ceil(100 / a) + 1, 'Así se cuentan las de numerador de tres cifras.'),
      ],
      solucion: [[`El denominador es ${b} × k, de ${b * lo} a ${b * hi}: k va de ${lo} a ${hi}.`], [`${hi} − ${lo} + 1 = `, Pv(C), '.']],
      _datos: { a, b },
    };
  }

  // ======================= Idea 2: comparar fracciones =======================
  function mayor(rng) {
    const x = rng.elegir(PROPIAS.filter(([, b]) => b >= 3)), y = rng.elegir(PROPIAS.filter(([, b]) => b >= 3));
    const [a, b] = x, [c, d] = y;
    if (b === d || a === c || a * d === b * c) return null;
    const M = a * d > b * c ? x : y, m = M === x ? y : x;
    if (!(m[0] > M[0] || m[1] < M[1])) return null;
    return {
      enunciado: [`Dos queques iguales: de uno se vendió ${a}/${b} y del otro, ${c}/${d}.`], pregunta: ['¿Cuál fracción es mayor?'],
      datos: [D.comparar], correcta: fx(M),
      errores: [
        h(m[0] > M[0] ? 'AT-NUMERADOR' : 'AT-PORCION', fx(m), m[0] > M[0] ? 'Tiene el numerador mayor, pero sus porciones son más chicas.' : 'Sus porciones son más grandes, pero toma menos.'),
        h('AT-DIFERENCIA', 'Son iguales', `En cruz no dan lo mismo: ${a * d} y ${b * c}.`),
        h('AT-DISTINTOS', 'No se pueden comparar', 'Con denominadores distintos sí se comparan: en cruz.'),
      ],
      solucion: [[`En cruz: ${a} × ${d} = ${a * d} y ${b} × ${c} = ${b * c}.`], ['Es mayor ', Pv(fx(M)), '.']],
      _datos: { a, b, c, d },
    };
  }
  function clase(rng) {
    const b = rng.entero(3, 9), q = rng.entero(2, 4), p1 = rng.entero(1, b - 1), r = rng.entero(1, b - 1);
    const aparente = [q * b, b], impropia = [q * b + r, b], propia = [p1, b], otra = [b + rng.entero(1, b - 1), b];
    if (mcd(...impropia) !== 1 || fx(otra) === fx(impropia)) return null;
    const t = ([x, y]) => `${x}/${y}`;
    return {
      enunciado: [`En la feria se anotaron cuatro fracciones de queque: ${rng.barajar([propia, aparente, impropia, otra]).map(t).join(', ')}.`], pregunta: ['¿Cuál de ellas es aparente?'],
      datos: [D.clases], correcta: t(aparente),
      errores: [
        h('AT-APARENTE', t(impropia), `Pasa de 1, pero ${impropia[0]} no es múltiplo de ${b}: no da un entero justo.`),
        h('AT-CLASE', t(propia), `${p1}/${b} es menor que 1: es propia.`),
        h('AT-APARENTE', t(otra), `Pasa de 1, pero ${otra[0]} no es múltiplo de ${b}: es impropia.`),
      ],
      solucion: [[`${q * b} ÷ ${b} = ${q}: es un entero escrito como fracción.`], ['Aparente: ', Pv(t(aparente)), '.']],
      _datos: { b, q, p1, r, otra: otra[0] },
    };
  }
  function entre(rng) {
    const N = rng.elegir([12, 18, 20, 24, 30, 36, 40]), ds = [2, 3, 4, 5, 6, 8, 9, 10].filter(x => N % x === 0);
    const q = rng.elegir(ds), s = rng.elegir(ds), p = rng.entero(1, q - 1), u = rng.entero(1, s - 1);
    if (mcd(p, q) !== 1 || mcd(u, s) !== 1 || p * s >= u * q) return null;
    const lo = p * N / q, hi = u * N / s;
    if (hi - lo < 4) return null;
    let irr = 0, todas = 0, uno = 0; const p0 = factores(N)[0][0];
    for (let k = lo + 1; k < hi; k++) { todas++; if (mcd(k, N) === 1) irr++; if (k % p0 !== 0) uno++; }
    if (!irr || uno === irr) return null;
    return {
      enunciado: [`Se buscan fracciones irreductibles de denominador ${N} mayores que ${p}/${q} y menores que ${u}/${s}.`], pregunta: ['¿Cuántas hay?'],
      datos: [D.irr, D.comun.replace('Para sumar fracciones, se', 'Dos fracciones se').replace(' y se suman los numeradores', '')], correcta: irr,
      errores: [
        h('AT-ENTRE-TODAS', todas, 'Varias de esas se simplifican: no son irreductibles.'),
        h('AT-ENTRE-EXTREMOS', todas + 2, 'Los extremos no están entre ellos, y además se simplifican.'),
        h('AT-UN-PRIMO', uno, `Quitar los múltiplos de ${p0} está bien, pero ${N} = ${canon(N)}: faltan otros primos.`),
      ],
      solucion: [[`${p}/${q} = ${lo}/${N} y ${u}/${s} = ${hi}/${N}: el numerador va de ${lo + 1} a ${hi - 1}.`], ['Sin primos comunes con ', String(N), ': ', Pv(irr), '.']],
      _datos: { N, p, q, u, s },
    };
  }
  function precio(rng) {
    const k1 = rng.entero(2, 6), k2 = rng.entero(2, 9), P1 = rng.entero(5, 40), P2 = rng.entero(5, 60);
    if (k1 === k2 || P1 * k2 === P2 * k1) return null;
    const A = P1 * k2 < P2 * k1;
    // La trampa cuesta menos en total, de verdad (con el mismo precio, la explicación mentía; auditoría, 20 nov).
    if (P1 === P2 || (P1 < P2) === A || Math.abs(P1 / k1 - P2 / k2) > 1.5) return null;
    const ta = `La de ${k1} kg`, tb = `La de ${k2} kg`;
    return {
      enunciado: [`Una bolsa de arroz de ${k1} kg cuesta S/ ${P1} y otra de ${k2} kg cuesta S/ ${P2}.`], pregunta: ['¿Cuál sale más barata por kilo?'],
      datos: [D.precio, D.comparar], correcta: A ? ta : tb,
      errores: [
        h('AT-TOTAL', A ? tb : ta, 'Cuesta menos en total, pero lleva menos kilos: por kilo sale más cara.'),
        h('AT-DIFERENCIA', 'Las dos igual', `En cruz: ${P1 * k2} y ${P2 * k1}, no son iguales.`),
        h('AT-DISTINTOS', 'No se puede saber', `Se comparan ${P1}/${k1} y ${P2}/${k2}, en cruz.`),
      ],
      solucion: [[`Por kilo: ${P1}/${k1} y ${P2}/${k2}. En cruz: ${P1} × ${k2} = ${P1 * k2} y ${P2} × ${k1} = ${P2 * k1}.`], ['Más barata: ', Pv(A ? ta : tb), '.']],
      _datos: { k1, P1, k2, P2 },
    };
  }

  // ======================= Idea 3: partes del total y del resto =======================
  function sumar(rng) {
    const [a, b] = rng.elegir(FR6), [c, d] = rng.elegir(FR6);
    if (b === d || b % d === 0 || d % b === 0) return null;
    const S = sumaF(a, b, c, d);
    return {
      enunciado: [`En la mañana se vendió ${a}/${b} del queque y en la tarde, ${c}/${d} del mismo queque.`], pregunta: ['¿Qué parte del queque se vendió?'],
      datos: [D.comun], correcta: fx(S),
      errores: [
        h('AR12', txt(a + c, b + d), 'Arriba con arriba y abajo con abajo no se suma: las porciones son distintas.'),
        h('AT-SUMA-ARRIBA', fx(red(a + c, b * d)), `Bien el denominador ${b * d}. Pero los numeradores también cambian.`),
        h('AT-PRODUCTO-FR', fx(red(a * c, b * d)), 'Eso es multiplicarlas; aquí se juntan las dos partes.'),
      ],
      solucion: [[`Con ${mcm(b, d)} abajo: ${a * mcm(b, d) / b}/${mcm(b, d)} + ${c * mcm(b, d) / d}/${mcm(b, d)}.`], ['Se vendió ', Pv(fx(S)), '.']],
      _datos: { a, b, c, d },
    };
  }
  function queda(rng) {
    const [a, b] = rng.elegir(FR6), [c, d] = rng.elegir(FR6), N = b * d * rng.entero(1, 4);
    if (N < 24 || N > 150) return null;
    const q1 = N - N * a / b, Q = q1 - q1 * c / d;
    const kg = x => `${f0(x)} kg`;
    return {
      enunciado: [`Doña Juana tiene un saco de ${N} kg de arroz. Vende ${a}/${b} del saco y después ${c}/${d} de lo que le quedó.`], pregunta: ['¿Cuántos kilos le quedan?'],
      datos: [D.deUna, D.queda, D.resto], correcta: Q, fmt: kg,
      errores: [
        h('AT-RESTO-TOTAL', N - N * a / b - N * c / d, `Los ${c}/${d} son de los ${q1} kg que quedaron, no de ${N}.`, kg),
        h('AT-RESPONDE-OTRA', q1 * c / d, 'Esos son los kilos que vende después; se pide lo que queda.', kg),
        h('AT-DESHACE-UNA', q1, `Falta la segunda venta: ${c}/${d} de ${q1} kg.`, kg),
      ],
      solucion: [[`Quedan ${N} − ${N * a / b} = ${q1} kg.`], [`Vende ${q1 * c / d} kg: quedan `, Pv(kg(Q)), '.']],
      _datos: { N, a, b, c, d },
    };
  }
  function atras(rng) {
    const [a, b] = rng.elegir(FR6), [c, d] = rng.elegir(FR6), N = b * d * rng.entero(2, 6), Q = N * (b - a) * (d - c) / (b * d);
    if (N > 240) return null;
    const den = b * d - a * d - c * b, tot = den > 0 ? Q * b * d / den : null, tarde = Q * d / (d - c);
    return {
      enunciado: [`Un panadero vendió ${a}/${b} de sus panes y después ${c}/${d} de los que le quedaban. Le quedaron ${Q} panes.`], pregunta: ['¿Cuántos panes tenía?'],
      datos: [D.queda, D.resto], correcta: N,
      errores: [
        h('AT-RESTO-TOTAL', Number.isInteger(tot) && tot > 0 ? tot : null, `${c}/${d} es de lo que quedaba, no del total.`),
        h('AT-DESHACE-UNA', Number.isInteger(tarde) ? tarde : null, `Antes de la segunda venta tenía ${tarde}; falta deshacer la primera.`),
        h('AT-RESPONDE-OTRA', 2 * Q, 'Duplicar lo que quedó no deshace las ventas.'),
      ],
      solucion: [[`Queda ${b - a}/${b} y luego ${d - c}/${d} de eso: ${fx(red((b - a) * (d - c), b * d))} de los panes.`], ['Tenía ', Pv(N), ' panes.']],
      _datos: { a, b, c, d, Q },
    };
  }
  function grifos(rng) {
    const A = rng.entero(2, 12), B = rng.entero(A + 1, 15), C = rng.entero(B + 1, 30);
    const inv = red(B * C + A * C - A * B, A * B * C);
    if (inv[0] <= 0 || inv[0] !== 1 || inv[1] > 30) return null;
    const T = inv[1], hs = ([n, m]) => `${txt(n, m)} h`;
    return {
      enunciado: [`Un grifo llena un tanque en ${A} h y otro en ${B} h; un desagüe lo vacía en ${C} h. El tanque está vacío y se abren los tres.`],
      pregunta: ['¿En cuánto tiempo se llena?'],
      datos: [D.hora, D.desague, D.comun], correcta: `${T} h`,
      errores: [
        h('AT-SUMA-DESAGUE', hs(red(A * B * C, B * C + A * C + A * B)), `El desagüe saca: 1/${C} se resta, no se suma.`),
        h('AT-OLVIDA-DESAGUE', hs(red(A * B, A + B)), 'Ese es el tiempo con el desagüe cerrado.'),
        h('AT-INVIERTE-TIEMPO', `1/${T} h`, `1/${T} es lo que se llena en una hora; el tiempo es ${T} h.`),
      ],
      solucion: [[`En una hora: 1/${A} + 1/${B} − 1/${C} = 1/${T} del tanque.`], ['Se llena en ', Pv(`${T} h`), '.']],
      _datos: { A, B, C },
    };
  }

  // ======================= Idea 4: decimal exacto o periódico =======================
  function exacto(rng) {
    const e = rng.elegir([4, 8, 16, 20, 25, 40, 50, 80, 125]), a = rng.entero(1, e - 1);
    if (mcd(a, e) !== 1) return null;
    const p = rng.elegir([3, 7]), trampa = rng.entero(0, 1) === 1, buena = trampa ? [a * p, e * p] : [a, e];
    const par = [rng.entero(1, 11), 2 ** rng.entero(1, 3) * rng.elegir([3, 7, 9])], cinco = [rng.entero(1, 11), 5 * rng.elegir([3, 7, 9])], dyc = [rng.entero(1, 13), 10 * rng.elegir([3, 7])];
    for (const x of [par, cinco, dyc]) if (mcd(x[0], x[1]) !== 1 || x[0] >= x[1]) return null;
    return {
      // La lista, barajada: antes la exacta iba siempre primera (auditoría, 20 nov).
      enunciado: [`Doña Juana divide en su cuaderno ${rng.barajar([buena, par, cinco, dyc]).map(fx).join(', ')}.`], pregunta: ['¿Cuál de esas fracciones da un decimal exacto?'],
      datos: [D.exacto, D.otro], correcta: `${buena[0]}/${buena[1]}`,
      errores: [
        h('AT-PAR', fx(par), `Un denominador par no basta: ${par[1]} = ${canon(par[1])}.`),
        h('AT-CINCO', fx(cinco), `Un 5 no basta: ${cinco[1]} = ${canon(cinco[1])}.`),
        h('AT-DOSYCINCO', fx(dyc), `Tiene el 2 y el 5, pero ${dyc[1]} = ${canon(dyc[1])}.`),
      ],
      solucion: [[trampa ? `${buena[0]}/${buena[1]} = ${a}/${e} y ${e} = ${canon(e)}.` : `${e} = ${canon(e)}: solo primos 2 y 5.`], ['Exacta: ', Pv(`${buena[0]}/${buena[1]}`), ` = ${decimal(a, e)}.`]],
      _datos: { buena, par, cinco, dyc },
    };
  }
  function cifras(rng) {
    const m = rng.entero(0, 5), n = rng.entero(0, 4), Dd = 2 ** m * 5 ** n, a = rng.entero(1, 9);
    if (m === n || m + n < 2 || mcd(a, Dd) !== 1 || Dd > 2000) return null;
    return {
      enunciado: [`La calculadora de doña Juana divide ${a} ÷ ${Dd}.`], pregunta: ['¿Cuántas cifras tiene el decimal después de la coma?'],
      datos: [D.exacto, D.cifras], correcta: Math.max(m, n),
      errores: [
        h('AT-SUMA-EXP', m + n, `${Dd} = ${canon(Dd)}: va el mayor exponente, no la suma.`),
        h('AT-MENOR-EXP', Math.min(m, n), 'Hacen falta tantas cifras como el mayor exponente.'),
        h('AT-CIFRAS-DEN', String(Dd).length, 'Las cifras del denominador no deciden; deciden sus primos.'),
      ],
      solucion: [[`${Dd} = ${canon(Dd)}: el mayor exponente es ${Math.max(m, n)}.`], [`${a}/${Dd} = ${decimal(a, Dd)}: `, Pv(Math.max(m, n)), ' cifras.']],
      _datos: { a, D: Dd },
    };
  }
  function factorial(rng) {
    const k = rng.entero(5, 10), a = rng.elegir([1, 11, 13, 17, 19, 23]);
    let F = 1; for (let i = 2; i <= k; i++) F *= i;
    const ex = (N, p) => { let e = 0; while (N % p === 0) { N /= p; e++; } return e; }, e2 = ex(F, 2), e5 = ex(F, 5);
    return {
      enunciado: [`Se divide ${a} entre ${k}!, el factorial de ${k}.`], pregunta: ['¿Cuántas cifras no periódicas tiene el decimal?'],
      datos: [D.fact, D.antes], correcta: e2,
      errores: [
        h('AT-SUMA-EXP', e2 + e5, 'Va el mayor exponente de 2 o de 5, no la suma.'),
        h('AT-MENOR-EXP', e5, `El exponente del 2, ${e2}, es mayor que el del 5.`),
        h('AT-FACT-K', k, `${k}! no da ${k} cifras: cuentan los exponentes del 2 y del 5.`),
      ],
      solucion: [[`${k}! = ${F} = ${canon(F)}.`], ['El mayor exponente de 2 o 5 es ', Pv(e2), '.']],
      _datos: { a, k },
    };
  }
  function lugar(rng) {
    const q = rng.elegir([7, 13]), a = rng.entero(1, q - 1), n = rng.entero(40, 130);
    const per = division(a, q).per, L = per.length, i = (n - 1) % L;
    const op = [per[i], per[(i + 1) % L], per[(i + L - 1) % L], per[0]];
    if (new Set(op).size < 4) return null;
    return {
      enunciado: [`El decimal de ${a}/${q} es ${decimal(a, q)}`], pregunta: [`¿Qué cifra ocupa el lugar ${n} después de la coma?`],
      datos: [D.lugar], correcta: per[i],
      errores: [
        h('AT-CORRIDO', op[1], 'Te corriste un lugar hacia adelante.'),
        h('AT-CORRIDO', op[2], 'Te corriste un lugar hacia atrás.'),
        h('AT-PRIMERA-CIFRA', op[3], 'Esa es la primera cifra del bloque.'),
      ],
      solucion: [[`El bloque ${per} tiene ${L} cifras; ${n} = ${L} × ${Math.floor((n - 1) / L)} + ${i + 1}.`], [`El lugar ${i + 1} del bloque: `, Pv(per[i]), '.']],
      _datos: { a, q, n },
    };
  }

  // ======================= Idea 5: la fracción generatriz =======================
  const gen = (ante, per) => red(Number(ante + per) - Number(ante || '0'), Number('9'.repeat(per.length) + '0'.repeat(ante.length)));
  const escr = (ante, per) => `0,${ante}${repite(per)}…`;
  function puro(rng) {
    const L = rng.entero(1, 3), per = String(rng.entero(L === 1 ? 1 : 10 ** (L - 1), 10 ** L - 2)).padStart(L, '0');
    if (L > 1 && /^(\d)\1+$/.test(per)) return null;
    return {
      enunciado: [`x = ${escr('', per)}, con el bloque ${per} que se repite sin fin.`], pregunta: ['¿Qué fracción irreductible es x?'],
      datos: [D.puro, D.mcd], correcta: fx(gen('', per)),
      errores: [
        h('AT-CORTAR', fx(red(Number(per), 10 ** L)), 'Esa fracción termina; el bloque sigue sin fin.'),
        h('AT-MIXTO', fx(red(Number(per), Number('9'.repeat(Math.max(1, L - 1)) + '0'))), 'El 0 abajo es para cifras antes del bloque; aquí no hay.'),
        h('AT-NUEVES', fx(red(Number(per), L > 1 ? 9 : 99)), `Va un 9 por cada cifra del bloque: ${'9'.repeat(L)}.`),
      ],
      solucion: [[`${per}/${'9'.repeat(L)}, simplificada.`], ['x = ', Pv(fx(gen('', per))), '.']],
      _datos: { per },
    };
  }
  function mixtoG(rng) {
    const ante = String(rng.entero(1, 9)), L = rng.entero(1, 2), per = String(rng.entero(L === 1 ? 1 : 10, L === 1 ? 8 : 98));
    if ((L === 2 && per[0] === per[1]) || per.endsWith(ante)) return null;
    const G = gen(ante, per), n = Number(ante + per) - Number(ante), d = Number('9'.repeat(L) + '0');
    return {
      enunciado: [`x = ${escr(ante, per)}: el ${ante} no se repite y el bloque ${per} sí.`], pregunta: ['¿Qué fracción irreductible es x?'],
      datos: [D.mixtoG, D.mcd], correcta: fx(G),
      errores: [
        h('AT-MIXTO-COMO-PURO', fx(red(Number(ante + per), Number('9'.repeat(L + 1)))), `El ${ante} no se repite: se resta y lleva un 0 abajo.`),
        h('AT-SIN-CERO', fx(red(n, Number('9'.repeat(L)))), `La cifra de antes pone un 0 abajo: ${d}.`),
        h('AT-CORTAR', fx(red(Number(ante + per), 10 ** (L + 1))), 'Esa fracción termina; el bloque sigue sin fin.'),
      ],
      solucion: [[`(${ante}${per} − ${ante})/${d} = ${n}/${d}.`], ['Simplificada: ', Pv(fx(G)), '.']],
      _datos: { ante, per },
    };
  }
  function sumaP(rng) {
    const p1 = rng.entero(1, 8), per2 = String(rng.entero(10, 98));
    if (per2[0] === per2[1]) return null;
    const A = red(p1, 9), B = red(Number(per2), 99), S = sumaF(...A, ...B);
    return {
      enunciado: [`Se suman ${escr('', String(p1))} y ${escr('', per2)}.`], pregunta: ['¿Qué fracción irreductible da la suma?'],
      datos: [D.puro, D.comun], correcta: fx(S),
      errores: [
        h('AT-CORTAR', fx(red(10 * p1 + Number(per2), 100)), 'Cortando las colas sale un decimal que termina.'),
        h('AR12', txt(A[0] + B[0], A[1] + B[1]), 'Las generatrices se suman con un mismo denominador, no arriba con arriba.'),
        h('AT-MIXTO', fx(sumaF(...A, ...red(Number(per2), 90))), `${per2} se repite desde la coma: va sobre 99.`),
      ],
      solucion: [[`${fx(A)} + ${fx(B)}, con ${mcm(A[1], B[1])} abajo.`], ['Da ', Pv(fx(S)), '.']],
      _datos: { p1, per2 },
    };
  }
  const PCT = [['8,333…', 1, 12], ['16,666…', 1, 6], ['33,333…', 1, 3], ['58,333…', 7, 12], ['66,666…', 2, 3], ['83,333…', 5, 6], ['91,666…', 11, 12], ['6,666…', 1, 15], ['13,333…', 2, 15], ['26,666…', 4, 15], ['11,111…', 1, 9], ['22,222…', 2, 9], ['44,444…', 4, 9]];
  function porcentaje(rng) {
    const [pc, a, b] = rng.elegir(PCT), S = b * rng.entero(10, 60) * 10, gasto = S * a / b, R = S - gasto, sol = x => `S/ ${f0(x)}`;
    return {
      enunciado: [`Ana gasta el ${pc} % de su sueldo en el alquiler y le quedan S/ ${R}.`], pregunta: ['¿Cuál es su sueldo?'],
      datos: [D.por, D.mixtoG, D.mcd], correcta: S, fmt: sol,
      errores: [
        h('AT-RESPONDE-OTRA', gasto, `Ese es el alquiler, ${a}/${b} del sueldo.`, sol),
        h('AT-BASE', Number.isInteger(R * (b + a) / b) ? R * (b + a) / b : null, `El ${a}/${b} es del sueldo, no de lo que quedó.`, sol),
        h('AT-INVIERTE', Number.isInteger(R * b / a) ? R * b / a : null, `S/ ${R} es lo que queda, ${b - a}/${b} del sueldo.`, sol),
        h('AT-RESTA-PARTE', Number.isInteger(R * (b - a) / b) ? R * (b - a) / b : null, 'El sueldo es mayor que lo que queda.', sol),
      ],
      solucion: [[`${pc} % = ${a}/${b}: le queda ${b - a}/${b} del sueldo.`], ['Sueldo: ', Pv(sol(S)), '.']],
      _datos: { pc, R },
    };
  }

  // ======================= Idea 6: fracciones en otras bases =======================
  const primosDe = n => factores(n).map(([p]) => p);
  const exactaEn = (n, B) => primosDe(n).every(p => B % p === 0);
  function aFraccion(rng) {
    const B = rng.elegir([3, 4, 5, 6, 7, 8, 9]), x = rng.entero(1, B - 1), y = rng.entero(1, B - 1);
    if (x === y) return null;
    const G = red(x * B + y, B * B);
    return {
      enunciado: [`En base ${B}, un número se escribe ${enB(`0,${x}${y}`, B)}.`], pregunta: ['¿Qué fracción irreductible es?'],
      datos: [D.lugaresB, D.mcd], correcta: fx(G),
      errores: [
        h('AT-BASE10', fx(red(10 * x + y, 100)), 'Eso lee las cifras como si fueran de base 10.'),
        h('AT-POSICION', fx(red(x + y, B)), `La segunda cifra va sobre ${B}², no sobre ${B}.`),
        h('AT-POSICION-MAS', fx(red(x * B + y, B ** 3)), `Son dos lugares: abajo va ${B}², no ${B}³.`),
      ],
      solucion: [[`${x}/${B} + ${y}/${B * B} = ${x * B + y}/${B * B}.`], ['Simplificada: ', Pv(fx(G)), '.']],
      _datos: { B, x, y },
    };
  }
  function menorBase(rng) {
    const n = rng.elegir([12, 18, 20, 24, 28, 36, 40, 45, 50, 54, 63, 75]), a = rng.entero(1, n - 1);
    if (mcd(a, n) !== 1) return null;
    const rad = primosDe(n).reduce((u, p) => u * p, 1), pm = Math.max(...primosDe(n)), base = x => `Base ${x}`;
    if (rad === n || rad === 10) return null;
    return {
      enunciado: [`Se escribe la fracción ${a}/${n} en distintas bases.`], pregunta: ['¿Cuál es la menor base en que es exacta?'],
      datos: [D.exactaB], correcta: rad, fmt: base,
      errores: [
        h('AT-BASE-ES-N', n, `En base ${n} es exacta, pero hay una menor.`, base),
        h('AT-UN-PRIMO-B', pm, `${n} = ${canon(n)} tiene otros primos además del ${pm}.`, base),
        h('AT-BASE10', 10, `En base 10 terminan solo los de primos 2 y 5; ${n} = ${canon(n)}.`, base),
      ],
      solucion: [[`${n} = ${canon(n)}: la base necesita ${primosDe(n).join(', ')}.`], ['La menor es ', Pv(base(rad)), '.']],
      _datos: { a, n },
    };
  }
  function bloque(rng) {
    const B = rng.elegir([3, 4, 5, 6, 7, 8, 9]), x = rng.entero(1, B - 1), y = rng.entero(0, B - 1);
    if (x === y) return null;
    const G = red(x * B + y, B * B - 1);
    return {
      enunciado: [`En base ${B}, un número es ${enB(`0,${repite(`${x}${y}`)}…`, B)}: el bloque ${x}${y} se repite sin fin.`], pregunta: ['¿Qué fracción irreductible es?'],
      datos: [D.bloqueB, D.mcd], correcta: fx(G),
      errores: [
        h('AT-BASE10', fx(red(10 * x + y, 99)), 'Esa es la cuenta de base 10, con 99 abajo.'),
        h('AT-CORTAR', fx(red(x * B + y, B * B)), `Sobre ${B * B} termina; el bloque sigue sin fin.`),
        h('AT-NUEVES', fx(red(x * B + y, B - 1)), `El bloque tiene dos cifras: abajo va ${B}² − 1.`),
      ],
      solucion: [[`${x}${y} en base ${B} vale ${x * B + y}; abajo, ${B * B - 1}.`], ['Simplificada: ', Pv(fx(G)), '.']],
      _datos: { B, x, y },
    };
  }
  function cuantas(rng) {
    const n = rng.elegir([6, 10, 12, 14, 15, 18, 20, 21]), a = rng.entero(1, n - 1), L = rng.elegir([20, 24, 30, 36, 40]);
    if (mcd(a, n) !== 1) return null;
    const ps = primosDe(n), cuenta = ok => { let c = 0; for (let B = 2; B <= L; B++) if (ok(B)) c++; return c; };
    const C = cuenta(B => exactaEn(n, B));
    return {
      enunciado: [`La fracción ${a}/${n} se escribe en todas las bases de la 2 a la ${L}.`], pregunta: ['¿En cuántas de esas bases es exacta?'],
      datos: [D.exactaB, D.cuantos], correcta: C,
      errores: [
        h('AT-UN-PRIMO-B', cuenta(B => B % ps[0] === 0), `Esas tienen el ${ps[0]}, pero también hace falta ${ps.slice(1).join(' y ')}.`),
        h('AT-UN-PRIMO-B', cuenta(B => B % ps[ps.length - 1] === 0), `Esas tienen el ${ps[ps.length - 1]}, pero faltan los otros primos.`),
        h('AT-BASE-GRANDE', L - n + 1, 'Ser mayor que el denominador no basta: cuentan sus primos.'),
      ],
      solucion: [[`${n} = ${canon(n)}: la base tiene que ser múltiplo de ${ps.reduce((u, p) => u * p, 1)}.`], ['Son ', Pv(C), '.']],
      _datos: { a, n, L },
    };
  }

  const CONSTRUIR = {
    falta, irreductible, 'suma-terminos': sumaTerminos, 'tres-cifras': tresCifras, mayor, clase, entre, precio,
    sumar, queda, atras, grifos, exacto, cifras, factorial, lugar, puro, 'mixto-g': mixtoG, 'suma-p': sumaP, porcentaje,
    'a-fraccion': aFraccion, 'menor-base': menorBase, bloque, cuantas,
  };

  return { id: ID, titulo: 'El queque y la calculadora', generar, TIPOS_POR_IDEA, TIPOS_POR_UNIDAD, NIVEL };
});
