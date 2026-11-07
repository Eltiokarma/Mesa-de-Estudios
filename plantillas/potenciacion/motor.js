/*
 * Motor de «El cuadrado de fichas»: potenciación y radicación.
 *
 * CABECERA: raizEntera, esCuadrado, esCubo, agregarParaSiguiente, terminaciones, criterios, puedeSerCuadrado, factores, menorMultiplicador, menorDivisor, cuadradosEntre, cuadradosDeCifras, cifrasRaiz, sumaImpares, terminaEn5, restosCuadrados, tablaRestos, layoutCuadrado, layoutFilas, fichasFactores, layoutL, filasImpares, capasL, cuboIso, crecerCubo, reacomodar, interpolar
 *
 * Aquí vive toda la matemática de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el
 * navegador (window.MotorPotenciacion) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 * Todo es aritmética entera exacta: por dentro se cuenta con BigInt (raíces por el método de Newton, sin Math.sqrt) y se
 * devuelven números de JavaScript solo si caben exactos (hasta 2⁵³ − 1); si no, el motor avisa en vez de redondear.
 *
 * Raíz entera (n = 2 cuadrada, n = 3 cúbica)
 *   raizEntera(N, n)             k = ⌊ⁿ√N⌋ por defecto y k + 1 por exceso; resto r = N − kⁿ (0 ≤ r ≤ (k+1)ⁿ − kⁿ − 1,
 *                                es decir, r ≤ 2k en la cuadrada) y resto por exceso r′ = (k+1)ⁿ − N; dos decimales
 *                                de la raíz (truncados) y los errores típicos al dar la raíz y el resto
 *   esCuadrado(N), esCubo(N)     ¿N = k² o N = k³ para un entero k?
 *   agregarParaSiguiente(k, n)   de kⁿ a (k+1)ⁿ: la L de 2k + 1 fichas (o la cáscara de 3k² + 3k + 1 cubitos), por partes
 * Cifras terminales y criterios
 *   terminaciones(n)             las últimas cifras posibles de kⁿ en base 10 (por la rueda: k mod 10 → kⁿ mod 10)
 *   criterios(N)                 los criterios de exclusión de cuadrados (última cifra, ceros, terminación en 5, entre 4,
 *                                entre 9 por la suma de cifras) con la razón de cada uno; nunca excluyen un cuadrado
 *   puedeSerCuadrado(lista)      cuáles de la lista pasan todos los criterios, y a cuál deja pasar cada regla errónea
 * Descomposición y exponentes
 *   factores(N)                  N = p₁^e₁ · p₂^e₂ · …
 *   menorMultiplicador(N, n)     el menor m con N·m potencia n-ésima (completa cada exponente hasta un múltiplo de n)
 *   menorDivisor(N, n)           el menor d con N/d potencia n-ésima (quita lo que sobra de cada exponente)
 * Conteo
 *   cuadradosEntre(a, b)         cuántos cuadrados perfectos hay de a a b (incluidos): ⌊√b⌋ − ⌈√a⌉ + 1
 *   cuadradosDeCifras(c)         cuántos cuadrados perfectos tienen c cifras
 *   cifrasRaiz(c)                cuántas cifras tiene la raíz cuadrada entera de un número de c cifras: ⌈c/2⌉
 * «¿Qué pasa si…?»
 *   sumaImpares(n)               1 + 3 + … + (2n − 1) = n²: las L apiladas
 *   terminaEn5(x)                (10a + 5)² = a(a + 1)·100 + 25
 *   restosCuadrados(m)           los restos que deja un cuadrado al dividirlo entre m; tablaRestos(m, hasta): k² y su resto
 * Posiciones para los dibujos (la escena solo las pinta; las animaciones interpolan entre dos de ellas)
 *   layoutCuadrado(N, k, modo)   N fichas: un cuadrado de lado k y las que sobran ('aparte' o 'L'), o los huecos que faltan
 *   layoutFilas(N, ancho)        N fichas en filas (el acomodo neutro de antes de responder)
 *   fichasFactores(N, n)         los primos como fichas: grupos de n iguales, los que quedan sueltos y los que faltan
 *   layoutL(k)                   las 2k + 1 fichas que llevan de k² a (k+1)²
 *   filasImpares(n), capasL(n)   las mismas n² fichas en filas de 1, 3, 5… y dobladas en L (el mismo orden)
 *   cuboIso(a, b, c), crecerCubo(k, sep), reacomodar(N, de, a)  cubitos (x, y, z) para la vista isométrica (la cáscara
 *                                del cubo que crece también separada del cubo viejo, para verla entera)
 *   interpolar(A, B, t)          la posición de cada ficha entre dos acomodos
 *
 * Los campos «errores» dicen lo que da cada error típico. Un error que en un caso daría la respuesta correcta
 * (o lo mismo que otro error anterior) no aparece: así la escena nunca tiene dos opciones iguales.
 * Ningún error de esta plantilla tiene un estudio con datos: todos son hipótesis nuestras.
 */
