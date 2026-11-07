/*
 * Motor de «El tablero de las llevadas»: las cuatro operaciones.
 *
 * Aquí vive toda la matemática de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el
 * navegador (window.MotorCuatroOperaciones) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 * Todo es aritmética entera exacta: por dentro se cuenta con BigInt y se devuelven números de JavaScript solo si
 * caben exactos (hasta 2⁵³ − 1); si no, el motor avisa con un error en vez de redondear.
 *
 * Un numeral se da como texto ('478', o con letras desde la cifra 10) o como lista de cifras, de la cifra de mayor
 * orden a las unidades. Las bases van de 2 a 36 (la escena usa de 2 a 10). El orden k es la columna contada desde la
 * derecha empezando en 0: unidades (fichas sueltas), k = 1 (paquetes de b), k = 2 (cajas de b²), k = 3 (cajones de b³).
 * Las «cuentas» son las piezas de cada columna, de las unidades hacia la izquierda.
 *
 * Operaciones en columnas (las etapas de la animación salen de aquí; la escena solo las dibuja)
 *   sumaColumnas(sumandos, b)          suma en columnas: lo que entra en cada columna, la llevada que entra y la que sale
 *                                      (un paquete de b que sube), y los errores al llevar
 *   restaColumnas(M, S, b)             resta con préstamos: abrir un paquete de la columna de la izquierda en b piezas;
 *                                      las acciones (abrir, quitar) en orden, y los errores al prestar
 *   multiplicaPorCifra(numeral, m, b)  m copias de cada pieza que se vuelven a juntar de b en b, y los errores al llevar
 *   cuadroColumnas(plan, t)            el cuadro t de una suma o multiplicación (t de 0 a columnas): qué hay en cada fila,
 *                                      en el resultado y en la casilla de la llevada, y qué se está moviendo
 *   cuadroResta(R, t)                  lo mismo para la resta (t de 0 a acciones.length)
 * Complemento aritmético
 *   complemento(N, b)                  CA(N) = bᵏ − N con la regla «a b − 1 todas, a b la última significativa», el
 *                                      relleno (N + CA llena la caja de bᵏ con llevadas en cadena), y los errores
 *   diferenciaInvertida(L)             un número de 3 cifras menos su reverso (primera cifra mayor que la última) cuya
 *                                      diferencia empieza con L: siempre 99·k, y lo que darían los errores al prestar
 * Cifras que faltan y criptoaritmética (fuerza bruta: todas las posibilidades, para saber si la solución es única)
 *   cifrasFaltantes(sumandos, resultado, b)  casillas con '?' en una suma; las soluciones, la suma de las cifras que
 *                                      faltan y los errores al deducir columna por columna
 *   cripto(sumandos, resultado, o)     letras que son cifras (distintas si o.distintas); todas las soluciones
 *   invertidos(N)                      XY + YX = N: cuánto vale X + Y, los pares posibles y los errores
 * Sumatorias
 *   sumaAritmetica(primero, ultimo, r) cantidad de términos n, la suma S = (primero + último)·n/2, el rectángulo de
 *                                      la escalera y su copia, y los errores
 *   sumatoria(tipo, n)                 1 + … + n, pares, impares (n²), cuadrados y cubos, con su fórmula
 * División entera
 *   division(D, d)                     por defecto (D = d·q + r) y por exceso (D = d·(q + 1) − r′), con r + r′ = d,
 *                                      y los errores sobre el residuo por exceso
 *   residuoMaximo(d)                   d − 1, y los errores
 *   residuosIguales(d)                 ¿cuándo r = r′? (d par y r = d/2), y los errores
 * Cantidad de cifras
 *   cifrasProducto(m, n)               un número de m cifras por uno de n cifras tiene m + n − 1 o m + n cifras
 *
 * Los campos «errores» dicen lo que da cada error típico. Un error que en un caso daría la respuesta correcta
 * (o lo mismo que otro error anterior) no aparece: así la escena nunca tiene dos opciones iguales.
 * Ningún error de esta plantilla tiene un estudio con datos: todos son hipótesis nuestras.
 */
