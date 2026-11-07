/*
 * Motor de «Las fichas en los aros»: conjuntos.
 *
 * CABECERA: clave, conjunto, texto, union, interseccion, diferencia, complemento, diferenciaSimetrica, incluido,
 *           pertenece, iguales, disjuntos, afirmar, potencia, potenciaCantidad, elementosPorSubconjuntos, arbol,
 *           cartesiano, parIgual, extension, zonasDe, zonasOperacion, operar, regiones, contar, cardinales, deFichas, nombreZona,
 *           alMenosUno, soloUno, interseccionPorComplemento, ningunoTres, cuantosSubconjuntos, agregarElemento,
 *           cuantosPares, diferencias, aros, carroll, zonaDe, layout
 *
 * Aquí vive toda la matemática de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el navegador
 * (window.MotorConjuntos) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 * Todo se cuenta con enteros exactos; el número de subconjuntos va con BigInt (2ⁿ crece rápido) y sale como texto.
 *
 * La idea de la escena: cada alumno es una ficha que se arrastra dentro de aros que se cruzan. Cada región del
 * diagrama de Venn (o cada casilla del diagrama de Carroll) cuenta sus fichas; cada aro cuenta todas las que tiene
 * dentro, también las que comparte con otro aro.
 *
 * Elementos y conjuntos (un conjunto es una lista; un elemento es un número, un texto, un conjunto o un par { par: [x, y] })
 *   clave(e)                     texto único que identifica a un elemento (dos conjuntos con los mismos elementos, igual clave)
 *   conjunto(lista)              sin repetidos y en orden (números, textos, conjuntos por tamaño, pares)
 *   texto(e)                     cómo se escribe: «{1, 2}», «∅», «(2, 3)», «{∅}»
 *   union, interseccion, diferencia(A, B) = A − B, complemento(A, U) = A′, diferenciaSimetrica(A, B) = A Δ B
 *   incluido(A, B) A ⊂ B         pertenece(x, A) x ∈ A        iguales(A, B)        disjuntos(A, B)
 *   afirmar(x, rel, Y)           ¿es cierto «x rel Y»? rel: '∈', '∉', '⊂', '⊄', '='
 *   extension({ desde, hasta, condicion, forma })   de comprensión a extensión: { forma(x) / desde ≤ x ≤ hasta, condición }
 * Conjunto potencia y producto cartesiano
 *   potencia(A)                  P(A): la lista (si n ≤ 12), 2ⁿ subconjuntos y 2ⁿ − 1 propios (también como texto, con BigInt)
 *   potenciaCantidad(n)          solo las cantidades, para cualquier n
 *   elementosPorSubconjuntos(k, propios)   el n con 2ⁿ = k (o 2ⁿ − 1 = k); sin solución si k no es una potencia de 2
 *   arbol(A)                     el árbol «entra o no entra»: cada nivel y las 2ⁿ hojas en el orden del árbol (primero entra)
 *   cartesiano(A, B)             A × B: los pares en filas (una por elemento de A), y su cantidad
 *   parIgual(p, q)               (a, b) = (c, d) solo si a = c y b = d
 * Regiones (diagramas de Venn de 2 y 3 aros)
 *   zonasDe(clave, n)            qué regiones suma un dato: 'A', 'AB' (A ∩ B), 'ABC', 'U', 'soloA', 'soloAB', 'AmenosB',
 *                                'noA', 'noAB' (ni A ni B), 'ninguno', 'union', 'exactamenteUno', 'exactamenteDos', 'alMenosDos'
 *   regiones(datos)              resuelve las regiones desde datos de academia (sistema lineal con fracciones exactas):
 *                                cuáles quedan fijas, cuáles faltan, y la razón si los datos se contradicen, dan una región
 *                                negativa o con fracción
 *   contar(regiones, clave), cardinales(regiones)   n(A), n(A ∩ B), n(A ∪ B), … desde las regiones
 *   deFichas(fichas, n)          cuenta las fichas de cada región (cada ficha dice en qué aros está)
 *   nombreZona(z, n)             «dentro de A y de B», «fuera de los dos aros», …
 *   zonasOperacion(op, n), operar(op, { A, B, C, U })   las regiones de A ∪ B, A − B, … y el resultado con listas
 * Predicciones (cada una con «errores»: lo que da cada error típico)
 *   alMenosUno(nA, nB, nAB), soloUno(nA, nB, nAB), interseccionPorComplemento(U, nA, nB, ninguno), ningunoTres(datos),
 *   cuantosSubconjuntos(n), agregarElemento(n), cuantosPares(A, B), diferencias(A, B)
 * Para el dibujo (la escena solo pinta)
 *   aros(n, W, H, o)             los aros de un Venn de 2 (que se cruzan, B dentro de A o separados) o 3 aros
 *   carroll(n, W, H, o)          las casillas de un diagrama de Carroll (2 filas: A y no A)
 *   zonaDe(geo, p)               en qué región cae un punto
 *   layout(geo, cuentas, o)      dónde va cada ficha: en su región, sin encimarse, lejos de los bordes de los aros y del
 *                                rótulo con la cuenta de la región; el radio de las fichas baja si no caben
 *
 * Los campos «errores» dicen lo que da cada error típico. Un error que en un caso daría la respuesta correcta (o lo mismo
 * que otro error anterior) no aparece: así la escena nunca tiene dos opciones iguales.
 * El informe de aritmética (docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md) no trae errores de conjuntos:
 * todos son hipótesis nuestras.
 */