(function (root, fabrica) {
  const api = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.MotorPotenciacion = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

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
  function natural(x, que, min) {
    const B = aBig(x, que);
    const m = min === undefined ? 0n : BigInt(min);
    if (B < m) throw new Error(`${que || 'N'} debe ser mayor o igual que ${m}`);
    return B;
  }
  function indice(n) {
    if (n === undefined) return 2;
    if (n !== 2 && n !== 3) throw new Error('n debe ser 2 (raíz cuadrada) o 3 (raíz cúbica)');
    return n;
  }
  function entero(n, que, min, max) {
    if (typeof n !== 'number' || !Number.isInteger(n)) throw new Error(`${que} debe ser un entero`);
    if (min !== undefined && n < min) throw new Error(`${que} debe ser mayor o igual que ${min}`);
    if (max !== undefined && n > max) throw new Error(`${que} debe ser menor o igual que ${max}`);
    return n;
  }
  // Quita los errores que coinciden con la respuesta o con un error anterior.
  function limpiar(errores, correcta) {
    const igual = (x, y) => JSON.stringify(x, (k, v) => (typeof v === 'bigint' ? 'n' + v : v)) === JSON.stringify(y, (k, v) => (typeof v === 'bigint' ? 'n' + v : v));
    const out = {}, vistos = [correcta];
    for (const [k, v] of Object.entries(errores)) {
      if (v === undefined || v === null || (typeof v === 'number' && !Number.isFinite(v))) continue;
      if (vistos.some(w => igual(w, v))) continue;
      out[k] = v; vistos.push(v);
    }
    return out;
  }
  const pot = (k, n) => k ** BigInt(n);

  // ---------- raíces enteras exactas ----------
  // ⌊ⁿ√N⌋ por Newton con enteros: empieza arriba de la raíz y baja hasta que no puede bajar más.
  function iraiz(N, n) {
    if (N < 0n) throw new Error('N debe ser mayor o igual que 0');
    if (N < 2n) return N;
    const nb = BigInt(n);
    let x = 1n << BigInt(Math.ceil(N.toString(2).length / n) + 1);
    for (;;) {
      const y = ((nb - 1n) * x + N / pot(x, n - 1)) / nb;
      if (y >= x) break;
      x = y;
    }
    while (pot(x, n) > N) x--;
    while (pot(x + 1n, n) <= N) x++;
    return x;
  }
  // Texto con coma decimal y espacio de miles: 12 247 → '12 247'; 0,24.
  const miles = B => String(B).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  // Números exactos: de JavaScript si caben (hasta 2⁵³ − 1); si no, BigInt.
  const exacto = B => (B > SEGURO || B < -SEGURO ? B : Number(B));
  function raizEntera(N, n) {
    n = indice(n);
    const X = natural(N), k = iraiz(X, n), r = X - pot(k, n), rp = pot(k + 1n, n) - X;
    const max = pot(k + 1n, n) - pot(k, n) - 1n;
    // dos decimales truncados de la raíz: ⌊ⁿ√(N · 100ⁿ)⌋
    const c = iraiz(X * pot(100n, n), n), dec = c - k * 100n;
    const decimal = `0,${String(dec).padStart(2, '0')}`;
    const aproximada = `${k},${String(dec).padStart(2, '0')}`;
    const correcta = { k: exacto(k), r: exacto(r) };
    const km = k - 1n;
    return { N: exacto(X), n, k: exacto(k), r: exacto(r), exceso: exacto(k + 1n), rp: exacto(rp), exacta: r === 0n, restoMaximo: exacto(max),
      decimal, aproximada, respuesta: correcta,
      errores: limpiar({
        confundeDefectoExceso: r === 0n ? undefined : { k: exacto(k + 1n), r: exacto(rp) },   // da la raíz por exceso y lo que falta como resto
        ladoMenor: km >= 0n ? { k: exacto(km), r: exacto(X - pot(km, n)) } : undefined,  // se queda con un cuadrado más chico: el resto pasa de 2k
        restoDecimal: r === 0n || dec === 0n ? undefined : { k: exacto(k), r: decimal },      // toma la parte decimal de la raíz como resto
      }, correcta) };
  }
  const esCuadrado = N => raizEntera(N, 2).exacta;
  const esCubo = N => raizEntera(N, 3).exacta;

  // De kⁿ a (k+1)ⁿ.
  function agregarParaSiguiente(k, n) {
    n = indice(n);
    const K = natural(k, 'k'), agrega = pot(K + 1n, n) - pot(K, n);
    if (n === 2) {
      return { k: num(K), n, agrega: num(agrega), partes: { lado: num(K), otroLado: num(K), esquina: 1 }, desde: num(K * K), hasta: num((K + 1n) * (K + 1n)),
        errores: limpiar({
          olvidaEsquina: num(2n * K),                     // pone una fila y una columna de k y olvida la esquina
          unLado: num(K + 1n),                            // agrega solo una fila
          restaLado: num((K + 1n) * (K + 1n) - K),        // resta el lado del área: (k+1)² − k
        }, num(agrega)) };
    }
    return { k: num(K), n, agrega: num(agrega), partes: { caras: num(3n * K * K), aristas: num(3n * K), esquina: 1 }, desde: num(K ** 3n), hasta: num((K + 1n) ** 3n),
      errores: limpiar({
        soloCaras: num(3n * K * K),                       // tapa tres caras y olvida los bordes y la esquina
        capaNueva: num((K + 1n) * (K + 1n)),              // una sola capa del cubo nuevo
        copiaLaL: num(3n * K + 1n),                       // copia la L del cuadrado: 3k + 1
        unaCapa: num(K * K),                              // una capa del cubo viejo
      }, num(agrega)) };
  }

  // ---------- cifras terminales y criterios ----------
  function terminaciones(n) {
    entero(n, 'n', 1, 12);
    const mapa = [];
    for (let d = 0; d < 10; d++) mapa.push(Number(pot(BigInt(d), n) % 10n));
    const cifras = [...new Set(mapa)].sort((a, b) => a - b);
    return { n, mapa, cifras, nunca: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(d => !cifras.includes(d)), todas: cifras.length === 10 };
  }
  const sumaCifras = B => String(B).split('').reduce((s, d) => s + Number(d), 0);
  const RESTOS9 = [0, 1, 4, 7];   // k² mod 9
  function criterios(N) {
    const X = natural(N), t = String(X), u = Number(X % 10n), razones = [];
    let ceros = 0; while (ceros < t.length - 1 && t[t.length - 1 - ceros] === '0') ceros++;
    if (X === 0n) ceros = 0;
    if ([2, 3, 7, 8].includes(u)) razones.push({ id: 'ultima-cifra', texto: `termina en ${u}, y ningún cuadrado termina en 2, 3, 7 u 8` });
    if (ceros % 2 === 1) razones.push({ id: 'ceros-impares', texto: `termina en ${ceros} cero${ceros === 1 ? '' : 's'}, y un cuadrado termina en una cantidad par de ceros` });
    if (u === 5 && X % 100n !== 25n) razones.push({ id: 'termina-en-5', texto: `termina en 5 pero no en 25, y todo cuadrado que termina en 5 termina en 25` });
    const r4 = Number(X % 4n);
    if (r4 === 2 || r4 === 3) razones.push({ id: 'entre-4', texto: `al dividirlo entre 4 deja resto ${r4}, y un cuadrado deja 0 o 1` });
    const s = sumaCifras(X), r9 = Number(X % 9n);
    if (!RESTOS9.includes(r9)) razones.push({ id: 'entre-9', texto: `sus cifras suman ${s}, que entre 9 deja resto ${r9}, y en un cuadrado ese resto es 0, 1, 4 o 7` });
    return { N: num(X), excluido: razones.length > 0, razones, sumaCifras: s, resto4: r4, resto9: r9, ceros, esCuadrado: raizEntera(X).exacta };
  }
  // Reglas erróneas: a qué número de la lista (que los criterios sí excluyen) dejaría pasar cada una.
  function puedeSerCuadrado(lista) {
    if (!Array.isArray(lista) || !lista.length) throw new Error('lista debe tener números');
    const C = lista.map(criterios);
    const pueden = C.filter(c => !c.excluido).map(c => c.N), excluidos = C.filter(c => c.excluido);
    const primero = f => { const c = excluidos.find(f); return c ? c.N : undefined; };
    const sinCeros = x => { let s = String(x); while (s.length > 1 && s.endsWith('0')) s = s.slice(0, -1); return BigInt(s); };
    return { lista: C.map(c => c.N), pueden, excluidos: excluidos.map(c => ({ N: c.N, razones: c.razones })), detalle: C,
      errores: limpiar({
        terminaEnUno: primero(c => [1, 4, 6, 9].includes(c.N % 10)),                       // cree que terminar en 1, 4, 6 o 9 basta
        ignoraLosCeros: primero(c => c.ceros > 0 && raizEntera(sinCeros(c.N)).exacta),      // mira lo que queda sin los ceros
        terminaEn5Basta: primero(c => c.N % 10 === 5),                                       // cree que terminar en 5 basta
      }, pueden.length === 1 ? pueden[0] : pueden) };
  }

  // ---------- descomposición y exponentes ----------
  function factores(N) {
    let X = natural(N, 'N', 1);
    if (X > 10n ** 14n) throw new Error('N es demasiado grande para descomponerlo aquí (hasta 10¹⁴)');
    const f = [];
    for (let p = 2n; p * p <= X; p += p === 2n ? 1n : 2n) {
      if (X % p) continue;
      let e = 0; while (X % p === 0n) { X /= p; e++; }
      f.push({ p: num(p), e });
    }
    if (X > 1n) f.push({ p: num(X), e: 1 });
    return f;
  }
  const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const sup = e => String(e).split('').map(c => SUP[c]).join('');
  const textoFactores = f => (f.length ? f.map(({ p, e }) => (e === 1 ? String(p) : p + sup(e))).join(' · ') : '1');
  const producto = pares => pares.reduce((s, [p, e]) => s * pot(BigInt(p), e), 1n);
  function menorMultiplicador(N, n) {
    n = indice(n);
    const X = natural(N, 'N', 1), f = factores(X);
    const m = producto(f.map(({ p, e }) => [p, (n - e % n) % n]));
    const R = X * m;
    const otro = n === 2 ? 3 : 2;
    const mOtro = producto(f.map(({ p, e }) => [p, (otro - e % otro) % otro]));
    return { N: num(X), n, factores: f, texto: textoFactores(f), m: num(m), resultado: num(R), raiz: num(iraiz(R, n)),
      despues: textoFactores(factores(R)),
      errores: limpiar({
        loHaceCuadrado: n === 3 ? quizas(mOtro) : undefined,                                  // completa para un cuadrado, no para un cubo
        loHaceCubo: n === 2 ? quizas(mOtro) : undefined,                                      // completa para un cubo, no para un cuadrado
        copiaExponente: quizas(producto(f.filter(({ e }) => e % n).map(({ p, e }) => [p, e % n]))), // multiplica por lo que sobra en vez de lo que falta
        todosLosPrimos: quizas(producto(f.map(({ p }) => [p, 1]))),                            // multiplica por todos los primos una vez
      }, num(m)) };
  }
  function menorDivisor(N, n) {
    n = indice(n);
    const X = natural(N, 'N', 1), f = factores(X);
    const d = producto(f.map(({ p, e }) => [p, e % n]));
    const R = X / d;
    return { N: num(X), n, factores: f, texto: textoFactores(f), d: num(d), resultado: num(R), raiz: num(iraiz(R, n)),
      despues: textoFactores(factores(R)),
      errores: limpiar({
        olvidaExponenteMayor: num(producto(f.filter(({ e }) => e % n && e < n).map(({ p, e }) => [p, e % n]))), // solo arregla los primos sueltos (exponente menor que n)
        quitaFactorEntero: num(producto(f.filter(({ e }) => e % n).map(({ p, e }) => [p, e]))), // quita entero el factor con exponente malo: sale potencia, pero no con el menor
        todosLosPrimos: num(producto(f.map(({ p }) => [p, 1]))),                              // divide entre todos los primos una vez
      }, num(d)) };
  }

  // ---------- conteo ----------
  const techoRaiz = X => { const k = iraiz(X, 2); return k * k === X ? k : k + 1n; };
  function cuadradosEntre(a, b) {
    const A = natural(a, 'a'), B = natural(b, 'b');
    if (B < A) throw new Error('b debe ser mayor o igual que a');
    const desde = techoRaiz(A), hasta = iraiz(B, 2);
    const cantidad = hasta >= desde ? hasta - desde + 1n : 0n;
    const lista = cantidad <= 60n ? Array.from({ length: Number(cantidad) }, (_, i) => num((desde + BigInt(i)) ** 2n)) : null;
    return { a: num(A), b: num(B), desde: num(desde), hasta: num(hasta), cantidad: num(cantidad), lista,
      errores: limpiar({
        sinMasUno: cantidad > 0n ? num(cantidad - 1n) : undefined,      // resta las raíces y no suma 1
        desdeUno: num(hasta),                                           // cuenta todos los cuadrados desde 1
        raizDiferencia: num(iraiz(B - A, 2)),                           // saca la raíz de b − a
        restaRaicesPiso: num(hasta - iraiz(A, 2)),                       // resta las raíces por defecto
      }, num(cantidad)) };
  }
  function cuadradosDeCifras(c) {
    entero(c, 'c', 1, 30);
    const R = cuadradosEntre(10n ** BigInt(c - 1), 10n ** BigInt(c) - 1n);
    return Object.assign(R, { c });
  }
  function cifrasRaiz(c) {
    entero(c, 'c', 1, 30);
    const menor = iraiz(10n ** BigInt(c - 1), 2), mayor = iraiz(10n ** BigInt(c) - 1n, 2);
    const cifras = String(menor).length;
    if (String(mayor).length !== cifras) throw new Error('la cantidad de cifras debería no depender del número');
    return { c, cifras, menor: num(menor), mayor: num(mayor), grupos: Math.ceil(c / 2),
      menorCuadrado: exacto(menor * menor), mayorCuadrado: exacto(mayor * mayor), siguienteCuadrado: exacto((mayor + 1n) * (mayor + 1n)),
      errores: limpiar({ mitadAbajo: Math.floor(c / 2) || undefined, misma: c, depende: 'depende' }, cifras) };
  }

  // ---------- «¿qué pasa si…?» ----------
  function sumaImpares(n) {
    const K = natural(n, 'n', 1), u = 2n * K - 1n;
    return { n: num(K), ultimo: num(u), suma: num(K * K),
      errores: limpiar({ gaussUltimo: num(u * (u + 1n) / 2n), cuadradoUltimo: num(u * u), sumaPares: num(K * (K + 1n)) }, num(K * K)) };
  }
  function terminaEn5(x) {
    const X = natural(x, 'x', 5);
    if (X % 10n !== 5n) throw new Error('x debe terminar en 5');
    const a = X / 10n, p = a * (a + 1n), c = X * X;
    if (p * 100n + 25n !== c) throw new Error('no cuadra');
    return { x: num(X), a: num(a), producto: num(p), cuadrado: num(c), texto: `${p}|25`,
      piezas: { ancho: num(10n * a), alto: num(10n * (a + 1n)), rect: num(100n * p), esquina: 25 },
      errores: limpiar({
        sumaCuadrados: num(100n * a * a + 25n),                          // (a + b)² = a² + b²: 60² + 5²
        porElAnterior: num(a * (a - 1n) * 100n + 25n),                   // multiplica la decena por la anterior
        porDos: num(2n * X),                                             // eleva al cuadrado como si fuera por 2
      }, num(c)) };
  }
  function restosCuadrados(m) {
    entero(m, 'm', 2, 1000);
    const s = new Set(); for (let k = 0; k < m; k++) s.add((k * k) % m);
    const restos = [...s].sort((a, b) => a - b), todos = Array.from({ length: m }, (_, i) => i);
    return { m, restos, nunca: todos.filter(x => !s.has(x)),
      errores: limpiar({ todos, soloPares: todos.filter(x => x % 2 === 0), soloCero: [0] }, restos) };
  }

  // k² y su resto entre m, para k de 1 a hasta.
  function tablaRestos(m, hasta) {
    entero(m, 'm', 2, 1000); entero(hasta, 'hasta', 1, 100);
    return Array.from({ length: hasta }, (_, i) => ({ k: i + 1, cuadrado: (i + 1) * (i + 1), resto: ((i + 1) * (i + 1)) % m }));
  }

  // ---------- posiciones para los dibujos ----------
  // N fichas en filas de 'ancho' (un acomodo neutro, para antes de responder).
  function layoutFilas(N, ancho) {
    const X = entero(N, 'N', 0, 2000), A = entero(ancho, 'ancho', 1, 200), f = [];
    for (let i = 0; i < X; i++) f.push({ x: i % A, y: Math.floor(i / A), tipo: 'ficha' });
    return { N: X, fichas: f, ancho: Math.min(A, Math.max(X, 1)), alto: Math.max(1, Math.ceil(X / A)) };
  }
  // Los factores primos como fichas: grupos de n iguales (forman la potencia) y los que quedan sueltos o faltan.
  function fichasFactores(N, n) {
    n = indice(n);
    const f = factores(N), grupos = [], sueltos = [], faltan = [];
    f.forEach(({ p, e }) => {
      for (let j = 0; j < Math.floor(e / n); j++) grupos.push(Array(n).fill(p));
      const q = e % n;
      if (q) { for (let j = 0; j < q; j++) sueltos.push(p); for (let j = 0; j < n - q; j++) faltan.push(p); }
    });
    const lista = []; f.forEach(({ p, e }) => { for (let j = 0; j < e; j++) lista.push(p); });
    return { N: num(natural(N)), n, lista, grupos, sueltos, faltan,
      raizDeLosGrupos: grupos.reduce((s, g) => s * g[0], 1) };
  }
  // Celdas en unidades de ficha: x hacia la derecha, y hacia abajo; tipo 'cuadrado', 'sobra' o 'falta'.
  function layoutCuadrado(N, k, modo) {
    const X = num(natural(N)); if (X > 2000) throw new Error('N es demasiado grande para dibujarlo (hasta 2000)');
    const R = raizEntera(X);
    const K = k === undefined ? R.k : entero(k, 'k', 0, 60);
    modo = modo || 'aparte';
    const fichas = [], huecos = [];
    const lleno = Math.min(X, K * K);
    for (let i = 0; i < K * K; i++) (i < lleno ? fichas : huecos).push({ x: i % K, y: Math.floor(i / K), tipo: i < lleno ? 'cuadrado' : 'falta' });
    const sobran = X - lleno;
    if (sobran) {
      if (modo === 'L') {
        if (sobran > 2 * K + 1) throw new Error('las que sobran no caben en una sola L');
        const L = layoutL(K).celdas;
        for (let i = 0; i < sobran; i++) fichas.push({ x: L[i].x, y: L[i].y, tipo: 'sobra' });
      } else {
        const h = Math.max(K, Math.ceil(Math.sqrt(X)), 1);
        for (let i = 0; i < sobran; i++) fichas.push({ x: K + (K ? 1 : 0) + Math.floor(i / h), y: i % h, tipo: 'sobra' });
      }
    }
    const xs = fichas.concat(huecos).map(c => c.x + 1), ys = fichas.concat(huecos).map(c => c.y + 1);
    return { N: X, k: K, usadas: lleno, sobran, faltan: K * K - lleno, fichas, huecos,
      ancho: Math.max(K, ...xs, 1), alto: Math.max(K, ...ys, 1), exacto: X === K * K };
  }
  // La L de k² a (k+1)²: la columna de la derecha (k fichas) y la fila de abajo (k + 1, con la esquina al final).
  function layoutL(k) {
    const K = entero(k, 'k', 0, 200), celdas = [];
    for (let y = 0; y < K; y++) celdas.push({ x: K, y, parte: 'lado' });
    for (let x = 0; x < K; x++) celdas.push({ x, y: K, parte: 'otroLado' });
    celdas.push({ x: K, y: K, parte: 'esquina' });
    return { k: K, celdas, cantidad: celdas.length };
  }
  // Las mismas n² fichas: en filas de 1, 3, 5… (a la izquierda) o dobladas en L (la fila j es la L j).
  function filasImpares(n) {
    const K = entero(n, 'n', 1, 40), f = [];
    for (let j = 0; j < K; j++) for (let i = 0; i < 2 * j + 1; i++) f.push({ x: i, y: j, capa: j });
    return { n: K, fichas: f, ancho: 2 * K - 1, alto: K };
  }
  function capasL(n) {
    const K = entero(n, 'n', 1, 40), f = [];
    for (let j = 0; j < K; j++) { const L = j === 0 ? [{ x: 0, y: 0 }] : layoutL(j).celdas; L.forEach(c => f.push({ x: c.x, y: c.y, capa: j })); }
    return { n: K, fichas: f, ancho: K, alto: K };
  }
  // Cubitos (x, y, z), con z hacia arriba, ordenados de atrás hacia adelante para pintarlos en la vista isométrica.
  const ordenar = cs => cs.sort((p, q) => (p.x + p.y + p.z) - (q.x + q.y + q.z) || p.z - q.z || p.x - q.x);
  function cuboIso(a, b, c) {
    entero(a, 'a', 1, 30); entero(b, 'b', 1, 30); entero(c, 'c', 1, 30);
    const cs = [];
    for (let z = 0; z < c; z++) for (let y = 0; y < b; y++) for (let x = 0; x < a; x++) cs.push({ x, y, z });
    return cs;
  }
  // De k³ a (k+1)³: el cubo viejo, tres caras de k·k, tres aristas de k y la esquina.
  // separados: la misma cáscara apartada del cubo viejo (cada pieza se corre «sep» hacia afuera), para que se vea entera.
  function crecerCubo(k, sep) {
    const K = entero(k, 'k', 1, 20), cs = [];
    sep = sep === undefined ? 1.5 : sep;
    for (let z = 0; z <= K; z++) for (let y = 0; y <= K; y++) for (let x = 0; x <= K; x++) {
      const fuera = (x === K) + (y === K) + (z === K);
      cs.push({ x, y, z, parte: fuera === 0 ? 'viejo' : fuera === 1 ? 'cara' : fuera === 2 ? 'arista' : 'esquina' });
    }
    const cuenta = p => cs.filter(c => c.parte === p).length;
    ordenar(cs);
    const separados = cs.map(c => Object.assign({}, c, { x: c.x + (c.x === K ? sep : 0), y: c.y + (c.y === K ? sep : 0), z: c.z + (c.z === K ? sep : 0) }));
    return { k: K, cubitos: cs, separados, viejo: cuenta('viejo'), caras: cuenta('cara'), aristas: cuenta('arista'), esquina: cuenta('esquina'),
      agrega: cs.length - cuenta('viejo') };
  }
  // N cubitos de un bloque a × b × c a otro: el i-ésimo cubito va al i-ésimo lugar del bloque nuevo.
  function reacomodar(N, de, a) {
    const X = entero(N, 'N', 1, 3000);
    const A = cuboIso(...de), B = cuboIso(...a);
    if (A.length !== X || B.length !== X) throw new Error('los bloques no tienen N cubitos');
    return { N: X, desde: A, hasta: B };
  }
  function interpolar(A, B, t) {
    if (!Array.isArray(A) || !Array.isArray(B) || A.length !== B.length) throw new Error('A y B deben tener las mismas fichas');
    t = Math.max(0, Math.min(1, t));
    return A.map((p, i) => { const q = B[i], o = Object.assign({}, q); for (const c of ['x', 'y', 'z']) if (c in p) o[c] = p[c] + (q[c] - p[c]) * t; return o; });
  }

  return { raizEntera, esCuadrado, esCubo, agregarParaSiguiente, terminaciones, criterios, puedeSerCuadrado, factores,
    menorMultiplicador, menorDivisor, cuadradosEntre, cuadradosDeCifras, cifrasRaiz, sumaImpares, terminaEn5, restosCuadrados, tablaRestos,
    layoutCuadrado, layoutFilas, fichasFactores, layoutL, filasImpares, capasL, cuboIso, crecerCubo, reacomodar, interpolar, ordenar, iraiz, miles, sup, textoFactores };
});
