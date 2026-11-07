/*
 * Motor de «Las fichas que se agrupan»: sistemas de numeración.
 *
 * Aquí vive toda la matemática de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el
 * navegador (window.MotorNumeracion) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 * Todo es aritmética entera exacta: por dentro se cuenta con BigInt y se devuelven números de JavaScript solo si
 * caben exactos (hasta 2⁵³ − 1); si no, el motor avisa con un error en vez de redondear.
 *
 * Un numeral se da como texto ('213', o con letras desde la cifra 10: '1A' en base 16) o como lista de cifras
 * ([2, 1, 3]), siempre de la cifra de mayor orden a la de las unidades. Las bases van de 2 a 36.
 * El orden k es la posición contada desde la derecha empezando en 0: unidades (k = 0), grupos de b (k = 1),
 * de b² (k = 2), de b³ (k = 3)… Las «cuentas» son la cantidad de piezas de cada orden, de las unidades hacia arriba.
 *
 * Fichas que se agrupan (las etapas de la animación salen de aquí; la escena solo las dibuja)
 *   agrupar(N, b)                  N fichas sueltas en grupos de b, de b², …: las etapas son las divisiones sucesivas
 *   normalizar(cuentas, b)         lo mismo desde unas cuentas cualesquiera (p. ej. tras agregar una ficha)
 *   desagrupar(numeral, b)         abrir los grupos de arriba hacia abajo hasta tener solo sueltas (método de Horner)
 *   reagrupar(N, b1, b2)           cambiar de base: se desarma en b1 y se arma en b2; las fichas no cambian
 *   cuadro(plan, t)                el cuadro t de un plan ({ inicio, etapas }), t de 0 a etapas.length: cuántos grupos
 *                                  de la etapa en curso ya se formaron (o se abrieron); conserva las fichas
 * Cambio de base
 *   aBase(N, b)                    divisiones sucesivas: cifras, texto, divisiones, y los errores al leer los restos
 *   aDecimal(numeral, b)           descomposición polinómica: términos a·bᵏ, valor, Horner, y los errores típicos
 *   valor(numeral, b)              solo el valor en base 10
 *   cambiarBase(numeral, b1, b2)   de b1 a b2 pasando por base 10
 *   agruparCifras(numeral, b, k)   de base b a base bᵏ juntando de a k cifras desde la derecha, y los errores
 * Numerales bien escritos y comparación
 *   valido(numeral, b)             ¿existe en base b? las cifras que no caben (las que valen b o más)
 *   validos(lista, b)              cuántos de la lista existen, y cuántos contaría cada idea errónea
 *   baseMinima(numeral)            la menor base en la que existe el numeral (cifra mayor + 1)
 *   comparar(A, bA, B, bB)         'A', 'B' o 'iguales', y lo que diría cada idea errónea
 *   baseDesconocida(numeral, v)    la base b en la que el numeral vale v (búsqueda exacta), y los errores al despejar
 *   leerEnBases(numeral, bases)    el mismo numeral leído en varias bases: valores, diferencias, ¿cuadrados?
 * Operaciones que mueven las cifras
 *   sumarUno(numeral, b)           agregar una ficha: las llevadas en cadena, y los errores al llevar
 *   porLaBase(numeral, b)          multiplicar por la base corre las cifras (agrega un 0), y los errores
 * Conteo
 *   numerales(k, b)                los numerales de k cifras en base b: cuántos, el menor (bᵏ⁻¹) y el mayor (bᵏ − 1)
 *   capicuas(k, b)                 capicúas de k cifras en base b: (b − 1)·b^(⌈k/2⌉ − 1), y los errores al contar
 *   cifrasPaginas(N)               cifras para numerar de 1 a N (base 10, por tramos), y los errores
 *   paginasConCifras(C)            al revés: cuántas páginas se numeran con exactamente C cifras
 *
 * Los campos «errores» dicen lo que da cada error típico. Un error que en un caso daría la respuesta correcta
 * (o lo mismo que otro error anterior) no aparece: así la escena nunca tiene dos opciones iguales.
 * Ningún error de esta plantilla tiene un estudio con datos: todos son hipótesis nuestras.
 */
