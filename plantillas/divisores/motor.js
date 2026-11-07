/*
 * Motor de «El rectángulo de fichas»: divisores, primos, criterios de divisibilidad y restos.
 *
 * Aquí vive toda la matemática de la plantilla (regla 1 de CLAUDE.md). No toca el DOM:
 * funciona igual en el navegador (window.MotorDivisores) y en Node (require('./motor.js')),
 * donde lo prueban casos.json y papel.json. Todo es aritmética entera.
 *
 * Divisores y primos
 *   factores(n) · textoFactores(n)     descomposición en primos [{ p, e }] y '2³·3²·5'
 *   arbol(n)                           el árbol que se parte: en cada nivel se saca el primo más chico
 *   esPrimo(n)
 *   rectangulo(n, filas)               n fichas en filas iguales: columnas, cuántas sobran, ¿exacto?
 *   rectangulos(n)                     todos los rectángulos exactos (uno por divisor) y los errores al contarlos
 *   divisores(n)                       lista, cantidad (a+1)(b+1)…, suma, producto, y los errores al contar
 *   tabla(n)                           la cuadrícula de exponentes: cada divisor elige de 0 a e veces cada primo
 *   sumaDivisores(n)                   (1 + p + … + pᵃ)(1 + q + … + qᵇ)… y los errores típicos
 *   divisoresMultiplosDe(n, k)         los divisores de n que son múltiplos de k (son los divisores de n/k)
 *   numeroConDivisores(p, k, cd)       el número pⁿ·k que tiene cd divisores
 *   criba(N)                           la criba de Eratóstenes del 1 al N, en el orden en que se tacha
 *   pesi(a, b) · parejasPesi(pares)    primos entre sí: MCD 1 (y los puntos de la diagonal del rectángulo a × b)
 *   euler(n)                           cuántos del 1 al n son PESI con n, con lo que tacha cada primo
 *   wilson(p)                          (p − 1)! entre p
 * Divisibilidad y restos
 *   criterio(n, d)                     ¿n es divisible entre d? con la regla de academia y las reglas erróneas
 *   cifrasNueve(n)                     cada cifra deja tantas fichas sobrantes como vale (10ᵏ = 99…9 + 1)
 *   cifraFaltante(patron, d)           las cifras a que hacen divisible '7a42' entre d
 *   resto(a, n) · restoProducto(a, b, n) · restoSuma(a, b, n)
 *   restosPotenciales(b, n)            b¹, b², … entre n: la parte que no se repite y el ciclo
 *   restoPotencia(b, e, n)             el resto de bᵉ entre n con el ciclo, y los errores típicos
 *   reloj(b, n, pasos)                 las posiciones de la aguja en el reloj de n horas
 *   diofantica(a, b, c, minimo)        ax + by = c en enteros ≥ minimo: todas las soluciones
 *   mcd(a, b)
 *
 * Los campos «errores» dicen lo que da cada error típico. Un error que en un caso daría la respuesta correcta
 * (o lo mismo que otro error anterior) no aparece: así la escena nunca tiene dos opciones iguales.
 */
