/*
 * Generador «Polinomios»: la práctica de las seis ideas de algebra.polinomios (contenido/teoria/algebra/polinomios.js).
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador (window.Generadores['polinomios-practica']) y
 * en Node (require). No usa ningún motor ni el código de la teoría: las cuentas son sumas y productos de enteros chicos.
 *
 * Propuesta: docs/etapa5/propuesta-algebra.md §7 (una plantilla «predicciones» por unidad, con los tipos por idea). El
 * objeto, como en la teoría: el pedido de losetas del maestro Rubén en Juliaca (losetas de 2 a 6 dm de lado, tiras de 1 dm
 * de ancho y cuadraditos de 1 dm; valores de problema, sin fuente) y su piso rectangular.
 *
 * Tipos por idea (TIPOS_POR_IDEA; nivel 1 un paso, 2 dos pasos, 3 de examen). generar(semilla, { idea }) da solo los de
 * esa idea; sin idea, las seis con el mismo peso.
 *   terminos-semejantes  reducir (1) · sumar (1) · restar (2) · dos-letras (2) · exponentes (3; los exponentes que hacen
 *                        semejantes a dos términos) · perimetro (3; el perímetro de un terreno de lados con letras)
 *   valor-numerico       losetas (1; el pedido con un lado dado) · evaluar (1; con un negativo) · uno-cero (2; P(1) y
 *                        P(0), San Marcos 2023-I) · factorizada (2; dos valores, San Marcos 2026-II) · coeficiente (3;
 *                        un coeficiente que sale de un valor dado y piden otro, San Marcos 2024-II) · desplazado (3;
 *                        P(x + h) dado, San Marcos 2025-II)
 *   grados               ga (1) · gr (1) · es-polinomio (2; cuántos n dan exponentes enteros no negativos) · parametro
 *                        (3; el GA dado con exponentes en función de n, San Marcos 2026-I) · relativos (3; GR(x) y GR(y)
 *                        dados, piden el GA)
 *   completo-ordenado    total (1) · ceros (2) · homogeneo (2) · parametros (3; completo y ordenado con exponentes por
 *                        hallar)
 *   igualdad             mn (1) · nulo (2) · tres (2; letras repartidas a los dos lados) · sistema (3; a(x + p) +
 *                        b(x − q) idéntico a un binomio)
 *   operaciones          grado (1; grado de Pᵏ · Q) · coef (2; un coeficiente de un producto) · suma-coef (2; la suma de
 *                        los coeficientes de un producto con potencia) · indep (2; el término independiente de tres
 *                        factores) · producto-igual (3; un producto idéntico a un trinomio)
 *
 * Notación: superíndices Unicode (x², y³), un exponente con letras como «x^(n + 2)», el signo menos tipográfico «−».
 * Colores: un color fijo por magnitud, el de la teoría (cabecera de polinomios.js): el primer polinomio o factor naranja
 * (P, o), el segundo turquesa (Q, i), el número que entra en lugar de x naranja (X, o), el exponente de x naranja (EX, o)
 * y el de y turquesa (EY, i) (nunca en un mismo problema con P y Q), y el resultado violeta (R, f), solo en la solución.
 * Lo demás va en tinta. Ni carmín ni verde.
 * Datos (contrato, punto 13): las definiciones y propiedades que se usan (semejantes, P(k), grado, completo, idénticos,
 * xᵐ · xⁿ = xᵐ⁺ⁿ, P(1) y P(0)); nunca el paso hecho ni la respuesta.
 * Errores: los códigos de la teoría (PO de plantillas/polinomios/, hipótesis del proyecto; AL16, de
 * docs/investigacion/algebra-funciones-ideas-erroneas.md; los TAL-*, hipótesis de diseño de la teoría). De todos los
 * errores de un problema van 3 o 4, elegidos para que la correcta no sea la central ni, si es un número, un extremo. Cada
 * explicación empieza por lo que el alumno hizo bien y muestra lo que da su error; ninguna nombra una letra.
 * La práctica no repite ninguna Predice de la unidad: ni 2xy + 3yx, ni 2x² + 3x + 4 con losetas de 1 dm, ni
 * 3x²y − 2xy³ + 1, ni x⁵ − 3x² + 1, ni x² + 1 contra 2x, ni grado 2 por grado 3.
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
  const ID = 'polinomios-practica';
  const INV = 'docs/investigacion/algebra-funciones-ideas-erroneas.md';
  const TEO = 'contenido/teoria/algebra/polinomios.js';
  const ESC = 'plantillas/polinomios/plantilla.json';
  const v = P.v;
  const f = x => P.formatear(x, 0);

  // ---- Escritura ----
  const SUPS = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const sup = s => [...String(s)].map(c => SUPS[c]).join('');
  const z = x => (x < 0 ? `−${-x}` : String(x));
  const par = x => (x < 0 ? `(−${-x})` : String(x));
  const lit = (e, L = 'x') => (e === 0 ? '' : e === 1 ? L : `${L}${sup(e)}`);
  // Un término c·xᵃ·yᵇ; primero: sin «+» delante.
  function term(c, a, b, primero) {
    const l = lit(a) + lit(b, 'y'), m = Math.abs(c), cuerpo = l ? `${m === 1 ? '' : m}${l}` : String(m);
    return primero ? `${c < 0 ? '−' : ''}${cuerpo}` : ` ${c < 0 ? '−' : '+'} ${cuerpo}`;
  }
  // Polinomio en x con coeficientes de mayor a menor grado: [2, 0, −5, 1] → «2x³ − 5x + 1».
  function poli(cs) {
    const g = cs.length - 1, out = [];
    cs.forEach((c, i) => { if (c) out.push(term(c, g - i, 0, out.length === 0)); });
    return out.join('') || '0';
  }
  // Varios términos [c, a, b] en el orden dado.
  const polXY = ts => ts.map(([c, a, b], i) => term(c, a, b, i === 0)).join('');
  const evaluar = (cs, x) => cs.reduce((a, c) => a * x + c, 0);
  const mult = (A, B) => { const o = Array(A.length + B.length - 1).fill(0); A.forEach((a, i) => B.forEach((b, j) => { o[i + j] += a * b; })); return o; };
  const suma = (A, B, k = 1) => A.map((a, i) => a + k * B[i]);

  const VARS = {
    P: { nombre: 'el primer polinomio', color: 'o' }, Q: { nombre: 'el segundo polinomio', color: 'i' },
    X: { nombre: 'el valor de x', color: 'o' }, EX: { nombre: 'el exponente de x', color: 'o' }, EY: { nombre: 'el exponente de y', color: 'i' },
    R: { nombre: 'el resultado', color: 'f' },
  };
  const Tp = t => v('P', t), Tq = t => v('Q', t), Tx = t => v('X', t), Tr = t => v('R', t);

  // ---- Errores: el respaldo sale del código ----
  const RESPALDO = { AL16: ['parcial', INV] };
  const de = id => RESPALDO[id] || (/^PO\d/.test(id) ? ['hipotesis', ESC] : ['hipotesis', TEO]);
  function e(id, texto, explicar) { const [respaldo, fuente] = de(id); return { id, clave: texto, texto, explicacion: explicar(texto), respaldo, fuente }; }
  function en(id, valor, explicar) { const [respaldo, fuente] = de(id); return { id, valor, texto: f(valor), explicacion: explicar(f(valor)), respaldo, fuente }; }

  // ---- Datos que se repiten (herramientas, no el paso hecho) ----
  const D = {
    sem: 'Términos semejantes: las mismas letras con los mismos exponentes',
    suma: 'axⁿ + bxⁿ = (a + b)xⁿ',
    resta: 'Al restar un polinomio, cambia el signo de cada uno de sus términos',
    perim: 'Perímetro de un rectángulo = 2 · largo + 2 · ancho',
    eval: 'P(k): el valor de P cuando x vale k; cada x se cambia por k',
    neg: 'Con un número negativo: (−2)² = 4 y (−2)³ = −8',
    cubre: 'Una loseta de x dm de lado cubre x² dm²; una tira, x dm²; un cuadradito, 1 dm²',
    p1p0: 'Suma de coeficientes de P: P(1).  Término independiente de P: P(0)',
    desplaza: 'Si se da P(x + h), P(k) sale con el x que cumple x + h = k',
    term: 'Grado de un término: la suma de los exponentes de sus letras',
    ga: 'Grado absoluto (GA): el mayor de los grados de los términos',
    gr: 'Grado relativo a una letra, GR(x) o GR(y): el mayor exponente de esa letra',
    expo: 'En un polinomio, cada exponente de una letra es un entero mayor o igual que 0',
    completo: 'Completo: aparece cada potencia de x, desde la del grado hasta x⁰',
    ordenado: 'Ordenado: los exponentes de x solo bajan o solo suben',
    homog: 'Homogéneo: todos sus términos tienen el mismo grado',
    cero: 'Una potencia que falta se escribe con coeficiente 0',
    ident: 'Idénticos (≡): el mismo coeficiente en cada potencia de x',
    nulo: 'Idénticamente nulo (≡ 0): todos sus coeficientes valen 0',
    dist: 'k(x + p) = kx + kp, con k y p números',
    prod: 'Cada término del primer polinomio multiplica a cada término del segundo',
    pot: 'xᵐ · xⁿ = xᵐ⁺ⁿ',
    gpot: '(xᵐ)ᵏ = xᵐ·ᵏ',
    grado1: 'Grado de un polinomio de una letra: su mayor exponente de x',
  };

  // ---- Tipos por idea ----
  const TIPOS_POR_IDEA = {
    'terminos-semejantes': ['reducir', 'sumar', 'restar', 'dos-letras', 'exponentes', 'perimetro'],
    'valor-numerico': ['losetas', 'evaluar', 'uno-cero', 'factorizada', 'coeficiente', 'desplazado'],
    grados: ['ga', 'gr', 'es-polinomio', 'parametro', 'relativos'],
    'completo-ordenado': ['total', 'ceros', 'homogeneo', 'parametros'],
    igualdad: ['mn', 'nulo', 'tres', 'sistema'],
    operaciones: ['grado', 'coef', 'suma-coef', 'indep', 'producto-igual'],
  };
  const IDEAS = Object.keys(TIPOS_POR_IDEA);
  const IDEA_DE = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map(t => [t, i])));
  const NIVEL = {
    reducir: 1, sumar: 1, restar: 2, 'dos-letras': 2, exponentes: 3, perimetro: 3,
    losetas: 1, evaluar: 1, 'uno-cero': 2, factorizada: 2, coeficiente: 3, desplazado: 3,
    ga: 1, gr: 1, 'es-polinomio': 2, parametro: 3, relativos: 3,
    total: 1, ceros: 2, homogeneo: 2, parametros: 3,
    mn: 1, nulo: 2, tres: 2, sistema: 3,
    grado: 1, coef: 2, 'suma-coef': 2, indep: 2, 'producto-igual': 3,
  };
  // Papel (regla 6; herramientas/papel-generador.js usa «papel-1» a «papel-8» y rotula 3 básicos, 3 intermedios y 2
  // avanzados): las seis ideas, de menos a más, con dos preguntas de San Marcos al final.
  const PAPEL = { 'papel-1': 'reducir', 'papel-2': 'losetas', 'papel-3': 'ga', 'papel-4': 'ceros', 'papel-5': 'nulo',
    'papel-6': 'coef', 'papel-7': 'desplazado', 'papel-8': 'parametro' };

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
      id: `${ID}#${semilla}`, variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: o.datos,
      alternativas, solucion: o.solucion, respuesta,
      _datos: Object.assign({ idea: IDEA_DE[tipo], tipo, nivel: NIVEL[tipo] }, o._datos),
    };
  }
  const noCero = (rng, a, b) => { let x = 0; while (x === 0) x = rng.entero(a, b); return x; };

  // ======================= Idea 1: términos semejantes =======================
  function reducir(rng) {
    let a1, b1, a2, b2;
    do { a1 = rng.entero(2, 7); b1 = rng.entero(2, 8); a2 = noCero(rng, -5, 4); b2 = noCero(rng, -6, 5); } while ((a2 > 0 && b2 > 0) || a1 + a2 === 0 || b1 + b2 === 0 || a1 + a2 + b1 + b2 === 0);
    const A = a1 + a2, B = b1 + b2, txt = term(a1, 2, 0, true) + term(b1, 1, 0) + term(a2, 2, 0) + term(b2, 1, 0);
    return {
      enunciado: [`Se tiene el polinomio ${txt}.`], pregunta: ['¿A qué es igual, reducido?'], datos: [D.sem, D.suma],
      correcta: poli([A, B, 0]),
      errores: [
        e('TAL-NO-SEMEJ', term(A + B, 3, 0, true), t => `Bien sumados los números. Pero x² y x no son semejantes: no se juntan; juntarlos da ${t}.`),
        e('TAL-SIGNO', poli([a1 + Math.abs(a2), b1 + Math.abs(b2), 0]), t => `Bien agrupados los semejantes. Pero un término con − resta su coeficiente; sumarlo da ${t}.`),
        e('TAL-SUMA-POT', term(A, 4, 0, true) + term(B, 2, 0), t => `Bien los coeficientes. Pero al juntar semejantes la parte literal no cambia: así queda ${t}.`),
        e('TAL-UN-GRUPO', poli([A, b1, 0]) === poli([A, B, 0]) ? null : poli([A, b1, 0]), t => `Bien los términos con x². Pero los de x también se juntan: si no, queda ${t}.`),
      ],
      solucion: [['Los de x² con los de x², y los de x con los de x.'], [`(${a1} ${a2 < 0 ? '−' : '+'} ${Math.abs(a2)})x² + (${b1} ${b2 < 0 ? '−' : '+'} ${Math.abs(b2)})x = `, Tr(poli([A, B, 0])), '.']],
      _datos: { cs: [a1, b1, a2, b2] },
    };
  }
  function sumar(rng) {
    let Pc, Qc, T;
    do { Pc = [rng.entero(1, 6), noCero(rng, -6, 6), rng.entero(1, 9)]; Qc = [noCero(rng, -4, 4), noCero(rng, -6, 6), noCero(rng, -9, 9)]; T = suma(Pc, Qc); } while (Qc.every(q => q > 0) || T.some(t => t === 0));
    if (poli(Pc) === '2x² + 3x + 1') return null;   // el pedido del juego
    return {
      enunciado: ['Se suman ', Tp(poli(Pc)), ' y ', Tq(poli(Qc)), '.'], pregunta: ['¿A qué es igual la suma?'], datos: [D.sem, D.suma],
      correcta: poli(T),
      errores: [
        e('TAL-SIGNO', poli(suma(Pc, Qc, -1)), t => `Bien juntos los semejantes. Pero es una suma: los signos del segundo no cambian; cambiarlos da ${t}.`),
        e('PO21', poli(suma(Pc, Qc.map(Math.abs))), t => `Bien juntos los semejantes. Pero cada coeficiente va con su signo: sin signos queda ${t}.`),
        e('TAL-SUMA-POT', term(T[0], 4, 0, true) + term(T[1], 2, 0) + term(T[2], 0, 0), t => `Bien los coeficientes. Pero al sumar, los exponentes no cambian: sumarlos da ${t}.`),
        e('TAL-UN-GRUPO', poli([T[0], Pc[1], T[2]]), t => `Bien las losetas y los números. Pero faltó sumar los términos con x: así queda ${t}.`),
      ],
      solucion: [['Se suman los coeficientes de cada clase de término, cada uno con su signo.'], ['(', Tp(poli(Pc)), ') + (', Tq(poli(Qc)), ') = ', Tr(poli(T)), '.']],
      _datos: { P: Pc, Q: Qc },
    };
  }
  function restar(rng) {
    let Pc, Qc, Dd;
    do { Pc = [rng.entero(3, 8), noCero(rng, -6, 6), noCero(rng, -9, 9)]; Qc = [rng.entero(1, 5), noCero(rng, -5, 5), noCero(rng, -8, 8)]; Dd = suma(Pc, Qc, -1); } while ((Qc[1] > 0 && Qc[2] > 0) || Dd.some(t => t === 0));
    return {
      enunciado: ['Al polinomio ', Tp(poli(Pc)), ' se le resta ', Tq(poli(Qc)), '.'], pregunta: ['¿Qué polinomio queda?'], datos: [D.suma, D.resta],
      correcta: poli(Dd),
      errores: [
        e('TAL-RESTA-PRIMERO', poli([Pc[0] - Qc[0], Pc[1] + Qc[1], Pc[2] + Qc[2]]), t => `Bien restado el primer término. Pero el − alcanza a todo el paréntesis; si no, queda ${t}.`),
        e('TAL-SIGNO', poli(suma(Pc, Qc)), t => `Bien juntos los semejantes. Pero es una resta: cada término del segundo cambia de signo; sumar da ${t}.`),
        e('TAL-RESTA-ORDEN', poli(suma(Qc, Pc, -1)), t => `Bien cambiados los signos. Pero al primero se le quita el segundo, no al revés; al revés da ${t}.`),
      ],
      solucion: [['Cada término del segundo cambia de signo; después se juntan los semejantes.'], [Tp(poli(Pc)), ' ', Tq(poli(Qc.map(c => -c)).replace(/^(?!−)/, '+ ').replace(/^−/, '− ')), ' = ', Tr(poli(Dd)), '.']],
      _datos: { P: Pc, Q: Qc },
    };
  }
  function dosLetras(rng) {
    let a, b, c, d;
    do { a = rng.entero(2, 6); b = noCero(rng, -5, 5); c = noCero(rng, -4, 6); d = noCero(rng, -5, 5); } while (a + c === 0 || b + d === 0 || a + b + c + d === 0 || b + c + d === 0);
    const A = a + c, B = b + d;
    // x²y, xy², yx² (que es x²y) y xy²: la parte literal se lee sin importar el orden de las letras.
    const yx2 = (k, primero) => { const m = Math.abs(k); return `${primero ? (k < 0 ? '−' : '') : ` ${k < 0 ? '−' : '+'} `}${m === 1 ? '' : m}yx²`; };
    const txt = term(a, 2, 1, true) + term(b, 1, 2) + yx2(c) + term(d, 1, 2);
    const bien = term(A, 2, 1, true) + term(B, 1, 2);
    return {
      enunciado: [`Se tiene el polinomio ${txt}.`], pregunta: ['¿A qué es igual, reducido?'], datos: [D.sem, D.suma],
      correcta: bien,
      errores: [
        e('TAL-EXP-CRUZ', term(a + b + c + d, 2, 1, true), t => `Bien sumados los coeficientes. Pero x²y no es semejante a xy²: cada letra lleva otro exponente; juntarlos da ${t}.`),
        e('TAL-ORDEN', term(a, 2, 1, true) + term(b + c + d, 1, 2), t => `Bien que juntes tres términos. Pero yx² es x²y, no xy²: en los dos la x lleva el 2; así queda ${t}.`),
        e('TAL-SUMA-POT', term(A, 4, 2, true) + term(B, 2, 4), t => `Bien los coeficientes. Pero al juntar semejantes la parte literal no cambia: así queda ${t}.`),
      ],
      solucion: [['yx² es x²y: el orden de las letras no cambia la parte literal.'], [`(${a} ${c < 0 ? '−' : '+'} ${Math.abs(c)})x²y + (${z(b)} ${d < 0 ? '−' : '+'} ${Math.abs(d)})xy² = `, Tr(bien), '.']],
      _datos: { a, b, c, d },
    };
  }
  function exponentes(rng) {
    let p, s, m, n;
    do { p = rng.entero(1, 4); s = rng.entero(1, 4); m = rng.entero(1, 5); n = rng.entero(2, 8); } while (p === s || n - s < 2);
    const ex = m + p, ey = n - s, k1 = rng.entero(2, 9), k2 = rng.entero(2, 9);
    return {
      enunciado: [`El término ${k1}x^(m + ${p})y${sup(ey)} es semejante a −${k2}x${sup(ex)}y^(n − ${s}).`], pregunta: ['¿Cuánto vale m + n?'], datos: [D.sem],
      correcta: m + n,
      errores: [
        en('AL16', ex + p + ey - s, t => `Bien igualados los exponentes. Pero al despejar, el ${p} pasa restando y el ${s}, sumando; al revés da ${t}.`),
        en('TAL-EXP-DIRECTO', ex + ey, t => `Bien leídos los exponentes, ${ex} y ${ey}. Pero falta despejar m y n; sin despejar, ${t}.`),
        en('TAL-PIDE', m * n, t => `Bien hallados m = ${m} y n = ${n}. Pero piden la suma; el producto es ${t}.`),
        en('TAL-COEF-SEMEJ', k1 + k2, t => `Esos son los coeficientes. Semejantes pide iguales los exponentes, no los coeficientes; sumarlos da ${t}.`),
      ],
      solucion: [['Cada letra lleva el mismo exponente en los dos términos.'], [`m + ${p} = ${ex}, m = ${m};  n − ${s} = ${ey}, n = ${n};  m + n = `, Tr(f(m + n)), '.']],
      _datos: { p, s, ex, ey },
    };
  }
  function perimetro(rng) {
    let a, b, c, d;
    do { a = rng.entero(2, 5); b = rng.entero(1, 9); c = rng.entero(1, 4); d = rng.entero(1, 9); } while (a === c && b === d);
    const bien = poli([2 * (a + c), 2 * (b + d)]);
    return {
      enunciado: [`Un terreno rectangular de Juliaca mide (${a}x + ${b}) m de largo y (${c === 1 ? '' : c}x + ${d}) m de ancho.`], pregunta: ['¿Qué polinomio da su perímetro, en metros?'],
      datos: [D.perim, D.suma], unidad: 'm',
      correcta: `${bien} m`,
      errores: [
        e('TAL-PERIM-MITAD', `${poli([a + c, b + d])} m`, t => `Bien sumados el largo y el ancho. Pero el borde tiene dos largos y dos anchos; uno de cada uno da ${t}.`),
        e('TAL-DOBLE-UNO', `${poli([2 * (a + c), b + d])} m`, t => `Bien las x duplicadas. Pero el 2 multiplica también a los números; si no, queda ${t}.`),
        e('TAL-NO-SEMEJ', `${2 * (a + c) + 2 * (b + d)}x m`, t => `Bien los dos términos. Pero ${2 * (a + c)}x y ${2 * (b + d)} no son semejantes; juntarlos da ${t}.`),
        e('TAL-AREA', `${poli([a * c, a * d + b * c, b * d])} m`, t => `Bien la idea de usar los dos lados. Pero largo por ancho es el área: ${t}.`),
      ],
      solucion: [['El perímetro es el borde: dos largos y dos anchos.'], [`2(${a}x + ${b}) + 2(${c === 1 ? '' : c}x + ${d}) = ${2 * a}x + ${2 * b} + ${2 * c}x + ${2 * d} = `, Tr(`${bien} m`), '.']],
      _datos: { a, b, c, d },
    };
  }

  // ======================= Idea 2: valor numérico =======================
  function losetas(rng) {
    const k = rng.entero(2, 6), cs = [rng.entero(1, 3), rng.entero(1, 5), rng.entero(1, 6)];
    if (cs.join() === '2,3,4') return null;   // el pedido de la predicción
    const bien = evaluar(cs, k);
    return {
      enunciado: [`Un pedido de Rubén cubre ${poli(cs)} dm², con x el lado de la loseta en dm. Rubén compra losetas de `, Tx(k), ' dm de lado.'],
      pregunta: ['¿Cuántos dm² cubre el pedido?'], datos: [D.eval, D.cubre], unidad: 'dm²',
      correcta: bien,
      errores: [
        en('TAL-SIN-CUADRADO', cs[0] * k + cs[1] * k + cs[2], t => `Bien el reemplazo en las tiras. Pero la loseta cubre ${k}², no ${k}: sin elevar salen ${t} dm².`),
        en('TAL-INDEP-FUERA', cs[0] * k * k + cs[1] * k, t => `Bien las losetas y las tiras. Pero los ${cs[2]} cuadraditos también cubren; sin ellos salen ${t} dm².`),
        en('TAL-CAMBIA-TODO', cs[0] * k * k + cs[1] * k + cs[2] * k, t => `Bien las losetas y las tiras. Pero el cuadradito cubre 1 dm² con cualquier lado; multiplicarlo da ${t} dm².`),
        en('PO7', cs[0] + cs[1] + cs[2], t => `Bien contadas las piezas: ${t}. Pero cada loseta y cada tira cubre más de 1 dm².`),
      ],
      solucion: [[`Cada x se cambia por ${k}.`], [`${cs[0]} · ${k}² + ${cs[1]} · ${k} + ${cs[2]} = ${cs[0] * k * k} + ${cs[1] * k} + ${cs[2]} = `, Tr(`${f(bien)} dm²`), '.']],
      _datos: { cs, k },
    };
  }
  function evaluarTipo(rng) {
    const cs = [noCero(rng, -3, 3), rng.entero(-4, 4), rng.entero(-4, 4), rng.entero(-6, 6)], k = rng.elegir([-3, -2, -1, 2, 3]);
    const bien = evaluar(cs, k);
    const parMal = cs.reduce((a, c, i) => { const ex = 3 - i; return a + c * (ex % 2 === 0 && ex > 0 && k < 0 ? -(k ** ex) : k ** ex); }, 0);
    return {
      enunciado: [`Se tiene P(x) = ${poli(cs)}.`], pregunta: ['¿Cuánto vale P(', Tx(z(k)), ')?'], datos: [D.eval, D.neg],
      correcta: bien,
      errores: [
        k < 0 && en('PO15', parMal, t => `Bien el reemplazo. Pero una potencia par de un negativo es positiva: (${z(k)})² = ${k * k}; si no, sale ${t}.`),
        en('TAL-SIGNO-X', evaluar(cs, -k), t => `Bien las cuentas. Pero el número entra con su signo; con ${z(-k)} sale ${t}.`),
        en('PO7', evaluar(cs, 1), t => `Bien sumados los coeficientes. Pero eso es P(1) = ${t}; aquí x vale ${z(k)}.`),
        en('PO12', cs[3], t => `Bien el término sin x, ${t}. Pero ese es P(0): los términos con x también cuentan.`),
        en('TAL-PRINCIPAL', cs[0] * k ** 3, t => `Bien el primer término, ${t}. Pero cada término aporta su valor.`),
      ],
      solucion: [[`Cada x se cambia por ${z(k)}, entre paréntesis.`], [`P(${z(k)}) = `, Tr(f(bien)), '.']],
      _datos: { cs, k },
    };
  }
  function unoCero(rng) {
    const cs = [noCero(rng, -4, 5), noCero(rng, -5, 5), rng.entero(-5, 5), noCero(rng, -7, 7)], mas = rng.entero(0, 1) === 1;
    const p1 = evaluar(cs, 1), p0 = cs[3], bien = mas ? p1 + p0 : p1 - p0, abs = cs.reduce((a, c) => a + Math.abs(c), 0);
    return {
      enunciado: [`Se tiene P(x) = ${poli(cs)}.`], pregunta: [`¿Cuánto vale P(1) ${mas ? '+' : '−'} P(0)?`], datos: [D.eval, D.p1p0],
      correcta: bien,
      errores: [
        en('TAL-SOLO-UNO', p1, t => `Bien P(1) = ${t}. Pero falta ${mas ? 'sumarle' : 'restarle'} P(0) = ${z(p0)}.`),
        en('PO12', mas ? 2 * p0 : 0, t => `Bien P(0) = ${z(p0)}. Pero P(1) no es el término independiente; usarlo así da ${t}.`),
        en('PO21', mas ? abs + p0 : abs - p0, t => `Bien P(0). Pero en P(1) cada coeficiente va con su signo; sin signos sale ${t}.`),
        en('TAL-SIGNO', mas ? p1 - p0 : p1 + p0, t => `Bien P(1) y P(0). Pero ${mas ? 'se suman' : 'se restan'}; al revés da ${t}.`),
      ],
      solucion: [['Con x = 1 cada potencia vale 1; con x = 0 solo queda el término sin x.'], [`P(1) = ${z(p1)}, P(0) = ${z(p0)}; ${par(p1)} ${mas ? '+' : '−'} ${par(p0)} = `, Tr(f(bien)), '.']],
      _datos: { cs, mas },
    };
  }
  function factorizada(rng) {
    let p, q, s, u, w;
    do { p = rng.entero(1, 4); q = rng.entero(1, 4); s = rng.entero(1, 4); u = rng.entero(-3, 4); w = rng.entero(-3, 4); } while (u === w || u === 0 || w === 0 || new Set([p, -q, s]).size < 3);
    const F = x => (x - p) * (x + q) * (x - s), G = x => (x + p) * (x - q) * (x + s), bien = F(u) + F(w);
    return {
      enunciado: [`Se tiene P(x) = (x − ${p})(x + ${q})(x − ${s}).`], pregunta: ['¿Cuánto vale P(', Tx(z(u)), ') + P(', Tx(z(w)), ')?'], datos: [D.eval, D.neg],
      correcta: bien,
      errores: [
        en('TAL-FACTOR-SIGNO', G(u) + G(w), t => `Bien la idea de reemplazar en cada factor. Pero en x − ${p} el número se resta; con los signos cambiados sale ${t}.`),
        en('TAL-SOLO-UNO', F(u), t => `Bien P(${z(u)}) = ${t}. Pero falta sumarle P(${z(w)}).`),
        en('PO21', Math.abs(F(u)) + Math.abs(F(w)), t => `Bien cada producto. Pero cada valor va con su signo; sin signos sale ${t}.`),
        en('TAL-SOLO-OTRO', F(w), t => `Bien P(${z(w)}) = ${t}. Pero falta sumarle P(${z(u)}).`),
      ],
      solucion: [['Se reemplaza x en cada factor y se multiplica, con los signos.'], [`P(${z(u)}) = ${z(F(u))}, P(${z(w)}) = ${z(F(w))}; suma: `, Tr(f(bien)), '.']],
      _datos: { p, q, s, u, w },
    };
  }
  function coeficiente(rng) {
    let a, k, b, c, t, u;
    do { a = rng.entero(1, 3); k = noCero(rng, -4, 4); b = noCero(rng, -4, 4); c = noCero(rng, -6, 6); t = rng.elegir([1, 2, -1]); u = rng.elegir([-2, -1, 2, 3]); } while (t === u);
    const cs = [a, k, b, c], V = evaluar(cs, t), bien = evaluar(cs, u);
    return {
      enunciado: [`P(x) = ${term(a, 3, 0, true)} + kx²${term(b, 1, 0)}${term(c, 0, 0)} cumple P(`, Tx(z(t)), `) = ${z(V)}.`], pregunta: ['¿Cuánto vale P(', Tx(z(u)), ')?'], datos: [D.eval, D.neg],
      correcta: bien,
      errores: [
        en('TAL-PIDE', k, t2 => `Bien hallado k = ${t2}. Pero piden P(${z(u)}): falta evaluar con ese k.`),
        en('AL16', evaluar([a, -k, b, c], u), t2 => `Bien la ecuación de k. Pero al despejar, el número pasa con el signo cambiado; con k = ${z(-k)} sale ${t2}.`),
        en('TAL-DATO-REPITE', V, t2 => `${t2} es P(${z(t)}), el dato. Con x = ${z(u)} el valor cambia.`),
        en('TAL-SIN-K', evaluar([a, 0, b, c], u), t2 => `Bien el reemplazo. Pero falta el término con k: sin él sale ${t2}.`),
      ],
      solucion: [[`Con x = ${z(t)} sale una ecuación: k = ${z(k)}.`], [`P(${z(u)}) = `, Tr(f(bien)), '.']],
      _datos: { cs, t, u },
    };
  }
  function desplazado(rng) {
    const h = noCero(rng, -3, 3), A = rng.entero(1, 3), B = noCero(rng, -6, 6), C = noCero(rng, -8, 8), pide = rng.elegir(['p1', 'p0', 'suma']);
    const Qf = x => A * x * x + B * x + C, Pf = k => Qf(k - h);
    const bien = pide === 'p1' ? Pf(1) : pide === 'p0' ? Pf(0) : Pf(0) + Pf(1);
    const txtH = h > 0 ? `x + ${h}` : `x − ${-h}`;
    const que = pide === 'p1' ? 'la suma de los coeficientes de P' : pide === 'p0' ? 'el término independiente de P' : 'la suma de los coeficientes de P más su término independiente';
    return {
      enunciado: [`Se sabe que P(${txtH}) = ${poli([A, B, C])}.`], pregunta: [`¿Cuánto vale ${que}?`], datos: [D.desplaza, D.p1p0],
      correcta: bien,
      errores: [
        en('TAL-DESPLAZA', pide === 'p1' ? Qf(1) : pide === 'p0' ? Qf(0) : Qf(0) + Qf(1), t => `Bien x = 1 o x = 0. Pero lo dado es P(${txtH}): sin despejar x sale ${t}.`),
        en('TAL-DESPLAZA-SIGNO', pide === 'p1' ? Qf(1 + h) : pide === 'p0' ? Qf(h) : Qf(h) + Qf(1 + h), t => (pide === 'p0' ? `Bien la idea de cambiar x. Pero ${txtH} = 0 da x = ${z(-h)}; al revés sale ${t}.` : `Bien la idea de cambiar x. Pero ${txtH} = 1 da x = ${z(1 - h)}; al revés sale ${t}.`)),
        pide === 'suma' ? en('TAL-SOLO-UNO', Pf(1), t => `Bien P(1) = ${t}. Pero falta sumarle P(0).`)
          : en('PO12', pide === 'p1' ? Pf(0) : Pf(1), t => `Bien despejado x. Pero ${t} es el otro: la suma de coeficientes es P(1) y el término independiente, P(0).`),
        en('TAL-COEF-VISTOS', pide === 'p0' ? C : A + B + C + (pide === 'suma' ? C : 0), t => `Bien los coeficientes que se ven. Pero son los de P(${txtH}), no los de P; con ellos sale ${t}.`),
      ],
      solucion: [[`${pide === 'p0' ? 'P(0)' : 'P(1)'} sale con el x que cumple ${txtH} = ${pide === 'p0' ? 0 : 1}.`],
        [pide === 'p0' ? `x = ${z(-h)}: P(0) = ` : pide === 'p1' ? `x = ${z(1 - h)}: P(1) = ` : `P(1) = ${z(Pf(1))}, P(0) = ${z(Pf(0))}; suma: `, Tr(f(bien)), '.']],
      _datos: { h, A, B, C, pide },
    };
  }

  // ======================= Idea 3: grados =======================
  function tresTerminos(rng) {
    let ts;
    do { ts = [0, 1, 2].map(() => [noCero(rng, -6, 7), rng.entero(0, 5), rng.entero(0, 5)]); } while (new Set(ts.map(t => t[1] + ',' + t[2])).size < 3 || ts.some(t => t[1] + t[2] === 0) || new Set(ts.map(t => t[1] + t[2])).size < 2);
    return ts;
  }
  function ga(rng) {
    const ts = tresTerminos(rng), gr = ts.map(t => t[1] + t[2]), GA = Math.max(...gr), GRx = Math.max(...ts.map(t => t[1])), GRy = Math.max(...ts.map(t => t[2]));
    if (polXY(ts) === '3x²y − 2xy³ + 1') return null;
    return {
      enunciado: [`Se tiene P(x, y) = ${polXY(ts)}.`], pregunta: ['¿Cuál es su grado absoluto?'], datos: [D.term, D.ga],
      correcta: GA,
      errores: [
        en('PO11', gr.reduce((a, b) => a + b, 0), t => `Bien los grados: ${gr.join(', ')}. Pero el absoluto es el mayor, no su suma, ${t}.`),
        en('PO28', GRx + GRy, t => `Bien GR(x) = ${GRx} y GR(y) = ${GRy}. Pero salen de términos distintos; sumarlos da ${t}.`),
        en('PO9', gr[0], t => `Bien el grado del primer término, ${t}. Pero el absoluto es el mayor de los tres.`),
        en('PO10', Math.max(GRx, GRy), t => `Bien el mayor exponente de una letra, ${t}. Pero el absoluto suma los exponentes dentro de cada término.`),
      ],
      solucion: [[`Grados de los términos: ${gr.join(', ')}.`], ['GA = ', Tr(f(GA)), '.']],
      _datos: { ts },
    };
  }
  function gr(rng) {
    const ts = tresTerminos(rng), enX = rng.entero(0, 1) === 1, L = enX ? 'x' : 'y', k = enX ? 1 : 2, o = enX ? 2 : 1;
    const bien = Math.max(...ts.map(t => t[k])), GA = Math.max(...ts.map(t => t[1] + t[2]));
    return {
      enunciado: [`Se tiene P(x, y) = ${polXY(ts)}.`], pregunta: [`¿Cuál es su grado relativo a ${L}?`], datos: [D.gr, 'x = x¹: una letra sin exponente lleva 1'],
      correcta: bien,
      errores: [
        en('TAL-GA-GR', GA, t => `Bien sumados los exponentes de cada término. Pero ${t} es el grado absoluto; el relativo mira solo ${L}.`),
        en('TAL-LETRA', Math.max(...ts.map(t => t[o])), t => `Bien tomar el mayor exponente. Pero ${t} es el de ${enX ? 'y' : 'x'}.`),
        en('TAL-SUMA-EXP', ts.reduce((a, t) => a + t[k], 0), t => `Bien mirar solo ${L}. Pero el relativo es el mayor exponente, no su suma, ${t}.`),
        en('PO11', ts.reduce((a, t) => a + t[1] + t[2], 0), t => `Bien los exponentes. Pero el relativo mira una sola letra; sumar todos da ${t}.`),
      ],
      solucion: [[`Exponentes de ${L}: ${ts.map(t => t[k]).join(', ')}.`], [`GR(${L}) = `, Tr(f(bien)), '.']],
      _datos: { ts, L },
    };
  }
  function esPolinomio(rng) {
    const p = rng.entero(1, 4), q = p + rng.entero(2, 6), bien = q - p + 1;
    return {
      enunciado: [`Se tiene P(x) = 3x^(n − ${p}) + x^(${q} − n) + 2.`], pregunta: ['¿Para cuántos valores enteros de n es un polinomio?'], datos: [D.expo],
      correcta: bien,
      errores: [
        en('TAL-EXTREMO', bien - 1, t => `Bien: n va de ${p} a ${q}. Pero los dos extremos cuentan, porque un exponente 0 vale; sin uno quedan ${t}.`),
        en('TAL-EXTREMOS', bien - 2, t => `Bien el rango de ${p} a ${q}. Pero n = ${p} y n = ${q} también cuentan; sin ellos quedan ${t}.`),
        en('TAL-PIDE', q, t => `Bien el mayor valor de n, ${t}. Pero piden cuántos valores hay.`),
        en('TAL-RESTA', q - p, t => `Bien los extremos ${p} y ${q}. Pero de ${p} a ${q} hay ${q} − ${p} + 1 enteros, no ${t}.`),
      ],
      solucion: [[`n − ${p} ≥ 0 y ${q} − n ≥ 0: n va de ${p} a ${q}.`], [`${q} − ${p} + 1 = `, Tr(f(bien)), ' valores.']],
      _datos: { p, q },
    };
  }
  function parametro(rng) {
    let ps, qs;
    do { ps = [rng.entero(0, 4), rng.entero(0, 4), rng.entero(0, 4)]; qs = [rng.entero(1, 5), rng.entero(1, 5), rng.entero(1, 5)]; } while (new Set(ps.map((p, i) => p + qs[i])).size < 3);
    const s = ps.map((p, i) => p + qs[i]), smax = Math.max(...s), n = rng.entero(2, 7), G = n + smax;
    const cs = [1, noCero(rng, -5, 5), noCero(rng, -5, 5)];
    const t = (c, p, q, i) => `${i === 0 ? (c === 1 ? '' : c) : ` ${c < 0 ? '−' : '+'} ${Math.abs(c) === 1 ? '' : Math.abs(c)}`}x^(${p ? `n + ${p}` : 'n'})${lit(q, 'y')}`;
    const otro = s.find(x => x !== smax), sumaT = G - s.reduce((a, b) => a + b, 0);
    return {
      enunciado: [`El polinomio P(x, y) = ${cs.map((c, i) => t(c, ps[i], qs[i], i)).join('')} tiene grado absoluto ${G}.`], pregunta: ['¿Cuánto vale n?'], datos: [D.term, D.ga],
      correcta: n,
      errores: [
        en('TAL-GRADO-OTRO', G - otro, x => `Bien igualar un grado a ${G}. Pero ese término no es el mayor: con n = ${x} otro pasaría de ${G}.`),
        sumaT % 3 === 0 && sumaT !== 0 && en('PO11', sumaT / 3, x => `Bien los grados con n. Pero el absoluto es el mayor, no la suma; sumar los tres da ${x}.`),
        en('TAL-PIDE', G, x => `Bien leído el grado absoluto, ${x}. Pero piden n.`),
        en('TAL-GA-GR', G - Math.max(...ps), x => `Bien despejar n. Pero eso iguala a ${G} el exponente de x, sin el de y; así sale ${x}.`),
      ],
      solucion: [[`Los grados son ${s.map(x => `n + ${x}`).join(', ')}: el mayor es n + ${smax}.`], [`n + ${smax} = ${G}, n = `, Tr(f(n)), '.']],
      _datos: { ps, qs, G },
    };
  }
  function relativos(rng) {
    let p, q, m, n;
    do { p = rng.entero(1, 4); q = rng.entero(1, 4); m = rng.entero(1, 6); n = rng.entero(1, 6); } while (p === q);
    const A = m + p, B = n + q, GA = m + n + Math.max(p, q), c = noCero(rng, -6, 6);
    return {
      enunciado: [`En P(x, y) = x^(m + ${p})y^(n) ${c < 0 ? '−' : '+'} ${Math.abs(c) === 1 ? '' : Math.abs(c)}x^(m)y^(n + ${q}) se cumple GR(x) = ${A} y GR(y) = ${B}.`], pregunta: ['¿Cuál es su grado absoluto?'], datos: [D.gr, D.term, D.ga],
      correcta: GA,
      errores: [
        en('PO28', A + B, t => `Bien m = ${m} y n = ${n}. Pero ${A} y ${B} salen de términos distintos; sumarlos da ${t}.`),
        en('TAL-GRADO-OTRO', m + n + Math.min(p, q), t => `Bien m y n. Pero ${t} es el grado del otro término; el absoluto es el mayor.`),
        en('TAL-PIDE', m + n, t => `Bien m + n = ${t}. Pero piden el grado absoluto.`),
        en('TAL-PIDE-PROD', m * n, t => `Bien m = ${m} y n = ${n}. Pero piden el grado, no m · n = ${t}.`),
      ],
      solucion: [[`m + ${p} = ${A}, m = ${m}; n + ${q} = ${B}, n = ${n}. Los grados son ${m + p + n} y ${m + n + q}.`], ['GA = ', Tr(f(GA)), '.']],
      _datos: { p, q, A, B },
    };
  }

  // ======================= Idea 4: completo, ordenado y homogéneo =======================
  function total(rng) {
    const n = rng.entero(3, 11), m = rng.entero(2, Math.min(5, n));
    if (n === 5 && m === 3) return null;   // x⁵ − 3x² + 1, la predicción
    return {
      enunciado: [`Un polinomio en x de grado ${n} tiene ${m} términos escritos.`], pregunta: ['Si se completa, ¿cuántos términos tendrá?'], datos: [D.completo, D.cero],
      correcta: n + 1,
      errores: [
        en('PO9', n, t => `Bien contar de x${sup(n)} hacia abajo. Pero falta la casilla de x⁰; sin ella quedan ${t}.`),
        en('PO1', m, t => `Bien los ${t} escritos. Pero completar agrega los de coeficiente 0.`),
        en('TAL-FALTAN', n + 1 - m, t => `Bien contadas las casillas vacías, ${t}. Pero piden el total.`),
        en('TAL-COMPLETO', m + 1, t => `Bien agregar algo. Pero completar no es agregar un término: ${t} no alcanza.`),
        en('TAL-X0-DOBLE', n + 2, t => `Bien la casilla de x⁰. Pero se cuenta una vez: de x${sup(n)} a x⁰ no hay ${t}.`),
      ],
      solucion: [[`Una casilla por potencia, de x${sup(n)} a x⁰.`], [`${n} + 1 = `, Tr(f(n + 1)), ' términos.']],
      _datos: { n, m },
    };
  }
  function ceros(rng) {
    const n = rng.entero(4, 8), m = rng.entero(2, Math.min(4, n - 1));
    const exps = [n]; while (exps.length < m) { const x = rng.entero(0, n - 1); if (!exps.includes(x)) exps.push(x); }
    exps.sort((a, b) => b - a);
    const ts = exps.map(x => [noCero(rng, -6, 7), x, 0]), bien = n + 1 - m;
    return {
      enunciado: [`Se tiene el polinomio ${polXY(ts)}.`], pregunta: ['¿Cuántos términos de coeficiente 0 hay que agregarle para que quede completo?'], datos: [D.completo, D.cero],
      correcta: bien,
      errores: [
        en('TAL-PIDE', n + 1, t => `Bien: completo tendría ${t} términos. Pero piden cuántos ceros se agregan.`),
        en('TAL-X0', exps.includes(0) ? bien + 1 : bien - 1, t => (exps.includes(0) ? `Bien contar las potencias que faltan. Pero x⁰ ya está escrito; contarlo otra vez da ${t}.` : `Bien las potencias con x que faltan. Pero también falta la de x⁰; sin ella quedan ${t}.`)),
        en('PO1', m, t => `Bien los ${t} términos escritos. Pero piden los que faltan.`),
        en('TAL-COMPLETO', 1, () => 'Bien agregar un cero. Pero va un 0 por cada potencia que falta, no uno solo.'),
      ],
      solucion: [[`De x${sup(n)} a x⁰ hay ${n + 1} casillas; ${m} tienen número.`], [`${n + 1} − ${m} = `, Tr(f(bien)), '.']],
      _datos: { n, m, exps },
    };
  }
  function homogeneo(rng) {
    let g, a1, b1, a2, b2, a3, b3;
    do { g = rng.entero(5, 10); a2 = rng.entero(1, g - 1); b2 = g - a2; a3 = rng.entero(0, g); b3 = g - a3; b1 = rng.entero(1, g - 1); a1 = g - b1; } while (a2 === a3 || a1 === a2 || a1 === a3);
    const c2 = noCero(rng, -5, 5), c3 = noCero(rng, -5, 5);
    return {
      enunciado: [`Se tiene P(x, y) = 2x^(m)${lit(b1, 'y')}${term(c2, a2, b2)}${term(c3, a3, b3)}.`], pregunta: ['¿Qué valor de m lo hace homogéneo?'], datos: [D.homog, D.term],
      correcta: a1,
      errores: [
        en('TAL-HOMOG', g, t => `Bien hallado el grado común, ${t}. Pero m es el exponente que lo completa: m + ${b1} = ${g}.`),
        en('TAL-HOMOG-EXP', a2, t => `Bien comparar con otro término. Pero homogéneo pide grados iguales, no copiar su exponente ${t}.`),
        en('TAL-HOMOG-SIGNO', g + b1, t => `Bien el grado común, ${g}. Pero el ${b1} se resta; sumarlo da ${t}.`),
        en('TAL-HOMOG-OTRO', a3, t => `Bien mirar otro término. Pero se piden grados iguales; su exponente ${t} no basta.`),
      ],
      solucion: [[`Los otros términos tienen grado ${g}; el primero, m + ${b1}.`], [`m + ${b1} = ${g}, m = `, Tr(f(a1)), '.']],
      _datos: { g, b1 },
    };
  }
  function parametros(rng) {
    const p = rng.entero(0, 2), s = rng.entero(1, 4), crec = rng.entero(0, 1) === 1;
    const a = 3 - p, c = 1 + s, bien = a * c;
    const ea = p ? `a + ${p}` : 'a', ec = `c − ${s}`;
    const txt = crec ? `7 + 5x^(${ec}) − x² + 2x^(${ea})` : `2x^(${ea}) − x² + 5x^(${ec}) + 7`;
    return {
      enunciado: [`P(x) = ${txt} es completo y está ordenado de forma ${crec ? 'creciente' : 'decreciente'}.`], pregunta: ['¿Cuánto vale a · c?'], datos: [D.completo, D.ordenado],
      correcta: bien,
      errores: [
        en('TAL-EXP-DIRECTO', 3, t => `Bien los exponentes 3 y 1. Pero piden a y c: sin despejar sale ${t}.`),
        en('TAL-PIDE', a + c, t => `Bien a = ${a} y c = ${c}. Pero piden el producto, no la suma, ${t}.`),
        en('AL16', (3 + p) * (1 - s), t => `Bien igualar los exponentes. Pero al despejar, cada número pasa con el signo cambiado; al revés sale ${t}.`),
        en('TAL-ORDEN-INVERSO', (1 - p) * (3 + s), t => `Bien una casilla por potencia. Pero ${crec ? 'creciente: el término con c, después del 7, es el de x' : 'decreciente: el primero es el de x³'}; al revés sale ${t}.`),
      ],
      solucion: [['Cuatro términos, completo: los exponentes son 3, 2, 1 y 0. El de a es x³ y el de c, x.'], [`a = ${a}, c = ${c}; a · c = `, Tr(f(bien)), '.']],
      _datos: { p, s, crec },
    };
  }

  // ======================= Idea 5: polinomios idénticos =======================
  function mn(rng) {
    const p = rng.entero(1, 5), q = rng.entero(1, 5), A = noCero(rng, -4, 6), B = noCero(rng, -4, 8), c = noCero(rng, -5, 5);
    const m = A + p, n = B - q, mas = rng.entero(0, 1) === 1, val = (x, y) => (mas ? x + y : x * y), pide = mas ? 'm + n' : 'm · n';
    return {
      enunciado: [Tp(`P(x) = (m − ${p})x² + (n + ${q})x ${c < 0 ? '−' : '+'} ${Math.abs(c)}`), ' y ', Tq(`Q(x) = ${poli([A, B, c])}`), ' son idénticos.'], pregunta: [`¿Cuánto vale ${pide}?`], datos: [D.ident],
      correcta: val(m, n),
      errores: [
        en('AL16', val(A - p, B + q), t => `Bien igualar casilla por casilla. Pero al despejar, el ${p} pasa sumando y el ${q}, restando; al revés sale ${t}.`),
        en('TAL-COEF-Q', val(A, B), t => `Bien leídos los coeficientes de Q. Pero falta despejar m y n; con ellos sale ${t}.`),
        en('TAL-DESPEJA-UNO', val(m, B), t => `Bien m = ${z(m)}. Pero n + ${q} = ${z(B)}: falta despejar n; así sale ${t}.`),
        en('TAL-DESPEJA-OTRO', val(A, n), t => `Bien n = ${z(n)}. Pero m − ${p} = ${z(A)}: falta despejar m; así sale ${t}.`),
      ],
      solucion: [['Se iguala cada casilla: la de x² y la de x.'], [`m = ${z(A)} + ${p} = ${z(m)}, n = ${z(B)} − ${q} = ${z(n)}; ${pide} = `, Tr(f(val(m, n))), '.']],
      _datos: { p, q, A, B, mas },
    };
  }
  function nulo(rng) {
    const p = noCero(rng, -5, 6), q = noCero(rng, -5, 6), s = noCero(rng, -5, 6), t = (L, k) => (k > 0 ? `(${L} − ${k})` : `(${L} + ${-k})`), bien = p + q + s;
    return {
      enunciado: [`Se sabe que ${t('a', p)}x² + ${t('b', q)}x + ${t('c', s)} ≡ 0.`], pregunta: ['¿Cuánto vale a + b + c?'], datos: [D.nulo],
      correcta: bien,
      errores: [
        en('AL16', -bien, x => `Bien que cada coeficiente valga 0. Pero al despejar, el número pasa con el signo cambiado; al revés sale ${x}.`),
        en('TAL-NULO', 0, () => 'Bien la idea de que todo vale 0. Pero lo que vale 0 es cada coeficiente, no cada letra.'),
        en('TAL-DESPEJA-UNO', p + q, x => `Bien a y b. Pero el término sin x también vale 0: falta c; sin él sale ${x}.`),
        en('TAL-SIGNO', p + q - s, x => `Bien a y b. Pero c = ${z(s)}, con su signo; así sale ${x}.`),
      ],
      solucion: [['Cada coeficiente vale 0.'], [`a = ${z(p)}, b = ${z(q)}, c = ${z(s)}; a + b + c = `, Tr(f(bien)), '.']],
      _datos: { p, q, s },
    };
  }
  function tres(rng) {
    const a = noCero(rng, -5, 6), b = noCero(rng, -6, 6), c = noCero(rng, -7, 7), bien = a + b + c;
    return {
      enunciado: ['Se sabe que ', Tp(`ax² ${b < 0 ? '−' : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}x + c`), ' ≡ ', Tq(`${term(a, 2, 0, true)} + bx ${c < 0 ? '−' : '+'} ${Math.abs(c)}`), '.'], pregunta: ['¿Cuánto vale a + b + c?'], datos: [D.ident],
      correcta: bien,
      errores: [
        en('TAL-SIGNO', a + b - c, x => `Bien a = ${z(a)} y b = ${z(b)}. Pero c es ${z(c)}, con su signo; así sale ${x}.`),
        en('TAL-DESPEJA-UNO', a + c, x => `Bien a y c. Pero b es el coeficiente de x de la izquierda, ${z(b)}; sin él sale ${x}.`),
        en('PO21', Math.abs(a) + Math.abs(b) + Math.abs(c), x => `Bien cada casilla. Pero cada coeficiente va con su signo; sin signos sale ${x}.`),
        en('TAL-SIGNO-B', a - b + c, x => `Bien a y c. Pero b es ${z(b)}, con su signo; así sale ${x}.`),
      ],
      solucion: [['Casilla por casilla: x², x y el término sin x.'], [`a = ${z(a)}, b = ${z(b)}, c = ${z(c)}; a + b + c = `, Tr(f(bien)), '.']],
      _datos: { a, b, c },
    };
  }
  function sistema(rng) {
    let a, b, p, q;
    do { a = noCero(rng, -4, 6); b = noCero(rng, -4, 6); p = rng.entero(1, 4); q = rng.entero(1, 4); } while (a === b || a + b === 0 || p * a - q * b === 0 || p === q);
    const S = a + b, T = p * a - q * b, bm = (T - p * S) / (q - p), mal = Number.isInteger(bm) ? (S - bm) * bm : null;
    return {
      enunciado: [`Se sabe que a(x + ${p}) + b(x − ${q}) ≡ ${poli([S, T])}.`], pregunta: ['¿Cuánto vale a · b?'], datos: [D.ident, D.dist],
      correcta: a * b,
      errores: [
        en('TAL-PIDE', S, t => `Bien: a + b = ${t}. Pero piden a · b: falta resolver el sistema.`),
        en('TAL-COEF-Q', S * T, t => `Bien leídos los coeficientes de la derecha. Pero antes hay que hallar a y b; multiplicarlos da ${t}.`),
        mal !== null && mal !== a * b && en('TAL-SISTEMA-SIGNO', mal, t => `Bien la casilla de x. Pero b(x − ${q}) da −${q}b; con +${q}b sale ${t}.`),
        en('TAL-DESPEJA-UNO', a, t => `Bien a = ${t}. Pero piden a · b.`),
        en('TAL-DESPEJA-OTRO', b, t => `Bien b = ${t}. Pero piden a · b.`),
      ],
      solucion: [[`Casilla de x: a + b = ${z(S)}. Sin x: ${p}a − ${q}b = ${z(T)}.`], [`a = ${z(a)}, b = ${z(b)}; a · b = `, Tr(f(a * b)), '.']],
      _datos: { p, q, S, T },
    };
  }

  // ======================= Idea 6: multiplicar polinomios =======================
  function grado(rng) {
    const m = rng.entero(2, 6), n = rng.entero(1, 5), k = rng.entero(2, 3), bien = k * m + n;
    return {
      enunciado: [`P tiene grado ${m} y Q tiene grado ${n}.`], pregunta: ['¿Qué grado tiene ', Tp('P'), sup(k), ' · ', Tq('Q'), '?'], datos: [D.grado1, D.pot, D.gpot],
      correcta: bien,
      errores: [
        en('TAL-POT-GRADO', m + n, t => `Bien sumar los grados. Pero P${sup(k)} tiene grado ${k} · ${m}; sin la potencia sale ${t}.`),
        en('PO5', m * n * k, t => `Bien que el grado crece. Pero los grados de los factores se suman, no se multiplican: ${t} no es.`),
        en('PO23', Math.max(k * m, n), t => `Bien el grado de cada factor. Pero quedarse con el mayor, ${t}, es lo que pasa en una suma.`),
        en('TAL-POT-MULT', m + k + n, t => `Bien la idea de sumar. Pero la potencia multiplica el grado, no le suma ${k}; así sale ${t}.`),
      ],
      solucion: [[`P${sup(k)} tiene grado ${k} · ${m}; con Q se suma ${n}.`], [`${k} · ${m} + ${n} = `, Tr(f(bien)), '.']],
      _datos: { m, n, k },
    };
  }
  function coef(rng) {
    const a = noCero(rng, -4, 4), b = noCero(rng, -4, 4), c = noCero(rng, -5, 5), enX2 = rng.entero(0, 1) === 1;
    const pr = mult([1, a], [1, b, c]), bien = enX2 ? pr[1] : pr[2], L = enX2 ? 'x²' : 'x';
    return {
      enunciado: ['Se multiplica (', Tp(poli([1, a])), ')(', Tq(poli([1, b, c])), ').'], pregunta: [`¿Cuál es el coeficiente de ${L} en el producto?`], datos: [D.prod, D.pot],
      correcta: bien,
      errores: enX2 ? [
        en('TAL-UNA-CASILLA', b, t => `Bien x por ${term(b, 1, 0, true)}. Pero ${z(a)} · x² también da x²; sin esa casilla sale ${t}.`),
        en('TAL-OTRA-CASILLA', a, t => `Bien ${z(a)} · x². Pero x · ${term(b, 1, 0, true)} también da x²; sin esa casilla sale ${t}.`),
        en('TAL-COEF-MULT', a * b, t => `Bien multiplicar coeficientes. Pero ${z(a)} · ${par(b)} = ${t} va con x, no con x².`),
        en('TAL-SIGNO', b - a, t => `Bien las dos casillas. Pero se suman con sus signos: ${z(b)} + ${par(a)}; así sale ${t}.`),
      ] : [
        en('TAL-UNA-CASILLA', c, t => `Bien x por ${z(c)}. Pero ${z(a)} · ${term(b, 1, 0, true)} también da x; sin esa casilla sale ${t}.`),
        en('TAL-OTRA-CASILLA', a * b, t => `Bien ${z(a)} · ${term(b, 1, 0, true)}. Pero x · ${par(c)} también da x; sin esa casilla sale ${t}.`),
        en('TAL-COEF-MULT', a * c, t => `Bien multiplicar coeficientes. Pero ${z(a)} · ${par(c)} = ${t} es el término sin x.`),
        en('TAL-SIGNO', c - a * b, t => `Bien las dos casillas. Pero se suman: ${z(c)} + ${z(a * b)}; así sale ${t}.`),
      ],
      solucion: [[`Dos casillas dan ${L}; se suman sus coeficientes.`], [enX2 ? `${z(b)} + ${par(a)} = ` : `${z(c)} + ${par(a)} · ${par(b)} = `, Tr(f(bien)), '.']],
      _datos: { a, b, c, enX2 },
    };
  }
  function sumaCoef(rng) {
    let a, b, c, d, k;
    do { a = rng.entero(1, 3); b = noCero(rng, -3, 3); c = rng.entero(1, 3); d = noCero(rng, -4, 4); k = rng.entero(2, 4); } while (a + b === 0 || c + d === 0 || Math.abs((a + b) ** k * (c + d)) > 300);
    const bien = (a + b) ** k * (c + d);
    return {
      enunciado: ['Se tiene el producto (', Tp(poli([a, b])), `)${sup(k)}(`, Tq(poli([c, d])), ').'], pregunta: ['¿Cuánto suman los coeficientes del producto desarrollado?'], datos: [D.p1p0],
      correcta: bien,
      errores: [
        en('TAL-SUMA-VISTOS', a + b + c + d, t => `Bien la idea de sumar coeficientes. Pero los que se ven no son los del producto; sumarlos da ${t}.`),
        en('TAL-POT-MULT', (a + b) * k * (c + d), t => `Bien P(1) en cada factor. Pero (${z(a + b)})${sup(k)} se eleva, no se multiplica por ${k}; así sale ${t}.`),
        en('PO12', b ** k * d, t => `Bien evaluar sin desarrollar. Pero ${t} es el valor con x = 0, el término independiente.`),
        en('TAL-SUMA-NO-MULT', (a + b) ** k + (c + d), t => `Bien P(1) en cada factor. Pero es un producto: los valores se multiplican; sumarlos da ${t}.`),
      ],
      solucion: [['La suma de coeficientes es el valor con x = 1.'], [`(${z(a + b)})${sup(k)} · (${z(c + d)}) = `, Tr(f(bien)), '.']],
      _datos: { a, b, c, d, k },
    };
  }
  function indep(rng) {
    const a = noCero(rng, -4, 4), b = noCero(rng, -5, 5), c = noCero(rng, -4, 4), bien = a * b * c;
    return {
      enunciado: ['Se tiene el producto (', Tp(poli([1, 0, a])), ')(', Tq(poli([2, b])), `)(${poli([1, c])}).`], pregunta: ['¿Cuál es su término independiente?'], datos: [D.p1p0, D.prod],
      correcta: bien,
      errores: [
        en('TAL-INDEP-SUMA', a + b + c, t => `Bien tomar los términos sin x. Pero el producto los multiplica; sumarlos da ${t}.`),
        en('TAL-SIGNO', -bien, t => `Bien los tres números. Pero cada uno va con su signo; así sale ${t}.`),
        en('TAL-OLVIDA-FACTOR', a * b, t => `Bien ${z(a)} · ${par(b)} = ${t}. Pero falta el tercer factor, ${par(c)}.`),
        en('TAL-COEF-PRINCIPAL', 2, () => 'Bien multiplicar los factores. Pero 1 · 2 · 1 = 2 es el coeficiente principal, no el término sin x.'),
      ],
      solucion: [['Con x = 0 cada factor deja su término sin x.'], [`${par(a)} · ${par(b)} · ${par(c)} = `, Tr(f(bien)), '.']],
      _datos: { a, b, c },
    };
  }
  function productoIgual(rng) {
    let m, q, A;
    do { m = noCero(rng, -5, 6); q = noCero(rng, -4, 4); A = rng.entero(1, 3); } while (m - A * q === 0);
    const n = m - A * q, T = m * q, qT = q > 0 ? `x − ${q}` : `x + ${-q}`, Ax = A === 1 ? '' : A;
    return {
      enunciado: ['Se sabe que (', Tp(`${Ax}x + m`), ')(', Tq(qT), `) ≡ ${Ax}x² + nx ${T > 0 ? '−' : '+'} ${Math.abs(T)}.`], pregunta: ['¿Cuánto vale m + n?'], datos: [D.prod, D.ident],
      correcta: m + n,
      errores: [
        en('AL16', -2 * m - A * q, t => `Bien la casilla sin x. Pero m · ${par(-q)} = ${z(-T)} da m = ${z(m)}; con el signo cambiado sale ${t}.`),
        en('TAL-UNA-CASILLA', m - A * q, t => `Bien m = ${z(m)}. Pero en x hay dos casillas: ${Ax}x · ${par(-q)} y m · x; con una sola sale ${t}.`),
        en('TAL-PIDE', m * n, t => `Bien m = ${z(m)} y n = ${z(n)}. Pero piden la suma; el producto es ${t}.`),
        en('TAL-SIGNO', m + m + A * q, t => `Bien m = ${z(m)}. Pero ${Ax}x · ${par(-q)} lleva su signo; sin él, n = ${z(m + A * q)} y sale ${t}.`),
      ],
      solucion: [[`Sin x: m · ${par(-q)} = ${z(-T)}, m = ${z(m)}. En x: ${z(-A * q)} + m = n = ${z(n)}.`], ['m + n = ', Tr(f(m + n)), '.']],
      _datos: { m, q, A },
    };
  }

  const CONSTRUIR = {
    reducir, sumar, restar, 'dos-letras': dosLetras, exponentes, perimetro,
    losetas, evaluar: evaluarTipo, 'uno-cero': unoCero, factorizada, coeficiente, desplazado,
    ga, gr, 'es-polinomio': esPolinomio, parametro, relativos,
    total, ceros, homogeneo, parametros,
    mn, nulo, tres, sistema,
    grado, coef, 'suma-coef': sumaCoef, indep, 'producto-igual': productoIgual,
  };

  return { id: ID, titulo: 'Polinomios', generar, TIPOS_POR_IDEA, NIVEL, TIPOS: Object.keys(CONSTRUIR) };
});
