/*
 * Generador «Ecuaciones polinomiales»: la práctica de las seis ideas de algebra.ecuaciones-polinomiales
 * (contenido/teoria/algebra/ecuaciones-polinomiales.js). Formato "predicciones" (docs/arquitectura.md). Funciona en el
 * navegador (window.Generadores['ecuaciones-polinomiales-practica']) y en Node (require). No usa ningún motor ni el código
 * de la teoría: las cuentas son productos, raíces enteras y fracciones chicas, hechas aquí.
 *
 * Propuesta: docs/etapa8/propuesta-algebra.md §7. Objetos como en la teoría: las cajas de Rubén y los precios (valores de
 * problema, sin fuente).
 *
 * Tipos por idea (TIPOS_POR_IDEA; nivel 1 un paso, 2 dos pasos, 3 de examen). generar(semilla, { idea }) da solo los de
 * esa idea; sin idea, las seis con el mismo peso.
 *   grado-raices        total (1; raíces de un P factorizado) · distintas (1; reales distintas) · no-reales (2; con Δ) ·
 *                       triple (3; raíz triple y término independiente, San Marcos 2027-I)
 *   viete               suma (1) · producto (1) · inversos (2) · coef-k (3; dos raíces dadas, San Marcos 2027-I)
 *   raices-racionales   no-puede (1) · cuantos (2; cuántos candidatos) · otras (2; las otras dos raíces) · caja (3;
 *                       la arista mayor por tanteo, San Marcos 2019-I y 2024-II)
 *   conjugadas          companera (1) · factor2 (2) · menor-grado (2) · raiz-real (3; San Marcos 2027-I)
 *   cambio-de-variable  reales-bicuad (1) · mayor (2) · en-t (2; recíproca) · precio (3; San Marcos 2023-I)
 *   binomica            reales-bin (1) · no-reales-bin (1) · producto-nr (2) · producto-todas (3)
 *
 * Notación: superíndices Unicode, el signo menos tipográfico «−», las raíces x₁, x₂, x₃; la i como dato (i² = −1).
 * Colores: un color fijo por magnitud, el de la teoría: las raíces violeta (r: f), los coeficientes naranja (c: o), el
 * número que se prueba y la variable auxiliar turquesa (n, u: i). Solo en la solución. Ni carmín ni verde.
 * Datos (contrato, punto 13): la fórmula general, Δ, Cardano-Vieta, la regla de los candidatos, la paridad, el cambio de
 * variable y las identidades, nunca el paso hecho ni la respuesta.
 * Errores: los códigos de la teoría (TAL-*, hipótesis de diseño). De todos los errores de un problema van 3 o 4, elegidos
 * para que la correcta no sea la central ni, si es un número, un extremo. Cada explicación empieza por lo que el alumno
 * hizo bien y dice lo que da su error.
 * La práctica no repite ninguna Predice de la unidad (grado 5 con 3 reales; 2x³ − 6x² + 4x + 10; 3x³ … + 2 con 3/2;
 * 2 + 3i; x⁴ + 3x² − 4; x³ = 8).
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
  const ID = 'ecuaciones-polinomiales-practica';
  const TEO = 'contenido/teoria/algebra/ecuaciones-polinomiales.js';
  const v = P.v;
  const f = x => P.formatear(x, 0);

  // ---- Escritura ----
  const SUPS = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const sup = s => [...String(s)].map(c => SUPS[c]).join('');
  const par = x => (x < 0 ? `(−${-x})` : String(x));
  const menosDe = c => (c < 0 ? `−(${f(c)})` : `−${f(c)}`);   // «−(−12)», «−10» (no «−(10)»)
  const lit = (e, L = 'x') => (e === 0 ? '' : e === 1 ? L : `${L}${sup(e)}`);
  function poli(cs, L = 'x') {
    const g = cs.length - 1, out = [];
    cs.forEach((c, i) => { if (c) { const e = g - i, m = Math.abs(c), cuerpo = `${m === 1 && e ? '' : f(m)}${lit(e, L)}`; out.push(out.length ? ` ${c < 0 ? '−' : '+'} ${cuerpo}` : `${c < 0 ? '−' : ''}${cuerpo}`); } });
    return out.join('') || '0';
  }
  const mcd = (a, b) => (b ? mcd(b, a % b) : Math.abs(a));
  const frac = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = mcd(Math.abs(n), d) || 1; n /= g; d /= g; return d === 1 ? f(n) : `${n < 0 ? '−' : ''}${Math.abs(n)}/${d}`; };
  const binx = a => (a === 0 ? 'x' : a > 0 ? `x − ${a}` : `x + ${-a}`);
  const mult = (A, B) => { const o = Array(A.length + B.length - 1).fill(0); A.forEach((a, i) => B.forEach((b, j) => { o[i + j] += a * b; })); return o; };
  const deRaices = (rs, a = 1) => rs.reduce((c, r) => mult(c, [1, -r]), [a]);
  const divisores = n => { const m = Math.abs(n), o = []; for (let k = 1; k <= m; k++) if (m % k === 0) o.push(k); return o; };
  const conI = (m, k, s) => `${m === 0 ? (s < 0 ? '−' : '') : `${f(m)} ${s < 0 ? '−' : '+'} `}${k === 1 ? '' : k}i`;
  const conR = (m, k, n, s) => `${m === 0 ? (s < 0 ? '−' : '') : `${f(m)} ${s < 0 ? '−' : '+'} `}${k === 1 ? '' : k}√${n}`;

  const VARS = {
    r: { nombre: 'la raíz', color: 'f' }, c: { nombre: 'el coeficiente', color: 'o' },
    n: { nombre: 'el número que se prueba', color: 'i' }, u: { nombre: 'la variable auxiliar', color: 'i' },
  };
  const Tr = t => v('r', t), Tc = t => v('c', t), Tu = t => v('u', t);

  // Un menos de teclado delante de un número, en cualquier texto que ve el alumno, pasa a «−» (Factorización, M2).
  const menos = t => (typeof t === 'string' ? t.replace(/(^|[\s(=:,/])-(?=\d)/g, '$1−') : t);
  const menosEn = linea => linea.map(x => (typeof x === 'string' ? menos(x) : x && typeof x === 'object' && typeof x.t === 'string' ? Object.assign({}, x, { t: menos(x.t) }) : x));
  // ---- Errores: todos son hipótesis de diseño de la teoría ----
  function e(id, texto, explicar) { if (texto === null || texto === undefined) return null; return { id, clave: texto, texto, explicacion: menos(explicar(texto)), respaldo: 'hipotesis', fuente: TEO }; }
  // Un número escrito como texto (respuestas de conteo: la correcta puede ser 0 o el menor posible, y en modo número
  // quedaría en un extremo).
  const et = (id, valor, explicar, u = '') => (Number.isFinite(valor) ? e(id, f(valor) + u, explicar) : null);
  function en(id, valor, explicar) { if (!Number.isFinite(valor)) return null; return { id, valor, texto: f(valor), explicacion: menos(explicar(f(valor))), respaldo: 'hipotesis', fuente: TEO }; }

  // ---- Datos que se repiten (herramientas, no el paso hecho) ----
  const D = {
    prodCero: 'Producto cero: un producto vale 0 solo si alguno de sus factores vale 0',
    cuadrado: 'Un número real al cuadrado nunca da un número negativo',
    tfa: 'Un polinomio de grado n tiene n raíces, contando las repetidas y las no reales',
    mult: 'Una raíz cuyo factor tiene exponente m se cuenta m veces',
    deltaDef: 'Discriminante: Δ = b² − 4ac',
    deltaTodo: 'Si Δ > 0, dos raíces reales; si Δ = 0, una doble; si Δ < 0, dos no reales',
    gradoProd: 'Grado de un producto: la suma de los grados de sus factores',
    indep: 'El término independiente de P es P(0)',
    vieta: 'En ax³ + bx² + cx + d = 0: x₁ + x₂ + x₃ = −b/a',
    vieta2: 'x₁x₂ + x₁x₃ + x₂x₃ = c/a',
    vieta3: 'x₁x₂x₃ = −d/a',
    inversos: '1/x₁ + 1/x₂ + 1/x₃ = (x₁x₂ + x₁x₃ + x₂x₃)/(x₁x₂x₃)',
    racional: 'Si p/q (reducida) es raíz y los coeficientes son enteros, p divide al término independiente y q al principal',
    cand: 'Candidatos: ± (divisor del término independiente)/(divisor del coeficiente principal)',
    repite: 'Fracciones que valen lo mismo, como 2/2 y 1, son un solo candidato',
    ruf: 'Ruffini: se baja el primero; cada casilla es el de arriba más el número que se prueba por la anterior',
    baja: 'Con una raíz x₁, P = (x − x₁) · (la fila de abajo, sin su último número)',
    volumen: 'Volumen de una caja: largo · ancho · alto',
    probar: 'Números por probar: los divisores del término independiente',
    medida: 'Una medida es un número positivo',
    i: 'i: el número con i² = −1; así, √−9 = 3i',
    conjR: 'Con coeficientes enteros, una raíz con √ inexacta trae a su conjugada: 3 + √2 trae a 3 − √2',
    conjI: 'Con coeficientes reales, una raíz no real trae a su conjugada: 1 + 2i trae a 1 − 2i',
    parFactor: 'Dos raíces dan el factor x² − (su suma)x + (su producto)',
    difCuad: 'A² − B² = (A + B)(A − B)',
    difCubos: 'A³ − B³ = (A − B)(A² + AB + B²)',
    sumCubos: 'A³ + B³ = (A + B)(A² − AB + B²)',
    sp2: 'En ax² + bx + c = 0, las dos raíces suman −b/a y multiplican c/a',
    bicuad: 'En ax⁴ + bx² + c = 0 se cambia x² por u: queda au² + bu + c = 0',
    vuelta: 'x² = u da x = ±√u si u > 0; si u < 0, dos raíces no reales',
    reciproca: 'Recíproca: se divide entre x² y se cambia x + 1/x por t',
    t2: 'x² + 1/x² = t² − 2, si t = x + 1/x',
    precio: 'Un precio es un número positivo',
    par: 'Un número real elevado a un exponente par nunca es negativo',
    prod4: 'Con la ecuación escrita como … = 0, en grado 4 el producto de las cuatro raíces es (término independiente)/a',
  };
  const VIETA = [D.vieta, D.vieta2, D.vieta3];

  // ---- Tipos por idea ----
  const TIPOS_POR_IDEA = {
    'grado-raices': ['total', 'distintas', 'no-reales', 'triple'],
    viete: ['suma', 'producto', 'inversos', 'coef-k'],
    'raices-racionales': ['no-puede', 'cuantos', 'otras', 'caja'],
    conjugadas: ['companera', 'factor2', 'menor-grado', 'raiz-real'],
    'cambio-de-variable': ['reales-bicuad', 'mayor', 'en-t', 'precio'],
    binomica: ['reales-bin', 'no-reales-bin', 'producto-nr', 'producto-todas'],
  };
  const IDEAS = Object.keys(TIPOS_POR_IDEA);
  const IDEA_DE = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map(t => [t, i])));
  const NIVEL = {
    total: 1, distintas: 1, 'no-reales': 2, triple: 3,
    suma: 1, producto: 1, inversos: 2, 'coef-k': 3,
    'no-puede': 1, cuantos: 2, otras: 2, caja: 3,
    companera: 1, factor2: 2, 'menor-grado': 2, 'raiz-real': 3,
    'reales-bicuad': 1, mayor: 2, 'en-t': 2, precio: 3,
    'reales-bin': 1, 'no-reales-bin': 1, 'producto-nr': 2, 'producto-todas': 3,
  };
  // Papel (regla 6; herramientas/papel-generador.js usa «papel-1» a «papel-8»): las seis ideas, de menos a más, con dos
  // preguntas del tipo de San Marcos al final.
  const PAPEL = { 'papel-1': 'total', 'papel-2': 'producto', 'papel-3': 'otras', 'papel-4': 'factor2', 'papel-5': 'reales-bicuad',
    'papel-6': 'producto-nr', 'papel-7': 'caja', 'papel-8': 'coef-k' };

  function generar(semilla, opciones) {
    const o = typeof opciones === 'string' ? { unidad: opciones } : opciones || {};
    const rng = Azar.crear(ID + '|' + semilla);
    let tipo = !o.idea && PAPEL[String(semilla)];
    if (!tipo) { const idea = TIPOS_POR_IDEA[o.idea] ? o.idea : rng.elegir(IDEAS); tipo = rng.elegir(TIPOS_POR_IDEA[idea]); }
    for (let intento = 0; intento < 500; intento++) {
      const pr = CONSTRUIR[tipo](rng);
      const p = pr && cerrar(rng, semilla, tipo, pr);
      if (p) return p;
    }
    throw new Error(`${ID}: no se pudo generar un problema de ${tipo} con 4 alternativas distintas`);
  }

  // Qué errores van: 4 (o 3) con los que la correcta no queda en el centro ni, si es un número, en un extremo
  // (probarFugas, nucleo/probar-generador.js). La distancia es la de probarFugas.
  const trozos = t => String(t).replace(/[()]/g, ' ').split(/[\s;,]+|(?=[+−\-·/])|(?<=[+−\-·/])/).filter(Boolean);
  const distancia = (a, b) => { const A = trozos(a), B = trozos(b); let d = 0; for (let i = 0; i < Math.max(A.length, B.length); i++) if (A[i] !== B[i]) d++; return d; };
  function subconjuntos(l, k) {
    if (k === 0) return [[]];
    const r = [];
    for (let i = 0; i <= l.length - k; i++) for (const resto of subconjuntos(l.slice(i + 1), k - 1)) r.push([l[i], ...resto]);
    return r;
  }
  function elegirErrores(rng, correcta, errores, numero) {
    const vistos = new Set([correcta.texto]), pool = [];
    for (const x of rng.barajar(errores)) if (!vistos.has(x.texto)) { vistos.add(x.texto); pool.push(x); }
    const bueno = sub => {
      const al = [correcta, ...sub], sc = al.map(a => al.reduce((t, b) => t + distancia(a.texto, b.texto), 0));
      const min = Math.min(...sc);
      if (sc[0] === min && sc.filter(x => x === min).length === 1) return false;
      if (numero) { const vs = al.map(a => a.valor); if (correcta.valor === Math.max(...vs) || correcta.valor === Math.min(...vs)) return false; }
      return true;
    };
    for (const k of [4, 3]) for (const sub of subconjuntos(pool, Math.min(k, pool.length))) if (sub.length >= 3 && bueno(sub)) return sub;
    return null;
  }
  function cerrar(rng, semilla, tipo, o) {
    let alternativas, respuesta;
    if (typeof o.correcta === 'string') {
      const errores = elegirErrores(rng, { texto: o.correcta }, o.errores.filter(Boolean), false);
      if (!errores) return null;
      alternativas = P.armarTexto({ correcta: { clave: o.correcta, texto: o.correcta }, errores, rng });
      respuesta = { valor: o.correcta, texto: o.correcta, unidad: o.unidad || '' };
    } else {
      const validos = o.errores.filter(x => x && Number.isFinite(x.valor) && x.valor !== o.correcta);
      const errores = elegirErrores(rng, { texto: f(o.correcta), valor: o.correcta }, validos, true);
      if (!errores) return null;
      alternativas = P.armar({ correcta: o.correcta, errores, rng, negativos: true, texto: x => f(x) + (o.unidad ? ` ${o.unidad}` : '') });
      respuesta = { valor: o.correcta, unidad: o.unidad || '' };
    }
    if (alternativas.length < 4) return null;
    const usadas = new Set();
    for (const linea of [o.enunciado, o.pregunta, ...o.solucion]) for (const x of linea) if (x && typeof x === 'object') usadas.add(x.v);
    const variables = Object.fromEntries([...usadas].map(k => [k, Object.assign({}, VARS[k])]));
    return {
      id: `${ID}#${semilla}`, variables, enunciado: menosEn(o.enunciado), pregunta: menosEn(o.pregunta), datos: o.datos,
      alternativas, solucion: o.solucion.map(menosEn), respuesta,
      _datos: Object.assign({ idea: IDEA_DE[tipo], tipo, nivel: NIVEL[tipo] }, o._datos),
    };
  }
  const noCero = (rng, a, b) => { let x = 0; while (x === 0) x = rng.entero(a, b); return x; };

  // ======================= Idea 1: raíces y grado =======================
  function factorizado(rng) {
    const a = rng.entero(1, 6), b = rng.entero(1, 6), m = rng.entero(1, 3), k = rng.entero(1, 3), c = rng.elegir([1, 4, 9, 16, 25]);
    if (a === b || m + k < 3) return null;
    const pw = (t, e) => (e === 1 ? `(${t})` : `(${t})${sup(e)}`);
    return { a, b, m, k, c, Pt: `${pw(binx(a), m)}${pw(binx(-b), k)}(x² + ${c})`, total: m + k + 2 };
  }
  function total(rng) {
    const q = factorizado(rng); if (!q) return null;
    return {
      enunciado: [`P(x) = ${q.Pt}.`], pregunta: ['¿Cuántas raíces tiene P, contando las repetidas y las no reales?'],
      datos: [D.tfa, D.mult, D.gradoProd], correcta: q.total,
      errores: [
        en('TAL-MULTIPLICIDAD', 4, t => `Bien las dos no reales de x² + ${q.c}. Pero las repetidas se cuentan cada vez: no son ${t}.`),
        en('TAL-SOLO-REAL', q.m + q.k, t => `Bien las reales con sus repeticiones, ${t}. Pero x² + ${q.c} aporta dos no reales más.`),
        en('TAL-GRADO', q.total + 1, t => `Bien sumar exponentes. Pero x² + ${q.c} es de grado 2: aporta dos, no tres; no son ${t}.`),
        en('TAL-SOLO-REAL', 2, t => `Bien los dos valores reales, ${q.a} y −${q.b}. Pero no son ${t}: faltan las repeticiones y las no reales.`),
      ],
      solucion: [['Cada factor aporta tantas raíces como su grado.'], [`${q.m} + ${q.k} + 2 = `, Tr(f(q.total)), '.']],
      _datos: q,
    };
  }
  function distintas(rng) {
    const q = factorizado(rng); if (!q) return null;
    return {
      enunciado: [`P(x) = ${q.Pt}.`], pregunta: ['¿Cuántas raíces reales distintas tiene P?'],
      datos: [D.prodCero, D.cuadrado], correcta: f(2),
      errores: [
        et('TAL-MULTIPLICIDAD', q.m + q.k, t => `Bien ${q.a} y −${q.b}. Pero se piden distintas: ${t} cuenta las repetidas.`),
        et('TAL-SOLO-REAL', q.total, t => `Bien el grado, ${t}. Pero x² + ${q.c} no da reales.`),
        et('TAL-NOREAL-REAL', 4, t => `Bien ${q.a} y −${q.b}. Pero x² + ${q.c} = 0 no tiene raíz real: no son ${t}.`),
        et('TAL-NOREAL-REAL', 3, t => `Bien ${q.a} y −${q.b}. Pero x² + ${q.c} no aporta ninguna real: no son ${t}.`),
        et('TAL-PIDE', 1, t => `Bien ${q.a}. Pero ${binx(-q.b)} también da una real, −${q.b}: no es ${t}.`),
      ],
      solucion: [[`Solo ${binx(q.a)} y ${binx(-q.b)} se anulan con x real.`], [Tr(`x = ${q.a}`), ' y ', Tr(`x = −${q.b}`), '.']],
      _datos: q,
    };
  }
  function noReales(rng) {
    const r0 = noCero(rng, -5, 5), B = noCero(rng, -7, 7), C = noCero(rng, -10, 14), Dl = B * B - 4 * C;
    if (Dl === 0) return null;
    const bien = Dl < 0 ? 2 : 0;
    return {
      enunciado: [`La ecuación es (${binx(r0)})(${poli([1, B, C])}) = 0.`], pregunta: ['¿Cuántas raíces no reales tiene?'],
      datos: [D.prodCero, D.deltaDef, D.deltaTodo], correcta: f(bien),
      errores: [
        et(bien ? 'TAL-NOREAL-REAL' : 'TAL-SOLO-REAL', 2 - bien, t => bien ? `Bien el ${r0}. Pero Δ = ${Dl} es negativo: el trinomio no da reales, y no son ${t}.` : `Bien mirar el trinomio. Pero Δ = ${Dl} es positivo: sus raíces son reales, y no son ${t}.`),
        et('TAL-CONJUGADA', 1, t => `Bien usar Δ. Pero el trinomio da dos raíces del mismo tipo: nunca ${t} sola.`),
        et('TAL-GRADO', 3, t => `Bien el grado, ${t}. Pero ${binx(r0)} da la raíz real ${r0}.`),
        et('TAL-GRADO', 4, t => `Bien contar raíces. Pero el grado es 3: no pueden ser ${t}.`),
      ],
      solucion: [[`${binx(r0)} da una raíz real. Del trinomio decide Δ.`], [`Δ = ${par(B)}² − 4 · 1 · ${par(C)} = ${Dl}: `, Tr(`${bien} no reales`), '.']],
      _datos: { r0, B, C },
    };
  }
  function triple(rng) {
    const a = rng.elegir([1, 2, -1, -2, 3, -3]), k = noCero(rng, -6, 6);
    if (k === a || Math.abs(a ** 3 * k) > 300) return null;
    const d = a ** 3 * k;
    return {
      enunciado: [`P(x) = (${binx(a)})³(x − k) tiene la raíz triple ${f(a)}, y su término independiente es ${f(d)}.`], pregunta: ['¿Cuánto vale k?'],
      datos: [D.indep, 'P(0) es el producto de los factores con x = 0'], correcta: k,
      errores: [
        en('TAL-SIGNO', -k, t => `Bien usar P(0). Pero ${par(-a)}³ · (−k) da ${f(a ** 3)}k: el signo de −k cuenta; no es ${t}.`),
        Number.isInteger(d / a) ? en('TAL-TRIPLE-UNA', d / a, t => `Bien igualar P(0) a ${f(d)}. Pero ${binx(a)} va tres veces; con una sola sale ${t}.`) : null,
        Number.isInteger(d / (3 * a)) ? en('TAL-TRIPLE-SUMA', d / (3 * a), t => `Bien la raíz triple. Pero se eleva al cubo, no se multiplica por 3; así sale ${t}.`) : null,
        en('TAL-PIDE', d, t => `Bien el término independiente, ${t}. Pero k es la cuarta raíz: falta dividir entre ${f(a ** 3)}.`),
      ],
      solucion: [['Con x = 0, cada factor deja su número.'], [`P(0) = ${par(-a)}³ · (−k) = ${f(a ** 3)}k = ${f(d)}, y k = `, Tr(f(k)), '.']],
      _datos: { a, k, d },
    };
  }

  // ======================= Idea 2: raíces y coeficientes =======================
  function cubica(rng, as = [2, 3]) {
    const a = rng.elegir(as), rs = [noCero(rng, -4, 5), noCero(rng, -4, 5), noCero(rng, -4, 5)], cs = deRaices(rs, a);
    if (cs.some(x => x === 0 || Math.abs(x) > 90)) return null;
    return { a, rs, cs, S: rs[0] + rs[1] + rs[2], M: rs[0] * rs[1] + rs[0] * rs[2] + rs[1] * rs[2], V: rs[0] * rs[1] * rs[2] };
  }
  function suma(rng) {
    const q = cubica(rng); if (!q || q.S === 0) return null;
    return {
      enunciado: [`La ecuación es ${poli(q.cs)} = 0.`], pregunta: ['¿Cuánto suman sus tres raíces?'],
      datos: VIETA, correcta: q.S,
      errores: [
        en('TAL-NORMALIZA', q.a * q.S, t => `Bien cambiar el signo de b. Pero falta dividir entre a = ${q.a}: ${t} no.`),
        en('TAL-SIGNO-VIETE', -q.S, t => `Bien dividir entre ${q.a}. Pero la suma es −b/a: con b/a sale ${t}.`),
        en('TAL-PRODUCTO', q.M, t => `Bien dividir entre a. Pero ${t} sale de c: es la suma de productos de a dos.`),
        en('TAL-PRODUCTO', q.V, t => `Bien dividir entre a. Pero ${t} sale de d: es el producto.`),
      ],
      solucion: [[`La suma es −b/a, con b = ${q.cs[1]} y a = ${q.a}.`], [`${menosDe(q.cs[1])}/${q.a} = `, Tr(f(q.S)), '.']],
      _datos: q,
    };
  }
  function producto(rng) {
    const q = cubica(rng); if (!q || q.V === 0) return null;
    return {
      enunciado: [`La ecuación es ${poli(q.cs)} = 0.`], pregunta: ['¿Cuánto vale el producto de sus tres raíces?'],
      datos: VIETA, correcta: q.V,
      errores: [
        en('TAL-SIGNO-VIETE', -q.V, t => `Bien dividir entre ${q.a}. Pero en grado 3 el producto es −d/a: con d/a sale ${t}.`),
        en('TAL-NORMALIZA', q.a * q.V, t => `Bien cambiar el signo de d. Pero falta dividir entre a = ${q.a}: ${t} no.`),
        en('TAL-PRODUCTO', q.S, t => `Bien dividir entre a. Pero ${t} sale de b: es la suma.`),
        en('TAL-PRODUCTO', q.M, t => `Bien dividir entre a. Pero ${t} sale de c: es la suma de productos de a dos.`),
      ],
      solucion: [[`El producto es −d/a, con d = ${q.cs[3]} y a = ${q.a}.`], [`${menosDe(q.cs[3])}/${q.a} = `, Tr(f(q.V)), '.']],
      _datos: q,
    };
  }
  function inversos(rng) {
    const q = cubica(rng, [1, 2]); if (!q || q.M === 0 || q.S === 0 || Math.abs(q.M) === Math.abs(q.V)) return null;
    const bien = frac(q.M, q.V);
    return {
      enunciado: [`x₁, x₂ y x₃ son las raíces de ${poli(q.cs)} = 0.`], pregunta: ['¿Cuánto vale 1/x₁ + 1/x₂ + 1/x₃?'],
      datos: [...VIETA, D.inversos], correcta: bien,
      errores: [
        e('TAL-SIGNO-VIETE', frac(-q.M, q.V), t => `Bien los de a dos sobre el producto. Pero el producto es −d/a = ${q.V}; con d/a sale ${t}.`),
        e('TAL-INVERSOS-AL-REVES', frac(q.V, q.M), t => `Bien usar los de a dos y el producto. Pero arriba va ${q.M}; al revés sale ${t}.`),
        e('TAL-PRODUCTO', frac(1, q.S), t => `Bien la suma, ${q.S}. Pero la suma de inversos no es ${t}, el inverso de la suma.`),
        e('TAL-NORMALIZA', frac(q.cs[2], q.cs[3]), t => `Bien usar c y d. Pero falta el signo de −d/a: c/d da ${t}.`),
      ],
      solucion: [['Con denominador común, arriba quedan los productos de a dos y abajo el producto.'], [`${q.M}/${par(q.V)} = `, Tr(bien), '.']],
      _datos: q,
    };
  }
  function coefK(rng) {
    const rs = rng.barajar([1, 2, 3, 4, 5, 6, -1, -2, -3]).slice(0, 3), S = rs[0] + rs[1] + rs[2], V = rs[0] * rs[1] * rs[2];
    const M = rs[0] * rs[1] + rs[0] * rs[2] + rs[1] * rs[2];
    if (S === 0 || M === 0) return null;
    const ec = `x³ ${S > 0 ? '−' : '+'} ${Math.abs(S) === 1 ? '' : Math.abs(S)}x² + kx ${V > 0 ? '−' : '+'} ${Math.abs(V)} = 0`;
    return {
      enunciado: [`La ecuación ${ec} tiene las raíces ${f(rs[0])} y ${f(rs[1])}.`], pregunta: ['¿Cuánto vale k?'],
      datos: VIETA, correcta: M,
      errores: [
        en('TAL-PIDE', rs[2], t => `Bien la tercera raíz, ${t}, con la suma. Pero k es la suma de los productos de a dos.`),
        en('TAL-SIGNO-VIETE', -M, t => `Bien los productos de a dos. Pero el de x es c/a, sin cambiar el signo: no ${t}.`),
        en('TAL-VIETE-UNA', rs[0] * rs[1], t => `Bien multiplicar ${f(rs[0])} por ${f(rs[1])}, ${t}. Pero son tres parejas.`),
        en('TAL-PRODUCTO', V, t => `Bien con Cardano-Vieta. Pero ${t} es el producto de las tres, no k.`),
      ],
      solucion: [[`La suma da la tercera raíz: ${S} − ${par(rs[0])} − ${par(rs[1])} = ${rs[2]}.`], [`k = ${par(rs[0])} · ${par(rs[1])} + ${par(rs[0])} · ${par(rs[2])} + ${par(rs[1])} · ${par(rs[2])} = `, Tc(f(M)), '.']],
      _datos: { rs },
    };
  }

  // ======================= Idea 3: raíces racionales =======================
  function candidatosDe(L, C) {
    const out = new Map();
    for (const p of divisores(C)) for (const q of divisores(L)) for (const s of [1, -1]) { const t = frac(s * p, q); out.set(t, [s * p / mcd(p, q), q / mcd(p, q)]); }
    return [...out.values()];
  }
  function noPuede(rng) {
    const L = rng.elegir([2, 3, 4, 5]), C = rng.elegir([2, 3, 5, 6, 7]) * rng.elegir([1, -1]);
    if ((L === 3 && Math.abs(C) === 2) || mcd(L, C) !== 1) return null;
    const malas = [];
    for (const p of [L, 2 * L]) for (const q of divisores(C)) if (mcd(p, q) === 1 && Math.abs(C) % p !== 0) malas.push([p * rng.elegir([1, -1]), q]);
    if (!malas.length) return null;
    const mala = rng.elegir(malas), validos = candidatosDe(L, C).filter(([p, q]) => !(p === 1 && q === 1));
    const cod = ([p, q]) => (q === 1 ? 'TAL-PQ-ENTERO' : p < 0 ? 'TAL-PQ-SIGNO' : 'TAL-PQ-INVERTIDO');
    return {
      enunciado: [`Un polinomio con coeficientes enteros tiene coeficiente principal ${L} y término independiente ${f(C)}.`], pregunta: ['¿Cuál de estos números NO puede ser una raíz suya?'],
      datos: [D.racional, `Divisores de ${Math.abs(C)}: ${divisores(C).join(', ')}`, `Divisores de ${L}: ${divisores(L).join(', ')}`], correcta: frac(mala[0], mala[1]),
      errores: rng.barajar(validos).slice(0, 5).map(m => e(cod(m), frac(m[0], m[1]), t => `Bien revisar la lista. Pero ${t} sí puede: ${Math.abs(m[0])} divide a ${Math.abs(C)} y ${m[1]} divide a ${L}.`)),
      solucion: [[`Arriba va un divisor de ${Math.abs(C)} y abajo uno de ${L}.`], [Tr(frac(mala[0], mala[1])), ` tiene arriba ${Math.abs(mala[0])}, que no divide a ${Math.abs(C)}.`]],
      _datos: { L, C, mala },
    };
  }
  function cuantos(rng) {
    const L = rng.elegir([2, 3, 4]), C = rng.elegir([4, 6, 8, 9, 10, 12]) * rng.elegir([1, -1]), B = noCero(rng, -5, 5), Dd = noCero(rng, -6, 6);
    const cs = [L, B, Dd, C];
    if (mcd(mcd(L, B), mcd(Dd, C)) !== 1) return null;
    const n = candidatosDe(L, C).length, dp = divisores(C).length, dq = divisores(L).length;
    return {
      enunciado: [`La ecuación es ${poli(cs)} = 0.`], pregunta: ['¿Cuántos candidatos a raíz racional tiene?'],
      datos: [D.racional, D.cand, D.repite], correcta: n,
      errores: [
        en('TAL-CAND-SIGNO', n / 2, t => `Bien las fracciones de divisores, ${t}. Pero cada una va con + y con −.`),
        en('TAL-CAND-REPITE', 2 * dp * dq, t => `Bien con los dos signos. Pero ${t} cuenta fracciones que valen lo mismo, como 2/2 y 1.`),
        en('TAL-OLVIDA-PRINC', 2 * dp, t => `Bien los divisores de ${Math.abs(C)} con su signo, ${t}. Pero faltan las fracciones entre divisores de ${L}.`),
        en('TAL-OLVIDA-PRINC', dp, t => `Bien los divisores de ${Math.abs(C)}, ${t}. Pero faltan los signos y las fracciones.`),
      ],
      solucion: [[`Divisores de ${Math.abs(C)} entre divisores de ${L}, sin repetir, con los dos signos.`], [`2 · ${n / 2} = `, Tr(f(n)), '.']],
      _datos: { cs },
    };
  }
  function otras(rng) {
    const r0 = noCero(rng, -4, 4), q = rng.elegir([1, 2, 2, 3]), p = noCero(rng, -5, 5), s = noCero(rng, -4, 4);
    if (mcd(p, q) !== 1 || p === q * r0 || s === r0 || p === q * s || (q === 1 && Math.abs(p) === Math.abs(s))) return null;
    const cs = mult(mult([1, -r0], [q, -p]), [1, -s]);
    if (cs.some(x => Math.abs(x) > 60)) return null;
    const dos = (a, b) => `${a} y ${b}`;
    return {
      enunciado: [`x = ${f(r0)} es raíz de ${poli(cs)} = 0.`], pregunta: ['¿Cuáles son las otras dos raíces?'],
      datos: [D.ruf, D.baja, D.prodCero], correcta: dos(frac(p, q), f(s)),
      errores: [
        e('TAL-FACTOR-SIGNO', dos(frac(-p, q), f(-s)), t => `Bien el trinomio de Ruffini. Pero ${binx(s)} = 0 da ${f(s)}: ${t} tiene los signos cambiados.`),
        q > 1 ? e('TAL-OLVIDA-PRINC', dos(f(p), f(s)), t => `Bien los factores. Pero ${poli([q, -p])} = 0 da ${frac(p, q)}; ${t} no divide entre ${q}.`) : e('TAL-PIDE', dos(f(r0), f(s)), t => `Bien ${f(s)}. Pero ${f(r0)} ya se conocía: ${t} repite la dada.`),
        e('TAL-PQ-INVERTIDO', dos(frac(q, p), f(s)), t => `Bien ${f(s)}. Pero la fracción va al revés en ${t}: es ${frac(p, q)}.`),
      ],
      solucion: [[`Ruffini con ${f(r0)} deja un trinomio que se abre con aspa.`], [`${poli(cs)} = (${binx(r0)})(${poli(mult([q, -p], [1, -s]))}): `, Tr(frac(p, q)), ' y ', Tr(f(s)), '.']],
      _datos: { r0, p, q, s, cs },
    };
  }
  function caja(rng) {
    const x0 = rng.entero(2, 7), al = rng.entero(1, 4), be = rng.entero(1, 5);
    if (al === be) return null;
    const V = x0 * (x0 + al) * (x0 + be), mayor = x0 + Math.max(al, be);
    return {
      enunciado: [`Una caja mide x dm de largo, (x + ${al}) dm de ancho y (x + ${be}) dm de alto, y guarda ${f(V)} dm³.`], pregunta: ['¿Cuánto mide su arista mayor?'],
      datos: [D.volumen, D.probar, D.medida], correcta: mayor, unidad: 'dm',
      errores: [
        en('TAL-PIDE', x0, t => `Bien x = ${t}. Pero se pide la arista mayor, x + ${Math.max(al, be)}.`),
        en('TAL-PIDE', x0 + Math.min(al, be), t => `Bien x = ${x0}. Pero ${t} es la arista del medio.`),
        en('TAL-SUMA', 3 * x0 + al + be, t => `Bien las tres aristas. Pero ${t} es su suma.`),
        en('TAL-PIDE', x0 + al + be, t => `Bien x = ${x0}. Pero ${t} suma los dos agregados a la vez.`),
      ],
      solucion: [[`Se prueba x = ${x0}: ${x0} · ${x0 + al} · ${x0 + be} = ${f(V)}. Las otras raíces no son positivas.`], ['La mayor es ', Tr(`${mayor} dm`), '.']],
      _datos: { x0, al, be },
    };
  }

  // ======================= Idea 4: raíces en pareja =======================
  const NOCUAD = [2, 3, 5, 6, 7, 10];
  // Nunca la raíz de la predicción (2 + 3i y su conjugada).
  function pareja(rng) {
    const clase = rng.elegir(['i', 'r']), m = noCero(rng, -5, 5), k = rng.entero(1, 4), n = rng.elegir(NOCUAD), s = rng.elegir([1, -1]);
    if (clase === 'i' && m === 2 && k === 3) return pareja(rng);
    return clase === 'i' ? { clase, m, k, s, txt: conI(m, k, s), conj: conI(m, k, -s), sum: 2 * m, prod: m * m + k * k, otro: m * m - k * k }
      : { clase, m, k, n, s, txt: conR(m, k, n, s), conj: conR(m, k, n, -s), sum: 2 * m, prod: m * m - k * k * n, otro: m * m + k * k * n };
  }
  function companera(rng) {
    const q = pareja(rng), w = (mm, ss) => (q.clase === 'i' ? conI(mm, q.k, ss) : conR(mm, q.k, q.n, ss));
    return {
      enunciado: [`${q.txt} es raíz de un polinomio con coeficientes enteros.`], pregunta: ['¿Cuál de estos números también es raíz, seguro?'],
      datos: q.clase === 'i' ? [D.conjI, D.i] : [D.conjR], correcta: q.conj,
      errores: [
        e('TAL-CONJ-REAL', w(-q.m, q.s), t => `Bien que llega otra raíz. Pero ${t} cambia el ${f(q.m)}, el número sin √ ni i; la conjugada lo conserva.`),
        e('TAL-CONJ-OPUESTO', w(-q.m, -q.s), t => `Bien cambiar el signo del medio. Pero ${t} también cambia el ${f(q.m)}.`),
        q.k !== Math.abs(q.m) ? e('TAL-CONJ-CRUZA', q.clase === 'i' ? conI(q.k * Math.sign(q.m), Math.abs(q.m), q.s) : conR(q.k * Math.sign(q.m), Math.abs(q.m), q.n, q.s), t => `Bien buscar una parecida. Pero ${t} cruza los dos números.`) : null,
        // Sin la raíz dada entre las opciones: también es raíz «seguro», y serían dos respuestas (auditoría, 20 nov).
      ],
      solucion: [['La conjugada conserva el número sin √ ni i y cambia el signo de lo que lleva √ o i.'], [Tr(q.conj), '.']],
      _datos: q,
    };
  }
  function factor2(rng) {
    const q = pareja(rng), fac = (s, p) => poli([1, -s, p]);
    return {
      enunciado: [`${q.txt} es raíz de P, que tiene coeficientes enteros.`], pregunta: ['¿Qué factor de grado 2 tiene P, seguro?'],
      datos: [q.clase === 'i' ? D.conjI : D.conjR, D.parFactor, D.difCuad, ...(q.clase === 'i' ? [D.i] : [])], correcta: fac(q.sum, q.prod),
      errores: [
        e('TAL-SIGNO-VIETE', fac(-q.sum, q.prod), t => `Bien el producto, ${q.prod}. Pero en ${t} la suma no cambió de signo.`),
        e('TAL-CONJ-PRODUCTO', fac(q.sum, q.otro), t => q.clase === 'i' ? `Bien la suma. Pero con i² = −1 el producto suma: ${t} lo resta.` : `Bien la suma. Pero el producto es una diferencia de cuadrados: ${t} suma.`),
        e('TAL-CONJ-SUMA', fac(q.m, q.prod), t => `Bien el producto. Pero la suma es ${par(q.m)} + ${par(q.m)} = ${q.sum}, no la de ${t}.`),
        e('TAL-SIGNO', fac(q.sum, -q.prod), t => `Bien la suma, ${q.sum}. Pero el producto va con su signo, ${q.prod}: ${t} lo cambia.`),
      ],
      solucion: [[`La pareja suma ${q.sum} y multiplica ${q.prod}.`], [Tr(fac(q.sum, q.prod)), '.']],
      _datos: q,
    };
  }
  function menorGrado(rng) {
    const n = rng.elegir(NOCUAD), m = noCero(rng, -3, 3), k = rng.entero(1, 3), r = noCero(rng, -5, 5), s = rng.elegir([1, -1]), dos = rng.elegir([true, false]);
    const lista = rng.barajar([`√${n}`, conI(m, k, s), f(r), ...(dos ? [f(r + 7)] : [])]);
    const bien = 4 + (dos ? 2 : 1);
    return {
      enunciado: [`P tiene coeficientes enteros y, entre sus raíces, ${lista.slice(0, -1).join(', ')} y ${lista[lista.length - 1]}.`], pregunta: ['¿Cuál es el menor grado que puede tener P?'],
      datos: [D.conjR, D.conjI, D.tfa], correcta: bien,
      errores: [
        en('TAL-CONJ-SOLA', lista.length, t => `Bien una raíz por número dado, ${t}. Pero √ e i traen a su conjugada.`),
        en('TAL-CONJ-SOLA', bien - 1, t => `Bien una pareja. Pero las dos traen compañera: ${t} se queda corto.`),
        en('TAL-CONJ-SOLA', bien + (dos ? 2 : 1), t => `Bien las parejas. Pero un entero no trae compañera: no son ${t}.`),
      ],
      solucion: [[`√${n} y ${conI(m, k, s)} traen a su conjugada; ${dos ? 'los enteros' : `el entero ${f(r)}`} no.`], [Tr(`grado ${bien}`), '.']],
      _datos: { n, m, k, r, dos },
    };
  }
  function raizReal(rng) {
    const m = noCero(rng, -3, 3), k = rng.entero(1, 3), r = noCero(rng, -6, 6), s = rng.elegir([1, -1]);
    const N = m * m + k * k, d = -r * N;
    if (Math.abs(d) > 120 || m * m === k * k || (m === 2 && k === 3)) return null;
    return {
      enunciado: [`La ecuación x³ + bx² + cx ${d < 0 ? '−' : '+'} ${Math.abs(d)} = 0, con b y c enteros, tiene la raíz ${conI(m, k, s)}.`], pregunta: ['¿Cuál es su raíz real?'],
      datos: [D.conjI, ...VIETA, D.i], correcta: r,
      errores: [
        en('TAL-SIGNO-VIETE', -r, t => `Bien el producto de la pareja, ${N}. Pero el de las tres es −d; con d sale ${t}.`),
        Number.isInteger(-d / (m * m - k * k)) ? en('TAL-CONJ-PRODUCTO', -d / (m * m - k * k), t => `Bien usar el producto. Pero con i² = −1 la pareja da ${N}; restando sale ${t}.`) : null,
        Number.isInteger(-d / (2 * m)) ? en('TAL-PRODUCTO', -d / (2 * m), t => `Bien la pareja. Pero su suma, ${2 * m}, no va con d; así sale ${t}.`) : null,
        en('TAL-PIDE', N, t => `Bien el producto de la pareja, ${t}. Pero falta dividir ${f(-d)} entre él.`),
      ],
      solucion: [[`${conI(m, k, -s)} también es raíz; el producto de las tres es −d.`], [`${N} · x₃ = ${f(-d)}, y x₃ = `, Tr(f(r)), '.']],
      _datos: { m, k, r, s },
    };
  }

  // ======================= Idea 5: bicuadradas y recíprocas =======================
  const ec4 = (s, p) => `${poli([1, 0, -s, 0, p])} = 0`;
  const raizTxt = u => (Number.isInteger(Math.sqrt(u)) ? f(Math.sqrt(u)) : `√${u}`);
  function realesBicuad(rng) {
    const u1 = noCero(rng, -9, 9), u2 = noCero(rng, -9, 9);
    if (u1 === u2 || u1 + u2 === 0 || [u1, u2].sort().join() === '-4,1') return null;
    const pos = [u1, u2].filter(u => u > 0).length, bien = 2 * pos;
    return {
      enunciado: [`La ecuación es ${ec4(u1 + u2, u1 * u2)}.`], pregunta: ['¿Cuántas raíces reales tiene?'],
      datos: [D.bicuad, D.vuelta], correcta: f(bien),
      errores: [
        et('TAL-BICUAD-TODAS', 4, t => `Bien los dos valores de u. Pero un u negativo no da reales: no son ${t} siempre.`),
        et('TAL-BICUAD-POSITIVA', pos, t => `Bien descartar los u negativos. Pero cada u positivo da dos raíces, no ${t} en total.`),
        et('TAL-BICUAD-NINGUNA', pos === 2 ? 2 : 0, t => `Bien revisar el signo de cada u. Pero se cuentan dos por cada u positivo: no ${t}.`),
        et('TAL-BICUAD-POSITIVA', 3, t => (pos ? `Bien que salen raíces opuestas. Pero van de a dos: ${t} no puede ser.` : `Bien buscar los valores de u. Pero los dos son negativos: no son ${t}.`)),
        et('TAL-BICUAD-POSITIVA', 1, t => (pos ? `Bien un u positivo. Pero da dos raíces opuestas, no ${t}.` : `Bien buscar los valores de u. Pero los dos son negativos: ninguno da reales, no ${t}.`)),
      ],
      solucion: [[`En u: u = ${u1} y u = ${u2}. ${[u1, u2].map(u => (u > 0 ? `u = ${u} da ±${raizTxt(u)}` : `u = ${u} no da reales`)).join('; ')}.`], [Tr(`${bien} reales`), '.']],
      _datos: { u1, u2 },
    };
  }
  const VETO5 = ['2,3', '1,2', '1,3', '2,4', '3,5', '2,5'];
  function mayor(rng) {
    const a = rng.entero(1, 6), b = rng.entero(2, 7);
    if (a >= b || VETO5.includes(`${a},${b}`)) return null;
    return {
      enunciado: [`La ecuación es ${ec4(a * a + b * b, a * a * b * b)}.`], pregunta: ['¿Cuál es su mayor raíz?'],
      datos: [D.bicuad, D.vuelta], correcta: b,
      errores: [
        en('TAL-BICUAD-U', b * b, t => `Bien u = ${t}. Pero u es x²: falta volver a x.`),
        en('TAL-PIDE', a, t => `Bien ${t} es raíz. Pero ${b} es mayor.`),
        en('TAL-SIGNO', -a, t => `Bien que hay raíces negativas. Pero ${t} es menor que ${b}.`),
        en('TAL-BICUAD-U', a * a, t => `Bien u = ${t}. Pero es x², y no es el mayor.`),
      ],
      solucion: [[`u = ${a * a} y u = ${b * b} dan ±${a} y ±${b}.`], ['La mayor es ', Tr(f(b)), '.']],
      _datos: { a, b },
    };
  }
  function enT(rng) {
    const B = noCero(rng, -7, 7), C = rng.entero(-6, 14);
    if (C === 2 || (B === -5 && C === 8) || (B === 1 && C === -4)) return null;
    const q = k => `${poli([1, B, k], 't')} = 0`;
    return {
      enunciado: [`En ${poli([1, B, C, B, 1])} = 0 se divide entre x² y se cambia x + 1/x por t.`], pregunta: ['¿Qué ecuación queda en t?'],
      datos: [D.reciproca, D.t2], correcta: q(C - 2),
      errores: [
        e('TAL-T2-SIN', q(C), t => `Bien el término en t. Pero x² + 1/x² es t² − 2; ${t} olvida el −2.`),
        e('TAL-T2-SUMA', q(C + 2), t => `Bien que el número cambia. Pero se resta 2; ${t} lo suma.`),
        e('TAL-SIGNO', `${poli([1, -B, C - 2], 't')} = 0`, t => `Bien el número. Pero ${B}(x + 1/x) conserva su signo; ${t} lo cambia.`),
      ],
      solucion: [[`Entre x²: (x² + 1/x²) + ${par(B)}(x + 1/x) + ${par(C)} = 0, con x² + 1/x² = t² − 2.`], [Tu(q(C - 2)), '.']],
      _datos: { B, C },
    };
  }
  function precio(rng) {
    const a = rng.entero(1, 7), b = rng.entero(2, 10);
    if (a >= b || VETO5.includes(`${a},${b}`)) return null;
    return {
      enunciado: [`Un precio de x soles cumple ${ec4(a * a + b * b, a * a * b * b)}.`], pregunta: ['¿Cuánto es la diferencia entre el mayor y el menor precio posibles?'],
      datos: [D.bicuad, D.vuelta, D.precio], correcta: `${b - a} soles`,
      errores: [
        et('TAL-MEDIDA', 2 * b, t => `Bien x = ${b}. Pero −${b} no es un precio: la diferencia no es ${t}.`, ' soles'),
        et('TAL-BICUAD-U', b * b - a * a, t => `Bien u = ${a * a} y u = ${b * b}. Pero el precio es x, no x²: no ${t}.`, ' soles'),
        et('TAL-SUMA', a + b, t => `Bien los precios ${a} y ${b}. Pero se pide la diferencia, no ${t}.`, ' soles'),
        et('TAL-MEDIDA', 2 * a, t => `Bien x = ${a}. Pero −${a} no es un precio: ${t} no.`, ' soles'),
      ],
      solucion: [[`u = ${a * a} y u = ${b * b}: precios ${a} y ${b} (los negativos no).`], [`${b} − ${a} = `, Tr(`${b - a} soles`), '.']],
      _datos: { a, b },
    };
  }

  // ======================= Idea 6: ecuaciones de dos términos =======================
  function binomia(rng) {
    const n = rng.entero(3, 8), k = rng.entero(2, 3), s = rng.elegir([1, -1]), c = s * k ** n;
    if (Math.abs(c) > 999 || (n === 3 && k === 2 && s > 0)) return null;   // x³ = 8 es la predicción
    return { n, k, s, c, re: n % 2 ? 1 : s > 0 ? 2 : 0 };
  }
  function realesBin(rng) {
    const q = binomia(rng); if (!q) return null;
    return {
      enunciado: [`La ecuación es x${sup(q.n)} = ${f(q.c)}.`], pregunta: ['¿Cuántas raíces reales tiene?'],
      datos: [D.tfa, D.par, `${q.k}${sup(q.n)} = ${f(Math.abs(q.c))}`], correcta: f(q.re),
      errores: [
        et('TAL-BIN-TODAS', q.n, t => `Bien que hay ${t} raíces. Pero no todas son reales.`),
        et(q.n % 2 ? 'TAL-BIN-UNA' : 'TAL-BIN-UNA', q.re === 2 ? 1 : 2, t => q.re === 2 ? `Bien ${q.k}. Pero n es par: −${q.k} también; no es ${t}.` : `Bien buscar ±${q.k}. Pero solo ${q.re === 1 ? 'una sirve' : 'ninguna sirve'}: no son ${t}.`),
        et('TAL-BIN-NEG', q.re === 0 ? 1 : 0, t => `Bien mirar el signo. Pero cuenta qué reales elevados a ${q.n} dan ${f(q.c)}: no son ${t}.`),
        et('TAL-BIN-TODAS', 3, t => `Bien que hay reales y no reales. Pero las reales son a lo más dos: no ${t}.`),
      ],
      solucion: [[q.n % 2 ? `n = ${q.n} es impar: solo ${f(q.s * q.k)} cumple.` : q.s > 0 ? `n = ${q.n} es par y el número es positivo: ${q.k} y −${q.k}.` : `n = ${q.n} es par y el número es negativo: ninguna.`], [Tr(`${q.re} ${q.re === 1 ? 'real' : 'reales'}`), '.']],
      _datos: q,
    };
  }
  function noRealesBin(rng) {
    const q = binomia(rng); if (!q) return null;
    const bien = q.n - q.re;
    return {
      enunciado: [`La ecuación es x${sup(q.n)} = ${f(q.c)}.`], pregunta: ['¿Cuántas raíces no reales tiene?'],
      datos: [D.tfa, D.par, `${q.k}${sup(q.n)} = ${f(Math.abs(q.c))}`], correcta: f(bien),
      errores: [
        et('TAL-GRADO', q.n, t => `Bien que hay ${t} raíces. Pero ${q.re ? 'no todas son no reales' : 'eso es el total'}.`),
        et(q.re === 2 ? 'TAL-BIN-UNA' : 'TAL-BIN-TODAS', q.n - (q.re === 2 ? 1 : 2), t => q.re === 2 ? `Bien ${q.k}. Pero −${q.k} también es real: no son ${t}.` : `Bien restar reales. Pero hay ${q.re}: no son ${t}.`),
        et('TAL-SOLO-REAL', 0, t => `Bien buscar raíces. Pero el grado es ${q.n}: no son ${t} las no reales.`),
        et('TAL-CONJUGADA', 1, t => `Bien que hay no reales. Pero van en pareja: nunca ${t}.`),
      ],
      solucion: [[`Son ${q.n} en total y ${q.re} ${q.re === 1 ? 'es real' : 'son reales'}.`], [`${q.n} − ${q.re} = `, Tr(f(bien)), '.']],
      _datos: q,
    };
  }
  function productoNR(rng) {
    const k = rng.entero(2, 7), s = rng.elegir([1, -1]);
    if (k === 2 && s > 0) return null;   // x³ = 8 es la predicción
    const c = s * k ** 3, tri = poli([1, s * k, k * k]);
    return {
      enunciado: [`La ecuación es x³ = ${f(c)}.`], pregunta: ['¿Cuánto vale el producto de sus dos raíces no reales?'],
      datos: [s > 0 ? D.difCubos : D.sumCubos, D.sp2], correcta: k * k,
      errores: [
        en('TAL-SIGNO-VIETE', -k * k, t => `Bien el trinomio ${tri}. Pero el producto es c/a, sin cambiar el signo: no ${t}.`),
        en('TAL-BIN-PRODUCTO', -s * k, t => `Bien el trinomio ${tri}. Pero ${t} es su suma.`),
        en('TAL-PIDE', c, t => `Bien con Cardano-Vieta. Pero ${t} es el producto de las tres.`),
        en('TAL-PIDE', s * k, t => `Bien ${t}, la raíz real. Pero se piden las no reales.`),
      ],
      solucion: [[`x³ ${s > 0 ? '−' : '+'} ${k ** 3} = (${binx(s * k)})(${tri}): las no reales son las del trinomio.`], ['Su producto es c/a = ', Tr(f(k * k)), '.']],
      _datos: { k, s },
    };
  }
  function productoTodas(rng) {
    const k = rng.entero(2, 6);
    if (k === 3) return null;
    return {
      enunciado: [`La ecuación es x⁴ = ${f(k ** 4)}.`], pregunta: ['¿Cuánto vale el producto de sus cuatro raíces, contando las no reales?'],
      datos: [D.difCuad, D.i, D.prod4], correcta: f(-(k ** 4)),
      errores: [
        et('TAL-SIGNO-VIETE', k ** 4, t => `Bien con Cardano-Vieta. Pero el término independiente es −${f(k ** 4)}: no ${t}.`),
        et('TAL-SOLO-REAL', -k * k, t => `Bien ${k} · (−${k}) = ${t}. Pero faltan ${k}i y −${k}i.`),
        et('TAL-PIDE', k * k, t => `Bien ${k}i · (−${k}i) = ${t}. Pero faltan ${k} y −${k}.`),
        et('TAL-PIDE', 0, t => `Bien que las raíces se cancelan al sumar. Pero se pide el producto, no la suma, ${t}.`),
      ],
      solucion: [[`x⁴ − ${f(k ** 4)} = (x² − ${k * k})(x² + ${k * k}): raíces ±${k} y ±${k}i.`], [`(−${k * k}) · ${k * k} = `, Tr(f(-(k ** 4))), '.']],
      _datos: { k },
    };
  }

  const CONSTRUIR = {
    total, distintas, 'no-reales': noReales, triple,
    suma, producto, inversos, 'coef-k': coefK,
    'no-puede': noPuede, cuantos, otras, caja,
    companera, factor2, 'menor-grado': menorGrado, 'raiz-real': raizReal,
    'reales-bicuad': realesBicuad, mayor, 'en-t': enT, precio,
    'reales-bin': realesBin, 'no-reales-bin': noRealesBin, 'producto-nr': productoNR, 'producto-todas': productoTodas,
  };

  return { id: ID, titulo: 'Ecuaciones polinomiales', generar, TIPOS_POR_IDEA, NIVEL, TIPOS: Object.keys(CONSTRUIR) };
});