(function (root, fabrica) {
  const api = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.MotorDivisores = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const sup = e => String(e).split('').map(c => SUP[c]).join('');
  const LIMITE = 1e7;

  function entero(n, que, min) {
    if (typeof n !== 'number' || !Number.isInteger(n)) throw new Error(`${que || 'n'} debe ser un entero`);
    if (min !== undefined && n < min) throw new Error(`${que || 'n'} debe ser mayor o igual que ${min}`);
    if (Math.abs(n) > LIMITE) throw new Error(`${que || 'n'} es demasiado grande (hasta ${LIMITE})`);
    return n;
  }
  const mod = (a, n) => ((a % n) + n) % n;
  function mcd(a, b) {
    entero(a, 'a'); entero(b, 'b');
    a = Math.abs(a); b = Math.abs(b);
    while (b) [a, b] = [b, a % b];
    return a;
  }
  // Quita los errores que coinciden con la respuesta o con un error anterior.
  function limpiar(errores, correcta, igual) {
    igual = igual || ((x, y) => x === y);
    const out = {}, vistos = [correcta];
    for (const [k, v] of Object.entries(errores)) {
      if (v === undefined || v === null || (typeof v === 'number' && !Number.isFinite(v))) continue;
      if (vistos.some(w => igual(w, v))) continue;
      out[k] = v; vistos.push(v);
    }
    return out;
  }

  // ---------- divisores y primos ----------
  function factores(n) {
    entero(n, 'n', 1);
    const out = [];
    for (let p = 2; p * p <= n; p++) {
      if (n % p) continue;
      let e = 0; while (n % p === 0) { n /= p; e++; }
      out.push({ p, e });
    }
    if (n > 1) out.push({ p: n, e: 1 });
    return out;
  }
  const textoFactores = n => (n === 1 ? '1' : factores(n).map(({ p, e }) => (e === 1 ? String(p) : p + sup(e))).join('·'));
  function esPrimo(n) {
    entero(n, 'n');
    if (n < 2) return false;
    for (let p = 2; p * p <= n; p++) if (n % p === 0) return false;
    return true;
  }
  // El árbol: n se parte en (primo más chico) · (lo que queda), hasta que lo que queda es primo.
  function arbol(n) {
    entero(n, 'n', 2);
    const niveles = []; let x = n;
    while (!esPrimo(x)) {
      const p = factores(x)[0].p;
      niveles.push({ valor: x, primo: p, queda: x / p });
      x /= p;
    }
    niveles.push({ valor: x, primo: x, queda: 1 });
    return { n, niveles, hojas: niveles.map(v => v.primo), texto: textoFactores(n) };
  }

  function rectangulo(n, filas) {
    entero(n, 'n', 1); entero(filas, 'filas', 1);
    const columnas = Math.floor(n / filas), sobran = n % filas;
    return { n, filas, columnas, sobran, exacto: sobran === 0 };
  }
  function listaDivisores(n) {
    const a = [], b = [];
    for (let d = 1; d * d <= n; d++) if (n % d === 0) { a.push(d); if (d * d !== n) b.unshift(n / d); }
    return a.concat(b);
  }
  function rectangulos(n) {
    entero(n, 'n', 1);
    const lista = listaDivisores(n), cantidad = lista.length;
    const exactos = lista.map(f => [f, n / f]);
    const cuadrado = Number.isInteger(Math.sqrt(n));
    const F = factores(n);
    return {
      n, exactos, filas: lista, cantidad, cuadrado, impar: cantidad % 2 === 1,
      // pareja de cada rectángulo: f × c y c × f son el mismo rectángulo girado; el cuadrado no tiene pareja
      parejas: lista.filter(f => f * f <= n).map(f => [f, n / f]),
      errores: limpiar({
        sinExtremos: cantidad - 2,                                   // olvida 1 fila y n filas
        soloPrimos: F.length,                                        // cuenta solo los divisores primos
        sinOrden: Math.ceil(cantidad / 2),                           // cuenta f × c y c × f como uno solo
        multiplicaExponentes: F.reduce((s, x) => s * x.e, 1),      // cuenta con a·b… sin sumar 1
      }, cantidad),
    };
  }
  function divisores(n) {
    entero(n, 'n', 1);
    const lista = listaDivisores(n), F = factores(n), cantidad = lista.length;
    const suma = lista.reduce((s, d) => s + d, 0);
    return {
      n, lista, cantidad, suma, factores: F, texto: textoFactores(n),
      formula: F.map(x => x.e + 1),                                  // (a+1)(b+1)…
      producto: { base: n, exponente: cantidad / 2, texto: cantidad % 2 ? `√(${n}${sup(cantidad)})` : `${n}${sup(cantidad / 2)}` },
      propios: lista.filter(d => d !== n),
      primos: F.map(x => x.p), compuestos: lista.filter(d => d > 1 && !esPrimo(d)),
      errores: limpiar({
        multiplicaExponentes: F.reduce((s, x) => s * x.e, 1),      // a·b… sin sumar 1
        sumaMasUno: F.reduce((s, x) => s + x.e + 1, 0),            // (a+1) + (b+1) + …
        sinExtremos: cantidad - 2,                                   // olvida el 1 y el propio número
        sumaExponentes: F.reduce((s, x) => s + x.e, 0),            // a + b + …
      }, cantidad),
    };
  }
  // La cuadrícula: filas = potencias del primer primo, columnas = del segundo, paneles = del tercero.
  function tabla(n) {
    entero(n, 'n', 1);
    const F = factores(n);
    if (F.length > 3) throw new Error('la tabla dibuja hasta tres primos');
    const exps = [0, 1, 2].map(k => (F[k] ? F[k].e : 0)), ps = [0, 1, 2].map(k => (F[k] ? F[k].p : 1));
    const celdas = [];
    for (let c = 0; c <= exps[2]; c++) for (let i = 0; i <= exps[0]; i++) for (let j = 0; j <= exps[1]; j++)
      celdas.push({ i, j, k: c, valor: Math.pow(ps[0], i) * Math.pow(ps[1], j) * Math.pow(ps[2], c) });
    return { n, primos: F.map(x => x.p), exponentes: F.map(x => x.e), filas: exps[0] + 1, columnas: exps[1] + 1,
      paneles: exps[2] + 1, celdas, cantidad: celdas.length, texto: textoFactores(n) };
  }
  function sumaDivisores(n) {
    entero(n, 'n', 1);
    const F = factores(n);
    const terminos = F.map(({ p, e }) => { const serie = []; for (let k = 0; k <= e; k++) serie.push(Math.pow(p, k)); return { p, e, serie, suma: serie.reduce((s, x) => s + x, 0) }; });
    const suma = terminos.reduce((s, t) => s * t.suma, 1), cantidad = F.reduce((s, x) => s * (x.e + 1), 1);
    return { n, terminos, suma, cantidad, propios: suma - n,
      errores: limpiar({
        cantidad,                                                       // da la cantidad en vez de la suma
        soloExtremos: F.reduce((s, x) => s * (1 + Math.pow(x.p, x.e)), 1), // (1 + pᵃ)(1 + qᵇ)… sin las potencias del medio
        sinElNumero: suma - n,                                          // deja fuera al propio número
      }, suma) };
  }
  function divisoresMultiplosDe(n, k) {
    entero(n, 'n', 1); entero(k, 'k', 1);
    const todos = divisores(n), lista = todos.lista.filter(d => d % k === 0);
    const cociente = n % k === 0 ? n / k : null, dk = divisores(k).cantidad;
    return { n, k, lista, cantidad: lista.length, cociente, textoCociente: cociente ? textoFactores(cociente) : null,
      errores: limpiar({
        todos: todos.cantidad,                                          // cuenta todos los divisores de n
        divisoresDeK: dk,                                               // cuenta los divisores de k
        divideCantidades: todos.cantidad / dk,                          // CD(n) ÷ CD(k)
      }, lista.length) };
  }
  // pⁿ·k con cd divisores: (n + 1)·CD(k) = cd. k no debe tener el factor p.
  function numeroConDivisores(p, k, cd) {
    entero(p, 'p', 2); entero(k, 'k', 1); entero(cd, 'cd', 1);
    if (!esPrimo(p)) throw new Error('p debe ser primo');
    if (k % p === 0) throw new Error('k no debe ser múltiplo de p');
    const ck = divisores(k).cantidad;
    if (cd % ck) return { existe: false, p, k, cd };
    const n = cd / ck - 1;
    if (n < 0) return { existe: false, p, k, cd };
    const sin = cd / ck;                                                // n·CD(k) = cd, sin sumar 1
    return { existe: true, p, k, cd, n, numero: Math.pow(p, n) * k, ecuacion: `(n + 1)·${ck} = ${cd}`,
      errores: limpiar({ sinSumar1: Math.pow(p, sin) * k }, Math.pow(p, n) * k) };
  }
  function criba(N) {
    entero(N, 'N', 2);
    if (N > 10000) throw new Error('N es demasiado grande para la criba');
    const tachadoPor = new Array(N + 1).fill(0);   // 0: primo (o aún no tachado); p: lo tachó el primo p
    tachadoPor[1] = 1;                             // el 1 se tacha aparte: no es primo
    const orden = [];
    for (let p = 2; p * p <= N; p++) {
      if (tachadoPor[p]) continue;
      const tacha = [];
      for (let m = p * p; m <= N; m += p) if (!tachadoPor[m]) { tachadoPor[m] = p; tacha.push(m); }
      orden.push({ p, desde: p * p, tacha });
    }
    const primos = []; for (let k = 2; k <= N; k++) if (!tachadoPor[k]) primos.push(k);
    const siguiente = (() => { let p = orden.length ? orden[orden.length - 1].p + 1 : 2; while (!esPrimo(p)) p++; return p; })();
    let impares = 1; for (let k = 3; k <= N; k += 2) impares++;   // el 2 y todos los impares desde el 3
    return { N, primos, cantidad: primos.length, tachadoPor, orden, usados: orden.map(o => o.p),
      paraPor: siguiente,                                          // el primer primo cuyo cuadrado pasa de N
      errores: limpiar({
        unoEsPrimo: primos.length + 1,                             // cuenta el 1
        imparesSonPrimos: impares,                                  // el 2 y todos los impares
        dosNoEsPrimo: primos.length - 1,                            // deja fuera al 2 por ser par
      }, primos.length) };
  }
  function pesi(a, b) {
    entero(a, 'a', 1); entero(b, 'b', 1);
    const g = mcd(a, b);
    return { a, b, mcd: g, pesi: g === 1, puntosDiagonal: g - 1, paso: [a / g, b / g],
      reglas: { ambosPrimos: esPrimo(a) && esPrimo(b), algunoPrimo: esPrimo(a) || esPrimo(b), ningunoDivide: a % b !== 0 && b % a !== 0 } };
  }
  function parejasPesi(pares) {
    if (!Array.isArray(pares) || !pares.length) throw new Error('pares debe ser una lista de parejas');
    const r = pares.map(([a, b]) => pesi(a, b)), cuenta = f => r.filter(f).length;
    const cantidad = cuenta(x => x.pesi);
    return { pares: r, cantidad,
      errores: limpiar({
        ambosPrimos: cuenta(x => x.reglas.ambosPrimos),            // cree que PESI es «los dos son primos»
        algunoPrimo: cuenta(x => x.reglas.algunoPrimo),            // basta que uno sea primo
        ningunoDivide: cuenta(x => x.reglas.ningunoDivide),        // basta que ninguno divida al otro
      }, cantidad) };
  }
  function euler(n) {
    entero(n, 'n', 2);
    const F = factores(n), lista = [], tachadoPor = {};
    for (let k = 1; k <= n; k++) { const t = F.map(x => x.p).filter(p => k % p === 0); tachadoPor[k] = t; if (!t.length) lista.push(k); }
    const phi = lista.length;
    let primosMenores = 0; for (let k = 2; k < n; k++) if (esPrimo(k)) primosMenores++;
    return { n, phi, lista, factores: F, tachadoPor,
      formula: F.map(({ p, e }) => ({ p, e, factor: Math.pow(p, e - 1) * (p - 1) })),
      multiplos: F.map(x => ({ p: x.p, cantidad: n / x.p })),
      errores: limpiar({
        nMenos1: n - 1,                                             // como si n fuera primo
        primosMenores,                                              // cuenta los primos menores que n
        sinInclusion: n - F.reduce((s, x) => s + n / x.p, 0),      // resta los múltiplos de cada primo sin devolver los comunes
      }, phi) };
  }
  function wilson(p) {
    entero(p, 'p', 2);
    if (p > 100000) throw new Error('p es demasiado grande');
    let f = 1; for (let k = 2; k < p; k++) f = (f * k) % p;
    return { p, resto: f % p, primo: esPrimo(p), menosUno: (f % p) === p - 1 };
  }

  // ---------- divisibilidad y restos ----------
  const cifras = n => String(Math.abs(n)).split('').map(Number);
  const sumaCifras = n => cifras(n).reduce((s, c) => s + c, 0);
  function criterio(n, d) {
    entero(n, 'n', 0); entero(d, 'd', 2);
    const cs = cifras(n), u = n % 10, dos = n % 100, tres = n % 1000, s = sumaCifras(n);
    const alterna = cs.slice().reverse().reduce((t, c, k) => t + (k % 2 ? -c : c), 0);
    const R = {
      2: { regla: 'la última cifra es par', dato: u, errores: {} },
      3: { regla: 'la suma de las cifras es múltiplo de 3', dato: s, errores: { terminaEn3: u === 3 } },
      4: { regla: 'las dos últimas cifras forman un múltiplo de 4', dato: dos, errores: { soloUltima: u % 4 === 0 } },
      5: { regla: 'termina en 0 o en 5', dato: u, errores: {} },
      8: { regla: 'las tres últimas cifras forman un múltiplo de 8', dato: tres, errores: { ultimasDos: dos % 8 === 0 } },
      9: { regla: 'la suma de las cifras es múltiplo de 9', dato: s, errores: { comoDel3: s % 3 === 0, terminaEn9: u === 9, ultimasDos: dos % 9 === 0 } },
      10: { regla: 'termina en 0', dato: u, errores: {} },
      11: { regla: 'la suma alternada de las cifras, desde la derecha, es múltiplo de 11', dato: alterna, errores: { sumaCifras: s % 11 === 0 } },
      25: { regla: 'las dos últimas cifras forman 00, 25, 50 o 75', dato: dos, errores: {} },
    }[d];
    if (!R) throw new Error('no hay criterio para ' + d);
    const divisible = n % d === 0;
    // cada regla errónea, solo si aquí da algo distinto de la verdadera
    const errores = {}; for (const [k, v] of Object.entries(R.errores)) if (v !== divisible) errores[k] = v;
    return { n, d, divisible, resto: n % d, regla: R.regla, dato: R.dato, sumaCifras: s, alterna, errores };
  }
  // Cada cifra c del lugar 10ᵏ: c bloques de 10ᵏ = (10ᵏ − 1) + 1; el 10ᵏ − 1 es múltiplo de 9 y sobra 1 ficha por bloque.
  function cifrasNueve(n) {
    entero(n, 'n', 1);
    const cs = cifras(n), L = cs.length;
    const lugares = cs.map((c, j) => { const k = L - 1 - j, pot = Math.pow(10, k); return { cifra: c, potencia: pot, nueves: pot - 1, sobran: c }; });
    const sobrantes = sumaCifras(n);
    return { n, lugares, sobrantes, filasDe9: Math.floor(sobrantes / 9), resto: sobrantes % 9, filasDe3: Math.floor(sobrantes / 3), resto3: sobrantes % 3,
      divisible9: n % 9 === 0, divisible3: n % 3 === 0 };
  }
  function cifraFaltante(patron, d) {
    if (typeof patron !== 'string' || (patron.match(/a/g) || []).length !== 1 || !/^[0-9a]+$/.test(patron)) throw new Error('el patrón lleva cifras y una sola a');
    entero(d, 'd', 2);
    const cifrasOk = [];
    for (let a = patron[0] === 'a' ? 1 : 0; a <= 9; a++) { const n = Number(patron.replace('a', a)); if (n % d === 0) cifrasOk.push(a); }
    return { patron, d, cifras: cifrasOk, numeros: cifrasOk.map(a => Number(patron.replace('a', a))) };
  }
  function resto(a, n) { entero(a, 'a'); entero(n, 'n', 1); const r = mod(a, n); return { a, n, cociente: (a - r) / n, resto: r }; }
  function restoProducto(a, b, n) {
    entero(a, 'a', 0); entero(b, 'b', 0); entero(n, 'n', 2);
    const ra = a % n, rb = b % n, esquina = ra * rb, r = esquina % n;
    return { a, b, n, ra, rb, qa: (a - ra) / n, qb: (b - rb) / n, esquina, resto: r, directo: Number((BigInt(a) * BigInt(b)) % BigInt(n)),
      errores: limpiar({ sumaRestos: (ra + rb) % n, sinReducir: esquina, porExceso: r ? n - r : undefined }, r) };
  }
  function restoSuma(a, b, n) {
    entero(a, 'a', 0); entero(b, 'b', 0); entero(n, 'n', 2);
    const ra = a % n, rb = b % n, r = (ra + rb) % n;
    return { a, b, n, ra, rb, resto: r, errores: limpiar({ multiplicaRestos: (ra * rb) % n, sinReducir: ra + rb }, r) };
  }
  // b¹, b², … entre n hasta que un resto se repite: la parte que no se repite (anteperiodo) y el ciclo.
  function restosPotenciales(b, n) {
    entero(b, 'b', 0); entero(n, 'n', 2);
    const sec = [], visto = new Map();
    let x = mod(b, n), k = 1;
    while (!visto.has(x)) { visto.set(x, k); sec.push(x); x = (x * mod(b, n)) % n; k++; }
    const inicio = visto.get(x);                 // el exponente donde empieza el ciclo
    return { b, n, secuencia: sec, inicio, anteperiodo: sec.slice(0, inicio - 1), ciclo: sec.slice(inicio - 1), periodo: sec.length - inicio + 1 };
  }
  function restoPotencia(b, e, n) {
    entero(e, 'e', 1);
    const R = restosPotenciales(b, n), L = R.periodo;
    let resto, indice;
    if (e < R.inicio) { resto = R.secuencia[e - 1]; indice = null; }
    else { indice = (e - R.inicio) % L; resto = R.ciclo[indice]; }
    const r = e % L;                              // el resto del exponente entre el periodo
    let potN = 1; for (let k = 0; k < e % n; k++) potN = (potN * mod(b, n)) % n;
    return { b, e, n, resto, ciclo: R.ciclo, anteperiodo: R.anteperiodo, inicio: R.inicio, periodo: L, restoExponente: r,
      posicion: indice === null ? null : indice + 1, vueltas: indice === null ? 0 : Math.floor((e - R.inicio) / L),
      errores: limpiar({
        base: mod(b, n),                                            // se queda con el resto de la base
        corrido: indice === null ? undefined : R.ciclo[(indice + 1) % L], // cuenta el ciclo corrido en uno
        restoExponente: r,                                          // da el resto del exponente como respuesta
        exponenteEntreN: potN,                                      // reduce el exponente entre n y no entre el periodo
      }, resto) };
  }
  // La aguja del reloj de n horas: empieza en b y en cada paso se multiplica por b.
  function reloj(b, n, pasos) {
    entero(pasos, 'pasos', 1);
    const R = restosPotenciales(b, n), pos = [];
    let x = mod(b, n); for (let k = 1; k <= pasos; k++) { pos.push({ k, hora: x }); x = (x * mod(b, n)) % n; }
    return { b, n, posiciones: pos, ciclo: R.ciclo, periodo: R.periodo, inicio: R.inicio };
  }
  function diofantica(a, b, c, minimo) {
    entero(a, 'a', 1); entero(b, 'b', 1); entero(c, 'c', 0);
    minimo = minimo === undefined ? 0 : entero(minimo, 'minimo', 0);
    const g = mcd(a, b);
    if (c % g) return { a, b, c, mcd: g, tiene: false, soluciones: [], cantidad: 0, errores: {} };
    const sols = [], cero = [];
    for (let x = 0; a * x <= c; x++) if ((c - a * x) % b === 0) { const y = (c - a * x) / b; cero.push([x, y]); if (x >= minimo && y >= minimo) sols.push([x, y]); }
    const cantidad = sols.length;
    return { a, b, c, mcd: g, tiene: true, minimo, soluciones: sols, cantidad, paso: [b / g, a / g],
      particular: sols[0] || cero[0] || null,
      errores: limpiar({
        unaSola: cantidad ? 1 : undefined,                                  // se queda con la primera que encuentra
        sinMasUno: cantidad > 1 ? (sols[cantidad - 1][0] - sols[0][0]) / (b / g) : undefined, // (último − primero) ÷ paso, sin + 1
        conCeros: minimo > 0 ? cero.length : undefined,                     // cuenta también las que usan 0 de una moneda
      }, cantidad) };
  }

  return { mcd, factores, textoFactores, esPrimo, arbol, rectangulo, rectangulos, divisores, tabla, sumaDivisores,
    divisoresMultiplosDe, numeroConDivisores, criba, pesi, parejasPesi, euler, wilson,
    criterio, cifrasNueve, cifraFaltante, resto, restoProducto, restoSuma, restosPotenciales, restoPotencia, reloj, diofantica, sup };
});
