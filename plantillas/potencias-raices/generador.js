/*
 * Generador «La bandeja cuadrada de doña Juana»: práctica de «Potenciación y radicación»
 * (aritmetica.potenciacion-y-radicacion; contenido/teoria/aritmetica/potenciacion-y-radicacion.js), con tipos separados
 * por idea. Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador (window.Generadores['potencias-raices'])
 * y en Node (require). No usa ningún motor: las cuentas son raíces enteras y factorizaciones de enteros.
 *
 * Propuesta: docs/etapa9/propuesta-aritmetica.md §5 y §8 (Gerson delegó el criterio y la revisa después). Hilo, como en
 * la teoría: los caramelos de doña Juana (bandejas cuadradas), sus cubitos de chocolate y su calculadora. Valores de
 * problema, sin fuente.
 *
 * Tipos por idea (TIPOS_POR_IDEA; nivel 1 básico, 2 intermedio, 3 examen). generar(semilla, { idea }) da solo los de esa
 * idea; sin idea, las seis con el mismo peso. La unidad es una sola: { unidad } no cambia nada.
 *   perfectos     es-cuadrado (1) cuál es cuadrado · mult-cuadrado (2) · mult-cubo (2) · div-cuadrados (3, San Marcos
 *                 2025-II) cuántos divisores son cuadrados
 *   exclusion     descarta (1) · cifra-final (1) · pasa-no-es (2) · oculta (3, San Marcos 2023-I y 2026-I) la cifra tapada
 *   raiz-entera   raiz-residuo (1) · faltan (2) · mayor-n (3) · dos-residuos (3)
 *   raiz-cubica   cubica (1) · siguiente-cubo (2) · arista (3) · mayor-cubo (3)
 *   contar        cifras (1) · entre (2) · cubos-entre (2) · o-cubos (3, San Marcos 2026-II es «entre»)
 *   aproximadas   decimas (1) · raiz-suma (1) · exceso (2) · centesimas (3)
 *
 * Notación (propuesta §6): × para multiplicar y nunca «·»; superíndices; k la raíz entera, r el residuo, rₑ lo que falta.
 * Colores: un color fijo por magnitud, el de la teoría (def.colores): el número naranja, el exponente turquesa, la raíz
 * violeta, el residuo carmín. Una cantidad que se cuenta va en tinta. Sin verde.
 * Datos (docs/plan-calidad.md §3, punto 13): la definición, la propiedad o la fórmula de cada tipo; nunca el paso hecho
 * ni la respuesta.
 * Errores: los códigos de la teoría (AT-* hipótesis de aula; E-MUL, E-SUM, E-RSUMA y E-RDIV documentados en la
 * investigación previa, docs/investigacion/etapa9/aritmetica.potenciacion-y-radicacion.md §3).
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
  const ID = 'potencias-raices';
  const UNIDAD = 'aritmetica.potenciacion-y-radicacion';
  const v = P.v;
  const f0 = x => P.formatear(x, 0);
  const SUPD = '⁰¹²³⁴⁵⁶⁷⁸⁹', sup = x => [...String(x)].map(c => SUPD[c]).join('');
  const raiz = (N, n) => { let k = Math.max(0, Math.floor(Math.pow(N, 1 / n)) - 1); while ((k + 1) ** n <= N) k++; while (k ** n > N) k--; return k; };
  const factores = x => { const o = []; for (let p = 2; x > 1; p++) { let e = 0; while (x % p === 0) { x /= p; e++; } if (e) o.push([p, e]); } return o; };
  const canonDe = fs => fs.map(([p, e]) => (e > 1 ? `${p}${sup(e)}` : String(p))).join(' × ');
  const valorDe = fs => fs.reduce((a, [p, e]) => a * p ** e, 1);
  const N_ = x => v('o', typeof x === 'number' ? f0(x) : x);
  const K_ = x => v('f', typeof x === 'number' ? f0(x) : x);
  const R_ = x => v('h', typeof x === 'number' ? f0(x) : x);
  const VARS = { o: { nombre: 'el número que se estudia', color: 'o' }, i: { nombre: 'el exponente', color: 'i' },
    f: { nombre: 'la raíz', color: 'f' }, h: { nombre: 'el residuo: lo que sobra', color: 'h' } };
  const h = (id, valor, explicacion, fmt = x => (typeof x === 'number' ? f0(x) : String(x))) =>
    (valor === undefined || valor === null || (typeof valor === 'number' && (!Number.isFinite(valor) || valor < 0)) ? null
      : { id, clave: String(fmt(valor)), texto: String(fmt(valor)), explicacion,
        respaldo: /^E-/.test(id) ? 'documentado' : 'hipotesis', fuente: /^E-/.test(id) ? 'docs/investigacion/etapa9/aritmetica.potenciacion-y-radicacion.md' : null });

  const D = {
    cuadrado: 'Cuadrado perfecto: cada primo de su factorización tiene exponente par',
    cubo: 'Cubo perfecto: cada primo de su factorización tiene exponente múltiplo de 3',
    uno: 'Un primo sin exponente escrito tiene exponente 1',
    cuenta: 'El exponente cuenta cuántas veces se multiplica la base: 4³ = 4 × 4 × 4',
    divisor: 'Un divisor de N lleva cada primo de N con un exponente desde 0 hasta el que tiene en N',
    nunca: 'Ningún cuadrado perfecto termina en 2, 3, 7 u 8',
    ceros: 'Si un cuadrado termina en ceros, tiene una cantidad par de ceros',
    final: 'La cifra final de k² es la cifra final de d × d, donde d es la cifra final de k',
    entreC: 'Un número que queda entre dos cuadrados seguidos no es un cuadrado perfecto',
    raiz: 'Raíz entera: el mayor entero k con k² ≤ N',
    residuo: 'Residuo: r = N − k²',
    exceso: 'Residuo por exceso: rₑ = (k + 1)² − N',
    suma: 'Si la raíz no es exacta, r + rₑ = 2k + 1',
    maximo: 'El residuo es a lo más 2k',
    raiz3: 'Raíz cúbica entera: el mayor entero k con k³ ≤ N',
    residuo3: 'Residuo: r = N − k³',
    maximo3: 'El residuo de la raíz cúbica es a lo más 3k² + 3k',
    cubo10: 'La cifra final de k³ es la cifra final de d × d × d, donde d es la cifra final de k',
    contar: 'Cuadrados de a hasta b: sus bases van desde la menor k con k² ≥ a hasta la mayor con k² ≤ b',
    contar3: 'Cubos de a hasta b: sus bases van desde la menor k con k³ ≥ a hasta la mayor con k³ ≤ b',
    seguidos: 'Del entero menor al mayor, los dos incluidos, hay «mayor − menor + 1» enteros',
    sexta: 'Un número es cuadrado y cubo a la vez si es una sexta potencia, como 1, 64 o 729',
    encierra: 'Si x² ≤ N < (x + 0,1)², entonces x ≤ √N < x + 0,1',
    centesima: 'Si x² ≤ N < (x + 0,01)², entonces x ≤ √N < x + 0,01',
    defecto: 'Aproximación por defecto: la menor de las dos; por exceso: la mayor',
    adentro: 'La raíz se saca de todo lo que está dentro: primero se opera adentro',
    lado: 'El lado de un cuadrado es la raíz de su área',
  };

  const TIPOS_POR_IDEA = {
    perfectos: ['es-cuadrado', 'mult-cuadrado', 'mult-cubo', 'div-cuadrados'],
    exclusion: ['descarta', 'cifra-final', 'pasa-no-es', 'oculta'],
    'raiz-entera': ['raiz-residuo', 'faltan', 'mayor-n', 'dos-residuos'],
    'raiz-cubica': ['cubica', 'siguiente-cubo', 'arista', 'mayor-cubo'],
    contar: ['cifras', 'entre', 'cubos-entre', 'o-cubos'],
    aproximadas: ['decimas', 'raiz-suma', 'exceso', 'centesimas'],
  };
  const IDEAS = Object.keys(TIPOS_POR_IDEA);
  const IDEA_DE = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map(t => [t, i])));
  const TIPOS_POR_UNIDAD = { [UNIDAD]: IDEAS.flatMap(i => TIPOS_POR_IDEA[i]) };
  const NIVEL = { 'es-cuadrado': 1, 'mult-cuadrado': 2, 'mult-cubo': 2, 'div-cuadrados': 3, descarta: 1, 'cifra-final': 1, 'pasa-no-es': 2, oculta: 3,
    'raiz-residuo': 1, faltan: 2, 'mayor-n': 3, 'dos-residuos': 3, cubica: 1, 'siguiente-cubo': 2, arista: 3, 'mayor-cubo': 3,
    cifras: 1, entre: 2, 'cubos-entre': 2, 'o-cubos': 3, decimas: 1, 'raiz-suma': 1, exceso: 2, centesimas: 3 };
  // Papel (regla 6; herramientas/papel-generador.js usa «papel-1» a «papel-8» y rotula 3 básicos, 3 intermedios y 2
  // avanzados): una pregunta de cada idea, y las dos de examen tienen forma de San Marcos (2026-I y 2026-II).
  const PAPEL = { 'papel-1': 'raiz-residuo', 'papel-2': 'descarta', 'papel-3': 'decimas', 'papel-4': 'mult-cuadrado',
    'papel-5': 'siguiente-cubo', 'papel-6': 'entre', 'papel-7': 'oculta', 'papel-8': 'o-cubos' };

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
    const ct = typeof o.correcta === 'number' ? f0(o.correcta) : String(o.correcta);
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

  // ======================= Idea 1: cuadrados y cubos perfectos =======================
  const multDe = (fs, n) => fs.reduce((a, [p, e]) => a * p ** ((n - e % n) % n), 1);
  function factAzar(rng, primos, eMax, n, tope) {
    const fs = primos.map(p => [p, rng.entero(0, eMax)]).filter(([, e]) => e > 0);
    const N = valorDe(fs);
    return fs.length >= 2 && N <= tope && N >= 12 && !fs.every(([, e]) => e % n === 0) ? fs : null;
  }
  function esCuadrado(rng) {
    const [b1, e1, b2, e2] = rng.elegir([[4, 3, 5, 2], [4, 5, 7, 2], [9, 3, 7, 2], [8, 2, 3, 2], [2, 6, 3, 4], [5, 2, 11, 2]]);
    const pot = (b, e) => `${b}${sup(e)}`, c = `${pot(b1, e1)} × ${pot(b2, e2)}`;
    const a = rng.elegir([2, 3]), b = rng.elegir([5, 7]);
    return {
      enunciado: ['Doña Juana anota cuatro cantidades de caramelos escritas como potencias.'], pregunta: ['¿Cuál de ellas es un cuadrado perfecto?'],
      datos: [D.cuadrado, D.uno, D.cuenta], correcta: c,
      errores: [
        h('AT-CUBO', `${a}³ × ${b}³`, 'Es un cubo perfecto, pero sus dos exponentes son 3, que es impar: no es un cuadrado.'),
        h('AT-EXP-UNO', `${a}² × ${b}`, `El ${a}² está bien, pero el ${b} tiene exponente 1, que es impar.`),
        h('AT-SUMA-PAR', `${a}³ × ${b}⁵`, 'Los exponentes suman 8, que es par, pero se mira cada uno por separado, y 3 y 5 son impares.'),
      ],
      solucion: [[`Escrito con primos, ${c} = ${canonDe(factores(b1 ** e1 * b2 ** e2))}: todos los exponentes son pares, así que es `, K_(`${raiz(b1 ** e1 * b2 ** e2, 2)}²`), '.']],
      _datos: { b1, e1, b2, e2 },
    };
  }
  function multiplica(n) {
    return rng => {
      const fs = factAzar(rng, n === 2 ? [2, 3, 5, 7] : [2, 3, 5], n === 2 ? 3 : 4, n, 8000);
      if (!fs) return null;
      const N = valorDe(fs), m = multDe(fs, n), otro = n === 2 ? 3 : 2, nom = n === 2 ? 'cuadrado' : 'cubo';
      if (n === 2 && N === 600) return null; // la Predice de la teoría (idea 1)
      return {
        enunciado: ['Doña Juana tiene ', N_(N), ` = ${canonDe(fs)} caramelos.`], pregunta: [`¿Por qué número mínimo hay que multiplicar esa cantidad para obtener un ${nom} perfecto?`],
        datos: [n === 2 ? D.cuadrado : D.cubo, D.uno], correcta: m,
        errores: [
          h('AT-TODOS', fs.reduce((a, [p]) => a * p, 1), 'Multiplicar por todos los primos sube también los exponentes que ya cumplían: solo se agrega lo que le falta a cada uno.'),
          h('AT-OTRO-INDICE', multDe(fs, otro), `Ese número completa los exponentes para un ${n === 2 ? 'cubo' : 'cuadrado'}, no para un ${nom}.`),
          h('AT-EXP-UNO', (x => (x > 1 ? x : null))(fs.reduce((a, [p, e]) => a * (e === 1 ? 1 : p ** ((n - e % n) % n)), 1)), 'Completaste los exponentes escritos, pero el primo sin exponente tiene exponente 1 y también hay que completarlo.'),
          h('AT-MISMO', N, n === 2 ? 'Multiplicar por la misma cantidad sí da un cuadrado, pero no es el menor número que sirve.' : 'Multiplicar por la misma cantidad duplica cada exponente, y el que no era múltiplo de 3 sigue sin serlo.'),
        ],
        solucion: [[`Cada exponente que no cumple sube al ${n === 2 ? 'par' : 'múltiplo de 3'} que sigue: se multiplica por ${f0(m)}.`], [`${f0(N)} × ${f0(m)} = ${f0(N * m)} = `, K_(`${raiz(N * m, n)}${n === 2 ? '²' : '³'}`), '.']],
        _datos: { N, n },
      };
    };
  }
  function divCuadrados(rng) {
    const fs = [[2, rng.entero(2, 6)], [3, rng.entero(1, 4)], [5, rng.entero(1, 3)]];
    const N = valorDe(fs);
    if (N > 60000) return null;
    const c = fs.reduce((a, [, e]) => a * (Math.floor(e / 2) + 1), 1), cd = fs.reduce((a, [, e]) => a * (e + 1), 1);
    return {
      enunciado: ['Un número es ', N_(N), ` = ${canonDe(fs)}.`], pregunta: ['¿Cuántos de sus divisores son cuadrados perfectos?'],
      datos: [D.divisor, D.cuadrado], correcta: c,
      errores: [
        h('AT-CD', cd, 'Esa es la cantidad de todos los divisores, pero un divisor cuadrado solo lleva exponentes pares.'),
        h('AT-SIN-CERO', fs.reduce((a, [, e]) => a * Math.floor(e / 2), 1) || null, 'Elegir exponentes pares está bien, pero el 0 también es par: un primo puede no estar en el divisor.'),
        h('AT-MITAD', Math.floor(cd / 2), 'Los divisores cuadrados no son la mitad: se cuentan los exponentes pares posibles de cada primo y se multiplican.'),
      ],
      solucion: [[`Cada primo puede ir con un exponente par desde 0: ${fs.map(([p, e], i) => `${i === fs.length - 1 ? 'y ' : ''}el ${p} tiene ${Math.floor(e / 2) + 1 === 1 ? '1 opción' : `${Math.floor(e / 2) + 1} opciones`}`).join(', ').replace(/, y /, ' y ')}.`], [`${fs.map(([, e]) => Math.floor(e / 2) + 1).join(' × ')} = ${c}.`]],
      _datos: { N },
    };
  }

  // ======================= Idea 2: criterios para descartar cuadrados =======================
  const esC = n => raiz(n, 2) ** 2 === n;
  const pasa = n => { let z = 0, x = n; while (x && x % 10 === 0) { x /= 10; z++; } return z % 2 === 0 && [1, 4, 5, 6, 9].includes(x % 10) && (x % 10 !== 5 || x % 100 === 25); };
  function descarta(rng) {
    const modo = rng.entero(0, 2);
    const mal = modo === 0 ? rng.entero(100, 999) * 10 + rng.elegir([2, 3, 7, 8]) : modo === 1 ? rng.entero(11, 99) * rng.elegir([10, 1000]) : rng.entero(10, 99) * 100 + rng.elegir([15, 35, 45, 75, 95]);
    // Con ceros, uno o tres: con dos o cuatro (20 000) se descarta por algo que el criterio no dice (auditoría, 26 nov).
    let z = 0; for (let x = mal; x && x % 10 === 0; x /= 10) z++;
    if (pasa(mal) || (z && z % 2 === 0)) return null;
    const ks = []; while (ks.length < 3) { const k = rng.entero(32, 99); if (!ks.includes(k)) ks.push(k); }
    return {
      enunciado: ['Doña Juana anota cuatro números en su cuaderno.'], pregunta: ['¿Cuál de ellos no puede ser un cuadrado perfecto?'],
      datos: [D.nunca, D.ceros, 'Si un cuadrado termina en 5, termina en 25'], correcta: mal,
      errores: ks.map(k => h('AT-DESCARTA-MAL', k * k, `Ese sí es cuadrado: ${k}² = ${f0(k * k)}.`)),
      solucion: [[`${f0(mal)} no pasa los criterios de exclusión, porque ningún cuadrado termina así: se descarta. Los otros tres son cuadrados perfectos.`]],
      _datos: { mal, ks },
    };
  }
  function cifraFinal(rng) {
    const d = rng.entero(2, 9), c = (d * d) % 10;
    return {
      enunciado: ['Un número termina en ', K_(d), '.'], pregunta: ['¿En qué cifra termina su cuadrado?'],
      datos: [D.final], correcta: c,
      errores: [
        h('AT-MISMA', d, `Al elevar al cuadrado, la cifra final cambia: se mira en qué termina ${d} × ${d}.`),
        h('E-MUL', (2 * d) % 10, `Eso es ${d} × 2; elevar al cuadrado es ${d} × ${d}.`),
        h('E-SUM', (d + 2) % 10, `Eso es ${d} + 2; elevar al cuadrado es ${d} × ${d}.`),
        h('AT-DECENA', Math.floor(d * d / 10), `Esa es la cifra de las decenas de ${d} × ${d}, no la final.`),
      ],
      solucion: [[`Solo importa la cifra final del número: ${d} × ${d} = ${d * d}, que termina en ${c}.`]],
      _datos: { d },
    };
  }
  function pasaNoEs(rng) {
    const x = rng.entero(100, 999) * 10 + rng.elegir([1, 4, 6, 9]);
    if (esC(x)) return null;
    const k1 = rng.entero(32, 65), k2 = rng.entero(66, 99), malo = rng.entero(100, 999) * 10 + rng.elegir([2, 3, 7, 8]), a = raiz(x, 2);
    return {
      enunciado: ['Doña Juana revisa cuatro números con el criterio de la cifra final.'], pregunta: ['¿Cuál pasa el criterio, pero no es un cuadrado perfecto?'],
      datos: [D.nunca, D.entreC], correcta: x,
      errores: [
        h('AT-DESCARTA-MAL', k1 * k1, `Pasa el criterio y sí es cuadrado: ${k1}² = ${f0(k1 * k1)}.`),
        h('AT-DESCARTA-MAL', k2 * k2, `Pasa el criterio y sí es cuadrado: ${k2}² = ${f0(k2 * k2)}.`),
        h('AT-NO-PASA', malo, 'Es cierto que no es cuadrado, pero ni siquiera pasa el criterio de la cifra final.'),
      ],
      solucion: [[`${f0(x)} pasa el criterio, pero queda entre dos cuadrados seguidos: ${a}² = ${f0(a * a)} < ${f0(x)} < ${f0((a + 1) ** 2)} = ${a + 1}².`]],
      _datos: { x, k1, k2, malo },
    };
  }
  function oculta(rng) {
    const k = rng.entero(32, 99), N = k * k, s = String(N), i = rng.entero(1, 2);
    const vale = d => esC(Number(s.slice(0, i) + d + s.slice(i + 1)));
    if ([...Array(10).keys()].filter(vale).length !== 1) return null;
    const t = s.slice(0, i) + '☐' + s.slice(i + 1), bien = Number(s[i]);
    const otros = [...Array(10).keys()].filter(d => d !== bien);
    const ds = []; while (ds.length < 3) { const d = rng.elegir(otros); if (!ds.includes(d)) ds.push(d); }
    return {
      enunciado: [`El número ${t} es un cuadrado perfecto.`], pregunta: ['¿Qué cifra va en ☐?'],
      datos: [D.final, D.entreC], correcta: bien,
      errores: ds.map(d => { const X = Number(s.slice(0, i) + d + s.slice(i + 1)), a = raiz(X, 2);
        return h('H-TERM', d, `Con ${d} queda ${f0(X)}: termina bien, pero está entre ${a}² y ${a + 1}².`); }),
      solucion: [[`Con ${bien} queda ${f0(N)} = `, K_(`${k}²`), '; con las otras cifras, el número queda entre dos cuadrados seguidos.']],
      _datos: { tapado: t },
    };
  }

  // ======================= Idea 3: raíz cuadrada entera y residuo =======================
  function raizResiduo(rng) {
    const N = rng.entero(110, 990), k = raiz(N, 2), r = N - k * k, re = (k + 1) ** 2 - N;
    if (r === 0 || N - 2 * k < 0) return null;
    const t = (a, b) => `k = ${a}, r = ${b}`;
    return {
      enunciado: ['Doña Juana tiene ', N_(N), ' caramelos para la vitrina y, con ellos, arma la mayor bandeja cuadrada.'], pregunta: ['¿De cuántos caramelos por lado es, y cuántos sobran?'],
      datos: [D.raiz, D.residuo], correcta: t(k, r),
      errores: [
        h('AT-EXCESO', t(k + 1, re), `${k + 1}² = ${(k + 1) ** 2} ya pasa de ${N}: esa es la raíz por exceso.`),
        h('AT-CAMBIA', t(k, re), `${re} es lo que falta para ${k + 1}², no lo que sobra.`),
        h('E-MUL', t(k, N - 2 * k), `${k}² es ${k} × ${k}, no ${k} × 2.`),
      ],
      solucion: [[`${k}² = ${k * k} ≤ ${N} < ${(k + 1) ** 2} = ${k + 1}², así que el lado es ${k} y sobran `, R_(r), '.']],
      _datos: { N },
    };
  }
  function faltan(rng) {
    const N = rng.entero(60, 900), k = raiz(N, 2), r = N - k * k, re = (k + 1) ** 2 - N;
    if (r === 0) return null;
    return {
      enunciado: ['Doña Juana tiene ', N_(N), ' caramelos para la vitrina y, con ellos, arma la mayor bandeja cuadrada.'], pregunta: ['¿Cuántos caramelos le faltan para armar la siguiente?'],
      datos: [D.raiz, D.exceso], correcta: re,
      errores: [
        h('AT-CAMBIA', r, 'Esos son los que sobran; se piden los que faltan.'),
        h('AT-BORDE', 2 * k + 1, 'Ese es todo el borde de la siguiente; algunos lugares ya tienen caramelos.'),
        h('AT-DA-EL-CUADRADO', (k + 1) ** 2, 'Esa es la cantidad de toda la bandeja siguiente, no lo que falta para armarla.'),
      ],
      solucion: [[`La siguiente es de ${k + 1} × ${k + 1} = ${(k + 1) ** 2}: faltan ${(k + 1) ** 2} − ${N} = ${re}.`]],
      _datos: { N },
    };
  }
  function mayorN(rng) {
    const k = rng.entero(11, 45), N = k * k + 2 * k;
    return {
      enunciado: ['La raíz cuadrada entera de un número es ', K_(k), '.'], pregunta: ['¿Cuál es el mayor valor que puede tener ese número?'],
      datos: [D.raiz, D.maximo], correcta: N,
      errores: [
        h('AT-MAS-UNO', (k + 1) ** 2, `Ese es ${k + 1}²: su raíz ya es ${k + 1}.`),
        h('AT-UNA-FILA', k * k + k, 'Con una sola fila nueva todavía caben más caramelos sin llegar al cuadrado siguiente.'),
        h('AT-SIN-RESIDUO', k * k, `${k}² tiene raíz ${k}, pero hay mayores con la misma raíz.`),
      ],
      solucion: [[`Sobran a lo más 2 × ${k} = ${2 * k}, porque con uno más se arma el cuadrado siguiente: ${k}² + ${2 * k} = ${N}.`]],
      _datos: { k },
    };
  }
  function dosResiduos(rng) {
    const k = rng.entero(9, 30), r = rng.entero(1, 2 * k), re = 2 * k + 1 - r, N = k * k + r;
    return {
      enunciado: ['Al sacar la raíz cuadrada entera de un número sobran ', R_(r), ` y faltan ${re} para el cuadrado siguiente.`], pregunta: ['¿Cuál es el número?'],
      datos: [D.residuo, D.suma], correcta: N,
      errores: [
        h('AT-SUMA', r + re, 'Esa suma es 2k + 1: sirve para hallar k, pero no es el número.'),
        h('AT-DA-K', k, 'Ese es k, la raíz; se pide el número.'),
        h('AT-EXCESO', (k + 1) ** 2 + r, `Los que sobran van sobre ${k}², no sobre ${k + 1}².`),
      ],
      solucion: [[`${r} + ${re} = ${2 * k + 1} = 2 × ${k} + 1, así que k = ${k}. El número es ${k}² + ${r} = ${N}.`]],
      _datos: { r, re },
    };
  }

  // ======================= Idea 4: raíz cúbica entera y residuo =======================
  function cubica(rng) {
    const N = rng.entero(130, 2190), k = raiz(N, 3), r = N - k ** 3, kc = raiz(N, 2);
    if (r === 0) return null;
    const t = (a, b) => `k = ${a}, r = ${b}`;
    return {
      enunciado: ['Doña Juana tiene ', N_(N), ' cubitos de chocolate y arma el mayor cubo macizo.'], pregunta: ['¿De cuántos cubitos es su arista, y cuántos sobran?'],
      datos: [D.raiz3, D.residuo3], correcta: t(k, r),
      errores: [
        h('AT-EXCESO', t(k + 1, (k + 1) ** 3 - N), `${k + 1}³ = ${f0((k + 1) ** 3)} ya pasa de ${f0(N)}: esa es la raíz por exceso.`),
        h('AT-CUADRADA', t(kc, N - kc * kc), 'Esa es la raíz cuadrada entera, pero aquí se pide la cúbica.'),
        h('AT-CUADRADO', t(k, N - k * k), `k = ${k} está bien, pero sobra N − ${k}³, no N − ${k}².`),
      ],
      solucion: [[`${k}³ = ${f0(k ** 3)} ≤ ${f0(N)} < ${f0((k + 1) ** 3)} = ${k + 1}³, así que la arista es ${k} y sobran `, R_(r), '.']],
      _datos: { N },
    };
  }
  function siguienteCubo(rng) {
    const k = rng.entero(4, 15), c = 3 * k * k + 3 * k + 1;
    return {
      enunciado: ['El cubo de ', K_(k), ` × ${k} × ${k} cubitos está armado.`], pregunta: [`¿Cuántos cubitos hay que agregar para armar el de ${k + 1} × ${k + 1} × ${k + 1}?`],
      datos: [`${k} × ${k} = ${k * k}`, `${k} × ${k} × ${k} = ${f0(k ** 3)}`], correcta: c,
      errores: [
        h('AT-COPIA-CUADRADO', 2 * k + 1, 'Eso se agrega para pasar de un cuadrado al siguiente; un cubo crece por tres caras, tres aristas y una esquina.'),
        h('AT-CARAS', 3 * k * k, 'Las tres caras están bien contadas, pero faltan las tres aristas y la esquina.'),
        h('AT-DA-EL-CUBO', (k + 1) ** 3, 'Ese es todo el cubo nuevo, y una parte de él ya está armada.'),
      ],
      solucion: [[`Hacen falta tres caras de ${k * k} cubitos, tres aristas de ${k} y una esquina: ${3 * k * k} + ${3 * k} + 1 = ${f0(c)}.`]],
      _datos: { k },
    };
  }
  function arista(rng) {
    const k = rng.entero(11, 29), N = k ** 3, d = N % 10;
    if (k % 10 === d) return null;
    const misma = 10 * Math.floor(k / 10) + d;
    return {
      enunciado: ['Un cubo macizo tiene ', N_(N), ' cubitos.'], pregunta: ['¿Cuántos cubitos tiene cada arista?'],
      datos: [D.cubo10, '10³ = 1 000; 20³ = 8 000; 30³ = 27 000'], correcta: k,
      errores: [
        h('AT-MISMA', misma, `${misma}³ = ${f0(misma ** 3)}: aquí la arista no termina en la misma cifra que el cubo.`),
        h('AT-CUADRADA', raiz(N, 2), 'Esa es la raíz cuadrada entera, no la cúbica.'),
        h('E-RDIV', Math.floor(N / 3), 'Dividir entre 3 no es sacar raíz cúbica.'),
      ],
      solucion: [[`El número está entre ${10 * Math.floor(k / 10)}³ y ${10 * Math.floor(k / 10) + 10}³, y de las diez cifras finales solo el ${k % 10} da un cubo que termina en ${d}: la arista es `, K_(k), '.']],
      _datos: { N },
    };
  }
  function mayorCubo(rng) {
    const k = rng.entero(5, 14), N = (k + 1) ** 3 - 1;
    return {
      enunciado: ['La raíz cúbica entera de un número es ', K_(k), '.'], pregunta: ['¿Cuál es el mayor valor que puede tener ese número?'],
      datos: [D.raiz3, D.maximo3], correcta: N,
      errores: [
        h('AT-MAS-UNO', (k + 1) ** 3, `Ese es ${k + 1}³: su raíz cúbica ya es ${k + 1}.`),
        h('AT-CARAS', k ** 3 + 3 * k * k, 'Con las tres caras llenas todavía caben las aristas sin completar el cubo siguiente.'),
        h('AT-COPIA-CUADRADO', k ** 3 + 2 * k, '2k es el residuo máximo de la raíz cuadrada; el de la raíz cúbica es 3k² + 3k.'),
      ],
      solucion: [[`Sobran a lo más 3 × ${k * k} + 3 × ${k} = ${3 * k * k + 3 * k}, porque con uno más se completa el cubo siguiente: ${f0(k ** 3)} + ${3 * k * k + 3 * k} = ${f0(N)}.`]],
      _datos: { k },
    };
  }

  // ======================= Idea 5: contar cuadrados y cubos en un tramo =======================
  const primera = (a, n) => { let k = 0; while (k ** n < a) k++; return k; };
  const ultima = (b, n) => raiz(b, n);
  function cifras(rng) {
    const [n, c] = rng.elegir([[2, 2], [2, 3], [2, 4], [2, 5], [3, 2], [3, 3], [3, 4], [3, 5]]);
    const k1 = primera(10 ** (c - 1), n), k2 = ultima(10 ** c - 1, n), t = k2 - k1 + 1, nom = n === 2 ? 'cuadrados' : 'cubos';
    return {
      enunciado: [`Los números de ${c} cifras van del ${f0(10 ** (c - 1))} al ${f0(10 ** c - 1)}.`], pregunta: [`¿Cuántos ${nom} perfectos tienen ${c} cifras?`],
      datos: [n === 2 ? D.contar : D.contar3, D.seguidos], correcta: t,
      errores: [
        h('AT-SIN-MAS-UNO', t - 1, 'Las bases están bien, pero la resta deja fuera una de ellas: hay que sumar 1.'),
        h('AT-DESDE-UNO', k2, 'Así se cuentan también los de menos cifras.'),
        h('AT-EXTREMO', t + 1, `${k1 - 1}${n === 2 ? '²' : '³'} tiene menos cifras: no entra.`),
      ],
      solucion: [[`Las bases van de ${k1} a ${k2}: ${k2} − ${k1} + 1 = ${t}.`]],
      _datos: { n, c },
    };
  }
  function entre(rng) {
    const a = rng.entero(101, 3000), b = rng.entero(a + 500, 9999), k1 = primera(a, 2), k2 = ultima(b, 2), c = k2 - k1 + 1;
    if (k1 * k1 === a) return null;
    return {
      enunciado: [`Doña Juana tendrá de ${f0(a)} a ${f0(b)} caramelos.`], pregunta: ['¿Cuántas de esas cantidades le permiten armar una bandeja cuadrada sin que sobre ninguno?'],
      datos: [D.contar, D.seguidos], correcta: c,
      errores: [
        h('AT-SIN-MAS-UNO', c - 1, 'Las bases están bien, pero la resta deja fuera una de ellas: hay que sumar 1.'),
        h('AT-DESDE-UNO', k2, 'Así se cuentan desde 1²; los menores que el comienzo no entran.'),
        h('AT-RAIZ-DIF', raiz(b - a, 2), 'La raíz de la diferencia no cuenta nada: se cuentan las bases.'),
      ],
      solucion: [[`${k1 - 1}² = ${f0((k1 - 1) ** 2)} queda antes del tramo, así que las bases van de ${k1} a ${k2}: ${k2} − ${k1} + 1 = ${c}.`]],
      _datos: { a, b },
    };
  }
  function cubosEntre(rng) {
    const a = rng.entero(30, 400), b = rng.entero(1000, 9000), k1 = primera(a, 3), k2 = ultima(b, 3), c = k2 - k1 + 1;
    if (k1 ** 3 === a) return null;
    return {
      enunciado: [`Doña Juana tendrá de ${a} a ${f0(b)} cubitos de chocolate.`], pregunta: ['¿Cuántas de esas cantidades le permiten armar un cubo macizo sin que sobre ninguno?'],
      datos: [D.contar3, D.seguidos], correcta: c,
      errores: [
        h('AT-SIN-MAS-UNO', c - 1, 'Las bases están bien, pero la resta deja fuera una de ellas: hay que sumar 1.'),
        h('AT-CUADRADA', ultima(b, 2) - primera(a, 2) + 1, 'Esos son los cuadrados del tramo, pero se piden los cubos.'),
        h('AT-DESDE-UNO', k2, 'Así se cuentan desde 1³, y los menores que el comienzo no entran.'),
      ],
      solucion: [[`${k1}³ = ${f0(k1 ** 3)} es el primero y ${k2}³ = ${f0(k2 ** 3)}, el último: ${k2} − ${k1} + 1 = ${c}.`]],
      _datos: { a, b },
    };
  }
  function oCubos(rng) {
    const L = rng.entero(300, 5000), c2 = ultima(L, 2), c3 = ultima(L, 3), c6 = ultima(L, 6), t = c2 + c3 - c6;
    return {
      enunciado: [`Doña Juana numera sus caramelos del 1 al ${f0(L)}.`], pregunta: ['¿Cuántos de esos números son cuadrados perfectos o cubos perfectos?'],
      datos: [D.contar, D.contar3, D.sexta], correcta: t,
      errores: [
        h('AT-SIN-RESTAR', c2 + c3, 'Contar los cuadrados y los cubos está bien, pero las sextas potencias se contaron dos veces.'),
        h('AT-RESTA-DOS-VECES', c2 + c3 - 2 * c6, 'Los repetidos se restan una sola vez: así quedan contados una vez, y no ninguna.'),
        h('AT-SOLO-AMBOS', c6, 'Esos son los que son cuadrado y cubo a la vez, pero se piden los que son uno u otro.'),
      ],
      solucion: [[`Hay ${c2} cuadrados y ${c3} cubos, y ${c6} de ellos son las dos cosas: ${c2} + ${c3} − ${c6} = ${t}.`]],
      _datos: { L },
    };
  }

  // ======================= Idea 6: aproximar una raíz =======================
  const dec = (t, n = 1) => (t / 10 ** n).toFixed(n).replace('.', ',');
  const cuad = (t, n = 1) => P.formatear(t * t / 10 ** (2 * n), 2 * n);
  const tDe = (N, n) => { const u = 10 ** n; let t = 0; while ((t + 1) ** 2 <= N * u * u) t++; return t; };
  function decimas(rng) {
    const N = rng.entero(2, 99), t = tDe(N, 1), k = raiz(N, 2);
    if (k * k === N) return null;
    const txt = u => `Entre ${dec(u)} y ${dec(u + 1)}`;
    return {
      enunciado: ['Doña Juana busca √', N_(N), ' sin la tecla de la raíz.'], pregunta: ['¿Entre qué décimas seguidas está?'],
      datos: [D.encierra, `${k}² = ${k * k}; ${k + 1}² = ${(k + 1) ** 2}`], correcta: txt(t),
      errores: [
        h('AT-COMPROBAR', txt(t + 1), `${dec(t + 1)}² = ${cuad(t + 1)} ya pasa de ${N}, así que la raíz está antes de ${dec(t + 1)}.`),
        h('AT-COMPROBAR', txt(t - 1), `${dec(t)}² = ${cuad(t)} todavía no pasa de ${N}, así que la raíz está después de ${dec(t)}.`),
        h('AT-MEDIO', 10 * k + 5 > t + 1 || 10 * k + 5 < t - 1 ? txt(10 * k + 5) : null, 'No se puede suponer que la raíz queda en el medio de los dos enteros: hay que comprobar elevando.'),
      ],
      solucion: [[`${dec(t)}² = ${cuad(t)} ≤ ${N} < ${cuad(t + 1)} = ${dec(t + 1)}², así que √${N} está entre ${dec(t)} y ${dec(t + 1)}.`]],
      _datos: { N },
    };
  }
  function raizSuma(rng) {
    const [a, b, c] = rng.elegir([[36, 64, 10], [25, 144, 13], [64, 225, 17], [81, 144, 15], [144, 256, 20], [49, 576, 25], [9, 40, 7], [16, 20, 6]]);
    const reparte = Math.sqrt(a) + Math.sqrt(b);
    return {
      enunciado: [`En su cuaderno, doña Juana escribe √(${a} + ${b}).`], pregunta: ['¿Cuánto vale?'],
      datos: [D.adentro], correcta: c,
      errores: [
        h('E-RSUMA', Number.isInteger(reparte) ? reparte : null, 'La raíz no se reparte en una suma: primero se suma lo de adentro y después se saca la raíz.'),
        h('E-RDIV', (a + b) / 2, 'Sacar raíz no es dividir entre 2.', x => P.formatear(x, 1)),
        h('AT-SIN-RAIZ', a + b, 'La suma está bien, pero falta sacarle la raíz.'),
      ],
      solucion: [[`√(${a} + ${b}) = √${a + b} = `, K_(c), '.']],
      _datos: { a, b },
    };
  }
  function exceso(rng) {
    const N = rng.entero(2, 99), t = tDe(N, 1), ex = rng.entero(0, 1) === 1;
    if (raiz(N, 2) ** 2 === N) return null;
    return {
      enunciado: ['Un piso cuadrado tiene ', N_(N), ' m² de área.'], pregunta: [`¿Cuánto mide su lado, por ${ex ? 'exceso' : 'defecto'} a la décima de metro?`],
      datos: [D.encierra, D.defecto, D.lado], correcta: `${dec(ex ? t + 1 : t)} m`,
      errores: [
        h('AT-DEFECTO-EXCESO', `${dec(ex ? t : t + 1)} m`, `El tramo está bien, pero por ${ex ? 'exceso se toma la mayor' : 'defecto se toma la menor'} de las dos.`),
        h('E-RDIV', `${P.formatear(N / 2, 1)} m`, 'Dividir entre 2 no es sacar raíz.'),
        h('AT-COMPROBAR', `${dec(ex ? t + 2 : t - 1)} m`, 'Ese valor no es ninguno de los dos bordes del tramo que encierra la raíz.'),
      ],
      solucion: [[`${dec(t)}² = ${cuad(t)} ≤ ${N} < ${cuad(t + 1)} = ${dec(t + 1)}², y por ${ex ? 'exceso se toma la mayor' : 'defecto se toma la menor'}.`]],
      _datos: { N, exceso: ex },
    };
  }
  function centesimas(rng) {
    const N = rng.entero(3, 60), t = tDe(N, 2), t1 = tDe(N, 1);
    if (raiz(N, 2) ** 2 === N) return null;
    const txt = u => `Entre ${dec(u, 2)} y ${dec(u + 1, 2)} m`;
    return {
      enunciado: ['Un terreno cuadrado tiene ', N_(N), ` m². Su lado está entre ${dec(t1)} y ${dec(t1 + 1)} m.`], pregunta: ['¿Entre qué centésimas de metro está?'],
      datos: [D.centesima, D.lado, `${dec(t, 2)}² = ${cuad(t, 2)}; ${dec(t + 1, 2)}² = ${cuad(t + 1, 2)}; ${dec(t + 2, 2)}² = ${cuad(t + 2, 2)}`], correcta: txt(t),
      errores: [
        h('AT-COMPROBAR', txt(t + 1), `${dec(t + 1, 2)}² = ${cuad(t + 1, 2)} ya pasa de ${N}, así que el lado está antes de ${dec(t + 1, 2)} m.`),
        h('AT-COMPROBAR', t - 1 >= 10 * t1 ? txt(t - 1) : null, `${dec(t, 2)}² = ${cuad(t, 2)} todavía no pasa de ${N}, así que el lado está después de ${dec(t, 2)} m.`),
        h('AT-MEDIO', 10 * t1 + 5 !== t ? txt(10 * t1 + 5) : null, 'No se puede suponer que el lado está en el medio del tramo: hay que comprobar elevando.'),
        h('AT-COMPROBAR', txt(t + 2), `${dec(t + 2, 2)}² ya pasa de ${N}, así que el lado está antes.`),
      ],
      solucion: [[`${cuad(t, 2)} ≤ ${N} < ${cuad(t + 1, 2)}: el lado está entre ${dec(t, 2)} y ${dec(t + 1, 2)} m.`]],
      _datos: { N },
    };
  }

  const CONSTRUIR = {
    'es-cuadrado': esCuadrado, 'mult-cuadrado': multiplica(2), 'mult-cubo': multiplica(3), 'div-cuadrados': divCuadrados,
    descarta, 'cifra-final': cifraFinal, 'pasa-no-es': pasaNoEs, oculta,
    'raiz-residuo': raizResiduo, faltan, 'mayor-n': mayorN, 'dos-residuos': dosResiduos,
    cubica, 'siguiente-cubo': siguienteCubo, arista, 'mayor-cubo': mayorCubo,
    cifras, entre, 'cubos-entre': cubosEntre, 'o-cubos': oCubos,
    decimas, 'raiz-suma': raizSuma, exceso, centesimas,
  };

  return { id: ID, titulo: 'La bandeja cuadrada de doña Juana', generar, TIPOS_POR_IDEA, TIPOS_POR_UNIDAD, NIVEL };
});
