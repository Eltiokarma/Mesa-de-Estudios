/*
 * Generador «Binomio de Newton»: la práctica de las seis ideas de algebra.binomio-de-newton
 * (contenido/teoria/algebra/binomio-de-newton.js). Formato "predicciones" (docs/arquitectura.md). Funciona en el
 * navegador (window.Generadores['binomio-practica']) y en Node (require). No usa ningún motor ni el código de la teoría:
 * las cuentas (combinatorios, potencias, fracciones) se hacen aquí.
 *
 * Propuesta: docs/etapa9/propuesta-algebra.md §7. Objetos como en la teoría: las cenefas de losetas de Rubén (valores de
 * problema, sin fuente).
 *
 * Tipos por idea (TIPOS_POR_IDEA; nivel 1 un paso, 2 dos pasos, 3 de examen). generar(semilla, { idea }) da solo los de
 * esa idea; sin idea, las seis con el mismo peso.
 *   pascal-elecciones     coef (1) · fila (1; la fila siguiente de Pascal) · cenefas (2; con la primera turquesa) ·
 *                         iguales (3; n desde dos coeficientes iguales)
 *   termino-general       termino (1; lugar dado) · coef-signo (2) · lugar (2; dónde está xᵐ) · n-termino (3; n desde
 *                         un término, como San Marcos 2026-I)
 *   termino-buscado       existe (1) · indep (2) · coef-xm (2) · param (3; el número de b desde el independiente)
 *   suma-coeficientes     cuantos (1) · central (2) · suma (2) · n-suma (3; cuántos términos desde la suma)
 *   exponente-no-natural  termina (1) · x2 (1) · x3 (2) · aprox (3; tres términos)
 *   potencia-trinomio     multi (1) · terminos (2) · tri-num (2) · indep-tri (3; el independiente de (x + 1/x + c)ⁿ)
 *
 * Notación: superíndices Unicode, el signo menos tipográfico «−», C(n, k) con paréntesis, «elevado a 1/2» para un
 * exponente fraccionario. Colores: un color fijo por magnitud, el de la teoría: el primer término naranja (a: o), el
 * segundo turquesa (b: i), lo que se busca violeta (r: f), el tercer término verde (c: d). Solo en la solución.
 * Datos (contrato, punto 13): el término general, C(n, k), el factorial, la suma de coeficientes, la fórmula de α y la
 * del trinomio, nunca el paso hecho ni la respuesta.
 * Errores: los códigos de la teoría (DIS, ORD, IDX, SIG, BLO, FAC, GEN, OBJ, EXP: de la investigación, documentados en
 * otras poblaciones; TAL-BN-*: hipótesis de diseño). Las respuestas van como texto (un término, una fracción o un
 * conteo): de 3 o 4 errores, los que dejan la correcta fuera del centro. Cada explicación dice lo que el alumno hizo
 * bien y lo que da su error (no tiene que empezar por «Bien»: auditoría, 26 nov).
 * La práctica no repite ninguna Predice de la unidad ((a + b)⁵ con a³b²; (x − 2)⁶; (x² + 1/x)⁵; (2x − 1)⁵; (1 + x)
 * elevado a 1/2 contando términos; a²b²c² en (a + b + c)⁶).
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
  const ID = 'binomio-practica';
  const TEO = 'contenido/teoria/algebra/binomio-de-newton.js';
  const INV = 'docs/investigacion/etapa9/algebra.binomio-de-newton.md';
  const v = P.v;
  const f = x => P.formatear(x, 0);

  // ---- Números ----
  const fact = n => (n <= 1 ? 1 : n * fact(n - 1));
  const C = (n, k) => (k < 0 || k > n ? 0 : Math.round(fact(n) / (fact(k) * fact(n - k))));
  const V = (n, k) => { let p = 1; for (let i = 0; i < k; i++) p *= n - i; return p; };
  const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  const Q = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = mcd(n, d); return [n / g, d / g]; };
  const qm = (a, b) => Q(a[0] * b[0], a[1] * b[1]), qs = (a, b) => Q(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
  const qTxt = ([n, d]) => (d === 1 ? f(n) : `${n < 0 ? '−' : ''}${Math.abs(n)}/${d}`);
  const coefAl = (al, k) => { let c = [1, 1]; for (let i = 0; i < k; i++) c = qm(c, Q(al[0] - i * al[1], al[1] * (i + 1))); return c; };
  const dec = ([n, d]) => { const s = n < 0 ? '−' : ''; n = Math.abs(n); let ent = Math.floor(n / d), r = n % d, t = ''; for (let i = 0; i < 12 && r; i++) { r *= 10; t += Math.floor(r / d); r %= d; } return `${s}${ent}${t ? ',' + t : ''}`; };

  // ---- Escritura ----
  const SUPS = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', '-': '⁻' };
  const sup = s => [...String(s)].map(c => SUPS[c]).join('');
  const pot = (l, e) => (e === 0 ? '' : e === 1 ? l : `${l}${sup(e)}`);
  const par = x => (x < 0 ? `(${f(x)})` : f(x));
  // Monomio: «−160x³», «x²y³», «15x⁻²», «7».
  const mono = (c, ex = 0, ey = 0) => { const l = `${pot('x', ex)}${pot('y', ey)}`; return l ? `${c === 1 ? '' : c === -1 ? '−' : f(c)}${l}` : f(c); };
  const binx = (p, q) => `(${p === 1 ? '' : p}x ${q < 0 ? '−' : '+'} ${Math.abs(q)})`;            // (px ± q)
  const bin3 = (p, c, q) => `(${pot('x', p)} ${c < 0 ? '−' : '+'} ${Math.abs(c)}/${pot('x', q)})`; // (xᵖ ± c/x^q)
  const altAl = al => (al[1] === 1 ? `(1 + x)${sup(al[0])}` : `(1 + x) elevado a ${qTxt(al)}`);
  const lugarTxt = L => `lugar ${L}`;

  const VARS = {
    a: { nombre: 'el primer término', color: 'o' }, b: { nombre: 'el segundo término', color: 'i' },
    r: { nombre: 'lo que se busca', color: 'f' }, c: { nombre: 'el tercer término', color: 'd' },
  };
  const Tr = t => v('r', t);

  // ---- Errores ----
  function e(id, texto, explicar, respaldo = 'hipotesis') {
    if (texto === null || texto === undefined || /NaN|undefined|Infinity/.test(String(texto))) return null;
    return { id, clave: texto, texto, explicacion: explicar(texto), respaldo, fuente: /^TAL-/.test(id) ? TEO : INV };
  }
  const doc = 'parcial';   // documentado en otras poblaciones (investigación §3), no en postulantes peruanos

  // ---- Datos que se repiten (herramientas, no el paso hecho) ----
  const D = {
    comb: 'Número combinatorio, las maneras de elegir k cosas entre n sin importar el orden: C(n, k) = n!/(k!(n − k)!)',
    fact: 'n! = 1 · 2 · 3 · … · n, y 0! = 1',
    eleccion: 'Cada término de (a + b)ⁿ sale de elegir a o b en cada uno de los n paréntesis',
    pascal: 'Triángulo de Pascal: cada número es la suma de los dos que tiene encima',
    simetria: 'C(n, k) = C(n, n − k)',
    coefXY: 'En (x + y)ⁿ, el coeficiente de xⁿ⁻ᵏyᵏ es C(n, k)',
    general: 'Término de lugar k + 1 de (a + b)ⁿ: tₖ₊₁ = C(n, k)aⁿ⁻ᵏbᵏ',
    orden: 'El desarrollo va de aⁿ (lugar 1) a bⁿ (lugar n + 1)',
    signo: 'Un negativo con exponente par da positivo; con exponente impar, negativo',
    potProd: 'Potencia de un producto: (2x)³ = 2³x³ = 8x³',
    negativo: '1/x = x⁻¹, y 1/x² = x⁻²',
    potPot: '(xᵐ)ⁿ = xᵐⁿ',
    producto: 'xᵐ · xⁿ = xᵐ⁺ⁿ',
    cero: 'Término independiente: el que no tiene x (exponente 0)',
    suma: 'Suma de coeficientes de P: el valor de P con cada letra igual a 1',
    terminos: '(a + b)ⁿ tiene n + 1 términos, de k = 0 a k = n',
    central: 'Con n par, el término central está en el lugar n/2 + 1',
    alfa: 'Coeficiente de xᵏ en (1 + x) elevado a α: α(α − 1)…(α − k + 1)/k!',
    natural: 'Si α es natural, el desarrollo termina: tiene α + 1 términos',
    vale: 'Con α no natural, la suma sirve si x está entre −1 y 1',
    multi: 'En (a + b + c)ⁿ, el término con a p veces, b q veces y c r veces: n!/(p! q! r!)',
    terminosTri: '(a + b + c)ⁿ tiene C(n + 2, 2) términos',
  };

  // ---- Tipos por idea ----
  const TIPOS_POR_IDEA = {
    'pascal-elecciones': ['coef', 'fila', 'cenefas', 'iguales'],
    'termino-general': ['termino', 'coef-signo', 'lugar', 'n-termino'],
    'termino-buscado': ['existe', 'indep', 'coef-xm', 'param'],
    'suma-coeficientes': ['cuantos', 'central', 'suma', 'n-suma'],
    'exponente-no-natural': ['termina', 'x2', 'x3', 'aprox'],
    'potencia-trinomio': ['multi', 'terminos', 'tri-num', 'indep-tri'],
  };
  const IDEAS = Object.keys(TIPOS_POR_IDEA);
  const IDEA_DE = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map(t => [t, i])));
  const NIVEL = {
    coef: 1, fila: 1, cenefas: 2, iguales: 3,
    termino: 1, 'coef-signo': 2, lugar: 2, 'n-termino': 3,
    existe: 1, indep: 2, 'coef-xm': 2, param: 3,
    cuantos: 1, central: 2, suma: 2, 'n-suma': 3,
    termina: 1, x2: 1, x3: 2, aprox: 3,
    multi: 1, terminos: 2, 'tri-num': 2, 'indep-tri': 3,
  };
  // Papel (regla 6; herramientas/papel-generador.js usa «papel-1» a «papel-8»): las seis ideas, de menos a más.
  const PAPEL = { 'papel-1': 'coef', 'papel-2': 'termino', 'papel-3': 'indep', 'papel-4': 'suma', 'papel-5': 'x2',
    'papel-6': 'multi', 'papel-7': 'n-termino', 'papel-8': 'param' };

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

  // Qué errores van: 4 (o 3) con los que la correcta no queda en el centro (probarFugas, nucleo/probar-generador.js).
  const trozos = t => String(t).replace(/[()]/g, ' ').split(/[\s;,]+|(?=[+−\-·/])|(?<=[+−\-·/])/).filter(Boolean);
  const distancia = (a, b) => { const A = trozos(a), B = trozos(b); let d = 0; for (let i = 0; i < Math.max(A.length, B.length); i++) if (A[i] !== B[i]) d++; return d; };
  function subconjuntos(l, k) {
    if (k === 0) return [[]];
    const r = [];
    for (let i = 0; i <= l.length - k; i++) for (const resto of subconjuntos(l.slice(i + 1), k - 1)) r.push([l[i], ...resto]);
    return r;
  }
  const numDe = t => { const m = String(t).replace(/(\d) (?=\d{3}\b)/g, '$1').replace('−', '-').replace(',', '.').match(/^(-?\d+(?:\.\d+)?)(?:\/(\d+))?$/); return m ? +m[1] / (m[2] ? +m[2] : 1) : null; };
  function elegirErrores(rng, correcta, errores) {
    const vistos = new Set([correcta]), pool = [];
    for (const x of rng.barajar(errores)) if (!vistos.has(x.texto)) { vistos.add(x.texto); pool.push(x); }
    const bueno = sub => {
      const al = [correcta, ...sub.map(x => x.texto)], sc = al.map(a => al.reduce((t, b) => t + distancia(a, b), 0));
      const min = Math.min(...sc);
      if (sc[0] === min && sc.filter(x => x === min).length === 1) return false;
      const ns = al.map(numDe);
      if (ns.every(x => x !== null)) { if (ns[0] === Math.max(...ns) || ns[0] === Math.min(...ns)) return false; }
      return true;
    };
    for (const k of [4, 3]) for (const sub of subconjuntos(pool, Math.min(k, pool.length))) if (sub.length >= 3 && bueno(sub)) return sub;
    return null;
  }
  // La práctica no repite un ejemplo ni una predicción de la teoría, aunque los diga con otras palabras (auditoría, 26
  // nov). La firma junta los trozos de matemática y lo que se pide, sin orden ni redacción; VETO_EJ guarda las de los
  // ejemplos que estos tipos pueden sacar (generador.test.js comprueba la lista contra la teoría en 400 semillas).
  const planoT = x => (Array.isArray(x) ? x.map(planoT).join('') : x && typeof x === 'object' ? String(x.t) : String(x));
  const firma = t => {
    t = String(t).replace(/[\u00a0\u2060]/g, ' ').replace(/(\d) (\d{3})\b/g, '$1$2');
    const pide = ['independiente', 'central', 'lugar', 'suman', 'aproxim', 'coeficiente', 'cenefas', 'vale n', 'vale m', 'términos'].find(p => t.includes(p)) || '';
    const trozos = (t.match(/\([^()]*\)(?:[⁰¹²³⁴⁵⁶⁷⁸⁹⁻ⁿ]+| elevado a −?\d+\/\d+)?|[^\s;:¿?()]+/g) || []).map(w => w.replace(/[,.]+$/, '')).filter(w => /[\d⁰¹²³⁴⁵⁶⁷⁸⁹ⁿ(√]/.test(w)).sort();
    return [pide, ...trozos].join(' | ');
  };
  const VETO_EJ = new Set([
    'cenefas | 3 | 7',
    'central | (x + 2)⁶',
    'central | (x² − 2)⁶',
    'coeficiente | (1 + x) elevado a 1/2 | x³',
    'coeficiente | (1 + x) elevado a 1/3 | x²',
    'coeficiente | (1 + x) elevado a −1/2 | x²',
    'coeficiente | (1 + x)⁻² | x³',
    'coeficiente | (1 + x)⁻¹ | x²',
    'coeficiente | (a + b + c)⁵ | a³bc',
    'coeficiente | (a + b + c)⁶ | a³b²c',
    'coeficiente | (a + b)⁶ | a⁴b²',
    'coeficiente | (a + b)⁸ | 1 | 1 | 21 | 21 | 35 | 35 | 7 | 7 | 7 | a⁵b³',
    'coeficiente | (a + b)⁸ | a³b⁵',
    'coeficiente | (a + b)⁹ | a⁷b²',
    'coeficiente | (x + y)ⁿ | xⁿ⁻⁴y⁴ | xⁿ⁻⁶y⁶',
    'coeficiente | (x³ + 2/x)⁶ | x⁶',
    'independiente | (x + 1/x)⁴',
    'independiente | (x + 2/x)⁶',
    'independiente | (x² + 1/x)⁹',
    'independiente | (x³ + 1/x²)⁵',
    'lugar | (x + 2)ⁿ | 3 | 60x⁴',
    'lugar | (x + 3)⁸ | x⁵ | x⁸',
    'suman | (x + 2y)ⁿ | 729',
    'términos | (x³ + y²)¹²',
  ]);
  function cerrar(rng, semilla, tipo, o) {
    if (VETO_EJ.has(firma(`${planoT(o.enunciado)} ${planoT(o.pregunta)}`))) return null;
    const errores = elegirErrores(rng, o.correcta, o.errores.filter(Boolean));
    if (!errores) return null;
    const alternativas = P.armarTexto({ correcta: { clave: o.correcta, texto: o.correcta }, errores, rng });
    if (alternativas.length < 4) return null;
    const usadas = new Set();
    for (const linea of [o.enunciado, o.pregunta, ...o.solucion]) for (const x of linea) if (x && typeof x === 'object') usadas.add(x.v);
    const variables = Object.fromEntries([...usadas].map(k => [k, Object.assign({}, VARS[k])]));
    return {
      id: `${ID}#${semilla}`, variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: o.datos,
      alternativas, solucion: o.solucion, respuesta: { valor: o.correcta, texto: o.correcta, unidad: '' },
      _datos: Object.assign({ idea: IDEA_DE[tipo], tipo, nivel: NIVEL[tipo] }, o._datos),
    };
  }

  // ======================= Idea 1: elegir en cada paréntesis =======================
  function coef(rng) {
    const n = rng.entero(5, 10), k = rng.entero(2, n - 2);
    if (n === 5) return null;   // (a + b)⁵ es la predicción
    const c = C(n, k);
    return {
      enunciado: [`Se desarrolla (a + b)${sup(n)} y se juntan los términos semejantes.`], pregunta: [`¿Cuál es el coeficiente de ${pot('a', n - k)}${pot('b', k)}?`],
      datos: [D.eleccion, D.comb, D.fact], correcta: f(c),
      errores: [
        e('ORD', f(V(n, k)), t => `Bien elegir ${k} de ${n} paréntesis, pero contadas en orden, cada elección se repite ${k}! veces; por eso ${t} cuenta de más.`, doc),
        e('TAL-BN-EXPONENTES', f((n - k) * k), t => `Bien leídos los exponentes, pero el coeficiente cuenta elecciones de paréntesis, y multiplicar ${n - k} · ${k} = ${t} no las cuenta.`),
        e('TAL-BN-LUGAR', f(C(n, k - 1)), t => `Bien usar un C(${n}, k), pero b sale ${k} veces; C(${n}, ${k - 1}) = ${t} es el coeficiente de otro término.`),
        e('DIS', '0', t => `Bien que a${sup(n)} y b${sup(n)} salen, pero también salen productos mezclados, así que el coeficiente no es ${t}.`, doc),
      ],
      solucion: [[`Se eligen, entre los ${n} paréntesis, los ${k} que dan b.`], [`C(${n}, ${k}) = `, Tr(f(c)), '.']],
      _datos: { n, k },
    };
  }
  function fila(rng) {
    const n = rng.entero(5, 8), k = rng.entero(2, n - 1), fl = Array.from({ length: n + 1 }, (_, j) => C(n, j)), bien = fl[k - 1] + fl[k];
    return {
      enunciado: [`La fila ${n} del triángulo de Pascal es ${fl.join(', ')}.`], pregunta: [`¿Cuál es el coeficiente de ${pot('a', n + 1 - k)}${pot('b', k)} en (a + b)${sup(n + 1)}?`],
      datos: [D.pascal, `La fila ${n + 1} da los coeficientes de (a + b)${sup(n + 1)}, en orden desde a${sup(n + 1)} hasta b${sup(n + 1)}`], correcta: f(bien),
      errores: [
        e('TAL-BN-PAR', f(fl[k] + (fl[k + 1] || 0)), t => `Bien sumar dos números de arriba, pero no esos: ${t} sale de los de lugar ${k + 1} y ${k + 2}, y el término va debajo de los de lugar ${k} y ${k + 1}.`),
        e('TAL-BN-DOBLE', f(2 * fl[k]), t => `Bien partir del ${fl[k]}, pero se suma con su vecino de la izquierda, el ${fl[k - 1]}, y no consigo mismo; por eso no da ${t}.`),
        e('TAL-BN-COPIA', f(fl[k]), t => `Bien ubicado el ${t}, pero es de la fila ${n}; en la fila ${n + 1}, cada número suma los dos que tiene encima.`),
        e('TAL-BN-DOBLE', f(2 * fl[k - 1]), t => `Bien partir del ${fl[k - 1]}, pero se suma con su vecino de la derecha, el ${fl[k]}, y no consigo mismo; por eso no da ${t}.`),
      ],
      solucion: [['Cada número de la fila de abajo suma los dos que tiene encima.'], [`${fl[k - 1]} + ${fl[k]} = `, Tr(f(bien)), '.']],
      _datos: { n, k, fl },
    };
  }
  function cenefas(rng) {
    const n = rng.entero(6, 9), k = rng.entero(2, Math.min(5, n - 2)), bien = C(n - 1, k - 1);
    return {
      enunciado: [`Rubén arma cenefas de ${n} losetas con ${k} turquesas y las demás naranjas. La primera loseta debe ser turquesa.`], pregunta: ['¿Cuántas cenefas distintas puede armar?'],
      datos: [D.comb, D.fact, 'Dos cenefas son distintas si alguna posición cambia de color'], correcta: f(bien),
      errores: [
        e('TAL-BN-TODAS', f(C(n, k)), t => `Bien elegir dónde van las turquesas, pero ${t} olvida que la primera ya es turquesa y solo quedan ${k - 1} por ubicar.`),
        e('TAL-BN-LUGAR', f(C(n - 1, k)), t => `Bien dejar fija la primera, pero en las otras ${n - 1} posiciones van ${k - 1} turquesas, no ${k}; por eso no da ${t}.`),
        e('ORD', f(V(n - 1, k - 1)), t => `Bien elegir ${k - 1} de ${n - 1}, pero las turquesas son iguales y su orden no cuenta; contadas en orden dan ${t}, que es de más.`, doc),
        e('TAL-BN-EXPONENTES', f((n - 1) * (k - 1)), t => `Bien contadas las ${n - 1} posiciones y las ${k - 1} turquesas, pero no se multiplican: ${t} no cuenta las elecciones.`),
      ],
      solucion: [[`La primera ya es turquesa, así que faltan ${k - 1} turquesas para las otras ${n - 1} posiciones.`], [`C(${n - 1}, ${k - 1}) = `, Tr(f(bien)), '.']],
      _datos: { n, k },
    };
  }
  function iguales(rng) {
    const k1 = rng.entero(2, 5), k2 = rng.entero(k1 + 2, 9), n = k1 + k2;
    const xn = k => `xⁿ⁻${sup(k)}${pot('y', k)}`;
    return {
      enunciado: [`En el desarrollo de (x + y)ⁿ, los coeficientes de ${xn(k1)} y de ${xn(k2)} son iguales.`], pregunta: ['¿Cuánto vale n?'],
      datos: [D.coefXY, D.simetria], correcta: f(n),
      errores: [
        e('TAL-BN-RESTA', f(k2 - k1), t => `Bien igualar C(n, ${k1}) y C(n, ${k2}), pero la simetría junta k con n − k, así que n es la suma, no la resta ${t}.`),
        e('IDX', f(n + 2), t => `Bien sumar, pero ${k1} y ${k2} son las veces que sale y, no los lugares de los términos; sumando lugares sale ${t}.`, doc),
        e('TAL-BN-EXPONENTES', f(k1 * k2), t => `Bien usar ${k1} y ${k2}, pero no se multiplican: C(n, ${k1}) = C(n, n − ${k1}) pide n − ${k1} = ${k2}, y n no es ${t}.`),
        (k1 + k2) % 2 === 0 ? e('TAL-BN-MEDIA', f((k1 + k2) / 2), t => `Bien buscar la simetría, pero ${t} es el centro, n/2, y n es el doble.`) : null,
      ],
      solucion: [[`Como ${k1} ≠ ${k2}, los dos coeficientes solo son iguales por la simetría: ${k2} tiene que ser n − ${k1}.`], [`n = ${k1} + ${k2} = `, Tr(f(n)), '.']],
      _datos: { k1, k2 },
    };
  }

  // ======================= Idea 2: el término de lugar k + 1 =======================
  function termino(rng) {
    const n = rng.entero(5, 8), q = rng.elegir([-3, -2, -1, 2, 3]), k = rng.entero(2, n - 2), L = k + 1;
    if (n === 6 && q === -2) return null;   // (x − 2)⁶ es la predicción
    const t = C(n, k) * q ** k;
    return {
      enunciado: [`Se desarrolla ${binx(1, q)}${sup(n)} de x${sup(n)} hacia abajo.`], pregunta: [`¿Cuál es el término de lugar ${L}?`],
      datos: [D.general, D.comb, D.signo], correcta: mono(t, n - k),
      errores: [
        e('IDX', mono(C(n, L) * q ** L, n - L), x => `Bien usar la fórmula, pero el lugar ${L} lleva k = ${k}, porque el lugar 1 es el de k = 0; ${x} usa k = ${L}.`, doc),
        q < 0 ? e('SIG', mono(-t, n - k), x => `Bien el número, pero (${f(q)})${sup(k)} es ${k % 2 ? 'negativo' : 'positivo'} porque k = ${k} es ${k % 2 ? 'impar' : 'par'}; ${x} tiene el signo cambiado.`, doc) : null,
        e('BLO', mono(C(n, k) * q, n - k), x => `Bien C(${n}, ${k}), pero b se elige ${k} veces y ${par(q)} entra elevado a ${k}; ${x} lo pone una sola vez.`, doc),
        e('TAL-BN-LUGAR-INV', mono(C(n, k) * q ** (n - k), k), x => `Bien el lugar, pero se cuenta desde x${sup(n)}, que es el lugar 1; ${x} cuenta desde el otro extremo.`),
        e('TAL-BN-LUGAR', mono(C(n, k - 1) * q ** (k - 1), n - k + 1), x => `Bien la fórmula, pero con k = ${k - 1} sale ${x}, que es el término del lugar ${k}.`),
      ],
      solucion: [[`El lugar ${L} tiene k = ${k}, así que b = ${f(q)} sale ${k} veces.`], [`C(${n}, ${k}) · x${sup(n - k)} · ${par(q)}${sup(k)} = `, Tr(mono(t, n - k)), '.']],
      _datos: { n, p: 1, q, k },
    };
  }
  function coefSigno(rng) {
    const n = rng.entero(4, 7), p = rng.elegir([1, 2, 3]), q = -rng.elegir([1, 2, 3]), k = rng.entero(1, n - 1), m = n - k;
    if (p === 1 && q === -1) return null;
    if (p === 2 && q === -1 && n === 5) return null;   // (2x − 1)⁵ es la predicción de la idea 4
    const c = C(n, k) * p ** m * q ** k;
    if (Math.abs(c) > 20000) return null;
    return {
      enunciado: [`Se desarrolla ${binx(p, q)}${sup(n)}.`], pregunta: [`¿Cuál es el coeficiente de ${pot('x', m)}?`],
      datos: [D.general, D.comb, D.signo], correcta: f(c),
      errores: [
        e('SIG', f(-c), t => `Bien el valor, pero (${f(q)})${k === 1 ? '' : sup(k)} tiene exponente ${k % 2 ? 'impar: es negativo' : 'par: es positivo'}; por eso no es ${t}.`, doc),
        e('BLO', f(C(n, k)), t => `Bien C(${n}, ${k}) = ${t}, pero el coeficiente también lleva los números de a y de b, elevados y multiplicados.`, doc),
        e('TAL-BN-LUGAR-INV', f(C(n, m) * p ** k * q ** m), t => `Bien la fórmula, pero ${pot('x', m)} pide a elevado a ${m}; ${t} cruza los exponentes de a y de b.`),
        p > 1 ? e('BLO', f(C(n, k) * p * q ** k), t => `Bien elevar b, pero ${p}x también se eleva entero a ${m}, con su número; por eso no es ${t}.`, doc) : null,
      ],
      solucion: [[`Para que salga ${pot('x', m)}, a se elige ${m} ${m === 1 ? 'vez' : 'veces'} y b, k = ${k} ${k === 1 ? 'vez' : 'veces'}.`], [`C(${n}, ${k}) · ${p}${m === 1 ? '' : sup(m)} · (${f(q)})${k === 1 ? '' : sup(k)} = `, Tr(f(c)), '.']],
      _datos: { n, p, q, k },
    };
  }
  function lugar(rng) {
    const n = rng.entero(6, 11), m = rng.entero(2, n - 2), q = rng.elegir([2, 3, 5, -2, -3]), k = n - m;
    return {
      enunciado: [`Se desarrolla ${binx(1, q)}${sup(n)} de x${sup(n)} hacia abajo.`], pregunta: [`¿En qué lugar está el término con ${pot('x', m)}?`],
      datos: [D.general, D.orden], correcta: lugarTxt(k + 1),
      errores: [
        e('IDX', lugarTxt(k), t => `Bien que b sale ${k} veces, pero el lugar es k + 1, porque el primer término es el de k = 0; no es el ${t}.`, doc),
        e('TAL-BN-LUGAR-INV', lugarTxt(m + 1), t => `Bien contar desde un extremo, pero el lugar 1 es el de x${sup(n)}; el ${t} sale de contar desde el final.`),
        e('TAL-BN-EXPONENTE-N', lugarTxt(m), t => `Bien mirar el exponente ${m}, pero el lugar lo da cuántas veces sale b, más 1; no es el ${t}.`),
        e('TAL-BN-LUGAR', lugarTxt(k + 2), t => `Bien que b sale ${k} veces, pero el lugar es k + 1, no k + 2; no es el ${t}.`),
      ],
      solucion: [[`x${sup(m)} pide a elevado a ${m}, así que b sale ${n} − ${m} = ${k} veces.`], ['El lugar es k + 1 = ', Tr(lugarTxt(k + 1)), '.']],
      _datos: { n, m, q },
    };
  }
  function nTermino(rng) {
    const n = rng.entero(5, 9), q = rng.elegir([2, 3, -2]), L = rng.elegir([2, 3, 4]), k = L - 1, t = C(n, k) * q ** k, ex = n - k;
    if (Math.abs(t) > 20000) return null;
    if (n === 6 && q === -2 && L === 4) return null;   // la predicción
    return {
      enunciado: [`En el desarrollo de ${binx(1, q)}ⁿ, el término de lugar ${L} es ${mono(t, ex)}.`], pregunta: ['¿Cuánto vale n?'],
      datos: [D.general, D.comb], correcta: f(n),
      errores: [
        e('TAL-BN-EXPONENTE-N', f(ex), x => `Bien mirar x${sup(ex)}, pero ${x} es n − ${k}, las veces que sale a; falta sumarle ${k}.`),
        e('IDX', f(ex + L), x => `Bien igualar el exponente de x, pero en el lugar ${L} es k = ${k}, no ${L}; por eso n no es ${x}.`, doc),
        e('TAL-BN-LUGAR-N', f(L), x => `Bien ubicado el lugar ${x}, pero n es el exponente del binomio, y falta despejarlo del exponente de x.`),
        e('TAL-BN-LUGAR', f(ex + k - 1), x => `Bien plantear n − k = ${ex}, pero en el lugar ${L} es k = ${k}; por eso n no es ${x}.`),
      ],
      solucion: [[`El lugar ${L} tiene k = ${k}, así que x sale n − ${k} veces, y eso tiene que dar ${ex}.`], [`n − ${k} = ${ex}, así que n = `, Tr(f(n)), '.']],
      _datos: { n, q, L },
    };
  }

  // ======================= Idea 3: un término por su exponente =======================
  // (xᵖ + c/x^q)ⁿ: el exponente de x en el término con b k veces es p(n − k) − qk.
  const uno = p => (p === 1 ? '' : p);
  function existe(rng) {
    const p = rng.elegir([1, 2, 3]), q = rng.elegir([1, 2, 3]), n = rng.entero(4, 9);
    if (p === 2 && q === 1 && (n === 5 || n === 6)) return null;   // la predicción y el juego
    const kr = p * n / (p + q), si = Number.isInteger(kr), k = si ? kr : Math.round(kr);
    if (!si && (k < 1 || k >= n)) return null;
    const dice = L => `Sí, el de lugar ${L}`;
    return {
      enunciado: [`Se desarrolla ${bin3(p, 1, q)}${sup(n)}.`], pregunta: ['¿Tiene término independiente? Si lo tiene, ¿en qué lugar está?'],
      datos: [D.general, D.negativo, D.potPot, D.cero], correcta: si ? dice(k + 1) : 'No tiene',
      errores: si ? [
        e('IDX', dice(k), t => `Bien k = ${k}, pero el lugar es k + 1, porque el lugar 1 es el de k = 0; no es «${t}».`, doc),
        e('TAL-BN-NUNCA', 'No tiene', t => `Bien plantear el exponente, pero da k = ${k}, que es natural y cabe entre 0 y ${n}; «${t}» no es cierto.`),
        e('TAL-BN-LUGAR-INV', dice(n - k + 1), t => `Bien k = ${k}, pero los lugares se cuentan desde el término de x${sup(p * n)}; «${t}» cuenta desde el final.`),
        e('TAL-BN-LUGAR', dice(k + 2), t => `Bien k = ${k}, pero el lugar es k + 1 y no k + 2; no es «${t}».`),
      ] : [
        e('TAL-BN-REDONDEA', dice(k + 1), t => `Bien plantear el exponente, pero da k = ${qTxt(Q(p * n, p + q))}, que no es natural, y k no se redondea; no es «${t}».`),
        e('TAL-BN-SIEMPRE', dice(Math.floor(n / 2) + 1), t => `Bien buscar al medio, pero no siempre hay término sin x: hay que despejar k, y aquí no sale natural; no es «${t}».`),
        e('TAL-BN-REDONDEA', dice(k + (k < kr ? 2 : 0) || 1), t => `Bien igualar a 0, pero k = ${qTxt(Q(p * n, p + q))} no puede contar veces, así que ningún lugar sirve; no es «${t}».`),
        e('TAL-BN-MITAD', dice(Math.ceil((n + 1) / 2) + 1), t => `Bien buscar el equilibrio, pero los exponentes ${p} y ${q} no se compensan en ningún lugar; no es «${t}».`),
      ],
      solucion: [[`Al igualar a 0 el exponente ${uno(p)}(${n} − k) − ${uno(q)}k sale k = ${si ? k : `${qTxt(Q(p * n, p + q))}`}.`], si ? ['El lugar es k + 1: ', Tr(dice(k + 1)), '.'] : [Tr('No tiene'), ', porque k no es natural.']],
      _datos: { p, q, n },
    };
  }
  function indep(rng) {
    const p = rng.elegir([1, 2, 3]), q = rng.elegir([1, 2]), c = rng.elegir([1, 2, 3, -1, -2]), m = rng.entero(1, 3);
    const k = p * m, n = (p + q) * m;
    if (n > 9 || k >= n || (p === 2 && q === 1 && n === 6 && c === 1)) return null;
    const val = C(n, k) * c ** k;
    if (Math.abs(val) > 20000) return null;
    return {
      enunciado: [`Se desarrolla ${bin3(p, c, q)}${sup(n)}.`], pregunta: ['¿Cuál es el término independiente?'],
      datos: [D.general, D.comb, D.negativo, D.potPot, D.cero], correcta: f(val),
      errores: [
        c !== 1 ? e('TAL-BN-SINC', f(C(n, k)), t => `Bien k = ${k} y C(${n}, ${k}) = ${t}, pero b trae el número ${f(c)}, que entra elevado a ${k}.`) : null,
        e('IDX', f(C(n, k - 1) * c ** (k - 1)), t => `Bien el exponente de x, pero b sale k = ${k} veces, y ${t} usa ${k - 1}.`, doc),
        c !== 1 && c !== -1 ? e('BLO', f(C(n, k) * c), t => `Bien C(${n}, ${k}), pero el ${f(c)} de b se elige ${k} veces y entra elevado a ${k}; por eso no es ${t}.`, doc) : null,
        c < 0 ? e('SIG', f(-val), t => `Bien el valor, pero (${f(c)})${sup(k)} tiene exponente ${k % 2 ? 'impar' : 'par'}, y eso decide el signo; por eso no es ${t}.`, doc) : null,
        e('TAL-BN-MITAD', f(C(n, Math.floor(n / 2)) * c ** Math.floor(n / 2)), t => `Bien la cuenta, pero el término independiente no tiene por qué estar al medio: ${t} usa k = ${Math.floor(n / 2)}.`),
        e('TAL-BN-LUGAR', f(C(n, k + 1) * c ** (k + 1)), t => `Bien la fórmula, pero con k = ${k + 1} sale ${t}, y ese término todavía tiene x.`),
      ],
      solucion: [[`El exponente de x es ${uno(p)}(${n} − k) − ${uno(q)}k, y al igualarlo a 0 sale k = ${k}.`], [`C(${n}, ${k}) · ${par(c)}${sup(k)} = `, Tr(f(val)), '.']],
      _datos: { p, q, c, n },
    };
  }
  function coefXm(rng) {
    const p = rng.elegir([2, 3]), c = rng.elegir([1, 2, -1, -2, 3]), n = rng.entero(4, 8), k = rng.entero(1, n - 2), m = p * (n - k) - k;
    if (m <= 0 || (p === 2 && c === 1 && (n === 5 || n === 6))) return null;
    const val = C(n, k) * c ** k;
    if (Math.abs(val) > 20000) return null;
    return {
      enunciado: [`Se desarrolla ${bin3(p, c, 1)}${sup(n)}.`], pregunta: [`¿Cuál es el coeficiente de ${pot('x', m)}?`],
      datos: [D.general, D.comb, D.negativo, D.potPot, D.producto], correcta: f(val),
      errores: [
        c !== 1 ? e('TAL-BN-SINC', f(C(n, k)), t => `Bien k = ${k}, pero el ${f(c)} de b también entra, elevado a ${k}; por eso no es ${t}.`) : null,
        e('IDX', f(C(n, k + 1) * c ** (k + 1)), t => `Bien igualar el exponente, pero ${p}(${n} − k) − k = ${m} da k = ${k}, y ${t} usa otro k.`, doc),
        c < 0 ? e('SIG', f(-val), t => `Bien el valor, pero (${f(c)})${sup(k)} tiene exponente ${k % 2 ? 'impar' : 'par'}, y eso decide el signo; por eso no es ${t}.`, doc) : null,
        c !== 1 && c !== -1 ? e('BLO', f(C(n, k) * c), t => `Bien C(${n}, ${k}), pero el ${f(c)} de b se elige ${k} veces y entra elevado a ${k}; por eso no es ${t}.`, doc) : null,
        e('EXP', f(C(n, k - 1) * c ** (k - 1)), t => `Bien el método, pero el exponente se calcula con ${p}(${n} − k) − k, y ${t} usa k = ${k - 1}.`, doc),
      ],
      solucion: [[`El exponente de x es ${p}(${n} − k) − k; al igualarlo a ${m} sale k = ${k}.`], [`C(${n}, ${k}) · ${par(c)}${sup(k)} = `, Tr(f(val)), '.']],
      _datos: { p, c, n, m },
    };
  }
  function param(rng) {
    // k par: m y −m cumplen mᵏ = …
    const [p, q, mm] = rng.elegir([[2, 1, 2], [1, 1, 2], [1, 2, 2], [2, 1, 1], [1, 1, 1]]), k = p * mm, n = (p + q) * mm, m = rng.elegir([2, 3]);
    const val = C(n, k) * m ** k;
    if (val > 50000 || (p === 2 && q === 1 && mm === 2 && m === 2)) return null;   // (x² + m/x)⁶ con 240 es un ejemplo de la idea 3
    return {
      enunciado: [`El término independiente de ${bin3(p, 1, q).replace('1/', 'm/')}${sup(n)}, con m positivo, es ${f(val)}.`], pregunta: ['¿Cuánto vale m?'],
      datos: [D.general, D.comb, D.negativo, D.potPot, D.cero], correcta: f(m),
      errores: [
        e('TAL-BN-RAIZ', f(m ** k), t => `Bien planteado hasta m${sup(k)} = ${t}, pero falta sacar la raíz de índice ${k}: m no es ${t}.`),
        k === 4 ? e('TAL-BN-RAIZ', f(m * m), t => `Bien m⁴ = ${m ** 4}, pero la raíz que se saca es cuarta, no cuadrada; por eso m no es ${t}.`) : null,
        e('TAL-BN-SINC', f(C(n, k)), t => `Bien k = ${k}, pero ${t} es solo C(${n}, ${k}); m sale de dividir entre ese número y sacar la raíz.`),
        e('TAL-BN-POSITIVO', f(-m), t => `Bien m${sup(k)} = ${f(m ** k)}, y ${t} también lo cumple, pero el enunciado pide m positivo.`),
        e('TAL-BN-RAIZ', f(m ** k / 2), t => `Bien m${sup(k)} = ${m ** k}, pero sacar la raíz no es dividir entre 2; por eso m no es ${t}.`),
      ],
      solucion: [[`El término sin x tiene k = ${k}, y vale C(${n}, ${k})m${sup(k)} = ${f(C(n, k))}m${sup(k)}.`], [`m${sup(k)} = ${f(m ** k)}, así que m = `, Tr(f(m)), '.']],
      _datos: { p, q, n, k, m },
    };
  }

  // ======================= Idea 4: cuántos términos y cuánto suman =======================
  function cuantos(rng) {
    const n = rng.entero(5, 15), A = rng.elegir(['x²', 'x³', '2x', 'x']), B = rng.elegir(['3y', 'y²', '5', '1/x']);
    return {
      enunciado: [`Se desarrolla (${A} + ${B})${sup(n)}.`], pregunta: ['¿Cuántos términos tiene?'],
      datos: [D.terminos], correcta: f(n + 1),
      errores: [
        e('TAL-BN-N', f(n), t => `Bien mirar el exponente, pero k va de 0 a ${n}, y eso da ${n} + 1 valores; no son ${t}.`),
        e('TAL-BN-N2', f(n + 2), t => `Bien sumarle algo al exponente, pero de 0 a ${n} hay ${n} + 1 números, no ${t}.`),
        e('TAL-BN-EXPONENTES', f(2 * n), t => `Bien que el binomio tiene dos términos, pero el desarrollo no tiene 2 · ${n} = ${t}: tiene uno por cada valor de k.`),
        e('TAL-BN-N', f(n - 1), t => `Bien mirar el exponente, pero no se le resta 1: k va de 0 a ${n}, así que no son ${t}.`),
      ],
      solucion: [[`k va de 0 a ${n}, y hay un término por cada valor de k.`], [`${n} + 1 = `, Tr(f(n + 1)), '.']],
      _datos: { n },
    };
  }
  function central(rng) {
    const n = rng.elegir([4, 6, 8]), p = rng.elegir([1, 2]), c = rng.elegir([1, 2, 3, -1, -2]), h = n / 2;
    if (n === 6 && p === 1 && c === -2) return null;
    const t = C(n, h) * c ** h;
    if (Math.abs(t) > 20000) return null;
    const bas = `(${pot('x', p)} ${c < 0 ? '−' : '+'} ${Math.abs(c)})`;
    return {
      enunciado: [`Se desarrolla ${bas}${sup(n)}.`], pregunta: ['¿Cuál es su término central?'],
      datos: [D.terminos, D.central, D.general, D.comb], correcta: mono(t, p * h),
      errores: [
        e('IDX', mono(C(n, h - 1) * c ** (h - 1), p * (h + 1)), x => `Bien el lugar ${h + 1}, pero ahí k = ${h}, porque el lugar va uno adelante de k; ${x} usa ${h - 1}.`, doc),
        c !== 1 && c !== -1 ? e('BLO', mono(C(n, h) * c, p * h), x => `Bien C(${n}, ${h}), pero el ${f(c)} de b se elige ${h} veces y entra elevado a ${h}; por eso no es ${x}.`, doc) : null,
        c < 0 ? e('SIG', mono(-t, p * h), x => `Bien el valor, pero (${f(c)})${sup(h)} tiene exponente ${h % 2 ? 'impar' : 'par'}, y eso decide el signo; por eso no es ${x}.`, doc) : null,
        p > 1 ? e('EXP', mono(t, p + h), x => `Bien el número, pero (x${sup(p)})${sup(h)} = x${sup(p * h)}: en una potencia de potencia los exponentes se multiplican, y ${x} los suma.`, doc) : null,
        e('TAL-BN-LUGAR', mono(C(n, h + 1) * c ** (h + 1), p * (h - 1)), x => `Bien la fórmula, pero el central tiene k = ${h}, y ${x} usa ${h + 1}.`),
      ],
      solucion: [[`El desarrollo tiene ${n + 1} términos, así que el central está en el lugar ${h + 1}, con k = ${h}.`], [`C(${n}, ${h}) · ${p > 1 ? `(x${sup(p)})${sup(h)}` : `x${sup(h)}`} · ${par(c)}${sup(h)} = `, Tr(mono(t, p * h)), '.']],
      _datos: { n, p, c },
    };
  }
  function suma(rng) {
    const n = rng.entero(3, 7), p = rng.elegir([2, 3, 4]), q = rng.elegir([-1, -2, -3, 1, 2]);
    if (p + q === 2 || (p === 2 && q === -1 && n === 5)) return null;
    const s = (p + q) ** n;
    if (Math.abs(s) > 20000) return null;
    return {
      enunciado: [`Se desarrolla ${binx(p, q)}${sup(n)}.`], pregunta: ['¿Cuánto suman sus coeficientes?'],
      datos: [D.suma, D.terminos], correcta: f(s),
      errores: [
        e('TAL-BN-DOS', f(2 ** n), t => `Bien que los coeficientes de (a + b)${sup(n)} suman 2${sup(n)} = ${t}, pero aquí a y b traen números, y hay que poner x = 1 en este binomio.`),
        q < 0 ? e('TAL-BN-ABS', f((p - q) ** n), t => `Bien poner x = 1, pero el ${f(q)} va con su signo; sin él sale ${t}.`) : null,
        e('TAL-BN-CERO', f(q ** n), t => `Bien reemplazar x por un número, pero con x = 0 queda solo el último término, ${t}; la suma pide x = 1.`),
        e('TAL-BN-PRIMERO', f(p ** n), t => `Bien elevar a ${n}, pero ${t} es solo el primer coeficiente, no la suma de todos.`),
      ],
      solucion: [['Con x = 1, cada término vale su coeficiente, y el binomio da la suma de una vez.'], [`(${p} ${q < 0 ? '−' : '+'} ${Math.abs(q)})${sup(n)} = `, Tr(f(s)), '.']],
      _datos: { n, p, q },
    };
  }
  function nSuma(rng) {
    const [p, q] = rng.elegir([[3, -1], [1, 1], [2, 1], [1, 2], [5, -2]]), b = p + q, n = rng.entero(4, 8), s = b ** n;
    if (s > 50000) return null;
    const bas = `(${p === 1 ? '' : p}x ${q < 0 ? '−' : '+'} ${Math.abs(q) === 1 ? '' : Math.abs(q)}y)`;
    return {
      enunciado: [`Los coeficientes del desarrollo de ${bas}ⁿ suman ${f(s)}.`], pregunta: ['¿Cuántos términos tiene?'],
      datos: [D.suma, D.terminos], correcta: f(n + 1),
      errores: [
        e('OBJ', f(n), t => `Bien hallado n = ${t}, pero piden cuántos términos tiene el desarrollo, y son n + 1.`, doc),
        e('TAL-BN-N2', f(n + 2), t => `Bien n = ${n}, pero de k = 0 a k = ${n} hay ${n} + 1 valores, no ${t}.`),
        e('TAL-BN-SIN-DESPEJAR', f(b), t => `Bien poner las letras en 1, que deja ${t}ⁿ, pero falta despejar n de esa potencia y sumarle 1.`),
        e('TAL-BN-EXPONENTES', f(s / b), t => `Bien plantear ${b}ⁿ = ${f(s)}, pero n es el exponente al que se eleva ${b}, no ${t}.`),
      ],
      solucion: [[`Con x = y = 1 queda ${b}ⁿ = ${f(s)}, así que n = ${n}, y los términos son n + 1.`], [`${n} + 1 = `, Tr(f(n + 1)), '.']],
      _datos: { p, q, n },
    };
  }

  // ======================= Idea 5: exponente que no es natural =======================
  const ALFAS = [[1, 2], [-1, 2], [1, 3], [-2, 1], [-3, 1], [3, 2], [-1, 3], [2, 3], [-1, 1]];
  function termina(rng) {
    const nat = rng.entero(0, 1) === 1, al = nat ? [rng.entero(3, 8), 1] : rng.elegir(ALFAS);
    if (!nat && al[0] === 1 && al[1] === 2) return null;   // la predicción
    const NT = 'No termina', base = al[1] === 1 ? Math.abs(al[0]) : Math.floor(Math.abs(al[0] / al[1]));
    return {
      enunciado: [`Se desarrolla ${altAl(al)}.`], pregunta: ['¿Cuántos términos tiene?'],
      datos: [D.natural, D.alfa], correcta: nat ? f(al[0] + 1) : NT,
      errores: nat ? [
        e('TAL-BN-N', f(al[0]), t => `Bien que termina, pero k va de 0 a ${al[0]}, y eso da ${al[0]} + 1 términos; no son ${t}.`),
        e('TAL-BN-FINITO', NT, t => `Bien mirar los factores, pero ${al[0]} es natural y el factor ${al[0]} − ${al[0]} = 0 corta el desarrollo; «${t}» no es cierto.`),
        e('TAL-BN-N2', f(al[0] + 2), t => `Bien que termina, pero de 0 a ${al[0]} hay ${al[0]} + 1 valores, no ${t}.`),
        e('TAL-BN-EXPONENTES', f(2 * al[0]), t => `Bien que termina, pero los términos son ${al[0]} + 1, no 2 · ${al[0]} = ${t}.`),
      ] : [
        e('GEN', f(base + 1), t => `Bien la idea de α + 1, pero solo vale con α natural, y ${qTxt(al)} no lo es; por eso no son ${t}.`, doc),
        e('GEN', f(base + 2), t => `Bien buscar dónde se corta, pero si α no es natural, ningún factor llega a 0; por eso no son ${t}.`, doc),
        e('TAL-BN-DOS-TERM', f(base + 3), t => `Bien los primeros términos, pero después siguen otros sin parar; por eso no son ${t}.`),
        e('TAL-BN-FINITO', f(base + 4), t => `Bien contar, pero con α = ${qTxt(al)} ningún coeficiente vale 0, así que no son ${t}.`),
      ],
      solucion: nat ? [[`α = ${al[0]} es natural, y el factor ${al[0]} − ${al[0]} = 0 anula todos los términos desde x${sup(al[0] + 1)}.`], [`${al[0]} + 1 = `, Tr(f(al[0] + 1)), '.']]
        : [[`α = ${qTxt(al)} no es natural, así que los factores nunca llegan a 0 y el desarrollo no termina.`], [Tr(NT), '.']],
      _datos: { al },
    };
  }
  function x2(rng) {
    const al = rng.elegir(ALFAS), c = coefAl(al, 2), sinF = qm(al, Q(al[0] - al[1], al[1])), cuad = qm(Q(al[0] * al[0], al[1] * al[1]), [1, 2]);
    return {
      enunciado: [`Se desarrolla ${altAl(al)}.`], pregunta: ['¿Cuál es el coeficiente de x²?'],
      datos: [D.alfa, D.fact], correcta: qTxt(c),
      errores: [
        e('FAC', qTxt(sinF), t => `Bien calculado α(α − 1) = ${t}, pero falta dividir entre 2! = 2.`, doc),
        e('GEN', '0', t => `Bien que con α natural se cortaría, pero ${qTxt(al)} no es natural, así que el coeficiente no es ${t}.`, doc),
        e('SIG', qTxt(Q(-c[0], c[1])), t => `Bien el valor, pero α − 1 trae su signo, y eso cambia el del resultado; no es ${t}.`, doc),
        e('TAL-BN-ALFA2', qTxt(cuad), t => `Bien dividir entre 2, pero el segundo factor es α − 1, no α otra vez; por eso no es ${t}.`),
        e('TAL-BN-DOS-TERM', qTxt(al), t => `Bien que ${t} es α, el coeficiente de x, pero se pide el de x².`),
      ],
      solucion: [[`Con k = 2, el coeficiente es α(α − 1)/2!, y aquí α = ${qTxt(al)}.`], [`(${qTxt(al)})(${qTxt(Q(al[0] - al[1], al[1]))})/2 = `, Tr(qTxt(c)), '.']],
      _datos: { al },
    };
  }
  function x3(rng) {
    const al = rng.elegir(ALFAS), c = coefAl(al, 3), prod = qm(c, [6, 1]), tres = qm(prod, [1, 3]);
    return {
      enunciado: [`Se desarrolla ${altAl(al)}.`], pregunta: ['¿Cuál es el coeficiente de x³?'],
      datos: [D.alfa, D.fact], correcta: qTxt(c),
      errores: [
        e('FAC', qTxt(prod), t => `Bien el producto de los tres factores, ${t}, pero falta dividir entre 3! = 6.`, doc),
        e('FAC', qTxt(tres), t => `Bien dividir, pero entre 3! = 6 y no entre 3; por eso no es ${t}.`, doc),
        e('SIG', qTxt(Q(-c[0], c[1])), t => `Bien el valor, pero hay que contar los factores negativos, porque deciden el signo; no es ${t}.`, doc),
        e('GEN', '0', t => `Bien que con α natural se cortaría, pero ${qTxt(al)} no es natural, así que el coeficiente no es ${t}.`, doc),
        e('TAL-BN-LUGAR', qTxt(coefAl(al, 2)), t => `Bien la fórmula, pero ${t} es el coeficiente de x², y para x³ falta un factor más.`),
      ],
      solucion: [['El coeficiente de x³ es α(α − 1)(α − 2)/3!: tres factores que bajan de 1 en 1, entre 3!.'], [`${[0, 1, 2].map(i => `(${qTxt(Q(al[0] - i * al[1], al[1]))})`).join('')}/6 = `, Tr(qTxt(c)), '.']],
      _datos: { al },
    };
  }
  function aprox(rng) {
    const al = rng.elegir([[1, 2], [-1, 2], [-1, 1]]), mm = rng.elegir([2, 4, 6, 10]), x = Q(mm, 100);
    const t1 = qm(al, x), t2 = qm(coefAl(al, 2), qm(x, x));
    const bien = qs(qs([1, 1], t1), t2), dos = qs([1, 1], t1), sig = qs(dos, Q(-t2[0], t2[1])), fac = qs(dos, qm(t2, [2, 1]));
    const uno1 = dec(qs([1, 1], x));
    const base = al[1] === 2 ? (al[0] > 0 ? `√${uno1}` : `1/√${uno1}`) : `1/${uno1}`;
    if (al[0] === 1 && al[1] === 2 && mm === 4) return null;   // √1,04 es un ejemplo de la teoría
    return {
      enunciado: [`Se usan los tres primeros términos de ${altAl(al)} con x = ${dec(x)}.`], pregunta: [`¿Cuánto da ${base}, aproximado?`],
      datos: [D.alfa, `${base} = ${altAl(al).replace('(1 + x)', `(1 + ${dec(x)})`)}`, D.vale], correcta: dec(bien),
      errores: [
        e('TAL-BN-DOS-TERM', dec(dos), t => `Bien 1 + αx = ${t}, pero piden tres términos, y falta el de x².`),
        e('SIG', dec(sig), t => `Bien los dos primeros términos, pero el de x² lleva el coeficiente ${qTxt(coefAl(al, 2))}, con su signo; por eso no es ${t}.`, doc),
        e('FAC', dec(fac), t => `Bien α(α − 1), pero el coeficiente de x² todavía se divide entre 2!; por eso no es ${t}.`, doc),
        e('TAL-BN-SIN-RAIZ', dec(qs([1, 1], x)), t => `Bien partir de 1 + x = ${t}, pero falta elevar a α = ${qTxt(al)}.`),
      ],
      solucion: [[`Los tres primeros términos son 1 + αx + α(α − 1)x²/2, con α = ${qTxt(al)}.`], [`1 ${t1[0] < 0 ? '−' : '+'} ${dec(Q(Math.abs(t1[0]), t1[1]))} ${t2[0] < 0 ? '−' : '+'} ${dec(Q(Math.abs(t2[0]), t2[1]))} = `, Tr(dec(bien)), '.']],
      _datos: { al, x: mm },
    };
  }

  // ======================= Idea 6: la potencia de un trinomio =======================
  const multi = (n, p, q, r) => Math.round(fact(n) / (fact(p) * fact(q) * fact(r)));
  const abc = (p, q, r, L = ['a', 'b', 'c']) => `${pot(L[0], p)}${pot(L[1], q)}${pot(L[2], r)}`;
  function multiT(rng) {
    const n = rng.entero(4, 7), p = rng.entero(1, n - 2), q = rng.entero(1, n - p - 1), r = n - p - q;
    if (r < 1 || (n === 6 && p === 2 && q === 2)) return null;
    const c = multi(n, p, q, r);
    return {
      enunciado: [`Se desarrolla (a + b + c)${sup(n)}.`], pregunta: [`¿Cuál es el coeficiente de ${abc(p, q, r)}?`],
      datos: [D.multi, D.fact], correcta: f(c),
      errores: [
        e('ORD', f(fact(n)), t => `Bien ${n}! = ${t}, pero cambiar de lugar letras iguales no hace otra elección, así que hay que dividir.`, doc),
        e('FAC', f(fact(n) / (fact(p) * fact(q))), t => `Bien dividir entre ${p}! y ${q}!, pero falta dividir también entre ${r}!; por eso no es ${t}.`, doc),
        e('TAL-BN-DOS-LETRAS', f(C(n, p)), t => `Bien elegir los ${p} paréntesis de a, C(${n}, ${p}) = ${t}, pero falta repartir los otros entre b y c.`),
        e('TAL-BN-DOS-LETRAS', f(C(n, q)), t => `Bien elegir los ${q} paréntesis de b, ${t}, pero falta repartir los demás entre a y c.`),
      ],
      solucion: [[`Se reparten los ${n} paréntesis: ${p} para a, ${q} para b y ${r} para c.`], [`${n}!/(${p}! ${q}! ${r}!) = `, Tr(f(c)), '.']],
      _datos: { n, p, q, r },
    };
  }
  function terminos(rng) {
    const n = rng.entero(3, 12), t = C(n + 2, 2);
    return {
      enunciado: [`Se desarrolla (x + y + z)${sup(n)}.`], pregunta: ['¿Cuántos términos tiene?'],
      datos: [D.terminosTri, D.comb], correcta: f(t),
      errores: [
        e('TAL-BN-TERM-BIN', f(n + 1), t2 => `Bien n + 1 = ${t2} para un binomio, pero con tres letras hay más maneras de repartir el exponente.`),
        e('TAL-BN-TERM-3N', f(3 * n), t2 => `Bien que hay tres letras, pero los términos no son 3 · ${n} = ${t2}: son C(${n + 2}, 2).`),
        e('TAL-BN-LUGAR', f(C(n + 1, 2)), t2 => `Bien usar un combinatorio, pero el que cuenta los términos es C(${n + 2}, 2), no C(${n + 1}, 2) = ${t2}.`),
        e('TAL-BN-LUGAR', f(C(n + 3, 2)), t2 => `Bien usar un combinatorio, pero el que cuenta los términos es C(${n + 2}, 2), no C(${n + 3}, 2) = ${t2}.`),
      ],
      solucion: [[`El número de términos es C(n + 2, 2), y aquí n = ${n}.`], [`C(${n + 2}, 2) = ${n + 2} · ${n + 1}/2 = `, Tr(f(t)), '.']],
      _datos: { n },
    };
  }
  function triNum(rng) {
    const n = rng.entero(4, 6), m = rng.elegir([2, 3, -2]), p = rng.entero(1, n - 2), q = rng.entero(1, n - p - 1), r = n - p - q;
    if (r < 1) return null;
    const base = multi(n, p, q, r), c = base * m ** q;
    return {
      enunciado: [`Se desarrolla (x ${m < 0 ? '−' : '+'} ${Math.abs(m)}y + z)${sup(n)}.`], pregunta: [`¿Cuál es el coeficiente de ${abc(p, q, r, ['x', 'y', 'z'])}?`],
      datos: [D.multi, D.fact, D.potProd], correcta: f(c),
      errores: [
        e('BLO', f(base), t => `Bien ${n}!/(${p}! ${q}! ${r}!) = ${t}, pero el ${f(m)} de ${f(m)}y también entra, elevado a ${q}.`, doc),
        q > 1 ? e('BLO', f(base * m), t => `Bien que entra el ${f(m)}, pero y se elige ${q} veces, así que va elevado a ${q}; por eso no es ${t}.`, doc) : null,
        m < 0 ? e('SIG', f(-c), t => `Bien el valor, pero (${f(m)})${sup(q)} tiene exponente ${q % 2 ? 'impar' : 'par'}, y eso decide el signo; por eso no es ${t}.`, doc) : null,
        e('ORD', f(fact(n) * m ** q), t => `Bien el ${f(m)}${sup(q)}, pero ${n}! cuenta en orden y hay que dividir entre ${p}! ${q}! ${r}!; por eso no es ${t}.`, doc),
        e('FAC', f(fact(n) / (fact(p) * fact(q)) * m ** q), t => `Bien el ${f(m)}${sup(q)}, pero falta dividir también entre ${r}!; por eso no es ${t}.`, doc),
      ],
      solucion: [[`Hay ${f(base)} maneras de repartir los paréntesis, y cada una trae (${f(m)}y)${sup(q)}.`], [`${f(base)} · ${par(m)}${sup(q)} = `, Tr(f(c)), '.']],
      _datos: { n, m, p, q, r },
    };
  }
  function indepTri(rng) {
    const n = rng.entero(3, 5), c = rng.elegir([1, 2, 3]);
    // (x + 1/x + c)ⁿ: sin x pide tantas x como 1/x: p de cada una y n − 2p veces c.
    const casos = []; for (let p = 0; 2 * p <= n; p++) casos.push(multi(n, p, p, n - 2 * p) * c ** (n - 2 * p));
    const val = casos.reduce((a, b) => a + b, 0);
    if (n === 4 && c === 1) return null;   // es un ejemplo de la teoría
    return {
      enunciado: [`Se desarrolla (x + 1/x + ${c})${sup(n)}.`], pregunta: ['¿Cuál es su término independiente?'],
      datos: [D.multi, D.fact, D.negativo, D.cero], correcta: f(val),
      errores: [
        e('TAL-BN-UN-CASO', f(casos[0]), t => `Bien el caso sin x ni 1/x, ${t}, pero también sirven los repartos con tantas x como 1/x.`),
        e('TAL-BN-UN-CASO', f(casos[1]), t => `Bien el caso con una x y una 1/x, ${t}, pero hay otros repartos sin x que también cuentan.`),
        e('TAL-BN-UN-CASO', f(val - casos[casos.length - 1]), t => `Bien sumar repartos, pero falta el de más parejas de x con 1/x; por eso no es ${t}.`),
        e('TAL-BN-TRES', f((c + 2) ** n), t => `Bien poner x = 1, pero eso da la suma de coeficientes, ${t}, y no el término independiente.`),
      ],
      solucion: [[`Para que no quede x, x y 1/x tienen que salir las mismas veces: ${casos.map((_, p) => `${p} y ${p}`).join(', ')}.`], [`${casos.map(f).join(' + ')} = `, Tr(f(val)), '.']],
      _datos: { n, c },
    };
  }

  const CONSTRUIR = {
    coef, fila, cenefas, iguales,
    termino, 'coef-signo': coefSigno, lugar, 'n-termino': nTermino,
    existe, indep, 'coef-xm': coefXm, param,
    cuantos, central, suma, 'n-suma': nSuma,
    termina, x2, x3, aprox,
    multi: multiT, terminos, 'tri-num': triNum, 'indep-tri': indepTri,
  };

  return { id: ID, titulo: 'Binomio de Newton', generar, TIPOS_POR_IDEA, NIVEL, TIPOS: Object.keys(CONSTRUIR) };
});
