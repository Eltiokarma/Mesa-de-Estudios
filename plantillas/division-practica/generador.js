/*
 * Generador «División de polinomios»: la práctica de las seis ideas de algebra.division-de-polinomios
 * (contenido/teoria/algebra/division-de-polinomios.js). Formato "predicciones" (docs/arquitectura.md). Funciona en el
 * navegador (window.Generadores['division-practica']) y en Node (require). No usa ningún motor ni el código de la
 * teoría: las cuentas son divisiones y evaluaciones de polinomios con enteros chicos, hechas aquí.
 *
 * Propuesta: docs/etapa6/propuesta-algebra.md §7. El objeto, como en la teoría: el pasadizo y el piso del maestro Rubén
 * en Juliaca (losetas de 2 a 6 dm, valores de problema, sin fuente) y una caja de cartulina (valores de problema).
 *
 * Tipos por idea (TIPOS_POR_IDEA; nivel 1 un paso, 2 dos pasos, 3 de examen). generar(semilla, { idea }) da solo los de
 * esa idea; sin idea, las seis con el mismo peso.
 *   algoritmo           grado-q (1) · grado-r (1) · reconstruir (2; D a partir de d, q y r) · suma-coef (2; D(1) sin
 *                       armar D) · identidad-cero (3; un coeficiente que sale de D(0), San Marcos 2025-I)
 *   horner              primer-termino (1) · coef-q (2) · resto-cuad (2; divisor de grado 2) · exacta-mn (3; m y n
 *                       para que la división sea exacta)
 *   ruffini             casilla (1) · cociente (2) · resto-ruf (2; con una potencia que falta) · suma-q (3)
 *   divisor-k           cociente-k (1) · resto-k (1) · suma-k (2) · cociente-frac (3; x = −b/c en fracción)
 *   teorema-resto       resto (1) · resto-neg (1; potencias de un negativo) · divisible (2; el m que hace exacta la
 *                       división) · resto-dos (3; entre (x − a)(x − b), San Marcos 2024-I) · caja (3; el volumen de una
 *                       caja sin tapa, San Marcos 2021)
 *   cocientes-notables  termino (1) · signos (2; con x + y) · num-terminos (2) · central (3; San Marcos 2023-II) ·
 *                       exponentes (3; San Marcos 2023-I)
 *
 * Notación: superíndices Unicode (x², y³), el signo menos tipográfico «−», D, d, q y r como en la teoría.
 * Colores: un color fijo por magnitud, el de la teoría: el divisor y el número que lo anula en turquesa (d, a: i), el
 * cociente en violeta (q: f) y el resto en naranja (r: o), solo en la solución; el dividendo y lo demás en tinta. Ni
 * carmín ni verde.
 * Datos (contrato, punto 13): las propiedades y reglas que se usan (D = d · q + r, la tabla de Ruffini, el teorema del
 * resto, el término de lugar k), nunca el paso hecho ni la respuesta.
 * Errores: los códigos de la teoría (PO de plantillas/polinomios/, hipótesis del proyecto; AL16, de
 * docs/investigacion/algebra-funciones-ideas-erroneas.md; TAL-*, hipótesis de diseño de la teoría). De todos los errores
 * de un problema van 3 o 4, elegidos para que la correcta no sea la central ni, si es un número, un extremo. Cada
 * explicación empieza por lo que el alumno hizo bien y muestra lo que da su error.
 * La práctica no repite ninguna Predice de la unidad (grado 7 entre grado 3; 6x⁴ + x³ + 4x − 1 entre 2x² + x − 1;
 * 2x³ − 5x + 1 entre x − 2; 4x² − 2x + 5 entre 2x − 1; x⁵ − 3x² + 7 entre x + 1; el cuarto término de x⁶ − 64 entre x − 2).
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
  const ID = 'division-practica';
  const INV = 'docs/investigacion/algebra-funciones-ideas-erroneas.md';
  const TEO = 'contenido/teoria/algebra/division-de-polinomios.js';
  const ESC = 'plantillas/polinomios/plantilla.json';
  const v = P.v;
  const f = x => P.formatear(x, 0);

  // ---- Escritura ----
  const SUPS = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const sup = s => [...String(s)].map(c => SUPS[c]).join('');
  const z = x => (x < 0 ? `−${-x}` : String(x));
  const par = x => (x < 0 ? `(−${-x})` : String(x));
  const lit = (e, L = 'x') => (e === 0 ? '' : e === 1 ? L : `${L}${sup(e)}`);
  const term = (c, e) => `${c < 0 ? '−' : ''}${Math.abs(c) === 1 && e ? '' : Math.abs(c)}${lit(e)}`;
  function poli(cs) {
    const g = cs.length - 1, out = [];
    cs.forEach((c, i) => { if (c) { const e = g - i, m = Math.abs(c), cuerpo = `${m === 1 && e ? '' : m}${lit(e)}`; out.push(out.length ? ` ${c < 0 ? '−' : '+'} ${cuerpo}` : `${c < 0 ? '−' : ''}${cuerpo}`); } });
    return out.join('') || '0';
  }
  const mcd = (a, b) => (b ? mcd(b, a % b) : Math.abs(a));
  const fr = (n, d) => { const g = mcd(n, d) || 1; let a = n / g, b = d / g; if (b < 0) { a = -a; b = -b; } return b === 1 ? z(a) : `${a < 0 ? '−' : ''}${Math.abs(a)}/${b}`; };
  const div = a => (a < 0 ? `x + ${-a}` : `x − ${a}`);
  const evaluar = (cs, x) => cs.reduce((a, c) => a * x + c, 0);
  const mult = (A, B) => { const o = Array(A.length + B.length - 1).fill(0); A.forEach((a, i) => B.forEach((b, j) => { o[i + j] += a * b; })); return o; };
  const sumar = (A, B) => { const n = Math.max(A.length, B.length), a = Array(n - A.length).fill(0).concat(A), b = Array(n - B.length).fill(0).concat(B); return a.map((x, i) => x + b[i]); };
  const sinCeros = cs => { const i = cs.findIndex(c => c !== 0); return i < 0 ? [0] : cs.slice(i); };
  const ruffini = (cs, a) => cs.reduce((b, c, i) => [...b, i ? c + a * b[i - 1] : c], []);
  function dividir(D, d) {
    const cur = D.slice(), q = [];
    for (let k = 0; k + d.length <= cur.length; k++) { const c = cur[k] / d[0]; q.push(c); d.forEach((u, i) => { cur[k + i] -= c * u; }); }
    return { q, r: sinCeros(cur.slice(cur.length - (d.length - 1))) };
  }

  const VARS = {
    d: { nombre: 'el divisor', color: 'i' }, a: { nombre: 'el número que anula al divisor', color: 'i' },
    q: { nombre: 'el cociente', color: 'f' }, r: { nombre: 'el resto', color: 'o' },
  };
  const Td = t => v('d', t), Ta = t => v('a', t), Tq = t => v('q', t), Tr = t => v('r', t);

  // ---- Errores: el respaldo sale del código ----
  const RESPALDO = { AL16: ['parcial', INV] };
  const de = id => RESPALDO[id] || (/^PO\d/.test(id) ? ['hipotesis', ESC] : ['hipotesis', TEO]);
  function e(id, texto, explicar) { if (texto === null) return null; const [respaldo, fuente] = de(id); return { id, clave: texto, texto, explicacion: explicar(texto), respaldo, fuente }; }
  function en(id, valor, explicar) { if (!Number.isFinite(valor)) return null; const [respaldo, fuente] = de(id); return { id, valor, texto: f(valor), explicacion: explicar(f(valor)), respaldo, fuente }; }

  // ---- Datos que se repiten (herramientas, no el paso hecho) ----
  const D = {
    ident: 'Al dividir D entre d: D = d · q + r, con r de grado menor que d',
    grado: 'Grado de un polinomio de una letra: su mayor exponente de x',
    pot: 'xᵐ · xⁿ = xᵐ⁺ⁿ',
    potDiv: 'xᵐ ÷ xⁿ = xᵐ⁻ⁿ',
    mult: 'Para multiplicar polinomios, cada término de uno multiplica a cada término del otro',
    sumaCoef: 'Suma de coeficientes de un polinomio P: P(1)',
    indep: 'Término independiente de un polinomio P: P(0)',
    paso: 'Término de q: el primero de lo que queda entre el primero de d; luego se resta d por ese término',
    primero: 'El primer término de q: el primer término de D entre el primero de d',
    exacta: 'División exacta: el resto es 0',
    casilla: 'Ruffini: cada casilla nueva de abajo es el coeficiente de arriba más a por la casilla anterior',
    cero: 'Una potencia que falta se escribe con coeficiente 0',
    filaQ: 'La fila de abajo, sin la última casilla: los coeficientes del cociente; la última: el resto',
    falso: 'Para dividir entre cx + b: Ruffini con x = −b/c da el cociente falso q′',
    cocK: 'Cociente: q = q′ ÷ c. Resto: la última casilla, sin dividir',
    teo: 'Teorema del resto: el resto de dividir P(x) entre x − a es P(a)',
    neg: 'Con un número negativo: (−2)² = 4 y (−2)³ = −8',
    cuad: 'Si el divisor vale 0 en x = a, entonces P(a) = r(a)',
    grado1: 'Con un divisor de grado 2, el resto es de grado 1 a lo más: r(x) = mx + n',
    caja: 'Volumen de una caja: largo · ancho · alto',
    tk: 'Término de lugar k de (xⁿ ± yⁿ) ÷ (x ± y): xⁿ⁻ᵏyᵏ⁻¹, con su signo',
    alterna: 'Con x + y en el divisor, los signos se alternan: +, −, +, …',
    nTerm: '(xⁿ − aⁿ) ÷ (x − a) tiene n términos',
    gradoT: 'Grado de un término: la suma de los exponentes de sus letras',
  };
  const base = (p, s) => `Si el divisor es x${sup(p)} − ${lit(s, 'y')}, el dividendo debe ser (x${sup(p)})ⁿ − (${lit(s, 'y')})ⁿ`;

  // ---- Tipos por idea ----
  const TIPOS_POR_IDEA = {
    algoritmo: ['grado-q', 'grado-r', 'reconstruir', 'suma-coef', 'identidad-cero'],
    horner: ['primer-termino', 'coef-q', 'resto-cuad', 'exacta-mn'],
    ruffini: ['casilla', 'cociente', 'resto-ruf', 'suma-q'],
    'divisor-k': ['cociente-k', 'resto-k', 'suma-k', 'cociente-frac'],
    'teorema-resto': ['resto', 'resto-neg', 'divisible', 'resto-dos', 'caja'],
    'cocientes-notables': ['termino', 'signos', 'num-terminos', 'central', 'exponentes'],
  };
  const IDEAS = Object.keys(TIPOS_POR_IDEA);
  const IDEA_DE = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map(t => [t, i])));
  const NIVEL = {
    'grado-q': 1, 'grado-r': 1, reconstruir: 2, 'suma-coef': 2, 'identidad-cero': 3,
    'primer-termino': 1, 'coef-q': 2, 'resto-cuad': 2, 'exacta-mn': 3,
    casilla: 1, cociente: 2, 'resto-ruf': 2, 'suma-q': 3,
    'cociente-k': 1, 'resto-k': 1, 'suma-k': 2, 'cociente-frac': 3,
    resto: 1, 'resto-neg': 1, divisible: 2, 'resto-dos': 3, caja: 3,
    termino: 1, signos: 2, 'num-terminos': 2, central: 3, exponentes: 3,
  };
  // Papel (regla 6; herramientas/papel-generador.js usa «papel-1» a «papel-8»): las seis ideas, de menos a más, con dos
  // preguntas del tipo de San Marcos al final.
  const PAPEL = { 'papel-1': 'grado-q', 'papel-2': 'casilla', 'papel-3': 'resto', 'papel-4': 'coef-q', 'papel-5': 'cociente-k',
    'papel-6': 'termino', 'papel-7': 'resto-dos', 'papel-8': 'central' };

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

  // ======================= Idea 1: algoritmo de la división =======================
  function gradoQ(rng) {
    const gD = rng.entero(4, 10), gd = rng.entero(1, Math.min(5, gD - 1));
    if (gD === 7 && gd === 3) return null;   // la predicción de la idea
    return {
      enunciado: [`Se divide un dividendo D de grado ${gD} entre un divisor `, Td('d'), ` de grado ${gd}.`], pregunta: ['¿Qué grado tiene el cociente ', Tq('q'), '?'],
      datos: [D.ident, D.grado, D.pot], correcta: gD - gd,
      errores: [
        en('TAL-GRADO-SUMA', gD + gd, t => `Bien que los grados se combinan. Pero sumarlos da ${t}, el grado de D · d; aquí d · q debe dar grado ${gD}.`),
        en('TAL-GRADO-DIVISOR', gd, t => `Bien leído el grado de d, ${t}. Pero q es otro polinomio: d · q llega a grado ${gD}.`),
        en('TAL-RESTO-COC', gd - 1, t => `Bien: ${t} es lo más que puede tener el resto. El cociente es otro.`),
        en('TAL-GRADO-COCIENTE', gD / gd, t => `Bien que se combinan los grados. Pero no se dividen: ${gD} ÷ ${gd} da ${t}; los grados se restan.`),
      ].map(x => (x && Number.isInteger(x.valor) ? x : null)),
      solucion: [['Los grados de d y q suman el de D.'], [`${gd} + grado de q = ${gD}, así que el grado de `, Tq('q'), ` es ${gD - gd}.`]],
      _datos: { gD, gd },
    };
  }
  function gradoR(rng) {
    const gD = rng.entero(5, 10), gd = rng.entero(2, Math.min(6, gD - 1));
    return {
      enunciado: [`Se divide un dividendo D de grado ${gD} entre un divisor `, Td('d'), ` de grado ${gd}.`], pregunta: ['¿Cuál es el mayor grado que puede tener el resto ', Tr('r'), '?'],
      datos: [D.ident, D.grado], correcta: gd - 1,
      errores: [
        en('TAL-GRADO-RESTO', gd, t => `Bien que el resto se compara con d. Pero con grado ${t} todavía se podría dividir otra vez.`),
        en('TAL-RESTO-COC', gD - gd, t => `Bien la resta ${gD} − ${gd} = ${t}. Pero ese es el grado del cociente.`),
        en('TAL-RESTO-CTE', 0, t => `Bien que el resto puede ser un número, de grado ${t}. Pero solo es seguro si d tiene grado 1.`),
        en('TAL-GRADO-SUMA', gD - 1, t => `Bien que el resto tiene grado menor. Pero menor que d, no que D: ${t} se compara con el dividendo.`),
      ],
      solucion: [['El resto tiene grado menor que el divisor.'], [`grado de r ≤ ${gd} − 1 = `, Tr(f(gd - 1)), '.']],
      _datos: { gD, gd },
    };
  }
  function reconstruir(rng) {
    const d = [1, noCero(rng, -4, 4)], q = [rng.entero(1, 3), noCero(rng, -4, 4), rng.entero(-5, 5)], r = noCero(rng, -6, 6);
    const dq = mult(d, q), Dd = sumar(dq, [r]), sinR = dq, sumaQ = sumar(sumar(d, q), [r]);
    const restaR = sumar(dq, [-r]);
    return {
      enunciado: ['Al dividir D entre ', Td(poli(d)), ' se obtuvo el cociente ', Tq(poli(q)), ' y el resto ', Tr(z(r)), '.'], pregunta: ['¿Cuál es el dividendo D?'],
      datos: [D.ident, D.mult], correcta: poli(Dd),
      errores: [
        e('TAL-OLVIDA-RESTO', poli(sinR), t => `Bien d · q. Pero falta sumarle el resto, ${z(r)}: sin él queda ${t}.`),
        e('TAL-SUMA-TODO', poli(sumaQ) === poli(Dd) ? null : poli(sumaQ), t => `Bien que van d, q y r. Pero d y q se multiplican, no se suman: sumarlos da ${t}.`),
        e('TAL-RESTA-AL-REVES', poli(restaR), t => `Bien d · q. Pero el resto se suma, no se resta: restarlo da ${t}.`),
        e('TAL-SIGNO-D', poli(sumar(mult([1, -d[1]], q), [r])), t => `Bien la cuenta d · q + r. Pero el divisor es ${poli(d)}: con el signo cambiado sale ${t}.`),
      ],
      solucion: [['D = d · q + r: se multiplica el divisor por el cociente y se suma el resto.'], ['(', Td(poli(d)), ')(', Tq(poli(q)), ') + ', Tr(par(r)), ' = ', poli(Dd), '.']],
      _datos: { d, q, r },
    };
  }
  function sumaCoef(rng) {
    let d, q, r;
    do { d = [1, noCero(rng, -4, 4)]; q = [noCero(rng, -3, 3), rng.entero(-4, 4), rng.entero(-5, 5)]; r = noCero(rng, -6, 6); } while (evaluar(d, 1) === 0 || evaluar(q, 1) === 0 || evaluar(q, 1) === 1 || evaluar(d, 1) === 1);
    const d1 = evaluar(d, 1), q1 = evaluar(q, 1);
    return {
      enunciado: ['Al dividir D entre ', Td(poli(d)), ', el cociente es ', Tq(poli(q)), ' y el resto es ', Tr(z(r)), '.'], pregunta: ['¿Cuánto suman los coeficientes de D?'],
      datos: [D.ident, D.sumaCoef], correcta: d1 * q1 + r,
      errores: [
        en('TAL-OLVIDA-RESTO', d1 * q1, t => `Bien d(1) · q(1). Pero falta sumar el resto: sin él da ${t}.`),
        en('TAL-SOLO-Q', q1 + r, t => `Bien q(1) y el resto. Pero q se multiplica por d(1) = ${z(d1)}; sin eso da ${t}.`),
        en('TAL-SUMA-TODO', d1 + q1 + r, t => `Bien los tres valores. Pero d y q se multiplican; sumarlos da ${t}.`),
      ],
      solucion: [['La suma de coeficientes de D es D(1), y D = d · q + r vale también en x = 1.'], [`D(1) = ${z(d1)} · ${par(q1)} + ${par(r)} = `, f(d1 * q1 + r), '.']],
      _datos: { d, q, r },
    };
  }
  function identidadCero(rng) {
    const d = [1, rng.entero(-3, 3), noCero(rng, -4, 4)], q = [1, noCero(rng, -4, 4), noCero(rng, -5, 5)], r = [noCero(rng, -6, 6), noCero(rng, -7, 7)];
    const Dd = sumar(mult(d, q), r);
    if (Dd.some(c => c === 0) || Math.abs(Dd[4]) > 40) return null;
    const vista = `${poli(Dd.slice(0, 4).concat([0]))} + n`;
    return {
      enunciado: [`Al dividir ${vista} entre `, Td(poli(d)), ', el cociente es ', Tq(poli(q)), ' y el resto es ', Tr(poli(r)), '.'], pregunta: ['¿Cuánto vale n?'],
      datos: [D.ident, D.indep], correcta: Dd[4],
      errores: [
        en('TAL-OLVIDA-RESTO', d[2] * q[2], t => `Bien d(0) · q(0). Pero falta sumar r(0) = ${z(r[1])}: sin él da ${t}.`),
        en('TAL-SOLO-Q', q[2] + r[1], t => `Bien q(0) y r(0). Pero q(0) se multiplica por d(0) = ${z(d[2])}; sin eso da ${t}.`),
        en('TAL-SIGNO-D', -d[2] * q[2] + r[1], t => `Bien la cuenta d(0) · q(0) + r(0). Pero d(0) vale ${z(d[2])}, con su signo; cambiado da ${t}.`),
        en('TAL-PIDE', r[1], t => `Bien que n sale de los términos sin x. Pero ${t} es solo r(0): falta d(0) · q(0).`),
      ],
      solucion: [['n es el término independiente de D: D(0) = d(0) · q(0) + r(0).'], [`n = ${par(d[2])} · ${par(q[2])} + ${par(r[1])} = `, f(Dd[4]), '.']],
      _datos: { d, q, r },
    };
  }

  // ======================= Idea 2: división clásica y Horner =======================
  function primerTermino(rng) {
    const c = rng.elegir([2, 3, 4]), m = rng.entero(2, 3), ex = rng.entero(m + 1, m + 3), k = noCero(rng, -4, 5), A = c * k;
    const dc = Array(m + 1).fill(0); dc[0] = c; dc[m - 1] = noCero(rng, -5, 5); dc[m] = noCero(rng, -6, 6);
    const Dc = Array(ex + 1).fill(0); Dc[0] = A; Dc[ex - 2] = noCero(rng, -7, 7); Dc[ex] = noCero(rng, -5, 5);
    if (A === 6 && ex === 4 && c === 2) return null;   // la predicción de la idea
    return {
      enunciado: [`Se divide ${poli(Dc)} entre `, Td(poli(dc)), '.'], pregunta: ['¿Cuál es el primer término del cociente?'],
      datos: [D.primero, D.potDiv], correcta: term(k, ex - m),
      errores: [
        e('TAL-COEF-PRINC', term(A, ex - m), t => `Bien el exponente, ${ex} − ${m}. Pero el ${z(A)} también se divide entre ${c}; sin dividir queda ${t}.`),
        e('TAL-EXP-SUMA', term(k, ex + m), t => `Bien ${z(A)} ÷ ${c}. Pero al dividir potencias los exponentes se restan; sumarlos da ${t}.`),
        e('TAL-COEF-RESTA', A - c === 0 ? null : term(A - c, ex - m), t => `Bien el exponente. Pero los coeficientes se dividen; restarlos da ${t}.`),
        e('TAL-EXP-DIVIDE', ex % m === 0 && ex / m !== ex - m ? term(k, ex / m) : null, t => `Bien ${z(A)} ÷ ${c}. Pero los exponentes se restan, no se dividen: así sale ${t}.`),
      ],
      solucion: [['Se divide el primer término de D entre el primero de d.'], [`${term(A, ex)} ÷ `, Td(term(c, m)), ' = ', Tq(term(k, ex - m)), '.']],
      _datos: { A, ex, c, m },
    };
  }
  function coefQ(rng) {
    const d = [1, noCero(rng, -3, 3), noCero(rng, -4, 4)], q = [rng.entero(1, 3), noCero(rng, -4, 4), rng.entero(-4, 4)], r = [noCero(rng, -5, 5), rng.entero(-6, 6)];
    const Dd = sumar(mult(d, q), r);
    if (Dd[1] === q[1] || Dd[1] + q[0] * d[1] === q[1]) return null;
    return {
      enunciado: [`Se divide ${poli(Dd)} entre `, Td(poli(d)), '.'], pregunta: ['¿Cuál es el coeficiente de x en el cociente?'],
      datos: [D.ident, D.paso], correcta: q[1],
      errores: [
        en('TAL-HORNER-SUMA', Dd[1] + q[0] * d[1], t => `Bien el primer término de q, ${term(q[0], 2)}. Pero al restarlo por d la columna de x³ baja; sumar da ${t}.`),
        en('TAL-COPIA-D', Dd[1], t => `Bien la columna de x³. Pero antes hay que restarle ${term(q[0], 2)} · d; sin restar queda ${t}.`),
        en('TAL-PIDE', q[0], t => `Bien: ${t} es el coeficiente de x², el primero de q. Piden el de x.`),
        en('TAL-PIDE', q[2], t => `Bien la división. Pero ${t} es el término independiente de q; piden el coeficiente de x.`),
      ],
      solucion: [[`x⁴ ÷ x² da ${term(q[0], 2)}; al restar ${term(q[0], 2)} · d, la columna de x³ queda en ${z(q[1])}.`], ['El coeficiente de x en el cociente es ', Tq(z(q[1])), '.']],
      _datos: { d, q, r },
    };
  }
  function restoCuad(rng) {
    const d = [1, noCero(rng, -3, 3), noCero(rng, -3, 3)], q = [1, noCero(rng, -3, 3)], r = [noCero(rng, -5, 5), noCero(rng, -6, 6)];
    const Dd = sumar(mult(d, q), r);
    if (Dd.some(c => c === 0)) return null;
    const mal = (() => { const cur = Dd.slice(); d.forEach((u, i) => { cur[i] += u; }); const c2 = cur[1] / d[0]; d.forEach((u, i) => { cur[1 + i] -= c2 * u; }); return sinCeros(cur.slice(2)); })();
    return {
      enunciado: [`Se divide ${poli(Dd)} entre `, Td(poli(d)), '.'], pregunta: ['¿Cuál es el resto?'],
      datos: [D.ident, D.paso], correcta: poli(r),
      errores: [
        e('TAL-RESTA-AL-REVES', poli(r.map(x => -x)), t => `Bien las columnas. Pero lo que queda es D − d · q, no d · q − D; al revés da ${t}.`),
        e('TAL-HORNER-SUMA', poli(mal), t => `Bien el primer término de q. Pero x · d se resta; sumarlo da ${t}.`),
        e('TAL-UNA-RESTA', poli([r[0], Dd[3]]), t => `Bien la columna de x. Pero la última también se resta; si no, queda ${t}.`),
        e('TAL-PIDE', poli(q), t => `Bien la división. Pero ${t} es el cociente; piden el resto.`),
      ],
      solucion: [['Se divide hasta que lo que queda tiene grado 1.'], [`${poli(Dd)} = (`, Td(poli(d)), ')(', Tq(poli(q)), ') + (', Tr(poli(r)), ').']],
      _datos: { d, q, r },
    };
  }
  function exactaMN(rng) {
    const d = [1, noCero(rng, -2, 2), noCero(rng, -3, 3)], q = [1, rng.entero(-3, 3), rng.entero(-3, 3)];
    const bas = mult(d, q).slice(0, 3);
    let rho = dividir(bas.concat([0, 0]), d).r; if (rho.length < 2) rho = [0, ...rho];
    if (rho[0] === 0 || rho[1] === 0 || rho[0] === rho[1] || rho[0] === -rho[1]) return null;
    const m = -rho[0], n = -rho[1];
    return {
      enunciado: [`La división de ${poli(bas.concat([0, 0]))} + mx + n entre `, Td(poli(d)), ' es exacta.'], pregunta: ['¿Cuánto vale m + n?'],
      datos: [D.ident, D.exacta, D.paso], correcta: m + n,
      errores: [
        en('AL16', -(m + n), t => `Bien el resto (${z(rho[0])} + m)x + (${z(rho[1])} + n). Pero al igualar a 0, m y n cambian de signo; si no, da ${t}.`),
        en('TAL-SOLO-UNO', m, t => `Bien m = ${t}. Pero piden m + n: falta n = ${z(n)}.`),
        en('TAL-PIDE', m * n === m + n ? NaN : m * n, t => `Bien m = ${z(m)} y n = ${z(n)}. Pero piden la suma; el producto es ${t}.`),
        en('TAL-SOLO-UNO', n, t => `Bien n = ${t}. Pero piden m + n: falta m = ${z(m)}.`),
      ],
      solucion: [[`Sin m ni n, la división deja (${z(rho[0])})x + (${z(rho[1])}). m y n deben volver 0 ese resto.`], [`m = ${z(m)}, n = ${z(n)}, m + n = `, f(m + n), '.']],
      _datos: { d, bas, m, n },
    };
  }

  // ======================= Idea 3: regla de Ruffini =======================
  function casilla(rng) {
    const cs = [noCero(rng, -3, 3), rng.entero(-4, 4), rng.entero(-5, 5), rng.entero(-6, 6)], a = noCero(rng, -3, 3), b = ruffini(cs, a), k = rng.entero(1, 3);
    const nom = ['', 'segunda', 'tercera', 'cuarta'][k];
    return {
      enunciado: [`Se arma la tabla de Ruffini de ${poli(cs)} entre `, Td(div(a)), '.'], pregunta: [`¿Qué número va en la ${nom} casilla de la fila de abajo?`],
      datos: [D.casilla, a < 0 ? `${div(a)} = x − (${z(a)})` : `${div(a)} se anula en x = ${a}`], correcta: b[k],
      errores: [
        en('PO2', ruffini(cs, -a)[k], t => `Bien la cuenta de la tabla. Pero ${div(a)} se anula en ${z(a)}, no en ${z(-a)}: así sale ${t}.`),
        en('TAL-RUF-PRODUCTO', a * b[k - 1], t => `Bien ${par(a)} · ${par(b[k - 1])} = ${t}. Pero falta sumarle el ${z(cs[k])} de arriba.`),
        en('TAL-RUF-BAJA', cs[k], t => `Bien leído el de arriba, ${t}. Pero solo el primero se baja tal cual.`),
        en('TAL-RUF-SUMA-A', cs[k] + a + b[k - 1], t => `Bien el de arriba y la anterior. Pero a multiplica, no se suma: sumar da ${t}.`),
      ],
      solucion: [['El de arriba más a por la casilla anterior.'], [`${z(cs[k])} + `, Ta(par(a)), ` · ${par(b[k - 1])} = `, Tq(z(b[k])), '.']],
      _datos: { cs, a, k },
    };
  }
  function cocienteRuf(rng) {
    const cs = [noCero(rng, -2, 3), rng.entero(-4, 4), rng.entero(-5, 5), noCero(rng, -6, 6)], a = noCero(rng, -3, 3), b = ruffini(cs, a);
    return {
      enunciado: [`Con la tabla de Ruffini se divide ${poli(cs)} entre `, Td(div(a)), '.'], pregunta: ['¿Cuál es el cociente?'],
      datos: [D.casilla, D.filaQ, a < 0 ? `${div(a)} = x − (${z(a)})` : `${div(a)} se anula en x = ${a}`], correcta: poli(b.slice(0, -1)),
      errores: [
        e('PO2', poli(ruffini(cs, -a).slice(0, -1)), t => `Bien la tabla. Pero ${div(a)} se anula en ${z(a)}; con ${z(-a)} sale ${t}.`),
        e('TAL-RESTO-EN-Q', poli(b), t => `Bien las casillas. Pero la última es el resto: con ella queda ${t}, un grado de más.`),
        e('TAL-RUF-BAJA', poli(cs.slice(0, -1)), t => `Bien que el cociente baja un grado. Pero sus coeficientes son los de abajo: los de arriba dan ${t}.`),
      ],
      solucion: [[`Abajo quedan ${b.map(z).join(', ')}. Las casillas menos la última son el cociente.`], ['q = ', Tq(poli(b.slice(0, -1))), '.']],
      _datos: { cs, a },
    };
  }
  function restoRuf(rng) {
    const cs = [noCero(rng, -2, 3), 0, noCero(rng, -5, 5), rng.entero(-6, 6)];
    if (rng.entero(0, 1)) cs.splice(1, 0, noCero(rng, -3, 3));
    const a = noCero(rng, -3, 3), b = ruffini(cs, a), sin0 = ruffini(cs.filter((c, i) => c !== 0 || i === 0), a);
    if (poli(cs) === '2x³ − 5x + 1' && a === 2) return null;   // la predicción de la idea
    return {
      enunciado: [`Con la tabla de Ruffini se divide ${poli(cs)} entre `, Td(div(a)), '.'], pregunta: ['¿Cuál es el resto?'],
      datos: [D.casilla, D.cero, D.filaQ], correcta: b[b.length - 1],
      errores: [
        en('PO1', sin0[sin0.length - 1], t => `Bien las cuentas. Pero falta la casilla con 0 de la potencia que no está: sin ella sale ${t}.`),
        en('PO2', ruffini(cs, -a)[cs.length - 1], t => `Bien la tabla. Pero ${div(a)} se anula en ${z(a)}; con ${z(-a)} sale ${t}.`),
        en('PO27', cs[cs.length - 1], t => `Bien que el resto va al final. Pero es la última casilla de abajo, no el ${t} de arriba.`),
        en('TAL-RUF-PRODUCTO', a * b[b.length - 2], t => `Bien el último producto, ${t}. Pero falta sumarle el ${z(cs[cs.length - 1])} de arriba.`),
      ],
      solucion: [[`Con 0 en la potencia que falta, abajo quedan ${b.map(z).join(', ')}.`], ['La última casilla es el resto: ', Tr(z(b[b.length - 1])), '.']],
      _datos: { cs, a },
    };
  }
  function sumaQ(rng) {
    const cs = [1, rng.entero(-3, 3), rng.entero(-4, 4), rng.entero(-4, 4), noCero(rng, -6, 6)], a = -rng.entero(1, 3), b = ruffini(cs, a);
    const s = b.slice(0, -1).reduce((x, y) => x + y, 0);
    return {
      enunciado: [`Se divide ${poli(cs)} entre `, Td(div(a)), '.'], pregunta: ['¿Cuánto suman los coeficientes del cociente?'],
      datos: [D.casilla, `${div(a)} = x − (${z(a)})`, D.filaQ], correcta: s,
      errores: [
        en('TAL-RESTO-EN-Q', s + b[4], t => `Bien la fila de abajo. Pero la última casilla es el resto; con ella suma ${t}.`),
        en('PO2', ruffini(cs, -a).slice(0, -1).reduce((x, y) => x + y, 0), t => `Bien la suma. Pero ${div(a)} se anula en ${z(a)}; con ${z(-a)} da ${t}.`),
        en('PO7', evaluar(cs, 1), t => `Esa es la suma de coeficientes de D, ${t}. Piden la del cociente, que sale de la tabla.`),
        en('TAL-PIDE', b[4], t => `Bien la tabla. Pero ${t} es el resto; piden la suma de los coeficientes del cociente.`),
      ],
      solucion: [[`Abajo quedan ${b.map(z).join(', ')}; las cuatro primeras son el cociente.`], [b.slice(0, -1).map(par).join(' + '), ' = ', Tq(f(s)), '.']],
      _datos: { cs, a },
    };
  }

  // ======================= Idea 4: divisor cx + b =======================
  function casoK(rng, entero) {
    const c = rng.elegir([2, 3]); let b;
    do { b = noCero(rng, -6, 6); } while (entero ? b % c !== 0 : b % c === 0);
    const Q = [noCero(rng, -3, 3), rng.entero(-4, 4), rng.entero(-4, 4)], R = noCero(rng, -6, 6);
    return { c, b, Q, R, Dd: sumar(mult([c, b], Q), [R]), x0: fr(-b, c) };
  }
  function cocienteK(rng) {
    const k = casoK(rng, rng.entero(0, 2) > 0);
    return {
      enunciado: [`Se divide ${poli(k.Dd)} entre `, Td(poli([k.c, k.b])), '.'], pregunta: ['¿Cuál es el cociente?'],
      datos: [D.falso, D.cocK, D.casilla], correcta: poli(k.Q),
      errores: [
        e('PO3', poli(k.Q.map(x => x * k.c)), t => `Bien la tabla con x = ${k.x0}. Pero ${t} es el cociente falso: falta dividirlo entre ${k.c}.`),
        e('TAL-K-MULT', poli(k.Q.map(x => x * k.c * k.c)), t => `Bien la tabla. Pero el cociente falso se divide entre ${k.c}; multiplicarlo da ${t}.`),
        e('TAL-RESTO-EN-Q', poli(sumar(k.Q, [k.R])), t => `Bien el cociente. Pero el ${z(k.R)} del final es el resto; sumarlo da ${t}.`),
      ],
      solucion: [[`${poli([k.c, k.b])} se anula en x = ${k.x0}. La tabla da el cociente falso ${poli(k.Q.map(x => x * k.c))}.`], ['Entre ', Ta(String(k.c)), ': q = ', Tq(poli(k.Q)), '.']],
      _datos: { c: k.c, b: k.b, Q: k.Q, R: k.R },
    };
  }
  function restoK(rng) {
    const k = casoK(rng, false), enC = evaluar(k.Dd, k.c);
    return {
      enunciado: [`Se divide ${poli(k.Dd)} entre `, Td(poli([k.c, k.b])), '.'], pregunta: ['¿Cuál es el resto?'],
      datos: [D.falso, D.cocK, D.casilla], correcta: k.R,
      errores: [
        en('PO4', k.R % k.c === 0 ? k.R / k.c : NaN, t => `Bien la última casilla, ${z(k.R)}. Pero el resto no se divide entre ${k.c}; dividirlo da ${t}.`),
        en('TAL-EVAL-COEF', Math.abs(enC) > 999 ? NaN : enC, t => `Bien la idea de evaluar. Pero en x = ${k.x0}, que anula al divisor, no en ${k.c}: así sale ${t}.`),
        en('PO27', k.Dd[3], t => `Bien que el resto es un número. Pero es la última casilla de abajo, no el ${t} de D.`),
        en('TAL-EVAL-COEF', Math.abs(evaluar(k.Dd, -k.b)) > 999 ? NaN : evaluar(k.Dd, -k.b), t => `Bien la idea de evaluar. Pero en x = ${k.x0}, no en ${z(-k.b)}: así sale ${t}.`),
      ],
      solucion: [[`La tabla con x = ${k.x0}; su última casilla es el resto, sin dividir.`], ['r = ', Tr(z(k.R)), '.']],
      _datos: { c: k.c, b: k.b, Q: k.Q, R: k.R },
    };
  }
  function sumaK(rng) {
    const k = casoK(rng, rng.entero(0, 1) > 0), s = k.Q.reduce((x, y) => x + y, 0);
    if (s === 0) return null;
    return {
      enunciado: [`Se divide ${poli(k.Dd)} entre `, Td(poli([k.c, k.b])), '.'], pregunta: ['¿Cuánto suman los coeficientes del cociente?'],
      datos: [D.falso, D.cocK, D.casilla], correcta: s,
      errores: [
        en('PO3', s * k.c, t => `Bien la suma de la tabla. Pero es la del cociente falso, ${t}: falta dividirla entre ${k.c}.`),
        en('TAL-RESTO-EN-Q', s + k.R, t => `Bien el cociente. Pero el resto no es parte de él; con el resto suma ${t}.`),
        en('TAL-K-DOBLE', s % k.c === 0 ? s / k.c : NaN, t => `Bien dividir entre ${k.c}. Pero una sola vez: dos veces da ${t}.`),
        en('PO7', evaluar(k.Dd, 1), t => `Esa es la suma de coeficientes de D, ${t}. Piden la del cociente.`),
      ],
      solucion: [[`El cociente es ${poli(k.Q)}: el cociente falso entre ${k.c}.`], [k.Q.map(par).join(' + '), ' = ', Tq(f(s)), '.']],
      _datos: { c: k.c, b: k.b, Q: k.Q, R: k.R },
    };
  }
  function cocienteFrac(rng) {
    const c = 2, b = rng.elegir([-1, 1]), Q = [noCero(rng, -3, 3), rng.entero(-3, 3), rng.entero(-3, 3), noCero(rng, -4, 4)], R = noCero(rng, -5, 5);
    const Dd = sumar(mult([c, b], Q), [R]);
    if (Dd[0] === 0) return null;
    return {
      enunciado: [`Se divide ${poli(Dd)} entre `, Td(poli([c, b])), '.'], pregunta: ['¿Cuál es el cociente?'],
      datos: [D.falso, D.cocK, D.casilla], correcta: poli(Q),
      errores: [
        e('PO3', poli(Q.map(x => x * c)), t => `Bien la tabla con x = ${fr(-b, c)}. Pero ${t} es el cociente falso: falta dividir entre 2.`),
        e('TAL-RESTO-EN-Q', poli(sumar(Q, [R])), t => `Bien el cociente. Pero el ${z(R)} es el resto; sumarlo da ${t}.`),
        e('PO2', poli(Q.map((x, i) => (i % 2 ? -x : x))), t => `Bien la idea. Pero ${poli([c, b])} se anula en ${fr(-b, c)}, no en ${fr(b, c)}: así sale ${t}.`),
      ],
      solucion: [[`La tabla con x = ${fr(-b, c)} da ${poli(Q.map(x => x * c))}.`], ['Entre ', Ta('2'), ': q = ', Tq(poli(Q)), '.']],
      _datos: { c, b, Q, R },
    };
  }

  // ======================= Idea 5: teorema del resto =======================
  function restoT(rng) {
    const cs = [noCero(rng, -2, 3), rng.entero(-4, 4), rng.entero(-4, 4), noCero(rng, -6, 6)], a = noCero(rng, -3, 3);
    return {
      enunciado: [`Se divide P(x) = ${poli(cs)} entre `, Td(div(a)), '.'], pregunta: ['¿Cuál es el resto?'],
      datos: a < 0 ? [D.teo, `${div(a)} = x − (${z(a)})`] : [D.teo], correcta: evaluar(cs, a),
      errores: [
        en('PO8', evaluar(cs, -a), t => `Bien la idea de evaluar. Pero ${div(a)} vale 0 con x = ${z(a)}; en ${z(-a)} da ${t}.`),
        en('PO27', cs[3], t => `Bien que el resto es un número. Pero ${t}, el término independiente, sería el resto entre x.`),
        en('PO7', evaluar(cs, 1), t => `${t} es la suma de coeficientes, P(1): sería el resto entre x − 1.`),
      ],
      solucion: [[`El resto es P(${z(a)}).`], [`P(${z(a)}) = `, Tr(z(evaluar(cs, a))), '.']],
      _datos: { cs, a },
    };
  }
  function restoNeg(rng) {
    const n = rng.entero(4, 7), m = n - 1 - 2 * rng.entero(0, Math.floor((n - 3) / 2)), A = noCero(rng, -3, 3), B = noCero(rng, -5, 5), C = noCero(rng, -6, 6);
    const cs = Array(n + 1).fill(0); cs[0] = 1; cs[n - m] += A; cs[n - 1] += B; cs[n] = C;
    const a = -rng.entero(1, 2), bien = evaluar(cs, a);
    const parMal = cs.reduce((acc, c, k) => { const ex = n - k; return acc + c * (ex % 2 === 0 && ex > 0 ? -(Math.abs(a) ** ex) : a ** ex); }, 0);
    return {
      enunciado: [`Se divide P(x) = ${poli(cs)} entre `, Td(div(a)), '.'], pregunta: ['¿Cuál es el resto?'],
      datos: [D.teo, `${div(a)} = x − (${z(a)})`, D.neg], correcta: bien,
      errores: [
        en('PO15', parMal, t => `Bien el reemplazo por ${z(a)}. Pero una potencia par de un negativo es positiva; si no, da ${t}.`),
        en('PO8', evaluar(cs, -a), t => `Bien la idea de evaluar. Pero ${div(a)} vale 0 con x = ${z(a)}; en ${z(-a)} da ${t}.`),
        en('PO27', C, t => `Bien que el resto es un número. Pero ${t}, el término independiente, sería el resto entre x.`),
      ],
      solucion: [[`El resto es P(${z(a)}), con cada potencia con su signo.`], [`P(${z(a)}) = `, Tr(z(bien)), '.']],
      _datos: { cs, a },
    };
  }
  function divisible(rng) {
    let a, m, c, dd;
    do { a = noCero(rng, -3, 3); m = noCero(rng, -4, 4); c = rng.entero(-5, 5); dd = -(a ** 3 + m * a * a + c * a); } while (dd === 0 || dd === m || dd === -m || Math.abs(dd) > 40);
    const mMal = (-((-a) ** 3) - c * (-a) - dd) / (a * a);
    const txt = `x³ + mx²${c === 0 ? '' : ` ${c < 0 ? '−' : '+'} ${Math.abs(c) === 1 ? '' : Math.abs(c)}x`} ${dd < 0 ? '−' : '+'} ${Math.abs(dd)}`;
    return {
      enunciado: [`El polinomio ${txt} es divisible entre `, Td(div(a)), '.'], pregunta: ['¿Cuánto vale m?'],
      datos: [D.teo, 'Divisible: la división es exacta, con resto 0'], correcta: m,
      errores: [
        en('PO17', Number.isInteger(mMal) ? mMal : NaN, t => `Bien plantear resto 0. Pero ${div(a)} vale 0 con x = ${z(a)}; con ${z(-a)} sale ${t}.`),
        en('AL16', -m, t => `Bien la ecuación P(${z(a)}) = 0. Pero al despejar m cambió el signo: así da ${t}.`),
        en('PO27', dd, t => `Bien leído el término independiente, ${t}. Pero m sale de P(${z(a)}) = 0.`),
      ],
      solucion: [[`Divisible: P(${z(a)}) = 0.`], [`${z(a ** 3)} + ${z(a * a)}m ${c * a + dd < 0 ? '−' : '+'} ${Math.abs(c * a + dd)} = 0, así que m = ${z(m)}.`]],
      _datos: { a, c, dd },
    };
  }
  function restoDos(rng) {
    let a, b, m, n;
    do { a = noCero(rng, -3, 3); b = noCero(rng, -3, 3); m = noCero(rng, -4, 4); n = noCero(rng, -5, 5); } while (a === b || a === -b || m === n || m === -n);
    const Ra = m * a + n, Rb = m * b + n, ms = (Ra - Rb) / (b - a), ns = Ra + ms * a;
    return {
      enunciado: ['P(x) deja resto ', Tr(z(Ra)), ' al dividirlo entre ', Td(div(a)), ' y resto ', Tr(z(Rb)), ' entre ', Td(div(b)), '.'],
      pregunta: ['¿Cuál es el resto de dividir P(x) entre ', Td(`(${div(a)})(${div(b)})`), '?'],
      datos: [D.teo, D.cuad, D.grado1], correcta: poli([m, n]),
      errores: [
        e('TAL-RESTO-SUMA', z(Ra + Rb), t => `Bien los dos restos. Pero con un divisor de grado 2 el resto es mx + n, no ${t}.`),
        e('TAL-RESTO-CRUZA', poli([n, m]), t => `Bien m = ${z(m)} y n = ${z(n)}. Pero m va con x: cruzados dan ${t}.`),
        e('TAL-SIGNO-RAIZ', Number.isInteger(ms) && Number.isInteger(ns) ? poli([ms, ns]) : null, t => `Bien el sistema. Pero ${div(a)} vale 0 con x = ${z(a)}, no con ${z(-a)}: así sale ${t}.`),
        e('TAL-RESTO-SUMA', z(Ra * Rb), t => `Bien los dos restos. Pero no se multiplican: el resto es mx + n, no ${t}.`),
      ],
      solucion: [[`r(x) = mx + n, con r(${z(a)}) = ${z(Ra)} y r(${z(b)}) = ${z(Rb)}.`], [`m = ${z(m)} y n = ${z(n)}: r(x) = `, Tr(poli([m, n])), '.']],
      _datos: { a, b, Ra, Rb },
    };
  }
  function caja(rng) {
    const L = rng.elegir([24, 30, 36, 40]), A = rng.elegir([16, 20, 24]), k = rng.entero(2, Math.floor(A / 2) - 2);
    const V = x => x * (L - 2 * x) * (A - 2 * x);
    return {
      enunciado: [`Se cortan cuadrados de x cm de lado en las esquinas de una cartulina de ${L} cm por ${A} cm y se arma una caja sin tapa, de volumen V(x) cm³.`],
      pregunta: ['¿Cuál es el resto de dividir V(x) entre ', Td(div(k)), '?'],
      datos: [D.teo, D.caja], correcta: V(k),
      errores: [
        en('PO8', V(-k), t => `Bien la idea de evaluar. Pero ${div(k)} vale 0 con x = ${k}; en −${k} da ${t}.`),
        en('TAL-CAJA-UNA', k * (L - k) * (A - k), t => `Bien el alto, ${k}. Pero a cada lado se le quitan dos cuadrados, no uno: así da ${t}.`),
        en('TAL-CAJA-AREA', L * A, t => `Bien las medidas de la cartulina. Pero ${t} es su área; el resto es el volumen V(${k}).`),
        en('TAL-EXACTA', 0, t => `Bien que se usa el teorema del resto. Pero V(${k}) no es ${t}: la caja tiene volumen.`),
      ],
      solucion: [[`V(x) = x(${L} − 2x)(${A} − 2x). El resto entre ${div(k)} es V(${k}).`], [`V(${k}) = ${k} · ${L - 2 * k} · ${A - 2 * k} = `, Tr(f(V(k))), '.']],
      unidad: 'cm³',
      _datos: { L, A, k },
    };
  }

  // ======================= Idea 6: cocientes notables =======================
  const tk = (n, k, sg = 1) => `${sg < 0 ? '−' : ''}${lit(n - k)}${lit(k - 1, 'y')}` || '1';
  function termino(rng) {
    const n = rng.entero(5, 12), k = rng.entero(2, n - 1);
    return {
      enunciado: [`Se escribe el cociente de (x${sup(n)} − y${sup(n)}) ÷ (`, Td('x − y'), ').'], pregunta: [`¿Cuál es su término de lugar ${k}?`],
      datos: [D.tk], correcta: tk(n, k),
      errores: [
        e('TAL-TK-EXP', `${lit(n - k)}${lit(k, 'y')}`, t => `Bien el exponente de x. Pero y empieza en 0: en el lugar ${k} lleva ${k - 1}, no como en ${t}.`),
        e('TAL-TK-X', `${lit(n - k + 1)}${lit(k - 1, 'y')}`, t => `Bien el de y. Pero x baja desde ${n - 1}: ${t} tiene uno de más.`),
        e('TAL-CONTEO', tk(n, k + 1), t => `Bien la forma. Pero ${t} es el término de lugar ${k + 1}.`),
        e('TAL-CONTEO', tk(n, k - 1), t => `Bien la forma. Pero ${t} es el término de lugar ${k - 1}.`),
      ],
      solucion: [[`En el lugar ${k}, x lleva ${n} − ${k} e y lleva ${k} − 1.`], [`t${sup(k)}`.replace(/t.*/, `término ${k}: `), Tq(tk(n, k)), '.']],
      _datos: { n, k },
    };
  }
  function signos(rng) {
    const n = 2 * rng.entero(2, 6) + 1, k = rng.entero(2, n - 1), sg = k % 2 ? 1 : -1;
    return {
      enunciado: [`Se escribe el cociente de (x${sup(n)} + y${sup(n)}) ÷ (`, Td('x + y'), ').'], pregunta: [`¿Cuál es su término de lugar ${k}?`],
      datos: [D.tk, D.alterna], correcta: tk(n, k, sg),
      errores: [
        e('TAL-TK-SIGNO', tk(n, k, -sg), t => `Bien los exponentes. Pero con x + y los lugares impares van con + y los pares con −: no ${t}.`),
        e('TAL-TK-EXP', `${sg < 0 ? '−' : ''}${lit(n - k)}${lit(k, 'y')}`, t => `Bien el signo. Pero y empieza en 0: en el lugar ${k} lleva ${k - 1}, no como en ${t}.`),
        e('TAL-CONTEO', tk(n, k + 1, -sg), t => `Bien la forma. Pero ${t} es el término de lugar ${k + 1}.`),
      ],
      solucion: [[`Exponentes: x lleva ${n - k} e y lleva ${k - 1}. El lugar ${k} es ${k % 2 ? 'impar: signo +' : 'par: signo −'}.`], [`Término ${k}: `, Tq(tk(n, k, sg)), '.']],
      _datos: { n, k },
    };
  }
  function numTerminos(rng) {
    let p, s, N;
    do { p = rng.entero(2, 5); s = rng.entero(1, 4); N = rng.entero(4, 10); } while (p === s);
    return {
      enunciado: [`Se divide x${sup(p * N)} − ${lit(s * N, 'y')} entre `, Td(`x${sup(p)} − ${lit(s, 'y')}`), '.'], pregunta: ['¿Cuántos términos tiene el cociente?'],
      datos: [D.nTerm, base(p, s)], correcta: N,
      errores: [
        en('TAL-NT-EXP', p * N, t => `Bien la idea. Pero ${t} es el exponente de x: los términos son ${p * N} ÷ ${p}.`),
        en('TAL-CONTEO-MAS', N + 1, t => `Bien ${p * N} ÷ ${p} = ${N}. Pero ese ya es el número de términos: no se suma 1; ${t} es uno de más.`),
        en('TAL-NT-EXP', s * N === N + 1 || s * N === p * N ? NaN : s * N, t => `Bien la idea. Pero ${t} es el exponente de y: los términos son ${s * N} ÷ ${s}.`),
        en('TAL-CONTEO', N - 1, t => `Bien ${p * N} ÷ ${p} = ${N}. Pero ese es el número de términos; ${t} es uno de menos.`),
      ],
      solucion: [['Cada exponente del dividendo entre el del divisor da el número de términos.'], [`${p * N} ÷ ${p} = ${s * N} ÷ ${s} = `, Tq(f(N)), '.']],
      _datos: { p, s, N },
    };
  }
  function central(rng) {
    let p, s, N;
    do { p = rng.entero(2, 5); s = rng.entero(1, 4); N = 2 * rng.entero(2, 6) + 1; } while (p === s);
    const k = (N + 1) / 2, g = kk => p * (N - kk) + s * (kk - 1);
    return {
      enunciado: [`Se divide x${sup(p * N)} − ${lit(s * N, 'y')} entre `, Td(`x${sup(p)} − ${lit(s, 'y')}`), '.'], pregunta: ['¿Cuál es el grado del término central del cociente?'],
      datos: [D.tk, base(p, s), D.gradoT], correcta: g(k),
      errores: [
        en('TAL-CENTRAL-MAL', g(k - 1), t => `Bien la forma del término. Pero el central de ${N} términos es el de lugar ${k}; el ${k - 1} da ${t}.`),
        en('TAL-CENTRAL-MAL', g(k + 1), t => `Bien la forma del término. Pero el central de ${N} términos es el de lugar ${k}; el ${k + 1} da ${t}.`),
        en('TAL-GRADO-D', p * N + s * N, t => `Bien los exponentes. Pero ${t} es el grado del dividendo, no el de un término del cociente.`),
        en('TAL-TK-EXP', p * (N - k) + s * k, t => `Bien el lugar ${k}. Pero la segunda base lleva ${k} − 1; con ${k} da ${t}.`),
      ],
      solucion: [[`${N} términos: el central es el de lugar ${k}. Es (x${sup(p)})${sup(N - k)}(${lit(s, 'y')})${sup(k - 1)} = x${sup(p * (N - k))}${lit(s * (k - 1), 'y')}.`], ['Grado: ', Tq(f(g(k))), '.']],
      _datos: { p, s, N },
    };
  }
  function exponentes(rng) {
    let p, s, N, k;
    do { p = rng.entero(2, 4); s = rng.entero(2, 4); N = rng.entero(5, 9); k = rng.entero(2, N - 1); } while (p === s);
    const ex = p * (N - k), ey = s * (k - 1);
    return {
      enunciado: ['(xᵐ − yᵗ) ÷ (', Td(`x${sup(p)} − y${sup(s)}`), `) es un cociente notable y uno de sus términos es x${sup(ex)}y${sup(ey)}.`],
      pregunta: ['¿Cuánto vale m + t?'],
      datos: [D.tk, `${base(p, s)}, con n términos`], correcta: (p + s) * N,
      errores: [
        en('TAL-EXP-DIRECTO', ex + ey, t => `Bien leídos los exponentes del término. Pero m y t son los del dividendo; sumar ${ex} + ${ey} da ${t}.`),
        en('TAL-CONTEO', (p + s) * (N - 1), t => `Bien el lugar k = ${k}. Pero hay ${N} términos, no ${N - 1}: así sale ${t}.`),
        en('TAL-CONTEO-MAS', (p + s) * (N + 1), t => `Bien el lugar k = ${k}. Pero hay ${N} términos, no ${N + 1}: así sale ${t}.`),
        en('TAL-SOLO-UNO', p * N, t => `Bien m = ${t}. Pero piden m + t: falta t = ${s * N}.`),
      ],
      solucion: [[`De y: ${s}(k − 1) = ${ey}, k = ${k}. De x: ${p}(n − ${k}) = ${ex}, n = ${N} términos.`], [`m = ${p * N}, t = ${s * N}, m + t = `, Tq(f((p + s) * N)), '.']],
      _datos: { p, s, N, k },
    };
  }

  const CONSTRUIR = {
    'grado-q': gradoQ, 'grado-r': gradoR, reconstruir, 'suma-coef': sumaCoef, 'identidad-cero': identidadCero,
    'primer-termino': primerTermino, 'coef-q': coefQ, 'resto-cuad': restoCuad, 'exacta-mn': exactaMN,
    casilla, cociente: cocienteRuf, 'resto-ruf': restoRuf, 'suma-q': sumaQ,
    'cociente-k': cocienteK, 'resto-k': restoK, 'suma-k': sumaK, 'cociente-frac': cocienteFrac,
    resto: restoT, 'resto-neg': restoNeg, divisible, 'resto-dos': restoDos, caja,
    termino, signos, 'num-terminos': numTerminos, central, exponentes,
  };

  return { id: ID, titulo: 'División de polinomios', generar, TIPOS_POR_IDEA, NIVEL, TIPOS: Object.keys(CONSTRUIR) };
});