(function (root, fabrica) {
  const api = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.MotorConjuntos = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // ---------- elementos ----------
  const esPar = e => !!e && typeof e === 'object' && !Array.isArray(e) && Array.isArray(e.par) && e.par.length === 2;
  function clave(e) {
    if (typeof e === 'number') {
      if (!Number.isFinite(e)) throw new Error('un elemento debe ser un número finito');
      return 'n:' + (Object.is(e, -0) ? 0 : e);
    }
    if (typeof e === 'string') return 's:' + e;
    if (Array.isArray(e)) return '{' + [...new Set(e.map(clave))].sort().join(',') + '}';
    if (esPar(e)) return '(' + clave(e.par[0]) + ';' + clave(e.par[1]) + ')';
    throw new Error('elemento no válido: debe ser un número, un texto, un conjunto o un par');
  }
  const tipo = e => (typeof e === 'number' ? 0 : typeof e === 'string' ? 1 : Array.isArray(e) ? 2 : 3);
  function orden(a, b) {
    const ta = tipo(a), tb = tipo(b);
    if (ta !== tb) return ta - tb;
    if (ta === 0) return a - b;
    if (ta === 1) return a < b ? -1 : a > b ? 1 : 0;
    if (ta === 2) {
      const A = conjunto(a), B = conjunto(b);
      if (A.length !== B.length) return A.length - B.length;
      for (let i = 0; i < A.length; i++) { const c = orden(A[i], B[i]); if (c) return c; }
      return 0;
    }
    return orden(a.par[0], b.par[0]) || orden(a.par[1], b.par[1]);
  }
  function conjunto(lista) {
    if (!Array.isArray(lista)) throw new Error('un conjunto debe ser una lista');
    const vistos = new Set(), out = [];
    for (const e of lista) { const k = clave(e); if (!vistos.has(k)) { vistos.add(k); out.push(e); } }
    return out.sort(orden);
  }
  const num = x => String(x).replace('-', '−').replace('.', ',');
  function texto(e) {
    if (typeof e === 'number') return num(e);
    if (typeof e === 'string') return e;
    if (Array.isArray(e)) { const A = conjunto(e); return A.length ? '{' + A.map(texto).join(', ') + '}' : '∅'; }
    if (esPar(e)) return '(' + texto(e.par[0]) + ', ' + texto(e.par[1]) + ')';
    throw new Error('elemento no válido');
  }
  const claves = A => new Set(conjunto(A).map(clave));

  // ---------- operaciones ----------
  const union = (A, B) => conjunto(conjunto(A).concat(conjunto(B)));
  const interseccion = (A, B) => { const kb = claves(B); return conjunto(A).filter(x => kb.has(clave(x))); };
  const diferencia = (A, B) => { const kb = claves(B); return conjunto(A).filter(x => !kb.has(clave(x))); };
  const diferenciaSimetrica = (A, B) => union(diferencia(A, B), diferencia(B, A));
  const incluido = (A, B) => { const kb = claves(B); return conjunto(A).every(x => kb.has(clave(x))); };
  function complemento(A, U) {
    if (!incluido(A, U)) throw new Error('el conjunto debe estar dentro del universo U');
    return diferencia(U, A);
  }
  const pertenece = (x, A) => claves(A).has(clave(x));
  const iguales = (A, B) => clave(conjunto(A)) === clave(conjunto(B));
  const disjuntos = (A, B) => interseccion(A, B).length === 0;
  function afirmar(x, rel, Y) {
    if (!Array.isArray(Y)) throw new Error('a la derecha va un conjunto');
    if (rel === '∈') return pertenece(x, Y);
    if (rel === '∉') return !pertenece(x, Y);
    if (rel === '⊂' || rel === '⊄') {
      if (!Array.isArray(x)) return rel === '⊄';   // un número no es un conjunto: no está incluido en nada
      return rel === '⊂' ? incluido(x, Y) : !incluido(x, Y);
    }
    if (rel === '=') return Array.isArray(x) && iguales(x, Y);
    throw new Error('relación desconocida: ' + rel);
  }

  // De comprensión a extensión: { forma(x) / x entero, desde ≤ x ≤ hasta, condición(x) }.
  // condicion: null, 'par', 'impar', 'primo', { divisorDe: n }, { multiploDe: n }; forma: { a, b } (a·x + b) o { cuadrado: true }.
  const esPrimo = n => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
  function extension(o) {
    const { desde, hasta } = o;
    if (!Number.isInteger(desde) || !Number.isInteger(hasta)) throw new Error('desde y hasta deben ser enteros');
    if (hasta - desde > 10000) throw new Error('el rango es demasiado grande');
    const c = o.condicion || null, f = o.forma || { a: 1, b: 0 };
    const cumple = x => c === null ? true : c === 'par' ? x % 2 === 0 : c === 'impar' ? Math.abs(x % 2) === 1 : c === 'primo' ? esPrimo(x)
      : c.divisorDe !== undefined ? x !== 0 && c.divisorDe % x === 0 : c.multiploDe !== undefined ? x % c.multiploDe === 0 : (() => { throw new Error('condición desconocida'); })();
    const forma = x => (f.cuadrado ? x * x : f.a * x + f.b);
    const out = [];
    for (let x = desde; x <= hasta; x++) if (cumple(x)) out.push(forma(x));
    return conjunto(out);
  }

  // ---------- conjunto potencia ----------
  const miles = s => s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  function potenciaCantidad(n) {
    if (!Number.isInteger(n) || n < 0) throw new Error('n debe ser un entero mayor o igual que 0');
    const k = 2n ** BigInt(n), p = k - 1n;
    return { n, cantidad: n <= 52 ? Number(k) : null, propios: n <= 52 ? Number(p) : null, cantidadTexto: miles(String(k)), propiosTexto: miles(String(p)),
      exacto: String(k) };
  }
  function potencia(A) {
    const L = conjunto(A), n = L.length, c = potenciaCantidad(n);
    let lista = null;
    if (n <= 12) {
      lista = [];
      for (let m = 0; m < 2 ** n; m++) lista.push(L.filter((_, i) => m & (1 << i)));
      lista = conjunto(lista);
    }
    const porTamano = []; let comb = 1;
    for (let k = 0; k <= n; k++) { porTamano.push(comb); comb = comb * (n - k) / (k + 1); }
    return Object.assign({ elementos: L, lista, porTamano, texto: lista ? texto(lista) : null }, c);
  }
  // El n con 2ⁿ = k (o 2ⁿ − 1 = k si son los propios).
  function elementosPorSubconjuntos(k, propios) {
    if (!Number.isInteger(k) || k < (propios ? 0 : 1)) throw new Error('la cantidad de subconjuntos debe ser un entero positivo');
    let t = BigInt(k) + (propios ? 1n : 0n), n = 0;
    while (t > 1n && t % 2n === 0n) { t /= 2n; n++; }
    if (t !== 1n) return { posible: false, razon: `${propios ? k + ' + 1' : k} no es una potencia de 2: ningún conjunto tiene esa cantidad de ${propios ? 'subconjuntos propios' : 'subconjuntos'}` };
    return { posible: true, n };
  }
  // El árbol de decisiones: para cada elemento, «entra» (primero) o «no entra». Las hojas en el orden del árbol.
  function arbol(A) {
    const L = conjunto(A), n = L.length;
    if (n > 6) throw new Error('el árbol se dibuja hasta con 6 elementos');
    const niveles = Array.from({ length: n + 1 }, () => []);
    const bajar = (i, sub) => { niveles[i].push(sub.slice()); if (i === n) return; sub.push(L[i]); bajar(i + 1, sub); sub.pop(); bajar(i + 1, sub); };
    bajar(0, []);
    const hojas = niveles[n];
    // niveles[k]: los nodos del nivel k (lo elegido con los k primeros elementos), de izquierda a derecha
    return { elementos: L, n, hojas, textos: hojas.map(texto), cantidad: hojas.length, niveles, nivelesTexto: niveles.map(v => v.map(texto)) };
  }

  // ---------- producto cartesiano ----------
  function cartesiano(A, B) {
    const X = conjunto(A), Y = conjunto(B);
    const filas = X.map(x => Y.map(y => ({ par: [x, y] })));
    const pares = [].concat(...filas);
    return { filas, pares, n: pares.length, textos: pares.map(texto), A: X, B: Y };
  }
  const parIgual = (p, q) => clave(p) === clave(q);

  // ---------- regiones ----------
  const LETRAS = { 2: ['A', 'B'], 3: ['A', 'B', 'C'] };
  const ZONAS = { 2: ['A', 'B', 'AB', ''], 3: ['A', 'B', 'C', 'AB', 'AC', 'BC', 'ABC', ''] };
  const ordenar = s => s.split('').sort().join('');
  function letras(s, n) {
    const ls = [...new Set(s.split(''))];
    for (const l of ls) if (!LETRAS[n].includes(l)) throw new Error(`con ${n} conjuntos no hay conjunto ${l}`);
    return ls;
  }
  function zonasDe(k, n) {
    const Z = ZONAS[n]; if (!Z) throw new Error('solo hay diagramas de 2 o 3 conjuntos');
    let m;
    if (k === 'U' || k === 'total') return Z.slice();
    if (k === 'ninguno') return [''];
    if (k === 'union' || k === 'alMenosUno') return Z.filter(z => z);
    if (k === 'exactamenteUno') return Z.filter(z => z.length === 1);
    if (k === 'exactamenteDos') return Z.filter(z => z.length === 2);
    if (k === 'alMenosDos') return Z.filter(z => z.length >= 2);
    if (k === 'exactamenteTres') return Z.filter(z => z.length === 3);
    if ((m = /^solo([ABC]+)$/.exec(k))) { const s = ordenar(letras(m[1], n).join('')); return Z.filter(z => z === s); }
    if ((m = /^([ABC])menos([ABC]+)$/.exec(k))) { const a = letras(m[1], n), b = letras(m[2], n); return Z.filter(z => a.every(l => z.includes(l)) && b.every(l => !z.includes(l))); }
    if ((m = /^no([ABC]+)$/.exec(k))) { const ls = letras(m[1], n); return Z.filter(z => ls.every(l => !z.includes(l))); }
    if ((m = /^([ABC]+)$/.exec(k))) { const ls = letras(m[1], n); return Z.filter(z => ls.every(l => z.includes(l))); }
    throw new Error(`dato desconocido: ${k}`);
  }
  function nombreZona(z, n) {
    const L = LETRAS[n];
    if (z === '') return n === 2 ? 'fuera de los dos aros' : 'fuera de los tres aros';
    const dentro = z.split(''), fuera = L.filter(l => !z.includes(l));
    const y = xs => (xs.length === 1 ? xs[0] : xs.slice(0, -1).join(', de ') + ' y de ' + xs[xs.length - 1]);
    return 'dentro de ' + y(dentro) + (fuera.length ? ', fuera de ' + y(fuera) : '');
  }
  const NOMBRE_CORTO = { '': 'fuera de todos', A: 'solo A', B: 'solo B', C: 'solo C', AB: 'A y B', AC: 'A y C', BC: 'B y C', ABC: 'A, B y C' };
  const nombreRazon = (z, n) => (n === 2 ? { '': 'fuera de los dos', A: 'solo A', B: 'solo B', AB: 'A y B' }[z] : NOMBRE_CORTO[z] + (z.length === 2 ? ' (no ' + LETRAS[3].find(l => !z.includes(l)) + ')' : ''));

  // fracciones exactas (para resolver el sistema)
  const absB = a => (a < 0n ? -a : a);
  const mcd = (a, b) => { a = absB(a); b = absB(b); while (b) [a, b] = [b, a % b]; return a; };
  const Fr = (n, d) => { if (d === undefined) d = 1n; if (d < 0n) { n = -n; d = -d; } const g = mcd(n, d) || 1n; return { n: n / g, d: d / g }; };
  const fsub = (a, b) => Fr(a.n * b.d - b.n * a.d, a.d * b.d);
  const fmul = (a, b) => Fr(a.n * b.n, a.d * b.d);
  const fdiv = (a, b) => Fr(a.n * b.d, a.d * b.n);
  const cero = a => a.n === 0n;

  function regiones(datos) {
    if (!datos || typeof datos !== 'object') throw new Error('faltan los datos');
    const ks = Object.keys(datos).filter(k => k !== 'conjuntos');
    if (!ks.length) throw new Error('faltan los datos');
    const n = datos.conjuntos || (ks.some(k => k.replace(/^(solo|no|exactamente\w+|alMenos\w+)/, '').includes('C')) ? 3 : 2);
    const Z = ZONAS[n]; if (!Z) throw new Error('solo hay diagramas de 2 o 3 conjuntos');
    const filas = ks.map(k => {
      const v = datos[k];
      if (!Number.isInteger(v) || v < 0) throw new Error(`${k} debe ser un entero mayor o igual que 0`);
      const zs = zonasDe(k, n);
      return Z.map(z => Fr(zs.includes(z) ? 1n : 0n)).concat([Fr(BigInt(v))]);
    });
    // eliminación de Gauss-Jordan
    const m = Z.length, piv = [];
    let f = 0;
    for (let c = 0; c < m && f < filas.length; c++) {
      let p = f; while (p < filas.length && cero(filas[p][c])) p++;
      if (p === filas.length) continue;
      [filas[f], filas[p]] = [filas[p], filas[f]];
      const a = filas[f][c]; filas[f] = filas[f].map(x => fdiv(x, a));
      for (let i = 0; i < filas.length; i++) if (i !== f && !cero(filas[i][c])) { const k = filas[i][c]; filas[i] = filas[i].map((x, j) => fsub(x, fmul(k, filas[f][j]))); }
      piv.push(c); f++;
    }
    const base = { conjuntos: n, zonas: Z.slice() };
    for (let i = f; i < filas.length; i++) if (!cero(filas[i][m])) return Object.assign(base, { posible: false, razon: 'Los datos no cuadran entre sí: no hay forma de repartir a las personas en las regiones del diagrama.' });
    const reg = {}, faltan = [];
    Z.forEach(z => { reg[z] = null; });
    piv.forEach((c, i) => {
      const libre = filas[i].slice(0, m).some((x, j) => j !== c && !piv.includes(j) && !cero(x));
      if (!libre) reg[Z[c]] = filas[i][m];
    });
    for (const z of Z) {
      const v = reg[z];
      if (v === null) { faltan.push(z); continue; }
      if (v.d !== 1n) return Object.assign(base, { posible: false, razon: `La región «${nombreRazon(z, n)}» saldría con ${v.n}/${v.d} de persona: con estos datos el problema es imposible.` });
      if (v.n < 0n) return Object.assign(base, { posible: false, razon: `La región «${nombreRazon(z, n)}» saldría con −${-v.n} ${-v.n === 1n ? "persona" : "personas"}: con estos datos el problema es imposible.` });
      reg[z] = Number(v.n);
    }
    // una fila con todos sus coeficientes ≥ 0 y resultado negativo: alguna región tendría que ser negativa
    for (let i = 0; i < f; i++) if (filas[i][m].n < 0n && filas[i].slice(0, m).every(x => x.n >= 0n))
      return Object.assign(base, { posible: false, razon: 'Con estos datos, alguna región tendría menos de cero personas: el problema es imposible.' });
    const r = Object.assign(base, { posible: true, determinado: faltan.length === 0, regiones: reg, faltan });
    if (r.determinado) r.cardinales = cardinales(reg);
    return r;
  }
  const nDe = reg => (Object.keys(reg).some(z => z.includes('C')) ? 3 : 2);
  function contar(reg, k) {
    const n = nDe(reg);
    return zonasDe(k, n).reduce((s, z) => { if (reg[z] == null) throw new Error(`falta la región ${z || 'de afuera'}`); return s + reg[z]; }, 0);
  }
  function cardinales(reg) {
    const n = nDe(reg), out = {};
    const ks = n === 2 ? ['A', 'B', 'AB', 'U', 'union', 'ninguno', 'soloA', 'soloB', 'exactamenteUno', 'noA', 'noB']
      : ['A', 'B', 'C', 'AB', 'AC', 'BC', 'ABC', 'U', 'union', 'ninguno', 'soloA', 'soloB', 'soloC', 'exactamenteUno', 'exactamenteDos', 'alMenosDos'];
    for (const k of ks) out[k] = contar(reg, k);
    return out;
  }
  // fichas: [{ en: ['A', 'B'] }] o zonas ('AB'); n: 2 o 3
  function deFichas(fichas, n) {
    const reg = {}; ZONAS[n].forEach(z => { reg[z] = 0; });
    for (const f of fichas) {
      const z = ordenar(typeof f === 'string' ? f : (f.en || []).join(''));
      letras(z, n);
      if (!(z in reg)) throw new Error('zona desconocida: ' + z);
      reg[z]++;
    }
    return reg;
  }

  // Las regiones que forman el resultado de una operación (para sombrearlas en el dibujo).
  // op: 'AuB', 'AnB', 'A-B', 'B-A', 'AdB' (A Δ B), 'noAuB' ((A ∪ B)′), 'AnBnC', 'AuBuC', 'A', 'B', 'C', 'noA'
  function zonasOperacion(op, n) {
    const Z = ZONAS[n]; if (!Z) throw new Error('solo hay diagramas de 2 o 3 conjuntos');
    const t = (z, l) => z.includes(l);
    const f = { AuB: z => t(z, 'A') || t(z, 'B'), AnB: z => t(z, 'A') && t(z, 'B'), 'A-B': z => t(z, 'A') && !t(z, 'B'), 'B-A': z => t(z, 'B') && !t(z, 'A'),
      AdB: z => t(z, 'A') !== t(z, 'B'), noAuB: z => !t(z, 'A') && !t(z, 'B'), A: z => t(z, 'A'), B: z => t(z, 'B'), C: z => t(z, 'C'), noA: z => !t(z, 'A'),
      AnBnC: z => t(z, 'A') && t(z, 'B') && t(z, 'C'), AuBuC: z => z !== '' }[op];
    if (!f || (n === 2 && /C/.test(op))) throw new Error('operación desconocida: ' + op);
    return Z.filter(f);
  }
  // El resultado de una operación con listas de elementos (A, B, C, U)
  function operar(op, S) {
    const { A, B } = S, C = S.C || [], U = S.U || union(union(A, B), C);
    const r = { AuB: () => union(A, B), AnB: () => interseccion(A, B), 'A-B': () => diferencia(A, B), 'B-A': () => diferencia(B, A),
      AdB: () => diferenciaSimetrica(A, B), noAuB: () => complemento(union(A, B), U), AnBnC: () => interseccion(interseccion(A, B), C),
      AuBuC: () => union(union(A, B), C), A: () => conjunto(A), B: () => conjunto(B), C: () => conjunto(C), noA: () => complemento(A, U) }[op];
    if (!r) throw new Error('operación desconocida: ' + op);
    const e = r();
    return { elementos: e, n: e.length, texto: texto(e) };
  }

  // ---------- predicciones ----------
  function limpiar(errores, correcta) {
    const out = {}, vistos = new Set([clave(correcta)]);
    for (const [k, v] of Object.entries(errores)) { const c = clave(v); if (!vistos.has(c)) { vistos.add(c); out[k] = v; } }
    return out;
  }
  function exigir(R) { if (!R.posible) throw new Error(R.razon); return R; }
  // ¿Cuántos están en al menos uno? n(A ∪ B) = n(A) + n(B) − n(A ∩ B)
  function alMenosUno(nA, nB, nAB) {
    const R = exigir(regiones({ A: nA, B: nB, AB: nAB })), g = R.regiones;
    const respuesta = nA + nB - nAB;
    return { respuesta, suma: nA + nB, soloA: g.A, soloB: g.B, ambos: g.AB,
      errores: limpiar({ sumaSinRestar: nA + nB, restaDosVeces: nA + nB - 2 * nAB, elMayor: Math.max(nA, nB) }, respuesta) };
  }
  // ¿Cuántos están solo en A? n(A) − n(A ∩ B)
  function soloUno(nA, nB, nAB) {
    const R = exigir(regiones({ A: nA, B: nB, AB: nAB })), g = R.regiones;
    return { respuesta: g.A, soloB: g.B, ambos: g.AB, union: nA + nB - nAB,
      errores: limpiar({ todoElConjunto: nA, quitaDosVeces: nA - 2 * nAB, elOtro: g.B, laInterseccion: nAB }, g.A) };
  }
  // Con el total y los de afuera: n(A ∩ B) = n(A) + n(B) − (U − ninguno)
  function interseccionPorComplemento(U, nA, nB, ninguno) {
    const R = exigir(regiones({ U, A: nA, B: nB, ninguno })), g = R.regiones, union = U - ninguno;
    return { respuesta: g.AB, union, suma: nA + nB, soloA: g.A, soloB: g.B,
      errores: limpiar({ olvidaLosDeFuera: nA + nB - U, daLaUnion: union, daSoloElOtro: union - nA }, g.AB) };
  }
  // Tres aros: los que no están en ninguno. n(A ∪ B ∪ C) = Σ n − Σ n(pares) + n(A ∩ B ∩ C)
  function ningunoTres(d) {
    const R = exigir(regiones({ U: d.U, A: d.A, B: d.B, C: d.C, AB: d.AB, AC: d.AC, BC: d.BC, ABC: d.ABC })), g = R.regiones;
    const s = d.A + d.B + d.C, p = d.AB + d.AC + d.BC, union = s - p + d.ABC;
    return { respuesta: g[''], union, suma: s, pares: p, regiones: g,
      errores: limpiar({ olvidaDevolverElCentro: d.U - (s - p), restaElCentro: d.U - (s - p - d.ABC), daLaUnion: union }, g['']) };
  }
  // Subconjuntos y propios de un conjunto de n elementos: [2ⁿ, 2ⁿ − 1]
  function cuantosSubconjuntos(n) {
    if (!Number.isInteger(n) || n < 1 || n > 20) throw new Error('n debe ser un entero entre 1 y 20');
    const k = 2 ** n, fac = Array.from({ length: n }, (_, i) => i + 1).reduce((a, b) => a * b, 1);
    const respuesta = [k, k - 1];
    return { respuesta, subconjuntos: k, propios: k - 1,
      errores: limpiar({ dosPorElemento: [2 * n, 2 * n - 1], sinElVacio: [k - 1, k - 2], permutaciones: [fac, fac - 1], alCuadrado: [n * n, n * n - 1] }, respuesta) };
  }
  // Un elemento más: cada subconjunto viejo sigue, y aparece otro igual pero con el elemento nuevo
  function agregarElemento(n) {
    if (!Number.isInteger(n) || n < 0 || n > 20) throw new Error('n debe ser un entero entre 0 y 20');
    const antes = 2 ** n, despues = 2 ** (n + 1);
    return { antes, despues, nuevos: antes, respuesta: despues,
      errores: limpiar({ soloElUnitario: antes + 1, elUnitarioYElTotal: antes + 2, porElNuevoCardinal: antes * (n + 1) }, despues) };
  }
  // n(A × B) = n(A) × n(B)
  function cuantosPares(A, B) {
    const C = cartesiano(A, B), X = C.A, Y = C.B;
    const sinOrden = new Set(C.pares.map(p => [clave(p.par[0]), clave(p.par[1])].sort().join('|'))).size;
    // los pares que también están dados vuelta en A × B, como (2, 3) y (3, 2)
    const vuelta = C.pares.filter(p => clave(p.par[0]) !== clave(p.par[1]) && pertenece(p.par[1], X) && pertenece(p.par[0], Y));
    return { respuesta: C.n, nA: X.length, nB: Y.length, pares: C.pares, dadosVuelta: vuelta.map(texto),
      errores: limpiar({ suma: X.length + Y.length, ordenNoImporta: sinOrden, cuentaLosNumeros: union(X, Y).length }, C.n) };
  }
  // B − A, con los errores de confundir el orden o la operación
  function diferencias(A, B) {
    const r = diferencia(B, A);
    return { respuesta: r, texto: texto(r), AmenosB: diferencia(A, B), interseccion: interseccion(A, B), simetrica: diferenciaSimetrica(A, B),
      errores: limpiar({ alReves: diferencia(A, B), interseccion: interseccion(A, B), simetrica: diferenciaSimetrica(A, B), union: union(A, B) }, r) };
  }

  // ---------- geometría para el dibujo ----------
  const caja = (x, y, w, h) => ({ x, y, w, h });
  // o = { relacion: 'cruzan' | 'dentro' | 'separados' (2 aros), arriba (px para los rótulos), banca (px abajo para las fichas
  //       de afuera), abajo (px fuera del universo, para un pie), anchoRotulo }
  function aros(n, W, H, o) {
    o = o || {};
    if (n !== 2 && n !== 3) throw new Error('solo hay diagramas de 2 o 3 aros');
    if (!(W > 60 && H > 60)) throw new Error('el lienzo es demasiado chico');
    const arriba = o.arriba != null ? o.arriba : 26, banca = o.banca || 0, abajo = o.abajo || 0, lado = 8, rh = 18, ar = o.anchoRotulo || 130;
    const U = caja(2, 2, W - 4, H - 4 - abajo);
    const d = caja(U.x + lado, U.y + arriba, U.w - 2 * lado, U.h - arriba - banca - (n === 3 ? 22 : 6));
    const cx = d.x + d.w / 2, cy = d.y + d.h / 2, rel = n === 2 ? (o.relacion || 'cruzan') : 'tres';
    let A, r;
    if (rel === 'cruzan') { r = Math.min(d.w / 3.2, d.h / 2); A = [{ k: 'A', x: cx - 0.6 * r, y: cy, r }, { k: 'B', x: cx + 0.6 * r, y: cy, r }]; }
    else if (rel === 'dentro') { r = Math.min(d.w / 2.6, d.h / 2); A = [{ k: 'A', x: cx, y: cy, r }, { k: 'B', x: cx + 0.38 * r, y: cy, r: 0.5 * r }]; }
    else if (rel === 'separados') { r = Math.min(d.w / 4.3, d.h / 2); A = [{ k: 'A', x: cx - 1.1 * r, y: cy, r }, { k: 'B', x: cx + 1.1 * r, y: cy, r }]; }
    else if (rel === 'tres') { r = Math.min(d.w / 3.1, d.h / 2.95); const y0 = cy - 1.475 * r + r; A = [{ k: 'A', x: cx - 0.55 * r, y: y0, r }, { k: 'B', x: cx + 0.55 * r, y: y0, r }, { k: 'C', x: cx, y: y0 + 0.95 * r, r }]; }
    else throw new Error('relación desconocida: ' + rel);
    // rótulos de los aros: A arriba a la izquierda, B arriba a la derecha, C abajo a la derecha de su aro
    const yR = U.y + arriba / 2 + 1;
    const rotulos = { A: { x: U.x + lado, y: yR, align: 'left' }, B: { x: U.x + U.w - lado, y: yR, align: 'right' } };
    const evitar = [caja(0, 0, W, U.y + arriba), caja(U.x + U.w - 66, U.y + U.h - 22, 66, 22)];
    if (n === 3) { const c = A[2], y = Math.min(c.y + c.r + 12, U.y + U.h - 12); rotulos.C = { x: c.x, y, align: 'center' }; evitar.push(caja(c.x - ar / 2, y - rh / 2, ar, rh)); }
    const anclas = {};
    if (banca) anclas[''] = { x: U.x + U.w / 2, y: U.y + U.h - banca / 2 };
    const anclasRotulo = { '': { x: U.x, y: U.y + U.h } };   // la cuenta de afuera, en la esquina de abajo a la izquierda
    return { tipo: 'venn', n, W, H, U, aros: A, rotulos, evitar, anclas, anclasRotulo, rotuloU: { x: U.x + U.w - 8, y: U.y + U.h - 11 }, zonas: ZONAS[n].slice() };
  }
  function carroll(n, W, H, o) {
    o = o || {};
    if (n !== 2 && n !== 3) throw new Error('solo hay diagramas de 2 o 3 conjuntos');
    const izq = o.izq || 58, arriba = o.arriba || 32, abajo = o.abajo || 0;
    const U = caja(2, 2, W - 4, H - 4 - abajo);
    const cols = n === 2 ? [{ z: 'B', texto: 'B', partes: [['B', 'B']] }, { z: '', texto: 'no B', partes: [['no ', 'ink'], ['B', 'B']] }]
      : [{ z: 'BC', texto: 'B y C', partes: [['B', 'B'], [' y ', 'ink'], ['C', 'C']] }, { z: 'B', texto: 'B, no C', partes: [['B', 'B'], [', no ', 'ink'], ['C', 'C']] },
         { z: 'C', texto: 'C, no B', partes: [['C', 'C'], [', no ', 'ink'], ['B', 'B']] }, { z: '', texto: 'ni B ni C', partes: [['ni ', 'ink'], ['B', 'B'], [' ni ', 'ink'], ['C', 'C']] }];
    const filas = [{ a: true, texto: 'A', partes: [['A', 'A']] }, { a: false, texto: 'no A', partes: [['no ', 'ink'], ['A', 'A']] }];
    const cw = (U.w - izq) / cols.length, ch = (U.h - arriba) / 2;
    const celdas = [];
    filas.forEach((f, i) => cols.forEach((c, j) => celdas.push({ zona: ordenar((f.a ? 'A' : '') + c.z), x: U.x + izq + j * cw, y: U.y + arriba + i * ch, w: cw, h: ch, fila: i, col: j })));
    return { tipo: 'carroll', n, W, H, U, izq, arriba, celdas,
      filas: filas.map((f, i) => ({ texto: f.texto, partes: f.partes, no: !f.a, x: U.x + izq / 2, y: U.y + arriba + (i + 0.5) * ch })),
      columnas: cols.map((c, j) => ({ texto: c.texto, partes: c.partes, z: c.z, x: U.x + izq + (j + 0.5) * cw, y: U.y + arriba / 2 })),
      evitar: [], anclas: {}, zonas: ZONAS[n].slice() };
  }
  const dentroCaja = (p, b, m) => p.x >= b.x + m && p.x <= b.x + b.w - m && p.y >= b.y + m && p.y <= b.y + b.h - m;
  const tocaCaja = (p, b, m) => p.x > b.x - m && p.x < b.x + b.w + m && p.y > b.y - m && p.y < b.y + b.h + m;
  function zonaDe(geo, p) {
    if (!p || !dentroCaja(p, geo.U, 0)) return null;
    if (geo.tipo === 'carroll') { const c = geo.celdas.find(c => dentroCaja(p, c, 0)); return c ? c.zona : null; }
    return ordenar(geo.aros.filter(a => Math.hypot(p.x - a.x, p.y - a.y) < a.r).map(a => a.k).join(''));
  }
  // ¿Cabe un círculo de radio m (más el margen) con centro p sin tocar bordes ni rótulos?
  function libre(geo, p, m) {
    if (!dentroCaja(p, geo.U, m)) return false;
    if (geo.evitar.some(b => tocaCaja(p, b, m))) return false;
    if (geo.tipo === 'carroll') { const c = geo.celdas.find(c => dentroCaja(p, c, 0)); return !!c && dentroCaja(p, c, m); }
    return geo.aros.every(a => Math.abs(Math.hypot(p.x - a.x, p.y - a.y) - a.r) >= m);
  }
  function candidatos(geo, r, pad) {
    const s = 2 * r + Math.max(2, r * 0.3), dy = s * Math.sqrt(3) / 2, U = geo.U, por = {};
    geo.zonas.forEach(z => { por[z] = []; });
    let fila = 0;
    for (let y = U.y + r + pad; y <= U.y + U.h - r - pad + 1e-9; y += dy, fila++) {
      for (let x = U.x + r + pad + (fila % 2 ? s / 2 : 0); x <= U.x + U.w - r - pad + 1e-9; x += s) {
        const p = { x, y };
        if (!libre(geo, p, r + pad)) continue;
        const z = zonaDe(geo, p);
        if (z !== null && por[z]) por[z].push(p);
      }
    }
    for (const z of geo.zonas) {
      const L = por[z]; if (!L.length) continue;
      const a = geo.anclas[z] || { x: L.reduce((t, p) => t + p.x, 0) / L.length, y: L.reduce((t, p) => t + p.y, 0) / L.length };
      L.sort((p, q) => (Math.hypot(p.x - a.x, p.y - a.y) - Math.hypot(q.x - a.x, q.y - a.y)) || (p.y - q.y) || (p.x - q.x));
    }
    return por;
  }
  // cuentas = { zona: fichas }; o = { radio (el más grande), minimo, pad, rotulos (true o lista de zonas: dejar lugar
  // para la cuenta), radioRotulo }
  function layout(geo, cuentas, o) {
    o = o || {};
    const max = o.radio || 11, min = o.minimo || 3.5, pad = o.pad != null ? o.pad : 2, rr = o.radioRotulo || 11;
    const conRotulo = z => (o.rotulos === true ? true : Array.isArray(o.rotulos) ? o.rotulos.includes(z) : false);
    for (const z of Object.keys(cuentas)) if (!geo.zonas.includes(z)) throw new Error('zona desconocida: ' + z);
    const armar = r => {
      const C = candidatos(geo, r, pad), pos = {}, rotulo = {};
      let ok = true;
      for (const z of geo.zonas) {
        let L = C[z].slice();
        if (conRotulo(z) && L.length) {
          // el rótulo va en el lugar libre más cercano a su ancla (si la hay) o al centro de la región
          const ar = geo.anclasRotulo && geo.anclasRotulo[z], orden = ar ? L.slice().sort((p, q) => Math.hypot(p.x - ar.x, p.y - ar.y) - Math.hypot(q.x - ar.x, q.y - ar.y)) : L;
          const b0 = orden.find(p => libre(geo, p, rr + pad)), i = b0 ? L.indexOf(b0) : -1;
          if (i >= 0) { const b = L[i]; rotulo[z] = { x: b.x, y: b.y, r: rr }; L = L.filter(p => Math.hypot(p.x - b.x, p.y - b.y) >= rr + r + pad); }
          else ok = false;
        }
        const k = cuentas[z] || 0;
        if (L.length < k) ok = false;
        pos[z] = L.slice(0, k);
      }
      return { ok, radio: r, pos, rotulo };
    };
    for (let r = max; r >= min - 1e-9; r -= 0.5) { const L = armar(r); if (L.ok) return L; }
    return armar(min);
  }

  return { clave, conjunto, texto, union, interseccion, diferencia, complemento, diferenciaSimetrica, incluido, pertenece, iguales, disjuntos,
    afirmar, extension, potencia, potenciaCantidad, elementosPorSubconjuntos, arbol, cartesiano, parIgual,
    zonasDe, zonasOperacion, operar, regiones, contar, cardinales, deFichas, nombreZona, ZONAS, LETRAS,
    alMenosUno, soloUno, interseccionPorComplemento, ningunoTres, cuantosSubconjuntos, agregarElemento, cuantosPares, diferencias,
    aros, carroll, zonaDe, layout, libre };
});
