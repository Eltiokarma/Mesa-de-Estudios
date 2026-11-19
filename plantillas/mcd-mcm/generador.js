/*
 * Generador «Los rollos y la rifa»: práctica de «MCD y MCM» (aritmetica.mcd-y-mcm; contenido/teoria/aritmetica/
 * mcd-y-mcm.js), con tipos separados por idea. Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['mcd-mcm']) y en Node (require). No usa ningún motor: las cuentas son divisiones de enteros.
 *
 * Propuesta: docs/etapa7/propuesta-aritmetica.md §5 y §8 (Gerson delegó el criterio y la revisa después). Hilo, como en
 * la teoría: los rollos de cinta de la promoción, la rifa con dos premios y el paquete de doña Juana. Valores de
 * problema, sin fuente. Reemplaza, en esta unidad, los tipos pesi, euclides y pg-mcd de fracciones-problemas (que se
 * queda para Números racionales).
 *
 * Tipos por idea (TIPOS_POR_IDEA; nivel 1 básico, 2 intermedio, 3 examen). generar(semilla, { idea }) da solo los de esa
 * idea; sin idea, las seis con el mismo peso. La unidad es una sola: { unidad } no cambia nada.
 *   mcd-cintas       trozo (1) el trozo más largo · total (2) cuántos trozos · tres (2) tres rollos · decimales (3, San
 *                    Marcos 2024-II) largos en metros con decimales · estacas (3, San Marcos 2023-II) estacas de parcelas
 *   mcm-coinciden    boleto (1) el primer boleto con los dos premios · alarmas (2) a qué hora vuelven a sonar · tercera
 *                    (3, San Marcos 2026-II) la tercera coincidencia contando la de hoy · tomas (3, San Marcos 2025-I)
 *   mcd-por-mcm      otro (1) MCD × MCM = A × B · producto (2) el MCM desde el producto · diferencia (3, San Marcos
 *                    2019-II) la suma desde la diferencia y el MCM · pares (3) cuántos pares con un MCD y un MCM
 *   mismo-resto      mismo (1) el mismo resto con dos · falta (2, San Marcos 2026-II) restos distintos que se
 *                    homogeneizan · tres-cifras (3, San Marcos 2024-II) el menor de tres cifras · tercero (3, San Marcos
 *                    2023-I) y múltiplo de un tercero
 *   multiplos-tramo  ambos (1) los de los dos a la vez · alguno (2) los de uno o de otro · ninguno (2) los sin premio ·
 *                    tachar (3, San Marcos 2026-II) tachar los múltiplos de tres primos
 *   euclides         mcd (1) con divisiones sucesivas · fraccion (2) la fracción continua · valor (2) el valor de una
 *                    fracción continua · reconstruir (3, San Marcos 2027-I) los números desde los cocientes
 *
 * Notación (propuesta §6): A y B los números, MCD(A, B) y MCM(A, B), p y q los cocientes PESI, N el número que se busca,
 * r el resto; × para multiplicar, nunca «·»; potencias con superíndice (2³). Las alternativas son texto plano.
 * Colores: un color fijo por magnitud, el de la teoría (def.colores): el MCD y los divisores comunes en turquesa (d), el
 * MCM y los múltiplos comunes en violeta (m), lo que sobra en naranja (r). Una cantidad (cuántos, N) va en tinta. Lo
 * que se pide va en tinta en la pregunta. Sin verde ni carmín.
 * Datos (docs/plan-calidad.md §3, punto 13): la definición, la fórmula general o la propiedad de cada tipo; nunca el
 * paso hecho ni la respuesta.
 * Errores: AR13 (respaldo parcial en el informe) y los códigos AT-* de la teoría (hipótesis de aula; tabla «MCD y MCM
 * (19 nov)» de docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md).
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
  const ID = 'mcd-mcm';
  const UNIDAD = 'aritmetica.mcd-y-mcm';
  const v = P.v;
  const f0 = x => P.formatear(x, 0);
  const SUPD = '⁰¹²³⁴⁵⁶⁷⁸⁹', sup = x => [...String(x)].map(c => SUPD[c]).join('');
  const mcd = (x, y) => (y ? mcd(y, x % y) : x);
  const mcm = (x, y) => x / mcd(x, y) * y;
  const mcmL = xs => xs.reduce(mcm);
  const factores = x => { const o = []; for (let k = 2; x > 1; k++) { let e = 0; while (x % k === 0) { x /= k; e++; } if (e) o.push([k, e]); } return o; };
  const canon = N => factores(N).map(([p, e]) => (e > 1 ? `${p}${sup(e)}` : String(p))).join(' × ');
  const euclides = (a, b) => { const o = []; while (b) { o.push({ a, b, q: Math.floor(a / b), r: a % b }); [a, b] = [b, a % b]; } return o; };
  const yLista = xs => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} y ${xs[xs.length - 1]}` : String(xs[0]));
  const cuenta = (L, d) => Math.floor(L / d);

  const Dv = x => v('d', typeof x === 'number' ? f0(x) : String(x));
  const Mv = x => v('m', typeof x === 'number' ? f0(x) : String(x));
  const Rv = x => v('r', typeof x === 'number' ? f0(x) : String(x));
  const VARS = { d: { nombre: 'el MCD o un divisor común: lo que entra exacto en todos', color: 'i' },
    m: { nombre: 'el MCM o un múltiplo común: donde todos entran exacto', color: 'f' },
    r: { nombre: 'lo que sobra: el resto', color: 'o' } };

  const h = (id, valor, explicacion, fmt = f0) =>
    (valor === undefined || valor === null || (typeof valor === 'number' && (!Number.isFinite(valor) || valor < 0)) ? null
      : { id, clave: String(fmt(valor)), texto: String(fmt(valor)), explicacion, respaldo: id === 'AR13' ? 'parcial' : 'hipotesis', fuente: null });

  const D = {
    mcd: 'MCD(A, B): el mayor número que divide exacto a A y a B',
    facD: 'Con primos: el MCD lleva los primos comunes, cada uno con su menor exponente',
    trozos: 'Trozos que salen de una cinta: el largo de la cinta ÷ el largo del trozo',
    tres: 'El MCD de tres números es el mayor que divide exacto a los tres',
    cm: '1 m = 100 cm',
    lado: 'Parcelas que caben en un lado: el largo de ese lado ÷ el lado de la parcela',
    mcm: 'MCM(A, B): el menor múltiplo común de A y B, sin contar el 0',
    facM: 'Con primos: el MCM lleva todos los primos que aparecen, cada uno con su mayor exponente',
    otros: 'Los múltiplos comunes de A y B son los múltiplos de su MCM',
    hora: '1 h = 60 min',
    partida: 'Si coinciden al empezar, esa es la primera vez que coinciden',
    tomas: 'Tomas de una medicina, contando la primera: las horas ÷ cada cuántas horas, más 1',
    prod: 'Con dos números: MCD(A, B) × MCM(A, B) = A × B',
    coc: 'A = MCD × p y B = MCD × q: p y q son los cocientes, y son PESI',
    mcmC: 'MCM(A, B) = MCD × p × q',
    dif: 'La diferencia de los dos: MCD × q − MCD × p = MCD × (q − p)',
    pesi: 'p y q PESI: no comparten ningún primo (no tienen que ser primos)',
    forma: 'N = un múltiplo de A + r: al dividir N entre A sobran r',
    comun: 'Si N − r es múltiplo de A y de B, también es múltiplo de MCM(A, B)',
    lista: 'Los que dejan resto r con A y con B: MCM(A, B) × k + r, con k = 0, 1, 2…',
    falta: 'Si a N le faltan rₑ para otro grupo de A: N + rₑ es múltiplo de A',
    cifras: 'Los números de tres cifras van del 100 al 999',
    cuantos: L => `Del 1 al ${L} hay tantos múltiplos de un número como el cociente entero de ${L} ÷ ese número`,
    ambos: 'Los múltiplos de A y de B a la vez son los múltiplos de MCM(A, B)',
    ie: 'Múltiplos de A o de B: los de A + los de B − los de los dos',
    ninguno: 'Los que no son de A ni de B: el total menos los de A o de B',
    ie3: 'De A, de B o de C: los de cada uno − los de cada par + los de los tres',
    div: 'Al dividir A entre B: A = B × cociente + resto, con el resto menor que B',
    euc: 'Si al dividir A entre B sobra r: MCD(A, B) = MCD(B, r); se sigue hasta resto 0',
    fc: 'Fracción continua: A/B = cociente + 1/(B/r), y se sigue igual con B/r',
    fcNot: 'Se anota [2; 1, 3]: primero la parte entera y, después, los demás cocientes',
    atras: 'Hacia atrás: cada dividendo es su divisor × el cociente + el resto',
  };

  const TIPOS_POR_IDEA = {
    'mcd-cintas': ['trozo', 'total', 'tres', 'decimales', 'estacas'],
    'mcm-coinciden': ['boleto', 'alarmas', 'tercera', 'tomas'],
    'mcd-por-mcm': ['otro', 'producto', 'diferencia', 'pares'],
    'mismo-resto': ['mismo', 'falta', 'tres-cifras', 'tercero'],
    'multiplos-tramo': ['ambos', 'alguno', 'ninguno', 'tachar'],
    euclides: ['mcd', 'fraccion', 'valor', 'reconstruir'],
  };
  const IDEAS = Object.keys(TIPOS_POR_IDEA);
  const IDEA_DE = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map(t => [t, i])));
  const TIPOS_POR_UNIDAD = { [UNIDAD]: IDEAS.flatMap(i => TIPOS_POR_IDEA[i]) };
  const NIVEL = { trozo: 1, total: 2, tres: 2, decimales: 3, estacas: 3, boleto: 1, alarmas: 2, tercera: 3, tomas: 3,
    otro: 1, producto: 2, diferencia: 3, pares: 3, mismo: 1, falta: 2, 'tres-cifras': 3, tercero: 3,
    ambos: 1, alguno: 2, ninguno: 2, tachar: 3, mcd: 1, fraccion: 2, valor: 2, reconstruir: 3 };
  // Papel (regla 6; herramientas/papel-generador.js usa «papel-1» a «papel-8» y rotula 3 básicos, 3 intermedios y 2
  // avanzados): una pregunta de cada idea, y las dos de examen son de San Marcos (2026-II y 2024-II).
  const PAPEL = { 'papel-1': 'trozo', 'papel-2': 'boleto', 'papel-3': 'otro', 'papel-4': 'alguno',
    'papel-5': 'falta', 'papel-6': 'fraccion', 'papel-7': 'tercera', 'papel-8': 'tres-cifras' };

  function generar(semilla, opciones) {
    const o = typeof opciones === 'string' ? { unidad: opciones } : opciones || {};
    const rng = Azar.crear(ID + '|' + semilla);
    const forzado = !o.idea && PAPEL[String(semilla)];
    let tipo;
    if (forzado) tipo = forzado;
    else { const idea = TIPOS_POR_IDEA[o.idea] ? o.idea : rng.elegir(IDEAS); tipo = rng.elegir(TIPOS_POR_IDEA[idea]); }
    for (let intento = 0; intento < 800; intento++) {
      const pr = CONSTRUIR[tipo](rng);
      const p = pr && cerrar(semilla, tipo, pr, rng);
      if (p) return p;
    }
    throw new Error(`No se pudo generar un problema de ${tipo} con 4 alternativas distintas`);
  }
  function cerrar(semilla, tipo, o, rng) {
    const fmt = o.fmt || f0, ct = String(fmt(o.correcta));
    const errores = o.errores.filter(e => e && e.clave !== ct);
    let alternativas;
    try { alternativas = P.armarTexto({ correcta: { clave: ct, texto: ct }, errores, rng }); } catch (e) { return null; }
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
  // Dos números con MCD g y cocientes PESI distintos (ninguno divide al otro).
  function dos(rng, gs, tope) {
    for (;;) { const g = rng.elegir(gs), m = rng.entero(2, 8), n = rng.entero(2, 9); if (m !== n && mcd(m, n) === 1 && g * Math.max(m, n) <= tope) return { g, m, n, A: g * m, B: g * n }; }
  }
  const menorPrimo = x => factores(x)[0][0];

  // ======================= Idea 1: MCD =======================
  function trozo(rng) {
    const { g, m, n, A, B } = dos(rng, [4, 6, 8, 9, 10, 12, 14, 15], 150), s = menorPrimo(g), lo = Math.min(A, B), hi = Math.max(A, B);
    return {
      enunciado: [`Dos rollos de cinta miden ${A} m y ${B} m. Se cortan en trozos iguales, lo más largos posible, sin que sobre nada.`],
      pregunta: ['¿Cuánto mide cada trozo?'],
      datos: [D.mcd, D.facD], fmt: x => `${f0(x)} m`,
      correcta: g,
      errores: [
        h('AR13', mcm(A, B), 'Bien buscar algo común. Pero ese número es más largo que los rollos: junta, no corta.', x => `${f0(x)} m`),
        h('AT-NOMAX', g / s, `Bien: ${g / s} m entra exacto en los dos. Pero ${g} m también entra, y es más largo.`, x => `${f0(x)} m`),
        h('AT-MENOR', lo, `Bien para el rollo de ${lo} m. Pero en el de ${hi} m sobran ${hi % lo} m.`, x => `${f0(x)} m`),
      ],
      solucion: [[`${A} = ${m} × ${g} y ${B} = ${n} × ${g}; ${m} y ${n} son PESI.`], ['Cada trozo mide ', Dv(`${g} m`), '.']],
      _datos: { A, B },
    };
  }
  function total(rng) {
    const { g, m, n, A, B } = dos(rng, [4, 6, 8, 9, 10, 12, 15], 150), s = menorPrimo(g);
    return {
      enunciado: [`Dos rollos de cinta miden ${A} m y ${B} m. Se cortan en trozos iguales, lo más largos posible, sin que sobre nada.`],
      pregunta: ['¿Cuántos trozos salen en total?'],
      datos: [D.mcd, D.facD, D.trozos],
      correcta: m + n,
      errores: [
        h('AT-PREGUNTA', g, `Bien hallar el trozo de ${g} m. Pero se pide cuántos trozos salen.`),
        h('AT-NOMAX', s * (m + n), `Bien contar los de cada rollo. Pero con trozos de ${g / s} m no son los más largos.`),
        h('AT-TROZOS-PRODUCTO', m * n, `Bien los ${m} y ${n} trozos de cada rollo. Pero se suman, no se multiplican.`),
      ],
      solucion: [['El trozo es el MCD: ', Dv(`${g} m`), '.'], [`${A} ÷ ${g} + ${B} ÷ ${g} = ${m} + ${n} = ${m + n} trozos.`]],
      _datos: { A, B },
    };
  }
  function tres(rng) {
    const g = rng.elegir([2, 3, 4, 5, 6]), xs = [];
    while (xs.length < 3) { const k = rng.entero(2, 15); if (!xs.includes(k)) xs.push(k); }
    const [A, B, C] = xs.map(k => g * k);
    if (xs.reduce(mcd) !== 1 || Math.max(A, B, C) > 120) return null;
    const d2 = mcd(A, B);
    if (d2 === g || C % d2 === 0) return null;
    return {
      enunciado: [`Tres rollos miden ${A} m, ${B} m y ${C} m. Se cortan en trozos iguales, lo más largos posible, sin que sobre nada.`],
      pregunta: ['¿Cuánto mide cada trozo?'],
      datos: [D.facD, D.tres], fmt: x => `${f0(x)} m`,
      correcta: g,
      errores: [
        h('AT-MCD-DOS', d2, `Bien para los rollos de ${A} y ${B} m. Pero en el de ${C} m sobran ${C % d2} m.`, x => `${f0(x)} m`),
        h('AR13', mcmL([A, B, C]), 'Bien buscar algo común. Pero ese número es más largo que los rollos: junta, no corta.', x => `${f0(x)} m`),
        h('AT-NOMAX', 1, `Bien: 1 m entra exacto en los tres. Pero ${g} m también entra, y es más largo.`, x => `${f0(x)} m`),
      ],
      solucion: [[`Los tres son ${g} por ${yLista(xs)}, que no tienen un primo en los tres.`], ['Cada trozo mide ', Dv(`${g} m`), '.']],
      _datos: { A, B, C },
    };
  }
  function decimales(rng) {
    const g = rng.elegir([15, 25, 35, 45, 75]), m = rng.entero(2, 9), n = rng.entero(2, 9);
    if (m === n || mcd(m, n) !== 1) return null;
    const A = g * m, B = g * n;
    if (A % 10 !== 0 || A % 100 === 0 || B % 10 === 0 || A > 900 || B > 900) return null;
    const mal = mcd(A / 10, B);
    if (mal === g) return null;
    const cm = x => `${f0(x)} cm`, m2 = x => P.formatear(x / 100, 2);
    return {
      enunciado: [`Un rollo de cinta mide ${m2(A)} m y otro, ${m2(B)} m. Se cortan en trozos iguales, lo más largos posible, sin que sobre nada.`],
      pregunta: ['¿Cuánto mide cada trozo?'],
      datos: [D.cm, D.mcd, D.facD], fmt: cm,
      correcta: g,
      errores: [
        h('AT-MCD-UNIDAD', mal, `Bien quitar las comas. Pero ${m2(A)} m son ${A} cm, no ${A / 10}: los dos largos van en centímetros.`, cm),
        h('AT-NOMAX', g / menorPrimo(g), `Bien: entra exacto en los dos. Pero ${g} cm también entra, y es más largo.`, cm),
        h('AR13', mcm(A, B), 'Bien buscar algo común. Pero ese número es más largo que los rollos: junta, no corta.', cm),
      ],
      solucion: [[`En centímetros: ${A} = ${m} × ${g} y ${B} = ${n} × ${g}.`], ['Cada trozo mide ', Dv(`${g} cm`), '.']],
      _datos: { A, B },
    };
  }
  function estacas(rng) {
    const { g, m, n, A, B } = dos(rng, [4, 6, 8, 10, 12, 15], 180);
    return {
      enunciado: [`Un terreno de ${A} m por ${B} m se divide en parcelas cuadradas iguales, lo más grandes posible. Se pone una estaca en cada esquina de cada parcela.`],
      pregunta: ['¿Cuántas estacas se usan?'],
      datos: [D.mcd, D.facD, D.lado],
      correcta: (m + 1) * (n + 1),
      errores: [
        h('AT-PARCELA-SUMA', m * n, `Bien el lado de las parcelas. Pero ${m * n} son las parcelas; las estacas van una más por lado.`),
        h('AT-ESTACA-BORDE', 2 * (m + n), 'Bien contar las del borde. Pero también hay estacas adentro, en cada cruce.'),
        h('AT-ESTACA-UNA', (m + 1) * n, `Bien una más en un lado. Pero también en el otro: ${n + 1}, no ${n}.`),
      ],
      solucion: [['El lado de cada parcela es el MCD, ', Dv(`${g} m`), `: ${m} por ${n} parcelas.`], [`Estacas: ${m + 1} × ${n + 1} = ${(m + 1) * (n + 1)}.`]],
      _datos: { A, B },
    };
  }

  // ======================= Idea 2: MCM =======================
  function boleto(rng) {
    const a = rng.entero(4, 16), b = rng.entero(a + 1, 20), g = mcd(a, b), M = mcm(a, b);
    if (g === 1 || b % a === 0) return null;
    return {
      enunciado: [`En una rifa, ganan caramelo los boletos múltiplos de ${a} y gaseosa los múltiplos de ${b}.`],
      pregunta: ['¿Cuál es el primer boleto que gana los dos premios?'],
      datos: [D.mcm, D.facM],
      correcta: M,
      errores: [
        h('AR13', g, `Bien buscar lo que comparten. Pero el ${g} no es múltiplo de ${a}: no gana caramelo.`),
        h('AT-PRODUCTO', a * b, `Bien: el ${a * b} es múltiplo de los dos. Pero el ${M} también, y llega antes.`),
        h('AT-SUMA', a + b, `Bien juntar los dos números. Pero ${a + b} no es múltiplo de ${a}.`),
      ],
      solucion: [[`${a} = ${canon(a)} y ${b} = ${canon(b)}: todos los primos, con su mayor exponente.`], [`MCM = ${canon(M)} = `, Mv(M), '.']],
      _datos: { a, b },
    };
  }
  const hora = (h0, min) => { const t = h0 * 60 + min; return `${Math.floor(t / 60) % 24}:${String(t % 60).padStart(2, '0')}`; };
  function alarmas(rng) {
    const xs = [6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 40, 45], a = rng.elegir(xs), b = rng.elegir(xs), g = mcd(a, b), M = mcm(a, b);
    if (b <= a || g === 1 || b % a === 0 || M > 180 || a * b > 600) return null;
    const h0 = rng.elegir([6, 7, 8, 9]), fh = x => hora(h0, x);
    return {
      enunciado: [`Dos alarmas sonaron juntas a las ${h0}:00. Una suena cada ${a} minutos y la otra cada ${b}.`],
      pregunta: ['¿A qué hora vuelven a sonar juntas?'],
      datos: [D.mcm, D.facM, D.hora], fmt: fh,
      correcta: M,
      errores: [
        h('AR13', g, `Bien buscar lo común. Pero ${g} min divide a los dos: a esa hora no suena ninguna.`, fh),
        h('AT-PRODUCTO', a * b, `Bien: a esa hora suenan juntas. Pero ya lo hicieron antes, a los ${M} min.`, fh),
        h('AT-SUMA', a + b, `Bien juntar los dos tiempos. Pero ${a + b} min no es múltiplo de ${a}.`, fh),
      ],
      solucion: [[`MCM(${a}, ${b}) = ${canon(M)} = `, Mv(`${M} min`), '.'], [`${h0}:00 + ${M} min = ${fh(M)}.`]],
      _datos: { a, b, h0 },
    };
  }
  function tercera(rng) {
    const a = rng.entero(4, 15), b = rng.entero(a + 1, 18), g = mcd(a, b), M = mcm(a, b);
    if (g === 1 || b % a === 0 || M > 90) return null;
    const dias = x => `${f0(x)} días`;
    return {
      enunciado: [`Dos camiones de reparto llegan juntos hoy al mercado. Uno llega cada ${a} días y el otro cada ${b}.`],
      pregunta: ['¿Dentro de cuántos días llegan juntos por tercera vez, contando la de hoy?'],
      datos: [D.mcm, D.otros, D.partida], fmt: dias,
      correcta: 2 * M,
      errores: [
        h('AT-CUENTA-HOY', 3 * M, `Bien: coinciden cada ${M} días. Pero la de hoy ya es la primera vez.`, dias),
        h('AT-PRIMERA', M, `Bien: a los ${M} días vuelven a coincidir. Pero esa es la segunda vez.`, dias),
        h('AT-PRODUCTO', 2 * a * b, `Bien contar dos más. Pero coinciden cada ${M} días, no cada ${a * b}.`, dias),
      ],
      solucion: [['Coinciden cada MCM = ', Mv(`${M} días`), '; hoy es la primera vez.'], [`La tercera: 2 × ${M} = ${2 * M} días.`]],
      _datos: { a, b },
    };
  }
  function tomas(rng) {
    const xs = [2, 3, 4, 6, 8, 12], a = rng.elegir(xs), b = rng.elegir(xs), c = rng.elegir(xs);
    if (!(a < b && b < c)) return null;
    const M = mcmL([a, b, c]);
    if (M > 24 || M === c) return null;
    const T = 2 * M, t = H => H / a + H / b + H / c + 3;
    return {
      enunciado: [`Un paciente toma tres medicinas: cada ${a}, cada ${b} y cada ${c} horas. A las 8:00 tomó las tres juntas.`],
      pregunta: ['Hasta la tercera vez que las toma juntas, contando la de las 8:00, ¿cuántas tomas hace?'],
      datos: [D.otros, D.partida, D.tomas],
      correcta: t(T),
      errores: [
        h('AT-SIN-INICIAL', t(T) - 3, 'Bien las horas y contar cada medicina. Pero falta la toma de las 8:00 de cada una.'),
        h('AT-CUENTA-HOY', t(3 * M), `Bien contar las tomas. Pero ${3 * M} horas llega a la cuarta vez juntas.`),
        h('AT-PRIMERA', t(M), `Bien contar las de las 8:00. Pero ${M} horas llega solo a la segunda vez juntas.`),
      ],
      solucion: [['Juntas cada MCM = ', Mv(`${M} h`), `: la tercera vez, ${T} h después.`], [`${T / a + 1} + ${T / b + 1} + ${T / c + 1} = ${t(T)} tomas.`]],
      _datos: { a, b, c },
    };
  }

  // ======================= Idea 3: MCD × MCM y los cocientes =======================
  function otro(rng) {
    const g = rng.elegir([2, 3, 4, 5, 6, 8, 9, 12]), p = rng.entero(2, 9), q = rng.entero(2, 11);
    if (p === q || mcd(p, q) !== 1) return null;
    const A = g * p, B = g * q, M = g * p * q;
    if (M > 400 || M / g === B) return null;
    return {
      enunciado: [`El MCD de dos números es ${g} y su MCM es ${M}. Uno de ellos es ${A}.`],
      pregunta: ['¿Cuál es el otro?'],
      datos: [D.prod],
      correcta: B,
      errores: [
        h('AT-REL-SIN-MCD', M / A, `Bien dividir entre ${A}. Pero se divide MCD × MCM = ${g * M}, no solo el MCM.`),
        h('AT-REL-MULTIPLICA', g * M, `Bien: MCD × MCM = ${g * M}. Pero eso es A × B: falta dividir entre ${A}.`),
        h('AT-REL-COCIENTE', M / g, `Bien usar el MCD y el MCM. Pero ${M} ÷ ${g} es p × q, no el otro número.`),
      ],
      solucion: [[`${A} × B = ${g} × ${M} = ${g * M}.`], [`B = ${g * M} ÷ ${A} = ${B}.`]],
      _datos: { g, M, A },
    };
  }
  function producto(rng) {
    const g = rng.elegir([2, 3, 4, 5, 6, 7, 8]), p = rng.entero(1, 7), q = rng.entero(p + 1, 12);
    if (mcd(p, q) !== 1 || p * q < 4) return null;
    const Pp = g * g * p * q, M = g * p * q;
    if (Pp > 2000) return null;
    return {
      enunciado: [`Dos números multiplicados dan ${f0(Pp)} y su MCD es ${g}.`],
      pregunta: ['¿Cuál es su MCM?'],
      datos: [D.prod],
      correcta: M,
      errores: [
        h('AT-REL-MULTIPLICA', Pp * g, 'Bien usar el producto y el MCD. Pero el MCM sale de dividir, no de multiplicar.'),
        h('AT-REL-DOS-VECES', p * q, `Bien dividir entre el MCD, pero una sola vez: dos veces da ${p * q}.`),
        h('AT-REL-PRODUCTO', Pp, `Bien: ${f0(Pp)} es MCD × MCM. Pero falta quitarle el MCD.`),
      ],
      solucion: [[`${g} × MCM = ${f0(Pp)}.`], [`MCM = ${f0(Pp)} ÷ ${g} = `, Mv(M), '.']],
      _datos: { P: Pp, g },
    };
  }
  function diferencia(rng) {
    const g = rng.elegir([2, 3, 4, 5, 6, 7, 8, 9, 10, 12]), p = rng.entero(2, 6), q = rng.entero(p + 1, 8);
    if (mcd(p, q) !== 1) return null;
    const A = g * p, B = g * q, Dd = B - A, M = g * p * q;
    if (M > 400) return null;
    const sol = []; for (let x = 1; x + Dd <= M; x++) if (mcm(x, x + Dd) === M) sol.push(x);
    if (sol.length !== 1) return null;
    return {
      enunciado: [`Dos números se diferencian en ${Dd} y su MCM es ${M}.`],
      pregunta: ['¿Cuánto suman?'],
      datos: [D.coc, D.mcmC, D.dif],
      correcta: A + B,
      errores: [
        h('AT-SUMA-DATOS', Dd + M, 'Bien usar los dos datos. Pero sumarlos no da los números: hay que hallarlos.'),
        h('AT-COC-SIN-MCD', p + q, `Bien los cocientes ${p} y ${q}. Pero los números son MCD × ${p} y MCD × ${q}.`),
        h('AT-RESPONDE-OTRA', B, `Bien hallar el ${B}. Pero se pide la suma de los dos números.`),
      ],
      solucion: [[`Con MCD = ${g}: q − p = ${q - p} y p × q = ${p * q}, así que p = ${p} y q = ${q}.`], [`${A} + ${B} = ${A + B}.`]],
      _datos: { D: Dd, M },
    };
  }
  function pares(rng) {
    const g = rng.elegir([2, 3, 4, 5, 6]), c = rng.elegir([12, 18, 20, 24, 36, 40, 45, 60, 72]), M = g * c;
    if (M > 400) return null;
    let pesi = 0, todos = 0; for (let p = 1; p * p < c; p++) if (c % p === 0) { todos++; if (mcd(p, c / p) === 1) pesi++; }
    return {
      enunciado: [`Se buscan pares de números (A, B), con A menor que B, que tengan MCD ${g} y MCM ${M}.`],
      pregunta: ['¿Cuántos pares hay?'],
      datos: [D.coc, D.mcmC, D.pesi],
      correcta: pesi,
      errores: [
        h('AT-PARES-SIN-PESI', todos, `Bien buscar p × q = ${c}. Pero p y q tienen que ser PESI, y no todos lo son.`),
        h('AT-PARES-ORDEN', 2 * pesi, `Bien los cocientes PESI. Pero con A menor que B cada par se cuenta una vez.`),
        h('AT-PARES-UNO', 1, `Bien: ${g} y ${M} es un par. Pero hay más cocientes PESI con p × q = ${c}.`),
      ],
      solucion: [[`p × q = ${M} ÷ ${g} = ${c}, con p y q PESI y p menor que q.`], [`Hay ${pesi} pares.`]],
      _datos: { g, M },
    };
  }

  // ======================= Idea 4: el mismo resto =======================
  const sobran = k => (k === 1 ? 'sobra 1' : `sobran ${k}`);
  function mismo(rng) {
    const a = rng.entero(3, 10), b = rng.entero(a + 1, 15), M = mcm(a, b), r = rng.entero(1, a - 1);
    if (mcd(a, b) === 1 || b % a === 0 || M > 90) return null;
    return {
      enunciado: [`Un paquete de caramelos tiene más de ${b}. En bolsitas de ${a} ${sobran(r)}, y en bolsitas de ${b} también ${sobran(r)}.`],
      pregunta: ['¿Cuál es la menor cantidad posible?'],
      datos: [D.forma, D.comun, D.facM],
      correcta: M + r,
      errores: [
        h('AT-RESTO-PRODUCTO', a * b + r, `Bien sumar lo que sobra. Pero ${a * b} es ${a} × ${b}; el primer múltiplo común es ${M}.`),
        h('AT-RESTO-OLVIDA', M, `Bien: ${M} es múltiplo de ${a} y de ${b}. Pero así no sobra nada.`),
        h('AT-RESTO-RESTA', M - r, `Bien el MCM, ${M}. Pero lo que sobra se suma, no se resta.`),
      ],
      solucion: [['Sin lo que sobra, es múltiplo de MCM = ', Mv(M), '.'], [`${M} + ${r} = ${M + r}.`]],
      _datos: { a, b, r },
    };
  }
  function falta(rng) {
    const n3 = rng.entero(0, 1) === 1, ds = [];
    while (ds.length < (n3 ? 3 : 2)) { const d = rng.entero(3, 12); if (!ds.includes(d)) ds.push(d); }
    ds.sort((x, y) => x - y);
    const fa = rng.entero(1, 2), M = mcmL(ds);
    if (M > 180 || ds.some(d => d <= fa + 1) || ds.some((d, i) => ds.some((e, j) => j > i && e % d === 0))) return null;
    const rs = ds.map(d => d - fa), Pp = ds.reduce((x, y) => x * y, 1);
    const frase = ds.map((d, i) => `${i ? 'de' : 'en bolsitas de'} ${d} sobran ${rs[i]}`);
    return {
      enunciado: [`Doña Juana empaca un paquete de caramelos: ${frase.slice(0, -1).join(', ')} y ${frase[frase.length - 1]}.`],
      pregunta: ['¿Cuál es la menor cantidad posible?'],
      datos: [D.forma, D.falta, D.comun, D.facM],
      correcta: M - fa,
      errores: [
        h('AT-RESTO-PRIMERO', M + rs[0], `Bien usar el MCM, ${M}. Pero los restos son distintos: lo igual es lo que falta, ${fa}.`),
        h('AT-FALTA-SUMA', M + fa, `Bien ver que falta ${fa} en todas. Pero si falta, se resta.`),
        h('AT-RESTO-PRODUCTO', Pp - fa, `Bien restar lo que falta. Pero ${Pp} es el producto; el primer múltiplo común es ${M}.`),
      ],
      solucion: [[`A cada bolsita le falta ${fa}: N + ${fa} es múltiplo de MCM = `, Mv(M), '.'], [`${M} − ${fa} = ${M - fa}.`]],
      _datos: { ds, fa },
    };
  }
  function tresCifras(rng) {
    const ds = [rng.entero(3, 8), rng.entero(6, 12), rng.entero(9, 15)];
    if (!(ds[0] < ds[1] && ds[1] < ds[2])) return null;
    const M = mcmL(ds), r = rng.entero(1, ds[0] - 1), Pp = ds[0] * ds[1] * ds[2];
    if (M >= 100 || M < 20 || Pp === M) return null;
    let k = 0; while (M * k + r < 100) k++;
    let kp = 0; while (Pp * kp + r < 100) kp++;
    return {
      enunciado: [`Se busca un número de tres cifras que deje resto ${r} al dividirlo entre ${ds[0]}, entre ${ds[1]} y entre ${ds[2]}.`],
      pregunta: ['¿Cuál es el menor posible?'],
      datos: [D.forma, D.lista, D.facM, D.cifras],
      correcta: M * k + r,
      errores: [
        h('AT-COTA-OLVIDA', M + r, `Bien: ${M + r} deja resto ${r} con los tres. Pero no tiene tres cifras.`),
        h('AT-RESTO-OLVIDA', M * k, `Bien llegar a tres cifras con un múltiplo de ${M}. Pero falta sumar ${r}.`),
        h('AT-RESTO-PRODUCTO', Pp * kp + r, `Bien sumar ${r}. Pero se usan los múltiplos de ${M}, no de ${Pp}.`),
      ],
      solucion: [['Sirven MCM × k + ', Rv(r), ', con MCM = ', Mv(M), '.'], [`El primero de tres cifras: ${M} × ${k} + ${r} = ${M * k + r}.`]],
      _datos: { ds, r },
    };
  }
  function tercero(rng) {
    const a = rng.entero(2, 6), b = rng.entero(a + 1, 9), c = rng.elegir([5, 7, 11]), M = mcm(a, b);
    if (b % a === 0 || mcd(M, c) !== 1 || M > 40) return null;
    let N = M + 1; while (N % c) N += M;
    if (N === M + 1 || N > 400) return null;
    return {
      enunciado: [`Un paquete deja 1 caramelo suelto con bolsitas de ${a} y con bolsitas de ${b}, y ninguno con bolsitas de ${c}.`],
      pregunta: ['¿Cuál es la menor cantidad posible?'],
      datos: [D.forma, D.lista, D.facM],
      correcta: N,
      errores: [
        h('AT-TERCERO-OLVIDA', M + 1, `Bien: deja 1 con ${a} y con ${b}. Pero con ${c} sobran ${(M + 1) % c}.`),
        h('AT-TERCERO-MULTIPLICA', M * c + 1, `Bien juntar los tres. Pero ese número deja 1 con bolsitas de ${c}.`),
        h('AT-RESTO-OLVIDA', mcmL([a, b, c]), `Bien que sea múltiplo de ${c}. Pero no deja 1 con ${a}: no sobra nada.`),
      ],
      solucion: [[`Sirven ${M} × k + 1; pruebo k = 1, 2, 3… hasta un múltiplo de ${c}.`], [`${N} = ${c} × ${N / c}.`]],
      _datos: { a, b, c },
    };
  }

  // ======================= Idea 5: múltiplos de uno o de otro =======================
  function ambos(rng) {
    const a = rng.entero(4, 12), b = rng.entero(a + 1, 18), g = mcd(a, b), M = mcm(a, b), L = rng.elegir([100, 120, 150, 200, 300]);
    if (g === 1 || b % a === 0 || cuenta(L, M) < 2 || a * b > L) return null;
    return {
      enunciado: [`Se cuentan los números del 1 al ${L} que son múltiplos de ${a} y de ${b} a la vez.`],
      pregunta: ['¿Cuántos son?'],
      datos: [D.cuantos(L), D.ambos, D.facM],
      correcta: cuenta(L, M),
      errores: [
        h('AT-PRODUCTO', cuenta(L, a * b), `Bien buscar los de los dos. Pero son los múltiplos del MCM, ${M}, no de ${a * b}.`),
        h('AT-IE-SUMA', cuenta(L, a) + cuenta(L, b), 'Bien contar los de cada uno. Pero «a la vez» es estar en las dos cuentas.'),
        h('AR13', cuenta(L, g), `Bien buscar lo común. Pero son múltiplos del MCM, ${M}, no del MCD, ${g}.`),
      ],
      solucion: [['Son los múltiplos de MCM = ', Mv(M), '.'], [`${L} = ${M} × ${cuenta(L, M)} + ${L % M}: son ${cuenta(L, M)}.`]],
      _datos: { L, a, b },
    };
  }
  function alguno(rng) {
    const a = rng.entero(3, 10), b = rng.entero(a + 1, 15), g = mcd(a, b), M = mcm(a, b), L = rng.elegir([60, 80, 100, 120, 150, 200]);
    if (g === 1 || b % a === 0 || cuenta(L, M) < 2) return null;
    const cA = cuenta(L, a), cB = cuenta(L, b), cM = cuenta(L, M);
    return {
      enunciado: [`Se cuentan los números del 1 al ${L} que son múltiplos de ${a} o de ${b}.`],
      pregunta: ['¿Cuántos son?'],
      datos: [D.cuantos(L), D.ambos, D.ie],
      correcta: cA + cB - cM,
      errores: [
        h('AT-IE-SUMA', cA + cB, `Bien: ${cA} de ${a} y ${cB} de ${b}. Pero los ${cM} de los dos se contaron dos veces.`),
        h('AT-IE-DOBLE', cA + cB - 2 * cM, 'Bien quitar los repetidos. Pero se quitan una sola vez, no dos.'),
        h('AT-IE-SOLO-AMBOS', cM, 'Bien: esos son de los dos. Pero también cuentan los que son de uno solo.'),
      ],
      solucion: [[`${cA} de ${a}, ${cB} de ${b} y ${cM} de los dos, múltiplos de MCM = `, Mv(M), '.'], [`${cA} + ${cB} − ${cM} = ${cA + cB - cM}.`]],
      _datos: { L, a, b },
    };
  }
  function ninguno(rng) {
    const a = rng.entero(3, 10), b = rng.entero(a + 1, 15), g = mcd(a, b), M = mcm(a, b), L = rng.elegir([60, 90, 100, 120, 150]);
    if (g === 1 || b % a === 0 || cuenta(L, M) < 2) return null;
    const cA = cuenta(L, a), cB = cuenta(L, b), cM = cuenta(L, M), al = cA + cB - cM;
    return {
      enunciado: [`En una rifa de ${L} boletos, ganan caramelo los múltiplos de ${a} y gaseosa los múltiplos de ${b}.`],
      pregunta: ['¿Cuántos boletos no ganan ningún premio?'],
      datos: [D.cuantos(L), D.ambos, D.ie, D.ninguno],
      correcta: L - al,
      errores: [
        h('AT-IE-SUMA', L - cA - cB, `Bien restar del total. Pero los ${cM} de los dos premios se restaron dos veces.`),
        h('AT-NINGUNO-ALGUNO', al, `Bien: esos ${al} ganan algún premio. Pero se piden los que no ganan nada.`),
        h('AT-IE-DOBLE', L - (cA + cB - 2 * cM), 'Bien quitar los repetidos. Pero se quitan una sola vez, no dos.'),
      ],
      solucion: [[`Con algún premio: ${cA} + ${cB} − ${cM} = ${al} (los de los dos son múltiplos de `, Mv(M), ').'], [`${L} − ${al} = ${L - al}.`]],
      _datos: { L, a, b },
    };
  }
  function tachar(rng) {
    const [a, b, c] = rng.elegir([[2, 3, 5], [2, 3, 7], [2, 5, 7], [3, 5, 7]]), L = rng.elegir([60, 70, 84, 90, 100, 105, 120]);
    const k = d => cuenta(L, d), t = k(a) + k(b) + k(c) - k(a * b) - k(a * c) - k(b * c) + k(a * b * c);
    return {
      enunciado: [`En una lista del 1 al ${L} se tachan primero los múltiplos de ${a}, después los de ${b} que quedan y al final los de ${c} que quedan.`],
      pregunta: ['¿Cuántos números se tachan?'],
      datos: [D.cuantos(L), D.ie, D.ie3],
      correcta: t,
      errores: [
        h('AT-IE-SUMA', k(a) + k(b) + k(c), 'Bien contar los de cada número. Pero muchos ya estaban tachados: se cuentan dos veces.'),
        h('AT-IE-TRES-OLVIDA', t - k(a * b * c), `Bien restar los de cada par. Pero los múltiplos de ${a * b * c} se restaron de más.`),
        h('AT-NINGUNO-ALGUNO', L - t, `Bien la cuenta. Pero esos ${L - t} son los que quedan sin tachar.`),
      ],
      solucion: [[`${k(a)} + ${k(b)} + ${k(c)} − ${k(a * b)} − ${k(a * c)} − ${k(b * c)} + ${k(a * b * c)}.`], [`Se tachan ${t}.`]],
      _datos: { L, a, b, c },
    };
  }

  // ======================= Idea 6: Euclides y la fracción continua =======================
  const fcTexto = qs => `[${qs[0]}; ${qs.slice(1).join(', ')}]`;
  function mcdE(rng) {
    const g = rng.elegir([3, 4, 6, 7, 8, 9, 11, 12]), m = rng.entero(5, 14), n = rng.entero(2, m - 1);
    if (mcd(m, n) !== 1) return null;
    const A = g * m, B = g * n, ps = euclides(A, B);
    if (ps.length < 3) return null;
    return {
      enunciado: [`Se busca el MCD de ${A} y ${B} con divisiones sucesivas.`],
      pregunta: ['¿Cuál es?'],
      datos: [D.div, D.euc, D.mcm],
      correcta: g,
      errores: [
        h('AT-EUC-PRIMER-RESTO', ps[0].r, `Bien empezar dividiendo. Pero ${ps[0].r} es el primer resto: hay que seguir.`),
        h('AT-EUC-COCIENTE', ps[0].q, `Bien la división. Pero el cociente ${ps[0].q} cuenta veces: no entra en los dos.`),
        h('AR13', mcm(A, B), 'Bien buscar lo común. Pero ese es el MCM: los dos entran en él.'),
      ],
      solucion: [[ps.map(p => `${p.a} = ${p.q} × ${p.b}${p.r ? ` + ${p.r}` : ''}`).join('; ') + '.'], ['El último divisor es el MCD: ', Dv(g), '.']],
      _datos: { A, B },
    };
  }
  function fraccion(rng) {
    const A = rng.entero(20, 160), B = rng.entero(7, A - 3), ps = euclides(A, B);
    if (ps.length < 3 || ps.length > 5 || mcd(A, B) !== 1) return null;
    const qs = ps.map(p => p.q), rs = [qs[0], ...ps.slice(0, -1).map(p => p.r)];
    return {
      enunciado: [`Se escribe ${A}/${B} como fracción continua.`],
      pregunta: ['¿Cuál es?'],
      datos: [D.div, D.fc, D.fcNot],
      correcta: fcTexto(qs), fmt: x => x,
      errores: [
        h('AT-FC-RESTOS', fcTexto(rs), 'Bien las divisiones sucesivas. Pero los términos son los cocientes, no lo que sobra.', x => x),
        h('AT-FC-ORDEN', fcTexto(qs.slice().reverse()), 'Bien los cocientes. Pero van en el orden en que salen.', x => x),
        h('AT-FC-CORTA', fcTexto(qs.slice(0, -1)), 'Bien los primeros cocientes. Pero falta el último.', x => x),
      ],
      solucion: [[ps.map(p => `${p.a} = ${p.q} × ${p.b}${p.r ? ` + ${p.r}` : ''}`).join('; ') + '.'], [`Los cocientes, en orden: ${fcTexto(qs)}.`]],
      _datos: { A, B },
    };
  }
  const valorFC = qs => { let n = qs[qs.length - 1], d = 1; for (let i = qs.length - 2; i >= 0; i--) [n, d] = [qs[i] * n + d, n]; const g = mcd(n, d); return [n / g, d / g]; };
  const fr = ([u, w]) => (w === 1 ? String(u) : `${u}/${w}`);
  function valor(rng) {
    const qs = [rng.entero(1, 4), rng.entero(1, 4), rng.entero(2, 5)], val = valorFC(qs);
    const sn = qs[0] * qs[1] * qs[2] + qs[2] + qs[1], sd = qs[1] * qs[2], gs = mcd(sn, sd);
    return {
      enunciado: [`La fracción continua ${fcTexto(qs)} es ${qs[0]} + 1/(${qs[1]} + 1/${qs[2]}).`],
      pregunta: ['¿Qué número es?'],
      datos: [D.fcNot],
      correcta: fr(val), fmt: x => x,
      errores: [
        h('AT-FC-SUMA', fr([sn / gs, sd / gs]), `Bien empezar con ${qs[0]}. Pero el 1/${qs[2]} va dentro, sumado al ${qs[1]}.`, x => x),
        h('AT-FC-CORTA', fr(valorFC(qs.slice(0, 2))), `Bien ${qs[0]} + 1/${qs[1]}. Pero falta el último término.`, x => x),
        h('AT-FC-INVIERTE', fr([val[1], val[0]]), `Bien la cuenta. Pero esa es la fracción al revés: la parte entera es ${qs[0]}.`, x => x),
      ],
      solucion: [[`De abajo hacia arriba: ${qs[1]} + 1/${qs[2]} = ${fr(valorFC(qs.slice(1)))}.`], [`${qs[0]} + ${fr([valorFC(qs.slice(1))[1], valorFC(qs.slice(1))[0]])} = ${fr(val)}.`]],
      _datos: { qs },
    };
  }
  function reconstruir(rng) {
    const qs = [rng.entero(1, 4), rng.entero(1, 4), rng.entero(2, 5)], d = rng.elegir([2, 3, 4, 5, 6, 7, 8]);
    const atras = (cs, g) => { let x = cs[cs.length - 1] * g, y = g; for (let i = cs.length - 2; i >= 0; i--) [x, y] = [cs[i] * x + y, x]; return [x, y]; };
    const [A, B] = atras(qs, d), [A1, B1] = atras(qs, 1), [Ar, Br] = atras(qs.slice().reverse(), d);
    if (A + B > 400 || Ar + Br === A + B) return null;
    return {
      enunciado: [`Al hallar el MCD de dos números con divisiones sucesivas, los cocientes fueron ${yLista(qs)}, en ese orden, y el MCD es ${d}.`],
      pregunta: ['¿Cuánto suman los dos números?'],
      datos: [D.div, D.euc, D.atras],
      correcta: A + B,
      errores: [
        h('AT-EUC-SIN-MCD', A1 + B1, 'Bien ir hacia atrás. Pero la última división empieza en el MCD, no en 1.'),
        h('AT-FC-ORDEN', Ar + Br, 'Bien ir hacia atrás. Pero el último cociente es el de la última división.'),
        h('AT-RESPONDE-OTRA', A, `Bien hallar el ${A}. Pero se pide la suma con el otro.`),
      ],
      solucion: [[`Desde abajo: ${qs[2] * d} = ${qs[2]} × ${d}; después ${B} y ${A}.`], [`${A} + ${B} = ${A + B}.`]],
      _datos: { qs, d },
    };
  }

  const CONSTRUIR = {
    trozo, total, tres, decimales, estacas, boleto, alarmas, tercera, tomas, otro, producto, diferencia, pares,
    mismo, falta, 'tres-cifras': tresCifras, tercero, ambos, alguno, ninguno, tachar, mcd: mcdE, fraccion, valor, reconstruir,
  };

  return { id: ID, titulo: 'Los rollos y la rifa', generar, TIPOS_POR_IDEA, TIPOS_POR_UNIDAD, NIVEL };
});
