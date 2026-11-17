/*
 * Generador «Exponentes y radicales»: la práctica de las tres ideas de algebra.exponentes-y-productos-notables
 * (contenido/teoria/algebra/exponentes-y-productos-notables.js; la unidad conserva ese id viejo desde que se partió y
 * los productos notables pasaron a algebra.productos-notables). Formato "predicciones" (docs/arquitectura.md).
 * Funciona en el navegador (window.Generadores['exponentes-radicales']) y en Node (require). No usa ningún motor: las
 * cuentas son potencias y raíces exactas de números chicos y fracciones exactas (P.frac).
 *
 * Propuesta aprobada: docs/etapa3/propuesta-algebra-exponentes.md §7 y §9 (pregunta 6) y docs/etapa3/decisiones.md
 * («Segunda ronda» y «Tercera ronda»). Objetos, como en la teoría: la hoja que se dobla (idea 1), los biohuertos del
 * colegio (idea 2) y la caja de cartón con la loseta (idea 3). Valores de problema, sin fuente: hojas de hasta 6
 * dobleces (en tres, hasta 3), biohuertos de hasta 400 m², cajas de hasta 1000 dm³, gastos de feria de hasta 60 soles.
 *
 * Tipos por idea (TIPOS_POR_IDEA; nivel 1 un paso, 2 dos pasos, 3 de examen). generar(semilla, { idea }) da solo los
 * de esa idea; sin idea, las tres con el mismo peso.
 *   leyes-exponentes        una-potencia (1) aᵖ · aᵠ ÷ aᵗ como una sola potencia · hoja (1) las capas de una hoja
 *                           doblada m y después n veces, por la mitad o en tres · negativo (2; sub producto o cociente)
 *                           el valor cuando el exponente sale negativo · elevar (2) (aᵖ)ᵠ · aʷ con w negativo · dato
 *                           (2; sub suma o cuadrado) con 2ˣ = K, el valor de 2ˣ⁺ʲ o de 9ˣ sin hallar x ·
 *                           factor-comun (3; sub resta o suma) (aˣ⁺ᵖ ∓ aˣ⁺ᵠ) ÷ aˣ · misma-base (3) Aˣ · c = pᴺ ·
 *                           dos-variables (3; sub suma o cota) Aˣ = Bʸ con x + y = S, o la cota de un gasto, como
 *                           San Marcos 2025-II (Medicina, pregunta 40; docs/datos/admision-unmsm.csv)
 *   radicales               raiz-cuadrado (1; sub cuadrado o cubo) √(x²) y ³√(x³) con x negativo · producto-raices (1;
 *                           sub producto o cociente) √A · √B y √A ÷ √B · biohuertos (2) el lado del biohuerto que
 *                           junta dos áreas · simplificar (2) √N = c√t · resta-cuadrado (3; sub una o dos) √((3 − π)²)
 *                           y √((k₁ − t)²) + √((t − k₂)²) · semejantes (3) √N₁ + √N₂ − √N₃
 *   exponente-fraccionario  a-radical (1; sub a-potencia o a-raiz) ⁿ√(xᵐ) ⇄ xᵐᐟⁿ · caja (1; sub arista o lado) la
 *                           arista de la caja o el lado de la loseta como potencia · valor (2) Bᵐᐟⁿ · producto-fracc (2)
 *                           ⁿ√(xᵃ) · ᵏ√(xᵇ) · suma-fracc (3) tres potencias de exponente fraccionario · anidado (3)
 *                           ᵏ√(xᵃ · ʲ√(xᵇ)) · ecuacion-raiz (3; sub base2 o base4) ⁿ√(2ˣ) = 2ᵏ y ⁿ√(4ˣ) = 2ᵏ
 *
 * Notación (tabla de letras de la teoría): la base y los números en tinta; exponentes con superíndice Unicode (2ˣ⁺³,
 * 5⁻²) y el exponente fraccionario con la barra alta U+141F (x³ᐟ⁵, como se ve con superíndice en la teoría); raíz de
 * índice n con el índice en superíndice delante (⁵√(x³), ³√64; la cúbica también, no «∛», que en el celular sale con
 * otra letra). «·» multiplica y «÷» divide. Las alternativas son texto plano.
 * Colores: un color fijo por magnitud, el de la teoría (cabecera de la unidad; docs/molde-unidad.md §5b): el primer
 * exponente naranja (m, o) y el segundo turquesa (n, i); en la idea 2, el primer radicando naranja (a, o) y el segundo
 * turquesa (b, i); en la idea 3, el exponente de adentro naranja (m) y el índice turquesa (n); el resultado violeta
 * (R, f), solo en la solución. La base, el total y lo que se pide van en tinta. Ni carmín ni verde.
 * Datos (docs/plan-calidad.md §3, punto 13): las leyes como fórmula general (aᵐ · aⁿ = aᵐ⁺ⁿ…), la definición de raíz,
 * de |x| y de aᵐᐟⁿ, equivalencias de la base (16 = 2⁴) y los cuadrados; nunca el paso hecho ni la respuesta.
 * Errores: los códigos de la teoría (AL9 parcial; AL11 y AL32 hipótesis, de docs/investigacion/algebra-funciones-
 * ideas-erroneas.md; TAL-EXP-*, TAL-RAIZ-*, TAL-FRAC-* y TAL-SIGNO, hipótesis de diseño de la teoría). Nuevos aquí
 * (hipótesis): TAL-EXP-DOBLECES da los dobleces y no las capas · TAL-EXP-ORDEN resta los exponentes al revés al dividir
 * · TAL-EXP-FACTOR toma 9ˣ como 3 · 3ˣ · TAL-EXP-SOLO-EXP opera los exponentes y no las potencias · TAL-EXP-INVIERTE
 * invierte la razón entre x e y · TAL-RAIZ-CUARTO toma el lado como el área entre 4 · TAL-RAIZ-INCOMPLETA no saca todo
 * el cuadrado · TAL-RAIZ-UNA corrige el signo de una sola raíz · TAL-FRAC-INDICE usa el índice de la otra figura ·
 * TAL-FRAC-NEG confunde «deshacer» con el exponente negativo · TAL-RAIZ-LADOS saca la raíz de la suma de los lados y no de
 * las áreas · TAL-EXP-PARTE da una sola parte de un reparto en una razón. Cada explicación empieza por lo que el alumno hizo bien y
 * muestra lo que da su error; ninguna nombra una alternativa por su letra.
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
  const ID = 'exponentes-radicales';
  const INV = 'docs/investigacion/algebra-funciones-ideas-erroneas.md';
  const TEO = 'contenido/teoria/algebra/exponentes-y-productos-notables.js';
  const v = P.v;
  const f = (x, d = 2) => P.formatear(x, d);

  // ---- Escritura ----
  const SUPS = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', '-': '⁻', '−': '⁻', '+': '⁺',
    x: 'ˣ', y: 'ʸ', n: 'ⁿ', m: 'ᵐ', '/': 'ᐟ', '(': '⁽', ')': '⁾', ' ': '' };
  const sup = s => [...String(s)].map(c => { if (!(c in SUPS)) throw new Error(`sin superíndice: ${c}`); return SUPS[c]; }).join('');
  const z = x => (x < 0 ? `−${-x}` : String(x));
  const pot = (base, e) => `${base}${sup(typeof e === 'number' ? z(e) : e)}`;
  const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  const Q = (n, d = 1) => P.frac(n, d);
  const sumQ = (a, b) => Q(a.n * b.d + b.n * a.d, a.d * b.d);
  const qT = q => P.textoFraccion(q);                               // «7/6», «−2», «5»
  const qS = q => sup(qT(q).replace('−', '-'));                      // «⁷ᐟ⁶», «⁻²»
  const qNum = q => q.n / q.d;
  // Raíz de índice n escrita en el texto: √x, ³√64, ⁵√(x³).
  const rad = (n, dentro) => `${n === 2 ? '' : sup(n)}√${dentro}`;
  const xPot = e => (e === 1 ? 'x' : `x${sup(e)}`);
  const dentroX = e => (e === 1 ? 'x' : `(x${sup(e)})`);
  const pl = (k, uno, varios) => (k === 1 ? uno : varios);

  const VARS = {
    m: { nombre: 'el primer exponente', color: 'o' }, n: { nombre: 'el segundo exponente', color: 'i' },
    a: { nombre: 'el primer radicando', color: 'o' }, b: { nombre: 'el segundo radicando', color: 'i' },
    R: { nombre: 'el resultado', color: 'f' },
  };
  const NOMBRES_FRAC = { m: 'el exponente de adentro', n: 'el índice' };
  const M = x => v('m', x), N = x => v('n', x), A = x => v('a', x), B = x => v('b', x), R = x => v('R', x);

  // ---- Errores: el respaldo sale del código ----
  const RESPALDO = { AL9: ['parcial', INV], AL11: ['hipotesis', INV], AL32: ['hipotesis', INV] };
  // e(id, clave, texto, explicación(texto)) → error de armarTexto; num (opcional) para la escala de 1/20 a 20 veces.
  function e(id, clave, texto, explicar, num) {
    const [respaldo, fuente] = RESPALDO[id] || ['hipotesis', TEO];
    return { id, clave: String(clave), texto, explicacion: explicar(texto), respaldo, fuente, num };
  }
  // en(id, valor, fmt, explicación(texto)) → error numérico de armar.
  function en(id, valor, fmt, explicar) {
    const [respaldo, fuente] = RESPALDO[id] || ['hipotesis', TEO];
    return { id, valor, texto: fmt(valor), explicacion: explicar(fmt(valor)), respaldo, fuente };
  }
  // Respuestas de texto: una potencia, un valor racional, x = …
  const cPot = (base, q) => ({ clave: `${base}^${qT(q)}`, texto: `${base}${qS(q)}` });
  const cVal = (q, escala = false) => Object.assign({ clave: `=${qT(q)}`, texto: qT(q) }, escala ? { num: qNum(q) } : {});
  const cX = q => ({ clave: `x=${qT(q)}`, texto: `x = ${qT(q)}` });
  const ePot = (id, base, ex, explicar) => { const o = cPot(base, Q(ex)); return e(id, o.clave, o.texto, explicar); };

  // ---- Datos que se repiten (herramientas, no el paso hecho) ----
  const D = {
    def: 'aⁿ = a · a · … · a, con n factores iguales a a',
    producto: 'aᵐ · aⁿ = aᵐ⁺ⁿ',
    cociente: 'aᵐ ÷ aⁿ = aᵐ⁻ⁿ, con a ≠ 0',
    potencia: '(aᵐ)ⁿ = aᵐⁿ, donde mn = m · n',
    negativo: 'a⁻ⁿ = 1/aⁿ, con a ≠ 0',
    igualar: 'Si aʳ = aˢ, con a > 0 y a ≠ 1, entonces r = s',
    dobla: b => (b === 2 ? 'Cada doblez por la mitad duplica las capas de la hoja' : 'Cada doblez en tres triplica las capas de la hoja'),
    factor: 'p · c ± q · c = (p ± q) · c: el factor común c sale',
    raiz: '√a es el número no negativo que, multiplicado por sí mismo, da a',
    cubica: '³√a es el número que, elevado al cubo, da a',
    raizAbs: '√(x²) = |x|',
    abs: '|x| es la distancia de x al cero: |−3| = 3 y |3| = 3',
    lado: 'Lado de un cuadrado = √(área); área = lado · lado',
    prodRaiz: '√(a · b) = √a · √b, con a, b ≥ 0',
    cocRaiz: '√(a ÷ b) = √a ÷ √b, con a ≥ 0 y b > 0',
    semejantes: 'p√t + q√t = (p + q)√t',
    cuadrados: 'Cuadrados: 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144',
    mn: 'aᵐᐟⁿ = ⁿ√(aᵐ) = (ⁿ√a)ᵐ',
    uno: 'a¹ᐟⁿ = ⁿ√a: el número que, elevado a n, da a',
    cubo: 'Volumen de un cubo = arista³',
    cuadrado: 'Área de un cuadrado = lado²',
  };

  // ---- Tipos por idea ----
  const TIPOS_POR_IDEA = {
    'leyes-exponentes': ['una-potencia', 'hoja', 'negativo', 'elevar', 'dato', 'factor-comun', 'misma-base', 'dos-variables'],
    radicales: ['raiz-cuadrado', 'producto-raices', 'biohuertos', 'simplificar', 'resta-cuadrado', 'semejantes'],
    'exponente-fraccionario': ['a-radical', 'caja', 'valor', 'producto-fracc', 'suma-fracc', 'anidado', 'ecuacion-raiz'],
  };
  const IDEAS = Object.keys(TIPOS_POR_IDEA);
  const IDEA_DE = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map(t => [t, i])));
  const NIVEL = { 'una-potencia': 1, hoja: 1, negativo: 2, elevar: 2, dato: 2, 'factor-comun': 3, 'misma-base': 3, 'dos-variables': 3,
    'raiz-cuadrado': 1, 'producto-raices': 1, biohuertos: 2, simplificar: 2, 'resta-cuadrado': 3, semejantes: 3,
    'a-radical': 1, caja: 1, valor: 2, 'producto-fracc': 2, 'suma-fracc': 3, anidado: 3, 'ecuacion-raiz': 3 };

  // Papel (regla 6; herramientas/papel-generador.js usa «papel-1» a «papel-8» y rotula 3 básicos, 3 intermedios y 2
  // avanzados): las tres ideas, de menos a más.
  const PAPEL = { 'papel-1': ['hoja'], 'papel-2': ['producto-raices', 'producto'], 'papel-3': ['a-radical', 'a-potencia'],
    'papel-4': ['elevar'], 'papel-5': ['simplificar'], 'papel-6': ['valor'], 'papel-7': ['dos-variables', 'cota'], 'papel-8': ['anidado'] };

  function generar(semilla, opciones) {
    const o = typeof opciones === 'string' ? { unidad: opciones } : opciones || {};
    const rng = Azar.crear(ID + '|' + semilla);
    const forzado = !o.idea && PAPEL[String(semilla)];
    let tipo, sub0;
    if (forzado) [tipo, sub0] = forzado;
    else {
      const idea = TIPOS_POR_IDEA[o.idea] ? o.idea : rng.elegir(IDEAS);
      tipo = rng.elegir(TIPOS_POR_IDEA[idea]);
    }
    for (let intento = 0; intento < 500; intento++) {
      const pr = CONSTRUIR[tipo](rng, sub0);
      const p = pr && cerrar(rng, semilla, tipo, pr);
      if (p) return p;
    }
    throw new Error(`${ID}: no se pudo generar un problema de ${tipo} con 4 alternativas distintas`);
  }

  // Arma las alternativas y el problema. Variables: solo las que se usan.
  function cerrar(rng, semilla, tipo, o) {
    let alternativas, respuesta;
    if (o.correcta && typeof o.correcta === 'object') {
      const c = o.correcta;
      const errores = o.errores.filter(x => x && (c.num === undefined || x.num === undefined || P.enEscala(x.num, c.num, x.id)));
      alternativas = P.armarTexto({ correcta: { clave: c.clave, texto: c.texto }, errores, rng });
      respuesta = { valor: c.clave, texto: c.texto, unidad: '' };
    } else {
      const errores = o.errores.filter(x => x && Number.isFinite(x.valor) && x.valor !== o.correcta && P.enEscala(x.valor, o.correcta, x.id));
      alternativas = P.armar({ correcta: o.correcta, errores, rng, texto: o.fmt, negativos: !!o.negativos });
      respuesta = { valor: o.correcta, unidad: o.unidad || '' };
    }
    if (alternativas.length < 4) return null;
    const usadas = new Set();
    for (const linea of [o.enunciado, o.pregunta, ...o.solucion]) for (const x of linea) if (x && typeof x === 'object') usadas.add(x.v);
    const nombres = IDEA_DE[tipo] === 'exponente-fraccionario' ? NOMBRES_FRAC : o.nombres || {};
    const variables = Object.fromEntries([...usadas].map(k => [k, Object.assign({}, VARS[k], nombres[k] ? { nombre: nombres[k] } : {})]));
    return {
      id: `${ID}#${semilla}`, variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: o.datos,
      alternativas, solucion: o.solucion, respuesta,
      _datos: Object.assign({ idea: IDEA_DE[tipo], tipo, nivel: NIVEL[tipo] }, o._datos),
    };
  }

  // ======================= Idea 1: el exponente cuenta factores =======================

  function unaPotencia(rng) {
    const b = rng.elegir([2, 3, 5, 7, 10]), p = rng.entero(2, 9), q = rng.entero(2, 6), t = rng.entero(1, p + q - 1), ex = p + q - t;
    if (t === p || t === q) return null;
    return {
      enunciado: ['Se tiene la expresión ', String(b), M(sup(p)), ' · ', String(b), N(sup(q)), ' ÷ ', pot(b, t), '.'],
      pregunta: [`¿Cómo se escribe como una sola potencia de ${b}?`],
      datos: [D.producto, D.cociente],
      correcta: cPot(b, Q(ex)),
      errores: [
        ePot('TAL-EXP-PRODUCTO', b, p * q - t, x => `Bien que dejes una sola potencia de ${b} y restes el ${t} del divisor. Pero ${pot(b, p)} · ${pot(b, q)} suma los exponentes; multiplicarlos da ${x}.`),
        ePot('TAL-EXP-COCIENTE', b, p + q + t, x => `Bien la suma ${p} + ${q} del producto. Pero el exponente del divisor se resta; sumarlo da ${x}.`),
        ePot('TAL-EXP-BASE', b * b, ex, x => `Bien la cuenta de exponentes: ${p} + ${q} − ${t} = ${ex}. Pero la base sigue siendo ${b}; ${x} cambia la base.`),
      ],
      solucion: [
        ['Misma base: en el producto se suman los exponentes y al dividir se resta el del divisor.'],
        [String(b), sup(`${p}+${q}−${t}`), ' = ', String(b), R(sup(ex)), '.'],
      ],
      _datos: { b, p, q, t },
    };
  }

  function hoja(rng) {
    // Hasta 6 dobleces por la mitad (en tres, hasta 3). Pares elegidos para que la correcta no sea casi siempre la mayor.
    const b = rng.elegir([2, 2, 2, 3]);
    const [m, n] = rng.elegir(b === 2 ? [[1, 2], [2, 1], [1, 3], [3, 1], [2, 3], [3, 2], [3, 3], [2, 4], [4, 2]] : [[1, 2], [2, 1]]);
    const total = b ** (m + n), fmt = x => `${f(x, 0)} capas`;
    const como = b === 2 ? 'por la mitad' : 'en tres, como una carta';
    const veces = k => `${k} ${pl(k, 'vez', 'veces')}`;
    return {
      enunciado: [`Ana dobla una hoja de cuaderno ${como}, `, M(veces(m)), '. Después la dobla ', N(`${veces(n)} más`), ', igual que antes.'],
      pregunta: ['¿Cuántas capas de papel tiene el paquete al final?'],
      datos: [D.dobla(b), D.def, D.producto],
      correcta: total, fmt,
      errores: [
        en('TAL-EXP-PRODUCTO', b ** (m * n), fmt, x => `Bien que uses potencias de ${b}. Pero los dobleces de las dos tandas se suman, ${m} + ${n}; multiplicarlos da ${x}.`),
        en('AL11', b ** m + b ** n, fmt, x => `Bien las capas de cada tanda: ${b ** m} y ${b ** n}. Pero la segunda tanda dobla el paquete entero, así que se multiplican; sumarlas da ${x}.`),
        en('TAL-EXP-POR', b * (m + n), fmt, x => `Bien que cuentes ${m + n} dobleces. Pero cada doblez multiplica las capas por ${b}; ${b} · ${m + n} da ${x}.`),
        en('TAL-EXP-DOBLECES', m + n, fmt, x => `Bien la cuenta de dobleces: ${m} + ${n} = ${m + n}. Pero ${x} confunde dobleces con capas: cada doblez multiplica las capas por ${b}.`),
      ],
      solucion: [
        ['Los primeros ', M(m), ` ${pl(m, 'doblez dejan', 'dobleces dejan')} `, String(b), M(sup(m)), ` = ${b ** m} ${pl(b ** m, 'capa', 'capas')}.`],
        [pl(n, 'El ', 'Los '), N(n), ` ${pl(n, 'doblez más repite', 'dobleces más repiten')} ese paquete `, String(b), N(sup(n)), ` = ${b ** n} veces: `, String(b), M(sup(m)), ' · ', String(b), N(sup(n)), ' = ', String(b), sup(m + n), ' = ', R(fmt(total)), '.'],
      ],
      _datos: { b, m, n },
    };
  }

  function negativo(rng, forzado) {
    const sub = forzado || rng.elegir(['producto', 'cociente']);
    const [b, k] = rng.elegir([[2, 3], [2, 4], [2, 5], [3, 2], [3, 3], [3, 4], [4, 2], [5, 2], [10, 2], [10, 3]]);
    const den = b ** k, uno = Q(1, den);
    const neg = e('TAL-EXP-NEG', `=${z(-den)}`, z(-den), x => `Bien que llegues a ${pot(b, -k)}. Pero el exponente negativo no cambia el signo: indica dividir entre ${pot(b, k)}; ${x} es negativo.`);
    const frac = e('TAL-EXP-FRAC', `=1/${b * k}`, `1/${b * k}`, x => `Bien: ${pot(b, -k)} es una fracción con 1 arriba. Pero abajo va ${b} multiplicado ${k} veces por sí mismo, no ${b} · ${k}; por eso ${x} no es.`);
    if (sub === 'producto') {
      const p = rng.entero(2, 6), q = -(p + k);
      return {
        enunciado: ['Se tiene el producto ', String(b), M(sup(p)), ' · ', String(b), N(sup(z(q))), '.'],
        pregunta: ['¿Cuánto vale?'],
        datos: [D.producto, D.negativo],
        correcta: cVal(uno),
        errores: [neg, frac,
          e('TAL-EXP-POR', `=${z(-b * k)}`, z(-b * k), x => `Bien que el exponente quede en −${k}. Pero ${pot(b, -k)} no es ${b} · (−${k}) = ${x}: una potencia no multiplica la base por el exponente.`)],
        solucion: [
          ['Misma base: se suman los exponentes con su signo. ', String(b), M(sup(p)), ' · ', String(b), N(sup(z(q))), ' = ', pot(b, -k), '.'],
          ['El exponente negativo indica dividir: ', pot(b, -k), ` = 1/${pot(b, k)} = `, R(`1/${den}`), '.'],
        ],
        _datos: { sub, b, k, p },
      };
    }
    const p = rng.entero(2, 6);
    return {
      enunciado: ['Se tiene el cociente ', String(b), M(sup(p)), ' ÷ ', String(b), N(sup(p + k)), '.'],
      pregunta: ['¿Cuánto vale?'],
      datos: [D.cociente, D.negativo],
      correcta: cVal(uno),
      errores: [neg, frac,
        e('TAL-EXP-ORDEN', `=${den}`, String(den), x => `Bien que restes los exponentes ${p} y ${p + k}. Pero se resta el del divisor: ${p} − ${p + k} = −${k}; restar al revés da ${x}.`)],
      solucion: [
        ['Misma base: al dividir se resta el exponente del divisor. ', String(b), M(sup(p)), ' ÷ ', String(b), N(sup(p + k)), ' = ', pot(b, -k), '.'],
        ['El exponente negativo indica dividir: ', pot(b, -k), ` = 1/${pot(b, k)} = `, R(`1/${den}`), '.'],
      ],
      _datos: { sub, b, k, p },
    };
  }

  function elevar(rng) {
    const b = rng.elegir([2, 3, 5, 10]), p = rng.entero(2, 5), q = rng.entero(2, 4), w = -rng.entero(1, 6), ex = p * q + w;
    return {
      enunciado: ['Se tiene la expresión (', String(b), M(sup(p)), ')', N(sup(q)), ' · ', pot(b, w), '.'],
      pregunta: [`¿Cómo se escribe como una sola potencia de ${b}?`],
      datos: [D.potencia, D.producto],
      correcta: cPot(b, Q(ex)),
      errores: [
        ePot('TAL-EXP-ELEVAR', b, p + q + w, x => `Bien que sumes el ${z(w)} con su signo. Pero elevar una potencia multiplica los exponentes, ${p} · ${q}; sumar ${p} + ${q} da ${x}.`),
        ePot('TAL-EXP-NEG', b, p * q - w, x => `Bien: elevar da ${pot(b, p * q)}. Pero ${z(w)} es negativo y se suma con su signo; restarlo da ${x}.`),
        ePot('TAL-EXP-PRODUCTO', b, p * q * w, x => `Bien: elevar multiplica, ${p} · ${q} = ${p * q}. Pero después, en el producto, los exponentes se suman; multiplicarlos otra vez da ${x}.`),
      ],
      solucion: [
        ['Elevar una potencia multiplica los exponentes: (', String(b), M(sup(p)), ')', N(sup(q)), ' = ', pot(b, p * q), '.'],
        ['En el producto se suman con su signo: ', String(b), sup(`${p * q}+(${z(w)})`), ' = ', String(b), R(sup(z(ex))), '.'],
      ],
      _datos: { b, p, q, w },
    };
  }

  function dato(rng, forzado) {
    const sub = forzado || rng.elegir(['suma', 'cuadrado']);
    const fmt = x => f(x, 0);
    if (sub === 'suma') {
      const b = rng.elegir([2, 3, 5]), K = rng.entero(2, 9), j = b === 5 ? 2 : rng.entero(2, 3), bj = b ** j, ans = K * bj;
      return {
        enunciado: ['Se sabe que ', pot(b, 'x'), ` = ${K}.`],
        pregunta: ['¿Cuánto vale ', String(b), sup('x+'), N(sup(j)), '?'],
        datos: [D.producto],
        correcta: ans, fmt,
        errores: [
          en('TAL-EXP-SUMA', K + j, fmt, x => `Bien que uses el dato ${K}. Pero ${pot(b, `x+${j}`)} es ${pot(b, 'x')} · ${pot(b, j)}: el ${j} no se suma al valor; sumarlo da ${x}.`),
          en('AL11', K + bj, fmt, x => `Bien que calcules ${pot(b, j)} = ${bj}. Pero ${pot(b, `x+${j}`)} es un producto, ${K} · ${bj}; repartirlo como suma da ${x}.`),
          en('TAL-EXP-POR', K * j, fmt, x => `Bien que multipliques el dato ${K}. Pero por ${pot(b, j)} = ${bj}, no por ${j}; por eso ${x} no es.`),
          en('TAL-EXP-PRODUCTO', K ** j, fmt, x => `Bien que uses el dato ${K}. Pero ${pot(b, `x+${j}`)} es ${pot(b, 'x')} · ${pot(b, j)}: los exponentes se suman; tomarlo como (${pot(b, 'x')})${sup(j)} da ${x}.`),
        ],
        solucion: [
          ['No hace falta hallar x: se separa la potencia. ', String(b), sup('x+'), N(sup(j)), ' = ', pot(b, 'x'), ' · ', String(b), N(sup(j)), '.'],
          [`Se reemplaza el dato: ${K} · ${bj} = `, R(fmt(ans)), '.'],
        ],
        _datos: { sub, b, K, j },
      };
    }
    const b = rng.elegir([3, 5, 7, 7]), K = rng.entero(3, 9), bb = b * b;
    if (K === b) return null;
    return {
      enunciado: ['Se sabe que ', pot(b, 'x'), ` = ${K}.`],
      pregunta: ['¿Cuánto vale ', pot(bb, 'x'), '?'],
      datos: [`${bb} = ${pot(b, 2)}`, D.potencia],
      correcta: K * K, fmt,
      errores: [
        en('TAL-EXP-POR', 2 * K, fmt, x => `Bien que escribas ${pot(bb, 'x')} como (${pot(b, 2)})ˣ. Pero eso es (${pot(b, 'x')})² = ${K}², no 2 · ${K} = ${x}.`),
        en('TAL-EXP-FACTOR', b * K, fmt, x => `Bien que uses el dato ${K}. Pero ${pot(bb, 'x')} = ${pot(b, 'x')} · ${pot(b, 'x')}, no ${b} · ${pot(b, 'x')}; por eso ${x} no es.`),
        en('AL32', K, fmt, x => `Bien que veas el mismo exponente x. Pero las bases ${bb} y ${b} son distintas: ${pot(bb, 'x')} no vale lo mismo que ${pot(b, 'x')}, que es ${x}.`),
      ],
      solucion: [
        ['Se pasa a base ', String(b), ': ', pot(bb, 'x'), ' = (', pot(b, 2), ')ˣ = ', pot(b, '2x'), ' = (', pot(b, 'x'), ')².'],
        [`Se reemplaza el dato: ${K}² = `, R(fmt(K * K)), '.'],
      ],
      _datos: { sub, b, K },
    };
  }

  function factorComun(rng, forzado) {
    const sub = forzado || rng.elegir(['resta', 'suma']);
    const b = rng.elegir([2, 3, 5]), p = rng.entero(2, 4), q = rng.entero(1, p - 1);
    if (b ** p > 125) return null;
    const bp = b ** p, bq = b ** q, signo = sub === 'resta' ? '−' : '+';
    const ans = sub === 'resta' ? bp - bq : bp + bq, fmt = x => f(x, 0);
    const errores = sub === 'resta' ? [
      en('TAL-EXP-RESTA', b ** (p - q), fmt, x => `Bien que saques ${pot(b, 'x')} y lo simplifiques. Pero ${pot(b, p)} − ${pot(b, q)} se resta con sus valores; restar los exponentes, como al dividir, da ${x}.`),
      en('TAL-SIGNO', bp + bq, fmt, x => `Bien que saques el factor común ${pot(b, 'x')}. Pero arriba hay una resta: ${bp} − ${bq}; sumar da ${x}.`),
      en('TAL-EXP-SOLO-EXP', p - q, fmt, x => `Bien que llegues a ${pot(b, p)} − ${pot(b, q)}. Pero falta calcular las potencias; ${x} resta solo los exponentes.`),
    ] : [
      en('AL11', b ** (p + q), fmt, x => `Bien que saques el factor común ${pot(b, 'x')}. Pero ${pot(b, p)} + ${pot(b, q)} no es ${pot(b, p + q)}: los exponentes se suman en un producto, no en una suma; así sale ${x}.`),
      en('TAL-SIGNO', bp - bq, fmt, x => `Bien que saques el factor común ${pot(b, 'x')}. Pero arriba hay una suma: ${bp} + ${bq}; restar da ${x}.`),
      en('TAL-EXP-SOLO-EXP', p + q, fmt, x => `Bien que llegues a ${pot(b, p)} + ${pot(b, q)}. Pero falta calcular las potencias; ${x} suma solo los exponentes.`),
    ];
    return {
      enunciado: ['Se tiene la expresión (', String(b), sup('x+'), M(sup(p)), ` ${signo} `, String(b), sup('x+'), N(sup(q)), ') ÷ ', pot(b, 'x'), '.'],
      pregunta: ['¿Cuánto vale, para cualquier x?'],
      datos: [D.producto, D.factor],
      correcta: ans, fmt,
      errores,
      solucion: [
        ['Cada término trae ', pot(b, 'x'), ' como factor: ', pot(b, `x+${p}`), ` ${signo} `, pot(b, `x+${q}`), ' = ', pot(b, 'x'), ' · (', String(b), M(sup(p)), ` ${signo} `, String(b), N(sup(q)), ').'],
        ['Se simplifica con el ', pot(b, 'x'), ` de abajo: ${bp} ${signo} ${bq} = `, R(fmt(ans)), '.'],
      ],
      _datos: { sub, b, p, q },
    };
  }

  function mismaBase(rng) {
    const p = rng.elegir([2, 3]), k = p === 2 ? rng.elegir([2, 3]) : 2;
    const j = rng.elegir([1, 2, 3].filter(x => x !== k && p ** x <= 27)), x0 = rng.entero(1, 4);
    const a = p ** k, c = p ** j, Nn = k * x0 + j;
    const err = (id, q, ex) => { const r = cX(q); return e(id, r.clave, r.texto, ex); };
    return {
      enunciado: ['Se cumple ', String(a), M('ˣ'), ` · ${c} = `, pot(p, Nn), '.'],
      pregunta: ['¿Cuánto vale x?'],
      datos: [`${a} = ${pot(p, k)} y ${c} = ${pot(p, j)}`, D.potencia, D.producto, D.igualar],
      correcta: cX(Q(x0)),
      errores: [
        err('AL32', Q(Nn - j), x => `Bien que iguales exponentes al final. Pero solo se igualan con la misma base: antes, ${a} se escribe ${pot(p, k)}; saltarse ese paso da ${x}.`),
        err('TAL-EXP-ELEVAR', Q(Nn - j - k), x => `Bien que pases ${a} a ${pot(p, k)}. Pero (${pot(p, k)})ˣ es ${pot(p, `${k}x`)}: se multiplica, no ${k} + x; así sale ${x}.`),
        err('TAL-EXP-DATO', Q(Nn - c, k), x => `Bien que llegues a ${k}x. Pero ${c} no es un exponente: es ${pot(p, j)}, y suma ${j} al exponente; restar ${c} da ${x}.`),
      ],
      solucion: [
        [`Todo a base ${p}: `, String(a), M('ˣ'), ` · ${c} = `, pot(p, `${k}x`), ' · ', pot(p, j), ' = ', pot(p, `${k}x+${j}`), '.'],
        [`Misma base: se igualan los exponentes. ${k}x + ${j} = ${Nn}, así que `, R(`x = ${x0}`), '.'],
      ],
      _datos: { p, k, j, N: Nn },
    };
  }

  // Como San Marcos 2025-II (Medicina, 40): igualdad de dos exponenciales con dos variables y una cota.
  function dosVariables(rng, forzado) {
    const sub = forzado || rng.elegir(['suma', 'cota']);
    const p = rng.elegir([2, 3]);
    const pares = p === 2 ? [[2, 3], [3, 2], [3, 4], [4, 3], [2, 5], [5, 2], [3, 5], [5, 3]] : [[2, 3], [3, 2], [3, 4], [4, 3]];
    const [k1, k2] = rng.elegir(pares), a = p ** k1, b = p ** k2, s = k1 + k2;
    const igualdad = [String(a), M('ˣ'), ' = ', String(b), N('ʸ')];
    const datos = [`${a} = ${pot(p, k1)} y ${b} = ${pot(p, k2)}`, D.potencia, D.igualar];
    const paso1 = ['Todo a base ', String(p), ': ', pot(p, `${k1}x`), ' = ', pot(p, `${k2}y`), `, así que ${k1}x = ${k2}y.`];
    if (sub === 'suma') {
      const t = rng.entero(1, 4), S = s * t, pide = rng.elegir(['x', 'y']);
      const x0 = k2 * t, y0 = k1 * t, val = pide === 'x' ? x0 : y0;
      const cY = q => ({ clave: `${pide}=${qT(q)}`, texto: `${pide} = ${qT(q)}` });
      const err = (id, q, ex) => { const r = cY(q); return e(id, r.clave, r.texto, ex); };
      return {
        enunciado: ['Los números reales x e y cumplen ', ...igualdad, ` y x + y = ${S}.`],
        pregunta: [`¿Cuánto vale ${pide}?`],
        datos,
        correcta: cY(Q(val)),
        errores: [
          err('AL32', Q(S, 2), x => `Bien que iguales exponentes. Pero ${a} y ${b} son bases distintas: primero se pasan a base ${p}; igualar x = y da ${x}.`),
          err('TAL-EXP-INVIERTE', Q(pide === 'x' ? k1 * t : k2 * t), x => `Bien que pases todo a base ${p}: ${k1}x = ${k2}y. Pero de ahí x es ${k2}/${k1} de y, no al revés; con la razón invertida sale ${x}.`),
          err('TAL-EXP-ELEVAR', Q(pide === 'x' ? S + k2 - k1 : S - k2 + k1, 2), x => `Bien que pases ${a} a ${pot(p, k1)}. Pero (${pot(p, k1)})ˣ es ${p} elevado a ${k1}x, no a ${k1} + x; así sale ${x}.`),
        ],
        solucion: [
          paso1,
          [`De ${k1}x = ${k2}y, x e y están en la razón ${k2} : ${k1}. Con x + y = ${S}, cada parte vale ${S} ÷ ${s} = ${t}.`],
          [`Entonces x = ${k2} · ${t} = ${x0} e y = ${k1} · ${t} = ${y0}, y se pide `, R(`${pide} = ${val}`), '.'],
        ],
        nombres: { m: 'el exponente x', n: 'el exponente y' },
        _datos: { sub, p, k1, k2, S, pide },
      };
    }
    if (k1 > k2) return null;   // Luis (y) se lleva la parte menor: k₁ < k₂
    const T = s * rng.entero(Math.ceil(20 / s), Math.floor(60 / s)), ans = k1 * T / s, fmt = x => `${f(x, 1)} soles`;
    return {
      enunciado: ['En una feria, Rosa gasta x soles y Luis gasta y soles. Se cumple ', ...igualdad, `, y entre los dos gastan a lo más ${T} soles.`],
      pregunta: ['¿Cuánto es lo más que puede gastar Luis?'],
      datos,
      correcta: ans, fmt,
      errores: [
        en('AL32', T / 2, fmt, x => `Bien que iguales exponentes. Pero ${a} y ${b} son bases distintas: primero se pasan a base ${p}; con x = y sale ${x}.`),
        en('TAL-EXP-INVIERTE', k2 * T / s, fmt, x => `Bien que pases todo a base ${p}: ${k1}x = ${k2}y. Pero de ahí x es ${k2}/${k1} de y, no al revés; con la razón invertida sale ${x}.`),
        en('TAL-EXP-ELEVAR', (T - k2 + k1) / 2, fmt, x => `Bien que pases ${a} a ${pot(p, k1)}. Pero (${pot(p, k1)})ˣ es ${p} elevado a ${k1}x, no a ${k1} + x; así sale ${x}.`),
        en('TAL-EXP-PARTE', T / s, fmt, x => `Bien la razón: x e y van como ${k2} : ${k1}, ${s} partes en total. Pero Luis se lleva ${k1} partes; una sola parte da ${x}.`),
      ],
      solucion: [
        paso1,
        [`De ${k1}x = ${k2}y, x e y están en la razón ${k2} : ${k1}: entre los dos son ${s} partes, y ${s} partes valen a lo más ${T} soles.`],
        [`Una parte vale a lo más ${T} ÷ ${s} = ${f(T / s, 1)} soles, y Luis se lleva ${k1}: a lo más `, R(fmt(ans)), '.'],
      ],
      nombres: { m: 'el exponente x', n: 'el exponente y' },
      _datos: { sub, p, k1, k2, T },
    };
  }

  // ======================= Idea 2: la raíz cuadrada es un lado =======================

  function raizCuadrado(rng, forzado) {
    const sub = forzado || rng.elegir(['cuadrado', 'cuadrado', 'cubo']);
    const t = s => ({ clave: s, texto: s });
    if (sub === 'cuadrado') {
      const k = rng.entero(2, 12), kk = k * k;
      return {
        enunciado: [`Se sabe que x = −${k}.`],
        pregunta: ['¿Cuánto vale √(x²)?'],
        datos: [D.raiz],
        correcta: t(String(k)),
        errores: [
          e('TAL-RAIZ-X', `−${k}`, `−${k}`, x => `Bien que eleves x al cuadrado: (−${k})² = ${kk}. Pero √${kk} = ${k}; la raíz cuadrada no es negativa, y ${x} lo es.`),
          e('TAL-RAIZ-DOBLE', `±${k}`, `±${k}`, x => `Bien que pienses en ${k} y −${k}: los dos al cuadrado dan ${kk}. Pero √ da un solo número, el no negativo; ${x} son dos.`),
          e('TAL-RAIZ-FALTA', String(kk), String(kk), x => `Bien calculado x² = ${kk}. Pero ${x} es lo de adentro: falta sacarle la raíz.`),
        ],
        solucion: [
          [`Primero el cuadrado: (−${k})² = ${kk}.`],
          [`Después la raíz, que no es negativa: √${kk} = `, R(String(k)), '.'],
        ],
        _datos: { sub, k },
      };
    }
    const k = rng.entero(2, 6), k3 = k ** 3;
    return {
      enunciado: [`Se sabe que x = −${k}.`],
      pregunta: ['¿Cuánto vale ³√(x³)?'],
      datos: [D.cubica],
      correcta: t(`−${k}`),
      errores: [
        e('TAL-RAIZ-CUBICA', String(k), String(k), x => `Bien que eleves y saques la raíz. Pero la raíz cúbica de un negativo es negativa: (−${k})³ = −${k3}, y ${x} al cubo da ${k3}.`),
        e('TAL-RAIZ-DOBLE', `±${k}`, `±${k}`, x => `Bien que pienses en el signo. Pero solo −${k} al cubo da −${k3}; ${x} trae un número de más.`),
        e('TAL-RAIZ-FALTA', `−${k3}`, `−${k3}`, x => `Bien calculado x³ = −${k3}. Pero ${x} es lo de adentro: falta sacarle la raíz cúbica.`),
      ],
      solucion: [
        [`Primero el cubo: (−${k})³ = −${k3}.`],
        [`Después la raíz cúbica: el número que al cubo da −${k3} es `, R(`−${k}`), '.'],
      ],
      _datos: { sub, k },
    };
  }

  function productoRaices(rng, forzado) {
    const sub = forzado || rng.elegir(['producto', 'cociente']);
    const t = s => ({ clave: s, texto: s });
    if (sub === 'producto') {
      const [a, b] = rng.elegir([[2, 8], [3, 12], [2, 18], [3, 27], [5, 20], [8, 18], [6, 24], [2, 32], [12, 27], [2, 50], [3, 48]]), k = Math.sqrt(a * b);
      return {
        enunciado: ['Se tiene el producto √', A(a), ' · √', B(b), '.'],
        pregunta: ['¿Cuánto vale?'],
        datos: [D.prodRaiz],
        correcta: t(String(k)),
        errores: [
          e('AL9', `√${a + b}`, `√${a + b}`, x => `Bien que juntes todo en una sola raíz. Pero se multiplica, ${a} · ${b}; sumar da ${x}.`),
          e('TAL-RAIZ-FALTA', String(a * b), String(a * b), x => `Bien el producto ${a} · ${b} = ${a * b}. Pero ${x} todavía está dentro de la raíz: falta sacarla.`),
          e('TAL-RAIZ-DOBLE', `±${k}`, `±${k}`, x => `Bien la cuenta: √${a * b} = ${k}. Pero una raíz cuadrada da un solo número, el no negativo; ${x} son dos.`),
        ],
        solucion: [
          ['Las raíces se juntan en un producto: √', A(a), ' · √', B(b), ` = √(${a} · ${b}) = √${a * b}.`],
          [`Como ${k} · ${k} = ${a * b}, vale `, R(String(k)), '.'],
        ],
        _datos: { sub, a, b },
      };
    }
    const [a, b] = rng.elegir([[72, 2], [75, 3], [98, 2], [108, 3], [80, 5], [147, 3], [128, 2], [45, 5], [200, 2], [192, 3]]), k = Math.sqrt(a / b);
    return {
      enunciado: ['Se tiene el cociente √', A(a), ' ÷ √', B(b), '.'],
      pregunta: ['¿Cuánto vale?'],
      datos: [D.cocRaiz],
      correcta: t(String(k)),
      errores: [
        e('AL9', `√${a - b}`, `√${a - b}`, x => `Bien que juntes todo en una sola raíz. Pero se divide, ${a} ÷ ${b}; restar da ${x}.`),
        e('TAL-RAIZ-FALTA', String(a / b), String(a / b), x => `Bien el cociente ${a} ÷ ${b} = ${a / b}. Pero ${x} todavía está dentro de la raíz: falta sacarla.`),
        e('TAL-RAIZ-DOBLE', `±${k}`, `±${k}`, x => `Bien la cuenta: √${a / b} = ${k}. Pero una raíz cuadrada da un solo número, el no negativo; ${x} son dos.`),
      ],
      solucion: [
        ['Las raíces se juntan en un cociente: √', A(a), ' ÷ √', B(b), ` = √(${a} ÷ ${b}) = √${a / b}.`],
        [`Como ${k} · ${k} = ${a / b}, vale `, R(String(k)), '.'],
      ],
      _datos: { sub, a, b },
    };
  }

  function biohuertos(rng) {
    const [p, q, h] = rng.elegir([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [12, 16, 20]]);
    const fmt = x => `${Math.abs(x * 100 - Math.round(x * 100)) < 1e-9 ? '' : '≈ '}${f(x)} m`;
    return {
      enunciado: ['El colegio tiene un biohuerto cuadrado de ', A(`${p * p} m²`), ' y otro de ', B(`${q * q} m²`), '. Los junta en uno solo, también cuadrado, con la misma área total.'],
      pregunta: ['¿Cuánto mide el lado del biohuerto junto?'],
      datos: [D.lado],
      correcta: h, fmt,
      errores: [
        en('AL9', p + q, fmt, x => `Bien que saques la raíz de cada área: ${p} y ${q}. Pero la raíz de una suma no es la suma de raíces; ${x} es lo que miden los dos lados seguidos.`),
        en('TAL-RAIZ-FALTA', p * p + q * q, fmt, x => `Bien la suma de áreas: ${p * p} + ${q * q} = ${h * h} m². Pero ${x} confunde área con lado: falta sacarle la raíz.`),
        en('TAL-RAIZ-CUARTO', (p * p + q * q) / 4, fmt, x => `Bien la suma de áreas, ${h * h} m². Pero el lado no es el área entre 4; ${x} sale de dividir entre 4, como con un perímetro.`),
        en('TAL-RAIZ-LADOS', Math.sqrt(p + q), fmt, x => `Bien que el lado salga de una raíz. Pero la raíz es del área, ${h * h} m², no de los lados ${p} + ${q}; así sale ${x}.`),
      ],
      solucion: [
        ['Se suman las áreas: ', A(p * p), ' + ', B(q * q), ` = ${h * h} m².`],
        [`El lado es la raíz del área: √${h * h} = `, R(fmt(h)), `, porque ${h} · ${h} = ${h * h}.`],
      ],
      _datos: { p, q },
    };
  }

  function simplificar(rng) {
    const c = rng.elegir([4, 6, 8, 9, 10, 12]), t = rng.elegir([2, 3, 5, 6, 7]), Nn = c * c * t;
    if (Nn > 1100) return null;
    const s = [2, 3].find(d => c % d === 0), r = (k, dentro) => `${k === 1 ? '' : k}√${dentro}`;
    const tx = (k, dentro) => ({ clave: `${k}r${dentro}`, texto: r(k, dentro) });
    const err = (id, k, dentro, ex) => { const o = tx(k, dentro); return e(id, o.clave, o.texto, ex); };
    return {
      enunciado: [`Se tiene la raíz √${Nn}.`],
      pregunta: ['¿Cómo queda simplificada del todo?'],
      datos: [D.prodRaiz, D.cuadrados],
      correcta: tx(c, t),
      errores: [
        err('TAL-RAIZ-INCOMPLETA', s, Nn / (s * s), x => `Bien que saques el ${s * s} como ${s}. Pero ${Nn / (s * s)} todavía tiene un cuadrado adentro; ${x} no está simplificada del todo.`),
        err('TAL-RAIZ-SALE', c * c, t, x => `Bien que separes ${Nn} = ${c * c} · ${t}. Pero el ${c * c} sale como su raíz, ${c}; ${x} lo saca sin la raíz.`),
        err('TAL-RAIZ-SIMP', t, c * c, x => `Bien que separes ${Nn} = ${c * c} · ${t}. Pero sale el cuadrado, ${c * c}, y el ${t} se queda adentro; ${x} saca el que no es cuadrado.`),
      ],
      solucion: [
        [`Se busca el cuadrado más grande que divide a ${Nn}: ${Nn} = ${c * c} · ${t}.`],
        [`√${Nn} = √${c * c} · √${t} = `, R(r(c, t)), '.'],
      ],
      _datos: { c, t },
    };
  }

  // Números irracionales con sus enteros vecinos (k < t < k + 1), como texto.
  const IRR = [['π', 3], ['√2', 1], ['√3', 1], ['√5', 2], ['√7', 2], ['√10', 3], ['√11', 3], ['√17', 4]];
  function restaCuadrado(rng, forzado) {
    const sub = forzado || rng.elegir(['una', 'dos']);
    const [ti, k] = rng.elegir(IRR), cmp = `${k} < ${ti} < ${k + 1}`;
    const t = s => ({ clave: s, texto: s });
    if (sub === 'una') {
      return {
        enunciado: [`Se sabe que ${cmp}.`],
        pregunta: [`¿Cómo se simplifica √((${k} − ${ti})²)?`],
        datos: [D.raizAbs, D.abs, cmp],
        correcta: t(`${ti} − ${k}`),
        errores: [
          e('TAL-RAIZ-X', `${k} − ${ti}`, `${k} − ${ti}`, x => `Bien que quites la raíz y el cuadrado juntos. Pero ${x} es negativo, y una raíz cuadrada no lo es.`),
          e('TAL-RAIZ-DOBLE', `±(${k} − ${ti})`, `±(${k} − ${ti})`, x => `Bien que pienses en el signo. Pero √ da un solo número, el no negativo; ${x} da dos.`),
          e('TAL-RAIZ-FALTA', `(${k} − ${ti})²`, `(${k} − ${ti})²`, x => `Bien copiado lo de adentro. Pero ${x} todavía es el cuadrado: falta sacarle la raíz.`),
        ],
        solucion: [
          [`√((${k} − ${ti})²) = |${k} − ${ti}|. Como ${k} < ${ti}, la resta ${k} − ${ti} es negativa.`],
          ['Su distancia al cero cambia el signo: ', R(`${ti} − ${k}`), '.'],
        ],
        _datos: { sub, t: ti, k },
      };
    }
    const k1 = k - rng.entero(0, 1), k2 = k + 1 + rng.entero(0, 1), d = k2 - k1;
    if (k1 < 1) return null;
    return {
      enunciado: [`Se sabe que ${cmp}.`],
      pregunta: [`¿Cuánto vale √((${k1} − ${ti})²) + √((${ti} − ${k2})²)?`],
      datos: [D.raizAbs, D.abs, cmp],
      correcta: t(String(d)),
      errores: [
        e('TAL-RAIZ-X', `−${d}`, `−${d}`, x => `Bien que quites cada raíz con su cuadrado. Pero ${k1} − ${ti} y ${ti} − ${k2} son negativos y cada raíz es positiva; copiarlos tal cual da ${x}.`),
        e('TAL-RAIZ-UNA', `2${ti} − ${k1 + k2}`, `2${ti} − ${k1 + k2}`, x => `Bien la primera: |${k1} − ${ti}| = ${ti} − ${k1}. Pero ${ti} − ${k2} también es negativo y se le cambia el signo; sin cambiarlo sale ${x}.`),
        e('TAL-RAIZ-DOBLE', `±${d}`, `±${d}`, x => `Bien la cuenta de las dos distancias. Pero cada √ da un solo número, el no negativo; ${x} da dos.`),
      ],
      solucion: [
        [`Cada raíz es una distancia: √((${k1} − ${ti})²) = |${k1} − ${ti}| = ${ti} − ${k1}, porque ${k1} < ${ti}.`],
        [`√((${ti} − ${k2})²) = |${ti} − ${k2}| = ${k2} − ${ti}, porque ${ti} < ${k2}.`],
        [`Se suman: (${ti} − ${k1}) + (${k2} − ${ti}) = `, R(String(d)), '.'],
      ],
      _datos: { sub, t: ti, k, k1, k2 },
    };
  }

  function semejantes(rng) {
    const t = rng.elegir([2, 3, 5]);
    let c1, c2, c3;
    do { c1 = rng.entero(2, 6); c2 = rng.entero(2, 6); c3 = rng.entero(2, 5); } while (c1 === c2 || c2 === c3 || c1 === c3 || c1 + c2 - c3 < 1 || c1 * c1 + c2 * c2 <= c3 * c3);
    const [N1, N2, N3] = [c1 * c1 * t, c2 * c2 * t, c3 * c3 * t], ex = c1 + c2 - c3;
    const rc = c => `${c === 1 ? '' : c}√${t}`, tx = s => ({ clave: s, texto: s });
    return {
      enunciado: ['Se tiene la expresión √', A(N1), ' + √', B(N2), ` − √${N3}.`],
      pregunta: ['¿Cómo queda simplificada?'],
      datos: [D.prodRaiz, D.semejantes, D.cuadrados],
      correcta: tx(rc(ex)),
      errores: [
        e('AL9', `√${N1 + N2 - N3}`, `√${N1 + N2 - N3}`, x => `Bien que quieras juntar las tres raíces en una. Pero eso vale en un producto, no en una suma; ${x} no es igual.`),
        e('TAL-SIGNO', rc(c1 + c2 + c3), rc(c1 + c2 + c3), x => `Bien simplificada cada raíz: ${rc(c1)}, ${rc(c2)} y ${rc(c3)}. Pero la última se resta; sumarla da ${x}.`),
        e('TAL-RAIZ-SALE', String(ex * t), String(ex * t), x => `Bien la cuenta ${c1} + ${c2} − ${c3} = ${ex}. Pero el ${t} se queda dentro de la raíz; ${x} lo saca.`),
      ],
      solucion: [
        ['Se saca de cada raíz su cuadrado: √', A(N1), ` = ${rc(c1)}, √`, B(N2), ` = ${rc(c2)} y √${N3} = ${rc(c3)}.`],
        [`Son raíces de ${t}: se suman como cosas iguales. ${c1} + ${c2} − ${c3} = ${ex}, así que queda `, R(rc(ex)), '.'],
      ],
      _datos: { t, c1, c2, c3 },
    };
  }

  // ======================= Idea 3: la raíz es un exponente fraccionario =======================

  function aRadical(rng, forzado) {
    const sub = forzado || rng.elegir(['a-potencia', 'a-raiz']);
    const n = rng.elegir([3, 4, 5, 7]), m = rng.elegir([2, 3, 4, 5, 6].filter(x => x !== n && mcd(x, n) === 1));
    const raizT = (i, ex) => rad(i, dentroX(ex));
    if (sub === 'a-potencia') {
      const err = (id, q, ex) => { const o = cPot('x', q); return e(id, o.clave, o.texto, ex); };
      return {
        enunciado: ['Se tiene la raíz ', N(sup(n)), '√(x', M(sup(m)), ').'],
        pregunta: ['¿Cómo se escribe con un exponente fraccionario?'],
        datos: [D.mn],
        correcta: cPot('x', Q(m, n)),
        errores: [
          err('TAL-FRAC-INVIERTE', Q(n, m), x => `Bien que uses ${m} y ${n} en una fracción. Pero el índice ${n} va abajo, porque la raíz divide; ${x} los pone al revés.`),
          err('TAL-EXP-POR', Q(m * n), x => `Bien que juntes ${m} y ${n} en el exponente. Pero sacar raíz divide el exponente entre ${n}; ${x} lo multiplica.`),
          err('TAL-FRAC-SUMA', Q(m - n), x => `Bien: la raíz cambia el exponente. Pero lo divide entre ${n}, no le resta ${n}; ${x} le resta.`),
        ],
        solucion: [
          ['El exponente de adentro, ', M(m), ', va arriba; el índice, ', N(n), ', va abajo.'],
          [raizT(n, m), ' = x', R(sup(`${m}/${n}`)), '.'],
        ],
        _datos: { sub, m, n },
      };
    }
    const tx = s => ({ clave: s, texto: s });
    return {
      enunciado: ['Se tiene la potencia x', M(sup(m)), N(sup(`/${n}`)), '.'],
      pregunta: ['¿Cómo se escribe como una raíz?'],
      datos: [D.mn],
      correcta: tx(raizT(n, m)),
      errores: [
        e('TAL-FRAC-INVIERTE', raizT(m, n), raizT(m, n), x => `Bien que escribas una raíz con ${m} y ${n}. Pero el índice es el de abajo, ${n}; ${x} los pone al revés.`),
        e('TAL-FRAC-MEDIO', raizT(n, 1), raizT(n, 1), x => `Bien el índice ${n} de la raíz. Pero falta el ${m} de arriba: ${x} es x elevado a 1/${n}.`),
        e('TAL-EXP-POR', `${m} · ${raizT(n, 1)}`, `${m} · ${raizT(n, 1)}`, x => `Bien el índice ${n} de la raíz. Pero el ${m} es un exponente de x, no un factor; ${x} multiplica por ${m}.`),
      ],
      solucion: [
        ['El de abajo, ', N(n), ', es el índice de la raíz; el de arriba, ', M(m), ', el exponente de adentro.'],
        [`x${sup(`${m}/${n}`)} = `, R(raizT(n, m)), '.'],
      ],
      _datos: { sub, m, n },
    };
  }

  function caja(rng, forzado) {
    const sub = forzado || rng.elegir(['arista', 'lado']);
    const err = (id, base, q, ex) => { const o = cPot(base, q); return e(id, o.clave, o.texto, ex); };
    if (sub === 'arista') {
      const V = rng.elegir([8, 27, 64, 125, 216, 343, 512, 729, 1000]);
      return {
        enunciado: [`Una caja cúbica de cartón tiene ${V} dm³ de volumen. Su arista es el número que, elevado al cubo, da ${V}.`],
        pregunta: [`¿Cómo se escribe la arista como una potencia de ${V}?`],
        datos: [D.cubo, D.uno],
        correcta: cPot(V, Q(1, 3)),
        errores: [
          err('TAL-FRAC-INVIERTE', V, Q(3), x => `Bien que uses el 3 del cubo. Pero la arista deshace el cubo; ${x} eleva al cubo otra vez.`),
          err('TAL-FRAC-NEG', V, Q(-3), x => `Bien que busques deshacer el cubo. Pero un exponente negativo indica dividir: ${x} es 1/${pot(V, 3)}, no la arista.`),
          err('TAL-FRAC-INDICE', V, Q(1, 2), x => `Bien que el exponente sea una fracción. Pero ${x} es la raíz cuadrada, la del lado de un cuadrado; la caja es un cubo.`),
        ],
        solucion: [
          ['Elevar a ', N('1/3'), ' deshace elevar al cubo: es la raíz cúbica.'],
          ['La arista es ', `${V}`, R(sup('1/3')), ` = ${rad(3, V)} = ${Math.round(V ** (1 / 3))} dm.`],
        ],
        _datos: { sub, V },
      };
    }
    const Ar = rng.elegir([16, 25, 36, 49, 64, 81, 100, 121, 144]);
    return {
      enunciado: [`Una loseta cuadrada tiene ${Ar} dm² de área. Su lado es el número que, elevado al cuadrado, da ${Ar}.`],
      pregunta: [`¿Cómo se escribe el lado como una potencia de ${Ar}?`],
      datos: [D.cuadrado, D.uno],
      correcta: cPot(Ar, Q(1, 2)),
      errores: [
        err('TAL-FRAC-INVIERTE', Ar, Q(2), x => `Bien que uses el 2 del cuadrado. Pero el lado deshace el cuadrado; ${x} eleva al cuadrado otra vez.`),
        err('TAL-FRAC-NEG', Ar, Q(-2), x => `Bien que busques deshacer el cuadrado. Pero un exponente negativo indica dividir: ${x} es 1/${pot(Ar, 2)}, no el lado.`),
        err('TAL-FRAC-INDICE', Ar, Q(1, 3), x => `Bien que el exponente sea una fracción. Pero ${x} es la raíz cúbica, la de la arista de un cubo; la loseta es un cuadrado.`),
      ],
      solucion: [
        ['Elevar a ', N('1/2'), ' deshace elevar al cuadrado: es la raíz cuadrada.'],
        ['El lado es ', `${Ar}`, R(sup('1/2')), ` = √${Ar} = ${Math.round(Math.sqrt(Ar))} dm.`],
      ],
      _datos: { sub, A: Ar },
    };
  }

  function valor(rng) {
    const [b, m, n] = rng.elegir([[8, 2, 3], [16, 3, 4], [32, 2, 5], [4, 3, 2], [9, 3, 2], [25, 3, 2], [64, 2, 3], [81, 3, 4], [125, 2, 3], [16, 5, 4], [27, 2, 3], [32, 3, 5]]);
    const r = Math.round(b ** (1 / n)), ans = r ** m, otro = b ** (n / m);
    const otroE = Math.abs(otro - Math.round(otro)) < 1e-9;
    const otroT = otroE ? String(Math.round(otro)) : `≈ ${f(otro, 1)}`;
    return {
      enunciado: ['Se tiene la potencia ', String(b), M(sup(m)), N(sup(`/${n}`)), '.'],
      pregunta: ['¿Cuánto vale?'],
      datos: [D.mn],
      correcta: cVal(Q(ans), true),
      errores: [
        e('TAL-EXP-POR', `=${qT(Q(b * m, n))}`, qT(Q(b * m, n)), x => `Bien que uses ${m}/${n}. Pero no se multiplica ${b} por ${m}/${n}; esa multiplicación da ${x}, y aquí se saca raíz y se eleva.`, b * m / n),
        e('TAL-FRAC-MEDIO', `=${r}`, String(r), x => `Bien la raíz: ${rad(n, b)} = ${r}. Pero falta elevarla a ${m}; ${x} se queda a medio camino.`, r),
        e('TAL-FRAC-INVIERTE', otroE ? `=${Math.round(otro)}` : `≈${f(otro, 1)}`, otroT, x => `Bien que saques raíz y eleves. Pero el índice es ${n}, el de abajo; con la fracción al revés sale ${x}.`, otro),
      ],
      solucion: [
        ['Primero la raíz de índice ', N(n), `, que sale exacta: ${rad(n, b)} = ${r}.`],
        ['Después la potencia: ', `${r}`, M(sup(m)), ' = ', R(String(ans)), '.'],
      ],
      _datos: { b, m, n },
    };
  }

  function productoFracc(rng) {
    const [n1, n2] = rng.barajar([2, 3, 4, 5]).slice(0, 2);
    const a = rng.entero(1, 4), b = rng.entero(1, 4);
    if (a === n1 || b === n2 || mcd(a, n1) !== 1 || mcd(b, n2) !== 1) return null;
    const ok = sumQ(Q(a, n1), Q(b, n2));
    const err = (id, q, ex) => { const o = cPot('x', q); return e(id, o.clave, o.texto, ex); };
    const r1 = rad(n1, dentroX(a)), r2 = rad(n2, dentroX(b));
    return {
      enunciado: ['Se tiene el producto ', r1, ' · ', r2, '.'],
      pregunta: ['¿Cómo se escribe como una sola potencia de x?'],
      datos: [D.mn, D.producto],
      correcta: cPot('x', ok),
      errores: [
        err('TAL-FRAC-SUMA', Q(a + b, n1 + n2), x => `Bien: en el producto se suman los exponentes ${a}/${n1} y ${b}/${n2}. Pero las fracciones no se suman arriba con arriba y abajo con abajo; así sale ${x}.`),
        err('TAL-EXP-PRODUCTO', Q(a * b, n1 * n2), x => `Bien que pases cada raíz a exponente: ${a}/${n1} y ${b}/${n2}. Pero en un producto los exponentes se suman; multiplicarlos da ${x}.`),
        err('TAL-FRAC-INVIERTE', sumQ(Q(n1, a), Q(n2, b)), x => `Bien que sumes los exponentes del producto. Pero en cada raíz el índice va abajo, ${a}/${n1}; con las fracciones al revés sale ${x}.`),
      ],
      solucion: [
        ['Cada raíz como potencia: ', r1, ` = x${sup(`${a}/${n1}`)} y `, r2, ` = x${sup(`${b}/${n2}`)}.`],
        [`En el producto se suman: ${a}/${n1} + ${b}/${n2} = ${qT(ok)}, así que queda x`, R(qS(ok)), '.'],
      ],
      _datos: { n1, n2, a, b },
    };
  }

  const LISTA_FRAC = [[8, 2, 3], [16, 3, 4], [32, 2, 5], [4, 3, 2], [9, 3, 2], [27, 1, 3], [64, 1, 2], [16, 1, 4], [81, 1, 2], [125, 1, 3], [27, 2, 3]];
  function sumaFracc(rng) {
    const [x1, x2, x3] = rng.barajar(LISTA_FRAC).slice(0, 3);
    const raiz = ([B0, , n]) => Math.round(B0 ** (1 / n)), val = t => raiz(t) ** t[1];
    const ans = val(x1) + val(x2) - val(x3);
    if (ans <= 0) return null;
    const pt = ([B0, m, n]) => `${B0}${sup(`${m}/${n}`)}`;
    const por = sumQ(sumQ(Q(x1[0] * x1[1], x1[2]), Q(x2[0] * x2[1], x2[2])), Q(-x3[0] * x3[1], x3[2]));
    const medio = raiz(x1) + raiz(x2) - raiz(x3), signo = val(x1) + val(x2) + val(x3);
    return {
      enunciado: ['Se tiene la expresión ', pt(x1), ' + ', pt(x2), ' − ', pt(x3), '.'],
      pregunta: ['¿Cuánto vale?'],
      datos: [D.mn],
      correcta: cVal(Q(ans), true),
      errores: [
        e('TAL-SIGNO', `=${signo}`, String(signo), x => `Bien cada valor: ${val(x1)}, ${val(x2)} y ${val(x3)}. Pero el último se resta; sumarlo da ${x}.`, signo),
        e('TAL-FRAC-MEDIO', `=${qT(Q(medio))}`, qT(Q(medio)), x => `Bien las raíces: ${raiz(x1)}, ${raiz(x2)} y ${raiz(x3)}. Pero falta elevar cada una a su numerador; así sale ${x}.`, medio),
        e('TAL-EXP-POR', `=${qT(por)}`, qT(por), x => `Bien que uses cada fracción. Pero no multiplica la base: es raíz y potencia; multiplicar da ${x}.`, qNum(por)),
      ],
      solucion: [
        ['Cada potencia: primero su raíz, después su exponente de arriba.'],
        [`${pt(x1)} = ${val(x1)}; ${pt(x2)} = ${val(x2)}; ${pt(x3)} = ${val(x3)}.`],
        [`${val(x1)} + ${val(x2)} − ${val(x3)} = `, R(String(ans)), '.'],
      ],
      _datos: { t1: x1, t2: x2, t3: x3 },
    };
  }

  function anidado(rng) {
    const [k, j] = rng.elegir([[2, 3], [2, 4], [3, 2], [2, 5], [3, 4]]);
    const a = rng.entero(1, 3), b = rng.entero(1, j - 1);
    if (mcd(b, j) !== 1) return null;
    const dentro = sumQ(Q(a), Q(b, j)), ok = Q(dentro.n, dentro.d * k);
    const err = (id, q, ex) => { const o = cPot('x', q); return e(id, o.clave, o.texto, ex); };
    const expr = `${rad(k, `(${xPot(a)} · ${rad(j, dentroX(b))})`)}`;
    return {
      enunciado: ['Se tiene la raíz ', expr, '.'],
      pregunta: ['¿Cómo se escribe como una sola potencia de x?'],
      datos: [D.mn, D.producto, D.potencia],
      correcta: cPot('x', ok),
      errores: [
        err('TAL-FRAC-AFUERA', dentro, x => `Bien que juntes ${xPot(a)} con la raíz de adentro: ${a} + ${b}/${j}. Pero falta la raíz de afuera, que divide todo entre ${k}; sin ella queda ${x}.`),
        err('TAL-FRAC-ANIDA', sumQ(Q(a, k), Q(b, j)), x => `Bien ${xPot(a)} dividido entre ${k}. Pero la raíz de afuera también divide al ${b}/${j}; dejarlo igual da ${x}.`),
        err('TAL-FRAC-SUMA', Q(a + b, k + j), x => `Bien que sumes exponentes en el producto. Pero las fracciones no se suman arriba con arriba y abajo con abajo; así sale ${x}.`),
      ],
      solucion: [
        ['De adentro hacia afuera. Adentro, el producto suma los exponentes: ', `${xPot(a)} · x${sup(`${b}/${j}`)} = x${qS(dentro)}`, '.'],
        ['La raíz de índice ', N(k), ` divide ese exponente entre ${k}: (${qT(dentro)}) ÷ ${k} = ${qT(ok)}, así que queda x`, R(qS(ok)), '.'],
      ],
      _datos: { k, j, a, b },
    };
  }

  function ecuacionRaiz(rng, forzado) {
    const sub = forzado || rng.elegir(['base2', 'base4']);
    const err = (id, q, ex) => { const o = cX(q); return e(id, o.clave, o.texto, ex); };
    if (sub === 'base2') {
      const n = rng.elegir([2, 3, 4]), k = rng.entero(2, 5), x0 = n * k;
      if (2 ** k === x0) return null;   // que el dato 2ᵏ no sea la respuesta
      return {
        enunciado: ['Se cumple ', ...(n === 2 ? [] : [N(sup(n))]), '√(2', M('ˣ'), `) = ${2 ** k}.`],
        pregunta: ['¿Cuánto vale x?'],
        datos: [`${2 ** k} = ${pot(2, k)}`, D.mn, D.igualar],
        correcta: cX(Q(x0)),
        errores: [
          err('TAL-FRAC-DIVIDE', Q(k, n), x => `Bien que iguales exponentes: x/${n} = ${k}. Pero se despeja multiplicando por ${n}; dividir da ${x}.`),
          err('TAL-FRAC-AFUERA', Q(k), x => `Bien que escribas ${2 ** k} como ${pot(2, k)}. Pero la raíz divide el exponente: queda x/${n}; sin dividir sale ${x}.`),
          err('TAL-EXP-SUMA', Q(k + n), x => `Bien que uses el ${k} y el índice ${n}. Pero la raíz divide entre ${n}, no se suma; así sale ${x}.`),
        ],
        solucion: [
          ['Todo como potencia de 2: ', rad(n, '(2ˣ)'), ` = 2${sup(`x/${n}`)} y ${2 ** k} = ${pot(2, k)}.`],
          [`Misma base: x/${n} = ${k}, así que `, R(`x = ${x0}`), '.'],
        ],
        _datos: { sub, n, k },
      };
    }
    const n = rng.elegir([2, 3, 4, 5]), k = rng.entero(2, 6);
    if ((n * k) % 2) return null;
    const x0 = n * k / 2;
    if (2 ** k === x0) return null;
    return {
      enunciado: ['Se cumple ', rad(n, '(4ˣ)'), ` = ${2 ** k}.`],
      pregunta: ['¿Cuánto vale x?'],
      datos: [`4 = ${pot(2, 2)} y ${2 ** k} = ${pot(2, k)}`, D.mn, D.potencia, D.igualar],
      correcta: cX(Q(x0)),
      errores: [
        err('TAL-FRAC-AFUERA', Q(k, 2), x => `Bien que pases 4 a ${pot(2, 2)}. Pero la raíz también divide el exponente entre ${n}; sin ella sale ${x}.`),
        err('AL32', Q(n * k), x => `Bien que la raíz divida entre ${n}. Pero 4 y 2 son bases distintas: antes, 4 se escribe ${pot(2, 2)}; saltarse ese paso da ${x}.`),
        err('TAL-EXP-ELEVAR', Q(n * k - 2), x => `Bien que pases 4 a ${pot(2, 2)}. Pero (${pot(2, 2)})ˣ es ${pot(2, '2x')}: se multiplica, no 2 + x; así sale ${x}.`),
      ],
      solucion: [
        ['Todo como potencia de 2: ', rad(n, '(4ˣ)'), ` = ${rad(n, '(2²ˣ)')} = 2${sup(`2x/${n}`)}.`],
        [`Misma base: 2x/${n} = ${k}, así que `, R(`x = ${x0}`), '.'],
      ],
      _datos: { sub, n, k },
    };
  }

  const CONSTRUIR = {
    'una-potencia': unaPotencia, hoja, negativo, elevar, dato, 'factor-comun': factorComun, 'misma-base': mismaBase,
    'dos-variables': dosVariables, 'raiz-cuadrado': raizCuadrado, 'producto-raices': productoRaices, biohuertos, simplificar,
    'resta-cuadrado': restaCuadrado, semejantes, 'a-radical': aRadical, caja, valor, 'producto-fracc': productoFracc,
    'suma-fracc': sumaFracc, anidado, 'ecuacion-raiz': ecuacionRaiz,
  };

  return { id: ID, titulo: 'Exponentes y radicales', generar, TIPOS_POR_IDEA, NIVEL, TIPOS: Object.keys(CONSTRUIR) };
});
