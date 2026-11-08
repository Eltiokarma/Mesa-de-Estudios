/*
 * Generador: inecuaciones y desigualdades en problemas (planteo, discriminante, intervalos,
 * desigualdad de medias, valor absoluto y programación lineal con enteros).
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['inecuaciones-planteo']) y en Node (require). No usa ningún motor.
 *
 * Tipos (entre paréntesis, la falta de las filas que cubre):
 *   entero-unico     ventas: dos ventas con fracciones de lo que tenía acotan la cantidad inicial;
 *                    dos-personas: lo que ganan dos personas, con una cota del total y una
 *                    comparación; se pide lo de la segunda (planteo verbal con desigualdades y
 *                    solución entera única)
 *   dos-enteros      unico: tres condiciones verbales entre dos cantidades enteras («no puede ser
 *                    menor que»…); se pide la suma o el producto; maximo: varias parejas posibles,
 *                    se pide el mayor valor de la suma o de una cantidad (sistemas de inecuaciones
 *                    con dos incógnitas enteras de planteo)
 *   cuadratica-entera  compra con precio que depende de la cantidad y dos cotas de gasto
 *                    (planteo verbal con desigualdades cuadráticas y solución entera)
 *   area             perimetro-comun: cuadrado y rectángulo con el mismo perímetro y una cota del
 *                    área; dos-rectangulos: la suma de dos áreas entre dos cotas, se pide un
 *                    perímetro (planteo geométrico que lleva a una inecuación cuadrática con área)
 *   discriminante    menor-entero: menor k entero para que ax² + bx + k > 0 para todo x;
 *                    contexto: altura entera de una malla que una pelota no toca; intervalo: los k
 *                    con kx² + bx + k de signo constante (condición del discriminante para que un
 *                    trinomio tenga signo constante)
 *   moviles          posiciones de dos ciclistas dadas por extremos de conjuntos solución; se pide
 *                    el tiempo de encuentro (extremos de conjuntos solución en un problema de móviles)
 *   racional         homografica: intervalo de (px + q)/(x + r) con x en un intervalo; cuadrado:
 *                    mayor valor de k/(x² + c) con x en un intervalo que contiene al 0 (acotar una
 *                    expresión racional a partir de un intervalo de la variable)
 *   medias           cerco mínimo de un terreno de área fija con cercos divisorios y, a veces, un
 *                    muro (desigualdad entre medias aritmética y geométrica para optimizar)
 *   valor-absoluto   |a| + |b| ≤ |a + b| con a y b lineales: conjunto solución (desigualdad
 *                    triangular del valor absoluto como condición)
 *   lineal-entera    ganancia: taller con dos recursos; sobrante: compra que cubre dos mínimos
 *                    con un presupuesto; el vértice no es entero (optimizar con variables enteras
 *                    dentro de la región factible)
 *
 * Convenciones: intervalos ⟨a; b], uniones con ∪, coma decimal y signo menos «−». Las respuestas
 * que son intervalos van con armarTexto y clave canónica «int:lo,lc,hi,hc|…» (lo y hi como n/d o
 * ±inf); las fracciones sueltas, con clave «num:n/d».
 * Errores: AL19-inecuacion-como-ecuacion (parcial, docs/investigacion/algebra-funciones-ideas-erroneas.md)
 * solo cuando el distractor es la raíz de la ecuación asociada; AL22 (parcial, mismo informe) en
 * valor absoluto; AR5-el-gasto (hipótesis, docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md).
 * El resto son hipótesis nuestras sin fuente: redondeo-de-la-cota, extremos y corchetes mal puestos,
 * no-menor-que-como-a-lo-mas, responde-* (otra cantidad, trampa 33) y los de las trampas 40, 51 y 53
 * de la clasificación de San Marcos.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'inecuaciones-planteo';
  const FAL = 'docs/investigacion/algebra-funciones-ideas-erroneas.md';
  const FAR = 'docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md';
  const v = P.v;
  const N = x => P.formatear(x, 2);
  const qt = P.textoFraccion;
  const qv = q => q.n / q.d;
  const fr = (n, d = 1) => P.frac(n, d);
  const piso = q => Math.floor(q.n / q.d);
  const techo = q => Math.ceil(q.n / q.d);

  // Errores con valor numérico y con texto.
  const err = (id, valor, explicacion, respaldo = 'hipotesis', fuente = null) => ({ id, valor, explicacion, respaldo, fuente });
  // AL19 (parcial) solo cuando el distractor es la raíz de la ecuación asociada: la inecuación
  // se resolvió como ecuación. Redondear la cota o mover un extremo es hipótesis nuestra.
  const al19 = (valor, explicacion) => err('AL19-inecuacion-como-ecuacion', valor, explicacion, 'parcial', FAL);
  const hip = (id, valor, explicacion) => err(id, valor, explicacion);
  const redondeo = (valor, explicacion) => err('redondeo-de-la-cota', valor, explicacion);
  // Responder otra cantidad (trampa 33 de la clasificación): hipótesis, sin fuente.
  const ar5 = (id, valor, explicacion) => err('responde-' + id, valor, explicacion);
  const conTexto = (e, r) => (r ? { id: e.id, clave: r.clave, texto: r.texto, explicacion: e.explicacion, respaldo: e.respaldo, fuente: e.fuente } : null);

  // Fracción como texto con su valor decimal: «61/2 = 30,5», «94/3 ≈ 31,33», «31».
  const soloDosCinco = d => { while (d % 2 === 0) d /= 2; while (d % 5 === 0) d /= 5; return d === 1; };
  function qDec(q) {
    q = fr(q);
    if (q.d === 1) return N(q.n);
    if (soloDosCinco(q.d) && q.d <= 100) return `${qt(q)} = ${P.formatear(qv(q), 4)}`;
    return `${qt(q)} ≈ ${N(qv(q))}`;
  }
  // Raíz con su valor: «√49 = 7» o «√20 ≈ 4,47».
  function raizTxt(n) {
    const r = Math.round(Math.sqrt(n));
    return r * r === n ? `√${n} = ${r}` : `√${n} ≈ ${N(Math.sqrt(n))}`;
  }
  const esCuadrado = n => n >= 0 && Math.round(Math.sqrt(n)) ** 2 === n;

  // Polinomios: pol([a2, a1, a0]) → «x² − 6x + 9»; pol([m, n]) → «2x − 6».
  function termino(c, lit, primero) {
    if (c === 0) return '';
    const a = Math.abs(c), t = lit ? (a === 1 ? '' : N(a)) + lit : N(a);
    return primero ? (c < 0 ? '−' : '') + t : (c < 0 ? ' − ' : ' + ') + t;
  }
  function pol(coefs, x = 'x') {
    const g = coefs.length - 1;
    let s = '';
    coefs.forEach((c, i) => { const k = g - i; s += termino(c, k === 0 ? '' : k === 1 ? x : x + '²', s === ''); });
    return s || '0';
  }
  // «(x − 3)», «(x + 2)», «x».
  const factor = (p, x = 'x') => (p === 0 ? x : p < 0 ? `(${x} + ${N(-p)})` : `(${x} − ${N(p)})`);
  const cuadradoTxt = b => (b < 0 ? `(${N(b)})²` : `${N(b)}²`);

  // Intervalos: piezas { lo, lc, hi, hc } con lo/hi fracciones o null (infinito).
  function intervalo(piezas) {
    const k = q => (q ? `${q.n}/${q.d}` : null);
    const clave = 'int:' + piezas.map(p => `${k(p.lo) || '-inf'},${p.lc ? 1 : 0},${k(p.hi) || 'inf'},${p.hc ? 1 : 0}`).join('|');
    let texto;
    if (piezas.length === 0) texto = '∅';
    else if (piezas.length === 1 && !piezas[0].lo && !piezas[0].hi) texto = 'ℝ';
    else texto = piezas.map(p => `${p.lo && p.lc ? '[' : '⟨'}${p.lo ? qt(p.lo) : '−∞'}; ${p.hi ? qt(p.hi) : '+∞'}${p.hi && p.hc ? ']' : '⟩'}`).join(' ∪ ');
    return { clave, texto };
  }
  const pz = (lo, lc, hi, hc) => ({ lo: lo === null ? null : fr(lo), lc: lo === null ? false : lc, hi: hi === null ? null : fr(hi), hc: hi === null ? false : hc });
  const numero = q => { const f = fr(q); return { clave: `num:${f.n}/${f.d}`, texto: qt(f) }; };

  // Elige preferentemente un número redondo de la lista (múltiplo de 10, luego de 5).
  function redondo(rng, lista) {
    for (const m of [10, 5]) { const l = lista.filter(x => x % m === 0); if (l.length) return rng.elegir(l); }
    return lista.length ? rng.elegir(lista) : null;
  }
  const corto = (x, dec = 2) => Number.isFinite(x) && Math.abs(x * 10 ** dec - Math.round(x * 10 ** dec)) < 1e-7;

  const TIPOS = ['entero-unico', 'dos-enteros', 'cuadratica-entera', 'area', 'discriminante', 'moviles', 'racional', 'medias', 'valor-absoluto', 'lineal-entera'];

  const SUBS = { 'entero-unico': ['ventas', 'dos-personas'], 'dos-enteros': ['unico', 'maximo'], 'cuadratica-entera': [null], area: ['perimetro-comun', 'dos-rectangulos'],
    discriminante: ['menor-entero', 'contexto', 'intervalo'], moviles: [null], racional: ['homografica', 'cuadrado'], medias: [null], 'valor-absoluto': [null], 'lineal-entera': ['ganancia', 'sobrante'] };

  function generar(semilla) {
    const rng = Azar.crear(ID + '|' + semilla);
    const tipo = rng.elegir(TIPOS), sub = rng.elegir(SUBS[tipo]);
    for (let intento = 0; intento < 20000; intento++) {
      const pr = construir(rng, semilla, tipo, sub);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error(`No se pudo generar un problema con 4 alternativas distintas (${tipo} ${sub})`);
  }

  function construir(rng, semilla, tipo, sub) {
    switch (sub || tipo) {
      case 'ventas': return ventas(rng, semilla);
      case 'dos-personas': return dosPersonas(rng, semilla);
      case 'unico': case 'maximo': return dosEnteros(rng, semilla, sub);
      case 'cuadratica-entera': return cuadraticaEntera(rng, semilla);
      case 'perimetro-comun': return perimetroComun(rng, semilla);
      case 'dos-rectangulos': return dosRectangulos(rng, semilla);
      case 'menor-entero': return menorEntero(rng, semilla);
      case 'contexto': return pelota(rng, semilla);
      case 'intervalo': return intervaloK(rng, semilla);
      case 'moviles': return moviles(rng, semilla);
      case 'homografica': return homografica(rng, semilla);
      case 'cuadrado': return cuadradoDen(rng, semilla);
      case 'medias': return medias(rng, semilla);
      case 'valor-absoluto': return valorAbsoluto(rng, semilla);
      case 'ganancia': return ganancia(rng, semilla);
      default: return sobrante(rng, semilla);
    }
  }

  function salida(semilla, o, alternativas, respuesta) {
    return { id: `${ID}#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion, respuesta, _datos: o.datos };
  }
  // Respuesta numérica: o.texto da la forma («S/ 54», «12 cm»); solo errores enteros o con 2 decimales.
  function cerrar(rng, semilla, o) {
    const errores = o.errores.filter(e => e && Number.isFinite(e.valor) && corto(e.valor) && e.valor > 0 && e.valor !== o.correcta);
    const alternativas = P.armar({ correcta: o.correcta, errores, rng, texto: o.texto });
    return salida(semilla, o, alternativas, { valor: o.correcta, unidad: o.unidad || '' });
  }
  function cerrarTexto(rng, semilla, o) {
    const alternativas = P.armarTexto({ correcta: o.correcta, errores: o.errores.filter(Boolean), rng });
    return salida(semilla, o, alternativas, { valor: o.correcta.clave, texto: o.correcta.texto, unidad: '' });
  }

  // ======================= entero-unico =======================
  const FRASE = { '1/2': 'la mitad', '1/3': 'la tercera parte', '1/4': 'la cuarta parte' };
  const fraccionTxt = (a, b) => FRASE[`${a}/${b}`] || `los ${a}/${b}`;

  function ventas(rng, semilla) {
    const [a, b] = rng.elegir([[1, 2], [2, 3], [3, 4], [3, 5], [4, 5]]);
    const [c, d] = rng.elegir([[1, 2], [1, 3], [1, 4], [2, 5], [2, 3]].filter(([c, d]) => c * b < a * d));
    const k1 = rng.entero(4, 24);
    const L = fr(k1 * b, b - a), n1 = piso(L) + 1;
    // k1 + k2 en ⟨n1(d − c)/d; (n1 + 1)(d − c)/d]: así N < U deja solo a n1.
    const k2s = []; for (let k2 = 3; k2 <= 40; k2++) { const u = (k1 + k2) * d / (d - c); if (u > n1 && u <= n1 + 1) k2s.push(k2); }
    if (!k2s.length) return null;
    const k2 = rng.elegir(k2s);
    const U = fr((k1 + k2) * d, d - c);
    const lo = piso(L) + 1, hi = techo(U) - 1;
    if (lo !== hi) return null;
    const n = lo;
    if (n > 150 || n - k1 - k2 < 2) return null;
    const obj = rng.elegir([{ n: 'chompas', art: 'las', cu: 'Cuántas' }, { n: 'cuadernos', art: 'los', cu: 'Cuántos' }, { n: 'polos', art: 'los', cu: 'Cuántos' },
      { n: 'mochilas', art: 'las', cu: 'Cuántas' }, { n: 'gorros', art: 'los', cu: 'Cuántos' }]);
    const quien = rng.elegir(['Una comerciante del mercado de Juliaca', 'Don Lucho, en su puesto de la feria,', 'Una vendedora de Tacna', 'El encargado de una tienda de Cusco']);
    const variables = { k1: { nombre: 'primera venta', color: 'o' }, k2: { nombre: 'segunda venta', color: 'i' }, N: { nombre: 'cantidad inicial', color: 'd' } };
    const f1 = fraccionTxt(a, b), f2 = fraccionTxt(c, d);
    const enunciado = [`${quien} tenía cierta cantidad de ${obj.n}. Vendió `, v('k1', k1), ` y le quedaron más de ${f1} de ${obj.art} que tenía. Luego vendió `, v('k2', k2),
      ` más y le quedaron menos de ${f2} de ${obj.art} que tenía al inicio.`];
    const pregunta = [`¿${obj.cu} `, v('N', obj.n), ' tenía al inicio?'];
    const NN = v('N', 'N');
    const solucion = [
      ['Sea ', NN, ` el número de ${obj.n} que tenía. Después de vender `, v('k1', k1), ': ', NN, ` − ${k1} > (${a}/${b})·N, es decir, (${qt(fr(b - a, b))})·N > ${k1}, y entonces `, NN, ` > ${qDec(L)}.`],
      ['Después de vender ', v('k2', k2), ' más: ', NN, ` − ${k1 + k2} < (${c}/${d})·N, es decir, (${qt(fr(d - c, d))})·N < ${k1 + k2}, y entonces `, NN, ` < ${qDec(U)}.`],
      [`El único entero mayor que ${qt(L)} y menor que ${qt(U)} es `, v('N', n), `. Comprobación: le quedan ${n - k1} y luego ${n - k1 - k2}.`],
    ];
    const cotaMenos = fr(a * (n - 1), b), cotaMas = fr(c * (n + 1), d);
    const errores = [
      qv(L) === n - 1
        ? al19(n - 1, `Resolviste N − ${k1} = (${a}/${b})·N como ecuación: N = ${n - 1}. Con ${n - 1} le quedan ${n - 1 - k1}, justo ${f1} de ${n - 1}, no más; la desigualdad es estricta: N > ${n - 1}.`)
        : redondeo(n - 1, `Redondeaste ${qt(L)} hacia abajo. Con ${n - 1} le habrían quedado ${n - 1 - k1}, que no es más que ${qDec(cotaMenos)} (${f1} de ${n - 1}).`),
      qv(U) === n + 1
        ? al19(n + 1, `Resolviste N − ${k1 + k2} = (${c}/${d})·N como ecuación: N = ${n + 1}. Con ${n + 1} le quedan al final ${n + 1 - k1 - k2}, justo ${f2} de ${n + 1}, no menos; la desigualdad es estricta: N < ${n + 1}.`)
        : redondeo(n + 1, `Redondeaste ${qt(U)} hacia arriba. Con ${n + 1} le quedarían al final ${n + 1 - k1 - k2}, que no es menos que ${qDec(cotaMas)} (${f2} de ${n + 1}).`),
      ar5('lo-que-quedo', n - k1 - k2, `${n - k1 - k2} es lo que le quedó al final. La pregunta es cuántos tenía al inicio.`),
      ar5('quedo-tras-la-primera-venta', n - k1, `${n - k1} es lo que le quedó después de la primera venta. La pregunta es cuántos tenía al inicio.`),
    ];
    return cerrar(rng, semilla, { correcta: n, errores, texto: x => N(x), variables, enunciado, pregunta, solucion,
      datos: { tipo: 'entero-unico', sub: 'ventas', a, b, c, d, k1, k2 } });
  }

  function dosPersonas(rng, semilla) {
    const m = rng.elegir([2, 3]), c = rng.elegir([-10, -8, -6, -5, -4, -3, 3, 4, 5, 6, 8, 10]);
    const x0 = rng.entero(12, 45);
    const opc2 = []; for (let t = (m - 1) * x0 + 1; t <= (m - 1) * (x0 + 1); t++) opc2.push(t);
    const e = rng.elegir(opc2) + c;
    if (e < 2 || e > 100) return null;
    const opc1 = []; for (let t = (m + 1) * (x0 - 1) + c; t <= (m + 1) * x0 - 1 + c; t++) opc1.push(t);
    const T = redondo(rng, opc1);
    const L0 = m * x0 + c;
    // Unicidad por enumeración.
    const sols = []; for (let x = 1; x <= 1000; x++) if (x + m * x + c > T && x + e > m * x + c && m * x + c > 0) sols.push(x);
    if (sols.length !== 1 || sols[0] !== x0) return null;
    const [A, B] = rng.elegir([['Rosa', 'Luis'], ['Ana', 'Beto'], ['Carmen', 'Jorge'], ['Lucía', 'Mario']]);
    const veces = m === 2 ? 'el doble' : 'el triple';
    const sg = c < 0 ? '−' : '+', ac = Math.abs(c);
    const variables = { x: { nombre: `lo que ganó ${A}`, color: 'o' }, L: { nombre: `lo que ganó ${B}`, color: 'd' }, T: { nombre: 'cota del total', color: 'i' }, e: { nombre: 'aumento supuesto', color: 'h' } };
    const enunciado = [`${A} y ${B} venden emoliente en una feria de Juliaca. El sábado, cada uno ganó un número entero de soles y ${B} ganó S/ ${ac} ${c < 0 ? 'menos' : 'más'} que ${veces} de lo que ganó ${A}. Entre los dos ganaron más de `,
      v('T', `S/ ${T}`), `, pero si ${A} hubiera ganado `, v('e', `S/ ${e}`), ` más, habría ganado más que ${B}.`];
    const pregunta = ['¿Cuánto ', v('L', `ganó ${B}`), ' el sábado?'];
    const Lx = `${m}x ${sg} ${ac}`;
    const solucion = [
      ['Sea ', v('x', 'x'), ` lo que ganó ${A}. ${B} ganó `, v('L', Lx), '.'],
      ['Entre los dos: ', v('x', 'x'), ' + ', v('L', `(${Lx})`), ' > ', v('T', T), ` → ${m + 1}x > ${N(T - c)} → x > ${qDec(fr(T - c, m + 1))}.`],
      ['Con ', v('e', `S/ ${e}`), ` más, ${A} supera a ${B}: x + ${e} > ${Lx} → ${m === 2 ? `x < ${N(e - c)}` : `${m - 1}x < ${N(e - c)} → x < ${qDec(fr(e - c, m - 1))}`}.`],
      [`El único entero posible es x = ${x0}, así que ${B} ganó `, v('L', `${m}·${x0} ${sg} ${ac} = S/ ${L0}`), '.'],
    ];
    const errores = [
      ar5('la-otra-persona', x0, `S/ ${x0} es lo que ganó ${A}. La pregunta es por lo que ganó ${B}.`),
      (m + 1) * (x0 - 1) === T - c
        ? al19(m * (x0 - 1) + c, `Resolviste ${m + 1}x = ${N(T - c)} como ecuación: x = ${x0 - 1}. Con x = ${x0 - 1} entre los dos ganan justo S/ ${T}, no más; la desigualdad es estricta: x > ${x0 - 1}.`)
        : redondeo(m * (x0 - 1) + c, `Usaste x = ${x0 - 1}, redondeando la cota x > ${qt(fr(T - c, m + 1))} hacia abajo. Entonces entre los dos ganan S/ ${(m + 1) * (x0 - 1) + c}, que no es más de S/ ${T}.`),
      (m - 1) * (x0 + 1) === e - c
        ? al19(m * (x0 + 1) + c, `Resolviste x + ${e} = ${Lx} como ecuación: x = ${x0 + 1}. Con x = ${x0 + 1}, ${A} con S/ ${e} más tendría S/ ${x0 + 1 + e}, justo lo de ${B}, y no lo supera; la desigualdad es estricta: x < ${x0 + 1}.`)
        : redondeo(m * (x0 + 1) + c, `Usaste x = ${x0 + 1}, redondeando la cota x < ${qt(fr(e - c, m - 1))} hacia arriba. Entonces ${A}, con S/ ${e} más, tendría S/ ${x0 + 1 + e} y ${B} S/ ${m * (x0 + 1) + c}: no lo supera.`),
      ar5('el-total', x0 + L0, `S/ ${x0 + L0} es lo que ganaron entre los dos. La pregunta es solo por ${B}.`),
    ];
    return cerrar(rng, semilla, { correcta: L0, errores, texto: x => `S/ ${N(x)}`, unidad: 'S/', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'entero-unico', sub: 'dos-personas', m, c, T, e } });
  }

  // ======================= dos-enteros =======================
  const CTX2 = [
    { lugar: 'En una granja de Ayaviri hay patos y gallinas', X: 'patos', Y: 'gallinas' },
    { lugar: 'En un paradero de Juliaca hay combis y mototaxis', X: 'combis', Y: 'mototaxis' },
    { lugar: 'En la biblioteca de un colegio hay diccionarios y atlas', X: 'diccionarios', Y: 'atlas' },
    { lugar: 'En un corral de Chivay hay alpacas y llamas', X: 'alpacas', Y: 'llamas' },
  ];
  const VECES = { 1: '', 2: 'el doble del ', 3: 'el triple del ', 4: 'el cuádruple del ' };
  const REL = { '>': 'es mayor que', '<': 'es menor que', '≥': 'no puede ser menor que', '≤': 'no puede ser mayor que' };
  const cumple = (val, rel, c) => (rel === '>' ? val > c : rel === '<' ? val < c : rel === '≥' ? val >= c : val <= c);

  function soluciones(ineqs, tope = 150) {
    const S = [];
    for (let x = 1; x <= tope; x++) for (let y = 1; y <= tope; y++)
      if (ineqs.every(([a, b, rel, c]) => cumple(a * x + b * y, rel, c))) S.push([x, y]);
    return S;
  }
  const acotado = (S, tope = 150) => S.every(([x, y]) => x < tope - 20 && y < tope - 20);
  // Texto de a·x + b·y rel c: «3x − 2y > 4».
  const ineqTxt = ([a, b, rel, c]) => `${(termino(a, 'x', true) + termino(b, 'y', a === 0)) || '0'} ${rel} ${N(c)}`;

  function frase(ctx, [a, b, rel, c]) {
    const parte = (k, clave, cosa) => [(k === 1 ? 'el ' : VECES[k]), v(clave, `número de ${cosa}`)];
    const out = [];
    if (a !== 0) out.push(...parte(a, 'x', ctx.X));
    if (b !== 0) {
      if (a === 0) out.push(...parte(Math.abs(b), 'y', ctx.Y));
      else out.push(b < 0 ? ', disminuido en ' : ', aumentado en ', ...parte(Math.abs(b), 'y', ctx.Y), ',');
    }
    out.push(` ${REL[rel]} ${N(c)}`);
    return out;
  }

  function dosEnteros(rng, semilla, sub) {
    const x0 = rng.entero(4, 16), y0 = rng.entero(2, 10);
    const a1 = rng.entero(1, 3), b1 = rng.entero(1, 3), a2 = rng.entero(1, 3), b2 = rng.entero(1, 3);
    let r1 = rng.elegir(['>', '≥']), r3 = rng.elegir(['>', '≥']);
    if (r1 === '>' && r3 === '>') { if (rng.moneda()) r1 = '≥'; else r3 = '≥'; }
    const r2 = rng.elegir(['<', '≤']);
    const holgura = (rel) => (sub === 'unico' ? (rel === '>' || rel === '<' ? rng.entero(1, 2) : rng.entero(0, 1)) : rng.entero(rel === '>' || rel === '<' ? 1 : 0, 5));
    const cte = (val, rel) => (rel === '>' || rel === '≥' ? val - holgura(rel) : val + holgura(rel));
    const I1 = [a1, -b1, r1, cte(a1 * x0 - b1 * y0, r1)];
    const I2 = [a2, b2, r2, cte(a2 * x0 + b2 * y0, r2)];
    const I3 = [0, 1, r3, cte(y0, r3)];
    const ineqs = [I1, I2, I3];
    if (ineqs.some(I => I[3] < 1)) return null;
    const S = soluciones(ineqs);
    if (!S.length || !acotado(S)) return null;
    if (sub === 'unico' && S.length !== 1) return null;
    if (sub === 'maximo' && (S.length < 3 || S.length > 12)) return null;
    const pedido = sub === 'unico' ? rng.elegir(['suma', 'producto']) : rng.elegir(['max-suma', 'max-x']);
    const ctx = rng.elegir(CTX2);
    const obj = ([x, y]) => (pedido === 'suma' || pedido === 'max-suma' ? x + y : pedido === 'producto' ? x * y : x);
    const valorDe = Ss => Ss.length ? Math.max(...Ss.map(obj)) : NaN;
    const correcta = valorDe(S);

    // Filas por valor de y: cotas de x.
    const yMin = r3 === '>' ? I3[3] + 1 : I3[3];
    const filas = [];
    for (let y = yMin; filas.length < 9; y++) {
      const lo = fr(I1[3] + b1 * y, a1), hi = fr(I2[3] - b2 * y, a2);
      if (qv(lo) > qv(hi)) break;
      const xs = S.filter(p => p[1] === y).map(p => p[0]);
      filas.push(`y = ${y}: ${qt(lo)} ${r1 === '>' ? '<' : '≤'} x ${r2} ${qt(hi)} → ${xs.length === 0 ? 'ningún entero' : xs.length === 1 ? 'x = ' + xs[0] : 'x ∈ {' + xs.join('; ') + '}'}`);
    }
    if (filas.length > 7 || filas.length < 1) return null;
    if (S.some(p => p[1] >= yMin + filas.length)) return null; // las filas deben cubrir todas las soluciones

    const variables = { x: { nombre: `número de ${ctx.X}`, color: 'o' }, y: { nombre: `número de ${ctx.Y}`, color: 'i' }, r: { nombre: 'lo que se pide', color: 'd' } };
    const enunciado = [`${ctx.lugar}, al menos uno de cada uno. Se sabe que: `, ...frase(ctx, I1), '; ', ...frase(ctx, I2), '; y ', ...frase(ctx, I3), '.'];
    const pregunta = pedido === 'suma' ? ['¿Cuánto es ', v('r', 'la suma'), ` del número de ${ctx.X} y el número de ${ctx.Y}?`]
      : pedido === 'producto' ? ['¿Cuánto es ', v('r', 'el producto'), ` del número de ${ctx.X} por el número de ${ctx.Y}?`]
        : pedido === 'max-suma' ? ['¿Cuál es ', v('r', 'el mayor valor posible'), ` de la suma del número de ${ctx.X} y el de ${ctx.Y}?`]
          : ['¿Cuál es ', v('r', `el mayor número posible de ${ctx.X}`), '?'];
    const solucion = [
      ['Sean ', v('x', 'x'), ` el número de ${ctx.X} e `, v('y', 'y'), ` el de ${ctx.Y}. Las condiciones son ${ineqTxt(I1)}, ${ineqTxt(I2)} y ${ineqTxt(I3)}${r1 === '≥' || r3 === '≥' ? ' («no puede ser menor que» es ≥)' : ''}.`],
      [`Para cada y, la primera da una cota inferior de x y la segunda una superior. Se prueban los valores de y desde ${yMin}: ${filas.join('; ')}.`],
    ];
    const op = pedido === 'producto' ? '·' : ' + ';
    if (sub === 'unico') solucion.push([`La única pareja es x = ${S[0][0]}, y = ${S[0][1]}: `, v('r', `${S[0][0]}${op}${S[0][1]} = ${correcta}`), '.']);
    else {
      const mejores = S.filter(p => obj(p) === correcta).map(p => `(${p[0]}; ${p[1]})`);
      const enDonde = mejores.length === 1 ? `se da en ${mejores[0]}` : `se da en ${mejores.slice(0, -1).join(', ')} y ${mejores[mejores.length - 1]}`;
      solucion.push([`Las parejas posibles son ${S.map(p => `(${p[0]}; ${p[1]})`).join(', ')}. ${pedido === 'max-x' ? 'El mayor valor de x' : 'La mayor suma'} ${enDonde}: `, v('r', correcta), '.']);
    }

    const errores = [];
    // AL1: «no puede ser menor que» leído como ≤.
    const idxGe = [0, 2].find(i => ineqs[i][2] === '≥');
    if (idxGe !== undefined) {
      const c = ineqs[idxGe][3];
      const inv = ineqs.map((I, i) => (i === idxGe ? [I[0], I[1], '≤', I[3]] : I));
      const Si = soluciones(inv);
      if (Si.length && acotado(Si) && (sub === 'maximo' || Si.length === 1)) errores.push(hip('no-menor-que-como-a-lo-mas', valorDe(Si),
        `Leíste «no puede ser menor que ${c}» como «≤ ${c}». «No puede ser menor» quiere decir que es mayor o igual: ≥ ${c}.`));
      const est = ineqs.map((I, i) => (i === idxGe ? [I[0], I[1], '>', I[3]] : I));
      const Se = soluciones(est);
      if (Se.length && (sub === 'maximo' || Se.length === 1)) errores.push(hip('extremo-excluido', valorDe(Se),
        `Tomaste «no puede ser menor que ${c}» como «> ${c}» y dejaste fuera el caso igual a ${c}, que sí vale.`));
    }
    if (sub === 'unico') {
      const [x, y] = S[0];
      errores.push(ar5('solo-una-cantidad', x, `${x} es solo el número de ${ctx.X}. Se pide ${pedido === 'suma' ? 'la suma' : 'el producto'} con el de ${ctx.Y}.`));
      errores.push(ar5('solo-una-cantidad', y, `${y} es solo el número de ${ctx.Y}. Se pide ${pedido === 'suma' ? 'la suma' : 'el producto'} con el de ${ctx.X}.`));
      errores.push(ar5('otra-operacion', pedido === 'suma' ? x * y : x + y, pedido === 'suma' ? `${x * y} es el producto ${x}·${y}; se pide la suma.` : `${x + y} es la suma ${x} + ${y}; se pide el producto.`));
    } else {
      // Vértice de la región continua (las estrictas como ≤ o ≥) para el objetivo.
      // Con enteros, «> c» es «≥ c + 1» y «< c» es «≤ c − 1».
      const c1 = r1 === '>' ? I1[3] + 1 : I1[3], c2 = r2 === '<' ? I2[3] - 1 : I2[3], c3 = r3 === '>' ? I3[3] + 1 : I3[3];
      const rectas = [[a1, -b1, c1], [a2, b2, c2], [0, 1, c3], [1, 0, 1]];
      let Mx = -Infinity, Vx = null;
      for (let i = 0; i < rectas.length; i++) for (let j = i + 1; j < rectas.length; j++) {
        const [p1, q1, s1] = rectas[i], [p2, q2, s2] = rectas[j], D = p1 * q2 - p2 * q1;
        if (D === 0) continue;
        const X = fr(s1 * q2 - s2 * q1, D), Y = fr(p1 * s2 - p2 * s1, D), xv = qv(X), yv = qv(Y), t = 1e-9;
        if (a1 * xv - b1 * yv < c1 - t || a2 * xv + b2 * yv > c2 + t || yv < c3 - t || xv < 1 - t) continue;
        const o = pedido === 'max-x' ? xv : xv + yv;
        if (o > Mx) { Mx = o; Vx = [X, Y]; }
      }
      if (Vx && (Vx[0].d > 1 || Vx[1].d > 1) && Math.floor(Mx + 1e-9) > correcta) errores.push(err('PL-vertice-no-entero', Math.floor(Mx + 1e-9),
        `Tomaste el vértice de la región, (${qt(Vx[0])}; ${qt(Vx[1])}), que no es un par de enteros, y redondeaste ${qDec(pedido === 'max-x' ? Vx[0] : fr(Vx[0].n * Vx[1].d + Vx[1].n * Vx[0].d, Vx[0].d * Vx[1].d))} hacia abajo. Ningún par de enteros que cumpla las tres condiciones llega a ese valor.`));
      errores.push(ar5('el-menor', Math.min(...S.map(obj)), 'Ese es el menor valor posible. Se pide el mayor.'));
      errores.push(ar5('cuenta-parejas', S.length, `Hay ${S.length} parejas posibles, pero no se pregunta cuántas hay, sino el mayor valor.`));
      const sinTercera = soluciones([I1, I2]);
      if (sinTercera.length && acotado(sinTercera)) errores.push(err('olvida-una-condicion', valorDe(sinTercera), `Ese valor no cumple la tercera condición (${ineqTxt(I3)}). Las tres se cumplen a la vez.`));
    }
    return cerrar(rng, semilla, { correcta, errores, texto: x => N(x), variables, enunciado, pregunta, solucion,
      datos: { tipo: 'dos-enteros', sub, pedido, ineqs } });
  }

  // ======================= cuadratica-entera =======================
  function cuadraticaEntera(rng, semilla) {
    const n0 = rng.entero(8, 18), a = rng.entero(2, 8), b = rng.entero(1, 4);
    const g = n => n * (n + a), h = n => n * (n - b);
    const opA = []; for (let t = g(n0 - 1); t < g(n0); t++) opA.push(t);
    const opB = []; for (let t = h(n0) + 1; t <= h(n0 + 1); t++) opB.push(t);
    const A = redondo(rng, opA), B = redondo(rng, opB);
    const sols = []; for (let n = b + 1; n <= 500; n++) if (g(n) > A && h(n) < B) sols.push(n);
    if (sols.length !== 1) return null;
    const variables = { n: { nombre: 'número de paquetes', color: 'd' }, A: { nombre: 'cota del gasto real', color: 'o' }, B: { nombre: 'cota del gasto supuesto', color: 'i' } };
    const enunciado = [`La auxiliar de un colegio de Puno compró cierto número de paquetes de papel. Cada paquete costó, en soles, ${a} más que el número de paquetes comprados, y en total gastó más de `,
      v('A', `S/ ${A}`), `. Si cada paquete hubiera costado ${b} ${b === 1 ? 'sol' : 'soles'} menos que el número de paquetes, habría gastado menos de `, v('B', `S/ ${B}`), '.'];
    const pregunta = ['¿Cuántos ', v('n', 'paquetes'), ' compró?'];
    const D1 = a * a + 4 * A, D2 = b * b + 4 * B;
    const r1 = (-a + Math.sqrt(D1)) / 2, r2 = (b + Math.sqrt(D2)) / 2;
    const solucion = [
      ['Sea ', v('n', 'n'), ` el número de paquetes. Cada uno costó n + ${a} soles: n(n + ${a}) > `, v('A', A), ` → ${pol([1, a, -A], 'n')} > 0.`],
      [`La raíz positiva de ${pol([1, a, -A], 'n')} = 0 es (−${a} + √${D1})/2 ${esCuadrado(D1) ? '= ' : '≈ '}${N(r1)}; la parábola abre hacia arriba, así que n > ${N(r1)}.`],
      [`Con el otro precio: n(n − ${b}) < `, v('B', B), ` → ${pol([1, -b, -B], 'n')} < 0 → n < (${b} + √${D2})/2 ${esCuadrado(D2) ? '= ' : '≈ '}${N(r2)}.`],
      [`El único entero entre esas cotas es `, v('n', n0), `. Comprobación: ${n0}·${n0 + a} = ${g(n0)} > ${A} y ${n0}·${n0 - b} = ${h(n0)} < ${B}.`],
    ];
    const errores = [
      g(n0 - 1) === A
        ? al19(n0 - 1, `Resolviste ${pol([1, a, -A], 'n')} = 0 como ecuación: n = ${n0 - 1}. Con ${n0 - 1} paquetes el gasto es ${n0 - 1}·${n0 - 1 + a} = ${A} soles, justo ${A}, no más; la desigualdad es estricta: n > ${n0 - 1}.`)
        : redondeo(n0 - 1, `Redondeaste ${N(r1)} hacia abajo. Con ${n0 - 1} paquetes el gasto sería ${n0 - 1}·${n0 - 1 + a} = ${g(n0 - 1)} soles, que no es más de ${A}.`),
      h(n0 + 1) === B
        ? al19(n0 + 1, `Resolviste ${pol([1, -b, -B], 'n')} = 0 como ecuación: n = ${n0 + 1}. Con ${n0 + 1} paquetes, al otro precio el gasto es justo ${B} soles, no menos; la desigualdad es estricta: n < ${n0 + 1}.`)
        : redondeo(n0 + 1, `Redondeaste ${N(r2)} hacia arriba. Con ${n0 + 1} paquetes, al otro precio el gasto sería ${n0 + 1}·${n0 + 1 - b} = ${h(n0 + 1)} soles, que no es menos de ${B}.`),
      ar5('el-precio', n0 + a, `${n0 + a} es el precio de cada paquete, en soles. Se pregunta cuántos paquetes compró.`),
      ar5('el-precio-supuesto', n0 - b, `${n0 - b} es el precio supuesto de cada paquete. Se pregunta cuántos paquetes compró.`),
    ];
    return cerrar(rng, semilla, { correcta: n0, errores, texto: x => N(x), variables, enunciado, pregunta, solucion,
      datos: { tipo: 'cuadratica-entera', a, b, A, B } });
  }

  // ======================= area =======================
  function perimetroComun(rng, semilla) {
    const s = rng.entero(6, 20), D = rng.entero(2, Math.min(s * s - 1, 45));
    const rD = Math.floor(Math.sqrt(D) + 1e-12), exacta = rD * rD === D;
    const xm = s + rD, Amin = s * s - D;
    const variables = { s: { nombre: 'lado del cuadrado', color: 'o' }, D: { nombre: 'lo que se le resta al área', color: 'i' }, x: { nombre: 'largo del rectángulo', color: 'd' } };
    const enunciado = ['Un cuadrado de ', v('s', `${s} cm`), ' de lado y un rectángulo tienen el mismo perímetro. Los lados del rectángulo miden un número entero de centímetros, y su área no puede ser menor que el área del cuadrado disminuida en ',
      v('D', `${D} cm²`), '.'];
    const pregunta = ['¿Cuál es la mayor medida posible del ', v('x', 'largo'), ' del rectángulo?'];
    const solucion = [
      ['El perímetro común es 4·', v('s', s), ` = ${4 * s} cm, así que largo + ancho = ${2 * s} cm. Si el largo es `, v('x', 'x'), `, el ancho es ${2 * s} − x.`],
      [`Área: x(${2 * s} − x) ≥ ${s}² − `, v('D', D), ` = ${Amin} → x² − ${2 * s}x + ${Amin} ≤ 0 → (x − ${s})² ≤ ${D}.`],
      [`Entonces x ≤ ${s} + √${D}${exacta ? ' = ' + xm : ' ≈ ' + N(s + Math.sqrt(D))}. El mayor entero es `, v('x', `${xm} cm`), ` (ancho ${2 * s - xm} cm; área ${xm * (2 * s - xm)} cm² ≥ ${Amin} cm²).`],
    ];
    const xMal = Math.floor(2 * s + Math.sqrt(3 * s * s + D) + 1e-12);
    const errores = [
      exacta
        ? hip('extremo-excluido', xm - 1, `Con largo ${xm} cm el área es justo ${Amin} cm², y eso vale: «no puede ser menor» incluye el caso igual.`)
        : redondeo(xm + 1, `Con largo ${xm + 1} cm el ancho es ${2 * s - xm - 1} cm y el área ${(xm + 1) * (2 * s - xm - 1)} cm², menor que ${Amin} cm²: redondeaste ${N(s + Math.sqrt(D))} hacia arriba.`),
      err('perimetro-como-suma-de-dos-lados', xMal, `Tomaste largo + ancho = ${4 * s} cm, el perímetro entero. El perímetro suma los cuatro lados: largo + ancho es la mitad, ${2 * s} cm.`),
      hip('no-menor-que-como-a-lo-mas', 2 * s - 1, `Leíste «no puede ser menor que» como «a lo más». Con largo ${2 * s - 1} cm y ancho 1 cm el área es ${2 * s - 1} cm², muy por debajo de ${Amin} cm².`),
      ar5('el-ancho', 2 * s - xm, `${2 * s - xm} cm es el ancho del rectángulo más alargado. Se pide su largo.`),
      ar5('el-lado-del-cuadrado', s, `${s} cm es el lado del cuadrado; con ese largo el rectángulo sería el mismo cuadrado. Se pide el mayor largo.`),
    ];
    return cerrar(rng, semilla, { correcta: xm, errores, texto: x => `${N(x)} cm`, unidad: 'cm', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'area', sub: 'perimetro-comun', s, D } });
  }

  function dosRectangulos(rng, semilla) {
    const x0 = rng.entero(5, 15), a = rng.entero(1, 6), b = rng.entero(1, 3), c = rng.entero(0, 5);
    const S = x => x * (x + a) + (x + c) * (x - b);
    const opB = []; for (let t = S(x0 - 1); t < S(x0); t++) opB.push(t);
    const opA = []; for (let t = S(x0) + 1; t <= S(x0 + 1); t++) opA.push(t);
    const Bc = redondo(rng, opB), Ac = redondo(rng, opA);
    const sols = []; for (let x = b + 1; x <= 300; x++) if (S(x) > Bc && S(x) < Ac) sols.push(x);
    if (sols.length !== 1) return null;
    const P1 = 2 * (2 * x0 + a);
    const variables = { x: { nombre: 'ancho del primer rectángulo', color: 'o' }, B: { nombre: 'cota inferior', color: 'i' }, A: { nombre: 'cota superior', color: 'h' }, P: { nombre: 'perímetro del primero', color: 'd' } };
    const lado2 = c === 0 ? 'x cm' : `(x + ${c}) cm`;
    const enunciado = ['Un rectángulo mide ', v('x', 'x'), ` cm de ancho y (x + ${a}) cm de largo; otro mide ${lado2} por (x − ${b}) cm, donde x es un número entero. La suma de sus áreas es mayor que `,
      v('B', `${Bc} cm²`), ' y menor que ', v('A', `${Ac} cm²`), '.'];
    const pregunta = ['¿Cuál es el ', v('P', 'perímetro'), ' del primer rectángulo?'];
    const k = a + c - b;
    const solucion = [
      [`Suma de áreas: x(x + ${a}) + ${c === 0 ? 'x' : `(x + ${c})`}(x − ${b}) = ${pol([2, k, -b * c])}.`],
      ['Entonces ', v('B', Bc), ` < ${pol([2, k, -b * c])} < `, v('A', Ac), `. Para x > ${b} esa expresión crece con x: con x = ${x0 - 1} vale ${S(x0 - 1)}, con x = ${x0} vale ${S(x0)} y con x = ${x0 + 1} vale ${S(x0 + 1)}.`],
      ['Solo ', v('x', `x = ${x0}`), ` cumple las dos. El primer rectángulo mide ${x0} cm por ${x0 + a} cm: `, v('P', `perímetro = 2(${x0} + ${x0 + a}) = ${P1} cm`), '.'],
    ];
    const errores = [
      err('semiperimetro', 2 * x0 + a, `${2 * x0 + a} cm es la suma del largo y el ancho, la mitad del perímetro. El perímetro suma los cuatro lados.`),
      ar5('el-otro-rectangulo', 2 * (2 * x0 + c - b), `${2 * (2 * x0 + c - b)} cm es el perímetro del segundo rectángulo. Se pide el del primero.`),
      S(x0 - 1) === Bc
        ? al19(2 * (2 * (x0 - 1) + a), `Resolviste ${pol([2, k, -b * c])} = ${Bc} como ecuación: x = ${x0 - 1}. Con x = ${x0 - 1} la suma de áreas es justo ${Bc} cm², no más; la desigualdad es estricta.`)
        : redondeo(2 * (2 * (x0 - 1) + a), `Usaste x = ${x0 - 1}: la suma de áreas sería ${S(x0 - 1)} cm², que no es mayor que ${Bc} cm².`),
      S(x0 + 1) === Ac
        ? al19(2 * (2 * (x0 + 1) + a), `Resolviste ${pol([2, k, -b * c])} = ${Ac} como ecuación: x = ${x0 + 1}. Con x = ${x0 + 1} la suma de áreas es justo ${Ac} cm², no menos; la desigualdad es estricta.`)
        : redondeo(2 * (2 * (x0 + 1) + a), `Usaste x = ${x0 + 1}: la suma de áreas sería ${S(x0 + 1)} cm², que no es menor que ${Ac} cm².`),
      ar5('el-valor-de-x', x0, `${x0} es el valor de x, el ancho del primer rectángulo. Se pide su perímetro.`),
    ];
    return cerrar(rng, semilla, { correcta: P1, errores, texto: x => `${N(x)} cm`, unidad: 'cm', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'area', sub: 'dos-rectangulos', a, b, c, B: Bc, A: Ac } });
  }

  // ======================= discriminante =======================
  function menorEntero(rng, semilla) {
    const a = rng.elegir([1, 1, 2, 3]), b = rng.elegir([-12, -10, -9, -8, -7, -6, -5, -4, 4, 5, 6, 7, 8, 9, 10, 12]);
    const t = fr(b * b, 4 * a);
    if (qv(t) < 2) return null;
    const ans = piso(t) + 1, entero = t.d === 1;
    const variables = { k: { nombre: 'k', color: 'd' } };
    const enunciado = ['Se quiere que la desigualdad ', `${pol([a, b, 0])} + `, v('k', 'k'), ' > 0 se cumpla para todo número real x.'];
    const pregunta = ['¿Cuál es el menor valor entero de ', v('k', 'k'), '?'];
    const vx = fr(-b, 2 * a);
    const solucion = [
      [`El coeficiente de x² es ${a}, positivo: la parábola abre hacia arriba. Es positiva para todo x si no toca el eje, es decir, si su discriminante es negativo.`],
      [`Δ = ${cuadradoTxt(b)} − 4·${a}·k = ${b * b} − ${4 * a}k < 0 → k > ${qDec(t)}.`],
      ['El menor entero es ', v('k', ans), `.${entero ? ` Con k = ${N(t.n)} la expresión vale 0 en x = ${qt(vx)} y no es positiva.` : ''}`],
    ];
    const errores = [
      entero ? al19(t.n, `Resolviste Δ = ${b * b} − ${4 * a}k = 0 como ecuación: k = ${t.n}. Con k = ${t.n} la expresión vale 0 en x = ${qt(vx)}, y 0 no es mayor que 0; la desigualdad es estricta: k > ${t.n}.`)
        : redondeo(piso(t), `Redondeaste ${qt(t)} hacia abajo. Con k = ${piso(t)} el discriminante es positivo y la expresión es negativa cerca de x = ${qt(vx)}.`),
      err('discriminante-signo-invertido', techo(t) - 1, `Pediste Δ > 0, y eso da k < ${qt(t)}. Para que no corte al eje se necesita Δ < 0.`),
      err('discriminante-sin-el-4', piso(fr(b * b, a)) + 1, `Olvidaste el 4 de Δ = b² − 4ac: quedó ${b * b} − ${a === 1 ? '' : a}k < 0.`),
      ...(a !== 1 ? [err('discriminante-sin-a', piso(fr(b * b, 4)) + 1, `Olvidaste el coeficiente ${a} de x² en Δ = b² − 4ac: quedó ${b * b} − 4k < 0.`)] : []),
      ...(vx.d === 1 && vx.n > 0 ? [ar5('el-vertice', vx.n, `${vx.n} es la abscisa del vértice, donde la parábola toma su menor valor. Se pide k.`)] : []),
    ];
    return cerrar(rng, semilla, { correcta: ans, errores, texto: x => N(x), variables, enunciado, pregunta, solucion,
      datos: { tipo: 'discriminante', sub: 'menor-entero', a, b } });
  }

  function pelota(rng, semilla) {
    const vel = rng.elegir([6, 8, 10, 12, 14, 16, 18, 20]), h0 = rng.entero(2, 15);
    const max = fr(20 * h0 + vel * vel, 20);
    const entero = max.d === 1, ans = piso(max) + 1;
    const variables = { h0: { nombre: 'altura inicial', color: 'o' }, vv: { nombre: 'rapidez inicial', color: 'i' }, H: { nombre: 'altura de la malla', color: 'd' } };
    const enunciado = ['Desde la azotea de una casa, a ', v('h0', `${h0} m`), ' del suelo, se lanza una pelota hacia arriba. Su altura, en metros, a los t segundos es h(t) = −5t² + ',
      v('vv', vel), 't + ', v('h0', h0), '. Se quiere colocar arriba una malla horizontal que la pelota no llegue a tocar.'];
    const pregunta = ['¿A qué menor ', v('H', 'altura'), ' entera, en metros, se puede colocar la malla?'];
    const solucion = [
      ['La malla a la altura ', v('H', 'H'), ' no se toca si h(t) < H para todo t: 5t² − ', v('vv', vel), 't + (H − ', v('h0', h0), ') > 0 para todo t.'],
      [`La parábola 5t² − ${vel}t + (H − ${h0}) abre hacia arriba; es siempre positiva si Δ < 0: ${vel}² − 4·5·(H − ${h0}) < 0 → H − ${h0} > ${qDec(fr(vel * vel, 20))} → H > ${qDec(max)}.`],
      ['La menor altura entera es ', v('H', `${ans} m`), `.${entero ? ` A ${N(max.n)} m la pelota llega justo y la toca.` : ''}`],
    ];
    const errores = [
      entero ? al19(max.n, `Resolviste Δ = 0 como ecuación: H = ${max.n}. A ${max.n} m llega justo la pelota en su punto más alto, así que la toca; la desigualdad es estricta: H > ${max.n}.`)
        : redondeo(piso(max), `Redondeaste ${N(qv(max))} hacia abajo. A ${piso(max)} m la pelota pasa y toca la malla, porque llega hasta ${N(qv(max))} m.`),
      err('discriminante-signo-invertido', techo(max) - 1, `Pediste Δ > 0. Eso da H < ${N(qv(max))}: alturas que la pelota sí alcanza. Para que nunca la toque, Δ < 0.`),
      err('discriminante-sin-el-4', piso(fr(5 * h0 + vel * vel, 5)) + 1, `Olvidaste el 4 de Δ = b² − 4ac: quedó ${vel}² − 5(H − ${h0}) < 0.`),
      err('olvida-la-altura-inicial', piso(fr(vel * vel, 20)) + 1, `No sumaste los ${h0} m de la azotea: la pelota sube ${qDec(fr(vel * vel, 20))} m desde ahí, pero se mide desde el suelo.`),
    ];
    return cerrar(rng, semilla, { correcta: ans, errores, texto: x => `${N(x)} m`, unidad: 'm', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'discriminante', sub: 'contexto', v: vel, h0 } });
  }

  function intervaloK(rng, semilla) {
    const m = rng.entero(1, 7), signoB = rng.moneda() ? 1 : -1, positivo = rng.moneda();
    const b = signoB * 2 * m;
    const variables = { k: { nombre: 'k', color: 'd' }, E: { nombre: 'la expresión', color: 'o' } };
    const expr = `kx² ${b < 0 ? '−' : '+'} ${2 * m}x + k`;
    const enunciado = ['Se quiere que la expresión ', v('E', expr), ` sea ${positivo ? 'positiva' : 'negativa'} para todo número real x.`];
    const pregunta = ['¿Para qué valores de ', v('k', 'k'), ' ocurre?'];
    const correcta = intervalo(positivo ? [pz(m, false, null, false)] : [pz(null, false, -m, false)]);
    const solucion = [
      [`Para que sea ${positivo ? 'positiva' : 'negativa'} para todo x, la parábola debe abrir hacia ${positivo ? 'arriba' : 'abajo'} y no tocar el eje: `, v('k', 'k'), ` ${positivo ? '>' : '<'} 0 y Δ < 0.`],
      [`Δ = ${cuadradoTxt(b)} − 4·k·k = ${b * b} − 4k² < 0 → k² > ${m * m} → k < −${m} o k > ${m}.`],
      [`Con k ${positivo ? '>' : '<'} 0 queda k ∈ `, v('k', correcta.texto), '.'],
    ];
    const union = intervalo([pz(null, false, -m, false), pz(m, false, null, false)]);
    const errores = [
      conTexto(err('olvida-el-signo-de-a', 0, `Olvidaste que el coeficiente de x² también debe ser ${positivo ? 'positivo' : 'negativo'}: con k ${positivo ? `< −${m}` : `> ${m}`} la parábola abre hacia ${positivo ? 'abajo y es negativa' : 'arriba y es positiva'} lejos del vértice.`), union),
      conTexto(err('discriminante-signo-invertido', 0, `Pediste Δ > 0 (k² < ${m * m}). Con Δ > 0 la parábola corta al eje y cambia de signo.`), intervalo([pz(-m, false, m, false)])),
      conTexto(hip('extremo-incluido', 0, `Con k = ${N(positivo ? m : -m)} el discriminante es 0 y la expresión vale 0 en un punto: no es ${positivo ? 'positiva' : 'negativa'} ahí.`),
        intervalo(positivo ? [pz(m, true, null, false)] : [pz(null, false, -m, true)])),
      conTexto(err('solo-el-coeficiente-principal', 0, `Pediste solo k ${positivo ? '>' : '<'} 0. Con k = ${qt(fr(positivo ? m : -m, 2))}, por ejemplo, el discriminante es positivo y la parábola corta al eje.`),
        intervalo(positivo ? [pz(0, false, null, false)] : [pz(null, false, 0, false)])),
    ];
    return cerrarTexto(rng, semilla, { correcta, errores, variables, enunciado, pregunta, solucion,
      datos: { tipo: 'discriminante', sub: 'intervalo', b, positivo } });
  }

  // ======================= moviles =======================
  function moviles(rng, semilla) {
    const r1 = rng.entero(5, 25), r2 = r1 + rng.entero(3, 15);
    const s1 = rng.entero(1, 12), s2 = s1 + rng.entero(2, 8);
    const p = r2, q = s1 + 1, d = p - q;
    if (d < 6) return null;
    const vA = rng.entero(4, 25), vB = rng.entero(4, 25);
    if (vA === vB) return null;
    const t = d / (vA + vB);
    if (!corto(t) || t > 6) return null;
    const variables = { p: { nombre: 'posición de A', color: 'o' }, q: { nombre: 'posición de B', color: 'i' }, t: { nombre: 'tiempo de encuentro', color: 'd' } };
    const e1 = pol([1, -(r1 + r2), r1 * r2]), e2 = pol([1, -(s1 + s2), s1 * s2]);
    const enunciado = ['Dos ciclistas están en una carretera recta. El ciclista A está en el kilómetro ', v('p', 'p'), `, donde p es el mayor elemento del conjunto solución de ${e1} ≤ 0. El ciclista B está en el kilómetro `,
      v('q', 'q'), `, donde q es el menor número entero del conjunto solución de ${e2} < 0. Salen al mismo tiempo, uno hacia el otro, con rapideces constantes de ${vA} km/h y ${vB} km/h.`];
    const pregunta = ['¿Cuántas horas después de salir se ', v('t', 'encuentran'), '?'];
    const solucion = [
      [`${e1} ≤ 0 → ${factor(r1)}${factor(r2)} ≤ 0 → x ∈ [${r1}; ${r2}]. El mayor elemento es `, v('p', `p = ${p}`), '.'],
      [`${e2} < 0 → ${factor(s1)}${factor(s2)} < 0 → x ∈ ⟨${s1}; ${s2}⟩. El ${s1} no está; el menor entero es `, v('q', `q = ${q}`), '.'],
      [`Los separan ${p} − ${q} = ${d} km y se acercan a ${vA} + ${vB} = ${vA + vB} km/h: `, v('t', `t = ${d}/${vA + vB} = ${N(t)} h`), '.'],
    ];
    const S = vA + vB;
    const errores = [
      hip('extremo-excluido-tomado', (p - s1) / S, `Tomaste q = ${s1}, pero la desigualdad es estricta: ${s1} no está en ⟨${s1}; ${s2}⟩ y el menor entero es ${q}.`),
      err('otro-extremo', Math.abs(q - r1) / S, `Tomaste p = ${r1}, el menor elemento de [${r1}; ${r2}]. Se pide el mayor.`),
      err('otro-extremo', (p - (s2 - 1)) / S, `Tomaste q = ${s2 - 1}, el mayor entero de ⟨${s1}; ${s2}⟩. Se pide el menor.`),
      err('encuentro-con-resta', d / Math.abs(vA - vB), `Restaste las rapideces, como si uno persiguiera al otro. Van uno hacia el otro: se acercan con la suma, ${S} km/h.`),
    ];
    return cerrar(rng, semilla, { correcta: t, errores, texto: x => `${N(x)} h`, unidad: 'h', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'moviles', r1, r2, s1, s2, vA, vB } });
  }

  // ======================= racional =======================
  function homografica(rng, semilla) {
    const pp = rng.entero(1, 4), r = rng.entero(1, 4), q = rng.entero(-6, 10);
    const a = rng.entero(0, 4), b = a + rng.entero(1, 6);
    const m = q - pp * r;
    if (m === 0) return null;
    const izqCerrado = rng.moneda(); // un corchete de cada clase
    const f = x => fr(pp * x + q, x + r);
    const fa = f(a), fb = f(b);
    const decrece = m > 0;
    const lo = decrece ? fb : fa, hi = decrece ? fa : fb;
    const lc = decrece ? !izqCerrado : izqCerrado, hc = decrece ? izqCerrado : !izqCerrado;
    const correcta = intervalo([{ lo, lc, hi, hc }]);
    const I = intervalo([pz(a, izqCerrado, b, !izqCerrado)]).texto;
    const variables = { x: { nombre: 'x', color: 'o' }, E: { nombre: 'la expresión E', color: 'd' } };
    const expr = `${q === 0 ? pol([pp, 0]) : `(${pol([pp, q])})`}/(x + ${r})`;
    const enunciado = ['Se sabe que ', v('x', `x ∈ ${I}`), ' y que ', v('E', `E = ${expr}`), '.'];
    const pregunta = ['¿A qué intervalo pertenece ', v('E', 'E'), '?'];
    const Ir = intervalo([pz(a + r, izqCerrado, b + r, !izqCerrado)]).texto;
    const inv = intervalo([pz(fr(1, b + r), !izqCerrado, fr(1, a + r), izqCerrado)]).texto;
    const solucion = [
      [`Se separa la parte entera: E = ${pp} ${m < 0 ? '−' : '+'} ${Math.abs(m)}/(x + ${r}), ${pp === 1 ? `porque ${pol([1, q])} = (x + ${r}) ${m < 0 ? '−' : '+'} ${Math.abs(m)}` : `porque ${pp}(x + ${r}) = ${pol([pp, pp * r])} y ${N(q)} − ${pp * r} = ${N(m)}`}.`],
      ['Como ', v('x', `x ∈ ${I}`), `, x + ${r} ∈ ${Ir}, que es positivo. Al tomar el inverso se da vuelta el orden y también los corchetes: 1/(x + ${r}) ∈ ${inv}.`],
      [`Se multiplica por ${N(m)}${m < 0 ? ' (negativo: el orden y los corchetes se dan vuelta otra vez)' : ''} y se suma ${pp}: `, v('E', `E ∈ ${correcta.texto}`), '.'],
    ];
    const errores = [
      conTexto(hip('corchetes-cambiados', 0, `Los extremos están bien, pero los corchetes no: ${qt(lo)} sale de x = ${decrece ? b : a}, que ${(decrece ? !izqCerrado : izqCerrado) ? 'sí' : 'no'} está en el intervalo de x. Cada corchete va con el extremo de x que lo produce.`),
        intervalo([{ lo, lc: !lc, hi, hc: !hc }])),
      conTexto(hip('todo-cerrado', 0, `Cerraste los dos extremos. Uno de ellos sale de un extremo de x que no está en el intervalo, así que E nunca lo alcanza.`), intervalo([{ lo, lc: true, hi, hc: true }])),
      conTexto(err('olvida-la-parte-entera', 0, `Ese es el intervalo de ${N(m)}/(x + ${r}). Falta sumarle la parte entera, ${pp}.`),
        intervalo([{ lo: fr(lo.n - pp * lo.d, lo.d), lc, hi: fr(hi.n - pp * hi.d, hi.d), hc }])),
      pp * a + q > 0 ? conTexto(err('numerador-y-denominador-por-separado', 0, `Dividiste la cota menor del numerador entre la mayor del denominador, y al revés. Numerador y denominador dependen del mismo x: no toman sus extremos a la vez.`),
        intervalo([{ lo: fr(pp * a + q, b + r), lc: false, hi: fr(pp * b + q, a + r), hc: false }])) : null,
    ];
    return cerrarTexto(rng, semilla, { correcta, errores, variables, enunciado, pregunta, solucion,
      datos: { tipo: 'racional', sub: 'homografica', p: pp, q, r, a, b, izqCerrado } });
  }

  function cuadradoDen(rng, semilla) {
    const c = rng.entero(1, 6), a = -rng.entero(1, 5), b = rng.entero(1, 6);
    if (-a === b) return null;
    const k = c * rng.entero(2, 12);
    const mn = Math.min(a * a, b * b), M = Math.max(a * a, b * b), lejos = a * a > b * b ? a : b;
    const correcta = numero(fr(k, c));
    const variables = { x: { nombre: 'x', color: 'o' }, E: { nombre: 'la expresión E', color: 'd' } };
    const enunciado = ['Se sabe que ', v('x', `x ∈ [${N(a)}; ${b}]`), ' y que ', v('E', `E = ${k}/(x² + ${c})`), '.'];
    const pregunta = ['¿Cuál es el mayor valor que toma ', v('E', 'E'), '?'];
    const solucion = [
      ['Como ', v('x', `${N(a)} ≤ x ≤ ${b}`), ` y el intervalo contiene al 0, x² va desde 0 (en x = 0) hasta ${M} (en x = ${N(lejos)}): x² ∈ [0; ${M}].`],
      [`Entonces x² + ${c} ∈ [${c}; ${M + c}] y, al invertir, E ∈ [${qt(fr(k, M + c))}; ${qt(fr(k, c))}].`],
      ['El mayor valor es ', v('E', correcta.texto), ', en x = 0, donde el denominador es mínimo.'],
    ];
    const mid = fr(a + b, 2);
    const errores = [
      conTexto(err('solo-los-extremos', 0, `Evaluaste solo en x = ${N(a)} y x = ${b}. Pero x² es mínimo en x = 0, que está dentro del intervalo: ahí el denominador es menor y E es mayor.`), numero(fr(k, mn + c))),
      conTexto(ar5('el-menor-valor', 0, `${qt(fr(k, M + c))} es el menor valor de E, en x = ${N(lejos)}. Se pide el mayor.`), numero(fr(k, M + c))),
      conTexto(err('maximo-en-el-centro', 0, `Evaluaste en el centro del intervalo, x = ${qt(mid)}. El mayor valor está donde x² es mínimo, en x = 0.`), numero(fr(k * mid.d * mid.d, mid.n * mid.n + c * mid.d * mid.d))),
      a + c > 0 ? conTexto(err('olvida-el-cuadrado', 0, `Usaste x en vez de x² en el denominador y tomaste el menor x, ${N(a)}. Pero x² no crece con x: es mínimo en x = 0.`), numero(fr(k, a + c))) : null,
    ];
    return cerrarTexto(rng, semilla, { correcta, errores, variables, enunciado, pregunta, solucion,
      datos: { tipo: 'racional', sub: 'cuadrado', k, c, a, b } });
  }

  // ======================= medias =======================
  function medias(rng, semilla) {
    const k = rng.entero(1, 3), ex = rng.elegir([1, 2]), y0 = rng.entero(4, 30);
    const x0 = (k + 2) * y0 / ex;
    if (!Number.isInteger(x0)) return null;
    const A = x0 * y0;
    if (A > 5000 || A < 60) return null;
    const L = 2 * ex * x0;
    const variables = { A: { nombre: 'área del terreno', color: 'o' }, x: { nombre: 'frente', color: 'i' }, y: { nombre: 'costado', color: 'h' }, L: { nombre: 'longitud de cerco', color: 'd' } };
    const enunciado = ['Un agricultor de Chupaca quiere cercar con alambre un terreno rectangular de ', v('A', `${A} m²`), ` y dividirlo en ${k + 1} parcelas con ${k === 1 ? 'un cerco paralelo' : `${k} cercos paralelos`} a los costados del terreno.`,
      ex === 1 ? ' El frente da a un muro de piedra y no necesita cerco.' : ''];
    const pregunta = ['¿Cuál es la menor ', v('L', 'longitud de alambre'), ' que necesita, en metros?'];
    const exT = ex === 1 ? '' : '2';
    const solucion = [
      ['Sean ', v('x', 'x'), ' el frente e ', v('y', 'y'), ' el costado: x·y = ', v('A', A), `. Se cercan ${ex === 2 ? 'el frente y el fondo (2x)' : 'solo el fondo (x)'}, los dos costados y ${k === 1 ? 'el divisorio' : `los ${k} divisorios`} (${k + 2}y): `,
        v('L', `L = ${exT}x + ${k + 2}y`), '.'],
      [`Por la desigualdad de medias, ${exT}x + ${k + 2}y ≥ 2√(${exT}x · ${k + 2}y) = 2√(${ex * (k + 2)} · ${A}) = 2√${ex * (k + 2) * A} = ${L}.`],
      [`La igualdad se da cuando ${exT}x = ${k + 2}y = ${L / 2}: `, v('x', `x = ${x0} m`), ' e ', v('y', `y = ${y0} m`), '. La menor longitud es ', v('L', `${L} m`), '.'],
    ];
    const errores = [
      err('sin-cercos-divisorios', 2 * Math.sqrt(ex * 2 * A), `No contaste ${k === 1 ? 'el cerco divisorio' : 'los cercos divisorios'}: también son alambre, y cada uno mide lo mismo que un costado.`),
      err('lados-sin-ponderar', (ex + 2 + k) * Math.sqrt(A), `Tomaste el terreno cuadrado (x = y). Eso da el mínimo solo cuando x e y pesan igual en L; aquí x pesa ${ex} e y pesa ${k + 2}.`),
      err('medias-sin-el-2', L / 2, 'Olvidaste el 2 de la desigualdad de medias: a + b ≥ 2√(ab).'),
      ...(ex === 1 ? [err('cerca-el-muro', 2 * Math.sqrt(2 * (k + 2) * A), 'Contaste también el frente, que da al muro y no se cerca.')] : []),
      ar5('el-frente', x0, `${x0} m es el frente del terreno óptimo. Se pide la longitud total de alambre.`),
      hip('olvida-los-divisorios-al-sumar', ex * x0 + 2 * y0, `Con las medidas óptimas (${x0} m y ${y0} m) sumaste ${ex === 2 ? 'frente, fondo' : 'el fondo'} y los dos costados, pero no ${k === 1 ? 'el cerco divisorio' : `los ${k} cercos divisorios`}, que también son alambre.`),
      ar5('el-costado', y0, `${y0} m es el costado del terreno óptimo. Se pide la longitud total de alambre.`),
    ];
    return cerrar(rng, semilla, { correcta: L, errores, texto: x => `${N(x)} m`, unidad: 'm', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'medias', A, k, muro: ex === 1 } });
  }

  // ======================= valor-absoluto =======================
  // «8 − 2x» en vez de «−2x + 8» cuando la x va con signo menos.
  function lineal(m, n) {
    if (m < 0 && n > 0) return `${N(n)} − ${Math.abs(m) === 1 ? '' : N(-m)}x`;
    return pol([m, n]);
  }
  function valorAbsoluto(rng, semilla) {
    const sub = rng.moneda() ? 'mismo' : 'opuestos';
    const p = rng.entero(-6, 5), q = p + rng.entero(1, 8), al = rng.entero(1, 3), be = rng.entero(1, 3);
    const A = [al, -al * p || 0];
    const B = sub === 'mismo' ? [be, -be * q || 0] : [-be, be * q || 0];
    const Sm = [A[0] + B[0], A[1] + B[1]];
    if (Sm[0] === 0 && Sm[1] === 0) return null;
    // Orden al azar de los sumandos.
    const swap = rng.moneda();
    const [U, W] = swap ? [B, A] : [A, B]; // a es el primero que se lee
    const variables = { a: { nombre: 'primer sumando', color: 'o' }, b: { nombre: 'segundo sumando', color: 'i' }, C: { nombre: 'conjunto solución', color: 'd' } };
    const enunciado = ['Se tiene la inecuación |', v('a', lineal(...U)), '| + |', v('b', lineal(...W)), Sm[0] === 0 ? `| ≤ ${N(Math.abs(Sm[1]))}.` : `| ≤ |${lineal(...Sm)}|.`];
    const pregunta = ['¿Cuál es su ', v('C', 'conjunto solución'), '?'];
    const fuera = intervalo([pz(null, false, p, true), pz(q, true, null, false)]);
    const dentro = intervalo([pz(p, true, q, true)]);
    const correcta = sub === 'mismo' ? fuera : dentro;
    const solucion = [
      ['Llama ', v('a', `a = ${lineal(...U)}`), ' y ', v('b', `b = ${lineal(...W)}`), `. Su suma es a + b = ${lineal(...Sm)}${Sm[0] === 0 ? `, y ${N(Math.abs(Sm[1]))} = |a + b|` : ''}: la inecuación es |a| + |b| ≤ |a + b|.`],
      ['Siempre se cumple |a + b| ≤ |a| + |b| (desigualdad triangular). Entonces solo puede valer la igualdad, y eso ocurre cuando a y b no tienen signos opuestos: a·b ≥ 0.'],
      [sub === 'mismo' ? `a·b = ${al * be === 1 ? '' : al * be}${factor(p)}${factor(q)} ≥ 0 → x ≤ ${N(p)} o x ≥ ${N(q)}.` : `a·b = ${al * be === 1 ? '' : al * be}${factor(p)}(${N(q)} − x) ≥ 0 → ${factor(p)}${factor(q)} ≤ 0 → ${N(p)} ≤ x ≤ ${N(q)}.`],
      ['C.S. = ', v('C', correcta.texto), '.'],
    ];
    const errores = [
      conTexto(err('signo-del-producto-invertido', 0, `Pediste a·b ≤ 0, signos opuestos. Con signos opuestos |a + b| es menor que |a| + |b|: la desigualdad pedida falla.`), sub === 'mismo' ? dentro : fuera),
      conTexto(hip('extremo-excluido', 0, `Dejaste fuera x = ${N(p)} y x = ${N(q)}. Ahí uno de los dos vale 0 y la igualdad se cumple: a·b ≥ 0 incluye el 0.`),
        sub === 'mismo' ? intervalo([pz(null, false, p, false), pz(q, false, null, false)]) : intervalo([pz(p, false, q, false)])),
      conTexto(err('AL22-suma-de-absolutos', 0, 'Tomaste |a| + |b| = |a + b| para todo x. Eso solo vale cuando a y b tienen el mismo signo (o uno es 0).', 'parcial', FAL), intervalo([pz(null, false, null, false)])),
      conTexto(err('triangular-sin-igualdad', 0, 'La desigualdad triangular dice |a + b| ≤ |a| + |b|, pero la igualdad sí puede darse: cuando a y b tienen el mismo signo.'), intervalo([])),
    ];
    return cerrarTexto(rng, semilla, { correcta, errores, variables, enunciado, pregunta, solucion,
      datos: { tipo: 'valor-absoluto', sub, A, B } });
  }

  // ======================= lineal-entera =======================
  function interseccion(a1, b1, R1, a2, b2, R2) {
    const D = a1 * b2 - a2 * b1;
    if (D === 0) return null;
    return [fr(R1 * b2 - R2 * b1, D), fr(a1 * R2 - a2 * R1, D)];
  }
  const listaPuntos = pts => pts.map(([x, y, o]) => `(${x}; ${y}) da ${o}`).join(', ');

  function ganancia(rng, semilla) {
    const a1 = rng.entero(1, 6), b1 = rng.entero(1, 6), a2 = rng.entero(1, 6), b2 = rng.entero(1, 6);
    const R1 = rng.entero(12, 60), R2 = rng.entero(12, 60), c = 5 * rng.entero(2, 10), d = 5 * rng.entero(2, 10);
    const V = interseccion(a1, b1, R1, a2, b2, R2);
    if (!V) return null;
    const [Vx, Vy] = V, vx = qv(Vx), vy = qv(Vy);
    if (vx <= 0 || vy <= 0 || (Vx.d === 1 && Vy.d === 1)) return null;
    const oV = fr(c * Vx.n * Vy.d + d * Vy.n * Vx.d, Vx.d * Vy.d);
    if (oV.d !== 1) return null;
    const X1 = Math.min(R1 / a1, R2 / a2), Y1 = Math.min(R1 / b1, R2 / b2);
    if (!(oV.n > c * X1 && oV.n > d * Y1)) return null;
    const ok = (x, y) => x >= 0 && y >= 0 && a1 * x + b1 * y <= R1 && a2 * x + b2 * y <= R2;
    let opt = -1, arg = null; const filas = [];
    for (let x = 0; x <= Math.floor(X1); x++) {
      const y = Math.min(Math.floor((R1 - a1 * x) / b1), Math.floor((R2 - a2 * x) / b2));
      const o = c * x + d * y;
      if (o > opt) { opt = o; arg = [x, y]; }
      filas.push([x, y, o]);
    }
    const fx = Math.floor(vx), fy = Math.floor(vy);
    const oF = c * fx + d * fy;
    if (oF >= opt) return null;
    if (filas.length > 12 || filas.length < 3) return null;
    const ejes = Math.max(c * Math.floor(X1), d * Math.floor(Y1));
    const rx = Math.round(vx), ry = Math.round(vy);
    const variables = { x: { nombre: 'chompas', color: 'o' }, y: { nombre: 'chalinas', color: 'i' }, G: { nombre: 'ganancia', color: 'd' } };
    const enunciado = [`Un taller de tejido de Puno hace chompas y chalinas. Cada chompa necesita ${a1} ovillo${a1 > 1 ? 's' : ''} de lana y ${a2} hora${a2 > 1 ? 's' : ''} de trabajo; cada chalina, ${b1} ovillo${b1 > 1 ? 's' : ''} y ${b2} hora${b2 > 1 ? 's' : ''}. Esta semana tienen ${R1} ovillos y ${R2} horas. Cada chompa deja una ganancia de S/ ${c} y cada chalina, S/ ${d}. Solo se venden prendas terminadas.`];
    const pregunta = ['¿Cuál es la mayor ', v('G', 'ganancia'), ' posible en la semana?'];
    const solucion = [
      ['Sean ', v('x', 'x'), ' las chompas e ', v('y', 'y'), ` las chalinas (enteros, no negativos): ${ineqTxt([a1, b1, '≤', R1])} y ${ineqTxt([a2, b2, '≤', R2])}. Se maximiza `, v('G', `G = ${c}x + ${d}y`), '.'],
      [`Las dos rectas se cortan en (${qt(Vx)}; ${qt(Vy)}), donde G valdría ${oV.n}; pero ahí x e y no son enteros, así que ese valor no se puede alcanzar.`],
      [`Para cada x se toma el mayor y entero que cumple las dos condiciones. ${listaPuntos(filas)}. El mejor es (${arg[0]}; ${arg[1]}).`],
      ['La mayor ganancia es ', v('G', `S/ ${opt}`), '.'],
    ];
    const errores = [
      err('PL-vertice-no-entero', oV.n, `S/ ${oV.n} es la ganancia en el vértice (${qt(Vx)}; ${qt(Vy)}), que no tiene coordenadas enteras: no se pueden vender fracciones de prenda.`),
      err('PL-vertice-redondeado', oF, `Redondeaste el vértice hacia abajo, a (${fx}; ${fy}). Ese punto cumple, pero no es el mejor: hay otros puntos enteros con más ganancia.`),
      err('PL-solo-vertices-de-los-ejes', ejes, 'Revisaste solo hacer un tipo de prenda. Mezclando las dos se gana más.'),
      ...(!ok(rx, ry) ? [err('PL-redondeo-al-mas-cercano', c * rx + d * ry, `Redondeaste el vértice al entero más cercano, (${rx}; ${ry}), pero ese punto se pasa de ${[a1 * rx + b1 * ry > R1 ? `los ovillos (usa ${a1 * rx + b1 * ry})` : '', a2 * rx + b2 * ry > R2 ? `las horas (usa ${a2 * rx + b2 * ry})` : ''].filter(Boolean).join(' y de ')}.`)] : []),
    ];
    return cerrar(rng, semilla, { correcta: opt, errores, texto: x => `S/ ${N(x)}`, unidad: 'S/', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'lineal-entera', sub: 'ganancia', a1, b1, a2, b2, R1, R2, c, d } });
  }

  function sobrante(rng, semilla) {
    const u1 = rng.entero(1, 6), v1 = rng.entero(1, 6), u2 = rng.entero(1, 6), v2 = rng.entero(1, 6);
    const R1 = rng.entero(12, 60), R2 = rng.entero(12, 60), ca = rng.entero(4, 30), cb = rng.entero(4, 30);
    const V = interseccion(u1, v1, R1, u2, v2, R2);
    if (!V) return null;
    const [Vx, Vy] = V, vx = qv(Vx), vy = qv(Vy);
    if (vx <= 0 || vy <= 0 || (Vx.d === 1 && Vy.d === 1)) return null;
    const cV = fr(ca * Vx.n * Vy.d + cb * Vy.n * Vx.d, Vx.d * Vy.d);
    if (cV.d !== 1) return null;
    const X1 = Math.max(R1 / u1, R2 / u2), Y1 = Math.max(R1 / v1, R2 / v2);
    if (!(cV.n < ca * X1 && cV.n < cb * Y1)) return null;
    const ok = (x, y) => x >= 0 && y >= 0 && u1 * x + v1 * y >= R1 && u2 * x + v2 * y >= R2;
    let best = Infinity, arg = null; const filas = [];
    for (let x = 0; x <= Math.ceil(X1); x++) {
      const y = Math.max(0, Math.ceil((R1 - u1 * x) / v1), Math.ceil((R2 - u2 * x) / v2));
      const o = ca * x + cb * y;
      if (o < best) { best = o; arg = [x, y]; }
      filas.push([x, y, `S/ ${o}`]);
    }
    const cx = Math.ceil(vx), cy = Math.ceil(vy), cC = ca * cx + cb * cy;
    if (cC <= best) return null;
    if (filas.length > 13 || filas.length < 3) return null;
    const ejes = Math.min(ca * Math.ceil(X1), cb * Math.ceil(Y1));
    const tope = Math.max(cC, ejes, best);
    const Bud = 50 * Math.ceil((tope + 10) / 50);
    const rx = Math.round(vx), ry = Math.round(vy);
    const variables = { x: { nombre: 'cajas A', color: 'o' }, y: { nombre: 'cajas B', color: 'i' }, S: { nombre: 'sobrante', color: 'd' } };
    const enunciado = [`Para un desayuno escolar, el comité de padres compra cajas de dos tipos. Cada caja A trae ${u1} pan${u1 > 1 ? 'es' : ''} y ${u2} fruta${u2 > 1 ? 's' : ''}; cada caja B trae ${v1} pan${v1 > 1 ? 'es' : ''} y ${v2} fruta${v2 > 1 ? 's' : ''}. Se necesitan al menos ${R1} panes y ${R2} frutas. Una caja A cuesta S/ ${ca}, una caja B cuesta S/ ${cb} y el comité tiene S/ ${Bud}. Las cajas no se abren ni se venden por partes.`];
    const pregunta = ['¿Cuál es el mayor ', v('S', 'sobrante'), ' posible?'];
    const solucion = [
      ['Sean ', v('x', 'x'), ' las cajas A e ', v('y', 'y'), ` las B (enteros, no negativos): ${ineqTxt([u1, v1, '≥', R1])} y ${ineqTxt([u2, v2, '≥', R2])}. El mayor sobrante es el menor gasto: se minimiza ${ca}x + ${cb}y.`],
      [`Las dos rectas se cortan en (${qt(Vx)}; ${qt(Vy)}), donde el gasto valdría S/ ${cV.n}; pero ahí x e y no son enteros, así que ese gasto no se puede lograr.`],
      [`Para cada x se toma el menor y entero que cumple las dos condiciones. ${listaPuntos(filas)}. El menor gasto es S/ ${best}, con (${arg[0]}; ${arg[1]}).`],
      [`El mayor sobrante es ${Bud} − ${best} = `, v('S', `S/ ${Bud - best}`), '.'],
    ];
    const errores = [
      err('PL-vertice-no-entero', Bud - cV.n, `Usaste el gasto del vértice (${qt(Vx)}; ${qt(Vy)}), S/ ${cV.n}, que no tiene coordenadas enteras: no se compran fracciones de caja.`),
      err('PL-vertice-redondeado', Bud - cC, `Redondeaste el vértice hacia arriba, a (${cx}; ${cy}). Ese punto cumple, pero hay otros puntos enteros más baratos.`),
      err('PL-solo-vertices-de-los-ejes', Bud - ejes, 'Revisaste solo comprar un tipo de caja. Mezclando los dos tipos se gasta menos.'),
      ...(!ok(rx, ry) ? [err('PL-redondeo-al-mas-cercano', Bud - (ca * rx + cb * ry), `Redondeaste el vértice al entero más cercano, (${rx}; ${ry}), pero así faltan ${[u1 * rx + v1 * ry < R1 ? `panes (solo ${u1 * rx + v1 * ry})` : '', u2 * rx + v2 * ry < R2 ? `frutas (solo ${u2 * rx + v2 * ry})` : ''].filter(Boolean).join(' y ')}.`)] : []),
      err('AR5-el-gasto', best, `S/ ${best} es lo que se gasta. Se pide lo que sobra de los S/ ${Bud}.`, 'hipotesis', FAR),
    ];
    return cerrar(rng, semilla, { correcta: Bud - best, errores, texto: x => `S/ ${N(x)}`, unidad: 'S/', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'lineal-entera', sub: 'sobrante', u1, v1, u2, v2, R1, R2, ca, cb, presupuesto: Bud } });
  }

  return { id: ID, titulo: 'Inecuaciones y desigualdades en problemas', generar, intervalo, pz };
});