(function (root, fabrica) {
  const api = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.MotorNumeracion = api;
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
  // Para los errores: si el valor no cabe exacto, ese error no se ofrece (no se redondea).
  const quizas = B => (B > SEGURO || B < -SEGURO ? undefined : Number(B));
  function natural(x, que) { const B = aBig(x, que); if (B < 0n) throw new Error(`${que || 'N'} debe ser mayor o igual que 0`); return B; }
  function base(b, que) {
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
  // Cifras de un numeral (texto o lista), de la de mayor orden a las unidades. No mira la base.
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
  const texto = cifras => cifras.map(d => SIMBOLOS[d]).join('');
  const pot = (b, k) => BigInt(b) ** BigInt(k);
  const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const SUB = { 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉' };
  const sup = e => String(e).split('').map(c => SUP[c]).join('');
  const sub = e => '₍' + String(e).split('').map(c => SUB[c]).join('') + '₎';   // como en las academias: 213₍₅₎
  // El numeral con su base en subíndice: 213₍₅₎.
  const conBase = (numeral, b) => texto(leer(numeral)) + sub(b);

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
  function malas(c, b) { return c.map((d, i) => ({ posicion: i, orden: c.length - 1 - i, cifra: d })).filter(x => x.cifra >= b); }
  function exigirValido(c, b) {
    const m = malas(c, b);
    if (m.length) throw new Error(`la cifra ${SIMBOLOS[m[0].cifra]} no existe en base ${b}: las cifras van de 0 a ${b - 1}`);
  }
  const valorBig = (c, b) => c.reduce((s, d) => s * BigInt(b) + BigInt(d), 0n);
  // Los dígitos tal cual, leídos como un número de base 10 (solo si todas las cifras son de 0 a 9).
  const comoDecimal = c => (c.every(d => d <= 9) ? quizas(BigInt(c.join(''))) : undefined);

  // ---------- fichas que se agrupan ----------
  // Las etapas: en la etapa j, las cuentas[j] piezas de orden j se juntan de b en b; cada grupo sube al orden j + 1.
  function normalizar(cuentas, b) {
    base(b);
    if (!Array.isArray(cuentas) || !cuentas.length) throw new Error('cuentas debe ser una lista con la cantidad de piezas de cada orden');
    let c = cuentas.map((x, i) => natural(x, `cuentas[${i}]`));
    const inicio = c.map(x => num(x)), etapas = [];
    for (let j = 0; j < c.length; j++) {
      if (c[j] < BigInt(b)) continue;
      const grupos = c[j] / BigInt(b), quedan = c[j] % BigInt(b);
      const antes = c.map(x => num(x));
      c[j] = quedan;
      if (j + 1 === c.length) c.push(0n);
      c[j + 1] += grupos;
      etapas.push({ tipo: 'juntar', orden: j, grupos: num(grupos), quedan: num(quedan), antes, despues: c.map(x => num(x)) });
    }
    while (c.length > 1 && c[c.length - 1] === 0n) c.pop();
    const cifras = c.map(x => num(x)).reverse();
    const fichas = c.reduce((s, x, k) => s + x * pot(b, k), 0n);
    return { b, inicio, etapas, cuentas: c.map(x => num(x)), cifras, texto: texto(cifras), fichas: num(fichas) };
  }
  function agrupar(N, b) {
    const n = natural(N); base(b);
    const R = normalizar([n], b);
    return Object.assign(R, { N: num(n),
      ordenes: R.cuentas.map((x, k) => ({ orden: k, tamano: num(pot(b, k)), cifra: x })) });
  }
  // Abrir los grupos: en cada etapa, las piezas del orden más alto que queda se abren en b piezas del orden de abajo.
  function desagrupar(numeral, b) {
    base(b);
    const c = leer(numeral); exigirValido(c, b);
    const cu = c.slice().reverse().map(BigInt), inicio = cu.map(x => num(x)), etapas = [];
    for (let j = cu.length - 1; j >= 1; j--) {
      const antes = cu.map(x => num(x)), abiertos = cu[j];
      cu[j - 1] += abiertos * BigInt(b); cu[j] = 0n;
      etapas.push({ tipo: 'abrir', orden: j, grupos: num(abiertos), antes, despues: cu.map(x => num(x)) });
    }
    // Horner: lo que hay en el orden j − 1 después de abrir es el valor parcial ((a·b + c)·b + …)
    const horner = etapas.map(e => e.despues[e.orden - 1]);
    return { b, numeral: texto(c), inicio, etapas, horner, sueltas: num(cu[0]), cuentas: [num(cu[0])] };
  }
  function reagrupar(N, b1, b2) {
    const n = natural(N); base(b1, 'b1'); base(b2, 'b2');
    const antes = agrupar(n, b1), despues = agrupar(n, b2);
    return { N: num(n), b1, b2, desde: antes.texto, hasta: despues.texto,
      desarmar: desagrupar(antes.texto, b1), armar: despues, fichas: despues.fichas };
  }
  // Un cuadro de la animación: t entero = al final de la etapa t; con decimales, a mitad de la etapa en curso.
  function cuadro(plan, t) {
    if (!plan || !Array.isArray(plan.etapas) || !Array.isArray(plan.inicio)) throw new Error('plan debe tener inicio y etapas');
    const E = plan.etapas.length;
    if (typeof t !== 'number' || !Number.isFinite(t)) throw new Error('t debe ser un número');
    t = Math.max(0, Math.min(E, t));
    if (!E) return { cuentas: plan.inicio.slice(), etapa: 0, hechos: 0, total: 0, fin: true };
    const k = Math.min(E - 1, Math.floor(t)), f = t - k, e = plan.etapas[k];
    if (t >= E) return { cuentas: e.despues.slice(), etapa: E - 1, hechos: e.grupos, total: e.grupos, fin: true };
    const g = Math.min(e.grupos, Math.floor(f * e.grupos + 1e-9)), c = e.antes.slice();
    const b = plan.b;
    while (c.length <= e.orden + 1) c.push(0);
    if (e.tipo === 'juntar') { c[e.orden] -= g * b; c[e.orden + 1] += g; }
    else { c[e.orden] -= g; c[e.orden - 1] += g * b; }
    return { cuentas: c, etapa: k, hechos: g, total: e.grupos, fin: false };
  }

  // ---------- cambio de base ----------
  function aBase(N, b) {
    const n = natural(N); base(b);
    const divisiones = []; let x = n;
    do { const q = x / BigInt(b), r = x % BigInt(b); divisiones.push({ dividendo: num(x), cociente: num(q), resto: num(r) }); x = q; } while (x > 0n);
    const restos = divisiones.map(d => d.resto), cifras = restos.slice().reverse(), t = texto(cifras);
    const d0 = divisiones[0];
    return { N: num(n), b, cifras, texto: t, conBase: t + sub(b), divisiones, restos, cantidadCifras: cifras.length,
      errores: limpiar({
        restosAlReves: texto(restos),                                        // escribe los restos en el orden en que salen
        omiteCeros: t.includes('0') && t.replace(/0/g, '') ? t.replace(/0/g, '') : undefined, // se salta los órdenes vacíos
        olvidaUltimoCociente: divisiones.length > 1 ? (texto(restos.slice(0, -1).reverse()).replace(/^0+/, '') || '0') : undefined, // solo los restos, sin el último cociente
        primeraDivision: divisiones.length > 1 ? String(d0.cociente) + SIMBOLOS[d0.resto] : undefined, // se queda con la primera división: cociente y resto
        sinCambiar: String(num(n)),                                          // deja el número como estaba
      }, t) };
  }
  function aDecimal(numeral, b) {
    base(b);
    const c = leer(numeral); exigirValido(c, b);
    const L = c.length, v = valorBig(c, b);
    const terminos = c.map((d, i) => { const k = L - 1 - i; return { cifra: d, orden: k, potencia: num(pot(b, k)), producto: num(BigInt(d) * pot(b, k)) }; });
    const parcial = []; c.reduce((s, d) => { const y = s * BigInt(b) + BigInt(d); parcial.push(num(y)); return y; }, 0n);
    const textoT = terminos.map(t => (t.orden === 0 ? String(t.cifra) : t.orden === 1 ? `${t.cifra}·${b}` : `${t.cifra}·${b}${sup(t.orden)}`)).join(' + ');
    const suma = c.reduce((s, d) => s + d, 0);
    return { numeral: texto(c), b, conBase: texto(c) + sub(b), cifras: c, terminos, texto: textoT, valor: num(v), horner: parcial,
      errores: limpiar({
        potenciasCorridas: quizas(c.reduce((s, d, i) => s + BigInt(d) * pot(b, L - i), 0n)),  // cuenta los exponentes desde 1: a·b³ + c·b² + d·b
        sumaCifrasPorBase: suma * b,                                         // suma las cifras y multiplica por la base
        comoDecimal: comoDecimal(c),                                         // lo lee como si fuera de base 10
      }, num(v)) };
  }
  function valor(numeral, b) { return aDecimal(numeral, b).valor; }
  function cambiarBase(numeral, b1, b2) {
    base(b1, 'b1'); base(b2, 'b2');
    const D = aDecimal(numeral, b1), R = aBase(D.valor, b2);
    return { desde: D.conBase, valor: D.valor, texto: R.texto, conBase: R.conBase, cifras: R.cifras, divisiones: R.divisiones };
  }
  // De base b a base bᵏ: cada grupo de k cifras de base b, contado desde la derecha, es una cifra de base bᵏ.
  function agruparCifras(numeral, b, k) {
    base(b); entero(k, 'k', 2, 6);
    const c = leer(numeral); exigirValido(c, b);
    const B = Math.pow(b, k);
    if (B > 36) throw new Error('la base nueva pasa de 36');
    const porGrupos = (cs, kk, desdeDerecha) => {
      const g = [];
      if (desdeDerecha) { for (let j = cs.length; j > 0; j -= kk) g.unshift(cs.slice(Math.max(0, j - kk), j)); }
      else for (let j = 0; j < cs.length; j += kk) g.push(cs.slice(j, j + kk));
      return g;
    };
    const val = g => g.reduce((s, d) => s * b + d, 0);
    const grupos = porGrupos(c, k, true), cifras = grupos.map(val), t = texto(cifras);
    const izq = porGrupos(c, k, false).map(val);
    const otro = k > 2 ? k - 1 : k + 1, gOtro = porGrupos(c, otro, true).map(val);
    const sumas = grupos.map(g => g.reduce((s, d) => s + d, 0));
    return { numeral: texto(c), b, k, base: B, grupos: grupos.map(g => texto(g)), cifras, texto: t, conBase: t + sub(B),
      valor: num(valorBig(c, b)),
      errores: limpiar({
        desdeLaIzquierda: texto(izq),                                        // junta las cifras desde la izquierda
        sumaCifrasGrupo: sumas.every(s => s < 36) ? texto(sumas) : undefined, // suma las cifras de cada grupo en vez de leerlas en base b
        otroTamano: gOtro.every(x => x < 36) ? texto(gOtro) : undefined,     // junta de a k − 1 (o k + 1) cifras
      }, t) };
  }

  // ---------- numerales bien escritos y comparación ----------
  function valido(numeral, b) {
    base(b);
    const c = leer(numeral), m = malas(c, b);
    return { numeral: texto(c), b, valido: !m.length, malas: m, maxima: b - 1, ceroInicial: c.length > 1 && c[0] === 0 };
  }
  function validos(lista, b) {
    base(b);
    if (!Array.isArray(lista) || !lista.length) throw new Error('lista debe tener numerales');
    const cs = lista.map(leer), cuenta = f => cs.filter(f).length;
    const ok = cs.filter(c => c.every(d => d < b));
    const cantidad = ok.length;
    return { b, lista: cs.map(texto), validos: ok.map(texto), invalidos: cs.filter(c => !c.every(d => d < b)).map(texto), cantidad,
      errores: limpiar({
        cifraIgualALaBase: cuenta(c => c.every(d => d <= b)),                // cree que la cifra b también se puede usar
        cualquierCifra: cuenta(c => c.every(d => d <= 9)),                   // cree que sirven todas las cifras del 0 al 9
        deUnoALaBase: cuenta(c => c.every(d => d >= 1 && d <= b)),           // cuenta del 1 a la base, como con los dedos
      }, cantidad) };
  }
  function baseMinima(numeral) {
    const c = leer(numeral), mx = Math.max(...c);
    return { numeral: texto(c), base: Math.max(2, mx + 1), cifraMayor: mx };
  }
  function comparar(A, bA, B, bB) {
    base(bA, 'bA'); base(bB, 'bB');
    const a = aDecimal(A, bA), c = aDecimal(B, bB);
    const cmp = (x, y) => (x > y ? 'A' : x < y ? 'B' : 'iguales');
    const mayor = cmp(a.valor, c.valor);
    const da = comoDecimal(a.cifras), dc = comoDecimal(c.cifras);
    return { A: a.conBase, B: c.conBase, valorA: a.valor, valorB: c.valor, mayor, diferencia: Math.abs(a.valor - c.valor),
      errores: limpiar({
        comparaCifras: da !== undefined && dc !== undefined ? cmp(da, dc) : undefined, // compara las cifras como si fueran de base 10
        baseMayor: bA === bB ? undefined : bA > bB ? 'A' : 'B',               // cree que la base mayor siempre da más
        noSeComparan: 'no-se-puede',                                         // cree que en bases distintas no se puede comparar
      }, mayor) };
  }
  // La base b en que el numeral vale v. El valor crece con b, así que basta probar desde la base mínima.
  function baseDesconocida(numeral, v) {
    const c = leer(numeral), V = natural(v, 'v');
    if (c.length < 2) throw new Error('con una sola cifra el valor no depende de la base');
    const bmin = baseMinima(c).base;
    const pruebas = []; let encontrada = null;
    for (let b = bmin; b <= 36; b++) {
      const x = valorBig(c, b);
      pruebas.push({ b, valor: num(x) });
      if (x === V) { encontrada = b; break; }
      if (x > V) break;
    }
    const n = num(V), L = c.length, d0 = c[L - 1], d1 = c[L - 2];
    const terminos = c.map((d, i) => { const k = L - 1 - i; return k === 0 ? String(d) : k === 1 ? `${d}·b` : `${d}·b${sup(k)}`; }).join(' + ');
    return { numeral: texto(c), v: n, existe: encontrada !== null, base: encontrada, baseMinima: bmin, pruebas, ecuacion: `${terminos} = ${n}`,
      errores: encontrada === null ? {} : limpiar({
        sinDividir: L === 2 && n - d0 >= 2 ? n - d0 : undefined,               // resta las unidades y no divide entre la cifra
        baseMinima: bmin,                                                      // da la base mínima (cifra mayor + 1)
        restaNumerales: comoDecimal(c) !== undefined && Math.abs(comoDecimal(c) - n) >= 2 ? Math.abs(comoDecimal(c) - n) : undefined, // resta el numeral y el valor
        sumaUnidades: L === 2 && d1 > 0 && (n + d0) % d1 === 0 ? (n + d0) / d1 : undefined, // suma las unidades en vez de restarlas
      }, encontrada) };
  }
  function leerEnBases(numeral, bases) {
    const c = leer(numeral);
    if (!Array.isArray(bases) || !bases.length) throw new Error('bases debe ser una lista');
    const valores = bases.map(b => aDecimal(c, base(b)).valor);
    const diferencias = valores.slice(1).map((x, i) => x - valores[i]);
    const esCuadrado = x => { const r = Math.round(Math.sqrt(x)); return r * r === x; };
    const n0 = comoDecimal(c);
    return { numeral: texto(c), bases: bases.slice(), valores, diferencias, cuadrados: valores.every(esCuadrado),
      raices: valores.map(x => (esCuadrado(x) ? Math.round(Math.sqrt(x)) : null)),
      errores: limpiar({
        siempreIgual: n0 === undefined ? undefined : valores.map(() => n0),   // cree que el valor no depende de la base
        deUnoEnUno: valores.map((x, i) => valores[0] + (bases[i] - bases[0])), // crece lo mismo que la base
        seDuplica: valores.map((x, i) => valores[0] * Math.pow(2, i)),         // se duplica con cada base
      }, valores) };
  }

  // ---------- operaciones que mueven las cifras ----------
  function sumarUno(numeral, b) {
    base(b);
    const c = leer(numeral); exigirValido(c, b);
    const cu = c.slice().reverse(); cu[0] += 1;
    const N = normalizar(cu, b), t = N.texto;
    const ult = c.slice(); ult[ult.length - 1] += 1;                          // la última cifra sube y nada más
    const olvida = c.slice(); if (c[c.length - 1] === b - 1) olvida[olvida.length - 1] = 0; // pone 0 pero no lleva
    const una = c.slice();                                                    // lleva una sola vez
    if (c[c.length - 1] === b - 1 && c.length > 1) { una[una.length - 1] = 0; una[una.length - 2] += 1; }
    return { numeral: texto(c), b, texto: t, conBase: t + sub(b), cifras: N.cifras, valor: num(valorBig(N.cifras, b)), llevadas: N.etapas.length,
      plan: N, cifrasNuevas: N.cifras.length - c.length,
      errores: limpiar({
        sinLlevar: ult.every(d => d < 36) ? texto(ult) : undefined,          // escribe la cifra b (no forma el grupo)
        unaLlevada: una.every(d => d < 36) ? texto(una) : undefined,         // lleva una vez y no sigue la cadena
        olvidaLlevar: texto(olvida),                                          // pone 0 en las unidades y no lleva
      }, t) };
  }
  function porLaBase(numeral, b) {
    base(b);
    const c = leer(numeral); exigirValido(c, b);
    const v = valorBig(c, b), nuevo = c.slice(); if (!(c.length === 1 && c[0] === 0)) nuevo.push(0);
    const t = texto(nuevo);
    const dec = comoDecimal(c);
    const masB = aBase(v + BigInt(b), b).texto;
    return { numeral: texto(c), b, texto: t, conBase: t + sub(b), valor: num(v * BigInt(b)), antes: num(v),
      cuentasAntes: c.slice().reverse(), cuentasDespues: nuevo.slice().reverse(),
      errores: limpiar({
        multiplicaComoDecimal: dec === undefined ? undefined : String(dec * b), // multiplica las cifras como en base 10
        sumaLaBase: masB,                                                      // suma la base en vez de multiplicar
        dosCeros: texto(c) + '00',                                             // agrega dos ceros, como si fuera por b²
      }, t) };
  }

  // ---------- conteo ----------
  function numerales(k, b) {
    entero(k, 'k', 1, 60); base(b);
    const menor = k === 1 ? 0n : pot(b, k - 1), mayor = pot(b, k) - 1n;
    const cantidad = k === 1 ? BigInt(b) : BigInt(b - 1) * pot(b, k - 1);
    const mayorCifras = Array(k).fill(b - 1);
    return { k, b, cantidad: num(cantidad), menor: num(menor), mayor: num(mayor), menorTexto: texto(k === 1 ? [0] : [1].concat(Array(k - 1).fill(0))),
      mayorTexto: texto(mayorCifras),
      errores: limpiar({                                                       // errores al dar el mayor
        sinRestarUno: quizas(pot(b, k)),                                          // bᵏ, que ya tiene k + 1 cifras
        comoDecimal: comoDecimal(mayorCifras),                                 // lee 444 como si fuera de base 10
      }, num(mayor)),
      erroresCantidad: k === 1 ? {} : limpiar({                                // errores al contar cuántos hay
        conCero: quizas(pot(b, k)),                                            // cuenta también los que empiezan con 0
        sinRestarMenor: num(mayor),                                            // cuenta hasta el mayor, como si empezaran en 1
      }, num(cantidad)) };
  }
  function capicuas(k, b) {
    entero(k, 'k', 2, 60); base(b);
    const libres = Math.ceil(k / 2);
    const cantidad = BigInt(b - 1) * pot(b, libres - 1);
    let lista = null;
    if (cantidad <= 400n) {
      lista = [];
      const total = Number(cantidad);
      for (let i = 0; i < total; i++) {
        let x = i; const mitad = [];
        for (let j = libres - 1; j >= 1; j--) { mitad.unshift(x % b); x = Math.floor(x / b); }
        mitad.unshift(1 + x);
        const espejo = mitad.slice(0, k - libres).reverse();
        lista.push(texto(mitad.concat(espejo)));
      }
    }
    return { k, b, libres, eleccion: [b - 1].concat(Array(libres - 1).fill(b)), cantidad: num(cantidad), lista,
      errores: limpiar({
        conCero: quizas(pot(b, libres)),                                       // deja que la primera cifra sea 0
        sinCeroAdentro: quizas(BigInt(b - 1) ** BigInt(libres)),               // tampoco deja el 0 en las cifras de adentro
        todos: quizas(BigInt(b - 1) * pot(b, k - 1)),                          // cuenta todos los numerales de k cifras
        potencia: quizas(pot(b, k)),                                           // bᵏ
      }, num(cantidad)) };
  }
  function cifrasPaginas(N) {
    const n = natural(N);
    if (n < 1n) throw new Error('N debe ser mayor o igual que 1');
    const k = n.toString().length, tramos = []; let total = 0n;
    for (let j = 1; j <= k; j++) {
      const desde = pot(10, j - 1), hasta = j === k ? n : pot(10, j) - 1n, cantidad = hasta - desde + 1n;
      tramos.push({ cifras: j, desde: num(desde), hasta: num(hasta), paginas: num(cantidad), subtotal: num(cantidad * BigInt(j)) });
      total += cantidad * BigInt(j);
    }
    const unos = (pot(10, k) - 1n) / 9n;                                       // 1, 11, 111, …
    const formula = (n + 1n) * BigInt(k) - unos;
    return { N: num(n), k, tramos, total: num(total), formula: num(formula), unos: num(unos),
      errores: limpiar({
        mismasCifras: quizas(n * BigInt(k)),                                      // todas las páginas con tantas cifras como N
        sinMasUno: k > 1 ? num(total - BigInt(k)) : undefined,                  // en el último tramo cuenta hasta − desde, sin + 1
        cuentaPaginas: num(n),                                                  // cuenta páginas, no cifras
      }, num(total)) };
  }
  function paginasConCifras(C) {
    let resto = natural(C, 'C'), paginas = 0n;
    if (resto < 1n) throw new Error('C debe ser mayor o igual que 1');
    for (let j = 1n; ; j++) {
      const enTramo = 9n * 10n ** (j - 1n);
      if (resto <= enTramo * j) {
        if (resto % j) return { C: num(BigInt(C)), existe: false, paginas: null };
        paginas += resto / j; break;
      }
      resto -= enTramo * j; paginas += enTramo;
    }
    return { C: num(BigInt(C)), existe: true, paginas: num(paginas) };
  }

  return { agrupar, normalizar, desagrupar, reagrupar, cuadro, aBase, aDecimal, valor, cambiarBase, agruparCifras,
    valido, validos, baseMinima, comparar, baseDesconocida, leerEnBases, sumarUno, porLaBase,
    numerales, capicuas, cifrasPaginas, paginasConCifras, leer, texto, conBase, sup, sub, SIMBOLOS };
});
