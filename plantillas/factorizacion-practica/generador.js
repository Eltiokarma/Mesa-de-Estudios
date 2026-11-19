/*
 * Generador «Factorización»: la práctica de las seis ideas de algebra.factorizacion
 * (contenido/teoria/algebra/factorizacion.js). Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['factorizacion-practica']) y en Node (require). No usa ningún motor ni el código de la teoría: las
 * cuentas son productos y evaluaciones de polinomios con enteros chicos, hechas aquí.
 *
 * Propuesta: docs/etapa7/propuesta-algebra.md §7. El objeto, como en la teoría: los pisos del maestro Rubén en Juliaca
 * (losetas de x dm, valores de problema, sin fuente).
 *
 * Tipos por idea (TIPOS_POR_IDEA; nivel 1 un paso, 2 dos pasos, 3 de examen). generar(semilla, { idea }) da solo los de
 * esa idea; sin idea, las seis con el mismo peso.
 *   factor-comun    comun-dos (1; factor común con dos letras) · comun-uno (1; un término sale entero: el 1) · volteado
 *                   (2; binomio común con el signo cambiado) · agrupar (3; suma de los dos factores al agrupar)
 *   identidades     dif-cuad (1) · tcp (1) · cubos (2; el otro factor) · primos-ident (3; cuántos factores primos)
 *   aspa-simple     aspa-monico (1; un factor) · aspa-coef (2) · aspa-dos (2; dos letras, suma) · bicuad (3; trinomio en
 *                   x², suma de factores primos)
 *   aspa-doble      doble-factor (2) · doble-suma (2) · falta (2; doble especial) · especial-primos (3)
 *   teorema-factor  factor-signo (1) · cual-divisor (1) · suma-cubica (2) · principal (3; coeficiente principal 2 o 3,
 *                   San Marcos 2025-II)
 *   mcd-mcm         mcd (1) · mcm (1) · grado-mcm (2) · mcd-valor (3; San Marcos 2025-II) · mcm-dado (3; el otro
 *                   polinomio a partir del MCD y el MCM, San Marcos 2027-I)
 *
 * Notación: superíndices Unicode (x², y³), el signo menos tipográfico «−». La factorización es con coeficientes enteros;
 * los factores primos se cuentan distintos y sin la constante (lo dice el dato).
 * Colores: un color fijo por magnitud, el de la teoría: el factor que se saca o se prueba y el número que anula a P en
 * turquesa (s, a: i); el otro factor, el MCD y el MCM en violeta (o, m: f). Solo en la solución. Ni carmín ni verde.
 * Datos (contrato, punto 13): las identidades, el aspa, el teorema del factor y las reglas del MCD y el MCM, nunca el
 * paso hecho ni la respuesta.
 * Errores: los códigos de la teoría (AL8 y AL11, de docs/investigacion/algebra-funciones-ideas-erroneas.md; TAL-*,
 * hipótesis de diseño de la teoría). De todos los errores de un problema van 3 o 4, elegidos para que la correcta no sea
 * la central ni, si es un número, un extremo. Cada explicación empieza por lo que el alumno hizo bien y muestra lo que
 * da su error.
 * La práctica no repite ninguna Predice de la unidad (6x³ + 3x²; x⁴ − 16; 2x² + 7x + 3; x⁴ + 5x³ + 9x² + 7x + 2;
 * x³ + 2x² − 5x − 6 con P(−3) = 0; el MCD de x² − 1 y x² − 2x + 1).
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
  const ID = 'factorizacion-practica';
  const INV = 'docs/investigacion/algebra-funciones-ideas-erroneas.md';
  const TEO = 'contenido/teoria/algebra/factorizacion.js';
  const v = P.v;
  const f = x => P.formatear(x, 0);

  // ---- Escritura ----
  const SUPS = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const sup = s => [...String(s)].map(c => SUPS[c]).join('');
  const z = x => (x < 0 ? `−${-x}` : String(x));
  const par = x => (x < 0 ? `(−${-x})` : String(x));
  const lit = (e, L = 'x') => (e === 0 ? '' : e === 1 ? L : `${L}${sup(e)}`);
  function poli(cs) {
    const g = cs.length - 1, out = [];
    cs.forEach((c, i) => { if (c) { const e = g - i, m = Math.abs(c), cuerpo = `${m === 1 && e ? '' : m}${lit(e)}`; out.push(out.length ? ` ${c < 0 ? '−' : '+'} ${cuerpo}` : `${c < 0 ? '−' : ''}${cuerpo}`); } });
    return out.join('') || '0';
  }
  const mono = (c, p, q = 0) => `${c < 0 ? '−' : ''}${Math.abs(c) === 1 && (p || q) ? '' : Math.abs(c)}${lit(p)}${lit(q, 'y')}`;
  const suma = ts => ts.filter(t => t[0] !== 0).map((t, i) => (i === 0 ? mono(...t) : `${t[0] < 0 ? ' − ' : ' + '}${mono(Math.abs(t[0]), t[1], t[2])}`)).join('') || '0';
  const mcd = (a, b) => (b ? mcd(b, a % b) : Math.abs(a));
  const binx = a => (a === 0 ? 'x' : a > 0 ? `x − ${a}` : `x + ${-a}`);
  const lin = (m, p) => poli([m, p]);
  const evaluar = (cs, x) => cs.reduce((a, c) => a * x + c, 0);
  const mult = (A, B) => { const o = Array(A.length + B.length - 1).fill(0); A.forEach((a, i) => B.forEach((b, j) => { o[i + j] += a * b; })); return o; };
  const sumar = (A, B) => { const n = Math.max(A.length, B.length), a = Array(n - A.length).fill(0).concat(A), b = Array(n - B.length).fill(0).concat(B); return a.map((x, i) => x + b[i]); };
  const ruffini = (cs, a) => cs.reduce((b, c, i) => [...b, i ? c + a * b[i - 1] : c], []);
  const conPot = (t, e) => (e === 0 ? '' : e === 1 ? `(${t})` : `(${t})${sup(e)}`);
  const escribir = rows => { const t = rows.map(([fac, e]) => conPot(fac, e)).join(''); return t === '' ? '1' : /^\([^()]*\)$/.test(t) ? t.slice(1, -1) : t; };

  const VARS = {
    s: { nombre: 'el factor que se saca', color: 'i' }, a: { nombre: 'el número que anula a P', color: 'i' },
    o: { nombre: 'el otro factor', color: 'f' }, m: { nombre: 'el MCD o el MCM', color: 'f' },
  };
  const Ts = t => v('s', t), Ta = t => v('a', t), To = t => v('o', t), Tm = t => v('m', t);

  // ---- Errores: el respaldo sale del código ----
  const RESPALDO = { AL8: ['parcial', INV], AL11: ['parcial', INV] };
  const de = id => RESPALDO[id] || ['hipotesis', TEO];
  function e(id, texto, explicar) { if (texto === null || texto === undefined) return null; const [respaldo, fuente] = de(id); return { id, clave: texto, texto, explicacion: explicar(texto), respaldo, fuente }; }
  function en(id, valor, explicar) { if (!Number.isFinite(valor)) return null; const [respaldo, fuente] = de(id); return { id, valor, texto: f(valor), explicacion: explicar(f(valor)), respaldo, fuente }; }

  // ---- Datos que se repiten (herramientas, no el paso hecho) ----
  const D = {
    comun: 'Factor común: el mayor número que divide a todos los coeficientes, y cada letra con su menor exponente',
    dentro: 'Dentro del paréntesis va cada término dividido entre el factor común',
    divPot: 'xᵐ ÷ xⁿ = xᵐ⁻ⁿ, y x⁰ = 1',
    distrib: 'ab + ac = a(b + c)',
    agrupa: 'Agrupar: se juntan los términos de a dos y se saca el factor común de cada par',
    signo: 'b − a = −(a − b)',
    dif: 'a² − b² = (a + b)(a − b), con a y b los dos términos',
    tcp: 'a² ± 2ab + b² = (a ± b)²: el del medio es el doble producto',
    cubos: 'a³ + b³ = (a + b)(a² − ab + b²)',
    cubos2: 'a³ − b³ = (a − b)(a² + ab + b²)',
    cuenta: 'Factores primos: se cuentan los distintos; un número solo, como el 2 de 2x, no cuenta',
    sumaCuad: 'Con coeficientes enteros, a² + b² no se escribe como producto',
    aspa: 'Aspa: el primer término se parte en dos con x y el último en dos números; cada fila es un factor',
    cruz: 'Los productos en cruz tienen que sumar el término del medio',
    signos: 'Dos números de igual signo dan un producto positivo; de distinto signo, negativo',
    doble: 'Aspa doble: columnas x, y y número; las aspas x–y, y–número y x–número dan los términos del medio',
    especial: 'Doble especial: lo que falta en x² es el término en x² menos el cruce de los extremos',
    orden: 'El polinomio va ordenado: x⁴, x³, x², x y número; un término que falta va con 0',
    teo: 'Teorema del factor: si P(a) = 0, entonces x − a es un factor de P',
    valor: 'P(a): el valor de P cuando x vale a',
    cand: 'Números por probar: los divisores del término independiente, con + y con −',
    candQ: 'Si el coeficiente principal no es 1: también esos divisores entre los divisores del principal',
    ruf: 'Ruffini: se baja el primero; cada casilla es el de arriba más a por la anterior (a: el número que se prueba)',
    mcd: 'MCD: los factores comunes, cada uno con su menor exponente',
    mcm: 'MCM: todos los factores, cada uno con su mayor exponente',
    fact: 'Antes, cada polinomio se factoriza del todo',
    prod: 'MCD · MCM = P · Q, con todos mónicos (coeficiente principal 1)',
    grado: 'El grado de un producto es la suma de los grados de sus factores',
  };

  // ---- Tipos por idea ----
  const TIPOS_POR_IDEA = {
    'factor-comun': ['comun-dos', 'comun-uno', 'volteado', 'agrupar'],
    identidades: ['dif-cuad', 'tcp', 'cubos', 'primos-ident'],
    'aspa-simple': ['aspa-monico', 'aspa-coef', 'aspa-dos', 'bicuad'],
    'aspa-doble': ['doble-factor', 'doble-suma', 'falta', 'especial-primos'],
    'teorema-factor': ['factor-signo', 'cual-divisor', 'suma-cubica', 'principal'],
    'mcd-mcm': ['mcd', 'mcm', 'grado-mcm', 'mcd-valor', 'mcm-dado'],
  };
  const IDEAS = Object.keys(TIPOS_POR_IDEA);
  const IDEA_DE = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map(t => [t, i])));
  const NIVEL = {
    'comun-dos': 1, 'comun-uno': 1, volteado: 2, agrupar: 3,
    'dif-cuad': 1, tcp: 1, cubos: 2, 'primos-ident': 3,
    'aspa-monico': 1, 'aspa-coef': 2, 'aspa-dos': 2, bicuad: 3,
    'doble-factor': 2, 'doble-suma': 2, falta: 2, 'especial-primos': 3,
    'factor-signo': 1, 'cual-divisor': 1, 'suma-cubica': 2, principal: 3,
    mcd: 1, mcm: 1, 'grado-mcm': 2, 'mcd-valor': 3, 'mcm-dado': 3,
  };
  // Papel (regla 6; herramientas/papel-generador.js usa «papel-1» a «papel-8»): las seis ideas, de menos a más, con dos
  // preguntas del tipo de San Marcos al final.
  const PAPEL = { 'papel-1': 'comun-uno', 'papel-2': 'dif-cuad', 'papel-3': 'aspa-coef', 'papel-4': 'falta', 'papel-5': 'cual-divisor',
    'papel-6': 'mcm', 'papel-7': 'principal', 'papel-8': 'mcd-valor' };

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
  const elegirDe = (rng, l, k) => rng.barajar(l.slice()).slice(0, k);

  // ======================= Idea 1: factor común y agrupación =======================
  function comunDos(rng) {
    const g = rng.elegir([2, 3, 4, 5, 6]), k1 = rng.entero(1, 5), k2 = rng.entero(1, 5);
    if (mcd(k1, k2) !== 1 || k1 === k2) return null;
    const p1 = rng.entero(1, 4), p2 = rng.entero(1, 4), q1 = rng.entero(1, 4), q2 = rng.entero(1, 4);
    if (p1 === p2 || q1 === q2) return null;
    const sg = rng.elegir([1, -1]), Pt = suma([[g * k1, p1, q1], [sg * g * k2, p2, q2]]);
    const pm = Math.min(p1, p2), qm = Math.min(q1, q2), bien = mono(g, pm, qm);
    return {
      enunciado: [`Se saca todo el factor común de ${Pt}.`], pregunta: ['¿Cuál es ese factor común?'],
      datos: [D.comun], correcta: bien,
      errores: [
        e('TAL-COMUN-MAYOR', mono(g, Math.max(p1, p2), Math.max(q1, q2)), t => `Bien el número ${g}. Pero de cada letra va la menor potencia: ${t} no está en los dos términos.`),
        e('TAL-COMUN-COEF', mono(1, pm, qm), t => `Bien las letras de ${t}. Pero ${g * k1} y ${g * k2} tienen al ${g} común: también sale.`),
        e('TAL-COMUN-UNA', mono(g, pm), t => `Bien ${t}. Pero y también está en los dos términos.`),
        e('TAL-COMUN-SUMA', mono(g * (k1 + k2), pm, qm), t => `Bien las letras. Pero el número es el mayor que divide a los dos, no la suma: ${t}.`),
      ],
      solucion: [[`El mayor número que divide a ${g * k1} y ${g * k2} es ${g}; de x y de y, la menor potencia.`], [`Factor común: `, Ts(bien), '.']],
      _datos: { g, p1, p2, q1, q2, k1, k2 },
    };
  }
  function comunUno(rng) {
    const g = rng.elegir([2, 3, 4, 5, 7]), n = rng.entero(1, 3), d = rng.entero(1, 3), k = rng.entero(2, 4), sg = rng.elegir([1, -1]);
    if (g === 3 && n === 2 && d === 1 && k === 2 && sg === 1) return null;   // la predicción
    const A = g * k, s = sg > 0 ? '+' : '−', Pt = `${mono(A, n + d)} ${s} ${mono(g, n)}`;
    const bien = `${mono(g, n)}(${mono(k, d)} ${s} 1)`;
    return {
      enunciado: [`Rubén factoriza ${Pt} con todo su factor común afuera.`], pregunta: ['¿Cuál es la factorización?'],
      datos: [D.comun, D.dentro, D.divPot], correcta: bien,
      errores: [
        e('TAL-UNO-CERO', `${mono(g, n)}(${mono(k, d)})`, t => `Bien el ${mono(g, n)} afuera. Pero ${t} solo da ${mono(A, n + d)}: falta el 1 que deja ${mono(g, n)}.`),
        n > 1 || g > 1 ? e('TAL-COMUN-MENOR', `${mono(g, n - 1)}(${mono(k, d + 1)} ${s} x)`, t => `Bien el número ${g}. Pero en ${t} dentro queda una x común.`) : null,
        e('TAL-COMUN-COEF', `${lit(n)}(${mono(A, d)} ${s} ${g})`, t => `Bien la potencia ${lit(n)}. Pero en ${t} queda el ${g} común dentro.`),
        e('TAL-UNO-SIGNO', `${mono(g, n)}(${mono(k, d)} ${s === '+' ? '−' : '+'} 1)`, t => `Bien el 1. Pero ${t} cambia su signo: el término era ${s} ${mono(g, n)}.`),
        e('TAL-UNO-COEF', `${lit(n)}(${mono(A, d)})`, t => `Bien la potencia ${lit(n)}. Pero ${t} deja el ${g} común dentro y pierde el término ${mono(g, n)}.`),
      ],
      solucion: [[`${mono(g, n)} es un término entero: dividido entre sí mismo deja 1.`], [`${Pt} = `, Ts(mono(g, n)), '(', To(`${mono(k, d)} ${s} 1`), ').']],
      _datos: { g, n, d, k, sg },
    };
  }
  function volteado(rng) {
    const a = rng.entero(2, 9), m = rng.entero(2, 6), n = rng.entero(2, 9);
    if (m === n || mcd(m, n) !== 1) return null;
    const Pt = `${m}x(x − ${a}) − ${n}(${a} − x)`;
    // m x(x − a) − n(a − x) = m x(x − a) + n(x − a) = (x − a)(m x + n)
    return {
      enunciado: [`Se factoriza ${Pt}.`], pregunta: ['¿Cuál es la factorización?'],
      datos: [D.signo, D.distrib], correcta: `(x − ${a})(${m}x + ${n})`,
      errores: [
        e('TAL-SIGNO-BIN', `(x − ${a})(${m}x − ${n})`, t => `Bien x − ${a} común. Pero −(${a} − x) = +(x − ${a}): ${t} deja mal el signo del ${n}.`),
        e('TAL-SIGNO-DENTRO', `(x + ${a})(${m}x + ${n})`, t => `Bien ${m}x + ${n}. Pero el binomio común es x − ${a}, no el de ${t}.`),
        e('TAL-AGRUPA-CRUZ', `(${a} − x)(${m}x + ${n})`, t => `Bien que un binomio se voltea. Pero ${t} es −(x − ${a})(${m}x + ${n}): otro polinomio.`),
        e('TAL-PIDE', `${m}x(x − ${a})`, t => `Bien el primer término, ${t}. Pero falta el segundo: la factorización junta los dos.`),
        e('TAL-SIGNO-DENTRO', `(x + ${a})(${m}x − ${n})`, t => `Bien que el ${n} cambia. Pero en ${t} también cambia el ${a}: el binomio común es x − ${a}.`),
      ],
      solucion: [[`${a} − x = −(x − ${a}), así que −${n}(${a} − x) = +${n}(x − ${a}).`], [`${Pt} = `, Ts(`(x − ${a})`), To(`(${m}x + ${n})`), '.']],
      _datos: { a, m, n },
    };
  }
  function agrupar(rng) {
    const a = noCero(rng, -6, 6), b = noCero(rng, -7, 7), c = rng.elegir([1, 1, 2, 3]);
    if (Math.abs(a) === Math.abs(b) || mcd(c, b) !== 1 || (b < 0 && Number.isInteger(Math.sqrt(-b * c)))) return null;
    const T = mult([1, a], [c, 0, b]), Pt = poli(T);
    const sumaF = (u, w) => poli(sumar([c, 0, w], [1, u]));
    const bien = sumaF(a, b);
    return {
      enunciado: [`Al factorizar ${Pt} agrupando de a dos, salen dos factores.`], pregunta: ['¿Cuánto suman esos dos factores?'],
      datos: [D.agrupa, D.distrib], correcta: bien,
      errores: [
        e('TAL-AGRUPA-SIGNO', sumaF(a, -b), t => `Bien ${lin(1, a)} común. Pero del segundo par sale ${z(b)} con su signo; si no, suman ${t}.`),
        e('TAL-AGRUPA-CRUZ', sumaF(-a, b), t => `Bien ${poli([c, 0, b])}. Pero el binomio común es ${lin(1, a)}; con el otro signo suman ${t}.`),
        e('TAL-PIDE', poli([c, 0, a + b]), t => `Bien los números ${z(a)} y ${z(b)}. Pero ${lin(1, a)} trae su x: sin ella queda ${t}.`),
        e('TAL-AGRUPA-PROD', poli([c, 1, a * b]), t => `Bien los dos factores. Pero sus números se suman, no se multiplican: así queda ${t}.`),
      ],
      solucion: [[`Cada par deja ${lin(1, a)}: el polinomio es (${lin(1, a)})(${poli([c, 0, b])}).`], [`(${lin(1, a)}) + (${poli([c, 0, b])}) = `, To(bien), '.']],
      _datos: { a, b, c },
    };
  }

  // ======================= Idea 2: productos notables al revés =======================
  function difCuad(rng) {
    const p = rng.entero(2, 7), q = rng.entero(1, 9), dos = rng.elegir([false, true]);
    if (p === q) return null;
    const L = dos ? 'y' : '', A = `${p}x`, B = `${q}${L}`, Pt = `${p * p}x² − ${q * q}${dos ? 'y²' : ''}`;
    return {
      enunciado: [`Se factoriza ${Pt}.`], pregunta: ['¿Cuál es la factorización?'],
      datos: [D.dif], correcta: `(${A} + ${B})(${A} − ${B})`,
      errores: [
        e('AL8', `(${A} − ${B})²`, t => `Bien ${A} y ${B}. Pero ${t} tiene doble producto en el medio.`),
        e('TAL-SIN-RAIZ', `(${p * p}x + ${q * q}${L})(${p * p}x − ${q * q}${L})`, t => `Bien la suma por la diferencia. Pero ${t} usa ${p * p} en vez de ${p}: ${p * p}x² es (${A})².`),
        e('TAL-RAIZ-UNA', `(${A} + ${q * q}${L})(${A} − ${q * q}${L})`, t => `Bien ${A}. Pero en ${t} el ${q * q} queda sin pasar a ${q}.`),
        e('TAL-IDENTIDAD', `(${A} + ${B})²`, t => `Bien ${A} y ${B}. Pero ${t} es una suma al cuadrado: tiene término del medio.`),
      ],
      solucion: [[`Es un cuadrado menos otro: (${A})² − (${B})².`], [`${Pt} = `, Ts(`(${A} + ${B})`), To(`(${A} − ${B})`), '.']],
      _datos: { p, q, dos },
    };
  }
  function tcp(rng) {
    const a = rng.entero(1, 5), b = rng.entero(1, 9), sg = rng.elegir([1, -1]);
    if (a === 1 && b === 3 && sg === 1) return null;
    const A = a === 1 ? 'x' : `${a}x`, s = sg > 0 ? '+' : '−', o = sg > 0 ? '−' : '+', Pt = poli([a * a, sg * 2 * a * b, b * b]);
    return {
      enunciado: [`Se factoriza ${Pt}.`], pregunta: ['¿Cuál es la factorización?'],
      datos: [D.tcp, D.dif], correcta: `(${A} ${s} ${b})²`,
      errores: [
        e('TAL-IDENTIDAD', `(${A} + ${b})(${A} − ${b})`, t => `Bien ${A} y ${b}. Pero ${t} da ${poli([a * a, 0, -b * b])}, sin el del medio.`),
        e('TAL-SIGNO', `(${A} ${o} ${b})²`, t => `Bien el binomio al cuadrado. Pero ${t} da el del medio con ${o}.`),
        e('TAL-2AB', `(${A} ${s} ${2 * b})²`, t => `Bien el binomio al cuadrado. Pero en ${t} el segundo término es ${2 * b}; al cuadrado da ${4 * b * b}.`),
        e('AL8', `${a === 1 ? '' : a * a}x² ${s} ${b * b}`, t => `Bien los cuadrados. Pero ${t} no es un producto, y le falta el del medio.`),
      ],
      solucion: [[`${a * a === 1 ? '' : a * a}x² y ${b * b} son cuadrados, y el del medio es 2 · ${A} · ${b}.`], [`${Pt} = `, Ts(`(${A} ${s} ${b})`), '².']],
      _datos: { a, b, sg },
    };
  }
  function cubos(rng) {
    const a = rng.elegir([1, 1, 2, 3]), b = rng.entero(1, 5), sg = rng.elegir([1, -1]);
    if (a === b || mcd(a, b) !== 1) return null;
    const A = a === 1 ? 'x' : `${a}x`, s = sg > 0 ? '+' : '−', o = sg > 0 ? '−' : '+';
    const Pt = `${a ** 3 === 1 ? '' : a ** 3}x³ ${s} ${b ** 3}`, ab = a * b === 1 ? '' : a * b, aa = a * a === 1 ? '' : a * a;
    const tri = (m, c) => `${aa}x² ${m} ${c}x + ${b * b}`;
    return {
      enunciado: [`Uno de los factores de ${Pt} es ${A} ${s} ${b}.`], pregunta: ['¿Cuál es el otro factor?'],
      datos: [D.cubos, D.cubos2], correcta: tri(o, ab),
      errores: [
        e('TAL-CUBO-SIGNO', tri(s, ab), t => `Bien los cuadrados. Pero en ${t} el del medio lleva el signo del binomio; va el contrario.`),
        e('TAL-CUBO-DOBLE', tri(o, 2 * a * b), t => `Bien los cuadrados. Pero ${t} pone ${2 * a * b}x: el del medio es ${A} · ${b}, sin el 2.`),
        e('TAL-CUBO-MEDIO', `${aa}x² + ${b * b}`, t => `Bien los cuadrados. Pero ${t} no tiene el del medio, ${A} · ${b}.`),
        e('TAL-CUBO-CUAD', `${aa}x² ${o} ${ab}x + ${b}`, t => `Bien ${aa}x² y el del medio. Pero el último es ${b}², no ${b}: queda ${t}.`),
      ],
      solucion: [[`Es ${A} al cubo ${sg > 0 ? 'más' : 'menos'} ${b} al cubo: el trinomio lleva los cuadrados y el producto con signo contrario.`], [`${Pt} = (${A} ${s} ${b})`, To(`(${tri(o, ab)})`), '.']],
      _datos: { a, b, sg },
    };
  }
  function primosIdent(rng) {
    const g = rng.entero(2, 5), ex = rng.entero(3, 4), k = rng.entero(1, 4), forma = rng.entero(0, 3);
    let Q, bien, inc, rep, nom;
    if (forma === 0) { Q = [1, 0, -k * k]; bien = 3; inc = 2; rep = ex + 2; nom = `x, x + ${k} y x − ${k}`; }
    else if (forma === 1) { Q = [1, 0, 0, 0, -(k ** 4)]; bien = 4; inc = 3; rep = ex + 3; nom = `x, x² + ${k * k}, x + ${k} y x − ${k}`; }
    else if (forma === 2) { Q = [1, 2 * k, k * k]; bien = 2; inc = 1; rep = ex + 2; nom = `x y x + ${k}`; }
    else { Q = [1, 0, 0, -(k ** 3)]; bien = 3; inc = 2; rep = ex + 2; nom = `x, x − ${k} y el trinomio x² + ${k === 1 ? '' : k}x + ${k * k}`; }
    const Pt = poli(mult([g, ...Array(ex).fill(0)], Q));
    return {
      enunciado: [`Se factoriza por completo ${Pt}.`], pregunta: ['¿Cuántos factores primos tiene?'],
      datos: [D.cuenta, forma === 2 ? D.tcp : forma === 3 ? D.cubos2 : D.dif, D.sumaCuad], correcta: bien,
      errores: [
        en('TAL-PRIMO-CONST', bien + 1, t => `Bien los factores con x. Pero el ${g} es un número solo: contarlo da ${t}.`),
        en(forma === 2 ? 'TAL-PRIMO-X' : 'TAL-INCOMPLETA', inc, t => (forma === 2 ? `Bien el binomio al cuadrado. Pero x también es un factor primo: ${t} se olvida de él.` : `Bien el factor común. Pero lo de adentro todavía se abre: ${t} se para antes.`)),
        en('TAL-PRIMO-REPITE', rep, t => `Bien los factores. Pero ${lit(ex)} es un solo factor primo, x: contar cada x da ${t}.`),
      ],
      solucion: [[`Sale ${g}${lit(ex)} y se abre lo de adentro.`], [`Factores primos: ${nom}: `, To(f(bien)), '.']],
      _datos: { g, ex, k, forma },
    };
  }

  // ======================= Idea 3: aspa simple =======================
  function aspaMonico(rng) {
    const m = rng.entero(2, 7), n = rng.entero(m + 1, 9);
    const Pt = poli([1, -(m + n), m * n]);
    const otro = [...Array(m * n).keys()].map(k => k + 1).find(d => (m * n) % d === 0 && d !== m && d !== n && d < (m * n) / d);
    if (!otro) return null;
    return {
      enunciado: [`Rubén factoriza ${Pt} con aspa.`], pregunta: ['¿Cuál de estos binomios es uno de sus factores?'],
      datos: [D.aspa, D.cruz, D.signos], correcta: binx(m),
      errores: [
        e('TAL-ASPA-SIGNO', binx(-m), t => `Bien ${m} · ${n} = ${m * n}. Pero el del medio es negativo: con ${t} saldría positivo.`),
        e('TAL-ASPA-MEDIO', binx(otro), t => `Bien que ${otro} divide a ${m * n}. Pero con ${t} y su pareja el cruce no da −${m + n}x.`),
        e('TAL-ASPA-SIGNO2', binx(-n), t => `Bien el ${n}. Pero ${t} lleva +: con ese signo el del medio saldría positivo.`),
      ],
      solucion: [[`${m * n} = (−${m})(−${n}) y en cruz −${m}x − ${n}x = −${m + n}x.`], [`${Pt} = `, Ts(`(${binx(m)})`), To(`(${binx(n)})`), '.']],
      _datos: { m, n },
    };
  }
  function aspaCoef(rng) {
    const p = rng.elegir([2, 3, 5]), q = noCero(rng, -5, 5), s = noCero(rng, -5, 5);
    if (Math.abs(q) === Math.abs(s) || mcd(p, q) !== 1) return null;
    const T = mult([p, q], [1, s]);
    if (T[1] === 0 || (p === 2 && q === 1 && s === 3)) return null;   // la predicción
    const Pt = poli(T), bien = `(${lin(p, q)})(${lin(1, s)})`, cruce = poli(mult([p, s], [1, q]));
    return {
      enunciado: [`Se factoriza ${Pt} con aspa.`], pregunta: ['¿Cuál es la factorización?'],
      datos: [D.aspa, D.cruz], correcta: bien,
      errores: [
        cruce !== Pt ? e('TAL-ASPA-CRUCE', `(${lin(p, s)})(${lin(1, q)})`, t => `Bien los números ${z(q)} y ${z(s)}. Pero ${t} da ${cruce}: el cruce cambia.`) : null,
        e('TAL-ASPA-PRINC', `(${lin(1, q)})(${lin(1, s)})`, t => `Bien los números. Pero ${t} empieza con x², no con ${p}x².`),
        e('TAL-ASPA-SIGNO', `(${lin(p, -q)})(${lin(1, -s)})`, t => `Bien los extremos. Pero ${t} da el del medio con el otro signo.`),
        e('TAL-ASPA-EXTREMO', `(${lin(p, q)})(${lin(p, s)})`, t => `Bien ${p}x en la primera fila. Pero ${t} empieza con ${p * p}x².`),
      ],
      solucion: [[`${p}x² = ${p}x · x y ${z(q * s)} = ${par(q)} · ${par(s)}; en cruz ${p}x · ${par(s)} + x · ${par(q)} = ${poli([T[1], 0])}.`], [`${Pt} = `, Ts(`(${lin(p, q)})`), To(`(${lin(1, s)})`), '.']],
      _datos: { p, q, s },
    };
  }
  const fac2 = (p, q) => `${p === 1 ? '' : p}x ${q < 0 ? '−' : '+'} ${Math.abs(q) === 1 ? '' : Math.abs(q)}y`;
  function aspaDos(rng) {
    const p = rng.elegir([1, 2, 3]), q = noCero(rng, -4, 4), s = noCero(rng, -5, 5);
    if (Math.abs(q) === Math.abs(s) || (p === 1 && q === s) || mcd(p, s) !== 1) return null;
    const B = p * q + s;
    if (B === 0) return null;
    const Pt = suma([[p, 2, 0], [B, 1, 1], [q * s, 0, 2]]);
    const sumaF = (u, w) => suma([[1 + p, 1, 0], [u + w, 0, 1]]);
    return {
      enunciado: [`${Pt} se factoriza con aspa en dos binomios.`], pregunta: ['¿Cuánto suman esos dos binomios?'],
      datos: [D.aspa, D.cruz], correcta: sumaF(q, s),
      errores: [
        e('TAL-ASPA-SIGNO', sumaF(-q, -s), t => `Bien los extremos. Pero con los signos cambiados el del medio sale al revés; suman ${t}.`),
        e('TAL-PIDE', suma([[q + s, 0, 1]]), t => `Bien los términos con y. Pero cada binomio trae su x: ${t} se olvida de ellas.`),
        e('TAL-ASPA-MEDIO', suma([[p, 1, 0], [q * s, 0, 1]]), t => `Bien el ${p === 1 ? '' : p}x. Pero se suman los dos binomios, no se multiplican sus números: ${t}.`),
        e('TAL-ASPA-UNO', suma([[p, 1, 0], [s, 0, 1]]), t => `Bien uno de los binomios, ${t}. Pero piden la suma de los dos.`),
      ],
      solucion: [[`${Pt} = (${fac2(1, q)})(${fac2(p, s)}): el cruce da el del medio.`], [`(${fac2(1, q)}) + (${fac2(p, s)}) = `, To(sumaF(q, s)), '.']],
      _datos: { p, q, s },
    };
  }
  function bicuad(rng) {
    const k = rng.entero(1, 5), l = rng.entero(1, 4);
    if (k === l) return null;
    const Pt = poli([1, 0, l * l - k * k, 0, -k * k * l * l]), bien = poli([1, 2, l * l]);
    return {
      enunciado: [`Se factoriza por completo ${Pt}, tomando x² como un solo término en el aspa.`], pregunta: ['¿Cuánto suman sus factores primos?'],
      datos: [D.aspa, D.dif, D.sumaCuad, D.cuenta], correcta: bien,
      errores: [
        e('TAL-INCOMPLETA', poli([2, 0, l * l - k * k]), t => `Bien (x² − ${k * k})(x² + ${l * l}). Pero x² − ${k * k} todavía se abre: ${t} se para antes.`),
        e('TAL-ASPA-SIGNO', poli([1, 2, -l * l]), t => `Bien la suma. Pero el ${l * l} va con +: ${t} lo cambia.`),
        e('TAL-PRIMO-SUMA', poli([4, 0]), t => `Bien x + ${k} y x − ${k}. Pero x² + ${l * l} no se abre: ${t} lo abre.`),
        e('TAL-ASPA-NUM', poli([1, 2, k * k]), t => `Bien los binomios. Pero el trinomio primo es x² + ${l * l}: ${t} pone otro número.`),
      ],
      solucion: [[`En x²: (x² − ${k * k})(x² + ${l * l}); el primero es una diferencia de cuadrados y el segundo no se abre.`], [`(x + ${k}) + (x − ${k}) + (x² + ${l * l}) = `, To(bien), '.']],
      _datos: { k, l },
    };
  }

  // ======================= Idea 4: aspa doble y doble especial =======================
  const tri3 = ([a, b, c]) => suma([[a, 1, 0], [b, 0, 1], [c, 0, 0]]);
  const prod3 = (F, G) => { const [a, b, c] = F, [d, ee, g] = G; return [a * d, a * ee + b * d, b * ee, a * g + c * d, b * g + c * ee, c * g]; };
  const seis = T => suma([[T[0], 2, 0], [T[1], 1, 1], [T[2], 0, 2], [T[3], 1, 0], [T[4], 0, 1], [T[5], 0, 0]]);
  function dosFactores(rng) {
    let F, G;
    do { F = [rng.elegir([1, 2, 3]), noCero(rng, -3, 3), noCero(rng, -4, 4)]; G = [1, noCero(rng, -3, 3), noCero(rng, -4, 4)]; }
    while (prod3(F, G).some(x => x === 0) || mcd(mcd(F[0], F[1]), F[2]) !== 1 || (F[1] === G[1] && F[2] === G[2] && F[0] === 1) || Math.abs(F[2]) === Math.abs(G[2]));
    return [F, G];
  }
  function dobleFactor(rng) {
    const [F, G] = dosFactores(rng), T = prod3(F, G), Pt = seis(T);
    const otros = [[F[0], F[1], G[2]], [F[0], -F[1], F[2]], [G[0], G[1], F[2]], [F[0], F[1], -F[2]]];
    if (otros.some(H => [F, G].some(K => tri3(K) === tri3(H)))) return null;
    return {
      enunciado: [`Rubén factoriza ${Pt} con aspa doble.`], pregunta: ['¿Cuál de estos trinomios es uno de sus factores?'],
      datos: [D.doble], correcta: tri3(F),
      errores: [
        e('TAL-DOBLE-NUM', tri3(otros[0]), t => `Bien los términos con letras. Pero con ${t} el aspa x–número no da ${suma([[T[3], 1, 0]])}.`),
        e('TAL-DOBLE-SIGNO', tri3(otros[1]), t => `Bien los términos en x y el número. Pero con ${t} el aspa x–y no da ${suma([[T[1], 1, 1]])}.`),
        e('TAL-DOBLE-PRINC', tri3(otros[2]), t => `Bien el número ${z(F[2])}. Pero ${t} lo pone en la otra fila.`),
        e('TAL-DOBLE-SIGNO2', tri3(otros[3]), t => `Bien x e y. Pero con ${t} el aspa y–número no da ${suma([[T[4], 0, 1]])}.`),
      ],
      solucion: [['Las tres aspas cuadran con estas dos filas.'], [`${Pt} = `, Ts(`(${tri3(F)})`), To(`(${tri3(G)})`), '.']],
      _datos: { F, G },
    };
  }
  function dobleSuma(rng) {
    const [F, G] = dosFactores(rng), T = prod3(F, G), Pt = seis(T);
    const S = (A, B) => tri3([A[0] + B[0], A[1] + B[1], A[2] + B[2]]);
    return {
      enunciado: [`${Pt} se factoriza con aspa doble en dos trinomios.`], pregunta: ['¿Cuánto suman esos dos trinomios?'],
      datos: [D.doble], correcta: S(F, G),
      errores: [
        e('TAL-DOBLE-SIGNO', S([F[0], F[1], -F[2]], [G[0], G[1], -G[2]]), t => `Bien los términos con letras. Pero los números van con su signo; cambiados suman ${t}.`),
        e('TAL-DOBLE-SIGNO2', S([F[0], -F[1], F[2]], [G[0], -G[1], G[2]]), t => `Bien x y los números. Pero los de y llevan el signo del aspa x–y; cambiados suman ${t}.`),
        e('TAL-PIDE', tri3([F[0] * G[0], F[1] * G[1], F[2] * G[2]]), t => `Bien las dos filas. Pero se suman, no se multiplican columna por columna: ${t}.`),
        e('TAL-DOBLE-NUM', S([F[0], F[1], G[2]], [G[0], G[1], F[2]]) === S(F, G) ? null : tri3([F[0] + G[0], F[1] + G[1], F[2]]), t => `Bien x e y. Pero falta sumar el número de la segunda fila: ${t}.`),
      ],
      solucion: [[`Las filas son ${tri3(F)} y ${tri3(G)}.`], [`(${tri3(F)}) + (${tri3(G)}) = `, To(S(F, G)), '.']],
      _datos: { F, G },
    };
  }
  function falta(rng) {
    const a = noCero(rng, -4, 4), b = noCero(rng, -4, 4), c = noCero(rng, -4, 4), d = noCero(rng, -5, 5);
    const T = mult([1, a, b], [1, c, d]), cruce = b + d, fl = a * c;
    if (Math.abs(fl) < 2 || fl === T[2] || cruce === 0 || fl === cruce || T.some(x => x === 0) || (a === 2 && b === 1 && c === 3 && d === 2)) return null;
    const xx = k => poli([k, 0, 0]);
    return {
      enunciado: [`En el aspa doble especial de ${poli(T)}, los extremos se parten en x² · x² y ${z(b)} · ${par(d)}.`], pregunta: ['¿Qué término en x² tiene que poner la columna del medio?'],
      datos: [D.especial, D.orden], correcta: xx(fl),
      errores: [
        e('TAL-DE-TODO', xx(T[2]), t => `Bien que la columna del medio pone x². Pero los extremos ya dan ${xx(cruce)}: no va el término entero, ${t}.`),
        e('TAL-DE-SUMA', xx(T[2] + cruce), t => `Bien el cruce de los extremos, ${xx(cruce)}. Pero se resta, no se suma: ${t}.`),
        e('TAL-DE-CRUCE', xx(cruce), t => `Bien x² · ${par(d)} + ${par(b)} · x² = ${t}. Pero eso ya está; falta el resto.`),
        e('TAL-DE-RESTA', xx(cruce - T[2]), t => `Bien la resta. Pero va al revés: el término menos el cruce, no ${t}.`),
      ],
      solucion: [[`Los extremos dan x² · ${par(d)} + ${par(b)} · x² = ${xx(cruce)}.`], [`${xx(T[2])} − (${xx(cruce)}) = `, To(xx(fl)), '.']],
      _datos: { a, b, c, d },
    };
  }
  function especialPrimos(rng) {
    const p = noCero(rng, -4, 4), q = noCero(rng, -4, 4), c = rng.entero(-3, 3), d = rng.entero(2, 6);
    if (p === q || c * c - 4 * d >= 0) return null;
    const A = mult([1, p], [1, q]), T = mult(A, [1, c, d]);
    if (T.some(x => x === 0)) return null;
    const bien = poli([1, c + 2, p + q + d]);
    return {
      enunciado: [`Se factoriza por completo ${poli(T)}, primero con aspa doble especial.`], pregunta: ['¿Cuánto suman sus factores primos?'],
      datos: [D.especial, D.aspa, D.cuenta], correcta: bien,
      errores: [
        e('TAL-INCOMPLETA', poli([2, A[1] + c, A[2] + d]), t => `Bien (${poli(A)})(${poli([1, c, d])}). Pero ${poli(A)} todavía se abre: ${t} se para antes.`),
        e('TAL-PIDE', poli([2, p + q]), t => `Bien los binomios. Pero ${poli([1, c, d])} también es un factor primo: ${t} lo deja fuera.`),
        e('TAL-ASPA-SIGNO', poli([1, c + 2, -(p + q) + d]), t => `Bien el trinomio primo. Pero los binomios son ${binx(-p)} y ${binx(-q)}: ${t} les cambia el signo.`),
      ],
      solucion: [[`Sale (${poli(A)})(${poli([1, c, d])}); el primero se abre con aspa simple y el segundo no.`], [`(${binx(-p)}) + (${binx(-q)}) + (${poli([1, c, d])}) = `, To(bien), '.']],
      _datos: { p, q, c, d },
    };
  }

  // ======================= Idea 5: divisores binómicos y teorema del factor =======================
  const PR5 = [1, 2, -5, -6];
  function cubicaUno(rng) {
    let a, b, c;
    do { a = noCero(rng, -5, 5); b = rng.entero(-3, 3); c = rng.entero(1, 6); } while (b * b - 4 * c >= 0);
    return { a, cs: mult([1, -a], [1, b, c]) };
  }
  function factorSigno(rng) {
    const { a, cs } = cubicaUno(rng);
    if (cs.join() === PR5.join() || cs.some(x => x === 0)) return null;
    const c0 = cs[3];
    return {
      enunciado: [`Para P(x) = ${poli(cs)} se sabe que P(${z(a)}) = 0.`], pregunta: ['¿Cuál de estos binomios es un factor de P?'],
      datos: [D.teo, D.valor], correcta: binx(a),
      errores: [
        e('TAL-FACTOR-SIGNO', binx(-a), t => `Bien el número ${z(a)}. Pero ${t} se anula en ${z(-a)}, y P(${z(-a)}) = ${z(evaluar(cs, -a))}.`),
        Math.abs(c0) !== Math.abs(a) ? e('TAL-FACTOR-INDEP', binx(c0), t => `Bien que el número sale de P. Pero ${t} usa el término independiente, y P(${z(c0)}) = ${z(evaluar(cs, c0))}.`) : null,
        e('TAL-FACTOR-X', 'x', t => `Bien que P tiene x. Pero ${t} sería un factor si P(0) fuera 0, y P(0) = ${z(c0)}.`),
        e('TAL-FACTOR-COEF', binx(cs[1]) === binx(a) || Math.abs(cs[1]) === Math.abs(a) ? null : binx(cs[1]), t => `Bien que el número sale de P. Pero ${t} usa el coeficiente de x², y P(${z(cs[1])}) = ${z(evaluar(cs, cs[1]))}.`),
      ],
      solucion: [[`${z(a)} anula a P, así que el binomio es x − (${z(a)}).`], ['Factor: ', Ts(binx(a)), '.']],
      _datos: { a, cs },
    };
  }
  function cualDivisor(rng) {
    const { a, cs } = cubicaUno(rng), c0 = Math.abs(cs[3]);
    if (cs.some(x => x === 0)) return null;
    const divs = [...Array(c0).keys()].map(k => k + 1).filter(d => c0 % d === 0).flatMap(d => [d, -d]).filter(d => d !== a && d !== -a && evaluar(cs, d) !== 0);
    if (divs.length < 3) return null;
    const [d1, d2, d3] = elegirDe(rng, divs, 3);
    const mal = d => t => `Bien que ${z(d)} divide a ${z(cs[3])}. Pero P(${z(d)}) = ${z(evaluar(cs, d))}: ${t} deja resto.`;
    return {
      enunciado: [`P(x) = ${poli(cs)}.`], pregunta: ['¿Cuál de estos binomios divide exactamente a P?'],
      datos: [D.teo, D.cand, D.ruf], correcta: binx(a),
      errores: [
        e('TAL-FACTOR-CAND', binx(d1), mal(d1)), e('TAL-FACTOR-CAND', binx(d2), mal(d2)), e('TAL-FACTOR-CAND', binx(d3), mal(d3)),
        e('TAL-FACTOR-SIGNO', binx(-a), t => `Bien el número ${z(a)}. Pero ${t} se anula en ${z(-a)}, y P(${z(-a)}) = ${z(evaluar(cs, -a))}.`),
      ],
      solucion: [[`Se prueban los divisores de ${z(c0)}: ${z(a)} deja resto 0.`], ['P(', Ta(z(a)), ') = 0: ', Ts(binx(a)), ' es un factor.']],
      _datos: { a, cs },
    };
  }
  function sumaCubica(rng) {
    const [u, w, y] = elegirDe(rng, [-4, -3, -2, -1, 1, 2, 3, 4, 5], 3);
    const cs = [[1, -u], [1, -w], [1, -y]].reduce(mult, [1]);
    if (cs.some(c => c === 0) || cs.join() === PR5.join()) return null;
    const s = u + w + y, resto = mult([1, -w], [1, -y]);
    return {
      enunciado: [`Se factoriza por completo P(x) = ${poli(cs)}.`], pregunta: ['¿Cuánto suman sus factores primos?'],
      datos: [D.teo, D.cand, D.ruf, D.cuenta], correcta: poli([3, -s]),
      errores: [
        e('TAL-FACTOR-SIGNO', poli([3, s]), t => `Bien los números que anulan a P. Pero cada binomio es x − a: con los signos cambiados suman ${t}.`),
        e('TAL-INCOMPLETA', poli(sumar([1, -u], resto)), t => `Bien ${binx(u)}. Pero la fila ${poli(resto)} todavía se abre: ${t} se para antes.`),
        e('TAL-PIDE', f(-s), t => `Bien los números de los binomios. Pero cada factor trae su x: ${t} se olvida de ellas.`),
        e('TAL-FACTOR-PROD', poli([3, -(u * w * y)]), t => `Bien 3x. Pero los números se suman: multiplicarlos da ${t}.`),
      ],
      solucion: [[`Anulan a P: ${z(u)}, ${z(w)} y ${z(y)}.`], [`(${binx(u)}) + (${binx(w)}) + (${binx(y)}) = `, To(poli([3, -s])), '.']],
      _datos: { u, w, y },
    };
  }
  function principal(rng) {
    const c = rng.elegir([2, 3]), b = noCero(rng, -5, 5), [s, t2] = elegirDe(rng, [-3, -2, -1, 1, 2, 3], 2);
    if (mcd(b, c) !== 1) return null;
    const cs = [[c, -b], [1, -s], [1, -t2]].reduce(mult, [1]);
    if (cs.some(x => x === 0)) return null;
    const anula = x => Math.abs(evaluar(cs, x)) < 1e-9;
    if (anula(b) || anula(-b / c) || anula(c / b) || anula(-c / b)) return null;
    const bien = lin(c, -b);
    return {
      enunciado: [`P(x) = ${poli(cs)} tiene un factor de grado 1 que empieza con ${c}x.`], pregunta: ['¿Cuál es ese factor?'],
      datos: [D.teo, D.cand, D.candQ], correcta: bien,
      errores: [
        e('TAL-OLVIDA-PRINC', lin(1, -b), t => `Bien que ${z(b)} divide al independiente. Pero P(${z(b)}) = ${z(evaluar(cs, b))}: ${t} no es factor.`),
        e('TAL-FACTOR-SIGNO', lin(c, b), t => `Bien el ${c} y el ${Math.abs(b)}. Pero ${t} se anula en ${b > 0 ? '−' : ''}${Math.abs(b)}/${c}, que no anula a P.`),
        e('TAL-FRAC-AL-REVES', lin(c, -b) === lin(c, c) ? null : `${Math.abs(b) === 1 ? '' : Math.abs(b)}x ${b > 0 ? '−' : '+'} ${c}`, t => `Bien la fracción con ${c} y ${Math.abs(b)}. Pero va el divisor del independiente arriba; ${t} la invierte.`),
        e('TAL-FACTOR-CAND', lin(c, -Math.abs(b) - c) === bien ? null : lin(c, -Math.abs(b) - c), t => `Bien el ${c}x. Pero ${t} se anula en ${Math.abs(b) + c}/${c}, que no anula a P.`),
      ],
      solucion: [[`${z(b)}/${c} anula a P: el binomio con enteros que se anula ahí es ${bien}.`], [`${poli(cs)} = `, Ts(`(${bien})`), To(`(${poli(mult([1, -s], [1, -t2]))})`), '.']],
      _datos: { c, b, s, t: t2 },
    };
  }

  // ======================= Idea 6: MCD y MCM de polinomios =======================
  function parFact(rng) {
    const [a, b, c] = elegirDe(rng, [-4, -3, -2, -1, 1, 2, 3, 4], 3);
    const i = rng.entero(1, 3), j = rng.entero(1, 2), l = rng.entero(1, 2); let k = rng.entero(1, 3); if (k === i) k = i === 3 ? 1 : i + 1;
    return { a, b, c, i, j, k, l, Pf: [[binx(a), i], [binx(b), j]], Qf: [[binx(a), k], [binx(c), l]] };
  }
  function mcdT(rng) {
    const { a, b, c, i, j, k, l, Pf, Qf } = parFact(rng), bien = escribir([[binx(a), Math.min(i, k)]]);
    return {
      enunciado: [`P = ${escribir(Pf)} y Q = ${escribir(Qf)}.`], pregunta: ['¿Cuál es el MCD de P y Q?'],
      datos: [D.mcd, D.mcm], correcta: bien,
      errores: [
        e('TAL-MCD-MAX', escribir([[binx(a), Math.max(i, k)]]), t => `Bien ${binx(a)}, el factor común. Pero ${t} lleva el mayor exponente: no divide a los dos.`),
        e('TAL-MCD-SINFACTOR', escribir([[binx(a), Math.min(i, k)], [binx(b), j]]), t => `Bien el menor exponente. Pero ${t} trae ${binx(b)}, que no está en Q.`),
        e('TAL-MCD-MCM', escribir([[binx(a), Math.max(i, k)], [binx(b), j], [binx(c), l]]), t => `Bien los factores con su mayor exponente: ${t}. Pero ese es el MCM.`),
      ],
      solucion: [[`Solo ${binx(a)} es común: va con el menor exponente, ${Math.min(i, k)}.`], ['MCD = ', Tm(bien), '.']],
      _datos: { a, b, c, i, j, k, l },
    };
  }
  function mcmT(rng) {
    const { a, b, c, i, j, k, l, Pf, Qf } = parFact(rng), bien = escribir([[binx(a), Math.max(i, k)], [binx(b), j], [binx(c), l]]);
    return {
      enunciado: [`P = ${escribir(Pf)} y Q = ${escribir(Qf)}.`], pregunta: ['¿Cuál es el MCM de P y Q?'],
      datos: [D.mcd, D.mcm], correcta: bien,
      errores: [
        e('TAL-MCM-MIN', escribir([[binx(a), Math.min(i, k)], [binx(b), j], [binx(c), l]]), t => `Bien todos los factores. Pero ${t} lleva el menor exponente de ${binx(a)}.`),
        e('TAL-MCD-MCM', escribir([[binx(a), Math.min(i, k)]]), t => `Bien lo común con su menor exponente: ${t}. Pero ese es el MCD.`),
        e('TAL-MCM-SUMA', escribir([[binx(a), i + k], [binx(b), j], [binx(c), l]]), t => `Bien todos los factores. Pero ${t} suma exponentes: es P · Q.`),
      ],
      solucion: [[`Van todos: ${binx(a)} con el mayor exponente, ${Math.max(i, k)}.`], ['MCM = ', Tm(bien), '.']],
      _datos: { a, b, c, i, j, k, l },
    };
  }
  function gradoMCM(rng) {
    const [a, b, c] = elegirDe(rng, [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5], 3);
    const Pc = mult([1, -a], [1, -b]), Qc = mult([1, -a], [1, -c]);
    if ([...Pc, ...Qc].some(x => x === 0)) return null;
    return {
      enunciado: [`P = ${poli(Pc)} y Q = ${poli(Qc)}.`], pregunta: ['¿Qué grado tiene el MCM de P y Q?'],
      datos: [D.fact, D.mcm, D.grado, D.aspa], correcta: 3,
      errores: [
        en('TAL-MCM-SUMA', 4, t => `Bien que van todos los factores. Pero ${binx(a)} es común: contarlo dos veces da ${t}.`),
        en('TAL-MCD-MCM', 1, t => `Bien el factor común, ${binx(a)}, de grado ${t}. Pero ese es el MCD.`),
        en('TAL-MCD-PRIMOS', 2, t => `Bien el grado de cada uno, ${t}. Pero el MCM es múltiplo de los dos, y ninguno lo es del otro.`),
        en('TAL-MCM-PROD', 8, t => `Bien que se combinan los grados. Pero no se multiplican P y Q dos veces: ${t} es demasiado.`),
      ],
      solucion: [[`P = (${binx(a)})(${binx(b)}) y Q = (${binx(a)})(${binx(c)}).`], [`MCM = (${binx(a)})(${binx(b)})(${binx(c)}): grado `, Tm('3'), '.']],
      _datos: { a, b, c },
    };
  }
  function mcdValor(rng) {
    const [a, b, c, d] = elegirDe(rng, [-3, -2, -1, 1, 2, 3, 4], 4);
    const Pc = [[1, -a], [1, -b], [1, -c]].reduce(mult, [1]), Qc = mult([1, -a], [1, -d]);
    if ([...Pc, ...Qc].some(x => x === 0) || Pc.join() === PR5.join()) return null;
    const k = rng.elegir([5, 6, 7, 8, 9]);
    return {
      enunciado: [`Sea M el MCD de P(x) = ${poli(Pc)} y Q(x) = ${poli(Qc)}.`], pregunta: [`¿Cuánto vale M(${k})?`],
      datos: [D.fact, D.mcd, D.cand, D.aspa], correcta: k - a,
      errores: [
        en('TAL-FACTOR-SIGNO', k + a, t => `Bien que ${z(a)} anula a los dos. Pero el factor es ${binx(a)}; con el signo cambiado da ${t}.`),
        en('TAL-MCD-SINFACTOR', (k - a) * (k - b), t => `Bien ${binx(a)}. Pero ${binx(b)} solo está en P; con él da ${t}.`),
        en('TAL-MCD-MAX', evaluar(Qc, k), t => `Bien que Q comparte un factor con P. Pero ${binx(d)} no está en P; Q(${k}) = ${t}.`),
        en('TAL-MCD-PRIMOS', 1, t => `Bien que no se parecen a simple vista. Pero los dos se anulan en ${z(a)}: el MCD no es ${t}.`),
      ],
      solucion: [[`P = (${binx(a)})(${binx(b)})(${binx(c)}) y Q = (${binx(a)})(${binx(d)}): solo ${binx(a)} es común.`], [`M(${k}) = ${k} ${a > 0 ? '−' : '+'} ${Math.abs(a)} = `, Tm(f(k - a)), '.']],
      _datos: { a, b, c, d, k },
    };
  }
  // MCD y MCM dados, P conocido: Q = MCD · MCM / P, mónico de grado 2; se pide Q(0).
  function mcmDado(rng) {
    const [a, b, c] = elegirDe(rng, [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5], 3);
    const Pc = mult([1, -a], [1, -b]);
    if (Pc.some(x => x === 0)) return null;
    const bien = a * c;   // Q = (x − a)(x − c): Q(0) = a · c
    return {
      enunciado: [`P = ${poli(Pc)}. El MCD de P y Q es ${binx(a)} y su MCM es (${binx(a)})(${binx(b)})(${binx(c)}). Q es mónico de grado 2.`], pregunta: ['¿Cuánto vale Q(0)?'],
      datos: [D.prod, D.aspa, D.valor], correcta: bien,
      errores: [
        en('TAL-PIDE', a * b, t => `Bien que el término independiente es el valor en 0. Pero ${t} es P(0), no Q(0).`),
        en('TAL-MCD-MCM', -a * b * c, t => `Bien evaluar en 0. Pero ${t} es el MCM en 0, no Q.`),
        en('TAL-FACTOR-SIGNO', -a * c, t => `Bien los factores de Q. Pero ${binx(a)} vale ${z(-a)} en 0, con su signo; cambiado da ${t}.`),
        en('TAL-MCD-SINFACTOR', b * c, t => `Bien ${binx(c)}. Pero Q lleva el factor común ${binx(a)}, no ${binx(b)}: así da ${t}.`),
      ],
      solucion: [[`Q lleva el común, ${binx(a)}, y lo que el MCM trae de más, ${binx(c)}.`], [`Q(0) = ${par(-a)} · ${par(-c)} = `, Tm(f(bien)), '.']],
      _datos: { a, b, c },
    };
  }

  const CONSTRUIR = {
    'comun-dos': comunDos, 'comun-uno': comunUno, volteado, agrupar,
    'dif-cuad': difCuad, tcp, cubos, 'primos-ident': primosIdent,
    'aspa-monico': aspaMonico, 'aspa-coef': aspaCoef, 'aspa-dos': aspaDos, bicuad,
    'doble-factor': dobleFactor, 'doble-suma': dobleSuma, falta, 'especial-primos': especialPrimos,
    'factor-signo': factorSigno, 'cual-divisor': cualDivisor, 'suma-cubica': sumaCubica, principal,
    mcd: mcdT, mcm: mcmT, 'grado-mcm': gradoMCM, 'mcd-valor': mcdValor, 'mcm-dado': mcmDado,
  };

  return { id: ID, titulo: 'Factorización', generar, TIPOS_POR_IDEA, NIVEL, TIPOS: Object.keys(CONSTRUIR) };
});