(function (root, fabrica) {
  const api = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.MotorCuatroOperaciones = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const SIMBOLOS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const SEGURO = BigInt(Number.MAX_SAFE_INTEGER);

  // ---------- entradas ----------
  function aBig(x, que) {
    if (typeof x === 'bigint') return x;
    if (typeof x === 'number' && Number.isInteger(x)) {
      if (Math.abs(x) > Number.MAX_SAFE_INTEGER) throw new Error(`${que || 'N'} es demasiado grande para un número exacto; pásalo como BigInt`);
      return BigInt(x);
    }
    if (typeof x === 'string' && /^\d+$/.test(x)) return BigInt(x);
    throw new Error(`${que || 'N'} debe ser un entero`);
  }
  function num(B, que) {
    if (B > SEGURO || B < -SEGURO) throw new Error(`${que || 'el resultado'} es demasiado grande (pasa de 2⁵³ − 1)`);
    return Number(B);
  }
  const quizas = B => (B > SEGURO || B < -SEGURO ? undefined : Number(B));
  function natural(x, que) { const B = aBig(x, que); if (B < 0n) throw new Error(`${que || 'N'} debe ser mayor o igual que 0`); return B; }
  function positivo(x, que) { const B = aBig(x, que); if (B < 1n) throw new Error(`${que || 'N'} debe ser mayor o igual que 1`); return B; }
  function base(b, que) {
    if (b === undefined) return 10;
    if (typeof b !== 'number' || !Number.isInteger(b)) throw new Error(`${que || 'b'}: la base debe ser un entero`);
    if (b < 2 || b > 36) throw new Error(`${que || 'b'}: la base va de 2 a 36`);
    return b;
  }
  function entero(n, que, min, max) {
    if (typeof n !== 'number' || !Number.isInteger(n)) throw new Error(`${que} debe ser un entero`);
    if (min !== undefined && n < min) throw new Error(`${que} debe ser mayor o igual que ${min}`);
    if (max !== undefined && n > max) throw new Error(`${que} debe ser menor o igual que ${max}`);
    return n;
  }
  // Cifras de un numeral (texto, lista o entero de JavaScript), de la de mayor orden a las unidades.
  function leer(numeral) {
    let c;
    if (Array.isArray(numeral)) c = numeral.slice();
    else if (typeof numeral === 'string' && /^[0-9A-Za-z]+$/.test(numeral)) c = numeral.toUpperCase().split('').map(s => SIMBOLOS.indexOf(s));
    else if (typeof numeral === 'number' && Number.isInteger(numeral) && numeral >= 0) c = String(numeral).split('').map(Number);
    else throw new Error('el numeral debe ser un texto de cifras o una lista de cifras');
    if (!c.length) throw new Error('el numeral no tiene cifras');
    c.forEach(d => { if (!Number.isInteger(d) || d < 0 || d > 35) throw new Error('cada cifra debe ser un entero de 0 a 35'); });
    return c;
  }
  function exigirValido(c, b) {
    const m = c.find(d => d >= b);
    if (m !== undefined) throw new Error(`la cifra ${SIMBOLOS[m]} no existe en base ${b}: las cifras van de 0 a ${b - 1}`);
  }
  const texto = cifras => cifras.map(d => SIMBOLOS[d]).join('');
  const SUB = { 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉' };
  const sub = e => '₍' + String(e).split('').map(c => SUB[c]).join('') + '₎';   // como en las academias: 213₍₅₎
  const conBase = (numeral, b) => texto(leer(numeral)) + (b === 10 ? '' : sub(b));
  const pot = (b, k) => BigInt(b) ** BigInt(k);
  const valorBig = (c, b) => c.reduce((s, d) => s * BigInt(b) + BigInt(d), 0n);
  // De BigInt a cifras de base b (de la de mayor orden a las unidades).
  function cifrasDe(V, b) {
    if (V === 0n) return [0];
    const out = []; let x = V;
    while (x > 0n) { out.unshift(Number(x % BigInt(b))); x /= BigInt(b); }
    return out;
  }
  const textoDe = (V, b) => texto(cifrasDe(V, b));
  const sinCerosIzq = t => t.replace(/^0+(?=.)/, '');
  // Cuentas (de las unidades hacia arriba) de un numeral, rellenas hasta K columnas.
  const cuentasDe = (c, K) => { const r = c.slice().reverse(); while (r.length < K) r.push(0); return r; };
  // Una lista de cifras (de las unidades hacia arriba) como texto, solo si todas existen en base b.
  const textoSiValido = (cu, b) => (cu.every(d => Number.isInteger(d) && d >= 0 && d < b) ? sinCerosIzq(texto(cu.slice().reverse())) : undefined);

  // Quita los errores que coinciden con la respuesta o con un error anterior.
  function limpiar(errores, correcta) {
    const igual = (x, y) => JSON.stringify(x) === JSON.stringify(y);
    const out = {}, vistos = [correcta];
    for (const [k, v] of Object.entries(errores)) {
      if (v === undefined || v === null || (typeof v === 'number' && !Number.isFinite(v))) continue;
      if (vistos.some(w => igual(w, v))) continue;
      out[k] = v; vistos.push(v);
    }
    return out;
  }

  // ---------- suma en columnas ----------
  // En cada columna entran las piezas de cada sumando y la llevada de la columna de la derecha; cada b piezas forman
  // un paquete que sube a la columna siguiente (la llevada) y lo que queda es la cifra del resultado.
  function sumaColumnas(sumandos, b) {
    b = base(b);
    if (!Array.isArray(sumandos) || sumandos.length < 2) throw new Error('sumandos debe ser una lista de al menos dos numerales');
    const cs = sumandos.map(leer); cs.forEach(c => exigirValido(c, b));
    const total = cs.reduce((s, c) => s + valorBig(c, b), 0n);
    const res = cifrasDe(total, b), K = Math.max(res.length, ...cs.map(c => c.length));
    const filas = cs.map(c => cuentasDe(c, K));
    const columnas = []; let ll = 0;
    for (let k = 0; k < K; k++) {
      const entran = filas.map(f => f[k]), suma = entran.reduce((s, x) => s + x, 0) + ll;
      const cifra = suma % b, sale = Math.floor(suma / b);
      columnas.push({ orden: k, entran, llevadaEntra: ll, total: suma, cifra, llevadaSale: sale });
      ll = sale;
    }
    const t = texto(res);
    // errores
    const L = Math.max(...cs.map(c => c.length));
    const sumasSin = []; for (let k = 0; k < L; k++) sumasSin.push(filas.reduce((s, f) => s + f[k], 0));
    const sinLlevar = textoSiValido(sumasSin.map(x => x % b), b);                      // escribe cada columna sin llevar
    const todo = sumasSin.slice().reverse().map(x => String(x)).join('');                // escribe la suma entera de cada columna
    const escribeTodo = sumasSin.some(x => x >= b) && /^[0-9]+$/.test(todo) && sumasSin.every(x => x < 100) &&
      [...todo].every(d => +d < b) ? sinCerosIzq(todo) : undefined;
    let comoDecimal;                                                                     // suma las cifras como si fueran de base 10
    if (b !== 10 && cs.every(c => c.every(d => d <= 9))) {
      const s = cs.reduce((a, c) => a + BigInt(c.join('')), 0n).toString();
      comoDecimal = [...s].every(d => +d < b) ? s : undefined;
    }
    return { b, sumandos: cs.map(texto), conBase: cs.map(c => conBase(c, b)), valores: cs.map(c => num(valorBig(c, b))),
      K, filas, columnas, texto: t, conBaseResultado: conBase(res, b), cifras: res, cuentas: cuentasDe(res, K), valor: num(total),
      llevadas: columnas.filter(c => c.llevadaSale > 0).length,
      errores: limpiar({ sinLlevar, escribeTodo, comoDecimal }, t) };
  }

  // ---------- multiplicación por una cifra ----------
  // m copias de cada pieza: en la columna k hay m·cₖ piezas más la llevada; cada b piezas suben como un paquete.
  function multiplicaPorCifra(numeral, m, b) {
    b = base(b);
    const c = leer(numeral); exigirValido(c, b);
    entero(m, 'm', 0, b - 1);
    const V = valorBig(c, b) * BigInt(m), res = cifrasDe(V, b), K = Math.max(res.length, c.length);
    const cu = cuentasDe(c, K), copias = cu.map(x => x * m);
    const columnas = []; let ll = 0;
    for (let k = 0; k < K; k++) {
      const suma = copias[k] + ll, cifra = suma % b, sale = Math.floor(suma / b);
      columnas.push({ orden: k, entran: [copias[k]], llevadaEntra: ll, total: suma, cifra, llevadaSale: sale });
      ll = sale;
    }
    const t = texto(res), L = c.length;
    const prod = cu.slice(0, L).map(x => x * m);
    const sinLlevar = textoSiValido(prod.map(x => x % b), b);                          // cada producto sin llevar
    // calcula la llevada de cada producto pero no la suma a la columna siguiente; la última columna va entera
    let olvidaSumar;
    { const top = cifrasDe(BigInt(prod[L - 1]), b), abajo = prod.slice(0, L - 1).map(x => x % b);
      olvidaSumar = textoSiValido(abajo.concat(top.slice().reverse()), b); }
    let comoDecimal;                                                                    // multiplica como en base 10
    if (b !== 10 && c.every(d => d <= 9)) { const s = (BigInt(c.join('')) * BigInt(m)).toString(); if ([...s].every(d => +d < b)) comoDecimal = s; else comoDecimal = undefined; }
    return { b, numeral: texto(c), conBase: conBase(c, b), m, K, filas: [copias], cuentasNumeral: cu, columnas,
      texto: t, conBaseResultado: conBase(res, b), cifras: res, cuentas: cuentasDe(res, K), valor: num(V), antes: num(valorBig(c, b)),
      errores: limpiar({ comoDecimal, sinLlevar, olvidaSumar }, t) };
  }

  // ---------- un cuadro de la animación de una suma o multiplicación ----------
  // t entero = al terminar la columna t − 1. Dentro de una columna: hasta la mitad, las piezas bajan al resultado;
  // después, si hay b o más, se forma el paquete que sube a la casilla de la llevada de la columna siguiente.
  function cuadroColumnas(plan, t) {
    if (!plan || !Array.isArray(plan.columnas) || !Array.isArray(plan.filas)) throw new Error('plan debe tener filas y columnas');
    if (typeof t !== 'number' || !Number.isFinite(t)) throw new Error('t debe ser un número');
    const K = plan.columnas.length; t = Math.max(0, Math.min(K, t));
    const filas = plan.filas.map(f => f.slice()), resultado = Array(K).fill(null), llevada = Array(K + 1).fill(0);
    let k = Math.min(K - 1, Math.floor(t)), f = t - k;
    if (t >= K) { k = K; f = 0; }
    for (let j = 0; j < Math.min(k, K); j++) {
      const c = plan.columnas[j];
      filas.forEach(r => { r[j] = 0; });
      resultado[j] = c.cifra;
      if (j + 1 < K) llevada[j + 1] = c.llevadaSale; else llevada[K] = c.llevadaSale;
    }
    // la llevada que ya entró en una columna hecha no se ve más
    for (let j = 0; j < Math.min(k, K); j++) llevada[j] = 0;
    let moviendo = null;
    if (k < K) {
      const c = plan.columnas[k];
      if (f < 0.5) moviendo = { tipo: 'bajar', orden: k, f: f / 0.5 };
      else {
        filas.forEach(r => { r[k] = 0; }); llevada[k] = 0;
        const g = (f - 0.5) / 0.5;
        if (c.llevadaSale > 0) { resultado[k] = c.cifra; moviendo = { tipo: 'subir', orden: k, paquetes: c.llevadaSale, f: g }; }
        else resultado[k] = c.total;
      }
    }
    return { filas, resultado, llevada: llevada.slice(0, K), llevadaFuera: llevada[K], moviendo, columna: k, fin: t >= K };
  }

  // ---------- resta con préstamos ----------
  // Las acciones, en orden: abrir una pieza de la columna j en b piezas de la columna j − 1 (el préstamo, en cadena si
  // hay ceros) y quitar de la columna k las piezas del sustraendo.
  function restaColumnas(Mn, Sn, b) {
    b = base(b);
    const cm = leer(Mn), csu = leer(Sn); exigirValido(cm, b); exigirValido(csu, b);
    const VM = valorBig(cm, b), VS = valorBig(csu, b);
    if (VS > VM) throw new Error('el sustraendo no puede ser mayor que el minuendo');
    const K = Math.max(cm.length, csu.length);
    const arriba = cuentasDe(cm, K), abajo = cuentasDe(csu, K), a = arriba.slice(), acciones = [], prestamos = [];
    const res = [];
    for (let k = 0; k < K; k++) {
      if (a[k] < abajo[k]) {
        let j = k + 1; while (a[j] === 0) j++;
        prestamos.push({ para: k, desde: j });
        for (let i = j; i > k; i--) { a[i] -= 1; a[i - 1] += b; acciones.push({ tipo: 'abrir', orden: i }); }
      }
      acciones.push({ tipo: 'quitar', orden: k, hay: a[k], quita: abajo[k], quedan: a[k] - abajo[k] });
      res.push(a[k] - abajo[k]);
    }
    const V = VM - VS, cifras = cifrasDe(V, b), t = texto(cifras);
    // errores
    const menorDelMayor = textoSiValido(arriba.map((x, k) => Math.abs(x - abajo[k])), b);          // en cada columna, el menor del mayor
    const sinDescontar = textoSiValido(arriba.map((x, k) => (x < abajo[k] ? x + b - abajo[k] : x - abajo[k])), b); // pide prestado y no descuenta
    let cerosComoB;                                                                                  // los ceros que prestan quedan en b, no en b − 1
    { const z = arriba.slice(), r = []; let ok = true;
      for (let k = 0; k < K; k++) {
        if (z[k] < abajo[k]) {
          let j = k + 1; while (j < K && z[j] === 0) j++;
          if (j >= K) { ok = false; break; }
          z[j] -= 1; for (let i = j - 1; i > k; i--) z[i] = b; z[k] += b;
        }
        r.push(z[k] - abajo[k]);
      }
      cerosComoB = ok && prestamos.some(p => p.desde > p.para + 1) ? textoSiValido(r, b) : undefined; }
    let comoDecimal;
    if (b !== 10 && cm.every(d => d <= 9) && csu.every(d => d <= 9)) {
      const s = (BigInt(cm.join('')) - BigInt(csu.join(''))).toString(); comoDecimal = [...s].every(d => +d < b) ? s : undefined;
    }
    return { b, minuendo: texto(cm), sustraendo: texto(csu), conBase: [conBase(cm, b), conBase(csu, b)], K,
      arriba, abajo, tras: a, acciones, prestamos, resultado: res, texto: t, conBaseResultado: conBase(cifras, b), cifras,
      valor: num(V), valores: [num(VM), num(VS)],
      errores: limpiar({ menorDelMayor, sinDescontar, cerosComoB, comoDecimal }, t) };
  }
  // Un cuadro de la resta: las acciones antes de t ya pasaron; la acción en curso va por la fracción f.
  function cuadroResta(R, t) {
    if (!R || !Array.isArray(R.acciones)) throw new Error('R debe ser una resta de restaColumnas');
    if (typeof t !== 'number' || !Number.isFinite(t)) throw new Error('t debe ser un número');
    const n = R.acciones.length, b = R.b; t = Math.max(0, Math.min(n, t));
    const a = R.arriba.slice(), et = R.arriba.slice(), ab = R.abajo.slice(), resultado = Array(R.K).fill(null);
    let i = Math.min(n - 1, Math.floor(t)), f = t - i; if (t >= n) { i = n; f = 0; }
    const aplicar = x => {
      if (x.tipo === 'abrir') { a[x.orden] -= 1; a[x.orden - 1] += b; et[x.orden] -= 1; et[x.orden - 1] += b; }
      else { resultado[x.orden] = x.quedan; a[x.orden] = 0; ab[x.orden] = 0; }
    };
    for (let j = 0; j < i; j++) aplicar(R.acciones[j]);
    let moviendo = null;
    if (i < n) {
      const x = R.acciones[i];
      moviendo = Object.assign({ f }, x);
      if (x.tipo === 'quitar') moviendo.tachadas = Math.round(Math.min(1, f / 0.6) * x.quita);
    }
    return { arriba: a, etiquetas: et, abajo: ab, resultado, moviendo, accion: i, fin: t >= n };
  }

  // ---------- complemento aritmético ----------
  function complemento(N, b) {
    b = base(b);
    const c = leer(N); exigirValido(c, b);
    if (c.length > 1 && c[0] === 0) throw new Error('el numeral no puede empezar con 0');
    const V = valorBig(c, b);
    if (V === 0n) throw new Error('N debe ser mayor que 0');
    const k = c.length, P = pot(b, k), CA = P - V;
    // la regla de academia, de izquierda a derecha: a b − 1 todas, a b la última significativa, y los ceros finales quedan
    let u = k - 1; while (c[u] === 0) u--;
    const regla = c.map((d, i) => (i < u ? b - 1 - d : i === u ? b - d : 0));
    const t = sinCerosIzq(texto(regla));
    const relleno = sumaColumnas([texto(c), texto(cifrasDe(CA, b))], b);
    // errores
    const todasA = sinCerosIzq(textoDe(P - 1n - V, b));                                     // todas a b − 1, sin el + 1
    const deja = c.map((d, i) => (i < u ? (d === 0 ? 0 : b - 1 - d) : i === u ? b - d : 0));
    const dejaElCero = c.slice(0, u).includes(0) ? sinCerosIzq(texto(deja)) : undefined;     // deja como 0 los ceros de adentro
    const aB = c.map((d, i) => (i < k - 1 ? b - 1 - d : (b - d) % b));                       // «a b la última» aunque sea 0
    const aBUltima = c[k - 1] === 0 ? sinCerosIzq(texto(aB)) : undefined;
    const potenciaDeMas = quizas(pot(b, k + 1) - V) === undefined ? undefined : sinCerosIzq(textoDe(pot(b, k + 1) - V, b)); // usa bᵏ⁺¹
    let quitaLosCeros;                                                                        // calcula el CA sin los ceros finales y no los repone
    if (u < k - 1) { const cc = c.slice(0, u + 1); quitaLosCeros = sinCerosIzq(textoDe(pot(b, cc.length) - valorBig(cc, b), b)); }
    return { N: texto(c), b, k, potencia: quizas(P), potenciaTexto: '1' + '0'.repeat(k), texto: t, valor: num(CA),
      regla, ultimaSignificativa: u, cerosFinales: k - 1 - u, relleno,
      errores: limpiar({ todasANueve: todasA, dejaElCero, aBUltima, quitaLosCeros, potenciaDeMas }, t) };
  }

  // Un número de 3 cifras (primera mayor que la última) menos su reverso: 99·(primera − última). La diferencia que
  // empieza con L sale de primera − última = L + 1. Los errores salen de restar mal un ejemplo con primera − última = L
  // (lo que cree quien resta sin préstamo), con restaColumnas.
  function diferenciaInvertida(L) {
    entero(L, 'L', 1, 7);   // primera − última va de 2 a 8 (la última no es 0)
    const k = L + 1, dif = 99 * k, t = String(dif);
    const ej = [];
    for (let a = 1; a <= 9; a++) for (let m = 0; m <= 9; m++) { const c = a - k; if (c >= 1) ej.push(`${a}${m}${c}`); }
    const muestra = restaColumnas(`${L + 1}5${1}`, `${1}5${L + 1}`, 10);      // primera − última = L
    return { L, diferencia: dif, texto: t, primeraMenosUltima: k, cifras: t.split('').map(Number), ejemplos: ej,
      errores: limpiar({
        sinPrestamo: muestra.errores.menorDelMayor,                         // en cada columna, el menor del mayor: L0L
        sinDescontar: muestra.errores.sinDescontar,                         // presta a las unidades y no descuenta: L0(10 − L)
        medioCero: `${L}0${9 - L}`,                                         // cree que la cifra del medio da 0 (m − m)
      }, t) };
  }
  // La diferencia de un número de 3 cifras y su reverso, para los ejemplos de la escena.
  function conSuReverso(N) {
    const c = leer(N); if (c.length !== 3 || c[0] <= c[2] || c[2] === 0) throw new Error('N debe tener 3 cifras, la primera mayor que la última y la última distinta de 0');
    const rv = c.slice().reverse(), R = restaColumnas(texto(c), texto(rv), 10);
    return { N: texto(c), reverso: texto(rv), diferencia: R.valor, texto: R.texto, k: c[0] - c[2], resta: R };
  }

  // ---------- cifras que faltan ----------
  // sumandos y resultado son textos con '?' donde falta una cifra. Se prueban todas las maneras de llenar las casillas.
  function cifrasFaltantes(sumandos, resultado, b) {
    b = base(b);
    if (!Array.isArray(sumandos) || sumandos.length < 2) throw new Error('sumandos debe ser una lista de al menos dos textos');
    const pats = sumandos.concat([resultado]).map(p => { if (typeof p !== 'string' || !/^[0-9A-Z?]+$/i.test(p)) throw new Error('cada fila es un texto de cifras y ?'); return p.toUpperCase().split(''); });
    const huecos = [];
    pats.forEach((p, fila) => p.forEach((ch, i) => { if (ch === '?') huecos.push({ fila, posicion: i, orden: p.length - 1 - i, primera: i === 0 && p.length > 1 }); }));
    if (!huecos.length) throw new Error('no hay casillas con ?');
    if (huecos.length > 6) throw new Error('demasiadas casillas para probarlas todas');
    pats.forEach(p => p.forEach(ch => { if (ch !== '?') exigirValido([SIMBOLOS.indexOf(ch)], b); }));
    const soluciones = [], total = Math.pow(b, huecos.length);
    for (let x = 0; x < total; x++) {
      let y = x; const v = huecos.map(() => { const d = y % b; y = Math.floor(y / b); return d; });
      if (huecos.some((h, j) => h.primera && v[j] === 0)) continue;
      const filas = pats.map(p => p.slice());
      huecos.forEach((h, j) => { filas[h.fila][h.posicion] = SIMBOLOS[v[j]]; });
      const vals = filas.map(f => valorBig(f.map(ch => SIMBOLOS.indexOf(ch)), b));
      const s = vals.slice(0, -1).reduce((a, q) => a + q, 0n);
      if (s === vals[vals.length - 1]) soluciones.push({ faltan: v, filas: filas.map(f => f.join('')) });
    }
    const unica = soluciones.length === 1, sol = unica ? soluciones[0] : null;
    const out = { b, sumandos: sumandos.slice(), resultado, huecos, soluciones, unica,
      faltan: sol ? sol.faltan : null, filas: sol ? sol.filas : null, suma: sol ? sol.faltan.reduce((a, q) => a + q, 0) : null,
      columnas: sol ? sumaColumnas(sol.filas.slice(0, -1), b).columnas : null, errores: {} };
    // errores: deducir columna por columna (dos sumandos, resultado completo, una casilla por columna en los sumandos)
    if (sol && sumandos.length === 2 && !resultado.includes('?')) {
      const K = resultado.length, r = cuentasDe(leer(resultado), K);
      const A = cuentasDe(pats[0].map(ch => (ch === '?' ? -1 : SIMBOLOS.indexOf(ch))), K), Bc = cuentasDe(pats[1].map(ch => (ch === '?' ? -1 : SIMBOLOS.indexOf(ch))), K);
      const L = Math.max(pats[0].length, pats[1].length);
      const una = [...Array(L).keys()].every(k => (A[k] === -1) + (Bc[k] === -1) === 1);
      if (una) {
        const deducir = modelo => {
          let ll = 0, s = 0;
          for (let k = 0; k < L; k++) {
            const conocida = A[k] === -1 ? Bc[k] : A[k];
            const entra = modelo === 'sin' ? 0 : modelo === 'primera' ? (k === 1 ? ll : 0) : ll;
            const x = modelo === 'suma' ? (((r[k] - conocida + entra) % b) + b) % b : (((r[k] - conocida - entra) % b) + b) % b;
            if (k === L - 1 && x === 0) return undefined;
            s += x; ll = Math.floor((x + conocida + entra) / b);
          }
          return s;
        };
        out.errores = limpiar({ sinLlevadas: deducir('sin'), soloLaPrimera: deducir('primera'), sumaLaLlevada: deducir('suma') }, out.suma);
        out.deduccion = deducir('ok');
      }
    }
    return out;
  }

  // ---------- criptoaritmética ----------
  // sumandos y resultado son palabras de letras (y cifras); cada letra es una cifra; las primeras no son 0.
  function cripto(sumandos, resultado, o) {
    o = o || {}; const b = base(o.b), distintas = o.distintas !== false;
    const palabras = sumandos.concat([resultado]).map(p => { if (typeof p !== 'string' || !/^[0-9A-Z]+$/.test(p)) throw new Error('cada palabra es un texto de letras mayúsculas y cifras'); return p.split(''); });
    const letras = [...new Set(palabras.flat().filter(ch => /[A-Z]/.test(ch)))];
    if (!letras.length) throw new Error('no hay letras');
    if (letras.length > 6) throw new Error('demasiadas letras para probarlas todas');
    const primeras = new Set(palabras.filter(p => p.length > 1).map(p => p[0]).filter(ch => /[A-Z]/.test(ch)));
    const soluciones = [], total = Math.pow(b, letras.length);
    for (let x = 0; x < total; x++) {
      let y = x; const m = {};
      letras.forEach(L => { m[L] = y % b; y = Math.floor(y / b); });
      if (distintas && new Set(Object.values(m)).size < letras.length) continue;
      if ([...primeras].some(L => m[L] === 0)) continue;
      const val = p => p.reduce((s, ch) => s * BigInt(b) + BigInt(/[A-Z]/.test(ch) ? m[ch] : SIMBOLOS.indexOf(ch)), 0n);
      const vs = palabras.map(val);
      if (vs.slice(0, -1).reduce((a, q) => a + q, 0n) === vs[vs.length - 1]) soluciones.push(m);
    }
    return { sumandos: sumandos.slice(), resultado, letras, soluciones, unica: soluciones.length === 1,
      solucion: soluciones.length === 1 ? soluciones[0] : null };
  }
  // XY + YX = N, con X e Y cifras distintas: las dos columnas suman lo mismo, X + Y, y la de las decenas recibe la llevada.
  function invertidos(N) {
    const n = num(positivo(N, 'N'));
    const C = cripto(['XY', 'YX'], String(n), { distintas: true });
    const sumas = [...new Set(C.soluciones.map(m => m.X + m.Y))];
    const s = sumas.length === 1 ? sumas[0] : null;
    const cifras = String(n).split('').map(Number);
    return { N: n, soluciones: C.soluciones, pares: C.soluciones.map(m => `${m.X}${m.Y}`), existe: sumas.length > 0, unica: sumas.length === 1, suma: s,
      once: n % 11 === 0 ? n / 11 : null,
      errores: s === null ? {} : limpiar({
        sumaCifras: cifras.reduce((a, q) => a + q, 0),                // suma las cifras del resultado
        sinLlevada: n >= 100 ? Math.floor(n / 10) : undefined,       // lee X + Y en las decenas y olvida la llevada
        mitad: n % 2 === 0 ? n / 2 : undefined,                      // cree que XY + YX es el doble de XY
      }, s) };
  }

  // ---------- sumatorias ----------
  // primero, primero + r, …, último. La escalera y su copia girada arman un rectángulo de n filas y (primero + último) de ancho.
  function sumaAritmetica(primero, ultimo, r) {
    const p = aBig(primero, 'primero'), u = aBig(ultimo, 'último'), R = positivo(r === undefined ? 1 : r, 'r');
    if (u < p) throw new Error('el último término debe ser mayor o igual que el primero');
    if ((u - p) % R !== 0n) throw new Error('el último término no está en la sucesión');
    const n = (u - p) / R + 1n, par = p + u, S = par * n / 2n;
    const T = x => x * (x + 1n) / 2n;
    const errores = {
      ultimoComoN: p >= 1n ? quizas(T(u)) : undefined,                       // usa la fórmula de 1 + 2 + … + n con n = último
      sinMasUno: (par * (n - 1n)) % 2n === 0n && n > 1n ? quizas(par * (n - 1n) / 2n) : undefined, // cuenta (último − primero)/r términos, sin el + 1
      sinDividir: quizas(par * n),                                           // olvida dividir entre 2 (son dos escaleras)
      restaElPrimero: R === 1n && p > 1n ? quizas(T(u) - T(p)) : undefined,  // resta 1 + … + primero (también el primero)
    };
    return { primero: num(p), ultimo: num(u), r: num(R), n: num(n), par: num(par), S: num(S), dobles: num(par * n),
      rectangulo: { filas: num(n), ancho: num(par), area: num(par * n) }, errores: limpiar(errores, num(S)) };
  }
  function sumatoria(tipo, n) {
    const N = aBig(n, 'n'); if (N < 1n) throw new Error('n debe ser mayor o igual que 1');
    const F = {
      naturales: [N * (N + 1n) / 2n, 'n(n + 1)/2'], pares: [N * (N + 1n), 'n(n + 1)'], impares: [N * N, 'n²'],
      cuadrados: [N * (N + 1n) * (2n * N + 1n) / 6n, 'n(n + 1)(2n + 1)/6'], cubos: [(N * (N + 1n) / 2n) ** 2n, '(n(n + 1)/2)²'] };
    if (!F[tipo]) throw new Error('tipo: naturales, pares, impares, cuadrados o cubos');
    const ultimo = { naturales: N, pares: 2n * N, impares: 2n * N - 1n, cuadrados: N * N, cubos: N * N * N }[tipo];
    return { tipo, n: num(N), S: num(F[tipo][0]), formula: F[tipo][1], ultimo: num(ultimo) };
  }

  // ---------- división entera ----------
  function division(D, d) {
    const Dv = natural(D, 'D'), dv = positivo(d, 'd');
    const q = Dv / dv, r = Dv % dv, exacta = r === 0n;
    const re = exacta ? null : dv - r;
    const out = { D: num(Dv), d: num(dv), q: num(q), r: num(r), exacta, qExceso: exacta ? null : num(q + 1n), rExceso: re === null ? null : num(re),
      residuoMaximo: num(dv - 1n), filas: { llenas: num(q), sobran: num(r), huecos: re === null ? 0 : num(re) } };
    out.errores = exacta ? {} : limpiar({
      igualAlDefecto: num(r),                                         // cree que r′ = r
      divisorMenosUnoMenosR: dv - 1n - r > 0n ? num(dv - 1n - r) : undefined, // resta del residuo máximo: d − 1 − r
      sumaElDivisor: num(dv + r),                                      // suma el divisor al residuo
      masUno: num(r + 1n),                                             // cree que si el cociente sube 1, el residuo también
    }, num(re));
    return out;
  }
  function residuoMaximo(d) {
    const dv = num(positivo(d, 'd'));
    if (dv < 2) throw new Error('d debe ser mayor o igual que 2');
    return { d: dv, maximo: dv - 1, errores: limpiar({ igualAlDivisor: dv, mitad: Math.floor(dv / 2), menosDos: dv - 2 > 0 ? dv - 2 : undefined }, dv - 1) };
  }
  // r = r′ solo si r = d − r, es decir, d par y r = d/2. La respuesta es el residuo, o 'nunca' si d es impar.
  function residuosIguales(d) {
    const dv = num(positivo(d, 'd'));
    if (dv < 2) throw new Error('d debe ser mayor o igual que 2');
    const r = dv % 2 === 0 ? dv / 2 : 'nunca';
    const ejemplos = [];
    for (let D = dv; D <= 3 * dv; D++) { const x = division(D, dv); if (!x.exacta && x.r === x.rExceso) ejemplos.push(D); }
    return { d: dv, residuo: r, existe: r !== 'nunca', ejemplos,
      errores: limpiar({ residuoCero: 0, residuoMaximo: dv - 1, nunca: 'nunca' }, r) };
  }

  // ---------- cantidad de cifras de un producto ----------
  function cifrasProducto(m, n) {
    entero(m, 'm', 1, 15); entero(n, 'n', 1, 15);
    const menor = pot(10, m - 1) * pot(10, n - 1), mayor = (pot(10, m) - 1n) * (pot(10, n) - 1n);
    const r = [m + n - 1, m + n];
    return { m, n, cifras: r, minimo: m + n - 1, maximo: m + n,
      menor: { a: quizas(pot(10, m - 1)), b: quizas(pot(10, n - 1)), producto: quizas(menor), texto: menor.toString(), cifras: menor.toString().length },
      mayor: { a: quizas(pot(10, m) - 1n), b: quizas(pot(10, n) - 1n), producto: quizas(mayor), texto: mayor.toString(), cifras: mayor.toString().length },
      errores: limpiar({
        siempreLaSuma: [m + n],                 // cree que siempre tiene m + n cifras
        multiplica: [m * n],                    // multiplica las cantidades de cifras
        unaDeMas: [m + n, m + n + 1],           // cree que puede tener una cifra más que m + n
      }, r) };
  }

  return { sumaColumnas, multiplicaPorCifra, cuadroColumnas, restaColumnas, cuadroResta, complemento, diferenciaInvertida,
    conSuReverso, cifrasFaltantes, cripto, invertidos, sumaAritmetica, sumatoria, division, residuoMaximo, residuosIguales,
    cifrasProducto, leer, texto, conBase, sub, SIMBOLOS };
});
